# Endoora local development baseline — Day 02

## Runtime boundaries

- Web: Next.js, local port 3000.
- API: Django + DRF, local port 8000.
- PostgreSQL: Docker Desktop, local port 5432.
- Redis: Docker Desktop, local port 6379.
- Timestamps: stored in UTC.
- Display/scheduling timezone baseline: `Asia/Tehran` via `ENDOORA_TIMEZONE`.

## Environment rule

Development, test, staging, and production use separate settings modules. Real secrets are never stored in Git. `.env.example` documents names only; `.env` is local and ignored.

## Local health checks

- Web liveness: `http://localhost:3000/api/health`
- API liveness: `http://127.0.0.1:8000/api/health/live/`
- API readiness: `http://127.0.0.1:8000/api/health/`

The readiness endpoint returns 200 only when both PostgreSQL and Redis are reachable. If either dependency is unavailable, it returns a degraded response and HTTP 503.
