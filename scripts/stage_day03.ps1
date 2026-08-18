$ErrorActionPreference = "Stop"

$paths = @(
    ".github/workflows/ci.yml",
    "README.md",
    "apps/web/app/globals.css",
    "apps/web/app/layout.tsx",
    "apps/web/app/page.tsx",
    "apps/web/app/design-system/page.tsx",
    "apps/web/app/design-system/design-system.module.css",
    "apps/web/package.json",
    "package.json",
    "package-lock.json",
    "packages/ui/package.json",
    "packages/ui/src/index.tsx",
    "packages/ui/src/theme.ts",
    "packages/ui/src/tokens.css",
    "scripts/scan_secrets.py",
    "scripts/check-design-tokens.mjs",
    "scripts/test_scan_secrets.py",
    "scripts/stage_day03.ps1",
    "docs/product/design-system.md",
    "docs/operations/DAY_03_ACCEPTANCE_GATE.md",
    "docs/product/PROJECT_STATE.md",
    "docs/product/CHANGELOG.md",
    "docs/product/ROADMAP_PROGRESS.md",
    "docs/quality/TEST_MATRIX.md",
    "docs/quality/REGRESSION_CHECKLIST.md",
    "DAY03_PACKAGE_MANIFEST.md"
)

git add -- $paths
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Day 03 files staged. Run: git status"
