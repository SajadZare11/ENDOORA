import os
import urllib.request
import sys

URLS = [
    "https://ieltstrainingonline.com/wp-content/uploads/2023/06/cam18-test1-part1.mp3",
    "https://ieltstrainingonline.com/wp-content/uploads/2023/06/cam18-test1-part2.mp3",
    "https://ieltstrainingonline.com/wp-content/uploads/2023/06/cam18-test1-part3.mp3",
    "https://ieltstrainingonline.com/wp-content/uploads/2023/06/cam18-test1-part4.mp3"
]

TEMP_DIR = r"E:\0\Work\Website\The General Website\Endoora\scripts\temp_c18"
OUTPUT_LOCAL = r"E:\0\Work\Website\The General Website\Endoora\apps\web\public\audio\ielts\c18_test1_listening.mp3"
OUTPUT_LOCAL_ALIAS = r"E:\0\Work\Website\The General Website\Endoora\apps\web\public\audio\ielts\c18-acad-t1_listening.mp3"
OUTPUT_REPO = r"E:\0\Work\Website\The General Website\ielts-listening\audio\c18_test1_listening.mp3"
OUTPUT_REPO_ACAD = r"E:\0\Work\Website\The General Website\ielts-listening\audio\c18-acad-t1_listening.mp3"

os.makedirs(TEMP_DIR, exist_ok=True)
part_files = []

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

for i, url in enumerate(URLS, 1):
    part_path = os.path.join(TEMP_DIR, f"part{i}.mp3")
    print(f"Downloading Part {i}: {url}...")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as response, open(part_path, "wb") as out_file:
        data = response.read()
        out_file.write(data)
        print(f"  Saved Part {i} ({len(data)} bytes)")
    part_files.append(part_path)

print("Concatenating MP3 parts into full authentic test...")
with open(OUTPUT_LOCAL, "wb") as outfile:
    for pf in part_files:
        with open(pf, "rb") as infile:
            outfile.write(infile.read())

total_size = os.path.getsize(OUTPUT_LOCAL)
print(f"Generated {OUTPUT_LOCAL} (Total size: {total_size} bytes)")

# Copy to aliases
import shutil
shutil.copy2(OUTPUT_LOCAL, OUTPUT_LOCAL_ALIAS)
shutil.copy2(OUTPUT_LOCAL, OUTPUT_REPO)
shutil.copy2(OUTPUT_LOCAL, OUTPUT_REPO_ACAD)
print("Copied to all public and repo locations successfully!")
