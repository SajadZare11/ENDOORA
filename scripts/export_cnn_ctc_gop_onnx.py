#!/usr/bin/env python3
"""
Spectrogram Neural GOP: 2D-CNN + CTC Model Definition & ONNX INT8 Quantization Exporter
Generates /public/models/cnn_ctc_phoneme_gop_int8.onnx for client-side WebGPU/WASM inference in EnDoora.

Architecture:
- Input: [Batch=1, Channels=1, Time=T, Mel_Bins=80]
- Conv2D Feature Extractor (3 residual-style Conv blocks + BN + LeakyReLU + Frequency MaxPool)
- Bidirectional GRU (2 layers, 256 hidden units = 512 bidirectional)
- Linear Classifier: 41 tokens (Blank at index 0 + 40 ARPAbet phonemes)
- Output: Log-Probabilities [Batch=1, Time=T, Vocab=41]
"""

import os
import sys
import io

# Ensure UTF-8 output on Windows consoles to prevent emoji UnicodeEncodeError
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import torch
import torch.nn as nn
import torch.nn.functional as F

PHONEME_VOCAB = [
    '<blank>', 'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'B', 'CH', 'D',
    'DH', 'EH', 'ER', 'EY', 'F', 'G', 'HH', 'IH', 'IY', 'JH',
    'K', 'L', 'M', 'N', 'NG', 'OW', 'OY', 'P', 'R', 'S',
    'SH', 'T', 'TH', 'UH', 'UW', 'V', 'W', 'Y', 'Z', 'ZH'
]

class Spectrogram2DCNNCTC(nn.Module):
    def __init__(self, num_classes=41, mel_bins=80):
        super().__init__()
        self.num_classes = num_classes
        self.mel_bins = mel_bins

        # 2D-CNN feature extractor (Pools only across frequency to maintain 10ms frame resolution)
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(kernel_size=(1, 2)) # 80 -> 40

        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(kernel_size=(1, 2)) # 40 -> 20

        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.pool3 = nn.MaxPool2d(kernel_size=(1, 2)) # 20 -> 10

        # Sequence modeling over temporal frames
        # Flattened feature dim: 128 channels * 10 frequency bins = 1280
        self.rnn_in_dim = 128 * (mel_bins // 8)
        self.rnn = nn.GRU(
            input_size=self.rnn_in_dim,
            hidden_size=256,
            num_layers=2,
            batch_first=True,
            bidirectional=True,
            dropout=0.15
        )

        # Output projection to CTC phoneme classes
        self.fc = nn.Linear(512, num_classes)

    def forward(self, x):
        # x shape: [B, 1, T, 80]
        out = F.leaky_relu(self.bn1(self.conv1(x)), 0.05)
        out = self.pool1(out) # [B, 32, T, 40]

        out = F.leaky_relu(self.bn2(self.conv2(out)), 0.05)
        out = self.pool2(out) # [B, 64, T, 20]

        out = F.leaky_relu(self.bn3(self.conv3(out)), 0.05)
        out = self.pool3(out) # [B, 128, T, 10]

        # Reshape to [B, T, Channels * Freq]
        B, C, T, F_bins = out.shape
        out = out.permute(0, 2, 1, 3).contiguous().view(B, T, C * F_bins)

        # Recurrent sequence model
        rnn_out, _ = self.rnn(out) # [B, T, 512]

        # CTC Log-Softmax projection
        logits = self.fc(rnn_out) # [B, T, 41]
        log_probs = F.log_softmax(logits, dim=-1)

        return log_probs

def export_model():
    print("=" * 65)
    print("EnDoora Spectrogram Neural GOP: Exporting 2D-CNN-CTC to ONNX INT8")
    print("=" * 65)

    model = Spectrogram2DCNNCTC(num_classes=len(PHONEME_VOCAB), mel_bins=80)
    model.eval()

    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/web/public/models"))
    os.makedirs(output_dir, exist_ok=True)

    fp32_onnx_path = os.path.join(output_dir, "cnn_ctc_phoneme_gop_fp32.onnx")
    int8_onnx_path = os.path.join(output_dir, "cnn_ctc_phoneme_gop_int8.onnx")

    # Sample input: [Batch=1, Channel=1, Frames=100, MelBins=80]
    dummy_input = torch.randn(1, 1, 100, 80, dtype=torch.float32)

    print(f"Exporting PyTorch model to FP32 ONNX -> {fp32_onnx_path}")
    torch.onnx.export(
        model,
        dummy_input,
        fp32_onnx_path,
        export_params=True,
        opset_version=17,
        do_constant_folding=True,
        input_names=["mel_spectrogram"],
        output_names=["log_posteriors"],
        dynamic_axes={
            "mel_spectrogram": {0: "batch_size", 2: "time_frames"},
            "log_posteriors": {0: "batch_size", 1: "time_frames"}
        },
        dynamo=False
    )
    print("FP32 ONNX export completed successfully.")

    try:
        from onnxruntime.quantization import quantize_dynamic, QuantType
        print(f"Applying dynamic INT8 quantization -> {int8_onnx_path}")
        quantize_dynamic(
            model_input=fp32_onnx_path,
            model_output=int8_onnx_path,
            weight_type=QuantType.QInt8
        )
        print(f"INT8 model saved ({os.path.getsize(int8_onnx_path) / (1024*1024):.2f} MB).")
    except ImportError:
        print("Note: onnxruntime not installed in current Python env; copied FP32 to target path.")
        import shutil
        shutil.copyfile(fp32_onnx_path, int8_onnx_path)

    print("\nModel artifact ready at:")
    print(f"  {int8_onnx_path}")

if __name__ == "__main__":
    export_model()
