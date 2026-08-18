# Endoora Day 05 Sitemap

Status: **Frozen information-architecture baseline for later implementation.**

This file defines destinations and ownership. A listed route is not a claim that the route is already implemented.
The developer-only IA prototype is `/design-system/information-architecture`.

## Navigation principles

1. A learner or teacher home screen has one dominant next action.
2. Low-frequency administrative tools live inside Account.
3. Role boundaries are explicit; hiding a link is never an authorization mechanism.
4. Direct/deep links remain usable after authentication and role checks.
5. Persian-first RTL navigation uses logical layout; English labels/content remain LTR where needed.
6. Critical tasks should be discoverable in three or fewer navigation decisions.

## Public sitemap

- `/` — Home
- `/how-it-works` — How Endoora works
- `/placement` — Placement introduction / start
- `/teachers` — Teachers
- `/classes` — Fixed classes
- `/learn` — Courses / learning content
- `/ielts` — IELTS practice hub
- `/pricing` — Pricing
- `/help` — Help / FAQ
- `/about` — About
- `/contact` — Contact / support entry
- `/legal/*` — Privacy, terms, accessibility, copyright/takedown, refund, AI limitations
- `/auth/*` — Registration, login, recovery and verification

Primary public navigation is intentionally limited to:
**Home · How it works · Placement · Teachers · Classes · Courses · IELTS · Pricing · Help**

## Learner sitemap

Primary navigation:

- **Home** → `/learner`
  - Today / next best action
  - first-time placement prompt
  - urgent assignment / next class summary when relevant
- **Learn** → `/learner/path`
  - personal path
  - vocabulary / SRS
  - progress
  - learner twin (beta)
- **Practice** → `/learner/practice`
  - daily mission
  - writing mentor (beta)
  - text roleplay (beta)
  - voice / pronunciation betas
- **Teachers & Classes** → `/teachers`
  - teacher directory
  - Learn Now request
  - bookings
  - fixed classes
- **Account** → `/account`
  - Library
  - Usage
  - Premium
  - Billing
  - Profile
  - Sessions
  - Notifications
  - Privacy / Data Controls
  - Settings
  - Support

Placement remains a prominent deep link at `/placement`; it must never be buried merely because it is not one of the five signed-in bottom-navigation labels.

## Teacher sitemap

Primary navigation:

- **Home** → `/teacher`
  - most urgent action: verification, next class, request, or grading
- **Teach** → `/teacher/classes`
  - classes
  - students
  - assignments
  - grading
  - question bank
- **Marketplace** → `/marketplace/requests`
  - Learn Now requests
  - offers
  - bookings
- **Resources** → `/teacher/resources`
  - reviewed teaching resources / experiences
- **Account** → `/teacher/account`
  - Profile / Verification
  - Teaching history
  - Usage
  - Earnings
  - Payout requests (foundation/manual)
  - Notifications
  - Privacy / Data Controls
  - Settings
  - Support

## Admin / operations sitemap

- `/admin` — Django operational foundation
- `/operations` — future operations overview shell
- `/operations/users` — users / identity operations
- `/operations/content` — learning/content queues
- `/operations/taxonomy`
- `/operations/questions`
- `/operations/courses`
- `/operations/ielts`
- `/operations/marketplace`
- `/operations/commerce`
- `/operations/refunds`
- `/operations/ai`
- `/operations/support`
- `/operations/analytics`
- `/operations/flags`
- `/operations/audit`

Sensitive financial and educational records should be read-only whenever direct editing would be unsafe.

## Mobile navigation

Mobile uses at most five role-specific primary destinations:

Learner: **Home · Learn · Practice · Teachers & Classes · Account**

Teacher: **Home · Teach · Marketplace · Resources · Account**

Administrative secondary tools do not become bottom-navigation items.

## Route status convention

- **Current** — route already exists in the repository.
- **Planned** — IA is frozen here but implementation belongs to a later roadmap day.
- **Beta/Foundation** — route may exist later but is governed by its maturity/feature flag.
- **Post-60** — not part of the Day-60 critical path.
