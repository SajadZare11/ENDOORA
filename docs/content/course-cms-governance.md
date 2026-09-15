# Course CMS, Curriculum Units & Server-Side Paywall Redaction Governance (CONTENT-003)

## 1. Architectural Overview
The **Course CMS (CONTENT-003)** is Endoora's canonical content management and curriculum governance center for modular courses, curriculum units (modules), and interactive lessons. It provides editorial workflows, copyright licensing verification, and strict server-side paywall redaction to protect intellectual property and premium learning assets.

---

## 2. Curriculum Data Hierarchy

```
Course (e.g., IELTS Academic Speaking & Writing: Band 7+)
  ├── Metadata: CEFR (B2), Skill (Writing), Audience (IELTS), License, Source Attribution, Author
  └── Modules (Curriculum Units)
        ├── Module 1 (e.g., Task 2 Essay Architecture)
        │     ├── Lesson 1: Anatomy of a 40-Word Introduction [Free Preview: True]
        │     └── Lesson 2: Counter-Arguments & Rebuttals [Free Preview: False / Locked]
        └── Module 2 (e.g., Cohesion & Lexical Resource)
              └── Lesson 1: Academic Collocations Deep Dive [Free Preview: False / Locked]
```

### Entity Specifications
1. **Course**:
   - `slug`: unique URL identifier (e.g., `ielts-academic-speaking-and-writing-mastery`).
   - Bilingual presentation: `title_fa` / `title_en`, `description_fa` / `description_en`.
   - CEFR Alignment: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
   - Target Audience: `general`, `school_konkur`, `ielts_academic`, `business`.
   - Copyright Metadata: `source_attribution` (mandatory), `author_name` (mandatory), `license_type` (`original_editorial`, `cc_by_sa`, `public_domain`, `educational_fair_use`).
   - Lifecycle Status: `draft`, `in_review`, `published`, `archived`.

2. **Module (Curriculum Unit)**:
   - `course`: Foreign key link.
   - `order`: Sequential ordering within the course.
   - `title_fa` / `title_en`: Module headline.
   - `description_fa` / `description_en`: Pedagogical scope.

3. **Lesson**:
   - `module`: Foreign key link.
   - `order`: Sequential ordering within the module.
   - `duration_minutes`: Estimated time on task.
   - `is_free_preview`: If `True`, freely accessible to unentitled learners as a transparent pedagogical sample.
   - Content: `content_body_fa` / `content_body_en` (rich Markdown), `video_url`, `audio_url`, `transcript_fa` / `transcript_en`, `quiz_data` (interactive formative items), `downloadable_resources`.
   - Redaction Excerpts: `free_preview_excerpt_fa` / `free_preview_excerpt_en`.

---

## 3. Server-Side Paywall Redaction Invariants (Rule #10)

> [!IMPORTANT]
> **Zero Client-Side Leaks:**
> Under no circumstances may protected media URLs, full transcripts, full markdown bodies, or formative quiz answer keys be sent to an unentitled learner's browser and hidden with CSS or JavaScript.

### Redaction Rules
When a lesson is requested by an unentitled learner and `course.is_premium == True` and `lesson.is_free_preview == False`:
1. `content_body_fa` is replaced with `free_preview_excerpt_fa`.
2. `content_body_en` is replaced with `free_preview_excerpt_en`.
3. `video_url` is stripped to an empty string `""`.
4. `audio_url` is stripped to an empty string `""`.
5. `transcript_fa` and `transcript_en` are stripped to empty strings `""`.
6. `quiz_data` is replaced with an empty list `[]`.
7. `downloadable_resources` is replaced with an empty list `[]`.
8. `is_locked` is set to `True`.
9. `paywall_info` is attached, providing transparent upgrade pricing and checkout links (`/account/plan`).

### Paywall Redaction Simulator & Inspector
The Course CMS operations suite includes an active **Paywall Redaction Inspector** (`GET /api/courses/editor/lessons/<id>/preview-redaction/?mode=learner_unsubscribed|learner_subscribed`). Editors can toggle between unsubscribed and subscribed perspectives to audit the exact wire JSON payload and confirm that zero sensitive bytes leak.

---

## 4. Editorial Workflow & Publication Release Gates

Transitions follow a strict gate model:
- `draft` -> `in_review`: Initiated by author when drafting is ready for peer review.
- `in_review` -> `published`: Requires passing automated publication gates:
  - Course must contain at least **1 curriculum module**.
  - Course must contain at least **1 lesson**.
  - If course is marked `is_premium`, it must contain at least **1 free preview lesson** (`is_free_preview=True`) for learner transparency.
  - Mandatory `source_attribution` and `author_name` must be populated.
- `published` -> `archived`: Retires the course from public browsing while preserving access for previously enrolled students.
- `archived` -> `draft`: Re-opens a course for curriculum redesign.

---

## 5. Security & Access Boundaries

- Operational routes (`/operations/courses` and `/api/courses/editor/*`) enforce `IsCourseEditorOrAdministrator`.
- Unauthenticated requests receive `401 Unauthorized` or `403 Forbidden`.
- Normal learners receive `403 Forbidden`.
- Editorial actions and status transitions are audited with explicit timestamps.
