# Automated Backup Script for Day 38: Session Booking, Scheduling State Machine, and Timezone Management
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = "e:\0\Work\Website\The General Website\backups\day38-$Timestamp"

Write-Host "Creating Day 38 backup directory at: $BackupDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$FilesToBackup = @(
    "apps/api/marketplace/models.py",
    "apps/api/marketplace/services.py",
    "apps/api/marketplace/serializers.py",
    "apps/api/marketplace/views.py",
    "apps/api/marketplace/urls.py",
    "apps/api/marketplace/admin.py",
    "apps/api/marketplace/tests.py",
    "apps/api/marketplace/migrations/0002_sessionbooking.py",
    "apps/web/lib/marketplace.ts",
    "apps/web/app/bookings/page.tsx",
    "apps/web/app/bookings/bookings.module.css",
    "apps/web/app/bookings/[id]/page.tsx",
    "apps/web/app/bookings/[id]/booking-detail.module.css",
    "scripts/check_day38.py",
    "docs/marketplace/session-booking-and-scheduling.md"
)

foreach ($relPath in $FilesToBackup) {
    $src = Join-Path "e:\0\Work\Website\The General Website\Endoora" $relPath
    if (Test-Path -LiteralPath $src) {
        $dest = Join-Path $BackupDir $relPath
        $parent = Split-Path $dest
        if (-not (Test-Path -LiteralPath $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }
        Copy-Item -LiteralPath $src -Destination $dest -Force
        Write-Host "Backed up: $relPath" -ForegroundColor Green
    } else {
        Write-Host "File not found: $relPath" -ForegroundColor Yellow
    }
}

Write-Host "Day 38 backup completed successfully!" -ForegroundColor Cyan
