# Endoora Risk Register

| ID | Area | Risk | Severity | Mitigation |
|---|---|---|---|---|
| R-001 | Scope | Too many features treated as MVP | Critical | Freeze maturity labels and use feature flags |
| R-002 | Assessment | Official CEFR claims without validation | Critical | Provisional estimate, evidence, confidence, limitations |
| R-003 | IELTS | AI feedback presented as official IELTS score | Critical | Estimate ranges and uncertainty only |
| R-004 | Copyright | Unlicensed commercial content | Critical | Original/licensed/public-domain/lawful references only |
| R-005 | Child safety | Unrestricted adult-minor messaging | Critical | No unrestricted chat; reporting and scoped communication |
| R-006 | Privacy | Raw writing/audio/chat stored indefinitely | Critical | Retention rules, consent, deletion, minimal logging |
| R-007 | Authorization | Unrelated learner evidence exposed | Critical | Object-level authorization and negative tests |
| R-008 | Authentication | User self-promotes privileges | Critical | Separate role from verified capabilities |
| R-009 | Payments | Toman/rial conversion error | Critical | One central money convention and tests |
| R-010 | Payments | Entitlement granted before server verification | Critical | Server-to-server ZarinPal verification |
| R-011 | Payments | Duplicate callback duplicates entitlement | Critical | Idempotency and unique authority constraints |
| R-012 | Payments | Live mode before HTTPS callback works | Critical | Formal live-payment gate |
| R-013 | AI | OpenRouter key exposed to browser | Critical | Backend-only provider calls |
| R-014 | AI | Malformed AI output reaches learner | High | Structured schemas, validation, capped repair, fallback |
| R-015 | AI | One model outage breaks product | High | Model registry and fallbacks |
| R-016 | AI cost | Unlimited plan creates unbounded spend | High | Fair-use, queue caps, budgets, abuse controls |
| R-017 | Learner Twin | AI inference treated as permanent truth | High | Evidence links, correction/reset, fact/inference separation |
| R-018 | Mistake Genome | One typo becomes recurring weakness | High | Evidence thresholds and disputes |
| R-019 | Voice | Pronunciation claims exceed validation | High | Intelligibility/trend framing only |
| R-020 | Marketplace | Instant-teacher promise without supply | High | Asynchronous request/offer model |
| R-021 | Marketplace | Unverified teacher sells classes | Critical | Verification and capability gate |
| R-022 | Community | Community enabled before moderation | High | Off by default until moderation exists |
| R-023 | Data | Migration causes data loss | Critical | Backup, staging rehearsal, rollback, tests |
| R-024 | Brand | Old NeuraLingo name leaks into product | Medium | Naming standard and repository checks |
| R-025 | Domain | DNS changed too early | High | Wait until staging and hosting exist |
| R-026 | Accessibility | Core flows fail keyboard/screen reader use | High | WCAG 2.2 AA gates |
| R-027 | Localization | RTL breaks English learning content | High | Logical CSS and isolated LTR |
| R-028 | Performance | Slow/N+1 dashboard APIs | Medium | Aggregated endpoints and query tests |
| R-029 | Resilience | Refresh loses test/assignment work | High | Autosave and resumable workflows |
| R-030 | Secrets | .env or credentials committed to Git | Critical | .gitignore and secret scanning |
| R-031 | Analytics | Raw learner content sent to analytics | Critical | Metadata/events only |
| R-032 | Support | Support role gets excessive access | High | Least privilege and audited escalation |
| R-033 | Finance | Historical ledger rows edited directly | Critical | Immutable ledgers and compensating entries |
| R-034 | Launch | Paid production before backups/support/monitoring | Critical | Day-60 launch gate |
