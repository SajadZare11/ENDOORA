# Endoora Project State — Day 07 Draft

## Checkpoint

- Roadmap restart checkpoint: Day 07 identity and account-security foundation implemented on top of the preserved repository.
- Existing later experimental modules remain present; this checkpoint does not claim that their roadmap days were re-accepted.
- New schema migration: `accounts.0002_user_email_verified_at` (created, not applied to PostgreSQL locally).
- Next roadmap day: Day 08 onboarding, age-band policy, profile completion, and save/resume.

## Day 07 delivered

- Custom UUID user model with email-first authentication and learner/teacher/editor/support/administrator roles.
- Teacher verification and paid/marketplace capability separation.
- Immutable versioned consent records with centralized terms/privacy versions.
- Iranian mobile normalization and hashed OTP provider abstraction.
- Generic recovery acknowledgement for unknown accounts; no unknown-account OTP creation.
- Expiring, one-time, attempt-capped, rate-limited, account-bound contact verification.
- HttpOnly/SameSite sessions, CSRF/CORS allowlists, login key rotation, production Secure/HSTS/referrer/opener/frame/nosniff settings.
- Account deactivation, delayed deletion request, and owner cancellation foundation.
- Current protected-session display and sign-out action.
- Reusable server-side permission matrix and negative object-permission tests.
- Persian-first/English-optional responsive AuthShell using Endoora's discovery-universe palette and restrained learning glass.
- Password visibility, accessible validation, legal consent links, generic recovery copy, 360px layout, and reduced-motion support.

## Verification

- Frontend lint, typecheck, production build, and Day 07 contract check pass.
- Focused backend tests: 26 passed.
- Full backend tests: 99 passed using the exact pinned packages in a disposable Python environment with in-memory SQLite.
- Desktop and 360px browser inspection passed for direction, overflow, control sizing, password visibility, language switching, validation, recovery, registration roles, and legal links.

## Remaining operational gate

The repository's virtual environments reference a removed Python installation; Docker/PostgreSQL are also unavailable. No active database was mutated. Before applying the new migration, follow the backup and PostgreSQL verification procedure in `docs/operations/DAY_07_MIGRATION_AND_ROLLBACK.md`.

Day 08 must not weaken role immutability, consent versioning, OTP ownership, rate limits, deactivation behavior, or generic recovery responses.
