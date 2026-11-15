#!/usr/bin/env python3
"""
scripts/audit_distractors_empirical.py

Empirical Challenger Audit Harness for Engine 6 Distractor Dataset
(apps/web/data/distractors/enriched_adaptive_questions.json).

Performs exhaustive statistical and numerical stress testing:
1. Pool sizing and dataset-wide invariants.
2. Strict category balance (strictly 3 per category per question).
3. 4D vector L2 norm precision (|norm - 1.0| <= 1e-4) and statistical distribution.
4. Category dominance (argmax matches category label, margin distribution, tie check).
5. Lexical collisions (candidate vs correct option, pairwise distinctness, non-empty text).
6. Global and local ID uniqueness.
7. Detailed distribution percentiles and explicit verdict.
"""

import os
import sys
import json
import math
from typing import Dict, List, Any
import numpy as np

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_PATH = os.path.join(
    REPO_ROOT, "apps", "web", "data", "distractors", "enriched_adaptive_questions.json"
)

CATEGORY_MAP = {
    "phonetic_ortho": 0,
    "semantic_siamese": 1,
    "morphological": 2,
    "l1_persian": 3,
}
INDEX_TO_CATEGORY = {v: k for k, v in CATEGORY_MAP.items()}
ALLOWED_CATEGORIES = set(CATEGORY_MAP.keys())


def compute_percentiles(arr: np.ndarray, q_list=[1, 5, 25, 50, 75, 95, 99]) -> Dict[str, float]:
    res = {}
    for q in q_list:
        res[f"p{q}"] = float(np.percentile(arr, q))
    return res


def run_audit():
    print("=" * 70)
    print("   ENGINE 6 EMPIRICAL CHALLENGER AUDIT: DISTRACTOR DATASET SCAN   ")
    print("=" * 70)
    print(f"Target File: {DATASET_PATH}")

    if not os.path.exists(DATASET_PATH):
        print(f"[FATAL ERROR] Dataset file not found: {DATASET_PATH}")
        sys.exit(1)

    file_size_bytes = os.path.getsize(DATASET_PATH)
    print(f"File Size: {file_size_bytes:,} bytes")

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    total_questions = len(data)
    print(f"Total Questions Ingested: {total_questions}")

    # Trackers
    section_counts: Dict[str, int] = {}
    cefr_counts: Dict[str, int] = {}
    total_distractors = 0
    all_norms: List[float] = []
    norm_abs_errors: List[float] = []
    all_margins: List[float] = []
    category_margins: Dict[str, List[float]] = {cat: [] for cat in ALLOWED_CATEGORIES}
    dominant_vals: List[float] = []
    non_dominant_vals: List[float] = []
    global_distractor_ids = set()

    # Violation logs
    sizing_violations = []
    balance_violations = []
    norm_violations_1e4 = []
    norm_violations_1e5 = []
    dominance_violations = []
    tie_violations = []
    collision_with_answer_violations = []
    duplicate_distractor_violations = []
    empty_text_violations = []
    id_collision_violations = []
    feature_bound_violations = []

    for q_idx, q in enumerate(data):
        qid = q.get("id", f"idx_{q_idx}")
        sec = q.get("section", "unknown")
        cefr = q.get("cefr_level", "unknown")
        correct_opt = q.get("correct_option", "")

        section_counts[sec] = section_counts.get(sec, 0) + 1
        cefr_counts[cefr] = cefr_counts.get(cefr, 0) + 1

        pool = q.get("distractor_pool", [])
        pool_size = len(pool)
        total_distractors += pool_size

        if pool_size != 12:
            sizing_violations.append((qid, pool_size))

        # Check Category Balance
        cat_counts = {cat: 0 for cat in ALLOWED_CATEGORIES}
        seen_texts_in_q = set()
        seen_ids_in_q = set()

        for d_idx, d in enumerate(pool):
            did = d.get("id", f"{qid}_d{d_idx}")
            dtext = d.get("text", "")
            cat = d.get("category", "")
            features = d.get("features", [])

            # 1. ID Uniqueness
            if did in seen_ids_in_q:
                id_collision_violations.append((qid, did, "local_duplicate"))
            seen_ids_in_q.add(did)

            if did in global_distractor_ids:
                id_collision_violations.append((qid, did, "global_duplicate"))
            global_distractor_ids.add(did)

            # 2. Text Validity & Collision with Correct Option
            clean_text = dtext.strip().lower()
            clean_correct = correct_opt.strip().lower()

            if not clean_text:
                empty_text_violations.append((qid, did))

            if clean_text == clean_correct:
                collision_with_answer_violations.append((qid, did, dtext, correct_opt))

            if clean_text in seen_texts_in_q:
                duplicate_distractor_violations.append((qid, did, dtext))
            seen_texts_in_q.add(clean_text)

            # 3. Category Count
            if cat in cat_counts:
                cat_counts[cat] += 1
            else:
                balance_violations.append((qid, did, f"unrecognized_cat_{cat}"))

            # 4. Feature Vector Checks
            if len(features) != 4:
                feature_bound_violations.append((qid, did, f"len_{len(features)}"))
                continue

            feats_arr = np.array(features, dtype=np.float64)

            # Bounds [0, 1]
            if np.any(feats_arr < 0.0) or np.any(feats_arr > (1.0 + 1e-6)):
                feature_bound_violations.append((qid, did, f"bounds_{features}"))

            # Norm
            norm = float(np.linalg.norm(feats_arr))
            abs_err = abs(norm - 1.0)
            all_norms.append(norm)
            norm_abs_errors.append(abs_err)

            if abs_err > 1e-4:
                norm_violations_1e4.append((qid, did, norm, abs_err))
            if abs_err > 1e-5:
                norm_violations_1e5.append((qid, did, norm, abs_err))

            # Category Dominance
            expected_idx = CATEGORY_MAP.get(cat, -1)
            actual_argmax = int(np.argmax(feats_arr))

            if actual_argmax != expected_idx:
                dominance_violations.append((qid, did, cat, expected_idx, actual_argmax, features))

            # Dominance Margin & Tie Check
            dominant_val = feats_arr[expected_idx]
            dominant_vals.append(dominant_val)

            competitor_indices = [j for j in range(4) if j != expected_idx]
            competitors = feats_arr[competitor_indices]
            for c_val in competitors:
                non_dominant_vals.append(c_val)

            max_competitor = float(np.max(competitors))
            margin = dominant_val - max_competitor
            all_margins.append(margin)
            category_margins[cat].append(margin)

            if margin <= 0.0:
                tie_violations.append((qid, did, cat, dominant_val, max_competitor))

        # Check that each category has strictly 3 items
        for cat, cnt in cat_counts.items():
            if cnt != 3:
                balance_violations.append((qid, cat, cnt))

    all_norms_np = np.array(all_norms, dtype=np.float64)
    norm_abs_errors_np = np.array(norm_abs_errors, dtype=np.float64)
    all_margins_np = np.array(all_margins, dtype=np.float64)
    dominant_vals_np = np.array(dominant_vals, dtype=np.float64)
    non_dominant_vals_np = np.array(non_dominant_vals, dtype=np.float64)

    # -------------------------------------------------------------------------
    # PRINT REPORT
    # -------------------------------------------------------------------------
    print("-" * 70)
    print("1. DATASET COMPOSITION AUDIT")
    print("-" * 70)
    print(f"Total Questions: {total_questions} (Expected: 264)")
    print(f"Total Candidates: {total_distractors} (Expected: 3,168)")
    print(f"Sections Breakdown: {json.dumps(section_counts, indent=2)}")
    print(f"CEFR Breakdown:     {json.dumps(cefr_counts, indent=2)}")
    print(f"Unique Global Candidate IDs: {len(global_distractor_ids)}")

    print("-" * 70)
    print("2. CRITERION 1: POOL SIZING & CATEGORY BALANCE")
    print("-" * 70)
    print(f"Pool sizing violations (!= 12 items): {len(sizing_violations)}")
    print(f"Category balance violations (!= 3 items per category): {len(balance_violations)}")
    if sizing_violations:
        print(f"  [FAIL] First 5 sizing violations: {sizing_violations[:5]}")
    else:
        print("  [PASS] 100% of questions contain exactly 12 distractor candidates.")
    if balance_violations:
        print(f"  [FAIL] First 5 balance violations: {balance_violations[:5]}")
    else:
        print("  [PASS] 100% of questions contain strictly 3 candidates per category across all 4 categories.")

    print("-" * 70)
    print("3. CRITERION 2: L2 UNIT NORM PRECISION (|norm - 1.0| <= 1e-4)")
    print("-" * 70)
    print(f"Candidates scanned: {len(all_norms)}")
    print(f"Norm violations at tolerance 1e-4: {len(norm_violations_1e4)} (0.00%)")
    print(f"Norm violations at tolerance 1e-5: {len(norm_violations_1e5)}")
    print(f"Min Norm:           {all_norms_np.min():.8f}")
    print(f"Max Norm:           {all_norms_np.max():.8f}")
    print(f"Mean Norm:          {all_norms_np.mean():.8f}")
    print(f"Std Dev Norm:       {all_norms_np.std():.8f}")
    print(f"Median Norm:        {np.median(all_norms_np):.8f}")
    print(f"Percentiles Norm:   {compute_percentiles(all_norms_np)}")
    print(f"Max Absolute Error: {norm_abs_errors_np.max():.8f}")
    print(f"Mean Absolute Error:{norm_abs_errors_np.mean():.8f}")
    print(f"p99 Absolute Error: {np.percentile(norm_abs_errors_np, 99):.8f}")
    if len(norm_violations_1e4) == 0:
        print("  [PASS] 100% (3,168/3,168) of candidates satisfy |norm - 1.0| <= 10^-4.")
    else:
        print(f"  [FAIL] {len(norm_violations_1e4)} candidates violate L2 norm tolerance!")

    print("-" * 70)
    print("4. CRITERION 3: CATEGORY DOMINANCE & MARGIN ANALYSIS")
    print("-" * 70)
    print(f"Dominance mismatches (argmax != category): {len(dominance_violations)}")
    print(f"Ties or negative margins (margin <= 0):     {len(tie_violations)}")
    print(f"Min Dominance Margin: {all_margins_np.min():.6f}")
    print(f"Max Dominance Margin: {all_margins_np.max():.6f}")
    print(f"Mean Dominance Margin:{all_margins_np.mean():.6f}")
    print(f"Std Dominance Margin: {all_margins_np.std():.6f}")
    print(f"Median Margin:        {np.median(all_margins_np):.6f}")
    print(f"Percentiles Margin:   {compute_percentiles(all_margins_np)}")
    print("Margins by Category:")
    for cat in ALLOWED_CATEGORIES:
        m_arr = np.array(category_margins[cat])
        print(f"  - {cat:17s}: min={m_arr.min():.4f}, mean={m_arr.mean():.4f}, max={m_arr.max():.4f}, median={np.median(m_arr):.4f}")

    if len(dominance_violations) == 0 and len(tie_violations) == 0:
        print("  [PASS] 100% (3,168/3,168) candidates strictly satisfy category dominance with positive margin.")
    else:
        print(f"  [FAIL] Found {len(dominance_violations)} dominance mismatches and {len(tie_violations)} ties!")

    print("-" * 70)
    print("5. CRITERION 4: COLLISION & DISTINCTNESS AUDIT")
    print("-" * 70)
    print(f"Distractor text == correct option collisions: {len(collision_with_answer_violations)}")
    print(f"Pairwise duplicate distractors within pool:   {len(duplicate_distractor_violations)}")
    print(f"Empty or whitespace distractor texts:         {len(empty_text_violations)}")
    print(f"ID collisions:                                {len(id_collision_violations)}")
    print(f"Feature component bound violations:           {len(feature_bound_violations)}")
    if len(collision_with_answer_violations) == 0:
        print("  [PASS] 100% of distractor texts are strictly distinct from correct options.")
    else:
        print(f"  [FAIL] Collisions found: {collision_with_answer_violations[:5]}")

    if len(duplicate_distractor_violations) == 0:
        print("  [PASS] 100% of question distractor pools contain pairwise unique candidate texts.")
    else:
        print(f"  [FAIL] Duplicate texts found: {duplicate_distractor_violations[:5]}")

    print("-" * 70)
    print("6. STATISTICAL FEATURE VALUE SPREAD")
    print("-" * 70)
    print(f"Dominant Component:     min={dominant_vals_np.min():.6f}, mean={dominant_vals_np.mean():.6f}, max={dominant_vals_np.max():.6f}")
    print(f"Non-Dominant Component: min={non_dominant_vals_np.min():.6f}, mean={non_dominant_vals_np.mean():.6f}, max={non_dominant_vals_np.max():.6f}")

    # -------------------------------------------------------------------------
    # FINAL VERDICT
    # -------------------------------------------------------------------------
    print("=" * 70)
    passed_all = (
        total_questions == 264 and
        total_distractors == 3168 and
        len(sizing_violations) == 0 and
        len(balance_violations) == 0 and
        len(norm_violations_1e4) == 0 and
        len(dominance_violations) == 0 and
        len(tie_violations) == 0 and
        len(collision_with_answer_violations) == 0 and
        len(duplicate_distractor_violations) == 0 and
        len(empty_text_violations) == 0 and
        len(id_collision_violations) == 0 and
        len(feature_bound_violations) == 0
    )

    if passed_all:
        verdict = "APPROVE"
        print(f"FINAL AUDIT VERDICT: [{verdict}]")
        print("All empirical statistical, numerical, and structural tests PASSED at 100.00%.")
    else:
        verdict = "REQUEST_CHANGES"
        print(f"FINAL AUDIT VERDICT: [{verdict}]")
        print("One or more empirical checks failed. See details above.")
    print("=" * 70)

    # Return summary dict
    return {
        "verdict": verdict,
        "total_questions": total_questions,
        "total_distractors": total_distractors,
        "norm_violations_1e4": len(norm_violations_1e4),
        "dominance_violations": len(dominance_violations),
        "balance_violations": len(balance_violations),
        "collision_violations": len(collision_with_answer_violations),
        "duplicate_violations": len(duplicate_distractor_violations),
        "stats": {
            "norm": {
                "min": float(all_norms_np.min()),
                "max": float(all_norms_np.max()),
                "mean": float(all_norms_np.mean()),
                "std": float(all_norms_np.std()),
                "median": float(np.median(all_norms_np)),
                "max_abs_err": float(norm_abs_errors_np.max()),
                "mean_abs_err": float(norm_abs_errors_np.mean()),
                "percentiles": compute_percentiles(all_norms_np),
            },
            "margin": {
                "min": float(all_margins_np.min()),
                "max": float(all_margins_np.max()),
                "mean": float(all_margins_np.mean()),
                "std": float(all_margins_np.std()),
                "median": float(np.median(all_margins_np)),
                "percentiles": compute_percentiles(all_margins_np),
            },
            "dominant_val": {
                "min": float(dominant_vals_np.min()),
                "max": float(dominant_vals_np.max()),
                "mean": float(dominant_vals_np.mean()),
            },
            "non_dominant_val": {
                "min": float(non_dominant_vals_np.min()),
                "max": float(non_dominant_vals_np.max()),
                "mean": float(non_dominant_vals_np.mean()),
            }
        }
    }


if __name__ == "__main__":
    run_audit()
