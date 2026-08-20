from __future__ import annotations

import json
import py_compile
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    raise SystemExit(f"Day 13 static check FAILED: {message}")


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
    settings = need("apps/api/endoora_api/settings/base.py", '"taxonomy"', '"questions"')
    if settings.index('"questions"') < settings.index('"taxonomy"'):
        fail("questions must be wired after taxonomy")

    need("apps/api/endoora_api/urls.py", 'path("api/questions/", include("questions.urls"))')
    models = need(
        "apps/api/questions/models.py",
        "class Question(models.Model):",
        "class QuestionVersion(models.Model):",
        "class QuestionObjective(models.Model):",
        "class QuestionMedia(models.Model):",
        "class QuestionReview(models.Model):",
        "Published/retired question versions are immutable",
        "Use the controlled publish/retire workflow",
        "TaxonomyNode.Kind.OBJECTIVE",
    )
    for marker in (
        'MCQ = "mcq"', 'MULTI_SELECT = "multi_select"', 'GAP = "gap"',
        'MATCHING = "matching"', 'ORDERING = "ordering"',
        'SHORT_ANSWER = "short_answer"', 'LONG_WRITING = "long_writing"',
        'AUDIO = "audio"', 'SPEAKING = "speaking"',
    ):
        if marker not in models:
            fail(f"missing question type {marker}")

    serializers = need(
        "apps/api/questions/serializers.py",
        "class QuestionVersionLearnerSerializer",
        "class QuestionVersionEditorSerializer",
    )
    learner = serializers.split("class QuestionVersionLearnerSerializer", 1)[1].split(
        "class QuestionVersionEditorSerializer", 1
    )[0]
    for forbidden in (
        '"answer_key"', '"accepted_variants"', '"rubric"',
        '"explanation_fa"', '"explanation_en"',
    ):
        if forbidden in learner:
            fail(f"learner serializer exposes {forbidden}")

    need("apps/api/questions/permissions.py", '{"editor", "administrator"}', "is_superuser")
    views = need(
        "apps/api/questions/views.py",
        "permissions.IsAuthenticated",
        "IsQuestionEditorOrAdministrator",
        "EditorPublishView",
        "EditorRetireView",
        'if mode in {"teacher", "editor"}',
    )
    list_block = views.split("class PublishedQuestionListView", 1)[1].split(
        "class PublishedQuestionDetailView", 1
    )[0]
    if "IsQuestionEditorOrAdministrator" not in list_block:
        fail("published-bank enumeration must remain editor/administrator-only")
    detail_block = views.split("class PublishedQuestionDetailView", 1)[1].split(
        "class CheckAnswerView", 1
    )[0]
    if "permissions.IsAuthenticated" not in detail_block:
        fail("known learner-safe question preview must require authentication")
    need(
        "apps/api/questions/services.py",
        "status=QuestionVersion.Status.DRAFT",
        "Create a new immutable version number instead of overwriting it",
    )
    need(
        "apps/api/questions/migrations/0001_initial.py",
        '("taxonomy", "0001_initial")',
        "migrations.swappable_dependency(settings.AUTH_USER_MODEL)",
    )

    python_files = [
        "apps/api/questions/apps.py",
        "apps/api/questions/models.py",
        "apps/api/questions/permissions.py",
        "apps/api/questions/normalization.py",
        "apps/api/questions/grading.py",
        "apps/api/questions/serializers.py",
        "apps/api/questions/services.py",
        "apps/api/questions/views.py",
        "apps/api/questions/urls.py",
        "apps/api/questions/admin.py",
        "apps/api/questions/tests.py",
        "apps/api/questions/management/commands/import_questions.py",
        "apps/api/questions/management/commands/export_questions.py",
        "apps/api/questions/migrations/0001_initial.py",
    ]
    for relative in python_files:
        try:
            py_compile.compile(str(ROOT / relative), doraise=True)
        except py_compile.PyCompileError as exc:
            fail(f"Python syntax error in {relative}: {exc}")

    try:
        schema = json.loads((ROOT / "data/question-schema.json").read_text(encoding="utf-8"))
        sample = json.loads(
            (ROOT / "data/questions/endoora_day13_samples.v1.json").read_text(encoding="utf-8")
        )
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON: {exc}")

    if schema.get("title") != "Endoora Day 13 Question Bank Import":
        fail("question schema title mismatch")
    if len(sample.get("items", [])) != 2:
        fail("sample dataset must contain two original questions")
    if any(item.get("source", {}).get("license_type") != "original" for item in sample["items"]):
        fail("sample content must be Endoora-owned original")

    frontend = need(
        "apps/web/app/(admin)/content/questions/QuestionBankPreview.tsx",
        'useState<Locale>("fa")',
        'dir={locale === "fa" ? "rtl" : "ltr"}',
        'dir="ltr"',
        "فارسی",
        "English",
        "/api/questions/published/",
    )
    if "answer_key" in frontend or "accepted_variants" in frontend:
        fail("frontend preview mentions protected answer fields as data")

    css = need(
        "apps/web/app/(admin)/content/questions/question-bank.module.css",
        "var(--color-surface)",
        "unicode-bidi: isolate",
        "@media (max-width: 36rem)",
    )
    if re.search(r"#[0-9a-fA-F]{3,8}\b", css):
        fail("Day 13 CSS must use design tokens, not raw hex colors")

    need(
        "docs/content/question-bank-governance.md",
        "Persian-first product rule",
        "Never edit a published version in place.",
        "QuestionVersion.id",
    )

    print(
        "Day 13 static checks passed: question types, immutable versions, copyright/review metadata, "
        "taxonomy links, safe serializers, role permissions, draft-only import, Persian-first preview, "
        "English LTR isolation, migration dependency, JSON validity, and Python syntax."
    )


if __name__ == "__main__":
    main()
