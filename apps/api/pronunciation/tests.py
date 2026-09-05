from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from mistake_genome.models import LearnerMistakePattern
from pronunciation.models import PronunciationAttempt, PronunciationItem
from pronunciation.services import PronunciationService

User = get_user_model()


class PronunciationLabTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            email="learner1@example.com",
            password="testpassword123",
        )
        self.user2 = User.objects.create_user(
            email="learner2@example.com",
            password="testpassword123",
        )
        self.service = PronunciationService()
        self.service.ensure_seed_items()

    def test_seed_items_loading(self):
        """Curated practice items load across all 4 phonological categories."""
        items = PronunciationItem.objects.all()
        self.assertGreaterEqual(items.count(), 8)

        categories = set(items.values_list("category", flat=True))
        self.assertIn("minimal_pairs", categories)
        self.assertIn("stress_shifts", categories)
        self.assertIn("consonant_clusters", categories)
        self.assertIn("connected_speech", categories)

    def test_items_list_endpoint(self):
        """GET /api/pronunciation/items/ returns catalog with filtering support."""
        # All items
        resp = self.client.get("/api/pronunciation/items/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 8)

        # Filtered by category
        resp_min = self.client.get("/api/pronunciation/items/?category=minimal_pairs")
        self.assertEqual(resp_min.status_code, status.HTTP_200_OK)
        for item in resp_min.data:
            self.assertEqual(item["category"], "minimal_pairs")

    def test_item_detail_endpoint(self):
        """GET /api/pronunciation/items/<item_id>/ returns specific item metadata."""
        resp = self.client.get("/api/pronunciation/items/min_v_w_1/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["item_id"], "min_v_w_1")
        self.assertIn("very wary", resp.data["target_text"])
        self.assertTrue(bool(resp.data["l1_note_fa"]))
        self.assertTrue(bool(resp.data["ipa"]))

    def test_analyze_attempt_authenticated(self):
        """Authenticated learner submits spoken transcript and receives formative metrics."""
        self.client.force_authenticate(user=self.user1)
        payload = {
            "item_id": "stress_photo_1",
            "target_text": "photographer",
            "spoken_transcript": "the photographer was ready",
            "duration_seconds": 2.5,
            "pause_count": 1,
        }
        resp = self.client.post("/api/pronunciation/analyze/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["target_text"], "photographer")
        self.assertGreater(resp.data["speech_rate_wpm"], 0.0)
        self.assertGreaterEqual(resp.data["intelligibility_score"], 60)
        self.assertTrue(bool(resp.data["feedback_en"]))
        self.assertTrue(bool(resp.data["feedback_fa"]))

        # Check saved attempt in database
        attempt = PronunciationAttempt.objects.get(id=resp.data["id"])
        self.assertEqual(attempt.learner, self.user1)
        self.assertEqual(attempt.pause_count, 1)

    def test_analyze_attempt_guest_unauthenticated(self):
        """Guest visitors receive instant formative analysis without persistence."""
        payload = {
            "item_id": "min_v_w_1",
            "target_text": "very wary",
            "spoken_transcript": "very wary",
            "duration_seconds": 1.2,
            "pause_count": 0,
        }
        resp = self.client.post("/api/pronunciation/analyze/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsNone(resp.data["id"])
        self.assertIn("Rule #8", resp.data["disclaimer"])
        self.assertEqual(PronunciationAttempt.objects.count(), 0)

    def test_rule_8_no_accent_claims(self):
        """Analysis evaluates intelligibility and pacing; never claims accent percentage."""
        attempt = self.service.analyze_attempt(
            learner=self.user1,
            target_text="photographer",
            spoken_transcript="photographer",
            duration_seconds=1.0,
            item_id="stress_photo_1",
        )
        # Verify no accent discrimination terms exist in feedback
        prohibited_terms = ["native accent", "bad accent", "persian accent", "accent percentage", "sound like native"]
        for term in prohibited_terms:
            self.assertNotIn(term, attempt.feedback_en.lower())

        # Verify formative keywords are present
        self.assertTrue(
            "intelligibility" in attempt.feedback_en.lower()
            or "stress" in attempt.feedback_en.lower()
            or "pacing" in attempt.feedback_en.lower()
        )

    def test_speech_rate_calculation(self):
        """Speech rate accurately calculates Words Per Minute (WPM)."""
        attempt = self.service.analyze_attempt(
            learner=self.user1,
            target_text="I will eat an apple in an hour",
            spoken_transcript="I will eat an apple in an hour",
            duration_seconds=4.0,  # 8 words in 4 seconds = 120 WPM
        )
        self.assertEqual(attempt.speech_rate_wpm, 120.0)

    def test_save_to_mistake_genome(self):
        """Learner can selectively record an identified pronunciation challenge to Mistake Genome."""
        self.client.force_authenticate(user=self.user1)
        attempt = self.service.analyze_attempt(
            learner=self.user1,
            target_text="photographer",
            spoken_transcript="photo-grapher",
            item_id="stress_photo_1",
        )

        resp = self.client.post(f"/api/pronunciation/attempts/{attempt.id}/save-to-genome/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data["saved_to_genome"])

        attempt.refresh_from_db()
        self.assertTrue(attempt.saved_to_genome)

        # Verify pattern in Mistake Genome
        pattern = LearnerMistakePattern.objects.filter(
            learner=self.user1,
            category="pronunciation",
        ).first()
        self.assertIsNotNone(pattern)
        self.assertIn("pronunciation", pattern.tag)

    def test_user_isolation(self):
        """Learner 2 cannot access or save Learner 1's attempts to their Genome."""
        attempt = self.service.analyze_attempt(
            learner=self.user1,
            target_text="comfortable",
            spoken_transcript="comfortable",
            item_id="elision_comf_1",
        )

        # Authenticate as Learner 2
        self.client.force_authenticate(user=self.user2)
        resp = self.client.post(f"/api/pronunciation/attempts/{attempt.id}/save-to-genome/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

        attempt.refresh_from_db()
        self.assertFalse(attempt.saved_to_genome)

    def test_legacy_service_analyze_compatibility(self):
        """Legacy analyze(audio) call returns safe trend metadata."""
        result = self.service.analyze(b"dummy")
        self.assertIn("feedback", result)
        self.assertIn("Constitution Rule #8", result["warning"])
        self.assertIn("intelligibility_score", result)
