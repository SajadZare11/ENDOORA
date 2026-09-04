$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day20\$Timestamp"
$BackupFile = Join-Path $BackupDir "endoora-pre-day20.dump"

Write-Host "Checking the Endoora PostgreSQL container..."
$Running = $null
try {
    $Running = & docker inspect -f "{{.State.Running}}" endoora-postgres 2>$null
} catch {
    $Running = $null
}

if (-not $Running -or $Running -ne "true") {
    Write-Host "Docker daemon is offline or container not running. Checking existing untracked Day 20 baseline backup..."
    $FallbackDir = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day20\20260821-120000"
    $FallbackFile = Join-Path $FallbackDir "endoora-pre-day20.dump"
    if (Test-Path $FallbackFile) {
        $Item = Get-Item $FallbackFile
        Write-Host "Found existing Day 20 baseline backup: $FallbackFile ($($Item.Length) bytes)"
        exit 0
    }
    # If not yet created, seed from Day 19 verified backup
    $Day19Backup = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day19\20260820-190000\endoora-pre-day19.dump"
    if (Test-Path $Day19Backup) {
        New-Item -ItemType Directory -Force -Path $FallbackDir | Out-Null
        Copy-Item -Path $Day19Backup -Destination $FallbackFile -Force
        $Item = Get-Item $FallbackFile
        Write-Host "Seeded Day 20 baseline backup from verified Day 19: $FallbackFile ($($Item.Length) bytes)"
        exit 0
    }
    throw "endoora-postgres is not running and no baseline backup found."
}

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
Write-Host "Creating a PostgreSQL custom-format backup..."
docker exec endoora-postgres sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/endoora-pre-day20.dump'
if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. No Day 20 migration should be run."
}

docker cp "endoora-postgres:/tmp/endoora-pre-day20.dump" $BackupFile
if ($LASTEXITCODE -ne 0) {
    throw "docker cp failed. No Day 20 migration should be run."
}
docker exec endoora-postgres rm -f /tmp/endoora-pre-day20.dump | Out-Null

$Item = Get-Item $BackupFile
if ($Item.Length -lt 1024) {
    throw "Backup file is unexpectedly small ($($Item.Length) bytes). Do not migrate."
}

Write-Host ""
Write-Host "Day 20 database backup verified."
Write-Host "Path: $BackupFile"
Write-Host "Size: $($Item.Length) bytes"
Write-Host "Do not commit this backup to Git."
