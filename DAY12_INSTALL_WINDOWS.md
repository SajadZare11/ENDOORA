# Day 12 — Windows / PyCharm Installation

## 1. Apply files

From the Endoora repository root:

```powershell
python scripts\apply_day12.py
```

Expected:

```text
Day 12 patch applied safely.
NEXT: run python scripts\check_day12.py
DO NOT migrate until the pre-Day-12 database backup is verified.
```

## 2. Static check

```powershell
python scripts\check_day12.py
```

Expected result begins with:

```text
Day 12 static checks passed:
```

## 3. Verify Git diff before database work

```powershell
git status --short
```

```powershell
git diff --check
```

Do not continue if unrelated files changed unexpectedly.

## 4. Create the pre-Day-12 PostgreSQL backup

Make sure Docker Desktop is running, then:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\backup_day12.ps1
```

The script must print a non-empty `.dump` path and file size.

## 5. Backend system check before migration

```powershell
Set-Location apps\api
```

```powershell
python manage.py check
```

## 6. Apply the taxonomy migration

```powershell
python manage.py migrate
```

Expected migration includes:

```text
Applying taxonomy.0001_initial... OK
```

## 7. Dry-run the taxonomy import

```powershell
python manage.py import_taxonomy --dry-run
```

Expected result starts with:

```text
DRY RUN (rolled back):
```

## 8. Import the taxonomy

```powershell
python manage.py import_taxonomy
```

Expected result starts with:

```text
IMPORTED: release=day12-v1
```

## 9. Prove idempotency

Run it a second time:

```powershell
python manage.py import_taxonomy
```

It must not duplicate nodes. The output should show `created=0`.

## 10. Run backend tests

```powershell
python manage.py test
```

## 11. Verify no migration drift

```powershell
python manage.py makemigrations --check --dry-run
```

Expected:

```text
No changes detected
```

## 12. Return to repository root

```powershell
Set-Location ..\..
```

## 13. Run repository safety checks

```powershell
python scripts\scan_secrets.py
```

```powershell
git diff --check
```

```powershell
git status --short --branch
```

## 14. Manual admin verification

Start the API and open `/admin/`.

Verify:

- Endoora taxonomy nodes are visible.
- Persian labels are present.
- English labels are present.
- an existing slug is read-only;
- delete is unavailable;
- release/revision history is read-only;
- changing only a Persian label does not require changing the slug.

## 15. Manual API verification

With the API running, open:

```text
http://127.0.0.1:8000/api/taxonomy/meta/
```

Then:

```text
http://127.0.0.1:8000/api/taxonomy/nodes/?kind=skill
```

The default `display_label` must be Persian.

English option:

```text
http://127.0.0.1:8000/api/taxonomy/nodes/?kind=skill&lang=en
```

Objective selector:

```text
http://127.0.0.1:8000/api/taxonomy/objectives/?cefr=A2
```

## 16. Acceptance stop

Do not start Day 13 until all of these pass:

- import twice without duplicates;
- full backend tests;
- no migration drift;
- Persian default + English optional API;
- admin stable-slug/delete protection;
- deprecated-history test;
- prerequisite-cycle test;
- secret scan;
- clean intended Git diff.
