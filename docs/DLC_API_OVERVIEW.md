# DLC API Overview

**Version:** 0.9.0  
**Framework:** NestJS 10 + Fastify 4  
**Status:** ✅ Stable

---

## 📋 Summary

The DLC API is a high-performance backend service built with NestJS and Fastify, designed to manage DLC (Downloadable Content) data for the EverVibe Studios gaming ecosystem. It provides RESTful endpoints for managing items, skills, skill levels, and localization strings across four separate MySQL databases.

---

## 🏗️ Architecture

### Technology Stack

- **Framework:** NestJS 10.4.20
- **HTTP Server:** Fastify 4.28.1
- **Language:** TypeScript 5.3.3
- **ORM:** TypeORM 0.3.27
- **Database:** MySQL 8.0 (4 separate databases)
- **Cache:** Redis (IORedis 5.8.1) - prepared for future use
- **Validation:** class-validator 0.14.2 + Joi 18.0.1
- **Security:** @fastify/helmet 11.0.0 + @fastify/rate-limit 10.3.0

### Core Dependencies

```json
{
  "@nestjs/common": "10.4.20",
  "@nestjs/config": "4.0.2",
  "@nestjs/core": "10.4.20",
  "@nestjs/platform-fastify": "10.4.20",
  "@nestjs/typeorm": "11.0.0",
  "@fastify/helmet": "11.0.0",
  "@fastify/rate-limit": "10.3.0",
  "fastify": "4.28.1",
  "typeorm": "0.3.27",
  "ioredis": "5.8.1",
  "mysql2": "3.6.5"
}
```

---

## 🗄️ Database Architecture

The API manages connections to **4 separate MySQL databases**:

### 1. Authentication Database (`db_auth`)
- **Purpose:** User authentication and session management
- **Port:** 3306
- **Tables:** User accounts, sessions, permissions

### 2. Game Database (`db_db`)
- **Purpose:** Core game data and mechanics
- **Port:** 3306
- **Tables:** Game entities, configurations

### 3. Data Database (`db_data`)
- **Purpose:** DLC content data
- **Port:** 3306
- **Tables:** 
  - `t_item` - Items (weapons, armor, consumables)
  - `t_skill` - Skills (abilities, spells)
  - `t_skilllevel` - Skill progression data
  - `t_string` - Localization strings

### 4. Posts Database (`db_post`)
- **Purpose:** Community posts and user-generated content
- **Port:** 3306
- **Tables:** Posts, comments, community data

---

## 🌐 API Endpoints

### Health & Monitoring

#### `GET /health`
Returns comprehensive health status including database connectivity.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-18T00:00:00.000Z",
  "uptime": 1234.56,
  "databases": {
    "auth": "connected",
    "game": "connected",
    "data": "connected",
    "post": "connected"
  }
}
```

#### `GET /health/ready`
Readiness probe for container orchestration.

**Response:**
```json
{
  "status": "ready"
}
```

---

### Data Management Endpoints

#### Items API

**`GET /api/items`**  
Retrieve paginated list of items.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `type` - Filter by item type

**Response:**
```json
{
  "data": [
    {
      "a_index": 1,
      "a_name": "Iron Sword",
      "a_type": 1,
      "a_level": 1,
      "a_damage": 25
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**`GET /api/items/:id`**  
Get single item by ID.

**`POST /api/items`**  
Create new item (requires authentication).

**`PATCH /api/items/:id`**  
Update existing item (requires authentication).

**`DELETE /api/items/:id`**  
Delete item (requires authentication).

---

#### Skills API

**`GET /api/skills`**  
Retrieve paginated list of skills.

**Query Parameters:**
- `page` - Page number
- `limit` - Skills per page
- `job` - Filter by job class
- `type` - Filter by skill type

**Response:**
```json
{
  "data": [
    {
      "a_index": 1,
      "a_name": "Fireball",
      "a_job": 2,
      "a_type": 1,
      "a_maxLevel": 10,
      "a_targetType": 1
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

**`GET /api/skills/:id`**  
Get single skill by ID.

**`POST /api/skills`**  
Create new skill.

**`PATCH /api/skills/:id`**  
Update existing skill.

**`DELETE /api/skills/:id`**  
Delete skill.

---

#### Skill Levels API

**`GET /api/skilllevels`**  
Retrieve skill progression data.

**Query Parameters:**
- `skillIndex` - Filter by skill
- `level` - Filter by level
- `page` - Page number
- `limit` - Results per page

**Response:**
```json
{
  "data": [
    {
      "a_index": 1,
      "a_level": 1,
      "skill": {
        "a_index": 1,
        "a_name": "Fireball"
      },
      "a_needHP": 100,
      "a_needMP": 50,
      "a_needGP": 1000
    }
  ],
  "meta": {
    "total": 200,
    "page": 1,
    "limit": 20
  }
}
```

**`GET /api/skilllevels/:id`**  
Get single skill level.

**`POST /api/skilllevels`**  
Create skill level data.

**`PATCH /api/skilllevels/:id`**  
Update skill level.

**`DELETE /api/skilllevels/:id`**  
Delete skill level.

---

#### Strings API

**`GET /api/strings`**  
Retrieve localization strings.

**Query Parameters:**
- `language` - Filter by language code
- `category` - Filter by category
- `search` - Search in strings
- `page` - Page number
- `limit` - Results per page

**Response:**
```json
{
  "data": [
    {
      "a_index": 1,
      "a_string": "Welcome to the game",
      "a_language": "en",
      "a_category": "ui"
    }
  ],
  "meta": {
    "total": 1000,
    "page": 1,
    "limit": 20
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
API_PORT=30089
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-here

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
CACHE_PREFIX=dlc

# Performance
PRELOAD_ON_START=false
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string

# Logging
LOG_LEVEL=debug
```

---

## 🔒 Security Features

### 1. Helmet Security Headers
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 2. Rate Limiting
- **Enabled:** Yes (@fastify/rate-limit 10.3.0)
- **Default:** 100 requests per minute per IP
- **Configurable:** Per-endpoint limits available

### 3. CORS Configuration
- **Origins:** Configurable whitelist
- **Credentials:** Supported
- **Methods:** GET, POST, PATCH, DELETE, OPTIONS

### 4. Input Validation
- **Request DTOs:** Validated with class-validator
- **Query Parameters:** Validated with Joi schemas
- **Type Safety:** Full TypeScript coverage

---

## 🚀 Development

### Installation

```bash
cd tools/apps/dlc-api
pnpm install
```

### Running Locally

```bash
# Development mode (hot reload)
pnpm dev

# Production build
pnpm build

# Production mode
pnpm start:prod
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### Database Scripts

```bash
# Introspect database schema
pnpm introspect

# Generate mock entities
pnpm generate:mock
```

---

## 📦 Project Structure

```
dlc-api/
├── src/
│   ├── app.module.ts              # Main application module
│   ├── main.ts                    # Application entry point
│   │
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── interceptors/
│   │
│   ├── config/                    # Configuration modules
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── validation.schema.ts
│   │
│   ├── core/                      # Core business logic
│   │   ├── database/
│   │   └── cache/
│   │
│   ├── modules/                   # Feature modules
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.service.ts
│   │   │   └── health.module.ts
│   │   │
│   │   ├── items/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── items.controller.ts
│   │   │   ├── items.service.ts
│   │   │   └── items.module.ts
│   │   │
│   │   ├── skills/
│   │   ├── skilllevels/
│   │   └── strings/
│   │
│   ├── scripts/                   # Utility scripts
│   │   ├── introspect-database.ts
│   │   └── generate-mock-entities.ts
│   │
│   └── utils/                     # Helper utilities
│
├── dist/                          # Compiled output
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔄 Database Connections

### Connection Pool Configuration

Each database connection uses TypeORM with connection pooling:

```typescript
{
  type: 'mysql',
  host: process.env.DB_*_HOST,
  port: process.env.DB_*_PORT,
  username: process.env.DB_*_USER,
  password: process.env.DB_*_PASS,
  database: process.env.DB_*_NAME,
  entities: [...],
  synchronize: false,
  logging: process.env.LOG_LEVEL === 'debug',
  extra: {
    connectionLimit: 10
  }
}
```

### Health Checks

Each database connection is monitored:
- Connection status checked on startup
- Health endpoint reports database connectivity
- Automatic reconnection on connection loss

---

## 📊 Performance Features

### Redis Caching (Prepared)
- **Status:** Configured but not yet enabled
- **Use Case:** Cache frequently accessed data
- **TTL:** 120 seconds (configurable)
- **Prefix:** `dlc:` (configurable)

### Data Preloading (Optional)
- **Status:** Available but disabled by default
- **Use Case:** Preload common tables into memory
- **Tables:** t_item, t_skill, t_skilllevel, t_string

---

## 🐛 Troubleshooting

### API Won't Start

1. **Check port availability:**
   ```bash
   lsof -i :30089
   ```

2. **Verify database is running:**
   ```bash
   cd infra/DB/game
   docker compose ps
   ```

3. **Check database logs:**
   ```bash
   docker compose logs mysql
   ```

### Database Connection Fails

1. **Restart databases:**
   ```bash
   cd infra/DB/game
   docker compose down
   docker compose up -d
   ```

2. **Wait for health check:**
   ```bash
   docker compose ps
   # Wait until mysql shows (healthy)
   ```

3. **Test connection:**
   ```bash
   curl http://localhost:30089/health
   ```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

---

## 📈 Roadmap

### v1.0.0 (Current Release)
- ✅ Stable API endpoints
- ✅ Multi-database support
- ✅ Security hardening
- ✅ Rate limiting
- ✅ Comprehensive health checks

### v1.1.0 (Next)
- [ ] Enable Redis caching
- [ ] Implement data preloading
- [ ] Add cache warming strategies
- [ ] Enhanced performance metrics

### v2.0.0 (Future)
- [ ] Full authentication system
- [ ] Role-based access control (RBAC)
- [ ] JWT token validation
- [ ] WebSocket support for real-time updates

---

## 📄 Related Documentation

- [Repository Structure Analysis](./REPOSITORY_STRUCTURE_ANALYSIS.md)
- [Backend Boot Flow](./BACKEND_BOOT_FLOW.md)
- [System Health Check](./SYSTEM_HEALTH_CHECK.md)
- [API Reference v0.8.0](./API_REFERENCE_v0.8.0.md)

---

**Last Updated:** 2025-10-18  
**Version:** 0.9.0  
**Status:** ✅ Production Ready
