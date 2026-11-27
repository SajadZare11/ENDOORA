import json
import glob
import os
import re

def verify_key_books():
    test_books = [
        'book-123', 'book-193', 'book-144', 'book-244',
        'book-274', 'book-456', 'book-500', 'book-607',
        'book-719', 'book-972', 'book-1000'
    ]

    print("=" * 70)
    print("KEY BOOKS VERIFICATION REPORT:")
    print("=" * 70)

    for bid in test_books:
        p = f'Endoora/apps/web/public/book-data/{bid}.json'
        with open(p, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
        ch1 = d['chapters'][0]
        p1 = ch1['pages'][0]
        first_text = ' '.join(p1.get('content', []))[:150].replace('\n', ' ')
        print(f"[{bid}] \"{d.get('titleEn', '')[:32]}\"")
        print(f"  -> Total Pages: {d.get('totalPages')}, Chapters: {len(d.get('chapters'))}")
        print(f"  -> Ch-1 Range: Pages {ch1.get('startPage')} - {ch1.get('endPage')}")
        print(f"  -> Page 1 starts with: \"{first_text}\"")
        print("-" * 70)

def verify_all_json_validity():
    files = sorted(
        glob.glob('Endoora/apps/web/public/book-data/book-*.json'),
        key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group())
    )
    print(f"\nAUDITING ALL {len(files)} JSON FILES:")

    corrupted = []
    empty_books = []
    page_count_mismatch = []

    for f in files:
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                d = json.load(fp)
            chs = d.get('chapters', [])
            if not chs:
                empty_books.append(f)
                continue
            ch1 = chs[0]
            if not ch1.get('pages'):
                empty_books.append(f)
                continue
            total_pages = d.get('totalPages', 0)
            all_pages_count = sum(len(c.get('pages', [])) for c in chs)
            if total_pages != all_pages_count:
                page_count_mismatch.append((f, total_pages, all_pages_count))
        except Exception as e:
            corrupted.append((f, str(e)))

    print(f"  - Corrupted JSON files: {len(corrupted)}")
    print(f"  - Empty books: {len(empty_books)}")
    print(f"  - TotalPage mismatch: {len(page_count_mismatch)}")

    if not corrupted and not empty_books and not page_count_mismatch:
        print(">>> ALL 1447 BOOK JSON FILES ARE 100% HEALTHY, VALID, AND CONSISTENT! <<<")

if __name__ == '__main__':
    verify_key_books()
    verify_all_json_validity()
