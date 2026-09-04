from django.contrib import admin

from .models import PlacementAnswer, PlacementSession


@admin.register(PlacementSession)
class PlacementSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "current_section",
        "answers_count_display",
        "started_at",
        "expires_at",
        "updated_at",
    )
    list_filter = ("status", "current_section", "started_at")
    search_fields = ("user__email", "user__first_name", "user__last_name", "id")
    readonly_fields = ("id", "started_at", "updated_at")

    @admin.display(description="Answers Count")
    def answers_count_display(self, obj):
        return obj.answers_count

    def has_delete_permission(self, request, obj=None):
        # Do not allow deletion of submitted placement sessions unless superuser
        if obj and obj.status == PlacementSession.Status.SUBMITTED and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(PlacementAnswer)
class PlacementAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "session_user",
        "session",
        "question_key",
        "question_version",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at")
    search_fields = ("session__user__email", "session__id", "question_key")
    readonly_fields = ("idempotency_key", "created_at", "updated_at")

    @admin.display(description="Learner")
    def session_user(self, obj):
        return obj.session.user.email

    def has_delete_permission(self, request, obj=None):
        # Safeguard submitted answers from deletion
        if obj and obj.session.status == PlacementSession.Status.SUBMITTED and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)
