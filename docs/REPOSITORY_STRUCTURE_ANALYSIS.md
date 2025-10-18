# EVS-DLC Repository Structure Analysis

**Date:** 2025-10-18  
**Analyzed Version:** 0.8.5  
**Target Version:** 1.0.0

---

## 📋 Executive Summary

This document provides a comprehensive analysis of the EVS-DLC repository structure, identifying all applications, tools, APIs, and infrastructure components. The analysis serves as the foundation for the full repository migration to a unified Next.js 15 + Tailwind 4 + NestJS 10 stack.

---

## 🏗️ Current Repository Structure

```
EVS-DLC/
├── .git/
├── .gitignore
├── .npmrc                              # npm registry configuration
├── .pnpmfile.cjs                       # pnpm configuration hook
├── .vscode/                            # VSCode workspace settings
├── README.md                           # Main repository documentation
├── docs/                               # Documentation directory
│   ├── API_REFERENCE_v0.8.0.md
│   ├── BACKEND_BOOT_FLOW.md
│   ├── CHANGELOG_v0.7.1.md
│   ├── CHANGELOG_v0.8.0.md
│   ├── CHANGELOG_v0.8.1.md
│   ├── CHANGELOG_v0.8.5.md
│   ├── DEV_HTTP_MODE_OVERVIEW.md
│   ├── DOCKER_VALIDATION.md
│   ├── ENV_SYNC_GUIDE.md
│   ├── FRONTEND_BACKEND_BRIDGE_GUIDE.md
│   ├── FRONTEND_ENV_SYNC_GUIDE.md
│   ├── HEALTH_ENDPOINTS.md
│   ├── INFRA_STATUS_REPORT_v0.5.1.md
│   ├── SECURITY_FIX_NOTES_v0.8.1.md
│   ├── SECURITY_OVERVIEW_v0.8.0.md
│   ├── SYSTEM_HEALTH_CHECK.md
│   └── TEST_REPORT_v0.8.1.md
├── infra/                              # Infrastructure configuration
│   └── DB/
│       └── game/
│           ├── docker-compose.yml      # MySQL database containers
│           ├── .env.example
│           └── README.md
└── tools/                              # Application workspace
    └── apps/
        ├── dlc-api/                    # NestJS Backend (Current)
        └── dlc-dev-studios/
            └── frontend/               # Vite React Frontend (To Migrate)
```

---

## 📦 Application Inventory

### 1. Backend API: `dlc-api`

**Location:** `tools/apps/dlc-api/`  
**Type:** NestJS + Fastify Backend  
**Current Version:** 0.8.5  
**Target Version:** 0.9.0

#### Technology Stack
- **Framework:** NestJS 10.4.20
- **HTTP Server:** Fastify 4.28.1
- **Language:** TypeScript 5.3.3
- **ORM:** TypeORM 0.3.27
- **Database Driver:** MySQL2 3.6.5
- **Validation:** class-validator 0.14.2, Joi 18.0.1
- **Cache:** IORedis 5.8.1 (configured but not fully integrated)

#### Port Configuration
- **API Port:** 30089
- **Environment:** Development

#### Database Connections
The API connects to 4 separate MySQL databases:
1. **db_auth** - Authentication & user management (port 3306)
2. **db_db** - Game data (port 3306)
3. **db_data** - DLC content data (port 3306)
4. **db_post** - Posts & community data (port 3306)

#### Key Dependencies
```json
{
  "@nestjs/common": "10.4.20",
  "@nestjs/config": "4.0.2",
  "@nestjs/core": "10.4.20",
  "@nestjs/platform-fastify": "10.4.20",
  "@nestjs/typeorm": "11.0.0",
  "@fastify/helmet": "11.0.0",
  "fastify": "4.28.1",
  "typeorm": "0.3.27",
  "ioredis": "5.8.1"
}
```

#### Missing Dependencies (To Add)
- `@fastify/rate-limit` - Rate limiting middleware

#### API Endpoints
- **Health:** `/health`, `/health/ready`
- **Data Management:** 
  - `/api/items` - Items (weapons, armor, consumables)
  - `/api/skills` - Skills (abilities, spells)
  - `/api/skilllevels` - Skill progression data
  - `/api/strings` - Localization strings

#### Source Structure
```
dlc-api/src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── common/                    # Common utilities & decorators
├── config/                    # Configuration modules
├── core/                      # Core business logic
├── modules/                   # Feature modules
│   ├── health/
│   ├── items/
│   ├── skills/
│   ├── skilllevels/
│   └── strings/
├── scripts/                   # Utility scripts
└── utils/                     # Helper utilities
```

---

### 2. Frontend Admin: `dlc-dev-studios/frontend`

**Location:** `tools/apps/dlc-dev-studios/frontend/`  
**Type:** Vite + React SPA  
**Current Version:** 1.0.2-alpha  
**Target Version:** 1.1.0-alpha (migrated to Next.js)  
**New Location:** `tools/apps/dlc-web-admin/`

#### Current Technology Stack (Vite-based)
- **Framework:** React 19.0.0
- **Build Tool:** Vite 6.0.5
- **Language:** TypeScript 5.7.2
- **Styling:** Tailwind CSS 4.0.0
- **State Management:** @tanstack/react-query 5.62.11
- **Routing:** react-router-dom 7.0.2
- **Forms:** react-hook-form 7.54.2
- **Animations:** framer-motion 11.15.0
- **Icons:** lucide-react 0.468.0

#### Current Port Configuration
- **Dev Server:** 5174
- **API Proxy:** http://localhost:30089

#### Build Configuration Issues
Current build has TypeScript errors:
- `keepPreviousData` option no longer exists in React Query v5
- Field type mismatches in skill level forms
- Missing type definitions for some fields

#### Source Structure
```
frontend/src/
├── App.tsx                    # Main application component
├── main.tsx                   # React entry point
├── components/                # Reusable UI components
├── core/                      # Core utilities
├── hooks/                     # Custom React hooks
├── layout/                    # Layout components
├── lib/                       # Third-party library configs
├── modules/                   # Feature modules
│   ├── items/
│   ├── skills/
│   ├── skilllevels/
│   ├── strings/
│   └── shared/
├── pages/                     # Page components
├── router/                    # React Router configuration
├── styles/                    # Global styles
└── tools/                     # Development tools
```

#### Vite Configuration
```typescript
// vite.config.ts
{
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/health': 'http://localhost:30089',
      '/ops': 'http://localhost:30089',
      '/data': 'http://localhost:30089',
      '/game': 'http://localhost:30089'
    }
  }
}
```

#### Tailwind Configuration (Current)
```typescript
// Uses Tailwind 4 with custom theme
{
  theme: {
    extend: {
      colors: { gold, bg, accent, graydark, charcoal, mist },
      fontFamily: { display, sans },
      backgroundImage: () => ({ ... }), // Uses theme() function - needs update
      boxShadow: { ... },
      borderRadius: { xl: '1.25rem' }
    }
  }
}
```

**Note:** The `backgroundImage` uses `theme()` function calls which are incompatible with Tailwind 4's new approach.

---

## 🗄️ Infrastructure Components

### Database (MySQL)

**Location:** `infra/DB/game/`  
**Type:** Docker Compose MySQL Setup  
**Version:** MySQL 8.0

#### Services
- **mysql:** Main database server (port 3306)
- **adminer:** Database admin UI (port 8080)

#### Databases
1. `db_auth` - User authentication
2. `db_db` - Game database
3. `db_data` - DLC content data
4. `db_post` - Community posts

---

## 🔧 Configuration Analysis

### Package Manager
- **Type:** pnpm
- **Version:** 9.12.3
- **Workspace:** Not currently configured (no pnpm-workspace.yaml)

### Node.js
- **Required Version:** 18+
- **TypeScript Version:** 5.3.3 (backend), 5.7.2 (frontend)

### Environment Variables

#### Backend (.env)
```bash
API_PORT=30089
NODE_ENV=development
JWT_SECRET=replace-this-before-prod

# Database connections (4 separate databases)
DB_AUTH_HOST=127.0.0.1
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASS=root
DB_AUTH_NAME=db_auth

# ... similar for DB_GAME, DB_DATA, DB_POST

# Cache (prepared for future)
USE_CACHE=false
REDIS_URL=redis://localhost:6379
CACHE_TTL=120
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:30089
VITE_APP_ENV=development
VITE_APP_VERSION=0.8.5
```

---

## 🎯 Migration Requirements

### 1. Backend Stabilization (v0.9.0)

**Required Actions:**
- ✅ Add `@fastify/rate-limit` dependency
- ✅ Verify all NestJS dependencies are on stable versions
- ✅ Ensure CORS configuration is correct
- ✅ Validate Helmet security headers
- ✅ Test all database connections
- ✅ Verify Redis health checks
- ✅ Update version to 0.9.0

**No breaking changes required** - Backend is already on NestJS 10.

### 2. Frontend Migration (Vite → Next.js 15)

**Migration Path:**
```
tools/apps/dlc-dev-studios/frontend/  →  tools/apps/dlc-web-admin/
```

**Key Changes:**
1. **Build System:** Vite 6 → Next.js 15 App Router
2. **Entry Point:** `index.html` + `main.tsx` → `app/page.tsx` + `app/layout.tsx`
3. **Routing:** React Router 7 → Next.js App Router
4. **Environment:** `VITE_*` → `NEXT_PUBLIC_*`
5. **Tailwind:** Remove `theme()` function calls, use Tailwind 4 compatible syntax
6. **Version:** 1.0.2-alpha → 1.1.0-alpha

**Assets to Preserve:**
- All components in `src/components/`
- All modules in `src/modules/`
- All page layouts and designs
- All API integration code
- All custom hooks
- All TypeScript types

### 3. Workspace Configuration

**Create:** `pnpm-workspace.yaml`
```yaml
packages:
  - 'tools/apps/*'
  - 'tools/shared/*'
```

### 4. Shared Libraries Structure

**New Directories:**
```
tools/shared/
├── lib/                       # Shared API clients, utilities, types
│   ├── api-client/
│   ├── types/
│   └── utils/
└── ui/                        # Design system components
    ├── components/
    └── styles/
```

---

## 📊 Dependency Analysis

### Backend Dependencies Health
| Package | Current | Status | Action |
|---------|---------|--------|--------|
| @nestjs/common | 10.4.20 | ✅ Stable | Keep |
| @nestjs/config | 4.0.2 | ✅ Stable | Keep |
| @fastify/helmet | 11.0.0 | ✅ Stable | Keep |
| @fastify/rate-limit | - | ❌ Missing | Add |
| fastify | 4.28.1 | ✅ Stable | Keep |
| typeorm | 0.3.27 | ✅ Stable | Keep |
| ioredis | 5.8.1 | ✅ Stable | Keep |

### Frontend Dependencies Issues
| Package | Current | Issue | Fix |
|---------|---------|-------|-----|
| @tanstack/react-query | 5.62.11 | Uses deprecated `keepPreviousData` | Update to `placeholderData` |
| vite | 6.0.5 | Migration to Next.js | Remove |
| react-router-dom | 7.0.2 | Migration to Next.js | Remove |

---

## 🚀 Migration Strategy

### Phase 1: Preparation & Analysis ✅
- [x] Scan repository structure
- [x] Identify all applications
- [x] Document current state
- [x] Identify migration requirements

### Phase 2: Backend Stabilization
- [ ] Add missing dependencies
- [ ] Fix configuration issues
- [ ] Update version to 0.9.0
- [ ] Verify all endpoints
- [ ] Test database connections

### Phase 3: Frontend Migration
- [ ] Create Next.js 15 structure
- [ ] Migrate components to App Router
- [ ] Fix Tailwind 4 configuration
- [ ] Update environment variables
- [ ] Test API integration
- [ ] Update version to 1.1.0-alpha

### Phase 4: Workspace Setup
- [ ] Create pnpm workspace
- [ ] Create shared libraries structure
- [ ] Extract common code
- [ ] Update build scripts

### Phase 5: Documentation
- [ ] Generate all required documentation
- [ ] Update README.md
- [ ] Create migration log
- [ ] Create environment matrix

### Phase 6: Testing & Validation
- [ ] Test backend build
- [ ] Test frontend build
- [ ] Test integration
- [ ] Verify all features work
- [ ] Update version to 1.0.0

---

## 📝 Notes & Observations

1. **Current State:** The repository is in good shape with comprehensive documentation.
2. **Backend:** Already on NestJS 10, minimal changes needed.
3. **Frontend:** Requires significant refactoring from Vite to Next.js.
4. **Workspace:** No workspace configuration exists - needs creation.
5. **Build Errors:** Frontend has TypeScript errors that need fixing during migration.
6. **Documentation:** Excellent existing documentation that should be preserved and enhanced.

---

## 🔗 Related Documents
- [Backend Boot Flow](./BACKEND_BOOT_FLOW.md)
- [Frontend ENV Sync Guide](./FRONTEND_ENV_SYNC_GUIDE.md)
- [Infrastructure Status Report](./INFRA_STATUS_REPORT_v0.5.1.md)
- [System Health Check](./SYSTEM_HEALTH_CHECK.md)

---

**Analysis Completed:** 2025-10-18  
**Next Step:** Begin backend stabilization (Phase 2)
