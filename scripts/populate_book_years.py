import os
import re
import glob
import json
import time
import pymupdf

BASE_DIR = r"E:\0\Work\Website\The General Website"
DOWNLOADED_DIR = os.path.join(BASE_DIR, "Books and CEFR", "zlib_scraper", "downloaded_books")
BOOK_DATA_DIR = os.path.join(BASE_DIR, "Endoora", "apps", "web", "public", "book-data")

def extract_year_from_doc(file_path: str) -> str | None:
    try:
        doc = pymupdf.open(file_path)
    except Exception:
        return None

    if len(doc) == 0:
        return None

    # 1. Search text of first 12 pages for copyright / publication year
    for i in range(min(12, len(doc))):
        try:
            t = doc[i].get_text()
            if not t:
                continue
            # Copyright regex
            m = re.search(r'copyright\s+(?:©|\(c\))?\s*(19\d\d|20\d\d)', t, re.I)
            if m:
                y = int(m.group(1))
                if 1900 <= y <= 2026:
                    doc.close()
                    return str(y)
                    
            m2 = re.search(r'©\s*(19\d\d|20\d\d)', t)
            if m2:
                y = int(m2.group(1))
                if 1900 <= y <= 2026:
                    doc.close()
                    return str(y)

            m3 = re.search(r'\b(first published|published in|edition)\s+(?:in\s+)?(19\d\d|20\d\d)\b', t, re.I)
            if m3:
                y = int(m3.group(2))
                if 1900 <= y <= 2026:
                    doc.close()
                    return str(y)
        except Exception:
            pass

    # 2. Check metadata
    try:
        meta = doc.metadata or {}
        cdate = meta.get('creationDate', '') or meta.get('modDate', '')
        m_date = re.search(r'(19\d\d|20\d\d)', cdate)
        if m_date:
            y = int(m_date.group(1))
            if 1990 <= y <= 2026:
                doc.close()
                return str(y)
    except Exception:
        pass

    doc.close()
    return None

def main():
    start_time = time.time()
    
    # 1. Build map of book number -> source file path
    source_files = glob.glob(os.path.join(DOWNLOADED_DIR, "*"))
    file_map = {}
    for f in source_files:
        bname = os.path.basename(f)
        m = re.match(r"^0*(\d+)\s*-", bname)
        if m:
            b_num = int(m.group(1))
            file_map[b_num] = f

    print(f"Mapped {len(file_map)} source files.")

    # 2. Iterate through all 1447 book JSON files
    json_files = sorted(glob.glob(os.path.join(BOOK_DATA_DIR, "book-*.json")), key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group()))
    print(f"Processing {len(json_files)} book data files...")

    found_years = 0
    total_processed = 0

    for idx, jf in enumerate(json_files):
        m = re.search(r'book-(\d+)\.json$', jf)
        if not m:
            continue
        b_num = int(m.group(1))
        
        try:
            with open(jf, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
        except Exception:
            continue

        year_val = None
        # Check if year is in title (e.g. "American English File Starter (2020)" or "(2000)")
        title_en = data.get('titleEn', '')
        m_t = re.search(r'\b(19\d\d|20\d\d)\b', title_en)
        if m_t:
            y = int(m_t.group(1))
            if 1900 <= y <= 2026:
                year_val = str(y)

        # Check source file
        if not year_val and b_num in file_map:
            src_f = file_map[b_num]
            # Avoid hanging dictionary or corrupt files
            if not re.search(r"dictionary", src_f, re.I):
                try:
                    year_val = extract_year_from_doc(src_f)
                except Exception:
                    pass

        data['publishYear'] = year_val
        found_years += 1 if year_val else 0
        total_processed += 1

        with open(jf, 'w', encoding='utf-8') as fp:
            json.dump(data, fp, ensure_ascii=False, indent=2)

        if (idx + 1) % 200 == 0 or (idx + 1) == len(json_files):
            elapsed = time.time() - start_time
            print(f"[{idx + 1}/{len(json_files)}] ({elapsed:.1f}s) - Found years: {found_years} | Last: book-{b_num} (Year: {year_val})")

    duration = time.time() - start_time
    print("=" * 60)
    print(f"COMPLETED: Processed {total_processed} books in {duration:.1f}s")
    print(f"Successfully extracted publishYear for {found_years} books.")
    print("=" * 60)

if __name__ == '__main__':
    main()
