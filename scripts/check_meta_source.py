import re
import json
import glob
import os

with open(r'E:\0\Work\Website\The General Website\Endoora\apps\web\data\downloads\index.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id: "book-1",')
if idx != -1:
    print("--- In DOWNLOAD_ITEMS ---")
    print(text[idx-5:idx+500])

# Check metadata files in Books and CEFR
base = r'E:\0\Work\Website\The General Website'
print("\n--- Books and CEFR files ---")
for p in glob.glob(os.path.join(base, 'Books and CEFR', '*')):
    print(p)

for p in glob.glob(os.path.join(base, 'Books and CEFR', 'zlib_scraper', '*')):
    print(p)
