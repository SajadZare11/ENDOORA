import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase

from search.models import SearchDocument, SearchQueryLog, RecentSearch, SearchContentType, SearchVisibility
from search.normalizer import normalize_text, tokenize, normalize_persian_text
from search.services import SearchService, SearchIndexingService

User = get_user_model()


class SearchNormalizerTests(TestCase):
    def test_persian_character_normalization(self):
        # Arabic Yeh (\u064A) -> Persian Yeh (\u06CC)
        # Arabic Kaf (\u0643) -> Persian Kaf (\u06A9)
        arabic_text = "كتاب يادگيري"
        normalized = normalize_text(arabic_text)
        self.assertEqual(normalized, "کتاب یادگیری")

    def test_diacritics_removal(self):
        # Text with harakat (َ ُ ِ) and tanwin
        vocalized_text = "کِتَابٌ آموزِشِ زَبان"
        normalized = normalize_text(vocalized_text)
        self.assertEqual(normalized, "کتاب اموزش زبان")

    def test_zwnj_normalization(self):
        # Half space
        zwnj_text = "می\u200cخواهم یاد\u200cبگیرم"
        tokens = tokenize(zwnj_text)
        self.assertIn("خواهم", tokens)
        self.assertIn("بگیرم", tokens)

    def test_english_case_folding(self):
        mixed_en = "IELTS Academic Writing Task 2"
        normalized = normalize_text(mixed_en)
        self.assertIn("ielts", normalized)
        self.assertIn("writing", normalized)


class SearchPermissionTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email="user1@example.com", password="password123")
        self.user2 = User.objects.create_user(email="user2@example.com", password="password123")

        # Public Course Document
        self.public_doc = SearchDocument.objects.create(
            title="دوره جامع آیلتس آکادمیک",
            content="آمادگی کامل برای مهارت‌های ریدینگ و رایتینگ آیلتس",
            content_type=SearchContentType.COURSE,
            visibility=SearchVisibility.PUBLIC,
            target_id="ielts-prep",
            target_url="/courses/ielts-prep",
            popularity_score=10,
        )

        # Private Assignment belonging to user1
        self.private_doc = SearchDocument.objects.create(
            title="تکلیف نگارش رایتینگ تسک ۱",
            content="تمرین توصیف نمودار خطی روند آمار",
            content_type=SearchContentType.ASSIGNMENT,
            visibility=SearchVisibility.PRIVATE_OWNER,
            owner_id=self.user1.id,
            target_id=str(uuid.uuid4()),
            target_url="/assignments/123",
            popularity_score=0,
        )

    def test_anonymous_cannot_see_private_document(self):
        # Anonymous search for "رایتینگ"
        res = SearchService.search(query="رایتینگ", user=None)
        results = res["results"]
        result_ids = [str(r.id) for r in results]

        self.assertIn(str(self.public_doc.id), result_ids)
        self.assertNotIn(str(self.private_doc.id), result_ids)

    def test_owner_can_see_own_private_document(self):
        # Owner searches for "رایتینگ"
        res = SearchService.search(query="رایتینگ", user=self.user1)
        results = res["results"]
        result_ids = [str(r.id) for r in results]

        self.assertIn(str(self.public_doc.id), result_ids)
        self.assertIn(str(self.private_doc.id), result_ids)

    def test_other_user_cannot_see_private_document(self):
        # User 2 searches for "رایتینگ"
        res = SearchService.search(query="رایتینگ", user=self.user2)
        results = res["results"]
        result_ids = [str(r.id) for r in results]

        self.assertIn(str(self.public_doc.id), result_ids)
        self.assertNotIn(str(self.private_doc.id), result_ids)

    def test_raw_private_message_indexing_is_prevented(self):
        with self.assertRaises(ValueError):
            SearchIndexingService.index_private_message("chat-msg-1", "secret")


class SearchQueryLogTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="searcher@example.com", password="password123")
        SearchDocument.objects.create(
            title="دوره گرامر پیشرفته",
            content="بررسی ساختارهای شرطی و مجهول",
            content_type=SearchContentType.COURSE,
            visibility=SearchVisibility.PUBLIC,
            target_id="grammar-adv",
            target_url="/courses/grammar-adv",
        )

    def test_zero_result_query_is_logged(self):
        res = SearchService.search(query="واژه_کاملا_ناموجود_در_دیتابیس_۱۲۳", user=self.user)
        self.assertTrue(res["is_zero_result"])
        self.assertEqual(res["total_count"], 0)

        # Verify log entry
        log = SearchQueryLog.objects.filter(query="واژه_کاملا_ناموجود_در_دیتابیس_۱۲۳").first()
        self.assertIsNotNone(log)
        self.assertTrue(log.is_zero_result)
        self.assertEqual(log.results_count, 0)
        self.assertEqual(log.user, self.user)

    def test_recent_searches_saved_for_authenticated_user(self):
        SearchService.search(query="گرامر", user=self.user)
        recent = SearchService.get_recent_searches(self.user)
        self.assertIn("گرامر", recent)

        # Clear history
        SearchService.clear_recent_searches(self.user)
        self.assertEqual(SearchService.get_recent_searches(self.user), [])

    def test_persian_arabic_query_variant_finds_document(self):
        # Query with Arabic Kaf and Yeh: "گِرامَر كِتاب" vs "گرامر"
        res = SearchService.search(query="گرَامَر", user=None)
        self.assertGreaterEqual(res["total_count"], 1)
        self.assertEqual(res["results"][0].target_id, "grammar-adv")
