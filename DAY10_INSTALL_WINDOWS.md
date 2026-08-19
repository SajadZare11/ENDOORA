# Install Endoora Day 10 on Windows / PyCharm

## 1. Protect the current work

Open PyCharm, open the Endoora project, click **Terminal**, and verify that the path is:

`E:\0\Work\Website\The General Website\Endoora`

Run:

```powershell
git status --short --branch
```

Save the output. Do not continue if you see unexpected modified source files that you do not recognize.

Create a safe pre-Day-10 Git checkpoint if the current Day 09 work is clean but not committed:

```powershell
git add .
```

```powershell
git commit -m "Checkpoint before Day 10 teacher shell"
```

If Git says there is nothing to commit, that is fine.

## 2. Copy the changed-files package

Extract the supplied ZIP. Inside it there is a folder named `Endoora`.

Open that `Endoora` folder and copy its contents into:

`E:\0\Work\Website\The General Website\Endoora`

Choose **Replace the files in the destination** only for these two intended replacement files:

- `apps\api\endoora_api\settings\base.py`
- `apps\api\endoora_api\urls.py`

All other Day 10 files are new.

The package does not contain `.env`, databases, uploads, `.git`, virtual environments, `node_modules`, or user content.

## 3. Run the Day 10 static source check

From the repository root:

```powershell
node scripts\check-day10.mjs
```

Expected result starts with:

`Day 10 static checks passed:`

## 4. Run backend checks

Activate the virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

If your virtual environment is under `apps\api\.venv` instead, use your already-working activation path from Day 09.

Move to the API folder:

```powershell
Set-Location apps\api
```

Run:

```powershell
python manage.py check
```

Then:

```powershell
python manage.py test teachers
```

Then:

```powershell
python manage.py test
```

Then:

```powershell
python manage.py makemigrations --check --dry-run
```

Expected migration result: `No changes detected`.

Return to the repository root:

```powershell
Set-Location ..\..
```

## 5. Run frontend checks

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm run build
```

## 6. Run repository safety checks

```powershell
python -m unittest scripts.test_scan_secrets
```

```powershell
python scripts\scan_secrets.py
```

```powershell
git diff --check
```

## 7. Start the API and web app

Use your normal Day 09 start commands. Open:

`http://localhost:3000/teacher`

Complete the manual checks in `docs\operations\DAY_10_ACCEPTANCE_GATE.md` for an unverified teacher, a verified local test teacher, a learner-denied request, desktop, and 360 px mobile.

## 8. Git checkpoint only after the gate passes

From the repository root:

```powershell
git status
```

```powershell
git add .
```

```powershell
git commit -m "Day 10: Build the teacher application shell and simplified navigation"
```

```powershell
git push origin main
```

Do not begin Day 11 until the push succeeds and the Day 10 acceptance checklist is fully green.
