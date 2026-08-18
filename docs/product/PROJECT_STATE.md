# Endoora Project State

## Current checkpoint

- **Roadmap day implemented:** Day 05 — information architecture, Account hub, and critical user flows
- **Day 05 acceptance status:** implementation/static package complete; founder Windows frontend/browser verification, five-person hallway test, and Git checkpoint still required
- **Day 04 status inherited:** component-library implementation exists; complete any founder-only Day 04 browser/build/checkpoint items not already verified before committing Day 05
- **Schema version:** Django built-in schema only; no Endoora domain migration added on Day 05
- **Frontend/UI package version:** unchanged from Day 04 (`0.4.0`); Day 05 adds a developer IA prototype without dependency changes
- **Backend:** Day 02 Django/DRF scaffold unchanged
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran

## Features / contracts working after applying Day 05

Day 01–Day 04 foundations remain intact, plus:

- Frozen public, learner, teacher and operations sitemap
- Learner primary nav: Home, Learn, Practice, Teachers & Classes, Account
- Teacher primary nav: Home, Teach, Marketplace, Resources, Account
- Public nav: Home, How it works, Placement, Teachers, Classes, Courses, IELTS, Pricing, Help
- Account hub specification for learner and teacher low-frequency tools
- Route ownership/guard/deep-link inventory derived without overwriting the existing feature maps
- Save/Back/Cancel/refresh/reconnect route-state convention
- Six critical journey wireframes
- ADR-002 navigation decision
- `/design-system/information-architecture` developer findability prototype
- Day 05 static IA smoke check

## Features behind flags

No runtime feature-flag system exists yet. Feature maturity remains documentation-only until the Day 11 operations foundation.
Later beta/foundation destinations in the IA are specifications, not enabled product features.

## Known defects / pending verification

- Five-person hallway/findability test is human-only and cannot be truthfully marked passed by generated code.
- Founder must verify `/design-system/information-architecture` at 360 px and desktop.
- Founder must run the complete frontend regression/build suite after applying Day 05.
- Planned product routes shown in the IA prototype are not necessarily implemented yet; the prototype uses in-page destinations to test findability.
- Record the actual Day 05 Git commit hash only after the successful local commit; do not invent it.

## Environment requirements

- Node.js 24 LTS
- npm 10+
- Python 3.10.9 in `apps\api\.venv`
- Docker Desktop for PostgreSQL and Redis
- Next.js 16.3.1
- React 19.2.8
- TypeScript 5.9.3
- Django 5.2.17 / DRF 3.18.0

## Day 05 verification commands

Repository root:

- `node scripts\check-information-architecture.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm run check:design`
- `npm run check:components`
- `npm run build`
- `python -m unittest scripts.test_scan_secrets`
- `python scripts\scan_secrets.py`

Backend (`apps\api`, virtual environment active):

- `python manage.py check`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`

## Last backup path

No Day 05 database backup is specifically required because Day 05 changes no schema, payment, authentication, permissions, storage, or persistent user data.
Preserve existing Docker volumes and do not use destructive volume commands.

## Last Git commit hash

**Pending founder Day 05 verification and commit.**
The package intentionally does not fabricate a commit hash.

## Exact next day

Day 06 — Build the public Endoora website shell and SEO foundation, **only after the Day 05 success gate passes**.
