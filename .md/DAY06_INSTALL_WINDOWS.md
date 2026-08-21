# Endoora Day 06 — Windows / PyCharm install and verification

## Copy destination

`E:\0\Work\Website\The General Website\Endoora`

Extract the changed-files overlay into the repository root. Allow replacement only for files listed as REPLACE in `DAY06_PACKAGE_MANIFEST.md`. The archive contains no `.env`, database, uploads, virtual environment, `node_modules`, `.next`, or Git history.

## 1. Inspect before copying

Open PyCharm -> Endoora -> Terminal. Verify the prompt is at the repository root, then run:

`git status`

Do not continue if `.env`, a database, uploads, or secrets are tracked.

## 2. Copy the overlay

Use Windows File Explorer to extract the ZIP to a temporary folder, open that folder, copy its contents, and paste them into the Endoora repository root. Choose **Replace the files in the destination** only for the replacement files in the manifest.

## 3. Static preflight before migration

From repository root:

`npm run check:public`

Expected important line:

`Day 06 public-site static checks: PASS`

## 4. Protect the database

From repository root:

`powershell -ExecutionPolicy Bypass -File scripts\backup_day06.ps1`

Do not migrate until the script prints `BACKUP PASS`, a path outside the repository, and a non-zero byte size.

## 5. Backend migration and tests

In PyCharm Terminal:

`cd "E:\0\Work\Website\The General Website\Endoora\apps\api"`

Activate the existing API virtual environment:

`.\.venv\Scripts\Activate.ps1`

Run:

`python manage.py check`

Then:

`python manage.py migrate`

Then:

`python manage.py showmigrations waitlist`

Expected: `[X] 0001_initial`.

Then:

`python manage.py test`

Then:

`python manage.py makemigrations --check --dry-run`

Expected: `No changes detected`.

## 6. Frontend/global checks

Return to repository root:

`cd "E:\0\Work\Website\The General Website\Endoora"`

Run each command separately:

`npm run lint`

`npm run typecheck`

`npm run check:design`

`npm run check:components`

`npm run check:public`

`npm run build`

`python -m unittest scripts.test_scan_secrets`

`python scripts\scan_secrets.py`

Do not commit if any command fails.

## 7. Manual browser journey

Terminal 1 — API:

`cd "E:\0\Work\Website\The General Website\Endoora\apps\api"`

`.\.venv\Scripts\Activate.ps1`

`python manage.py runserver`

Terminal 2 — Web, from repository root:

`npm run dev:web`

Open:

- `http://localhost:3000/`
- `http://localhost:3000/en`
- `http://localhost:3000/how-it-works`
- `http://localhost:3000/pricing`
- `http://localhost:3000/features/learner-twin`
- `http://localhost:3000/legal/privacy`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

Use Chrome DevTools responsive mode at 360 px. Follow `docs/quality/DAY_06_ACCEPTANCE_GATE.md` exactly, including the waitlist success/duplicate/API-down paths and a mobile Lighthouse baseline.

## 8. Git checkpoint

From repository root:

`powershell -ExecutionPolicy Bypass -File scripts\stage_day06.ps1`

Review the printed `git status --short`. The user's unrelated local edits must not be staged accidentally.

After the acceptance gate passes, update `docs/product/PROJECT_STATE.md` from the verified facts in `docs/product/PROJECT_STATE_DAY06_DRAFT.md`, then stage that file explicitly:

`git add -- docs/product/PROJECT_STATE.md`

Commit:

`git commit -m "Day 06: Build the public Endoora website shell and SEO foundation"`

Push:

`git push origin main`
