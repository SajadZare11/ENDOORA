from datetime import date, timedelta
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404, render
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html
from .editor import copy_edition, publish
from .metrics import weekly_metrics
from .models import Edition, Item, SupportTime

CONTENT = (
    "stage",
    "skill",
    "passage",
    "prompt",
    "option_a",
    "option_b",
    "option_c",
    "key",
    "evidence",
    "reason_a",
    "reason_b",
    "reason_c",
)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("code", "edition", "stage", "skill")
    list_filter = ("edition", "stage", "skill")
    search_fields = ("prompt", "code")

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.edition.state != "draft":
            return ("edition", "code", *CONTENT)
        return ("edition",) if obj else ()

    def formfield_for_foreignkey(self, field, request, **kwargs):
        if field.name == "edition":
            kwargs["queryset"] = Edition.objects.filter(state="draft")
        return super().formfield_for_foreignkey(field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if Edition.objects.select_for_update().get(pk=obj.edition_id).state != "draft":
            raise PermissionDenied("Clone the published edition first.")
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return bool(
            obj
            and obj.edition.state == "draft"
            and super().has_delete_permission(request, obj)
        )

    def delete_model(self, request, obj):
        if Edition.objects.select_for_update().get(pk=obj.edition_id).state != "draft":
            raise PermissionDenied
        super().delete_model(request, obj)


@admin.register(Edition)
class EditionAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "state",
        "reviewer",
        "published_at",
        "preview_link",
        "pilot_link",
    )
    readonly_fields = (
        "parent",
        "state",
        "reviewer",
        "published_at",
        "preview_link",
        "pilot_link",
    )
    actions = ("publish_selected", "clone_selected", "withdraw_selected")

    def get_urls(self):
        return [
            path(
                "pilot/", self.admin_site.admin_view(self.pilot), name="reading_pilot"
            ),
            path(
                "<int:pk>/preview/",
                self.admin_site.admin_view(self.preview),
                name="reading_preview",
            ),
        ] + super().get_urls()

    @admin.display(description="Review")
    def preview_link(self, obj):
        if not obj or not obj.pk:
            return ""
        return format_html(
            '<a href="{}">Preview, evidence and version comparison</a>',
            reverse("admin:reading_preview", args=[obj.pk]),
        )

    @admin.display(description="Pilot")
    def pilot_link(self, obj):
        return format_html(
            '<a href="{}">Weekly pilot measures</a>', reverse("admin:reading_pilot")
        )

    def preview(self, request, pk):
        if not self.has_view_permission(request):
            raise PermissionDenied
        edition = get_object_or_404(Edition, pk=pk)
        parent = (
            {q.code: q for q in edition.parent.items.all()} if edition.parent_id else {}
        )
        rows = []
        for item in edition.items.all():
            previous = parent.pop(item.code, None)
            changes = [
                (field, getattr(previous, field), getattr(item, field))
                for field in CONTENT
                if previous and getattr(previous, field) != getattr(item, field)
            ]
            rows.append((item, previous, changes))
        return render(
            request,
            "reading_path/edition_preview.html",
            {"edition": edition, "rows": rows, "removed": parent.values()},
        )

    def pilot(self, request):
        if not self.has_view_permission(request):
            raise PermissionDenied
        try:
            start = date.fromisoformat(request.GET.get("start", ""))
        except ValueError:
            start = timezone.localdate() - timedelta(days=6)
        return render(
            request,
            "reading_path/pilot.html",
            {"start": start, "metrics": weekly_metrics(start)},
        )

    def get_readonly_fields(self, request, obj=None):
        return (
            (*self.readonly_fields, "title")
            if obj and obj.state != "draft"
            else self.readonly_fields
        )

    def save_model(self, request, obj, form, change):
        if (
            change
            and Edition.objects.select_for_update().get(pk=obj.pk).state != "draft"
        ):
            raise PermissionDenied
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description="Publish one reviewed edition")
    def publish_selected(self, request, queryset):
        if queryset.count() != 1:
            return self.message_user(
                request, "Select exactly one edition.", messages.ERROR
            )
        try:
            publish(queryset.get(), request.user)
        except ValidationError as error:
            return self.message_user(request, " ".join(error.messages), messages.ERROR)
        self.message_user(request, "Edition published.")

    @admin.action(description="Clone as an editable revision")
    def clone_selected(self, request, queryset):
        for edition in queryset:
            self.message_user(request, f"Created draft #{copy_edition(edition).pk}.")

    @admin.action(description="Withdraw selected editions")
    def withdraw_selected(self, request, queryset):
        count = queryset.filter(state__in=["live", "superseded"]).update(
            state="withdrawn"
        )
        self.message_user(
            request, f"Withdrew {count} editions. Stored answers are preserved."
        )


@admin.register(SupportTime)
class SupportTimeAdmin(admin.ModelAdmin):
    list_display = ("day", "minutes", "note")
    date_hierarchy = "day"


from . import clinic_admin  # noqa: F401  Register the listening and reading revision studio.
