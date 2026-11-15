import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR A2 CASE: "CASE FILE #02: THE GAME OF BLACK AND WHITE"
// Official CEFR A2 Standards (American English File 2 / Oxford 2000):
// - Simple sentence structures (6 to 10 words per utterance).
// - Everyday vocabulary: hotel, train, hospital, doctor, wire, smoke, sugar, bag.
// - Core grammar: Past Simple, Present Continuous, Modals (must, can, will), Imperatives.
// - High-quality Persian synchronisation for instructions, hints, and dialogues.
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
    locationFa: "دفتر کارآگاهی شرلوک هلمز، خیابان بیکر ۲۲۱ب، لندن",
    locationEn: "Sherlock Holmes's Study, 221B Baker Street, London",
    storyIntroFa: "نیمه‌شب در دفتر خیابان بیکر است. دیروز لیلی کوچک را نجات دادید. روی میز کارتان، روبان صورتی لیلی قرار دارد. روبان غیرعادی و ضخیم است. با یک چاقوی جیبی کوچک درز روبان را باز می‌کنید و یک کلید برنجی همراه با کارتی با عنوان «بیمارستان سنت جود - اتاق ۴۰۴» پیدا می‌کنید. ناگهان تلفن زنگ می‌زند...",
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
          textEn: "This pink ribbon is very thick. Let me cut it open.",
          textFa: "این روبان صورتی خیلی ضخیم است. بگذارید با چاقو آن را باز کنم.",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look! A small brass key and a hospital card: 'Room 404'.",
          textFa: "نگاه کنید! یک کلید برنجی کوچک و یک کارت بیمارستان: «اتاق ۴۰۴».",
          bubblePosition: "left",
        },
        {
          speakerId: "lestrade",
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Sherlock! A thief broke into the hospital lab and stole dangerous gas!",
          textFa: "شرلوک! دزدی وارد آزمایشگاه بیمارستان شد و گاز خطرناکی را دزدید!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Don't panic, Lestrade! I have a clue for Room 404. I am coming now!",
          textFa: "وحشت نکنید لسترید! من سرنخی برای اتاق ۴۰۴ دارم. الان می‌آیم!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-1-call-lestrade",
        titleFa: "پاسخ به بازرس لسترید و اعلام حرکت فوری به بیمارستان",
        speakerPromptEn: "Inspector Lestrade sounds nervous over the telephone.",
        speakerPromptFa: "بازرس لسترید از پشت تلفن مضطرب به نظر می‌رسد.",
        speakerRoleFa: "بازرس لسترید (اسکاتلندیارد)",
        speakerAvatar: "👮‍♂️",
        taskInstructionFa: "به بازرس لسترید بگو: «من کلید را پیدا کردم و الان می‌آیم.»",
        targetKeywords: [
          { phrase: "found the key", hintFa: "(کلید را پیدا کردم)", synonyms: ["found the key", "found a key", "have the key", "found this key"], weight: 50 },
          { phrase: "coming now", hintFa: "(الان می‌آیم)", synonyms: ["coming now", "am coming now", "coming right now", "am coming"], weight: 50 },
        ],
        idealVoiceResponseEn: "I found the key, and I am coming now.",
        alternativeResponsesEn: [
          { phraseEn: "I found a key, so I am coming to the hospital.", translationFa: "من یک کلید پیدا کردم، پس دارم به بیمارستان می‌آیم." },
          { phraseEn: "I have the key, and I am coming right now.", translationFa: "من کلید را دارم و همین الان می‌آیم." },
        ],
        whiteHintFa: "از فعل گذشته ساده (found) و حال استمراری (am coming) استفاده کن!",
        fallbackChoices: [
          "I found the key, and I am coming now.",
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
  // STAGE 2: DECISION 1 — Room 404 (تصمیم اول: مدارک یا مظنون؟)
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "A2",
    titleFa: "دوراهی اتاق ۴۰۴: مدارک در آتش یا تعقیب مظنون؟",
    titleEn: "DECISION 1: The Dilemma of Room 404",
    locationFa: "طبقه چهارم بیمارستان سنت جود، راهروی تاریک و پر دود",
    locationEn: "4th Floor Corridor, St. Jude Hospital",
    storyIntroFa: "با شتاب از پله‌ها به طبقه چهارم می‌دوید. راهرو تاریک است و بوی دود به مشام می‌رسد. در اتاق ۴۰۴، یک نقشه و دفترچه در سطل زباله در حال سوختن است. همزمان در راهرو، فردی لنگان با دیلم فلزی مشغول شکستن قفل قفسه داروهاست!",
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
          textEn: "Look! A man in the hallway is breaking the medicine cabinet!",
          textFa: "نگاه کن! مردی در راهرو دارد قفسه داروها را می‌شکند!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "If I put out the fire, he escapes. If I catch him, the papers burn!",
          textFa: "اگر آتش را خاموش کنم او فرار می‌کند. اگر او را بگیرم کاغذها می‌سوزند!",
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
        speakerPromptEn: "You look at the smoke in the room and the man in the hallway.",
        speakerPromptFa: "به دود داخل اتاق و مرد داخل راهرو نگاه می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (مشاهدات صحنه)",
        speakerAvatar: "🔍",
        taskInstructionFa: "وضعیت را توصیف کن و بگو: «من آتش را می‌بینم و مردی قفل را می‌شکند.»",
        targetKeywords: [
          { phrase: "see fire", hintFa: "(آتش را می‌بینم)", synonyms: ["see fire", "see the fire", "see a fire"], weight: 45 },
          { phrase: "breaking the lock", hintFa: "(در حال شکستن قفل)", synonyms: ["breaking the lock", "is breaking the lock", "breaks the lock", "breaking a lock"], weight: 55 },
        ],
        idealVoiceResponseEn: "I see fire, and a man is breaking the lock.",
        alternativeResponsesEn: [
          { phraseEn: "There is fire, and a man is breaking the cabinet.", translationFa: "آتش وجود دارد و مردی در حال شکستن قفسه است." },
          { phraseEn: "I see smoke, and someone is breaking the lock.", translationFa: "من دود می‌بینم و کسی در حال شکستن قفل است." },
        ],
        whiteHintFa: "از زمان حال استمراری (is breaking) برای توصیف اتفاق در حال وقوع استفاده کن!",
        fallbackChoices: [
          "I see fire, and a man is breaking the lock.",
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
  // STAGE 3: Consequence of Decision 1 & Meeting Dr. Watson (پیامد تصمیم اول)
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "A2",
    titleFa: "پیامد تصمیم اول: ورود غیرمنتظره دکتر جان واتسون",
    titleEn: "Consequence of Decision 1: Meeting Dr. John Watson",
    locationFa: "راهروی طبقه چهارم بیمارستان سنت جود",
    locationEn: "4th Floor Corridor, St. Jude Hospital",
    storyIntroFa: "پیامد انتخابتان رخ می‌دهد: نور فانوس را روی صورت مرد می‌اندازید. او می‌گوید: «شلیک نکن! من دکتر جان واتسون هستم، پزشک ارتش. امروز صبح دوستم با گاز مسموم شد و من برای نجات جانش به دنبال پادزهر آمدم!» با این حال، هنوز به او اعتماد کامل ندارید...",
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
          textEn: "Someone poisoned my friend with this gas! I came to find the antidote.",
          textFa: "کسی دوستم را با این گاز مسموم کرد! آمدم تا پادزهر را پیدا کنم.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Yesterday a fake friend tried to hurt me. I do not trust you, Watson!",
          textFa: "دیروز دوستی قلابی قصد آسیب زدن به من را داشت. من به تو اعتماد ندارم واتسون!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "پیامد ۱الف: نجات نقشه و کد ۷۷",
        titleEn: "Consequence 1A: Rescuing the Map & Code 77",
        storyIntroFa: "شما داخل اتاق ۴۰۴ می‌پرید و کاغذها را از آتش بیرون می‌کشید. کلمات «گالری بلک‌فرایرز» و عدد «۷۷» خوانده می‌شود.",
        cutscene: {
          titleFa: "نجات نقشه نیم‌سوخته و روبرو شدن با واتسون",
          titleEn: "Half-Burned Map Saved & Watson Confronted",
          imageSrc: "/images/skills/speaking/a2_scene_burned_map.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The paper is burned, but I see 'Blackfriars' and 'Code 77'.",
              textFa: "کاغذ سوخته، اما کلمات «بلک‌فرایرز» و «کد ۷۷» را می‌بینم.",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "Please don't shoot! I only want to save my friend!",
              textFa: "لطفاً شلیک نکنید! من فقط می‌خواهم جان دوستم را نجات دهم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-3-confront-watson-1a",
            titleFa: "خلع سلاح دکتر واتسون و صدور فرمان همراهی",
            speakerPromptEn: "Watson holds out his revolver with a calm look.",
            speakerPromptFa: "واتسون با نگاهی آرام تپانچه خود را به سمت شما می‌گیرد.",
            speakerRoleFa: "دکتر جان واتسون (تسلیم سلاح)",
            speakerAvatar: "🩺",
            taskInstructionFa: "به واتسون بگو: «تپانچه‌ات را به من بده، باید همراهم بیایی!»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(تپانچه‌ات را به من بده)", synonyms: ["give me your gun", "give me the gun", "hand over your gun"], weight: 50 },
              { phrase: "must come with me", hintFa: "(باید همراهم بیایی)", synonyms: ["must come with me", "come with me", "have to come with me"], weight: 50 },
            ],
            idealVoiceResponseEn: "Give me your gun, you must come with me!",
            alternativeResponsesEn: [
              { phraseEn: "Give me the gun, and follow me right now!", translationFa: "تپانچه را به من بده و همین الان دنبالم بیا!" },
              { phraseEn: "Hand over your gun, you have to come with me!", translationFa: "تپانچه‌ات را تحویل بده، باید همراه من بیایی!" },
            ],
            whiteHintFa: "از فعل کمکی must برای بیان الزام قاطع استفاده کن!",
            fallbackChoices: [
              "Give me your gun, you must come with me!",
              "I think your brown army boots look very old.",
              "Would you like to sit down and drink warm tea?",
            ],
            aefReference: "AEF 2 Unit 3B (Must vs Have to + Direct Object Pronouns)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "Take my gun, Holmes. I will help you catch this criminal!",
              textFa: "اسلحه‌ام را بگیر هلمز. من به تو کمک می‌کنم این مجرم را دستگیر کنی!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "پیامد ۱ب: به چنگ آوردن کیت پادزهر",
        titleEn: "Consequence 1B: The Antidote Kit Secured",
        storyIntroFa: "شما به سمت مرد شیرجه می‌روید و جعبه پادزهر را از دستش خارج می‌کنید. کاغذهای اتاق ۴۰۴ می‌سوزند، اما پادزهر را در دست دارید.",
        cutscene: {
          titleFa: "پادزهر در دستان هلمز و سوختن اتاق ۴۰۴",
          titleEn: "The Antidote Kit in Holmes's Hands",
          imageSrc: "/images/skills/speaking/a2_scene_antidote_captured.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Don't move! I have the antidote box now!",
              textFa: "حرکت نکن! من جعبه پادزهر را در دست دارم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "I am not a thief! I am Dr. Watson, and I must save my friend!",
              textFa: "من دزد نیستم! من دکتر واتسون هستم و باید دوستم را نجات بدهم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-3-confront-watson-1b",
            titleFa: "خلع سلاح دکتر واتسون و صدور فرمان همراهی",
            speakerPromptEn: "Watson holds out his revolver with a calm look.",
            speakerPromptFa: "واتسون با نگاهی آرام تپانچه خود را به سمت شما می‌گیرد.",
            speakerRoleFa: "دکتر جان واتسون (تسلیم سلاح)",
            speakerAvatar: "🩺",
            taskInstructionFa: "به واتسون بگو: «تپانچه‌ات را به من بده، باید همراهم بیایی!»",
            targetKeywords: [
              { phrase: "Give me your gun", hintFa: "(تپانچه‌ات را به من بده)", synonyms: ["give me your gun", "give me the gun", "hand over your gun"], weight: 50 },
              { phrase: "must come with me", hintFa: "(باید همراهم بیایی)", synonyms: ["must come with me", "come with me", "have to come with me"], weight: 50 },
            ],
            idealVoiceResponseEn: "Give me your gun, you must come with me!",
            alternativeResponsesEn: [
              { phraseEn: "Give me the gun, and follow me right now!", translationFa: "تپانچه را به من بده و همین الان دنبالم بیا!" },
              { phraseEn: "Hand over your gun, you have to come with me!", translationFa: "تپانچه‌ات را تحویل بده، باید همراه من بیایی!" },
            ],
            whiteHintFa: "از فعل کمکی must برای بیان الزام قاطع استفاده کن!",
            fallbackChoices: [
              "Give me your gun, you must come with me!",
              "I think your brown army boots look very old.",
              "Would you like to sit down and drink warm tea?",
            ],
            aefReference: "AEF 2 Unit 3B (Must vs Have to + Direct Object Pronouns)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "Take my weapon, Holmes. I have nothing to hide. Let us stop this monster!",
              textFa: "اسلحه‌ام را بگیر هلمز. من چیزی برای پنهان کردن ندارم. بیا این هیولا را متوقف کنیم!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-a2-3-confront-watson-default",
        titleFa: "خلع سلاح دکتر واتسون و صدور فرمان همراهی",
        speakerPromptEn: "Watson holds out his revolver with a calm look.",
        speakerPromptFa: "واتسون با نگاهی آرام تپانچه خود را به سمت شما می‌گیرد.",
        speakerRoleFa: "دکتر جان واتسون (تسلیم سلاح)",
        speakerAvatar: "🩺",
        taskInstructionFa: "به واتسون بگو: «تپانچه‌ات را به من بده، باید همراهم بیایی!»",
        targetKeywords: [
          { phrase: "Give me your gun", hintFa: "(تپانچه‌ات را به من بده)", synonyms: ["give me your gun", "give me the gun", "hand over your gun"], weight: 50 },
          { phrase: "must come with me", hintFa: "(باید همراهم بیایی)", synonyms: ["must come with me", "come with me", "have to come with me"], weight: 50 },
        ],
        idealVoiceResponseEn: "Give me your gun, you must come with me!",
        alternativeResponsesEn: [
          { phraseEn: "Give me the gun, and follow me right now!", translationFa: "تپانچه را به من بده و همین الان دنبالم بیا!" },
          { phraseEn: "Hand over your gun, you have to come with me!", translationFa: "تپانچه‌ات را تحویل بده، باید همراه من بیایی!" },
        ],
        whiteHintFa: "از فعل کمکی must برای بیان الزام قاطع استفاده کن!",
        fallbackChoices: [
          "Give me your gun, you must come with me!",
          "I think your brown army boots look very old.",
          "Would you like to sit down and drink warm tea?",
        ],
        aefReference: "AEF 2 Unit 3B (Must vs Have to + Direct Object Pronouns)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سابق ارتش",
          speakerAvatar: "🩺",
          textEn: "Take my weapon, Holmes. I have nothing to hide. Let us stop this monster!",
          textFa: "اسلحه‌ام را بگیر هلمز. من چیزی برای پنهان کردن ندارم. بیا این هیولا را متوقف کنیم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: Face-to-Face with Moriarty (رویارویی با موریارتی در گالری بلک‌فرایرز)
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "A2",
    titleFa: "پرده چهارم: بازی سیاه و سفید و رویارویی مستقیم با موریارتی",
    titleEn: "Face-to-Face with Moriarty: The Game of Black and White",
    locationFa: "گالری نقاشی بلک‌فرایرز، رودخانه تیمز لندن",
    locationEn: "Blackfriars Art Gallery, River Thames, London",
    storyIntroFa: "شما و واتسون به گالری بلک‌فرایرز می‌رسید. سالن اصلی تاریک است و فقط دو چراغ بزرگ روی زمین شطرنجی نور می‌اندازند. ناگهان موریارتی در بالکن طبقه بالا ظاهر می‌شود. او تایمری در دست دارد...",
    cutscene: {
      titleFa: "رویارویی بزرگ در سالن شطرنجی گالری بلک‌فرایرز",
      titleEn: "The Grand Confrontation at Blackfriars Gallery",
      imageSrc: "/images/skills/speaking/a2_scene_moriarty_gallery.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Don't move, Moriarty! You are under arrest!",
          textFa: "حرکت نکن موریارتی! تو بازداشتی!",
          bubblePosition: "left",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی جنایت",
          speakerAvatar: "♟️",
          textEn: "Look around you, Sherlock! Black and White. Darkness and Light!",
          textFa: "به اطرافت نگاه کن شرلوک! سیاه و سفید. تاریکی و روشنایی!",
          bubblePosition: "right",
        },
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی جنایت",
          speakerAvatar: "♟️",
          textEn: "In three minutes, two gas bombs will open: one in the basement, one on the train!",
          textFa: "تا سه دقیقه دیگر، دو بمب گازی فعال می‌شود: یکی در زیرزمین، یکی در قطار!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-4-challenge-moriarty",
        titleFa: "پاسخ دندان‌شکن به رجزخوانی موریارتی و اعلام مبارزه",
        speakerPromptEn: "Moriarty grins coldly from the gallery balcony.",
        speakerPromptFa: "موریارتی با پوزخندی سرد از بالکن نگارخانه به شما خیره شده است.",
        speakerRoleFa: "پروفسور موریارتی (از بالای بالکن)",
        speakerAvatar: "♟️",
        taskInstructionFa: "به موریارتی بگو: «تو یک هیولایی، اما من متوقفت می‌کنم!»",
        targetKeywords: [
          { phrase: "a monster", hintFa: "(یک هیولا)", synonyms: ["a monster", "monster", "evil monster"], weight: 45 },
          { phrase: "will stop you", hintFa: "(متوقفت خواهم کرد)", synonyms: ["will stop you", "going to stop you", "shall stop you", "stop you"], weight: 55 },
        ],
        idealVoiceResponseEn: "You are a monster, but I will stop you!",
        alternativeResponsesEn: [
          { phraseEn: "You are evil, but we will catch you today!", translationFa: "تو خبیثی، اما ما امروز تو را دستگیر خواهیم کرد!" },
          { phraseEn: "Your game ends here, because I will stop you!", translationFa: "بازی تو اینجا به پایان می‌رسد، چون من متوقفت خواهم کرد!" },
        ],
        whiteHintFa: "از حرف ربط but و زمان آینده با will برای بیان اراده و تصمیم قطعی استفاده کن!",
        fallbackChoices: [
          "You are a monster, but I will stop you!",
          "This art gallery has very expensive paintings.",
          "It is raining outside, so I will take an umbrella.",
        ],
        aefReference: "AEF 2 Unit 4A (Future with will for promises and decisions + Conjunction but)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی جنایت",
          speakerAvatar: "♟️",
          textEn: "Big words, Sherlock! The clock is ticking... Let the game begin!",
          textFa: "حرف‌های بزرگی زدی شرلوک! زمان در حال گذر است... بگذار بازی شروع شود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — Can You Trust Dr. Watson? (تصمیم دوم)
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "A2",
    titleFa: "تصمیم دوم: آیا می‌توان به دکتر واتسون اعتماد کرد؟",
    titleEn: "DECISION 2: Can You Trust Dr. Watson?",
    locationFa: "زیرزمین تاریک گالری بلک‌فرایرز، کنار لوله‌های گاز",
    locationEn: "Basement Corridor, Blackfriars Gallery",
    storyIntroFa: "شما و واتسون از پله‌ها به سمت زیرزمین گالری می‌دوید. بوی گاز به مشام می‌رسد. واتسون می‌گوید: «هلمز، من می‌دانم هنوز به من شک داری. کلید را به من بده تا به سمت شیر گاز بدوم و آن را قفل کنم، در حالی که تو افراد موریارتی را مهار می‌کنی!»",
    cutscene: {
      titleFa: "آزمون اعتماد: دادن کلید به واتسون یا حفظ آن؟",
      titleEn: "The Test of Trust: Handing the Key to Watson?",
      imageSrc: "/images/skills/speaking/a2_scene_trust_watson.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Holmes, I know you do not trust me yet.",
          textFa: "هلمز، می‌دانم هنوز به من اعتماد نداری.",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Give me the key! I will check the basement and stop the gas!",
          textFa: "کلید را به من بده! من زیرزمین را بررسی می‌کنم و جلوی گاز را می‌گیرم!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-2",
      promptFa: "تصمیم مهم: آیا به واتسون اعتماد می‌کنید و کلید برنجی را به او می‌سپارید؟",
      promptEn: "Decision 2: Trust Watson with the brass key or investigate the basement together?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Trust Watson and give him the brass key",
          labelFa: "گزینه ۲الف: اعتماد به واتسون و سپردن کلید برنجی به او",
          descriptionFa: "کلید را به واتسون می‌دهید تا شیر گاز را قفل کند؛ این کار اعتماد متقابل عمیقی ایجاد می‌کند.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Keep the key and go together",
          labelFa: "گزینه ۲ب: نگه داشتن کلید و رفتن با همدیگر",
          descriptionFa: "احتیاط می‌کنید و با هم به سمت شیر گاز حرکت می‌کنید.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-5-coordinate-plan",
        titleFa: "هماهنگی اضطراری با واتسون برای مهار شیر گاز",
        speakerPromptEn: "Watson stands ready. The timer is ticking down.",
        speakerPromptFa: "واتسون آماده ایستاده است. ثانیه‌شمار رو به پایان می‌رود.",
        speakerRoleFa: "دکتر جان واتسون (منتظر فرمان)",
        speakerAvatar: "🩺",
        taskInstructionFa: "به واتسون بگو: «ما فقط سه دقیقه وقت داریم، باید سریع عمل کنیم!»",
        targetKeywords: [
          { phrase: "three minutes", hintFa: "(سه دقیقه)", synonyms: ["three minutes", "3 minutes", "only three minutes"], weight: 45 },
          { phrase: "act quickly", hintFa: "(سریع عمل کنیم)", synonyms: ["act quickly", "move quickly", "hurry up", "act fast"], weight: 55 },
        ],
        idealVoiceResponseEn: "We only have three minutes, we must act quickly!",
        alternativeResponsesEn: [
          { phraseEn: "We have three minutes, so we must hurry up!", translationFa: "ما سه دقیقه وقت داریم، پس باید عجله کنیم!" },
          { phraseEn: "Time is short, we must run quickly right now!", translationFa: "زمان اندک است، ما باید همین الان سریع بدویم!" },
        ],
        whiteHintFa: "از قید حالت quickly همراه با فعل act استفاده کن تا سرعت عمل را نشان دهی!",
        fallbackChoices: [
          "We only have three minutes, we must act quickly!",
          "I bought three tickets for the theater yesterday.",
          "There are many old books on the wooden shelves.",
        ],
        aefReference: "AEF 2 Unit 4B (Adverbs of manner - quickly, carefully + Modals of obligation)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "I am ready, Holmes! Give the word and I will run!",
          textFa: "من آماده‌ام هلمز! فقط دستور بده تا بدوم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Consequence of Decision 2 (پیامد تصمیم دوم و تولد رفاقت تاریخی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "A2",
    titleFa: "پیامد تصمیم دوم: تولد یک مشارکت و پیوند تاریخی",
    titleEn: "Consequence of Decision 2: The Birth of a Legendary Partnership",
    locationFa: "زیرزمین گالری بلک‌فرایرز، کنار مخزن اصلی گاز",
    locationEn: "Basement Vault, Blackfriars Gallery",
    storyIntroFa: "پیامد انتخابتان رقم می‌خورد: واتسون به شیر گاز می‌رسد و آن را محکم قفل می‌کند. گاز در زیرزمین متوقف می‌شود و جان قاضی میلر که در اتاق جانبی حبس شده بود نجات می‌یابد. هلمز نگاهی به واتسون می‌اندازد...",
    cutscene: {
      titleFa: "شیر گاز مهار شد و پیوند برادری بسته شد",
      titleEn: "Gas Valve Locked & Brotherhood Forged",
      imageSrc: "/images/skills/speaking/a2_scene_valve_locked.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The gas valve is locked! Watson, you saved the Judge!",
          textFa: "شیر گاز قفل شد! واتسون، تو جان قاضی را نجات دادی!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "We make a good team, Holmes. A doctor and a detective.",
          textFa: "ما تیم خوبی می‌سازیم هلمز. یک پزشک و یک کارآگاه.",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: اعتماد کامل و کشف بی‌سیم نگهبان",
        titleEn: "Consequence 2A: Mutual Trust & The Secret Radio",
        storyIntroFa: "شما به واتسون اعتماد کردید. او با کلید برنجی در زیرزمین را باز کرد، شیر گاز را قفل کرد و یک بی‌سیم نظامی از نگهبان موریارتی غنیمت گرفت.",
        cutscene: {
          titleFa: "مهار گاز و صدای بی‌سیم موریارتی",
          titleEn: "Saving the Judge & The Guard's Radio",
          imageSrc: "/images/skills/speaking/a2_scene_radio_found.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The gas is off! Watson, you stopped the guard and saved the Judge!",
              textFa: "گاز قطع شد! واتسون، تو جلوی نگهبان را گرفتی و قاضی را نجات دادی!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Your key worked! And look, I found the guard's radio on the floor.",
              textFa: "کلیدت کار کرد! و نگاه کن، بی‌سیم نگهبان را روی زمین پیدا کردم.",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-6-partner-bond-2a",
            titleFa: "تقدیر از شجاعت دکتر واتسون و تحکیم رفاقت",
            speakerPromptEn: "Watson catches his breath after locking the heavy valve.",
            speakerPromptFa: "واتسون پس از قفل کردن شیر سنگین گاز نفس تازه می‌کند.",
            speakerRoleFa: "دکتر جان واتسون (با بی‌سیم در دست)",
            speakerAvatar: "🩺",
            taskInstructionFa: "به واتسون بگو: «آفرین واتسون! ما یک تیم عالی هستیم!»",
            targetKeywords: [
              { phrase: "Good job", hintFa: "(آفرین / کار عالی بود)", synonyms: ["good job", "well done", "great job", "bravo"], weight: 40 },
              { phrase: "a great team", hintFa: "(یک تیم عالی)", synonyms: ["a great team", "great team", "good team", "a good team"], weight: 60 },
            ],
            idealVoiceResponseEn: "Good job, Watson! We are a great team!",
            alternativeResponsesEn: [
              { phraseEn: "Well done, Watson! We make a wonderful team!", translationFa: "آفرین، واتسون! ما یک تیم فوق‌العاده می‌سازیم!" },
              { phraseEn: "Great work, John! You saved us today!", translationFa: "کارت عالی بود جان! تو امروز ما را نجات دادی!" },
            ],
            whiteHintFa: "از عبارت تحسین‌آمیز Good job و ترکیب اسمی a great team استفاده کن!",
            fallbackChoices: [
              "Good job, Watson! We are a great team!",
              "I think this old radio is very heavy to carry.",
              "The floor in this basement is wet and cold.",
            ],
            aefReference: "AEF 2 Unit 4C (Adjectives + Nouns + Expressions of praise)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار تازه",
              speakerAvatar: "🩺",
              textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
              textFa: "گوش کن هلمز! صدای موریارتی از بلندگو به گوش می‌رسد!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "پیامد ۲ب: درگیری تن به تن و فداکاری واتسون",
        titleEn: "Consequence 2B: Close Combat & Watson's Heroic Move",
        storyIntroFa: "شما با هم رفتید. نگهبان با چاقو به سمت شما پرید، اما واتسون با شجاعت او را به زمین کوبید و جان شما را نجات داد.",
        cutscene: {
          titleFa: "درگیری تن‌به‌تن در تاریکی زیرزمین",
          titleEn: "Close Combat in the Dark Basement",
          imageSrc: "/images/skills/speaking/a2_scene_watson_fight.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Look out! The guard has a knife!",
              textFa: "مواظب باش! نگهبان چاقو دارد!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک سابق ارتش",
              speakerAvatar: "🩺",
              textEn: "I am a soldier, Holmes. We work together now!",
              textFa: "من یک سربازم هلمز. ما اکنون با هم کار می‌کنیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a2-6-partner-bond-2b",
            titleFa: "تقدیر از شجاعت دکتر واتسون و تحکیم رفاقت",
            speakerPromptEn: "Watson catches his breath after locking the heavy valve.",
            speakerPromptFa: "واتسون پس از قفل کردن شیر سنگین گاز نفس تازه می‌کند.",
            speakerRoleFa: "دکتر جان واتسون (با بی‌سیم در دست)",
            speakerAvatar: "🩺",
            taskInstructionFa: "به واتسون بگو: «آفرین واتسون! ما یک تیم عالی هستیم!»",
            targetKeywords: [
              { phrase: "Good job", hintFa: "(آفرین / کار عالی بود)", synonyms: ["good job", "well done", "great job", "bravo"], weight: 40 },
              { phrase: "a great team", hintFa: "(یک تیم عالی)", synonyms: ["a great team", "great team", "good team", "a good team"], weight: 60 },
            ],
            idealVoiceResponseEn: "Good job, Watson! We are a great team!",
            alternativeResponsesEn: [
              { phraseEn: "Well done, Watson! We make a wonderful team!", translationFa: "آفرین، واتسون! ما یک تیم فوق‌العاده می‌سازیم!" },
              { phraseEn: "Great work, John! You saved us today!", translationFa: "کارت عالی بود جان! تو امروز ما را نجات دادی!" },
            ],
            whiteHintFa: "از عبارت تحسین‌آمیز Good job و ترکیب اسمی a great team استفاده کن!",
            fallbackChoices: [
              "Good job, Watson! We are a great team!",
              "I think this old radio is very heavy to carry.",
              "The floor in this basement is wet and cold.",
            ],
            aefReference: "AEF 2 Unit 4C (Adjectives + Nouns + Expressions of praise)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار تازه",
              speakerAvatar: "🩺",
              textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
              textFa: "گوش کن هلمز! صدای موریارتی از بلندگو به گوش می‌رسد!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-a2-6-partner-bond-default",
        titleFa: "تقدیر از شجاعت دکتر واتسون و تحکیم رفاقت",
        speakerPromptEn: "Watson catches his breath after locking the heavy valve.",
        speakerPromptFa: "واتسون پس از قفل کردن شیر سنگین گاز نفس تازه می‌کند.",
        speakerRoleFa: "دکتر جان واتسون (با بی‌سیم در دست)",
        speakerAvatar: "🩺",
        taskInstructionFa: "به واتسون بگو: «آفرین واتسون! ما یک تیم عالی هستیم!»",
        targetKeywords: [
          { phrase: "Good job", hintFa: "(آفرین / کار عالی بود)", synonyms: ["good job", "well done", "great job", "bravo"], weight: 40 },
          { phrase: "a great team", hintFa: "(یک تیم عالی)", synonyms: ["a great team", "great team", "good team", "a good team"], weight: 60 },
        ],
        idealVoiceResponseEn: "Good job, Watson! We are a great team!",
        alternativeResponsesEn: [
          { phraseEn: "Well done, Watson! We make a wonderful team!", translationFa: "آفرین، واتسون! ما یک تیم فوق‌العاده می‌سازیم!" },
          { phraseEn: "Great work, John! You saved us today!", translationFa: "کارت عالی بود جان! تو امروز ما را نجات دادی!" },
        ],
        whiteHintFa: "از عبارت تحسین‌آمیز Good job و ترکیب اسمی a great team استفاده کن!",
        fallbackChoices: [
          "Good job, Watson! We are a great team!",
          "I think this old radio is very heavy to carry.",
          "The floor in this basement is wet and cold.",
        ],
        aefReference: "AEF 2 Unit 4C (Adjectives + Nouns + Expressions of praise)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار تازه",
          speakerAvatar: "🩺",
          textEn: "Listen, Holmes! Moriarty's voice is coming from the speaker!",
          textFa: "گوش کن هلمز! صدای موریارتی از بلندگو به گوش می‌رسد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — The Dying Judge vs. Paddington Station (تصمیم سوم)
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "A2",
    titleFa: "تصمیم سوم: قاضی رو به مرگ یا بمب قطار سلطنتی پدینگتون؟",
    titleEn: "DECISION 3: The Dying Judge vs. Paddington Station",
    locationFa: "زیرزمین گالری بلک‌فرایرز، در کنار قاضی نیمه‌هوش",
    locationEn: "Basement Vault, Beside Semi-Conscious Judge",
    storyIntroFa: "صدای موریارتی از بلندگوی بی‌سیم پخش می‌شود: «بمب اصلی در قطار سلطنتی ایستگاه پدینگتون است و دقیقاً بیست دقیقه دیگر منفجر می‌شود!» قاضی نیمه‌جان زمزمه می‌کند: «هلمز... سیم‌ها... موریارتی سیم‌ها را تغییر داده... به من کمک کن...»",
    cutscene: {
      titleFa: "هشدار بمب قطار پدینگتون و وضعیت بحرانی قاضی",
      titleEn: "Paddington Train Bomb Warning & The Collapsing Judge",
      imageSrc: "/images/skills/speaking/a2_scene_judge_collapsing.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "صدای پشت بی‌سیم",
          speakerAvatar: "♟️",
          textEn: "The main bomb is on the Royal Train! It explodes in twenty minutes!",
          textFa: "بمب اصلی در قطار سلطنتی است! بیست دقیقه دیگر منفجر می‌شود!",
          bubblePosition: "right",
        },
        {
          speakerId: "judge",
          speakerNameFa: "قاضی ارشد میلر",
          speakerRoleFa: "قربانی گاز موریارتی",
          speakerAvatar: "⚖️",
          textEn: "Holmes... I know the secret of the bomb wires... help me...",
          textFa: "هلمز... من راز سیم‌های بمب را می‌دانم... کمکم کن...",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Holmes! If we stay, we arrive late! If we run now, we don't know the wire clue!",
          textFa: "هلمز! اگر بمانیم دیر می‌رسیم! اگر الان بدویم راز سیم‌ها را نخواهیم دانست!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-a2-3",
      promptFa: "تصمیم سوم: آیا برای نجات قاضی و شنیدن راز سیم‌ها می‌مانید، یا مستقیماً به ایستگاه پدینگتون می‌دوید؟",
      promptEn: "Decision 3: Stay to revive the Judge or rush immediately to Paddington Station?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Stay to revive Judge Miller and learn the wire secret",
          labelFa: "گزینه ۳الف: ماندن برای احیای قاضی و کشف راز سیم‌های بمب",
          descriptionFa: "قاضی را نجات می‌دهید و راز سیم سیاه را از او می‌شنوید، اما زمان به شدت کم می‌شود.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Call an ambulance for the Judge and rush straight to Paddington",
          labelFa: "گزینه ۳ب: تماس با آمبولانس برای قاضی و حرکت فوری به پدینگتون",
          descriptionFa: "وقت بیشتری برای رسیدن به ایستگاه ذخیره می‌کنید، اما نمی‌دانید کدام سیم تله است.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-a2-7-time-dilemma",
        titleFa: "اعلام وضعیت بحرانی زمان و لزوم تصمیم‌گیری فوری",
        speakerPromptEn: "Watson looks at his pocket watch. The clock is ticking fast.",
        speakerPromptFa: "واتسون به ساعت جیبی‌اش نگاه می‌کند. زمان به سرعت می‌گذرد.",
        speakerRoleFa: "دکتر جان واتسون (نگران و مضطرب)",
        speakerAvatar: "🩺",
        taskInstructionFa: "به واتسون بگو: «بمب در بیست دقیقه منفجر می‌شود، باید الان تصمیم بگیریم!»",
        targetKeywords: [
          { phrase: "in twenty minutes", hintFa: "(در بیست دقیقه)", synonyms: ["in twenty minutes", "in 20 minutes", "twenty minutes"], weight: 50 },
          { phrase: "decide now", hintFa: "(الان تصمیم بگیر)", synonyms: ["decide now", "must decide now", "we must decide", "decide quickly"], weight: 50 },
        ],
        idealVoiceResponseEn: "The bomb explodes in twenty minutes, decide now!",
        alternativeResponsesEn: [
          { phraseEn: "The bomb will explode in twenty minutes, hurry up!", translationFa: "بمب در بیست دقیقه منفجر خواهد شد، عجله کن!" },
          { phraseEn: "We have twenty minutes left, we must choose now!", translationFa: "بیست دقیقه برایمان مانده است، باید الان انتخاب کنیم!" },
        ],
        whiteHintFa: "از حرف اضافه زمان in (مثل in twenty minutes) برای بیان زمان آینده استفاده کن!",
        fallbackChoices: [
          "The bomb explodes in twenty minutes, decide now!",
          "Trains are very comfortable and fast.",
          "Look at the clock on the station wall.",
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
  // STAGE 8: Consequence of Decision 3 & Track 9 (پیامد تصمیم سوم و سکوی ۹)
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "A2",
    titleFa: "پیامد تصمیم سوم: مسابقه با مرگ به سوی سکوی شماره ۹",
    titleEn: "Consequence of Decision 3: The Race to Track 9 at Paddington",
    locationFa: "سکوی شماره ۹، ایستگاه راه‌آهن پدینگتون لندن",
    locationEn: "Platform Track 9, Paddington Railway Station, London",
    storyIntroFa: "پیامد انتخاب مرحله هفتم رقم می‌خورد: یا قاضی را احیا کرده‌اید و راز سیم سیاه را شنیده‌اید اما تنها ۶۰ ثانیه به انفجار مانده است، یا سریع خودتان را رسانده‌اید و ۶ دقیقه وقت دارید اما بدون هیچ سرنخی از سیم‌ها!",
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
        storyIntroFa: "قاضی احیا شد و نجوا کرد: «موریارتی سیم‌ها را تغییر داده است! هرگز سیم سفید را نبرید! سیم سیاه را ببرید!» با سرعت به پدینگتون می‌رسید در حالی که فقط ۶۰ ثانیه مانده است!",
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
            speakerPromptEn: "Steam rises from the engine as rain pounds against the glass roof.",
            speakerPromptFa: "بخار از لوکوموتیو برمی‌خیزد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد.",
            speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
            speakerAvatar: "🚂",
            taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک اینجاست!»",
            targetKeywords: [
              { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate"], weight: 50 },
              { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "a bomb", "bomb on the train", "bomb here", "a dangerous bomb"], weight: 50 },
            ],
            idealVoiceResponseEn: "Clear the platform, there is a dangerous bomb here!",
            alternativeResponsesEn: [
              { phraseEn: "Move away quickly, there is a dangerous bomb on Track 9!", translationFa: "سریع دور شوید، یک بمب خطرناک در خط ۹ قرار دارد!" },
              { phraseEn: "Please leave the platform now, a bomb is inside the train!", translationFa: "لطفاً الان سکو را ترک کنید، بمبی داخل قطار است!" },
            ],
            whiteHintFa: "از جملات امری مستقیم (Clear the platform) برای اعلام وضعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Clear the platform, there is a dangerous bomb here!",
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
        storyIntroFa: "شما مستقیم به پدینگتون دویدید و با ۶ دقیقه فرصت رسیدید! سکو تخلیه شد، اما نمی‌دانید سیم سیاه تله است یا سیم سفید!",
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
            speakerPromptEn: "Steam rises from the engine as rain pounds against the glass roof.",
            speakerPromptFa: "بخار از لوکوموتیو برمی‌خیزد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد.",
            speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
            speakerAvatar: "🚂",
            taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک اینجاست!»",
            targetKeywords: [
              { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate"], weight: 50 },
              { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "a bomb", "bomb on the train", "bomb here", "a dangerous bomb"], weight: 50 },
            ],
            idealVoiceResponseEn: "Clear the platform, there is a dangerous bomb here!",
            alternativeResponsesEn: [
              { phraseEn: "Move away quickly, there is a dangerous bomb on Track 9!", translationFa: "سریع دور شوید، یک بمب خطرناک در خط ۹ قرار دارد!" },
              { phraseEn: "Please leave the platform now, a bomb is inside the train!", translationFa: "لطفاً الان سکو را ترک کنید، بمبی داخل قطار است!" },
            ],
            whiteHintFa: "از جملات امری مستقیم (Clear the platform) برای اعلام وضعیت اضطراری استفاده کن!",
            fallbackChoices: [
              "Clear the platform, there is a dangerous bomb here!",
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
        speakerPromptEn: "Steam rises from the engine as rain pounds against the glass roof.",
        speakerPromptFa: "بخار از لوکوموتیو برمی‌خیزد و باران بر سقف شیشه‌ای پدینگتون می‌کوبد.",
        speakerRoleFa: "سرنگهبان ایستگاه پدینگتون",
        speakerAvatar: "🚂",
        taskInstructionFa: "به نگهبانان بگو: «سکو را خالی کنید، یک بمب خطرناک اینجاست!»",
        targetKeywords: [
          { phrase: "Clear the platform", hintFa: "(سکو را خالی کنید)", synonyms: ["clear the platform", "clear the station", "evacuate everyone", "clear passengers", "evacuate"], weight: 50 },
          { phrase: "dangerous bomb", hintFa: "(بمب خطرناک)", synonyms: ["dangerous bomb", "a bomb", "bomb on the train", "bomb here", "a dangerous bomb"], weight: 50 },
        ],
        idealVoiceResponseEn: "Clear the platform, there is a dangerous bomb here!",
        alternativeResponsesEn: [
          { phraseEn: "Move away quickly, there is a dangerous bomb on Track 9!", translationFa: "سریع دور شوید، یک بمب خطرناک در خط ۹ قرار دارد!" },
          { phraseEn: "Please leave the platform now, a bomb is inside the train!", translationFa: "لطفاً الان سکو را ترک کنید، بمبی داخل قطار است!" },
        ],
        whiteHintFa: "از جملات امری مستقیم (Clear the platform) برای اعلام وضعیت اضطراری استفاده کن!",
        fallbackChoices: [
          "Clear the platform, there is a dangerous bomb here!",
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
  // STAGE 9: DECISION 4 — Black or White? (تصمیم چهارم: آزمون نهایی موریارتی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "A2",
    titleFa: "تصمیم چهارم: سیم سیاه یا سیم سفید؟ آزمون نهایی موریارتی",
    titleEn: "DECISION 4: Black or White Wire? Moriarty's Final Trial",
    locationFa: "داخل واگن قطار سلطنتی، خط ۹ پدینگتون",
    locationEn: "Inside Royal Carriage, Track 9, Paddington",
    storyIntroFa: "شما و دکتر واتسون به داخل واگن قطار می‌پرید. دستگاه شیشه‌ای حاوی گاز سفید روی زمین قرار دارد. نمایشگر دیجیتال روی عدد ۰۰:۴۰ ثانیه می‌درخشد! داخل جعبه دو سیم ضخیم قرار دارد: یکی سیاه و دیگری سفید. صدای خنده موریارتی از بلندگو پخش می‌شود: «سیاه یا سفید شرلوک؟ یک سیم را ببر—من تماشا می‌کنم!» دکتر واتسون انبر سیم‌چین را در دست دارد: «هلمز! در ارتش ما همیشه سیم سفید را می‌بریدیم! کدام را ببرم؟!»",
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
          descriptionFa: "به واتسون می‌گویید موریارتی قوانین ارتش را معکوس کرده است؛ سیم سیاه را می‌برید.",
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
        speakerPromptEn: "Watson holds the steel wire cutters over the bomb, waiting for your command.",
        speakerPromptFa: "واتسون انبر سیم‌چین را روی مکانیزم بمب نگه داشته و منتظر دستور شماست.",
        speakerRoleFa: "دکتر جان واتسون (مسلح به سیم‌چین)",
        speakerAvatar: "🩺",
        taskInstructionFa: "به واتسون بگو: «واتسون، همین الان سیم سیاه را ببر!»",
        targetKeywords: [
          { phrase: "cut", hintFa: "(ببر)", synonyms: ["cut", "snip"], weight: 30 },
          { phrase: "the black wire", hintFa: "(سیم سیاه)", synonyms: ["the black wire", "black wire", "the black one"], weight: 70 },
        ],
        idealVoiceResponseEn: "Watson, cut the black wire right now!",
        alternativeResponsesEn: [
          { phraseEn: "Cut the black wire now, Watson!", translationFa: "الان سیم سیاه را ببر، واتسون!" },
          { phraseEn: "Trust me John, cut the black wire!", translationFa: "به من اعتماد کن جان، سیم سیاه را ببر!" },
        ],
        whiteHintFa: "از فعل امری Cut و ترکیب the black wire استفاده کن!",
        fallbackChoices: [
          "Watson, cut the black wire right now!",
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
  // STAGE 10: The Grand Climax & The Big Plot Twist (پرده دهم و پایان شگفت‌انگیز)
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "A2",
    titleFa: "پرده دهم: فرجام بازی سیاه و سفید و افشای نقشه پنهان موریارتی",
    titleEn: "Stage 10: The Grand Climax & The Big Plot Twist",
    locationFa: "خط ۹ ایستگاه پدینگتون و دخمه مخفی آرشیو MI6",
    locationEn: "Track 9 Carriage & The Breached MI6 Archive Vault",
    storyIntroFa: "سیم بریده می‌شود و نفس‌ها در سینه حبس می‌گردد. آیا تصمیم‌های شما در طول این ۱۰ مرحله، فاجعه را مهار کرده یا گاز سفید را آزاد ساخته است؟",
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
        speakerPromptEn: "You bend down, touch the white residue on the floor, and taste it.",
        speakerPromptFa: "خم می‌شوی، پودر سفید روی زمین را لمس می‌کنی و آن را می‌چشی.",
        speakerRoleFa: "شرلوک هلمز (استنتاج علمی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «این پودر سفید سم نیست، فقط شکر است!»",
        targetKeywords: [
          { phrase: "white powder", hintFa: "(پودر سفید)", synonyms: ["white powder", "this white powder", "the powder"], weight: 35 },
          { phrase: "not poison", hintFa: "(سم نیست)", synonyms: ["not poison", "is not poison", "isn't poison"], weight: 35 },
          { phrase: "only sugar", hintFa: "(فقط شکر)", synonyms: ["only sugar", "sugar", "just sugar", "sugar and smoke"], weight: 30 },
        ],
        idealVoiceResponseEn: "This white powder is not poison, it is only sugar!",
        alternativeResponsesEn: [
          { phraseEn: "Look John, this is not poison, it is just sugar!", translationFa: "نگاه کن جان، این سم نیست، فقط شکر است!" },
          { phraseEn: "The bomb is fake Watson, it is only harmless sugar!", translationFa: "بمب جعلی است واتسون، فقط شکر بی‌خطر است!" },
        ],
        whiteHintFa: "از فعل ربطی is not و کلمات poison و sugar استفاده کن!",
        fallbackChoices: [
          "This white powder is not poison, it is only sugar!",
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
        climaxStoryFa: "«سیم سیاه را ببر جان!» واتسون سیم سیاه را قطع می‌کند و شیر اضطراری را قفل می‌کنید. تایمر روی ثانیه ۰۰:۰۲ متوقف می‌شود! جمعیت در بیرون هورا می‌کشند. شما جان صدها انسان را نجات دادید.",
        climaxStoryEn: "'Cut the Black wire, John!' Watson cuts the Black wire. The timer freezes at 00:02! Outside, the crowd cheers. You saved hundreds of lives!",
        revealDialogueFa: `ذره‌ای از پودر سفید روی زمین را می‌چشید... این سم نیست! فقط شکر و دود بی‌خطر تئاتر است!
ناگهان صدایی از پشت دیوار خط ۹ به گوش می‌رسد: یک سوراخ بزرگ در دیوار حفر شده است!
پشت خط ۹، گاوصندوق اسناد محرمانه MI6 قرار داشت. در حالی که همه سرگرم بمب جعلی قطار بودند، افراد موریارتی چهار پوشه محرمانه را ربوده‌اند. روی میز، موریارتی نامه‌ای به جا گذاشته است:

«شرلوک عزیزم،
بمب گاز فقط تردستی بود تا تو را سرگرم نگه دارد! امشب من به دو پیروزی رسیدم:
۱. چهار پرونده فوق‌محرمانه را بردم.
۲. دکتر جان واتسون را به تو هدیه دادم.
من عمداً دوست واتسون را مسموم کردم تا او به بیمارستان سنت جود بیاید و با تو آشنا شود! یک انسان بی‌احساس شکسته نمی‌شود، اما داشتن یک دوست نقطه ضعف تو خواهد بود!
تا بازی بعدی — موریارتی»

واتسون می‌پرسد: «هلمز، نامه چه می‌گوید؟»
به دوست جدیدتان نگاه می‌کنید، نیمه پایینی نامه را در جیب پنهان می‌کنید و آرام می‌گویید:
«هیچ چیز جان... کار واقعی ما تازه شروع شده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The bomb was harmless sugar and smoke! Moriarty breached the MI6 Vault and stole four secret files. He wrote: 'I gave you Dr. Watson... he will be your weakness.' Sherlock conceals the letter and smiles at his new friend.",
        nextTierHintFa: "پرونده سطح A2 با موفقیت بسته شد! اما موریارتی ۴ پرونده محرمانه MI6 را ربوده است. در سطح B1 (پرونده The Glass Jury)، موریارتی شما را به دادگاه شیشه‌ای می‌کشاند!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان ناکام: انفجار دود در قطار سلطنتی و هرج‌ومرج در پدینگتون",
        titleEn: "ENDING 2: CASE FAILED — White Smoke Over London!",
        badgeTitleFa: "⚠️ پرونده ناکام: فعال شدن تله موریارتی در قطار سلطنتی",
        imageSrc: "/images/skills/speaking/a2_scene_case_failed.jpg",
        climaxStoryFa: "با بریدن سیم سفید، صدای هیس ممتدی بلند شده و دود غلیظ سفیدی واگن و سکو را پر می‌کند. شما و واتسون از پنجره به روی سکو می‌پرید.",
        climaxStoryEn: "As the White wire is cut, thick white smoke fills the train! You and Watson leap onto the platform as Moriarty's laughter echoes!",
        revealDialogueFa: `با پراکنده شدن دود، متوجه می‌شوید که سالم هستید! ماده روی زمین را می‌چشید... این گاز سمی نیست! فقط شکر و دود تئاتر است!
در پشت خط ۹، سوراخی در دیوار گاوصندوق MI6 کنده شده است. موریارتی با یک بمب فیک همه را سر کار گذاشت تا چهار پرونده سری را بدزدد! روی میز نامه‌ای به جا مانده است که نشان می‌دهد موریارتی عمداً دوست واتسون را مسموم کرده بود تا او و شرلوک با هم آشنا شوند.
نامه را در جیب می‌گذارید و می‌گویید: «هیچ چیز جان... بازی تازه آغاز شده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The bomb was harmless sugar! Moriarty stole the MI6 files while everyone was distracted. He reveals he orchestrated Watson and Sherlock's meeting.",
        nextTierHintFa: "اگرچه بمب فیک بود، اما ۴ پرونده سرقت شد! در سطح B1 (The Glass Jury)، شرلوک و واتسون برای بازپس‌گیری اسناد وارد دادگاه مرگبار شیشه‌ای خواهند شد!",
      },
    },
  },
];
