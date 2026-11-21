#!/usr/bin/env python3
"""Check the two published model assets, embedding dimensions and a bilingual smoke query."""
import argparse
import hashlib
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "apps/api"))
from search.onnx_encoder import MiniLMEncoder


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path)
    args = parser.parse_args()
    for name, digest in {
        "tokenizer.json": "b60b6b43406a48bf3638526314f3d232d97058bc93472ff2de930d43686fa441",
        "onnx/model_quantized.onnx": "66fc00f5f29afcaff34092e1bdd20008ca3918265a82fb9695a551e510cc4ebc",
    }.items():
        with (args.model / name).open("rb") as file:
            if hashlib.file_digest(file, "sha256").hexdigest() != digest:
                raise SystemExit(f"Unexpected SHA-256 for {name}")
    model = MiniLMEncoder(args.model)
    vectors = model.encode(["رزرو کتاب در کتابخانه", "Reserving a library book", "Cooking with frozen carrots"])
    scores = vectors[1:] @ vectors[0]
    if vectors.shape != (3, 384) or scores[0] <= scores[1]:
        raise SystemExit("Bilingual model smoke check failed.")
    print(f"384 dimensions. Related {scores[0]:.3f}, unrelated {scores[1]:.3f}.")


if __name__ == "__main__":
    main()
