from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from django.db import models, transaction
from django.http import FileResponse, Http404, HttpResponse
from django.urls import reverse
from voice_lab.models import VoiceRecording
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import ExamAnswer, ExamQuestion, ExamSubmission, OnlineExam, ProctoringLog
from .permissions import (
    IsEnrolledStudent,
    IsSubmissionOwnerOrTeacher,
    IsTeacherOrReadOnly,
    IsTeacherOwner,
)
from .serializers import (
    ExamAnswerSerializer,
    ExamAnswerSubmitSerializer,
    ExamQuestionSerializer,
    ExamStudentViewSerializer,
    ExamSubmissionDetailSerializer,
    ExamSubmissionListSerializer,
    ExamTeacherGradingSerializer,
    OnlineExamCreateUpdateSerializer,
    OnlineExamDetailSerializer,
    OnlineExamListSerializer,
    ProctoringLogItemSerializer,
)
from .services.auto_grader import ExamAutoGrader
from .services.export_excel import ExamExcelExporter
from .services.export_pdf import ExamPdfExporter
from .services.integrity_calculator import IntegrityCalculator
from teachers.models import TeacherLearnerLink


class OnlineExamViewSet(viewsets.ModelViewSet):
    queryset = OnlineExam.objects.select_related('teacher', 'teacher_class')

    def get_permissions(self):
        if self.action in [
            'create', 'update', 'partial_update', 'destroy',
            'publish', 'close', 'export_excel', 'export_pdf_summary'
        ]:
            return [permissions.IsAuthenticated(), IsTeacherOwner()]
        if self.action in ['retrieve', 'student_view']:
            return [permissions.IsAuthenticated(), IsEnrolledStudent()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return OnlineExamListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return OnlineExamCreateUpdateSerializer
        return OnlineExamDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_staff or user.is_superuser:
            return qs

        # Teachers see their own exams
        if getattr(user, 'role', '') == 'teacher' or qs.filter(teacher=user).exists():
            return qs.filter(teacher=user)

        # Learners see published or closed exams where they are enrolled or have a submission
        enrolled_class_ids = TeacherLearnerLink.objects.filter(
            learner=user,
            status='active',
        ).values_list('teacher_class_id', flat=True)

        return qs.filter(
            status__in=[OnlineExam.ExamStatus.PUBLISHED, OnlineExam.ExamStatus.CLOSED]
        ).filter(
            models.Q(teacher_class_id__in=enrolled_class_ids) |
            models.Q(submissions__student=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        exam = self.get_object()
        exam.status = OnlineExam.ExamStatus.PUBLISHED
        exam.published_at = timezone.now()
        exam.save(update_fields=['status', 'published_at', 'updated_at'])
        return Response({'status': 'published'})

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        exam = self.get_object()
        exam.status = OnlineExam.ExamStatus.CLOSED
        exam.save(update_fields=['status', 'updated_at'])
        return Response({'status': 'closed'})

    @action(detail=True, methods=['get'])
    def student_view(self, request, pk=None):
        exam = self.get_object()
        serializer = ExamStudentViewSerializer(exam, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def export_excel(self, request, pk=None):
        exam = self.get_object()  # checks IsTeacherOwner
        excel_buffer = ExamExcelExporter.generate(str(exam.id))
        response = HttpResponse(
            excel_buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="exam_{exam.id}_report.xlsx"'
        return response

    @action(detail=True, methods=['get'])
    def export_pdf_summary(self, request, pk=None):
        exam = self.get_object()  # checks IsTeacherOwner
        pdf_buffer = ExamPdfExporter.generate_exam_summary(str(exam.id))
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="exam_{exam.id}_summary.pdf"'
        return response


class ExamQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = ExamQuestionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'reorder']:
            return [permissions.IsAuthenticated(), IsTeacherOwner()]
        return [permissions.IsAuthenticated(), IsTeacherOrReadOnly()]

    def _get_exam(self):
        exam_id = self.kwargs.get('exam_id')
        exam = get_object_or_404(OnlineExam, id=exam_id)
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'reorder']:
            if exam.teacher_id != self.request.user.id and not self.request.user.is_staff and not self.request.user.is_superuser:
                raise PermissionDenied("فقط مدرس سازنده آزمون مجاز به ویرایش سوالات است.")
        return exam

    def get_queryset(self):
        exam = self._get_exam()
        return ExamQuestion.objects.filter(exam=exam)

    def get_object(self):
        exam = self._get_exam()
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(ExamQuestion, id=pk, exam=exam)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        exam = self._get_exam()
        serializer.save(exam=exam)

    @action(detail=False, methods=['post'])
    def reorder(self, request, exam_id=None):
        exam = self._get_exam()
        data = request.data
        if isinstance(data, dict) and 'items' in data:
            data = data['items']
        if not isinstance(data, list):
            return Response({'error': 'Expected a list of objects.'}, status=status.HTTP_400_BAD_REQUEST)

        exam_questions = self.get_queryset()
        question_map = {str(q.id): q for q in exam_questions}

        for item in data:
            q_id = str(item.get('id'))
            order = item.get('order')
            if q_id in question_map and order is not None:
                q = question_map[q_id]
                q.order = order
                q.save(update_fields=['order'])

        return Response({'status': 'reordered'})


class ExamSubmissionViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsEnrolledStudent()]
        if self.action in ['retrieve', 'export_pdf']:
            return [permissions.IsAuthenticated(), IsSubmissionOwnerOrTeacher()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['list', 'create']:
            return ExamSubmissionListSerializer
        return ExamSubmissionDetailSerializer

    def _get_exam(self):
        exam_id = self.kwargs.get('exam_id')
        return get_object_or_404(OnlineExam, id=exam_id)

    def get_queryset(self):
        exam = self._get_exam()
        user = self.request.user
        qs = ExamSubmission.objects.filter(exam=exam)

        if exam.teacher_id == user.id or user.is_staff or user.is_superuser:
            return qs
        return qs.filter(student=user)

    def get_object(self):
        exam = self._get_exam()
        pk = self.kwargs.get('pk')
        obj = get_object_or_404(ExamSubmission, id=pk, exam=exam)
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        exam = self._get_exam()

        # Enforce publication
        if exam.status != OnlineExam.ExamStatus.PUBLISHED:
            return Response(
                {"error": "آزمون در وضعیت انتشار نیست و امکان شرکت در آن وجود ندارد."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enforce availability window
        now = timezone.now()
        if exam.starts_at and now < exam.starts_at:
            return Response(
                {"error": "زمان شرکت در این آزمون هنوز آغاز نشده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if exam.ends_at and now > exam.ends_at:
            return Response(
                {"error": "مهلت شرکت در این آزمون به پایان رسیده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enforce enrollment / access code
        is_enrolled = IsEnrolledStudent()
        if not is_enrolled.has_object_permission(request, self, exam):
            raise PermissionDenied("شما مجوز شرکت در این آزمون را ندارید.")

        # Concurrency-safe attempt limit check
        with transaction.atomic():
            OnlineExam.objects.select_for_update().get(pk=exam.pk)
            existing_count = (
                ExamSubmission.objects.filter(exam=exam, student=request.user)
                .count()
            )
            if existing_count >= exam.max_attempts:
                return Response(
                    {"error": "سقف دفعات مجاز برای شرکت در این آزمون تکمیل شده است."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            max_possible_score = sum(
                (q.points for q in exam.exam_questions.all()),
                Decimal("0.00"),
            )
            time_limit = now + timedelta(minutes=exam.duration_minutes)

            submission = ExamSubmission.objects.create(
                exam=exam,
                student=request.user,
                attempt_number=existing_count + 1,
                status=ExamSubmission.SubmissionStatus.IN_PROGRESS,
                started_at=now,
                time_limit_expires_at=time_limit,
                max_possible_score=max_possible_score,
            )

        serializer = ExamSubmissionDetailSerializer(submission, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def submit(self, request, exam_id=None, pk=None):
        submission = self.get_object()
        submission = ExamSubmission.objects.select_for_update().get(pk=submission.pk)
        if submission.student_id != request.user.id and not request.user.is_staff and not request.user.is_superuser:
            raise PermissionDenied("فقط زبان‌آموز شرکت‌کننده مجاز به ثبت نهایی پاسخنامه است.")

        if submission.status == ExamSubmission.SubmissionStatus.IN_PROGRESS:
            submission.status = ExamSubmission.SubmissionStatus.SUBMITTED
            submission.submitted_at = timezone.now()
            submission.save(update_fields=['status', 'submitted_at', 'updated_at'])

            # 1. Compute anti-cheat integrity score
            try:
                IntegrityCalculator.calculate_score(str(submission.id))
            except Exception:
                pass

            # 2. Trigger auto-grading engine
            try:
                ExamAutoGrader.grade_submission(str(submission.id))
            except Exception:
                pass

            submission.refresh_from_db()
            serializer = ExamSubmissionDetailSerializer(submission, context={'request': request})
            return Response(serializer.data)

        return Response({'error': 'Submission already submitted.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, exam_id=None, pk=None):
        submission = self.get_object()  # checks IsSubmissionOwnerOrTeacher
        pdf_buffer = ExamPdfExporter.generate_student_report(str(submission.id))
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="submission_{submission.id}_report.pdf"'
        return response


class ExamAnswerViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ExamAnswerSubmitSerializer
        return ExamAnswerSerializer

    def _get_submission(self, *, for_update=False):
        exam_id = self.kwargs.get('exam_id')
        submission_id = self.kwargs.get('submission_id')
        exam = get_object_or_404(OnlineExam, id=exam_id)
        # Relationship chain: submission belongs to exam
        submissions = ExamSubmission.objects.select_for_update() if for_update else ExamSubmission.objects.all()
        submission = get_object_or_404(submissions, id=submission_id, exam=exam)
        return exam, submission

    def get_queryset(self):
        exam, submission = self._get_submission()
        user = self.request.user
        if submission.student_id != user.id and exam.teacher_id != user.id and not user.is_staff and not user.is_superuser:
            raise PermissionDenied("شما مجاز به مشاهده پاسخ‌های این آزمون نیستید.")
        return ExamAnswer.objects.filter(submission=submission)

    def get_object(self):
        exam, submission = self._get_submission()
        pk = self.kwargs.get('pk')
        # Relationship chain: answer belongs to submission
        answer = get_object_or_404(ExamAnswer, id=pk, submission=submission)
        user = self.request.user

        if self.action == 'destroy':
            # Students cannot delete answers
            raise PermissionDenied("حذف پاسخ‌های آزمون مجاز نمی‌باشد.")

        if submission.student_id != user.id and exam.teacher_id != user.id and not user.is_staff and not user.is_superuser:
            raise PermissionDenied("شما اجازه دسترسی به این پاسخ را ندارید.")

        return answer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        exam, submission = self._get_submission(for_update=True)
        user = request.user

        # Only student can submit their own answers
        if submission.student_id != user.id and not user.is_staff and not user.is_superuser:
            raise PermissionDenied("فقط زبان‌آموز شرکت‌کننده مجاز به ارسال پاسخ است.")

        if submission.status != ExamSubmission.SubmissionStatus.IN_PROGRESS:
            return Response(
                {"error": "امکان ثبت پاسخ برای آزمون ارسال شده وجود ندارد."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if submission.is_time_expired():
            submission.status = ExamSubmission.SubmissionStatus.TIMED_OUT
            submission.save(update_fields=["status", "updated_at"])
            return Response(
                {"error": "مهلت زمان پاسخ‌دهی به آزمون به پایان رسیده است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ExamAnswerSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        exam_question_id = serializer.validated_data["exam_question_id"]
        # Cross-exam question reference validation:
        # Question MUST belong to THIS exam!
        try:
            exam_question = ExamQuestion.objects.get(id=exam_question_id, exam=exam)
        except ExamQuestion.DoesNotExist:
            return Response(
                {"error": "سوال انتخاب شده متعلق به این آزمون نیست."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        student_response = serializer.validated_data.get("student_response", {})
        audio_recording_url = serializer.validated_data.get("audio_recording_url", "")

        student_response, audio_recording_url = self._validated_answer(
            request, exam, submission, exam_question, student_response, audio_recording_url
        )

        # Retry-safe / Idempotent answer save
        answer, _created = ExamAnswer.objects.update_or_create(
            submission=submission,
            exam_question=exam_question,
            defaults={
                "student_response": student_response,
                "audio_recording_url": audio_recording_url,
            },
        )

        return Response(ExamAnswerSerializer(answer).data, status=status.HTTP_200_OK if not _created else status.HTTP_201_CREATED)

    @staticmethod
    def _validated_answer(request, exam, submission, exam_question, student_response, audio_recording_url):
        if exam_question.question_version.question_type == "speaking":
            if not isinstance(student_response, dict):
                raise ValidationError("A speaking answer requires a saved recording.")
            recording_id = student_response.get("recording_id")
            if type(recording_id) is not int:
                raise ValidationError("A speaking answer requires a saved recording.")
            recording = get_object_or_404(VoiceRecording, pk=recording_id, learner_id=submission.student_id,
                                          session_id=str(submission.pk), scenario_id=str(exam_question.pk), is_deleted=False)
            if not recording.audio_file or (recording.expires_at and recording.expires_at <= timezone.now()):
                raise ValidationError("This recording is unavailable.")
            audio_recording_url = request.build_absolute_uri(reverse("exam-speaking-playback",
                args=[exam.id, submission.pk, exam_question.pk]))
            student_response = {"recording_id": recording.pk, "audio_recorded": True}

        return student_response, audio_recording_url

    def speaking_audio(self, request, exam_id, submission_id, question_id):
        answer = get_object_or_404(self.get_queryset().select_related("submission"), exam_question_id=question_id)
        recording_id = (answer.student_response or {}).get("recording_id")
        recording = get_object_or_404(VoiceRecording, pk=recording_id, learner_id=answer.submission.student_id,
                                      session_id=str(submission_id), scenario_id=str(question_id), is_deleted=False)
        if not recording.audio_file or (recording.expires_at and recording.expires_at <= timezone.now()):
            raise Http404
        response = FileResponse(recording.audio_file.open("rb"), content_type=recording.mime_type)
        response["Cache-Control"] = "private, no-store"
        return response

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        exam, submission = self._get_submission(for_update=True)
        answer = self.get_object()
        user = request.user

        # Teacher manual grading
        if exam.teacher_id == user.id or user.is_staff or user.is_superuser:
            manual_score = request.data.get("manual_score")
            feedback = request.data.get("teacher_feedback", answer.teacher_feedback)

            if manual_score is not None:
                try:
                    score_dec = Decimal(str(manual_score))
                except Exception:
                    return Response({"error": "نمره نامعتبر است."}, status=status.HTTP_400_BAD_REQUEST)

                if not score_dec.is_finite() or score_dec < Decimal("0.00") or score_dec > answer.exam_question.points:
                    return Response(
                        {"error": f"نمره باید بین ۰ و {answer.exam_question.points} باشد."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                answer.manual_score = score_dec
                answer.score_awarded = score_dec
                answer.graded_by = user
                answer.graded_at = timezone.now()

            answer.teacher_feedback = feedback
            answer.save()

            # Recalculate assessment totals consistently
            total = sum(
                (a.score_awarded or Decimal("0.00") for a in submission.answers.all()),
                Decimal("0.00"),
            )
            submission.total_score = total
            if submission.max_possible_score and submission.max_possible_score > Decimal("0.00"):
                submission.percentage = round((total / submission.max_possible_score) * Decimal("100.00"), 2)
            submission.status = ExamSubmission.SubmissionStatus.MANUALLY_GRADED
            submission.save(update_fields=["total_score", "percentage", "status", "updated_at"])

            return Response(ExamAnswerSerializer(answer).data)

        # Student updating in-progress answer
        if submission.student_id == user.id:
            if submission.status != ExamSubmission.SubmissionStatus.IN_PROGRESS or submission.is_time_expired():
                return Response({"error": "آزمون به پایان رسیده است."}, status=status.HTTP_400_BAD_REQUEST)

            answer.student_response, answer.audio_recording_url = self._validated_answer(
                request, exam, submission, answer.exam_question,
                request.data.get("student_response", answer.student_response),
                request.data.get("audio_recording_url", answer.audio_recording_url),
            )
            answer.save()
            return Response(ExamAnswerSerializer(answer).data)

        raise PermissionDenied("دسترسی غیرمجاز.")


class ProctoringLogBatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "sensitive_endpoint"

    def post(self, request, exam_id, submission_id):
        exam = get_object_or_404(OnlineExam, id=exam_id)
        submission = get_object_or_404(ExamSubmission, id=submission_id, exam=exam)

        # Reject events for other students' submissions
        if submission.student_id != request.user.id and not request.user.is_staff and not request.user.is_superuser:
            raise PermissionDenied("ارسال لاگ نظارت برای سایر زبان‌آموزان مجاز نیست.")

        # Align payload shape: accepts {"events": [...]} or list directly
        raw_events = request.data.get("events") if isinstance(request.data, dict) else request.data
        if not isinstance(raw_events, list):
            return Response(
                {"error": "Payload must include an 'events' list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(raw_events) > 500:
            return Response(
                {"error": "Batch size exceeds maximum limit of 500 events."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ProctoringLogItemSerializer(data=raw_events, many=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        logs = [
            ProctoringLog(submission=submission, **item)
            for item in serializer.validated_data
        ]
        ProctoringLog.objects.bulk_create(logs)
        return Response({"created": len(logs), "created_count": len(logs)}, status=status.HTTP_201_CREATED)


class OnlineExamByCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, access_code):
        exam = get_object_or_404(OnlineExam, access_code=access_code)
        # Unrelated learners cannot read a draft exam by access code
        if exam.status == OnlineExam.ExamStatus.DRAFT:
            if exam.teacher_id != request.user.id and not request.user.is_staff and not request.user.is_superuser:
                raise Http404("آزمون یافت نشد.")

        serializer = ExamStudentViewSerializer(exam, context={'request': request})
        return Response(serializer.data)
