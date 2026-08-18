# Endoora Role Navigation Matrix

## Primary navigation

| Role | Primary destinations | Home priority | Account behavior |
|---|---|---|---|
| Visitor | Home · How it works · Placement · Teachers · Classes · Courses · IELTS · Pricing · Help | Understand promise and choose Placement or Start Learning | No private Account |
| Learner | Home · Learn · Practice · Teachers & Classes · Account | One next-best learning action | Low-frequency administration is consolidated in Account |
| Teacher | Home · Teach · Marketplace · Resources · Account | One urgent teaching action | Earnings, usage, privacy, settings and support are consolidated |
| Editor | Operations content surfaces only | Review/publish queue | No learner dashboard |
| Support | Support/limited operations only | Assigned support queue | No broad learner evidence browsing |
| Admin | Operations areas only | Operational health/queues | High-risk tools permission-scoped |

## Learner destination ownership

| Destination | Canonical route | Primary purpose | Common secondary actions |
|---|---|---|---|
| Home | `/learner` | What should I do now? | Resume placement, mission, urgent assignment, class |
| Learn | `/learner/path` | Follow personal path | Vocabulary, progress, learner twin |
| Practice | `/learner/practice` | Do practice now | Mission, writing, roleplay, voice |
| Teachers & Classes | `/teachers` | Human-learning connection | Learn Now, bookings, fixed classes |
| Account | `/account` | Administration and personal controls | Library, Usage, Premium, Billing, Profile, Privacy, Settings, Support |

## Teacher destination ownership

| Destination | Canonical route | Primary purpose | Common secondary actions |
|---|---|---|---|
| Home | `/teacher` | What needs my attention now? | Verify, next session, request, grading |
| Teach | `/teacher/classes` | Run teaching work | Students, assignments, question bank, grading |
| Marketplace | `/marketplace/requests` | Handle eligible requests/bookings | Offers, booking state |
| Resources | `/teacher/resources` | Reusable teaching material | Reviewed contributions |
| Account | `/teacher/account` | Administrative/financial/personal controls | Verification, history, Usage, Earnings, Privacy, Settings, Support |

## Role guard rule

Frontend navigation is presentation only. Django/DRF must enforce authorization later.

A route contract must distinguish:

- unauthenticated user
- correct authenticated role
- related authorized role
- wrong/unrelated role
- support capability
- admin capability

A wrong role receives a clear permission-denied state. The application must not silently change the user's role to make a deep link work.

## Deep-link rule

1. Public route: open directly.
2. Private route while signed out: send to login with a safe `next` destination.
3. After successful login: return to the originally requested authorized route.
4. Wrong role: show permission denied with a safe route back to that role's Home.
5. Expired session: preserve only safe navigation/workflow identifiers; never persist sensitive answers or evidence merely to recover navigation.
6. Feature disabled: show a bounded unavailable state rather than a generic 404 when the route is intentionally known but disabled.
