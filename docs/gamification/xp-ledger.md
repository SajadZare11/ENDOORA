# Gamification Engine v1: Immutable XP Ledger, Level Progression & Streak Rules (Day 28)

## 1. Architectural Overview & Philosophy

Endoora's gamification system is built upon **Product Constitution Rule #7** (*Calm rather than Addictive*) and **Rule #8** (*Honest Educational Assessment*). Unlike typical engagement-maximizing apps that employ casino-like variable rewards, manipulative countdowns, or predatory streak-repair purchases, Endoora treats XP as an immutable, financial-grade audit ledger that transparently honors genuine learning dedication.

```
+-------------------------------------------------------------------------------+
|                           Gamification Engine v1                              |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |             Product Constitution Rule #7 (Calm Learning)                |  |
|  |     - Strict anti-exploit idempotency via unique source_event keys       |  |
|  |     - Generous streak freeze grace protections                          |  |
|  |     - No artificial countdowns or manipulative dark patterns            |  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  +---------------------------+              +------------------------------+  |
|  |    XP Transaction Ledger  |              |        Streak Tracker        |  |
|  |    - Append-only          |              |    - Asia/Tehran timezone    |  |
|  |    - Immutable financial  |              |    - Freeze credit shields   |  |
|  |      records (no mutation)|              |    - Automatic recovery      |  |
|  +-------------+-------------+              +--------------+---------------+  |
|                |                                           |                  |
|                +--------------------+----------------------+                  |
|                                     |                                         |
|                                     v                                         |
|                      +------------------------------+                         |
|                      |   Level Progression Curve    |                         |
|                      |   - 20 Educational Ranks     |                         |
|                      |   - Transparent brackets     |                         |
|                      |   - Bilingual titles (EN/FA) |                         |
|                      +------------------------------+                         |
+-------------------------------------------------------------------------------+
```

---

## 2. Threat Model & Anti-Exploit Security

In accordance with the Endoora Security Threat Model (`docs/security/THREAT_MODEL.md`), XP records are treated as primary assets with the following required controls:

1. **Strict Idempotency via `source_event`**:
   Every award requires a globally unique idempotency key (e.g. `mission:2026-09-05:step:2:user:1` or `roleplay:hotel:user1:turn8`). If an award request is repeated due to network retries, client reconnection, or double-clicks, the database enforces uniqueness (`unique=True, db_index=True`), and the service returns the existing transaction without duplicating XP.
2. **Immutability & Tamper Protection**:
   `XPTransaction` records are strictly append-only. Any attempt to update (`save()` on an existing record) or delete (`delete()`) raises a validation error. If a point deduction is needed, it must be performed as a transparent compensatory reversal transaction with `category="system_adjustment"`.
3. **User Isolation**:
   Ledger queries are strictly scoped to `request.user`. A learner cannot inspect, modify, or spend another learner's XP records.

---

## 3. Level Progression Curve

Leveling is governed by transparent cumulative XP thresholds. Levels represent volume of practice and persistence:

| Level | Cumulative XP Threshold | Educational Title (English) | Educational Title (Persian) |
| :---: | :---: | :--- | :--- |
| **1** | 0 | Novice Explorer | کاوشگر نوآموز |
| **2** | 100 | Dedicated Apprentice | شاگرد کوشا |
| **3** | 250 | Active Practitioner | تمرین‌کننده فعال |
| **4** | 450 | Consistent Scholar | پژوهشگر مستمر |
| **5** | 700 | Language Navigator | راهبر زبانی |
| **6** | 1,000 | Fluency Builder | معمار روان‌گویی |
| **7** | 1,400 | Articulate Speaker | گوینده شیوا |
| **8** | 1,900 | Persistent Master | استاد پیگیر |
| **9** | 2,500 | Bilingual Scribe | نویسنده دوزبانه |
| **10** | 3,200 | Linguistic Polymath | دانشور زبانی |
| **11** | 4,000 | Advanced Orator | سخنور پیشرفته |
| **12** | 5,000 | Proficiency Pioneer | پیشگام تسلط |
| **13** | 6,200 | Academic Scholar | پژوهشگر آکادمیک |
| **14** | 7,600 | Master Communicator | ارتباط‌گر خبره |
| **15** | 9,200 | Global Ambassador | سفیر جهانی |
| **16** | 11,000 | Distinguished Linguist | زبان‌شناس برجسته |
| **17** | 13,000 | Fluency Luminary | روشن‌ضمیر بیان |
| **18** | 15,500 | Eloquent Virtuoso | هنرمند بلاغت |
| **19** | 18,500 | Grandmaster of English | استاد بزرگ زبان |
| **20** | 22,000 | Legendary Scholar | دانشمند اسطوره‌ای |

---

## 4. Streak Tracking & Grace Freeze Rules

1. **Calendar Date Normalization**:
   Per the Product Constitution, streaks are evaluated based on local calendar days in the **Asia/Tehran** timezone (`timezone.localdate()`).
2. **Consecutive Day Progression**:
   - Activity today after activity yesterday: `streak += 1`.
   - Multiple activities on the same day: streak count remains constant (no artificial inflation).
3. **Streak Freeze Grace Protections**:
   - Every learner receives **1 default freeze shield credit**.
   - If a learner misses exactly one calendar day (e.g., Saturday active, Sunday missed, Monday active) and holds a freeze credit, the freeze is automatically consumed: the streak is preserved and incremented.
   - For every 7 consecutive days of unbroken practice, learners earn **1 additional freeze credit** (capped at a maximum of 3).
4. **Authentic Expiration**:
   If a learner misses more than one consecutive day without freeze credits, the streak resets to 1 upon their return. Longest streak records are permanently preserved.

---

## 5. REST API Specifications

### `GET /api/gamification/summary/`
Returns the learner's gamification profile:
- `total_xp`: Lifetime earned points
- `current_level`, `level_title_en`, `level_title_fa`
- `current_threshold`, `next_threshold`, `progress_percent`, `xp_to_next_level`
- `current_streak`, `longest_streak`, `freeze_credits_remaining`, `is_streak_active_today`
- `recent_transactions`: Recent 10 audit ledger entries
- `levels_catalog`: Catalog of all 20 levels
- Bilingual Rule #7 and Rule #8 compliance disclaimers

### `GET /api/gamification/ledger/`
Paginated audit log of learner's `XPTransaction` records.

### `POST /api/gamification/award/`
Protected endpoint for verified activities:
```json
{
  "amount": 30,
  "category": "mission",
  "reason": "Completed Step 2 of Today Mission",
  "source_event": "mission:2026-09-05:step:2:user:1"
}
```

### `GET /api/gamification/levels/`
Public directory of level progression thresholds and educational titles.
