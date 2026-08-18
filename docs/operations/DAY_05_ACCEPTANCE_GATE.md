# Day 05 Acceptance Gate — Information Architecture and Critical Flows

Day 05 is complete only after the repository checks **and** the five-person findability test pass.

## 0. Prerequisite note

The public GitHub project inspected before this package already contains the Day 04 component-library implementation.
Do not delete or rebuild it.

Before the Day 05 Git checkpoint, make sure any still-pending Day 04 founder-only browser/build checks are satisfied.

## 1. Day 05 static IA check

From the repository root:

```powershell
node scripts\check-information-architecture.mjs
```

Expected:

```text
Day 05 IA checks passed: role navigation, Account hub, 6 critical wireframes, route ownership/deep-link contracts, required recovery states, 5 findability targets, and logical token CSS.
```

## 2. Frontend regression

From the repository root:

```powershell
npm run lint
npm run typecheck
npm run check:design
npm run check:components
npm run build
```

No command may fail.

## 3. Backend regression

From `apps\api` with the virtual environment active:

```powershell
python manage.py check
python manage.py test
python manage.py makemigrations --check --dry-run
```

Day 05 has no Django model/API changes, so migration drift must remain empty.

## 4. Secret regression

From the repository root with the Python environment available:

```powershell
python -m unittest scripts.test_scan_secrets
python scripts\scan_secrets.py
```

## 5. Browser prototype

Start the web app and open:

`http://localhost:3000/design-system/information-architecture`

Check desktop and a **360 px** responsive viewport.

- [ ] No horizontal overflow.
- [ ] Learner primary nav has exactly five destinations.
- [ ] Teacher primary nav has exactly five destinations.
- [ ] Account contains Library, Usage, Premium, Billing, Profile, Sessions, Notifications, Privacy/Data Controls, Settings and Support.
- [ ] Account tools are not presented as equal Home tiles.
- [ ] Placement is prominent.
- [ ] The six flow cards are present.
- [ ] Required recovery states are visible.
- [ ] Keyboard focus is visible for prototype links.
- [ ] Browser console has no new errors.

## 6. Five-person hallway findability test

Do **not** coach the tester after you tell them which role they are pretending to use.
The prototype is allowed to be a wireframe; measure information architecture, not visual polish.

Give each tester these five tasks:

1. “You are a new learner. Find the **Placement Test**.”
2. “You are a returning learner. Find **Today / today’s mission**.”
3. “You are a teacher. Find **Create Assignment**.”
4. “You are a learner. Find **Learn Now**.”
5. “You are a learner. Find **Billing**.”

A navigation decision is a choice of a destination/link, not scrolling.

| Tester | Placement | Today | Create Assignment | Learn Now | Billing | Any task >3 decisions? | Confusing label? |
|---|---:|---:|---:|---:|---:|---|---|
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |
| 4 |  |  |  |  |  |  |  |
| 5 |  |  |  |  |  |  |  |

### Pass rule

- Every critical task is found in **three or fewer navigation decisions**.
- No tester confuses learner learning-path navigation with teacher marketplace navigation in a way that blocks the task.
- If the same label confuses two or more testers, revise the IA and repeat the affected tasks.

## 7. Success gate

Day 05 passes when:

- a new learner/teacher can identify where to start;
- all five findability tasks pass in ≤3 decisions;
- Account tools do not crowd Home;
- the browser prototype works at 360 px and desktop;
- automated frontend/backend/secret checks pass;
- the Day 05 Git checkpoint is pushed.

## Git checkpoint

```powershell
git status
powershell -ExecutionPolicy Bypass -File scripts\stage_day05.ps1
git diff --cached
git commit -m "Day 05: Freeze information architecture, Account hub, and critical user flows"
git push
```
