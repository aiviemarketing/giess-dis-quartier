# Güss dis Quartier – Final MVP Implementation Plan

Status: 15 August 2026

## 1. Objective

`Güss dis Quartier` is a Swiss adaptation of **Gieß den Kiez**.

The primary goal is:

> Get a complete Zurich version running locally on the MacBook Pro first, using the existing Gieß den Kiez architecture and frontend contract as closely as possible.

Only after the local Zurich version works end to end should production deployment, branding polish, automation and operational hardening be completed.

---

# 2. Existing Local Repositories

The three forks already exist and are checked out here:

```text
/Users/Adrian/src/gdq/
├── guess-dis-quartier
├── guess-dis-quartier-postgres-api
└── guess-dis-quartier-weather
```

These are the intended project repositories.

## Repository roles

### `guess-dis-quartier`

Fork of:

```text
technologiestiftung/giessdenkiez-de
```

Responsibilities:

- React / Vite frontend
- Mapbox map
- tree detail UI
- authentication UI
- adoption UI
- watering UI
- watering history
- frontend branding
- production Firebase Hosting build

### `guess-dis-quartier-postgres-api`

Fork of:

```text
technologiestiftung/giessdenkiez-de-postgres-api
```

Responsibilities:

- local Supabase
- PostgreSQL / PostGIS
- Supabase migrations
- Auth
- REST / RPC
- Edge Functions
- Storage
- Zurich tree import
- Zurich fountain conversion / publication
- CPC compatibility migration

### `guess-dis-quartier-weather`

Fork of:

```text
technologiestiftung/giessdenkiez-de-dwd-harvester
```

Responsibilities:

- MeteoSwiss CPC ingestion
- CPC → `radolan_geometry`
- CPC → `radolan_data`
- rainfall aggregation
- update tree precipitation fields
- Mapbox tree layer updates where required
- weather automation later

No fourth pump-harvester fork is needed for the MVP.

Zurich fountain data is simple enough to transform with a dedicated script in the postgres/API repository.

---

# 3. Architecture

## Local development

```text
MacBook Pro
│
├── guess-dis-quartier
│   └── localhost:5173
│
├── guess-dis-quartier-postgres-api
│   └── local Supabase in Docker
│       ├── PostgreSQL
│       ├── PostGIS
│       ├── Auth
│       ├── REST / RPC
│       ├── Edge Functions
│       └── Storage
│
├── guess-dis-quartier-weather
│   └── MeteoSwiss CPC harvester
│
└── Mapbox
    └── Zurich tree tileset
```

## Production later

```text
Frontend
└── Firebase Hosting

Backend
└── Supabase Cloud

Maps
└── Mapbox

Public data
├── City of Zurich tree cadastre
├── City of Zurich fountains
└── MeteoSwiss CPC

Automation
└── GitHub Actions
```

---

# 4. Core Implementation Principle

Do not rebuild Gieß den Kiez for Zurich.

Instead:

> Transform Swiss public data into the structures already expected by Gieß den Kiez.

Prefer:

```text
configuration
data adapters
import scripts
isolated harvester changes
small branding changes
```

Avoid:

```text
frontend rewrites
database redesign
large refactorings
renaming upstream database concepts
new application architecture
```

The goal is to keep future upstream merges practical.

---

# 5. MVP Scope

## Included

- Zurich map
- official Zurich trees
- tree detail page
- registration
- login
- adoption
- watering
- water amount
- watering history
- Zurich fountains as water sources
- MeteoSwiss CPC precipitation
- existing GdK rain / watering calculation
- Güss dis Quartier branding
- local reproducible setup
- production deployment after local acceptance

## Not included

- additional Swiss cities
- manually created trees
- additional care-log types
- admin extensions
- large UX changes
- MapLibre migration
- database cleanup
- higher-precision rainfall schema migration
- architectural replacement of Supabase or Mapbox

---

# 6. Phase 1 – Reproduce Upstream Locally

Follow the original Gieß den Kiez `README_DEV.md` as closely as possible.

The upstream setup is already designed for macOS and Apple Silicon.

## Required local tooling

Verify:

```text
Docker
direnv
Python 3
pip
Node
npm
nvm
Supabase CLI
PostgreSQL client / DB viewer
```

Useful checks:

```bash
docker --version
direnv --version
python3 --version
node --version
npm --version
npx supabase --version
```

## Backend

From:

```bash
cd /Users/Adrian/src/gdq/guess-dis-quartier-postgres-api
```

Install dependencies:

```bash
nvm install
nvm use
npm ci
cp .env.example .env
direnv allow
```

Start Supabase:

```bash
npx supabase start
```

Inspect local credentials:

```bash
npx supabase status
```

Verify:

- PostgreSQL running
- PostGIS available
- Supabase Auth running
- Storage running
- REST API running
- migrations applied

## Edge Functions

Configure the local Supabase functions environment.

Run the existing Edge Functions locally.

Verify that the frontend can call the functions required by:

- stats where applicable
- pump / water source functions where applicable
- application functionality used by the frontend

## Frontend

From:

```bash
cd /Users/Adrian/src/gdq/guess-dis-quartier
```

Install:

```bash
nvm install
nvm use
npm ci
cp .env.sample .env
direnv allow
```

Configure:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local anon key>

VITE_MAPBOX_API_KEY=<frontend token>
VITE_MAPBOX_STYLE_URL=mapbox://styles/mapbox/standard
```

Run:

```bash
npm run dev
```

Target:

```text
http://localhost:5173
```

## Phase 1 acceptance

Before Zurich-specific work:

- [ ] frontend loads
- [ ] local Supabase works
- [ ] registration works
- [ ] login works
- [ ] adoption works using upstream/demo data
- [ ] watering works
- [ ] watering history works
- [ ] tree detail page works

This proves the upstream baseline independently from the Zurich data integration.

---

# 7. Phase 2 – Replace Berlin Trees with Zurich Trees

Official source:

```text
City of Zurich Open Data
Baumkataster
```

Properties:

```text
License:      CC0
Update:       weekly
Format:       GeoJSON available
Coordinates:  WGS84 / EPSG:4326 available
```

## Required GdK tree fields

The upstream city-adaptation documentation requires at least:

```text
id
lat
lng
art_dtsch
gattung_deutsch
pflanzjahr
bezirk
geom
```

The existing table supports more fields, including:

```text
artbot
gattung
strname
hausnr
type
baumhoehe
standalter
eigentuemer
standortnr
caretaker
gmlid
radolan_sum
radolan_days
```

## Zurich mapping

Target mapping:

| Zurich              | GdK              | Handling                   |
| ------------------- | ---------------- | -------------------------- |
| `baumnummer`        | `id`             | use official stable ID     |
| geometry latitude   | `lat`            | derive                     |
| geometry longitude  | `lng`            | derive                     |
| German species name | `artdtsch`       | map from Zurich source     |
| botanical species   | `artbot`         | map from Zurich source     |
| genus               | `gattung`        | derive if needed           |
| German genus        | `gattungdeutsch` | source or derived          |
| `strasse`           | `strname`        | direct                     |
| `pflanzjahr`        | `pflanzjahr`     | normalize                  |
| `quartier`          | `bezirk`         | direct conceptual mapping  |
| `kategorie`         | `type`           | optional                   |
| geometry            | `geom`           | `SRID=4326;POINT(lng lat)` |
| `baumnummer`        | `standortnr`     | optional source reference  |

## Script

Create in:

```text
guess-dis-quartier-postgres-api/scripts/sync-zurich-trees.ts
```

Responsibilities:

```text
download official GeoJSON
        ↓
validate schema
        ↓
normalize fields
        ↓
validate IDs
        ↓
validate geometry
        ↓
upsert local Supabase
        ↓
generate Mapbox GeoJSON / source data
```

## Validation

The importer must report:

```text
total source rows
valid trees
missing IDs
duplicate IDs
invalid geometries
missing species
missing planting years
new IDs
changed IDs
removed IDs
```

## Critical ID rule

Never generate random tree IDs.

Adoption and watering tables refer to `trees.id`.

A weekly source update must preserve:

```text
trees_adopted
trees_watered
```

Use idempotent upserts.

## Remove Berlin seed data

After the upstream baseline is proven, replace Berlin data with Zurich data.

Do not mix Berlin and Zurich production records.

## Phase 2 acceptance

- [ ] Zurich trees are in local Supabase
- [ ] no Berlin trees remain
- [ ] IDs are unique
- [ ] geometry is valid
- [ ] 20–50 random trees manually verified
- [ ] adoption works on Zurich tree IDs
- [ ] watering works on Zurich tree IDs

---

# 8. Phase 3 – Generate Zurich Mapbox Tree Tileset

The frontend does not render trees directly from PostgreSQL.

It expects:

```env
VITE_MAPBOX_TREES_TILESET_URL=mapbox://...
VITE_MAPBOX_TREES_TILESET_LAYER=trees
```

## Requirements

The Mapbox feature ID must equal:

```text
Supabase trees.id
```

This is critical because the frontend applies watering state to tree features by ID.

## Pipeline

```text
normalized Zurich tree data
        ↓
Mapbox-compatible GeoJSON
        ↓
Mapbox tileset
        ↓
VITE_MAPBOX_TREES_TILESET_URL
```

The same normalized source should generate both:

```text
Supabase rows
Mapbox features
```

This avoids ID drift.

## Zurich map ENV

Configure Zurich:

```env
VITE_MAP_CENTER_LAT=47.3769
VITE_MAP_CENTER_LNG=8.5417
VITE_MAP_BOUNDING_BOX=<validated Zurich bounds>
VITE_MAPBOX_TREES_TILESET_LAYER=trees
```

Use the actual tree dataset / Zurich boundary to calculate the final bounding box.

## Phase 3 acceptance

- [ ] Zurich map loads
- [ ] tree circles display
- [ ] tree selection works
- [ ] selected Mapbox feature resolves to correct Supabase tree
- [ ] watering feature-state updates work

---

# 9. Phase 4 – Zurich Fountains

Official source:

```text
City of Zurich Open Data
Brunnen
```

The data includes fields such as:

```text
location
quarter
district
fountain number
fountain type
water type
deactivated state
reason for deactivation
geometry
```

## Strategy

Do not modify the existing pump map architecture.

The frontend already expects:

```env
VITE_MAP_PUMPS_SOURCE_URL=<geojson URL>
```

Create:

```text
guess-dis-quartier-postgres-api/scripts/sync-zurich-fountains.ts
```

Pipeline:

```text
Zurich fountain GeoJSON
        ↓
validate
        ↓
filter unusable / deactivated fountains
        ↓
transform to upstream-compatible pump GeoJSON
        ↓
local Supabase Storage
        ↓
public/local URL
        ↓
VITE_MAP_PUMPS_SOURCE_URL
```

Internally keep upstream concepts like:

```text
pump
pumps
```

if changing them would create unnecessary source divergence.

Visible copy may later say:

```text
Brunnen
```

instead of:

```text
Pumpe
```

## Phase 4 acceptance

- [ ] Zurich fountains appear
- [ ] positions are correct
- [ ] deactivated fountains are excluded or handled correctly
- [ ] existing pump selection / highlight logic works
- [ ] no frontend architectural change was required

---

# 10. Phase 5 – MeteoSwiss CPC Rain Integration

The technical spike is complete.

## Spike outcome

```text
GO with adjustment
```

Already proven:

- CPC is available through the official MeteoSwiss STAC API
- download is automatable
- CPC is readable as ODIM HDF5
- Zurich WGS84 coordinates map correctly to the 1 km CPC grid
- scaling is metadata-driven
- NoData handling is metadata-driven
- CPC → `radolan_geometry` / `radolan_data` adapter exists
- CPC reanalysis imports are idempotent
- aggregation handles DWD `HH:50` and CPC `HH:00`
- frontend contract remains unchanged
- offline tests pass

## Precision decision

For MVP:

> Accept explicit tenths-of-mm rounding.

Do not perform a broader precision migration now.

A later coordinated migration can change DB types and frontend assumptions if necessary.

---

# 11. Phase 6 – Complete the Three Remaining CPC Checks

These are now the only CPC validation gates.

## 6.1 Real local Supabase import

Apply the CPC migration in:

```text
guess-dis-quartier-postgres-api
```

Then use:

```text
guess-dis-quartier-weather
```

to import a real CPC dataset into local Supabase/PostGIS.

Verify:

```text
radolan_geometry
radolan_data
```

Then import the same CPC product again.

Expected:

```text
no duplicates
same final state
```

## 6.2 Run existing GdK aggregation

Execute:

```text
build_radolan_grid
update_trees_in_database
```

Verify Zurich trees:

```sql
SELECT
    id,
    lat,
    lng,
    radolan_sum,
    radolan_days
FROM trees
WHERE id IN (...);
```

Acceptance:

- [ ] `radolan_sum` populated
- [ ] `radolan_days` populated
- [ ] plausible spatial differences
- [ ] no Berlin-specific assumptions break the run

## 6.3 Compare dry and rainy hours

Choose:

```text
one dry CPC hour
one rainy CPC hour
```

Compare against a nearby official precipitation station.

Success requires:

```text
correct time
correct dry / rain classification
plausible magnitude
```

Exact equality is not expected.

---

# 12. Phase 7 – Weather Pipeline Integration

After CPC validation succeeds:

```text
MeteoSwiss STAC
        ↓
find missing CPC assets
        ↓
download ODIM HDF5
        ↓
extract Zurich cells
        ↓
idempotent DB upsert
        ↓
radolan_data
        ↓
build_radolan_grid
        ↓
update_trees_in_database
        ↓
trees.radolan_sum
trees.radolan_days
        ↓
existing frontend contract
```

Do not rename `radolan_*` in the MVP.

The names are DWD-specific, but retaining them reduces upstream divergence.

---

# 13. Phase 8 – Other Upstream City-Specific Assumptions

The original `README_DEV.md` identifies additional city-specific items.

These must be checked explicitly.

## `gdk_stats`

The Edge Function currently has city-specific hardcoded values such as:

```text
MOST_FREQUENT_TREE_SPECIES
TREE_COUNT
```

For Zurich:

- calculate the actual values from the imported tree dataset
- update them if the stats function is part of the MVP

Prefer deriving them dynamically later, but do not refactor this during the initial local MVP unless necessary.

## District / quarter GeoJSON

The upstream stats page expects district polygon GeoJSON via:

```env
VITE_BEZIRKE_URL=...
```

For Zurich:

Option A, preferred if easy:

```text
use official Zurich quarter / district polygons
```

Option B:

```text
defer stats page until after core MVP
```

Do not block:

```text
map
tree details
auth
adoption
watering
fountains
rain
```

because of the stats page.

## Historical daily weather

The upstream documentation also runs a BrightSky daily-weather process.

Before implementing a Swiss equivalent:

- inspect whether this data is required by the core MVP UI
- if only auxiliary / stats functionality uses it, postpone it

Do not introduce another weather source unless the running frontend proves it is required.

---

# 14. Phase 9 – Full Local Zurich Acceptance Test

This is the most important milestone.

The application must run locally on the MacBook Pro using Zurich data.

## Map

- [ ] app opens on Zurich
- [ ] Zurich bounding box configured
- [ ] trees display
- [ ] tree clicking works
- [ ] geolocation works
- [ ] fountains display

## Tree data

- [ ] German name plausible
- [ ] botanical name plausible
- [ ] planting year plausible
- [ ] quarter correct
- [ ] location correct

## Authentication

- [ ] registration
- [ ] login
- [ ] logout
- [ ] password recovery if needed for upstream parity

## Adoption

- [ ] adopt Zurich tree
- [ ] reload
- [ ] adoption persists
- [ ] adopted tree appears in expected UI

## Watering

- [ ] add watering
- [ ] litres stored
- [ ] watering persists
- [ ] watering history visible
- [ ] other watering state still works

## Rain

- [ ] real CPC data in local DB
- [ ] `radolan_sum` populated
- [ ] `radolan_days` populated
- [ ] dry location plausible
- [ ] rainy location plausible
- [ ] existing frontend calculation works without CPC-specific UI changes

## Fountains

- [ ] water sources visible
- [ ] coordinates plausible
- [ ] disabled fountains filtered
- [ ] existing upstream interaction works

---

# 15. Local MVP Definition of Done

The first major milestone is complete when a fresh local setup can reproduce the Zurich application.

Target developer workflow should be documented as closely as practical to:

```bash
cd /Users/Adrian/src/gdq/guess-dis-quartier-postgres-api

nvm use
npm ci
npx supabase start

# Apply / verify migrations and Edge Functions
# Import Zurich trees
# Import Zurich fountains

cd /Users/Adrian/src/gdq/guess-dis-quartier-weather

# Activate Python environment
# Import CPC
# Run precipitation aggregation

cd /Users/Adrian/src/gdq/guess-dis-quartier

nvm use
npm ci
npm run dev
```

The documentation must contain the exact commands once implementation stabilises.

Do not proceed to production until this process is reproducible.

---

# 16. Phase 10 – Branding

Once the local MVP works:

```text
Gieß den Kiez
→
Güss dis Quartier
```

Change only necessary presentation elements:

- app name
- logo
- browser title
- favicon
- PWA icons
- meta description
- OpenGraph
- Berlin-specific copy
- legal pages
- visible `Pumpe` → `Brunnen` where appropriate

Do not redesign the core UX.

## Attribution

Clearly retain upstream attribution and licensing.

Suggested wording:

```text
Güss dis Quartier is a Swiss adaptation of
Gieß den Kiez by Technologiestiftung Berlin.
```

---

# 17. Phase 11 – Supabase Cloud

After local acceptance:

## MVP

```text
Supabase Free
```

## Production later

```text
Supabase Pro
```

Tasks:

- [ ] create project
- [ ] apply upstream migrations
- [ ] apply CPC compatibility migration
- [ ] deploy Edge Functions
- [ ] configure Auth URLs
- [ ] configure Storage
- [ ] import Zurich trees
- [ ] publish fountain GeoJSON
- [ ] import / seed CPC history
- [ ] validate RLS
- [ ] smoke test production backend

---

# 18. Phase 12 – Firebase Hosting

Firebase is only used for frontend hosting.

Tasks:

- [ ] create Firebase project
- [ ] configure Firebase Hosting
- [ ] SPA rewrite to `/index.html`
- [ ] configure production build ENV
- [ ] deploy frontend
- [ ] connect custom domain
- [ ] verify TLS
- [ ] verify Supabase Auth redirect URLs

Expected deployment flow:

```bash
npm ci
npm run build
firebase deploy --only hosting
```

---

# 19. Phase 13 – Automation

Only automate importers after successful manual execution.

## Zurich trees

Frequency:

```text
weekly
```

Pipeline:

```text
download
→ validate
→ normalize
→ Supabase upsert
→ Mapbox update
```

## Zurich fountains

Frequency:

```text
daily or weekly
```

Pipeline:

```text
download
→ validate
→ filter
→ publish GeoJSON
```

## MeteoSwiss CPC

Frequency:

```text
at least daily
```

Prefer:

```text
last successful timestamp
        ↓
STAC query
        ↓
missing assets only
        ↓
idempotent import
        ↓
aggregate
        ↓
update trees
```

The CPC job must safely recover after missed executions.

---

# 20. GitHub Actions

## Pull request CI

- frontend unit tests
- frontend build
- TypeScript checks
- backend migration validation
- CPC offline tests
- importer tests

## Scheduled workflows

Later:

```text
Zurich tree sync
Zurich fountain sync
CPC sync
```

## Production deploy

```text
merge to main
        ↓
build frontend
        ↓
Firebase Hosting
```

Database changes should remain explicit and controlled.

---

# 21. Main Remaining Risks

## Tree ID stability

Risk:

```text
medium
```

Mitigation:

- official stable Zurich tree ID only
- compare repeated snapshots
- report added / removed / changed IDs
- never generate replacement IDs

## CPC real PostGIS validation

Risk:

```text
low to medium
```

The architecture is proven offline.

Only real database integration and aggregation validation remain.

## CPC precision

Risk:

```text
low for MVP
```

Tenths-mm rounding is explicitly accepted.

## Mapbox / Supabase consistency

Risk:

```text
medium
```

Mitigation:

Generate both from the same normalized Zurich tree dataset.

## City-specific hidden assumptions

Risk:

```text
medium
```

Examples:

- stats constants
- district polygons
- historical weather
- Berlin-specific copy

Mitigation:

Follow `README_DEV.md` city adaptation steps and validate every referenced component before production.

## Upstream drift

Risk:

```text
medium
```

Mitigation:

- real forks
- upstream remotes
- isolated Swiss adapters
- minimal frontend changes
- small focused commits

---

# 22. Updated Effort Estimate

The CPC research risk is already resolved.

## Local MVP

```text
Reproduce upstream locally              0.5–1.0 day
Zurich tree importer                    1.0–1.5 days
Mapbox Zurich tree layer                0.5 day
Zurich fountain adapter                 0.5 day
CPC real local DB validation            0.5 day
CPC aggregation + station check         0.5 day
City-specific upstream assumptions      0.5 day
End-to-end fixes                        1.0–1.5 days
Local setup documentation               0.5 day
---------------------------------------------------
Local MVP                               ca. 5.5–7 days
```

## Production MVP after local acceptance

```text
Branding                                0.5 day
Supabase Cloud                          0.5 day
Firebase Hosting                        0.5 day
Automation / GitHub Actions             1.0–1.5 days
Production tests                        0.5–1.0 day
---------------------------------------------------
Additional                              ca. 3–4 days
```

## Total

```text
Local working MVP        ca. 5.5–7 days
Public production MVP    ca. 8.5–11 days total
```

---

# 23. Costs

## Local

```text
Supabase local            CHF 0
Zurich Open Data          CHF 0
MeteoSwiss OGD            CHF 0
Mapbox development        likely CHF 0
Firebase                  not needed locally
```

## Public MVP

```text
Supabase Free             CHF 0
Firebase Hosting          likely CHF 0
Mapbox                    likely CHF 0 at MVP usage
Zurich Open Data          CHF 0
MeteoSwiss OGD            CHF 0
Domain                    approx. CHF 10–20 / year
```

## After MVP

Expected primary recurring cost:

```text
Supabase Pro              approx. USD 25 / month
```

plus Mapbox / Firebase usage if traffic grows materially.

---

# 24. Exact Implementation Order

```text
1. Verify local tools
        ↓
2. Start local Supabase
        ↓
3. Run upstream backend / Edge Functions
        ↓
4. Run upstream frontend
        ↓
5. Verify auth / adoption / watering with baseline data
        ↓
6. Replace Berlin trees with Zurich trees
        ↓
7. Generate Zurich Mapbox tileset
        ↓
8. Verify Zurich tree detail / adoption / watering
        ↓
9. Generate Zurich fountain GeoJSON
        ↓
10. Verify fountains
        ↓
11. Apply CPC compatibility migration
        ↓
12. Import real CPC into local PostGIS
        ↓
13. Run build_radolan_grid
        ↓
14. Run update_trees_in_database
        ↓
15. Compare dry / rainy hour against station
        ↓
16. Fix remaining city-specific assumptions
        ↓
17. Complete full local Zurich acceptance test
        ↓
18. Document exact local setup
        ↓
19. Branding
        ↓
20. Supabase Cloud
        ↓
21. Firebase Hosting
        ↓
22. Automation
        ↓
23. Production acceptance
```

---

# 25. Final Definition of Done

## Local MVP

Running on the MacBook Pro:

```text
✅ Zurich trees
✅ Mapbox tree map
✅ tree details
✅ Supabase Auth
✅ adoption
✅ watering
✅ litres
✅ watering history
✅ Zurich fountains
✅ MeteoSwiss CPC
✅ existing rain / watering calculation
✅ reproducible local setup
```

## Production MVP

The same application deployed with:

```text
Frontend       Firebase Hosting
Backend        Supabase Cloud
Maps           Mapbox
Trees          City of Zurich
Fountains      City of Zurich
Rain           MeteoSwiss CPC
Automation     GitHub Actions
```

with the minimum practical divergence from the upstream Gieß den Kiez project.

---

# 26. Reference Sources

Gieß den Kiez frontend:

```text
https://github.com/technologiestiftung/giessdenkiez-de
```

Development setup:

```text
https://github.com/technologiestiftung/giessdenkiez-de/blob/main/README_DEV.md
```

Postgres / Supabase backend:

```text
https://github.com/technologiestiftung/giessdenkiez-de-postgres-api
```

DWD weather harvester:

```text
https://github.com/technologiestiftung/giessdenkiez-de-dwd-harvester
```

City of Zurich tree cadastre:

```text
https://data.stadt-zuerich.ch/dataset/geo_baumkataster
```

City of Zurich fountains:

```text
https://data.stadt-zuerich.ch/dataset/geo_brunnen
```

MeteoSwiss precipitation radar documentation:

```text
https://opendatadocs.meteoswiss.ch/d-radar-data/d1-precipitation-radar-products
```
