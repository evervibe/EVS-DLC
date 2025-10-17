# Local Development Guide

This guide walks you through setting up and running the DLC API locally with Docker-based MySQL databases.

## Prerequisites

- Node.js 18+ and pnpm installed
- Docker and Docker Compose installed
- Git

## Quick Start

### 1. Start MySQL Databases

```bash
# Navigate to the database infrastructure folder
cd infra/DB/game

# Copy environment file (first time only)
cp .env.example .env

# Start MySQL container with all 4 databases
docker compose up -d

# Verify containers are running
docker compose ps

# Check databases are created
docker compose exec mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

Expected output:
```
+--------------------+
| Database           |
+--------------------+
| db_auth            |
| db_data            |
| db_db              |
| db_post            |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

### 2. Configure API

```bash
# Navigate to API folder
cd ../../../tools/apps/dlc-api

# Copy environment file (first time only)
cp .env.example .env

# Install dependencies
pnpm install
```

**Note:** The `.env` file is optional. The API has sensible defaults that match the Docker setup.

### 3. Start API

```bash
# Start in development mode with hot-reload
pnpm dev
```

Expected output:
```
🚀 Starting DLC API v0.5.0...
📊 Testing database connections...
✓ Database connection successful: auth (db_auth)
✓ Database connection successful: game (db_db)
✓ Database connection successful: data (db_data)
✓ Database connection successful: post (db_post)
✅ All database connections successful

✅ DLC API läuft auf Port 4000
✅ Environment: development
✅ Fastify adapter enabled

📍 Health Check: http://localhost:4000/health
```

### 4. Verify Setup

```bash
# Check API health (includes database status)
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T15:30:00.000Z",
  "version": "0.5.0",
  "databases": {
    "auth": true,
    "game": true,
    "data": true,
    "post": true
  }
}
```

## Development Workflow

### Running the API

```bash
# Development mode with hot-reload
pnpm dev

# Production build
pnpm build

# Start production build
pnpm start:prod
```

### Database Management

```bash
# View MySQL logs
cd infra/DB/game
docker compose logs -f mysql

# Stop databases
docker compose down

# Stop and remove all data (⚠️ destroys database content)
docker compose down -v

# Restart databases
docker compose restart

# Access MySQL CLI
docker compose exec mysql mysql -uroot -proot
```

### Adminer (Database GUI)

Adminer is included for easy database browsing:

1. Ensure containers are running: `docker compose up -d`
2. Open browser: http://localhost:8080
3. Login with:
   - System: `MySQL`
   - Server: `mysql`
   - Username: `root`
   - Password: `root`
   - Database: (select `db_data` or any other)

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with hot-reload |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start:prod` | Start production server |
| `pnpm test` | Run Jest tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with coverage report |
| `pnpm introspect` | Introspect database schema |
| `pnpm generate:mock` | Generate mock entities |

## Project Structure

```
tools/apps/dlc-api/
├── src/
│   ├── app.module.ts          # Main application module
│   ├── main.ts                 # Application entry point
│   ├── config/
│   │   ├── env.ts             # Environment configuration
│   │   └── typeorm.config.ts  # TypeORM configuration
│   ├── common/
│   │   ├── db/                # Database utilities
│   │   ├── errors/            # Error handling
│   │   └── middleware/        # Middleware
│   └── modules/
│       ├── auth/              # Authentication (future)
│       ├── game/              # Game data (db_db)
│       ├── data/              # Generic data (db_data)
│       ├── post/              # Post data (db_post)
│       └── health/            # Health checks
├── tests/                      # E2E tests
├── migrations/                 # Database migrations
├── docs/                       # Documentation
├── .env.example               # Environment template
└── package.json               # Dependencies
```

## Common Issues & Solutions

### Port 4000 already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Option 1: Kill process using port 4000
lsof -ti:4000 | xargs kill

# Option 2: Change port in .env
echo "API_PORT=4001" >> .env
```

### Database connection refused

**Symptom:** `Database connection failed: auth ECONNREFUSED`

**Solution:**
```bash
# Check if Docker is running
docker ps

# Start MySQL containers
cd infra/DB/game
docker compose up -d

# Wait 10 seconds for MySQL to be ready
sleep 10
```

### Access denied for user 'root'

**Symptom:** `Access denied for user 'root'@'localhost' (using password: YES/NO)`

**Solution:**
```bash
# Check Docker container password
cd infra/DB/game
cat .env | grep MYSQL_ROOT_PASSWORD

# Ensure API .env matches
cd ../../../tools/apps/dlc-api
cat .env | grep DB_AUTH_PASS

# Update API .env if needed
# DB_AUTH_PASS should match MYSQL_ROOT_PASSWORD
```

### TypeScript compilation errors

**Symptom:** Build fails with TypeScript errors

**Solution:**
```bash
# Clean build artifacts
rm -rf dist/

# Reinstall dependencies
rm -rf node_modules/
pnpm install

# Rebuild
pnpm build
```

### Hot-reload not working

**Symptom:** Changes not reflected when using `pnpm dev`

**Solution:**
```bash
# Restart dev server
# Ctrl+C to stop, then:
pnpm dev
```

## Environment-Specific Configuration

### Development (Default)

Uses local Docker MySQL with default credentials:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `root`

### Production

1. Create production `.env`:
```bash
API_PORT=4000
NODE_ENV=production
JWT_SECRET=your-very-long-secure-random-key-min-32-chars

DB_AUTH_HOST=prod-mysql-host.example.com
DB_AUTH_USER=api_user
DB_AUTH_PASS=strong-password
# ... etc for all databases
```

2. Build and run:
```bash
pnpm build
NODE_ENV=production pnpm start:prod
```

## Health Checks

The API provides health check endpoints for monitoring:

### Basic Health Check

```bash
curl http://localhost:4000/health
```

Returns API status and database connectivity:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T15:30:00.000Z",
  "version": "0.5.0",
  "databases": {
    "auth": true,
    "game": true,
    "data": true,
    "post": true
  }
}
```

Status values:
- `ok` - All databases connected
- `degraded` - Some databases unavailable

### Readiness Check

```bash
curl http://localhost:4000/health/ready
```

Returns simple readiness status for load balancers:
```json
{
  "status": "ready",
  "timestamp": "2025-10-17T15:30:00.000Z"
}
```

## Next Steps

- Review [Configuration Setup](CONFIG_SETUP.md) for advanced configuration
- Check [API Data Endpoints](API_DATA_ENDPOINTS.md) for available routes
- See [Database Schema Overview](DATA_SCHEMA_OVERVIEW.md) for schema details
- Read [Database Connection Guide](DB_CONNECTION_GUIDE.md) for troubleshooting

## Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#common-issues--solutions) above
2. Review Docker container logs: `cd infra/DB/game && docker compose logs`
3. Check API logs in the terminal where `pnpm dev` is running
4. Verify environment configuration in `.env` files
5. Ensure Docker containers are healthy: `docker compose ps`
