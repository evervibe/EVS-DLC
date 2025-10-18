# EverVibe Command Deck Theme

The v1.0.0-alpha release introduces a bespoke fantasy MMORPG admin aesthetic. Use this document to understand the palette, typography, and motion guidance.

## Palette

| Token  | Hex       | Usage                                               |
|--------|-----------|-----------------------------------------------------|
| `gold` | `#d4af37` | Primary accents, badges, call-to-action gradients   |
| `bg`   | `#0a0a0a` | Page background, deep space gradient base           |
| `charcoal` | `#1a1a1a` | Panels, table rows, sidebar shell                |
| `accent` | `#6f42c1` | Secondary highlights, sidebar chips                |
| `mist` | `#1f1b2e` | Gradient mid-tones and shadows                      |
| `emerald` (Tailwind) | builtin | Health success states                     |
| `rose` (Tailwind)    | builtin | Error and destructive states              |

### Gradients

- `bg-brand-gradient`: layered radial gold + violet highlights with a dark base.
- `bg-card-gradient`: glass-panel gradient for cards and modals.

## Typography

- **Display**: `Cinzel Decorative` for headers, nav labels, branded badges.
- **Body**: `Inter` for content, tables, form labels.
- Base styles applied in `src/styles/index.css` with `.font-display` utility.

## Components

| Component | Style Notes |
|-----------|-------------|
| Card | Uses `.glass-panel`, accent pill header, subtle motion on mount. |
| Button | Gradient primary, charcoal secondary, ghost outlined, danger gradient. |
| TableView | Charcoal rows, gold headers, hover transitions. |
| FormModal | Glass modal with gold border, command deck typography. |
| Health Badge | Animated status pill with emerald/rose variants. |

## Motion & Feedback

- Use `framer-motion` for fade/slide entrances on dashboard cards and modals.
- Health status pulses via animated backgrounds.
- Loading states use gold spinning rings with optional label.

## Utility Classes

- `.input-field` / `.input-select`: brand-ready form controls.
- `.label-field`: uppercase, tracking wide label style.
- `.form-hint`: used for inline validation errors.
- `.gold-divider`: horizontal separators under brand titles.

## Imagery

No raster assets required; gradients and typography provide the fantasy vibe.

## Accessibility

- Color combinations maintain 4.5:1 contrast on primary surfaces.
- Focus rings use gold with offset backgrounds for clarity.
- Buttons maintain uppercase text for consistency but ensure aria-labels for icon buttons.
