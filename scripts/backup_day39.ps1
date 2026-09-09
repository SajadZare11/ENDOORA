# Day 39 Automated Backup Script
$ErrorActionPreference = "Stop"

$repoRoot = "e:\0\Work\Website\The General Website\Endoora"
$backupDir = "$repoRoot\backups"
$backupZip = "$backupDir\day39_backup.zip"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

if (Test-Path $backupZip) {
    Remove-Item $backupZip -Force
}

Write-Host "Creating Day 39 backup archive..."
$stagingDir = "$env:TEMP\endoora_day39_staging"
if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null

$itemsToCopy = @(
    "apps\api\marketplace",
    "apps\api\profiles",
    "apps\web\app\teachers",
    "apps\web\app\bookings",
    "apps\web\lib\marketplace.ts",
    "docs\marketplace",
    "scripts\check_day39.py"
)

foreach ($item in $itemsToCopy) {
    $src = Join-Path $repoRoot $item
    $dest = Join-Path $stagingDir $item
    $destParent = Split-Path $dest -Parent
    if (-not (Test-Path $destParent)) {
        New-Item -ItemType Directory -Path $destParent -Force | Out-Null
    }
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dest -Recurse -Force
    }
}

Compress-Archive -Path "$stagingDir\*" -DestinationPath $backupZip -CompressionLevel Optimal
Remove-Item $stagingDir -Recurse -Force

$zipSize = (Get-Item $backupZip).Length / 1KB
Write-Host ("Backup created successfully: {0} ({1:N1} KB)" -f $backupZip, $zipSize)
