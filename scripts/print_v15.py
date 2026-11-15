import json

with open(r'E:\0\Work\Website\The General Website\Endoora\scripts\a1-v15-whisper.json', encoding='utf-8') as f:
    data = json.load(f)

for i, d in enumerate(data):
    print(f"{i+1:2d}. [{d['start']:6.2f}s -> {d['end']:6.2f}s] {d['text']}")
