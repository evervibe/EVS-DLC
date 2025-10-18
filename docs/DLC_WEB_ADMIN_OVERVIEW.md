# DLC Web Admin Overview

**Version:** 1.1.0-alpha  
**Framework:** Next.js 15 + React 19  
**Status:** 🚧 In Development (Migration in Progress)

---

## 📋 Summary

The DLC Web Admin is a modern web-based administration interface for managing DLC (Downloadable Content) data in the EverVibe Studios gaming ecosystem. Built with Next.js 15 and React 19, it provides a responsive, type-safe UI for managing items, skills, skill levels, and localization strings.

---

## 🏗️ Architecture

### Technology Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.4.17
- **State Management:** @tanstack/react-query 5.90.5
- **HTTP Client:** Axios 1.12.2
- **Forms:** react-hook-form 7.65.0
- **Animations:** framer-motion 11.18.2
- **Icons:** lucide-react 0.468.0

### Core Dependencies

```json
{
  "next": "^15.1.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@tanstack/react-query": "^5.62.11",
  "axios": "^1.7.9",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^11.15.0",
  "react-hook-form": "^7.54.2"
}
```

---

## 🎨 Design System

### Color Palette

```typescript
colors: {
  gold: '#d4af37',        // Brand gold
  bg: '#0a0a0a',          // Background
  accent: '#6f42c1',      // Accent purple
  graydark: '#1a1a1a',    // Dark gray
  charcoal: '#1a1a1a',    // Charcoal
  mist: '#1f1b2e',        // Mist purple
}
```

### Typography

- **Display Font:** Cinzel Decorative (serif)
- **Body Font:** Inter (sans-serif)

### Custom Gradients

```typescript
backgroundImage: {
  'brand-gradient': 'linear-gradient(135deg, #d4af37 0%, #6f42c1 100%)',
  'card-gradient': 'linear-gradient(145deg, rgba(31, 27, 46, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
}
```

### Shadows & Effects

```typescript
boxShadow: {
  'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
  'inner-ring': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
}
```

---

## 📦 Project Structure

```
dlc-web-admin/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   ├── providers.tsx              # React Query provider
│   └── globals.css                # Global styles
│
├── lib/                           # Utility libraries
│   └── config.ts                  # API configuration
│
├── components/                    # (To be migrated)
│   ├── ui/                       # UI components
│   ├── forms/                    # Form components
│   └── layouts/                  # Layout components
│
├── modules/                       # (To be migrated)
│   ├── items/                    # Items management
│   ├── skills/                   # Skills management
│   ├── skilllevels/              # Skill levels
│   └── strings/                  # Localization strings
│
├── public/                        # Static assets
├── .env.local                     # Environment variables
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:30089

# Application Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_VERSION=1.1.0-alpha

# Optional: Debug mode
NEXT_PUBLIC_DEBUG=true
```

### API Endpoints

All API endpoints are centrally configured in `lib/config.ts`:

```typescript
export const API_BASE = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';

export const API_ENDPOINTS = {
  health: `${API_BASE}/health`,
  items: `${API_BASE}/api/items`,
  skills: `${API_BASE}/api/skills`,
  skilllevels: `${API_BASE}/api/skilllevels`,
  strings: `${API_BASE}/api/strings`,
} as const;
```

---

## 🚀 Development

### Installation

```bash
cd tools/apps/dlc-web-admin
pnpm install
```

### Running Locally

```bash
# Development mode (hot reload on port 5174)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Building for Production

```bash
# Create optimized production build
pnpm build

# Output will be in .next/ directory
# Static exports in .next/standalone/
```

---

## 🔄 Migration Status

### ✅ Completed

- [x] Next.js 15 project structure
- [x] Tailwind CSS 3 configuration
- [x] TypeScript setup
- [x] React Query provider
- [x] API configuration module
- [x] Environment variable setup
- [x] Build system verification

### 🚧 In Progress

- [ ] Component migration from Vite app
- [ ] Page routing setup
- [ ] Module migration (items, skills, etc.)
- [ ] API integration testing
- [ ] Form handling migration
- [ ] State management setup

### 📋 Pending

- [ ] Authentication system
- [ ] User management
- [ ] Permission system
- [ ] Advanced data visualization
- [ ] Export/Import functionality
- [ ] Batch operations

---

## 🎯 Features (Planned)

### Data Management

#### Items Management
- Browse, search, and filter items
- Create, edit, and delete items
- Bulk operations
- Item types: weapons, armor, consumables
- Real-time validation

#### Skills Management
- Browse and manage skills
- Skill level configuration
- Job class filtering
- Skill type categorization

#### Skill Levels
- Progression data management
- Resource requirements (HP, MP, GP)
- Level-based unlocks
- Skill tree visualization (future)

#### Localization Strings
- Multi-language support
- String category management
- Search and filter
- Bulk translation tools (future)

---

## 🔌 API Integration

### React Query Setup

All data fetching uses React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

Example usage:

```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/config';

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data } = await axios.get(API_ENDPOINTS.items);
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
```

---

## 🎨 UI Components (To be Migrated)

### Planned Component Library

- **Buttons:** Primary, secondary, danger, ghost
- **Forms:** Input, select, checkbox, radio, textarea
- **Cards:** Data cards, stat cards, info panels
- **Modals:** Edit modal, delete confirmation, info dialog
- **Tables:** Sortable, filterable, paginated data tables
- **Navigation:** Sidebar, breadcrumbs, tabs
- **Feedback:** Loading spinners, error messages, success toasts
- **Layout:** Grid system, containers, spacing utilities

---

## 🔒 Security Features

### Current

- Environment variable protection
- TypeScript type safety
- CORS-aware API calls
- Secure API endpoint configuration

### Planned

- JWT token authentication
- Role-based access control
- Session management
- XSS protection
- CSRF tokens
- Input sanitization

---

## 📊 Performance

### Optimizations

- Next.js App Router with automatic code splitting
- React Server Components (where applicable)
- Image optimization (Next.js Image component)
- Font optimization
- CSS optimization (Tailwind CSS purging)
- Bundle size monitoring

### Metrics (Target)

- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: > 90
- Bundle Size: < 150KB (gzipped)

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### Development Server Issues

```bash
# Check port availability (default: 5174)
lsof -i :5174

# Kill process if needed
kill -9 <PID>

# Restart dev server
pnpm dev
```

### API Connection Issues

1. **Verify API is running:**
   ```bash
   curl http://localhost:30089/health
   ```

2. **Check environment variables:**
   ```bash
   cat .env.local
   ```

3. **Verify CORS settings** on the backend

---

## 📈 Roadmap

### v1.1.0-alpha (Current)
- ✅ Next.js 15 foundation
- 🚧 Component migration
- 🚧 Page routing setup
- 🚧 API integration

### v1.2.0-alpha (Next)
- Full feature parity with Vite app
- All modules migrated
- Complete UI polish
- Comprehensive testing

### v1.0.0-stable (Future)
- Authentication system
- User management
- Advanced features
- Production deployment
- Performance optimization

---

## 🔗 Integration

### Backend API

**Endpoint:** `http://localhost:30089`  
**Documentation:** [DLC API Overview](./DLC_API_OVERVIEW.md)

### Communication

- REST API via Axios
- JSON data format
- React Query for state management
- Automatic retry on failure
- Error boundary handling

---

## 📚 Related Documentation

- [Repository Structure Analysis](./REPOSITORY_STRUCTURE_ANALYSIS.md)
- [DLC API Overview](./DLC_API_OVERVIEW.md)
- [Migration Log](./MIGRATION_LOG_V1.0.0.md)
- [Environment Matrix](./ENVIRONMENT_MATRIX.md)

---

## 🎓 Learning Resources

### Next.js 15
- [Official Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### React 19
- [React Docs](https://react.dev/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Utility-First CSS](https://tailwindcss.com/docs/utility-first)

---

**Last Updated:** 2025-10-18  
**Version:** 1.1.0-alpha  
**Status:** 🚧 In Development
