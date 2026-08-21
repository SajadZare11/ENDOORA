# Day 05 Root Locale Fix

## Why this correction exists

The English/LTR screenshot showed the visible Day 05 container in English/LTR while the real document root still reported:

`<html lang="fa" dir="rtl">`

That is not sufficient for accessibility/localization correctness.

## REPLACE

- `apps/web/app/design-system/information-architecture/page.tsx`
- `scripts/check-information-architecture.mjs`
- `docs/operations/DAY_05_ACCEPTANCE_GATE.md`
- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`

## NEW

- `scripts/stage_day05_root_locale_fix.ps1`
- `DAY05_ROOT_LOCALE_FIX_MANIFEST.md`

## Database migration

None.

## Dependency changes

None.

## Expected browser behavior

Persian:

`<html lang="fa" dir="rtl">`

English:

`<html lang="en" dir="ltr">`

## Copy destination

Extract into:

`E:\0\Work\Website\The General Website\Endoora`

Do not delete the project first.
