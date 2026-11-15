from faster_whisper import WhisperModel

MODEL_DIR = r"E:\0\Work\Website\The General Website\Endoora\scripts\whisper-tiny.en"
VIDEO_PATH = r"E:\0\Work\Website\The General Website\Speakout and AEF Videos\AEF\A1 level\AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4"

model = WhisperModel(MODEL_DIR, device="cpu", compute_type="int8", local_files_only=True)
segments, _ = model.transcribe(VIDEO_PATH, language="en", word_timestamps=True, vad_filter=False)

for s in segments:
    if s.start < 30.0:
        print(f"[{s.start:.2f} - {s.end:.2f}] {s.text}")
