# Changelog

All notable changes to the DLC API project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-10-17 - Full Database Integration

### Added
- **TypeORM Integration**: Added TypeORM with @nestjs/typeorm for database ORM support
- **Database Introspection**: Created script to introspect MySQL database schema and auto-generate entities
- **Entity Generation**: Automatic entity generation for all database tables
  - Generated entities for: t_item, t_string, t_skill, t_skilllevel, t_character
  - Full column mapping with proper TypeScript types and decorators
  - Primary key and auto-increment detection
  - Nullable and default value support
- **CRUD Endpoints**: Auto-generated REST endpoints for all entities
  - GET /data/{table} - List all records
  - GET /data/{table}/:id - Get single record
  - POST /data/{table} - Create new record
  - PUT /data/{table}/:id - Update existing record
  - DELETE /data/{table}/:id - Delete record
- **Migration Snapshot**: Created migrations/001_full_schema_dump.sql with complete database schema
- **Documentation**:
  - docs/DATA_SCHEMA_OVERVIEW.md - Complete database schema documentation
  - docs/API_DATA_ENDPOINTS.md - API endpoint documentation with examples
- **Scripts**:
  - `npm run introspect` - Connect to real database and introspect schema
  - `npm run generate:mock` - Generate mock entities for development

### Changed
- Updated DataModule to use TypeORM and import all generated entity modules
- Version bumped from 0.0.1-alpha to 0.3.0
- Enhanced dependency list with TypeORM packages

### Technical Details
- All entities follow TypeORM decorators pattern
- Each table has its own module, service, and controller
- Services use TypeORM Repository pattern for database operations
- Controllers follow RESTful conventions
- Database connection configured for MySQL with connection pooling

### Files Generated
- 20 entity-related files (5 tables × 4 files each)
- 1 migration snapshot file
- 2 documentation files
- 2 introspection/generation scripts
- Updated data.module.ts with all imports

## [0.0.1-alpha] - Initial Release

### Added
- Initial NestJS + Fastify project scaffolding
- Basic module structure: auth, game, data, post
- MySQL connection pools for 4 databases
- Error handling and validation infrastructure
- JWT authentication guard (placeholder)
- Testing infrastructure with Jest
- Development and production scripts
