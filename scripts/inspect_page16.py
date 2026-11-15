import fitz

doc = fitz.open(r"E:\0\Work\Website\The General Website\Books and CEFR\AEF\1\AEF3e-Level-1-Video-script.pdf")
print("Page 16:")
print(doc[15].get_text())
