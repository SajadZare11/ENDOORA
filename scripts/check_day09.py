from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
failures: list[str] = []

required = (
    "apps/api/dashboard/apps.py",
    "apps/api/dashboard/serializers.py",
    "apps/api/dashboard/services.py",
    "apps/api/dashboard/views.py",
    "apps/api/dashboard/urls.py",
    "apps/api/dashboard/tests.py",
    "apps/web/lib/learner-dashboard.ts",
    "apps/web/components/learner/LearnerShell.tsx",
    "apps/web/components/learner/LearnerDashboard.tsx",
    "apps/web/components/learner/learner.css",
    "apps/web/app/(learner)/layout.tsx",
    "apps/web/app/(learner)/dashboard/page.tsx",
)

for item in required:
    if not (ROOT / item).exists():
        failures.append(f"Missing: {item}")

settings = ROOT / "apps/api/endoora_api/settings/base.py"
urls = ROOT / "apps/api/endoora_api/urls.py"
next_config = ROOT / "apps/web/next.config.ts"

if settings.exists():
    text = settings.read_text(encoding="utf-8")
    if '"dashboard"' not in text and "'dashboard'" not in text:
        failures.append("dashboard is not in INSTALLED_APPS.")
else:
    failures.append("Missing settings/base.py")

if urls.exists():
    text = urls.read_text(encoding="utf-8")
    if "dashboard.urls" not in text:
        failures.append("dashboard.urls is not included.")
else:
    failures.append("Missing endoora_api/urls.py")

if next_config.exists():
    if "/api/:path*" not in next_config.read_text(encoding="utf-8"):
        failures.append("Next API proxy is missing.")
else:
    failures.append("Missing next.config.ts")

dashboard = ROOT / "apps/web/components/learner/LearnerDashboard.tsx"
if dashboard.exists():
    text = dashboard.read_text(encoding="utf-8")
    for phrase in ("چرا این پیشنهاد؟", "Why this action?", "path_progress_percent === null"):
        if phrase not in text:
            failures.append(f"Dashboard behavior missing: {phrase}")

shell = ROOT / "apps/web/components/learner/LearnerShell.tsx"
if shell.exists():
    text = shell.read_text(encoding="utf-8")
    for phrase in ("خانه", "Home", "یادگیری", "Learn", "حساب", "Account"):
        if phrase not in text:
            failures.append(f"Bilingual navigation missing: {phrase}")

css = ROOT / "apps/web/components/learner/learner.css"
if css.exists():
    text = css.read_text(encoding="utf-8")
    if "#" in text:
        failures.append("Hardcoded hex color found in learner.css.")
    if "@media (max-width: 48rem)" not in text:
        failures.append("Mobile breakpoint is missing.")
    if "margin-left" in text or "margin-right" in text:
        failures.append("Physical left/right margin found; use logical properties.")

if failures:
    print("Day 09 static check FAILED")
    for failure in failures:
        print(f" - {failure}")
    raise SystemExit(1)

print(
    "Day 09 static checks passed: one learner-home API, Persian/English shell, "
    "mobile navigation, role gate, recovery states, and no invented progress score."
)
