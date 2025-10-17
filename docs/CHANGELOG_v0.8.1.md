# EVS-DLC v0.8.1 – Stabilization & Test Harness Fixes

## Highlights
- Added missing NestJS mapped-types dependency and refreshed DTO validation to guarantee consistent transformation support.
- Hardened API bootstrap with stricter CORS, Fastify not-found handling, and a default `/` status endpoint for quick smoke checks.
- Stabilized pnpm-based test environments by pinning the public registry and seeding env variables during Jest runs.
- Upgraded the React admin workspace with Vitest support, offline fallbacks for data grids, and clearer API connectivity guidance.

## Detailed Changes
### Backend (`tools/apps/dlc-api`)
- Added `@nestjs/mapped-types` to dependencies and bumped the package version to `0.8.1`.
- Registered the shared validation pipe in `main.ts`, tightened CORS to the studio host, and introduced a JSON root endpoint plus Fastify not-found handler.
- Added a dedicated `NotFoundExceptionFilter` for structured 404 responses alongside the existing global exception filter.
- Updated health reporting to expose version `0.8.1` and ensured DTO helpers import `class-transformer` where implicit conversion is expected.
- Created `.npmrc`, `.pnpmfile.cjs`, and `jest.setup.ts` to lock npm registry access and enforce the test environment within containers.

### Frontend (`tools/apps/dlc-dev-studios/frontend`)
- Bumped the app version to `0.8.1`, enabled Vitest via new dev dependencies, and wired `vite.config.ts` with a JSDOM-based test runner configuration.
- Added a shared `ApiOfflineNotice` component and integrated it across Items, Skills, Skill Levels, Strings, and Health Monitor views for clearer API outage messaging.
- Updated the example env file to surface version `0.8.1` and aligned query-driven screens with graceful retry/disable states while the backend is unreachable.

### Tooling & Documentation
- Added repository-wide `.npmrc` and `.pnpmfile.cjs` so CI/CD and containerized tests consistently use the public npm registry.
- Authored `docs/TEST_REPORT_v0.8.1.md` and `docs/SECURITY_FIX_NOTES_v0.8.1.md` alongside this changelog to document verification steps and hardening measures.
