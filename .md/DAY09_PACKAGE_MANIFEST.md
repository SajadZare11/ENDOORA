# Endoora Day 09 Package Manifest

## New files

- `apps/api/dashboard/*`
- `apps/web/lib/learner-dashboard.ts`
- `apps/web/components/learner/LearnerShell.tsx`
- `apps/web/components/learner/LearnerDashboard.tsx`
- `apps/web/components/learner/learner.css`
- `apps/web/app/(learner)/layout.tsx`
- `apps/web/app/(learner)/dashboard/page.tsx`
- `scripts/apply_day09.py`
- `scripts/check_day09.py`
- `scripts/record_day09.py`
- `docs/operations/DAY_09_ACCEPTANCE_GATE.md`

## Existing files

Run `python scripts\\apply_day09.py` after copying the package.

That script changes only the minimum required lines in:

- `apps/api/endoora_api/settings/base.py`
- `apps/api/endoora_api/urls.py`
- `apps/web/next.config.ts`

It intentionally refuses to overwrite a complex existing `rewrites()` function.

## Migration

None.

## Day 09 behavior

- Persian-first learner application shell with an English switch.
- One aggregated learner-home API.
- One primary next-best action.
- First-time learner -> the existing Day 06 `/placement` entry point.
- No invented CEFR/skill/progress/XP/class/assignment data.
- Anonymous and non-learner roles denied server-side.
- Loading, error, retry, offline, and permission-denied states.
- Desktop sidebar and 360 px mobile bottom navigation.
