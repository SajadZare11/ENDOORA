# Day 07 acceptance gate

## Automated evidence — 2026-08-24

- [x] `manage.py check` — no issues with the pinned Django 5.2.17 environment.
- [x] `manage.py makemigrations --check --dry-run` — no model/migration drift under the isolated acceptance database.
- [x] Focused `accounts permissions` tests — 26 passed.
- [x] Full Django suite — 103 passed in the 2026-08-26 regression audit.
- [x] `npm run lint` — passed with zero warnings.
- [x] `npm run typecheck` — passed for UI, contracts, and web.
- [x] `npm run build` — passed; all auth/account routes generated.
- [x] `npm run check:day07` — auth, security, responsive UI, and documentation contracts passed.
- [x] `python scripts\scan_secrets.py` — passed; scanner unit tests also passed (5/5).

The repository's old checked-out virtual environment points to a removed Python 3.10 executable. Verification used a disposable Python 3.12 environment containing the exact pinned requirements. The 2026-08-26 follow-up ran all 103 tests against the local PostgreSQL test database; live health also reported PostgreSQL and Redis `ok`.

## Security

- [x] Custom email-first user model exists before later identity work.
- [x] Self-service account update cannot change `role`.
- [x] Teacher role alone does not grant verified-teacher capability.
- [x] Unrelated-user object permission test denies access.
- [x] Inactive user cannot authenticate.
- [x] Login and OTP-request throttles reach HTTP 429.
- [x] OTP is generated securely, hashed, expiring, one-time, attempt-capped, and account-bound for contact verification.
- [x] Unknown recovery identifiers receive a generic acknowledgement and create no OTP.
- [x] Consent type + immutable version are persisted.
- [x] Production Secure, HttpOnly, SameSite, HSTS, referrer, opener, nosniff, and frame settings are explicit.
- [x] CORS and CSRF origin lists are explicit, not wildcard.
- [x] Current-session sign-out is available.
- [x] Delayed deletion requests can be cancelled by the owning user.

## Iranian localization and accessibility

- [x] `09123456789`, `+989123456789`, `989123456789`, and `00989123456789` normalize to `+989123456789`.
- [x] Auth security errors use Persian and English payloads.
- [x] Persian is the default RTL interface; English switches to LTR.
- [x] Email, phone, password, and OTP inputs are directionally isolated.
- [x] Password visibility exposes label and pressed state.
- [x] 360px browser inspection reported no horizontal overflow.
- [x] Mobile form inputs and password control are 44px high.
- [x] Reduced-motion rules stop ambient animation.
- [x] Desktop and 360px screenshots were inspected against the accepted design concept.

## Data protection / migration gate

- [x] No production/local PostgreSQL migration was applied during this implementation, so no database data was mutated.
- [ ] Before applying `accounts.0002_user_email_verified_at`, create and verify a non-empty PostgreSQL dump outside Git.
- [ ] Apply the migration in the restored PostgreSQL environment and rerun the full suite there.
- [ ] Verify waitlist and legacy-user row counts after migration.

See `DAY_07_MIGRATION_AND_ROLLBACK.md` for exact backup, apply, verification, and rollback steps.

## Browser evidence

- [x] Login normal state, empty-submit validation, password reveal state, Persian/English direction switch, recovery route, registration role/consent controls, and legal links inspected.
- [x] No horizontal overflow at 360px on login, recovery, or registration.
- [x] Authenticated learner/teacher sessions, onboarding persistence, Account surfaces, role denial, and guarded deletion controls were exercised against the running PostgreSQL-backed API; destructive deletion was intentionally not submitted.
- [x] Final console/error log inspection after the last screenshot — no warnings or errors.

## Git checkpoint

- [x] `git status` contains only intended Day 07 changes; generated Next.js dev artifacts were removed.
- [ ] Day 07 commit pushed to `origin/main` only after the founder accepts the implementation and the PostgreSQL migration gate is complete.
