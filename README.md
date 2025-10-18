# EVS-DLC - EverVibe Studios DLC Development Ecosystem

**Version:** 1.0.0 (Unified Architecture)  
**Status:** 🚧 Migration in Progress

Complete development ecosystem for DLC content management, featuring a modern NestJS backend API and Next.js frontend admin interface with unified architecture.

---

## 🎯 What's New in v1.0.0

### ✨ Major Changes
- 🔄 **Frontend Migration:** Vite → Next.js 15 (App Router)
- 🎨 **Styling:** Tailwind CSS 3.4 (stable, well-supported)
- 📦 **Workspace:** pnpm workspace monorepo
- 🔧 **Backend:** Upgraded to v0.9.0 with rate limiting
- 📚 **Documentation:** Comprehensive architecture documentation
- ⚡ **Performance:** Optimized build pipeline

### 🏗️ New Architecture
- **Backend:** NestJS 10 + Fastify 4 (v0.9.0)
- **Frontend:** Next.js 15 + React 19 (v1.1.0-alpha)
- **Workspace:** pnpm monorepo with shared libraries
- **Documentation:** Complete migration and architecture docs

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ (with pnpm 9.12.3+)
- **Docker** & Docker Compose
- **MySQL** 8.0+ (via Docker)

### Start All Services

```bash
# 1. Start MySQL databases
cd infra/DB/game
cp .env.example .env
docker compose up -d

# 2. Install all workspace dependencies
cd ../../
pnpm install

# 3. Start Backend API (in new terminal)
cd tools/apps/dlc-api
cp .env.example .env  # Optional - has defaults!
pnpm dev

# 4. Start Frontend (in new terminal) 
cd tools/apps/dlc-web-admin
cp .env.example .env.local  # Optional - has defaults!
pnpm dev

# 5. Open browser
open http://localhost:5174
```

**Health Check:** http://localhost:30089/health

---

## 📚 Documentation

Comprehensive guides available in `/docs/`:

### Architecture & Migration
- **[Repository Structure Analysis](./docs/REPOSITORY_STRUCTURE_ANALYSIS.md)** - Complete repository analysis
- **[Migration Log v1.0.0](./docs/MIGRATION_LOG_V1.0.0.md)** - Full migration documentation
- **[Environment Matrix](./docs/ENVIRONMENT_MATRIX.md)** - Environment variable reference

### Component Documentation
- **[DLC API Overview](./docs/DLC_API_OVERVIEW.md)** - Backend API documentation
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

### Backend (DLC API v0.9.0)
- **Framework:** NestJS 10.4.20 with Fastify adapter
- **Language:** TypeScript 5.3.3
- **ORM:** TypeORM 0.3.27
- **Database:** MySQL 8.0
- **Security:** @fastify/helmet 11.0.0, @fastify/rate-limit 10.3.0
- **Validation:** Joi 18.0.1 + class-validator 0.14.2
- **Location:** `tools/apps/dlc-api/`

### Frontend (DLC Web Admin v1.1.0-alpha)
- **Framework:** Next.js 15.5.6 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.4.17
- **State:** @tanstack/react-query 5.90.5
- **Forms:** react-hook-form 7.65.0
- **Location:** `tools/apps/dlc-web-admin/`

### Infrastructure
- **Database:** MySQL 8.0 (Docker)
- **Cache:** Redis 7 (prepared for future)
- **Admin UI:** Adminer 4
- **Workspace:** pnpm 9.12.3
- **Location:** `infra/DB/game/`

---

## 📁 Repository Structure

```
EVS-DLC/
├── docs/                                   # 📚 Complete documentation
│   ├── REPOSITORY_STRUCTURE_ANALYSIS.md   # Repository analysis
│   ├── MIGRATION_LOG_V1.0.0.md            # Migration tracking
│   ├── ENVIRONMENT_MATRIX.md              # Environment variables
│   ├── DLC_API_OVERVIEW.md                # Backend documentation
│   ├── DLC_WEB_ADMIN_OVERVIEW.md          # Frontend documentation
│   ├── SYSTEM_HEALTH_CHECK.md
│   ├── BACKEND_BOOT_FLOW.md
│   └── ... (legacy documentation)
│
├── infra/                                  # Infrastructure
│   └── DB/
│       └── game/                           # MySQL databases
│           ├── docker-compose.yml          # Docker setup
│           └── .env.example                # Configuration template
│
├── tools/                                  # Application workspace
│   ├── apps/
│   │   ├── dlc-api/                        # Backend API (v0.9.0)
│   │   │   ├── src/                        # Source code
│   │   │   ├── .env.example                # Configuration template
│   │   │   └── package.json                # Dependencies
│   │   │
│   │   ├── dlc-web-admin/                  # Frontend Admin (v1.1.0-alpha)
│   │   │   ├── app/                        # Next.js App Router
│   │   │   ├── lib/                        # Utilities
│   │   │   ├── .env.example                # Configuration template
│   │   │   └── package.json                # Dependencies
│   │   │
│   │   └── dlc-dev-studios/
│   │       └── frontend/                   # Legacy Vite app (deprecated)
│   │
│   └── shared/                             # Shared libraries (planned)
│       ├── lib/                            # Common utilities
│       └── ui/                             # Design system
│
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
- `GET /api/items` - Items (weapons, armor, consumables)
- `GET /api/skills` - Skills (abilities, spells)
- `GET /api/skilllevels` - Skill progression data
- `GET /api/strings` - Localization strings

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
NEXT_PUBLIC_APP_VERSION=1.1.0-alpha

# Optional: Debug mode
NEXT_PUBLIC_DEBUG=true
```

**Note:** Next.js uses `NEXT_PUBLIC_*` prefix for client-side environment variables.

---

# Application
VITE_APP_ENV=development
VITE_APP_VERSION=0.8.5
```

**Note:** Both apps work with zero configuration using sensible defaults!

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
cd tools/apps/dlc-dev-studios/frontend
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
Open **Health Monitor Dashboard**: http://localhost:5174/health-monitor

Features:
- Real-time service status
- Auto-refresh every 5 seconds
- Database connectivity
- System information

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
cd tools/apps/dlc-dev-studios/frontend
pnpm build
# Serve dist/ folder with nginx/apache
```

**See [Infrastructure Status Report](./docs/INFRA_STATUS_REPORT_v0.5.1.md) for complete deployment guide.**

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

### v1.0.0 (Current - In Progress)
- ✅ Backend v0.9.0 stable
- ✅ Next.js 15 foundation
- ✅ pnpm workspace
- ✅ Comprehensive documentation
- 🚧 Component migration
- 🚧 Full feature parity

### v1.1.0 (Next)
- ✨ Complete component migration
- ✨ Authentication system
- ✨ Redis cache integration
- ✨ Data preload system
- ✨ Enhanced health metrics

### Future Versions
- 🔐 RBAC implementation
- 🔐 JWT token validation
- 📊 Performance monitoring
- 🚀 Auto-scaling support
- 🎨 Advanced UI features

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
- [System Health Check](./docs/SYSTEM_HEALTH_CHECK.md)
- [Environment Sync](./docs/FRONTEND_ENV_SYNC_GUIDE.md)
- [Backend Boot Flow](./docs/BACKEND_BOOT_FLOW.md)
- [Infrastructure Status](./docs/INFRA_STATUS_REPORT_v0.5.1.md)

### Quick Links
- Backend README: `tools/apps/dlc-api/README.md`
- Frontend README: `tools/apps/dlc-dev-studios/frontend/docs/`
- Database README: `infra/DB/README.md`

### Health Checks
- API Health: http://localhost:30089/health
- Frontend Monitor: http://localhost:5174/health-monitor
- Database Admin: http://localhost:8080

---

## 🎯 Key Achievements

✅ **Zero-Configuration Setup** - Works out of the box  
✅ **Complete Documentation** - Comprehensive guides for all aspects  
✅ **Stable Connectivity** - All services communicate perfectly  
✅ **Health Monitoring** - Real-time system status  
✅ **Production Ready** - Fully tested and validated  
✅ **Developer Friendly** - Clear errors and helpful messages  

**Status:** Ready for active development! 🚀

---

**Built with ❤️ by EverVibe Studios**  
**Version:** 1.0.0 | **Updated:** 2025-10-18
