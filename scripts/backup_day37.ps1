# Backup script for Day 37
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $PSScriptRoot "..\backups\day37_$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$targets = @(
    "apps\api\marketplace",
    "apps\web\app\(teacher)\marketplace",
    "apps\web\app\(learner)\learn\now",
    "apps\web\lib\marketplace.ts",
    "docs\marketplace",
    "scripts\check_day37.py"
)

foreach ($target in $targets) {
    $src = Join-Path $PSScriptRoot "..\$target"
    if (Test-Path $src) {
        $dest = Join-Path $backupDir $target
        $destParent = Split-Path -Parent $dest
        if (-not (Test-Path $destParent)) {
            New-Item -ItemType Directory -Force -Path $destParent | Out-Null
        }
        Copy-Item -Path $src -Destination $dest -Recurse -Force
    }
}

Write-Host "Day 37 backup completed successfully to: $backupDir"
