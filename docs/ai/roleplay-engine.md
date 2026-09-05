# AI Roleplay Engine Architecture (Day 25)

## 1. Overview & Pedagogical Purpose

The **Endoora Text-Based Roleplay Universe v1** provides structured, situational language immersion. Learners engage in authentic, goal-oriented dialogues across daily life, academic, professional, and exam-preparation contexts.

### Fundamental Pedagogical Rules
1. **Zero Mid-Turn Interruptions**: The AI character communicates strictly in-character. It never interrupts the learner with red grammar corrections or pedagogical lectures mid-dialogue.
2. **Deferred Diagnostic Reporting**: All grammatical mistake detection, structural suggestions, and target vocabulary extractions are deferred to the **Post-Conversation Report** generated at scenario conclusion or exit.
3. **Anti-Exploit Completion XP**: XP (+50 XP) is awarded strictly *once* per scenario completion (`xp_awarded` boolean guard on `RoleplaySession`), never per message turn.
4. **Bounded Token Consumption**: Hard caps on message turns (`max_turns = 8 – 10`) and user message length (500 characters max) prevent runaway token inflation.
5. **Prompt Injection & Character Safety**: Inputs attempting jailbreak ("ignore previous instructions", "reveal system prompt") are gracefully handled in-character without crashing or disclosing internal system prompts.

---

## 2. Scenario Catalogue (`data/scenarios/`)

Endoora features 10 core situational scenarios:
1. `airport.json`: Airport Passport Control & Customs (A2 - B1) — Officer Davis
2. `hotel.json`: Hotel Check-in & Special Requests (A2) — Elena (Concierge)
3. `restaurant.json`: Dining Out & Dietary Preferences (B1) — Marco (Lead Server)
4. `shopping.json`: Retail Store Return & Exchange (B1) — Chloe (Customer Care)
5. `travel.json`: Public Transit & Asking for Directions (A2) — Julian (Station Attendant)
6. `university.json`: Academic Advising & Course Selection (B2) — Dr. Sterling (Advisor)
7. `job_interview.json`: Professional Job Interview (B2) — Sarah Lin (Hiring Manager)
8. `business.json`: Project Deadline & Scope Negotiation (B2) — Marcus Vance (Product Director)
9. `friendly_chat.json`: Weekend Catch-up with a Friend (B1) — Sam (Close Friend)
10. `ielts_speaking.json`: IELTS Speaking Part 2 & 3 Simulation (B2 - C1) — Examiner Henderson

---

## 3. Data Models (`apps/api/roleplay/models.py`)

- **`RoleplaySession`**:
  - `learner`: `ForeignKey(User)`
  - `scenario_id`: `CharField(max_length=64)`
  - `scenario_title`: `CharField(max_length=255)`
  - `status`: `active`, `completed`, `abandoned`
  - `turn_count`: `IntegerField(default=0)`
  - `max_turns`: `IntegerField(default=10)`
  - `goals_completed`: `JSONField(default=list)`
  - `xp_awarded`: `BooleanField(default=False)`
- **`RoleplayMessage`**:
  - `session`: `ForeignKey(RoleplaySession)`
  - `sender`: `character`, `learner`, `system`
  - `sender_name`: `CharField(max_length=100)`
  - `content`: `TextField`
  - `timestamp`: `DateTimeField`
- **`RoleplayReport`**:
  - `session`: `OneToOneField(RoleplaySession)`
  - `goals_achieved_count`: `IntegerField`
  - `total_goals_count`: `IntegerField`
  - `communicative_score`: `IntegerField` (60–98)
  - `estimated_cefr`: `CharField`
  - `accomplishments_fa / en`: `JSONField`
  - `feedback_mistakes`: `JSONField` (deferred feedback)
  - `vocabulary_extracted`: `JSONField` (extracted target vocabulary)
  - `xp_earned`: `IntegerField` (50)

---

## 4. Downstream Integrations

### Mistake Genome (`apps/api/mistake_genome/`)
When a learner reviews their post-conversation report and clicks **"Add to Mistake Genome"**:
- `RoleplayService.accept_mistake(learner, session_id, mistake_id)` calls:
  ```python
  MistakeGenomeService().record_mistake(
      learner=learner,
      tag=mistake["tag"],
      category="grammar",
      source_activity="roleplay",
      raw_snippet=mistake["original"],
      correction_snippet=mistake["corrected"],
      explanation_fa=mistake["explanation_fa"],
      explanation_en=mistake["explanation_en"],
      source_id=f"roleplay-{session_id}",
  )
  ```
- The mistake is flagged as `accepted=True` in the report.

### Spaced Repetition Vocabulary (`apps/api/srs/`)
When a learner reviews extracted scenario vocabulary and clicks **"Save to Vocabulary Deck"**:
- `RoleplayService.save_srs_word(learner, session_id, lemma)` creates an `SrsItem`:
  ```python
  SrsItem.objects.get_or_create(
      learner=learner,
      lemma=lemma,
      defaults={
          "term": word["word"],
          "meaning_fa": word["meaning_fa"],
          "source_type": "roleplay",
          "due_at": timezone.now(),
      }
  )
  ```
- The word is flagged as `saved_to_srs=True` in the report.
