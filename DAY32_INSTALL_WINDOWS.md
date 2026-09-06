# Day 32 Windows Installation & Verification Guide

1. Run pre-migration backup:
   `powershell -ExecutionPolicy Bypass -File scripts/backup_day32.ps1`
2. Apply Django database migrations:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py migrate`
3. Run backend tests:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test search support --settings=endoora_api.settings.test`
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test --settings=endoora_api.settings.test`
4. Run Day 32 contract verification:
   `python scripts/check_day32.py`
5. Run regression contract checks:
   `python scripts/check_day31.py`
6. Run secret scan:
   `python scripts/scan_secrets.py`
7. Run frontend lint and typecheck:
   `npm.cmd --prefix apps/web run lint`
   `npm.cmd --prefix apps/web run typecheck`
8. Build frontend:
   `npm.cmd --prefix apps/web run build`
