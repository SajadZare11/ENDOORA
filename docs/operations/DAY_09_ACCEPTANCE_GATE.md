# Day 09 Acceptance Gate — Learner Application Shell

## Objective

The learner dashboard must answer “What should I do now?” within five seconds.

## Database

Day 09 adds no model, so no migration is required.

## Automated checks

From the repository root:

```powershell
python scripts\apply_day09.py
python scripts\check_day09.py
npm run lint
npm run typecheck
npm run build
python scripts\scan_secrets.py
python scripts\test_scan_secrets.py
```

From `apps\api` with the virtual environment active:

```powershell
python manage.py check
python manage.py test dashboard
python manage.py test
python manage.py makemigrations --check --dry-run
```

Expected final migration result:

```text
No changes detected
```

## Placement route ownership

Day 06 already owns `/placement`. Day 09 links the first-time learner to that existing entry point and does not create a second conflicting App Router page. The real resumable placement engine is added in the later assessment phase.

## Manual desktop checks

- Sign in as a learner.
- Open `http://localhost:3000/dashboard`.
- One dominant Today action must appear above the fold.
- A first-time learner must be guided to Placement.
- “چرا این پیشنهاد؟” must explain why Placement was chosen.
- No CEFR score, path percentage, XP, skill level, assignment or class may be fabricated.
- Switch Persian -> English -> Persian.
- Persian must be RTL; English must be LTR.
- Account remains a main navigation destination.
- Library, Usage, Premium, Billing, Profile, Privacy and Settings must not compete as dashboard tiles.
- Sign in as a teacher and try the learner dashboard: access must be denied.
- Sign out and try the learner dashboard: login must be required.

## 360 px mobile checks

- Sidebar disappears.
- Five-destination bottom navigation appears.
- Today action remains first and visually dominant.
- No horizontal scrolling.
- Focus remains visible.
- Planned future destinations are visibly disabled rather than pretending the feature exists.

## Offline checks

- Load the dashboard.
- In browser DevTools -> Network, switch to Offline.
- Existing loaded dashboard remains visible with an offline notice.
- Refresh while offline and confirm a recovery screen appears.
- Restore the network and retry.

## API checks

`GET /api/dashboard/home/`

- learner: `200`
- teacher: `403`
- anonymous: `401`

The learner payload must use `null` for unavailable path progress and an empty skill list until real evidence exists.

## Success gate

Do not start Day 10 until all automated checks and the manual desktop/mobile/offline journeys pass.
