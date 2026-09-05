# Endoora Text-Based Roleplay Universe v1 (Day 25)

## 1. Pedagogical Foundation

Traditional language chatbots fail learners in three distinct ways:
1. **Generic open-ended conversational drift**: Lacking authentic communicative objectives, conversations quickly devolve into vague small-talk with no measurable skill growth.
2. **Pedagogical hyper-interruption**: Constant in-turn red corrections destroy psychological safety, fluency, and conversational immersion.
3. **Unbounded cognitive load**: Open-ended chatbots cause token exhaustion and learner fatigue without clear closure.

Endoora's **Roleplay Universe v1** solves each of these challenges through structured situational simulations:
- **Authentic Scenarios & Specific Goals**: Each scenario provides 3 distinct communicative milestones (e.g. state visit purpose, request accommodation, confirm departure).
- **Immersion First (Zero Mid-Turn Interruptions)**: The character remains strictly in persona. All grammatical analysis, error detection, and vocabulary suggestions are bundled in the **Post-Conversation Report**.
- **Bounded Session Cycles**: Scenarios enforce a strict turn budget (`max_turns = 8 – 10`) and 500-character input caps.
- **Anti-Exploit Gamification**: +50 XP is awarded strictly upon scenario conclusion, protected by an idempotent `xp_awarded` guard.
- **Two-Way Ecosystem Sync**:
  - **Mistake Genome**: Learners review deferred grammatical slips and tap "Add to Mistake Genome" to target them in future spaced exercises.
  - **SRS Deck**: Target vocabulary encountered in the scenario can be saved directly into active spaced repetition flashcard review.

---

## 2. Core Scenarios Matrix

| ID | Title (En / Fa) | CEFR | Character | Goals Summary |
|---|---|---|---|---|
| `airport` | Airport Passport Control / فرودگاه و بازرسی گذرنامه | A2 - B1 | Officer Davis (Immigration Officer) | State purpose, duration, return ticket |
| `hotel` | Hotel Check-in / پذیرش هتل و درخواست‌های اقامت | A2 | Elena (Concierge) | Reservation details, amenity request, timing |
| `restaurant` | Dining Out & Dietary / سفارش غذا در رستوران | B1 | Marco (Lead Server) | Drinks/starter, dietary preference, main/bill |
| `shopping` | Retail Store Return / مرجوع و تعویض کالا در فروشگاه | B1 | Chloe (Customer Care) | Explain defect/size, receipt, exchange/refund |
| `travel` | Transit & Directions / مسیریابی و حمل‌ونقل عمومی | A2 | Julian (Station Attendant) | Specify destination, transfer line, fare |
| `university` | Academic Advising / مشاوره تحصیلی و انتخاب واحد | B2 | Dr. Sterling (Advisor) | Core/electives, manage workload, semester plan |
| `job_interview` | Professional Job Interview / مصاحبه کاری تخصصی | B2 | Sarah Lin (Hiring Manager) | STAR situation, technical actions, culture question |
| `business` | Project Scope & Deadline / مذاکره زمان‌بندی پروژه | B2 | Marcus Vance (Product Director) | Quality risks, phased rollout, consensus |
| `friendly_chat` | Weekend Catch-up / گپ‌وگفت دوستانه آخر هفته | B1 | Sam (Close Friend) | Personal update, ask friend's life, suggest plan |
| `ielts_speaking` | IELTS Speaking Part 2 & 3 / مصاحبه شفاهی آیلتس | B2 - C1 | Examiner Henderson (IELTS Examiner) | Environmental example, societal impact, future |
