# Teacher Public Profile, Review System, and Social Proof (MKT-005 / MKT-001 / MKT-006)

## Overview
Day 39 delivers the complete discovery, evaluation, and social trust infrastructure of the Endoora marketplace. It provides an interactive public teacher directory (`/teachers`), detailed verified teacher profiles (`/teachers/[id]`), a tamper-proof verified review state machine tied directly to completed sessions, automated PII content moderation, and real-time social proof aggregation (star distribution, dimension scores, and trust endorsements).

---

## 1. Architecture and Core Capabilities

### Teacher Directory and Search Engine (`/teachers`)
- **Public Discovery**: Guests and logged-in learners can browse verified and marketplace-eligible teachers.
- **Multi-Factor Filtering**:
  - Full-text search over teacher first/last name, public name, headline, and bio.
  - Skill filter pills: Speaking, IELTS Preparation, Writing, Listening, Pronunciation, Grammar, Vocabulary, Business English.
  - Minimum average star rating (4.5+, 4.0+, 3.5+).
  - Maximum hourly rate slider/selector in Iranian Toman.
  - Flexible sorting: highest rating, most verified reviews, lowest rate, highest rate, and teaching experience.
- **Trust Indicators**: Verified teacher badges ("✓ تاییدشده"), completed session counters, and average response times.

### Teacher Public Profile (`/teachers/[id]`)
- **Rich Biographical Profile**: Full bio, years of teaching experience, spoken languages, and city.
- **Academic and International Credentials**: University degrees, international certifications (e.g. CELTA, DELTA, TESOL, IELTS 8.5+, TKT) displayed with trust badges.
- **Video Introduction Player**: Embedded or secure links to video greetings (Aparat, YouTube, or direct link) showcasing pronunciation and teaching style.
- **Social Proof Dashboard**:
  - High-impact overall rating hero (e.g. "۴.۹ از ۵").
  - 3-Dimension breakdown (Teaching quality, Punctuality, Communication) with animated progress bars.
  - Visual rating distribution histogram (5★ down to 1★) with exact counts and percentages.
  - Algorithmic trust endorsements (e.g. "۱۰۰٪ رضایت در وقت‌شناسی", "کیفیت تدریس برتر", "مدرس باتجربه و پرمخاطب").
- **Sticky Booking Sidebar**: Clear hourly rate display in Toman, instant session request CTA ("درخواست کلاس با این مدرس"), and trust guarantees.

---

## 2. Verified Review and Rating State Machine (`TeacherReview`)

### Anti-Fraud Verification Guard
1. **Completed Sessions Only**: A review can only be submitted if `SessionBooking.status == COMPLETED`. Uncompleted, cancelled, or in-progress sessions reject reviews immediately (`400 Bad Request`).
2. **Participant Integrity**: Only the authenticated learner of the booking can submit a review (`403 Forbidden` for other users or unauthenticated clients).
3. **One Review Per Session**: The `TeacherReview` model enforces a `OneToOneField` to `SessionBooking`. Duplicate reviews on the same booking are rejected.
4. **Dimension Ratings**: In addition to overall rating (1-5★), learners assess three specific dimensions:
   - `rating_teaching`: Teaching quality, pedagogical mastery, and explanation clarity (1-5★).
   - `rating_punctuality`: Punctuality, start/finish adherence, and attendance discipline (1-5★).
   - `rating_communication`: Professional ethics, patience, and encouraging communication (1-5★).
5. **Minimum Feedback Quality**: Comments must have at least 10 non-whitespace characters.

### Learner Privacy and Name Masking
- Learner privacy is protected by default. Public serializers and endpoints mask names (e.g., "سارا م." or "Ali K.") while retaining verification authenticity.
- Learners can also opt for full anonymity ("زبان‌آموز اندورا").

### Automated PII and Contact Information Scanner
To prevent off-platform disintermediation and protect platform safety:
- Comment text is automatically scanned for Iranian phone numbers (`+98` or `09...`) and email addresses.
- Reviews triggering the scanner are flagged with `ReviewStatus.PENDING_MODERATION` and quarantined from public view until administrative approval. Clean reviews are immediately published (`ReviewStatus.PUBLISHED`).

### Official Teacher Reply and Community Flagging
- **Teacher Official Reply**: Teachers can publish a verified official response ("پاسخ رسمی مدرس") to reviews on their profile.
- **Abuse Reporting**: Learners and teachers can report reviews for policy violations via `/api/marketplace/reviews/<id>/flag/`, escalating them to `ReviewStatus.FLAGGED` for moderation.

---

## 3. API Contract Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/marketplace/teachers/` | Search and filter public teacher directory | No (Public) |
| `GET` | `/api/marketplace/teachers/<id>/` | Fetch public teacher profile and social proof | No (Public) |
| `GET` | `/api/marketplace/teachers/<id>/reviews/` | List published reviews for a teacher | No (Public) |
| `GET` | `/api/marketplace/bookings/<id>/review/` | Retrieve review state for a booking | Yes (Participant) |
| `POST` | `/api/marketplace/bookings/<id>/review/` | Submit review for completed booking | Yes (Learner) |
| `POST` | `/api/marketplace/reviews/<id>/reply/` | Teacher official reply to review | Yes (Teacher) |
| `POST` | `/api/marketplace/reviews/<id>/flag/` | Report review for moderation | Yes |

---

## 4. Frontend and Styling Standards

- **App Router Structure**:
  - `apps/web/app/teachers/page.tsx` (`/teachers`)
  - `apps/web/app/teachers/[id]/page.tsx` (`/teachers/[id]`)
  - `apps/web/app/bookings/[id]/page.tsx` (Review submission widget)
- **Zero Raw Hex Colors**: 100% adherence to `--color-...` CSS variables.
- **100% CSS Logical Properties**: `margin-inline`, `margin-block`, `padding-inline`, `padding-block`, `inline-size`, `block-size`, `inset-inline-start`, `inset-block-start`.
- **RTL and Typography**: Native Persian digits formatting (`toPersianDigits`), currency separators, and Persian typography.
- **Verification**: Zero TypeScript errors (`tsc --noEmit`), zero ESLint warnings (`eslint .`), and clean production build (`next build` across 154 routes).
