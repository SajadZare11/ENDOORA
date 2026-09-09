# Backup script for Day 36
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $PSScriptRoot "..\backups\day36_$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$targets = @(
    "apps\api\teachers",
    "apps\web\app\(teacher)\teacher\analytics",
    "apps\web\app\(teacher)\teacher\interventions",
    "apps\web\lib\teacher-analytics.ts",
    "docs\teachers",
    "scripts\check_day36.py"
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

Write-Host "Day 36 backup completed successfully to: $backupDir"
