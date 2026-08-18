# Day 05 Persian-First Correction Manifest

## Purpose

Correct the Day 05 prototype so Endoora follows its permanent localization rule:

- Persian is the default UI.
- Default layout is RTL.
- English is available as a switch.
- `Endoora` and `A new door to your English` remain English.
- Technical routes/identifiers remain English-safe and LTR.

## REPLACE

- `apps/web/app/design-system/information-architecture/page.tsx`
- `apps/web/app/design-system/information-architecture/information-architecture.module.css`
- `scripts/check-information-architecture.mjs`
- `docs/decisions/ADR-002-navigation.md`
- `docs/operations/DAY_05_ACCEPTANCE_GATE.md`
- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`

## NEW

- `docs/product/localization-contract.md`
- `scripts/stage_day05_persian_correction.ps1`
- `DAY05_PERSIAN_CORRECTION_MANIFEST.md`

## Database migration

None.

## Dependency changes

None.

## Copy destination

Extract into the existing repository root:

`E:\0\Work\Website\The General Website\Endoora`

Do not delete the project first.
