#!/usr/bin/env python3
"""Download a current or exact-hour MeteoSwiss 60-minute CPC file."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from .meteo_swiss import download_asset, parse_asset_name, select_cpc_asset, stac_item

DEFAULT_DATA_DIR = Path(__file__).resolve().parent / "data"


def parse_timestamp(value: str) -> datetime:
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise argparse.ArgumentTypeError("Timestamp must include a timezone, for example 2026-08-15T14:00:00Z")
    return parsed.astimezone(timezone.utc)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--timestamp", type=parse_timestamp, help="Exact CPC end time in UTC. Defaults to the newest available file today.")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_DATA_DIR, help="Directory for the HDF5 file and manifest.")
    args = parser.parse_args()

    requested = args.timestamp or datetime.now(timezone.utc)
    item = stac_item(requested)
    asset_name, asset = select_cpc_asset(item, args.timestamp)
    output = args.output_dir / asset_name
    bytes_written = download_asset(asset, output)
    asset_time, quality, accumulation_minutes = parse_asset_name(asset_name)
    manifest = {
        "stac_collection": item["collection"],
        "stac_item": item["id"],
        "asset": asset_name,
        "download_url": asset["href"],
        "timestamp": asset_time.isoformat(),
        "quality_code": quality,
        "accumulation_minutes": accumulation_minutes,
        "file": str(output),
        "file_size_bytes": bytes_written,
        "asset_created": asset.get("created"),
        "asset_updated": asset.get("updated"),
    }
    manifest_path = output.with_suffix(".json")
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
