#!/usr/bin/env python3
"""
Day 24 Static Contract Checker
Verifies:
1. Backend Writing Mentor models in apps/api/writing_mentor/models.py (WritingDraft, WritingAnalysis).
2. Service logic in apps/api/writing_mentor/services.py (drafts, revisions, analysis, rubric, graduated rewrites, Mistake Genome sync).
3. API views and serializers in apps/api/writing_mentor/views.py and serializers.py.
4. URLs routed in apps/api/writing_mentor/urls.py and endoora_api/urls.py.
5. Backward-compatibility bridge in apps/api/writing/.
6. Unit tests in apps/api/writing_mentor/tests.py covering traps and rubric requirements.
7. Frontend workbench in apps/web/app/(learner)/writing/page.tsx.
8. 100% tokenized CSS in apps/web/app/(learner)/writing/writing.module.css with 0 raw hex.
9. Documentation in docs/ai/writing-rubric.md and docs/learning/writing-mentor.md.
10. Python syntax validity across all writing_mentor files.
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
    models_py = ROOT / "apps" / "api" / "writing_mentor" / "models.py"
    check("writing_mentor/models.py exists", models_py.is_file())
    models_code = models_py.read_text(encoding="utf-8")
    check("models.py defines WritingDraft", "class WritingDraft" in models_code)
    check("models.py defines WritingAnalysis", "class WritingAnalysis" in models_code)
    check("WritingDraft has word_count", "word_count" in models_code)
    check("WritingDraft has version", "version" in models_code)
    check("WritingDraft has parent_draft", "parent_draft" in models_code)
    check("WritingAnalysis has estimated_cefr_range", "estimated_cefr_range" in models_code)
    check("WritingAnalysis has ielts_scores", "ielts_scores" in models_code)
    check("WritingAnalysis has error_annotations", "error_annotations" in models_code)
    check("WritingAnalysis has graduated_rewrites", "graduated_rewrites" in models_code)
    check("WritingAnalysis has revision_tasks", "revision_tasks" in models_code)
    check("WritingAnalysis has Rule #8 disclaimer", "disclaimer_fa" in models_code and "disclaimer_en" in models_code)

    # 2. Services
    services_py = ROOT / "apps" / "api" / "writing_mentor" / "services.py"
    check("writing_mentor/services.py exists", services_py.is_file())
    services_code = services_py.read_text(encoding="utf-8")
    check("services.py defines WritingMentorService", "class WritingMentorService" in services_code)
    check("services.py provides prompt presets", "def get_prompts" in services_code)
    check("services.py saves drafts", "def save_draft" in services_code)
    check("services.py creates revisions", "def create_revision" in services_code)
    check("services.py analyzes writing", "def analyze_writing" in services_code)
    check("services.py provides A2/B2/C2 rewrites", ("'a2'" in services_code or '"a2"' in services_code) and ("'b2'" in services_code or '"b2"' in services_code) and ("'c2'" in services_code or '"c2"' in services_code))
    check("services.py includes voice preservation disclaimer", "Not a replacement for your voice" in services_code)
    check("services.py accepts corrections with Genome sync", "def accept_correction" in services_code and "MistakeGenomeService" in services_code)
    check("services.py dismisses corrections without Genome sync", "def dismiss_correction" in services_code)

    # 3. Serializers & Views
    serializers_py = ROOT / "apps" / "api" / "writing_mentor" / "serializers.py"
    check("writing_mentor/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py defines WritingDraftSerializer", "class WritingDraftSerializer" in serializers_code)
    check("serializers.py defines WritingAnalysisSerializer", "class WritingAnalysisSerializer" in serializers_code)

    views_py = ROOT / "apps" / "api" / "writing_mentor" / "views.py"
    check("writing_mentor/views.py exists", views_py.is_file())
    views_code = views_py.read_text(encoding="utf-8")
    check("views.py defines PromptListView", "class PromptListView" in views_code)
    check("views.py defines DraftListCreateView", "class DraftListCreateView" in views_code)
    check("views.py defines DraftAnalyzeView", "class DraftAnalyzeView" in views_code)
    check("views.py defines AcceptCorrectionView", "class AcceptCorrectionView" in views_code)
    check("views.py defines DismissCorrectionView", "class DismissCorrectionView" in views_code)

    # 4. URLs
    urls_py = ROOT / "apps" / "api" / "writing_mentor" / "urls.py"
    check("writing_mentor/urls.py exists", urls_py.is_file())
    urls_code = urls_py.read_text(encoding="utf-8")
    check("urls.py routes prompts", "prompts/" in urls_code)
    check("urls.py routes drafts", "drafts/" in urls_code)
    check("urls.py routes analyze", "analyze/" in urls_code)

    root_urls_py = ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    root_urls_code = root_urls_py.read_text(encoding="utf-8")
    check("root urls.py routes api/writing/", "api/writing/" in root_urls_code)

    # 5. Bridge modules
    bridge_dir = ROOT / "apps" / "api" / "writing"
    check("writing bridge directory exists", bridge_dir.is_dir())
    check("writing bridge __init__.py exists", (bridge_dir / "__init__.py").is_file())
    check("writing bridge models.py exists", (bridge_dir / "models.py").is_file())
    check("writing bridge services.py exists", (bridge_dir / "services.py").is_file())

    # 6. Unit tests
    tests_py = ROOT / "apps" / "api" / "writing_mentor" / "tests.py"
    check("writing_mentor/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests cover prompt library", "test_prompt_library" in tests_code)
    check("tests cover draft autosave", "test_draft_creation_and_autosave" in tests_code)
    check("tests cover revision chaining", "test_revision_chaining" in tests_code)
    check("tests cover score ranges and disclaimer", "test_writing_analysis_score_ranges_and_disclaimer" in tests_code)
    check("tests cover grammar vs style separation", "test_error_annotation_grammar_vs_style_separation" in tests_code)
    check("tests cover graduated rewrites", "test_graduated_rewrites_labels_and_disclaimer" in tests_code)
    check("tests cover selective Genome ingestion", "test_selective_mistake_genome_ingestion_on_accept" in tests_code)
    check("tests cover dismissal protection", "test_dismiss_correction_does_not_pollute_mistake_genome" in tests_code)
    check("tests cover user isolation", "test_user_isolation" in tests_code)

    # 7. Frontend page
    page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "writing" / "page.tsx"
    check("writing/page.tsx exists", page_tsx.is_file())
    page_code = page_tsx.read_text(encoding="utf-8")
    check("page.tsx defines WritingMentorPage", "WritingMentorPage" in page_code or "export default function" in page_code)
    check("page.tsx has IELTS mode toggle", "ielts" in page_code)
    check("page.tsx has stopwatch/timer", "formatTime" in page_code or "timerWidget" in page_code)
    check("page.tsx has submit confirmation", "showConfirmModal" in page_code)
    check("page.tsx has IELTS rubric breakdown", "rubricGrid" in page_code or "task_achievement" in page_code)
    check("page.tsx has graduated rewrites", "graduated_rewrites" in page_code)
    check("page.tsx has accept correction action", "handleAcceptCorrection" in page_code)
    check("page.tsx has revision tasks checklist", "revision_tasks" in page_code)
    check("page.tsx has Rule #8 disclaimer", "disclaimer" in page_code)

    # 8. Tokenized CSS
    css_file = ROOT / "apps" / "web" / "app" / "(learner)" / "writing" / "writing.module.css"
    check("writing.module.css exists", css_file.is_file())
    css_content = css_file.read_text(encoding="utf-8")
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(f"writing.module.css has 0 raw hex colors (found {hex_matches})", len(hex_matches) == 0)

    # 9. Documentation
    rubric_doc = ROOT / "docs" / "ai" / "writing-rubric.md"
    check("docs/ai/writing-rubric.md exists", rubric_doc.is_file())
    rubric_text = rubric_doc.read_text(encoding="utf-8")
    check("rubric doc details 4 IELTS criteria", "Task Achievement" in rubric_text and "Grammatical Range" in rubric_text)
    check("rubric doc details Rule #8 policy", "Rule #8" in rubric_text)
    check("rubric doc details voice preservation", "Learner Voice Preservation" in rubric_text)

    # 10. Python syntax compilation
    py_files = [
        models_py,
        services_py,
        serializers_py,
        views_py,
        urls_py,
        tests_py,
        bridge_dir / "models.py",
        bridge_dir / "services.py",
        bridge_dir / "serializers.py",
        bridge_dir / "views.py",
        bridge_dir / "urls.py",
    ]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except py_compile.PyCompileError as e:
            check(f"Syntax error in {pf}: {e}", False)

    print("Day 24 static checks passed: Writing Mentor models, drafts, revisions, IELTS rubric, graduated rewrites, Mistake Genome sync, /writing workbench, tokenized CSS, docs, and clean syntax.")


if __name__ == "__main__":
    main()
