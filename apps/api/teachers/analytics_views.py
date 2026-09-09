from django.core.exceptions import PermissionDenied, ValidationError
from django.http import HttpResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from teachers.analytics_serializers import (
    AtRiskAlertResolveInputSerializer,
    AtRiskAlertSerializer,
    TeacherInterventionCreateSerializer,
    TeacherInterventionSerializer,
    TeacherInterventionUpdateSerializer,
)
from teachers.analytics_services import TeacherAnalyticsService


class TeacherAnalyticsOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            overview = TeacherAnalyticsService.get_teacher_analytics_overview(request.user)
            return Response(overview, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherClassAnalyticsReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_id):
        try:
            report = TeacherAnalyticsService.get_class_analytics_report(request.user, str(class_id))
            return Response(report, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherClassAnalyticsExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_id):
        try:
            csv_content = TeacherAnalyticsService.export_class_analytics_csv(request.user, str(class_id))
            response = HttpResponse(csv_content, content_type="text/csv; charset=utf-8")
            response["Content-Disposition"] = f'attachment; filename="class_analytics_{class_id}.csv"'
            return response
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherLearnerAnalyticsProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, class_id, learner_id):
        try:
            profile = TeacherAnalyticsService.get_learner_analytics_profile(
                request.user, str(class_id), str(learner_id)
            )
            return Response(profile, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherAtRiskAlertsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from teachers.models import AtRiskAlert, AlertStatus
        qs = AtRiskAlert.objects.filter(teacher=request.user).select_related(
            "learner", "teacher_class"
        )
        class_id = request.query_params.get("class_id")
        if class_id:
            qs = qs.filter(teacher_class_id=class_id)
        severity = request.query_params.get("severity")
        if severity:
            qs = qs.filter(severity=severity)
        alert_status = request.query_params.get("status")
        if alert_status:
            qs = qs.filter(status=alert_status)
        else:
            # By default, active and acknowledged
            qs = qs.filter(status__in=[AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED])

        serializer = AtRiskAlertSerializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TeacherAtRiskAlertAcknowledgeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, alert_id):
        try:
            alert = TeacherAnalyticsService.acknowledge_at_risk_alert(request.user, str(alert_id))
            return Response(AtRiskAlertSerializer(alert).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherAtRiskAlertResolveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, alert_id):
        serializer = AtRiskAlertResolveInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notes = serializer.validated_data.get("resolution_notes", "")
        try:
            alert = TeacherAnalyticsService.resolve_at_risk_alert(request.user, str(alert_id), notes)
            return Response(AtRiskAlertSerializer(alert).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherInterventionsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        class_id = request.query_params.get("class_id")
        learner_id = request.query_params.get("learner_id")
        int_status = request.query_params.get("status")
        interventions = TeacherAnalyticsService.list_teacher_interventions(
            request.user, class_id=class_id, learner_id=learner_id, status=int_status
        )
        return Response(TeacherInterventionSerializer(interventions, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TeacherInterventionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            intervention = TeacherAnalyticsService.create_teacher_intervention(
                request.user, serializer.validated_data
            )
            return Response(TeacherInterventionSerializer(intervention).data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)


class TeacherInterventionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, intervention_id):
        from teachers.models import TeacherIntervention
        intervention = TeacherIntervention.objects.filter(
            id=intervention_id, teacher=request.user
        ).select_related("learner", "teacher_class", "alert").first()
        if not intervention:
            return Response({"error": "Intervention not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TeacherInterventionSerializer(intervention).data, status=status.HTTP_200_OK)

    def patch(self, request, intervention_id):
        serializer = TeacherInterventionUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            intervention = TeacherAnalyticsService.update_teacher_intervention(
                request.user, str(intervention_id), serializer.validated_data
            )
            return Response(TeacherInterventionSerializer(intervention).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
