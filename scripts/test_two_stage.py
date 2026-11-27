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

EXPLICIT_CHAPTER_1_PATTERNS = [
    re.compile(r'\bchapter\s+(1|one|i)\b', re.I),
    re.compile(r'^\s*1\s+[A-Z]{3,}', re.M),
    re.compile(r'^\s*1\s+[A-Z][a-z]+', re.M),
    re.compile(r'\bpart\s+(1|one|i)\b', re.I),
    re.compile(r'\bunit\s+(1|one)\b', re.I),
    re.compile(r'\blesson\s+(1|one)\b', re.I),
    re.compile(r'\btest\s+(1|a|one)\b', re.I),
    re.compile(r'\bact\s+(1|one|i)\b', re.I),
]

def is_toc_page(clean: str) -> bool:
    if re.search(r'\b(table of contents|contents|inhoudsopgave)\b', clean, re.I):
        return True
    chapter_mentions = len(re.findall(r'\bchapter\b', clean, re.I))
    part_mentions = len(re.findall(r'\bpart\s+[ivxlcdm\d]+\b', clean, re.I))
    if chapter_mentions >= 3 or part_mentions >= 3:
        return True
    if re.search(r'\.{3,}\s*\d+', clean):
        return True
    numbered_headings = len(re.findall(r'\b\d{1,3}\s+[A-Z]', clean))
    if numbered_headings >= 5 and len(clean) < 1200:
        return True
    if re.search(r'\b(grammar bank|vocabulary bank|irregular verbs|sound bank|revise\s*&\s*check)\b', clean, re.I):
        return True
    return False

def is_front_page(text: str) -> bool:
    clean = text.strip()
    if len(clean) < 120:
        return True
    if is_toc_page(clean):
        return True
    for pat in FRONT_MATTER_UNCONDITIONAL:
        if pat.search(clean):
            return True
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

def find_book_story_start(all_pages: list[dict]) -> int:
    if not all_pages:
        return 0
    max_search = min(len(all_pages) // 2, 25)
    
    # Stage 1: Search for explicit Chapter 1 / Unit 1 / Test 1 marker
    for idx in range(max_search):
        page_text = ' '.join(all_pages[idx].get('content', [])).strip()
        if len(page_text) < 50:
            continue
        if is_toc_page(page_text):
            continue
        # Check explicit markers
        for pat in EXPLICIT_CHAPTER_1_PATTERNS:
            if pat.search(page_text):
                # Verify not copyright or publisher blurb
                if not re.search(r'all rights reserved|cataloging-in-publication', page_text, re.I):
                    return idx

    # Stage 2: Fall back to skipping front-matter pages sequentially
    start_idx = 0
    while start_idx < max_search:
        page_text = ' '.join(all_pages[start_idx].get('content', [])).strip()
        if not is_front_page(page_text):
            break
        start_idx += 1
        
    return start_idx

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
            
        start_idx = find_book_story_start(all_pages)
        txt = ' '.join(all_pages[start_idx].get('content', []))[:140].replace('\n', ' ') if start_idx < len(all_pages) else 'EMPTY'
        print(f"[{d.get('id')}] (Tot: {len(all_pages)}) Skipped: {start_idx} pages -> Starts at: \"{txt}\"")

if __name__ == '__main__':
    test()
