# DLC Web Admin - Frontend

A production-ready React/Vite frontend application for managing DLC API data.

## Version

**0.8.5** - HTTP Dev Bridge Patch

## Features

- 🚀 **Modern Stack**: Vite + React 19 + TypeScript
- 🎨 **Tailwind CSS v4**: Custom theme with responsive design
- 🔄 **React Router v7**: Client-side routing
- 📊 **TanStack Query**: Server state management
- 🔌 **API Integration**: Full CRUD operations for all data tables
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎯 **Type-Safe**: Complete TypeScript coverage
- 🧩 **Modular**: Clean architecture mirroring backend structure
- ⚙️ **NEW: Comprehensive .env Configuration System**
- 🏥 **NEW: Real-time Health Monitoring**
- 🛠️ **NEW: Developer Tools Infrastructure**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 19 (TypeScript) |
| Routing | React Router v7 |
| API Client | Axios |
| State / Data | @tanstack/react-query |
| Forms | react-hook-form |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Animation | framer-motion |
| Build Tool | pnpm + Vite |

## Prerequisites

- Node.js 20+ or 22+
- pnpm 9.12+ (or npm/yarn)
- DLC API backend running (see `tools/apps/dlc-api`)

## Installation

1. Navigate to the frontend directory:
```bash
cd tools/apps/dlc-dev-studios/frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
VITE_APP_ENV=development
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.8.5

VITE_API_URL=http://localhost:30089
# Optional overrides if your backend uses custom paths
# VITE_API_HEALTH_URL=http://localhost:30089/health
# VITE_REDIS_HEALTH_URL=http://localhost:30089/ops/redis
# VITE_DB_HEALTH_URL=http://localhost:30089/ops/db
VITE_API_TIMEOUT=8000
VITE_DATA_CACHE=true

VITE_ENABLE_DEBUG_PANEL=true
VITE_LOG_LEVEL=debug
```

**📚 For detailed environment setup instructions, see [docs/FRONTEND_ENV_SETUP.md](docs/FRONTEND_ENV_SETUP.md)**

## Development

Start the development server:
```bash
pnpm dev
```

The application will open at `http://localhost:5174`

## Build

Build for production:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Root component
│   ├── core/                 # Core infrastructure (NEW)
│   │   ├── config/          # Environment configuration
│   │   ├── api/             # API client and utilities
│   │   ├── store/           # State management (prepared)
│   │   └── utils/           # Utility functions (prepared)
│   ├── router/              # Route definitions
│   ├── layout/              # Layout components
│   ├── pages/               # Page components
│   ├── components/          # Organized components (NEW)
│   │   ├── ui/             # UI components
│   │   ├── layout/         # Layout components
│   │   └── feedback/       # Feedback components
│   ├── modules/             # Feature modules (NEW)
│   │   ├── items/          # Items module
│   │   ├── skills/         # Skills module
│   │   ├── strings/        # Strings module
│   │   └── game/           # Game module
│   ├── tools/               # Modular features
│   │   ├── data/           # Data management (items, skills, etc.)
│   │   ├── search/         # Global search (placeholder)
│   │   ├── compare/        # Data comparison (placeholder)
│   │   ├── export/         # Data export (placeholder)
│   │   ├── import/         # Data import (placeholder)
│   │   ├── auth/           # Authentication (placeholder)
│   │   └── ui/             # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── styles/              # Global styles
├── docs/                    # Documentation
│   ├── FRONTEND_ENV_SETUP.md       # Environment setup guide (NEW)
│   ├── ROADMAP_v0.4.0.md          # v0.4.0 roadmap (NEW)
│   ├── CHANGELOG.md                # Version history
│   ├── FRONTEND_STRUCTURE_OVERVIEW.md
│   └── API_BINDINGS.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Available Routes

- `/` - Dashboard with API health status
- `/health` - **NEW: Real-time Health Monitor**
- `/items` - Items management (t_item)
- `/skills` - Skills management (t_skill)
- `/skilllevels` - Skill levels management (t_skilllevel)
- `/strings` - Strings/localization management (t_string)
- `/settings` - Application settings

## Features

### Dashboard
- API health status check
- Quick stats overview
- Navigation to all modules
- Environment information display

### Health Monitor (Refined in v0.8.5)
- Real-time monitoring of:
  - API Server status
  - Redis Cache status
  - Database status
- Auto-refresh every 5 seconds
- Visual status indicators
- System information panel
- Environment configuration display

### Data Management
Each data module (Items, Skills, Skill Levels, Strings) provides:
- **List View**: Table with all records
- **Create**: Modal form to add new records
- **Edit**: Modal form to update existing records
- **Delete**: Confirmation dialog to remove records

### Components
Reusable UI components available in `src/tools/ui/components/`:
- `TableView` - Generic data table
- `FormModal` - Modal for forms
- `Button` - Customizable button
- `Card` - Content container
- `Loader` - Loading spinner
- `ErrorBox` - Error display
- `NavBar` - Navigation bar

### Developer Tools (Infrastructure Ready)
Placeholder tools prepared for v0.4.0:
- **Search** - Global dataset search with keyboard shortcuts
- **Compare** - Visual dataset comparison
- **Export** - Export data as JSON/CSV
- **Import** - Import JSON data (dev mode only)

## API Integration

The frontend connects to the DLC API backend via Axios.

**Configuration:**
- Base URL: Configured via `VITE_API_URL` in `.env`
- Timeout: Configured via `VITE_API_TIMEOUT` in `.env`
- All API calls use the centralized client at `src/core/api/apiClient.ts`

See `docs/API_BINDINGS.md` for complete API documentation.

## Environment Configuration

v0.8.5 introduces a simplified HTTP bridge configuration:

**Core Configuration:**
- `ENV.APP_ENV` - Application environment
- `ENV.APP_NAME` - Application name
- `ENV.APP_VERSION` - Application version

**API Configuration:**
- `ENV.API_URL` - Base API URL
- `ENV.API_TIMEOUT` - Request timeout
- `ENV.API_HEALTH_URL` - Health check endpoint
- `ENV.REDIS_HEALTH_URL` - Redis health endpoint
- `ENV.DB_HEALTH_URL` - Database health endpoint

**Feature Flags:**
- `ENV.DATA_CACHE` - Enable data caching
- `ENV.ENABLE_DEBUG_PANEL` - Enable debug panel
- `ENV.LOG_LEVEL` - Logging level

**Usage in code:**
```typescript
import { ENV } from '@/core/config/env';

console.log(ENV.API_URL);      // Access configuration
console.log(ENV.APP_VERSION);  // Type-safe access
```

📚 **Complete guide:** [docs/FRONTEND_ENV_SETUP.md](docs/FRONTEND_ENV_SETUP.md)

## Styling

The application uses Tailwind CSS with a custom theme:
- **Primary Color**: Gold (`#eab308`)
- **Secondary Color**: Dark (`#0f172a`)

Modify theme in `tailwind.config.ts`.

## Documentation

- **[docs/FRONTEND_ENV_SETUP.md](docs/FRONTEND_ENV_SETUP.md)** - Environment configuration guide (NEW)
- **[docs/ROADMAP_v0.4.0.md](docs/ROADMAP_v0.4.0.md)** - v0.4.0 roadmap (Auth & RBAC) (NEW)
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history
- **[docs/FRONTEND_STRUCTURE_OVERVIEW.md](docs/FRONTEND_STRUCTURE_OVERVIEW.md)** - Architecture and module organization
- **[docs/API_BINDINGS.md](docs/API_BINDINGS.md)** - API endpoint documentation

## Deployment Options

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Static Hosting
The `dist/` folder after `pnpm build` can be deployed to any static hosting service:
- Netlify
- Render
- AWS S3 + CloudFront
- GitHub Pages

## Linting

Lint the code:
```bash
pnpm lint
```

## Environment Variables

See [docs/FRONTEND_ENV_SETUP.md](docs/FRONTEND_ENV_SETUP.md) for complete documentation.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_ENV` | Application environment | - |
| `VITE_APP_NAME` | Application name | `DLC Web Admin` |
| `VITE_APP_VERSION` | Application version | `0.8.5` |
| `VITE_API_URL` | Backend API URL | - |
| `VITE_API_TIMEOUT` | API timeout (ms) | `8000` |
| `VITE_API_HEALTH_URL` | API health endpoint | - |
| `VITE_REDIS_HEALTH_URL` | Redis health endpoint | - |
| `VITE_DB_HEALTH_URL` | Database health endpoint | - |
| `VITE_DATA_CACHE` | Enable caching | `false` |
| `VITE_ENABLE_DEBUG_PANEL` | Enable debug panel | `false` |
| `VITE_LOG_LEVEL` | Logging level | `info` |

## What's New in v0.8.5

✨ **Major Updates:**
- Single `VITE_API_URL` source with automatic health endpoint derivation
- HTTP-only bridge aligned with DLC API CORS policy
- Vite dev server standardised on port 5174
- Health monitor resiliency improvements (Promise.allSettled)

🔧 **Infrastructure:**
- Normalised environment defaults with trailing slash trimming
- Updated settings panel defaults for v0.8.5
- Hardened health polling against optional service outages
- Preconfigured proxy for `/health` and `/ops/*` endpoints

📝 **Documentation:**
- Updated environment setup guide for HTTP mode
- Added bridge and dev HTTP overview references
- Refreshed configuration tables with new defaults

## Roadmap

**Current:** v0.8.5 - HTTP Dev Bridge & Health Monitoring Refinements
**Next:** v0.4.0 - Authentication & RBAC

See [docs/ROADMAP_v0.4.0.md](docs/ROADMAP_v0.4.0.md) for detailed plans.

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure code compiles without errors
4. Test all routes and functionality
5. Submit a pull request

## License

UNLICENSED - EverVibe Studios

## Version History

See `docs/CHANGELOG.md` for version history and changes.

## Support

For issues or questions, contact the development team.

---

**Built with ❤️ by EverVibe Studios**
