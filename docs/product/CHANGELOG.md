# Endoora Changelog

## Day 03 — Bilingual design-token and brand system

### Added
- Centralized light/dark CSS variables in `packages/ui/src/tokens.css`
- Typed UI token exports and theme/direction types in `packages/ui/src/theme.ts`
- Bilingual Endoora wordmark treatment using shared token classes
- Vazirmatn + Inter `next/font` integration with Persian/Latin fallbacks
- `/design-system` visual token gallery
- RTL/LTR isolation helpers for English, IPA, URL, email, and numeric learning content
- Spacing, radius, elevation, focus, motion, reduced-motion, and responsive typography tokens
- Accessible semantic status background/text pairs
- Automated design-token smoke test and CI hook
- Secret-scanner placeholder regression fix plus five Python regression tests
- Day 03 design-system documentation and acceptance gate

### Changed
- Root web layout is Persian-first RTL while the developer-only Day 02 health page remains explicitly English LTR.
- Global CSS now consumes design tokens and logical CSS properties instead of raw page colors and `padding-left`.
- Frontend/UI package version moved to `0.3.0`.
- Day 01 project-memory documents were synchronized with the actual Day 02/Day 03 repository state.

### Runtime/data changes
- No database migration.
- No API contract change.
- No payment, authentication, storage, or user-data change.

## Day 02 — Reproducible local environment

### Added
- Next.js App Router web workspace
- Django + DRF API workspace
- Shared UI and contracts workspaces
- PostgreSQL/Redis Docker Compose services
- Health/liveness endpoints and understandable frontend API-unavailable state
- Development/test/staging/production settings skeletons
- Environment template and secret scanning
- GitHub CI for frontend/backend checks
- Local development/acceptance documentation

### Git checkpoint
- `d208eb4` — `Day 02: Create the Endoora monorepo and reproducible local environment`

## Day 01 — Foundation

### Added
- Endoora product constitution
- Naming standard
- Domain/environment map
- Feature registry and feature/route/data map
- Launch cut line
- Baseline backlog
- Risk register
- ADR-001 scope decision
- Project-memory baseline
- Architecture/data/API baseline documents
- Security/privacy baseline documents
- AI governance baseline documents
- Operations/runbook baseline documents

### Runtime changes
None. Application code begins Day 02.

### Data changes
None. No Endoora domain data existed yet.
