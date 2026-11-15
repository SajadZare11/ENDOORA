# -*- coding: utf-8 -*-
import json

with open(r"E:\0\Work\Website\The General Website\Endoora\scripts\a1-v15-whisper.json", encoding="utf-8") as f:
    whisper_data = json.load(f)

for idx, seg in enumerate(whisper_data):
    w_start = seg['start']
    w_end = seg['end']
    text = seg['text']
    first_word = seg['words'][0]['word'] if seg.get('words') else ''
    last_word = seg['words'][-1]['word'] if seg.get('words') else ''
    print(f"{idx+1:2d}: [{w_start:6.2f} - {w_end:6.2f}] {text}")
