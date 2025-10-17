# EVS-DLC - EverVibe Studios DLC Development Ecosystem

**Version:** 0.5.1 (Stable Multi-App Sync)  
**Status:** ✅ Production Ready for Development

Complete development ecosystem for DLC content management, featuring a NestJS backend API and React frontend admin interface.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (with pnpm 9.12.3+)
- **Docker** & Docker Compose
- **MySQL** 8.0+ (via Docker)

### Start All Services

```bash
# 1. Start MySQL databases
cd infra/DB/game
cp .env.example .env
docker compose up -d

# 2. Start Backend API (in new terminal)
cd tools/apps/dlc-api
cp .env.example .env  # Optional - has defaults!
pnpm install
pnpm dev

# 3. Start Frontend (in new terminal)
cd tools/apps/dlc-dev-studios/frontend
cp .env.example .env  # Optional - has defaults!
pnpm install
pnpm dev

# 4. Open browser
open http://localhost:5173
```

**Health Check:** http://localhost:30089/health

---

## 📚 Documentation

Comprehensive guides available in `/docs/`:

- **[System Health Check Guide](./docs/SYSTEM_HEALTH_CHECK.md)** - Complete health monitoring system
- **[Frontend ENV Sync Guide](./docs/FRONTEND_ENV_SYNC_GUIDE.md)** - Environment variable synchronization
- **[Backend Boot Flow](./docs/BACKEND_BOOT_FLOW.md)** - Bootstrap process documentation
- **[Infrastructure Status Report](./docs/INFRA_STATUS_REPORT_v0.5.1.md)** - Complete system overview

---

## 🏗️ Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   DLC Web Admin  │◄───────►│     DLC API      │◄───────►│  MySQL Databases │
│   (Frontend)     │  HTTP   │    (Backend)     │   TCP   │   (Docker)       │
│                  │         │                  │         │                  │
│   React 19       │         │   NestJS 10      │         │   - db_auth      │
│   Vite 6         │         │   Fastify 4      │         │   - db_db        │
│   TypeScript 5   │         │   TypeORM 0.3    │         │   - db_data      │
│   Port: 5173     │         │   Port: 30089    │         │   - db_post      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

---

## 🔧 Technology Stack

### Backend (DLC API)
- **Framework:** NestJS 10.3 with Fastify adapter
- **Language:** TypeScript 5.3
- **ORM:** TypeORM 0.3.27
- **Database:** MySQL 8.0
- **Validation:** Joi + class-validator
- **Location:** `tools/apps/dlc-api/`

### Frontend (DLC Web Admin)
- **Framework:** React 19.0
- **Build Tool:** Vite 6.0
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 4.0
- **State:** TanStack Query 5.62
- **Router:** React Router 7.0
- **Location:** `tools/apps/dlc-dev-studios/frontend/`

### Infrastructure
- **Database:** MySQL 8.0 (Docker)
- **Cache:** Redis 7 (prepared for v0.6.0)
- **Admin UI:** Adminer 4
- **Location:** `infra/DB/game/`

---

## 📁 Repository Structure

```
EVS-DLC/
├── docs/                              # 📚 Complete documentation
│   ├── SYSTEM_HEALTH_CHECK.md
│   ├── FRONTEND_ENV_SYNC_GUIDE.md
│   ├── BACKEND_BOOT_FLOW.md
│   └── INFRA_STATUS_REPORT_v0.5.1.md
│
├── infra/                             # Infrastructure
│   └── DB/
│       └── game/                      # MySQL databases
│           ├── docker-compose.yml     # Docker setup
│           └── .env.example           # Configuration template
│
└── tools/apps/                        # Applications
    ├── dlc-api/                       # Backend API
    │   ├── src/                       # Source code
    │   ├── .env.example               # Configuration template
    │   └── package.json               # Dependencies
    │
    └── dlc-dev-studios/
        └── frontend/                  # Frontend Web Admin
            ├── src/                   # Source code
            ├── .env.example           # Configuration template
            └── package.json           # Dependencies
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
VITE_API_URL=http://localhost:30089/api
VITE_API_HEALTH_URL=http://localhost:30089/health

# Application
VITE_APP_ENV=development
VITE_APP_VERSION=0.5.1
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
Open **Health Monitor Dashboard**: http://localhost:5173/health-monitor

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
cat tools/apps/dlc-dev-studios/frontend/.env.example
```

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
5. Check health: http://localhost:5173/health-monitor

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

## 📦 What's New in v0.5.1

### ✨ Features
- 🔧 Standardized API port to 30089
- 🔄 Complete frontend-backend synchronization
- 📚 Comprehensive documentation suite
- ⚙️ Redis service prepared (v0.6.0)
- 🔍 Enhanced logging and monitoring

### 🐛 Fixes
- ✅ CORS configuration verified
- ✅ Health endpoint path confirmed
- ✅ Environment variable alignment
- ✅ Build process validation

### 📖 Documentation
- System Health Check Guide
- Frontend ENV Sync Guide
- Backend Boot Flow
- Infrastructure Status Report

---

## 🗺️ Roadmap

### v0.6.0 (Next)
- ✨ Redis cache integration
- ✨ Data preload system
- ✨ Enhanced health metrics
- ✨ Cache warming strategies

### Future Versions
- 🔐 Authentication system
- 🔐 RBAC implementation
- 🔐 JWT token validation
- 📊 Performance monitoring
- 🚀 Auto-scaling support

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
- Frontend Monitor: http://localhost:5173/health-monitor
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
**Version:** 0.5.1 | **Updated:** 2025-10-17
