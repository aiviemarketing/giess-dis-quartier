#!/usr/bin/env python3
"""Import MeteoSwiss CPC cells into the existing RADOLAN-compatible tables.

Writes are disabled unless --write is supplied.  The existing frontend divides
radolan_days by ten, so this script defaults to storage in tenths of a mm and
refuses values that would lose precision unless an explicit rounding mode is
selected.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, ROUND_HALF_UP
import json
import os
from pathlib import Path

import psycopg

from .meteo_swiss import CpcError, iter_bbox_cells

DEFAULT_ZURICH_BBOX = (8.48, 47.33, 8.64, 47.45)


def parse_bbox(value: str) -> tuple[float, float, float, float]:
    try:
        west, south, east, north = (float(item) for item in value.split(","))
    except ValueError as error:
        raise argparse.ArgumentTypeError("Bounding box must be west,south,east,north in WGS84") from error
    if not west < east or not south < north:
        raise argparse.ArgumentTypeError("Bounding box must satisfy west < east and south < north")
    return west, south, east, north


def storage_value(value_mm: float, scale: int, rounding: str) -> int:
    scaled = Decimal(str(value_mm)) * Decimal(scale)
    if scaled == scaled.to_integral_value():
        return int(scaled)
    if rounding == "reject":
        raise CpcError(
            f"{value_mm} mm cannot be stored exactly at scale {scale}. "
            "Choose --rounding half-up explicitly, or stop and introduce a compatible precision strategy."
        )
    return int(scaled.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def preflight(connection: psycopg.Connection) -> dict[str, str]:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT c.column_name, pg_catalog.format_type(a.atttypid, a.atttypmod)
            FROM information_schema.columns c
            JOIN pg_catalog.pg_attribute a ON a.attrelid = 'public.radolan_data'::regclass AND a.attname = c.column_name
            WHERE c.table_schema = 'public' AND c.table_name = 'radolan_data' AND c.column_name IN ('geom_id', 'value', 'measured_at')
            ORDER BY c.column_name
            """
        )
        columns = dict(cursor.fetchall())
    expected = {"geom_id", "value", "measured_at"}
    missing = expected - columns.keys()
    if missing:
        raise CpcError(f"radolan_data is missing required columns: {', '.join(sorted(missing))}")
    return columns


def align_geometry_id_sequence(cursor: psycopg.Cursor) -> None:
    """Repair a local seed whose unowned geometry-ID sequence predates its rows."""
    cursor.execute(
        """
        SELECT setval(
            COALESCE(
                pg_get_serial_sequence('public.radolan_geometry', 'id'),
                'public.radolan_geometry_id_seq'
            )::regclass,
            GREATEST(COALESCE((SELECT MAX(id) FROM public.radolan_geometry), 1), 1),
            true
        )
        """
    )


def import_cells(connection: psycopg.Connection, cells: list[dict[str, object]], scale: int, rounding: str, write: bool) -> dict[str, int]:
    summary = {"cells": len(cells), "created_geometries": 0, "inserted_data": 0, "existing_data": 0}
    prepared = [(cell, storage_value(float(cell["value_mm"]), scale, rounding)) for cell in cells]
    if not write:
        return summary
    with connection.transaction():
        with connection.cursor() as cursor:
            align_geometry_id_sequence(cursor)
            for cell, value in prepared:
                geometry = json.dumps(cell["geometry"])
                cursor.execute(
                    """
                    SELECT id FROM public.radolan_geometry
                    WHERE ST_Equals(geometry, ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))
                    LIMIT 1
                    """,
                    (geometry,),
                )
                row = cursor.fetchone()
                if row:
                    geom_id = row[0]
                else:
                    cursor.execute(
                        """
                        INSERT INTO public.radolan_geometry (geometry, centroid)
                        VALUES (
                            ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326),
                            ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))
                        )
                        RETURNING id
                        """,
                        (geometry, geometry),
                    )
                    geom_id = cursor.fetchone()[0]
                    summary["created_geometries"] += 1
                cursor.execute(
                    "SELECT 1 FROM public.radolan_data WHERE geom_id = %s AND measured_at = %s LIMIT 1",
                    (geom_id, cell["timestamp"]),
                )
                if cursor.fetchone():
                    summary["existing_data"] += 1
                    continue
                cursor.execute(
                    "INSERT INTO public.radolan_data (geom_id, value, measured_at) VALUES (%s, %s, %s)",
                    (geom_id, value, cell["timestamp"]),
                )
                summary["inserted_data"] += 1
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=Path, required=True, help="Downloaded CPC HDF5 file")
    parser.add_argument("--dsn", default=os.getenv("DATABASE_URL"), help="PostgreSQL DSN; defaults to DATABASE_URL")
    parser.add_argument("--bbox", type=parse_bbox, default=DEFAULT_ZURICH_BBOX, help="WGS84 west,south,east,north; default is a small Zurich area")
    parser.add_argument(
        "--max-cells",
        type=int,
        default=12,
        help="Maximum valid CPC cells to process; use 0 for every valid cell in the bounding box",
    )
    parser.add_argument("--storage-scale", type=int, default=10, help="Stored integer units per mm; keep 10 for the unchanged GdK frontend")
    parser.add_argument("--rounding", choices=("reject", "half-up"), default="reject", help="How to handle values not exactly representable at --storage-scale")
    parser.add_argument("--write", action="store_true", help="Actually insert data. The default is a dry run.")
    args = parser.parse_args()
    if args.max_cells < 0 or args.storage_scale < 1:
        parser.error("--max-cells must be zero or positive; --storage-scale must be positive")
    cells = []
    for cell in iter_bbox_cells(args.file, *args.bbox):
        cells.append(cell)
        if args.max_cells and len(cells) >= args.max_cells:
            break
    if not cells:
        raise CpcError("No valid CPC cells selected by the bounding box")
    if not args.dsn:
        raise CpcError("Provide --dsn or set DATABASE_URL")
    with psycopg.connect(args.dsn) as connection:
        result = {
            "mode": "write" if args.write else "dry-run",
            "bbox_wgs84": args.bbox,
            "database_columns": preflight(connection),
            "storage_scale": args.storage_scale,
            "rounding": args.rounding,
            "result": import_cells(connection, cells, args.storage_scale, args.rounding, args.write),
        }
    print(json.dumps(result, indent=2, default=str))


if __name__ == "__main__":
    main()
