# Endoora Roadmap Progress

| Day | Title | Status | Gate |
|---|---|---|---|
| 01 | Freeze scope, brand, domain, product constitution | Implementation complete | Founder-only private IRNIC verification remains |
| 02 | Monorepo and reproducible local environment | Complete | Automation, live dependencies, and health verified; clean-clone procedure retained |
| 03 | Bilingual design-token and brand system | Complete | Persian-first RTL foundation preserved |
| 04 | Accessible component library | Complete | Shared accessible UI foundation preserved |
| 05 | Information architecture, Account hub, critical flows | Implementation complete | Five-person hallway-test evidence remains pending and is not simulated |
| 06 | Public website shell and SEO foundation | Complete | Public shell/routes exist in current production build |
| 07 | Authentication, roles, permissions, consent, OTP, deletion foundation | Complete | Security/role foundation active |
| 08 | Registration, login, onboarding, profile and Account UX | Complete | Account/onboarding acceptance passed |
| 09 | Learner application shell and simplified navigation | Complete | Learner next-action shell, aggregated API, responsive QA and acceptance passed |
| 10 | Teacher application shell and simplified navigation | Complete | Teacher urgency shell, capability gating, responsive browser QA, and local acceptance passed |
| 11 | Django admin, audit logs, and safe settings | Complete | Operations acceptance passed |
| 12 | CEFR skill and content taxonomy | Complete | Taxonomy acceptance and hardening passed; pushed in `6a496b5` |
| 13-60 | Remaining roadmap | Not started | Sequential |

## Day 08 deliverables

### Authentication

- [x] Persian-first registration page
- [x] English language option
- [x] Learner/teacher role selection
- [x] Explicit Terms consent
- [x] Explicit Privacy consent
- [x] Login page
- [x] Password-reset request page
- [x] Password-reset confirmation flow
- [x] End-to-end browser registration
- [x] End-to-end browser login
- [x] End-to-end password reset

### Learner onboarding

- [x] Goal
- [x] Age band
- [x] Current level estimate
- [x] Preferred daily minutes
- [x] Preferred learning days
- [x] Timezone
- [x] Save and continue later
- [x] Debounced server autosave while editing
- [x] Server-side refresh/resume persistence
- [x] Profile completeness
- [x] Completion state

### Teacher onboarding

- [x] Public name
- [x] Bio
- [x] Experience
- [x] Specialties
- [x] City
- [x] Languages
- [x] Availability intent
- [x] Verification intent
- [x] Save/resume
- [x] Profile completeness
- [x] Completion state
- [x] Verification intent does not grant verified-teacher capability
- [x] Verification intent does not grant marketplace capability
- [x] Verification intent does not grant paid-class capability

### Profile / Account hub

- [x] `/account`
- [x] `/account/profile`
- [x] `/account/sessions`
- [x] `/account/data-controls`
- [x] `/account/library`
- [x] `/account/usage`
- [x] `/account/plan`
- [x] `/account/billing`
- [x] Profile completeness
- [x] Interface-language persistence
- [x] Locale persistence from every authenticated Day 08 surface
- [x] Learner profile editing
- [x] Teacher profile editing
- [x] Current-session view
- [x] Data-export request
- [x] Export request persistence
- [x] Guarded account-deletion entry point
- [x] Current Terms and Privacy versions required for onboarding completion

### Automated verification

- [x] `python manage.py check`
- [x] focused `accounts` + `profiles` backend tests
- [x] `python manage.py makemigrations --check --dry-run`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run check:day08`

### Manual acceptance

- [x] learner onboarding refresh persistence
- [x] teacher privilege separation
- [x] profile edit survives refresh
- [x] preferred locale survives refresh
- [x] sessions page works
- [x] data-export request survives refresh
- [x] deletion action requires exact `DELETE`
- [x] all Account hub routes reachable
- [x] 360 px responsive smoke test
- [x] keyboard navigation smoke test

### Final repository gate

- [x] synchronize remaining Day 08 documentation
- [x] secret scanner unit tests
- [x] secret scan
- [x] `git diff --check`
- [x] review `git status`
- [x] Day 08 history is present in the repository before the later Day 09–13 work

Day 08 is complete and its foundations remain covered by current regression checks.

## Day 09 — Learner application shell

Status: complete; automated and browser acceptance passed locally.

Success gate: a learner can answer “What should I do now?” within five seconds, using one aggregated endpoint, with clear 360 px mobile hierarchy and no unsupported scores.

### Deliverables

- [x] protected learner layout without the public marketing shell
- [x] Persian-first RTL and English LTR interface
- [x] persistent account language preference
- [x] exactly five simplified learner navigation destinations
- [x] one dominant Today action above the fold
- [x] first-time Placement guidance
- [x] path workflow preview without fabricated percentages
- [x] evidence-backed skill snapshot
- [x] real Daily Mission, Placement and SRS aggregation
- [x] honest assignment, class, course, XP/streak and notification states
- [x] offline, loading, authentication, permission, error and retry states
- [x] dashboard-view and primary-CTA instrumentation
- [x] purpose-built placement illustration
- [x] Day 09 static contract checker

Detailed evidence is recorded in `docs/operations/DAY_09_ACCEPTANCE_GATE.md`.

## Day 10 — Teacher application shell

### Deliverables

- [x] protected teacher layout
- [x] Persian-first RTL teacher UI
- [x] English interface switch
- [x] five teacher destinations: Home, Teach, Marketplace, Resources, Account
- [x] teacher dashboard aggregated API
- [x] verified/unverified capability separation
- [x] verification-first urgency resolver
- [x] safe class/student/request/grading/schedule/earnings summaries
- [x] question-bank foundation shortcut
- [x] fixed-class foundation shortcut
- [x] privacy redaction rules
- [x] bounded domain-query regression test
- [x] Day 09 dashboard registration repair

### Automated verification

- [x] `python manage.py check`
- [x] `python manage.py test teachers`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `node scripts/check-day10.mjs`
- [x] secret scan
- [x] `git diff --check`

### Acceptance / repository gate

- [x] teacher shell reported working locally
- [x] no Day 10 migration required
- [x] no fabricated future-domain counts or earnings
- [x] backend permission/privacy tests cover 401/403 and sensitive-key redaction
- [x] final `git status` reviewed before staging
- [x] Day 10 acceptance evidence recorded in `docs/operations/DAY_10_ACCEPTANCE_GATE.md`
- [x] 1440 px and 360 px browser journeys verified with no console errors or horizontal overflow

**Success gate:** the teacher can identify the most urgent next action immediately, while unverified capabilities stay locked and dashboard summaries do not expose raw learner evidence.

**Sequential successor:** Day 11 — Configure Django admin, audit logs, and safe settings (already implemented and inherited by later days).

## Day 11 — Configure Django admin, audit logs, and safe settings
Status: complete and inherited by Day 12.

## Day 12 — CEFR skill and content taxonomy

Status: complete; taxonomy acceptance and hardening pushed in `6a496b5`.

- [x] verified pre-Day-12 PostgreSQL backup
- [x] `taxonomy.0001_initial` applied
- [x] 62 nodes / 62 revisions / 9 active prerequisites
- [x] idempotent second import
- [x] taxonomy tests — 12 PASS
- [x] full backend suite — 108 PASS in the current regression suite
- [x] migration drift check
- [x] Persian-default API
- [x] English API option
- [x] Django admin protection
- [x] frontend lint/typecheck/build
- [x] 360 px + desktop
- [x] Persian RTL + English LTR
- [x] secret scan
- [x] `git diff --check`

**Success gate:** a content editor can select a stable objective ID while Persian/English wording can evolve without changing that identifier.

**Next day after Git push:** Day 13 — Build the versioned question bank schema.

## Day 13 implementation checkpoint

Status: implementation applied; acceptance pending.

Success gate: question bank supports placement and teacher assignment without duplicating content, while published versions stay immutable and learner pre-submission payloads contain no answer keys.

## Day 13 — Build the versioned question bank schema

Status: local acceptance complete; final Git push remains.

- [x] verified pre-Day-13 PostgreSQL backup
- [x] `questions.0001_initial`
- [x] nine question types
- [x] immutable published/retired versions
- [x] source/license/reviewer publication gate
- [x] stable taxonomy objective links
- [x] safe answer normalization
- [x] learner answer-key redaction
- [x] support/editor permission boundary
- [x] draft-only idempotent JSON import
- [x] Persian-first RTL + English option
- [x] 360 px + desktop
- [x] backend/frontend regression
- [x] secret scan + diff gate

**Success gate:** question bank supports placement and teacher assignment without duplicating content.

**Next day after Git push:** Day 14 — Build the multi-stage placement-test session engine.
