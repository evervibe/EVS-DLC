# System Health Check Guide

## Overview

This document provides a comprehensive overview of all services in the EVS-DLC system and their connection paths. Use this guide to understand the health monitoring system and troubleshoot connectivity issues.

**Version:** 0.5.1  
**Last Updated:** 2025-10-17

---

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Vite + React)                │
│                     Port: 5173 (Development)                 │
│                                                              │
│  Health Monitor Dashboard                                   │
│  - Checks API Health                                        │
│  - Monitors Redis (optional)                                │
│  - Monitors Databases                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS + Fastify)            │
│                         Port: 30089                          │
│                                                              │
│  Routes:                                                    │
│  - GET /health        → Health check & DB status           │
│  - GET /health/ready  → Readiness probe                    │
│  - GET /api/*         → Data endpoints                     │
└────────────────────────┬────────────────────────────────────┘
                         │ Database Connections
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  MySQL Databases (Docker)                    │
│                         Port: 3306                           │
│                                                              │
│  - db_auth  → Authentication data                          │
│  - db_db    → Game data (items, skills, etc.)              │
│  - db_data  → Additional data                              │
│  - db_post  → Post-related data                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             Redis Cache (Optional - v0.6.0+)                 │
│                         Port: 6379                           │
│                                                              │
│  Currently disabled by default                              │
│  Enable in docker-compose.yml when needed                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Health Endpoints

### 1. API Health Check

**Endpoint:** `GET http://localhost:30089/health`

**Purpose:** Check overall API health and database connectivity

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T16:00:00.000Z",
  "version": "0.5.1",
  "databases": {
    "auth": true,
    "game": true,
    "data": true,
    "post": true
  }
}
```

**Status Values:**
- `ok` - All databases connected
- `degraded` - One or more databases unavailable

### 2. API Readiness Check

**Endpoint:** `GET http://localhost:30089/health/ready`

**Purpose:** Simple readiness probe for orchestration systems

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-10-17T16:00:00.000Z"
}
```

### 3. Frontend Health Monitoring

**Location:** `http://localhost:5173/health-monitor`

**Purpose:** Visual dashboard for real-time system health monitoring

**Features:**
- Real-time status of API server
- Database connection status
- Redis cache status (when enabled)
- Auto-refresh every 5 seconds
- Manual refresh button

---

## Connection Paths

### Frontend → API

**Configuration:** `.env` file in `tools/apps/dlc-dev-studios/frontend/`

```bash
VITE_API_URL=http://localhost:30089/api
VITE_API_HEALTH_URL=http://localhost:30089/health
```

**Verification:**
```bash
# From browser console
fetch('http://localhost:30089/health')
  .then(r => r.json())
  .then(console.log)
```

### API → Databases

**Configuration:** `.env` file in `tools/apps/dlc-api/`

```bash
# Example for one database
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth
```

**Verification:**
```bash
# Test database connection manually
mysql -h localhost -P 3306 -u root -proot db_auth
```

### API → Redis (Optional)

**Status:** Prepared but not yet implemented  
**Target Version:** v0.6.0

**Future Configuration:**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## Health Check Scenarios

### Scenario 1: All Services Healthy

**Expected Result:**
```
✅ API Server: Online
✅ Database: Online
✅ Redis: Online (if enabled)
```

**Frontend Display:**
- All cards show green checkmarks
- Overall status: "Healthy"
- All database connections: true

### Scenario 2: Database Unavailable

**Symptoms:**
- API starts but shows warnings
- Health endpoint returns `"status": "degraded"`
- Frontend shows red X for database

**Troubleshooting:**
1. Check if Docker containers are running:
   ```bash
   cd infra/DB/game
   docker compose ps
   ```

2. Start databases if stopped:
   ```bash
   docker compose up -d
   ```

3. Check database logs:
   ```bash
   docker compose logs mysql
   ```

### Scenario 3: CORS Issues

**Symptoms:**
- API responds in browser but fails from frontend
- Console shows CORS errors

**Solution:**
1. Verify CORS is enabled in `src/main.ts`:
   ```typescript
   app.enableCors({
     origin: true,
     credentials: true,
   });
   ```

2. Check API logs for CORS messages:
   ```bash
   cd tools/apps/dlc-api
   pnpm dev
   # Look for: ✅ CORS enabled
   ```

### Scenario 4: Port Conflicts

**Symptoms:**
- API fails to start with "EADDRINUSE" error

**Solution:**
1. Check what's using port 30089:
   ```bash
   lsof -i :30089
   # or
   netstat -an | grep 30089
   ```

2. Kill conflicting process or change port in `.env`

---

## Testing Health Checks

### Manual Testing

**1. Test API Health Directly:**
```bash
curl http://localhost:30089/health
```

**2. Test with JSON formatting:**
```bash
curl http://localhost:30089/health | jq
```

**3. Test from Frontend:**
- Navigate to: `http://localhost:5173/health-monitor`
- Observe status indicators
- Click "Refresh" to force update

### Automated Testing

**API Tests:**
```bash
cd tools/apps/dlc-api
pnpm test
```

**Health Endpoint Test:**
```bash
cd tools/apps/dlc-api
pnpm test tests/connectivity.e2e-spec.ts
```

---

## Monitoring Best Practices

### Development

1. **Keep Health Monitor Open:**
   - Open `http://localhost:5173/health-monitor` in a browser tab
   - Monitor during development for connectivity issues

2. **Check Logs Regularly:**
   ```bash
   # API logs
   cd tools/apps/dlc-api
   pnpm dev

   # Database logs
   cd infra/DB/game
   docker compose logs -f mysql
   ```

3. **Use Health Checks Before Testing:**
   - Always verify `/health` returns OK before testing features
   - Confirms your environment is properly configured

### Production

1. **Set Up Health Check Probes:**
   - Liveness: `/health/ready`
   - Readiness: `/health`

2. **Monitor Database Status:**
   - Set alerts for `"status": "degraded"`
   - Monitor individual database flags

3. **Log Aggregation:**
   - Collect health check results
   - Alert on persistent failures

---

## Quick Reference

### Service Endpoints

| Service | Port | Health Check | Purpose |
|---------|------|--------------|---------|
| Frontend | 5173 | N/A | Web UI |
| API | 30089 | /health | Backend API |
| MySQL | 3306 | Docker healthcheck | Databases |
| Redis | 6379 | N/A (optional) | Cache |
| Adminer | 8080 | N/A | DB Admin UI |

### Health Check URLs

| Check | URL | Expected Response |
|-------|-----|-------------------|
| API Basic | http://localhost:30089/health | `{"status": "ok"}` |
| API Ready | http://localhost:30089/health/ready | `{"status": "ready"}` |
| Frontend Monitor | http://localhost:5173/health-monitor | Dashboard UI |

### Common Commands

```bash
# Start all services
cd infra/DB/game && docker compose up -d
cd tools/apps/dlc-api && pnpm dev
cd tools/apps/dlc-dev-studios/frontend && pnpm dev

# Check all health
curl http://localhost:30089/health | jq

# View logs
docker compose logs -f mysql
cd tools/apps/dlc-api && pnpm dev # (logs to console)

# Stop all services
docker compose down
# (Ctrl+C in API and Frontend terminals)
```

---

## Troubleshooting Checklist

- [ ] Are Docker databases running? (`docker compose ps`)
- [ ] Is API running on port 30089? (`lsof -i :30089`)
- [ ] Is Frontend running on port 5173? (`lsof -i :5173`)
- [ ] Can you curl the health endpoint? (`curl localhost:30089/health`)
- [ ] Are .env files configured correctly?
- [ ] Is CORS enabled in API?
- [ ] Are database credentials correct?
- [ ] Can you connect to MySQL directly? (`mysql -h localhost -u root -proot`)

---

## Next Steps

For more detailed information, see:
- [Frontend ENV Sync Guide](./FRONTEND_ENV_SYNC_GUIDE.md)
- [Backend Boot Flow](./BACKEND_BOOT_FLOW.md)
- [Infrastructure Status Report](./INFRA_STATUS_REPORT_v0.5.1.md)
