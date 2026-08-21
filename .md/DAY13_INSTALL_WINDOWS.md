# Day 13 — Windows / PyCharm Installation

Repository root:

`E:\0\Work\Website\The General Website\Endoora`

## 1. Copy the ZIP contents into the repository root

The package adds new Day 13 files. If you already created an `apps/api/questions` app manually,
do not overwrite it; stop and compare first.

## 2. Open PyCharm Terminal at the repository root

Activate the repository's documented Python virtual environment:

```powershell
apps\api\.venv\Scripts\Activate.ps1
```

## 3. Check Git before changing the database

```powershell
git status --short --branch
```

Day 12 should already be pushed. Apart from the newly copied Day 13 files, there should be no unrelated changes.

## 4. Apply the safe wiring patch

```powershell
python scripts\apply_day13.py
```

Expected:

`Day 13 patch applied safely.`

## 5. Static check before migration

```powershell
python scripts\check_day13.py
```

Expected:

`Day 13 static checks passed`

## 6. Start PostgreSQL and make a pre-Day-13 backup

```powershell
docker compose up -d postgres
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts\backup_day13.ps1
```

Do not migrate unless the script prints `Day 13 database backup verified.`

## 7. Go to the backend folder

```powershell
Set-Location apps\api
```

## 8. Inspect the migration

```powershell
python manage.py showmigrations questions
```

Expected before migration:

`[ ] 0001_initial`

## 9. Migrate

```powershell
python manage.py migrate
```

Expected:

`Applying questions.0001_initial... OK`

## 10. Backend checks

```powershell
python manage.py check
```

```powershell
python manage.py test questions
```

```powershell
python manage.py test
```

```powershell
python manage.py makemigrations --check --dry-run
```

All must pass.

## 11. Import two original Endoora samples as DRAFT

Use an existing editor/administrator email:

```powershell
python manage.py import_questions --path ..\..\data\questions\endoora_day13_samples.v1.json --author-email <YOUR_EDITOR_EMAIL>
```

First run should report `created=2, skipped=0`.

Run it again. The second run should report `created=0, skipped=2`.

## 12. Start API

```powershell
python manage.py runserver 127.0.0.1:8000
```

Leave it running.

## 13. Start Web in a second PyCharm terminal at repository root

```powershell
npm run dev:web
```

Keep using the hostname `127.0.0.1` for this Day 13 verification so the Django session cookie and the
Next.js proxy use the same browser hostname.

## 14. Admin/review journey, then open the preview

First open Django admin:

`http://127.0.0.1:8000/admin/`

Sign in with your existing administrator account. Create/review a question version. Publication requires
author, reviewer, source/licence, CEFR, objective, and answer key/rubric as applicable.

Use the controlled admin publish action.

In the same browser, open:

`http://127.0.0.1:3000/content/questions`

The page must default to Persian/RTL and provide an English switch. Because the question-bank list is
protected, an anonymous/support account must not be able to enumerate it.

## 15. Prove answer keys are hidden

Press F12 → Network and inspect:

`GET /api/questions/published/`

Before submission the JSON must not contain `answer_key`, `accepted_variants`, `rubric`,
`explanation_fa`, or `explanation_en`.

The focused automated test suite also submits a learner answer and verifies that the post-submission
response reveals the result/explanation without returning the raw answer key.

## 16. Frontend regression

Stop the dev server with Ctrl+C, return to repository root, then:

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm run build
```

## 17. Repository safety checks

```powershell
python scripts\check_day13.py
```

```powershell
python scripts\scan_secrets.py
```

```powershell
git diff --check
```

## 18. Manual gate

Complete:

`docs/operations/DAY_13_ACCEPTANCE_GATE.md`

Test desktop + exactly 360 px, Persian RTL + English LTR, loading/empty/error/retry,
permissions, publish/retire, and network answer-key redaction.

## 19. Finalize project memory

Use the private backup path printed by `backup_day13.ps1`:

```powershell
python scripts\finalize_day13.py --backup-path "<PASTE_PRIVATE_BACKUP_PATH>"
```

Then rerun `python scripts\check_day13.py`.

## 20. Git checkpoint

```powershell
git status --short --branch
```

```powershell
git add .
```

```powershell
git commit -m "Day 13: Build the versioned question bank schema"
```

```powershell
git push origin main
```

```powershell
git status --short --branch
```

Do not begin Day 14 until `main` is synchronized with `origin/main` and the working tree is clean.
