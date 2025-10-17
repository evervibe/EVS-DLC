# Environment Synchronization Guide

## Overview

This guide ensures proper environment variable synchronization across the EVS-DLC ecosystem components: backend API, frontend, and infrastructure.

---

## Backend Environment (.env for dlc-api)

Location: `tools/apps/dlc-api/.env`

### Required Variables

```env
# API Configuration
API_PORT=30089
NODE_ENV=development
JWT_SECRET=replace-this-before-prod

# Auth Database (db_auth)
DB_AUTH_HOST=127.0.0.1
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth

# Game Database (db_db)
DB_GAME_HOST=127.0.0.1
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASS=root
DB_GAME_NAME=db_db

# Data Database (db_data)
DB_DATA_HOST=127.0.0.1
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=root
DB_DATA_NAME=db_data

# Post Database (db_post)
DB_POST_HOST=127.0.0.1
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASS=root
DB_POST_NAME=db_post

# Cache/Redis Configuration
USE_CACHE=false
REDIS_URL=redis://localhost:6379
CACHE_TTL=120
CACHE_PREFIX=dlc
PRELOAD_ON_START=false
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
LOG_LEVEL=debug
```

### Notes

- All database hosts use `127.0.0.1` (not `localhost`) for consistency
- Database names follow the convention: `db_auth`, `db_db`, `db_data`, `db_post`
- Note that the game database is named `db_db`, not `db_game`
- Cache is disabled by default (`USE_CACHE=false`)

---

## Frontend Environment (.env for frontend)

Location: `tools/apps/dlc-dev-studios/frontend/.env`

### Required Variables

```env
VITE_APP_ENV=development
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.7.1
VITE_API_URL=http://localhost:30089
VITE_API_HEALTH_URL=http://localhost:30089/health
VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis
VITE_DB_HEALTH_URL=http://localhost:30089/ops/db
VITE_API_TIMEOUT=8000
VITE_DATA_CACHE=true
VITE_ENABLE_DEBUG_PANEL=true
VITE_LOG_LEVEL=debug
```

### Notes

- API URL has **no `/api` prefix** - routes are accessed directly
- Health endpoints are at root level (`/health`, `/ops/redis`, `/ops/db`)
- Version should match the backend version (0.7.1)

---

## Infrastructure Environment (.env for Docker)

Location: `infra/DB/game/.env`

### Required Variables

```env
SERVER=dev
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root
MYSQL_APP_USER=evs
MYSQL_APP_PASSWORD=change-me
```

### Notes

- `MYSQL_ROOT_PASSWORD` must match `DB_*_PASS` values in backend .env
- Container uses MySQL 8.0 (not MariaDB)
- Server variable determines container naming (`evs-lc-dev-mysql`)

---

## Synchronization Checklist

Before starting development, verify:

- [ ] Backend .env exists and has all required database connection variables
- [ ] Frontend .env exists with correct API_URL (port 30089)
- [ ] Infrastructure .env matches database credentials from backend
- [ ] No conflicting port assignments across services
- [ ] Version numbers are consistent (v0.7.1)

---

## Common Issues

### Frontend Cannot Connect to Backend

**Symptom**: Health check fails, API calls timeout

**Solution**: 
1. Verify backend is running on port 30089
2. Check `VITE_API_URL` has no `/api` prefix
3. Ensure CORS is enabled in backend

### Database Connection Failures

**Symptom**: Backend logs show database connection errors

**Solution**:
1. Verify MySQL container is running: `docker ps`
2. Check database credentials match between backend .env and infrastructure .env
3. Ensure host is `127.0.0.1` not `localhost`
4. Confirm all 4 databases exist in MySQL container

### Health Endpoints Return 404

**Symptom**: `/health`, `/ops/redis`, or `/ops/db` return 404

**Solution**:
1. Verify backend has no global prefix set in main.ts
2. Check HealthModule and OpsModule are imported in app.module.ts
3. Restart backend after changes

---

## Quick Setup Guide

### 1. Copy Example Files

```bash
# Backend
cd tools/apps/dlc-api
cp .env.example .env

# Frontend
cd tools/apps/dlc-dev-studios/frontend
cp .env.example .env

# Infrastructure
cd infra/DB/game
cp .env.example .env
```

### 2. Start Infrastructure

```bash
cd infra/DB/game
docker compose up -d
```

### 3. Start Backend

```bash
cd tools/apps/dlc-api
pnpm install
pnpm dev
```

### 4. Start Frontend

```bash
cd tools/apps/dlc-dev-studios/frontend
pnpm install
pnpm dev
```

### 5. Verify

- Backend: http://localhost:30089/health
- Frontend: http://localhost:5174
- Adminer: http://localhost:8080

---

## Version History

- **v0.7.1**: Standardized environment variables, removed /api prefix, added ops endpoints
- **v0.6.0**: Added Redis cache configuration
- **v0.5.1**: Initial environment synchronization guide
