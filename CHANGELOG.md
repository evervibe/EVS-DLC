# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
