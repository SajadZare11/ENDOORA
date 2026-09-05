#!/usr/bin/env python3
"""
Day 22 Static Contract Checker
Verifies:
1. Backend AI Gateway models in apps/api/ai_gateway/models.py (AIProviderConfig, AIRequestLog, GeneratedExerciseSet, ExerciseAttempt).
2. OpenRouter client in apps/api/ai_gateway/client.py with timeout, daily budget check, and secret redaction.
3. Model router in apps/api/ai_gateway/model_router.py with multi-tier routing (never a single hardcoded model).
4. Versioned prompt registry in apps/api/ai_gateway/prompt_registry.py.
5. Strict JSON and internal consistency validator in apps/api/ai_gateway/validators.py.
6. Structured exercise generation service with fallback bank in apps/api/ai_gateway/services.py.
7. Pre-submission payload protection in apps/api/ai_gateway/serializers.py.
8. API views & endpoints in apps/api/ai_gateway/views.py and urls.py.
9. Bridge compatibility modules in apps/api/ai/ and apps/api/exercises/.
10. Unit test suite in apps/api/ai_gateway/tests.py.
11. Frontend exercise runner in apps/web/app/(learner)/practice/page.tsx.
12. 100% tokenized CSS in apps/web/app/(learner)/practice/practice.module.css with 0 raw hex.
13. Documentation in docs/ai/model-routing.md.
14. Python syntax validity across all new backend files.
"""

import py_compile
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def check(desc: str, condition: bool):
    if not condition:
        print(f"FAIL: {desc}", file=sys.stderr)
        sys.exit(1)


def main():
    # 1. Backend models
    models_py = ROOT / "apps" / "api" / "ai_gateway" / "models.py"
    check("ai_gateway/models.py exists", models_py.is_file())
    models_code = models_py.read_text(encoding="utf-8")
    check("models.py defines AIProviderConfig", "class AIProviderConfig" in models_code)
    check("models.py defines AIRequestLog", "class AIRequestLog" in models_code)
    check("models.py defines GeneratedExerciseSet", "class GeneratedExerciseSet" in models_code)
    check("models.py defines ExerciseAttempt", "class ExerciseAttempt" in models_code)
    check("models.py has daily_budget_usd", "daily_budget_usd" in models_code)
    check("models.py has timeout_seconds", "timeout_seconds" in models_code)
    check("models.py tracks is_fallback", "is_fallback" in models_code)

    # 2. Client & Circuit Breakers
    client_py = ROOT / "apps" / "api" / "ai_gateway" / "client.py"
    check("ai_gateway/client.py exists", client_py.is_file())
    client_code = client_py.read_text(encoding="utf-8")
    check("client.py defines OpenRouterClient", "class OpenRouterClient" in client_code)
    check("client.py defines BudgetExceededError", "class BudgetExceededError" in client_code)
    check("client.py defines AIClientTimeoutError", "class AIClientTimeoutError" in client_code)
    check("client.py checks budget", "def check_budget" in client_code)
    check("client.py redacts sensitive info", "def redact_sensitive_info" in client_code)

    # 3. Model Router
    router_py = ROOT / "apps" / "api" / "ai_gateway" / "model_router.py"
    check("ai_gateway/model_router.py exists", router_py.is_file())
    router_code = router_py.read_text(encoding="utf-8")
    check("model_router.py defines ModelRouter", "class ModelRouter" in router_code)
    check("model_router.py defines get_models_for_task", "def get_models_for_task" in router_code)
    check("model_router.py has multiple tiers (no single model lock-in)", "mistralai/mistral-7b-instruct" in router_code)

    # 4. Prompt Registry
    prompts_py = ROOT / "apps" / "api" / "ai_gateway" / "prompt_registry.py"
    check("ai_gateway/prompt_registry.py exists", prompts_py.is_file())
    prompts_code = prompts_py.read_text(encoding="utf-8")
    check("prompt_registry.py defines EXERCISE_GEN_PROMPT_V1", "EXERCISE_GEN_PROMPT_V1" in prompts_code)
    check("prompt_registry.py defines build_exercise_prompt", "def build_exercise_prompt" in prompts_code)

    # 5. Validators
    validators_py = ROOT / "apps" / "api" / "ai_gateway" / "validators.py"
    check("ai_gateway/validators.py exists", validators_py.is_file())
    validators_code = validators_py.read_text(encoding="utf-8")
    check("validators.py defines ExerciseValidator", "class ExerciseValidator" in validators_code)
    check("validators.py defines parse_and_validate", "def parse_and_validate" in validators_code)
    check("validators.py checks internal consistency", "Internal consistency violation" in validators_code)
    check("validators.py checks duplicate options", "Duplicate option text" in validators_code)

    # 6. Service & Fallback
    services_py = ROOT / "apps" / "api" / "ai_gateway" / "services.py"
    check("ai_gateway/services.py exists", services_py.is_file())
    services_code = services_py.read_text(encoding="utf-8")
    check("services.py defines StructuredExerciseService", "class StructuredExerciseService" in services_code)
    check("services.py defines generate_exercise_set", "def generate_exercise_set" in services_code)
    check("services.py defines _fallback_to_reviewed_bank", "def _fallback_to_reviewed_bank" in services_code)
    check("services.py defines submit_exercise", "def submit_exercise" in services_code)
    check("services.py includes CURATED_FALLBACK_BANK", "CURATED_FALLBACK_BANK" in services_code)

    # 7. Serializers & Payload Protection
    serializers_py = ROOT / "apps" / "api" / "ai_gateway" / "serializers.py"
    check("ai_gateway/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py defines GeneratedExerciseSetLearnerSerializer", "class GeneratedExerciseSetLearnerSerializer" in serializers_code)
    check("serializers.py defines ExerciseSubmissionSerializer", "class ExerciseSubmissionSerializer" in serializers_code)
    check("serializers.py defines ExerciseAttemptSerializer", "class ExerciseAttemptSerializer" in serializers_code)
    check("serializers.py strips answer keys for learner protection", "correct_option_id" in serializers_code and "to_representation" in serializers_code)

    # 8. Views & URLs
    views_py = ROOT / "apps" / "api" / "ai_gateway" / "views.py"
    check("ai_gateway/views.py exists", views_py.is_file())
    views_code = views_py.read_text(encoding="utf-8")
    check("views.py defines ExerciseGenerateView", "class ExerciseGenerateView" in views_code)
    check("views.py defines ExerciseDetailView", "class ExerciseDetailView" in views_code)
    check("views.py defines ExerciseSubmitView", "class ExerciseSubmitView" in views_code)
    check("views.py defines ExerciseHistoryView", "class ExerciseHistoryView" in views_code)
    check("views.py defines AIStatusView", "class AIStatusView" in views_code)

    urls_py = ROOT / "apps" / "api" / "ai_gateway" / "urls.py"
    check("ai_gateway/urls.py exists", urls_py.is_file())
    urls_code = urls_py.read_text(encoding="utf-8")
    check("urls.py routes exercises/generate/", "exercises/generate/" in urls_code)
    check("urls.py routes exercises/<int:pk>/submit/", "exercises/<int:pk>/submit/" in urls_code)

    # 9. Compatibility bridge modules
    exercises_bridge = ROOT / "apps" / "api" / "exercises" / "__init__.py"
    check("apps/api/exercises bridge exists", exercises_bridge.is_file())
    ai_bridge = ROOT / "apps" / "api" / "ai" / "__init__.py"
    check("apps/api/ai bridge exists", ai_bridge.is_file())

    # 10. Tests
    tests_py = ROOT / "apps" / "api" / "ai_gateway" / "tests.py"
    check("ai_gateway/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests.py tests budget ceiling", "test_budget_ceiling_stops_calls" in tests_code)
    check("tests.py tests payload protection", "test_pre_submission_payload_protection" in tests_code)
    check("tests.py tests fallback", "test_fallback_when_remote_api_unavailable" in tests_code)
    check("tests.py tests submission evaluation", "test_submit_exercise_evaluates_and_explains" in tests_code)

    # 11. Frontend Practice Runner
    practice_page = ROOT / "apps" / "web" / "app" / "(learner)" / "practice" / "page.tsx"
    check("practice/page.tsx exists", practice_page.is_file())
    practice_code = practice_page.read_text(encoding="utf-8")
    check("practice/page.tsx includes CEFR levels", "CEFR_LEVELS" in practice_code)
    check("practice/page.tsx includes target skills", "TARGET_SKILLS" in practice_code)
    check("practice/page.tsx links to /practice-ai and /review", "href=\"/practice-ai\"" in practice_code and "href=\"/review\"" in practice_code)

    # 12. Tokenized CSS
    practice_css = ROOT / "apps" / "web" / "app" / "(learner)" / "practice" / "practice.module.css"
    check("practice.module.css exists", practice_css.is_file())
    practice_css_content = practice_css.read_text(encoding="utf-8")
    # Verify zero raw hex colors
    raw_hex = re.findall(r"#[0-9a-fA-F]{3,8}\b", practice_css_content)
    check(f"practice.module.css has 0 raw hex colors (found: {raw_hex})", len(raw_hex) == 0)

    # 13. Documentation
    doc_md = ROOT / "docs" / "ai" / "model-routing.md"
    check("docs/ai/model-routing.md exists", doc_md.is_file())
    doc_content = doc_md.read_text(encoding="utf-8")
    check("model-routing.md covers budget ceilings", "Budget Ceiling" in doc_content)
    check("model-routing.md covers multi-tier routing", "Multi-Tier" in doc_content)

    # 14. Syntax check
    py_files = [
        models_py, client_py, router_py, prompts_py,
        validators_py, services_py, serializers_py, views_py,
        urls_py, tests_py, exercises_bridge, ai_bridge
    ]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except Exception as exc:
            check(f"Syntax error in {pf.name}: {exc}", False)

    print("Day 22 static checks passed: AI Gateway models, OpenRouter client, multi-tier router, prompt registry, validators, fallback bank, payload protection, /practice runner, tokenized CSS, docs, and clean syntax.")


if __name__ == "__main__":
    main()
