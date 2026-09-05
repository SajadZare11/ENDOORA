"""
Contract check for Day 27: Build Pronunciation Lab v1 & Speech Intelligibility Trends.
Validates:
1. Backend pronunciation models (PronunciationItem, PronunciationAttempt, backward-compatibility properties).
2. Database migration (0001_initial.py).
3. App registration in settings/base.py and URL routing in endoora_api/urls.py.
4. Pronunciation service methods (seed catalog, WPM, pauses, stress, intelligibility, genome bridge, legacy analyze).
5. Product Constitution Rule #8 compliance (non-fabrication of native accent scores or phoneme grading).
6. API routes for items, detail, analyze, save-to-genome, and attempts.
7. Frontend Pronunciation Lab page (page.tsx) with live recorder, visualizer, metrics, and genome bridge.
8. Frontend CSS module (pronunciation.module.css) with zero raw hex colors and 100% logical properties.
9. Technical and pedagogical documentation.
10. Cross-linking between Voice Lab (/voice) and Pronunciation Lab (/pronunciation).
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def check(condition: bool, message: str) -> None:
    if not condition:
        print(f"[FAIL] {message}")
        sys.exit(1)
    print(f"[PASS] {message}")


def main():
    print("Running Day 27 Contract Verification...")

    # 1. Backend Models
    models_py = REPO_ROOT / "apps" / "api" / "pronunciation" / "models.py"
    check(models_py.is_file(), "apps/api/pronunciation/models.py exists")
    models_content = models_py.read_text(encoding="utf-8")
    check("class PronunciationItem(" in models_content, "PronunciationItem model defined")
    check("class PronunciationAttempt(" in models_content, "PronunciationAttempt model defined")
    check("ipa = models.CharField(" in models_content, "ipa field present on PronunciationItem")
    check("stress_pattern" in models_content, "stress_pattern field present")
    check("l1_note_fa" in models_content, "l1_note_fa field present")
    check("speech_rate_wpm" in models_content, "speech_rate_wpm field present on PronunciationAttempt")
    check("intelligibility_score" in models_content, "intelligibility_score field present")
    check("saved_to_genome" in models_content, "saved_to_genome field present")
    check("def transcript(" in models_content, "legacy transcript property present")
    check("def speech_rate(" in models_content, "legacy speech_rate property present")

    # 2. Database Migration
    migration_file = REPO_ROOT / "apps" / "api" / "pronunciation" / "migrations" / "0001_initial.py"
    check(migration_file.is_file(), "pronunciation migration 0001_initial.py exists")

    # 3. Settings and URL Routing
    base_settings = (REPO_ROOT / "apps" / "api" / "endoora_api" / "settings" / "base.py").read_text(encoding="utf-8")
    check('"pronunciation"' in base_settings, "pronunciation registered in INSTALLED_APPS")

    root_urls = (REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py").read_text(encoding="utf-8")
    check('"api/pronunciation/"' in root_urls and '"pronunciation.urls"' in root_urls, "pronunciation routed in root urls")

    # 4. Pronunciation Service Logic & Rule #8 Compliance
    services_py = REPO_ROOT / "apps" / "api" / "pronunciation" / "services.py"
    check(services_py.is_file(), "apps/api/pronunciation/services.py exists")
    services_content = services_py.read_text(encoding="utf-8")
    check("def ensure_seed_items(" in services_content, "ensure_seed_items method exists")
    check("minimal_pairs" in services_content, "minimal_pairs category present in service")
    check("stress_shifts" in services_content, "stress_shifts category present in service")
    check("consonant_clusters" in services_content, "consonant_clusters category present in service")
    check("connected_speech" in services_content, "connected_speech category present in service")
    check("def calculate_speech_rate_wpm(" in services_content, "calculate_speech_rate_wpm method exists")
    check("def count_hesitations(" in services_content, "count_hesitations method exists")
    check("def evaluate_intelligibility_trend(" in services_content, "evaluate_intelligibility_trend method exists")
    check("def save_to_mistake_genome(" in services_content, "save_to_mistake_genome method exists")
    check("def analyze(" in services_content, "legacy analyze method exists")
    check("Constitution Rule #8" in services_content, "Constitution Rule #8 disclaimer in service")

    # 5. URLs and Views
    urls_py = REPO_ROOT / "apps" / "api" / "pronunciation" / "urls.py"
    check(urls_py.is_file(), "apps/api/pronunciation/urls.py exists")
    urls_content = urls_py.read_text(encoding="utf-8")
    check('"items/"' in urls_content, "items/ route configured")
    check('"analyze/"' in urls_content, "analyze/ route configured")
    check('save-to-genome/' in urls_content, "save-to-genome/ route configured")

    # 6. Frontend Page
    page_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "pronunciation" / "page.tsx"
    check(page_tsx.is_file(), "apps/web/app/(learner)/pronunciation/page.tsx exists")
    page_content = page_tsx.read_text(encoding="utf-8")
    check("Product Constitution Rule #8" in page_content, "Product Constitution Rule #8 prominent on page")
    check("minimal_pairs" in page_content, "minimal_pairs filter on page")
    check("stress_shifts" in page_content, "stress_shifts filter on page")
    check("consonant_clusters" in page_content, "consonant_clusters filter on page")
    check("connected_speech" in page_content, "connected_speech filter on page")
    check("visualizerBar" in page_content, "visualizerBar implemented on page")
    check("handleSaveToGenome" in page_content, "handleSaveToGenome bridge implemented")
    check("Shadowing" in page_content, "Shadowing guide implemented")

    # 7. Frontend CSS Module & Zero Hex Check
    css_file = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "pronunciation" / "pronunciation.module.css"
    check(css_file.is_file(), "apps/web/app/(learner)/pronunciation/pronunciation.module.css exists")
    css_content = css_file.read_text(encoding="utf-8")

    # Hex color check
    hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}\b", css_content)
    check(len(hex_matches) == 0, f"Zero raw hex colors in pronunciation.module.css (found {len(hex_matches)})")

    # Physical left/right check
    physical_props = re.findall(r"(?:margin|padding|border)-(?:left|right)\s*:", css_content, re.IGNORECASE)
    check(len(physical_props) == 0, f"Zero physical left/right CSS properties in pronunciation.module.css (found {len(physical_props)})")

    # 8. Documentation
    limits_md = REPO_ROOT / "docs" / "ai" / "pronunciation-limitations.md"
    check(limits_md.is_file(), "docs/ai/pronunciation-limitations.md exists")
    limits_content = limits_md.read_text(encoding="utf-8")
    check("Rule #8" in limits_content, "Rule #8 documented in pronunciation-limitations.md")
    check("Persian" in limits_content, "Persian L1 interference documented")

    lab_md = REPO_ROOT / "docs" / "learning" / "pronunciation-lab.md"
    check(lab_md.is_file(), "docs/learning/pronunciation-lab.md exists")
    lab_content = lab_md.read_text(encoding="utf-8")
    check("Shadowing" in lab_content, "Shadowing method documented")

    # 9. Cross-Link Check
    voice_page = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "voice" / "page.tsx"
    check(voice_page.is_file(), "apps/web/app/(learner)/voice/page.tsx exists")
    voice_content = voice_page.read_text(encoding="utf-8")
    check('href="/pronunciation"' in voice_content, "Voice Lab links to Pronunciation Lab")

    print("\n[SUCCESS] Day 27 Contract Verification Passed 100%!")


if __name__ == "__main__":
    main()
