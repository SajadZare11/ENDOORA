import fitz

doc = fitz.open(r"E:\0\Work\Website\The General Website\Books and CEFR\AEF\1\AEF3e-Level-1-Video-script.pdf")
print("Total pages:", len(doc))

found_pages = []
for page_num in range(len(doc)):
    text = doc[page_num].get_text()
    if "The end of the meal" in text or "Rob Walker" in text or "birthday" in text:
        found_pages.append((page_num, text))

for p, text in found_pages:
    print(f"=== PAGE {p+1} ===")
    print(text)
