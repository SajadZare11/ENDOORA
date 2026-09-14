from django.contrib import admin
from ielts.models import (
    IELTSTest,
    IELTSSection,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSBandDescriptor,
)


class IELTSSectionInline(admin.TabularInline):
    model = IELTSSection
    extra = 0
    show_change_link = True


class IELTSPassageTaskInline(admin.TabularInline):
    model = IELTSPassageTask
    extra = 0
    show_change_link = True


class IELTSQuestionInline(admin.TabularInline):
    model = IELTSQuestion
    extra = 0


@admin.register(IELTSTest)
class IELTSTestAdmin(admin.ModelAdmin):
    list_display = [
        "title_en",
        "test_type",
        "version",
        "status",
        "author",
        "reviewed_by",
        "is_locked",
        "created_at",
    ]
    list_filter = ["test_type", "status", "is_locked"]
    search_fields = ["title_en", "title_fa", "copyright_source"]
    readonly_fields = ["id", "created_at", "updated_at"]
    inlines = [IELTSSectionInline]


@admin.register(IELTSSection)
class IELTSSectionAdmin(admin.ModelAdmin):
    list_display = ["test", "section_type", "order", "duration_minutes"]
    list_filter = ["section_type"]
    inlines = [IELTSPassageTaskInline]


@admin.register(IELTSPassageTask)
class IELTSPassageTaskAdmin(admin.ModelAdmin):
    list_display = ["title", "section", "order", "word_count"]
    search_fields = ["title", "content_text"]


@admin.register(IELTSQuestionGroup)
class IELTSQuestionGroupAdmin(admin.ModelAdmin):
    list_display = ["passage_task", "question_type", "order"]
    list_filter = ["question_type"]
    inlines = [IELTSQuestionInline]


@admin.register(IELTSQuestion)
class IELTSQuestionAdmin(admin.ModelAdmin):
    list_display = ["question_number", "group", "prompt_text", "max_score"]
    search_fields = ["prompt_text", "explanation"]


@admin.register(IELTSBandDescriptor)
class IELTSBandDescriptorAdmin(admin.ModelAdmin):
    list_display = ["criteria_key", "section_type", "band_level"]
    list_filter = ["section_type", "criteria_key", "band_level"]
    search_fields = ["public_descriptor_en", "pedagogical_guidance_fa"]
