# Security Overview – EVS-DLC v0.8.0

## Backend Hardening
- **JWT Guard Everywhere** – Every CRUD controller under `/data/t_*` is wrapped in the shared `JwtAuthGuard`, which validates bearer tokens before controller logic executes.
- **Request Validation** – `class-validator` now enforces non-optional primary fields for create operations (item, skill, skill level, string) and caps string/number ranges. Requests missing required data fail fast with `DATA_VALIDATION_FAILED`.
- **Sanitisation & Error Normalisation** – `sanitizeObject` removes unsafe payload entries, while the global `ApiError` responses ensure consistent, stacktrace-free error surfaces.
- **Safety Checks** – Skill level creation verifies the referenced skill exists and blocks duplicate `a_index` inserts, reducing the chance of referential drift.
- **Platform Middleware** – Helmet and rate limiting are configured in `main.ts`, adding baseline HTTP header protection and throttling against brute-force attempts.

## Frontend Safeguards
- **Authenticated API Client** – All axios calls originate from a single client that injects the bearer token and automatically redirects to `/login` when a 401 is encountered.
- **Form Validation UX** – React Hook Form powers modals and inline edits, providing immediate validation feedback before requests are sent.
- **State Consistency** – React Query invalidates caches after mutations to prevent stale data from re-rendering.
- **Inline Editing Guardrails** – Only one row can be edited at a time, with explicit cancel/confirm affordances and constrained textarea sizing to avoid layout jumps.

## Operational Notes
- Run smoke tests with `pnpm test` after installing dependencies in both `tools/apps/dlc-api` and `tools/apps/dlc-dev-studios/frontend` to confirm DTO and UI regressions are caught.
- JWT secrets and connection credentials remain sourced from the existing environment configuration; no changes to `.env` files were required in this release.
