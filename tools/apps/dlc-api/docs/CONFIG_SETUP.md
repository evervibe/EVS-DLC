# Configuration Setup Guide

This guide explains how to configure the DLC API for local development and production environments.

## Environment Variables

The DLC API uses environment variables for configuration. All configuration is validated at startup using Joi schema validation.

### Required Files

- `.env` - Your local configuration (not committed to git)
- `.env.example` - Template with all available options (committed to git)

### Creating Your Configuration

1. Copy the example file:
```bash
cd tools/apps/dlc-api
cp .env.example .env
```

2. Edit `.env` with your local values (optional - defaults work for local development)

## Configuration Options

### API Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `4000` | Port the API listens on |
| `NODE_ENV` | `development` | Environment mode (development/production) |

### Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `dev-secret` | Secret key for JWT token signing (for future auth implementation) |

**Note:** JWT authentication is not currently implemented. The secret is configured with a safe default for future use.

### Database Connections

The API connects to 4 separate MySQL databases. Each has the following configuration options:

#### Auth Database (db_auth)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_AUTH_HOST` | `localhost` | MySQL server hostname |
| `DB_AUTH_PORT` | `3306` | MySQL server port |
| `DB_AUTH_USER` | `root` | Database username |
| `DB_AUTH_PASS` | `root` | Database password |
| `DB_AUTH_NAME` | `db_auth` | Database name |

#### Game Database (db_db)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_GAME_HOST` | `localhost` | MySQL server hostname |
| `DB_GAME_PORT` | `3306` | MySQL server port |
| `DB_GAME_USER` | `root` | Database username |
| `DB_GAME_PASS` | `root` | Database password |
| `DB_GAME_NAME` | `db_db` | Database name |

**Note:** The game database is named `db_db` in the infrastructure, not `db_game`.

#### Data Database (db_data)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_DATA_HOST` | `localhost` | MySQL server hostname |
| `DB_DATA_PORT` | `3306` | MySQL server port |
| `DB_DATA_USER` | `root` | Database username |
| `DB_DATA_PASS` | `root` | Database password |
| `DB_DATA_NAME` | `db_data` | Database name |

#### Post Database (db_post)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_POST_HOST` | `localhost` | MySQL server hostname |
| `DB_POST_PORT` | `3306` | MySQL server port |
| `DB_POST_USER` | `root` | Database username |
| `DB_POST_PASS` | `root` | Database password |
| `DB_POST_NAME` | `db_post` | Database name |

## Default Configuration

The API is designed to work **out of the box** with the default Docker MySQL setup from `infra/DB/game/`.

If you don't create a `.env` file, all defaults will be applied automatically:
- Connects to `localhost:3306`
- Uses `root` user with password `root`
- Connects to databases: `db_auth`, `db_db`, `db_data`, `db_post`

## Validation

All configuration is validated at startup using Joi schema. If validation fails, you'll see a clear error message:

```
Error: Config validation error: "API_PORT" must be a number
```

### Validation Rules

- `API_PORT`: Must be a number
- `NODE_ENV`: Must be a string
- `JWT_SECRET`: Must be a string (has default value)
- Database host: Must be a string (has default value)
- Database port: Must be a number (has default value)
- Database user: Must be a string (has default value)
- Database password: Can be empty string (has default value)
- Database name: Must be a string (has default value)

## Docker Integration

The default configuration is synchronized with the Docker Compose setup in `infra/DB/game/`:

1. MySQL runs on port 3306
2. Root password is `root`
3. All 4 databases are created automatically via init scripts

To use different credentials:

1. Update `infra/DB/game/.env` for the Docker containers
2. Update `tools/apps/dlc-api/.env` to match

## Production Configuration

For production environments:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (min 32 characters)
3. Use dedicated database users (not root)
4. Use strong database passwords
5. Consider using environment-specific hosts (e.g., read replicas)

Example production `.env`:

```bash
API_PORT=4000
NODE_ENV=production
JWT_SECRET=your-very-long-and-secure-random-secret-key-here

DB_AUTH_HOST=mysql-auth.example.com
DB_AUTH_PORT=3306
DB_AUTH_USER=api_user
DB_AUTH_PASS=strong-password-here
DB_AUTH_NAME=db_auth

# ... repeat for other databases
```

## Troubleshooting

### Config validation errors

If you see config validation errors, check:
1. `.env` file exists in `tools/apps/dlc-api/`
2. Variable names match exactly (case-sensitive)
3. Numbers are not quoted
4. No spaces around `=` signs

### Database connection errors

If you see "Access denied" or "Cannot connect" errors:
1. Ensure Docker containers are running: `cd infra/DB/game && docker compose up -d`
2. Check database credentials match between Docker and API `.env`
3. Verify databases exist: `docker compose exec mysql mysql -uroot -proot -e "SHOW DATABASES;"`

### Port already in use

If you see "EADDRINUSE" errors:
1. Change `API_PORT` in `.env` to a different port
2. Or stop the process using port 4000: `lsof -ti:4000 | xargs kill`

## See Also

- [Local Development Guide](LOCAL_DEV_GUIDE.md) - Complete setup instructions
- [Database Connection Guide](DB_CONNECTION_GUIDE.md) - MySQL troubleshooting
- [API Data Endpoints](API_DATA_ENDPOINTS.md) - Available API routes
