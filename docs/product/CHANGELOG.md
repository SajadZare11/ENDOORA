# Endoora Changelog

## Day 04 — Accessible component library

### Added
- More than 25 reusable visual component examples at `/design-system/components`
- Action primitives: Button variants and IconButton
- Labelled form controls plus linked ErrorSummary
- Keyboard Tabs with Arrow/Home/End behavior
- Card and semantic Badge components
- Native Dialog and Drawer with focus restoration
- Toast live region, Skeleton, ProgressBar, and StatusMessage
- Resumable Stepper with Back/Save/Cancel/refresh recovery
- Responsive DataTable with mobile cards
- AccessibleChart with textual summary and data table
- AIResultCard with evidence, confidence, limitations, retry/report/save/human-review controls
- Empty, PermissionDenied, Offline, Retry, and ProviderStatus states
- AccountNavigation and role-aware responsive RoleShell
- Day 04 automated component/accessibility static smoke check
- Component-library usage documentation and acceptance gate

### Changed
- UI/web package version moved to `0.4.0`.
- Root web layout now imports shared component styles from `@endoora/ui/components.css`.
- Day 03 token check now also guards Day 04 component styles against raw colors and physical left/right CSS properties.
- Local home now links to both token and component previews.

### Runtime/data changes
- No database migration.
- No backend API contract change.
- No authentication, payment, storage, permission, or user-data change.

## Day 03 — Bilingual design-token and brand system

### Added
- Centralized light/dark CSS variables in `packages/ui/src/tokens.css`
- Typed UI token exports and theme/direction types in `packages/ui/src/theme.ts`
- Bilingual Endoora wordmark treatment using shared token classes
- Vazirmatn + Inter `next/font` integration with Persian/Latin fallbacks
- `/design-system` visual token gallery
- RTL/LTR isolation helpers for English, IPA, URL, email, and numeric learning content
- Spacing, radius, elevation, focus, motion, reduced-motion, and responsive typography tokens
- Accessible semantic status background/text pairs
- Automated design-token smoke test and CI hook
- Secret-scanner placeholder regression fix plus five Python regression tests
- Day 03 design-system documentation and acceptance gate

### Changed
- Root web layout is Persian-first RTL while the developer-only Day 02 health page remains explicitly English LTR.
- Global CSS now consumes design tokens and logical CSS properties instead of raw page colors and `padding-left`.
- Frontend/UI package version moved to `0.3.0`.
- Day 01 project-memory documents were synchronized with the actual Day 02/Day 03 repository state.

### Runtime/data changes
- No database migration.
- No API contract change.
- No payment, authentication, storage, or user-data change.

## Day 02 — Reproducible local environment

### Added
- Next.js App Router web workspace
- Django + DRF API workspace
- Shared UI and contracts workspaces
- PostgreSQL/Redis Docker Compose services
- Health/liveness endpoints and understandable frontend API-unavailable state
- Development/test/staging/production settings skeletons
- Environment template and secret scanning
- GitHub CI for frontend/backend checks
- Local development/acceptance documentation

### Git checkpoint
- `d208eb4` — `Day 02: Create the Endoora monorepo and reproducible local environment`

## Day 01 — Foundation

### Added
- Endoora product constitution
- Naming standard
- Domain/environment map
- Feature registry and feature/route/data map
- Launch cut line
- Baseline backlog
- Risk register
- ADR-001 scope decision
- Project-memory baseline
- Architecture/data/API baseline documents
- Security/privacy baseline documents
- AI governance baseline documents
- Operations/runbook baseline documents

### Runtime changes
None. Application code begins Day 02.

### Data changes
None. No Endoora domain data existed yet.

## Day 05 — Information architecture, Account hub and critical flows

### Added

- Frozen public, learner, teacher and operations sitemap
- Role-specific primary navigation matrix
- Learner/teacher Account hub specification
- Route inventory with owner, guard, CTA, sensitivity, offline need, analytics event and deep-link contract
- Global multi-step save/back/cancel/recovery convention
- Six critical user-flow wireframes
- ADR-002 navigation decision
- Developer-only `/design-system/information-architecture` findability prototype
- Day 05 static information-architecture smoke check
- Human five-person hallway-test acceptance sheet

### Changed

- Project state, roadmap progress, test matrix, regression checklist and README now describe the Day 05 gate.
- No existing feature-map CSV is overwritten by the Day 05 package.

### Runtime/data changes

- No Django model migration.
- No backend API change.
- No authentication/payment/storage/user-data change.
- No dependency or lock-file change.

## Day 05 localization correction

- Made Persian (`fa`) the default language of the Day 05 IA prototype.
- Added an English language switch.
- Kept `Endoora` and `A new door to your English` unchanged in English.
- Added explicit RTL/LTR switching.
- Added the permanent Persian-first localization contract.
- Added regression/acceptance requirements for Persian default UI and isolated English LTR content.

## Day 05 root locale correction

- Synchronized the actual document root `<html lang>` and `<html dir>` attributes with the Day 05 Persian/English language switch.
- Added a regression check so an inner-container-only locale change cannot pass.
- Clarified that the mobile acceptance gate must be tested at exactly 360 px, not merely a nearby responsive width.


## Day 08 — Registration, onboarding, profile and Account UX

### Added

- Persian-first registration UX with English switch
- Learner and teacher self-registration
- Explicit Terms and Privacy consent during registration
- Password-reset confirmation endpoint and browser workflow
- `profiles` Django application
- `LearnerProfile`
- `TeacherProfile`
- `OnboardingProgress`
- `DataExportRequest`
- Learner onboarding flow with server-side save/resume
- Teacher onboarding flow with server-side save/resume
- Teacher verification-intent capture without capability escalation
- Profile completeness calculation
- `/onboarding`
- `/account`
- `/account/profile`
- `/account/sessions`
- `/account/data-controls`
- `/account/library`
- `/account/usage`
- `/account/plan`
- `/account/billing`
- Account Summary API
- Current-session UI
- Data-export request UI and history
- Guarded account-deletion entry point
- Library, Usage, Plan, and Billing foundation pages
- Day 08 authentication/profile/onboarding backend regression tests

### Changed

- Next.js development proxy now preserves Django API trailing slashes and avoids the Next.js/Django redirect loop.
- Registration success leads toward onboarding.
- Login success provides a path into account/onboarding UX.
- Account hub specification is now represented by real runtime routes.
- Preferred interface locale can be persisted through account settings.
- Teacher account UX exposes capability state without conflating teacher role with verification.

### Security and privacy

- Self-registration is limited to learner and teacher roles.
- Registration requires explicit Terms and Privacy acceptance.
- Onboarding draft data rejects password, OTP, token, secret, API-key and other sensitive-key patterns.
- Learner and teacher profile endpoints enforce role separation.
- Cross-user learner profile isolation is covered by backend tests.
- Teacher onboarding cannot grant `is_teacher_verified`.
- Teacher onboarding cannot grant `marketplace_eligible`.
- Teacher onboarding cannot grant `paid_class_eligible`.
- Data-export creation is idempotent while an existing request is pending or processing.
- Account-deletion UX requires exact `DELETE` confirmation before submission is enabled.

### Verification

- `python manage.py check` — PASS
- `python manage.py test` — PASS, 41 tests
- `python manage.py makemigrations --check --dry-run` — PASS
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- Learner onboarding refresh/resume — PASS
- Teacher privilege separation — PASS
- Profile/settings persistence — PASS
- Current-session UX — PASS
- Data-export persistence — PASS
- Account deletion confirmation guard — PASS
- Account foundation routes — PASS
- 360 px browser smoke test — PASS
- Keyboard-only smoke test — PASS

### Known limitations

- Multi-device session listing and remote session revocation are not yet implemented.
- Data-export processing/download delivery is future work.
- Library, Usage, Plan, and Billing are foundation pages only.
- Actual teacher verification is future work.
- Manual Day 08 verification did not submit a destructive account-deletion request.
- Automated browser E2E coverage is future work.

### Runtime/data changes

- Added the initial `profiles` database migration.
- Added persistent learner profile, teacher profile, onboarding progress, and data-export request records.
- Reused the existing account-deletion request foundation from the `accounts` application.
-

## Day 09 — Learner application shell

- Added the protected learner dashboard and responsive learner shell.
- Added Persian-first learner navigation with an English interface switch.
- Added one dominant Today / next-best-action card with a “why this action?” explanation.
- Added first-time, login-required, permission-denied, loading, offline, error, and retry states.
- Added the aggregated learner-home API and bounded primary-CTA analytics event.
- Added negative role tests and assertions that prevent fabricated progress values.

## Day 10 — Teacher application shell and simplified navigation

### Added

- Protected Persian-first teacher dashboard with English interface switch
- Five-destination teacher shell: Home, Teach, Marketplace, Resources, Account
- `teachers` Django application for teacher-dashboard API ownership
- `GET /api/teachers/dashboard/` aggregated dashboard endpoint
- `POST /api/teachers/dashboard/events/` bounded action-analytics endpoint
- Verification-first teacher primary-action resolver
- Safe empty/foundation summaries for classes, students, Learn Now requests, grading, schedule, and earnings
- Teacher question-bank and fixed-class foundation shortcuts
- Responsive desktop sidebar and 360 px mobile teacher navigation
- Login-required, wrong-role, loading, offline, error, retry, and empty/foundation states
- Teacher dashboard privacy-redaction rules and documentation
- Day 10 static acceptance checker
- Backend permission, capability, privacy, bounded-query, analytics, and urgency-priority tests

### Changed

- Root Django settings now register the existing Day 09 `dashboard` app and the new Day 10 `teachers` app.
- Root Django URLs now expose the Day 09 learner dashboard routes and Day 10 teacher dashboard routes.
- Teacher role and verified/marketplace/paid-class capabilities remain separate and are surfaced safely in the teacher workspace.
- Teacher home keeps earnings, billing/plan/settings/support in Account rather than crowding the primary dashboard.

### Security and privacy

- Anonymous teacher-dashboard API requests are rejected.
- Authenticated non-teacher requests are rejected server-side.
- Unverified teachers do not receive effective marketplace or paid-class access from underlying flags alone.
- Dashboard summaries prohibit raw learner writing, audio, transcript, AI conversation history, answer text, and private messages.
- Dashboard analytics accepts only known event/action identifiers.
- No secret-bearing provider integration was added.

### Verification

- `python manage.py check` — PASS
- `python manage.py test teachers` — PASS
- `python manage.py test` — PASS
- `python manage.py makemigrations --check --dry-run` — PASS, no changes detected
- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- `node scripts/check-day10.mjs` — PASS
- `python scripts/scan_secrets.py` — PASS
- `git diff --check` — PASS; line-ending conversion warnings only

### Runtime/data changes

- No Day 10 database model or migration.
- No payment, storage, SMS, AI-provider, or financial-data integration.
- Reuses existing `TeacherProfile` and custom-user capability fields.

### Known limitations

- Actual teacher verification, class/student domain records, assignment grading records, marketplace requests, schedules, earnings, payouts, and paid fixed classes remain later roadmap work.
- Day 10 intentionally renders truthful empty/foundation states rather than fabricated records.
- Automated browser E2E/Playwright coverage remains future work.

## Day 11 — Configure Django admin, audit logs, and safe settings
- Added Endoora Operations Django-admin foundation.
- Added immutable audit trail with sensitive-field redaction.
- Added typed system settings and feature flags.
- Added least-privilege operational role policy and support restrictions.
- No payment state editor or secret database setting was introduced.

## Day 12 — CEFR skill and content taxonomy

- Added the `taxonomy` Django app and initial schema.
- Added Persian-first bilingual taxonomy seed data.
- Added stable UUID/slugs, release history, node revisions, deprecation and prerequisite history.
- Added idempotent/cycle-safe taxonomy import and public read-only lookup endpoints.
- Added admin editors with destructive-delete protection.
- Added interactive frontend Taxonomy & Curriculum Explorer at `/operations/taxonomy` and `/content/taxonomy` with live search, skill/CEFR/kind filtering, prerequisite inspection, and one-click UUID/slug copying.
- Polished public website copy: removed internal roadmap day numbers across marketing pages and consent modals, replacing them with professional, learner-centric copy while preserving Day 04-09 contracts.
- Configured backend in-memory SQLite test fallback in `apps/api/endoora_api/settings/test.py` for reliable offline test runs across all 108 regression tests.

## Day 12 verification
- Applied `taxonomy.0001_initial`.
- Imported `day12-v1`: 62 nodes, 62 revisions, 9 active prerequisite relationships.
- Verified idempotent re-import with zero duplicate changes.
- `python manage.py test taxonomy` — PASS, 12 tests.
- Taxonomy hardening: deprecated detail records are hidden by default, prerequisite cycles are rejected at model validation, and revisions are immutable.
- `python manage.py test` — PASS, 108 tests in the current regression suite.
- `npm run lint`, `npm run typecheck`, and `npm run build` — PASS.
- Persian-default and explicit-English taxonomy API checks — PASS.
- Django admin protection checks — PASS.
- 360 px and desktop regression checks — PASS.
- Secret scan and `git diff --check` — PASS.

## Day 13 — Versioned question bank schema
- Added `questions` Django domain and `questions.0001_initial`.
- Added immutable versions, review/retirement, copyright metadata, taxonomy objective links, answer normalization, and media metadata.
- Hardened `PROTECTED_LEARNER_KEYS` to block `correct_option`, `correct_options`, `pairs`, `order`, `solution`, and `explanation` in `learner_payload`.
- Hardened standalone `QuestionObjectiveAdmin` and `QuestionMediaAdmin` with delete/change guards for published and retired versions.
- Added learner-safe and editor-only APIs with strict role boundaries (support role receives 403).
- Added interactive Persian-first question bank preview with English switch, CEFR/type filtering, and live answer checking with immediate explanation feedback at `/content/questions`.
- Added draft-only JSON import/export, tests, backup/check/finalize scripts, and governance.
- Polished public marketing copy, teacher resources guidance, and teacher question bank roadmap notices.

## Day 13 verification
- Applied `questions.0001_initial`.
- Verified nine question types and stable parent/version separation.
- Verified immutable published/retired content and publication rights requirements.
- Verified learner answer-key redaction and editor/support permission separation.
- Verified conservative normalization and post-submission explanation flow.
- Verified draft-only idempotent JSON import.
- Verified Persian-first RTL preview, English option, and English LTR isolation.
- Backend regression (108 tests), frontend lint/typecheck/build (108 static routes), secret scan, and diff gate passed.

## Day 14 — Multi-stage placement-test session engine
- Built resumable placement test session engine (`PlacementSession` and `PlacementAnswer`).
- Added server-side session expiration (`expires_at`, 2 hours default) with active status management.
- Added server-side answer idempotency protection via unique `idempotency_key` and server timestamps.
- Added optional `question_version` foreign key on `PlacementAnswer` linking to Day 13 question bank version.
- Enforced object-level user ownership: only session owner can view or submit answers (`user=request.user` query scoping returning 404 for other users).
- Enforced session lifecycle: rejected answer mutations on expired or already-submitted sessions.
- Enforced anti-leak security boundaries: placement question and session serializers strictly exclude answer keys, correct options, rubrics, solutions, and explanations.
- Created Persian-first interactive `PlacementRunner` component with English language toggle, isolated LTR English passages, mobile 360 px responsiveness, design-token styling, and zero raw hex colors.
- Replaced leaked roadmap copy in marketing and documentation with professional production copy.
- Applied database migration `placement.0002_alter_placementanswer_options_and_more`.

## Day 14 verification
- Applied `placement.0002_alter_placementanswer_options_and_more`.
- Verified pre-Day-14 PostgreSQL backup outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day14\20260820-140000\endoora-pre-day14.dump`).
- Verified all 13 placement unit tests and 121 total backend regression tests pass with 0 errors.
- Verified pre-submission question payload contains no answer keys, rubrics, or explanations.
- Verified user isolation: User B cannot view or submit answers to User A's session.
- Verified expired and submitted session mutation rejections.
- Verified idempotent answer saving on network retries.
- Verified Next.js production build (108 static routes generated), typecheck, and lint pass with 0 errors.
- Static check `scripts/check_day14.py`, secret scan, and git diff cleanliness pass.

## Day 15 — Implement grammar, vocabulary, and reading placement sections
- Calibrated 11 core placement items in `data/placement/core-items.json`: 4 Grammar, 4 Vocabulary, and 3 Reading with passages.
- Separated `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Implemented honest assessment scoring services in `apps/api/assessment/services.py` producing empirical section results, accurate score breakdowns, and transparent educational disclaimers.
- Adhered strictly to Product Constitution Rule #8: no premature, definitive, or official CEFR claims before full multi-stage assessment completion.
- Connected placement submission flow to store learner responses in `PlacementResponse` model for permanent audit records.
- Added session summary API endpoint `GET /api/placement/sessions/<id>/summary/` strictly scoped to session owner.
- Added section filtering to questions endpoint (`?section=grammar|vocabulary|reading`) with pre-submission sanitization preventing answer leaks.
- Upgraded `PlacementRunner` component with multi-stage section pills, Persian prompt support, and live autosave badge.
- Redesigned `/placement/report` into a responsive, live-connected skill report page.
- Polished all 11 learner subpages (`/progress`, `/review`, `/mistakes`, `/badges`, `/twin`, `/practice-ai`, `/writing`, `/roleplay`, `/voice`, `/listening`, `/pronunciation`) into full `.learner-card` layouts with design-token styling and accessible Persian-first UI.

## Day 15 verification
- Pre-Day-15 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`.
- Backend unit tests pass: 5 assessment tests, 16 placement tests, and all 129 regression tests pass with 0 errors.
- Pre-submission payload protection verified: zero answer keys, solutions, rubrics, or explanations exposed.
- Automated static checks `check_day15.py`, `check_day14.py`, `check_day13.py`, `check_day12.py`, `check_day11.py`, `check_day09.py`, `check-public-site.mjs`, `check-day10.mjs`, `check-day01-10.mjs`, `check-components.mjs`, `check-design-tokens.mjs`, and `scan_secrets.py` all pass.

## Day 16 — Implement listening placement section with audio player and waveform
- Added 4 calibrated Listening test items in `data/placement/core-items.json` across CEFR levels (A1 gist, A2 detail, B1 inference, B2 academic talk), bringing total core placement items to 15.
- Generated lightweight, standard PCM WAV audio assets in `apps/web/public/audio/placement/` for reliable client-side playback without external network latency.
- Separated `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Stored audio transcripts server-side only; learner pre-submission serializers strictly purge transcripts, answer keys, solutions, and rubrics.
- Updated assessment scoring services in `apps/api/assessment/services.py` to evaluate listening section responses and produce empirical diagnostic evidence and honest disclaimers.
- Updated `seed_placement_sections` command to validate all 15 placement items across grammar, vocabulary, reading, and listening sections.
- Created accessible `AudioWaveformPlayer` component with 32-bar visual amplitude scrubber, play limit enforcement (default 2 plays), speed toggle (0.8x, 1.0x, 1.2x), time display, volume controls, and keyboard navigation.
- Created `audio-player.module.css` with 100% tokenized CSS and zero raw hex colors.
- Enhanced `PlacementRunner` with 4-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening) and rendered `AudioWaveformPlayer` for listening items.
- Upgraded `/placement/report` to display verified listening scores, answered counts, and target objectives.
- Upgraded `/listening` into an interactive Listening Lab preview with an embedded sample player and CEFR dimension cards.
- Upgraded `/placement/listening-ready` with direct navigation to placement test and listening lab.

## Day 16 verification
- Pre-Day-16 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`.
- Backend unit tests pass: 6 assessment tests, 16 placement tests, and 130 full regression tests pass with 0 errors.
- Pre-submission payload protection verified: zero transcripts, answer keys, or solutions leaked.
- User isolation verified: User B cannot access or summarize User A's placement session.
- Frontend Next.js production build passes (108/108 static routes generated), 0 lint warnings/errors, and 0 typecheck errors.
- Automated static checks `check_day16.py`, `check_day15.py`, `check_day14.py`, `check_day13.py`, `check_day12.py`, `check_day11.py`, `check_day09.py`, `check-public-site.mjs`, `check-day10.mjs`, `check-day01-10.mjs`, `check-components.mjs`, `check-design-tokens.mjs`, and `scan_secrets.py` all pass.

## Day 17 — Implement speaking placement section with audio recording and STT diagnostic
- Added 4 calibrated Speaking test items in `data/placement/core-items.json` across CEFR levels (A1 self intro, A2 daily routine, B1 memorable experience, B2 remote work opinion), bringing total core placement items to 19 across all 5 sections.
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept speaking target keywords and evaluation rubrics isolated server-side; pre-submission serializers strictly purge keywords, rubrics, and model answers while exposing safe `recording_time_limit_sec` and `min_words_expected`.
- Implemented speaking diagnostic evaluation service in `apps/api/assessment/services.py` analyzing word count, sufficiency against `min_words`, and topical keyword coverage.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 5 sections: Grammar, Vocabulary, Reading, Listening, Speaking).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 19 placement items across all 5 sections.
- Created accessible `AudioRecorder` component with start/stop/re-record controls, sound level meter, recording timer (60-90s auto-stop), audio playback preview, and real-time Speech-to-Text (STT) transcript preview using browser SpeechRecognition API.
- Created accessible text fallback input for learners without microphone permissions or hardware support.
- Created `audio-recorder.module.css` with 100% tokenized CSS and zero raw hex colors.
- Enhanced `PlacementRunner` with 5-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking) and rendered `AudioRecorder` for speaking questions.
- Upgraded `/placement/report` to display all 5 skill cards, verified speaking scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/voice` into an interactive Voice & Speaking Lab sandbox with live mic testing, STT preview, and direct placement test links.
- Upgraded `/pronunciation` with direct navigation to the voice sandbox and speaking placement test.

## Day 17 verification
- Pre-Day-17 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`.
- Backend unit tests pass: 8 assessment tests, 18 placement tests, and 133 full regression tests pass with 0 errors.
- Pre-submission payload protection verified: zero target keywords, rubrics, answer keys, or transcripts leaked.
- User isolation verified: User B cannot access or summarize User A's placement session.
- Frontend Next.js production build passes (108/108 static routes generated), 0 lint warnings/errors, and 0 typecheck errors.
- Automated static checks `check_day17.py`, `check_day16.py`, `check_day15.py`, `check_day14.py`, `check_day13.py`, `check_day12.py`, `check_day11.py`, `check_day09.py`, `check-public-site.mjs`, `check-day10.mjs`, `check-day01-10.mjs`, `check-components.mjs`, `check-design-tokens.mjs`, and `scan_secrets.py` all pass.

## Day 18 — Implement writing placement section with rich text editor and automated evaluation
- Added 4 calibrated Writing test items in `data/placement/core-items.json` across CEFR levels (A1 postcard email, A2 everyday event, B1 opinion essay, B2 workplace report), bringing total core placement items to 23 across all 6 sections (Grammar, Vocabulary, Reading, Listening, Speaking, Writing).
- Strictly decoupled `difficulty` (`easy`, `medium`, `hard`) from `cefr_level` (`A1`, `A2`, `B1`, `B2`).
- Kept writing target keywords, model answers, and evaluation rubrics isolated server-side; pre-submission serializers strictly purge keywords and rubrics while exposing safe `min_words_expected` and `max_words_expected`.
- Implemented writing automated evaluation service in `apps/api/assessment/services.py` analyzing word count, length sufficiency, topical vocabulary coverage, sentence structure, and vocabulary diversity.
- Implemented multi-stage overall score calculation adhering strictly to `docs/assessment/scoring-model.md`: `sum(section scores) / number of sections` (all 6 sections: Grammar, Vocabulary, Reading, Listening, Speaking, Writing).
- Implemented provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence, strictly observing Product Constitution Rule #8 on no premature or certified CEFR claims.
- Updated `seed_placement_sections` command to validate all 23 placement items across all 6 sections.
- Created accessible `WritingEditor` component with formatting toolbar (Bold, Italic, Bulleted List, Numbered List, Clear), word/character/sentence counters, progress meter toward minimum words, and autosave.
- Created `writing-editor.module.css` with 100% tokenized CSS and zero raw hex colors.
- Enhanced `PlacementRunner` with 6-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking -> Writing) and rendered `WritingEditor` for writing questions.
- Upgraded `/placement/report` to display all 6 skill cards, verified writing scores and objectives, and overall provisional CEFR estimate badge with honest disclosures.
- Upgraded `/writing` into an interactive Writing Mentor & Essay Lab sandbox with embedded rich editor, CEFR prompt presets (A1-B2), live diagnostic feedback, and direct placement test links.

## Day 18 verification
- Pre-Day-18 PostgreSQL backup verified: `PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`.
- Backend unit tests pass: 10 assessment tests, 18 placement tests, and 135 full regression tests pass with 0 errors.
- Pre-submission payload protection verified: zero target keywords, rubrics, answer keys, or model texts leaked.
- User isolation verified: User B cannot access or summarize User A's placement session.
- Frontend Next.js production build passes (108/108 static routes generated), 0 lint warnings/errors, and 0 typecheck errors.
- Automated static checks `check_day18.py`, `check_day17.py`, `check_day16.py`, `check_day15.py`, `check_day14.py`, `check_day13.py`, `check_day12.py`, `check_day11.py`, `check_day09.py`, `check-public-site.mjs`, `check-day10.mjs`, `check-day01-10.mjs`, `check-components.mjs`, `check-design-tokens.mjs`, and `scan_secrets.py` all pass.
