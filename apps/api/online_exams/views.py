from django.http import HttpResponse
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer, ProctoringLog
from .serializers import (
    OnlineExamListSerializer,
    OnlineExamDetailSerializer,
    OnlineExamCreateUpdateSerializer,
    ExamQuestionSerializer,
    ExamSubmissionListSerializer,
    ExamSubmissionDetailSerializer,
    ExamAnswerSerializer,
    ExamAnswerSubmitSerializer,
    ProctoringLogBatchSerializer,
    ExamStudentViewSerializer,
)
from .permissions import IsTeacherOwner, IsEnrolledStudent, IsTeacherOrReadOnly
from .services.auto_grader import ExamAutoGrader
from .services.integrity_calculator import IntegrityCalculator
from .services.export_excel import ExamExcelExporter
from .services.export_pdf import ExamPdfExporter


class OnlineExamViewSet(viewsets.ModelViewSet):
    queryset = OnlineExam.objects.select_related('teacher', 'teacher_class')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'publish', 'close']:
            return [permissions.IsAuthenticated(), IsTeacherOwner()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return OnlineExamListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return OnlineExamCreateUpdateSerializer
        return OnlineExamDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            qs = qs.filter(teacher=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        exam = self.get_object()
        exam.status = OnlineExam.ExamStatus.PUBLISHED
        exam.published_at = timezone.now()
        exam.save()
        return Response({'status': 'published'})

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        exam = self.get_object()
        exam.status = OnlineExam.ExamStatus.CLOSED
        exam.save()
        return Response({'status': 'closed'})

    @action(detail=True, methods=['get'])
    def student_view(self, request, pk=None):
        exam = self.get_object()
        serializer = ExamStudentViewSerializer(exam, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def export_excel(self, request, pk=None):
        excel_buffer = ExamExcelExporter.generate(str(pk))
        response = HttpResponse(
            excel_buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="exam_{pk}_report.xlsx"'
        return response

    @action(detail=True, methods=['get'])
    def export_pdf_summary(self, request, pk=None):
        pdf_buffer = ExamPdfExporter.generate_exam_summary(str(pk))
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="exam_{pk}_summary.pdf"'
        return response


class ExamQuestionViewSet(viewsets.ModelViewSet):
    serializer_class = ExamQuestionSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsTeacherOrReadOnly()]

    def get_queryset(self):
        exam_id = self.kwargs.get('exam_id')
        return ExamQuestion.objects.filter(exam_id=exam_id)

    def perform_create(self, serializer):
        exam_id = self.kwargs.get('exam_id')
        exam = get_object_or_404(OnlineExam, id=exam_id)
        serializer.save(exam=exam)

    @action(detail=False, methods=['post'])
    def reorder(self, request, exam_id=None):
        data = request.data
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
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['list', 'create']:
            return ExamSubmissionListSerializer
        return ExamSubmissionDetailSerializer

    def get_queryset(self):
        exam_id = self.kwargs.get('exam_id')
        qs = ExamSubmission.objects.filter(exam_id=exam_id)
        
        user = self.request.user
        exam = get_object_or_404(OnlineExam, id=exam_id)
        
        if exam.teacher == user:
            return qs
        else:
            return qs.filter(student=user)

    def perform_create(self, serializer):
        exam_id = self.kwargs.get('exam_id')
        exam = get_object_or_404(OnlineExam, id=exam_id)
        serializer.save(exam=exam, student=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, exam_id=None, pk=None):
        submission = self.get_object()
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
        pdf_buffer = ExamPdfExporter.generate_student_report(str(pk))
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="submission_{pk}_report.pdf"'
        return response


class ExamAnswerViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ExamAnswerSubmitSerializer
        return ExamAnswerSerializer

    def get_queryset(self):
        submission_id = self.kwargs.get('submission_id')
        return ExamAnswer.objects.filter(submission_id=submission_id)

    def perform_create(self, serializer):
        submission_id = self.kwargs.get('submission_id')
        submission = get_object_or_404(ExamSubmission, id=submission_id)
        serializer.save(submission=submission)


class ProctoringLogBatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, exam_id, submission_id):
        submission = get_object_or_404(ExamSubmission, id=submission_id, exam_id=exam_id)
        serializer = ProctoringLogBatchSerializer(data=request.data, many=True)
        if serializer.is_valid():
            logs = [
                ProctoringLog(submission=submission, **item)
                for item in serializer.validated_data
            ]
            ProctoringLog.objects.bulk_create(logs)
            return Response({'created': len(logs)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OnlineExamByCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, access_code):
        exam = get_object_or_404(OnlineExam, access_code=access_code)
        serializer = ExamStudentViewSerializer(exam, context={'request': request})
        return Response(serializer.data)
