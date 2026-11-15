"""
Video Transcript Calibrator for Endoora
Uses faster-whisper with word-level timestamps to extract and align precise dialog timestamps
for American English File (AEF) and Speakout video lessons.

Usage:
  python calibrate-video-transcripts.py --file "path/to/video.mp4"
  python calibrate-video-transcripts.py --lesson "a1-v01"
"""

import os
import sys
import json
import argparse
from typing import List, Dict, Any

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("Error: faster-whisper is required. Run: pip install faster-whisper")
    sys.exit(1)

BASE_DIR = r"E:\0\Work\Website\The General Website\Speakout and AEF Videos"
CURRICULUM_PATH = r"E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts"


def format_seconds(seconds: float) -> str:
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m}:{s:02d}"


def transcribe_video(video_path: str, model_size: str = "base") -> List[Dict[str, Any]]:
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    print(f"Loading faster-whisper model ({model_size})...")
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    print(f"Transcribing audio with word-level timestamps: {os.path.basename(video_path)}")
    segments, info = model.transcribe(video_path, word_timestamps=True, beam_size=5)

    results = []
    line_id = 1

    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue

        start_sec = int(round(seg.start))
        end_sec = int(round(seg.end))

        results.append({
            "id": line_id,
            "seconds": start_sec,
            "endSeconds": end_sec,
            "timeDisplay": format_seconds(start_sec),
            "speaker": "Speaker",
            "textEn": text,
            "textFa": "",
            "_rawStart": round(seg.start, 2),
            "_rawEnd": round(seg.end, 2)
        })
        line_id += 1

    return results


def main():
    parser = argparse.ArgumentParser(description="Calibrate video dialog timestamps using Faster-Whisper")
    parser.add_argument("--file", "-f", help="Direct path to mp4 video file")
    parser.add_argument("--lesson", "-l", help="Lesson ID from curriculum (e.g. a1-v01)")
    parser.add_argument("--model", "-m", default="base", help="Whisper model size: tiny, base, small")
    parser.add_argument("--output", "-o", help="Optional output JSON path")

    args = parser.parse_args()

    video_path = args.file
    if not video_path and args.lesson:
        # Default known paths for AEF lessons
        if args.lesson.startswith("a1-"):
            video_path = os.path.join(BASE_DIR, "AEF", "A1 level", "AEF3e_SB1_PE_Ep1_Introduction.mp4")

    if not video_path:
        print("Please provide --file or --lesson.")
        sys.exit(1)

    print(f"Target video: {video_path}")
    transcripts = transcribe_video(video_path, model_size=args.model)

    print("\n--- Extracted Calibrated Transcripts ---")
    print(json.dumps(transcripts, indent=2, ensure_ascii=False))

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(transcripts, f, indent=2, ensure_ascii=False)
        print(f"\nSaved results to {args.output}")


if __name__ == "__main__":
    main()
