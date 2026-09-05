# Endoora Project State

## Current checkpoint
- **Roadmap day completed:** Day 19 — Personal Learning Path Engine & Interactive Path Experience
- **Day 19 status:** Complete and verified; ready for Git commit and push to `origin/main`
- **Inherited state:** Days 01–18 remain in place, including Persian-first RTL/English-LTR foundations, Endoora Operations, stable CEFR taxonomy, versioned question bank, placement session engine, and multi-stage placement sections (Grammar, Vocabulary, Reading, Listening, Speaking, Writing)
- **Schema version:** Day 14 adds `placement.0002_alter_placementanswer_options_and_more` (Day 19 adds no schema migration)
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

## Git checkpoint

Commit message:

`Day 22: Build structured AI exercise-generation service, multi-tier model router, and interactive practice runner`

## Exact next day

**Day 23 — Build the AI Mistake Genome.**

Do not begin Day 23 until the Day 22 commit is pushed and `git status --short --branch`
shows `main` synchronized with `origin/main` and no unintended changes.
