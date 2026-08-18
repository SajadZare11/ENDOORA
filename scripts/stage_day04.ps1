$ErrorActionPreference = "Stop"

$paths = @(
    ".github/workflows/ci.yml",
    "apps/web/app/layout.tsx",
    "apps/web/app/page.tsx",
    "apps/web/app/design-system/components/page.tsx",
    "apps/web/app/design-system/components/components-preview.module.css",
    "apps/web/package.json",
    "package.json",
    "package-lock.json",
    "packages/ui/package.json",
    "packages/ui/src/index.tsx",
    "packages/ui/src/theme.ts",
    "packages/ui/src/tokens.css",
    "packages/ui/src/components.css",
    "packages/ui/src/components/AIResultCard.tsx",
    "packages/ui/src/components/AccessibleChart.tsx",
    "packages/ui/src/components/Button.tsx",
    "packages/ui/src/components/Card.tsx",
    "packages/ui/src/components/DataTable.tsx",
    "packages/ui/src/components/Dialog.tsx",
    "packages/ui/src/components/Feedback.tsx",
    "packages/ui/src/components/FormControls.tsx",
    "packages/ui/src/components/Navigation.tsx",
    "packages/ui/src/components/ProviderStatus.tsx",
    "packages/ui/src/components/States.tsx",
    "packages/ui/src/components/Stepper.tsx",
    "packages/ui/src/components/Tabs.tsx",
    "packages/ui/src/components/Toast.tsx",
    "packages/ui/src/components/index.ts",
    "scripts/check-design-tokens.mjs",
    "scripts/check-components.mjs",
    "scripts/stage_day04.ps1",
    "README.md",
    "docs/product/component-library.md",
    "docs/operations/DAY_04_ACCEPTANCE_GATE.md",
    "docs/product/PROJECT_STATE.md",
    "docs/product/CHANGELOG.md",
    "docs/product/ROADMAP_PROGRESS.md",
    "docs/quality/TEST_MATRIX.md",
    "docs/quality/REGRESSION_CHECKLIST.md",
    "DAY04_PACKAGE_MANIFEST.md"
)

git add -- $paths
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Day 04 files staged. Run: git status"
