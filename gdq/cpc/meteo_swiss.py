"""Shared, metadata-driven helpers for the MeteoSwiss CPC spike.

The code deliberately reads georeferencing, scaling, NoData and timestamps from
each ODIM HDF5 file.  It does not encode product-specific scale assumptions.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import math
from pathlib import Path
import re
from typing import Any, Iterator

import h5py
import numpy as np
from pyproj import CRS, Transformer
import requests

STAC_COLLECTION = "ch.meteoschweiz.ogd-radar-precip"
STAC_BASE_URL = "https://data.geo.admin.ch/api/stac/v1"
DATASET_PATH = "dataset1/data1/data"
CPC_ASSET_RE = re.compile(
    r"^cpc(?P<year>\d{2})(?P<day>\d{3})(?P<hour>\d{2})(?P<minute>\d{2})(?P<quality>\d)_(?P<minutes>\d{5})\..+\.h5$",
    re.IGNORECASE,
)


class CpcError(RuntimeError):
    """Raised for an invalid CPC file or STAC response."""


def _json_value(value: Any) -> Any:
    """Return an HDF5 metadata value that can safely be emitted as JSON."""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    if isinstance(value, np.generic):
        return _json_value(value.item())
    if isinstance(value, np.ndarray):
        return [_json_value(item) for item in value.tolist()]
    if isinstance(value, float) and math.isnan(value):
        return "NaN"
    if isinstance(value, float) and math.isinf(value):
        return "Infinity" if value > 0 else "-Infinity"
    return value


def attributes(hdf_object: h5py.Group | h5py.Dataset) -> dict[str, Any]:
    return {key: _json_value(value) for key, value in hdf_object.attrs.items()}


def parse_asset_name(asset_name: str) -> tuple[datetime, int, int]:
    """Parse CPC's UTC end timestamp, quality code and accumulation duration."""
    match = CPC_ASSET_RE.match(asset_name)
    if not match:
        raise CpcError(f"Not a CPC HDF5 asset name: {asset_name}")
    groups = match.groupdict()
    timestamp = datetime.strptime(
        f"20{groups['year']}{groups['day']}{groups['hour']}{groups['minute']}",
        "%Y%j%H%M",
    ).replace(tzinfo=timezone.utc)
    return timestamp, int(groups["quality"]), int(groups["minutes"])


def stac_item_id(timestamp: datetime) -> str:
    return f"{timestamp.astimezone(timezone.utc):%Y%m%d}-ch"


def stac_item(timestamp: datetime, session: requests.Session | None = None) -> dict[str, Any]:
    session = session or requests.Session()
    url = f"{STAC_BASE_URL}/collections/{STAC_COLLECTION}/items/{stac_item_id(timestamp)}"
    response = session.get(url, timeout=30)
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload.get("assets"), dict):
        raise CpcError(f"STAC item has no assets: {url}")
    return payload


def select_cpc_asset(item: dict[str, Any], timestamp: datetime | None = None) -> tuple[str, dict[str, Any]]:
    """Select the latest asset, or the highest-quality asset at an exact UTC time."""
    candidates: list[tuple[datetime, int, str, dict[str, Any]]] = []
    for name, asset in item["assets"].items():
        try:
            asset_time, quality, duration = parse_asset_name(name)
        except CpcError:
            continue
        if duration != 60:
            continue
        if timestamp and asset_time != timestamp.astimezone(timezone.utc):
            continue
        candidates.append((asset_time, quality, name, asset))
    if not candidates:
        requested = timestamp.astimezone(timezone.utc).isoformat() if timestamp else "latest"
        raise CpcError(f"No 60-minute CPC asset found for {requested} in {item.get('id')}")
    _, _, name, asset = max(candidates, key=lambda candidate: (candidate[0], candidate[1]))
    return name, asset


def download_asset(asset: dict[str, Any], destination: Path, session: requests.Session | None = None) -> int:
    session = session or requests.Session()
    href = asset.get("href")
    if not href:
        raise CpcError("STAC asset does not contain an href")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with session.get(href, stream=True, timeout=90) as response:
        response.raise_for_status()
        with destination.open("wb") as file:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    file.write(chunk)
    return destination.stat().st_size


@dataclass(frozen=True)
class Grid:
    """A regular CPC grid whose origin is its lower-left outer edge."""

    crs: CRS
    projection: str
    origin_x: float
    origin_y: float
    xscale: float
    yscale: float
    xsize: int
    ysize: int

    @property
    def upper_y(self) -> float:
        return self.origin_y + self.ysize * self.yscale

    def row_col(self, x: float, y: float) -> tuple[int, int]:
        """Return the nearest CPC cell for a point in the source CRS."""
        column = math.floor((x - self.origin_x) / self.xscale)
        row = math.floor((self.upper_y - y) / self.yscale)
        if not (0 <= row < self.ysize and 0 <= column < self.xsize):
            raise CpcError(f"Point ({x:.3f}, {y:.3f}) lies outside the CPC grid")
        return row, column

    def centre(self, row: int, column: int) -> tuple[float, float]:
        return self.origin_x + (column + 0.5) * self.xscale, self.upper_y - (row + 0.5) * self.yscale

    def cell_corners(self, row: int, column: int) -> list[tuple[float, float]]:
        x, y = self.centre(row, column)
        half_x, half_y = self.xscale / 2, self.yscale / 2
        return [(x - half_x, y - half_y), (x + half_x, y - half_y), (x + half_x, y + half_y), (x - half_x, y + half_y)]

    def extent(self) -> dict[str, float]:
        return {
            "left_cell_centre": self.origin_x + self.xscale / 2,
            "right_cell_centre": self.origin_x + (self.xsize - 0.5) * self.xscale,
            "bottom_cell_centre": self.origin_y + self.yscale / 2,
            "top_cell_centre": self.upper_y - self.yscale / 2,
            "left_edge": self.origin_x,
            "right_edge": self.origin_x + self.xsize * self.xscale,
            "bottom_edge": self.origin_y,
            "top_edge": self.upper_y,
        }


def _source_crs(where: dict[str, Any]) -> tuple[CRS, str]:
    projection = where.get("projdef")
    if not projection:
        raise CpcError("CPC /where metadata has no projdef")
    try:
        return CRS.from_user_input(projection), projection
    except Exception as error:  # pyproj error types differ between versions
        raise CpcError(f"Cannot parse CPC projection: {projection}") from error


def grid_from_hdf(file: h5py.File) -> Grid:
    where = attributes(file["where"])
    crs, projection = _source_crs(where)
    required = ("LL_lon", "LL_lat", "xscale", "yscale", "xsize", "ysize")
    missing = [key for key in required if key not in where]
    if missing:
        raise CpcError(f"CPC /where metadata misses: {', '.join(missing)}")
    to_source = Transformer.from_crs("EPSG:4326", crs, always_xy=True)
    origin_x, origin_y = to_source.transform(float(where["LL_lon"]), float(where["LL_lat"]))
    return Grid(
        crs=crs,
        projection=projection,
        origin_x=round(origin_x),
        origin_y=round(origin_y),
        xscale=float(where["xscale"]),
        yscale=float(where["yscale"]),
        xsize=int(where["xsize"]),
        ysize=int(where["ysize"]),
    )


def data_metadata(file: h5py.File) -> dict[str, Any]:
    try:
        return attributes(file[f"{DATASET_PATH.rsplit('/', 1)[0]}/what"])
    except KeyError as error:
        raise CpcError(f"CPC metadata group is missing for {DATASET_PATH}") from error


def precipitation_values(file: h5py.File) -> np.ndarray:
    """Read and scale the precipitation array using the file's own metadata."""
    if DATASET_PATH not in file:
        raise CpcError(f"CPC data set is missing: {DATASET_PATH}")
    metadata = data_metadata(file)
    try:
        gain, offset = float(metadata["gain"]), float(metadata["offset"])
    except KeyError as error:
        raise CpcError("CPC data metadata has no gain/offset") from error
    raw = np.asarray(file[DATASET_PATH][()], dtype=float)
    values = raw * gain + offset
    nodata = metadata.get("nodata")
    undetect = metadata.get("undetect")
    if nodata is not None:
        if isinstance(nodata, float) and math.isnan(nodata):
            values[np.isnan(raw)] = np.nan
        else:
            values[raw == float(nodata)] = np.nan
    if undetect is not None and math.isfinite(float(undetect)):
        values[raw == float(undetect)] = 0.0
    return values


def file_timestamp(file: h5py.File) -> datetime:
    what = attributes(file["dataset1/what"])
    try:
        return datetime.strptime(f"{what['enddate']}{what['endtime']}", "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)
    except KeyError as error:
        raise CpcError("CPC dataset metadata has no end date/time") from error


def inspect_file(path: Path) -> dict[str, Any]:
    with h5py.File(path, "r") as file:
        grid = grid_from_hdf(file)
        values = precipitation_values(file)
        valid = values[np.isfinite(values)]
        if not valid.size:
            raise CpcError("CPC file has no valid precipitation cells")
        groups: list[str] = []
        datasets: list[dict[str, Any]] = []

        def visitor(name: str, hdf_object: h5py.Group | h5py.Dataset) -> None:
            if isinstance(hdf_object, h5py.Group):
                groups.append(name)
            else:
                datasets.append({"path": name, "shape": list(hdf_object.shape), "dtype": str(hdf_object.dtype), "attributes": attributes(hdf_object)})

        file.visititems(visitor)
        metadata = data_metadata(file)
        return {
            "file": str(path),
            "format": attributes(file).get("Conventions"),
            "timestamp": file_timestamp(file).isoformat(),
            "groups": groups,
            "datasets": datasets,
            "data": {
                "path": DATASET_PATH,
                "shape": list(values.shape),
                "dtype": str(file[DATASET_PATH].dtype),
                "valid_min": float(valid.min()),
                "valid_max": float(valid.max()),
                "valid_count": int(valid.size),
                "nodata_count": int(np.isnan(values).sum()),
                "quantity": metadata.get("quantity"),
                "gain": metadata.get("gain"),
                "offset": metadata.get("offset"),
                "nodata": metadata.get("nodata"),
                "undetect": metadata.get("undetect"),
            },
            "projection": {"projdef": grid.projection, "epsg": grid.crs.to_epsg(), "pixel_size_m": [grid.xscale, grid.yscale], "extent": grid.extent()},
            "root_metadata": attributes(file),
            "dataset_metadata": attributes(file["dataset1/what"]),
            "data_metadata": metadata,
        }


def lookup(path: Path, latitude: float, longitude: float) -> dict[str, Any]:
    with h5py.File(path, "r") as file:
        grid = grid_from_hdf(file)
        to_source = Transformer.from_crs("EPSG:4326", grid.crs, always_xy=True)
        x, y = to_source.transform(longitude, latitude)
        row, column = grid.row_col(x, y)
        value = precipitation_values(file)[row, column]
        to_wgs84 = Transformer.from_crs(grid.crs, "EPSG:4326", always_xy=True)
        corners = [to_wgs84.transform(x_value, y_value) for x_value, y_value in grid.cell_corners(row, column)]
        return {
            "timestamp": file_timestamp(file).isoformat(),
            "position": {"latitude": latitude, "longitude": longitude, "source_x": x, "source_y": y},
            "grid_cell": {"row": row, "column": column, "centre_source": grid.centre(row, column), "polygon_wgs84": [[lon, lat] for lon, lat in corners + [corners[0]]]},
            "precipitation_mm": None if not math.isfinite(float(value)) else float(value),
            "is_nodata": not math.isfinite(float(value)),
            "data_metadata": data_metadata(file),
        }


def iter_bbox_cells(path: Path, west: float, south: float, east: float, north: float) -> Iterator[dict[str, Any]]:
    """Yield all cells whose centres lie inside a WGS84 bounding box."""
    with h5py.File(path, "r") as file:
        grid = grid_from_hdf(file)
        to_source = Transformer.from_crs("EPSG:4326", grid.crs, always_xy=True)
        projected = [to_source.transform(lon, lat) for lon, lat in ((west, south), (west, north), (east, south), (east, north))]
        xs, ys = zip(*projected)
        first_column = max(0, math.floor((min(xs) - grid.origin_x) / grid.xscale))
        last_column = min(grid.xsize - 1, math.floor((max(xs) - grid.origin_x) / grid.xscale))
        first_row = max(0, math.floor((grid.upper_y - max(ys)) / grid.yscale))
        last_row = min(grid.ysize - 1, math.floor((grid.upper_y - min(ys)) / grid.yscale))
        if first_row > last_row or first_column > last_column:
            return
        values = precipitation_values(file)
        timestamp = file_timestamp(file)
        to_wgs84 = Transformer.from_crs(grid.crs, "EPSG:4326", always_xy=True)
        for row in range(first_row, last_row + 1):
            for column in range(first_column, last_column + 1):
                value = float(values[row, column])
                if not math.isfinite(value):
                    continue
                corners = [to_wgs84.transform(x_value, y_value) for x_value, y_value in grid.cell_corners(row, column)]
                yield {
                    "row": row,
                    "column": column,
                    "timestamp": timestamp,
                    "value_mm": value,
                    "geometry": {"type": "Polygon", "coordinates": [[[lon, lat] for lon, lat in corners + [corners[0]]]]},
                }


def as_json(value: Any) -> Any:
    """Compatibility helper for dataclasses used by callers."""
    return asdict(value) if hasattr(value, "__dataclass_fields__") else value
