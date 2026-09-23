from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OnlineExamViewSet, ExamQuestionViewSet, ExamSubmissionViewSet, ExamAnswerViewSet,
    ProctoringLogBatchView, OnlineExamByCodeView
)

router = DefaultRouter()
router.register(r'', OnlineExamViewSet, basename='online-exam')

exam_question_list = ExamQuestionViewSet.as_view({'get': 'list', 'post': 'create'})
exam_question_detail = ExamQuestionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})
exam_question_reorder = ExamQuestionViewSet.as_view({'post': 'reorder'})

exam_submission_list = ExamSubmissionViewSet.as_view({'get': 'list', 'post': 'create'})
exam_submission_detail = ExamSubmissionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})
exam_submission_submit = ExamSubmissionViewSet.as_view({'post': 'submit'})
exam_submission_export = ExamSubmissionViewSet.as_view({'get': 'export_pdf'})

exam_answer_list = ExamAnswerViewSet.as_view({'get': 'list', 'post': 'create'})
exam_answer_detail = ExamAnswerViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'})


urlpatterns = [
    path('by-code/<str:access_code>/', OnlineExamByCodeView.as_view(), name='online-exam-by-code'),
    
    path('<uuid:exam_id>/questions/', exam_question_list, name='exam-question-list'),
    path('<uuid:exam_id>/questions/reorder/', exam_question_reorder, name='exam-question-reorder'),
    path('<uuid:exam_id>/questions/<uuid:pk>/', exam_question_detail, name='exam-question-detail'),
    
    path('<uuid:exam_id>/submissions/', exam_submission_list, name='exam-submission-list'),
    path('<uuid:exam_id>/submissions/<uuid:pk>/', exam_submission_detail, name='exam-submission-detail'),
    path('<uuid:exam_id>/submissions/<uuid:pk>/submit/', exam_submission_submit, name='exam-submission-submit'),
    path('<uuid:exam_id>/submissions/<uuid:pk>/export_pdf/', exam_submission_export, name='exam-submission-export'),
    
    path('<uuid:exam_id>/submissions/<uuid:submission_id>/answers/', exam_answer_list, name='exam-answer-list'),
    path('<uuid:exam_id>/submissions/<uuid:submission_id>/answers/<uuid:pk>/', exam_answer_detail, name='exam-answer-detail'),
    
    path('<uuid:exam_id>/submissions/<uuid:submission_id>/proctoring-logs/', ProctoringLogBatchView.as_view(), name='proctoring-log-batch'),

    path('', include(router.urls)),
]
