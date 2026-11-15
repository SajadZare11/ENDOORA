import json

with open(r"E:\0\Work\Website\The General Website\Endoora\scripts\a1-v16-whisper.json", encoding="utf-8") as f:
    data = json.load(f)

for idx, seg in enumerate(data):
    if seg['start'] < 30:
        print(f"[{seg['start']:6.2f} - {seg['end']:6.2f}] {seg['text']}")
        for w in seg.get('words', []):
            print(f"    {w['start']:6.2f} - {w['end']:6.2f} : {w['word']}")
