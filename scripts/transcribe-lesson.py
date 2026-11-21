#!/usr/bin/env python3
"""Prepare an English lesson transcript on the author's machine with whisper.cpp."""
import argparse
from pathlib import Path
import shutil
import subprocess
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio", type=Path)
    parser.add_argument("model", type=Path, help="Local whisper.cpp GGML model")
    parser.add_argument("output", type=Path, help="New directory for draft .txt and .srt")
    parser.add_argument("--cli", default="whisper-cli")
    args = parser.parse_args()
    if not args.audio.is_file() or not args.model.is_file() or args.output.exists():
        parser.error("Provide two readable input files and a new output directory.")
    if not shutil.which(args.cli) or not shutil.which("ffmpeg"):
        parser.error("Install whisper.cpp CLI and FFmpeg locally first.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=args.output.parent) as name:
        temp = Path(name)
        wav = temp / "input.wav"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", str(args.audio.resolve()),
                        "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(wav)], check=True)
        drafts = temp / "drafts"
        drafts.mkdir()
        subprocess.run([args.cli, "-m", str(args.model.resolve()), "-f", str(wav), "-l", "en",
                        "-otxt", "-osrt", "-of", str(drafts / "lesson")], check=True)
        for ext in ("txt", "srt"):
            if not (drafts / f"lesson.{ext}").read_text().strip():
                raise ValueError(f"Empty transcript output: {ext}")
        drafts.rename(args.output)
    print(f"Review speech, names and timestamps before publishing {args.output}.")


if __name__ == "__main__":
    main()
