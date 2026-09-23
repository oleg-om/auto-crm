#!/usr/bin/env bash
# Wipes the local MongoDB and replaces it with a fresh dump from production.
#
# Assumes prod runs the exact same docker-compose.yml as this repo (confirmed by the person who
# asked for this script) - a `mongo:7.0` container reachable over SSH via `docker exec`, with the
# root user/password/db name baked into that file's `MONGO_INITDB_ROOT_*`/`MONGO_INITDB_DATABASE`
# environment. Both mongodump (on prod) and mongorestore (locally) authenticate with those same
# values, read once below instead of duplicated as literals, so this script can't drift from
# docker-compose.yml. Override any of them with an env var of the same name (MONGO_USER=...) if
# your setup differs.
#
# Requires: sshpass (`brew install sshpass` / `apt-get install sshpass`), and the local
# `auto-crm-mongodb` container already running (`docker-compose up -d mongodb`).
#
# Usage: ./scripts/sync-prod-db.sh [-y]   (-y skips the "this wipes your local DB" prompt)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
SKIP_CONFIRM=false

for arg in "$@"; do
  case "$arg" in
    -y|--yes) SKIP_CONFIRM=true ;;
    *)
      echo "Unknown argument: $arg (only -y/--yes is supported)" >&2
      exit 1
      ;;
  esac
done

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE - can't read PROD_IP/PROD_USER/PROD_PASS." >&2
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

for var in PROD_IP PROD_USER PROD_PASS; do
  if [ -z "${!var:-}" ]; then
    echo "$var is not set in $ENV_FILE." >&2
    exit 1
  fi
done

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required for password-based SSH. Install it first:" >&2
  echo "  macOS:  brew install sshpass" >&2
  echo "  Debian/Ubuntu: sudo apt-get install sshpass" >&2
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Missing $COMPOSE_FILE - can't read the mongo container's name/credentials." >&2
  exit 1
fi
compose_value() {
  awk -F': ' -v key="$1" '$0 ~ key {print $2; exit}' "$COMPOSE_FILE" | tr -d '[:space:]'
}
MONGO_CONTAINER="${MONGO_CONTAINER:-$(compose_value 'container_name: auto-crm-mongodb')}"
MONGO_USER="${MONGO_USER:-$(compose_value MONGO_INITDB_ROOT_USERNAME)}"
MONGO_PASS="${MONGO_PASS:-$(compose_value MONGO_INITDB_ROOT_PASSWORD)}"
MONGO_DB="${MONGO_DB:-$(compose_value MONGO_INITDB_DATABASE)}"
for var in MONGO_CONTAINER MONGO_USER MONGO_PASS MONGO_DB; do
  if [ -z "${!var:-}" ]; then
    echo "Could not read $var from $COMPOSE_FILE - pass it as an env var instead, e.g. $var=... $0" >&2
    exit 1
  fi
done

if ! docker ps --format '{{.Names}}' | grep -qx "$MONGO_CONTAINER"; then
  echo "Local container '$MONGO_CONTAINER' isn't running. Start it first:" >&2
  echo "  docker-compose up -d mongodb" >&2
  exit 1
fi

if [ "$SKIP_CONFIRM" != true ]; then
  # A non-interactive stdin (e.g. an IDE's "npm scripts" run console, which often doesn't attach a
  # real terminal to a yarn-spawned process) can't actually deliver a typed "y" here - `read`
  # would just get an empty line back and this would silently abort with no clue why. Fail loudly
  # instead of asking a question nothing can answer.
  if [ ! -t 0 ]; then
    echo "Refusing to prompt: stdin isn't a terminal (this is common when running via an IDE's" >&2
    echo "npm/yarn scripts panel). Run this from a real terminal, or pass -y to skip the prompt:" >&2
    echo "  ./scripts/sync-prod-db.sh -y" >&2
    exit 1
  fi
  echo "This will DROP the local '$MONGO_DB' database and replace it with a dump from $PROD_IP."
  read -r -p "Continue? [y/N] " reply
  case "$reply" in
    [yY][eE][sS]|[yY]) ;;
    *)
      echo "Aborted."
      exit 1
      ;;
  esac
fi

# Named ssh_prod, not ssh - sshpass execs its argument directly (not through a shell), so it can't
# be a function literally called `ssh` shadowing the real binary it needs to find on PATH.
ssh_prod() {
  sshpass -p "$PROD_PASS" ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 \
    "$PROD_USER@$PROD_IP" "$@"
}

# Plain `mktemp` (no custom -t template) - BSD mktemp (macOS) and GNU mktemp (Linux) disagree on
# how a template string is filled in, so a portable call is safest here.
DUMP_FILE="$(mktemp)"
cleanup() { rm -f "$DUMP_FILE"; }
trap cleanup EXIT

echo "Dumping '$MONGO_DB' from $PROD_IP (container $MONGO_CONTAINER)..."
ssh_prod "docker exec -i '$MONGO_CONTAINER' mongodump \
  --username='$MONGO_USER' --password='$MONGO_PASS' --authenticationDatabase=admin \
  --db='$MONGO_DB' --archive --gzip" >"$DUMP_FILE"

if [ ! -s "$DUMP_FILE" ]; then
  echo "Dump came back empty - aborting before touching the local database." >&2
  exit 1
fi
echo "Dump received ($(du -h "$DUMP_FILE" | cut -f1))."

echo "Restoring into local '$MONGO_DB' (existing collections will be dropped)..."
docker exec -i "$MONGO_CONTAINER" mongorestore \
  --username="$MONGO_USER" --password="$MONGO_PASS" --authenticationDatabase=admin \
  --db="$MONGO_DB" --drop --archive --gzip <"$DUMP_FILE"

echo "Done - local '$MONGO_DB' now matches production."
