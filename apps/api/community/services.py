from __future__ import annotations

import logging
from typing import Optional, List, Dict, Any
from django.conf import settings
from django.core.exceptions import PermissionDenied, ValidationError
from django.db.models import Q, F
from django.utils import timezone

from .models import (
    CommunityPost,
    PostComment,
    PostReaction,
    UserBlock,
    PostType,
    PostStatus,
    PostAudience,
)

logger = logging.getLogger(__name__)


class CommunityService:
    @staticmethod
    def are_comments_enabled() -> bool:
        return getattr(settings, 'COMMUNITY_COMMENTS_ENABLED', True)

    @staticmethod
    def list_posts(
        user: Optional[Any] = None,
        post_type: Optional[str] = None,
        audience: Optional[str] = None,
        tag: Optional[str] = None,
        query: Optional[str] = None,
        featured_only: bool = False,
    ):
        """
        Lists community posts.
        Automatically excludes posts from blocked users if user is authenticated.
        Excludes removed or draft posts unless user is staff.
        """
        qs = CommunityPost.objects.select_related('author', 'featured_by').all()

        # Visibility filter
        if user and user.is_authenticated and user.is_staff:
            # Staff can see all except hard removed if requested
            qs = qs.exclude(status=PostStatus.REMOVED)
        elif user and user.is_authenticated:
            qs = qs.filter(
                Q(status=PostStatus.PUBLISHED) | Q(author=user)
            )
        else:
            qs = qs.filter(status=PostStatus.PUBLISHED)

        # Block filter: hide posts written by blocked users or users who blocked this user
        if user and user.is_authenticated:
            blocked_user_ids = set(
                UserBlock.objects.filter(blocker=user).values_list('blocked_user_id', flat=True)
            )
            blocked_by_ids = set(
                UserBlock.objects.filter(blocked_user=user, is_mute_only=False).values_list('blocker_id', flat=True)
            )
            all_hidden_ids = blocked_user_ids | blocked_by_ids
            if all_hidden_ids:
                qs = qs.exclude(author_id__in=all_hidden_ids)

        if post_type and post_type != 'all':
            qs = qs.filter(post_type=post_type)

        if audience and audience != 'all':
            qs = qs.filter(Q(audience=audience) | Q(audience=PostAudience.ALL))

        if featured_only:
            qs = qs.filter(is_monthly_featured=True)

        if tag:
            qs = qs.filter(tags__contains=[tag])

        if query and query.strip():
            clean_q = query.strip()
            qs = qs.filter(
                Q(title_fa__icontains=clean_q) |
                Q(title_en__icontains=clean_q) |
                Q(content_fa__icontains=clean_q) |
                Q(content_en__icontains=clean_q) |
                Q(author_name__icontains=clean_q)
            )

        return qs.order_by('-is_pinned', '-created_at')

    @staticmethod
    def get_post_detail(post_id: str, user: Optional[Any] = None) -> CommunityPost:
        """Retrieve post detail with blocking and status permissions check."""
        try:
            post = CommunityPost.objects.select_related('author', 'featured_by').get(id=post_id)
        except CommunityPost.DoesNotExist:
            raise ValidationError({'post_id': 'پست مورد نظر یافت نشد.'})

        # Check blocking
        if user and user.is_authenticated:
            is_blocked = UserBlock.objects.filter(
                Q(blocker=user, blocked_user=post.author) |
                Q(blocker=post.author, blocked_user=user, is_mute_only=False)
            ).exists()
            if is_blocked:
                raise PermissionDenied('به دلیل مسدودیت کاربر، امکان مشاهده این محتوا وجود ندارد.')

        # Check status
        if post.status != PostStatus.PUBLISHED:
            is_author = user and user.is_authenticated and post.author_id == user.id
            is_staff = user and user.is_authenticated and user.is_staff
            if not is_author and not is_staff:
                raise PermissionDenied('این پست در دسترس عموم نیست.')

        # Increment view count
        CommunityPost.objects.filter(id=post.id).update(view_count=F('view_count') + 1)
        post.refresh_from_db(fields=['view_count'])
        return post

    @staticmethod
    def create_post(user: Any, data: Dict[str, Any]) -> CommunityPost:
        """Create a community post with safety and verification checks."""
        if not user or not user.is_authenticated:
            raise PermissionDenied('برای ارسال پست باید وارد حساب کاربری خود شوید.')

        author_name = user.get_full_name() or getattr(user, 'username', 'کاربر اندورا')
        author_role = getattr(user, 'role', 'learner')

        # Check verified teacher status
        is_verified_teacher = False
        if hasattr(user, 'teacher_profile'):
            is_verified_teacher = getattr(user.teacher_profile, 'is_verified', False)
        elif author_role == 'teacher' or user.is_staff:
            is_verified_teacher = True

        post = CommunityPost(
            author=user,
            author_name=author_name,
            author_role=author_role,
            is_verified_teacher=is_verified_teacher,
            post_type=data.get('post_type', PostType.LEARNER_POST),
            audience=data.get('audience', PostAudience.ALL),
            title_fa=data.get('title_fa', '').strip(),
            title_en=data.get('title_en', '').strip(),
            content_fa=data.get('content_fa', '').strip(),
            content_en=data.get('content_en', '').strip(),
            tags=data.get('tags', []),
            media_attachments=data.get('media_attachments', []),
            lesson_plan_metadata=data.get('lesson_plan_metadata', {}),
            is_suitable_for_minors=data.get('is_suitable_for_minors', True),
        )
        post.full_clean()
        post.save()
        return post

    @staticmethod
    def toggle_reaction(post_id: str, user: Any, reaction_type: str = 'like') -> Dict[str, Any]:
        """Toggles a reaction on a post. Updates counter atomically."""
        if not user or not user.is_authenticated:
            raise PermissionDenied('برای ثبت واکنش باید وارد حساب شوید.')

        post = CommunityPost.objects.get(id=post_id)
        existing = PostReaction.objects.filter(post=post, user=user, reaction_type=reaction_type).first()

        if existing:
            existing.delete()
            action = 'removed'
        else:
            PostReaction.objects.create(post=post, user=user, reaction_type=reaction_type)
            action = 'added'

        new_count = PostReaction.objects.filter(post=post).count()
        CommunityPost.objects.filter(id=post.id).update(reactions_count=new_count)

        return {
            'action': action,
            'reaction_type': reaction_type,
            'reactions_count': new_count
        }

    @staticmethod
    def add_comment(post_id: str, user: Any, content: str, parent_id: Optional[str] = None) -> PostComment:
        """Adds a comment to a post, respecting the comments feature flag and PII scanner."""
        if not CommunityService.are_comments_enabled():
            raise PermissionDenied('امکان ارسال نظر در حال حاضر توسط سامانه غیرفعال شده است.')

        if not user or not user.is_authenticated:
            raise PermissionDenied('برای ثبت نظر باید وارد حساب شوید.')

        post = CommunityPost.objects.get(id=post_id)
        parent = None
        if parent_id:
            parent = PostComment.objects.get(id=parent_id, post=post)

        author_name = user.get_full_name() or getattr(user, 'username', 'زبان‌آموز')

        comment = PostComment(
            post=post,
            parent=parent,
            author=user,
            author_name=author_name,
            content=content.strip()
        )
        comment.full_clean()
        comment.save()

        # Update comments count
        count = PostComment.objects.filter(post=post, status=PostStatus.PUBLISHED).count()
        CommunityPost.objects.filter(id=post.id).update(comments_count=count)

        return comment

    @staticmethod
    def feature_post_editorial(post_id: str, editor_user: Any, editorial_note: str) -> CommunityPost:
        """
        Features a post for the month by editorial decision with reviewer notes.
        Requires staff / editorial permissions.
        Prevents automatic algorithm/popularity manipulation.
        """
        if not editor_user or not editor_user.is_authenticated or not editor_user.is_staff:
            raise PermissionDenied('تنها تیم تحریریه و مدیران سامانه مجاز به انتخاب پست برگزیده ماه هستند.')

        if not editorial_note or not editorial_note.strip():
            raise ValidationError({'editorial_note': 'توضیحات و دلایل تحریریه برای انتخاب پست برگزیده الزامی است.'})

        post = CommunityPost.objects.get(id=post_id)
        post.is_monthly_featured = True
        post.featured_at = timezone.now()
        post.featured_by = editor_user
        post.editorial_review_notes = editorial_note.strip()
        post.save(update_fields=['is_monthly_featured', 'featured_at', 'featured_by', 'editorial_review_notes'])
        return post

    @staticmethod
    def block_user(blocker: Any, blocked_user: Any, reason: str = '', is_mute_only: bool = False) -> UserBlock:
        """Blocks or mutes a target user."""
        if not blocker or not blocker.is_authenticated:
            raise PermissionDenied('ورود به حساب کاربری الزامی است.')
        if blocker.id == blocked_user.id:
            raise ValidationError({'blocked_user': 'شما نمی‌توانید حساب خود را مسدود کنید.'})

        block, _ = UserBlock.objects.update_or_create(
            blocker=blocker,
            blocked_user=blocked_user,
            defaults={
                'reason': reason.strip(),
                'is_mute_only': is_mute_only
            }
        )
        return block

    @staticmethod
    def unblock_user(blocker: Any, blocked_user: Any) -> bool:
        """Unblocks a target user."""
        if not blocker or not blocker.is_authenticated:
            raise PermissionDenied('ورود به حساب کاربری الزامی است.')
        deleted_count, _ = UserBlock.objects.filter(blocker=blocker, blocked_user=blocked_user).delete()
        return deleted_count > 0

    @staticmethod
    def get_monthly_featured_post() -> Optional[CommunityPost]:
        """Returns the most recent editorially selected monthly featured post."""
        return CommunityPost.objects.filter(
            is_monthly_featured=True,
            status=PostStatus.PUBLISHED
        ).order_by('-featured_at').first()
