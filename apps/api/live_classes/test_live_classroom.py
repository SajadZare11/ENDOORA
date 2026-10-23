import json
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import (
    AttendanceRecord,
    AttendanceStatus,
    LiveClassQuiz,
    LiveClassQuizResponse,
    SessionAiRecap,
)
from .services import (
    create_livekit_token,
    finalize_session_attendance,
    get_quiz_summary,
    launch_in_class_quiz,
    publish_quiz_results,
    record_livekit_attendance_event,
    submit_in_class_quiz_response,
    teacher_override_attendance,
)

User = get_user_model()


class LiveClassroomBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            email="teacher@endoora.ir",
            password="password123",
            first_name="دبیر",
            last_name="شایسته",
        )
        self.student1 = User.objects.create_user(
            email="student1@endoora.ir",
            password="password123",
            first_name="علی",
            last_name="رضایی",
        )
        self.student2 = User.objects.create_user(
            email="student2@endoora.ir",
            password="password123",
            first_name="سارا",
            last_name="محمدی",
        )
        self.session_id = "session-test-room-101"

    def test_livekit_token_generation(self):
        token_info = create_livekit_token(
            room_name=self.session_id,
            user=self.teacher,
            is_teacher=True,
        )
        self.assertIn("token", token_info)
        self.assertEqual(token_info["room_name"], self.session_id)
        self.assertTrue(token_info["is_teacher"])
        self.assertEqual(token_info["identity"], str(self.teacher.id))

    def test_attendance_tracking_and_70_percent_threshold(self):
        # Student 1 attended 45 minutes (2700 seconds) out of 60 minutes session -> 75% -> PRESENT
        record_livekit_attendance_event(
            session_id=self.session_id,
            user_identity=str(self.student1.id),
            event_type="participant_joined",
        )
        record_livekit_attendance_event(
            session_id=self.session_id,
            user_identity=str(self.student1.id),
            event_type="participant_left",
            duration_seconds=2700,
        )

        # Student 2 attended 20 minutes (1200 seconds) out of 60 minutes -> 33.3% -> TARDY
        record_livekit_attendance_event(
            session_id=self.session_id,
            user_identity=str(self.student2.id),
            event_type="participant_joined",
        )
        record_livekit_attendance_event(
            session_id=self.session_id,
            user_identity=str(self.student2.id),
            event_type="participant_left",
            duration_seconds=1200,
        )

        # Finalize
        summary = finalize_session_attendance(self.session_id, session_duration_minutes=60)
        self.assertEqual(len(summary), 2)

        rec1 = AttendanceRecord.objects.get(session_id=self.session_id, student=self.student1)
        self.assertEqual(rec1.status, AttendanceStatus.PRESENT)
        self.assertEqual(rec1.attendance_percentage, Decimal("75.00"))

        rec2 = AttendanceRecord.objects.get(session_id=self.session_id, student=self.student2)
        self.assertEqual(rec2.status, AttendanceStatus.TARDY)
        self.assertEqual(rec2.attendance_percentage, Decimal("33.33"))

        # Teacher override
        teacher_override_attendance(
            session_id=self.session_id,
            student_id=str(self.student2.id),
            new_status=AttendanceStatus.EXCUSED,
            reason="قطعی موقت اینترانت",
        )
        rec2.refresh_from_db()
        self.assertEqual(rec2.status, AttendanceStatus.EXCUSED)
        self.assertTrue(rec2.teacher_override)

    def test_in_class_realtime_quiz(self):
        # Teacher launches quiz
        quiz = launch_in_class_quiz(
            session_id=self.session_id,
            prompt="پاسخ معادله دیفرانسیل روی تخته کدام است؟",
            options=["گزینه الف", "گزینه ب", "گزینه ج", "گزینه د"],
            correct_option_index=1,
            duration_seconds=30,
        )
        self.assertTrue(quiz.is_active)

        # Students respond
        submit_in_class_quiz_response(str(quiz.id), self.student1, selected_option_index=1, time_to_respond_seconds=5.2)
        submit_in_class_quiz_response(str(quiz.id), self.student2, selected_option_index=0, time_to_respond_seconds=8.4)

        # Get summary
        summary = get_quiz_summary(str(quiz.id))
        self.assertEqual(summary["total_responses"], 2)
        self.assertEqual(summary["distribution"][1]["count"], 1)
        self.assertEqual(summary["distribution"][1]["percentage"], 50.0)
        self.assertTrue(summary["distribution"][1]["is_correct"])

        # Publish results
        closed_quiz = publish_quiz_results(str(quiz.id))
        self.assertFalse(closed_quiz.is_active)
        self.assertTrue(closed_quiz.is_results_published)

    def test_api_endpoints(self):
        # Token endpoint
        res = self.client.post("/api/live-classes/token/", {"session_id": "math-101", "role": "student"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("token", res.data)

        # Quiz Launch endpoint
        res = self.client.post("/api/live-classes/quizzes/launch/", {
            "session_id": "math-101",
            "prompt": "کدام گزینه صحیح است؟",
            "options": ["الف", "ب"],
            "correct_option_index": 0,
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        quiz_id = res.data["quiz_id"]

        # Student respond endpoint
        self.client.force_authenticate(user=self.student1)
        res = self.client.post(f"/api/live-classes/quizzes/{quiz_id}/respond/", {
            "selected_option_index": 0,
            "time_to_respond_seconds": 3.1,
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Analytics endpoint
        res = self.client.get(f"/api/live-classes/quizzes/{quiz_id}/analytics/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["total_responses"], 1)

        # Attendance summary endpoint
        res = self.client.get(f"/api/live-classes/{self.session_id}/attendance/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
