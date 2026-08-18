# Wireframe 6 — IELTS Attempt

`IELTS Hub`
→ `Practice type`
→ `Instructions + limitations`
→ **Start attempt**
→ `Section attempt`
→ `Autosave`
→ `Review unanswered`
→ **Submit section/attempt**
→ `Objective result where valid`
→ `Transparent AI estimate where applicable`
→ `Targeted follow-up`

## Trust requirements

- Label as IELTS preparation / IELTS-like practice, not official IELTS.
- Timers and submission state are server-authoritative when implemented.
- AI feedback is separated from objective scoring and shows limitations.

## Recovery

- disconnect: resume last server-confirmed answer;
- timeout: section closes according to written policy;
- duplicate submit: idempotent;
- evaluation unavailable: preserve submitted attempt and retry report;
- wrong attempt UUID: permission denied.

## Findability target

Public primary navigation exposes **IELTS** directly.
