# Endoora Project State

## Current checkpoint
- **Roadmap day completed:** Day 30 — Skills Hub, Lesson CMS, Courses, Culture, School, and Paywall Content
- **Day 30 status:** Complete and verified; ready for Git commit and push to `origin/main`
- **Inherited state:** Days 01–29 remain in place, including Persian-first RTL/English-LTR foundations, Endoora Operations, stable CEFR taxonomy, versioned question bank, placement session engine, 6 placement sections, adaptive daily missions, SRS vocabulary engine, structured AI exercise generation, AI Mistake Genome, Writing Mentor v1, Roleplay Universe v1, Voice Lab v1 / Voice Roleplay Beta, Pronunciation Lab v1, Gamification Engine v1, and Social Badges/Leaderboards
- **Schema version:** Day 30 adds `content.0001_initial` and `courses.0001_initial`
- **Frontend/UI package version:** `0.4.0`
- **Backend:** Django 5.2.17 / Django REST Framework 3.18.0
- **Frontend:** Next.js 16.3.1 / React 19
- **Canonical domain:** https://endoora.ir
- **Default display timezone:** Asia/Tehran
- **Default product locale:** Persian (`fa`) / RTL
- **Optional product locale:** English (`en`) / LTR

## Features working through Day 16

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

## Day 12 — CEFR skill and content taxonomy (complete and inherited by Day 13)

- Added stable UUID/slug taxonomy nodes for skills, subskills, objectives, grammar/vocabulary topics, age tags, and exam tags.
- Persian labels are the default user-facing taxonomy representation; English labels remain available as an explicit option.
- Added release/import history, node revisions, deprecation traceability, prerequisite history, and cycle validation.
- Added versioned seed data and an idempotent `import_taxonomy` command.
- Added read-only public lookup API foundation at `/api/taxonomy/`.
- Added Django admin taxonomy browsing/editing with stable-slug and delete protections.
- Added interactive frontend Taxonomy & Curriculum Explorer at `/operations/taxonomy` and `/content/taxonomy` with live search, skill/CEFR/kind filters, prerequisite inspection, and one-click UUID/slug copying for content creators.
- Polished public website copy and learner dashboard: removed leaked development roadmap day numbers from public marketing and consent banners, replacing them with professional, learner-centric Persian/English copy while preserving all Day 04-09 static invariants.
- Added SQLite in-memory test fallback in `apps/api/endoora_api/settings/test.py` to ensure reliable offline regression testing across all 108 backend tests.
- Day 12 local acceptance passed: verified backup, migration, idempotent import, backend tests, Persian/English API checks, admin checks, frontend regression, 360 px/desktop review, secret scan, and diff check.
- Day 12 hardening fixed deprecated-node detail leakage, enforced model-level prerequisite cycle checks, and made taxonomy revisions immutable.

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
- `python manage.py test taxonomy` — PASS, 12 tests
- `python manage.py test` — PASS, 108 tests in the current regression suite
- `python scripts/check_day12.py` — PASS
- Day 12 hardening commit `6a496b5` (`Day 12: Harden taxonomy visibility and history`) pushed to `origin/main`.
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

## Day 13 — Versioned question bank schema (complete and verified)

- Added stable `Question` identities and immutable `QuestionVersion` records.
- Added nine question types, answer normalization, rubrics, media metadata, review events, licensing, and Day 12 objective links.
- Hardened `PROTECTED_LEARNER_KEYS` to proactively block `correct_option`, `correct_options`, `pairs`, `order`, `solution`, and `explanation` within learner payloads.
- Hardened standalone `QuestionObjectiveAdmin` and `QuestionMediaAdmin` with explicit delete and mutation guards for published/retired versions.
- Added Persian-first interactive question bank preview with English toggle, CEFR and question-type filtering, and live answer checking with immediate feedback and explanation at `/content/questions`.
- Added serializer split so protected answer data is strictly absent before submission.
- Added draft-only idempotent JSON import and protected export.
- Polished public classes marketing copy, teacher resources guidance, and teacher question bank roadmap notices across the web application.
- Applied database migration `questions.0001_initial`.
- Day 13 local acceptance passed: verified backup, migration, focused/full tests, network answer-key inspection, mobile/desktop bilingual review, secret scan, and Git checkpoint.

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

## Day 14 — Placement session engine (complete and verified)

- Built resumable multi-stage placement test session engine (`PlacementSession`, `PlacementAnswer`).
- Added server-side session expiration handling (`expires_at`, 2 hours default) with `is_expired`, `is_active`, and `check_expiration()`.
- Added server-side idempotency protection using unique `idempotency_key` and server timestamps to prevent duplicate rows.
- Linked placement answers to versioned content via optional `question_version` foreign key (`question_version_id`).
- Strictly enforced object-level user ownership: only session owner can view or submit answers (`user=request.user` query scoping returning 404 for other users).
- Enforced session lifecycle: rejected answer mutations on expired or already-submitted sessions.
- Enforced anti-leak security boundaries: placement question and session serializers strictly exclude `answer_key`, `accepted_variants`, `rubric`, `correct_option`, `solution`, and explanations.
- Created Persian-first interactive `PlacementRunner` component with English language toggle, isolated LTR English passages, mobile 360 px responsiveness, design-token styling, and zero raw hex colors.
- Replaced leaked roadmap copy in marketing and documentation with professional production copy.
- Applied migration `placement.0002_alter_placementanswer_options_and_more`.
- Verified pre-Day-14 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`.

## Day 14 verification evidence

### Backend & placement engine
- Pre-Day-14 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`
- `placement.0002_alter_placementanswer_options_and_more` applied successfully
- `python manage.py check` — PASS
- `python manage.py test placement` — PASS (13/13 tests)
- `python manage.py test` — PASS (121/121 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS
- Pre-submission learner payload contains no answer keys/accepted variants/rubrics/explanations
- User isolation & object-level permissions — PASS
- Expiration and submit mutation protections — PASS
- `python scripts/check_day14.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### Frontend / manual
- Persian-first RTL placement test with English toggle — PASS
- English learning passages and options isolated as LTR — PASS
- Idempotent answer saving with server timestamps — PASS
- Session resume upon page reload — PASS
- Offline network recovery notice without losing answers — PASS
- Responsive layout at 360 px without horizontal overflow — PASS
- Zero raw hex colors in placement stylesheets — PASS

## Day 15 — Grammar, vocabulary, and reading placement sections (complete and verified)

- Calibrated 11 core placement items across Grammar (4), Vocabulary (4), and Reading (3 with passages) in `data/placement/core-items.json`.
- Kept `difficulty` (`easy`, `medium`, `hard`) strictly separated from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Implemented honest assessment scoring in `apps/api/assessment/services.py`: `calculate_section_result` and `evaluate_placement_answers` compute empirical scores, correct item counts, total counts, and standard educational disclaimers.
- Strictly adhered to Product Constitution Rule #8: avoided premature or official CEFR claims before full multi-stage assessment is completed.
- Linked placement submissions to `PlacementResponse` in the `assessment` app for permanent audit trail and profile linkage.
- Added session summary API endpoint `GET /api/placement/sessions/<id>/summary/` strictly scoped to `request.user`.
- Added section filtering (`?section=grammar|vocabulary|reading`) to question API with pre-submission sanitization (no leaked answer keys or explanations).
- Upgraded frontend `PlacementRunner` with multi-stage section navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب), Persian prompts, and live autosave badge.
- Redesigned `/placement/report` into a responsive, live-connected skill report page with honest assessment disclosures and dashboard navigation.
- Polished all learner subpages (`/progress`, `/review`, `/mistakes`, `/badges`, `/twin`, `/practice-ai`, `/writing`, `/roleplay`, `/voice`, `/listening`, `/pronunciation`) with full `.learner-card` layouts, tokenized styling, and accessible Persian-first UI.
- Maintained verified pre-Day-15 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`.

## Day 15 verification evidence

### Backend & scoring services
- Pre-Day-15 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`
- `seed_placement_sections` command verified: 11 items across 3 sections seeded cleanly
- `python manage.py test assessment` — PASS (5/5 unit tests)
- `python manage.py test placement` — PASS (16/16 unit tests)
- `python manage.py test` — PASS (129/129 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (no schema drift)
- Learner pre-submission payloads contain no answer keys, solutions, rubrics, or explanations — PASS
- Session summary API strictly scoped to session owner (User B gets 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day15.py` — PASS
- `python scripts/check_day15.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 16 — Listening placement section with audio player and waveform (complete and verified)

- Calibrated 15 core placement items including 4 Listening items (A1 gist, A2 detail, B1 inference, B2 academic talk) in `data/placement/core-items.json`.
- Generated 4 standard PCM WAV audio assets in `apps/web/public/audio/placement/` providing native in-browser audio playback without external dependencies.
- Kept `difficulty` (`easy`, `medium`, `hard`) strictly separated from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Stored audio transcripts server-side only; learner pre-submission payloads never leak transcripts, answer keys, solutions, or rubrics.
- Updated assessment scoring services in `apps/api/assessment/services.py` to evaluate the `listening` section, producing empirical scores, objectives, and honest assessment disclaimers.
- Updated `seed_placement_sections` command to validate all 15 placement items across grammar, vocabulary, reading, and listening.
- Built accessible `AudioWaveformPlayer` component with 32-bar interactive visual waveform scrubber, play limit enforcement (default 2 plays), playback speed switching (0.8x, 1.0x, 1.2x), time readouts, and volume controls.
- Used 100% tokenized CSS (`audio-player.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 4-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری) and rendered `AudioWaveformPlayer` for listening items.
- Upgraded `/placement/report` to display verified listening scores, answered counts, and objectives.
- Upgraded `/listening` into an interactive Listening Lab preview with an embedded sample player and dimension explorer.
- Upgraded `/placement/listening-ready` with direct navigation to the placement test and listening lab.
- Maintained verified pre-Day-16 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`.

## Day 16 verification evidence

### Backend & scoring services
- Pre-Day-16 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`
- `seed_placement_sections` command verified: 15 items across 4 sections validated cleanly
- `python manage.py test assessment` — PASS (6/6 unit tests)
- `python manage.py test placement` — PASS (16/16 unit tests)
- `python manage.py test` — PASS (130/130 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- Learner pre-submission payloads contain no audio transcripts, answer keys, solutions, or rubrics — PASS
- Session summary API strictly scoped to session owner (User B receives 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day16.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 17 — Speaking placement section with audio recording and STT diagnostic (complete and verified)

- Calibrated 19 core placement items including 4 Speaking items (A1 self intro, A2 daily routine, B1 memorable experience, B2 remote work opinion) in `data/placement/core-items.json`.
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept speaking target keywords and evaluation rubrics isolated server-side; learner pre-submission payloads never leak evaluation rubrics, target keywords, or model answers.
- Implemented speaking diagnostic evaluation service in `apps/api/assessment/services.py` analyzing word count, length sufficiency, and topical vocabulary coverage.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 5 sections: Grammar, Vocabulary, Reading, Listening, Speaking).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 19 placement items across all 5 sections.
- Built accessible `AudioRecorder` component with start/stop/re-record controls, sound level meter, recording timer (60-90s auto-stop), audio playback preview, and real-time Speech-to-Text (STT) transcript preview.
- Built accessible text fallback input for learners without microphone hardware or browser permissions.
- Used 100% tokenized CSS (`audio-recorder.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 5-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری, 5. گفتاری) and rendered `AudioRecorder` for speaking questions.
- Upgraded `/placement/report` to display all 5 skill cards, verified speaking scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/voice` into an interactive Voice & Speaking Lab sandbox with live microphone testing, STT preview, and direct placement test links.
- Upgraded `/pronunciation` with direct navigation to the voice sandbox and speaking placement test.
- Maintained verified pre-Day-17 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`.

## Day 17 verification evidence

### Backend & scoring services
- Pre-Day-17 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`
- `seed_placement_sections` command verified: 19 items across 5 sections validated cleanly
- `python manage.py test assessment` — PASS (8/8 unit tests)
- `python manage.py test placement` — PASS (18/18 unit tests)
- `python manage.py test` — PASS (133/133 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- Learner pre-submission payloads contain no target keywords, rubrics, answer keys, solutions, or transcripts — PASS
- Session summary API strictly scoped to session owner (User B receives 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day17.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 18 — Implement writing placement section with rich text editor and automated evaluation (complete and verified)

- Calibrated 23 core placement items including 4 Writing items (A1 postcard email, A2 everyday event, B1 opinion essay, B2 workplace report) in `data/placement/core-items.json`.
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept writing evaluation rubrics and target keywords isolated server-side; learner pre-submission payloads never leak evaluation rubrics, target keywords, or model answers while exposing safe `min_words_expected` and `max_words_expected`.
- Implemented writing automated evaluation service in `apps/api/assessment/services.py` analyzing word count, length sufficiency, topical vocabulary coverage, sentence structure, and vocabulary diversity.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 6 sections: Grammar, Vocabulary, Reading, Listening, Speaking, Writing).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 23 placement items across all 6 sections.
- Built accessible `WritingEditor` component with formatting toolbar (Bold, Italic, Bulleted List, Numbered List, Clear), word/character/sentence counters, progress meter toward minimum words, and autosave.
- Used 100% tokenized CSS (`writing-editor.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 6-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری, 5. گفتاری, 6. نگارش) and rendered `WritingEditor` for writing questions.
- Upgraded `/placement/report` to display all 6 skill cards, verified writing scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/writing` into an interactive Writing Mentor & Essay Lab sandbox with embedded rich editor, CEFR prompt presets (A1-B2), live diagnostic feedback, and direct placement test links.
- Maintained verified pre-Day-18 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`.

## Day 18 verification evidence

### Backend & scoring services
- Pre-Day-18 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`
- `seed_placement_sections` command verified: 23 items across 6 sections validated cleanly
- `python manage.py test assessment` — PASS (10/10 unit tests)
- `git diff --check` — PASS

### Frontend/manual
- Persian-first RTL question preview — PASS
- English interface option — PASS
- English learning content isolated LTR — PASS
- 360 px and desktop — PASS
- loading/empty/error/retry/permission states — PASS
- publish -> learner-safe preview -> submit -> explanation -> retire journey — PASS

## Day 14 — Placement session engine (complete and verified)

- Built resumable multi-stage placement test session engine (`PlacementSession`, `PlacementAnswer`).
- Added server-side session expiration handling (`expires_at`, 2 hours default) with `is_expired`, `is_active`, and `check_expiration()`.
- Added server-side idempotency protection using unique `idempotency_key` and server timestamps to prevent duplicate rows.
- Linked placement answers to versioned content via optional `question_version` foreign key (`question_version_id`).
- Strictly enforced object-level user ownership: only session owner can view or submit answers (`user=request.user` query scoping returning 404 for other users).
- Enforced session lifecycle: rejected answer mutations on expired or already-submitted sessions.
- Enforced anti-leak security boundaries: placement question and session serializers strictly exclude `answer_key`, `accepted_variants`, `rubric`, `correct_option`, `solution`, and explanations.
- Created Persian-first interactive `PlacementRunner` component with English language toggle, isolated LTR English passages, mobile 360 px responsiveness, design-token styling, and zero raw hex colors.
- Replaced leaked roadmap copy in marketing and documentation with professional production copy.
- Applied migration `placement.0002_alter_placementanswer_options_and_more`.
- Verified pre-Day-14 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`.

## Day 14 verification evidence

### Backend & placement engine
- Pre-Day-14 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`
- `placement.0002_alter_placementanswer_options_and_more` applied successfully
- `python manage.py check` — PASS
- `python manage.py test placement` — PASS (13/13 tests)
- `python manage.py test` — PASS (121/121 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS
- Pre-submission learner payload contains no answer keys/accepted variants/rubrics/explanations
- User isolation & object-level permissions — PASS
- Expiration and submit mutation protections — PASS
- `python scripts/check_day14.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

### Frontend / manual
- Persian-first RTL placement test with English toggle — PASS
- English learning passages and options isolated as LTR — PASS
- Idempotent answer saving with server timestamps — PASS
- Session resume upon page reload — PASS
- Offline network recovery notice without losing answers — PASS
- Responsive layout at 360 px without horizontal overflow — PASS
- Zero raw hex colors in placement stylesheets — PASS

## Day 15 — Grammar, vocabulary, and reading placement sections (complete and verified)

- Calibrated 11 core placement items across Grammar (4), Vocabulary (4), and Reading (3 with passages) in `data/placement/core-items.json`.
- Kept `difficulty` (`easy`, `medium`, `hard`) strictly separated from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Implemented honest assessment scoring in `apps/api/assessment/services.py`: `calculate_section_result` and `evaluate_placement_answers` compute empirical scores, correct item counts, total counts, and standard educational disclaimers.
- Strictly adhered to Product Constitution Rule #8: avoided premature or official CEFR claims before full multi-stage assessment is completed.
- Linked placement submissions to `PlacementResponse` in the `assessment` app for permanent audit trail and profile linkage.
- Added session summary API endpoint `GET /api/placement/sessions/<id>/summary/` strictly scoped to `request.user`.
- Added section filtering (`?section=grammar|vocabulary|reading`) to question API with pre-submission sanitization (no leaked answer keys or explanations).
- Upgraded frontend `PlacementRunner` with multi-stage section navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب), Persian prompts, and live autosave badge.
- Redesigned `/placement/report` into a responsive, live-connected skill report page with honest assessment disclosures and dashboard navigation.
- Polished all learner subpages (`/progress`, `/review`, `/mistakes`, `/badges`, `/twin`, `/practice-ai`, `/writing`, `/roleplay`, `/voice`, `/listening`, `/pronunciation`) with full `.learner-card` layouts, tokenized styling, and accessible Persian-first UI.
- Maintained verified pre-Day-15 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`.

## Day 15 verification evidence

### Backend & scoring services
- Pre-Day-15 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`
- `seed_placement_sections` command verified: 11 items across 3 sections seeded cleanly
- `python manage.py test assessment` — PASS (5/5 unit tests)
- `python manage.py test placement` — PASS (16/16 unit tests)
- `python manage.py test` — PASS (129/129 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (no schema drift)
- Learner pre-submission payloads contain no answer keys, solutions, rubrics, or explanations — PASS
- Session summary API strictly scoped to session owner (User B gets 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day15.py` — PASS
- `python scripts/check_day15.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 16 — Listening placement section with audio player and waveform (complete and verified)

- Calibrated 15 core placement items including 4 Listening items (A1 gist, A2 detail, B1 inference, B2 academic talk) in `data/placement/core-items.json`.
- Generated 4 standard PCM WAV audio assets in `apps/web/public/audio/placement/` providing native in-browser audio playback without external dependencies.
- Kept `difficulty` (`easy`, `medium`, `hard`) strictly separated from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Stored audio transcripts server-side only; learner pre-submission payloads never leak transcripts, answer keys, solutions, or rubrics.
- Updated assessment scoring services in `apps/api/assessment/services.py` to evaluate the `listening` section, producing empirical scores, objectives, and honest assessment disclaimers.
- Updated `seed_placement_sections` command to validate all 15 placement items across grammar, vocabulary, reading, and listening.
- Built accessible `AudioWaveformPlayer` component with 32-bar interactive visual waveform scrubber, play limit enforcement (default 2 plays), playback speed switching (0.8x, 1.0x, 1.2x), time readouts, and volume controls.
- Used 100% tokenized CSS (`audio-player.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 4-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری) and rendered `AudioWaveformPlayer` for listening items.
- Upgraded `/placement/report` to display verified listening scores, answered counts, and objectives.
- Upgraded `/listening` into an interactive Listening Lab preview with an embedded sample player and dimension explorer.
- Upgraded `/placement/listening-ready` with direct navigation to the placement test and listening lab.
- Maintained verified pre-Day-16 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`.

## Day 16 verification evidence

### Backend & scoring services
- Pre-Day-16 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`
- `seed_placement_sections` command verified: 15 items across 4 sections validated cleanly
- `python manage.py test assessment` — PASS (6/6 unit tests)
- `python manage.py test placement` — PASS (16/16 unit tests)
- `python manage.py test` — PASS (130/130 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- Learner pre-submission payloads contain no audio transcripts, answer keys, solutions, or rubrics — PASS
- Session summary API strictly scoped to session owner (User B receives 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day16.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 17 — Speaking placement section with audio recording and STT diagnostic (complete and verified)

- Calibrated 19 core placement items including 4 Speaking items (A1 self intro, A2 daily routine, B1 memorable experience, B2 remote work opinion) in `data/placement/core-items.json`.
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept speaking target keywords and evaluation rubrics isolated server-side; learner pre-submission payloads never leak evaluation rubrics, target keywords, or model answers.
- Implemented speaking diagnostic evaluation service in `apps/api/assessment/services.py` analyzing word count, length sufficiency, and topical vocabulary coverage.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 5 sections: Grammar, Vocabulary, Reading, Listening, Speaking).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 19 placement items across all 5 sections.
- Built accessible `AudioRecorder` component with start/stop/re-record controls, sound level meter, recording timer (60-90s auto-stop), audio playback preview, and real-time Speech-to-Text (STT) transcript preview.
- Built accessible text fallback input for learners without microphone hardware or browser permissions.
- Used 100% tokenized CSS (`audio-recorder.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 5-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری, 5. گفتاری) and rendered `AudioRecorder` for speaking questions.
- Upgraded `/placement/report` to display all 5 skill cards, verified speaking scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/voice` into an interactive Voice & Speaking Lab sandbox with live microphone testing, STT preview, and direct placement test links.
- Upgraded `/pronunciation` with direct navigation to the voice sandbox and speaking placement test.
- Maintained verified pre-Day-17 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`.

## Day 17 verification evidence

### Backend & scoring services
- Pre-Day-17 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`
- `seed_placement_sections` command verified: 19 items across 5 sections validated cleanly
- `python manage.py test assessment` — PASS (8/8 unit tests)
- `python manage.py test placement` — PASS (18/18 unit tests)
- `python manage.py test` — PASS (133/133 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- Learner pre-submission payloads contain no target keywords, rubrics, answer keys, solutions, or transcripts — PASS
- Session summary API strictly scoped to session owner (User B receives 404) — PASS
- Honest assessment disclaimer returned in all summary responses — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day17.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Day 18 — Implement writing placement section with rich text editor and automated evaluation (complete and verified)

- Calibrated 23 core placement items including 4 Writing items (A1 postcard email, A2 everyday event, B1 opinion essay, B2 workplace report) in `data/placement/core-items.json`.
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept writing evaluation rubrics and target keywords isolated server-side; learner pre-submission payloads never leak evaluation rubrics, target keywords, or model answers while exposing safe `min_words_expected` and `max_words_expected`.
- Implemented writing automated evaluation service in `apps/api/assessment/services.py` analyzing word count, length sufficiency, topical vocabulary coverage, sentence structure, and vocabulary diversity.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 6 sections: Grammar, Vocabulary, Reading, Listening, Speaking, Writing).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 23 placement items across all 6 sections.
- Built accessible `WritingEditor` component with formatting toolbar (Bold, Italic, Bulleted List, Numbered List, Clear), word/character/sentence counters, progress meter toward minimum words, and autosave.
- Used 100% tokenized CSS (`writing-editor.module.css`) with zero raw hex colors and complete logical property support.
- Upgraded `PlacementRunner` with 6-stage navigation pills (1. دستور زبان, 2. واژگان, 3. درک مطلب, 4. شنیداری, 5. گفتاری, 6. نگارش) and rendered `WritingEditor` for writing questions.
- Upgraded `/placement/report` to display all 6 skill cards, verified writing scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/writing` into an interactive Writing Mentor & Essay Lab sandbox with embedded rich editor, CEFR prompt presets (A1-B2), live diagnostic feedback, and direct placement test links.
- Maintained verified pre-Day-18 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`.

## Day 18 verification evidence

### Backend & scoring services
- Pre-Day-18 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`
- `seed_placement_sections` command verified: 23 items across 6 sections validated cleanly
- `python manage.py test assessment` — PASS (10/10 unit tests)
- `python manage.py test placement` — PASS (18/18 unit tests)
- `python manage.py test` — PASS (135/135 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- Learner pre-submission payloads contain no target keywords, rubrics, answer keys, solutions, or model texts — PASS
- Session summary API strictly scoped to session owner (User B receives 404) — PASS
- Honest assessment disclaimer returned in all summary responses citing all 6 sections — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day18.py` — PASS
- `python scripts/scan_secrets.py` — PASS

## Git checkpoint (Day 18)

Commit: `21d9fb3` — `Day 18: Implement writing placement section with rich text editor and automated evaluation`

## Day 19 — Personal Learning Path Engine & Interactive Path Experience (complete and verified)

- Implemented dynamic, evidence-grounded learning path engine in `apps/api/learner_twin/path.py`.
- Connected learning path directly to submitted 6-section placement session (`status="submitted"`), analyzing Grammar, Vocabulary, Reading, Listening, Speaking, and Writing.
- Ranked skills by score ascending to identify priority growth areas, generating tailored pedagogical recommendations and direct practice links (`/writing`, `/voice`, `/review`, `/listening`, `/practice-ai`).
- Derived explainable 5-phase progress timeline with semantic states (`complete`, `current`, `upcoming`, `planned`, `locked`) without fake precision or arbitrary completion percentages.
- Derived dominant next-best action (`next_best_step`, `next_best_step_fa`, `next_best_step_en`, `next_best_step_href`) directing learners to targeted skill practice or daily missions.
- Strictly observed Product Constitution Rule #8: transparent educational estimate disclaimers in both Persian and English with zero premature or certified CEFR claims.
- Extended `LearningPathSerializer` in `apps/api/learner_twin/serializers.py` to validate `placement_completed`, `estimated_cefr_level`, `overall_percentage`, `focus_areas`, `section_scores`, and `timeline`.
- Routed `api/path/` alongside `api/learner-twin/` in `endoora_api/urls.py` and cleaned redundant routes.
- Wrote comprehensive unit and regression tests in `apps/api/learner_twin/tests.py` verifying unplaced onboarding, placed evidence derivation, user isolation, and permissions.
- Upgraded `apps/web/app/(learner)/path/page.tsx` into a professional, responsive, bilingual learner experience supporting unplaced onboarding cards and placed personalized path dashboards.
- Styled with 100% tokenized CSS in `apps/web/app/(learner)/path/path.module.css` with zero raw hex colors and complete logical property support.
- Completed Wireframe 1 flow: `/placement/report` primary CTA navigates directly to `/path` ("ساخت و مشاهده مسیر یادگیری شخصی"), and `/dashboard` path card links directly to `/path`.
- Maintained verified pre-Day-19 backup at `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day19\20260820-190000\endoora-pre-day19.dump`.

## Day 19 verification evidence

### Backend & scoring services
- Pre-Day-19 backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day19\20260820-190000\endoora-pre-day19.dump`
- `python manage.py test learner_twin` — PASS (4/4 unit tests)
- `python manage.py test dashboard` — PASS (7/7 unit tests)
- `python manage.py test` — PASS (140/140 regression tests)
- `python manage.py makemigrations --check --dry-run` — PASS (0 schema drift)
- User isolation verified: User B cannot access or view User A's learning path — PASS
- Product Constitution Rule #8 disclaimers verified in all path payloads — PASS

### Frontend & static gates
- `npm run lint` — PASS (0 errors, 0 warnings)
- `npm run typecheck` — PASS (0 errors)
- `npm run build` — PASS (108/108 static routes generated)
- `node scripts/check-public-site.mjs` — PASS
- `node scripts/check-day10.mjs` — PASS
- `node scripts/check-day01-10.mjs` — PASS
- `node scripts/check-components.mjs` — PASS
- `node scripts/check-design-tokens.mjs` — PASS
- `python scripts/check_day19.py` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS

## Day 20: Adaptive Daily Mission Engine & Wireframe 2 Interactive Experience (2026-08-21)

### Daily Mission Engine & Architecture
- Implemented `DailyMission` helper methods in `apps/api/missions/models.py` (`get_tasks`, `get_target_skill`, `get_current_task_index`, `get_completed_task_ids`, `is_all_completed`).
- Implemented adaptive daily mission builder `build_daily_mission(user)` in `apps/api/missions/services.py`:
  - Dynamically evaluates placement results across 6 sections to target learner's lowest scoring skill.
  - Serves diagnostic readiness onboarding mission for unplaced learners with clear CTA to `/placement`.
  - Generates 3 curated pedagogical micro-tasks per skill (Grammar, Vocabulary, Reading, Listening, Writing, Speaking, and Readiness).
- Implemented `start_daily_mission(user)` transitioning status from `ready` to `in_progress`.
- Implemented `submit_mission_step(user, task_id, selected_option_id)` with instant evaluation, feedback, explanation, and progress advancement.
- Implemented `resolve_mission_next_action(user, mission)` deriving dominant next best action upon completion (`/placement`, `/review`, or `/path`).

### Pre-Submission Payload Protection & Serializers
- `DailyMissionSerializer` in `apps/api/missions/serializers.py` enforces payload protection: answer keys and explanations are omitted from uncompleted tasks.
- `MissionStepSubmitSerializer` and `MissionStepFeedbackSerializer` validate step submission and instant feedback payloads.

### Interactive Frontend Wireframe 2 Implementation
- Rebuilt `/today` in `apps/web/app/(learner)/today/page.tsx` with Wireframe 2 multi-stage flow:
  - Mission Overview: title, focus skill badge, "Why this mission?" explanation, 3-task roadmap preview, and start/continue CTA.
  - Active Task View: step progress bar (`گام ۱ از ۳`), prompt with LTR isolation, radio option selector, check answer CTA.
  - Instant Feedback: correct/warning badge, answer reveal, pedagogical rule explanation, and next task button.
  - Complete Screen: celebration badge, practice summary, Rule #8 educational disclosure, and prominent Next Best Action card.
- 100% tokenized CSS in `apps/web/app/(learner)/today/today.module.css` with 0 raw hex colors and logical CSS properties.
- Added Next.js redirect from `/learner/today` to `/today` in `apps/web/next.config.ts`.

### Day 20 Verification Evidence
- Pre-Day-20 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day20\20260821-120000\endoora-pre-day20.dump` (107,603 bytes).
- Unit tests pass: 8 missions unit tests (`apps/api/missions/tests.py`) pass.
- Regression tests pass: 148 full backend tests pass with 0 errors.
- Pre-submission payload protection verified: zero answer keys leaked prior to submission.
- Frontend build passes (108/108 static routes generated), 0 lint errors/warnings, 0 typecheck errors.
- Static checks pass: `scripts/check_day20.py`, `check_day19.py`, `check_day18.py`, ..., `check-public-site.mjs`, `check-design-tokens.mjs`, `scan_secrets.py`.

## Git checkpoint (Day 20)

Commit message: `Day 20: Build adaptive daily mission engine, payload protection, and Wireframe 2 interactive experience` (commit `f00d611`)

## Day 21: Spaced Repetition System (SRS) Vocabulary Engine & Full Website UI/UX Overhaul (2026-08-22)

### SRS Vocabulary Engine & Architecture
- Implemented `SrsCandidate`, `SrsItem`, and `SrsReview` in `apps/api/srs/models.py`:
  - `SrsCandidate` provides a learner approval inbox (`status: pending | approved | ignored`) preventing the "Auto-saving every word" failure trap.
  - Enforced lemma and part-of-speech deduplication with `UniqueConstraint(fields=["learner", "lemma", "part_of_speech"])`.
  - Implemented transparent interval calculation method `calculate_next_intervals()` on `SrsItem`.
  - Added lapse counter `lapse_count`, leech flag `is_leech`, and `leech_action` triggering when `lapse_count >= 4`.
  - Stored traceable source sentences (`source_text`) and activity origins (`source_type`).
  - Added `SrsReview` recording `rating` (1=Again, 2=Hard, 3=Good, 4=Easy), previous/new intervals, ease factors, and `response_time_ms`.
- Implemented core services in `apps/api/srs/services.py`:
  - `review_item(item, rating, response_time_ms)` with SM-2 scheduling, leech flagging, and anti-spam guard.
  - `extract_candidates(learner, text, source_type)` with tokenization, stop-word filtering, simple lemmatization, and candidate deduplication.
  - `approve_candidate(candidate_id, learner, custom_meaning, custom_example)` and `ignore_candidate(candidate_id, learner)`.
  - `edit_srs_item(item_id, learner, meaning_fa, example_sentence)` enabling correction of flawed machine meanings.
  - `delete_srs_item(item_id, learner)` ensuring card deletion permanently removes personal source contexts.
  - `get_srs_stats(learner)` providing deck counts for dashboard and Today mission integration.
- Integrated `srs_due_count` into `DailyMissionSerializer` in `apps/api/missions/serializers.py` and rendered an active SRS review card in `/today`.
- Added database migration `apps/api/srs/migrations/0002_srscandidate_alter_srsitem_options_and_more.py`.
- Wrote 10 automated unit tests in `apps/api/srs/tests.py` covering deduplication, approval, SM-2 ratings, leech threshold, bad AI meaning editing, source sentence traceability, personal context deletion, user isolation, and anti-spam.

### Frontend Vocabulary Hub & Review Experience
- Built `/vocabulary` in `apps/web/app/(learner)/vocabulary/page.tsx`:
  - 4 tabs: Candidate Inbox (approval/ignore gate), Active Deck (search, filters, audio), Extract & Add Word, Leech Recovery.
  - 100% tokenized CSS in `apps/web/app/(learner)/vocabulary/vocabulary.module.css` with 0 raw hex colors and logical CSS.
- Upgraded `/review` in `apps/web/app/(learner)/review/page.tsx`:
  - Added direct link to Vocabulary Bank (`/vocabulary`).
  - Added in-place meaning correction button and modal for AI error fixes.
  - Displayed transparent next intervals on all 4 rating buttons (Again, Hard, Good, Easy).
  - Displayed traceable source context and leech alert warning badges.
- Upgraded `/today` in `apps/web/app/(learner)/today/page.tsx` with prominent SRS review callout card and due count indicator.

### End-to-End UI/UX Audit & Polish
- Overhauled and verified all website pages: Public marketing pages, Auth & Onboarding, Learner subpages (`/twin`, `/mistakes`, `/writing`, `/voice`, `/pronunciation`, `/listening`, `/roleplay`, `/progress`, `/badges`), Account hub pages (`/account/library`, `/account/usage`, `/account/plan`, `/account/billing`), Teacher portal pages (`/teacher/classes`, `/teacher/fixed-classes/new`, `/teacher/question-bank`, `/teacher/resources`), and Community (`/community`).
- Verified zero raw hex colors, full token compliance, 14 AA contrast pairs, RTL Persian first with English LTR isolation, responsive 360px to 1440px layout, and Product Constitution Rule #8 adherence.

### Day 21 Verification Evidence
- Pre-Day-21 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day21\20260822-090000\endoora-pre-day21.dump` (107,603 bytes).
- Unit tests pass: 10/10 SRS tests in `apps/api/srs/tests.py`.
- Full backend regression suite: 113/113 tests passing with 0 errors.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run build` (109/109 static routes compiled cleanly).
- Static contract checks: `scripts/check_day21.py`, `scripts/check_day20.py`, `check_day19.py`, ..., `check-design-tokens.mjs`, `check-components.mjs`, `check-day01-10.mjs`, `scan_secrets.py`, `git diff --check`.

## Day 22: Build Structured AI Exercise-Generation Service & Model Router (2026-08-23)

### AI Gateway Architecture
- Implemented models in `apps/api/ai_gateway/models.py`: `AIProviderConfig`, `AIRequestLog`, `GeneratedExerciseSet`, `ExerciseAttempt`.
- Backend-only OpenRouter HTTP client (`apps/api/ai_gateway/client.py`) with 15s timeout circuit breaker, daily budget cap ($5.00/day), and error/key redaction.
- Multi-tier model router (`apps/api/ai_gateway/model_router.py`) preventing vendor lock-in.
- Strict JSON, CEFR, distractor ambiguity, and internal consistency validator (`apps/api/ai_gateway/validators.py`).
- Structured exercise generation service with fallback bank (`apps/api/ai_gateway/services.py`).
- Pre-submission payload protection in `GeneratedExerciseSetLearnerSerializer` (`apps/api/ai_gateway/serializers.py`).
- Interactive exercise generator & runner at `/practice` (`apps/web/app/(learner)/practice/page.tsx`).
- 100% tokenized CSS in `apps/web/app/(learner)/practice/practice.module.css`.
- 16 unit and integration tests passing in `apps/api/ai_gateway/tests.py`.
- Git checkpoint: commit `6ba0370`.

## Day 23: Build the AI Mistake Genome & Error Taxonomy Hub (2026-08-24)

### Mistake Genome Architecture & Models
- Implemented `MistakeCategory` (8 categories: grammar, lexical, collocation, spelling, discourse, comprehension, pronunciation, strategy).
- Implemented `MistakeSeverity` (minor, moderate, critical) and `MistakeStatus` (occasional, recurring, disputed, mastered).
- Implemented `LearnerMistakePattern` with `UniqueConstraint(fields=["learner", "mistake_tag"])`, evidence count, and L1 interference notes (fa/en).
- Implemented `MistakeEvidence` with source activity tracking, sanitized raw snippets, and scrubbed status flag.
- Enforced evidence threshold: minimum 2 occurrences required before graduating from occasional slip to recurring pattern.
- Implemented learner dispute and correction workflow: disputed patterns are immediately excluded from active practice recommendations.
- Implemented learner resolution workflow: marking patterns as mastered.
- Implemented privacy scrubbing: learner can scrub or delete personal evidence snippets.
- Integrated mistake targets into `DailyMissionService` (`apps/api/missions/services.py`).
- Integrated error tracking into `StructuredExerciseService` (`apps/api/ai_gateway/services.py`), deriving focus areas and recording mistakes automatically.
- Database migration `apps/api/mistake_genome/migrations/0001_initial.py` applied with 0 model drift.
- 10 unit tests in `apps/api/mistake_genome/tests.py` passing with 0 errors.

### Frontend Mistake Hub & Practice Integration
- Overhauled `/mistakes` in `apps/web/app/(learner)/mistakes/page.tsx`:
  - 4 status tabs: Recurring, Occasional, Mastered, Disputed.
  - Category filters and severity pills.
  - L1 transfer root-cause explanations with Persian interference notes.
  - Interactive quick-check exercises with instant pedagogical feedback.
  - In-place dispute drawer allowing learners to correct flawed AI categorizations or typos.
  - Direct links to `/practice` targeting specific mistake patterns.
- 100% tokenized CSS in `apps/web/app/(learner)/mistakes/mistakes.module.css` with 0 raw hex colors.
- Zero-shame pedagogical framing adhering strictly to Product Constitution Rule #8.

### Day 23 Verification Evidence
- Pre-Day-23 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day23\20260824-090000\endoora-pre-day23.dump` (107,603 bytes).
- Backend unit tests pass: 10/10 in `apps/api/mistake_genome/tests.py`.
- Full backend regression suite: 139/139 tests passing across all 11 applications.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run build` (110/110 static routes compiled cleanly).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Component & system checks: `node scripts/check-components.mjs`, `node scripts/check-day01-10.mjs` passed.
- Daily contract checks: `scripts/check_day14.py` through `scripts/check_day23.py` all passed.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Git checkpoint (Day 23)

Commit message: `Day 23: Build AI Mistake Genome, L1 transfer taxonomy, dispute handling, and error hub` (commit `1fae74a`)

## Day 24: Build Writing Mentor v1 & IELTS Rubric Engine (2026-08-25)

### Writing Mentor Architecture & Engine
- Implemented `WritingDraft` and `WritingAnalysis` models in `apps/api/writing_mentor/models.py`:
  - `WritingDraft` provides draft versioning (`version`), parent-revision linking (`parent_draft`), autosave tracking, word counts, and assignment context (`prompt_id`, `target_cefr`, `mode`).
  - `WritingAnalysis` stores diagnostic evaluations, IELTS 4-criteria rubric scores with ranges, graduated rewrites with voice preservation notices, categorized error annotations, and actionable revision tasks.
- Generated and verified migration `apps/api/writing_mentor/migrations/0001_initial.py` with 0 model drift.
- Implemented `WritingMentorService` in `apps/api/writing_mentor/services.py`:
  - Built-in prompt presets library (A1 to C2 + IELTS Task 1 & Task 2).
  - Autosave draft management and revision branching.
  - Formative IELTS 4-criteria evaluation (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy) with score ranges (e.g. Band 6.0 – 6.5).
  - Three-tier graduated reference rewrites (A2 accessible, B2 academic, C2 nuanced) with prominent educational disclaimer: *"Reference Example for Learning — Not a replacement for your voice"*.
  - Categorized error annotations with explicit separation between structural grammar/lexical errors and optional stylistic recommendations.
  - Actionable revision coaching tasks checklist.
  - Selective Mistake Genome sync: only accepted corrections call `MistakeGenomeService.record_mistake()`, while dismissed corrections are completely omitted.
- Created backward-compatibility bridge package in `apps/api/writing/`.
- 10 unit tests in `apps/api/writing_mentor/tests.py` passing with 0 errors.
- Full backend test suite: 149/149 tests passing across all 12 applications.

### Frontend Writing Studio & Workbench
- Overhauled `/writing` in `apps/web/app/(learner)/writing/page.tsx`:
  - Embedded rich `WritingEditor` component with toolbar formatting.
  - Interactive stopwatch/exam timer with start, pause, and reset controls for timed exam practice.
  - Mode filter (All, General English, IELTS Tasks) and CEFR level presets (A1-C2).
  - Live metric indicators (word count, sentence count, char count, estimated reading time, sufficiency progress).
  - Submit-for-analysis confirmation modal.
  - Full diagnostic summary card with estimated IELTS band range and CEFR level range.
  - IELTS 4 criteria cards with bilingual feedback.
  - Strengths and top revision priorities.
  - Categorized error annotations with Accept and Dismiss actions.
  - Graduated reference rewrites (A2/B2/C2) with learner voice preservation notice.
  - Interactive revision tasks checklist.
  - Revision branching action to start new drafts.
- 100% tokenized CSS in `apps/web/app/(learner)/writing/writing.module.css` with 0 raw hex colors.
- Strict compliance with Product Constitution Rule #8 transparent educational notices.

### Day 24 Verification Evidence
- Pre-Day-24 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day24\20260825-090000\endoora-pre-day24.dump` (107,603 bytes).
- Backend unit tests pass: 10/10 in `apps/api/writing_mentor/tests.py`.
- Full backend regression suite: 149/149 tests passing across all 12 applications.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run build` (110/110 static routes compiled cleanly).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Component & system checks: `node scripts/check-components.mjs`, `node scripts/check-day01-10.mjs` passed.
- Daily contract checks: `scripts/check_day14.py` through `scripts/check_day24.py` all passed.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Git checkpoint (Day 24)

Commit message:

`Day 24: Build Writing Mentor v1, IELTS 4-criteria rubric, graduated rewrites, and studio workbench`

## Features working through Day 25

### Roleplay Universe v1 Architecture
- Models in `apps/api/roleplay/models.py`:
  - `RoleplaySession`: Learner foreign key, `scenario_id`, `turn_count`, `max_turns`, `goals_completed`, and anti-exploit `xp_awarded` boolean guard.
  - `RoleplayMessage`: Dialogue utterances with sender (`character`, `learner`, `system`), character name, and timestamp.
  - `RoleplayReport`: Deferred post-conversation report storing communicative score, CEFR band estimate, accomplishments, deferred grammar feedback, extracted vocabulary items, and XP earned (+50 XP).
- Migration `apps/api/roleplay/migrations/0001_initial.py` applied with 0 model drift.
- Scenario catalog in `data/scenarios/` with 10 structured definitions:
  - `airport.json` (Officer Davis, A2-B1, 3 goals, 4 vocab)
  - `hotel.json` (Elena Concierge, A2, 3 goals, 4 vocab)
  - `restaurant.json` (Marco Server, B1, 3 goals, 4 vocab)
  - `shopping.json` (Chloe Customer Care, B1, 3 goals, 4 vocab)
  - `travel.json` (Julian Transit Attendant, A2, 3 goals, 4 vocab)
  - `university.json` (Dr. Sterling Advisor, B2, 3 goals, 4 vocab)
  - `job_interview.json` (Sarah Lin Hiring Manager, B2, 3 goals, 4 vocab)
  - `business.json` (Marcus Vance Product Lead, B2, 3 goals, 4 vocab)
  - `friendly_chat.json` (Sam Close Friend, B1, 3 goals, 4 vocab)
  - `ielts_speaking.json` (Examiner Henderson, B2-C1, 3 goals, 4 vocab)

### Pedagogical & Immersion Safeguards
- **Zero Mid-Turn Interruptions**: In-character responses maintain complete dramatic immersion, deferring all grammatical error analysis to the post-conversation report.
- **In-Character Prompt Injection Defense**: System prompt extraction and jailbreak attempts are politely redirected in-character without crashing or disclosing internal system prompts.
- **Bounded Token Caps**: Maximum turn limits (`max_turns = 8 – 10`) and 500-character input limits prevent runaway token loops.
- **Anti-Exploit Completion XP**: Static +50 XP completion reward is strictly awarded *once* per scenario (`xp_awarded` guard), completely preventing per-turn token farming.

### Downstream Integrations
- **Mistake Genome**: Deferred grammatical slips can be reviewed and accepted by learners (`POST /api/roleplay/sessions/<id>/accept-mistake/`), seamlessly calling `MistakeGenomeService.record_mistake()`.
- **SRS Deck**: Target vocabulary words from scenarios can be saved directly to the active flashcard review deck (`POST /api/roleplay/sessions/<id>/save-srs-word/`), creating an `SrsItem`.

### Frontend Experience
- Overhauled `/roleplay` in `apps/web/app/(learner)/roleplay/page.tsx`:
  - Scenario catalog grid filterable by CEFR level with avatar and goal previews.
  - Live persona chat interface with avatar, tone, and character role.
  - Interactive turn counter (`Turn X of Y`) and goal checklist tracker.
  - Pedagogical phrasing hint drawer.
  - Quick suggested response chips.
  - Post-conversation diagnostic report view with communicative fluency score, CEFR band estimate, accomplishments list, deferred grammatical feedback with "Add to Mistake Genome" action, and extracted target vocabulary with "Save to SRS Deck" action.
- 100% tokenized CSS in `apps/web/app/(learner)/roleplay/roleplay.module.css` with 0 raw hex colors.

### Day 25 Verification Evidence
- Pre-Day-25 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day25\20260826-090000\endoora-pre-day25.dump` (107,603 bytes).
- Backend unit tests pass: 11/11 in `apps/api/roleplay/tests.py`.
- Full backend regression suite: 160/160 tests passing across all 13 applications.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm run build` (110/110 static routes compiled cleanly).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Component & system checks: `node scripts/check-components.mjs`, `node scripts/check-day01-10.mjs` passed.
- Daily contract checks: `scripts/check_day14.py` through `scripts/check_day25.py` all passed.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Features working through Day 26

### Voice Lab v1 & Voice Conversation Beta Architecture
- Models in `apps/api/voice_lab/models.py`:
  - `VoiceRecording` (aliased as `AudioAttempt` for compatibility): Stores audio recording file paths, format, duration, size, `stt_transcript`, `corrected_transcript`, `status`, and biometric privacy fields (`retention_policy`, `expires_at`, `is_deleted`).
  - `VoicePreference`: Learner audio settings for `preferred_accent` (`US`, `UK`, `AU`), `playback_speed` (`0.8`, `1.0`, `1.2`), `default_retention` (`immediate`, `7_days`, `30_days`), and `auto_play_tts`.
- Migration `apps/api/voice_lab/migrations/0001_initial.py` applied with 0 model drift.
- Backward compatibility bridge in `apps/api/speech/` (`__init__.py`, `apps.py`, `models.py`, `services.py`, `urls.py`, `views.py`).
- Pipeline service in `apps/api/voice_lab/services.py` (`VoicePipelineService`):
  - Hard limit upload ticketing: Max **90 seconds** duration and max **10 MB** file size.
  - Multipart audio upload with STT transcript extraction.
  - Manual transcript correction endpoint (`PATCH /api/voice/recordings/<id>/transcript/`).
  - TTS speech synthesis descriptor generator (`POST /api/voice/tts/`) with accent and speed controls.
  - Automated expired audio file purging (`delete_expired_audio()`) preserving textual learning transcripts.
- Scheduled cleanup management command in `apps/api/voice_lab/management/commands/cleanup_expired_audio.py`.
- REST API routes in `apps/api/voice_lab/urls.py` registered at `/api/voice/` and `/api/speech/`.

### Frontend Voice Experience & Safeguards
- `VoiceRecorder` component in `apps/web/components/voice-recorder/VoiceRecorder.tsx`:
  - 24-bar live AudioContext frequency analyzer visualizer.
  - 90-second countdown timer.
  - Native audio playback preview.
  - In-place transcript review and editing textarea.
  - Seamless non-blocking fallback text input when microphone is denied or unsupported.
- Interactive Voice Roleplay Beta at `/roleplay/voice` in `apps/web/app/(learner)/roleplay/voice/page.tsx`:
  - 10 full conversational scenarios across CEFR levels A2 to C1.
  - Audio toolbar for persona accent (`en-US`/`en-GB`), speed (`0.8x`/`1.0x`/`1.2x`), and retention policies (`immediate`/`7 days`/`30 days`).
  - Turn-by-turn dialogue stream with instant character TTS playback.
  - Post-conversation diagnostic report view with communicative effectiveness score, goals achieved, and vocabulary extraction.
- Updated Voice Lab Hub at `/voice` with direct beta CTA, acoustic retention preferences manager, and VoiceRecorder v1 sandbox.
- Cross-linked Roleplay Universe at `/roleplay` with Voice Roleplay Beta fast-track CTA banner.
- 100% tokenized CSS across all new CSS modules with 0 raw hex colors.

### Day 26 Verification Evidence
- Pre-Day-26 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day26\20260827-090000\endoora-pre-day26.dump` (107,603 bytes).
- Backend unit tests pass: 11/11 in `apps/api/voice_lab/tests.py`.
- Full backend regression suite: 216/216 tests passing across all 14 applications.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Daily contract check: `scripts/check_day26.py` passed with 0 errors.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Features working through Day 27

### Pronunciation Lab v1 & Speech Intelligibility Workbench
- Models in `apps/api/pronunciation/models.py`:
  - `PronunciationItem`: Curated phonological catalog covering Persian L1 interference categories (`minimal_pairs`, `stress_shifts`, `consonant_clusters`, `connected_speech`), IPA, stress pattern, target WPM, difficulty levels, and bilingual L1 pedagogical guidance.
  - `PronunciationAttempt`: Learner oral practice attempt recording target text, spoken transcript, duration, speech rate (WPM), hesitation pause count, syllable stress match, formative intelligibility trend score (0–100), and Mistake Genome sync state.
  - Legacy backward compatibility accessors (`transcript`, `speech_rate`, `pauses`, `confidence`).
- Initial migration `apps/api/pronunciation/migrations/0001_initial.py` applied with 0 schema drift.
- Formative acoustic service in `apps/api/pronunciation/services.py` (`PronunciationService`):
  - 9 seed items automatically seeded.
  - Pacing and hesitation metrics: `calculate_speech_rate_wpm()`, `count_hesitations()`, `evaluate_intelligibility_trend()`.
  - Strict compliance with **Product Constitution Rule #8**: never fabricates unvalidated phoneme-level grading percentages or claims native-speaker accent diagnosis.
  - Mistake Genome Bridge: `save_to_mistake_genome()` records pronunciation challenges into `LearnerMistakePattern` (`category="pronunciation"`).
  - Legacy backward-compatible `analyze(audio)` bridge.
- REST API routes in `apps/api/pronunciation/urls.py` registered at `/api/pronunciation/`.

### Frontend Pronunciation Experience
- Interactive Pronunciation Lab at `/pronunciation` in `apps/web/app/(learner)/pronunciation/page.tsx`:
  - Prominent **Product Constitution Rule #8 Banner** explaining pedagogical intelligibility principles.
  - Category filter pills (`minimal_pairs`, `stress_shifts`, `consonant_clusters`, `connected_speech`).
  - Phonological practice cards with IPA badges, stress indicators, Persian L1 callouts, and dual-accent (US/UK) / variable speed (0.85x/1.0x) audio playback.
  - Speech Intelligibility Workbench with a live 24-bar audio visualizer, real-time recording, elapsed timer, and manual transcript fallback.
  - Diagnostic feedback card displaying Intelligibility Trend Score (%), Speech Rate (WPM), Pauses, and Syllable Stress match.
  - Interactive "Track Challenge in Mistake Genome" action button with live confirmation.
  - **Shadowing Studio Guide** detailing the 3-step shadowing method with fast-track cross-links to Voice Lab (`/voice`) and Voice Roleplay Beta (`/roleplay/voice`).
- 100% tokenized CSS in `apps/web/app/(learner)/pronunciation/pronunciation.module.css` with 0 raw hex colors and logical CSS properties only.

### Day 27 Verification Evidence
- Pre-Day-27 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day27\20260828-090000\endoora-pre-day27.dump` (107,603 bytes).
- Backend unit tests pass: 10/10 in `apps/api/pronunciation/tests.py`.
- Full backend regression suite: 226/226 tests passing across all 15 applications.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Production build: `npm run build` compiled 111/111 pages cleanly.
- Daily contract checks: `scripts/check_day27.py` and `scripts/check_day14.py` through `scripts/check_day26.py` all passed.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Features working through Day 28

### Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules
- Financial-grade gamification models in `apps/api/gamification/models.py`:
  - `XPCategory`: Activity categorizations (`mission`, `roleplay`, `srs`, `pronunciation`, `writing`, `placement`, `streak_bonus`, `system_adjustment`).
  - `XPTransaction`: Append-only, immutable XP ledger. Prevents mutation or deletion once persisted. Enforces deduplication and anti-exploit integrity via unique `source_event` keys.
  - `LearnerStreak`: Daily learning streak tracking evaluated against `Asia/Tehran` calendar days, with automatic grace freeze shields (`freeze_credits`) protecting learners against accidental streak loss.
  - `LearnerLevel`: Cached cumulative XP balance, current level progression rank, and transparent bilingual pedagogical titles in English and Persian compliant with Product Constitution Rule #8 (Honest Assessment).
- Initial migration `apps/api/gamification/migrations/0001_initial.py` applied with 0 schema drift.
- Pedagogical progression service in `apps/api/gamification/services.py` (`GamificationService`):
  - 20-level pedagogical progression curve from Level 1 (*Novice Explorer* / *کاوشگر نوآموز*) to Level 20 (*Legendary Scholar* / *دانشمند اسطوره‌ای*).
  - Idempotent `award_xp()` method with atomic database transactions and automatic level/streak cache refresh.
  - Timezone-aware `record_activity()` managing consecutive days, same-day no-op, freeze shield consumption, and 7-day milestone freeze bonuses.
  - `get_learner_gamification_profile()` aggregating comprehensive metrics, levels catalog, and Rule #7/#8 disclaimers.
  - Legacy `XPService.award()` backward compatibility wrapper.
- REST API views and serializers in `apps/api/gamification/views.py`, `serializers.py`, and `urls.py`:
  - `GET /api/gamification/summary/`: Comprehensive gamification profile with safe zero-state fallback for guests.
  - `GET /api/gamification/ledger/`: Paginated immutable XP audit log.
  - `POST /api/gamification/award/`: Protected endpoint for validated learning event awards.
  - `GET /api/gamification/levels/`: Public directory of all 20 levels and thresholds.
- Dynamic integration with Learner Dashboard (`apps/api/dashboard/services.py`):
  - Connects `xp`, `xp_available`, and `streak_days` directly to verified gamification records while maintaining safe zero-state (`xp_available: False`) for first-time learners before learning activity.

### Frontend Gamification & Progress Experience
- Overhauled Progress and Analytics page at `/progress` (`apps/web/app/(learner)/progress/page.tsx`):
  - Dynamic level progression card with level badge, XP brackets, and animated progress bar.
  - Daily consistency streak card with flame counter, longest streak record, freeze shield counter, and 7-day weekly activity tracker.
  - Live **Immutable XP Audit Ledger table** displaying timestamps, activity categories, source event references, and point gains.
  - Product Constitution Rule #7 (Calm, Anti-Addiction) and Rule #8 (Honest Assessment) educational notices.
- Updated Badges page at `/badges` (`apps/web/app/(learner)/badges/page.tsx`) displaying the learner's live level badge and educational title.
- 100% tokenized CSS module `apps/web/app/(learner)/progress/progress.module.css` with 0 raw hex color literals and logical properties only.

### Day 28 Verification Evidence
- Pre-Day-28 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day28\20260829-090000\endoora-pre-day28.dump` (107,603 bytes).
- Backend unit tests pass: 12/12 in `apps/api/gamification/tests.py`.
- Full backend regression suite: 238/238 tests passing across all 16 applications with 0 errors.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Production build: `npm run build` compiled 111/111 pages cleanly.
- Daily contract checks: `scripts/check_day28.py` and `scripts/check_day14.py` through `scripts/check_day27.py` all passed.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Git checkpoint (Day 28)

Commit message:

`Day 28: Build Gamification Engine v1, immutable XP ledger, level progression, and streak rules`

## Features working through Day 29

### Gamification Social & Recognition Engine: Badges, Challenges, Clubs & Privacy-Safe Leaderboards
- Comprehensive recognition and social engagement models in `apps/api/gamification/models.py`:
  - `Badge`: Milestone, consistency, mastery, and special event achievements with icon keys, bilingual titles/descriptions, and XP rewards.
  - `LearnerBadge`: Immutable record of earned badges with uniqueness constraints preventing duplicate unlocks.
  - `ChallengeTemplate`: Daily, weekly, and 7-day sprint learning challenges with metric targets, duration, and XP rewards.
  - `LearnerChallenge`: Individual challenge progress tracking with deadline and completion timestamps.
  - `SevenDaySprintEnrollment`: Intensive 7-day sprint enrollment with streak, completion status, and bonus XP rewards.
  - `ActiveUsersClub`: Community cohorts (study groups, interest clubs) with member caps, moderation settings, and activity stats.
  - `ClubMembership`: Club join dates, roles (`member`, `moderator`), and active participation tracking.
  - `LearnerPrivacySettings`: Fine-grained privacy controls with explicit opt-out (`is_leaderboard_visible`), pseudonymized public display name toggle (`use_pseudonym`), avatar concealment, and minor auto-masking.
  - `LeaderboardSnapshot` & `LeaderboardEntry`: Weekly/monthly frozen leaderboard snapshots with historical auditability, snapshot reversal safeguards, and deterministic tie-breaking.
- Applied migration `apps/api/gamification/migrations/0002_activeusersclub_badge_challengetemplate_and_more.py` with 0 schema drift.
- Pedagogical social services in `apps/api/gamification/services.py`:
  - `BadgeService`: Idempotent badge evaluation, automated milestone triggers, and transaction-safe XP award integration.
  - `ChallengeService`: Daily and weekly challenge generation, active progress updates, and 7-day sprint lifecycle management.
  - `ClubService`: Club discovery, creation, capacity-enforced joining, activity reporting, and moderation reporting.
  - `LeaderboardService`: Privacy-safe cohort ranking, small-city cohort suppression (minimum cohort size = 10 to prevent doxxing), automatic minor masking, deterministic tie-breaking by first-to-reach timestamp, and weekly frozen snapshot archival.
- REST API views and serializers in `apps/api/gamification/views.py`, `serializers.py`, and `urls.py`:
  - `GET /api/gamification/badges/`: Catalog of available and earned badges.
  - `POST /api/gamification/badges/evaluate/`: Trigger badge evaluations against verified activities.
  - `GET /api/gamification/challenges/`: Active daily and weekly challenges with progress meters.
  - `POST /api/gamification/challenges/enroll-sprint/`: Enroll into the 7-day learning sprint.
  - `POST /api/gamification/challenges/report/`: Safe reporting of inappropriate challenge content.
  - `GET /api/gamification/clubs/`: Directory of active learning clubs with search and filters.
  - `POST /api/gamification/clubs/join/` & `POST /api/gamification/clubs/leave/`: Club membership operations.
  - `GET /api/gamification/leaderboard/`: Privacy-safe leaderboard with cohort suppression and pseudonymization.
  - `GET /api/gamification/leaderboard/privacy/` & `PUT /api/gamification/leaderboard/privacy/`: Granular privacy preferences.
  - `POST /api/gamification/leaderboard/snapshot/`: Privileged snapshot generation for historical freezing.

### Frontend Achievements & Social Hub
- Comprehensive Achievements and Recognition Hub at `/achievements` (`apps/web/app/(learner)/achievements/page.tsx`):
  - 5 interactive navigation tabs: **Badges & Honors**, **Challenges & 7-Day Sprint**, **Active Clubs**, **Leaderboard**, and **Privacy Controls**.
  - Dynamic Badges grid displaying unlocked and locked badges with criteria, rarity, and XP rewards.
  - Interactive Daily & Weekly Challenges dashboard with live progress meters, countdown timers, and 7-Day Sprint enrollment.
  - Active Clubs browser with member count badges, topic tags, and one-click join/leave actions.
  - Privacy-safe Leaderboard view with user pseudonymization, cohort size indicators, and position highlighting.
  - In-place Leaderboard Privacy Controls allowing learners to opt out of public rankings, mask real names with generated pseudonyms, and protect location information.
  - Educational disclaimers reinforcing Product Constitution Rule #5 (Privacy by Design), Rule #7 (Calm, Anti-Addiction), and Rule #8 (Honest Assessment).
- Updated `/badges` route (`apps/web/app/(learner)/badges/page.tsx`) with fast-track cross-link to the comprehensive Achievements Hub.
- 100% tokenized CSS module `apps/web/app/(learner)/achievements/achievements.module.css` with 0 raw hex colors and logical properties only.
- Safety & privacy specification document created in `docs/safety/leaderboard-policy.md`.

### Day 29 Verification Evidence
- Pre-Day-29 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day29\20260830-090000\endoora-pre-day29.dump` (107,603 bytes).
- Backend unit tests pass: 21/21 in `apps/api/gamification/tests.py`.
- Full backend regression suite: 237/237 tests passing across all 16 applications with 0 errors.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Production build: `npm run build` compiled 112/112 static/SSG pages cleanly.
- Daily contract checks: `scripts/check_day29.py` and `scripts/check_day14.py` through `scripts/check_day28.py` all passed 100%.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Day 30: Skills Hub, Lesson CMS Player, Courses, Iranian High School / Konkur, Culture & Paywall Enforcement

### Backend Content & Courses Architecture
- Created two new Django applications: `apps/api/content` and `apps/api/courses`.
- Models:
  - `ContentItem` (`apps/api/content/models.py`): Supports 8 categories (`grammar`, `listening`, `reading`, `writing`, `speaking`, `vocabulary`, `culture`, `school`) and multiple content types. Includes mandatory copyright attribution validation in `clean()` requiring `source_attribution`, `license_type`, and `author_name` (enforcing zero copyright infringement under Product Constitution Rule #6).
  - `ContentReviewLog`: Editorial workflow tracking transitions between `draft`, `in_review`, `published`, and `archived` states.
  - `Course`, `Module`, `Lesson`, `LearnerCourseEnrollment`, `LearnerLessonProgress` (`apps/api/courses/models.py`): Hierarchical syllabus structure with free preview flags, lesson duration, media attachments, transcripts, and interactive quizzes.
- Database migrations:
  - `apps/api/content/migrations/0001_initial.py`
  - `apps/api/courses/migrations/0001_initial.py`
- Service Layer & Server-Side Paywall:
  - `ContentService` (`apps/api/content/services.py`): Skills hub summary, categorized content lists, review workflow, and server-side paywall redaction stripping body text, media URLs, quizzes, and downloadables for non-entitled learners.
  - `CourseService` (`apps/api/courses/services.py`): Course catalog, syllabus, lesson detail redaction, course enrollment, and lesson completion awarding 25 XP to the learner gamification ledger.
- API Endpoints:
  - `/api/content/skills/`, `/api/content/items/`, `/api/content/items/<slug>/`, `/api/content/culture/`, `/api/content/school/`
  - `/api/courses/`, `/api/courses/<slug>/`, `/api/courses/<slug>/enroll/`, `/api/courses/<slug>/lessons/<lesson_id>/`, `/api/courses/<slug>/lessons/<lesson_id>/complete/`

### Frontend Public Skills & Learning Experience
- Public Skills Hub at `/skills` (`apps/web/app/(public)/skills/page.tsx`): 6 core skills + Culture + School cards, CEFR level filter, search, and featured articles.
- Dynamic Skill Deep-Dive pages at `/skills/[skill]` (`apps/web/app/(public)/skills/[skill]/page.tsx`): Persian L1 interference patterns, syllabus breakdown, and course recommendations.
- Culture Hub at `/skills/culture` (`apps/web/app/(public)/skills/culture/page.tsx`): Iranian-English intercultural pragmatics, etiquette, and small talk.
- Iranian High School & Konkur Hub at `/skills/school` (`apps/web/app/(public)/skills/school/page.tsx`): Vision 1, 2, 3 curriculum prep and Konkur test banks.
- Courses Catalog at `/courses` (`apps/web/app/(learner)/courses/page.tsx`): Searchable catalog with CEFR level badges and audience filters.
- Course Syllabus at `/courses/[slug]` (`apps/web/app/(learner)/courses/[slug]/page.tsx`): Module breakdown, preview vs. locked indicators, and enrollment status.
- Interactive Lesson CMS Player at `/courses/[slug]/lessons/[lessonId]` (`apps/web/app/(learner)/courses/[slug]/lessons/[lessonId]/page.tsx` & `LessonPlayer.tsx`): SSG pre-rendered player for all 14 course lessons with video/audio toggles, transcripts, interactive quizzes with immediate pedagogical feedback, downloadable resources, and server-side locked paywall upgrade card (420,000 toman launch plan).
- Learner Hub at `/learn` (`apps/web/app/(learner)/learn/page.tsx`): Unified dashboard connecting courses, skills, school, culture, path, daily missions, and achievements.
- Added `/skills` navigation link to `apps/web/components/layout/Header.tsx`.
- 100% tokenized CSS modules with 0 raw hex colors and logical properties only.

### Day 30 Verification Evidence
- Pre-Day-30 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day30\20260905-190000\endoora-pre-day30.dump` (107,603 bytes).
- Backend unit tests pass: 11/11 in `content` and `courses`.
- Full backend regression suite: 248/248 tests passing across all 18 applications with 0 errors in 17.7s.
- Migration check: `python manage.py makemigrations --check --dry-run` shows 0 drift.
- Frontend checks: `npm run lint` (0 errors), `npm run typecheck` (0 errors).
- Token check: `node scripts/check-design-tokens.mjs` passed (14 AA contrast pairs, logical CSS, 0 raw hex).
- Production build: `npm run build` compiled 138/138 static/SSG pages cleanly.
- Daily contract checks: `scripts/check_day30.py` and `scripts/check_day09.py` through `scripts/check_day29.py` all passed 100%.
- Secret scan: `python scripts/scan_secrets.py` passed with 0 findings.
- Git diff check: `git diff --check` passed with 0 errors.

## Git checkpoint (Day 30)

Commit message:

`Day 30: Skills hub, course CMS, culture, and public learning content`

## Exact next day

**Day 31 — Social Learning & Peer Feedback Foundation.**

Do not begin Day 31 until the Day 30 commit is pushed and `git status --short --branch`
shows `main` synchronized with `origin/main` and no unintended changes.

