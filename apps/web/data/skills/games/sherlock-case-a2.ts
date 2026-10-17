import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR A2 CASE: "CASE FILE #02: THE GAME OF BLACK AND WHITE"
// Official CEFR A2 Vocabulary & Grammar:
// Past Simple regular/irregular, Past Continuous, Present Perfect intro,
// Modals (must, have to, cannot, will), Connectors (because, although, before, after),
// Emergency Imperatives, Hospital & Chemical Investigation Lexicon.
// ============================================================================

export const A2_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: The Secret Inside the Pink Ribbon (شروع پرونده)
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "A2",
    titleFa: "راز پنهان در روبان صورتی: گشایش پرونده دوم",
    titleEn: "The Secret Inside the Pink Ribbon: Case Inception",
    locationFa: "دفتر کارآگاهی شرلوک هلمز، خیابان بیکر ۲۲۱ب، لندن ۱۸۹۳",
    locationEn: "Sherlock Holmes's Study, 221B Baker Street, London",
    storyIntroFa: "نیمه‌شب در دفتر خیابان بیکر است. دیروز لیلی کوچک را از چنگ موریارتی نجات دادید. روی میز کارتان، روبان صورتی لیلی قرار دارد. روبان غیرعادی و ضخیم است. با یک چاقوی کوچک، درز پارچه را باز می‌کنید و یک کلید برنجی، کارتی با عنوان «بیمارستان سنت جود - اتاق ۴۰۴» و تاریخی دوخته‌شده با نخ سیاه می‌بینید: «۱۴ نوامبر - ۵ سال پیش». ناگهان تلفن زنگ می‌زند...",
    cutscene: {
      titleFa: "کشف سرنخ داخل روبان صورتی و تماس اضطراری لسترید",
      titleEn: "Clue Inside the Ribbon & Lestrade's Midnight Call",
      imageSrc: "/images/skills/speaking/a2_scene_ribbon_secret.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "This pink ribbon is unusually thick. Let me cut the inner seam with my small pocket knife...",
          textFa: "این روبان صورتی به شکل غیرعادی ضخیم است. بگذارید با چاقوی جیبی کوچکم درز داخلی آن را باز کنم...",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "A small brass key! And an old card: 'St. Jude Hospital — Room 404'. On the back, a date is sewn in black thread: '14 November - 5 Years Ago'.",
          textFa: "یک کلید برنجی کوچک! و یک کارت قدیمی: «بیمارستان سنت جود - اتاق ۴۰۴». پشت آن هم تاریخی با نخ سیاه دوخته شده: «۱۴ نوامبر - ۵ سال پیش».",
          bubblePosition: "left",
        },
        {
          speakerId: "lestrade",
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Sherlock! Thank goodness you answered! Someone broke into St. Jude Hospital laboratory ten minutes ago and stole a dangerous chemical gas called White Sleep!",
          textFa: "شرلوک! خدا را شکر که گوشی را برداشتی! ده دقیقه پیش فردی به آزمایشگاه بیمارستان سنت جود دستبرد زد و یک گاز شیمیایی خطرناک به نام «خواب سفید» را دزدید!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Inspector Lestrade, stay calm! I just discovered a clue pointing directly to Room 404 in that hospital. I am on my way immediately!",
          textFa: "بازرس لسترید، خونسرد باشید! من همین الان سرنخی پیدا کردم که مستقیماً به اتاق ۴۰۴ آن بیمارستان اشاره دارد. فوراً در مسیر هستم!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-1-call-lestrade",
        titleFa: "پاسخ به بازرس لسترید و اعلام حرکت فوری به بیمارستان",
        speakerPromptEn: "Inspector Lestrade's breathless voice crackles over the telephone receiver...",
        speakerPromptFa: "صدای نفس‌نفس‌زنان بازرس لسترید از پشت گوشی تلفن به گوش می‌رسد...",
        speakerRoleFa: "بازرس لسترید (اسکاتلندیارد)",
        speakerAvatar: "👮‍♂️",
        taskInstructionFa: "با لحنی مطمئن و قاطع به بازرس لسترید بگو: «من یک کلید و کارت بیمارستان پیدا کردم، الان دارم به بیمارستان سنت جود می‌آیم.»",
        targetKeywords: [
          { phrase: "found a key", hintFa: "(یک کلید پیدا کردم)", synonyms: ["found a key", "discovered a key", "found this key"], weight: 35 },
          { phrase: "hospital card", hintFa: "(کارت بیمارستان)", synonyms: ["hospital card", "a hospital card", "the hospital card"], weight: 30 },
          { phrase: "coming to St. Jude Hospital", hintFa: "(دارم به بیمارستان سنت جود می‌آیم)", synonyms: ["coming to st. jude hospital", "coming to st jude hospital", "coming to the hospital", "going to st jude hospital"], weight: 35 },
        ],
        idealVoiceResponseEn: "I found a key and a hospital card, and I am coming to St. Jude Hospital right now.",
        alternativeResponsesEn: [
          { phraseEn: "I found a secret key and I am going to St. Jude Hospital immediately.", translationFa: "من یک کلید مخفی پیدا کردم و فوراً دارم به بیمارستان سنت جود می‌روم." },
          { phraseEn: "I discovered a hospital card, so I am on my way to St. Jude Hospital right now.", translationFa: "من یک کارت بیمارستان پیدا کردم، بنابراین همین الان در مسیر بیمارستان سنت جود هستم." },
        ],
        whiteHintFa: "برای تسلط به زمان حال استمراری و گذشته ساده، از افعال found و am coming استفاده کن. با قدرت شروع کن هلمز!",
        fallbackChoices: [
          "I found a key and a hospital card, and I am coming to St. Jude Hospital right now.",
          "I am drinking tea at Baker Street with no hurry.",
          "Where did I put my walking stick yesterday morning?",
        ],
        aefReference: "AEF 2 Unit 1C & 2A (Past simple of irregular verbs + Present continuous for arranged action)",
        npcResponse: {
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Hurry, Holmes! Thick smoke is rising from the fourth floor of the hospital!",
          textFa: "عجله کن هلمز! دود غلیظی از طبقه چهارم بیمارستان در حال بلند شدن است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: DECISION 1 — Room 404 (تصمیم اول: دوراهی سرعت یا مدرک)
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "A2",
    titleFa: "دوراهی اتاق ۴۰۴: مدارک در آتش یا تعقیب مظنون؟",
    titleEn: "DECISION 1: The Dilemma of Room 404",
    locationFa: "طبقه چهارم بیمارستان سنت جود، راهروی تاریک و پر دود",
    locationEn: "4th Floor Corridor, St. Jude Hospital",
    storyIntroFa: "با شتاب از پله‌ها به طبقه چهارم می‌دوید. راهرو تاریک است و بوی دود و سوختگی به مشام می‌رسد. در اتاق ۴۰۴ دو اتفاق همزمان رخ می‌دهد: داخل اتاق، یک نقشه و دفترچه مخفی در سطل زباله در حال سوختن است و تا ۳۰ ثانیه دیگر خاکستر می‌شود! در گوشه اتاق، بیماری در کمای عمیق با دستبند روی تخت افتاده (پرونده بسته شده توسط شرلوک هلمز، ۵ سال پیش). در راهرو، مردی با پای لنگ با دیلم فلزی قفل قفسه داروها را می‌شکند!",
    cutscene: {
      titleFa: "آتش در اتاق ۴۰۴ و مرد لنگان در راهرو",
      titleEn: "The Fire in Room 404 and the Limping Intruder",
      imageSrc: "/images/skills/speaking/a2_scene_room_404_fire.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Room 404! Smoke is pouring out of the trash can, and secret papers are burning inside!",
          textFa: "اتاق ۴۰۴! دود از سطل زباله بیرون می‌زند و کاغذهای محرمانه داخل آن در حال سوختن است!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look on the bed: a coma patient with police handcuffs... 'Case closed by Detective Holmes (5 years ago)'. And in the hallway, a man with a limp is breaking the medicine cabinet!",
          textFa: "روی تخت را نگاه کنید: بیماری در کما با دستبند پلیس... «پرونده بسته شده توسط کارآگاه هلمز (۵ سال پیش)». و در راهرو، مردی لنگان در حال شکستن قفسه داروهاست!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "If I put out the fire, the suspect will escape. If I tackle the suspect, the documents will turn to black ash!",
          textFa: "اگر آتش را خاموش کنم، مظنون فرار خواهد کرد. اگر مظنون را مهار کنم، مدارک تبدیل به خاکستر سیاه خواهند شد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-1",
      promptFa: "یک دوراهی سرنوشت‌ساز: نجات مدارک در حال سوختن یا دستگیری فرد مشکوک در راهرو؟",
      promptEn: "Critical Choice: Save the burning papers or stop the limping suspect in the corridor?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Run into Room 404 to save the burning papers",
          labelFa: "گزینه ۱الف: دویدن داخل اتاق ۴۰۴ و نجات دادن مدارک از آتش",
          descriptionFa: "مدارک و نقشه را از آتش نجات می‌دهید و کد ۷۷ را به دست می‌آورید، اما مظنون ممکن است فرار کند.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Stop the limping man near the medicine cabinet",
          labelFa: "گزینه ۱ب: پریدن به داخل راهرو و دستگیری مرد لنگان",
          descriptionFa: "مرد را مهار می‌کنید و کیت پادزهر را از او می‌گیرید، اما مدارک داخل اتاق ۴۰۴ خاکستر می‌شوند.",
          pointsDelta: 150,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-2-spot-dilemma",
        titleFa: "گزارش وضعیت صحنه جرم و توصیف دوراهی",
        speakerPromptEn: "You pause at the smoky threshold of Room 404, sizing up the dual crisis...",
        speakerPromptFa: "در آستانه پر از دود اتاق ۴۰۴ درنگ می‌کنی و هر دو وضعیت بحرانی را می‌سنجی...",
        speakerRoleFa: "شرلوک هلمز (مشاهدات صحنه)",
        speakerAvatar: "🔍",
        taskInstructionFa: "وضعیت بحرانی را توصیف کن و بگو: «من کاغذهای در حال سوختن را در اتاق می‌بینم و مردی دارد قفل را در راهرو می‌شکند.»",
        targetKeywords: [
          { phrase: "burning papers", hintFa: "(کاغذهای در حال سوختن)", synonyms: ["burning papers", "burning paper", "papers burning", "the fire"], weight: 35 },
          { phrase: "in the room", hintFa: "(در اتاق)", synonyms: ["in the room", "inside room 404", "in room 404"], weight: 25 },
          { phrase: "breaking the lock", hintFa: "(در حال شکستن قفل)", synonyms: ["breaking the lock", "breaking a lock", "is breaking the lock"], weight: 40 },
        ],
        idealVoiceResponseEn: "I see burning papers in the room, and a man is breaking the lock in the hallway.",
        alternativeResponsesEn: [
          { phraseEn: "There are burning papers in Room 404 and a suspect breaking the medicine lock.", translationFa: "کاغذهای در حال سوختن در اتاق ۴۰۴ وجود دارند و مظنونی در حال شکستن قفل داروهاست." },
          { phraseEn: "I can see fire inside the room while a man breaks the cabinet outside.", translationFa: "من آتش را داخل اتاق می‌بینم در حالی که مردی قفسه را بیرون می‌شکند." },
        ],
        whiteHintFa: "از ترکیب زمان حال استمراری (is breaking) و حال ساده استفاده کن تا فوریت حادثه را به تصویر بکشی!",
        fallbackChoices: [
          "I see burning papers in the room, and a man is breaking the lock in the hallway.",
          "The hospital lights are very bright tonight.",
          "I need a glass of cold water right now.",
        ],
        aefReference: "AEF 2 Unit 2B (There is / There are + Present Continuous vs Present Simple)",
        npcResponse: {
          speakerNameFa: "ندای درونی هلمز",
          speakerRoleFa: "تجزیه و تحلیل ذهن شرلوک",
          speakerAvatar: "🧠",
          textEn: "Every second counts, Sherlock! Decide your path before the fire consumes the truth!",
          textFa: "هر ثانیه حیاتی است هلمز! قبل از اینکه آتش حقیقت را ببلعد مسیرت را برگزین!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Consequence of Decision 1 & Meeting Dr. Watson (پیامد تصمیم اول و ورود واتسون)
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "A2",
    titleFa: "پیامد تصمیم اول: ورود غیرمنتظره دکتر جان واتسون",
    titleEn: "Consequence of Decision 1: Meeting Dr. John Watson",
    locationFa: "راهروی طبقه چهارم بیمارستان سنت جود",
    locationEn: "4th Floor Corridor, St. Jude Hospital",
    storyIntroFa: "پیامد انتخابتان رخ می‌دهد: یا مدارک نیم‌سوخته و کد ۷۷ را نجات داده‌اید یا کیت پادزهر را از مرد تصاحب کرده‌اید. نور فانوس را روی صورت مرد می‌اندازید: حدود سی‌ساله با چهره‌ای خسته اما چشمانی صادق. او آرام می‌گوید: «شلیک نکن! من دکتر جان واتسون، پزشک سابق ارتش هستم. امروز صبح دوستم با گاز خواب سفید مسموم شد و من برای نجات جانش به دنبال پادزهر آمدم!» دیروز مامور وایت هم ادعای دوستی می‌کرد و موریارتی از آب درآمد! شما به واتسون ذره‌ای اعتماد ندارید...",
    cutscene: {
      titleFa: "رویارویی با مظنون: ورود دکتر جان واتسون",
      titleEn: "Confronting the Intruder: Dr. Watson Appears",
      imageSrc: "/images/skills/speaking/a2_scene_watson_encounter.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سابق ارتش",
          speakerAvatar: "🩺",
          textEn: "Don't shoot! My name is Dr. John Watson. I was an army surgeon in Afghanistan.",
          textFa: "شلیک نکنید! نام من دکتر جان واتسون است. من جراح ارتش در افغانستان بودم.",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سابق ارتش",
          speakerAvatar: "🩺",
          textEn: "This morning someone poisoned my old army friend with White Sleep gas! The nurses were busy, so I came here to find the antidote to save his life!",
          textFa: "امروز صبح فردی دوست قدیمی ارتشی مرا با گاز خواب سفید مسموم کرد! پرستاران گرفتار بودند، بنابراین خودم به اینجا آمدم تا پادزهر را برای نجات جانش پیدا کنم!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Yesterday someone claimed to be my closest friend, and he was Professor Moriarty! I do not trust you, Dr. Watson.",
          textFa: "دیروز هم فردی ادعا کرد نزدیک‌ترین دوستم است و در واقع پروفسور موریارتی بود! من به شما اعتماد ندارم، دکتر واتسون.",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "پیامد ۱الف: نجات نقشه بلک‌فرایرز و کشف کد ۷۷",
        titleEn: "Consequence 1A: Rescuing the Map & Code 77",
        storyIntroFa: "آب را روی آتش می‌ریزید و نیمی از نقشه را نجات می‌دهید! نقشه نشان‌دهنده نگارخانه و ایستگاه آب بلک‌فرایرز است و عدد محرمانه «کد ۷۷» روی آن دیده می‌شود. مرد لنگان اسلحه ارتشی‌اش را می‌کشد اما با دیدن شما دستپاچه شده و یک شیشه داروی پادزهر از جیبش روی زمین می‌افتد!",
        cutscene: {
          titleFa: "مدارک نجات‌یافته و کد ۷۷",
          titleEn: "Rescued Documents & Code 77",
          imageSrc: "/images/skills/speaking/a2_scene_rescued_map.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The paper is half burned, but I can read: 'Blackfriars Art Gallery & Water Station' and 'Code 77'!",
              textFa: "کاغذ نیم‌سوخته است، اما می‌توانم بخوانم: «نگارخانه هنری و ایستگاه آب بلک‌فرایرز» و «کد ۷۷»!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "Please, don't shoot! I dropped the medicine bottle on the floor. I only want to save my dying comrade!",
              textFa: "خواهش می‌کنم شلیک نکنید! شیشه دارو از دستم روی زمین افتاد. من فقط می‌خواهم جان همرزم در حال مرگم را نجات دهم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-3-confront-watson-1a",
            titleFa: "خلع سلاح دکتر واتسون و دستور حرکت به بلک‌فرایرز",
            speakerPromptEn: "Dr. Watson points his army revolver with shaking hands in the corridor...",
            speakerPromptFa: "دکتر واتسون با دستانی لرزان رولور ارتشی‌اش را در راهرو نشانه رفته است...",
            speakerRoleFa: "دکتر جان واتسون",
            speakerAvatar: "🩺",
            taskInstructionFa: "با لحنی محکم اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده دکتر، تو باید با من به نگارخانه بلک‌فرایرز بیایی.»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را به من بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 35 },
              { phrase: "Doctor", hintFa: "(دکتر)", synonyms: ["doctor", "dr watson", "watson"], weight: 25 },
              { phrase: "come with me to Blackfriars Gallery", hintFa: "(با من به نگارخانه بلک‌فرایرز بیا)", synonyms: ["come with me to blackfriars gallery", "come to blackfriars gallery", "go to blackfriars gallery with me"], weight: 40 },
            ],
            idealVoiceResponseEn: "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
            alternativeResponsesEn: [
              { phraseEn: "Hand over your weapon Doctor Watson, and follow me to Blackfriars Gallery.", translationFa: "سلاحت را تحویل بده دکتر واتسون و همراه من به نگارخانه بلک‌فرایرز بیا." },
              { phraseEn: "Give me the gun, because you have to come with me to Blackfriars Gallery.", translationFa: "اسلحه را به من بده، چون باید همراه من به نگارخانه بلک‌فرایرز بیایی." },
            ],
            whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
            fallbackChoices: [
              "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
              "Let us go home and sleep because we are tired.",
              "Where can I buy a ticket for the steam train?",
            ],
            aefReference: "AEF 2 Unit 3A (Must / Have to for obligation + Imperatives)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Here is my revolver, Holmes. I swear on my honour as a soldier, I will help you catch this monster.",
              textFa: "این رولور من است هلمز. به شرافتم به عنوان یک سرباز سوگند یاد می‌کنم، به تو کمک خواهم کرد تا این هیولا را به دام بیندازی.",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "پیامد ۱ب: تصاحب کیت پادزهر و خاکستر شدن نقشه‌ها",
        titleEn: "Consequence 1B: The Antidote Kit Secured",
        storyIntroFa: "دست مرد لنگان را می‌گیرید و او را به دیوار می‌چسبانید. جعبه نقره‌ای کیت پادزهر گاز خواب سفید را از او می‌گیرید! اما کاغذهای داخل اتاق ۴۰۴ کاملاً خاکستر شده‌اند و فقط عبارت «نگارخانه بلک‌فرایرز» روی دیوار باقی مانده است.",
        cutscene: {
          titleFa: "کیت پادزهر در دست شرلوک",
          titleEn: "The Antidote Kit in Holmes's Hands",
          imageSrc: "/images/skills/speaking/a2_scene_antidote_captured.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Do not move! I have the silver medical box—the Antidote Kit is secure!",
              textFa: "حرکت نکنید! جعبه پزشکی نقره‌ای در دست من است—کیت پادزهر در امان است!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "I am not a thief! I am Dr. John Watson, trying to save my dying soldier friend!",
              textFa: "من دزد نیستم! من دکتر جان واتسون هستم و تلاش می‌کنم جان دوست سربازم را نجات دهم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-3-confront-watson-1b",
            titleFa: "بازجویی قاطع از دکتر واتسون و خلع سلاح او",
            speakerPromptEn: "Dr. Watson stands pinned against the wall, breathing heavily under your lantern...",
            speakerPromptFa: "دکتر واتسون در حالی که به دیوار چسبیده، زیر نور فانوس نفس‌نفس می‌زند...",
            speakerRoleFa: "دکتر جان واتسون",
            speakerAvatar: "🩺",
            taskInstructionFa: "با لحنی محکم اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده دکتر، تو باید با من به نگارخانه بلک‌فرایرز بیایی.»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را به من بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 35 },
              { phrase: "Doctor", hintFa: "(دکتر)", synonyms: ["doctor", "dr watson", "watson"], weight: 25 },
              { phrase: "come with me to Blackfriars Gallery", hintFa: "(با من به نگارخانه بلک‌فرایرز بیا)", synonyms: ["come with me to blackfriars gallery", "come to blackfriars gallery", "go to blackfriars gallery with me"], weight: 40 },
            ],
            idealVoiceResponseEn: "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
            alternativeResponsesEn: [
              { phraseEn: "Hand over your weapon Doctor Watson, and follow me to Blackfriars Gallery.", translationFa: "سلاحت را تحویل بده دکتر واتسون و همراه من به نگارخانه بلک‌فرایرز بیا." },
              { phraseEn: "Give me the gun, because you have to come with me to Blackfriars Gallery.", translationFa: "اسلحه را به من بده، چون باید همراه من به نگارخانه بلک‌فرایرز بیایی." },
            ],
            whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
            fallbackChoices: [
              "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
              "Let us go home and sleep because we are tired.",
              "Where can I buy a ticket for the steam train?",
            ],
            aefReference: "AEF 2 Unit 3A (Must / Have to for obligation + Imperatives)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Take my weapon, Holmes. I have nothing to hide. Let us stop this monster together.",
              textFa: "سلاحم را بگیر هلمز. من چیزی برای پنهان کردن ندارم. بیا با هم جلوی این هیولا را بگیریم.",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-a2-3-confront-watson-default",
        titleFa: "بازجویی قاطع از دکتر واتسون و خلع سلاح او",
        speakerPromptEn: "Dr. Watson stands before you, breathing heavily under the harsh beam of your lantern...",
        speakerPromptFa: "دکتر واتسون زیر نور تند فانوس شما در حالی که نفس‌نفس می‌زند ایستاده است...",
        speakerRoleFa: "دکتر جان واتسون (پزشک سابق ارتش)",
        speakerAvatar: "🩺",
        taskInstructionFa: "با لحنی محکم اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده دکتر، تو باید با من به نگارخانه بلک‌فرایرز بیایی.»",
        targetKeywords: [
          { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را به من بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 35 },
          { phrase: "Doctor", hintFa: "(دکتر)", synonyms: ["doctor", "dr watson", "watson"], weight: 25 },
          { phrase: "come with me to Blackfriars Gallery", hintFa: "(با من به نگارخانه بلک‌فرایرز بیا)", synonyms: ["come with me to blackfriars gallery", "come to blackfriars gallery", "go to blackfriars gallery with me"], weight: 40 },
        ],
        idealVoiceResponseEn: "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
        alternativeResponsesEn: [
          { phraseEn: "Hand over your weapon Doctor Watson, and follow me to Blackfriars Gallery.", translationFa: "سلاحت را تحویل بده دکتر واتسون و همراه من به نگارخانه بلک‌فرایرز بیا." },
          { phraseEn: "Give me the gun, because you have to come with me to Blackfriars Gallery.", translationFa: "اسلحه را به من بده، چون باید همراه من به نگارخانه بلک‌فرایرز بیایی." },
        ],
        whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
        fallbackChoices: [
          "Give me your gun Doctor, you must come with me to Blackfriars Gallery right now.",
          "Let us go home and sleep because we are tired.",
          "Where can I buy a ticket for the steam train?",
        ],
        aefReference: "AEF 2 Unit 3A (Must / Have to for obligation + Imperatives)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "Here is my revolver, Holmes. I swear on my honour as a soldier, I will help you catch this monster.",
          textFa: "این رولور من است هلمز. به شرافتم به عنوان یک سرباز سوگند یاد می‌کنم، به تو کمک خواهم کرد تا این هیولا را به دام بیندازی.",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: Face-to-Face with Moriarty (رویارویی مستقیم با موریارتی و فلسفه سیاه و سفید)
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "A2",
    titleFa: "رویارویی در نگارخانه بلک‌فرایرز: فلسفه بازی سیاه و سفید",
    titleEn: "Face-to-Face with Moriarty: The Game of Black and White",
    locationFa: "سالن مرکزی نگارخانه بلک‌فرایرز، مرکز لندن",
    locationEn: "Main Hall, Blackfriars Art Gallery, London",
    storyIntroFa: "شما و دکتر واتسون وارد نگارخانه بلک‌فرایرز می‌شوید. زیر این ساختمان، ایستگاه اصلی تصفیه آب و هوای مرکز لندن قرار دارد. دیوارهای سالن با نقاشی‌های سیاه و سفید پوشانده شده است. در مرکز سالن، مردی با کت‌وشلوار سیاه تنها ایستاده است: بدون نقاب، بدون نام جعلی. او پروفسور جیمز موریارتی است! اسلحه‌تان را به سمت سینه‌اش نشانه می‌روید...",
    cutscene: {
      titleFa: "رویارویی رو در رو با پروفسور جیمز موریارتی",
      titleEn: "Face to Face with Professor James Moriarty",
      imageSrc: "/images/skills/speaking/a2_scene_moriarty_gallery.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Do not move, Moriarty! You are under arrest for stealing the White Sleep gas!",
          textFa: "تکان نخور موریارتی! تو به جرم سرقت گاز خواب سفید بازداشت هستی!",
          bubblePosition: "left",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "استاد جنایت",
          speakerAvatar: "♟️",
          textEn: "Look around you, Sherlock. Black and White. Darkness and Light. That is you and me! We are opposites, and we complete each other.",
          textFa: "به اطرافت نگاه کن شرلوک. سیاه و سفید. تاریکی و روشنایی. این من و تو هستیم! ما ضد هم هستیم و همدیگر را کامل می‌کنیم.",
          bubblePosition: "right",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "استاد جنایت",
          speakerAvatar: "♟️",
          textEn: "I hold a red radio button. If my finger leaves it, two bombs open in three minutes: one in the Basement Pump where the Chief Judge is tied up, and one in the East Control Room above the school bus tunnel!",
          textFa: "دکمه رادیویی قرمزی در دست دارم. اگر انگشتم برداشته شود، دو بمب در ۳ دقیقه باز می‌شوند: یکی در پمپ زیرزمین جایی که قاضی ارشد بسته شده، و یکی در اتاق کنترل شرق بالای تونل اتوبوس مدرسه!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "He dropped an iron key, walked out the back door, and locked the iron gate! Holmes, the red digital clock shows 03:00 minutes!",
          textFa: "او یک کلید آهنی را انداخت، از در پشتی بیرون رفت و در آهنی را قفل کرد! هلمز، ساعت قرمز دیجیتال ۳:۰۰ دقیقه را نشان می‌دهد!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-4-challenge-moriarty",
        titleFa: "پاسخ دندان‌شکن به موریارتی و اولویت نجات جان انسان‌ها",
        speakerPromptEn: "Moriarty smirks through the iron bars as the countdown timer echoes loudly...",
        speakerPromptFa: "موریارتی در حالی که صدای ثانیه‌شمار معکوس در سالن می‌پیچد، از پشت میله‌ها پوزخند می‌زند...",
        speakerRoleFa: "پروفسور جیمز موریارتی",
        speakerAvatar: "♟️",
        taskInstructionFa: "با خشم و اقتدار به موریارتی بگو: «تو یک هیولا هستی موریارتی، اما من جان این انسان‌های بی‌گناه را نجات خواهم داد و جلویت را خواهم گرفت!»",
        targetKeywords: [
          { phrase: "monster Moriarty", hintFa: "(هیولا هستی موریارتی)", synonyms: ["monster moriarty", "a monster moriarty", "you are a monster", "monster"], weight: 30 },
          { phrase: "save the innocent people", hintFa: "(انسان‌های بی‌گناه را نجات خواهم داد)", synonyms: ["save the innocent people", "save innocent people", "save these innocent people", "protect innocent people"], weight: 45 },
          { phrase: "stop you", hintFa: "(جلویت را خواهم گرفت)", synonyms: ["stop you", "stop your game", "stop your plan"], weight: 25 },
        ],
        idealVoiceResponseEn: "You are a monster Moriarty, but I will save the innocent people and stop you!",
        alternativeResponsesEn: [
          { phraseEn: "You cannot defeat me Moriarty, I will rescue the innocent people right now.", translationFa: "تو نمی‌توانی مرا شکست دهی موریارتی، من همین الان انسان‌های بی‌گناه را نجات خواهم داد." },
          { phraseEn: "I am going to save those innocent people and end your evil game, Moriarty.", translationFa: "من جان آن انسان‌های بی‌گناه را نجات خواهم داد و به بازی شرورانه تو پایان می‌دهم موریارتی." },
        ],
        whiteHintFa: "با استفاده از will یا be going to اراده قطعی خودت رو برای نجات مردم بیان کن!",
        fallbackChoices: [
          "You are a monster Moriarty, but I will save the innocent people and stop you!",
          "I would like to look at these black and white paintings.",
          "What time does the art gallery open tomorrow morning?",
        ],
        aefReference: "AEF 2 Unit 3B (Will / Won't for promises and firm intentions)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه جنایت",
          speakerAvatar: "♟️",
          textEn: "Heroic words, Sherlock! The clock shows two minutes and fifty seconds... Let the game begin!",
          textFa: "کلمات قهرمانانه‌ای است، شرلوک! ساعت دو دقیقه و پنجاه ثانیه را نشان می‌دهد... بگذار بازی آغاز شود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — Can You Trust Dr. Watson? (تصمیم دوم: چالش اعتماد پس از خیانت پرونده اول)
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "A2",
    titleFa: "تصمیم دوم: آیا می‌توان به دکتر واتسون اعتماد کرد؟",
    titleEn: "DECISION 2: Can You Trust Dr. Watson?",
    locationFa: "پای پلکان دوراهی در نگارخانه بلک‌فرایرز",
    locationEn: "Dual Staircase, Blackfriars Gallery",
    storyIntroFa: "ساعت دیجیتال قرمز با سرعت ثانیه‌ها را می‌سوزاند: ۰۳:۰۰ دقیقه باقی مانده است! پله‌های سمت چپ به سمت اتاق پمپ زیرزمین می‌رود (جایی که قاضی ارشد در تله افتاده). پله‌های سمت راست به اتاق کنترل شرق بالا می‌رود (که هوای تونل اتوبوس مدرسه را کنترل می‌کند). به تنهایی نمی‌توانید در ۳ دقیقه به هر دو نقطه برسید! دکتر واتسون جلو می‌آید و در چشمانتان می‌نگرد: «هلمز! می‌دانم دیروز کسی به تو دروغ گفت. ترس و تردید را در چشمانت می‌بینم. اما من یک سرباز و یک پزشکم! آن کلید برنجی را به من بده تا به زیرزمین بروم و تو به اتاق کنترل برو!»",
    cutscene: {
      titleFa: "شمارش معکوس سه دقیقه و التماس دکتر واتسون",
      titleEn: "Three Minutes Left & Dr. Watson's Appeal",
      imageSrc: "/images/skills/speaking/a2_scene_dual_stairs.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "Mr. Holmes! I know someone lied to you yesterday. I can see the fear in your eyes.",
          textFa: "آقای هلمز! می‌دانم دیروز کسی به تو دروغ گفت. ترس و بی‌اعتمادی را در چشمانت می‌بینم.",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "But I am a soldier and a doctor! Give me the brass key from Lily's ribbon and let me go to the Basement while you sprint to the Control Room! You MUST trust me!",
          textFa: "اما من یک سرباز و پزشکم! کلید برنجی روبان لیلی را به من بده تا به زیرزمین بروم در حالی که خودت به اتاق کنترل می‌دوی! تو باید به من اعتماد کنی!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "If I trust you and you are Moriarty's accomplice, the Judge dies. If I lock you up, I might fail to reach both rooms in time...",
          textFa: "اگر به تو اعتماد کنم و همدست موریارتی باشی، قاضی می‌میرد. اگر تو را ببندم، شاید نتوانم تنهایی به هر دو اتاق به موقع برسم...",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-2",
      promptFa: "یک دوراهی تکان‌دهنده: آیا به واتسون اعتماد کرده و کلید را می‌سپارید، یا او را دستبند می‌زنید؟",
      promptEn: "Critical Choice: Trust Dr. Watson with the key, or handcuff him to the radiator?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Trust Dr. Watson and split up",
          labelFa: "گزینه ۲الف: اعتماد به دکتر واتسون و تقسیم وظایف",
          descriptionFa: "کلید برنجی روبان لیلی را به واتسون می‌دهید تا به زیرزمین برود و خودتان به اتاق کنترل شرق می‌دوید.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Do NOT trust Watson and handcuff him",
          labelFa: "گزینه ۲ب: عدم اعتماد به واتسون و دستبند زدن به او",
          descriptionFa: "دست واتسون را با دستبند به لوله رادیاتور قفل می‌کنید و تلاش می‌کنید به تنهایی به هر دو اتاق برسید.",
          pointsDelta: 150,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-5-coordinate-plan",
        titleFa: "فرمان هماهنگی و ابلاغ تصمیم به دکتر واتسون",
        speakerPromptEn: "Dr. Watson watches you intently, awaiting your decisive command as the red timer counts down...",
        speakerPromptFa: "دکتر واتسون در حالی که زمان‌سنج قرمز ثانیه‌ها را می‌شمارد، مشتاقانه منتظر فرمان قطعی شماست...",
        speakerRoleFa: "دکتر جان واتسون",
        speakerAvatar: "🩺",
        taskInstructionFa: "فوریت زمان را بیان کن و بگو: «ما فقط سه دقیقه وقت داریم و باید برای نجات هر دو اتاق سریع عمل کنیم.»",
        targetKeywords: [
          { phrase: "only three minutes", hintFa: "(فقط سه دقیقه)", synonyms: ["only three minutes", "just three minutes", "three minutes left"], weight: 35 },
          { phrase: "act quickly", hintFa: "(سریع عمل کنیم)", synonyms: ["act quickly", "move fast", "hurry up", "act fast"], weight: 35 },
          { phrase: "save both rooms", hintFa: "(نجات هر دو اتاق)", synonyms: ["save both rooms", "save everyone", "reach both rooms"], weight: 30 },
        ],
        idealVoiceResponseEn: "We have only three minutes left, and we must act quickly to save both rooms.",
        alternativeResponsesEn: [
          { phraseEn: "There are only three minutes, so we have to hurry to save both rooms.", translationFa: "فقط سه دقیقه باقی مانده، پس ما باید عجله کنیم تا هر دو اتاق را نجات دهیم." },
          { phraseEn: "Time is running out, we must act immediately to protect both places.", translationFa: "زمان در حال اتمام است، ما باید فوراً عمل کنیم تا از هر دو مکان محافظت نماییم." },
        ],
        whiteHintFa: "از عبارات زمان A2 مانند only three minutes left و فعل کمکی must استفاده کن!",
        fallbackChoices: [
          "We have only three minutes left, and we must act quickly to save both rooms.",
          "I want to sit down and rest my tired feet.",
          "Is there a good restaurant near this gallery?",
        ],
        aefReference: "AEF 2 Unit 4A (Must / Have to + Time expressions)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همراه نظامی",
          speakerAvatar: "🩺",
          textEn: "I am ready, Holmes! Give the word and I will sprint to the basement!",
          textFa: "من آماده‌ام هلمز! فقط دستور بده تا با تمام سرعت به زیرزمین بدوم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Consequence of Decision 2 & Becoming Partners (پیامد تصمیم دوم و شکل‌گیری رفاقت)
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "A2",
    titleFa: "پیامد تصمیم دوم: آزمون خون و تولد یک شراکت تاریخی",
    titleEn: "Consequence of Decision 2: The Birth of a Legendary Partnership",
    locationFa: "اتاق پمپ زیرزمین بلک‌فرایرز",
    locationEn: "Basement Water Pump Room, Blackfriars",
    storyIntroFa: "پیامد تصمیمی که گرفتید آشکار می‌شود: یا با اعتماد به واتسون هر دو اتاق را نجات داده و بی‌سیم مخفی را به دست آورده‌اید، یا با تردید به او، قاضی مسموم شده و واتسون با شکستن لوله رادیاتور جان شما را نجات داده است!",
    cutscene: {
      titleFa: "پیامد تصمیم دوم: فداکاری و پیوند ناگسستنی",
      titleEn: "Consequence of Decision 2: The Test of Brotherhood",
      imageSrc: "/images/skills/speaking/a2_scene_watson_saves_holmes.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The gas valve is locked and the Chief Judge is breathing! Watson, you proved your true heart.",
          textFa: "شیر گاز قفل شده و قاضی ارشد در حال نفس کشیدن است! واتسون، تو نیت پاکت را اثبات کردی.",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "We make a good team, Holmes. A doctor and a detective fighting together.",
          textFa: "ما تیم خوبی تشکیل دادیم، هلمز. یک پزشک و یک کارآگاه که شانه به شانه می‌جنگند.",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: اعتماد متقابل، نجات دوگانه و کشف بی‌سیم مخفی",
        titleEn: "Consequence 2A: Mutual Trust & The Secret Radio",
        storyIntroFa: "به اتاق کنترل شرق می‌دوید و گاز تونل مدرسه را قطع می‌کنید! سپس با شتاب به زیرزمین می‌روید. در باز است! دکتر واتسون با یکی از نگهبانان موریارتی گلاویز شده، او را مهار کرده و با کلید برنجی شما شیر گاز را بسته و جان قاضی ارشد را نجات داده است! ساعد واتسون زخم عمیقی برداشته است. با دستمال گردنتان دست او را پانسمان می‌کنید. واتسون لبخند می‌زند، کلید برنجی و یک بی‌سیم مخفی را به شما می‌دهد: «ما تیم خوبی تشکیل دادیم، هلمز.»",
        cutscene: {
          titleFa: "نجات قاضی و کشف بی‌سیم نگهبان",
          titleEn: "Saving the Judge & The Guard's Radio",
          imageSrc: "/images/skills/speaking/a2_scene_radio_found.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The tunnel gas is disabled! Watson, you subdued the guard and saved the Chief Judge!",
              textFa: "گاز تونل غیرفعال شد! واتسون، تو نگهبان را مغلوب کردی و جان قاضی ارشد را نجات دادی!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Your brass key locked the pump valve! Look, I found the guard's secret radio on the ground.",
              textFa: "کلید برنجی تو شیر پمپ را قفل کرد! نگاه کن، من بی‌سیم مخفی نگهبان را روی زمین پیدا کردم.",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-6-partner-bond-2a",
            titleFa: "قدردانی از شجاعت دکتر واتسون و اعلام شراکت رسمی",
            speakerPromptEn: "You look into Dr. Watson's steadfast eyes, feeling a profound shift in your heart...",
            speakerPromptFa: "به چشمان مصمم دکتر واتسون نگاه می‌کنی و دگرگونی عمیقی در احساست پدیدار می‌شود...",
            speakerRoleFa: "شرلوک هلمز (خطاب به واتسون)",
            speakerAvatar: "🔍",
            taskInstructionFa: "از وفاداری و فداکاری واتسون تشکر کن و بگو: «ممنونم دکتر واتسون، تو جان مرا نجات دادی و ما تیم بزرگی هستیم.»",
            targetKeywords: [
              { phrase: "Thank you Dr. Watson", hintFa: "(ممنونم دکتر واتسون)", synonyms: ["thank you dr watson", "thank you doctor watson", "thank you watson", "thanks watson"], weight: 30 },
              { phrase: "saved my life", hintFa: "(جان مرا نجات دادی)", synonyms: ["saved my life", "you saved my life", "saved me"], weight: 40 },
              { phrase: "great team", hintFa: "(تیم بزرگی هستیم)", synonyms: ["great team", "good team", "a great team", "partners"], weight: 30 },
            ],
            idealVoiceResponseEn: "Thank you Dr. Watson, you saved my life and we are a great team.",
            alternativeResponsesEn: [
              { phraseEn: "Thank you Watson, you risked your life for me and we make an excellent team.", translationFa: "متشکرم واتسون، تو جانت را برای من به خطر انداختی و ما تیم فوق‌العاده‌ای تشکیل می‌دهیم." },
              { phraseEn: "I am deeply grateful Watson, you saved me and we will finish this together.", translationFa: "من عمیقاً سپاسگزارم واتسون، تو مرا نجات دادی و این کار را با هم به پایان خواهیم برد." },
            ],
            whiteHintFa: "از افعال گذشته ساده مانند saved و صفت‌های توصیفی مانند great team استفاده کن!",
            fallbackChoices: [
              "Thank you Dr. Watson, you saved my life and we are a great team.",
              "This basement is very dusty and cold.",
              "I should buy a new pair of boots tomorrow.",
            ],
            aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار و همکار",
              speakerAvatar: "🩺",
              textEn: "A pleasure, Holmes. But shh... listen! Moriarty's voice is coming over the wall speaker!",
              textFa: "باعث افتخار است هلمز. اما هیس... گوش کن! صدای موریارتی از بلندگوی روی دیوار می‌آید!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "پیامد ۲ب: تاخیر مرگبار، مسمومیت قاضی و فداکاری واتسون",
        titleEn: "Consequence 2B: Lost Seconds & Watson's Heroic Sacrifice",
        storyIntroFa: "واتسون را دستبند می‌زنید و به تنهایی به اتاق کنترل شرق می‌دوید و گاز مدرسه را قطع می‌کنید. اما وقتی به زیرزمین می‌رسید، خیلی دیر شده است! کپسول باز شده و قاضی ارشد مقداری از گاز سفید را تنفس کرده است. ناگهان نگهبان موریارتی از تاریکی با خنجر به شما حمله می‌کند! ناگهان بنگ! دکتر واتسون با دست خونی وارد می‌شود—او لوله رادیاتور را شکسته تا خودش را رها کند و به کمک شما بیاید! واتسون نگهبان را به زمین می‌کوبد و جان شما را نجات می‌دهد!",
        cutscene: {
          titleFa: "دست خونی واتسون و نجات شرلوک از چاقوی نگهبان",
          titleEn: "Watson's Bloody Hands Save Holmes",
          imageSrc: "/images/skills/speaking/a2_scene_broken_pipe.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Look out—the guard has a dagger! I cannot dodge in time!",
              textFa: "مراقب باش—نگهبان خنجر دارد! من نمی‌توانم به موقع جاخالی بدهم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Get off him, murderer! *Slams the guard into the iron wall*",
              textFa: "از او دور شو قاتل! *نگهبان را به دیوار آهنی می‌کوبد*",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Watson?! You broke your own wrist and fractured the iron radiator to save my life?!",
              textFa: "واتسون؟! تو مچ دستت را شکستی و لوله رادیاتور آهنی را خرد کردی تا جان مرا نجات دهی؟! ",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "I am a soldier, Holmes. Now stop working alone and let us finish this together!",
              textFa: "من یک سربازم هلمز. حالا دیگر کار کردن به تنهایی را متوقف کن و بیا با هم این پرونده را تمام کنیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-6-partner-bond-2b",
            titleFa: "قدردانی از شجاعت دکتر واتسون و اعلام شراکت رسمی",
            speakerPromptEn: "You look into Dr. Watson's steadfast eyes, feeling a profound shift in your heart...",
            speakerPromptFa: "به چشمان مصمم دکتر واتسون نگاه می‌کنی و دگرگونی عمیقی در احساست پدیدار می‌شود...",
            speakerRoleFa: "شرلوک هلمز (خطاب به واتسون)",
            speakerAvatar: "🔍",
            taskInstructionFa: "از وفاداری و فداکاری واتسون تشکر کن و بگو: «ممنونم دکتر واتسون، تو جان مرا نجات دادی و ما تیم بزرگی هستیم.»",
            targetKeywords: [
              { phrase: "Thank you Dr. Watson", hintFa: "(ممنونم دکتر واتسون)", synonyms: ["thank you dr watson", "thank you doctor watson", "thank you watson", "thanks watson"], weight: 30 },
              { phrase: "saved my life", hintFa: "(جان مرا نجات دادی)", synonyms: ["saved my life", "you saved my life", "saved me"], weight: 40 },
              { phrase: "great team", hintFa: "(تیم بزرگی هستیم)", synonyms: ["great team", "good team", "a great team", "partners"], weight: 30 },
            ],
            idealVoiceResponseEn: "Thank you Dr. Watson, you saved my life and we are a great team.",
            alternativeResponsesEn: [
              { phraseEn: "Thank you Watson, you risked your life for me and we make an excellent team.", translationFa: "متشکرم واتسون، تو جانت را برای من به خطر انداختی و ما تیم فوق‌العاده‌ای تشکیل می‌دهیم." },
              { phraseEn: "I am deeply grateful Watson, you saved me and we will finish this together.", translationFa: "من عمیقاً سپاسگزارم واتسون، تو مرا نجات دادی و این کار را با هم به پایان خواهیم برد." },
            ],
            whiteHintFa: "از افعال گذشته ساده مانند saved و صفت‌های توصیفی مانند great team استفاده کن!",
            fallbackChoices: [
              "Thank you Dr. Watson, you saved my life and we are a great team.",
              "This basement is very dusty and cold.",
              "I should buy a new pair of boots tomorrow.",
            ],
            aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار و همکار",
              speakerAvatar: "🩺",
              textEn: "A pleasure, Holmes. But shh... listen! Moriarty's voice is coming over the wall speaker!",
              textFa: "باعث افتخار است هلمز. اما هیس... گوش کن! صدای موریارتی از بلندگوی روی دیوار می‌آید!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-a2-6-partner-bond-default",
        titleFa: "قدردانی از شجاعت دکتر واتسون و اعلام شراکت رسمی",
        speakerPromptEn: "You look into Dr. Watson's steadfast eyes, feeling a profound shift in your heart...",
        speakerPromptFa: "به چشمان مصمم دکتر واتسون نگاه می‌کنی و دگرگونی عمیقی در احساست پدیدار می‌شود...",
        speakerRoleFa: "شرلوک هلمز (خطاب به واتسون)",
        speakerAvatar: "🔍",
        taskInstructionFa: "از وفاداری و فداکاری واتسون تشکر کن و بگو: «ممنونم دکتر واتسون، تو جان مرا نجات دادی و ما تیم بزرگی هستیم.»",
        targetKeywords: [
          { phrase: "Thank you Dr. Watson", hintFa: "(ممنونم دکتر واتسون)", synonyms: ["thank you dr watson", "thank you doctor watson", "thank you watson", "thanks watson"], weight: 30 },
          { phrase: "saved my life", hintFa: "(جان مرا نجات دادی)", synonyms: ["saved my life", "you saved my life", "saved me"], weight: 40 },
          { phrase: "great team", hintFa: "(تیم بزرگی هستیم)", synonyms: ["great team", "good team", "a great team", "partners"], weight: 30 },
        ],
        idealVoiceResponseEn: "Thank you Dr. Watson, you saved my life and we are a great team.",
        alternativeResponsesEn: [
          { phraseEn: "Thank you Watson, you risked your life for me and we make an excellent team.", translationFa: "متشکرم واتسون، تو جانت را برای من به خطر انداختی و ما تیم فوق‌العاده‌ای تشکیل می‌دهیم." },
          { phraseEn: "I am deeply grateful Watson, you saved me and we will finish this together.", translationFa: "من عمیقاً سپاسگزارم واتسون، تو مرا نجات دادی و این کار را با هم به پایان خواهیم برد." },
        ],
        whiteHintFa: "از افعال گذشته ساده مانند saved و صفت‌های توصیفی مانند great team استفاده کن!",
        fallbackChoices: [
          "Thank you Dr. Watson, you saved my life and we are a great team.",
          "This basement is very dusty and cold.",
          "I should buy a new pair of boots tomorrow.",
        ],
        aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار و همکار",
          speakerAvatar: "🩺",
          textEn: "A pleasure, Holmes. But shh... listen! Moriarty's voice is coming over the wall speaker!",
          textFa: "باعث افتخار است هلمز. اما هیس... گوش کن! صدای موریارتی از بلندگوی روی دیوار می‌آید!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — The Dying Judge vs. Paddington Station (تصمیم سوم: دوراهی اخلاقی و اطلاعاتی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "A2",
    titleFa: "تصمیم سوم: نجات قاضی در حال مرگ یا شتاب به سوی پدینگتون؟",
    titleEn: "DECISION 3: The Dying Judge vs. Paddington Station",
    locationFa: "زیرزمین تاریک نگارخانه بلک‌فرایرز",
    locationEn: "Basement Floor, Blackfriars Gallery",
    storyIntroFa: "ناگهان صدای موریارتی از بلندگوی دیواری طنین‌انداز می‌شود: «آفرین شرلوک و دکتر! حالا نوبت پرده نهایی است. بمب اصلی خواب سفید داخل قطار سلطنتی در ایستگاه پدینگتون کار گذاشته شده است و راس ساعت ۱۱:۰۰ شب (۲۰ دقیقه دیگر) منفجر خواهد شد!» درست در همین لحظه، قاضی ارشد روی زمین تشنج می‌کند! قلب ضعیفش در اثر گاز به شماره افتاده است. او پالتوی شما را می‌گیرد و نجوا می‌کند: «هلمز... شنیدم موریارتی درباره سیم‌های بمب حرف می‌زد... سیم سیاه... سیم سفید... کمکم کن نفس بکشم...» واتسون به ساعتش نگاه می‌کند: «هلمز! رانندگی تا پدینگتون ۱۰ دقیقه طول می‌کشد! اگر ۵ دقیقه بمانیم تا قاضی را احیا کنیم، راز سیم‌ها را می‌فهمیم اما در ثانیه آخر به قطار می‌رسیم؛ اما اگر همین الان بدویم، وقت زیادی در ایستگاه داریم ولی قاضی به کما می‌رود و راز سیم‌ها را نمی‌فهمیم!»",
    cutscene: {
      titleFa: "پیام بمب پدینگتون و تشنج قاضی ارشد",
      titleEn: "Paddington Train Bomb Warning & The Collapsing Judge",
      imageSrc: "/images/skills/speaking/a2_scene_judge_collapsing.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "صدای پخش‌شده از بلندگو",
          speakerAvatar: "♟️",
          textEn: "The main White Sleep Bomb is inside the Royal Train at Paddington Station! Detonation at 11:00 PM—in exactly twenty minutes!",
          textFa: "بمب اصلی خواب سفید داخل قطار سلطنتی در ایستگاه پدینگتون کار گذاشته شده است! انفجار در ساعت ۱۱:۰۰ شب—دقیقاً بیست دقیقه دیگر!",
          bubblePosition: "right",
        },
        {
          speakerId: "judge",
          speakerNameFa: "قاضی ارشد",
          speakerRoleFa: "قربانی موریارتی",
          speakerAvatar: "⚖️",
          textEn: "Holmes... Watson... I heard Moriarty whisper the secret of the bomb wires... Black wire... White wire... help me breathe...",
          textFa: "هلمز... واتسون... شنیدم موریارتی راز سیم‌های بمب را زمزمه می‌کرد... سیم سیاه... سیم سفید... کمکم کنید نفس بکشم...",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Holmes! It takes ten minutes to reach Paddington. If we stay five minutes to revive the Judge, we learn the wire trick but arrive at the last second! If we sprint now, we arrive early but don't know the trick!",
          textFa: "هلمز! ده دقیقه طول می‌کشد تا به پدینگتون برسیم. اگر ۵ دقیقه بمانیم تا قاضی را احیا کنیم، ترفند سیم‌ها را یاد می‌گیریم اما ثانیه آخر می‌رسیم! اگر الان بدویم، زود می‌رسیم اما ترفند را نمی‌دانیم!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-3",
      promptFa: "یک دوراهی اخلاقی و اطلاعاتی: نجات قاضی و کشف راز سیم‌ها یا رفتن مستقیم به ایستگاه قطار؟",
      promptEn: "Critical Choice: Stay 5 minutes to treat the Judge or rush directly to Paddington Station?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Stay 5 minutes to treat the Judge and learn the wire secret",
          labelFa: "گزینه ۳الف: ماندن به مدت ۵ دقیقه برای درمان قاضی و فهمیدن راز سیم‌ها",
          descriptionFa: "جان قاضی را نجات می‌دهید و راز سیم سیاه را می‌شنوید، اما با حداقل زمان ممکن به قطار می‌رسید.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Leave the Judge for the ambulance and rush to Paddington",
          labelFa: "گزینه ۳ب: سپردن قاضی به آمبولانس و رفتن فوری به پدینگتون",
          descriptionFa: "زمان زیادی برای تخلیه سکو خواهید داشت، اما راز تله سیم‌های موریارتی را نخواهید دانست.",
          pointsDelta: 150,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-7-time-dilemma",
        titleFa: "محاسبه زمان و بیان دوراهی مرگ و زندگی",
        speakerPromptEn: "The Chief Judge struggles for breath on the damp floor as the clock ticks away...",
        speakerPromptFa: "قاضی ارشد در حالی که عقربه‌های ساعت پیش می‌روند، روی زمین مرطوب برای نفس کشیدن تقلا می‌کند...",
        speakerRoleFa: "قاضی ارشد (قربانی تله)",
        speakerAvatar: "⚖️",
        taskInstructionFa: "فوریت بمب قطار را بیان کن و بگو: «بمب قطار بیست دقیقه دیگر منفجر می‌شود و ما باید تصمیم درستی بگیریم.»",
        targetKeywords: [
          { phrase: "train bomb", hintFa: "(بمب قطار)", synonyms: ["train bomb", "the train bomb", "bomb on the train"], weight: 35 },
          { phrase: "in twenty minutes", hintFa: "(بیست دقیقه دیگر)", synonyms: ["in twenty minutes", "in 20 minutes", "within twenty minutes"], weight: 35 },
          { phrase: "make the right decision", hintFa: "(تصمیم درستی بگیریم)", synonyms: ["make the right decision", "make a decision", "choose the right path"], weight: 30 },
        ],
        idealVoiceResponseEn: "The train bomb will explode in twenty minutes, and we must make the right decision.",
        alternativeResponsesEn: [
          { phraseEn: "The bomb explodes in twenty minutes, so we have to decide right now.", translationFa: "بمب بیست دقیقه دیگر منفجر می‌شود، بنابراین باید همین الان تصمیم بگیریم." },
          { phraseEn: "We only have twenty minutes before the train bomb detonates at Paddington.", translationFa: "ما فقط بیست دقیقه فرصت داریم قبل از اینکه بمب قطار در پدینگتون منفجر شود." },
        ],
        whiteHintFa: "از زمان آینده با will و عبارت زمانی in twenty minutes استفاده کن!",
        fallbackChoices: [
          "The train bomb will explode in twenty minutes, and we must make the right decision.",
          "Trains in London are usually very comfortable.",
          "Let us look at the old clock on the wall.",
        ],
        aefReference: "AEF 2 Unit 5A (Future with will + Preposition of time in)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Give the command, Holmes! Stay to revive the Judge or sprint to the taxi?",
          textFa: "دستور را بده هلمز! بمانیم تا قاضی را احیا کنیم یا به سمت تاکسی بدویم؟",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 8: Consequence of Decision 3 & Track 9 (پیامد تصمیم سوم و رسیدن به ایستگاه)
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "A2",
    titleFa: "پیامد تصمیم سوم: مسابقه با مرگ به سوی سکوی شماره ۹",
    titleEn: "Consequence of Decision 3: The Race to Track 9 at Paddington",
    locationFa: "سکوی شماره ۹، ایستگاه راه‌آهن پدینگتون لندن",
    locationEn: "Platform Track 9, Paddington Railway Station, London",
    storyIntroFa: "پیامد انتخاب مرحله هفتم رقم می‌خورد: یا قاضی را احیا کرده‌اید و راز سیم سیاه را از زبان او شنیده‌اید اما تنها ۶۰ ثانیه به انفجار مانده است، یا با سرعت خودتان را به ایستگاه رسانده‌اید و ۶ دقیقه زمان دارید اما بدون هیچ سرنخی از تله موریارتی!",
    cutscene: {
      titleFa: "رسیدن به پدینگتون در زیر باران سیل‌آسا",
      titleEn: "Arrival at Paddington Station in Pouring Rain",
      imageSrc: "/images/skills/speaking/a2_scene_paddington_rain.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Paddington Station! The steam engine of the Royal Train is whistling on Track 9!",
          textFa: "ایستگاه پدینگتون! لوکوموتیو بخار قطار سلطنتی در خط ۹ سوت می‌کشد!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Follow me, Holmes! The station guards are confused, we must clear the platform!",
          textFa: "دنبال من بیا هلمز! نگهبانان ایستگاه سردرگم هستند، باید سکو را تخلیه کنیم!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "پیامد ۳الف: راز فاش‌شده قاضی و ۶۰ ثانیه نفس‌گیر",
        titleEn: "Consequence 3A: The Judge's Secret & 60 Seconds Left",
        storyIntroFa: "شما و واتسون قاضی را احیا می‌کنید (با پادزهر در صورت انتخاب ۱ب، یا احیای تنفسی در صورت انتخاب ۱الف). قاضی چشمانش را باز می‌کند و به سختی نجوا می‌کند: «خوب گوش کنید... در تمام بمب‌های ارتش، بریدن سیم سفید برق را قطع می‌کند. اما موریارتی آن‌ها را جابجا کرده است! هرگز سیم سفید را نبرید! سیم سیاه را ببرید و کد ۷۷ را وارد کنید!» با آمبولانس تماس می‌گیرید و در باران سیل‌آسا رانندگی می‌کنید. در حالی به پدینگتون می‌رسید که فقط ۶۰ ثانیه روی تایمر مانده است!",
        cutscene: {
          titleFa: "راز سیم سیاه و ۶۰ ثانیه مانده به انفجار",
          titleEn: "The Wire Secret & 60 Seconds Left",
          imageSrc: "/images/skills/speaking/a2_scene_judge_confession.jpg",
          dialogues: [
            {
              speakerId: "judge",
              speakerNameFa: "قاضی ارشد",
              speakerRoleFa: "قربانی موریارتی",
              speakerAvatar: "⚖️",
              textEn: "Listen carefully! Moriarty reversed the wires! Do NOT cut the White wire! Cut the BLACK wire and type Code 77!",
              textFa: "دقت کنید! موریارتی سیم‌ها را معکوس کرده است! سیم سفید را نبرید! سیم سیاه را ببرید و کد ۷۷ را وارد کنید!",
              bubblePosition: "left",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The Judge gave us the golden key! Sprint to Track 9—we only have sixty seconds!",
              textFa: "قاضی کلید طلایی را به ما داد! بدو به خط ۹—فقط شصت ثانیه وقت داریم!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-8-evacuate-train-3a",
            titleFa: "فرمان تخلیه اضطراری و نفوذ به واگن قطار سلطنتی",
            speakerPromptEn: "Steam billows from the Royal Train engine as rain pounds against the glass roof of Paddington...",
            speakerPromptFa: "بخار غلیظی از لوکوموتیو قطار سلطنتی زبانه می‌کشد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد...",
            speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
            speakerAvatar: "🚂",
            taskInstructionFa: "به نگهبانان ایستگاه دستور بده و بگو: «تمام مسافران را فوراً تخلیه کنید، یک بمب خطرناک داخل قطار است!»",
            targetKeywords: [
              { phrase: "Evacuate all passengers", hintFa: "(تمام مسافران را تخلیه کنید)", synonyms: ["evacuate all passengers", "evacuate everyone", "clear the platform", "clear all passengers"], weight: 40 },
              { phrase: "immediately", hintFa: "(فوراً)", synonyms: ["immediately", "right now", "quickly"], weight: 25 },
              { phrase: "dangerous bomb inside the train", hintFa: "(بمب خطرناک داخل قطار است)", synonyms: ["dangerous bomb inside the train", "dangerous bomb", "bomb inside the train", "bomb on the train"], weight: 35 },
            ],
            idealVoiceResponseEn: "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
            alternativeResponsesEn: [
              { phraseEn: "Clear the station platform right now, because a dangerous bomb is in the Royal Train!", translationFa: "همین الان سکوی ایستگاه را تخلیه کنید، چون بمبی خطرناک در قطار سلطنتی است!" },
              { phraseEn: "Move all passengers away immediately, there is a chemical gas bomb on Track 9!", translationFa: "فوراً همه مسافران را دور کنید، یک بمب گاز شیمیایی در خط ۹ قرار دارد!" },
            ],
            whiteHintFa: "از جملات امری محکم (Imperatives) و قید immediately برای انتقال موقعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
              "I would like to purchase a first-class train ticket.",
              "Please tell me the departure schedule for Oxford.",
            ],
            aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
            npcResponse: {
              speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
              speakerRoleFa: "مسئول سکو",
              speakerAvatar: "🚂",
              textEn: "Everyone is running out of the station! The train doors are unlocked—hurry inside, Mr. Holmes!",
              textFa: "همه دارند از ایستگاه فرار می‌کنند! درهای قطار باز است—عجله کنید و داخل بروید آقای هلمز!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "پیامد ۳ب: تخلیه سکو با ۶ دقیقه وقت و تاریکی سرنخ‌ها",
        titleEn: "Consequence 3B: Evacuating the Platform with No Wire Clue",
        storyIntroFa: "برای قاضی آمبولانس صدا می‌زنید و مستقیم به سمت تاکسی می‌دوید. با ۶ دقیقه فرصت به پدینگتون می‌رسید! به پلیس ایستگاه کمک می‌کنید تا تمام مسافران را از سکوی ۹ تخلیه کنند. اما وقتی در واگن قطار سلطنتی را باز می‌کنید، هیچ ایده‌ای ندارید که آیا سیم سیاه تله است یا سیم سفید!",
        cutscene: {
          titleFa: "سکو تخلیه شد اما معما بدون سرنخ باقی ماند",
          titleEn: "Platform Cleared with Zero Wire Clues",
          imageSrc: "/images/skills/speaking/a2_scene_empty_platform.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "We reached Paddington with six full minutes to spare! Clear the passengers immediately!",
              textFa: "ما با ۶ دقیقه فرصت کامل به پدینگتون رسیدیم! مسافران را فوراً تخلیه کنید!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The carriage is clear, Holmes, but we have no clue about which wire Moriarty rigged as the trap!",
              textFa: "واگن خالی شد هلمز، اما ما هیچ سرنخی نداریم که موریارتی کدام سیم را به عنوان تله بسته است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-8-evacuate-train-3b",
            titleFa: "فرمان تخلیه اضطراری و نفوذ به واگن قطار سلطنتی",
            speakerPromptEn: "Steam billows from the Royal Train engine as rain pounds against the glass roof of Paddington...",
            speakerPromptFa: "بخار غلیظی از لوکوموتیو قطار سلطنتی زبانه می‌کشد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد...",
            speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
            speakerAvatar: "🚂",
            taskInstructionFa: "به نگهبانان ایستگاه دستور بده و بگو: «تمام مسافران را فوراً تخلیه کنید، یک بمب خطرناک داخل قطار است!»",
            targetKeywords: [
              { phrase: "Evacuate all passengers", hintFa: "(تمام مسافران را تخلیه کنید)", synonyms: ["evacuate all passengers", "evacuate everyone", "clear the platform", "clear all passengers"], weight: 40 },
              { phrase: "immediately", hintFa: "(فوراً)", synonyms: ["immediately", "right now", "quickly"], weight: 25 },
              { phrase: "dangerous bomb inside the train", hintFa: "(بمب خطرناک داخل قطار است)", synonyms: ["dangerous bomb inside the train", "dangerous bomb", "bomb inside the train", "bomb on the train"], weight: 35 },
            ],
            idealVoiceResponseEn: "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
            alternativeResponsesEn: [
              { phraseEn: "Clear the station platform right now, because a dangerous bomb is in the Royal Train!", translationFa: "همین الان سکوی ایستگاه را تخلیه کنید، چون بمبی خطرناک در قطار سلطنتی است!" },
              { phraseEn: "Move all passengers away immediately, there is a chemical gas bomb on Track 9!", translationFa: "فوراً همه مسافران را دور کنید، یک بمب گاز شیمیایی در خط ۹ قرار دارد!" },
            ],
            whiteHintFa: "از جملات امری محکم (Imperatives) و قید immediately برای انتقال موقعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
              "I would like to purchase a first-class train ticket.",
              "Please tell me the departure schedule for Oxford.",
            ],
            aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
            npcResponse: {
              speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
              speakerRoleFa: "مسئول سکو",
              speakerAvatar: "🚂",
              textEn: "Everyone is running out of the station! The train doors are unlocked—hurry inside, Mr. Holmes!",
              textFa: "همه دارند از ایستگاه فرار می‌کنند! درهای قطار باز است—عجله کنید و داخل بروید آقای هلمز!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-a2-8-evacuate-train-default",
        titleFa: "فرمان تخلیه اضطراری و نفوذ به واگن قطار سلطنتی",
        speakerPromptEn: "Steam billows from the Royal Train engine as rain pounds against the glass roof of Paddington...",
        speakerPromptFa: "بخار غلیظی از لوکوموتیو قطار سلطنتی زبانه می‌کشد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد...",
        speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
        speakerAvatar: "🚂",
        taskInstructionFa: "به نگهبانان ایستگاه دستور بده و بگو: «تمام مسافران را فوراً تخلیه کنید، یک بمب خطرناک داخل قطار است!»",
        targetKeywords: [
          { phrase: "Evacuate all passengers", hintFa: "(تمام مسافران را تخلیه کنید)", synonyms: ["evacuate all passengers", "evacuate everyone", "clear the platform", "clear all passengers"], weight: 40 },
          { phrase: "immediately", hintFa: "(فوراً)", synonyms: ["immediately", "right now", "quickly"], weight: 25 },
          { phrase: "dangerous bomb inside the train", hintFa: "(بمب خطرناک داخل قطار است)", synonyms: ["dangerous bomb inside the train", "dangerous bomb", "bomb inside the train", "bomb on the train"], weight: 35 },
        ],
        idealVoiceResponseEn: "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
        alternativeResponsesEn: [
          { phraseEn: "Clear the station platform right now, because a dangerous bomb is in the Royal Train!", translationFa: "همین الان سکوی ایستگاه را تخلیه کنید، چون بمبی خطرناک در قطار سلطنتی است!" },
          { phraseEn: "Move all passengers away immediately, there is a chemical gas bomb on Track 9!", translationFa: "فوراً همه مسافران را دور کنید، یک بمب گاز شیمیایی در خط ۹ قرار دارد!" },
        ],
        whiteHintFa: "از جملات امری محکم (Imperatives) و قید immediately برای انتقال موقعیت اضطراری استفاده کن!",
        fallbackChoices: [
          "Evacuate all passengers immediately, there is a dangerous bomb inside the train!",
          "I would like to purchase a first-class train ticket.",
          "Please tell me the departure schedule for Oxford.",
        ],
        aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
        npcResponse: {
          speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
          speakerRoleFa: "مسئول سکو",
          speakerAvatar: "🚂",
          textEn: "Everyone is running out of the station! The train doors are unlocked—hurry inside, Mr. Holmes!",
          textFa: "همه دارند از ایستگاه فرار می‌کنند! درهای قطار باز است—عجله کنید و داخل بروید آقای هلمز!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4 — Black or White? (تصمیم چهارم: آخرین آزمایش موریارتی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "A2",
    titleFa: "تصمیم چهارم: سیم سیاه یا سیم سفید؟ آزمون نهایی موریارتی",
    titleEn: "DECISION 4: Black or White Wire? Moriarty's Final Trial",
    locationFa: "داخل واگن قطار سلطنتی، خط ۹ پدینگتون",
    locationEn: "Inside Royal Carriage, Track 9, Paddington",
    storyIntroFa: "شما و دکتر واتسون به داخل واگن قطار می‌پرید. در میان واگن، یک دستگاه شیشه‌ای بزرگ پر از گاز سفید قرار دارد. صفحه دیجیتال کوچک روی بمب عدد ۰۰:۴۵ ثانیه را نشان می‌دهد! داخل جعبه باز، دو سیم ضخیم قرار دارد: یک سیم سفید و یک سیم سیاه، همراه با یک صفحه کلید کوچک ارقام. دوربین کوچکی بالای بمب به سمت شما می‌چرخد و صدای خنده موریارتی از بلندگو پخش می‌شود: «چهل ثانیه شرلوک! نگارخانه مرا به یاد بیاور: سیاه و سفید. تو کیستی کارآگاه؟ قهرمان کلاه سفید، یا کسی که تاریکی سیاه را درک می‌کند؟ یک سیم را ببر و کد را وارد کن—من دارم تماشا می‌کنم!» دکتر واتسون انبر سیم‌چین آهنی را در دست دارد و دستانش کمی می‌لرزد: «هلمز! در ارتش بریتانیا، بریدن سیم سفید همیشه برق را قطع می‌کند و بریدن سیم سیاه باعث انفجار می‌شود! کدام را ببرم؟!»",
    cutscene: {
      titleFa: "بمب گاز خواب سفید در واگن سلطنتی و دوراهی سیم‌ها",
      titleEn: "The White Sleep Device & The Two Wires",
      imageSrc: "/images/skills/speaking/a2_scene_bomb_wires.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "بلندگوی بمب",
          speakerAvatar: "♟️",
          textEn: "Forty seconds, Sherlock! Black and White! Are you the hero in the White hat, or do you understand the darkness of the Black? Cut one wire and type the code—I am watching!",
          textFa: "چهل ثانیه شرلوک! سیاه و سفید! آیا تو قهرمانی با کلاه سفید هستی، یا تاریکی سیاه را درک می‌کنی؟ یک سیم را ببر و کد را بزن—من دارم تماشا می‌کنم!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با سیم‌چین",
          speakerAvatar: "🩺",
          textEn: "Holmes! In the British Army, cutting the White wire stops power, and the Black wire causes explosion! Which one do I cut?!",
          textFa: "هلمز! در ارتش بریتانیا، بریدن سیم سفید برق را قطع می‌کند و سیم سیاه باعث انفجار می‌شود! کدام را ببرم؟! ",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-4",
      promptFa: "آخرین و سرنوشت‌سازترین تصمیم: آیا به قانون ارتش گوش می‌دهید یا دست موریارتی را می‌خوانید؟",
      promptEn: "The Ultimate Choice: Cut the Black wire (reversed rules) or the White wire (army rules)?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Cut the BLACK wire (Moriarty reversed standard rules)",
          labelFa: "گزینه ۴الف: بریدن سیم سیاه (دستور به بریدن سیم سیاه و قفل شیر)",
          descriptionFa: "به واتسون می‌گویید موریارتی قوانین ارتش را معکوس کرده است؛ سیم سیاه را می‌برید و شیر گاز را قفل می‌کنید.",
          pointsDelta: 200,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Cut the WHITE wire (Standard British Army protocol)",
          labelFa: "گزینه ۴ب: بریدن سیم سفید (پیروی از قانون استاندارد ارتش)",
          descriptionFa: "به قانون استاندارد بمب‌های ارتش که واتسون می‌گوید اعتماد می‌کنید و دستور قطع سیم سفید را می‌دهید.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-9-cut-wire",
        titleFa: "صدور دستور قطعی به دکتر واتسون برای بریدن سیم",
        speakerPromptEn: "Watson holds the steel wire cutters steady over the bomb mechanism, his eyes fixed on you...",
        speakerPromptFa: "واتسون انبر سیم‌چین فولادی را روی مکانیزم بمب ثابت نگه داشته و چشمانش به دهان شما دوخته شده است...",
        speakerRoleFa: "دکتر جان واتسون (مسلح به سیم‌چین)",
        speakerAvatar: "🩺",
        taskInstructionFa: "دستور نهایی را به واتسون بده و بگو: «سیم سیاه را ببر جان، چون موریارتی قوانین را تغییر داده است تا ما را فریب دهد!»",
        targetKeywords: [
          { phrase: "Cut the black wire", hintFa: "(سیم سیاه را ببر)", synonyms: ["cut the black wire", "cut black wire", "cut the black one"], weight: 40 },
          { phrase: "John", hintFa: "(جان / واتسون)", synonyms: ["john", "watson", "dr watson"], weight: 20 },
          { phrase: "reversed the rules", hintFa: "(قوانین را معکوس کرده)", synonyms: ["reversed the rules", "changed the rules", "reversed the army rules", "switched the wires"], weight: 40 },
        ],
        idealVoiceResponseEn: "Cut the black wire John, because Moriarty reversed the rules to trick us!",
        alternativeResponsesEn: [
          { phraseEn: "Watson, cut the black wire now because the white wire is Moriarty's trap!", translationFa: "واتسون، الان سیم سیاه را ببر چون سیم سفید تله موریارتی است!" },
          { phraseEn: "Do not cut the white wire John, cut the black wire immediately!", translationFa: "سیم سفید را قطع نکن جان، فوراً سیم سیاه را ببر!" },
        ],
        whiteHintFa: "از حرف ربط because برای بیان علت دستور، و از فعل reversed استفاده کن!",
        fallbackChoices: [
          "Cut the black wire John, because Moriarty reversed the rules to trick us!",
          "I cannot choose, let us jump out of the window.",
          "What colour is the train engine outside?",
        ],
        aefReference: "AEF 2 Unit 6A (Conjunction because + Imperatives + Past Simple)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "I trust your deductions, Sherlock! Jaws are closing on the wire... SNIP!",
          textFa: "من به استنتاج‌هایت ایمان دارم شرلوک! فک‌های سیم‌چین روی سیم بسته می‌شوند... تیک!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: The Two Endings & The Shocking Plot Twist (دو پایان نهایی و پلات‌توییست بزرگ)
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "A2",
    titleFa: "پرده دهم: فرجام بازی سیاه و سفید و افشای نقشه پنهان موریارتی",
    titleEn: "Stage 10: The Grand Climax & The Big Plot Twist",
    locationFa: "خط ۹ ایستگاه پدینگتون و دخمه مخفی آرشیو MI6",
    locationEn: "Track 9 Carriage & The Breached MI6 Archive Vault",
    storyIntroFa: "سیم بریده می‌شود و نفس‌ها در سینه حبس می‌گردد. در بیرون، غرش باران بر بدنه قطار سلطنتی می‌کوبد. آیا تصمیم‌های شما در طول این ۱۰ مرحله، فاجعه را مهار کرده یا گاز سفید را آزاد ساخته است؟",
    cutscene: {
      titleFa: "لحظه انفجار یا مهار بمب در خط ۹ پدینگتون",
      titleEn: "The Moment of Detonation or Disarmament on Track 9",
      imageSrc: "/images/skills/speaking/a2_scene_final_climax.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار شرلوک",
          speakerAvatar: "🩺",
          textEn: "The wire is cut! Holmes, look at the gas canister!",
          textFa: "سیم بریده شد! هلمز، به مخزن گاز نگاه کن!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Wait a second, John... let me inspect this white residue on the floor with my magnifying glass.",
          textFa: "یک لحظه صبر کن جان... بگذار این پودر سفید باقی‌مانده روی زمین را با ذره‌بینم معاینه کنم.",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-10-taste-powder",
        titleFa: "معاینه علمی گرد سفید و کشف ماهیت واقعی بمب",
        speakerPromptEn: "You bend down, touch the white residue on the train floor, and taste it with your fingertips...",
        speakerPromptFa: "خم می‌شوی، با نوک انگشتان ماده سفید روی کف قطار را لمس می‌کنی و آن را می‌چشی...",
        speakerRoleFa: "شرلوک هلمز (استنتاج علمی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "با شگفتی به واتسون حقیقت را اعلام کن و بگو: «این پودر سفید گاز سمی نیست، این فقط شکر و دود تئاتر بی‌خطر است!»",
        targetKeywords: [
          { phrase: "white powder", hintFa: "(پودر سفید)", synonyms: ["white powder", "this white powder", "the white powder"], weight: 30 },
          { phrase: "not poison", hintFa: "(سمی نیست)", synonyms: ["not poison", "is not poison", "not dangerous", "not poisonous"], weight: 35 },
          { phrase: "sugar and harmless smoke", hintFa: "(شکر و دود بی‌خطر)", synonyms: ["sugar and harmless smoke", "theatre smoke and sugar", "harmless smoke", "only sugar and smoke"], weight: 35 },
        ],
        idealVoiceResponseEn: "This white powder is not poison, it is only sugar and harmless theatre smoke!",
        alternativeResponsesEn: [
          { phraseEn: "Look John, this gas is not poisonous, it is just harmless sugar and smoke!", translationFa: "نگاه کن جان، این گاز سمی نیست، فقط شکر و دود بی‌خطر است!" },
          { phraseEn: "Touch this residue Watson, it is harmless theatre smoke to distract us!", translationFa: "این گرده را لمس کن واتسون، این دود بی‌خطر تئاتر بود تا حواس ما را پرت کند!" },
        ],
        whiteHintFa: "از زمان حال ساده با فعل to be و صفت‌های harmless و poison استفاده کن. راز بزرگ برملا شد!",
        fallbackChoices: [
          "This white powder is not poison, it is only sugar and harmless theatre smoke!",
          "We should run away because London is destroyed.",
          "I wonder where I left my warm wool gloves.",
        ],
        aefReference: "AEF 2 Unit 6B (Present Simple sensory deductions + Negative sentences)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار بهت‌زده",
          speakerAvatar: "🩺",
          textEn: "A fake bomb?! But why would Moriarty orchestrate all this just to keep us busy?! Holmes, look behind the brick wall!",
          textFa: "یک بمب ساختگی؟! اما چرا موریارتی باید تمام این‌ها را راه می‌انداخت فقط برای اینکه ما را سرگرم کند؟! هلمز، پشت دیوار آجری را نگاه کن!",
        },
      },
    ],
    possibleEndings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان پیروزمندانه: مهار هوشمندانه بمب و تولد رفاقت تاریخی",
        titleEn: "ENDING 1: CASE SOLVED — The Partnership Triumphs!",
        badgeTitleFa: "🎖️ پرونده با موفقیت حل شد: شاهکار مشترک هلمز و واتسون",
        imageSrc: "/images/skills/speaking/a2_scene_case_solved.jpg",
        climaxStoryFa: "«سیم سیاه را ببر جان! وایت تله اوست!» واتسون سیم سیاه را قطع می‌کند و شما با استفاده از کد ۷۷ و کلید برنجی، شیر اضطراری را قفل می‌کنید. نمایشگر قرمز روی ثانیه ۰۰:۰۲ متوقف می‌شود! در بیرون، صدای فریاد شادی پلیس و مسافران به آسمان بلند می‌شود. شما جان صدها انسان و قاضی ارشد را نجات دادید و در این نبرد سخت، یک دوست و برادر واقعی به نام دکتر جان واتسون یافتید!",
        climaxStoryEn: "'Cut the Black wire, John! Moriarty is Agent White—White is his trap!' Watson trusts you completely and cuts the Black wire. You enter Code 77 and lock the valve—the timer freezes at 00:02! Outside, the crowds cheer. The case is solved!",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
با فرو نشستن غبار، ذره‌ای از پودر سفید روی زمین را می‌چشید... این گاز سمی نیست! فقط شکر و دود بی‌خطر تئاتر است!
ناگهان صدای فلزی ضعیفی از پشت دیوار آجری خط ۹ به گوش می‌رسد. پشت قطار می‌دوید: یک سوراخ بزرگ در دیوار حفر شده است!
پشت خط ۹، گاوصندوق سری اسناد فوق‌محرمانه MI6 (سرویس اطلاعات مخفی بریتانیا) قرار داشت! در حالی که شما و تمام پلیس‌های لندن به بمب جعلی قطار چشم دوخته بودید، افراد موریارتی گاوصندوق را غارت کرده و با قایق موتوری از کانال زیرزمینی گریخته‌اند!
از کل گاوصندوق تنها چهار پوشه به سرقت رفته است. روی میز فولادی، موریارتی روبان صورتی لیلی و نامه‌ای با جوهر سیاه به جا گذاشته است:

«شرلوک عزیزم،
از بازی سیاه و سفید امشب ما لذت بردی؟ بمب گاز فقط یک تردستی جادویی بود تا تو را دو ساعت سرگرم نگه دارد! امشب من به دو پیروزی بزرگ رسیدم:
۱. چهار پرونده فوق‌محرمانه بریتانیا را دزدیدم (که نمادهایشان داخل روبان صورتی لیلی دوخته شده بود: قطار آبی [B1]، سکه هاوند [B2]، دفترچه تاج [C1]، و پرونده سرخ [C2]).
۲. مهم‌تر از آن... من دکتر جان واتسون را به تو هدیه دادم.
واقعاً فکر کردی تصادفی بود که واتسون امشب به اتاق ۴۰۴ آمد؟ من صبح امروز دوست نظامی او را مسموم کردم تا واتسون به بیمارستان سنت جود بدود و با تو ملاقات کند! چرا؟ چون شکستن یک کارآگاه تنها که هیچ احساسی در دل ندارد غیرممکن است. من امشب یک بهترین دوست به تو دادم شرلوک. یاد بگیر به او اعتماد کنی. مانند برادرت دوستش بدار... چرا که در روز نبرد نهایی ما، او بهایی خواهد بود که باید بپردازی.
تا بازی بعدی ما — ج. موریارتی»

واتسون کنارتان می‌ایستد: «هلمز... نامه چه می‌گوید؟»
به دوست جدیدتان نگاه می‌کنید، نیمه پایینی نامه را مخفیانه پاره می‌کنید، در جیب پالتویتان می‌گذارید و آرام می‌گویید:
«هیچ چیز مهمی نیست جان... فقط اینکه کار واقعی ما تازه شروع شده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The bomb was harmless theatre smoke and sugar! Behind Track 9, Moriarty breached the MI6 Vault and stole the Four Secret Folders. He left a letter: 'I gave you Dr. John Watson... on our final day together, he will be the price you pay.' Sherlock conceals the torn bottom half of the letter in his pocket.",
        nextTierHintFa: "پرونده سطح A2 با پیروزی شما و پیوند تاریخی با دکتر واتسون بسته شد! اما موریارتی ۴ پرونده محرمانه MI6 را ربوده است. در سطح B1 (پرونده The Glass Jury)، موریارتی شما را به دادگاه شیشه‌ای می‌کشاند، جایی که گواهی فوت جعلی ۵ سال پیش با امضای دکتر واتسون پیدا می‌شود!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان ناکام: انفجار دود در قطار سلطنتی و هرج‌ومرج در پدینگتون",
        titleEn: "ENDING 2: CASE FAILED — White Smoke Over London!",
        badgeTitleFa: "⚠️ پرونده ناکام: فعال شدن تله موریارتی در قطار سلطنتی",
        imageSrc: "/images/skills/speaking/a2_scene_case_failed.jpg",
        climaxStoryFa: "کلیک! به محض بریدن سیم سفید (یا اتمام ثانیه‌ها)، نور قرمز چشمک می‌زند و صدای هیس ممتدی بلند می‌شود! لوله شیشه‌ای خرد شده و دود غلیظ سفیدی واگن و سکوی خط ۹ را پر می‌کند. شما و واتسون با پالتو صورت‌هایتان را می‌پوشانید و از پنجره واگن روی سکوی خیس سقوط می‌کنید. هرج‌ومرج ایستگاه را فرا می‌گیرد در حالی که صدای خنده سرد موریارتی در بلندگوها طنین‌انداز است!",
        climaxStoryEn: "CLICK! As the White wire is cut, a red light flashes! The glass tube shatters and thick white gas erupts across Track 9! You and Watson leap out of the window into the chaos as Moriarty's laughter echoes through the station!",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
با پراکنده شدن دود، متوجه می‌شوید که به خواب نرفته‌اید! ماده روی زمین را می‌چشید... این گاز سمی نیست! فقط شکر سوخته و دود تئاتر است!
ناگهان صدای مته از پشت دیوار آجری به گوش می‌رسد. به پشت قطار می‌دوید: سوراخی در دیوار گاوصندوق فوق‌محرمانه MI6 کنده شده است! موریارتی همه شما را با یک بمب فیک سر کار گذاشت تا چهار پرونده سری بریتانیا را بدزدد!
روی میز آرشیو، نامه‌ای با جوهر سیاه در کنار روبان صورتی لیلی خودنمایی می‌کند:

«شرلوک عزیزم،
بمب قطار فقط یک شعبده‌بازی برای تلف کردن وقت تو بود! امشب من به دو پیروزی بزرگ رسیدم:
۱. سرقت ۴ پرونده فوق‌محرمانه MI6 (قطار آبی [B1]، سکه هاوند [B2]، دفترچه تاج [C1]، و پرونده سرخ [C2]).
۲. هدیه دادن دکتر جان واتسون به تو!
من عمداً دوست واتسون را مسموم کردم تا او را در اتاق ۴۰۴ جلوی پای تو بگذارم. یک انسان بی‌احساس شکسته نمی‌شود؛ من به تو یک برادر دادم تا در فینال بازی، با گرفتن جان او روحت را تکه‌تکه کنم!
— ج. موریارتی»

شما دستتان می‌لرزد. نیمه پایین نامه را پاره کرده و در جیب پالتویتان پنهان می‌کنید. به واتسون می‌گویید: «هیچ چیز جان... فقط بازی ما با موریارتی تازه آغاز شده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The bomb was harmless theatre smoke! Behind Track 9, Moriarty breached the MI6 Vault and stole the Four Secret Folders. He left a letter: 'I gave you Dr. John Watson... on our final day together, he will be the price you pay.' Sherlock conceals the torn bottom half of the letter in his pocket.",
        nextTierHintFa: "اگرچه بمب قطار عمل کرد، اما هویت فیک بمب و سرقت ۴ پرونده محرمانه MI6 نشان داد موریارتی کل شب شما را بازی داده است! در سطح B1 (The Glass Jury)، شرلوک و واتسون برای بازپس‌گیری اسناد وارد دادگاه مرگبار شیشه‌ای خواهند شد!",
      },
    },
  },
];
