import os
import re
import sys
import json
import subprocess

BASE_DIR = r"E:\0\Work\Website\The General Website"
DOWNLOADED_BOOKS_DIR = os.path.join(BASE_DIR, "Books and CEFR", "zlib_scraper", "downloaded_books")
BOOK_DATA_DIR = os.path.join(BASE_DIR, "Endoora", "apps", "web", "public", "book-data")

def process_worker(file_name: str, file_path: str):
    import pymupdf

    m = re.match(r"^0*(\d+)\s*-\s*(.+)\.(pdf|epub|mobi)$", file_name, re.I)
    if not m:
        return

    book_num = int(m.group(1))
    book_id = f"book-{book_num}"
    json_path = os.path.join(BOOK_DATA_DIR, f"{book_id}.json")

    # Skip if already has structured pages
    if book_meta and book_meta.get("chapters"):
        chs = book_meta["chapters"]
        if chs and all("pages" in ch and len(ch.get("pages", [])) > 0 for ch in chs):
            return

    book_meta = {}
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                book_meta = json.load(f)
        except Exception:
            book_meta = {}

    if not book_meta:
        book_meta = {
            "id": book_id,
            "titleFa": f"کتاب {m.group(2).strip()}",
            "titleEn": m.group(2).strip(),
            "author": "مؤلفین برجسته بین‌المللی",
            "genre": "دوره‌های آموزشی و مراجع زبان",
            "level": "تمام سطوح",
            "introFa": f"این اثر ارزشمند با عنوان «{m.group(2).strip()}» جهت ارتقای مهارت‌های زبانی و مطالعه روان ارائه شده است.",
            "readingTipsFa": [
                "مطالعه پیوسته صفحات و یادداشت واژگان جدید به تثبیت آموخته‌ها کمک می‌کند.",
                "از امکان تغییر اندازه قلم و تم شب/روز برای مطالعه راحت‌تر استفاده نمایید."
            ],
            "chapters": []
        }

    SPAM_PATTERNS = [
        re.compile(r"ieltsmatters(\.com)?", re.I),
        re.compile(r"telegram:@ieltsmatters", re.I),
        re.compile(r"instagram:@ielts_matters", re.I),
        re.compile(r"www\.languagecentre\.ir", re.I),
        re.compile(r"languagecentre\.ir", re.I),
        re.compile(r"z-lib(\.org|\.is)?", re.I),
        re.compile(r"worldmags\.net", re.I),
        re.compile(r"downloaded from", re.I),
        re.compile(r"www\.frenglish\.ru", re.I),
    ]

    def clean_text(raw_text: str) -> list[str]:
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        cleaned = [l for l in lines if not any(pat.search(l) for pat in SPAM_PATTERNS)]
        combined = "\n".join(cleaned)
        paras = []
        for p in combined.split("\n\n"):
            norm = " ".join(p.split())
            if len(norm) > 15:
                paras.append(norm)
        if not paras and cleaned:
            cur = []
            for line in cleaned:
                cur.append(line)
                if len(" ".join(cur)) > 200:
                    paras.append(" ".join(cur))
                    cur = []
            if cur:
                paras.append(" ".join(cur))
        return paras

    def chunk_paras(paras: list[str], size: int = 3) -> list[dict]:
        pages = []
        for i in range(0, len(paras), size):
            chunk = paras[i:i + size]
            p_num = (i // size) + 1
            pages.append({
                "pageNumber": p_num,
                "bookPageNumber": p_num,
                "content": chunk
            })
        return pages

    extracted_pages = []
    if not is_dictionary:
        try:
            doc = pymupdf.open(file_path)
            total_doc_pages = min(len(doc), 350) # Cap at 350 pages for reading performance
            for p_idx in range(total_doc_pages):
                try:
                    p_text = doc[p_idx].get_text()
                    paras = clean_text(p_text)
                    if paras:
                        extracted_pages.append({
                            "bookPageNumber": p_idx + 1,
                            "content": paras
                        })
                except Exception:
                    pass
            doc.close()
        except Exception:
            extracted_pages = []

    if len(extracted_pages) >= 2:
        chapters = []
        old_overview = None
        for ch in book_meta.get("chapters", []):
            if ch.get("id") == "overview":
                old_overview = ch
                break

        if old_overview:
            if not old_overview.get("pages"):
                old_overview["pages"] = chunk_paras(old_overview.get("content", []), 4)
            chapters.append(old_overview)

        PAGE_CHUNK = 10
        total_p = len(extracted_pages)
        for i in range(0, total_p, PAGE_CHUNK):
            slice_p = extracted_pages[i:i + PAGE_CHUNK]
            ch_idx = (i // PAGE_CHUNK) + 1
            start_p = slice_p[0]["bookPageNumber"]
            end_p = slice_p[-1]["bookPageNumber"]

            ch_pages = []
            all_paras = []
            for local_idx, p in enumerate(slice_p):
                ch_pages.append({
                    "pageNumber": local_idx + 1,
                    "bookPageNumber": p["bookPageNumber"],
                    "content": p["content"]
                })
                all_paras.extend(p["content"])

            chapters.append({
                "id": f"ch-{ch_idx}",
                "number": ch_idx,
                "titleFa": f"فصل {ch_idx}: صفحات {start_p} تا {end_p}",
                "titleEn": f"Chapter {ch_idx}: Pages {start_p} to {end_p}",
                "subtitle": f"{len(ch_pages)} صفحه مطالعه متن اصلی",
                "startPage": start_p,
                "endPage": end_p,
                "pages": ch_pages,
                "content": all_paras
            })

        book_meta["chapters"] = chapters
        book_meta["totalPages"] = total_p
        book_meta["extractedFromLocalFile"] = True
    else:
        existing_chapters = book_meta.get("chapters", [])
        total_p = 0
        for ch in existing_chapters:
            if not ch.get("pages"):
                content = ch.get("content", [])
                ch["pages"] = chunk_paras(content, 3)
            total_p += len(ch.get("pages", []))
        book_meta["totalPages"] = total_p

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(book_meta, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--single":
        fname = sys.argv[2]
        fpath = sys.argv[3]
        process_worker(fname, fpath)
        sys.exit(0)

    # Master runner
    print("Master runner started...")
    files = sorted(os.listdir(DOWNLOADED_BOOKS_DIR))
    print(f"Total books to process: {len(files)}")

    processed = 0
    skipped_or_timeout = 0

    for idx, f in enumerate(files):
        if not re.match(r"^0*(\d+)\s*-\s*(.+)\.(pdf|epub|mobi)$", f, re.I):
            continue
        path = os.path.join(DOWNLOADED_BOOKS_DIR, f)
        
        # Run worker with 10s timeout
        try:
            res = subprocess.run(
                [sys.executable, __file__, "--single", f, path],
                timeout=12,
                capture_output=True
            )
            processed += 1
        except subprocess.TimeoutExpired:
            skipped_or_timeout += 1
            print(f"[TIMEOUT SKIP] {f}")
        except Exception as e:
            skipped_or_timeout += 1

        if processed % 100 == 0:
            print(f"Processed {processed} books... (Timeouts/Errors: {skipped_or_timeout})")

    # Final pass: Ensure any book JSON without local file also has pages structure
    print("Final pass on remaining JSON files...")
    all_json = os.listdir(BOOK_DATA_DIR)
    for jf in all_json:
        if not jf.endswith(".json"):
            continue
        jpath = os.path.join(BOOK_DATA_DIR, jf)
        try:
            with open(jpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            changed = False
            for ch in data.get("chapters", []):
                if not ch.get("pages"):
                    paras = ch.get("content", [])
                    p_list = []
                    for i in range(0, len(paras), 3):
                        p_list.append({
                            "pageNumber": (i // 3) + 1,
                            "bookPageNumber": (i // 3) + 1,
                            "content": paras[i:i + 3]
                        })
                    ch["pages"] = p_list
                    changed = True
            if changed:
                with open(jpath, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    print(f"DONE! Processed {processed} books. Timeouts: {skipped_or_timeout}")
