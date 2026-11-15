# -*- coding: utf-8 -*-
import json
from faster_whisper import WhisperModel

MODEL_DIR = r"E:\0\Work\Website\The General Website\Endoora\scripts\whisper-tiny.en"
VIDEO_PATH = r"E:\0\Work\Website\The General Website\Speakout and AEF Videos\AEF\A1 level\AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4"
OUTPUT_JSON = r"E:\0\Work\Website\The General Website\Endoora\scripts\a1-v17-whisper.json"

print("Loading local model from", MODEL_DIR)
model = WhisperModel(MODEL_DIR, device="cpu", compute_type="int8", local_files_only=True)
print("Transcribing...")
segments, info = model.transcribe(VIDEO_PATH, language="en", word_timestamps=True, vad_filter=False)

result = []
for seg in segments:
    words = [{"word": w.word, "start": round(w.start, 3), "end": round(w.end, 3)} for w in (seg.words or [])]
    result.append({
        "start": round(seg.start, 2),
        "end": round(seg.end, 2),
        "text": seg.text.strip(),
        "words": words
    })

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Done. {len(result)} segments saved to {OUTPUT_JSON}")
print(f"Audio duration: {info.duration:.2f}s")
for s in result:
    print(f"[{s['start']:6.2f} -> {s['end']:6.2f}] {s['text']}")
