# Day 20 Acceptance Gate — Adaptive Daily Mission Engine & Wireframe 2 Interactive Experience

## Protect
- [x] Day 19 is committed/pushed (`95f3b71`).
- [x] Working tree reviewed.
- [x] Verified pre-Day-20 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day20\20260821-120000\endoora-pre-day20.dump`).
- [x] `scripts/backup_day20.ps1` established and verified.

## Daily Mission Backend Engine & Architecture
- [x] `DailyMission` model in `apps/api/missions/models.py` with helper methods (`get_tasks`, `get_target_skill`, `get_current_task_index`, `get_completed_task_ids`, `is_all_completed`).
- [x] Adaptive mission builder `build_daily_mission(user)` in `apps/api/missions/services.py`:
  - Dynamically evaluates placement results from `PlacementSession` (all 6 sections) to target learner's lowest scoring skill.
  - Gracefully handles unplaced learners with diagnostic readiness onboarding mission.
  - Generates 3 curated pedagogical micro-tasks per skill (Grammar, Vocabulary, Reading, Listening, Writing, Speaking, and Readiness).
- [x] `start_daily_mission(user)` transitions status from `ready` to `in_progress`.
- [x] `submit_mission_step(user, task_id, selected_option_id)` evaluates answer correctness, records evidence, reveals explanations, and tracks progress.
- [x] `resolve_mission_next_action(user, mission)` computes dominant next best action upon completion (pointing to `/placement`, `/review`, or `/path`).

## Serializers & Pre-Submission Payload Protection
- [x] `DailyMissionSerializer` in `apps/api/missions/serializers.py` implements pre-submission protection:
  - Correct option keys (`correct_option_id`) and explanations are strictly stripped from uncompleted tasks.
  - Explanations and answer keys are revealed only upon step submission.
- [x] `MissionStepSubmitSerializer` and `MissionStepFeedbackSerializer` validate inputs and responses.

## Views & Routing
- [x] Endpoints in `apps/api/missions/urls.py`:
  - `today/` -> `TodayMissionView`
  - `today/start/` -> `StartMissionView`
  - `today/submit-step/` -> `SubmitMissionStepView`
  - `today/reset/` -> `ResetMissionView`
- [x] Routed in `apps/api/endoora_api/urls.py` under `api/missions/`.

## Unit & Regression Test Suite
- [x] 8 automated tests in `apps/api/missions/tests.py`:
  - Anonymous user rejected (401).
  - Unplaced onboarding mission with placement CTA.
  - Placed adaptive mission derived from lowest skill.
  - Start mission status transition (`ready` -> `in_progress`).
  - Step submission and instant constructive feedback.
  - Mission completion and next best action generation.
  - User isolation (User B cannot mutate User A's mission).
  - Idempotency and refresh state persistence.
- [x] Full regression suite (148/148 tests pass with 0 errors).

## Frontend Wireframe 2 Implementation
- [x] Interactive Daily Mission runner in `apps/web/app/(learner)/today/page.tsx`:
  - 4 view phases: Overview -> Active Task -> Instant Feedback -> Complete.
  - 3-step sequential progression (`گام ۱ از ۳`, `گام ۲ از ۳`, `گام ۳ از ۳`).
  - English prompt direction isolation (`unicode-bidi: isolate; direction: ltr;`).
  - Immediate constructive feedback with rule explanations in Persian and English.
  - Complete screen with celebratory badge and dominant Next Best Action card.
  - State resilience: refresh preserves current step.
- [x] 100% tokenized CSS in `apps/web/app/(learner)/today/today.module.css` with 0 raw hex colors.
- [x] Route redirect in `apps/web/next.config.ts`: `/learner/today` -> `/today`.
- [x] Product Constitution Rule #8 strictly observed: transparent educational claims without fabricated gamification or premature CEFR claims.

## Automated Gates
- [x] `python scripts\check_day20.py`
- [x] `python scripts\check_day19.py` through `check_day13.py`
- [x] `node scripts\check-public-site.mjs`
- [x] `node scripts\check-day10.mjs`
- [x] `node scripts\check-day01-10.mjs`
- [x] `node scripts\check-components.mjs`
- [x] `node scripts\check-design-tokens.mjs`
- [x] `python scripts\scan_secrets.py`
- [x] `git diff --check`
- [x] `npm run lint` (0 errors, 0 warnings)
- [x] `npm run typecheck` (0 errors)
- [x] `npm run build` (108/108 static routes generated)
