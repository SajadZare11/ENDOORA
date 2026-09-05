# Day 29 Windows Installation & Verification Guide

1. Run pre-migration backup:
   `powershell -ExecutionPolicy Bypass -File scripts/backup_day29.ps1`
2. Apply Django database migrations:
   `python manage.py migrate`
3. Run backend tests:
   `python manage.py test gamification --settings=endoora_api.settings.test`
   `python manage.py test --settings=endoora_api.settings.test`
4. Run Day 29 contract verification:
   `python scripts/check_day29.py`
5. Run frontend lint and typecheck:
   `npm.cmd run lint`
   `npm.cmd run typecheck`
6. Build frontend:
   `npm.cmd run build`
