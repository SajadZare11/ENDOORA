# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 12.3,
        "endSeconds": 17.6,
        "timeDisplay": "0:12",
        "speaker": "Holly",
        "textEn": "So tell me, Rob. What are you going to write about?",
        "textFa": "خب برام بگو راب، قراره درباره چی بنویسی؟"
    },
    {
        "id": 2,
        "seconds": 18.5,
        "endSeconds": 21.8,
        "timeDisplay": "0:18",
        "speaker": "Rob",
        "textEn": "Well, to start with, my first impressions of New York.",
        "textFa": "خب، برای شروع، اولین برداشت‌هایم از نیویورک."
    },
    {
        "id": 3,
        "seconds": 22.0,
        "endSeconds": 25.5,
        "timeDisplay": "0:22",
        "speaker": "Rob",
        "textEn": "You know, the nightlife, the music, things like that.",
        "textFa": "می‌دونی، زندگی شبانه، موسیقی و چیزهایی مثل این."
    },
    {
        "id": 4,
        "seconds": 26.0,
        "endSeconds": 28.1,
        "timeDisplay": "0:26",
        "speaker": "Holly",
        "textEn": "Are you planning to do any interviews?",
        "textFa": "برنامه‌ای برای انجام مصاحبه هم داری؟"
    },
    {
        "id": 5,
        "seconds": 28.7,
        "endSeconds": 30.4,
        "timeDisplay": "0:28",
        "speaker": "Rob",
        "textEn": "I'd like to.",
        "textFa": "خیلی دوست دارم."
    },
    {
        "id": 6,
        "seconds": 31.4,
        "endSeconds": 32.8,
        "timeDisplay": "0:31",
        "speaker": "Rob",
        "textEn": "Do you have any suggestions?",
        "textFa": "پیشنهادی داری؟"
    },
    {
        "id": 7,
        "seconds": 33.3,
        "endSeconds": 36.3,
        "timeDisplay": "0:33",
        "speaker": "Holly",
        "textEn": "Well, I know some great musicians.",
        "textFa": "خب، چند تا موزیسین عالی می‌شناسم."
    },
    {
        "id": 8,
        "seconds": 36.7,
        "endSeconds": 37.1,
        "timeDisplay": "0:36",
        "speaker": "Rob",
        "textEn": "Musicians?",
        "textFa": "نوازنده‌ها؟"
    },
    {
        "id": 9,
        "seconds": 38.1,
        "endSeconds": 39.8,
        "timeDisplay": "0:38",
        "speaker": "Holly",
        "textEn": "You know, guys in bands.",
        "textFa": "می‌دونی، بچه‌های گروه‌های موسیقی."
    },
    {
        "id": 10,
        "seconds": 39.8,
        "endSeconds": 43.9,
        "timeDisplay": "0:39",
        "speaker": "Holly",
        "textEn": "And I also have some contacts in the theater and dance.",
        "textFa": "و همچنین ارتباطاتی در تئاتر و رقص دارم."
    },
    {
        "id": 11,
        "seconds": 44.1,
        "endSeconds": 45.3,
        "timeDisplay": "0:44",
        "speaker": "Rob",
        "textEn": "That would be great.",
        "textFa": "فوق‌العاده خواهد بود."
    },
    {
        "id": 12,
        "seconds": 45.7,
        "endSeconds": 49.8,
        "timeDisplay": "0:45",
        "speaker": "Holly",
        "textEn": "Maybe we could go to a show, and after you could talk to the actors.",
        "textFa": "شاید بتوانیم با هم به یک نمایش برویم و بعدش بتوانی با بازیگران صحبت کنی."
    },
    {
        "id": 13,
        "seconds": 51.0,
        "endSeconds": 52.6,
        "timeDisplay": "0:51",
        "speaker": "Rob",
        "textEn": "I really like that idea.",
        "textFa": "واقعاً از این ایده خوشم می‌آید."
    },
    {
        "id": 14,
        "seconds": 54.5,
        "endSeconds": 56.0,
        "timeDisplay": "0:54",
        "speaker": "Waitress",
        "textEn": "Can I bring you anything else?",
        "textFa": "چیز دیگری میل دارید برایتان بیاورم؟"
    },
    {
        "id": 15,
        "seconds": 56.1,
        "endSeconds": 57.2,
        "timeDisplay": "0:56",
        "speaker": "Jenny",
        "textEn": "Could we have the check, please?",
        "textFa": "می‌توانید صورت‌حساب را بیاورید، لطفاً؟"
    },
    {
        "id": 16,
        "seconds": 57.6,
        "endSeconds": 58.6,
        "timeDisplay": "0:57",
        "speaker": "Waitress",
        "textEn": "Yes, ma'am.",
        "textFa": "بله خانم."
    },
    {
        "id": 17,
        "seconds": 70.2,
        "endSeconds": 70.8,
        "timeDisplay": "1:10",
        "speaker": "Waitress",
        "textEn": "Here's your check.",
        "textFa": "این صورت‌حساب شما."
    },
    {
        "id": 18,
        "seconds": 71.1,
        "endSeconds": 71.5,
        "timeDisplay": "1:11",
        "speaker": "Jenny",
        "textEn": "Thanks.",
        "textFa": "ممنون."
    },
    {
        "id": 19,
        "seconds": 76.1,
        "endSeconds": 76.6,
        "timeDisplay": "1:16",
        "speaker": "Jenny",
        "textEn": "Excuse me.",
        "textFa": "ببخشید."
    },
    {
        "id": 20,
        "seconds": 76.7,
        "endSeconds": 77.8,
        "timeDisplay": "1:16",
        "speaker": "Jenny",
        "textEn": "I think there's a mistake.",
        "textFa": "فکر کنم اشتباهی شده است."
    },
    {
        "id": 21,
        "seconds": 78.5,
        "endSeconds": 81.5,
        "timeDisplay": "1:18",
        "speaker": "Jenny",
        "textEn": "We had two bottles of water, not three.",
        "textFa": "ما دو بطری آب داشتیم، نه سه تا."
    },
    {
        "id": 22,
        "seconds": 81.8,
        "endSeconds": 82.5,
        "timeDisplay": "1:21",
        "speaker": "Waitress",
        "textEn": "You're right.",
        "textFa": "حق با شماست."
    },
    {
        "id": 23,
        "seconds": 82.8,
        "endSeconds": 84.0,
        "timeDisplay": "1:22",
        "speaker": "Waitress",
        "textEn": "I'm really sorry.",
        "textFa": "واقعاً عذرخواهی می‌کنم."
    },
    {
        "id": 24,
        "seconds": 84.0,
        "endSeconds": 86.0,
        "timeDisplay": "1:24",
        "speaker": "Waitress",
        "textEn": "It's not my day today!",
        "textFa": "امروز اصلاً روز من نیست!"
    },
    {
        "id": 25,
        "seconds": 86.6,
        "endSeconds": 87.5,
        "timeDisplay": "1:26",
        "speaker": "Waitress",
        "textEn": "I'll get you a new check.",
        "textFa": "الان یک صورت‌حساب جدید برایتان می‌آورم."
    },
    {
        "id": 26,
        "seconds": 87.9,
        "endSeconds": 88.6,
        "timeDisplay": "1:27",
        "speaker": "Jenny",
        "textEn": "Thank you.",
        "textFa": "متشکرم."
    },
    {
        "id": 27,
        "seconds": 89.3,
        "endSeconds": 91.8,
        "timeDisplay": "1:29",
        "speaker": "Holly",
        "textEn": "We're going to have a fun month, Rob.",
        "textFa": "ماه پر از لذت و تفریحی پیش رو خواهیم داشت، راب."
    },
    {
        "id": 28,
        "seconds": 92.4,
        "endSeconds": 92.8,
        "timeDisplay": "1:32",
        "speaker": "Rob",
        "textEn": "Yeah.",
        "textFa": "آره."
    },
    {
        "id": 29,
        "seconds": 93.2,
        "endSeconds": 94.7,
        "timeDisplay": "1:33",
        "speaker": "Rob",
        "textEn": "I think it's going to be fantastic.",
        "textFa": "من هم فکر می‌کنم فوق‌العاده خواهد بود."
    },
    {
        "id": 30,
        "seconds": 96.0,
        "endSeconds": 97.5,
        "timeDisplay": "1:36",
        "speaker": "Jenny",
        "textEn": "OK, time to go.",
        "textFa": "خب، وقت رفتن است."
    },
    {
        "id": 31,
        "seconds": 98.2,
        "endSeconds": 101.0,
        "timeDisplay": "1:38",
        "speaker": "Jenny",
        "textEn": "You have your meeting with Barbara at three.",
        "textFa": "ساعت سه با باربارا جلسه داری."
    },
    {
        "id": 32,
        "seconds": 101.2,
        "endSeconds": 102.6,
        "timeDisplay": "1:41",
        "speaker": "Rob",
        "textEn": "Oh, yeah. Right.",
        "textFa": "اوه، آره. درسته."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v06",'
end_marker = '  {\n    "id": "a2-v07",'

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
    raise ValueError("questions marker not found in existing a2-v06 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v06",
    "level": "a2",
    "episodeNumber": 6,
    "titleFa": "اپیزود ۲ · بخش ۳: ایجاد دوستی میان راب و هالی و تسویه‌حساب در رستوران",
    "titleEn": "Episode 2 · Part 3: Holly and Rob Make Friends & The Restaurant Check",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 2",
    "cefr": "A2",
    "duration": "1:52",
    "durationSec": 112,
    "fileName": "AEF3e_SB2_PE_Ep2_Holly_and_Rob_make_friends.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep2_Holly_and_Rob_make_friends.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    "posterIcon": "💬",
    "summaryFa": "هالی بر سر میز غذا از راب درباره موضوعات مقالاتش می‌پرسد. راب توضیح می‌دهد که قصد دارد درباره اولین برداشت‌هایش از نیویورک، زندگی شبانه و موسیقی بنویسد. هالی پیشنهاد می‌دهد او را با هنرمندان گروه‌های موسیقی، تئاتر و رقص مرتبط کند و حتی به تماشای نمایش بروند تا راب با بازیگران گفتگو کند. در ادامه، جنی درخواست صورت‌حساب می‌کند اما متوجه می‌شود ۳ بطری آب در فاکتور ثبت شده در حالی که ۲ بطری مصرف کرده بودند. گارسون عذرخواهی کرده و صورت‌حساب را اصلاح می‌کند. در پایان، جنی به راب یادآوری می‌کند که ساعت ۳ با باربارا جلسه دارد و باید به دفتر بازگردند.",
    "summaryEn": "At lunch, Holly asks Rob about his planned articles for the magazine. Rob explains he wants to write about his first impressions of New York, including the nightlife and music scene. Holly suggests introducing him to musicians, theatre contacts, and dancers, proposing they see a show together so Rob can interview the actors. Afterward, Jenny asks for the check and notices an overcharge for three bottles of water instead of two. The waitress apologizes and brings a corrected bill. Finally, Jenny reminds Rob of his upcoming 3:00 PM meeting with Barbara, and they prepare to leave.",
    "keyTopicsFa": [
        "گفتگو درباره ایده‌های نوشتن و سوژه‌های مقاله (What are you going to write about? / First impressions of New York)",
        "پیشنهاد ارتباط با هنرمندان و اهالی تئاتر و موسیقی (Musicians / Contacts in theater and dance)",
        "درخواست صورت‌حساب در رستوران (Could we have the check, please? / Here's your check)",
        "اعتراض محترمانه به اشتباه در صورت‌حساب (I think there's a mistake / We had two bottles of water, not three)",
        "عذرخواهی پرسنل و تعویض فاکتور (You're right / It's not my day today / I'll get you a new check)",
        "مدیریت زمان و یادآوری جلسه کاری (Time to go / You have your meeting with Barbara at three)"
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

print(f"Successfully updated a2-v06 in aef-curriculum.ts with {len(transcript)} transcript lines!")
