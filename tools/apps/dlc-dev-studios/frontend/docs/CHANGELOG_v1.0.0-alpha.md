# DLC Web Admin – v1.0.0-alpha

_Release date: 2024-12-XX_

## ✨ Highlights

- New EverVibe command deck layout with sidebar navigation and fixed header.
- Fantasy MMORPG visual theme with gold/charcoal palette and branded typography.
- Health Beacon panel with animated status chips and per-database state.
- Dashboard stat cards for Items, Skills, Skill Levels, and Strings powered by live API counts.
- Enhanced Health Monitor with diagnostics panel, animation, and retry controls.
- Settings page refreshed with cards highlighting runtime configuration.
- Consolidated UI toolkit under `src/components/ui` (Card, Button, Loader, FormModal, TableView, ErrorBox).
- New Tailwind utilities for glass panels, inputs, labels, and gold dividers.
- Updated global fonts (Cinzel Decorative + Inter) and theme imports.
- Documentation: rebuild guide, theme overview, and dedicated changelog.

## ⚙️ Technical

- Updated `tailwind.config.ts` with brand palette, gradients, glow shadows.
- Added Google Font imports in `src/styles/index.css` with base body styles.
- Dashboard data fetch uses `Promise.allSettled` for resilient API aggregation.
- Health monitor polls every 10 seconds with framer-motion feedback.
- Removed legacy `src/tools/ui/components` directory in favour of new component system.

## 🧪 QA

- `pnpm dev` verified locally.
- Manual smoke test: dashboard render, health monitor, items CRUD interactions, settings view.

## 📦 Versioning

- `package.json` bumped to `1.0.0-alpha`.
- Default environment version matches `v1.0.0-alpha`.

