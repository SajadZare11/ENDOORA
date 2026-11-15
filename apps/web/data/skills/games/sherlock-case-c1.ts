import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR C1 CASE: "CASE FILE #05: THE CROWN LEDGER & THE BUCKINGHAM MASQUERADE"
// Official CEFR C1 Vocabulary & Grammar (American English File 5 - Advanced):
// - Advanced Inversion for Dramatic Emphasis: Seldom have we..., Scarcely had we..., Under no circumstances...
// - Advanced Cleft Sentences: It was not merely the royal reputation..., What concerns me most is that...
// - Advanced Subjunctive & Hypothetical Conditionals: Were Lord Pemberton aware..., Had we hesitated...
// - Participle Clauses & Discourse Markers: Having silenced the archivist..., In light of the evidence...
// - Sophisticated Imperial, Espionage, High-Treason & Horological Lexicon
// ============================================================================

export const C1_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: Arrival at Buckingham Masquerade & The Golden Note
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "C1",
    titleFa: "دفترچه تاج: ورود به بالماسکه باکینگهام و پیامی با جوهر طلا",
    titleEn: "The Crown Ledger: The Buckingham Masquerade & The Golden Note",
    locationFa: "سرسرای مرمرین کاخ باکینگهام، باران پاییزی بیرون و موسیقی مجلل دربار",
    locationEn: "Grand Marble Vestibule, Buckingham Palace, London",
    storyIntroFa: "ساعت ۱۰:۱۵ شب است و باران پاییزی شیشه‌های بلند کاخ سلطنتی باکینگهام را خیس کرده است. پس از مهار شورش زندان دارتمور، سرنخ برگه زرکوب به‌جامانده در استوانه نقره‌ای استرلینگ شما و دکتر واتسون را به ضیافت بالماسکه سالانه دربار کشانده است. صدها نجیب‌زاده، سفیر خارجی و درباری با نقاب‌های نقره‌ای زیر چلچراغ‌ها در حال رقص والس هستند. در کمد مخفی پیشخدمت‌ها، پیکر بی‌هوش سرپیشخدمت دربار به همراه یادداشتی با جوهر طلا کشف می‌شود: «راس ساعت ۱۲:۰۰، تاج سقوط خواهد کرد.»",
    cutscene: {
      titleFa: "ورود به بالماسکه باکینگهام با نقاب و کشف پیام با جوهر طلایی",
      titleEn: "Arrival at the Buckingham Masquerade & The Golden Coded Note",
      imageSrc: "/images/skills/speaking/c1_scene_1_masquerade_arrival.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور در نقاب ابریشمی",
          speakerAvatar: "🔍",
          textEn: "Observe the subtle tension beneath the festive masks, Watson. Moriarty's agents have breached the state apartments!",
          textFa: "تنش پنهان پشت این نقاب‌های پر زرق‌وبرق را ببین واتسون. رد گوگرد ثابت می‌کند عمال موریارتی وارد آپارتمان‌های دولتی کاخ شده‌اند!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در لباس رسمی دربار",
          speakerAvatar: "🩺",
          textEn: "The coded message threatens the monarchy itself! If the third folder leaks, the government will fall!",
          textFa: "پیام رمزی در جیب پیشخدمت خود نظام سلطنت را تهدید می‌کند! اگر پوشه شماره ۳ درز کند، دولت سقوط خواهد کرد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-1-cleft-sentence-realm",
        titleFa: "استنتاج راهبردی با جمله شکافته تأکیدی (Cleft Sentence)",
        speakerPromptEn: "Adjust your domino mask and assess the high-stakes royal crisis.",
        speakerPromptFa: "نقاب خود را مرتب می‌کنی و بحران حساس دربار را با یک جمله تأکیدی بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته It is not merely)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «امشب صرفاً آبروی دربار در خطر نیست، بلکه ثبات کل کشور تهدید می‌شود.»",
        targetKeywords: [
          { phrase: "royal reputation at stake", hintFa: "(آبروی دربار در خطر است)", synonyms: ["royal reputation at stake", "reputation at stake", "royal reputation"], weight: 50 },
          { phrase: "stability of the nation", hintFa: "(ثبات و پایداری کشور)", synonyms: ["stability of the nation", "stability of the whole nation", "stability of the entire nation", "stability of the realm"], weight: 50 },
        ],
        idealVoiceResponseEn: "It is not merely the royal reputation at stake, but the stability of the entire nation.",
        alternativeResponsesEn: [
          { phraseEn: "What hangs in the balance tonight is not only the Crown's dignity, but national stability.", translationFa: "آنچه امشب در خطر است نه تنها شأن دربار، بلکه ثبات ملی است." },
          { phraseEn: "It is not simply royal honor in jeopardy, but the very stability of our nation.", translationFa: "صرفاً آبروی سلطنت در خطر نیست، بلکه ثبات خود کشورمان است." },
        ],
        whiteHintFa: "از ساختار شکافته تأکیدی It is not merely... but... برای بیان اهمیت فوق‌العاده وضعیت استفاده کن!",
        fallbackChoices: [
          "It is not merely the royal reputation at stake, but the stability of the entire nation.",
          "The chandeliers in this ballroom are illuminated with high-pressure gas jets.",
          "The string quartet is currently playing a classical Viennese waltz.",
        ],
        aefReference: "AEF 5 Unit 1A (Cleft sentences with It is not merely... but...)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look at the balcony, Holmes! Lord Pemberton is whispering to an unidentified masked courtier!",
          textFa: "به بالکن نگاه کن هلمز! لرد پمبرتون در حال پچ‌پچ کردن با یک درباری نقاب‌دار ناشناس است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: DECISION 1 — The Grand Ballroom & The Gilded Falcon Circle
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "C1",
    titleFa: "تصمیم اول: تالار رقص سلطنتی و حلقه لردها",
    titleEn: "DECISION 1: The Grand Ballroom & The Gilded Falcon Circle",
    locationFa: "تالار رقص عظیم کاخ با چلچراغ‌های طلا و آینه‌های قدی",
    locationEn: "The Grand Ballroom & Gilded Mirrors, Buckingham Palace",
    storyIntroFa: "شما و واتسون در میان جمعیت رقصندگان نفوذ می‌کنید. شرلوک سه مظنون اصلی با نقاب شاهین طلایی را زیر نظر دارد. لرد پمبرتون، مشاور امور مالی دربار و معتمد پیشین ملکه، با دستی لرزان در گوشه سالن جام خود را می‌نوشد و نگاه هراسانش مدام به عقربه‌های ساعت برنزی سالن دوخته شده است. در همین لحظه، کاپیتان هاوارد زمزمه می‌کند که خطوط محرمانه تلگراف در طبقه دوم سیگنال‌های مشکوکی به بیرون ارسال می‌کنند.",
    cutscene: {
      titleFa: "لرد پمبرتون در محاصره رقصندگان و تلگراف مشکوک طبقه بالا",
      titleEn: "Lord Pemberton Amid the Dancers & The Rogue Telegraph",
      imageSrc: "/images/skills/speaking/c1_scene_2_ballroom_dilemma.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Lord Pemberton is terrified. He keeps glancing at the clock on the ballroom wall.",
          textFa: "لرد پمبرتون به شدت وحشت‌زده است. او مدام به ساعت دیواری تالار رقص چشم دوخته است.",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Captain Howard reports rogue telegraph signals from the private royal apartments upstairs!",
          textFa: "کاپیتان هاوارد سیگنال‌های مشکوک تلگراف را از آپارتمان‌های سلطنتی طبقه بالا گزارش می‌دهد!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-1",
      promptFa: "تصمیم اول: آیا فوراً لرد پمبرتون را در پیست رقص استنطاق می‌کنید یا به سمت دستگاه تلگراف مشکوک طبقه بالا می‌شتابید؟",
      promptEn: "Decision 1: Interrogate Lord Pemberton on the dance floor or intercept the rogue telegraph transmitter upstairs?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Interrogate Lord Pemberton discreetly amidst the masked waltz",
          labelFa: "گزینه ۱الف: استنطاق بی‌سر و صدای لرد پمبرتون در میانه رقص بالماسکه",
          descriptionFa: "پیش از فرار پمبرتون، کلید گاوصندوق سلطنتی و رمز مکاتبات را مستقیماً از جیبش خارج می‌کنید.",
          pointsDelta: 250,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Rush upstairs to sever the rogue telegraph wires transmitting secrets",
          labelFa: "گزینه ۱ب: شتاب به سوی اتاق تلگراف طبقه دوم و قطع سیم‌های انتقال داده",
          descriptionFa: "ارسال کدهای محرمانه به شبکه‌های جاسوسی را قطع می‌کنید، اما پمبرتون به سمت بایگانی می‌گریزد.",
          pointsDelta: 200,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-2-inversion-adversary",
        titleFa: "تحلیل راهبردی نفوذ دشمن با ساختار معکوس (Inversion)",
        speakerPromptEn: "Analyze Moriarty's bold infiltration beneath the Crown's direct gaze.",
        speakerPromptFa: "نفوذ جسورانه موریارتی در قلب دربار را با ساختار معکوس تحلیل می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (ساختار معکوس Seldom have we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «به ندرت با دشمنی روبرو شده‌ایم که بتواند چنین نقشه‌ای را درست در کاخ اجرا کند.»",
        targetKeywords: [
          { phrase: "Seldom have we faced", hintFa: "(به ندرت با... روبرو شده‌ایم)", synonyms: ["seldom have we faced", "rarely have we faced", "seldom have we encountered"], weight: 50 },
          { phrase: "orchestrating such daring treason", hintFa: "(طراحی چنین خیانت جسورانه‌ای)", synonyms: ["orchestrating such daring treason", "planning such treason", "orchestrating such treason"], weight: 50 },
        ],
        idealVoiceResponseEn: "Seldom have we faced an enemy capable of orchestrating such daring treason inside the palace.",
        alternativeResponsesEn: [
          { phraseEn: "Rarely have we encountered a mastermind bold enough to challenge the Crown so openly.", translationFa: "به ندرت با نابغه‌ای روبرو شده‌ایم که این‌قدر جسورانه دربار را به چالش بکشد." },
          { phraseEn: "Seldom has any criminal managed to penetrate the royal court with such calculated precision.", translationFa: "به ندرت مجرمی توانسته با چنین دقت سنجیده‌ای به دربار سلطنتی نفوذ کند." },
        ],
        whiteHintFa: "از ساختار معکوس Seldom have we... برای تأکید کلامی سطح C1 استفاده کن!",
        fallbackChoices: [
          "Seldom have we faced an enemy capable of orchestrating such daring treason inside the palace.",
          "The gold embroidery on these masks must have cost several hundred pounds.",
          "I wonder whether the Prime Minister has already departed for Downing Street.",
        ],
        aefReference: "AEF 5 Unit 2B (Inversion with Seldom / Rarely for dramatic emphasis)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Which route shall we take, Holmes? The frightened lord or the rogue transmitter?",
          textFa: "کدام مسیر را برویم هلمز؟ لرد هراسان یا فرستنده مشکوک تلگراف؟",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Aftermath of Decision 1 — Quiet Surrender or Imperial Alert
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "C1",
    titleFa: "پیامد تصمیم اول: تسلیم بی‌صدا یا اعلام هشدار سلطنتی",
    titleEn: "Stage 3: Aftermath of Decision 1 — Quiet Surrender or Imperial Alert",
    locationFa: "راهروی اختصاصی شاه‌نشین، پشت پرده‌های ابریشمی سرخ",
    locationEn: "Royal Wing Corridor & Gilded Archway, Buckingham Palace",
    storyIntroFa: "پیامد انتخاب شما رقم می‌خورد: در صورتی که پمبرتون را استنطاق کرده باشید، او پیش از فرار خلع سلاح شده و کلید نقره‌ای گاوصندوق را تسلیم می‌کند؛ و اگر به سراغ تلگراف رفته باشید، فرستنده جاسوسی را خرد کرده‌اید اما هشدار امنیتی کاخ به صدا درآمده است.",
    cutscene: {
      titleFa: "پیامد انتخاب: تسلیم پمبرتون یا قطع کدهای تلگراف",
      titleEn: "Branch Outcome: Pemberton Cornered or Wires Severed",
      imageSrc: "/images/skills/speaking/c1_scene_3_aftermath_pemberton.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Pemberton dropped his silver key, Holmes! He whispered that the vault is already breached!",
          textFa: "پمبرتون کلید نقره‌ای‌اش را انداخت هلمز! او زمزمه کرد که گاوصندوق شکسته شده است!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Then the archivist is in grave peril. We must secure the Queen's private vault at once!",
          textFa: "پس بایگان در خطری مهلک قرار دارد. باید بی‌درنگ گاوصندوق اختصاصی ملکه را ایمن کنیم!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "شاخه ۱الف: اعتراف در سکوت لرد پمبرتون و کلید نقره‌ای گاوصندوق",
        titleEn: "Branch 1A: Pemberton's Silent Confession & Silver Vault Key",
        storyIntroFa: "شما پمبرتون را در حین والس گوشه‌گیر کردید. او با چهره‌ای رنگ‌پریده اعتراف کرد موریارتی خانواده‌اش را گروگان گرفته است و کلید دسترسی به گاوصندوق آرشیو ملکه را به شما سپرد.",
        cutscene: {
          titleFa: "اعتراف پمبرتون و کلید نقره‌ای آرشیو",
          titleEn: "Pemberton's Trembling Confession",
          imageSrc: "/images/skills/speaking/c1_scene_3a_pemberton_key.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Hand over the silver cipher key, Lord Pemberton, or face charges of high treason!",
              textFa: "کلید رمز نقره‌ای را تحویل بدهید لرد پمبرتون، یا با اتهام خیانت بزرگ ملی روبرو شوید!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "He yielded the key! The Queen's private archive is down the northern gallery!",
              textFa: "او کلید را تسلیم کرد! آرشیو محرمانه ملکه در انتهای گالری شمالی است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-3-subjunctive-pemberton",
            titleFa: "استنطاق قاطع با ساختار شرطی التزامی (Subjunctive Inversion)",
            speakerPromptEn: "Demand full compliance regarding the stolen cipher code.",
            speakerPromptFa: "درباره کد رمز سرقت‌شده، از لرد پمبرتون شفاف‌سازی قاطع می‌خواهی.",
            speakerRoleFa: "شرلوک هلمز (شرطی التزامی Were he aware)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به واتسون بگو: «اگر لرد پمبرتون عواقب خیانتش را می‌دانست، بی‌درنگ رمز را تحویل می‌داد.»",
            targetKeywords: [
              { phrase: "Were Lord Pemberton aware", hintFa: "(اگر لرد پمبرتون آگاه بود)", synonyms: ["were lord pemberton aware", "had lord pemberton known", "if lord pemberton were aware"], weight: 50 },
              { phrase: "surrender the master cipher", hintFa: "(تحویل دادن کد رمز اصلی)", synonyms: ["surrender the master cipher", "give up the cipher", "hand over the cipher"], weight: 50 },
            ],
            idealVoiceResponseEn: "Were Lord Pemberton aware of the consequences, he would surrender the master cipher immediately.",
            alternativeResponsesEn: [
              { phraseEn: "Had he recognized the gravity of his actions, he would have surrendered the cipher already.", translationFa: "اگر وخامت اعمالش را درک کرده بود، تا الان رمز را تحویل داده بود." },
              { phraseEn: "Were he truly repentant, he would give us the encryption key without further hesitation.", translationFa: "اگر واقعاً پشیمان بود، کلید رمزگذاری را بدون درنگ به ما می‌داد." },
            ],
            whiteHintFa: "از فرم شرطی پیشرفته با Inversion (Were he aware... he would...) استفاده کن!",
            fallbackChoices: [
              "Were Lord Pemberton aware of the consequences, he would surrender the master cipher immediately.",
              "The silk curtains in this royal corridor are imported from Florence.",
              "I should have inspected the library index earlier this morning.",
            ],
            aefReference: "AEF 5 Unit 3A (Inverted conditionals: Were + subject + to / adjective)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The cipher points to the Queen's Archival Gallery! We must move quickly!",
              textFa: "رمز به گالری اسناد محرمانه ملکه اشاره دارد! باید سریع حرکت کنیم!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "شاخه ۱ب: قطع فرستنده تلگراف و گارد در حالت آماده‌باش",
        titleEn: "Branch 1B: Telegraph Transmitter Smashed & Palace on Alert",
        storyIntroFa: "به اتاق تلگراف حمله کردید و کابل‌های مسی را قطع نمودید. جاسوس موریارتی از پنجره به باغ پرید. ارسال اطلاعات خنثی شد، اما گارد دربار سراسیمه شده است.",
        cutscene: {
          titleFa: "کابل‌های قطع‌شده و آژیر پنهان دربار",
          titleEn: "Severed Telegraph Wires",
          imageSrc: "/images/skills/speaking/c1_scene_3b_telegraph_smash.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The transmitter is disabled! No diplomatic secrets will leave this palace tonight!",
              textFa: "فرستنده از کار افتاد! امشب هیچ راز دیپلماتیکی از این کاخ خارج نخواهد شد!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The palace guard is alerted! We must reach the archival vault before the conspirator strikes!",
              textFa: "گارد کاخ به حالت آماده‌باش درآمد! باید قبل از حمله توطئه‌گر به گاوصندوق برسیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-3-conditional-telegraph",
            titleFa: "تحلیل راهبردی با شرطی ترکیبی درباره امنیت دربار",
            speakerPromptEn: "Assess the operational trade-off of having raided the telegraph room first.",
            speakerPromptFa: "هزینه-فایده عملیاتی یورش به اتاق تلگراف را به زبان ساختارمند تحلیل می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (شرطی نوع سوم Had we interrogated)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «اگر نفوذی را در سکوت استنطاق می‌کردیم، تدابیر امنیتی کاخ کاملاً دست‌نخورده باقی می‌ماند.»",
            targetKeywords: [
              { phrase: "Had we interrogated the conspirator", hintFa: "(اگر توطئه‌گر را بازجویی می‌کردیم)", synonyms: ["had we interrogated the conspirator", "if we had interrogated the suspect", "had we questioned the conspirator"], weight: 50 },
              { phrase: "security perimeter would have remained", hintFa: "(حلقه امنیتی باقی می‌ماند)", synonyms: ["security perimeter would have remained", "palace security would have remained", "perimeter would have stayed"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we interrogated the conspirator quietly, the security perimeter would have remained entirely undisturbed.",
            alternativeResponsesEn: [
              { phraseEn: "If we had apprehended the traitor on the dance floor, the guards wouldn't be panicking now.", translationFa: "اگر خائن را در پیست رقص دستگیر می‌کردیم، گارد کاخ اکنون دستپاچه نمی‌شد." },
              { phraseEn: "Had we cornered Pemberton first, our tactical advantage would have been preserved completely.", translationFa: "اگر ابتدا پمبرتون را به دام می‌انداختیم، برتری تاکتیکی ما کاملاً حفظ می‌شد." },
            ],
            whiteHintFa: "از ساختار شرطی سوم بدون if با فرم Had we interrogated... استفاده کن!",
            fallbackChoices: [
              "Had we interrogated the conspirator quietly, the security perimeter would have remained entirely undisturbed.",
              "The high-voltage battery cells powering the telegraph emit a faint ozone odor.",
              "I should like to inspect the royal wine cellar before the banquet concludes.",
            ],
            aefReference: "AEF 5 Unit 3A (Inversion in third conditional clauses)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let us make haste, Holmes! The archivist may already be fighting for his life!",
              textFa: "بیا عجله کنیم هلمز! شاید بایگان هم‌اکنون برای زنده ماندن می‌جنگد!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-3-default-fallback",
        titleFa: "استنطاق قاطع با ساختار شرطی التزامی (Subjunctive Inversion)",
        speakerPromptEn: "Demand full compliance regarding the stolen cipher code.",
        speakerPromptFa: "درباره کد رمز سرقت‌شده، از لرد پمبرتون شفاف‌سازی قاطع می‌خواهی.",
        speakerRoleFa: "شرلوک هلمز (شرطی التزامی Were he aware)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «اگر لرد پمبرتون عواقب خیانتش را می‌دانست، بی‌درنگ رمز را تحویل می‌داد.»",
        targetKeywords: [
          { phrase: "Were Lord Pemberton aware", hintFa: "(اگر لرد پمبرتون آگاه بود)", synonyms: ["were lord pemberton aware", "had lord pemberton known", "if lord pemberton were aware"], weight: 50 },
          { phrase: "surrender the master cipher", hintFa: "(تحویل دادن کد رمز اصلی)", synonyms: ["surrender the master cipher", "give up the cipher", "hand over the cipher"], weight: 50 },
        ],
        idealVoiceResponseEn: "Were Lord Pemberton aware of the consequences, he would surrender the master cipher immediately.",
        alternativeResponsesEn: [
          { phraseEn: "Had he recognized the gravity of his actions, he would have surrendered the cipher already.", translationFa: "اگر وخامت اعمالش را درک کرده بود، تا الان رمز را تحویل داده بود." },
          { phraseEn: "Were he truly repentant, he would give us the encryption key without further hesitation.", translationFa: "اگر واقعاً پشیمان بود، کلید رمزگذاری را بدون درنگ به ما می‌داد." },
        ],
        whiteHintFa: "از فرم شرطی پیشرفته با Inversion (Were he aware... he would...) استفاده کن!",
        fallbackChoices: [
          "Were Lord Pemberton aware of the consequences, he would surrender the master cipher immediately.",
          "The silk curtains in this royal corridor are imported from Florence.",
          "I should have inspected the library index earlier this morning.",
        ],
        aefReference: "AEF 5 Unit 3A (Inverted conditionals: Were + subject + to / adjective)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The cipher points to the Queen's Archival Gallery! We must move quickly!",
          textFa: "رمز به گالری اسناد محرمانه ملکه اشاره دارد! باید سریع حرکت کنیم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: The Queen's Archival Gallery & The Viper Venom Dart
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "C1",
    titleFa: "گالری بایگانی ملکه: دارت سمی و سرقت پوشه شماره سه",
    titleEn: "Stage 4: The Queen's Archival Gallery & The Viper Venom Dart",
    locationFa: "بایگانی مخفی پشت نگارخانه سلطنتی، قفسه‌های بلوط تیره و بوی موم کهنه",
    locationEn: "The Queen's Private Archival Vault, Buckingham Palace",
    storyIntroFa: "شما و واتسون قفل فولادی درِ سنگین گالری اسناد را باز می‌کنید. در تاریکی، نور فانوس صحنه‌ای دلخراش را آشکار می‌سازد: بایگان سالخورده دربار روی فرش سرخ افتاده است. یک دارت نقره‌ای ریز حاوی زهر افعی شاخدار آفریقایی به یقه‌اش نشسته است. گاوصندوق دیواری ضدآتش شکسته شده و از میان صدها سند، تنها جای خالی یک پوشه به چشم می‌خورد: «پوشه شماره ۳: ترازنامه پنهان تاج و تبادلات سری با امپراتوری‌ها».",
    cutscene: {
      titleFa: "ترور بایگان ارشد و کشف جای خالی دفترچه تاج",
      titleEn: "The Poisoned Archivist & The Emptied Niche",
      imageSrc: "/images/skills/speaking/c1_scene_4_poisoned_archivist.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at the Chief Archivist on the floor! A venom dart struck his shoulder.",
          textFa: "به بایگان ارشد روی زمین نگاه کن! یک دارت سمی به شانه‌اش اصابت کرده است.",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The safe is forced open, and the third folder, the Crown Ledger, is missing!",
          textFa: "گاوصندوق به زور باز شده و پوشه سوم، دفترچه تاج، مفقود شده است!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-4-participle-cleft-venom",
        titleFa: "استنتاج انگیزه ترور با ساختار وجهی (Participle Clause)",
        speakerPromptEn: "Examine the archivist's desk and deduce the thief's calculated objective.",
        speakerPromptFa: "میز بایگان را بررسی می‌کنی و هدف سنجیده سارق را نتیجه‌گیری می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (ساختار وجهی Having silenced)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «سارق پس از مهار بایگان با زهر افعی، صرفاً به دنبال سرقت پوشه سوم بود.»",
        targetKeywords: [
          { phrase: "Having silenced the archivist", hintFa: "(پس از ساکت کردن بایگان)", synonyms: ["having silenced the archivist", "after neutralizing the archivist", "having incapacitated the archivist"], weight: 50 },
          { phrase: "targeted the third folder", hintFa: "(پوشه سوم را هدف قرار داد)", synonyms: ["targeted the third folder", "took the third folder", "stole the third ledger"], weight: 50 },
        ],
        idealVoiceResponseEn: "Having silenced the archivist with viper venom, the intruder deliberately targeted the third folder.",
        alternativeResponsesEn: [
          { phraseEn: "After disabling the guard with poison, the thief focused entirely on stealing the Crown Ledger.", translationFa: "پس از زمین‌گیر کردن نگهبان با سم، سارق تمام تمرکزش را روی دزدیدن دفترچه تاج گذاشت." },
          { phraseEn: "Having breached the archival safe, the operative selectively extracted only the third confidential dossier.", translationFa: "پس از باز کردن گاوصندوق آرشیو، مأمور نفوذی تنها پرونده محرمانه سوم را برداشت." },
        ],
        whiteHintFa: "از عبارت وجهی بیانی (Participle Clause: Having silenced...) برای غنای ساختار C1 بهره بگیر!",
        fallbackChoices: [
          "Having silenced the archivist with viper venom, the intruder deliberately targeted the third folder.",
          "These leather-bound volumes contain diplomatic treaties from the eighteenth century.",
          "The ink on this quill pen has dried completely in the warm room.",
        ],
        aefReference: "AEF 5 Unit 4B (Participle clauses with Having + past participle)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The thief fled toward the Throne Room! I can hear alarmed shouts ahead!",
          textFa: "سارق به سمت تالار تخت فرار کرد! صدای فریادهای هراسان از جلو به گوش می‌رسد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — The Throne Room & The Falling Gas Chandelier
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "C1",
    titleFa: "تصمیم دوم: تالار تخت سلطنتی و لوستر گازسوز در حال سقوط",
    titleEn: "DECISION 2: The Throne Room & The Falling Gas Chandelier",
    locationFa: "بالکن فوقانی تالار تخت کاخ، مشرف به دیپلمات‌ها و چلچراغ عظیم کریستال",
    locationEn: "Upper Gallery, The Throne Room, Buckingham Palace",
    storyIntroFa: "ردپای روغن روان‌ساز شما را به بالکن مشرف به تالار تخت می‌رساند. فرستنده نقاب‌دار موریارتی در کنار وینچ چدنی لوستر اصلی کاخ ایستاده است. لوستر عظیم کریستالی با صدها شعله گازسوز روشن است و کابلی که آن را نگه داشته تا نیمه اره شده است! اگر کابل پاره شود، صدها تن کریستال و گاز شعله‌ور بر سر سفیران سقوط خواهد کرد. همزمان، سارق پوشه به بغل آماده پرش به سمت پلکان کالسکه است.",
    cutscene: {
      titleFa: "فرستاده نقاب‌دار روی بالکن و لوستر گازسوز در آستانه سقوط",
      titleEn: "The Sabotaged Chandelier Winch & The Escaping Courier",
      imageSrc: "/images/skills/speaking/c1_scene_5_chandelier_sabotage.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Moriarty's masked agent is cutting the heavy cable of the great ballroom chandelier!",
          textFa: "مأمور نقاب‌دار موریارتی در حال بریدن کابل سنگین لوستر عظیم تالار رقص است!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "It will crush dozens of ambassadors below! What is your command, Holmes?",
          textFa: "این کار ده‌ها سفیر را در پایین خرد خواهد کرد! دستورت چیست هلمز؟",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-2",
      promptFa: "تصمیم حیاتی دوم: آیا با به خطر انداختن جان خود وینچ لوستر را مهار می‌کنید، یا فوراً سارق را تعقیب می‌کنید تا دفترچه تاج از کاخ خارج نشود؟",
      promptEn: "Decision 2: Lock the failing chandelier winch to save innocent lives or pursue the fleeing courier with the Crown Ledger?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Jam the chandelier winch with your steel cane to prevent a bloodbath",
          labelFa: "گزینه ۲الف: مهار وینچ لوستر با عصای فولادی و نجات جان صدها میهمان دربار",
          descriptionFa: "جان صدها انسان بی‌گناه را نجات می‌دهید و سپاس سلطنتی را به دست می‌آورید، اما تعقیب سارق ثانیه‌هایی به تأخیر می‌افتد.",
          pointsDelta: 300,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Vault over the gallery balustrade to tackle the courier before he vanishes",
          labelFa: "گزینه ۲ب: پرش از نرده‌های بالکن برای زمین‌گیر کردن سارق پیش از خروج از کاخ",
          descriptionFa: "به سارق شلیک می‌کنید و پوشه را پس می‌گیرید، اما لوستر سقوط کرده و هرج‌ومرج عظیمی کاخ را فرا می‌گیرد.",
          pointsDelta: 200,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-5-subjunctive-insistence-chandelier",
        titleFa: "صدور فرمان اضطراری با وجه التزامی رسمی (Subjunctive of Urgency)",
        speakerPromptEn: "Issue an urgent command to secure the winch and prevent a disaster.",
        speakerPromptFa: "فرمانی قاطع برای مهار وینچ لوستر و جلوگیری از فاجعه صادر می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (وجه التزامی I insist that we secure)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «اصرار دارم که فوراً مکانیزم لوستر را مهار کنیم تا میهمانان آسیب نبینند.»",
        targetKeywords: [
          { phrase: "secure the chandelier mechanism", hintFa: "(مهار مکانیزم لوستر)", synonyms: ["secure the chandelier mechanism", "secure the falling chandelier", "fix the chandelier winch"], weight: 50 },
          { phrase: "so that no guests", hintFa: "(تا میهمانی آسیب نبیند)", synonyms: ["so that no guests", "lest any guests", "to protect all guests"], weight: 50 },
        ],
        idealVoiceResponseEn: "I insist that we secure the chandelier mechanism immediately so that no guests are harmed.",
        alternativeResponsesEn: [
          { phraseEn: "It is vital that we lock the chandelier winch before dozens of innocent people perish.", translationFa: "حیاتی است که وینچ لوستر را قبل از کشته شدن ده‌ها انسان بی‌گناه قفل کنیم." },
          { phraseEn: "We must secure the falling chandelier cable at once to avert a horrific catastrophe.", translationFa: "باید کابل لوستر در حال سقوط را فوراً محکم کنیم تا از فاجعه‌ای هولناک جلوگیری شود." },
        ],
        whiteHintFa: "از ساختار التزامی بعد از فعل اصرار (I insist that we secure...) استفاده کن!",
        fallbackChoices: [
          "I insist that we secure the chandelier mechanism immediately so that no guests are harmed.",
          "The portraits of the previous monarchs look down from the velvet walls.",
          "I suspect the masked ballroom orchestra is playing slightly out of tempo.",
        ],
        aefReference: "AEF 5 Unit 5A (The Subjunctive with insist / vital that + base form)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The winch is locked! But the masked courier leaped onto the rooftop terrace!",
          textFa: "وینچ قفل شد! اما فرستنده نقاب‌دار روی تراس پشت‌بام پرید!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Aftermath of Decision 2 — Imperial Honor or Midnight Chaos
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "C1",
    titleFa: "پیامد تصمیم دوم: افتخار سلطنتی یا هرج‌ومرج در پایتخت",
    titleEn: "Stage 6: Aftermath of Decision 2 — Imperial Honor or Midnight Chaos",
    locationFa: "تراس مرمرین مشرف به باغ‌های تاریک باکینگهام و برج ساعت وست‌مینستر در دوردست",
    locationEn: "Royal Terrace & Palace Gardens, Overlooking Elizabeth Tower",
    storyIntroFa: "پیامد انتخاب دوم رقم می‌خورد: اگر لوستر را مهار کرده باشید، صدها دیپلمات به همراه ملکه از مرگ حتمی نجات یافته‌اند و کاپیتان هاوارد سواره‌نظام دربار را برای محاصره مسیر فرار در اختیارتان می‌گذارد. اگر سارق را هدف گرفته باشید، صدای غرش خرد شدن لوستر کاخ را به لرزه درآورده اما سارق زخمی با دفترچه به سمت لوله‌های هوای فشرده وست‌مینستر گریخته است.",
    cutscene: {
      titleFa: "پیامد نجات لوستر یا تعقیب مستقیم سارق",
      titleEn: "Terrace Aftermath: Sovereign Gratitude or Ruined Grandeur",
      imageSrc: "/images/skills/speaking/c1_scene_6_terrace_aftermath.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The courier escaped into the London fog with Folder Number Three! Where is he headed, Holmes?",
          textFa: "فرستنده با پوشه شماره ۳ به داخل مه لندن گریخت! او به کدام سو می‌رود هلمز؟",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "He is heading for the Westminster Pneumatic Dispatch. He intends to shoot the ledger straight to the press!",
          textFa: "او به سوی لوله‌های هوای فشرده وست‌مینستر می‌رود. قصد دارد دفترچه را مستقیماً به دست مطبوعات برساند!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "شاخه ۲الف: نجات میهمانان و پشتیبانی سواره‌نظام گارد سلطنتی",
        titleEn: "Branch 2A: Ballroom Saved & Royal Household Cavalry Support",
        storyIntroFa: "با اهرم کردن عصای فولادی، کابل در آستانه سقوط قفل شد. ملکه شخصاً از بالکن دستور داد سریع‌ترین اسب‌های گارد در اختیار شرلوک و واتسون قرار گیرد.",
        cutscene: {
          titleFa: "سپاس ملکه و اسب‌های تیزتک سواره‌نظام",
          titleEn: "Royal Household Cavalry at Holmes's Disposal",
          imageSrc: "/images/skills/speaking/c1_scene_6a_cavalry_support.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Mount up, Watson! The palace cavalry gives us the speed to intercept the courier!",
              textFa: "سوار شو واتسون! سواره‌نظام کاخ به ما سرعت لازم برای رهگیری فرستنده را می‌دهد!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "We gallop toward Westminster! Only forty minutes until the midnight deadline!",
              textFa: "به سمت وست‌مینستر می‌تازیم! تنها چهل دقیقه تا موعد نیمه‌شب باقی مانده است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-6-inversion-ballroom",
            titleFa: "بیان دستاورد دوگانه با ساختار معکوس پیشرفته (Inversion with Not only)",
            speakerPromptEn: "Affirm the dual achievement of securing the ballroom and retaining the royal mandate.",
            speakerPromptFa: "دستاورد دوگانه مهار بحران و حفظ اختیارات سلطنتی را اعلام می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (ساختار معکوس Not only did we)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به واتسون بگو: «ما نه تنها از انفجاری ویرانگر جلوگیری کردیم، بلکه مجوز تعقیب فوری را گرفتیم.»",
            targetKeywords: [
              { phrase: "Not only did we avert", hintFa: "(نه تنها جلوگیری کردیم از...)", synonyms: ["not only did we avert", "not only did we prevent", "not only did we stop"], weight: 50 },
              { phrase: "secured official pursuit clearance", hintFa: "(مجوز رسمی تعقیب را گرفتیم)", synonyms: ["secured official pursuit clearance", "secured imperial clearance", "gained full pursuit clearance"], weight: 50 },
            ],
            idealVoiceResponseEn: "Not only did we avert a catastrophe in the ballroom, but we secured official pursuit clearance.",
            alternativeResponsesEn: [
              { phraseEn: "Not only was the ballroom disaster prevented, but the palace guard is now assisting our hunt.", translationFa: "نه تنها فاجعه تالار مهار شد، بلکه گارد سلطنتی اکنون به تعقیب ما کمک می‌کند." },
              { phraseEn: "We not only saved countless lives tonight, but we also kept our pursuit completely intact.", translationFa: "امشب نه تنها جان افراد بی‌شماری را نجات دادیم، بلکه تعقیبمان را کاملاً حفظ کردیم." },
            ],
            whiteHintFa: "از ترکیب معکوس Not only did we... but we... برای بیان چند دستاورد همزمان استفاده کن!",
            fallbackChoices: [
              "Not only did we avert a catastrophe in the ballroom, but we secured official pursuit clearance.",
              "The horse cavalry outside the gates is preparing for the morning royal parade.",
              "Rain is dripping steadily from the stone gargoyles into the palace courtyard.",
            ],
            aefReference: "AEF 5 Unit 6A (Inversion with Not only did we... but also...)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Captain Howard reports the courier fled toward the Westminster pneumatic dispatch tubes!",
              textFa: "کاپیتان هاوارد گزارش می‌دهد که فرستنده به سمت لوله‌های هوای فشرده وست‌مینستر گریخته است!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "شاخه ۲ب: سقوط مهیب لوستر و ردگیری سارق زخمی در باران",
        titleEn: "Branch 2B: Chandelier Collapse & Tracking the Wounded Fugitive",
        storyIntroFa: "لوستر با غرش عظیمی سقوط کرد و چلچراغ‌ها شکستند. شلیک شما به شانه سارق اصابت کرد. او کشان‌کشان با رد خونی مشخص از دروازه باغ گریخت.",
        cutscene: {
          titleFa: "دود و شیشه شکسته در تالار و رد خون روی سنگ‌فرش خیس",
          titleEn: "Shattered Crystal & Bloodstains in the Rain",
          imageSrc: "/images/skills/speaking/c1_scene_6b_shattered_hall.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Your bullet grazed him, Holmes! Look at the fresh blood on the wet flagstones!",
              textFa: "گلوله‌ات به او خراش انداخت هلمز! به رد خون تازه روی سنگ‌فرش‌های خیس نگاه کن!",
              bubblePosition: "left",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "He is stumbling toward the river embankment. He cannot outrun us on foot!",
              textFa: "او لنگان‌لنگان به سمت ساحل رودخانه می‌رود. او پیاده نمی‌تواند از ما پیشی بگیرد!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-6-mixed-conditional-pursuit",
            titleFa: "استنتاج تاکتیکی با شرطی ترکیبی (Mixed Conditional)",
            speakerPromptEn: "Analyze the consequences of tactical prioritization under pressure.",
            speakerPromptFa: "پیامد اولویت‌بندی تاکتیکی تحت فشار را با شرطی ترکیبی بیان می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی If we had prioritized)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «اگر مهار لوستر را اولویت داده بودیم، اکنون گارد کاخ در تعقیب به ما کمک می‌کرد.»",
            targetKeywords: [
              { phrase: "If we had prioritized the chandelier", hintFa: "(اگر لوستر را اولویت داده بودیم)", synonyms: ["if we had prioritized the chandelier", "had we prioritized the chandelier", "if we had secured the winch"], weight: 50 },
              { phrase: "guards would now be assisting us", hintFa: "(نگهبانان اکنون به ما کمک می‌کردند)", synonyms: ["guards would now be assisting us", "guards would now be helping us", "guards would be aiding our pursuit"], weight: 50 },
            ],
            idealVoiceResponseEn: "If we had prioritized the chandelier, the palace guard would now be assisting our pursuit.",
            alternativeResponsesEn: [
              { phraseEn: "Had we secured the winch, we would be pursuing the fugitive with full royal support right now.", translationFa: "اگر وینچ را مهار کرده بودیم، هم‌اکنون با پشتیبانی کامل سلطنتی فراری را تعقیب می‌کردیم." },
              { phraseEn: "If we had chosen the chandelier, the entire cavalry would now be cutting off his escape route.", translationFa: "اگر لوستر را انتخاب کرده بودیم، کل سواره‌نظام اکنون مسیر فرار او را مسدود می‌کرد." },
            ],
            whiteHintFa: "از ساختار شرطی ترکیبی If + had p.p. ... would now be + ing استفاده کن!",
            fallbackChoices: [
              "If we had prioritized the chandelier, the palace guard would now be assisting our pursuit.",
              "The iron railings of the palace gardens were forged during the reign of King George.",
              "I suspect the fog over the Thames is growing denser by the minute.",
            ],
            aefReference: "AEF 5 Unit 6B (Mixed Conditionals: past action with present consequence)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look ahead, Holmes! The blood trail leads directly into the Westminster pneumatic hub!",
              textFa: "جلو را نگاه کن هلمز! رد خون مستقیماً به مرکز هوای فشرده وست‌مینستر منتهی می‌شود!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-6-default-fallback",
        titleFa: "بیان دستاورد دوگانه با ساختار معکوس پیشرفته (Inversion with Not only)",
        speakerPromptEn: "Affirm the dual achievement of securing the ballroom and retaining the royal mandate.",
        speakerPromptFa: "دستاورد دوگانه مهار بحران و حفظ اختیارات سلطنتی را اعلام می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (ساختار معکوس Not only did we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «ما نه تنها از انفجاری ویرانگر جلوگیری کردیم، بلکه مجوز تعقیب فوری را گرفتیم.»",
        targetKeywords: [
          { phrase: "Not only did we avert", hintFa: "(نه تنها جلوگیری کردیم از...)", synonyms: ["not only did we avert", "not only did we prevent", "not only did we stop"], weight: 50 },
          { phrase: "secured official pursuit clearance", hintFa: "(مجوز رسمی تعقیب را گرفتیم)", synonyms: ["secured official pursuit clearance", "secured imperial clearance", "gained full pursuit clearance"], weight: 50 },
        ],
        idealVoiceResponseEn: "Not only did we avert a catastrophe in the ballroom, but we secured official pursuit clearance.",
        alternativeResponsesEn: [
          { phraseEn: "Not only was the ballroom disaster prevented, but the palace guard is now assisting our hunt.", translationFa: "نه تنها فاجعه تالار مهار شد، بلکه گارد سلطنتی اکنون به تعقیب ما کمک می‌کند." },
          { phraseEn: "We not only saved countless lives tonight, but we also kept our pursuit completely intact.", translationFa: "امشب نه تنها جان افراد بی‌شماری را نجات دادیم، بلکه تعقیبمان را کاملاً حفظ کردیم." },
        ],
        whiteHintFa: "از ترکیب معکوس Not only did we... but we... برای بیان چند دستاورد همزمان استفاده کن!",
        fallbackChoices: [
          "Not only did we avert a catastrophe in the ballroom, but we secured official pursuit clearance.",
          "The horse cavalry outside the gates is preparing for the morning royal parade.",
          "Rain is dripping steadily from the stone gargoyles into the palace courtyard.",
        ],
        aefReference: "AEF 5 Unit 6A (Inversion with Not only did we... but also...)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Captain Howard reports the courier fled toward the Westminster pneumatic dispatch tubes!",
          textFa: "کاپیتان هاوارد گزارش می‌دهد که فرستنده به سمت لوله‌های هوای فشرده وست‌مینستر گریخته است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3: Westminster Pneumatic Dispatch & The Fleet Street Tube
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "C1",
    titleFa: "تصمیم سوم: شبکه لوله‌های هوای فشرده وست‌مینستر و خط فلیت‌استریت",
    titleEn: "DECISION 3: Westminster Pneumatic Dispatch & The Fleet Street Tube",
    locationFa: "زیرزمین بخارآلود مرکز توزیع پنوماتیک وست‌مینستر، لوله‌های برنجی و دیگ بخار غران",
    locationEn: "Pneumatic Dispatch Terminal, Beneath Westminster Embankment",
    storyIntroFa: "شما و واتسون از پله‌های مرطوب به زیرزمین صنعتی سیستم لوله‌های هوای فشرده وست‌مینستر هجوم می‌برید. صدها لوله مسی غول‌پیکر با غرش بخار هوا را به روزنامه‌ها و وزارتخانه‌ها پمپاژ می‌کنند. سارق کپسول برنجی حاوی دفترچه مسروقه تاج را داخل محفظه پرتاب لوله شماره ۴ گذاشته و فشارسنج به خط قرمز نزدیک می‌شود. همزمان، کاپیتان هاوارد با زنجیرهای فولادی به شیر بخار داغ بسته شده و بخار سوزان تا ۳۰ ثانیه دیگر پوستش را می‌سوزاند!",
    cutscene: {
      titleFa: "کپسول برنجی در لوله شماره ۴ و افسر در بند بخار داغ",
      titleEn: "The High-Pressure Capsule & The Scalding Steam Trap",
      imageSrc: "/images/skills/speaking/c1_scene_7_pneumatic_terminal.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The dispatch compressor is hissing! The brass capsule contains the stolen Crown documents.",
          textFa: "کمپرسور توزیع در حال هیس‌هیس است! کپسول برنجی حاوی اسناد مسروقه تاج است.",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Captain Howard is chained beside the steam boiler! We have thirty seconds left!",
          textFa: "کاپیتان هاوارد کنار دیگ بخار به زنجیر کشیده شده است! ۳۰ ثانیه بیشتر وقت نداریم!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-3",
      promptFa: "تصمیم حیاتی سوم: آیا اهرم قطع فشار لوله‌های پنوماتیک را می‌کشید تا کپسول به فلیت‌استریت شلیک نشود، یا زنجیر کاپیتان هاوارد را قطع می‌کنید تا از سوختگی مرگبار نجات یابد؟",
      promptEn: "Decision 3: Vent the pneumatic compressor to halt the capsule or sever Captain Howard's chains before the steam erupts?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Vent the steam compressor with your iron pry-bar to freeze the dispatch tube",
          labelFa: "گزینه ۳الف: تخلیه اضطراری مخزن فشار پنوماتیک و متوقف ساختن پرتاب کپسول",
          descriptionFa: "فشار لوله تخلیه شده و کپسول اسناد درون لوله متوقف می‌شود؛ این اقدام اسناد سلطنتی را نجات می‌دهد.",
          pointsDelta: 300,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Smash Howard's iron shackles to pull him from the rupture path",
          labelFa: "گزینه ۳ب: شکستن غل‌وزنجیر کاپیتان هاوارد و کشیدن او از مسیر فواره بخار",
          descriptionFa: "جان افسر شجاع ملکه را نجات می‌دهید، اما کپسول به سمت ایستگاه برج الیزابت شلیک می‌شود.",
          pointsDelta: 200,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-7-mixed-conditional-hesitated",
        titleFa: "تأکید بر پیامد فوری تصمیم با ساختار شرطی بدون If (Inverted Conditional)",
        speakerPromptEn: "Emphasize the urgency of disabling the pneumatic compressor before publication.",
        speakerPromptFa: "بر فوریت از کار انداختن کمپرسور لوله قبل از انتشار اسناد تأکید می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we hesitated)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «اگر در قطع کردن کمپرسور درنگ کرده بودیم، اسناد سلطنتی اکنون در دست چاپخانه‌ها بود.»",
        targetKeywords: [
          { phrase: "Had we hesitated to disable", hintFa: "(اگر در قطع کردن درنگ کرده بودیم)", synonyms: ["had we hesitated to disable", "if we had hesitated to stop", "had we failed to disable"], weight: 50 },
          { phrase: "would already be with Fleet Street", hintFa: "(اکنون در دست مطبوعات بود)", synonyms: ["would already be with fleet street", "would be in the printers' hands", "would be published by now"], weight: 50 },
        ],
        idealVoiceResponseEn: "Had we hesitated to disable this compressor, the confidential documents would already be with Fleet Street.",
        alternativeResponsesEn: [
          { phraseEn: "If we had delayed for even one minute, the stolen royal ledger would be in print.", translationFa: "اگر حتی یک دقیقه تأخیر می‌کردیم، دفترچه مسروقه سلطنتی زیر چاپ بود." },
          { phraseEn: "Had we not acted instantly, scandalous royal secrets would now be circulating across London.", translationFa: "اگر فوراً عمل نکرده بودیم، رسوایی‌های سلطنتی اکنون در سراسر لندن دست‌به‌دست می‌شد." },
        ],
        whiteHintFa: "از شرطی ترکیبی پیشرفته با Inversion (Had we hesitated... would already be...) استفاده کن!",
        fallbackChoices: [
          "Had we hesitated to disable this compressor, the confidential documents would already be with Fleet Street.",
          "Pneumatic tubes rely on differential air pressure generated by coal-powered steam engines.",
          "The Thames riverbed underneath this tunnel smells distinctly of damp clay and coal.",
        ],
        aefReference: "AEF 5 Unit 7B (Mixed Conditionals: past condition with present result)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The tube is jammed! The courier is climbing inside the Elizabeth Clock Tower!",
          textFa: "لوله گیر کرد! فرستنده در حال بالا رفتن از برج ساعت الیزابت است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 8: Ascent of the Elizabeth Tower & The Pendulum's Pulse
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "C1",
    titleFa: "صعود از برج الیزابت (بیگ‌بن): ضربان پاندول و ارتفاع مرگبار",
    titleEn: "Stage 8: Ascent of the Elizabeth Tower & The Pendulum's Pulse",
    locationFa: "پله‌های مارپیچ سنگی و اتاق پاندول برج ساعت الیزابت در ارتفاع ۶۰ متری وست‌مینستر",
    locationEn: "Spiral Belfry Staircase & Pendulum Chamber, Elizabeth Tower (Big Ben)",
    storyIntroFa: "ساعت ۱۱:۴۸ شب است. شما و واتسون با شتاب از ۳۳۴ پله مارپیچ سنگی برج الیزابت بالا می‌دوید. غرش طوفان بیرون بر دیواره‌های سنگی برج می‌کوبد و در هر چند ثانیه، صدای سنگین پاندول دو تنی بیگ‌بن در فضا طنین می‌اندازد. سارق نقاب‌دار خود را به سکوی فوقانی در کنار چرخ‌دنده‌های مکانیزم ناقوس رسانده است. او با کپسول در دست قصد دارد در نیمه‌شب، سیگنال نهایی را به سوی کشتی هوایی موریارتی شلیک کند.",
    cutscene: {
      titleFa: "شاخه ۳الف: توقف کامل کپسول و تعقیب نفس‌گیر روی پله‌های سنگی",
      titleEn: "Pursuit Up the Spiral Belfry Staircase",
      imageSrc: "/images/skills/speaking/c1_scene_8_spiral_belfry.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Listen to the massive pendulum swinging! The clock hands are approaching midnight.",
          textFa: "به نوسان پاندول عظیم گوش کن! عقربه‌های ساعت به نیمه‌شب نزدیک می‌شوند.",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look at the catwalk above the bells! The courier is setting a signal light!",
          textFa: "به پل هوایی بالای زنگ‌ها نگاه کن! فرستنده در حال کار گذاشتن نور سیگنال است!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "شاخه ۳الف: کپسول مسدود و برتری کامل در تعقیب ارتفاعات",
        titleEn: "Branch 3A: Capsule Intercepted & Gaining High-Altitude Advantage",
        storyIntroFa: "کپسول برنجی در لوله متوقف شد. کدهای درون آن پیش شماست، اما فرستنده به تنهایی به برج پناه برده تا مکانیزم ساعت را با بمب ساعتی پیوند بزند.",
        cutscene: {
          titleFa: "رهگیری کپسول و صعود پرسرعت به اتاق زنگ‌ها",
          titleEn: "Climbing Past the Clock Faces",
          imageSrc: "/images/skills/speaking/c1_scene_8a_clock_faces.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "The ledger is safe, but he intends to rig the chiming gears with explosives!",
              textFa: "دفترچه امن است، اما او قصد دارد چرخ‌دنده‌های زنگ را به مواد منفجره مجهز کند!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "We must reach the escapement chamber before the hands strike twelve!",
              textFa: "باید قبل از اینکه عقربه‌ها به دوازده برسند به اتاق چرخ‌دنده‌ها برسیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-8-cleft-what-concerns",
            titleFa: "افشای نقشه راهبردی سارق با جمله شکافته اسمی (What-Cleft Clause)",
            speakerPromptEn: "Identify the traitor's true objective atop the clocktower platform.",
            speakerPromptFa: "هدف واقعی خائن در بالای سکوی برج ساعت را مشخص می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (جمله شکافته What concerns me most)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به واتسون بگو: «آنچه بیش از همه مرا نگران می‌کند این است که او قصد دارد به موریارتی علامت بدهد.»",
            targetKeywords: [
              { phrase: "What concerns me most profoundly", hintFa: "(آنچه عمیقاً مرا نگران می‌کند)", synonyms: ["what concerns me most profoundly", "what concerns me most", "what worries me deeply"], weight: 50 },
              { phrase: "intends to signal Moriarty", hintFa: "(قصد دارد به موریارتی علامت دهد)", synonyms: ["intends to signal moriarty", "plans to signal moriarty", "wants to signal moriarty"], weight: 50 },
            ],
            idealVoiceResponseEn: "What concerns me most profoundly is that the courier intends to signal Moriarty at midnight.",
            alternativeResponsesEn: [
              { phraseEn: "What worries me most is that this traitor plans to contact Moriarty's airship directly.", translationFa: "آنچه بیش از همه مرا نگران می‌کند این است که خائن قصد دارد با کشتی هوایی موریارتی تماس بگیرد." },
              { phraseEn: "It is the midnight signal to Moriarty's network that poses the most critical threat.", translationFa: "این علامت نیمه‌شب به شبکه موریارتی است که بحرانی‌ترین تهدید را ایجاد می‌کند." },
            ],
            whiteHintFa: "از جمله شکافته اسمی What concerns me most is that... برای متمرکز کردن کلام استفاده کن!",
            fallbackChoices: [
              "What concerns me most profoundly is that the courier intends to signal Moriarty at midnight.",
              "The four clock faces of Big Ben are crafted from opal glass panels.",
              "The sound of the river traffic below is muffled by the thick stone walls.",
            ],
            aefReference: "AEF 5 Unit 8A (Cleft sentences with What-clauses)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Only two minutes remain, Holmes! He is standing right beside the escapement gear!",
              textFa: "تنها دو دقیقه باقی مانده هلمز! او درست در کنار چرخ‌دنده اصلی ایستاده است!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "شاخه ۳ب: نجات کاپیتان هاوارد و شلیک کپسول به سکوی برج",
        titleEn: "Branch 3B: Howard Rescued & Intercepting the Capsule at the Belfry",
        storyIntroFa: "زنجیر هاوارد را باز کردید و او نجات یافت. هاوارد راه میانبر پلکان خدمتکاران برج را به شما نشان داد تا دقیقاً سر وقت به اتاق ناقوس برسید.",
        cutscene: {
          titleFa: "پلکان میانبر برج با راهنمایی کاپیتان هاوارد",
          titleEn: "Howard's Hidden Belfry Access",
          imageSrc: "/images/skills/speaking/c1_scene_8b_belfry_shortcut.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Howard's shortcut saved our climb! We arrived ahead of the traitor's signal!",
              textFa: "میانبر هاوارد صعود ما را نجات داد! قبل از سیگنال خائن به اینجا رسیدیم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "There he is on the gantry! He is clutching the brass capsule to his chest!",
              textFa: "او آنجاست روی داربست! کپسول برنجی را به سینه‌اش چسبانده است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c1-8-inversion-scarcely-howard",
            titleFa: "توصیف چرخش اوضاع با ساختار معکوس زمان (Scarcely had we)",
            speakerPromptEn: "Relate Howard's timely rescue to discovering the secret Belfry access.",
            speakerPromptFa: "نجات به‌موقع هاوارد و کشف مسیر میانبر را با ساختار معکوس بیان می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (ساختار معکوس Scarcely had we)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «هنوز کاپیتان هاوارد را از لوله بخار جدا نکرده بودیم که راه مخفی برج را فاش کرد.»",
            targetKeywords: [
              { phrase: "Scarcely had we unchained", hintFa: "(هنوز زنجیرش را باز نکرده بودیم)", synonyms: ["scarcely had we unchained", "hardly had we unchained", "scarcely had we freed"], weight: 50 },
              { phrase: "revealed the secret clocktower access", hintFa: "(راه مخفی برج ساعت را فاش کرد)", synonyms: ["revealed the secret clocktower access", "showed the secret belfry access", "revealed the hidden access"], weight: 50 },
            ],
            idealVoiceResponseEn: "Scarcely had we unchained Captain Howard when he revealed the secret clocktower access.",
            alternativeResponsesEn: [
              { phraseEn: "Hardly had we freed the captain from the steam valve when he pointed us to this shortcut.", translationFa: "هنوز کاپیتان را از شیر بخار آزاد نکرده بودیم که این میانبر را به ما نشان داد." },
              { phraseEn: "No sooner had we broken his chains than Howard disclosed the hidden belfry entrance.", translationFa: "به محض اینکه زنجیرهایش را شکستیم، هاوارد ورودی مخفی اتاق ناقوس را فاش کرد." },
            ],
            whiteHintFa: "از ساختار معکوس زمانی Scarcely had we + p.p. ... when ... استفاده کن!",
            fallbackChoices: [
              "Scarcely had we unchained Captain Howard when he revealed the secret clocktower access.",
              "The iron steps become increasingly narrow toward the lantern of the spire.",
              "A flock of pigeons took flight from the belfry as the clock chimed the quarter hour.",
            ],
            aefReference: "AEF 5 Unit 8B (Inversion with Scarcely / Hardly had we... when)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look at the main escapement wheel, Holmes! He is jamming an iron spoke into it!",
              textFa: "به چرخ‌دنده اصلی نگاه کن هلمز! او دارد یک میله آهنی را درون آن فرو می‌کند!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-8-default-fallback",
        titleFa: "افشای نقشه راهبردی سارق با جمله شکافته اسمی (What-Cleft Clause)",
        speakerPromptEn: "Identify the traitor's true objective atop the clocktower platform.",
        speakerPromptFa: "هدف واقعی خائن در بالای سکوی برج ساعت را مشخص می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته What concerns me most)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «آنچه بیش از همه مرا نگران می‌کند این است که او قصد دارد به موریارتی علامت بدهد.»",
        targetKeywords: [
          { phrase: "What concerns me most profoundly", hintFa: "(آنچه عمیقاً مرا نگران می‌کند)", synonyms: ["what concerns me most profoundly", "what concerns me most", "what worries me deeply"], weight: 50 },
          { phrase: "intends to signal Moriarty", hintFa: "(قصد دارد به موریارتی علامت دهد)", synonyms: ["intends to signal moriarty", "plans to signal moriarty", "wants to signal moriarty"], weight: 50 },
        ],
        idealVoiceResponseEn: "What concerns me most profoundly is that the courier intends to signal Moriarty at midnight.",
        alternativeResponsesEn: [
          { phraseEn: "What worries me most is that this traitor plans to contact Moriarty's airship directly.", translationFa: "آنچه بیش از همه مرا نگران می‌کند این است که خائن قصد دارد با کشتی هوایی موریارتی تماس بگیرد." },
          { phraseEn: "It is the midnight signal to Moriarty's network that poses the most critical threat.", translationFa: "این علامت نیمه‌شب به شبکه موریارتی است که بحرانی‌ترین تهدید را ایجاد می‌کند." },
        ],
        whiteHintFa: "از جمله شکافته اسمی What concerns me most is that... برای متمرکز کردن کلام استفاده کن!",
        fallbackChoices: [
          "What concerns me most profoundly is that the courier intends to signal Moriarty at midnight.",
          "The four clock faces of Big Ben are crafted from opal glass panels.",
          "The sound of the river traffic below is muffled by the thick stone walls.",
        ],
        aefReference: "AEF 5 Unit 8A (Cleft sentences with What-clauses)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Only two minutes remain, Holmes! He is standing right beside the escapement gear!",
          textFa: "تنها دو دقیقه باقی مانده هلمز! او درست در کنار چرخ‌دنده اصلی ایستاده است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4: The Mechanical Escapement of Big Ben at 11:59 PM
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "C1",
    titleFa: "تصمیم چهارم: مکانیزم رهاساز بیگ‌بن در ساعت ۱۱:۵۹ شب",
    titleEn: "DECISION 4: The Mechanical Escapement of Big Ben at 11:59 PM",
    locationFa: "اتاق چرخ‌دنده‌های عظیم ساعت بیگ‌بن در ارتفاع ۷۰ متری، چرخ‌دنده‌های برنزی غران",
    locationEn: "The Great Clockwork Gear Chamber, Elizabeth Tower (Big Ben)",
    storyIntroFa: "ساعت ۱۱:۵۹ شب است. عقربه بزرگ ساعت غول‌پیکر بیگ‌بن به آخرین دقیقه پیش از نیمه‌شب رسیده است. سارق نقاب‌دار در لبه سکوی چرخ‌دنده‌های مکانیکی ایستاده است. او میله فولادی را بالای مکانیزم رهاساز زنگ‌ها گرفته است: اگر میله وارد چرخ‌دنده‌ها شود، مکانیزم مسدود شده و چاشنی دینامیت متصل به چکش ناقوس در ضربه اول منفجر خواهد شد! او فریاد می‌زند: «دیر رسیدی هلمز! امشب نماد امپراتوری در آتش فرو خواهد ریخت!»",
    cutscene: {
      titleFa: "چرخ‌دنده‌های عظیم ساعت در ۱۱:۵۹ و فرستاده در لبه بالکن",
      titleEn: "The 11:59 Mechanical Stand-off at Big Ben",
      imageSrc: "/images/skills/speaking/c1_scene_9_clockwork_standoff.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "مأمور نقاب‌دار موریارتی",
          speakerRoleFa: "عامل خیانت در برج ساعت",
          speakerAvatar: "♟️",
          textEn: "You are too late, detective! When the bells strike twelve, London will burn!",
          textFa: "خیلی دیر رسیدی کارآگاه! وقتی زنگ‌ها به دوازده ضربه بزنند، لندن خواهد سوخت!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با تپانچه کشیده",
          speakerAvatar: "🩺",
          textEn: "He is about to wedge an iron bar into the chime mechanism to detonate it!",
          textFa: "او می‌خواهد یک میله آهنی را در مکانیزم زنگ‌ها قفل کند تا چاشنی را منفجر کند!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-4",
      promptFa: "سرنوشت‌سازترین تصمیم پرونده: چگونه انفجار چرخ‌دنده‌های ساعت بیگ‌بن در ۶۰ ثانیه به نیمه‌شب را مهار می‌کنید؟",
      promptEn: "Decision 4: Tackle the saboteur directly on the narrow beam or jam the escapement ratchet with your cane?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Dive forward onto the narrow beam to disarm the saboteur by hand",
          labelFa: "گزینه ۴الف: شیرجه شجاعانه روی تیرک باریک و خلع سلاح فیزیکی خرابکار پیش از ضربه زدن",
          descriptionFa: "با دست خالی روی لبه پرتگاه به سمت خائن می‌پرید، میله را از دستش خارج کرده و او را روی کف زمین مهار می‌کنید.",
          pointsDelta: 400,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Jam the escapement ratchet with your steel cane to freeze the hammer gear",
          labelFa: "گزینه ۴ب: گیر انداختن چرخ‌دنده اصلی ساعت با عصای فولادی و مهار بی‌خطر چکش ناقوس",
          descriptionFa: "عصای فولادی خود را در چرخ‌دنده قفل می‌کنید؛ ساعت متوقف شده و سیستم انفجاری از کار می‌افتد.",
          pointsDelta: 300,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-9-inversion-under-no-circumstances",
        titleFa: "صدور فرمان نهایی ممنوعیت با ساختار معکوس قاطع (Under no circumstances)",
        speakerPromptEn: "Deliver a decisive command to prevent the clock from triggering the explosion.",
        speakerPromptFa: "دستوری قاطع برای جلوگیری از فعال شدن انفجار توسط مکانیزم ساعت صادر می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (ساختار معکوس Under no circumstances must we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «تحت هیچ شرایطی نباید اجازه دهیم این مکانیزم زنگ‌های نیمه‌شب را به صدا درآورد.»",
        targetKeywords: [
          { phrase: "Under no circumstances must we", hintFa: "(تحت هیچ شرایطی نباید...)", synonyms: ["under no circumstances must we", "under no circumstances should we", "on no account must we"], weight: 50 },
          { phrase: "trigger the chimes before midnight", hintFa: "(زنگ‌ها را قبل از نیمه‌شب به صدا درآورد)", synonyms: ["trigger the chimes before midnight", "trigger the midnight chimes", "strike the midnight chimes"], weight: 50 },
        ],
        idealVoiceResponseEn: "Under no circumstances must we allow this mechanism to trigger the chimes before midnight.",
        alternativeResponsesEn: [
          { phraseEn: "On no account must that gear engage, or the explosive device will instantly detonate.", translationFa: "به هیچ وجه نباید آن چرخ‌دنده درگیر شود، وگرنه بمب بلافاصله منفجر خواهد شد." },
          { phraseEn: "Under no circumstances can we permit the clock to trigger the trap at midnight.", translationFa: "تحت هیچ شرایطی نمی‌توانیم اجازه دهیم ساعت در نیمه‌شب تله را فعال کند." },
        ],
        whiteHintFa: "از عبارت منفی تأکیدی Under no circumstances must we... برای ممنوعیت قطعی استفاده کن!",
        fallbackChoices: [
          "Under no circumstances must we allow this mechanism to trigger the chimes before midnight.",
          "The bronze alloy of Big Ben was cast in the Whitechapel Bell Foundry.",
          "Wind gusts at this altitude are particularly fierce during November nights.",
        ],
        aefReference: "AEF 5 Unit 9B (Inversion with Under no circumstances / On no account)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "CLANG! The ratchet is jammed! The traitor is disarmed and pinned to the floor!",
          textFa: "دانگ! چرخ‌دنده مهار شد! خائن خلع سلاح شد و به کف زمین چسبانده شد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: The Midnight Chimes, The Unmasking & The Red Folder Revelation
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "C1",
    titleFa: "پرده دهم: زنگ نیمه‌شب، نقاب‌برداری و افشای پوشه سرخ موریارتی",
    titleEn: "Stage 10: The Midnight Chimes, The Unmasking & The Red Folder Revelation",
    locationFa: "سکوی زیر ناقوس عظیم بیگ‌بن، مشرف به دورنمای لندن بارانی در نیمه‌شب",
    locationEn: "The High Belfry Platform, Beneath Big Ben's Great Bell, London",
    storyIntroFa: "ساعت ۱۲:۰۰ نیمه‌شب است. مکانیزم بمب با موفقیت خنثی شده و زنگ بیگ‌بن با آرامش و شکوه در آسمان پایتخت به صدا درمی‌آید. شما نقاب ابریشمی سیاه سارق را کنار می‌زنید: چهره بهت‌زده لرد دارلینگتون، رئیس خزانه‌داری دربار نمایان می‌شود! از جیب ردای سلطنتی او، علاوه بر دفترچه شماره ۳، یک پاکت چرمی زرشکی با مهر موم سرخ و امضای «M» کشف می‌شود: نقشه موریارتی برای سرقت چهارمین و نهایی‌ترین پوشه در سطح بین‌المللی!",
    cutscene: {
      titleFa: "نقاب‌برداری از لرد دارلینگتون و کشف پاکت سرخ موریارتی",
      titleEn: "Unmasking Lord Darlington & The Red Dossier Climax",
      imageSrc: "/images/skills/speaking/c1_scene_10_unmasking_climax.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Let us remove your mask... Lord Darlington, the Chancellor of the Royal Exchequer!",
          textFa: "بگذار نقابت را برداریم... لرد دارلینگتون، رئیس خزانه‌داری دربار سلطنتی!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "A royal chancellor working for Moriarty?! Holmes, look what is inside his coat!",
          textFa: "رئیس خزانه‌داری سلطنتی برای موریارتی کار می‌کرد؟! هلمز، ببین داخل کتش چیست!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-10-cleft-red-folder-deduction",
        titleFa: "ترکیب استنتاج نهایی با جمله شکافته تأکیدی (Cleft Sentence of Synthesis)",
        speakerPromptEn: "Expose Moriarty's overarching conspiracy connecting the stolen folders.",
        speakerPromptFa: "توطئه جامع موریارتی را که پوشه‌ها را به هم متصل می‌کند برملا می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (استنتاج با It was not merely... but...)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «صرفاً طمع درباریان این بحران را رقم نزد، بلکه نقشه بزرگ موریارتی در پاکت سرخ بود.»",
        targetKeywords: [
          { phrase: "not merely personal greed", hintFa: "(صرفاً طمع شخصی نبود)", synonyms: ["not merely personal greed", "not only personal greed", "not simply greed"], weight: 50 },
          { phrase: "Moriarty's grand design", hintFa: "(نقشه بزرگ موریارتی)", synonyms: ["moriarty's grand design", "moriarty's master plan", "moriarty's red folder design"], weight: 50 },
        ],
        idealVoiceResponseEn: "It was not merely personal greed behind this treason, but Moriarty's grand design in the Red Folder.",
        alternativeResponsesEn: [
          { phraseEn: "It was not simply domestic corruption, but Moriarty's calculated agenda hidden within the Red Dossier.", translationFa: "صرفاً فساد داخلی نبود، بلکه برنامه سنجیده موریارتی پنهان‌شده در پرونده سرخ بود." },
          { phraseEn: "What orchestrated this conspiracy was not solitary betrayal, but Moriarty's overarching imperial plot.", translationFa: "آنچه این توطئه را هدایت کرد خیانتی فردی نبود، بلکه نقشه فراگیر امپراتوری موریارتی بود." },
        ],
        whiteHintFa: "از ساختار شکافته تأکیدی It was not merely... but... برای جمع‌بندی استنتاج نهایی پرونده استفاده کن!",
        fallbackChoices: [
          "It was not merely personal greed behind this treason, but Moriarty's grand design in the Red Folder.",
          "The River Thames flows quietly beneath Westminster Bridge as London sleeps peacefully.",
          "We should return to Baker Street to inspect our chemistry laboratory equipment.",
        ],
        aefReference: "AEF 5 Unit 10C (Discourse synthesis & advanced cleft structures)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "A letter from Moriarty... addressed to you, Sherlock! Read it aloud!",
          textFa: "نامه‌ای از طرف موریارتی... خطاب به تو، شرلوک! بلند بخوانش!",
        },
      },
    ],
    possibleEndings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان پیروزمندانه: بازپس‌گیری دفترچه تاج، نجات پادشاهی و نامه سرخ موریارتی",
        titleEn: "ENDING 1: CASE SOLVED — The Sovereign Triumph at Big Ben!",
        badgeTitleFa: "🎖️ پیروزی درخشان سطح C1: پاسداری از تاج و بقای پادشاهی بریتانیا",
        imageSrc: "/images/skills/speaking/c1_scene_ending_victory.jpg",
        climaxStoryFa: "چرخ‌دنده‌ها مهار شدند و ضربه زنگ ساعت ۱۲ با آرامش در شب لندن طنین‌انداز شد. دارلینگتون به دست گارد سپرده شد و پوشه شماره ۳ به سلامت بازگردانده شد.",
        climaxStoryEn: "The escapement was secured, and the midnight chimes rang peacefully across London. Folder Number Three was safely returned to the Crown.",
        revealDialogueFa: `نامه سرخ موریارتی با جوهر سیاه چنین می‌گوید:
«شرلوک عزیزم،
تبریک می‌گویم. تو امشب سلطنت بریتانیا را نجات دادی، اما دفترچه تاج فقط یک قربانی پیاده در بازی شطرنج جهانی ما بود!
من در سایه هیاهوی امشب تو در لندن، پوشه شماره ۴ را به دست آوردم: «کدهای محرمانه تسلیحاتی ناوگان در دریای شمال».
در سطح C2، برای بازپس‌گیری این پوشه باید به مخفیگاه نهایی من در سوئیس و آبشار رایشنباخ بیایی... جایی که یکی از ما هرگز زنده برنخواهد گشت!»

واتسون دست بر شانه شما می‌گذارد: «هلمز، پرونده سوم بسته شد... اما مقصد بعدی کجاست؟»
پالتوی خود را مرتب می‌کنید و با لبخندی آرام می‌گویید:
«آبشار رایشنباخ، جان... پایان بازی نزدیک است.»`,
        revealDialogueEn: "Moriarty's letter reveals: 'You saved London, but while you were busy, I acquired Folder Number Four. Meet me at the Reichenbach Falls in C2 for our final stand!'",
        nextTierHintFa: "پرونده سطح C1 با موفقیت کامل حل شد! اکنون با تسلط کامل بر زبان دیپلماتیک و استنتاج‌های پیشرفته، آماده ورود به نبرد نهایی در سطح C2 (پرونده آبشار رایشنباخ) هستید!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان ناکام: انفجار ساعت بیگ‌بن و فرار موریارتی با اسناد محرمانه",
        titleEn: "ENDING 2: CASE FAILED — The Chimes of Chaos Over London!",
        badgeTitleFa: "⚠️ پرونده ناکام: آسیب به ساعت ملی و درز بخش‌هایی از اسناد تاج",
        imageSrc: "/images/skills/speaking/c1_scene_ending_failure.jpg",
        climaxStoryFa: "چرخ‌دنده‌ها آسیب دیدند و ناقوس ناقص نواخت. دارلینگتون دستگیر شد اما برخی از کدهای دیپلماتیک پیش از خلع سلاح مخابره گردید.",
        climaxStoryEn: "The gears jammed violently and the chime shattered. Although Darlington was apprehended, parts of the royal code were transmitted.",
        revealDialogueFa: `در میان ویرانی نسبی اتاق زنگ‌ها، نامه سرخ موریارتی پیدا می‌شود که اعلام می‌کند سه پوشه اول صرفاً پیش‌درآمدی برای سرقت پوشه چهارم در اروپا بوده است.
شرلوک به واتسون نگاه می‌کند و می‌گوید: «ما زمان کمی برای جبران داریم... بازی نهایی در سوئیس رقم خواهد خورد.»`,
        revealDialogueEn: "Moriarty mocks the delayed intervention and invites Sherlock to the final reckoning at the Reichenbach Falls in C2.",
        nextTierHintFa: "اگرچه درز اسناد مهار شد، اما موریارتی شما را به نبرد نهایی سطح C2 در کوه‌های آلپ فرامی‌خواند!",
      },
    },
  },
];
