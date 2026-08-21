# Day 05 package manifest

## Baseline inspected before generation

The public GitHub repository `SajadZare11/ENDOORA` was inspected before creating this overlay.

The repository currently contains the Day 04 accessible component-library implementation and its project-state documentation.
The Day 05 package preserves those components and does not overwrite the user's pre-existing feature-map CSV files.

The exact current Git commit hash is intentionally **not invented**. Record it locally after verification.

## NEW

- `apps/web/app/design-system/information-architecture/page.tsx`
- `apps/web/app/design-system/information-architecture/information-architecture.module.css`
- `docs/product/sitemap.md`
- `docs/product/user-flows.md`
- `docs/product/account-hub.md`
- `docs/product/navigation-matrix.md`
- `docs/product/workflow-state-contracts.md`
- `docs/product/route-inventory.csv`
- `docs/product/wireframes/README.md`
- `docs/product/wireframes/placement-to-path.md`
- `docs/product/wireframes/daily-mission.md`
- `docs/product/wireframes/learn-now.md`
- `docs/product/wireframes/teacher-assignment.md`
- `docs/product/wireframes/fixed-class-enrollment.md`
- `docs/product/wireframes/ielts-attempt.md`
- `docs/decisions/ADR-002-navigation.md`
- `docs/operations/DAY_05_ACCEPTANCE_GATE.md`
- `scripts/check-information-architecture.mjs`
- `scripts/stage_day05.ps1`
- `DAY05_PACKAGE_MANIFEST.md`

## REPLACE / UPDATE

- `README.md`
- `docs/product/PROJECT_STATE.md`
- `docs/product/ROADMAP_PROGRESS.md`
- `docs/product/CHANGELOG.md`
- `docs/product/KNOWN_LIMITATIONS.md`
- `docs/quality/TEST_MATRIX.md`
- `docs/quality/REGRESSION_CHECKLIST.md`

## PRESERVED / NOT OVERWRITTEN

- `docs/product/feature-map.csv`
- `docs/product/feature-route-data-map.csv`
- `apps/web/tsconfig.json`
- all Day 03/04 UI component source
- `.idea`
- `.env`
- `.git`
- Docker volumes/databases
- virtual environments
- `node_modules`
- credentials
- uploads

`route-inventory.csv` is a new Day 05 derived contract and does not replace the existing feature maps.

## MIGRATION

None.

Day 05 changes no Django model, database schema or persistent user data.

## DEPENDENCY CHANGES

None.

`package.json` and `package-lock.json` are deliberately not changed.

## COPY DESTINATION

Extract this overlay directly into:

`E:\0\Work\Website\The General Website\Endoora`

Allow replacement only for the files listed under **REPLACE / UPDATE**.
Do not delete the project first.

## ACCEPTANCE

Run `docs/operations/DAY_05_ACCEPTANCE_GATE.md`.

The generated implementation can be statically validated, but Day 05 cannot truthfully be called fully complete until the founder performs the browser checks and five-person hallway test.
