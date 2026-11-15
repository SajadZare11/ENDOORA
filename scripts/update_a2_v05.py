# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 17.8,
        "endSeconds": 18.8,
        "timeDisplay": "0:17",
        "speaker": "Waitress",
        "textEn": "Are you ready to order?",
        "textFa": "برای ثبت سفارش آماده‌اید؟"
    },
    {
        "id": 2,
        "seconds": 19.1,
        "endSeconds": 20.0,
        "timeDisplay": "0:19",
        "speaker": "Jenny",
        "textEn": "Yes, please.",
        "textFa": "بله، لطفاً."
    },
    {
        "id": 3,
        "seconds": 20.2,
        "endSeconds": 21.9,
        "timeDisplay": "0:20",
        "speaker": "Waitress",
        "textEn": "Can I get you something to start with?",
        "textFa": "برای پیش‌غذا چیزی میل دارید برایتان بیاورم؟"
    },
    {
        "id": 4,
        "seconds": 22.0,
        "endSeconds": 23.0,
        "timeDisplay": "0:22",
        "speaker": "Jenny",
        "textEn": "No, thank you.",
        "textFa": "خیر، متشکرم."
    },
    {
        "id": 5,
        "seconds": 23.5,
        "endSeconds": 27.7,
        "timeDisplay": "0:23",
        "speaker": "Jenny",
        "textEn": "I'd like the tuna with a green salad.",
        "textFa": "من ماهی تن با سالاد سبزیجات می‌خواهم."
    },
    {
        "id": 6,
        "seconds": 28.8,
        "endSeconds": 29.8,
        "timeDisplay": "0:28",
        "speaker": "Waitress",
        "textEn": "And for you, sir?",
        "textFa": "و برای شما قربان؟"
    },
    {
        "id": 7,
        "seconds": 30.1,
        "endSeconds": 32.4,
        "timeDisplay": "0:30",
        "speaker": "Rob",
        "textEn": "I'll have the steak, please.",
        "textFa": "من استیک میل دارم، لطفاً."
    },
    {
        "id": 8,
        "seconds": 33.1,
        "endSeconds": 35.4,
        "timeDisplay": "0:33",
        "speaker": "Waitress",
        "textEn": "Would you like that with fries, or a baked potato?",
        "textFa": "میل دارید همراه با سیب‌زمینی سرخ‌کرده باشد یا سیب‌زمینی تنوری؟"
    },
    {
        "id": 9,
        "seconds": 36.0,
        "endSeconds": 36.6,
        "timeDisplay": "0:36",
        "speaker": "Rob",
        "textEn": "Fries, please.",
        "textFa": "سیب‌زمینی سرخ‌کرده، لطفاً."
    },
    {
        "id": 10,
        "seconds": 37.5,
        "endSeconds": 38.6,
        "timeDisplay": "0:37",
        "speaker": "Waitress",
        "textEn": "How would you like your steak?",
        "textFa": "استیکتان چطور پخته شود؟"
    },
    {
        "id": 11,
        "seconds": 39.1,
        "endSeconds": 40.8,
        "timeDisplay": "0:39",
        "speaker": "Waitress",
        "textEn": "Rare, medium, or well done?",
        "textFa": "کم‌پخت (آبدار)، متوسط، یا کاملاً مغزپخت؟"
    },
    {
        "id": 12,
        "seconds": 41.6,
        "endSeconds": 42.2,
        "timeDisplay": "0:41",
        "speaker": "Rob",
        "textEn": "Well done.",
        "textFa": "کاملاً مغزپخت."
    },
    {
        "id": 13,
        "seconds": 44.0,
        "endSeconds": 44.8,
        "timeDisplay": "0:44",
        "speaker": "Holly",
        "textEn": "Nothing for me.",
        "textFa": "برای من چیزی لازم نیست."
    },
    {
        "id": 14,
        "seconds": 45.3,
        "endSeconds": 45.8,
        "timeDisplay": "0:45",
        "speaker": "Waitress",
        "textEn": "OK.",
        "textFa": "بسیار خب."
    },
    {
        "id": 15,
        "seconds": 45.8,
        "endSeconds": 46.7,
        "timeDisplay": "0:45",
        "speaker": "Waitress",
        "textEn": "And to drink?",
        "textFa": "و برای نوشیدنی؟"
    },
    {
        "id": 16,
        "seconds": 47.0,
        "endSeconds": 48.0,
        "timeDisplay": "0:47",
        "speaker": "Jenny",
        "textEn": "Water, please.",
        "textFa": "آب، لطفاً."
    },
    {
        "id": 17,
        "seconds": 48.0,
        "endSeconds": 49.0,
        "timeDisplay": "0:48",
        "speaker": "Waitress",
        "textEn": "Still or sparkling?",
        "textFa": "آب معمولی یا گازدار؟"
    },
    {
        "id": 18,
        "seconds": 49.2,
        "endSeconds": 49.7,
        "timeDisplay": "0:49",
        "speaker": "Jenny",
        "textEn": "Sparkling.",
        "textFa": "گازدار."
    },
    {
        "id": 19,
        "seconds": 58.8,
        "endSeconds": 63.0,
        "timeDisplay": "0:58",
        "speaker": "Waitress",
        "textEn": "The tuna for you ma'am, and the steak for you, sir.",
        "textFa": "ماهی تن برای شما خانم، و استیک برای شما قربان."
    },
    {
        "id": 20,
        "seconds": 63.5,
        "endSeconds": 67.1,
        "timeDisplay": "1:03",
        "speaker": "Jenny",
        "textEn": "I'm sorry, but I asked for a green salad, not fries.",
        "textFa": "ببخشید، اما من سالاد سبزیجات خواسته بودم، نه سیب‌زمینی سرخ‌کرده."
    },
    {
        "id": 21,
        "seconds": 67.7,
        "endSeconds": 68.3,
        "timeDisplay": "1:07",
        "speaker": "Waitress",
        "textEn": "No problem.",
        "textFa": "مشکلی نیست."
    },
    {
        "id": 22,
        "seconds": 68.9,
        "endSeconds": 70.1,
        "timeDisplay": "1:08",
        "speaker": "Waitress",
        "textEn": "I'll change it.",
        "textFa": "عوضش می‌کنم."
    },
    {
        "id": 23,
        "seconds": 71.5,
        "endSeconds": 72.1,
        "timeDisplay": "1:11",
        "speaker": "Rob",
        "textEn": "Excuse me.",
        "textFa": "ببخشید."
    },
    {
        "id": 24,
        "seconds": 72.5,
        "endSeconds": 72.9,
        "timeDisplay": "1:12",
        "speaker": "Waitress",
        "textEn": "Yes, sir?",
        "textFa": "بله قربان؟"
    },
    {
        "id": 25,
        "seconds": 73.2,
        "endSeconds": 77.1,
        "timeDisplay": "1:13",
        "speaker": "Rob",
        "textEn": "Sorry, I asked for my steak well done and this is rare.",
        "textFa": "معذرت می‌خواهم، من استیک کاملاً مغزپخت خواسته بودم ولی این خامه."
    },
    {
        "id": 26,
        "seconds": 77.6,
        "endSeconds": 78.7,
        "timeDisplay": "1:17",
        "speaker": "Waitress",
        "textEn": "I'm really sorry.",
        "textFa": "واقعاً عذرخواهی می‌کنم."
    },
    {
        "id": 27,
        "seconds": 79.0,
        "endSeconds": 80.1,
        "timeDisplay": "1:19",
        "speaker": "Waitress",
        "textEn": "I'll take it back to the kitchen.",
        "textFa": "الان برمی‌گردانمش به آشپزخانه."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v05",'
end_marker = '  {\n    "id": "a2-v06",'

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
    raise ValueError("questions marker not found in existing a2-v05 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v05",
    "level": "a2",
    "episodeNumber": 5,
    "titleFa": "اپیزود ۲ · بخش ۲: صرف ناهار در رستوران و سفارش غذا",
    "titleEn": "Episode 2 · Part 2: At the Restaurant (Ordering & Meal Problems)",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:26",
    "durationSec": 86,
    "fileName": "AEF3e_SB2_PE_Ep2_At_the_restaurant.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_At_the_restaurant.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
    "posterIcon": "🥗",
    "summaryFa": "جنی، راب و هالی در رستوران برای ناهار می‌نشینند. جنی ماهی تن با سالاد سبزیجات و آب گازدار سفارش می‌دهد و راب استیک مغزپخت (Well done) همراه با سیب‌زمینی سرخ‌کرده می‌خواهد (هالی چون قبلاً ساندویچ خورده چیزی سفارش نمی‌دهد). اما پس از آوردن غذا دو مشکل پیش می‌آید: گارسون برای جنی به اشتباه به جای سالاد سبزیجات، سیب‌زمینی سرخ‌کرده آورده و استیک راب نیز به جای مغزپخت، کاملاً خام (Rare) است. آن‌ها با رعایت ادب موضوع را به گارسون اطلاع می‌دهند و گارسون ضمن عذرخواهی، سالاد جنی را تعویض کرده و استیک راب را به آشپزخانه برمی‌گرداند.",
    "summaryEn": "Jenny, Rob, and Holly sit down for lunch at a restaurant. Jenny orders tuna with a green salad and sparkling water, while Rob orders well-done steak with fries (Holly doesn't order because she already ate earlier). When the food arrives, two mistakes occur: the waitress mistakenly brought fries instead of a green salad for Jenny, and Rob's steak is rare instead of well done. They politely bring the issues to the waitress's attention, and she apologizes, promising to change the salad and taking the steak back to the kitchen.",
    "keyTopicsFa": [
        "سفارش پیش‌غذا، غذای اصلی و نوشیدنی (Are you ready to order? / I'd like the tuna / I'll have the steak)",
        "انتخاب مخلفات غذا و میزان پخت گوشت (Fries or baked potato / Rare, medium, or well done)",
        "سفارش نوع آب در رستوران (Water, please / Still or sparkling?)",
        "گزارش اشتباه در سفارش غذا با لحن محترمانه (I asked for a green salad, not fries / I asked for my steak well done and this is rare)",
        "پاسخگویی مؤدبانه و جبران اشتباه توسط پرسنل رستوران (No problem, I'll change it / I'll take it back to the kitchen)"
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

print(f"Successfully updated a2-v05 in aef-curriculum.ts with {len(transcript)} transcript lines!")
