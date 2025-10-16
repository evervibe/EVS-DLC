#!/bin/sh
set -euo pipefail

# Import order is important. Dumps live in a subfolder to avoid double execution
# by the MySQL entrypoint which scans /docker-entrypoint-initdb.d/*.
DUMPS_DIR="/docker-entrypoint-initdb.d/dumps"
MYSQL_CLIENT_OPTS="--max_allowed_packet=1G --connect-timeout=600"

echo "[010_import] Importing MySQL dumps from ${DUMPS_DIR}"
echo "[010_import] -> db_auth"
mysql ${MYSQL_CLIENT_OPTS} -u root -p"${MYSQL_ROOT_PASSWORD}" db_auth < "${DUMPS_DIR}/db_auth.sql"
echo "[010_import] -> db_data"
mysql ${MYSQL_CLIENT_OPTS} -u root -p"${MYSQL_ROOT_PASSWORD}" db_data < "${DUMPS_DIR}/db_data.sql"
echo "[010_import] -> db_db"
mysql ${MYSQL_CLIENT_OPTS} -u root -p"${MYSQL_ROOT_PASSWORD}" db_db   < "${DUMPS_DIR}/db_db.sql"
echo "[010_import] -> db_post"
mysql ${MYSQL_CLIENT_OPTS} -u root -p"${MYSQL_ROOT_PASSWORD}" db_post < "${DUMPS_DIR}/db_post.sql"

echo "[010_import] Done"
