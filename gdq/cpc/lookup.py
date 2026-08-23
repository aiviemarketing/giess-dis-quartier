#!/usr/bin/env python3
"""Look up a CPC 60-minute precipitation total at a WGS84 position."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .meteo_swiss import lookup


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lat", type=float, required=True, help="WGS84 latitude")
    parser.add_argument("--lng", type=float, required=True, help="WGS84 longitude")
    parser.add_argument("--file", type=Path, required=True, help="Downloaded CPC HDF5 file")
    args = parser.parse_args()
    print(json.dumps(lookup(args.file, args.lat, args.lng), indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
