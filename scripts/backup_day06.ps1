$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot

Write-Host "Day 06 pre-migration PostgreSQL backup"
Write-Host "Repository: $repoRoot"

$services = @(docker compose config --services)
if ($LASTEXITCODE -ne 0 -or $services.Count -eq 0) {
    throw "Docker Compose services could not be read. Start Docker Desktop and run this script again."
}

$postgresService = $null
foreach ($service in $services) {
    docker compose exec -T $service sh -c 'command -v pg_dump >/dev/null 2>&1' 2>$null
    if ($LASTEXITCODE -eq 0) {
        $postgresService = $service
        break
    }
}

if (-not $postgresService) {
    throw "No running Docker Compose service with pg_dump was found. Do not run the Day 06 migration yet."
}

$backupDir = Join-Path (Split-Path $repoRoot -Parent) "Endoora_backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $backupDir "day06-before-waitlist-$stamp.sql"
$containerBackup = "/tmp/endoora-day06-before.sql"

Write-Host "PostgreSQL service: $postgresService"
Write-Host "Creating dump inside the PostgreSQL container..."

docker compose exec -T $postgresService sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > /tmp/endoora-day06-before.sql'
if ($LASTEXITCODE -ne 0) {
    throw "pg_dump failed. Do not run the Day 06 migration."
}

docker compose cp "${postgresService}:${containerBackup}" $backupPath
if ($LASTEXITCODE -ne 0) {
    throw "The database dump was created in Docker but could not be copied to Windows. Do not run the Day 06 migration."
}

docker compose exec -T $postgresService sh -c 'rm -f /tmp/endoora-day06-before.sql' | Out-Null

$file = Get-Item $backupPath
if ($file.Length -le 0) {
    throw "Backup file is empty. Do not run the Day 06 migration."
}

Write-Host "BACKUP PASS"
Write-Host "Path: $($file.FullName)"
Write-Host "Size: $($file.Length) bytes"
