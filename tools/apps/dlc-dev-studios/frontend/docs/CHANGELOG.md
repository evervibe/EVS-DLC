# Changelog

All notable changes to the DLC Web Admin frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
