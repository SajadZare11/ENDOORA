from django.contrib import admin
from teachers.models import (
    TeacherClass,
    TeacherLearnerLink,
    ClassSession,
    TeachingHourLedger,
    TeachingHourAuditLog,
    TeacherDataAccessAudit,
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
