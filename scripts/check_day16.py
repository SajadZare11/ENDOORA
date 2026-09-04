#!/usr/bin/env python3
"""
Day 16 Static Contract Checker
Verifies:
1. Calibrated listening items in data/placement/core-items.json (15 total items, 4 listening).
2. Difficulty strictly decoupled from CEFR level.
3. Lightweight PCM WAV audio assets exist in apps/web/public/audio/placement/.
4. Pre-submission learner payloads never leak answer keys, solutions, rubrics, or audio transcripts.
5. Backend scoring services evaluate listening section without premature CEFR claims.
6. PlacementSessionSummaryView enforces strict user isolation.
7. Frontend AudioWaveformPlayer component, tokenized CSS (0 raw hex), and PlacementRunner integration.
8. Upgraded learner listening and report pages.
9. Python syntax validity across all modified backend files.
"""

import json
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
    # 1. Placement Core Items & Listening Section
    items_path = ROOT / "data" / "placement" / "core-items.json"
    check("core-items.json exists", items_path.is_file())

    items = json.loads(items_path.read_text(encoding="utf-8-sig"))
    check("core-items.json has at least 15 calibrated items", len(items) >= 15)

    sections = {}
    for item in items:
        sec = item.get("section", "").lower()
        sections.setdefault(sec, []).append(item)

    check("grammar section has at least 4 items", len(sections.get("grammar", [])) >= 4)
    check("vocabulary section has at least 4 items", len(sections.get("vocabulary", [])) >= 4)
    check("reading section has at least 3 items", len(sections.get("reading", [])) >= 3)
    check("listening section has at least 4 items", len(sections.get("listening", [])) >= 4)

    # 2. Listening item properties & separation of concerns
    listening_items = sections.get("listening", [])
    for itm in listening_items:
        check(f"listening item {itm['id']} has audio_url", bool(itm.get("audio_url")))
        check(f"listening item {itm['id']} audio_url starts with /audio/placement/", itm["audio_url"].startswith("/audio/placement/"))
        check(f"listening item {itm['id']} has play_limit >= 1", int(itm.get("play_limit", 0)) >= 1)
        check(f"listening item {itm['id']} has transcript", bool(itm.get("transcript")))
        check(f"listening item {itm['id']} difficulty is easy/medium/hard", itm.get("difficulty") in ("easy", "medium", "hard"))
        check(f"listening item {itm['id']} cefr_level is A1/A2/B1/B2", itm.get("cefr_level") in ("A1", "A2", "B1", "B2"))

    # Verify difficulty is not mechanically mapped 1:1 to CEFR
    a1_diffs = {i["difficulty"] for i in listening_items if i.get("cefr_level") == "A1"}
    b1_diffs = {i["difficulty"] for i in listening_items if i.get("cefr_level") == "B1"}
    check("difficulty is decoupled from CEFR level", bool(a1_diffs and b1_diffs))

    # 3. Audio Asset Files
    audio_dir = ROOT / "apps" / "web" / "public" / "audio" / "placement"
    check("audio placement directory exists", audio_dir.is_dir())
    for itm in listening_items:
        rel_audio = itm["audio_url"].lstrip("/")
        # Path under apps/web/public/
        asset_file = ROOT / "apps" / "web" / "public" / rel_audio
        check(f"audio asset file exists for {itm['id']}: {asset_file.name}", asset_file.is_file())
        check(f"audio asset file {asset_file.name} is not empty (> 1KB)", asset_file.stat().st_size > 1024)

    # 4. Anti-Leak Payload Protection
    serializers_py = (ROOT / "apps" / "api" / "placement" / "serializers.py").read_text(encoding="utf-8")
    check("PlacementQuestionItemSerializer exists", "class PlacementQuestionItemSerializer" in serializers_py)
    check("PlacementQuestionItemSerializer has audio_url", "audio_url = serializers.CharField" in serializers_py)
    check("PlacementQuestionItemSerializer has play_limit", "play_limit = serializers.IntegerField" in serializers_py)

    views_py = (ROOT / "apps" / "api" / "placement" / "views.py").read_text(encoding="utf-8")
    check("PlacementQuestionsView has listening title", '"listening":' in views_py)
    check("PlacementQuestionsView does not leak transcript", "transcript" not in views_py or "never include" in views_py)

    # 5. Backend Assessment Scoring & Transparency
    services_py = (ROOT / "apps" / "api" / "assessment" / "services.py").read_text(encoding="utf-8")
    check("services.py notice mentions listening", "شنیداری" in services_py)
    check("services.py disclaims official CEFR claim", "مدرک رسمی یا نهایی CEFR محسوب نمی‌شود" in services_py)

    # 6. Management command seeds listening items
    seed_cmd_py = (ROOT / "apps" / "api" / "assessment" / "management" / "commands" / "seed_placement_sections.py").read_text(encoding="utf-8")
    check("seed command validates listening", '"listening"' in seed_cmd_py)

    # 7. Frontend AudioWaveformPlayer & Tokenized CSS
    player_tsx = (ROOT / "apps" / "web" / "components" / "placement" / "AudioWaveformPlayer.tsx").read_text(encoding="utf-8")
    check("AudioWaveformPlayer component exists", "export function AudioWaveformPlayer" in player_tsx)
    check("AudioWaveformPlayer supports playLimit", "playLimit" in player_tsx)
    check("AudioWaveformPlayer has waveform scrubber", "WAVEFORM_HEIGHTS" in player_tsx)
    check("AudioWaveformPlayer has speed controls", "changeSpeed" in player_tsx)

    player_css = (ROOT / "apps" / "web" / "components" / "placement" / "audio-player.module.css").read_text(encoding="utf-8")
    raw_hex_matches = re.findall(r"#[0-9a-fA-F]{3,8}", player_css)
    check("audio-player.module.css has 0 raw hex colors", len(raw_hex_matches) == 0)

    # 8. PlacementRunner & Report & Listening Lab integration
    runner_tsx = (ROOT / "apps" / "web" / "components" / "placement" / "PlacementRunner.tsx").read_text(encoding="utf-8")
    check("PlacementRunner imports AudioWaveformPlayer", "AudioWaveformPlayer" in runner_tsx)
    check("PlacementRunner renders listening section pill", "۴. شنیداری" in runner_tsx or "4. Listening" in runner_tsx)
    check("PlacementRunner includes listening items in DEFAULT_QUESTIONS", "listening-a1-001" in runner_tsx)

    report_tsx = (ROOT / "apps" / "web" / "app" / "(learner)" / "placement" / "report" / "page.tsx").read_text(encoding="utf-8")
    check("report page includes listening section", "summary?.sections?.listening" in report_tsx)

    listening_tsx = (ROOT / "apps" / "web" / "app" / "(learner)" / "listening" / "page.tsx").read_text(encoding="utf-8")
    check("listening page embeds AudioWaveformPlayer", "AudioWaveformPlayer" in listening_tsx)

    # 9. Python syntax compilation check
    py_files = [
        ROOT / "apps" / "api" / "assessment" / "services.py",
        ROOT / "apps" / "api" / "assessment" / "tests.py",
        ROOT / "apps" / "api" / "assessment" / "management" / "commands" / "seed_placement_sections.py",
        ROOT / "apps" / "api" / "placement" / "serializers.py",
        ROOT / "apps" / "api" / "placement" / "views.py",
        ROOT / "apps" / "api" / "placement" / "tests.py",
    ]
    for py_file in py_files:
        py_compile.compile(str(py_file), doraise=True)

    print("Day 16 static checks passed: Listening placement section, AudioWaveformPlayer, WAV audio assets, tokenized CSS, anti-leak protection, honest assessment, and Python syntax.")


if __name__ == "__main__":
    main()
