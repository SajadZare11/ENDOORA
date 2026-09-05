from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from mistake_genome.models import LearnerMistakePattern
from .models import WritingDraft, WritingAnalysis
from .services import WritingMentorService

User = get_user_model()


class WritingMentorTests(TestCase):
    def setUp(self):
        self.learner = User.objects.create_user(
            email="learner.writer@example.com",
            password="WriterSecurePass123!",
            role="learner",
        )
        self.other_learner = User.objects.create_user(
            email="other.writer@example.com",
            password="WriterSecurePass123!",
            role="learner",
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.learner)

    def test_prompt_library(self):
        prompts = WritingMentorService.get_prompts()
        self.assertTrue(len(prompts) >= 4)
        for p in prompts:
            self.assertIn("id", p)
            self.assertIn("level", p)
            self.assertIn("title_fa", p)
            self.assertIn("title_en", p)
            self.assertIn("min_words", p)

    def test_draft_creation_and_autosave(self):
        # 1. Create initial draft
        draft = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-b1-travel",
                "prompt_title": "B1: Memorable Journey Experience",
                "text": "Last year I traveled to Isfahan with my family. It was a wonderful journey.",
                "target_cefr": "B1",
            },
        )
        self.assertEqual(draft.version, 1)
        self.assertEqual(draft.status, "draft")
        self.assertEqual(draft.word_count, 14)

        # 2. Autosave update
        updated = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "text": "Last year I traveled to Isfahan with my family. It was a wonderful journey because the architecture was breathtaking.",
            },
            draft_id=draft.id,
        )
        self.assertEqual(updated.id, draft.id)
        self.assertEqual(updated.word_count, 19)

    def test_revision_chaining(self):
        parent = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-b2-opinion",
                "text": "First draft content with basic ideas.",
            },
        )
        revision = WritingMentorService.create_revision(
            learner=self.learner,
            parent_draft_id=parent.id,
            new_text="Second draft with expanded vocabulary and better transitions.",
        )
        self.assertEqual(revision.parent_draft, parent)
        self.assertEqual(revision.version, 2)
        self.assertEqual(revision.status, "draft")
        self.assertEqual(parent.revisions.count(), 1)

    def test_writing_analysis_score_ranges_and_disclaimer(self):
        draft = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-b2-opinion",
                "text": (
                    "Education is essential for every society. In modern times, technology plays an increasingly "
                    "vital role in classrooms. Some educators argue that tablets distract students, whereas others "
                    "believe they provide unprecedented access to knowledge. Consequently, integrating digital tools "
                    "with structured pedagogical guidance yields optimal learning outcomes."
                ),
            },
        )
        analysis = WritingMentorService.analyze_writing(
            learner=self.learner,
            draft_id=draft.id,
        )
        draft.refresh_from_db()
        self.assertEqual(draft.status, "analyzed")

        # Range check: Never a single exact score
        self.assertIn("–", analysis.estimated_cefr_range)
        self.assertIn("–", analysis.ielts_scores["overall_band_range"])
        self.assertIn("task_achievement", analysis.ielts_scores)
        self.assertIn("coherence_cohesion", analysis.ielts_scores)
        self.assertIn("lexical_resource", analysis.ielts_scores)
        self.assertIn("grammatical_accuracy", analysis.ielts_scores)

        # Product Constitution Rule #8 transparent disclaimers
        self.assertIn("قانون شماره ۸", analysis.disclaimer_fa)
        self.assertIn("Rule #8", analysis.disclaimer_en)

    def test_error_annotation_grammar_vs_style_separation(self):
        draft = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-b2-opinion",
                "text": (
                    "Today we want to discuss about education. Many students think it is a very good thing. "
                    "I am agree with them because research helps our mind."
                ),
            },
        )
        analysis = WritingMentorService.analyze_writing(
            learner=self.learner,
            draft_id=draft.id,
        )

        categories = [e["category"] for e in analysis.error_annotations]
        is_style = [e["is_style_only"] for e in analysis.error_annotations]

        # Must have grammar errors
        self.assertIn("grammar", categories)
        # Must have style suggestion
        self.assertIn("style", categories)
        # Verify grammar error is not marked as style only
        grammar_err = next(e for e in analysis.error_annotations if e["id"] == "err_prep_discuss")
        self.assertFalse(grammar_err["is_style_only"])
        # Verify style recommendation is marked as style only
        style_rec = next(e for e in analysis.error_annotations if e["id"] == "style_lexical_precision")
        self.assertTrue(style_rec["is_style_only"])

    def test_graduated_rewrites_labels_and_disclaimer(self):
        draft = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-a2-invitation",
                "text": "Hello friend. Please come to my house for lunch tomorrow.",
            },
        )
        analysis = WritingMentorService.analyze_writing(
            learner=self.learner,
            draft_id=draft.id,
        )

        rewrites = analysis.graduated_rewrites
        self.assertIn("a2", rewrites)
        self.assertIn("b2", rewrites)
        self.assertIn("c2", rewrites)
        # Must include voice preservation disclaimer
        self.assertIn("Not a replacement for your voice", rewrites["disclaimer_en"])
        self.assertIn("نه جایگزین صدای شما", rewrites["disclaimer_fa"])

    def test_selective_mistake_genome_ingestion_on_accept(self):
        draft = WritingMentorService.save_draft(
            learner=self.learner,
            data={
                "prompt_id": "prompt-b1-travel",
                "text": "We will discuss about this itinerary tomorrow morning.",
            },
        )
        WritingMentorService.analyze_writing(
            learner=self.learner,
            draft_id=draft.id,
        )

        # Before accepting: No mistake pattern in genome
        count_before = LearnerMistakePattern.objects.filter(
            learner=self.learner,
            tag="preposition_unnecessary",
        ).count()
        self.assertEqual(count_before, 0)

        # Accept the correction
        updated_err = WritingMentorService.accept_correction(
            learner=self.learner,
            draft_id=draft.id,
            error_id="err_prep_discuss",
        )
        self.assertTrue(updated_err["is_accepted"])

        # After accepting: Recorded into Mistake Genome
        pattern = LearnerMistakePattern.objects.get(
            learner=self.learner,
            tag="preposition_unnecessary",
        )
        self.assertEqual(pattern.category, "grammar")
        self.assertEqual(pattern.evidence_count, 1)

    def test_dismiss_correction_does_not_pollute_mistake_genome(self):
        draft = WritingMentorService.save_draft(
            learner=self.other_learner,
            data={
                "prompt_id": "prompt-b1-travel",
                "text": "I am agree with this suggestion.",
            },
        )
        WritingMentorService.analyze_writing(
            learner=self.other_learner,
            draft_id=draft.id,
        )

        # Dismiss the correction
        dismissed_err = WritingMentorService.dismiss_correction(
            learner=self.other_learner,
            draft_id=draft.id,
            error_id="err_agree_verb",
        )
        self.assertFalse(dismissed_err["is_accepted"])
        self.assertTrue(dismissed_err.get("is_dismissed"))

        # Verify Mistake Genome is completely untouched
        self.assertFalse(
            LearnerMistakePattern.objects.filter(
                learner=self.other_learner,
                tag="verb_form_confusion",
            ).exists()
        )

    def test_user_isolation(self):
        draft_a = WritingMentorService.save_draft(
            learner=self.learner,
            data={"text": "Private text from Learner A"},
        )
        # Learner B tries to access Learner A's draft
        client_b = APIClient()
        client_b.force_authenticate(user=self.other_learner)

        res = client_b.get(f"/api/writing/drafts/{draft_a.id}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        res_analyze = client_b.post(f"/api/writing/drafts/{draft_a.id}/analyze/")
        self.assertEqual(res_analyze.status_code, status.HTTP_404_NOT_FOUND)

    def test_api_endpoints_flow(self):
        # 1. Prompts endpoint
        res = self.client.get("/api/writing/prompts/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 4)

        # 2. Draft creation
        res = self.client.post("/api/writing/drafts/", {
            "prompt_id": "prompt-a1-intro",
            "prompt_title": "A1: Intro",
            "text": "My name is John. I live in Tehran. I like reading books every day.",
            "target_cefr": "A1",
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        draft_id = res.data["id"]

        # 3. Draft analyze
        res = self.client.post(f"/api/writing/drafts/{draft_id}/analyze/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("ielts_scores", res.data)
        self.assertIn("graduated_rewrites", res.data)
        self.assertIn("revision_tasks", res.data)

        # 4. Draft revise
        res = self.client.post(f"/api/writing/drafts/{draft_id}/revise/", {
            "text": "My name is John. I have been living in Tehran for 5 years.",
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["version"], 2)
