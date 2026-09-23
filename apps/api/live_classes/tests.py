from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from learner_twin.models import LearnerTwin
from placement.models import PlacementSession
from .models import (
    ClassEnrollmentRequest,
    ClassFormat,
    CohortStatus,
    CurriculumBookMapping,
    EnrollmentRequestStatus,
    LiveClassCohort,
    TeacherSessionLog,
)
from .services import (
    claim_and_create_cohort,
    ensure_curriculum_catalog,
    get_learner_class_status,
    get_open_class_requests_for_teachers,
    log_teacher_session,
    recommend_curriculum_for_user,
    submit_enrollment_request,
)

User = get_user_model()


class LiveClassesAndCurriculumTests(TestCase):
    def setUp(self):
        ensure_curriculum_catalog()
        self.learner = User.objects.create_user(
            email="student1@endoora.ir",
            password="StrongPassword123!",
            role="learner",
        )
        self.teacher = User.objects.create_user(
            email="teacher1@endoora.ir",
            password="StrongPassword123!",
            role="teacher",
        )
        self.client = APIClient()

    def test_curriculum_catalog_preseeded(self):
        """Verify standard Iranian institute and international exam textbooks are pre-seeded."""
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="aef-starter").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="aef-1").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="aef-3").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="aef-5").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="family-and-friends-starter").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="cambridge-ielts-series").exists())
        self.assertTrue(CurriculumBookMapping.objects.filter(slug="barrons-toefl-ibt").exists())

    def test_curriculum_recommendation_based_on_placement_and_profile(self):
        """Test that CEFR level and tracks map accurately to textbooks."""
        # Unplaced learner defaults to starter
        rec_default = recommend_curriculum_for_user(self.learner)
        self.assertEqual(rec_default["slug"], "aef-starter")
        self.assertEqual(rec_default["book_title"], "American English File Starter")

        # B1 placement result via LearnerTwin assigns American English File 3
        LearnerTwin.objects.create(
            user=self.learner,
            summary={"estimated_cefr_level": "B1", "overall_percentage": 68.5},
        )
        rec_b1 = recommend_curriculum_for_user(self.learner)
        self.assertEqual(rec_b1["slug"], "aef-3")
        self.assertEqual(rec_b1["book_title"], "American English File 3")
        self.assertTrue(len(rec_b1["future_milestones"]) >= 3)

    def test_class_enrollment_request_flow(self):
        """Test learner submitting live class request with availability and group size."""
        self.client.force_authenticate(user=self.learner)
        response = self.client.post(
            "/api/classes/request/",
            {
                "preferred_format": "group",
                "max_classmates": 3,
                "available_slots": [
                    {"day": "sat", "time_window": "evening"},
                    {"day": "mon", "time_window": "evening"},
                ],
                "notes": "Looking for conversational practice.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["success"])

        # Check learner class status
        status_res = self.client.get("/api/classes/my-status/")
        self.assertEqual(status_res.status_code, 200)
        self.assertTrue(status_res.data["has_active_request"])
        self.assertFalse(status_res.data["is_enrolled"])
        self.assertEqual(status_res.data["request"]["preferred_format"], "group")

    def test_teacher_open_requests_and_cohort_formation(self):
        """Test teacher viewing open student pool and forming an online cohort with up to 4 students."""
        # Create 3 students requesting B1 group class
        students = []
        request_ids = []
        for i in range(3):
            s = User.objects.create_user(
                email=f"b1_student_{i}@endoora.ir",
                password="Password123!",
                role="learner",
            )
            LearnerTwin.objects.create(
                user=s,
                summary={"estimated_cefr_level": "B1"},
            )
            req = submit_enrollment_request(
                user=s,
                preferred_format="group",
                max_classmates=3,
                available_slots=[{"day": "sun", "time_window": "afternoon"}],
            )
            students.append(s)
            request_ids.append(str(req.id))

        self.client.force_authenticate(user=self.teacher)

        # Teacher queries open requests
        open_res = self.client.get("/api/teacher/classes/open-requests/")
        self.assertEqual(open_res.status_code, 200)
        self.assertTrue(open_res.data["total_pending"] >= 3)
        self.assertTrue(len(open_res.data["cohort_suggestions"]) >= 1)

        # Teacher claims the 3 students into a cohort
        claim_res = self.client.post(
            "/api/teacher/classes/claim/",
            {
                "request_ids": request_ids,
                "title": "American English File 3 Cohort Alpha",
                "meeting_url": "https://skyroom.online/ch/endoora/aef3-alpha",
                "schedule_summary": "یکشنبه‌ها و سه‌شنبه‌ها ساعت ۱۷:۰۰",
            },
            format="json",
        )
        self.assertEqual(claim_res.status_code, 201)
        self.assertEqual(claim_res.data["students_count"], 3)

        # Verify requests are marked matched
        for rid in request_ids:
            req_db = ClassEnrollmentRequest.objects.get(id=rid)
            self.assertEqual(req_db.status, EnrollmentRequestStatus.MATCHED)

        # Verify learner now shows enrolled
        self.client.force_authenticate(user=students[0])
        status_res = self.client.get("/api/classes/my-status/")
        self.assertEqual(status_res.status_code, 200)
        self.assertTrue(status_res.data["is_enrolled"])
        self.assertEqual(status_res.data["cohort"]["title"], "American English File 3 Cohort Alpha")
        self.assertEqual(status_res.data["cohort"]["meeting_url"], "https://skyroom.online/ch/endoora/aef3-alpha")

    def test_teacher_session_log_and_homework(self):
        """Test teacher submitting session log and student seeing homework and teacher notes."""
        cohort = LiveClassCohort.objects.create(
            teacher=self.teacher,
            title="Elementary Cohort",
            class_format=ClassFormat.GROUP,
            max_capacity=4,
        )
        cohort.students.add(self.learner)

        self.client.force_authenticate(user=self.teacher)
        log_res = self.client.post(
            "/api/teacher/classes/sessions/log/",
            {
                "cohort_id": str(cohort.id),
                "units_covered": "Unit 2: Pages 14-16",
                "grammar_covered": "Present perfect simple vs past simple",
                "vocabulary_list": ["experience", "abroad", "itinerary", "delay"],
                "homework_description": "Complete workbook exercises 1 to 4 on page 11.",
                "teacher_notes": "Great pronunciation work today by all students.",
            },
            format="json",
        )
        self.assertEqual(log_res.status_code, 201)
        self.assertEqual(log_res.data["session_number"], 1)

        # Check that learner receives the latest log in their class status
        self.client.force_authenticate(user=self.learner)
        status_res = self.client.get("/api/classes/my-status/")
        self.assertEqual(status_res.status_code, 200)
        self.assertIsNotNone(status_res.data["latest_session_log"])
        self.assertEqual(
            status_res.data["latest_session_log"]["homework_description"],
            "Complete workbook exercises 1 to 4 on page 11.",
        )
