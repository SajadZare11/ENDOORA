import base64
import hashlib
import hmac
import os

import jwt
from django.db import transaction
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import JSONParser
from permissions.base import IsVerifiedTeacher
from .access import classroom_role
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import (
    AttendanceRecord,
    LiveClassCohort,
    LiveClassQuiz,
    LiveKitEventReceipt,
    SessionAiRecap,
    SessionWhiteboardExport,
)
from .serializers import (
    AttendanceRecordSerializer,
    ClaimCohortInputSerializer,
    ClassEnrollmentRequestInputSerializer,
    GenerateAiRecapInputSerializer,
    LaunchQuizInputSerializer,
    LiveClassTokenInputSerializer,
    SubmitQuizResponseInputSerializer,
    TeacherAttendanceOverrideInputSerializer,
    TeacherSessionLogInputSerializer,
    WhiteboardPdfUploadSerializer,
)
from .services import (
    claim_and_create_cohort,
    create_livekit_token,
    finalize_session_attendance,
    generate_session_ai_recap,
    get_learner_class_status,
    get_open_class_requests_for_teachers,
    get_quiz_summary,
    get_session_attendance_summary,
    launch_in_class_quiz,
    log_teacher_session,
    publish_quiz_results,
    record_livekit_attendance_event,
    recommend_curriculum_for_user,
    save_whiteboard_export,
    submit_enrollment_request,
    submit_in_class_quiz_response,
    teacher_override_attendance,
)

User = get_user_model()


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
    permission_classes = [IsVerifiedTeacher]

    def get(self, request):
        data = get_open_class_requests_for_teachers()
        return Response(data, status=status.HTTP_200_OK)


class TeacherClaimCohortView(APIView):
    """
    POST /api/teacher/classes/claim/
    Teacher claims 1 to 4 matching student requests to form an active cohort.
    """
    permission_classes = [IsVerifiedTeacher]

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
    permission_classes = [IsVerifiedTeacher]

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


# ==============================================================================
# LiveKit Token View
# ==============================================================================

class LiveClassTokenView(APIView):
    """
    POST /api/live-classes/token/
    Generates a LiveKit JWT token for connecting to the classroom WebRTC room.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LiveClassTokenInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_id = serializer.validated_data["session_id"]
        user = request.user
        is_teacher = classroom_role(user, session_id) == "teacher"
        if not all(os.getenv(key) for key in ("LIVEKIT_API_KEY", "LIVEKIT_API_SECRET", "LIVEKIT_URL")):
            return Response({"detail": "Classroom provider unavailable."}, status=503)

        token_info = create_livekit_token(
            room_name=session_id,
            user=user,
            is_teacher=is_teacher,
            extra_metadata={"session_id": session_id},
        )
        return Response(token_info, status=status.HTTP_200_OK)


# ==============================================================================
# LiveKit Webhook (Attendance Tracking)
# ==============================================================================

class LiveKitJSONParser(JSONParser):
    media_type = "application/webhook+json"


class LiveKitWebhookView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [LiveKitJSONParser, JSONParser]

    @transaction.atomic
    def post(self, request):
        key, secret = os.getenv("LIVEKIT_API_KEY"), os.getenv("LIVEKIT_API_SECRET")
        if not key or not secret:
            return Response({"detail": "Classroom provider unavailable."}, status=503)
        token = request.headers.get("Authorization", "").removeprefix("Bearer ")
        try:
            claims = jwt.decode(token, secret, algorithms=["HS256"], issuer=key,
                                options={"require": ["exp", "iss", "sha256"]})
        except jwt.InvalidTokenError:
            raise PermissionDenied("Invalid provider signature.")
        digest = base64.b64encode(hashlib.sha256(request.body).digest()).decode("ascii")
        if not isinstance(claims["sha256"], str) or not hmac.compare_digest(claims["sha256"], digest):
            raise PermissionDenied("Invalid event body.")
        payload = request.data
        event = payload.get("event", "")
        room = payload.get("room", {})
        room_name = room.get("name") or payload.get("room_name", "")
        participant = payload.get("participant", {})
        identity = participant.get("identity")

        if not room_name or (event != "room_finished" and not identity):
            return Response({"status": "ignored", "reason": "missing room or identity"}, status=status.HTTP_200_OK)

        event_id = payload.get("id")
        if not isinstance(event_id, str) or not event_id or len(event_id) > 128:
            return Response({"detail": "Event ID is required."}, status=400)
        _, created = LiveKitEventReceipt.objects.get_or_create(event_id=event_id)
        if not created:
            return Response({"status": "already processed"})

        if event == "participant_joined":
            record_livekit_attendance_event(
                session_id=room_name,
                user_identity=identity,
                event_type="participant_joined",
            )
        elif event == "participant_left":
            duration = participant.get("duration")
            if duration is None:
                try:
                    duration = max(0, int(payload["createdAt"]) - int(participant["joinedAt"]))
                except (KeyError, TypeError, ValueError):
                    duration = 0
            record_livekit_attendance_event(
                session_id=room_name,
                user_identity=identity,
                event_type="participant_left",
                duration_seconds=duration,
            )
        elif event == "room_finished":
            finalize_session_attendance(session_id=room_name)

        return Response({"status": "success", "event": event}, status=status.HTTP_200_OK)


# ==============================================================================
# Attendance Sheet & Manual Override
# ==============================================================================

class SessionAttendanceView(APIView):
    """
    GET /api/live-classes/<session_id>/attendance/
    POST /api/live-classes/<session_id>/attendance/
    Lists attendance records or applies teacher overrides / manual finalization.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        role = classroom_role(request.user, session_id)
        summary = get_session_attendance_summary(str(session_id), None if role == "teacher" else request.user.pk)
        return Response({"session_id": str(session_id), "attendance": summary}, status=status.HTTP_200_OK)

    def post(self, request, session_id):
        classroom_role(request.user, session_id, teacher_only=True)
        action = request.data.get("action", "finalize")
        if action == "override":
            serializer = TeacherAttendanceOverrideInputSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            d = serializer.validated_data
            record = teacher_override_attendance(
                session_id=str(session_id),
                student_id=d["student_id"],
                new_status=d["status"],
                reason=d.get("reason", ""),
            )
            return Response({"success": True, "record_id": str(record.id), "status": record.status})
        else:
            # Finalize calculation based on 70% threshold
            duration_minutes = int(request.data.get("duration_minutes", 60))
            summary = finalize_session_attendance(str(session_id), duration_minutes)
            return Response({"success": True, "session_id": str(session_id), "attendance": summary})


# ==============================================================================
# In-Class Real-Time Quiz Endpoints
# ==============================================================================

class LiveClassQuizLaunchView(APIView):
    """
    POST /api/live-classes/quizzes/launch/
    Teacher launches an instant multiple-choice poll or pre-made quiz question.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LaunchQuizInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        classroom_role(request.user, d["session_id"], teacher_only=True)
        quiz = launch_in_class_quiz(
            session_id=d["session_id"],
            prompt=d.get("prompt", ""),
            options=d["options"],
            correct_option_index=d.get("correct_option_index"),
            duration_seconds=d.get("duration_seconds", 45),
        )

        return Response(
            {
                "success": True,
                "quiz_id": str(quiz.id),
                "session_id": quiz.session_id,
                "prompt": quiz.prompt,
                "options": quiz.options,
                "correct_option_index": quiz.correct_option_index,
                "duration_seconds": quiz.duration_seconds,
                "is_active": quiz.is_active,
                "created_at": quiz.created_at.isoformat(),
            },
            status=status.HTTP_201_CREATED,
        )


class LiveClassQuizResponseView(APIView):
    """
    POST /api/live-classes/quizzes/<quiz_id>/respond/
    Student submits their selected answer option.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        serializer = SubmitQuizResponseInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        quiz = get_object_or_404(LiveClassQuiz, pk=quiz_id)
        classroom_role(request.user, quiz.session_id)
        user = request.user

        try:
            resp = submit_in_class_quiz_response(
                quiz_id=str(quiz_id),
                student=user,
                selected_option_index=d["selected_option_index"],
                time_to_respond_seconds=d.get("time_to_respond_seconds", 0.0),
            )
            return Response(
                {
                    "success": True,
                    "response_id": str(resp.id),
                    "selected_option_index": resp.selected_option_index,
                    "submitted_at": resp.submitted_at.isoformat(),
                },
                status=status.HTTP_200_OK,
            )
        except ValueError as err:
            return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)


class LiveClassQuizAnalyticsView(APIView):
    """
    GET /api/live-classes/quizzes/<quiz_id>/analytics/
    POST /api/live-classes/quizzes/<quiz_id>/publish/
    Retrieves real-time voting distribution chart or publishes answer to students.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        quiz = get_object_or_404(LiveClassQuiz, pk=quiz_id)
        classroom_role(request.user, quiz.session_id, teacher_only=not quiz.is_results_published)
        summary = get_quiz_summary(str(quiz_id))
        return Response(summary, status=status.HTTP_200_OK)

    def post(self, request, quiz_id):
        quiz = get_object_or_404(LiveClassQuiz, pk=quiz_id)
        classroom_role(request.user, quiz.session_id, teacher_only=True)
        quiz = publish_quiz_results(str(quiz_id))
        summary = get_quiz_summary(str(quiz.id))
        return Response(summary, status=status.HTTP_200_OK)


# ==============================================================================
# Whiteboard PDF Export View
# ==============================================================================

class SessionWhiteboardExportView(APIView):
    """
    GET /api/live-classes/<session_id>/whiteboard-pdf/
    POST /api/live-classes/<session_id>/whiteboard-pdf/
    Uploads or retrieves the exported multi-page whiteboard PDF handout.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        classroom_role(request.user, session_id)
        export = SessionWhiteboardExport.objects.filter(session_id=str(session_id)).first()
        if not export or not export.pdf_file:
            return Response({"available": False, "message": "جزوه هنوز تولید یا آپلود نشده است."}, status=status.HTTP_404_NOT_FOUND)
        if request.query_params.get("download") == "1":
            response = FileResponse(export.pdf_file.open("rb"), as_attachment=True,
                                    filename="classroom-handout.pdf", content_type="application/pdf")
            response["Cache-Control"] = "private, no-store"
            return response
        return Response({
            "available": True,
            "session_id": export.session_id,
            "pdf_url": reverse("whiteboard_pdf", args=[session_id]) + "?download=1",
            "page_count": export.page_count,
            "file_size_bytes": export.file_size_bytes,
            "created_at": export.created_at.isoformat(),
        })

    def post(self, request, session_id):
        classroom_role(request.user, session_id, teacher_only=True)
        serializer = WhiteboardPdfUploadSerializer(data={**request.FILES.dict(), "session_id": session_id,
                                                        "page_count": request.data.get("page_count", 1)})
        serializer.is_valid(raise_exception=True)
        pdf_file = serializer.validated_data["pdf_file"]
        if pdf_file.size > 10 * 1024 * 1024 or pdf_file.read(5) != b"%PDF-":
            raise ValidationError({"pdf_file": "A PDF of up to 10 MB is required."})
        pdf_file.seek(0)
        page_count = serializer.validated_data["page_count"]
        export = save_whiteboard_export(
            session_id=str(session_id),
            pdf_file=pdf_file,
            page_count=page_count,
        )
        return Response({
            "success": True,
            "session_id": export.session_id,
            "pdf_url": reverse("whiteboard_pdf", args=[session_id]) + "?download=1",
            "page_count": export.page_count,
            "file_size_bytes": export.file_size_bytes,
        }, status=status.HTTP_201_CREATED)


# ==============================================================================
# Gemini AI Session Recap View
# ==============================================================================

class SessionAiRecapView(APIView):
    """
    GET /api/live-classes/<session_id>/recap/
    POST /api/live-classes/<session_id>/recap/
    Retrieves or triggers intelligent session recap via Gemini AI.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        classroom_role(request.user, session_id)
        recap = SessionAiRecap.objects.filter(session_id=str(session_id)).first()
        if not recap:
            return Response({"available": False, "message": "خلاصه هوشمند هنوز تولید نشده است."}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "available": True,
            "session_id": recap.session_id,
            "topics_covered": recap.topics_covered,
            "key_points": recap.key_points,
            "quiz_pitfalls": recap.quiz_pitfalls,
            "suggested_homework": recap.suggested_homework,
            "raw_markdown": recap.raw_markdown,
            "generated_at": recap.generated_at.isoformat(),
        })

    def post(self, request, session_id):
        classroom_role(request.user, session_id, teacher_only=True)
        serializer = GenerateAiRecapInputSerializer(data={**request.data, "session_id": session_id})
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        recap = generate_session_ai_recap(
            session_id=str(session_id),
            topics_covered_raw=d.get("topics_covered", ""),
            whiteboard_text=d.get("whiteboard_text", ""),
            teacher_notes=d.get("teacher_notes", ""),
            chat_logs=d.get("chat_logs", ""),
        )

        return Response({
            "success": True,
            "session_id": recap.session_id,
            "topics_covered": recap.topics_covered,
            "key_points": recap.key_points,
            "quiz_pitfalls": recap.quiz_pitfalls,
            "suggested_homework": recap.suggested_homework,
            "raw_markdown": recap.raw_markdown,
            "generated_at": recap.generated_at.isoformat(),
        }, status=status.HTTP_201_CREATED)

