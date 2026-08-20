from rest_framework import serializers

from .models import PlacementAnswer, PlacementSession


class PlacementAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementAnswer
        fields = [
            "question_key",
            "answer_value",
            "idempotency_key",
            "updated_at",
        ]


class PlacementSessionSerializer(serializers.ModelSerializer):
    answers = PlacementAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = PlacementSession
        fields = [
            "id",
            "status",
            "current_section",
            "expires_at",
            "answers",
        ]
