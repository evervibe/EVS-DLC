#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; [ -f ./.env ] && . ./.env; set +a
CONTAINER="evs-lc-${SERVER:-dev}-mysql"
PASS="${MYSQL_ROOT_PASSWORD:-root}"
OUT="./backups/${SERVER:-dev}/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "Backing up to $OUT ..."
for DB in db_auth db_data db_db db_post; do
  echo "Dumping $DB ..."
  docker exec "$CONTAINER" sh -lc "MYSQL_PWD=$PASS mysqldump -uroot --single-transaction --quick --routines --triggers --events \"$DB\"" | gzip > "$OUT/${DB}.sql.gz"
done

echo "Backup done: $OUT"
