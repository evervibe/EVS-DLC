# EVS-DLC v0.8.0 – CRUD Enhancements & Admin Dashboard Refresh

## Overview
Version 0.8.0 finalises the DLC data management surface by delivering hardened CRUD APIs for the core tables and a modernised admin dashboard capable of managing items, skills, skill levels, and strings end-to-end. The release also introduces dedicated documentation for the new workflows and brings security-oriented improvements across both the NestJS backend and the React frontend.

## Backend
- Completed DTO validation for `t_item`, `t_skill`, `t_skilllevel`, and `t_string`, requiring critical fields and enforcing length/number constraints.
- Added duplicate and foreign-key safety checks to the skill level service, preventing orphaned records when creating new levels.
- Maintained consistent success/error responses via the global exception filter and helper utilities.

## Frontend
- Replaced legacy tools pages with module-based list views powered by React Query and shared UI primitives.
- Added inline editing, modal-driven create/update flows, paginated search, and delete confirmations for each data set.
- Refined skill-level filtering, improved inline action affordances, and tightened textarea styling to keep tables compact.

## Security & Validation
- All create/update payloads now pass through stricter DTO validation and sanitisation before hitting the database.
- Frontend requests are authenticated through the shared axios client and surface gentle fallbacks when tokens expire.
- Rate limiting, Helmet middleware, and the JWT guard continue to wrap all CRUD endpoints.

## Documentation
- Added `API_REFERENCE_v0.8.0.md` to summarise the public CRUD contract.
- Added `SECURITY_OVERVIEW_v0.8.0.md` to highlight the defensive posture of the stack for this release.
