# Day 14 Placement Session Engine

## Purpose
Build resumable placement-test sessions.

## Rules
- Answers are saved with server timestamps.
- Sessions belong only to their owner.
- Duplicate saves use idempotency keys.
- Expired sessions cannot continue.

## Verification
- Refresh preserves answers.
- Another user cannot open a session.
- Duplicate submissions do not create duplicate answers.
