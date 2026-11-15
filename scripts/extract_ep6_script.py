import fitz

doc = fitz.open(r"E:\0\Work\Website\The General Website\Books and CEFR\AEF\1\AEF3e-Level-1-Video-script.pdf")

for page_num in range(len(doc)):
    text = doc[page_num].get_text()
    if "Practical English Episode 6" in text or "Jenny's last morning" in text or "last morning" in text.lower():
        print(f"=== PAGE {page_num + 1} ===")
        print(text)
