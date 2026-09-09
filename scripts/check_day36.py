"""
Contract check for Day 36: Teacher analytics, progress reporting, at-risk alerts, and intervention tools.
Validates:
1. Backend models & choices:
   - AlertSeverity, AlertType, AlertStatus choices
   - AtRiskAlert model with required fields
   - InterventionType, InterventionStatus choices
   - TeacherIntervention model with required fields
2. Backend service layer (TeacherAnalyticsService):
   - evaluate_class_at_risk_alerts
   - get_teacher_analytics_overview
   - get_class_analytics_report
   - get_learner_analytics_profile
   - export_class_analytics_csv (UTF-8 BOM)
   - acknowledge_at_risk_alert
   - resolve_at_risk_alert
   - dismiss_at_risk_alert
   - list_teacher_interventions
   - create_teacher_intervention
   - update_teacher_intervention
3. Django Admin:
   - AtRiskAlertAdmin registered
   - TeacherInterventionAdmin registered
4. Database migration:
   - 0004_analytics_and_interventions.py exists
5. URL patterns:
   - analytics/overview/
   - classes/<uuid:class_id>/analytics/
   - classes/<uuid:class_id>/analytics/export/
   - classes/<uuid:class_id>/learners/<uuid:learner_id>/analytics/
   - alerts/
   - alerts/<uuid:alert_id>/acknowledge/
   - alerts/<uuid:alert_id>/resolve/
   - interventions/
   - interventions/<uuid:intervention_id>/
6. Frontend Client & Pages:
   - apps/web/lib/teacher-analytics.ts
   - apps/web/app/(teacher)/teacher/analytics/page.tsx
   - apps/web/app/(teacher)/teacher/analytics/[classId]/page.tsx
   - apps/web/app/(teacher)/teacher/analytics/learners/[learnerId]/page.tsx
   - apps/web/app/(teacher)/teacher/interventions/page.tsx
7. CSS Compliance (0 raw hex, 100% logical properties):
   - analytics.module.css
   - interventions.module.css
8. Documentation:
   - docs/teachers/analytics-and-interventions.md
"""

import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        try:
            print(f"[FAIL] {message}")
        except UnicodeEncodeError:
            print(f"[FAIL] {message.encode('ascii', 'backslashreplace').decode('ascii')}")
        sys.exit(1)
    try:
        print(f"[PASS] {message}")
    except UnicodeEncodeError:
        print(f"[PASS] {message.encode('ascii', 'backslashreplace').decode('ascii')}")


def check_no_raw_hex(css_content: str, filename: str) -> None:
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}", css_content)
    check(len(hex_matches) == 0, f"{filename} has zero raw hex colors (found {len(hex_matches)})")


def check_logical_properties(css_content: str, filename: str) -> None:
    forbidden = ["padding-left", "padding-right", "margin-left", "margin-right", "left:", "right:"]
    found = [p for p in forbidden if p in css_content]
    check(len(found) == 0, f"{filename} uses 100% logical properties (found forbidden: {found})")


def main():
    print("Running Day 36 Contract Verification...")

    # 1. Models
    models_py = REPO_ROOT / "apps" / "api" / "teachers" / "models.py"
    check(models_py.is_file(), "apps/api/teachers/models.py exists")
    models = models_py.read_text(encoding="utf-8")

    check("class AlertSeverity(" in models, "AlertSeverity choices defined")
    check("class AlertType(" in models, "AlertType choices defined")
    check("class AlertStatus(" in models, "AlertStatus choices defined")
    check("class AtRiskAlert(" in models, "AtRiskAlert model defined")
    check("metrics_snapshot" in models, "metrics_snapshot on AtRiskAlert")
    check("acknowledged_at" in models, "acknowledged_at on AtRiskAlert")
    check("resolved_at" in models, "resolved_at on AtRiskAlert")
    check("resolution_notes" in models, "resolution_notes on AtRiskAlert")

    check("class InterventionType(" in models, "InterventionType choices defined")
    check("class InterventionStatus(" in models, "InterventionStatus choices defined")
    check("class TeacherIntervention(" in models, "TeacherIntervention model defined")
    check("action_data" in models, "action_data on TeacherIntervention")
    check("outcome_notes" in models, "outcome_notes on TeacherIntervention")
    check("score_before" in models, "score_before on TeacherIntervention")
    check("score_after" in models, "score_after on TeacherIntervention")

    # 2. Services
    services_py = REPO_ROOT / "apps" / "api" / "teachers" / "analytics_services.py"
    check(services_py.is_file(), "apps/api/teachers/analytics_services.py exists")
    services = services_py.read_text(encoding="utf-8")

    check("def evaluate_class_at_risk_alerts(" in services, "evaluate_class_at_risk_alerts implemented")
    check("def get_teacher_analytics_overview(" in services, "get_teacher_analytics_overview implemented")
    check("def get_class_analytics_report(" in services, "get_class_analytics_report implemented")
    check("def get_learner_analytics_profile(" in services, "get_learner_analytics_profile implemented")
    check("def export_class_analytics_csv(" in services, "export_class_analytics_csv implemented")
    check("\ufeff" in services or "ufeff" in services, "UTF-8 BOM present in CSV export")
    check("def acknowledge_at_risk_alert(" in services, "acknowledge_at_risk_alert implemented")
    check("def resolve_at_risk_alert(" in services, "resolve_at_risk_alert implemented")
    check("def dismiss_at_risk_alert(" in services, "dismiss_at_risk_alert implemented")
    check("def list_teacher_interventions(" in services, "list_teacher_interventions implemented")
    check("def create_teacher_intervention(" in services, "create_teacher_intervention implemented")
    check("def update_teacher_intervention(" in services, "update_teacher_intervention implemented")

    # 3. Admin
    admin_py = REPO_ROOT / "apps" / "api" / "teachers" / "admin.py"
    admin_content = admin_py.read_text(encoding="utf-8")
    check("AtRiskAlertAdmin" in admin_content, "AtRiskAlertAdmin registered in admin.py")
    check("TeacherInterventionAdmin" in admin_content, "TeacherInterventionAdmin registered in admin.py")

    # 4. Migration
    mig_file = REPO_ROOT / "apps" / "api" / "teachers" / "migrations" / "0004_analytics_and_interventions.py"
    check(mig_file.is_file(), "Migration 0004_analytics_and_interventions.py exists")

    # 5. URLs
    urls_py = REPO_ROOT / "apps" / "api" / "teachers" / "urls.py"
    urls = urls_py.read_text(encoding="utf-8")
    check("analytics/overview/" in urls, "analytics/overview/ route registered")
    check("classes/<uuid:class_id>/analytics/" in urls, "class analytics route registered")
    check("classes/<uuid:class_id>/analytics/export/" in urls, "class analytics export route registered")
    check("classes/<uuid:class_id>/learners/<uuid:learner_id>/analytics/" in urls, "learner profile analytics route registered")
    check("alerts/" in urls, "alerts list route registered")
    check("alerts/<uuid:alert_id>/acknowledge/" in urls, "alert acknowledge route registered")
    check("alerts/<uuid:alert_id>/resolve/" in urls, "alert resolve route registered")
    check("interventions/" in urls, "interventions route registered")
    check("interventions/<uuid:intervention_id>/" in urls, "intervention detail route registered")

    # 6. Frontend Files
    lib_file = REPO_ROOT / "apps" / "web" / "lib" / "teacher-analytics.ts"
    check(lib_file.is_file(), "apps/web/lib/teacher-analytics.ts exists")
    lib_content = lib_file.read_text(encoding="utf-8")
    check("export async function fetchTeacherAnalyticsOverview" in lib_content, "fetchTeacherAnalyticsOverview exported")
    check("export async function fetchClassAnalyticsReport" in lib_content, "fetchClassAnalyticsReport exported")
    check("export async function fetchLearnerAnalyticsProfile" in lib_content, "fetchLearnerAnalyticsProfile exported")
    check("export async function fetchTeacherInterventions" in lib_content, "fetchTeacherInterventions exported")

    p1 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "analytics" / "page.tsx"
    check(p1.is_file(), "apps/web/app/(teacher)/teacher/analytics/page.tsx exists")

    p2 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "analytics" / "[classId]" / "page.tsx"
    check(p2.is_file(), "apps/web/app/(teacher)/teacher/analytics/[classId]/page.tsx exists")

    p3 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "analytics" / "learners" / "[learnerId]" / "page.tsx"
    check(p3.is_file(), "apps/web/app/(teacher)/teacher/analytics/learners/[learnerId]/page.tsx exists")

    p4 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "interventions" / "page.tsx"
    check(p4.is_file(), "apps/web/app/(teacher)/teacher/interventions/page.tsx exists")

    # 7. CSS Modules
    css1 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "analytics" / "analytics.module.css"
    check(css1.is_file(), "analytics.module.css exists")
    c1_txt = css1.read_text(encoding="utf-8")
    check_no_raw_hex(c1_txt, "analytics.module.css")
    check_logical_properties(c1_txt, "analytics.module.css")

    css2 = REPO_ROOT / "apps" / "web" / "app" / "(teacher)" / "teacher" / "interventions" / "interventions.module.css"
    check(css2.is_file(), "interventions.module.css exists")
    c2_txt = css2.read_text(encoding="utf-8")
    check_no_raw_hex(c2_txt, "interventions.module.css")
    check_logical_properties(c2_txt, "interventions.module.css")

    # 8. Documentation
    doc_file = REPO_ROOT / "docs" / "teachers" / "analytics-and-interventions.md"
    check(doc_file.is_file(), "docs/teachers/analytics-and-interventions.md exists")

    print("\n[SUCCESS] Day 36 contract checks passed cleanly!")


if __name__ == "__main__":
    main()
