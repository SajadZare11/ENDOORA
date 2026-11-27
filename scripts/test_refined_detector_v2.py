import json
import glob
import os
import re

FRONT_MATTER_UNCONDITIONAL = [
    re.compile(r'^\s*acknowledg(e)?ments?\b', re.I | re.M),
    re.compile(r'^\s*(praise for|advance praise|what people are saying|acclaim for|critical acclaim)\b', re.I | re.M),
    re.compile(r'^\s*(also by|other books by|books by)\s+[A-Z]', re.I | re.M),
    re.compile(r'^\s*(preface|foreword|a note on the text|note to the reader|translator\'s note|author\'s note|editor\'s note)\b', re.I | re.M),
    re.compile(r'^\s*(suggestions for further reading|further reading|bibliography|critical insights)\b', re.I | re.M),
    re.compile(r'\b(table of contents|contents|inhoudsopgave)\b', re.I),
    re.compile(r'^\s*dedication\b', re.I | re.M),
    re.compile(r'^\s*(dedicated\s+to|to\s+my\b|for\s+my\b)\b', re.I | re.M),
    re.compile(r'^\s*(for|to)\s+[A-Z][a-z]+(\s+and\s+[A-Z][a-z]+)?\s*[:\.\-]?\s*$', re.I | re.M),
    re.compile(r'this ebook is copyright material', re.I),
    re.compile(r'cataloging-in-publication|cataloguing in publication|library of congress', re.I),
    re.compile(r'isbn\s*[:-]?\s*(978|979|\d{10})', re.I),
    re.compile(r'without digital rights management|digital rights management|oceanofpdf\.com', re.I),
    re.compile(r'this article was downloaded by', re.I),
    re.compile(r'all rights reserved', re.I),
    re.compile(r'the author and publisher have provided this e-?book to you for your personal use only', re.I),
    re.compile(r'^\s*about the author\b', re.I | re.M),
    re.compile(r'^\s*meet the author\b', re.I | re.M),
    re.compile(r'^\s*biography\b', re.I | re.M),
    re.compile(r'\b(is the author of|has written|was born in \d{4}|born in [A-Z][a-z]+.*in \d{4})\b', re.I),
    re.compile(r'^\s*introduction\s+by\s+[A-Z]', re.I | re.M),
    re.compile(r'^\s*introduction\s+overview\b', re.I | re.M),
    re.compile(r'\b(ieltsmatters|languagecentre\.ir|frenglish\.ru|worldmags\.net)\b', re.I),
    re.compile(r'\b(available for select readings|for more information on this author)\b', re.I),
    re.compile(r'\b(rating:\s*★|the sunday times bestseller|winner of the\b)', re.I),
]

EXPLICIT_STORY_START = [
    re.compile(r'^\s*(chapter|part|book|unit|lesson|section|act)\s+(1|one|i|first)\b', re.I | re.M),
    re.compile(r'^\s*(chapter|part|book|unit|lesson|section|act)\s+[1I]\s*[:\-\.]', re.I | re.M),
    re.compile(r'^\s*1[\.\:\-]?\s+[A-Z]', re.M),
    re.compile(r'^\s*one\b', re.I | re.M),
    re.compile(r'^\s*prologue\b', re.I | re.M),
]

def is_toc_page(clean: str) -> bool:
    if re.search(r'\b(table of contents|contents|inhoudsopgave)\b', clean, re.I):
        return True
    chapter_mentions = len(re.findall(r'\bchapter\b', clean, re.I))
    part_mentions = len(re.findall(r'\b(part|section|book)\s+[ivxlcdm\d]+\b', clean, re.I))
    if chapter_mentions >= 3 or part_mentions >= 3:
        return True
    if re.search(r'\.{3,}\s*\d+', clean):
        return True
    numbered_headings = len(re.findall(r'\b\d{1,3}\s*[\:\.]\s+[A-Z]', clean))
    if numbered_headings >= 4 and len(clean) < 1500:
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

    # Check explicit start heading FIRST (e.g. PART ONE, CHAPTER 1)
    # If the page explicitly starts with Part 1 / Chapter 1, it is NOT front matter
    for pat in EXPLICIT_STORY_START:
        if pat.search(clean[:150]):
            # Guard against copyright/TOC
            if not re.search(r'all rights reserved|cataloging-in-publication|isbn\b', clean, re.I):
                return False

    for pat in FRONT_MATTER_UNCONDITIONAL:
        if pat.search(clean):
            return True

    if re.search(r'copyright\s+(©|\(c\)|20\d\d|19\d\d)', clean, re.I) and len(clean) < 1600:
        return True
    if re.search(r'\b(transworld publishers|harpercollins|oxfo(rd)?\s+university\s+press|cambridge university press|macmillan|penguin\s+books|simon\s*&\s*schuster|pearson education)\b', clean, re.I) and len(clean) < 800:
        return True
    if re.search(r'\b(student\'s book|teacher\'s book|workbook)\b', clean, re.I) and len(clean) < 400:
        return True
    if re.search(r'\b(published by|printed in|first edition|typeset by)\b', clean, re.I) and len(clean) < 600:
        return True
    if re.search(r'caused, or alleged to have been caused', clean, re.I):
        return True
    # Graded reader editorial notes about the stories/author with roman numerals:
    if re.search(r'\b(the stories in this (collection|book)|retold by)\b', clean, re.I):
        return True
    if re.search(r'\b(the character\s+[A-Z][a-z]+\s+has often been compared with|were later modelled)\b', clean, re.I):
        return True
    if re.search(r'\b(in this (summary|review)|this book is an extended review)\b', clean, re.I):
        return True
    if re.search(r'\b(critical acclaim|critical insights|literary critics|modern culture in the 1950s)\b', clean, re.I) and len(clean) < 1500:
        return True
    return False

def find_book_story_start(all_pages: list[dict]) -> int:
    if not all_pages:
        return 0
    max_search = min(len(all_pages) // 2, 35)

    # Stage 1: Explicit Chapter 1 / Story 1 / Prologue marker on a NON-front page
    for idx in range(max_search):
        page_text = ' '.join(all_pages[idx].get('content', [])).strip()
        if len(page_text) < 40 or is_toc_page(page_text) or is_front_page(page_text):
            continue
        if re.search(r'all rights reserved|cataloging-in-publication|isbn\b', page_text, re.I):
            continue
        for pat in EXPLICIT_STORY_START:
            if pat.search(page_text[:200]):
                return idx

    # Stage 2: Sequential front-matter skipping
    start_idx = 0
    while start_idx < max_search:
        page_text = ' '.join(all_pages[start_idx].get('content', [])).strip()
        if not is_front_page(page_text):
            break
        start_idx += 1

    return start_idx

def test_samples():
    sample_ids = [
        'book-1', 'book-2', 'book-10', 'book-48', 'book-100',
        'book-114', 'book-123', 'book-144', 'book-146', 'book-149',
        'book-193', 'book-228', 'book-244', 'book-268', 'book-274',
        'book-279', 'book-292', 'book-414', 'book-434', 'book-456',
        'book-489', 'book-500', 'book-502', 'book-568', 'book-607',
        'book-647', 'book-665', 'book-675', 'book-676', 'book-719',
        'book-972', 'book-987', 'book-1000', 'book-1001', 'book-1033'
    ]

    for bid in sample_ids:
        f = f'Endoora/apps/web/public/book-data/{bid}.json'
        if not os.path.exists(f):
            continue
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
        pages = [pg for c in d.get('chapters', []) if c.get('id') != 'overview' for pg in c.get('pages', [])]
        if not pages:
            continue
        start_idx = find_book_story_start(pages)
        first_page_snip = ' '.join(pages[start_idx].get('content', []))[:120].replace('\n', ' ')
        print(f"[{bid}] \"{d.get('titleEn', '')[:30]}\" -> Skipped {start_idx}p -> Starts at: \"{first_page_snip}\"")

if __name__ == '__main__':
    test_samples()
