# Day 15 Acceptance Gate — Grammar, Vocabulary, and Reading Placement Sections

## Protect
- [x] Day 14 is committed/pushed.
- [x] Working tree reviewed.
- [x] Verified pre-Day-15 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\20260820-150000\endoora-pre-day15.dump`).

## Placement Content & Sections
- [x] Grammar, Vocabulary, and Reading placement sections implemented.
- [x] Calibrated multi-level items present in `data/placement/core-items.json`.
- [x] Item difficulty separated from CEFR labels.
- [x] Stable question identifiers maintained (`grammar-a1-001`, `vocabulary-a1-001`, `reading-a1-001`, etc.).
- [x] `seed_placement_sections` management command validates item counts across all three sections.

## Evaluation, Scoring & Evidence
- [x] Server-side deterministic scoring and evidence recording.
- [x] Learner responses recorded in `PlacementResponse` upon session submission.
- [x] Session summary endpoint `GET /api/placement/sessions/<id>/summary/` operational.
- [x] Active session summary provides progress breakdown without leaking correct answers.
- [x] Submitted session summary provides evaluated section breakdown and evidence list.
- [x] No premature or certified CEFR claims made. Honest assessment notice displayed.

## Security, Ownership & Anti-Leak Safeguards
- [x] User isolation strictly enforced on session summary (returns 404 for unauthorized users).
- [x] Pre-submission question payload contains no answer keys, correct options, rubrics, or solutions.
- [x] Questions query filtering by section (`?section=grammar`, `?section=vocabulary`, `?section=reading`) functions safely.

## Persian / English / Accessibility & UI
- [x] Placement runner displays multi-stage section pills (Grammar -> Vocabulary -> Reading) with live autosave indicator.
- [x] English learning prompts, passages, and options isolated as LTR (`unicode-bidi: isolate`).
- [x] Responsive layout at 360 px has no horizontal overflow.
- [x] Stylesheets use centralized CSS design tokens with zero raw hex colors.
- [x] Placement report page displays live section scores, objectives, and honest assessment disclaimer.
- [x] Public `/placement` primary CTA directly navigates to test execution (`/placement/demo`).
- [x] Listening readiness page upgraded with `EndooraBackground`, `GlassCard`, and design tokens.
- [x] Learner stub pages (`/progress`, `/review`, `/mistakes`, `/badges`, `/twin`, `/voice`, `/writing`, `/roleplay`, `/listening`, `/practice-ai`, `/pronunciation`) upgraded to complete, professional pages.

## Automated Gates

Repository root:
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
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test assessment`
- [x] `python manage.py test placement`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`

## Success Gate

**Grammar, Vocabulary, and Reading placement sections provide secure, deterministic multi-stage diagnostics with verified evidence recording and honest assessment transparency.**
