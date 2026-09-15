from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from content.models import (
    CefrLevel,
    ContentCategory,
    ContentItem,
    ContentReviewLog,
    ContentStatus,
    ContentType,
    LicenseType,
    SchoolGrade,
)
from content.services import ContentService

User = get_user_model()


class ContentAppTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email="learner@endoora.ir",
            password="test-password-123",
            role=User.Role.LEARNER,
        )
        self.editor = User.objects.create_user(
            email="editor@endoora.ir",
            password="test-password-123",
            role=User.Role.EDITOR,
        )
        self.staff = User.objects.create_user(
            email="admin@endoora.ir",
            password="test-password-123",
            role=User.Role.ADMINISTRATOR,
            is_staff=True,
        )

        # Create published free item
        self.free_item = ContentItem.objects.create(
            slug="test-free-grammar",
            title_fa="تست گرامر رایگان",
            title_en="Test Free Grammar",
            summary_fa="خلاصه گرامر",
            summary_en="Grammar summary",
            category=ContentCategory.GRAMMAR,
            content_type=ContentType.ARTICLE,
            status=ContentStatus.PUBLISHED,
            cefr_level=CefrLevel.A2,
            content_body_fa="متن کامل درس رایگان گرامر",
            content_body_en="Full text of free grammar lesson",
            quiz_data=[{"prompt_fa": "تست", "options": ["الف", "ب"], "correct_index": 0}],
            is_premium=False,
            source_attribution="Endoora Test Team",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora Tester",
        )

        # Create published premium item
        self.premium_item = ContentItem.objects.create(
            slug="test-premium-listening",
            title_fa="تست لیسنینگ ویژه",
            title_en="Test Premium Listening",
            summary_fa="خلاصه لیسنینگ",
            summary_en="Listening summary",
            category=ContentCategory.LISTENING,
            content_type=ContentType.AUDIO_LESSON,
            status=ContentStatus.PUBLISHED,
            cefr_level=CefrLevel.B2,
            content_body_fa="متن کامل محتوای محرمانه و ویژه لیسنینگ",
            content_body_en="Full premium text of listening lesson",
            audio_url="https://media.endoora.ir/audio/test.mp3",
            quiz_data=[{"prompt_fa": "سؤال محرمانه", "options": ["۱", "۲"], "correct_index": 1}],
            is_premium=True,
            free_preview_excerpt_fa="پیش‌نمایش رایگان لیسنینگ ویژه",
            free_preview_excerpt_en="Free preview of premium listening",
            source_attribution="Endoora Test Team",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora Tester",
        )

        # Create draft item
        self.draft_item = ContentItem.objects.create(
            slug="test-draft-writing",
            title_fa="پیش‌نویس رایتینگ",
            title_en="Draft Writing",
            category=ContentCategory.WRITING,
            content_type=ContentType.ARTICLE,
            status=ContentStatus.DRAFT,
            cefr_level=CefrLevel.C1,
            content_body_fa="محتوای در حال ویرایش",
            content_body_en="Content being drafted",
            source_attribution="Endoora Test Team",
            license_type=LicenseType.ORIGINAL_EDITORIAL,
            author_name="Endoora Tester",
        )

    def test_copyright_metadata_is_mandatory(self):
        with self.assertRaises(ValidationError):
            item = ContentItem(
                slug="invalid-no-copyright",
                title_fa="نامعتبر",
                title_en="Invalid",
                category=ContentCategory.VOCABULARY,
                source_attribution="",
                author_name="Tester",
            )
            item.clean()

        with self.assertRaises(ValidationError):
            item2 = ContentItem(
                slug="invalid-no-author",
                title_fa="نامعتبر",
                title_en="Invalid",
                category=ContentCategory.VOCABULARY,
                source_attribution="Source X",
                author_name="",
            )
            item2.clean()

    def test_unpublished_content_is_inaccessible_to_learners(self):
        # Guest request
        resp_guest = self.client.get(f"/api/content/items/{self.draft_item.slug}/")
        self.assertEqual(resp_guest.status_code, status.HTTP_404_NOT_FOUND)

        # Authenticated learner request
        self.client.force_authenticate(user=self.learner)
        resp_learner = self.client.get(f"/api/content/items/{self.draft_item.slug}/")
        self.assertEqual(resp_learner.status_code, status.HTTP_404_NOT_FOUND)

        # Editor request can preview
        self.client.force_authenticate(user=self.editor)
        resp_editor = self.client.get(f"/api/content/items/{self.draft_item.slug}/")
        self.assertEqual(resp_editor.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_editor.data["slug"], self.draft_item.slug)

    def test_server_side_entitlement_redacts_premium_content_for_unentitled(self):
        # Unentitled learner gets redacted excerpt only
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get(f"/api/content/items/{self.premium_item.slug}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data["is_locked"])
        self.assertEqual(resp.data["content_body_fa"], "پیش‌نمایش رایگان لیسنینگ ویژه")
        self.assertNotIn("محتوای محرمانه", resp.data["content_body_fa"])
        self.assertEqual(resp.data["audio_url"], "")
        self.assertEqual(resp.data["quiz_data"], [])
        self.assertIsNotNone(resp.data["paywall_info"])
        self.assertEqual(resp.data["paywall_info"]["plan_name"], "Premium")

    def test_server_side_entitlement_delivers_full_content_for_staff(self):
        self.client.force_authenticate(user=self.staff)
        resp = self.client.get(f"/api/content/items/{self.premium_item.slug}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["is_locked"])
        self.assertIn("محتوای محرمانه", resp.data["content_body_fa"])
        self.assertEqual(resp.data["audio_url"], "https://media.endoora.ir/audio/test.mp3")
        self.assertEqual(len(resp.data["quiz_data"]), 1)
        self.assertIsNone(resp.data["paywall_info"])

    def test_skills_hub_endpoint(self):
        resp = self.client.get("/api/content/skills/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("skills", resp.data)
        self.assertEqual(resp.data["total_skills"], 8)
        skill_slugs = [s["slug"] for s in resp.data["skills"]]
        self.assertIn("grammar", skill_slugs)
        self.assertIn("listening", skill_slugs)
        self.assertIn("culture", skill_slugs)
        self.assertIn("school", skill_slugs)

    def test_editor_review_workflow(self):
        # Learner cannot review
        self.client.force_authenticate(user=self.learner)
        resp_denied = self.client.post(
            f"/api/content/items/{self.draft_item.id}/review/",
            {"new_status": ContentStatus.PUBLISHED, "notes": "Approved"},
        )
        self.assertEqual(resp_denied.status_code, status.HTTP_403_FORBIDDEN)

        # Editor can review and publish
        self.client.force_authenticate(user=self.editor)
        resp_ok = self.client.post(
            f"/api/content/items/{self.draft_item.id}/review/",
            {"new_status": ContentStatus.PUBLISHED, "notes": "Editorial review passed"},
        )
        self.assertEqual(resp_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_ok.data["new_status"], ContentStatus.PUBLISHED)

        # Verify audit log
        log = ContentReviewLog.objects.filter(content_item=self.draft_item).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.reviewer, self.editor)
        self.assertEqual(log.editorial_notes, "Editorial review passed")

    def test_editor_list_create_permissions(self):
        # Learner cannot access editor endpoints
        self.client.force_authenticate(user=self.learner)
        resp = self.client.get("/api/content/editor/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        resp_create = self.client.post("/api/content/editor/", {"title_fa": "تست"})
        self.assertEqual(resp_create.status_code, status.HTTP_403_FORBIDDEN)

        # Editor can list items
        self.client.force_authenticate(user=self.editor)
        resp_list = self.client.get("/api/content/editor/")
        self.assertEqual(resp_list.status_code, status.HTTP_200_OK)
        self.assertIn("results", resp_list.data)
        self.assertGreaterEqual(resp_list.data["count"], 3)

    def test_editor_create_and_validation(self):
        self.client.force_authenticate(user=self.editor)

        # Fail with invalid slug
        payload_bad_slug = {
            "slug": "Invalid Slug with spaces",
            "title_fa": "آموزش زمان آینده",
            "title_en": "Future Tenses Guide",
            "category": ContentCategory.GRAMMAR,
            "content_type": ContentType.ARTICLE,
            "source_attribution": "Endoora Research",
            "author_name": "Senior Linguist",
        }
        resp = self.client.post("/api/content/editor/", payload_bad_slug)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("slug", resp.data)

        # Successful creation
        payload_valid = {
            "slug": "future-tenses-in-depth-guide",
            "title_fa": "راهنمای جامع زمان‌های آینده در زبان انگلیسی",
            "title_en": "Comprehensive Future Tenses in English",
            "summary_fa": "بررسی will، be going to، و حال استمراری برای بیان آینده.",
            "summary_en": "Deep dive into future tense expressions.",
            "category": ContentCategory.GRAMMAR,
            "content_type": ContentType.ARTICLE,
            "status": ContentStatus.DRAFT,
            "cefr_level": CefrLevel.B1,
            "source_attribution": "Endoora Editorial Board",
            "author_name": "Dr. Sarah Rezvani",
            "learning_objectives": ["Distinguish will vs going to", "Express future plans"],
        }
        resp_valid = self.client.post("/api/content/editor/", payload_valid, format="json")
        self.assertEqual(resp_valid.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp_valid.data["slug"], "future-tenses-in-depth-guide")
        self.assertEqual(resp_valid.data["author_name"], "Dr. Sarah Rezvani")

    def test_editor_update_and_transition_lifecycle(self):
        self.client.force_authenticate(user=self.editor)

        # Patch item
        item_id = self.draft_item.id
        patch_resp = self.client.patch(
            f"/api/content/editor/{item_id}/",
            {"summary_fa": "خلاصه به‌روزشده توسط دبیر تحریریه"},
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_resp.data["summary_fa"], "خلاصه به‌روزشده توسط دبیر تحریریه")

        # Transition: submit for review
        trans_resp1 = self.client.post(
            f"/api/content/editor/{item_id}/transition/",
            {"action": "submit_review", "note": "Ready for editorial peer review."},
        )
        self.assertEqual(trans_resp1.status_code, status.HTTP_200_OK)
        self.assertEqual(trans_resp1.data["status"], ContentStatus.IN_REVIEW)

        # Transition: publish
        trans_resp2 = self.client.post(
            f"/api/content/editor/{item_id}/transition/",
            {"action": "publish", "note": "Approved and published to all learners."},
        )
        self.assertEqual(trans_resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(trans_resp2.data["status"], ContentStatus.PUBLISHED)
        self.assertIsNotNone(trans_resp2.data["published_at"])

        # Transition: archive
        trans_resp3 = self.client.post(
            f"/api/content/editor/{item_id}/transition/",
            {"action": "archive", "note": "Superseded by new syllabus."},
        )
        self.assertEqual(trans_resp3.status_code, status.HTTP_200_OK)
        self.assertEqual(trans_resp3.data["status"], ContentStatus.ARCHIVED)

