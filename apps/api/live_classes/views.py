from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import LiveClassCohort
from .serializers import (
    ClaimCohortInputSerializer,
    ClassEnrollmentRequestInputSerializer,
    TeacherSessionLogInputSerializer,
)
from .services import (
    claim_and_create_cohort,
    get_learner_class_status,
    get_open_class_requests_for_teachers,
    log_teacher_session,
    recommend_curriculum_for_user,
    submit_enrollment_request,
)


class CurriculumRecommendationView(APIView):
    """
    GET /api/curriculum/recommendation/
    Returns the recommended textbook, track, and visual syllabus roadmap
    based on the student's placement assessment and profile.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        rec = recommend_curriculum_for_user(user)
        return Response(rec, status=status.HTTP_200_OK)


class ClassEnrollmentRequestView(APIView):
    """
    POST /api/classes/request/
    Learner submits class format preference (solo vs group) and available schedule slots.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClassEnrollmentRequestInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        req = submit_enrollment_request(
            user=request.user,
            preferred_format=data["preferred_format"],
            max_classmates=data["max_classmates"],
            available_slots=data.get("available_slots", []),
            notes=data.get("notes", ""),
        )

        return Response(
            {
                "success": True,
                "request_id": str(req.id),
                "status": req.status,
                "preferred_format": req.preferred_format,
                "target_book": req.target_book.book_title if req.target_book else None,
                "message_fa": "درخواست ثبت‌نام شما با موفقیت ثبت شد و به استخر مدرسان ارسال گردید.",
                "message_en": "Your class enrollment request was registered and sent to verified teachers.",
            },
            status=status.HTTP_201_CREATED,
        )


class LearnerClassStatusView(APIView):
    """
    GET /api/classes/my-status/ (and /api/learner/class-status/)
    Returns the learner's active class, meeting link, and latest teacher session log notes.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_data = get_learner_class_status(request.user)
        return Response(status_data, status=status.HTTP_200_OK)


class TeacherOpenRequestsView(APIView):
    """
    GET /api/teacher/open-requests/
    Lists open student enrollment requests with algorithmic cohort matching suggestions.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_open_class_requests_for_teachers()
        return Response(data, status=status.HTTP_200_OK)


class TeacherClaimCohortView(APIView):
    """
    POST /api/teacher/classes/claim/
    Teacher claims 1 to 4 matching student requests to form an active cohort.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClaimCohortInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            cohort = claim_and_create_cohort(
                teacher=request.user,
                request_ids=[str(rid) for rid in data["request_ids"]],
                title=data.get("title", ""),
                meeting_url=data.get("meeting_url", ""),
                schedule_summary=data.get("schedule_summary", ""),
                next_session_at=data.get("next_session_at"),
            )
            return Response(
                {
                    "success": True,
                    "cohort_id": str(cohort.id),
                    "title": cohort.title,
                    "students_count": cohort.students.count(),
                    "message_fa": f"کلاس آنلاین با {cohort.students.count()} زبان‌آموز تشکیل شد.",
                    "message_en": f"Online class formed with {cohort.students.count()} students.",
                },
                status=status.HTTP_201_CREATED,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeacherLogSessionView(APIView):
    """
    POST /api/teacher/sessions/log/
    Teacher records session units, grammar, vocab, homework, and next session time.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TeacherSessionLogInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            session_log = log_teacher_session(
                teacher=request.user,
                cohort_id=str(data["cohort_id"]),
                units_covered=data["units_covered"],
                grammar_covered=data.get("grammar_covered", ""),
                vocabulary_list=data.get("vocabulary_list", []),
                homework_description=data.get("homework_description", ""),
                teacher_notes=data.get("teacher_notes", ""),
                next_session_at=data.get("next_session_at"),
            )
            return Response(
                {
                    "success": True,
                    "log_id": str(session_log.id),
                    "session_number": session_log.session_number,
                    "homework_description": session_log.homework_description,
                    "message_fa": f"گزارش جلسه {session_log.session_number} با موفقیت ثبت شد و تکالیف به زبان‌آموزان ابلاغ گردید.",
                    "message_en": f"Session {session_log.session_number} logged successfully and homework dispatched.",
                },
                status=status.HTTP_201_CREATED,
            )
        except LiveClassCohort.DoesNotExist:
            return Response({"error": "کلاس یافت نشد یا شما مدرس این کلاس نیستید."}, status=status.HTTP_404_NOT_FOUND)
