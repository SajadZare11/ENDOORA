from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from profiles.models import TeacherProfile

from .dashboard import build_teacher_dashboard
from .services import TeacherClassService
from .models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    TeachingHourLedger,
    TeachingHourAuditLog,
    TeacherDataAccessAudit,
    LinkStatus,
    ClassStatus,
    SessionStatus,
    LedgerStatus,
)


User = get_user_model()



def collect_keys(value) -> set[str]:
    keys: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            keys.add(str(key))
            keys.update(collect_keys(child))
    elif isinstance(value, list):
        for child in value:
            keys.update(collect_keys(child))
    return keys


class TeacherDashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner-day10@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.unverified_teacher = User.objects.create_user(
            email="unverified-day10@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=False,
            marketplace_eligible=True,
            paid_class_eligible=True,
        )
        TeacherProfile.objects.create(
            user=self.unverified_teacher,
            public_name="مدرس آزمایشی",
            bio="مدرس زبان انگلیسی",
            experience_years=2,
            specialties=["conversation"],
            city="تهران",
            languages=["fa", "en"],
        )

        self.verified_teacher = User.objects.create_user(
            email="verified-day10@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
            marketplace_eligible=True,
            paid_class_eligible=True,
        )
        TeacherProfile.objects.create(
            user=self.verified_teacher,
            public_name="مدرس تأییدشده",
            bio="Experienced English teacher",
            experience_years=5,
            specialties=["ielts", "writing"],
            city="شیراز",
            languages=["fa", "en"],
        )

    def test_anonymous_user_gets_401(self):
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["code"], "authentication_required")

    def test_non_teacher_gets_403(self):
        self.client.force_login(self.learner)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["code"], "teacher_role_required")

    def test_unverified_teacher_sees_verification_as_primary_action(self):
        self.client.force_login(self.unverified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verification_status"], "unverified")
        self.assertEqual(response.data["primary_action"]["id"], "verify_profile")
        self.assertFalse(response.data["capabilities"]["teacher_verified"])
        self.assertFalse(response.data["capabilities"]["marketplace_eligible"])
        self.assertFalse(response.data["capabilities"]["paid_class_eligible"])
        fixed_class = next(
            item for item in response.data["quick_links"] if item["id"] == "fixed_class"
        )
        self.assertEqual(fixed_class["status"], "locked")

    def test_verified_teacher_uses_safe_empty_workspace(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verification_status"], "verified")
        self.assertEqual(response.data["primary_action"]["id"], "prepare_first_class")
        self.assertTrue(response.data["capabilities"]["teacher_verified"])
        self.assertTrue(response.data["capabilities"]["marketplace_eligible"])
        self.assertTrue(response.data["capabilities"]["paid_class_eligible"])
        self.assertIsNone(response.data["classes"]["count"])
        self.assertIsNone(response.data["earnings"]["amount_toman"])

    def test_dashboard_payload_has_no_sensitive_learner_content_keys(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.get("/api/teachers/dashboard/")
        self.assertEqual(response.status_code, 200)

        forbidden_keys = {
            "raw_writing",
            "writing_text",
            "audio_url",
            "audio_blob",
            "conversation",
            "conversation_history",
            "transcript",
            "answer_text",
            "private_message",
        }
        self.assertTrue(forbidden_keys.isdisjoint(collect_keys(response.data)))

    def test_dashboard_service_uses_one_domain_query(self):
        with self.assertNumQueries(1):
            payload = build_teacher_dashboard(self.verified_teacher)
        self.assertEqual(payload["verification_status"], "verified")

    def test_analytics_event_accepts_only_known_action_identifiers(self):
        self.client.force_login(self.verified_teacher)
        response = self.client.post(
            "/api/teachers/dashboard/events/",
            {
                "event_name": "primary_cta_click",
                "action_id": "prepare_first_class",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 204)

        bad_response = self.client.post(
            "/api/teachers/dashboard/events/",
            {
                "event_name": "primary_cta_click",
                "action_id": "raw-private-data",
            },
            format="json",
        )
        self.assertEqual(bad_response.status_code, 400)


class TeacherPrimaryActionTests(TestCase):
    def test_verification_has_highest_priority(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=False,
                profile_completeness_percent=100,
                next_session_available=True,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "verify_profile")

    def test_session_precedes_request_and_grading(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                next_session_available=True,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "teach_next_session")

    def test_request_precedes_grading(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                unanswered_requests=3,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "answer_request")

    def test_grading_is_selected_when_it_is_the_only_urgent_work(self):
        from .dashboard import TeacherSignals, resolve_teacher_primary_action

        action = resolve_teacher_primary_action(
            TeacherSignals(
                verified=True,
                profile_completeness_percent=100,
                pending_grading=4,
            )
        )
        self.assertEqual(action["id"], "grade_work")


class TeacherClassAndHoursManagementTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            email="teacher-day33@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.learner = User.objects.create_user(
            email="learner-day33@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.other_learner = User.objects.create_user(
            email="other-learner-day33@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.teacher_class = TeacherClassService.create_class(
            teacher=self.teacher,
            title="IELTS Speaking Masterclass",
            subject="IELTS Speaking",
            level="B2",
            max_capacity=5,
            objectives=["Fluency", "Lexical Resource", "Grammar Range"],
            private_notes="High focus on task 2 structure.",
        )

    def test_create_managed_class_api(self):
        self.client.force_login(self.teacher)
        response = self.client.post(
            "/api/teachers/classes/",
            {
                "title": "Business Writing Workshop",
                "subject": "Business English",
                "level": "C1",
                "max_capacity": 8,
                "objectives": ["Email etiquette", "Executive reports"],
                "private_notes": "Corporate cohort.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "Business Writing Workshop")
        self.assertEqual(response.data["subject"], "Business English")
        self.assertEqual(response.data["level"], "C1")
        self.assertEqual(response.data["enrolled_students_count"], 0)

    def test_invite_learner_and_consent_flow(self):
        self.client.force_login(self.teacher)
        # Teacher invites learner
        response = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/invite/",
            {"learner_email": self.learner.email},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "pending_consent")
        invite_code = response.data["invite_code"]
        self.assertTrue(bool(invite_code))

        # Learner cannot be viewed while pending
        overview_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/overview/"
        )
        self.assertEqual(overview_resp.status_code, 403)

        # Learner accepts invite
        self.client.force_login(self.learner)
        consent_resp = self.client.post(
            "/api/teachers/consent/",
            {"invite_code": invite_code},
            format="json",
        )
        self.assertEqual(consent_resp.status_code, 200)
        self.assertEqual(consent_resp.data["status"], "active")
        self.assertIsNotNone(consent_resp.data["consent_given_at"])

    def test_security_barrier_cannot_view_unlinked_learner(self):
        self.client.force_login(self.teacher)
        response = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.other_learner.id}/overview/"
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["code"], "access_denied")

    def test_view_active_learner_overview_and_audit_logging(self):
        # Establish active link
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        self.client.force_login(self.teacher)
        response = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/overview/",
            HTTP_USER_AGENT="EndooraTestBrowser/1.0",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["learner_email"], self.learner.email)
        self.assertEqual(response.data["link_status"], "active")
        self.assertIn("skill_evidence", response.data)
        self.assertIn("text_alternative", response.data["skill_evidence"])

        # Check that private AI chats are excluded
        forbidden_keys = {"conversation", "chat_history", "raw_recording", "voice_notes", "ai_messages"}
        self.assertTrue(forbidden_keys.isdisjoint(collect_keys(response.data)))

        # Verify audit log was written
        from teachers.models import TeacherDataAccessAudit
        audit = TeacherDataAccessAudit.objects.filter(
            teacher=self.teacher,
            learner=self.learner,
            access_type="VIEW_LEARNER_OVERVIEW",
        ).first()
        self.assertIsNotNone(audit)
        self.assertIn("EndooraTestBrowser", audit.user_agent)

    def test_terminate_relationship_revokes_future_access_and_preserves_history(self):
        # Create active link and scheduled session
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        now = timezone.now()
        session = TeacherClassService.schedule_session(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            learner_id=str(self.learner.id),
            title="Pronunciation Diagnostic",
            scheduled_start=now,
            scheduled_end=now + timezone.timedelta(minutes=60),
            duration_minutes=60,
        )
        TeacherClassService.confirm_session_completion(self.teacher, str(session.id))

        # Terminate relationship
        self.client.force_login(self.teacher)
        term_resp = self.client.post(
            f"/api/teachers/links/{link.id}/terminate/",
            {"reason": "Student completed curriculum."},
            format="json",
        )
        self.assertEqual(term_resp.status_code, 200)
        self.assertEqual(term_resp.data["status"], "terminated")

        # Future overview access is immediately revoked
        overview_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/overview/"
        )
        self.assertEqual(overview_resp.status_code, 403)

        # Historical session and ledger still exist
        from teachers.models import ClassSession, TeachingHourLedger
        self.assertTrue(ClassSession.objects.filter(id=session.id).exists())
        self.assertTrue(TeachingHourLedger.objects.filter(session_id=session.id).exists())

    def test_session_completion_calculates_hours_automatically(self):
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        now = timezone.now()
        session = TeacherClassService.schedule_session(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            learner_id=str(self.learner.id),
            title="Speaking Mock Test",
            scheduled_start=now,
            scheduled_end=now + timezone.timedelta(minutes=90),
            duration_minutes=90,  # 1.5 hours
        )

        self.client.force_login(self.teacher)
        comp_resp = self.client.post(
            f"/api/teachers/sessions/{session.id}/complete/",
            {"session_notes": "Completed parts 1, 2, and 3 successfully."},
            format="json",
        )
        self.assertEqual(comp_resp.status_code, 200)
        self.assertEqual(comp_resp.data["status"], "completed")

        # Verify ledger entry was created with 1.50 hours
        from teachers.models import TeachingHourLedger
        ledger = TeachingHourLedger.objects.get(session_id=session.id)
        self.assertEqual(ledger.hours, Decimal("1.50"))
        self.assertEqual(ledger.status, "confirmed")

        # Verify hours summary endpoint
        hours_resp = self.client.get("/api/teachers/hours/")
        self.assertEqual(hours_resp.status_code, 200)
        self.assertEqual(hours_resp.data["total_hours"], 1.5)
        self.assertEqual(hours_resp.data["confirmed_hours"], 1.5)
        self.assertEqual(len(hours_resp.data["ledgers"]), 1)

    def test_hours_adjustment_requires_reason_and_creates_audit_log(self):
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        now = timezone.now()
        session = TeacherClassService.schedule_session(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            learner_id=str(self.learner.id),
            title="Grammar Review",
            scheduled_start=now,
            scheduled_end=now + timezone.timedelta(minutes=60),
            duration_minutes=60,
        )
        TeacherClassService.confirm_session_completion(self.teacher, str(session.id))
        from teachers.models import TeachingHourLedger, TeachingHourAuditLog
        ledger = TeachingHourLedger.objects.get(session_id=session.id)

        self.client.force_login(self.teacher)

        # Attempt to adjust without reason must fail
        bad_resp = self.client.post(
            f"/api/teachers/hours/{ledger.id}/adjust/",
            {"new_hours": "1.75", "reason": ""},
            format="json",
        )
        self.assertEqual(bad_resp.status_code, 400)

        # Adjust with valid reason
        good_resp = self.client.post(
            f"/api/teachers/hours/{ledger.id}/adjust/",
            {"new_hours": "1.75", "reason": "Extended by 15 minutes for questions."},
            format="json",
        )
        self.assertEqual(good_resp.status_code, 200)
        self.assertEqual(good_resp.data["hours"], "1.75")
        self.assertEqual(good_resp.data["status"], "revised")

        # Verify audit log exists
        audit = TeachingHourAuditLog.objects.filter(ledger_entry=ledger, action="HOURS_ADJUSTED").first()
        self.assertIsNotNone(audit)
        self.assertEqual(audit.actor, self.teacher)
        self.assertEqual(audit.previous_hours, Decimal("1.00"))
        self.assertEqual(audit.new_hours, Decimal("1.75"))
        self.assertEqual(audit.reason, "Extended by 15 minutes for questions.")

    def test_learner_my_teachers_endpoint(self):
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        self.client.force_login(self.learner)
        response = self.client.get("/api/teachers/my-teachers/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["teacher_email"], self.teacher.email)
        self.assertEqual(response.data[0]["class_title"], self.teacher_class.title)


class TeacherAssignmentDay34Tests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_taxonomy")

    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            email="teacher-day34@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.other_teacher = User.objects.create_user(
            email="other-teacher-day34@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.learner = User.objects.create_user(
            email="learner-day34@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.other_learner = User.objects.create_user(
            email="stranger-day34@example.com",
            password="StrongPass123!",
            role="learner",
        )

        # Setup active class & enrolled learner
        self.teacher_class = TeacherClassService.create_class(
            teacher=self.teacher,
            title="Grammar & Vocabulary Mastery",
            subject="Grammar",
            level="B2",
            max_capacity=10,
        )
        link = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner)
        TeacherClassService.accept_invite(self.learner, link.invite_code)

        # Setup Question Bank with published MCQ question
        from questions.models import Question, QuestionObjective, QuestionVersion
        from taxonomy.models import TaxonomyNode

        obj_node = TaxonomyNode.objects.filter(
            kind=TaxonomyNode.Kind.OBJECTIVE,
            status=TaxonomyNode.Status.ACTIVE,
        ).first()

        self.q1 = Question.objects.create(slug="test-mcq-grammar-1", created_by=self.teacher)
        self.qv1 = QuestionVersion.objects.create(
            question=self.q1,
            version_number=1,
            status=QuestionVersion.Status.DRAFT,
            question_type=QuestionVersion.QuestionType.MCQ,
            cefr_level=QuestionVersion.CefrLevel.B2,
            difficulty=3,
            title_fa="انتخاب فعل زمان گذشته",
            title_en="Past simple verb choice",
            prompt_fa="کدام گزینه صحیح است؟",
            prompt_en="She _____ to the market yesterday.",
            instructions_fa="گزینه درست را انتخاب کنید.",
            instructions_en="Select the correct option.",
            learner_payload={
                "options": [
                    {"id": "opt1", "text": "go"},
                    {"id": "opt2", "text": "went"},
                    {"id": "opt3", "text": "gone"},
                ]
            },
            answer_key={"correct_option": "opt2"},
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Grammar Question Bank",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            author=self.teacher,
        )
        QuestionObjective.objects.create(version=self.qv1, objective=obj_node, is_primary=True)
        self.qv1.publish(self.teacher)

        # Setup second question (Short Answer)
        self.q2 = Question.objects.create(slug="test-short-answer-1", created_by=self.teacher)
        self.qv2 = QuestionVersion.objects.create(
            question=self.q2,
            version_number=1,
            status=QuestionVersion.Status.DRAFT,
            question_type=QuestionVersion.QuestionType.SHORT_ANSWER,
            cefr_level=QuestionVersion.CefrLevel.B2,
            difficulty=3,
            title_fa="مترادف کلمه",
            title_en="Vocabulary Synonym",
            prompt_fa="مترادف واژه huge را بنویسید.",
            prompt_en="Write a synonym for 'huge'.",
            instructions_fa="کلمه را بنویسید.",
            instructions_en="Type the word.",
            learner_payload={"placeholder": "e.g. gigantic"},
            answer_key={"accepted": ["enormous", "gigantic", "massive"]},
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Vocabulary Question Bank",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            author=self.teacher,
        )
        QuestionObjective.objects.create(version=self.qv2, objective=obj_node, is_primary=True)
        self.qv2.publish(self.teacher)

    def test_assignment_draft_creation_and_update(self):
        self.client.force_login(self.teacher)

        # Create draft
        resp = self.client.post(
            "/api/teachers/assignments/",
            {
                "class_id": str(self.teacher_class.id),
                "title": "Unit 5 Grammar Test",
                "description": "Mid-term grammar assessment",
                "instructions": "Answer all questions within 30 minutes.",
                "target_cefr": "B2",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 201)
        assignment_id = resp.data["id"]
        self.assertEqual(resp.data["status"], "draft")
        self.assertEqual(resp.data["title"], "Unit 5 Grammar Test")

        # Unauthorized teacher cannot edit
        self.client.force_login(self.other_teacher)
        patch_resp = self.client.patch(
            f"/api/teachers/assignments/{assignment_id}/",
            {"title": "Hacked Title"},
            format="json",
        )
        self.assertEqual(patch_resp.status_code, 400)

        # Owner can update draft
        self.client.force_login(self.teacher)
        patch_resp = self.client.patch(
            f"/api/teachers/assignments/{assignment_id}/",
            {"title": "Unit 5 Grammar Review", "expected_version": 1},
            format="json",
        )
        self.assertEqual(patch_resp.status_code, 200)
        self.assertEqual(patch_resp.data["title"], "Unit 5 Grammar Review")
        self.assertEqual(patch_resp.data["version"], 2)

        # Optimistic concurrency check
        conflict_resp = self.client.patch(
            f"/api/teachers/assignments/{assignment_id}/",
            {"title": "Old Version Edit", "expected_version": 1},
            format="json",
        )
        self.assertEqual(conflict_resp.status_code, 400)
        self.assertIn("Concurrent edit detected", str(conflict_resp.data))

    def test_question_curation_from_bank(self):
        self.client.force_login(self.teacher)
        from teachers.assignment_services import AssignmentService

        draft = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Grammar & Vocabulary Quiz",
        )

        # Browse questions
        browse_resp = self.client.get("/api/teachers/question-bank/browse/?cefr=B2")
        self.assertEqual(browse_resp.status_code, 200)
        self.assertGreaterEqual(len(browse_resp.data), 2)

        # Add questions
        q_resp = self.client.post(
            f"/api/teachers/assignments/{draft.id}/questions/",
            {
                "questions": [
                    {"question_version_id": str(self.qv1.id), "points": "15.00", "custom_instructions": "Carefully select the tense."},
                    {"question_version_id": str(self.qv2.id), "points": "10.00", "custom_instructions": "One word only."},
                ]
            },
            format="json",
        )
        self.assertEqual(q_resp.status_code, 200)
        self.assertEqual(len(q_resp.data["questions"]), 2)
        self.assertEqual(float(q_resp.data["total_points"]), 25.00)

    def test_delivery_settings_and_accommodations(self):
        self.client.force_login(self.teacher)
        from teachers.assignment_services import AssignmentService

        draft = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Timed Delivery Test",
        )

        # Configure delivery
        due = timezone.now() + timezone.timedelta(days=3)
        deliv_resp = self.client.post(
            f"/api/teachers/assignments/{draft.id}/delivery/",
            {
                "due_date": due.isoformat(),
                "grace_period_minutes": 15,
                "allow_late_submission": True,
                "max_attempts": 2,
                "time_limit_minutes": 45,
                "passing_percentage": 70,
            },
            format="json",
        )
        self.assertEqual(deliv_resp.status_code, 200)
        self.assertEqual(deliv_resp.data["max_attempts"], 2)
        self.assertEqual(deliv_resp.data["time_limit_minutes"], 45)
        self.assertEqual(deliv_resp.data["grace_period_minutes"], 15)

        # Configure learner accommodation
        extended_due = due + timezone.timedelta(days=2)
        accom_resp = self.client.post(
            f"/api/teachers/assignments/{draft.id}/accommodations/",
            {
                "learner_id": str(self.learner.id),
                "extra_time_minutes": 20,
                "extra_attempts": 1,
                "extended_due_date": extended_due.isoformat(),
                "notes": "Granted 20 extra minutes and +1 attempt for IEP accommodation.",
            },
            format="json",
        )
        self.assertEqual(accom_resp.status_code, 200)
        self.assertEqual(accom_resp.data["extra_time_minutes"], 20)
        self.assertEqual(accom_resp.data["extra_attempts"], 1)

        # Check effective calculations on draft
        draft.refresh_from_db()
        self.assertEqual(draft.effective_time_limit(self.learner), 65)
        self.assertEqual(draft.effective_max_attempts(self.learner), 3)
        self.assertEqual(draft.effective_due_date(self.learner), extended_due)

        # Stranger cannot be accommodated
        bad_accom = self.client.post(
            f"/api/teachers/assignments/{draft.id}/accommodations/",
            {
                "learner_id": str(self.other_learner.id),
                "extra_time_minutes": 10,
            },
            format="json",
        )
        self.assertEqual(bad_accom.status_code, 400)

    def test_publish_validation_rules(self):
        self.client.force_login(self.teacher)
        from teachers.assignment_services import AssignmentService

        draft = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Empty Draft",
        )

        # Cannot publish without questions
        pub_resp = self.client.post(f"/api/teachers/assignments/{draft.id}/publish/")
        self.assertEqual(pub_resp.status_code, 400)
        self.assertIn("at least one question", str(pub_resp.data))

        # Add question but no due date
        AssignmentService.set_assignment_questions(
            teacher=self.teacher,
            assignment_id=str(draft.id),
            questions_data=[{"question_version_id": str(self.qv1.id), "points": 10}],
        )
        pub_resp2 = self.client.post(f"/api/teachers/assignments/{draft.id}/publish/")
        self.assertEqual(pub_resp2.status_code, 400)
        self.assertIn("due date", str(pub_resp2.data).lower())

        # Set due date and publish
        AssignmentService.configure_delivery(
            teacher=self.teacher,
            assignment_id=str(draft.id),
            due_date=timezone.now() + timezone.timedelta(days=2),
        )
        pub_resp3 = self.client.post(f"/api/teachers/assignments/{draft.id}/publish/")
        self.assertEqual(pub_resp3.status_code, 200)
        self.assertEqual(pub_resp3.data["status"], "published")

    def test_learner_attempt_lifecycle_autosave_and_autograding(self):
        from teachers.assignment_services import AssignmentService

        # Setup complete published assignment
        assignment = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Grammar Milestone 1",
        )
        AssignmentService.set_assignment_questions(
            teacher=self.teacher,
            assignment_id=str(assignment.id),
            questions_data=[
                {"question_version_id": str(self.qv1.id), "points": 10},
                {"question_version_id": str(self.qv2.id), "points": 10},
            ],
        )
        AssignmentService.configure_delivery(
            teacher=self.teacher,
            assignment_id=str(assignment.id),
            due_date=timezone.now() + timezone.timedelta(days=1),
            time_limit_minutes=30,
            max_attempts=1,
        )
        AssignmentService.publish_assignment(teacher=self.teacher, assignment_id=str(assignment.id))

        # Learner checks available assignments
        self.client.force_login(self.learner)
        list_resp = self.client.get("/api/teachers/my-assignments/")
        self.assertEqual(list_resp.status_code, 200)
        self.assertEqual(len(list_resp.data), 1)
        self.assertEqual(list_resp.data[0]["title"], "Grammar Milestone 1")

        # Start attempt
        start_resp = self.client.post(f"/api/teachers/assignments/{assignment.id}/start/")
        self.assertEqual(start_resp.status_code, 200)
        attempt_id = start_resp.data["attempt_id"]
        self.assertEqual(start_resp.data["status"], "in_progress")
        self.assertEqual(len(start_resp.data["questions"]), 2)

        # STRICT CONTENT GOVERNANCE: Verify NO answer keys or correct answers in learner payload
        keys_in_payload = collect_keys(start_resp.data)
        self.assertNotIn("answer_key", keys_in_payload)
        self.assertNotIn("correct_option", keys_in_payload)
        self.assertNotIn("correct_answers", keys_in_payload)

        # Autosave draft answers (R-029 resilience)
        save_resp = self.client.post(
            f"/api/teachers/attempts/{attempt_id}/autosave/",
            {"answers": {str(self.qv1.id): "opt2"}},
            format="json",
        )
        self.assertEqual(save_resp.status_code, 200)
        self.assertTrue(save_resp.data["saved"])

        # Submit attempt (q1 correct "went", q2 correct "enormous")
        submit_resp = self.client.post(
            f"/api/teachers/attempts/{attempt_id}/submit/",
            {"answers": {str(self.qv2.id): "enormous"}},
            format="json",
        )
        self.assertEqual(submit_resp.status_code, 200)
        self.assertEqual(submit_resp.data["status"], "graded")
        self.assertEqual(float(submit_resp.data["score_awarded"]), 20.00)
        self.assertEqual(float(submit_resp.data["percentage"]), 100.00)
        self.assertFalse(submit_resp.data["is_late"])

        # Learner cannot start another attempt because max_attempts=1
        blocked_resp = self.client.post(f"/api/teachers/assignments/{assignment.id}/start/")
        self.assertEqual(blocked_resp.status_code, 400)
        self.assertIn("maximum allowed attempts", str(blocked_resp.data).lower())

        # Teacher monitors submissions and gives feedback
        self.client.force_login(self.teacher)
        subs_resp = self.client.get(f"/api/teachers/assignments/{assignment.id}/submissions/")
        self.assertEqual(subs_resp.status_code, 200)
        self.assertEqual(len(subs_resp.data), 1)
        self.assertEqual(subs_resp.data[0]["learner_email"], self.learner.email)
        self.assertEqual(float(subs_resp.data[0]["score_awarded"]), 20.00)

        # Teacher adjusts feedback
        grade_resp = self.client.post(
            f"/api/teachers/attempts/{attempt_id}/grade/",
            {"score_awarded": "20.00", "teacher_feedback": "Excellent performance on both grammar and vocabulary!"},
            format="json",
        )
        self.assertEqual(grade_resp.status_code, 200)
        self.assertEqual(grade_resp.data["teacher_feedback"], "Excellent performance on both grammar and vocabulary!")


class TeacherGradebookAndFeedbackDay35Tests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_taxonomy")

    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            email="teacher-day35@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.other_teacher = User.objects.create_user(
            email="other-teacher-day35@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.learner1 = User.objects.create_user(
            email="learner1-day35@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.learner2 = User.objects.create_user(
            email="learner2-day35@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.unlinked_learner = User.objects.create_user(
            email="unlinked-day35@example.com",
            password="StrongPass123!",
            role="learner",
        )

        # Setup active class & enroll both learners
        self.teacher_class = TeacherClassService.create_class(
            teacher=self.teacher,
            title="IELTS Advanced Prep",
            subject="IELTS",
            level="B2",
            max_capacity=15,
        )
        link1 = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner1)
        TeacherClassService.accept_invite(self.learner1, link1.invite_code)

        link2 = TeacherClassService.invite_learner(self.teacher, str(self.teacher_class.id), self.learner2)
        TeacherClassService.accept_invite(self.learner2, link2.invite_code)

        # Question bank setup
        from questions.models import Question, QuestionObjective, QuestionVersion
        from taxonomy.models import TaxonomyNode

        obj_node = TaxonomyNode.objects.filter(
            kind=TaxonomyNode.Kind.OBJECTIVE,
            status=TaxonomyNode.Status.ACTIVE,
        ).first()

        self.q1 = Question.objects.create(slug="mcq-grammar-d35", created_by=self.teacher)
        self.qv1 = QuestionVersion.objects.create(
            question=self.q1,
            version_number=1,
            status=QuestionVersion.Status.DRAFT,
            question_type=QuestionVersion.QuestionType.MCQ,
            cefr_level=QuestionVersion.CefrLevel.B2,
            difficulty=3,
            title_fa="انتخاب حرف اضافه زمان",
            title_en="Preposition Choice",
            prompt_fa="حرف اضافه مناسب را انتخاب کنید.",
            prompt_en="The lecture starts _____ Monday morning.",
            learner_payload={
                "options": [
                    {"id": "opt1", "text": "in"},
                    {"id": "opt2", "text": "on"},
                    {"id": "opt3", "text": "at"},
                ]
            },
            answer_key={"correct_option": "opt2"},
            explanation_fa="برای روزهای مشخص هفته از on استفاده می‌شود.",
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Grammar Bank",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            author=self.teacher,
        )
        QuestionObjective.objects.create(version=self.qv1, objective=obj_node, is_primary=True)
        self.qv1.publish(self.teacher)

        self.q2 = Question.objects.create(slug="writing-task-d35", created_by=self.teacher)
        self.qv2 = QuestionVersion.objects.create(
            question=self.q2,
            version_number=1,
            status=QuestionVersion.Status.DRAFT,
            question_type=QuestionVersion.QuestionType.SHORT_ANSWER,
            cefr_level=QuestionVersion.CefrLevel.B2,
            difficulty=3,
            title_fa="تکمیل جمله تحلیلی",
            title_en="Analytical sentence",
            prompt_fa="کلمه مناسب را وارد نمایید.",
            prompt_en="Renewable energy is essential for _____ development.",
            instructions_fa="کلمه را بنویسید.",
            instructions_en="Type the word.",
            learner_payload={"placeholder": "e.g. sustainable"},
            answer_key={"accepted": ["sustainable", "future"]},
            rubric={"accuracy": 5, "task_completion": 5},
            explanation_fa="توسعه پایدار مفهوم اصلی است.",
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Vocabulary Bank",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            author=self.teacher,
        )
        QuestionObjective.objects.create(version=self.qv2, objective=obj_node, is_primary=True)
        self.qv2.publish(self.teacher)

        # Create Assignment 1
        from teachers.assignment_services import AssignmentService
        self.assign1 = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Grammar & Vocabulary Test 1",
            target_cefr="B2",
        )
        AssignmentService.set_assignment_questions(
            teacher=self.teacher,
            assignment_id=str(self.assign1.id),
            questions_data=[
                {"question_version_id": str(self.qv1.id), "points": Decimal("10.00"), "custom_instructions": ""},
                {"question_version_id": str(self.qv2.id), "points": Decimal("10.00"), "custom_instructions": ""},
            ],
        )
        AssignmentService.configure_delivery(
            teacher=self.teacher,
            assignment_id=str(self.assign1.id),
            due_date=timezone.now() + timezone.timedelta(days=7),
            grace_period_minutes=15,
            allow_late_submission=True,
            max_attempts=2,
            passing_percentage=60,
        )
        self.assign1 = AssignmentService.publish_assignment(
            teacher=self.teacher,
            assignment_id=str(self.assign1.id),
        )

        # Create Assignment 2 (Expired / Past due)
        self.assign2 = AssignmentService.create_assignment_draft(
            teacher=self.teacher,
            class_id=str(self.teacher_class.id),
            title="Reading Comprehension Quiz",
            target_cefr="B2",
        )
        AssignmentService.set_assignment_questions(
            teacher=self.teacher,
            assignment_id=str(self.assign2.id),
            questions_data=[
                {"question_version_id": str(self.qv1.id), "points": Decimal("10.00"), "custom_instructions": ""},
            ],
        )
        AssignmentService.configure_delivery(
            teacher=self.teacher,
            assignment_id=str(self.assign2.id),
            due_date=timezone.now() - timezone.timedelta(days=2),
            grace_period_minutes=0,
            allow_late_submission=False,
            max_attempts=1,
            passing_percentage=60,
        )
        self.assign2 = AssignmentService.publish_assignment(
            teacher=self.teacher,
            assignment_id=str(self.assign2.id),
        )

    def test_teacher_submissions_queue_and_filters(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2", str(self.qv2.id): "sustainable"},
        )

        self.client.force_login(self.teacher)
        resp = self.client.get("/api/teachers/submissions/queue/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)
        item = resp.data[0]
        self.assertEqual(item["learner_email"], self.learner1.email)
        self.assertEqual(item["assignment_title"], "Grammar & Vocabulary Test 1")
        self.assertEqual(item["class_title"], "IELTS Advanced Prep")
        self.assertEqual(item["status"], "graded")

        # Other teacher gets empty queue
        self.client.force_login(self.other_teacher)
        other_resp = self.client.get("/api/teachers/submissions/queue/")
        self.assertEqual(other_resp.status_code, 200)
        self.assertEqual(len(other_resp.data), 0)

    def test_grading_studio_detail_and_rubric_override(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2", str(self.qv2.id): "future"},
        )

        self.client.force_login(self.teacher)
        detail_resp = self.client.get(f"/api/teachers/attempts/{att1.id}/grading-detail/")
        self.assertEqual(detail_resp.status_code, 200)
        self.assertEqual(detail_resp.data["learner"]["email"], self.learner1.email)
        self.assertEqual(len(detail_resp.data["questions"]), 2)
        q1_data = detail_resp.data["questions"][0]
        self.assertIn("reference_solution", q1_data)
        self.assertEqual(q1_data["reference_solution"]["correct_option"], "opt2")

        # Teacher grades with per-question scores, rubrics, and feedback
        grade_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/grade/",
            {
                "score_awarded": "18.50",
                "question_grades": {
                    str(self.qv1.id): {"score": 10.0, "comment": "Perfect preposition choice!"},
                    str(self.qv2.id): {"score": 8.5, "comment": "'future development' is acceptable but 'sustainable' is more idiomatic."},
                },
                "rubric_scores": {
                    "accuracy": {"score": 9, "max": 10, "comment": "Accurate vocabulary"},
                    "task_completion": {"score": 9.5, "max": 10, "comment": "Addressed all instructions"},
                },
                "teacher_feedback": "Great effort overall! Keep practicing formal adjectives.",
                "action": "return_grade",
            },
            format="json",
        )
        self.assertEqual(grade_resp.status_code, 200)
        self.assertEqual(grade_resp.data["status"], "graded")
        self.assertEqual(grade_resp.data["feedback_status"], "returned")
        self.assertEqual(float(grade_resp.data["score_awarded"]), 18.50)
        self.assertEqual(float(grade_resp.data["percentage"]), 92.50)
        self.assertIn("rubric_scores", grade_resp.data)
        self.assertIn("accuracy", grade_resp.data["rubric_scores"])

    def test_request_revision_workflow(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt1"},
        )

        self.client.force_login(self.teacher)
        grade_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/grade/",
            {
                "score_awarded": "5.00",
                "teacher_feedback": "Please re-read the preposition rules for days of the week.",
                "action": "request_revision",
                "revision_notes": "Revise question 1 and explain why your new choice fits.",
            },
            format="json",
        )
        self.assertEqual(grade_resp.status_code, 200)
        self.assertEqual(grade_resp.data["status"], "revision_requested")
        self.assertEqual(grade_resp.data["feedback_status"], "revision_requested")
        self.assertEqual(grade_resp.data["revision_notes"], "Revise question 1 and explain why your new choice fits.")

    def test_learner_acknowledge_feedback_and_reflection(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2"},
        )
        AssignmentService.grade_attempt_submission(
            teacher=self.teacher,
            attempt_id=str(att1.id),
            score_awarded=Decimal("15.00"),
            teacher_feedback="Good job!",
        )

        # Learner reviews feedback and submits reflection
        self.client.force_login(self.learner1)
        ack_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/acknowledge-feedback/",
            {"reflection": "I understand the difference between 'on' and 'at' now."},
            format="json",
        )
        self.assertEqual(ack_resp.status_code, 200)
        self.assertEqual(ack_resp.data["feedback_status"], "acknowledged")
        self.assertEqual(ack_resp.data["learner_reflection"], "I understand the difference between 'on' and 'at' now.")
        self.assertIsNotNone(ack_resp.data["learner_acknowledged_at"])

    def test_feedback_loop_threaded_messages_and_privacy(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2"},
        )

        # Learner posts inquiry
        self.client.force_login(self.learner1)
        msg1_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/feedback-messages/",
            {"message": "Could you clarify why option 1 wasn't correct?"},
            format="json",
        )
        self.assertEqual(msg1_resp.status_code, 201)
        self.assertFalse(msg1_resp.data["is_internal_note"])

        # Teacher posts public reply and an internal private note
        self.client.force_login(self.teacher)
        msg2_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/feedback-messages/",
            {"message": "Because Monday is a specific day, requiring 'on'.", "is_internal_note": False},
            format="json",
        )
        self.assertEqual(msg2_resp.status_code, 201)

        msg3_resp = self.client.post(
            f"/api/teachers/attempts/{att1.id}/feedback-messages/",
            {"message": "Internal record: Student confused 'in' vs 'on' during lesson 3.", "is_internal_note": True},
            format="json",
        )
        self.assertEqual(msg3_resp.status_code, 201)

        # Teacher sees all 3 messages
        t_msgs = self.client.get(f"/api/teachers/attempts/{att1.id}/feedback-messages/")
        self.assertEqual(len(t_msgs.data), 3)

        # Learner NEVER sees the internal private note!
        self.client.force_login(self.learner1)
        l_msgs = self.client.get(f"/api/teachers/attempts/{att1.id}/feedback-messages/")
        self.assertEqual(len(l_msgs.data), 2)
        for m in l_msgs.data:
            self.assertFalse(m["is_internal_note"])
            self.assertNotIn("Internal record", m["message"])

        # Unlinked learner gets 403 Forbidden
        self.client.force_login(self.unlinked_learner)
        forbidden_resp = self.client.get(f"/api/teachers/attempts/{att1.id}/feedback-messages/")
        self.assertEqual(forbidden_resp.status_code, 403)

    def test_class_gradebook_matrix_and_aggregates(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2", str(self.qv2.id): "sustainable"},
        )

        att2 = AssignmentService.start_learner_attempt(self.learner2, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner2,
            str(att2.id),
            final_answers={str(self.qv1.id): "opt2"},
        )

        self.client.force_login(self.teacher)
        gb_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/gradebook/")
        self.assertEqual(gb_resp.status_code, 200)
        data = gb_resp.data

        self.assertEqual(data["total_students"], 2)
        self.assertEqual(data["total_assignments"], 2)
        self.assertEqual(len(data["students"]), 2)
        self.assertEqual(len(data["assignments"]), 2)

        # Check student 1 metrics
        s1 = next(s for s in data["students"] if s["email"] == self.learner1.email)
        self.assertEqual(s1["completed_count"], 1)
        self.assertEqual(s1["missing_count"], 1)
        self.assertIn(str(self.assign1.id), s1["grades"])
        self.assertEqual(s1["grades"][str(self.assign1.id)]["score"], 20.0)
        self.assertEqual(s1["grades"][str(self.assign2.id)]["status"], "missing")

        # Check assignment 1 metrics
        a1_col = next(a for a in data["assignments"] if a["id"] == str(self.assign1.id))
        self.assertEqual(a1_col["submission_count"], 2)
        self.assertEqual(a1_col["completion_rate"], 100.0)
        self.assertEqual(a1_col["average_percentage"], 75.0)
        self.assertEqual(a1_col["high_percentage"], 100.0)
        self.assertEqual(a1_col["low_percentage"], 50.0)

    def test_class_gradebook_csv_export(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2", str(self.qv2.id): "sustainable"},
        )

        self.client.force_login(self.teacher)
        export_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/gradebook/export/")
        self.assertEqual(export_resp.status_code, 200)
        self.assertIn("text/csv", export_resp["Content-Type"])
        self.assertIn(f'attachment; filename="gradebook-{self.teacher_class.id}.csv"', export_resp["Content-Disposition"])

        csv_text = export_resp.content.decode("utf-8")
        self.assertTrue(csv_text.startswith("\ufeff"))
        self.assertIn(self.learner1.email, csv_text)
        self.assertIn("Grammar & Vocabulary Test 1", csv_text)
        self.assertIn("Class Average", csv_text)

    def test_learner_gradebook_summary(self):
        from teachers.assignment_services import AssignmentService
        att1 = AssignmentService.start_learner_attempt(self.learner1, str(self.assign1.id))
        AssignmentService.submit_attempt(
            self.learner1,
            str(att1.id),
            final_answers={str(self.qv1.id): "opt2", str(self.qv2.id): "sustainable"},
        )
        AssignmentService.grade_attempt_submission(
            teacher=self.teacher,
            attempt_id=str(att1.id),
            score_awarded=Decimal("20.00"),
            teacher_feedback="Phenomenal work on the test.",
        )

        self.client.force_login(self.learner1)
        my_grades_resp = self.client.get("/api/teachers/my-grades/")
        self.assertEqual(my_grades_resp.status_code, 200)
        data = my_grades_resp.data

        self.assertEqual(data["total_assignments"], 2)
        self.assertEqual(data["completed_assignments"], 1)
        self.assertEqual(data["pending_assignments"], 1)
        self.assertEqual(len(data["classes"]), 1)
        c_data = data["classes"][0]
        self.assertEqual(c_data["class_title"], "IELTS Advanced Prep")
        self.assertEqual(len(c_data["assignments"]), 2)

        a1 = next(a for a in c_data["assignments"] if a["assignment_id"] == str(self.assign1.id))
        self.assertEqual(a1["score_awarded"], 20.0)
        self.assertEqual(a1["status"], "graded")
        self.assertEqual(a1["feedback_status"], "returned")
        self.assertIn("Phenomenal work", a1["teacher_feedback_snippet"])



class TeacherAnalyticsAndInterventionsDay36Tests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_taxonomy")

    def setUp(self):
        from datetime import timedelta
        from questions.models import Question, QuestionObjective, QuestionVersion
        from taxonomy.models import TaxonomyNode
        from teachers.models import (
            Assignment,
            AssignmentQuestion,
            AssignmentAttempt,
            AssignmentStatus,
            AttemptStatus,
            ClassStatus,
            LinkStatus,
            TeacherClass,
            TeacherLearnerLink,
        )
        self.client = APIClient()
        User = get_user_model()
        self.teacher = User.objects.create_user(
            email="teacher_day36@example.com",
            password="StrongPassword123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.other_teacher = User.objects.create_user(
            email="other_teacher_day36@example.com",
            password="StrongPassword123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.learner1 = User.objects.create_user(
            email="learner1_day36@example.com",
            password="StrongPassword123!",
            role="learner",
        )
        self.learner2 = User.objects.create_user(
            email="learner2_day36@example.com",
            password="StrongPassword123!",
            role="learner",
        )
        self.unlinked_learner = User.objects.create_user(
            email="unlinked_day36@example.com",
            password="StrongPassword123!",
            role="learner",
        )

        self.teacher_class = TeacherClass.objects.create(
            teacher=self.teacher,
            title="TOEFL Masterclass Day 36",
            subject="Academic Writing & Reading",
            level="B2",
            status=ClassStatus.ACTIVE,
        )

        # Enroll learners
        self.link1 = TeacherLearnerLink.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            learner=self.learner1,
            status=LinkStatus.ACTIVE,
            invite_code="DAY36LNK1",
        )
        self.link2 = TeacherLearnerLink.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            learner=self.learner2,
            status=LinkStatus.ACTIVE,
            invite_code="DAY36LNK2",
        )

        # Questions
        obj_node = TaxonomyNode.objects.filter(
            kind=TaxonomyNode.Kind.OBJECTIVE,
            status=TaxonomyNode.Status.ACTIVE,
        ).first()

        self.q1 = Question.objects.create(slug="d36-q1", created_by=self.teacher)
        self.qv1 = QuestionVersion.objects.create(
            question=self.q1,
            version_number=1,
            status=QuestionVersion.Status.DRAFT,
            question_type=QuestionVersion.QuestionType.MCQ,
            title_en="Grammar Q1",
            title_fa="سوال گرامر ۱",
            prompt_en="Choose best option",
            prompt_fa="گزینه مناسب را انتخاب کنید",
            instructions_en="",
            instructions_fa="",
            cefr_level="B2",
            difficulty=3,
            learner_payload={"options": [{"id": "a", "text": "A"}, {"id": "b", "text": "B"}]},
            answer_key={"correct_option": "b"},
            source_origin=QuestionVersion.SourceOrigin.ORIGINAL,
            source_title="Grammar Question Bank",
            license_type=QuestionVersion.LicenseType.ORIGINAL,
            author=self.teacher,
        )
        QuestionObjective.objects.create(version=self.qv1, objective=obj_node, is_primary=True)
        self.qv1.publish(self.teacher)

        # Create 3 assignments
        self.assign1 = Assignment.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            title="Assignment 1 - Baseline",
            status=AssignmentStatus.PUBLISHED,
            total_points=Decimal("100.00"),
            due_date=timezone.now() - timedelta(days=10),
            published_at=timezone.now() - timedelta(days=12),
        )
        AssignmentQuestion.objects.create(assignment=self.assign1, question_version=self.qv1, order=1, points=Decimal("100.00"))

        self.assign2 = Assignment.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            title="Assignment 2 - Progress",
            status=AssignmentStatus.PUBLISHED,
            total_points=Decimal("100.00"),
            due_date=timezone.now() - timedelta(days=5),
            published_at=timezone.now() - timedelta(days=7),
        )
        AssignmentQuestion.objects.create(assignment=self.assign2, question_version=self.qv1, order=1, points=Decimal("100.00"))

        self.assign3 = Assignment.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            title="Assignment 3 - Advanced",
            status=AssignmentStatus.PUBLISHED,
            total_points=Decimal("100.00"),
            due_date=timezone.now() - timedelta(days=1),
            published_at=timezone.now() - timedelta(days=3),
        )
        AssignmentQuestion.objects.create(assignment=self.assign3, question_version=self.qv1, order=1, points=Decimal("100.00"))

    def test_evaluate_class_at_risk_alerts_low_mastery_and_missing(self):
        from teachers.analytics_services import TeacherAnalyticsService
        from teachers.models import AtRiskAlert, AlertType, AlertSeverity, AssignmentAttempt, AttemptStatus

        # Learner 1: Submits and scores 40% on assign1 (Low Mastery < 50%)
        # and has missing assign2 and assign3 (missing >= 2)
        att1 = AssignmentAttempt.objects.create(
            assignment=self.assign1,
            learner=self.learner1,
            attempt_number=1,
            status=AttemptStatus.GRADED,
            score_awarded=Decimal("40.00"),
            percentage=Decimal("40.00"),
            graded_at=timezone.now() - timedelta(days=9),
        )

        alerts = TeacherAnalyticsService.evaluate_class_at_risk_alerts(self.teacher, str(self.teacher_class.id))
        self.assertTrue(len(alerts) >= 2)

        learner1_alerts = [a for a in alerts if a.learner_id == self.learner1.id]
        low_mastery = next((a for a in learner1_alerts if a.alert_type == AlertType.LOW_MASTERY), None)
        self.assertIsNotNone(low_mastery)
        self.assertEqual(low_mastery.severity, AlertSeverity.HIGH)
        self.assertIn("بحرانی", low_mastery.title)

        missing_alert = next((a for a in learner1_alerts if a.alert_type == AlertType.MISSING_ASSIGNMENTS), None)
        self.assertIsNotNone(missing_alert)
        self.assertEqual(missing_alert.severity, AlertSeverity.MEDIUM)
        self.assertEqual(missing_alert.metrics_snapshot["missing_count"], 2)

    def test_evaluate_class_at_risk_alerts_performance_drop(self):
        from teachers.analytics_services import TeacherAnalyticsService
        from teachers.models import AtRiskAlert, AlertType, AlertSeverity, AssignmentAttempt, AttemptStatus

        # Learner 2: assign 1 score = 90%, assign 2 score = 60%, assign 3 score = 55%
        # Prior avg = 90%, recent avg = (60+55)/2 = 57.5% -> drop = 32.5% (>= 25% -> HIGH severity)
        AssignmentAttempt.objects.create(
            assignment=self.assign1,
            learner=self.learner2,
            attempt_number=1,
            status=AttemptStatus.GRADED,
            score_awarded=Decimal("90.00"),
            percentage=Decimal("90.00"),
            graded_at=timezone.now() - timedelta(days=8),
        )
        AssignmentAttempt.objects.create(
            assignment=self.assign2,
            learner=self.learner2,
            attempt_number=1,
            status=AttemptStatus.GRADED,
            score_awarded=Decimal("60.00"),
            percentage=Decimal("60.00"),
            graded_at=timezone.now() - timedelta(days=4),
        )
        AssignmentAttempt.objects.create(
            assignment=self.assign3,
            learner=self.learner2,
            attempt_number=1,
            status=AttemptStatus.GRADED,
            score_awarded=Decimal("55.00"),
            percentage=Decimal("55.00"),
            graded_at=timezone.now() - timedelta(days=1),
        )

        alerts = TeacherAnalyticsService.evaluate_class_at_risk_alerts(self.teacher, str(self.teacher_class.id))
        l2_alerts = [a for a in alerts if a.learner_id == self.learner2.id]
        drop_alert = next((a for a in l2_alerts if a.alert_type == AlertType.PERFORMANCE_DROP), None)
        self.assertIsNotNone(drop_alert)
        self.assertEqual(drop_alert.severity, AlertSeverity.HIGH)
        self.assertIn("افت شدید نمره", drop_alert.title)

    def test_teacher_analytics_overview_endpoint(self):
        self.client.force_login(self.teacher)
        resp = self.client.get("/api/teachers/analytics/overview/")
        self.assertEqual(resp.status_code, 200)
        data = resp.data

        self.assertEqual(data["total_classes"], 1)
        self.assertEqual(data["total_learners"], 2)
        self.assertIn("alerts_summary", data)
        self.assertIn("interventions_summary", data)
        self.assertIn("class_summaries", data)
        self.assertEqual(len(data["class_summaries"]), 1)
        self.assertEqual(data["class_summaries"][0]["title"], "TOEFL Masterclass Day 36")

    def test_class_analytics_report_and_csv_export(self):
        self.client.force_login(self.teacher)
        # Class report
        rep_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/analytics/")
        self.assertEqual(rep_resp.status_code, 200)
        rdata = rep_resp.data
        self.assertEqual(rdata["class_id"], str(self.teacher_class.id))
        self.assertIn("score_distribution", rdata)
        self.assertIn("skill_mastery", rdata)
        self.assertIn("trajectory", rdata)
        self.assertIn("learners_roster", rdata)
        self.assertEqual(len(rdata["learners_roster"]), 2)

        # CSV Export
        exp_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/analytics/export/")
        self.assertEqual(exp_resp.status_code, 200)
        self.assertIn("text/csv", exp_resp["Content-Type"])
        csv_text = exp_resp.content.decode("utf-8")
        self.assertTrue(csv_text.startswith("\ufeff"))
        self.assertIn(self.learner1.email, csv_text)
        self.assertIn(self.learner2.email, csv_text)

    def test_learner_analytics_profile_and_privacy_boundary(self):
        self.client.force_login(self.teacher)
        # Linked learner -> 200 OK
        prof_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner1.id}/analytics/"
        )
        self.assertEqual(prof_resp.status_code, 200)
        pdata = prof_resp.data
        self.assertEqual(pdata["learner_id"], str(self.learner1.id))
        self.assertIn("skills_breakdown", pdata)
        self.assertIn("assignments_history", pdata)

        # Check Audit record created
        from teachers.models import TeacherDataAccessAudit
        self.assertTrue(
            TeacherDataAccessAudit.objects.filter(
                teacher=self.teacher,
                learner=self.learner1,
                access_type="view_learner_analytics_profile",
            ).exists()
        )

        # Unlinked learner -> 403 Forbidden
        unlinked_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.unlinked_learner.id}/analytics/"
        )
        self.assertEqual(unlinked_resp.status_code, 403)

        # Other teacher trying to access -> 400 or 403
        self.client.force_login(self.other_teacher)
        forbidden_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner1.id}/analytics/"
        )
        self.assertIn(forbidden_resp.status_code, [400, 403])

    def test_at_risk_alert_lifecycle_and_interventions_crud(self):
        from teachers.models import (
            AtRiskAlert,
            AlertType,
            AlertSeverity,
            AlertStatus,
            TeacherIntervention,
            InterventionType,
            InterventionStatus,
        )
        alert = AtRiskAlert.objects.create(
            teacher=self.teacher,
            learner=self.learner1,
            teacher_class=self.teacher_class,
            alert_type=AlertType.LOW_MASTERY,
            severity=AlertSeverity.HIGH,
            status=AlertStatus.ACTIVE,
            title="نمره کمتر از ۵۰٪",
            description="نیاز به تمرین جبرانی",
        )

        self.client.force_login(self.teacher)
        # 1. Acknowledge alert
        ack_resp = self.client.post(f"/api/teachers/alerts/{alert.id}/acknowledge/")
        self.assertEqual(ack_resp.status_code, 200)
        self.assertEqual(ack_resp.data["status"], AlertStatus.ACKNOWLEDGED)

        # 2. Create Intervention linked to alert
        int_resp = self.client.post(
            "/api/teachers/interventions/",
            {
                "class_id": str(self.teacher_class.id),
                "learner_id": str(self.learner1.id),
                "alert_id": str(alert.id),
                "intervention_type": InterventionType.TARGETED_REMEDIAL_ASSIGNMENT,
                "title": "تمرین تقویتی زمان حال کامل",
                "description": "ارائه ۳ تمرین کلیدی برای رفع ضعف ساختاری گرامر",
                "score_before": "40.00",
            },
            format="json",
        )
        self.assertEqual(int_resp.status_code, 201)
        int_data = int_resp.data
        int_id = int_data["id"]
        self.assertEqual(int_data["status"], InterventionStatus.PLANNED)

        # 3. Update Intervention to COMPLETED with auto_resolve_alert
        patch_resp = self.client.patch(
            f"/api/teachers/interventions/{int_id}/",
            {
                "status": InterventionStatus.COMPLETED,
                "outcome_notes": "زبان‌آموز تمرین‌ها را با موفقیت انجام داد و نمره به ۷۵٪ رسید.",
                "score_after": "75.00",
                "auto_resolve_alert": True,
            },
            format="json",
        )
        self.assertEqual(patch_resp.status_code, 200)
        self.assertEqual(patch_resp.data["status"], InterventionStatus.COMPLETED)
        self.assertEqual(patch_resp.data["score_after"], "75.00")

        # Verify linked alert is now RESOLVED
        alert.refresh_from_db()
        self.assertEqual(alert.status, AlertStatus.RESOLVED)
        self.assertIn("رفع خودکار", alert.resolution_notes)


class TeacherOSTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = User.objects.create_user(
            email="teacheros-pro@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.learner = User.objects.create_user(
            email="teacheros-student@example.com",
            password="StrongPass123!",
            role="learner",
        )
        self.teacher_class = TeacherClass.objects.create(
            teacher=self.teacher,
            title="IELTS Masterclass B2",
            subject="IELTS Academic",
            level="B2",
            max_capacity=15,
        )
        self.link = TeacherLearnerLink.objects.create(
            teacher_class=self.teacher_class,
            teacher=self.teacher,
            learner=self.learner,
            status="active",
            invite_code="TEACHER-OS-001",
        )
        self.client.force_login(self.teacher)

    def test_create_and_list_material(self):
        # 1. Create a lesson plan material
        response = self.client.post(
            "/api/teachers/materials/",
            {
                "class_id": str(self.teacher_class.id),
                "material_type": "lesson",
                "title": "Present Perfect vs Past Simple for IELTS",
                "topic": "Life Experiences & Milestones",
                "cefr_level": "B2",
                "content": {
                    "warmup": "2-minute partner interview",
                    "presentation": "Timeline diagram contrasting definite past vs unfinished time",
                    "practice": "Sentence matching and cloze cards",
                    "production": "Personal achievement mini-talk",
                },
                "raw_markdown": "# Present Perfect Lesson\n\n## Warmup\nAsk your partner 3 questions.",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        material_id = response.data["id"]
        self.assertEqual(response.data["material_type"], "lesson")
        self.assertEqual(response.data["status"], "draft")

        # 2. List materials with filter
        list_resp = self.client.get("/api/teachers/materials/?material_type=lesson")
        self.assertEqual(list_resp.status_code, 200)
        self.assertEqual(len(list_resp.data), 1)

        # 3. Patch material to approved & pinned
        patch_resp = self.client.patch(
            f"/api/teachers/materials/{material_id}/",
            {"status": "approved", "is_pinned": True},
            format="json",
        )
        self.assertEqual(patch_resp.status_code, 200)
        self.assertEqual(patch_resp.data["status"], "approved")
        self.assertTrue(patch_resp.data["is_pinned"])

        # 4. Assign material to class
        assign_resp = self.client.post(f"/api/teachers/materials/{material_id}/assign/")
        self.assertEqual(assign_resp.status_code, 200)
        self.assertEqual(assign_resp.data["learner_count"], 1)

    def test_material_generator_engine_and_lifecycle(self):
        # 1. Generator 1: Lesson Planner (PPP & ESA)
        lesson_gen_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "lesson",
                "topic": "Conditionals for IELTS Speaking",
                "cefr_level": "B2",
                "duration": 60,
                "methodology": "ppp",
                "grammar_focus": "Third Conditional",
                "vocabulary_focus": "Decision making & regrets",
                "class_id": str(self.teacher_class.id),
            },
            format="json",
        )
        self.assertEqual(lesson_gen_resp.status_code, 201)
        lesson_id = lesson_gen_resp.data["id"]
        lesson_md = lesson_gen_resp.data["raw_markdown"].lower()
        self.assertIn("lesson overview", lesson_md)
        self.assertIn("lesson information", lesson_md)
        self.assertIn("materials", lesson_md)
        self.assertIn("lesson procedure", lesson_md)
        self.assertIn("assessment", lesson_md)
        self.assertIn("homework", lesson_md)

        # 2. Generator 2: Activity Generator (Student A/B Cards)
        act_gen_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "activity",
                "topic": "Airport Transit Disruption",
                "cefr_level": "B2",
                "activity_format": "roleplay",
                "duration": 20,
                "class_id": str(self.teacher_class.id),
            },
            format="json",
        )
        self.assertEqual(act_gen_resp.status_code, 201)
        act_md = act_gen_resp.data["raw_markdown"].lower()
        self.assertIn("level", act_md)
        self.assertIn("time", act_md)
        self.assertIn("aim", act_md)
        self.assertIn("procedure", act_md)
        self.assertIn("student a prompt card", act_md)
        self.assertIn("student b prompt card", act_md)
        self.assertIn("teacher notes", act_md)
        self.assertIn("differentiation", act_md)

        # 3. Generator 3: Worksheet Generator (Exercises + Answer Key)
        ws_gen_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "worksheet",
                "topic": "Academic Discourse Markers",
                "cefr_level": "C1",
                "worksheet_type": "grammar",
                "question_count": 10,
                "class_id": str(self.teacher_class.id),
            },
            format="json",
        )
        self.assertEqual(ws_gen_resp.status_code, 201)
        ws_md = ws_gen_resp.data["raw_markdown"].lower()
        self.assertIn("student worksheet", ws_md)
        self.assertIn("exercise 1", ws_md)
        self.assertIn("communicative extension", ws_md)
        self.assertIn("answer key", ws_md)
        self.assertIn("teacher notes", ws_md)

        # 4. Generator 4: Quiz / Assessment Generator (CEFR Rubric)
        quiz_gen_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "assessment",
                "topic": "B2 Mid-Course Diagnostic",
                "cefr_level": "B2",
                "question_count": 10,
                "class_id": str(self.teacher_class.id),
            },
            format="json",
        )
        self.assertEqual(quiz_gen_resp.status_code, 201)
        quiz_md = quiz_gen_resp.data["raw_markdown"].lower()
        self.assertIn("instructions", quiz_md)
        self.assertIn("answer key", quiz_md)
        self.assertIn("scoring guide", quiz_md)
        self.assertIn("teacher notes", quiz_md)

        # 5. Approve generated lesson and assign to class
        approve_resp = self.client.patch(
            f"/api/teachers/materials/{lesson_id}/",
            {"status": "approved", "is_pinned": True},
            format="json",
        )
        self.assertEqual(approve_resp.status_code, 200)
        self.assertEqual(approve_resp.data["status"], "approved")
        self.assertTrue(approve_resp.data["is_pinned"])

        assign_resp = self.client.post(f"/api/teachers/materials/{lesson_id}/assign/")
        self.assertEqual(assign_resp.status_code, 200)
        self.assertEqual(assign_resp.data["learner_count"], 1)

    def test_record_outcome_and_recommendation(self):
        # Record post-lesson 30-second outcome
        resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/outcomes/",
            {
                "result": "success",
                "difficulty_rating": 2,
                "completion_percent": 95,
                "summary": "Learners excelled at contrastive grammar timelines.",
                "notes": "Sara struggled slightly with since vs for.",
                "followup_reminders": ["Review since/for in 5-min warmup next session"],
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["difficulty_rating"], 2)

        # Get AI Next-Lesson Recommendation
        rec_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/next-lesson-recommendation/")
        self.assertEqual(rec_resp.status_code, 200)
        self.assertEqual(rec_resp.data["mode"], "advancement")
        self.assertIn("Advancement", rec_resp.data["recommended_topic"])
        self.assertEqual(len(rec_resp.data["reminders_from_last_session"]), 1)

    def test_student_dossier_11_sections(self):
        # 1. Fetch or initialize 11-section dossier
        dossier_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/"
        )
        self.assertEqual(dossier_resp.status_code, 200)
        self.assertIn("speaking", dossier_resp.data["cefr_skills"])

        # 2a. Score today's 7 skills with score < 10 but MISSING diagnostic note -> MUST FAIL (400)
        bad_score_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/score-skills/",
            {
                "speaking": 16,
                "listening": 15,
                "reading": 17,
                "writing": 8,
                "grammar": 7,
                "vocabulary": 14,
                "pronunciation": 13,
                "confidence": 4,
                "notes": "",  # Empty notes with scores < 10 violates TeacherOS diagnostic rules
            },
            format="json",
        )
        self.assertEqual(bad_score_resp.status_code, 400)
        self.assertIn("notes", bad_score_resp.data)

        # 2b. Score today's 7 skills WITH diagnostic note -> MUST SUCCEED (200)
        score_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/score-skills/",
            {
                "speaking": 16,
                "listening": 15,
                "reading": 17,
                "writing": 9,
                "grammar": 8,
                "vocabulary": 14,
                "pronunciation": 13,
                "confidence": 4,
                "notes": "Excellent oral fluency; needs support in passive voice syntax.",
            },
            format="json",
        )
        self.assertEqual(score_resp.status_code, 200)
        self.assertEqual(score_resp.data["cefr_skills"]["speaking"]["score"], 16)
        self.assertIn("Writing", score_resp.data["areas_for_development"])
        self.assertIn("Speaking", score_resp.data["strengths"])

        # 3. Log a language error with frequency and status
        err_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/log-error/",
            {
                "category": "grammar",
                "sentence": "I have seen him yesterday.",
                "correction": "I saw him yesterday.",
                "notes": "L1 interference with past indefinite.",
                "frequency": "medium",
                "status": "improving",
            },
            format="json",
        )
        self.assertEqual(err_resp.status_code, 201)
        self.assertEqual(err_resp.data["status"], "logged")
        error_id = err_resp.data["error"]["id"]
        self.assertEqual(err_resp.data["error"]["frequency"], "medium")

        # 4. Transition error status from 'improving' to 'solved'
        status_patch_resp = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/errors/{error_id}/",
            {"status": "solved"},
            format="json",
        )
        self.assertEqual(status_patch_resp.status_code, 200)
        solved_err = next(
            e for e in status_patch_resp.data["error_profile"] if e["id"] == error_id
        )
        self.assertEqual(solved_err["status"], "solved")

        # 5. Record formal assessment result milestone
        assess_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/assessments/",
            {
                "type": "formal",
                "subtype": "midterm",
                "title": "B2 CEFR Midterm Exam",
                "score": 88.5,
                "max_score": 100.0,
                "notes": "Solid task achievement; minor preposition slips.",
            },
            format="json",
        )
        self.assertEqual(assess_resp.status_code, 201)
        self.assertEqual(assess_resp.data["status"], "recorded")
        self.assertEqual(len(assess_resp.data["dossier"]["assessment_milestones"]), 1)
        self.assertEqual(assess_resp.data["assessment"]["percentage"], 88.5)

        # 6. Patch dossier goals and preferences
        goals_patch_resp = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/",
            {
                "target_goals": {
                    "long_term": "IELTS 7.5 Academic",
                    "short_term": "Master phrasal verbs for workplace contexts",
                },
                "learning_preferences": {
                    "preferred_activities": ["role play", "debate"],
                    "learning_behaviors": ["participates actively"],
                    "pace": "Fast-paced with challenge tasks",
                },
            },
            format="json",
        )
        self.assertEqual(goals_patch_resp.status_code, 200)
        self.assertEqual(
            goals_patch_resp.data["target_goals"]["long_term"], "IELTS 7.5 Academic"
        )

    def test_spaced_review_and_differentiation(self):
        # 1. Add item to SRS review queue
        srs_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/",
            {
                "target_item": "serendipitous",
                "item_type": "vocabulary",
                "prompt_question": "What is an appropriate synonym for 'serendipitous'?",
                "correct_answer": "Chance / fortunate coincidence",
            },
            format="json",
        )
        self.assertEqual(srs_resp.status_code, 201)

        # 2. List review queue
        queue_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/")
        self.assertEqual(queue_resp.status_code, 200)
        self.assertEqual(len(queue_resp.data), 1)

        # 3. Create a worksheet and differentiate it
        mat_resp = self.client.post(
            "/api/teachers/materials/",
            {
                "class_id": str(self.teacher_class.id),
                "material_type": "worksheet",
                "title": "Conditionals Mixed Practice",
                "cefr_level": "B2",
            },
            format="json",
        )
        mat_id = mat_resp.data["id"]

        diff_resp = self.client.post(f"/api/teachers/materials/{mat_id}/differentiate/")
        self.assertEqual(diff_resp.status_code, 201)
        self.assertIn("scaffolds", diff_resp.data["tier_support"])
        self.assertIn("challenges", diff_resp.data["tier_extension"])

    def test_sm2_spaced_repetition_review_progression(self):
        # 1. Create SRS item
        srs_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/",
            {
                "target_item": "ephemeral",
                "item_type": "vocabulary",
                "prompt_question": "Definition of ephemeral?",
                "correct_answer": "Lasting for a very short time",
            },
            format="json",
        )
        self.assertEqual(srs_resp.status_code, 201)
        item_id = srs_resp.data["id"]

        # 2. Record successful review grade 5 (perfect recall)
        review_resp1 = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/{item_id}/review/",
            {"grade": 5},
            format="json",
        )
        self.assertEqual(review_resp1.status_code, 200)
        self.assertEqual(review_resp1.data["repetition_count"], 1)
        self.assertEqual(review_resp1.data["interval_days"], 1)

        # 3. Record second successful review grade 4
        review_resp2 = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/{item_id}/review/",
            {"grade": 4},
            format="json",
        )
        self.assertEqual(review_resp2.status_code, 200)
        self.assertEqual(review_resp2.data["repetition_count"], 2)
        self.assertEqual(review_resp2.data["interval_days"], 6)

        # 4. Record forgotten review grade 2 (resets interval)
        review_resp3 = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/spaced-reviews/{item_id}/review/",
            {"grade": 2},
            format="json",
        )
        self.assertEqual(review_resp3.status_code, 200)
        self.assertEqual(review_resp3.data["repetition_count"], 0)
        self.assertEqual(review_resp3.data["interval_days"], 1)
        self.assertFalse(review_resp3.data["is_mastered"])

    def test_validations_and_ownership_boundaries(self):
        # 1. Invalid skill score (> 20) rejected
        invalid_score_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/dossier/score-skills/",
            {"speaking": 25},
            format="json",
        )
        self.assertEqual(invalid_score_resp.status_code, 400)

        # 2. Invalid completion percent (> 100) rejected
        invalid_outcome_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/outcomes/",
            {
                "result": "success",
                "difficulty_rating": 3,
                "completion_percent": 150,
            },
            format="json",
        )
        self.assertEqual(invalid_outcome_resp.status_code, 400)

        # 3. Ownership boundary: Another teacher cannot edit or assign this teacher's material
        other_teacher = User.objects.create_user(
            email="other-teacher@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.client.force_login(other_teacher)

        # Create material by teacher 1
        from teachers.models import TeacherMaterial
        material = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type="lesson",
            title="Private Lesson",
        )

        # Teacher 2 attempts to assign it -> 404
        forbidden_assign = self.client.post(f"/api/teachers/materials/{material.id}/assign/")
        self.assertEqual(forbidden_assign.status_code, 404)

    def test_class_profile_update_and_session_lifecycle(self):
        self.client.force_login(self.teacher)

        # 1. Update Class Profile with TeacherOS pedagogical fields
        update_resp = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/",
            {
                "coursebook": "Touchstone 2",
                "age_group": "adult",
                "class_size_type": "small",
                "default_duration": 90,
                "goal": "speaking",
                "focus_skills": ["spk", "gram"],
                "target_exams": "IELTS 6.5",
                "teaching_preferences": ["comm", "task"],
            },
            format="json",
        )
        self.assertEqual(update_resp.status_code, 200)
        self.assertEqual(update_resp.data["coursebook"], "Touchstone 2")
        self.assertEqual(update_resp.data["goal"], "speaking")
        self.assertEqual(update_resp.data["default_duration"], 90)
        self.assertIn("spk", update_resp.data["focus_skills"])

        # 2. Schedule a new session
        now = timezone.now()
        start = now + timedelta(days=1)
        end = start + timedelta(minutes=90)
        sched_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/sessions/",
            {
                "title": "Session 12: Conditional Structures & Fluency",
                "scheduled_start": start.isoformat(),
                "scheduled_end": end.isoformat(),
                "duration_minutes": 90,
                "session_notes": "Focus on second conditionals and role play.",
            },
            format="json",
        )
        self.assertEqual(sched_resp.status_code, 201)
        session_id = sched_resp.data["id"]
        self.assertEqual(sched_resp.data["status"], "scheduled")

        # 3. Toggle session status to COMPLETED -> verifies TeachingHourLedger creation
        comp_resp = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/sessions/{session_id}/",
            {
                "status": "completed",
                "session_notes": "Completed successfully with all students actively speaking.",
            },
            format="json",
        )
        self.assertEqual(comp_resp.status_code, 200)
        self.assertEqual(comp_resp.data["status"], "completed")

        from teachers.models import ClassSession, TeachingHourLedger
        session_obj = ClassSession.objects.get(id=session_id)
        self.assertTrue(hasattr(session_obj, "ledger_entry"))
        self.assertEqual(session_obj.ledger_entry.hours, Decimal("1.50"))

        # 4. Toggle session status to CANCELLED -> verifies ledger hours adjusted to 0.00
        cancel_resp = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/sessions/{session_id}/",
            {
                "status": "cancelled",
                "session_notes": "Cancelled due to bad weather.",
            },
            format="json",
        )
        self.assertEqual(cancel_resp.status_code, 200)
        self.assertEqual(cancel_resp.data["status"], "cancelled")

        session_obj.refresh_from_db()
        self.assertEqual(session_obj.ledger_entry.hours, Decimal("0.00"))

        # 5. Ownership verification: other teacher cannot update this session
        other_teacher = User.objects.create_user(
            email="session-intruder@example.com",
            password="StrongPass123!",
            role="teacher",
            is_teacher_verified=True,
        )
        self.client.force_login(other_teacher)
        forbidden_update = self.client.patch(
            f"/api/teachers/classes/{self.teacher_class.id}/sessions/{session_id}/",
            {"status": "scheduled"},
            format="json",
        )
        self.assertEqual(forbidden_update.status_code, 404)

    def test_teacher_usage_and_quota_enforcement(self):
        self.client.force_login(self.teacher)

        # 1. Initial usage summary check
        usage_resp = self.client.get("/api/teachers/usage/")
        self.assertEqual(usage_resp.status_code, 200)
        self.assertEqual(usage_resp.data["plan_name"], "TeacherOS Pro")
        self.assertEqual(usage_resp.data["daily_limit"], 30)
        self.assertIn("used_today", usage_resp.data)
        self.assertIn("remaining_today", usage_resp.data)
        self.assertIn("breakdown", usage_resp.data)
        self.assertEqual(
            usage_resp.data["used_today"] + usage_resp.data["remaining_today"],
            30,
        )

        # 2. Standalone Quick Create generation with TBL (Task-Based Learning) without class_id
        tbl_gen_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "lesson",
                "topic": "Negotiating Business Contracts",
                "cefr_level": "C1",
                "duration": 60,
                "methodology": "tbl",
                "grammar_focus": "Subjunctive & Conditional Bargaining",
                "vocabulary_focus": "Terms & Concessions",
            },
            format="json",
        )
        self.assertEqual(tbl_gen_resp.status_code, 201)
        self.assertIsNone(tbl_gen_resp.data["teacher_class"])
        self.assertIn("task-based learning", tbl_gen_resp.data["raw_markdown"].lower())
        self.assertEqual(tbl_gen_resp.data["metadata"]["methodology"], "tbl")
        self.assertIn("usage", tbl_gen_resp.data)
        self.assertGreaterEqual(tbl_gen_resp.data["usage"]["used_today"], 1)

        # 3. Simulate reaching the daily quota of 30 items
        from teachers.models import TeacherMaterial
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        current_today = TeacherMaterial.objects.filter(
            teacher=self.teacher,
            created_at__gte=today_start,
        ).count()
        needed_for_limit = 30 - current_today

        if needed_for_limit > 0:
            for idx in range(needed_for_limit):
                TeacherMaterial.objects.create(
                    teacher=self.teacher,
                    material_type="activity",
                    title=f"Bulk Limit Fill {idx}",
                    topic="Speaking practice",
                    cefr_level="B2",
                )

        # Confirm quota is exactly exhausted
        limit_usage_resp = self.client.get("/api/teachers/usage/")
        self.assertEqual(limit_usage_resp.status_code, 200)
        self.assertEqual(limit_usage_resp.data["used_today"], 30)
        self.assertEqual(limit_usage_resp.data["remaining_today"], 0)

        # 4. Exceeding quota triggers HTTP 429 Too Many Requests
        exceeded_resp = self.client.post(
            "/api/teachers/materials/generate/",
            {
                "material_type": "worksheet",
                "topic": "Exhausted Quota Test",
                "cefr_level": "B1",
                "worksheet_type": "grammar",
            },
            format="json",
        )
        self.assertEqual(exceeded_resp.status_code, 429)
        self.assertEqual(exceeded_resp.data["code"], "quota_exhausted")
        self.assertEqual(exceeded_resp.data["usage"]["remaining_today"], 0)

    def test_word_and_pdf_document_exporters(self):
        import io
        import zipfile
        from teachers.models import TeacherMaterial

        self.client.force_login(self.teacher)

        # Create a sample worksheet with Answer Key and Teacher Notes
        material = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type="worksheet",
            subtype="Grammar Drills",
            title="Conditionals Comprehensive Practice",
            topic="Third Conditionals",
            cefr_level="B2",
            raw_markdown="""# Student Worksheet: Conditionals Comprehensive Practice

## Exercise 1: Gap Fill
1. If she ____________ (know) the schedule, she would have arrived early.
2. They ____________ (pass) the exam if they had studied systematically.

---

## Answer Key
1. had known
2. would have passed

## Teacher Notes
- Allocate 15 minutes for pair review.
- Persian learners frequently omit the auxiliary had in conditional clauses.
""",
        )

        # 1. Export Word (.docx) - Teacher Edition
        docx_teacher_resp = self.client.get(f"/api/teachers/materials/{material.id}/export/docx/?mode=teacher")
        self.assertEqual(docx_teacher_resp.status_code, 200)
        self.assertEqual(
            docx_teacher_resp["Content-Type"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        self.assertIn("attachment; filename=", docx_teacher_resp["Content-Disposition"])
        # Verify valid ZIP containing word/document.xml
        zip_buf = io.BytesIO(docx_teacher_resp.content)
        with zipfile.ZipFile(zip_buf, "r") as zf:
            self.assertIn("word/document.xml", zf.namelist())
            xml_content = zf.read("word/document.xml").decode("utf-8")
            self.assertIn("Answer Key", xml_content)
            self.assertIn("had known", xml_content)

        # 2. Export Word (.docx) - Student Edition (Cleansed)
        docx_student_resp = self.client.get(f"/api/teachers/materials/{material.id}/export/docx/?mode=student")
        self.assertEqual(docx_student_resp.status_code, 200)
        student_zip = io.BytesIO(docx_student_resp.content)
        with zipfile.ZipFile(student_zip, "r") as zf:
            student_xml = zf.read("word/document.xml").decode("utf-8")
            self.assertIn("Exercise 1", student_xml)
            # Answer key should be stripped in student handout
            self.assertNotIn("had known", student_xml)

        # 3. Export PDF (.pdf) - Teacher Edition
        pdf_teacher_resp = self.client.get(f"/api/teachers/materials/{material.id}/export/pdf/?mode=teacher")
        self.assertEqual(pdf_teacher_resp.status_code, 200)
        self.assertEqual(pdf_teacher_resp["Content-Type"], "application/pdf")
        self.assertTrue(pdf_teacher_resp.content.startswith(b"%PDF-"))

        # 4. Export PDF (.pdf) - Student Edition
        pdf_student_resp = self.client.get(f"/api/teachers/materials/{material.id}/export/pdf/?mode=student")
        self.assertEqual(pdf_student_resp.status_code, 200)
        self.assertEqual(pdf_student_resp["Content-Type"], "application/pdf")
        self.assertTrue(pdf_student_resp.content.startswith(b"%PDF-"))

    def test_material_adaptation_assignment_and_scheduling(self):
        from teachers.models import Assignment, ClassSession, TeacherMaterial

        self.client.force_login(self.teacher)

        material = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type="lesson",
            subtype="PPP Lesson Plan",
            title="IELTS Speaking Part 2 Strategy",
            topic="Memorable Journeys",
            cefr_level="B2",
            raw_markdown="# IELTS Speaking Part 2 Strategy\n\n## Presentation\nTalk for 2 minutes.\n",
        )

        # 1. Adapt Material (Request One Change)
        adapt_resp = self.client.post(
            f"/api/teachers/materials/{material.id}/adapt/",
            {
                "requested_change": "افزودن ۳ اصطلاح سطح C1 و فعالیت مصاحبه دو نفره",
            },
            format="json",
        )
        self.assertEqual(adapt_resp.status_code, 201)
        adapted_data = adapt_resp.data
        self.assertIn("(ویرایش‌شده / Adapted)", adapted_data["title"])
        self.assertEqual(adapted_data["metadata"]["adapted_from_material_id"], str(material.id))
        self.assertEqual(
            adapted_data["metadata"]["requested_change"],
            "افزودن ۳ اصطلاح سطح C1 و فعالیت مصاحبه دو نفره",
        )
        # Verify original still exists
        self.assertTrue(TeacherMaterial.objects.filter(id=material.id).exists())

        # 2. Assign Material to Class with automated student Assignment creation
        now = timezone.now()
        due = now + timedelta(days=3)
        assign_resp = self.client.post(
            f"/api/teachers/materials/{material.id}/assign/",
            {
                "due_date": due.isoformat(),
                "create_assignment": True,
            },
            format="json",
        )
        self.assertEqual(assign_resp.status_code, 200)
        self.assertEqual(assign_resp.data["learner_count"], 1)
        self.assertIsNotNone(assign_resp.data["class_id"])

        # 3. Schedule Material as a Class Session
        sched_start = now + timedelta(days=2)
        sched_resp = self.client.post(
            f"/api/teachers/materials/{material.id}/schedule/",
            {
                "title": "جلسه استراتژی پیشرفته اسپیکینگ آیلتس",
                "scheduled_start": sched_start.isoformat(),
                "duration_minutes": 75,
                "session_notes": "آمادگی برای آزمون ماک و ارزیابی روانی کلام",
            },
            format="json",
        )
        self.assertEqual(sched_resp.status_code, 201)
        session_id = sched_resp.data["session_id"]
        self.assertEqual(sched_resp.data["status"], "scheduled")

        session_obj = ClassSession.objects.get(id=session_id)
        self.assertEqual(session_obj.duration_minutes, 75)
        self.assertEqual(session_obj.teacher_class, self.teacher_class)

        # Confirm material is now approved and pinned
        material.refresh_from_db()
        self.assertEqual(material.status, "approved")
        self.assertTrue(material.is_pinned)

    def test_writing_assessment_analysis_and_approval(self):
        """Day 8: Verify CEFR 4-criteria writing analysis, dossier sync, and Word/PDF feedback export."""
        from teachers.models import StudentDossier
        self.client.force_login(self.teacher)

        sample_text = (
            "Last year, I have traveled to Shiraz with my family. "
            "We was very exciting to visit Persepolis. "
            "If I will go there again, I would visit Eram Garden."
        )

        # 1. Analyze Writing Submission
        analyze_resp = self.client.post(
            "/api/teachers/assessment/analyze/",
            {
                "text": sample_text,
                "level": "B1",
                "mode": "rubric",
                "task_prompt": "Writing Assignment: A Memorable Journey",
                "student_label": "Sarah Rezaei",
            },
            format="json",
        )
        self.assertEqual(analyze_resp.status_code, 200)
        analysis = analyze_resp.data
        self.assertIn("band", analysis)
        self.assertIn("rubrics", analysis)
        self.assertIn("task_achievement", analysis["rubrics"])
        self.assertIn("coherence_cohesion", analysis["rubrics"])
        self.assertIn("lexical_resource", analysis["rubrics"])
        self.assertIn("grammatical_accuracy", analysis["rubrics"])
        self.assertGreaterEqual(len(analysis["corrections"]), 2)
        self.assertGreaterEqual(len(analysis["strengths"]), 1)
        self.assertGreaterEqual(len(analysis["next_steps"]), 1)

        # 2. Approve Feedback and Synchronize with Student Dossier
        approve_resp = self.client.post(
            "/api/teachers/assessment/approve/",
            {
                "class_id": str(self.teacher_class.id),
                "learner_id": str(self.learner.id),
                "assignment_title": "Writing Assignment: A Memorable Journey",
                "student_text": sample_text,
                "analysis": analysis,
                "teacher_notes": "Great progress on narrative writing. Focus on past tense accuracy.",
            },
            format="json",
        )
        self.assertEqual(approve_resp.status_code, 200)
        self.assertTrue(approve_resp.data["success"])
        self.assertGreaterEqual(approve_resp.data["errors_added"], 2)

        # Verify Student Dossier state
        dossier = StudentDossier.objects.get(
            teacher_class=self.teacher_class,
            learner=self.learner,
        )
        # Errors recorded
        self.assertGreaterEqual(len(dossier.error_profile), 2)
        categories = [e["category"] for e in dossier.error_profile]
        self.assertIn("grammar", categories)

        # Assessment milestone recorded
        self.assertGreaterEqual(len(dossier.assessment_milestones), 1)
        latest_assessment = dossier.assessment_milestones[-1]
        self.assertEqual(latest_assessment["subtype"], "writing")
        self.assertEqual(latest_assessment["type"], "formal")
        self.assertIn("A Memorable Journey", latest_assessment["title"])

        # Writing skill score updated
        self.assertGreater(dossier.cefr_skills["writing"]["score"], 0)

        # Next steps registered in co-teacher recommendations
        self.assertGreaterEqual(len(dossier.ai_recommendations), 1)

        # 3. Export Word (.docx) Feedback Report
        docx_resp = self.client.post(
            "/api/teachers/assessment/export/docx/",
            {
                "analysis": analysis,
                "mode": "student",
            },
            format="json",
        )
        self.assertEqual(docx_resp.status_code, 200)
        self.assertIn("wordprocessingml.document", docx_resp["Content-Type"])
        self.assertGreater(len(docx_resp.content), 2000)

        # 4. Export PDF Feedback Report
        pdf_resp = self.client.post(
            "/api/teachers/assessment/export/pdf/",
            {
                "analysis": analysis,
                "mode": "teacher",
            },
            format="json",
        )
        self.assertEqual(pdf_resp.status_code, 200)
        self.assertEqual(pdf_resp["Content-Type"], "application/pdf")
        self.assertTrue(pdf_resp.content.startswith(b"%PDF"))

    def test_day9_deep_pedagogical_supertools(self):
        """Day 9: Verify 3-tier differentiation, SRS 5-min warmup, curriculum pacing audit, and report card dispatch/export."""
        from teachers.models import DifferentiationPlan, StudentDossier, SpacedReviewItem, TeacherMaterial, MaterialType
        self.client.force_login(self.teacher)

        # 1. Differentiation Studio: Generate, Export docx, and Assign
        mat = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type=MaterialType.WORKSHEET,
            title="Grammar Mastery: Narrative Tenses",
            topic="Travel Stories & Past Narrative Tenses",
            cefr_level="B1",
            content={"tasks": ["Complete sentences with past simple or past continuous", "Write a 60-word story"]},
        )

        diff_resp = self.client.post(f"/api/teachers/materials/{mat.id}/differentiate/")
        self.assertEqual(diff_resp.status_code, 201)
        self.assertIn("tier_support", diff_resp.data)
        self.assertIn("tier_core", diff_resp.data)
        self.assertIn("tier_extension", diff_resp.data)
        self.assertGreaterEqual(len(diff_resp.data["tier_support"]["scaffolds"]), 3)

        # GET Differentiation
        get_diff_resp = self.client.get(f"/api/teachers/materials/{mat.id}/differentiate/")
        self.assertEqual(get_diff_resp.status_code, 200)
        self.assertEqual(get_diff_resp.data["id"], diff_resp.data["id"])

        # Export Differentiation Docx
        diff_docx_resp = self.client.post(f"/api/teachers/materials/{mat.id}/differentiation/export/docx/")
        self.assertEqual(diff_docx_resp.status_code, 200)
        self.assertIn("wordprocessingml.document", diff_docx_resp["Content-Type"])
        self.assertGreater(len(diff_docx_resp.content), 2000)

        # Assign Differentiation Tiers to Students
        assign_resp = self.client.post(
            f"/api/teachers/materials/{mat.id}/differentiation/assign/",
            {"tier_assignments": {str(self.learner.id): "tier_support"}},
            format="json",
        )
        self.assertEqual(assign_resp.status_code, 200)
        self.assertTrue(assign_resp.data["success"])
        self.assertEqual(assign_resp.data["learner_count"], 1)

        # 2. Spaced Retrieval Review (SRS): 5-Minute Warmup Generator & Push
        SpacedReviewItem.objects.create(
            teacher_class=self.teacher_class,
            target_item="resilient",
            item_type="vocabulary",
            prompt_question="What does resilient mean?",
            correct_answer="Able to recover quickly from adversity",
            due_date=timezone.now().date(),
        )
        warmup_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/srs/warmup/",
            {"count": 3},
            format="json",
        )
        self.assertEqual(warmup_resp.status_code, 200)
        self.assertEqual(warmup_resp.data["duration_minutes"], 5)
        self.assertEqual(len(warmup_resp.data["questions"]), 3)
        self.assertIn("raw_markdown", warmup_resp.data)

        # Push Warmup to Students
        push_warmup_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/srs/warmup/push/",
            {"warmup_data": warmup_resp.data},
            format="json",
        )
        self.assertEqual(push_warmup_resp.status_code, 200)
        self.assertTrue(push_warmup_resp.data["success"])

        # Export Warmup Docx
        warmup_docx_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/srs/warmup/export/docx/",
            {"warmup_data": warmup_resp.data},
            format="json",
        )
        self.assertEqual(warmup_docx_resp.status_code, 200)
        self.assertIn("wordprocessingml.document", warmup_docx_resp["Content-Type"])

        # 3. Curriculum Pacing Audit: Calculate & Export Docx
        pacing_resp = self.client.get(f"/api/teachers/classes/{self.teacher_class.id}/pacing-audit/")
        self.assertEqual(pacing_resp.status_code, 200)
        self.assertIn("pacing_status", pacing_resp.data)
        self.assertIn("skill_coverages", pacing_resp.data)
        self.assertIn("pedagogical_adjustments", pacing_resp.data)

        pacing_docx_resp = self.client.post(f"/api/teachers/classes/{self.teacher_class.id}/pacing-audit/export/docx/")
        self.assertEqual(pacing_docx_resp.status_code, 200)
        self.assertIn("wordprocessingml.document", pacing_docx_resp["Content-Type"])

        # 4. Official Progress Report Card: Data, Dispatch, Docx & PDF
        report_data_resp = self.client.get(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/report-card/"
        )
        self.assertEqual(report_data_resp.status_code, 200)
        self.assertIn("cefr_skills", report_data_resp.data)
        self.assertIn("strengths", report_data_resp.data)

        # Dispatch Report Card to Learner
        dispatch_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/report-card/dispatch/",
            {
                "term": "Term 2 - Spring 2026",
                "teacher_comment": "Excellent effort and consistent speaking engagement this term.",
                "overall_score": 16.5,
            },
            format="json",
        )
        self.assertEqual(dispatch_resp.status_code, 200)
        self.assertTrue(dispatch_resp.data["success"])

        # Verify Dossier update
        dossier = StudentDossier.objects.get(teacher_class=self.teacher_class, learner=self.learner)
        report_milestones = [m for m in dossier.assessment_milestones if m.get("subtype") == "report_card"]
        self.assertGreaterEqual(len(report_milestones), 1)

        # Export Report Card Docx
        rc_docx_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/report-card/export/docx/",
            {"term": "Term 2 - Spring 2026", "teacher_comment": "Great term progress!"},
            format="json",
        )
        self.assertEqual(rc_docx_resp.status_code, 200)
        self.assertIn("wordprocessingml.document", rc_docx_resp["Content-Type"])

        # Export Report Card PDF
        rc_pdf_resp = self.client.post(
            f"/api/teachers/classes/{self.teacher_class.id}/learners/{self.learner.id}/report-card/export/pdf/",
            {"term": "Term 2 - Spring 2026", "teacher_comment": "Great term progress!"},
            format="json",
        )
        self.assertEqual(rc_pdf_resp.status_code, 200)
        self.assertEqual(rc_pdf_resp["Content-Type"], "application/pdf")
        self.assertTrue(rc_pdf_resp.content.startswith(b"%PDF"))

    def test_day10_teacher_library_and_account(self):
        """Day 10: Verify Teacher Library advanced search, CEFR filter, batch actions, and Account & Subscription Hub."""
        from teachers.models import TeacherMaterial, MaterialType, MaterialStatus, TeacherPedagogicalPreference
        self.client.force_login(self.teacher)

        # 1. Create a suite of test materials with different CEFR levels and types
        m1 = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type=MaterialType.LESSON,
            title="B1 Travel & Tourism Essentials",
            topic="Airport & Travel Vocabulary",
            cefr_level="B1",
            is_pinned=True,
            raw_markdown="Full lesson plan for travel vocabulary.",
        )
        m2 = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type=MaterialType.WORKSHEET,
            title="C1 Advanced Academic Lexis",
            topic="Academic Collocations & Inversion",
            cefr_level="C1",
            is_pinned=False,
            raw_markdown="Academic lexis drills.",
        )
        m3 = TeacherMaterial.objects.create(
            teacher=self.teacher,
            teacher_class=self.teacher_class,
            material_type=MaterialType.ASSESSMENT,
            title="B2 Grammar Diagnostic Quiz",
            topic="Conditionals and Passives",
            cefr_level="B2",
            is_pinned=False,
            raw_markdown="Diagnostic quiz content.",
        )

        # 2. Search & Filtering tests
        # Search by query
        search_resp = self.client.get("/api/teachers/materials/?search=Airport")
        self.assertEqual(search_resp.status_code, 200)
        self.assertEqual(len(search_resp.data), 1)
        self.assertEqual(search_resp.data[0]["id"], str(m1.id))

        # Filter by CEFR Level
        cefr_resp = self.client.get("/api/teachers/materials/?cefr_level=C1")
        self.assertEqual(cefr_resp.status_code, 200)
        self.assertEqual(len(cefr_resp.data), 1)
        self.assertEqual(cefr_resp.data[0]["cefr_level"], "C1")

        # Ordering: Pinned first by default
        list_resp = self.client.get("/api/teachers/materials/")
        self.assertEqual(list_resp.status_code, 200)
        self.assertTrue(list_resp.data[0]["is_pinned"])

        # 3. Batch Actions: Pin, Archive, Delete
        batch_pin_resp = self.client.post(
            "/api/teachers/materials/batch/",
            {"action": "pin", "material_ids": [str(m2.id), str(m3.id)]},
            format="json",
        )
        self.assertEqual(batch_pin_resp.status_code, 200)
        self.assertTrue(batch_pin_resp.data["success"])
        self.assertEqual(batch_pin_resp.data["affected_count"], 2)
        m2.refresh_from_db()
        self.assertTrue(m2.is_pinned)

        batch_archive_resp = self.client.post(
            "/api/teachers/materials/batch/",
            {"action": "archive", "material_ids": [str(m1.id)]},
            format="json",
        )
        self.assertEqual(batch_archive_resp.status_code, 200)
        m1.refresh_from_db()
        self.assertEqual(m1.status, MaterialStatus.ARCHIVED)

        # 4. Teacher Account Hub: Summary, Preferences, and Plan Upgrade
        account_resp = self.client.get("/api/teachers/account/summary/")
        self.assertEqual(account_resp.status_code, 200)
        adata = account_resp.data
        self.assertIn("teacher", adata)
        self.assertIn("plan", adata)
        self.assertIn("usage", adata)
        self.assertIn("productivity", adata)
        self.assertIn("preferences", adata)
        self.assertIn("available_plans", adata)
        self.assertGreaterEqual(len(adata["available_plans"]), 3)
        self.assertGreater(adata["productivity"]["hours_saved"], 0)

        # Update Pedagogical Preferences
        pref_resp = self.client.post(
            "/api/teachers/account/preferences/",
            {
                "default_cefr": "B2",
                "default_duration": 45,
                "preferred_methodology": "tbl",
                "auto_generate_ccqs": True,
                "feedback_tone": "encouraging",
            },
            format="json",
        )
        self.assertEqual(pref_resp.status_code, 200)
        self.assertTrue(pref_resp.data["success"])
        self.assertEqual(pref_resp.data["preferences"]["preferred_methodology"], "tbl")
        self.assertEqual(pref_resp.data["preferences"]["default_cefr"], "B2")

        # Upgrade Plan to Premium
        upgrade_resp = self.client.post(
            "/api/teachers/account/upgrade/",
            {"plan_code": "premium", "gateway": "zarinpal"},
            format="json",
        )
        self.assertEqual(upgrade_resp.status_code, 200)
        self.assertTrue(upgrade_resp.data["success"])
        self.assertEqual(upgrade_resp.data["plan_code"], "premium")
        self.assertIn("transaction", upgrade_resp.data)
        self.assertTrue(upgrade_resp.data["transaction"]["ref_id"].startswith("ZP-"))

        # Verify daily limit increased to 999
        updated_metrics = self.client.get("/api/teachers/usage/")
        self.assertEqual(updated_metrics.status_code, 200)
        self.assertEqual(updated_metrics.data["daily_limit"], 999)
        self.assertEqual(updated_metrics.data["plan_name"], "TeacherOS Premium")







