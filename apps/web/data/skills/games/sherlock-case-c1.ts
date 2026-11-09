import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR C1 CASE: "CASE FILE #05: THE CROWN LEDGER & THE BUCKINGHAM MASQUERADE"
// Official CEFR C1 Vocabulary & Grammar (American English File 5 - Advanced):
// - Advanced Inversion for Dramatic Emphasis: Seldom have we..., Scarcely had we..., Under no circumstances...
// - Advanced Cleft Sentences: It was not merely the royal scandal..., What remains imperative is that...
// - Advanced Subjunctive & Hypothetical Conditionals: Were Lord Pemberton to comprehend..., Had it not been for...
// - High-Register Discourse Markers & Participle Clauses: Having meticulously neutralized..., Bearing in mind that...
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
    storyIntroFa: "ساعت ۱۰:۱۵ شب است و باران پاییزی شیشه‌های بلند کاخ سلطنتی باکینگهام را خیس کرده است. پس از مهار شورش زندان دارتمور، سرنخ برگه زرکوب به‌جامانده در استوانه نقره‌ای استرلینگ شما و دکتر واتسون را به ضیافت بالماسکه سالانه دربار کشانده است. صدها نجیب‌زاده، سفیر خارجی و درباری با نقاب‌های نقره‌ای و پرهای طاووس زیر چلچراغ‌های خیره‌کننده در حال رقص والس هستند. با این حال، شما بلافاصله در میان عطر گل سرخ، رایحه تلخ گوگرد و روغن روان‌ساز مکانیکی را تشخیص می‌دهید. در کمد مخفی پیشخدمت‌ها، پیکر بی‌هوش سرپیشخدمت دربار به همراه یادداشتی با جوهر طلا کشف می‌شود: «راس ساعت ۱۲:۰۰، تاج سقوط خواهد کرد.»",
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
          textEn: "Observe the subtle tension beneath the festive masks, Watson. The sulfur residue confirms Moriarty's agents have breached the state apartments!",
          textFa: "تنش پنهان پشت این نقاب‌های پر زرق‌وبرق را ببین واتسون. رد گوگرد ثابت می‌کند عمال موریارتی وارد آپارتمان‌های دولتی کاخ شده‌اند!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در لباس رسمی دربار",
          speakerAvatar: "🩺",
          textEn: "The coded cipher in the butler's pocket threatens the monarchy itself! If Folder Number Three leaks to Fleet Street, the government will fall!",
          textFa: "پیام رمزی در جیب پیشخدمت خود نظام سلطنت را تهدید می‌کند! اگر پوشه شماره ۳ به مطبوعات فلیت‌استریت درز کند، دولت سقوط خواهد کرد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-1-cleft-sentence-realm",
        titleFa: "استنتاج راهبردی با جمله شکافته تأکیدی (Cleft Sentence)",
        speakerPromptEn: "Adjust your domino mask and state the high-stakes national crisis using an emphatic cleft sentence...",
        speakerPromptFa: "نقاب دومینوی خود را مرتب می‌کنی و بحران ملی فوق‌العاده حساس را با یک جمله شکافته تأکیدی بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته It is not merely)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «امشب صرفاً آبروی دربار در خطر نیست، بلکه ثبات و پایداری خود پادشاهی در معرض تهدید است.»",
        targetKeywords: [
          { phrase: "It is not merely the royal", hintFa: "(صرفاً آبروی سلطنت نیست)", synonyms: ["it is not merely the royal", "it is not only the royal", "it is not simply the royal"], weight: 50 },
          { phrase: "very stability of the realm", hintFa: "(ثبات و پایداری خود پادشاهی)", synonyms: ["very stability of the realm", "stability of the whole realm", "stability of the kingdom"], weight: 50 },
        ],
        idealVoiceResponseEn: "It is not merely the royal reputation that hangs in the balance tonight, but the very stability of the realm.",
        alternativeResponsesEn: [
          { phraseEn: "It is not merely the royal dignity at risk, but the very stability of the realm that is threatened.", translationFa: "صرفاً شأن دربار در معرض خطر نیست، بلکه پایداری کل پادشاهی است که تهدید می‌شود." },
          { phraseEn: "It is not simply the royal family in jeopardy, but the very stability of the realm itself.", translationFa: "صرفاً خانواده سلطنتی در خطر نیست، بلکه ثبات خود قلمرو پادشاهی است." },
        ],
        whiteHintFa: "از ساختار شکافته تأکیدی It is not merely the royal reputation that... but the very stability of the realm استفاده کن!",
        fallbackChoices: [
          "It is not merely the royal reputation that hangs in the balance tonight, but the very stability of the realm.",
          "The chandeliers in this ballroom are illuminated with high-pressure gas jets.",
          "The string quartet is currently playing a classical Viennese waltz.",
        ],
        aefReference: "AEF 5 Unit 1A (Cleft sentences with What / It is not merely... that)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look at the far balcony, Holmes! Lord Pemberton is whispering to an unidentified masked courtier!",
          textFa: "به بالکن انتهای سالن نگاه کن هلمز! لرد پمبرتون در حال پچ‌پچ کردن با یک درباری نقاب‌دار ناشناس است!",
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
    storyIntroFa: "شما و واتسون در میان جمعیت رقصندگان نفوذ می‌کنید. شرلوک سه مظنون اصلی با نقاب شاهین طلایی را زیر نظر دارد. لرد پمبرتون، مشاور امور مالی دربار و معتمد پیشین ملکه، با دستی لرزان در گوشه سالن جام شامپاین را می‌نوشد و نگاه هراسانش مدام به عقربه‌های ساعت برنزی سالن دوخته شده است. در همین لحظه، کاپیتان هاوارد از گارد کاخ زمزمه می‌کند که خطوط محرمانه تلگراف در طبقه دوم سیگنال‌های مشکوکی به بیرون ارسال می‌کنند. تنها چند دقیقه تا جابجایی دفترچه فرصت دارید.",
    cutscene: {
      titleFa: "لرد پمبرتون در محاصره رقصندگان و تلگراف مشکوک طبقه بالا",
      titleEn: "Lord Pemberton Amid the Dancers & The Rogue Telegraph",
      imageSrc: "/images/skills/speaking/c1_scene_2_ballroom_dilemma.jpg",
      dialogues: [
        {
          speakerId: "pemberton",
          speakerNameFa: "لرد پمبرتون",
          speakerRoleFa: "مشاور مالی دربار (نقاب شاهین طلایی)",
          speakerAvatar: "🎭",
          textEn: "Leave me be, sir! The affairs of the Privy Council are not for curious masqueraders to scrutinize!",
          textFa: "مرا به حال خود بگذارید آقا! امور شورای خصوصی ملکه جای کنجکاوی رقصندگان بالماسکه نیست!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی در کمین",
          speakerAvatar: "🩺",
          textEn: "His pulse is racing at over a hundred beats, Holmes! Do we corner him psychologically here, or storm the telegraph suite upstairs?!",
          textFa: "نبضش بالای صد ضربه می‌زند هلمز! آیا همین‌جا با روان‌شناسی او را در تنگنا بگذاریم، یا به اتاق تلگراف بالا هجوم ببریم؟! ",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-1",
      promptFa: "یک دوراهی استراتژیک و دیپلماتیک: آیا با بازی روان‌شناختی لرد را در میان رقصندگان وادار به اعتراف می‌کنید یا مستقیماً به اتاق تلگراف نفوذ می‌کنید؟",
      promptEn: "Strategic Dilemma: Interrogate Lord Pemberton subtly amid the dancers, or breach the telegraph chamber directly?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Interrogate Lord Pemberton with diplomatic psychology on the ballroom floor",
          labelFa: "گزینه ۱الف: بازجویی دیپلماتیک روان‌شناختی در میان رقصندگان و مهار بی سر و صدای لرد خائن",
          descriptionFa: "لرد در سکوت اعتراف می‌کند، کلید آرشیو و کد شناسایی مأمور موریارتی را لو می‌دهد و مسیر بدون جلب توجه گارد باز می‌شود.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Breach the private telegraph chamber upstairs to sever rogue wires",
          labelFa: "گزینه ۱ب: نفوذ فیزیکی به اتاق تلگراف و شنود سیم‌ها با پذیرش ریسک هشدار عمومی",
          descriptionFa: "سیم‌های تلگراف قطع می‌شوند اما درگیری مسلحانه رخ می‌دهد و سارق با احساس خطر، گالری را بمب‌گذاری می‌کند.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-2-inversion-adversary",
        titleFa: "استنتاج دراماتیک با ساختار وارونگی رسمی (Negative Inversion)",
        speakerPromptEn: "Step into the circle of whispering nobles and express your deduction using negative inversion...",
        speakerPromptFa: "وارد حلقه نجیب‌زادگان پچ‌پچ‌کننده می‌شوی و استنتاج خود را با ساختار وارونگی نفی بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (ساختار وارونگی Seldom have we encountered)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «به ندرت با حریفی مواجه شده‌ایم که قادر به سامان‌دهی چنین خرابکاری عمیقی درست در زیر چشمان دربار سلطنتی باشد.»",
        targetKeywords: [
          { phrase: "Seldom have we encountered an", hintFa: "(به ندرت با حریفی مواجه شده‌ایم)", synonyms: ["seldom have we encountered an", "rarely have we encountered an", "seldom have we faced an"], weight: 50 },
          { phrase: "beneath the Crown's direct gaze", hintFa: "(درست زیر چشمان مستقیم دربار)", synonyms: ["beneath the crown's direct gaze", "under the crown's direct gaze", "beneath the royal gaze"], weight: 50 },
        ],
        idealVoiceResponseEn: "Seldom have we encountered an adversary capable of orchestrating such profound subversion beneath the Crown's direct gaze.",
        alternativeResponsesEn: [
          { phraseEn: "Rarely have we witnessed an adversary capable of orchestrating such high treason beneath the Crown's direct gaze.", translationFa: "به ندرت شاهد حریفی بوده‌ایم که قادر به سازمان‌دهی چنین خیانت بزرگی زیر چشمان دربار باشد." },
          { phraseEn: "Seldom have we seen a traitor daring to conduct such subversion beneath the Crown's direct gaze.", translationFa: "به ندرت خائنی دیده‌ایم که جرئت کند چنین براندازی‌ای را زیر دید مستقیم سلطنت اجرا کند." },
        ],
        whiteHintFa: "از ساختار وارونگی آغازین Seldom have we encountered an adversary... beneath the Crown's direct gaze استفاده کن!",
        fallbackChoices: [
          "Seldom have we encountered an adversary capable of orchestrating such profound subversion beneath the Crown's direct gaze.",
          "The diplomatic delegations from France and Prussia are mingling near the grand fountain.",
          "Lord Pemberton's silver signet ring bears the traditional crest of Northumbria.",
        ],
        aefReference: "AEF 5 Unit 2B (Inversion after negative adverbs: Seldom / Rarely / Little did I know)",
        npcResponse: {
          speakerNameFa: "لرد پمبرتون",
          speakerRoleFa: "مشاور هراسان دربار",
          speakerAvatar: "🎭",
          textEn: "You speak of nightmares, Holmes! The masked messenger is already inside the Queen's Gallery!",
          textFa: "شما از کابوس سخن می‌گویید هلمز! فرستاده نقاب‌دار هم‌اکنون داخل گالری اختصاصی ملکه است!",
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
    titleFa: "پرده سوم: پیامد تصمیم اول — اعتراف در سکوت یا هشدار عمومی",
    titleEn: "Stage 3: Aftermath of Decision 1 — Quiet Surrender or Imperial Alert",
    locationFa: "دهلیزهای تشریفاتی مشرف به بالکن خصوصی ملکه",
    locationEn: "State Corridors leading to the Queen's Archival Suite",
    storyIntroFa: "پیامدهای تصمیم نخست شما در تالار نمایان می‌شود...",
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "شاخه ۱الف: اعتراف در سکوت لرد پمبرتون و کلید نقره‌ای گاوصندوق",
        titleEn: "Branch 1A: Pemberton's Quiet Surrender & The Silver Key",
        locationFa: "گوشه دنج گالری نقاشی‌های سلطنتی",
        locationEn: "Secluded Alcove, Royal Portrait Gallery",
        storyIntroFa: "لرد پمبرتون زیر فشار روانی استنتاج‌های برنده هلمز فرو می‌ریزد. او در گوشه دنج گالری با صدایی لرزان اعتراف می‌کند: «موریارتی خانواده‌ام را تهدید کرد! مأمور ارشد او معروف به 'کلاغ سیاه' با لباس مبدل خادم کلیسا وارد گالری آرشیو شده و کلید نقره‌ای را در دست دارد.» مسیر بدون جلب توجه گارد و در نهایت خونسردی باز می‌شود.",
        tasks: [
          {
            id: "task-c1-3-subjunctive-pemberton",
            titleFa: "بیان فرضی با وجه التزامی رسمی (Advanced Inverted Subjunctive)",
            speakerPromptEn: "Listen to Pemberton's confession and speak your advanced hypothetical deduction...",
            speakerPromptFa: "به اعترافات پمبرتون گوش فرا می‌دهی و استنتاج فرضی پیشرفته‌ات را با وجه التزامی بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (وجه التزامی Were Lord Pemberton to)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر لرد پمبرتون عواقب وخیم خیانتش را درک می‌کرد، رمز اصلی را بدون درنگ تسلیم می‌نمود.»",
            targetKeywords: [
              { phrase: "Were Lord Pemberton to comprehend", hintFa: "(اگر لرد پمبرتون درک می‌کرد)", synonyms: ["were lord pemberton to comprehend", "if lord pemberton comprehended", "were pemberton to understand"], weight: 50 },
              { phrase: "surrender the master cipher without delay", hintFa: "(رمز اصلی را بی درنگ تسلیم می‌کرد)", synonyms: ["surrender the master cipher without delay", "hand over the master cipher immediately", "yield the master cipher without delay"], weight: 50 },
            ],
            idealVoiceResponseEn: "Were Lord Pemberton to comprehend the dire consequences of his treason, he would surrender the master cipher without delay.",
            alternativeResponsesEn: [
              { phraseEn: "Were he to realize the dire consequences of this treason, he would yield the secret code without delay.", translationFa: "اگر او پیامدهای وخیم این خیانت را درک می‌کرد، کد مخفی را بدون درنگ واگذار می‌کرد." },
              { phraseEn: "Were Lord Pemberton fully aware of the disaster, he would surrender the master cipher immediately.", translationFa: "اگر لرد پمبرتون کاملاً از فاجعه آگاه بود، رمز اصلی را فوراً تسلیم می‌کرد." },
            ],
            whiteHintFa: "از ساختار شرطی التزامی Were Lord Pemberton to comprehend... he would surrender the master cipher without delay استفاده کن!",
            fallbackChoices: [
              "Were Lord Pemberton to comprehend the dire consequences of his treason, he would surrender the master cipher without delay.",
              "The gilded frame depicts King George III in royal coronation robes.",
              "This corridor is guarded by two Yeomen of the Guard in ceremonial uniforms.",
            ],
            aefReference: "AEF 5 Unit 4B (Unreal conditionals & Inverted subjunctive: Were he to do... / Had he known)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "He handed over the archive bypass key! Let us sprint to the Queen's Suite before the vault is cleaned out!",
              textFa: "او کلید میانبر بایگانی را تحویل داد! بیایید پیش از خالی شدن گاوصندوق به سوی سوئیت ملکه بدویم!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "شاخه ۱ب: هشدار در اتاق تلگراف و تیراندازی نگهبان",
        titleEn: "Branch 1B: Telegraph Room Firefight & Heightened Security",
        locationFa: "اتاق تلگراف خصوصی دربار در طبقه دوم کاخ",
        locationEn: "Private Telegraph Office, Second Floor, Buckingham Palace",
        storyIntroFa: "شما سیم‌های تلگراف را قطع می‌کنید، اما محافظ مسلح موریارتی شلیک می‌کند! گلوله به گلدان عتیقه می‌خورد. هرچند واتسون او را خلع سلاح می‌کند، اما صدای درگیری فرستاده موریارتی را هشیار کرده است. او زودتر از موعد درب گاوصندوق را منفجر کرده و راهرو را با تله‌های دودزا آلوده ساخته است.",
        tasks: [
          {
            id: "task-c1-3-conditional-telegraph",
            titleFa: "استنتاج شرطی گذشته معکوس درباره حفظ آرامش دربار",
            speakerPromptEn: "Step over the broken porcelain and analyze the compromised security perimeter...",
            speakerPromptFa: "از روی تکه‌های چینی شکسته عبور می‌کنی و وضعیت امنیتی نقض‌شده را تحلیل می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we interrogated)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر توطئه‌گر را در سکوت روی صحنه رقص بازجویی می‌کردیم، حریم امنیتی کاملاً دست‌نخورده باقی می‌ماند.»",
            targetKeywords: [
              { phrase: "Had we interrogated the conspirator", hintFa: "(اگر توطئه‌گر را بازجویی می‌کردیم)", synonyms: ["had we interrogated the conspirator", "if we had interrogated the conspirator", "had we questioned the conspirator"], weight: 50 },
              { phrase: "security perimeter would have remained", hintFa: "(حریم امنیتی باقی می‌ماند)", synonyms: ["security perimeter would have remained", "palace perimeter would have remained", "perimeter would have stayed"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we interrogated the conspirator quietly on the dance floor, the security perimeter would have remained entirely undisturbed.",
            alternativeResponsesEn: [
              { phraseEn: "Had we questioned the rogue advisor quietly downstairs, the palace security would have remained fully intact.", translationFa: "اگر از مشاور خائن در پایین بی سروصدا بازجویی کرده بودیم، امنیت کاخ کاملاً دست‌نخورده می‌ماند." },
              { phraseEn: "If we had engaged him subtly on the floor, the security perimeter would have remained safe.", translationFa: "اگر با ظرافت روی صحنه رقص با او برخورد می‌کردیم، حریم امنیتی ایمن باقی می‌ماند." },
            ],
            whiteHintFa: "از ساختار شرطی سوم معکوس Had we interrogated the conspirator quietly... the security perimeter would have remained entirely undisturbed استفاده کن!",
            fallbackChoices: [
              "Had we interrogated the conspirator quietly on the dance floor, the security perimeter would have remained entirely undisturbed.",
              "The brass telegraph key has ceased transmitting signals to the London docks.",
              "The smoke from the discharged firearm is drifting out into the courtyard.",
            ],
            aefReference: "AEF 5 Unit 4B (Inverted past conditionals: Had we done... would have remained)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The hallway is filled with sulfur smoke! The rogue messenger is fleeing toward the Queen's Gallery!",
              textFa: "راهرو پر از دود گوگرد است! فرستاده خائن در حال فرار به سوی گالری ملکه است!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-3-default-fallback",
        titleFa: "تحلیل پیشروی در راهروی تشریفات ملکه",
        speakerPromptEn: "Advance through the corridor and assess the security state...",
        speakerPromptFa: "در راهرو پیش می‌روی و وضعیت امنیتی را ارزیابی می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (ساختار وجه التزامی پیشرفته)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر لرد پمبرتون عواقب وخیم خیانتش را درک می‌کرد، رمز اصلی را بدون درنگ تسلیم می‌نمود.»",
        targetKeywords: [
          { phrase: "Were Lord Pemberton to comprehend", hintFa: "(اگر لرد پمبرتون درک می‌کرد)", synonyms: ["were lord pemberton to comprehend", "if lord pemberton comprehended"], weight: 50 },
          { phrase: "surrender the master cipher without delay", hintFa: "(رمز را تسلیم می‌کرد)", synonyms: ["surrender the master cipher without delay", "hand over the cipher"], weight: 50 },
        ],
        idealVoiceResponseEn: "Were Lord Pemberton to comprehend the dire consequences of his treason, he would surrender the master cipher without delay.",
        alternativeResponsesEn: [
          { phraseEn: "Were he to understand the danger, he would surrender the master cipher without delay.", translationFa: "اگر او خطر را می‌فهمید، رمز اصلی را بدون درنگ تسلیم می‌کرد." },
        ],
        whiteHintFa: "از ساختار Were Lord Pemberton to comprehend... استفاده کن!",
        fallbackChoices: [
          "Were Lord Pemberton to comprehend the dire consequences of his treason, he would surrender the master cipher without delay.",
          "The state corridor is lined with crimson velvet tapestries.",
        ],
        aefReference: "AEF 5 Unit 4B (Inverted Subjunctive)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Hurry, Holmes! The archive vault is right ahead!",
          textFa: "عجله کن هلمز! گاوصندوق بایگانی درست پیش روی ماست!",
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
    titleFa: "پرده چهارم: گالری خصوصی اسناد و کشف سرنگ زهر افعی",
    titleEn: "Stage 4: The Queen's Archival Gallery & The Viper Venom Dart",
    locationFa: "گالری اسناد محرمانه دربار و گاوصندوق دیواری ملکه",
    locationEn: "The Queen's Private Archival Gallery, Buckingham Palace",
    storyIntroFa: "شما و واتسون وارد گالری اختصاصی آرشیو ملکه می‌شوید. درب سنگین چوبی با لولاهای طلایی نیمه‌باز است. رئیس کهنه‌کار دفتر آرشیو روی صندلی چرمی سلطنتی خود بیابانی تکیه داده و چشمانش خیره مانده است؛ یک سوزن مینیاتوری پر از زهر مهلک افعی هندی (نشان انحصاری آزمایشگاه سلاح‌های شیمیایی موریارتی که در پرونده B2 کشف شده بود) به شاهرگ گردنش اصابت کرده است! درب گاوصندوق مخفی پشت تابلوی پرتره باز است؛ تمام اسناد مالیات و قراردادها دست‌نخورده مانده و تنها یک کتاب با جلد چرم زرشکی مفقود است: «دفترچه تاج [C1]»! ردپایی از دوده سیاه به سمت تالار تاج‌وتخت کشیده شده است.",
    cutscene: {
      titleFa: "ترور بایگان ارشد و کشف جای خالی دفترچه تاج",
      titleEn: "The Assassinated Archivist & The Empty Vault Compartment",
      imageSrc: "/images/skills/speaking/c1_scene_4_queen_gallery_vault.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک جنایی در حال معاینه",
          speakerAvatar: "🩺",
          textEn: "Cyanosis on his lips, Holmes! This is the exact concentrated viper toxin developed in Dr. Vance's classified Dartmoor laboratory!",
          textFa: "کبودی روی لب‌هایش را ببین هلمز! این دقیقاً همان سم غلیظ افعی است که در آزمایشگاه محرمانه دارتمور دکتر ونس ساخته شده بود!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at the empty velvet shelf. Millions in imperial bonds were ignored; the assassin sought Folder Number Three and nothing else!",
          textFa: "به طبقه مخملی خالی نگاه کن. میلیون‌ها پوند اوراق قرضه سلطنتی نادیده گرفته شده؛ قاتل فقط به دنبال پوشه شماره سه بوده و بس!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-4-participle-cleft-venom",
        titleFa: "توصیف هدفمندی ترور با ترکیب وجه وصفی کامل و کانون تأکیدی",
        speakerPromptEn: "Kneel beside the velvet vault shelf and articulate the intruder's calculated precision...",
        speakerPromptFa: "کنار طبقه مخملی گاوصندوق زانو می‌زنی و دقت حساب‌شده نفوذگر را با وجه وصفی کامل بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وجه وصفی کامل Having meticulously neutralized)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «نفوذگر پس از از پای درآوردن دقیق بایگان با زهر افعی، عمداً تنها دفترچه سوم را هدف قرار داده است.»",
        targetKeywords: [
          { phrase: "Having meticulously neutralized the archivist", hintFa: "(پس از از پای درآوردن دقیق بایگان)", synonyms: ["having meticulously neutralized the archivist", "having neutralized the archivist", "after meticulously neutralizing the archivist"], weight: 50 },
          { phrase: "targeted the third ledger alone", hintFa: "(تنها دفترچه سوم را هدف قرار داده)", synonyms: ["targeted the third ledger alone", "targeted only the third ledger", "singled out the third ledger alone"], weight: 50 },
        ],
        idealVoiceResponseEn: "Having meticulously neutralized the archivist with viper venom, the intruder deliberately targeted the third ledger alone.",
        alternativeResponsesEn: [
          { phraseEn: "Having eliminated the senior archivist with lethal venom, the thief deliberately targeted the third ledger alone.", translationFa: "پس از حذف بایگان ارشد با زهر کشنده، سارق عمداً تنها دفترچه سوم را هدف گرفت." },
          { phraseEn: "Having neutralized the guardian of the vault, the assassin targeted the third ledger alone.", translationFa: "پس از از پا درآوردن نگهبان گاوصندوق، قاتل تنها دفترچه سوم را هدف قرار داد." },
        ],
        whiteHintFa: "از عبارت وجه وصفی Having meticulously neutralized the archivist... targeted the third ledger alone استفاده کن!",
        fallbackChoices: [
          "Having meticulously neutralized the archivist with viper venom, the intruder deliberately targeted the third ledger alone.",
          "The oil painting concealing this wall safe represents the naval victory at Trafalgar.",
          "The archivist's pocket watch stopped precisely at eleven minutes past eleven.",
        ],
        aefReference: "AEF 5 Unit 3A (Participle clauses: Having done / Being aware of)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Listen! A commotion in the Throne Room! The assassin has scrambled onto the balcony!",
          textFa: "گوش کن! هیاهویی در تالار تاج‌وتخت بلند شده! قاتل روی بالکن پریده است!",
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
    titleFa: "تصمیم دوم: تالار تاج‌وتخت و بحران لوستر گازسوز",
    titleEn: "DECISION 2: The Throne Room & The Falling Gas Chandelier",
    locationFa: "تالار عظیم تاج‌وتخت با چلچراغ برنزی گازسوز ۴ تنی",
    locationEn: "The Throne Room Chandelier Chamber, Buckingham Palace",
    storyIntroFa: "شما به تالار تاج‌وتخت می‌رسید. فرستاده نقاب‌دار موریارتی معروف به «کلاغ سیاه» روی بالکن بالایی با پالتوی چرمی سیاه دیده می‌شود؛ او دفترچه تاج را در دست دارد. او برای پوشش فرار خود و کشتار خاندان سلطنتی، کابل قرقره نگهدارنده لوستر عظیم گازسوز ۴ تنی سالن را بریده و فتیله تأخیری باروتی را مشتعل ساخته است! لوله‌های گاز پرفشار شهری زیر لوستر متصل هستند؛ اگر لوستر سقوط کند، انفجاری مهیب ۲۰۰ میهمان و اشراف‌زادگان را در کام آتش فرو خواهد برد. کلاغ سیاه به سوی خروجی باغ قصر و پل وست‌مینستر می‌دود.",
    cutscene: {
      titleFa: "فرستاده نقاب‌دار روی بالکن و لوستر گازسوز در آستانه سقوط",
      titleEn: "The Masked Courier & The Sabotaged Gas Chandelier",
      imageSrc: "/images/skills/speaking/c1_scene_5_throne_room_chandelier.jpg",
      dialogues: [
        {
          speakerId: "raven",
          speakerNameFa: "کلاغ سیاه (فرستاده نقاب‌دار)",
          speakerRoleFa: "عامل اجرایی موریارتی در بالکن",
          speakerAvatar: "🦹",
          textEn: "Farewell, detective! Save your precious aristocrats if you can, while the secrets of the Crown fly to the printing presses!",
          textFa: "خداحافظ کارآگاه! اگر می‌توانی اشراف عزیزت را نجات بده، در حالی که اسرار تاج به سوی چاپخانه‌ها پرواز می‌کنند!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در وحشت",
          speakerAvatar: "🩺",
          textEn: "The iron winch is unraveling, Holmes! Two hundred souls are directly beneath that four-ton brass chandelier!",
          textFa: "قرقره آهنی دارد باز می‌شود هلمز! دویست انسان درست زیر آن لوستر برنزی چهار تنی هستند!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-2",
      promptFa: "بحران مرگبار انسانی در برابر تعقیب اسناد: آیا کابل لوستر گازسوز و شیر فشار را مهار می‌کنید یا مستقیماً به دنبال فرستاده می‌دوید؟",
      promptEn: "Catastrophic Moral Dilemma: Secure the falling gas chandelier to save 200 lives, or pursue the masked courier immediately?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Secure the chandelier winch and shut the main gas valve with Watson",
          labelFa: "گزینه ۲الف: مهار شیر اصلی گاز و تثبیت کابل لوستر با واتسون برای نجات جان میهمانان دربار",
          descriptionFa: "جان ۲۰۰ انسان نجات می‌یابد، خاندان سلطنتی در امان می‌مانند و گارد دربار با تمام اختیارات برای تعقیب به یاری هلمز می‌شتابد.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Ignore the chandelier and pursue the masked courier toward Westminster Bridge",
          labelFa: "گزینه ۲ب: رها کردن لوستر و تعقیب بی‌درنگ فرستاده نقاب‌دار به سمت پل وست‌مینستر",
          descriptionFa: "لوستر واژگون شده و گاز آتش می‌گیرد؛ تالار در هرج‌ومرج و وحشت فرو می‌رود و خیابان‌های خروجی با ازدحام مسدود می‌شود.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-5-subjunctive-insistence-chandelier",
        titleFa: "فرمان قاطع با وجه التزامی تأکیدی و عبارت شرطی lest",
        speakerPromptEn: "Grasp the heavy iron winch lever and shout your authoritative imperative...",
        speakerPromptFa: "اهرم سنگین قرقره آهنی را می‌گیری و دستور قاطعانه و التزامی خود را فریاد می‌زنی...",
        speakerRoleFa: "شرلوک هلمز (وجه التزامی I insist that we secure)",
        speakerAvatar: "🔍",
        taskInstructionFa: "فریاد بزن: «اصرار دارم که فوراً سازوکار لوستر در حال سقوط را ایمن کنیم، مبادا صدها میهمان در این انفجار هلاک شوند.»",
        targetKeywords: [
          { phrase: "I insist that we secure", hintFa: "(اصرار دارم که ایمن کنیم)", synonyms: ["i insist that we secure", "i demand that we secure", "we must insist that we secure"], weight: 50 },
          { phrase: "lest hundreds of noble guests perish", hintFa: "(مبادا صدها میهمان هلاک شوند)", synonyms: ["lest hundreds of noble guests perish", "lest hundreds of guests perish", "so that hundreds of guests do not perish"], weight: 50 },
        ],
        idealVoiceResponseEn: "I insist that we secure the falling chandelier mechanism immediately, lest hundreds of noble guests perish in the blast.",
        alternativeResponsesEn: [
          { phraseEn: "I insist that we secure the winch mechanism at once, lest hundreds of innocent nobles perish in the explosion.", translationFa: "من اصرار دارم که سازوکار قرقره را فوراً مهار کنیم، مبادا صدها اشراف‌زاده بی‌گناه در انفجار هلاک شوند." },
          { phraseEn: "We must ensure that the falling chandelier be secured immediately, lest scores of lives be lost tonight.", translationFa: "ما باید اطمینان یابیم که لوستر در حال سقوط فوراً مهار شود، مبادا امشب جان‌های بسیاری از دست برود." },
        ],
        whiteHintFa: "از ساختار وجه التزامی I insist that we secure the falling chandelier mechanism immediately, lest hundreds of noble guests perish... استفاده کن!",
        fallbackChoices: [
          "I insist that we secure the falling chandelier mechanism immediately, lest hundreds of noble guests perish in the blast.",
          "The gas pressure gauge indicates eighty pounds per square inch.",
          "The coronation throne is embroidered with silver fleur-de-lis patterns.",
        ],
        aefReference: "AEF 5 Unit 5B (Subjunctive with demand/insist that someone do & archaic conjunctions: lest / for fear that)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "I've locked the emergency safety brake, Holmes! The chandelier has held! Now let us hunt that fiend!",
          textFa: "من ترمز اضطراری ایمنی را قفل کردم هلمز! لوستر ایستاد! حالا بگذار به شکار آن اهریمن برویم!",
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
    titleFa: "پرده ششم: پیامد تصمیم دوم — احترام دربار یا هرج‌ومرج شبانه",
    titleEn: "Stage 6: Aftermath of Decision 2 — Imperial Honor or Midnight Chaos",
    locationFa: "دروازه شرقی کاخ باکینگهام و جاده بارانی به سوی وست‌مینستر",
    locationEn: "Palace East Gate & The Rain-Slicked Embankment to Westminster",
    storyIntroFa: "پیامدهای تصمیم شما در تالار تاج‌وتخت آشکار می‌شود...",
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "شاخه ۲الف: نجات میهمانان و پشتیبانی سواره‌نظام گارد سلطنتی",
        titleEn: "Branch 2A: Palace Guests Saved & Royal Escort Granted",
        locationFa: "حیاط بیرونی دروازه شرقی کاخ باکینگهام",
        locationEn: "Outer Courtyard, East Gate, Buckingham Palace",
        storyIntroFa: "لوستر در یک متری بالای سر میهمانان متوقف می‌شود و سوپاپ گاز بسته می‌گردد. سرهنگ براون، فرمانده گارد پادشاهی، با سپاسگزاری بی‌حد کلید دهلیزهای محرمانه وست‌مینستر و دو رأس اسب تیزرو را در اختیار هلمز و واتسون می‌گذارد. راه میانبر مستقیماً شما را پیش از فرستاده به دهلیز پنوماتیک می‌رساند.",
        tasks: [
          {
            id: "task-c1-6-inversion-ballroom",
            titleFa: "استنتاج افتخار ملی با ساختار معکوس Not only did we",
            speakerPromptEn: "Mount the royal stallion and report your progress using negative inversion...",
            speakerPromptFa: "بر اسب شاهی سوار می‌شوی و پیشرفت عملیات را با وارونگی نفی گزارش می‌دهی...",
            speakerRoleFa: "شرلوک هلمز (وارونگی Not only did we avert)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «نه تنها از انفجاری ویرانگر در تالار جلوگیری کردیم، بلکه مجوز حیاتی دربار را نیز به دست آوردیم.»",
            targetKeywords: [
              { phrase: "Not only did we avert", hintFa: "(نه تنها جلوگیری کردیم)", synonyms: ["not only did we avert", "not only did we prevent", "not only did we avoid"], weight: 50 },
              { phrase: "secured vital imperial clearance", hintFa: "(مجوز حیاتی دربار را کسب کردیم)", synonyms: ["secured vital imperial clearance", "gained vital imperial clearance", "obtained vital royal clearance"], weight: 50 },
            ],
            idealVoiceResponseEn: "Not only did we avert a cataclysmic explosion in the ballroom, but we also secured vital imperial clearance.",
            alternativeResponsesEn: [
              { phraseEn: "Not only did we prevent a deadly catastrophe in the ballroom, but we also gained full imperial cooperation.", translationFa: "نه تنها از فاجعه‌ای مرگبار در تالار جلوگیری کردیم، بلکه همکاری کامل دربار را نیز به دست آوردیم." },
              { phraseEn: "Not only did we avert the blast, but we also secured vital royal clearance to access the tunnels.", translationFa: "نه تنها انفجار را خنثی کردیم، بلکه مجوز حیاتی سلطنتی برای ورود به تونل‌ها را کسب نمودیم." },
            ],
            whiteHintFa: "از ساختار معکوس Not only did we avert a cataclysmic explosion... but we also secured vital imperial clearance استفاده کن!",
            fallbackChoices: [
              "Not only did we avert a cataclysmic explosion in the ballroom, but we also secured vital imperial clearance.",
              "The iron gates of Buckingham Palace are opening to the royal avenue.",
              "Raindrops are splashing against the gas lamps along the Mall.",
            ],
            aefReference: "AEF 5 Unit 2B (Inversion: Not only did we avert... but also)",
            npcResponse: {
              speakerNameFa: "سرهنگ براون",
              speakerRoleFa: "فرمانده گارد سلطنتی",
              speakerAvatar: "💂",
              textEn: "God save the Queen! Take the Victoria subterranean tunnel—it leads directly underneath Parliament!",
              textFa: "خداوند ملکه را حفظ کند! از تونل زیرزمینی ویکتوریا بروید—مستقیماً به زیر پارلمان می‌رسد!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "شاخه ۲ب: آتش‌سوزی در تالار و فرار دشوار در مه لندن",
        titleEn: "Branch 2B: Ballroom Blaze & Chaotic Foot Pursuit",
        locationFa: "باروی سنگی مشرف به خیابان بارانی وایت‌هال",
        locationEn: "Rain-Drenched Parapet Overlooking Whitehall",
        storyIntroFa: "انفجار گاز چلچراغ تالار را به تلی از آتش و شیشه بدل می‌سازد. فریادهای وحشت میهمانان دربار را پر می‌کند. شرلوک و واتسون با پالتوهای سوخته و شانه کوفته به سختی از میان گاری‌های آتش‌نشانی عبور می‌کنند. فرستاده موریارتی توانسته ۱۰ دقیقه جلوتر وارد دهلیز پنوماتیک پارلمان شود.",
        tasks: [
          {
            id: "task-c1-6-mixed-conditional-pursuit",
            titleFa: "تحلیل اشتباه تاکتیکی با شرطی نوع سوم گذشته",
            speakerPromptEn: "Sprint through the pouring rain and evaluate the strategic cost of the ballroom catastrophe...",
            speakerPromptFa: "در باران سیل‌آسا می‌دوی و هزینه استراتژیک فاجعه تالار را با شرطی نوع سوم ارزیابی می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی نوع سوم If we had prioritized)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر مهار قرقره لوستر را در اولویت قرار داده بودیم، اکنون گارد سلطنتی در تعقیب در امتداد ساحل به ما کمک می‌کرد.»",
            targetKeywords: [
              { phrase: "If we had prioritized the chandelier", hintFa: "(اگر لوستر را در اولویت قرار داده بودیم)", synonyms: ["if we had prioritized the chandelier", "had we prioritized the chandelier", "if we had secured the chandelier"], weight: 50 },
              { phrase: "would now be aiding our pursuit", hintFa: "(اکنون به تعقیب ما کمک می‌کرد)", synonyms: ["would now be aiding our pursuit", "would now assist our pursuit", "would be helping our pursuit"], weight: 50 },
            ],
            idealVoiceResponseEn: "If we had prioritized the chandelier winch, the palace guard would now be aiding our pursuit across the embankment.",
            alternativeResponsesEn: [
              { phraseEn: "Had we secured the chandelier mechanism, the royal guard would now be assisting our pursuit through the streets.", translationFa: "اگر سازوکار لوستر را مهار کرده بودیم، گارد سلطنتی اکنون در حال کمک به تعقیب ما در خیابان‌ها بود." },
              { phraseEn: "If we had stopped the falling chandelier, the guards would now be backing us up on this pursuit.", translationFa: "اگر جلوی سقوط لوستر را گرفته بودیم، نگهبانان اکنون در این تعقیب از ما پشتیبانی می‌کردند." },
            ],
            whiteHintFa: "از ساختار شرطی ترکیبی If we had prioritized the chandelier winch, the palace guard would now be aiding our pursuit... استفاده کن!",
            fallbackChoices: [
              "If we had prioritized the chandelier winch, the palace guard would now be aiding our pursuit across the embankment.",
              "Sirens of horse-drawn steam fire engines are clanging behind us.",
              "The Thames fog is thickening near the Houses of Parliament.",
            ],
            aefReference: "AEF 5 Unit 4B (Mixed Conditionals: past condition with present result)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look ahead at the river vault! The iron hatch to the parliamentary pneumatic system is pried open!",
              textFa: "جلوتر به دهلیز رودخانه نگاه کن! دریچه آهنی سامانه پنوماتیک پارلمان به زور باز شده است!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-6-default-fallback",
        titleFa: "تحلیل تداوم تعقیب فرستاده به سوی وست‌مینستر",
        speakerPromptEn: "Analyze the pursuit across the Victoria Embankment...",
        speakerPromptFa: "تعقیب در امتداد ساحل ویکتوریا را تحلیل می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی Not only did we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «نه تنها از انفجاری ویرانگر در تالار جلوگیری کردیم، بلکه مجوز حیاتی دربار را نیز به دست آوردیم.»",
        targetKeywords: [
          { phrase: "Not only did we avert", hintFa: "(نه تنها جلوگیری کردیم)", synonyms: ["not only did we avert", "not only did we prevent"], weight: 50 },
          { phrase: "secured vital imperial clearance", hintFa: "(مجوز دربار را کسب کردیم)", synonyms: ["secured vital imperial clearance", "gained royal clearance"], weight: 50 },
        ],
        idealVoiceResponseEn: "Not only did we avert a cataclysmic explosion in the ballroom, but we also secured vital imperial clearance.",
        alternativeResponsesEn: [
          { phraseEn: "Not only did we stop the explosion, but we also secured essential royal support.", translationFa: "نه تنها جلوی انفجار را گرفتیم، بلکه پشتیبانی حیاتی سلطنتی را کسب کردیم." },
        ],
        whiteHintFa: "از ساختار Not only did we avert... استفاده کن!",
        fallbackChoices: [
          "Not only did we avert a cataclysmic explosion in the ballroom, but we also secured vital imperial clearance.",
          "The damp stones of Westminster reflect the gaslight.",
        ],
        aefReference: "AEF 5 Unit 2B (Inversion)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The trail leads straight into the pneumatic tube station!",
          textFa: "ردپا مستقیماً به ایستگاه لوله‌های پنوماتیک می‌رود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — Westminster Pneumatic Dispatch & The Fleet Street Tube
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "C1",
    titleFa: "تصمیم سوم: دهلیز پنوماتیک زیرزمینی پارلمان و لوله فلیت‌استریت",
    titleEn: "DECISION 3: Westminster Pneumatic Dispatch & The Fleet Street Tube",
    locationFa: "ایستگاه ارسال کپسول‌های بادی پنوماتیک در اعماق وست‌مینستر",
    locationEn: "Westminster Subterranean Pneumatic Dispatch Vault",
    storyIntroFa: "ساعت ۱۱:۴۵ شب است. شما به دهلیز باستانی و مرطوب لوله‌های خلأ پنوماتیک پارلمان می‌رسید؛ سامانه‌ای زیرزمینی که پیام‌های رسمی را با کپسول‌های بادی پرفشار ظرف چند ثانیه به دفاتر روزنامه‌ها در فلیت‌استریت می‌فرستد. فرستاده نقاب‌دار در حال قرار دادن یک کپسول برنجی سنگین حاوی صفحات رسواکننده دفترچه تاج در لوله شماره ۴ (خط مستقیم چاپخانه روزنامه تایمز) است! هم‌زمان، کاپیتان هاوارد گارد سلطنتی را می‌بینید که با زنجیرهای ضخیم به لوله بخار ۳۰۰ پوندی بسته شده و سوپاپ ترک‌خورده بخار در آستانه انفجار و جوشاندن اوست.",
    cutscene: {
      titleFa: "کپسول برنجی در لوله شماره ۴ و افسر در بند بخار داغ",
      titleEn: "The Brass Dispatch Capsule & The Chained Officer",
      imageSrc: "/images/skills/speaking/c1_scene_7_pneumatic_tube_vault.jpg",
      dialogues: [
        {
          speakerId: "howard",
          speakerNameFa: "کاپیتان هاوارد",
          speakerRoleFa: "افسر ارشد اسیر گارد سلطنتی",
          speakerAvatar: "🎖️",
          textEn: "Mr. Holmes! The steam valve is cracking! But do not let him launch that capsule into Tube Four, or tomorrow's papers will ignite a revolution!",
          textFa: "آقای هلمز! شیر بخار دارد می‌ترکد! اما نگذارید آن کپسول را به لوله ۴ شلیک کند، وگرنه روزنامه‌های فردا شعله انقلاب را برمی‌افروزند!",
          bubblePosition: "left",
        },
        {
          speakerId: "raven",
          speakerNameFa: "کلاغ سیاه (فرستاده نقاب‌دار)",
          speakerRoleFa: "عامل موریارتی در کنار کمپرسور",
          speakerAvatar: "🦹",
          textEn: "Pneumatic pressure is at maximum! Press the valve and the secrets of Westminster belong to the public!",
          textFa: "فشار پنوماتیک در حداکثر است! این سوپاپ را بفشارم، اسرار وست‌مینستر به مردم تعلق خواهد گرفت!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-3",
      promptFa: "توقف انتشار عمومی رسوایی ملی یا نجات افسر گارد سلطنتی: آیا لوله پنوماتیک هوایی را منهدم می‌کنید یا کاپیتان هاوارد را نجات می‌دهید؟",
      promptEn: "High-Stakes Decision: Disable the pneumatic compressor to halt the press leak, or cut Captain Howard free from the exploding steam pipe?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Disable the pneumatic compressor and smash Valve Four to block the press leak",
          labelFa: "گزینه ۳الف: شلیک به کمپرسور هوای لوله ۴ و قفل کردن دریچه خلأ جهت جلوگیری از درز اسناد به مطبوعات",
          descriptionFa: "فشار لوله پنوماتیک تخلیه شده و کپسول در لوله متلاشی می‌شود؛ رسوایی مطبوعاتی کاملاً خنثی می‌گردد.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Cut Captain Howard's chains and relieve the steam valve before it ruptures",
          labelFa: "گزینه ۳ب: بریدن زنجیر کاپیتان هاوارد و بستن شیر بخار جهت نجات جان افسر گارد",
          descriptionFa: "کاپیتان نجات می‌یابد و نقشه فرار سارق به سمت برج ساعت بیگ بن را فاش می‌کند، اما کپسولی ناقص شلیک می‌شود.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-7-mixed-conditional-hesitated",
        titleFa: "استنتاج راهبردی با شرطی ترکیبی پیشرفته (Had we hesitated)",
        speakerPromptEn: "Take aim at the pneumatic compressor pressure valve and deliver your decisive deduction...",
        speakerPromptFa: "دریچه فشار کمپرسور پنوماتیک را هدف می‌گیری و استنتاج قاطعانه خود را با شرطی ترکیبی بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی Had we hesitated to disable)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر در از کار انداختن کمپرسور پنوماتیک تردید می‌کردیم، اکنون اسناد افتراآمیز سلطنتی در دستان چاپخانه‌داران بود.»",
        targetKeywords: [
          { phrase: "Had we hesitated to disable", hintFa: "(اگر در از کار انداختن تردید می‌کردیم)", synonyms: ["had we hesitated to disable", "if we had hesitated to disable", "had we delayed in disabling"], weight: 50 },
          { phrase: "would already be in the printers' hands", hintFa: "(اکنون در دستان چاپخانه‌داران بود)", synonyms: ["would already be in the printers' hands", "would already be in the press", "would be in the printers' hands right now"], weight: 50 },
        ],
        idealVoiceResponseEn: "Had we hesitated to disable the pneumatic compressor, the defamatory royal documents would already be in the printers' hands.",
        alternativeResponsesEn: [
          { phraseEn: "Had we delayed in disabling this compressor, the scandalous royal files would already be circulating on Fleet Street.", translationFa: "اگر در غیرفعال کردن این کمپرسور تأخیر می‌کردیم، پرونده‌های رسواکننده سلطنتی اکنون در فلیت‌استریت دست‌به‌دست می‌شدند." },
          { phraseEn: "If we had hesitated to breach this valve, the scandalous papers would already be in the printers' custody.", translationFa: "اگر در شکستن این شیر تعلل می‌کردیم، برگه‌های رسواکننده هم‌اکنون در اختیار چاپخانه‌داران بود." },
        ],
        whiteHintFa: "از ساختار شرطی ترکیبی Had we hesitated to disable the pneumatic compressor, the defamatory royal documents would already be in the printers' hands استفاده کن!",
        fallbackChoices: [
          "Had we hesitated to disable the pneumatic compressor, the defamatory royal documents would already be in the printers' hands.",
          "The air pressure indicator is plummeting toward zero atmosphere.",
          "The iron pipes echo with the rushing sounds of the subterranean Thames.",
        ],
        aefReference: "AEF 5 Unit 4B (Inverted Conditionals & Advanced Mixed Timeframes)",
        npcResponse: {
          speakerNameFa: "کلاغ سیاه (فرستاده نقاب‌دار)",
          speakerRoleFa: "عامل موریارتی",
          speakerAvatar: "🦹",
          textEn: "Curses! The tube is crushed! But you will never stop me from reaching the clocktower before midnight strikes!",
          textFa: "لعنت به تو! لوله له شد! اما هرگز نمی‌توانی جلوی رسیدن مرا به برج ساعت پیش از نواخته شدن نیمه‌شب بگیری!",
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
    titleFa: "پرده هشتم: صعود از پلکان مارپیچ برج ساعت بیگ بن در طوفان",
    titleEn: "Stage 8: Ascent of the Elizabeth Tower & The Pendulum's Pulse",
    locationFa: "پلکان مارپیچ ۳۳۴ پله‌ای داخل برج ساعت بیگ بن، باد و باران تند",
    locationEn: "The 334 Spiral Steps of Elizabeth Tower (Big Ben), Westminster",
    storyIntroFa: "پیامدهای عملیات پنوماتیک وست‌مینستر در این مرحله نمود می‌یابد...",
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "شاخه ۳الف: توقف کامل کپسول و تعقیب نفس‌گیر روی پله‌های سنگی",
        titleEn: "Branch 3A: Press Leak Averted & Furious Step Ascent",
        locationFa: "پلکان مارپیچ سنگی باستانی برج ساعت",
        locationEn: "Granite Spiral Staircase, Elizabeth Tower",
        storyIntroFa: "کپسول برنجی در دهانه لوله خرد می‌شود و هیچ سندی به فلیت‌استریت نمی‌رسد. فرستاده با در دست داشتن اصل دفترچه چرمی، به داخل درب ورودی برج الیزابت (بیگ بن) می‌دود. شما و واتسون در میان صدای سهمگین تیک‌تاک پاندول غول‌آسای ساعت که در فضای برج طنین‌انداز است، ۳۳۴ پله سنگی را به سمت اتاق چرخ‌دنده‌ها درمی‌نوردید. صدای غرش رعدوبرق از پنجره‌های باریک برج به گوش می‌رسد.",
        tasks: [
          {
            id: "task-c1-8-cleft-what-concerns",
            titleFa: "استنتاج مخاطره با جمله شکافته اسمی پیشرفته (What concerns me most)",
            speakerPromptEn: "Ascend the winding stone stairs and articulate the imminent aerial rendezvous...",
            speakerPromptFa: "پله‌های سنگی مارپیچ را بالا می‌روی و خطر قرار هوایی قریب‌الوقوع را با جمله شکافته بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (جمله شکافته What concerns me most profoundly)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «آنچه بیش از هر چیز عمیقاً نگرانم می‌کند این است که فرستاده قصد دارد در نیمه‌شب به همدست هوایی موریارتی علامت دهد.»",
            targetKeywords: [
              { phrase: "What concerns me most profoundly", hintFa: "(آنچه عمیقاً نگرانم می‌کند)", synonyms: ["what concerns me most profoundly", "what alarms me most profoundly", "what worries me most deeply"], weight: 50 },
              { phrase: "signal Moriarty's aerial confederate", hintFa: "(به همدست هوایی موریارتی علامت دهد)", synonyms: ["signal moriarty's aerial confederate", "signal moriarty's aerial accomplice", "alert moriarty's aerial confederate"], weight: 50 },
            ],
            idealVoiceResponseEn: "What concerns me most profoundly is that the courier intends to signal Moriarty's aerial confederate at midnight.",
            alternativeResponsesEn: [
              { phraseEn: "What alarms me most profoundly is that this traitor aims to signal an aerial confederate at midnight.", translationFa: "آنچه عمیقاً مایه هراس من است این است که این خائن قصد دارد در نیمه‌شب به یک همدست هوایی علامت دهد." },
              { phraseEn: "What concerns me most deeply is that the courier plans to signal Moriarty's balloon confederate upon the chime.", translationFa: "آنچه عمیقاً نگرانم می‌سازد این است که فرستاده قصد دارد هنگام نواخته شدن زنگ به همدست بالونی موریارتی سیگنال دهد." },
            ],
            whiteHintFa: "از ساختار جمله شکافته تأکیدی What concerns me most profoundly is that the courier intends to signal Moriarty's aerial confederate at midnight استفاده کن!",
            fallbackChoices: [
              "What concerns me most profoundly is that the courier intends to signal Moriarty's aerial confederate at midnight.",
              "The massive bronze bell above vibrates with the wind.",
              "Each stone riser of this spiral staircase is worn smooth by centuries of clock-winders.",
            ],
            aefReference: "AEF 5 Unit 1A (Cleft sentences: What concerns/alarms me is that...)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look through the stone embrasure! A black hot-air balloon is hovering over the Thames near Westminster Bridge!",
              textFa: "از شکاف سنگ‌ها نگاه کن! یک بالن هوای گرم سیاه بر فراز تیمز در نزدیکی پل وست‌مینستر در حال پرواز است!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "شاخه ۳ب: نجات کاپیتان هاوارد و صعود از آسانسور مخفی باربری",
        titleEn: "Branch 3B: Howard Rescued & The Clock Service Lift",
        locationFa: "محفظه بالابر باری وزنی در قلب برج ساعت",
        locationEn: "Counterweight Service Lift, Elizabeth Tower",
        storyIntroFa: "شما کاپیتان هاوارد را نجات دادید. او با تمام قوا کابل بالابر تعادل وزنه‌های برج را فعال می‌کند که به شما اجازه می‌دهد بسیار سریع‌تر از پله‌ها به اتاق سازوکار ساعت برسید؛ هرچند کپسولی ناقص شلیک شده اما هاوارد بلافاصله تلگراف پارلمان را برای رهگیری آن فراخوانده است.",
        tasks: [
          {
            id: "task-c1-8-inversion-scarcely-howard",
            titleFa: "روایت نجات و دسترسی با ساختار وارونگی Scarcely had we",
            speakerPromptEn: "Step onto the shuddering wooden lift and state the rapid turn of events...",
            speakerPromptFa: "پا بر بالابر چوبی لرزان می‌گذاری و چرخش سریع رویدادها را با وارونگی بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (وارونگی Scarcely had we unchained)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «هنوز به سختی کاپیتان هاوارد را از لوله بخار رها کرده بودیم که او دسترسی محرمانه به برج ساعت را فاش ساخت.»",
            targetKeywords: [
              { phrase: "Scarcely had we unchained Captain", hintFa: "(هنوز به سختی رها کرده بودیم)", synonyms: ["scarcely had we unchained captain", "hardly had we unchained captain", "barely had we freed captain"], weight: 50 },
              { phrase: "secret clocktower access", hintFa: "(دسترسی محرمانه به برج ساعت)", synonyms: ["secret clocktower access", "confidential clocktower access", "the secret clocktower entrance"], weight: 50 },
            ],
            idealVoiceResponseEn: "Scarcely had we unchained Captain Howard from the steam manifold when he revealed the secret clocktower access.",
            alternativeResponsesEn: [
              { phraseEn: "Hardly had we freed Captain Howard from the steam manifold when he unlocked the direct clocktower access.", translationFa: "به سختی کاپیتان هاوارد را از لوله بخار آزاد کرده بودیم که او دسترسی مستقیم به برج ساعت را باز کرد." },
              { phraseEn: "Scarcely had we unchained the captain when he showed us the emergency clocktower access.", translationFa: "هنوز کاپیتان را به سختی رها کرده بودیم که او مسیر اضطراری برج ساعت را به ما نشان داد." },
            ],
            whiteHintFa: "از ساختار وارونگی زمانی Scarcely had we unchained Captain Howard from the steam manifold when he revealed the secret clocktower access استفاده کن!",
            fallbackChoices: [
              "Scarcely had we unchained Captain Howard from the steam manifold when he revealed the secret clocktower access.",
              "The counterweight cables are groaning under the tension of the ascent.",
              "The clock mechanism above echoes with thunderous rhythmic clicks.",
            ],
            aefReference: "AEF 5 Unit 2B (Inversion with Scarcely... when / Hardly... when)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The service lift has brought us directly to the clock escapement floor! He is right before us!",
              textFa: "بالابر باری ما را مستقیماً به طبقه چرخ‌دنگ ساعت رساند! او درست پیش روی ماست!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c1-8-default-fallback",
        titleFa: "تحلیل صعود به اتاق چرخ‌دنده‌های بیگ بن",
        speakerPromptEn: "Climb the steps and evaluate the enemy's escape route...",
        speakerPromptFa: "پله‌ها را بالا می‌روی و مسیر فرار دشمن را ارزیابی می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته What concerns me)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «آنچه بیش از هر چیز عمیقاً نگرانم می‌کند این است که فرستاده قصد دارد در نیمه‌شب به همدست هوایی موریارتی علامت دهد.»",
        targetKeywords: [
          { phrase: "What concerns me most profoundly", hintFa: "(آنچه نگرانم می‌کند)", synonyms: ["what concerns me most profoundly", "what concerns me most"], weight: 50 },
          { phrase: "signal Moriarty's aerial confederate", hintFa: "(علامت به همدست هوایی)", synonyms: ["signal moriarty's aerial confederate", "signal the aerial accomplice"], weight: 50 },
        ],
        idealVoiceResponseEn: "What concerns me most profoundly is that the courier intends to signal Moriarty's aerial confederate at midnight.",
        alternativeResponsesEn: [
          { phraseEn: "What alarms me is that he plans to signal Moriarty's aerial confederate.", translationFa: "آنچه مایه هراس من است این است که او قصد دارد به همدست هوایی موریارتی علامت دهد." },
        ],
        whiteHintFa: "از ساختار What concerns me most profoundly... استفاده کن!",
        fallbackChoices: [
          "What concerns me most profoundly is that the courier intends to signal Moriarty's aerial confederate at midnight.",
          "The mechanical pendulum swings with immense momentum.",
        ],
        aefReference: "AEF 5 Unit 1A (Cleft sentences)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "We are at the gear room door!",
          textFa: "ما دم در اتاق چرخ‌دنده‌ها هستیم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4 — The Mechanical Escapement of Big Ben at 11:59 PM
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "C1",
    titleFa: "تصمیم چهارم: محفظه چرخ‌دنده‌های ساعت بیگ بن در ۱۱:۵۹ شب",
    titleEn: "DECISION 4: The Mechanical Escapement of Big Ben at 11:59 PM",
    locationFa: "تالار چرخ‌دنده‌های برنجی عظیم و لنگر ساعت بیگ بن",
    locationEn: "The Clockwork Escapement Chamber, Big Ben, Westminster",
    storyIntroFa: "ساعت ۱۱:۵۹ شب است. تنها ۶۰ ثانیه تا نواخته شدن ۱۲ ضربه مرگبار ناقوس بیگ بن و فرا رسیدن نیمه‌شب باقی مانده است. در تالار چرخ‌دنده‌های عظیم ساعت، دندانه‌های برنجی به ارتفاع دو متر با هیبتی رعب‌آور در حال گردش‌اند و پاندول ۱۳ فوتی ساعت نوسان می‌کند. فرستاده نقاب‌دار روی سکوی فلزی باریک درست در مقابل چرخ‌دنگ اصلی ایستاده است؛ دفترچه تاج در دست چپ اوست و در دست راستش طناب اهرم پنجره بازشو به سمت بالکن ناقوس قرار دارد؛ جایی که طناب مهار بالن هوای گرم آویزان است. یک گام اشتباه به معنای سقوط ۹۰ متری بر فراز رود تیمز است.",
    cutscene: {
      titleFa: "چرخ‌دنده‌های عظیم ساعت در ۱۱:۵۹ و فرستاده در لبه بالکن",
      titleEn: "The Giant Escapement Gear at 11:59 & The Masked Traitor",
      imageSrc: "/images/skills/speaking/c1_scene_9_big_ben_escapement.jpg",
      dialogues: [
        {
          speakerId: "raven",
          speakerNameFa: "کلاغ سیاه (فرستاده نقاب‌دار)",
          speakerRoleFa: "عامل موریارتی در کنار چرخ‌دنگ ساعت",
          speakerAvatar: "🦹",
          textEn: "Look at the great pendulum, Holmes! When Big Ben chimes midnight, the balloon cuts loose and the Crown Ledger is lost to you forever!",
          textFa: "به پاندول عظیم نگاه کن هلمز! وقتی بیگ بن نیمه‌شب را بنوازد، بالن رها می‌شود و دفترچه تاج تا ابد از دست شما رفته است!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور با عصای فولادی",
          speakerAvatar: "🔍",
          textEn: "Watson! The bronze escapement wheel triggers the hammer at the fifty-ninth second! We have one chance to seize control of time itself!",
          textFa: "واتسون! چرخ‌دنگ برنزی چکش ناقوس را در ثانیه پنجاه و نهم فعال می‌کند! ما فقط یک فرصت داریم تا کنترل خود زمان را در دست بگیریم!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c1-4",
      promptFa: "مهار چرخ‌دنده‌های عظیم ساعت در ثانیه ۵۹ یا نبرد تن‌به‌تن روی بالکن ناقوس: چگونه خائن را پیش از نیمه‌شب مهار می‌کنید؟",
      promptEn: "Ultimate Tactical Decision: Jam Big Ben's escapement gear with the steel cane, or leap into hand-to-hand combat on the bell balcony?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Jam the massive bronze escapement gear with Sherlock's reinforced steel cane",
          labelFa: "گزینه ۴الف: انداختن عصای فولادی تقویت‌شده شرلوک درون دندانه‌های چرخ‌دنگ ساعت جهت متوقف ساختن زمان و قفل کردن درهای خروجی",
          descriptionFa: "چرخ‌دنده در ثانیه ۵۸ با غرش فلز متوقف می‌شود، در خروجی مکانیکی قفل شده و سارق در محفظه بدون آسیب به دفترچه به دام می‌افتد.",
          pointsDelta: 150,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Charge forward into physical combat on the narrow bell platform above the Thames",
          labelFa: "گزینه ۴ب: هجوم مستقیم فیزیکی روی لبه باریک بالکن بیرونی با خطر پرتاب اسناد در باد و امواج تیمز",
          descriptionFa: "درگیری تن‌به‌تن خشنی روی لبه ۹۰ متری درمی‌گیرد؛ سارق مهار می‌شود اما صفحات دفترچه در طوفان به درون رودخانه پرتاب می‌شوند.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-9-inversion-under-no-circumstances",
        titleFa: "فرمان نهایی با وارونگی تأکیدی بازدارنده (Under no circumstances)",
        speakerPromptEn: "Raise your weighted steel cane and command Watson with absolute grammatical authority...",
        speakerPromptFa: "عصای فولادی سنگینت را بالا می‌بری و با اقتدار کامل گرامری به واتسون فرمان می‌دهی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی بازدارنده Under no circumstances must we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «تحت هیچ شرایطی نباید اجازه دهیم آن چرخ‌دنگ مکانیکی زنگ‌های نیمه‌شب را پیش از مهار شدن خائن به صدا درآورد.»",
        targetKeywords: [
          { phrase: "Under no circumstances must we permit", hintFa: "(تحت هیچ شرایطی نباید اجازه دهیم)", synonyms: ["under no circumstances must we permit", "under no circumstances should we allow", "on no account must we permit"], weight: 50 },
          { phrase: "trigger the midnight chimes", hintFa: "(زنگ‌های نیمه‌شب را به صدا درآورد)", synonyms: ["trigger the midnight chimes", "sound the midnight chimes", "strike the midnight chimes"], weight: 50 },
        ],
        idealVoiceResponseEn: "Under no circumstances must we permit that mechanical escapement to trigger the midnight chimes before the traitor is restrained.",
        alternativeResponsesEn: [
          { phraseEn: "Under no circumstances should we allow the mechanical escapement to strike the midnight chimes before he is captured.", translationFa: "تحت هیچ شرایطی نباید اجازه دهیم چرخ‌دنگ مکانیکی زنگ‌های نیمه‌شب را قبل از دستگیری او بنوازد." },
          { phraseEn: "On no account must we permit that clockwork gear to trigger the chimes before the traitor is subdued.", translationFa: "به هیچ وجه نباید اجازه دهیم آن چرخ‌دنده ساعت زنگ‌ها را پیش از مهار خائن فعال کند." },
        ],
        whiteHintFa: "از ساختار وارونگی نفی قاطع Under no circumstances must we permit that mechanical escapement to trigger the midnight chimes... استفاده کن!",
        fallbackChoices: [
          "Under no circumstances must we permit that mechanical escapement to trigger the midnight chimes before the traitor is restrained.",
          "The four illuminated dials of Big Ben dominate the London skyline.",
          "The escapement pallets are ticking with monumental force.",
        ],
        aefReference: "AEF 5 Unit 2B (Inversion with Under no circumstances / On no account)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Now, Holmes! Thrust the cane into the bronze teeth! Stop the chimes!",
          textFa: "اکنون هلمز! عصا را درون دندانه‌های برنزی فرو کن! زنگ‌ها را متوقف کن!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: Climax, Decision-Weighted Endings & The Red Folder [C2]
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "C1",
    titleFa: "پرده دهم: ناقوس نیمه‌شب، افشای خیانت و کشف پرونده سرخ C2",
    titleEn: "Stage 10: The Midnight Chimes, The Unmasking & The Red Folder Revelation",
    locationFa: "بالکن سنگی زیر ناقوس عظیم بیگ بن، باران سیل‌آسا بر فراز رود تیمز",
    locationEn: "The Great Bell Platform, Elizabeth Tower, London Storm",
    storyIntroFa: "عصای فولادی سخت‌کاری‌شده شرلوک با جرقه‌ای خیره‌کننده درون چرخ‌دنگ عظیم برنزی گیر می‌کند. چرخ‌دنده‌ها در ثانیه ۵۸ با غرش فلزی خردکننده‌ای متوقف می‌شوند؛ زنگ‌های نیمه‌شب خاموش می‌مانند و اهرم خودکار پرتاب بالن قفل می‌شود! در میان باد و باران تند بر فراز لندن، فرستاده به دام می‌افتد. واتسون با چابکی تپانچه را از دست او خارج می‌سازد. شرلوک به جلو گام برمی‌دارد و نقاب سیاه ابریشمی را از چهره سارق کنار می‌زند: چهره رنگ‌پریده لرد دارلینگتون، معاون وزیر جنگ بریتانیا و از نزدیک‌ترین مشاوران دربار نمایان می‌شود! «دفترچه تاج [C1]» با جلد چرم زرشکی و نشان شیر و تک‌شاخ سلطنتی بازپس گرفته می‌شود... اما در آخرین برگ آن، پاکتی با موم سرخ خودنمایی می‌کند...",
    cutscene: {
      titleFa: "نقاب‌برداری از لرد دارلینگتون و کشف پاکت سرخ موریارتی",
      titleEn: "The Unmasking of Lord Darlington & The Red Wax Envelope",
      imageSrc: "/images/skills/speaking/c1_scene_10_big_ben_climax.jpg",
      dialogues: [
        {
          speakerId: "darlington",
          speakerNameFa: "لرد دارلینگتون (معاون وزیر جنگ)",
          speakerRoleFa: "خائن ارشد نقاب‌دار در دربار",
          speakerAvatar: "👑",
          textEn: "You fool, Holmes! You think you saved the British Empire? I was merely a pawn playing for Moriarty's true masterpiece!",
          textFa: "احمق، هلمز! فکر می‌کنی امپراتوری بریتانیا را نجات دادی؟ من فقط یک مهره پیاده بودم که برای شاهکار واقعی موریارتی بازی می‌کردم!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The Crown Ledger is recovered intact, Darlington. But examine this crimson wax seal affixed to the final page, Watson: the monogram of Professor James Moriarty!",
          textFa: "دفترچه تاج دست‌نخورده بازیابی شد، دارلینگتون. اما این مهر موم سرخ چسبانده‌شده به صفحه آخر را بررسی کن واتسون: نشان اختصاصی پروفسور جیمز موریارتی!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-c1-10-cleft-red-folder-deduction",
        titleFa: "استنتاج شوکه‌کننده با جمله شکافته دوگانه و افشای پرونده سرخ",
        speakerPromptEn: "Break the crimson seal of the letter and deliver the grand deductive revelation of the saga...",
        speakerPromptFa: "مهر موم سرخ نامه را می‌شکنی و پرده از بزرگ‌ترین استنتاج این حماسه برمی‌داری...",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته It was not merely... but Moriarty's master scheme)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «صرفاً طمع لرد دارلینگتون نبود که این خیانت را ترتیب داد، بلکه نقشه کلان موریارتی بود که در پرونده سرخ پنهان شده است.»",
        targetKeywords: [
          { phrase: "It was not merely Lord Darlington's greed", hintFa: "(صرفاً طمع لرد دارلینگتون نبود)", synonyms: ["it was not merely lord darlington's greed", "it was not only lord darlington's greed", "it was not simply darlington's greed"], weight: 50 },
          { phrase: "concealed within the Red Folder", hintFa: "(پنهان در پرونده سرخ)", synonyms: ["concealed within the red folder", "hidden within the red folder", "contained inside the red folder"], weight: 50 },
        ],
        idealVoiceResponseEn: "It was not merely Lord Darlington's greed that orchestrated this betrayal, but Moriarty's master scheme concealed within the Red Folder.",
        alternativeResponsesEn: [
          { phraseEn: "It was not simply Darlington's ambition that drove this treason, but Moriarty's grand conspiracy concealed within the Red Folder.", translationFa: "صرفاً جاه‌طلبی دارلینگتون نبود که این خیانت را رقم زد، بلکه توطئه بزرگ موریارتی بود که در پرونده سرخ پنهان گشته است." },
          { phraseEn: "It was not merely personal greed that orchestrated this plot, but Moriarty's master plan hidden in the Red Folder.", translationFa: "صرفاً طمع شخصی نبود که این توطئه را سامان داد، بلکه نقشه استادانه موریارتی بود که در پرونده سرخ مخفی شده است." },
        ],
        whiteHintFa: "از ساختار جمله شکافته It was not merely Lord Darlington's greed that orchestrated this betrayal, but Moriarty's master scheme concealed within the Red Folder استفاده کن!",
        fallbackChoices: [
          "It was not merely Lord Darlington's greed that orchestrated this betrayal, but Moriarty's master scheme concealed within the Red Folder.",
          "The rain is washing over the dial of the great clock of Westminster.",
          "The wax seal carries the imprint of two intertwined letters M.",
        ],
        aefReference: "AEF 5 Unit 1A (Emphatic Cleft Sentences: It was not merely... that / but...)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Read the letter, Holmes! A train ticket to Switzerland... and a hand-drawn map of the Reichenbach Falls!",
          textFa: "نامه را بخوان هلمز! یک بلیط قطار به سوئیس... و یک نقشه دست‌کشیده از آبشار رایشنباخ!",
        },
      },
    ],
    endings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان درخشان: نجات مصونیت سلطنت، بازیابی کامل دفترچه تاج و افشای پرونده سرخ",
        titleEn: "ENDING 1: CASE SOLVED — The Crown Secured & The Red Folder Unveiled!",
        badgeTitleFa: "🎖️ پرونده C1 با موفقیت کامل حل شد: مصونیت پادشاهی حفظ و مسیر آلپ گشوده شد",
        imageSrc: "/images/skills/speaking/c1_scene_case_solved.jpg",
        climaxStoryFa: "ساعت بیگ بن در ثانیه ۵۸ متوقف می‌شود. لرد دارلینگتون با خلع سلاح سریع در چنگال عدالت اسیر می‌گردد و «دفترچه تاج [C1]» بدون حتی یک خراش یا برگ پارگی به دست شرلوک می‌رسد. سرهنگ براون و نیروهای گارد سلطنتی به برج می‌رسند و تمام سران شبکه خائنان دربار را پیش از طلوع آفتاب در سکوت بازداشت می‌کنند. پادشاهی از پرتگاه فروپاشی نجات می‌یابد و ملکه به پاس این فداکاری بالاترین نشان افتخار دربار را به هلمز و واتسون پیشنهاد می‌دهد، اما شرلوک نشان را رد می‌کند؛ زیرا در آخرین برگ دفترچه، پاکت سرخ موریارتی با بلیط قطار آلپ سوئیس چشم‌انتظار اوست...",
        climaxStoryEn: "Big Ben is halted at the fifty-eighth second. Lord Darlington is subdued without a single bullet fired, and The Crown Ledger [C1] is recovered entirely intact. Colonel Brown and the royal guards arrive to place every high-treason aristocrat under arrest in absolute secrecy before dawn. The British realm is saved from civil collapse. But affixed to the final ledger page, a crimson envelope containing a Swiss train ticket and the Reichenbach coordinates awaits...",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Grand Plot Twist):
با شکستن موم سرخ ممهور به نشان «MM»، دست‌خط ظریف و دهشتناک پروفسور جیمز موریارتی با جوهر سیاه خودنمایی می‌کند:

«شرلوک هلمز عزیزم،
آفرین! تو کدهای نیروی دریایی بریتانیا را در اسکاتلند نجات دادی [قطار آبی - B1]؛
فرمول سلاح‌های شیمیایی و دانشمندت را در دارتمور نجات دادی [سکه هاوند - B2]؛
و امشب، با متوقف کردن چرخ‌دنده‌های بیگ بن، آبروی دربار و سلطنت را از رسوایی حفظ کردی [دفترچه تاج - C1]!

اما آیا واقعاً باور کردی این سه پرونده پیروزی نهایی تو بوده‌اند؟
کدهای دریایی، آزمایشگاه دارتمور و دفترچه باکینگهام فقط شاخه‌های بیرونی یک درخت غول‌پیکر بودند؛
ریشه اصلی جنایت در دست من است: «پرونده سرخ [C2]» (The Red Folder)!
داخل پرونده سرخ، نام تمام رهبران مافیای جهانی من، کدهای زرادخانه‌های اروپا و نقشه ترور بزرگ ثبت شده است.
اگر جرئت داری به این بازی موش و گربه خاتمه دهی، کلاه‌سیلندرت را بردار و به آلپ سوئیس بیا.
من در بالاترین پرتگاه بر فراز مه خروشان آبشار رایشنباخ (Reichenbach Falls) منتظرت خواهم بود!
آنجا، یا تو به قعر دره سقوط می‌کنی یا من... پایان بازی در راه است!
— پروفسور جیمز موریارتی»

دکتر واتسون نقشه توپوگرافی آلپ را در دست می‌فشارد و رنگ از چهره‌اش می‌پرد:
«هلمز... رایشنباخ یک تله مرگبار است! او می‌خواهد تو را به پرتگاه‌های یخ‌زده بکشاند!»
شرلوک پالتوی بلندش را در باد بارانی بیگ بن می‌بندد، پیپش را روشن می‌کند و با لبخندی آرام می‌گوید:
«او پرونده سرخ را می‌خواهد جان، و من او را. چمدان‌هایمان را برای سوئیس ببند؛ پرده نهایی در آبشار رایشنباخ رقم خواهد خورد.»`,
        revealDialogueEn: `THE GRAND CLIMAX & THE RED FOLDER REVELATION:
Breaking the crimson wax monogrammed with 'MM', Moriarty's chilling handwriting is unveiled:

"My dear Sherlock Holmes,
Brilliant performance! You secured the British naval ciphers in the Scottish Highlands [The Blue Train - B1];
You rescued your chemist and weapon formulas at Dartmoor [The Hound Coin - B2];
And tonight, by defying time itself inside Big Ben, you shielded the Crown from ruin [The Crown Ledger - C1]!

Yet did you truly imagine these three folders were your victory?
The naval codes, the Dartmoor lab, and the Buckingham ledger were merely outer branches;
The grand root rests solely in my grasp: «The Red Folder [C2]»!
Inside the Red Folder lies the full roster of my international syndicate, imperial armory ciphers, and the European assassination treaty.
If you possess the courage to close this grand game, take your walking stick and journey to the Swiss Alps.
I shall await you upon the high ledge above the roaring mists of the Reichenbach Falls!
There, one of us shall plunge into the abyss... The final curtain falls!
— Professor James Moriarty"

Watson stares at the Alpine rail ticket, his voice shaking:
"Holmes... Reichenbach is a death trap! He is luring you onto the frozen precipice!"
Sherlock buttons his wool coat against the Westminster gale and smiles quietly:
"He wants the Red Folder, John, and I want him. Pack our trunks for Switzerland; the ultimate reckoning awaits at the Reichenbach Falls."`,
        nextTierHintFa: "تبریک! پرونده C1 با موفقیت حل شد. برای رویارویی نهایی با موریارتی و بستن «پرونده سرخ [C2]» آماده شوید!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان تلخ: مهار سارق، اما مفقودی بخشی از اوراق در رود تیمز و جراحت هلمز",
        titleEn: "ENDING 2: BITTERSWEET RESOLUTION — Scandal Contained with Heavy Scars",
        badgeTitleFa: "⚠️ پرونده با تلفات و آسیب حل شد: رسوایی ناقص مهار شد",
        imageSrc: "/images/skills/speaking/c1_scene_case_failed.jpg",
        climaxStoryFa: "در کشمکش فیزیکی خشن روی بالکن لغزنده زیر ناقوس بیگ بن، دارلینگتون مهار می‌شود اما در جریان درگیری، چندین صفحه حیاتی از دفترچه تاج در طوفان به درون امواج تاریک رودخانه تیمز پرتاب می‌شود. رسوایی به طور کامل پاک نمی‌شود و برخی از نام‌ها در ابهام باقی می‌ماند. دست راست شرلوک به شدت آسیب می‌بیند. با این حال، پاکت سرخ ممهور به نشان موریارتی با بلیط سوئیس و مختصات آبشار رایشنباخ از جیب پالتوی دارلینگتون به دست می‌آید؛ دعوتی خونین برای آخرین نبرد کارآگاه در سطح C2.",
        climaxStoryEn: "In the brutal physical struggle along the rain-slicked ledge beneath the Great Bell, Darlington is subdued, but several vital leaves of the Crown Ledger are swept away by the gale into the black waters of the Thames. The political scandal is only partially contained, leaving lingering scars. Holmes's arm is heavily injured. Nevertheless, the crimson envelope containing Moriarty's Swiss rail ticket and the Reichenbach Falls coordinates is recovered from Darlington's coat—a bloody summons to the ultimate clash in CEFR C2.",
        revealDialogueFa: `پایان پرهزینه و سرنخ پرونده سرخ:
واتسون شتابان دست خونین شرلوک را با دستمال ابریشمی پانسمان می‌کند. در پایین، قایق‌های گشتی پلیس در حال جستجوی اوراق شناور در تیمز هستند.
از جیب پالتوی دارلینگتون، پاکت سرخ‌رنگ ممهور به موم دوگانه «MM» بیرون کشیده می‌شود.
یادداشت خونین موریارتی:
«بازی در لندن به پایان رسید شرلوک. اگر زنده ماندی، برای پرونده سرخ [C2] به آبشار رایشنباخ سوئیس بیا... سقوط تو نزدیک است!»
شرلوک به افق تاریک و مه‌آلود لندن خیره می‌شود: «به خانه برگرد جان؛ برای نبرد نهایی در کوه‌های آلپ آماده شو.»`,
        revealDialogueEn: `A BITTERSWEET FINALE & THE RED FOLDER SUMMONS:
Watson tightly bandages Sherlock's injured arm against the rain. Below on the Thames, police patrol launches search for scattered pages in the dark water.
From Darlington's coat, the crimson envelope bearing the double 'M' seal is retrieved.
Moriarty's letter reads:
"The London game is concluded, Holmes. If you survived, bring your deductions to the Reichenbach Falls for The Red Folder [C2]... Your fall is imminent!"
Sherlock gazes across the stormy London skyline: "Pack our coats, John; the final confrontation in the Alps begins."`,
        nextTierHintFa: "پرونده C1 با بهای گزاف حل شد. سرنخ نهایی «پرونده سرخ [C2]» در آبشار رایشنباخ در انتظار شماست.",
      },
    },
  },
];
