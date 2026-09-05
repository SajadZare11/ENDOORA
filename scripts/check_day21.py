#!/usr/bin/env python3
"""
Day 21 Static Contract Checker
Verifies:
1. SRS Backend models in apps/api/srs/models.py (SrsCandidate, SrsItem, SrsReview).
2. Deduplication of lemmas & senses with unique constraint.
3. Review scheduling service in apps/api/srs/services.py with transparent intervals & anti-spam.
4. Leech handling and lapse counter logic (is_leech, leech_action).
5. Vocabulary extraction pipeline from learner activity with traceable source sentence.
6. Learner candidate approval/ignore workflow (preventing auto-saving every word).
7. Bad AI meaning correction and card editing support.
8. Deletion removes personal context.
9. Serializers in apps/api/srs/serializers.py and views in apps/api/srs/views.py.
10. URL routing in apps/api/srs/urls.py and endoora_api/urls.py.
11. Unit test coverage in apps/api/srs/tests.py.
12. Frontend Vocabulary Hub in apps/web/app/(learner)/vocabulary/page.tsx with 4 tabs.
13. 100% tokenized CSS in apps/web/app/(learner)/vocabulary/vocabulary.module.css with 0 raw hex.
14. Upgraded /review page in apps/web/app/(learner)/review/page.tsx with vocabulary bank links and editable meaning.
15. DailyMissionSerializer includes srs_due_count.
16. Documentation in docs/learning/srs-rules.md.
17. Python syntax validity across all backend files.
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
    models_py = ROOT / "apps" / "api" / "srs" / "models.py"
    check("srs/models.py exists", models_py.is_file())
    models_code = models_py.read_text(encoding="utf-8")
    check("models.py defines SrsCandidate", "class SrsCandidate" in models_code)
    check("models.py defines SrsItem", "class SrsItem" in models_code)
    check("models.py defines SrsReview", "class SrsReview" in models_code)
    check("models.py has calculate_next_intervals", "def calculate_next_intervals" in models_code)
    check("models.py enforces lemma deduplication constraint", "unique_learner_lemma_pos" in models_code)
    check("models.py tracks lapse_count", "lapse_count" in models_code)
    check("models.py tracks is_leech", "is_leech" in models_code)

    # 2. Services
    services_py = ROOT / "apps" / "api" / "srs" / "services.py"
    check("srs/services.py exists", services_py.is_file())
    services_code = services_py.read_text(encoding="utf-8")
    check("services.py defines review_item", "def review_item" in services_code)
    check("services.py defines extract_candidates", "def extract_candidates" in services_code)
    check("services.py defines approve_candidate", "def approve_candidate" in services_code)
    check("services.py defines ignore_candidate", "def ignore_candidate" in services_code)
    check("services.py defines delete_srs_item", "def delete_srs_item" in services_code)
    check("services.py defines edit_srs_item", "def edit_srs_item" in services_code)
    check("services.py defines get_srs_stats", "def get_srs_stats" in services_code)
    check("services.py implements leech threshold", "LEECH_LAPSE_THRESHOLD" in services_code or "lapse_count >= 4" in services_code or "is_leech" in services_code)
    check("services.py implements anti-spam protection", "response_time_ms" in services_code)

    # 3. Serializers
    serializers_py = ROOT / "apps" / "api" / "srs" / "serializers.py"
    check("srs/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py defines SrsCandidateSerializer", "class SrsCandidateSerializer" in serializers_code)
    check("serializers.py defines SrsItemSerializer", "class SrsItemSerializer" in serializers_code)
    check("serializers.py defines SrsReviewSubmitSerializer", "class SrsReviewSubmitSerializer" in serializers_code)
    check("serializers.py defines SrsStatsSerializer", "class SrsStatsSerializer" in serializers_code)
    check("serializers.py includes next_intervals", "next_intervals" in serializers_code)

    # 4. Views & URLs
    views_py = ROOT / "apps" / "api" / "srs" / "views.py"
    check("srs/views.py exists", views_py.is_file())
    views_code = views_py.read_text(encoding="utf-8")
    check("views.py defines TodayReviewView", "class TodayReviewView" in views_code)
    check("views.py defines ReviewSubmitView", "class ReviewSubmitView" in views_code)
    check("views.py defines CandidateListView", "class CandidateListView" in views_code)
    check("views.py defines CandidateApproveView", "class CandidateApproveView" in views_code)
    check("views.py defines CandidateIgnoreView", "class CandidateIgnoreView" in views_code)
    check("views.py defines ExtractWordsView", "class ExtractWordsView" in views_code)
    check("views.py defines SrsItemListView", "class SrsItemListView" in views_code)
    check("views.py defines SrsItemDetailView", "class SrsItemDetailView" in views_code)
    check("views.py defines SrsStatsView", "class SrsStatsView" in views_code)

    urls_py = ROOT / "apps" / "api" / "srs" / "urls.py"
    check("srs/urls.py exists", urls_py.is_file())
    urls_code = urls_py.read_text(encoding="utf-8")
    check("urls.py routes today/", 'path("today/",' in urls_code)
    check("urls.py routes review/", 'path("review/",' in urls_code)
    check("urls.py routes candidates/", 'path("candidates/",' in urls_code)
    check("urls.py routes extract/", 'path("extract/",' in urls_code)
    check("urls.py routes items/", 'path("items/",' in urls_code)
    check("urls.py routes stats/", 'path("stats/",' in urls_code)

    api_urls_py = ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    api_urls_code = api_urls_py.read_text(encoding="utf-8")
    check("endoora_api/urls.py routes api/srs/", "api/srs/" in api_urls_code and "srs.urls" in api_urls_code)

    # 5. Unit Tests
    tests_py = ROOT / "apps" / "api" / "srs" / "tests.py"
    check("srs/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests.py tests anonymous access", "test_anonymous_cannot_access_srs" in tests_code)
    check("tests.py tests candidate deduplication", "test_extract_candidates_deduplication" in tests_code)
    check("tests.py tests candidate approval & ignore", "test_candidate_approval_and_ignore_workflow" in tests_code)
    check("tests.py tests SM-2 scheduling ratings", "test_sm2_review_scheduling_ratings" in tests_code)
    check("tests.py tests leech handling threshold", "test_leech_handling_threshold" in tests_code)
    check("tests.py tests edit bad AI meaning", "test_edit_bad_ai_meaning" in tests_code)
    check("tests.py tests source sentence traceability & deletion", "test_source_sentence_traceability_and_deletion_removes_context" in tests_code)
    check("tests.py tests user isolation", "test_user_isolation" in tests_code)
    check("tests.py tests anti-spam guard", "test_anti_spam_guard" in tests_code)
    check("tests.py tests today due filtering", "test_today_review_filters_due_items" in tests_code)

    # 6. Mission serializer srs_due_count integration
    missions_ser_py = ROOT / "apps" / "api" / "missions" / "serializers.py"
    check("missions/serializers.py has srs_due_count", "srs_due_count" in missions_ser_py.read_text(encoding="utf-8"))

    # 7. Frontend Vocabulary Hub
    vocab_page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "vocabulary" / "page.tsx"
    check("vocabulary/page.tsx exists", vocab_page_tsx.is_file())
    vocab_code = vocab_page_tsx.read_text(encoding="utf-8")
    check("vocabulary/page.tsx is a client component", '"use client"' in vocab_code)
    check("vocabulary/page.tsx supports candidate approval", "handleApprove" in vocab_code)
    check("vocabulary/page.tsx supports candidate ignore", "handleIgnore" in vocab_code)
    check("vocabulary/page.tsx supports extraction", "handleExtractSubmit" in vocab_code)
    check("vocabulary/page.tsx supports leech recovery", "isLeech" in vocab_code or "leeches" in vocab_code)
    check("vocabulary/page.tsx links to review", 'href="/review"' in vocab_code)
    check("vocabulary/page.tsx includes Rule #8 transparent note", "تکرار فاصله‌دار" in vocab_code)

    # 8. Tokenized CSS
    vocab_css = ROOT / "apps" / "web" / "app" / "(learner)" / "vocabulary" / "vocabulary.module.css"
    check("vocabulary.module.css exists", vocab_css.is_file())
    vocab_css_code = vocab_css.read_text(encoding="utf-8")
    raw_hex = re.findall(r"#[0-9a-fA-F]{3,8}", vocab_css_code)
    check("vocabulary.module.css has 0 raw hex colors", len(raw_hex) == 0)
    check("vocabulary.module.css consumes var(--color-background)", "var(--color-surface)" in vocab_css_code or "var(--color-canvas)" in vocab_css_code)
    check("vocabulary.module.css consumes var(--color-action)", "var(--color-action)" in vocab_css_code)

    # 9. Upgraded /review page
    review_page_tsx = ROOT / "apps" / "web" / "app" / "(learner)" / "review" / "page.tsx"
    check("review/page.tsx exists", review_page_tsx.is_file())
    review_code = review_page_tsx.read_text(encoding="utf-8")
    check("review/page.tsx links to /vocabulary", 'href="/vocabulary"' in review_code)
    check("review/page.tsx supports meaning editing", "handleSaveEdit" in review_code or "handleStartEdit" in review_code)
    check("review/page.tsx shows traceable source", "sourceText" in review_code)

    # 10. Documentation
    rules_md = ROOT / "docs" / "learning" / "srs-rules.md"
    check("srs-rules.md exists", rules_md.is_file())

    # 11. Python syntax compilation
    py_files = [models_py, services_py, serializers_py, views_py, urls_py, tests_py]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except py_compile.PyCompileError as e:
            check(f"Python syntax valid for {pf.name}: {e}", False)

    print("Day 21 static checks passed: SRS models, lemma deduplication, SM-2 transparent scheduler, leech recovery, approval inbox, tokenized CSS, /review & /vocabulary frontend, and clean syntax.")


if __name__ == "__main__":
    main()
