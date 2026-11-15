# -*- coding: utf-8 -*-
import json

transcript = [
    {
        "id": 1,
        "seconds": 18.7,
        "endSeconds": 20.1,
        "timeDisplay": "0:18",
        "speaker": "Salesperson",
        "textEn": "Can I help you, sir?",
        "textFa": "می‌توانم کمکتان کنم قربان؟"
    },
    {
        "id": 2,
        "seconds": 20.1,
        "endSeconds": 23.0,
        "timeDisplay": "0:20",
        "speaker": "Rob",
        "textEn": "Yes. Do you have these in an eight?",
        "textFa": "بله. از این مدل سایز ۸ دارید؟"
    },
    {
        "id": 3,
        "seconds": 23.0,
        "endSeconds": 25.1,
        "timeDisplay": "0:23",
        "speaker": "Salesperson",
        "textEn": "Just a minute, I'll go and check.",
        "textFa": "یک لحظه صبر کنید، می‌روم بررسی کنم."
    },
    {
        "id": 4,
        "seconds": 30.6,
        "endSeconds": 33.0,
        "timeDisplay": "0:30",
        "speaker": "Salesperson",
        "textEn": "Here you are, these are an eight.",
        "textFa": "بفرمایید، این‌ها سایز ۸ هستند."
    },
    {
        "id": 5,
        "seconds": 33.3,
        "endSeconds": 35.0,
        "timeDisplay": "0:33",
        "speaker": "Salesperson",
        "textEn": "Do you want to try them on?",
        "textFa": "مایلید پرو و امتحانشان کنید؟"
    },
    {
        "id": 6,
        "seconds": 35.1,
        "endSeconds": 37.1,
        "timeDisplay": "0:35",
        "speaker": "Rob",
        "textEn": "No, thanks. I'm sure they'll be fine.",
        "textFa": "نه ممنون، مطمئنم اندازه‌اند."
    },
    {
        "id": 7,
        "seconds": 37.1,
        "endSeconds": 39.2,
        "timeDisplay": "0:37",
        "speaker": "Rob",
        "textEn": "How much are they?",
        "textFa": "قیمتشان چقدر است؟"
    },
    {
        "id": 8,
        "seconds": 39.4,
        "endSeconds": 40.9,
        "timeDisplay": "0:39",
        "speaker": "Salesperson",
        "textEn": "They're $83.94.",
        "textFa": "می‌شود ۸۳ دلار و ۹۴ سنت."
    },
    {
        "id": 9,
        "seconds": 40.9,
        "endSeconds": 44.4,
        "timeDisplay": "0:40",
        "speaker": "Rob",
        "textEn": "Oh, it says $72.99.",
        "textFa": "اوه، ولی روی برچسب زده ۷۲ دلار و ۹۹ سنت."
    },
    {
        "id": 10,
        "seconds": 44.4,
        "endSeconds": 48.3,
        "timeDisplay": "0:44",
        "speaker": "Salesperson",
        "textEn": "Yes, but there's an added sales tax of 15%.",
        "textFa": "بله، اما ۱۵ درصد مالیات بر فروش به آن اضافه می‌شود."
    },
    {
        "id": 11,
        "seconds": 48.4,
        "endSeconds": 51.2,
        "timeDisplay": "0:48",
        "speaker": "Rob",
        "textEn": "Oh, OK. Do you take Mastercard?",
        "textFa": "اوه، متوجه شدم. مسترکارت قبول می‌کنید؟"
    },
    {
        "id": 12,
        "seconds": 51.8,
        "endSeconds": 52.4,
        "timeDisplay": "0:51",
        "speaker": "Salesperson",
        "textEn": "Sure.",
        "textFa": "حتماً."
    },
    {
        "id": 13,
        "seconds": 60.3,
        "endSeconds": 61.6,
        "timeDisplay": "1:00",
        "speaker": "Salesperson",
        "textEn": "Can I help you?",
        "textFa": "می‌توانم کمکتان کنم؟"
    },
    {
        "id": 14,
        "seconds": 62.3,
        "endSeconds": 65.2,
        "timeDisplay": "1:02",
        "speaker": "Rob",
        "textEn": "Yes, I bought these about half an hour ago.",
        "textFa": "بله، من حدود نیم ساعت پیش این‌ها را خریدم."
    },
    {
        "id": 15,
        "seconds": 65.3,
        "endSeconds": 67.5,
        "timeDisplay": "1:05",
        "speaker": "Salesperson",
        "textEn": "Yes, I remember. Is there a problem?",
        "textFa": "بله یادم هست؛ مشکلی پیش آمده؟"
    },
    {
        "id": 16,
        "seconds": 68.1,
        "endSeconds": 69.8,
        "timeDisplay": "1:08",
        "speaker": "Rob",
        "textEn": "Yes, I'm afraid they're too small.",
        "textFa": "بله، متاسفانه برای پایم خیلی کوچک هستند."
    },
    {
        "id": 17,
        "seconds": 70.2,
        "endSeconds": 71.7,
        "timeDisplay": "1:10",
        "speaker": "Salesperson",
        "textEn": "What size are they?",
        "textFa": "سایزشان چنده؟"
    },
    {
        "id": 18,
        "seconds": 71.9,
        "endSeconds": 74.7,
        "timeDisplay": "1:11",
        "speaker": "Rob",
        "textEn": "They're an eight. But I take a UK eight.",
        "textFa": "سایز ۸ هستند، اما من سایز ۸ بریتانیا هستم."
    },
    {
        "id": 19,
        "seconds": 74.9,
        "endSeconds": 78.6,
        "timeDisplay": "1:14",
        "speaker": "Salesperson",
        "textEn": "Oh, right. Yes, a UK eight is a US nine.",
        "textFa": "اوه درسته! بله، سایز ۸ بریتانیا معادل سایز ۹ آمریکاست."
    },
    {
        "id": 20,
        "seconds": 78.6,
        "endSeconds": 80.4,
        "timeDisplay": "1:18",
        "speaker": "Rob",
        "textEn": "Do you have a pair?",
        "textFa": "از آن سایز موجود دارید؟"
    },
    {
        "id": 21,
        "seconds": 80.4,
        "endSeconds": 82.3,
        "timeDisplay": "1:20",
        "speaker": "Salesperson",
        "textEn": "I'll go and check. Just a minute.",
        "textFa": "می‌روم بررسی کنم، یک دقیقه."
    },
    {
        "id": 22,
        "seconds": 86.5,
        "endSeconds": 89.6,
        "timeDisplay": "1:26",
        "speaker": "Salesperson",
        "textEn": "I'm sorry, but we don't have these in a nine.",
        "textFa": "متاسفم، این مدل سایز ۹ نداریم."
    },
    {
        "id": 23,
        "seconds": 90.0,
        "endSeconds": 92.5,
        "timeDisplay": "1:30",
        "speaker": "Salesperson",
        "textEn": "But we do have these and they're the same price.",
        "textFa": "اما این مدل دیگر را داریم که دقیقاً هم‌قیمت هستند."
    },
    {
        "id": 24,
        "seconds": 92.5,
        "endSeconds": 94.1,
        "timeDisplay": "1:32",
        "speaker": "Salesperson",
        "textEn": "Or you can have a refund.",
        "textFa": "یا اینکه می‌توانید وجهتان را پس بگیرید."
    },
    {
        "id": 25,
        "seconds": 95.9,
        "endSeconds": 98.3,
        "timeDisplay": "1:35",
        "speaker": "Rob",
        "textEn": "Uh... I'll take this pair then, please.",
        "textFa": "اه... پس همین جفت را برمی‌دارم، لطفاً."
    },
    {
        "id": 26,
        "seconds": 98.3,
        "endSeconds": 100.7,
        "timeDisplay": "1:38",
        "speaker": "Salesperson",
        "textEn": "No problem. Do you have the receipt?",
        "textFa": "مشکلی نیست. رسید خرید را همراه دارید؟"
    },
    {
        "id": 27,
        "seconds": 101.5,
        "endSeconds": 103.0,
        "timeDisplay": "1:41",
        "speaker": "Rob",
        "textEn": "Yes, here you are.",
        "textFa": "بله، بفرمایید."
    },
    {
        "id": 28,
        "seconds": 103.0,
        "endSeconds": 103.5,
        "timeDisplay": "1:43",
        "speaker": "Salesperson",
        "textEn": "Brilliant.",
        "textFa": "عالیه."
    }
]

target_file = r'E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '  {\n    "id": "a2-v07",'
end_marker = '  {\n    "id": "a2-v08",'

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
    raise ValueError("questions marker not found in existing a2-v07 block")

questions_text = existing_block[q_idx:].strip()
if questions_text.endswith("},"):
    questions_text = questions_text[:-2].rstrip()

new_lesson_header = {
    "id": "a2-v07",
    "level": "a2",
    "episodeNumber": 7,
    "titleFa": "اپیزود ۳ · بخش ۱: خرید کفش و تعویض آن در فروشگاه به دلیل تفاوت سایز",
    "titleEn": "Episode 3 · Part 1: Taking Something Back to a Store (Shoe Sizes & Exchange)",
    "bookLevel": "American English File 2 (3rd Edition)",
    "unit": "Practical English Episode 3",
    "cefr": "A2",
    "duration": "1:47",
    "durationSec": 107,
    "fileName": "AEF3e_SB2_PE_Ep3_Taking_something_back_to_a_store.mp4",
    "videoUrl": "/api/videos/stream?series=aef&level=a2&file=AEF3e_SB2_PE_Ep3_Taking_something_back_to_a_store.mp4",
    "embedType": "direct",
    "posterGradient": "linear-gradient(135deg, #db2777, #f472b6)",
    "posterIcon": "👟",
    "summaryFa": "راب به یک فروشگاه کفش می‌رود و یک جفت کفش سایز ۸ بدون پرو کردن می‌خرد و مبلغ را با احتساب ۱۵ درصد مالیات بر فروش پرداخت می‌کند. نیم‌ساعت بعد راب مجدداً به فروشگاه بازمی‌گردد زیرا متوجه می‌شود کفش‌ها برایش کوچک است؛ او سایز ۸ بریتانیا می‌پوشد که معادل سایز ۹ آمریکاست. فروشنده انبار را چک می‌کند اما سایز ۹ آن مدل را ندارد؛ بنابراین دو گزینه پیش روی راب می‌گذارد: دریافت وجه (Refund) یا انتخاب مدلی دیگر با همان قیمت. راب مدل جایگزین را انتخاب کرده و با ارائه رسید خرید، کفش را تعویض می‌کند.",
    "summaryEn": "Rob visits a shoe store and buys a pair of size 8 shoes without trying them on, paying by card including a 15% sales tax. Half an hour later, he returns because they are too small; he wears a UK size 8, which corresponds to a US size 9. The salesperson checks stock but doesn't have that model in a US 9, offering either a full refund or an alternative pair at the same price. Rob accepts the alternative pair, presents his receipt, and completes the exchange.",
    "keyTopicsFa": [
        "پرسیدن موجودی سایز کفش و لباس (Do you have these in an eight?)",
        "سوال درباره قیمت و اضافه شدن مالیات بر فروش (How much are they? / Added sales tax)",
        "پرداخت با کارت اعتباری (Do you take Mastercard?)",
        "تفاوت سایزبندی بریتانیا و آمریکا (A UK eight is a US nine)",
        "مرجوع کردن کالا و گزینه‌های تعویض یا استرداد وجه (Exchange or refund / Do you have the receipt?)"
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

print(f"Successfully updated a2-v07 in aef-curriculum.ts with {len(transcript)} transcript lines!")
