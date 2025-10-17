# DLC API - Hybrid Backend

A hybrid backend API built with NestJS + Fastify adapter, providing a structured and modular approach while maintaining flexibility and performance.

## Version

0.3.0 - Full Database Integration

## Features

- **NestJS Framework**: Structured, modular architecture with dependency injection
- **Fastify Adapter**: High-performance HTTP server
- **TypeORM Integration**: Full ORM support with entity mapping and repository pattern
- **TypeScript**: Full type safety and modern JavaScript features
- **MySQL Support**: Four separate database connections (auth, game, data, post)
- **Database Introspection**: Automatic entity generation from database schema
- **CRUD API Generation**: Auto-generated REST endpoints for all database tables
- **Modular Design**: Separated modules for auth, game, data, and post
- **Common Layer**: Shared database, error handling, middleware, and utilities
- **Validation**: Class-validator for request validation
- **Error Handling**: Global exception filter with structured error responses
- **Testing**: Jest setup for unit and e2e tests
- **Documentation**: Auto-generated schema and API documentation

## Project Structure

```
tools/apps/dlc-api/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── game/          # Game logic module
│   │   ├── data/          # Data management module
│   │   └── post/          # Post/logging module
│   ├── common/
│   │   ├── db/            # Database connection pools
│   │   ├── errors/        # Error handling (ApiError, filters)
│   │   ├── middleware/    # JWT guard, validation pipe
│   │   └── utils/         # Logger, helpers
│   ├── config/            # Environment configuration
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── migrations/            # SQL migration files per module
├── tests/                 # Test files
├── package.json
├── tsconfig.json
├── nest-cli.json
├── jest.config.js
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+ or 20+
- MySQL 8.0
- npm or pnpm

### Installation

1. Navigate to the project directory:
```bash
cd tools/apps/dlc-api
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Copy and configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your database credentials:
```env
# API Configuration
API_PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Database Connections
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASSWORD=your-password
DB_AUTH_NAME=db_auth

DB_GAME_HOST=localhost
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASSWORD=your-password
DB_GAME_NAME=db_db

DB_DATA_HOST=localhost
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASSWORD=your-password
DB_DATA_NAME=db_data

DB_POST_HOST=localhost
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASSWORD=your-password
DB_POST_NAME=db_post
```

### Database Setup

Ensure all four MySQL databases exist:
- `db_auth` - Authentication data
- `db_db` - Game data
- `db_data` - Data management
- `db_post` - Post/logging data

You can use the Docker setup from `infra/DB/game/` to run MySQL locally.

## Running the Application

### Development Mode
```bash
npm run dev
```
The API will start on `http://localhost:3000` (or the port specified in `.env`)

### Build
```bash
npm run build
```

### Production Mode
```bash
npm run start:prod
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:cov
```

## API Endpoints

### Auth Module
- `POST /auth/login` - User login

### Game Module
- `GET /game/items` - Get game items (with optional filters)
- `POST /game/accounts/:userCode/cash` - Change user cash (requires authentication)

### Data Module
- `GET /data/t_item` - Get all items from t_item table
- `GET /data/t_item/:id` - Get single item by ID
- `POST /data/t_item` - Create new item
- `PUT /data/t_item/:id` - Update item
- `DELETE /data/t_item/:id` - Delete item
- Similar endpoints available for: t_string, t_skill, t_skilllevel, t_character
- See `docs/API_DATA_ENDPOINTS.md` for complete API documentation

### Post Module
- `POST /post/logs` - Create a log entry
- `GET /post/logs` - Get log entries

## Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Development

### Database Introspection

This project supports automatic entity generation from the database schema:

#### Using Real Database
If you have access to the `db_data` MySQL database, you can introspect the schema and generate entities:

```bash
npm run introspect
```

**Requirements:**
- MySQL database accessible at the configured host
- Environment variables configured in `.env` (see `.env.example`):
  - `DB_DATA_HOST` - Database host (default: localhost)
  - `DB_DATA_PORT` - Database port (default: 3306)
  - `DB_DATA_USER` - Database user (default: root)
  - `DB_DATA_PASSWORD` - Database password (⚠️ **required**, no default)
  - `DB_DATA_NAME` - Database name (default: db_data)

**What it does:**
- Connect to the MySQL database using credentials from `.env`
- Read all tables and columns from `INFORMATION_SCHEMA`
- Generate TypeORM entities with proper decorators
- Create modules, services, and controllers for each table
- Generate migration snapshot and documentation

**Error Handling:**
If the script fails, check for these common issues:
- **Connection timeout**: Database is not accessible at the specified host/port
  - Verify database is running: `mysql -h localhost -u root -p`
  - Check firewall settings for remote connections
- **Authentication failure**: Incorrect username or password
  - Error: `Access denied for user 'user'@'host'`
  - Verify credentials in `.env` file
- **Database not found**: Database name doesn't exist
  - Error: `Unknown database 'db_name'`
  - Create database or update `DB_DATA_NAME` in `.env`
- **No tables found**: Database exists but is empty
  - Script will complete but generate no entities
  - Populate database with schema first

#### Using Mock Data
For development without database access:

```bash
npm run generate:mock
```

This generates sample entities for the following tables without requiring database connection:
- `t_item` - Game items (6 columns)
- `t_string` - String localization (4 columns)
- `t_skill` - Skills (5 columns)
- `t_skilllevel` - Skill levels (5 columns)
- `t_character` - Characters (6 columns)

Perfect for:
- Initial development
- CI/CD environments without database access
- Testing the API structure

### Adding New Modules

1. Create module directory under `src/modules/`
2. Add module files: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`
3. Import module in `src/app.module.ts`
4. Add migration files in `migrations/`
5. Add tests in `tests/`

### Database Access

Access database pools via:
```typescript
import { dbPools } from './common/db';

// Use connection pools
const connection = await dbPools.auth.getConnection();
// ... perform queries
connection.release();
```

### Error Handling

Use `ApiError` class for structured errors:
```typescript
import { ApiError } from './common/errors';

throw ApiError.badRequest('Invalid input');
throw ApiError.unauthorized('Not authenticated');
throw ApiError.notFound('Resource not found');
```

## Technology Stack

- **NestJS 10.3** - Progressive Node.js framework
- **Fastify 4.25** - Fast and low overhead web framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **TypeScript 5.3** - Typed superset of JavaScript
- **MySQL2 3.6** - MySQL client for Node.js
- **class-validator 0.14** - DTO validation
- **class-transformer 0.5** - Object transformation
- **Jest 29** - Testing framework

## Notes

- Current version: 0.3.0 - Full Database Integration
- Database schema is introspected and entities are auto-generated
- CRUD endpoints are automatically created for all database tables
- See `CHANGELOG.md` for version history
- See `docs/DATA_SCHEMA_OVERVIEW.md` for database schema details
- See `docs/API_DATA_ENDPOINTS.md` for complete API documentation
- JWT validation is a placeholder and needs proper implementation

## License

UNLICENSED
