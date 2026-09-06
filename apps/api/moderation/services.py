from __future__ import annotations

import logging
from typing import Optional, Dict, Any
from django.conf import settings
from django.core.exceptions import PermissionDenied, ValidationError
from django.utils import timezone

from .models import (
    Report,
    ModerationAuditLog,
    ReportReason,
    ModerationStatus,
    ModerationAction,
)

logger = logging.getLogger(__name__)


class ModerationService:
    @staticmethod
    def submit_report(
        reporter: Optional[Any],
        target_type: str,
        target_id: str,
        reason: str,
        description: str = '',
    ) -> Report:
        """
        Submits a report on community content.
        Captures an immutable snapshot of the reported content for legal/audit purposes.
        Calculates the SLA response deadline based on severity.
        """
        target_author_id = None
        content_snapshot = ''

        if target_type == 'post':
            from community.models import CommunityPost
            try:
                post = CommunityPost.objects.get(id=target_id)
                target_author_id = post.author_id
                content_snapshot = (
                    f"Title (FA): {post.title_fa}\n"
                    f"Title (EN): {post.title_en}\n"
                    f"Content (FA): {post.content_fa}\n"
                    f"Content (EN): {post.content_en}\n"
                    f"Author: {post.author_name} (ID: {post.author_id})\n"
                    f"Media: {post.media_attachments}\n"
                    f"Lesson Plan: {post.lesson_plan_metadata}"
                )
            except CommunityPost.DoesNotExist:
                raise ValidationError({'target_id': 'پست مورد نظر یافت نشد.'})

        elif target_type == 'comment':
            from community.models import PostComment
            try:
                comment = PostComment.objects.get(id=target_id)
                target_author_id = comment.author_id
                content_snapshot = (
                    f"Comment: {comment.content}\n"
                    f"Author: {comment.author_name} (ID: {comment.author_id})\n"
                    f"Post ID: {comment.post_id}"
                )
            except PostComment.DoesNotExist:
                raise ValidationError({'target_id': 'نظر مورد نظر یافت نشد.'})
        else:
            raise ValidationError({'target_type': 'نوع محتوای گزارش شده نامعتبر است.'})

        sla_hours = Report.SLA_HOURS_MAP.get(reason, 24)
        sla_deadline = timezone.now() + timezone.timedelta(hours=sla_hours)

        report = Report.objects.create(
            reporter=reporter if (reporter and reporter.is_authenticated) else None,
            target_type=target_type,
            target_id=str(target_id),
            target_author_id=target_author_id,
            target_content_snapshot=content_snapshot,
            reason=reason,
            description=description.strip(),
            sla_hours=sla_hours,
            sla_deadline=sla_deadline,
            status=ModerationStatus.PENDING,
        )

        return report

    @staticmethod
    def get_moderation_queue(filter_status: str = ModerationStatus.PENDING):
        """Returns moderation reports ordered by SLA urgency (closest deadline first)."""
        qs = Report.objects.select_related('reporter', 'assigned_to', 'resolved_by')
        if filter_status and filter_status != 'all':
            qs = qs.filter(status=filter_status)
        return qs.order_by('sla_deadline', 'created_at')

    @staticmethod
    def resolve_report(
        report_id: str,
        moderator: Any,
        action: str,
        resolution_notes: str = '',
    ) -> Report:
        """
        Resolves a report and applies moderation actions.
        Creates an immutable ModerationAuditLog.
        If CONTENT_REMOVED, the target content status is updated to 'removed'.
        """
        if not moderator or not moderator.is_authenticated or not moderator.is_staff:
            raise PermissionDenied('تنها ناظران و کارشناسان پشتیبانی دسترسی به بررسی گزارش‌ها دارند.')

        try:
            report = Report.objects.get(id=report_id)
        except Report.DoesNotExist:
            raise ValidationError({'report_id': 'گزارش مورد نظر یافت نشد.'})

        # Apply action on target content
        target_updated = False
        if action == ModerationAction.CONTENT_REMOVED:
            if report.target_type == 'post':
                from community.models import CommunityPost
                CommunityPost.objects.filter(id=report.target_id).update(status='removed')
                target_updated = True
            elif report.target_type == 'comment':
                from community.models import PostComment
                PostComment.objects.filter(id=report.target_id).update(status='removed')
                target_updated = True

        new_status = (
            ModerationStatus.DISMISSED if action == ModerationAction.NONE
            else ModerationStatus.RESOLVED
        )

        report.status = new_status
        report.action_taken = action
        report.resolved_by = moderator
        report.resolved_at = timezone.now()
        report.resolution_notes = resolution_notes.strip()
        report.save()

        # Create immutable Audit Log
        ModerationAuditLog.objects.create(
            report=report,
            actor=moderator,
            action=action,
            target_type=report.target_type,
            target_id=report.target_id,
            details={
                'reason': report.reason,
                'sla_hours': report.sla_hours,
                'was_sla_breached': report.is_sla_breached,
                'target_author_id': str(report.target_author_id) if report.target_author_id else None,
                'resolution_notes': resolution_notes,
                'target_content_snapshot': report.target_content_snapshot,
            }
        )

        return report
