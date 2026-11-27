import pymupdf
import glob
import os
import re

files = glob.glob(r'E:\0\Work\Website\The General Website\Books and CEFR\zlib_scraper\downloaded_books\*')[:25]

for f in files:
    bname = os.path.basename(f)
    try:
        doc = pymupdf.open(f)
        meta = doc.metadata or {}
        cdate = meta.get('creationDate', '')
        # cdate is often D:20191024... or 2019
        m_year = re.search(r'(19\d\d|20\d\d)', cdate)
        year_val = m_year.group(1) if m_year else None
        
        # also search first 5 pages for copyright year
        if not year_val:
            for i in range(min(5, len(doc))):
                t = doc[i].get_text()
                m_copy = re.search(r'copyright\s+(?:©|\(c\))?\s*(19\d\d|20\d\d)', t, re.I)
                if not m_copy:
                    m_copy = re.search(r'©\s*(19\d\d|20\d\d)', t)
                if m_copy:
                    year_val = m_copy.group(1)
                    break
        doc.close()
        print(f"{bname[:40]:40} | Year: {year_val} | Author: {meta.get('author', '')[:25]}")
    except Exception as e:
        print(f"{bname[:40]:40} | Error: {e}")
