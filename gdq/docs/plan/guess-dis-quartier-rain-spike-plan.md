# Güss dis Quartier — MeteoSwiss CPC integration

Status: 15 August 2026

## Goal

This document records the design and validation of the local **MeteoSwiss
CombiPrecip (CPC)** integration. It feeds the existing Gieß den Kiez rain-data
model without a frontend change.

```text
MeteoSwiss CPC → CPC adapter / harvester → existing GdK data model
                → trees.radolan_sum / trees.radolan_days → existing frontend
```

The integration deliberately does not add a new frontend rain algorithm,
production scheduler, Mapbox upload, or monitoring system.

## Source decision

The recommended source is MeteoSwiss CombiPrecip (CPC). It combines Swiss radar
estimates with rain-gauge observations and reports precipitation accumulations
at ground level. It is a better city-wide source than one Zurich station because
summer storms can differ substantially across the city.

The currently verified official source is the MeteoSwiss STAC collection
`ch.meteoschweiz.ogd-radar-precip`.

| Property                   | Verified value                                                                    |
| -------------------------- | --------------------------------------------------------------------------------- |
| Product                    | CPC / CombiPrecip 60-minute total                                                 |
| Unit                       | mm (equivalent to l/m²)                                                           |
| Nominal spatial resolution | 1 km × 1 km                                                                       |
| Delivery                   | current rolling total every five minutes; hourly reanalysis after eight days      |
| Projection                 | file-declared Swiss oblique Mercator; MeteoSwiss documents Swiss LV95 / EPSG:2056 |
| STAC availability          | rolling last 14 days                                                              |
| Product archive            | CPC exists from 2005; archive access is separate from STAC retention              |
| Licence                    | CC BY; cite MeteoSwiss when reproducing or redistributing                         |

## Existing Gieß den Kiez contract

The upstream DWD harvester follows this flow:

```text
DWD RADOLAN → hourly raster → target-area grid → radolan_data
           → 30-day aggregation → trees.radolan_sum / trees.radolan_days
```

For the MVP, the database names remain unchanged:

```text
radolan_geometry
radolan_data
radolan_harvester
radolan_sum
radolan_days
```

The unchanged frontend interprets stored hourly rain values as **integer tenths
of a millimetre**: it calculates `sum(radolan_days) / 10`. This is the important
compatibility constraint for CPC, which can contain values in hundredths of a
millimetre.

## Implemented local integration

The runnable implementation is the [`gdq.cpc` package](../../cpc/README.md):

```text
gdq/cpc/
├── download.py
├── inspect.py
├── lookup.py
├── ingest.py
├── aggregate.py
├── meteo_swiss.py
├── run.py
├── requirements.txt
├── tests/
└── README.md
```

### Download and STAC selection

`python -m gdq.cpc.download` queries the official daily STAC item, selects either the
newest CPC asset or the highest-quality asset for an exact UTC end time, and
writes an auditable JSON manifest beside the HDF5 file. The filename parser
verifies the format:

```text
cpcYYJJJHHMMQ_00060.001.h5
```

`Q` is the quality code and `_00060` is the 60-minute accumulation.

### HDF5 inspection

`python -m gdq.cpc.inspect` prints the HDF5 groups and datasets, shape, type, valid range,
NoData count, product timestamps, gain, offset, quantity, projection, cell
size, and extent. The first live file inspected for this spike had:

```text
Format:                ODIM_H5/V2_4
Data set:              dataset1/data1/data
Shape:                 640 × 710
Quantity:              ACRR
Gain / offset:         1.0 / 0.0
NoData:                NaN
Undetect:              Infinity
Cell size:             1000 m × 1000 m
```

The script always uses gain/offset and NoData from the file; it does not
hard-code a CPC scale factor.

### WGS84 point lookup

`python -m gdq.cpc.lookup` transforms a tree's WGS84 longitude/latitude using
the file-declared projection, maps it to a raster row and column, and prints the
chosen 1 km cell polygon in WGS84. Validate at least Zurich centre, Altstetten,
Oerlikon and Witikon.

### Small Zurich database import

`gdq.cpc.ingest` converts valid CPC cells in the configured Zürich bounding box
to WGS84 PostGIS polygons and writes them to `radolan_geometry` and
`radolan_data`. It is dry-run by default and only writes with `--write`.

The Postgres API checkout contains migration
`20260815090000_make_radolan_hourly_data_idempotent.sql`. It upgrades
`radolan_data.geom_id` to `integer` and adds a unique `(geom_id, measured_at)`
index, allowing the eight-day CPC reanalysis to replace a provisional value.

`gdq.cpc.aggregate` bridges the timestamp difference between DWD and CPC while
retaining the existing `radolan_days` and `radolan_sum` frontend contract.

### Precision decision gate

The importer defaults to `--storage-scale 10`, matching the existing frontend.
It rejects a CPC value that cannot be represented as an exact tenth of a
millimetre. Lossy rounding is available only with `--rounding half-up`.

This prevents a silent ten-fold frontend error that would result from storing
hundredths while retaining the existing `/ 10` display contract. A production
implementation must explicitly choose between documented tenths-mm rounding and
a coordinated database/API/frontend precision migration.

## Run order

```bash
python3 -m venv gdq/cpc/.venv
gdq/cpc/.venv/bin/pip install -r gdq/cpc/requirements.txt
export DATABASE_URL='postgresql://postgres:postgres@localhost:54322/postgres'

# Find and download an official file.
gdq/cpc/.venv/bin/python -m gdq.cpc.download

# Verify the data structure and metadata.
gdq/cpc/.venv/bin/python -m gdq.cpc.inspect gdq/cpc/data/cpc*.h5

# Inspect one Zurich location.
gdq/cpc/.venv/bin/python -m gdq.cpc.lookup \
  --lat 47.3769 --lng 8.5417 --file gdq/cpc/data/cpc*.h5

# Inspect the complete local workflow without writing.
gdq/cpc/.venv/bin/python -m gdq.cpc --hours 336 --rounding half-up
```

After review, write the available 14-day local backfill:

```bash
gdq/cpc/.venv/bin/python -m gdq.cpc \
  --hours 336 --write --rounding half-up
```

Then inspect Zürich trees:

```sql
SELECT id, lat, lng, radolan_sum, radolan_days
FROM trees
WHERE id IN ('tree-id-1', 'tree-id-2', 'tree-id-3');
```

No weather-repository code is modified by this local CPC integration.

## Acceptance criteria

- [x] CPC file can be automatically found through STAC.
- [x] CPC file can be automatically downloaded.
- [x] ODIM HDF5 structure is inspected by code.
- [x] Scale, NoData, timestamp and projection come from HDF5 metadata.
- [x] WGS84 positions are transformed and mapped to CPC pixels.
- [x] A Zurich grid subset can be generated.
- [x] A guarded PostGIS import to `radolan_geometry` / `radolan_data` is implemented.
- [x] Existing aggregation accepts both RADOLAN and CPC hour timestamps.
- [x] CPC reanalysis writes are idempotent.
- [x] No frontend code change is included.
- [ ] Compare dry and rainy CPC hours against a nearby station using the same time window.
- [x] Execute the import against the local project Supabase/PostGIS database.
- [x] Populate `trees.radolan_sum` and `trees.radolan_days` for actual Zurich trees.
- [ ] Make the explicit production precision decision.

## Stop and reassess if

- official STAC access or licence changes;
- a live file no longer supplies usable precipitation or georeferencing metadata;
- station comparisons show an implausible time or magnitude mismatch; or
- the upstream aggregation cannot work with CPC cells.

Potential alternatives are MeteoSwiss PRECIP-ACCU, MeteoSwiss station data, or
a new backend aggregation that still preserves the frontend output contract.

## Sources

- [MeteoSwiss precipitation radar products](https://opendatadocs.meteoswiss.ch/d-radar-data/d1-precipitation-radar-products)
- [MeteoSwiss CPC product description](https://www.meteoswiss.admin.ch/services-and-publications/service/weather-and-climate-products/combiprecip.html)
- [Official MeteoSwiss STAC collection](https://data.geo.admin.ch/api/stac/v1/collections/ch.meteoschweiz.ogd-radar-precip)
- [Gieß den Kiez DWD harvester](https://github.com/technologiestiftung/giessdenkiez-de-dwd-harvester)
