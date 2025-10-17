# DLC Ecosystem Changelog v0.8.5

## Release Summary
- 🔄 Standardised the admin UI `.env` for local HTTP connections using `VITE_API_URL=http://localhost:30089`.
- 🔐 Tightened API CORS policy for the Vite dev server running on `http://localhost:5174` while keeping credentialed requests working.
- 🌐 Normalised frontend environment handling so health endpoints are derived automatically from the base API URL.
- 🚦 Improved health polling to degrade gracefully if optional services (Redis/DB) are offline.
- 🧰 Updated package metadata and dev server defaults to keep the ecosystem aligned on version **0.8.5**.
- 📚 Added documentation for the HTTP bridge workflow and local verification steps.

## Detailed Changes
### Admin UI (Vite/React)
- Added a concrete `.env` with the correct local API URL and normalised the Vite dev server port to **5174**.
- Refined environment helpers to trim trailing slashes, provide sensible defaults, and auto-build health endpoint URLs.
- Hardened the health polling client to use `Promise.allSettled`, preventing total failure when optional services are unreachable.
- Refreshed README snippets so developers copy the correct configuration values.

### DLC API (NestJS/Fastify)
- Bumped the service banner to **v0.8.5** for clarity.
- Replaced the wildcard CORS rule with an explicit allow-list and standard HTTP method/header set for the Vite dev server.

### Documentation
- Published this changelog together with dedicated bridge and HTTP mode guides.
- Updated existing environment sync documentation to reflect the simplified configuration flow and new defaults.
- Raised the global project README to version **0.8.5** and adjusted URLs to match the 5174 dev server.

## Verification Checklist
1. Start the backend API: `pnpm --filter dlc-api dev`
2. Start the admin UI: `pnpm --filter dlc-dev-studios/frontend dev`
3. Confirm the health endpoint responds: `curl http://localhost:30089/health`
4. Open the dashboard: `http://localhost:5174` → Health panel should display **API Connected ✅**.

> ℹ️  When editing any `.env`, restart the corresponding dev server to reload the variables.
