import io
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer, ProctoringLog
from .services.auto_grader import ExamAutoGrader
from .services.integrity_calculator import IntegrityCalculator
from .services.export_excel import ExamExcelExporter
from .services.export_pdf import ExamPdfExporter
from questions.models import Question, QuestionVersion

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
