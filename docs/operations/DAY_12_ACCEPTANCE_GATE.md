# Day 12 acceptance gate — CEFR skill and content taxonomy

Do not mark Day 12 complete until the taxonomy is versioned, traceable, safe to consume, and all applicable checks pass.

## A. Protect the database

Before applying the migration, verify PostgreSQL/Redis with `docker compose ps` and create a private, non-Git backup as described in `DAY_11_BACKUP_RESTORE.md`:

`PRIVATE_DO_NOT_COPY_TO_GIT\\backups\\day12\\<timestamp>\\endoora-pre-day12.dump`

The dump must be non-empty and its real path/size must be recorded in `docs/product/PROJECT_STATE.md`.

## B. Static contract

From the repository root:

`python scripts\\check_day12.py`

Expected output begins: `Day 12 static checks passed:`

The checker covers the taxonomy app, stable UUID/slugs, bilingual labels, CEFR/objective structure, topic/tag trees, release immutability, deprecation traceability, prerequisite-cycle protection, admin safety, and the API route.

## C. Migration and import

From `apps\\api` with the project virtual environment active:

- `python manage.py migrate` applies `taxonomy.0001_initial`.
- `python manage.py check` reports no issues.
- `python manage.py makemigrations --check --dry-run` reports `No changes detected`.
- `python manage.py import_taxonomy --dry-run` validates and rolls back safely.
- `python manage.py import_taxonomy` imports the reviewed `day12-v1` dataset.
- Running the identical import a second time creates no nodes, releases, revisions, or prerequisite changes.

Verify the release, 62 nodes, 62 revisions, and 9 active prerequisite relationships against the command output/database.

## D. Taxonomy invariants

- Six core skills plus pronunciation, strategy, and culture domains exist.
- Subskills/objectives have parents; stable slugs are lowercase ASCII and never renamed.
- Persian and English labels/descriptions are both present; CEFR levels are attached only to objectives/topics.
- Grammar topics, vocabulary topics, age tags, and exam tags are represented.
- A release with an existing version but a different checksum is rejected.
- Node UUIDs remain stable when a later release changes wording.
- Deprecated nodes remain traceable through explicit history queries but are hidden from default list and detail selectors.
- Prerequisite relationships reject self-links and cycles; retired links remain historical.

## E. API and admin journey

Start the API and verify:

- `GET /api/taxonomy/nodes/` defaults to Persian display labels and active nodes.
- `GET /api/taxonomy/nodes/?lang=en` explicitly selects English labels.
- `GET /api/taxonomy/objectives/?cefr=A2` returns only A2 objectives.
- `include_deprecated=1` is required to retrieve deprecated list/detail records.
- Pagination is bounded and invalid page values fail safely to defaults.
- `/admin/` taxonomy nodes support search/filtering and stable identity fields are read-only on existing records.
- Releases, revisions, and prerequisite history cannot be added/deleted through admin; nodes cannot be deleted and must be deprecated.

## F. Regression and privacy checks

Repository root:

- `python scripts\\scan_secrets.py`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Backend:

- `python manage.py test taxonomy`
- `python manage.py test`

Review API/browser logs for secrets, raw learner evidence, or unhandled errors. Taxonomy responses must not expose unrelated private learner data.

## G. Final Git checkpoint

Only after the applicable database, import, API/admin, regression, and manual checks pass:

`git status --short --branch`

`git add .`

`git commit -m "Day 12: Build the CEFR skill and content taxonomy"`

`git push origin main`

Record the real successful commands, backup path/size, and commit hash in `docs/product/PROJECT_STATE.md`. Never invent these values. Preserve unrelated working-tree changes by reviewing the staged diff before committing.

**Success gate:** a content editor can select one stable objective ID while Persian/English wording evolves without changing that identifier.
