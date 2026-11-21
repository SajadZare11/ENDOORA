from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404, render
from django.urls import path, reverse
from django.utils.html import format_html
from .clinic import build_unit, comparison, release_clinic
from .models import ClinicRevision, ClinicQuestion


class QuestionInline(admin.StackedInline):
    model = ClinicQuestion
    extra = 0

    def has_add_permission(self, request, obj=None):
        return not (obj and obj.published) and super().has_add_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return not (obj and obj.published) and super().has_delete_permission(
            request, obj
        )

    def has_change_permission(self, request, obj=None):
        return not (obj and obj.published) and super().has_change_permission(
            request, obj
        )


@admin.register(ClinicRevision)
class ClinicAdmin(admin.ModelAdmin):
    list_display = ("slug", "title", "published", "preview_link")
    readonly_fields = ("published", "preview_link")
    actions = ("publish_action", "clone_action")
    inlines = (QuestionInline,)

    def preview_link(self, obj):
        return (
            format_html(
                '<a href="{}">Preview, listen and compare</a>',
                reverse("admin:clinic_preview", args=[obj.pk]),
            )
            if obj and obj.pk
            else ""
        )

    def get_urls(self):
        return [
            path(
                "<int:pk>/preview/",
                self.admin_site.admin_view(self.preview),
                name="clinic_preview",
            )
        ] + super().get_urls()

    def preview(self, request, pk):
        if not self.has_view_permission(request):
            raise PermissionDenied
        draft = get_object_or_404(ClinicRevision, pk=pk)
        try:
            old, unit = build_unit(draft, strict=False)
            context = {"unit": unit, "diff": comparison(old, unit)}
        except ValidationError as err:
            context = {"problem": " ".join(err.messages)}
        return render(request, "reading_path/clinic_preview.html", context)

    def get_readonly_fields(self, request, obj=None):
        return (
            (
                *self.readonly_fields,
                "slug",
                "source_slug",
                "title",
                "instruction",
                "material",
                "duration_ms",
            )
            if obj and obj.published
            else self.readonly_fields
        )

    def save_model(self, request, obj, form, change):
        if (
            change
            and ClinicRevision.objects.select_for_update().get(pk=obj.pk).published
        ):
            raise PermissionDenied
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description="Publish reviewed revision")
    def publish_action(self, request, queryset):
        for draft in queryset:
            try:
                release_clinic(draft, request.user)
            except ValidationError as err:
                self.message_user(request, " ".join(err.messages), messages.ERROR)
            else:
                self.message_user(
                    request,
                    f"Published {draft.slug}. Withdraw the earlier version when ready.",
                )

    @admin.action(description="Clone version to edit")
    @transaction.atomic
    def clone_action(self, request, queryset):
        from uuid import uuid4

        for old in queryset.select_for_update():
            rows = list(old.questions.order_by("pk"))
            source = old.slug if old.published else old.source_slug
            old.pk = None
            old.published = False
            old.source_slug = source
            old.slug = source[:35] + "-" + uuid4().hex[:8]
            old.save()
            for row in rows:
                row.pk = None
                row.draft = old
            ClinicQuestion.objects.bulk_create(rows)
            self.message_user(request, f"Created editable draft {old.slug}.")
