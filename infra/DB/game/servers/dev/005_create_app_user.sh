#!/bin/sh
set -euo pipefail

# Create optional app user if MYSQL_APP_USER and MYSQL_APP_PASSWORD are set
if [ -n "${MYSQL_APP_USER:-}" ] && [ -n "${MYSQL_APP_PASSWORD:-}" ]; then
  echo "[005_create_app_user] Creating app user '${MYSQL_APP_USER}'"
  mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE USER IF NOT EXISTS '${MYSQL_APP_USER}'@'%' IDENTIFIED BY '${MYSQL_APP_PASSWORD}';
GRANT ALL PRIVILEGES ON db_auth.* TO '${MYSQL_APP_USER}'@'%';
GRANT ALL PRIVILEGES ON db_data.* TO '${MYSQL_APP_USER}'@'%';
GRANT ALL PRIVILEGES ON db_db.*   TO '${MYSQL_APP_USER}'@'%';
GRANT ALL PRIVILEGES ON db_post.* TO '${MYSQL_APP_USER}'@'%';
FLUSH PRIVILEGES;
SQL
  echo "[005_create_app_user] Done"
else
  echo "[005_create_app_user] MYSQL_APP_USER/PASSWORD not set; skipping"
fi
