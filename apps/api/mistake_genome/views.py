"""
Endoora AI Mistake Genome - API Views
Exposes endpoints for pattern exploration, evidence inspection, disputes, and targeting.
"""

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LearnerMistakePattern, MistakeEvidence
from .serializers import (
    LearnerMistakePatternSerializer,
    MistakeDisputeRequestSerializer,
    MistakeRecordRequestSerializer,
)
from .services import MistakeGenomeService


class MistakeGenomeSummaryView(APIView):
    """
    GET /api/mistakes/summary/
    Returns aggregated mistake patterns, status counts, and top practice targets.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        service = MistakeGenomeService()
        summary = service.get_learner_genome_summary(request.user)
        return Response(summary, status=status.HTTP_200_OK)


class MistakePatternListView(APIView):
    """
    GET /api/mistakes/patterns/
    Lists mistake patterns for the authenticated learner, with optional category & status filtering.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = LearnerMistakePattern.objects.filter(learner=request.user)

        category = request.query_params.get("category")
        if category and category != "all":
            queryset = queryset.filter(category=category)

        status_filter = request.query_params.get("status")
        if status_filter and status_filter != "all":
            queryset = queryset.filter(status=status_filter)

        serializer = LearnerMistakePatternSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MistakePatternDetailView(APIView):
    """
    GET /api/mistakes/patterns/<int:pk>/
    Retrieves full details of a specific pattern along with evidence history.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            pattern = LearnerMistakePattern.objects.get(pk=pk, learner=request.user)
        except LearnerMistakePattern.DoesNotExist:
            return Response(
                {"detail": "Mistake pattern not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LearnerMistakePatternSerializer(pattern)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MistakeDisputeView(APIView):
    """
    POST /api/mistakes/patterns/<int:pk>/dispute/
    Disputes a mistake pattern. Stops recommending it in active practice.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = MistakeDisputeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        reason = serializer.validated_data.get("reason", "")
        service = MistakeGenomeService()

        try:
            pattern = service.dispute_pattern(request.user, pk, reason=reason)
            return Response(
                LearnerMistakePatternSerializer(pattern).data,
                status=status.HTTP_200_OK,
            )
        except LearnerMistakePattern.DoesNotExist:
            return Response(
                {"detail": "Pattern not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )


class MistakeResolveView(APIView):
    """
    POST /api/mistakes/patterns/<int:pk>/resolve/
    Marks a mistake pattern as mastered/resolved.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        service = MistakeGenomeService()
        try:
            pattern = service.resolve_pattern(request.user, pk)
            return Response(
                LearnerMistakePatternSerializer(pattern).data,
                status=status.HTTP_200_OK,
            )
        except LearnerMistakePattern.DoesNotExist:
            return Response(
                {"detail": "Pattern not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )


class MistakeRecordView(APIView):
    """
    POST /api/mistakes/record/
    Records a detected mistake occurrence from learning activities.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MistakeRecordRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        service = MistakeGenomeService()

        pattern, evidence = service.record_mistake(
            learner=request.user,
            tag=data["tag"],
            category=data["category"],
            title_fa=data.get("title_fa", ""),
            title_en=data.get("title_en", ""),
            source_activity=data.get("source_activity", "exercise"),
            source_id=data.get("source_id", ""),
            raw_snippet=data.get("raw_snippet", ""),
            correction_snippet=data.get("correction_snippet", ""),
            explanation_fa=data.get("explanation_fa", ""),
            explanation_en=data.get("explanation_en", ""),
            severity=data.get("severity", "moderate"),
            l1_note_fa=data.get("l1_note_fa", ""),
            l1_note_en=data.get("l1_note_en", ""),
        )

        return Response(
            {
                "pattern": LearnerMistakePatternSerializer(pattern).data,
                "evidence_id": evidence.id,
                "status": pattern.status,
            },
            status=status.HTTP_201_CREATED,
        )


class MistakeEvidenceDeleteView(APIView):
    """
    DELETE /api/mistakes/evidence/<int:pk>/
    Scrubs personal raw snippet text from an evidence record.
    """

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        service = MistakeGenomeService()
        success = service.delete_evidence(request.user, pk)
        if not success:
            return Response(
                {"detail": "Evidence record not found or access denied."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"detail": "Personal text scrubbed in compliance with privacy retention."},
            status=status.HTTP_200_OK,
        )


class MistakeGenomeView(APIView):
    """
    GET /api/mistakes/mine/
    Legacy backward-compatible endpoint returning genome analysis.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        service = MistakeGenomeService()
        return Response(service.get_learner_genome_summary(request.user))
