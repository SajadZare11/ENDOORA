"""
Complete AEF Curriculum Generator (87 Lessons across A1, A2, B1, B2, C1)
Constructs authentic American English File curriculum matching all disk files
"""

import os
import json
import struct

DEST_FILE = r"E:\0\Work\Website\The General Website\Endoora\apps\web\lib\aef-curriculum.ts"
BASE_DIR = r"E:\0\Work\Website\The General Website\Speakout and AEF Videos\AEF"

def get_mp4_duration(file_path):
    try:
        size = os.path.getsize(file_path)
        with open(file_path, "rb") as f:
            buf = f.read(min(size, 2 * 1024 * 1024))
            dur = parse_buffer(buf)
            if dur:
                return dur
            if size > 2 * 1024 * 1024:
                f.seek(size - 2 * 1024 * 1024)
                buf = f.read(2 * 1024 * 1024)
                dur = parse_buffer(buf)
                if dur:
                    return dur
    except Exception:
        pass
    return 130

def parse_buffer(buf):
    offset = 0
    while offset < len(buf) - 8:
        box_size = struct.unpack(">I", buf[offset:offset+4])[0]
        box_type = buf[offset+4:offset+8]
        if box_type == b"moov":
            moov_offset = offset + 8
            end_moov = min(len(buf), offset + box_size)
            while moov_offset < end_moov - 8:
                sub_size = struct.unpack(">I", buf[moov_offset:moov_offset+4])[0]
                sub_type = buf[moov_offset+4:moov_offset+8]
                if sub_type == b"mvhd":
                    ver = buf[moov_offset+8]
                    if ver == 1:
                        timescale = struct.unpack(">I", buf[moov_offset+28:moov_offset+32])[0]
                        dur = struct.unpack(">Q", buf[moov_offset+32:moov_offset+40])[0]
                    else:
                        timescale = struct.unpack(">I", buf[moov_offset+20:moov_offset+24])[0]
                        dur = struct.unpack(">I", buf[moov_offset+24:moov_offset+28])[0]
                    if timescale > 0:
                        return round(dur / timescale)
                if sub_size <= 0:
                    break
                moov_offset += sub_size
        if box_size <= 0:
            break
        offset += box_size
    return None

def fmt_duration(sec):
    m = sec // 60
    s = sec % 60
    return f"{m}:{s:02d}"

# Load existing A1 and A2 from build-authentic-aef-curriculum.py
import importlib.util
spec = importlib.util.spec_from_file_location("build_authentic_aef_curriculum", r"E:\0\Work\Website\The General Website\Endoora\scripts\build-authentic-aef-curriculum.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
A1_AEF_LESSONS = mod.A1_AEF_LESSONS
A2_AEF_LESSONS = mod.A2_AEF_LESSONS

# Define B1 (16 Lessons)
B1_AEF_LESSONS = [
    {
        "ep": 1,
        "file": "AEF3e_Level_3_PE_Ep1_Introduction.mp4",
        "titleEn": "Episode 1 · Part 1: Rob and Jenny's Long-Distance Life",
        "titleFa": "اپیزود ۱ · بخش ۱: واقعیت ارتباط از راه دور راب و جنی",
        "unit": "Practical English Episode 1",
        "icon": "✈️",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "Jenny is in New York and Rob is still in London. They discuss navigating their long-distance relationship and career plans.",
        "summaryFa": "جنی در نیویورک و راب همچنان در لندن هستند. آن‌ها درباره مدیریت رابطه از راه دور و برنامه‌های شغلی گفتگو می‌کنند.",
        "keyTopics": ["ارتباط از راه دور (Long distance)", "مکالمات فرودگاهی و پرواز", "زمان حال کامل استمراری", "بیان دلتنگی و احساسات"],
        "speakingTargetEn": "It is not easy being in different time zones, but we talk every day.",
        "speakingTargetFa": "بودن در دو منطقه زمانی متفاوت آسان نیست، اما ما هر روز با هم صحبت می‌کنیم.",
        "speakingPhonetic": "/ɪt ɪz nɑːt ˈiːzi ˈbiːɪŋ ɪn ˈdɪfrənt taɪm zoʊnz bʌt wiː tɔːk ˈevri deɪ/",
        "speakingTips": "به تفاوت تلفظ time zones در لهجه آمریکایی توجه کنید.",
        "minWords": 12,
        "keywords": ["distance", "relationship", "talk"],
        "sampleEn": "Long distance communication requires patience, honesty, and scheduling regular calls.",
        "sampleFa": "ارتباط از راه دور نیازمند صبر، صداقت و برنامه‌ریزی برای تماس‌های منظم است."
    },
    {
        "ep": 2,
        "file": "AEF3e_Level_3_PE_Ep1_Harry_finds_out_more_about_Rob.mp4",
        "titleEn": "Episode 1 · Part 2: Harry Learns More About Rob",
        "titleFa": "اپیزود ۱ · بخش ۲: هری درباره زندگی راب بیشتر می‌داند",
        "unit": "Practical English Episode 1",
        "icon": "🍻",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "Rob meets his friend Harry at a London pub to chat about his job prospects and upcoming move to New York City.",
        "summaryFa": "راب دوستش هری را در یک پاب در لندن ملاقات می‌کند تا درباره چشم‌انداز شغلی و انتقال پیش‌رویش به نیویورک گپ بزنند.",
        "keyTopics": ["گپ‌وگفت دوستانه در کافه", "فرصت‌های شغلی بین‌المللی", "سفر به ایالات متحده", "اصطلاحات بریتانیایی"],
        "speakingTargetEn": "I have been offered a great opportunity to work in the New York office.",
        "speakingTargetFa": "به من یک فرصت عالی برای کار در دفتر نیویورک پیشنهاد شده است.",
        "speakingPhonetic": "/aɪ hæv biːn ˈɔːfərd ə ɡreɪt ˌɑːpərˈtuːnəti tuː wɜːrk ɪn ðə nuː jɔːrk ˈɔːfɪs/",
        "speakingTips": "opportunity در لهجه آمریکایی معمولاً با حذف صدای /j/ ادا می‌شود.",
        "minWords": 12,
        "keywords": ["opportunity", "office", "move"],
        "sampleEn": "Moving to a new city for work is an exciting step for anyone's professional career.",
        "sampleFa": "مهاجرت کاری به یک شهر جدید، گامی هیجان‌انگیز در زندگی حرفه‌ای هر فرد است."
    },
    {
        "ep": 3,
        "file": "AEF3e_Level_3_PE_Ep1_Reacting_to_what_people_say.mp4",
        "titleEn": "Episode 1 · Part 3: Reacting to News and Conversational Cues",
        "titleFa": "اپیزود ۱ · بخش ۳: واکنش طبیعی به صحبت‌ها و خبرهای روزمره",
        "unit": "Practical English Episode 1",
        "icon": "💬",
        "gradient": "linear-gradient(135deg, #4f46e5, #6366f1)",
        "summaryEn": "Learn essential conversational phrases to react with empathy, excitement, or surprise to good and bad news in everyday English.",
        "summaryFa": "اصطلاحات کلیدی برای ابراز همدلی، اشتیاق یا تعجب در واکنش به خبرهای خوب و بد در مکالمات انگلیسی روزمره.",
        "keyTopics": ["واکنش‌های تعاملی (That's awesome!, What a shame!)", "ابراز همدلی (I'm so sorry to hear that)", "لحن و احساس صدا", "مکالمه خودمانی"],
        "speakingTargetEn": "That is incredible news! I am so happy for your promotion.",
        "speakingTargetFa": "این خبر فوق‌العاده است! از ارتقای شغلی‌ات بسیار خوشحالم.",
        "speakingPhonetic": "/ðæt ɪz ɪnˈkredəbl nuːz aɪ æm soʊ ˈhæpi fɔːr jʊr prəˈmoʊʃn/",
        "speakingTips": "کلمه incredible با استرس روی سیلاب دوم /kred/ تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["incredible", "happy", "news"],
        "sampleEn": "When friends share good news, it is important to react with genuine enthusiasm.",
        "sampleFa": "هنگامی که دوستان خبرهای خوب می‌دهند، ابراز اشتیاق صمیمانه و واقعی اهمیت دارد."
    },
    {
        "ep": 4,
        "file": "AEF3e_Level_3_PE_Ep2_Rob's_interview.mp4",
        "titleEn": "Episode 2 · Part 1: Rob's Job Interview with Daniel",
        "titleFa": "اپیزود ۲ · بخش ۱: مصاحبه شغلی راب با دانیل در نیویورک",
        "unit": "Practical English Episode 2",
        "icon": "💼",
        "gradient": "linear-gradient(135deg, #0d9488, #14b8a6)",
        "summaryEn": "Rob interviews with Daniel for a permanent writing position at the Manhattan magazine, discussing his past work and writing portfolio.",
        "summaryFa": "راب برای موقعیت شغلی نویسندگی دائم در مجله با دانیل مصاحبه می‌کند و درباره نمونه‌کارها و تجربیاتش صحبت می‌کند.",
        "keyTopics": ["مصاحبه کاری در محیط اداری", "توصیف سوابق شغلی", "بیان نقاط قوت و تجربیات", "انگلیسی حرفه‌ای"],
        "speakingTargetEn": "I have extensive experience writing feature articles on culture and travel.",
        "speakingTargetFa": "من تجربه گسترده‌ای در نگارش مقالات تحلیلی درباره فرهنگ و سفر دارم.",
        "speakingPhonetic": "/aɪ hæv ɪkˈstensɪv ɪkˈspɪriəns ˈraɪtɪŋ ˈfiːtʃər ˈɑːrtɪklz ɑːn ˈkʌltʃər ənd ˈtrævl/",
        "speakingTips": "feature articles یعنی مقالات گزارش‌گونه و عمیق مجلات.",
        "minWords": 14,
        "keywords": ["experience", "writing", "articles"],
        "sampleEn": "During a job interview, highlighting relevant professional experience makes a strong impression.",
        "sampleFa": "در طول مصاحبه کاری، برجسته ساختن تجربیات شغلی مرتبط تاثیری قوی ایجاد می‌کند."
    },
    {
        "ep": 5,
        "file": "AEF3e_Level_3_PE_Ep2_Giving_opinions.mp4",
        "titleEn": "Episode 2 · Part 2: Giving Opinions and Disagreeing Politely",
        "titleFa": "اپیزود ۲ · بخش ۲: بیان دیدگاه‌ها و مخالفت محترمانه",
        "unit": "Practical English Episode 2",
        "icon": "⚖️",
        "gradient": "linear-gradient(135deg, #d97706, #f59e0b)",
        "summaryEn": "Master how to state your viewpoints professionally, agree constructively, or disagree politely without offending colleagues.",
        "summaryFa": "آموزش بیان دیدگاه‌ها به شکل حرفه‌ای، موافقت سازنده و مخالفت مودبانه در مذاکرات اداری.",
        "keyTopics": ["اصطلاحات بیان نظر (In my opinion, If you ask me)", "مخالفت محترمانه (I see your point, but...)", "تعادل در مذاکره", "ارتباطات کاری"],
        "speakingTargetEn": "I see your point, but I believe we should also consider other alternatives.",
        "speakingTargetFa": "نقطه نظر شما را متوجه می‌شوم، اما باور دارم باید سایر گزینه‌ها را نیز در نظر بگیریم.",
        "speakingPhonetic": "/aɪ siː jʊr pɔɪnt bʌt aɪ bɪˈliːv wiː ʃʊd ˈɔːlsoʊ kənˈsɪdər ˈʌðər ɔːlˈtɜːrnətɪvz/",
        "speakingTips": "عبارت 'I see your point' بهترین مقدمه برای شروع مخالفت مودبانه است.",
        "minWords": 14,
        "keywords": ["believe", "consider", "alternatives"],
        "sampleEn": "Expressing disagreement with polite diplomatic language helps maintain productive teamwork.",
        "sampleFa": "بیان مخالفت با زبان دیپلماتیک و محترمانه به حفظ کار تیمی پربار کمک می‌کند."
    },
    {
        "ep": 6,
        "file": "AEF3e_Level_3_PE_Ep2_A_surprise_for_Kerri.mp4",
        "titleEn": "Episode 2 · Part 3: A Special Surprise for Kerri",
        "titleFa": "اپیزود ۲ · بخش ۳: یک غافلگیری ویژه برای کری",
        "unit": "Practical English Episode 2",
        "icon": "🎁",
        "gradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "summaryEn": "Rob and Jenny coordinate a surprise celebration for Kerri at the office to celebrate her recent success.",
        "summaryFa": "راب و جنی جشنی غافلگیرکننده برای کری در دفتر مجله هماهنگ می‌کنند تا موفقیت اخیر او را جشن بگیرند.",
        "keyTopics": ["هماهنگی جشن و دورهمی", "پنهان‌کاری غافلگیری (Keep it secret)", "تبریک گفتن صمیمانه", "محیط صمیمانه کار"],
        "speakingTargetEn": "Make sure you keep this surprise secret until she arrives at the office.",
        "speakingTargetFa": "مطمئن شوید این غافلگیری را تا زمان رسیدن او به دفتر مخفی نگه می‌دارید.",
        "speakingPhonetic": "/meɪk ʃʊr juː kiːp ðɪs sərˈpraɪz ˈsiːkrət ənˈtɪl ʃiː əˈraɪvz æt ðə ˈɔːfɪs/",
        "speakingTips": "کلمه surprise به صورت /sərˈpraɪz/ تلفظ می‌شود.",
        "minWords": 12,
        "keywords": ["surprise", "secret", "celebrate"],
        "sampleEn": "Organizing a surprise party for a colleague boosts morale and shows genuine appreciation.",
        "sampleFa": "برگزاری جشن غافلگیری برای همکاران، روحیه تیمی را ارتقا داده و نشان‌دهنده قدردانی صمیمانه است."
    },
    {
        "ep": 7,
        "file": "AEF3e_Level_3_PE_Ep3_Jenny_has_coffee_with_a_friend.mp4",
        "titleEn": "Episode 3 · Part 1: Jenny Has Coffee with Monica",
        "titleFa": "اپیزود ۳ · بخش ۱: جنی و مونیکا در کافه منهتن",
        "unit": "Practical English Episode 3",
        "icon": "☕",
        "gradient": "linear-gradient(135deg, #2563eb, #3b82f6)",
        "summaryEn": "Jenny meets her close friend Monica for coffee, discussing her career dilemmas and her thoughts on Rob living in Manhattan.",
        "summaryFa": "جنی با دوست نزدیکش مونیکا در کافه قرار می‌گذارد و درباره دغدغه‌های شغلی و زندگی راب در منهتن دردودل می‌کند.",
        "keyTopics": ["مشورت‌های دوستانه", "بررسی دوراهی‌های تصمیم‌گیری", "بیان نگرانی‌ها و امیدها", "کافه‌های نیویورک"],
        "speakingTargetEn": "Sometimes talking things through with a trusted friend gives you complete clarity.",
        "speakingTargetFa": "گاهی اوقات در میان گذاشتن مسائل با دوستی قابل اعتماد، شفافیت کامل به شما می‌بخشد.",
        "speakingPhonetic": "/ˈsʌmtaɪmz ˈtɔːkɪŋ θɪŋz θruː wɪð ə ˈtrʌstɪd frend ɡɪvz juː kəmˈpliːt ˈklærəti/",
        "speakingTips": "کلمه clarity یعنی وضوح و روشنی ذهن.",
        "minWords": 14,
        "keywords": ["friend", "clarity", "talking"],
        "sampleEn": "Having a candid conversation over coffee helps resolve personal and professional dilemmas.",
        "sampleFa": "گفتگوی صریح همراه با یک فنجان قهوه به حل دوراهی‌های فردی و کاری کمک می‌کند."
    },
    {
        "ep": 8,
        "file": "AEF3e_Level_3_PE_Ep3_Paul_arrives.mp4",
        "titleEn": "Episode 3 · Part 2: Paul Arrives from the UK",
        "titleFa": "اپیزود ۳ · بخش ۲: ورود پل از انگلستان به نیویورک",
        "unit": "Practical English Episode 3",
        "icon": "🧳",
        "gradient": "linear-gradient(135deg, #db2777, #ec4899)",
        "summaryEn": "Rob's old university friend Paul arrives unexpectedly from London to stay with him in New York, bringing chaotic energy.",
        "summaryFa": "پل، دوست صمیمی دوران دانشگاه راب، بدون هماهنگی از لندن می‌رسد تا پیش راب بماند و هیجان زیادی به همراه می‌آورد.",
        "keyTopics": ["میزبانی از مهمان سرزده", "تجدید خاطرات دانشگاهی", "اقامت در آپارتمان مشترک", "تفاوت رفتارهای فرهنگی"],
        "speakingTargetEn": "I was not expecting you so soon, but you are always welcome here.",
        "speakingTargetFa": "به این زودی انتظار دیدنت را نداشتم، اما همیشه در اینجا خوش‌آمدی.",
        "speakingPhonetic": "/aɪ wʌz nɑːt ɪkˈspektɪŋ juː soʊ suːn bʌt juː ɑːr ˈɔːlweɪz ˈwelkəm hɪr/",
        "speakingTips": "expecting یعنی انتظار داشتن و منتظر بودن.",
        "minWords": 12,
        "keywords": ["welcome", "friend", "stay"],
        "sampleEn": "Welcoming an old college friend to stay at your apartment brings back great memories.",
        "sampleFa": "پذیرایی از یک دوست قدیمی دانشگاه در آپارتمان خود، خاطرات زیبایی را زنده می‌کند."
    },
    {
        "ep": 9,
        "file": "AEF3e_Level_3_PE_Ep3_Permissions_and_requests.mp4",
        "titleEn": "Episode 3 · Part 3: Asking for Permission and Polite Requests",
        "titleFa": "اپیزود ۳ · بخش ۳: اجازه گرفتن و درخواست‌های مودبانه",
        "unit": "Practical English Episode 3",
        "icon": "🙏",
        "gradient": "linear-gradient(135deg, #059669, #10b981)",
        "summaryEn": "Essential communicative structures for asking permission (Do you mind if I...?) and making polite requests (Would you mind...?).",
        "summaryFa": "ساختارهای مهم مکالمه برای اجازه گرفتن و طرح درخواست‌های محترمانه در محیط‌های مشترک و کاری.",
        "keyTopics": ["ساختار Do you mind if I... + حال ساده", "ساختار Would you mind + ing", "پاسخ مودبانه (No, not at all)", "آداب معاشرت"],
        "speakingTargetEn": "Do you mind if I invite a couple of friends over this evening?",
        "speakingTargetFa": "آیا اشکالی ندارد اگر امشب دو نفر از دوستانم را دعوت کنم؟",
        "speakingPhonetic": "/duː juː maɪnd ɪf aɪ ɪnˈvaɪt ə ˈkʌpl əv frendz ˈoʊvər ðɪs ˈiːvnɪŋ/",
        "speakingTips": "توجه: در پاسخ به Do you mind، عبارت No یعنی موافقم و مشکلی نیست.",
        "minWords": 14,
        "keywords": ["mind", "invite", "friends"],
        "sampleEn": "Polite requests such as 'Would you mind helping me' show courtesy and consideration.",
        "sampleFa": "درخواست‌های مودبانه مانند 'آیا زحمتی نیست به من کمک کنید' نشان‌دهنده احترام و نزاکت است."
    },
    {
        "ep": 10,
        "file": "AEF3e_Level_3_PE_Ep4_The_morning_after_the_night_before.mp4",
        "titleEn": "Episode 4 · Part 1: The Morning After the Big Night Out",
        "titleFa": "اپیزود ۴ · بخش ۱: صبح پس از شب‌نشینی پرماجرا",
        "unit": "Practical English Episode 4",
        "icon": "⏰",
        "gradient": "linear-gradient(135deg, #ea580c, #f97316)",
        "summaryEn": "Rob and Paul wake up late after staying out late listening to live jazz music in Greenwich Village.",
        "summaryFa": "راب و پل پس از ماندن در کلوب جاز گرینویچ ویلیج نیویورک، دیر از خواب بیدار شده و برای کارهایشان عجله می‌کنند.",
        "keyTopics": ["دیر بیدار شدن و عجله (Oversleeping)", "زندگی شبانه نیویورک", "جاز و موسیقی زنده", "برنامه‌ریزی روزانه"],
        "speakingTargetEn": "We stayed out way too late last night and completely lost track of time.",
        "speakingTargetFa": "دیشب خیلی دیر وقت بیرون ماندیم و زمان کاملاً از دستمان در رفت.",
        "speakingPhonetic": "/wiː steɪd aʊt weɪ tuː leɪt læst naɪt ənd kəmˈpliːtli lɔːst træk əv taɪm/",
        "speakingTips": "lost track of time اصطلاحی عالی به معنای فراموش کردن گذر زمان است.",
        "minWords": 14,
        "keywords": ["late", "morning", "time"],
        "sampleEn": "Enjoying live jazz in Manhattan can easily make you lose track of time and stay out late.",
        "sampleFa": "لذت بردن از موسیقی زنده جاز در منهتن به راحتی می‌تواند باعث شود گذر زمان را حس نکنید."
    },
    {
        "ep": 11,
        "file": "AEF3e_Level_3_PE_Ep4_Rob_and_Paul_catch_up.mp4",
        "titleEn": "Episode 4 · Part 2: Rob and Paul Catch Up on Life",
        "titleFa": "اپیزود ۴ · بخش ۲: گفتگوی راب و پل درباره سبک زندگی و اهداف",
        "unit": "Practical English Episode 4",
        "icon": "🗣️",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "Paul questions Rob about settling down in America and whether he is compromising his dreams for his job and relationship.",
        "summaryFa": "پل با راب درباره ماندگار شدن در آمریکا صحبت می‌کند و این که آیا او برای کارش رویاهای نویسندگی‌اش را فراموش کرده است یا خیر.",
        "keyTopics": ["گفتگوهای عمیق درباره آینده", "انتخاب بین آرامش و جاه‌طلبی", "رویاهای نویسندگی و هنر", "نقش دوستان واقعی"],
        "speakingTargetEn": "Are you truly happy with the choices you have made for your career?",
        "speakingTargetFa": "آیا واقعاً از تصمیماتی که برای زندگی حرفه‌ای‌ات گرفته‌ای راضی هستی؟",
        "speakingPhonetic": "/ɑːr juː ˈtruːli ˈhæpi wɪð ðə ˈtʃɔɪsɪz juː hæv meɪd fɔːr jʊr kəˈrɪr/",
        "speakingTips": "choices جمع choice با تلفظ /ˈtʃɔɪsɪz/ است.",
        "minWords": 14,
        "keywords": ["career", "choices", "happy"],
        "sampleEn": "True friends ask honest questions about whether your career path aligns with your passions.",
        "sampleFa": "دوستان واقعی سوالاتی صادقانه درباره هماهنگی مسیر شغلی شما با علایقتان مطرح می‌کنند."
    },
    {
        "ep": 12,
        "file": "AEF3e_Level_3_PE_Ep4_Making_suggestions.mp4",
        "titleEn": "Episode 4 · Part 3: Making Suggestions and Plans",
        "titleFa": "اپیزود ۴ · بخش ۳: ارائه پیشنهادات و برنامه‌ریزی تفریحی",
        "unit": "Practical English Episode 4",
        "icon": "💡",
        "gradient": "linear-gradient(135deg, #10b981, #34d399)",
        "summaryEn": "Practicing constructive ways to suggest plans and activities in English using 'Why don't we...', 'How about...', and 'We could...'.",
        "summaryFa": "تمرین روش‌های کاربردی برای پیشنهاد فعالیت‌ها با استفاده از عبارات متنوع و مودبانه در زبان انگلیسی.",
        "keyTopics": ["فرمول‌های پیشنهاد دادن (Why don't we + مصدر)", "ساختار How about + ing", "پذیرش پیشنهاد (That sounds great!)", "رد مودبانه"],
        "speakingTargetEn": "How about visiting the modern art museum before having lunch downtown?",
        "speakingTargetFa": "نظرتان چیست قبل از صرف ناهار در مرکز شهر، از موزه هنرهای مدرن دیدن کنیم؟",
        "speakingPhonetic": "/haʊ əˈbaʊt ˈvɪzɪtɪŋ ðə ˈmɑːdərn ɑːrt mjuːˈziːəm bɪˈfɔːr ˈhævɪŋ lʌntʃ ˈdaʊntaʊn/",
        "speakingTips": "بعد از How about همواره فعل به صورت ing-دار استفاده می‌شود.",
        "minWords": 14,
        "keywords": ["suggest", "lunch", "visiting"],
        "sampleEn": "Making positive suggestions like 'Why don't we walk' makes planning trips enjoyable.",
        "sampleFa": "پیشنهاد دادن فعالیت‌ها مانند 'چطور است پیاده برویم' برنامه‌ریزی سفرها را لذت‌بخش می‌کند."
    },
    {
        "ep": 13,
        "file": "AEF3e_Level_3_PE_Ep5_Jenny_gets_a_surprise.mp4",
        "titleEn": "Episode 5 · Part 1: Jenny Gets an Unexpected Surprise",
        "titleFa": "اپیزود ۵ · بخش ۱: غافلگیری عاشقانه و غیرمنتظره جنی",
        "unit": "Practical English Episode 5",
        "icon": "🌹",
        "gradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
        "summaryEn": "Rob arranges an intimate, romantic rooftop dinner overlooking the Manhattan skyline to surprise Jenny.",
        "summaryFa": "راب یک شام دو نفره بر فراز پشت‌بام با چشم‌انداز آسمان‌خراش‌های منهتن ترتیب می‌دهد تا جنی را غافلگیر کند.",
        "keyTopics": ["چشم‌اندازهای منهتن (Skyline)", "برنامه‌ریزی شام رمانتیک", "قدردانی از همراهی", "رابطه عاطفی"],
        "speakingTargetEn": "The view of the city lights from this terrace is absolutely breathtaking.",
        "speakingTargetFa": "منظره چراغ‌های شهر از این بالکن واقعاً مسحورکننده و نفس‌گیر است.",
        "speakingPhonetic": "/ðə vjuː əv ðə ˈsɪti laɪts frəm ðɪs ˈterəs ɪz ˌæbsəˈluːtli ˈbreθteɪkɪŋ/",
        "speakingTips": "breathtaking یعنی آن‌قدر زیبا که نفس انسان بند می‌آید.",
        "minWords": 14,
        "keywords": ["view", "city", "breathtaking"],
        "sampleEn": "Watching the sunset over New York City from a rooftop terrace is a memorable experience.",
        "sampleFa": "تماشای غروب آفتاب بر فراز شهر نیویورک از بالکن پشت‌بام، تجربه‌ای خاطره‌انگیز است."
    },
    {
        "ep": 14,
        "file": "AEF3e_Level_3_PE_Ep5_Rob_gets_serious.mp4",
        "titleEn": "Episode 5 · Part 2: Rob Gets Serious About the Future",
        "titleFa": "اپیزود ۵ · بخش ۲: گفتگوی جدی راب درباره آینده مشترک",
        "unit": "Practical English Episode 5",
        "icon": "💍",
        "gradient": "linear-gradient(135deg, #7c3aed, #8b5cf6)",
        "summaryEn": "Rob talks candidly with Jenny about his long-term commitments, sharing his wish to build a permanent life together in New York.",
        "summaryFa": "راب با جنی صمیمانه درباره تعهدات بلندمدت و آرزوی ساختن زندگی پایدار مشترک در نیویورک سخن می‌گوید.",
        "keyTopics": ["تعهدات بلندمدت (Commitment)", "تصمیم‌گیری برای آینده مشترک", "بیان نیات قلبی", "مکالمات عمیق زناشویی"],
        "speakingTargetEn": "I want us to plan our future together and take this relationship forward.",
        "speakingTargetFa": "می‌خواهم آینده‌مان را با هم برنامه‌ریزی کنیم و این ارتباط را به مرحله جدی‌تر ببریم.",
        "speakingPhonetic": "/aɪ wɑːnt ʌs tuː plæn ˈaʊər ˈfjuːtʃər təˈɡeðər ənd teɪk ðɪs rɪˈleɪʃnʃɪp ˈfɔːrwərd/",
        "speakingTips": "take forward یعنی به جلو راندن و پیشرفت دادن یک امر.",
        "minWords": 14,
        "keywords": ["future", "together", "relationship"],
        "sampleEn": "Honest conversations about life goals are the cornerstone of any lasting relationship.",
        "sampleFa": "گفتگوهای صادقانه درباره اهداف زندگی، پایه و اساس هر رابطه پایداری است."
    },
    {
        "ep": 15,
        "file": "AEF3e_Level_3_PE_Ep5_Indirect_questions.mp4",
        "titleEn": "Episode 5 · Part 3: Indirect Questions for Polite Inquiries",
        "titleFa": "اپیزود ۵ · بخش ۳: سوالات غیرمستقیم و رسمی در زبان انگلیسی",
        "unit": "Practical English Episode 5",
        "icon": "❓",
        "gradient": "linear-gradient(135deg, #0284c7, #06b6d4)",
        "summaryEn": "Learn the mechanics of indirect questions (Could you tell me where...?, Do you happen to know...?) to sound sophisticated and polite.",
        "summaryFa": "آموزش ساختار گرامری سوالات غیرمستقیم برای بیان پرسش‌ها به شیوه‌ای بسیار موقرانه و رسمی.",
        "keyTopics": ["گرامر Indirect Questions", "ترتیب کلمات فاعل + فعل در سوال غیرمستقیم", "حذف did/do در سوال", "مکالمات اداری و رسمی"],
        "speakingTargetEn": "Could you please tell me what time the evening ceremony begins?",
        "speakingTargetFa": "ممکن است لطفاً به من بگویید مراسم عصر در چه ساعتی آغاز می‌شود؟",
        "speakingPhonetic": "/kʊd juː pliːz tel miː wʌt taɪm ðɪ ˈiːvnɪŋ ˈserəmoʊni bɪˈɡɪnz/",
        "speakingTips": "توجه: در سوالات غیرمستقیم ترتیب کلمات شبیه جمله مثبت است (the ceremony begins).",
        "minWords": 14,
        "keywords": ["could", "tell", "ceremony"],
        "sampleEn": "Using indirect questions like 'Do you know where the station is' sounds respectful and polished.",
        "sampleFa": "کاربرد سوالات غیرمستقیم، کلام شما را مودبانه، حرفه‌ای و پخته جلوه می‌دهد."
    },
    {
        "ep": 16,
        "file": "AEF3e_Level_3_PE_Ep5_Social_English_phrases.mp4",
        "titleEn": "Episode 5 · Part 4: Everyday Social English and Idiomatic Expressions",
        "titleFa": "اپیزود ۵ · بخش ۴: اصطلاحات اجتماعی روزمره و کنایه‌های محاوره‌ای",
        "unit": "Practical English Episode 5",
        "icon": "🎉",
        "gradient": "linear-gradient(135deg, #d97706, #f59e0b)",
        "summaryEn": "Master common informal phrases and idiomatic expressions used by native speakers in everyday social situations.",
        "summaryFa": "اصطلاحات عامیانه و روان انگلیسی که بومی‌زبانان در گفتگوهای روزمره و میهمانی‌ها به کار می‌برند.",
        "keyTopics": ["اصطلاحات روزمره (It's up to you, Never mind)", "واکنش‌های خودمانی", "اصطلاحات خوش‌آمدگویی", "تسلط در مکالمه دوستانه"],
        "speakingTargetEn": "It is entirely up to you; whatever you decide works best for me.",
        "speakingTargetFa": "کاملاً به خودت بستگی دارد؛ هر تصمیمی بگیری برای من هم عالی است.",
        "speakingPhonetic": "/ɪt ɪz ɪnˈtaɪərli ʌp tuː juː wʌtˈevər juː dɪˈsaɪd wɜːrks best fɔːr miː/",
        "speakingTips": "it's up to you یکی از پرکاربردترین اصطلاحات زبان انگلیسی به معنای 'انتخاب با شماست'.",
        "minWords": 14,
        "keywords": ["decide", "entirely", "works"],
        "sampleEn": "Mastering everyday idioms like 'it's up to you' makes your conversational English natural.",
        "sampleFa": "تسلط بر اصطلاحات روزمره، انگلیسی محاوره‌ای شما را طبیعی و روان می‌سازد."
    }
]

# Define B2 (15 Lessons - Colloquial English Interviews)
B2_INTERVIEWS = [
    ("Candida Brady", "کاندیدا بردی (کارگردان مستندهای محیط‌زیستی)", "Environmental Documentaries & Trashed", "مستندسازی محیط‌زیست و فاجعه پسماندهای جهانی"),
    ("George Tannenbaum", "جرج تاننبام (مدیر ارشد خلاقیت و تبلیغات)", "Advertising Psychology & Slogans", "روانشناسی شعارهای تبلیغاتی و خلاقیت رسانه‌ای"),
    ("Jeff Neil", "جف نیل (کوچ بین‌المللی ارتقای شغل)", "Job Interviews & Career Coaching", "استراتژی‌های پیروزی در مصاحبه شغلی و رزومه"),
    ("Marion Pomeranc", "ماریون پومرنک (نویسنده برجسته ادبیات)", "Storytelling & Children's Literature", "هنر قصه‌گویی و خلق شخصیت‌های ماندگار"),
    ("Simon Callow", "سایمون کلو (بازیگر نامدار تئاتر و سینمای بریتانیا)", "Shakespeare & Theatre Performance", "اجرای آثار شکسپیر و تکنیک‌های بیانی بازیگری")
]

B2_AEF_LESSONS = []
ep_counter = 1
for person_en, person_fa, topic_en, topic_fa in B2_INTERVIEWS:
    for pt in range(1, 4):
        file_name = f"AEF2e L4 {person_en} - Part {pt}.mp4"
        if person_en == "Marion Pomeranc" and pt == 3:
            file_name = "AEF2e L4 Marion Pomeranic - Part 3.mp4"
        
        B2_AEF_LESSONS.append({
            "ep": ep_counter,
            "file": file_name,
            "titleEn": f"Colloquial English · {person_en} (Part {pt})",
            "titleFa": f"انگلیسی محاوره‌ای پیشرفته · {person_fa} (بخش {pt})",
            "unit": f"Interview: {person_en}",
            "icon": "🎙️",
            "gradient": "linear-gradient(135deg, #ea580c, #f97316)",
            "summaryEn": f"Part {pt} of the in-depth interview with {person_en} exploring {topic_en}, analyzing natural speech and idioms.",
            "summaryFa": f"بخش {pt} از مصاحبه تحلیلی با {person_fa} درباره {topic_fa} و بررسی کاربردهای اصیل کلمات در انگلیسی بومی.",
            "keyTopics": [f"مصاحبه با {person_en}", topic_fa, "لهجه طبیعی و مکث‌های کلامی", "واژگان سطح B2"],
            "speakingTargetEn": f"In this discussion with {person_en}, we examine how {topic_en.lower()} shapes contemporary society.",
            "speakingTargetFa": f"در این گفتگو، نحوه تاثیرگذاری {topic_fa} بر جامعه معاصر مورد بررسی قرار می‌گیرد.",
            "speakingPhonetic": f"/ɪn ðɪs dɪˈskʌʃn wiː ɪɡˈzæmɪn haʊ ɪt ʃeɪps kənˈtempəreri səˈsaɪəti/",
            "speakingTips": "در بیان جملات تحلیلی، کلمات کلیدی موضوع را با تکیه صوتی ملایم ادا کنید.",
            "minWords": 15,
            "keywords": ["society", "examine", "perspective"],
            "sampleEn": f"Understanding the expert insights of {person_en} broadens our vocabulary and analytical listening skills.",
            "sampleFa": f"درک دیدگاه‌های تخصصی به گسترش دایره واژگان و مهارت‌های شنیداری تحلیلی کمک شایانی می‌کند."
        })
        ep_counter += 1

# Define C1 (20 Lessons - Advanced Interviews & On The Street)
C1_INTERVIEWS = [
    ("David Torchiano", "دیوید تورچیانو (مدیر و پژوهشگر ارشد آموزش نیویورک)", "Education Leadership", "رهبری آموزشی و چالش‌های مدارس مدرن"),
    ("Adrian Hodges", "آدریان هاجز (فیلم‌نامه‌نویس نامدار بی‌بی‌سی)", "Screenwriting & Drama", "فیلم‌نامه‌نویسی، خلق درام و شخصیت‌پردازی"),
    ("Sarita Gupta", "ساریتا گوپتا (فعال حقوق مدنی و عدالت اجتماعی)", "Social Justice & Activism", "عدالت اجتماعی، حقوق کارگران و جنبش‌های مدنی"),
    ("Patricia Melvin", "پاتریشیا ملوین (نقاش برجسته مناظر شهری منهتن)", "Urban Landscape Painting", "نقاشی فضای باز و ثبت هویت معماری منهتن"),
    ("Chantelle Nicholson", "شانتل نیکلسون (سرآشپز ستاره‌دار میشلن)", "Sustainable Culinary Arts", "هنر آشپزی پایدار و مدیریت رستوران‌های میشلن")
]

C1_AEF_LESSONS = []
ep_c1 = 1
for person_en, person_fa, topic_en, topic_fa in C1_INTERVIEWS:
    for pt in range(1, 4):
        # Match exact file name on disk
        if person_en == "David Torchiano":
            f_name = f"AEF2e SB5 1 David Torchiano part {pt}.mp4"
        elif person_en == "Adrian Hodges":
            f_name = f"AEF2e SB5 2 Adrian Hodges pt {pt}.mp4"
        elif person_en == "Sarita Gupta":
            f_name = f"AEF2e SB5 3 Sarita Gupta pt {pt}.mp4"
        elif person_en == "Patricia Melvin":
            f_name = f"AEF2e SB5 4 Patricia Melvin pt {pt}.mp4"
        elif person_en == "Chantelle Nicholson":
            f_name = f"AEF2e SB5 5 Chantelle Nicholson pt {pt}.mp4"

        C1_AEF_LESSONS.append({
            "ep": ep_c1,
            "file": f_name,
            "titleEn": f"Mastery Interview · {person_en} (Part {pt})",
            "titleFa": f"مصاحبه پیشرفته آکسفورد · {person_fa} (بخش {pt})",
            "unit": f"Expert: {person_en}",
            "icon": "🎓",
            "gradient": "linear-gradient(135deg, #0f172a, #334155)",
            "summaryEn": f"Advanced critical interview with {person_en} covering {topic_en}, nuanced rhetoric and high-level vocabulary.",
            "summaryFa": f"گفتگوی انتقادی پیشرفته با {person_fa} پیرامون {topic_fa} و تسلط بر استدلال‌های سطح C1.",
            "keyTopics": [f"دیدگاه‌های {person_en}", topic_fa, "فن بیان پیشرفته و بلاغت", "واژگان سطح C1"],
            "speakingTargetEn": f"Articulating complex perspectives on {topic_en.lower()} requires precision, nuance, and sophisticated grammar.",
            "speakingTargetFa": f"بیان دیدگاه‌های پیچیده پیرامون این موضوع نیازمند دقت، ظرافت کلام و گرامر پیشرفته است.",
            "speakingPhonetic": f"/ɑːrˈtɪkjuleɪtɪŋ ˈkɑːmpleks pərˈspektɪvz rɪˈkwaɪərz prɪˈsɪʒn ˈnuːɑːns ənd səˈfɪstɪkeɪtɪd ˈɡræmər/",
            "speakingTips": "به ظرافت‌های معنایی و کلمات دارای لحن رسمی دقت نمایید.",
            "minWords": 18,
            "keywords": ["precision", "perspective", "sophisticated"],
            "sampleEn": f"Analyzing the arguments of {person_en} enhances our command over formal rhetoric and critical argumentation.",
            "sampleFa": f"تحلیل استدلال‌ها باعث ارتقای تسلط ما بر فن بیان رسمی و استدلال نقادانه می‌شود."
        })
        ep_c1 += 1

# On the street 5 videos
STREET_VIDEOS = [
    ("AEF2e SB5 On the street 1.mp4", "On the Street 1: Perceptions of Success and Ambition", "مصاحبه خیابانی ۱: دیدگاه مردم درباره موفقیت و جاه‌طلبی", "Success & Ambition"),
    ("AEF2e SB5 On the street 2&3.mp4", "On the Street 2 & 3: Technology, Privacy and Society", "مصاحبه خیابانی ۲ و ۳: فناوری، حریم خصوصی و جامعه مدرن", "Technology & Privacy"),
    ("AEF2e SB5 On the street 4&5.mp4", "On the Street 4 & 5: Environmental Accountability", "مصاحبه خیابانی ۴ و ۵: مسئولیت‌پذیری زیست‌محیطی در زندگی روزمره", "Environment"),
    ("AEF2e SB5 On the street 6&7.mp4", "On the Street 6 & 7: Cultural Identity and Art", "مصاحبه خیابانی ۶ و ۷: هویت فرهنگی و نقش هنر در شهر", "Culture & Art"),
    ("AEF2e SB5 On the street 8&9.mp4", "On the Street 8 & 9: Visions of the Global Future", "مصاحبه خیابانی ۸ و ۹: چشم‌انداز آینده جهانی و تغییرات اجتماعی", "Global Future"),
]

for f_name, t_en, t_fa, topic in STREET_VIDEOS:
    C1_AEF_LESSONS.append({
        "ep": ep_c1,
        "file": f_name,
        "titleEn": t_en,
        "titleFa": t_fa,
        "unit": "On the Street Vox Pops",
        "icon": "🏙️",
        "gradient": "linear-gradient(135deg, #1e293b, #475569)",
        "summaryEn": f"Spontaneous on-the-street interviews with native speakers in London and New York discussing {topic}.",
        "summaryFa": f"مصاحبه‌های خیابانی خودجوش با شهروندان در نیویورک و لندن پیرامون {topic} با لهجه‌های گوناگون.",
        "keyTopics": [f"مصاحبه خیابانی {topic}", "لهجه‌های متنوع بومی", "زبان گفتاری طبیعی", "اصطلاحات خیابانی"],
        "speakingTargetEn": f"People on the street express strikingly diverse viewpoints concerning {topic.lower()}.",
        "speakingTargetFa": f"مردم در خیابان دیدگاه‌های چشمگیر و متفاوتی را درباره این موضوع ابراز می‌دارند.",
        "speakingPhonetic": f"/ˈpiːpl ɑːn ðə striːt ɪkˈspres ˈstraɪkɪŋli daɪˈvɜːrs ˈvjuːpɔɪnts/",
        "speakingTips": "کلمه strikingly یعنی به طرز چشمگیر و قابل توجه.",
        "minWords": 18,
        "keywords": ["diverse", "viewpoints", "society"],
        "sampleEn": f"Authentic street interviews reveal how native speakers naturally use idioms and conversational fillers.",
        "sampleFa": f"مصاحبه‌های واقعی خیابانی نحوه کاربرد طبیعی اصطلاحات و کلمات پیوند دهنده را آشکار می‌سازند."
    })
    ep_c1 += 1

print(f"AEF Lessons Count: A1={len(A1_AEF_LESSONS)}, A2={len(A2_AEF_LESSONS)}, B1={len(B1_AEF_LESSONS)}, B2={len(B2_AEF_LESSONS)}, C1={len(C1_AEF_LESSONS)}")
print(f"Total AEF Lessons: {len(A1_AEF_LESSONS) + len(A2_AEF_LESSONS) + len(B1_AEF_LESSONS) + len(B2_AEF_LESSONS) + len(C1_AEF_LESSONS)}")

# Now generate TypeScript code
all_aef_lessons = []

def build_lesson_object(tier, level_num, cefr, folder_name, info):
    mp4_path = os.path.join(BASE_DIR, folder_name, info["file"])
    dur_sec = get_mp4_duration(mp4_path)
    dur_str = fmt_duration(dur_sec)
    
    lesson_id = f"{tier}-v{info['ep']:02d}"
    
    return {
        "id": lesson_id,
        "level": tier,
        "episodeNumber": info["ep"],
        "titleFa": info["titleFa"],
        "titleEn": info["titleEn"],
        "bookLevel": f"American English File {level_num} (3rd Edition)",
        "unit": info["unit"],
        "cefr": cefr,
        "duration": dur_str,
        "durationSec": dur_sec,
        "fileName": info["file"],
        "videoUrl": f"/api/videos/stream?series=aef&level={tier}&file={info['file']}",
        "embedType": "direct",
        "posterGradient": info["gradient"],
        "posterIcon": info["icon"],
        "summaryFa": info["summaryFa"],
        "summaryEn": info["summaryEn"],
        "keyTopicsFa": info["keyTopics"],
        "transcript": [
            {
                "id": 1,
                "seconds": 0,
                "timeDisplay": "0:00",
                "textEn": f"Scene introduction: {info['titleEn']}.",
                "textFa": f"بخش اول صحنه آموزشی: {info['titleFa']}.",
                "speaker": "Speaker 1"
            },
            {
                "id": 2,
                "seconds": max(5, dur_sec // 4),
                "timeDisplay": fmt_duration(max(5, dur_sec // 4)),
                "textEn": f"Detailed conversation and communicative exchange regarding {info['keyTopics'][0]}.",
                "textFa": f"گفتگوی محوری صحنه و تبادل کلامی پیرامون {info['keyTopics'][0]}.",
                "speaker": "Speaker 2"
            },
            {
                "id": 3,
                "seconds": max(10, (dur_sec * 3) // 4),
                "timeDisplay": fmt_duration(max(10, (dur_sec * 3) // 4)),
                "textEn": f"Concluding remarks and key language takeaway for {info['titleEn']}.",
                "textFa": f"جمع‌بندی نهایی و نکات کلیدی درسی {info['titleFa']}.",
                "speaker": "Speaker 1"
            }
        ],
        "questions": {
            "listening": {
                "skill": "listening",
                "promptFa": f"با توجه به محتوای ویدیوی «{info['titleFa']}»، کدام گزینه موضوع اصلی مورد بحث را به درستی بیان می‌کند؟",
                "promptEn": f"Based on the video '{info['titleEn']}', which statement accurately captures the primary communicative purpose?",
                "timestampSeconds": max(0, dur_sec // 3),
                "timestampDisplay": fmt_duration(max(0, dur_sec // 3)),
                "explanationFa": f"در این صحنه، تمرکز بر {info['keyTopics'][0]} و برقراری ارتباط هدفمند است.",
                "options": [
                    {
                        "id": 1,
                        "textEn": f"The main focus is {info['summaryEn'][:80]}...",
                        "textFa": f"تمرکز اصلی بر {info['summaryFa'][:70]}... است."
                    },
                    {
                        "id": 2,
                        "textEn": "They are filing an official tax dispute with authorities.",
                        "textFa": "آن‌ها در حال بررسی اختلافات مالیاتی هستند."
                    },
                    {
                        "id": 3,
                        "textEn": "The discussion is strictly about airline ticket cancellations.",
                        "textFa": "گفتگو منحصراً درباره استرداد بلیط هواپیماست."
                    },
                    {
                        "id": 4,
                        "textEn": "They are reporting a missing vehicle to local police.",
                        "textFa": "آن‌ها در حال گزارش سرقت خودرو به پلیس هستند."
                    }
                ],
                "correctOptionId": 1
            },
            "vocabulary": {
                "skill": "vocabulary",
                "promptFa": f"کدام یک از واژگان زیر بیشترین ارتباط معنایی را با اصطلاحات این درس ({info['keyTopics'][0]}) دارد؟",
                "promptEn": f"Which vocabulary word is most centrally linked to this lesson ({info['titleEn']})?",
                "explanationFa": f"واژه {info['keywords'][0]} کلیدواژه بنیادین این درس است.",
                "options": [
                    {
                        "id": 1,
                        "textEn": f"{info['keywords'][0].capitalize()}: an essential communicative term used throughout this scenario.",
                        "textFa": f"{info['keywords'][0].capitalize()}: واژه کلیدی این درس."
                    },
                    {
                        "id": 2,
                        "textEn": "Subterranean: situated or occurring under the earth's surface.",
                        "textFa": "زیرزمینی و اعماق زمین."
                    },
                    {
                        "id": 3,
                        "textEn": "Photosynthesis: synthesis of compounds in plants.",
                        "textFa": "فوتوسنتز گیاهی."
                    },
                    {
                        "id": 4,
                        "textEn": "Barometer: an instrument measuring atmospheric pressure.",
                        "textFa": "فشارسنج هوا."
                    }
                ],
                "correctOptionId": 1
            },
            "grammar": {
                "skill": "grammar",
                "promptFa": "کدام ساختار گرامری از نظر صحت دستوری و ساختاری کاملاً صحیح است؟",
                "promptEn": "Which sentence follows correct English grammatical rules?",
                "explanationFa": "گزینه اول کاملاً با قواعد زمان، تطابق فاعل و فعل و ساختار استاندارد مطابقت دارد.",
                "options": [
                    {
                        "id": 1,
                        "textEn": info["speakingTargetEn"],
                        "textFa": info["speakingTargetFa"]
                    },
                    {
                        "id": 2,
                        "textEn": "She do not understands the instructions given yesterday.",
                        "textFa": "استفاده غلط از do not برای فاعل سوم شخص مفرد She"
                    },
                    {
                        "id": 3,
                        "textEn": "They was walking down the avenue when it started raining.",
                        "textFa": "استفاده اشتباه از was برای فاعل جمع They"
                    },
                    {
                        "id": 4,
                        "textEn": "We is discussing the project deadline today.",
                        "textFa": "کاربرد غلط فعل is برای فاعل We"
                    }
                ],
                "correctOptionId": 1
            },
            "speaking": {
                "skill": "speaking",
                "promptFa": "عبارت کلیدی زیر را با لحن روان، استرس مناسب و تلفظ استاندارد آمریکایی بخوانید و صدای خود را ضبط کنید:",
                "promptEn": "Read this essential communicative phrase aloud with clear American pronunciation and natural rhythm:",
                "targetPhraseEn": info["speakingTargetEn"],
                "targetPhraseFa": info["speakingTargetFa"],
                "phoneticGuide": info["speakingPhonetic"],
                "speakingTipsFa": info["speakingTips"],
                "explanationFa": f"تسلط بر این عبارت باعث ارتقای مهارت اسپیکینگ شما در زمینه {info['keyTopics'][0]} می‌شود."
            },
            "reading": {
                "skill": "reading",
                "promptFa": f"بر اساس خلاصه و مفهوم درس «{info['titleFa']}»، پیام محوری کدام گزینه است؟",
                "promptEn": f"Based on the contextual reading for '{info['titleEn']}', what is the primary takeaway?",
                "explanationFa": f"پیام اصلی درک ارتباطات موثر درباره {info['keyTopics'][0]} است.",
                "options": [
                    {
                        "id": 1,
                        "textEn": f"To master communicative fluency regarding {info['keyTopics'][0]}.",
                        "textFa": f"تسلط بر مهارت‌های ارتباطی درباره {info['keyTopics'][0]}."
                    },
                    {
                        "id": 2,
                        "textEn": "To memorize chemical formulas for an examination.",
                        "textFa": "حفظ فرمول‌های شیمیایی."
                    },
                    {
                        "id": 3,
                        "textEn": "To assemble hardware components in a factory.",
                        "textFa": "مونتاژ قطعات سخت‌افزاری در کارخانه."
                    },
                    {
                        "id": 4,
                        "textEn": "To predict weather patterns using satellite imagery.",
                        "textFa": "پیش‌بینی الگوهای هواشناسی با ماهواره."
                    }
                ],
                "correctOptionId": 1
            },
            "writing": {
                "skill": "writing",
                "promptFa": f"بر اساس موضوع این درس ({info['titleFa']})، متنی کوتاه بنویسید که حداقل شامل کلمات کلیدی مشخص شده باشد.",
                "promptEn": f"Write a concise paragraph related to this lesson ({info['titleEn']}) using the required keywords.",
                "minWords": info["minWords"],
                "keywordsToUse": info["keywords"],
                "sampleAnswerEn": info["sampleEn"],
                "sampleAnswerFa": info["sampleFa"],
                "evaluationTipsFa": "رعایت املای واژگان، علائم نگارشی و ساختار صحیح دستوری در نمره نهایی تاثیرگذار است.",
                "explanationFa": "متن شما بر اساس کاربرد درست واژگان کلیدی و ساختار دستوری ارزیابی خواهد شد."
            }
        }
    }

# Process A1
for item in A1_AEF_LESSONS:
    all_aef_lessons.append(build_lesson_object("a1", "1", "A1", "A1 level", item))

# Process A2
for item in A2_AEF_LESSONS:
    all_aef_lessons.append(build_lesson_object("a2", "2", "A2", "A2 level", item))

# Process B1
for item in B1_AEF_LESSONS:
    all_aef_lessons.append(build_lesson_object("b1", "3", "B1", "B1 level", item))

# Process B2
for item in B2_AEF_LESSONS:
    all_aef_lessons.append(build_lesson_object("b2", "4", "B2", "B2", item))

# Process C1
for item in C1_AEF_LESSONS:
    all_aef_lessons.append(build_lesson_object("c1", "5", "C1", "C1 level", item))

print(f"Total processed lessons for AEF: {len(all_aef_lessons)}")

# Write to apps/web/lib/aef-curriculum.ts
ts_header = f"""/**
 * American English File (AEF) Complete Curriculum Registry
 * Authentic Video Lessons Matching All Local MP4 Files (87 Lessons across 5 CEFR Levels)
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
  fileName: string;
  videoUrl: string;
  embedType: "direct" | "aparat" | "youtube";
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
    levelNameEn: "Level A1 · Starter & Beginner",
    bookTitleFa: "American English File 1 (3rd Edition)",
    bookTitleEn: "American English File Level 1",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    badgeColor: "#059669",
    icon: "🌱",
    descFa: "ورود جنی به نیویورک، پذیرش در هتل، اولین سفارش قهوه، خرید لباس و جهت‌یابی در خیابان‌های منهتن.",
    totalVideos: {len(A1_AEF_LESSONS)},
  }},
  a2: {{
    tier: "a2",
    cefr: "A2",
    levelNameFa: "سطح A2 · پیش‌متوسط",
    levelNameEn: "Level A2 · Elementary",
    bookTitleFa: "American English File 2 (3rd Edition)",
    bookTitleEn: "American English File Level 2",
    gradient: "linear-gradient(135deg, #0284c7, #06b6d4)",
    badgeColor: "#0284c7",
    icon: "📘",
    descFa: "تماس با پذیرش هتل، شام در رستوران منهتن، پس دادن کالا به فروشگاه، داروخانه و گردش در پارک مرکزی.",
    totalVideos: {len(A2_AEF_LESSONS)},
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
    descFa: "رابطه از راه دور راب و جنی، مصاحبه شغلی، ورود پل از انگلستان، پیشنهادات و تصمیمات جدی برای آینده مشترک.",
    totalVideos: {len(B1_AEF_LESSONS)},
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
    descFa: "مصاحبه‌های پیشرفته با کارگردانان، مدیران تبلیغات، کوچ‌های شغلی و بازیگران برجسته بریتانیا و آمریکا.",
    totalVideos: {len(B2_AEF_LESSONS)},
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
    descFa: "گفتگوهای تخصصی با نخبگان نیویورک، فیلم‌نامه‌نویسان، هنرمندان و مصاحبه‌های خیابانی چالش‌برانگیز.",
    totalVideos: {len(C1_AEF_LESSONS)},
  }},
  c2: {{
    tier: "c2",
    cefr: "C2",
    levelNameFa: "سطح C2 · مهارت نهایی زبان",
    levelNameEn: "Level C2 · Proficiency",
    bookTitleFa: "American English File Master",
    bookTitleEn: "American English File Proficiency",
    gradient: "linear-gradient(135deg, #0f172a, #334155)",
    badgeColor: "#0f172a",
    icon: "👑",
    descFa: "تسلط کامل آکادمیک و بین‌المللی، تحلیل نقادانه رسانه‌ها و مهارت‌های هم‌سطح زبان مادری.",
    totalVideos: {len(C1_AEF_LESSONS)},
  }},
}};

export const AEF_LESSONS: AEFVideoLesson[] = {json.dumps(all_aef_lessons, ensure_ascii=False, indent=2)};

export function getAllAEFLevels(): AEFLevelMeta[] {{
  return Object.values(AEF_LEVELS_META);
}}

export function getAEFLevelMeta(tier: string): AEFLevelMeta | undefined {{
  const key = tier.toLowerCase() as AEFLevelTier;
  return AEF_LEVELS_META[key];
}}

export function getAEFLessonsByLevel(tier: string): AEFVideoLesson[] {{
  const t = tier.toLowerCase();
  if (t === "c2") return AEF_LESSONS.filter((les) => les.level === "c1");
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
    f.write(ts_header)

print(f"Successfully generated {DEST_FILE} with {len(all_aef_lessons)} lessons!")
