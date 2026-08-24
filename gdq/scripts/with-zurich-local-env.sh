#!/usr/bin/env bash

set -euo pipefail

readonly DEFAULT_OP_ITEM_UUID="om4wryhou2hgjpd2ja2lbxbhvq"
readonly OP_ITEM_UUID="${OP_ITEM_UUID:-$DEFAULT_OP_ITEM_UUID}"

frontend_token="$(op item get "$OP_ITEM_UUID" --fields label=credential --reveal)"
case "$frontend_token" in
	pk.*) ;;
	*) echo "Could not retrieve a Mapbox public token from 1Password." >&2; exit 1 ;;
esac

export VITE_SUPABASE_URL="http://127.0.0.1:54321"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
export VITE_MAPBOX_API_KEY="$frontend_token"
export VITE_MAPBOX_STYLE_URL="mapbox://styles/mapbox/standard"
export VITE_MAPBOX_TREES_TILESET_URL="mapbox://aiviech.gdq_trees"
export VITE_MAPBOX_TREES_TILESET_LAYER="trees"
export VITE_MAPBOX_API_ENDPOINT="https://api.mapbox.com"
export VITE_MAP_CENTER_LNG="8.5417"
export VITE_MAP_CENTER_LAT="47.3769"
export VITE_MAP_BOUNDING_BOX="8.463149,47.321549,8.612854,47.436116"
export VITE_MAP_PITCH_DEGREES="45"
export VITE_MAP_MAX_ZOOM_LEVEL="20"
export VITE_MAP_MIN_ZOOM_LEVEL="10"
export VITE_MAP_INITIAL_ZOOM_LEVEL="11"
export VITE_MAP_LOCATION_ZOOM_LEVEL="17"
export VITE_RECOVERY_AUTH_REDIRECT_URL="http://localhost:5173/profile/reset-password"

# The upstream HTML always inserts the optional Matomo tracker. Use a no-op
# JavaScript data URL for the local MVP so missing analytics configuration
# cannot form an invalid percent-encoded URL in Vite.
export VITE_MATOMO_URL="data:text/javascript,void%200%3B%2F%2F"
export VITE_MATOMO_SITE_ID="0"

# The approved local fountain dataset contains public, active City of Zurich
# fountains only. District boundaries remain a later Zurich-data phase.
empty_geojson="data:application/geo+json,%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%5D%7D"
export VITE_MAP_PUMPS_SOURCE_URL="http://127.0.0.1:54321/storage/v1/object/public/data_assets/zurich-fountains.geojson"
export VITE_BEZIRKE_URL="$empty_geojson"

if [ "$#" -eq 0 ]; then
	set -- npm run dev
fi

exec "$@"
