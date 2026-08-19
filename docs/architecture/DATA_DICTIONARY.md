# Endoora Data Dictionary — Day 01 Baseline

No physical database schema exists yet. This file records planned high-level data domains.

| Domain | Planned examples | Sensitivity |
|---|---|---|
| accounts | user, role, capability, session, consent | High |
| profiles | learner/teacher profile, verification state | High/Very High |
| taxonomy | skill, objective, CEFR descriptor, tags | Low/Medium |
| placement | session, answer, score evidence, report | High |
| learner_twin | estimates, snapshots, approved evidence links | High |
| mistake_genome | mistake events/patterns/disputes | High |
| learning_paths | paths, milestones, priorities | High |
| missions | daily tasks/completion | High |
| srs | vocabulary cards/reviews/schedule | High |
| writing | drafts, feedback, revisions | Very High |
| conversations | messages/summaries/consent | Very High |
| speech | audio metadata/transcripts/retention | Very High |
| teachers/classes | relationships/classes/sessions | High |
| assignments | assignment/submission/grade | Very High |
| marketplace | requests/offers/bookings/reviews | High |
| payments | orders/attempts/authority/verification/refunds | Very High |
| subscriptions | plan/price/entitlement | High |
| ledgers | XP/financial immutable entries | Very High |
| support | tickets/recovery/escalation | Very High |
| audit | privileged action events | Very High |
| analytics | privacy-aware event metadata | Medium |

Field-level schema is added only when each domain is implemented.

## Day 08 — Implemented profile/onboarding data

Day 08 adds the first physical `profiles` domain schema.

### `profiles.LearnerProfile`

Sensitivity: **High**

Purpose:

Stores personalization inputs required for the learner's initial Endoora experience.

Fields:

- `id` — UUID primary key
- `user` — one-to-one account relationship
- `goal` — learner goal choice
- `age_band` — coarse age range, not exact date of birth
- `current_estimate` — learner-provided CEFR estimate or unknown
- `preferred_daily_minutes` — intended daily study duration
- `preferred_days` — JSON list of selected weekday identifiers
- `timezone` — IANA timezone; Persian-first default workflow uses `Asia/Tehran`
- `created_at`
- `updated_at`

Derived property:

- `completeness_percent`

Data-minimization note:

Day 08 stores an age band rather than an unnecessary exact birth date.

### `profiles.TeacherProfile`

Sensitivity: **High**

Purpose:

Stores the teacher's initial professional profile and verification intent.

Fields:

- `id` — UUID primary key
- `user` — one-to-one account relationship
- `public_name`
- `bio`
- `experience_years`
- `specialties` — JSON list
- `city`
- `languages` — JSON list
- `availability_intent`
- `verification_intent`
- `created_at`
- `updated_at`

Derived property:

- `completeness_percent`

Authorization note:

`verification_intent` is not verification state and must never be interpreted as authorization for marketplace or paid classes.

### `profiles.OnboardingProgress`

Sensitivity: **High**

Purpose:

Provides server-side resumable learner/teacher onboarding.

Fields:

- `id` — UUID primary key
- `user` — one-to-one account relationship
- `role`
- `stage`
- `current_step`
- `completed_steps` — JSON list
- `draft_data` — bounded JSON object for non-sensitive resumable workflow state
- `completed_at`
- `created_at`
- `updated_at`

Derived property:

- `is_completed`

Security restriction:

`draft_data` must not be used as general secret storage.

Day 08 validation rejects sensitive key patterns including:

- password
- passcode
- OTP
- token
- secret
- API key
- merchant identifier
- identity document
- national identifier
- bank account

### `profiles.DataExportRequest`

Sensitivity: **High**

Purpose:

Tracks a user's request for an export of their Endoora data.

Fields:

- `id` — UUID primary key
- `user` — account foreign key
- `status`
- `requested_at`
- `started_at`
- `completed_at`
- `failure_code`

Supported lifecycle foundation includes:

- pending
- processing
- completed
- failed
- cancelled

Day 08 does not yet store generated export files.

### Existing `accounts` domain reused by Day 08

Day 08 intentionally reuses the existing authentication/privacy foundation rather than creating duplicate models.

Relevant existing records include:

- custom `accounts.User`
- consent records
- one-time codes
- account-deletion requests
- authenticated Django session state

### Day 08 data ownership rules

- learner profile belongs to exactly one learner account
- teacher profile belongs to exactly one teacher account
- onboarding progress belongs to exactly one account
- export requests belong to the requesting account
- unrelated users must not access another user's profile/onboarding/export data
- teacher role is separate from verified-teacher capability

### Retention / future work

Day 08 establishes request-state models but does not invent final legal retention periods.

Later governance work must define:

- completed export retention
- failed export retention
- deletion execution and grace-period policy
- audit retention
- teacher verification-document retention if verification documents are introduced
- 