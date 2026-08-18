from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import EndooraUserChangeForm, EndooraUserCreationForm
from .models import AccountDeletionRequest, ConsentRecord, OneTimeCode, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = EndooraUserCreationForm
    form = EndooraUserChangeForm
    model = User

    ordering = ("email",)
    list_display = (
        "email",
        "role",
        "preferred_locale",
        "is_active",
        "is_teacher_verified",
        "is_staff",
    )
    list_filter = (
        "role",
        "preferred_locale",
        "is_active",
        "is_teacher_verified",
        "is_staff",
        "is_superuser",
    )
    search_fields = ("email", "phone", "first_name", "last_name")
    readonly_fields = ("phone_verified_at", "deactivated_at", "last_login", "date_joined")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Identity",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone",
                    "phone_verified_at",
                    "preferred_locale",
                )
            },
        ),
        (
            "Role and capabilities",
            {
                "fields": (
                    "role",
                    "is_teacher_verified",
                    "marketplace_eligible",
                    "paid_class_eligible",
                )
            },
        ),
        (
            "Django permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Dates", {"fields": ("last_login", "date_joined", "deactivated_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "phone",
                    "role",
                    "preferred_locale",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


@admin.register(ConsentRecord)
class ConsentRecordAdmin(admin.ModelAdmin):
    list_display = ("user", "consent_type", "version", "locale", "accepted_at")
    list_filter = ("consent_type", "locale", "version")
    search_fields = ("user__email", "version")
    readonly_fields = ("user", "consent_type", "version", "locale", "source", "accepted_at")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(OneTimeCode)
class OneTimeCodeAdmin(admin.ModelAdmin):
    list_display = ("identifier", "purpose", "created_at", "expires_at", "consumed_at", "attempts")
    list_filter = ("purpose",)
    search_fields = ("identifier",)
    readonly_fields = (
        "identifier",
        "purpose",
        "code_hash",
        "requested_by",
        "expires_at",
        "consumed_at",
        "attempts",
        "max_attempts",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(AccountDeletionRequest)
class AccountDeletionRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "status", "requested_at", "scheduled_for")
    list_filter = ("status",)
    search_fields = ("user__email",)
    readonly_fields = ("user", "requested_at", "scheduled_for")
