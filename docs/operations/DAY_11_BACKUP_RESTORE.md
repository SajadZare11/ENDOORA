# Day 11 database backup and rollback

Day 11 introduces database tables, so take a backup before migration.

## Windows / PyCharm — backup

From the repository root, first verify PostgreSQL/Redis are running:

`docker compose ps`

Create a private backup folder if it does not exist:

`New-Item -ItemType Directory -Force PRIVATE_DO_NOT_COPY_TO_GIT\backups`

If PostgreSQL is the Docker service named `postgres`, run:

`docker compose exec -T postgres pg_dump -U endoora -d endoora -Fc > PRIVATE_DO_NOT_COPY_TO_GIT\backups\pre_day11.dump`

If your `.env` uses different database/user names, use those local values. Do not paste credentials into chat.

Verify the backup is not empty:

`Get-Item PRIVATE_DO_NOT_COPY_TO_GIT\backups\pre_day11.dump | Select-Object Name,Length`

The `Length` must be greater than 0.

## Migration

From `apps\api` with the virtual environment active:

`python manage.py migrate`

Expected new migrations include `core.0001_initial` and `audit.0001_initial`.

## Safe rollback of Day 11 schema

Only before later roadmap migrations depend on these apps, and only after keeping the backup:

`python manage.py migrate audit zero`

Then:

`python manage.py migrate core zero`

This removes Day 11 operational tables. It does not revert source files.

## Restore from backup

Restore is a recovery operation and should not be done casually. If migration fails, preserve the complete error output first. Do not use `docker compose down -v`, `flush`, migration faking, or destructive reset commands as a first response.
