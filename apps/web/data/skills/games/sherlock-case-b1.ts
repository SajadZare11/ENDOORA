import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR B1 CASE: "CASE FILE #03: THE BLUE TRAIN & THE CALEDONIAN CONSPIRACY"
// Official CEFR B1 Vocabulary & Grammar (American English File 3 / Oxford 3000):
// - Modals of Deduction: must be, can't be, might, could
// - Conditionals (First & Second): If we pull the brake, the train will stop...
// - Narrative Tenses: Past Simple, Past Continuous, Present Perfect
// - Connectors of Contrast & Reason: although, even though, so that, because
// - Accessible, high-frequency B1 mystery & railway vocabulary
// ============================================================================

export const B1_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: Boarding the Midnight Caledonian (سوار شدن شبانه به قطار آبی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "B1",
    titleFa: "قطار آبی: سوار شدن شبانه به کالدونیان بلو",
    titleEn: "The Blue Train: Boarding the Midnight Caledonian",
    locationFa: "سکوی مه‌گرفته شماره ۳ ایستگاه یوستون لندن",
    locationEn: "Foggy Platform 3, Euston Railway Station, London",
    storyIntroFa: "نیمه‌شب بارانی در لندن است. بازرس لسترید دوان‌دوان به سمت شما و دکتر واتسون می‌آید و نامه‌ای با مهر واکس آبی به دستتان می‌دهد: پوشه شماره ۱ از چهار پوشه فوق‌محرمانه MI6 که موریارتی در پدینگتون دزدیده بود، شناسایی شده است! حامل پوشه، دیپلمات ارشد سر آرتور بلیک است که سوار قطار سریع‌السیر شبانه کالدونیان بلو به مقصد ادینبرو شده است. با غرش سوت قطار، شما و واتسون در آخرین ثانیه‌ها سوار واگن سلطنتی آبی‌رنگ می‌شوید.",
    cutscene: {
      titleFa: "نامه اضطراری لسترید و حرکت قطار سریع‌السیر شبانه",
      titleEn: "Lestrade's Urgent Letter & The Midnight Departure",
      imageSrc: "/images/skills/speaking/b1_scene_1_euston_platform.jpg",
      dialogues: [
        {
          speakerId: "lestrade",
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Holmes! The government needs our help right now! Folder Number One is on the Blue Train!",
          textFa: "هلمز! دولت همین الان به کمک ما نیاز دارد! پوشه شماره یک در قطار آبی است!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Watson, grab your coat! The clue pointed directly to this train. We must leave right now!",
          textFa: "واتسون، پالتویت را بردار! سرنخ مستقیماً به این قطار اشاره داشت. همین حالا باید حرکت کنیم!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و همراه هلمز",
          speakerAvatar: "🩺",
          textEn: "I have my medical bag ready, Holmes. Whatever happens on this train, we will face it together.",
          textFa: "کیف پزشکی‌ام آماده است هلمز. هر اتفاقی در این قطار بیفتد، با هم با آن روبرو می‌شویم.",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-1-express-deduction",
        titleFa: "بیان استنتاج اولیه درباره مکان اختفای پوشه MI6",
        speakerPromptEn: "Look into the misty train corridor as the engine gathers speed into the dark night...",
        speakerPromptFa: "در حالی که غرش لوکوموتیو در دل شب اوج می‌گیرد، به راهروی مه‌آلود واگن نگاه می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (استنتاج با افعال وجهی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به لسترید بگو: «پوشه دزدیده شده MI6 باید جایی در این قطار پنهان شده باشد.»",
        targetKeywords: [
          { phrase: "stolen MI6 folder", hintFa: "(پوشه دزدیده شده MI6)", synonyms: ["stolen mi6 folder", "stolen folder", "the stolen folder", "the mi6 folder", "stolen blue folder"], weight: 50 },
          { phrase: "must be hidden", hintFa: "(باید پنهان شده باشد)", synonyms: ["must be hidden", "must be inside", "has to be hidden", "must be on the train", "is hidden"], weight: 50 },
        ],
        idealVoiceResponseEn: "The stolen MI6 folder must be hidden somewhere on this train.",
        alternativeResponsesEn: [
          { phraseEn: "The stolen folder must be somewhere on this train!", translationFa: "پوشه دزدیده‌شده باید جایی در این قطار باشد!" },
          { phraseEn: "The thief must have hidden the folder inside the train.", translationFa: "سارق باید پوشه را داخل قطار پنهان کرده باشد." },
        ],
        whiteHintFa: "از فعل وجهی استنتاج قطعی must be hidden و عبارت stolen MI6 folder استفاده کن!",
        fallbackChoices: [
          "The stolen MI6 folder must be hidden somewhere on this train.",
          "I wonder if the dining car serves hot coffee tonight.",
          "Train travel in England is always very expensive.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of deduction: must / might / can't)",
        npcResponse: {
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Good luck, gentlemen! The fate of our country travels with you!",
          textFa: "موفق باشید آقایان! سرنوشت کشور با شما سفر می‌کند!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: DECISION 1 — Mystery of Compartment 7 (معمای قتل در کوپه ۷)
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "B1",
    titleFa: "تصمیم اول: معمای کوپه ۷ و شوک گواهی فوت واتسون",
    titleEn: "DECISION 1: Murder in Compartment 7 & Watson's Certificate",
    locationFa: "کوپه شماره ۷ درجه یک، قطار کالدونیان بلو",
    locationEn: "First-Class Compartment 7, Caledonian Blue Express",
    storyIntroFa: "با عبور قطار از دشت‌های تاریک هرتفوردشایر، به کوپه شماره ۷ می‌رسید. درب کوپه نیمه‌باز است. دیپلمات ارشد، سر آرتور بلیک، روی صندلی چرمی به پهلو افتاده و فنجان قهوه شکسته‌ای کنار پایش روی زمین ریخته است. او مرده است و پوشه آبی MI6 غارت شده! شرلوک جیب مقتول را می‌گردد و سندی شوکه‌کننده می‌یابد: یک گواهی فوت ۵ سال پیش با امضا و مهر رسمی: دکتر جان اچ. واتسون! بازرس ویژه قطار اسلحه‌اش را می‌کشد و به واتسون خیره می‌شود: «دست‌ها بالا دکتر! شما ۵ سال پیش مرگ او را جعل کردید!»",
    cutscene: {
      titleFa: "جسد دیپلمات مسموم و اتهام تکان‌دهنده علیه واتسون",
      titleEn: "The Poisoned Diplomat & The Accusation Against Watson",
      imageSrc: "/images/skills/speaking/b1_scene_2_compartment_murder.jpg",
      dialogues: [
        {
          speakerId: "guard",
          speakerNameFa: "سرنگهبان امنیتی قطار",
          speakerRoleFa: "پلیس راه‌آهن بریتانیا",
          speakerAvatar: "🛡️",
          textEn: "Look at this official paper, Mr. Holmes! Dr. Watson signed a fake death certificate five years ago! He helped the killer!",
          textFa: "به این برگه رسمی نگاه کنید آقای هلمز! دکتر واتسون ۵ سال پیش گواهی فوت جعلی او را امضا کرده است! او به قاتل کمک کرده است!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک شوکه‌شده",
          speakerAvatar: "🩺",
          textEn: "Holmes, I swear! In the army hospital, I signed many papers every day! I never knew Sir Arthur Blake!",
          textFa: "هلمز، قسم می‌خورم! در بیمارستان ارتش هر روز برگه‌های زیادی امضا می‌کردم! من هرگز سر آرتور بلیک را نمی‌شناختم!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-1",
      promptFa: "یک دوراهی حیثیتی: آیا به برادر و همکار جدیدتان اعتماد می‌کنید یا به بازرس اجازه بازداشت او را می‌دهید؟",
      promptEn: "Critical Choice: Defend Dr. Watson against the murder charge, or question him alone?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Defend Dr. Watson and prove the signature is fake",
          labelFa: "گزینه ۱الف: اعلام قاطعانه اعتماد به دکتر واتسون و اثبات ساختگی بودن امضا",
          descriptionFa: "با قدرت پای واتسون می‌ایستید، امضا را جعلی اعلام می‌کنید و واتسون بی‌درنگ نوع سم را در ۳۰ ثانیه تشخیص می‌دهد.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Take Watson's medical bag and question him alone",
          labelFa: "گزینه ۱ب: ضبط کیف پزشکی واتسون و بازجویی محرمانه از او به تنهایی",
          descriptionFa: "دچار تردید می‌شوید؛ کیف پزشکی واتسون را می‌گیرید و ۱۰ دقیقه باارزش را در بحث تلف می‌کنید در حالی که قاتل می‌گریزد.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-2-defend-partner",
        titleFa: "دفاع قاطع از بی‌گناهی دکتر واتسون و رد ادعای بازرس",
        speakerPromptEn: "Look firmly into the rail inspector's suspicious eyes and deliver your scientific verdict...",
        speakerPromptFa: "قاطعانه در چشمان بدبین سرنگهبان قطار می‌نگری و حکم استنتاجی‌ات را صادر می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (استدلال عدم امکان منطقی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به بازرس قطار بگو: «دکتر واتسون نمی‌تواند قاتل باشد چون این امضا قطعاً ساختگی است.»",
        targetKeywords: [
          { phrase: "cannot be the killer", hintFa: "(نمی‌تواند قاتل باشد)", synonyms: ["cannot be the killer", "can't be the killer", "is not the killer", "isn't the killer", "could not be the killer"], weight: 50 },
          { phrase: "clearly fake", hintFa: "(قطعاً ساختگی است)", synonyms: ["clearly fake", "obviously fake", "a fake signature", "is forged", "not his signature", "clearly a forgery", "obviously a forgery"], weight: 50 },
        ],
        idealVoiceResponseEn: "Dr. Watson cannot be the killer because this signature is clearly fake.",
        alternativeResponsesEn: [
          { phraseEn: "Watson can't be the murderer because this signature is not his!", translationFa: "واتسون نمی‌تواند قاتل باشد چون این امضا مال او نیست!" },
          { phraseEn: "This signature is fake, so Watson cannot be guilty.", translationFa: "این امضا ساختگی است، پس واتسون نمی‌تواند مقصر باشد." },
        ],
        whiteHintFa: "از ساختار وجهی can't be / cannot be و عبارت clearly fake استفاده کن!",
        fallbackChoices: [
          "Dr. Watson cannot be the killer because this signature is clearly fake.",
          "I think we should wait until Edinburgh to discuss this paper.",
          "The coffee in this compartment has spilled all over the rug.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of deduction: cannot / can't + Reason clauses)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار قدردان",
          speakerAvatar: "🩺",
          textEn: "Thank you, Holmes! Let me examine the coffee cup immediately!",
          textFa: "ممنونم هلمز! بگذار فوراً فنجان قهوه را معاینه کنم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Consequence of Decision 1 (پیامد تصمیم اول: سم‌شناسی یا تعقیب)
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "B1",
    titleFa: "پیامد تصمیم اول: کشف سم در برابر اتلاف وقت",
    titleEn: "Consequence 1: Rapid Toxicology vs. Lost Seconds",
    locationFa: "راهروی واگن درجه یک، قطار کالدونیان بلو",
    locationEn: "Corridor of Carriage A, Caledonian Express",
    storyIntroFa: "پیامد اعتمادتان به دکتر واتسون آشکار می‌شود: یا با وفاداری به او سرنخ کلیدی زمان سم را به دست آورده‌اید، یا با بازجویی از او وقت باارزش را هدر داده‌اید و قاتل از دستتان گریخته است!",
    cutscene: {
      titleFa: "پیامد تصمیم اول: استنتاج زمانی قتل",
      titleEn: "Consequence of Decision 1: The Murder Timeline",
      imageSrc: "/images/skills/speaking/b1_scene_3_corridor_interrogation.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و کالبدشکاف",
          speakerAvatar: "🩺",
          textEn: "The white powder on the cup is a deadly poison. It stops the heart in two minutes!",
          textFa: "پودر سفید روی فنجان یک سم کشنده است. قلب را در دو دقیقه از کار می‌اندازد!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "That means the killer put it in the cup less than thirty minutes ago!",
          textFa: "این یعنی قاتل آن را کمتر از نیم ساعت پیش در فنجان ریخته است!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "پیامد ۱الف: اعتماد به واتسون و کشف سرنخ ۳۰ دقیقه‌ای",
        titleEn: "Consequence 1A: Mutual Trust & The 30-Minute Timeline",
        storyIntroFa: "با اعتماد شما، واتسون با آرامش آزمایش شیمیایی لبه فنجان را انجام می‌دهد. او متوجه می‌شود سم خطرناک تنها ۳۰ دقیقه پیش وارد فنجان شده است! این یعنی قاتل هنوز در همین واگن‌ها مخفی است و وقت فرار نداشته است. هلمز رد پای قطرات قهوه را روی فرش قرمز راهرو می‌بیند که مستقیم به سمت واگن غذاخوری می‌رود.",
        cutscene: {
          titleFa: "تحلیل سریع سم و ردیابی قطرات قهوه",
          titleEn: "Toxicology Clue & The Coffee Trail",
          imageSrc: "/images/skills/speaking/b1_scene_3_corridor_interrogation.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The coffee was served half an hour ago! The killer is still on this train!",
              textFa: "قهوه نیم ساعت پیش سرو شده است! قاتل هنوز داخل این قطار است!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Look at the floor, Watson! Dark coffee drops lead straight to the Dining Car!",
              textFa: "کف راهرو را نگاه کن واتسون! قطرات قهوه مستقیماً به سمت واگن غذاخوری می‌رود!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b1-3-conditional-deduction-1a",
            titleFa: "استنتاج شرطی درباره حضور حتمی قاتل در قطار",
            speakerPromptEn: "Point down the swaying corridor towards the Dining Car and state the logical conclusion...",
            speakerPromptFa: "به انتهای راهروی تکان‌خورنده به سمت واگن غذاخوری اشاره می‌کنی و استنتاجت را می‌گویی...",
            speakerRoleFa: "شرلوک هلمز (جمله شرطی نوع اول)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر سم خیلی سریع اثر کرده باشد، مظنون باید هنوز در قطار باشد.»",
            targetKeywords: [
              { phrase: "If the poison worked", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison worked", "if the poison acted", "if this poison worked", "since the poison worked", "because the poison worked"], weight: 50 },
              { phrase: "must still be on the train", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on the train", "must be on the train", "must still be on board", "must be on board", "is still on the train", "has to be on board"], weight: 50 },
            ],
            idealVoiceResponseEn: "If the poison worked so quickly, the suspect must still be on the train.",
            alternativeResponsesEn: [
              { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
              { phraseEn: "If he was poisoned recently, the killer cannot have left the train.", translationFa: "اگر او به تازگی مسموم شده، قاتل نمی‌تواند از قطار خارج شده باشد." },
            ],
            whiteHintFa: "از جمله شرطی با If the poison worked so quickly و فعل وجهی must still be on the train استفاده کن!",
            fallbackChoices: [
              "If the poison worked so quickly, the suspect must still be on the train.",
              "We should ask the conductor for extra blankets tonight.",
              "Is there any telephone on this midnight train?",
            ],
            aefReference: "AEF 3 Unit 4A (First conditional + Modals of deduction)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار وفادار",
              speakerAvatar: "🩺",
              textEn: "Let's move to the Dining Car at once, Holmes!",
              textFa: "بی‌درنگ به واگن غذاخوری برویم هلمز!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "پیامد ۱ب: اتلاف وقت در بازجویی و فرار مظنون به واگن بار",
        titleEn: "Consequence 1B: The Dispute & The Escaping Shadow",
        storyIntroFa: "شما کیف واتسون را می‌گردید و ۱۰ دقیقه حیاتی در مشاجره تلخ تلف می‌شود. واتسون با چشمان اندوهگین می‌گوید: «هلمز، موریارتی دقیقا همین شک را می‌خواست!» ناگهان صدای دویدن پای کسی از راهرو به گوش می‌رسد! به راهرو می‌دوید و سایه مردی با پالتوی سیاه را می‌بینید که درب واگن بار را از پشت قفل می‌کند.",
        cutscene: {
          titleFa: "فرار سایه سیاه و تلخی بی‌اعتمادی",
          titleEn: "The Fleeing Shadow & The Lost Minutes",
          imageSrc: "/images/skills/speaking/b1_scene_3_corridor_interrogation.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک آزرده‌خاطر",
              speakerAvatar: "🩺",
              textEn: "You doubted me, Holmes! And while we argued, the real killer got away with the Blue Folder!",
              textFa: "به من شک کردی هلمز! و در حالی که ما بحث می‌کردیم، قاتل واقعی با پوشه آبی فرار کرد!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه نگران",
              speakerAvatar: "🔍",
              textEn: "Forgive me, John. I made a mistake. He ran towards the Dining Car!",
              textFa: "مرا ببخش جان. من اشتباه کردم. او به سمت واگن غذاخوری دوید!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b1-3-conditional-deduction-1b",
            titleFa: "استنتاج شرطی درباره حضور حتمی قاتل در قطار",
            speakerPromptEn: "Point down the swaying corridor towards the Dining Car and state the logical conclusion...",
            speakerPromptFa: "به انتهای راهروی تکان‌خورنده به سمت واگن غذاخوری اشاره می‌کنی و استنتاجت را می‌گویی...",
            speakerRoleFa: "شرلوک هلمز (جمله شرطی نوع اول)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر سم خیلی سریع اثر کرده باشد، مظنون باید هنوز در قطار باشد.»",
            targetKeywords: [
              { phrase: "If the poison worked", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison worked", "if the poison acted", "if this poison worked", "since the poison worked", "because the poison worked"], weight: 50 },
              { phrase: "must still be on the train", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on the train", "must be on the train", "must still be on board", "must be on board", "is still on the train", "has to be on board"], weight: 50 },
            ],
            idealVoiceResponseEn: "If the poison worked so quickly, the suspect must still be on the train.",
            alternativeResponsesEn: [
              { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
              { phraseEn: "If he was poisoned recently, the killer cannot have left the train.", translationFa: "اگر او به تازگی مسموم شده، قاتل نمی‌تواند از قطار خارج شده باشد." },
            ],
            whiteHintFa: "از جمله شرطی با If the poison worked so quickly و فعل وجهی must still be on the train استفاده کن!",
            fallbackChoices: [
              "If the poison worked so quickly, the suspect must still be on the train.",
              "We should ask the conductor for extra blankets tonight.",
              "Is there any telephone on this midnight train?",
            ],
            aefReference: "AEF 3 Unit 4A (First conditional + Modals of deduction)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let us not waste another second. To the Dining Car!",
              textFa: "نباید ثانیه دیگری تلف کنیم. به واگن غذاخوری!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-b1-3-conditional-deduction-default",
        titleFa: "استنتاج شرطی درباره حضور حتمی قاتل در قطار",
        speakerPromptEn: "Point down the swaying corridor towards the Dining Car and state the logical conclusion...",
        speakerPromptFa: "به انتهای راهروی تکان‌خورنده به سمت واگن غذاخوری اشاره می‌کنی و استنتاجت را می‌گویی...",
        speakerRoleFa: "شرلوک هلمز (جمله شرطی نوع اول)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر سم خیلی سریع اثر کرده باشد، مظنون باید هنوز در قطار باشد.»",
        targetKeywords: [
          { phrase: "If the poison worked", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison worked", "if the poison acted", "if this poison worked", "since the poison worked", "because the poison worked"], weight: 50 },
          { phrase: "must still be on the train", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on the train", "must be on the train", "must still be on board", "must be on board", "is still on the train", "has to be on board"], weight: 50 },
        ],
        idealVoiceResponseEn: "If the poison worked so quickly, the suspect must still be on the train.",
        alternativeResponsesEn: [
          { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
          { phraseEn: "If he was poisoned recently, the killer cannot have left the train.", translationFa: "اگر او به تازگی مسموم شده، قاتل نمی‌تواند از قطار خارج شده باشد." },
        ],
        whiteHintFa: "از جمله شرطی با If the poison worked so quickly و فعل وجهی must still be on the train استفاده کن!",
        fallbackChoices: [
          "If the poison worked so quickly, the suspect must still be on the train.",
          "We should ask the conductor for extra blankets tonight.",
          "Is there any telephone on this midnight train?",
        ],
        aefReference: "AEF 3 Unit 4A (First conditional + Modals of deduction)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Let's move to the Dining Car at once, Holmes!",
          textFa: "بی‌درنگ به واگن غذاخوری برویم هلمز!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: The Dining Car & Bach's Secret Note (واگن غذاخوری و رمز پیانو)
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "B1",
    titleFa: "واگن غذاخوری: موسیقی باخ و رمز پنهان در پیانو",
    titleEn: "The Dining Car: Bach's Sonata & The Secret Piano Key",
    locationFa: "واگن غذاخوری مجلل قطار کالدونیان بلو",
    locationEn: "Grand Dining Car, Caledonian Express",
    storyIntroFa: "وارد واگن غذاخوری می‌شوید. لوسترهای کریستالی بالای میزهای غذاخوری تاب می‌خورند. مسافران اشرافی با جام‌های نقره‌ای شام می‌خورند. در گوشه سالن، پیانیستی با دستکش سیاه قطعه‌ای غم‌انگیز از باخ می‌نوازد. شرلوک متوجه حرکت عجیب انگشتان پیانیست می‌شود: او به عمد از زدن شستی سل‌دیز (G-sharp) خودداری می‌کند! به محض نزدیک شدن شما، پیانیست نت موسیقی را رها کرده و از در پشتی واگن فرار می‌کند. شرلوک درب پیانو را برمی‌دارد...",
    cutscene: {
      titleFa: "کشف رمز مخفی زیر کلید پیانوی واگن غذاخوری",
      titleEn: "The Secret Message Under the Piano Key",
      imageSrc: "/images/skills/speaking/b1_scene_4_dining_car_piano.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look under this wooden key, Watson! A small card with a secret message!",
          textFa: "زیر این کلید چوبی را نگاه کن واتسون! یک کارت کوچک با پیامی مخفی!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "It says: 'The thief goes to the Luggage Van at midnight.' That's where the Blue Folder is!",
          textFa: "نوشته است: «سارق در نیمه‌شب به واگن باربری می‌رود». پوشه آبی همان‌جاست!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-4-decipher-clue",
        titleFa: "افشای کشف رمز پنهان در پیانو به دکتر واتسون",
        speakerPromptEn: "Hold up the parchment card found under the piano hammer and explain the discovery...",
        speakerPromptFa: "کارت پوستی کشف‌شده زیر چکش پیانو را بالا می‌گیری و راز آن را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (استنتاج با Present Perfect)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «به کلیدهای پیانو نگاه کن، کسی یک پیام مخفی زیر آن پنهان کرده است.»",
        targetKeywords: [
          { phrase: "piano keys", hintFa: "(کلیدهای پیانو)", synonyms: ["piano keys", "the piano keys", "the piano", "these keys", "the keys"], weight: 40 },
          { phrase: "hidden a secret message", hintFa: "(یک پیام مخفی پنهان کرده)", synonyms: ["hidden a secret message", "hidden a secret note", "hidden a secret code", "put a secret message", "hidden an encrypted cipher", "hidden a cipher"], weight: 60 },
        ],
        idealVoiceResponseEn: "Look at the piano keys, someone has hidden a secret message underneath.",
        alternativeResponsesEn: [
          { phraseEn: "Someone has hidden a secret note under the piano keys!", translationFa: "کسی یک یادداشت مخفی زیر کلیدهای پیانو پنهان کرده است!" },
          { phraseEn: "Look under the piano keys, Watson, there is a hidden message here.", translationFa: "زیر کلیدهای پیانو را نگاه کن واتسون، یک پیام مخفی این‌جاست." },
        ],
        whiteHintFa: "از فعل زمان حال کامل has hidden و عبارت secret message استفاده کن!",
        fallbackChoices: [
          "Look at the piano keys, someone has hidden a secret message underneath.",
          "I really enjoy classical piano music while traveling.",
          "Could the waiter bring us two cups of hot English tea?",
        ],
        aefReference: "AEF 3 Unit 1B (Present perfect with just/already + Adverbs of manner)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار مصمم",
          speakerAvatar: "🩺",
          textEn: "The Luggage Van is next! Hurry before he jumps off!",
          textFa: "واگن بار بعدی است! عجله کن قبل از اینکه بیرون بپرد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — The Viaduct Sabotage (فاجعه پل معلق)
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "B1",
    titleFa: "تصمیم دوم: فاجعه پل معلق — ترمز دستی یا تعقیب پوشه؟",
    titleEn: "DECISION 2: The Bridge Crisis — Handbrake vs. MI6 Folder",
    locationFa: "واگن باربری و انبار چمدان‌ها، انتهای قطار کالدونیان",
    locationEn: "Luggage Van & Brake Compartment, Caledonian Express",
    storyIntroFa: "شما و واتسون با لگد درب واگن بار را باز می‌کنید. سرمای شدید از درز پنجره به داخل هجوم می‌آورد. بوی تند روغن ترمز سوخته به مشام می‌رسد: لوله‌های هیدرولیک ترمز قطار توسط سارق بریده شده‌اند! قطار با سرعت به سمت پل دره‌ای مرتفع شتاب می‌گیرد. در تاریکی انتهای واگن، مردی سیاه‌پوش با چمدان چرمی حاوی پوشه آبی به سمت واگن آخر می‌گریزد. ترمز دستی مکانیکی واگن بار تنها امید توقف قطار قبل از پیچ مرگبار پل است!",
    cutscene: {
      titleFa: "برش لوله‌های ترمز و خطر خروج قطار از ریل روی پل",
      titleEn: "Broken Brakes & Danger on the High Bridge",
      imageSrc: "/images/skills/speaking/b1_scene_5_luggage_van_brake.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی نگران",
          speakerAvatar: "🩺",
          textEn: "Holmes! Look at the pressure gauge! The brakes are broken and we will reach the bridge in two minutes!",
          textFa: "هلمز! به درجه فشار نگاه کن! ترمزها خراب شده و تا دو دقیقه دیگر به پل می‌رسیم!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه در دوراهی مرگ و زندگی",
          speakerAvatar: "🔍",
          textEn: "The thief has the MI6 folder! But if we don't pull that handbrake, the train will fall off the bridge!",
          textFa: "سارق پوشه MI6 را دارد! اما اگر آن ترمز دستی را نکشیم، قطار از روی پل سقوط خواهد کرد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-2",
      promptFa: "یک تصمیم اخلاقی حیاتی: آیا جان صدها مسافر را نجات می‌دهید یا اسناد سری پادشاهی را تعقیب می‌کنید؟",
      promptEn: "Critical Choice: Pull the handbrake to save passengers, or chase the thief with the MI6 folder?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Pull the handbrake together to save passenger lives",
          labelFa: "گزینه ۲الف: اولویت نجات مسافران — کشیدن ترمز دستی با کمک واتسون",
          descriptionFa: "جان صدها انسان بی‌گناه را نجات می‌دهید، قطار مهار می‌شود اما سارق به واگن شیشه‌ای پناه می‌برد.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Chase the thief alone to get the MI6 Blue Folder",
          labelFa: "گزینه ۲ب: تعقیب سارق برای پس گرفتن پوشه آبی MI6 و نادیده گرفتن ترمز",
          descriptionFa: "به سمت سارق می‌دوید؛ قطار به شدت روی پیچ پل تاب می‌خورد، مسافران جیغ می‌کشند و لرزش شدید تعادلتان را بر هم می‌زند.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-5-emergency-command",
        titleFa: "صدور فرمان فوری کشیدن ترمز دستی به دکتر واتسون",
        speakerPromptEn: "Grip the heavy iron wheel of the handbrake and give the decisive command...",
        speakerPromptFa: "چرخ فلزی سنگین ترمز دستی را محکم می‌گیری و فرمان قاطع را صادر می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (فرمان با افعال وجهی و زمان‌بندی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «ما باید با هم ترمز دستی را بکشیم قبل از اینکه قطار به پل برسد!»",
        targetKeywords: [
          { phrase: "pull the handbrake", hintFa: "(ترمز دستی را بکشیم)", synonyms: ["pull the handbrake", "pull the manual handbrake", "pull the emergency brake", "use the handbrake", "pull the brake"], weight: 60 },
          { phrase: "before the train reaches the bridge", hintFa: "(قبل از اینکه قطار به پل برسد)", synonyms: ["before the train reaches the bridge", "before the train hits the viaduct", "before we reach the bridge", "before the bridge", "before the train hits the bridge"], weight: 40 },
        ],
        idealVoiceResponseEn: "We should pull the handbrake together before the train reaches the bridge!",
        alternativeResponsesEn: [
          { phraseEn: "If we pull the handbrake now, the train will stop safely.", translationFa: "اگر الان ترمز دستی را بکشیم، قطار با امنیت متوقف خواهد شد." },
          { phraseEn: "Help me pull this emergency brake before we cross the bridge!", translationFa: "کمکم کن این ترمز اضطراری را بکشیم قبل از اینکه از پل عبور کنیم!" },
        ],
        whiteHintFa: "از فعل کمکی We should pull و عبارت before the train reaches the bridge استفاده کن!",
        fallbackChoices: [
          "We should pull the handbrake together before the train reaches the bridge!",
          "I left my warm winter coat back in the first carriage.",
          "Look at the heavy snow falling outside the window.",
        ],
        aefReference: "AEF 3 Unit 4B (Should / Ought to for strong recommendations + Time clauses)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Put your weight on the wheel, Holmes! Together on three... ONE, TWO, PULL!",
          textFa: "وزنت را روی چرخ بینداز هلمز! با هم در شماره سه... یک، دو، بکش!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Consequence of Decision 2 (پیامد تصمیم دوم: نجات یا لرزش)
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "B1",
    titleFa: "پیامد تصمیم دوم: مهار سرعت قطار در برابر فرار سارق",
    titleEn: "Consequence 2: Passengers Safe vs. The Locked Door",
    locationFa: "واگن متصل‌کننده به سالن شیشه‌ای انتهای قطار",
    locationEn: "Observation Vestibule, Caledonian Express",
    storyIntroFa: "پیامد تصمیمی که در واگن بار گرفتید پدیدار می‌شود: یا با فداکاری جان صدها مسافر را بر فراز پل نجات داده‌اید، یا با تعقیب اسناد، قطار را در آستانه واژگونی قرار داده و با لرزش شدید فرصت را از دست داده‌اید!",
    cutscene: {
      titleFa: "جرقه‌های ترمز و در بسته شده",
      titleEn: "Screeching Brakes & The Locked Door",
      imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The brakes worked! The bridge is behind us, but the thief locked the heavy door!",
          textFa: "ترمزها کار کردند! پل پشت سرمان است، اما سارق در سنگین را قفل کرد!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Listen! A recorded voice is playing from the room behind that door!",
          textFa: "گوش کن! صدای یک پیام ضبط‌شده از اتاق پشت آن در پخش می‌شود!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: نجات مسافران و فرار سارق به سالن شیشه‌ای",
        titleEn: "Consequence 2A: The Safe Train & The Locked Lounge",
        storyIntroFa: "با تمام قوا چرخ ترمز را می‌چرخانید. لنت‌های فلزی روی ریل سرخ می‌شوند و بوی دود و آهن فضا را پر می‌کند. قطار روی پل به سلامت سرعتش کم می‌شود و مسافران از وحشت رها می‌شوند! سارق با دیدن هلمز و واتسون، خودش را داخل سالن شیشه‌ای پایانی حبس می‌کند و در را می‌بندد.",
        cutscene: {
          titleFa: "مهار قطار و سنگربندی سارق در سالن شیشه‌ای",
          titleEn: "Train Safe & The Locked Lounge",
          imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The train is safe, Watson! Now we must open that heavy door before he escapes!",
              textFa: "قطار در امان است واتسون! حالا باید آن در سنگین را قبل از فرار او باز کنیم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه با تبر آتش‌نشانی",
              speakerAvatar: "🩺",
              textEn: "I have the emergency axe! Stand back Holmes, let me break the lock!",
              textFa: "تبر آتش‌نشانی را آوردم! برو عقب هلمز، بگذار قفل را بشکنم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-b1-6-contrast-deduction-2a",
            titleFa: "بیان تناقض بین مهار قطار و قفل شدن در سارق",
            speakerPromptEn: "Look at the sparks fading from the wheels and address Watson regarding the locked door...",
            speakerPromptFa: "به جرقه‌های رو به خاموشی چرخ‌ها می‌نگری و وضعیت در قفل‌شده را تحلیل می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (حرف ربط تضاد Although)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگرچه سرعت قطار کم می‌شود، اما سارق در را قفل کرده است.»",
            targetKeywords: [
              { phrase: "Although the train is slowing down", hintFa: "(اگرچه سرعت قطار کم می‌شود)", synonyms: ["although the train is slowing down", "even though the train is slowing down", "although the train slowed down", "while the train is slowing down"], weight: 40 },
              { phrase: "locked the door", hintFa: "(در را قفل کرده است)", synonyms: ["locked the door", "locked the iron door", "has locked the door", "locked this door", "barred the door"], weight: 60 },
            ],
            idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the door.",
            alternativeResponsesEn: [
              { phraseEn: "The train is safe now, but the thief locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرد." },
              { phraseEn: "Even though the train stopped, the iron door is locked.", translationFa: "حتی با اینکه قطار متوقف شد، در آهنی قفل است." },
            ],
            whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the door استفاده کن!",
            fallbackChoices: [
              "Although the train is slowing down, the thief has locked the door.",
              "This train has very comfortable first-class seats.",
              "We will arrive in Scotland early tomorrow morning.",
            ],
            aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار",
              speakerAvatar: "🩺",
              textEn: "One hard hit with this axe will break the lock!",
              textFa: "یک ضربه محکم با این تبر قفل را می‌شکند!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "پیامد ۲ب: لرزش شدید قطار و افتادن شرلوک",
        titleEn: "Consequence 2B: Violent Drift on the Bridge",
        storyIntroFa: "شما ترمز را رها می‌کنید و به دنبال سارق می‌دوید. قطار روی پیچ دره با تکان‌های وحشتناک کج می‌شود. قفسه‌های بار می‌افتند و شرلوک روی زمین سر می‌خورد. سارق با خنده در آهنی را می‌بندد. واتسون در آخرین ثانیه‌ها ترمز را با دردسر می‌کشد اما سرعت قطار هنوز بالاست!",
        cutscene: {
          titleFa: "کج شدن واگن‌ها روی پیچ دره و قفل شدن راهرو",
          titleEn: "Carriages Tilting & The Locked Door",
          imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نفس‌نفس‌زنان",
              speakerAvatar: "🩺",
              textEn: "That was terrifying, Holmes! I barely pulled the brake alone! The passengers were screaming!",
              textFa: "وحشتناک بود هلمز! من به تنهایی به سختی ترمز را کشیدم! مسافران فریاد می‌کشیدند!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه سرسخت",
              speakerAvatar: "🔍",
              textEn: "He locked the door from the inside. We have to break it right now!",
              textFa: "او در را از داخل قفل کرد. باید همین الان آن را بشکنیم!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b1-6-contrast-deduction-2b",
            titleFa: "بیان تناقض بین مهار قطار و قفل شدن در سارق",
            speakerPromptEn: "Look at the sparks fading from the wheels and address Watson regarding the locked door...",
            speakerPromptFa: "به جرقه‌های رو به خاموشی چرخ‌ها می‌نگری و وضعیت در قفل‌شده را تحلیل می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (حرف ربط تضاد Although)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگرچه سرعت قطار کم می‌شود، اما سارق در را قفل کرده است.»",
            targetKeywords: [
              { phrase: "Although the train is slowing down", hintFa: "(اگرچه سرعت قطار کم می‌شود)", synonyms: ["although the train is slowing down", "even though the train is slowing down", "although the train slowed down", "while the train is slowing down"], weight: 40 },
              { phrase: "locked the door", hintFa: "(در را قفل کرده است)", synonyms: ["locked the door", "locked the iron door", "has locked the door", "locked this door", "barred the door"], weight: 60 },
            ],
            idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the door.",
            alternativeResponsesEn: [
              { phraseEn: "The train is safe now, but the thief locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرد." },
              { phraseEn: "Even though the train stopped, the iron door is locked.", translationFa: "حتی با اینکه قطار متوقف شد، در آهنی قفل است." },
            ],
            whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the door استفاده کن!",
            fallbackChoices: [
              "Although the train is slowing down, the thief has locked the door.",
              "This train has very comfortable first-class seats.",
              "We will arrive in Scotland early tomorrow morning.",
            ],
            aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let's break this door before it's too late!",
              textFa: "بیایید قبل از اینکه دیر شود این در را بشکنیم!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-b1-6-contrast-deduction-default",
        titleFa: "بیان تناقض بین مهار قطار و قفل شدن در سارق",
        speakerPromptEn: "Look at the sparks fading from the wheels and address Watson regarding the locked door...",
        speakerPromptFa: "به جرقه‌های رو به خاموشی چرخ‌ها می‌نگری و وضعیت در قفل‌شده را تحلیل می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (حرف ربط تضاد Although)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگرچه سرعت قطار کم می‌شود، اما سارق در را قفل کرده است.»",
        targetKeywords: [
          { phrase: "Although the train is slowing down", hintFa: "(اگرچه سرعت قطار کم می‌شود)", synonyms: ["although the train is slowing down", "even though the train is slowing down", "although the train slowed down", "while the train is slowing down"], weight: 40 },
          { phrase: "locked the door", hintFa: "(در را قفل کرده است)", synonyms: ["locked the door", "locked the iron door", "has locked the door", "locked this door", "barred the door"], weight: 60 },
        ],
        idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the door.",
        alternativeResponsesEn: [
          { phraseEn: "The train is safe now, but the thief locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرد." },
          { phraseEn: "Even though the train stopped, the iron door is locked.", translationFa: "حتی با اینکه قطار متوقف شد، در آهنی قفل است." },
        ],
        whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the door استفاده کن!",
        fallbackChoices: [
          "Although the train is slowing down, the thief has locked the door.",
          "This train has very comfortable first-class seats.",
          "We will arrive in Scotland early tomorrow morning.",
        ],
        aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار",
          speakerAvatar: "🩺",
          textEn: "One hard hit with this axe will break the lock!",
          textFa: "یک ضربه محکم با این تبر قفل را می‌شکند!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — The Glass Observation Lounge (واگن شیشه‌ای)
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "B1",
    titleFa: "تصمیم سوم: سالن شیشه‌ای — پادزهر گروگان یا قطع فیوز؟",
    titleEn: "DECISION 3: The Glass Lounge — Antidote vs. Rail Switch Fuse",
    locationFa: "سالن تمام‌شیشه‌ای دیده‌بانی در انتهای قطار کالدونیان",
    locationEn: "Observation Glass Lounge, Caledonian Express",
    storyIntroFa: "در شکسته می‌شود و به سالن مجلل شیشه‌ای قدم می‌گذارید. شیشه‌های قوسی رو به منظره کوهستان برفی اسکاتلند است. صدای ضبط‌شده موریارتی با خنده می‌پیچد: «خوش آمدید هلمز و دکتر عزیزم! به دوراهی شیشه‌ای من خوش آمدید!» در گوشه سالن، دیپلمات جوان همراه مقتول با دستبند به صندلی بسته شده و حالش رو به وخامت است. در طرف دیگر، تابلوی الکتریکی سوزنبان با شمارش معکوس نشان می‌دهد که تا ۴۰ ثانیه دیگر ریل اصلی به پرتگاه منحرف خواهد شد!",
    cutscene: {
      titleFa: "دیپلمات جوان مسموم و شمارش معکوس انحراف ریل",
      titleEn: "The Poisoned Hostage & The Countdown",
      imageSrc: "/images/skills/speaking/b1_scene_7_glass_observation_lounge.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور موریارتی",
          speakerRoleFa: "صدای ضبط‌شده",
          speakerAvatar: "♟️",
          textEn: "A simple choice, Sherlock: save this young diplomat with the medicine, or stop the switch before the train crashes!",
          textFa: "یک انتخاب ساده شرلوک: نجات این دیپلمات جوان با دارو، یا توقف سوزنبان قبل از واژگونی قطار!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک وظیفه‌شناس",
          speakerAvatar: "🩺",
          textEn: "His pulse is very weak, Holmes! If we don't give him the medicine in thirty seconds, he will die!",
          textFa: "نبضش خیلی ضعیف است هلمز! اگر ظرف ۳۰ ثانیه به او دارو نرسانیم، خواهد مرد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-3",
      promptFa: "یک دوراهی تکان‌دهنده: آیا به دیپلمات جوان پادزهر تزریق می‌کنید یا فیوز الکتریکی سوزنبان را قطع می‌کنید؟",
      promptEn: "Critical Choice: Give medicine to save the diplomat, or cut the red wire to stop the train from crashing?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Give the medicine immediately to save the young diplomat",
          labelFa: "گزینه ۳الف: تزریق سریع پادزهر به دیپلمات گروگان و نجات جان او",
          descriptionFa: "جان دیپلمات بی‌گناه را نجات می‌دهید؛ او به هوش می‌آید و رمز باز کردن درب سقف را به شما می‌گوید.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Cut the red wire to stop the train from crashing",
          labelFa: "گزینه ۳ب: شکستن جعبه فیوز و قطع سیم قرمز سیگنال سوزنبان",
          descriptionFa: "سوزنبان برقی را از کار می‌اندازید تا ریل آزاد شود؛ دیپلمات بیهوش می‌شود اما ریل مستقیم باقی می‌ماند.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-7-fuse-conditional",
        titleFa: "اعلام قطع فیوز برقی با استفاده از ساختار شرطی",
        speakerPromptEn: "Examine the sparking wires of the switchboard and declare your rapid technical action...",
        speakerPromptFa: "به سیم‌های جرقه‌زننده تابلوی برق می‌نگری و اقدام فنی قاطع را اعلام می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شرطی نوع اول)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر من الان سیم قرمز را قطع کنم، قطار سقوط نخواهد کرد.»",
        targetKeywords: [
          { phrase: "If I cut the red wire", hintFa: "(اگر سیم قرمز را قطع کنم)", synonyms: ["if i cut the red wire", "if i cut the red fuse", "if i cut the wire", "if we cut the red wire", "if i cut this wire"], weight: 60 },
          { phrase: "will not crash", hintFa: "(سقوط نخواهد کرد)", synonyms: ["will not crash", "won't crash", "will be safe", "will not derail", "will be cancelled", "will stop safely"], weight: 40 },
        ],
        idealVoiceResponseEn: "If I cut the red wire now, the train will not crash.",
        alternativeResponsesEn: [
          { phraseEn: "If we cut this red wire, the track switch will stop.", translationFa: "اگر این سیم قرمز را ببریم، تغییر ریل متوقف خواهد شد." },
          { phraseEn: "I must cut the red wire to keep the train safe!", translationFa: "باید سیم قرمز را قطع کنم تا قطار در امان بماند!" },
        ],
        whiteHintFa: "از ساختار شرطی نوع اول با If I cut the red wire و فعل will not crash استفاده کن!",
        fallbackChoices: [
          "If I cut the red wire now, the train will not crash.",
          "The glass in this lounge is very thick and transparent.",
          "How far is the Scottish border from this location?",
        ],
        aefReference: "AEF 3 Unit 4A (First conditional + Simple future)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look through the glass roof, Holmes! The thief is climbing onto the roof with the Blue Folder!",
          textFa: "از سقف شیشه‌ای نگاه کن هلمز! سارق با پوشه آبی دارد روی سقف می‌رود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 8: Blizzard Battle on the Train Roof (نبرد روی سقف برفی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "B1",
    titleFa: "نبرد بر فراز سقف قطار در بوران اسکاتلند",
    titleEn: "Battle on the Train Roof in the Scottish Blizzard",
    locationFa: "سقف لغزنده و یخ‌بندان واگن‌های قطار سریع‌السیر کالدونیان",
    locationEn: "Icy Roof of the Blue Train, Scottish Moors",
    storyIntroFa: "شما و واتسون از نردبان فلزی اضطراری به روی سقف قطار صعود می‌کنید. باد یخی با سرعت زوزه می‌کشد و دانه‌های برف به صورتتان می‌کوبد. قطار در دل مه سیاه کوهستان‌های اسکاتلند پیش می‌رود. جلوتر، مأمور بلندقامت موریارتی با چمدان چرمی آبی روی لبه لغزنده سقف پیش می‌رود تا با جدا کردن کوپلینگ لوکوموتیو، با موتور قطار به تنهایی بگریزد!",
    cutscene: {
      titleFa: "تعقیب دلهره‌آور روی سقف برفی قطار در حال حرکت",
      titleEn: "The Dangerous Chase on the Train Roof",
      imageSrc: "/images/skills/speaking/b1_scene_8_blizzard_train_roof.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در کولاک",
          speakerAvatar: "🩺",
          textEn: "Hold on tight, Holmes! The strong wind is pushing us toward the edge!",
          textFa: "محکم بگیر هلمز! باد شدید ما را به سمت لبه سقف هل می‌دهد!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "He is moving toward the engine! If he disconnects the engine, he will escape with the folder!",
          textFa: "او دارد به سمت لوکوموتیو می‌رود! اگر موتور را جدا کند، با پوشه فرار خواهد کرد!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-8-modal-warning",
        titleFa: "هشدار احتمال پریدن سارق با افعال وجهی احتمال",
        speakerPromptEn: "Shout through the howling wind to Watson, assessing the suspect's next dangerous move...",
        speakerPromptFa: "از میان زوزه باد بر سر واتسون فریاد می‌زنی و حرکت خطرناک بعدی مظنون را هشدار می‌دهی...",
        speakerRoleFa: "شرلوک هلمز (افعال وجهی احتمال might)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون هشدار بده: «روی سقف یخی مراقب باش، او ممکن است روی موتور قطار بپرد!»",
        targetKeywords: [
          { phrase: "Be careful on the icy roof", hintFa: "(روی سقف یخی مراقب باش)", synonyms: ["be careful on the icy roof", "be careful on the roof", "watch out on the roof", "careful on the icy roof", "be careful on this roof"], weight: 50 },
          { phrase: "might jump", hintFa: "(ممکن است بپرد)", synonyms: ["might jump", "could jump", "may jump", "might jump onto the engine", "can jump"], weight: 50 },
        ],
        idealVoiceResponseEn: "Be careful on the icy roof, he might jump onto the front engine!",
        alternativeResponsesEn: [
          { phraseEn: "Watch your step, Watson, the thief might jump onto the locomotive!", translationFa: "مواظب قدمت باش واتسون، سارق ممکن است روی لوکوموتیو بپرد!" },
          { phraseEn: "Stay low on the roof because the suspect could jump any second!", translationFa: "روی سقف خم شو چون مظنون ممکن است هر ثانیه بپرد!" },
        ],
        whiteHintFa: "از عبارت Be careful on the icy roof و فعل وجهی احتمال he might jump استفاده کن!",
        fallbackChoices: [
          "Be careful on the icy roof, he might jump onto the front engine!",
          "The Scottish mountains look very majestic in winter.",
          "I wonder what time the sun will rise tomorrow morning.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of possibility: might / could + Adjectives of condition)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار شجاع",
          speakerAvatar: "🩺",
          textEn: "Jump with me, Holmes, down into the engine cab right now!",
          textFa: "با من بپر هلمز، همین حالا به داخل کابین موتور لوکوموتیو!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4 — Locomotive Cab & Snow Switch (کابین لوکوموتیو)
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "B1",
    titleFa: "تصمیم چهارم: کابین لوکوموتیو — دپوی برفی یا رهاسازی واگن‌ها؟",
    titleEn: "DECISION 4: The Locomotive Cab — Snow Depot vs. Decoupling",
    locationFa: "کابین موتورخانه بخار لوکوموتیو سریع‌السیر",
    locationEn: "Steam Engine Locomotive Cab, Caledonian Express",
    storyIntroFa: "شما و واتسون به داخل کابین لوکوموتیو سقوط می‌کنید. لوکوموتیوران بیهوش روی زمین افتاده و مأمور موریارتی با دیدن شما، چمدان آبی را روی کوره گداخته می‌گذارد و اهرم گاز را می‌شکند! تا ۳۰ ثانیه دیگر خط آهن به دو راهی می‌رسد: سمت راست به سمت دپوی برفی ایستگاه کوهستانی کاریان می‌رود (تپه‌های برف نرم قطار را بدون مرگ مسافران مهار می‌کند)؛ سمت چپ پلی در حال تعمیر روی رودخانه یخ‌زده که برای عبور واگن‌ها مناسب نیست!",
    cutscene: {
      titleFa: "شکستن اهرم گاز و دوراهی سوزنبان دپوی برف",
      titleEn: "Broken Throttle & The Snow Siding Dilemma",
      imageSrc: "/images/skills/speaking/b1_scene_9_locomotive_snow_switch.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The engine control is broken! We must turn the train into the snow bank or we will crash!",
          textFa: "اهرم کنترل موتور شکسته است! باید قطار را به سمت دیواره برف بچرخانیم وگرنه تصادف خواهیم کرد!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه کنار اهرم‌ها",
          speakerAvatar: "🩺",
          textEn: "There is the track lever on the right! Holmes, should I pull it to steer us into the snow?",
          textFa: "آن اهرم ریل در سمت راست است! هلمز، بکشمش تا ما را به سمت برف هدایت کند؟",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-4",
      promptFa: "آخرین تصمیم سرنوشت‌ساز B1: آیا قطار را به دپوی برفی هدایت می‌کنید یا واگن‌ها را رها می‌سازید؟",
      promptEn: "Final Critical Choice: Steer the train into the deep snow, or decouple passenger carriages?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Pull the lever to steer the train into the deep snow",
          labelFa: "گزینه الف: تغییر اهرم سوزنبان به سمت دپوی برف برای توقف امن در کوهستان",
          descriptionFa: "قطار به کوهستان برف نرم هدایت می‌شود؛ برخورد مهار می‌شود، تمام مسافران سالم می‌مانند و پوشه آبی از آتش نجات می‌یابد.",
          pointsDelta: 150,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Disconnect the passenger carriages and let the engine go",
          labelFa: "گزینه ب: باز کردن اهرم کوپلینگ برای رهاسازی واگن‌ها و پرتاب لوکوموتیو به دره",
          descriptionFa: "واگن‌های مسافران جدا شده و می‌ایستند، اما لوکوموتیو به دره سقوط می‌کند و پوشه آبی در آتش کوره از بین می‌رود.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-9-switch-command",
        titleFa: "دستور چرخش اهرم ریل با قید هدف و نتیجه so that",
        speakerPromptEn: "Lunge toward the track control lever and yell the decisive maneuver to Watson...",
        speakerPromptFa: "به سمت اهرم کنترل ریل شیرجه می‌روی و مانور نهایی را با فریاد به واتسون اعلام می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (بیان هدف با so that)",
        speakerAvatar: "🔍",
        taskInstructionFa: "فریاد بزن: «اهرم ریل را بکش تا قطار با امنیت در برف متوقف شود!»",
        targetKeywords: [
          { phrase: "Pull the track lever", hintFa: "(اهرم ریل را بکش)", synonyms: ["pull the track lever", "switch the track lever", "pull the lever", "turn the lever", "switch the lever"], weight: 50 },
          { phrase: "so that the train stops safely", hintFa: "(تا قطار با امنیت متوقف شود)", synonyms: ["so that the train stops safely", "so the train stops safely", "so that the train stops", "to stop the train safely", "stops safely"], weight: 50 },
        ],
        idealVoiceResponseEn: "Pull the track lever so that the train stops safely in the snow!",
        alternativeResponsesEn: [
          { phraseEn: "Pull that lever now so the train will stop in the snow!", translationFa: "آن اهرم را الان بکش تا قطار در برف متوقف شود!" },
          { phraseEn: "Turn the switch lever to the snow bank before it is too late!", translationFa: "اهرم را به سمت دیواره برف بچرخان قبل از اینکه خیلی دیر شود!" },
        ],
        whiteHintFa: "از فعل امری Pull the track lever و عبارت هدف so that the train stops safely استفاده کن!",
        fallbackChoices: [
          "Pull the track lever so that the train stops safely in the snow!",
          "I think we missed our station stop in Newcastle.",
          "Steam engines require a great deal of clean water.",
        ],
        aefReference: "AEF 3 Unit 6B (Clauses of purpose: so that + Modal verbs)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "The lever is pulled! We are hitting the snow... hold on tight!",
          textFa: "اهرم کشیده شد! داریم به برف برخورد می‌کنیم... محکم بگیر!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: Climax, The Plot Twist & The Hound Coin (فرجام کار و سکه هاوند)
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "B1",
    titleFa: "پرده دهم: فرجام کار، پلات‌توییست بزرگ و کشف سکه هاوند",
    titleEn: "Stage 10: The Grand Resolution, The Plot Twist & The Hound Coin",
    locationFa: "سکوی یخ‌زده ایستگاه کوهستانی کاریان، سپیده‌دم اسکاتلند",
    locationEn: "Cairn Mountain Station Platform, Dawn in the Scottish Highlands",
    storyIntroFa: "با غرشی عظیم، لوکوموتیو وارد دیواره پنج متری برف نرم دپو می‌شود. انبوهی از پودر برف سفید به هوا برمی‌خیزد و چرخ‌های غول‌پیکر فولادی با سایش در برف متوقف می‌شوند. آفتاب کم‌رمق زمستانی افق اسکاتلند را طلایی می‌کند. مسافران همگی در کمال سلامت تخلیه می‌شوند و از پنجره‌ها برای شما و واتسون دست تکان می‌دهند. چمدان چرمی مأمور موریارتی روی برف می‌افتد. شرلوک پوشه آبی شماره ۱ را می‌گشاید...",
    cutscene: {
      titleFa: "توقف قطار در دپوی برفی و افشای راز پوشه آبی",
      titleEn: "The Snow Buffer Stop & Opening the Blue Folder",
      imageSrc: "/images/skills/speaking/b1_scene_10_cairn_hound_coin.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه پیروز",
          speakerAvatar: "🔍",
          textEn: "Look at the seal, John! Folder Number One of MI6 is safe! We protected the secret plans!",
          textFa: "مهر را نگاه کن جان! پوشه شماره یک MI6 در امان است! از نقشه‌های محرمانه محافظت کردیم!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سرافراز",
          speakerAvatar: "🩺",
          textEn: "And look at this paper! It proves someone stole my signature five years ago! My name is clear!",
          textFa: "و به این برگه نگاه کن! ثابت می‌کند کسی ۵ سال پیش امضای مرا دزدیده بود! نام من پاک شد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b1-10-hound-deduction",
        titleFa: "استنتاج کشف سکه برنزی هاوند و آغاز پرونده بعدی در دارتمور",
        speakerPromptEn: "Hold up the heavy ancient bronze coin dropped from the Blue Folder and speak your deduction...",
        speakerPromptFa: "سکه کهن و برنزی سنگینی را که از لابلای پوشه آبی بر برف افتاده بالا می‌گیری و استنتاجت را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (استنتاج با must be)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «این سکه برنزی نشانه پرونده بعدی ما در دارتمور است!»",
        targetKeywords: [
          { phrase: "bronze coin", hintFa: "(سکه برنزی)", synonyms: ["bronze coin", "this bronze coin", "the bronze coin", "the coin", "this coin"], weight: 50 },
          { phrase: "our next case in Dartmoor", hintFa: "(پرونده بعدی ما در دارتمور)", synonyms: ["our next case in dartmoor", "next case in dartmoor", "next mystery in dartmoor", "a clue for our next case", "case in dartmoor"], weight: 50 },
        ],
        idealVoiceResponseEn: "This bronze coin must be a clue for our next case in Dartmoor!",
        alternativeResponsesEn: [
          { phraseEn: "Look at this coin, Watson! Our next mystery will be in Dartmoor.", translationFa: "به این سکه نگاه کن واتسون! معمای بعدی ما در دارتمور خواهد بود." },
          { phraseEn: "This coin shows that our next adventure will be in the moors.", translationFa: "این سکه نشان می‌دهد ماجراجویی بعدی ما در باتلاق‌ها خواهد بود." },
        ],
        whiteHintFa: "از فعل وجهی استنتاج must be و کلمات bronze coin و our next case in Dartmoor استفاده کن!",
        fallbackChoices: [
          "This bronze coin must be a clue for our next case in Dartmoor!",
          "Let us board the return train to London right now.",
          "I think Edinburgh is very cold during this season.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of deduction + Prepositions of place)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار",
          speakerAvatar: "🩺",
          textEn: "Dartmoor... the land of the howling hounds! The game is just beginning, Holmes!",
          textFa: "دارتمور... سرزمین سگ‌های زوزه‌کش! بازی تازه شروع شده است هلمز!",
        },
      },
    ],
    possibleEndings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان پیروزمندانه: مهار قطار، پاک شدن نام واتسون و تصاحب پوشه آبی",
        titleEn: "ENDING 1: CASE SOLVED — The Triumph of the Blue Train!",
        badgeTitleFa: "🎖️ پرونده با موفقیت حل شد: شاهکار مشترک هلمز و واتسون در کالدونیان",
        imageSrc: "/images/skills/speaking/b1_scene_case_solved.jpg",
        climaxStoryFa: "لوکوموتیو در آغوش دیواره برفی متوقف می‌شود. مسافران با فریادهای شادی و تشویق از واگن‌ها خارج می‌شوند. پوشه آبی سرقتی MI6 به طور کامل و دست‌نخورده بازیابی می‌گردد. همچنین سندی رسمی از آرشیوهای پنهان موریارتی به دست می‌آید که ثابت می‌کند امضا و مهر دکتر واتسون ۵ سال پیش در بیمارستان نظامی جعل شده بود تا در این روز به عنوان مهره سوخته قربانی شود. پیوند برادری و اعتماد میان هلمز و واتسون خدشه‌ناپذیر می‌گردد!",
        climaxStoryEn: "The train stops safely in the deep snow. The passengers cheer on the platform. The stolen MI6 Blue Folder is recovered, and official proof clears Dr. Watson's name. Holmes and Watson solved the mystery together!",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
با باز کردن پوشه آبی شماره ۱، اسناد پایگاه تحقیقات شیمیایی دارتمور (Dartmoor) نمایان می‌شود.
اما در آخرین برگ پوشه، شیء سنگین و کهنی به جا مانده است:
یک سکه باستانی برنزی با نقش برجسته سر یک سگ شکاری درنده با چشمان یاقوتی: «سکه هاوند [B2]»!
در کنار سکه، نامه‌ای کوتاه با دست‌خط موریارتی خودنمایی می‌کند:

«شرلوک عزیزم،
پوشه اول را پس گرفتی، اما قطار آبی فقط یک دست‌گرمی بود تا وفاداری پزشکت را بسنجم!
بازی واقعی در دل مه سیاه باتلاق‌های دارتمور آغاز شده است؛ جایی که پوشه دوم (سکه هاوند [B2]) و راز خانوادگی خاندان باسکرویل در انتظارت است.
تا شبی که زوزه سگ شکاری خوابت را برباید...
— موریارتی»

واتسون سکه برنزی را در دست می‌چرخاند: «هلمز... دارتمور؟ موریارتی ما را به باتلاق‌های باسکرویل می‌کشاند!»
شرلوک پیپ خود را روشن می‌کند و می‌گوید:
«دقیقاً جان... چمدان‌هایت را برای سفر به دارتمور ببند، بازی تازه به اوج رسیده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: Inside the Blue Folder lies the classified map of Dartmoor, and an old bronze coin showing a hunting dog—The Hound Coin [B2]! Moriarty's letter mocks: 'The Blue Train was just a warm-up. The true hunt begins in the moors of Baskerville... until you hear the hound howl.' Holmes and Watson prepare for Level B2 in Dartmoor.",
        nextTierHintFa: "پرونده سطح B1 (The Blue Train) با پیروزی درخشان شما و اثبات بی‌گناهی دکتر واتسون بسته شد! با کشف «سکه هاوند [B2]»، در سطح B2 شما و واتسون به باتلاق‌های مه‌آلود باسکرویل در دارتمور سفر خواهید کرد تا از سرقت دومین پوشه محرمانه MI6 جلوگیری کنید!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان تلخ: نجات مسافران اما سوختن بخشی از اسناد در دره",
        titleEn: "ENDING 2: BITTERSWEET — Train Saved, Folder Lost in the Gorge",
        badgeTitleFa: "⚠️ پرونده نیمه‌تمام: نجات جان مسافران و فرار مأمور موریارتی",
        imageSrc: "/images/skills/speaking/b1_scene_case_failed.jpg",
        climaxStoryFa: "قطار از فاجعه نجات می‌یابد و مسافران در امنیت کامل تخلیه می‌شوند. اما در جریان ترمز اضطراری و تعقیب‌های دیرهنگام، چمدان چرمی به دره سقوط کرده و نیمی از برگه‌های پوشه آبی در رودخانه یخ‌زده از بین می‌رود. موریارتی برتری اطلاعاتی را حفظ می‌کند اگرچه پاک شدن نام دکتر واتسون قطعی می‌شود.",
        climaxStoryEn: "The passengers are saved, but the Blue Folder fell into the icy river during the chase. Watson's name is cleared, but Moriarty escaped.",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
روی برف‌های سکو، مأمور موریارتی پیش از ناپدید شدن در مه، یک سکه برنزی به جا گذاشته است:
سکه سگ شکاری دارتمور (Hound Coin [B2])!
پیام تلخ موریارتی روی برف باقی مانده است:
«جان مردم را نجات دادی شرلوک، اما اسناد را از دست دادی. در مه دارتمور می‌بینمت...»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The folder was lost, but the Hound Coin [B2] was dropped on the snow. Moriarty retreats into the mists of Dartmoor, setting up Level B2.",
        nextTierHintFa: "اگرچه پوشه آبی ناقص شد، اما با به دست آوردن سکه هاوند، پرونده سطح B2 در مه باتلاق‌های دارتمور در انتظار شماست!",
      },
    },
  },
];
