# Day 02 package manifest

This is an **overlay**, not a full replacement repository. Copy these files into the existing Endoora repository root. It intentionally does not replace Day 01 product documents because the current local repository was not available for inspection.

## NEW / REPLACE Day 02 baseline

- `.gitignore`
- `.env.example`
- `.nvmrc`
- `package.json`
- `docker-compose.yml`
- `README.md`
- `.github/workflows/ci.yml`
- `apps/web/**`
- `apps/api/**`
- `packages/ui/**`
- `packages/contracts/**`
- `infra/README.md`
- `data/README.md`
- `scripts/scan_secrets.py`
- `docs/operations/LOCAL_DEVELOPMENT.md`
- `docs/operations/DAY_02_ACCEPTANCE_GATE.md`

## Generated locally after installation

- `package-lock.json` after `npm install` — commit this file.
- `apps/api/.venv/` — never commit.
- `.env` — never commit.
- PostgreSQL/Redis Docker volumes — never commit.

## Not modified by this overlay

- Existing Day 01 constitution, feature registry, risk register, ADRs, and project-state documents.

After Day 02 passes, update the existing `PROJECT_STATE.md`, `CHANGELOG.md`, `ROADMAP_PROGRESS.md`, and `TEST_MATRIX.md` with the actual test results and Git commit hash from your machine.
