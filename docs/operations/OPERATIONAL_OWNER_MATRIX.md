# Endoora operational owner matrix

This is the Day 11 ownership baseline. One person may initially hold several responsibilities, but the responsibilities remain separate.

| Area | Operational owner label | Day 11 authority |
|---|---|---|
| Security | `security` | Admin access policy, audit review, incident escalation |
| Support | `support` | Limited account-reference viewing; no learner evidence or role escalation |
| Content | `content` | Foundation only until content apps are built |
| Moderation | `moderation` | Foundation only until community/moderation apps are built |
| Finance | `finance` | Foundation only; no direct payment-state editing |
| AI | `ai` | Feature-flag ownership only; provider secrets stay outside DB |
| Product | `product` | Safe non-secret product settings and feature rollout rationale |

High-risk payment, permission, scoring, content-publish and entitlement changes must be attributable through the audit trail when those domains are introduced.
