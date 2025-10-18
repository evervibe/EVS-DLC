# EVS-DLC Architecture Overview
**Version:** 1.2.0-stable  
**Last Updated:** 2025-10-18

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Components](#components)
- [Data Flow](#data-flow)
- [Security](#security)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)

---

## System Overview

EVS-DLC is a modern monorepo-based DLC (Downloadable Content) management system built with production-ready technologies and clean architecture principles.

### Key Characteristics
- **Monorepo Structure:** Single repository with multiple packages
- **Type-Safe:** Full TypeScript coverage across all components
- **API-First:** RESTful backend with Fastify
- **Modern Frontend:** Next.js 15 with React 19
- **Database:** Multi-database MySQL architecture
- **Caching:** Redis for performance optimization
- **Security:** JWT authentication with RBAC
- **CI/CD:** Automated pipeline with GitHub Actions
- **Containerized:** Docker Compose for orchestration

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          DLC Web Admin (Next.js 15)                      │  │
│  │  • React 19 with TypeScript                              │  │
│  │  • Tailwind CSS for styling                              │  │
│  │  • TanStack Query for state management                   │  │
│  │  • Port: 5174                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          DLC API (NestJS 10 + Fastify 4)                 │  │
│  │  • RESTful API endpoints                                 │  │
│  │  • JWT authentication with RBAC                          │  │
│  │  • Rate limiting & Helmet security                       │  │
│  │  • Health checks & monitoring                            │  │
│  │  • Port: 30089                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    ↓ TypeORM                    ↓ ioredis
┌────────────────────────────────┐  ┌────────────────────────────┐
│       Data Layer               │  │      Cache Layer           │
│  ┌──────────────────────────┐  │  │  ┌──────────────────────┐ │
│  │  MySQL 8.0               │  │  │  │  Redis 7             │ │
│  │  • db_auth (users)       │  │  │  │  • Session cache     │ │
│  │  • db_game (items)       │  │  │  │  • Query cache       │ │
│  │  • db_data (content)     │  │  │  │  • Port: 6379        │ │
│  │  • db_post (forum)       │  │  │  └──────────────────────┘ │
│  │  • Port: 3306            │  │  │                            │
│  └──────────────────────────┘  │  └────────────────────────────┘
└────────────────────────────────┘
```

---

## Components

### 1. DLC Web Admin (Frontend)
**Location:** `tools/apps/dlc-web-admin/`  
**Version:** 1.2.0

#### Technology Stack
- **Framework:** Next.js 15.1.6 (App Router)
- **UI Library:** React 19.0.0
- **Language:** TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.17
- **State Management:** @tanstack/react-query 5.62.11
- **HTTP Client:** Axios 1.7.9
- **Animations:** framer-motion 11.15.0

#### Features
- Dashboard with real-time statistics
- CRUD operations for Items, Skills, Skill Levels, Strings
- Health monitoring interface
- Responsive design
- Type-safe API client

#### Pages
- `/` - Landing page
- `/dashboard` - Main dashboard with statistics
- `/items` - Items management
- `/skills` - Skills management
- `/skilllevels` - Skill levels management
- `/strings` - Localization strings management

---

### 2. DLC API (Backend)
**Location:** `tools/apps/dlc-api/`  
**Version:** 1.2.0

#### Technology Stack
- **Framework:** NestJS 10.4.20
- **HTTP Server:** Fastify 4.28.1
- **Language:** TypeScript 5.3.3
- **ORM:** TypeORM 0.3.27
- **Database:** MySQL2 3.6.5
- **Cache:** ioredis 5.8.1
- **Security:** @fastify/helmet 11.0.0, @fastify/rate-limit 10.3.0
- **Auth:** jsonwebtoken 9.0.2
- **Validation:** Joi 18.0.1 + class-validator 0.14.2

#### Architecture Patterns
- **Module-based structure:** Organized by domain
- **Dependency Injection:** NestJS DI container
- **Repository Pattern:** TypeORM repositories
- **Guard-based auth:** JWT + RBAC guards
- **Middleware:** Rate limiting, validation, error handling
- **Environment-based config:** Type-safe configuration

#### API Endpoints

**Health & Monitoring**
- `GET /` - API root status
- `GET /health` - Health check with database status
- `GET /health/ready` - Readiness probe

**Game Data Management**
- `GET /game/items` - List all items
- `GET /game/items/:id` - Get item by ID
- `GET /game/skills` - List all skills
- `GET /game/skills/:id` - Get skill by ID
- `GET /game/skilllevels` - List skill levels
- `GET /game/skilllevels/:id` - Get skill level by ID
- `GET /game/strings` - List localization strings
- `GET /game/strings/:id` - Get string by ID

**Authentication** (Ready for implementation)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user

---

### 3. Shared Libraries
**Location:** `tools/shared/`  
**Version:** 1.0.0

#### lib/
- **api.ts:** Type-safe API client
- **types.ts:** Shared TypeScript interfaces
- Reusable across frontend and backend

#### ui/ (Prepared for future)
- Shared UI components
- Design system primitives

---

### 4. Infrastructure
**Location:** `infra/`

#### Database (MySQL 8.0)
**Location:** `infra/DB/game/`

Four databases for separation of concerns:
- **db_auth:** User authentication & authorization
- **db_game:** Game items, skills, levels
- **db_data:** Static game data & content
- **db_post:** Forum & community posts

**Features:**
- Docker Compose orchestration
- Automatic initialization scripts
- Health checks
- Volume persistence
- Adminer web UI (port 8080)

#### Cache (Redis 7)
- Session storage
- Query result caching
- Rate limit tracking
- TTL-based expiration

#### Docker Compose
**Location:** `infra/docker-compose.yml`

Production-ready orchestration with:
- MySQL with health checks
- Redis with persistence
- API with dependency management
- Web frontend
- Adminer database UI
- Internal Docker network

---

## Data Flow

### 1. User Request Flow
```
User → Browser → Next.js Frontend → HTTP Request → NestJS API
                                                        ↓
                                            JWT Validation (Guard)
                                                        ↓
                                            RBAC Check (RolesGuard)
                                                        ↓
                                            Rate Limit (Middleware)
                                                        ↓
                                            Controller → Service
                                                        ↓
                                            Cache Check (Redis)
                                                        ↓
                                            Database Query (MySQL)
                                                        ↓
                                            Transform & Validate
                                                        ↓
User ← Browser ← Next.js Frontend ← HTTP Response ← NestJS API
```

### 2. Authentication Flow
```
1. User submits credentials
2. API validates against db_auth
3. Generate JWT token (HS256)
4. Return token + user info
5. Frontend stores token
6. Subsequent requests include token
7. JwtAuthGuard validates token
8. RolesGuard checks permissions
9. Request proceeds or rejected
```

### 3. Data Caching Flow
```
Request → Check Redis Cache
            ↓ Cache Miss
          Database Query
            ↓
          Store in Redis (with TTL)
            ↓
          Return Data

Request → Check Redis Cache
            ↓ Cache Hit
          Return Cached Data
```

---

## Security

### 1. Authentication
- **Method:** JWT (JSON Web Tokens)
- **Algorithm:** HS256
- **TTL:** 1 hour (configurable)
- **Storage:** Environment variable `JWT_SECRET`
- **Refresh:** Token refresh flow ready

### 2. Authorization (RBAC)
**Location:** `tools/apps/dlc-api/src/common/rbac/`

#### Roles
- **USER:** Basic access to read operations
- **ADMIN:** Full CRUD operations + user management
- **DEVOPS:** All permissions + system operations

#### Implementation
```typescript
// Define required roles
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin-only')
adminRoute() { ... }
```

#### Role Hierarchy
- DEVOPS → inherits ADMIN, USER
- ADMIN → inherits USER
- USER → base permissions

### 3. Security Middleware
- **Helmet:** Security headers
- **Rate Limiting:** 100 requests/minute per IP
- **CORS:** Configured origins only
- **Input Validation:** class-validator + Joi

### 4. Database Security
- Separate database users per environment
- Credential management via environment variables
- No hardcoded secrets
- Parameterized queries (TypeORM)

---

## Deployment

### Development
```bash
# 1. Start databases
cd infra/DB/game
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Start API (terminal 1)
cd tools/apps/dlc-api
pnpm dev

# 4. Start frontend (terminal 2)
cd tools/apps/dlc-web-admin
pnpm dev

# Access:
# - Frontend: http://localhost:5174
# - API: http://localhost:30089
# - Adminer: http://localhost:8080
```

### Production (Docker Compose)
```bash
# 1. Configure environment
cp .env.production.example .env.production
# Edit .env.production with production values

# 2. Start all services
cd infra
docker compose up -d

# 3. Check status
docker compose ps
docker compose logs -f

# Access:
# - Frontend: http://localhost:5174
# - API: http://localhost:30089
# - Adminer: http://localhost:8080
```

### CI/CD Pipeline
**Location:** `.github/workflows/ci.yml`

#### On Push/PR:
1. Checkout code
2. Setup Node.js 20.x
3. Setup pnpm 9.12.3
4. Install dependencies
5. Lint backend & frontend
6. Type check frontend
7. Build backend & frontend
8. Run tests
9. Upload artifacts

#### On Main Branch Push:
10. Build Docker images
11. Push to registry (if configured)

---

## Environment Configuration

### Backend (.env)
```bash
# Core
NODE_ENV=production
API_PORT=30089

# Database
DB_AUTH_HOST=mysql
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=secure_password
DB_AUTH_NAME=db_auth

# (Similar for db_game, db_data, db_post)

# Cache
REDIS_URL=redis://redis:6379
USE_CACHE=true
CACHE_TTL=3600

# Security
JWT_SECRET=your-secure-secret-min-32-chars
JWT_EXPIRES_IN=3600
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:30089
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_VERSION=1.2.0
NEXT_PUBLIC_DEBUG=false
```

### Docker Compose (.env)
```bash
# MySQL
MYSQL_ROOT_PASSWORD=secure_password
MYSQL_PORT=3306

# Redis
REDIS_PORT=6379

# Application
API_PORT=30089
WEB_PORT=5174
ADMINER_PORT=8080

# JWT
JWT_SECRET=your-secure-secret-min-32-chars
```

---

## Performance Considerations

### 1. Caching Strategy
- Redis for frequently accessed data
- TTL: 3600 seconds (1 hour)
- Cache invalidation on updates
- Query result caching

### 2. Database Optimization
- Connection pooling
- Indexed queries
- Separate databases for different concerns
- Query optimization

### 3. Frontend Optimization
- Static site generation (SSG)
- Code splitting
- Image optimization
- Lazy loading

### 4. API Optimization
- Fastify (faster than Express)
- Rate limiting
- Compression
- Response caching

---

## Monitoring & Health Checks

### 1. API Health Endpoint
```json
GET /health

Response:
{
  "status": "ok",
  "uptime": 12345,
  "databases": {
    "db_auth": "connected",
    "db_game": "connected",
    "db_data": "connected",
    "db_post": "connected"
  },
  "cache": {
    "redis": "connected"
  }
}
```

### 2. Docker Health Checks
- MySQL: `mysqladmin ping`
- Redis: `redis-cli ping`
- API: `curl /health`
- Web: `curl localhost:5174`

### 3. Metrics (Future)
- Request duration
- Error rates
- Cache hit ratio
- Database query times

---

## Scalability

### Horizontal Scaling
- Stateless API design
- Session storage in Redis
- Load balancer ready
- Multiple API instances

### Vertical Scaling
- Database optimization
- Redis memory management
- Connection pool tuning
- Resource allocation

---

## Development Workflow

### 1. Local Development
```bash
# Install dependencies
pnpm install

# Start databases
cd infra/DB/game && docker compose up -d

# Run API in dev mode (with hot reload)
cd tools/apps/dlc-api && pnpm dev

# Run frontend in dev mode (with hot reload)
cd tools/apps/dlc-web-admin && pnpm dev
```

### 2. Testing
```bash
# Backend tests
cd tools/apps/dlc-api
pnpm test
pnpm test:cov

# Frontend type checking
cd tools/apps/dlc-web-admin
pnpm type-check
```

### 3. Building
```bash
# Backend
cd tools/apps/dlc-api
pnpm build

# Frontend
cd tools/apps/dlc-web-admin
pnpm build
```

---

## Future Enhancements (Roadmap)

### v1.3.0
- Create/Edit/Delete modals
- Toast notification system
- Inline editing
- Form validation
- Optimistic updates

### v1.4.0
- Full authentication implementation
- User management UI
- Password reset flow
- Two-factor authentication

### v2.0.0
- Advanced monitoring dashboard
- Performance metrics
- Audit logging
- Auto-scaling configuration
- Kubernetes deployment

---

## Appendix

### Technology Versions
- **Node.js:** 20.x
- **pnpm:** 9.12.3
- **Next.js:** 15.1.6
- **React:** 19.0.0
- **NestJS:** 10.4.20
- **Fastify:** 4.28.1
- **TypeScript:** 5.3.3 (API), 5.7.2 (Frontend)
- **MySQL:** 8.0
- **Redis:** 7-alpine

### Key Files
- `pnpm-workspace.yaml` - Workspace configuration
- `.env.production.example` - Production environment template
- `infra/docker-compose.yml` - Docker orchestration
- `.github/workflows/ci.yml` - CI/CD pipeline
- `tools/apps/dlc-api/src/main.ts` - API entry point
- `tools/apps/dlc-web-admin/app/layout.tsx` - Frontend root layout

---

**Built with ❤️ by EverVibe Studios**  
**Version:** 1.2.0-stable | **Date:** 2025-10-18
