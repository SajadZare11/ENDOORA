import os
import re
import json
import glob

FRONT_MATTER_UNCONDITIONAL = [
    re.compile(r'^\s*acknowledg(e)?ments?\b', re.I | re.M),
    re.compile(r'^\s*(praise for|advance praise|what people are saying|acclaim for)\b', re.I | re.M),
    re.compile(r'^\s*(also by|other books by|books by)\s+[A-Z]', re.I | re.M),
    re.compile(r'^\s*(preface|foreword|a note on the text|note to the reader|translator\'s note)\b', re.I | re.M),
    re.compile(r'\b(table of contents|contents|inhoudsopgave)\b', re.I),
    re.compile(r'^\s*dedication\b', re.I | re.M),
    re.compile(r'^\s*for\s+[A-Z][a-z]+(\s+and\s+[A-Z][a-z]+)?\s*$', re.I | re.M),
    re.compile(r'this ebook is copyright material', re.I),
    re.compile(r'cataloging-in-publication', re.I),
    re.compile(r'cataloguing in publication', re.I),
    re.compile(r'library of congress', re.I),
    re.compile(r'isbn\s*[:-]?\s*(978|979|\d{10})', re.I),
    re.compile(r'without digital rights management', re.I),
    re.compile(r'digital rights management', re.I),
    re.compile(r'oceanofpdf\.com', re.I),
    re.compile(r'this article was downloaded by', re.I),
    re.compile(r'all rights reserved', re.I),
]

STORY_START_STRONG = [
    re.compile(r'\bchapter\s+(1|one|i)\b', re.I),
    re.compile(r'^\s*1\s+[A-Z]{3,}', re.M),
    re.compile(r'^\s*1\s+[A-Z][a-z]+', re.M),
    re.compile(r'\bpart\s+(1|one|i)\b', re.I),
    re.compile(r'\bunit\s+(1|one)\b', re.I),
    re.compile(r'\blesson\s+(1|one)\b', re.I),
    re.compile(r'\btest\s+(1|a|one)\b', re.I),
    re.compile(r'\bact\s+(1|one|i)\b', re.I),
]

def is_front_page(text: str) -> bool:
    clean = text.strip()
    
    # 1. Very short page
    if len(clean) < 120 and not any(p.search(clean) for p in STORY_START_STRONG):
        return True

    # 2. Table of Contents check
    chapter_mentions = len(re.findall(r'\bchapter\b', clean, re.I))
    part_mentions = len(re.findall(r'\bpart\s+[ivxlcdm\d]+\b', clean, re.I))
    if chapter_mentions >= 3 or part_mentions >= 3:
        return True
    if re.search(r'\.{3,}\s*\d+', clean):
        return True
    numbered_headings = len(re.findall(r'\b\d{1,2}\.?\s+[A-Z][a-z]+', clean))
    if numbered_headings >= 4 and len(clean) < 1200:
        return True

    # 3. Definite story/content start
    for p in STORY_START_STRONG:
        if p.search(clean):
            # Guard: ignore if this is clearly a TOC page
            if not (re.search(r'\b(contents|table of contents)\b', clean, re.I) or chapter_mentions >= 2):
                return False

    # 4. Unconditional front matter
    for pat in FRONT_MATTER_UNCONDITIONAL:
        if pat.search(clean):
            return True

    # 5. Copyright / publishing notices (short to medium pages)
    if re.search(r'copyright\s+(©|\(c\)|20\d\d|19\d\d)', clean, re.I) and len(clean) < 1600:
        return True
    if re.search(r'\b(transworld publishers|harpercollins|oxfo(rd)?\s+university\s+press|cambridge university press|macmillan|penguin|simon\s*&\s*schuster)\b', clean, re.I) and len(clean) < 500:
        return True
    if re.search(r'\b(student\'s book|teacher\'s book|workbook)\b', clean, re.I) and len(clean) < 400:
        return True
    if re.search(r'\b(published by|printed in|first edition|typeset by)\b', clean, re.I) and len(clean) < 600:
        return True
    if re.search(r'caused, or alleged to have been caused', clean, re.I):
        return True

    return False

def test():
    sample_indices = [10, 48, 100, 110, 200, 300, 500, 900, 1000, 1020, 1021, 1025, 1032, 1038, 1200]
    for idx in sample_indices:
        f = f"Endoora/apps/web/public/book-data/book-{idx}.json"
        if not os.path.exists(f):
            continue
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            
        all_pages = []
        for c in d.get('chapters', []):
            if c.get('id') == 'overview':
                continue
            all_pages.extend(c.get('pages', []))
            
        max_skip = min(len(all_pages) // 2, 25)
        start_idx = 0
        while start_idx < max_skip and is_front_page(' '.join(all_pages[start_idx].get('content', []))):
            start_idx += 1
            
        txt = ' '.join(all_pages[start_idx].get('content', []))[:140].replace('\n', ' ') if start_idx < len(all_pages) else 'EMPTY'
        print(f"[{d.get('id')}] Skipped: {start_idx} pages -> Starts at: \"{txt}\"")

if __name__ == '__main__':
    test()
