# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 12.8,
        "endSeconds": 13.5,
        "timeDisplay": "0:12",
        "speaker": "Jenny",
        "textEn": "Rob!",
        "textFa": "راب!"
    },
    {
        "id": 2,
        "seconds": 13.9,
        "endSeconds": 14.5,
        "timeDisplay": "0:13",
        "speaker": "Rob",
        "textEn": "Jenny.",
        "textFa": "جنی."
    },
    {
        "id": 3,
        "seconds": 15.0,
        "endSeconds": 15.6,
        "timeDisplay": "0:15",
        "speaker": "Rob",
        "textEn": "Hi.",
        "textFa": "سلام."
    },
    {
        "id": 4,
        "seconds": 15.7,
        "endSeconds": 16.7,
        "timeDisplay": "0:15",
        "speaker": "Rob",
        "textEn": "Sorry I'm a bit late.",
        "textFa": "ببخشید کمی دیر کردم."
    },
    {
        "id": 5,
        "seconds": 16.7,
        "endSeconds": 17.3,
        "timeDisplay": "0:16",
        "speaker": "Jenny",
        "textEn": "No problem.",
        "textFa": "مشکلی نیست."
    },
    {
        "id": 6,
        "seconds": 17.6,
        "endSeconds": 18.2,
        "timeDisplay": "0:17",
        "speaker": "Rob",
        "textEn": "Really?",
        "textFa": "واقعاً؟"
    },
    {
        "id": 7,
        "seconds": 18.0,
        "endSeconds": 19.3,
        "timeDisplay": "0:18",
        "speaker": "Jenny",
        "textEn": "Really!",
        "textFa": "واقعاً!"
    },
    {
        "id": 8,
        "seconds": 23.2,
        "endSeconds": 24.8,
        "timeDisplay": "0:23",
        "speaker": "Jenny",
        "textEn": "I got your message.",
        "textFa": "پیامت را دریافت کردم."
    },
    {
        "id": 9,
        "seconds": 25.6,
        "endSeconds": 27.2,
        "timeDisplay": "0:25",
        "speaker": "Jenny",
        "textEn": "Would you like a coffee or something?",
        "textFa": "قهوه‌ای چیزی میل داری؟"
    },
    {
        "id": 10,
        "seconds": 28.0,
        "endSeconds": 29.4,
        "timeDisplay": "0:28",
        "speaker": "Rob",
        "textEn": "No, I'm fine, thanks.",
        "textFa": "نه، خوبم، ممنون."
    },
    {
        "id": 11,
        "seconds": 30.2,
        "endSeconds": 32.0,
        "timeDisplay": "0:30",
        "speaker": "Rob",
        "textEn": "So, what did you want to talk about?",
        "textFa": "خب، می‌خواستی درباره چه چیزی صحبت کنیم؟"
    },
    {
        "id": 12,
        "seconds": 32.7,
        "endSeconds": 36.6,
        "timeDisplay": "0:32",
        "speaker": "Rob",
        "textEn": "You think London is the best city in the world and you don't want to go home.",
        "textFa": "فکر می‌کنی لندن بهترین شهر دنیاست و نمی‌خواهی به خانه برگردی."
    },
    {
        "id": 13,
        "seconds": 36.7,
        "endSeconds": 37.9,
        "timeDisplay": "0:36",
        "speaker": "Jenny",
        "textEn": "Not exactly.",
        "textFa": "نه دقیقاً."
    },
    {
        "id": 14,
        "seconds": 38.7,
        "endSeconds": 41.1,
        "timeDisplay": "0:38",
        "speaker": "Jenny",
        "textEn": "We'd like you to come to New York.",
        "textFa": "ما دوست داریم تو به نیویورک بیایی."
    },
    {
        "id": 15,
        "seconds": 41.6,
        "endSeconds": 42.1,
        "timeDisplay": "0:41",
        "speaker": "Rob",
        "textEn": "Me?",
        "textFa": "من؟"
    },
    {
        "id": 16,
        "seconds": 42.5,
        "endSeconds": 43.5,
        "timeDisplay": "0:42",
        "speaker": "Rob",
        "textEn": "To New York?",
        "textFa": "به نیویورک؟"
    },
    {
        "id": 17,
        "seconds": 44.3,
        "endSeconds": 46.2,
        "timeDisplay": "0:44",
        "speaker": "Jenny",
        "textEn": "I talked to Barbara about you.",
        "textFa": "من درباره تو با باربارا صحبت کردم."
    },
    {
        "id": 18,
        "seconds": 46.4,
        "endSeconds": 48.1,
        "timeDisplay": "0:46",
        "speaker": "Jenny",
        "textEn": "You know, Barbara, my boss.",
        "textFa": "می‌دونی، باربارا، رئیسم."
    },
    {
        "id": 19,
        "seconds": 48.8,
        "endSeconds": 50.9,
        "timeDisplay": "0:48",
        "speaker": "Jenny",
        "textEn": "She loves your articles too.",
        "textFa": "او هم مقاله‌هایت را خیلی دوست دارد."
    },
    {
        "id": 20,
        "seconds": 51.3,
        "endSeconds": 55.2,
        "timeDisplay": "0:51",
        "speaker": "Jenny",
        "textEn": "So, would you like to come over to New York and work for us?",
        "textFa": "پس، آیا دوست داری به نیویورک بیایی و برای ما کار کنی؟"
    },
    {
        "id": 21,
        "seconds": 56.1,
        "endSeconds": 60.4,
        "timeDisplay": "0:56",
        "speaker": "Jenny",
        "textEn": "Just for a month and write a column for New York 24/7.",
        "textFa": "فقط برای یک ماه و نوشتن یک ستون برای مجله «نیویورک ۲۴/۷»."
    },
    {
        "id": 22,
        "seconds": 60.8,
        "endSeconds": 62.6,
        "timeDisplay": "1:00",
        "speaker": "Jenny",
        "textEn": "And maybe a daily blog?",
        "textFa": "و شاید هم یک وبلاگ روزانه؟"
    },
    {
        "id": 23,
        "seconds": 63.4,
        "endSeconds": 64.2,
        "timeDisplay": "1:03",
        "speaker": "Rob",
        "textEn": "Wow.",
        "textFa": "واو."
    },
    {
        "id": 24,
        "seconds": 64.7,
        "endSeconds": 66.0,
        "timeDisplay": "1:04",
        "speaker": "Rob",
        "textEn": "Sounds great.",
        "textFa": "عالی به نظر می‌رسه."
    },
    {
        "id": 25,
        "seconds": 66.8,
        "endSeconds": 68.3,
        "timeDisplay": "1:06",
        "speaker": "Rob",
        "textEn": "What could I call it?",
        "textFa": "چه اسمی می‌تونم براش بذارم؟"
    },
    {
        "id": 26,
        "seconds": 68.6,
        "endSeconds": 70.2,
        "timeDisplay": "1:08",
        "speaker": "Rob",
        "textEn": "An Englishman in New York.",
        "textFa": "«یک مرد انگلیسی در نیویورک»."
    },
    {
        "id": 27,
        "seconds": 70.3,
        "endSeconds": 71.5,
        "timeDisplay": "1:10",
        "speaker": "Jenny",
        "textEn": "Why not?",
        "textFa": "چرا که نه؟"
    },
    {
        "id": 28,
        "seconds": 72.2,
        "endSeconds": 72.9,
        "timeDisplay": "1:12",
        "speaker": "Jenny",
        "textEn": "Are you interested?",
        "textFa": "علاقه‌مند هستی؟"
    },
    {
        "id": 29,
        "seconds": 73.3,
        "endSeconds": 73.9,
        "timeDisplay": "1:13",
        "speaker": "Rob",
        "textEn": "Yes.",
        "textFa": "بله."
    },
    {
        "id": 30,
        "seconds": 74.3,
        "endSeconds": 74.8,
        "timeDisplay": "1:14",
        "speaker": "Rob",
        "textEn": "Very!",
        "textFa": "خیلی زیاد!"
    },
    {
        "id": 31,
        "seconds": 75.2,
        "endSeconds": 76.3,
        "timeDisplay": "1:15",
        "speaker": "Rob",
        "textEn": "It's amazing.",
        "textFa": "شگفت‌انگیزه."
    },
    {
        "id": 32,
        "seconds": 77.0,
        "endSeconds": 78.8,
        "timeDisplay": "1:17",
        "speaker": "Rob",
        "textEn": "But I need to think about it.",
        "textFa": "اما باید درباره‌اش فکر کنم."
    },
    {
        "id": 33,
        "seconds": 79.2,
        "endSeconds": 80.0,
        "timeDisplay": "1:19",
        "speaker": "Jenny",
        "textEn": "Of course.",
        "textFa": "البته."
    },
    {
        "id": 34,
        "seconds": 80.4,
        "endSeconds": 81.9,
        "timeDisplay": "1:20",
        "speaker": "Rob",
        "textEn": "When do I need to decide?",
        "textFa": "تا کِی باید تصمیم بگیرم؟"
    },
    {
        "id": 35,
        "seconds": 82.5,
        "endSeconds": 83.8,
        "timeDisplay": "1:22",
        "speaker": "Jenny",
        "textEn": "Before the end of the week.",
        "textFa": "تا قبل از پایان هفته."
    },
    {
        "id": 36,
        "seconds": 84.4,
        "endSeconds": 84.9,
        "timeDisplay": "1:24",
        "speaker": "Rob",
        "textEn": "Okay.",
        "textFa": "باشه."
    },
    {
        "id": 37,
        "seconds": 85.2,
        "endSeconds": 86.2,
        "timeDisplay": "1:25",
        "speaker": "Rob",
        "textEn": "Great.",
        "textFa": "عالیه."
    },
    {
        "id": 38,
        "seconds": 86.8,
        "endSeconds": 88.2,
        "timeDisplay": "1:26",
        "speaker": "Rob",
        "textEn": "Thank you.",
        "textFa": "متشکرم."
    },
    {
        "id": 39,
        "seconds": 88.7,
        "endSeconds": 90.8,
        "timeDisplay": "1:28",
        "speaker": "Jenny",
        "textEn": "And now I really have to go.",
        "textFa": "و حالا واقعاً باید بروم."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a1-v16",'
end_marker = '  {\n    "id": "a1-v17",'

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
    raise ValueError("questions marker not found in existing a1-v16 block")

questions_text = existing_block[q_idx:].rstrip().rstrip(',')
if questions_text.endswith("}"):
    pass

new_lesson_header = {
    "id": "a1-v16",
    "level": "a1",
    "episodeNumber": 16,
    "titleFa": "اپیزود ۶ · بخش ۱: آخرین صبح اقامت و پیشنهاد سفر به نیویورک",
    "titleEn": "Episode 6 · Part 1: Jenny's Last Morning – A Job in New York",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:41",
    "durationSec": 101,
    "fileName": "AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #6366f1, #818cf8)",
    "posterIcon": "🗽",
    "summaryFa": "جنی در آخرین صبح حضورش در لندن با راب در کافه ملاقات می‌کند. او خبر هیجان‌انگیزی دارد: پس از صحبت با رئیسش باربارا، به راب پیشنهاد می‌کند برای یک ماه به نیویورک بیاید و ستونی به نام «یک مرد انگلیسی در نیویورک» برای مجله بنویسد. راب بسیار مشتاق و شگفت‌زده می‌شود و قرار می‌شود تا پایان هفته تصمیم نهایی‌اش را بگیرد.",
    "summaryEn": "On Jenny's last morning in London, she meets Rob at a cafe with an exciting offer. Having talked to her boss Barbara, she invites Rob to come to New York for a month to write a column called 'An Englishman in New York' and write a daily blog. Rob is thrilled but asks for time to think, with a deadline by the end of the week.",
    "keyTopicsFa": [
        "عذرخواهی به خاطر تاخیر (Sorry I'm a bit late / No problem)",
        "تعارف نوشیدنی (Would you like a coffee or something? / No, I'm fine, thanks)",
        "ارائه پیشنهاد کاری در شهر دیگر (We'd like you to come to New York / Work for us)",
        "نام‌گذاری ستون مجله (What could I call it? An Englishman in New York)",
        "ابراز تمایل و فرصت فکر کردن (Are you interested? / Very, but I need to think about it)",
        "تعیین مهلت تصمیم‌گیری (When do I need to decide? / Before the end of the week)"
    ],
    "transcript": transcript
}

header_json = json.dumps(new_lesson_header, ensure_ascii=False, indent=2)
header_json_without_end = header_json.rstrip().rstrip('}')

indented_lines = []
for line in header_json_without_end.split('\n'):
    indented_lines.append("  " + line)

new_block = "\n".join(indented_lines) + ",\n    " + questions_text + "\n  },\n"

new_content = content[:start_idx] + new_block + content[end_idx:]

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated a1-v16 in aef-curriculum.ts with {len(transcript)} transcript lines!")
