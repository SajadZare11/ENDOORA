from datetime import timedelta
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import SrsCandidate, SrsItem, SrsReview
from .services import (
    approve_candidate,
    delete_srs_item,
    edit_srs_item,
    extract_candidates,
    ignore_candidate,
    review_item,
)

User = get_user_model()


class SrsEngineTests(APITestCase):
    def setUp(self):
        self.learner_a = User.objects.create_user(
            email="learner_a@endoora.test",
            password="testpassword123",
            role="learner",
        )
        self.learner_b = User.objects.create_user(
            email="learner_b@endoora.test",
            password="testpassword123",
            role="learner",
        )

    def test_anonymous_cannot_access_srs(self):
        resp = self.client.get("/api/srs/today/")
        self.assertIn(resp.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        resp2 = self.client.post("/api/srs/review/", {"item_id": 1, "rating": 3})
        self.assertIn(resp2.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_extract_candidates_deduplication(self):
        text = (
            "The team made a substantial discovery in the lab. "
            "Later, multiple discoveries were announced by researchers."
        )
        candidates = extract_candidates(
            learner=self.learner_a,
            text=text,
            source_type="writing",
            source_id="essay-101",
        )
        # Should extract 'discovery' and 'substantial', but NOT duplicate 'discoveries'
        lemmas = [c.lemma for c in candidates]
        self.assertIn("discovery", lemmas)
        self.assertIn("substantial", lemmas)
        self.assertEqual(lemmas.count("discovery"), 1)

        # Second extraction on same text should not duplicate pending candidates
        cand2 = extract_candidates(self.learner_a, text, source_type="writing")
        self.assertEqual(len(cand2), 0)

    def test_candidate_approval_and_ignore_workflow(self):
        cand = SrsCandidate.objects.create(
            learner=self.learner_a,
            term="ambiguous",
            lemma="ambiguous",
            part_of_speech="adjective",
            meaning_fa="مبهم",
            example_sentence="The clause was ambiguous.",
            source_text="The clause was ambiguous.",
            source_type="writing",
            status="pending",
        )

        self.client.force_authenticate(user=self.learner_a)

        # 1. Candidate listed in inbox
        resp = self.client.get("/api/srs/candidates/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

        # 2. Approve candidate with custom meaning
        resp_app = self.client.post(
            f"/api/srs/candidates/{cand.id}/approve/",
            {"custom_meaning": "چندپهلو و مبهم"},
        )
        self.assertEqual(resp_app.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp_app.data["meaning_fa"], "چندپهلو و مبهم")

        # Candidate status updated to approved
        cand.refresh_from_db()
        self.assertEqual(cand.status, "approved")

        # Now active SrsItem exists in deck
        item = SrsItem.objects.get(learner=self.learner_a, lemma="ambiguous")
        self.assertEqual(item.status, "new")
        self.assertEqual(item.interval_days, 1)

        # Test ignore
        cand_ignore = SrsCandidate.objects.create(
            learner=self.learner_a,
            term="cohesion",
            lemma="cohesion",
            status="pending",
        )
        resp_ign = self.client.post(f"/api/srs/candidates/{cand_ignore.id}/ignore/")
        self.assertEqual(resp_ign.status_code, status.HTTP_200_OK)
        cand_ignore.refresh_from_db()
        self.assertEqual(cand_ignore.status, "ignored")

    def test_sm2_review_scheduling_ratings(self):
        now = timezone.now()
        item = SrsItem.objects.create(
            learner=self.learner_a,
            term="discovery",
            lemma="discovery",
            part_of_speech="noun",
            meaning_fa="کشف",
            example_sentence="A great discovery.",
            source_text="A great discovery.",
            source_type="reading",
            status="new",
            interval_days=1,
            repetition=0,
            ease_factor=2.5,
            due_at=now,
        )

        self.client.force_authenticate(user=self.learner_a)

        # 1. Rate Good (3): repetition goes to 1, interval becomes 1, status review
        resp = self.client.post(
            "/api/srs/review/",
            {"item_id": item.id, "rating": 3, "response_time_ms": 1200},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.repetition, 1)
        self.assertEqual(item.status, "review")
        self.assertIn("next_intervals", resp.data)
        self.assertEqual(resp.data["next_intervals"]["again"], 1)

        # 2. Rate Good again: repetition goes to 2, interval becomes 3
        resp2 = self.client.post(
            "/api/srs/review/",
            {"item_id": item.id, "rating": 3, "response_time_ms": 1500},
        )
        item.refresh_from_db()
        self.assertEqual(item.repetition, 2)
        self.assertEqual(item.interval_days, 3)

        # 3. Rate Again (1): resets interval to 1, increases lapse_count
        resp3 = self.client.post(
            "/api/srs/review/",
            {"item_id": item.id, "rating": 1, "response_time_ms": 1100},
        )
        item.refresh_from_db()
        self.assertEqual(item.repetition, 0)
        self.assertEqual(item.interval_days, 1)
        self.assertEqual(item.lapse_count, 1)
        self.assertEqual(item.status, "learning")

    def test_leech_handling_threshold(self):
        item = SrsItem.objects.create(
            learner=self.learner_a,
            term="articulate",
            lemma="articulate",
            meaning_fa="رسا بیان کردن",
            status="learning",
            interval_days=1,
            repetition=0,
            ease_factor=2.5,
            lapse_count=3,
            due_at=timezone.now(),
        )

        self.client.force_authenticate(user=self.learner_a)

        # 4th lapse triggers leech
        resp = self.client.post(
            "/api/srs/review/",
            {"item_id": item.id, "rating": 1, "response_time_ms": 1000},
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.lapse_count, 4)
        self.assertTrue(item.is_leech)
        self.assertEqual(item.leech_action, "contextual_remedy")
        self.assertTrue(resp.data["is_leech"])

    def test_edit_bad_ai_meaning(self):
        item = SrsItem.objects.create(
            learner=self.learner_a,
            term="resilience",
            lemma="resilience",
            meaning_fa="معنی اشتباه ترجمه ماشینی",
            example_sentence="Old example",
            due_at=timezone.now(),
        )

        self.client.force_authenticate(user=self.learner_a)

        resp = self.client.patch(
            f"/api/srs/items/{item.id}/",
            {
                "meaning_fa": "تاب‌آوری و استقامت در شرایط دشوار",
                "example_sentence": "She showed great resilience after the setback.",
            },
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.meaning_fa, "تاب‌آوری و استقامت در شرایط دشوار")
        self.assertEqual(item.example_sentence, "She showed great resilience after the setback.")

    def test_source_sentence_traceability_and_deletion_removes_context(self):
        item = SrsItem.objects.create(
            learner=self.learner_a,
            term="meticulous",
            lemma="meticulous",
            meaning_fa="بسیار دقیق",
            source_text="Her meticulous planning ensured the conference succeeded.",
            source_type="writing",
            due_at=timezone.now(),
        )

        self.client.force_authenticate(user=self.learner_a)

        # Traceability
        resp = self.client.get(f"/api/srs/items/{item.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["source_text"], "Her meticulous planning ensured the conference succeeded.")
        self.assertEqual(resp.data["source_type"], "writing")

        # Deletion removes personal context
        resp_del = self.client.delete(f"/api/srs/items/{item.id}/")
        self.assertEqual(resp_del.status_code, status.HTTP_200_OK)
        self.assertFalse(SrsItem.objects.filter(id=item.id).exists())

    def test_user_isolation(self):
        item_b = SrsItem.objects.create(
            learner=self.learner_b,
            term="private_word",
            lemma="private_word",
            meaning_fa="کلمه خصوصی کاربر دیگر",
            due_at=timezone.now(),
        )

        self.client.force_authenticate(user=self.learner_a)

        # Cannot retrieve
        resp_get = self.client.get(f"/api/srs/items/{item_b.id}/")
        self.assertEqual(resp_get.status_code, status.HTTP_404_NOT_FOUND)

        # Cannot review
        resp_rev = self.client.post("/api/srs/review/", {"item_id": item_b.id, "rating": 3})
        self.assertEqual(resp_rev.status_code, status.HTTP_404_NOT_FOUND)

        # Cannot delete
        resp_del = self.client.delete(f"/api/srs/items/{item_b.id}/")
        self.assertEqual(resp_del.status_code, status.HTTP_404_NOT_FOUND)

    def test_anti_spam_guard(self):
        item = SrsItem.objects.create(
            learner=self.learner_a,
            term="cohesion",
            lemma="cohesion",
            meaning_fa="انسجام",
            due_at=timezone.now(),
        )
        self.client.force_authenticate(user=self.learner_a)

        # Response time under 300ms triggers anti-spam validation error
        with self.assertRaises(Exception):
            review_item(item, rating=3, response_time_ms=150)

    def test_today_review_filters_due_items(self):
        now = timezone.now()
        # Due item
        SrsItem.objects.create(
            learner=self.learner_a,
            term="due_word",
            lemma="due_word",
            meaning_fa="کلمه سررسیدشده",
            due_at=now - timedelta(hours=1),
        )
        # Future item
        SrsItem.objects.create(
            learner=self.learner_a,
            term="future_word",
            lemma="future_word",
            meaning_fa="کلمه آینده",
            due_at=now + timedelta(days=2),
        )

        self.client.force_authenticate(user=self.learner_a)
        resp = self.client.get("/api/srs/today/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        terms = [card["term"] for card in resp.data]
        self.assertIn("due_word", terms)
        self.assertNotIn("future_word", terms)
