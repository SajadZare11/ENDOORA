# Endoora Project State

## Current checkpoint

- **Roadmap day implemented:** Day 03 — bilingual design-token and brand system
- **Day 03 acceptance status:** Implementation and static checks complete in the generated package; founder local runtime/mobile/dark-mode verification and Git checkpoint still required
- **Schema version:** Django built-in schema only; no Endoora domain migration was added on Day 03
- **Frontend version:** `0.3.0`
- **UI package version:** `0.3.0`
- **Backend:** Day 02 Django/DRF scaffold unchanged
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran

## Features working

- Next.js local Endoora landing page and Django health integration from Day 02
- Centralized bilingual design tokens in `@endoora/ui`
- Light and dark semantic themes
- Persian/English typography foundation using Vazirmatn/Inter through `next/font`
- Logical RTL/LTR helpers for mixed-direction learning content
- Endoora text wordmark and motto treatment
- `/design-system` visual token preview with light/dark and RTL/LTR controls
- Visible global keyboard focus ring
- Reduced-motion handling
- Automated design-token contrast/logical-CSS smoke check

## Features behind flags

No runtime feature-flag system exists yet. The feature maturity/launch cut line remains documentation-only until the operations foundation is built.

## Known defects / pending verification

- The uploaded repository contained Day 01 project-memory files that had not been synchronized after the Day 02 commit; Day 03 updates those memory files.
- Final browser verification on the founder's Windows machine is still required for 360px mobile, 768px tablet, desktop, light, dark, RTL, LTR, and keyboard focus.
- The sandbox could not run `next build` because the uploaded Windows `node_modules` did not contain the Linux SWC binary and the sandbox has no package-registry network access. This is an environment limitation, not a confirmed application defect.
- Backend test execution was not repeated inside the sandbox because the available Python runtime does not contain the project's Django dependencies. Backend source was not changed by Day 03.
- Formal trademark/legal clearance, provider selection, and reviewed public legal pages remain launch dependencies.

## Environment requirements

- Node.js 24 LTS on the founder machine
- npm 10+
- Python 3.10.9 in the Endoora virtual environment
- Docker Desktop for PostgreSQL and Redis
- Next.js 16.3.1
- React 19.2.8
- TypeScript 5.9.3
- Django 5.2.17 / DRF 3.18.0

## Last successful checks in the generated Day 03 workspace

- `node scripts/check-design-tokens.mjs` — passed (14 WCAG AA contrast pairs + focus + reduced motion + logical CSS + centralized colors)
- UI TypeScript check — passed
- Web TypeScript check — passed
- Web ESLint check — passed
- Secret scanner regression tests — 5 passed
- Repository secret scan — passed

Founder must still run the normal repository commands from Windows:

- `npm run lint`
- `npm run typecheck`
- `npm run check:design`
- `npm run build`
- `python manage.py check`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`
- `python scripts\scan_secrets.py`

## Last backup path

Not required for Day 03: no database schema, payment state, permissions, uploads, or user data were changed. Preserve the existing Docker volumes and do not use destructive volume commands.

## Last Git commit hash

Base uploaded checkpoint: `d208eb4` — `Day 02: Create the Endoora monorepo and reproducible local environment`.

Day 03 local commit: **pending founder verification and push**.

## Exact next day

Day 04 — Build the accessible component library, only after the Day 03 browser/runtime acceptance gate passes.
