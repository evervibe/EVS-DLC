# MySQL Database Connection Guide

## Overview

DLC-API connects to four separate MySQL databases:
- **db_auth** - Authentication and user accounts
- **db_db** (db_game) - Game server data
- **db_data** - Game static data (items, skills, strings)
- **db_post** - Post/forum data

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root of `dlc-api` with the following structure:

```env
# API Configuration
API_PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Auth Database (db_auth)
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=your-password
DB_AUTH_NAME=db_auth

# Game Database (db_db)
DB_GAME_HOST=localhost
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASS=your-password
DB_GAME_NAME=db_db

# Data Database (db_data)
DB_DATA_HOST=localhost
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=your-password
DB_DATA_NAME=db_data

# Post Database (db_post)
DB_POST_HOST=localhost
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASS=your-password
DB_POST_NAME=db_post
```

### Variable Naming Convention

- `DB_[DATABASE]_HOST` - Database host (e.g., localhost, 192.168.1.100)
- `DB_[DATABASE]_PORT` - Database port (default: 3306)
- `DB_[DATABASE]_USER` - Database username
- `DB_[DATABASE]_PASS` - Database password (can be empty string for no password)
- `DB_[DATABASE]_NAME` - Database name

**Important**: The password variables use `_PASS` suffix (not `_PASSWORD`) for consistency.

## Environment Validation

The API uses Joi schema validation to ensure all required environment variables are present at startup. If any required variables are missing, the application will fail to start with a clear error message.

### Validation Rules

- All database connection variables are **required**
- Password fields can be empty strings (for local dev with no password)
- Port numbers must be valid numbers (default: 3306)
- JWT_SECRET is required for security

## Troubleshooting

### Error: Access denied for user 'root'@'host' (using password: NO)

**Cause**: The database password variable is not being loaded from the `.env` file.

**Solutions**:
1. Verify `.env` file exists in `/tools/apps/dlc-api/.env`
2. Check that password variable uses `_PASS` suffix (e.g., `DB_DATA_PASS`)
3. Ensure `.env` file is not in `.gitignore` (though it should be for production)
4. Verify no trailing spaces in `.env` file values
5. Restart the application after changing `.env` file

### Error: Access denied for user 'root'@'host' (using password: YES)

**Cause**: The password is incorrect or user doesn't have proper permissions.

**Solutions**:
1. Verify password is correct in `.env` file
2. Check MySQL user permissions:
   ```sql
   GRANT ALL PRIVILEGES ON db_data.* TO 'root'@'%';
   FLUSH PRIVILEGES;
   ```
3. Verify user exists:
   ```sql
   SELECT User, Host FROM mysql.user WHERE User='root';
   ```

### Error: connect ECONNREFUSED

**Cause**: Cannot connect to MySQL server.

**Solutions**:
1. Verify MySQL is running:
   ```bash
   sudo service mysql status
   # or
   brew services list | grep mysql
   ```
2. Check host and port in `.env` file
3. Verify firewall allows connections to port 3306
4. For Docker: ensure MySQL container is running

### Error: ER_BAD_DB_ERROR: Unknown database

**Cause**: The specified database doesn't exist.

**Solutions**:
1. Create the database:
   ```sql
   CREATE DATABASE db_data;
   ```
2. Verify database name in `.env` matches exactly (case-sensitive on some systems)
3. Check you're connecting to the correct MySQL server

## Docker Setup

### Using Docker Compose

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
      MYSQL_DATABASE: db_data
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Then update `.env`:
```env
DB_DATA_HOST=localhost
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=yourpassword
DB_DATA_NAME=db_data
```

### Multiple Databases in Docker

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
    ports:
      - "3306:3306"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Create `init.sql`:
```sql
CREATE DATABASE IF NOT EXISTS db_auth;
CREATE DATABASE IF NOT EXISTS db_db;
CREATE DATABASE IF NOT EXISTS db_data;
CREATE DATABASE IF NOT EXISTS db_post;
```

## Connection Testing

The API automatically tests all database connections on startup. You'll see output like:

```
🚀 Starting DLC API...
Testing database connections...
✓ Database connection successful: auth (db_auth)
✓ Database connection successful: game (db_db)
✓ Database connection successful: data (db_data)
✓ Database connection successful: post (db_post)
✓ API running on port 3000
```

### Manual Connection Test

Test connection manually:
```bash
mysql -h localhost -P 3306 -u root -p db_data
```

## Health Check Endpoint

The API provides a health check endpoint to verify the service is running:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T14:53:42.021Z",
  "version": "0.4.0"
}
```

## Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong passwords** in production
3. **Use environment-specific .env files** - `.env.development`, `.env.production`
4. **Rotate credentials regularly** in production
5. **Use connection pooling** - Already configured (limit: 10 connections per pool)
6. **Monitor connection health** - Check logs for connection errors
7. **Use SSL/TLS** in production - Configure in MySQL connection options

## Production Deployment

### Environment Variables in Production

Don't use `.env` files in production. Instead:

1. **Use system environment variables**:
   ```bash
   export DB_DATA_HOST=prod-mysql.example.com
   export DB_DATA_PASS=secure-password
   ```

2. **Use secrets management**:
   - AWS Secrets Manager
   - HashiCorp Vault
   - Kubernetes Secrets
   - Azure Key Vault

3. **Use managed databases**:
   - AWS RDS
   - Google Cloud SQL
   - Azure Database for MySQL

### Production Checklist

- [ ] All passwords are strong and unique
- [ ] SSL/TLS enabled for MySQL connections
- [ ] Database users have minimal required permissions
- [ ] Connection pools properly configured
- [ ] Health checks configured in load balancer
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Secrets stored securely (not in code or `.env`)

## Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [Environment Variable Best Practices](https://12factor.net/config)
