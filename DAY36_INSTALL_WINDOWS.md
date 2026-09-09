# Endoora Day 36 - Windows Local Setup & Verification Guide

## 1. Prerequisites
- Python 3.10+ or 3.12+ (Windows x64)
- Node.js 20+ & npm
- Git

## 2. Backend Setup & Migrations
```powershell
cd "e:\0\Work\Website\The General Website\Endoora\apps\api"
.\.venv\Scripts\Activate.ps1
python manage.py migrate teachers
python manage.py test teachers --settings=endoora_api.settings.test
```

## 3. Frontend Setup & Static Build
```powershell
cd "e:\0\Work\Website\The General Website\Endoora\apps\web"
npm run lint
npm run typecheck
npm run build
```

## 4. Automated Contract Verification & Secret Scanning
```powershell
cd "e:\0\Work\Website\The General Website\Endoora"
.\apps\api\.venv\Scripts\python.exe scripts/check_day36.py
.\apps\api\.venv\Scripts\python.exe scripts/scan_secrets.py
```
