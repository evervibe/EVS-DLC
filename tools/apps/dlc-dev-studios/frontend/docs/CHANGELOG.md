# Changelog

All notable changes to the DLC Web Admin frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0+env] - 2025-10-17

### Added
- **Comprehensive Environment Configuration System**
  - Centralized ENV configuration in `/src/core/config/env.ts`
  - Complete .env.example with all required variables
  - Support for multiple environments (development, production, staging)
  - Type-safe environment variable access

- **Core Infrastructure**
  - New `/src/core` directory structure:
    - `/src/core/config` - Configuration modules
    - `/src/core/api` - API client and utilities
    - `/src/core/store` - State management (prepared for future)
    - `/src/core/utils` - Utility functions (prepared for future)
  
- **Enhanced API Client**
  - Moved to `/src/core/api/apiClient.ts`
  - Configurable timeout from environment
  - Improved error handling and logging
  - Automatic base URL configuration

- **Health Monitoring System**
  - Real-time health check functionality (`/src/core/api/health.ts`)
  - Health Monitor page (`/src/pages/HealthMonitor.tsx`)
  - Multi-service monitoring (API, Redis, Database)
  - Auto-refresh every 5 seconds
  - Visual status indicators
  - System information display

- **Developer Tools Infrastructure**
  - Placeholder tools for future implementation:
    - `/src/tools/search` - Global dataset search
    - `/src/tools/compare` - Dataset comparison
    - `/src/tools/export` - Data export (JSON/CSV)
    - `/src/tools/import` - Data import (dev mode)

- **Component Organization**
  - New component directories:
    - `/src/components/ui` - UI components
    - `/src/components/layout` - Layout components
    - `/src/components/feedback` - Feedback components
  - New module directories:
    - `/src/modules/items` - Items module (prepared)
    - `/src/modules/skills` - Skills module (prepared)
    - `/src/modules/strings` - Strings module (prepared)
    - `/src/modules/game` - Game module (prepared)

- **Documentation**
  - `FRONTEND_ENV_SETUP.md` - Comprehensive environment setup guide
  - `ROADMAP_v0.4.0.md` - Detailed roadmap for Auth & RBAC features
  - Updated version information across the application

- **UI Enhancements**
  - Health Monitor link in navigation bar
  - ENV-based app name and version display
  - Improved system information display

### Changed
- **Version**: Updated from `0.0.1-alpha` to `0.3.0+env`
- **API Client**: All imports updated from `@/api/client` to `@/core/api/apiClient`
- **Environment Access**: Replaced direct `import.meta.env` usage with `ENV` object
- **Dashboard**: Now uses ENV configuration for display
- **Navigation**: Updated to use ENV for app name and version

### Environment Variables
New environment variables introduced:
- `VITE_APP_ENV` - Application environment
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_API_URL` - Base API URL
- `VITE_API_TIMEOUT` - API request timeout
- `VITE_API_HEALTH_URL` - API health endpoint
- `VITE_REDIS_HEALTH_URL` - Redis health endpoint
- `VITE_DB_HEALTH_URL` - Database health endpoint
- `VITE_DATA_CACHE` - Enable/disable data caching
- `VITE_ENABLE_DEBUG_PANEL` - Enable/disable debug panel
- `VITE_LOG_LEVEL` - Logging level

### Technical Details
- Fully backward compatible with existing functionality
- Zero-auth development mode maintained
- No breaking changes to existing components
- Build successful with no TypeScript errors
- All existing routes remain functional

### Next Steps
- v0.4.0 will focus on Authentication & RBAC (see ROADMAP_v0.4.0.md)

---

## [0.0.1-alpha] - 2025-10-17

### Added
- Initial frontend setup with Vite + React 19 + TypeScript
- Modular directory structure matching backend architecture
- API client with Axios and request/response interceptors
- React Router v7 integration for client-side routing
- TanStack Query for server state management
- Tailwind CSS v4 for styling with custom theme (gold primary, dark secondary)
- Dashboard page with API health status check
- Complete CRUD interfaces for:
  - Items (t_item)
  - Skills (t_skill)
  - Skill Levels (t_skilllevel)
  - Strings (t_string)
- Reusable UI components:
  - TableView - Generic data table with pagination
  - FormModal - Modal dialog for create/edit forms
  - Button - Customizable button with variants
  - Card - Container component
  - Loader - Loading spinner
  - ErrorBox - Error message display
  - NavBar - Navigation bar with routing
- Settings page with environment configuration overview
- Comprehensive documentation:
  - FRONTEND_STRUCTURE_OVERVIEW.md - Architecture and module organization
  - API_BINDINGS.md - Complete API endpoint documentation
  - README.md - Setup and development instructions
- Environment variable configuration (.env.example)
- Version display in UI (navbar and footer)
- TypeScript type definitions for all data models
- React Hook Form integration for form handling
- Lucide React icons for UI elements
- Responsive design for desktop and mobile

### Technical Details
- Package manager: pnpm 9.12.3
- Node version compatibility: 20+
- Build tool: Vite 6.0
- React version: 19.0
- TypeScript version: 5.7
- No build errors or TypeScript warnings
- All routes functional and accessible
- Connected to DLC API backend (v0.3.0)

### Future Enhancements (Planned for Next Versions)
- v0.1.0: Authentication (Login, JWT integration)
- v0.2.0: Advanced table filters and search
- v0.3.0: Dashboard metrics and user roles
- v0.4.0: Design refinement and release candidate
