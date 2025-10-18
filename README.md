# EVS-DLC - EverVibe Studios DLC Development Ecosystem

**Version:** 1.2.0-stable  
**Status:** ✅ Production-Ready

Complete development ecosystem for DLC content management, featuring a modern NestJS backend API and Next.js frontend admin interface with unified monorepo architecture.

---

## 🎯 What's New in v1.2.0-stable

### ✨ Major Achievements
- ✅ **Legacy Cleanup:** Removed old dlc-dev-studios frontend (replaced with dlc-web-admin)
- ✅ **Fastify-Only Backend:** Eliminated Express dependencies, pure Fastify stack
- ✅ **RBAC Implementation:** Role-Based Access Control with User, Admin, DevOps roles
- ✅ **Production Infrastructure:** Complete Docker Compose orchestration with health checks
- ✅ **CI/CD Pipeline:** Automated build, test, and deployment with GitHub Actions
- ✅ **Security Hardening:** JWT authentication, rate limiting, Helmet security headers
- ✅ **Version Unification:** All packages updated to 1.2.0
- ✅ **Complete Documentation:** Architecture overview and production deployment guides

### 🏗️ Current Architecture
- **Backend:** NestJS 10 + Fastify 4 (v1.2.0)
- **Frontend:** Next.js 15 + React 19 (v1.2.0)
- **Shared Libraries:** Unified API client and types (v1.0.0)
- **Infrastructure:** Docker Compose with MySQL 8, Redis 7
- **Security:** JWT + RBAC with role hierarchy
- **CI/CD:** GitHub Actions pipeline
- **Documentation:** Complete architecture and deployment guides

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ (with pnpm 9.12.3+)
- **Docker** & Docker Compose
- **MySQL** 8.0+ (via Docker)

### Development Mode

```bash
# 1. Install pnpm globally
npm install -g pnpm@9.12.3

# 2. Install all workspace dependencies
pnpm install

# 3. Start MySQL database (in new terminal)
cd infra/DB/game
cp .env.example .env
docker compose up -d

# 4. Start Backend API (in new terminal)
cd tools/apps/dlc-api
cp .env.example .env  # Optional - has defaults!
pnpm dev

# 5. Start Frontend (in new terminal) 
cd tools/apps/dlc-web-admin
cp .env.example .env.local  # Optional - has defaults!
pnpm dev

# 6. Open browser
open http://localhost:5174
```

### Production Mode (Docker Compose)

```bash
# 1. Configure environment
cp .env.production.example .env.production
# Edit .env.production with secure credentials

# 2. Start all services
cd infra
docker compose up -d

# 3. Check health
curl http://localhost:30089/health

# 4. Access applications
open http://localhost:5174
```

**Health Check:** http://localhost:30089/health

---

## 📚 Documentation

Comprehensive guides available in `/docs/` and root:

### Architecture & Overview
- **[Architecture Overview](./ARCHITECTURE_OVERVIEW.md)** - Complete system architecture v1.2.0
- **[Implementation Summary v1.1.0](./docs/IMPLEMENTATION_SUMMARY_V1.1.0.md)** - v1.1.0 overview
- **[Migration Log v1.1.0](./docs/MIGRATION_LOG_V1.1.0.md)** - Migration tracking
- **[Repository Structure Analysis](./docs/REPOSITORY_STRUCTURE_ANALYSIS.md)** - Repository analysis
- **[Environment Matrix](./docs/ENVIRONMENT_MATRIX.md)** - Environment variable reference

### Production Deployment
- **[.env.production.example](./.env.production.example)** - Production environment template
- **[Docker Compose](./infra/docker-compose.yml)** - Complete infrastructure orchestration
- **[CI/CD Pipeline](./.github/workflows/ci.yml)** - Automated build and deployment

### Component Documentation
- **[DLC API Overview](./docs/DLC_API_OVERVIEW.md)** - Backend API documentation
- **[DLC API Validation v0.9.5](./docs/DLC_API_VALIDATION_v0.9.5.md)** - Backend validation report
- **[DLC Web Admin Overview](./docs/DLC_WEB_ADMIN_OVERVIEW.md)** - Frontend documentation

### Legacy Documentation
- **[System Health Check Guide](./docs/SYSTEM_HEALTH_CHECK.md)** - Health monitoring system
- **[Frontend ENV Sync Guide](./docs/FRONTEND_ENV_SYNC_GUIDE.md)** - Environment synchronization
- **[Backend Boot Flow](./docs/BACKEND_BOOT_FLOW.md)** - Bootstrap process
- **[Infrastructure Status Report](./docs/INFRA_STATUS_REPORT_v0.5.1.md)** - System overview

---

## 🏗️ Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   DLC Web Admin  │◄───────►│     DLC API      │◄───────►│  MySQL Databases │
│   (Frontend)     │  HTTP   │    (Backend)     │   TCP   │   (Docker)       │
│                  │         │                  │         │                  │
│   Next.js 15     │         │   NestJS 10      │         │   - db_auth      │
│   React 19       │         │   Fastify 4      │         │   - db_db        │
│   TypeScript 5   │         │   TypeORM 0.3    │         │   - db_data      │
│   Port: 5174     │         │   Port: 30089    │         │   - db_post      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

---

## 🔧 Technology Stack

### Backend (DLC API v1.2.0)
- **Framework:** NestJS 10.4.20 with Fastify adapter (pure Fastify, no Express)
- **Language:** TypeScript 5.3.3
- **ORM:** TypeORM 0.3.27
- **Database:** MySQL 8.0
- **Cache:** Redis 7 (ioredis 5.8.1)
- **Security:** @fastify/helmet 11.0.0, @fastify/rate-limit 10.3.0
- **Auth:** JWT (jsonwebtoken 9.0.2) with RBAC
- **Validation:** Joi 18.0.1 + class-validator 0.14.2
- **Location:** `tools/apps/dlc-api/`

### Frontend (DLC Web Admin v1.2.0)
- **Framework:** Next.js 15.1.6 (App Router)
- **UI Library:** React 19.0.0
- **Language:** TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.17
- **State:** @tanstack/react-query 5.62.11
- **Animations:** framer-motion 11.15.0
- **Location:** `tools/apps/dlc-web-admin/`

### Shared Libraries (v1.0.0)
- **API Client:** Fetch-based, type-safe
- **Types:** Shared TypeScript interfaces
- **Location:** `tools/shared/lib/`

### Infrastructure
- **Database:** MySQL 8.0 (Docker)
- **Cache:** Redis 7 (Docker)
- **Admin UI:** Adminer 4
- **Orchestration:** Docker Compose
- **CI/CD:** GitHub Actions
- **Workspace:** pnpm 9.12.3
- **Location:** `infra/`

---

## 📁 Repository Structure

```
EVS-DLC/
├── docs/                                   # 📚 Complete documentation
│   ├── IMPLEMENTATION_SUMMARY_V1.1.0.md   # v1.1.0 overview
│   ├── MIGRATION_LOG_V1.1.0.md            # Migration tracking
│   ├── LEGACY_REMOVAL_LOG_v1.1.0.md       # Legacy removal log
│   ├── DLC_API_VALIDATION_v0.9.5.md       # Backend validation
│   ├── REPOSITORY_STRUCTURE_ANALYSIS.md   # Repository analysis
│   ├── ENVIRONMENT_MATRIX.md              # Environment variables
│   ├── DLC_API_OVERVIEW.md                # Backend documentation
│   ├── DLC_WEB_ADMIN_OVERVIEW.md          # Frontend documentation
│   └── ... (25+ documentation files)
│
├── infra/                                  # Infrastructure
│   ├── docker-compose.yml                  # Production orchestration (NEW v1.2.0)
│   └── DB/
│       └── game/                           # MySQL databases
│           ├── docker-compose.yml          # Development database setup
│           └── .env.example                # Configuration template
│
├── tools/                                  # Application workspace
│   ├── apps/
│   │   ├── dlc-api/                        # Backend API (v1.2.0)
│   │   │   ├── src/
│   │   │   │   ├── common/rbac/            # RBAC system (NEW v1.2.0)
│   │   │   │   ├── modules/                # Feature modules
│   │   │   │   └── main.ts                 # Entry point
│   │   │   ├── .env.example                # Configuration template
│   │   │   └── package.json                # Dependencies
│   │   │
│   │   └── dlc-web-admin/                  # Frontend Admin (v1.2.0)
│   │       ├── app/                        # Next.js App Router
│   │       │   ├── dashboard/              # Dashboard page
│   │       │   ├── items/                  # Items management
│   │       │   ├── skills/                 # Skills management
│   │       │   ├── skilllevels/            # Skill levels
│   │       │   └── strings/                # Localization
│   │       ├── components/                 # UI components
│   │       ├── lib/                        # Utilities
│   │       ├── .env.example                # Configuration template
│   │       └── package.json                # Dependencies
│   │
│   └── shared/                             # Shared libraries (v1.0.0)
│       ├── lib/                            # API client, types
│       │   ├── api.ts                      # Unified API client
│       │   ├── types.ts                    # Shared types
│       │   └── package.json
│       └── ui/                             # Shared UI (prepared)
│           └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                          # CI/CD pipeline (NEW v1.2.0)
│
├── ARCHITECTURE_OVERVIEW.md                # System architecture (NEW v1.2.0)
├── .env.production.example                 # Production config (NEW v1.2.0)
├── pnpm-workspace.yaml                     # Workspace configuration
├── LICENSE_CUSTOM.md                       # EverVibe Studios license
└── README.md                               # This file
```

---

## 🌐 API Endpoints

### Health & Monitoring
- `GET /health` - Health check with database status
- `GET /health/ready` - Readiness probe

### Data Management
- `GET /game/items` - Items (weapons, armor, consumables)
- `GET /game/skills` - Skills (abilities, spells)
- `GET /game/skilllevels` - Skill progression data
- `GET /game/strings` - Localization strings

---

## ⚙️ Configuration

### Backend Configuration
```bash
# API
API_PORT=30089
NODE_ENV=development

# Databases (defaults provided - optional .env)
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth
# ... (game, data, post databases)
```

### Frontend Configuration
```bash
# API Connection
NEXT_PUBLIC_API_URL=http://localhost:30089

# Application
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_VERSION=1.2.0

# Optional: Debug mode
NEXT_PUBLIC_DEBUG=true
```

**Note:** Next.js uses `NEXT_PUBLIC_*` prefix for client-side environment variables.

---

## 🧪 Testing

### Backend Tests
```bash
cd tools/apps/dlc-api

# Run all tests
pnpm test

# Run with coverage
pnpm test:cov

# Run in watch mode
pnpm test:watch
```

### Build Verification
```bash
# Backend
cd tools/apps/dlc-api
pnpm build

# Frontend
cd tools/apps/dlc-web-admin
pnpm build
```

---

## 🏥 Health Monitoring

### Command Line
```bash
# Check API health
curl http://localhost:30089/health

# With formatting
curl http://localhost:30089/health | jq
```

### Web Interface
Open **Dashboard**: http://localhost:5174/dashboard

Features:
- Real-time statistics
- Health monitoring
- Quick navigation to all modules
- API connectivity status

---

## 🐛 Troubleshooting

### API won't start
```bash
# Check port availability
lsof -i :30089

# Verify database is running
cd infra/DB/game
docker compose ps

# Check logs
docker compose logs mysql
```

### Frontend can't reach API
```bash
# Verify API is running
curl http://localhost:30089/health

# Check CORS (should see logs in API terminal)
# Check environment variables match
cat tools/apps/dlc-web-admin/.env.local
```

**Note:** The frontend has been migrated to `dlc-web-admin/`

### Database connection fails
```bash
# Restart databases
cd infra/DB/game
docker compose down
docker compose up -d

# Wait for healthcheck
docker compose ps
```

**See [System Health Check Guide](./docs/SYSTEM_HEALTH_CHECK.md) for detailed troubleshooting.**

---

## 🔄 Development Workflow

### Daily Development
1. Start databases (once): `docker compose up -d`
2. Start API: `pnpm dev`
3. Start frontend: `pnpm dev`
4. Code and test
5. Check health: http://localhost:5174/health-monitor

### Making Changes
1. Edit code (hot reload enabled)
2. Check terminal for errors
3. Test in browser
4. Verify health status
5. Commit changes

### Adding Features
1. Read relevant documentation in `/docs/`
2. Implement backend first (if needed)
3. Test API endpoints
4. Implement frontend
5. Update documentation

---

## 🚢 Production Deployment

### Configuration Changes
```bash
# Backend
NODE_ENV=production
# Use production database credentials
# Set secure JWT_SECRET

# Frontend
VITE_APP_ENV=production
VITE_API_URL=https://api.yourdomain.com/api
VITE_LOG_LEVEL=error
VITE_ENABLE_DEBUG_PANEL=false
```

### Build for Production
```bash
# Backend
cd tools/apps/dlc-api
pnpm build
pnpm start:prod

# Frontend
cd tools/apps/dlc-web-admin
pnpm build
pnpm start
```

**See [Implementation Summary v1.1.0](./docs/IMPLEMENTATION_SUMMARY_V1.1.0.md) for complete deployment guide.**

---

## 📦 What's New in v0.8.5

### ✨ Features
- 🌉 Single-source API URL handling for the admin UI with automatic health endpoint derivation.
- 🚀 Vite dev server standardised on port **5174** for the HTTP bridge workflow.
- 🔐 Backend CORS tightened to an explicit origin list while maintaining credential support.

### 🐛 Fixes
- ✅ Resolved dashboard "Failed to fetch health status" errors by hardening the polling logic.
- ✅ Normalised environment defaults (no trailing slashes, HTTP protocol enforced).
- ✅ Updated health messaging and version banners to reflect v0.8.5 across the stack.

### 📖 Documentation
- New Frontend ↔ Backend Bridge Guide
- New HTTP Development Mode Overview
- Changelog v0.8.5 plus refreshed environment sync instructions

---

## 🗺️ Roadmap

### v1.2.0 (Current - Complete ✅)
- ✅ Legacy cleanup (removed dlc-dev-studios)
- ✅ Fastify-only backend (removed Express)
- ✅ RBAC implementation (User, Admin, DevOps)
- ✅ Production infrastructure (Docker Compose)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Security hardening (JWT + rate limiting)
- ✅ Version unification (all packages 1.2.0)
- ✅ Complete documentation

### v1.3.0 (Next Release - Planned)
- 🚧 Create/Edit/Delete modals with validation
- 🚧 Toast notification system
- 🚧 Inline editing for quick updates
- 🚧 Advanced form validation
- 🚧 Optimistic UI updates
- 🚧 Full authentication UI

### v1.4.0 (Future)
- ✨ User management interface
- ✨ Password reset flow
- ✨ Two-factor authentication
- ✨ Audit logging system
- ✨ Enhanced monitoring dashboard

### v2.0.0 (Vision)
- 🔐 Advanced RBAC with custom permissions
- 📊 Performance monitoring and metrics
- 🚀 Kubernetes deployment support
- 🎨 Advanced UI features and themes
- 🌐 Multi-language support

---

## 🤝 Contributing

### Before Contributing
1. Read all documentation in `/docs/`
2. Verify system health
3. Run tests
4. Follow existing code style

### Making Changes
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

---

## 📄 License

**Proprietary** - EverVibe Studios  
All rights reserved.

---

## 💬 Support

### Documentation
- [Implementation Summary v1.1.0](./docs/IMPLEMENTATION_SUMMARY_V1.1.0.md)
- [Migration Log v1.1.0](./docs/MIGRATION_LOG_V1.1.0.md)
- [System Health Check](./docs/SYSTEM_HEALTH_CHECK.md)
- [Environment Matrix](./docs/ENVIRONMENT_MATRIX.md)
- [DLC API Validation](./docs/DLC_API_VALIDATION_v0.9.5.md)

### Quick Links
- Backend README: `tools/apps/dlc-api/README.md`
- Frontend: `tools/apps/dlc-web-admin/`
- Database README: `infra/DB/README.md`

### Health Checks
- API Health: http://localhost:30089/health
- Frontend Dashboard: http://localhost:5174/dashboard
- Database Admin: http://localhost:8080

---

## 🎯 Key Achievements

✅ **Clean Monorepo Structure** - Single frontend (dlc-web-admin), legacy removed  
✅ **Pure Fastify Backend** - No Express dependencies, fully optimized  
✅ **RBAC Security** - Role-Based Access Control with hierarchy  
✅ **Production Infrastructure** - Complete Docker Compose orchestration  
✅ **CI/CD Pipeline** - Automated build, test, and deployment  
✅ **Zero Build Errors** - All packages build successfully  
✅ **Complete Documentation** - Architecture overview and deployment guides  
✅ **Version Unified** - All packages at 1.2.0  
✅ **Security Hardened** - JWT authentication, rate limiting, Helmet  
✅ **Type-Safe** - Full TypeScript coverage across all components  

**Status:** Production-ready and deployment-ready! 🚀

---

**Built with ❤️ by EverVibe Studios**  
**Version:** 1.2.0-stable | **Updated:** 2025-10-18
