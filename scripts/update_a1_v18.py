# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 22.0,
        "endSeconds": 27.5,
        "timeDisplay": "0:22",
        "speaker": "Jenny",
        "textEn": "Where is it? Where's my phone?!",
        "textFa": "کجاست؟ گوشیم کجاست؟!"
    },
    {
        "id": 2,
        "seconds": 28.0,
        "endSeconds": 29.8,
        "timeDisplay": "0:28",
        "speaker": "Rob",
        "textEn": "Are you looking for this?",
        "textFa": "دنبال این می‌گردی؟"
    },
    {
        "id": 3,
        "seconds": 30.0,
        "endSeconds": 35.0,
        "timeDisplay": "0:30",
        "speaker": "Jenny",
        "textEn": "Rob! I can't believe it! My phone!",
        "textFa": "راب! باورم نمیشه! گوشیم!"
    },
    {
        "id": 4,
        "seconds": 35.8,
        "endSeconds": 38.8,
        "timeDisplay": "0:35",
        "speaker": "Jenny",
        "textEn": "You're a hero, thank you so much.",
        "textFa": "تو یه قهرمانی، واقعاً خیلی ممنونم."
    },
    {
        "id": 5,
        "seconds": 39.0,
        "endSeconds": 42.5,
        "timeDisplay": "0:39",
        "speaker": "Rob",
        "textEn": "No problem. It gave me a chance to see you again.",
        "textFa": "خواهش می‌کنم. فرصتی شد تا دوباره ببینمت."
    },
    {
        "id": 6,
        "seconds": 43.4,
        "endSeconds": 46.0,
        "timeDisplay": "0:43",
        "speaker": "Rob",
        "textEn": "And I had more time to think about your offer.",
        "textFa": "و فرصت بیشتری داشتم تا درباره پیشنهادت فکر کنم."
    },
    {
        "id": 7,
        "seconds": 46.6,
        "endSeconds": 47.4,
        "timeDisplay": "0:46",
        "speaker": "Jenny",
        "textEn": "And?",
        "textFa": "و نتیجه؟"
    },
    {
        "id": 8,
        "seconds": 47.8,
        "endSeconds": 51.4,
        "timeDisplay": "0:47",
        "speaker": "Rob",
        "textEn": "I'd love to accept. I really want to come and work in New York.",
        "textFa": "با کمال میل می‌پذیرم. واقعاً دوست دارم بیایم و در نیویورک کار کنم."
    },
    {
        "id": 9,
        "seconds": 51.5,
        "endSeconds": 54.7,
        "timeDisplay": "0:51",
        "speaker": "Jenny",
        "textEn": "Oh, that's great, Rob! I'm so happy.",
        "textFa": "اوه، عالیه راب! خیلی خوشحالم."
    },
    {
        "id": 10,
        "seconds": 55.1,
        "endSeconds": 56.0,
        "timeDisplay": "0:55",
        "speaker": "Rob",
        "textEn": "Me too.",
        "textFa": "من هم همین‌طور."
    },
    {
        "id": 11,
        "seconds": 56.3,
        "endSeconds": 59.5,
        "timeDisplay": "0:56",
        "speaker": "Rob",
        "textEn": "Oh, you had a call from Eddie. I didn't answer it.",
        "textFa": "راستی، تماسی از طرف اِدی داشتی؛ من جواب ندادم."
    },
    {
        "id": 12,
        "seconds": 59.6,
        "endSeconds": 62.2,
        "timeDisplay": "0:59",
        "speaker": "Rob",
        "textEn": "Is he going to meet you at the airport?",
        "textFa": "قراره در فرودگاه بیاد پیشوازت؟"
    },
    {
        "id": 13,
        "seconds": 63.0,
        "endSeconds": 65.6,
        "timeDisplay": "1:03",
        "speaker": "Jenny",
        "textEn": "Eddie? No. He's at college in California.",
        "textFa": "اِدی؟ نه. اون در کالجی در کالیفرنیاست."
    },
    {
        "id": 14,
        "seconds": 66.2,
        "endSeconds": 68.6,
        "timeDisplay": "1:06",
        "speaker": "Rob",
        "textEn": "In California? Does he teach there?",
        "textFa": "در کالیفرنیا؟ اونجا تدریس می‌کنه؟"
    },
    {
        "id": 15,
        "seconds": 69.3,
        "endSeconds": 71.8,
        "timeDisplay": "1:09",
        "speaker": "Jenny",
        "textEn": "Teach? No, he's a student.",
        "textFa": "تدریس؟ نه، اون دانشجوئه."
    },
    {
        "id": 16,
        "seconds": 72.1,
        "endSeconds": 73.0,
        "timeDisplay": "1:12",
        "speaker": "Rob",
        "textEn": "A student?",
        "textFa": "دانشجو؟"
    },
    {
        "id": 17,
        "seconds": 73.5,
        "endSeconds": 79.5,
        "timeDisplay": "1:13",
        "speaker": "Jenny",
        "textEn": "Well, he's only 19. Eddie's my brother.",
        "textFa": "خب، اون فقط ۱۹ سالشه. اِدی برادرمه."
    },
    {
        "id": 18,
        "seconds": 82.5,
        "endSeconds": 88.0,
        "timeDisplay": "1:22",
        "speaker": "Airport Announcement",
        "textEn": "Flight 232 to New York is now ready for boarding.",
        "textFa": "[بلندگوی فرودگاه]: پرواز شماره ۲۳۲ به مقصد نیویورک آماده مسافرگیری است."
    },
    {
        "id": 19,
        "seconds": 88.8,
        "endSeconds": 91.2,
        "timeDisplay": "1:28",
        "speaker": "Jenny",
        "textEn": "I need to go.",
        "textFa": "من باید برم."
    },
    {
        "id": 20,
        "seconds": 92.1,
        "endSeconds": 94.8,
        "timeDisplay": "1:32",
        "speaker": "Rob",
        "textEn": "Well, have a good journey.",
        "textFa": "خب، سفرت بی‌خطر."
    },
    {
        "id": 21,
        "seconds": 95.1,
        "endSeconds": 96.5,
        "timeDisplay": "1:35",
        "speaker": "Jenny",
        "textEn": "Thanks, Rob. Bye.",
        "textFa": "ممنون، راب. خداحافظ."
    },
    {
        "id": 22,
        "seconds": 97.2,
        "endSeconds": 98.2,
        "timeDisplay": "1:37",
        "speaker": "Rob",
        "textEn": "Bye.",
        "textFa": "خداحافظ."
    },
    {
        "id": 23,
        "seconds": 104.8,
        "endSeconds": 106.8,
        "timeDisplay": "1:44",
        "speaker": "Rob",
        "textEn": "And see you in New York!",
        "textFa": "و در نیویورک می‌بینمت!"
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a1-v18",'
end_marker = '  {\n    "id": "a2-v01",'

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
    raise ValueError("questions marker not found in existing a1-v18 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a1-v18",
    "level": "a1",
    "episodeNumber": 18,
    "titleFa": "اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و اعلام پذیرش پیشنهاد کار",
    "titleEn": "Episode 6 · Part 3: Saying Goodbye at the Airport (The Lost Phone)",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 6",
    "cefr": "A1",
    "duration": "1:59",
    "durationSec": 119,
    "fileName": "AEF3e_SB1_PE_Ep6_Saying_goodbye.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep6_Saying_goodbye.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0f172a, #334155)",
    "posterIcon": "✈️",
    "summaryFa": "جنی در فرودگاه متوجه می‌شود گوشی‌اش گم شده است که ناگهان راب از راه می‌رسد و گوشی جامانده او را تحویل می‌دهد. راب اعلام می‌کند که تصمیم گرفته پیشنهاد کار در نیویورک را بپذیرد که باعث خوشحالی هر دو می‌شود. راب از تماسی به نام «اِدی» می‌پرسد و نگران است که نکند نامزد جنی باشد، اما جنی با خنده توضیح می‌دهد که اِدی برادر ۱۹ ساله‌اش و دانشجو در کالیفرنیا است! پس از اعلام بلندگوی فرودگاه، جنی برای سوار شدن به هواپیما حرکت می‌کند و آن‌ها با امید دیدار در نیویورک با هم خداحافظی می‌کنند.",
    "summaryEn": "At the airport, Jenny realizes she has lost her phone, but Rob suddenly appears to return it. He happily announces that he has decided to accept the job in New York. Rob also asks about a missed call from someone named Eddie, secretly worrying he might be a boyfriend, but Jenny clarifies that Eddie is just her 19-year-old brother who is a college student in California. As the boarding call sounds, Jenny rushes to her gate, and they say a warm goodbye, looking forward to meeting again in New York.",
    "keyTopicsFa": [
        "یافتن شیء گمشده (Where is it? / Are you looking for this?)",
        "قدردانی و تشکر ویژه (You're a hero, thank you so much / No problem)",
        "پذیرش پیشنهاد کاری (I'd love to accept / Work in New York)",
        "رفع سوءتفاهم درباره اشخاص (Does he teach there? / He's a student / Eddie's my brother)",
        "پیام‌های صوتی فرودگاه (Flight ready for boarding)",
        "خداحافظی و آرزوی سفر خوب (Have a good journey / See you in New York!)"
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

print(f"Successfully updated a1-v18 in aef-curriculum.ts with {len(transcript)} transcript lines!")
