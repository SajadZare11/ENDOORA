from django.contrib import admin
from ielts.models import (
    IELTSTest,
    IELTSSection,
    IELTSPassageTask,
    IELTSQuestionGroup,
    IELTSQuestion,
    IELTSBandDescriptor,
    IELTSTestSession,
    IELTSWritingSubmission,
    IELTSSpeakingSubmission,
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


@admin.register(IELTSTestSession)
class IELTSTestSessionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "learner",
        "test",
        "mode",
        "status",
        "raw_score",
        "scaled_band_score",
        "started_at",
        "completed_at",
    ]
    list_filter = ["mode", "status", "test__test_type"]
    search_fields = ["learner__email", "test__title_en", "test__title_fa"]
    readonly_fields = ["id", "started_at", "completed_at", "created_at", "updated_at"]


@admin.register(IELTSWritingSubmission)
class IELTSWritingSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "learner",
        "status",
        "overall_band",
        "overall_band_min",
        "overall_band_max",
        "cefr_level",
        "task1_word_count",
        "task2_word_count",
        "teacher_review_requested",
        "created_at",
    ]
    list_filter = ["status", "cefr_level", "teacher_review_requested"]
    search_fields = ["learner__email", "task1_prompt_title", "task2_prompt_title"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(IELTSSpeakingSubmission)
class IELTSSpeakingSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "learner",
        "status",
        "overall_band",
        "overall_band_min",
        "overall_band_max",
        "fc_score",
        "lr_score",
        "gra_score",
        "pr_score",
        "cefr_level",
        "teacher_review_requested",
        "created_at",
    ]
    list_filter = ["status", "cefr_level", "teacher_review_requested"]
    search_fields = ["learner__email", "part1_prompt_title", "part2_cue_card_title", "part3_prompt_title"]
    readonly_fields = ["id", "created_at", "updated_at"]



