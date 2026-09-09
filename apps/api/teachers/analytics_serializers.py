import uuid
from decimal import Decimal
from rest_framework import serializers
from teachers.models import (
    AtRiskAlert,
    TeacherIntervention,
    AlertSeverity,
    AlertType,
    AlertStatus,
    InterventionType,
    InterventionStatus,
)


class AtRiskAlertSerializer(serializers.ModelSerializer):
    alert_type_display = serializers.CharField(source="get_alert_type_display", read_only=True)
    severity_display = serializers.CharField(source="get_severity_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    learner_name = serializers.SerializerMethodField()
    learner_email = serializers.EmailField(source="learner.email", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)

    class Meta:
        model = AtRiskAlert
        fields = [
            "id",
            "teacher_id",
            "learner_id",
            "learner_name",
            "learner_email",
            "teacher_class_id",
            "class_title",
            "alert_type",
            "alert_type_display",
            "severity",
            "severity_display",
            "status",
            "status_display",
            "title",
            "description",
            "metrics_snapshot",
            "acknowledged_at",
            "resolved_at",
            "resolution_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "teacher_id",
            "learner_id",
            "learner_name",
            "learner_email",
            "teacher_class_id",
            "class_title",
            "alert_type_display",
            "severity_display",
            "status_display",
            "created_at",
            "updated_at",
        ]

    def get_learner_name(self, obj):
        return (
            getattr(obj.learner, "name", "")
            or getattr(obj.learner, "first_name", "")
            or obj.learner.email.split("@")[0]
        )


class AtRiskAlertResolveInputSerializer(serializers.Serializer):
    resolution_notes = serializers.CharField(required=False, allow_blank=True, default="")


class TeacherInterventionSerializer(serializers.ModelSerializer):
    intervention_type_display = serializers.CharField(source="get_intervention_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    learner_name = serializers.SerializerMethodField()
    learner_email = serializers.EmailField(source="learner.email", read_only=True)
    class_title = serializers.CharField(source="teacher_class.title", read_only=True)
    alert_title = serializers.CharField(source="alert.title", read_only=True, default=None)

    class Meta:
        model = TeacherIntervention
        fields = [
            "id",
            "teacher_id",
            "learner_id",
            "learner_name",
            "learner_email",
            "teacher_class_id",
            "class_title",
            "alert_id",
            "alert_title",
            "intervention_type",
            "intervention_type_display",
            "status",
            "status_display",
            "title",
            "description",
            "action_data",
            "outcome_notes",
            "score_before",
            "score_after",
            "target_date",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "teacher_id",
            "learner_name",
            "learner_email",
            "class_title",
            "alert_title",
            "intervention_type_display",
            "status_display",
            "created_at",
            "updated_at",
        ]

    def get_learner_name(self, obj):
        return (
            getattr(obj.learner, "name", "")
            or getattr(obj.learner, "first_name", "")
            or obj.learner.email.split("@")[0]
        )


class TeacherInterventionCreateSerializer(serializers.Serializer):
    class_id = serializers.UUIDField()
    learner_id = serializers.UUIDField()
    alert_id = serializers.UUIDField(required=False, allow_null=True)
    intervention_type = serializers.ChoiceField(choices=InterventionType.choices)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    action_data = serializers.DictField(required=False, default=dict)
    score_before = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    target_date = serializers.DateTimeField(required=False, allow_null=True)


class TeacherInterventionUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=InterventionStatus.choices, required=False)
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(required=False)
    action_data = serializers.DictField(required=False)
    outcome_notes = serializers.CharField(required=False, allow_blank=True)
    score_before = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    score_after = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    target_date = serializers.DateTimeField(required=False, allow_null=True)
    auto_resolve_alert = serializers.BooleanField(required=False, default=False)
