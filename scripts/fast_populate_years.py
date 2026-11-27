import os
import re
import glob
import json
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
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

    # Search text of first 12 pages for copyright / publication year
    for i in range(min(12, len(doc))):
        try:
            t = doc[i].get_text()
            if not t:
                continue
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

    # Metadata
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

def process_book_task(task_args):
    jf, src_f = task_args
    try:
        with open(jf, 'r', encoding='utf-8') as fp:
            data = json.load(fp)
    except Exception:
        return (jf, None)

    # If already has a valid publishYear
    cur_year = data.get('publishYear')
    if cur_year and re.match(r'^(19\d\d|20\d\d)$', str(cur_year)):
        return (jf, cur_year)

    year_val = None
    title_en = data.get('titleEn', '')
    m_t = re.search(r'\b(19\d\d|20\d\d)\b', title_en)
    if m_t:
        y = int(m_t.group(1))
        if 1900 <= y <= 2026:
            year_val = str(y)

    if not year_val and src_f and os.path.exists(src_f):
        if not re.search(r"dictionary", src_f, re.I):
            try:
                year_val = extract_year_from_doc(src_f)
            except Exception:
                pass

    data['publishYear'] = year_val
    try:
        with open(jf, 'w', encoding='utf-8') as fp:
            json.dump(data, fp, ensure_ascii=False, indent=2)
    except Exception:
        pass

    return (jf, year_val)

def main():
    start_time = time.time()
    source_files = glob.glob(os.path.join(DOWNLOADED_DIR, "*"))
    file_map = {}
    for f in source_files:
        bname = os.path.basename(f)
        m = re.match(r"^0*(\d+)\s*-", bname)
        if m:
            b_num = int(m.group(1))
            file_map[b_num] = f

    json_files = sorted(glob.glob(os.path.join(BOOK_DATA_DIR, "book-*.json")), key=lambda x: int(re.search(r'\d+', os.path.basename(x)).group()))
    print(f"Total book JSONs to check/populate: {len(json_files)}")

    tasks = []
    for jf in json_files:
        m = re.search(r'book-(\d+)\.json$', jf)
        b_num = int(m.group(1)) if m else None
        src_f = file_map.get(b_num)
        tasks.append((jf, src_f))

    found_years = 0
    done_count = 0
    with ProcessPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(process_book_task, t) for t in tasks]
        for f in as_completed(futures):
            done_count += 1
            jf, y = f.result()
            if y:
                found_years += 1
            if done_count % 300 == 0 or done_count == len(tasks):
                elapsed = time.time() - start_time
                print(f"[{done_count}/{len(tasks)}] Done in {elapsed:.1f}s | Found years: {found_years}")

    total_time = time.time() - start_time
    print("=" * 60)
    print(f"FAST POPULATE FINISHED: Processed {done_count} books in {total_time:.1f}s")
    print(f"Total books with publication year: {found_years}")
    print("=" * 60)

if __name__ == '__main__':
    main()
