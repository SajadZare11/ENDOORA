$ErrorActionPreference = "Stop"

$paths = @(
  "apps/web/app/design-system/information-architecture/page.tsx"
  "apps/web/app/design-system/information-architecture/information-architecture.module.css"
  "docs/product/localization-contract.md"
  "docs/decisions/ADR-002-navigation.md"
  "docs/operations/DAY_05_ACCEPTANCE_GATE.md"
  "docs/product/PROJECT_STATE.md"
  "docs/product/CHANGELOG.md"
  "scripts/check-information-architecture.mjs"
  "scripts/stage_day05_persian_correction.ps1"
  "DAY05_PERSIAN_CORRECTION_MANIFEST.md"
)

Write-Host "Staging only the Day 05 Persian-first correction..."
git add -- $paths
git status --short
