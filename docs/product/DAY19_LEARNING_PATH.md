# Day 19 — Personal Learning Path

Endoora provides an evidence-grounded, learner-specific personal path built dynamically from:

1. **Placement Evidence**: Calibrated 6-section assessment (Grammar, Vocabulary, Reading, Listening, Speaking, Writing).
2. **Learner Twin State**: Observed evidence counts, skill proficiency snapshots, and active progress.
3. **Future Learning Evidence**: Daily missions, spaced repetition vocabulary reviews, and mentor sessions.

## Architecture & Principles

### 1. Honest Assessment (Product Constitution Rule #8)
- Avoids fake precision or invented progress percentages (e.g. "42% fluent").
- Progress is expressed through qualitative, explainable timeline stages:
  - `complete`: Verified evidence recorded (e.g. submitted placement session).
  - `current`: Active focal step (e.g. targeted practice on growth skills).
  - `upcoming`: Next logical activity (e.g. Daily Mission).
  - `planned`: Structured long-term milestone (e.g. SRS vocabulary retention, Teacher Support).
  - `locked`: Dependent on preceding evidence.
- Transparently disclaims: "این مسیر و تخمین سطح جنبه تشخیصی و آموزشی دارد و بدون آزمون رسمی معتبر تحت نظارت مدرک رسمی محسوب نمی‌شود."

### 2. Multi-Phase Progress Timeline
- **Phase 1: ارزیابی چندبُعدی و تعیین سطح اولیه (Placement & Baseline Diagnosis)**
  - Cites session ID, provisional CEFR estimate (`A1`–`C1`), and 6-section overall score.
- **Phase 2: تثبیت پایه‌ها و رفع نقاط چالش (Core Reinforcement & Growth Areas)**
  - Pinpoints learner's lowest-scoring skill(s) from placement as highest priority.
  - Provides direct practice links (`/writing`, `/voice`, `/listening`, `/review`, `/practice-ai`).
- **Phase 3: مأموریت‌های یادگیری تطبیقی روزانه (Daily Missions & Adaptive Practice)**
  - Connects to `/today` for daily goal-directed exercises.
- **Phase 4: مرور فعال واژگان با یادآوری فاصله‌دار (Active Vocabulary SRS Review)**
  - Connects to `/review` for spaced repetition retention.
- **Phase 5: مهارت‌های ارتباطی و پشتیبانی مدرس (Productive Skills & Teacher Support)**
  - Connects to `/teachers` and interactive roleplay.

### 3. API Contract
- **Endpoint**: `GET /api/learner-twin/path/` (also routed as `GET /api/path/`)
- **Permissions**: `IsAuthenticated` required.
- **Payload Schema**:
  ```json
  {
    "placement_completed": true,
    "estimated_cefr_level": "B1",
    "overall_percentage": 78.0,
    "generated_from": ["placement_evidence", "learner_twin", "six_skills_diagnostic"],
    "next_best_step": "practice_writing",
    "next_best_step_fa": "تمرین نگارش در آزمایشگاه نویسندگی",
    "next_best_step_en": "Practice writing in the essay mentor lab",
    "next_best_step_href": "/writing",
    "focus_areas": [
      {
        "skill": "writing",
        "label_fa": "نگارش",
        "label_en": "Writing",
        "score_percentage": 50.0,
        "priority": "high",
        "recommendation_fa": "نوشتن متن‌های ساختاریافته در ویرایشگر و دریافت ارزیابی تحلیلی",
        "recommendation_en": "Draft guided essays with formatting tools and automated feedback",
        "action_href": "/writing"
      }
    ],
    "section_scores": [ ... ],
    "timeline": [ ... ],
    "limitations_fa": [ ... ],
    "limitations_en": [ ... ]
  }
  ```

### 4. Wireframe 1 Placement-to-Path Flow
- **Public Home** → `Take Placement Test`
- **Placement Runner** (6 sections) → `Submit`
- **Placement Report** (`/placement/report`) → Primary CTA: **Build & View Personal Path** (`/path`)
- **Personal Learning Path** (`/path`) → Primary CTA: **Start Recommended Action** (`/today` or priority practice)
