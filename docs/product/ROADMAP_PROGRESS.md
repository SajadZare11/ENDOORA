# Endoora Roadmap Progress

| Day | Title | Status | Gate |
|---|---|---|---|
| 01 | Freeze scope, brand, domain, product constitution | Complete | Foundation recorded |
| 02 | Monorepo and reproducible local environment | Complete | Local environment established |
| 03 | Bilingual design-token and brand system | Complete | Persian-first RTL foundation preserved |
| 04 | Accessible component library | Complete | Shared accessible UI foundation preserved |
| 05 | Information architecture, Account hub, critical flows | Implementation complete | Historical human hallway-test evidence is not reconstructed if it was not recorded |
| 06 | Public website shell and SEO foundation | Complete | Public shell/routes exist in current production build |
| 07 | Authentication, roles, permissions, consent, OTP, deletion foundation | Complete | Security/role foundation active |
| 08 | Registration, login, onboarding, profile and Account UX | Complete | Account/onboarding acceptance passed |
| 09 | Learner application shell and simplified navigation | Complete | Learner next-action shell and aggregated API implemented |
| 10 | Teacher application shell and simplified navigation | Complete* | Automated/local acceptance passed; final Day 10 checkpoint is this commit/push |
| 11-60 | Remaining roadmap | Not started | Sequential |

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
- [x] Learner profile editing
- [x] Teacher profile editing
- [x] Current-session view
- [x] Data-export request
- [x] Export request persistence
- [x] Guarded account-deletion entry point

### Automated verification

- [x] `python manage.py check`
- [x] `python manage.py test` — 41 tests PASS
- [x] `python manage.py makemigrations --check --dry-run`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

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

- [ ] synchronize remaining Day 08 documentation
- [ ] secret scanner unit tests
- [ ] secret scan
- [ ] `git diff --check`
- [ ] review `git status`
- [ ] commit Day 08
- [ ] push Day 08 to `origin/main`
Day 08 complete. Day 09 may begin after this final documentation record is committed and pushed.
-

## Day 09 — Learner application shell

Status: complete only after the Day 09 automated and manual acceptance gate has passed.

Success gate: a learner can answer “What should I do now?” within five seconds, using one aggregated endpoint, with clear 360 px mobile hierarchy and no unsupported scores.

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
- [x] Day 10 documentation prepared for the final checkpoint
- [x] final commit/push commands documented

`*` Day 10 is only operationally complete after the final commit is pushed successfully and the working tree is clean.

**Success gate:** the teacher can identify the most urgent next action immediately, while unverified capabilities stay locked and dashboard summaries do not expose raw learner evidence.

**Next day after Git push:** Day 11 — Configure Django admin, audit logs, and safe settings.

## Day 11 — Configure Django admin, audit logs, and safe settings
Status: implementation staged; acceptance gate pending.
Required before completion: database backup, migrations, Django/static/regression tests, admin/support manual checks, secret scan, Git checkpoint.
