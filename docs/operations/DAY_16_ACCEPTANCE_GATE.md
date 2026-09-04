# Day 16 Acceptance Gate — Listening Placement Section with Audio Player and Waveform

## Protect
- [x] Day 15 is committed/pushed (`1e2d6a9`).
- [x] Working tree reviewed.
- [x] Verified pre-Day-16 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000\endoora-pre-day16.dump`).

## Placement Content & Listening Section
- [x] Calibrated Listening placement section added to `data/placement/core-items.json`.
- [x] 15 total placement items across 4 sections: Grammar (4), Vocabulary (4), Reading (3), Listening (4).
- [x] Listening items cover A1 (gist), A2 (detail), B1 (inference), and B2 (academic talk).
- [x] Item difficulty (`easy`, `medium`, `hard`) separated from CEFR labels.
- [x] Standard PCM WAV audio assets generated and verified in `apps/web/public/audio/placement/`.
- [x] `seed_placement_sections` management command validates item counts across all four sections.

## Evaluation, Scoring & Evidence
- [x] Server-side evaluation of listening responses in `apps/api/assessment/services.py`.
- [x] Learner listening responses recorded in `PlacementResponse` model upon session submission.
- [x] Session summary endpoint `GET /api/placement/sessions/<id>/summary/` includes listening section breakdown.
- [x] Active session summary provides progress breakdown without leaking correct answers.
- [x] Submitted session summary provides evaluated listening section score percentage and objectives.
- [x] No premature or certified CEFR claims made. Honest assessment notice displayed.

## Security, Ownership & Anti-Leak Safeguards
- [x] User isolation strictly enforced on session summary (returns 404 for unauthorized users).
- [x] Pre-submission question payload contains no answer keys, correct options, rubrics, solutions, or audio transcripts.
- [x] Audio transcripts stored server-side only for teacher/audit reference.
- [x] Questions query filtering by section includes `?section=listening`.

## Audio Player, Waveform & Frontend Integration
- [x] `AudioWaveformPlayer` component with play/pause/resume, 32-bar interactive visual waveform scrubber, and play limit enforcement.
- [x] Playback speed controls (0.8x, 1.0x, 1.2x) and volume/mute controls.
- [x] Keyboard accessible (Space for play/pause, Left/Right arrows for seek) and ARIA attributes (`role="region"`, `aria-roledescription="audio player"`).
- [x] Stylesheets use centralized CSS design tokens with zero raw hex colors.
- [x] Placement runner displays 4-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening).
- [x] Placement report page displays live listening score, answered count, and objectives.
- [x] Learner listening lab page (`/listening`) upgraded with interactive sample player and dimension explorer.
- [x] Audio readiness page (`/placement/listening-ready`) connects directly to placement test and listening lab.

## Automated Gates

Repository root:
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
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test assessment`
- [x] `python manage.py test placement`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`
