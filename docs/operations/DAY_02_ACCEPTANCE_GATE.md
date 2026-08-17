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
