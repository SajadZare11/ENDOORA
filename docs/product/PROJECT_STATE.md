# Endoora Project State

## Current checkpoint

- **Roadmap day implemented:** Day 04 — accessible component library
- **Day 04 acceptance status:** Implementation and static checks complete in the generated package; founder Windows runtime/browser verification and Git checkpoint still required
- **Schema version:** Django built-in schema only; no Endoora domain migration was added on Day 04
- **Frontend version:** `0.4.0`
- **UI package version:** `0.4.0`
- **Backend:** Day 02 Django/DRF scaffold unchanged
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran

## Features working

Day 01-Day 03 foundations remain intact, plus:

- Reusable action primitives: primary/secondary/tertiary/destructive/loading buttons and icon button
- Labelled text input, textarea, select, multi-select, checkbox, radio group, and linked error summary
- Keyboard-operable tabs with Arrow/Home/End behavior
- Shared Card and Badge primitives
- Native modal Dialog and Drawer with Escape handling, initial focus, and focus restoration
- Toast live-region notification surface
- Skeleton, progress, and semantic status components
- Resumable multi-step workflow primitive with Back, Save and Continue Later, Cancel, Continue, completion, and refresh recovery
- Responsive DataTable with semantic desktop table and 360px card fallback
- AccessibleChart with factual summary, visual bars, and accessible data table
- AIResultCard with AI label, evidence, confidence, limitations, retry, save, report, and human-review controls
- Standard Empty, Permission Denied, Offline, and Retry states
- ProviderStatus abstraction for safe degraded-service messaging
- AccountNavigation for low-frequency account tools
- RoleShell with desktop sidebar and mobile bottom navigation
- `/design-system/components` visual component gallery with more than 25 examples
- Automated Day 04 component/accessibility static smoke check

## Features behind flags

No runtime feature-flag system exists yet. Feature maturity remains documentation-only until the Day 11 operations foundation.

## Known defects / pending verification

- Founder must complete the Day 04 manual browser journey at 360px and desktop widths.
- Founder must verify Dialog/Drawer focus behavior in a real browser, including Escape and focus restoration.
- Founder must verify the Stepper resumes the active step after refresh.
- Founder must run the Windows production build and backend regression commands before committing Day 04.
- The copied Windows `node_modules/.bin` launchers initially lacked Linux executable bits; after changing only those sandbox-local permissions, the normal `npm run lint` command passed. This does not change repository source files and is not a Windows issue.
- The sandbox is still expected to be unable to run a Next.js production build with the uploaded Windows-only SWC binary. This is an environment limitation; the founder must run `npm run build` on Windows.
- Backend source was not changed by Day 04; the sandbox Python environment does not contain the project's Django runtime dependencies.

## Environment requirements

- Node.js 24 LTS on the founder machine
- npm 10+
- Python 3.10.9 in the Endoora virtual environment
- Docker Desktop for PostgreSQL and Redis
- Next.js 16.3.1
- React 19.2.8
- TypeScript 5.9.3
- Django 5.2.17 / DRF 3.18.0

## Last successful checks in the generated Day 04 workspace

- `npm run typecheck` — PASS for UI, contracts, and web
- `npm run lint` — PASS in the generated workspace after sandbox-local launcher permission normalization
- `npm run check:design` — PASS (14 WCAG AA contrast pairs + focus + reduced motion + logical CSS + centralized colors)
- `npm run check:components` — PASS (29 visual examples + accessibility/component invariants)

Founder must still run from Windows:

- `npm run lint`
- `npm run typecheck`
- `npm run check:design`
- `npm run check:components`
- `npm run build`
- `python manage.py check`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`
- `python -m unittest scripts.test_scan_secrets`
- `python scripts\scan_secrets.py`

## Last backup path

No database backup is required specifically for Day 04 because no schema, payment, authentication, permission, storage, or user-data change occurs. Preserve existing Docker volumes and do not use destructive volume commands.

## Last Git commit hash

Base uploaded Git checkpoint remains `d208eb4` — `Day 02: Create the Endoora monorepo and reproducible local environment` in the generated workspace because Day 03/Day 04 founder commits are intentionally left to the verified local repository.

## Exact next day

Day 05 — Freeze information architecture, Account hub, and critical user flows, only after the Day 04 acceptance gate and Git checkpoint pass.
