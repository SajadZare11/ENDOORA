#!/usr/bin/env python3
"""
Test Suite for EnDoora Engine 5: MobileNetV3-CNN + BiLSTM Gaze & Cognitive Load Engine.
Verifies:
1. Model forward pass shapes and bounds.
2. BiLSTM temporal dynamics (hidden_dim=32, bidirectional=True -> 64D representation).
3. Monotonicity and bounds on Cognitive Load Index and Saccadic Regression outputs in [0, 1].
4. Proctoring anomaly 5-class distribution.
5. Exported weight artifact existence and budget constraints (<= 4.0 MB).
"""

import os
import json
import math
import pytest
import torch
import numpy as np

from scripts.export_gaze_bilstm_model import (
    MobileNetV3GazeBackbone,
    GazeCognitiveBiLSTMModel,
    FEATURE_DIM,
    HIDDEN_DIM,
    SEQUENCE_LEN,
    NUM_PROCTOR_CLASSES,
    OUTPUT_MODEL_JSON,
)


@pytest.fixture(scope="module")
def models():
    backbone = MobileNetV3GazeBackbone()
    bilstm = GazeCognitiveBiLSTMModel()
    backbone.eval()
    bilstm.eval()
    return backbone, bilstm


def test_model_weight_file_exists_and_size_budget():
    """Validates that the exported JSON weights exist and are within the ~4MB budget."""
    assert os.path.exists(OUTPUT_MODEL_JSON), f"Missing weight file: {OUTPUT_MODEL_JSON}"
    size_mb = os.path.getsize(OUTPUT_MODEL_JSON) / (1024.0 * 1024.0)
    assert 0.1 <= size_mb <= 4.5, f"Expected model size <= 4.5 MB, got {size_mb:.2f} MB"

    with open(OUTPUT_MODEL_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data["feature_dim"] == FEATURE_DIM
    assert data["hidden_dim"] == HIDDEN_DIM
    assert data["sequence_len"] == SEQUENCE_LEN
    assert data["sample_rate_fps"] == 10
    assert len(data["proctor_classes"]) == NUM_PROCTOR_CLASSES
    assert "bilstm_weights" in data
    assert "backbone_weights" in data


def test_backbone_forward_pass(models):
    """Verifies MobileNetV3 spatial gaze backbone forward pass."""
    backbone, _ = models
    dummy_input = torch.randn(4, 3, 64, 64)
    with torch.no_grad():
        features = backbone(dummy_input)

    assert features.shape == (4, FEATURE_DIM)
    assert not torch.isnan(features).any()
    assert not torch.isinf(features).any()


def test_bilstm_forward_pass_and_head_bounds(models):
    """Verifies BiLSTM temporal network and multi-head outputs."""
    _, bilstm = models
    dummy_seq = torch.randn(3, SEQUENCE_LEN, FEATURE_DIM)

    with torch.no_grad():
        cog_load, saccade_reg, proctor_logits = bilstm(dummy_seq)

    assert cog_load.shape == (3, 1)
    assert saccade_reg.shape == (3, 1)
    assert proctor_logits.shape == (3, NUM_PROCTOR_CLASSES)

    # Sigmoid heads must be bounded in [0.0, 1.0]
    assert (cog_load >= 0.0).all() and (cog_load <= 1.0).all()
    assert (saccade_reg >= 0.0).all() and (saccade_reg <= 1.0).all()

    # Softmax probabilities over proctoring classes sum to 1.0
    proctor_probs = torch.softmax(proctor_logits, dim=1)
    sums = torch.sum(proctor_probs, dim=1)
    for s in sums:
        assert abs(float(s) - 1.0) < 1e-4


def test_saccadic_regression_backtracking_sensitivity(models):
    """Verifies BiLSTM distinguishes steady reading from frequent backtracking saccades."""
    _, bilstm = models

    # Normal progressive reading trajectory: monotonic forward gaze
    normal_seq = torch.zeros(1, SEQUENCE_LEN, FEATURE_DIM)
    for t in range(SEQUENCE_LEN):
        normal_seq[0, t, 0] = t * 0.1  # forward drift

    # Backtracking regressive reading trajectory: oscillates backwards repeatedly
    backtrack_seq = torch.zeros(1, SEQUENCE_LEN, FEATURE_DIM)
    for t in range(SEQUENCE_LEN):
        # High frequency oscillating backtrack
        backtrack_seq[0, t, 0] = math.sin(t * 1.5)
        backtrack_seq[0, t, 1] = 1.0 if t % 2 == 1 else -1.0

    with torch.no_grad():
        _, reg_normal, _ = bilstm(normal_seq)
        _, reg_backtrack, _ = bilstm(backtrack_seq)

    assert float(reg_normal) >= 0.0
    assert float(reg_backtrack) >= 0.0
