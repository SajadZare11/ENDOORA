# Endoora AI Model Routing, Governance, and Validation Architecture

## 1. Overview
The Endoora AI Gateway provides a robust, backend-only abstraction over LLM providers (primarily OpenRouter) to deliver structured pedagogical learning materials for Iranian English learners.

In strict compliance with the **Endoora Product Constitution (Rule #8: Transparent Educational Notices and Fail-Safe Governance)**:
1. **Zero Browser Model Calls**: All inference calls originate strictly from backend microservices behind authenticated Django APIs.
2. **Multi-Tier Model Routing**: To avoid dependence or lock-in to any single free model, the system defines progressive fallback tiers.
3. **Strict Structured JSON Enforcement**: Free-form text generation is strictly prohibited in exercises. Model outputs must match rigid JSON schemas and pass automated consistency checks.
4. **Pre-Submission Payload Protection**: Correct answer keys and explanations are omitted from unsubmitted learner responses to prevent browser dev-tool cheating.
5. **Fail-Safe Reviewed Bank Fallback**: If models time out, providers return HTTP 429/5xx, budget caps are exceeded, or JSON validation fails after capped retries, the service seamlessly serves vetted, human-curated questions with zero learner disruption.

---

## 2. Multi-Tier Routing Sequences

### Exercise Generation (`exercise_generation`)
| Priority Tier | Model Identifier | Tier Type | Context Window | Structured JSON | Cost per 1M (est.) | Purpose |
|---|---|---|---|---|---|---|
| **Tier 1 (Primary)** | `google/gemma-2-9b-it:free` | Free | 8k | Yes | $0.00 | Ultra-fast pedagogical exercise generation |
| **Tier 2 (Fallback 1)** | `meta-llama/llama-3.1-8b-instruct:free` | Free | 8k | Yes | $0.00 | Secondary high-instruction adherence tier |
| **Tier 3 (Fallback 2)** | `mistralai/mistral-7b-instruct` | Paid (Low) | 8k | Yes | $0.15 / $0.20 | High-availability paid fallback tier |
| **Tier 4 (Fallback 3)** | `qwen/qwen-2.5-7b-instruct` | Paid (Low) | 32k | Yes | $0.20 / $0.20 | Deep multilingual reasoning fallback |
| **Fail-Safe Final** | `reviewed_bank_fallback` | Local DB | N/A | Guaranteed | $0.00 | Human-reviewed placement & curriculum bank |

### Writing Diagnostics (`writing_diagnostics`)
| Priority Tier | Model Identifier | Tier Type | Purpose |
|---|---|---|---|
| **Tier 1 (Primary)** | `meta-llama/llama-3.1-8b-instruct:free` | Free | Multi-dimensional sentence and essay diagnostics |
| **Tier 2 (Fallback 1)** | `mistralai/mistral-7b-instruct` | Paid | Highly stable diagnostics fallback |

---

## 3. Circuit Breakers & Budget Ceilings

To protect against runaway billing, infinite loops, and provider outages:
- **Timeout Circuit Breaker**: Default `15` seconds per request. Calls exceeding this threshold raise `AIClientTimeoutError` and immediately route to the next tier or local fallback.
- **Daily Budget Ceiling**: Configured in `AIProviderConfig.daily_budget_usd` (default `$5.00/day`).
- **Real-Time Spend Tracking**: Each generation call increments `current_daily_spend_usd`. When `current_daily_spend_usd >= daily_budget_usd`, `BudgetExceededError` trips the circuit breaker and routes directly to the local reviewed question bank without external calls.
- **Credential Redaction**: OpenRouter API keys and authentication tokens are automatically stripped from all logs and error messages.

---

## 4. Prompt Registry & Versioning

Prompts are stored outside HTTP handlers in `apps/api/ai_gateway/prompt_registry.py`.
Each prompt has:
- `id`: unique machine identifier (e.g. `exercise_gen_v1`)
- `version`: semantic version (e.g. `1.0.0`)
- `system_prompt`: strict pedagogical guidelines, schema requirements, and no-markdown constraints.
- `user_prompt_template`: parameterized prompt with `{target_skill}`, `{cefr_level}`, `{objective_id}`, `{focus_area}`, `{question_count}`.

---

## 5. Verification & Validation Engine

Generated candidate exercises pass through `ExerciseValidator.parse_and_validate()`:
1. **Sanitization**: Strips markdown fences (````json ... ````) and accidental preamble/postamble.
2. **Schema Compliance**: Enforces required top-level keys (`title_fa`, `title_en`, `target_skill`, `cefr_level`, `questions`).
3. **Internal Consistency Check**: `correct_option_id` MUST match the `id` of one of the items in `options`.
4. **Distractor Uniqueness**: All option strings must be distinct; duplicate distractors cause immediate rejection.
5. **Bilingual Explanations**: Verifies presence of both Persian pedagogical explanations (`explanation_fa`) and English grammatical explanations (`explanation_en`).
6. **Retry Loop**: Up to `2` attempts per model. If validation fails, error is logged in `AIRequestLog` and next attempt/tier is activated.

---

## 6. Pre-Submission Payload Protection

In `apps/api/ai_gateway/serializers.py`:
- `GeneratedExerciseSetLearnerSerializer` explicitly strips `correct_option_id`, `explanation_fa`, and `explanation_en` prior to submission.
- When the learner submits answers to `POST /api/ai/exercises/<id>/submit/`, the backend scores the attempt, creates `ExerciseAttempt`, and delivers complete results with bilingual explanations.
