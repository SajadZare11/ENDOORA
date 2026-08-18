# Endoora

**A new door to your English**

Endoora is a Persian-first bilingual English-learning platform. This repository is a monorepo containing the Next.js web application, Django REST API, shared UI package, contracts package, local infrastructure, documentation, and reviewed seed data.

## Day 02 local development baseline

### Prerequisites

- Node.js 24 LTS
- Python 3.10.9
- Git
- Docker Desktop with Linux containers enabled
- PyCharm

### 1. Create the local environment file

From the repository root in Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The real `.env` is ignored by Git.

### 2. Start PostgreSQL and Redis

```powershell
docker compose up -d
```

Check them:

```powershell
docker compose ps
```

Both services should show `healthy` after a short wait.

### 3. Install frontend dependencies

```powershell
npm install
```

This creates `package-lock.json`. Commit that lock file.

### 4. Create the Python virtual environment

```powershell
py -3.10 -m venv apps\api\.venv
```

Activate it:

```powershell
apps\api\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
python -m pip install --upgrade pip
```

```powershell
python -m pip install -r apps\api\requirements.txt
```

### 5. Run Django migrations

```powershell
Set-Location apps\api
```

```powershell
python manage.py migrate
```

Return to the repository root:

```powershell
Set-Location ..\..
```

### 6. Start the API

Open a new PyCharm terminal named **Terminal 1 — API**.

```powershell
apps\api\.venv\Scripts\Activate.ps1
```

```powershell
Set-Location apps\api
```

```powershell
python manage.py runserver 127.0.0.1:8000
```

Expected health URL: `http://127.0.0.1:8000/api/health/`

### 7. Start the web app

Open a second PyCharm terminal named **Terminal 2 — Web**, from the repository root:

```powershell
npm run dev:web
```

Open `http://localhost:3000`.

The landing page should show the Endoora wordmark and `API connected` when PostgreSQL and Redis are healthy.

### 8. Run Day 02 checks

Frontend:

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm run build
```

Backend, from `apps\api` with the virtual environment active:

```powershell
python manage.py check
```

```powershell
python manage.py test
```

Migration drift:

```powershell
python manage.py makemigrations --check --dry-run
```

Secrets scan, from repository root:

```powershell
python scripts\scan_secrets.py
```

### Stop local services

Stop web/API servers with `Ctrl+C` in their terminals.

Stop PostgreSQL and Redis without deleting data:

```powershell
docker compose stop
```

Do not use `docker compose down -v`; `-v` deletes local database/Redis volumes.

## Day 03 design system

After the Day 02 services are running, open:

```text
http://localhost:3000/design-system
```

The preview contains Endoora color/type/spacing tokens, a bilingual mixed-content card, light/dark mode controls, RTL/LTR controls, semantic states, and keyboard-focus examples.

Run the Day 03 design smoke check from the repository root:

```powershell
npm run check:design
```

Expected result:

```text
Design token checks passed: 14 AA contrast pairs, focus, reduced motion, logical CSS, and centralized colors.
```

Then run the normal frontend regression checks:

```powershell
npm run lint
```

```powershell
npm run typecheck
```

```powershell
npm run build
```

The complete manual Day 03 gate is in `docs/operations/DAY_03_ACCEPTANCE_GATE.md`.
