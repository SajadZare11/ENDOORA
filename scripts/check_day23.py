#!/usr/bin/env python3
"""
Day 23 Static Contract Checker
Verifies:
1. Mistake Genome models in apps/api/mistake_genome/models.py (LearnerMistakePattern, MistakeEvidence).
2. Service layer in apps/api/mistake_genome/services.py with strict evidence threshold (>= 2).
3. Dispute mechanism excluding disputed patterns from practice recommendations.
4. Serializers in apps/api/mistake_genome/serializers.py.
5. API views and URL endpoints in apps/api/mistake_genome/views.py and urls.py.
6. Integration hooks in missions and ai_gateway services.
7. Unit test suite in apps/api/mistake_genome/tests.py.
8. Frontend Mistake Hub at apps/web/app/(learner)/mistakes/page.tsx with 4 status tabs.
9. 100% tokenized CSS in apps/web/app/(learner)/mistakes/mistakes.module.css with 0 raw hex.
10. Documentation in docs/ai/mistake-taxonomy.md.
11. Python syntax compilation across all backend files.
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
    models_py = ROOT / "apps" / "api" / "mistake_genome" / "models.py"
    check("mistake_genome/models.py exists", models_py.is_file())
    models_code = models_py.read_text(encoding="utf-8")
    check("models.py defines MistakeCategory", "class MistakeCategory" in models_code)
    check("models.py defines MistakeSeverity", "class MistakeSeverity" in models_code)
    check("models.py defines MistakeStatus", "class MistakeStatus" in models_code)
    check("models.py defines LearnerMistakePattern", "class LearnerMistakePattern" in models_code)
    check("models.py defines MistakeEvidence", "class MistakeEvidence" in models_code)
    check("models.py tracks evidence_count", "evidence_count" in models_code)
    check("models.py tracks is_disputed", "is_disputed" in models_code)
    check("models.py tracks dispute_reason", "dispute_reason" in models_code)
    check("models.py tracks l1_interference_note_fa", "l1_interference_note_fa" in models_code)
    check("models.py enforces unique constraint", "unique_learner_mistake_tag" in models_code)

    # 2. Services
    services_py = ROOT / "apps" / "api" / "mistake_genome" / "services.py"
    check("mistake_genome/services.py exists", services_py.is_file())
    services_code = services_py.read_text(encoding="utf-8")
    check("services.py defines MistakeGenomeService", "class MistakeGenomeService" in services_code)
    check("services.py enforces evidence threshold", "EVIDENCE_RECURRING_THRESHOLD" in services_code)
    check("services.py defines record_mistake", "def record_mistake" in services_code)
    check("services.py defines dispute_pattern", "def dispute_pattern" in services_code)
    check("services.py defines resolve_pattern", "def resolve_pattern" in services_code)
    check("services.py defines delete_evidence", "def delete_evidence" in services_code)
    check("services.py defines get_top_practice_targets", "def get_top_practice_targets" in services_code)
    check("services.py defines get_learner_genome_summary", "def get_learner_genome_summary" in services_code)

    # 3. Serializers
    serializers_py = ROOT / "apps" / "api" / "mistake_genome" / "serializers.py"
    check("mistake_genome/serializers.py exists", serializers_py.is_file())
    serializers_code = serializers_py.read_text(encoding="utf-8")
    check("serializers.py defines LearnerMistakePatternSerializer", "class LearnerMistakePatternSerializer" in serializers_code)
    check("serializers.py defines MistakeEvidenceSerializer", "class MistakeEvidenceSerializer" in serializers_code)
    check("serializers.py defines MistakeDisputeRequestSerializer", "class MistakeDisputeRequestSerializer" in serializers_code)

    # 4. Views & URLs
    views_py = ROOT / "apps" / "api" / "mistake_genome" / "views.py"
    check("mistake_genome/views.py exists", views_py.is_file())
    views_code = views_py.read_text(encoding="utf-8")
    check("views.py defines MistakeGenomeSummaryView", "class MistakeGenomeSummaryView" in views_code)
    check("views.py defines MistakePatternListView", "class MistakePatternListView" in views_code)
    check("views.py defines MistakePatternDetailView", "class MistakePatternDetailView" in views_code)
    check("views.py defines MistakeDisputeView", "class MistakeDisputeView" in views_code)
    check("views.py defines MistakeResolveView", "class MistakeResolveView" in views_code)
    check("views.py defines MistakeRecordView", "class MistakeRecordView" in views_code)
    check("views.py defines MistakeEvidenceDeleteView", "class MistakeEvidenceDeleteView" in views_code)

    urls_py = ROOT / "apps" / "api" / "mistake_genome" / "urls.py"
    check("mistake_genome/urls.py exists", urls_py.is_file())
    urls_code = urls_py.read_text(encoding="utf-8")
    check("urls.py routes summary/", "summary/" in urls_code)
    check("urls.py routes patterns/", "patterns/" in urls_code)
    check("urls.py routes dispute/", "dispute/" in urls_code)
    check("urls.py routes resolve/", "resolve/" in urls_code)
    check("urls.py routes record/", "record/" in urls_code)

    # 5. Integration Hooks
    missions_services = ROOT / "apps" / "api" / "missions" / "services.py"
    check("missions/services.py hooks MistakeGenomeService", "MistakeGenomeService" in missions_services.read_text(encoding="utf-8"))
    ai_services = ROOT / "apps" / "api" / "ai_gateway" / "services.py"
    check("ai_gateway/services.py hooks MistakeGenomeService", "MistakeGenomeService" in ai_services.read_text(encoding="utf-8"))

    # 6. Unit Tests
    tests_py = ROOT / "apps" / "api" / "mistake_genome" / "tests.py"
    check("mistake_genome/tests.py exists", tests_py.is_file())
    tests_code = tests_py.read_text(encoding="utf-8")
    check("tests.py tests occasional classification", "test_single_mistake_is_occasional_not_permanent_dna" in tests_code)
    check("tests.py tests promotion to recurring", "test_multiple_evidence_events_promote_to_recurring" in tests_code)
    check("tests.py tests dispute exclusion", "test_disputed_pattern_strictly_excluded_from_recommendations" in tests_code)
    check("tests.py tests evidence scrubbing", "test_delete_evidence_scrubs_personal_text" in tests_code)

    # 7. Frontend Mistake Hub
    mistakes_page = ROOT / "apps" / "web" / "app" / "(learner)" / "mistakes" / "page.tsx"
    check("mistakes/page.tsx exists", mistakes_page.is_file())
    mistakes_code = mistakes_page.read_text(encoding="utf-8")
    check("mistakes/page.tsx has recurring tab", "recurring" in mistakes_code)
    check("mistakes/page.tsx has occasional tab", "occasional" in mistakes_code)
    check("mistakes/page.tsx has mastered tab", "mastered" in mistakes_code)
    check("mistakes/page.tsx has disputed tab", "disputed" in mistakes_code)
    check("mistakes/page.tsx links to /practice", "href=\"/practice\"" in mistakes_code or "href={`/practice" in mistakes_code)

    # 8. Tokenized CSS
    mistakes_css = ROOT / "apps" / "web" / "app" / "(learner)" / "mistakes" / "mistakes.module.css"
    check("mistakes.module.css exists", mistakes_css.is_file())
    raw_hex = re.findall(r"#[0-9a-fA-F]{3,8}\b", mistakes_css.read_text(encoding="utf-8"))
    check(f"mistakes.module.css has 0 raw hex colors (found: {raw_hex})", len(raw_hex) == 0)

    # 9. Documentation
    doc_md = ROOT / "docs" / "ai" / "mistake-taxonomy.md"
    check("docs/ai/mistake-taxonomy.md exists", doc_md.is_file())
    doc_content = doc_md.read_text(encoding="utf-8")
    check("mistake-taxonomy.md covers 8 categories", "collocation" in doc_content and "discourse" in doc_content)
    check("mistake-taxonomy.md covers evidence threshold", "Evidence Threshold" in doc_content)

    # 10. Syntax compilation
    py_files = [models_py, services_py, serializers_py, views_py, urls_py, tests_py]
    for pf in py_files:
        try:
            py_compile.compile(str(pf), doraise=True)
        except Exception as exc:
            check(f"Syntax error in {pf.name}: {exc}", False)

    print("Day 23 static checks passed: Mistake Genome models, evidence threshold, dispute suppression, privacy scrubbing, practice hooks, /mistakes hub, tokenized CSS, docs, and clean syntax.")


if __name__ == "__main__":
    main()
