# Day 05 Acceptance Gate — Information Architecture and Critical Flows

Day 05 is complete only after the repository checks **and** the five-person findability test pass.

## 0. Prerequisite note

The public GitHub project inspected before this package already contains the Day 04 component-library implementation.
Do not delete or rebuild it.

Before the Day 05 Git checkpoint, make sure any still-pending Day 04 founder-only browser/build checks are satisfied.

## 1. Day 05 static IA check

From the repository root:

```powershell
npm run check:ia
```

Expected:

```text
Day 05 IA checks passed: Persian-first localization, four role maps, exact five-item learner/teacher mobile navigation, six clickable flow prototypes, decision counts, recovery contracts, current/planned route labels, honest homepage preview data, and logical token CSS.
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
- [ ] Each flow can be selected and every numbered step can be opened.
- [ ] Previous/Next controls stop safely at the first/last step.
- [ ] Current, Planned, and Foundation/Beta route labels are visible.
- [ ] Admin/operations navigation is separate from learner and teacher navigation.
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

## 8. Persian-first localization correction

Before Day 05 is committed, verify the IA prototype again.

Open:

`http://localhost:3000/design-system/information-architecture`

### Default load

- [ ] The initial/default interface is Persian.
- [ ] The main container is RTL.
- [ ] `Endoora` remains English.
- [ ] `A new door to your English` remains English.
- [ ] Navigation labels such as خانه, تعیین سطح, مدرس‌ها, حساب کاربری and صورتحساب are Persian.
- [ ] Technical routes such as `/placement` remain LTR/English.
- [ ] `IELTS` remains readable as an isolated English term where appropriate.

### English switch

Click **English**.

- [ ] UI labels switch to English.
- [ ] Layout direction becomes LTR.
- [ ] Endoora title/motto remain unchanged.
- [ ] No horizontal overflow appears at 360 px.

Click **فارسی** again.

- [ ] UI returns to Persian.
- [ ] Layout direction returns to RTL.

Day 05 does not pass if English is the default user-facing interface.

## Current execution evidence — 2026-08-24

- **PASS** — `npm run check:ia`, `check:design`, `check:components`, and `check:public`.
- **PASS** — workspace lint and TypeScript checks.
- **PASS** — production build; 105 static/dynamic route outputs generated with no metadata-base warning.
- **PASS** — secret-scanner unit tests (5) and tracked-file scan.
- **PASS** — rendered desktop and exact 360 px checks in Persian/RTL and English/LTR; no horizontal overflow or console warning/error.
- **PASS** — all six flow selectors, numbered steps, and bounded Previous/Next controls exercised at 360 px.
- **PASS** — Persian and English homepage shells, one Placement primary action, localized feature copy, and evidence-neutral Learner Twin preview.
- **PASS (2026-08-26 follow-up)** — Django system check, all 103 backend tests, and migration-drift detection now pass against the local PostgreSQL test database; the former removed-runtime blocker is resolved for verification.
- **PENDING HUMAN EVIDENCE** — the five-person hallway-test table remains intentionally blank.

## Human-test honesty rule

The five tester rows above must be completed by real people. Automated checks and browser QA do not count as hallway testers, and blank rows must remain blank until the sessions occur. Do not mark Day 05 fully accepted or create its Git checkpoint before this evidence exists.

## 9. Root HTML language/direction verification

The language switch must update the real document root, not only an inner container.

With the page in Persian, open DevTools -> Elements and inspect the first `<html>` element:

```html
<html lang="fa" dir="rtl">
```

Switch to English and inspect the same `<html>` element:

```html
<html lang="en" dir="ltr">
```

Then switch back to Persian before continuing.

This matters for screen readers, browser language behavior, direction-aware global CSS, and accessibility tooling.

### Mobile width

Set Chrome DevTools responsive width to **360** exactly. A 400 px test is useful but does not satisfy the Day 05 360 px gate.

- [ ] Width reads `360`.
- [ ] No horizontal page overflow.
- [ ] Brand, language switch and developer links remain usable.
- [ ] Role cards stack to one column.
- [ ] Persian default remains RTL.
- [ ] English option remains LTR.
