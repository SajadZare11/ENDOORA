"""
Endoora AI Gateway - Structured Exercise Generation Service
Orchestrates:
1. Provider configuration & budget ceiling enforcement.
2. Multi-tier model routing (never hardcoded to a single free model).
3. Versioned prompt compilation from PromptRegistry.
4. Strict JSON & internal consistency validation with retry loop (cap: 2 retries).
5. Automatic fail-safe fallback to reviewed question bank (malformed output NEVER reaches learner).
6. Full audit logging in AIRequestLog.
7. Attempt submission, scoring, and bilingual explanation delivery.
"""

import json
import logging
from pathlib import Path
from typing import Any

from django.conf import settings
from django.db import transaction

from .client import (
    AIClientError,
    AIClientTimeoutError,
    BudgetExceededError,
    OpenRouterClient,
)
from .models import (
    AIProviderConfig,
    AIRequestLog,
    ExerciseAttempt,
    GeneratedExerciseSet,
)
from .model_router import ModelRouter
from .prompt_registry import build_exercise_prompt
from .validators import ExerciseValidator

logger = logging.getLogger(__name__)

CURATED_FALLBACK_BANK: list[dict[str, Any]] = [
    {
        "id": "fb-a1-001",
        "target_skill": "grammar",
        "cefr_level": "A1",
        "objective_id": "grammar.present_simple",
        "title_fa": "حال ساده و ضمایر فاعلی",
        "title_en": "Present Simple & Subject Pronouns",
        "instruction_fa": "شکل صحیح فعل را انتخاب کنید.",
        "instruction_en": "Choose the correct form of the verb.",
        "prompt_en": "She ___ to the library every Wednesday afternoon.",
        "options": [
            {"id": "a", "text": "go"},
            {"id": "b", "text": "goes"},
            {"id": "c", "text": "going"},
            {"id": "d", "text": "gone"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "برای فاعل سوم شخص مفرد (She) در زمان حال ساده، پسوند -es به انتهای فعل اضافه می‌شود (goes).",
        "explanation_en": "Third-person singular subjects (he/she/it) require the -s/-es inflection in present simple.",
    },
    {
        "id": "fb-a1-002",
        "target_skill": "vocabulary",
        "cefr_level": "A1",
        "objective_id": "vocab.everyday_items",
        "title_fa": "اشیاء روزمره و وسایل شخصی",
        "title_en": "Everyday Objects & Belongings",
        "instruction_fa": "کلمه مناسب برای جای خالی را انتخاب کنید.",
        "instruction_en": "Select the correct noun for the context.",
        "prompt_en": "I need my ___ because it is raining heavily outside.",
        "options": [
            {"id": "a", "text": "umbrella"},
            {"id": "b", "text": "sunglasses"},
            {"id": "c", "text": "wallet"},
            {"id": "d", "text": "calendar"},
        ],
        "correct_option_id": "a",
        "explanation_fa": "کلمه 'umbrella' به معنی چتر است که برای محافظت در برابر باران استفاده می‌شود.",
        "explanation_en": "An umbrella is standard protection against precipitation (rain).",
    },
    {
        "id": "fb-a2-001",
        "target_skill": "grammar",
        "cefr_level": "A2",
        "objective_id": "grammar.past_simple",
        "title_fa": "گذشته ساده افعال بی‌قاعده",
        "title_en": "Irregular Past Simple Verbs",
        "instruction_fa": "فعل مناسب در زمان گذشته را انتخاب کنید.",
        "instruction_en": "Select the irregular past tense verb.",
        "prompt_en": "Yesterday afternoon, we ___ an inspiring art exhibition.",
        "options": [
            {"id": "a", "text": "see"},
            {"id": "b", "text": "saw"},
            {"id": "c", "text": "seen"},
            {"id": "d", "text": "seeing"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "شکل گذشته ساده فعل see به صورت بی‌قاعده saw است.",
        "explanation_en": "The past simple form of the irregular verb 'see' is 'saw'.",
    },
    {
        "id": "fb-b1-001",
        "target_skill": "grammar",
        "cefr_level": "B1",
        "objective_id": "grammar.present_perfect",
        "title_fa": "حال کامل و نشانگرهای زمانی",
        "title_en": "Present Perfect with Time Markers",
        "instruction_fa": "ساختار صحیح فعل را انتخاب کنید.",
        "instruction_en": "Choose the correct verb aspect for experience/duration.",
        "prompt_en": "Dr. Rezaei has lived and worked in Shiraz ___ over ten years.",
        "options": [
            {"id": "a", "text": "since"},
            {"id": "b", "text": "for"},
            {"id": "c", "text": "during"},
            {"id": "d", "text": "from"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "حرف اضافه for همراه با یک طول بازه زمانی (over ten years) به کار می‌رود، در حالی که since به نقطه آغازین اشاره می‌کند.",
        "explanation_en": "'For' specifies duration of time, whereas 'since' marks a specific starting point.",
    },
    {
        "id": "fb-b1-002",
        "target_skill": "vocabulary",
        "cefr_level": "B1",
        "objective_id": "vocab.academic_collocations",
        "title_fa": "همنشینی‌های واژگانی رسمی",
        "title_en": "Academic & Professional Collocations",
        "instruction_fa": "فعل مناسب برای همنشینی با 'progress' را انتخاب نمایید.",
        "instruction_en": "Select the natural collocation verb.",
        "prompt_en": "The students have ___ significant progress in their academic writing this term.",
        "options": [
            {"id": "a", "text": "done"},
            {"id": "b", "text": "made"},
            {"id": "c", "text": "built"},
            {"id": "d", "text": "taken"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "همنشینی صحیح انگلیسی make progress است و فعل do به کار نمی‌رود.",
        "explanation_en": "The standard English collocation is 'make progress', not 'do progress'.",
    },
    {
        "id": "fb-b2-001",
        "target_skill": "grammar",
        "cefr_level": "B2",
        "objective_id": "grammar.conditionals",
        "title_fa": "شرطی نوع دوم و فرضیات غیرواقعی",
        "title_en": "Second Conditional & Hypothetical Situations",
        "instruction_fa": "شکل شرطی مناسب را انتخاب کنید.",
        "instruction_en": "Complete the hypothetical conditional sentence.",
        "prompt_en": "If we had additional computational resources, we ___ the experiment faster.",
        "options": [
            {"id": "a", "text": "will complete"},
            {"id": "b", "text": "would complete"},
            {"id": "c", "text": "had completed"},
            {"id": "d", "text": "completed"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "در ساختار شرطی نوع دوم (If + past simple)، در بند اصلی از would + infinitive استفاده می‌شود.",
        "explanation_en": "Second conditional structures pair past simple in the condition clause with 'would + bare infinitive'.",
    },
    {
        "id": "fb-c1-001",
        "target_skill": "grammar",
        "cefr_level": "C1",
        "objective_id": "grammar.inversion",
        "title_fa": "قلب ساختار با عبارات قیدی منفی",
        "title_en": "Negative Adverbial Inversion",
        "instruction_fa": "ترتیب واژگان بعد از قید منفی ابتدای جمله را انتخاب کنید.",
        "instruction_en": "Apply negative inversion after 'rarely'.",
        "prompt_en": "Rarely ___ such profound consensus among diverse linguistic researchers.",
        "options": [
            {"id": "a", "text": "we witness"},
            {"id": "b", "text": "do we witness"},
            {"id": "c", "text": "we did witness"},
            {"id": "d", "text": "have we witnessed"},
        ],
        "correct_option_id": "b",
        "explanation_fa": "هنگامی که قید منفی مانند Rarely در ابتدای جمله می‌آید، ترتیب فاعل و فعل کمکی معکوس (inversion) می‌شود.",
        "explanation_en": "Fronted negative adverbs trigger auxiliary-subject inversion ('do we witness').",
    },
]


class StructuredExerciseService:
    """End-to-end service for generating, validating, falling back, and grading exercises."""

    MAX_RETRIES = 2

    def __init__(self, client: OpenRouterClient | None = None):
        self.client = client or OpenRouterClient()

    def generate_exercise_set(
        self,
        learner,
        target_skill: str = "grammar",
        cefr_level: str = "B1",
        objective_id: str = "obj_general",
        focus_area: str = "general practice",
        question_count: int = 3,
        prompt_id: str = "exercise_gen_v1",
    ) -> GeneratedExerciseSet:
        """
        Attempts AI exercise generation through multi-tier model router.
        Falls back to curated reviewed bank if all tiers fail, timeout, or budget is exceeded.
        """
        # Ensure count is within sane limits
        question_count = max(1, min(question_count, 5))
        cefr_level = cefr_level.upper()
        if cefr_level not in {"A1", "A2", "B1", "B2", "C1", "C2"}:
            cefr_level = "B1"

        # Check if Mistake Genome has an active recurring target to focus on
        if not focus_area or focus_area == "general practice":
            try:
                from mistake_genome.services import MistakeGenomeService
                targets = MistakeGenomeService().get_top_practice_targets(learner, limit=1)
                if targets:
                    top = targets[0]
                    focus_area = f"Remediate recurring error in {top.title_en} ({top.tag})"
                    target_skill = top.category
            except Exception:
                pass

        system_prompt, user_prompt = build_exercise_prompt(
            target_skill=target_skill,
            cefr_level=cefr_level,
            objective_id=objective_id,
            focus_area=focus_area,
            question_count=question_count,
            prompt_id=prompt_id,
        )

        # Retrieve model sequence from router (no single hardcoded model)
        models = ModelRouter.get_models_for_task("exercise_generation")

        for model in models:
            for attempt in range(self.MAX_RETRIES):
                try:
                    res = self.client.chat_completion(
                        model=model,
                        system_prompt=system_prompt,
                        user_prompt=user_prompt,
                        temperature=0.3,
                        max_tokens=1800,
                        response_format={"type": "json_object"},
                    )

                    is_valid, validated_data, err_msg = ExerciseValidator.parse_and_validate(
                        res["content"],
                        expected_count=question_count,
                        expected_cefr=cefr_level,
                    )

                    if is_valid and validated_data:
                        # Log success
                        AIRequestLog.objects.create(
                            feature="exercise_generation",
                            prompt_id=prompt_id,
                            prompt_version="1.0.0",
                            model_name=res["model"],
                            provider=self.client.config.provider,
                            prompt_tokens=res["prompt_tokens"],
                            completion_tokens=res["completion_tokens"],
                            total_cost_usd=res["cost_usd"],
                            response_time_ms=res["response_time_ms"],
                            success=True,
                            is_fallback=False,
                        )

                        # Create and return GeneratedExerciseSet
                        return GeneratedExerciseSet.objects.create(
                            learner=learner,
                            title_fa=validated_data.get("title_fa", "تمرین هوشمند زبانی"),
                            title_en=validated_data.get("title_en", "Adaptive Language Practice"),
                            target_skill=validated_data.get("target_skill", target_skill),
                            cefr_level=validated_data.get("cefr_level", cefr_level),
                            objective_id=objective_id,
                            questions=validated_data["questions"],
                            is_fallback=False,
                            model_used=res["model"],
                            cost_usd=res["cost_usd"],
                        )
                    else:
                        # Validation failure - log and retry
                        logger.warning("Exercise validation failed on model %s attempt %d: %s", model, attempt, err_msg)
                        AIRequestLog.objects.create(
                            feature="exercise_generation",
                            prompt_id=prompt_id,
                            model_name=model,
                            provider=self.client.config.provider,
                            response_time_ms=res.get("response_time_ms", 0),
                            success=False,
                            is_fallback=False,
                            error_message=f"Validation failed: {err_msg}",
                        )

                except (BudgetExceededError, AIClientTimeoutError, AIClientError) as exc:
                    logger.warning("OpenRouter error on model %s attempt %d: %s", model, attempt, exc)
                    AIRequestLog.objects.create(
                        feature="exercise_generation",
                        prompt_id=prompt_id,
                        model_name=model,
                        provider=self.client.config.provider,
                        success=False,
                        is_fallback=False,
                        error_message=str(exc),
                    )
                    # If budget exceeded, do not continue trying remote models
                    if isinstance(exc, BudgetExceededError):
                        return self._fallback_to_reviewed_bank(
                            learner=learner,
                            target_skill=target_skill,
                            cefr_level=cefr_level,
                            objective_id=objective_id,
                            question_count=question_count,
                            reason="budget_exceeded",
                        )
                    break

        # If all remote models fail or are unreachable, fall back to reviewed bank
        return self._fallback_to_reviewed_bank(
            learner=learner,
            target_skill=target_skill,
            cefr_level=cefr_level,
            objective_id=objective_id,
            question_count=question_count,
            reason="all_models_exhausted_or_unreachable",
        )

    def _fallback_to_reviewed_bank(
        self,
        learner,
        target_skill: str,
        cefr_level: str,
        objective_id: str,
        question_count: int,
        reason: str = "provider_fallback",
    ) -> GeneratedExerciseSet:
        """Loads vetted, verified questions from local repository with zero external API calls."""
        # 1. Try matching target skill and CEFR from curated bank
        matching = [
            q for q in CURATED_FALLBACK_BANK
            if q["cefr_level"] == cefr_level and q["target_skill"] == target_skill
        ]

        # 2. If insufficient, try matching just CEFR
        if len(matching) < question_count:
            additional = [
                q for q in CURATED_FALLBACK_BANK
                if q["cefr_level"] == cefr_level and q not in matching
            ]
            matching.extend(additional)

        # 3. If still insufficient, try any reviewed item
        if len(matching) < question_count:
            additional = [q for q in CURATED_FALLBACK_BANK if q not in matching]
            matching.extend(additional)

        selected = matching[:question_count]

        # Also attempt loading from placement/core-items.json if available
        if len(selected) < question_count:
            core_items_path = Path(settings.BASE_DIR).parent / "data" / "placement" / "core-items.json"
            if core_items_path.is_file():
                try:
                    with open(core_items_path, "r", encoding="utf-8") as f:
                        raw_items = json.load(f)
                    for item in raw_items:
                        if len(selected) >= question_count:
                            break
                        opts = [
                            {"id": chr(ord("a") + i), "text": opt}
                            for i, opt in enumerate(item.get("options", []))
                        ]
                        correct_text = item.get("correct_option", "")
                        correct_opt = next((o for o in opts if o["text"].lower() == correct_text.lower()), None)
                        correct_id = correct_opt["id"] if correct_opt else "a"

                        selected.append({
                            "id": f"core-{item.get('id', len(selected))}",
                            "type": "multiple_choice",
                            "title_fa": "تمرین تاییدشده گرامر",
                            "title_en": "Verified Pedagogical Practice",
                            "instruction_fa": item.get("prompt_fa", "گزینه صحیح را انتخاب کنید."),
                            "instruction_en": "Select the correct option.",
                            "prompt_en": item.get("question", ""),
                            "options": opts,
                            "correct_option_id": correct_id,
                            "explanation_fa": f"پاسخ درست بر اساس کاربرد صحیح {item.get('objective', 'گرامری')} تعیین شده است.",
                            "explanation_en": f"Correct answer aligns with the {item.get('objective', 'grammar')} target rule.",
                            "cefr_level": item.get("cefr_level", cefr_level),
                            "objective_id": item.get("objective", objective_id),
                        })
                except Exception as exc:
                    logger.warning("Could not read placement core-items: %s", exc)

        # Record fallback log
        AIRequestLog.objects.create(
            feature="exercise_generation",
            prompt_id="fallback_bank",
            prompt_version="1.0.0",
            model_name="reviewed_bank_fallback",
            provider="local_vetted_bank",
            success=True,
            is_fallback=True,
            error_message=f"Fallback triggered: {reason}",
        )

        return GeneratedExerciseSet.objects.create(
            learner=learner,
            title_fa="مجموعه تمرین تثبیت‌شده (بانک بازبینی‌شده)",
            title_en="Verified Exercise Set (Reviewed Bank)",
            target_skill=target_skill,
            cefr_level=cefr_level,
            objective_id=objective_id,
            questions=selected,
            is_fallback=True,
            model_used="reviewed_bank_fallback",
            cost_usd=0.0,
        )

    @transaction.atomic
    def submit_exercise(self, learner, exercise_set_id: int, answers: dict[str, str]) -> dict[str, Any]:
        """
        Evaluates a learner's answers against the true answer keys in the exercise set.
        Guarantees learner ownership and produces full bilingual explanations.
        """
        exercise_set = GeneratedExerciseSet.objects.select_for_update().get(
            id=exercise_set_id, learner=learner
        )

        questions = exercise_set.questions
        total_count = len(questions)
        correct_count = 0
        detailed_results = []

        for q in questions:
            q_id = str(q.get("id"))
            correct_id = str(q.get("correct_option_id", "")).strip().lower()
            submitted_id = str(answers.get(q_id, "")).strip().lower()

            is_correct = bool(submitted_id and submitted_id == correct_id)
            if is_correct:
                correct_count += 1
            else:
                try:
                    from mistake_genome.services import MistakeGenomeService
                    tag = f"{exercise_set.target_skill}.{q.get('objective_id') or q_id}"
                    corr_text = next(
                        (opt["text"] for opt in q.get("options", []) if opt["id"] == correct_id),
                        correct_id,
                    )
                    MistakeGenomeService().record_mistake(
                        learner=learner,
                        tag=tag,
                        category=exercise_set.target_skill,
                        title_fa=q.get("title_fa", ""),
                        title_en=q.get("title_en", ""),
                        source_activity="exercise",
                        source_id=str(exercise_set.id),
                        raw_snippet=f"Selected option '{submitted_id}' for: {q.get('prompt_en', '')}",
                        correction_snippet=corr_text,
                        explanation_fa=q.get("explanation_fa", ""),
                        explanation_en=q.get("explanation_en", ""),
                    )
                except Exception as exc:
                    logger.debug("Could not record mistake event in genome: %s", exc)

            detailed_results.append({
                "question_id": q_id,
                "selected_option_id": submitted_id,
                "correct_option_id": correct_id,
                "is_correct": is_correct,
                "prompt_en": q.get("prompt_en", ""),
                "options": q.get("options", []),
                "explanation_fa": q.get("explanation_fa", ""),
                "explanation_en": q.get("explanation_en", ""),
                "cefr_level": q.get("cefr_level", exercise_set.cefr_level),
            })

        score_percentage = round((correct_count / total_count * 100.0), 1) if total_count > 0 else 0.0

        attempt = ExerciseAttempt.objects.create(
            learner=learner,
            exercise_set=exercise_set,
            answers=answers,
            score_percentage=score_percentage,
            correct_count=correct_count,
            total_count=total_count,
        )

        return {
            "attempt_id": attempt.id,
            "exercise_set_id": exercise_set.id,
            "score_percentage": score_percentage,
            "correct_count": correct_count,
            "total_count": total_count,
            "is_fallback": exercise_set.is_fallback,
            "model_used": exercise_set.model_used,
            "completed_at": attempt.completed_at.isoformat(),
            "results": detailed_results,
        }
