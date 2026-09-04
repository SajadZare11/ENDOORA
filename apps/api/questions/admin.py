from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import Question, QuestionMedia, QuestionObjective, QuestionReview, QuestionVersion


class ProtectedVersionInlineMixin:
    def _locked(self, obj) -> bool:
        return bool(
            obj
            and obj.status
            in {QuestionVersion.Status.PUBLISHED, QuestionVersion.Status.RETIRED}
        )

    def has_add_permission(self, request, obj=None):
        if self._locked(obj):
            return False
        return super().has_add_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if self._locked(obj):
            return False
        return super().has_delete_permission(request, obj)


class QuestionObjectiveInline(ProtectedVersionInlineMixin, admin.TabularInline):
    model = QuestionObjective
    extra = 0
    autocomplete_fields = ("objective",)

    def get_readonly_fields(self, request, obj=None):
        if self._locked(obj):
            return ("objective", "is_primary", "created_at")
        return ("created_at",)


class QuestionMediaInline(ProtectedVersionInlineMixin, admin.StackedInline):
    model = QuestionMedia
    extra = 0

    def get_readonly_fields(self, request, obj=None):
        if self._locked(obj):
            return tuple(
                field.name
                for field in self.model._meta.fields
                if field.name not in {"id", "version"}
            )
        return ("created_at",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("slug", "current_published_version", "created_by", "updated_at")
    search_fields = ("slug",)
    readonly_fields = ("id", "current_published_version", "created_at", "updated_at")
    autocomplete_fields = ("created_by",)


@admin.register(QuestionVersion)
class QuestionVersionAdmin(admin.ModelAdmin):
    list_display = (
        "question", "version_number", "question_type", "cefr_level",
        "difficulty", "status", "reviewer", "published_at",
    )
    list_filter = ("status", "question_type", "cefr_level", "difficulty", "license_type")
    search_fields = ("question__slug", "title_fa", "title_en", "prompt_en", "source_title")
    autocomplete_fields = ("question", "author", "reviewer")
    inlines = (QuestionObjectiveInline, QuestionMediaInline)
    actions = ("submit_selected_for_review", "publish_selected_versions", "retire_selected_versions")
    readonly_fields = (
        "id", "status", "reviewed_at", "published_at", "retired_at",
        "content_hash", "created_at", "updated_at",
    )

    def get_readonly_fields(self, request, obj=None):
        base = list(super().get_readonly_fields(request, obj))
        if obj and obj.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return tuple(
                dict.fromkeys(
                    base + [field.name for field in obj._meta.fields if field.name != "id"]
                )
            )
        return tuple(base)

    @admin.action(description="Submit selected drafts for review")
    def submit_selected_for_review(self, request, queryset):
        submitted = 0
        for version in queryset:
            if version.status != QuestionVersion.Status.DRAFT:
                self.message_user(
                    request,
                    f"{version}: only draft versions can enter review.",
                    level=messages.WARNING,
                )
                continue
            version.status = QuestionVersion.Status.IN_REVIEW
            version.save(update_fields=["status", "updated_at"])
            QuestionReview.objects.create(
                version=version,
                reviewer=request.user,
                decision=QuestionReview.Decision.SUBMITTED,
                note="Submitted for review from Endoora Operations.",
            )
            submitted += 1
        if submitted:
            self.message_user(request, f"Submitted {submitted} version(s) for review.")

    @admin.action(description="Publish selected versions")
    def publish_selected_versions(self, request, queryset):
        published = 0
        for version in queryset:
            try:
                version.publish(request.user)
            except ValidationError as exc:
                self.message_user(request, f"{version}: {exc}", level=messages.ERROR)
            else:
                published += 1
        if published:
            self.message_user(request, f"Published {published} question version(s).")

    @admin.action(description="Retire selected published versions")
    def retire_selected_versions(self, request, queryset):
        retired = 0
        for version in queryset:
            try:
                version.retire(request.user, note="Retired from Endoora Operations.")
            except ValidationError as exc:
                self.message_user(request, f"{version}: {exc}", level=messages.ERROR)
            else:
                retired += 1
        if retired:
            self.message_user(request, f"Retired {retired} question version(s).")

    def has_delete_permission(self, request, obj=None):
        if obj and obj.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(QuestionReview)
class QuestionReviewAdmin(admin.ModelAdmin):
    list_display = ("version", "decision", "reviewer", "created_at")
    list_filter = ("decision", "created_at")
    search_fields = ("version__question__slug", "reviewer__email", "note")
    readonly_fields = ("id", "version", "reviewer", "decision", "note", "created_at")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(QuestionObjective)
class QuestionObjectiveAdmin(admin.ModelAdmin):
    list_display = ("version", "objective", "is_primary")
    list_filter = ("is_primary",)
    search_fields = ("version__question__slug", "objective__slug")
    autocomplete_fields = ("version", "objective")

    def has_delete_permission(self, request, obj=None):
        if obj and obj.version.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return False
        return super().has_delete_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        if obj and obj.version.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return False
        return super().has_change_permission(request, obj)


@admin.register(QuestionMedia)
class QuestionMediaAdmin(admin.ModelAdmin):
    list_display = ("version", "media_type", "mime_type", "is_learner_visible")
    list_filter = ("media_type", "is_learner_visible", "license_type")
    search_fields = ("version__question__slug", "asset_url", "storage_key", "source_title")
    autocomplete_fields = ("version",)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.version.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return False
        return super().has_delete_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        if obj and obj.version.status in {
            QuestionVersion.Status.PUBLISHED,
            QuestionVersion.Status.RETIRED,
        }:
            return False
        return super().has_change_permission(request, obj)
