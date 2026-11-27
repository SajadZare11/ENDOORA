import os
import re
import json
import glob

FRONT_MATTER_PATTERNS = [
    re.compile(r'copyright\s+(©|\(c\)|20\d\d|19\d\d)', re.I),
    re.compile(r'all rights reserved', re.I),
    re.compile(r'table of contents', re.I),
    re.compile(r'\bcontents\b', re.I),
    re.compile(r'cataloging-in-publication', re.I),
    re.compile(r'cataloguing in publication', re.I),
    re.compile(r'isbn\s*[:-]?\s*(978|979|\d{10})', re.I),
    re.compile(r'printed and bound', re.I),
    re.compile(r'printed in', re.I),
    re.compile(r'published by', re.I),
    re.compile(r'first published', re.I),
    re.compile(r'first edition', re.I),
    re.compile(r'oceanofpdf\.com', re.I),
    re.compile(r'ieltsmatters(\.com)?', re.I),
    re.compile(r'telegram:@', re.I),
    re.compile(r'instagram:@', re.I),
    re.compile(r'library of congress', re.I),
    re.compile(r'advance praise for', re.I),
    re.compile(r'praise for\b', re.I),
    re.compile(r'acclaim for\b', re.I),
    re.compile(r'\bdedication\b', re.I),
    re.compile(r'this article was downloaded by', re.I),
    re.compile(r'european journal of sociology', re.I),
    re.compile(r'book reviews\b', re.I),
    re.compile(r'no part of this publication may be reproduced', re.I),
    re.compile(r'without the prior written permission', re.I),
    re.compile(r'typeset by', re.I),
    re.compile(r'cover design by', re.I),
]

STORY_START_PATTERNS = [
    re.compile(r'\bchapter\s+(1|one|i)\b', re.I),
    re.compile(r'\bpart\s+(1|one|i)\b', re.I),
    re.compile(r'\bunit\s+(1|one)\b', re.I),
    re.compile(r'\blesson\s+(1|one)\b', re.I),
    re.compile(r'\bprologue\b', re.I),
    re.compile(r'\bact\s+(1|one|i)\b', re.I),
]

def is_front_matter_page(text: str) -> bool:
    clean = text.strip()
    if len(clean) < 100:  # Very short page (title only, blank, logo, single sentence)
        return True

    # Check if this is the Table of Contents page
    is_toc = bool(re.search(r'\b(table of contents|contents|inhoudsopgave)\b', clean, re.I))
    if is_toc and (re.search(r'chapter\s+[123]', clean, re.I) or re.search(r'\.{3,}', clean) or len(clean) < 1200):
        return True

    # If it matches an explicit story start marker (Chapter 1, Unit 1, Prologue)
    has_story_marker = any(p.search(clean) for p in STORY_START_PATTERNS)
    if has_story_marker and not is_toc:
        return False

    # Check front matter matches
    matches = sum(1 for p in FRONT_MATTER_PATTERNS if p.search(clean))
    if matches >= 2:
        return True
    if matches >= 1 and len(clean) < 500:
        return True

    return False

def test_sampler():
    files = sorted(glob.glob('Endoora/apps/web/public/book-data/book-*.json'), key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group()))
    sample_indices = [2, 10, 48, 100, 110, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1021, 1025, 1032, 1038, 1200, 1400]
    
    results = []
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
        while start_idx < max_skip and is_front_matter_page(' '.join(all_pages[start_idx].get('content', []))):
            start_idx += 1
            
        first_text = ' '.join(all_pages[start_idx].get('content', []))[:120].replace('\n', ' ') if start_idx < len(all_pages) else 'EMPTY'
        results.append((d.get('id'), len(all_pages), start_idx, first_text))
        
    for bid, tot, skipped, preview in results:
        print(f"[{bid}] (Total: {tot} pages) Skipped: {skipped} front pages | Starts: {preview}")

if __name__ == '__main__':
    test_sampler()
