# Endoora API Contracts — Day 01 Baseline

No API endpoints exist yet.

## Contract principles

- Django/DRF owns authorization and validation.
- OpenAPI is the frontend/backend contract.
- Generated TypeScript types are derived from OpenAPI.
- Secrets and answer keys never appear in inappropriate frontend payloads.
- Error payloads use stable machine codes plus localized user-safe messages.
- Write endpoints use idempotency where duplicate requests are possible.
- Long-running work returns observable job state rather than holding fragile HTTP requests.
- Every object endpoint must define owner/related-role/unrelated-user/admin behavior.

Day 02 will add the first health contract.

## Day 08 — Authentication, profile, onboarding and Account contracts

Day 08 adds the first implemented account/profile contracts beyond the original baseline.

### Authentication and account

#### `GET /api/auth/csrf/`

Purpose:

- issues the CSRF cookie/token required by browser mutations
- used by the same-origin Next.js -> Django API flow

Response includes:

- `csrf_token`

#### `POST /api/auth/register/`

Creates a self-service Endoora account.

Request fields:

- `email`
- `password`
- `role`
- `preferred_locale`
- `accept_terms`
- `accept_privacy`

Rules:

- self-registration permits `learner` and `teacher` only
- administrative roles cannot be self-assigned
- Terms and Privacy acceptance are required
- successful registration establishes the authenticated session
- teacher registration does not grant teacher verification or marketplace/paid-class capabilities

#### `POST /api/auth/login/`

Authenticates an existing active account and establishes a session.

#### `POST /api/auth/logout/`

Ends the current authenticated session.

#### `GET /api/auth/me/`

Returns the authenticated user's own account representation.

#### `PATCH /api/auth/me/`

Day 08 self-service writable settings:

- `phone`
- `preferred_locale`

Identity/authorization fields such as email, role and teacher capabilities are not self-service writable through this endpoint.

#### `POST /api/auth/otp/request/`

Creates an OTP challenge for a supported purpose.

Day 08 browser password recovery uses:

- `purpose = password_reset`

The local mock provider may expose a development-only `debug_code` when explicitly running in the local DEBUG configuration. Production behavior must not expose OTP values.

#### `POST /api/auth/otp/verify/`

Verifies a supported OTP challenge.

#### `POST /api/auth/password-reset/confirm/`

Request:

- `identifier`
- `code`
- `new_password`

Rules:

- the reset OTP must be valid
- the new password passes Django password validation
- a successful request replaces the existing password

#### `GET /api/auth/sessions/current/`

Returns the current authenticated session.

Response fields:

- `current`
- `session_fingerprint`
- `expires_at`

Day 08 exposes the current session only. Multi-device inventory and remote revocation are not yet part of this contract.

#### `POST /api/auth/deactivate/`

Existing account-deactivation entry point retained from the authentication foundation.

#### `POST /api/auth/deletion-request/`

Creates an account-deletion request.

Request fields:

- `confirm`
- optional `reason_code`

Safety rule:

- `confirm` must equal `DELETE`

The request schedules the deletion workflow rather than pretending destructive deletion happened synchronously.

### Learner profile

#### `GET /api/profiles/learner/`

Returns the authenticated learner's own profile.

Teacher accounts cannot use the learner profile endpoint.

#### `PATCH /api/profiles/learner/`

Writable profile fields:

- `goal`
- `age_band`
- `current_estimate`
- `preferred_daily_minutes`
- `preferred_days`
- `timezone`

Validation includes:

- supported preferred-day identifiers
- valid IANA timezone
- daily-minute bounds

Cross-user profile access is not permitted.

### Teacher profile

#### `GET /api/profiles/teacher/`

Returns the authenticated teacher's own profile.

Learner accounts cannot use the teacher profile endpoint.

#### `PATCH /api/profiles/teacher/`

Writable profile fields:

- `public_name`
- `bio`
- `experience_years`
- `specialties`
- `city`
- `languages`
- `availability_intent`
- `verification_intent`

Important authorization rule:

`verification_intent` is only an intent flag. It does not set:

- `is_teacher_verified`
- `marketplace_eligible`
- `paid_class_eligible`

### Onboarding

#### `GET /api/profiles/onboarding/`

Returns the current authenticated user's onboarding progress.

#### `PATCH /api/profiles/onboarding/`

Persists resumable onboarding state.

Fields include:

- `current_step`
- `completed_steps`
- `draft_data`

Security rules:

- onboarding draft storage is size-limited
- sensitive-key patterns such as passwords, OTPs, tokens, secrets, API keys, identity documents and bank-account data are rejected

#### `POST /api/profiles/onboarding/complete/`

Marks onboarding complete only after required profile information and required consent records exist.

Learner and teacher completion remain role-specific.

Teacher completion does not elevate teacher capabilities.

### Data export

#### `GET /api/profiles/data-exports/`

Returns the authenticated user's data-export requests.

#### `POST /api/profiles/data-exports/`

Creates a data-export request.

Idempotency rule:

- if the same user already has a pending or processing export request, Day 08 reuses that active request rather than creating duplicate work

Day 08 implements request tracking only; export generation/download delivery remains future work.

### Account Summary

#### `GET /api/profiles/account-summary/`

Aggregates the information required by the Day 08 Account hub.

Response groups:

- `account`
- `profile`
- `profile_completeness`
- `onboarding`
- `session`
- `data_controls`
- `account_sections`

`account.capabilities` exposes:

- `teacher_verified`
- `marketplace_eligible`
- `paid_class_eligible`

`account_sections` reports runtime/foundation state for:

- Library
- Usage
- Plan
- Billing
- Profile
- Sessions
- Data Controls

### Browser proxy contract

The Next.js development server proxies Django API traffic on the same browser origin.

Django API routes use trailing slashes. The Next.js rewrite preserves those trailing slashes so Django `APPEND_SLASH` behavior cannot create a redirect loop.

### Day 08 contract verification

Verified locally:

- registration through browser -> API -> database
- login through browser -> authenticated Django session
- password reset
- learner role isolation
- teacher role isolation
- cross-user profile isolation
- learner onboarding save/resume
- teacher onboarding without privilege escalation
- profile/settings persistence
- current-session retrieval
- data-export request creation
- account-summary aggregation
