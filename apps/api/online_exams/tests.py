import io
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer, ProctoringLog
from .services.auto_grader import ExamAutoGrader
from .services.integrity_calculator import IntegrityCalculator
from .services.export_excel import ExamExcelExporter
from .services.export_pdf import ExamPdfExporter
from questions.models import Question, QuestionVersion
from teachers.models import TeacherClass, TeacherLearnerLink, LinkStatus

User = get_user_model()


class AutoGraderTestCase(TestCase):
    def test_grade_mcq_correct(self):
        resp = {'selected_option': 'opt_b'}
        key = {'correct_option': 'opt_b'}
        points = Decimal('10.00')
        score = ExamAutoGrader.grade_mcq(resp, key, points)
        self.assertEqual(score, points)

    def test_grade_mcq_incorrect(self):
        resp = {'selected_option': 'opt_a'}
        key = {'correct_option': 'opt_b'}
        points = Decimal('10.00')
        score = ExamAutoGrader.grade_mcq(resp, key, points)
        self.assertEqual(score, Decimal('0.00'))

    def test_grade_multi_select_partial(self):
        resp = {'selected_options': ['opt_a', 'opt_b']}
        key = {'correct_options': ['opt_a', 'opt_b', 'opt_c']}
        points = Decimal('12.00')
        score = ExamAutoGrader.grade_multi_select(resp, key, points)
        # 2 correct out of 3 = 8.00
        self.assertEqual(score, Decimal('8.00'))

    def test_grade_gap_fill_regex_and_case(self):
        resp = {'blanks': {'gap_1': 'Persepolis'}}
        key = {'blanks': {'gap_1': ['persepolis', 'takht-e jamshid']}}
        points = Decimal('5.00')
        score = ExamAutoGrader.grade_gap_fill(resp, key, [], points)
        self.assertEqual(score, points)

    def test_grade_matching(self):
        resp = {'pairs': {'term_1': 'def_1', 'term_2': 'def_wrong'}}
        key = {'pairs': {'term_1': 'def_1', 'term_2': 'def_2'}}
        points = Decimal('10.00')
        score = ExamAutoGrader.grade_matching(resp, key, points)
        # 1 out of 2 = 5.00
        self.assertEqual(score, Decimal('5.00'))

    def test_grade_ordering(self):
        resp = {'order': ['step_1', 'step_2', 'step_3']}
        key = {'order': ['step_1', 'step_2', 'step_3']}
        points = Decimal('15.00')
        score = ExamAutoGrader.grade_ordering(resp, key, points)
        self.assertEqual(score, points)


class OnlineExamsIntegrationTestCase(TestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email='teacher@endoora.com',
            password='testpassword123'
        )
        self.student = User.objects.create_user(
            email='student@endoora.com',
            password='testpassword123'
        )

        self.exam = OnlineExam.objects.create(
            teacher=self.teacher,
            title='IELTS Assessment B2',
            duration_minutes=60,
            passing_score=Decimal('60.00'),
            anti_cheat_config=OnlineExam.get_default_anti_cheat_config(),
        )

        self.question = Question.objects.create(slug='test-mcq-slug', created_by=self.teacher)
        self.qv = QuestionVersion.objects.create(
            question=self.question,
            version_number=1,
            question_type=QuestionVersion.QuestionType.MCQ,
            title_fa='سوال تستی',
            prompt_en='What is the capital of Iran?',
            difficulty=2,
            cefr_level=QuestionVersion.CefrLevel.B1,
            learner_payload={'options': [{'id': 'tehran', 'text': 'Tehran'}, {'id': 'shiraz', 'text': 'Shiraz'}]},
            answer_key={'correct_option': 'tehran'},
        )

        self.eq = ExamQuestion.objects.create(
            exam=self.exam,
            question_version=self.qv,
            order=1,
            points=Decimal('20.00'),
        )

    def test_teacher_can_play_submitted_speaking_answer(self):
        import tempfile
        from django.test import override_settings
        from django.core.files.uploadedfile import SimpleUploadedFile
        from rest_framework.test import APIClient
        from voice_lab.services import VoicePipelineService

        self.qv.question_type = "speaking"
        self.qv.save(update_fields=["question_type"])
        sub = ExamSubmission.objects.create(exam=self.exam, student=self.student, started_at=timezone.now())
        client = APIClient()
        client.force_authenticate(self.student)
        with tempfile.TemporaryDirectory() as media, override_settings(MEDIA_ROOT=media):
            voice = VoicePipelineService()
            ticket = voice.create_upload_ticket(self.student, "answer.webm", session_id=str(sub.id),
                                                scenario_id=str(self.eq.id), retention_policy="7_days")
            rec = voice.process_audio_upload(self.student, ticket["recording_id"],
                SimpleUploadedFile("answer.webm", b"audio fixture", content_type="audio/webm"))
            base = f"/api/online-exams/{self.exam.id}/submissions/{sub.id}"
            saved = client.post(f"{base}/answers/", {"exam_question_id": str(self.eq.id),
                                "student_response": {"recording_id": rec.pk}}, format="json")
            self.assertEqual(saved.status_code, 201, saved.data)
            client.force_authenticate(self.teacher)
            playback = client.get(f"{base}/questions/{self.eq.id}/audio/")
            self.assertEqual(playback.status_code, 200)
            self.assertEqual(b"".join(playback.streaming_content), b"audio fixture")
            voice.delete_recording(self.student, rec.pk)
            self.assertEqual(client.get(f"{base}/questions/{self.eq.id}/audio/").status_code, 404)

    def test_submission_lifecycle_and_integrity(self):
        submission = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            started_at=timezone.now(),
            max_possible_score=Decimal('20.00'),
        )

        # Create answer
        answer = ExamAnswer.objects.create(
            submission=submission,
            exam_question=self.eq,
            student_response={'selected_option': 'tehran'},
        )

        # Log some proctoring events
        ProctoringLog.objects.create(
            submission=submission,
            event_type='blur',
            duration_seconds=3.5,
        )
        ProctoringLog.objects.create(
            submission=submission,
            event_type='paste_attempt',
        )

        # Test integrity calculation
        details = IntegrityCalculator.calculate_score(str(submission.id))
        submission.refresh_from_db()
        # 100 - (3 blur + 5 paste) = 92
        self.assertEqual(submission.integrity_score, Decimal('92.00'))

        # Test auto-grading
        graded_sub = ExamAutoGrader.grade_submission(str(submission.id))
        self.assertEqual(graded_sub.total_score, Decimal('20.00'))
        self.assertEqual(graded_sub.percentage, Decimal('100.00'))

    def test_excel_export_generation(self):
        submission = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            started_at=timezone.now(),
            submitted_at=timezone.now(),
            total_score=Decimal('20.00'),
            max_possible_score=Decimal('20.00'),
            percentage=Decimal('100.00'),
            integrity_score=Decimal('95.00'),
        )

        excel_buf = ExamExcelExporter.generate(str(self.exam.id))
        self.assertIsInstance(excel_buf, io.BytesIO)
        self.assertGreater(excel_buf.getbuffer().nbytes, 1000)

    def test_pdf_export_generation(self):
        submission = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            started_at=timezone.now(),
            submitted_at=timezone.now(),
            total_score=Decimal('20.00'),
            max_possible_score=Decimal('20.00'),
            percentage=Decimal('100.00'),
            integrity_score=Decimal('95.00'),
        )

        pdf_student = ExamPdfExporter.generate_student_report(str(submission.id))
        self.assertIsInstance(pdf_student, io.BytesIO)
        self.assertGreater(pdf_student.getbuffer().nbytes, 1000)

        pdf_summary = ExamPdfExporter.generate_exam_summary(str(self.exam.id))
        self.assertIsInstance(pdf_summary, io.BytesIO)
        self.assertGreater(pdf_summary.getbuffer().nbytes, 1000)


class ExamOwnershipAndEnrollmentSecurityTests(APITestCase):
    def setUp(self):
        self.teacher_owner = User.objects.create_user(
            email='exam_owner@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.other_teacher = User.objects.create_user(
            email='other_teacher@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.student_enrolled = User.objects.create_user(
            email='enrolled_student@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )
        self.student_unrelated = User.objects.create_user(
            email='unrelated_student@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )

        self.t_class = TeacherClass.objects.create(
            teacher=self.teacher_owner,
            title='Class 101',
        )
        TeacherLearnerLink.objects.create(
            teacher=self.teacher_owner,
            learner=self.student_enrolled,
            teacher_class=self.t_class,
            status=LinkStatus.ACTIVE,
        )

        self.exam_draft = OnlineExam.objects.create(
            teacher=self.teacher_owner,
            teacher_class=self.t_class,
            title='Draft Exam 1',
            status=OnlineExam.ExamStatus.DRAFT,
            access_code='DRAFT123',
        )

        self.exam_pub = OnlineExam.objects.create(
            teacher=self.teacher_owner,
            teacher_class=self.t_class,
            title='Published Exam 1',
            status=OnlineExam.ExamStatus.PUBLISHED,
            access_code='PUB12345',
            duration_minutes=45,
            max_attempts=1,
        )

        self.question = Question.objects.create(slug='q1-test', created_by=self.teacher_owner)
        self.qv = QuestionVersion.objects.create(
            question=self.question,
            version_number=1,
            question_type=QuestionVersion.QuestionType.MCQ,
            title_fa='سوال تستی',
            difficulty=2,
            prompt_en='Sample prompt',
            learner_payload={'options': [{'id': 'a', 'text': 'Option A'}]},
            answer_key={'correct_option': 'a'},
        )
        self.eq = ExamQuestion.objects.create(
            exam=self.exam_pub,
            question_version=self.qv,
            order=1,
        )

    def test_unrelated_learner_cannot_read_draft_exam(self):
        self.client.force_authenticate(self.student_unrelated)

        # Retrieve draft exam directly
        resp = self.client.get(f'/api/online-exams/{self.exam_draft.id}/')
        self.assertIn(resp.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        # Student view of draft
        resp = self.client.get(f'/api/online-exams/{self.exam_draft.id}/student_view/')
        self.assertIn(resp.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        # By access code
        resp = self.client.get(f'/api/online-exams/by-code/{self.exam_draft.access_code}/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_another_teacher_cannot_modify_questions_or_reorder(self):
        self.client.force_authenticate(self.other_teacher)

        # Attempt to add question
        resp = self.client.post(
            f'/api/online-exams/{self.exam_pub.id}/questions/',
            {'question_version': str(self.qv.id), 'points': 10},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to reorder questions
        resp = self.client.post(
            f'/api/online-exams/{self.exam_pub.id}/questions/reorder/',
            [{'id': str(self.eq.id), 'order': 2}],
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_students_cannot_read_or_delete_other_students_answers(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam_pub,
            student=self.student_enrolled,
            status=ExamSubmission.SubmissionStatus.IN_PROGRESS,
            max_possible_score=Decimal('10.00'),
        )
        ans = ExamAnswer.objects.create(
            submission=sub,
            exam_question=self.eq,
            student_response={'selected': 'a'},
        )

        # Unrelated student attempts to read
        self.client.force_authenticate(self.student_unrelated)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub.id}/answers/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub.id}/answers/{ans.id}/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Enrolled student attempts to delete own answer
        self.client.force_authenticate(self.student_enrolled)
        resp = self.client.delete(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub.id}/answers/{ans.id}/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_mismatched_nested_url_identifiers_fail(self):
        other_exam = OnlineExam.objects.create(
            teacher=self.teacher_owner,
            title='Other Exam',
            status=OnlineExam.ExamStatus.PUBLISHED,
        )
        sub = ExamSubmission.objects.create(
            exam=self.exam_pub,
            student=self.student_enrolled,
        )
        ans = ExamAnswer.objects.create(
            submission=sub,
            exam_question=self.eq,
        )

        self.client.force_authenticate(self.teacher_owner)

        # Request with mismatched exam_id and question_id
        resp = self.client.get(f'/api/online-exams/{other_exam.id}/questions/{self.eq.id}/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

        # Request with mismatched exam_id and submission_id
        resp = self.client.get(f'/api/online-exams/{other_exam.id}/submissions/{sub.id}/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

        # Request with mismatched submission_id and answer_id
        other_sub = ExamSubmission.objects.create(
            exam=self.exam_pub,
            student=self.student_enrolled,
            attempt_number=2,
        )
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/submissions/{other_sub.id}/answers/{ans.id}/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_exports_fail(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam_pub,
            student=self.student_enrolled,
        )

        # Student tries excel export (forbidden)
        self.client.force_authenticate(self.student_unrelated)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/export_excel/')
        self.assertIn(resp.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        self.client.force_authenticate(self.student_enrolled)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/export_excel/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Another teacher tries summary pdf export
        self.client.force_authenticate(self.other_teacher)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/export_pdf_summary/')
        self.assertIn(resp.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        # Unrelated student tries to export another student's submission pdf
        self.client.force_authenticate(self.student_unrelated)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub.id}/export_pdf/')
        self.assertIn(resp.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

    def test_legitimate_teacher_and_enrolled_student_journeys_work(self):
        # Teacher manages exam
        self.client.force_authenticate(self.teacher_owner)
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/export_excel/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Enrolled student starts exam
        self.client.force_authenticate(self.student_enrolled)
        resp = self.client.post(f'/api/online-exams/{self.exam_pub.id}/submissions/')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        sub_id = resp.data['id']

        # Enrolled student saves answer
        resp = self.client.post(
            f'/api/online-exams/{self.exam_pub.id}/submissions/{sub_id}/answers/',
            {'exam_question_id': str(self.eq.id), 'student_response': {'selected_option': 'a'}},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # Enrolled student submits exam
        resp = self.client.post(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub_id}/submit/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Enrolled student exports their report
        resp = self.client.get(f'/api/online-exams/{self.exam_pub.id}/submissions/{sub_id}/export_pdf/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class ExamGradesAndAssessmentSecurityTests(APITestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email='exam_teacher@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.other_teacher = User.objects.create_user(
            email='rival_teacher@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.student = User.objects.create_user(
            email='student_candidate@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )

        self.exam = OnlineExam.objects.create(
            teacher=self.teacher,
            title='IELTS B2 Exam',
            status=OnlineExam.ExamStatus.PUBLISHED,
            max_attempts=1,
            show_results_to_student=False,
            access_code='SECURE100',
        )

        self.q = Question.objects.create(slug='grading-q', created_by=self.teacher)
        self.qv = QuestionVersion.objects.create(
            question=self.q,
            version_number=1,
            difficulty=2,
            prompt_en='Grade this prompt',
        )
        self.eq = ExamQuestion.objects.create(
            exam=self.exam,
            question_version=self.qv,
            points=Decimal('20.00'),
        )

    def test_student_cannot_inject_scores_or_grading_status(self):
        self.client.force_authenticate(self.student)
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/',
            {
                'access_code': 'SECURE100',
                'total_score': '99.99',
                'percentage': '100.00',
                'status': 'manually_graded',
                'integrity_score': '100.00',
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        sub = ExamSubmission.objects.get(id=resp.data['id'])
        self.assertEqual(sub.status, ExamSubmission.SubmissionStatus.IN_PROGRESS)
        self.assertIsNone(sub.total_score)
        self.assertIsNone(sub.percentage)
        self.assertEqual(sub.max_possible_score, Decimal('20.00'))

    def test_draft_closed_unavailable_exams_reject_attempts(self):
        self.exam.status = OnlineExam.ExamStatus.DRAFT
        self.exam.save()

        self.client.force_authenticate(self.student)
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/',
            {'access_code': 'SECURE100'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

        self.exam.status = OnlineExam.ExamStatus.CLOSED
        self.exam.save()
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/',
            {'access_code': 'SECURE100'},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_attempt_limits_enforced(self):
        self.client.force_authenticate(self.student)
        resp1 = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/',
            {'access_code': 'SECURE100'},
            format='json',
        )
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)

        # Second attempt should be rejected because max_attempts=1
        resp2 = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/',
            {'access_code': 'SECURE100'},
            format='json',
        )
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_teacher_grading_requires_ownership_and_validates_scores(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.SUBMITTED,
            max_possible_score=Decimal('20.00'),
        )
        ans = ExamAnswer.objects.create(
            submission=sub,
            exam_question=self.eq,
        )

        # Other teacher tries to grade
        self.client.force_authenticate(self.other_teacher)
        resp = self.client.patch(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/{ans.id}/',
            {'manual_score': 15.0},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Owning teacher grades with invalid score exceeding question points (20.00)
        self.client.force_authenticate(self.teacher)
        resp_invalid = self.client.patch(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/{ans.id}/',
            {'manual_score': 25.0},
            format='json',
        )
        self.assertEqual(resp_invalid.status_code, status.HTTP_400_BAD_REQUEST)

        # Valid grade
        resp_valid = self.client.patch(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/{ans.id}/',
            {'manual_score': 18.0, 'teacher_feedback': 'Great job!'},
            format='json',
        )
        self.assertEqual(resp_valid.status_code, status.HTTP_200_OK)
        ans.refresh_from_db()
        self.assertEqual(ans.manual_score, Decimal('18.00'))
        self.assertEqual(ans.graded_by, self.teacher)

    def test_show_results_to_student_is_respected(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.MANUALLY_GRADED,
            total_score=Decimal('18.00'),
            max_possible_score=Decimal('20.00'),
            percentage=Decimal('90.00'),
        )
        ExamAnswer.objects.create(
            submission=sub,
            exam_question=self.eq,
            manual_score=Decimal('18.00'),
            score_awarded=Decimal('18.00'),
            teacher_feedback='Secret feedback',
        )

        # Student fetching details when show_results_to_student=False
        self.client.force_authenticate(self.student)
        resp_student = self.client.get(f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/')
        self.assertEqual(resp_student.status_code, status.HTTP_200_OK)
        self.assertIsNone(resp_student.data['total_score'])
        self.assertIsNone(resp_student.data['percentage'])
        self.assertEqual(resp_student.data['answers'][0]['teacher_feedback'], '')

        # Teacher fetching details sees full results
        self.client.force_authenticate(self.teacher)
        resp_teacher = self.client.get(f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/')
        self.assertEqual(resp_teacher.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_teacher.data['total_score'], '18.00')
        self.assertEqual(resp_teacher.data['answers'][0]['teacher_feedback'], 'Secret feedback')


class ExamQuestionAnswerGradingWritesTests(APITestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email='author_teacher@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.student = User.objects.create_user(
            email='active_learner@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )

        self.exam = OnlineExam.objects.create(
            teacher=self.teacher,
            title='Writing & Speaking Exam',
            status=OnlineExam.ExamStatus.PUBLISHED,
            access_code='WRITE200',
        )
        self.other_exam = OnlineExam.objects.create(
            teacher=self.teacher,
            title='Unrelated Exam',
            status=OnlineExam.ExamStatus.PUBLISHED,
            access_code='OTHER300',
        )

        self.q1 = Question.objects.create(slug='q1-write', created_by=self.teacher)
        self.qv1 = QuestionVersion.objects.create(
            question=self.q1,
            version_number=1,
            difficulty=2,
            prompt_en='Question 1',
        )
        self.eq1 = ExamQuestion.objects.create(
            exam=self.exam,
            question_version=self.qv1,
            order=1,
        )

        self.q2 = Question.objects.create(slug='q2-other', created_by=self.teacher)
        self.qv2 = QuestionVersion.objects.create(
            question=self.q2,
            version_number=1,
            difficulty=2,
            prompt_en='Question 2 foreign',
        )
        self.eq2_foreign = ExamQuestion.objects.create(
            exam=self.other_exam,
            question_version=self.qv2,
            order=1,
        )

    def test_teachers_can_add_valid_questions_with_uuid(self):
        q_new = Question.objects.create(slug='q-new', created_by=self.teacher)
        qv_new = QuestionVersion.objects.create(
            question=q_new,
            version_number=1,
            difficulty=2,
            prompt_en='New prompt',
        )

        self.client.force_authenticate(self.teacher)
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/questions/',
            {
                'question_version_id': str(qv_new.id),
                'points': '5.00',
                'order': 2,
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ExamQuestion.objects.filter(exam=self.exam, question_version=qv_new).exists())

    def test_students_can_create_and_update_answers_retry_safely(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.IN_PROGRESS,
            max_possible_score=Decimal('10.00'),
        )

        self.client.force_authenticate(self.student)
        # First save
        resp1 = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/',
            {
                'exam_question_id': str(self.eq1.id),
                'student_response': {'text': 'My first draft'},
            },
            format='json',
        )
        self.assertEqual(resp1.status_code, status.HTTP_201_CREATED)

        # Retry save (idempotent / retry-safe)
        resp2 = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/',
            {
                'exam_question_id': str(self.eq1.id),
                'student_response': {'text': 'My improved draft'},
            },
            format='json',
        )
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        # Assert no duplicate answer was created
        self.assertEqual(ExamAnswer.objects.filter(submission=sub, exam_question=self.eq1).count(), 1)
        ans = ExamAnswer.objects.get(submission=sub, exam_question=self.eq1)
        self.assertEqual(ans.student_response['text'], 'My improved draft')

    def test_cross_exam_question_reference_fails(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.IN_PROGRESS,
        )

        self.client.force_authenticate(self.student)
        # Submitting answer to eq2_foreign (which belongs to other_exam)
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/',
            {
                'exam_question_id': str(self.eq2_foreign.id),
                'student_response': {'text': 'Invalid answer to foreign question'},
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_answer_saves_after_submission_fail(self):
        sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.SUBMITTED,
        )

        self.client.force_authenticate(self.student)
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{sub.id}/answers/',
            {
                'exam_question_id': str(self.eq1.id),
                'student_response': {'text': 'Late answer'},
            },
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class ProctoringContractSecurityTests(APITestCase):
    def setUp(self):
        self.teacher = User.objects.create_user(
            email='proctor_teacher@example.com',
            password='Password-123!',
            role=User.Role.TEACHER,
        )
        self.student = User.objects.create_user(
            email='proctored_student@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )
        self.hacker = User.objects.create_user(
            email='malicious_student@example.com',
            password='Password-123!',
            role=User.Role.LEARNER,
        )

        self.exam = OnlineExam.objects.create(
            teacher=self.teacher,
            title='Proctored Exam',
            status=OnlineExam.ExamStatus.PUBLISHED,
        )
        self.sub = ExamSubmission.objects.create(
            exam=self.exam,
            student=self.student,
            status=ExamSubmission.SubmissionStatus.IN_PROGRESS,
        )

    def test_proctoring_client_submits_events_batch(self):
        self.client.force_authenticate(self.student)
        payload = {
            'events': [
                {'event_type': 'blur', 'duration_seconds': 3.2},
                {'event_type': 'copy_attempt', 'metadata': {'keys': 'Ctrl+C'}},
                {'event_type': 'cut_attempt'},
                {'event_type': 'fullscreen_enter'},
            ]
        }
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{self.sub.id}/proctoring-logs/',
            payload,
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.sub.proctoring_logs.count(), 4)

    def test_proctoring_rejects_foreign_submissions_and_exams(self):
        self.client.force_authenticate(self.hacker)
        payload = {
            'events': [{'event_type': 'blur', 'duration_seconds': 1.0}]
        }
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{self.sub.id}/proctoring-logs/',
            payload,
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_event_types_fail_validation(self):
        self.client.force_authenticate(self.student)
        payload = {
            'events': [{'event_type': 'unsupported_custom_cheat_signal'}]
        }
        resp = self.client.post(
            f'/api/online-exams/{self.exam.id}/submissions/{self.sub.id}/proctoring-logs/',
            payload,
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

