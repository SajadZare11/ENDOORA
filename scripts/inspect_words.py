import json

with open(r'E:\0\Work\Website\The General Website\Endoora\scripts\a1-v15-whisper.json', encoding='utf-8') as f:
    data = json.load(f)

for i in range(18, len(data)):
    d = data[i]
    print(f"--- Segment {i+1} [{d['start']} - {d['end']}] : {d['text']}")
    for w in d.get('words', []):
        print(f"    {w['start']:6.2f} - {w['end']:6.2f}: {w['word']}")
