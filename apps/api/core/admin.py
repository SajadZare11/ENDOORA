from django.contrib import admin
from django.contrib.admin.sites import AdminSite

from audit.models import AuditEvent
from .models import FeatureFlag, SystemSetting


admin.site.site_header = "Endoora Operations"
admin.site.site_title = "Endoora Operations"
admin.site.index_title = "کنسول عملیات Endoora"
admin.site.index_template = "admin/endoora_index.html"


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = (
        "key",
        "value_type",
        "environment_scope",
        "owner",
        "updated_at",
    )
    list_filter = ("value_type", "environment_scope")
    search_fields = ("key", "description", "owner", "rationale")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "updated_at"

    def get_readonly_fields(self, request, obj=None):
        fields = list(super().get_readonly_fields(request, obj))
        if obj is not None:
            fields.append("key")
        return tuple(fields)

    fieldsets = (
        (
            "Setting",
            {
                "fields": (
                    "key",
                    "value_type",
                    "value",
                    "environment_scope",
                    "description",
                )
            },
        ),
        (
            "Operational ownership",
            {"fields": ("owner", "rationale")},
        ),
        (
            "Record",
            {"fields": ("created_at", "updated_at")},
        ),
    )


@admin.register(FeatureFlag)
class FeatureFlagAdmin(admin.ModelAdmin):
    list_display = (
        "key",
        "enabled",
        "rollout_percentage",
        "owner",
        "kill_switch_behavior",
        "updated_at",
    )
    list_filter = ("enabled", "kill_switch_behavior")
    search_fields = ("key", "owner", "rationale")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "updated_at"

    def get_readonly_fields(self, request, obj=None):
        fields = list(super().get_readonly_fields(request, obj))
        if obj is not None:
            fields.append("key")
        return tuple(fields)


def _endoora_summary(request):
    role = getattr(request.user, "role", "")
    if request.user.is_superuser or role == "administrator":
        from django.contrib.auth import get_user_model

        User = get_user_model()
        return {
            "scope": "administrator",
            "users": User.objects.count(),
            "settings": SystemSetting.objects.count(),
            "enabled_flags": FeatureFlag.objects.filter(enabled=True).count(),
            "audit_events": AuditEvent.objects.count(),
        }

    return {
        "scope": "limited",
        "users": None,
        "settings": None,
        "enabled_flags": None,
        "audit_events": None,
    }


def endoora_index(self, request, extra_context=None):
    context = dict(extra_context or {})
    context["endoora_summary"] = _endoora_summary(request)
    return AdminSite.index(self, request, extra_context=context)


# The default AdminSite is a singleton. Assign a bound method without creating
# a second admin site, so all existing registrations continue to work.
import types

admin.site.index = types.MethodType(endoora_index, admin.site)
