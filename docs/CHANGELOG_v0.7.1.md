# Changelog - v0.7.1 (Stable Sync Build)

**Release Date**: 2025-10-17  
**Codename**: Universal MySQL 8.0 Fix Build

---

## Overview

Version 0.7.1 represents a comprehensive synchronization and standardization effort across the entire EVS-DLC ecosystem. This release ensures all components (backend, frontend, infrastructure) work together seamlessly with MySQL 8.0 as the exclusive database service.

---

## Key Changes

### Backend (dlc-api)

#### Version Update
- Updated version from 0.6.0 to **0.7.1**
- Updated all version strings in logs and responses

#### API Structure
- **Removed** global `/api` prefix - all routes now at root level
- Health endpoint: `/health` (not `/api/health`)
- Data endpoints: `/data/*` (not `/api/data/*`)
- Game endpoints: `/game/*` (not `/api/game/*`)

#### New Endpoints
- **`GET /ops/redis`**: Redis cache health status
  - Returns connection status and key count
  - Response: `{ status: "ok", connected: true, keys: 42 }`
  
- **`GET /ops/db`**: Database health status
  - Returns status of all 4 databases (auth, game, data, post)
  - Response: `{ status: "ok", databases: {...} }`

#### Health Endpoint Enhancement
- Updated `/health` to return version 0.7.1
- Includes comprehensive database and cache status
- Returns `ok` or `degraded` based on database health

#### Configuration
- Updated `.env.example` with standardized format
- Changed database hosts from `localhost` to `127.0.0.1`
- Added `LOG_LEVEL` configuration
- Updated `JWT_SECRET` placeholder for production clarity

#### Modules
- **Added** `OpsModule` for operational endpoints
- Registered OpsModule in AppModule

---

### Frontend (dlc-web-admin)

#### Version Update
- Updated version from 0.5.1 to **0.7.1**

#### API Integration
- **Updated** `VITE_API_URL` from `http://localhost:30089/api` to `http://localhost:30089`
- Removed `/api` prefix from all API calls
- Updated health check URLs:
  - Main health: `/health`
  - Redis health: `/ops/redis`
  - DB health: `/ops/db`

#### Proxy Configuration
- **Enabled** Vite proxy for development
- Added proxy rules for `/health`, `/ops`, `/data`, `/game`
- Simplifies local development without CORS issues

#### Configuration
- Updated `.env.example` with v0.7.1 settings
- Aligned version numbers across all configs

---

### Infrastructure (Docker)

#### Validation
- **Confirmed** MySQL 8.0 as exclusive database service
- **No changes** to docker-compose.yml (working configuration preserved)
- Documented that MariaDB substitution is forbidden

#### Health Checks
- Validated MySQL healthcheck configuration
- Verified timeout settings for large operations
- Confirmed volume mount strategy

---

### Documentation

#### New Documentation
- **`docs/agents/AGENT_DLC_UNIVERSAL_FIX_v0.7.1.md`**: Complete agent directive for repository validation
- **`docs/ENV_SYNC_GUIDE.md`**: Environment variable synchronization guide
- **`docs/HEALTH_ENDPOINTS.md`**: Comprehensive health endpoint documentation
- **`docs/DOCKER_VALIDATION.md`**: Docker infrastructure validation guide
- **`docs/CHANGELOG_v0.7.1.md`**: This changelog

---

## Breaking Changes

### API Prefix Removal

**Before (v0.6.0)**:
```
GET http://localhost:30089/api/health
GET http://localhost:30089/api/data/items
```

**After (v0.7.1)**:
```
GET http://localhost:30089/health
GET http://localhost:30089/data/items
```

**Migration**:
- Update all API client code to remove `/api` prefix
- Update environment variables: `VITE_API_URL=http://localhost:30089` (no `/api`)
- Frontend .env updated automatically

### Database Host Changes

**Before**:
```env
DB_AUTH_HOST=localhost
```

**After**:
```env
DB_AUTH_HOST=127.0.0.1
```

**Migration**:
- Update all database host variables to use `127.0.0.1`
- Backend .env.example updated with correct values

---

## New Features

### Operational Endpoints

Two new endpoints for monitoring:

1. **Redis Status** (`/ops/redis`)
   - Monitor cache connection
   - Track number of cached keys
   - Quick diagnostics for cache issues

2. **Database Status** (`/ops/db`)
   - Individual status per database
   - Identify specific database connection problems
   - Separate from main health check

### Enhanced Health Monitoring

- Version information in health response
- Detailed database status breakdown
- Cache connection and key count
- Timestamp on all responses

---

## Bug Fixes

- Fixed route prefix inconsistencies between frontend and backend
- Corrected database host configuration (localhost → 127.0.0.1)
- Aligned version numbers across all components
- Fixed health endpoint paths in frontend environment

---

## Configuration Changes

### Backend .env.example

```diff
- DB_AUTH_HOST=localhost
+ DB_AUTH_HOST=127.0.0.1

- JWT_SECRET=dev-secret
+ JWT_SECRET=replace-this-before-prod

+ LOG_LEVEL=debug
```

### Frontend .env.example

```diff
- VITE_APP_VERSION=0.5.1
+ VITE_APP_VERSION=0.7.1

- VITE_API_URL=http://localhost:30089/api
+ VITE_API_URL=http://localhost:30089
```

---

## Testing

### Validation Checklist

- [x] Backend starts successfully with `pnpm dev`
- [x] Version displays as 0.7.1 in logs
- [x] `GET /health` returns status "ok" and version "0.7.1"
- [x] `GET /ops/redis` returns Redis status
- [x] `GET /ops/db` returns database status
- [x] Frontend .env.example has correct configuration
- [x] Backend .env.example has correct configuration
- [x] Vite proxy configuration active
- [x] Docker Compose uses MySQL 8.0 (no MariaDB)
- [x] All documentation files created

---

## Upgrade Guide

### From v0.6.0 to v0.7.1

1. **Update Backend**:
   ```bash
   cd tools/apps/dlc-api
   git pull
   # Update .env based on .env.example
   pnpm install
   pnpm dev
   ```

2. **Update Frontend**:
   ```bash
   cd tools/apps/dlc-dev-studios/frontend
   git pull
   # Update .env based on .env.example
   # Remove /api from VITE_API_URL
   pnpm install
   pnpm dev
   ```

3. **Verify Infrastructure**:
   ```bash
   cd infra/DB/game
   docker compose ps
   # Should show mysql:8.0 healthy
   ```

4. **Test Endpoints**:
   ```bash
   curl http://localhost:30089/health
   curl http://localhost:30089/ops/redis
   curl http://localhost:30089/ops/db
   ```

---

## Known Issues

None reported in this release.

---

## Contributors

- Development Team: Full-stack synchronization and standardization
- Documentation: Comprehensive guide creation

---

## Next Steps (v0.8.0 Roadmap)

- [ ] Implement authentication endpoints
- [ ] Add user management features
- [ ] Enhance caching strategies
- [ ] Performance optimization
- [ ] Additional monitoring metrics

---

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review health endpoints for system status
3. Consult ENV_SYNC_GUIDE.md for configuration issues

---

**Version 0.7.1 - Universal MySQL 8.0 Fix Build**  
*Stable, synchronized, and ready for production deployment.*
