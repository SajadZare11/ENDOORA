# Marketplace Request Feed, Filtering, and Matching Pipeline (Day 37)

## 1. Overview
Day 37 delivers the production-grade Marketplace Request Feed, Filtering, and Matching Pipeline for Endoora, fulfilling **MKT-002**, **MKT-003**, and **Wireframe 3 (`docs/product/wireframes/learn-now.md`)**.

The pipeline provides an asynchronous, privacy-preserving match between learners seeking targeted rapid sessions (Learn Now) and verified, marketplace-eligible teachers.

---

## 2. Architectural Invariants

### 2.1 Capability & Eligibility Gating
Access to the marketplace request feed and offer submission is strictly protected by server-side verification:
- `is_teacher_verified == True`: Teacher credentials and identity verified by operations.
- `marketplace_eligible == True`: Teacher authorized to accept public marketplace requests.
- Ineligible or unverified requests trigger a 403 Forbidden with clear diagnostic feedback.

### 2.2 Learner Privacy Guard
- Learner contact information (email, phone number, internal user account ID) is **never exposed** in the teacher request feed or public serializers.
- Teachers see only:
  - Masked display name (e.g. "سارا م.")
  - Target skill and subskill
  - Self-reported or assessed CEFR level
  - Learning goal description
  - Preferred time window & duration
  - Online session format
  - Budget ceiling (if specified)

### 2.3 Strict State Machine & Atomic Transitions
- **`MarketplaceRequest`**:
  - `open`: Initial state, visible to eligible teachers.
  - `matched`: At least one teacher has submitted an active offer.
  - `booked`: Learner accepted an offer; competing offers auto-declined.
  - `cancelled`: Learner withdrew request.
  - `expired`: Time window elapsed.
- **`TeacherOffer`**:
  - `pending`: Awaiting learner response.
  - `accepted`: Chosen by learner, transitioning request to `booked`.
  - `declined`: Automatically declined when another offer is accepted, or manually rejected.
  - `withdrawn`: Teacher recalled the offer.
  - `expired`: Offer expired.

---

## 3. Endpoints

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/marketplace/eligibility/` | Returns teacher verification and marketplace eligibility flags | `authenticated:teacher` |
| `GET` | `/api/marketplace/requests/` | Filterable teacher request feed (or own requests for learners) | `authenticated:teacher` / `learner` |
| `POST` | `/api/marketplace/requests/` | Learner creates a new Learn Now request | `authenticated:learner` |
| `GET` | `/api/marketplace/requests/<id>/` | Request details (privacy-masked for teachers; full for owner) | `authenticated` |
| `POST` | `/api/marketplace/requests/<id>/cancel/` | Learner cancels open/matched request | `authenticated:learner` (owner) |
| `GET` | `/api/marketplace/requests/<id>/offers/` | Learner lists received offers for this request | `authenticated:learner` (owner) |
| `POST` | `/api/marketplace/requests/<id>/offers/` | Verified teacher submits structured offer | `authenticated:teacher` (verified) |
| `GET` | `/api/marketplace/offers/` | Teacher lists all submitted offers (workspace) | `authenticated:teacher` |
| `POST` | `/api/marketplace/offers/<id>/withdraw/` | Teacher withdraws a pending offer | `authenticated:teacher` (owner) |
| `POST` | `/api/marketplace/offers/<id>/accept/` | Learner accepts offer, booking session and declining rivals | `authenticated:learner` (owner) |

---

## 4. Frontend Experiences

1. **Teacher Request Feed** (`/marketplace/requests`):
   - Real-time multi-dimensional filter bar (Skill, CEFR Level, Format, Timing).
   - Verification status banner for unverified teachers.
   - Structured offer submission modal with rate, time, duration, and personalized proposal note.
2. **Teacher Offers Workspace** (`/marketplace/offers`):
   - Categorized tabs: All, Pending, Accepted, Declined/Withdrawn.
   - 1-click withdrawal for pending offers.
   - Link to confirmed booking sessions.
3. **Learner Learn Now Flow** (`/learn/now`):
   - Wireframe 3 multi-step wizard: Request Details → Review → Matching/Offers → Booking Confirmation.
   - Interruption recovery: active requests fetched directly from server on reload.
