# Güss dis Quartier local runner and data updates

This checkout runs the frontend against local Supabase and the published Zurich
Mapbox tree tileset. It also contains the local rain importer; the companion
Supabase checkout contains the City of Zurich tree and fountain synchronizers.

## Run the frontend

Start the frontend without creating a root `.env` file:

```bash
gdq/scripts/with-zurich-local-env.sh
```

The script obtains the public Mapbox token from 1Password when it starts. It
uses the local Supabase API, `mapbox://aiviech.gdq_trees`, the `trees` source
layer, calculated Zurich tree bounds, and the local public Storage URL for the
approved public, active Zurich fountain dataset. District boundaries still use
an empty GeoJSON source until that Zurich-data phase is implemented.

### Restarting the local app

Vite reads these environment variables only when it starts. After a change to
the Zurich launcher or local data URL, stop the running development server with
`Ctrl+C` in its terminal, then start it again from the frontend repository root:

```bash
gdq/scripts/with-zurich-local-env.sh
```

Open the URL printed by Vite (normally `http://localhost:5173`).

The launcher also supplies a local no-op Matomo URL. This is intentional:
analytics is outside the local MVP, and it prevents Vite from treating missing
optional Matomo variables as a malformed URL.

Use the same environment for a production-style frontend build:

```bash
gdq/scripts/with-zurich-local-env.sh npm run build
```

## Update local data

All update commands target **local** Supabase. Start it first from the
companion API checkout:

```bash
cd ../guess-dis-quartier-postgres-api
source /Users/Adrian/.nvm/nvm.sh
nvm use
npx supabase start
```

Use the canonical instructions owned by each importer:

- Rain — [MeteoSwiss CombiPrecip (CPC) local integration](cpc/README.md):
  environment setup, dry run, latest-hour import, 14-day backfill, precision,
  inspection, and tests.
- Trees — [Zurich trees](https://github.com/aiviemarketing/guess-dis-quartier-postgres-api/blob/master/gdq/README.md#zurich-trees):
  dry run and safe local replacement.
- Mapbox tree tiles — [local Mapbox tree artifact](https://github.com/aiviemarketing/guess-dis-quartier-postgres-api/blob/master/gdq/README.md#local-mapbox-tree-artifact):
  build and publish the replacement tileset.
- Fountains — [Zurich fountains](https://github.com/aiviemarketing/guess-dis-quartier-postgres-api/blob/master/gdq/README.md#zurich-fountains):
  generate, review, and upload the local Storage object.

Refresh the browser after a database or Storage update. A CPC import updates a
tree's rain details in local Supabase; its map colour updates only after the
Mapbox tree artifact is rebuilt and published. District boundaries still use an
empty local GeoJSON source, so they have no Zurich-data importer yet.
