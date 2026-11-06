"""
Full Builder for Real-Life Practical English Curriculum
Constructs real-life-curriculum.ts with 32 complete lessons for A1 & A2
and metadata for all 8 levels.
"""

import os
import json
import re

A1_TXT = r"C:\Users\acer\.gemini\antigravity\brain\85d8708f-c245-4a14-a68f-356a7de104f9\a1_videoscripts.txt"
A2_TXT = r"C:\Users\acer\.gemini\antigravity\brain\85d8708f-c245-4a14-a68f-356a7de104f9\a2_videoscripts.txt"
DEST_FILE = r"E:\0\Work\Website\The General Website\Endoora\apps\web\lib\real-life-curriculum.ts"

A1_LESSONS_INFO = [
    {
        "ep": 1,
        "unit": "Unit 1",
        "type": "Vlog",
        "file": "SO3 A1 U1 BBC Vlogs.mp4",
        "titleEn": "People and Countries: International Introductions",
        "titleFa": "افراد و کشورها: معرفی نام و ملیت‌های بین‌المللی",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🌍",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "Ten people from Portugal, China, Australia, USA, Japan, England, Poland, Serbia, and Spain introduce their names and where they are from.",
        "summaryFa": "ده نفر از کشورهای پرتغال، چین، استرالیا، آمریکا، ژاپن، انگلستان، لهستان، صربستان و اسپانیا نام و کشور مبدا خود را معرفی می‌کنند.",
        "keyTopics": ["معرفی خود و دیگران", "اسامی کشورها و ملیت‌ها", "فعل to be در زمان حال", "تلفظ نام شهرها"],
        "speakingTargetEn": "Hello, my name's Sarah and I'm from Manchester.",
        "speakingTargetFa": "سلام، اسم من سارا است و اهل منچستر هستم.",
        "speakingPhonetic": "/həˈloʊ maɪ neɪmz ˈseərə ənd aɪm frəm ˈmæntʃɪstər/",
        "speakingTips": "به پیوستگی صوتی بین کلمات 'name's' و 'I'm from' دقت کنید.",
        "minWords": 10,
        "keywords": ["name", "from", "live"],
        "sampleEn": "Hi, my name is Daniel and I am from Poland. I now live and study in Warsaw.",
        "sampleFa": "سلام، اسم من دانیل است و اهل لهستان هستم. من اکنون در ورشو زندگی و تحصیل می‌کنم."
    },
    {
        "ep": 2,
        "unit": "Unit 1",
        "type": "StreetInt",
        "file": "SO3 A1 U1 BBC StreetInt.mp4",
        "titleEn": "Spelling Names and Everyday Bag Items",
        "titleFa": "هجی کردن نام و معرفی وسایل شخصی در کیف",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🎒",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "People on London streets spell their names letter by letter and show the essential daily objects they carry in their bags.",
        "summaryFa": "مردم در خیابان‌های لندن نام خود را حرف‌به‌حرف هجی می‌کنند و وسایل ضروری همراه خود در کیف را نشان می‌دهند.",
        "keyTopics": ["هجی کردن الفبا (Spelling)", "وسایل شخصی روزمره", "کاربرد have و حروف تعریف a/an", "مکالمه خیابانی"],
        "speakingTargetEn": "I have an umbrella, my keys, and a bottle of water in my bag.",
        "speakingTargetFa": "من یک چتر، کلیدهایم و یک بطری آب در کیفم دارم.",
        "speakingPhonetic": "/aɪ hæv ən ʌmˈbrelə maɪ kiːz ənd ə ˈbɒtl əv ˈwɔːtər ɪn maɪ bæɡ/",
        "speakingTips": "کلمه umbrella با حرف صدادار آغاز می‌شود و نیاز به an دارد.",
        "minWords": 12,
        "keywords": ["have", "laptop", "bottle"],
        "sampleEn": "In my bag I always have my laptop, notebook, and a small bottle of water.",
        "sampleFa": "در کیفم همیشه لپ‌تاپ، دفترچه یادداشت و یک بطری کوچک آب دارم."
    },
    {
        "ep": 3,
        "unit": "Unit 2",
        "type": "Vlog",
        "file": "SO3 A1 U2 BBC Vlogs.mp4",
        "titleEn": "Where Are You Today? Cities, Homes and Travel",
        "titleFa": "امروز کجا هستید؟ شهرها، اقامت و سفرهای کاری",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "🏙️",
        "gradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "summaryEn": "Speakers share where they were born versus where they currently live and work today, from Bogota to London, Rome and Florence.",
        "summaryFa": "گویندگان تفاوت محل تولد و محل زندگی و کار فعلی خود را از بوگوتا تا لندن، رم و فلورانس بازگو می‌کنند.",
        "keyTopics": ["توصیف محل سکونت", "کاربرد now و today", "افعال حالت و مکان", "شهرهای بزرگ جهان"],
        "speakingTargetEn": "I'm from Scotland, but now I live and work in Italy.",
        "speakingTargetFa": "من اهل اسکاتلند هستم، ولی در حال حاضر در ایتالیا زندگی و کار می‌کنم.",
        "speakingPhonetic": "/aɪm frəm ˈskɒtlənd bʌt naʊ aɪ lɪv ənd wɜːk ɪn ˈɪtəli/",
        "speakingTips": "تضاد بین 'I'm from' و 'now I live' را با لحن شفاف ادا کنید.",
        "minWords": 10,
        "keywords": ["from", "now", "live"],
        "sampleEn": "I am originally from Greece, but now I live in Madrid, Spain for my studies.",
        "sampleFa": "من اصالتاً اهل یونان هستم، اما اکنون برای تحصیلم در مادرید اسپانیا زندگی می‌کنم."
    },
    {
        "ep": 4,
        "unit": "Unit 2",
        "type": "Programme",
        "file": "SO3 A1 U2 BBC Programmes.mp4",
        "titleEn": "BBC Food: The Best Home Cook Cake Challenge",
        "titleFa": "آشپزی بی‌بی‌سی: مسابقه پخت کیک تولد در برنامه برترین آشپز",
        "duration": "3:15",
        "durationSec": 195,
        "icon": "🎂",
        "gradient": "linear-gradient(135deg, #d97706, #f59e0b)",
        "summaryEn": "Presenter Claudia Winkleman and judges introduce eight talented home cooks from across the UK attempting to bake the ultimate birthday cake.",
        "summaryFa": "مجری برنامه کلودیا و داوران هشت آشپز خانگی بااستعداد از سراسر بریتانیا را معرفی می‌کنند که برای پخت کیک تولد نهایی رقابت می‌کنند.",
        "keyTopics": ["شغل‌ها و مشخصات فردی", "اعداد و سن افراد", "توصیف اعضای خانواده", "دستورات آشپزی و زمان"],
        "speakingTargetEn": "You have three hours to make the ultimate birthday cake.",
        "speakingTargetFa": "شما سه ساعت فرصت دارید تا کیک تولد نهایی را آماده کنید.",
        "speakingPhonetic": "/juː hæv θriː ˈaʊərz tuː meɪk ðiː ˈʌltɪmət ˈbɜːθdeɪ keɪk/",
        "speakingTips": "تلفظ حرف th در کلمات 'three' و 'birthday' را نرم و بین دندانی ادا کنید.",
        "minWords": 12,
        "keywords": ["make", "hours", "family"],
        "sampleEn": "Robin has three hours to make a cake for his daughter and family.",
        "sampleFa": "رابین سه ساعت فرصت دارد تا برای دختر و خانواده‌اش یک کیک درست کند."
    },
    {
        "ep": 5,
        "unit": "Unit 3",
        "type": "Vlog",
        "file": "SO3 A1 U3 BBC Vlogs.mp4",
        "titleEn": "My Favourite Things: Bikes, Cameras and Pets",
        "titleFa": "وسایل و دارایی‌های محبوب من: دوچرخه، دوربین و حیوانات خانگی",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🚲",
        "gradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
        "summaryEn": "Vloggers talk about their most cherished belongings, including pets, fast bicycles, cameras, and artwork.",
        "summaryFa": "ولاگرها درباره ارزشمندترین وسایل شخصی خود، از جمله حیوانات خانگی، دوچرخه پرسرعت، دوربین و نقاشی صحبت می‌کنند.",
        "keyTopics": ["صفت‌های ملکی (my, his, her)", "صفت‌های توصیفی (new, fast, beautiful)", "حیوانات خانگی و علایق", "بیان علت با because"],
        "speakingTargetEn": "My favourite thing is my bike because it is fast and new.",
        "speakingTargetFa": "وسیله محبوب من دوچرخه‌ام است چون سریع و نو است.",
        "speakingPhonetic": "/maɪ ˈfeɪvərɪt θɪŋ ɪz maɪ baɪk bɪˈkəz ɪt ɪz fæst ənd njuː/",
        "speakingTips": "روی صفت‌های fast و new تاکید کلامی (Stress) بگذارید.",
        "minWords": 12,
        "keywords": ["favourite", "because", "new"],
        "sampleEn": "My favourite thing is my digital camera because it takes beautiful photos of nature.",
        "sampleFa": "وسیله محبوب من دوربین دیجیتالم است زیرا عکس‌های زیبایی از طبیعت می‌گیرد."
    },
    {
        "ep": 6,
        "unit": "Unit 3",
        "type": "StreetInt",
        "file": "SO3 A1 U3 BBC StreetInt.mp4",
        "titleEn": "Shopping Habits: Online Orders vs High Street Shops",
        "titleFa": "عادات خرید: مقایسه سفارش آنلاین و خرید از فروشگاه‌های حضوری",
        "duration": "2:15",
        "durationSec": 135,
        "icon": "🛍️",
        "gradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "summaryEn": "London shoppers share what they buy online versus what they prefer buying in physical high street shops.",
        "summaryFa": "خریداران در لندن مواردی را که آنلاین سفارش می‌دهند در برابر خریدهای حضوری از فروشگاه‌های شهر مقایسه می‌کنند.",
        "keyTopics": ["افعال حال ساده (buy, like, hate)", "انواع فروشگاه‌ها (café, supermarket, clothes)", "خرید آنلاین در برابر حضوری", "بیان سلیقه"],
        "speakingTargetEn": "I buy books online, but I prefer buying clothes in shops.",
        "speakingTargetFa": "من کتاب را آنلاین می‌خرم، اما ترجیح می‌دهم لباس را در فروشگاه بخرم.",
        "speakingPhonetic": "/aɪ baɪ bʊks ˈɒnlaɪn bʌt aɪ prɪˈfɜːr ˈbaɪɪŋ kloʊðz ɪn ʃɒps/",
        "speakingTips": "تلفظ clothes را یک‌سیلابی و شبیه /kloʊz/ ادا کنید.",
        "minWords": 12,
        "keywords": ["buy", "online", "shops"],
        "sampleEn": "I always buy electronics online, but I like buying fresh food in supermarkets.",
        "sampleFa": "من همیشه لوازم الکترونیکی را آنلاین می‌خرم، اما خرید غذای تازه از سوپرمارکت را ترجیح می‌دهم."
    },
    {
        "ep": 7,
        "unit": "Unit 4",
        "type": "Vlog",
        "file": "SO3 A1 U4 BBC Vlogs.mp4",
        "titleEn": "Daily Meals: Breakfast, Lunch and Dinner Routines",
        "titleFa": "وعده‌های روزانه: روتین صبحانه، ناهار و شام",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🍳",
        "gradient": "linear-gradient(135deg, #ea580c, #f97316)",
        "summaryEn": "Speakers describe their favorite meals of the day, favorite dishes like tuna salad, pasta, omelettes, and coffee.",
        "summaryFa": "گویندگان وعده‌های غذایی محبوب روزانه خود و غذاهایی مانند سالاد ماهی تن، پاستا، املت و قهوه را شرح می‌دهند.",
        "keyTopics": ["وعده‌های غذایی (Breakfast, Lunch, Dinner)", "غذاها و نوشیدنی‌ها", "قیدهای تکرار (always, usually)", "سلیقه غذایی"],
        "speakingTargetEn": "Breakfast is my favourite meal; I always have coffee and eggs.",
        "speakingTargetFa": "صبحانه وعده محبوب من است؛ من همیشه قهوه و تخم‌مرغ می‌خورم.",
        "speakingPhonetic": "/ˈbrekfəst ɪz maɪ ˈfeɪvərɪt miːl aɪ ˈɔːlweɪz hæv ˈkɒfi ənd eɡz/",
        "speakingTips": "کلمه breakfast را با تلفظ /brek/ و نه /breik/ ادا کنید.",
        "minWords": 12,
        "keywords": ["meal", "always", "coffee"],
        "sampleEn": "My favourite meal is dinner. I usually have pasta with fresh salad and tea.",
        "sampleFa": "وعده محبوب من شام است. من معمولاً پاستا با سالاد تازه و چای می‌خورم."
    },
    {
        "ep": 8,
        "unit": "Unit 4",
        "type": "Programme",
        "file": "SO3 A1 U4 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: Lives Around the Globe",
        "titleFa": "مستند بی‌بی‌سی: زندگی‌های شگفت‌انگیز در هندوستان، کلرادو و پرو",
        "duration": "3:20",
        "durationSec": 200,
        "icon": "🦜",
        "gradient": "linear-gradient(135deg, #15803d, #22c55e)",
        "summaryEn": "Discover Joseph feeding thousands of parakeets in India, Billy guarding against forest fires in Colorado, and Elvira welcoming manatees in Peru.",
        "summaryFa": "آشنایی با جوزف که به هزاران طوطی در هند غذا می‌دهد، بیلی که دیده‌بان آتش‌سوزی جنگل در کلرادو است، و الویرا در پرو.",
        "keyTopics": ["حال ساده سوم شخص مفرد (-s/-es)", "روایت مستند طبیعی", "ساعات و زمان (half past five)", "حیوانات و محیط زیست"],
        "speakingTargetEn": "He gets up at half past five and makes food for the birds.",
        "speakingTargetFa": "او ساعت پنج و نیم بیدار می‌شود و برای پرندگان غذا درست می‌کند.",
        "speakingPhonetic": "/hiː ɡets ʌp ət hɑːf pɑːst faɪv ənd meɪks fuːd fɔːr ðə bɜːdz/",
        "speakingTips": "به پسوند s سوم شخص در 'gets up' و 'makes' دقت ویژه داشته باشید.",
        "minWords": 14,
        "keywords": ["early", "morning", "animals"],
        "sampleEn": "Every morning he gets up early to protect the forest and care for animals.",
        "sampleFa": "او هر روز صبح زود بیدار می‌شود تا از جنگل محافظت کرده و از حیوانات مراقبت کند."
    },
    {
        "ep": 9,
        "unit": "Unit 5",
        "type": "Vlog",
        "file": "SO3 A1 U5 BBC Vlogs.mp4",
        "titleEn": "Jobs and Workplaces: Doctors, IT and Journalists",
        "titleFa": "مشاغل و محیط‌های کاری: پزشکان، متخصصان فناوری و خبرنگاران",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "💼",
        "gradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
        "summaryEn": "International professionals talk about their roles, from junior doctors in Manchester to IT specialists, school teachers, and BBC journalists.",
        "summaryFa": "متخصصان بین‌المللی درباره شغل‌های خود از پزشکی در منچستر تا متخصص آی‌تی، معلمی در آنکارا و خبرنگاری بی‌بی‌سی صحبت می‌کنند.",
        "keyTopics": ["اسامی مشاغل (doctor, teacher, journalist)", "ساعات کاری (from 8 a.m. to 5 p.m.)", "توصیف محیط کار و همکاران", "کار از خانه (work from home)"],
        "speakingTargetEn": "I work in IT and I work from home every day.",
        "speakingTargetFa": "من در حوزه فناوری اطلاعات کار می‌کنم و هر روز از خانه کار می‌کنم.",
        "speakingPhonetic": "/aɪ wɜːk ɪn aɪˈtiː ənd aɪ wɜːk frəm hoʊm ˈevri deɪ/",
        "speakingTips": "عبارت 'work from home' را بدون مکث و متصل تلفظ کنید.",
        "minWords": 12,
        "keywords": ["work", "hours", "hospital"],
        "sampleEn": "I work as a teacher in a school and I really enjoy helping my students.",
        "sampleFa": "من به عنوان معلم در یک مدرسه کار می‌کنم و واقعاً از کمک به دانش‌آموزانم لذت می‌برم."
    },
    {
        "ep": 10,
        "unit": "Unit 5",
        "type": "StreetInt",
        "file": "SO3 A1 U5 BBC Vlogs.mp4",
        "titleEn": "Birthdays, Calendar Dates and Celebrations",
        "titleFa": "روز تولد، تاریخ‌های تقویم و برنامه‌های جشن در لندن",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🎉",
        "gradient": "linear-gradient(135deg, #c026d3, #d946ef)",
        "summaryEn": "London residents talk about their birthdates, months of the year, and how they celebrate special occasions with friends and family.",
        "summaryFa": "شهروندان در لندن تاریخ تولد خود، ماه‌های سال و نحوه جشن گرفتن مناسبت‌های خاص با دوستان و خانواده را بیان می‌کنند.",
        "keyTopics": ["اعداد ترتیبی (first, second, fifteenth)", "ماه‌های سال و حروف اضافه تاریخ (on the 16th of May)", "برنامه‌های جشن و دورهمی", "غذا خوردن با دوستان"],
        "speakingTargetEn": "My birthday is on the fifteenth of September.",
        "speakingTargetFa": "تولد من پانزدهم ماه سپتامبر است.",
        "speakingPhonetic": "/maɪ ˈbɜːθdeɪ ɪz ɒn ðə ˌfɪfˈtiːnθ əv sepˈtembər/",
        "speakingTips": "تلفظ اعداد ترتیبی منتهی به th مانند fifteenth را با نوک زبان ادا کنید.",
        "minWords": 12,
        "keywords": ["birthday", "friends", "restaurant"],
        "sampleEn": "On my birthday, I always meet my friends and family for dinner at a nice restaurant.",
        "sampleFa": "در روز تولدم، من همیشه دوستان و خانواده‌ام را برای شام در یک رستوران خوب ملاقات می‌کنم."
    },
    {
        "ep": 11,
        "unit": "Unit 6",
        "type": "Vlog",
        "file": "SO3 A1 U6 BBC Vlogs.mp4",
        "titleEn": "What Can You See? Rooms, Gardens and Desks",
        "titleFa": "چه چیزهایی می‌بینید؟ توصیف اتاق‌ها، باغچه و میز کار",
        "duration": "1:35",
        "durationSec": 95,
        "icon": "🪴",
        "gradient": "linear-gradient(135deg, #059669, #34d399)",
        "summaryEn": "Vloggers look around their immediate surroundings in the garden, living room, office, and kitchen, naming everything they can spot.",
        "summaryFa": "ولاگرها به محیط اطراف خود در حیاط، اتاق نشیمن، دفتر کار و آشپزخانه نگاه می‌کنند و هر آنچه می‌بینند را نام می‌برند.",
        "keyTopics": ["فعل کمکی can برای توانایی و ادراک", "حروف اضافه مکان (in, at, outside)", "وسایل خانه و طبیعت", "اسامی مفرد و جمع"],
        "speakingTargetEn": "I'm in my kitchen and I can see my laptop and a cup of tea.",
        "speakingTargetFa": "من در آشپزخانه‌ام هستم و می‌توانم لپ‌تاپم و یک فنجان چای را ببینم.",
        "speakingPhonetic": "/aɪm ɪn maɪ ˈkɪtʃɪn ənd aɪ kən siː maɪ ˈlæptɒp ənd ə kʌp əv tiː/",
        "speakingTips": "کلمه 'can' در حالت مثبت به صورت ضعیف /kən/ ادا می‌شود.",
        "minWords": 12,
        "keywords": ["see", "room", "garden"],
        "sampleEn": "From my desk I can see green trees in the garden and the blue sky.",
        "sampleFa": "از روی میزم می‌توانم درختان سبز در باغچه و آسمان آبی را ببینم."
    },
    {
        "ep": 12,
        "unit": "Unit 6",
        "type": "Programme",
        "file": "SO3 A1 U6 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: Six Hours in Rome with Ade Adepitan",
        "titleFa": "مستند بی‌بی‌سی: شش ساعت گشت‌وگذار در رم با اد ادپیتان",
        "duration": "3:10",
        "durationSec": 190,
        "icon": "🏛️",
        "gradient": "linear-gradient(135deg, #b45309, #d97706)",
        "summaryEn": "Presenter Ade Adepitan has a six-hour airport layover and embarks on a whirlwind bus tour of Rome's most legendary historical landmarks.",
        "summaryFa": "اد ادپیتان مجری بی‌بی‌سی در توقف ۶ ساعته پروازش، با یک تور اتوبوسی سریع به دیدن معروف‌ترین آثار تاریخی شهر رم می‌رود.",
        "keyTopics": ["مکان‌های تاریخی و گردشگری (Colosseum, Trevi Fountain)", "سفر درون‌شهری با اتوبوس", "اعداد و آمار گردشگری", "مدیریت زمان در سفر"],
        "speakingTargetEn": "He has six hours to see the most famous monuments in Rome.",
        "speakingTargetFa": "او شش ساعت زمان دارد تا معروف‌ترین بناهای تاریخی رم را ببیند.",
        "speakingPhonetic": "/hiː hæz sɪks ˈaʊərz tuː siː ðə moʊst ˈfeɪməs ˈmɒnjʊmənts ɪn roʊm/",
        "speakingTips": "تلفظ واژه monuments به صورت /ˈmɒnjʊmənts/ با استرس روی بخش اول است.",
        "minWords": 14,
        "keywords": ["hours", "visit", "famous"],
        "sampleEn": "During his short stay in Rome, Ade visits the Colosseum and the beautiful Trevi Fountain.",
        "sampleFa": "در طول اقامت کوتاهش در رم، اد از کولوسئوم و فواره زیبای تروی بازدید می‌کند."
    },
    {
        "ep": 13,
        "unit": "Unit 7",
        "type": "Vlog",
        "file": "SO3 A1 U7 BBC Vlogs.mp4",
        "titleEn": "Healthy Eating Habits: Salads, Fruits vs Fast Food",
        "titleFa": "عادت‌های تغذیه سالم: سالاد و میوه در برابر فست‌فود",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🥗",
        "gradient": "linear-gradient(135deg, #16a34a, #4ade80)",
        "summaryEn": "Speakers honestly discuss their eating patterns, balancing fresh fruit and vegetables against temptations like burgers, pizza, and chocolate.",
        "summaryFa": "گویندگان با صداقت درباره رژیم غذایی خود، تعادل میان میوه و سبزیجات تازه در مقابل پیتزا، برگر و شکلات صحبت می‌کنند.",
        "keyTopics": ["واژگان خوراکی‌های سالم و ناسالم", "افعال try to eat و like", "حرف ربط but برای تضاد", "بیان رژیم غذایی روزمره"],
        "speakingTargetEn": "I try to eat healthy food, but I also love pizza and chocolate.",
        "speakingTargetFa": "من سعی می‌کنم غذای سالم بخورم، اما پیتزا و شکلات را هم خیلی دوست دارم.",
        "speakingPhonetic": "/aɪ traɪ tuː iːt ˈhelθi fuːd bʌt aɪ ˈɔːlsoʊ lʌv ˈpiːtsə ənd ˈtʃɒklət/",
        "speakingTips": "واژه chocolate به صورت دو سیلابی /ˈtʃɒklət/ تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["healthy", "fruit", "vegetables"],
        "sampleEn": "I eat lots of fresh fruit and vegetables every day to keep my body healthy.",
        "sampleFa": "من هر روز مقدار زیادی میوه و سبزیجات تازه می‌خورم تا بدنم را سالم نگه دارم."
    },
    {
        "ep": 14,
        "unit": "Unit 7",
        "type": "StreetInt",
        "file": "SO3 A1 U7 BBC StreetInt.mp4",
        "titleEn": "Sports, Exercise Routines and Fitness Advice",
        "titleFa": "ورزش، فعالیت بدنی و توصیه‌های تندرستی در شهر",
        "duration": "2:20",
        "durationSec": 140,
        "icon": "🏃",
        "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
        "summaryEn": "People in London share what sports they play (running, yoga, gym, tennis, basketball) and their top recommendations for staying active.",
        "summaryFa": "مردم در لندن ورزش‌های مورد علاقه خود (دویدن، یوگا، بدنسازی، تنیس، بسکتبال) و برترین توصیه‌های خود برای تناسب اندام را شرح می‌دهند.",
        "keyTopics": ["افعال ورزشی (play football, do yoga, go to the gym)", "قیدهای تکرار (twice a week, every day)", "جملات امری برای توصیه (Drink lots of water)", "کفش و لباس ورزشی"],
        "speakingTargetEn": "Drink lots of water, wear comfortable shoes, and practise every day.",
        "speakingTargetFa": "آب فراوان بنوشید، کفش‌های راحت بپوشید و هر روز تمرین کنید.",
        "speakingPhonetic": "/drɪŋk lɒts əv ˈwɔːtər weər ˈkʌmftəbl ʃuːz ənd ˈpræktɪs ˈevri deɪ/",
        "speakingTips": "کلمه comfortable به صورت /ˈkʌmftəbl/ تلفظ می‌شود نه /kɒmfɔːrteɪbl/.",
        "minWords": 12,
        "keywords": ["exercise", "water", "shoes"],
        "sampleEn": "For gym workouts, always drink water and wear good running shoes to prevent injuries.",
        "sampleFa": "برای تمرینات ورزشی، همیشه آب بنوشید و کفش‌های مناسب بپوشید تا از آسیب جلوگیری شود."
    },
    {
        "ep": 15,
        "unit": "Unit 8",
        "type": "Vlog",
        "file": "SO3 A1 U8 BBC Vlogs.mp4",
        "titleEn": "My Last Holiday: Sun, Destinations and Memorable Trips",
        "titleFa": "آخرین تعطیلات من: آفتاب، مقاصد سفر و خاطرات ماندگار",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "✈️",
        "gradient": "linear-gradient(135deg, #9333ea, #a855f7)",
        "summaryEn": "Travelers recount their recent vacations to Greece, Portugal, Australia, Amsterdam, Spain, Sweden, and Mexico, describing weather and culture.",
        "summaryFa": "مسافران تعطیلات اخیر خود به یونان، پرتغال، استرالیا، آمستردام، اسپانیا، سوئد و مکزیک را بازگو کرده و آب‌وهوا و فرهنگ را توصیف می‌کنند.",
        "keyTopics": ["گذشته ساده فعل to be (was, were)", "توصیف آب‌وهوا (sunny, hot, great)", "صفت‌های تحسین‌آمیز (fantastic, wonderful, delicious)", "کشورهای توریستی"],
        "speakingTargetEn": "My last holiday was great; we were in Greece and the weather was sunny.",
        "speakingTargetFa": "آخرین تعطیلات من عالی بود؛ ما در یونان بودیم و هوا آفتابی بود.",
        "speakingPhonetic": "/maɪ lɑːst ˈhɒlədeɪ wəz ɡreɪt wiː wɜːr ɪn ɡriːs ənd ðə ˈweðər wəz ˈsʌni/",
        "speakingTips": "تفاوت تلفظ was /wəz/ برای مفرد و were /wɜːr/ برای جمع را رعایت کنید.",
        "minWords": 12,
        "keywords": ["holiday", "weather", "friendly"],
        "sampleEn": "My last holiday in Spain was fantastic because the people were friendly and the food was delicious.",
        "sampleFa": "آخرین تعطیلات من در اسپانیا فوق‌العاده بود زیرا مردم خونگرم بودند و غذاها بسیار لذیذ بود."
    },
    {
        "ep": 16,
        "unit": "Unit 8",
        "type": "Programme",
        "file": "SO3 A1 U8 BBC Programmes.mp4",
        "titleEn": "BBC Entertainment: The Kodo Drummers of Japan",
        "titleFa": "سرگرمی بی‌بی‌سی: هنر نوازندگان طبل کودو در جزیره سادو ژاپن",
        "duration": "3:25",
        "durationSec": 205,
        "icon": "🥁",
        "gradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
        "summaryEn": "Comedians Nish Kumar and Joel Dommett travel to Sado Island in Japan to undergo intense discipline and learn taiko drumming from master teachers.",
        "summaryFa": "نیش کومار و جوئل دومت کمدین‌های بی‌بی‌سی به جزیره سادو در ژاپن سفر می‌کنند تا انضباط سخت و نوازندگی طبل تایکو را از اساتید بیاموزند.",
        "keyTopics": ["فرهنگ و سنت ژاپنی", "افعال توانایی و اجازه (be allowed to)", "روتین سخت تمرینی و ورزشی", "اصطلاحات قدردانی و احترام"],
        "speakingTargetEn": "Training starts early and they run ten kilometres around the island.",
        "speakingTargetFa": "تمرینات خیلی زود شروع می‌شود و آن‌ها ۱۰ کیلومتر دور جزیره می‌دوند.",
        "speakingPhonetic": "/ˈtreɪnɪŋ stɑːts ˈɜːli ənd ðeɪ rʌn ten kɪˈlɒmɪtərz əˈraʊnd ðiː ˈaɪlənd/",
        "speakingTips": "کلمه island با حرف s ناخوانا تلفظ می‌شود: /ˈaɪlənd/.",
        "minWords": 14,
        "keywords": ["practice", "early", "teachers"],
        "sampleEn": "The drummers wake up early every day and practice with immense discipline to master the instruments.",
        "sampleFa": "نوازندگان طبل هر روز صبح زود بیدار می‌شوند و با انضباط فراوان برای تسلط بر سازها تمرین می‌کنند."
    }
]

A2_LESSONS_INFO = [
    {
        "ep": 1,
        "unit": "Unit 1",
        "type": "Vlog",
        "file": "SO3 A2 U1 BBC Vlogs.mp4",
        "titleEn": "Daily Identities, Work Roles and Favourite Days",
        "titleFa": "هویت‌های فردی، نقش‌های شغلی و روزهای محبوب هفته",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "🗓️",
        "gradient": "linear-gradient(135deg, #0284c7, #0ea5e9)",
        "summaryEn": "London researchers, BBC studio coordinators, university students, and American photojournalists discuss their jobs, routines, and why Friday is their favorite day.",
        "summaryFa": "پژوهشگران لندن، همکاران استودیوی بی‌بی‌سی، دانشجویان و روزنامه‌نگاران عکاس درباره شغل‌ها و روزهای محبوب هفته خود صحبت می‌کنند.",
        "keyTopics": ["مشاغل حرفه‌ای (researcher, photojournalist)", "رشته‌های دانشگاهی (Law, French, History)", "روزهای هفته", "رنگ‌های مورد علاقه"],
        "speakingTargetEn": "My favourite day of the week is Friday because the weekend starts.",
        "speakingTargetFa": "روز محبوب من در هفته جمعه است چون آخر هفته آغاز می‌شود.",
        "speakingPhonetic": "/maɪ ˈfeɪvərɪt deɪ əv ðə wiːk ɪz ˈfraɪdeɪ bɪˈkəz ðə ˈwiːkend stɑːts/",
        "speakingTips": "استرس واژه Friday روی سیلاب اول /ˈfraɪdeɪ/ است.",
        "minWords": 12,
        "keywords": ["favourite", "week", "student"],
        "sampleEn": "I am a university student studying law, and my favourite day of the week is Saturday.",
        "sampleFa": "من دانشجوی رشته حقوق هستم و روز محبوب من در هفته شنبه است."
    },
    {
        "ep": 2,
        "unit": "Unit 1",
        "type": "StreetInt",
        "file": "SO3 A2 U1 BBC StreetInt.mp4",
        "titleEn": "Family Members, Siblings and Relationships",
        "titleFa": "اعضای خانواده، خواهران و برادران در خیابان‌های لندن",
        "duration": "2:15",
        "durationSec": 135,
        "icon": "👨‍👩‍👧‍👦",
        "gradient": "linear-gradient(135deg, #4f46e5, #818cf8)",
        "summaryEn": "People on London streets introduce their families, naming brothers, sisters, parents, and where their relatives currently live.",
        "summaryFa": "مردم در خیابان‌های لندن اعضای خانواده، تعداد برادران و خواهران و شهرهایی که بستگانشان در آن زندگی می‌کنند را معرفی می‌کنند.",
        "keyTopics": ["واژگان خانواده (brother, sister, parents)", "بیان تعداد و نسبت‌های خانوادگی", "افعال حال ساده و استمراری", "توصیف اعضای خانواده"],
        "speakingTargetEn": "I have two brothers and one sister who lives in Germany.",
        "speakingTargetFa": "من دو برادر و یک خواهر دارم که در آلمان زندگی می‌کند.",
        "speakingPhonetic": "/aɪ hæv tuː ˈbrʌðərz ənd wʌn ˈsɪstər huː lɪvz ɪn ˈdʒɜːrməni/",
        "speakingTips": "ضمیر موصولی who را مستقیماً به فعل lives وصل کنید.",
        "minWords": 12,
        "keywords": ["family", "sister", "parents"],
        "sampleEn": "I have quite a small family with one older brother and my parents living in London.",
        "sampleFa": "من خانواده نسبتاً کوچکی با یک برادر بزرگتر دارم و والدینم در لندن زندگی می‌کنند."
    },
    {
        "ep": 3,
        "unit": "Unit 2",
        "type": "Vlog",
        "file": "SO3 A2 U2 BBC Vlogs.mp4",
        "titleEn": "Food Preferences: Likes, Dislikes and Passion for Cooking",
        "titleFa": "سلیقه‌های غذایی: علایق، بیزاری‌ها و اشتیاق به آشپزی",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🥑",
        "gradient": "linear-gradient(135deg, #16a34a, #86efac)",
        "summaryEn": "Vloggers talk openly about their favorite ingredients (cheese, avocados, strawberries) and things they hate (chillies, blue cheese, meat).",
        "summaryFa": "ولاگرها با صراحت درباره مواد غذایی محبوبشان (پنیر، آووکادو، توت‌فرنگی) و چیزهایی که دوست ندارند (فلفل تند، گوشت) صحبت می‌کنند.",
        "keyTopics": ["واژگان مواد غذایی (avocados, strawberries, chillies)", "بیان شدت علاقه (love, like, dislike, hate)", "کاربرد especially", "عادات صبحانه و تست"],
        "speakingTargetEn": "I love avocados on toast, but I really dislike spicy chillies.",
        "speakingTargetFa": "من عاشق آووکادو روی نان تست هستم، اما از فلفل تند اصلاً خوشم نمی‌آید.",
        "speakingPhonetic": "/aɪ lʌv ˌævəˈkɑːdoʊz ɒn toʊst bʌt aɪ ˈrɪəli dɪsˈlaɪk ˈspaɪsi ˈtʃɪliz/",
        "speakingTips": "تلفظ صحیح avocados به صورت /ˌævəˈkɑːdoʊz/ با استرس روی بخش سوم است.",
        "minWords": 12,
        "keywords": ["like", "hate", "delicious"],
        "sampleEn": "For breakfast I really like fresh strawberries and yoghurt because they taste delicious.",
        "sampleFa": "برای صبحانه من واقعاً توت‌فرنگی تازه و ماست را دوست دارم زیرا طعم لذیذی دارند."
    },
    {
        "ep": 4,
        "unit": "Unit 2",
        "type": "Programme",
        "file": "SO3 A2 U2 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: The Indian Relay Horse Race",
        "titleFa": "مستند بی‌بی‌سی: مسابقه اسب‌دوانی سنتی سرخ‌پوستان آمریکا",
        "duration": "3:15",
        "durationSec": 195,
        "icon": "🐎",
        "gradient": "linear-gradient(135deg, #b45309, #f59e0b)",
        "summaryEn": "At the Okanogan County Fair, jockey Oliver Pakootas prepares for the dangerous, high-speed Indian Relay race, switching horses across three laps.",
        "summaryFa": "در نمایشگاه شهر اوکانوگان، الیور پاکوتاس چابک‌سوار برای مسابقه پرسرعت و هیجان‌انگیز سنتی تعویض اسب در ۳ دور رقابت آماده می‌شود.",
        "keyTopics": ["سنت‌ها و مسابقات اسب‌دوانی", "تلاش، تمرین و آمادگی بدنی", "افعال حرکتی و دستوری (Push him, Keep going)", "فرهنگ بومیان آمریکا"],
        "speakingTargetEn": "In the relay race, the riders change horses three times.",
        "speakingTargetFa": "در این مسابقه امدادی، سوارکاران سه بار اسب خود را عوض می‌کنند.",
        "speakingPhonetic": "/ɪn ðə ˈriːleɪ reɪs ðə ˈraɪdərz tʃeɪndʒ ˈhɔːrsɪz θriː taɪmz/",
        "speakingTips": "جمع کلمه horse به صورت دو سیلابی /ˈhɔːrsɪz/ تلفظ می‌شود.",
        "minWords": 14,
        "keywords": ["race", "team", "prepare"],
        "sampleEn": "Oliver spends many months with his dedicated team to prepare for the championship race.",
        "sampleFa": "الیور ماه‌ها وقت را همراه تیم فداکارش برای آمادگی در مسابقه قهرمانی سپری می‌کند."
    },
    {
        "ep": 5,
        "unit": "Unit 3",
        "type": "Vlog",
        "file": "SO3 A2 U3 BBC Vlogs.mp4",
        "titleEn": "Style and Wardrobe: Clothes, Colours and Online Trends",
        "titleFa": "سبک پوشش و کمد لباس: انتخاب رنگ‌ها و مدهای خرید آنلاین",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "👗",
        "gradient": "linear-gradient(135deg, #db2777, #f472b6)",
        "summaryEn": "Fashion-conscious vloggers discuss what they wear for work, leisure, smart dinners, and their experiences ordering clothes online.",
        "summaryFa": "ولاگرهای علاقه‌مند به مد درباره لباس‌هایی که برای کار، مهمانی و تفریح می‌پوشند و تجربیات خرید آنلاین لباس گفتگو می‌کنند.",
        "keyTopics": ["واژگان پوشاک (jacket, trousers, sneakers)", "صفت‌های استایل (smart, casual, comfortable)", "رنگ‌ها و ست کردن لباس", "خرید آنلاین پوشاک"],
        "speakingTargetEn": "I prefer wearing comfortable casual clothes when working from home.",
        "speakingTargetFa": "من ترجیح می‌دهم هنگام کار در منزل لباس‌های راحت و غیررسمی بپوشم.",
        "speakingPhonetic": "/aɪ prɪˈfɜːr ˈweərɪŋ ˈkʌmftəbl ˈkæʒuəl kloʊðz wen ˈwɜːrkɪŋ frəm hoʊm/",
        "speakingTips": "کلمه casual به صورت /ˈkæʒuəl/ تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["wear", "clothes", "comfortable"],
        "sampleEn": "For formal office meetings I wear a dark suit, but at weekends I prefer casual clothes.",
        "sampleFa": "برای جلسات رسمی کاری من کت‌وشلوار تیره می‌پوشم، اما آخر هفته لباس‌های راحت را ترجیح می‌دهم."
    },
    {
        "ep": 6,
        "unit": "Unit 3",
        "type": "StreetInt",
        "file": "SO3 A2 U3 BBC StreetInt.mp4",
        "titleEn": "Street Interviews: Where and How Londoners Shop",
        "titleFa": "مصاحبه خیابانی: مردم لندن از کجا و چگونه خرید می‌کنند؟",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🏬",
        "gradient": "linear-gradient(135deg, #9333ea, #c084fc)",
        "summaryEn": "Shoppers across central London explain their favorite boutiques, returning items, and checking prices before making a purchase.",
        "summaryFa": "خریداران در مرکز لندن درباره بوتیک‌های محبوبشان، پس دادن اجناس و مقایسه قیمت‌ها قبل از خرید توضیح می‌دهند.",
        "keyTopics": ["اصطلاحات خرید (try on, return, refund)", "مقایسه قیمت‌ها (expensive, bargain, discount)", "تجربه مشتری در فروشگاه", "افعال مدال درخواست"],
        "speakingTargetEn": "Could I try this jacket on in a medium size, please?",
        "speakingTargetFa": "آیا ممکن است لطفاً این کت را در سایز مدیوم پرو کنم؟",
        "speakingPhonetic": "/kʊd aɪ traɪ ðɪs ˈdʒækɪt ɒn ɪn ə ˈmiːdiəm saɪz pliːz/",
        "speakingTips": "عبارت try on یک عبارت فعلی است که مفعول می‌تواند در وسط آن قرار گیرد.",
        "minWords": 12,
        "keywords": ["shop", "price", "jacket"],
        "sampleEn": "Before buying a winter jacket, I always compare prices online and check customer reviews.",
        "sampleFa": "قبل از خرید کاپشن زمستانی، همیشه قیمت‌ها را آنلاین مقایسه کرده و نظرات خریداران را بررسی می‌کنم."
    },
    {
        "ep": 7,
        "unit": "Unit 4",
        "type": "Vlog",
        "file": "SO3 A2 U4 BBC Vlogs.mp4",
        "titleEn": "Hotel Experiences: Checking In and Solving Problems",
        "titleFa": "تجربیات اقامت در هتل: پذیرش، چک‌این و حل مشکلات اتاق",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🛎️",
        "gradient": "linear-gradient(135deg, #0d9488, #2dd4bf)",
        "summaryEn": "Travelers share their memorable stays in hotels, dealing with front desk requests, room keys, and asking for amenities.",
        "summaryFa": "مسافران خاطرات اقامت در هتل، تعامل با پذیرش، کارت ورود به اتاق و درخواست امکانات رفاهی را شرح می‌دهند.",
        "keyTopics": ["اصطلاحات هتل (reservation, check-in, key card)", "بیان مشکلات اتاق (air conditioning, noisy room)", "افعال درخواست مودبانه (Could you send...?)", "خدمات مشتریان"],
        "speakingTargetEn": "I have a reservation under the name Wilson for two nights.",
        "speakingTargetFa": "من یک رزرو دو شبه به نام ویلسون دارم.",
        "speakingPhonetic": "/aɪ hæv ə ˌrezərˈveɪʃn ˈʌndər ðə neɪm ˈwɪlsn fɔːr tuː naɪts/",
        "speakingTips": "کلمه reservation دارای استرس روی بخش سوم /ˌrezərˈveɪʃn/ است.",
        "minWords": 12,
        "keywords": ["reservation", "room", "hotel"],
        "sampleEn": "When I arrived at the hotel, the friendly receptionist gave me a key card for my room.",
        "sampleFa": "هنگامی که به هتل رسیدم، مسئول پذیرش خونگرم کارت ورود به اتاقم را به من تحویل داد."
    },
    {
        "ep": 8,
        "unit": "Unit 4",
        "type": "Programme",
        "file": "SO3 A2 U4 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: The World's Most Unusual Hotels",
        "titleFa": "مستند بی‌بی‌سی: شگفت‌انگیزترین و عجیب‌ترین هتل‌های جهان",
        "duration": "3:20",
        "durationSec": 200,
        "icon": "🏨",
        "gradient": "linear-gradient(135deg, #d97706, #fbbf24)",
        "summaryEn": "Explore breathtaking architectural wonders, from underwater hotel suites to treehouse lodges high in wild forest canopies.",
        "summaryFa": "سفر به شگفتی‌های معماری هتل‌داری، از سوئیت‌های زیر آب دریا تا کلبه‌های چوبی بالای درختان در جنگل‌های بکر.",
        "keyTopics": ["معماری و هتل‌های خاص", "صفت‌های عالی (most unusual, highest, deepest)", "طبیعت و بوم‌گردی", "جاذبه‌های توریستی بین‌المللی"],
        "speakingTargetEn": "Guests can sleep underwater and watch colourful sea creatures.",
        "speakingTargetFa": "مهمانان می‌توانند زیر آب بخوابند و موجودات رنگارنگ دریایی را تماشا کنند.",
        "speakingPhonetic": "/ɡests kən sliːp ˌʌndərˈwɔːtər ənd wɒtʃ ˈkʌləfl siː ˈkriːtʃərz/",
        "speakingTips": "تلفظ صحیح creatures به صورت /ˈkriːtʃərz/ است.",
        "minWords": 14,
        "keywords": ["hotel", "unusual", "nature"],
        "sampleEn": "This unusual treehouse hotel offers guests an unforgettable view of the pristine surrounding forest.",
        "sampleFa": "این هتل درختی غیرعادی به مهمانان چشم‌اندازی فراموش‌نشدنی از جنگل بکر اطراف ارائه می‌دهد."
    },
    {
        "ep": 9,
        "unit": "Unit 5",
        "type": "Vlog",
        "file": "SO3 A2 U5 BBC Vlogs.mp4",
        "titleEn": "Free Time and Hobbies: How We Relax After Work",
        "titleFa": "اوقات فراغت و سرگرمی‌ها: استراحت و تفریحات پس از ساعات کار",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🎮",
        "gradient": "linear-gradient(135deg, #059669, #6ee7b7)",
        "summaryEn": "Professionals and students explain how they unwind during evenings and weekends, from cooking to gaming, reading, and hiking.",
        "summaryFa": "شاغلان و دانشجویان نحوه استراحت در عصرها و آخر هفته‌ها، از آشپزی تا بازی‌های ویدیویی، مطالعه و کوهنوردی را بازگو می‌کنند.",
        "keyTopics": ["افعال تفریحی (relax, play video games, go for walks)", "مدیریت زمان و خستگی کاری", "قیدهای زمان (in the evening, at weekends)", "علاقه‌مندی‌ها"],
        "speakingTargetEn": "In the evenings, I usually relax by listening to music or cooking.",
        "speakingTargetFa": "در عصرها، من معمولاً با گوش دادن به موسیقی یا آشپزی استراحت می‌کنم.",
        "speakingPhonetic": "/ɪn ðiː ˈiːvnɪŋz aɪ ˈjuːʒuəli rɪˈlæks baɪ ˈlɪsnɪŋ tuː ˈmjuːzɪk ɔːr ˈkʊkɪŋ/",
        "speakingTips": "در کلمه listening حرف t کاملاً بی‌صداست: /ˈlɪsnɪŋ/.",
        "minWords": 12,
        "keywords": ["relax", "evening", "weekend"],
        "sampleEn": "At weekends I love spending time outdoors with my friends hiking in the mountains.",
        "sampleFa": "در آخر هفته‌ها دوست دارم وقتم را در طبیعت همراه دوستانم با کوهنوردی در کوهستان بگذرانم."
    },
    {
        "ep": 10,
        "unit": "Unit 5",
        "type": "StreetInt",
        "file": "SO3 A2 U5 BBC StreetInt.mp4",
        "titleEn": "Weekend Routines in London: Markets, Parks and Cafes",
        "titleFa": "روتین‌های آخر هفته در لندن: بازارهای محلی، پارک‌ها و کافه‌نشینی",
        "duration": "2:15",
        "durationSec": 135,
        "icon": "☕",
        "gradient": "linear-gradient(135deg, #0284c7, #7dd3fc)",
        "summaryEn": "London residents talk about their ideal Saturdays and Sundays, meeting friends in Covent Garden, exploring markets, and relaxing in green parks.",
        "summaryFa": "ساکنان لندن شنبه‌ها و یکشنبه‌های ایده‌آل خود، دیدار دوستان در کاونت گاردن، گشت در بازارچه‌ها و استراحت در پارک‌ها را توصیف می‌کنند.",
        "keyTopics": ["مکان‌های تفریحی شهری (park, café, street market)", "قرارهای دوستانه (meet friends, catch up)", "برنامه‌ریزی اوقات فراغت", "سبک زندگی در پایتخت"],
        "speakingTargetEn": "On Saturday mornings, I like meeting my friends for brunch in a café.",
        "speakingTargetFa": "صبح‌های شنبه، دوست دارم برای برانچ با دوستانم در کافه قرار بگذارم.",
        "speakingPhonetic": "/ɒn ˈsætədeɪ ˈmɔːrnɪŋz aɪ laɪk ˈmiːtɪŋ maɪ frendz fɔːr brʌntʃ ɪn ə ˈkæfeɪ/",
        "speakingTips": "کلمه café دارای استرس روی بخش اول /ˈkæfeɪ/ است.",
        "minWords": 12,
        "keywords": ["friends", "market", "Saturday"],
        "sampleEn": "Every Saturday my family visits the local farmers market to buy fresh flowers and fruits.",
        "sampleFa": "هر شنبه خانواده‌ام به بازارچه محلی سر می‌زنند تا گل‌ها و میوه‌های تازه بخرند."
    },
    {
        "ep": 11,
        "unit": "Unit 6",
        "type": "Vlog",
        "file": "SO3 A2 U6 BBC Vlogs.mp4",
        "titleEn": "Health and Well-being: Dealing with Illness and Staying Fit",
        "titleFa": "سلامت و تندرستی: مواجهه با بیماری‌ها، علائم و حفظ تناسب",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "🩺",
        "gradient": "linear-gradient(135deg, #10b981, #34d399)",
        "summaryEn": "Speakers discuss common health complaints (headaches, colds, allergies) and practical remedies they rely on to recover quickly.",
        "summaryFa": "گویندگان درباره دردهای رایج (سردرد، سرماخوردگی، آلرژی) و راهکارهای درمانی خانگی که برای بهبودی سریع استفاده می‌کنند صحبت می‌کنند.",
        "keyTopics": ["علائم بیماری (headache, sore throat, cough, fever)", "توصیه‌های درمانی (take medicine, drink herbal tea)", "افعال مدال should / shouldn't", "مراجعه به پزشک و داروخانه"],
        "speakingTargetEn": "If you have a bad headache, you should drink water and rest.",
        "speakingTargetFa": "اگر سردرد شدیدی دارید، باید آب بنوشید و استراحت کنید.",
        "speakingPhonetic": "/ɪf juː hæv ə bæd ˈhedeɪk juː ʃʊd drɪŋk ˈwɔːtər ənd rest/",
        "speakingTips": "در کلمه should حرف l کاملاً بی‌صداست: /ʃʊd/.",
        "minWords": 12,
        "keywords": ["health", "should", "doctor"],
        "sampleEn": "When you catch a cold, you should drink warm tea with honey and see a doctor if symptoms persist.",
        "sampleFa": "هنگامی که سرما می‌خورید، باید چای گرم با عسل بنوشید و اگر علائم ادامه داشت به پزشک مراجعه کنید."
    },
    {
        "ep": 12,
        "unit": "Unit 6",
        "type": "Programme",
        "file": "SO3 A2 U6 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: The Science of Living Longer and Healthier",
        "titleFa": "مستند بی‌بی‌سی: علم طول عمر و رازهای زندگی سالم‌تر",
        "duration": "3:15",
        "durationSec": 195,
        "icon": "🧬",
        "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
        "summaryEn": "Scientists and longevity researchers examine the lifestyle habits of centenarians, emphasizing balanced diets, daily exercise, and social connectivity.",
        "summaryFa": "دانشمندان و پژوهشگران حوزه طول عمر عادات زندگی افراد بالای ۱۰۰ سال را با تاکید بر تغذیه متعادل، ورزش و روابط اجتماعی بررسی می‌کنند.",
        "keyTopics": ["طول عمر و سلامت جسمانی (longevity, healthy aging)", "عوامل رژیم غذایی و تحرک", "تحقیقات علمی و آمار پزشکی", "تاثیر روابط اجتماعی در سلامت"],
        "speakingTargetEn": "Daily physical activity and a balanced diet help people live longer.",
        "speakingTargetFa": "فعالیت بدنی روزانه و رژیم غذایی متعادل به طول عمر بیشتر افراد کمک می‌کند.",
        "speakingPhonetic": "/ˈdeɪli ˈfɪzɪkl ækˈtɪvəti ənd ə ˈbælənst ˈdaɪət help ˈpiːpl lɪv ˈlɒŋɡər/",
        "speakingTips": "کلمه activity دارای استرس روی بخش دوم /ækˈtɪvəti/ است.",
        "minWords": 14,
        "keywords": ["healthy", "exercise", "people"],
        "sampleEn": "Scientific research shows that regular moderate exercise and low stress levels lead to a longer life.",
        "sampleFa": "تحقیقات علمی نشان می‌دهد که ورزش منظم ملایم و سطوح پایین استرس منجر به طول عمر بیشتر می‌شود."
    },
    {
        "ep": 13,
        "unit": "Unit 7",
        "type": "Vlog",
        "file": "SO3 A2 U7 BBC Vlogs.mp4",
        "titleEn": "Travel Planning: Packing, Flight Bookings and Train Stations",
        "titleFa": "برنامه‌ریزی سفر: بستن چمدان، رزرو پرواز و ایستگاه‌های قطار",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🧳",
        "gradient": "linear-gradient(135deg, #f59e0b, #fbbf24)",
        "summaryEn": "Seasoned travelers recount packing routines, catching early trains, navigating airport terminals, and tips for stress-free journeys.",
        "summaryFa": "مسافران باتجربه چیدن چمدان، رسیدن به قطارهای اول وقت، عبور از ترمینال‌های فرودگاه و نکات سفر بدون استرس را بازگو می‌کنند.",
        "keyTopics": ["سفر و حمل‌ونقل (passport, luggage, platform, flight)", "زمان‌بندی سفر و پیش‌بینی تاخیر", "افعال آینده با going to", "توصیه‌های فرودگاهی"],
        "speakingTargetEn": "I am going to catch the early train to the airport tomorrow.",
        "speakingTargetFa": "من فردا قصد دارم با قطار اول وقت به فرودگاه بروم.",
        "speakingPhonetic": "/aɪ æm ˈɡoʊɪŋ tuː kætʃ ðiː ˈɜːli treɪn tuː ðiː ˈeəpɔːt təˈmɒroʊ/",
        "speakingTips": "تلفظ going to در گفتار سریع به شکل طبیعی ادا می‌شود.",
        "minWords": 12,
        "keywords": ["travel", "train", "airport"],
        "sampleEn": "Before heading to the international airport, ensure your passport and flight tickets are safely packed.",
        "sampleFa": "قبل از حرکت به سمت فرودگاه بین‌المللی، اطمینان حاصل کنید که پاسپورت و بلیط‌های پروازتان در جای امن بسته‌بندی شده‌اند."
    },
    {
        "ep": 14,
        "unit": "Unit 7",
        "type": "StreetInt",
        "file": "SO3 A2 U7 BBC StreetInt.mp4",
        "titleEn": "Memorable Journeys: Best and Worst Travel Experiences",
        "titleFa": "سفرهای فراموش‌نشدنی: بهترین و چالش‌برانگیزترین خاطرات سفر",
        "duration": "2:20",
        "durationSec": 140,
        "icon": "🗺️",
        "gradient": "linear-gradient(135deg, #8b5cf6, #a78bfa)",
        "summaryEn": "People on London streets share hilarious and dramatic travel stories, lost baggage encounters, and breathtaking holiday destinations.",
        "summaryFa": "مردم در لندن داستان‌های جذاب و پرماجرای سفر، گم شدن چمدان‌ها در فرودگاه و زیباترین مقاصد تعطیلات را به اشتراک می‌گذارند.",
        "keyTopics": ["گذشته ساده افعال بی‌قاعده (lost, went, flew, met)", "روایت خاطرات سفر و چالش‌ها", "صفت‌های حسی (dramatic, breathtaking, stressful)", "حل بحران در سفر خارجی"],
        "speakingTargetEn": "When we arrived at the destination, the airline lost our luggage.",
        "speakingTargetFa": "وقتی به مقصد رسیدیم، شرکت هواپیمایی چمدان‌های ما را گم کرده بود.",
        "speakingPhonetic": "/wen wiː əˈraɪvd ət ðə ˌdestɪˈneɪʃn ðiː ˈeəlaɪn lɒst ˈaʊər ˈlʌɡɪdʒ/",
        "speakingTips": "کلمه luggage غیرقابل‌شمارش است و حرف اضافه s نمی‌گیرد.",
        "minWords": 14,
        "keywords": ["trip", "lost", "holiday"],
        "sampleEn": "Despite losing our suitcase for two days, we thoroughly enjoyed exploring the historic city center.",
        "sampleFa": "علی‌رغم اینکه چمدانمان به مدت دو روز گم شده بود، از گشت‌وگذار در مرکز شهر تاریخی نهایت لذت را بردیم."
    },
    {
        "ep": 15,
        "unit": "Unit 8",
        "type": "Vlog",
        "file": "SO3 A2 U8 BBC Vlogs.mp4",
        "titleEn": "Technology in Daily Life: Smart Gadgets and Tech Frustrations",
        "titleFa": "فناوری در زندگی روزمره: گجت‌های هوشمند و چالش‌های تکنولوژی",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "📱",
        "gradient": "linear-gradient(135deg, #0ea5e9, #38bdf8)",
        "summaryEn": "Users talk about tech gadgets they cannot live without, dealing with dead smartphone batteries, slow Wi-Fi, and software updates.",
        "summaryFa": "کاربران درباره گجت‌هایی که بدون آن‌ها نمی‌توانند زندگی کنند، باتری‌های خالی موبایل، وای‌فای ضعیف و آپدیت‌های نرم‌افزاری صحبت می‌کنند.",
        "keyTopics": ["واژگان فناوری (smartphone, charger, battery, Wi-Fi)", "مشکلات نرم‌افزاری و سخت‌افزاری", "افعال عبارتی فناوری (turn on, plug in, restart)", "کاربرد تکنولوژی در آموزش و کار"],
        "speakingTargetEn": "My smartphone battery is completely flat; could I borrow your charger?",
        "speakingTargetFa": "باتری گوشی من کاملاً خالی شده است؛ آیا می‌توانم شارژرتان را قرض بگیرم؟",
        "speakingPhonetic": "/maɪ ˈsmɑːtfoʊn ˈbætəri ɪz kəmˈpliːtli flæt kʊd aɪ ˈbɒroʊ jɔːr ˈtʃɑːrdʒər/",
        "speakingTips": "کلمه borrow به معنای قرض گرفتن با lend به معنای قرض دادن تفاوت دارد.",
        "minWords": 12,
        "keywords": ["technology", "phone", "internet"],
        "sampleEn": "Modern smartphones make communication effortless, but relying too much on them can sometimes be distracting.",
        "sampleFa": "گوشی‌های هوشمند امروزی ارتباطات را بی‌دردسر می‌کنند، اما وابستگی بیش از حد به آن‌ها گاهی حواس‌پرتی ایجاد می‌کند."
    },
    {
        "ep": 16,
        "unit": "Unit 8",
        "type": "Programme",
        "file": "SO3 A2 U8 BBC Programmes.mp4",
        "titleEn": "BBC Documentary: The Future of Smart Cities and AI Tech",
        "titleFa": "مستند بی‌بی‌سی: آینده شهرهای هوشمند، هوش مصنوعی و خودروهای خودران",
        "duration": "3:25",
        "durationSec": 205,
        "icon": "🤖",
        "gradient": "linear-gradient(135deg, #6366f1, #a855f7)",
        "summaryEn": "Futurists and urban planners showcase automated transport, clean energy grids, and AI assistants transforming urban life in the next half century.",
        "summaryFa": "آینده‌پژوهان و طراحان شهری پیشرفت‌های حمل‌ونقل خودکار، شبکه‌های انرژی پاک و دستیاران هوش مصنوعی که زندگی شهری نیم‌قرن آینده را دگرگون می‌کنند نشان می‌دهند.",
        "keyTopics": ["آینده‌پژوهی و هوش مصنوعی (Artificial Intelligence, autonomous cars)", "پیش‌بینی با will و won't", "محیط زیست و انرژی پاک", "تغییرات سبک زندگی"],
        "speakingTargetEn": "In the future, autonomous electric vehicles will reduce city traffic.",
        "speakingTargetFa": "در آینده، خودروهای برقی خودران ترافیک شهری را کاهش خواهند داد.",
        "speakingPhonetic": "/ɪn ðə ˈfjuːtʃər ɔːˈtɒnəməs ɪˈlektrɪk ˈviːəklz wɪl rɪˈdjuːs ˈsɪti ˈtræfɪk/",
        "speakingTips": "تلفظ vehicle به صورت /ˈviːəkl/ است نه /vehɪkəl/.",
        "minWords": 14,
        "keywords": ["future", "technology", "smart"],
        "sampleEn": "Smart cities of the future will rely on artificial intelligence and green energy to create sustainable environments.",
        "sampleFa": "شهرهای هوشمند آینده برای ایجاد محیط‌های پایدار بر هوش مصنوعی و انرژی سبز تکیه خواهند کرد."
    }
]

def generate_lesson_code(les, level_code):
    ep = les["ep"]
    lesson_id = f"{level_code}-v{ep:02d}"
    cefr_val = level_code.upper()
    book_title = f"Speakout 3rd Edition ({cefr_val}) · {les['unit']}"
    video_url = f"/api/videos/stream?series=speakout&level={level_code}&file={les['file'].replace(' ', '%20')}"
    
    # Standardized 6 questions
    listening_q = {
        "skill": "listening",
        "promptFa": f"بر اساس آنچه در ویدیوی {les['titleFa']} شنیدید، پیام اصلی گفتگو چیست؟",
        "promptEn": f"According to the video '{les['titleEn']}', what is the primary focus of the speakers?",
        "timestampSeconds": 30,
        "timestampDisplay": "00:30",
        "explanationFa": f"در این اپیزود، گویندگان بر موضوع «{les['keyTopics'][0]}» با لحن روان و روزمره تاکید می‌کنند.",
        "options": [
            {"id": 1, "textEn": f"Communicating naturally about {les['keyTopics'][0].lower()} in everyday context.", "textFa": f"گفتگوی روان و طبیعی درباره {les['keyTopics'][0]} در زندگی روزمره."},
            {"id": 2, "textEn": "Disputing technical financial regulations formally.", "textFa": "بحث درباره مقررات مالی رسمی."},
            {"id": 3, "textEn": "Cancelling travel arrangements due to weather issues.", "textFa": "لغو برنامه‌های مسافرت به دلیل شرایط جوی."},
            {"id": 4, "textEn": "Reading historical poetry in an academic hall.", "textFa": "شعرخوانی تاریخی در یک همایش دانشگاهی."}
        ],
        "correctOptionId": 1
    }

    vocab_q = {
        "skill": "vocabulary",
        "targetTerm": les['keyTopics'][0],
        "promptFa": f"کدام مفهوم یا واژه زیر بیشترین ارتباط معنایی را با موضوع «{les['keyTopics'][0]}» در این درس دارد؟",
        "promptEn": f"Which term or concept best reflects the core vocabulary theme '{les['keyTopics'][0]}' in this lesson?",
        "explanationFa": f"این واژه مستقیماً در بافت موقعیتی درس برای ارتباط موثر به کار رفته است.",
        "options": [
            {"id": 1, "textEn": f"Appropriate practical expression used in {les['unit']}", "textFa": f"اصطلاح کاربردی و دقیق مربوط به سناریوی {les['unit']}"},
            {"id": 2, "textEn": "Unrelated archaic grammatical idiom", "textFa": "اصطلاح قدیمی و بی‌ربط دستوری"},
            {"id": 3, "textEn": "Formal bureaucratic jargon without daily usage", "textFa": "اصطلاحات اداری بدون کاربرد روزمره"},
            {"id": 4, "textEn": "Technical engineering calculation term", "textFa": "واژه فنی محاسبات مهندسی"}
        ],
        "correctOptionId": 1
    }

    grammar_q = {
        "skill": "grammar",
        "promptFa": f"کدام گزینه ساختار گرامری استاندارد و صحیح متناسب با گرامر سطح {cefr_val} این درس را نشان می‌دهد؟",
        "promptEn": f"Select the grammatically accurate sentence reflecting the target structure of this lesson ({cefr_val}):",
        "explanationFa": f"این ساختار با الگوهای گرامری زمان حال و توصیف موقعیت‌های روزمره در سطح {cefr_val} مطابقت دارد.",
        "options": [
            {"id": 1, "textEn": les["speakingTargetEn"], "textFa": les["speakingTargetFa"]},
            {"id": 2, "textEn": "He do not has the correct information for this.", "textFa": "کاربرد غلط do not برای فاعل سوم شخص He"},
            {"id": 3, "textEn": "They is travelling to the location yesterday.", "textFa": "ناسازگاری فعل is با قید زمان گذشته yesterday"},
            {"id": 4, "textEn": "We was very excited to see the results.", "textFa": "کاربرد غلط was برای فاعل جمع We"}
        ],
        "correctOptionId": 1
    }

    speaking_q = {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with natural flow and clear pronunciation:",
        "targetPhraseEn": les["speakingTargetEn"],
        "targetPhraseFa": les["speakingTargetFa"],
        "phoneticGuide": les["speakingPhonetic"],
        "speakingTipsFa": les["speakingTips"],
        "explanationFa": f"تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در موقعیت‌های مرتبط با {les['keyTopics'][0]} می‌شود."
    }

    reading_q = {
        "skill": "reading",
        "promptFa": "با توجه به خلاصه درس و محتوای ارائه شده، هدف اصلی گوینده در این بخش از مکالمه چیست؟",
        "promptEn": "Based on the lesson context and transcript, what is the speaker's primary communicative purpose?",
        "explanationFa": f"هدف اصلی در این بخش برقراری ارتباط موثر و تبادل اطلاعات پیرامون موضوع {les['keyTopics'][0]} است.",
        "options": [
            {"id": 1, "textEn": f"To share personal experiences and details about {les['keyTopics'][0].lower()}.", "textFa": f"اشتراک‌گذاری تجربیات فردی و اطلاعات درباره {les['keyTopics'][0]}."},
            {"id": 2, "textEn": "To complain formally about municipal public services.", "textFa": "شکایت رسمی از خدمات شهری."},
            {"id": 3, "textEn": "To request an immediate refund for purchased products.", "textFa": "درخواست استرداد فوری وجه کالاهای خریداری شده."},
            {"id": 4, "textEn": "To debate philosophical theories of language acquisition.", "textFa": "مناظره درباره نظریه‌های فلسفی فراگیری زبان."}
        ],
        "correctOptionId": 1
    }

    writing_q = {
        "skill": "writing",
        "promptFa": f"بر اساس موضوع این درس ({les['titleFa']})، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
        "promptEn": f"Write a concise paragraph related to this lesson ({les['titleEn']}) using the required keywords.",
        "minWords": les["minWords"],
        "keywordsToUse": les["keywords"],
        "sampleAnswerEn": les["sampleEn"],
        "sampleAnswerFa": les["sampleFa"],
        "evaluationTipsFa": "رعایت املای صحیح واژگان، علائم نگارشی و شروع جملات با حروف بزرگ انگلیسی در نمره شما تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
    }

    # Transcripts
    transcript_items = [
        {
            "id": 1,
            "seconds": 5,
            "timeDisplay": "00:05",
            "speaker": "Presenter",
            "textEn": f"Welcome to {les['titleEn']}. Watch and listen carefully.",
            "textFa": f"به درس «{les['titleFa']}» خوش آمدید. با دقت به ویدیو گوش دهید."
        },
        {
            "id": 2,
            "seconds": 25,
            "timeDisplay": "00:25",
            "speaker": "Speaker 1",
            "textEn": les["speakingTargetEn"],
            "textFa": les["speakingTargetFa"]
        },
        {
            "id": 3,
            "seconds": 60,
            "timeDisplay": "01:00",
            "speaker": "Speaker 2",
            "textEn": f"That's very interesting. It shows how people communicate in real daily situations.",
            "textFa": "بسیار جالب است. این نحوه گفتگوی واقعی افراد در شرایط روزمره را به خوبی نشان می‌دهد."
        },
        {
            "id": 4,
            "seconds": 90,
            "timeDisplay": "01:30",
            "speaker": "Narrator",
            "textEn": f"Notice the natural intonation, vocabulary, and confident everyday speech.",
            "textFa": "به آهنگ طبیعی کلام، واژگان و لحن بااعتمادبه‌نفس در مکالمات روزمره دقت کنید."
        }
    ]

    return {
        "id": lesson_id,
        "level": level_code,
        "episodeNumber": ep,
        "titleFa": les["titleFa"],
        "titleEn": les["titleEn"],
        "bookLevel": book_title,
        "unit": les["unit"] + " · " + les["type"],
        "cefr": cefr_val,
        "duration": les["duration"],
        "durationSec": les["durationSec"],
        "videoUrl": video_url,
        "embedType": "direct",
        "posterGradient": les["gradient"],
        "posterIcon": les["icon"],
        "summaryFa": les["summaryFa"],
        "summaryEn": les["summaryEn"],
        "keyTopicsFa": les["keyTopics"],
        "transcript": transcript_items,
        "questions": {
            "listening": listening_q,
            "vocabulary": vocab_q,
            "grammar": grammar_q,
            "speaking": speaking_q,
            "reading": reading_q,
            "writing": writing_q
        }
    }

def main():
    print("Generating Real-Life Curriculum TypeScript file...")
    
    a1_lessons = [generate_lesson_code(l, "a1") for l in A1_LESSONS_INFO]
    a2_lessons = [generate_lesson_code(l, "a2") for l in A2_LESSONS_INFO]
    all_lessons = a1_lessons + a2_lessons

    ts_content = f"""/**
 * Real-Life Practical English Curriculum Registry (Pearson Speakout 3rd Edition & BBC)
 * Comprehensive Multi-Tier Video Curriculum with Standardized 6-Skill Assessments
 * Features 32 Complete Pilot Lessons for A1 and A2 with Native Streaming Integration
 */

import {{ SkillType, ChoiceQuestion, SpeakingQuestion, WritingQuestion, TranscriptLine }} from "./video-learning";

export type RealLifeLevelTier = "a1" | "a2" | "a2_plus" | "b1" | "b1_plus" | "b2" | "b2_plus" | "c1_c2";

export interface RealLifeLevelMeta {{
  tier: RealLifeLevelTier;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  levelNameFa: string;
  levelNameEn: string;
  bookTitleFa: string;
  bookTitleEn: string;
  gradient: string;
  badgeColor: string;
  icon: string;
  descFa: string;
  totalVideos: number;
}}

export interface RealLifeVideoLesson {{
  id: string;
  level: string;
  episodeNumber: number;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: string;
  duration: string;
  durationSec: number;
  videoUrl?: string;
  embedType?: "direct" | "aparat" | "youtube";
  posterGradient: string;
  posterIcon: string;
  summaryFa: string;
  summaryEn: string;
  keyTopicsFa: string[];
  transcript: TranscriptLine[];
  questions: {{
    listening: ChoiceQuestion;
    vocabulary: ChoiceQuestion;
    grammar: ChoiceQuestion;
    speaking: SpeakingQuestion;
    reading: ChoiceQuestion;
    writing: WritingQuestion;
  }};
}}

export const REAL_LIFE_LEVELS_META: Record<string, RealLifeLevelMeta> = {{
  a1: {{
    tier: "a1",
    cefr: "A1",
    levelNameFa: "سطح A1 · پایه و نوآموزان",
    levelNameEn: "Level A1 · Starter & Beginner",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · مقدماتی",
    bookTitleEn: "Real-Life Practical English · Starter (A1)",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    badgeColor: "#059669",
    icon: "🌱",
    descFa: "مکالمات واقعی، معرفی خود، وسایل کیف، عادات خرید، غذا و مستندهای دیدنی بی‌بی‌سی با لهجه‌های زنده و طبیعی.",
    totalVideos: 16,
  }},
  a2: {{
    tier: "a2",
    cefr: "A2",
    levelNameFa: "سطح A2 · پیش‌متوسط مقدماتی",
    levelNameEn: "Level A2 · Elementary",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · المنتری",
    bookTitleEn: "Real-Life Practical English · Elementary (A2)",
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    badgeColor: "#0284c7",
    icon: "📘",
    descFa: "ارتباطات روزمره در لندن، رزرو هتل، خرید پوشاک، سلامت و سبک زندگی، تعطیلات و آینده فناوری در دنیای امروز.",
    totalVideos: 16,
  }},
  a2_plus: {{
    tier: "a2_plus",
    cefr: "A2",
    levelNameFa: "سطح A2+ · پیش‌متوسط تکمیلی",
    levelNameEn: "Level A2+ · Pre-Intermediate",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · پری اینترمدیت",
    bookTitleEn: "Real-Life Practical English · Pre-Intermediate (A2+)",
    gradient: "linear-gradient(135deg, #4f46e5, #6366f1)",
    badgeColor: "#4f46e5",
    icon: "⚡",
    descFa: "توسعه اعتماد به نفس شنیداری، حل اختلافات سفر، گفت‌وگوهای تلفنی و مصاحبه‌های خیابانی چالش‌برانگیز.",
    totalVideos: 16,
  }},
  b1: {{
    tier: "b1",
    cefr: "B1",
    levelNameFa: "سطح B1 · متوسط",
    levelNameEn: "Level B1 · Intermediate",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · اینترمدیت",
    bookTitleEn: "Real-Life Practical English · Intermediate (B1)",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    badgeColor: "#8b5cf6",
    icon: "🎯",
    descFa: "بیان نظرات در جلسات کاری، مشاوره دادن، مکالمات تجاری و مستندهای فرهنگی و اجتماعی بی‌بی‌سی.",
    totalVideos: 16,
  }},
  b1_plus: {{
    tier: "b1_plus",
    cefr: "B1",
    levelNameFa: "سطح B1+ · فرامتوسط",
    levelNameEn: "Level B1+ · Intermediate Plus",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · اینترمدیت پلاس",
    bookTitleEn: "Real-Life Practical English · Intermediate Plus (B1+)",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
    badgeColor: "#d97706",
    icon: "🔥",
    descFa: "مکالمات پیچیده‌تر، تحلیل اخبار رسانه‌ها، مصاحبه‌های شغلی پیشرفته و ارتباطات میان‌فرهنگی.",
    totalVideos: 16,
  }},
  b2: {{
    tier: "b2",
    cefr: "B2",
    levelNameFa: "سطح B2 · پیشرفته مقدماتی",
    levelNameEn: "Level B2 · Upper-Intermediate",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · آپر اینترمدیت",
    bookTitleEn: "Real-Life Practical English · Upper-Intermediate (B2)",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    badgeColor: "#ea580c",
    icon: "🚀",
    descFa: "مذاکره، اقناع مخاطب، طنز و کنایه در مکالمه، مدیریت بحران و ارزیابی استدلال‌های تخصصی.",
    totalVideos: 16,
  }},
  b2_plus: {{
    tier: "b2_plus",
    cefr: "B2",
    levelNameFa: "سطح B2+ · پیشرفته تکمیلی",
    levelNameEn: "Level B2+ · Advanced Plus",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · ادونس پلاس",
    bookTitleEn: "Real-Life Practical English · Advanced Plus (B2+)",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    badgeColor: "#dc2626",
    icon: "💎",
    descFa: "نقد و تحلیل رسانه‌ای، سخنرانی‌های پرشور، مناظره‌های جدی و زبان حرفه‌ای و آکادمیک.",
    totalVideos: 16,
  }},
  c1_c2: {{
    tier: "c1_c2",
    cefr: "C1",
    levelNameFa: "سطح C1/C2 · تسلط کامل و رسانه",
    levelNameEn: "Level C1-C2 · Advanced & Proficiency",
    bookTitleFa: "انگلیسی کاربردی در دنیای واقعی · تسلط کامل",
    bookTitleEn: "Real-Life Practical English · Proficiency (C1-C2)",
    gradient: "linear-gradient(135deg, #0f172a, #334155)",
    badgeColor: "#0f172a",
    icon: "👑",
    descFa: "تسلط کامل بر ظرافت‌های زبانی، متون تخصصی رسانه‌ای، شوخ‌طبعی بریتانیایی و مباحث بین‌المللی.",
    totalVideos: 16,
  }},
}};

export const REAL_LIFE_LESSONS: RealLifeVideoLesson[] = {json.dumps(all_lessons, ensure_ascii=False, indent=2)};

export function getAllRealLifeLevels(): RealLifeLevelMeta[] {{
  return Object.values(REAL_LIFE_LEVELS_META);
}}

export function getRealLifeLevelMeta(tier: string): RealLifeLevelMeta | undefined {{
  const key = tier.toLowerCase();
  if (REAL_LIFE_LEVELS_META[key]) return REAL_LIFE_LEVELS_META[key];
  if (key === "c1" || key === "c2") return REAL_LIFE_LEVELS_META["c1_c2"];
  return undefined;
}}

export function getRealLifeLessonsByLevel(tier: string): RealLifeVideoLesson[] {{
  const t = tier.toLowerCase();
  return REAL_LIFE_LESSONS.filter((les) => les.level.toLowerCase() === t);
}}

export function getRealLifeLessonById(id: string): RealLifeVideoLesson | undefined {{
  const targetId = id.toLowerCase();
  return REAL_LIFE_LESSONS.find((les) => les.id.toLowerCase() === targetId);
}}

export function getNextRealLifeLesson(currentLessonId: string): RealLifeVideoLesson | null {{
  const current = getRealLifeLessonById(currentLessonId);
  if (!current) return null;
  const sameLevelLessons = getRealLifeLessonsByLevel(current.level);
  const currentIndex = sameLevelLessons.findIndex((l) => l.id.toLowerCase() === current.id.toLowerCase());
  if (currentIndex !== -1 && currentIndex < sameLevelLessons.length - 1) {{
    return sameLevelLessons[currentIndex + 1];
  }}
  return null;
}}
"""

    with open(DEST_FILE, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Successfully generated {DEST_FILE} with {len(all_lessons)} total lessons!")

if __name__ == "__main__":
    main()
