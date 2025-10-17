# HTTP Development Mode Overview (v0.8.5)

Version 0.8.5 introduces a streamlined HTTP-only workflow for connecting the DLC Admin UI and DLC API locally. This document summarises the architecture, configuration, and verification steps.

## Why HTTP Mode?
- 🔐 Simplifies CORS and cookie handling without generating self-signed certificates.
- ⚡ Speeds up onboarding—developers only need `pnpm dev` for each service.
- 🧪 Mirrors production endpoints (`/health`, `/ops/*`) for proactive monitoring while allowing optional services to fail gracefully.

## Core Settings
| Component | File | Key Setting | Value |
|-----------|------|-------------|-------|
| Admin UI | `tools/apps/dlc-dev-studios/frontend/.env` | `VITE_API_URL` | `http://localhost:30089` |
| Admin UI | `tools/apps/dlc-dev-studios/frontend/vite.config.ts` | `server.port` | `5174` |
| DLC API | `tools/apps/dlc-api/src/main.ts` | `enableCors.origin` | `['http://localhost:5174']` |
| DLC API | `tools/apps/dlc-api/package.json` | `version` | `0.8.5` |

## Request Flow
```
Browser (http://localhost:5174)
   │
   ├─ Axios → VITE_API_URL (http://localhost:30089)
   │      ├─ /health (API status)
   │      ├─ /ops/redis (optional)
   │      └─ /ops/db (optional)
   │
   └─ Credentials + Cookies allowed by explicit CORS origin
```

## Health Polling Behaviour
- Runs every 5 seconds via `Promise.allSettled`
- Marks Redis/DB as offline if endpoints are unreachable but keeps API status accurate
- Console warning includes the failing service key for quick debugging

## Verification Commands
```bash
# Backend health
curl http://localhost:30089/health

# Frontend availability (expect HTML)
curl -I http://localhost:5174
```

Open the dashboard in a browser and confirm the **API Connected ✅** indicator.

## Common Pitfalls & Fixes
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| CORS error in browser console | Origin mismatch | Update the `enableCors` origin array to match the Vite dev URL |
| Health panel stuck on "Offline" | `.env` missing or contains `https://` | Ensure `VITE_API_URL` is `http://localhost:30089` without a trailing slash |
| Redis/DB show offline | Services not running or endpoints disabled | Start the optional services or ignore during HTTP-only development |

HTTP mode should now offer a frictionless bridge between frontend and backend for all contributors.
