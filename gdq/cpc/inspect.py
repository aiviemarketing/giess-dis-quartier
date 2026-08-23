#!/usr/bin/env python3
"""Print HDF5 structure, metadata, scale, NoData and georeferencing for CPC."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .meteo_swiss import inspect_file


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=Path, help="Downloaded CPC HDF5 file")
    args = parser.parse_args()
    print(json.dumps(inspect_file(args.file), indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
