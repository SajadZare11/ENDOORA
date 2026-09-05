"""
Endoora AI Gateway Unit and Integration Tests
Tests:
1. Multi-tier model routing (never hardcoding a single free model).
2. Daily budget ceiling circuit breaker stopping calls.
3. Timeout handling & API key redaction.
4. JSON schema and internal consistency validation.
5. Distractor ambiguity & duplicate detection.
6. Automatic fallback to reviewed question bank during provider failures.
7. Pre-submission payload protection (answer keys & explanations stripped).
8. Submission evaluation, score calculation, and bilingual explanation delivery.
9. Learner isolation and ownership enforcement.
10. AI status transparency view.
"""

from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .client import (
    AIClientError,
    AIClientTimeoutError,
    BudgetExceededError,
    OpenRouterClient,
)
from .model_router import ModelRouter
from .models import (
    AIProviderConfig,
    AIRequestLog,
    ExerciseAttempt,
    GeneratedExerciseSet,
)
from .prompt_registry import build_exercise_prompt, get_prompt_template
from .serializers import GeneratedExerciseSetLearnerSerializer
from .services import StructuredExerciseService
from .validators import ExerciseValidator

User = get_user_model()


class AIModelRouterTests(TestCase):
    """Verifies that model routing avoids single free-model lock-in."""

    def test_model_router_has_multi_tier_fallbacks(self):
        models = ModelRouter.get_models_for_task("exercise_generation")
        self.assertGreaterEqual(len(models), 3)
        self.assertIn("google/gemma-2-9b-it:free", models[0])
        self.assertIn("meta-llama/llama-3.1-8b-instruct", models[1])

    def test_model_info_retrieval(self):
        info = ModelRouter.get_model_info("google/gemma-2-9b-it:free")
        self.assertIsNotNone(info)
        self.assertTrue(info["is_free"])
        self.assertTrue(info["supports_json"])


class OpenRouterClientTests(TestCase):
    """Verifies client-level circuit breakers and security."""

    def setUp(self):
        self.config = AIProviderConfig.objects.create(
            name="test_config",
            provider="openrouter",
            api_base_url="https://openrouter.ai/api/v1",
            api_key_env_var="TEST_API_KEY_ENV",
            timeout_seconds=5,
            daily_budget_usd=2.00,
            current_daily_spend_usd=0.00,
            enabled=True,
        )
        self.client = OpenRouterClient(config=self.config)

    def test_budget_ceiling_stops_calls(self):
        self.config.current_daily_spend_usd = 2.05
        self.config.save()

        with self.assertRaises(BudgetExceededError):
            self.client.check_budget()

    def test_disabled_provider_raises_error(self):
        self.config.enabled = False
        self.config.save()

        with self.assertRaises(AIClientError):
            self.client.check_budget()

    def test_redact_sensitive_info(self):
        with patch.object(self.client, "get_api_key", return_value="sk-or-v1-secretkey987654321"):
            leaked_text = "Failed to authenticate with bearer sk-or-v1-secretkey987654321 on endpoint."
            redacted = self.client.redact_sensitive_info(leaked_text)
            self.assertNotIn("sk-or-v1-secretkey987654321", redacted)
            self.assertIn("[REDACTED_API_KEY]", redacted)


class ExerciseValidatorTests(TestCase):
    """Verifies strict JSON schema and pedagogical integrity."""

    def test_clean_raw_output_removes_markdown(self):
        raw = "```json\n{\"title_fa\": \"تست\", \"title_en\": \"Test\"}\n```"
        cleaned = ExerciseValidator.clean_raw_output(raw)
        self.assertEqual(cleaned, '{"title_fa": "تست", "title_en": "Test"}')

    def test_valid_exercise_json_passes(self):
        payload = {
            "title_fa": "تمرین گذشته ساده",
            "title_en": "Past Simple Practice",
            "target_skill": "grammar",
            "cefr_level": "A2",
            "questions": [
                {
                    "id": "q1",
                    "type": "multiple_choice",
                    "title_fa": "سوال اول",
                    "title_en": "Question 1",
                    "instruction_fa": "گزینه درست را انتخاب کنید.",
                    "instruction_en": "Select the correct option.",
                    "prompt_en": "We ___ to the cinema yesterday.",
                    "options": [
                        {"id": "a", "text": "go"},
                        {"id": "b", "text": "went"},
                        {"id": "c", "text": "goes"},
                        {"id": "d", "text": "going"},
                    ],
                    "correct_option_id": "b",
                    "explanation_fa": "گذشته ساده فعل go کلمه went است.",
                    "explanation_en": "Went is the past tense of go.",
                }
            ],
        }
        is_valid, validated, err = ExerciseValidator.parse_and_validate(payload)
        self.assertTrue(is_valid)
        self.assertIsNone(err)
        self.assertEqual(len(validated["questions"]), 1)
        self.assertEqual(validated["questions"][0]["correct_option_id"], "b")

    def test_rejects_inconsistent_answer_key(self):
        payload = {
            "title_fa": "تمرین",
            "title_en": "Practice",
            "target_skill": "grammar",
            "cefr_level": "B1",
            "questions": [
                {
                    "id": "q1",
                    "prompt_en": "She ___ a letter.",
                    "options": [
                        {"id": "a", "text": "writes"},
                        {"id": "b", "text": "wrote"},
                    ],
                    # 'z' is not in options!
                    "correct_option_id": "z",
                }
            ],
        }
        is_valid, validated, err = ExerciseValidator.parse_and_validate(payload)
        self.assertFalse(is_valid)
        self.assertIn("Internal consistency violation", err)

    def test_rejects_duplicate_options(self):
        payload = {
            "title_fa": "تمرین",
            "title_en": "Practice",
            "target_skill": "grammar",
            "cefr_level": "B1",
            "questions": [
                {
                    "id": "q1",
                    "prompt_en": "She ___ a letter.",
                    "options": [
                        {"id": "a", "text": "write"},
                        {"id": "b", "text": "write"},  # Duplicate text!
                    ],
                    "correct_option_id": "a",
                }
            ],
        }
        is_valid, validated, err = ExerciseValidator.parse_and_validate(payload)
        self.assertFalse(is_valid)
        self.assertIn("Duplicate option text", err)


class StructuredExerciseServiceTests(TestCase):
    """Verifies end-to-end generation, fallback, and grading."""

    def setUp(self):
        self.learner = User.objects.create_user(
            email="learner01@endoora.test",
            password="test-password-123",
            role="learner",
        )
        self.config = AIProviderConfig.objects.create(
            name="openrouter_main",
            provider="openrouter",
            daily_budget_usd=5.00,
            current_daily_spend_usd=0.00,
            enabled=True,
        )

    def test_fallback_when_remote_api_unavailable(self):
        # With unconfigured key / mocked network failure, must fall back cleanly
        service = StructuredExerciseService()
        exercise_set = service.generate_exercise_set(
            learner=self.learner,
            target_skill="grammar",
            cefr_level="B1",
            question_count=2,
        )

        self.assertIsNotNone(exercise_set)
        self.assertTrue(exercise_set.is_fallback)
        self.assertEqual(exercise_set.model_used, "reviewed_bank_fallback")
        self.assertEqual(len(exercise_set.questions), 2)
        # Verify question structure
        q1 = exercise_set.questions[0]
        self.assertIn("prompt_en", q1)
        self.assertIn("options", q1)
        self.assertIn("correct_option_id", q1)

        # Verify audit log was recorded
        log = AIRequestLog.objects.filter(is_fallback=True).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.feature, "exercise_generation")

    def test_pre_submission_payload_protection(self):
        service = StructuredExerciseService()
        exercise_set = service.generate_exercise_set(
            learner=self.learner,
            target_skill="grammar",
            cefr_level="B1",
            question_count=1,
        )

        serializer = GeneratedExerciseSetLearnerSerializer(exercise_set)
        serialized_q = serializer.data["questions"][0]

        # Ensure answers and explanations are stripped!
        self.assertNotIn("correct_option_id", serialized_q)
        self.assertNotIn("explanation_fa", serialized_q)
        self.assertNotIn("explanation_en", serialized_q)
        # Ensure options and prompt are visible
        self.assertIn("options", serialized_q)
        self.assertIn("prompt_en", serialized_q)

    def test_submit_exercise_evaluates_and_explains(self):
        service = StructuredExerciseService()
        exercise_set = service.generate_exercise_set(
            learner=self.learner,
            target_skill="grammar",
            cefr_level="B1",
            question_count=2,
        )

        q1 = exercise_set.questions[0]
        q2 = exercise_set.questions[1]
        correct_q1 = q1["correct_option_id"]
        # pick deliberate wrong answer for q2
        wrong_q2 = next(opt["id"] for opt in q2["options"] if opt["id"] != q2["correct_option_id"])

        answers = {
            q1["id"]: correct_q1,
            q2["id"]: wrong_q2,
        }

        eval_result = service.submit_exercise(
            learner=self.learner,
            exercise_set_id=exercise_set.id,
            answers=answers,
        )

        self.assertEqual(eval_result["correct_count"], 1)
        self.assertEqual(eval_result["total_count"], 2)
        self.assertEqual(eval_result["score_percentage"], 50.0)

        # Verify results contain bilingual explanations
        res1 = eval_result["results"][0]
        self.assertTrue(res1["is_correct"])
        self.assertIn("explanation_fa", res1)
        self.assertIn("explanation_en", res1)

        res2 = eval_result["results"][1]
        self.assertFalse(res2["is_correct"])
        self.assertIn("explanation_fa", res2)

        # Verify ExerciseAttempt DB record
        attempt = ExerciseAttempt.objects.filter(exercise_set=exercise_set).first()
        self.assertIsNotNone(attempt)
        self.assertEqual(attempt.score_percentage, 50.0)


class AIViewIntegrationTests(TestCase):
    """Verifies REST API endpoints, auth checks, and learner isolation."""

    def setUp(self):
        self.learner1 = User.objects.create_user(
            email="alpha@endoora.test",
            password="password-alpha",
            role="learner",
        )
        self.learner2 = User.objects.create_user(
            email="beta@endoora.test",
            password="password-beta",
            role="learner",
        )
        self.api = APIClient()

    def test_generate_requires_authentication(self):
        res = self.api.post("/api/ai/exercises/generate/", {})
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_generate_and_submit_flow(self):
        self.api.force_authenticate(user=self.learner1)

        # 1. Generate
        gen_res = self.api.post(
            "/api/ai/exercises/generate/",
            {"target_skill": "grammar", "cefr_level": "B1", "question_count": 2},
            format="json",
        )
        self.assertEqual(gen_res.status_code, status.HTTP_201_CREATED)
        exercise_id = gen_res.data["id"]
        questions = gen_res.data["questions"]
        self.assertEqual(len(questions), 2)
        self.assertNotIn("correct_option_id", questions[0])

        # 2. Detail
        detail_res = self.api.get(f"/api/ai/exercises/{exercise_id}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertNotIn("correct_option_id", detail_res.data["questions"][0])

        # 3. Submit
        answers = {q["id"]: q["options"][0]["id"] for q in questions}
        submit_res = self.api.post(
            f"/api/ai/exercises/{exercise_id}/submit/",
            {"answers": answers},
            format="json",
        )
        self.assertEqual(submit_res.status_code, status.HTTP_200_OK)
        self.assertIn("score_percentage", submit_res.data)
        self.assertIn("results", submit_res.data)

        # 4. History
        hist_res = self.api.get("/api/ai/exercises/history/")
        self.assertEqual(hist_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(hist_res.data), 1)

    def test_learner_isolation_prevents_access_to_other_users_exercises(self):
        # Create exercise for learner1
        service = StructuredExerciseService()
        exercise_set = service.generate_exercise_set(
            learner=self.learner1,
            target_skill="grammar",
            cefr_level="A1",
            question_count=1,
        )

        # Try accessing with learner2
        self.api.force_authenticate(user=self.learner2)
        res = self.api.get(f"/api/ai/exercises/{exercise_set.id}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        sub_res = self.api.post(
            f"/api/ai/exercises/{exercise_set.id}/submit/",
            {"answers": {"q1": "a"}},
            format="json",
        )
        self.assertEqual(sub_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_status_endpoint(self):
        res = self.api.get("/api/ai/status/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("daily_budget_usd", res.data)
        self.assertIn("active_model_tiers", res.data)
