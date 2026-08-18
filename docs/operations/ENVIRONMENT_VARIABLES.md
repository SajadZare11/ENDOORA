# Endoora environment variables

This file documents variables used by the current local/public shell. Real secrets belong in the local `.env` file or deployment secret manager and must never be committed.

| Variable | Purpose | Local/default example | Secret |
|---|---|---|---|
| `ENDOORA_ENV` | Environment name | `development` | No |
| `ENDOORA_TIMEZONE` | Display/scheduling timezone | `Asia/Tehran` | No |
| `ENDOORA_PUBLIC_URL` | Canonical public website origin used by metadata, sitemap, robots and OG URLs | `https://endoora.ir` | No |
| `ENDOORA_WEB_ORIGIN` | Local browser web origin | `http://localhost:3000` | No |
| `ENDOORA_API_ORIGIN` | Local/public API origin | `http://localhost:8000` | No |
| `ENDOORA_API_INTERNAL_URL` | Server-to-server URL used by Next.js to reach Django locally | `http://127.0.0.1:8000` | No |
| `ENDOORA_DJANGO_SECRET_KEY` | Django cryptographic secret | local placeholder only | Yes |
| `ENDOORA_DEBUG` | Django debug toggle | `1` locally | No |
| `ENDOORA_ALLOWED_HOSTS` | Django allowed host list | `localhost,127.0.0.1` | No |
| `ENDOORA_DB_NAME` | PostgreSQL database name | `endoora` | No |
| `ENDOORA_DB_USER` | PostgreSQL user | `endoora` | Usually no |
| `ENDOORA_DB_PASSWORD` | PostgreSQL password | local placeholder only | Yes |
| `ENDOORA_DB_HOST` | PostgreSQL host | `127.0.0.1` | No |
| `ENDOORA_DB_PORT` | PostgreSQL port | `5432` | No |
| `ENDOORA_REDIS_URL` | Redis connection string | `redis://127.0.0.1:6379/0` | Potentially |
| `ENDOORA_OPENROUTER_API_KEY` | Future OpenRouter key | blank until AI day | Yes |
| `ENDOORA_ZARINPAL_MERCHANT_ID` | Future ZarinPal merchant identifier | blank until payments day | Yes |
| `ENDOORA_SMS_API_KEY` | Future SMS provider key | blank until notifications day | Yes |

## Day 06 rule

`ENDOORA_PUBLIC_URL` is the only new Day 06 variable. Keep `https://endoora.ir` for production/canonical metadata. Local page rendering still runs on `http://localhost:3000`; do not replace the canonical URL with localhost.
