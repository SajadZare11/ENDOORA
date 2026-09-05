"""
Endoora AI Mistake Genome - Automated Unit & Integration Tests
Verifies:
1. Evidence threshold: a pattern requires multiple evidence events before 'recurring'.
2. Learner disputes: disputed patterns are strictly excluded from practice recommendations.
3. Resolution: mastered patterns are excluded from active targets.
4. Privacy: personal evidence snippets are scrubbed on request.
5. Learner isolation: learners cannot see or dispute each other's data.
6. Summary metrics and category aggregation.
"""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import (
    LearnerMistakePattern,
    MistakeCategory,
    MistakeEvidence,
    MistakeSeverity,
    MistakeStatus,
)
from .services import MistakeGenomeService

User = get_user_model()


class MistakeGenomeServiceTests(TestCase):
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
        self.service = MistakeGenomeService()

    def test_single_mistake_is_occasional_not_permanent_dna(self):
        pattern, evidence = self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.third_person_s",
            category=MistakeCategory.GRAMMAR,
            title_fa="تطابق سوم‌شخص",
            title_en="Third-Person Agreement",
            raw_snippet="She go to university",
            correction_snippet="She goes to university",
        )

        self.assertEqual(pattern.evidence_count, 1)
        self.assertEqual(pattern.status, MistakeStatus.OCCASIONAL)
        self.assertFalse(pattern.is_recurring)
        self.assertEqual(evidence.pattern, pattern)

    def test_multiple_evidence_events_promote_to_recurring(self):
        # 1st event
        p1, _ = self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.third_person_s",
            category=MistakeCategory.GRAMMAR,
            raw_snippet="He want a glass of water",
            correction_snippet="He wants a glass of water",
        )
        self.assertEqual(p1.status, MistakeStatus.OCCASIONAL)

        # 2nd event (meets EVIDENCE_RECURRING_THRESHOLD = 2)
        p2, _ = self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.third_person_s",
            category=MistakeCategory.GRAMMAR,
            raw_snippet="My brother work in Shiraz",
            correction_snippet="My brother works in Shiraz",
        )
        self.assertEqual(p2.evidence_count, 2)
        self.assertEqual(p2.status, MistakeStatus.RECURRING)
        self.assertTrue(p2.is_recurring)

    def test_disputed_pattern_strictly_excluded_from_recommendations(self):
        # Create a recurring pattern
        for snippet in ["She make a mistake", "We make progress"]:
            self.service.record_mistake(
                learner=self.learner_a,
                tag="collocation.make_vs_do",
                category=MistakeCategory.COLLOCATION,
                raw_snippet=snippet,
                correction_snippet="...",
            )

        # Before dispute, it should be in top targets
        targets_before = self.service.get_top_practice_targets(self.learner_a)
        self.assertTrue(any(t.tag == "collocation.make_vs_do" for t in targets_before))

        # Learner disputes pattern (e.g. accidental typo)
        pattern = LearnerMistakePattern.objects.get(
            learner=self.learner_a, tag="collocation.make_vs_do"
        )
        disputed = self.service.dispute_pattern(
            self.learner_a, pattern.id, reason="اشتباه تایپی لحظه‌ای بود، نه ناآگاهی"
        )
        self.assertTrue(disputed.is_disputed)
        self.assertEqual(disputed.status, MistakeStatus.DISPUTED)

        # Acceptance check: corrected disputes stop recommendations
        targets_after = self.service.get_top_practice_targets(self.learner_a)
        self.assertFalse(any(t.tag == "collocation.make_vs_do" for t in targets_after))

    def test_resolve_pattern_marks_mastered(self):
        pattern, _ = self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.conditionals",
            category=MistakeCategory.GRAMMAR,
        )
        resolved = self.service.resolve_pattern(self.learner_a, pattern.id)
        self.assertEqual(resolved.status, MistakeStatus.MASTERED)

        # Mastered patterns are excluded from active practice targets
        targets = self.service.get_top_practice_targets(self.learner_a)
        self.assertFalse(any(t.tag == "grammar.conditionals" for t in targets))

    def test_delete_evidence_scrubs_personal_text(self):
        pattern, evidence = self.service.record_mistake(
            learner=self.learner_a,
            tag="writing.comma_splice",
            category=MistakeCategory.DISCOURSE,
            raw_snippet="Personal embarrassing draft text about private life, it happened yesterday",
            correction_snippet="...",
        )
        success = self.service.delete_evidence(self.learner_a, evidence.id)
        self.assertTrue(success)

        evidence.refresh_from_db()
        self.assertTrue(evidence.is_scrubbed)
        self.assertNotIn("Personal embarrassing", evidence.raw_mistake_snippet)
        self.assertIn("حذف‌شده", evidence.raw_mistake_snippet)

    def test_learner_summary_statistics(self):
        self.service.record_mistake(
            learner=self.learner_a,
            tag="spelling.double_letters",
            category=MistakeCategory.SPELLING,
        )
        summary = self.service.get_learner_genome_summary(self.learner_a)
        self.assertGreaterEqual(summary["total_patterns"], 1)
        self.assertIn("category_distribution", summary)
        self.assertIn("spelling", summary["category_distribution"])


class MistakeGenomeAPITests(TestCase):
    def setUp(self):
        self.learner_a = User.objects.create_user(
            email="api_learner_a@endoora.test",
            password="testpassword123",
            role="learner",
        )
        self.learner_b = User.objects.create_user(
            email="api_learner_b@endoora.test",
            password="testpassword123",
            role="learner",
        )
        self.api = APIClient()
        self.service = MistakeGenomeService()

    def test_unauthenticated_access_denied(self):
        res = self.api.get("/api/mistakes/summary/")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_summary_and_pattern_list_flow(self):
        self.api.force_authenticate(user=self.learner_a)

        # Record two events for a pattern
        self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.past_simple",
            category=MistakeCategory.GRAMMAR,
            title_fa="گذشته ساده",
            title_en="Past Simple",
        )
        self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.past_simple",
            category=MistakeCategory.GRAMMAR,
        )

        # Check summary endpoint
        sum_res = self.api.get("/api/mistakes/summary/")
        self.assertEqual(sum_res.status_code, status.HTTP_200_OK)
        self.assertEqual(sum_res.data["recurring_count"], 1)

        # Check pattern list endpoint
        list_res = self.api.get("/api/mistakes/patterns/?category=grammar")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]["tag"], "grammar.past_simple")

    def test_dispute_api_endpoint(self):
        self.api.force_authenticate(user=self.learner_a)
        pattern, _ = self.service.record_mistake(
            learner=self.learner_a,
            tag="vocab.false_friends",
            category=MistakeCategory.LEXICAL,
        )

        res = self.api.post(
            f"/api/mistakes/patterns/{pattern.id}/dispute/",
            {"reason": "من این کلمه را عمداً استفاده کردم"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["is_disputed"])
        self.assertEqual(res.data["status"], "disputed")

    def test_learner_isolation_prevents_unauthorized_access(self):
        pattern_a, _ = self.service.record_mistake(
            learner=self.learner_a,
            tag="grammar.prepositions",
            category=MistakeCategory.GRAMMAR,
        )

        # Learner B attempts to view or dispute Learner A's pattern
        self.api.force_authenticate(user=self.learner_b)
        get_res = self.api.get(f"/api/mistakes/patterns/{pattern_a.id}/")
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)

        dispute_res = self.api.post(
            f"/api/mistakes/patterns/{pattern_a.id}/dispute/",
            {"reason": "Intrusion attempt"},
            format="json",
        )
        self.assertEqual(dispute_res.status_code, status.HTTP_404_NOT_FOUND)
