# AGENT_DLC_UNIVERSAL_FIX_v0.7.1.md

## Context

Repository: **EVS-DLC**  
Target: Full-stack audit and repair using **MySQL 8.0 docker-compose** as the only database service.  
Objective: Ensure all subprojects (`dlc-api`, `frontend`, `infra/DB`) operate together correctly.  
Goal version: **v0.7.1 (Stable Sync Build)**  

---

## 1. Core Directives

1. **Analyse entire repository** structure under `EVS-DLC/`.
2. **Validate backend (dlc-api)**:
   - Confirm NestJS app boots with Fastify and CORS enabled.
   - Health endpoints (`/health`, `/ops/redis`, `/ops/db`) respond 200 OK.
   - `.env` matches current MySQL 8.0 docker setup.
3. **Validate frontend (DLC Web Admin)**:
   - `.env` variables aligned with backend ports and routes.
   - Health-check panel reflects backend status correctly.
4. **Validate infrastructure**:
   - Use exactly this Docker Compose definition (no substitution, no MariaDB).
   - Verify container health and volume mount consistency.
5. **Generate fresh `.env.example` files** for backend + frontend,  
   populated from the working `.env` values you provided.
6. **Auto-fix any detected route prefix mismatches** between `/health` and `/api/health`.
7. **Document everything** into `/docs/`.

---

## 2. Confirmed Docker Setup

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: evs-lc-${SERVER:-dev}-mysql
    env_file:
      - .env
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-secret}
      MYSQL_APP_USER: ${MYSQL_APP_USER:-}
      MYSQL_APP_PASSWORD: ${MYSQL_APP_PASSWORD:-}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    command:
      - mysqld
      - --max_allowed_packet=1G
      - --net_read_timeout=600
      - --net_write_timeout=600
      - --connect_timeout=60
      - --wait_timeout=28800
      - --interactive_timeout=28800
    volumes:
      - mysql-data:/var/lib/mysql
      - ./servers/${SERVER:-dev}:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-p${MYSQL_ROOT_PASSWORD:-secret}"]
      interval: 10s
      timeout: 5s
      retries: 10
  adminer:
    image: adminer:4
    container_name: evs-lc-${SERVER:-dev}-adminer
    depends_on:
      - mysql
    ports:
      - "${ADMINER_PORT:-8080}:8080"
    environment:
      ADMINER_DEFAULT_SERVER: mysql
volumes:
  mysql-data:
    name: evs-lc-${SERVER:-dev}-mysql-data
```

**Agent must not alter image type or database flavor.**

---

## 3. Backend .env.example

```env
API_PORT=30089
NODE_ENV=development
JWT_SECRET=replace-this-before-prod

DB_AUTH_HOST=127.0.0.1
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth

DB_GAME_HOST=127.0.0.1
DB_GAME_PORT=3306
DB_GAME_USER=root
DB_GAME_PASS=root
DB_GAME_NAME=db_db

DB_DATA_HOST=127.0.0.1
DB_DATA_PORT=3306
DB_DATA_USER=root
DB_DATA_PASS=root
DB_DATA_NAME=db_data

DB_POST_HOST=127.0.0.1
DB_POST_PORT=3306
DB_POST_USER=root
DB_POST_PASS=root
DB_POST_NAME=db_post

USE_CACHE=false
REDIS_URL=redis://localhost:6379
CACHE_TTL=120
CACHE_PREFIX=dlc
PRELOAD_ON_START=false
PRELOAD_TABLES=t_item,t_skill,t_skilllevel,t_string
LOG_LEVEL=debug
```

---

## 4. Frontend .env.example

```env
VITE_APP_ENV=development
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.7.1
VITE_API_URL=http://localhost:30089
VITE_API_HEALTH_URL=http://localhost:30089/health
VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis
VITE_DB_HEALTH_URL=http://localhost:30089/ops/db
VITE_API_TIMEOUT=8000
VITE_DATA_CACHE=true
VITE_ENABLE_DEBUG_PANEL=true
VITE_LOG_LEVEL=debug
```

---

## 5. Code Adjustments to Verify

### main.ts

```typescript
const app = await NestFactory.create(AppModule, { cors: true });
app.setGlobalPrefix('');
await app.listen(process.env.API_PORT || 30089, '0.0.0.0');
```

### HealthController

```typescript
@Controller('health')
export class HealthController {
  @Get()
  status() {
    return { status: 'ok', version: '0.7.1' };
  }
}
```

### OpsController

```typescript
@Controller('ops')
export class OpsController {
  @Get('redis')
  async getRedisStatus() {
    // Return Redis connection status
  }

  @Get('db')
  async getDatabaseStatus() {
    // Return database connection status
  }
}
```

---

## 6. Frontend Proxy Mapping

### vite.config.ts

```typescript
server: {
  proxy: {
    '/health': 'http://localhost:30089',
    '/ops': 'http://localhost:30089',
    '/data': 'http://localhost:30089',
    '/game': 'http://localhost:30089',
  },
},
```

---

## 7. Validation Checklist

| Test                   | Expected                                    |
|------------------------|---------------------------------------------|
| `pnpm dev` (dlc-api)   | ✅ v0.7.1 running, Fastify + CORS active    |
| `GET /health`          | ✅ JSON {status:"ok", version: "0.7.1"}     |
| `GET /ops/redis`       | ✅ Redis status returned                    |
| `GET /ops/db`          | ✅ Database status returned                 |
| Frontend dashboard     | ✅ API Health Status = OK                   |
| `.env.example`         | ✅ Present in both apps                     |
| Docker MySQL           | ✅ Healthy container, no MariaDB present    |
| Docs                   | ✅ New audit docs generated                 |
| Commit                 | chore: universal fix v0.7.1                 |

---

## 8. Documentation to Create

- `docs/ENV_SYNC_GUIDE.md`
- `docs/HEALTH_ENDPOINTS.md`
- `docs/DOCKER_VALIDATION.md`
- `docs/CHANGELOG_v0.7.1.md`

---

## End of Directive – v0.7.1 Universal MySQL 8.0 Fix Build

This agent ensures the entire EVS-DLC repository operates correctly with MySQL 8.0 as the exclusive database service. No MariaDB, no substitutions, and no unnecessary optimizations. The agent validates all connections, generates clean `.env.example` files, sets up health routing correctly, and documents everything thoroughly.
