# Endoora Day 06 changed-files overlay

Built against the public GitHub `main` state inspected on 18 August 2026.

## Important repository finding

GitHub already contains Day 05 information-architecture documents, while `docs/product/PROJECT_STATE.md` still reports Day 04. This overlay does not overwrite the existing project-state file automatically; it supplies `PROJECT_STATE_DAY06_DRAFT.md` so the verified local facts can replace the stale state only after the Day 06 gate passes.

## REPLACE

- `.env.example`
- `package.json`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/api/endoora_api/settings/base.py`
- `apps/api/endoora_api/urls.py`

These replacements were based on the current GitHub versions inspected before packaging. No Day 05 sitemap/user-flow document is replaced.

## NEW — frontend

- `apps/web/lib/public-site.ts`
- `apps/web/components/marketing/PublicShell.tsx`
- `apps/web/components/marketing/DocumentLocaleSync.tsx`
- `apps/web/components/marketing/public-shell.module.css`
- `apps/web/components/marketing/HomePage.tsx`
- `apps/web/components/marketing/GenericPublicPage.tsx`
- `apps/web/components/marketing/FeaturePage.tsx`
- `apps/web/components/marketing/LegalPage.tsx`
- `apps/web/components/marketing/WaitlistForm.tsx`
- `apps/web/components/marketing/AnalyticsConsent.tsx`
- `apps/web/components/marketing/marketing.module.css`
- `apps/web/app/en/page.tsx`
- `apps/web/app/[slug]/page.tsx`
- `apps/web/app/en/[slug]/page.tsx`
- `apps/web/app/features/[feature]/page.tsx`
- `apps/web/app/en/features/[feature]/page.tsx`
- `apps/web/app/legal/[legal]/page.tsx`
- `apps/web/app/en/legal/[legal]/page.tsx`
- `apps/web/app/api/waitlist/route.ts`
- `apps/web/app/sitemap.ts`
- `apps/web/app/robots.ts`
- `apps/web/app/opengraph-image.tsx`

## NEW — backend / migration / tests

- `apps/api/waitlist/__init__.py`
- `apps/api/waitlist/apps.py`
- `apps/api/waitlist/models.py`
- `apps/api/waitlist/serializers.py`
- `apps/api/waitlist/views.py`
- `apps/api/waitlist/urls.py`
- `apps/api/waitlist/migrations/__init__.py`
- `apps/api/waitlist/migrations/0001_initial.py`
- `apps/api/waitlist/tests.py`

## NEW — checks / docs

- `scripts/check-public-site.mjs`
- `DAY06_INSTALL_WINDOWS.md`
- `scripts/stage_day06.ps1`
- `scripts/backup_day06.ps1`
- `docs/product/DAY_06_PUBLIC_SITE.md`
- `docs/quality/DAY_06_ACCEPTANCE_GATE.md`
- `docs/operations/DAY_06_BACKUP_AND_ROLLBACK.md`
- `docs/operations/ENVIRONMENT_VARIABLES.md`
- `docs/product/PROJECT_STATE_DAY06_DRAFT.md`
- `DAY06_PACKAGE_MANIFEST.md`

## Explicitly untouched

- `scripts/scan_secrets.py` — left untouched because the founder had a local modification there in the most recent local checkpoint.
- Day 05 sitemap, user-flow, Account hub, localization contract, wireframes, and ADR-002 documents.
- `.env`, databases, Docker volumes, `.idea`, `node_modules`, `.next`, virtual environments, uploads, and secrets.

## Copy destination

Extract this overlay into:

`E:\0\Work\Website\The General Website\Endoora`

Allow replacement only for files listed under **REPLACE**. Do not delete the project first.

## Data risk

Day 06 adds a database migration for the waitlist. Make a non-empty PostgreSQL backup before `python manage.py migrate`.
## Package verification

Static checks completed in the generated Day 06 overlay:

- TypeScript/TSX syntax transpile: PASS
- Backend Python syntax compile: PASS
- `node scripts/check-public-site.mjs`: PASS
- Old-brand scan: PASS
- Unsupported-claim scan: PASS

The full repository checks (`npm run lint`, `npm run typecheck`, `npm run build`, Django tests, migration drift, browser/mobile checks, and Lighthouse) must still run on the founder's Windows/PyCharm machine before Day 06 is committed.

The archive excludes `.git`, real `.env` files, virtual environments, `node_modules`, caches, local databases, credentials, user uploads, and build output.

