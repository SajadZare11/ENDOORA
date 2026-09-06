from __future__ import annotations

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
