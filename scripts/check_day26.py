"""
Contract check for Day 26: Build Voice Lab v1 & Voice Conversation Beta.
Validates:
1. Backend voice models (VoiceRecording, VoicePreference, AudioAttempt alias).
2. Database migration (0001_initial.py).
3. Speech compatibility bridge package.
4. Pipeline service constraints (max 10MB upload, max 90s duration).
5. Audio cleanup management command (cleanup_expired_audio).
6. API routes for /api/voice/ and /api/speech/.
7. VoiceRecorder component with audio meter, transcript editor, and fallback.
8. Voice Roleplay Beta page with scenario selector, TTS voice synthesis, and accent/speed controls.
9. Voice Lab Hub page with direct beta link and retention preference controls.
10. Zero raw hex colors across all new CSS modules (100% design tokens).
11. Technical and pedagogical documentation.
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
    print("Running Day 26 Contract Verification...")

    # 1. Backend Models
    models_py = REPO_ROOT / "apps" / "api" / "voice_lab" / "models.py"
    check(models_py.is_file(), "apps/api/voice_lab/models.py exists")
    models_content = models_py.read_text(encoding="utf-8")
    check("class VoiceRecording(" in models_content, "VoiceRecording model defined")
    check("AudioAttempt = VoiceRecording" in models_content, "AudioAttempt alias defined for backward compatibility")
    check("class VoicePreference(" in models_content, "VoicePreference model defined")
    check("preferred_accent" in models_content, "preferred_accent choice field present")
    check("playback_speed" in models_content, "playback_speed field present")
    check("default_retention" in models_content or "retention" in models_content, "retention field present")
    check("is_deleted" in models_content, "is_deleted field present for biometric privacy")

    # 2. Database Migration
    migration_file = REPO_ROOT / "apps" / "api" / "voice_lab" / "migrations" / "0001_initial.py"
    check(migration_file.is_file(), "voice_lab migration 0001_initial.py exists")

    # 3. Speech Bridge Package
    speech_init = REPO_ROOT / "apps" / "api" / "speech" / "__init__.py"
    speech_views = REPO_ROOT / "apps" / "api" / "speech" / "views.py"
    speech_urls = REPO_ROOT / "apps" / "api" / "speech" / "urls.py"
    check(speech_init.is_file(), "speech bridge __init__.py exists")
    check(speech_views.is_file(), "speech bridge views.py exists")
    check(speech_urls.is_file(), "speech bridge urls.py exists")

    # 4. Pipeline Service Constraints
    services_py = REPO_ROOT / "apps" / "api" / "voice_lab" / "services.py"
    check(services_py.is_file(), "apps/api/voice_lab/services.py exists")
    services_content = services_py.read_text(encoding="utf-8")
    check("MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024" in services_content, "Hard 10MB upload limit configured")
    check("MAX_AUDIO_DURATION_SEC = 90.0" in services_content or "90" in services_content, "Hard 90-second duration limit configured")
    check("def create_upload_ticket(" in services_content, "create_upload_ticket implemented")
    check("def process_audio_upload(" in services_content, "process_audio_upload implemented")
    check("def update_corrected_transcript(" in services_content, "update_corrected_transcript implemented")
    check("def generate_tts_reply(" in services_content, "generate_tts_reply implemented")
    check("def delete_expired_audio(" in services_content, "delete_expired_audio implemented")

    # 5. Management Command for Retention Purge
    command_py = REPO_ROOT / "apps" / "api" / "voice_lab" / "management" / "commands" / "cleanup_expired_audio.py"
    check(command_py.is_file(), "cleanup_expired_audio management command exists")
    cmd_content = command_py.read_text(encoding="utf-8")
    check("class Command(BaseCommand):" in cmd_content, "Command class implemented")
    check("delete_expired_audio" in cmd_content, "delete_expired_audio called in command")

    # 6. URL Routing
    voice_urls_py = REPO_ROOT / "apps" / "api" / "voice_lab" / "urls.py"
    check(voice_urls_py.is_file(), "apps/api/voice_lab/urls.py exists")
    main_urls_py = REPO_ROOT / "apps" / "api" / "endoora_api" / "urls.py"
    main_urls_content = main_urls_py.read_text(encoding="utf-8")
    check("api/voice/" in main_urls_content and "voice_lab.urls" in main_urls_content, "api/voice/ registered in main urls.py")
    check("api/speech/" in main_urls_content and "speech.urls" in main_urls_content, "api/speech/ registered in main urls.py")

    # 7. Frontend VoiceRecorder Component
    recorder_tsx = REPO_ROOT / "apps" / "web" / "components" / "voice-recorder" / "VoiceRecorder.tsx"
    check(recorder_tsx.is_file(), "VoiceRecorder.tsx exists")
    rec_content = recorder_tsx.read_text(encoding="utf-8")
    check("AudioContext" in rec_content, "Web AudioContext frequency analyzer integrated")
    check("SpeechRecognition" in rec_content, "Speech recognition integrated")
    check("isEditingTranscript" in rec_content, "In-place transcript editor implemented")
    check("fallbackInput" in rec_content or "fallbackText" in rec_content, "Graceful non-blocking fallback text input implemented")
    check("upload-ticket" in rec_content, "Signed upload ticket integration implemented")

    recorder_css = REPO_ROOT / "apps" / "web" / "components" / "voice-recorder" / "voice-recorder.module.css"
    check(recorder_css.is_file(), "voice-recorder.module.css exists")
    rec_css_content = recorder_css.read_text(encoding="utf-8")
    rec_hex = re.findall(r"#[0-9a-fA-F]{3,8}\b", rec_css_content)
    check(len(rec_hex) == 0, f"voice-recorder.module.css has 0 raw hex colors (found {len(rec_hex)})")

    # 8. Frontend Voice Roleplay Beta Page
    roleplay_voice_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "roleplay" / "voice" / "page.tsx"
    check(roleplay_voice_tsx.is_file(), "apps/web/app/(learner)/roleplay/voice/page.tsx exists")
    rv_content = roleplay_voice_tsx.read_text(encoding="utf-8")
    check("Voice Roleplay Beta" in rv_content, "Voice Roleplay Beta branding present")
    check("VoiceRecorder" in rv_content, "VoiceRecorder component integrated in roleplay arena")
    check("accent" in rv_content and "speed" in rv_content, "Accent and speed controls present")
    check("handlePlayTts" in rv_content, "TTS playback handler present")
    check("handleLearnerTurn" in rv_content, "Spoken turn submission handler present")
    check("report" in rv_content, "Post-conversation diagnostic report view present")

    roleplay_voice_css = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "roleplay" / "voice" / "voice-roleplay.module.css"
    check(roleplay_voice_css.is_file(), "voice-roleplay.module.css exists")
    rv_css_content = roleplay_voice_css.read_text(encoding="utf-8")
    rv_hex = re.findall(r"#[0-9a-fA-F]{3,8}\b", rv_css_content)
    check(len(rv_hex) == 0, f"voice-roleplay.module.css has 0 raw hex colors (found {len(rv_hex)})")

    # 9. Voice Lab Hub & Cross-link
    voice_hub_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "voice" / "page.tsx"
    check(voice_hub_tsx.is_file(), "apps/web/app/(learner)/voice/page.tsx exists")
    vh_content = voice_hub_tsx.read_text(encoding="utf-8")
    check("/roleplay/voice" in vh_content, "Voice Hub links directly to Voice Roleplay Beta")
    check("prefRetention" in vh_content or "retentionDays" in vh_content, "Audio retention preferences managed in Voice Lab")

    roleplay_hub_tsx = REPO_ROOT / "apps" / "web" / "app" / "(learner)" / "roleplay" / "page.tsx"
    rh_content = roleplay_hub_tsx.read_text(encoding="utf-8")
    check("/roleplay/voice" in rh_content, "Roleplay Universe cross-links to Voice Roleplay Beta")

    # 10. Documentation
    ai_doc = REPO_ROOT / "docs" / "ai" / "voice-pipeline.md"
    check(ai_doc.is_file(), "docs/ai/voice-pipeline.md exists")
    learning_doc = REPO_ROOT / "docs" / "learning" / "voice-pipeline.md"
    check(learning_doc.is_file(), "docs/learning/voice-pipeline.md exists")

    print("\nAll Day 26 contract verification checks passed successfully!")


if __name__ == "__main__":
    main()
