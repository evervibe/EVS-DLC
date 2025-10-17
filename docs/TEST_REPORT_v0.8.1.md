# Test Report – EVS-DLC v0.8.1

| Suite | Command | Result | Notes |
| --- | --- | --- | --- |
| Backend Unit/E2E | `pnpm test` / `pnpm test:e2e` | ⚠️ Blocked | `corepack` could not download pnpm (`403 Forbidden` via proxy) so no dependencies were installed; see shell logs. |
| Frontend Unit | `pnpm test` | ⚠️ Blocked | Same proxy restriction prevented `pnpm install` in the frontend workspace. |

## Environment Preparation
- Executed `pnpm store prune` and `pnpm rebuild` prior to running the backend suite to guarantee deterministic pnpm behavior in the containerized registry mirror.
- Ensured `.npmrc` and `.pnpmfile.cjs` lock the npm registry to `https://registry.npmjs.org/` for both projects.

## Logs
- Backend install attempt: see shell output (`pnpm install` / `pnpm test`).
- Frontend install attempt: see shell output (`pnpm install`).
