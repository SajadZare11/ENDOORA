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
          textEn: "This pink ribbon is very thick. Let me open it with my pocket knife.",
          textFa: "این روبان صورتی خیلی ضخیم است. بگذارید با چاقوی جیبی‌ام آن را باز کنم.",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look! A small brass key and an old card: 'Room 404, St. Jude Hospital'.",
          textFa: "نگاه کنید! یک کلید برنجی کوچک و یک کارت قدیمی: «اتاق ۴۰۴، بیمارستان سنت جود».",
          bubblePosition: "left",
        },
        {
          speakerId: "lestrade",
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Sherlock! A thief broke into the hospital lab and stole a dangerous gas!",
          textFa: "شرلوک! دزدی وارد آزمایشگاه بیمارستان شد و یک گاز خطرناک را دزدید!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Don't panic, Lestrade! I have a clue for Room 404. I am coming now!",
          textFa: "وحشت نکنید لسترید! من سرنخی از اتاق ۴۰۴ دارم. الان می‌آیم!",
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
        taskInstructionFa: "به بازرس لسترید بگو: «من یک کلید پیدا کردم و الان به بیمارستان می‌آیم.»",
        targetKeywords: [
          { phrase: "found a key", hintFa: "(یک کلید پیدا کردم)", synonyms: ["found a key", "found the key", "have a key"], weight: 45 },
          { phrase: "coming to the hospital", hintFa: "(دارم به بیمارستان می‌آیم)", synonyms: ["coming to the hospital", "going to the hospital", "coming now", "coming to st. jude hospital"], weight: 55 },
        ],
        idealVoiceResponseEn: "I found a key, and I am coming to the hospital right now.",
        alternativeResponsesEn: [
          { phraseEn: "I found a secret key, so I am going to the hospital.", translationFa: "من یک کلید مخفی پیدا کردم، پس دارم به بیمارستان می‌روم." },
          { phraseEn: "I have a clue, and I am coming to the hospital now.", translationFa: "من سرنخی دارم و الان دارم به بیمارستان می‌آیم." },
        ],
        whiteHintFa: "برای تسلط به زمان حال استمراری و گذشته ساده، از افعال found و am coming استفاده کن. با قدرت شروع کن هلمز!",
        fallbackChoices: [
          "I found a key, and I am coming to the hospital right now.",
          "I am drinking tea at home with no hurry.",
          "Where did I put my walking stick yesterday morning?",
        ],
        aefReference: "AEF 2 Unit 1C & 2A (Past simple of irregular verbs + Present continuous for arranged action)",
        npcResponse: {
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Hurry, Holmes! Smoke is coming from the fourth floor!",
          textFa: "عجله کن هلمز! دود از طبقه چهارم بالا می‌آید!",
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
    storyIntroFa: "با شتاب از پله‌ها به طبقه چهارم می‌دوید. راهرو تاریک است و بوی دود و سوختگی به مشام می‌رسد. در اتاق ۴۰۴، یک نقشه و دفترچه مخفی در سطل زباله در حال سوختن است و تا ۳۰ ثانیه دیگر خاکستر می‌شود! این صحنه یادآور پرونده‌ای عجیب از ۵ سال پیش است. همزمان در راهرو، فردی با دیلم فلزی مشغول شکستن قفل قفسه داروهاست!",
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
          textEn: "Room 404! Smoke is coming out of the trash can, and papers are burning!",
          textFa: "اتاق ۴۰۴! دود از سطل زباله بیرون می‌زند و کاغذها در حال سوختن هستند!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "This scene is similar to that case five years ago... Someone is in the hallway breaking the medicine cabinet!",
          textFa: "این صحنه شبیه به همان پرونده پنج سال پیش است... فردی در راهرو دارد قفسه داروها را می‌شکند!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "If I stop the fire, the suspect escapes. If I stop the suspect, the papers burn!",
          textFa: "اگر آتش را خاموش کنم، مظنون فرار می‌کند. اگر مظنون را بگیرم، کاغذها می‌سوزند!",
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
          descriptionFa: "مدارک و نقشه را از آتش نجات می‌دهید، اما مظنون ممکن است فرار کند.",
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
        taskInstructionFa: "وضعیت را توصیف کن و بگو: «من آتش را در اتاق می‌بینم و مردی قفل را می‌شکند.»",
        targetKeywords: [
          { phrase: "fire in the room", hintFa: "(آتش در اتاق)", synonyms: ["fire in the room", "burning papers", "fire inside", "see burning papers"], weight: 45 },
          { phrase: "breaking the lock", hintFa: "(در حال شکستن قفل)", synonyms: ["breaking the lock", "breaking a lock", "is breaking the lock", "breaks the lock"], weight: 55 },
        ],
        idealVoiceResponseEn: "I see fire in the room, and a man is breaking the lock.",
        alternativeResponsesEn: [
          { phraseEn: "Papers are burning inside, and a man is breaking the cabinet.", translationFa: "کاغذها داخل در حال سوختن هستند و مردی قفسه را می‌شکند." },
          { phraseEn: "There is fire in Room 404, and someone is breaking the door.", translationFa: "آتش در اتاق ۴۰۴ وجود دارد و کسی در را می‌شکند." },
        ],
        whiteHintFa: "از ترکیب زمان حال استمراری (is breaking) و حال ساده استفاده کن تا فوریت حادثه را به تصویر بکشی!",
        fallbackChoices: [
          "I see fire in the room, and a man is breaking the lock.",
          "The hospital lights are very bright tonight.",
          "I need a glass of cold water right now.",
        ],
        aefReference: "AEF 2 Unit 2B (There is / There are + Present Continuous vs Present Simple)",
        npcResponse: {
          speakerNameFa: "ندای درونی هلمز",
          speakerRoleFa: "تجزیه و تحلیل ذهن شرلوک",
          speakerAvatar: "🧠",
          textEn: "Hurry, Sherlock! Save the papers or catch the man!",
          textFa: "عجله کن شرلوک! کاغذها را نجات بده یا مرد را بگیر!",
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
          textEn: "Don't shoot! I am Dr. John Watson, an army doctor.",
          textFa: "شلیک نکنید! من دکتر جان واتسون هستم، پزشک ارتش.",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سابق ارتش",
          speakerAvatar: "🩺",
          textEn: "Someone poisoned my friend with this gas! I came to find the antidote to save his life.",
          textFa: "کسی دوستم را با این گاز مسموم کرد! آمدم تا پادزهر را برای نجات جانش پیدا کنم.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Yesterday a fake friend tried to kill me. I do not trust you, Watson!",
          textFa: "دیروز یک دوست قلابی قصد جانم را کرد. من به شما اعتماد ندارم، واتسون!",
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
              textEn: "The paper is burned, but I can read: 'Blackfriars Gallery' and 'Code 77'!",
              textFa: "کاغذ سوخته، اما می‌توانم بخوانم: «نگارخانه بلک‌فرایرز» و «کد ۷۷»!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "Please don't shoot! I dropped the medicine bottle. I only want to save my friend!",
              textFa: "لطفاً شلیک نکنید! شیشه دارو افتاد. من فقط می‌خواهم دوستم را نجات دهم!",
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
            taskInstructionFa: "اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده، باید با من بیایی.»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 45 },
              { phrase: "come with me", hintFa: "(با من بیا)", synonyms: ["come with me", "must come with me", "follow me"], weight: 55 },
            ],
            idealVoiceResponseEn: "Give me your gun, you must come with me!",
            alternativeResponsesEn: [
              { phraseEn: "Give me the weapon, you have to follow me.", translationFa: "سلاح را به من بده، باید همراه من بیایی." },
              { phraseEn: "Drop your gun, Watson, and come with me right now.", translationFa: "اسلحه‌ات را بینداز واتسون، و همین الان با من بیا." },
            ],
            whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
            fallbackChoices: [
              "Give me your gun, you must come with me!",
              "Let us go home and sleep because we are tired.",
              "Where can I buy a ticket for the steam train?",
            ],
            aefReference: "AEF 2 Unit 3A (Must / Have to for obligation + Imperatives)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Take my gun, Holmes. I will help you catch this criminal!",
              textFa: "اسلحه‌ام را بگیر هلمز. من کمکت می‌کنم این تبهکار را بگیری!",
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
              textEn: "Don't move! I have the antidote box now!",
              textFa: "تکان نخورید! حالا جعبه پادزهر دست من است!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "I am not a thief! I am Dr. Watson, and I must save my friend!",
              textFa: "من دزد نیستم! من دکتر واتسون هستم و باید دوستم را نجات دهم!",
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
            taskInstructionFa: "اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده، باید با من بیایی.»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 45 },
              { phrase: "come with me", hintFa: "(با من بیا)", synonyms: ["come with me", "must come with me", "follow me"], weight: 55 },
            ],
            idealVoiceResponseEn: "Give me your gun, you must come with me!",
            alternativeResponsesEn: [
              { phraseEn: "Give me the weapon, you have to follow me.", translationFa: "سلاح را به من بده، باید همراه من بیایی." },
              { phraseEn: "Drop your gun, Watson, and come with me right now.", translationFa: "اسلحه‌ات را بینداز واتسون، و همین الان با من بیا." },
            ],
            whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
            fallbackChoices: [
              "Give me your gun, you must come with me!",
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
        taskInstructionFa: "اسلحه را از واتسون بخواه و بگو: «اسلحه‌ات را به من بده، باید با من بیایی.»",
        targetKeywords: [
          { phrase: "Give me your gun", hintFa: "(اسلحه‌ات را بده)", synonyms: ["give me your gun", "hand over your gun", "give me the gun"], weight: 45 },
          { phrase: "come with me", hintFa: "(با من بیا)", synonyms: ["come with me", "must come with me", "follow me"], weight: 55 },
        ],
        idealVoiceResponseEn: "Give me your gun, you must come with me!",
        alternativeResponsesEn: [
          { phraseEn: "Give me the weapon, you have to follow me.", translationFa: "سلاح را به من بده، باید همراه من بیایی." },
          { phraseEn: "Drop your gun, Watson, and come with me right now.", translationFa: "اسلحه‌ات را بینداز واتسون، و همین الان با من بیا." },
        ],
        whiteHintFa: "از فعل وجهی must یا have to برای ابراز دستور قاطعانه پلیسی استفاده کن. عالیه هلمز!",
        fallbackChoices: [
          "Give me your gun, you must come with me!",
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
          textEn: "Don't move, Moriarty! You are under arrest!",
          textFa: "تکان نخور موریارتی! تو بازداشت هستی!",
          bubblePosition: "left",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "استاد جنایت",
          speakerAvatar: "♟️",
          textEn: "Look around you, Sherlock! Black and White. Darkness and Light. That is you and me!",
          textFa: "به اطرافت نگاه کن شرلوک! سیاه و سفید. تاریکی و روشنایی. این من و تو هستیم!",
          bubblePosition: "right",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "استاد جنایت",
          speakerAvatar: "♟️",
          textEn: "I have a red button! In three minutes, two gas bombs will open: one in the basement, and one upstairs!",
          textFa: "یک دکمه قرمز دست من است! در سه دقیقه، دو بمب گاز باز می‌شوند: یکی در زیرزمین، و یکی در طبقه بالا!",
          bubblePosition: "right",
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
        taskInstructionFa: "به موریارتی بگو: «تو یک هیولا هستی، من جلویت را می‌گیرم!»",
        targetKeywords: [
          { phrase: "you are a monster", hintFa: "(تو یک هیولا هستی)", synonyms: ["you are a monster", "a monster", "monster moriarty"], weight: 50 },
          { phrase: "stop you", hintFa: "(جلویت را می‌گیرم)", synonyms: ["stop you", "will stop you", "i will stop you"], weight: 50 },
        ],
        idealVoiceResponseEn: "You are a monster, but I will stop you!",
        alternativeResponsesEn: [
          { phraseEn: "I will stop you, Moriarty!", translationFa: "جلوی تو را می‌گیرم موریارتی!" },
          { phraseEn: "You are a monster and I will end this now.", translationFa: "تو یک هیولا هستی و من همین الان به این ماجرا پایان می‌دهم." },
        ],
        whiteHintFa: "با استفاده از will اراده قطعی خودت رو برای متوقف کردن موریارتی بیان کن!",
        fallbackChoices: [
          "You are a monster, but I will stop you!",
          "I want to look at the paintings.",
          "When does the gallery open tomorrow?",
        ],
        aefReference: "AEF 2 Unit 3B (Will / Won't for promises and firm intentions)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه جنایت",
          speakerAvatar: "♟️",
          textEn: "Big words, Sherlock! The clock is ticking... Let the game begin!",
          textFa: "حرف‌های بزرگی است شرلوک! ساعت دارد می‌گذرد... بگذار بازی شروع شود!",
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
    storyIntroFa: "ساعت دیجیتال قرمز با سرعت ثانیه‌ها را می‌سوزاند: ۰۳:۰۰ دقیقه باقی مانده است! پله‌های سمت چپ به سمت اتاق پمپ زیرزمین می‌رود. پله‌های سمت راست به اتاق کنترل شرق بالا می‌رود. مشخص نیست در هر کدام از این مکان‌ها چه افرادی در خطر هستند، به تنهایی نمی‌توانید در ۳ دقیقه به هر دو نقطه برسید! دکتر واتسون جلو می‌آید و در چشمانتان می‌نگرد: «هلمز! می‌دانم به من اعتماد نداری. اما من یک سرباز و یک پزشکم! من به زیرزمین بروم و تو به اتاق کنترل برو!»",
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
          textEn: "Holmes, I can see your doubt.",
          textFa: "هلمز، می‌دانم به من اعتماد نداری.",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "I see you have a key, that must be for the basement! I will check the basement, and you run upstairs. Trust me!",
          textFa: "می‌بینم کلید داری، باید مال زیرزمین باشد! من زیرزمین را چک می‌کنم، تو به طبقه بالا برو. به من اعتماد کن!",
          bubblePosition: "right",
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
        taskInstructionFa: "به واتسون بگو: «ما فقط سه دقیقه وقت داریم و باید سریع عمل کنیم.»",
        targetKeywords: [
          { phrase: "three minutes", hintFa: "(سه دقیقه)", synonyms: ["three minutes", "only three minutes", "just three minutes"], weight: 45 },
          { phrase: "act quickly", hintFa: "(سریع عمل کنیم)", synonyms: ["act quickly", "hurry up", "move fast", "act fast"], weight: 55 },
        ],
        idealVoiceResponseEn: "We only have three minutes, and we must act quickly!",
        alternativeResponsesEn: [
          { phraseEn: "There are only three minutes left, so we have to hurry.", translationFa: "فقط سه دقیقه باقی مانده، پس باید عجله کنیم." },
          { phraseEn: "Time is short, we must run right now.", translationFa: "وقت تنگ است، باید همین الان بدویم." },
        ],
        whiteHintFa: "از عبارات زمان A2 مانند only three minutes و فعل کمکی must استفاده کن!",
        fallbackChoices: [
          "We only have three minutes, and we must act quickly!",
          "I want to sit down and rest my tired feet.",
          "Is there a good restaurant near this gallery?",
        ],
        aefReference: "AEF 2 Unit 4A (Must / Have to + Time expressions)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همراه نظامی",
          speakerAvatar: "🩺",
          textEn: "I am ready, Holmes! Give the word and I will run!",
          textFa: "من آماده‌ام هلمز! فقط بگو تا بدوم!",
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
          textEn: "The gas valve is locked! Watson, you saved the Judge!",
          textFa: "شیر گاز قفل شد! واتسون، تو قاضی را نجات دادی!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی سابق",
          speakerAvatar: "🩺",
          textEn: "We make a good team, Holmes. A doctor and a detective.",
          textFa: "ما تیم خوبی تشکیل دادیم، هلمز. یک پزشک و یک کارآگاه.",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: اعتماد متقابل، نجات دوگانه و کشف بی‌سیم مخفی",
        titleEn: "Consequence 2A: Mutual Trust & The Secret Radio",
        storyIntroFa: "پله‌های سمت چپ را طی می‌کنید و متوجه می‌شوید که گاز سمی مستقیماً به مدرسه وصل است، گاز تونل مدرسه را قطع می‌کنید! سپس با شتاب به زیرزمین می‌روید. در باز است! دکتر واتسون یکی از نگهبانان موریارتی را مهار کرده و با کلید برنجی شما شیر گاز را بسته و جان قاضی ارشد را نجات داده است! ساعد واتسون زخم عمیقی برداشته است. با دستمال گردنتان دست او را پانسمان می‌کنید. واتسون لبخند می‌زند، کلید برنجی و یک بی‌سیم مخفی را به شما می‌دهد: «ما تیم خوبی تشکیل دادیم، هلمز.»",
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
              textEn: "The gas is off! Watson, you stopped the guard and saved the Judge!",
              textFa: "گاز قطع شد! واتسون، تو نگهبان را مهار کردی و قاضی را نجات دادی!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Your key worked! And look, I found the guard's radio on the floor.",
              textFa: "کلیدت جواب داد! و نگاه کن، بی‌سیم نگهبان را روی زمین پیدا کردم.",
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
            taskInstructionFa: "به واتسون بگو: «تو خوب کار کردی!»",
            targetKeywords: [
              { phrase: "Good job", hintFa: "(خوب کار کردی / کارت خوب بود)", synonyms: ["good job", "great job", "well done", "you did well"], weight: 60 },
              { phrase: "Watson", hintFa: "(واتسون)", synonyms: ["watson", "dr watson", "doctor watson"], weight: 40 },
            ],
            idealVoiceResponseEn: "Good job, Watson!",
            alternativeResponsesEn: [
              { phraseEn: "You did a good job, Watson!", translationFa: "کارت خوب بود، واتسون!" },
              { phraseEn: "Well done, my friend!", translationFa: "آفرین، دوست من!" },
            ],
            whiteHintFa: "از عبارت کوتاه و تشویقی Good job و نام Watson استفاده کن!",
            fallbackChoices: [
              "Good job, Watson!",
              "This basement is very dusty and cold.",
              "I should buy a new pair of boots tomorrow.",
            ],
            aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار و همکار",
              speakerAvatar: "🩺",
              textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
              textFa: "گوش کن هلمز! صدای موریارتی از بلندگو می‌آید!",
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
              textEn: "Look out! The guard has a knife!",
              textFa: "مراقب باش! نگهبان چاقو دارد!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "Get off him! *Knocks the guard down*",
              textFa: "از او دور شو! *نگهبان را نقش بر زمین می‌کند*",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Watson! You broke the radiator to save my life?!",
              textFa: "واتسون! تو رادیاتور را شکستی تا جانم را نجات دهی؟! ",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نظامی سابق",
              speakerAvatar: "🩺",
              textEn: "I am a soldier, Holmes. We work together now!",
              textFa: "من یک سربازم هلمز. ما حالا با هم کار می‌کنیم!",
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
            taskInstructionFa: "به واتسون بگو: «تو خوب کار کردی!»",
            targetKeywords: [
              { phrase: "Good job", hintFa: "(خوب کار کردی / کارت خوب بود)", synonyms: ["good job", "great job", "well done", "you did well"], weight: 60 },
              { phrase: "Watson", hintFa: "(واتسون)", synonyms: ["watson", "dr watson", "doctor watson"], weight: 40 },
            ],
            idealVoiceResponseEn: "Good job, Watson!",
            alternativeResponsesEn: [
              { phraseEn: "You did a good job, Watson!", translationFa: "کارت خوب بود، واتسون!" },
              { phraseEn: "Well done, my friend!", translationFa: "آفرین، دوست من!" },
            ],
            whiteHintFa: "از عبارت کوتاه و تشویقی Good job و نام Watson استفاده کن!",
            fallbackChoices: [
              "Good job, Watson!",
              "This basement is very dusty and cold.",
              "I should buy a new pair of boots tomorrow.",
            ],
            aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار و همکار",
              speakerAvatar: "🩺",
              textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
              textFa: "گوش کن هلمز! صدای موریارتی از بلندگو می‌آید!",
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
        taskInstructionFa: "به واتسون بگو: «تو خوب کار کردی!»",
        targetKeywords: [
          { phrase: "Good job", hintFa: "(خوب کار کردی / کارت خوب بود)", synonyms: ["good job", "great job", "well done", "you did well"], weight: 60 },
          { phrase: "Watson", hintFa: "(واتسون)", synonyms: ["watson", "dr watson", "doctor watson"], weight: 40 },
        ],
        idealVoiceResponseEn: "Good job, Watson!",
        alternativeResponsesEn: [
          { phraseEn: "You did a good job, Watson!", translationFa: "کارت خوب بود، واتسون!" },
          { phraseEn: "Well done, my friend!", translationFa: "آفرین، دوست من!" },
        ],
        whiteHintFa: "از عبارت کوتاه و تشویقی Good job و نام Watson استفاده کن!",
        fallbackChoices: [
          "Good job, Watson!",
          "This basement is very dusty and cold.",
          "I should buy a new pair of boots tomorrow.",
        ],
        aefReference: "AEF 2 Unit 4B (Past simple regular/irregular verbs + Expressing gratitude)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار و همکار",
          speakerAvatar: "🩺",
          textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
          textFa: "گوش کن هلمز! صدای موریارتی از بلندگو می‌آید!",
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
    storyIntroFa: "ناگهان صدای موریارتی از بلندگوی دیواری طنین‌انداز می‌شود: «آفرین! اما بمب اصلی داخل قطار سلطنتی در ایستگاه پدینگتون کار گذاشته شده است و راس ساعت ۱۱:۰۰ شب (۲۰ دقیقه دیگر) منفجر خواهد شد!». درست در همین لحظه، قاضی ارشد روی زمین تشنج می‌کند! او از قبل مسموم شده، او پالتوی شما را می‌گیرد و نجوا می‌کند: «هلمز... شنیدم موریارتی درباره سیم‌های بمب حرف می‌زد... سیم سیاه... سیم سفید... کمکم کن نفس بکشم...» واتسون به ساعتش نگاه می‌کند: «هلمز! رانندگی تا پدینگتون ۱۰ دقیقه طول می‌کشد! اگر ۵ دقیقه بمانیم تا قاضی را احیا کنیم، راز سیم‌ها را می‌فهمیم اما در ثانیه آخر به قطار می‌رسیم؛ اما اگر همین الان بدویم، وقت زیادی در ایستگاه داریم ولی قاضی به کما می‌رود و راز سیم‌ها را نمی‌فهمیم!»",
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
          textEn: "The main bomb is on the Royal Train at Paddington Station! It explodes in twenty minutes!",
          textFa: "بمب اصلی در قطار سلطنتی در ایستگاه پدینگتون است! بیست دقیقه دیگر منفجر می‌شود!",
          bubblePosition: "right",
        },
        {
          speakerId: "judge",
          speakerNameFa: "قاضی ارشد",
          speakerRoleFa: "قربانی موریارتی",
          speakerAvatar: "⚖️",
          textEn: "Holmes... I know the secret of the bomb wires... Black or white... help me breathe...",
          textFa: "هلمز... من راز سیم‌های بمب را می‌دانم... سیاه یا سفید... کمکم کن نفس بکشم...",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Holmes! If we stay to help the Judge, we arrive late! If we run now, we don't know the wire secret!",
          textFa: "هلمز! اگر برای کمک به قاضی بمانیم، دیر می‌رسیم! اگر الان بدویم، راز سیم‌ها را نمی‌دانیم!",
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
        taskInstructionFa: "بگو: «بمب قطار بیست دقیقه دیگر منفجر می‌شود و باید تصمیم بگیریم.»",
        targetKeywords: [
          { phrase: "bomb explodes", hintFa: "(بمب منفجر می‌شود)", synonyms: ["bomb explodes", "bomb will explode", "train bomb will explode", "train bomb"], weight: 45 },
          { phrase: "twenty minutes", hintFa: "(بیست دقیقه)", synonyms: ["twenty minutes", "in twenty minutes", "20 minutes"], weight: 30 },
          { phrase: "decide now", hintFa: "(الان تصمیم بگیریم)", synonyms: ["decide now", "must decide", "make a decision", "make the right decision"], weight: 25 },
        ],
        idealVoiceResponseEn: "The bomb explodes in twenty minutes, and we must decide now.",
        alternativeResponsesEn: [
          { phraseEn: "We only have twenty minutes, so we have to choose quickly.", translationFa: "ما فقط بیست دقیقه وقت داریم، پس باید سریع انتخاب کنیم." },
          { phraseEn: "The train bomb will explode soon, what should we do?", translationFa: "بمب قطار به زودی منفجر می‌شود، چه کار باید بکنیم؟" },
        ],
        whiteHintFa: "از زمان آینده یا حال ساده و عبارت زمانی twenty minutes استفاده کن!",
        fallbackChoices: [
          "The bomb explodes in twenty minutes, and we must decide now.",
          "Trains are very comfortable.",
          "Look at the clock on the wall.",
        ],
        aefReference: "AEF 2 Unit 5A (Future with will + Preposition of time in)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Tell me your choice, Holmes! Help the Judge or run to the cab?",
          textFa: "انتخابت را بگو هلمز! به قاضی کمک کنیم یا به سمت درشکه بدویم؟",
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
          textEn: "Paddington Station! The Royal Train is on Track 9!",
          textFa: "ایستگاه پدینگتون! قطار سلطنتی در خط ۹ است!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Follow me, Holmes! We must clear the platform!",
          textFa: "دنبال من بیا هلمز! باید سکو را خالی کنیم!",
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
              textEn: "Listen! Moriarty changed the wires! Cut the BLACK wire, not the white one!",
              textFa: "گوش کنید! موریارتی سیم‌ها را تغییر داده! سیم سیاه را ببرید، نه سیم سفید را!",
              bubblePosition: "left",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Run to Track 9! We only have sixty seconds left!",
              textFa: "به خط ۹ بدو! فقط ۶۰ ثانیه فرصت داریم!",
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
            taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک داخل قطار است!»",
            targetKeywords: [
              { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate all passengers"], weight: 45 },
              { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "bomb inside the train", "bomb on the train", "a bomb"], weight: 55 },
            ],
            idealVoiceResponseEn: "Clear the platform now! There is a dangerous bomb on the train!",
            alternativeResponsesEn: [
              { phraseEn: "Move everyone away immediately, a bomb is inside the train!", translationFa: "همه را فوراً دور کنید، بمبی داخل قطار است!" },
              { phraseEn: "Please leave the station quickly, there is a gas bomb on Track 9!", translationFa: "لطفاً سریع ایستگاه را ترک کنید، بمب گازی در خط ۹ قرار دارد!" },
            ],
            whiteHintFa: "از جملات امری محکم (Imperatives) برای اعلام وضعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Clear the platform now! There is a dangerous bomb on the train!",
              "I would like to purchase a first-class train ticket.",
              "Please tell me the departure schedule for Oxford.",
            ],
            aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
            npcResponse: {
              speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
              speakerRoleFa: "مسئول سکو",
              speakerAvatar: "🚂",
              textEn: "The platform is clear! Hurry into the train, Mr. Holmes!",
              textFa: "سکو خالی شد! سریع داخل قطار بروید آقای هلمز!",
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
              textEn: "We have six minutes left! Clear the passengers now!",
              textFa: "ما شش دقیقه وقت داریم! مسافران را الان تخلیه کنید!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "We don't know which wire is the trap!",
              textFa: "نمی‌دانیم کدام سیم تله است!",
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
            taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک داخل قطار است!»",
            targetKeywords: [
              { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate all passengers"], weight: 45 },
              { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "bomb inside the train", "bomb on the train", "a bomb"], weight: 55 },
            ],
            idealVoiceResponseEn: "Clear the platform now! There is a dangerous bomb on the train!",
            alternativeResponsesEn: [
              { phraseEn: "Move everyone away immediately, a bomb is inside the train!", translationFa: "همه را فوراً دور کنید، بمبی داخل قطار است!" },
              { phraseEn: "Please leave the station quickly, there is a gas bomb on Track 9!", translationFa: "لطفاً سریع ایستگاه را ترک کنید، بمب گازی در خط ۹ قرار دارد!" },
            ],
            whiteHintFa: "از جملات امری محکم (Imperatives) برای اعلام وضعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Clear the platform now! There is a dangerous bomb on the train!",
              "I would like to purchase a first-class train ticket.",
              "Please tell me the departure schedule for Oxford.",
            ],
            aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
            npcResponse: {
              speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
              speakerRoleFa: "مسئول سکو",
              speakerAvatar: "🚂",
              textEn: "The platform is clear! Hurry into the train, Mr. Holmes!",
              textFa: "سکو خالی شد! سریع داخل قطار بروید آقای هلمز!",
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
        taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک داخل قطار است!»",
        targetKeywords: [
          { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate all passengers"], weight: 45 },
          { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "bomb inside the train", "bomb on the train", "a bomb"], weight: 55 },
        ],
        idealVoiceResponseEn: "Clear the platform now! There is a dangerous bomb on the train!",
        alternativeResponsesEn: [
          { phraseEn: "Move everyone away immediately, a bomb is inside the train!", translationFa: "همه را فوراً دور کنید، بمبی داخل قطار است!" },
          { phraseEn: "Please leave the station quickly, there is a gas bomb on Track 9!", translationFa: "لطفاً سریع ایستگاه را ترک کنید، بمب گازی در خط ۹ قرار دارد!" },
        ],
        whiteHintFa: "از جملات امری محکم (Imperatives) برای اعلام وضعیت اضطراری استفاده کن!",
        fallbackChoices: [
          "Clear the platform now! There is a dangerous bomb on the train!",
          "I would like to purchase a first-class train ticket.",
          "Please tell me the departure schedule for Oxford.",
        ],
        aefReference: "AEF 2 Unit 5B (Imperatives for emergency + Adverbs of manner)",
        npcResponse: {
          speakerNameFa: "سرنگهبان ایستگاه پدینگتون",
          speakerRoleFa: "مسئول سکو",
          speakerAvatar: "🚂",
          textEn: "The platform is clear! Hurry into the train, Mr. Holmes!",
          textFa: "سکو خالی شد! سریع داخل قطار بروید آقای هلمز!",
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
    storyIntroFa: "شما و دکتر واتسون به داخل واگن قطار می‌پرید. در میان واگن، یک دستگاه شیشه‌ای بزرگ پر از گاز سفید قرار دارد. صفحه دیجیتال کوچک روی بمب عدد ۰۰:۴۵ ثانیه را نشان می‌دهد! داخل جعبه باز، دو سیم ضخیم قرار دارد: یک سیم سفید و یک سیم سیاه، همراه با یک صفحه کلید کوچک ارقام. دوربین کوچکی بالای بمب به سمت شما می‌چرخد و صدای خنده موریارتی از بلندگو پخش می‌شود: «چهل ثانیه شرلوک! سیاه و سفید. تو کیستی کارآگاه؟ قهرمان کلاه سفید، یا کسی که تاریکی سیاه را درک می‌کند؟ یک سیم را ببر و کد را وارد کن—من دارم تماشا می‌کنم!» دکتر واتسون انبر سیم‌چین آهنی را در دست دارد و دستانش کمی می‌لرزد: «هلمز! در ارتش بریتانیا، بریدن سیم سفید همیشه برق را قطع می‌کند و بریدن سیم سیاه باعث انفجار می‌شود! کدام را ببرم؟!»",
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
          textEn: "Forty seconds, Sherlock! Black or White? Cut one wire now—I am watching!",
          textFa: "چهل ثانیه شرلوک! سیاه یا سفید؟ الان یک سیم را ببر—من دارم تماشا می‌کنم!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با سیم‌چین",
          speakerAvatar: "🩺",
          textEn: "Holmes! In the army, we cut the white wire. Which one should I cut?!",
          textFa: "هلمز! در ارتش، ما سیم سفید را می‌بریم. کدام را باید ببرم؟! ",
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
          labelFa: "گزینه الف: بریدن سیم سیاه",
          descriptionFa: "به واتسون می‌گویید موریارتی قوانین ارتش را معکوس کرده است؛ سیم سیاه را می‌برید و شیر گاز را قفل می‌کنید.",
          pointsDelta: 200,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Cut the WHITE wire (Standard British Army protocol)",
          labelFa: "گزینه ب: بریدن سیم سفید",
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
        taskInstructionFa: "به واتسون بگو: «سیم سیاه را ببر!»",
        targetKeywords: [
          { phrase: "Cut", hintFa: "(ببر)", synonyms: ["cut"], weight: 30 },
          { phrase: "the black wire", hintFa: "(سیم سیاه)", synonyms: ["the black wire", "black wire", "the black one"], weight: 70 },
        ],
        idealVoiceResponseEn: "Cut the black wire!",
        alternativeResponsesEn: [
          { phraseEn: "Watson, cut the black wire!", translationFa: "واتسون، سیم سیاه را ببر!" },
          { phraseEn: "Cut the black wire now!", translationFa: "الان سیم سیاه را ببر!" },
        ],
        whiteHintFa: "از فعل امری Cut و کلمات the black wire استفاده کن!",
        fallbackChoices: [
          "Cut the black wire!",
          "I cannot choose, let us jump out of the window.",
          "What colour is the train engine outside?",
        ],
        aefReference: "AEF 2 Unit 6A (Conjunction because + Imperatives + Past Simple)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "I trust you, Sherlock! I am cutting the wire now... SNIP!",
          textFa: "به تو اعتماد دارم شرلوک! دارم سیم را می‌برم... تق!",
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
          textEn: "The wire is cut! Holmes, look at the gas box!",
          textFa: "سیم بریده شد! هلمز، به جعبه گاز نگاه کن!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Wait a second, John... let me check this white powder on the floor.",
          textFa: "یک لحظه صبر کن جان... بگذار این پودر سفید روی زمین را بررسی کنم.",
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
        taskInstructionFa: "به واتسون بگو: «این پودر سفید سم نیست، فقط شکر و دود بی‌خطر است!»",
        targetKeywords: [
          { phrase: "white powder", hintFa: "(پودر سفید)", synonyms: ["white powder", "this white powder", "the white powder", "this powder"], weight: 35 },
          { phrase: "not poison", hintFa: "(سم نیست)", synonyms: ["not poison", "is not poison", "not dangerous", "isn't poison"], weight: 35 },
          { phrase: "sugar and smoke", hintFa: "(شکر و دود)", synonyms: ["sugar and smoke", "sugar and harmless smoke", "only sugar and smoke", "harmless smoke"], weight: 30 },
        ],
        idealVoiceResponseEn: "This white powder is not poison, it is only sugar and smoke!",
        alternativeResponsesEn: [
          { phraseEn: "Look John, this is not poison, it is just harmless smoke!", translationFa: "نگاه کن جان، این سم نیست، فقط دود بی‌خطر است!" },
          { phraseEn: "The bomb is fake Watson, it is only sugar and theatre smoke!", translationFa: "بمب جعلی است واتسون، فقط شکر و دود تئاتر است!" },
        ],
        whiteHintFa: "از زمان حال ساده با فعل to be و کلمات poison و sugar استفاده کن!",
        fallbackChoices: [
          "This white powder is not poison, it is only sugar and smoke!",
          "We should run away because London is destroyed.",
          "I wonder where I left my warm wool gloves.",
        ],
        aefReference: "AEF 2 Unit 6B (Present Simple sensory deductions + Negative sentences)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار بهت‌زده",
          speakerAvatar: "🩺",
          textEn: "A fake bomb?! But why did Moriarty do this?! Holmes, look at the wall!",
          textFa: "یک بمب قلابی؟! اما چرا موریارتی این کار را کرد؟! هلمز، به دیوار نگاه کن!",
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
        climaxStoryFa: "«سیم سیاه را ببر جان!» واتسون سیم سیاه را قطع می‌کند، شیر اضطراری را قفل می‌کنید. نمایشگر قرمز روی ثانیه ۰۰:۰۲ متوقف می‌شود! در بیرون، صدای فریاد شادی پلیس و مسافران به آسمان بلند می‌شود. شما جان صدها انسان را نجات دادید.",
        climaxStoryEn: "'Cut the Black wire, John!' Watson trusts you completely and cuts the Black wire. You lock the valve—the timer freezes at 00:02! Outside, the crowds cheer. You saved hundreds of lives!",
        revealDialogueFa: `ذره‌ای از پودر سفید روی زمین را می‌چشید... این سمی نیست! فقط شکر و دود بی‌خطر تئاتر است!
ناگهان صدای فلزی ضعیفی از پشت دیوار آجری خط ۹ به گوش می‌رسد. پشت قطار می‌دوید: یک سوراخ بزرگ در دیوار حفر شده است!
پشت خط ۹، گاوصندوق سری اسناد فوق‌محرمانه MI6 (سرویس اطلاعات مخفی بریتانیا) قرار داشت! در حالی که شما و تمام پلیس‌های لندن به بمب جعلی قطار چشم دوخته بودید، افراد موریارتی گاوصندوق را غارت کرده و با قایق موتوری از کانال زیرزمینی گریخته‌اند!
از کل گاوصندوق تنها چهار پوشه به سرقت رفته است. روی میز فولادی، موریارتی روبان صورتی لیلی و نامه‌ای با جوهر سیاه به جا گذاشته است:

«شرلوک عزیزم،
از بازی سیاه و سفید امشب ما لذت بردی؟ بمب گاز فقط یک تردستی جادویی بود تا تو را دو ساعت سرگرم نگه دارد! امشب من به دو پیروزی بزرگ رسیدم:
۱. چهار پرونده فوق‌محرمانه بریتانیا را دزدیدم 
۲. مهم‌تر از آن... من دکتر جان واتسون را به تو هدیه دادم.
واقعاً فکر کردی تصادفی بود که واتسون امشب به اتاق ۴۰۴ آمد؟ من صبح امروز دوست نظامی او را مسموم کردم تا واتسون به بیمارستان سنت جود بدود و با تو ملاقات کند! چرا؟
تا بازی بعدی ما — موریارتی»

واتسون کنارتان می‌ایستد: «هلمز... نامه چه می‌گوید؟»
به دوست جدیدتان نگاه می‌کنید، نیمه پایینی نامه را مخفیانه پاره می‌کنید، در جیب پالتویتان می‌گذارید و آرام می‌گویید:
«هیچ چیز مهمی نیست جان... کار واقعی ما تازه شروع شده است.»`,
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
        revealDialogueFa: `با پراکنده شدن دود، متوجه می‌شوید که به خواب نرفته‌اید! ماده روی زمین را می‌چشید... این گاز سمی نیست! فقط شکر سوخته و دود تئاتر است!
ناگهان صدای مته از پشت دیوار آجری به گوش می‌رسد. به پشت قطار می‌دوید: سوراخی در دیوار گاوصندوق فوق‌محرمانه MI6 کنده شده است! موریارتی همه شما را با یک بمب فیک سر کار گذاشت تا چهار پرونده سری بریتانیا را بدزدد!
روی میز آرشیو، نامه‌ای با جوهر سیاه در کنار روبان صورتی لیلی خودنمایی می‌کند:

«شرلوک عزیزم،
بمب قطار فقط یک شعبده‌بازی برای تلف کردن وقت تو بود! امشب من به دو پیروزی بزرگ رسیدم:
۱. سرقت ۴ پرونده فوق‌محرمانه MI6
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
