from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import DailyMission
from .services import build_daily_mission, start_daily_mission, submit_mission_step
from .serializers import (
    DailyMissionSerializer,
    MissionStepSubmitSerializer,
    MissionStepFeedbackSerializer,
)

class TodayMissionView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"code": "authentication_required", "detail": "Authentication required to view daily mission."}, status=status.HTTP_401_UNAUTHORIZED)
        mission = build_daily_mission(request.user)
        return Response(DailyMissionSerializer(mission).data)

class StartMissionView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"code": "authentication_required"}, status=status.HTTP_401_UNAUTHORIZED)
        mission = start_daily_mission(request.user)
        return Response(DailyMissionSerializer(mission).data)

class SubmitMissionStepView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"code": "authentication_required"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = MissionStepSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        task_id = serializer.validated_data["task_id"]
        selected_option_id = serializer.validated_data["selected_option_id"]

        try:
            feedback_data = submit_mission_step(request.user, task_id, selected_option_id)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(MissionStepFeedbackSerializer(feedback_data).data, status=status.HTTP_200_OK)

class ResetMissionView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"code": "authentication_required"}, status=status.HTTP_401_UNAUTHORIZED)
        mission = build_daily_mission(request.user)
        tasks = mission.get_tasks()
        for t in tasks:
            t["completed"] = False
            t.pop("user_answer", None)
            t.pop("is_correct", None)
        mission.evidence_reason["completed_task_ids"] = []
        mission.evidence_reason["current_task_index"] = 0
        mission.status = DailyMission.Status.READY
        mission.save(update_fields=["evidence_reason", "status"])
        return Response(DailyMissionSerializer(mission).data)
