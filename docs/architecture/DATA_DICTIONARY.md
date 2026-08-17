# Endoora Data Dictionary — Day 01 Baseline

No physical database schema exists yet. This file records planned high-level data domains.

| Domain | Planned examples | Sensitivity |
|---|---|---|
| accounts | user, role, capability, session, consent | High |
| profiles | learner/teacher profile, verification state | High/Very High |
| taxonomy | skill, objective, CEFR descriptor, tags | Low/Medium |
| placement | session, answer, score evidence, report | High |
| learner_twin | estimates, snapshots, approved evidence links | High |
| mistake_genome | mistake events/patterns/disputes | High |
| learning_paths | paths, milestones, priorities | High |
| missions | daily tasks/completion | High |
| srs | vocabulary cards/reviews/schedule | High |
| writing | drafts, feedback, revisions | Very High |
| conversations | messages/summaries/consent | Very High |
| speech | audio metadata/transcripts/retention | Very High |
| teachers/classes | relationships/classes/sessions | High |
| assignments | assignment/submission/grade | Very High |
| marketplace | requests/offers/bookings/reviews | High |
| payments | orders/attempts/authority/verification/refunds | Very High |
| subscriptions | plan/price/entitlement | High |
| ledgers | XP/financial immutable entries | Very High |
| support | tickets/recovery/escalation | Very High |
| audit | privileged action events | Very High |
| analytics | privacy-aware event metadata | Medium |

Field-level schema is added only when each domain is implemented.
