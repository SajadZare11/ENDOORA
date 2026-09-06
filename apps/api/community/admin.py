from __future__ import annotations

from django.contrib import admin
from .models import CommunityPost, PostComment, PostReaction, UserBlock


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ('title_fa', 'post_type', 'author_name', 'status', 'is_verified_teacher', 'is_monthly_featured', 'created_at')
    list_filter = ('post_type', 'status', 'is_verified_teacher', 'is_monthly_featured', 'audience')
    search_fields = ('title_fa', 'title_en', 'content_fa', 'author_name')
    readonly_fields = ('created_at', 'updated_at', 'view_count', 'reactions_count', 'comments_count')


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'post', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('content', 'author_name')


@admin.register(PostReaction)
class PostReactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'reaction_type', 'created_at')
    list_filter = ('reaction_type',)


@admin.register(UserBlock)
class UserBlockAdmin(admin.ModelAdmin):
    list_display = ('blocker', 'blocked_user', 'is_mute_only', 'created_at')
    search_fields = ('blocker__username', 'blocked_user__username', 'reason')
