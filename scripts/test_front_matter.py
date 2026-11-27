import json
import glob
import os
import re

FRONT_MATTER_PATTERNS = [
    re.compile(r'copyright\s+(©|\(c\)|20\d\d|19\d\d)', re.I),
    re.compile(r'all rights reserved', re.I),
    re.compile(r'table of contents', re.I),
    re.compile(r'\bcontents\b', re.I),
    re.compile(r'cataloging-in-publication', re.I),
    re.compile(r'isbn\s*[:-]?\s*(978|979|\d{10})', re.I),
    re.compile(r'printed and bound in', re.I),
    re.compile(r'published by', re.I),
    re.compile(r'first edition', re.I),
    re.compile(r'oceanofpdf\.com', re.I),
    re.compile(r'ieltsmatters\.com', re.I),
    re.compile(r'library of congress', re.I),
    re.compile(r'advance praise for', re.I),
    re.compile(r'praise for\b', re.I),
    re.compile(r'\bdedication\b', re.I),
    re.compile(r'this article was downloaded by', re.I),
    re.compile(r'european journal of sociology', re.I),
    re.compile(r'book reviews\b', re.I),
]

STORY_START_PATTERNS = [
    re.compile(r'\b(chapter\s+(1|one|i)\b)', re.I),
    re.compile(r'\b(part\s+(1|one|i)\b)', re.I),
    re.compile(r'\b(unit\s+(1|one)\b)', re.I),
    re.compile(r'\b(lesson\s+(1|one)\b)', re.I),
    re.compile(r'\b(prologue)\b', re.I),
    re.compile(r'\b(act\s+(1|one|i)\b)', re.I),
]

def is_front_matter_page(text: str) -> bool:
    clean = text.strip()
    if len(clean) < 90:  # Very short (likely cover / blank / single stamp)
        return True
    
    # Check if this is the Table of Contents
    is_toc = re.search(r'\b(table of contents|contents)\b', clean, re.I) and (
        re.search(r'chapter\s+[123]', clean, re.I) or re.search(r'\.{3,}', clean) or len(clean) < 1000
    )
    if is_toc:
        return True

    # If it has explicit story start markers (Chapter 1, Unit 1, etc.)
    has_story_marker = any(p.search(clean) for p in STORY_START_PATTERNS)
    if has_story_marker:
        return False
        
    matches = sum(1 for p in FRONT_MATTER_PATTERNS if p.search(clean))
    if matches >= 2:
        return True
    if matches >= 1 and len(clean) < 500:
        return True

    return False

def main():
    files = sorted(glob.glob('Endoora/apps/web/public/book-data/book-*.json'), key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group()))
    print(f"Total books found: {len(files)}")
    
    # Test on a wide sample of books
    sample_indices = [1, 2, 10, 48, 100, 110, 500, 800, 1000, 1020, 1021, 1025, 1032, 1038]
    for idx in sample_indices:
        target_f = f"Endoora/apps/web/public/book-data/book-{idx}.json"
        if not os.path.exists(target_f):
            continue
        with open(target_f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
        bid = d.get('id')
        
        all_pages = []
        for c in d.get('chapters', []):
            if c.get('id') == 'overview':
                continue
            all_pages.extend(c.get('pages', []))
            
        start_idx = 0
        while start_idx < min(len(all_pages), 25) and is_front_matter_page(' '.join(all_pages[start_idx].get('content', []))):
            start_idx += 1
            
        skipped = start_idx
        first_kept = ' '.join(all_pages[start_idx].get('content', []))[:120].replace('\n', ' ') if start_idx < len(all_pages) else 'EMPTY'
        print(f"[{bid}] Skipped {skipped} front pages -> Starts at: \"{first_kept}\"")

if __name__ == '__main__':
    main()
