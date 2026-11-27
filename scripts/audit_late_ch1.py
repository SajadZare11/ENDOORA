import json
import glob
import os
import re

files = sorted(
    glob.glob('Endoora/apps/web/public/book-data/book-*.json'),
    key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group())
)

ch1_pat = re.compile(
    r'\b(chapter\s+(1|one|i)\b|part\s+(1|one|i)\b|unit\s+(1|one)\b|act\s+(1|one|i)\b|lesson\s+(1|one)\b|^\s*1\s+[A-Z]{3,}|^\s*1\s+[A-Z][a-z]+)',
    re.I | re.M
)

found_late_ch1 = []
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
        pages = [pg for c in d.get('chapters', []) if c.get('id') != 'overview' for pg in c.get('pages', [])]
        if len(pages) < 2:
            continue
        
        p1 = ' '.join(pages[0].get('content', []))
        if ch1_pat.search(p1[:300]):
            continue
            
        for i in range(1, min(10, len(pages))):
            pi_text = ' '.join(pages[i].get('content', []))
            # Guard against TOC
            if re.search(r'\b(table of contents|contents)\b', pi_text[:300], re.I):
                continue
            m = ch1_pat.search(pi_text[:300])
            if m:
                found_late_ch1.append((d.get('id'), d.get('titleEn', ''), i + 1, m.group(0).strip(), pi_text[:90].replace('\n', ' ')))
                break
    except Exception:
        pass

print(f'Total books where Chapter 1 appears on page 2-10: {len(found_late_ch1)}')
for item in found_late_ch1[:40]:
    print(f'[{item[0]}] "{item[1]}" -> Chapter 1 found on Page {item[2]}: [{item[3]}] "{item[4]}"')
