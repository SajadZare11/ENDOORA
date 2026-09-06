from __future__ import annotations

from rest_framework import serializers
from .models import (
    CommunityPost,
    PostComment,
    PostReaction,
    UserBlock,
    PostType,
    PostAudience,
    LicenseType,
)


class PostCommentSerializer(serializers.ModelSerializer):
    author_avatar = serializers.SerializerMethodField()

    class Meta:
        model = PostComment
        fields = [
            'id',
            'post',
            'parent',
            'author',
            'author_name',
            'author_avatar',
            'content',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'author', 'author_name', 'status', 'created_at', 'updated_at']

    def get_author_avatar(self, obj) -> str:
        return f"/avatars/{obj.author_id}.svg"


class CommunityPostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    is_user_reacted = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            'id',
            'author',
            'author_name',
            'author_role',
            'is_verified_teacher',
            'post_type',
            'audience',
            'status',
            'title_fa',
            'title_en',
            'content_fa',
            'content_en',
            'tags',
            'media_attachments',
            'lesson_plan_metadata',
            'is_monthly_featured',
            'featured_at',
            'editorial_review_notes',
            'view_count',
            'reactions_count',
            'comments_count',
            'is_suitable_for_minors',
            'is_pinned',
            'created_at',
            'updated_at',
            'comments',
            'is_user_reacted',
        ]
        read_only_fields = [
            'id',
            'author',
            'author_name',
            'author_role',
            'is_verified_teacher',
            'is_monthly_featured',
            'featured_at',
            'editorial_review_notes',
            'view_count',
            'reactions_count',
            'comments_count',
            'created_at',
            'updated_at',
        ]

    def get_comments(self, obj) -> list:
        # Return recent top-level comments
        top_level = obj.comments.filter(parent__isnull=True, status='published')[:5]
        return PostCommentSerializer(top_level, many=True).data

    def get_is_user_reacted(self, obj) -> bool:
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.reactions.filter(user=request.user).exists()


class CommunityPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = [
            'post_type',
            'audience',
            'title_fa',
            'title_en',
            'content_fa',
            'content_en',
            'tags',
            'media_attachments',
            'lesson_plan_metadata',
            'is_suitable_for_minors',
        ]


class UserBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBlock
        fields = ['id', 'blocker', 'blocked_user', 'reason', 'is_mute_only', 'created_at']
        read_only_fields = ['id', 'blocker', 'created_at']
