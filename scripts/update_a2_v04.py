# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 15.4,
        "endSeconds": 17.8,
        "timeDisplay": "0:15",
        "speaker": "Jenny",
        "textEn": "Well, I think that's everything.",
        "textFa": "خب، فکر کنم همه‌چیز رو گفتم و نشونت دادم."
    },
    {
        "id": 2,
        "seconds": 18.7,
        "endSeconds": 19.8,
        "timeDisplay": "0:18",
        "speaker": "Jenny",
        "textEn": "What do you think of the office?",
        "textFa": "نظرت درباره دفتر چیه؟"
    },
    {
        "id": 3,
        "seconds": 20.2,
        "endSeconds": 20.8,
        "timeDisplay": "0:20",
        "speaker": "Rob",
        "textEn": "It's brilliant.",
        "textFa": "فوق‌العاده است."
    },
    {
        "id": 4,
        "seconds": 21.2,
        "endSeconds": 23.1,
        "timeDisplay": "0:21",
        "speaker": "Rob",
        "textEn": "And much bigger than our place in London.",
        "textFa": "و خیلی بزرگ‌تر از محل کار ما در لندنه."
    },
    {
        "id": 5,
        "seconds": 24.5,
        "endSeconds": 25.4,
        "timeDisplay": "0:24",
        "speaker": "Jenny",
        "textEn": "Oh, here's Barbara.",
        "textFa": "اوه، باربارا آمد."
    },
    {
        "id": 6,
        "seconds": 26.2,
        "endSeconds": 28.7,
        "timeDisplay": "0:26",
        "speaker": "Jenny",
        "textEn": "Rob, this is Barbara, the editor of the magazine.",
        "textFa": "راب، ایشان باربارا، سردبیر مجله هستند."
    },
    {
        "id": 7,
        "seconds": 28.9,
        "endSeconds": 30.5,
        "timeDisplay": "0:28",
        "speaker": "Barbara",
        "textEn": "It's good to finally meet you, Rob.",
        "textFa": "خوشحالم که بالاخره از نزدیک می‌بینمت، راب."
    },
    {
        "id": 8,
        "seconds": 30.5,
        "endSeconds": 31.9,
        "timeDisplay": "0:30",
        "speaker": "Rob",
        "textEn": "It's great to be here.",
        "textFa": "خیلی عالیه که اینجا هستم."
    },
    {
        "id": 9,
        "seconds": 32.2,
        "endSeconds": 33.9,
        "timeDisplay": "0:32",
        "speaker": "Barbara",
        "textEn": "Is this your first time in New York?",
        "textFa": "اولین باره که به نیویورک می‌آیی؟"
    },
    {
        "id": 10,
        "seconds": 34.2,
        "endSeconds": 36.3,
        "timeDisplay": "0:34",
        "speaker": "Rob",
        "textEn": "No, I came here when I was eighteen.",
        "textFa": "نه، وقتی هجده سالم بود آمدم اینجا."
    },
    {
        "id": 11,
        "seconds": 36.5,
        "endSeconds": 37.8,
        "timeDisplay": "0:36",
        "speaker": "Rob",
        "textEn": "But only for a few days.",
        "textFa": "اما فقط برای چند روز."
    },
    {
        "id": 12,
        "seconds": 38.2,
        "endSeconds": 41.3,
        "timeDisplay": "0:38",
        "speaker": "Barbara",
        "textEn": "Well, I hope you get to know New York much better this time!",
        "textFa": "خب، امیدوارم این بار نیویورک را خیلی بهتر بشناسی!"
    },
    {
        "id": 13,
        "seconds": 41.6,
        "endSeconds": 44.0,
        "timeDisplay": "0:41",
        "speaker": "Jenny",
        "textEn": "Barbara, I'm going to take Rob out for lunch.",
        "textFa": "باربارا، می‌خواهم راب را برای ناهار بیرون ببرم."
    },
    {
        "id": 14,
        "seconds": 44.3,
        "endSeconds": 45.6,
        "timeDisplay": "0:44",
        "speaker": "Jenny",
        "textEn": "Would you like to come with us?",
        "textFa": "مایلید با ما بیایید؟"
    },
    {
        "id": 15,
        "seconds": 45.5,
        "endSeconds": 49.3,
        "timeDisplay": "0:45",
        "speaker": "Barbara",
        "textEn": "I'd love to, but unfortunately, I have a meeting at one.",
        "textFa": "خیلی دوست دارم، اما متاسفانه ساعت یک جلسه دارم."
    },
    {
        "id": 16,
        "seconds": 49.4,
        "endSeconds": 50.6,
        "timeDisplay": "0:49",
        "speaker": "Barbara",
        "textEn": "So, I'll see you later.",
        "textFa": "پس بعداً می‌بینمتان."
    },
    {
        "id": 17,
        "seconds": 50.9,
        "endSeconds": 52.5,
        "timeDisplay": "0:50",
        "speaker": "Barbara",
        "textEn": "We're meeting at three, I think.",
        "textFa": "فکر کنم ساعت سه با هم جلسه داریم."
    },
    {
        "id": 18,
        "seconds": 53.0,
        "endSeconds": 53.5,
        "timeDisplay": "0:53",
        "speaker": "Jenny",
        "textEn": "That's right.",
        "textFa": "درسته."
    },
    {
        "id": 19,
        "seconds": 53.6,
        "endSeconds": 54.4,
        "timeDisplay": "0:53",
        "speaker": "Barbara",
        "textEn": "Have a nice lunch.",
        "textFa": "ناهار خوبی داشته باشید."
    },
    {
        "id": 20,
        "seconds": 56.9,
        "endSeconds": 58.7,
        "timeDisplay": "0:56",
        "speaker": "Holly",
        "textEn": "Hey, are you Rob Walker?",
        "textFa": "سلام، شما راب واکر هستید؟"
    },
    {
        "id": 21,
        "seconds": 59.2,
        "endSeconds": 59.6,
        "timeDisplay": "0:59",
        "speaker": "Rob",
        "textEn": "Yes.",
        "textFa": "بله."
    },
    {
        "id": 22,
        "seconds": 59.8,
        "endSeconds": 61.6,
        "timeDisplay": "0:59",
        "speaker": "Holly",
        "textEn": "Hi, I'm Holly. Holly Tyler.",
        "textFa": "سلام، من هالی هستم. هالی تایلر."
    },
    {
        "id": 23,
        "seconds": 62.1,
        "endSeconds": 63.0,
        "timeDisplay": "1:02",
        "speaker": "Rob",
        "textEn": "Hello, Holly.",
        "textFa": "سلام، هالی."
    },
    {
        "id": 24,
        "seconds": 63.5,
        "endSeconds": 65.2,
        "timeDisplay": "1:03",
        "speaker": "Holly",
        "textEn": "We're going to be working together.",
        "textFa": "ما قرار است با هم کار کنیم."
    },
    {
        "id": 25,
        "seconds": 65.6,
        "endSeconds": 66.2,
        "timeDisplay": "1:05",
        "speaker": "Jenny",
        "textEn": "Really?",
        "textFa": "واقعاً؟"
    },
    {
        "id": 26,
        "seconds": 67.0,
        "endSeconds": 68.9,
        "timeDisplay": "1:07",
        "speaker": "Holly",
        "textEn": "Didn't Barbara tell you?",
        "textFa": "باربارا بهت نگفت؟"
    },
    {
        "id": 27,
        "seconds": 69.1,
        "endSeconds": 70.8,
        "timeDisplay": "1:09",
        "speaker": "Holly",
        "textEn": "I'm going to be Rob's photographer!",
        "textFa": "من عکاس راب خواهم بود!"
    },
    {
        "id": 28,
        "seconds": 71.5,
        "endSeconds": 75.1,
        "timeDisplay": "1:11",
        "speaker": "Jenny",
        "textEn": "Oh, well... We're just going for lunch.",
        "textFa": "اوه، خب... ما تازه می‌خواستیم برای ناهار برویم."
    },
    {
        "id": 29,
        "seconds": 75.0,
        "endSeconds": 75.9,
        "timeDisplay": "1:15",
        "speaker": "Holly",
        "textEn": "Cool!",
        "textFa": "عالیه!"
    },
    {
        "id": 30,
        "seconds": 76.3,
        "endSeconds": 77.6,
        "timeDisplay": "1:16",
        "speaker": "Holly",
        "textEn": "I can come with you.",
        "textFa": "من می‌توانم همراه شما بیایم."
    },
    {
        "id": 31,
        "seconds": 78.2,
        "endSeconds": 82.3,
        "timeDisplay": "1:18",
        "speaker": "Holly",
        "textEn": "I mean, I had a sandwich earlier, so I don't need to eat.",
        "textFa": "یعنی قبلاً یک ساندویچ خوردم، بنابراین غذایی نمی‌خواهم بخورم."
    },
    {
        "id": 32,
        "seconds": 82.6,
        "endSeconds": 84.8,
        "timeDisplay": "1:22",
        "speaker": "Holly",
        "textEn": "But Rob and I can talk.",
        "textFa": "اما من و راب می‌توانیم با هم صحبت کنیم."
    },
    {
        "id": 33,
        "seconds": 85.2,
        "endSeconds": 85.9,
        "timeDisplay": "1:25",
        "speaker": "Holly",
        "textEn": "Is that OK?",
        "textFa": "مشکلی نیست؟"
    },
    {
        "id": 34,
        "seconds": 86.9,
        "endSeconds": 87.2,
        "timeDisplay": "1:26",
        "speaker": "Jenny",
        "textEn": "Sure.",
        "textFa": "حتماً."
    },
    {
        "id": 35,
        "seconds": 88.5,
        "endSeconds": 89.8,
        "timeDisplay": "1:28",
        "speaker": "Holly",
        "textEn": "So, let's go.",
        "textFa": "پس بزن بریم."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v04",'
end_marker = '  {\n    "id": "a2-v05",'

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
    raise ValueError("questions marker not found in existing a2-v04 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v04",
    "level": "a2",
    "episodeNumber": 4,
    "titleFa": "اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با باربارا و هالی",
    "titleEn": "Episode 2 · Part 1: In the New York Office (Meeting Barbara & Holly)",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:34",
    "durationSec": 94,
    "fileName": "AEF3e_SB2_PE_Ep2_In_the_New_York_office.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_In_the_New_York_office.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
    "posterIcon": "🏢",
    "summaryFa": "جنی بخش‌های مختلف دفتر کار نیویورک را به راب نشان می‌دهد و او را با باربارا، سردبیر مجله، آشنا می‌کند. جنی به باربارا تعارف می‌کند که برای ناهار به آن‌ها ملحق شود، اما باربارا به دلیل جلسه‌ای در ساعت ۱ عذرخواهی کرده و قرار جلسه مشترکشان را به ساعت ۳ موکول می‌کند. در همین حین، هالی تایلر سر می‌رسد و خود را به‌عنوان عکاس اختصاصی مقالات راب معرفی می‌کند؛ سپس با اشتیاق پیشنهاد می‌دهد در زمان ناهار همراه آن‌ها باشد تا با راب بیشتر گفتگو کند.",
    "summaryEn": "Jenny shows Rob around the New York office and introduces him to Barbara, the magazine's editor. Jenny invites Barbara to lunch, but Barbara declines due to a 1:00 PM meeting, confirming they will meet at 3:00 PM instead. Shortly after, Holly Tyler introduces herself as Rob's photographer and eagerly tags along to their lunch to get acquainted with Rob.",
    "keyTopicsFa": [
        "آشنایی با محیط کار جدید و مقایسه با دفتر لندن (What do you think of the office? / Much bigger than our place)",
        "معرفی رسمی مدیر و همکاران (This is Barbara, the editor of the magazine)",
        "دعوت به ناهار و عذرخواهی محترمانه به دلیل تداخل جلسات (Would you like to come with us? / Unfortunately I have a meeting at one)",
        "معرفی هالی به عنوان عکاس پروژه (I'm going to be Rob's photographer)",
        "پیوستن به همکاران برای ناهار و گفتگو (I can come with you / Rob and I can talk / So let's go)"
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

print(f"Successfully updated a2-v04 in aef-curriculum.ts with {len(transcript)} transcript lines!")
