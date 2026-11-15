# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 8.0,
        "endSeconds": 10.0,
        "timeDisplay": "0:08",
        "speaker": "Jenny",
        "textEn": "Could you call me a taxi, please?",
        "textFa": "می‌شود لطفاً برای من یک تاکسی بگیرید؟"
    },
    {
        "id": 2,
        "seconds": 10.1,
        "endSeconds": 12.0,
        "timeDisplay": "0:10",
        "speaker": "Receptionist",
        "textEn": "Yes, of course. Where to?",
        "textFa": "بله، البته. به چه مقصدی؟"
    },
    {
        "id": 3,
        "seconds": 12.3,
        "endSeconds": 13.5,
        "timeDisplay": "0:12",
        "speaker": "Jenny",
        "textEn": "To Paddington Station.",
        "textFa": "به ایستگاه پدینگتون."
    },
    {
        "id": 4,
        "seconds": 13.8,
        "endSeconds": 15.1,
        "timeDisplay": "0:13",
        "speaker": "Receptionist",
        "textEn": "And when would you like it for?",
        "textFa": "و برای چه زمانی می‌خواهید؟"
    },
    {
        "id": 5,
        "seconds": 15.4,
        "endSeconds": 16.5,
        "timeDisplay": "0:15",
        "speaker": "Jenny",
        "textEn": "Now, please.",
        "textFa": "الان، لطفاً."
    },
    {
        "id": 6,
        "seconds": 36.0,
        "endSeconds": 37.5,
        "timeDisplay": "0:36",
        "speaker": "Jenny",
        "textEn": "How much is that?",
        "textFa": "کرایه‌اش چقدر می‌شود؟"
    },
    {
        "id": 7,
        "seconds": 37.9,
        "endSeconds": 42.1,
        "timeDisplay": "0:37",
        "speaker": "Taxi driver",
        "textEn": "That's 13.60, please.",
        "textFa": "می‌شود ۱۳ پوند و ۶۰ پنس، لطفاً."
    },
    {
        "id": 8,
        "seconds": 46.0,
        "endSeconds": 48.0,
        "timeDisplay": "0:46",
        "speaker": "Jenny",
        "textEn": "Make it 15 pounds.",
        "textFa": "۱۵ پوند حساب کنید (بقیه‌اش انعام)."
    },
    {
        "id": 9,
        "seconds": 48.8,
        "endSeconds": 49.8,
        "timeDisplay": "0:48",
        "speaker": "Jenny",
        "textEn": "And could I have a receipt?",
        "textFa": "و ممکن است یک رسید هم به من بدهید؟"
    },
    {
        "id": 10,
        "seconds": 50.4,
        "endSeconds": 51.5,
        "timeDisplay": "0:50",
        "speaker": "Taxi driver",
        "textEn": "Thank you very much, madam.",
        "textFa": "بسیار متشکرم، خانم."
    },
    {
        "id": 11,
        "seconds": 61.8,
        "endSeconds": 64.9,
        "timeDisplay": "1:01",
        "speaker": "Jenny",
        "textEn": "Could I have a ticket to Heathrow Airport, please?",
        "textFa": "می‌شود یک بلیط به مقصد فرودگاه هیترو به من بدهید، لطفاً؟"
    },
    {
        "id": 12,
        "seconds": 65.2,
        "endSeconds": 66.4,
        "timeDisplay": "1:05",
        "speaker": "Ticket clerk",
        "textEn": "Single or return?",
        "textFa": "یک‌طرفه یا رفت و برگشت؟"
    },
    {
        "id": 13,
        "seconds": 67.0,
        "endSeconds": 67.8,
        "timeDisplay": "1:07",
        "speaker": "Jenny",
        "textEn": "Single, please.",
        "textFa": "یک‌طرفه، لطفاً."
    },
    {
        "id": 14,
        "seconds": 68.3,
        "endSeconds": 69.9,
        "timeDisplay": "1:08",
        "speaker": "Ticket clerk",
        "textEn": "Standard or first class?",
        "textFa": "عادی (استاندارد) یا درجه یک (فرست کلاس)؟"
    },
    {
        "id": 15,
        "seconds": 70.4,
        "endSeconds": 71.3,
        "timeDisplay": "1:10",
        "speaker": "Jenny",
        "textEn": "Standard, please.",
        "textFa": "عادی، لطفاً."
    },
    {
        "id": 16,
        "seconds": 72.6,
        "endSeconds": 74.1,
        "timeDisplay": "1:12",
        "speaker": "Ticket clerk",
        "textEn": "That's 18 pounds.",
        "textFa": "می‌شود ۱۸ پوند."
    },
    {
        "id": 17,
        "seconds": 74.7,
        "endSeconds": 75.9,
        "timeDisplay": "1:14",
        "speaker": "Jenny",
        "textEn": "Can I pay by credit card?",
        "textFa": "می‌توانم با کارت اعتباری پرداخت کنم؟"
    },
    {
        "id": 18,
        "seconds": 76.1,
        "endSeconds": 77.0,
        "timeDisplay": "1:16",
        "speaker": "Ticket clerk",
        "textEn": "Yes, of course.",
        "textFa": "بله، البته."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a1-v17",'
end_marker = '  {\n    "id": "a1-v18",'

start_idx = content.find(start_marker)
if start_idx == -1:
    raise ValueError("start_marker not found")

end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    raise ValueError("end_marker not found")

existing_block = content[start_idx:end_idx]

# Extract questions from existing_block
q_marker = '"questions": {'
q_idx = existing_block.find(q_marker)
if q_idx == -1:
    raise ValueError("questions marker not found in existing a1-v17 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a1-v17",
    "level": "a1",
    "episodeNumber": 17,
    "titleFa": "اپیزود ۶ · بخش ۲: رفتن به فرودگاه، تاکسی و خرید بلیط قطار",
    "titleEn": "Episode 6 · Part 2: Getting to the Airport (Taxi & Train Ticket)",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:20",
    "durationSec": 80,
    "fileName": "AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
    "posterIcon": "🚕",
    "summaryFa": "جنی برای عزیمت به فرودگاه هیترو آماده می‌شود. ابتدا از پذیرش هتل می‌خواهد یک تاکسی به ایستگاه پدینگتون خبر کند. در تاکسی کرایه ۱۳.۶۰ پوندی را با احتساب انعام، ۱۵ پوند پرداخت کرده و رسید دریافت می‌کند. سپس در باجه ایستگاه پدینگتون یک بلیط یک‌طرفه درجه عادی (استاندارد) به مقصد فرودگاه هیترو به قیمت ۱۸ پوند با کارت اعتباری خریداری می‌کند.",
    "summaryEn": "Jenny prepares to head to Heathrow Airport. At the hotel reception, she asks for a taxi to Paddington Station. After arriving, she pays the driver 15 pounds (including tip on a £13.60 fare) and asks for a receipt. At Paddington Station, she purchases a single standard ticket to Heathrow Airport for £18 using her credit card.",
    "keyTopicsFa": [
        "درخواست تاکسی از پذیرش هتل (Could you call me a taxi, please? / Where to?)",
        "تعیین زمان حضور تاکسی (When would you like it for? / Now, please)",
        "پرسیدن کرایه تاکسی و پرداخت انعام (How much is that? / Make it 15 pounds)",
        "درخواست رسید از راننده (Could I have a receipt?)",
        "خرید بلیط قطار به فرودگاه (Could I have a ticket to Heathrow Airport, please?)",
        "تعیین نوع بلیط (Single or return? / Standard or first class?)",
        "پرداخت با کارت اعتباری (Can I pay by credit card? / Yes, of course)"
    ],
    "transcript": transcript
}

header_json = json.dumps(new_lesson_header, ensure_ascii=False, indent=2)
header_json_without_end = header_json.rstrip().rstrip('}')

indented_lines = []
for line in header_json_without_end.split('\n'):
    indented_lines.append("  " + line)

# Reconstruct block
new_block = "\n".join(indented_lines) + ",\n    " + questions_text + "\n  },\n"

new_content = content[:start_idx] + new_block + content[end_idx:]

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated a1-v17 in aef-curriculum.ts with {len(transcript)} transcript lines!")
