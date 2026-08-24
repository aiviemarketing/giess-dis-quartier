#!/usr/bin/env bash

# Import MeteoSwiss CPC rainfall into production without persisting database
# credentials locally. The 1Password connection item may contain either a full
# Postgres URL or individual connection fields; the database password is held
# in its own 1Password item.

set -euo pipefail

readonly DEFAULT_OP_ITEM_UUID="tczeojcwase2ggjcuth3iid5ia"
readonly DEFAULT_OP_PASSWORD_ITEM_UUID="sh5yhymlow6kecum27cathiyza"
readonly OP_ITEM_UUID="${OP_ITEM_UUID:-$DEFAULT_OP_ITEM_UUID}"
readonly OP_PASSWORD_ITEM_UUID="${OP_PASSWORD_ITEM_UUID:-$DEFAULT_OP_PASSWORD_ITEM_UUID}"
readonly DEFAULT_DATABASE_HOST="aws-0-eu-central-2.pooler.supabase.com"
readonly DATABASE_USERNAME="postgres.yjbqcmpseysjwvvdiybo"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR
REPO_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
readonly REPO_ROOT
readonly CPC_PYTHON="$REPO_ROOT/gdq/cpc/.venv/bin/python"
readonly HOURS="${GDQ_RAIN_HOURS:-336}"

usage() {
	cat <<'EOF'
Usage: gdq/scripts/update-rain-data.sh [--write]

Imports the latest 14 days of MeteoSwiss CPC data by default. Without --write,
the CPC runner performs a database preflight but does not modify production.

Set GDQ_RAIN_HOURS to import a different number of consecutive hours.

Override the 1Password connection items when needed:
  OP_ITEM_UUID=<connection-item-uuid> \
  OP_PASSWORD_ITEM_UUID=<password-item-uuid> \
  gdq/scripts/update-rain-data.sh [--write]

The EU Central 2 Session Pooler is used by default. To use a different
connection, add a host field to the 1Password connection item or override it:
  GDQ_DB_HOST=aws-<region>.pooler.supabase.com \
  gdq/scripts/update-rain-data.sh [--write]
EOF
}

case "${1:-}" in
"")
	write_args=()
	;;
--write)
	write_args=(--write)
	;;
-h|--help)
	usage
	exit 0
	;;
*)
	usage >&2
	exit 2
	;;
esac

command -v op >/dev/null || {
	echo "1Password CLI (op) is required." >&2
	exit 1
}
command -v jq >/dev/null || {
	echo "jq is required." >&2
	exit 1
}
[[ -x "$CPC_PYTHON" ]] || {
	echo "CPC virtual environment is missing: $CPC_PYTHON" >&2
	exit 1
}
[[ "$HOURS" =~ ^[1-9][0-9]*$ ]] || {
	echo "GDQ_RAIN_HOURS must be a positive integer." >&2
	exit 2
}

item_json="$(op item get "$OP_ITEM_UUID" --format json)"

password_from_item() {
	op item get "$OP_PASSWORD_ITEM_UUID" --format json | jq -r '
		first(
			.fields[]?
			| select((.purpose // "") == "PASSWORD")
			| select((.value // "") != "")
			| .value
		) // first(
			.fields[]?
			| select((.label // "") | test("^password$"; "i"))
			| select((.value // "") != "")
			| .value
		) // empty
	'
}

field() {
	jq -r --arg pattern "$1" '
		first(
			.fields[]?
			| select((.label // "") | test($pattern; "i"))
			| select((.value // "") != "")
			| .value
		) // empty
	' <<<"$item_json"
}

database_url="$(jq -r '
	first(
		.fields[]?
		| .value?
		| select(type == "string" and test("^[[:space:]]*postgres(ql)?://"; "i"))
	) // empty
' <<<"$item_json" | sed -E 's/^[[:space:]]+//')"

if [[ -z "$database_url" ]]; then
	host="${GDQ_DB_HOST:-$(field '^(host(name)?|server|database host)$')}"
	host="${host:-$DEFAULT_DATABASE_HOST}"
	port="$(field '^port$')"
	database="$(field '^(database|dbname|db name)$')"
	username="${GDQ_DB_USERNAME:-$(field '^(user(name)?|database user)$')}"
	password="$(password_from_item)"

	username="${username:-$DATABASE_USERNAME}"

	[[ -n "$host" && -n "$username" && -n "$password" ]] || {
		echo "Could not obtain a database host, username, or password from 1Password." >&2
		exit 1
	}

	port="${port:-5432}"
	database="${database:-postgres}"
	username="$(jq -rn --arg value "$username" '$value | @uri')"
	password="$(jq -rn --arg value "$password" '$value | @uri')"
	database_url="postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require"
fi

case "$database_url" in
postgres://*|postgresql://*) ;;
*)
	echo "The database credential from 1Password is not a Postgres connection URL." >&2
	exit 1
	;;
esac

export DATABASE_URL="$database_url"
trap 'unset DATABASE_URL item_json database_url host port database username password' EXIT

cd "$REPO_ROOT"
exec "$CPC_PYTHON" -m gdq.cpc --hours "$HOURS" --rounding half-up "${write_args[@]}"
