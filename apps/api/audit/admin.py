from django.contrib import admin

from .models import AuditEvent


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = (
        "occurred_at",
        "action",
        "target",
        "actor_reference",
        "environment",
        "request_method",
    )
    list_filter = ("action", "environment", "target_app", "target_model")
    search_fields = ("target_pk", "reason", "request_path")
    date_hierarchy = "occurred_at"
    ordering = ("-occurred_at",)

    readonly_fields = (
        "id",
        "actor",
        "action",
        "target_app",
        "target_model",
        "target_pk",
        "before_summary",
        "after_summary",
        "reason",
        "request_method",
        "request_path",
        "environment",
        "occurred_at",
    )

    def target(self, obj):
        return f"{obj.target_app}.{obj.target_model} #{obj.target_pk}"

    target.short_description = "Target"

    def actor_reference(self, obj):
        return str(obj.actor_id) if obj.actor_id else "system/removed-user"

    actor_reference.short_description = "Actor ID"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
