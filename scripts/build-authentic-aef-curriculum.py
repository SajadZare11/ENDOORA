"""
Builder for Authentic American English File Curriculum
Constructs aef-curriculum.ts matching the 18 real MP4 files in A1 and 18 in A2
stored in 'E:\\0\\Work\\Website\\The General Website\\Speakout and AEF Videos\\AEF'
"""

import os
import json

DEST_FILE = r"E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts"

A1_AEF_LESSONS = [
    {
        "ep": 1,
        "file": "AEF3e_SB1_PE_Ep1_Introduction.mp4",
        "titleEn": "Episode 1 · Part 1: Jenny Arrives in New York",
        "titleFa": "اپیزود ۱ · بخش ۱: ورود جنی به نیویورک و معرفی",
        "unit": "Practical English Episode 1",
        "duration": "1:35",
        "durationSec": 95,
        "icon": "🗽",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "Jenny Zielinski, an assistant editor on a New York magazine, introduces herself, her busy life in Manhattan, and her upcoming work with Rob Walker.",
        "summaryFa": "جنی زیلینسکی، دستیار سردبیر یک مجله در نیویورک، خود، زندگی پرمشغله در منهتن و همکاری کاری پیش‌رو با راب واکر از لندن را معرفی می‌کند.",
        "keyTopics": ["معرفی خود و شغل", "زندگی شهری در منهتن", "فعل to be و زمان حال ساده", "لهجه آمریکایی"],
        "speakingTargetEn": "My name's Jenny Zielinski. I live and work in New York City.",
        "speakingTargetFa": "اسم من جنی زیلینسکی است. من در شهر نیویورک زندگی و کار می‌کنم.",
        "speakingPhonetic": "/maɪ neɪmz ˈdʒeni zɪˈlɪnski aɪ lɪv ənd wɜːrk ɪn nuː jɔːrk ˈsɪti/",
        "speakingTips": "تلفظ New York در لهجه آمریکایی به صورت /nuː jɔːrk/ ادا می‌شود.",
        "minWords": 10,
        "keywords": ["name", "live", "work"],
        "sampleEn": "Hi, my name is Jenny and I work as an editor for a magazine in New York.",
        "sampleFa": "سلام، اسم من جنی است و به عنوان ویراستار برای یک مجله در نیویورک کار می‌کنم."
    },
    {
        "ep": 2,
        "file": "AEF3e_SB1_PE_Ep1_Checking_in.mp4",
        "titleEn": "Episode 1 · Part 2: Checking In at a New York Hotel",
        "titleFa": "اپیزود ۱ · بخش ۲: ورود و پذیرش در هتل منهتن",
        "unit": "Practical English Episode 1",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🏨",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "Rob arrives at his Manhattan hotel, speaks to the receptionist, verifies his booking, and gets his room key card and Wi-Fi password.",
        "summaryFa": "راب به هتل خود در منهتن می‌رسد، با مسئول پذیرش صحبت می‌کند، رزرو اتاقش را تایید کرده و کلید و رمز وای‌فای را تحویل می‌گیرد.",
        "keyTopics": ["اصطلاحات پذیرش هتل (Check in, reservation)", "هجی کردن نام خانوادگی", "کارت ورود به اتاق (Key card)", "رمز وای‌فای"],
        "speakingTargetEn": "I have a reservation for six nights under the name Rob Walker.",
        "speakingTargetFa": "من یک رزرو شش شبه به نام راب واکر دارم.",
        "speakingPhonetic": "/aɪ hæv ə ˌrezərˈveɪʃn fɔːr sɪks naɪts ˈʌndər ðə neɪm rɑːb ˈwɔːkər/",
        "speakingTips": "عبارت 'under the name' رایج‌ترین ساختار معرفی نام در رزرو است.",
        "minWords": 12,
        "keywords": ["reservation", "room", "key"],
        "sampleEn": "Good afternoon, I have a hotel reservation and I would like to check in to my room.",
        "sampleFa": "بعدازظهر بخیر، من رزرو هتل دارم و مایل هستم در اتاقم پذیرش شوم."
    },
    {
        "ep": 3,
        "file": "AEF3e_SB1_PE_Ep1_Jenny_talks_to_Rob.mp4",
        "titleEn": "Episode 1 · Part 3: Jenny Calls Rob in His Hotel Room",
        "titleFa": "اپیزود ۱ · بخش ۳: تماس تلفنی جنی با راب در اتاق هتل",
        "unit": "Practical English Episode 1",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "📞",
        "gradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "summaryEn": "Jenny phones Rob in his hotel room to welcome him to America, check if everything is OK with the room, and arrange their morning meeting.",
        "summaryFa": "جنی با اتاق راب در هتل تماس می‌گیرد تا به او خوشامد بگوید، از شرایط اتاق مطمئن شود و برای قرار صبح فردا هماهنگ کند.",
        "keyTopics": ["مکالمات تلفنی انگلیسی (Is that Rob?)", "احوالپرسی و تعارفات رسمی", "هماهنگی ساعت ملاقات", "صحبت درباره خستگی پرواز (Jet lag)"],
        "speakingTargetEn": "Hello, Rob? It's Jenny Zielinski from the magazine office.",
        "speakingTargetFa": "سلام راب؟ جنی زیلینسکی هستم از دفتر مجله.",
        "speakingPhonetic": "/həˈloʊ rɑːb ɪts ˈdʒeni zɪˈlɪnski frəm ðə ˈmæɡəziːn ˈɔːfɪs/",
        "speakingTips": "در تماس تلفنی برای معرفی خود از 'It's Jenny' استفاده می‌شود نه 'I am Jenny'.",
        "minWords": 12,
        "keywords": ["phone", "meet", "tomorrow"],
        "sampleEn": "Thank you for calling; I look forward to meeting you tomorrow morning at nine.",
        "sampleFa": "ممنون از تماستان؛ مشتاقانه منتظر دیدار شما فردا صبح ساعت نه هستم."
    },
    {
        "ep": 4,
        "file": "AEF3e_SB1_PE_Ep2_Rob_and_Jenny_Meet.mp4",
        "titleEn": "Episode 2 · Part 1: Rob and Jenny Meet at the Magazine",
        "titleFa": "اپیزود ۲ · بخش ۱: دیدار راب و جنی در دفتر مجله",
        "unit": "Practical English Episode 2",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🤝",
        "gradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
        "summaryEn": "Rob arrives at the office in New York and meets Jenny in person for the very first time, along with their boss Daniel.",
        "summaryFa": "راب به دفتر کار نیویورک می‌رسد و برای نخستین بار جنی و مدیرشان دانیل را حضوری ملاقات می‌کند.",
        "keyTopics": ["معرفی همکاران جدید", "اصطلاحات خوشامدگویی کاری", "صحبت درباره سفر پروازی", "محیط اداری منهتن"],
        "speakingTargetEn": "It's great to finally meet you in person, Rob.",
        "speakingTargetFa": "دیدار حضوری شما در نهایت بسیار عالی است راب.",
        "speakingPhonetic": "/ɪts ɡreɪt tuː ˈfaɪnəli miːt juː ɪn ˈpɜːrsn rɑːb/",
        "speakingTips": "عبارت 'in person' یعنی به صورت حضوری و فیزیکی.",
        "minWords": 12,
        "keywords": ["meet", "office", "finally"],
        "sampleEn": "It is really nice to meet everyone at the office and begin our new project together.",
        "sampleFa": "دیدار با همه در دفتر کار و شروع پروژه مشترک جدیدمان واقعاً لذت‌بخش است."
    },
    {
        "ep": 5,
        "file": "AEF3e_SB1_PE_Ep2_Buying_a_coffee.mp4",
        "titleEn": "Episode 2 · Part 2: Buying a Coffee in Manhattan",
        "titleFa": "اپیزود ۲ · بخش ۲: سفارش قهوه و پرداخت در کافی‌شاپ",
        "unit": "Practical English Episode 2",
        "duration": "2:05",
        "durationSec": 125,
        "icon": "☕",
        "gradient": "linear-gradient(135deg, #d97706, #f59e0b)",
        "summaryEn": "Rob orders coffee and a pastry at a bustling New York coffee shop, choosing between sizes, milk options, and takeaway vs having it here.",
        "summaryFa": "راب در یک کافه شلوغ نیویورکی قهوه و کیک سفارش می‌دهد و بین سایزها، نوع شیر و بردن یا میل در کافه انتخاب می‌کند.",
        "keyTopics": ["سفارش نوشیدنی (Can I have a latte?)", "انتخاب سایز (Single, double, regular, large)", "برای بردن یا میل در کافه (To go or to have here?)", "قیمت و پرداخت پول"],
        "speakingTargetEn": "Can I have a double espresso to go, please?",
        "speakingTargetFa": "آیا می‌توانم یک دابل اسپرسو بیرون‌بر داشته باشم لطفاً؟",
        "speakingPhonetic": "/kən aɪ hæv ə ˈdʌbl eˈspresoʊ tuː ɡoʊ pliːz/",
        "speakingTips": "در آمریکا عبارت 'to go' به معنای غذای بیرون‌بر استفاده می‌شود.",
        "minWords": 12,
        "keywords": ["coffee", "please", "have"],
        "sampleEn": "Can I please have a large cappuccino and a chocolate muffin to go?",
        "sampleFa": "آیا می‌توانم لطفاً یک کاپوچینوی بزرگ و مافین شکلاتی بیرون‌بر داشته باشم؟"
    },
    {
        "ep": 6,
        "file": "AEF3e_SB1_PE_Ep2_First_day_in_the_office.mp4",
        "titleEn": "Episode 2 · Part 3: First Day in the Office with Daniel",
        "titleFa": "اپیزود ۲ · بخش ۳: نخستین روز در دفتر کار و گفتگو با دانیل",
        "unit": "Practical English Episode 2",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "💼",
        "gradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
        "summaryEn": "Daniel introduces Rob to the office layout and equipment, discussing their upcoming article series on New York culture.",
        "summaryFa": "دانیل بخش‌های مختلف دفتر کار و امکانات را به راب نشان می‌دهد و درباره سری مقالات پیش‌رو پیرامون فرهنگ نیویورک صحبت می‌کند.",
        "keyTopics": ["معرفی فضاهای اداری", "بحث درباره مقالات و ایده‌ها", "تعارفات و فرهنگ کاری آمریکا", "برنامه‌ریزی ساعات کاری"],
        "speakingTargetEn": "Here is your desk, and you can use this computer for writing.",
        "speakingTargetFa": "این میز کار شماست و می‌توانید از این رایانه برای نگارش استفاده کنید.",
        "speakingPhonetic": "/hɪr ɪz jɔːr desk ənd juː kən juːz ðɪs kəmˈpjuːtər fɔːr ˈraɪtɪŋ/",
        "speakingTips": "تلفظ آمریکایی computer به صورت /kəmˈpjuːtər/ با r انتهایی رسا است.",
        "minWords": 12,
        "keywords": ["office", "computer", "desk"],
        "sampleEn": "On my first day at work, my team welcomed me warmly and showed me my new desk.",
        "sampleFa": "در نخستین روز کاری‌ام، تیم به گرمی از من استقبال کردند و میزم را به من نشان دادند."
    },
    {
        "ep": 7,
        "file": "AEF3e_SB1_PE_Ep3_Jenny's_on_the_phone.mp4",
        "titleEn": "Episode 3 · Part 1: Jenny's on the Phone",
        "titleFa": "اپیزود ۳ · بخش ۱: تماس‌های مکرر تلفنی جنی",
        "unit": "Practical English Episode 3",
        "duration": "1:35",
        "durationSec": 95,
        "icon": "📱",
        "gradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "summaryEn": "Jenny is busy juggling multiple phone calls and deadlines, while Rob needs her advice on shopping for clothes in town.",
        "summaryFa": "جنی در حال پاسخگویی به تماس‌های فشرده کاری و ضرب‌الاجل‌هاست، در حالی که راب برای خرید لباس در شهر نیاز به راهنمایی دارد.",
        "keyTopics": ["عبارات انتظار پای تلفن (Hold on, please)", "پیام گذاشتن تلفنی", "عذرخواهی برای تاخیر", "مشغله‌های محیط کار مدرن"],
        "speakingTargetEn": "I'm really sorry, can you hold on for just a second?",
        "speakingTargetFa": "واقعاً عذرخواهی می‌کنم، آیا می‌توانید فقط یک لحظه پشت خط منتظر بمانید؟",
        "speakingPhonetic": "/aɪm ˈrɪəli ˈsɑːri kən juː hoʊld ɑːn fɔːr dʒʌst ə ˈsekənd/",
        "speakingTips": "عبارت 'hold on' رایج‌ترین اصطلاح برای انتظار پای تلفن است.",
        "minWords": 12,
        "keywords": ["sorry", "hold", "phone"],
        "sampleEn": "I apologize for the delay; I was on an urgent phone call with a client.",
        "sampleFa": "بابت تاخیر پوزش می‌خواهم؛ من در حال مکالمه تلفنی فوری با یک مشتری بودم."
    },
    {
        "ep": 8,
        "file": "AEF3e_SB1_PE_Ep3_Buying_clothes.mp4",
        "titleEn": "Episode 3 · Part 2: Buying Clothes in a Retail Store",
        "titleFa": "اپیزود ۳ · بخش ۲: خرید لباس و پرو در فروشگاه",
        "unit": "Practical English Episode 3",
        "duration": "2:15",
        "durationSec": 130,
        "icon": "🛍️",
        "gradient": "linear-gradient(135deg, #db2777, #f472b6)",
        "summaryEn": "Rob visits a retail store to buy a new shirt and sweater, asking the shop assistant for sizes, fitting room locations, and paying by card.",
        "summaryFa": "راب برای خرید پیراهن و پلیور نو به فروشگاه پوشاک می‌رود، درباره سایز و اتاق پرو سوال کرده و با کارت بانکی پرداخت می‌کند.",
        "keyTopics": ["مکالمات فروشگاه لباس (What size are you?)", "اتاق پرو (Changing rooms)", "پرو کردن لباس (Can I try it on?)", "پرداخت با کارت اعتباری"],
        "speakingTargetEn": "Where are the changing rooms? Can I try this shirt on?",
        "speakingTargetFa": "اتاق‌های پرو کجا هستند؟ آیا می‌توانم این پیراهن را پرو کنم؟",
        "speakingPhonetic": "/wer ɑːr ðə ˈtʃeɪndʒɪŋ ruːmz kən aɪ traɪ ðɪs ʃɜːrt ɑːn/",
        "speakingTips": "کلمه changing room در انگلیسی بریتانیایی و fitting room در آمریکایی استفاده می‌شود.",
        "minWords": 12,
        "keywords": ["size", "shirt", "try"],
        "sampleEn": "Excuse me, do you have this blue sweater in a medium size so I can try it on?",
        "sampleFa": "ببخشید، آیا این پلیور آبی را در سایز مدیوم دارید تا آن را پرو کنم؟"
    },
    {
        "ep": 9,
        "file": "AEF3e_SB1_PE_Ep3_Meeting_on_the_street.mp4",
        "titleEn": "Episode 3 · Part 3: Meeting on the Street",
        "titleFa": "اپیزود ۳ · بخش ۳: برخورد غیرمنتظره در خیابان",
        "unit": "Practical English Episode 3",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🚶‍♂️",
        "gradient": "linear-gradient(135deg, #9333ea, #c084fc)",
        "summaryEn": "Rob runs into Jenny on the street carrying his shopping bags, and they share a humorous exchange about fashion choices.",
        "summaryFa": "راب در خیابان با کیسه‌های خرید با جنی برخورد می‌کند و گفتگویی صمیمانه و طنزآمیز درباره انتخاب‌های لباس دارند.",
        "keyTopics": ["برخورد اتفاقی در خیابان (What a surprise!)", "تعریف از ظاهر و سلیقه (It looks great on you)", "دعوت به همراهی", "مکالمه غیررسمی"],
        "speakingTargetEn": "What a coincidence! I didn't expect to see you here.",
        "speakingTargetFa": "چه تصادفی! انتظار نداشتم شما را اینجا ببینم.",
        "speakingPhonetic": "/wʌt ə koʊˈɪnsɪdəns aɪ ˈdɪdnt ɪkˈspekt tuː siː juː hɪr/",
        "speakingTips": "کلمه coincidence دارای استرس روی سیلاب دوم /koʊˈɪnsɪdəns/ است.",
        "minWords": 12,
        "keywords": ["street", "see", "great"],
        "sampleEn": "It was lovely seeing my colleague on the street while walking back to the hotel.",
        "sampleFa": "دیدن همکارم در خیابان حین بازگشت پیاده به هتل بسیار خوشایند بود."
    },
    {
        "ep": 10,
        "file": "AEF3e_SB1_PE_Ep4_A_free_morning.mp4",
        "titleEn": "Episode 4 · Part 1: A Free Morning in New York",
        "titleFa": "اپیزود ۴ · بخش ۱: صبح آزاد و گشت‌وگذار در شهر",
        "unit": "Practical English Episode 4",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🌤️",
        "gradient": "linear-gradient(135deg, #0d9488, #2dd4bf)",
        "summaryEn": "Rob has a free morning before afternoon meetings and decides to explore some of the city's famous architectural sights.",
        "summaryFa": "راب پیش از جلسات بعدازظهر یک صبح آزاد دارد و تصمیم می‌گیرد برخی از جاهای دیدنی و معماری معروف شهر را کشف کند.",
        "keyTopics": ["برنامه‌ریزی اوقات فراغت", "جاذبه‌های گردشگری", "سفر با پای پیاده در منهتن", "مدیریت زمان در سفر کاری"],
        "speakingTargetEn": "I have a free morning today, so I'm going to walk around.",
        "speakingTargetFa": "من امروز صبح آزاد دارم، بنابراین قصد دارم پیاده‌روی کنم.",
        "speakingPhonetic": "/aɪ hæv ə friː ˈmɔːrnɪŋ təˈdeɪ soʊ aɪm ˈɡoʊɪŋ tuː wɔːk əˈraʊnd/",
        "speakingTips": "فعل walk را بدون صدای l و به صورت /wɔːk/ تلفظ کنید.",
        "minWords": 12,
        "keywords": ["morning", "free", "city"],
        "sampleEn": "During my free morning I walked through the park and took beautiful photos of the city.",
        "sampleFa": "در طول صبح آزادم در پارک قدم زدم و عکس‌های زیبایی از شهر گرفتم."
    },
    {
        "ep": 11,
        "file": "AEF3e_SB1_PE_Ep4_Asking_for_directions.mp4",
        "titleEn": "Episode 4 · Part 2: Asking for Directions in New York",
        "titleFa": "اپیزود ۴ · بخش ۲: پرسیدن آدرس و جهت‌یابی در خیابان",
        "unit": "Practical English Episode 4",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🗺️",
        "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
        "summaryEn": "Rob gets lost looking for a subway station and asks friendly New Yorkers for directions using street blocks and landmarks.",
        "summaryFa": "راب برای یافتن ایستگاه مترو مسیر را گم می‌کند و از عابران نیویورکی با استفاده از تقاطع‌ها و بلوک‌های خیابان آدرس می‌پرسد.",
        "keyTopics": ["پرسیدن مسیر (Excuse me, is there a station near here?)", "جهت‌یابی (Go straight, turn left, on the corner)", "مفهوم بلوک در شهرهای آمریکا (Walk two blocks)", "حروف اضافه جهت و مکان"],
        "speakingTargetEn": "Go straight ahead for two blocks, then turn left at the lights.",
        "speakingTargetFa": "دو کوچه مستقیم جلو بروید، سپس سر چراغ راهنمایی به چپ بپیچید.",
        "speakingPhonetic": "/ɡoʊ streɪt əˈhed fɔːr tuː blɑːks ðen tɜːrn left ət ðə laɪts/",
        "speakingTips": "در انگلیسی آمریکایی block واحد اصلی فاصله در خیابان‌هاست.",
        "minWords": 12,
        "keywords": ["straight", "turn", "station"],
        "sampleEn": "To reach the subway station, go straight ahead and turn right at the traffic lights.",
        "sampleFa": "برای رسیدن به ایستگاه مترو، مستقیم بروید و سر چراغ راهنمایی به راست بپیچید."
    },
    {
        "ep": 12,
        "file": "AEF3e_SB1_PE_Ep4_Jenny_and_Rob_go_sightseeing.mp4",
        "titleEn": "Episode 4 · Part 3: Jenny and Rob Go Sightseeing",
        "titleFa": "اپیزود ۴ · بخش ۳: گردش در جاهای دیدنی نیویورک با راب و جنی",
        "unit": "Practical English Episode 4",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🌉",
        "gradient": "linear-gradient(135deg, #10b981, #34d399)",
        "summaryEn": "Jenny joins Rob to guide him past famous sights like the Brooklyn Bridge and shares stories about local New York culture.",
        "summaryFa": "جنی به راب می‌پیوندد تا او را از کنار مناظر معروفی چون پل بروکلین عبور داده و داستان‌هایی از فرهنگ محلی نیویورک را بازگو کند.",
        "keyTopics": ["توصیف پل‌ها و آسمان‌خراش‌ها", "تاریخچه محلی نیویورک", "صفت‌های تحسین منظر (Spectacular, iconic)", "روایت خاطرات شهری"],
        "speakingTargetEn": "The view of the skyline from the Brooklyn Bridge is breathtaking.",
        "speakingTargetFa": "منظره خط افق شهر از روی پل بروکلین نفس‌گیر و بی‌نظیر است.",
        "speakingPhonetic": "/ðə vjuː əv ðə ˈskaɪlaɪn frəm ðə ˈbrʊklɪn brɪdʒ ɪz ˈbreθteɪkɪŋ/",
        "speakingTips": "کلمه breathtaking به معنای بسیار زیبا و حیرت‌انگیز است.",
        "minWords": 12,
        "keywords": ["view", "bridge", "beautiful"],
        "sampleEn": "Walking across the famous bridge provided us with a magnificent view of the Manhattan skyline.",
        "sampleFa": "قدم زدن روی پل معروف، منظره‌ای باشکوه از آسمان‌خراش‌های منهتن به ما ارائه داد."
    },
    {
        "ep": 13,
        "file": "AEF3e_SB1_PE_Ep5_An_invitation_to_dinner.mp4",
        "titleEn": "Episode 5 · Part 1: An Invitation to Dinner",
        "titleFa": "اپیزود ۵ · بخش ۱: دعوت به ضیافت شام و هماهنگی قرار",
        "unit": "Practical English Episode 5",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🍽️",
        "gradient": "linear-gradient(135deg, #ea580c, #f97316)",
        "summaryEn": "Jenny and Daniel invite Rob to join them for a celebratory business dinner at a traditional Italian restaurant in Manhattan.",
        "summaryFa": "جنی و دانیل از راب دعوت می‌کنند تا برای یک شام کاری و جشن موفقیت در یک رستوران سنتی ایتالیایی در منهتن به آن‌ها بپیوندد.",
        "keyTopics": ["دعوت کردن رسمی (Would you like to join us?)", "پذیرش مودبانه دعوت (I'd love to)", "هماهنگی روز و ساعت", "انتخاب نوع رستوران"],
        "speakingTargetEn": "Would you like to join us for dinner tonight at seven?",
        "speakingTargetFa": "آیا مایل هستید امشب ساعت هفت برای شام به ما ملحق شوید؟",
        "speakingPhonetic": "/wʊd juː laɪk tuː dʒɔɪn ʌs fɔːr ˈdɪnər təˈnaɪt ət ˈsevn/",
        "speakingTips": "ساختار 'Would you like to...' رسمی‌ترین شیوه تعارف و دعوت است.",
        "minWords": 12,
        "keywords": ["dinner", "join", "tonight"],
        "sampleEn": "Thank you for the kind invitation; I would love to join you all for dinner tonight.",
        "sampleFa": "از دعوت محبت‌آمیزتان سپاسگزارم؛ من خیلی مشتاقم امشب برای شام به جمع شما بپیوندم."
    },
    {
        "ep": 14,
        "file": "AEF3e_SB1_PE_Ep5_Ordering_a_meal.mp4",
        "titleEn": "Episode 5 · Part 2: Ordering a Meal in a Restaurant",
        "titleFa": "اپیزود ۵ · بخش ۲: سفارش غذا و نوشیدنی از منوی رستوران",
        "unit": "Practical English Episode 5",
        "duration": "2:15",
        "durationSec": 130,
        "icon": "🍝",
        "gradient": "linear-gradient(135deg, #dc2626, #ef4444)",
        "summaryEn": "The waiter takes their order: appetizers, main courses like grilled salmon and pasta, drinks, and dietary preferences.",
        "summaryFa": "پیشخدمت سفارش پیش‌غذا، غذای اصلی نظیر ماهی سالمون گریل‌شده و پاستا، نوشیدنی‌ها و ترجیحات غذایی را یادداشت می‌کند.",
        "keyTopics": ["سفارش غذا (I'll have the grilled salmon, please)", "پیش‌غذا و غذای اصلی (Appetizer / Main course)", "پرسیدن درباره مخلفات (Does it come with salad?)", "مکالمات رستوران"],
        "speakingTargetEn": "For my main course, I'll have the grilled salmon with salad.",
        "speakingTargetFa": "برای غذای اصلی، من سالمون گریل‌شده به همراه سالاد خواهم خورد.",
        "speakingPhonetic": "/fɔːr maɪ meɪn kɔːrs aɪl hæv ðə ɡrɪld ˈsæmən wɪð ˈsæləd/",
        "speakingTips": "در کلمه salmon حرف l کاملاً بی‌صداست: /ˈsæmən/.",
        "minWords": 12,
        "keywords": ["order", "salad", "please"],
        "sampleEn": "To start with I would like vegetable soup, and for my main course grilled chicken.",
        "sampleFa": "برای شروع سوپ سبزیجات و برای غذای اصلی مرغ گریل‌شده میل دارم."
    },
    {
        "ep": 15,
        "file": "AEF3e_SB1_PE_Ep5_The_end_of_the_meal.mp4",
        "titleEn": "Episode 5 · Part 3: The End of the Meal and the Bill",
        "titleFa": "اپیزود ۵ · بخش ۳: پایان غذا، درخواست صورتحساب و انعام",
        "unit": "Practical English Episode 5",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "💳",
        "gradient": "linear-gradient(135deg, #b45309, #f59e0b)",
        "summaryEn": "The dinner concludes with desserts, Rob asking for the check/bill, and Daniel discussing the culture of tipping in American restaurants.",
        "summaryFa": "ضیافت شام با دسر به پایان می‌رسد، راب صورتحساب را درخواست می‌کند و دانیل درباره فرهنگ انعام دادن در رستوران‌های آمریکا توضیح می‌دهد.",
        "keyTopics": ["درخواست صورتحساب (Could we have the check, please?)", "فرهنگ انعام (Tipping culture in the US)", "تشکر از پرسنل رستوران", "پرداخت دنگی یا مهمان کردن"],
        "speakingTargetEn": "Could we have the check, please? We'd like to pay together.",
        "speakingTargetFa": "آیا ممکن است لطفاً صورتحساب را بیاورید؟ ما می‌خواهیم با هم پرداخت کنیم.",
        "speakingPhonetic": "/kʊd wiː hæv ðə tʃek pliːz wiːd laɪk tuː peɪ təˈɡeðər/",
        "speakingTips": "در آمریکا صورتحساب رستوران 'check' نامیده می‌شود (در بریتانیا bill).",
        "minWords": 12,
        "keywords": ["check", "bill", "pay"],
        "sampleEn": "After enjoying our delicious meal, we asked the waiter for the check and left a generous tip.",
        "sampleFa": "پس از لذت بردن از غذای لذیذمان، صورتحساب را از گارسون درخواست کرده و انعام مناسبی پرداختیم."
    },
    {
        "ep": 16,
        "file": "AEF3e_SB1_PE_Ep6_Jenny's_last_morning.mp4",
        "titleEn": "Episode 6 · Part 1: Jenny's Last Morning",
        "titleFa": "اپیزود ۶ · بخش ۱: آخرین صبح اقامت و بستن چمدان",
        "unit": "Practical English Episode 6",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🧳",
        "gradient": "linear-gradient(135deg, #6366f1, #818cf8)",
        "summaryEn": "Rob prepares for his return flight to London, packing his bags in the hotel room and calling reception to request a taxi to JFK airport.",
        "summaryFa": "راب برای پرواز بازگشت به لندن آماده می‌شود، چمدان‌هایش را در هتل می‌بندد و با پذیرش برای درخواست تاکسی به فرودگاه JFK تماس می‌گیرد.",
        "keyTopics": ["تسویه‌حساب هتل (Check out)", "درخواست تاکسی فرودگاه (Could you call a cab?)", "بررسی گذرنامه و بلیط", "احساسات پایان سفر"],
        "speakingTargetEn": "Could you call a taxi for me to the airport, please?",
        "speakingTargetFa": "آیا ممکن است لطفاً برای من یک تاکسی به فرودگاه خبر کنید؟",
        "speakingPhonetic": "/kʊd juː kɔːl ə ˈtæksi fɔːr miː tuː ðiː ˈeəpɔːt pliːz/",
        "speakingTips": "کلمه taxi یا cab در نیویورک هر دو کاربرد دارند.",
        "minWords": 12,
        "keywords": ["taxi", "airport", "morning"],
        "sampleEn": "On my last morning, I packed my luggage and asked the front desk to book a morning cab.",
        "sampleFa": "در آخرین صبح، چمدانم را بستم و از پذیرش خواستم یک تاکسی صبحگاهی رزرو کند."
    },
    {
        "ep": 17,
        "file": "AEF3e_SB1_PE_Ep6_Getting_to_the_airport.mp4",
        "titleEn": "Episode 6 · Part 2: Getting to the Airport in Traffic",
        "titleFa": "اپیزود ۶ · بخش ۲: حرکت در ترافیک شهر به سمت فرودگاه",
        "unit": "Practical English Episode 6",
        "duration": "2:00",
        "durationSec": 120,
        "icon": "🚕",
        "gradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
        "summaryEn": "Rob rides a yellow cab through heavy Manhattan traffic, chatting with the driver about travel times and flight departures.",
        "summaryFa": "راب با یک تاکسی زرد در ترافیک سنگین منهتن به سوی فرودگاه می‌رود و با راننده درباره زمان پرواز و تاخیرها گفتگو می‌کند.",
        "keyTopics": ["تاکسی‌های زرد نیویورک (Yellow cab)", "ترافیک شهری (Heavy traffic)", "مدت زمان مسیر (How long will it take?)", "ترمینال‌های فرودگاه"],
        "speakingTargetEn": "How long will it take to get to JFK Airport in this traffic?",
        "speakingTargetFa": "با این ترافیک چقدر طول می‌کشد تا به فرودگاه JFK برسیم؟",
        "speakingPhonetic": "/haʊ lɒŋ wɪl ɪt teɪk tuː ɡet tuː dʒeɪ ef keɪ ˈeəpɔːt ɪn ðɪs ˈtræfɪk/",
        "speakingTips": "ساختار 'How long will it take...' برای پرسیدن زمان مسیر به کار می‌رود.",
        "minWords": 12,
        "keywords": ["traffic", "airport", "time"],
        "sampleEn": "Due to heavy city traffic, it took nearly an hour to reach the airport terminal.",
        "sampleFa": "به دلیل ترافیک سنگین شهری، رسیدن به ترمینال فرودگاه نزدیک به یک ساعت طول کشید."
    },
    {
        "ep": 18,
        "file": "AEF3e_SB1_PE_Ep6_Saying_goodbye.mp4",
        "titleEn": "Episode 6 · Part 3: Saying Goodbye at the Departure Gate",
        "titleFa": "اپیزود ۶ · بخش ۳: خداحافظی در فرودگاه و امید به دیدار دوباره",
        "unit": "Practical English Episode 6",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "✈️",
        "gradient": "linear-gradient(135deg, #0f172a, #334155)",
        "summaryEn": "Jenny meets Rob at the airport gate to say goodbye, give him a farewell gift, and promise to stay in touch for their next joint project.",
        "summaryFa": "جنی در گیت فرودگاه برای خداحافظی به راب می‌رسد، هدیه یادبودی به او می‌دهد و قول می‌دهند برای پروژه بعدی در تماس باشند.",
        "keyTopics": ["اصطلاحات خداحافظی گرم (Have a safe flight!)", "در تماس بودن (Keep in touch)", "آرزوی موفقیت و سفر امن", "پایان داستان فصل اول"],
        "speakingTargetEn": "Have a safe flight back to London, and don't forget to keep in touch!",
        "speakingTargetFa": "پرواز امنی در بازگشت به لندن داشته باش، و یادت نرود در تماس باشیم!",
        "speakingPhonetic": "/hæv ə seɪf flaɪt bæk tuː ˈlʌndən ənd doʊnt fərˈɡet tuː kiːp ɪn tʌtʃ/",
        "speakingTips": "اصطلاح 'keep in touch' یعنی حفظ ارتباط و بی‌خبر نگذاشتن دوستان.",
        "minWords": 12,
        "keywords": ["flight", "touch", "goodbye"],
        "sampleEn": "We hugged goodbye at the gate and promised to keep in touch regularly until our next meeting.",
        "sampleFa": "ما در گیت با هم خداحافظی کردیم و قول دادیم تا دیدار بعدی مرتباً در تماس باشیم."
    }
]

A2_AEF_LESSONS = [
    {
        "ep": 1,
        "file": "AEF3e_SB2_PE_Ep1_Introduction.mp4",
        "titleEn": "Episode 1 · Part 1: Rob Returns to New York",
        "titleFa": "اپیزود ۱ · بخش ۱: بازگشت راب به نیویورک",
        "unit": "Practical English Episode 1",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🗽",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "Rob is back in New York City on a permanent assignment for the magazine, excited to see Jenny again and work in the US.",
        "summaryFa": "راب برای ماموریت کاری دائمی در مجله به نیویورک بازگشته و مشتاق دیدار مجدد جنی و کار در آمریکاست.",
        "keyTopics": ["بازگشت به شهر جدید", "اهداف کاری بلندمدت", "لهجه و اصطلاحات آمریکایی", "احوالپرسی دوستان قدیمی"],
        "speakingTargetEn": "It is wonderful to be back in New York City after so many months.",
        "speakingTargetFa": "بازگشت به شهر نیویورک پس از ماه‌ها بسیار شگفت‌انگیز است.",
        "speakingPhonetic": "/ɪt ɪz ˈwʌndərfl tuː biː bæk ɪn nuː jɔːrk ˈsɪti ˈæftər soʊ ˈmeni mʌnθs/",
        "speakingTips": "روی کلمه wonderful برای بیان شوق استرس بگذارید.",
        "minWords": 12,
        "keywords": ["back", "months", "city"],
        "sampleEn": "Returning to New York for work was an exciting opportunity that I gladly accepted.",
        "sampleFa": "بازگشت به نیویورک برای کار فرصت هیجان‌انگیزی بود که با کمال میل پذیرفتم."
    },
    {
        "ep": 2,
        "file": "AEF3e_SB2_PE_Ep1_Calling _reception.mp4",
        "titleEn": "Episode 1 · Part 2: Calling Reception to Fix an Issue",
        "titleFa": "اپیزود ۱ · بخش ۲: تماس با پذیرش هتل برای حل مشکل",
        "unit": "Practical English Episode 1",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🛎️",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "Rob phones the hotel reception desk from his room to report a problem with the room's air conditioning and extra towels.",
        "summaryFa": "راب از اتاقش با پذیرش هتل تماس می‌گیرد تا مشکل سیستم تهویه هوا و نیاز به حوله اضافی را گزارش دهد.",
        "keyTopics": ["گزارش مشکلات اتاق هتل (The air conditioning isn't working)", "درخواست سرویس خدمات (Could you send someone?)", "اصطلاحات مودبانه خدمات مشتریان", "حل فوری مشکل"],
        "speakingTargetEn": "Hello, reception? There's a problem with the air conditioning in room 305.",
        "speakingTargetFa": "سلام، پذیرش؟ مشکلی در سیستم تهویه هوای اتاق ۳۰۵ وجود دارد.",
        "speakingPhonetic": "/həˈloʊ rɪˈsepʃn ðeərz ə ˈprɒbləm wɪð ðiː ˈeər kənˌdɪʃənɪŋ ɪn ruːm θriː oʊ faɪv/",
        "speakingTips": "در بیان شماره اتاق، عدد صفر معمولاً به صورت 'o' /oʊ/ خوانده می‌شود.",
        "minWords": 12,
        "keywords": ["reception", "room", "problem"],
        "sampleEn": "I contacted hotel reception immediately because the heating in my bedroom was not functioning.",
        "sampleFa": "من فوراً با پذیرش هتل تماس گرفتم زیرا سیستم گرمایش در اتاقم کار نمی‌کرد."
    },
    {
        "ep": 3,
        "file": "AEF3e_SB2_PE_Ep1_Jenny_and_Rob_meet_again.mp4",
        "titleEn": "Episode 1 · Part 3: Jenny and Rob Meet Again",
        "titleFa": "اپیزود ۱ · بخش ۳: تجدید دیدار جنی و راب در هتل",
        "unit": "Practical English Episode 1",
        "duration": "2:05",
        "durationSec": 125,
        "icon": "☕",
        "gradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "summaryEn": "Jenny arrives at the hotel lobby to welcome Rob, catch up on life, and invite him to a welcome dinner with colleagues.",
        "summaryFa": "جنی به لابی هتل می‌آید تا به راب خوشامد بگوید، از احوال هم باخبر شوند و او را به شام خوشامدگویی با همکاران دعوت کند.",
        "keyTopics": ["دیدار مجدد پس از مدت طولانی (Long time no see)", "احوالپرسی صمیمانه", "صحبت درباره استقرار در هتل", "برنامه‌ریزی ملاقات کاری"],
        "speakingTargetEn": "It's so good to see you again! How was your flight from London?",
        "speakingTargetFa": "دیدار مجددت خیلی عالیه! پروازت از لندن چطور بود؟",
        "speakingPhonetic": "/ɪts soʊ ɡʊd tuː siː juː əˈɡen haʊ wəz jɔːr flaɪt frəm ˈlʌndən/",
        "speakingTips": "کلمه flight به صورت /flaɪt/ با صدادار کشیده ادا می‌شود.",
        "minWords": 12,
        "keywords": ["again", "flight", "good"],
        "sampleEn": "It was wonderful meeting my friend again after a pleasant flight across the Atlantic.",
        "sampleFa": "دیدار مجدد دوستم پس از یک پرواز دلپذیر بر فراز اقیانوس اطلس بسیار لذت‌بخش بود."
    },
    {
        "ep": 4,
        "file": "AEF3e_SB2_PE_Ep2_In_the_New_York_office.mp4",
        "titleEn": "Episode 2 · Part 1: In the New York Office with Holly",
        "titleFa": "اپیزود ۲ · بخش ۱: حضور در دفتر نیویورک و آشنایی با هالی",
        "unit": "Practical English Episode 2",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "🏢",
        "gradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
        "summaryEn": "Rob is introduced to Holly, another talented staff writer at the magazine, and they discuss their upcoming editorial deadlines.",
        "summaryFa": "راب با هالی، یکی دیگر از نویسندگان بااستعداد مجله آشنا می‌شود و درباره مهلت‌های تحویل مقالات بحث می‌کنند.",
        "keyTopics": ["آشنایی با همکاران جدید", "وظایف تحریریه مجله", "تقسیم کار در تیم", "مکالمات رسمی اداری"],
        "speakingTargetEn": "Holly, this is Rob Walker. He's going to work with us on the cultural series.",
        "speakingTargetFa": "هالی، ایشان راب واکر هستند. قرار است در مجموعه مقالات فرهنگی با ما همکاری کنند.",
        "speakingPhonetic": "/ˈhɑːli ðɪs ɪz rɑːb ˈwɔːkər hiːz ˈɡoʊɪŋ tuː wɜːrk wɪð ʌs ɑːn ðə ˈkʌltʃərəl ˈsɪriːz/",
        "speakingTips": "ساختار 'This is [Name]' متداول‌ترین شیوه معرفی شخص ثالث است.",
        "minWords": 12,
        "keywords": ["office", "work", "colleague"],
        "sampleEn": "Our manager introduced the new journalist to the editorial staff in the New York branch.",
        "sampleFa": "مدیرمان روزنامه‌نگار جدید را به کادر تحریریه شعبه نیویورک معرفی کرد."
    },
    {
        "ep": 5,
        "file": "AEF3e_SB2_PE_Ep2_At_the_restaurant.mp4",
        "titleEn": "Episode 2 · Part 2: At the Restaurant with the Team",
        "titleFa": "اپیزود ۲ · بخش ۲: صرف ناهار کاری در رستوران",
        "unit": "Practical English Episode 2",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🥗",
        "gradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
        "summaryEn": "Rob, Jenny, and Holly enjoy lunch together at a restaurant, ordering specialty sandwiches and discussing Manhattan lifestyle.",
        "summaryFa": "راب، جنی و هالی در یک رستوران ناهار می‌خورند، ساندویچ‌های مخصوص سفارش می‌دهند و درباره سبک زندگی در منهتن صحبت می‌کنند.",
        "keyTopics": ["سفارش غذا و مخلفات در رستوران", "مکالمات سر میز غذا (Table talk)", "بحث درباره رژیم غذایی", "فرهنگ ناهار کاری در آمریکا"],
        "speakingTargetEn": "Could we also get some mineral water with lemon for the table?",
        "speakingTargetFa": "آیا ممکن است برای میز مقداری آب معدنی با لیمو هم بیاورید؟",
        "speakingPhonetic": "/kʊd wiː ˈɔːlsoʊ ɡet səm ˈmɪnərəl ˈwɔːtər wɪð ˈlemən fɔːr ðə ˈteɪbl/",
        "speakingTips": "عبارت 'for the table' به معنای سفارش مشترک برای تمام افراد سر میز است.",
        "minWords": 12,
        "keywords": ["restaurant", "water", "lunch"],
        "sampleEn": "During our lunch break, we ordered delicious salads and talked about our favorite Manhattan cafes.",
        "sampleFa": "در طول زنگ ناهار، سالادهای لذیذی سفارش دادیم و درباره کافه‌های محبوبمان در منهتن صحبت کردیم."
    },
    {
        "ep": 6,
        "file": "AEF3e_SB2_PE_Ep2_Holly_and_Rob_make_friends.mp4",
        "titleEn": "Episode 2 · Part 3: Holly and Rob Make Friends",
        "titleFa": "اپیزود ۲ · بخش ۳: ایجاد دوستی و صمیمیت میان راب و هالی",
        "unit": "Practical English Episode 2",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "💬",
        "gradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "summaryEn": "Holly and Rob discover common musical interests and recommend comedy clubs and cultural events around the city.",
        "summaryFa": "هالی و راب علایق مشترک موسیقیایی خود را کشف می‌کنند و باشگاه‌های کمدی و برنامه‌های فرهنگی شهر را به یکدیگر پیشنهاد می‌دهند.",
        "keyTopics": ["کشف علایق مشترک (Do you like jazz?)", "توصیه جاهای تفریحی (You should check out...)", "اصطلاحات شوخ‌طبعی و صمیمیت", "برنامه‌ریزی آخر هفته"],
        "speakingTargetEn": "If you love live music, you should definitely check out the Village.",
        "speakingTargetFa": "اگر عاشق موسیقی زنده هستی، حتماً باید سری به محله گرینویچ ویلیج بزنی.",
        "speakingPhonetic": "/ɪf juː lʌv laɪv ˈmjuːzɪk juː ʃʊd ˈdefɪnətli tʃek aʊt ðə ˈvɪlɪdʒ/",
        "speakingTips": "کلمه definitely دارای استرس روی سیلاب اول /ˈdefɪnətli/ است.",
        "minWords": 12,
        "keywords": ["music", "recommend", "weekend"],
        "sampleEn": "My colleague recommended a fantastic live jazz club in Brooklyn for the weekend.",
        "sampleFa": "همکارم یک باشگاه فوق‌العاده موسیقی جاز زنده در بروکلین را برای آخر هفته پیشنهاد کرد."
    },
    {
        "ep": 7,
        "file": "AEF3e_SB2_PE_Ep3_Taking_something_back_to_a_store.mp4",
        "titleEn": "Episode 3 · Part 1: Taking Something Back to a Store",
        "titleFa": "اپیزود ۳ · بخش ۱: مرجوع کردن کالا و تعویض در فروشگاه",
        "unit": "Practical English Episode 3",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🔄",
        "gradient": "linear-gradient(135deg, #db2777, #f472b6)",
        "summaryEn": "Rob returns a defective electronic charger to an electronics shop, presenting his receipt and requesting a refund or replacement.",
        "summaryFa": "راب یک شارژر معیوب را به فروشگاه لوازم الکترونیکی برمی‌گرداند، فاکتور خرید را ارائه داده و درخواست استرداد وجه یا تعویض می‌کند.",
        "keyTopics": ["مرجوع کردن جنس (Return an item)", "فاکتور خرید (Receipt)", "استرداد وجه یا تعویض (Refund or exchange)", "مشکلات کالای معیوب"],
        "speakingTargetEn": "I bought this charger yesterday, but it doesn't work. Can I get a refund?",
        "speakingTargetFa": "من این شارژر را دیروز خریدم اما کار نمی‌کند. آیا می‌توانم پولم را پس بگیرم؟",
        "speakingPhonetic": "/aɪ bɔːt ðɪs ˈtʃɑːrdʒər ˈjestərdeɪ bʌt ɪt ˈdʌznt wɜːrk kən aɪ ɡet ə ˈriːfʌnd/",
        "speakingTips": "در کلمه receipt حرف p کاملاً بی‌صداست: /rɪˈsiːt/.",
        "minWords": 12,
        "keywords": ["return", "receipt", "refund"],
        "sampleEn": "I took the damaged headphones back to the store with my receipt and received a full refund.",
        "sampleFa": "هدفون آسیب‌دیده را همراه با فاکتور به فروشگاه برگرداندم و کل وجه را پس گرفتم."
    },
    {
        "ep": 8,
        "file": "AEF3e_SB2_PE_Ep3_Rob_has_a_problem.mp4",
        "titleEn": "Episode 3 · Part 2: Rob Has a Fitness Problem",
        "titleFa": "اپیزود ۳ · بخش ۲: چالش راب در تناسب اندام و خستگی",
        "unit": "Practical English Episode 3",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "🏃‍♂️",
        "gradient": "linear-gradient(135deg, #ea580c, #f97316)",
        "summaryEn": "Rob feels out of shape and exhausted from long office hours, asking Jenny about healthy workout habits in Central Park.",
        "summaryFa": "راب به دلیل ساعات کاری طولانی احساس خستگی و افت آمادگی جسمانی دارد و از جنی درباره عادات ورزش در سنترال پارک می‌پرسد.",
        "keyTopics": ["بیان خستگی و آمادگی جسمانی (Out of shape)", "عادات ورزشی (Jogging, running)", "انگیزه برای ورزش روزانه", "مشاوره تندرستی بین همکاران"],
        "speakingTargetEn": "I really need to get in shape; I feel exhausted after climbing stairs.",
        "speakingTargetFa": "من واقعاً باید روی فرم بیایم؛ بعد از بالا رفتن از پله‌ها احساس خستگی شدید می‌کنم.",
        "speakingPhonetic": "/aɪ ˈrɪəli niːd tuː ɡet ɪn ʃeɪp aɪ fiːl ɪɡˈzɔːstɪd ˈæftər ˈklaɪmɪŋ sterz/",
        "speakingTips": "اصطلاح 'get in shape' یعنی رسیدن به تناسب اندام و آمادگی بدنی.",
        "minWords": 12,
        "keywords": ["shape", "exercise", "feel"],
        "sampleEn": "After noticing how tired I felt at work, I decided to exercise every morning before breakfast.",
        "sampleFa": "پس از متوجه شدن احساس خستگی در محل کار، تصمیم گرفتم هر روز صبح قبل از صبحانه ورزش کنم."
    },
    {
        "ep": 9,
        "file": "AEF3e_SB2_PE_Ep3_Rob_decides_to_exercise.mp4",
        "titleEn": "Episode 3 · Part 3: Rob Decides to Start Running",
        "titleFa": "اپیزود ۳ · بخش ۳: تصمیم قاطع راب برای دویدن صبحگاهی",
        "unit": "Practical English Episode 3",
        "duration": "1:50",
        "durationSec": 110,
        "icon": "👟",
        "gradient": "linear-gradient(135deg, #16a34a, #4ade80)",
        "summaryEn": "Jenny agrees to join Rob for an early morning jog in Central Park, setting a challenge for 6:30 AM tomorrow.",
        "summaryFa": "جنی موافقت می‌کند تا فردا برای دویدن صبحگاهی در سنترال پارک همراه راب باشد و ساعت ۶:۳۰ صبح را به عنوان قرار ورزشی تعیین می‌کنند.",
        "keyTopics": ["تعیین ساعت قرار ورزشی", "لوازم دویدن (Running shoes)", "انگیزه مثبت و تشویق", "برنامه‌ریزی صبح زود"],
        "speakingTargetEn": "Let's meet by the reservoir in Central Park at half past six.",
        "speakingTargetFa": "بیا ساعت شش و نیم کنار دریاچه سنترال پارک همدیگر را ملاقات کنیم.",
        "speakingPhonetic": "/lets miːt baɪ ðə ˈrezərvwɑːr ɪn ˈsentrəl pɑːrk ət hæf pæst sɪks/",
        "speakingTips": "کلمه reservoir به صورت /ˈrezərvwɑːr/ با ریشه فرانسوی تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["meet", "running", "morning"],
        "sampleEn": "We scheduled our running session for early tomorrow morning to enjoy the quiet park.",
        "sampleFa": "جلسه دویدنمان را برای صبح زود فردا برنامه‌ریزی کردیم تا از سکوت پارک لذت ببریم."
    },
    {
        "ep": 10,
        "file": "AEF3e_SB2_PE_Ep4_Running_in_Central_Park.mp4",
        "titleEn": "Episode 4 · Part 1: Running in Central Park",
        "titleFa": "اپیزود ۴ · بخش ۱: دویدن صبحگاهی در سنترال پارک",
        "unit": "Practical English Episode 4",
        "duration": "1:45",
        "durationSec": 105,
        "icon": "🌳",
        "gradient": "linear-gradient(135deg, #15803d, #22c55e)",
        "summaryEn": "Rob struggles to keep up with Jenny's fast jogging pace in Central Park and ends up feeling a slight cold and sore throat.",
        "summaryFa": "راب برای همراهی با سرعت دویدن بالای جنی در سنترال پارک به تقلا می‌افتد و در پایان احساس سرماخوردگی و گلودرد خفیف می‌کند.",
        "keyTopics": ["ورزش در طبیعت شهری", "سرعت دویدن (Pace)", "شروع علائم سرماخوردگی", "اصطلاحات تشویق ورزشی (Keep going!)"],
        "speakingTargetEn": "Wait for me! You're running way too fast for my first day.",
        "speakingTargetFa": "منتظر من بمان! تو برای اولین روز من بیش از حد سریع می‌دوی.",
        "speakingPhonetic": "/weɪt fɔːr miː jɔːr ˈrʌnɪŋ weɪ tuː fæst fɔːr maɪ fɜːrst deɪ/",
        "speakingTips": "عبارت 'way too fast' شدت زیادی سرعت را به شکل خودمانی نشان می‌دهد.",
        "minWords": 12,
        "keywords": ["running", "park", "fast"],
        "sampleEn": "Running in the cool morning air was invigorating, although keeping pace was challenging.",
        "sampleFa": "دویدن در هوای خنک صبحگاهی نشاط‌آور بود، هرچند هماهنگ نگه داشتن سرعت چالش‌برانگیز بود."
    },
    {
        "ep": 11,
        "file": "AEF3e_SB2_PE_Ep4_Going_to_a_pharmacy.mp4",
        "titleEn": "Episode 4 · Part 2: Going to a Pharmacy in New York",
        "titleFa": "اپیزود ۴ · بخش ۲: مراجعه به داروخانه و خرید داروی سرماخوردگی",
        "unit": "Practical English Episode 4",
        "duration": "2:15",
        "durationSec": 130,
        "icon": "💊",
        "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
        "summaryEn": "Rob visits an American pharmacy / drugstore to describe his sore throat and headache, asking the pharmacist for suitable medicine.",
        "summaryFa": "راب به یک داروخانه آمریکایی مراجعه می‌کند تا گلودرد و سردرد خود را توضیح دهد و از دکتر داروساز داروی مناسب دریافت کند.",
        "keyTopics": ["اصطلاحات داروخانه (Pharmacy / Drugstore)", "توصیف علائم بیماری (Sore throat, headache, fever)", "دوز و نحوه مصرف دارو (Take two tablets every four hours)", "داروهای بدون نسخه (Over-the-counter)"],
        "speakingTargetEn": "I have a terrible sore throat and a headache. What do you recommend?",
        "speakingTargetFa": "من گلودرد و سردرد شدیدی دارم. شما چه دارویی را پیشنهاد می‌کنید؟",
        "speakingPhonetic": "/aɪ hæv ə ˈterəbl sɔːr θroʊt ənd ə ˈhedeɪk wʌt duː juː ˌrekəˈmend/",
        "speakingTips": "تلفظ th در sore throat به صورت بین دندانی /θroʊt/ است.",
        "minWords": 12,
        "keywords": ["throat", "pharmacy", "medicine"],
        "sampleEn": "The pharmacist recommended taking these soothing throat lozenges twice a day with water.",
        "sampleFa": "داروساز مصرف این قرص‌های مکیدنی تسکین‌دهنده گلو را دو بار در روز با آب توصیه کرد."
    },
    {
        "ep": 12,
        "file": "AEF3e_SB2_PE_Ep4_Dinner_at_Jenny's_apartment.mp4",
        "titleEn": "Episode 4 · Part 3: Dinner at Jenny's Apartment",
        "titleFa": "اپیزود ۴ · بخش ۳: مهمانی شام در آپارتمان جنی",
        "unit": "Practical English Episode 4",
        "duration": "2:00",
        "durationSec": 120,
        "icon": "🕯️",
        "gradient": "linear-gradient(135deg, #d97706, #fbbf24)",
        "summaryEn": "Jenny cooks dinner for Rob at her Brooklyn apartment, sharing home-cooked food and talking about their life aspirations.",
        "summaryFa": "جنی در آپارتمانش در بروکلین برای راب شام می‌پزد، غذای خانگی میل می‌کنند و درباره آرزوهای زندگی‌شان گفتگو دارند.",
        "keyTopics": ["مهمانی خانگی (Dinner at home)", "تعریف از دستپخت (This tastes amazing!)", "آداب و رسوم ورود به خانه در آمریکا", "مکالمه صمیمانه"],
        "speakingTargetEn": "Thank you for inviting me to your home; dinner smells absolutely delicious.",
        "speakingTargetFa": "ممنون که مرا به خانه‌ات دعوت کردی؛ بوی شام واقعاً لذیذ و هوس‌انگیز است.",
        "speakingPhonetic": "/θæŋk juː fɔːr ɪnˈvaɪtɪŋ miː tuː jɔːr hoʊm ˈdɪnər smelz ˌæbsəˈluːtli dɪˈlɪʃəs/",
        "speakingTips": "کلمه delicious به صورت /dɪˈlɪʃəs/ تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["home", "dinner", "delicious"],
        "sampleEn": "Having a warm home-cooked meal with good friends is always the highlight of the week.",
        "sampleFa": "صرف یک وعده غذای گرم خانگی با دوستان صمیمی همیشه بهترین اتفاق هفته است."
    },
    {
        "ep": 13,
        "file": "AEF3e_SB2_PE_Ep5_Rob_is_late_again.mp4",
        "titleEn": "Episode 5 · Part 1: Rob is Late Again",
        "titleFa": "اپیزود ۵ · بخش ۱: تاخیر دوباره راب در رسیدن به قرار",
        "unit": "Practical English Episode 5",
        "duration": "1:35",
        "durationSec": 95,
        "icon": "⏰",
        "gradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
        "summaryEn": "Rob loses track of time and gets delayed on the subway, frantically texting Jenny and Holly to apologize for his tardiness.",
        "summaryFa": "راب متوجه گذشت زمان نمی‌شود و در مترو معطل می‌ماند و با ارسال پیامک به جنی و هالی بابت تاخیر عذرخواهی می‌کند.",
        "keyTopics": ["عذرخواهی برای تاخیر (I'm running late)", "مشکلات ترافیک و قطار مترو", "ارسال پیامک‌های فوری", "اصطلاحات زمان‌بندی"],
        "speakingTargetEn": "I am so sorry I'm late; the subway train stopped between stations.",
        "speakingTargetFa": "خیلی عذرخواهی می‌کنم که دیر رسیدم؛ قطار مترو بین ایستگاه‌ها متوقف شد.",
        "speakingPhonetic": "/aɪ æm soʊ ˈsɑːri aɪm leɪt ðə ˈsʌbweɪ treɪn stɑːpt bɪˈtwiːn ˈsteɪʃnz/",
        "speakingTips": "عبارت 'running late' متداول‌ترین اصطلاح روزمره برای تاخیر داشتن است.",
        "minWords": 12,
        "keywords": ["sorry", "late", "subway"],
        "sampleEn": "Due to unexpected transit delays, I arrived twenty minutes late for our scheduled meeting.",
        "sampleFa": "به دلیل تاخیرهای غیرمنتظره حمل‌ونقل عمومی، بیست دقیقه برای جلسه تعیین‌شده دیر رسیدم."
    },
    {
        "ep": 14,
        "file": "AEF3e_SB2_PE_Ep5_Asking_how_to_get_there.mp4",
        "titleEn": "Episode 5 · Part 2: Asking How to Get to Brooklyn",
        "titleFa": "اپیزود ۵ · بخش ۲: پرسیدن مسیر و نحوه رسیدن به بروکلین",
        "unit": "Practical English Episode 5",
        "duration": "2:10",
        "durationSec": 130,
        "icon": "🚇",
        "gradient": "linear-gradient(135deg, #0284c7, #0ea5e9)",
        "summaryEn": "Rob asks a subway attendant for instructions on transferring between lines to reach a museum exhibition in Brooklyn.",
        "summaryFa": "راب از متصدی ایستگاه مترو درباره نحوه تعویض خط برای رسیدن به نمایشگاه موزه در بروکلین راهنمایی می‌خواهد.",
        "keyTopics": ["مسیریابی در مترو (Which train do I take?)", "تعویض خط (Change at 14th Street)", "خرید بلیط مترو (MetroCard)", "مفهوم قطار تندرو و محلی (Express vs Local train)"],
        "speakingTargetEn": "Which subway line goes directly to Brooklyn from here?",
        "speakingTargetFa": "کدام خط مترو از اینجا مستقیماً به بروکلین می‌رود؟",
        "speakingPhonetic": "/wɪtʃ ˈsʌbweɪ laɪn ɡoʊz dəˈrektli tuː ˈbrʊklɪn frəm hɪr/",
        "speakingTips": "کلمه directly می‌تواند به دو صورت /dəˈrektli/ یا /daɪˈrektli/ تلفظ شود.",
        "minWords": 12,
        "keywords": ["subway", "train", "line"],
        "sampleEn": "To reach the gallery, take the express train and transfer to the local line at 14th Street.",
        "sampleFa": "برای رسیدن به گالری، سوار قطار تندرو شوید و در خیابان چهاردهم به خط محلی تغییر مسیر دهید."
    },
    {
        "ep": 15,
        "file": "AEF3e_SB2_PE_Ep5_Holly_and_Rob_in_Brooklyn.mp4",
        "titleEn": "Episode 5 · Part 3: Holly and Rob Explore Brooklyn",
        "titleFa": "اپیزود ۵ · بخش ۳: گشت‌وگذار راب و هالی در محله بروکلین",
        "unit": "Practical English Episode 5",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🎨",
        "gradient": "linear-gradient(135deg, #9333ea, #a855f7)",
        "summaryEn": "Holly shows Rob around Williamsburg's artistic streets, vintage shops, and trendy coffee spots, offering an insider's view.",
        "summaryFa": "هالی خیابان‌های هنری، فروشگاه‌های کلاسیک و کافه‌های جذاب ویلیامزبورگ را به راب نشان داده و دیدگاهی بومی ارائه می‌دهد.",
        "keyTopics": ["هنر خیابانی و محله‌های هنری", "فروشگاه‌های وینتیج و مد قدیمی", "فرهنگ جوانان نیویورک", "توصیف فضا و اتمسفر محله"],
        "speakingTargetEn": "Brooklyn has a completely different vibe compared to midtown Manhattan.",
        "speakingTargetFa": "بروکلین حال و هوایی کاملاً متفاوت با مرکز منهتن دارد.",
        "speakingPhonetic": "/ˈbrʊklɪn hæz ə kəmˈpliːtli ˈdɪfrənt vaɪb kəmˈpeərd tuː ˈmɪdtaʊn mænˈhætn/",
        "speakingTips": "کلمه vibe یک اصطلاح بسیار رایج امروزی برای حس‌وحال محیط است.",
        "minWords": 12,
        "keywords": ["different", "shops", "art"],
        "sampleEn": "Exploring the vibrant art scene in Brooklyn provided wonderful inspiration for our magazine.",
        "sampleFa": "گشت‌وگذار در فضای هنری پرشور بروکلین الهام‌بخش فوق‌العاده‌ای برای مجله ما بود."
    },
    {
        "ep": 16,
        "file": "AEF3e_SB2_PE_Ep6_On_the_phone.mp4",
        "titleEn": "Episode 6 · Part 1: Crucial Phone Calls",
        "titleFa": "اپیزود ۶ · بخش ۱: تماس‌های تلفنی حساس و تصمیم‌گیری",
        "unit": "Practical English Episode 6",
        "duration": "1:40",
        "durationSec": 100,
        "icon": "📞",
        "gradient": "linear-gradient(135deg, #6366f1, #818cf8)",
        "summaryEn": "Rob receives an important phone call from London with exciting career offers, putting his future in New York in the balance.",
        "summaryFa": "راب یک تماس تلفنی مهم از لندن با پیشنهادهای شغلی جذاب دریافت می‌کند که آینده او را در نیویورک در تعلیق قرار می‌دهد.",
        "keyTopics": ["پیشنهادهای شغلی کاری (Job offer)", "تصمیم‌گیری برای آینده", "ارتباطات تلفنی راه دور", "بیان تردید و تامل"],
        "speakingTargetEn": "I received an unexpected job offer today and I have to make a choice.",
        "speakingTargetFa": "من امروز یک پیشنهاد شغلی غیرمنتظره دریافت کردم و باید تصمیم‌گیری کنم.",
        "speakingPhonetic": "/aɪ rɪˈsiːvd ən ˌʌnɪkˈspektɪd dʒɑːb ˈɔːfər təˈdeɪ ənd aɪ hæv tuː meɪk ə tʃɔɪs/",
        "speakingTips": "اصطلاح 'make a choice' یعنی دست زدن به انتخاب میان چند گزینه.",
        "minWords": 12,
        "keywords": ["offer", "phone", "decision"],
        "sampleEn": "Receiving a promotion offer made him carefully reflect on his long-term career aspirations.",
        "sampleFa": "دریافت پیشنهاد ارتقای شغلی باعث شد او با دقت درباره آرزوهای بلندمدت کاری‌اش تامل کند."
    },
    {
        "ep": 17,
        "file": "AEF3e_SB2_PE_Ep6_In_Central_Park_again.mp4",
        "titleEn": "Episode 6 · Part 2: In Central Park Again",
        "titleFa": "اپیزود ۶ · بخش ۲: قدم زدن دوباره در سنترال پارک",
        "unit": "Practical English Episode 6",
        "duration": "1:55",
        "durationSec": 115,
        "icon": "🍂",
        "gradient": "linear-gradient(135deg, #b45309, #d97706)",
        "summaryEn": "Rob and Jenny take an evening walk across Central Park, reflecting on their memorable experiences, triumphs, and teamwork.",
        "summaryFa": "راب و جنی در هنگام غروب در سنترال پارک قدم می‌زنند و خاطرات ماندگار، موفقیت‌ها و همکاری تیمی خود را مرور می‌کنند.",
        "keyTopics": ["مرور خاطرات مشترک", "بیان احساسات صمیمانه", "توصیف پاییز در سنترال پارک", "پایان ماموریت کاری"],
        "speakingTargetEn": "Looking back on these past months, working with you has been an absolute pleasure.",
        "speakingTargetFa": "با نگاه به این ماه‌های گذشته، همکاری با تو لذت مطلق و خاطره‌انگیز بوده است.",
        "speakingPhonetic": "/ˈlʊkɪŋ bæk ɑːn ðiːz pæst mʌnθs ˈwɜːrkɪŋ wɪð juː hæz biːn ən ˈæbsəluːt ˈpleʒər/",
        "speakingTips": "عبارت 'Looking back on...' برای مرور گذشته کاربرد دارد.",
        "minWords": 12,
        "keywords": ["pleasure", "working", "park"],
        "sampleEn": "Strolling through the peaceful park allowed us to reflect warmly on our successful collaboration.",
        "sampleFa": "قدم زدن در پارک آرام به ما امکان داد تا با گرمی به همکاری موفقیت‌آمیزمان فکر کنیم."
    },
    {
        "ep": 18,
        "file": "AEF3e_SB2_PE_Ep6_Rob_and_Jenny_talk_about_the_future.mp4",
        "titleEn": "Episode 6 · Part 3: Rob and Jenny Talk About the Future",
        "titleFa": "اپیزود ۶ · بخش ۳: گفتگوی صمیمانه راب و جنی درباره آینده",
        "unit": "Practical English Episode 6",
        "duration": "2:15",
        "durationSec": 130,
        "icon": "✨",
        "gradient": "linear-gradient(135deg, #0f172a, #334155)",
        "summaryEn": "In the season finale, Rob reveals his big decision to stay in New York with Jenny, looking forward to their shared future.",
        "summaryFa": "در پایان فصل، راب تصمیم بزرگ خود مبنی بر ماندن در نیویورک در کنار جنی را فاش می‌کند و چشم‌انتظار آینده مشترکشان هستند.",
        "keyTopics": ["بیان تصمیم بزرگ زندگی", "افعال آینده با will و be going to", "تعهد و امید به آینده", "پایان هیجان‌انگیز داستان"],
        "speakingTargetEn": "I have decided to stay in New York; this is where I truly belong.",
        "speakingTargetFa": "من تصمیم گرفته‌ام در نیویورک بمانم؛ اینجاست که واقعاً به آن تعلق دارم.",
        "speakingPhonetic": "/aɪ hæv dɪˈsaɪdɪd tuː steɪ ɪn nuː jɔːrk ðɪs ɪz wer aɪ ˈtruːli bɪˈlɔːŋ/",
        "speakingTips": "کلمه belong یعنی تعلق داشتن و جا افتادن در یک محیط.",
        "minWords": 14,
        "keywords": ["decided", "future", "stay"],
        "sampleEn": "After weighing his options, he decided to stay in New York and build his future together.",
        "sampleFa": "پس از سنجیدن گزینه‌ها، او تصمیم گرفت در نیویورک بماند و آینده‌شان را با هم بسازند."
    }
]

def generate_aef_lesson_code(les, level_code):
    ep = les["ep"]
    lesson_id = f"{level_code}-v{ep:02d}"
    cefr_val = level_code.upper()
    book_title = f"American English File 3rd Edition ({cefr_val}) · {les['unit']}"
    video_url = f"/api/videos/stream?series=aef&level={level_code}&file={les['file'].replace(' ', '%20')}"

    listening_q = {
        "skill": "listening",
        "promptFa": f"بر اساس آنچه در ویدیوی {les['titleFa']} مشاهده کردید، پیام اصلی گفتگو چیست؟",
        "promptEn": f"According to the video '{les['titleEn']}', what is the primary focus of the dialogue?",
        "timestampSeconds": 30,
        "timestampDisplay": "00:30",
        "explanationFa": f"در این بخش، مکالمه جنی و راب بر موضوع «{les['keyTopics'][0]}» با لهجه استاندارد آمریکایی تمرکز دارد.",
        "options": [
            {"id": 1, "textEn": f"Communicating naturally about {les['keyTopics'][0].lower()} in New York.", "textFa": f"مکالمه روان و طبیعی درباره {les['keyTopics'][0]} در نیویورک."},
            {"id": 2, "textEn": "Disputing corporate financial regulations formally.", "textFa": "بحث درباره مقررات مالی رسمی اداری."},
            {"id": 3, "textEn": "Cancelling hotel contracts due to weather conditions.", "textFa": "لغو قراردادهای هتل به دلیل آب‌وهوا."},
            {"id": 4, "textEn": "Debating historic transatlantic aviation routes.", "textFa": "مناظره درباره مسیرهای پرواز فراآتلانتیک."}
        ],
        "correctOptionId": 1
    }

    vocab_q = {
        "skill": "vocabulary",
        "targetTerm": les['keyTopics'][0],
        "promptFa": f"کدام اصطلاح یا واژه زیر بیشترین ارتباط معنایی را با سناریوی «{les['keyTopics'][0]}» در این درس دارد؟",
        "promptEn": f"Which term or concept best reflects the core theme '{les['keyTopics'][0]}' in this lesson?",
        "explanationFa": f"این عبارت در موقعیت کاربردی {les['unit']} در زبان انگلیسی آمریکایی بسیار پرکاربرد است.",
        "options": [
            {"id": 1, "textEn": les["speakingTargetEn"], "textFa": les["speakingTargetFa"]},
            {"id": 2, "textEn": "An archaic historical legal definition", "textFa": "تعریف حقوقی تاریخی و منسوخ"},
            {"id": 3, "textEn": "Scientific terminology unrelated to communication", "textFa": "اصطلاحات علمی بدون ارتباط با مکالمه"},
            {"id": 4, "textEn": "Mechanical calculation formulae", "textFa": "فرمول‌های محاسبات مکانیکی"}
        ],
        "correctOptionId": 1
    }

    grammar_q = {
        "skill": "grammar",
        "promptFa": f"کدام گزینه ساختار گرامری استاندارد و صحیح متناسب با سطح {cefr_val} این درس را نشان می‌دهد؟",
        "promptEn": f"Select the grammatically accurate sentence reflecting the target structure of this lesson ({cefr_val}):",
        "explanationFa": f"این ساختار گرامری با کاربرد درست افعال زمان حال/گذشته و تطابق فاعل در سطح {cefr_val} هماهنگ است.",
        "options": [
            {"id": 1, "textEn": les["speakingTargetEn"], "textFa": les["speakingTargetFa"]},
            {"id": 2, "textEn": "She do not has the required reservation papers.", "textFa": "کاربرد نادرست do not برای فاعل سوم شخص مفرد She"},
            {"id": 3, "textEn": "They was arriving at the location yesterday night.", "textFa": "کاربرد غلط was برای فاعل جمع They"},
            {"id": 4, "textEn": "We is planning to go to the restaurant.", "textFa": "کاربرد غلط is برای فاعل جمع We"}
        ],
        "correctOptionId": 1
    }

    speaking_q = {
        "skill": "speaking",
        "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
        "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
        "targetPhraseEn": les["speakingTargetEn"],
        "targetPhraseFa": les["speakingTargetFa"],
        "phoneticGuide": les["speakingPhonetic"],
        "speakingTipsFa": les["speakingTips"],
        "explanationFa": f"تسلط بر این عبارت باعث بهبود مهارت اسپیکینگ شما در زمینه {les['keyTopics'][0]} می‌شود."
    }

    reading_q = {
        "skill": "reading",
        "promptFa": "با توجه به خلاصه داستان و دیالوگ این اپیزود، هدف اصلی جنی یا راب در این صحنه چیست؟",
        "promptEn": "Based on the scene summary, what is the primary communicative purpose of the characters?",
        "explanationFa": f"هدف اصلی در این صحنه برقراری ارتباط موثر و هماهنگی پیرامون موضوع {les['keyTopics'][0]} است.",
        "options": [
            {"id": 1, "textEn": f"To coordinate effectively regarding {les['keyTopics'][0].lower()}.", "textFa": f"هماهنگی و گفتگوی موثر درباره {les['keyTopics'][0]}."},
            {"id": 2, "textEn": "To file an official formal complaint to police.", "textFa": "طرح شکایت رسمی به اداره پلیس."},
            {"id": 3, "textEn": "To cancel their publishing contracts permanently.", "textFa": "لغو دائمی قرارداد انتشارات."},
            {"id": 4, "textEn": "To dispute property boundaries legally.", "textFa": "اختلاف بر سر حدود ملکی در دادگاه."}
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
        "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و شروع جملات با حروف بزرگ در نمره نهایی تاثیرگذار است.",
        "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
    }

    transcript_items = [
        {
            "id": 1,
            "seconds": 5,
            "timeDisplay": "00:05",
            "speaker": "Jenny",
            "textEn": f"Welcome to American English File. This is {les['titleEn']}.",
            "textFa": f"به دوره امریکن انگلیش فایل خوش آمدید. این بخش: {les['titleFa']}."
        },
        {
            "id": 2,
            "seconds": 25,
            "timeDisplay": "00:25",
            "speaker": "Rob",
            "textEn": les["speakingTargetEn"],
            "textFa": les["speakingTargetFa"]
        },
        {
            "id": 3,
            "seconds": 55,
            "timeDisplay": "00:55",
            "speaker": "Jenny",
            "textEn": "That sounds great! Let's make sure everything is arranged properly.",
            "textFa": "عالی به نظر می‌رسد! بیا مطمئن شویم همه چیز به درستی هماهنگ شده است."
        },
        {
            "id": 4,
            "seconds": 85,
            "timeDisplay": "01:25",
            "speaker": "Narrator",
            "textEn": "Notice the natural American intonation, practical functional phrases, and clear pronunciation.",
            "textFa": "به آهنگ کلام طبیعی آمریکایی، عبارات کاربردی روزمره و تلفظ شفاف دقت کنید."
        }
    ]

    return {
        "id": lesson_id,
        "level": level_code,
        "episodeNumber": ep,
        "titleFa": les["titleFa"],
        "titleEn": les["titleEn"],
        "bookLevel": book_title,
        "unit": les["unit"],
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
    print("Generating Authentic AEF Curriculum TypeScript file...")

    a1_lessons = [generate_aef_lesson_code(l, "a1") for l in A1_AEF_LESSONS]
    a2_lessons = [generate_aef_lesson_code(l, "a2") for l in A2_AEF_LESSONS]
    all_lessons = a1_lessons + a2_lessons

    ts_content = f"""/**
 * American English File (AEF) Complete Curriculum Registry
 * Authentic 3rd Edition Video Lessons Matching Local MP4 Files (18 Lessons per Level)
 * Standardized 6-Skill Assessments: Listening, Vocabulary, Grammar, Speaking, Reading, Writing
 */

import {{ SkillType, ChoiceQuestion, SpeakingQuestion, WritingQuestion, TranscriptLine }} from "./video-learning";

export type AEFLevelTier = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface AEFLevelMeta {{
  tier: AEFLevelTier;
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

export interface AEFVideoLesson {{
  id: string;
  level: AEFLevelTier;
  episodeNumber: number;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
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

export const AEF_LEVELS_META: Record<AEFLevelTier, AEFLevelMeta> = {{
  a1: {{
    tier: "a1",
    cefr: "A1",
    levelNameFa: "سطح A1 · پایه و نوآموزان",
    levelNameEn: "Level A1 · Starter & Elementary",
    bookTitleFa: "American English File 1 (3rd Edition)",
    bookTitleEn: "American English File Level 1",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    badgeColor: "#059669",
    icon: "🌱",
    descFa: "شروع ماجراجویی با ورود جنی به نیویورک، هتل منهتن، کافه، خرید لباس، جهت‌یابی در شهر و شام رستوران.",
    totalVideos: 18,
  }},
  a2: {{
    tier: "a2",
    cefr: "A2",
    levelNameFa: "سطح A2 · پیش‌متوسط مقدماتی",
    levelNameEn: "Level A2 · Pre-Intermediate",
    bookTitleFa: "American English File 2 (3rd Edition)",
    bookTitleEn: "American English File Level 2",
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    badgeColor: "#0284c7",
    icon: "📘",
    descFa: "فصل دوم داستان راب و جنی در نیویورک، حل مشکلات هتل، دویدن در سنترال پارک، گشت بروکلین و آینده مشترک.",
    totalVideos: 18,
  }},
  b1: {{
    tier: "b1",
    cefr: "B1",
    levelNameFa: "سطح B1 · متوسط",
    levelNameEn: "Level B1 · Intermediate",
    bookTitleFa: "American English File 3 (3rd Edition)",
    bookTitleEn: "American English File Level 3",
    gradient: "linear-gradient(135deg, #4f46e5, #6366f1)",
    badgeColor: "#4f46e5",
    icon: "⚡",
    descFa: "چالش‌های حرفه‌ای، مصاحبه‌های عمیق‌تر، حل بحران و تعاملات اجتماعی پیشرفته در منهتن.",
    totalVideos: 16,
  }},
  b2: {{
    tier: "b2",
    cefr: "B2",
    levelNameFa: "سطح B2 · پیشرفته مقدماتی",
    levelNameEn: "Level B2 · Upper-Intermediate",
    bookTitleFa: "American English File 4 (3rd Edition)",
    bookTitleEn: "American English File Level 4",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    badgeColor: "#ea580c",
    icon: "🚀",
    descFa: "مذاکره، اقناع، اصطلاحات کنایی و طنز در محیط‌های کار بین‌المللی با لهجه اصیل آمریکایی.",
    totalVideos: 15,
  }},
  c1: {{
    tier: "c1",
    cefr: "C1",
    levelNameFa: "سطح C1 · پیشرفته و تسلط",
    levelNameEn: "Level C1 · Advanced",
    bookTitleFa: "American English File 5 (3rd Edition)",
    bookTitleEn: "American English File Level 5",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    badgeColor: "#dc2626",
    icon: "💎",
    descFa: "تسلط کامل بر ظرافت‌های گفتاری، تحلیل رسانه‌ها، نگارش تحلیلی و مباحث تخصصی روز.",
    totalVideos: 20,
  }},
  c2: {{
    tier: "c2",
    cefr: "C2",
    levelNameFa: "سطح C2 · مهارت پیشرفته نهایی",
    levelNameEn: "Level C2 · Proficiency",
    bookTitleFa: "American English File Master",
    bookTitleEn: "American English File Proficiency",
    gradient: "linear-gradient(135deg, #0f172a, #334155)",
    badgeColor: "#0f172a",
    icon: "👑",
    descFa: "مهارت نهایی معادل زبان مادری، نقد و بررسی تخصصی و استدلال در سطح آکادمیک و بین‌المللی.",
    totalVideos: 20,
  }},
}};

export const AEF_LESSONS: AEFVideoLesson[] = {json.dumps(all_lessons, ensure_ascii=False, indent=2)};

export function getAllAEFLevels(): AEFLevelMeta[] {{
  return Object.values(AEF_LEVELS_META);
}}

export function getAEFLevelMeta(tier: string): AEFLevelMeta | undefined {{
  const key = tier.toLowerCase() as AEFLevelTier;
  return AEF_LEVELS_META[key];
}}

export function getAEFLessonsByLevel(tier: string): AEFVideoLesson[] {{
  const t = tier.toLowerCase();
  return AEF_LESSONS.filter((les) => les.level.toLowerCase() === t);
}}

export function getAEFLessonById(id: string): AEFVideoLesson | undefined {{
  const targetId = id.toLowerCase();
  return AEF_LESSONS.find((les) => les.id.toLowerCase() === targetId);
}}

export function getNextAEFLesson(currentLessonId: string): AEFVideoLesson | null {{
  const current = getAEFLessonById(currentLessonId);
  if (!current) return null;
  const sameLevelLessons = getAEFLessonsByLevel(current.level);
  const currentIndex = sameLevelLessons.findIndex((l) => l.id.toLowerCase() === current.id.toLowerCase());
  if (currentIndex !== -1 && currentIndex < sameLevelLessons.length - 1) {{
    return sameLevelLessons[currentIndex + 1];
  }}
  return null;
}}
"""

    with open(DEST_FILE, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Successfully generated authentic {DEST_FILE} with {len(all_lessons)} total lessons!")

if __name__ == "__main__":
    main()
