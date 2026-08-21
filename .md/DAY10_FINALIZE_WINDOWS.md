# Day 10 final Git checkpoint — Windows / PyCharm

Run these commands only after the Day 10 implementation, backend tests, frontend checks, and local acceptance have passed.

## 1. From the repository root

```powershell
Set-Location "E:\0\Work\Website\The General Website\Endoora"
```

## 2. Remove the unrelated generated Next.js diff if it still appears

```powershell
git restore apps/web/next-env.d.ts
```

If Git says the path has no change, continue.

## 3. Copy the four documentation files from this package into the same relative paths

- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`
- `docs/product/ROADMAP_PROGRESS.md`
- `docs/quality/TEST_MATRIX.md`

Choose Replace when Windows asks about these four files.

## 4. Final static/security checks

```powershell
node scripts\check-day10.mjs
```

```powershell
python -m unittest scripts.test_scan_secrets
```

```powershell
python scripts\scan_secrets.py
```

```powershell
git diff --check
```

LF/CRLF conversion warnings are acceptable. Actual whitespace errors are not.

## 5. Review exactly what will be committed

```powershell
git status --short --branch
```

`apps/web/next-env.d.ts` should NOT be listed. No `.env`, database, secret, user upload, virtual environment, or cache file should be listed.

## 6. Stage Day 10

```powershell
git add .
```

## 7. Review staged files

```powershell
git status --short
```

```powershell
git diff --cached --stat
```

## 8. Commit

```powershell
git commit -m "Day 10: Build the teacher application shell and simplified navigation"
```

## 9. Push

```powershell
git push origin main
```

## 10. Verify synchronization

```powershell
git status --short --branch
```

Expected final branch line:

```text
## main...origin/main
```

with no modified or untracked files below it.

Then run:

```powershell
git log -1 --oneline
```

The latest commit should show the Day 10 commit message.

Day 10 is closed only after the push succeeds and the working tree is clean. The next roadmap day is Day 11 — Configure Django admin, audit logs, and safe settings.
