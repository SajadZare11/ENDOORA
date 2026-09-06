from rest_framework import serializers
from support.models import (
    FAQCategory,
    FAQItem,
    SupportTicket,
    TicketMessage,
    TicketAttachment,
    TicketCategory,
    TicketStatus,
)


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = [
            "id",
            "category",
            "question",
            "answer",
            "order",
            "view_count",
            "helpful_count",
            "tags",
            "updated_at",
        ]


class FAQCategorySerializer(serializers.ModelSerializer):
    items = FAQItemSerializer(many=True, read_only=True)

    class Meta:
        model = FAQCategory
        fields = ["id", "title", "slug", "icon", "order", "items"]


class TicketAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketAttachment
        fields = ["id", "file_name", "file_url", "file_size", "content_type", "created_at"]


class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = TicketMessage
        fields = ["id", "sender_type", "sender_name", "body", "is_internal", "created_at"]

    def get_sender_name(self, obj):
        if obj.sender_type == "ai_agent":
            return "دستیار هوشمند اندورا"
        if obj.sender_type == "staff":
            return "کارشناس پشتیبانی"
        return getattr(obj.sender_user, "name", "شما") or "شما"


class SupportTicketListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "category",
            "category_display",
            "title",
            "status",
            "status_display",
            "escalated_to_human",
            "created_at",
            "updated_at",
        ]


class SupportTicketDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    cited_faq_detail = FAQItemSerializer(source="cited_faq", read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "category",
            "category_display",
            "title",
            "description",
            "status",
            "status_display",
            "escalated_to_human",
            "escalation_reason",
            "cited_faq",
            "cited_faq_detail",
            "ai_confidence_score",
            "messages",
            "attachments",
            "created_at",
            "updated_at",
        ]


class SupportTicketCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=TicketCategory.choices)
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    attachments = serializers.ListField(child=serializers.DictField(), required=False, default=list)
