# Docker Validation Guide

## Overview

This guide validates the MySQL 8.0 Docker infrastructure setup for EVS-DLC. The stack uses **MySQL 8.0 exclusively** - no MariaDB, no substitutions.

---

## Docker Compose Configuration

### Location

`infra/DB/game/docker-compose.yml`

### Verified Configuration

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: evs-lc-${SERVER:-dev}-mysql
    env_file:
      - .env
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-secret}
      MYSQL_APP_USER: ${MYSQL_APP_USER:-}
      MYSQL_APP_PASSWORD: ${MYSQL_APP_PASSWORD:-}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    command:
      - mysqld
      - --max_allowed_packet=1G
      - --net_read_timeout=600
      - --net_write_timeout=600
      - --connect_timeout=60
      - --wait_timeout=28800
      - --interactive_timeout=28800
    volumes:
      - mysql-data:/var/lib/mysql
      - ./servers/${SERVER:-dev}:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-p${MYSQL_ROOT_PASSWORD:-secret}"]
      interval: 10s
      timeout: 5s
      retries: 10
      
  adminer:
    image: adminer:4
    container_name: evs-lc-${SERVER:-dev}-adminer
    depends_on:
      - mysql
    ports:
      - "${ADMINER_PORT:-8080}:8080"
    environment:
      ADMINER_DEFAULT_SERVER: mysql

volumes:
  mysql-data:
    name: evs-lc-${SERVER:-dev}-mysql-data
```

---

## Critical Requirements

### ✅ DO

1. **Use MySQL 8.0**: The image must be `mysql:8.0`
2. **Maintain healthcheck**: Keep the mysqladmin ping healthcheck
3. **Preserve timeouts**: Keep all timeout configurations
4. **Use volume mounts**: Maintain persistent data and init scripts
5. **Keep Adminer**: Retain Adminer for database management

### ❌ DO NOT

1. **Replace MySQL with MariaDB**: Never use `mariadb:*` images
2. **Change database flavor**: Stick to MySQL 8.0
3. **Remove healthchecks**: These are critical for container orchestration
4. **Modify timeout values**: They are optimized for large operations
5. **Remove init script mounts**: Server-specific SQL files need to load

---

## Validation Steps

### 1. Verify Image

```bash
cd infra/DB/game
docker compose config | grep "image:"
```

**Expected Output**:
```
image: mysql:8.0
image: adminer:4
```

**NOT** MariaDB or any other variant.

### 2. Start Services

```bash
docker compose up -d
```

**Expected Output**:
```
✔ Container evs-lc-dev-mysql   Healthy
✔ Container evs-lc-dev-adminer Started
```

### 3. Check Container Health

```bash
docker ps --filter "name=evs-lc"
```

**Expected Output**:
```
CONTAINER ID   IMAGE        STATUS                    PORTS
abc123def456   mysql:8.0    Up 2 minutes (healthy)    0.0.0.0:3306->3306/tcp
def456ghi789   adminer:4    Up 2 minutes              0.0.0.0:8080->8080/tcp
```

Status must show `(healthy)` for MySQL container.

### 4. Verify MySQL Version

```bash
docker exec evs-lc-dev-mysql mysql --version
```

**Expected Output**:
```
mysql  Ver 8.0.x for Linux on x86_64 (MySQL Community Server - GPL)
```

### 5. Test Connection

```bash
docker exec evs-lc-dev-mysql mysql -uroot -proot -e "SELECT VERSION();"
```

**Expected Output**:
```
+-----------+
| VERSION() |
+-----------+
| 8.0.x     |
+-----------+
```

### 6. Verify Databases

```bash
docker exec evs-lc-dev-mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

**Expected Databases**:
- `db_auth`
- `db_db` (game database)
- `db_data`
- `db_post`

### 7. Check Init Scripts

```bash
docker exec evs-lc-dev-mysql ls -la /docker-entrypoint-initdb.d/
```

This should list any .sql files that were auto-loaded from `./servers/dev/`.

---

## Environment Variables

### Required .env File

Location: `infra/DB/game/.env`

```env
SERVER=dev
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root
MYSQL_APP_USER=evs
MYSQL_APP_PASSWORD=change-me
```

### Variable Descriptions

- **SERVER**: Environment name (dev, staging, prod) - affects container naming
- **MYSQL_PORT**: Exposed port for MySQL (default: 3306)
- **MYSQL_ROOT_PASSWORD**: Root password - must match backend DB_*_PASS
- **MYSQL_APP_USER**: Optional application user
- **MYSQL_APP_PASSWORD**: Optional application user password

---

## Troubleshooting

### Container Won't Start

**Symptom**: `docker compose up -d` fails

**Solutions**:
1. Check if port 3306 is already in use: `lsof -i :3306`
2. Remove old containers: `docker compose down -v`
3. Check .env file exists and is valid
4. Review logs: `docker compose logs mysql`

### Container Shows Unhealthy

**Symptom**: `docker ps` shows `(unhealthy)` status

**Solutions**:
1. Check logs: `docker compose logs mysql`
2. Verify MYSQL_ROOT_PASSWORD is set correctly
3. Wait longer - healthcheck retries 10 times with 10s intervals
4. Ensure mysqladmin binary is available in container

### Cannot Connect from Backend

**Symptom**: Backend shows database connection errors

**Solutions**:
1. Verify container is running and healthy
2. Check backend .env uses `127.0.0.1` not `localhost`
3. Ensure MYSQL_ROOT_PASSWORD matches DB_*_PASS values
4. Test connection manually: `mysql -h127.0.0.1 -uroot -proot`

### Init Scripts Not Running

**Symptom**: Databases don't exist after startup

**Solutions**:
1. Check `./servers/dev/` directory has .sql files
2. Volume mount is read-only (`:ro`) - this is correct
3. Remove volume and restart: `docker compose down -v && docker compose up -d`
4. Check file permissions on .sql files

### Wrong Database Version

**Symptom**: MySQL version is not 8.0.x

**Solutions**:
1. Update docker-compose.yml image to `mysql:8.0`
2. Pull latest MySQL 8.0: `docker compose pull mysql`
3. Remove old containers: `docker compose down -v`
4. Recreate: `docker compose up -d`

---

## Performance Tuning

The configuration includes optimized settings for DLC operations:

```yaml
command:
  - --max_allowed_packet=1G      # Large packet support for bulk operations
  - --net_read_timeout=600        # 10 minute read timeout
  - --net_write_timeout=600       # 10 minute write timeout
  - --connect_timeout=60          # 1 minute connection timeout
  - --wait_timeout=28800          # 8 hour idle connection timeout
  - --interactive_timeout=28800   # 8 hour interactive timeout
```

**Do not modify these values** unless you have specific performance requirements.

---

## Adminer Access

Adminer provides a web interface for database management.

**URL**: http://localhost:8080

**Login**:
- System: MySQL
- Server: mysql
- Username: root
- Password: root (or value from MYSQL_ROOT_PASSWORD)
- Database: (leave empty or select specific database)

---

## Backup and Restore

### Create Backup

```bash
docker exec evs-lc-dev-mysql mysqldump -uroot -proot --all-databases > backup.sql
```

### Restore Backup

```bash
docker exec -i evs-lc-dev-mysql mysql -uroot -proot < backup.sql
```

### Backup Specific Database

```bash
docker exec evs-lc-dev-mysql mysqldump -uroot -proot db_data > db_data_backup.sql
```

---

## Version History

- **v0.7.1**: Confirmed MySQL 8.0 as exclusive database, documented validation steps
- **v0.6.0**: Added Redis cache service (optional)
- **v0.5.1**: Initial Docker validation documentation
