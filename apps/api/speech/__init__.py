"""
Speech package backward compatibility bridge.
Re-exports core services and models from voice_lab.
"""

from voice_lab.models import AudioAttempt, VoicePreference, VoiceRecording
from voice_lab.services import VoicePipelineService

__all__ = [
    "VoiceRecording",
    "AudioAttempt",
    "VoicePreference",
    "VoicePipelineService",
]
