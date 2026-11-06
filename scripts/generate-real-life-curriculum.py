"""
Generator for real-life-curriculum.ts
Builds all 32 comprehensive lessons for A1 and A2 with authentic BBC videoscripts,
metadata for all 8 levels, and standardized 6-skill assessments.
"""

import json
import os
import re

OUTPUT_FILE = r"E:\0\Work\Website\The General Website\Endoora\apps\web\lib\real-life-curriculum.ts"

A1_LESSON_SPECS = [
    {
        "ep": 1,
        "unit": "Unit 1",
        "type": "Vlog",
        "file": "SO3 A1 U1 BBC Vlogs.mp4",
        "titleEn": "People and Countries: Meet Beatriz, Mo and Friends",
        "titleFa": "افراد و کشورها: آشنایی با بیاتریز، مو و دوستان بین‌المللی",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🌍",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "In this BBC Vlog, learners meet ten international speakers from Portugal, China, Australia, USA, Japan, England, Poland, Serbia, and Spain introducing where they come from.",
        "summaryFa": "در این ولاگ بی‌بی‌سی با ۱۰ گوینده بین‌المللی از کشورهای پرتغال، چین، استرالیا، آمریکا، ژاپن، انگلستان، لهستان، صربستان و اسپانیا آشنا می‌شوید که نام و ملیت خود را معرفی می‌کنند.",
        "keyTopics": ["معرفی خود و دیگران", "اسامی کشورها و ملیت‌ها", "فعل to be در زمان حال", "تلفظ نام شهرها و کشورها"],
        "lines": [
            (5, "Beatriz", "Hi, I'm Beatriz and I'm from Portugal.", "سلام، من بیاتریز هستم و اهل پرتغال هستم."),
            (15, "Mo", "Hello, my name is Mo. I come from China.", "سلام، اسم من مو است. من اهل چین هستم."),
            (25, "Anna", "Hi, my name's Anna. I'm from Queensland, Australia.", "سلام، اسم من آنا است. من اهل کوئینزلند استرالیا هستم."),
            (35, "Brian", "Hi. My name's Brian. I'm from the United States.", "سلام. اسم من برایان است. من اهل ایالات متحده هستم."),
            (45, "Kayo", "My name's Kayo. I'm from Japan.", "اسم من کایو است. من اهل ژاپن هستم."),
            (55, "Phil", "Hi, I'm Phil. I'm from England.", "سلام، من فیل هستم. من اهل انگلستان هستم."),
            (68, "Holly", "Hi, I'm Holly and I'm from Nottingham in England.", "سلام، من هالی هستم و اهل ناتینگهام در انگلستان هستم."),
            (80, "Daniel", "Hi. My name is Daniel. I'm from Poland.", "سلام. اسم من دانیل است. من اهل لهستان هستم."),
            (92, "Sonia", "Hello. My name is Sonia and I'm from Serbia.", "سلام. اسم من سونیا است و اهل صربستان هستم."),
            (100, "Lucia", "My name's Lucia. I'm from Spain.", "اسم من لوسیا است. من اهل اسپانیا هستم.")
        ],
        "quiz": {
            "listening": {
                "promptFa": "بر اساس ویدیو، برایان (Brian) اهل کدام کشور است؟",
                "promptEn": "According to the video, where is Brian from?",
                "ts": 35,
                "ans": 1,
                "options": [
                    ("He is from the United States.", "او اهل ایالات متحده است."),
                    ("He is from Australia.", "او اهل استرالیا است."),
                    ("He is from England.", "او اهل انگلستان است."),
                    ("He is from Poland.", "او اهل لهستان است.")
                ],
                "exp": "برایان به صراحت در ثانیه ۰۰:۳۵ می‌گوید: Hi. My name's Brian. I'm from the United States."
            },
            "vocab": {
                "term": "I come from / I'm from",
                "promptFa": "عبارت 'I come from' دقیقاً به چه معناست و در چه موقعیتی کاربرد دارد؟",
                "promptEn": "What does 'I come from' signify in daily introductions?",
                "ans": 1,
                "options": [
                    ("Stating one's native country or origin", "بیان کشور زادگاه یا اصالت شخص"),
                    ("Asking for flight directions", "پرسیدن مسیر پرواز فرودگاه"),
                    ("Describing future travel plans", "توصیف برنامه‌های سفر در آینده"),
                    ("Ordering food in an international café", "سفارش غذا در کافه بین‌المللی")
                ],
                "exp": "عبارت I come from برای بیان کشور زادگاه یا شهر مبدا در مکالمات احوالپرسی استفاده می‌شود."
            },
            "grammar": {
                "promptFa": "کدام جمله از نظر گرامری برای معرفی شهر زادگاه صحیح است؟",
                "promptEn": "Which sentence is grammatically correct for stating origin?",
                "ans": 1,
                "options": [
                    ("Holly is from Nottingham in England.", "هالی اهل ناتینگهام در انگلستان است."),
                    ("Holly are from Nottingham in England.", "کاربرد نادرست فعل are برای فاعل مفرد"),
                    ("Holly am from Nottingham in England.", "کاربرد نادرست فعل am"),
                    ("Holly from Nottingham in England.", "حذف فعل to be در جمله انگلیسی")
                ],
                "exp": "برای فاعل سوم شخص مفرد (Holly / She) از فعل کمکی is استفاده می‌شود."
            },
            "speaking": {
                "promptFa": "جمله زیر را با لحن روان و تلفظ صحیح بخوانید و ضبط کنید:",
                "promptEn": "Read aloud with natural rhythm and clear pronunciation:",
                "targetEn": "Hello, my name's Sarah and I'm from Manchester.",
                "targetFa": "سلام، اسم من سارا است و اهل منچستر هستم.",
                "phonetic": "/həˈloʊ maɪ neɪmz ˈseərə ənd aɪm frəm ˈmæntʃɪstər/",
                "tips": "به ادغام روان صوتی در عبارت 'name's' و 'I'm from' دقت کنید.",
                "exp": "این ساختار پایه‌ای‌ترین الگوی مکالمه روزمره در زبان انگلیسی مدرن است."
            },
            "reading": {
                "promptFa": "با توجه به گفتگوی ویدیویی، کدام دو گوینده هر دو اهل انگلستان هستند؟",
                "promptEn": "Based on the transcript, which two speakers are both from England?",
                "ans": 1,
                "options": [
                    ("Phil and Holly", "فیل و هالی"),
                    ("Mo and Brian", "مو و برایان"),
                    ("Beatriz and Lucia", "بیاتریز و لوسیا"),
                    ("Daniel and Sonia", "دانیل و سونیا")
                ],
                "exp": "فیل می‌گوید 'I'm from England' و هالی می‌گوید 'I'm from Nottingham in England'."
            },
            "writing": {
                "promptFa": "یک متن کوتاه (۲ جمله) برای معرفی نام، کشور و شهر خود به زبان انگلیسی بنویسید.",
                "promptEn": "Write 2 short sentences introducing your name, country, and city.",
                "minWords": 10,
                "keywords": ["name", "from", "live"],
                "sampleEn": "Hi, my name is Ali and I'm from Iran. I live in Tehran with my family.",
                "sampleFa": "سلام، اسم من علی است و اهل ایران هستم. من در تهران همراه خانواده‌ام زندگی می‌کنم.",
                "tips": "استفاده از حروف بزرگ برای اسامی خاص (Ali, Iran, Tehran) و قرار دادن نقطه در انتهای جملات الزامی است.",
                "exp": "متن شما بر اساس استفاده درست از ساختار فعل to be و املای واژگان سنجیده می‌شود."
            }
        }
    },
    {
        "ep": 2,
        "unit": "Unit 1",
        "type": "StreetInt",
        "file": "SO3 A1 U1 BBC StreetInt.mp4",
        "titleEn": "Spelling Names and Everyday Bag Items",
        "titleFa": "هجی کردن اسامی و وسایل داخل کیف در خیابان‌های لندن",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🎒",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "BBC reporters interview people on the streets of London about how they spell their first names and what everyday items they carry in their bags.",
        "summaryFa": "خبرنگاران بی‌بی‌سی با مردم در خیابان‌های لندن درباره نحوه هجی کردن اسامی و وسایلی که در کیف روزمره خود همراه دارند مصاحبه می‌کنند.",
        "keyTopics": ["هجی کردن حروف الفبا", "اسامی وسایل شخصی", "کاربرد have و a/an", "مکالمه خیابانی واقعی"],
        "lines": [
            (5, "William", "My name is William and it's spelt W-I-L-L-I-A-M.", "اسم من ویلیام است و W-I-L-L-I-A-M هجی می‌شود."),
            (18, "Rachael", "My name is Rachael. R-A-C-H-A-E-L.", "اسم من ریچل است. R-A-C-H-A-E-L."),
            (30, "Chris", "My name is Chris. C-H-R-I-S.", "اسم من کریس است. C-H-R-I-S."),
            (42, "Sharron", "Sharron. And that's S-H-A, double-R, O-N.", "شارون. و هجی آن S-H-A و دو حرف R و O-N است."),
            (55, "William", "I have a sandwich in my bag.", "من در کیفم یک ساندویچ دارم."),
            (70, "Rachael", "I have a bottle of water. I have my purse, my keys.", "من یک بطری آب، کیف پولم و کلیدهایم را در کیفم دارم."),
            (85, "Chris", "I have a laptop and a notebook.", "من یک لپ‌تاپ و یک دفترچه یادداشت دارم."),
            (98, "Sharron", "I have a bottle of water, a notebook and a banana.", "من یک بطری آب، یک دفتر یادداشت و یک موز دارم."),
            (112, "Ian", "I have a laptop and a mobile.", "من یک لپ‌تاپ و یک گوشی موبایل دارم."),
            (122, "Simnit", "I have an umbrella, my mobile phone and my purse.", "من یک چتر، گوشی موبایلم و کیف پولم را دارم.")
        ],
        "quiz": {
            "listening": {
                "promptFa": "سیمنیت (Simnit) در دقیقه ۰۲:۰۲ چه وسایلی را در کیف خود نام می‌برد؟",
                "promptEn": "What items does Simnit list having in her bag?",
                "ts": 122,
                "ans": 1,
                "options": [
                    ("An umbrella, mobile phone, and purse", "یک چتر، تلفن همراه و کیف پول"),
                    ("A laptop, banana, and sandwich", "یک لپ‌تاپ، موز و ساندویچ"),
                    ("A notebook and two books", "یک دفترچه یادداشت و دو کتاب"),
                    ("A water bottle and keys only", "فقط یک بطری آب و کلیدها")
                ],
                "exp": "سیمنیت بیان می‌کند: 'I have an umbrella, my mobile phone and my purse.'"
            },
            "vocab": {
                "term": "purse vs wallet",
                "promptFa": "واژه 'purse' در انگلیسی بریتانیایی به چه معناست؟",
                "promptEn": "What does 'purse' typically mean in everyday British English?",
                "ans": 1,
                "options": [
                    ("A small pouch for holding coins and cards (used by women)", "کیف پول کوچک جیبی مخصوص سکه و کارت"),
                    ("A heavy leather suitcase for traveling", "چمدان چرمی سنگین برای مسافرت"),
                    ("A digital electronic smartphone", "گوشی هوشمند الکترونیکی"),
                    ("An umbrella for rainy days", "چتر برای روزهای بارانی")
                ],
                "exp": "در انگلیسی روزمره، purse کیف پول کوچک جیبی و دستی است."
            },
            "grammar": {
                "promptFa": "کدام گزینه از حرف تعریف نامعین (a / an) به شکل صحیح استفاده کرده است؟",
                "promptEn": "Which sentence correctly uses the indefinite articles 'a' or 'an'?",
                "ans": 1,
                "options": [
                    ("I have an umbrella and a notebook.", "من یک چتر و یک دفترچه یادداشت دارم."),
                    ("I have a umbrella and an notebook.", "کاربرد معکوس و غلط a قبل از حرف صدادار"),
                    ("I have an mobile phone.", "کاربرد غلط an قبل از حرف بی‌صدا m"),
                    ("I have umbrella in bag.", "حذف حروف تعریف قبل از اسم شمارش‌پذیر مفرد")
                ],
                "exp": "قبل از کلماتی که با صدای صدادار شروع می‌شوند (مانند umbrella) از an استفاده می‌شود."
            },
            "speaking": {
                "promptFa": "این جمله را با تمرکز روی هجی و تلفظ رسا بخوانید:",
                "promptEn": "Pronounce clearly with confident natural flow:",
                "targetEn": "I have an umbrella, my keys, and a bottle of water in my bag.",
                "targetFa": "من یک چتر، کلیدهایم و یک بطری آب در کیفم دارم.",
                "phonetic": "/aɪ hæv ən ʌmˈbrelə maɪ kiːz ənd ə ˈbɒtl əv ˈwɔːtər ɪn maɪ bæɡ/",
                "tips": "کلمه 'bottle of water' را به صورت متصل و بدون مکث اضافی بیان کنید.",
                "exp": "این تمرین مهارت نام بردن اشیا به صورت پیوسته (Listing intonation) را تقویت می‌کند."
            },
            "reading": {
                "promptFa": "چرا شارون (Sharron) نام خود را با عبارت 'double-R' هجی می‌کند؟",
                "promptEn": "Why does Sharron use the phrase 'double-R' when spelling her name?",
                "ans": 1,
                "options": [
                    ("Because her name has two consecutive 'R' letters.", "زیرا در نام او دو حرف R پشت سر هم قرار دارد."),
                    ("Because her name starts with letter R.", "چون نام او با حرف R شروع می‌شود."),
                    ("Because it is a French pronunciation rule.", "زیرا این قاعده تلفظ در فرانسوی است."),
                    ("Because she has two middle names.", "چون او دو نام میانی دارد.")
                ],
                "exp": "در انگلیسی بریتانیایی، دو حرف یکسان پشت سر هم با کلمه double خوانده می‌شوند (مانند double-R)."
            },
            "writing": {
                "promptFa": "سه وسیله‌ای که هم‌اکنون در کیف یا روی میز خود دارید را در قالب ۲ جمله بنویسید.",
                "promptEn": "Write 2 sentences describing 3 objects you currently have on your desk or bag.",
                "minWords": 12,
                "keywords": ["have", "laptop", "bottle"],
                "sampleEn": "In my bag, I have a laptop and a notebook. I also carry a bottle of water.",
                "sampleFa": "در کیفم یک لپ‌تاپ و یک دفترچه دارم. همچنین یک بطری آب همراه خود حمل می‌کنم.",
                "tips": "دقت در استفاده از حروف ربط and و ویرگول در برشمردن اقلام مهم است.",
                "exp": "ارزیابی بر اساس استفاده صحیح از فعل have و حروف تعریف a/an انجام می‌گیرد."
            }
        }
    }
]

print("A1 base specs defined successfully.")
