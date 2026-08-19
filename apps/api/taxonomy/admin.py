from django.contrib import admin
from django.db.models import Count, Q

from .models import (
    TaxonomyNode,
    TaxonomyNodeRevision,
    TaxonomyPrerequisite,
    TaxonomyRelease,
)


@admin.register(TaxonomyNode)
class TaxonomyNodeAdmin(admin.ModelAdmin):
    list_display = (
        "label_fa",
        "label_en",
        "slug",
        "kind",
        "cefr_level",
        "status",
        "reference_count",
        "current_release",
    )
    list_filter = ("kind", "cefr_level", "status", "current_release")
    search_fields = ("slug", "label_fa", "label_en", "descriptor_reference")
    autocomplete_fields = ("parent", "replacement")
    ordering = ("kind", "sort_order", "slug")
    list_select_related = ("parent", "replacement", "current_release")
    save_on_top = True

    fieldsets = (
        (
            "Stable identity",
            {
                "fields": (
                    "id",
                    "slug",
                    "kind",
                    "status",
                    "replacement",
                    "current_release",
                )
            },
        ),
        (
            "Persian-first labels",
            {
                "fields": (
                    "label_fa",
                    "description_fa",
                    "label_en",
                    "description_en",
                )
            },
        ),
        (
            "Learning structure",
            {
                "fields": (
                    "parent",
                    "cefr_level",
                    "estimated_effort_minutes",
                    "sort_order",
                )
            },
        ),
        (
            "Descriptor/source governance",
            {
                "fields": (
                    "descriptor_reference",
                    "source_name",
                    "source_url",
                    "license_note",
                    "metadata",
                )
            },
        ),
        (
            "History",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(
                _active_dependency_count=Count(
                    "dependent_links",
                    filter=Q(dependent_links__retired_in__isnull=True),
                    distinct=True,
                ),
                _child_count=Count("children", distinct=True),
            )
        )

    @admin.display(description="References")
    def reference_count(self, obj: TaxonomyNode) -> int:
        return int(obj._active_dependency_count) + int(obj._child_count)

    def get_readonly_fields(self, request, obj=None):
        readonly = ["id", "current_release", "created_at", "updated_at"]
        if obj is not None:
            readonly.append("slug")
        return tuple(readonly)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TaxonomyRelease)
class TaxonomyReleaseAdmin(admin.ModelAdmin):
    list_display = ("version", "checksum", "source_path", "imported_at")
    search_fields = ("version", "checksum", "source_path")
    ordering = ("-imported_at",)
    readonly_fields = ("id", "version", "checksum", "source_path", "notes", "imported_at")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TaxonomyNodeRevision)
class TaxonomyNodeRevisionAdmin(admin.ModelAdmin):
    list_display = ("node", "release", "checksum", "created_at")
    search_fields = ("node__slug", "node__label_fa", "node__label_en", "checksum")
    list_filter = ("release", "created_at")
    readonly_fields = ("id", "node", "release", "checksum", "snapshot", "created_at")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TaxonomyPrerequisite)
class TaxonomyPrerequisiteAdmin(admin.ModelAdmin):
    list_display = ("node", "prerequisite", "introduced_in", "retired_in")
    search_fields = (
        "node__slug",
        "node__label_fa",
        "node__label_en",
        "prerequisite__slug",
        "prerequisite__label_fa",
        "prerequisite__label_en",
    )
    list_filter = ("introduced_in", "retired_in")
    readonly_fields = (
        "node",
        "prerequisite",
        "introduced_in",
        "retired_in",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
