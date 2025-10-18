# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2025-10-18

### Fixed
- Public, read-only `/data/*/count` endpoints to unblock dashboard metrics without authentication
- Dashboard fetches no longer cached server-side; clear error states for better UX
- Removed obsolete Husky `prepare` script to eliminate install noise

### Added
- `@Public()` decorator to mark routes as accessible without JWT authentication
- Enhanced e2e tests to verify public access to count endpoints

### Changed
- Auth guard now checks for `@Public()` decorator and bypasses authentication when present
- Count endpoints are now publicly accessible while CRUD operations remain protected

## [1.3.2] - 2025-10-18

### Fixed
- Dashboard metrics now use server-side rendering with `cache: 'no-store'` for real-time data
- Frontend list pages now use canonical `/data/*` endpoints instead of `/game/*` aliases
- Shared library Endpoints structure updated to match canonical format with separate `counts` and `list` objects
- Dashboard properly handles wrapped response formats from API
- Removed hardcoded `limit: 1000` from game service alias methods (now uses service defaults)

### Changed
- Converted dashboard from client-side to server-side component
- Added `revalidate = 0` and `dynamic = 'force-dynamic'` to dashboard page
- Created dedicated `getCounts` data loader for dashboard metrics
- Updated all frontend fetch functions to handle both wrapped and direct response formats
- Game service alias methods now pass empty query objects, allowing services to use their default limits

## [1.3.1] - 2025-10-18

### Added
- Count endpoints for all data resources (`/data/t_item/count`, `/data/t_skill/count`, `/data/t_skilllevel/count`, `/data/t_string/count`)
- Optional `/game/*` aliases for backward compatibility (`/game/items`, `/game/skills`, `/game/skilllevels`, `/game/strings`)
- Database seed helper script (`infra/DB/seed-dev.sh`) for local development
- API e2e tests for count endpoints
- Centralized API endpoints configuration in shared library

### Changed
- Dashboard now uses `/count` endpoints for accurate resource counts
- Updated shared lib API client to support count endpoints
- Improved test setup with required environment variables

### Fixed
- Aligned frontend routes with backend `/data/*` resources
- Removed hardcoded test limits in game service
- React list key warning resolved (stable keys already present)
- Game service now properly delegates to data services instead of returning mock data
- Test environment configuration for JWT_SECRET and admin credentials

## [1.3.0] - 2025-10-18

### Added
- CI Pipeline (build, lint, type-check, tests) via GitHub Actions
- Dockerfiles for dlc-api and dlc-web-admin with multi-stage builds
- Root workspace configuration with pnpm workspaces
- ESLint configuration (.eslintrc.cjs) for monorepo
- Prettier configuration for consistent code formatting
- TypeScript base configuration (tsconfig.base.json)
- Swagger/OpenAPI documentation (opt-in via SWAGGER_ENABLED environment variable)
- Frontend testing infrastructure with Jest and React Testing Library
- Smoke test for web admin homepage
- TypeORM migrations configuration (baseline setup)
- Renovate configuration for automated dependency updates
- Migration scripts in API package.json

### Changed
- Enforce JWT_SECRET as required environment variable (no default)
- Enforce ADMIN_USERNAME and ADMIN_PASSWORD as required environment variables
- CORS origins now configurable via CORS_ORIGIN environment variable (comma-separated list)
- Updated all package versions to 1.3.0
- Docker Compose port bindings now use loopback (127.0.0.1) for better security
- Docker Compose build contexts updated to use repository root
- Updated API version display from v0.8.5 to v1.3.0
- Updated Web Admin version display from v1.2.0 to v1.3.0

### Security
- Removed insecure default values for JWT_SECRET
- Removed insecure default values for admin credentials
- Bound MySQL, Redis, and Adminer ports to localhost (127.0.0.1) in Docker Compose
- Added explicit security environment variables in docker-compose.yml

### Fixed
- Docker Compose now correctly references Dockerfiles that actually exist
- Added missing @fastify/cors dependency
- Added missing @nestjs/swagger dependencies for API documentation

## [1.2.0] - Previous Release

Initial stable release with NestJS API and Next.js 15 web admin.
