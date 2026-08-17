# Endoora Product Constitution

## Product identity

**Public name:** Endoora  
**Motto:** A new door to your English  
**Technical slug:** `endoora`  
**Canonical production origin:** `https://endoora.ir`  
**Primary launch audience:** Iranian English learners and teachers  
**Default interface:** Persian-first RTL with English option  
**Display/scheduling timezone:** Asia/Tehran; persist timestamps in UTC

## Product mission

Endoora is a bilingual Persian/English AI-powered learning operating system that helps learners assess their current ability, build an explainable learning profile, follow a personal path, practise consistently, detect recurring mistakes, connect useful evidence to teachers, and measure progress.

## Production V1 in one sentence

Endoora helps an English learner assess their current level, receive a personalized path and daily practice, preserve useful learning evidence, work with teachers, pay securely for approved services, and track progress in one bilingual learning system.

## Core product loop

Assess -> Build Learner Twin -> Plan -> Practise -> Detect mistakes -> Adapt -> Connect to teacher -> Measure progress -> Repeat

## Product loops

### Learner loop
Placement -> personal path -> Daily Mission -> practice -> feedback -> mistake memory -> spaced review -> progress -> next best action.

### Teacher loop
Verified profile -> classes -> students -> question bank -> assignments -> submissions -> grading -> learning evidence -> progress.

### Marketplace loop
Request -> safe matching -> teacher offer -> booking -> verified payment -> lesson -> review -> dispute support.

### Content loop
Original/licensed content -> editorial review -> discovery -> learning activity -> evidence -> recommendation.

### IELTS loop
Original simulation -> timed attempt -> objective scoring where possible -> transparent AI estimate where appropriate -> targeted follow-up.

### Business loop
Activation -> retained learning behavior -> entitlement -> payment -> value delivery -> support -> renewal.

## Product principles

1. Learning outcome before feature count.
2. One obvious next action on learner/teacher Home.
3. Explainable AI: important recommendations connect to evidence.
4. Raw AI/chat/writing/audio is not automatically permanent learner truth.
5. Privacy, authorization, child safety, and retention are product requirements.
6. Persian-first RTL; isolate English/IPA/code/email/URL/answer content as LTR.
7. Gamification must encourage meaningful learning, not manipulation.
8. CEFR/IELTS output is provisional or estimated unless genuine validation later supports stronger claims.
9. Original/licensed/public-domain content only where copyright applies.
10. Human teachers remain important; AI supports rather than falsely replaces qualified instruction.
11. Money, XP, payments, callbacks, and background jobs must be idempotent and auditable.
12. High-risk beta features must have visible limitations and a kill switch.

## Approved launch subscription

**Plan:** Premium  
**Duration:** 90 days  
**Launch display price:** 420,000 تومان  
**Benefits:** unlimited normal-use AI generations, Premium access, priority entitlement.

Price must be configurable, effective-dated, and never hardcoded into React components, payment handlers, or entitlement rules. Provider rial/toman conversion must occur at one tested boundary.

## North-star metric

**Weekly Learning Loop Completion per Active Learner (WLLC/AL).**

A counted learning loop must include:
1. a planned or selected learning activity,
2. meaningful completion,
3. evidence-backed feedback/result,
4. an updated next action or review state.

This metric is preferred over raw page views, AI generations, or time-on-site.

## Guardrail metrics

- Placement completion and abandonment rate
- First Daily Mission completion
- D7 and W4 retained learning behavior
- SRS return/completion rate
- Writing/roleplay revision completion
- Teacher assignment -> submission -> grade completion
- Marketplace booking/payment conversion
- Payment verification/error/duplicate-callback rate
- Refund and dispute rate
- AI structured-output failure rate
- AI cost per retained learner
- Provider outage/degraded-state rate
- Support burden per active user
- Safety/privacy incidents
- Unauthorized-object access test failures
- Accessibility critical defects
- Core-flow latency and failure rate

## Launch philosophy

The first launch proves repeated, trustworthy learning value. Features with unresolved scientific-validity, safety, copyright, liquidity, privacy, or financial risk remain beta, foundation-only, or Post-60.

## Do-not-build boundary

The following must not delay the first launch:
- official/scientifically validated CEFR claims,
- official IELTS examiner-equivalent scoring,
- high-stakes autonomous grading,
- robust phoneme-level diagnosis across accents,
- native apps,
- real-time multiplayer,
- unrestricted messaging/public chat,
- webcam proctoring,
- full school ERP,
- unlicensed commercial book/test catalogues,
- externally accredited certificates without authorization,
- large-scale instant marketplace promises,
- automated teacher payouts.

## Definition of product success

Endoora succeeds when learners repeatedly complete meaningful learning loops, can inspect credible evidence of progress, teachers can use authorized evidence to improve instruction, and the business can deliver that value safely and sustainably.
