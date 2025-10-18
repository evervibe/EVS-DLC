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


**Status:** Production-ready and deployment-ready! 🚀

---

**Built with ❤️ by EverVibe Studios**  
**Version:** 1.2.0-stable | **Updated:** 2025-10-18
