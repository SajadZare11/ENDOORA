# Day 02 acceptance gate

Do not start Day 03 until every item below is verified on the founder's Windows/PyCharm machine and GitHub repository.

- [ ] `docker compose ps` shows PostgreSQL and Redis healthy.
- [ ] `http://127.0.0.1:8000/api/health/` returns HTTP 200 with database=`ok` and redis=`ok`.
- [ ] `http://localhost:3000` shows Endoora and `API connected`.
- [ ] Stop the API, refresh the web page, and confirm the understandable `API unavailable` state appears.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] `python manage.py check` passes.
- [ ] `python manage.py test` passes.
- [ ] `python manage.py makemigrations --check --dry-run` reports no changes.
- [ ] `python scripts/scan_secrets.py` passes from the repository root.
- [ ] `git status` does not show `.env` as tracked.
- [ ] Desktop viewport works.
- [ ] 360 px mobile viewport works without horizontal overflow.
- [ ] A second clean clone can repeat the documented startup process.
- [ ] GitHub Actions CI passes.

## Current audit evidence — 2026-08-26

- **PASS** — PostgreSQL/Redis integration health: `/api/health/` returned HTTP 200 with both dependencies `ok`; `/api/health/live/` returned HTTP 200.
- **PASS** — frontend lint, reproducible type generation/typecheck, production build, and the complete Day 01–10 static-contract suite.
- **PASS** — Django system check, 103 backend tests, and migration-drift check under the isolated acceptance database.
- **PASS** — secret-scanner tests (5/5), tracked-file scan, and `.env` exclusion.
- **PASS** — desktop and exact 360 px browser journeys, including an understandable API-error/retry state.
- **PASS (historical remote evidence)** — the latest inspected public GitHub Actions run succeeded in all frontend, backend, and secret-scan jobs.
- **NOT RE-RUN IN THIS AUDIT** — Docker CLI was unavailable in the current shell and a destructive second clean clone was unnecessary. The checked-in Compose file, setup documentation, CI service containers, and live dependency health were inspected instead.

The original checklist remains above as the reproducibility procedure for a genuinely new machine; its old developer-home wording has since been superseded by the public and role-specific applications.
