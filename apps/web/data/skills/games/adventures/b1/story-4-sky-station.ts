import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4 (B1): The Secrets of Sky Station Orion (اسرار ایستگاه فضایی ارویون)
// Genre: Sci-Fi & Fantasy (فانتزی و علمی‌تخیلی)
// CEFR: B1 (Passive voice, past perfect, conditionals, modals, sci-fi/tech B1 vocab)
// Characters: Arthur (Cadet), Nova (holographic drone), Commander Vance, Dr. Thorne
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Arthur was an eighteen-year-old engineering cadet aboard Sky Station Orion, a massive solar research outpost orbiting four hundred miles above Earth. Accompanied by Nova, a floating sphere-shaped drone with expressive holographic blue eyes, Arthur was performing his routine evening inspection. Suddenly, an amber warning chime chimed from the central greenhouse pod: an unexpected energy surge had caused the glass ceiling shields to lock open, exposing experimental bioluminescent seedlings to cosmic solar winds.",
    keywords: [
      { word: "outpost", meaningFa: "پایگاه و ایستگاه دیده‌بانی دورافتاده", phonetic: "/ˈaʊtpəʊst/" },
      { word: "drone", meaningFa: "پهپاد شناور هوشمند", phonetic: "/drəʊn/" },
      { word: "bioluminescent", meaningFa: "زیست‌تاب و دارای نور طبیعی در تاریکی", phonetic: "/ˌbaɪəʊˌluːmɪˈnesnt/" },
      { word: "seedlings", meaningFa: "نهال‌ها و جوانه‌های تازه روییده", phonetic: "/ˈsiːdlɪŋz/" },
    ],
    question: {
      promptEn: "What caused the emergency warning chime in the greenhouse pod?",
      promptFa: "چه چیزی باعث به صدا درآمدن هشدار اضطراری در گلخانه فضایی شد؟",
      options: [
        "An unexpected energy surge locked the ceiling shields open",
        "A water pipe burst inside the cafeteria",
        "Someone dropped a magnetic wrench on the floor",
      ],
      correctIndex: 0,
      hintSnippet: "an unexpected energy surge had caused the glass ceiling shields to lock open",
      clueFa: "خط آخر رو نگاه کن دوست خوبم؛ نوسان ناگهانی انرژی باعث شد سپرهای سقف باز بمونن.",
    },
    choiceA: {
      labelEn: "Sprint directly to the greenhouse pod to inspect the glowing seedlings!",
      labelFa: "سریعاً به بخش گلخانه فضایی برو تا وضعیت جوانه‌های درخشان رو بررسی کنی!",
      descriptionFa: "محافظت از گیاهان بلورین در برابر تابش مستقیم خورشید.",
    },
    choiceB: {
      labelEn: "Access the auxiliary solar maintenance terminal to reset the circuit breaker!",
      labelFa: "پایانه کنترل کمکی خورشیدی رو باز کن تا فیوزها و مدارها رو بازنشانی کنی!",
      descriptionFa: "قطع جریان نوسان قبل از آسیب رسیدن به باتری‌های اصلی.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Arthur rushed through the pressurized airlock into the botanical dome. The scene was breathtaking: hundreds of crystal-like alien orchids were glowing in pulsing ultraviolet and emerald waves, feeding off the cosmic starlight. Nova scanned the flora with an analysis laser, chiming excitedly: 'Cadet Arthur! These plants are absorbing solar radiation and converting it into pure clean oxygen at ten times normal efficiency!'",
    keywords: [
      { word: "pressurized", meaningFa: "دارای فشار هوای تنظیم‌شده", phonetic: "/ˈpreʃəraɪzd/" },
      { word: "ultraviolet", meaningFa: "نور فرابنفش", phonetic: "/ˌʌltrəˈvaɪələt/" },
      { word: "radiation", meaningFa: "تشعشع و پرتوهای کیهانی", phonetic: "/ˌreɪdiˈeɪʃn/" },
      { word: "efficiency", meaningFa: "بازدهی و راندمان کاری", phonetic: "/ɪˈfɪʃnsi/" },
    ],
    question: {
      promptEn: "What were the crystal orchids converting solar radiation into?",
      promptFa: "ارکیده‌های بلورین تشعشعات خورشیدی را به چه چیزی تبدیل می‌کردند؟",
      options: [
        "Pure clean oxygen at ten times normal efficiency",
        "Heavy poisonous gases",
        "Drops of hot chemical oil",
      ],
      correctIndex: 0,
      hintSnippet: "converting it into pure clean oxygen at ten times normal efficiency",
      clueFa: "خط آخر رو بخون؛ اکسیژن خالص و تمیز با بازدهی ده برابر تولید می‌کردند.",
    },
    choiceA: {
      labelEn: "Synthesize the botanical oxygen into the station's main life-support grid!",
      labelFa: "اکسیژن پاک گیاهی رو وارد مدار پشتیبانی حیات اصلی ایستگاه کن!",
      descriptionFa: "هوای تازه و سرشار از طراوت تمام بخش‌های ایستگاه رو پر می‌کنه.",
    },
    choiceB: {
      labelEn: "Harvest a pollen sample to analyze its genetic resilience!",
      labelFa: "نمونه‌ای از گرده‌های درخشان گیاه رو برای تحلیل مقاومت ژنتیکی بردار!",
      descriptionFa: "کشف راز مقاومت زیستی در برابر سرمای فضا.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Arthur slid open the maintenance console beneath the solar junction box. Thick fiber-optic cables glowed with an unusual harmonic frequency. When Nova interfaced with the system, the drone displayed an encrypted transmission originating not from Earth, but from an automated deep-space research probe that had gone missing twelve years ago near the asteroid belt.",
    keywords: [
      { word: "console", meaningFa: "میز فرمان و پایانه کنترل الکترونیکی", phonetic: "/ˈkɒnsəʊl/" },
      { word: "frequency", meaningFa: "فرکانس و نوسان امواج", phonetic: "/ˈfriːkwənsi/" },
      { word: "interfaced", meaningFa: "متصل شد و ارتباط داده‌ای برقرار کرد", phonetic: "/ˈɪntəfeɪst/" },
      { word: "probe", meaningFa: "کاوشگر فضایی خودکار بدون سرنشین", phonetic: "/prəʊb/" },
    ],
    question: {
      promptEn: "Where did the encrypted transmission originate from?",
      promptFa: "پیام رمزگذاری‌شده از کجا منشأ گرفته بود؟",
      options: [
        "From an automated deep-space probe missing for twelve years",
        "From a television broadcast station in London",
        "From a commercial cargo airplane over the Pacific",
      ],
      correctIndex: 0,
      hintSnippet: "originating not from Earth, but from an automated deep-space research probe that had gone missing twelve years ago",
      clueFa: "خط آخر رو نگاه کن؛ از کاوشگر فضایی که دوازده سال پیش گم شده بود.",
    },
    choiceA: {
      labelEn: "Deploy Station Orion's long-range dish antenna to lock the signal!",
      labelFa: "آنتن بشقابی دوربرد ایستگاه ارویون رو برای قفل روی فرکانس سیگنال فعال کن!",
      descriptionFa: "دریافت بسته‌های داده‌ای از لبه منظومه شمسی.",
    },
    choiceB: {
      labelEn: "Reroute power to safely download the probe's astronomical telemetry!",
      labelFa: "مسیر برق رو هدایت کن تا داده‌های رصد فضایی کاوشگر دانلود بشن!",
      descriptionFa: "نقشه‌های باارزشی از کمربند سیارک‌ها به دست میاد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Arthur rerouted the oxygen ducts through the central biosphere manifold. Instantly, a revitalizing rush of crisp mountain-like air circulated throughout every dormitory and laboratory. Commander Vance, who had been struggling with station ventilation issues for weeks, marched into the greenhouse dome with his eyes wide in astonishment at Arthur's brilliant initiative.",
    keywords: [
      { word: "manifold", meaningFa: "چندراهی لوله‌کشی و تقسیم‌کننده جریان", phonetic: "/ˈmænɪfəʊld/" },
      { word: "revitalizing", meaningFa: "حیات‌بخش و نشاط‌آفرین", phonetic: "/ˌriːˈvaɪtəlaɪzɪŋ/" },
      { word: "ventilation", meaningFa: "سیستم تهویه هوا", phonetic: "/ˌventɪˈleɪʃn/" },
    ],
    question: {
      promptEn: "How did the air throughout the station feel after Arthur's initiative?",
      promptFa: "هوای درون ایستگاه پس از ابتکار عمل آرتور چه حسی داشت؟",
      options: [
        "A revitalizing rush of crisp mountain-like air",
        "Hot and smoky like a furnace",
        "Smelled of burning rubber",
      ],
      correctIndex: 0,
      hintSnippet: "a revitalizing rush of crisp mountain-like air circulated throughout every dormitory",
      clueFa: "خط دوم رو ببین؛ هوایی شبیه هوای تازه و خنک کوهستان به گردش درآمد.",
    },
    choiceA: {
      labelEn: "Propose building a permanent orbital botanical garden module!",
      labelFa: "پیشنهاد ساخت بخش دائمی باغ گیاه‌شناسی مداری رو ارائه بده!",
      descriptionFa: "تبدیل ایستگاه به پایگاهی سرسبز و خودکفا در فضا.",
    },
    choiceB: {
      labelEn: "Distribute starter seedlings to all research crew cabins!",
      labelFa: "نهال‌های کوچک بلورین رو در تمام اتاق‌های خدمه پخش کن!",
      descriptionFa: "هر فضانورد یک گل زنده و درخشان در اتاقش خواهد داشت.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Using precision micro-tweezers, Arthur collected a pinch of the golden-green pollen into a vacuum vial. Under the electron microscope, the cellular structure resembled crystalline honeycomb capable of storing electrical charge like a biological super-battery. Chief Biologist Dr. Thorne gasped: 'Cadet, you have unlocked the key to sustainable clean bio-energy!'",
    keywords: [
      { word: "micro-tweezers", meaningFa: "پنس بسیار ظریف میکروسکوپی", phonetic: "/ˈmaɪkrəʊ ˈtwiːzəz/" },
      { word: "honeycomb", meaningFa: "شانه عسل طبیعی شش‌ضلعی", phonetic: "/ˈhʌnikəʊm/" },
      { word: "sustainable", meaningFa: "پایدار و سازگار با محیط‌زیست", phonetic: "/səˈsteɪnəbl/" },
    ],
    question: {
      promptEn: "What did the pollen's cellular structure resemble under the microscope?",
      promptFa: "ساختار سلولی گرده‌ها زیر میکروسکوپ شبیه چه چیزی بود؟",
      options: [
        "A crystalline honeycomb capable of storing electrical charge",
        "A chaotic blob of gray dust",
        "Ordinary flower seeds",
      ],
      correctIndex: 0,
      hintSnippet: "resembled crystalline honeycomb capable of storing electrical charge",
      clueFa: "خط دوم رو ببین عزیزم؛ شبیه لانه زنبور بلورین که بار الکتریکی ذخیره می‌کرد.",
    },
    choiceA: {
      labelEn: "Charge a bio-battery cell to demonstrate zero-emission orbital power!",
      labelFa: "یک سلول باتری زیستی بساز تا انرژی پاک بدون آلایندگی رو آزمایش کنی!",
      descriptionFa: "تولید برقی درخشان از نور و گرده‌های طبیعی گیاهان.",
    },
    choiceB: {
      labelEn: "Seed the bio-crystal cells into Orion's exterior hull panels!",
      labelFa: "سلول‌های بلورزیستی رو روی پوشش بیرونی بدنه ایستگاه پیوند بزن!",
      descriptionFa: "بدنه ایستگاه شبیه ستاره‌ای زمردین در فضا می‌درخشد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Nova calculated the trajectory of the distant signal while Arthur guided the forty-meter parabolic dish antenna toward the constellation of Orion. The telemetry receiver flared green as high-resolution telemetry streamed across the monitors: the lost deep-space probe had mapped an ancient hollow asteroid containing an icy subterranean ocean and organic molecules.",
    keywords: [
      { word: "trajectory", meaningFa: "مسیر پرواز و زاویه حرکت در فضا", phonetic: "/trəˈdʒektəri/" },
      { word: "parabolic", meaningFa: "سهموی و مقعر (آنتن‌های کاسه‌ای)", phonetic: "/ˌpærəˈbɒlɪk/" },
      { word: "subterranean", meaningFa: "زیرزمینی و مدفون در اعماق پوسته", phonetic: "/ˌsʌbtəˈreɪniən/" },
    ],
    question: {
      promptEn: "What had the lost deep-space probe discovered inside the hollow asteroid?",
      promptFa: "کاوشگر گمشده در اعماق سیارک توخالی چه چیزی کشف کرده بود؟",
      options: [
        "An icy subterranean ocean and organic molecules",
        "An empty desert of dry red dust",
        "A lost pirate spacecraft",
      ],
      correctIndex: 0,
      hintSnippet: "mapped an ancient hollow asteroid containing an icy subterranean ocean and organic molecules",
      clueFa: "خط آخر رو نگاه کن؛ اقیانوس یخی زیرپوستی و مولکول‌های آلی حیات.",
    },
    choiceA: {
      labelEn: "Broadcast the historic cosmic ocean discovery to World Space Command!",
      labelFa: "کشف تاریخی اقیانوس کیهانی رو به فرماندهی کل فضا در زمین مخابره کن!",
      descriptionFa: "بزرگترین خبر علمی قرن در رسانه‌های جهان طنین‌انداز می‌شه.",
    },
    choiceB: {
      labelEn: "Program the probe to collect and return a pristine ice core sample!",
      labelFa: "به کاوشگر دستور بده نمونه‌ای از هسته یخی بردارد و به سمت زمین پرواز کند!",
      descriptionFa: "رسیدن نمونه فیزیکی از اعماق منظومه شمسی به دست دانشمندان.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Arthur stabilized the power transfer by linking three spare helium cooling loops to the communications processor. As the telemetry finished downloading, Nova projected an interactive three-dimensional star map in the center of the control bridge: it was a complete cosmic navigational atlas charting safe corridors through solar flare storms.",
    keywords: [
      { word: "processor", meaningFa: "پردازنده کامپیوتری", phonetic: "/ˈprəʊsesə/" },
      { word: "corridors", meaningFa: "راهروها و مسیرهای امن ناوبری", phonetic: "/ˈkɒrɪdɔːz/" },
      { word: "flares", meaningFa: "زبانه و فوران‌های شدید خورشیدی", phonetic: "/fleəz/" },
    ],
    question: {
      promptEn: "What did Nova project in the center of the control bridge?",
      promptFa: "نوا در مرکز پل فرماندهی چه تصویری را نمایش داد؟",
      options: [
        "An interactive 3D star map charting safe cosmic corridors",
        "A funny video of a cartoon dog",
        "A blank black screen",
      ],
      correctIndex: 0,
      hintSnippet: "projected an interactive three-dimensional star map in the center of the control bridge",
      clueFa: "خط دوم رو ببین؛ نقشه سه‌بعدی تعاملی ستارگان با مسیرهای امن از میان طوفان‌های خورشیدی.",
    },
    choiceA: {
      labelEn: "Integrate the cosmic atlas into all commercial spaceflight navigation systems!",
      labelFa: "اطلس کیهانی رو در سیستم ناوبری سفینه‌های فضایی تجاری بارگذاری کن!",
      descriptionFa: "سفرهای بین‌سیاره‌ای برای همیشه امن و بی‌خطر می‌شوند.",
    },
    choiceB: {
      labelEn: "Pilot Sky Station Orion along the newly mapped safe solar corridor!",
      labelFa: "ایستگاه ارویون رو در امتداد دالان امن خورشیدی تازه کشف‌شده به پرواز درآور!",
      descriptionFa: "ورود به مدار جدید با دید بی‌نظیر از خورشید و زمین.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Commander Vance enthusiastically approved Arthur's blueprint for the 'Eden Bio-Dome'. Within hours, engineering teams had linked sixty growing modules along Orion's outer ring, transforming the cold metal station into a thriving, oxygen-rich orbital oasis filled with humming bees and sweet floral breezes.",
    keywords: [
      { word: "blueprint", meaningFa: "نقشه فنی و طرح اجرایی", phonetic: "/ˈbluːprɪnt/" },
      { word: "oasis", meaningFa: "واحه و بهشت سرسبز در دل بیابان یا فضا", phonetic: "/əʊˈeɪsɪs/" },
      { word: "thriving", meaningFa: "شکوفا، پرطراوت و بالنده", phonetic: "/ˈθraɪvɪŋ/" },
    ],
    question: {
      promptEn: "What was the newly expanded orbital greenhouse named?",
      promptFa: "بخش جدید گلخانه فضایی توسعه‌یافته چه نام گرفت؟",
      options: [
        "The Eden Bio-Dome",
        "The Steel Cage",
        "The Dark Tunnel",
      ],
      correctIndex: 0,
      hintSnippet: "approved Arthur's blueprint for the 'Eden Bio-Dome'",
      clueFa: "خط اول رو بخون؛ نام آن «زیست‌گنبد بهشت (Eden Bio-Dome)» بود.",
    },
    choiceA: {
      labelEn: "Host the first Orbital Harvest Festival for all space station crews!",
      labelFa: "اولین جشنواره برداشت محصول مداری را برای تمام فضانوردان برپا کن!",
      descriptionFa: "میوه‌ها و سبزیجات تازه فضایی در ضیافتی بی‌نظیر.",
    },
    choiceB: {
      labelEn: "Deliver experimental seeds to future lunar agricultural colonies!",
      labelFa: "بذرهای سازگار را برای کلونی‌های کشاورزی روی کره ماه ارسال کن!",
      descriptionFa: "سرسبز کردن نخستین سکونت‌گاه‌های انسانی در ماه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Crew members gathered in the common room as Arthur distributed small glowing crystal orchids. The gentle violet-green illumination replaced harsh fluorescent lights with natural twilight, instantly lowering astronaut stress levels and improving sleep cycles across the outpost.",
    keywords: [
      { word: "fluorescent", meaningFa: "مهتابی و فلورسنت مصنوعی", phonetic: "/ˌflɔːˈresnt/" },
      { word: "illumination", meaningFa: "روشنایی و نورافشانی دلنشین", phonetic: "/ɪˌluːmɪˈneɪʃn/" },
      { word: "astronaut", meaningFa: "فضانورد و کیهان‌نورد", phonetic: "/ˈæstrənɔːt/" },
    ],
    question: {
      promptEn: "What effect did the crystal orchids have on the crew?",
      promptFa: "ارکیده‌های بلورین چه تاثیری بر خدمه ایستگاه گذاشتند؟",
      options: [
        "Lowered stress levels and improved sleep cycles",
        "Caused headaches and coughing",
        "Made everyone hungry for chocolate",
      ],
      correctIndex: 0,
      hintSnippet: "lowering astronaut stress levels and improving sleep cycles across the outpost",
      clueFa: "خط آخر رو نگاه کن؛ استرس را کاهش داد و خواب فضانوردان را بهبود بخشید.",
    },
    choiceA: {
      labelEn: "Design a standardized Bio-Luminesce personal wellness kit for space travelers!",
      labelFa: "بسته سلامتی آرامش‌بخش زیست‌تاب رو برای همه مسافران فضا استانداردسازی کن!",
      descriptionFa: "روشی نوین برای حفظ روحیه و نشاط در مأموریت‌های طولانی.",
    },
    choiceB: {
      labelEn: "Compose a tranquil starlight meditation session in the observation cupola!",
      labelFa: "یک جلسه مراقبه زیر نور ستارگان در برجک دیده‌بانی ایستگاه برگزار کن!",
      descriptionFa: "آرامشی عمیق در تماشای گردش کره زمین از پنجره‌های شیشه‌ای.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Arthur connected the palm-sized crystal bio-battery to an auxiliary solar thruster. When activated, the unit produced a brilliant, steady azure pulse with zero heat waste. Dr. Thorne logged the milestone: Cadet Arthur had invented the first self-charging organic spacecraft battery.",
    keywords: [
      { word: "auxiliary", meaningFa: "کمکی و پشتیبان", phonetic: "/ɔːɡˈzɪliəri/" },
      { word: "thruster", meaningFa: "پیشرانه و موتور رانشگر سفینه", phonetic: "/ˈθrʌstə/" },
      { word: "milestone", meaningFa: "نقطه عطف تاریخی و دستاورد بزرگ", phonetic: "/ˈmaɪlstəʊn/" },
    ],
    question: {
      promptEn: "What did Arthur invent with the palm-sized crystal battery?",
      promptFa: "آرتور با باتری زیستی بلورین چه چیزی اختراع کرد؟",
      options: [
        "The first self-charging organic spacecraft battery",
        "A toy laser gun",
        "A mechanical egg-timer",
      ],
      correctIndex: 0,
      hintSnippet: "had invented the first self-charging organic spacecraft battery",
      clueFa: "خط آخر رو بخون؛ اولین باتری زیستی خودشارژشونده برای فضاپیماها.",
    },
    choiceA: {
      labelEn: "Power an experimental deep-space ion shuttle with bio-batteries!",
      labelFa: "یک شاتل فضایی پیشرفته یونی رو با باتری‌های زیستی به پرواز درآور!",
      descriptionFa: "سفری بی‌صدا و بدون آلایندگی به دورترین نقاط مدار.",
    },
    choiceB: {
      labelEn: "Transmit the open-source bio-battery patent to universities on Earth!",
      labelFa: "طرح رایگان ثبت اختراع باتری زیستی رو برای تمام دانشگاه‌های زمین ارسال کن!",
      descriptionFa: "هدیه‌ای بزرگ برای نجات محیط‌زیست و هوای پاک سیاره زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The bio-crystal coating spread smoothly across Orion's outer titanium shields, creating a living membrane that absorbed micrometeorite impacts and radiated an ethereal aurora-like glow. Viewed from Earth through telescopes, Station Orion appeared like a peaceful emerald evening star gliding through the heavens.",
    keywords: [
      { word: "membrane", meaningFa: "پوسته محافظ و غشای زنده", phonetic: "/ˈmembreɪn/" },
      { word: "micrometeorite", meaningFa: "شهاب‌سنگ‌های بسیار ریز سرگردان در فضا", phonetic: "/ˌmaɪkrəʊˈmiːtiəraɪt/" },
      { word: "ethereal", meaningFa: "اثیری، آسمانی و رویایی", phonetic: "/iˈθɪəriəl/" },
    ],
    question: {
      promptEn: "How did Station Orion appear to people viewing through telescopes on Earth?",
      promptFa: "ایستگاه ارویون از پشت تلسکوپ‌های روی زمین چه شکلی دیده می‌شد؟",
      options: [
        "Like a peaceful emerald evening star gliding through the heavens",
        "Like a smoky black smudge in the clouds",
        "Completely invisible",
      ],
      correctIndex: 0,
      hintSnippet: "appeared like a peaceful emerald evening star gliding through the heavens",
      clueFa: "خط آخر رو ببین؛ مثل یک ستاره شامگاهی زمردین و درخشان در آسمان شب.",
    },
    choiceA: {
      labelEn: "Name the station the 'Emerald Star of Orion' in global observatories!",
      labelFa: "نام ایستگاه رو در تمام رصدخانه‌های جهان «ستاره زمردین ارویون» ثبت کن!",
      descriptionFa: "نمادی درخشان از صلح و دانش بر فراز کره زمین.",
    },
    choiceB: {
      labelEn: "Broadcast a live high-definition tour of the glowing living hull!",
      labelFa: "یک پخش زنده باکیفیت از بدنه درخشان و زنده ایستگاه برای مردم زمین بگذار!",
      descriptionFa: "میلیون‌ها نفر محو تماشای این شاهکار زیست‌مهندسی می‌شوند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "The United Nations Space Agency erupted in celebration as Arthur's broadcast confirmed the subterranean ocean. Deep within Asteroid 'Vesta-Nine', warm hydrothermal vents were supporting active microbial ecosystems, proving conclusively that life flourished in our solar neighborhood.",
    keywords: [
      { word: "hydrothermal", meaningFa: "آب‌گرمابی ناشی از گرمای درونی سنگ‌ها", phonetic: "/ˌhaɪdrəʊˈθɜːml/" },
      { word: "microbial", meaningFa: "میکروبی و تک‌سلولی زنده", phonetic: "/maɪˈkrəʊbiəl/" },
      { word: "flourished", meaningFa: "شکوفا شد و رونق پیدا کرد", phonetic: "/ˈflʌrɪʃt/" },
    ],
    question: {
      promptEn: "What did the hydrothermal vents on Asteroid Vesta-Nine support?",
      promptFa: "دریچه‌های آب‌گرمابی سیارک وستا-۹ از چه چیزی پشتیبانی می‌کردند؟",
      options: [
        "Active microbial ecosystems",
        "Large metal factories",
        "Underwater amusement parks",
      ],
      correctIndex: 0,
      hintSnippet: "hydrothermal vents were supporting active microbial ecosystems",
      clueFa: "خط ماقبل آخر رو بخون عزیزم؛ بوم‌سازگان‌های فعال میکروبی زنده.",
    },
    choiceA: {
      labelEn: "Charter the flagship exploration vessel *Odyssey One* to explore the ocean!",
      labelFa: "سفینه پرچمدار «ادیسه ۱» رو برای کاوش مستقیم این اقیانوس کیهانی اعزام کن!",
      descriptionFa: "نخستین سفر اکتشافی سرنشین‌دار به سیارک حاوی آب.",
    },
    choiceB: {
      labelEn: "Establish an international scientific research station in Vesta orbit!",
      labelFa: "یک ایستگاه پژوهشی بین‌المللی در مدار سیارک وستا تأسیس کن!",
      descriptionFa: "همکاری دانشمندان تمام کشورهای جهان در یک پروژه مشترک.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Arthur transmitted complex docking algorithms that guided the ancient probe safely into Orion's recovery hangar. Inside the pressurized bay, automated mechanical arms transferred a sealed titanium canister containing three liters of pristine, extraterrestrial glacial water.",
    keywords: [
      { word: "algorithms", meaningFa: "الگوریتم‌های محاسباتی برنامه‌ریزی", phonetic: "/ˈælɡərɪðəmz/" },
      { word: "canister", meaningFa: "کپسول و محفظه استوانه‌ای فلزی محکم", phonetic: "/ˈkænɪstə/" },
      { word: "extraterrestrial", meaningFa: "فرازمینی و متعلق به ورای سیاره زمین", phonetic: "/ˌekstrətəˈrestriəl/" },
    ],
    question: {
      promptEn: "What was inside the sealed titanium canister brought back by the probe?",
      promptFa: "درون کپسول تیتانیومی که کاوشگر آورد چه چیزی قرار داشت؟",
      options: [
        "Three liters of pristine extraterrestrial glacial water",
        "A pile of moon stones",
        "A broken radio antenna",
      ],
      correctIndex: 0,
      hintSnippet: "containing three liters of pristine, extraterrestrial glacial water",
      clueFa: "خط آخر رو ببین؛ سه لیتر آب زلال یخچالی باستانی فرازمینی.",
    },
    choiceA: {
      labelEn: "Analyze the extraterrestrial water for prebiotic amino acids!",
      labelFa: "آب باستانی رو برای یافتن آمینواسیدهای منشأ حیات آزمایش کن!",
      descriptionFa: "کشف راز چگونگی شکل‌گیری نخستین سلول‌های زنده.",
    },
    choiceB: {
      labelEn: "Nourish an experimental orchid seedling with the ancient water!",
      labelFa: "یکی از جوانه‌های گل بلورین رو با این آب کهن آبیاری کن!",
      descriptionFa: "شاید گیاهی با توانایی‌های خارق‌العاده جدید جوانه بزند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Within forty-eight hours of Arthur uploading the cosmic navigational atlas, commercial freighters across the solar system integrated the safe corridors. Solar flare transit delays dropped by ninety-five percent, saving billions of credits and protecting thousands of long-haul pilots.",
    keywords: [
      { word: "freighters", meaningFa: "سفینه‌های باربری بزرگ فضایی", phonetic: "/ˈfreɪtəz/" },
      { word: "transit", meaningFa: "ترانزیت و عبور در مسیرها", phonetic: "/ˈtrænzɪt/" },
      { word: "long-haul", meaningFa: "سفرهای بسیار طولانی و دوربرد", phonetic: "/ˈlɒŋ hɔːl/" },
    ],
    question: {
      promptEn: "By how much did solar flare transit delays drop after the atlas was integrated?",
      promptFa: "پس از به‌کارگیری اطلس کیهانی، تاخیرهای ناشی از طوفان خورشیدی چقدر کاهش یافت؟",
      options: [
        "By ninety-five percent",
        "By only one percent",
        "They did not change at all",
      ],
      correctIndex: 0,
      hintSnippet: "transit delays dropped by ninety-five percent",
      clueFa: "خط ماقبل آخر رو بخون؛ نود و پنج درصد کاهش پیدا کرد.",
    },
    choiceA: {
      labelEn: "Receive the Interplanetary Guild of Navigators' Grand Gold Sextant!",
      labelFa: "نشان سکستانت طلایی صنف ناوبران بین‌سیاره‌ای رو دریافت کن!",
      descriptionFa: "بالاترین افتخار برای مهندسان ناوبری فضایی.",
    },
    choiceB: {
      labelEn: "Found the 'Arthur-Nova Navigation Institute' to train future cadets!",
      labelFa: "آموزشکده ناوبری آرتور و نوا رو برای آموزش فضانوردان جوان تأسیس کن!",
      descriptionFa: "تربیت نسلی جدید از پیشگامان سفرهای کیهانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Station Orion eased into the golden solar corridor, its massive solar arrays catching the cleanest photonic currents in solar orbit. From the forward observation lounge, Earth and the Moon looked like two luminous sapphire marbles floating peacefully against the infinite velvet backdrop of space.",
    keywords: [
      { word: "photonic", meaningFa: "فوتونی و وابسته به ذرات نور", phonetic: "/fəʊˈtɒnɪk/" },
      { word: "luminous", meaningFa: "تابان و درخشان", phonetic: "/ˈluːmɪnəs/" },
      { word: "sapphire", meaningFa: "یاقوت کبود نیلگون", phonetic: "/ˈsæfaɪə/" },
    ],
    question: {
      promptEn: "What did Earth and the Moon look like from the forward observation lounge?",
      promptFa: "زمین و ماه از سالن دیده‌بانی جلو شبیه چه چیزی به نظر می‌رسیدند؟",
      options: [
        "Two luminous sapphire marbles floating peacefully",
        "Two burning red fireballs",
        "Flat gray plates",
      ],
      correctIndex: 0,
      hintSnippet: "looked like two luminous sapphire marbles floating peacefully",
      clueFa: "خط آخر رو ببین دوست خوبم؛ دو تیله درخشان از جنس یاقوت کبود.",
    },
    choiceA: {
      labelEn: "Broadcast a heartfelt peace message to all people watching on Earth!",
      labelFa: "پیام صلح و دوستی پراحساسی برای تمام ساکنان زمین مخابره کن!",
      descriptionFa: "صدایی از فضا که دل‌های همه انسان‌ها رو به هم نزدیک می‌کنه.",
    },
    choiceB: {
      labelEn: "Toast with synthetic starlight tea alongside Nova under the stars!",
      labelFa: "همراه با نوا چای ستاره‌ای بنوش و به افق بیکران خیره شو!",
      descriptionFa: "لحظاتی سرشار از آرامش در میان کهکشان‌ها.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The first Orbital Harvest Festival was an overwhelming success: astronauts ate crisp zero-gravity strawberries and danced to festive music beneath the bioluminescent crystal vines.",
    keywords: [{ word: "zero-gravity", meaningFa: "بی‌وزنی مطلق در فضا", phonetic: "/ˈzɪərəʊ ˈɡrævəti/" }],
    question: {
      promptEn: "What fresh fruit did astronauts eat at the festival?",
      promptFa: "فضانوردان در جشن چه میوه تازه‌ای نوش جان کردند؟",
      options: ["Crisp zero-gravity strawberries", "Frozen dried powders", "Salted chips"],
      correctIndex: 0,
      hintSnippet: "ate crisp zero-gravity strawberries and danced to festive music",
      clueFa: "توت‌فرنگی‌های ترد و تازه پرورش‌یافته در بی‌وزنی.",
    },
    choiceA: {
      labelEn: "Establish an annual 'Space Farmer's Day' across all orbital stations!",
      labelFa: "روز سالانه کشاورزان فضایی را در تمام ایستگاه‌های مداری ثبت کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Send fresh orbital strawberry baskets to pediatric hospitals on Earth!",
      labelFa: "سبدهایی از توت‌فرنگی‌های فضایی را برای کودکان بیمارستان‌های زمین بفرستید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "On the Moon's Shackleton Crater base, the crystal seedlings took root inside pressurized lunar lava tubes, producing the first self-sustaining lunar farm in human history.",
    keywords: [{ word: "self-sustaining", meaningFa: "خودکفا و بدون نیاز به منابع بیرونی", phonetic: "/ˌself səˈsteɪnɪŋ/" }],
    question: {
      promptEn: "Where were the crystal seedlings planted on the Moon?",
      promptFa: "نهال‌های بلورین در کجای کره ماه کاشته شدند؟",
      options: ["Inside pressurized lunar lava tubes in Shackleton Crater", "On the open dusty ground", "Inside a rocket engine"],
      correctIndex: 0,
      hintSnippet: "inside pressurized lunar lava tubes, producing the first self-sustaining lunar farm",
      clueFa: "درون تونل‌های گدازه‌ای ماه در دهانه شکلتون.",
    },
    choiceA: {
      labelEn: "Cut the ceremonial ribbon opening the 'Arthur Lunar Biosphere'!",
      labelFa: "روبان افتتاح زیست‌کره قمری آرتور را قیچی کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Taste the first fresh green tea grown on the lunar surface!",
      labelFa: "نخستین چای سبز روییده بر خاک ماه را با دانشمندان نوش جان کنید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The 'Bio-Luminesce Wellness Kit' became standard equipment for every crew member flying to Mars, reducing deep-space insomnia to zero throughout long multi-year journeys.",
    keywords: [{ word: "insomnia", meaningFa: "بی‌خوابی و اختلال در خواب", phonetic: "/ɪnˈsɒmniə/" }],
    question: {
      promptEn: "What did the wellness kit reduce to zero on long journeys to Mars?",
      promptFa: "بسته سلامتی در سفرهای طولانی مریخ چه مشکلی را کاملاً ریشه‌کن کرد؟",
      options: ["Deep-space insomnia", "Engine malfunctions", "Radio noise"],
      correctIndex: 0,
      hintSnippet: "reducing deep-space insomnia to zero throughout long multi-year journeys",
      clueFa: "بی‌خوابی‌های طولانی در اعماق فضا.",
    },
    choiceA: {
      labelEn: "Receive the World Health Organization's Astronautics Medal!",
      labelFa: "مدال فضانوردی سازمان بهداشت جهانی را دریافت کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Install wellness bioluminescent gardens on the first Mars Colony ship!",
      labelFa: "باغ‌های زیست‌تاب را در نخستین فضاپیمای مسافران مریخ نصب کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Floating in zero-gravity in the glass cupola surrounded by pulsing violet orchids, the crew held hands, feeling profound unity with Earth glowing blue beneath their feet.",
    keywords: [{ word: "profound", meaningFa: "عمیق، شگرف و تأثیرگذار", phonetic: "/prəˈfaʊnd/" }],
    question: {
      promptEn: "What color did Earth glow beneath the astronauts' feet?",
      promptFa: "کره زمین زیر پای فضانوردان با چه رنگی می‌درخشید؟",
      options: ["Glowing blue", "Bright red", "Pitch black"],
      correctIndex: 0,
      hintSnippet: "feeling profound unity with Earth glowing blue beneath their feet",
      clueFa: "با رنگ آبی درخشان و آرامش‌بخش.",
    },
    choiceA: {
      labelEn: "Record an ambient space podcast with Nova to inspire dreamers on Earth!",
      labelFa: "پادکست آرامش‌بخش کیهانی همراه با نوا ضبط کنید تا الهام‌بخش مردم باشد!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Dedicate the cupola as the 'Sanctuary of Human Peace'!",
      labelFa: "برجک شیشه‌ای را به عنوان نماد صلح پایدار بشریت نام‌گذاری کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The bio-powered ion shuttle completed its maiden voyage around the Moon using eighty percent less fuel than traditional chemical craft, inaugurating a clean green era for spaceflight.",
    keywords: [{ word: "maiden", meaningFa: "نخستین و آغازین (اولین پرواز رسمی)", phonetic: "/ˈmeɪdn/" }],
    question: {
      promptEn: "How much less fuel did the bio-powered ion shuttle use?",
      promptFa: "شاتل یونی زیستی چقدر سوخت کمتری نسبت به راکت‌های سنتی مصرف کرد؟",
      options: ["Eighty percent less fuel", "Only five percent less", "More fuel than before"],
      correctIndex: 0,
      hintSnippet: "using eighty percent less fuel than traditional chemical craft",
      clueFa: "هشتاد درصد سوخت کمتر مصرف کرد.",
    },
    choiceA: {
      labelEn: "Christen the shuttle *Nova One* in honor of Arthur's loyal drone!",
      labelFa: "نام شاتل را به افتخار پهپاد وفادار آرتور «نوا ۱» بگذارید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Lead the first eco-friendly student expedition to the orbital ring!",
      labelFa: "نخستین سفر علمی پاک دانش‌آموزان به دور مدار زمین را هدایت کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Universities across six continents adopted Arthur's open-source bio-battery plans, replacing toxic lithium cells with clean plant-based energy storage within two years.",
    keywords: [{ word: "toxic", meaningFa: "سمی و آسیب‌رسان به طبیعت", phonetic: "/ˈtɒksɪk/" }],
    question: {
      promptEn: "What did Arthur's open-source bio-battery replace across six continents?",
      promptFa: "باتری زیستی آرتور در شش قاره جایگزین چه باتری‌هایی شد؟",
      options: ["Toxic lithium cells with clean plant-based storage", "Wooden clocks", "Water wheels"],
      correctIndex: 0,
      hintSnippet: "replacing toxic lithium cells with clean plant-based energy storage",
      clueFa: "باتری‌های سمی لیتیومی با ذخیره‌سازهای گیاهی پاک جایگزین شدند.",
    },
    choiceA: {
      labelEn: "Accept the Nobel Prize in Ecological Engineering in Stockholm!",
      labelFa: "جایزه نوبل مهندسی زیست‌محیطی را در استکهلم دریافت کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Build a youth environmental innovation laboratory in every country!",
      labelFa: "آزمایشگاه‌های نوآوری محیط‌زیست برای جوانان در کشورهای جهان بسازید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Global stargazers marveled every twilight as the 'Emerald Star of Orion' glided smoothly overhead, inspiring millions of children to look up and study the stars.",
    keywords: [{ word: "stargazers", meaningFa: "رصدگران و شیفتگان آسمان شب", phonetic: "/ˈstɑːɡeɪzəz/" }],
    question: {
      promptEn: "What did the glowing station inspire millions of children to do?",
      promptFa: "ایستگاه درخشان زمردین میلیون‌ها کودک را به چه کاری ترغیب کرد؟",
      options: ["To look up and study the stars", "To stay indoors with curtains closed", "To stop reading books"],
      correctIndex: 0,
      hintSnippet: "inspiring millions of children to look up and study the stars",
      clueFa: "به آسمان نگاه کنند و به مطالعه علم ستاره‌شناسی بپردازند.",
    },
    choiceA: {
      labelEn: "Launch an international telescope contest for student astronomers!",
      labelFa: "مسابقه سراسری عکاسی با تلسکوپ برای دانش‌آموزان برگزار کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Flash a friendly synchronized greeting beacon to Earth every evening!",
      labelFa: "هر غروب با پالس‌های نوری هماهنگ به مردم زمین سلام کیهانی بفرستید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Over four hundred million viewers tuned into Arthur and Nova's live video stream, watching water droplets float weightlessly among shimmering luminescent leaves.",
    keywords: [{ word: "weightlessly", meaningFa: "در بی‌وزنی و سبکبالی مطلق", phonetic: "/ˈweɪtləsli/" }],
    question: {
      promptEn: "How many people watched the live stream tour of the bio-station?",
      promptFa: "چند نفر پخش زنده گردش در ایستگاه زیستی را تماشا کردند؟",
      options: ["Over four hundred million viewers", "Ten people", "Fifty tourists"],
      correctIndex: 0,
      hintSnippet: "Over four hundred million viewers tuned into Arthur and Nova's live video stream",
      clueFa: "بیش از چهارصد میلیون نفر به صورت زنده تماشا کردند.",
    },
    choiceA: {
      labelEn: "Turn the live feed into a continuous global educational channel!",
      labelFa: "پخش زنده را به یک شبکه آموزشی دائمی برای تمام مدارس تبدیل کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Perform a playful floating acrobatics trick with Nova on camera!",
      labelFa: "یک شیرین‌کاری معلق در بی‌وزنی با نوا جلوی دوربین اجرا کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The flagship *Odyssey One* departed Earth orbit to thunderous international fanfare. Arthur was promoted to Lead Expedition Engineer, standing proudly on the bridge.",
    keywords: [{ word: "fanfare", meaningFa: "ساز و سرود جشن و هیاهوی باشکوه", phonetic: "/ˈfænfeə/" }],
    question: {
      promptEn: "What title was Arthur promoted to on the flagship Odyssey One?",
      promptFa: "آرتور به چه سمتی در سفینه پرچمدار ادیسه یک ارتقا یافت؟",
      options: ["Lead Expedition Engineer", "Assistant Janitor", "Cook's helper"],
      correctIndex: 0,
      hintSnippet: "Arthur was promoted to Lead Expedition Engineer",
      clueFa: "مهندس ارشد مأموریت اکتشافی شد.",
    },
    choiceA: {
      labelEn: "Navigate the flagship through the asteroid belt to Vesta-Nine!",
      labelFa: "سفینه را از میان کمربند سیارک‌ها به سوی سیارک وستا ۹ هدایت کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Engrave Nova's holographic emblem on the bridge console!",
      labelFa: "نماد هولوگرافیک نوا را روی میز فرماندهی سفینه حک کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Vesta Orbital Base was completed with contributions from forty nations, creating a bustling scientific hub where astrobiologists discovered twenty new microbial species.",
    keywords: [{ word: "astrobiologists", meaningFa: "زیست‌شناسان فضایی و کیهانی", phonetic: "/ˌæstrəʊbaɪˈɒlədʒɪsts/" }],
    question: {
      promptEn: "How many new microbial species did astrobiologists discover in the asteroid ocean?",
      promptFa: "زیست‌شناسان فضایی چند گونه جدید میکروبی در اقیانوس سیارک یافتند؟",
      options: ["Twenty new microbial species", "Zero", "Only one dead plant"],
      correctIndex: 0,
      hintSnippet: "astrobiologists discovered twenty new microbial species",
      clueFa: "بیست گونه میکروبی زنده و ناشناخته کشف کردند.",
    },
    choiceA: {
      labelEn: "Publish the Comprehensive Atlas of Extraterrestrial Biology!",
      labelFa: "اطلس جامع زیست‌شناسی فرازمینی را منتشر کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Build an underwater submarine drone to dive to the core vents!",
      labelFa: "یک زیردریایی خودکار برای شیرجه به اعماق اقیانوس سیارک بسازید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Mass spectrometry revealed that the Vesta water contained pristine ribose sugars and amino acids, matching the chemical ingredients that sparked primordial life on early Earth.",
    keywords: [{ word: "primordial", meaningFa: "نخستین و باستانی در بدو خلقت", phonetic: "/praɪˈmɔːdiəl/" }],
    question: {
      promptEn: "What chemical ingredients were confirmed in the extraterrestrial water?",
      promptFa: "چه ترکیبات شیمیایی در آب باستانی فرازمینی تأیید شد؟",
      options: ["Ribose sugars and amino acids", "Iron rust and sand", "Gasoline and motor oil"],
      correctIndex: 0,
      hintSnippet: "contained pristine ribose sugars and amino acids",
      clueFa: "قندهای ریبوز و اسیدهای آمینه که منشأ حیات هستند.",
    },
    choiceA: {
      labelEn: "Deliver the findings at the Royal Academy of Sciences in London!",
      labelFa: "یافته‌ها را در آکادمی سلطنتی علوم لندن ارائه دهید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Preserve the master water vial in a gold-plated vault for future generations!",
      labelFa: "شیشه اصلی آب را در محفظه طلاکاری‌شده برای آیندگان حفظ کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "When nourished with the ancient glacial water, the experimental crystal orchid grew five times faster, unfurling petals that emitted a gentle musical resonance when touched.",
    keywords: [{ word: "resonance", meaningFa: "طنین و ارتعاش ملودیک صوتی", phonetic: "/ˈrezənəns/" }],
    question: {
      promptEn: "What did the orchid petals emit when touched?",
      promptFa: "گلبرگ‌های ارکیده با لمس شدن چه صدایی ساطع می‌کردند؟",
      options: ["A gentle musical resonance", "A loud car horn", "A sizzling frying sound"],
      correctIndex: 0,
      hintSnippet: "unfurling petals that emitted a gentle musical resonance when touched",
      clueFa: "طنین ملایم و دلنشین موسیقایی تولید می‌کردند.",
    },
    choiceA: {
      labelEn: "Play an orbital concert with the singing crystal orchids!",
      labelFa: "کنسرتی فضایی با گل‌های بلورین آوازه‌خوان در مدار اجرا کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Gift a singing orchid to the International Space Museum!",
      labelFa: "یک شاخه از این گل شگفت‌انگیز را به موزه بین‌المللی فضا هدیه دهید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The Grand Gold Sextant was presented to Arthur and Nova before an assembly of ten thousand space pilots, honoring them for creating the safest navigation era in human history.",
    keywords: [{ word: "sextant", meaningFa: "زاویه‌یاب و سکستانت ناوبری کهن", phonetic: "/ˈsekstənt/" }],
    question: {
      promptEn: "Who attended the grand presentation of the Gold Sextant?",
      promptFa: "چه کسانی در مراسم اهدای سکستانت طلایی حضور داشتند؟",
      options: ["An assembly of ten thousand space pilots", "Three fishermen", "A group of chefs"],
      correctIndex: 0,
      hintSnippet: "before an assembly of ten thousand space pilots",
      clueFa: "مجمعی با حضور ده هزار خلبان و کاپیتان فضاپیما.",
    },
    choiceA: {
      labelEn: "Lead the honorary space parade across the lunar sky!",
      labelFa: "رژه باشکوه افتخاری را در آسمان ماه رهبری کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Engrave Nova's smiling face on the official navigation badge!",
      labelFa: "تصویر خندان نوا را روی مدال رسمی ناوبری کیهانی حک کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The Arthur-Nova Navigation Institute welcomed its first class of two hundred cadets, training passionate young students to map unexplored sectors of the deep galaxy.",
    keywords: [{ word: "unexplored", meaningFa: "دست‌نخورده و ناشناخته", phonetic: "/ˌʌnɪkˈsplɔːd/" }],
    question: {
      promptEn: "How many cadets joined the institute's first class?",
      promptFa: "چند کارآموز جوان در اولین دوره آموزشی آموزشکده ثبت‌نام کردند؟",
      options: ["Two hundred cadets", "Only five", "Ten thousand"],
      correctIndex: 0,
      hintSnippet: "welcomed its first class of two hundred cadets",
      clueFa: "دویست کارآموز پرشور و باانگیزه.",
    },
    choiceA: {
      labelEn: "Deliver the opening keynote lecture on cosmic curiosity!",
      labelFa: "سخنرانی افتتاحیه را درباره شجاعت و کنجکاوی علمی ایراد کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Equip every student cadet with a personal companion drone like Nova!",
      labelFa: "به هر کارآموز یک پهپاد هوشمند دوست‌داشتنی شبیه نوا هدیه دهید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Arthur's message of unity was translated into two hundred languages and displayed on giant screens in public squares worldwide, inspiring hope across generations.",
    keywords: [{ word: "unity", meaningFa: "وحدت، همبستگی و همدلی", phonetic: "/ˈjuːnəti/" }],
    question: {
      promptEn: "Into how many languages was Arthur's message of unity translated?",
      promptFa: "پیام همبستگی آرتور به چند زبان دنیا ترجمه شد؟",
      options: ["Two hundred languages", "Only one language", "Three languages"],
      correctIndex: 0,
      hintSnippet: "translated into two hundred languages and displayed on giant screens",
      clueFa: "به دویست زبان ترجمه و در میدان‌های جهان پخش شد.",
    },
    choiceA: {
      labelEn: "Designate the transmission day as the annual 'World Cosmos Holiday'!",
      labelFa: "روز این مخابره را روز جهانی کیهان و صلح نام‌گذاری کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Release a thousand biodegradable celebration balloons across capitals!",
      labelFa: "هزاران بالن کاغذی زیست‌تخریب‌پذیر را در پایتخت‌های جهان به هوا بفرستید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Sipping fragrant hot tea with Nova as Earth spun slowly beneath them, Arthur felt profound gratitude. Two friends from different worlds had made the stars a safer, greener home.",
    keywords: [{ word: "gratitude", meaningFa: "شکرگزاری و قدردانی عمیق قلبی", phonetic: "/ˈɡrætɪtjuːd/" }],
    question: {
      promptEn: "How did Arthur feel as Earth spun peacefully beneath them?",
      promptFa: "آرتور در حالی که زمین با آرامش زیر پایشان می‌چرخید چه حسی داشت؟",
      options: ["Profound gratitude and peace", "Angry and nervous", "Lonely and disappointed"],
      correctIndex: 0,
      hintSnippet: "Arthur felt profound gratitude",
      clueFa: "سپاسگزاری و آرامشی عمیق در دل داشت.",
    },
    choiceA: {
      labelEn: "Smile proudly with Nova as you watch the sunrise over the Pacific!",
      labelFa: "همراه با نوا طلوع زرین خورشید بر فراز اقیانوس آرام را تماشا کنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Set your navigational coordinates toward the next great cosmic adventure!",
      labelFa: "مختصات ایستگاه را برای آغاز ماجراجویی بزرگ بعدی در میان ستارگان تنظیم کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Space Farmer's Legacy", titleFa: "میراث کشاورزان مداری", badgeCategory: "legendary", badgeIcon: "🍓", badgeNameFa: "پایان سرسبز و جاودان", climaxEn: "Floating among red strawberries in zero gravity, Arthur proves that humanity can bring life and joy to the stars.", climaxFa: "با چیدن توت‌فرنگی‌های معلق در بی‌وزنی، آرتور ثابت کرد که انسان می‌تواند زندگی و شادی را به کهکشان ببرد.", xpReward: 240 },
  { pathCode: "AAAAB", titleEn: "The Earthbound Gift", titleFa: "هدیه توت‌فرنگی‌های ستاره‌ای", badgeCategory: "heroic", badgeIcon: "🎁", badgeNameFa: "پایان مهربانی و امید", climaxEn: "Children in hospital wards smile as they taste sweet space strawberries, dreaming of their own future flights.", climaxFa: "کودکان با چشیدن طعم توت‌فرنگی‌های فضایی لبخند زدند و رویای سفرهای آینده به ستارگان را در سر پروراندند.", xpReward: 220 },
  { pathCode: "AAABA", titleEn: "The Arthur Lunar Biosphere", titleFa: "زیست‌کره قمری آرتور", badgeCategory: "scholar", badgeIcon: "🌕", badgeNameFa: "پایان علمی و پایه‌گذار", climaxEn: "The Moon's first thriving green biodome feeds hundreds of lunar miners and scientists every day.", climaxFa: "اولین باغ سرسبز کره ماه هر روز غذای تازه صدها دانشمند و پژوهشگر مقیم ماه را تأمین می‌کند.", xpReward: 250 },
  { pathCode: "AAABB", titleEn: "The First Cup of Lunar Tea", titleFa: "نخستین استکان چای در ماه", badgeCategory: "explorer", badgeIcon: "🍵", badgeNameFa: "پایان سنتی در فضا", climaxEn: "Drinking tea grown beneath the lunar soil, humanity celebrates the greening of the solar system.", climaxFa: "نوشیدن چای معطر روییده در خاک ماه، جشن آغاز دوران سرسبزی منظومه شمسی شد.", xpReward: 215 },
  { pathCode: "AABAA", titleEn: "The Astronautics Gold Medal", titleFa: "مدال طلای کیهان‌نوردی", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان پرافتخار پزشکی", climaxEn: "The WHO declares Arthur's bioluminescent wellness kit the greatest psychological breakthrough in spaceflight.", climaxFa: "سازمان بهداشت جهانی بسته آرامش‌بخش آرتور را بزرگترین دستاورد روانی در سفرهای فضایی نامید.", xpReward: 245 },
  { pathCode: "AABAB", titleEn: "The Green Ship to Mars", titleFa: "سفینه سرسبز عازم مریخ", badgeCategory: "heroic", badgeIcon: "🚀", badgeNameFa: "پایان مأموریت مریخ", climaxEn: "Pioneers on the multi-year Mars journey sleep soundly under the gentle glow of Arthur's crystal vines.", climaxFa: "مسافران سفر تاریخی مریخ زیر نور ملایم ارکیده‌های بلورین در آرامش کامل به خواب رفتند.", xpReward: 235 },
  { pathCode: "AABBA", titleEn: "The Voice from the Stars", titleFa: "پادکست زمردین فضا", badgeCategory: "scholar", badgeIcon: "🎙️", badgeNameFa: "پایان فرهنگی و آرامش‌بخش", climaxEn: "Fifty million Earthlings fall asleep each night listening to Arthur and Nova's soothing cosmic broadcasts.", climaxFa: "پنجاه میلیون نفر روی زمین هر شب با صدای آرامش‌بخش پادکست ستاره‌ای آرتور و نوا به خواب می‌روند.", xpReward: 225 },
  { pathCode: "AABBB", titleEn: "The Cupola of Peace", titleFa: "برجک صلح جهانی", badgeCategory: "legendary", badgeIcon: "🕊️", badgeNameFa: "پایان الهام‌بخش صلح", climaxEn: "Astronauts from rival nations hold hands in the dome, proving that brotherhood transcends all borders.", climaxFa: "فضانوردان کشورهای مختلف در برجک شیشه‌ای دست در دست هم دادند و نشان دادند دوستی مرز نمی‌شناسد.", xpReward: 250 },
  { pathCode: "ABAAA", titleEn: "The Flight of Nova One", titleFa: "پرواز شاتل نوا یک", badgeCategory: "heroic", badgeIcon: "⚡", badgeNameFa: "پایان پرسرعت و پاک", climaxEn: "The green bio-battery shuttle glides past lunar craters, establishing a zero-emission highway to the stars.", climaxFa: "شاتل با باتری پاک زیستی از کنار دهانه‌های ماه گذشت و بزرگراه سبز و بدون دود کیهان را افتتاح کرد.", xpReward: 240 },
  { pathCode: "ABAAB", titleEn: "The Youth Orbital Flight", titleFa: "پرواز کاشفان نوجوان", badgeCategory: "explorer", badgeIcon: "🎒", badgeNameFa: "پایان امیدبخش دانش‌آموزی", climaxEn: "Twenty high school students laugh in zero gravity, inspired to become the next generation of engineers.", climaxFa: "بیست دانش‌آموز در بی‌وزنی شاتل پاک خندیدند و عزم خود را برای تبدیل شدن به مهندسان فضا جزم کردند.", xpReward: 220 },
  { pathCode: "ABABA", titleEn: "The Nobel of Ecology", titleFa: "نوبل مهندسی محیط‌زیست", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان جهانی و علمی", climaxEn: "Arthur receives the gold Nobel medal, dedicating the achievement to clean energy for future generations.", climaxFa: "آرتور مدال طلای نوبل را دریافت کرد و آن را به هوای پاک و انرژی سبز برای نسل‌های آینده تقدیم کرد.", xpReward: 250 },
  { pathCode: "ABABB", titleEn: "The Global Green Labs", titleFa: "آزمایشگاه‌های نوآوری سبز", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان آموزش بین‌المللی", climaxEn: "A thousand community labs open worldwide, teaching young inventors how to harness plant-based energy.", climaxFa: "هزار آزمایشگاه محلی در سراسر جهان باز شدند تا به جوانان ساخت انرژی از گیاهان را بیاموزند.", xpReward: 230 },
  { pathCode: "ABBAA", titleEn: "The Emerald Evening Star", titleFa: "ستاره زمردین شامگاهی", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان رویایی و درخشان", climaxEn: "Children on every continent look up and wave at the emerald beacon shining gently in the twilight sky.", climaxFa: "کودکان در تمام قاره‌ها به آسمان نگاه کردند و برای ستاره زمردین ایستگاه ارویون دست تکان دادند.", xpReward: 250 },
  { pathCode: "ABBAB", titleEn: "The Beacon of the Twilight", titleFa: "پیام نورانی شبانگاهی", badgeCategory: "heroic", badgeIcon: "💡", badgeNameFa: "پایان ارتباطی گرم", climaxEn: "The station's synchronized pulse creates a nightly visual link between explorers and their home planet.", climaxFa: "پالس‌های منظم نور ایستگاه پیوند چشمی هر شب میان کاشفان فضا و مردم زمین ایجاد کرد.", xpReward: 220 },
  { pathCode: "ABBBA", titleEn: "The Global Classroom in Orbit", titleFa: "کلاس درس جهانی در مدار", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان آموزشی مدرن", climaxEn: "Millions of classrooms participate in weekly live science lessons hosted directly from Orion's bio-dome.", climaxFa: "میلیون‌ها کلاس درس در سراسر دنیا هر هفته در زنگ علوم زنده ایستگاه ارویون شرکت می‌کنند.", xpReward: 235 },
  { pathCode: "ABBBB", titleEn: "Nova's Floating Pirouette", titleFa: "چرخش بامزه نوا در هوا", badgeCategory: "funny", badgeIcon: "🤖", badgeNameFa: "پایان شاد و پرخنده", climaxEn: "Nova's funny zero-g loop-de-loop brings joy to millions, turning the little drone into a world icon.", climaxFa: "حرکت آکروباتیک خنده‌دار نوا در هوا لبخند به لب میلیون‌ها نفر آورد و او را محبوب جهان کرد.", xpReward: 210 },
  { pathCode: "BAAAA", titleEn: "Chief Engineer of Odyssey", titleFa: "مهندس ارشد سفینه ادیسه", badgeCategory: "legendary", badgeIcon: "🚀", badgeNameFa: "پایان پرافتخار ناوبری", climaxEn: "Arthur stands at the helm of the greatest expedition ever launched, bound for the waters of Vesta.", climaxFa: "آرتور بر سکان بزرگترین مأموریت اکتشافی تاریخ بشر ایستاد و عازم اقیانوس سیارک وستا شد.", xpReward: 250 },
  { pathCode: "BAAAB", titleEn: "Nova's Crest on the Console", titleFa: "نشان هولوگرافیک نوا", badgeCategory: "funny", badgeIcon: "🔷", badgeNameFa: "پایان رفاقتی و زیبا", climaxEn: "Nova's smiling blue holographic face lights up the bridge, a loyal companion on humanity's longest trip.", climaxFa: "صورت آبی خندان نوا روی میز فرماندهی درخشید؛ همراهی وفادار در طولانی‌ترین سفر انسان.", xpReward: 215 },
  { pathCode: "BAABA", titleEn: "The Atlas of Living Worlds", titleFa: "اطلس جهان‌های زنده", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان زیست‌شناسی برتر", climaxEn: "The published atlas proves that life is an abundant cosmic miracle, forever altering humanity's philosophy.", climaxFa: "اطلس منتشرشده نشان داد حیات معجزه‌ای فراوان در گیتی است و بینش انسان را برای همیشه دگرگون کرد.", xpReward: 245 },
  { pathCode: "BAABB", titleEn: "The Submarine of Vesta", titleFa: "شیرجه در اعماق سیارک", badgeCategory: "explorer", badgeIcon: "🌊", badgeNameFa: "پایان شگفت‌انگیز اعماق", climaxEn: "The robotic submarine descends into warm alien hydrothermal waters, sending live 4K footage of living microbial gardens.", climaxFa: "زیردریایی خودکار به اعماق اقیانوس سیارک رفت و تصاویر شگفت‌انگیز ۴K از باغ‌های زنده ارسال کرد.", xpReward: 240 },
  { pathCode: "BABA", titleEn: "The Origins of Life Revealed", titleFa: "کشف راز پیدایش حیات", badgeCategory: "legendary", badgeIcon: "🧬", badgeNameFa: "پایان علمی جاودان", climaxEn: "Nobel committees hail Arthur's discovery of primordial prebiotic sugars as the greatest revelation of the century.", climaxFa: "کمیته نوبل کشف قندهای کهن منشأ حیات توسط آرتور را بزرگترین مکاشفه قرن حاضر نامید.", xpReward: 250 },
  { pathCode: "BABB", titleEn: "The Golden Vault of Vesta", titleFa: "محفظه زرین قطرات کهن", badgeCategory: "scholar", badgeIcon: "⚱️", badgeNameFa: "پایان گرانبها و باستانی", climaxEn: "The three liters of primordial water are preserved as humanity's most cherished astronomical treasure.", climaxFa: "سه لیتر آب کهن باستانی به عنوان باارزش‌ترین گنجینه نجومی تاریخ بشریت حفظ شد.", xpReward: 230 },
  { pathCode: "BABBA", titleEn: "The Symphony of Crystal Petals", titleFa: "کنسرت گل‌های نغمه‌خوان", badgeCategory: "legendary", badgeIcon: "🎵", badgeNameFa: "پایان هنری و رویایی", climaxEn: "The singing orchids create an ethereal cosmic harmony that reduces astronauts to tears of joy.", climaxFa: "ارکیده‌های نغمه‌خوان با ارتعاش دلنشین خود سمفونی شگفت‌انگیزی نواختند که اشک شوق به همراه داشت.", xpReward: 245 },
  { pathCode: "BABBB", titleEn: "The Museum's Singing Wonder", titleFa: "شگفتی آوازه‌خوان موزه", badgeCategory: "scholar", badgeIcon: "🌸", badgeNameFa: "پایان خاطره‌انگیز و لطیف", climaxEn: "Ten thousand museum visitors each day gently touch the singing petals, feeling the heartbeat of distant worlds.", climaxFa: "هر روز ده هزار بازدیدکننده موزه با لمس گلبرگ‌ها ضربان حیات دنیاهای دوردست را لمس کردند.", xpReward: 220 },
  { pathCode: "BBAAA", titleEn: "The Grand Gold Sextant", titleFa: "مدال طلایی ناوبری اقیانوس", badgeCategory: "legendary", badgeIcon: "🧭", badgeNameFa: "پایان پرافتخار ناوبری", climaxEn: "Ten thousand pilots salute Arthur and Nova as the guardians who tamed the solar storms.", climaxFa: "ده هزار خلبان فضاپیما به آرتور و نوا به عنوان نگهبانانی که طوفان‌های خورشیدی را رام کردند ادای احترام کردند.", xpReward: 250 },
  { pathCode: "BBAAB", titleEn: "The Emblem of Nova", titleFa: "نشان زرین چهره نوا", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان نمادین و ماندگار", climaxEn: "Every commercial spacecraft flying between planets carries Nova's smiling face on its hull.", climaxFa: "تصویر چهره خندان نوا روی بدنه تمام فضاپیماهای مسافری میان‌سیاره‌ای نصب شد.", xpReward: 230 },
  { pathCode: "BBABA", titleEn: "The Keynote on the Moon", titleFa: "سخنرانی کنجکاوی در ماه", badgeCategory: "scholar", badgeIcon: "🎤", badgeNameFa: "پایان الهام‌بخش علمی", climaxEn: "Arthur's speech on daring to follow strange signals inspires two hundred cadets to reach for the stars.", climaxFa: "سخنان آرتور درباره شجاعت پیگیری سیگنال‌های ناشناخته به دویست دانشجوی جوان انگیزه پرواز داد.", xpReward: 235 },
  { pathCode: "BBABB", titleEn: "Two Hundred Companion Drones", titleFa: "دویست دوست رباتیک پرنده", badgeCategory: "funny", badgeIcon: "🤖", badgeNameFa: "پایان پرشور و دوست‌داشتنی", climaxEn: "A flock of two hundred smiling mini-drones takes flight, celebrating friendship between humans and machines.", climaxFa: "دسته‌ای از دویست پهپاد مهربان به پرواز درآمدند و پیوند عمیق هوش مصنوعی و انسان را جشن گرفتند.", xpReward: 225 },
  { pathCode: "BBBAA", titleEn: "The World Cosmos Holiday", titleFa: "روز جهانی کیهان و صلح", badgeCategory: "legendary", badgeIcon: "🎆", badgeNameFa: "پایان همبستگی بین‌المللی", climaxEn: "Cities across Earth dim unnecessary lights for one hour to admire the glowing stars in shared wonder.", climaxFa: "شهرهای زمین برای یک ساعت چراغ‌ها را خاموش کردند تا همه با هم در شگفتی ستارگان سهیم شوند.", xpReward: 250 },
  { pathCode: "BBBAB", titleEn: "Lanterns in the Night Sky", titleFa: "فانوس‌های نورانی شبانگاهی", badgeCategory: "scholar", badgeIcon: "🏮", badgeNameFa: "پایان رویایی و شاعرانه", climaxEn: "A million biodegradable lanterns rise like golden fireflies into the warm summer night on Earth.", climaxFa: "یک میلیون فانوس روشن مثل شب‌تاب‌های طلایی در شب تابستان به پرواز درآمدند.", xpReward: 215 },
  { pathCode: "BBBBA", titleEn: "Sunrise Over the Pacific", titleFa: "طلوع طلایی بر فراز اقیانوس آرام", badgeCategory: "heroic", badgeIcon: "🌅", badgeNameFa: "پایان احساسی و تماشایی", climaxEn: "Watching the sun ignite the deep blue Pacific from orbit, Arthur and Nova share a quiet, triumphant high-five.", climaxFa: "با تماشای طلوع خورشید بر پهنه اقیانوس آرام، آرتور و نوا دست پیروزی را در بی‌وزنی به هم کوبیدند.", xpReward: 240 },
  { pathCode: "BBBBB", titleEn: "The Infinite Frontier Ahead", titleFa: "افق‌های بی‌پایان پیش رو", badgeCategory: "legendary", badgeIcon: "🚀", badgeNameFa: "پایان اسطوره‌ای و ابدی", climaxEn: "With new coordinates locked and hearts full of wonder, Arthur and Nova set sail for distant stars.", climaxFa: "با تنظیم مختصات جدید و دل‌هایی سرشار از امید، آرتور و نوا به سوی ماجراجویی‌های بعدی بادبان کشیدند.", xpReward: 250 },
];

export const story4SkyStation: AdventureStory = buildAdventureStory({
  id: "b1-sky-station-mystery",
  storyIndex: 4,
  cefr: "B1",
  titleEn: "The Secrets of Sky Station Orion",
  titleFa: "اسرار ایستگاه فضایی ارویون",
  genre: "scifi",
  genreLabelFa: "🚀 فانتزی و علمی‌تخیلی",
  genreIcon: "🚀",
  synopsisEn:
    "Cadet Arthur and his companion drone Nova investigate an energy surge in Orion's orbital greenhouse, discovering bioluminescent flora and lost probes across 32 sci-fi endings!",
  synopsisFa:
    "آرتور، کارآموز مهندسی ایستگاه فضایی ارویون، همراه با پهپاد بامزه‌اش نوا، متوجه نوسان عجیبی در گلخانه مداری می‌شن؛ جایی که ارکیده‌های بلورین از پرتوهای خورشید اکسیژن پاک تولید می‌کنن! آیا سیستم حیات ایستگاه رو نجات می‌دی یا سیگنال کاوشگر گمشده اعماق فضا رو ردیابی می‌کنی؟ ۳۲ پایان فضایی و هیجان‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b1-sky-station.webp",
  nodes,
  endings,
});
