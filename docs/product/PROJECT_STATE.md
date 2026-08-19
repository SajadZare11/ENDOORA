# Endoora Project State

## Current checkpoint

- **Roadmap day implemented:** Day 08 — registration, login, password reset, onboarding, profile/settings, sessions, privacy/data controls, and Account hub UX
- **Day 08 implementation status:** implementation and founder verification complete; documentation synchronization, repository safety checks, Git commit, and push remain
- **Day 07 inherited foundation:** custom account/authentication system, role/capability separation, consent records, OTP/password-recovery foundation, session handling, account-deletion request foundation, and permission tests
- **Schema version:** Day 08 adds the `profiles` application and its initial migration
- **Frontend/UI package version:** `0.4.0`
- **Backend:** Django 5.2.17 / DRF 3.18.0
- **Frontend:** Next.js 16.3.1 / React 19
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran
- **Default product locale:** Persian (`fa`) / RTL
- **Optional product locale:** English (`en`) / LTR

## Features / contracts working after Day 08

Day 01–Day 07 foundations remain intact, plus:

### Authentication UX

- Persian-first registration page with English switch
- Learner and teacher role selection
- Explicit Terms and Privacy consent during registration
- Session-based login
- Password-reset OTP request and confirmation flow
- Local-development reset-code workflow without exposing production OTP behavior
- Registration and login verified end-to-end through Next.js -> Django
- CSRF endpoint proxied correctly through Next.js
- Django API trailing-slash handling preserved without redirect loops

### Learner onboarding

- Separate learner onboarding route
- Goal
- Age band
- Current CEFR estimate
- Preferred daily study minutes
- Preferred learning days
- Timezone
- Save and continue later
- Server-side refresh/resume persistence
- Profile completeness
- Completion state

### Teacher onboarding

- Separate teacher onboarding behavior
- Public name
- Bio
- Experience years
- Specialties
- City
- Languages
- Availability intent
- Verification intent
- Save/resume support
- Profile completeness
- Completion state
- Teacher onboarding does not grant verification, marketplace, or paid-class capability

### Profile and settings

- `/account/profile`
- Account email and role are read-only
- Preferred locale can be persisted
- Phone field can be updated through the existing account API
- Learner profile can be edited
- Teacher profile can be edited
- Persian/English setting survives refresh

### Account hub

- `/account`
- Profile & Settings
- Devices & Sessions
- Privacy & Data Controls
- Library foundation
- Usage foundation
- Plan foundation
- Billing foundation
- Profile completeness visible
- Teacher capability state visible

### Sessions

- `/account/sessions`
- Current session state
- Session expiry
- Session fingerprint shown when available
- UI explicitly avoids pretending multi-device management exists when the backend only exposes the current session

### Privacy and data controls

- `/account/data-controls`
- Data-export request creation
- Export request history
- Export requests survive refresh
- Account-deletion entry point
- Exact `DELETE` confirmation guard before the deletion action becomes available
- Manual Day 08 verification intentionally did not submit a destructive deletion request

### Account foundation routes

- `/account/library`
- `/account/usage`
- `/account/plan`
- `/account/billing`

These routes are real and reachable but explicitly labelled as foundation functionality for later roadmap days.

## Day 08 backend additions

Django app:

- `profiles`

Implemented persistent models:

- `LearnerProfile`
- `TeacherProfile`
- `OnboardingProgress`
- `DataExportRequest`

Day 08 reuses the existing account-deletion request model from `accounts` rather than duplicating deletion state.

## Day 08 API surface

Authentication/account:

- `GET /api/auth/csrf/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET/PATCH /api/auth/me/`
- `POST /api/auth/otp/request/`
- `POST /api/auth/otp/verify/`
- `POST /api/auth/password-reset/confirm/`
- `GET /api/auth/sessions/current/`
- `POST /api/auth/deactivate/`
- `POST /api/auth/deletion-request/`

Profiles/account hub:

- `GET/PATCH /api/profiles/learner/`
- `GET/PATCH /api/profiles/teacher/`
- `GET/PATCH /api/profiles/onboarding/`
- `POST /api/profiles/onboarding/complete/`
- `GET/POST /api/profiles/data-exports/`
- `GET /api/profiles/account-summary/`

## Day 08 verified safety properties

- Learner cannot access the teacher profile endpoint.
- Teacher cannot access the learner profile endpoint.
- One learner cannot read or mutate another learner's profile.
- Sensitive values are rejected from onboarding draft data.
- Registration cannot self-assign an administrative role.
- Required Terms and Privacy consent are explicit.
- Teacher verification intent does not set `is_teacher_verified`.
- Teacher verification intent does not set `marketplace_eligible`.
- Teacher verification intent does not set `paid_class_eligible`.
- Data-export creation is idempotent while a request is pending/processing.
- Account deletion is guarded by exact `DELETE` confirmation in the UI.

## Day 08 verification evidence

Backend:

- `python manage.py check` — PASS
- `python manage.py test` — PASS, 41 tests
- `python manage.py makemigrations --check --dry-run` — PASS, no changes detected

Frontend:

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- Next.js production build generated all Day 08 routes successfully

Manual:

- registration — PASS
- login — PASS
- password reset — PASS
- learner onboarding completion — PASS
- learner server-side refresh persistence — PASS
- teacher onboarding completion — PASS
- teacher privilege separation — PASS
- profile edit persistence — PASS
- preferred-language persistence — PASS
- current-session page — PASS
- data-export persistence — PASS
- account deletion `DELETE` guard — PASS
- all Account hub routes reachable — PASS
- 360 px mobile smoke test — PASS
- keyboard navigation smoke test — PASS

## Known limitations / intentionally deferred work

- Multi-device session inventory and remote session revocation are not yet implemented; Day 08 exposes the current session only.
- Data-export processing/download delivery is not yet implemented; Day 08 creates and tracks export requests.
- Library, Usage, Plan, and Billing are foundation routes and do not yet contain their later roadmap functionality.
- Teacher verification intent does not perform actual verification.
- Teacher marketplace and paid-class capabilities remain disabled until their dedicated roadmap work.
- Age-aware guardian/legal workflow requires later product/legal policy work; Day 08 records age band but does not invent jurisdiction-specific legal rules.
- Account deletion was not manually submitted during Day 08 verification to avoid scheduling destructive test-account removal.
- Automated browser E2E/Playwright coverage remains future work; Day 08 used automated backend checks plus manual browser acceptance.

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

## Day 08 final verification commands

Repository root:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `python -m unittest scripts.test_scan_secrets`
- `python scripts\scan_secrets.py`
- `git diff --check`
- `git status --short --branch`

Backend (`apps\api`, virtual environment active):

- `python manage.py check`
- `python manage.py test`
- `python manage.py makemigrations --check --dry-run`

## Last backup path

A pre-Day-08 database checkpoint was taken before persistent Day 08 profile/onboarding schema work.

The backup remains private and outside intended Git tracking.

## Last Git commit hash

**Pending Day 08 final repository checks, commit, and push.**

Do not invent a hash before the commit succeeds.

## Exact next day

Day 09 begins only after:

1. Day 08 documentation is synchronized.
2. Secret scanning passes.
3. Repository diff/status is reviewed.
4. Day 08 commit succeeds.
5. Day 08 commit is pushed to `origin/main`.
