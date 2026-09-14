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
    IELTSWritingSubmission,
    IELTSWritingSubmissionStatus,
    IELTSPassageTask,
    IELTSSectionType,
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
    IELTSWritingPromptSerializer,
    IELTSWritingDraftSerializer,
    IELTSWritingSubmitInputSerializer,
    IELTSWritingReportSerializer,
    IELTSWritingHistorySerializer,
)
from ielts.writing_evaluator import count_words, evaluate_ielts_writing_submission
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


# =============================================================================
# IELTS WRITING SIMULATION & AI EVALUATION VIEWS (IELTS-003 & IELTS-004)
# =============================================================================

DEFAULT_TASK1_PROMPT = {
    "id": "default-task1",
    "title": "Task 1: Renewable Energy Generation in Northern Europe",
    "content_text": (
        "The bar chart illustrates the proportion of domestic electricity generated from renewable sources "
        "(wind, hydro, and solar) across Denmark, Norway, and Sweden between 2015 and 2025.\n\n"
        "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.\n"
        "Write at least 150 words."
    ),
    "media_image_url": "https://media.endoora.ir/diagrams/ielts/mini01_energy_chart.png",
    "word_count": 150,
    "task_type": "writing_task1_academic",
    "test_id": None,
}

DEFAULT_TASK2_PROMPT = {
    "id": "default-task2",
    "title": "Task 2: Artificial Intelligence in Primary and Secondary Education",
    "content_text": (
        "Some educators assert that incorporating artificial intelligence tutors and adaptive learning platforms into schools "
        "substantially enhances student motivation and personalizes instruction. Others contend that algorithmic learning undermines "
        "critical inquiry and diminishes vital human empathy between students and classroom teachers.\n\n"
        "Discuss both views and give your own opinion.\n"
        "Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n"
        "Write at least 250 words."
    ),
    "media_image_url": "",
    "word_count": 250,
    "task_type": "writing_task2_essay",
    "test_id": None,
}


class IELTSWritingPromptsCatalogView(APIView):
    """
    Returns available Writing Task 1 and Task 2 prompts from seeded published tests or practice bank.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        prompts = []
        # Find published writing passage tasks
        tasks = IELTSPassageTask.objects.filter(
            section__section_type=IELTSSectionType.WRITING,
            section__test__status=IELTSTestStatus.PUBLISHED,
        ).select_related("section__test")

        if tasks.exists():
            for t in tasks:
                task_type = "writing_task1_academic" if t.order == 1 else "writing_task2_essay"
                prompts.append({
                    "id": str(t.id),
                    "title": t.title,
                    "content_text": t.content_text,
                    "media_image_url": t.media_image_url,
                    "word_count": t.word_count or (150 if t.order == 1 else 250),
                    "task_type": task_type,
                    "test_id": str(t.section.test.id),
                })
        else:
            prompts = [DEFAULT_TASK1_PROMPT, DEFAULT_TASK2_PROMPT]

        return Response(IELTSWritingPromptSerializer(prompts, many=True).data)


class IELTSWritingDraftView(APIView):
    """
    Autosaves or retrieves an in-progress writing draft (IELTS-003).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, submission_id=None):
        if submission_id:
            submission = get_object_or_404(
                IELTSWritingSubmission,
                pk=submission_id,
                learner=request.user,
            )
        else:
            submission = IELTSWritingSubmission.objects.filter(
                learner=request.user,
                status=IELTSWritingSubmissionStatus.DRAFT,
            ).order_by("-updated_at").first()

        if not submission:
            return Response(
                {"detail": "پیش‌نویس فعالی یافت نشد."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(IELTSWritingDraftSerializer(submission).data)

    def post(self, request, submission_id=None):
        data = request.data
        sub_id = submission_id or data.get("submission_id")

        task1_text = data.get("task1_text", "")
        task2_text = data.get("task2_text", "")
        task1_w = count_words(task1_text)
        task2_w = count_words(task2_text)

        if sub_id:
            submission = get_object_or_404(
                IELTSWritingSubmission,
                pk=sub_id,
                learner=request.user,
            )
            submission.task1_text = task1_text
            submission.task1_word_count = task1_w
            submission.task1_time_seconds = data.get("task1_time_seconds", submission.task1_time_seconds)
            submission.task2_text = task2_text
            submission.task2_word_count = task2_w
            submission.task2_time_seconds = data.get("task2_time_seconds", submission.task2_time_seconds)
            if "task1_prompt_title" in data:
                submission.task1_prompt_title = data["task1_prompt_title"]
            if "task1_prompt_text" in data:
                submission.task1_prompt_text = data["task1_prompt_text"]
            if "task1_image_url" in data:
                submission.task1_image_url = data["task1_image_url"]
            if "task2_prompt_title" in data:
                submission.task2_prompt_title = data["task2_prompt_title"]
            if "task2_prompt_text" in data:
                submission.task2_prompt_text = data["task2_prompt_text"]
            submission.save()
        else:
            submission = IELTSWritingSubmission.objects.create(
                learner=request.user,
                task1_prompt_title=data.get("task1_prompt_title", DEFAULT_TASK1_PROMPT["title"]),
                task1_prompt_text=data.get("task1_prompt_text", DEFAULT_TASK1_PROMPT["content_text"]),
                task1_image_url=data.get("task1_image_url", DEFAULT_TASK1_PROMPT["media_image_url"]),
                task1_text=task1_text,
                task1_word_count=task1_w,
                task1_time_seconds=data.get("task1_time_seconds", 0),
                task2_prompt_title=data.get("task2_prompt_title", DEFAULT_TASK2_PROMPT["title"]),
                task2_prompt_text=data.get("task2_prompt_text", DEFAULT_TASK2_PROMPT["content_text"]),
                task2_text=task2_text,
                task2_word_count=task2_w,
                task2_time_seconds=data.get("task2_time_seconds", 0),
                status=IELTSWritingSubmissionStatus.DRAFT,
            )

        return Response({
            "success": True,
            "submission_id": str(submission.id),
            "status": submission.status,
            "task1_word_count": submission.task1_word_count,
            "task2_word_count": submission.task2_word_count,
            "updated_at": submission.updated_at.isoformat(),
        })


class IELTSWritingSubmitView(APIView):
    """
    Evaluates and grades full IELTS Writing submission via multi-dimensional AI rubric (IELTS-004).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = IELTSWritingSubmitInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        vd = serializer.validated_data
        sub_id = vd.get("submission_id")
        task1_text = vd.get("task1_text", "")
        task2_text = vd.get("task2_text", "")
        t1_time = vd.get("task1_time_seconds", 0)
        t2_time = vd.get("task2_time_seconds", 0)

        # Retrieve existing draft or create new
        if sub_id:
            submission = get_object_or_404(
                IELTSWritingSubmission,
                pk=sub_id,
                learner=request.user,
            )
        else:
            submission = IELTSWritingSubmission(learner=request.user)

        submission.task1_prompt_title = vd.get("task1_prompt_title") or submission.task1_prompt_title or DEFAULT_TASK1_PROMPT["title"]
        submission.task1_prompt_text = vd.get("task1_prompt_text") or submission.task1_prompt_text or DEFAULT_TASK1_PROMPT["content_text"]
        submission.task1_image_url = vd.get("task1_image_url") or submission.task1_image_url or DEFAULT_TASK1_PROMPT["media_image_url"]
        submission.task1_text = task1_text
        submission.task1_word_count = count_words(task1_text)
        submission.task1_time_seconds = t1_time

        submission.task2_prompt_title = vd.get("task2_prompt_title") or submission.task2_prompt_title or DEFAULT_TASK2_PROMPT["title"]
        submission.task2_prompt_text = vd.get("task2_prompt_text") or submission.task2_prompt_text or DEFAULT_TASK2_PROMPT["content_text"]
        submission.task2_text = task2_text
        submission.task2_word_count = count_words(task2_text)
        submission.task2_time_seconds = t2_time

        # Run AI Evaluation
        eval_result = evaluate_ielts_writing_submission(
            task1_text=task1_text,
            task2_text=task2_text,
            task1_time_seconds=t1_time,
            task2_time_seconds=t2_time,
        )

        submission.status = IELTSWritingSubmissionStatus.EVALUATED
        submission.overall_band = eval_result["overall_band"]
        submission.overall_band_min = eval_result["overall_band_min"]
        submission.overall_band_max = eval_result["overall_band_max"]
        submission.confidence_score = eval_result["confidence_score"]
        submission.cefr_level = eval_result["cefr_level"]
        submission.task1_scores = eval_result["task1_scores"]
        submission.task2_scores = eval_result["task2_scores"]
        submission.criteria_breakdown = eval_result["criteria_breakdown"]
        submission.annotations = eval_result["annotations"]
        submission.pedagogical_advice = eval_result["pedagogical_advice"]
        submission.save()

        return Response(IELTSWritingReportSerializer(submission).data, status=status.HTTP_201_CREATED)


class IELTSWritingReportView(APIView):
    """
    Returns full diagnostic evaluation report for an evaluated submission (IELTS-004).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, submission_id):
        submission = get_object_or_404(
            IELTSWritingSubmission,
            pk=submission_id,
            learner=request.user,
        )
        return Response(IELTSWritingReportSerializer(submission).data)


class IELTSWritingHistoryView(APIView):
    """
    Candidate's past IELTS Writing attempts history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = IELTSWritingSubmission.objects.filter(learner=request.user).order_by("-created_at")
        return Response(IELTSWritingHistorySerializer(qs, many=True).data)


class IELTSWritingTeacherReviewRequestView(APIView):
    """
    Escalates an AI-evaluated essay to a certified human IELTS examiner/teacher.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, submission_id):
        submission = get_object_or_404(
            IELTSWritingSubmission,
            pk=submission_id,
            learner=request.user,
        )
        submission.teacher_review_requested = True
        submission.save()
        return Response({
            "success": True,
            "message": "درخواست بازبینی و تصحیح توسط اگزمینر رسمی اندورا با موفقیت ثبت شد.",
            "submission_id": str(submission.id),
        })


