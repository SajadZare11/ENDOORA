import os
import json

BOOK_DATA_DIR = r"E:\0\Work\Website\The General Website\Endoora\apps\web\public\book-data"

def chunk_paras(paras: list[str], size: int = 3) -> list[dict]:
    pages = []
    if not paras:
        return []
    for i in range(0, len(paras), size):
        chunk = paras[i:i + size]
        p_num = (i // size) + 1
        pages.append({
            "pageNumber": p_num,
            "bookPageNumber": p_num,
            "content": chunk
        })
    return pages

def fix_all():
    files = [f for f in os.listdir(BOOK_DATA_DIR) if f.endswith(".json")]
    print(f"Auditing and fixing {len(files)} JSON files...")

    fixed_count = 0
    for f in files:
        path = os.path.join(BOOK_DATA_DIR, f)
        try:
            with open(path, "r", encoding="utf-8") as jf:
                data = json.load(jf)

            changed = False
            chapters = data.get("chapters", [])

            # If chapters is empty, create an overview chapter
            if not chapters:
                title_fa = data.get("titleFa", "این اثر آموزشی")
                author = data.get("author", "مؤلفین برجسته")
                level = data.get("level", "تمام سطوح")
                intro = data.get("introFa", "این منبع ارزشمند برای تقویت مهارت‌های زبانی در دسترس قرار گرفته است.")
                
                guide_content = [
                    f"به بخش مطالعه اختصاصی «{title_fa}» خوش آمدید.",
                    intro,
                    f"این اثر تألیف «{author}» بوده و برای سطح ارزیابی‌شده {level} بهینه‌سازی گردیده است.",
                    "متن کامل و فایل اصلی این اثر از تب «📥 نسخه اصلی فایل» با بالاترین سرعت و به‌صورت مستقیم قابل دریافت است.",
                    "همچنین می‌توانید نکات کلیدی و واژگان جدید را حین مطالعه با کلیک روی کلمات یا یادداشت‌برداری تمرین کنید."
                ]
                
                chapters = [{
                    "id": "overview",
                    "number": "راهنما",
                    "titleFa": "نمای کلی و راهنمای مطالعه",
                    "titleEn": "Overview & Study Guide",
                    "subtitle": "نقشه راه مطالعه و تسلط بر اثر",
                    "startPage": 1,
                    "endPage": 2,
                    "pages": chunk_paras(guide_content, 3),
                    "content": guide_content
                }]
                data["chapters"] = chapters
                data["totalPages"] = len(chapters[0]["pages"])
                changed = True

            # If chapters exist, ensure EVERY chapter has pages
            total_pages = 0
            for idx, ch in enumerate(chapters):
                pages = ch.get("pages")
                if not pages or len(pages) == 0:
                    content = ch.get("content", [])
                    if not content:
                        content = [
                            f"محتوای درس {ch.get('titleFa', idx + 1)} در حال آماده‌سازی و پالایش تکمیلی است.",
                            "جهت دریافت نسخه فیزیکی و باکیفیت کامل اثر می‌توانید به تب «نسخه اصلی PDF» مراجعه فرمایید."
                        ]
                        ch["content"] = content
                    ch["pages"] = chunk_paras(content, 3)
                    changed = True
                total_pages += len(ch.get("pages", []))

            if not data.get("totalPages") or data.get("totalPages") == 0:
                data["totalPages"] = total_pages
                changed = True

            if changed:
                with open(path, "w", encoding="utf-8") as jf:
                    json.dump(data, jf, ensure_ascii=False, indent=2)
                fixed_count += 1

        except Exception as e:
            print(f"Error on {f}: {e}")

    print(f"Finished! Successfully fixed and ensured pages for {fixed_count} books.")

if __name__ == "__main__":
    fix_all()
