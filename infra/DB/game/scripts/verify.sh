#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Load .env
set -a; [ -f ./.env ] && . ./.env; set +a
CONTAINER="evs-lc-${SERVER:-dev}-mysql"
PASS="${MYSQL_ROOT_PASSWORD:-root}"

echo "Verifying container: $CONTAINER"
docker ps --filter "name=$CONTAINER"

echo "Schemas and table counts:"
docker exec "$CONTAINER" sh -lc "MYSQL_PWD=$PASS mysql -uroot -Nse \"
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME IN ('db_auth','db_data','db_db','db_post');
SELECT table_schema, COUNT(*) AS tables
FROM information_schema.tables
WHERE table_schema IN ('db_auth','db_data','db_db','db_post')
GROUP BY table_schema;\""

echo "Sample rows:"
docker exec "$CONTAINER" sh -lc "MYSQL_PWD=$PASS mysql -uroot -e \"
SELECT 'db_auth.bg_user' AS tbl, COUNT(*) FROM db_auth.bg_user;\" " || true
docker exec "$CONTAINER" sh -lc "MYSQL_PWD=$PASS mysql -uroot -e \"
SELECT 'db_data.t_item' AS tbl, COUNT(*) FROM db_data.t_item;\" " || true
docker exec "$CONTAINER" sh -lc "MYSQL_PWD=$PASS mysql -uroot -e \"
SELECT 'db_db.t_characters' AS tbl, COUNT(*) FROM db_db.t_characters;\" " || true

echo "Verify done."
