from __future__ import annotations

from decimal import Decimal
from typing import Any

from django.core.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from teachers.assignment_serializers import (
    AssignmentAccommodationInputSerializer,
    AssignmentAccommodationSerializer,
    AssignmentAttemptSerializer,
    AssignmentCreateDraftSerializer,
    AssignmentDeliveryInputSerializer,
    AssignmentDetailSerializer,
    AssignmentListSerializer,
    AssignmentQuestionsInputSerializer,
    AutosaveInputSerializer,
    GradeAttemptInputSerializer,
    SubmitInputSerializer,
)
from teachers.assignment_services import AssignmentService
from teachers.models import (
    Assignment,
    AssignmentAccommodation,
    AssignmentAttempt,
    AssignmentStatus,
    AttemptStatus,
)


class TeacherAssignmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Assignment.objects.filter(teacher=request.user).select_related("teacher_class")
        class_id = request.query_params.get("class_id")
        if class_id:
            qs = qs.filter(teacher_class_id=class_id)
        stat = request.query_params.get("status")
        if stat:
            qs = qs.filter(status=stat)

        serializer = AssignmentListSerializer(qs.order_by("-updated_at"), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AssignmentCreateDraftSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            assignment = AssignmentService.create_assignment_draft(
                teacher=request.user,
                class_id=str(data["class_id"]),
                title=data["title"],
                description=data.get("description", ""),
                instructions=data.get("instructions", ""),
                target_cefr=data.get("target_cefr", "B1"),
            )
            return Response(
                AssignmentDetailSerializer(assignment).data,
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherAssignmentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, assignment_id):
        assignment = Assignment.objects.filter(id=assignment_id, teacher=request.user).first()
        if not assignment:
            return Response({"detail": "Assignment not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)
        return Response(AssignmentDetailSerializer(assignment).data)

    def patch(self, request, assignment_id):
        title = request.data.get("title")
        description = request.data.get("description")
        instructions = request.data.get("instructions")
        target_cefr = request.data.get("target_cefr")
        expected_version = request.data.get("expected_version")

        try:
            assignment = AssignmentService.update_assignment_draft(
                teacher=request.user,
                assignment_id=str(assignment_id),
                title=title,
                description=description,
                instructions=instructions,
                target_cefr=target_cefr,
                expected_version=expected_version,
            )
            return Response(AssignmentDetailSerializer(assignment).data)
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, assignment_id):
        assignment = Assignment.objects.filter(id=assignment_id, teacher=request.user).first()
        if not assignment:
            return Response({"detail": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)

        if assignment.status != AssignmentStatus.DRAFT:
            return Response(
                {"detail": "Only draft assignments can be permanently deleted. Archive published assignments instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TeacherAssignmentQuestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, assignment_id):
        serializer = AssignmentQuestionsInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            assignment = AssignmentService.set_assignment_questions(
                teacher=request.user,
                assignment_id=str(assignment_id),
                questions_data=data["questions"],
                expected_version=data.get("expected_version"),
            )
            return Response(AssignmentDetailSerializer(assignment).data)
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherAssignmentDeliveryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, assignment_id):
        serializer = AssignmentDeliveryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            assignment = AssignmentService.configure_delivery(
                teacher=request.user,
                assignment_id=str(assignment_id),
                due_date=data["due_date"],
                grace_period_minutes=data.get("grace_period_minutes", 0),
                allow_late_submission=data.get("allow_late_submission", False),
                max_attempts=data.get("max_attempts", 1),
                time_limit_minutes=data.get("time_limit_minutes"),
                passing_percentage=data.get("passing_percentage", 60),
                expected_version=data.get("expected_version"),
            )
            return Response(AssignmentDetailSerializer(assignment).data)
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherAssignmentAccommodationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, assignment_id):
        assignment = Assignment.objects.filter(id=assignment_id, teacher=request.user).first()
        if not assignment:
            return Response({"detail": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)
        accommodations = assignment.accommodations.select_related("learner").all()
        return Response(AssignmentAccommodationSerializer(accommodations, many=True).data)

    def post(self, request, assignment_id):
        serializer = AssignmentAccommodationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            accommodation = AssignmentService.set_learner_accommodation(
                teacher=request.user,
                assignment_id=str(assignment_id),
                learner_id=str(data["learner_id"]),
                extra_time_minutes=data.get("extra_time_minutes", 0),
                extra_attempts=data.get("extra_attempts", 0),
                extended_due_date=data.get("extended_due_date"),
                notes=data.get("notes", ""),
            )
            return Response(AssignmentAccommodationSerializer(accommodation).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherAssignmentPublishView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, assignment_id):
        try:
            assignment = AssignmentService.publish_assignment(
                teacher=request.user,
                assignment_id=str(assignment_id),
            )
            return Response(AssignmentDetailSerializer(assignment).data)
        except ValidationError as e:
            return Response({"detail": e.messages if hasattr(e, "messages") else str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherQuestionBankBrowseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        q = request.query_params.get("q")
        cefr = request.query_params.get("cefr")
        qtype = request.query_params.get("type")
        limit = int(request.query_params.get("limit", 50))
        results = AssignmentService.browse_question_bank(q=q, cefr=cefr, question_type=qtype, limit=limit)
        return Response(results)


class TeacherAssignmentSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, assignment_id):
        assignment = Assignment.objects.filter(id=assignment_id, teacher=request.user).first()
        if not assignment:
            return Response({"detail": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)

        attempts = (
            assignment.attempts.select_related("learner", "assignment")
            .order_by("-started_at")
        )
        serializer = AssignmentAttemptSerializer(attempts, many=True)
        return Response(serializer.data)


class TeacherAttemptGradeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, attempt_id):
        attempt = (
            AssignmentAttempt.objects.filter(id=attempt_id, assignment__teacher=request.user)
            .select_related("assignment", "learner")
            .first()
        )
        if not attempt:
            return Response({"detail": "Attempt not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        serializer = GradeAttemptInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        score = Decimal(str(data["score_awarded"]))
        total_pts = attempt.assignment.total_points
        attempt.score_awarded = score
        if total_pts > Decimal("0.00"):
            attempt.percentage = (score / total_pts) * Decimal("100.00")
        attempt.teacher_feedback = data.get("teacher_feedback", "").strip()
        attempt.status = AttemptStatus.GRADED
        attempt.graded_by = request.user
        attempt.graded_at = timezone.now()
        attempt.save()

        return Response(AssignmentAttemptSerializer(attempt).data)


# ---------------------------------------------------------
# Learner Views
# ---------------------------------------------------------

class LearnerAssignmentsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        assignments = AssignmentService.get_learner_assignments(learner=request.user)
        return Response(assignments)


class LearnerAssignmentStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, assignment_id):
        try:
            attempt = AssignmentService.start_learner_attempt(
                learner=request.user,
                assignment_id=str(assignment_id),
            )
            payload = AssignmentService.get_attempt_learner_payload(attempt)
            return Response(payload, status=status.HTTP_200_OK)
        except PermissionDenied as pe:
            return Response({"detail": str(pe)}, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as ve:
            return Response({"detail": ve.messages if hasattr(ve, "messages") else str(ve)}, status=status.HTTP_400_BAD_REQUEST)


class LearnerAttemptAutosaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, attempt_id):
        serializer = AutosaveInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data["answers"]

        try:
            result = AssignmentService.autosave_attempt(
                learner=request.user,
                attempt_id=str(attempt_id),
                answers=answers,
            )
            return Response(result)
        except ValidationError as ve:
            return Response({"detail": ve.messages if hasattr(ve, "messages") else str(ve)}, status=status.HTTP_400_BAD_REQUEST)


class LearnerAttemptSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, attempt_id):
        serializer = SubmitInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data.get("answers")

        try:
            attempt = AssignmentService.submit_attempt(
                learner=request.user,
                attempt_id=str(attempt_id),
                final_answers=answers,
            )
            return Response(AssignmentAttemptSerializer(attempt).data)
        except ValidationError as ve:
            return Response({"detail": ve.messages if hasattr(ve, "messages") else str(ve)}, status=status.HTTP_400_BAD_REQUEST)


class LearnerAttemptDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, attempt_id):
        attempt = (
            AssignmentAttempt.objects.filter(id=attempt_id, learner=request.user)
            .select_related("assignment")
            .first()
        )
        if not attempt:
            return Response({"detail": "Attempt not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(AssignmentAttemptSerializer(attempt).data)
