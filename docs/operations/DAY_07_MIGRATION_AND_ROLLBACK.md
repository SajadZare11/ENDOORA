# Day 07 migration and rollback

Day 07 adds `accounts.0002_user_email_verified_at`. The code can be reviewed and tested without touching the active database; apply the migration only after the following backup gate.

## Backup and apply

1. Start the project's PostgreSQL service and confirm the configured database is reachable.
2. Create a timestamped folder under `PRIVATE_DO_NOT_COPY_TO_GIT/backups/day07/`.
3. Run `pg_dump --format=custom` with the configured host, port, database, and user. Do not place credentials in the command history or repository.
4. Confirm the dump exists, is non-empty, and can be listed with `pg_restore --list`.
5. Export waitlist and legacy-user row counts before migration.
6. From `apps/api`, run `python manage.py migrate accounts 0002`.
7. Run `python manage.py check`, `python manage.py makemigrations --check --dry-run`, and `python manage.py test` against PostgreSQL.
8. Recheck waitlist and user row counts and inspect one existing account in Django admin.

## Rollback

If the migration itself fails before application traffic resumes, run `python manage.py migrate accounts 0001` and investigate. If any data-integrity concern remains, stop writes, restore the verified pre-Day-07 dump into a clean database, point the application at the restored database, and rerun health/security checks before resuming traffic.

The migration only adds a nullable timestamp, so rolling back removes only uncommitted email-verification timestamps. It does not delete users, consent records, OTP records, sessions, or deletion requests.

## Deletion safety

Day 07 stores delayed deletion requests and cancellation timestamps but does not run a hard-delete worker. Do not create an automated destructive worker until retention, legal, audit, learner-content, teacher-content, billing, and recovery policies are approved.
