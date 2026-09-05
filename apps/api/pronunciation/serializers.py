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
