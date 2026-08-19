# Day 10 acceptance gate — Teacher application shell

Do not begin Day 11 until every required check below passes.

## Automated backend checks

From `E:\0\Work\Website\The General Website\Endoora\apps\api` with the project virtual environment active:

```powershell
python manage.py check
```

Expected: `System check identified no issues`.

```powershell
python manage.py test teachers
```

Expected: all Day 10 teacher tests pass.

```powershell
python manage.py test
```

Expected: the full backend suite passes.

```powershell
python manage.py makemigrations --check --dry-run
```

Expected: `No changes detected` because Day 10 adds no database model.

## Static Day 10 source check

From the repository root:

```powershell
node scripts\check-day10.mjs
```

Expected output begins with:

`Day 10 static checks passed:`

## Frontend checks

From the repository root:

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm run build
```

All three commands must finish successfully.

## Repository and secret checks

From the repository root:

```powershell
python -m unittest scripts.test_scan_secrets
```

```powershell
python scripts\scan_secrets.py
```

```powershell
git diff --check
```

None of these commands should report a secret or whitespace error.

## Manual browser journey — unverified teacher

1. Start Django and Next.js normally.
2. Sign in with a teacher account whose `is_teacher_verified` value is false.
3. Open `http://localhost:3000/teacher`.
4. Confirm the page starts in Persian/RTL and the English switch works.
5. Confirm the verification warning is prominent.
6. Confirm the single primary action is teacher verification/profile completion.
7. Confirm paid-class capability and marketplace capability are not presented as enabled.
8. Confirm the fixed-class shortcut is locked.
9. Confirm Classes, Students, Learn Now, Pending grading, Schedule, and Earnings do not invent counts or money.
10. Resize the browser to 360 px width and confirm all five teacher navigation destinations remain usable without horizontal overflow.

## Manual browser journey — verified teacher

Use a safe local test teacher account only.

1. Set the local test account to verified through a controlled Django shell/admin action; do not change production data.
2. Reload `/teacher`.
3. Confirm the verification state changes to verified.
4. Confirm the fixed-class foundation route becomes reachable but does not yet create a paid class.
5. Confirm the primary action falls back to preparing the first class workspace when there are no real sessions, requests, or grading items.
6. Open Teach, Marketplace, Resources, and Account from desktop and 360 px mobile navigation.
7. Confirm every route resolves and explains its foundation status rather than producing a 404.

## API privacy inspection

While signed in as the teacher, open the browser Network panel and inspect the response from:

`GET /api/teachers/dashboard/`

Confirm that the payload does not contain raw learner writing, audio URLs, transcripts, AI conversation history, private messages, answer text, or unrelated learner details.

## Permission failure check

1. Sign in as a learner.
2. Request `/api/teachers/dashboard/` in the browser or API client.
3. Confirm HTTP 403.
4. Sign out and repeat.
5. Confirm HTTP 401.

## Console/log review

During both journeys:

- Browser Console: no new red unhandled error.
- Django terminal: no traceback.
- Worker/Redis: Day 10 has no required background job, so no worker action is expected.
- Logs: no learner evidence or secrets should be printed.

## Day 10 success gate

Day 10 is complete only when all of these are true:

- [ ] Teacher Home has one immediately identifiable primary action.
- [ ] Unverified and verified teachers receive different capability states safely.
- [ ] Five-item teacher navigation works on desktop and 360 px mobile.
- [ ] Empty states explain first-class/first-assignment/marketplace foundations without fake data.
- [ ] The aggregated teacher API has a bounded service query count.
- [ ] Teacher summary payload does not expose raw learner evidence.
- [ ] Django checks and full tests pass.
- [ ] Frontend lint, typecheck, and build pass.
- [ ] Migration drift check reports no changes.
- [ ] Secret scan and `git diff --check` pass.
- [ ] Browser console and API logs contain no unhandled error or sensitive content.
