"""Fast, offline checks for the metadata-driven CPC helpers."""

from __future__ import annotations

from datetime import datetime, timezone
import tempfile
from pathlib import Path
import unittest

import h5py
import numpy as np
from pyproj import Transformer

from gdq.cpc.meteo_swiss import iter_bbox_cells, lookup, parse_asset_name, select_cpc_asset


class CpcTests(unittest.TestCase):
    def setUp(self) -> None:
        self.directory = tempfile.TemporaryDirectory()
        self.path = Path(self.directory.name) / "sample.h5"
        with h5py.File(self.path, "w") as file:
            file.attrs["Conventions"] = "ODIM_H5/V2_4"
            where = file.create_group("where")
            where.attrs.update({"LL_lon": 7.438_844, "LL_lat": 46.952_401, "xscale": 1000.0, "yscale": 1000.0, "xsize": 3, "ysize": 3, "projdef": "EPSG:2056"})
            dataset = file.create_group("dataset1")
            dataset_what = dataset.create_group("what")
            dataset_what.attrs.update({"enddate": "20260815", "endtime": "060000"})
            data_group = dataset.create_group("data1")
            data_group.create_dataset("data", data=np.array([[1.2, np.nan, 0.0], [2.5, 3.4, 0.1], [0.0, 0.0, 0.0]]))
            data_what = data_group.create_group("what")
            data_what.attrs.update({"gain": 1.0, "offset": 0.0, "nodata": np.nan, "undetect": np.inf, "quantity": "ACRR"})

    def tearDown(self) -> None:
        self.directory.cleanup()

    def test_asset_name_includes_utc_time_and_quality(self) -> None:
        timestamp, quality, duration = parse_asset_name("cpc2622706009_00060.001.h5")
        self.assertEqual(timestamp, datetime(2026, 8, 15, 6, tzinfo=timezone.utc))
        self.assertEqual(quality, 9)
        self.assertEqual(duration, 60)

    def test_selects_highest_quality_for_an_exact_timestamp(self) -> None:
        item = {"id": "test", "assets": {"cpc2622706000_00060.001.h5": {"href": "low"}, "cpc2622706009_00060.001.h5": {"href": "high"}}}
        name, asset = select_cpc_asset(item, datetime(2026, 8, 15, 6, tzinfo=timezone.utc))
        self.assertEqual(name, "cpc2622706009_00060.001.h5")
        self.assertEqual(asset["href"], "high")

    def test_lookup_maps_wgs84_to_expected_cell(self) -> None:
        longitude, latitude = Transformer.from_crs(2056, 4326, always_xy=True).transform(2_600_500, 1_200_500)
        result = lookup(self.path, latitude, longitude)
        self.assertEqual(result["grid_cell"]["row"], 2)
        self.assertEqual(result["grid_cell"]["column"], 0)
        self.assertEqual(result["precipitation_mm"], 0.0)

    def test_bbox_omits_nodata(self) -> None:
        cells = list(iter_bbox_cells(self.path, 7.42, 46.93, 7.47, 46.98))
        self.assertEqual(len(cells), 8)


if __name__ == "__main__":
    unittest.main()
