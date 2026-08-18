# Endoora Multi-step Workflow and Route-State Contract

This convention is frozen on Day 05 and applies to placement, onboarding, assignments, Learn Now, class enrollment, IELTS attempts, checkout and other later multi-step flows.

## Required controls

Every multi-step workflow provides, where meaningful:

- **Back**
- **Continue**
- **Save and Continue Later**
- **Cancel**
- explicit **Review / Submit**
- a visible saved/recovery state

Do not use the browser Back button as the only Back mechanism.

## Save rule

- Server-side draft state is the future source of truth for authenticated sensitive workflows.
- Browser storage may contain only non-sensitive navigation hints such as a step ID.
- Raw writing, answers, audio, identity evidence, payment data and private messages are never put into local storage merely for convenience.
- A save endpoint must be idempotent when duplicate retries are plausible.

## Refresh / reconnect recovery

After refresh or reconnect:

1. identify the workflow/session safely;
2. reload the last server-confirmed draft;
3. show the last-saved time when meaningful;
4. tell the user whether unsaved local input was lost;
5. continue from the correct step;
6. never silently submit.

## Cancel

Cancel must state the consequence:

- draft preserved
- draft discarded
- request cancelled
- attempt remains resumable
- irreversible submission cannot be undone

Destructive cancellation requires confirmation.

## Required route states

Every later route must explicitly decide whether each state is applicable:

| State | Required behavior |
|---|---|
| Loading | Labelled progress/skeleton; no blank page |
| Empty | Explain why empty and give a useful next action |
| Error | Human-readable message + retry/recovery |
| Offline | Preserve safe work; do not fake writes |
| Interrupted | Resume from last confirmed state |
| Expired session | Re-authenticate and safely return |
| Permission denied | No data leak; safe route back |
| Feature disabled | Explain availability/limitation when route is known |
| Not found | True unknown object/route only |

## Deep links

A deep link is first-class. Nesting a destination under Account or Practice must not make its URL unusable.

Private deep-link sequence:

`requested URL -> login if needed -> role/object permission check -> requested URL or explicit denial`

Never redirect a denied teacher URL to a learner page as if authorization succeeded.

## Analytics boundary

Navigation analytics may record:

- route/feature ID
- role
- step ID
- completion status
- generic failure code

They must not record sensitive form contents, writing, audio/transcripts, answer keys, payment credentials or private messages.
