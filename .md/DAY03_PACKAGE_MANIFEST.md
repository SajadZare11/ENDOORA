# Day 03 package manifest

This package was built against the uploaded Endoora repository whose Git base is:

- `d208eb4` — `Day 02: Create the Endoora monorepo and reproducible local environment`

The uploaded working tree also contained pre-existing local modifications in `apps/web/tsconfig.json`, `docs/product/feature-map.csv`, `docs/product/feature-route-data-map.csv`, and PyCharm `.idea` files. Day 03 does **not** overwrite those files in the changed-files overlay.

## NEW

- `apps/web/app/design-system/page.tsx`
- `apps/web/app/design-system/design-system.module.css`
- `packages/ui/src/tokens.css`
- `packages/ui/src/theme.ts`
- `docs/product/design-system.md`
- `docs/operations/DAY_03_ACCEPTANCE_GATE.md`
- `scripts/check-design-tokens.mjs`
- `scripts/test_scan_secrets.py`
- `scripts/stage_day03.ps1`
- `DAY03_PACKAGE_MANIFEST.md`

## REPLACE / UPDATE

- `.github/workflows/ci.yml`
- `README.md`
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/package.json`
- `package.json`
- `package-lock.json`
- `packages/ui/package.json`
- `packages/ui/src/index.tsx`
- `scripts/scan_secrets.py`
- `docs/product/PROJECT_STATE.md`
- `docs/product/CHANGELOG.md`
- `docs/product/ROADMAP_PROGRESS.md`
- `docs/quality/TEST_MATRIX.md`
- `docs/quality/REGRESSION_CHECKLIST.md`

## MIGRATION

None. Day 03 does not change Django models or persistent data.

## DELETE

None.

## Existing customizations preserved

- Day 01 product constitution and feature inventory remain in place.
- Day 02 Django API, health endpoints, Docker services, and environment files remain intact.
- Existing `.env` is never included or replaced.
- Existing Git history is never included in the overlay.
- Existing user changes to feature-map CSV files and `apps/web/tsconfig.json` are not part of the overlay.

## Static checks completed in the generated workspace

- UI TypeScript: PASS
- Contracts TypeScript: PASS
- Web TypeScript: PASS
- Web ESLint: PASS
- Design-token automated smoke test: PASS (14 AA contrast pairs + focus + reduced motion + logical CSS + centralized colors)
- Secret-scanner regression tests: PASS (5 tests)
- Repository secret scan: PASS
- Backend Python syntax compile: PASS

For safe Git staging, run `powershell -ExecutionPolicy Bypass -File scripts\stage_day03.ps1`; it stages only the Day 03 package files and leaves the pre-existing local modifications unstaged.

The sandbox could not run the Next.js production build because the uploaded `node_modules` contained the Windows SWC binary while the sandbox requires Linux SWC, and registry access is unavailable. Run `npm run build` on the founder's Windows machine before committing.

## Copy destination

Extract the changed-files overlay directly into the existing local repository root:

`E:\0\Work\Website\The General Website\Endoora`

Allow replacement of files listed in **REPLACE / UPDATE** above. Do not delete the project first.
