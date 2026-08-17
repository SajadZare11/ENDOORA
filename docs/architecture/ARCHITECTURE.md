# Endoora Architecture Baseline

## Planned monorepo

Endoora/
- apps/web — Next.js App Router + TypeScript PWA
- apps/api — Django + Django REST Framework
- packages/ui — shared tokens/components
- packages/contracts — OpenAPI + generated frontend types
- infra — reverse proxy/deployment/monitoring
- data — reviewed fixtures/taxonomy
- docs — product/architecture/quality/security/AI/operations

## Runtime principles

- PostgreSQL is the system of record.
- Redis/Celery handle long AI/audio/report/notification work.
- OpenRouter is backend-only.
- ZarinPal is backend-only and entitlement follows verified server-to-server confirmation.
- S3-compatible object storage is planned for media/files.
- Authorization is enforced server-side.
- Public object IDs use UUIDs where enumeration risk exists.
- UTC persistence; Asia/Tehran presentation/scheduling.
- One central integer-money convention with tested provider conversion.
- Critical state transitions are transactional and idempotent.
- Development/test/staging/production are separated.

## Status

Architecture is approved as a Day 01 baseline. No runtime scaffold exists until Day 02.
