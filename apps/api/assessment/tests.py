import uuid
from io import StringIO
from django.core.management import call_command
from django.test import TestCase

from assessment.services import (
    PlacementSectionResult,
    calculate_section_result,
    evaluate_placement_answers,
    item_key_to_uuid,
    normalize_answer,
)


class AssessmentServicesTests(TestCase):
    def test_item_key_to_uuid_is_deterministic(self):
        uid1 = item_key_to_uuid("grammar-a1-001")
        uid2 = item_key_to_uuid("grammar-a1-001")
        self.assertEqual(uid1, uid2)
        self.assertIsInstance(uid1, uuid.UUID)

        # Existing valid UUID string passes through
        raw_uuid = str(uuid.uuid4())
        self.assertEqual(str(item_key_to_uuid(raw_uuid)), raw_uuid)

    def test_normalize_answer(self):
        self.assertEqual(normalize_answer("  Goes "), "goes")
        self.assertEqual(normalize_answer({"selected_option": "Travel "}), "travel")
        self.assertEqual(normalize_answer(None), "")

    def test_calculate_section_result(self):
        answers = [
            {"is_correct": True, "objective": "grammar.present_simple"},
            {"is_correct": False, "objective": "grammar.past_simple"},
            {"is_correct": True, "objective": "grammar.present_simple"},
        ]
        res = calculate_section_result("grammar", answers, total=4)
        self.assertEqual(res.section, "grammar")
        self.assertEqual(res.answered, 3)
        self.assertEqual(res.total, 4)
        self.assertEqual(res.correct, 2)
        self.assertEqual(res.score_percentage, 50.0)
        self.assertEqual(res.objectives_covered, ["grammar.past_simple", "grammar.present_simple"])

    def test_evaluate_placement_answers_all_sections(self):
        items = [
            {
                "id": "grammar-a1-001",
                "section": "grammar",
                "difficulty": "easy",
                "cefr_level": "A1",
                "objective": "grammar.present_simple",
                "correct_option": "goes",
            },
            {
                "id": "grammar-a2-001",
                "section": "grammar",
                "difficulty": "easy",
                "cefr_level": "A2",
                "objective": "grammar.past_simple",
                "correct_option": "went",
            },
            {
                "id": "vocab-a1-001",
                "section": "vocabulary",
                "difficulty": "easy",
                "cefr_level": "A1",
                "objective": "vocabulary.daily_routine",
                "correct_option": "library",
            },
            {
                "id": "reading-a1-001",
                "section": "reading",
                "difficulty": "medium",
                "cefr_level": "A1",
                "objective": "reading.main_idea",
                "correct_option": "Travel",
            },
        ]
        learner_answers = {
            "grammar-a1-001": "goes",
            "grammar-a2-001": "go",  # wrong
            "vocab-a1-001": "library",
            # reading not answered
        }

        eval_result = evaluate_placement_answers(items, learner_answers)
        self.assertEqual(eval_result["total_questions"], 4)
        self.assertEqual(eval_result["total_answered"], 3)
        self.assertEqual(eval_result["total_correct"], 2)
        self.assertEqual(eval_result["overall_percentage"], 50.0)

        # Evidence records
        self.assertEqual(len(eval_result["evidence"]), 4)

        # Grammar section checks
        grammar_sec = eval_result["sections"]["grammar"]
        self.assertEqual(grammar_sec["total"], 2)
        self.assertEqual(grammar_sec["answered"], 2)
        self.assertEqual(grammar_sec["correct"], 1)
        self.assertEqual(grammar_sec["score_percentage"], 50.0)

        # Notice does not make premature CEFR claims
        self.assertIn("مدرک رسمی یا نهایی CEFR محسوب نمی‌شود", eval_result["notice"])

    def test_evaluate_listening_placement_section(self):
        items = [
            {
                "id": "listening-a1-001",
                "section": "listening",
                "difficulty": "easy",
                "cefr_level": "A1",
                "objective": "listening.gist",
                "audio_url": "/audio/placement/listening-a1-001.wav",
                "play_limit": 2,
                "correct_option": "A train departure delay",
            },
            {
                "id": "listening-a2-001",
                "section": "listening",
                "difficulty": "easy",
                "cefr_level": "A2",
                "objective": "listening.detail",
                "audio_url": "/audio/placement/listening-a2-001.wav",
                "play_limit": 2,
                "correct_option": "9:30 AM",
            },
        ]
        learner_answers = {
            "listening-a1-001": "A train departure delay",
            "listening-a2-001": "10:00 AM",  # wrong
        }
        eval_result = evaluate_placement_answers(items, learner_answers)
        self.assertIn("listening", eval_result["sections"])
        lis_sec = eval_result["sections"]["listening"]
        self.assertEqual(lis_sec["total"], 2)
        self.assertEqual(lis_sec["answered"], 2)
        self.assertEqual(lis_sec["correct"], 1)
        self.assertEqual(lis_sec["score_percentage"], 50.0)
        self.assertIn("شنیداری", eval_result["notice"])

    def test_evaluate_speaking_placement_section(self):
        item = {
            "id": "speaking-a1-001",
            "section": "speaking",
            "difficulty": "easy",
            "cefr_level": "A1",
            "objective": "speaking.self_intro",
            "min_words": 10,
            "target_keywords": ["name", "live", "like", "hobby", "from"],
            "rubric": "Can introduce oneself with basic personal details.",
        }
        # 1. Good response with sufficient words and keywords
        good_response = {
            "spoken_text": "Hello, my name is Sara and I live in Tehran. I like reading books as a hobby.",
            "duration_sec": 18.5,
        }
        eval_good = evaluate_placement_answers([item], {"speaking-a1-001": good_response})
        self.assertIn("speaking", eval_good["sections"])
        spk_sec = eval_good["sections"]["speaking"]
        self.assertEqual(spk_sec["total"], 1)
        self.assertEqual(spk_sec["answered"], 1)
        self.assertEqual(spk_sec["correct"], 1)
        self.assertGreaterEqual(spk_sec["score_percentage"], 80.0)
        self.assertIn("گفتاری", eval_good["notice"])

        # 2. Insufficient response (too few words)
        short_response = {"spoken_text": "Hi Sara"}
        eval_short = evaluate_placement_answers([item], {"speaking-a1-001": short_response})
        spk_short_sec = eval_short["sections"]["speaking"]
        self.assertEqual(spk_short_sec["correct"], 0)
        self.assertLess(spk_short_sec["score_percentage"], 50.0)

    def test_cefr_estimate_mapping_and_five_sections(self):
        items = [
            {"id": "g-1", "section": "grammar", "correct_option": "a"},
            {"id": "v-1", "section": "vocabulary", "correct_option": "b"},
            {"id": "r-1", "section": "reading", "correct_option": "c"},
            {"id": "l-1", "section": "listening", "correct_option": "d"},
            {
                "id": "s-1",
                "section": "speaking",
                "min_words": 10,
                "target_keywords": ["work", "office", "remote"],
            },
        ]
        # Answer all correctly
        answers = {
            "g-1": "a",
            "v-1": "b",
            "r-1": "c",
            "l-1": "d",
            "s-1": {
                "spoken_text": "I really enjoy remote work because it gives me flexibility away from the office environment.",
            },
        }
        res = evaluate_placement_answers(items, answers)
        self.assertEqual(len(res["sections"]), 5)
        self.assertEqual(res["estimated_cefr_level"], "C1")
        self.assertGreaterEqual(res["overall_percentage"], 90.0)

    def test_evaluate_writing_response(self):
        item = {
            "id": "writing-a1-001",
            "section": "writing",
            "difficulty": "easy",
            "cefr_level": "A1",
            "objective": "writing.self_intro",
            "min_words": 15,
            "target_keywords": ["name", "live", "like", "free", "time"],
            "rubric": "Can write simple personal introduction.",
        }
        # 1. Good response with sufficient words, structure, and keywords
        good_response = {
            "written_text": "Hello, my name is Sara and I live in Tehran. In my free time, I really like reading books.",
        }
        eval_good = evaluate_placement_answers([item], {"writing-a1-001": good_response})
        self.assertIn("writing", eval_good["sections"])
        wrt_sec = eval_good["sections"]["writing"]
        self.assertEqual(wrt_sec["total"], 1)
        self.assertEqual(wrt_sec["answered"], 1)
        self.assertEqual(wrt_sec["correct"], 1)
        self.assertGreaterEqual(wrt_sec["score_percentage"], 80.0)
        self.assertIn("نگارش", eval_good["notice"])

        # 2. Insufficient response (too few words)
        short_response = {"written_text": "Hello Sara"}
        eval_short = evaluate_placement_answers([item], {"writing-a1-001": short_response})
        wrt_short_sec = eval_short["sections"]["writing"]
        self.assertEqual(wrt_short_sec["correct"], 0)
        self.assertLess(wrt_short_sec["score_percentage"], 50.0)

    def test_cefr_estimate_mapping_and_six_sections(self):
        items = [
            {"id": "g-1", "section": "grammar", "correct_option": "a"},
            {"id": "v-1", "section": "vocabulary", "correct_option": "b"},
            {"id": "r-1", "section": "reading", "correct_option": "c"},
            {"id": "l-1", "section": "listening", "correct_option": "d"},
            {
                "id": "s-1",
                "section": "speaking",
                "min_words": 10,
                "target_keywords": ["work", "office", "remote"],
            },
            {
                "id": "w-1",
                "section": "writing",
                "min_words": 15,
                "target_keywords": ["technology", "school", "digital"],
            },
        ]
        # Answer all correctly
        answers = {
            "g-1": "a",
            "v-1": "b",
            "r-1": "c",
            "l-1": "d",
            "s-1": {
                "spoken_text": "I really enjoy remote work because it gives me flexibility away from the office environment.",
            },
            "w-1": {
                "written_text": "Modern schools are increasingly adopting digital technology to enhance classroom interaction and learning efficiency across subjects.",
            },
        }
        res = evaluate_placement_answers(items, answers)
        self.assertEqual(len(res["sections"]), 6)
        self.assertEqual(res["estimated_cefr_level"], "C1")
        self.assertGreaterEqual(res["overall_percentage"], 90.0)

    def test_seed_placement_sections_command(self):
        out = StringIO()
        call_command("seed_placement_sections", stdout=out)
        output = out.getvalue()
        self.assertIn("Validated 23 placement items across sections", output)
        self.assertIn("grammar: 4", output)
        self.assertIn("vocabulary: 4", output)
        self.assertIn("reading: 3", output)
        self.assertIn("listening: 4", output)
        self.assertIn("speaking: 4", output)
        self.assertIn("writing: 4", output)
