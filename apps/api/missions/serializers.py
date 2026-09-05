from rest_framework import serializers
from .models import DailyMission
from .services import resolve_mission_next_action

class DailyMissionSerializer(serializers.ModelSerializer):
    target_skill = serializers.SerializerMethodField()
    reason_fa = serializers.SerializerMethodField()
    reason_en = serializers.SerializerMethodField()
    current_task_index = serializers.SerializerMethodField()
    total_tasks = serializers.SerializerMethodField()
    completed_count = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()
    next_best_action = serializers.SerializerMethodField()
    srs_due_count = serializers.SerializerMethodField()

    class Meta:
        model = DailyMission
        fields = [
            "id",
            "mission_date",
            "status",
            "title_fa",
            "title_en",
            "explanation_fa",
            "explanation_en",
            "target_skill",
            "reason_fa",
            "reason_en",
            "current_task_index",
            "total_tasks",
            "completed_count",
            "tasks",
            "next_best_action",
            "srs_due_count",
            "evidence_reason",
        ]

    def get_target_skill(self, obj: DailyMission) -> str:
        return obj.get_target_skill()

    def get_reason_fa(self, obj: DailyMission) -> str:
        if isinstance(obj.evidence_reason, dict):
            return str(obj.evidence_reason.get("reason_fa", "")).strip()
        return ""

    def get_reason_en(self, obj: DailyMission) -> str:
        if isinstance(obj.evidence_reason, dict):
            return str(obj.evidence_reason.get("reason_en", "")).strip()
        return ""

    def get_current_task_index(self, obj: DailyMission) -> int:
        return obj.get_current_task_index()

    def get_total_tasks(self, obj: DailyMission) -> int:
        return len(obj.get_tasks())

    def get_completed_count(self, obj: DailyMission) -> int:
        return len(obj.get_completed_task_ids())

    def get_tasks(self, obj: DailyMission) -> list[dict]:
        sanitized = []
        for task in obj.get_tasks():
            is_completed = bool(task.get("completed", False))
            task_dict = {
                "id": str(task.get("id", "")),
                "type": str(task.get("type", "multiple_choice")),
                "title_fa": str(task.get("title_fa", "")),
                "title_en": str(task.get("title_en", "")),
                "instruction_fa": str(task.get("instruction_fa", "")),
                "instruction_en": str(task.get("instruction_en", "")),
                "prompt_en": str(task.get("prompt_en", "")),
                "options": task.get("options", []),
                "completed": is_completed,
            }
            # Pre-submission payload protection:
            # Only reveal answer keys and explanations if task has been submitted
            if is_completed:
                task_dict["user_answer"] = task.get("user_answer")
                task_dict["is_correct"] = task.get("is_correct")
                task_dict["correct_option_id"] = task.get("correct_option_id")
                task_dict["explanation_fa"] = task.get("explanation_fa", "")
                task_dict["explanation_en"] = task.get("explanation_en", "")
            sanitized.append(task_dict)
        return sanitized

    def get_next_best_action(self, obj: DailyMission) -> dict | None:
        if obj.status == DailyMission.Status.COMPLETED or obj.is_all_completed():
            return resolve_mission_next_action(obj.user, obj)
        return None

    def get_srs_due_count(self, obj: DailyMission) -> int:
        from django.utils import timezone
        from srs.models import SrsItem
        return SrsItem.objects.filter(learner=obj.user, due_at__lte=timezone.now()).count()


class MissionStepSubmitSerializer(serializers.Serializer):
    task_id = serializers.CharField(required=True, max_length=64)
    selected_option_id = serializers.CharField(required=True, max_length=16)

class MissionStepFeedbackSerializer(serializers.Serializer):
    task_id = serializers.CharField()
    is_correct = serializers.BooleanField()
    selected_option_id = serializers.CharField()
    correct_option_id = serializers.CharField()
    explanation_fa = serializers.CharField()
    explanation_en = serializers.CharField()
    mission_status = serializers.CharField()
    all_completed = serializers.BooleanField()
    next_task_index = serializers.IntegerField(allow_null=True)
    next_best_action = serializers.DictField(allow_null=True)
