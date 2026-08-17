# Endoora API Contracts — Day 01 Baseline

No API endpoints exist yet.

## Contract principles

- Django/DRF owns authorization and validation.
- OpenAPI is the frontend/backend contract.
- Generated TypeScript types are derived from OpenAPI.
- Secrets and answer keys never appear in inappropriate frontend payloads.
- Error payloads use stable machine codes plus localized user-safe messages.
- Write endpoints use idempotency where duplicate requests are possible.
- Long-running work returns observable job state rather than holding fragile HTTP requests.
- Every object endpoint must define owner/related-role/unrelated-user/admin behavior.

Day 02 will add the first health contract.
