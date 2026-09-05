# Day 30 Windows Installation & Verification Guide

1. Run pre-migration backup:
   `powershell -ExecutionPolicy Bypass -File scripts/backup_day30.ps1`
2. Apply Django database migrations:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py migrate`
3. Run backend tests:
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test content --settings=endoora_api.settings.test`
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test courses --settings=endoora_api.settings.test`
   `apps/api/.venv/Scripts/python.exe apps/api/manage.py test --settings=endoora_api.settings.test`
4. Run Day 30 contract verification:
   `python scripts/check_day30.py`
5. Run secret scan:
   `python scripts/scan_secrets.py`
6. Run frontend lint and typecheck:
   `npm.cmd --prefix apps/web run lint`
   `npm.cmd --prefix apps/web run typecheck`
7. Build frontend:
   `npm.cmd --prefix apps/web run build`
