# Endoora Day 10 changed-files package

## Objective

Build the Persian-first teacher application shell and simplified teacher navigation while preserving the existing Day 1–9 work.

## Important integration repair included

The current repository contains the Day 09 `dashboard` app source, but the inspected root Django settings/URL configuration does not register that app. This package therefore restores the Day 09 registration at the same time it adds the new Day 10 `teachers` app.

## REPLACE ENTIRE FILE

These two files intentionally preserve their current repository content and add the missing Day 09 dashboard registration plus Day 10 teacher registration:

- `apps/api/endoora_api/settings/base.py`
- `apps/api/endoora_api/urls.py`

If your local copies contain unrelated edits that are not yet on GitHub, back them up before replacing them and stop if the diff would remove those unrelated edits.

## NEW — backend

- `apps/api/teachers/__init__.py`
- `apps/api/teachers/apps.py`
- `apps/api/teachers/dashboard.py`
- `apps/api/teachers/serializers.py`
- `apps/api/teachers/views.py`
- `apps/api/teachers/urls.py`
- `apps/api/teachers/tests.py`

## NEW — frontend

- `apps/web/lib/teacher-dashboard.ts`
- `apps/web/components/teacher/TeacherShell.tsx`
- `apps/web/components/teacher/TeacherDashboard.tsx`
- `apps/web/components/teacher/TeacherFoundationPage.tsx`
- `apps/web/components/teacher/teacher.css`
- `apps/web/app/(teacher)/layout.tsx`
- `apps/web/app/(teacher)/teacher/page.tsx`
- `apps/web/app/(teacher)/teacher/classes/page.tsx`
- `apps/web/app/(teacher)/teacher/resources/page.tsx`
- `apps/web/app/(teacher)/teacher/question-bank/page.tsx`
- `apps/web/app/(teacher)/teacher/fixed-classes/new/page.tsx`
- `apps/web/app/(teacher)/teacher/account/page.tsx`
- `apps/web/app/(teacher)/marketplace/requests/page.tsx`

## NEW — quality/security/operations

- `scripts/check-day10.mjs`
- `docs/security/TEACHER_DASHBOARD_PRIVACY.md`
- `docs/operations/DAY_10_ACCEPTANCE_GATE.md`

## No migration

Day 10 deliberately adds no Django model and therefore no migration. It reuses the existing custom user teacher capability fields and the Day 08 `TeacherProfile`.

## What Day 10 now provides

- Persian-first teacher Home with English switch.
- Teacher-only server-side API access.
- Verification state and capability gates.
- One primary action selected by urgency rules.
- Safe summaries for classes, students, Learn Now requests, grading, schedule, and earnings.
- No invented future-domain counts, money, schedules, or learner data.
- Five teacher primary destinations: Home, Teach, Marketplace, Resources, Account.
- Mobile bottom navigation at 360 px.
- Question-bank and fixed-class foundation shortcuts without prematurely enabling later features.
- Privacy redaction rule: no raw learner writing/audio/conversation/answer content in dashboard summaries.
- Bounded dashboard service query regression test.
- Privacy/permission/API tests.
- Day 09 root Django app/URL registration repair.

## Do not mark Day 10 complete before verification

After copying the package, run every command and manual journey in `docs/operations/DAY_10_ACCEPTANCE_GATE.md`. Only after they pass should the Day 10 Git checkpoint be committed and pushed.
