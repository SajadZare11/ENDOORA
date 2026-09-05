# Leaderboard & Social Motivation Privacy Policy

## 1. Overview & Pedagogical Purpose

Endoora provides social motivation features—including achievement badges, daily/weekly challenges, active-users clubs, and community leaderboards—to support sustained learning habits. In accordance with the **Endoora Product Constitution (Rule #5: Privacy and safety are product features, Rule #7: Calm rather than addictive, and Rule #8: Honest assessment)**, our gamification layer is designed to be **calm, fair, opt-in, and privacy-preserving**. It strictly rejects casino-like dark patterns, addictive loops, pay-to-win mechanics, and public shaming.

---

## 2. Core Privacy & Safeguard Pillars

### 2.1 Strict Opt-In Visibility & Pseudonymity
- **Default Pseudonymity**: No real names, phone numbers, email addresses, or National IDs are ever displayed on leaderboards or public achievement feeds.
- **Pseudonymous Handles**: Learners are represented by default handles (e.g. `Learner #4829`) or customizable pseudonyms alongside avatar seeds.
- **Instant Opt-Out**: Learners may toggle leaderboard participation at any time in their privacy settings (`is_leaderboard_visible = False`). When disabled, the learner is immediately removed from all public snapshots and cohort views.

### 2.2 Protection of Minors (Under-18 Safeguards)
- **Zero Location Disclosure**: For learners identified as minors (<18), location data (city, province, school) is strictly suppressed server-side.
- **City Board Prohibition**: Minors are categorically prohibited from joining or appearing on geographic or city-level leaderboards, eliminating any risk of physical re-identification or stalking.

### 2.3 Small-City Cohort Suppression (Anti-Doxxing Threshold)
- **Minimum Safe Cohort Size ($N \ge 10$)**: City-level leaderboards are only rendered when at least 10 active learners in that municipality participate.
- **Automatic Suppression**: If a city has fewer than 10 participants, the city leaderboard is suppressed with a transparent privacy explanation:
  > *"حفظ حریم خصوصی: برای نمایش رتبه‌بندی شهری حداقل ۱۰ زبان‌آموز فعال در این شهر نیاز است."*
- **Re-Identification Prevention**: In small communities, displaying ranks alongside activity times can facilitate deanonymization. Suppression ensures mathematical $k$-anonymity.

---

## 3. Financial-Grade Integrity & Anti-Exploit Rules

### 3.1 Strict Prohibition of Pay-to-Win Mechanics
- **Earned, Never Bought**: XP and badges can only be earned through server-verified pedagogical events (e.g. validated exercises, mission steps, IELTS writing mentor submissions, pronunciation recordings, and spaced repetition reviews).
- **No Monetized Points**: Endoora does not sell XP, multipliers, streak restores, or cosmetic badges for money. Premium subscriptions unlock educational tools and teacher interaction, never artificial leaderboard points.

### 3.2 Append-Only Ledger & Reversal Accounting
- **Immutable Transactions**: XP is stored in an append-only transaction ledger (`XPTransaction`) with unique idempotency keys (`source_event`) to prevent duplicate crediting.
- **Transparent Reversals**: System errors or fraudulent points are corrected exclusively via negative compensatory adjustments (`system_adjustment`), which automatically recalculate cached levels and future leaderboard snapshots.

### 3.3 Deterministic Tie-Breaking
- Ties in total XP are resolved deterministically and impartially:
  $$\text{Order: } \text{Total XP} \downarrow \to \text{Timestamp of Achievement} \uparrow \to \text{Learner ID} \uparrow$$
- No randomized or arbitrary ranking decisions exist.

---

## 4. Calm Learning & Anti-Shaming Experience (Rule #7 & #8)

### 4.1 Localized Relative Brackets vs. Endless Bottom Lists
- **No Public Humiliation**: Endless scrollable leaderboards that expose low-ranking users at the bottom are explicitly rejected.
- **Top Cohort & Peer Bracket**: The interface displays the top 10 cohort alongside the learner's immediate surrounding bracket ($\pm 3$ neighboring peers), allowing learners to measure personal progress without anxiety.
- **Encouraging Milestones**: Messaging emphasizes positive milestones (e.g., *"You are in the top 20% of dedicated learners this cycle"*) rather than negative distance from first place.

### 4.2 Honest Assessment Disclaimer (Rule #8)
- Badges and leaderboard standings indicate **study dedication and deliberate practice**.
- They are **not accredited CEFR diplomas, university credits, or official IELTS certificates**. All leaderboard views explicitly link to this educational distinction.

---

## 5. Active-Users Clubs & Safety Controls

### 5.1 Criteria-Based Eligibility
- Club tiers (*Apprentice*, *Scholar*, *Master Communicator*) require verifiable trailing 7-day activity metrics (active days and XP earned).
- Clubs cannot be purchased or bypass educational requirements.

### 5.2 Community Safety & Leave/Report Controls
- Learners can leave any club or cancel participation in any challenge at any time with a single click.
- A built-in reporting endpoint (`POST /api/gamification/clubs/report/` and `/challenges/report/`) allows learners to flag inappropriate behavior or concerns directly to the moderation team.

---

## 6. Architecture & Audit Checklist

| Security Control | Backend Enforcement | Test Verification |
|---|---|---|
| Opt-out hides user | `exclude(is_leaderboard_visible=False)` in snapshot query | `test_private_user_never_appears_on_leaderboards` |
| Small city suppressed | `is_suppressed = True` if cohort $< 10$ | `test_small_city_cohort_suppression_under_10_users` |
| Minor location blocked | `city = ""` and `show_city_rank = False` when `is_minor = True` | `test_minor_location_safeguard_and_city_exclusion` |
| Reversals update board | Net ledger sum drives snapshot | `test_xp_reversals_affect_leaderboard_and_level` |
| Deterministic ties | `-total_xp, updated_at, learner__id` | `test_deterministic_tie_breaking` |
| Idempotent unlocks | Unique `source_event` per badge/challenge award | `test_badge_auto_unlock_and_idempotency` |
