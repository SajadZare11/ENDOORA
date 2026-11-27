import os
import re
import json

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
    re.compile(r'\b(chapter|part|unit|lesson|section|act)\s+(1|one|i)\b', re.I),
    re.compile(r'\btest\s+(1|a|one)\b', re.I),
    re.compile(r'^\s*1[\.\:\-]?\s+[A-Z\s]{4,}', re.M),
]

def is_toc_page(clean: str) -> bool:
    if re.search(r'\b(table of contents|contents|inhoudsopgave)\b', clean, re.I):
        return True
    chapter_mentions = len(re.findall(r'\bchapter\b', clean, re.I))
    part_mentions = len(re.findall(r'\b(part|section)\s+[ivxlcdm\d]+\b', clean, re.I))
    if chapter_mentions >= 3 or part_mentions >= 2:
        return True
    if re.search(r'\.{3,}\s*\d+', clean):
        return True
    numbered_headings = len(re.findall(r'\b\d{1,3}\.?\s+[A-Z]', clean))
    if numbered_headings >= 4 and len(clean) < 1200:
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
    
    # Stage 1: Explicit Chapter 1 / Unit 1 marker
    for idx in range(max_search):
        page_text = ' '.join(all_pages[idx].get('content', [])).strip()
        if len(page_text) < 50 or is_toc_page(page_text):
            continue
        for pat in EXPLICIT_CHAPTER_1_PATTERNS:
            if pat.search(page_text):
                if not re.search(r'all rights reserved|cataloging-in-publication', page_text, re.I):
                    return idx

    # Stage 2: Sequential front-matter skipping
    start_idx = 0
    while start_idx < max_search:
        page_text = ' '.join(all_pages[start_idx].get('content', [])).strip()
        if not is_front_page(page_text):
            break
        start_idx += 1
        
    return start_idx

def reformat_book_data(book_json_path: str):
    with open(book_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    all_pages = []
    for c in data.get('chapters', []):
        if c.get('id') == 'overview':
            continue
        all_pages.extend(c.get('pages', []))
        
    # Check if watermark spam book or empty
    combined_text = ' '.join(' '.join(p.get('content', [])) for p in all_pages)
    words = combined_text.split()
    is_spam_or_empty = len(words) < 25 or combined_text.count('IELTSMatters') > 10 or len(set(words)) < 15
    
    title_en = data.get('titleEn', data.get('titleFa', 'کتاب'))
    
    if is_spam_or_empty or len(all_pages) == 0:
        # Fallback chapter
        new_chapters = [{
            "id": "ch-1",
            "number": 1,
            "titleFa": "فصل ۱: متن و محتوای کتاب",
            "titleEn": "Chapter 1: Book Content",
            "startPage": 1,
            "endPage": 1,
            "pages": [{
                "pageNumber": 1,
                "bookPageNumber": 1,
                "content": [
                    f"کتاب «{title_en}» یک منبع آموزشی تصویری با چیدمان چندرسانه‌ای و تمرین‌های تعاملی است.",
                    "به دلیل ساختار تمام‌صفحه و طراحی گرافیکی این اثر، مطالعه آن از طریق فایل اصلی کیفیت بسیار بالاتری دارد.",
                    "می‌توانید نسخه اصلی کامل را همراه با تمامی ضمائم از بخش دانلود دریافت نمایید."
                ]
            }]
        }]
    else:
        start_idx = find_book_story_start(all_pages)
        kept_pages = all_pages[start_idx:]
        if not kept_pages:
            kept_pages = all_pages
            
        PAGE_CHUNK = 10
        new_chapters = []
        total_p = len(kept_pages)
        
        for i in range(0, total_p, PAGE_CHUNK):
            slice_p = kept_pages[i:i + PAGE_CHUNK]
            ch_idx = (i // PAGE_CHUNK) + 1
            start_p = i + 1
            end_p = i + len(slice_p)
            
            ch_pages = []
            for local_idx, p in enumerate(slice_p):
                ch_pages.append({
                    "pageNumber": local_idx + 1,
                    "bookPageNumber": start_p + local_idx,
                    "content": p.get("content", [])
                })
                
            new_chapters.append({
                "id": f"ch-{ch_idx}",
                "number": ch_idx,
                "titleFa": f"فصل {ch_idx}",
                "titleEn": f"Chapter {ch_idx}",
                "startPage": start_p,
                "endPage": end_p,
                "pages": ch_pages
            })
            
    data['chapters'] = new_chapters
    return data

# Test on 4 sample books
for bid in [1, 48, 110, 1000]:
    p = f"Endoora/apps/web/public/book-data/book-{bid}.json"
    res = reformat_book_data(p)
    ch1 = res['chapters'][0]
    p1 = ch1['pages'][0]
    print(f"Book {bid}: {len(res['chapters'])} chapters | Ch1: id={ch1['id']} num={ch1['number']} | P1 (bookPage {p1['bookPageNumber']}): {' '.join(p1['content'])[:100]}...")
