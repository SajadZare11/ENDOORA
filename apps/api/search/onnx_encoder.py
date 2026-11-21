"""Local mean-pooled, normalized embeddings for the pinned multilingual MiniLM export."""
from pathlib import Path


class MiniLMEncoder:
    def __init__(self, directory):
        import onnxruntime as ort
        from tokenizers import Tokenizer

        root = Path(directory).resolve(strict=True)
        self.tokenizer = Tokenizer.from_file(str(root / "tokenizer.json"))
        self.tokenizer.enable_truncation(max_length=128)
        self.tokenizer.enable_padding(pad_id=self.tokenizer.token_to_id("<pad>"), pad_token="<pad>")
        options = ort.SessionOptions()
        options.intra_op_num_threads = 1
        options.inter_op_num_threads = 1
        self.session = ort.InferenceSession(str(root / "onnx/model_quantized.onnx"), options,
                                            providers=["CPUExecutionProvider"])

    def encode(self, texts):
        import numpy as np

        batches = []
        for offset in range(0, len(texts), 8):
            encoded = self.tokenizer.encode_batch(texts[offset:offset + 8])
            inputs = {"input_ids": np.asarray([x.ids for x in encoded], dtype=np.int64),
                      "attention_mask": np.asarray([x.attention_mask for x in encoded], dtype=np.int64),
                      "token_type_ids": np.asarray([x.type_ids for x in encoded], dtype=np.int64)}
            selected = {arg.name: inputs[arg.name] for arg in self.session.get_inputs()}
            hidden = self.session.run(["last_hidden_state"], selected)[0]
            mask = inputs["attention_mask"][:, :, None].astype(np.float32)
            pooled = (hidden * mask).sum(1) / np.maximum(mask.sum(1), 1)
            batches.append(pooled / np.maximum(np.linalg.norm(pooled, axis=1, keepdims=True), 1e-12))
        return np.concatenate(batches)
