# Frontend Environment Sync Guide

## Overview

This guide explains how environment variables link between the frontend (DLC Web Admin) and backend (DLC API) applications, ensuring proper synchronization and communication.

**Version:** 0.8.5
**Last Updated:** 2025-11-20

---

## Environment Variable Flow

```
┌──────────────────────────────────────────────────────┐
│  Frontend .env                                       │
│  tools/apps/dlc-dev-studios/frontend/.env          │
│                                                      │
│  VITE_API_URL=http://localhost:30089                │
│  # Optional overrides                              │
│  # VITE_API_HEALTH_URL=http://localhost:30089/health │
│  # VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis │
│  # VITE_DB_HEALTH_URL=http://localhost:30089/ops/db │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ Compiled into JavaScript
                   │ via import.meta.env.VITE_*
                   ▼
┌──────────────────────────────────────────────────────┐
│  Frontend Runtime Config                             │
│  src/core/config/env.ts                             │
│                                                      │
│  export const ENV = {                               │
│    API_URL: import.meta.env.VITE_API_URL,          │
│    API_HEALTH_URL: import.meta.env.VITE_API_HEALTH_URL │
│  }                                                  │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ HTTP Requests
                   ▼
┌──────────────────────────────────────────────────────┐
│  Backend .env                                        │
│  tools/apps/dlc-api/.env                            │
│                                                      │
│  API_PORT=30089                                     │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ Read at startup
                   ▼
┌──────────────────────────────────────────────────────┐
│  Backend Runtime Config                              │
│  src/config/env.ts                                  │
│                                                      │
│  export const env = {                               │
│    apiPort: getEnvNumber('API_PORT', 30089)        │
│  }                                                  │
└──────────────────────────────────────────────────────┘
```

---

## Frontend Environment Variables

### Location
`tools/apps/dlc-dev-studios/frontend/.env`

### Required Variables

Only the base API URL is required in `.env` for the new HTTP bridge mode:

```bash
VITE_API_URL=http://localhost:30089
```

### Optional Overrides

Override these values only if your backend uses non-standard routes:

```bash
# Health endpoints (automatically derived from VITE_API_URL if omitted)
VITE_API_HEALTH_URL=http://localhost:30089/health
VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis
VITE_DB_HEALTH_URL=http://localhost:30089/ops/db

# Frontend metadata (defaults baked into the app)
VITE_APP_ENV=development
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.8.5

# Behaviour toggles
VITE_API_TIMEOUT=8000
VITE_DATA_CACHE=true
VITE_ENABLE_DEBUG_PANEL=true
VITE_LOG_LEVEL=debug
```

### Variable Descriptions

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | `http://localhost:30089` | Base URL for all API requests |
| `VITE_API_HEALTH_URL` | string | `${VITE_API_URL}/health` | Health check endpoint (derived) |
| `VITE_REDIS_HEALTH_URL` | string | `${VITE_API_URL}/ops/redis` | Redis health endpoint (derived) |
| `VITE_DB_HEALTH_URL` | string | `${VITE_API_URL}/ops/db` | Database health endpoint (derived) |
| `VITE_APP_ENV` | string | `development` | Application environment |
| `VITE_APP_NAME` | string | `DLC Web Admin` | Application display name |
| `VITE_APP_VERSION` | string | `0.8.5` | Application version |
| `VITE_API_TIMEOUT` | number | `8000` | API request timeout in ms |
| `VITE_DATA_CACHE` | boolean | `true` | Enable client-side data caching |
| `VITE_ENABLE_DEBUG_PANEL` | boolean | `true` | Show debug panel in development |
| `VITE_LOG_LEVEL` | string | `debug` | Logging level (debug, info, warn, error) |

### Important Notes

**⚠️ VITE_ Prefix Required:**
- All environment variables MUST start with `VITE_`
- Vite only exposes variables with this prefix to the client
- Variables without `VITE_` prefix are not accessible

**🔄 Restart Required:**
- Changes to `.env` require restarting the dev server
- Stop and restart: `Ctrl+C` then `pnpm dev`

**🏗️ Build Time Variables:**
- Environment variables are compiled at build time
- Production builds need correct `.env` values before building
- Runtime changes require a rebuild

---

## Backend Environment Variables

### Location
`tools/apps/dlc-api/.env`

### Required Variables

```bash
# API Configuration
API_PORT=30089
NODE_ENV=development

# JWT Configuration (for future auth implementation)
JWT_SECRET=dev-secret

# Auth Database (db_auth)
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth

# Game Database (db_db)
DB_GAME_HOST=localhost
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASS=root
DB_GAME_NAME=db_db

# Data Database (db_data)
DB_DATA_HOST=localhost
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=root
DB_DATA_NAME=db_data

# Post Database (db_post)
DB_POST_HOST=localhost
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASS=root
DB_POST_NAME=db_post
```

### Variable Descriptions

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `API_PORT` | number | `30089` | Port the API server listens on |
| `NODE_ENV` | string | `development` | Node environment |
| `JWT_SECRET` | string | `dev-secret` | JWT signing secret (future use) |
| `DB_*_HOST` | string | `localhost` | Database host |
| `DB_*_PORT` | number | `3306` | Database port |
| `DB_*_USER` | string | `root` | Database user |
| `DB_*_PASS` | string | `root` | Database password |
| `DB_*_NAME` | string | varies | Database name |

---

## Synchronization Rules

### Port Synchronization

**Frontend MUST match Backend:**

```bash
# Backend
API_PORT=30089

# Frontend MUST use the same port
VITE_API_URL=http://localhost:30089
VITE_API_HEALTH_URL=http://localhost:30089/health
```

**⚠️ Common Mistake:**
```bash
# ❌ WRONG - Ports don't match
API_PORT=30089  # Backend
VITE_API_URL=http://localhost:4000  # Frontend (old port)

# ✅ CORRECT - Ports match
API_PORT=30089  # Backend
VITE_API_URL=http://localhost:30089  # Frontend
```

### URL Path Synchronization

**Health Endpoint:**
```bash
# Backend Controller
@Controller('health')  // Creates /health endpoint

# Frontend MUST match
VITE_API_HEALTH_URL=http://localhost:30089/health  # ✅ Correct
```

**API Endpoints:**
```bash
# Backend serves data endpoints under /api
# (global prefix could be configured)

# Frontend MUST include /api in base URL
VITE_API_URL=http://localhost:30089/api  # ✅ Correct
```

### Protocol and Host Synchronization

**Development (Default):**
```bash
# Both use localhost with HTTP
http://localhost:30089
```

**Production:**
```bash
# Frontend
VITE_API_URL=https://api.yourdomain.com/api

# Backend needs to match domain/SSL setup
# Configure through reverse proxy (nginx, etc.)
```

---

## Configuration Workflow

### 1. Initial Setup

```bash
# 1. Copy environment templates
cd tools/apps/dlc-api
cp .env.example .env

cd tools/apps/dlc-dev-studios/frontend
cp .env.example .env

# 2. Verify port matches in both files
# Backend: API_PORT=30089
# Frontend: VITE_API_URL=http://localhost:30089/api

# 3. Start services
cd tools/apps/dlc-api
pnpm dev

cd tools/apps/dlc-dev-studios/frontend
pnpm dev
```

### 2. Changing the API Port

**If you need to change from 30089 to another port:**

```bash
# 1. Update Backend .env
API_PORT=8080

# 2. Update Frontend .env (ALL references)
VITE_API_URL=http://localhost:8080/api
VITE_API_HEALTH_URL=http://localhost:8080/health
VITE_REDIS_HEALTH_URL=http://localhost:8080/ops/redis
VITE_DB_HEALTH_URL=http://localhost:8080/ops/db

# 3. Restart both services
```

### 3. Production Configuration

**Backend .env:**
```bash
API_PORT=30089
NODE_ENV=production
# ... database configs point to production DB
```

**Frontend .env:**
```bash
VITE_APP_ENV=production
VITE_API_URL=https://api.yourdomain.com/api
VITE_API_HEALTH_URL=https://api.yourdomain.com/health
VITE_LOG_LEVEL=error
VITE_ENABLE_DEBUG_PANEL=false
```

---

## Proxy Configuration (Alternative)

### When to Use Proxy

Use Vite's proxy when:
- You want to avoid CORS issues in development
- You want frontend and backend on same origin
- You're experiencing connection problems

### Proxy Setup

**Edit `vite.config.ts`:**
```typescript
export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:30089',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:30089',
        changeOrigin: true,
      },
    },
  },
})
```

**Then update Frontend .env:**
```bash
# Use relative URLs (proxy will forward to backend)
VITE_API_URL=/api
VITE_API_HEALTH_URL=/health
```

**Pros:**
- No CORS issues
- Same-origin requests
- Simpler frontend config

**Cons:**
- Only works in development
- Production needs different config
- Can hide production CORS issues

---

## Troubleshooting

### Issue: Frontend can't reach API

**Symptoms:**
- Network errors in browser console
- "Failed to fetch" errors
- CORS errors

**Checklist:**
1. ✅ Is API running? Check terminal
2. ✅ Is API on correct port? Check API logs
3. ✅ Does port in frontend .env match API port?
4. ✅ Can you curl the endpoint?
   ```bash
   curl http://localhost:30089/health
   ```
5. ✅ Is CORS enabled in API? Check `src/main.ts`

### Issue: Environment variables not updating

**Symptoms:**
- Changes to .env don't take effect
- App still uses old values

**Solutions:**
1. **Restart dev server:**
   ```bash
   # Stop with Ctrl+C, then:
   pnpm dev
   ```

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Linux/Windows) or `Cmd+Shift+R` (Mac)
   - Or open DevTools and disable cache

3. **Check variable name has VITE_ prefix** (frontend only)

4. **Production build: Rebuild the app:**
   ```bash
   pnpm build
   ```

### Issue: Wrong API URL in production

**Symptoms:**
- Production app tries to connect to localhost
- API calls fail in production

**Solution:**
1. Check production .env before building
2. Rebuild with correct production env
3. Verify env vars in built files:
   ```bash
   grep -r "localhost" dist/
   # Should return nothing in production build
   ```

---

## Validation Checklist

Use this checklist to verify environment sync:

### Backend Configuration
- [ ] `.env` file exists in `tools/apps/dlc-api/`
- [ ] `API_PORT` is set to `30089`
- [ ] Database variables are configured
- [ ] API starts without errors
- [ ] Health endpoint accessible: `curl http://localhost:30089/health`

### Frontend Configuration
- [ ] `.env` file exists in `tools/apps/dlc-dev-studios/frontend/`
- [ ] `VITE_API_URL` uses port `30089`
- [ ] `VITE_API_HEALTH_URL` uses port `30089`
- [ ] Frontend starts without errors
- [ ] Health monitor shows green status

### Integration
- [ ] Frontend can fetch from API
- [ ] No CORS errors in console
- [ ] Health monitor shows "API: Online"
- [ ] Data endpoints work (items, skills, etc.)

---

## Quick Reference

### Environment File Locations

```
EVS-DLC/
├── tools/apps/dlc-api/
│   └── .env                    ← Backend config
└── tools/apps/dlc-dev-studios/frontend/
    └── .env                    ← Frontend config
```

### Key Sync Points

| Backend (.env) | Frontend (.env) | Must Match |
|----------------|-----------------|------------|
| `API_PORT=30089` | `VITE_API_URL=http://localhost:30089/api` | ✅ Port |
| `API_PORT=30089` | `VITE_API_HEALTH_URL=http://localhost:30089/health` | ✅ Port |

### Testing Commands

```bash
# Test backend
curl http://localhost:30089/health

# Test frontend (in browser console)
fetch(import.meta.env.VITE_API_HEALTH_URL)
  .then(r => r.json())
  .then(console.log)

# View all frontend env vars (in browser console)
console.log(import.meta.env)
```

---

## Next Steps

For more information:
- [System Health Check Guide](./SYSTEM_HEALTH_CHECK.md)
- [Backend Boot Flow](./BACKEND_BOOT_FLOW.md)
- [Infrastructure Status Report](./INFRA_STATUS_REPORT_v0.5.1.md)
