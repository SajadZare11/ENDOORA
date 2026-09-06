# Backup script for Day 35
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $PSScriptRoot "..\backups\day35_$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$targets = @(
    "apps\api\teachers",
    "apps\web\app\(teacher)\teacher\grading",
    "apps\web\app\(teacher)\teacher\gradebook",
    "apps\web\app\(learner)\grades",
    "apps\web\lib\teacher-gradebook.ts",
    "docs\teachers"
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

Write-Host "Day 35 backup completed successfully to: $backupDir"
