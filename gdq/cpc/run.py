#!/usr/bin/env python3
"""Run MeteoSwiss CPC hours through the local Zürich import and aggregation.

This is intentionally a manual local-MVP runner.  It downloads one current
or exact CPC asset, imports every valid cell in the configured Zürich bounding
box, then updates the existing ``radolan_*`` fields for the covered trees.
``--hours`` is a manual, bounded backfill—not a scheduler—and the runner never
modifies the weather repository.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import os
from pathlib import Path
import subprocess
import sys

import h5py

from .meteo_swiss import CpcError, download_asset, file_timestamp, select_cpc_asset, stac_item

DEFAULT_ZURICH_BBOX = "8.48,47.33,8.64,47.45"
DEFAULT_DATA_DIR = Path(__file__).resolve().parent / "data"


def parse_timestamp(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise argparse.ArgumentTypeError("Timestamp must include a timezone, for example 2026-08-15T14:00:00Z")
    return parsed.astimezone(timezone.utc)


def command(module: str, *arguments: str) -> list[str]:
    return [sys.executable, "-m", f"{__package__}.{module}", *arguments]


def hourly_timestamps(end: datetime, hours: int) -> list[datetime]:
    """Return a chronological hourly range ending at ``end``."""
    if hours < 1:
        raise ValueError("hours must be positive")
    return [end - timedelta(hours=offset) for offset in range(hours - 1, -1, -1)]


def download_hour(timestamp: datetime, data_dir: Path) -> tuple[Path, datetime, int]:
    """Download the best 60-minute CPC asset for one exact end timestamp."""
    item = stac_item(timestamp)
    name, asset = select_cpc_asset(item, timestamp)
    file = data_dir / name
    bytes_written = download_asset(asset, file)
    with h5py.File(file) as hdf:
        measured_at = file_timestamp(hdf)
    return file, measured_at, bytes_written


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--timestamp", type=parse_timestamp, help="Exact CPC end time in UTC; default: newest available")
    parser.add_argument("--dsn", default=os.getenv("DATABASE_URL"), help="PostgreSQL DSN; default: DATABASE_URL")
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR, help="Directory for downloaded CPC HDF5 files")
    parser.add_argument("--bbox", default=DEFAULT_ZURICH_BBOX, help="WGS84 west,south,east,north; default: Zürich area")
    parser.add_argument(
        "--hours",
        type=int,
        default=1,
        help="Consecutive hourly CPC assets ending at the selected/newest one; default: 1",
    )
    parser.add_argument("--rounding", choices=("reject", "half-up"), default="reject", help="CPC precision handling; default: reject")
    parser.add_argument("--write", action="store_true", help="Import and aggregate; default: inspect the proposed import only")
    args = parser.parse_args()
    if not args.dsn:
        parser.error("Provide --dsn or set DATABASE_URL")
    if args.hours < 1:
        parser.error("--hours must be positive")

    requested = args.timestamp or datetime.now(timezone.utc)
    item = stac_item(requested)
    latest_name, latest_asset = select_cpc_asset(item, args.timestamp)
    latest_file = args.data_dir / latest_name
    bytes_written = download_asset(latest_asset, latest_file)
    with h5py.File(latest_file) as hdf:
        latest_at = file_timestamp(hdf)

    timestamps = hourly_timestamps(latest_at, args.hours)
    child_environment = {**os.environ, "DATABASE_URL": args.dsn}
    imported_files: list[Path] = []
    for index, timestamp in enumerate(timestamps, start=1):
        if timestamp == latest_at:
            file = latest_file
        else:
            file, measured_at, downloaded_bytes = download_hour(timestamp, args.data_dir)
            if measured_at != timestamp:
                raise CpcError(f"Downloaded CPC timestamp {measured_at.isoformat()} does not match {timestamp.isoformat()}")
            bytes_written += downloaded_bytes
        print(f"[{index}/{len(timestamps)}] Importing CPC hour ending {timestamp.isoformat()}")
        import_command = command(
            "ingest",
            "--file",
            str(file),
            "--bbox",
            args.bbox,
            "--max-cells",
            "0",
            "--rounding",
            args.rounding,
        )
        if args.write:
            import_command.append("--write")
        subprocess.run(import_command, check=True, env=child_environment)
        imported_files.append(file)

    if not args.write:
        print(f"Downloaded {len(imported_files)} CPC file(s) ({bytes_written} bytes); no database rows were written.")
        print("Re-run with --write after reviewing the proposed full-Zürich import.")
        return

    subprocess.run(
        command(
            "aggregate",
            "--measured-at",
            latest_at.isoformat(),
            "--write",
        ),
        check=True,
        env=child_environment,
    )
    print(f"Imported {len(imported_files)} CPC hour(s) and aggregated through {latest_at.isoformat()}.")


if __name__ == "__main__":
    try:
        main()
    except CpcError as error:
        raise SystemExit(f"CPC error: {error}") from error
