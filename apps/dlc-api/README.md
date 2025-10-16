# DLC API - Hybrid Backend

A hybrid backend API built with NestJS + Fastify adapter, providing a structured and modular approach while maintaining flexibility and performance.

## Version

0.0.1-alpha

## Features

- **NestJS Framework**: Structured, modular architecture with dependency injection
- **Fastify Adapter**: High-performance HTTP server
- **TypeScript**: Full type safety and modern JavaScript features
- **MySQL Support**: Four separate database connections (auth, game, data, post)
- **Modular Design**: Separated modules for auth, game, data, and post
- **Common Layer**: Shared database, error handling, middleware, and utilities
- **Validation**: Class-validator for request validation
- **Error Handling**: Global exception filter with structured error responses
- **Testing**: Jest setup for unit and e2e tests

## Project Structure

```
apps/dlc-api/
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
cd apps/dlc-api
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
- `GET /data/items` - Get data items

### Post Module
- `POST /post/logs` - Create a log entry
- `GET /post/logs` - Get log entries

## Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Development

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

- **NestJS** - Progressive Node.js framework
- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Typed superset of JavaScript
- **MySQL2** - MySQL client for Node.js
- **class-validator** - Decorator-based validation
- **Jest** - Testing framework

## Notes

- This is an alpha version (0.0.1-alpha) - not ready for production
- Database query logic is currently stubbed with mock data
- JWT validation is a placeholder and needs proper implementation
- See migration files for database schema examples

## License

UNLICENSED
