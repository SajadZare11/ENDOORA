import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR B1 CASE: "CASE FILE #03: THE BLUE TRAIN & THE CALEDONIAN CONSPIRACY"
// Official CEFR B1 Vocabulary & Grammar (AEF 3):
// - Modals of Deduction: must be, can't be, might have, could be
// - Conditionals (Type 1 & 2): If we pull the brake, the train will stop...
// - Narrative Tenses: Past Simple, Past Continuous, Past Perfect
// - Connectors of Contrast & Reason: although, even though, so that, because
// - High-stakes Railway & Diplomatic Espionage Lexicon
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
      titleEn: "Lestrade's Urgent Dispatch & The Midnight Departure",
      imageSrc: "/images/skills/speaking/b1_scene_1_euston_platform.jpg",
      dialogues: [
        {
          speakerId: "lestrade",
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "بازرس اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Holmes! The Prime Minister ordered this investigation himself! Folder Number One is on the Caledonian Blue!",
          textFa: "هلمز! نخست‌وزیر شخصاً دستور این تحقیق را داده است! پوشه شماره یک در قطار کالدونیان بلو است!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Watson, grab your coat! The symbol inside Lily's ribbon pointed directly to this train. We leave right now!",
          textFa: "واتسون، پالتویت را بردار! نماد داخل روبان لیلی مستقیماً به این قطار اشاره داشت. همین حالا حرکت می‌کنیم!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و همراه هلمز",
          speakerAvatar: "🩺",
          textEn: "I have my medical kit and revolver ready, Holmes. Whatever Moriarty planned on this train, we will face it together.",
          textFa: "کیف پزشکی و رولورم آماده است هلمز. هر نقشه‌ای که موریارتی در این قطار کشیده باشد، با هم با آن روبرو می‌شویم.",
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
        taskInstructionFa: "به لسترید بگو: «پوشه دزدیده شده MI6 باید در این قطار شبانه مخفی شده باشد.»",
        targetKeywords: [
          { phrase: "stolen MI6 folder", hintFa: "(پوشه دزدیده شده MI6)", synonyms: ["stolen mi6 folder", "stolen folder", "the stolen mi6 folder", "the mi6 folder"], weight: 50 },
          { phrase: "must be hidden", hintFa: "(باید مخفی شده باشد)", synonyms: ["must be hidden", "must be inside", "has to be hidden", "is definitely hidden"], weight: 50 },
        ],
        idealVoiceResponseEn: "The stolen MI6 folder must be hidden somewhere inside this night train.",
        alternativeResponsesEn: [
          { phraseEn: "The stolen folder must be somewhere on this express train!", translationFa: "پوشه سرقت‌شده باید جایی در این قطار سریع‌السیر باشد!" },
          { phraseEn: "Moriarty's agent must have hidden the folder inside the train.", translationFa: "مأمور موریارتی باید پوشه را داخل قطار پنهان کرده باشد." },
        ],
        whiteHintFa: "از فعل وجهی استنتاج قطعی must be hidden و عبارت stolen MI6 folder استفاده کن!",
        fallbackChoices: [
          "The stolen MI6 folder must be hidden somewhere inside this night train.",
          "I wonder if the dining car serves hot coffee tonight.",
          "Train travel in England is always very expensive.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of deduction: must / might / can't)",
        npcResponse: {
          speakerNameFa: "بازرس لسترید",
          speakerRoleFa: "اسکاتلندیارد",
          speakerAvatar: "👮‍♂️",
          textEn: "Good luck, gentlemen! The fate of the British Empire travels with you!",
          textFa: "موفق باشید آقایان! سرنوشت امپراتوری بریتانیا با شما سفر می‌کند!",
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
          textEn: "Look at this official paper, Mr. Holmes! Dr. Watson signed a fake death certificate five years ago! He is an accomplice!",
          textFa: "به این برگه رسمی نگاه کنید آقای هلمز! دکتر واتسون ۵ سال پیش گواهی فوت جعلی او را امضا کرده است! او شریک جرم است!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک شوکه‌شده",
          speakerAvatar: "🩺",
          textEn: "Holmes, I swear to God! In the Afghan war, hundreds of official papers crossed my desk! I never knew Sir Arthur Blake!",
          textFa: "هلمز، به خدا قسم می‌خورم! در جنگ افغانستان صدها برگه رسمی از زیر دستم رد شد! من هرگز سر آرتور بلیک را نمی‌شناختم!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-1",
      promptFa: "یک دوراهی حیثیتی: آیا به برادر و همکار جدیدتان اعتماد می‌کنید یا به بازرس اجازه بازداشت او را می‌دهید؟",
      promptEn: "Critical Choice: Defend Dr. Watson against the murder charge, or confiscate his kit and interrogate him?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Publicly defend Dr. Watson and prove the signature is forged",
          labelFa: "گزینه ۱الف: اعلام قاطعانه اعتماد به دکتر واتسون و اثبات ساختگی بودن امضا",
          descriptionFa: "با قدرت پای واتسون می‌ایستید، امضا را جعلی اعلام می‌کنید و واتسون بی‌درنگ نوع سم را در ۳۰ ثانیه تشخیص می‌دهد.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Confiscate Watson's medical bag and interrogate him privately",
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
        taskInstructionFa: "به بازرس قطار بگو: «دکتر واتسون نمی‌تواند قاتل باشد چون این امضا قطعاً جعلی است.»",
        targetKeywords: [
          { phrase: "cannot be the killer", hintFa: "(نمی‌تواند قاتل باشد)", synonyms: ["cannot be the killer", "can't be the killer", "is not the killer", "isn't the killer"], weight: 50 },
          { phrase: "clearly a forgery", hintFa: "(قطعاً جعلی است)", synonyms: ["clearly a forgery", "obviously a forgery", "a fake signature", "is forged", "clearly forged"], weight: 50 },
        ],
        idealVoiceResponseEn: "Dr. Watson cannot be the killer because this signature is clearly a forgery.",
        alternativeResponsesEn: [
          { phraseEn: "Watson can't be the murderer because someone forged his signature!", translationFa: "واتسون نمی‌تواند قاتل باشد چون کسی امضایش را جعل کرده است!" },
          { phraseEn: "This signature must be fake, so Watson cannot be responsible.", translationFa: "این امضا باید جعلی باشد، پس واتسون نمی‌تواند مقصر باشد." },
        ],
        whiteHintFa: "از ساختار وجهی can't be / cannot be و عبارت clearly a forgery استفاده کن!",
        fallbackChoices: [
          "Dr. Watson cannot be the killer because this signature is clearly a forgery.",
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
    titleFa: "پیامد تصمیم اول: کشف سم تاج‌الملوک در برابر اتلاف وقت",
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
          textEn: "The white powder around the rim is pure aconite. It paralyzes the heart within two minutes!",
          textFa: "پودر سفید دور لبه فنجان اقونیطون خالص (تاج‌الملوک) است. قلب را ظرف دو دقیقه فلج می‌کند!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Which means the killer poured it while the train crossed the bridge, less than half an hour ago!",
          textFa: "این یعنی قاتل آن را وقتی قطار از روی پل رد می‌شد ریخته است، کمتر از نیم ساعت پیش!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "پیامد ۱الف: اعتماد به واتسون و کشف سرنخ ۳۰ دقیقه‌ای",
        titleEn: "Consequence 1A: Mutual Trust & The 30-Minute Timeline",
        storyIntroFa: "با اعتماد شما، واتسون با آرامش آزمایش شیمیایی لبه فنجان را انجام می‌دهد. او متوجه می‌شود سم تاج‌الملوک تنها ۳۰ دقیقه پیش وارد فنجان شده است! این یعنی قاتل هنوز در همین واگن‌ها مخفی است و وقت فرار نداشته است. هلمز رد پای قطرات روغن قهوه را روی فرش قرمز راهرو می‌بیند که مستقیم به سمت واگن غذاخوری می‌رود.",
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
              textEn: "The coffee was served right after Watford Junction! The murderer is still inside this train!",
              textFa: "قهوه درست بعد از تقاطع واتفورد سرو شده است! قاتل هنوز داخل همین قطار است!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Look at the carpet, Watson! Dark brown droplets leading straight into the Dining Car!",
              textFa: "فرش را نگاه کن واتسون! قطرات قهوه قهوه‌ای‌رنگ مستقیماً به سمت واگن غذاخوری می‌رود!",
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
            taskInstructionFa: "بگو: «اگر سم این‌قدر سریع عمل کرده است، مظنون باید هنوز در قطار باشد.»",
            targetKeywords: [
              { phrase: "If the poison acted", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison acted", "if this poison acted", "if poison acted", "since the poison acted"], weight: 50 },
              { phrase: "must still be on board", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on board", "must be on board", "must still be on the train", "has to be on board"], weight: 50 },
            ],
            idealVoiceResponseEn: "If the poison acted so quickly, the suspect must still be on board.",
            alternativeResponsesEn: [
              { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
              { phraseEn: "If this poison killed him quickly, the suspect cannot have left the train.", translationFa: "اگر این سم سریع او را کشته، مظنون نمی‌تواند قطار را ترک کرده باشد." },
            ],
            whiteHintFa: "از جمله شرطی با If the poison acted so quickly و فعل وجهی must still be on board استفاده کن!",
            fallbackChoices: [
              "If the poison acted so quickly, the suspect must still be on board.",
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
        titleEn: "Consequence 1B: The Bitter Dispute & The Escaping Shadow",
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
              textEn: "You doubted me, Holmes! And while we argued, the real killer escaped with the Blue Folder!",
              textFa: "به من شک کردی هلمز! و در حالی که ما بحث می‌کردیم، قاتل واقعی با پوشه آبی فرار کرد!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه نگران",
              speakerAvatar: "🔍",
              textEn: "Forgive me, John. The pressure of Moriarty's game clouded my judgment. He ran towards the Dining Car!",
              textFa: "مرا ببخش جان. فشار بازی موریارتی قضاوتم را کدر کرد. او به سمت واگن غذاخوری دوید!",
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
            taskInstructionFa: "بگو: «اگر سم این‌قدر سریع عمل کرده است، مظنون باید هنوز در قطار باشد.»",
            targetKeywords: [
              { phrase: "If the poison acted", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison acted", "if this poison acted", "if poison acted", "since the poison acted"], weight: 50 },
              { phrase: "must still be on board", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on board", "must be on board", "must still be on the train", "has to be on board"], weight: 50 },
            ],
            idealVoiceResponseEn: "If the poison acted so quickly, the suspect must still be on board.",
            alternativeResponsesEn: [
              { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
              { phraseEn: "If this poison killed him quickly, the suspect cannot have left the train.", translationFa: "اگر این سم سریع او را کشته، مظنون نمی‌تواند قطار را ترک کرده باشد." },
            ],
            whiteHintFa: "از جمله شرطی با If the poison acted so quickly و فعل وجهی must still be on board استفاده کن!",
            fallbackChoices: [
              "If the poison acted so quickly, the suspect must still be on board.",
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
        taskInstructionFa: "بگو: «اگر سم این‌قدر سریع عمل کرده است، مظنون باید هنوز در قطار باشد.»",
        targetKeywords: [
          { phrase: "If the poison acted", hintFa: "(اگر سم اثر کرده است)", synonyms: ["if the poison acted", "if this poison acted", "if poison acted", "since the poison acted"], weight: 50 },
          { phrase: "must still be on board", hintFa: "(باید هنوز در قطار باشد)", synonyms: ["must still be on board", "must be on board", "must still be on the train", "has to be on board"], weight: 50 },
        ],
        idealVoiceResponseEn: "If the poison acted so quickly, the suspect must still be on board.",
        alternativeResponsesEn: [
          { phraseEn: "The killer must still be on the train because the poison is fresh.", translationFa: "قاتل باید هنوز در قطار باشد چون سم تازه است." },
          { phraseEn: "If this poison killed him quickly, the suspect cannot have left the train.", translationFa: "اگر این سم سریع او را کشته، مظنون نمی‌تواند قطار را ترک کرده باشد." },
        ],
        whiteHintFa: "از جمله شرطی با If the poison acted so quickly و فعل وجهی must still be on board استفاده کن!",
        fallbackChoices: [
          "If the poison acted so quickly, the suspect must still be on board.",
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
    titleEn: "The Dining Car: Bach's Sonata & The Encrypted Piano Key",
    locationFa: "واگن غذاخوری مجلل قطار کالدونیان بلو",
    locationEn: "Grand Dining Car, Caledonian Express",
    storyIntroFa: "وارد واگن غذاخوری می‌شوید. لوسترهای کریستالی بالای میزهای غذاخوری تاب می‌خورند. مسافران اشرافی با جام‌های نقره‌ای شام می‌خورند. در گوشه سالن، پیانیستی با دستکش سیاه قطعه‌ای غم‌انگیز از باخ می‌نوازد. شرلوک متوجه حرکت عجیب انگشتان پیانیست می‌شود: او به عمد از زدن شستی سل‌دیز (G-sharp) خودداری می‌کند! به محض نزدیک شدن شما، پیانیست نت موسیقی را رها کرده و از در پشتی واگن فرار می‌کند. شرلوک درب پیانو را برمی‌دارد...",
    cutscene: {
      titleFa: "کشف رمز مخفی زیر کلید پیانوی واگن غذاخوری",
      titleEn: "The Hidden Cipher Under the Piano Key",
      imageSrc: "/images/skills/speaking/b1_scene_4_dining_car_piano.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look under the G-sharp wooden hammer, Watson! A folded telegraph card with invisible ink!",
          textFa: "زیر چکش چوبی سل‌دیز را نگاه کن واتسون! یک کارت تلگراف تاشده با جوهر نامرئی!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "It has a coded phrase: 'The Rook moves to the Luggage Van at midnight'. That's where the Blue Folder is!",
          textFa: "عبارت رمزی دارد: «رخ در نیمه‌شب به واگن باربری می‌رود». پوشه آبی همان‌جاست!",
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
        taskInstructionFa: "به واتسون بگو: «به کلیدهای پیانو دقت کن، کسی یک رمز مخفی زیر آن پنهان کرده است.»",
        targetKeywords: [
          { phrase: "piano keys", hintFa: "(کلیدهای پیانو)", synonyms: ["piano keys", "the piano keys", "the piano", "these keys"], weight: 40 },
          { phrase: "hidden an encrypted cipher", hintFa: "(یک رمز مخفی پنهان کرده)", synonyms: ["hidden an encrypted cipher", "hidden a cipher", "hidden a secret code", "placed an encrypted cipher", "hidden a secret cipher"], weight: 60 },
        ],
        idealVoiceResponseEn: "Look closely at the piano keys, someone has hidden an encrypted cipher underneath.",
        alternativeResponsesEn: [
          { phraseEn: "Someone has hidden a secret code under the piano keys!", translationFa: "کسی یک کد مخفی زیر کلیدهای پیانو پنهان کرده است!" },
          { phraseEn: "Look at the piano Watson, an encrypted note must be here.", translationFa: "به پیانو نگاه کن واتسون، یک یادداشت رمزی باید این‌جا باشد." },
        ],
        whiteHintFa: "از فعل زمان حال کامل has hidden و ترکیب encrypted cipher استفاده کن!",
        fallbackChoices: [
          "Look closely at the piano keys, someone has hidden an encrypted cipher underneath.",
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
    titleEn: "DECISION 2: The Viaduct Crisis — Handbrake vs. MI6 Folder",
    locationFa: "واگن باربری و انبار چمدان‌ها، انتهای قطار کالدونیان",
    locationEn: "Luggage Van & Brake Compartment, Caledonian Express",
    storyIntroFa: "شما و واتسون با لگد درب واگن بار را باز می‌کنید. سرمای شدید از درز پنجره به داخل هجوم می‌آورد. بوی تند روغن ترمز سوخته به مشام می‌رسد: لوله‌های هیدرولیک ترمز قطار توسط سارق بریده شده‌اند! قطار با سرعت جنون‌آمیز به سمت پل دره‌ای مرتفع رود توید (Tweed Viaduct) شتاب می‌گیرد. در تاریکی انتهای واگن، مردی سیاه‌پوش با چمدان چرمی حاوی پوشه آبی به سمت واگن آخر می‌گریزد. ترمز دستی مکانیکی واگن بار تنها امید توقف قطار قبل از پیچ مرگبار پل است!",
    cutscene: {
      titleFa: "برش لوله‌های ترمز و خطر خروج قطار از ریل روی پل",
      titleEn: "Severed Brake Lines & Impending Disaster on the Viaduct",
      imageSrc: "/images/skills/speaking/b1_scene_5_luggage_van_brake.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی نگران",
          speakerAvatar: "🩺",
          textEn: "Holmes! Look at the pressure gauge! The brakes are severed and we are hitting the viaduct in two minutes!",
          textFa: "هلمز! به عقربه فشار نگاه کن! ترمزها قطع شده و تا دو دقیقه دیگر به پل می‌رسیم!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه در دوراهی مرگ و زندگی",
          speakerAvatar: "🔍",
          textEn: "The thief has the MI6 folder in his hands! But if nobody pulls that iron wheel, this entire train will plunge into the gorge!",
          textFa: "سارق پوشه MI6 را در دستانش دارد! اما اگر کسی آن چرخ آهنی ترمز را نکشد، کل این قطار به دره سقوط خواهد کرد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-2",
      promptFa: "یک تصمیم اخلاقی حیاتی: آیا جان صدها مسافر را نجات می‌دهید یا اسناد سری پادشاهی را تعقیب می‌کنید؟",
      promptEn: "Critical Choice: Pull the manual handbrake to save passengers, or chase the fleeing thief with the MI6 folder?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Pull the manual handbrake together to save passenger lives",
          labelFa: "گزینه ۲الف: اولویت نجات مسافران — کشیدن ترمز دستی مکانیکی با کمک واتسون",
          descriptionFa: "جان صدها انسان بی‌گناه را نجات می‌دهید، قطار مهار می‌شود اما سارق به واگن شیشه‌ای اختصاصی پناه می‌برد.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Chase the thief alone to secure the MI6 Blue Folder",
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
          { phrase: "pull the manual handbrake", hintFa: "(ترمز دستی را بکشیم)", synonyms: ["pull the manual handbrake", "pull the handbrake", "apply the handbrake", "pull the brake"], weight: 60 },
          { phrase: "before the train hits", hintFa: "(قبل از اینکه قطار برسد)", synonyms: ["before the train hits", "before the train reaches", "before we hit the viaduct", "before reaching the bridge"], weight: 40 },
        ],
        idealVoiceResponseEn: "We should pull the manual handbrake together before the train hits the viaduct!",
        alternativeResponsesEn: [
          { phraseEn: "If we pull the handbrake now, the train will stop before the bridge.", translationFa: "اگر الان ترمز دستی را بکشیم، قطار قبل از پل متوقف خواهد شد." },
          { phraseEn: "Help me pull this emergency brake before we hit the viaduct!", translationFa: "کمکم کن این ترمز اضطراری را بکشیم قبل از اینکه به پل دره‌ای برخورد کنیم!" },
        ],
        whiteHintFa: "از فعل کمکی We should pull و عبارت قبل از رسیدن به پل before the train hits the viaduct استفاده کن!",
        fallbackChoices: [
          "We should pull the manual handbrake together before the train hits the viaduct!",
          "I left my warm winter coat back in the first carriage.",
          "Look at the heavy snow falling outside the window.",
        ],
        aefReference: "AEF 3 Unit 4B (Should / Ought to for strong recommendations + Time clauses)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Put your weight on the iron wheel, Holmes! Together on three... ONE, TWO, PULL!",
          textFa: "وزنت را روی چرخ آهنی بینداز هلمز! با هم در شماره سه... یک، دو، بکش!",
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
    titleEn: "Consequence 2: Passengers Safe vs. The Locked Iron Door",
    locationFa: "واگن متصل‌کننده به سالن شیشه‌ای انتهای قطار",
    locationEn: "Observation Vestibule, Caledonian Express",
    storyIntroFa: "پیامد تصمیمی که در واگن بار گرفتید پدیدار می‌شود: یا با فداکاری جان صدها مسافر را بر فراز پل نجات داده‌اید، یا با تعقیب اسناد، قطار را در آستانه واژگونی قرار داده و با لرزش شدید فرصت را از دست داده‌اید!",
    cutscene: {
      titleFa: "جرقه‌های آتشین ترمز و در آهنی قفل‌شده",
      titleEn: "Screeching Brakes & The Sealed Iron Door",
      imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The steel brakes caught the rails! The viaduct is behind us, but the thief slammed the reinforced door!",
          textFa: "ترمزهای فولادی ریل را گرفتند! پل پشت سرمان است، اما سارق در تقویت‌شده را محکم بست!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Listen! A phonograph recording is playing from the observation lounge behind that door!",
          textFa: "گوش کن! صدای یک گرامافون از سالن شیشه‌ای پشت آن در به گوش می‌رسد!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: نجات مسافران و فرار سارق به سالن شیشه‌ای",
        titleEn: "Consequence 2A: The Heroic Brake & The Observation Trap",
        storyIntroFa: "با تمام قوا چرخ ترمز را می‌چرخانید. لنت‌های فلزی روی ریل سرخ می‌شوند و بوی دود و آهن فضا را پر می‌کند. قطار روی پل به سلامت سرعتش کم می‌شود و مسافران از وحشت رها می‌شوند! سارق با دیدن هلمز و واتسون، خودش را داخل سالن شیشه‌ای پایانی حبس می‌کند و اهرم قفل فولادی را می‌اندازد.",
        cutscene: {
          titleFa: "مهار قطار و سنگربندی سارق در سالن شیشه‌ای",
          titleEn: "Train Stabilized & The Barricaded Lounge",
          imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The train is safe Watson! Now we must breach that heavy door before Moriarty's trap activates!",
              textFa: "قطار در امان است واتسون! حالا باید قبل از فعال شدن تله موریارتی آن در سنگین را بشکنیم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه با تبر آتش‌نشانی",
              speakerAvatar: "🩺",
              textEn: "I have the emergency fire axe! Stand back Holmes, let me smash the lock!",
              textFa: "تبر آتش‌نشانی را آوردم! برو عقب هلمز، بگذار قفل را خرد کنم!",
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
            taskInstructionFa: "بگو: «گرچه سرعت قطار کم می‌شود، اما سارق در آهنی را قفل کرده است.»",
            targetKeywords: [
              { phrase: "Although the train", hintFa: "(اگرچه قطار)", synonyms: ["although the train", "even though the train", "while the train"], weight: 40 },
              { phrase: "locked the iron door", hintFa: "(در آهنی را قفل کرده است)", synonyms: ["locked the iron door", "locked the door", "barred the iron door", "locked this iron door"], weight: 60 },
            ],
            idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the iron door.",
            alternativeResponsesEn: [
              { phraseEn: "The train is safe now, but the thief has locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرده است." },
              { phraseEn: "Even though we stopped the catastrophe, the iron door is locked.", translationFa: "حتی با اینکه جلوی فاجعه را گرفتیم، در آهنی قفل است." },
            ],
            whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the iron door استفاده کن!",
            fallbackChoices: [
              "Although the train is slowing down, the thief has locked the iron door.",
              "This train has very comfortable first-class seats.",
              "We will arrive in Scotland early tomorrow morning.",
            ],
            aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "یار وفادار",
              speakerAvatar: "🩺",
              textEn: "One hard swing with this axe will break the latch!",
              textFa: "یک ضربه محکم با این تبر زبانه‌اش را می‌شکند!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "پیامد ۲ب: لرزش مرگبار قطار و افتادن شرلوک",
        titleEn: "Consequence 2B: Violent Drift on the Bridge",
        storyIntroFa: "شما ترمز را رها می‌کنید و به دنبال سارق می‌دوید. قطار روی پیچ دره با تکان‌های وحشتناک کج می‌شود. قفسه‌های بار می‌افتند و شرلوک روی زمین سر می‌خورد. سارق با خنده در آهنی را می‌بندد و قفل برقی آن را جوش می‌دهد. واتسون در آخرین ثانیه‌ها ترمز را با دردسر می‌کشد اما سرعت قطار هنوز بالاست!",
        cutscene: {
          titleFa: "کج شدن واگن‌ها روی پیچ دره و قفل شدن راهرو",
          titleEn: "Carriages Tilting & The Bolted Door",
          imageSrc: "/images/skills/speaking/b1_scene_6_viaduct_speed.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نفس‌نفس‌زنان",
              speakerAvatar: "🩺",
              textEn: "That was terrifying, Holmes! I barely engaged the brake alone! The passengers are in complete panic!",
              textFa: "وحشتناک بود هلمز! من به تنهایی به سختی ترمز را درگیر کردم! مسافران در وحشت کاملند!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه سرسخت",
              speakerAvatar: "🔍",
              textEn: "He bolted the door from inside. We have to breach it right now!",
              textFa: "او در را از داخل چفت کرد. باید همین الان آن را بشکنیم!",
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
            taskInstructionFa: "بگو: «گرچه سرعت قطار کم می‌شود، اما سارق در آهنی را قفل کرده است.»",
            targetKeywords: [
              { phrase: "Although the train", hintFa: "(اگرچه قطار)", synonyms: ["although the train", "even though the train", "while the train"], weight: 40 },
              { phrase: "locked the iron door", hintFa: "(در آهنی را قفل کرده است)", synonyms: ["locked the iron door", "locked the door", "barred the iron door", "locked this iron door"], weight: 60 },
            ],
            idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the iron door.",
            alternativeResponsesEn: [
              { phraseEn: "The train is safe now, but the thief has locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرده است." },
              { phraseEn: "Even though we stopped the catastrophe, the iron door is locked.", translationFa: "حتی با اینکه جلوی فاجعه را گرفتیم، در آهنی قفل است." },
            ],
            whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the iron door استفاده کن!",
            fallbackChoices: [
              "Although the train is slowing down, the thief has locked the iron door.",
              "This train has very comfortable first-class seats.",
              "We will arrive in Scotland early tomorrow morning.",
            ],
            aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let's breach this door before it's too late!",
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
        taskInstructionFa: "بگو: «گرچه سرعت قطار کم می‌شود، اما سارق در آهنی را قفل کرده است.»",
        targetKeywords: [
          { phrase: "Although the train", hintFa: "(اگرچه قطار)", synonyms: ["although the train", "even though the train", "while the train"], weight: 40 },
          { phrase: "locked the iron door", hintFa: "(در آهنی را قفل کرده است)", synonyms: ["locked the iron door", "locked the door", "barred the iron door", "locked this iron door"], weight: 60 },
        ],
        idealVoiceResponseEn: "Although the train is slowing down, the thief has locked the iron door.",
        alternativeResponsesEn: [
          { phraseEn: "The train is safe now, but the thief has locked the door.", translationFa: "قطار حالا در امان است، اما سارق در را قفل کرده است." },
          { phraseEn: "Even though we stopped the catastrophe, the iron door is locked.", translationFa: "حتی با اینکه جلوی فاجعه را گرفتیم، در آهنی قفل است." },
        ],
        whiteHintFa: "از حرف ربط تضاد Although the train is slowing down و عبارت the thief has locked the iron door استفاده کن!",
        fallbackChoices: [
          "Although the train is slowing down, the thief has locked the iron door.",
          "This train has very comfortable first-class seats.",
          "We will arrive in Scotland early tomorrow morning.",
        ],
        aefReference: "AEF 3 Unit 5A (Clauses of contrast: although / even though / in spite of)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار",
          speakerAvatar: "🩺",
          textEn: "One hard swing with this axe will break the latch!",
          textFa: "یک ضربه محکم با این تبر زبانه‌اش را می‌شکند!",
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
    titleFa: "تصمیم سوم: سالن شیشه‌ای — پادزهر گروگان یا فیوز سوزنبان؟",
    titleEn: "DECISION 3: The Glass Lounge — Antidote vs. Rail Switch Fuse",
    locationFa: "سالن تمام‌شیشه‌ای دیده‌بانی در انتهای قطار کالدونیان",
    locationEn: "Observation Glass Lounge, Caledonian Express",
    storyIntroFa: "در شکسته می‌شود و به سالن مجلل شیشه‌ای قدم می‌گذارید. شیشه‌های قوسی رو به منظره کوهستان برفی اسکاتلند است. صدای ضبط‌شده موریارتی از دستگاه گرامافون طلایی با خنده می‌پیچد: «خوش آمدید هلمز و دکتر عزیزم! به دوراهی شیشه‌ای من خوش آمدید!» در گوشه سالن، دیپلمات جوان همراه مقتول با دستبند به صندلی بسته شده و کپسول گاز سمی در حال باز شدن روی صورت اوست. در طرف دیگر، تابلوی الکتریکی سوزنبان با شمارش معکوس نشان می‌دهد که تا ۴۰ ثانیه دیگر ریل اصلی به پرتگاه مرگبار منحرف خواهد شد!",
    cutscene: {
      titleFa: "دیپلمات جوان مسموم و شمارش معکوس انحراف ریل",
      titleEn: "The Poisoned Hostage & The Rail Switchboard Countdown",
      imageSrc: "/images/skills/speaking/b1_scene_7_glass_observation_lounge.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور موریارتی",
          speakerRoleFa: "گرامافون سالن شیشه‌ای",
          speakerAvatar: "♟️",
          textEn: "A simple moral question, Sherlock: save this young junior diplomat with your antidote, or stop the electric switch from sending the train off the cliff?!",
          textFa: "یک معمای ساده اخلاقی شرلوک: نجات این دیپلمات جوان با پادزهر، یا جلوگیری از انحراف ریل و پرتاب قطار به پرتگاه؟! ",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک وظیفه‌شناس",
          speakerAvatar: "🩺",
          textEn: "His pulse is fading fast, Holmes! If we don't inject the atropine within thirty seconds, he will die!",
          textFa: "نبضش به سرعت ضعیف می‌شود هلمز! اگر ظرف ۳۰ ثانیه آتروپین تزریق نکنیم، خواهد مرد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-3",
      promptFa: "یک دوراهی تکان‌دهنده: آیا به دیپلمات جوان پادزهر تزریق می‌کنید یا فیوز الکتریکی سوزنبان را قطع می‌کنید؟",
      promptEn: "Critical Choice: Administer antidote to save the hostage diplomat, or cut the switchboard fuse to prevent derailment?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Administer antidote immediately to save the young diplomat",
          labelFa: "گزینه ۳الف: تزریق سریع پادزهر آتروپین به دیپلمات گروگان و نجات جان او",
          descriptionFa: "جان دیپلمات بی‌گناه را نجات می‌دهید؛ او به هوش می‌آید و رمز باز کردن درب سقف را به شما می‌گوید.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Smash the switchboard and cut the red fuse to stop rail derailment",
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
        speakerRoleFa: "شرلوک هلمز (جمله شرطی و مجهول will be)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر من فوراً فیوز قرمز را قطع کنم، سیگنال الکتریکی لغو خواهد شد.»",
        targetKeywords: [
          { phrase: "If I cut the red fuse", hintFa: "(اگر فیوز قرمز را قطع کنم)", synonyms: ["if i cut the red fuse", "if i cut the fuse", "if we cut the red fuse", "if i cut this red fuse"], weight: 60 },
          { phrase: "will be cancelled", hintFa: "(لغو خواهد شد)", synonyms: ["will be cancelled", "will be disabled", "will be stopped", "will be cut off"], weight: 40 },
        ],
        idealVoiceResponseEn: "If I cut the red fuse immediately, the electrical signal will be cancelled.",
        alternativeResponsesEn: [
          { phraseEn: "If we cut this red wire, the railway switch cannot trigger.", translationFa: "اگر این سیم قرمز را ببریم، سوزنبان راه‌آهن نمی‌تواند فعال شود." },
          { phraseEn: "I must cut the red fuse now to cancel the signal!", translationFa: "باید فیوز قرمز را الان قطع کنم تا سیگنال لغو شود!" },
        ],
        whiteHintFa: "از ساختار شرطی نوع اول با فعل cut و مجهول آینده will be cancelled استفاده کن!",
        fallbackChoices: [
          "If I cut the red fuse immediately, the electrical signal will be cancelled.",
          "The glass in this lounge is very thick and transparent.",
          "How far is the Scottish border from this location?",
        ],
        aefReference: "AEF 3 Unit 4A (First conditional + Passive voice intro)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look through the skylight, Holmes! The operative is climbing onto the roof with the Blue Folder!",
          textFa: "از دریچه سقف را نگاه کن هلمز! مأمور با پوشه آبی دارد روی سقف می‌رود!",
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
    storyIntroFa: "شما و واتسون از نردبان فلزی اضطراری به روی سقف قطار صعود می‌کنید. باد یخی با سرعت زوزه می‌کشد و دانه‌های برف مانند خنجر به صورتتان می‌کوبد. قطار در دل مه سیاه کوهستان‌های اسکاتلند پیش می‌رود. پنجاه متر جلوتر، مأمور بلندقامت موریارتی با چمدان چرمی آبی روی لبه لغزنده سقف پیش می‌رود تا با جدا کردن کوپلینگ لوکوموتیو، با موتور قطار به تنهایی بگریزد!",
    cutscene: {
      titleFa: "تعقیب دلهره‌آور روی سقف برفی قطار در حال حرکت",
      titleEn: "The High-Stakes Pursuit on the Icy Train Carriages",
      imageSrc: "/images/skills/speaking/b1_scene_8_blizzard_train_roof.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در کولاک",
          speakerAvatar: "🩺",
          textEn: "Hold on to the chimney vents, Holmes! The gale is blowing us toward the edge!",
          textFa: "هواکش‌ها را محکم بگیر هلمز! تندباد ما را به سمت لبه پرتگاه می‌برد!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "He is reaching for the locomotive ladder! If he uncouples the engine, he takes the Blue Folder into the mountains!",
          textFa: "او دارد به نردبان لوکوموتیو می‌رسد! اگر کوپلینگ موتور را باز کند، پوشه آبی را با خود به کوهستان می‌برد!",
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
        taskInstructionFa: "به واتسون هشدار بده: «روی سقف یخی مراقب باش، او ممکن است روی لوکوموتیو بپرد!»",
        targetKeywords: [
          { phrase: "Be careful on the icy roof", hintFa: "(روی سقف یخی مراقب باش)", synonyms: ["be careful on the icy roof", "be careful on this roof", "watch your step on the roof", "careful on the icy roof"], weight: 50 },
          { phrase: "might jump", hintFa: "(ممکن است بپرد)", synonyms: ["might jump", "could jump", "may jump onto", "might leap"], weight: 50 },
        ],
        idealVoiceResponseEn: "Be careful on the icy roof, he might jump onto the front locomotive!",
        alternativeResponsesEn: [
          { phraseEn: "Watch your footing Watson, the thief could jump onto the engine!", translationFa: "مواظب جای پایت باش واتسون، سارق ممکن است روی لوکوموتیو بپرد!" },
          { phraseEn: "Stay low on the roof because the suspect might jump ahead!", translationFa: "روی سقف خم شو چون مظنون ممکن است به جلو بپرد!" },
        ],
        whiteHintFa: "از عبارت Be careful on the icy roof و فعل وجهی احتمال he might jump استفاده کن!",
        fallbackChoices: [
          "Be careful on the icy roof, he might jump onto the front locomotive!",
          "The Scottish mountains look very majestic in winter.",
          "I wonder what time the sun will rise tomorrow morning.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of possibility: might / could + Adjectives of condition)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار شجاع",
          speakerAvatar: "🩺",
          textEn: "I have his shoulder in my sights! Jump with me Holmes, down into the engine cab!",
          textFa: "شانه‌اش در دید من است! با من بپر هلمز، به داخل کابین موتور لوکوموتیو!",
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
    storyIntroFa: "شما و واتسون به داخل کابین لوکوموتیو سقوط می‌کنید. لوکوموتیوران بیهوش روی زمین افتاده و مأمور موریارتی با دیدن شما، چمدان آبی را روی کوره گداخته می‌گذارد و اهرم اصلی گاز را از جا می‌شکند! کوره سرخ با حداکثر توان زغال‌سنگ می‌سوزد و عقربه فشار بخار در حال انفجار است! تا ۳۰ ثانیه دیگر خط آهن به دو راهی می‌رسد: سمت راست به سمت دپوی برفی قدیمی ایستگاه کوهستانی کاریان می‌رود (تپه‌های برف نرم قطار را بدون مرگ مسافران مهار می‌کند اما لوکوموتیو متلاشی می‌شود)؛ سمت چپ پلی در حال تعمیر روی رودخانه یخ‌زده که برای عبور واگن‌ها مناسب نیست!",
    cutscene: {
      titleFa: "شکستن اهرم گاز و دوراهی سوزنبان دپوی برف",
      titleEn: "Jammed Throttle & The Mountain Snow Siding Dilemma",
      imageSrc: "/images/skills/speaking/b1_scene_9_locomotive_snow_switch.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The throttle is smashed! The boiler will burst unless we divert the train into the snow depot!",
          textFa: "اهرم گاز شکسته است! دیگ بخار منفجر خواهد شد مگر اینکه قطار را به دپوی برفی منحرف کنیم!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه کنار اهرم‌ها",
          speakerAvatar: "🩺",
          textEn: "There is the mechanical switch lever on the right! Holmes, give the word: do we switch to the snow, or decouple the passenger cars?!",
          textFa: "آن اهرم مکانیکی سوزنبان در سمت راست است! هلمز، دستور بده: به سمت برف تغییر مسیر دهیم یا واگن‌های مسافران را رها کنیم؟! ",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b1-4",
      promptFa: "آخرین تصمیم سرنوشت‌ساز B1: آیا قطار را به دپوی برفی هدایت می‌کنید یا واگن‌ها را رها می‌سازید؟",
      promptEn: "Final Critical Choice: Switch rails to the mountain snow depot, or decouple passenger carriages?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Switch the track lever to the mountain snow depot buffer",
          labelFa: "گزینه الف: تغییر اهرم سوزنبان به سمت دپوی برف برای توقف امن در کوهستان",
          descriptionFa: "قطار به کوهستان برف نرم هدایت می‌شود؛ برخورد مهار می‌شود، تمام مسافران سالم می‌مانند و پوشه آبی از آتش نجات می‌یابد.",
          pointsDelta: 150,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Decouple the passenger carriages and let the locomotive crash",
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
        taskInstructionFa: "فریاد بزن: «اهرم ریل را به سمت دپوی برف بچرخان تا قطار با امنیت متوقف شود!»",
        targetKeywords: [
          { phrase: "Switch the track lever", hintFa: "(اهرم ریل را بچرخان)", synonyms: ["switch the track lever", "switch the lever", "pull the track lever", "turn the switch lever", "pull the lever"], weight: 50 },
          { phrase: "stops safely", hintFa: "(با امنیت متوقف شود)", synonyms: ["stops safely", "can stop safely", "will stop safely", "is stopped safely"], weight: 50 },
        ],
        idealVoiceResponseEn: "Switch the track lever to the snow depot so that the train stops safely!",
        alternativeResponsesEn: [
          { phraseEn: "Pull the track lever to the snow siding so the train will stop safely!", translationFa: "اهرم ریل را به سمت خط برفی بکش تا قطار به سلامت متوقف شود!" },
          { phraseEn: "Switch the rails to the snow bank before we hit the gorge!", translationFa: "ریل‌ها را قبل از اینکه به دره برسیم به سمت دیواره برف تغییر بده!" },
        ],
        whiteHintFa: "از فعل امری Switch the track lever و قید هدف so that the train stops safely استفاده کن!",
        fallbackChoices: [
          "Switch the track lever to the snow depot so that the train stops safely!",
          "I think we missed our station stop in Newcastle.",
          "Steam engines require a great deal of clean water.",
        ],
        aefReference: "AEF 3 Unit 6B (Clauses of purpose: so that + Modal verbs)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "The lever is thrown! Bracing for impact into the snow bank... BRACE!",
          textFa: "اهرم کشیده شد! آماده برخورد با تپه برف... محکم بگیرید!",
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
          textEn: "Look at the seal, John! Folder Number One of MI6 is safely recovered! The British defense network is saved!",
          textFa: "مهر را نگاه کن جان! پوشه شماره یک MI6 در سلامت کامل بازیابی شد! شبکه دفاعی بریتانیا نجات یافت!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک سرافراز",
          speakerAvatar: "🩺",
          textEn: "And inside, an official document proving my signature was stolen from army files five years ago! My name is cleared!",
          textFa: "و داخل آن، سندی رسمی که ثابت می‌کند امضای من ۵ سال پیش از پرونده‌های ارتش به سرقت رفته بود! نام من پاک شد!",
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
        speakerRoleFa: "شرلوک هلمز (استنتاج آینده با must be)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «این سکه برنزی نشانه پرونده بعدی ما در باتلاق‌های دارتمور است!»",
        targetKeywords: [
          { phrase: "bronze coin", hintFa: "(سکه برنزی)", synonyms: ["bronze coin", "this bronze coin", "the coin", "ancient bronze coin"], weight: 50 },
          { phrase: "our next case in Dartmoor", hintFa: "(پرونده بعدی ما در دارتمور)", synonyms: ["our next case in dartmoor", "next case in dartmoor", "next mystery in dartmoor", "case in dartmoor"], weight: 50 },
        ],
        idealVoiceResponseEn: "This bronze coin must be the sign of our next case in Dartmoor!",
        alternativeResponsesEn: [
          { phraseEn: "Look at this hound coin, Watson, our next investigation will be in Dartmoor!", translationFa: "به این سکه سگ شکاری نگاه کن واتسون، تحقیقات بعدی ما در دارتمور خواهد بود!" },
          { phraseEn: "This bronze coin proves that Moriarty is leading us to the moors.", translationFa: "این سکه برنزی ثابت می‌کند موریارتی ما را به سمت باتلاق‌ها هدایت می‌کند." },
        ],
        whiteHintFa: "از فعل وجهی استنتاج must be و کلمات bronze coin و our next case in Dartmoor استفاده کن!",
        fallbackChoices: [
          "This bronze coin must be the sign of our next case in Dartmoor!",
          "Let us board the return train to London right now.",
          "I think Edinburgh is very cold during this season.",
        ],
        aefReference: "AEF 3 Unit 3B (Modals of deduction + Prepositions of place)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "یار وفادار",
          speakerAvatar: "🩺",
          textEn: "Dartmoor... the land of the howling hounds! The game is far from over, Holmes!",
          textFa: "دارتمور... سرزمین سگ‌های زوزه‌کش! بازی هنوز تمام نشده هلمز!",
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
        climaxStoryEn: "The locomotive halts safely in the snow depot buffer. Passengers cheer and embrace on the platform. The stolen MI6 Blue Folder is recovered completely intact, and official proof exonerates Dr. Watson of the 5-year-old forgery. The brotherhood between Holmes and Watson is unbreakable!",
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
        revealDialogueEn: "THE BIG PLOT TWIST: Inside the Blue Folder lies the classified map of Dartmoor Chemical Base, and a heavy ancient bronze coin depicting a snarling hound—The Hound Coin [B2]! Moriarty's letter mocks: 'The Blue Train was just a warm-up. The true hunt begins in the moors of Baskerville... until you hear the hound howl.' Holmes and Watson prepare for Level B2 in Dartmoor.",
        nextTierHintFa: "پرونده سطح B1 (The Blue Train) با پیروزی درخشان شما و اثبات بی‌گناهی دکتر واتسون بسته شد! با کشف «سکه هاوند [B2]»، در سطح B2 شما و واتسون به باتلاق‌های مه‌آلود باسکرویل در دارتمور سفر خواهید کرد تا از سرقت دومین پوشه محرمانه MI6 جلوگیری کنید!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان تلخ: نجات مسافران اما سوختن بخشی از اسناد در دره",
        titleEn: "ENDING 2: BITTERSWEET — Train Saved, Folder Lost in the Gorge",
        badgeTitleFa: "⚠️ پرونده نیمه‌تمام: نجات جان مسافران و فرار مأمور موریارتی",
        imageSrc: "/images/skills/speaking/b1_scene_case_failed.jpg",
        climaxStoryFa: "قطار از فاجعه نجات می‌یابد و مسافران در امنیت کامل تخلیه می‌شوند. اما در جریان ترمز اضطراری و تعقیب‌های دیرهنگام، چمدان چرمی به دره سقوط کرده و نیمی از برگه‌های پوشه آبی در رودخانه یخ‌زده از بین می‌رود. موریارتی برتری اطلاعاتی را حفظ می‌کند اگرچه پاک شدن نام دکتر واتسون قطعی می‌شود.",
        climaxStoryEn: "The passengers are saved, but the Blue Folder was lost in the icy gorge during the delayed pursuit. Moriarty retains key intelligence, though Watson's integrity remains fully intact.",
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
