from django.contrib import admin
from support.models import FAQCategory, FAQItem, SupportTicket, TicketMessage, TicketAttachment


class FAQItemInline(admin.StackedInline):
    model = FAQItem
    extra = 1


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "order", "created_at"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [FAQItemInline]


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ["question", "category", "is_published", "order", "helpful_count", "updated_at"]
    list_filter = ["is_published", "category"]
    search_fields = ["question", "normalized_question", "answer"]


class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    readonly_fields = ["sender_type", "sender_user", "body", "is_internal", "created_at"]


class TicketAttachmentInline(admin.TabularInline):
    model = TicketAttachment
    extra = 0
    readonly_fields = ["file_name", "file_url", "file_size", "content_type", "created_at"]


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "category", "status", "escalated_to_human", "created_at", "updated_at"]
    list_filter = ["status", "category", "escalated_to_human"]
    search_fields = ["title", "description", "user__email"]
    inlines = [TicketMessageInline, TicketAttachmentInline]
