from django.contrib import admin
from teachers.models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    TeachingHourLedger,
    TeachingHourAuditLog,
    TeacherDataAccessAudit,
    Assignment,
    AssignmentQuestion,
    AssignmentAccommodation,
    AssignmentAttempt,
)


@admin.register(TeacherClass)
class TeacherClassAdmin(admin.ModelAdmin):
    list_display = ["title", "teacher", "subject", "level", "status", "max_capacity", "created_at"]
    list_filter = ["status", "level", "subject"]
    search_fields = ["title", "teacher__email", "subject"]


@admin.register(TeacherLearnerLink)
class TeacherLearnerLinkAdmin(admin.ModelAdmin):
    list_display = ["teacher_class", "teacher", "learner", "status", "invite_code", "consent_given_at", "created_at"]
    list_filter = ["status"]
    search_fields = ["teacher__email", "learner__email", "invite_code"]


@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ["title", "teacher_class", "learner", "scheduled_start", "duration_minutes", "status", "confirmed_by_teacher"]
    list_filter = ["status", "confirmed_by_teacher", "confirmed_by_learner"]
    search_fields = ["title", "teacher_class__title", "learner__email"]


class TeachingHourAuditLogInline(admin.TabularInline):
    model = TeachingHourAuditLog
    extra = 0
    readonly_fields = ["actor", "action", "previous_hours", "new_hours", "reason", "timestamp"]


@admin.register(TeachingHourLedger)
class TeachingHourLedgerAdmin(admin.ModelAdmin):
    list_display = ["teacher", "session", "hours", "status", "is_verified", "created_at"]
    list_filter = ["status", "is_verified"]
    search_fields = ["teacher__email", "session__title"]
    inlines = [TeachingHourAuditLogInline]


@admin.register(TeachingHourAuditLog)
class TeachingHourAuditLogAdmin(admin.ModelAdmin):
    list_display = ["ledger_entry", "actor", "action", "previous_hours", "new_hours", "timestamp"]
    list_filter = ["action"]
    search_fields = ["actor__email", "reason"]


@admin.register(TeacherDataAccessAudit)
class TeacherDataAccessAuditAdmin(admin.ModelAdmin):
    list_display = ["teacher", "learner", "access_type", "ip_address", "timestamp"]
    list_filter = ["access_type"]
    search_fields = ["teacher__email", "learner__email", "access_type"]


class AssignmentQuestionInline(admin.TabularInline):
    model = AssignmentQuestion
    extra = 0
    raw_id_fields = ["question_version"]


class AssignmentAccommodationInline(admin.TabularInline):
    model = AssignmentAccommodation
    extra = 0
    raw_id_fields = ["learner"]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ["title", "teacher_class", "teacher", "target_cefr", "status", "due_date", "time_limit_minutes", "total_points", "created_at"]
    list_filter = ["status", "target_cefr", "allow_late_submission"]
    search_fields = ["title", "teacher__email", "teacher_class__title"]
    inlines = [AssignmentQuestionInline, AssignmentAccommodationInline]


@admin.register(AssignmentQuestion)
class AssignmentQuestionAdmin(admin.ModelAdmin):
    list_display = ["assignment", "order", "question_version", "points", "created_at"]
    list_filter = ["assignment"]
    search_fields = ["assignment__title", "question_version__question__slug"]


@admin.register(AssignmentAccommodation)
class AssignmentAccommodationAdmin(admin.ModelAdmin):
    list_display = ["assignment", "learner", "extra_time_minutes", "extra_attempts", "extended_due_date", "created_at"]
    list_filter = ["assignment"]
    search_fields = ["assignment__title", "learner__email"]


@admin.register(AssignmentAttempt)
class AssignmentAttemptAdmin(admin.ModelAdmin):
    list_display = ["assignment", "learner", "attempt_number", "status", "score_awarded", "percentage", "is_late", "started_at", "submitted_at"]
    list_filter = ["status", "is_late"]
    search_fields = ["assignment__title", "learner__email"]
