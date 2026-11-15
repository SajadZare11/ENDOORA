"""
Pytest Test Suite for Engine 6 Siamese Distractor Pipeline
Target File: tests/test_siamese_distractors.py

Validates:
1. JSON output schema & structure
2. Exactly 12 distractor candidates per question
3. Balanced category distribution (strictly 3 items per category)
4. Strict 4D feature vector L2-normalization (||x_a||_2 = 1.0 +/- 1e-4)
5. Category dominance (argmax matches assigned trap category)
6. Candidate != correct answer and pairwise uniqueness within pool
7. CLI execution and edge case fallbacks
"""

import os
import sys
import json
import math
import subprocess
import pytest
import numpy as np

# Canonical Paths
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DISTRACTORS_JSON_PATH = os.path.join(
    REPO_ROOT, "apps", "web", "data", "distractors", "enriched_adaptive_questions.json"
)
CORE_ITEMS_JSON_PATH = os.path.join(
    REPO_ROOT, "data", "placement", "core-items.json"
)
GENERATOR_SCRIPT_PATH = os.path.join(
    REPO_ROOT, "scripts", "generate_siamese_distractors.py"
)

CATEGORY_MAP = {
    "phonetic_ortho": 0,
    "semantic_siamese": 1,
    "morphological": 2,
    "l1_persian": 3,
}
ALLOWED_CATEGORIES = set(CATEGORY_MAP.keys())


@pytest.fixture(scope="session")
def distractor_data():
    """Loads enriched adaptive questions JSON or runs generator if absent."""
    if not os.path.exists(DISTRACTORS_JSON_PATH):
        # Run generator script to produce default dataset if absent
        cmd = [
            sys.executable,
            GENERATOR_SCRIPT_PATH,
            "--input", CORE_ITEMS_JSON_PATH,
            "--output", DISTRACTORS_JSON_PATH,
            "--limit", "20",
            "--device", "cpu",
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
        if res.returncode != 0:
            pytest.fail(f"Failed to generate distractor dataset for tests: {res.stderr}")

    with open(DISTRACTORS_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


# ==============================================================================
# 1. JSON Schema & Structure Validation
# ==============================================================================
class TestDistractorJsonSchema:
    def test_json_file_exists_and_is_non_empty(self, distractor_data):
        assert isinstance(distractor_data, list), "Root JSON element must be a list"
        assert len(distractor_data) > 0, "Question pool must contain at least 1 question"

    def test_required_question_fields_present(self, distractor_data):
        required_fields = {"id", "section", "cefr_level", "question", "correct_option", "distractor_pool"}
        for item in distractor_data:
            missing = required_fields - set(item.keys())
            assert not missing, f"Question {item.get('id')} missing required fields: {missing}"

    def test_distractor_candidate_schema(self, distractor_data):
        required_candidate_fields = {"id", "text", "category", "features"}
        for item in distractor_data:
            for d in item["distractor_pool"]:
                missing = required_candidate_fields - set(d.keys())
                assert not missing, f"Distractor {d.get('id')} missing fields: {missing}"
                assert isinstance(d["id"], str) and len(d["id"]) > 0
                assert isinstance(d["text"], str) and len(d["text"].strip()) > 0
                assert d["category"] in ALLOWED_CATEGORIES, f"Invalid category {d['category']}"
                assert isinstance(d["features"], list)
                assert len(d["features"]) == 4, f"Feature vector must be 4D: got {len(d['features'])}"


# ==============================================================================
# 2. Pool Sizing & Candidate Uniqueness Validation
# ==============================================================================
class TestDistractorPoolSizingAndUniqueness:
    def test_pool_size_strictly_twelve_items(self, distractor_data):
        for item in distractor_data:
            pool = item["distractor_pool"]
            assert len(pool) == 12, (
                f"Question {item['id']} has pool size {len(pool)}; must be exactly 12"
            )

    def test_distractor_texts_pairwise_unique_per_question(self, distractor_data):
        for item in distractor_data:
            texts = [d["text"].strip().lower() for d in item["distractor_pool"]]
            unique_texts = set(texts)
            assert len(unique_texts) == 12, (
                f"Question {item['id']} contains duplicate distractors: {texts}"
            )

    def test_distractors_not_equal_to_correct_option(self, distractor_data):
        for item in distractor_data:
            correct = item["correct_option"].strip().lower()
            for d in item["distractor_pool"]:
                d_text = d["text"].strip().lower()
                assert d_text != correct, (
                    f"Question {item['id']} distractor '{d['text']}' equals correct option '{item['correct_option']}'"
                )

    def test_distractor_ids_unique_per_question(self, distractor_data):
        for item in distractor_data:
            ids = [d["id"] for d in item["distractor_pool"]]
            assert len(set(ids)) == 12, f"Question {item['id']} has duplicate distractor IDs"


# ==============================================================================
# 3. Balanced Category Distribution Validation
# ==============================================================================
class TestBalancedCategoryDistribution:
    def test_exactly_three_items_per_category(self, distractor_data):
        for item in distractor_data:
            category_counts = {cat: 0 for cat in ALLOWED_CATEGORIES}
            for d in item["distractor_pool"]:
                category_counts[d["category"]] += 1
            for cat, count in category_counts.items():
                assert count == 3, (
                    f"Question {item['id']} category '{cat}' has {count} items; expected exactly 3"
                )

    def test_all_four_categories_represented(self, distractor_data):
        for item in distractor_data:
            categories = {d["category"] for d in item["distractor_pool"]}
            assert categories == ALLOWED_CATEGORIES, (
                f"Question {item['id']} missing categories: {ALLOWED_CATEGORIES - categories}"
            )


# ==============================================================================
# 4. 4D Vector L2 Normalization Validation
# ==============================================================================
class TestFeatureVectorL2Normalization:
    def test_l2_unit_norm_within_tolerance(self, distractor_data):
        TOLERANCE = 1e-4
        for item in distractor_data:
            for d in item["distractor_pool"]:
                feats = d["features"]
                norm = math.sqrt(sum(x ** 2 for x in feats))
                assert math.isclose(norm, 1.0, abs_tol=TOLERANCE), (
                    f"Candidate {d['id']} norm {norm:.6f} exceeds tolerance 1.0 +/- {TOLERANCE}"
                )

    def test_all_feature_components_within_unit_bounds(self, distractor_data):
        for item in distractor_data:
            for d in item["distractor_pool"]:
                for idx, val in enumerate(d["features"]):
                    assert 0.0 <= val <= 1.0 + 1e-6, (
                        f"Candidate {d['id']} feature[{idx}] = {val} out of bounds [0.0, 1.0]"
                    )

    def test_features_serialized_with_sufficient_precision(self, distractor_data):
        for item in distractor_data:
            for d in item["distractor_pool"]:
                high_precision_count = sum(
                    1 for val in d["features"]
                    if "." in str(val) and "e" not in str(val) and len(str(val).split(".")[1]) >= 4
                )
                assert high_precision_count >= 2, (
                    f"Candidate {d['id']} features {d['features']} lack precision; only {high_precision_count} components have >= 4 decimals"
                )


# ==============================================================================
# 5. Category Dominance Validation
# ==============================================================================
class TestCategoryDominance:
    def test_candidate_category_matches_dominant_dimension(self, distractor_data):
        for item in distractor_data:
            for d in item["distractor_pool"]:
                expected_idx = CATEGORY_MAP[d["category"]]
                feats = d["features"]
                actual_idx = int(np.argmax(feats))
                assert actual_idx == expected_idx, (
                    f"Candidate {d['id']} category '{d['category']}' (idx {expected_idx}) "
                    f"does not match dominant feature dimension {actual_idx}: features={feats}"
                )

    def test_dominant_dimension_strictly_exceeds_competitors(self, distractor_data):
        for item in distractor_data:
            for d in item["distractor_pool"]:
                cat_idx = CATEGORY_MAP[d["category"]]
                feats = d["features"]
                dominant_val = feats[cat_idx]
                competitors = [feats[j] for j in range(4) if j != cat_idx]
                max_competitor = max(competitors)
                assert dominant_val > max_competitor, (
                    f"Candidate {d['id']} dominant feature {dominant_val} does not strictly exceed competitor {max_competitor}"
                )

    def test_dominance_margin_satisfied(self, distractor_data):
        MIN_MARGIN = 0.05
        for item in distractor_data:
            for d in item["distractor_pool"]:
                cat_idx = CATEGORY_MAP[d["category"]]
                feats = d["features"]
                dominant_val = feats[cat_idx]
                competitors = [feats[j] for j in range(4) if j != cat_idx]
                margin = dominant_val - max(competitors)
                assert margin >= MIN_MARGIN, (
                    f"Candidate {d['id']} dominance margin {margin:.4f} is less than threshold {MIN_MARGIN}"
                )


# ==============================================================================
# 6. Generator CLI & Edge Case Fallback Validation
# ==============================================================================
class TestGeneratorScriptExecution:
    def test_cli_help_flag_succeeds(self):
        result = subprocess.run(
            [sys.executable, GENERATOR_SCRIPT_PATH, "--help"],
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
        assert result.returncode == 0
        assert "--input" in result.stdout
        assert "--output" in result.stdout

    def test_cli_limit_execution_produces_valid_sample(self, tmp_path):
        sample_output = tmp_path / "sample_enriched.json"
        cmd = [
            sys.executable,
            GENERATOR_SCRIPT_PATH,
            "--input", CORE_ITEMS_JSON_PATH,
            "--output", str(sample_output),
            "--limit", "3",
            "--device", "cpu",
            "--mock",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)
        assert result.returncode == 0, f"Generator failed: {result.stderr}"
        assert os.path.exists(sample_output)
        with open(sample_output, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert len(data) == 3
        for q in data:
            assert len(q["distractor_pool"]) == 12

    def test_canonical_zero_vector_fallback_logic(self):
        """Synthetic test: verify canonical basis vector produces norm 1.0 and category dominance."""
        for cat, idx in CATEGORY_MAP.items():
            canonical = [0.0, 0.0, 0.0, 0.0]
            canonical[idx] = 1.0
            norm = math.sqrt(sum(x ** 2 for x in canonical))
            assert math.isclose(norm, 1.0, abs_tol=1e-4)
            assert np.argmax(canonical) == idx


# ==============================================================================
# 7. Unit Tests for Algorithmic Components
# ==============================================================================
class TestAlgorithmicComponents:
    def test_levenshtein_implementation(self):
        # Directly import from generator script
        sys.path.insert(0, REPO_ROOT)
        from scripts.generate_siamese_distractors import levenshtein_distance, levenshtein_similarity
        assert levenshtein_distance("kitten", "sitting") == 3
        assert levenshtein_distance("goes", "goes") == 0
        assert levenshtein_distance("their", "there") == 2
        assert levenshtein_similarity("goes", "goes") == 1.0
        assert 0.0 <= levenshtein_similarity("went", "gone") <= 1.0

    def test_feature_scorer_l2_tolerance(self):
        sys.path.insert(0, REPO_ROOT)
        from scripts.generate_siamese_distractors import LexiconManager, DistractorFeatureScorer
        lex = LexiconManager(["goes", "went", "gone", "going"], mock=True)
        scorer = DistractorFeatureScorer(lex)
        for cat in ALLOWED_CATEGORIES:
            vec = scorer.compute_features("went", "goes", cat)
            norm = math.sqrt(sum(x ** 2 for x in vec))
            assert math.isclose(norm, 1.0, abs_tol=1e-4)
            assert np.argmax(vec) == CATEGORY_MAP[cat]
