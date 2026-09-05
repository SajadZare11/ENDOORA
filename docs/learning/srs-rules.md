# Endoora Spaced Repetition System (SRS) Rules & Architecture

## Overview
The Endoora SRS engine turns candidate words discovered during real learner activities—including IELTS essay writing, conversational roleplay, placement diagnostics, and teacher-assigned tasks—into personalized, high-yield active recall review cards.

In accordance with the Endoora Product Constitution, this system operates on transparent empirical intervals, guards against deck bloat, and provides pedagogical interventions when cards become difficult.

---

## 1. Candidate Word Extraction & Learner Approval Gate
To prevent the common trap of **Auto-saving every word**, Endoora utilizes a two-stage acquisition pipeline:

1. **Extraction Pipeline**:
   - Analyzes learner texts (e.g. from `/writing`, `/voice`, `/roleplay`, or `/placement`).
   - Normalizes and lemmatizes tokens (e.g. converting `discoveries` $\to$ `discovery`).
   - Filters out high-frequency function words (`STOP_WORDS`).
   - Deduplicates against existing deck items and pending candidates.
   - Preserves traceable source context sentences (`source_text`).
   - Places candidates into the learner's **Candidate Inbox** (`SrsCandidate` with `status="pending"`).

2. **Approval Step**:
   - The learner reviews pending candidate words in `/vocabulary`.
   - The learner can **Approve** (converting to an active `SrsItem` in their deck) or **Ignore** (dismissing the candidate).
   - The learner can adjust or correct the generated Persian translation or example sentence before approval.

---

## 2. Transparent SM-2 Interval Calculation
Endoora implements an explainable, transparent SM-2 spaced repetition scheduler:

### Rating Scales
| Rating | Label | Effect on Repetition | Effect on Ease Factor | New Interval Formula |
|---|---|---|---|---|
| **1** | **Again** | Resets to $0$ | Decreases by $0.20$ (min $1.30$) | $I_1 = 1\text{ day}$ |
| **2** | **Hard** | Unchanged | Decreases by $0.15$ (min $1.30$) | $I_n = \max(1, \text{round}(I_{n-1} \times 1.2))$ |
| **3** | **Good** | Increments by $1$ | Unchanged | $I_1=1$, $I_2=3$, $I_n = \text{round}(I_{n-1} \times EF)$ |
| **4** | **Easy** | Increments by $1$ | Increases by $0.15$ (max $3.00$) | $I_1=2$, $I_2=5$, $I_n = \max(I_{\text{good}} + 1, \text{round}(I_{n-1} \times EF \times 1.3))$ |

### Transparent Interface Contract
Every review endpoint response includes `next_intervals` for all four rating choices:
```json
{
  "again": 1,
  "hard": 2,
  "good": 4,
  "easy": 7
}
```
Learners see exactly when a card will return before pressing any button.

---

## 3. Leech Handling & Remediation Protocol
A **leech** is a card that fails recall repeatedly, creating cognitive fatigue without retention:

- **Lapse Counter**: Every time rating `1 (Again)` is selected, `lapse_count` increments.
- **Leech Threshold**: When `lapse_count >= 4`, the card is automatically flagged:
  - `is_leech = True`
  - `leech_action = "contextual_remedy"`
- **Pedagogical Intervention**: Instead of subjecting the learner to repetitive flashcard button clicks, leeches surface in the **Leech Recovery** tab in `/vocabulary` with recommendations to:
  1. Construct original sentences in the Writing Mentor (`/writing`).
  2. Request teacher clarification or pronunciation drill.
  3. Edit flawed mental associations or refine bilingual mnemonics.

---

## 4. Anti-Spam & Integrity Protections
To prevent rapid button spamming:
- Submissions with response latency under 300 ms are rejected.
- Server-side validation ensures only the authenticated owner can access, review, modify, or delete cards (`learner=request.user`).

---

## 5. Traceability & Context Deletion
- Every active card retains the sentence from which it was extracted (`source_text`) and the activity type (`source_type`).
- Learners have total autonomy to delete cards via `DELETE /api/srs/items/<id>/`. Card deletion permanently removes personal source contexts to preserve privacy and user control.
