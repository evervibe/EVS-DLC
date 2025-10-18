# Environment Matrix

**Version:** 1.0.0  
**Last Updated:** October 18, 2025

---

## 📋 Overview

This document provides a comprehensive matrix of all environment variables used across the EVS-DLC ecosystem, including the backend API, frontend admin interface, and infrastructure components.

---

## 🎯 Environment Types

| Environment | Description | Use Case |
|------------|-------------|----------|
| **Development** | Local development with hot reload | Daily development work |
| **Staging** | Pre-production testing | QA and integration testing |
| **Production** | Live production environment | End users |

---

## 🔧 Backend API (dlc-api)

### Port & Server Configuration

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `API_PORT` | `30089` | `30089` | `8080` | API server port |
| `NODE_ENV` | `development` | `staging` | `production` | Node environment |
| `LOG_LEVEL` | `debug` | `info` | `error` | Logging verbosity |

### Security

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `JWT_SECRET` | `replace-this-before-prod` | `<random-256-bit>` | `<random-256-bit>` | JWT signing secret |
| `CORS_ORIGINS` | `http://localhost:5174` | `https://staging.app.com` | `https://app.com` | Allowed CORS origins |

### Database: Authentication (db_auth)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `DB_AUTH_HOST` | `127.0.0.1` | `<db-host>` | `<db-host>` | Database host |
| `DB_AUTH_PORT` | `3306` | `3306` | `3306` | Database port |
| `DB_AUTH_USER` | `root` | `dlc_user` | `dlc_user` | Database user |
| `DB_AUTH_PASS` | `root` | `<secure-pass>` | `<secure-pass>` | Database password |
| `DB_AUTH_NAME` | `db_auth` | `db_auth` | `db_auth` | Database name |

### Database: Game (db_db)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `DB_GAME_HOST` | `127.0.0.1` | `<db-host>` | `<db-host>` | Database host |
| `DB_GAME_PORT` | `3306` | `3306` | `3306` | Database port |
| `DB_GAME_USER` | `root` | `dlc_user` | `dlc_user` | Database user |
| `DB_GAME_PASS` | `root` | `<secure-pass>` | `<secure-pass>` | Database password |
| `DB_GAME_NAME` | `db_db` | `db_db` | `db_db` | Database name |

### Database: Data (db_data)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `DB_DATA_HOST` | `127.0.0.1` | `<db-host>` | `<db-host>` | Database host |
| `DB_DATA_PORT` | `3306` | `3306` | `3306` | Database port |
| `DB_DATA_USER` | `root` | `dlc_user` | `dlc_user` | Database user |
| `DB_DATA_PASS` | `root` | `<secure-pass>` | `<secure-pass>` | Database password |
| `DB_DATA_NAME` | `db_data` | `db_data` | `db_data` | Database name |

### Database: Posts (db_post)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `DB_POST_HOST` | `127.0.0.1` | `<db-host>` | `<db-host>` | Database host |
| `DB_POST_PORT` | `3306` | `3306` | `3306` | Database port |
| `DB_POST_USER` | `root` | `dlc_user` | `dlc_user` | Database user |
| `DB_POST_PASS` | `root` | `<secure-pass>` | `<secure-pass>` | Database password |
| `DB_POST_NAME` | `db_post` | `db_post` | `db_post` | Database name |

### Cache (Redis)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `USE_CACHE` | `false` | `true` | `true` | Enable Redis cache |
| `REDIS_URL` | `redis://localhost:6379` | `redis://<host>:6379` | `redis://<host>:6379` | Redis connection URL |
| `CACHE_TTL` | `120` | `300` | `600` | Cache TTL (seconds) |
| `CACHE_PREFIX` | `dlc:dev:` | `dlc:stg:` | `dlc:prod:` | Cache key prefix |

### Performance

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `PRELOAD_ON_START` | `false` | `false` | `true` | Preload data on startup |
| `PRELOAD_TABLES` | `t_item,t_skill` | `t_item,t_skill,t_skilllevel,t_string` | `t_item,t_skill,t_skilllevel,t_string` | Tables to preload |

---

## 🎨 Frontend (dlc-web-admin)

### API Configuration

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:30089` | `https://api-staging.app.com` | `https://api.app.com` | Backend API URL |

### Application Configuration

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_APP_ENV` | `development` | `staging` | `production` | App environment |
| `NEXT_PUBLIC_APP_VERSION` | `1.1.0-alpha` | `1.1.0-alpha` | `1.0.0` | App version |
| `NEXT_PUBLIC_DEBUG` | `true` | `true` | `false` | Enable debug mode |

### Optional Health Endpoints

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `NEXT_PUBLIC_API_HEALTH_URL` | `(auto-derived)` | `(auto-derived)` | `(auto-derived)` | Health check endpoint |
| `NEXT_PUBLIC_REDIS_HEALTH_URL` | `(auto-derived)` | `(auto-derived)` | `(auto-derived)` | Redis health endpoint |
| `NEXT_PUBLIC_DB_HEALTH_URL` | `(auto-derived)` | `(auto-derived)` | `(auto-derived)` | DB health endpoint |

---

## 🐳 Infrastructure (Docker)

### MySQL Database

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `MYSQL_ROOT_PASSWORD` | `root` | `<secure-pass>` | `<secure-pass>` | MySQL root password |
| `MYSQL_DATABASE` | `db_auth,db_db,db_data,db_post` | `(same)` | `(same)` | Database names |
| `MYSQL_USER` | `root` | `dlc_user` | `dlc_user` | MySQL user |
| `MYSQL_PASSWORD` | `root` | `<secure-pass>` | `<secure-pass>` | MySQL password |

### Adminer (Database Admin UI)

| Variable | Development | Staging | Production | Description |
|----------|-------------|---------|------------|-------------|
| `ADMINER_PORT` | `8080` | `(disabled)` | `(disabled)` | Adminer web port |
| `ADMINER_DESIGN` | `default` | N/A | N/A | UI theme |

---

## 📝 Configuration Templates

### Backend .env (Development)

```bash
# API Configuration
API_PORT=30089
NODE_ENV=development
LOG_LEVEL=debug

# Security
JWT_SECRET=replace-this-before-prod

# Database: Authentication
DB_AUTH_HOST=127.0.0.1
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth

# Database: Game
DB_GAME_HOST=127.0.0.1
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASS=root
DB_GAME_NAME=db_db

# Database: Data
DB_DATA_HOST=127.0.0.1
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=root
DB_DATA_NAME=db_data

# Database: Posts
DB_POST_HOST=127.0.0.1
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASS=root
DB_POST_NAME=db_post

# Cache (Redis)
USE_CACHE=false
REDIS_URL=redis://localhost:6379
CACHE_TTL=120
CACHE_PREFIX=dlc:dev:

# Performance
PRELOAD_ON_START=false
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
```

### Frontend .env.local (Development)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:30089

# Application
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_VERSION=1.1.0-alpha
NEXT_PUBLIC_DEBUG=true
```

### Backend .env (Production)

```bash
# API Configuration
API_PORT=8080
NODE_ENV=production
LOG_LEVEL=error

# Security - CHANGE THESE!
JWT_SECRET=<generate-secure-256-bit-secret>
CORS_ORIGINS=https://app.evervibe.com

# Database: Authentication
DB_AUTH_HOST=<production-db-host>
DB_AUTH_PORT=3306
DB_AUTH_USER=dlc_user
DB_AUTH_PASS=<secure-password>
DB_AUTH_NAME=db_auth

# Database: Game
DB_GAME_HOST=<production-db-host>
DB_GAME_PORT=3306
DB_GAME_USER=dlc_user
DB_GAME_PASS=<secure-password>
DB_GAME_NAME=db_db

# Database: Data
DB_DATA_HOST=<production-db-host>
DB_DATA_PORT=3306
DB_DATA_USER=dlc_user
DB_DATA_PASS=<secure-password>
DB_DATA_NAME=db_data

# Database: Posts
DB_POST_HOST=<production-db-host>
DB_POST_PORT=3306
DB_POST_USER=dlc_user
DB_POST_PASS=<secure-password>
DB_POST_NAME=db_post

# Cache (Redis)
USE_CACHE=true
REDIS_URL=redis://<production-redis-host>:6379
CACHE_TTL=600
CACHE_PREFIX=dlc:prod:

# Performance
PRELOAD_ON_START=true
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
```

### Frontend .env.production (Production)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.evervibe.com

# Application
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG=false
```

---

## 🔒 Security Best Practices

### Development
- ✅ Use placeholder secrets
- ✅ Localhost connections only
- ✅ Debug logging enabled
- ✅ No real user data

### Staging
- ⚠️ Use strong passwords
- ⚠️ Limited access
- ✅ SSL/TLS enabled
- ✅ Test data only

### Production
- 🔐 256-bit secure secrets
- 🔐 Environment variables only (no .env files)
- 🔐 Encrypted database connections
- 🔐 Minimal logging
- 🔐 No debug endpoints exposed
- 🔐 Rate limiting enabled
- 🔐 CORS strictly configured

---

## 🔄 Environment Variable Priority

For both backend and frontend, environment variables are loaded in this order (last wins):

1. **System environment** (highest priority)
2. `.env.local` (local overrides, gitignored)
3. `.env.production` / `.env.development` (environment-specific)
4. `.env` (shared defaults)
5. **Code defaults** (lowest priority)

---

## ✅ Validation Checklist

### Before Deployment

#### Backend
- [ ] All database credentials changed from defaults
- [ ] JWT_SECRET is cryptographically secure (256-bit)
- [ ] CORS_ORIGINS properly restricted
- [ ] LOG_LEVEL set to 'error' or 'warn'
- [ ] USE_CACHE enabled
- [ ] Redis connection verified
- [ ] All database connections tested
- [ ] No .env files in version control

#### Frontend
- [ ] NEXT_PUBLIC_API_URL points to production API
- [ ] NEXT_PUBLIC_DEBUG set to false
- [ ] NEXT_PUBLIC_APP_ENV set to 'production'
- [ ] Version number updated
- [ ] Build tested in production mode
- [ ] Environment variables in deployment platform

#### Infrastructure
- [ ] MySQL root password changed
- [ ] Database users have limited permissions
- [ ] Adminer disabled in production
- [ ] Firewall rules configured
- [ ] SSL/TLS certificates valid
- [ ] Backup system configured

---

## 🔧 Troubleshooting

### Backend Won't Connect to Database

1. Verify database host is accessible:
   ```bash
   ping $DB_AUTH_HOST
   ```

2. Check credentials:
   ```bash
   mysql -h $DB_AUTH_HOST -u $DB_AUTH_USER -p
   ```

3. Verify database exists:
   ```sql
   SHOW DATABASES;
   ```

### Frontend Can't Reach API

1. Verify API URL:
   ```bash
   echo $NEXT_PUBLIC_API_URL
   ```

2. Test API health:
   ```bash
   curl $NEXT_PUBLIC_API_URL/health
   ```

3. Check CORS settings in backend

### Environment Variables Not Loading

1. Check file names (`.env.local` not `.env.local.txt`)
2. Restart dev server after changes
3. Verify no trailing spaces in values
4. Check variable names match exactly (case-sensitive)

---

## 📚 Related Documentation

- [Backend Boot Flow](./BACKEND_BOOT_FLOW.md)
- [Frontend ENV Sync Guide](./FRONTEND_ENV_SYNC_GUIDE.md)
- [DLC API Overview](./DLC_API_OVERVIEW.md)
- [DLC Web Admin Overview](./DLC_WEB_ADMIN_OVERVIEW.md)

---

**Last Updated:** October 18, 2025  
**Version:** 1.0.0  
**Maintainer:** EverVibe Studios Infrastructure Team
