# Frontend ↔ Backend Bridge Guide (HTTP Dev Mode)

This guide explains how to run the DLC Admin UI (Vite/React) against the DLC API (NestJS/Fastify) using an HTTP-only bridge for local development. No HTTPS certificates are required, making setup quick for contributors.

## 1. Prerequisites
- Node.js 20+
- pnpm 9.12+
- Docker (for the MySQL stack if you need database connectivity)
- Two terminal windows or panes

## 2. Configure Environment Variables
### Admin UI (`tools/apps/dlc-dev-studios/frontend/.env`)
```env
VITE_API_URL=http://localhost:30089
```
> The UI derives `/health`, `/ops/redis`, and `/ops/db` automatically. Remove trailing slashes to avoid duplicate separators.

### DLC API (`tools/apps/dlc-api/.env`)
```env
API_PORT=30089
NODE_ENV=development
```
> Additional database variables are optional for HTTP-only health checks but recommended for full functionality.

## 3. Start the Services
Run these commands from the repository root in separate shells:

```bash
pnpm --filter dlc-api dev
pnpm --filter dlc-dev-studios/frontend dev
```

The API listens on `http://localhost:30089`. Vite opens on `http://localhost:5174`.

## 4. CORS Expectations
The API only accepts credentialed requests from `http://localhost:5174`. If you customise the Vite port, update:
- `tools/apps/dlc-api/src/main.ts` (CORS origin array)
- `tools/apps/dlc-dev-studios/frontend/vite.config.ts` (dev server port)

## 5. Verifying the Bridge
1. `curl http://localhost:30089/health` → should return `{"status":"ok"}`
2. Open `http://localhost:5174` → Dashboard banner shows **API Health: OK**
3. Use the Health Monitor page to confirm Redis/DB status (optional)

If the UI displays "API Offline":
- Check the browser network tab for blocked CORS requests
- Ensure `.env` has the correct protocol (`http://`) and port (`30089`)
- Restart the dev server after changing environment variables

## 6. Combined Launch (Optional)
Add this script to the repository root `package.json`:
```json
{
  "scripts": {
    "dev:bridge": "pnpm --filter dlc-dev-studios/frontend dev & pnpm --filter dlc-api dev"
  }
}
```
Run with:
```bash
pnpm run dev:bridge
```
> Tip: use a process manager (e.g., `concurrently`, `tmux`) for better output handling.

## 7. Troubleshooting Checklist
- [ ] API started without database errors (warnings are acceptable for HTTP-only testing)
- [ ] Browser requests target `http://localhost:30089` (no HTTPS)
- [ ] No trailing slash on `VITE_API_URL`
- [ ] Fastify console logs show `CORS enabled`
- [ ] Health monitor updates every 5 seconds without console errors

Once these boxes are checked, the admin UI and API are fully bridged for local development.
