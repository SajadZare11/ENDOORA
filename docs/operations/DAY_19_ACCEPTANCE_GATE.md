# Day 19 Acceptance Gate — Personal Learning Path Engine & Interactive Path Experience

## Protect
- [x] Day 18 is committed/pushed (`21d9fb3`).
- [x] Working tree reviewed.
- [x] Verified pre-Day-19 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day19\20260820-190000\endoora-pre-day19.dump`).
- [x] `scripts/backup_day19.ps1` established and verified.

## Learning Path Engine & Backend Architecture
- [x] `build_learning_path` implemented in `apps/api/learner_twin/path.py`.
- [x] Dynamically inspects learner's submitted 6-section placement session (`status="submitted"`).
- [x] Unplaced learner state handled honestly without fake precision or arbitrary percentages.
- [x] Placed learner state derives provisional CEFR estimate (`A1`–`C1`) and overall score percentage.
- [x] All 6 skills evaluated: Grammar, Vocabulary, Reading, Listening, Speaking, Writing.
- [x] Priority growth areas ranked by score ascending with pedagogical recommendations and links.
- [x] Explainable 5-phase progress timeline with discrete states (`complete`, `current`, `upcoming`, `planned`, `locked`).
- [x] Dominant next-best action derived dynamically based on lowest-performing skill or today's mission.
- [x] Product Constitution Rule #8 strictly observed: honest educational estimate notice without premature or certified CEFR claims in both Persian and English.

## Serializers & API Endpoints
- [x] `LearningPathSerializer` in `apps/api/learner_twin/serializers.py` validates `placement_completed`, `estimated_cefr_level`, `overall_percentage`, `focus_areas`, `section_scores`, `timeline`.
- [x] `LearningPathView` enforces authentication and returns clean serialized responses.
- [x] API routed at both `/api/learner-twin/path/` and `/api/path/`.
- [x] 4 unit tests in `apps/api/learner_twin/tests.py` testing unplaced, placed, user isolation, and permissions.

## Frontend Personal Learning Path Experience
- [x] Upgraded `/path` in `apps/web/app/(learner)/path/page.tsx` into a professional, responsive, bilingual surface.
- [x] Unplaced state presents friendly onboarding card explaining evidence-based path + CTA to `/placement`.
- [x] Placed state presents CEFR level badge, overall score, dominant next-step action banner, priority growth areas grid, 5-phase interactive timeline, and honest assessment notice.
- [x] 100% tokenized CSS in `apps/web/app/(learner)/path/path.module.css` with 0 raw hex colors.
- [x] Responsive layout down to 360px without horizontal overflow.
- [x] Strict English text direction isolation (`unicode-bidi: isolate; direction: ltr;`).
- [x] Bilingual switcher (`fa` / `en`) with localized terminology.

## Wireframe 1 Flow Completion
- [x] `/placement/report` primary CTA navigates directly to `/path` ("ساخت و مشاهده مسیر یادگیری شخصی").
- [x] `LearnerDashboard` (`/dashboard`) path card links directly to `/path` ("مشاهده جزئیات مسیر شخصی").

## Automated Gates

Repository root:
- [x] `python scripts\check_day19.py`
- [x] `python scripts\check_day18.py`
- [x] `python scripts\check_day17.py`
- [x] `python scripts\check_day16.py`
- [x] `python scripts\check_day15.py`
- [x] `python scripts\check_day14.py`
- [x] `python scripts\check_day13.py`
- [x] `python scripts\check_day12.py`
- [x] `python scripts\check_day11.py`
- [x] `python scripts\check_day09.py`
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
- [x] `python manage.py test` (140/140 tests pass)
- [x] `python manage.py makemigrations --check --dry-run` (0 schema drift)
