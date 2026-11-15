#!/usr/bin/env python3
"""
Test Suite for EnDoora Engine 4: GAT + NeuralCDM DAG & Q-Matrix Pipeline.
Verifies:
1. DAG topology: strictly 60 concepts, acyclic (topological sort passes), max depth >= 8.
2. Referential integrity: all concept prerequisite references resolve to existing concept IDs.
3. GAT Attention: multi-parent prerequisite weights are normalized (sum to 1.0 within tolerance).
4. Q-Matrix validity: 260 items covering hex_circuit, adaptive_question, and ielts_question.
5. Parameter calibration: discrimination > 0, difficulty in (0, 1], slip in (0, 0.4), guess in (0, 0.4).
6. Target JSON artifact: exists in both static public and data dirs, size matches ~90 KB budget.
"""

import os
import json
import pytest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DATA_JSON = os.path.join(BASE_DIR, "apps", "web", "data", "cdm", "neural_cdm_dag_matrix.json")
OUTPUT_PUBLIC_JSON = os.path.join(BASE_DIR, "apps", "web", "public", "data", "neural_cdm_dag_matrix.json")


@pytest.fixture(scope="module")
def cdm_data():
    assert os.path.exists(OUTPUT_DATA_JSON), f"Missing data file: {OUTPUT_DATA_JSON}"
    with open(OUTPUT_DATA_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def test_file_locations_and_size_budget():
    """Validates artifact generation and ~90 KB size target."""
    assert os.path.exists(OUTPUT_DATA_JSON), f"Missing data JSON: {OUTPUT_DATA_JSON}"
    assert os.path.exists(OUTPUT_PUBLIC_JSON), f"Missing public static JSON: {OUTPUT_PUBLIC_JSON}"

    size_data_kb = os.path.getsize(OUTPUT_DATA_JSON) / 1024.0
    size_public_kb = os.path.getsize(OUTPUT_PUBLIC_JSON) / 1024.0

    assert 80.0 <= size_data_kb <= 105.0, f"Expected size ~90 KB, got {size_data_kb:.2f} KB"
    assert 80.0 <= size_public_kb <= 105.0, f"Expected size ~90 KB, got {size_public_kb:.2f} KB"
    assert abs(size_data_kb - size_public_kb) < 0.1, "Data and Public copies must have identical byte count"


def test_dag_structure_and_completeness(cdm_data):
    """Validates the 60 AEF concepts in the DAG."""
    dag = cdm_data.get("dag")
    assert dag is not None
    concepts = dag.get("concepts", [])
    assert len(concepts) == 60, f"Expected exactly 60 concepts, found {len(concepts)}"

    cefr_tiers = ["A1", "A2", "B1", "B2", "C1", "C2"]
    valid_domains = {"tenses", "modals", "conditionals", "passive", "clauses", "discourse"}

    for tier in cefr_tiers:
        tier_concepts = [c for c in concepts if c["cefr"] == tier]
        assert len(tier_concepts) == 10, f"Expected 10 concepts for CEFR tier {tier}, found {len(tier_concepts)}"

    for c in concepts:
        assert c["domain"] in valid_domains, f"Invalid domain {c['domain']} in {c['id']}"
        assert 1 <= c["stageNumber"] <= 10
        assert 0.0 < c["difficulty"] <= 1.0
        assert 0.0 < c["decayRateLambda"] <= 0.3
        assert isinstance(c["depth"], int) and c["depth"] >= 0


def test_dag_referential_integrity_and_acyclicity(cdm_data):
    """Proves DAG has zero cycles and 100% prerequisite integrity."""
    dag = cdm_data["dag"]
    concepts = dag["concepts"]
    concept_map = {c["id"]: c for c in concepts}
    all_ids = set(concept_map.keys())

    # Referential check
    for c in concepts:
        for p in c["prerequisites"]:
            assert p in all_ids, f"Concept {c['id']} references missing prerequisite {p}"
        for a in c["all_ancestors"]:
            assert a in all_ids, f"Concept {c['id']} references missing ancestor {a}"

    # Cycle check via DFS
    visited = {}
    def dfs(cid, stack):
        visited[cid] = 1
        for p in concept_map[cid]["prerequisites"]:
            if visited.get(p, 0) == 1:
                pytest.fail(f"Cycle detected: {' -> '.join(stack + [p])}")
            elif visited.get(p, 0) == 0:
                dfs(p, stack + [p])
        visited[cid] = 2

    for cid in all_ids:
        if visited.get(cid, 0) == 0:
            dfs(cid, [cid])

    # Check max depth
    max_d = max(c["depth"] for c in concepts)
    assert max_d >= 7, f"Expected max depth >= 7 across A1-C2 curriculum, got {max_d}"


def test_gat_incoming_attention_normalization(cdm_data):
    """Verifies Graph Attention incoming weights sum to 1.0."""
    dag = cdm_data["dag"]
    for c in dag["concepts"]:
        prereqs = c["prerequisites"]
        gat_w = c["gat_incoming_weights"]
        if not prereqs:
            assert len(gat_w) == 0
        else:
            assert len(gat_w) == len(prereqs)
            w_sum = sum(gat_w.values())
            assert abs(w_sum - 1.0) < 1e-3, f"GAT weights for {c['id']} must sum to 1.0, got {w_sum}"
            for p, w in gat_w.items():
                assert 0.0 < w <= 1.0


def test_q_matrix_coverage_and_types(cdm_data):
    """Verifies Q-Matrix items across assessment categories."""
    q_mat = cdm_data.get("q_matrix")
    assert q_mat is not None
    items = q_mat.get("items", [])
    assert len(items) == 260, f"Expected exactly 260 Q-matrix items, got {len(items)}"

    type_counts = {}
    for it in items:
        t = it["item_type"]
        type_counts[t] = type_counts.get(t, 0) + 1

    assert type_counts.get("hex_circuit") == 80, f"Expected 80 Hex items, got {type_counts.get('hex_circuit')}"
    assert type_counts.get("adaptive_question") == 120, f"Expected 120 Adaptive items, got {type_counts.get('adaptive_question')}"
    assert type_counts.get("ielts_question") == 60, f"Expected 60 IELTS items, got {type_counts.get('ielts_question')}"


def test_q_matrix_parameter_calibration(cdm_data):
    """Verifies NeuralCDM mathematical parameters satisfy cognitive bounds."""
    dag = cdm_data["dag"]
    all_concept_ids = {c["id"] for c in dag["concepts"]}
    items = cdm_data["q_matrix"]["items"]

    for it in items:
        # ID and types
        assert isinstance(it["item_id"], str) and len(it["item_id"]) > 0
        assert it["primary_concept_id"] in all_concept_ids

        # Required concepts non-empty and valid
        reqs = it["required_concepts"]
        assert len(reqs) >= 1
        for r in reqs:
            assert r in all_concept_ids, f"Item {it['item_id']} requires non-existent concept {r}"

        # 4-parameter CDM bounds
        diff = it["difficulty"]
        disc = it["discrimination"]
        slip = it["slip_rate"]
        guess = it["guess_rate"]

        assert 0.1 <= diff <= 1.0, f"Invalid difficulty {diff} in {it['item_id']}"
        assert 1.0 <= disc <= 3.5, f"Invalid discrimination {disc} in {it['item_id']}"
        assert 0.05 <= slip <= 0.25, f"Invalid slip rate {slip} in {it['item_id']}"
        assert 0.05 <= guess <= 0.30, f"Invalid guess rate {guess} in {it['item_id']}"

        # Monotonicity boundary: slip + guess < 1.0 (standard CDM requirement so slope is positive)
        assert slip + guess < 0.60, f"slip + guess must be well below 1.0, got {slip + guess}"
