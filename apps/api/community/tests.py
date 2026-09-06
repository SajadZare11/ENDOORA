from __future__ import annotations

import uuid
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError, PermissionDenied
from django.test import TestCase, override_settings

from community.models import (
    CommunityPost,
    PostComment,
    PostReaction,
    UserBlock,
    PostType,
    PostStatus,
    PostAudience,
    LicenseType,
)
from community.pii_scanner import scan_pii, assert_no_pii
from community.services import CommunityService

User = get_user_model()


class CommunityTests(TestCase):
    def setUp(self):
        self.learner = User.objects.create_user(
            email='learner1@endoora.ir',
            password='password123',
            first_name='سارا',
            last_name='احمدی',
            role=User.Role.LEARNER if hasattr(User, 'Role') else 'learner',
        )

        self.teacher = User.objects.create_user(
            email='teacher1@endoora.ir',
            password='password123',
            first_name='استاد',
            last_name='کیانی',
            role=User.Role.TEACHER if hasattr(User, 'Role') else 'teacher',
        )

        self.staff_editor = User.objects.create_user(
            email='editor1@endoora.ir',
            password='password123',
            is_staff=True,
            role=User.Role.ADMINISTRATOR if hasattr(User, 'Role') else 'admin',
        )

        self.other_user = User.objects.create_user(
            email='learner2@endoora.ir',
            password='password123',
            first_name='علی',
            last_name='رضایی',
            role=User.Role.LEARNER if hasattr(User, 'Role') else 'learner',
        )

    def test_pii_scanner_detects_phone_card_and_national_id(self):
        # Iranian phone number
        findings_phone = scan_pii("سلام با من با شماره 09123456789 تماس بگیرید")
        self.assertTrue(any(f['type'] == 'phone_number' for f in findings_phone))

        with self.assertRaises(ValidationError):
            assert_no_pii("شماره من 09121112233 است")

        # 16-digit bank card
        findings_card = scan_pii("شماره کارت: 6037-9971-1234-5678")
        self.assertTrue(any(f['type'] == 'bank_card' for f in findings_card))

        with self.assertRaises(ValidationError):
            assert_no_pii("شماره کارت من 6037997112345678 است")

        # Clean text passes
        findings_clean = scan_pii("امروز گرامر زمان حال کامل را تمرین کردم.")
        self.assertEqual(len(findings_clean), 0)

    def test_learner_cannot_post_as_teacher_experience(self):
        # A normal learner cannot post with post_type=TEACHER_EXPERIENCE
        post = CommunityPost(
            author=self.learner,
            author_name='سارا',
            author_role='learner',
            is_verified_teacher=False,
            post_type=PostType.TEACHER_EXPERIENCE,
            title_fa='تجربه تدریس من در آموزشگاه',
            content_fa='در طول تدریس متوجه شدم...',
        )
        with self.assertRaises(ValidationError) as ctx:
            post.full_clean()
        self.assertIn('post_type', ctx.exception.message_dict)

    def test_verified_teacher_can_post_teacher_experience(self):
        post = CommunityPost(
            author=self.teacher,
            author_name='استاد کیانی',
            author_role='teacher',
            is_verified_teacher=True,
            post_type=PostType.TEACHER_EXPERIENCE,
            title_fa='تجربه تدریس من در دوره آیلتس',
            content_fa='برای تقویت اسپیکینگ پارت دوم این تکنیک جواب داد.',
        )
        post.full_clean()
        post.save()
        self.assertEqual(post.post_type, PostType.TEACHER_EXPERIENCE)
        self.assertTrue(post.is_verified_teacher)

    def test_lesson_plan_requires_copyright_and_restricted_format(self):
        # Missing license_type and copyright_attribution
        post = CommunityPost(
            author=self.teacher,
            author_name='استاد کیانی',
            author_role='teacher',
            is_verified_teacher=True,
            post_type=PostType.LESSON_PLAN,
            title_fa='طرح درس گرامر شرطی‌ها',
            content_fa='طرح درس کامل پایه یازدهم.',
            lesson_plan_metadata={}
        )
        with self.assertRaises(ValidationError) as ctx:
            post.full_clean()
        self.assertIn('lesson_plan_metadata', ctx.exception.message_dict)

        # Invalid file format (e.g. .exe)
        post.lesson_plan_metadata = {
            'license_type': LicenseType.CC_BY_SA,
            'copyright_attribution': 'استاد کیانی و گروه آموزشی اندورا',
            'file_format': 'exe',
        }
        with self.assertRaises(ValidationError) as ctx:
            post.full_clean()
        self.assertIn('lesson_plan_metadata', ctx.exception.message_dict)

        # Valid format (.pdf)
        post.lesson_plan_metadata = {
            'license_type': LicenseType.CC_BY_SA,
            'copyright_attribution': 'استاد کیانی و گروه آموزشی اندورا',
            'file_format': 'pdf',
            'file_url': 'https://storage.endoora.com/plans/conditionals.pdf',
        }
        post.full_clean()
        post.save()
        self.assertEqual(post.post_type, PostType.LESSON_PLAN)

    def test_media_attachment_requires_caption_and_alt_text(self):
        post = CommunityPost(
            author=self.learner,
            author_name='سارا',
            title_fa='تخته کلاس امروز',
            content_fa='عکس یادداشت‌های گرامری.',
            media_attachments=[{
                'url': 'https://storage.endoora.com/photos/board.jpg',
                'alt_text': '',  # empty alt_text
                'caption': 'عکس تخته',
            }]
        )
        with self.assertRaises(ValidationError) as ctx:
            post.full_clean()
        self.assertIn('media_attachments', ctx.exception.message_dict)

        # With alt_text and caption
        post.media_attachments = [{
            'url': 'https://storage.endoora.com/photos/board.jpg',
            'alt_text': 'نمودار ساختار افعال وجهی روی تخته سفید با ماژیک آبی',
            'caption': 'یادداشت‌های خلاصه افعال مدال در جلسه چهارم',
        }]
        post.full_clean()
        post.save()
        self.assertEqual(len(post.media_attachments), 1)

    def test_user_blocking_hides_posts_from_feed(self):
        post1 = CommunityPost.objects.create(
            author=self.other_user,
            author_name='علی رضایی',
            title_fa='پست علی',
            content_fa='محتوای علی',
            status=PostStatus.PUBLISHED
        )
        post2 = CommunityPost.objects.create(
            author=self.teacher,
            author_name='استاد کیانی',
            title_fa='پست استاد',
            content_fa='محتوای استاد',
            status=PostStatus.PUBLISHED
        )

        # Before block, learner1 sees both
        posts = CommunityService.list_posts(user=self.learner)
        self.assertEqual(posts.count(), 2)

        # Learner1 blocks Ali (other_user)
        CommunityService.block_user(self.learner, self.other_user, reason='عدم تمایل به مشاهده')

        # After block, learner1 sees only teacher's post
        posts_after = CommunityService.list_posts(user=self.learner)
        self.assertEqual(posts_after.count(), 1)
        self.assertEqual(posts_after.first().id, post2.id)

    def test_reactions_toggle(self):
        post = CommunityPost.objects.create(
            author=self.teacher,
            author_name='استاد کیانی',
            title_fa='نکته لیسنینگ',
            content_fa='به تفاوت لهجه‌ها توجه کنید.',
            status=PostStatus.PUBLISHED
        )

        # Toggle like: adds reaction
        res1 = CommunityService.toggle_reaction(post.id, self.learner, reaction_type='helpful')
        self.assertEqual(res1['action'], 'added')
        self.assertEqual(res1['reactions_count'], 1)

        # Toggle like again: removes reaction
        res2 = CommunityService.toggle_reaction(post.id, self.learner, reaction_type='helpful')
        self.assertEqual(res2['action'], 'removed')
        self.assertEqual(res2['reactions_count'], 0)

    @override_settings(COMMUNITY_COMMENTS_ENABLED=False)
    def test_comments_feature_flag_enforcement(self):
        post = CommunityPost.objects.create(
            author=self.teacher,
            author_name='استاد کیانی',
            title_fa='تست کامنت',
            content_fa='متن پست تست کامنت',
            status=PostStatus.PUBLISHED
        )
        with self.assertRaises(PermissionDenied):
            CommunityService.add_comment(post.id, self.learner, "سلام این کامنت تست است.")

    def test_editorial_featured_post_selection(self):
        post = CommunityPost.objects.create(
            author=self.teacher,
            author_name='استاد کیانی',
            title_fa='بهترین روش مرور لغت',
            content_fa='روش جعبه لایتنر دیجیتال اندورا...',
            status=PostStatus.PUBLISHED
        )

        # Normal learner cannot feature post
        with self.assertRaises(PermissionDenied):
            CommunityService.feature_post_editorial(post.id, self.learner, "عالی بود")

        # Staff editor can feature with editorial note
        featured = CommunityService.feature_post_editorial(
            post.id,
            self.staff_editor,
            "این پست به دلیل کیفیت متدولوژی و تحلیل کاربردی L1 به عنوان برگزیده ماه برگزیده شد."
        )
        self.assertTrue(featured.is_monthly_featured)
        self.assertIsNotNone(featured.featured_at)
        self.assertIn("L1", featured.editorial_review_notes)

        # Monthly featured endpoint returns it
        latest_featured = CommunityService.get_monthly_featured_post()
        self.assertEqual(latest_featured.id, post.id)
