# Day 06 backup and rollback

Day 06 adds one PostgreSQL table: `waitlist_waitlistsignup`.

## Before migration

From the repository root, keep the existing Docker volumes intact. Do not run destructive volume commands.

Create a PostgreSQL dump to a local folder outside Git. Example PowerShell path:

`E:\0\Work\Website\The General Website\Endoora\local_backups\day06-before-waitlist.sql`

Use the PostgreSQL/Docker backup command that already works in your Day 02 environment. Confirm the dump file is non-empty before migrating.

## Forward migration

`python manage.py migrate`

## Safe rollback limitation

The migration can be reversed with:

`python manage.py migrate waitlist zero`

but doing so deletes the waitlist table and any emails collected after Day 06. Therefore, once real submissions exist, back up/export the table before any rollback. Never reverse the migration casually after collecting real user data.

## Code rollback

Use Git to return to the last verified commit only after preserving any Day 06 waitlist data. Do not use `git reset --hard` as a first response to a failure.
