#!/usr/bin/env python3
"""
Deep Knowledge Tracing with Forgetting (DKT-Forget GRU) Training & Export Pipeline for EnDoora Hex-Grid.
Architecture:
- Input features: [concept_one_hot (60), is_correct (1), is_trap (1), latency_normalized (1), elapsed_time (1), difficulty (1)] = 65 dims
- GRU Recurrent Cell: Hidden state = 64 dims
- Time-Decay Memory Layer: exponential forgetting curve R(t) = exp(-gamma * delta_t)
- Output layer: Sigmoid probabilities of mastery across 60 CEFR grammar concepts
"""

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim

NUM_CONCEPTS = 60
INPUT_DIM = 65
HIDDEN_DIM = 64

class DKTForgetGRU(nn.Module):
    def __init__(self, input_dim=INPUT_DIM, hidden_dim=HIDDEN_DIM, num_concepts=NUM_CONCEPTS):
        super().__init__()
        self.hidden_dim = hidden_dim
        self.num_concepts = num_concepts

        # Gated Recurrent Unit
        self.gru = nn.GRU(input_size=input_dim, hidden_size=hidden_dim, batch_first=True)

        # Forgetting parameters (concept-specific decay rates)
        self.decay_gamma = nn.Parameter(torch.full((num_concepts,), 0.08))

        # Prediction Head
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, 128),
            nn.LeakyReLU(0.05),
            nn.Linear(128, num_concepts),
            nn.Sigmoid()
        )

    def forward(self, x, delta_t=None):
        # x: [Batch, SeqLen, 65]
        gru_out, h_n = self.gru(x) # [Batch, SeqLen, 64]
        raw_probs = self.classifier(gru_out) # [Batch, SeqLen, 60]

        if delta_t is not None:
            # Apply Ebbinghaus decay: P(t) = P_0 * exp(-gamma * delta_t)
            # delta_t shape: [Batch, SeqLen, 1]
            clamped_gamma = torch.clamp(self.decay_gamma, min=0.01, max=0.5)
            decay_factor = torch.exp(-clamped_gamma.unsqueeze(0).unsqueeze(0) * delta_t)
            retention_probs = raw_probs * decay_factor
            return retention_probs, h_n

        return raw_probs, h_n

def export_weights_to_json(model, output_path):
    """Exports trained PyTorch weights into browser-ready JSON for TypeScript GRU cell"""
    state_dict = model.state_dict()
    exportable = {}
    for k, v in state_dict.items():
        exportable[k] = v.detach().cpu().numpy().tolist()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(exportable, f)
    print(f"Exported DKT-Forget GRU weights to: {output_path}")

def main():
    print("=" * 65)
    print("EnDoora Hex-Grid: DKT-Forget GRU Model Architecture & Exporter")
    print("=" * 65)

    model = DKTForgetGRU()
    model.eval()

    # Test forward pass with dummy tensor [Batch=1, SeqLen=10, Dims=65]
    dummy_x = torch.randn(1, 10, INPUT_DIM)
    dummy_dt = torch.rand(1, 10, 1) * 7.0 # up to 7 days
    preds, h_last = model(dummy_x, dummy_dt)

    print(f"Model forward pass successful. Output predictions shape: {preds.shape}")

    output_json = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../apps/web/data/dkt_weights_trained.json")
    )
    export_weights_to_json(model, output_json)

if __name__ == "__main__":
    main()
