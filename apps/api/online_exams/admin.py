from django.contrib import admin
from .models import OnlineExam, ExamQuestion, ExamSubmission, ExamAnswer, ProctoringLog

class ExamQuestionInline(admin.TabularInline):
    model = ExamQuestion
    extra = 1

@admin.register(OnlineExam)
class OnlineExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'status', 'duration_minutes', 'max_attempts', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'teacher__email')
    inlines = [ExamQuestionInline]

@admin.register(ExamSubmission)
class ExamSubmissionAdmin(admin.ModelAdmin):
    list_display = ('exam', 'student', 'status', 'total_score', 'percentage', 'integrity_score')
    list_filter = ('status',)
    raw_id_fields = ('exam', 'student')

@admin.register(ExamAnswer)
class ExamAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'exam_question', 'score_awarded', 'is_auto_graded')
    raw_id_fields = ('submission', 'exam_question', 'graded_by')

@admin.register(ProctoringLog)
class ProctoringLogAdmin(admin.ModelAdmin):
    list_display = ('submission', 'event_type', 'duration_seconds', 'timestamp')
    list_filter = ('event_type',)
