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
| 12 | CEFR skill and content taxonomy | Complete | Taxonomy acceptance and explorer passed; pushed |
| 13 | Versioned question bank schema | Complete | Question-bank acceptance passed; pushed |
| 14 | Multi-stage placement session engine | Complete | Placement session acceptance passed; pushed |
| 15 | Grammar, vocabulary, and reading placement sections | Complete | Scoring, session summary, and report passed; pushed |
| 16 | Listening placement section with waveform audio player | Complete | Listening engine, audio scrubber, and report passed; pushed |
| 17 | Speaking placement section with audio recorder & STT | Complete | Voice diagnostic, STT preview, and report passed; pushed |
| 18 | Writing placement section with rich editor & scoring | Complete | Rich writing editor, CEFR evaluation, and report passed; pushed |
| 19 | Personal learning path engine & interactive experience | Complete | Placement-derived path, timeline, and growth skills passed; pushed |
| 20 | Adaptive daily mission engine & Wireframe 2 experience | Complete | Daily mission planner, payload protection, and Wireframe 2 passed; pushed |
| 21 | SRS vocabulary engine & full website UI/UX overhaul | Complete | Transparent SM-2, leech handling, approval inbox, vocabulary hub, and UI/UX overhaul passed |
| 22 | Structured AI Exercise-Generation Service & Model Router | Complete | OpenRouter client, circuit breaker, fail-safe fallbacks, pre-submission protection passed |
| 23 | AI Mistake Genome & Error Taxonomy Architecture | Complete | 8 mistake categories, multi-event threshold, dispute workflows, privacy scrubbing passed |
| 24 | Writing Mentor v1 & IELTS Rubric Engine | Complete | 4-criteria IELTS rubric ranges, 3-tier rewrites, voice preservation, selective Genome passed |
| 25 | Text-Based Roleplay Universe v1 | Complete | 10 scenarios, zero mid-turn interruptions, bounded turns, deferred diagnostic report passed |
| 26 | Build Voice Lab v1 & Voice Conversation Beta | Complete | Validated beta, upload ticket caps, text fallback, STT editing, biometric retention passed |
| 27 | Build Pronunciation Lab v1 & Speech Intelligibility Trends | Complete | Formative pacing, pauses, syllable stress, Persian L1 catalog, and genome bridge passed |
| 28 | Build Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules | Complete | Financial-grade XP ledger, 20-level curve, timezone-aware streaks, freeze shields, and Rule #7/#8 compliance passed |
| 29-60 | Remaining roadmap | Not started | Sequential |

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

## Day 14 — Multi-stage placement-test session engine

Status: Complete and verified; ready for Git commit and push.

- [x] verified pre-Day-14 PostgreSQL backup
- [x] `placement.0002_alter_placementanswer_options_and_more`
- [x] `PlacementSession` and `PlacementAnswer` models with lifecycle states
- [x] server-side expiration handling (`expires_at`, 2 hours default)
- [x] server-side idempotency protection with unique `idempotency_key`
- [x] question version linkage (`question_version_id`)
- [x] object-level user ownership isolation
- [x] session finalization (`submitted`) and mutation protection
- [x] pre-submission answer-key redaction in learner endpoints
- [x] Persian-first interactive `PlacementRunner` with English switch
- [x] English learning text isolated as LTR
- [x] responsive 360 px layout without overflow
- [x] tokenized styling without raw hex colors
- [x] backend/frontend regression suite (121 tests pass)
- [x] static check `check_day14.py` passes

**Success gate:** multi-stage placement session engine provides secure, resumable, and idempotent test sessions linked to versioned content.

**Next day after Git push:** Day 15 — Implement grammar, vocabulary, and reading placement sections.

## Day 15 — Implement grammar, vocabulary, and reading placement sections

Status: Complete and verified; ready for Git commit and push.

- [x] verified pre-Day-15 PostgreSQL backup outside Git
- [x] calibrated 11 core placement items in `data/placement/core-items.json` across Grammar, Vocabulary, and Reading
- [x] strictly separated `difficulty` from `cefr_level`
- [x] implemented honest section scoring in `apps/api/assessment/services.py`
- [x] adhered to Product Constitution Rule #8 on no premature CEFR claims
- [x] stored responses in `PlacementResponse` model for audit trail and learner profile
- [x] created user-isolated `PlacementSessionSummaryView` (`GET /api/placement/sessions/<id>/summary/`)
- [x] section filtering on question endpoints (`?section=grammar|vocabulary|reading`)
- [x] pre-submission anti-leak payload protection across API endpoints
- [x] enhanced `PlacementRunner` with multi-stage section pills, Persian prompts, and live autosave badge
- [x] responsive, live-connected `/placement/report` with honest assessment disclosures
- [x] polished all learner subpages into functional, tokenized, accessible layouts
- [x] 129 backend regression tests passing
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `check_day15.py` and secret scan passing

**Success gate:** learners can complete multi-stage Grammar, Vocabulary, and Reading placement sections with autosave, server-side scoring, and honest evidence-based reports without leaked answers or premature CEFR claims.

**Next day after Git push:** Day 16 — Implement listening placement section with audio player and waveform.

## Day 16 — Implement listening placement section with audio player and waveform

Status: Complete and verified; pushed to GitHub.

- [x] verified pre-Day-16 PostgreSQL backup outside Git
- [x] calibrated 15 core placement items including 4 Listening items in `data/placement/core-items.json`
- [x] generated standard PCM WAV audio assets in `apps/web/public/audio/placement/`
- [x] strictly separated `difficulty` from `cefr_level`
- [x] implemented server-side listening evaluation in `apps/api/assessment/services.py`
- [x] adhered to Product Constitution Rule #8 on no premature CEFR claims
- [x] stored listening responses in `PlacementResponse` model for audit trail and learner profile
- [x] updated session summary endpoint to compute listening section scores and evidence
- [x] added `?section=listening` query filtering and pre-submission payload protection (no transcript leaks)
- [x] built `AudioWaveformPlayer` component with 32-bar visual waveform scrubber, speed control, play limit counter
- [x] 100% tokenized CSS in `audio-player.module.css` with 0 raw hex colors
- [x] enhanced `PlacementRunner` with 4-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening)
- [x] live listening score, answered count, and objectives rendered in `/placement/report`
- [x] upgraded `/listening` page with interactive sample player and dimension explorer
- [x] 130 backend regression tests passing
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `check_day16.py` and secret scan passing

**Success gate:** learners can complete interactive listening placement questions with standard in-browser audio playback, waveform scrubbing, play limit tracking, and receive empirical section scoring without leaked transcripts or false certification claims.

**Next day after Git push:** Day 17 — Implement speaking placement section with audio recording and STT diagnostic.

## Day 17 — Implement speaking placement section with audio recording and STT diagnostic

Status: Complete and verified; pushed to GitHub.

- [x] verified pre-Day-17 PostgreSQL backup outside Git
- [x] calibrated 19 core placement items including 4 Speaking items in `data/placement/core-items.json`
- [x] strictly separated `difficulty` from `cefr_level`
- [x] server-side speaking rubrics and target keywords isolated without leaks
- [x] implemented speaking diagnostic evaluation service in `apps/api/assessment/services.py`
- [x] multi-stage overall score calculated as 5-section average adhering to `docs/assessment/scoring-model.md`
- [x] provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence
- [x] adhered to Product Constitution Rule #8 on honest assessment without premature CEFR claims
- [x] stored speaking responses in `PlacementResponse` model for audit trail and learner profile
- [x] updated session summary endpoint to compute speaking section scores, objectives, and `estimated_cefr_level`
- [x] added `?section=speaking` query filtering and pre-submission payload protection
- [x] built accessible `AudioRecorder` component with sound level meter, timer, audio review playback, and Web Speech STT preview
- [x] built accessible text fallback input for learners without microphone permissions
- [x] 100% tokenized CSS in `audio-recorder.module.css` with 0 raw hex colors
- [x] enhanced `PlacementRunner` with 5-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking)
- [x] live speaking score, answered count, objectives, and overall provisional CEFR badge rendered in `/placement/report`
- [x] upgraded `/voice` into an interactive Voice & Speaking Lab sandbox with live mic testing and STT preview
- [x] upgraded `/pronunciation` with direct navigation to voice sandbox and speaking placement test
- [x] 133 backend regression tests passing
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `check_day17.py` and secret scan passing

**Success gate:** learners can complete interactive speaking placement questions with audio recording, real-time STT preview, accessible text fallback, and receive transparent multi-stage section scoring and provisional CEFR estimates without leaked rubrics or false certification claims.

**Next day after Git push:** Day 18 — Implement writing placement section with rich text editor and automated evaluation.

## Day 18 — Implement writing placement section with rich text editor and automated evaluation

Status: Complete and verified; pushed to GitHub.

- [x] verified pre-Day-18 PostgreSQL backup outside Git
- [x] calibrated 23 core placement items including 4 Writing items in `data/placement/core-items.json`
- [x] strictly separated `difficulty` from `cefr_level`
- [x] server-side writing rubrics and target keywords isolated without leaks
- [x] implemented writing automated evaluation service in `apps/api/assessment/services.py`
- [x] multi-stage overall score calculated as 6-section average adhering to `docs/assessment/scoring-model.md`
- [x] provisional CEFR level estimate mapping (A1 to C1) grounded in verified evidence
- [x] adhered to Product Constitution Rule #8 on honest assessment without premature CEFR claims
- [x] stored writing responses in `PlacementResponse` model for audit trail and learner profile
- [x] updated session summary endpoint to compute writing section scores, objectives, and 6-section `estimated_cefr_level`
- [x] added `?section=writing` query filtering and pre-submission payload protection
- [x] built accessible `WritingEditor` component with formatting toolbar (Bold, Italic, Lists, Clear), word/character/sentence counters, progress meter toward minimum words, and autosave
- [x] 100% tokenized CSS in `writing-editor.module.css` with 0 raw hex colors
- [x] enhanced `PlacementRunner` with 6-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking -> Writing)
- [x] live writing score, answered count, objectives, and overall provisional CEFR badge rendered in `/placement/report`
- [x] upgraded `/writing` into an interactive Writing Mentor & Essay Lab sandbox with embedded rich editor, CEFR prompt presets (A1-B2), live diagnostic feedback, and direct placement test links
- [x] 135 backend regression tests passing
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `check_day18.py` and secret scan passing

**Success gate:** learners can complete interactive writing placement questions with rich text formatting, live word counters and progress meters against CEFR requirements, and receive transparent multi-stage section scoring and provisional CEFR estimates without leaked rubrics or false certification claims.

**Next day after Git push:** Day 19 — Personal Learning Path.

## Day 19 — Personal Learning Path Engine & Interactive Path Experience

Status: Pushed to GitHub (`95f3b71`).

- [x] verified pre-Day-19 PostgreSQL backup outside Git
- [x] implemented dynamic learning path engine in `apps/api/learner_twin/path.py`
- [x] connected learning path to verified 6-section placement session evidence
- [x] derived provisional CEFR level estimate and ranked priority growth skills by score
- [x] generated targeted pedagogical recommendations and direct practice links (`/writing`, `/voice`, `/review`, `/listening`, `/practice-ai`)
- [x] derived explainable 5-phase progress timeline with semantic states (`complete`, `current`, `upcoming`, `planned`, `locked`) without fake precision
- [x] strictly adhered to Product Constitution Rule #8 on honest assessment without premature or certified CEFR claims
- [x] extended `LearningPathSerializer` in `apps/api/learner_twin/serializers.py`
- [x] dual-routed API at `/api/learner-twin/path/` and `/api/path/`
- [x] 4 unit tests in `apps/api/learner_twin/tests.py` passing
- [x] upgraded `/path` in `apps/web/app/(learner)/path/page.tsx` with unplaced onboarding and placed personalized dashboards
- [x] 100% tokenized CSS in `apps/web/app/(learner)/path/path.module.css` with 0 raw hex colors
- [x] completed Wireframe 1 flow linking `/placement/report` and `/dashboard` directly to `/path`
- [x] 140 backend regression tests passing
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `check_day19.py` and secret scan passing

**Success gate:** learners can receive a personalized, evidence-grounded learning path directly calibrated from their 6-skill placement results, featuring prioritized growth skills, explainable progress timelines, dominant next actions, and honest educational disclosures without fabricated progress percentages or premature certification claims.

## Day 20 — Adaptive Daily Mission Engine & Wireframe 2 Interactive Experience

Status: Complete and verified; ready for Git commit and push.

- [x] verified pre-Day-20 PostgreSQL backup outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day20\20260821-120000\endoora-pre-day20.dump`)
- [x] implemented `DailyMission` helper methods in `apps/api/missions/models.py`
- [x] implemented evidence-driven adaptive mission generator in `apps/api/missions/services.py` targeting lowest scoring skill across 6 sections
- [x] implemented diagnostic readiness onboarding mission for unplaced learners driving to `/placement`
- [x] implemented 3 curated pedagogical micro-tasks per skill (Grammar, Vocabulary, Reading, Listening, Writing, Speaking, and Readiness)
- [x] implemented `start_daily_mission`, `submit_mission_step`, and `resolve_mission_next_action`
- [x] enforced pre-submission payload protection in `DailyMissionSerializer` (omitting answer keys before submission)
- [x] routed `/api/missions/` with `today/`, `today/start/`, `today/submit-step/`, and `today/reset/`
- [x] 8 automated unit tests in `apps/api/missions/tests.py` passing with 0 errors
- [x] 148 full backend regression tests passing
- [x] rebuilt `/today` in `apps/web/app/(learner)/today/page.tsx` implementing full Wireframe 2 flow (overview -> task -> instant feedback -> complete)
- [x] 100% tokenized CSS in `apps/web/app/(learner)/today/today.module.css` with 0 raw hex colors
- [x] configured redirect from `/learner/today` to `/today` in `apps/web/next.config.ts`
- [x] adhered strictly to Product Constitution Rule #8 transparent educational claims
- [x] Next.js 108 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `scripts/check_day20.py` and secret scan passing

**Success gate:** returning learners answer "What should I do now?" in 5 seconds via a dominant Today mission on Home, proceed through an explainable 3-step interactive practice flow, receive instant pedagogical feedback without answer leaks, and finish with a clear next best action.

## Day 21 — Spaced Repetition System (SRS) Vocabulary Engine & Full Website UI/UX Overhaul

Status: Complete and verified; ready for Git commit and push.

- [x] verified pre-Day-21 PostgreSQL backup outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day21\20260822-090000\endoora-pre-day21.dump`)
- [x] implemented `SrsCandidate`, enhanced `SrsItem`, and `SrsReview` in `apps/api/srs/models.py`
- [x] enforced lemma and part-of-speech deduplication with unique database constraint
- [x] implemented candidate extraction pipeline with traceable source sentences
- [x] implemented learner candidate approval/ignore gate preventing the "Auto-saving every word" trap
- [x] implemented transparent SM-2 interval scheduler with ratings: 1=Again, 2=Hard, 3=Good, 4=Easy
- [x] implemented lapse counter and leech detection (`is_leech=True` when `lapse_count >= 4`)
- [x] implemented anti-spam protection against rapid burst clicks (<300ms)
- [x] implemented bad AI meaning correction and personal context deletion
- [x] integrated `srs_due_count` into `DailyMissionSerializer` and `/today` UI
- [x] generated Django migration `0002_srscandidate_alter_srsitem_options_and_more.py`
- [x] 10 unit tests in `apps/api/srs/tests.py` passing
- [x] 113 full backend regression tests passing
- [x] built interactive Vocabulary Hub in `apps/web/app/(learner)/vocabulary/page.tsx` with 4 tabs
- [x] 100% tokenized CSS in `apps/web/app/(learner)/vocabulary/vocabulary.module.css` with 0 raw hex colors
- [x] upgraded `/review` with in-place meaning editor, transparent interval previews, and leech warning badges
- [x] completed rigorous end-to-end UI/UX overhaul across public, learner, teacher, and account pages
- [x] Next.js 109 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static check `scripts/check_day21.py`, secret scan, and `git diff --check` passing

**Success gate:** learners can extract candidate vocabulary from real writing, conversation, and reading activity, approve cards into an active SRS deck with editable meanings, review with transparent SM-2 intervals, and have difficult leeches flagged for active sentence synthesis rather than repetitive flashcards.

---

### Day 22 — Build the structured AI exercise-generation service

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day22\20260823-090000\endoora-pre-day22.dump`)
- [x] implemented AI Gateway models (`AIProviderConfig`, `AIRequestLog`, `GeneratedExerciseSet`, `ExerciseAttempt`) in `apps/api/ai_gateway/models.py`
- [x] generated and verified migration `apps/api/ai_gateway/migrations/0001_initial.py` with 0 model drift
- [x] created backend-only OpenRouter HTTP client (`client.py`) with 15s timeout circuit breaker, daily budget cap ($5.00/day), and error/key redaction
- [x] implemented multi-tier model router (`model_router.py`) without single free-model hardcoding
- [x] created versioned prompt registry (`prompt_registry.py`) with schema-bound formatting
- [x] implemented strict JSON, CEFR, distractor ambiguity, and internal consistency validator (`validators.py`)
- [x] built `StructuredExerciseService` (`services.py`) with 2-attempt retry loop and automatic fallback to reviewed question bank
- [x] implemented pre-submission payload protection in `GeneratedExerciseSetLearnerSerializer` (`serializers.py`), omitting correct options and explanations
- [x] built attempt evaluation, scoring, and bilingual explanation delivery (`POST /api/ai/exercises/<id>/submit/`)
- [x] created backward-compatible bridge packages in `apps/api/ai/` and `apps/api/exercises/`
- [x] 16 unit and integration tests passing in `apps/api/ai_gateway/tests.py`
- [x] 129 full backend tests passing across all apps with 0 errors
- [x] built interactive AI Exercise Generator & Runner at `/practice` (`apps/web/app/(learner)/practice/page.tsx`)
- [x] 100% tokenized CSS in `apps/web/app/(learner)/practice/practice.module.css` with zero raw hex colors
- [x] added tabbed navigation between `/practice`, `/practice-ai`, and `/review`
- [x] Next.js 110 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day22.py` passing
- [x] comprehensive architecture documentation in `docs/ai/model-routing.md`

**Success gate:** AI exercises are strictly validated by backend schema inspectors, answers and explanations are protected prior to submission, multi-tier routing avoids model lock-in, daily budget and timeout ceilings stop runaway calls, and any provider issue seamlessly falls back to reviewed questions without learner disruption.

**Next day after Git push:** Day 23 — Build the AI Mistake Genome.

## Day 23 — Build the AI Mistake Genome

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day23\20260824-090000\endoora-pre-day23.dump`)
- [x] implemented Mistake Genome models (`MistakeCategory`, `MistakeSeverity`, `MistakeStatus`, `LearnerMistakePattern`, `MistakeEvidence`) in `apps/api/mistake_genome/models.py`
- [x] generated and verified migration `apps/api/mistake_genome/migrations/0001_initial.py` with 0 model drift
- [x] enforced multi-event evidence threshold (>= 2 occurrences required before graduating from occasional slip to recurring pattern)
- [x] implemented learner dispute and correction workflow (`POST /api/mistakes/patterns/<id>/dispute/`), suppressing disputed patterns immediately from practice recommendations
- [x] implemented learner resolution workflow (`POST /api/mistakes/patterns/<id>/resolve/`), marking pattern as mastered
- [x] implemented privacy scrubbing and evidence deletion (`DELETE /api/mistakes/evidence/<id>/`), sanitizing personal snippets
- [x] integrated mistake targets into Daily Mission recommendations (`apps/api/missions/services.py`)
- [x] integrated AI exercise error capture into `StructuredExerciseService` (`apps/api/ai_gateway/services.py`), deriving focus areas and recording mistakes automatically
- [x] 10 unit tests in `apps/api/mistake_genome/tests.py` passing with 0 errors
- [x] 139 full backend tests passing across all 11 applications
- [x] built interactive Mistake Hub at `/mistakes` (`apps/web/app/(learner)/mistakes/page.tsx`) with 4 status tabs (Recurring, Occasional, Mastered, Disputed), L1 interference root-cause explanations, quick-checks, dispute drawer, and direct links to `/practice`
- [x] 100% tokenized CSS in `apps/web/app/(learner)/mistakes/mistakes.module.css` with 0 raw hex colors
- [x] Next.js 110 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day23.py` passing
- [x] comprehensive taxonomy documentation in `docs/ai/mistake-taxonomy.md`
- [x] adhered strictly to Product Constitution Rule #8 transparent educational notices and zero-shame pedagogical framing

**Success gate:** errors are treated as diagnostic growth opportunities rather than permanent labels; multi-event evidence thresholds prevent slips from being branded as recurring habits; learner dispute empowers students to correct false AI categorizations and stop unwarranted drills; and all personal snippets remain strictly private and scrubbable.

**Next day after Git push:** Day 24 — Build Writing Mentor v1.

## Day 24 — Build Writing Mentor v1

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day24\20260825-090000\endoora-pre-day24.dump`)
- [x] implemented Writing Mentor models (`WritingDraft`, `WritingAnalysis`) in `apps/api/writing_mentor/models.py` with version tracking and parent-revision chaining
- [x] generated and verified migration `apps/api/writing_mentor/migrations/0001_initial.py` with 0 model drift
- [x] built formative writing evaluation engine in `apps/api/writing_mentor/services.py` with 4-criteria IELTS rubric (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy)
- [x] strictly enforced score ranges (e.g. Band 6.0 – 6.5) and Rule #8 transparent disclaimers (never uncertified single bands)
- [x] implemented three-tier graduated reference rewrites (A2 accessible, B2 academic, C2 nuanced) with prominent learner voice preservation disclaimer
- [x] implemented categorized error annotations distinguishing objective grammatical errors from optional stylistic recommendations
- [x] implemented actionable revision coaching tasks checklist
- [x] implemented selective Mistake Genome integration: only accepted corrections call `MistakeGenomeService.record_mistake()`, while dismissed corrections are completely omitted
- [x] created backward-compatibility bridge package in `apps/api/writing/`
- [x] 10 unit tests in `apps/api/writing_mentor/tests.py` passing with 0 errors
- [x] 149 full backend tests passing across all 12 applications
- [x] built interactive Writing Mentor & Essay Lab at `/writing` (`apps/web/app/(learner)/writing/page.tsx`) with embedded rich `WritingEditor`, stopwatch/timer widget, prompt presets (A1-C2 + IELTS Task 1 & 2), metrics, confirmation modal, interactive error actions, and revision workflow
- [x] 100% tokenized CSS in `apps/web/app/(learner)/writing/writing.module.css` with 0 raw hex colors
- [x] Next.js 110 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day24.py` and regression checks `scripts/check_day14.py` through `scripts/check_day23.py` passing
- [x] comprehensive architecture and rubric documentation in `docs/ai/writing-rubric.md` and updated `docs/learning/writing-mentor.md`

**Success gate:** learners receive formative writing correction and revision coaching that preserves their authentic voice through illustrative graduated examples, transparent IELTS rubric ranges without fake certification claims, clear separation between grammar errors and style advice, and user-controlled Mistake Genome updates.

**Next day after Git push:** Day 25 — Build text-based Roleplay Universe v1.

## Day 25 — Build text-based Roleplay Universe v1

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day25\20260826-090000\endoora-pre-day25.dump`)
- [x] created 10 comprehensive scenario specifications in `data/scenarios/` covering A2 through C1 levels (`airport`, `hotel`, `restaurant`, `shopping`, `travel`, `university`, `job_interview`, `business`, `friendly_chat`, `ielts_speaking`)
- [x] implemented Roleplay models (`RoleplaySession`, `RoleplayMessage`, `RoleplayReport`) in `apps/api/roleplay/models.py` with anti-exploit `xp_awarded` boolean guard and turn tracking
- [x] generated and verified migration `apps/api/roleplay/migrations/0001_initial.py` with 0 model drift
- [x] built conversational simulation engine in `apps/api/roleplay/services.py` with strict adherence to:
  - zero mid-turn interruptions (in-character replies never disrupt conversational flow with red grammar lectures)
  - in-character prompt injection defense (polite character redirects that preserve persona without leaking system prompts)
  - bounded token consumption (strict `max_turns` limit of 8–10 turns and 500-char user message caps)
  - deferred post-conversation diagnostic report generation
  - anti-exploit completion XP (awarded strictly once upon scenario completion)
- [x] implemented dual downstream ecosystem integrations:
  - Mistake Genome: deferred grammatical errors can be accepted by the learner to call `MistakeGenomeService.record_mistake()`
  - SRS Deck: target vocabulary words can be saved directly to the learner's active flashcard review via `SrsItem`
- [x] implemented API endpoints in `apps/api/roleplay/views.py` and `urls.py` routed at `/api/roleplay/`
- [x] 11 unit tests in `apps/api/roleplay/tests.py` passing with 0 errors
- [x] 160 full backend tests passing across all 13 applications
- [x] built interactive Roleplay Universe experience at `/roleplay` (`apps/web/app/(learner)/roleplay/page.tsx`) with scenario catalog, live character chat with avatar and goal milestones progress bar, hints, quick suggestions, and post-conversation report view with interactive genome and SRS buttons
- [x] 100% tokenized CSS in `apps/web/app/(learner)/roleplay/roleplay.module.css` with 0 raw hex colors
- [x] Next.js 110 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day25.py` and regression checks `scripts/check_day14.py` through `scripts/check_day24.py` passing
- [x] comprehensive architecture documentation in `docs/ai/roleplay-engine.md` and updated `docs/learning/roleplay.md`

**Success gate:** learners engage in realistic, goal-oriented situational dialogues with AI characters that never break character with annoying mid-turn interruptions; all diagnostics and target vocabulary are thoughtfully organized in the post-conversation report for selective integration into their Mistake Genome and SRS deck; and gamification is strictly protected against token and XP exploits.

**Next day after Git push:** Day 26 — Build Voice Lab v1 & Voice Conversation Beta.

## Day 26 — Build Voice Lab v1 & Voice Conversation Beta

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day26\20260827-090000\endoora-pre-day26.dump`)
- [x] implemented Voice Lab models (`VoiceRecording`, aliased as `AudioAttempt`, and `VoicePreference`) in `apps/api/voice_lab/models.py` with biometric privacy retention lifecycle (`expires_at`, `is_deleted`)
- [x] generated and applied initial migration `apps/api/voice_lab/migrations/0001_initial.py` with 0 model drift
- [x] implemented audio pipeline engine in `apps/api/voice_lab/services.py` with strict adherence to:
  - hard limits on signed upload tickets: max 90 seconds duration and max 10MB file size to avoid proxying large audio blobs through frontend server nodes
  - background speech recognition with learner manual transcript editing capability
  - automated expired audio file purging while retaining anonymized learner learning transcripts
  - Text-to-Speech (TTS) response synthesis with configurable accents (US/UK) and playback speeds (0.8x, 1.0x, 1.2x)
- [x] implemented scheduled management command `apps/api/voice_lab/management/commands/cleanup_expired_audio.py` for automated retention purging
- [x] created backward-compatibility bridge package in `apps/api/speech/`
- [x] routed API endpoints in `apps/api/voice_lab/urls.py` and `apps/api/endoora_api/urls.py` at `/api/voice/` and `/api/speech/`
- [x] 11 unit tests in `apps/api/voice_lab/tests.py` passing with 0 errors
- [x] built `VoiceRecorder` frontend component (`apps/web/components/voice-recorder/VoiceRecorder.tsx`) with:
  - 24-bar live AudioContext frequency analyzer visualizer
  - 90-second countdown timer
  - audio playback preview
  - in-place transcript review and editing textarea
  - non-blocking graceful fallback text input when microphone is denied or unsupported
- [x] built interactive Voice Roleplay Beta experience at `/roleplay/voice` (`apps/web/app/(learner)/roleplay/voice/page.tsx`) with 10 situational scenarios, persona audio toolbar, turn-by-turn dialogue stream, TTS playback buttons, and post-conversation diagnostic report view
- [x] updated Voice Lab Hub at `/voice` (`apps/web/app/(learner)/voice/page.tsx`) with direct beta CTA and acoustic retention preferences manager
- [x] cross-linked Roleplay Universe at `/roleplay` (`apps/web/app/(learner)/roleplay/page.tsx`) with prominent Voice Roleplay Beta fast-track CTA
- [x] 100% tokenized CSS across all new CSS modules with 0 raw hex colors
- [x] static contract check `scripts/check_day26.py` and regression checks passing
- [x] comprehensive architecture documentation in `docs/ai/voice-pipeline.md` and updated `docs/learning/voice-pipeline.md`

**Success gate:** voice roleplay works as a clearly labelled beta without blocking text learning; learners can inspect live audio meter levels, edit automated STT transcripts before sending turns, customize voice accents and speech rates, and control audio retention periods; and audio binaries are automatically purged on expiration.

**Next day after Git push:** Day 27 — Build Pronunciation Lab v1.

## Day 27 — Build Pronunciation Lab v1 & Speech Intelligibility Trends

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day27\20260828-090000\endoora-pre-day27.dump`)
- [x] implemented Pronunciation Lab models (`PronunciationItem` and `PronunciationAttempt`) in `apps/api/pronunciation/models.py` with backward-compatibility accessors (`transcript`, `speech_rate`, `pauses`, `confidence`)
- [x] generated and applied initial migration `apps/api/pronunciation/migrations/0001_initial.py` with 0 model drift
- [x] implemented formative acoustic service in `apps/api/pronunciation/services.py`:
  - Curated Persian L1 interference catalog across 4 categories: `minimal_pairs`, `stress_shifts`, `consonant_clusters`, and `connected_speech`
  - Calculation of Words Per Minute (WPM), hesitation pause counting, and syllable stress alignment
  - Strict compliance with **Product Constitution Rule #8**: never fabricates unvalidated phoneme-level grading percentages or claims native-speaker accent diagnosis
  - Integration with Mistake Genome: `save_to_mistake_genome()` records pronunciation challenges to `LearnerMistakePattern` (`category="pronunciation"`)
  - Backward-compatible `analyze(audio)` bridge returning safe, non-fabricated metrics
- [x] routed API endpoints in `apps/api/pronunciation/urls.py` and `apps/api/endoora_api/urls.py` at `/api/pronunciation/`
- [x] 10 unit and integration tests in `apps/api/pronunciation/tests.py` passing with 0 errors
- [x] 226 full backend tests passing across all 15 applications with 0 errors
- [x] built interactive Pronunciation Lab page at `/pronunciation` (`apps/web/app/(learner)/pronunciation/page.tsx`):
  - Prominent **Product Constitution Rule #8 Banner** explaining pedagogical intelligibility principles
  - Interactive category filter pills with active counters
  - Phonological practice cards with IPA badges, stress indicators, Persian L1 callouts, and dual-accent (US/UK) / variable speed (0.85x/1.0x) audio playback
  - Speech Intelligibility Workbench with a live 24-bar audio visualizer, real-time recording, elapsed timer, and manual transcript fallback
  - Diagnostic feedback card displaying Intelligibility Trend Score (%), Speech Rate (WPM), Pauses, and Syllable Stress match
  - Interactive "Track Challenge in Mistake Genome" action button with live confirmation
  - **Shadowing Studio Guide** detailing the 3-step shadowing method with fast-track cross-links to Voice Lab (`/voice`) and Voice Roleplay Beta (`/roleplay/voice`)
- [x] 100% tokenized CSS in `apps/web/app/(learner)/pronunciation/pronunciation.module.css` with 0 raw hex colors and logical properties only
- [x] Next.js 111 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day27.py` and regression checks `scripts/check_day14.py` through `scripts/check_day26.py` passing 100%
- [x] comprehensive architecture documentation in `docs/ai/pronunciation-limitations.md` and `docs/learning/pronunciation-lab.md`

**Success gate:** Pronunciation Lab evaluates pacing (WPM), pauses, and syllable stress trends rather than fabricating fake phonemic scores; Persian L1 challenges are pedagogically addressed; learners can practice dual-accent shadowing; challenges bridge to Mistake Genome; and all contract checks pass.

**Next day after Git push:** Day 28 — Build Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules.

## Day 28 — Build Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules

Status: Complete and verified; ready for Git commit and push.

- [x] verified and created database backup before schema migration (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day28\20260829-090000\endoora-pre-day28.dump`)
- [x] implemented financial-grade gamification models in `apps/api/gamification/models.py`:
  - `XPCategory`: Activity categorizations (`mission`, `roleplay`, `srs`, `pronunciation`, `writing`, `placement`, `streak_bonus`, `system_adjustment`)
  - `XPTransaction`: Append-only immutable ledger with unique `source_event` idempotency keys preventing duplicate awarding
  - `LearnerStreak`: Daily learning streak tracking in `Asia/Tehran` calendar days with automatic freeze shield grace credits
  - `LearnerLevel`: Cumulative XP balance, level progression ranks, and transparent bilingual titles compliant with Rule #8
- [x] generated and applied initial migration `apps/api/gamification/migrations/0001_initial.py` with 0 model drift
- [x] implemented pedagogical progression service in `apps/api/gamification/services.py` (`GamificationService`):
  - 20-level pedagogical progression curve with quadratic thresholds and bilingual pedagogical rank titles
  - Idempotent `award_xp()` method with atomic database transactions and automatic level cache recalculation
  - Timezone-aware `record_activity()` managing consecutive days, same-day idempotency, freeze shield consumption, and 7-day milestone bonuses
  - `get_learner_gamification_profile()` aggregating levels catalog, streak metrics, and Rule #7/#8 educational disclaimers
  - Legacy `XPService.award()` backward compatibility wrapper
- [x] routed API endpoints in `apps/api/gamification/urls.py` and `apps/api/endoora_api/urls.py` at `/api/gamification/`:
  - `GET /api/gamification/summary/`: Learner profile and gamification summary
  - `GET /api/gamification/ledger/`: Paginated immutable XP audit log
  - `POST /api/gamification/award/`: Validated XP award endpoint
  - `GET /api/gamification/levels/`: Catalog of all 20 levels and XP requirements
- [x] dynamically integrated gamification ledger with Learner Dashboard (`apps/api/dashboard/services.py`) while preserving clean zero-state for new learners
- [x] 12 unit and integration tests in `apps/api/gamification/tests.py` passing with 0 errors
- [x] 238 full backend regression tests passing across all 16 applications with 0 errors
- [x] overhauled Progress and Analytics page at `/progress` (`apps/web/app/(learner)/progress/page.tsx`):
  - Dynamic level progression card with level badge, XP brackets, and animated progress bar
  - Daily consistency streak card with flame counter, longest streak record, freeze shield counter, and 7-day weekly activity tracker
  - Live **Immutable XP Audit Ledger table** displaying timestamps, activity categories, source event references, and point gains
  - Product Constitution Rule #7 (Calm, Anti-Addiction) and Rule #8 (Honest Assessment) educational notices
- [x] updated Badges page at `/badges` (`apps/web/app/(learner)/badges/page.tsx`) displaying live level badge and educational title
- [x] 100% tokenized CSS in `apps/web/app/(learner)/progress/progress.module.css` with 0 raw hex colors and logical properties only
- [x] Next.js 111 static routes build cleanly with 0 lint and 0 typecheck errors
- [x] static contract check `scripts/check_day28.py` and regression checks `scripts/check_day14.py` through `scripts/check_day27.py` passing 100%
- [x] comprehensive architecture documentation in `docs/gamification/xp-ledger.md` and updated `docs/product/CHANGELOG.md`

**Success gate:** XP ledger is strictly append-only and immutable; awarding is 100% idempotent via `source_event` unique keys; streaks are calculated in `Asia/Tehran` calendar days with automatic freeze shields protecting against accidental streak loss; levels and XP represent effort rather than accredited diplomas (Rule #8); gamification remains calm without addictive dark patterns (Rule #7); and all contract checks pass.
**Next day after Git push:** Day 29 — Badges, Challenges & Privacy-Safe Leaderboards.
