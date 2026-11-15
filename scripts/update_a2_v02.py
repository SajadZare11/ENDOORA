# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 15.6,
        "endSeconds": 16.9,
        "timeDisplay": "0:15",
        "speaker": "Receptionist",
        "textEn": "Hello, reception.",
        "textFa": "سلام، پذیرش هتل."
    },
    {
        "id": 2,
        "seconds": 16.9,
        "endSeconds": 19.5,
        "timeDisplay": "0:16",
        "speaker": "Rob",
        "textEn": "Hello. This is room 613.",
        "textFa": "سلام. از اتاق ۶۱۳ تماس می‌گیرم."
    },
    {
        "id": 3,
        "seconds": 19.5,
        "endSeconds": 21.3,
        "timeDisplay": "0:19",
        "speaker": "Receptionist",
        "textEn": "How can I help you?",
        "textFa": "چطور می‌توانم کمکتان کنم؟"
    },
    {
        "id": 4,
        "seconds": 21.5,
        "endSeconds": 23.6,
        "timeDisplay": "0:21",
        "speaker": "Rob",
        "textEn": "There's a problem with the air conditioning.",
        "textFa": "تهویه مطبوع (کولر) مشکلی دارد."
    },
    {
        "id": 5,
        "seconds": 23.8,
        "endSeconds": 26.6,
        "timeDisplay": "0:23",
        "speaker": "Rob",
        "textEn": "It isn't working, and it's very hot in my room.",
        "textFa": "کار نمی‌کند و هوای اتاقم بسیار گرم است."
    },
    {
        "id": 6,
        "seconds": 26.6,
        "endSeconds": 30.2,
        "timeDisplay": "0:26",
        "speaker": "Receptionist",
        "textEn": "I'm sorry, sir. I'll send somebody up to look at it right now.",
        "textFa": "متاسفم قربان. همین الان کسی را می‌فرستم تا آن را بررسی کند."
    },
    {
        "id": 7,
        "seconds": 30.2,
        "endSeconds": 32.5,
        "timeDisplay": "0:30",
        "speaker": "Rob",
        "textEn": "Thank you.",
        "textFa": "متشکرم."
    },
    {
        "id": 8,
        "seconds": 39.0,
        "endSeconds": 40.6,
        "timeDisplay": "0:39",
        "speaker": "Receptionist",
        "textEn": "Good evening, reception.",
        "textFa": "عصر بخیر، پذیرش هتل."
    },
    {
        "id": 9,
        "seconds": 40.6,
        "endSeconds": 43.4,
        "timeDisplay": "0:40",
        "speaker": "Rob",
        "textEn": "Hello. I'm sorry to bother you again.",
        "textFa": "سلام. ببخشید باز هم مزاحم می‌شوم."
    },
    {
        "id": 10,
        "seconds": 43.4,
        "endSeconds": 45.3,
        "timeDisplay": "0:43",
        "speaker": "Rob",
        "textEn": "This is room 613.",
        "textFa": "از اتاق ۶۱۳ هستم."
    },
    {
        "id": 11,
        "seconds": 45.3,
        "endSeconds": 46.7,
        "timeDisplay": "0:45",
        "speaker": "Receptionist",
        "textEn": "How can I help you?",
        "textFa": "چطور می‌توانم کمکتان کنم؟"
    },
    {
        "id": 12,
        "seconds": 46.7,
        "endSeconds": 48.8,
        "timeDisplay": "0:46",
        "speaker": "Rob",
        "textEn": "I have a problem with the Wi-Fi.",
        "textFa": "با اینترنت وای‌فای مشکل دارم."
    },
    {
        "id": 13,
        "seconds": 48.8,
        "endSeconds": 50.2,
        "timeDisplay": "0:48",
        "speaker": "Rob",
        "textEn": "I can't get a signal.",
        "textFa": "سیگنالی دریافت نمی‌کنم."
    },
    {
        "id": 14,
        "seconds": 50.2,
        "endSeconds": 53.4,
        "timeDisplay": "0:50",
        "speaker": "Receptionist",
        "textEn": "I'm sorry, sir. I'll put you through to IT.",
        "textFa": "عذرخواهی می‌کنم قربان. شما را به بخش فناوری اطلاعات (IT) وصل می‌کنم."
    },
    {
        "id": 15,
        "seconds": 53.4,
        "endSeconds": 54.2,
        "timeDisplay": "0:53",
        "speaker": "Rob",
        "textEn": "Thanks.",
        "textFa": "ممنون."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v02",'
end_marker = '  {\n    "id": "a2-v03",'

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
    raise ValueError("questions marker not found in existing a2-v02 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v02",
    "level": "a2",
    "episodeNumber": 2,
    "titleFa": "اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای گزارش مشکل تهویه و وای‌فای",
    "titleEn": "Episode 1 · Part 2: Calling Reception (Air Conditioning & Wi-Fi Issues)",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "0:57",
    "durationSec": 57,
    "fileName": "AEF3e_SB2_PE_Ep1_Calling _reception.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Calling _reception.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #059669, #10b981)",
    "posterIcon": "☎️",
    "summaryFa": "راب پس از رسیدن به هتل در نیویورک، در دو نوبت با پذیرش تماس می‌گیرد. در تماس اول گزارش می‌دهد که دستگاه تهویه مطبوع کار نمی‌کند و هوای اتاق ۶۱۳ بسیار گرم است که پذیرش بلافاصله قول اعزام نیروی فنی را می‌دهد. در تماس دوم، راب با عذرخواهی از مزاحمت مجدد گزارش می‌دهد که به اینترنت وای‌فای وصل نمی‌شود و سیگنال ندارد، که پذیرش او را مستقیماً به بخش فناوری اطلاعات (IT) متصل می‌کند.",
    "summaryEn": "After checking into his New York hotel room (613), Rob makes two phone calls to reception to resolve room issues. First, he reports that the air conditioning isn't working and his room is excessively hot; the receptionist apologizes and promises to send someone up immediately. Later, Rob politely calls back to report that he cannot get a Wi-Fi signal, and the receptionist transfers his call directly to IT.",
    "keyTopicsFa": [
        "معرفی شماره اتاق در تماس با پذیرش (Hello, reception / This is room 613)",
        "گزارش خرابی امکانات اتاق (There's a problem with the air conditioning / It isn't working)",
        "ابراز عذرخواهی محترمانه از تماس مجدد (I'm sorry to bother you again)",
        "گزارش مشکل اتصال به اینترنت (I have a problem with the Wi-Fi / I can't get a signal)",
        "پاسخگویی و اتصال تماس به بخش مربوطه (I'll send somebody up / I'll put you through to IT)"
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

print(f"Successfully updated a2-v02 in aef-curriculum.ts with {len(transcript)} transcript lines!")
