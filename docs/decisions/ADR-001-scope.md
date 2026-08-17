# ADR-001 — Endoora Day-60 Scope and Launch Maturity

## Status
Accepted for the Day 01 baseline.

## Context
Endoora has a broad vision spanning assessment, adaptive learning, AI practice, teachers, marketplace, community, IELTS, commerce, and operations. Making every feature fully production-ready inside 60 build days would create unacceptable quality and safety risk.

## Decision
Every feature is classified as exactly one of:
1. Production V1
2. Validated Beta
3. Foundation
4. Post-60 Scale

Production V1 must be secure, reliable, and usable by controlled real users.

Validated Beta requires visible limitations, a feature flag, monitoring, safe failure states, and the ability to disable the feature without breaking the core product.

Foundation may include schema, contracts, safe UI, or internal tooling without becoming a broad launch promise.

Post-60 Scale must not delay the launch-critical path.

## Core loop
Assess -> Build Learner Twin -> Plan -> Practise -> Detect mistakes -> Adapt -> Connect to teacher -> Measure progress -> Repeat

## Navigation
Learner: Home, Learn, Practice, Teachers & Classes, Account.

Teacher: Home, Teach, Marketplace, Resources, Account.

Administrative tools such as Billing, Usage, Privacy, Settings, and Support remain inside Account.

## Money
Premium is 90 days at 420,000 تومان at launch. Pricing remains configurable and historical orders preserve their effective price. Toman/rial conversion is centralized.

## Domain
Canonical public origin: https://endoora.ir

The www hostname should permanently redirect to the root domain. DNS is not changed until the deployment/staging stage.

## Explicit exclusions from the Day-60 critical path
- Official/scientifically validated CEFR claims
- Official IELTS examiner-equivalent scoring
- High-stakes automated grading without human review
- Robust phoneme-level pronunciation diagnosis
- Native apps
- Real-time multiplayer
- Unrestricted messaging/public chat
- Webcam proctoring
- Full school ERP
- Unlicensed commercial content catalogue
- Accredited certificates without authorization
- Large-scale instant marketplace promises
- Automated teacher payouts

## Consequences
Endoora prioritizes repeated, trustworthy learning loops over feature count and keeps high-risk features behind beta/foundation boundaries.
