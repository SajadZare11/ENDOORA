import json

with open(r"E:\0\Work\Website\The General Website\Endoora\scripts\a1-v16-whisper.json", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total segments: {len(data)}")
for i, d in enumerate(data):
    words_str = " | ".join([f"{w['word']} ({w['start']}-{w['end']})" for w in d.get('words', [])])
    print(f"{i+1:2d}. [{d['start']:6.2f} - {d['end']:6.2f}] {d['text']}")
    print(f"    {words_str}")
