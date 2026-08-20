from dataclasses import dataclass


@dataclass(frozen=True)
class MicrophoneReadiness:
    supported: bool
    reason: str


def microphone_status(user_agent: str = "") -> MicrophoneReadiness:
    return MicrophoneReadiness(
        supported=True,
        reason="Browser microphone permission can be requested before voice beta features.",
    )


def build_ai_text_feedback(text: str) -> dict:
    return {
        "text": text,
        "scope": "practice_feedback",
        "limitations": "AI feedback is guidance and requires human review for high-stakes decisions.",
    }
