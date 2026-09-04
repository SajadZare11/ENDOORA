# Day 18 Acceptance Gate — Writing Placement Section with Rich Text Editor and Automated Evaluation

## Protect
- [x] Day 17 is committed/pushed (`5269d75`).
- [x] Working tree reviewed.
- [x] Verified pre-Day-18 PostgreSQL backup exists outside Git (`PRIVATE_DO_NOT_COPY_TO_GIT\backups\day18\20260820-180000\endoora-pre-day18.dump`).
- [x] `scripts/backup_day18.ps1` established and verified.

## Placement Content & Writing Section
- [x] Calibrated Writing placement section added to `data/placement/core-items.json`.
- [x] 23 total placement items across all 6 sections: Grammar (4), Vocabulary (4), Reading (3), Listening (4), Speaking (4), Writing (4).
- [x] Writing items cover A1 (self intro note), A2 (weekend invitation email), B1 (place review), and B2 (digital textbooks argumentative essay).
- [x] Item difficulty (`easy`, `medium`, `hard`) strictly separated from CEFR labels.
- [x] Writing items contain server-side evaluation rubrics, target keywords, minimum word counts, and maximum word counts.
- [x] `seed_placement_sections` management command validates item counts across all 6 sections.

## Evaluation, Scoring & Evidence
- [x] Server-side diagnostic evaluation of writing responses in `apps/api/assessment/services.py`.
- [x] Automated evaluation assesses word sufficiency against `min_words`, topical coverage against `target_keywords`, and sentence structure.
- [x] Learner writing responses recorded in `PlacementResponse` model upon session submission.
- [x] Session summary endpoint `GET /api/placement/sessions/<id>/summary/` includes writing section breakdown and `estimated_cefr_level`.
- [x] Multi-stage overall score calculated as 6-section average: `sum(section scores) / number of sections` adhering to `docs/assessment/scoring-model.md`.
- [x] Provisional CEFR estimate mapping (A1 to C1) grounded in verified evidence.
- [x] Product Constitution Rule #8 strictly observed: honest educational estimate notice without premature or certified CEFR claims.

## Security, Ownership & Anti-Leak Safeguards
- [x] User isolation strictly enforced on session summary (returns 404 for unauthorized users).
- [x] Pre-submission question serializers and views never leak answer keys, correct options, rubrics, target keywords, or solutions.
- [x] Safe learner-facing metadata (`min_words_expected`, `max_words_expected`) provided without disclosing evaluation criteria.
- [x] Questions query filtering by section includes `?section=writing`.
- [x] Session advance endpoint accepts `writing`.

## Writing Editor, Diagnostics & Frontend Integration
- [x] `WritingEditor` component with formatting toolbar (Bold, Italic, Lists, Clear), character/word counters, sentence count, and live sufficiency status.
- [x] Isolated English text direction (`unicode-bidi: isolate; direction: ltr; text-align: left;`).
- [x] 100% tokenized CSS in `writing-editor.module.css` with 0 raw hex colors.
- [x] `PlacementRunner` upgraded to 6-stage navigation pills (Grammar -> Vocabulary -> Reading -> Listening -> Speaking -> Writing).
- [x] `PlacementReportPage` upgraded with all 6 skill cards and overall provisional CEFR estimate badge with honest disclosures.
- [x] Learner Writing Lab (`/writing`) upgraded into Writing Mentor & Essay Lab with selectable CEFR prompts, embedded editor, real-time diagnostic breakdown, and direct placement links.

## Automated Gates

Repository root:
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
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

Backend:
- [x] `python manage.py test assessment`
- [x] `python manage.py test placement`
- [x] `python manage.py test`
