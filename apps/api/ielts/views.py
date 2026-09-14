from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from ielts.models import (
    IELTSTest,
    IELTSTestStatus,
    IELTSBandDescriptor,
    IELTSTestSession,
    IELTSAttemptStatus,
)
from ielts.serializers import (
    IELTSTestListSerializer,
    IELTSTestDetailSerializer,
    IELTSBandDescriptorSerializer,
    ReviewApprovalInputSerializer,
    LearnerActiveSessionSerializer,
    IELTSSessionHistorySerializer,
    StartSessionInputSerializer,
    RecordAnswerInputSerializer,
)
from ielts.services import (
    submit_test_for_review,
    review_and_approve_test,
    publish_test,
    clone_test_new_version,
)
from ielts.session_services import (
    start_or_resume_session,
    record_answer,
    toggle_flag,
    advance_section,
    submit_session,
    compile_full_diagnostic_report,
)


def is_editor_or_admin(user) -> bool:
    if not user or not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser:
        return True
    return getattr(user, "role", None) in [User.Role.ADMINISTRATOR, User.Role.EDITOR]


class AdminIELTSTestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی تنها برای مدیران و ویراستاران محتوا مجاز است."}, status=status.HTTP_403_FORBIDDEN)

        status_filter = request.query_params.get("status")
        type_filter = request.query_params.get("test_type")

        qs = IELTSTest.objects.all().select_related("author", "reviewed_by").prefetch_related("sections")
        if status_filter:
            qs = qs.filter(status=status_filter)
        if type_filter:
            qs = qs.filter(test_type=type_filter)

        serializer = IELTSTestListSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی تنها برای مدیران و ویراستاران محتوا مجاز است."}, status=status.HTTP_403_FORBIDDEN)

        serializer = IELTSTestDetailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        test = serializer.save(
            author=request.user,
            status=IELTSTestStatus.DRAFT,
            version=1,
            is_locked=False,
        )
        return Response(IELTSTestDetailSerializer(test).data, status=status.HTTP_201_CREATED)


class AdminIELTSTestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی تنها برای مدیران و ویراستاران محتوا مجاز است."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(
            IELTSTest.objects.select_related("author", "reviewed_by").prefetch_related(
                "sections__passages_tasks__question_groups__questions"
            ),
            pk=test_id,
        )
        serializer = IELTSTestDetailSerializer(test)
        return Response(serializer.data)

    def patch(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی تنها برای مدیران و ویراستاران محتوا مجاز است."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(IELTSTest, pk=test_id)
        if test.is_locked:
            return Response(
                {"detail": "این نسخه از آزمون قفل شده است و تغییر آن مجاز نیست. لطفاً یک نسخه جدید ایجاد کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = IELTSTestDetailSerializer(test, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        updated_test = serializer.save()
        return Response(IELTSTestDetailSerializer(updated_test).data)


class AdminSubmitReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی غیرمجاز."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(IELTSTest, pk=test_id)
        try:
            submitted = submit_test_for_review(test, request.user)
            return Response(IELTSTestDetailSerializer(submitted).data)
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class AdminApproveReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی غیرمجاز."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(IELTSTest, pk=test_id)
        input_serializer = ReviewApprovalInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        checklist = input_serializer.validated_data["checklist"]
        notes = input_serializer.validated_data.get("notes", "")

        try:
            approved = review_and_approve_test(
                test=test,
                reviewer=request.user,
                checklist=checklist,
                notes=notes,
            )
            return Response(IELTSTestDetailSerializer(approved).data)
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class AdminPublishTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی غیرمجاز."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(IELTSTest, pk=test_id)
        try:
            published = publish_test(test, request.user)
            return Response(IELTSTestDetailSerializer(published).data)
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class AdminCloneNewVersionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, test_id):
        if not is_editor_or_admin(request.user):
            return Response({"detail": "دسترسی غیرمجاز."}, status=status.HTTP_403_FORBIDDEN)

        test = get_object_or_404(
            IELTSTest.objects.prefetch_related("sections__passages_tasks__question_groups__questions"),
            pk=test_id,
        )
        new_test = clone_test_new_version(test, request.user)
        return Response(IELTSTestDetailSerializer(new_test).data, status=status.HTTP_201_CREATED)


class IELTSBandDescriptorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        section_type = request.query_params.get("section_type")
        criteria_key = request.query_params.get("criteria_key")

        qs = IELTSBandDescriptor.objects.all()
        if section_type:
            qs = qs.filter(section_type=section_type)
        if criteria_key:
            qs = qs.filter(criteria_key=criteria_key)

        serializer = IELTSBandDescriptorSerializer(qs, many=True)
        return Response(serializer.data)


class PublicIELTSTestListView(APIView):
    """
    Public catalogue of official-like practice tests for learners.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        type_filter = request.query_params.get("test_type")
        qs = IELTSTest.objects.filter(status=IELTSTestStatus.PUBLISHED).order_by("-created_at")
        if type_filter:
            qs = qs.filter(test_type=type_filter)

        serializer = IELTSTestListSerializer(qs, many=True)
        return Response({
            "disclaimer": "IELTS-like practice — not official IELTS / تمرین شبیه‌ساز آیلتس — غیررسمی",
            "results": serializer.data,
        })


# ---------------------------------------------------------------------------
# Learner IELTS Simulator & Timed Session Views
# ---------------------------------------------------------------------------

class LearnerStartSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartSessionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        test_id = serializer.validated_data["test_id"]
        mode = serializer.validated_data["mode"]

        try:
            session = start_or_resume_session(
                learner=request.user,
                test_id=str(test_id),
                mode=mode,
            )
            return Response(LearnerActiveSessionSerializer(session).data, status=status.HTTP_201_CREATED)
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class LearnerActiveSessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            IELTSTestSession.objects.select_related("test").prefetch_related(
                "test__sections__passages_tasks__question_groups__questions"
            ),
            pk=session_id,
            learner=request.user,
        )
        return Response(LearnerActiveSessionSerializer(session).data)


class LearnerRecordAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        serializer = RecordAnswerInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        question_id = serializer.validated_data["question_id"]
        answer = serializer.validated_data["answer"]

        try:
            session = record_answer(
                session_id=session_id,
                learner=request.user,
                question_id=str(question_id),
                answer_val=answer,
            )
            return Response({
                "success": True,
                "question_id": str(question_id),
                "time_remaining_seconds": session.time_remaining_seconds,
            })
        except ValidationError as exc:
            msg = exc.message if hasattr(exc, "message") else str(exc)
            return Response({"detail": msg}, status=status.HTTP_400_BAD_REQUEST)


class LearnerToggleFlagView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        question_id = request.data.get("question_id")
        if not question_id:
            return Response({"detail": "شناسه سوال الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

        session = toggle_flag(
            session_id=session_id,
            learner=request.user,
            question_id=str(question_id),
        )
        return Response({
            "success": True,
            "flagged_questions": session.flagged_questions,
        })


class LearnerAdvanceSectionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = advance_section(
            session_id=session_id,
            learner=request.user,
        )
        return Response(LearnerActiveSessionSerializer(session).data)


class LearnerSubmitSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = submit_session(
            session_id=session_id,
            learner=request.user,
        )
        return Response({
            "session_id": str(session.id),
            "status": session.status,
            "raw_score": float(session.raw_score) if session.raw_score is not None else 0.0,
            "scaled_band_score": float(session.scaled_band_score) if session.scaled_band_score is not None else 1.0,
            "completed_at": session.completed_at.isoformat() if session.completed_at else None,
        })


class LearnerSessionReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            IELTSTestSession.objects.select_related("test"),
            pk=session_id,
            learner=request.user,
        )
        if session.status not in [IELTSAttemptStatus.SUBMITTED, IELTSAttemptStatus.TIMED_OUT]:
            return Response(
                {"detail": "کارنامه تشخیصی تنها پس از اتمام و ثبت نهایی آزمون در دسترس است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = compile_full_diagnostic_report(session)
        return Response(report)


class LearnerSessionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = IELTSTestSession.objects.filter(learner=request.user).select_related("test").order_by("-created_at")
        serializer = IELTSSessionHistorySerializer(qs, many=True)
        return Response(serializer.data)

