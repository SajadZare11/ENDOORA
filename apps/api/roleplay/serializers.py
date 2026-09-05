from rest_framework import serializers

from .models import RoleplayMessage, RoleplayReport, RoleplaySession


class RoleplayMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleplayMessage
        fields = [
            "id",
            "session",
            "sender",
            "sender_name",
            "content",
            "timestamp",
        ]
        read_only_fields = ["id", "timestamp"]


class RoleplayReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleplayReport
        fields = [
            "id",
            "session",
            "goals_achieved_count",
            "total_goals_count",
            "communicative_score",
            "estimated_cefr",
            "accomplishments_fa",
            "accomplishments_en",
            "feedback_mistakes",
            "vocabulary_extracted",
            "xp_earned",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RoleplaySessionSerializer(serializers.ModelSerializer):
    messages = RoleplayMessageSerializer(many=True, read_only=True)
    report = RoleplayReportSerializer(read_only=True)

    class Meta:
        model = RoleplaySession
        fields = [
            "id",
            "learner",
            "scenario_id",
            "scenario_title",
            "status",
            "turn_count",
            "max_turns",
            "goals_completed",
            "xp_awarded",
            "created_at",
            "updated_at",
            "messages",
            "report",
        ]
        read_only_fields = [
            "id",
            "learner",
            "created_at",
            "updated_at",
            "messages",
            "report",
        ]
