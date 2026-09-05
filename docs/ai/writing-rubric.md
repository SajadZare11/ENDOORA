# Writing Mentor v1 Architecture & IELTS Rubric Specifications

## 1. Overview & Pedagogical Philosophy

The **Writing Mentor v1** provides bilingual Persian/English formative writing evaluation, diagnostic revision coaching, graduated reference rewrites, and transparent IELTS rubric breakdowns without ever replacing the learner's voice or presenting unaccredited CEFR/IELTS scores as final certificates.

Under **Product Constitution Rule #8**, the platform strictly observes:
- **Transparent Educational Claims**: Never provide a single authoritative score (e.g. "You scored 6.5"). Always supply an **estimated score range** (e.g., "Estimated Band 6.0 – 6.5") accompanied by an explicit disclosure that only accredited human examiners can certify official IELTS scores.
- **Learner Voice Preservation**: Reference rewrites (A2, B2, C2) are labeled as pedagogical models (*"نمونه بازنویسی برای یادگیری الگوها — نه جایگزین صدای شما"*). The AI does not rewrite the student's submission on their behalf.
- **Dialect & Style Separation**: Stylistic recommendations (e.g., replacing "very good" with "advantageous") are classified as optional suggestions and never penalize grammatical accuracy.
- **Selective Mistake Genome Synchronization**: Only corrections that the learner explicitly *accepts* are recorded into the Mistake Genome (`apps/api/mistake_genome/`). Dismissed suggestions are omitted to prevent polluting the student's learning twin.

---

## 2. Core Architecture & Data Models

### Backend Models (`apps/api/writing_mentor/models.py`)

1. **`WritingDraft`**:
   - `learner`: User ForeignKey.
   - `prompt_id`, `prompt_title`, `prompt_text`: Preserves assignment context.
   - `target_cefr`: Target proficiency level (`A1` through `C2`).
   - `mode`: `general`, `ielts_academic`, `ielts_general`, `free`.
   - `text`: Essay submission text.
   - `word_count`: Calculated dynamically.
   - `version`: Draft revision counter (starts at `1`, increments on revisions).
   - `parent_draft`: Self-referential ForeignKey linking revisions for historical comparison.
   - `status`: `draft`, `analyzed`, `revised`.
   - `time_spent_seconds`: Integrated stopwatch/exam timer duration.
   - `is_shared_with_teacher`: Foundation for teacher review workflow.

2. **`WritingAnalysis`**:
   - `draft`: OneToOneField to `WritingDraft`.
   - `strengths_summary_fa / en`: Highlights demonstrated writing competence.
   - `top_priorities_fa / en`: 3 actionable focus areas for the next revision.
   - `estimated_cefr_range`: Formative CEFR estimate range (e.g. `B1 – B2`).
   - `ielts_scores`: Breakdown across all 4 official IELTS assessment criteria.
   - `error_annotations`: Granular list of identified issues with `is_style_only` and `is_accepted` flags.
   - `graduated_rewrites`: Three-tier reference rewrites (`a2`, `b2`, `c2`) with voice preservation notice.
   - `revision_tasks`: Concrete coaching tasks for the student to perform during revision.
   - `disclaimer_fa / en`: Transparent Rule #8 educational notice.

---

## 3. Official IELTS 4-Criteria Rubric Breakdown

| Criterion | Key Focus Areas | Feedback Heuristics |
| :--- | :--- | :--- |
| **Task Achievement (TR)** | Addressing the prompt, supporting claims, thesis clarity, meeting word count (Task 1: 150w, Task 2: 250w). | Assesses whether the prompt is fully answered and ideas are supported with examples. |
| **Coherence & Cohesion (CC)** | Logical sequencing, topic sentences, paragraph transitions, appropriate referential pronouns. | Evaluates paragraph flow and the variety of cohesive devices. |
| **Lexical Resource (LR)** | Word choice precision, academic collocations, idiomatic phrasing, avoiding repetitive vocabulary. | Checks for topic-specific terminology and flags high-frequency repetition. |
| **Grammatical Range & Accuracy (GRA)** | Compound/complex clauses, punctuation, verb tense consistency, subject-verb agreement, L1 Persian transfer. | Identifies structural accuracy while distinguishing syntax errors from style options. |

### Score Range Policy
All criteria scores are delivered with a half-band range (e.g., `Band 6.0 – 6.5`) to prevent false precision and set accurate expectations.

---

## 4. Graduated Reference Rewrites (A2 / B2 / C2)

To coach revision without replacing the learner's voice, the Writing Mentor provides 3 graduated versions of the learner's submission:

1. **A2 (Accessible & Clear)**:
   - Simple compound sentences, everyday vocabulary, direct subject-verb-object order.
   - *Goal*: Demonstrate clear, fundamental communication without clutter.
2. **B2 (Academic & Natural)**:
   - Compound-complex clauses, standard academic transition words (e.g., *furthermore*, *consequently*), and natural collocations.
   - *Goal*: Show balanced, idiomatic expression suitable for IELTS 6.5–7.0.
3. **C2 (Nuanced & Sophisticated)**:
   - Subtle modal qualifications, advanced rhetorical resonance, precision vocabulary, and diverse discourse markers.
   - *Goal*: Provide an aspirational target demonstrating stylistic mastery.

---

## 5. Mistake Genome Integration Protocol

When a draft is analyzed, the system generates candidate `error_annotations`.
- If the learner clicks **Accept Correction**:
  1. `is_accepted` is set to `True`.
  2. `MistakeGenomeService().record_mistake()` is invoked with `source_activity="writing"` and `source_id=draft.id`.
  3. The error is factored into the student's recurring pattern tracker.
- If the learner clicks **Keep My Phrasing (Dismiss)**:
  1. `is_accepted` remains `False` and `is_dismissed` is set to `True`.
  2. No record is sent to the Mistake Genome, preventing the student's Learner Twin from being burdened with unwanted recommendations.

---

## 6. API Route Reference

- `GET /api/writing/prompts/` — Retrieve the library of CEFR & IELTS prompts.
- `POST /api/writing/drafts/` — Create or autosave draft.
- `GET /api/writing/drafts/` — List learner drafts.
- `GET /api/writing/drafts/<id>/` — Retrieve draft detail with analysis and revisions.
- `POST /api/writing/drafts/<id>/analyze/` — Run comprehensive formative writing evaluation.
- `POST /api/writing/drafts/<id>/revise/` — Create a new revision draft linked to parent.
- `POST /api/writing/drafts/<id>/accept-correction/` — Accept error correction & update Mistake Genome.
- `POST /api/writing/drafts/<id>/dismiss-correction/` — Dismiss AI suggestion.
