# Teacher dashboard privacy rules — Day 10

## Purpose

The teacher Home screen is an operational summary, not a learner-evidence reader. It should answer what the teacher needs to do next without copying sensitive learner content into summary cards.

## Allowed summary data

- Teacher public display name.
- Teacher verification and capability state.
- Teacher profile completeness percentage.
- Counts from authorized teacher-owned domains once those domains exist.
- The next authorized session summary once the real scheduling domain exists.
- Safe route/status metadata for teacher tools.
- Privacy-safe analytics identifiers such as the teacher UUID, event name, and action identifier.

## Prohibited dashboard-summary data

The Day 10 serializer must not return raw learner writing, answer text, audio, recording URLs, transcripts, AI conversation history, private messages, identity documents, or unrelated learner profile fields.

A later teacher detail page may expose narrowly scoped learner evidence only when a legitimate teacher-learner relationship and server-side object authorization have been implemented and tested.

## Capability separation

The `teacher` role is not sufficient for sensitive teacher operations. Marketplace and paid-class capability remain dependent on the existing verified-teacher capability checks. An unverified teacher must see the next verification step instead of an enabled paid-class or marketplace action.

## No fabricated data

Day 10 does not yet own real class, assignment, marketplace, schedule, or finance models. Those cards therefore display an unavailable state and `null` values instead of fabricated zeroes, balances, learner counts, or schedule records.

## Logging

Teacher dashboard analytics may record only the teacher UUID, verification state, event name, and known action ID. Do not log email addresses, profile biography, learner evidence, request text, or private educational content.
