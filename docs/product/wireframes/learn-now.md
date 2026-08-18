# Wireframe 3 — Learn Now

**Maturity:** Validated Beta later in the roadmap.

`Learner Teachers & Classes`
→ **Learn Now**
→ `Request details`
→ `Review request`
→ `Searching / matching`
→ `Eligible teacher offers`
→ `Choose offer`
→ `Booking`
→ `Confirmation`

## Request fields

- skill/subskill
- short description
- preferred time
- duration
- online format
- optional preferred teacher

Do not expose unnecessary learner contact details during matching.

## Recovery

- no eligible teacher: preserve request and explain next options;
- request expired: offer safe reopen/copy;
- duplicate submit: one request only;
- ineligible/unverified teacher: server-side denial;
- network interruption: request state is fetched from server, not guessed.

## Findability target

Learner: **Teachers & Classes → Learn Now** = two navigation decisions.
Teacher: **Marketplace → Requests** = two navigation decisions.
