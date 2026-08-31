# Endoora Project State

## Current checkpoint
- **Roadmap day completed:** Day 13 — Build the versioned question bank schema
- **Day 13 status:** Local acceptance complete; final repository gate is commit/push to `origin/main`
- **Inherited state:** Days 01–12 remain in place, including Persian-first RTL/English-LTR foundations, Endoora Operations, and stable CEFR taxonomy
- **Schema version:** Day 13 adds `questions.0001_initial` on top of `taxonomy.0001_initial`
- **Frontend/UI package version:** `0.4.0`
- **Backend:** Django 5.2.17 / Django REST Framework 3.18.0
- **Frontend:** Next.js 16.3.1 / React 19
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran
- **Default product locale:** Persian (`fa`) / RTL
- **Optional product locale:** English (`en`) / LTR

## Features working through Day 13

### Foundation and public experience

- Reproducible monorepo with Next.js, Django/DRF, shared UI/contracts, PostgreSQL/Redis development services, CI, health checks, and secret scanning
- Centralized bilingual design tokens and accessible component foundation
- Persian-first RTL public website with English option
- Public SEO/metadata, public feature routes, waitlist foundation, and legal/support placeholders
- Role-specific navigation and Account hub architecture

### Identity and account foundation

- Custom user model and learner/teacher role separation
- Consent, authentication, OTP/password-reset foundation, session handling, and account-deletion request foundation
- Learner and teacher onboarding with server-side save/resume
- `LearnerProfile` and `TeacherProfile`
- Profile/settings and persisted locale preference
- Current-session view
- Data-export request foundation
- Account hub routes for Profile, Sessions, Data Controls, Library, Usage, Plan, and Billing
- Teacher role is separate from verified-teacher, marketplace, and paid-class capabilities

### Day 09 learner application shell

- Protected Persian-first learner dashboard with English switch
- One aggregated learner-home endpoint: `GET /api/dashboard/home/`
- One dominant next-best-action / Today card
- First-time learner guidance to Placement
- Safe empty/loading/error/offline/permission-denied states
- No fabricated CEFR, skill, path, SRS, assignment, class, XP, or notification values
- Server-side learner-role enforcement

### Day 10 teacher application shell

- Protected Persian-first teacher workspace with English switch
- Five teacher destinations: Home, Teach, Marketplace, Resources, Account
- Aggregated teacher dashboard endpoint: `GET /api/teachers/dashboard/`
- Privacy-safe dashboard event endpoint: `POST /api/teachers/dashboard/events/`
- Prominent verified/unverified teacher state
- Capability separation for teacher role, verified teacher, marketplace eligibility, and paid-class eligibility
- Urgency resolver for verification, next session, Learn Now request, grading, and first-class preparation
- Safe summaries for classes, students, requests, grading, schedule, and earnings
- No invented counts, money, sessions, or future-domain activity when those domains do not yet exist
- Question-bank and fixed-class foundation shortcuts without prematurely implementing later roadmap features
- Responsive teacher sidebar / 360 px mobile bottom navigation
- Teacher loading, login-required, wrong-role, offline, API-error, retry, and empty/foundation states
- Dashboard payload redaction rules that exclude raw learner writing, audio, transcripts, AI conversation history, answers, and private messages
- Bounded dashboard-domain query regression test
- Day 09 Django dashboard registration repaired in root settings and URL wiring

## Day 10 backend modules

Django app:

- `teachers`

Key files:

- `apps/api/teachers/dashboard.py`
- `apps/api/teachers/serializers.py`
- `apps/api/teachers/views.py`
- `apps/api/teachers/urls.py`
- `apps/api/teachers/tests.py`

Day 10 deliberately introduces no persistent model.

## Day 10 frontend surface

Primary route:

- `/teacher`

Foundation routes:

- `/teacher/classes`
- `/teacher/resources`
- `/teacher/question-bank`
- `/teacher/fixed-classes/new`
- `/teacher/account`
- `/marketplace/requests`

The production build generated these routes successfully.

## Day 10 security and privacy properties

- Anonymous access to the teacher dashboard API is rejected.
- Authenticated non-teachers are rejected server-side.
- An unverified teacher cannot gain effective marketplace or paid-class capability merely because underlying flags are present.
- Verification has the highest primary-action priority for an unverified teacher.
- Raw learner writing, audio, transcript, conversation, answer text, and private-message fields are prohibited from teacher dashboard summaries.
- Teacher dashboard analytics accepts only bounded known event/action identifiers.
- No new secret-bearing provider integration is introduced on Day 10.

## Day 10 verification evidence

### Backend

- `python manage.py check` — PASS
- `python manage.py test teachers` — PASS
- `python manage.py test` — PASS
- `python manage.py makemigrations --check --dry-run` — PASS; no changes detected

### Frontend

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- Next.js production build generated the teacher route family successfully

### Repository / security

- `node scripts/check-day10.mjs` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS; only Git line-ending conversion warnings were reported for two Django wiring files

### Manual acceptance

- Teacher application shell reported working locally by the founder.
- Before the final commit, keep the Day 10 acceptance gate in `docs/operations/DAY_10_ACCEPTANCE_GATE.md` as the authoritative manual checklist for verified/unverified behavior, 360 px layout, and response-payload inspection.

## Known limitations / intentionally deferred work

- Actual teacher verification workflow is not implemented yet; Day 10 only consumes existing verification state.
- Real teacher classes/students, Learn Now marketplace records, grading records, schedules, and earnings are later roadmap domains. Day 10 intentionally renders safe empty/foundation states rather than fake data.
- Fixed-class creation and paid teaching remain later roadmap work even when a verified teacher has the relevant capability flags.
- Teacher earnings and payout operations are not implemented on Day 10.
- Full automated browser E2E/Playwright coverage remains future work.
- Multi-device session inventory, export-file generation, and other Day 08 deferred items remain deferred.

## Environment requirements

- Node.js 24 LTS
- npm 10+
- Python 3.10.9 in the repository virtual environment
- Docker Desktop for PostgreSQL and Redis where required
- Next.js 16.3.1
- React 19
- TypeScript 5.9.x
- Django 5.2.17
- Django REST Framework 3.18.0

## Last successful Day 10 verification commands

Repository root:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node scripts/check-day10.mjs`
- `python -m unittest scripts.test_scan_secrets`
- `python scripts/scan_secrets.py`
- `git diff --check`
- `git status --short --branch`

Backend (`apps/api`, virtual environment active):

- `python manage.py check`
- `python manage.py test teachers`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`

## Last backup path

Day 10 has no database schema change and does not require a new migration backup. The existing pre-Day-08 private database checkpoint remains the latest documented schema-risk backup.

## Git checkpoint

This file is part of the final Day 10 Git checkpoint. Day 10 is considered complete only if the commit and push commands below succeed and the final working tree is clean. The commit hash can only be known after the commit is created; do not invent or hardcode a self-referential hash inside this file.

Planned commit message:

`Day 10: Build the teacher application shell and simplified navigation`

## Exact next day

**Day 11 — Configure Django admin, audit logs, and safe settings.**

Do not begin Day 11 until the Day 10 commit is pushed successfully and `git status --short --branch` shows `main` synchronized with `origin/main` and no unintended working-tree changes.

## Day 11 — Operations completed
- Day 11 operations/admin/audit work was completed and pushed before Day 12 began.
- Added append-only privileged-change audit events with secret/private-content redaction.
- Added typed SystemSetting and FeatureFlag models with validation and operational ownership metadata.
- Added Endoora Operations admin branding, Persian-first operational summary, least-privilege staff policy, and role bootstrap command.
- Database migration required: core.0001_initial and audit.0001_initial.
- Day 11 acceptance passed before the Day 12 taxonomy migration was started.

### Day 11 hardening checkpoint — 2026-09-01

- Hardened audit snapshots so sensitive keys nested in JSON values are redacted.
- Hardened audit reasons so credential-like values supplied through request context are redacted before persistence.
- Hardened unsafe boolean setting validation to reject bypass/debug aliases, plus expanded secret-key detection.
- Verification: `python scripts\\check_day11.py` (PASS); `python manage.py check` (PASS); `python manage.py test` (PASS, 106 tests under an isolated SQLite test database because Docker/PostgreSQL is unavailable on this host); `node scripts\\check-day10.mjs` (PASS); `npm run lint` (PASS); `npm run typecheck` (PASS); `npm run build` (PASS); `python scripts\\scan_secrets.py` (PASS); `git diff --check` (PASS).
- Git checkpoint: `8cb1176` (`Day 11: Harden audit redaction and safe settings`), pushed to `origin/main`.
- Latest verified private PostgreSQL backup remains `E:\\0\\Work\\Website\\The General Website\\Endoora\\PRIVATE_DO_NOT_COPY_TO_GIT\\backups\\day12\\20260820-000631\\endoora-pre-day12.dump` (69,383 bytes; captured after Day 11 and retained outside Git). A new pre-Day-11 dump could not be created on this host because Docker/PostgreSQL is unavailable.

## Day 12 — CEFR skill and content taxonomy (complete locally)

- Added stable UUID/slug taxonomy nodes for skills, subskills, objectives, grammar/vocabulary topics, age tags, and exam tags.
- Persian labels are the default user-facing taxonomy representation; English labels remain available as an explicit option.
- Added release/import history, node revisions, deprecation traceability, prerequisite history, and cycle validation.
- Added versioned seed data and an idempotent `import_taxonomy` command.
- Added read-only public lookup API foundation at `/api/taxonomy/`.
- Added Django admin taxonomy browsing/editing with stable-slug and delete protections.
- Day 12 local acceptance passed: verified backup, migration, idempotent import, backend tests, Persian/English API checks, admin checks, frontend regression, 360 px/desktop review, secret scan, and diff check.

## Day 12 verification evidence

### Database and taxonomy
- Pre-Day-12 PostgreSQL backup verified: `E:\0\Work\Website\The General Website\Endoora\PRIVATE_DO_NOT_COPY_TO_GIT\backups\day12\20260820-000631\endoora-pre-day12.dump`
- Backup size: `69383` bytes; backup remains outside Git
- `taxonomy.0001_initial` — applied successfully
- Taxonomy release: `day12-v1`
- Imported nodes: `62`
- Node revisions: `62`
- Active prerequisite relationships: `9`
- Second import produced zero creates/updates/revisions/prerequisite changes, proving idempotency
- `python manage.py makemigrations --check --dry-run` — PASS; no changes detected

### Backend
- `python manage.py check` — PASS
- `python manage.py test taxonomy` — PASS, 10 tests
- `python manage.py test` — PASS, 80 tests
- `python scripts/check_day12.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### API/admin/manual
- Persian taxonomy labels are the API default — PASS
- Explicit English taxonomy labels (`lang=en`) — PASS
- Django admin taxonomy protections — PASS
- Stable slug/UUID behavior — PASS
- Desktop manual regression — PASS
- 360 px manual regression — PASS
- Persian RTL / English LTR regression — PASS

### Frontend
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS

## Git checkpoint

This file is part of the Day 12 Git checkpoint. The commit hash is intentionally not hardcoded inside the commit that creates it.

Planned commit message:

`Day 12: Build the CEFR skill and content taxonomy`

## Exact next day

**Day 13 — Build the versioned question bank schema.**

Do not begin Day 13 until the Day 12 commit is pushed successfully and `git status --short --branch` shows `main` synchronized with `origin/main` and no unintended working-tree changes.

## Day 13 — Versioned question bank schema (implementation applied; acceptance pending)

- Added stable `Question` identities and immutable `QuestionVersion` records.
- Added nine question types, answer normalization, rubrics, media metadata, review events, licensing, and Day 12 objective links.
- Added Persian-first learner-safe preview with English option.
- Added serializer split so protected answer data is absent before submission.
- Added draft-only idempotent JSON import and protected export.
- Database migration required: `questions.0001_initial`.
- Day 13 is not complete until backup, migration, focused/full tests, network answer-key inspection, mobile/desktop bilingual review, secret scan, and Git checkpoint pass.

## Day 13 verification evidence

### Database and question bank
- Pre-Day-13 PostgreSQL backup verified: `E:\0\Work\Website\The General Website\Endoora\PRIVATE_DO_NOT_COPY_TO_GIT\backups\day13\20260820-120500\endoora-pre-day13.dump`
- `questions.0001_initial` applied successfully
- Question versions reference stable Day 12 taxonomy objectives
- Sample import is draft-only and idempotent
- Published/retired content and links are immutable
- Retired versions remain stored for historical references

### Backend/security
- `python manage.py check` — PASS
- `python manage.py test questions` — PASS
- `python manage.py test` — PASS
- `python manage.py makemigrations --check --dry-run` — PASS
- pre-submission learner payload contains no answer keys/accepted variants/rubrics/explanations
- support/editor negative permission boundary — PASS
- `python scripts/check_day13.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### Frontend/manual
- Persian-first RTL question preview — PASS
- English interface option — PASS
- English learning content isolated LTR — PASS
- 360 px and desktop — PASS
- loading/empty/error/retry/permission states — PASS
- publish -> learner-safe preview -> submit -> explanation -> retire journey — PASS

## Git checkpoint

Planned commit message:

`Day 13: Build the versioned question bank schema`

## Exact next day

**Day 14 — Build the multi-stage placement-test session engine.**

Do not begin Day 14 until the Day 13 commit is pushed and `git status --short --branch`
shows `main` synchronized with `origin/main` and no unintended changes.
