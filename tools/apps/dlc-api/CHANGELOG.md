# Changelog

All notable changes to the DLC API project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-10-17 - Stability & Connectivity Update

### Fixed
- **MySQL Connection Handling**: Fixed "Access denied (using password: NO)" error
  - Standardized password environment variables to use `_PASS` suffix
  - Updated all modules to use consistent variable names
  - Environment variables: `DB_AUTH_PASS`, `DB_GAME_PASS`, `DB_DATA_PASS`, `DB_POST_PASS`

### Added
- **Environment Validation**: Implemented Joi schema validation via @nestjs/config
  - Validates all required database connection variables at startup
  - Provides clear error messages for missing or invalid configuration
  - Global ConfigModule with validation schema
  
- **Database Connection Utilities**:
  - Created `src/utils/db-checker.ts` for connection testing
  - Automatic connection validation on application startup
  - Clear console logs for each database connection status
  
- **Health & Readiness Endpoints**:
  - `GET /health` - Returns API status, timestamp, and version
  - `GET /health/ready` - Returns readiness status for load balancers
  - HealthModule with dedicated controller
  
- **Entity Relationships**:
  - Added `@OneToMany` relationship: TSkill → TSkillLevel
  - Added `@ManyToOne` relationship: TSkillLevel → TSkill
  - Maintains `synchronize: false` to prevent schema changes
  
- **Documentation**:
  - `docs/DB_CONNECTION_GUIDE.md` - Comprehensive MySQL setup and troubleshooting guide
  - Covers Docker setup, environment variables, common errors, and production best practices
  
- **Testing**:
  - `tests/connectivity.e2e-spec.ts` - E2E tests for health endpoints
  - Validates API health and readiness checks

### Changed
- Updated `.env.example` with consistent variable naming (`_PASS` instead of `_PASSWORD`)
- Enhanced AppModule with ConfigModule integration
- Improved error handling and logging for database connections

### Technical Details
- Added dependency: `joi@18.0.1` for environment validation
- All database modules now use consistent environment variable names
- Connection pooling maintained (10 connections per pool)
- Health endpoints follow REST conventions for monitoring

### Dependencies
- Added: `joi@18.0.1`

### Notes
This release focuses on stability and reliability of database connections. The standardized environment variable naming (`_PASS`) and validation ensures consistent configuration across all deployment environments.

## [0.3.1] - 2025-10-17 - Real Database Alignment & Schema Correction

### Fixed
- Corrected all entity definitions to match actual MySQL schema exactly
- Fixed primary key mappings (from `id` to `a_index`)
- Fixed column names and types to match database 1:1

### Removed
- **t_character table** - Removed fictional/non-existent table and its entire module
  - Deleted entity, service, controller, and module files
  - Removed from data.module.ts imports

### Changed
- **t_string entity**: Completely rewritten with 27 columns (1 key + 26 language fields)
  - Replaced fictional schema (id, key, value, language)
  - Added all real language columns: usa, ger, spn, frc, rus, twn, chn, thai, jpn, mal, brz, hk, pld, tur, ita, mex, nld, uk, dev, etc.
  - Primary key changed to `a_index` (int)
  
- **t_item entity**: Completely rewritten with 170+ columns
  - Replaced fictional schema (6 columns)
  - Added all localized names (24 languages)
  - Added all localized descriptions (24 languages)
  - Added complete item attributes (stats, requirements, rare system, set bonuses, visuals, metadata)
  - Primary key `a_index` with auto-increment
  
- **t_skill entity**: Completely rewritten with 160+ columns
  - Replaced fictional schema (5 columns)
  - Added all localized names (26 languages)
  - Added all client display data (descriptions, tooltips in 26 languages)
  - Added complete skill mechanics (requirements, timing, combat data, effects)
  - Primary key `a_index` (non-auto-increment)
  
- **t_skilllevel entity**: Completely rewritten with 46 columns
  - Replaced fictional schema (5 columns)
  - Added resource costs (HP, MP, GP, duration)
  - Added learning requirements (level, SP, stats, items)
  - Added magic effects and prerequisites
  - Primary key `a_index`

- **All services**: Updated to use correct primary key (`a_index`) and support pagination

### Added
- **Migration 002**: Complete schema dump SQL file (`migrations/002_real_schema_dump.sql`)
  - CREATE TABLE statements for all 4 real tables
  - Exact column definitions matching MySQL
  - Primary keys, defaults, and constraints
  
- **Documentation**:
  - `docs/DATA_SCHEMA_OVERVIEW.md` - Complete schema reference with all columns documented
  - `docs/API_DATA_ENDPOINTS.md` - Full API documentation with examples
  - `docs/IMPLEMENTATION_SUMMARY_v0.3.1.md` - Detailed change summary and technical notes

### Technical Details
- Entity column counts: t_string (27), t_item (170+), t_skill (160+), t_skilllevel (46)
- All type mappings corrected (int, tinyint, smallint, bigint, float, varchar)
- Default values properly applied (0, -1, empty string)
- Unsigned types correctly marked
- Nullable fields only where specified in actual schema
- Build verification: 0 TypeScript errors

### Breaking Changes
- Primary key field name changed from `id` to `a_index` in all entities
- All column names now use real database names (with `a_` prefix)
- Removed t_character endpoints entirely
- Response structures updated to reflect real schema

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
