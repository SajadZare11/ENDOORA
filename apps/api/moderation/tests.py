from __future__ import annotations

import uuid
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError, PermissionDenied
from django.test import TestCase
from django.utils import timezone

from community.models import CommunityPost, PostStatus
from moderation.models import (
    Report,
    ModerationAuditLog,
    ReportReason,
    ModerationStatus,
    ModerationAction,
)
from moderation.services import ModerationService

User = get_user_model()


class ModerationTests(TestCase):
    def setUp(self):
        self.learner = User.objects.create_user(
            email='reporter_user@endoora.ir',
            password='password123',
            first_name='مهسا',
            last_name='کریمی',
            role=User.Role.LEARNER if hasattr(User, 'Role') else 'learner',
        )
        self.author = User.objects.create_user(
            email='post_author@endoora.ir',
            password='password123',
            first_name='پویا',
            last_name='رستمی',
            role=User.Role.LEARNER if hasattr(User, 'Role') else 'learner',
        )
        self.moderator = User.objects.create_user(
            email='moderator_admin@endoora.ir',
            password='password123',
            is_staff=True,
            role=User.Role.ADMINISTRATOR if hasattr(User, 'Role') else 'admin',
        )

        self.post = CommunityPost.objects.create(
            author=self.author,
            author_name='پویا رستمی',
            title_fa='پست آزمایشی نیازمند بررسی',
            content_fa='متن پست آزمایشی حاوی محتوای مشکوک',
            status=PostStatus.PUBLISHED,
        )

    def test_report_submission_captures_snapshot_and_sets_sla(self):
        # Report for PII leak (urgent 2-hour SLA)
        report_pii = ModerationService.submit_report(
            reporter=self.learner,
            target_type='post',
            target_id=str(self.post.id),
            reason=ReportReason.PII_LEAK,
            description='حاوی اطلاعات خصوصی',
        )
        self.assertEqual(report_pii.sla_hours, 2)
        self.assertIn('متن پست آزمایشی', report_pii.target_content_snapshot)
        self.assertEqual(report_pii.target_author_id, self.author.id)
        self.assertEqual(report_pii.status, ModerationStatus.PENDING)

        # Report for SPAM (standard 24-hour SLA)
        report_spam = ModerationService.submit_report(
            reporter=self.learner,
            target_type='post',
            target_id=str(self.post.id),
            reason=ReportReason.SPAM,
            description='تبلیغات مکرر',
        )
        self.assertEqual(report_spam.sla_hours, 24)

        # Queue orders urgent report first
        queue = list(ModerationService.get_moderation_queue(filter_status='pending'))
        self.assertEqual(queue[0].id, report_pii.id)
        self.assertEqual(queue[1].id, report_spam.id)

    def test_resolve_report_removes_content_and_creates_audit_log(self):
        report = ModerationService.submit_report(
            reporter=self.learner,
            target_type='post',
            target_id=str(self.post.id),
            reason=ReportReason.COPYRIGHT,
            description='استفاده بدون مجوز از کتاب تجاری',
        )

        # Non-staff cannot resolve report
        with self.assertRaises(PermissionDenied):
            ModerationService.resolve_report(
                str(report.id),
                moderator=self.learner,
                action=ModerationAction.CONTENT_REMOVED,
                resolution_notes='تخلف محرز است'
            )

        # Moderator resolves report with CONTENT_REMOVED
        resolved = ModerationService.resolve_report(
            str(report.id),
            moderator=self.moderator,
            action=ModerationAction.CONTENT_REMOVED,
            resolution_notes='محتوا به علت نقض کپی‌رایت از دید عمومی حذف شد.'
        )

        self.assertEqual(resolved.status, ModerationStatus.RESOLVED)
        self.assertEqual(resolved.action_taken, ModerationAction.CONTENT_REMOVED)
        self.assertEqual(resolved.resolved_by, self.moderator)

        # Post status in database is updated to REMOVED
        self.post.refresh_from_db()
        self.assertEqual(self.post.status, PostStatus.REMOVED)

        # Audit log is created and content snapshot remains intact
        audit_log = ModerationAuditLog.objects.filter(report=report).first()
        self.assertIsNotNone(audit_log)
        self.assertEqual(audit_log.action, ModerationAction.CONTENT_REMOVED)
        self.assertEqual(audit_log.actor, self.moderator)
        self.assertIn('متن پست آزمایشی', audit_log.details['target_content_snapshot'])
