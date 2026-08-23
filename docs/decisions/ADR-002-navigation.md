# ADR-002 — Role Navigation, Account Consolidation and Deep Links

## Status

Accepted as the Day 05 information-architecture baseline.

## Context

Endoora has many planned capabilities. Presenting all features as equal dashboard tiles would make Home hard to understand, especially on mobile, and would mix learning/teaching work with administrative tasks.

Day 04 already provides `RoleShell` and `AccountNavigation` primitives. Day 05 freezes what those primitives should represent before learner/teacher application shells are implemented.

## Decision

### Learner primary navigation

**Home · Learn · Practice · Teachers & Classes · Account**

### Teacher primary navigation

**Home · Teach · Marketplace · Resources · Account**

### Public primary navigation

**Home · How it works · Placement · Teachers · Classes · Courses · IELTS · Pricing · Help**

### Account consolidation

Library, Usage, Premium/Plan, Billing, Profile, Sessions, Notifications, Privacy/Data Controls, Settings and Support are reached through Account rather than competing as Home dashboard tiles.

Teacher financial and administrative tools follow the same rule.

### Home hierarchy

Home is action-oriented. It may summarize relevant context, but one action wins visual priority:

- learner: next useful learning action;
- teacher: most urgent teaching/verification action.

### Deep links

Nested tools retain stable URLs. A direct private URL authenticates the user, checks role/object permission server-side, and then either opens the requested destination or shows explicit permission denial.

### Route states

Loading, empty, error/retry, offline/interrupted, expired-session and permission-denied behavior are part of the route contract, not afterthoughts.

## Consequences

- Mobile primary navigation stays at five role-specific destinations.
- Account becomes a real hub.
- Placement remains easy to discover.
- Marketplace and learning-path concepts do not become one ambiguous destination.
- Later dashboards cannot become a feature catalogue without changing this ADR.
- Backend authorization remains mandatory even when a link is hidden.

### Route-group clarification

The navigation labels are stable concepts, while browser routes follow the implementation. Next.js route groups do not become URL prefixes: the current learner destinations are `/dashboard`, `/path`, `/today`, and `/practice-ai`, not `/learner/*`. Planned destinations remain visibly labelled as planned in the Day 05 prototype.

## Day 05 localization amendment

All navigation labels described by this ADR are **display concepts**, not hardcoded English UI copy.

The production rule is:

- Persian (`fa`) is the default interface.
- The page direction is RTL by default.
- English is available through a language switch.
- `Endoora` and `A new door to your English` remain English.
- Route slugs and technical identifiers remain stable rather than being translated.
- English-learning material is isolated LTR within Persian pages.

Canonical localized navigation examples are documented in `docs/product/localization-contract.md`.
