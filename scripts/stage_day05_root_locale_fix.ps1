$ErrorActionPreference = "Stop"

$paths = @(
  "apps/web/app/design-system/information-architecture/page.tsx"
  "scripts/check-information-architecture.mjs"
  "docs/operations/DAY_05_ACCEPTANCE_GATE.md"
  "docs/product/PROJECT_STATE.md"
  "docs/product/CHANGELOG.md"
  "scripts/stage_day05_root_locale_fix.ps1"
  "DAY05_ROOT_LOCALE_FIX_MANIFEST.md"
)

Write-Host "Staging only the Day 05 root locale correction..."
git add -- $paths
git status --short
