# Endoora environment variables

Real secrets belong in the local `.env` file or deployment secret manager and must never be committed.

| Variable | Purpose | Local/default example | Secret |
|---|---|---|---|
| `ENDOORA_ENV` | Environment name | `development` | No |
| `ENDOORA_TIMEZONE` | Display/scheduling timezone | `Asia/Tehran` | No |
| `ENDOORA_PUBLIC_URL` | Canonical website origin | `https://endoora.ir` | No |
| `ENDOORA_WEB_ORIGIN` | Local browser web origin | `http://localhost:3000` | No |
| `ENDOORA_API_ORIGIN` | Local/public API origin | `http://localhost:8000` | No |
| `ENDOORA_API_INTERNAL_URL` | Next.js -> Django local URL | `http://127.0.0.1:8000` | No |
| `ENDOORA_DJANGO_SECRET_KEY` | Django cryptographic secret | local placeholder | Yes |
| `ENDOORA_DEBUG` | Django debug toggle | `1` locally | No |
| `ENDOORA_ALLOWED_HOSTS` | Django host allow-list | `localhost,127.0.0.1` | No |
| `ENDOORA_CORS_ALLOWED_ORIGINS` | Browser origins allowed to call API | local web origins | No |
| `ENDOORA_CSRF_TRUSTED_ORIGINS` | Origins trusted for CSRF-protected writes | local web origins | No |
| `ENDOORA_OTP_PROVIDER` | OTP provider adapter | `mock` on Day 07 | No |
| `ENDOORA_OTP_TTL_SECONDS` | OTP lifetime | `300` | No |
| `ENDOORA_ACCOUNT_DELETE_DELAY_DAYS` | Delay before future deletion job | `7` | No |
| `ENDOORA_DB_NAME` | PostgreSQL database | `endoora` | No |
| `ENDOORA_DB_USER` | PostgreSQL user | `endoora` | Usually no |
| `ENDOORA_DB_PASSWORD` | PostgreSQL password | local placeholder | Yes |
| `ENDOORA_DB_HOST` | PostgreSQL host | `127.0.0.1` | No |
| `ENDOORA_DB_PORT` | PostgreSQL port | `5432` | No |
| `ENDOORA_REDIS_URL` | Redis connection string | `redis://127.0.0.1:6379/0` | Potentially |
| `ENDOORA_OPENROUTER_API_KEY` | Future OpenRouter key | blank | Yes |
| `ENDOORA_ZARINPAL_MERCHANT_ID` | Future ZarinPal merchant ID | blank | Yes |
| `ENDOORA_SMS_API_KEY` | Future SMS key | blank | Yes |

## Day 07 provider rule

Keep `ENDOORA_OTP_PROVIDER=mock`. A real Iranian SMS provider is intentionally not required for the Day 07 acceptance gate. Raw OTP codes must not be logged or stored.
