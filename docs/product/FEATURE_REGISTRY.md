# Endoora Feature Registry

The machine-readable Day 01 registry is:

`docs/product/feature-map.csv`

It contains **88 feature records**. Each record has:
- canonical feature ID,
- feature family,
- primary role,
- route family,
- maturity,
- launch status,
- data sensitivity,
- scope note.

## Maturity totals

- **Foundation:** 6
- **Post-60 Scale:** 11
- **Production V1:** 56
- **Validated Beta:** 15

## Canonical maturity labels

- Production V1
- Validated Beta
- Foundation
- Post-60 Scale

## Governance

A feature must have one canonical owner/family and one maturity label. Changes to maturity require a written reason, risk/dependency review, and test-impact review. High-risk beta features require feature flags and safe degraded states.

## Related files

- `feature-map.csv`
- `launch-cut-line.md`
- `baseline-backlog.md`
- `risk-register.md`
- `docs/decisions/ADR-001-scope.md`
