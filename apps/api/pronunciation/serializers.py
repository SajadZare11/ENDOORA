from rest_framework import serializers
from .models import PronunciationAttempt, PronunciationItem


class PronunciationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PronunciationItem
        fields = [
            "id",
            "item_id",
            "category",
            "title_en",
            "title_fa",
            "target_text",
            "ipa",
            "stress_pattern",
            "target_wpm",
            "difficulty_level",
            "l1_note_en",
            "l1_note_fa",
            "example_sentence",
            "created_at",
        ]


class PronunciationAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = PronunciationAttempt
        fields = [
            "id",
            "item_id",
            "target_text",
            "spoken_transcript",
            "duration_seconds",
            "speech_rate_wpm",
            "pause_count",
            "intelligibility_score",
            "stress_matched",
            "feedback_en",
            "feedback_fa",
            "saved_to_genome",
            "genome_pattern_key",
            "created_at",
        ]


class AnalyzeAttemptRequestSerializer(serializers.Serializer):
    item_id = serializers.CharField(required=False, default="", allow_blank=True)
    target_text = serializers.CharField(required=False, default="", allow_blank=True)
    spoken_transcript = serializers.CharField(required=False, default="", allow_blank=True)
    duration_seconds = serializers.FloatField(required=False, default=2.0)
    pause_count = serializers.IntegerField(required=False, default=0)


class SpectrogramPhonemeDiagnosticSerializer(serializers.Serializer):
    phoneme = serializers.CharField(max_length=16)
    ipa_symbol = serializers.CharField(max_length=16)
    detected_phoneme = serializers.CharField(max_length=16, required=False, allow_blank=True, default="")
    gop_score = serializers.FloatField(required=False, default=0.0)
    status = serializers.CharField(max_length=32, required=False, default="native")
    raw_log_ratio = serializers.FloatField(required=False, default=0.0)
    diagnostic_tip_fa = serializers.CharField(required=False, allow_blank=True, default="")
    articulatory_rule_en = serializers.CharField(required=False, allow_blank=True, default="")
    start_time_ms = serializers.FloatField(required=False, default=0.0)
    end_time_ms = serializers.FloatField(required=False, default=0.0)


class SpectrogramWordDiagnosticSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=128)
    word_score = serializers.FloatField(required=False, default=0.0)
    phonemes = SpectrogramPhonemeDiagnosticSerializer(many=True, required=False, default=list)


class SpectrogramDiagnosticSyncRequestSerializer(serializers.Serializer):
    sentence_text = serializers.CharField(max_length=500)
    module_source = serializers.CharField(max_length=64, required=False, default="PHONETICS_LAB")
    overall_score = serializers.FloatField(required=False, default=0.0)
    fluency_score = serializers.FloatField(required=False, default=0.0)
    ielts_band_estimate = serializers.CharField(max_length=16, required=False, default="6.5")
    total_phonemes = serializers.IntegerField(required=False, default=0)
    weak_phonemes = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    persian_l1_flags = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    words = SpectrogramWordDiagnosticSerializer(many=True, required=False, default=list)
    backend = serializers.CharField(max_length=32, required=False, default="webgpu")
    inference_time_ms = serializers.FloatField(required=False, default=0.0)

