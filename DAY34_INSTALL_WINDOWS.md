# Day 34 Windows Installation & Verification Guide

1. Run pre-migration backup:
   `powershell -ExecutionPolicy Bypass -File scripts/backup_day34.ps1`
2. Apply Django database migrations:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py migrate`
3. Run backend tests:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test teachers --settings=endoora_api.settings.test`
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test --settings=endoora_api.settings.test`
4. Run Day 34 contract verification:
   `apps/api/.venv/Scripts/python.exe scripts/check_day34.py`
5. Run regression contract checks:
   `apps/api/.venv/Scripts/python.exe scripts/check_day33.py`
   `apps/api/.venv/Scripts/python.exe scripts/check_day32.py`
   `apps/api/.venv/Scripts/python.exe scripts/check_day31.py`
   `apps/api/.venv/Scripts/python.exe scripts/check_day30.py`
6. Run secret scan:
   `apps/api/.venv/Scripts/python.exe scripts/scan_secrets.py`
7. Run frontend lint, typecheck, and build:
   `cmd.exe /c npm --prefix apps/web run lint`
   `cmd.exe /c npm --prefix apps/web run typecheck`
   `cmd.exe /c npm --prefix apps/web run build`
