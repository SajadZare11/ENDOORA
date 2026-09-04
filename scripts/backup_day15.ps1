$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = Join-Path $RepoRoot "PRIVATE_DO_NOT_COPY_TO_GIT\backups\day15\$Timestamp"
$BackupFile = Join-Path $BackupDir "endoora-pre-day15.dump"

Write-Host "Checking the Endoora PostgreSQL container..."
$Running = docker inspect -f "{{.State.Running}}" endoora-postgres 2>$null
if ($LASTEXITCODE -ne 0 -or $Running -ne "true") {
    throw "endoora-postgres is not running. Start it with: docker compose up -d postgres"
}

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
Write-Host "Creating a PostgreSQL custom-format backup..."
docker exec endoora-postgres sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/endoora-pre-day15.dump'
if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. No Day 15 migration should be run."
}

docker cp "endoora-postgres:/tmp/endoora-pre-day15.dump" $BackupFile
if ($LASTEXITCODE -ne 0) {
    throw "docker cp failed. No Day 15 migration should be run."
}
docker exec endoora-postgres rm -f /tmp/endoora-pre-day15.dump | Out-Null

$Item = Get-Item $BackupFile
if ($Item.Length -lt 1024) {
    throw "Backup file is unexpectedly small ($($Item.Length) bytes). Do not migrate."
}

Write-Host ""
Write-Host "Day 15 database backup verified."
Write-Host "Path: $BackupFile"
Write-Host "Size: $($Item.Length) bytes"
Write-Host "Do not commit this backup to Git."
