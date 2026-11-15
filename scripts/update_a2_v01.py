# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 8.9,
        "endSeconds": 12.3,
        "timeDisplay": "0:08",
        "speaker": "Jenny",
        "textEn": "My name's Jenny Zielinski.",
        "textFa": "نام من جنی زیلینسکی است."
    },
    {
        "id": 2,
        "seconds": 15.4,
        "endSeconds": 19.8,
        "timeDisplay": "0:15",
        "speaker": "Jenny",
        "textEn": "I live and work in New York.",
        "textFa": "من در نیویورک زندگی و کار می‌کنم."
    },
    {
        "id": 3,
        "seconds": 24.5,
        "endSeconds": 29.5,
        "timeDisplay": "0:24",
        "speaker": "Jenny",
        "textEn": "I'm the assistant editor of a magazine called New York 24/7.",
        "textFa": "من دستیار سردبیر مجله‌ای به نام New York 24/7 هستم."
    },
    {
        "id": 4,
        "seconds": 32.6,
        "endSeconds": 41.1,
        "timeDisplay": "0:32",
        "speaker": "Jenny",
        "textEn": "A few months ago, I visited our office in London to learn more about the company.",
        "textFa": "چند ماه پیش، برای آشنایی بیشتر با شرکت از دفترمان در لندن بازدید کردم."
    },
    {
        "id": 5,
        "seconds": 43.3,
        "endSeconds": 44.1,
        "timeDisplay": "0:43",
        "speaker": "Daniel",
        "textEn": "How nice to meet you.",
        "textFa": "از دیدارتان بسیار خوش‌وقتم."
    },
    {
        "id": 6,
        "seconds": 44.1,
        "endSeconds": 46.8,
        "timeDisplay": "0:44",
        "speaker": "Jenny",
        "textEn": "I met the manager, Daniel O'Connor.",
        "textFa": "من با مدیر، دانیل اوکانر، ملاقات کردم."
    },
    {
        "id": 7,
        "seconds": 46.8,
        "endSeconds": 48.8,
        "timeDisplay": "0:46",
        "speaker": "Daniel",
        "textEn": "Would you like something to drink? Tea, coffee?",
        "textFa": "چیزی برای نوشیدن میل دارید؟ چای، قهوه؟"
    },
    {
        "id": 8,
        "seconds": 48.8,
        "endSeconds": 55.3,
        "timeDisplay": "0:48",
        "speaker": "Jenny",
        "textEn": "I had lots of meetings with him, of course, and a working dinner on my birthday.",
        "textFa": "البته جلسات کاری زیادی با او داشتم و در روز تولدم یک شام کاری با هم خوردیم."
    },
    {
        "id": 9,
        "seconds": 55.3,
        "endSeconds": 56.5,
        "timeDisplay": "0:55",
        "speaker": "Daniel",
        "textEn": "Would you like to go somewhere else?",
        "textFa": "دوست داری جای دیگری برویم؟"
    },
    {
        "id": 10,
        "seconds": 56.9,
        "endSeconds": 59.9,
        "timeDisplay": "0:56",
        "speaker": "Jenny",
        "textEn": "But I spent more time with Rob Walker.",
        "textFa": "اما من زمان بیشتری را با راب واکر گذراندم."
    },
    {
        "id": 11,
        "seconds": 61.3,
        "endSeconds": 64.0,
        "timeDisplay": "1:01",
        "speaker": "Jenny",
        "textEn": "He's one of the writers on the London magazine.",
        "textFa": "او یکی از نویسندگان مجله لندن است."
    },
    {
        "id": 12,
        "seconds": 64.8,
        "endSeconds": 65.5,
        "timeDisplay": "1:04",
        "speaker": "Rob",
        "textEn": "A double espresso.",
        "textFa": "یک اسپرسوی دبل."
    },
    {
        "id": 13,
        "seconds": 66.2,
        "endSeconds": 66.9,
        "timeDisplay": "1:06",
        "speaker": "Jenny",
        "textEn": "Oh, wow.",
        "textFa": "اوه، واو."
    },
    {
        "id": 14,
        "seconds": 67.1,
        "endSeconds": 68.6,
        "timeDisplay": "1:07",
        "speaker": "Jenny",
        "textEn": "We had coffees together.",
        "textFa": "ما با هم قهوه خوردیم."
    },
    {
        "id": 15,
        "seconds": 69.5,
        "endSeconds": 70.8,
        "timeDisplay": "1:09",
        "speaker": "Jenny",
        "textEn": "We went sightseeing.",
        "textFa": "به دیدن جاهای دیدنی شهر رفتیم."
    },
    {
        "id": 16,
        "seconds": 70.8,
        "endSeconds": 73.5,
        "timeDisplay": "1:10",
        "speaker": "Rob",
        "textEn": "Hey, let's go inside the Tate Modern right now.",
        "textFa": "هی، بیا الان بریم داخل گالری تیت مدرن."
    },
    {
        "id": 17,
        "seconds": 74.4,
        "endSeconds": 74.9,
        "timeDisplay": "1:14",
        "speaker": "Rob",
        "textEn": "So, what do you think?",
        "textFa": "خب، نظرت چیه؟"
    },
    {
        "id": 18,
        "seconds": 74.9,
        "endSeconds": 77.2,
        "timeDisplay": "1:14",
        "speaker": "Jenny",
        "textEn": "I even helped Rob buy a shirt.",
        "textFa": "حتی به راب کمک کردم یک پیراهن بخرد."
    },
    {
        "id": 19,
        "seconds": 77.5,
        "endSeconds": 77.9,
        "timeDisplay": "1:17",
        "speaker": "Shop Assistant",
        "textEn": "OK.",
        "textFa": "خیلی خب."
    },
    {
        "id": 20,
        "seconds": 78.4,
        "endSeconds": 80.0,
        "timeDisplay": "1:18",
        "speaker": "Jenny",
        "textEn": "He was fun to be with.",
        "textFa": "بودن در کنار او خیلی لذت‌بخش بود."
    },
    {
        "id": 21,
        "seconds": 80.0,
        "endSeconds": 80.5,
        "timeDisplay": "1:20",
        "speaker": "Rob",
        "textEn": "Great.",
        "textFa": "عالیه."
    },
    {
        "id": 22,
        "seconds": 80.6,
        "endSeconds": 81.9,
        "timeDisplay": "1:20",
        "speaker": "Jenny",
        "textEn": "I liked him a lot.",
        "textFa": "من از او خیلی خوشم آمد."
    },
    {
        "id": 23,
        "seconds": 82.5,
        "endSeconds": 85.5,
        "timeDisplay": "1:22",
        "speaker": "Jenny",
        "textEn": "I think he liked me, too.",
        "textFa": "فکر می‌کنم او هم از من خوشش آمد."
    },
    {
        "id": 24,
        "seconds": 86.8,
        "endSeconds": 93.3,
        "timeDisplay": "1:26",
        "speaker": "Jenny",
        "textEn": "Rob isn't the most punctual person in the world, but he is a great writer.",
        "textFa": "راب وقت‌شناس‌ترین فرد دنیا نیست، اما نویسنده فوق‌العاده‌ای است."
    },
    {
        "id": 25,
        "seconds": 95.2,
        "endSeconds": 100.3,
        "timeDisplay": "1:35",
        "speaker": "Jenny",
        "textEn": "We invited him to work for the New York magazine for a month, and he agreed.",
        "textFa": "ما از او دعوت کردیم تا به مدت یک ماه برای مجله نیویورک کار کند، و او پذیرفت."
    },
    {
        "id": 26,
        "seconds": 100.3,
        "endSeconds": 101.8,
        "timeDisplay": "1:40",
        "speaker": "Rob",
        "textEn": "See you in New York!",
        "textFa": "در نیویورک می‌بینمت!"
    },
    {
        "id": 27,
        "seconds": 107.8,
        "endSeconds": 110.2,
        "timeDisplay": "1:47",
        "speaker": "Jenny",
        "textEn": "So now Rob's coming to New York.",
        "textFa": "بنابراین حالا راب در حال آمدن به نیویورک است."
    },
    {
        "id": 28,
        "seconds": 112.4,
        "endSeconds": 115.2,
        "timeDisplay": "1:52",
        "speaker": "Jenny",
        "textEn": "I know he's really excited about it.",
        "textFa": "می‌دانم که او واقعاً درباره‌اش هیجان‌زده است."
    },
    {
        "id": 29,
        "seconds": 115.9,
        "endSeconds": 118.0,
        "timeDisplay": "1:55",
        "speaker": "Jenny",
        "textEn": "It's going to be great to see him again.",
        "textFa": "دیدار دوباره او بسیار عالی خواهد بود."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v01",'
end_marker = '  {\n    "id": "a2-v02",'

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
    raise ValueError("questions marker not found in existing a2-v01 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v01",
    "level": "a2",
    "episodeNumber": 1,
    "titleFa": "اپیزود ۱ · بخش ۱: معرفی جنی، مرور خاطرات لندن و ورود راب به نیویورک",
    "titleEn": "Episode 1 · Part 1: Rob Comes to New York – Jenny's Introduction",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "2:06",
    "durationSec": 126,
    "fileName": "AEF3e_SB2_PE_Ep1_Introduction.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Introduction.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
    "posterIcon": "🗽",
    "summaryFa": "جنی زیلینسکی، دستیار سردبیر مجله New York 24/7، آغاز فصل جدید را روایت می‌کند. او خاطرات سفر کاری‌اش به لندن، ملاقات با مدیر دانیل اوکانر و دوستی نزدیکش با راب واکر (نویسنده مجله لندن) را مرور می‌کند. جنی توضیح می‌دهد که راب با وجود خوش‌قول نبودن، نویسنده‌ای تواناست و دعوت شده تا یک ماه در نیویورک کار کند؛ حالا راب در راه نیویورک است و جنی بسیار مشتاق دیدار دوباره اوست.",
    "summaryEn": "Jenny Zielinski, assistant editor of New York 24/7, opens the new season by recapping her memorable business trip to London. She reflects on meeting manager Daniel O'Connor and spending quality time with British writer Rob Walker—drinking coffee, sightseeing at Tate Modern, and shopping for shirts. Explaining that Rob was invited for a one-month assignment in New York, Jenny expresses how thrilled she is that he is arriving.",
    "keyTopicsFa": [
        "معرفی شغل و محل زندگی (My name's Jenny / Assistant editor of New York 24/7)",
        "روایت گذشته و تجربیات سفر (A few months ago, I visited our office in London)",
        "توصیف شخصیت و ویژگی‌های افراد (Fun to be with / Not the most punctual / Great writer)",
        "خاطرات گشت‌وگذار و قهوه (We had coffees together / We went sightseeing)",
        "بیان اشتیاق و انتظار برای آینده (Rob's coming to New York / Great to see him again)"
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

print(f"Successfully updated a2-v01 in aef-curriculum.ts with {len(transcript)} transcript lines!")
