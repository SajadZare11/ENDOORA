from __future__ import annotations

import py_compile
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    raise SystemExit(f"Day 14 static check FAILED: {message}")


def need(relative: str, *markers: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        fail(f"missing {relative}")
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            fail(f"{relative} missing marker: {marker}")
    return text


def main() -> None:
    # 1. Base settings and URL wiring
    need("apps/api/endoora_api/settings/base.py", '"placement"')
    need("apps/api/endoora_api/urls.py", '"api/placement/"', 'include("placement.urls")')

    # 2. Placement models
    models = need(
        "apps/api/placement/models.py",
        "class PlacementSession(models.Model):",
        "class PlacementAnswer(models.Model):",
        "idempotency_key",
        "question_key",
        "question_version",
        "answer_value",
        "expires_at",
        "is_expired",
        "is_active",
        "check_expiration",
        "get_or_create_active_session",
        "unique_together",
    )
    for marker in ('ACTIVE = "active"', 'SUBMITTED = "submitted"', 'EXPIRED = "expired"'):
        if marker not in models:
            fail(f"PlacementSession missing status: {marker}")

    # 3. Serializers & security anti-leak boundaries
    serializers = need(
        "apps/api/placement/serializers.py",
        "class PlacementSessionSerializer",
        "class PlacementAnswerSerializer",
        "class PlacementAnswerCreateSerializer",
        "class PlacementQuestionItemSerializer",
    )
    q_item_block = serializers.split("class PlacementQuestionItemSerializer", 1)[1]
    for forbidden in (
        '"answer_key"',
        '"accepted_variants"',
        '"rubric"',
        '"correct_option"',
        '"solution"',
        '"explanation"',
    ):
        if forbidden in q_item_block:
            fail(f"PlacementQuestionItemSerializer exposes forbidden key: {forbidden}")

    # 4. Views & user ownership enforcement
    need(
        "apps/api/placement/views.py",
        "permissions.IsAuthenticated",
        "PlacementSessionListCreateView",
        "PlacementCurrentSessionView",
        "PlacementSessionDetailView",
        "PlacementAnswerSaveView",
        "PlacementSectionAdvanceView",
        "PlacementSessionSubmitView",
        "PlacementQuestionsView",
        "user=request.user",
        "idempotency_key",
        "Status.SUBMITTED",
        "Status.EXPIRED",
    )

    # 5. URLs
    need(
        "apps/api/placement/urls.py",
        'path("sessions/",',
        'path("sessions/current/",',
        'path("sessions/<uuid:session_pk>/answers/",',
        'path("sessions/<uuid:session_pk>/advance/",',
        'path("sessions/<uuid:session_pk>/submit/",',
        'path("questions/",',
    )

    # 6. Admin
    need(
        "apps/api/placement/admin.py",
        "class PlacementSessionAdmin",
        "class PlacementAnswerAdmin",
        "answers_count_display",
        "has_delete_permission",
    )

    # 7. Unit test suite
    tests = need(
        "apps/api/placement/tests.py",
        "class PlacementSessionEngineTests",
        "test_anonymous_access_rejected",
        "test_start_placement_session",
        "test_resume_existing_active_session",
        "test_current_session_endpoint",
        "test_user_isolation_cannot_access_other_user_session",
        "test_user_isolation_cannot_submit_answer_to_other_user_session",
        "test_idempotent_answer_save_with_idempotency_key",
        "test_answer_update_for_same_question",
        "test_expired_session_cannot_save_answer",
        "test_expired_session_cannot_submit",
        "test_section_advance",
        "test_session_submission_and_subsequent_mutation_blocked",
        "test_safe_questions_endpoint_strips_answer_keys",
    )
    test_count = len(re.findall(r"def (test_[a-zA-Z0-9_]+)", tests))
    if test_count < 12:
        fail(f"Placement unit test suite must have at least 12 tests, found {test_count}")

    # 8. Frontend PlacementRunner and styling
    runner = need(
        "apps/web/components/placement/PlacementRunner.tsx",
        'useState<Locale>(',
        'dir={locale === "fa" ? "rtl" : "ltr"}',
        'dir="ltr"',
        'فارسی',
        'English',
        '"/api/placement/sessions/"',
        '"/api/placement/questions/"',
        'generateIdempotencyKey',
    )
    if "window.alert" in runner:
        fail("PlacementRunner must not use window.alert")

    # 9. Stylesheet tokens and absence of raw hex colors
    for css_rel in [
        "apps/web/components/placement/placement.module.css",
        "apps/web/app/(learner)/placement/placement.module.css",
    ]:
        css_text = need(css_rel, "var(--color-surface)", "unicode-bidi: isolate", "@media (max-width: 36rem)")
        hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_text)
        if hex_matches:
            fail(f"{css_rel} contains raw hex colors: {hex_matches}")

    # 10. Acceptance Gate
    need(
        "docs/operations/DAY_14_ACCEPTANCE_GATE.md",
        "- [x] Day 13 is committed/pushed.",
        "- [x] `PlacementSession` and `PlacementAnswer` models exist.",
        "- [x] Idempotency keys prevent duplicate answer rows",
        "- [x] Expired sessions cannot accept new answers or section changes.",
        "- [x] Another user cannot access or submit to a session",
        "- [x] Pre-submission question payload contains no answer keys",
    )

    # 11. Python compilation check
    py_files = [
        "apps/api/placement/models.py",
        "apps/api/placement/serializers.py",
        "apps/api/placement/views.py",
        "apps/api/placement/urls.py",
        "apps/api/placement/admin.py",
        "apps/api/placement/tests.py",
    ]
    for rel in py_files:
        py_compile.compile(str(ROOT / rel), doraise=True)

    print(
        "Day 14 static checks passed: placement session models, idempotency, user isolation, "
        "expiration logic, safe serializers, admin safety, unit test suite, "
        "Persian-first runner, English LTR isolation, tokenized CSS, and Python syntax."
    )


if __name__ == "__main__":
    main()
