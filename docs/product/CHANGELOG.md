# Endoora Changelog

## Day 04 — Accessible component library

### Added
- More than 25 reusable visual component examples at `/design-system/components`
- Action primitives: Button variants and IconButton
- Labelled form controls plus linked ErrorSummary
- Keyboard Tabs with Arrow/Home/End behavior
- Card and semantic Badge components
- Native Dialog and Drawer with focus restoration
- Toast live region, Skeleton, ProgressBar, and StatusMessage
- Resumable Stepper with Back/Save/Cancel/refresh recovery
- Responsive DataTable with mobile cards
- AccessibleChart with textual summary and data table
- AIResultCard with evidence, confidence, limitations, retry/report/save/human-review controls
- Empty, PermissionDenied, Offline, Retry, and ProviderStatus states
- AccountNavigation and role-aware responsive RoleShell
- Day 04 automated component/accessibility static smoke check
- Component-library usage documentation and acceptance gate

### Changed
- UI/web package version moved to `0.4.0`.
- Root web layout now imports shared component styles from `@endoora/ui/components.css`.
- Day 03 token check now also guards Day 04 component styles against raw colors and physical left/right CSS properties.
- Local home now links to both token and component previews.

### Runtime/data changes
- No database migration.
- No backend API contract change.
- No authentication, payment, storage, permission, or user-data change.

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

## Day 05 — Information architecture, Account hub and critical flows

### Added

- Frozen public, learner, teacher and operations sitemap
- Role-specific primary navigation matrix
- Learner/teacher Account hub specification
- Route inventory with owner, guard, CTA, sensitivity, offline need, analytics event and deep-link contract
- Global multi-step save/back/cancel/recovery convention
- Six critical user-flow wireframes
- ADR-002 navigation decision
- Developer-only `/design-system/information-architecture` findability prototype
- Day 05 static information-architecture smoke check
- Human five-person hallway-test acceptance sheet

### Changed

- Project state, roadmap progress, test matrix, regression checklist and README now describe the Day 05 gate.
- No existing feature-map CSV is overwritten by the Day 05 package.

### Runtime/data changes

- No Django model migration.
- No backend API change.
- No authentication/payment/storage/user-data change.
- No dependency or lock-file change.
