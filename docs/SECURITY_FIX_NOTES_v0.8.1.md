# Security Fix Notes – EVS-DLC v0.8.1

## Overview
Release v0.8.1 focuses on tightening the attack surface exposed by the NestJS Fastify adapter and improving client feedback when upstream services are offline.

## Backend Hardening
- **CORS policy** now restricts origins to `http://localhost:5174`, matching the developer dashboard default.
- **Helmet** remains enabled and rate limiting stays active; the new root route returns minimal metadata to avoid leaking server details.
- Added a **Fastify not-found handler** plus a dedicated `NotFoundExceptionFilter` to standardise JSON error responses and hide stack traces for unknown routes.
- Validation is applied globally in `main.ts` ensuring class-transformer powered DTO conversion before hitting service layers.

## Frontend Safeguards
- Implemented a shared `ApiOfflineNotice` component that surfaces the expected API base URL and health endpoint whenever requests fail, reducing ambiguity during incident triage.
- Disabled CRUD controls while the API is unreachable, preventing accidental mutations queued against a downed backend.

## Dependency Governance
- Added `.npmrc` and `.pnpmfile.cjs` to force the public npm registry for both installs and isolated test runs.
- Locked backend and frontend package manifests to version `0.8.1` and recorded new test tooling (`vitest`, Testing Library) for transparent auditing.
