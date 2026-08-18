# Day 04 package manifest

This package is built on the Day 03 generated workspace and preserves all Day 01-Day 03 functionality.

## NEW

- `packages/ui/src/components/AIResultCard.tsx`
- `packages/ui/src/components/AccessibleChart.tsx`
- `packages/ui/src/components/Button.tsx`
- `packages/ui/src/components/Card.tsx`
- `packages/ui/src/components/DataTable.tsx`
- `packages/ui/src/components/Dialog.tsx`
- `packages/ui/src/components/Feedback.tsx`
- `packages/ui/src/components/FormControls.tsx`
- `packages/ui/src/components/Navigation.tsx`
- `packages/ui/src/components/ProviderStatus.tsx`
- `packages/ui/src/components/States.tsx`
- `packages/ui/src/components/Stepper.tsx`
- `packages/ui/src/components/Tabs.tsx`
- `packages/ui/src/components/Toast.tsx`
- `packages/ui/src/components/index.ts`
- `packages/ui/src/components.css`
- `apps/web/app/design-system/components/page.tsx`
- `apps/web/app/design-system/components/components-preview.module.css`
- `scripts/check-components.mjs`
- `scripts/stage_day04.ps1`
- `docs/product/component-library.md`
- `docs/operations/DAY_04_ACCEPTANCE_GATE.md`
- `DAY04_PACKAGE_MANIFEST.md`

## REPLACE / UPDATE

- `.github/workflows/ci.yml`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `packages/ui/package.json`
- `packages/ui/src/index.tsx`
- `packages/ui/src/theme.ts`
- `packages/ui/src/tokens.css`
- `scripts/check-design-tokens.mjs`
- `README.md`
- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`
- `docs/product/ROADMAP_PROGRESS.md`
- `docs/quality/TEST_MATRIX.md`
- `docs/quality/REGRESSION_CHECKLIST.md`

## MIGRATION

None. Day 04 does not change Django models or persistent database data.

## DELETE

None.

## Existing customizations preserved

Day 04 does not overwrite the pre-existing local changes identified before Day 03 in:

- `apps/web/tsconfig.json`
- `docs/product/feature-map.csv`
- `docs/product/feature-route-data-map.csv`
- PyCharm `.idea` files

Real `.env` files, Docker volumes, databases, uploads, credentials, and Git history are never included in the changed-files overlay.

## Copy destination

Extract the changed-files package into:

`E:\0\Work\Website\The General Website\Endoora`

Allow replacement only for files listed under **REPLACE / UPDATE**. Do not delete the existing project first.
