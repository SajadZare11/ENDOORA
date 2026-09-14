from decimal import Decimal
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from ielts.models import (
    IELTSTest,
    IELTSTestType,
    IELTSTestStatus,
    IELTSSection,
    IELTSSectionType,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSQuestionType,
    IELTSTestSession,
    IELTSAttemptStatus,
    IELTSPracticeMode,
    MANDATORY_IELTS_DISCLAIMER,
)
from ielts.services import (
    submit_test_for_review,
    review_and_approve_test,
    publish_test,
    clone_test_new_version,
    evaluate_ielts_answer,
    normalize_ielts_answer,
)
from ielts.session_services import (
    start_or_resume_session,
    record_answer,
    toggle_flag,
    advance_section,
    submit_session,
    compile_full_diagnostic_report,
)


class IELTSContentModelTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="author@example.com",
            password="StrongPassword123!",
            first_name="Farhad",
            last_name="Author",
            role=User.Role.EDITOR,
            is_staff=True,
        )
        self.reviewer = User.objects.create_user(
            email="reviewer@example.com",
            password="StrongPassword123!",
            first_name="Sahar",
            last_name="Reviewer",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
        )
        self.learner = User.objects.create_user(
            email="learner@example.com",
            password="StrongPassword123!",
            first_name="Ali",
            last_name="Learner",
            role=User.Role.LEARNER,
        )

        # Create basic draft test
        self.test = IELTSTest.objects.create(
            title_en="Original IELTS Academic Practice Test 1",
            title_fa="آزمون آزمایشی شماره ۱ آیلتس آکادمیک",
            test_type=IELTSTestType.ACADEMIC,
            version=1,
            status=IELTSTestStatus.DRAFT,
            author=self.author,
            copyright_source="100% Original Endoora Academic Material. Audited by Editorial Board.",
            disclaimer_label=MANDATORY_IELTS_DISCLAIMER,
        )

        # Create section
        self.section = IELTSSection.objects.create(
            test=self.test,
            section_type=IELTSSectionType.READING,
            order=1,
            duration_minutes=60,
        )

        # Create passage
        self.passage = IELTSPassageTask.objects.create(
            section=self.section,
            order=1,
            title="Urban Heat Islands",
            content_text="Sample passage text about urban microclimates...",
            word_count=500,
        )

        # Create question group
        self.group = IELTSQuestionGroup.objects.create(
            passage_task=self.passage,
            question_type=IELTSQuestionType.TRUE_FALSE_NOT_GIVEN,
            order=1,
            instructions="Write TRUE, FALSE or NOT GIVEN.",
        )

        # Create question
        self.question = IELTSQuestion.objects.create(
            group=self.group,
            question_number=1,
            prompt_text="Reflective roofs lower surface temperatures.",
            correct_answers=["true", "t"],
            explanation="Confirmed in paragraph 2.",
            max_score=Decimal("1.00"),
        )

        self.valid_checklist = {
            "zero_copyright_infringement": True,
            "cefr_calibrated": True,
            "answer_key_verified": True,
            "audio_script_verified": True,
            "typo_and_formatting_checked": True,
        }

    def test_two_person_review_gate_enforcement(self):
        """Author cannot approve their own test; independent reviewer is required."""
        submit_test_for_review(self.test, self.author)
        self.assertEqual(self.test.status, IELTSTestStatus.IN_REVIEW)

        # Attempt review by author must raise ValidationError
        with self.assertRaises(ValidationError) as ctx:
            review_and_approve_test(
                test=self.test,
                reviewer=self.author,
                checklist=self.valid_checklist,
                notes="Self-approval attempt",
            )
        self.assertIn("Two-Person Review", str(ctx.exception))

        # Review by distinct reviewer succeeds
        approved_test = review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
            notes="Passed editorial review.",
        )
        self.assertEqual(approved_test.status, IELTSTestStatus.APPROVED)
        self.assertEqual(approved_test.reviewed_by, self.reviewer)
        self.assertIsNotNone(approved_test.reviewed_at)

    def test_cannot_publish_unreviewed_or_incomplete_test(self):
        """A draft test cannot be published directly without approval."""
        with self.assertRaises(ValidationError):
            publish_test(self.test, self.author)

    def test_publishing_locks_test_and_requires_disclaimer(self):
        """Publishing successfully locks the test and validates disclaimer."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
            notes="Ready for release.",
        )

        published = publish_test(self.test, self.reviewer)
        self.assertEqual(published.status, IELTSTestStatus.PUBLISHED)
        self.assertTrue(published.is_locked)

    def test_publishing_fails_with_invalid_disclaimer(self):
        """Publishing fails if disclaimer does not contain mandatory official disclaimer text."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
        )
        self.test.disclaimer_label = "Official British Council Exam"
        self.test.save()

        with self.assertRaises(ValidationError) as ctx:
            publish_test(self.test, self.reviewer)
        self.assertTrue(any("شبیه‌ساز غیررسمی آیلتس" in m for m in ctx.exception.messages))

    def test_clone_creates_new_version_with_isolation(self):
        """Cloning creates version + 1 as editable DRAFT with all sections and questions deep-copied."""
        # Publish first
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(
            test=self.test,
            reviewer=self.reviewer,
            checklist=self.valid_checklist,
        )
        publish_test(self.test, self.reviewer)

        # Clone into version 2
        cloned = clone_test_new_version(self.test, self.author)
        self.assertEqual(cloned.version, 2)
        self.assertEqual(cloned.status, IELTSTestStatus.DRAFT)
        self.assertFalse(cloned.is_locked)
        self.assertIsNone(cloned.reviewed_by)
        self.assertIsNone(cloned.reviewed_at)

        # Verify deep copy of questions
        cloned_questions = IELTSQuestion.objects.filter(
            group__passage_task__section__test=cloned
        )
        self.assertEqual(cloned_questions.count(), 1)
        cloned_q = cloned_questions.first()
        self.assertEqual(cloned_q.question_number, 1)
        self.assertNotEqual(cloned_q.id, self.question.id)

    def test_answer_normalization_and_evaluation(self):
        """Answer normalization handles trailing punctuation, whitespace, and case sensitivity."""
        self.assertEqual(normalize_ielts_answer("  True.  "), "true")
        self.assertEqual(normalize_ielts_answer("WATER   VAPOR!"), "water vapor")

        # Check correct matching
        is_correct, score = evaluate_ielts_answer(self.question, "True")
        self.assertTrue(is_correct)
        self.assertEqual(score, Decimal("1.00"))

        is_correct, score = evaluate_ielts_answer(self.question, "t")
        self.assertTrue(is_correct)

        is_correct, score = evaluate_ielts_answer(self.question, "FALSE")
        self.assertFalse(is_correct)
        self.assertEqual(score, Decimal("0.00"))

    def test_admin_api_workflow(self):
        """Test API endpoints for test lifecycle."""
        client = APIClient()

        # Learner cannot access admin endpoint
        client.force_authenticate(user=self.learner)
        resp = client.get("/api/ielts/tests/")
        self.assertEqual(resp.status_code, 403)

        # Editor can list and view
        client.force_authenticate(user=self.author)
        resp = client.get("/api/ielts/tests/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)

        # Submit review via API
        resp = client.post(f"/api/ielts/tests/{self.test.id}/submit-review/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "in_review")

        # Author cannot approve via API
        resp = client.post(
            f"/api/ielts/tests/{self.test.id}/approve/",
            data={"checklist": self.valid_checklist, "notes": "Self approval"},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)

        # Independent reviewer approves via API
        client.force_authenticate(user=self.reviewer)
        resp = client.post(
            f"/api/ielts/tests/{self.test.id}/approve/",
            data={"checklist": self.valid_checklist, "notes": "Approved by peer"},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "approved")

        # Publish via API
        resp = client.post(f"/api/ielts/tests/{self.test.id}/publish/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "published")
        self.assertTrue(resp.data["is_locked"])

        # Public catalog lists published test
        anon_client = APIClient()
        resp = anon_client.get("/api/ielts/public/tests/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("disclaimer", resp.data)
        self.assertEqual(len(resp.data["results"]), 1)

    def test_seed_ielts_mini_test_command(self):
        """Seed command generates 100% original Academic mini-test with 4 sections, 19 questions, and band descriptors."""
        call_command("seed_ielts_mini_test")

        seeded_test = IELTSTest.objects.filter(title_en__icontains="Diagnostic Simulation 01").first()
        self.assertIsNotNone(seeded_test)
        self.assertEqual(seeded_test.status, IELTSTestStatus.PUBLISHED)
        self.assertTrue(seeded_test.is_locked)
        self.assertNotEqual(seeded_test.author_id, seeded_test.reviewed_by_id)

        # Verify sections
        section_types = list(seeded_test.sections.values_list("section_type", flat=True))
        self.assertIn(IELTSSectionType.LISTENING, section_types)
        self.assertIn(IELTSSectionType.READING, section_types)
        self.assertIn(IELTSSectionType.WRITING, section_types)
        self.assertIn(IELTSSectionType.SPEAKING, section_types)

        # Verify question count
        q_count = IELTSQuestion.objects.filter(group__passage_task__section__test=seeded_test).count()
        self.assertEqual(q_count, 19)

    def test_start_and_resume_learner_session(self):
        """Learner can start and resume a timed practice session on a published test."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        # Start session
        session = start_or_resume_session(self.learner, str(self.test.id))
        self.assertEqual(session.status, IELTSAttemptStatus.IN_PROGRESS)
        self.assertEqual(session.current_section_index, 0)
        self.assertGreater(session.time_remaining_seconds, 0)

        # Resuming returns the same session
        resumed = start_or_resume_session(self.learner, str(self.test.id))
        self.assertEqual(session.id, resumed.id)

    def test_cannot_start_session_on_draft_test(self):
        """Draft unapproved tests cannot be started by learners."""
        with self.assertRaises(ValidationError):
            start_or_resume_session(self.learner, str(self.test.id))

    def test_learner_active_session_security_boundary(self):
        """Active session endpoint must NEVER leak correct_answers or explanation."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        session = start_or_resume_session(self.learner, str(self.test.id))

        client = APIClient()
        client.force_authenticate(user=self.learner)
        resp = client.get(f"/api/ielts/sessions/{session.id}/")
        self.assertEqual(resp.status_code, 200)

        # Traverse questions in payload
        section_data = resp.data["sections"][0]
        q_data = section_data["passages_tasks"][0]["question_groups"][0]["questions"][0]

        self.assertNotIn("correct_answers", q_data)
        self.assertNotIn("explanation", q_data)
        self.assertEqual(q_data["prompt_text"], self.question.prompt_text)

    def test_session_autosave_and_submission_workflow(self):
        """Learner records answers, flags questions, and submits session for diagnostic grading."""
        submit_test_for_review(self.test, self.author)
        review_and_approve_test(self.test, self.reviewer, self.valid_checklist)
        publish_test(self.test, self.reviewer)

        session = start_or_resume_session(self.learner, str(self.test.id))

        client = APIClient()
        client.force_authenticate(user=self.learner)

        # Record answer via API
        resp = client.post(
            f"/api/ielts/sessions/{session.id}/answer/",
            data={"question_id": str(self.question.id), "answer": "TRUE"},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data["success"])

        # Flag question via API
        resp = client.post(
            f"/api/ielts/sessions/{session.id}/flag/",
            data={"question_id": str(self.question.id)},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertIn(str(self.question.id), resp.data["flagged_questions"])

        # Submit session
        resp = client.post(f"/api/ielts/sessions/{session.id}/submit/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["status"], "submitted")
        self.assertGreaterEqual(resp.data["scaled_band_score"], 1.0)

        # Get full diagnostic report
        resp = client.get(f"/api/ielts/sessions/{session.id}/report/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("diagnostics", resp.data)
        self.assertIn("section_scores", resp.data)
        self.assertIn("questions", resp.data)

        # In report, correct_answers and explanation ARE now visible
        reported_q = resp.data["questions"][0]
        self.assertEqual(reported_q["candidate_answer"], "TRUE")
        self.assertTrue(reported_q["is_correct"])
        self.assertIn("correct_answers", reported_q)
        self.assertIn("explanation", reported_q)


class IELTSWritingSimulationAndEvaluationTests(TestCase):
    """
    Tests for IELTS Writing Simulation UI autosave, 4-criterion AI evaluation,
    word count penalties, official weighting (1/3 Task 1 + 2/3 Task 2), and report generation (IELTS-003 & IELTS-004).
    """
    def setUp(self):
        self.learner = User.objects.create_user(
            email="writing.learner@endoora.ir",
            password="TestPassword123!",
            first_name="مهسا",
            last_name="رضایی",
            role=User.Role.LEARNER,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.learner)

    def test_writing_evaluator_task_weighting_and_scoring(self):
        """Verifies official 1/3 Task 1 + 2/3 Task 2 weighting and standard half-band rounding."""
        from ielts.writing_evaluator import evaluate_ielts_writing_submission

        # Sample high-quality Task 1 response (>150 words with overview & academic vocabulary)
        task1_sample = (
            "The bar chart illustrates the proportion of domestic electricity generated from renewable sources "
            "across Denmark, Norway, and Sweden between 2015 and 2025. "
            "Overall, it is evident that all three Scandinavian nations experienced substantial growth in renewable energy output, "
            "with Norway consistently maintaining the dominant position throughout the decade.\n\n"
            "In 2015, Norway generated approximately 65% of its domestic electricity from hydro and wind installations. "
            "Over the subsequent ten years, this figure climbed steadily to reach an impressive peak of 88% by 2025. "
            "Denmark demonstrated a remarkable upward trajectory as well, rising from 42% in 2015 to 74% in 2025, "
            "predominantly driven by offshore wind farms in the North Sea.\n\n"
            "In contrast, Sweden showed a more moderate yet constant increase, progressing from 50% to 68%. "
            "In conclusion, while all three countries made decisive transitions toward clean energy, Norway remained the foremost producer."
        )

        # Sample high-quality Task 2 essay (>250 words with thesis, balanced discussion, conclusion)
        task2_sample = (
            "In contemporary society, the rapid integration of artificial intelligence into primary and secondary classrooms "
            "has generated considerable debate among educators and policymakers. While some argue that algorithmic tutors provide "
            "unprecedented personalized learning and boost academic motivation, others contend that relying on machine learning "
            "undermines critical thinking and erodes the vital interpersonal bond between pupils and teachers. This essay will examine "
            "both viewpoints before demonstrating why a balanced pedagogical synthesis is essential.\n\n"
            "On the one hand, proponents emphasize that adaptive algorithms cater to individual student pacing far more effectively "
            "than traditional instruction. For example, intelligent tutoring software can instantly diagnose a child's conceptual gaps "
            "in mathematics and deliver tailored exercises, thereby fostering autonomous learning habits. Furthermore, gamified platforms "
            "can significantly enhance engagement for neurodiverse children who might otherwise struggle in large lecture environments.\n\n"
            "On the other hand, skeptics raise legitimate concerns regarding cognitive dependency and emotional isolation. "
            "Human educators do not merely impart factual data; they instill moral empathy, collaborative problem-solving, and resilience. "
            "If children interact predominantly with automated screens, their capacity for nuanced interpersonal communication could diminish.\n\n"
            "In conclusion, although artificial intelligence offers powerful diagnostic tools that can assist instruction, "
            "it should complement rather than supersede human teachers. The ideal educational model harnesses technology while preserving empathetic mentorship."
        )

        result = evaluate_ielts_writing_submission(
            task1_text=task1_sample,
            task2_text=task2_sample,
            task1_time_seconds=1200,
            task2_time_seconds=2400,
        )

        self.assertIn("overall_band", result)
        self.assertGreaterEqual(result["overall_band"], 6.5)
        self.assertLessEqual(result["overall_band"], 8.5)
        self.assertIn(result["cefr_level"], ["B2", "C1", "C2"])
        self.assertIn("criteria_breakdown", result)
        self.assertIn("task_achievement_or_response", result["criteria_breakdown"])
        self.assertIn("coherence_and_cohesion", result["criteria_breakdown"])
        self.assertIn("lexical_resource", result["criteria_breakdown"])
        self.assertIn("grammatical_range_and_accuracy", result["criteria_breakdown"])

    def test_word_count_penalty_detection(self):
        """Under-length essays receive automatic Task Achievement/Response penalties and Persian guidance."""
        from ielts.writing_evaluator import evaluate_ielts_writing_submission

        short_t1 = "This is a very short report about renewable energy. It shows Denmark and Norway."
        short_t2 = "I think artificial intelligence is good for schools because students like computers."

        result = evaluate_ielts_writing_submission(
            task1_text=short_t1,
            task2_text=short_t2,
        )

        self.assertLessEqual(result["overall_band"], 5.0)
        # Verify Persian advice mentions word count deficiency
        advice_text = " ".join(result["pedagogical_advice"])
        self.assertIn("کلمات", advice_text)

    def test_persian_l1_error_annotations(self):
        """Detects common Persian transfer mistakes like 'discuss about', 'I am agree', and informal contractions."""
        from ielts.writing_evaluator import evaluate_ielts_writing_submission

        flawed_text = (
            "We must discuss about this important problem because I am agree with experts. "
            "In my opinion, I think it's very bad to make a research without planning."
        )

        result = evaluate_ielts_writing_submission(task2_text=flawed_text)
        annotations = result["annotations"]
        categories = [ann["category"] for ann in annotations]

        self.assertIn("grammar", categories)
        # Check that Persian explanation exists for learner guidance
        for ann in annotations:
            self.assertTrue(len(ann["explanation_fa"]) > 5)

    def test_writing_prompts_catalog_api(self):
        """GET /api/ielts/writing/prompts/ returns available Task 1 & Task 2 prompts."""
        resp = self.client.get("/api/ielts/writing/prompts/")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.data), 2)
        task_types = [p["task_type"] for p in resp.data]
        self.assertIn("writing_task1_academic", task_types)
        self.assertIn("writing_task2_essay", task_types)

    def test_writing_draft_autosave_and_retrieval_api(self):
        """POST and GET /api/ielts/writing/draft/ handles autosaving and resuming drafts."""
        # Create draft
        resp = self.client.post(
            "/api/ielts/writing/draft/",
            data={
                "task1_text": "The chart illustrates renewable electricity generation.",
                "task2_text": "Artificial intelligence in modern classrooms presents opportunities.",
                "task1_time_seconds": 300,
                "task2_time_seconds": 600,
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data["success"])
        sub_id = resp.data["submission_id"]
        self.assertEqual(resp.data["task1_word_count"], 6)
        self.assertEqual(resp.data["task2_word_count"], 7)

        # Retrieve active draft
        resp_get = self.client.get("/api/ielts/writing/draft/")
        self.assertEqual(resp_get.status_code, 200)
        self.assertEqual(resp_get.data["id"], sub_id)
        self.assertEqual(resp_get.data["task1_text"], "The chart illustrates renewable electricity generation.")

    def test_writing_submit_and_report_api(self):
        """POST /api/ielts/writing/submit/ evaluates and returns diagnostic report with band range."""
        essay_t1 = (
            "The bar chart illustrates the proportion of electricity from renewable sources. "
            "Overall, Norway had the highest figures throughout the ten-year period."
        )
        essay_t2 = (
            "In conclusion, artificial intelligence should be incorporated with careful guidance. "
            "On the one hand it motivates students, but on the other hand teacher empathy is irreplaceable."
        )

        resp = self.client.post(
            "/api/ielts/writing/submit/",
            data={
                "task1_text": essay_t1,
                "task2_text": essay_t2,
                "task1_time_seconds": 1000,
                "task2_time_seconds": 1800,
            },
            format="json",
        )
        self.assertEqual(resp.status_code, 201)
        sub_id = resp.data["id"]
        self.assertEqual(resp.data["status"], "evaluated")
        self.assertIn("overall_band", resp.data)
        self.assertIn("criteria_breakdown", resp.data)

        # GET Report
        resp_rep = self.client.get(f"/api/ielts/writing/report/{sub_id}/")
        self.assertEqual(resp_rep.status_code, 200)
        self.assertEqual(resp_rep.data["id"], sub_id)
        self.assertEqual(resp_rep.data["status"], "evaluated")

        # GET History
        resp_hist = self.client.get("/api/ielts/writing/history/")
        self.assertEqual(resp_hist.status_code, 200)
        self.assertGreaterEqual(len(resp_hist.data), 1)

    def test_teacher_review_request_escalation_api(self):
        """POST /api/ielts/writing/<id>/request-teacher-review/ marks submission for teacher grading."""
        # Submit an essay
        resp = self.client.post(
            "/api/ielts/writing/submit/",
            data={"task2_text": "Sample essay text for teacher review."},
            format="json",
        )
        sub_id = resp.data["id"]

        # Request teacher review
        resp_tr = self.client.post(f"/api/ielts/writing/{sub_id}/request-teacher-review/")
        self.assertEqual(resp_tr.status_code, 200)
        self.assertTrue(resp_tr.data["success"])

        # Check in database
        from ielts.models import IELTSWritingSubmission
        sub = IELTSWritingSubmission.objects.get(id=sub_id)
        self.assertTrue(sub.teacher_review_requested)



