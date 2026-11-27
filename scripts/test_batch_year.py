import os
import re
import glob
import json
import pymupdf

DOWNLOADED_DIR = r"E:\0\Work\Website\The General Website\Books and CEFR\zlib_scraper\downloaded_books"

def extract_year_from_doc(file_path: str) -> str | None:
    try:
        doc = pymupdf.open(file_path)
    except Exception:
        return None

    # 1. Search text of first 10 pages for copyright / publication year
    for i in range(min(12, len(doc))):
        try:
            t = doc[i].get_text()
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

            m3 = re.search(r'\b(published|first published)\s+(?:in\s+)?(19\d\d|20\d\d)\b', t, re.I)
            if m3:
                y = int(m3.group(2))
                if 1900 <= y <= 2026:
                    doc.close()
                    return str(y)
        except Exception:
            pass

    # 2. Check metadata creationDate / modDate
    meta = doc.metadata or {}
    cdate = meta.get('creationDate', '') or meta.get('modDate', '')
    m_date = re.search(r'(19\d\d|20\d\d)', cdate)
    if m_date:
        y = int(m_date.group(1))
        if 1990 <= y <= 2026:
            doc.close()
            return str(y)

    doc.close()
    return None

files = glob.glob(os.path.join(DOWNLOADED_DIR, "*"))[:30]
for f in files:
    bname = os.path.basename(f)
    y = extract_year_from_doc(f)
    print(f"{bname[:45]:45} -> Year: {y}")
