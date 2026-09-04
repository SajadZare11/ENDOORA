$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\$Timestamp"
$BackupFile = Join-Path $BackupDir "endoora-pre-day16.dump"

Write-Host "Checking the Endoora PostgreSQL container..."
$Running = docker inspect -f "{{.State.Running}}" endoora-postgres 2>$null
if ($LASTEXITCODE -ne 0 -or $Running -ne "true") {
    Write-Host "Docker daemon is offline. Checking existing untracked Day 16 baseline backup..."
    $FallbackDir = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day16\20260820-160000"
    $FallbackFile = Join-Path $FallbackDir "endoora-pre-day16.dump"
    if (Test-Path $FallbackFile) {
        $Item = Get-Item $FallbackFile
        Write-Host "Found existing Day 16 baseline backup: $FallbackFile ($($Item.Length) bytes)"
        exit 0
    }
    throw "endoora-postgres is not running and no baseline backup found."
}

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
Write-Host "Creating a PostgreSQL custom-format backup..."
docker exec endoora-postgres sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/endoora-pre-day16.dump'
if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. No Day 16 migration should be run."
}

docker cp "endoora-postgres:/tmp/endoora-pre-day16.dump" $BackupFile
if ($LASTEXITCODE -ne 0) {
    throw "docker cp failed. No Day 16 migration should be run."
}
docker exec endoora-postgres rm -f /tmp/endoora-pre-day16.dump | Out-Null

$Item = Get-Item $BackupFile
if ($Item.Length -lt 1024) {
    throw "Backup file is unexpectedly small ($($Item.Length) bytes). Do not migrate."
}

Write-Host ""
Write-Host "Day 16 database backup verified."
Write-Host "Path: $BackupFile"
Write-Host "Size: $($Item.Length) bytes"
Write-Host "Do not commit this backup to Git."
