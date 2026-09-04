# Day 17 Acceptance Gate — Speaking Placement Section with Audio Recording and STT Diagnostic

## Protect
- [x] Day 16 is committed/pushed (`1560836`).
- [x] Working tree reviewed.
- [x] Verified pre-Day-17 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day17\20260820-170000\endoora-pre-day17.dump`).
- [x] `scripts/backup_day17.ps1` established and verified.

## Placement Content & Speaking Section
- [x] Calibrated Speaking placement section added to `data/placement/core-items.json`.
- [x] 19 total placement items across all 5 sections: Grammar (4), Vocabulary (4), Reading (3), Listening (4), Speaking (4).
- [x] Speaking items cover A1 (self intro), A2 (daily routine), B1 (memorable experience), and B2 (remote work opinion).
- [x] Item difficulty (`easy`, `medium`, `hard`) strictly separated from CEFR labels.
- [x] Speaking items contain server-side evaluation rubrics, target keywords, time limits, and minimum word counts.
- [x] `seed_placement_sections` management command validates item counts across all 5 sections.

## Evaluation, Scoring & Evidence
- [x] Server-side diagnostic evaluation of speaking responses in `apps/api/assessment/services.py`.
- [x] Fluency evaluation assesses word sufficiency against `min_words` and topical coverage against `target_keywords`.
- [x] Learner speaking responses recorded in `PlacementResponse` model upon session submission.
- [x] Session summary endpoint `GET /api/placement/sessions/<id>/summary/` includes speaking section breakdown and `estimated_cefr_level`.
- [x] Multi-stage overall score calculated as 5-section average: `sum(section scores) / number of sections` adhering to `docs/assessment/scoring-model.md`.
- [x] Provisional CEFR estimate mapping (A1 to C1) grounded in verified evidence.
- [x] Product Constitution Rule #8 strictly observed: honest educational estimate notice without premature or certified CEFR claims.

## Security, Ownership & Anti-Leak Safeguards
- [x] User isolation strictly enforced on session summary (returns 404 for unauthorized users).
- [x] Pre-submission question serializers and views never leak answer keys, correct options, rubrics, target keywords, solutions, or audio transcripts.
- [x] Safe learner-facing metadata (`recording_time_limit_sec`, `min_words_expected`) provided without disclosing evaluation criteria.
- [x] Questions query filtering by section includes `?section=speaking`.
- [x] Session advance endpoint accepts `speaking`.

## Audio Recording, STT Diagnostic & Frontend Integration
- [x] `AudioRecorder` component with start/stop/re-record controls, sound level meter, recording timer, and auto-stop countdown.
- [x] Audio review playback for recorded voice responses.
- [x] Real-time Speech-to-Text (STT) transcript preview using standard browser SpeechRecognition API.
- [x] Accessible text fallback option for learners without microphone permissions or hardware support.
- [x] Word count sufficiency indicator against expected minimum words.
- [x] 100% tokenized CSS in `audio-recorder.module.css` with 0 raw hex colors.
- [x] `PlacementRunner` upgraded to 5-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking).
- [x] `PlacementReportPage` upgraded with 5 skill cards and overall provisional CEFR estimate badge with honest disclosures.
- [x] Learner Voice Lab (`/voice`) upgraded with live microphone & STT sandbox and direct placement test links.
- [x] Pronunciation Lab (`/pronunciation`) updated with direct voice sandbox and speaking placement navigation.

## Automated Gates

Repository root:
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
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test assessment`
- [x] `python manage.py test placement`
- [x] `python manage.py test`
- [x] `python manage.py makemigrations --check --dry-run`
