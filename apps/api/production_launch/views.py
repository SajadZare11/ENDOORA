from __future__ import annotations

import hashlib
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_dashboard.permissions import IsAdministratorOrStaff
from .models import GoldenFlowVerificationLog, ProductionLaunchSignoff
from .serializers import (
    GoldenFlowVerificationLogSerializer,
    ProductionLaunchSignoffSerializer,
    ProductionSignoffCreateSerializer,
)
from .services.golden_flow_runner import GoldenFlowVerificationRunner
from .services.launch_gate_checklist import LaunchGateChecklistEvaluator


class LaunchStatusView(APIView):
    """Returns the comprehensive 10-Point Master Launch Readiness Matrix and status."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        return Response(scorecard, status=status.HTTP_200_OK)


class GoldenFlowRehearsalView(APIView):
    """Triggers an automated end-to-end rehearsal across all 7 Golden Flows."""

    permission_classes = [IsAdministratorOrStaff]

    def post(self, request):
        result = GoldenFlowVerificationRunner.run_rehearsal(operator=request.user)
        return Response(result, status=status.HTTP_201_CREATED)


class ProductionSignoffView(APIView):
    """Retrieves or executes the formal production launch authorization sign-off."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        latest = ProductionLaunchSignoff.objects.order_by("-signed_at").first()
        if not latest:
            return Response({"detail": "هیچ امضای تاییدیه‌ای هنوز ثبت نشده است."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductionLaunchSignoffSerializer(latest).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductionSignoffCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        scorecard = LaunchGateChecklistEvaluator.evaluate_readiness()
        confirmation_hash = scorecard.get("confirmation_hash", "")
        if not confirmation_hash:
            confirmation_hash = hashlib.sha256(b"endoora-v1.0-certified-launch").hexdigest()

        signoff = ProductionLaunchSignoff.objects.create(
            authorized_by=request.user if request.user.is_authenticated else None,
            engineer_name=serializer.validated_data["engineer_name"],
            role=serializer.validated_data.get("role", "Principal Launch Architect"),
            checklist_version="day60-launch-v1.0",
            status=ProductionLaunchSignoff.Status.APPROVED,
            verification_score=scorecard.get("score", 100),
            confirmation_hash=confirmation_hash,
            notes=serializer.validated_data.get("notes", ""),
        )

        return Response(ProductionLaunchSignoffSerializer(signoff).data, status=status.HTTP_201_CREATED)


class GoldenFlowHistoryView(APIView):
    """Returns historical Golden Flow rehearsal audit logs."""

    permission_classes = [IsAdministratorOrStaff]

    def get(self, request):
        logs = GoldenFlowVerificationLog.objects.order_by("-rehearsed_at")[:20]
        return Response(GoldenFlowVerificationLogSerializer(logs, many=True).data, status=status.HTTP_200_OK)
