#!/usr/bin/env bash
set -euo pipefail

# Database seed script for dev environment
# This script imports SQL dumps if they are available in the dumps directory
#
# Prerequisites:
# - MySQL client installed (mysql command)
# - SQL dumps in infra/DB/game/init/dumps/ directory:
#   - db_auth.sql
#   - db_data.sql
#   - db_db.sql
#   - db_post.sql
#
# Usage:
#   MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_USER=root MYSQL_PWD=root bash infra/DB/seed-dev.sh

MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PWD="${MYSQL_PWD:-root}"
DUMPS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/game/init/dumps"

echo "Database seed script for EVS-DLC dev environment"
echo "================================================="
echo "MySQL Host: ${MYSQL_HOST}:${MYSQL_PORT}"
echo "MySQL User: ${MYSQL_USER}"
echo "Dumps Directory: ${DUMPS_DIR}"
echo ""

# Check if dumps directory exists
if [ ! -d "${DUMPS_DIR}" ]; then
  echo "Error: Dumps directory not found at ${DUMPS_DIR}"
  echo "Please create the directory and add SQL dump files:"
  echo "  - db_auth.sql"
  echo "  - db_data.sql"
  echo "  - db_db.sql"
  echo "  - db_post.sql"
  exit 1
fi

# Check if dump files exist
DUMPS=("db_auth.sql" "db_data.sql" "db_db.sql" "db_post.sql")
MISSING_DUMPS=()
for dump in "${DUMPS[@]}"; do
  if [ ! -f "${DUMPS_DIR}/${dump}" ]; then
    MISSING_DUMPS+=("${dump}")
  fi
done

if [ ${#MISSING_DUMPS[@]} -gt 0 ]; then
  echo "Error: Missing SQL dump files in ${DUMPS_DIR}:"
  for dump in "${MISSING_DUMPS[@]}"; do
    echo "  - ${dump}"
  done
  exit 1
fi

# Import dumps
echo "Importing SQL dumps..."
echo ""

for dump in "${DUMPS[@]}"; do
  DB_NAME="${dump%.sql}"
  echo "Importing ${dump} into ${DB_NAME}..."
  mysql -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" -u "${MYSQL_USER}" -p"${MYSQL_PWD}" "${DB_NAME}" < "${DUMPS_DIR}/${dump}"
  echo "✓ ${DB_NAME} imported successfully"
  echo ""
done

echo "================================================="
echo "All database dumps imported successfully!"
