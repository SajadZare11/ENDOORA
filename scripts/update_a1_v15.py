# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 8.2,
        "endSeconds": 11.7,
        "timeDisplay": "0:08",
        "speaker": "Daniel",
        "textEn": "So, Jenny, I hear it's your birthday today.",
        "textFa": "خب جنی، شنیده‌ام امروز روز تولدت است."
    },
    {
        "id": 2,
        "seconds": 12.3,
        "endSeconds": 13.4,
        "timeDisplay": "0:12",
        "speaker": "Jenny",
        "textEn": "Yes, that's right.",
        "textFa": "بله، درست است."
    },
    {
        "id": 3,
        "seconds": 14.1,
        "endSeconds": 17.6,
        "timeDisplay": "0:14",
        "speaker": "Daniel",
        "textEn": "Well, Happy Birthday! How do you normally celebrate?",
        "textFa": "خب، تولدت مبارک! معمولاً چطور جشن می‌گیری؟"
    },
    {
        "id": 4,
        "seconds": 18.5,
        "endSeconds": 23.5,
        "timeDisplay": "0:18",
        "speaker": "Jenny",
        "textEn": "Oh, nothing special. Maybe I go out for dinner with friends or see a movie.",
        "textFa": "اوه، کار خاصی نمی‌کنم. شاید با دوستان برای شام بیرون بروم یا فیلمی ببینم."
    },
    {
        "id": 5,
        "seconds": 24.2,
        "endSeconds": 27.0,
        "timeDisplay": "0:24",
        "speaker": "Daniel",
        "textEn": "Well, we could go out somewhere after dinner.",
        "textFa": "خب، می‌توانیم بعد از شام جایی بیرون برویم."
    },
    {
        "id": 6,
        "seconds": 28.4,
        "endSeconds": 30.1,
        "timeDisplay": "0:28",
        "speaker": "Waiter",
        "textEn": "Would you like a dessert?",
        "textFa": "دسر میل دارید؟"
    },
    {
        "id": 7,
        "seconds": 30.8,
        "endSeconds": 31.8,
        "timeDisplay": "0:30",
        "speaker": "Jenny",
        "textEn": "Not for me, thanks.",
        "textFa": "برای من نه، ممنون."
    },
    {
        "id": 8,
        "seconds": 32.6,
        "endSeconds": 33.2,
        "timeDisplay": "0:32",
        "speaker": "Daniel",
        "textEn": "OK, no.",
        "textFa": "خیلی خب، خیر."
    },
    {
        "id": 9,
        "seconds": 33.7,
        "endSeconds": 34.1,
        "timeDisplay": "0:33",
        "speaker": "Waiter",
        "textEn": "Coffee?",
        "textFa": "قهوه چطور؟"
    },
    {
        "id": 10,
        "seconds": 34.9,
        "endSeconds": 35.8,
        "timeDisplay": "0:34",
        "speaker": "Jenny",
        "textEn": "A decaf espresso.",
        "textFa": "یک اسپرسوی بدون کافئین."
    },
    {
        "id": 11,
        "seconds": 36.4,
        "endSeconds": 37.3,
        "timeDisplay": "0:36",
        "speaker": "Daniel",
        "textEn": "Same for me, please.",
        "textFa": "برای من هم همینطور، لطفاً."
    },
    {
        "id": 12,
        "seconds": 37.6,
        "endSeconds": 40.1,
        "timeDisplay": "0:37",
        "speaker": "Waiter",
        "textEn": "Two decaffeinated espressos. Certainly, sir.",
        "textFa": "دو اسپرسوی بدون کافئین. حتماً، جناب."
    },
    {
        "id": 13,
        "seconds": 42.4,
        "endSeconds": 47.1,
        "timeDisplay": "0:42",
        "speaker": "Daniel",
        "textEn": "You know, Jenny, you've got beautiful eyes.",
        "textFa": "می‌دانی جنی، تو چشم‌های واقعاً زیبایی داری."
    },
    {
        "id": 14,
        "seconds": 47.9,
        "endSeconds": 49.2,
        "timeDisplay": "0:47",
        "speaker": "Jenny",
        "textEn": "I get them from my mother.",
        "textFa": "به مادرم رفته‌ام."
    },
    {
        "id": 15,
        "seconds": 50.3,
        "endSeconds": 53.9,
        "timeDisplay": "0:50",
        "speaker": "Jenny",
        "textEn": "Anyway, what are your plans for the July edition of the magazine?",
        "textFa": "به هر حال، برنامه‌ات برای نسخه ماه ژوئیه مجله چیست؟"
    },
    {
        "id": 16,
        "seconds": 55.5,
        "endSeconds": 59.8,
        "timeDisplay": "0:55",
        "speaker": "Daniel",
        "textEn": "The, uh, July edition? I, um...",
        "textFa": "نسخه، اِ، ماه ژوئیه؟ من، خب..."
    },
    {
        "id": 17,
        "seconds": 62.3,
        "endSeconds": 64.6,
        "timeDisplay": "1:02",
        "speaker": "Jenny",
        "textEn": "I have to take this. Sorry.",
        "textFa": "باید جواب این تلفن را بدهم. ببخشید."
    },
    {
        "id": 18,
        "seconds": 64.9,
        "endSeconds": 65.4,
        "timeDisplay": "1:04",
        "speaker": "Daniel",
        "textEn": "No problem.",
        "textFa": "خواهش می‌کنم، مشکلی نیست."
    },
    {
        "id": 19,
        "seconds": 71.2,
        "endSeconds": 72.1,
        "timeDisplay": "1:11",
        "speaker": "Jenny",
        "textEn": "Hi, Barbara.",
        "textFa": "سلام باربارا."
    },
    {
        "id": 20,
        "seconds": 75.9,
        "endSeconds": 77.8,
        "timeDisplay": "1:15",
        "speaker": "Barbara",
        "textEn": "Jenny, just a quick call.",
        "textFa": "جنی، فقط یک تماس تلفنی کوتاه است."
    },
    {
        "id": 21,
        "seconds": 78.3,
        "endSeconds": 82.0,
        "timeDisplay": "1:18",
        "speaker": "Barbara",
        "textEn": "We really like your idea about Rob Walker. He's a great writer.",
        "textFa": "ما واقعاً از ایده‌ات درباره راب واکر خوشمان آمد. او نویسنده فوق‌العاده‌ای است."
    },
    {
        "id": 22,
        "seconds": 82.0,
        "endSeconds": 83.3,
        "timeDisplay": "1:22",
        "speaker": "Jenny",
        "textEn": "So can I ask him?",
        "textFa": "پس می‌توانم از او بپرسم (پیشنهاد همکاری دهم)؟"
    },
    {
        "id": 23,
        "seconds": 83.9,
        "endSeconds": 85.3,
        "timeDisplay": "1:23",
        "speaker": "Barbara",
        "textEn": "Yes. Go ahead.",
        "textFa": "بله، حتماً جلو برو (پیشنهاد بده)."
    },
    {
        "id": 24,
        "seconds": 85.7,
        "endSeconds": 86.4,
        "timeDisplay": "1:25",
        "speaker": "Jenny",
        "textEn": "That's great.",
        "textFa": "عالی است."
    },
    {
        "id": 25,
        "seconds": 87.1,
        "endSeconds": 89.5,
        "timeDisplay": "1:27",
        "speaker": "Barbara",
        "textEn": "Good luck. I hope he says yes.",
        "textFa": "موفق باشی. امیدوارم قبول کند."
    },
    {
        "id": 26,
        "seconds": 90.1,
        "endSeconds": 90.5,
        "timeDisplay": "1:30",
        "speaker": "Jenny",
        "textEn": "Me too.",
        "textFa": "من هم همینطور."
    },
    {
        "id": 27,
        "seconds": 98.6,
        "endSeconds": 99.4,
        "timeDisplay": "1:38",
        "speaker": "Daniel",
        "textEn": "Good news?",
        "textFa": "خبرهای خوبی بود؟"
    },
    {
        "id": 28,
        "seconds": 100.1,
        "endSeconds": 104.1,
        "timeDisplay": "1:40",
        "speaker": "Jenny",
        "textEn": "Yeah. That was Barbara, my boss from the New York office.",
        "textFa": "آره. باربارا بود، رئیسم از دفتر نیویورک."
    },
    {
        "id": 29,
        "seconds": 104.6,
        "endSeconds": 107.0,
        "timeDisplay": "1:44",
        "speaker": "Jenny",
        "textEn": "She just gave me a little birthday present.",
        "textFa": "فقط یک هدیه تولد کوچک به من داد."
    },
    {
        "id": 30,
        "seconds": 107.8,
        "endSeconds": 111.0,
        "timeDisplay": "1:47",
        "speaker": "Daniel",
        "textEn": "So, would you like to go somewhere else?",
        "textFa": "خب، مایل هستی جای دیگری برویم؟"
    },
    {
        "id": 31,
        "seconds": 112.2,
        "endSeconds": 114.6,
        "timeDisplay": "1:52",
        "speaker": "Jenny",
        "textEn": "I'm sorry, Daniel. I'm a little tired.",
        "textFa": "متاسفم دانیل. کمی خسته‌ام."
    },
    {
        "id": 32,
        "seconds": 115.4,
        "endSeconds": 116.3,
        "timeDisplay": "1:55",
        "speaker": "Daniel",
        "textEn": "Yes, of course.",
        "textFa": "بله، حتماً (کاملاً درک می‌کنم)."
    },
    {
        "id": 33,
        "seconds": 116.9,
        "endSeconds": 119.0,
        "timeDisplay": "1:56",
        "speaker": "Daniel",
        "textEn": "Waiter, could I have the bill, please?",
        "textFa": "گارسون، ممکن است صورت‌حساب را بیاورید، لطفاً؟"
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a1-v15",'
end_marker = '  {\n    "id": "a1-v16",'

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
    raise ValueError("questions marker not found in existing a1-v15 block")

# Find where questions end before closing brace of lesson
# The block ends with "  },\n"
questions_text = existing_block[q_idx:].rstrip().rstrip(',')
if questions_text.endswith("}"):
    # check structure
    pass

new_lesson_header = {
    "id": "a1-v15",
    "level": "a1",
    "episodeNumber": 15,
    "titleFa": "اپیزود ۵ · بخش ۳: پایان غذا و درخواست صورت‌حساب",
    "titleEn": "Episode 5 · Part 3: The End of the Meal and the Bill",
    "bookLevel": "American English File 1 (3rd Edition)",
    "unit": "Practical English Episode 5",
    "cefr": "A1",
    "duration": "2:00",
    "durationSec": 120,
    "fileName": "AEF3e_SB1_PE_Ep5_The_end_of_the_meal.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a1&file=AEF3e_SB1_PE_Ep5_The_end_of_the_meal.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #b45309, #f59e0b)",
    "posterIcon": "💳",
    "summaryFa": "شام دانیل و جنی در رستوران رو به پایان است. دانیل تولد جنی را تبریک می‌گوید. پس از رد کردن دسر توسط جنی، آن‌ها دو فنجان اسپرسوی بدون کافئین سفارش می‌دهند. دانیل از چشم‌های جنی تعریف می‌کند اما جنی گفتگو را به سمت مجله هدایت می‌کند. در همین حین باربارا با جنی تماس گرفته و تایید همکاری با راب واکر را می‌دهد. در نهایت به دلیل خستگی جنی، دانیل صورت‌حساب را از گارسون درخواست می‌کند.",
    "summaryEn": "Daniel and Jenny finish dinner at the restaurant. Daniel wishes Jenny a happy birthday. Declining dessert, they order two decaf espressos. Daniel compliments Jenny, but she steers the conversation back to the magazine. Meanwhile, Barbara calls to approve hiring Rob Walker. Since Jenny is feeling tired, Daniel asks the waiter for the bill.",
    "keyTopicsFa": [
        "تبریک تولد و نحوه جشن گرفتن (Happy Birthday! How do you normally celebrate?)",
        "رد کردن مودبانه دسر و سفارش قهوه (Would you like a dessert? / Not for me, thanks / A decaf espresso)",
        "پاسخ به تماس کاری ضروری (I have to take this. Sorry. / Jenny, just a quick call)",
        "پیشنهاد رفتن به جایی دیگر و پاسخ مودبانه (Would you like to go somewhere else? / I'm sorry, I'm a little tired)",
        "درخواست صورت‌حساب در رستوران (Waiter, could I have the bill, please?)"
    ],
    "transcript": transcript
}

header_json = json.dumps(new_lesson_header, ensure_ascii=False, indent=2)
# remove the closing brace of header_json so we can append questions
header_json_without_end = header_json.rstrip().rstrip('}')

# Indent properly
indented_lines = []
for line in header_json_without_end.split('\n'):
    indented_lines.append("  " + line)

# format the questions
new_block = "\n".join(indented_lines) + ",\n    " + questions_text + "\n  },\n"

new_content = content[:start_idx] + new_block + content[end_idx:]

# Also update getAEFLessonById to support normalizedId and paddedId
old_func = '''export function getAEFLessonById(id: string): AEFVideoLesson | undefined {
  const targetId = id.toLowerCase();
  return AEF_LESSONS.find((les) => les.id.toLowerCase() === targetId);
}'''

new_func = '''export function getAEFLessonById(id: string): AEFVideoLesson | undefined {
  const targetId = id.toLowerCase();
  const normalizedId = targetId.replace(/-v0+(\\d{2,})/, '-v$1');
  const paddedId = targetId.replace(/-v(\\d)$/, '-v0$1');
  return AEF_LESSONS.find((les) => {
    const lId = les.id.toLowerCase();
    return lId === targetId || lId === normalizedId || lId === paddedId;
  });
}'''

if old_func in new_content:
    new_content = new_content.replace(old_func, new_func)
    print("getAEFLessonById updated!")
else:
    print("Warning: old_func signature not matched exactly, checking...")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated a1-v15 in aef-curriculum.ts!")
