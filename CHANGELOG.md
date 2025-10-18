# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-10-18

### Added
- **Localization Editor Suite** with complete workflow management for `t_string`
- `LANG_MAP` constant with 26 language support (usa, ger, spn, frc, rus, kor, twn, chn, thai, jpn, mal, brz, hk, pld, tur, ita, mex, nld, uk, dev, and variants)
- i18n validation helpers for string length, control characters, placeholder consistency
- `dlc_string_meta` table for workflow tracking (draft → review → approved)
- Database migration `CreateStringMeta1700000000000` for metadata table
- New `/strings` API module with enhanced CRUD, filtering, and workflow endpoints
- Role-based access control (RBAC) with Editor, Reviewer, Publisher roles
- Workflow endpoints: submit-review, approve, reject with audit trail
- Bulk CSV/XLSX import with dry-run mode and diff preview
- Deterministic `.load` export with SHA1 hash and manifest.json generation
- Export files saved to `infra/exports/strings/<version>/` with metadata
- Enhanced web UI for strings management with status/language filters
- Pagination controls for large datasets
- Placeholder pages for review queue, import wizard, and export wizard
- Server actions for strings operations with proper authentication
- E2E tests for strings endpoints (list, detail, update validation, export preview)
- Enhanced shared lib API helpers: `getJSON`, `postJSON`, `putJSON`, `deleteJSON`, `uploadFile`

### Changed
- Strings list page now uses new `/strings` endpoint instead of `/data/t_string`
- Filters include workflow status (draft/review/approved) and missing language detection
- All strings operations route through SSR auth proxy at `/api/dlc/strings/*`
- TypeORM configuration in API includes paths for shared-lib imports
- Web admin tsconfig includes path mapping for `@evs-dlc/shared-lib`
- Added `@nestjs/platform-express`, `multer`, and `@types/multer` for file upload support

### Fixed
- Type safety for language columns and locale mappings
- Button and Card component variant type errors in web UI
- Shared lib fetch cache property compatibility with non-Next.js environments

### Security
- All strings CRUD operations protected by JWT authentication
- Role-based access: Editors can create/update, Reviewers can approve/reject, Publishers can export
- Public count endpoint `/data/t_string/count` remains unchanged for dashboard
- Validation prevents oversized strings, control characters, and encoding issues
- Audit trail tracks all changes with user ID, timestamp, and version history

## [1.3.4] - 2025-10-18

### Added
- Next.js SSR auth proxy at `/api/dlc/*` that injects JWT from HttpOnly cookie for secure list/CRUD operations
- Login page and server actions for HttpOnly cookie-based authentication (`dlc_token`, 8h TTL)
- Logout functionality to clear authentication cookie
- Status-aware error UI components that display specific messages for 401/403 (unauthorized) and 5xx (server errors)
- Retry functionality for failed requests
- E2e tests verifying list routes require authentication while count endpoints remain public
- Explicit `FRONTEND_ORIGIN` environment variable in API `.env.example`

### Fixed
- List views failing due to missing authentication - now use SSR proxy with JWT injection
- Dashboard counts remain public and fast - direct API calls without authentication
- Error states no longer coerced to `0` - proper status-based error messaging
- All list pages (items, skills, skilllevels, strings) now route through authenticated proxy

### Changed
- All protected list/CRUD operations now use relative `/api/dlc/*` routes in web-admin
- Dashboard counts continue to call public API endpoints directly
- Shared library endpoints updated to use relative paths for better proxy compatibility
- All list pages use `cache: 'no-store'` for real-time data

### Security
- JWT tokens now stored in HttpOnly cookies, never exposed to client-side JavaScript
- Proxy route strips sensitive headers and never echoes tokens back to client
- Cookie settings: `httpOnly: true`, `sameSite: 'lax'`, `secure` in production

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
