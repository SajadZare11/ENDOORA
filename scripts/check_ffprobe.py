import subprocess
import json

cmd = [
    "ffprobe", "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    r"E:\0\Work\Website\The General Website\Speakout and AEF Videos\AEF\A1 level\AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4"
]
try:
    dur = subprocess.check_output(cmd).decode().strip()
    print("Video duration via ffprobe:", dur)
except Exception as e:
    print("ffprobe error:", e)
