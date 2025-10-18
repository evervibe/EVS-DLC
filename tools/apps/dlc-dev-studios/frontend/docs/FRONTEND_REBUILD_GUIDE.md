# DLC Web Admin Frontend Rebuild – v1.0.0-alpha

The DLC Web Admin console has been rebuilt with a branded EverVibe theme, new layout primitives, and refreshed dashboard modules. This guide summarises the structural updates and how to work with the modernised stack.

## Key Upgrades

- **Frameworks**: React 19, Vite 5, TypeScript 5.7, Tailwind CSS 4.
- **UI Toolkit**: Custom `src/components/ui` collection, lucide-react icons, framer-motion animations.
- **Layout**: Sidebar navigation with gradient background, fixed command deck header, glass-panel cards.
- **Dashboard**: Health beacon with animated states, realm pulse telemetry, API-backed stat cards.
- **Theming**: EverVibe gold/dark palette, Cinzel Decorative + Inter fonts, gradient backgrounds, glassmorphism.

## Project Structure

```
src/
├── components/
│   ├── layout/ (shared layout helpers)
│   └── ui/     (Card, Button, Loader, FormModal, TableView, etc.)
├── layout/      (Dashboard shell)
├── pages/       (Dashboard, Health Monitor, Settings)
├── modules/     (Items, Skills, Skill Levels, Strings)
├── core/        (API client + env helpers)
└── styles/      (global Tailwind + theme tokens)
```

### Theme Helpers

`src/styles/index.css` defines utility classes:

- `.glass-panel` – gradient card container with glow
- `.input-field` / `.input-select` – branded inputs
- `.label-field` / `.form-hint` – consistent form labels and feedback

### UI Components

All shared UI now lives in `src/components/ui/`:

- `Card`, `Button`, `Loader`, `ErrorBox`
- `FormModal` with new glass styling
- `TableView` with charcoal rows and gold headers

Update imports to `@/components/ui/...` when creating new views.

## Running Locally

```bash
pnpm install
pnpm dev
```

The dev server runs on [http://localhost:5174](http://localhost:5174). Use `VITE_API_URL` to point to the DLC API (defaults to `http://localhost:30089`).

## Coding Notes

- Prefer `input-field`, `label-field`, and `form-hint` utilities for form controls.
- Use `HealthStatusBadge` and `ApiOfflineNotice` for consistent health messaging.
- Dashboard data is fetched through the API client with `Promise.allSettled` to tolerate degraded services.

## Deployment Checklist

1. Update `VITE_APP_VERSION` to match release tag.
2. Verify `pnpm build` completes without warnings.
3. Smoke test dashboard cards and CRUD modules against live API.
4. Commit + tag with `v1.0.0-alpha`.
