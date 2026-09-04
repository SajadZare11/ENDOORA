from datetime import timedelta
import uuid

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from placement.models import PlacementAnswer, PlacementSession


User = get_user_model()


class LearningPathEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.learner_a = User.objects.create_user(
            email="learner_a@example.com",
            password="StrongTestPassword123!",
            role="learner",
        )
        self.learner_b = User.objects.create_user(
            email="learner_b@example.com",
            password="StrongTestPassword123!",
            role="learner",
        )

    def test_anonymous_cannot_access_learning_path(self):
        response = self.client.get("/api/learner-twin/path/")
        self.assertEqual(response.status_code, 401)

        response_alt = self.client.get("/api/path/path/")
        self.assertEqual(response_alt.status_code, 401)

    def test_unplaced_learner_receives_honest_onboarding_path(self):
        self.client.force_login(self.learner_a)
        response = self.client.get("/api/learner-twin/path/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertFalse(data["placement_completed"])
        self.assertIsNone(data["estimated_cefr_level"])
        self.assertIsNone(data["overall_percentage"])
        self.assertEqual(data["next_best_step"], "start_placement")
        self.assertEqual(data["next_best_step_href"], "/placement")
        self.assertIn("شروع", data["next_best_step_fa"])
        self.assertEqual(len(data["focus_areas"]), 0)
        self.assertEqual(len(data["section_scores"]), 0)

        # Timeline structure verification
        timeline = data["timeline"]
        self.assertGreaterEqual(len(timeline), 4)
        self.assertEqual(timeline[0]["id"], "placement")
        self.assertEqual(timeline[0]["status"], "current")
        self.assertEqual(timeline[1]["status"], "locked")

        # Honest educational limitations check (Product Constitution Rule #8)
        self.assertGreater(len(data["limitations_fa"]), 0)
        self.assertTrue(any("تعیین سطح" in lim for lim in data["limitations_fa"]))

    def test_placed_learner_receives_evidence_grounded_path(self):
        # Create a submitted placement session
        now = timezone.now()
        session = PlacementSession.objects.create(
            user=self.learner_a,
            status=PlacementSession.Status.SUBMITTED,
            current_section="complete",
            expires_at=now + timedelta(days=1),
        )

        answers = {
            # Grammar: 4 items (3 correct, 1 wrong) -> 75%
            "grammar-a1-001": "am",
            "grammar-a2-001": "saw",
            "grammar-b1-001": "had left",
            "grammar-b2-001": "went",  # wrong (expected had gone)
            # Vocabulary: 4 items (4 correct) -> 100%
            "vocab-a1-001": "book",
            "vocab-a2-001": "recipe",
            "vocab-b1-001": "relieved",
            "vocab-b2-001": "ubiquitous",
            # Reading: 3 items (2 correct, 1 wrong) -> ~66.67%
            "reading-a2-001": "8:30 am",
            "reading-b1-001": "To learn new skills and meet people",
            "reading-b2-001": "low",  # wrong
            # Listening: 4 items (3 correct, 1 wrong) -> 75%
            "listening-a1-001": "Platform 3",
            "listening-a2-001": "At a bookshop",
            "listening-b1-001": "He prefers public transport",
            "listening-b2-001": "wrong",  # wrong
            # Speaking: 4 items with spoken transcripts
            "speaking-a1-001": {"spoken_text": "Hello my name is Alex and I enjoy reading books and swimming every weekend."},
            "speaking-a2-001": {"spoken_text": "On Sunday mornings I wake up early and prepare coffee and read news."},
            "speaking-b1-001": {"spoken_text": "I traveled to the mountains last summer and it was a truly unforgettable trip."},
            "speaking-b2-001": {"spoken_text": "Remote work increases flexibility but requires strong communication and team discipline."},
            # Writing: 4 items with written text (A1 sufficient, A2 sufficient, B1 short, B2 short -> writing is lower)
            "writing-a1-001": {"written_text": "Hi friend, I am on vacation in Spain. The weather is wonderful and sunny. See you next week!"},
            "writing-a2-001": {"written_text": "Last week we celebrated my sister birthday party. We cooked delicious food, played board games, and ate chocolate cake."},
            "writing-b1-001": {"written_text": "Public transit is good."},  # Very short -> lower score
            "writing-b2-001": {"written_text": "Remote work report."},      # Very short -> lower score
        }

        for q_key, ans_val in answers.items():
            PlacementAnswer.objects.create(
                session=session,
                idempotency_key=uuid.uuid4(),
                question_key=q_key,
                answer_value=ans_val if isinstance(ans_val, dict) else {"selected_option": ans_val},
            )

        self.client.force_login(self.learner_a)
        response = self.client.get("/api/learner-twin/path/")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertTrue(data["placement_completed"])
        self.assertIsNotNone(data["estimated_cefr_level"])
        self.assertIsNotNone(data["overall_percentage"])
        self.assertIn(data["estimated_cefr_level"], ["A1", "A2", "B1", "B2", "C1"])

        # Section scores validation
        section_scores = {s["section"]: s for s in data["section_scores"]}
        self.assertEqual(len(section_scores), 6)
        self.assertIn("grammar", section_scores)
        self.assertIn("vocabulary", section_scores)
        self.assertIn("reading", section_scores)
        self.assertIn("listening", section_scores)
        self.assertIn("speaking", section_scores)
        self.assertIn("writing", section_scores)

        # Focus areas check
        focus_areas = data["focus_areas"]
        self.assertEqual(len(focus_areas), 6)
        # First focus area must be lowest scoring (priority="high")
        self.assertEqual(focus_areas[0]["priority"], "high")
        self.assertLessEqual(focus_areas[0]["score_percentage"], focus_areas[-1]["score_percentage"])

        # Next best step derivation
        self.assertIn("next_best_step", data)
        self.assertIn("next_best_step_href", data)

        # Timeline check: Phase 1 complete, Phase 2 current
        timeline = data["timeline"]
        self.assertEqual(timeline[0]["id"], "placement")
        self.assertEqual(timeline[0]["status"], "complete")
        self.assertIn(str(session.id), timeline[0]["evidence"][0])

        self.assertEqual(timeline[1]["id"], "core_reinforcement")
        self.assertEqual(timeline[1]["status"], "current")

        # Honest educational notice check (Rule #8)
        self.assertTrue(any("CEFR" in lim for lim in data["limitations_fa"]))
        self.assertTrue(any("CEFR" in lim for lim in data["limitations_en"]))

    def test_user_isolation_for_learning_path(self):
        now = timezone.now()
        session_a = PlacementSession.objects.create(
            user=self.learner_a,
            status=PlacementSession.Status.SUBMITTED,
            current_section="complete",
            expires_at=now + timedelta(days=1),
        )
        PlacementAnswer.objects.create(
            session=session_a,
            idempotency_key=uuid.uuid4(),
            question_key="vocab-a1-001",
            answer_value={"selected_option": "book"},
        )

        # Learner B has NO placement session
        self.client.force_login(self.learner_b)
        response_b = self.client.get("/api/learner-twin/path/")
        self.assertEqual(response_b.status_code, 200)
        self.assertFalse(response_b.data["placement_completed"])
        self.assertIsNone(response_b.data["estimated_cefr_level"])
        self.assertEqual(response_b.data["next_best_step"], "start_placement")
