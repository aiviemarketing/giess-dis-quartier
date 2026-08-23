#!/usr/bin/env python3
"""Aggregate one CPC hour into the unchanged local GdK tree-rain contract.

CPC timestamps are on the hour, whereas the upstream DWD aggregation only
looks for :50 timestamps.  This local-only adapter builds the same integer
hourly array for the cells that contain the explicit CPC timestamp, then
updates only trees covered by those cells.
"""

from __future__ import annotations

import argparse
from datetime import datetime
import json
import os

import psycopg

TREE_STATS_TRIGGERS = (
    "tg_refresh_trees_count_mv",
    "tg_refresh_most_frequent_tree_species_mv",
    "tg_refresh_total_tree_species_count_mv",
)
TREE_STATS_VIEWS = (
    "trees_count",
    "most_frequent_tree_species",
    "total_tree_species_count",
)


def timestamp(value: str) -> datetime:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError as error:
        raise argparse.ArgumentTypeError("--measured-at must be an ISO-8601 timestamp") from error


def validate_schema(connection: psycopg.Connection) -> None:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'trees'
              AND column_name IN ('geom', 'radolan_days', 'radolan_sum')
            """
        )
        columns = {row[0] for row in cursor.fetchall()}
    missing = {"geom", "radolan_days", "radolan_sum"} - columns
    if missing:
        raise RuntimeError(f"trees is missing required columns: {', '.join(sorted(missing))}")


def cell_and_tree_counts(connection: psycopg.Connection, measured_at: datetime) -> dict[str, int]:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                COUNT(DISTINCT geometry.id) AS cells,
                COUNT(DISTINCT trees.id) AS trees
            FROM public.radolan_geometry AS geometry
            JOIN public.radolan_data AS data ON data.geom_id = geometry.id
            LEFT JOIN public.trees AS trees ON ST_CoveredBy(trees.geom, geometry.geometry)
            WHERE data.measured_at = %s
            """,
            (measured_at,),
        )
        cells, trees = cursor.fetchone()
    return {"cells": cells, "trees": trees}


def update_trees(connection: psycopg.Connection, measured_at: datetime, hours: int) -> int:
    # The current hour is at the final array position, matching the existing
    # frontend's reverse-then-slice recent-rain calculation.
    update_query = """
        WITH selected_cells AS (
            SELECT DISTINCT geometry.id, geometry.geometry
            FROM public.radolan_geometry AS geometry
            JOIN public.radolan_data AS data ON data.geom_id = geometry.id
            WHERE data.measured_at = %(measured_at)s
        ), hourly_values AS (
            SELECT
                cell.id,
                cell.geometry,
                ARRAY_AGG(COALESCE(data.value, 0) ORDER BY hour.value) AS days,
                SUM(COALESCE(data.value, 0))::integer AS total
            FROM selected_cells AS cell
            CROSS JOIN LATERAL generate_series(
                %(measured_at)s - (%(hours)s - 1) * INTERVAL '1 hour',
                %(measured_at)s,
                INTERVAL '1 hour'
            ) AS hour(value)
            LEFT JOIN public.radolan_data AS data
                ON data.geom_id = cell.id AND data.measured_at = hour.value
            GROUP BY cell.id, cell.geometry
        )
        UPDATE public.trees AS trees
        SET radolan_days = hourly_values.days, radolan_sum = hourly_values.total
        FROM hourly_values
        WHERE ST_CoveredBy(trees.geom, hourly_values.geometry)
    """
    with connection.transaction():
        with connection.cursor() as cursor:
            for trigger in TREE_STATS_TRIGGERS:
                cursor.execute(f"ALTER TABLE public.trees DISABLE TRIGGER {trigger}")
            cursor.execute(update_query, {"measured_at": measured_at, "hours": hours})
            updated = cursor.rowcount
            for trigger in TREE_STATS_TRIGGERS:
                cursor.execute(f"ALTER TABLE public.trees ENABLE TRIGGER {trigger}")
    with connection.cursor() as cursor:
        for view in TREE_STATS_VIEWS:
            cursor.execute(f"REFRESH MATERIALIZED VIEW public.{view}")
            connection.commit()
    return updated


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--measured-at", required=True, type=timestamp, help="Exact CPC timestamp to aggregate")
    parser.add_argument("--dsn", default=os.getenv("DATABASE_URL"), help="PostgreSQL DSN; defaults to DATABASE_URL")
    parser.add_argument("--hours", type=int, default=30 * 24, help="Hourly history length; default: 720")
    parser.add_argument("--write", action="store_true", help="Actually update covered trees; default is a dry run")
    args = parser.parse_args()
    if not args.dsn:
        parser.error("Provide --dsn or set DATABASE_URL")
    if args.hours < 1:
        parser.error("--hours must be positive")
    with psycopg.connect(args.dsn) as connection:
        validate_schema(connection)
        counts = cell_and_tree_counts(connection, args.measured_at)
        if counts["cells"] == 0:
            raise RuntimeError("No CPC cells exist for --measured-at")
        updated_trees = update_trees(connection, args.measured_at, args.hours) if args.write else 0
    print(
        json.dumps(
            {
                "mode": "write" if args.write else "dry-run",
                "measured_at": args.measured_at.isoformat(),
                "hours": args.hours,
                "cells": counts["cells"],
                "covered_trees": counts["trees"],
                "updated_trees": updated_trees,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
