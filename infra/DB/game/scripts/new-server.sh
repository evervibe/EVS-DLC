#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <server-name>" >&2
  exit 1
fi

NAME="$1"
BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$BASE_DIR/servers/template"
TARGET_DIR="$BASE_DIR/servers/$NAME"

if [[ -d "$TARGET_DIR" ]]; then
  echo "Server '$NAME' exists: $TARGET_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp -R "$TEMPLATE_DIR/"* "$TARGET_DIR/"
chmod +x "$TARGET_DIR/010_import.sh"

echo "Created server scaffold: $TARGET_DIR"
echo "Place your dumps in: $TARGET_DIR/dumps (db_auth.sql, db_data.sql, db_db.sql, db_post.sql)"
