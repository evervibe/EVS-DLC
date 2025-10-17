# DLC Web Admin - Frontend

A production-ready React/Vite frontend application for managing DLC API data.

## Version

**0.0.1-alpha** - Initial Frontend Release

## Features

- 🚀 **Modern Stack**: Vite + React 19 + TypeScript
- 🎨 **Tailwind CSS v4**: Custom theme with responsive design
- 🔄 **React Router v7**: Client-side routing
- 📊 **TanStack Query**: Server state management
- 🔌 **API Integration**: Full CRUD operations for all data tables
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎯 **Type-Safe**: Complete TypeScript coverage
- 🧩 **Modular**: Clean architecture mirroring backend structure

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

4. Edit `.env` file with your API URL:
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=DLC Web Admin
VITE_APP_VERSION=0.0.1-alpha
```

## Development

Start the development server:
```bash
pnpm dev
```

The application will open at `http://localhost:5173`

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
│   ├── router/               # Route definitions
│   ├── layout/               # Layout components
│   ├── pages/                # Page components
│   ├── tools/                # Modular features
│   │   ├── data/            # Data management (items, skills, etc.)
│   │   ├── auth/            # Authentication (placeholder)
│   │   └── ui/              # Shared UI components
│   ├── api/                  # API client
│   ├── lib/                  # Utility functions
│   └── styles/               # Global styles
├── docs/                     # Documentation
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Available Routes

- `/` - Dashboard with API health status
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

## API Integration

The frontend connects to the DLC API backend via Axios.

**Base URL:** Configured in `.env` as `VITE_API_URL`

See `docs/API_BINDINGS.md` for complete API documentation.

## Styling

The application uses Tailwind CSS with a custom theme:
- **Primary Color**: Gold (`#eab308`)
- **Secondary Color**: Dark (`#0f172a`)

Modify theme in `tailwind.config.ts`.

## Documentation

- `docs/FRONTEND_STRUCTURE_OVERVIEW.md` - Architecture and module organization
- `docs/API_BINDINGS.md` - API endpoint documentation
- `docs/CHANGELOG.md` - Version history

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

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `VITE_APP_NAME` | Application name | `DLC Web Admin` |
| `VITE_APP_VERSION` | Application version | `0.0.1-alpha` |

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
