# MeteoSwiss CombiPrecip (CPC) local integration

This package connects official MeteoSwiss 60-minute CombiPrecip data to the
unchanged Gieß den Kiez rain-data contract:

```text
MeteoSwiss CPC → radolan_geometry / radolan_data
               → trees.radolan_days / trees.radolan_sum
               → existing frontend
```

It deliberately retains the upstream `radolan_*` table and field names, so
the existing frontend needs no CPC-specific code. The package is local-MVP
code: it has no scheduler, cursor, retention policy, monitoring, or Mapbox
refresh.

## Setup

From the frontend repository root:

```bash
python3 -m venv gdq/cpc/.venv
gdq/cpc/.venv/bin/pip install -r gdq/cpc/requirements.txt
export DATABASE_URL='postgresql://postgres:postgres@localhost:54322/postgres'
```

For the production import, use the Giess dis Quartier 1Password references:

- Supabase connection configuration: `tczeojcwase2ggjcuth3iid5ia`
- Database password: `sh5yhymlow6kecum27cathiyza`

Build `DATABASE_URL` only in the shell that runs the importer; do not add it
to a frontend `VITE_*` variable or commit it to an `.env` file.

The database must already have the local Supabase schema, the RADOLAN
compatibility migrations, and Zürich trees.

## Import the rain data

> CPC is MeteoSwiss CombiPrecip: an hourly precipitation dataset for Switzerland.

Inspect one latest CPC hour without writing:

```bash
gdq/cpc/.venv/bin/python -m gdq.cpc
```

Write and aggregate one latest hour for all valid cells in the configured
Zürich bounding box:

```bash
gdq/cpc/.venv/bin/python -m gdq.cpc --write --rounding half-up
```

Backfill the 14-day STAC window in chronological order, then aggregate once
at the newest hour:

```bash
gdq/cpc/.venv/bin/python -m gdq.cpc --hours 336 --write --rounding half-up
```

The importer is idempotent. Re-run the same command if an interrupted
backfill needs to continue. 

The official STAC catalogue exposes the most recent 14 days; the frontend still has a 30-day window, so hours outside that
range remain zero until archive retrieval is explicitly added.

## Storage precision

The unchanged frontend divides the integer `radolan_days` values by ten. CPC
can contain finer precision, so `--rounding half-up` is an explicit local-MVP
choice when persisting non-representable values. The default `reject` mode
prevents a silent loss of precision.

## Development commands

Download an exact asset, inspect it, or look up a grid value:

```bash
gdq/cpc/.venv/bin/python -m gdq.cpc.download --timestamp 2026-08-15T11:00:00Z
gdq/cpc/.venv/bin/python -m gdq.cpc.inspect gdq/cpc/data/cpc*.h5
gdq/cpc/.venv/bin/python -m gdq.cpc.lookup --lat 47.3769 --lng 8.5417 --file gdq/cpc/data/cpc*.h5
```

Run all offline tests from the repository root:

```bash
gdq/cpc/.venv/bin/python -m unittest discover -s gdq/cpc/tests -t . -v
```

## Data source

MeteoSwiss publishes CPC as 60-minute precipitation accumulations in ODIM
HDF5. The implementation reads each file's scale, NoData value, projection,
and timestamp from metadata. Cite MeteoSwiss when reproducing or
redistributing its data: [precipitation radar products](https://opendatadocs.meteoswiss.ch/d-radar-data/d1-precipitation-radar-products), [STAC collection](https://data.geo.admin.ch/api/stac/v1/collections/ch.meteoschweiz.ogd-radar-precip), and [CPC product description](https://www.meteoswiss.admin.ch/services-and-publications/service/weather-and-climate-products/combiprecip.html).
