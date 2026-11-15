# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 12.7,
        "endSeconds": 16.3,
        "timeDisplay": "0:12",
        "speaker": "Jenny",
        "textEn": "So, here you are in New York at last.",
        "textFa": "خب، بالاخره اینجایی در نیویورک."
    },
    {
        "id": 2,
        "seconds": 16.5,
        "endSeconds": 18.5,
        "timeDisplay": "0:16",
        "speaker": "Rob",
        "textEn": "Yeah, it's great to be here.",
        "textFa": "بله، خیلی عالیه که اینجا هستم."
    },
    {
        "id": 3,
        "seconds": 18.7,
        "endSeconds": 19.8,
        "timeDisplay": "0:18",
        "speaker": "Rob",
        "textEn": "It's really exciting.",
        "textFa": "واقعاً هیجان‌انگیزه."
    },
    {
        "id": 4,
        "seconds": 20.0,
        "endSeconds": 21.2,
        "timeDisplay": "0:20",
        "speaker": "Jenny",
        "textEn": "And how's your hotel?",
        "textFa": "و هتلت چطوره؟"
    },
    {
        "id": 5,
        "seconds": 21.6,
        "endSeconds": 22.8,
        "timeDisplay": "0:21",
        "speaker": "Rob",
        "textEn": "It's fine.",
        "textFa": "خوبه."
    },
    {
        "id": 6,
        "seconds": 23.0,
        "endSeconds": 24.8,
        "timeDisplay": "0:23",
        "speaker": "Rob",
        "textEn": "My room is really nice.",
        "textFa": "اتاقم واقعاً قشنگه."
    },
    {
        "id": 7,
        "seconds": 25.1,
        "endSeconds": 27.2,
        "timeDisplay": "0:25",
        "speaker": "Jenny",
        "textEn": "Do you have a good view from your room?",
        "textFa": "از اتاقت منظره و دید خوبی داری؟"
    },
    {
        "id": 8,
        "seconds": 27.6,
        "endSeconds": 29.6,
        "timeDisplay": "0:27",
        "speaker": "Rob",
        "textEn": "I can see lots of other buildings.",
        "textFa": "می‌توانم ساختمان‌های زیادی رو ببینم."
    },
    {
        "id": 9,
        "seconds": 31.4,
        "endSeconds": 35.6,
        "timeDisplay": "0:31",
        "speaker": "Jenny",
        "textEn": "Tomorrow I'm going to show you around the office and introduce you to the team.",
        "textFa": "فردا قرار است دفتر را بهت نشان بدهم و تو را به تیم معرفی کنم."
    },
    {
        "id": 10,
        "seconds": 36.0,
        "endSeconds": 38.5,
        "timeDisplay": "0:36",
        "speaker": "Jenny",
        "textEn": "Barbara's looking forward to meeting you.",
        "textFa": "باربارا بی‌صبرانه منتظر دیدنت است."
    },
    {
        "id": 11,
        "seconds": 39.2,
        "endSeconds": 43.6,
        "timeDisplay": "0:39",
        "speaker": "Jenny",
        "textEn": "You remember? Barbara, my boss?",
        "textFa": "یادت می‌آید؟ باربارا، رئیسم؟"
    },
    {
        "id": 12,
        "seconds": 43.7,
        "endSeconds": 45.4,
        "timeDisplay": "0:43",
        "speaker": "Rob",
        "textEn": "Oh, yeah. Sorry.",
        "textFa": "اوه، بله. ببخشید."
    },
    {
        "id": 13,
        "seconds": 46.2,
        "endSeconds": 49.3,
        "timeDisplay": "0:46",
        "speaker": "Jenny",
        "textEn": "And then you can start thinking about your blog and the column.",
        "textFa": "و بعد از آن می‌توانی در مورد وبلاگ و ستون روزنامه‌ات فکر کنی."
    },
    {
        "id": 14,
        "seconds": 50.1,
        "endSeconds": 52.8,
        "timeDisplay": "0:50",
        "speaker": "Jenny",
        "textEn": "Have you got any ideas yet, Rob? ... Rob?",
        "textFa": "آیا ایده‌ای تا الان داری، راب؟ ... راب؟"
    },
    {
        "id": 15,
        "seconds": 53.0,
        "endSeconds": 54.2,
        "timeDisplay": "0:53",
        "speaker": "Rob",
        "textEn": "What?",
        "textFa": "چی؟"
    },
    {
        "id": 16,
        "seconds": 55.3,
        "endSeconds": 56.6,
        "timeDisplay": "0:55",
        "speaker": "Rob",
        "textEn": "Sorry, Jenny.",
        "textFa": "ببخشید، جنی."
    },
    {
        "id": 17,
        "seconds": 57.0,
        "endSeconds": 58.7,
        "timeDisplay": "0:57",
        "speaker": "Jenny",
        "textEn": "You must be really tired.",
        "textFa": "حتماً خیلی خسته‌ای."
    },
    {
        "id": 18,
        "seconds": 58.9,
        "endSeconds": 60.8,
        "timeDisplay": "0:58",
        "speaker": "Rob",
        "textEn": "Yes, I am a bit.",
        "textFa": "بله، یک کم هستم."
    },
    {
        "id": 19,
        "seconds": 61.1,
        "endSeconds": 62.8,
        "timeDisplay": "1:01",
        "speaker": "Rob",
        "textEn": "What time is it now?",
        "textFa": "الان ساعت چنده؟"
    },
    {
        "id": 20,
        "seconds": 64.3,
        "endSeconds": 66.0,
        "timeDisplay": "1:04",
        "speaker": "Jenny",
        "textEn": "It's nine o'clock.",
        "textFa": "ساعت نُه است."
    },
    {
        "id": 21,
        "seconds": 66.4,
        "endSeconds": 67.3,
        "timeDisplay": "1:06",
        "speaker": "Rob",
        "textEn": "Nine o'clock?",
        "textFa": "ساعت نُه؟"
    },
    {
        "id": 22,
        "seconds": 67.6,
        "endSeconds": 69.6,
        "timeDisplay": "1:07",
        "speaker": "Rob",
        "textEn": "That's two o'clock in the morning for me.",
        "textFa": "این برای من یعنی ساعت دو صبح."
    },
    {
        "id": 23,
        "seconds": 69.9,
        "endSeconds": 71.3,
        "timeDisplay": "1:09",
        "speaker": "Jenny",
        "textEn": "Let's finish our drinks.",
        "textFa": "بیا نوشیدنی‌هایمان را تمام کنیم."
    },
    {
        "id": 24,
        "seconds": 71.3,
        "endSeconds": 72.3,
        "timeDisplay": "1:11",
        "speaker": "Jenny",
        "textEn": "You need to go to bed.",
        "textFa": "تو باید بروی بخوابی."
    },
    {
        "id": 25,
        "seconds": 72.3,
        "endSeconds": 73.5,
        "timeDisplay": "1:12",
        "speaker": "Rob",
        "textEn": "I guess you're right.",
        "textFa": "حدس می‌زنم حق با توئه."
    },
    {
        "id": 26,
        "seconds": 74.6,
        "endSeconds": 77.7,
        "timeDisplay": "1:14",
        "speaker": "Jenny",
        "textEn": "So, I'll see you in the office at eleven in the morning.",
        "textFa": "خب، پس در دفتر ساعت یازده صبح می‌بینمت."
    },
    {
        "id": 27,
        "seconds": 77.9,
        "endSeconds": 78.6,
        "timeDisplay": "1:17",
        "speaker": "Rob",
        "textEn": "At eleven?",
        "textFa": "ساعت یازده؟"
    },
    {
        "id": 28,
        "seconds": 79.3,
        "endSeconds": 79.8,
        "timeDisplay": "1:19",
        "speaker": "Jenny",
        "textEn": "Is that OK?",
        "textFa": "خوبه؟ مشکلی نیست؟"
    },
    {
        "id": 29,
        "seconds": 80.5,
        "endSeconds": 81.6,
        "timeDisplay": "1:20",
        "speaker": "Rob",
        "textEn": "It's perfect.",
        "textFa": "عالیه."
    },
    {
        "id": 30,
        "seconds": 82.1,
        "endSeconds": 82.6,
        "timeDisplay": "1:22",
        "speaker": "Rob",
        "textEn": "Thanks, Jenny.",
        "textFa": "ممنون، جنی."
    },
    {
        "id": 31,
        "seconds": 83.2,
        "endSeconds": 84.3,
        "timeDisplay": "1:23",
        "speaker": "Jenny",
        "textEn": "There's just one thing.",
        "textFa": "فقط یک چیز هست."
    },
    {
        "id": 32,
        "seconds": 84.4,
        "endSeconds": 85.6,
        "timeDisplay": "1:24",
        "speaker": "Rob",
        "textEn": "What's that?",
        "textFa": "چی؟"
    },
    {
        "id": 33,
        "seconds": 85.8,
        "endSeconds": 87.0,
        "timeDisplay": "1:25",
        "speaker": "Jenny",
        "textEn": "Don't be late.",
        "textFa": "دیر نکنی‌ها."
    },
    {
        "id": 34,
        "seconds": 88.7,
        "endSeconds": 90.9,
        "timeDisplay": "1:28",
        "speaker": "Rob",
        "textEn": "By the way, it's great to see you again.",
        "textFa": "راستی، خیلی خوشحالم که دوباره می‌بینمت."
    },
    {
        "id": 35,
        "seconds": 91.4,
        "endSeconds": 92.1,
        "timeDisplay": "1:31",
        "speaker": "Jenny",
        "textEn": "Yeah.",
        "textFa": "آره."
    },
    {
        "id": 36,
        "seconds": 92.6,
        "endSeconds": 94.0,
        "timeDisplay": "1:32",
        "speaker": "Jenny",
        "textEn": "It's great to see you, too.",
        "textFa": "من هم خیلی خوشحالم که می‌بینمت."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v03",'
end_marker = '  {\n    "id": "a2-v04",'

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
    raise ValueError("questions marker not found in existing a2-v03 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v03",
    "level": "a2",
    "episodeNumber": 3,
    "titleFa": "اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل و هماهنگی جلسه کاری",
    "titleEn": "Episode 1 · Part 3: Jenny and Rob Meet Again (Catching Up & Jet Lag)",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 1",
    "cefr": "A2",
    "duration": "1:35",
    "durationSec": 95,
    "fileName": "AEF3e_SB2_PE_Ep1_Jenny_and_Rob_meet_again.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep1_Jenny_and_Rob_meet_again.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
    "posterIcon": "☕",
    "summaryFa": "جنی و راب در کافه هتل برای یک نوشیدنی دیدار می‌کنند. جنی توضیح می‌دهد که فردا راب را به دفتر برده، به اعضای تیم و رئیسش باربارا معرفی خواهد کرد تا درباره ستون و وبلاگش همفکری کنند. راب به علت پرواز و اختلاف ساعت ۵ ساعته بین نیویورک و لندن دچار پرواززدگی (جت‌لگ) شدید است. جنی با دیدن خستگی او پیشنهاد می‌دهد نوشیدنی‌شان را تمام کنند تا راب زودتر استراحت کند و ساعت قرار فردا در دفتر را به ساعت ۱۱ صبح موکول می‌کند تا راب بتواند خوب بخوابد، اما با شوخی به او یادآوری می‌کند: «دیر نکنی‌ها!».",
    "summaryEn": "Jenny meets Rob for drinks at his hotel bar. She outlines plans for tomorrow to show him around the office, introduce him to the team and her boss Barbara, and discuss his column and blog. Rob is noticeably exhausted from jet lag due to the 5-hour time difference (9 PM in New York is 2 AM in London). Noticing his fatigue, Jenny suggests finishing their drinks so he can get some sleep, scheduling their office meeting for 11:00 AM instead, with a cheerful reminder: 'Don't be late!'",
    "keyTopicsFa": [
        "احوالپرسی و صحبت درباره هتل (And how's your hotel? / Do you have a good view?)",
        "برنامه‌ریزی بازدید از شرکت و معرفی به همکاران (Show you around the office / Introduce you to the team)",
        "اختلاف زمانی و پرواززدگی (That's two o'clock in the morning for me / You must be really tired)",
        "پیشنهاد استراحت و اتمام نوشیدنی (Let's finish our drinks / You need to go to bed)",
        "هماهنگی ساعت ملاقات کاری فردا و یادآوری خوش‌قولی (See you in the office at eleven / Don't be late)"
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

print(f"Successfully updated a2-v03 in aef-curriculum.ts with {len(transcript)} transcript lines!")
