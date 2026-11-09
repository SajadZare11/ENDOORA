import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR B2 CASE: "CASE FILE #04: THE HOUND COIN & THE DARTMOOR PRISON SIEGE"
// Official CEFR B2 Vocabulary & Grammar (AEF 4):
// - Third & Mixed Conditionals: If the guards had not been bribed...
// - Inversion for Emphasis: Hardly had we..., No sooner had I...
// - Passive Reporting Structures: is reported to be, was believed to have
// - Participle Clauses & Complex Linkers: Having averted..., Unless we...
// - High-Stakes Forensic, Prison Siege & Explosive Ballistics Lexicon
// ============================================================================

export const B2_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: Arrival at Dartmoor & The Gatekeeper's Murder (ورود به دارتمور)
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "B2",
    titleFa: "سکه هاوند: ورود به دارتمور و کشف جسد دروازه‌بان",
    titleEn: "The Hound Coin: Arrival at Dartmoor & The Gatekeeper's Murder",
    locationFa: "دروازه سنگی بیرونی زندان دارتمور، مه غلیظ دوون‌شایر",
    locationEn: "Outer Granite Gates, HM Prison Dartmoor, Devonshire",
    storyIntroFa: "باد سردی بر فراز باتلاق‌های دارتمور زوزه می‌کشد و باران سیل‌آسا بر سنگ‌های باستانی گرانیت فرود می‌آید. پس از بازیابی پوشه آبی در اسکاتلند، سرنخ سکه برنزی هاوند شما و دکتر واتسون را به زندان فوق‌امنیتی دارتمور کشانده است؛ جایی که دکتر آلیستر ونس، شیمی‌دان ارشد MI6 و سازنده فرمول‌های سری پوشه شماره ۲، در انفرادی نگهداری می‌شود. با رسیدن کالسکه به دروازه عظیم سنگی، منظره‌ای هولناک پدیدار می‌شود: دروازه‌بان ارشد با شلیک گلوله به سینه‌اش روی گل افتاده و در دهانش سکه برنزی دیگری از هاوند با عدد «۹» حک شده است! آژیر فلزی زندان از دوردست در مه زوزه می‌کشد؛ شورش مسلحانه آغاز شده است.",
    cutscene: {
      titleFa: "کشف جسد دروازه‌بان و دومین سکه هاوند در طوفان",
      titleEn: "The Assassinated Gatekeeper & The Second Hound Coin",
      imageSrc: "/images/skills/speaking/b2_scene_1_outer_gates.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at the powder burns on his collar, Watson. He was assassinated at point-blank range by someone he recognized!",
          textFa: "به سوختگی باروت روی یقه‌اش نگاه کن واتسون. او از فاصله صفر توسط کسی که می‌شناخته ترور شده است!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و همراه هلمز",
          speakerAvatar: "🩺",
          textEn: "The bronze coin in his mouth bears the Hound insignia! Moriarty's network inside this prison has unlocked the outer fortress!",
          textFa: "سکه برنزی در دهانش نشان سگ شکاری را دارد! شبکه موریارتی در این زندان قفل دژ بیرونی را باز کرده است!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-1-third-conditional-gate",
        titleFa: "تحلیل صحنه جرم با شرطی نوع سوم درباره بسته ماندن دروازه",
        speakerPromptEn: "Examine the heavy iron lock of the opened gate and state the past hypothetical deduction...",
        speakerPromptFa: "قفل آهنی سنگین دروازه بازشده را بررسی می‌کنی و استنتاج فرضی گذشته‌ات را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (شرطی نوع سوم گذشته غیرواقعی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «اگر دروازه‌بان ترور نشده بود، دروازه‌های بیرونی محکم قفل باقی می‌ماندند.»",
        targetKeywords: [
          { phrase: "If the gatekeeper had not been", hintFa: "(اگر دروازه‌بان نشده بود)", synonyms: ["if the gatekeeper had not been", "had the gatekeeper not been", "if the guard had not been"], weight: 50 },
          { phrase: "would have remained firmly locked", hintFa: "(محکم قفل باقی می‌ماندند)", synonyms: ["would have remained firmly locked", "would have stayed locked", "would have remained locked"], weight: 50 },
        ],
        idealVoiceResponseEn: "If the gatekeeper had not been assassinated, the outer gates would have remained firmly locked.",
        alternativeResponsesEn: [
          { phraseEn: "Had the gatekeeper not been shot, the prison gates would have stayed locked!", translationFa: "اگر به دروازه‌بان شلیک نشده بود، دروازه‌های زندان قفل می‌ماندند!" },
          { phraseEn: "If someone had not murdered the guard, the outer fortress wouldn't have been breached.", translationFa: "اگر کسی نگهبان را نکشته بود، دژ بیرونی شکسته نمی‌شد." },
        ],
        whiteHintFa: "از گرامر شرطی نوع سوم If + had not been assassinated و عبارت would have remained firmly locked استفاده کن!",
        fallbackChoices: [
          "If the gatekeeper had not been assassinated, the outer gates would have remained firmly locked.",
          "The weather in Devonshire is particularly cold this evening.",
          "I suggest we return to the village tavern until daybreak.",
        ],
        aefReference: "AEF 4 Unit 4A (Third conditional & unreal past)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Draw your revolver, Holmes. Gunfire is echoing from the outer courtyard!",
          textFa: "رولورت را بکش هلمز. صدای شلیک گلوله از حیاط بیرونی منعکس می‌شود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: DECISION 1 — Outer Bastion Courtyard (محاصره باروهای بیرونی)
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "B2",
    titleFa: "تصمیم اول: محاصره باروهای بیرونی و نگهبانان شورشی",
    titleEn: "DECISION 1: Outer Bastion Courtyard & The Rogue Wardens",
    locationFa: "حیاط باروهای گرانیتی بیرونی زندان دارتمور",
    locationEn: "Outer Bastion Courtyard, HM Prison Dartmoor",
    storyIntroFa: "از دروازه عبور می‌کنید و پشت گاری علوفه در سایه‌های حیاط گرانیتی سنگر می‌گیرید. بیش از بیست نگهبان مسلح با بازوبندهای سیاه منقش به سر سگ شکاری (حلقه شورشی هاوند) محوطه را به کنترل خود درآورده‌اند. معاون خائن زندان، استرلینگ، با فریاد دستور می‌دهد درب بلوک C را منفجر کنند تا دکتر ونس را پیش از رسیدن نیروهای ارتش خارج سازند. دو دست لباس فرم نگهبانان با بازوبند هاوند در گوشه دیوار رها شده است. اگر هویت شما فاش شود، شورشیان دانشمند را بلافاصله خواهند کشت!",
    cutscene: {
      titleFa: "شورشیان هاوند در حیاط و دو دست لباس فرم رهاشده",
      titleEn: "The Rogue Wardens & The Discarded Guard Uniforms",
      imageSrc: "/images/skills/speaking/b2_scene_2_outer_bastion.jpg",
      dialogues: [
        {
          speakerId: "sterling",
          speakerNameFa: "معاون استرلینگ",
          speakerRoleFa: "سرکرده نگهبانان شورشی",
          speakerAvatar: "🐺",
          textEn: "Breach Cell Block C at once! Bring Dr. Vance and his chemical notes to the boiler tunnel! Shoot anyone who resists!",
          textFa: "فوراً بلوک C را بشکنید! دکتر ونس و دست‌نوشته‌های شیمیایی‌اش را به تونل موتورخانه ببرید! هرکس مقاومت کرد شلیک کنید!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی در کمین",
          speakerAvatar: "🩺",
          textEn: "Holmes, there are two guard coats right beside us! Do we slip into their ranks quietly, or draw our weapons and rally the guards?!",
          textFa: "هلمز، دو پالتوی نگهبانی درست کنار ماست! آیا بی‌صدا وارد صفوفشان شویم، یا سلاح بکشیم و نگهبانان را بسیج کنیم؟! ",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b2-1",
      promptFa: "یک دوراهی تاکتیکی حیاتی: آیا با تغییر چهره به صفوف شورشیان نفوذ می‌کنید یا مستقیماً درگیر می‌شوید؟",
      promptEn: "Critical Choice: Disguise yourselves in rogue uniforms for stealth infiltration, or open fire to rally loyalist guards?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Disguise yourselves in rogue uniforms for silent infiltration",
          labelFa: "گزینه ۱الف: نفوذ مخفیانه با تغییر چهره و پوشیدن لباس فرم نگهبانان شورشی",
          descriptionFa: "بی‌صدا با لباس فرم وارد راهروها می‌شوید، رمز عبور شورشیان را می‌شنوید و نقشه تخریب موتورخانه را کشف می‌کنید.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Open fire and rally loyalist guards into a direct confrontation",
          labelFa: "گزینه ۱ب: شلیک هوایی و آغاز درگیری مستقیم مسلحانه در حیاط باروها",
          descriptionFa: "زنگ خطر عمومی به صدا درمی‌آید؛ درگیری سنگینی رخ می‌دهد و شورشیان مسیر مستقیم بلوک C را تله‌گذاری می‌کنند.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-2-inversion-disguise",
        titleFa: "توصیف روایت نفوذ با ساختار معکوس تأکیدی Hardly had we",
        speakerPromptEn: "Slip the dark wool guard coats over your clothes and observe the patrol passing by...",
        speakerPromptFa: "پالتوهای پشمی تیره نگهبانی را بر تن می‌کنی و عبور گشت مسلح از کنارتان را شرح می‌دهی...",
        speakerRoleFa: "شرلوک هلمز (ساختار معکوس Hardly had we... when)",
        speakerAvatar: "🔍",
        taskInstructionFa: "با لحن روایی بگو: «به محض اینکه در این لباس‌ها تغییر چهره دادیم، گشت نگهبانان از کنار مخفیگاهمان رژه رفت.»",
        targetKeywords: [
          { phrase: "Hardly had we disguised", hintFa: "(به محض اینکه تغییر چهره دادیم)", synonyms: ["hardly had we disguised", "scarcely had we disguised", "no sooner had we disguised"], weight: 50 },
          { phrase: "marched past our hiding spot", hintFa: "(از کنار مخفیگاهمان رژه رفت)", synonyms: ["marched past our hiding spot", "walked past our hiding spot", "passed our hiding spot"], weight: 50 },
        ],
        idealVoiceResponseEn: "Hardly had we disguised ourselves in these uniforms when the patrol marched past our hiding spot.",
        alternativeResponsesEn: [
          { phraseEn: "Scarcely had we put on these coats when the armed guards marched right past us!", translationFa: "به ندرت این پالتوها را پوشیده بودیم که نگهبانان مسلح درست از کنارمان رد شدند!" },
          { phraseEn: "No sooner had we changed into their uniforms than the rogue patrol walked past.", translationFa: "به محض اینکه لباس فرمشان را پوشیدیم، گشت شورشی از کنارمان عبور کرد." },
        ],
        whiteHintFa: "از ساختار معکوس تأکیدی B2 یعنی Hardly had we disguised ourselves... when استفاده کن!",
        fallbackChoices: [
          "Hardly had we disguised ourselves in these uniforms when the patrol marched past our hiding spot.",
          "I wonder if the governor of this prison has escaped to the village.",
          "These heavy woolen guard coats are soaked with moorland rain.",
        ],
        aefReference: "AEF 4 Unit 6B (Inversion for dramatic narrative emphasis)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار در لباس مبدل",
          speakerAvatar: "🩺",
          textEn: "Keep your cap low, Holmes. They didn't notice us! Cell Block C is right ahead!",
          textFa: "کلاهت را پایین نگه دار هلمز. متوجه ما نشدند! بلوک انفرادی C درست روبروست!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Consequence of Decision 1 (پیامد تصمیم اول)
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "B2",
    titleFa: "پیامد تصمیم اول: نفوذ بی‌صدا در برابر درگیری در راهرو",
    titleEn: "Consequence 1: Stealth Infiltration vs. Corridor Gunfight",
    locationFa: "دالان‌های گرانیتی طاق‌دار منتهی به بلوک C",
    locationEn: "Vaulted Granite Corridors, Cell Block C Approach",
    storyIntroFa: "پیامد تصمیمی که در حیاط گرفتید آشکار می‌شود: یا با تغییر چهره هوشمندانه در سکوت به قلب دژ نفوذ کرده‌اید، یا با شلیک گلوله دشمن را هوشیار ساخته و مسیر اصلی را به جهنمی از تله‌های انفجاری بدل کرده‌اید!",
    cutscene: {
      titleFa: "گذر از راهروی نگهبانان و کشف کلمه عبور شورشیان",
      titleEn: "Bypassing the Guard Posts & The Conspirators' Password",
      imageSrc: "/images/skills/speaking/b2_scene_3_stealth_corridor.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی در لباس مبدل",
          speakerAvatar: "🩺",
          textEn: "They muttered the password: 'Moonless Night'. The rogue wardens are preparing to flood the boiler with coal gas!",
          textFa: "کلمه عبور را زمزمه کردند: «شب بدون ماه». نگهبانان شورشی آماده می‌شوند دیگ بخار را با گاز زغال‌سنگ پر کنند!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Which proves that open combat would have cost us the element of surprise. Look, Cell 9 has been breached!",
          textFa: "این ثابت می‌کند که نبرد علنی عنصر غافلگیری را از ما می‌گرفت. نگاه کن، سلول ۹ باز شده است!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "پیامد ۱الف: نفوذ بی‌صدا و شنیدن نقشه انفجار دیگ بخار",
        titleEn: "Consequence 1A: Undetected Passage & Overhearing the Gas Plot",
        storyIntroFa: "با لباس مبدل و سر خمیده، درست از کنار سه نگهبان مسلح شورشی می‌گذرید. آن‌ها شما را با نگهبانان برج ۳ اشتباه می‌گیرند و زمزمه می‌کنند: «استرلینگ گفت شیر گاز را روی دیگ‌های بند شرقی قفل کنید تا کسی زنده نماند!» با کسب این اطلاعات حیاتی و بدون شلیک حتی یک تیر، به درب سلول ۹ می‌رسید.",
        cutscene: {
          titleFa: "نفوذ بی‌نقص به راهروی سلول‌های انفرادی",
          titleEn: "Silent Infiltration of the Isolation Wing",
          imageSrc: "/images/skills/speaking/b2_scene_3_stealth_corridor.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Had we engaged them in the courtyard, this crucial intel regarding the boiler sabotage would have been lost entirely.",
              textFa: "اگر در حیاط با آن‌ها درگیر شده بودیم، این اطلاعات حیاتی درباره خرابکاری دیگ بخار کاملاً از دست می‌رفت.",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار وفادار",
              speakerAvatar: "🩺",
              textEn: "They smashed the heavy iron bars of Cell 9! Let's examine the interior immediately!",
              textFa: "میله‌های آهنی سنگین سلول ۹ را خرد کرده‌اند! بیایید فوراً داخل را بررسی کنیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-b2-3-conditional-inversion-1a",
            titleFa: "استنتاج شرطی معکوس درباره عواقب درگیری مسلحانه",
            speakerPromptEn: "Step into the shadowy corridor and state the inverted hypothetical deduction...",
            speakerPromptFa: "به داخل دالان سایه‌دار قدم می‌گذاری و استنتاج شرطی معکوس‌ات را بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we entered)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر وارد یک درگیری مسلحانه آشکار می‌شدیم، توطئه‌گران مدارک حیاتی را فوراً نابود می‌کردند.»",
            targetKeywords: [
              { phrase: "Had we entered", hintFa: "(اگر وارد شده بودیم)", synonyms: ["had we entered", "if we had entered", "had we engaged"], weight: 50 },
              { phrase: "would have destroyed the vital evidence", hintFa: "(مدارک حیاتی را نابود می‌کردند)", synonyms: ["would have destroyed the vital evidence", "would have destroyed all evidence", "would have eliminated the evidence"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
            alternativeResponsesEn: [
              { phraseEn: "If we had started shooting in the yard, they would have destroyed all proof!", translationFa: "اگر در حیاط تیراندازی راه انداخته بودیم، آن‌ها تمام مدارک را نابود می‌کردند!" },
              { phraseEn: "Had we caused a firefight outside, the vital clues would have been burned.", translationFa: "اگر بیرون درگیری مسلحانه ایجاد کرده بودیم، سرنخ‌های حیاتی سوزانده می‌شدند." },
            ],
            whiteHintFa: "از ساختار شرطی نوع سوم معکوس بدون if یعنی Had we entered into an open gunfight استفاده کن!",
            fallbackChoices: [
              "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
              "This granite architecture reflects Victorian prison design perfectly.",
              "The damp air in this underground passage smells of sulphur.",
            ],
            aefReference: "AEF 4 Unit 4B (Inverted conditionals: Had I known / Had we done)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look inside the cell, Holmes! Chemical formulas written on the wall in chalk!",
              textFa: "داخل سلول را نگاه کن هلمز! فرمول‌های شیمیایی با گچ روی دیوار نوشته شده است!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "پیامد ۱ب: درگیری در حیاط و بمب‌گذاری راهرو توسط دشمن",
        titleEn: "Consequence 1B: Gunfight Repercussions & The Booby-Trapped Corridor",
        storyIntroFa: "شلیک‌های شما در حیاط دو شورشی را از پای درآورد اما صدای زنگ خطر دژ به صدا درآمد. شورشیان در حال عقب‌نشینی بشکه‌های باروت را در ورودی راهرو منفجر کردند. آوار گرانیت مسیر را مسدود ساخته و ۱۰ دقیقه گران‌بها صرف کنار زدن تخته‌سنگ‌ها با دیلم می‌شود تا به سلول ۹ برسید.",
        cutscene: {
          titleFa: "آوار سنگ در دالان و گرد و غبار باروت",
          titleEn: "Collapsed Granite & The Powder Smoke",
          imageSrc: "/images/skills/speaking/b2_scene_3_stealth_corridor.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک نفس‌نفس‌زنان",
              speakerAvatar: "🩺",
              textEn: "They detonated a black powder keg to slow our pursuit! My hands are covered in dust!",
              textFa: "آن‌ها یک بشکه باروت سیاه را منفجر کردند تا تعقیب ما را کند کنند! دستانم غرق خاک شده است!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مصمم",
              speakerAvatar: "🔍",
              textEn: "A costly delay Watson, but Cell 9 is open ahead. Let us see what Vance left behind!",
              textFa: "یک تاخیر پرهزینه بود واتسون، اما سلول ۹ روبروست. بگذار ببینیم ونس چه چیزی بر جای گذاشته است!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b2-3-conditional-inversion-1b",
            titleFa: "استنتاج شرطی معکوس درباره عواقب درگیری مسلحانه",
            speakerPromptEn: "Step into the shadowy corridor and state the inverted hypothetical deduction...",
            speakerPromptFa: "به داخل دالان سایه‌دار قدم می‌گذاری و استنتاج شرطی معکوس‌ات را بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we entered)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر وارد یک درگیری مسلحانه آشکار می‌شدیم، توطئه‌گران مدارک حیاتی را فوراً نابود می‌کردند.»",
            targetKeywords: [
              { phrase: "Had we entered", hintFa: "(اگر وارد شده بودیم)", synonyms: ["had we entered", "if we had entered", "had we engaged"], weight: 50 },
              { phrase: "would have destroyed the vital evidence", hintFa: "(مدارک حیاتی را نابود می‌کردند)", synonyms: ["would have destroyed the vital evidence", "would have destroyed all evidence", "would have eliminated the evidence"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
            alternativeResponsesEn: [
              { phraseEn: "If we had started shooting in the yard, they would have destroyed all proof!", translationFa: "اگر در حیاط تیراندازی راه انداخته بودیم، آن‌ها تمام مدارک را نابود می‌کردند!" },
              { phraseEn: "Had we caused a firefight outside, the vital clues would have been burned.", translationFa: "اگر بیرون درگیری مسلحانه ایجاد کرده بودیم، سرنخ‌های حیاتی سوزانده می‌شدند." },
            ],
            whiteHintFa: "از ساختار شرطی نوع سوم معکوس بدون if یعنی Had we entered into an open gunfight استفاده کن!",
            fallbackChoices: [
              "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
              "This granite architecture reflects Victorian prison design perfectly.",
              "The damp air in this underground passage smells of sulphur.",
            ],
            aefReference: "AEF 4 Unit 4B (Inverted conditionals: Had I known / Had we done)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look at the scratched stone wall, Holmes! Vance left a coded cipher!",
              textFa: "به دیوار سنگی خراشیده‌شده نگاه کن هلمز! ونس یک رمز رمزی بر جای گذاشته است!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-b2-3-conditional-inversion-default",
        titleFa: "استنتاج شرطی معکوس درباره عواقب درگیری مسلحانه",
        speakerPromptEn: "Step into the shadowy corridor and state the inverted hypothetical deduction...",
        speakerPromptFa: "به داخل دالان سایه‌دار قدم می‌گذاری و استنتاج شرطی معکوس‌ات را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we entered)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر وارد یک درگیری مسلحانه آشکار می‌شدیم، توطئه‌گران مدارک حیاتی را فوراً نابود می‌کردند.»",
        targetKeywords: [
          { phrase: "Had we entered", hintFa: "(اگر وارد شده بودیم)", synonyms: ["had we entered", "if we had entered", "had we engaged"], weight: 50 },
          { phrase: "would have destroyed the vital evidence", hintFa: "(مدارک حیاتی را نابود می‌کردند)", synonyms: ["would have destroyed the vital evidence", "would have destroyed all evidence", "would have eliminated the evidence"], weight: 50 },
        ],
        idealVoiceResponseEn: "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
        alternativeResponsesEn: [
          { phraseEn: "If we had started shooting in the yard, they would have destroyed all proof!", translationFa: "اگر در حیاط تیراندازی راه انداخته بودیم، آن‌ها تمام مدارک را نابود می‌کردند!" },
          { phraseEn: "Had we caused a firefight outside, the vital clues would have been burned.", translationFa: "اگر بیرون درگیری مسلحانه ایجاد کرده بودیم، سرنخ‌های حیاتی سوزانده می‌شدند." },
        ],
        whiteHintFa: "از ساختار شرطی نوع سوم معکوس بدون if یعنی Had we entered into an open gunfight استفاده کن!",
        fallbackChoices: [
          "Had we entered into an open gunfight, the conspirators would have destroyed the vital evidence immediately.",
          "This granite architecture reflects Victorian prison design perfectly.",
          "The damp air in this underground passage smells of sulphur.",
        ],
        aefReference: "AEF 4 Unit 4B (Inverted conditionals: Had I known / Had we done)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look inside the cell, Holmes! Chemical formulas written on the wall in chalk!",
          textFa: "داخل سلول را نگاه کن هلمز! فرمول‌های شیمیایی با گچ روی دیوار نوشته شده است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: Cell Block C & Vance's Secret Decoy (رمز گچی سلول ۹)
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "B2",
    titleFa: "بلوک انفرادی C و دست‌نوشته‌های رمزدار ونس",
    titleEn: "Cell Block C: The Smashed Cell & Vance's Secret Decoy",
    locationFa: "سلول انفرادی شماره ۹، بلوک C زندان دارتمور",
    locationEn: "Isolation Cell 9, Cell Block C, Dartmoor Prison",
    storyIntroFa: "وارد سلول سرد و نمناک ۹ می‌شوید. غل و زنجیرهای شکسته روی تخت آهنی افتاده است. دکتر ونس دقایقی پیش توسط استرلینگ به سمت موتورخانه زیرزمینی کشانده شده است. اما روی دیوار سنگی خاکستری، معادلاتی پیچیده با گچ معدنی نوشته شده است. شرلوک با ذره‌بین خطوط را می‌کاود و ناگهان لبخند می‌زند: فرمول‌هایی که ونس در دفترچه‌اش به شورشیان داده یک ترکیب انفجاری بی‌اثر است! فرمول اصلی و حقیقی پوشه شماره ۲ MI6 در درز آجرهای بالای دودکش پنهان شده است!",
    cutscene: {
      titleFa: "کشف دست‌نوشته‌های گچی و هوش سرشار دانشمند MI6",
      titleEn: "The Chalk Equations & Vance's Brilliant Deception",
      imageSrc: "/images/skills/speaking/b2_scene_4_cell_block_c.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at the valency bonds in this formula, John! Vance purposely reversed the nitrogen components! He gave them a decoy notebook!",
          textFa: "به پیوندهای ظرفیتی در این فرمول نگاه کن جان! ونس عمداً اجزای نیتروژن را معکوس کرده است! او یک دفترچه ساختگی به آن‌ها داده است!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "A brave man indeed! But Sterling doesn't know it yet. If they reach the boiler and test the formula, they will execute Vance on the spot!",
          textFa: "براستی که مرد شجاعی است! اما استرلینگ هنوز نمی‌داند. اگر به موتورخانه برسند و فرمول را بیازمایند، ونس را در جا اعدام خواهند کرد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-4-inversion-no-sooner",
        titleFa: "بیان درک ترفند فریبنده با ساختار No sooner had I",
        speakerPromptEn: "Point your magnifying glass toward the scratched equations and formulate your deduction...",
        speakerPromptFa: "ذره‌بینت را به سمت معادلات خراشیده‌شده نشانه می‌روی و استنتاج حرفه‌ای‌ات را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (ساختار معکوس No sooner had I... than)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «به محض اینکه معادلات شیمیایی را بررسی کردم، متوجه شدم ونس یک فریب هوشمندانه آماده کرده بود.»",
        targetKeywords: [
          { phrase: "No sooner had I examined", hintFa: "(به محض اینکه بررسی کردم)", synonyms: ["no sooner had i examined", "hardly had i examined", "scarcely had i examined"], weight: 50 },
          { phrase: "prepared a clever decoy", hintFa: "(یک فریب هوشمندانه آماده کرده بود)", synonyms: ["prepared a clever decoy", "crafted a clever decoy", "created a clever decoy", "set up a clever decoy"], weight: 50 },
        ],
        idealVoiceResponseEn: "No sooner had I examined the chemical equations than I realized Vance had prepared a clever decoy.",
        alternativeResponsesEn: [
          { phraseEn: "Hardly had I studied the chemical formula when I realized Vance gave them a decoy!", translationFa: "به ندرت فرمول شیمیایی را بررسی کرده بودم که فهمیدم ونس یک فریب به آن‌ها داده است!" },
          { phraseEn: "No sooner had I read the wall than I knew Vance prepared a brilliant trap.", translationFa: "به محض اینکه دیوار را خواندم، دانستم ونس یک تله درخشان آماده کرده است." },
        ],
        whiteHintFa: "از ساختار معکوس No sooner had I examined the chemical equations than I realized... استفاده کن!",
        fallbackChoices: [
          "No sooner had I examined the chemical equations than I realized Vance had prepared a clever decoy.",
          "The chemical symbols on this wall are difficult for a non-scientist to read.",
          "Let us collect some chalk dust as physical evidence for Scotland Yard.",
        ],
        aefReference: "AEF 4 Unit 6B (Inversion with No sooner... than)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Listen, Holmes! Hissing steam is vibrating through the floor grating! The Boiler Room!",
          textFa: "گوش کن هلمز! صدای فش‌فش بخار از شبکه کف زمین می‌لرزد! موتورخانه بخار!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — The Boiler Room Sabotage (فاجعه دیگ بخار)
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "B2",
    titleFa: "تصمیم دوم: موتورخانه بخار و دیگ‌های جوشان",
    titleEn: "DECISION 2: Boiler Room Sabotage — Inmate Rescue vs. Pursuit",
    locationFa: "موتورخانه زیرزمینی و دیگ‌های بخار فشارقوی زندان دارتمور",
    locationEn: "Underground High-Pressure Boiler Room, Dartmoor",
    storyIntroFa: "شما و واتسون از پله‌های چدنی به زیرزمین موتورخانه سرازیر می‌شوید. گرما غیرقابل‌تحمل است و بخار سفید و داغ با صدای مهیبی از لوله‌ها زبانه می‌کشد. شورشیان سوپاپ‌های اضطراری تخلیه فشار را با زنجیر بسته‌اند! عقربه فشارسنج در منطقه سرخ قرار دارد و بخار فوق‌العاده داغ در حال هدایت به کانال‌های تهویه بند شرقی است که پنجاه زندانی و نگهبان وفادار در سلول‌های بسته به دام افتاده‌اند! در آن‌سوی سالن پر از بخار، استرلینگ با کشیدن دکتر ونس به سمت تونل فاضلاب قدیمی معدن در حال فرار است. اهرم چرخ‌دنده‌ای قرمز تخلیه بخار در پنج متری شماست!",
    cutscene: {
      titleFa: "دیگ‌های بخار در آستانه انفجار و هدایت بخار به بند شرقی",
      titleEn: "The Overheated Boilers & The Trapped East Wing Inmates",
      imageSrc: "/images/skills/speaking/b2_scene_5_boiler_room.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک شوکه‌شده",
          speakerAvatar: "🩺",
          textEn: "Holmes! Look at the manifold! If that superheated steam enters the East Wing cells, fifty locked-in men will be boiled alive!",
          textFa: "هلمز! به چندراهه لوله‌ها نگاه کن! اگر آن بخار فوق‌داغ وارد سلول‌های بند شرقی شود، ۵۰ انسان محبوس زنده در آتش بخار خواهند سوخت!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه در دوراهی مرگبار",
          speakerAvatar: "🔍",
          textEn: "Sterling is dragging Vance through the tin mine sluice gate right now! If we release the valve, the thief escapes into the tunnels!",
          textFa: "استرلینگ همین الان دارد ونس را از دریچه آبراهه معدن قلع می‌برد! اگر شیر را آزاد کنیم، سارق به داخل تونل‌ها فرار می‌کند!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b2-2",
      promptFa: "یک دوراهی اخلاقی عمیق: آیا جان ۵۰ انسان در بند شرقی را نجات می‌دهید یا به دنبال ربوده شدن دانشمند MI6 می‌دوید؟",
      promptEn: "Critical Choice: Vent the emergency steam valve to save fifty trapped prisoners, or chase Sterling down the mine shaft?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Vent the emergency steam valve to save fifty trapped lives",
          labelFa: "گزینه ۲الف: اولویت نجات انسان‌ها — مهار سوپاپ تخلیه اضطراری بخار با واتسون",
          descriptionFa: "جان ۵۰ زندانی و نگهبان را نجات می‌دهید؛ رئیس زندان نجات یافته و نقشه سری کانال‌های فرار معدن را به شما می‌دهد.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Chase Sterling immediately into the flooding mine shaft",
          labelFa: "گزینه ۲ب: تعقیب بی‌درنگ استرلینگ و ونس به داخل تونل‌های تاریک معدن",
          descriptionFa: "بخار سمی در بند شرقی فاجعه می‌آفریند؛ گاز داغ تونل را پر کرده و شرلوک در اثر سرفه‌های شدید تعقیب را کند پیش می‌برد.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-5-unless-conditional",
        titleFa: "بیان اخطار اضطراری نجات زندانیان با قید شرط Unless",
        speakerPromptEn: "Lunge toward the burning hot iron wheel of the valve and issue your moral ultimatum...",
        speakerPromptFa: "به سمت چرخ آهنی داغ و سوزان سوپاپ خیز برمی‌داری و اولتیماتوم اخلاقی‌ات را فریاد می‌زنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شرطی قاطع با Unless)",
        speakerAvatar: "🔍",
        taskInstructionFa: "فریاد بزن: «مگر اینکه همین الان سوپاپ اضطراری بخار را آزاد کنیم، پنجاه زندانی بی‌گناه زنده در آتش بخار خواهند سوخت!»",
        targetKeywords: [
          { phrase: "Unless we release the emergency", hintFa: "(مگر اینکه آزاد کنیم)", synonyms: ["unless we release the emergency", "unless we open the emergency", "unless we turn the emergency"], weight: 50 },
          { phrase: "scalded to death", hintFa: "(در آتش بخار خواهند سوخت)", synonyms: ["scalded to death", "boiled alive", "burned to death by steam"], weight: 50 },
        ],
        idealVoiceResponseEn: "Unless we release the emergency steam valve right now, fifty innocent prisoners will be scalded to death.",
        alternativeResponsesEn: [
          { phraseEn: "Unless we vent this steam valve immediately, fifty trapped men will be boiled alive!", translationFa: "مگر اینکه این شیر بخار را فوراً تخلیه کنیم، پنجاه انسان محبوس زنده زنده پخته خواهند شد!" },
          { phraseEn: "If we do not open this relief valve right now, those prisoners will die in scalding steam!", translationFa: "اگر همین الان این شیر تخلیه را باز نکنیم، آن زندانیان در بخار سوزان خواهند مرد!" },
        ],
        whiteHintFa: "از قید شرط منفی Unless we release the emergency steam valve و عبارت مجهول will be scalded to death استفاده کن!",
        fallbackChoices: [
          "Unless we release the emergency steam valve right now, fifty innocent prisoners will be scalded to death.",
          "The pressure gauges in this boiler room are manufactured in Birmingham.",
          "We should find a pair of thick leather gloves to handle the hot pipes.",
        ],
        aefReference: "AEF 4 Unit 4A (Conditional linkers: unless / in case / provided)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار فداکار",
          speakerAvatar: "🩺",
          textEn: "I'll use my coat to grip the scalding wheel! Heave, Holmes, HEAVE!",
          textFa: "پالتویم را دور چرخ سوزان می‌پیچم! زور بزن هلمز، زور بزن!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Consequence of Decision 2 (پیامد تصمیم دوم)
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "B2",
    titleFa: "پیامد تصمیم دوم: مهار حرارت دیگ‌ها در برابر قربانی شدن بی‌گناهان",
    titleEn: "Consequence 2: The Warden's Cooperation vs. Choking Steam",
    locationFa: "دهانه ورودی تونل‌های زهکشی معدن قلع",
    locationEn: "Drainage Sluice Entry, Ancient Tin Mines",
    storyIntroFa: "پیامد انتخابتان در برابر دیگ بخار نمایان می‌شود: یا با ایثارگری جان ده‌ها انسان را نجات داده و متحدی قدرتمند به دست آورده‌اید، یا با تعقیب اسناد، فاجعه‌ای انسانی به بار آمده و گاز داغ پیشروی‌تان را کند ساخته است!",
    cutscene: {
      titleFa: "تخلیه بخار به بیرون و نجات رئیس کل زندان",
      titleEn: "Steam Venting & Rescue of the Prison Governor",
      imageSrc: "/images/skills/speaking/b2_scene_6_steam_valve.jpg",
      dialogues: [
        {
          speakerId: "governor",
          speakerNameFa: "رئیس کل زندان دارتمور",
          speakerRoleFa: "مسئول ارشد نجات‌یافته",
          speakerAvatar: "🎖️",
          textEn: "Mr. Holmes! You and Dr. Watson saved our lives! Sterling took Vance into the flooded tin mines. Take this brass key to the floodgates!",
          textFa: "آقای هلمز! شما و دکتر واتسون جان ما را نجات دادید! استرلینگ ونس را به معدن سیلابی قلع برد. این کلید برنجی دریچه‌ها را بگیرید!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Thank you, Governor. Having neutralized the threat to your men, we can now corner Sterling in the subterranean caverns!",
          textFa: "متشکرم رئیس. با خنثی کردن تهدید علیه افرادتان، اکنون می‌توانیم استرلینگ را در دالان‌های زیرزمینی به دام بیندازیم!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "پیامد ۲الف: همکاری رئیس زندان و دریافت کلید دریچه‌ها",
        titleEn: "Consequence 2A: The Governor's Gratitude & The Canal Blueprint",
        storyIntroFa: "با چرخاندن اهرم با کمک پالتوی واتسون، بخار فشرده با صفیر ممتد از لوله‌های خارجی به دل هوای مه‌آلود دارتمور شلیک می‌شود. پنجاه انسان در بند شرقی نجات می‌یابند. رئیس کل زندان که در میان آن‌ها بود، کلید کنترل آب و نقشه مخفی کانال‌های زیرزمینی معدن قلع را به شما تقدیم می‌کند.",
        cutscene: {
          titleFa: "اهدای کلید دریچه‌های زیرزمینی توسط رئیس زندان",
          titleEn: "The Prison Governor Hands Over the Sluice Key",
          imageSrc: "/images/skills/speaking/b2_scene_6_steam_valve.jpg",
          dialogues: [
            {
              speakerId: "governor",
              speakerNameFa: "رئیس زندان",
              speakerRoleFa: "نجات‌یافته",
              speakerAvatar: "🎖️",
              textEn: "The lower mines are booby-trapped with dynamite! Use the sluice levers to flood their escape route!",
              textFa: "معادن پایینی با دینامیت تله‌گذاری شده است! از اهرم‌های آبراهه استفاده کنید تا مسیر فرارشان را ببندید!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Watson, check your ammunition. We are entering the subterranean labyrinth!",
              textFa: "واتسون، مهماتت را بررسی کن. ما وارد هزارتوی زیرزمینی می‌شویم!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b2-6-participle-clause-2a",
            titleFa: "بیان پیامد مهار فاجعه با عبارت وصفی زمان کامل Having averted",
            speakerPromptEn: "Step toward the dripping mine opening and report the strategic gain to Watson...",
            speakerPromptFa: "به سمت دهانه چکه‌کننده معدن گام برمی‌داری و دستاورد استراتژیک را برای واتسون تحلیل می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (عبارت وصفی مقدماتی Having + past participle)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «با مهار فاجعه دیگ بخار، ما همکاری کامل رئیس زندان را به دست آوردیم.»",
            targetKeywords: [
              { phrase: "Having averted the boiler catastrophe", hintFa: "(با مهار فاجعه دیگ بخار)", synonyms: ["having averted the boiler catastrophe", "having stopped the boiler catastrophe", "having prevented the boiler catastrophe"], weight: 50 },
              { phrase: "full cooperation of the prison warden", hintFa: "(همکاری کامل رئیس زندان)", synonyms: ["full cooperation of the prison warden", "full cooperation of the governor", "complete support of the warden"], weight: 50 },
            ],
            idealVoiceResponseEn: "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
            alternativeResponsesEn: [
              { phraseEn: "By preventing the boiler disaster, we obtained the complete assistance of the governor!", translationFa: "با جلوگیری از فاجعه دیگ، کمک کامل رئیس را به دست آوردیم!" },
              { phraseEn: "Having saved the prisoners from the steam, we now hold the master keys to the mines.", translationFa: "با نجات زندانیان از بخار، حالا کلیدهای اصلی معادن را در دست داریم." },
            ],
            whiteHintFa: "از ساختار مقتدرانه وصفی زمان کامل Having averted the boiler catastrophe... استفاده کن!",
            fallbackChoices: [
              "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
              "The governor should inspect his guard recruits more carefully in the future.",
              "Tin mining was the primary industry in Devon for many centuries.",
            ],
            aefReference: "AEF 4 Unit 7A (Participle clauses: Having done / Being done)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار وفادار",
              speakerAvatar: "🩺",
              textEn: "Let's plunge into the water tunnels, Holmes! The scent of burning dynamite is in the air!",
              textFa: "به داخل تونل‌های آب بزنیم هلمز! بوی دینامیت سوزان در هواست!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "پیامد ۲ب: پر شدن تونل از گاز داغ و سرفه‌های فلج‌کننده",
        titleEn: "Consequence 2B: Choking Steam Clouds & Impeded Pursuit",
        storyIntroFa: "شما دیگ بخار را رها می‌کنید و وارد تونل می‌شوید. صدای فریادهای دردناک از بند شرقی در دالان می‌پیچد. گاز متراکم و داغ از درزها به داخل تونل سرریز می‌کند؛ چشمانتان می‌سوزد و سرفه‌های شدید امانتان را می‌برد. استرلینگ از این فرصت بهره برده و فتیله دینامیت‌های پایه‌های معدن را روشن می‌کند.",
        cutscene: {
          titleFa: "سرفه‌های شدید در تونل پر از گاز داغ",
          titleEn: "Coughing in the Scalding Mist of the Tunnel",
          imageSrc: "/images/skills/speaking/b2_scene_6_steam_valve.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک در میان سرفه",
              speakerAvatar: "🩺",
              textEn: "*Coughs violently* This scalding vapor is blinding us, Holmes! We can barely see three paces ahead!",
              textFa: "*سرفه‌های شدید* این بخار سوزان دارد کورمان می‌کند هلمز! به سختی سه قدم جلوتر را می‌بینیم!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه سرسخت",
              speakerAvatar: "🔍",
              textEn: "Cover your mouth with your damp scarf! We must reach the floodgate before the dynamite explodes!",
              textFa: "دهانت را با دستمال‌گردن خیس بپوشان! باید قبل از انفجار دینامیت به دریچه آبراهه برسیم!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-b2-6-participle-clause-2b",
            titleFa: "بیان پیامد مهار فاجعه با عبارت وصفی زمان کامل Having averted",
            speakerPromptEn: "Step toward the dripping mine opening and report the strategic gain to Watson...",
            speakerPromptFa: "به سمت دهانه چکه‌کننده معدن گام برمی‌داری و دستاورد استراتژیک را برای واتسون تحلیل می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (عبارت وصفی مقدماتی Having + past participle)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «با مهار فاجعه دیگ بخار، ما همکاری کامل رئیس زندان را به دست آوردیم.»",
            targetKeywords: [
              { phrase: "Having averted the boiler catastrophe", hintFa: "(با مهار فاجعه دیگ بخار)", synonyms: ["having averted the boiler catastrophe", "having stopped the boiler catastrophe", "having prevented the boiler catastrophe"], weight: 50 },
              { phrase: "full cooperation of the prison warden", hintFa: "(همکاری کامل رئیس زندان)", synonyms: ["full cooperation of the prison warden", "full cooperation of the governor", "complete support of the warden"], weight: 50 },
            ],
            idealVoiceResponseEn: "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
            alternativeResponsesEn: [
              { phraseEn: "By preventing the boiler disaster, we obtained the complete assistance of the governor!", translationFa: "با جلوگیری از فاجعه دیگ، کمک کامل رئیس را به دست آوردیم!" },
              { phraseEn: "Having saved the prisoners from the steam, we now hold the master keys to the mines.", translationFa: "با نجات زندانیان از بخار، حالا کلیدهای اصلی معادن را در دست داریم." },
            ],
            whiteHintFa: "از ساختار مقتدرانه وصفی زمان کامل Having averted the boiler catastrophe... استفاده کن!",
            fallbackChoices: [
              "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
              "The governor should inspect his guard recruits more carefully in the future.",
              "Tin mining was the primary industry in Devon for many centuries.",
            ],
            aefReference: "AEF 4 Unit 7A (Participle clauses: Having done / Being done)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "همکار در حال سرفه",
              speakerAvatar: "🩺",
              textEn: "Let's push through the smoke! I hear the hiss of dynamite fuses ahead!",
              textFa: "از میان دود پیش برویم! صدای فش‌فش فتیله‌های دینامیت را از روبرو می‌شنوم!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-b2-6-participle-clause-default",
        titleFa: "بیان پیامد مهار فاجعه با عبارت وصفی زمان کامل Having averted",
        speakerPromptEn: "Step toward the dripping mine opening and report the strategic gain to Watson...",
        speakerPromptFa: "به سمت دهانه چکه‌کننده معدن گام برمی‌داری و دستاورد استراتژیک را برای واتسون تحلیل می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (عبارت وصفی مقدماتی Having + past participle)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «با مهار فاجعه دیگ بخار، ما همکاری کامل رئیس زندان را به دست آوردیم.»",
        targetKeywords: [
          { phrase: "Having averted the boiler catastrophe", hintFa: "(با مهار فاجعه دیگ بخار)", synonyms: ["having averted the boiler catastrophe", "having stopped the boiler catastrophe", "having prevented the boiler catastrophe"], weight: 50 },
          { phrase: "full cooperation of the prison warden", hintFa: "(همکاری کامل رئیس زندان)", synonyms: ["full cooperation of the prison warden", "full cooperation of the governor", "complete support of the warden"], weight: 50 },
        ],
        idealVoiceResponseEn: "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
        alternativeResponsesEn: [
          { phraseEn: "By preventing the boiler disaster, we obtained the complete assistance of the governor!", translationFa: "با جلوگیری از فاجعه دیگ، کمک کامل رئیس را به دست آوردیم!" },
          { phraseEn: "Having saved the prisoners from the steam, we now hold the master keys to the mines.", translationFa: "با نجات زندانیان از بخار، حالا کلیدهای اصلی معادن را در دست داریم." },
        ],
        whiteHintFa: "از ساختار مقتدرانه وصفی زمان کامل Having averted the boiler catastrophe... استفاده کن!",
        fallbackChoices: [
          "Having averted the boiler catastrophe, we gained the full cooperation of the prison warden.",
          "The governor should inspect his guard recruits more carefully in the future.",
          "Tin mining was the primary industry in Devon for many centuries.",
        ],
        aefReference: "AEF 4 Unit 7A (Participle clauses: Having done / Being done)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Let's plunge into the water tunnels, Holmes! The scent of burning dynamite is in the air!",
          textFa: "به داخل تونل‌های آب بزنیم هلمز! بوی دینامیت سوزان در هواست!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — Underground Tin Mines (دینامیت در آبراهه)
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "B2",
    titleFa: "تصمیم سوم: تونل‌های معدن قلع و فتیله دینامیت",
    titleEn: "DECISION 3: The Subterranean Flooding Tin Mines & Dynamite",
    locationFa: "دالان‌های آب‌گرفته معدن باستانی قلع زیر دارتمور",
    locationEn: "Flooded Subterranean Tin Mines, Dartmoor",
    storyIntroFa: "آب سرد و گل‌آلود باتلاق تا زانوانتان بالا آمده است. قندیل‌های نمک و آب از سقف سنگی چکه می‌کند. پنجاه متر جلوتر، استرلینگ و سه شورشی از نردبان خروجی به سمت سطح باتلاق بالا می‌روند. روی ستون گرانیتی تکیه‌گاه غار، پنج لوله دینامیت معدنی بسته شده و فتیله جرقه‌زننده باروتی با سرعت در حال سوختن به سمت چاشنی است! اگر غار فرو بریزد، نگهبانان مجروح محبوس در زیرزمین غرق خواهند شد. اما در سمت راست، پلکان مارپیچ اضطراری مستقیماً به برج دیده‌بانی جنوبی می‌رود که فانوس گازی آن تنها راه علامت‌دهی به پادگان سواره‌نظام پرینستون است!",
    cutscene: {
      titleFa: "فتیله جرقه‌زن دینامیت در آبراهه و پلکان برج دیده‌بانی",
      titleEn: "The Sizzling Dynamite Fuse & The Watchtower Spiral Stairs",
      imageSrc: "/images/skills/speaking/b2_scene_7_tin_mines.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی در آب سرد",
          speakerAvatar: "🩺",
          textEn: "Holmes! That dynamite fuse has less than twenty seconds! If that pillar shatters, tons of granite will seal us and the hostages forever!",
          textFa: "هلمز! آن فتیله دینامیت کمتر از بیست ثانیه وقت دارد! اگر آن ستون خرد شود، تن‌ها سنگ گرانیت ما و گروگان‌ها را تا ابد دفن خواهد کرد!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "And if we don't light the watchtower searchlight on the surface, Sterling's armored wagon will vanish into the Grimpen Mire without trace!",
          textFa: "و اگر چراغ برج دیده‌بانی را در سطح روشن نکنیم، کالسکه زره‌پوش استرلینگ بدون هیچ ردپایی در باتلاق گریمپن ناپدید خواهد شد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b2-3",
      promptFa: "یک دوراهی حاد: آیا فتیله دینامیت را در آب می‌برید یا به برج دیده‌بانی برای فراخواندن ارتش می‌شتابید؟",
      promptEn: "Critical Choice: Dive to cut the burning dynamite fuse, or sprint up to the watchtower to signal the military garrison?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Dive into the freezing water to sever the burning dynamite fuse",
          labelFa: "گزینه ۳الف: شیرجه در آب یخ‌زده و بریدن فتیله دینامیت برای جلوگیری از ریزش غار",
          descriptionFa: "جان افراد محبوس را نجات می‌دهید، از ویرانی ستون‌ها جلوگیری می‌کنید و در امنیت از خروجی معدن خارج می‌شوید.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Sprint up the spiral stairs to ignite the watchtower searchlight",
          labelFa: "گزینه ۳ب: شتاب به سمت بالای برج دیده‌بانی برای روشن کردن چراغ افقی و خبر کردن ارتش",
          descriptionFa: "ستون معدن فرو می‌ریزد و ورودی مسدود می‌شود؛ اما نور قدرتمند برج، سواره‌نظام ارتش را در باتلاق به حرکت درمی‌آورد.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-7-third-conditional-fuse",
        titleFa: "تحلیل پیامد بریدن فتیله با شرطی نوع سوم If Watson had not",
        speakerPromptEn: "Look at the severed smoldering fuse in Watson's hand and speak the past deduction...",
        speakerPromptFa: "به فتیله دودکننده بریده‌شده در دست واتسون می‌نگری و استنتاجت را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (شرطی نوع سوم فرضی گذشته)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «اگر واتسون فتیله سوزان را به موقع نبریده بود، کل غار روی سرمان آوار می‌شد.»",
        targetKeywords: [
          { phrase: "If Watson had not severed", hintFa: "(اگر واتسون نبریده بود)", synonyms: ["if watson had not severed", "had watson not severed", "if you had not severed", "if watson had not cut"], weight: 50 },
          { phrase: "would have collapsed upon us", hintFa: "(روی سرمان آوار می‌شد)", synonyms: ["would have collapsed upon us", "would have fallen upon us", "would have buried us alive"], weight: 50 },
        ],
        idealVoiceResponseEn: "If Watson had not severed the burning fuse in time, the entire cavern would have collapsed upon us.",
        alternativeResponsesEn: [
          { phraseEn: "Had you not cut that fuse, Watson, tons of granite would have crushed us!", translationFa: "اگر آن فتیله را نبریده بودی واتسون، تن‌ها گرانیت ما را له می‌کرد!" },
          { phraseEn: "If Watson hadn't sliced the dynamite fuse, the ceiling would have collapsed instantly.", translationFa: "اگر واتسون فتیله دینامیت را نبریده بود، سقف فوراً فرو می‌ریخت." },
        ],
        whiteHintFa: "از ساختار شرطی نوع سوم If Watson had not severed the burning fuse... would have collapsed استفاده کن!",
        fallbackChoices: [
          "If Watson had not severed the burning fuse in time, the entire cavern would have collapsed upon us.",
          "Underground drainage systems in Devon are remarkably sophisticated.",
          "We must clean our revolvers thoroughly after exposure to this bog water.",
        ],
        aefReference: "AEF 4 Unit 4A (Third conditional + Complex verbs)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار قهرمان",
          speakerAvatar: "🩺",
          textEn: "The fuse is dead! Now take the iron ladder straight to the surface watchtower!",
          textFa: "فتیله خاموش شد! حالا از نردبان آهنی مستقیماً به برج دیده‌بانی در سطح برویم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 8: The Watchtower Searchlight (فانوس برج در باتلاق)
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "B2",
    titleFa: "فانوس برج دیده‌بانی و تعقیب در باتلاق گریمپن",
    titleEn: "The Watchtower Searchlight & The Grimpen Mire Pursuit",
    locationFa: "بالای برج دیده‌بانی سنگی مشرف به باتلاق گریمپن",
    locationEn: "South Watchtower & Grimpen Mire, Devonshire",
    storyIntroFa: "به بالای برج سنگی می‌رسید. باران شلاقی بر دیواره‌های برج می‌کوبد. سوپاپ گاز استیلن را باز کرده و فندک می‌زنید: شعله‌ای خیره‌کننده در کانون آینه مقعر روشن می‌شود! پرتو عظیم نور فانوس از میان پرده‌های مه سیاه عبور می‌کند و صحنه دشت گریمپن را آشکار می‌سازد. دو مایل جلوتر، کالسکه زره‌پوش سیاهی با چهار اسب سیاه در میان بوته‌های خاردار و باتلاق مرگبار در حال فرار است. چند قوطی فلزی حاوی کپسول‌های شیمیایی ناپایدار در پشت کالسکه به زنجیر کشیده شده است. صدای شیپور سواره‌نظام ارتش نشان می‌دهد که سربازان به دنبال پرتو نور در حرکتند.",
    cutscene: {
      titleFa: "پرتو نور فانوس روی کالسکه زره‌پوش در میان باتلاق",
      titleEn: "The Piercing Searchlight on the Fleeing Armored Wagon",
      imageSrc: "/images/skills/speaking/b2_scene_8_watchtower_searchlight.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look through the brass telescope, John! The carriage is veering toward the treacherous bog path! Those chemical canisters are shaking dangerously!",
          textFa: "از تلسکوپ برنجی نگاه کن جان! کالسکه دارد به سمت مسیر خائنانه باتلاق منحرف می‌شود! آن کپسول‌های شیمیایی به طرز خطرناکی می‌لرزند!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و نشانه‌گیر",
          speakerAvatar: "🩺",
          textEn: "The cavalry is galloping along the high road! If we take the shortcut across the granite tor, we can intercept them before they reach the main road!",
          textFa: "سواره‌نظام در امتداد جاده بالا چهارنعل می‌تازد! اگر میانبر صخره گرانیتی را برویم، می‌توانیم قبل از رسیدن به جاده اصلی جلویشان را بگیریم!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-8-passive-reporting",
        titleFa: "گزارش وضعیت کالسکه با ساختار مجهول روایی is reported to be",
        speakerPromptEn: "Observe the bouncing carriage through the rain and report the military intelligence...",
        speakerPromptFa: "کالسکه در حال تکان را از میان باران می‌نگری و گزارش اطلاعاتی را با مجهول روایی اعلام می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (مجهول روایی رسمی is reported to be)",
        speakerAvatar: "🔍",
        taskInstructionFa: "گزارش بده: «گزارش شده است که کالسکه فراری حامل کپسول‌های شیمیایی فرار در سراسر این باتلاق خائنانه است.»",
        targetKeywords: [
          { phrase: "is reported to be carrying", hintFa: "(گزارش شده است که حامل است)", synonyms: ["is reported to be carrying", "is believed to be carrying", "is reported to carry"], weight: 50 },
          { phrase: "across the treacherous moor", hintFa: "(در سراسر این باتلاق خائنانه)", synonyms: ["across the treacherous moor", "across the treacherous bog", "through the treacherous moor"], weight: 50 },
        ],
        idealVoiceResponseEn: "The runaway carriage is reported to be carrying the volatile chemical canisters across the treacherous moor.",
        alternativeResponsesEn: [
          { phraseEn: "The fleeing wagon is reported to be transporting volatile chemicals across the bog!", translationFa: "گزارش شده که واگن فراری در حال حمل مواد شیمیایی فرار در سراسر باتلاق است!" },
          { phraseEn: "That carriage is believed to be carrying explosive chemical canisters through the mire.", translationFa: "باور بر این است که آن کالسکه کپسول‌های شیمیایی انفجاری را از میان لجن‌زار حمل می‌کند." },
        ],
        whiteHintFa: "از ساختار مجهول خبری B2 یعنی is reported to be carrying و صفت treacherous moor استفاده کن!",
        fallbackChoices: [
          "The runaway carriage is reported to be carrying the volatile chemical canisters across the treacherous moor.",
          "Dartmoor ponies can navigate these muddy tracks with remarkable speed.",
          "The military detachment from Princetown should arrive within ten minutes.",
        ],
        aefReference: "AEF 4 Unit 5B (Passive reporting structures: It is said / He is reported to)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار وفادار",
          speakerAvatar: "🩺",
          textEn: "Mount the horses, Holmes! We must cut them off at the Grimpen Edge!",
          textFa: "سوار اسب‌ها شو هلمز! باید در لبه گریمپن راهشان را ببندیم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4 — The Bog's Edge Standoff (نبرد در لبه باتلاق)
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "B2",
    titleFa: "تصمیم چهارم: نبرد کالسکه زرهی در لبه باتلاق مرگبار",
    titleEn: "DECISION 4: The Armored Carriage at the Bog's Edge",
    locationFa: "لبه صخره‌های گریمپن و لجن‌زار مرگبار در دل طوفان",
    locationEn: "Edge of the Grimpen Mire, Thunderstorm, Dartmoor",
    storyIntroFa: "شما و واتسون از میان صخره‌ها جلوی کالسکه فراری ظاهر می‌شوید. چرخ‌های سنگین کالسکه در لجن چسبناک باتلاق گریمپن گیر کرده اما چهار اسب تنومند در حال کشیدن آن به سمت جاده سنگ‌فرش هستند. در پشت کالسکه، کپسول‌های زرد و فسفری نیتروگلیسیرین به لرزش افتاده‌اند. استرلینگ با چهره‌ای خون‌آلود دکتر ونس را با زنجیر جلوی خود گرفته و تپانچه پر شده‌اش را به سمت سینه شما نشانه می‌رود! یک گلوله خطا به بدنه کالسکه، باعث انفجار هولناک ترکیبات شیمیایی و نابودی فرمول‌ها و دانشمند خواهد شد!",
    cutscene: {
      titleFa: "رویارویی پایانی در لبه باتلاق و شلیک سرنوشت‌ساز",
      titleEn: "Final Standoff at the Grimpen Edge & The Decisive Target",
      imageSrc: "/images/skills/speaking/b2_scene_9_grimpen_wagon.jpg",
      dialogues: [
        {
          speakerId: "sterling",
          speakerNameFa: "معاون استرلینگ",
          speakerRoleFa: "سرکرده شورشیان هاوند",
          speakerAvatar: "🐺",
          textEn: "Step aside Holmes, or I shoot Vance through the heart and blow this entire bog to hell!",
          textFa: "برو کنار هلمز، وگرنه به قلب ونس شلیک می‌کنم و کل این باتلاق را به هوا می‌فرستم!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی و نشانه‌گیر",
          speakerAvatar: "🩺",
          textEn: "My rifle is sighted on his weapon arm, Holmes! But the rear wheel axle is exposed against the rock! Which target do we hit?!",
          textFa: "تفنگم روی دست مسلحش قفل است هلمز! اما محور چرخ عقب کالسکه روبروی صخره باز است! به کدام هدف شلیک کنیم؟! ",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-b2-4",
      promptFa: "آخرین تصمیم سرنوشت‌ساز B2: آیا محور چرخ کالسکه را هدف می‌گیرید یا مستقیماً به استرلینگ شلیک می‌کنید؟",
      promptEn: "Final Critical Choice: Shoot the carriage axle to overturn it safely, or fire directly at Sterling with explosive risk?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Shoot the rear carriage axle to overturn it safely in the mud",
          labelFa: "گزینه ۴الف: شلیک دقیق به محور فلزی چرخ عقب کالسکه برای واژگونی ایمن در گل بدون انفجار کپسول‌ها",
          descriptionFa: "محور چرخ خرد می‌شود؛ کالسکه به نرمی در پیت نرم باتلاق واژگون می‌شود، مواد منفجر نمی‌شوند و ونس سالم نجات می‌یابد.",
          pointsDelta: 150,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Fire directly at Sterling at the risk of detonating the chemical canisters",
          labelFa: "گزینه ۴ب: شلیک مستقیم به سمت استرلینگ با پذیرش ریسک اصابت گلوله به محفظه حساس نیتروگلیسیرین",
          descriptionFa: "استرلینگ تیر می‌خورد اما تیر کمانی به کپسول‌ها اصابت می‌کند؛ انفجار رخ می‌دهد و ونس به شدت مجروح می‌شود.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-9-purpose-clause",
        titleFa: "صدور فرمان شلیک به محور چرخ با قید هدف so that",
        speakerPromptEn: "Raise your arm and give Watson the precise tactical ballistics command...",
        speakerPromptFa: "دستت را بالا می‌آوری و دستور بالستیک دقیق تاکتیکی را به واتسون ابلاغ می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (فرمان صریح با قید هدف so that)",
        speakerAvatar: "🔍",
        taskInstructionFa: "فرمان بده: «فوراً محور چرخ عقب کالسکه را نشانه بگیر تا وسیله نقلیه با امنیت و دور از کپسول‌های انفجاری واژگون شود!»",
        targetKeywords: [
          { phrase: "Target the rear carriage axle", hintFa: "(محور چرخ عقب را نشانه بگیر)", synonyms: ["target the rear carriage axle", "aim for the rear axle", "shoot the rear carriage axle", "target the carriage axle"], weight: 50 },
          { phrase: "overturns safely away from", hintFa: "(با امنیت و دور از... واژگون شود)", synonyms: ["overturns safely away from", "falls safely away from", "flips safely away from", "stops safely away from"], weight: 50 },
        ],
        idealVoiceResponseEn: "Target the rear carriage axle immediately so that the vehicle overturns safely away from the explosive canisters!",
        alternativeResponsesEn: [
          { phraseEn: "Aim for the rear axle right now so the carriage tips over without detonating the chemicals!", translationFa: "همین الان محور عقب را نشانه بگیر تا کالسکه بدون انفجار مواد شیمیایی واژگون شود!" },
          { phraseEn: "Shoot the wheel axle immediately so that it crashes safely away from the canisters!", translationFa: "فوراً به محور چرخ شلیک کن تا با امنیت و دور از کپسول‌ها سقوط کند!" },
        ],
        whiteHintFa: "از فعل امری Target the rear carriage axle و ساختار هدف so that the vehicle overturns safely away from... استفاده کن!",
        fallbackChoices: [
          "Target the rear carriage axle immediately so that the vehicle overturns safely away from the explosive canisters!",
          "A horse-drawn carriage cannot maintain balance on wet peat.",
          "The thunderstorm seems to be moving eastward toward Exeter.",
        ],
        aefReference: "AEF 4 Unit 5A (Clauses of purpose: so that + Modal verbs)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "تک‌تیرانداز ارتش",
          speakerAvatar: "🩺",
          textEn: "Crack! *A clean rifle shot shatters the iron axle!* The carriage tilts into the mire!",
          textFa: "شلیک! *شلیک تمیز تفنگ محور آهنی را خرد می‌کند!* کالسکه در لجن‌زار واژگون می‌شود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: Climax, The Plot Twist & The Crown Ledger (فرجام کار و دفترچه تاج)
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "B2",
    titleFa: "پرده دهم: فرجام کار، پلات‌توییست بزرگ و افشای دفترچه تاج",
    titleEn: "Stage 10: The Grand Resolution, The Plot Twist & The Crown Ledger",
    locationFa: "صخره‌های گرانیتی دارتمور در طلوع خونین صبح",
    locationEn: "Dartmoor Granite Tors, Blood-Red Dawn",
    storyIntroFa: "چرخ کالسکه با برخورد گلوله واتسون متلاشی شده و واگن به نرمی روی بستر لجن‌زار پیت فرود می‌آید، بدون آنکه کپسول‌های فرار منفجر شوند. سواره‌نظام ارتش از راه می‌رسد و استرلینگ و شورشیان باقیمانده را دستبند می‌زند. دکتر آلیستر ونس بدون جراحت از کالسکه نجات داده می‌شود و با سپاسگزاری عمیق، دفترچه فرمول‌های اصلی پوشه شماره ۲ MI6 را از درز مخفی پالتویش تقدیم شرلوک می‌کند. اما در جیب داخلی پالتوی استرلینگ، جعبه نقره‌ای مهروموم‌شده‌ای با نشان دربار سلطنتی کشف می‌شود...",
    cutscene: {
      titleFa: "نجات دکتر ونس و کشف جعبه نقره‌ای با نشان دربار",
      titleEn: "Dr. Vance Rescued & The Silver Royal Box Discovered",
      imageSrc: "/images/skills/speaking/b2_scene_10_tors_crown_ledger.jpg",
      dialogues: [
        {
          speakerId: "vance",
          speakerNameFa: "دکتر آلیستر ونس",
          speakerRoleFa: "شیمی‌دان ارشد MI6",
          speakerAvatar: "🧪",
          textEn: "Mr. Holmes, Dr. Watson! You saved the chemical defenses of the British realm! Here is Folder Number Two, completely intact!",
          textFa: "آقای هلمز، دکتر واتسون! شما پدافند شیمیایی قلمرو بریتانیا را نجات دادید! این پوشه شماره دو است، کاملاً دست‌نخورده!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at this silver cylinder retrieved from Sterling's coat, Watson. It contains a singed page bearing the Royal Lion and Unicorn crest!",
          textFa: "به این استوانه نقره‌ای کشف‌شده از پالتوی استرلینگ نگاه کن واتسون. این حاوی برگی نیمه‌سوخته با نشان شیر و تک‌شاخ سلطنتی است!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-b2-10-crown-ledger-deduction",
        titleFa: "استنتاج کشف برگه زرکوب دفترچه تاج و نفوذ موریارتی به دربار",
        speakerPromptEn: "Hold up the burnt royal parchment against the rising sun and speak your chilling deduction...",
        speakerPromptFa: "پوستینه سلطنتی سوخته را رو به طلوع خورشید بالا می‌گیری و استنتاج مو بر تن سیخ‌کننده را اعلام می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (استنتاج با افعال وجهی و حروف اضافه رسمی)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «این برگه زرکوب باید نشانه نفوذ موریارتی به تالار بایگانی سلطنتی در لندن باشد!»",
        targetKeywords: [
          { phrase: "gold-embossed page", hintFa: "(برگه زرکوب)", synonyms: ["gold-embossed page", "this gold-embossed page", "gilded royal page", "gold-crested page"], weight: 50 },
          { phrase: "Moriarty's infiltration into the Royal Archives", hintFa: "(نفوذ موریارتی به بایگانی سلطنتی)", synonyms: ["moriarty's infiltration into the royal archives", "moriarty's breach into the royal archives", "infiltration into the royal archives"], weight: 50 },
        ],
        idealVoiceResponseEn: "This gold-embossed page must be the sign of Moriarty's infiltration into the Royal Archives in London!",
        alternativeResponsesEn: [
          { phraseEn: "This royal page proves that Moriarty has penetrated the Royal Archives at Buckingham Palace!", translationFa: "این برگه سلطنتی ثابت می‌کند که موریارتی به بایگانی سلطنتی در کاخ باکینگهام نفوذ کرده است!" },
          { phraseEn: "This gold-crested document must indicate a treasonous plot inside the Royal Palace in London.", translationFa: "این سند با نشان طلا باید نشان‌دهنده یک توطئه خائنانه در داخل کاخ سلطنتی در لندن باشد." },
        ],
        whiteHintFa: "از فعل وجهی استنتاج must be و عبارات gold-embossed page و Moriarty's infiltration into the Royal Archives استفاده کن!",
        fallbackChoices: [
          "This gold-embossed page must be the sign of Moriarty's infiltration into the Royal Archives in London!",
          "The cavalry troopers should escort the prisoners back to Exeter.",
          "I believe we have earned a warm breakfast after this damp night.",
        ],
        aefReference: "AEF 4 Unit 3A (Modals of deduction + Formal vocabulary)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار بهت‌زده",
          speakerAvatar: "🩺",
          textEn: "The Royal Archives... Buckingham Palace! Moriarty isn't just stealing military files, Holmes—he is blackmailing the Crown!",
          textFa: "بایگانی سلطنتی... کاخ باکینگهام! موریارتی فقط اسناد نظامی نمی‌دزدد هلمز—او دارد از خود پادشاه باج‌گیری می‌کند!",
        },
      },
    ],
    endings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان پیروزمندانه: مهار شورش دارتمور، نجات دانشمند و کشف سند تاج",
        titleEn: "ENDING 1: CASE SOLVED — The Triumph of the Dartmoor Bastion!",
        badgeTitleFa: "🎖️ پرونده با موفقیت حل شد: شاهکار مشترک هلمز و واتسون در مهار شورش دارتمور",
        imageSrc: "/images/skills/speaking/b2_scene_case_solved.jpg",
        climaxStoryFa: "کالسکه زرهی در لجن‌زار گریمپن مهار می‌شود. دکتر آلیستر ونس بدون کوچک‌ترین آسیبی از چنگال شورشیان نجات می‌یابد و دفترچه اصلی فرمول‌های شیمیایی پوشه شماره ۲ MI6 را تقدیم شرلوک می‌کند. حلقه شورشیان فاسد هاوند توسط سواره‌نظام ارتش به زنجیر کشیده می‌شوند و نظم به زندان دارتمور بازمی‌گردد. اما در جیب استرلینگ، برگی از گنجینه‌ای بسیار خطرناک‌تر کشف می‌شود: برگی زرکوب از «دفترچه تاج [C1]»!",
        climaxStoryEn: "The armored wagon is neutralized safely at the bog's edge. Dr. Alistair Vance is rescued completely unharmed, handing over Folder Number Two of MI6 intact. The rogue Hound wardens are arrested by the cavalry, restoring order to Dartmoor. But in Sterling's coat, a burnt gold-embossed page reveals an even deadlier conspiracy: The Crown Ledger [C1]!",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
با باز کردن استوانه نقره‌ای، برگی نیمه‌سوخته از یک دفترچه کهن با جلد چرم زرشکی و نشان طلاکوب دربار سلطنتی (شیر و تک‌شاخ) بیرون می‌افتد:
این برگی از «دفترچه تاج [C1]» (The Crown Ledger) است؛ دفتری فوق‌محرمانه که نام تمام اشراف‌زادگان و مأموران دوگانه خائن دربار بریتانیا در آن ثبت شده است!
در کنار برگه، نامه‌ای با جوهر سیاه از موریارتی خودنمایی می‌کند:

«شرلوک عزیزم،
تبریک می‌گویم! دانشمندت را نجات دادی و پوشه دوم سلاح‌های شیمیایی را پس گرفتی!
اما آیا واقعاً باور کردی هدف من چند لوله آزمایش در زندان دورافتاده دارتمور بود؟
شورش دارتمور فقط برای آن بود تا تو را ۴۸ ساعت در مه باتلاق سرگرم نگه دارم، در حالی که مأموران وفادارم در قلب لندن به تالار بایگانی سلطنتی در کاخ باکینگهام نفوذ کردند!
من پوشه شماره ۳ را دزدیدم: «دفترچه تاج [C1]».
با این دفترچه، من ارباب تمام نجیب‌زادگان و وزرای خائن امپراتوری هستم.
بازی به تالارهای قدرت کاخ سلطنتی کشیده شد شرلوک... کلاه‌سیلندرت را برای ضیافت کاخ آماده کن!
— موریارتی»

واتسون برگه زرکوب سلطنتی را لمس می‌کند: «هلمز... موریارتی وارد دربار شده است! او می‌تواند دولت را سرنگون کند!»
شرلوک به خورشید سرخ دارتمور خیره می‌شود و با لحنی قاطع می‌گوید:
«به ایستگاه قطار تلگراف بزن جان؛ اولین قطار به مقصد لندن مال ماست. بازی در کاخ باکینگهام تازه آغاز شده است.»`,
        revealDialogueEn: "THE BIG PLOT TWIST: The Dartmoor siege was merely a distraction! Inside Sterling's coat, Holmes recovers a charred gold-crested page from The Crown Ledger [C1], revealing that Moriarty's operatives breached the Royal Archives at Buckingham Palace to steal the treasonous register of corrupt nobility. Holmes and Watson prepare to infiltrate royal high society in London for Level C1.",
        nextTierHintFa: "پرونده سطح B2 با پیروزی کامل شما در دارتمور بسته شد! در سطح C1 (The Crown Ledger)، شرلوک و واتسون با دریافت دعوت‌نامه محرمانه دربار، وارد کاخ باکینگهام و تالارهای دیپلماتیک وستمینستر خواهند شد تا با نفوذ به حلقه اشراف فاسد، سومین پوشه سرقتی MI6 را بازپس گیرند!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان تلخ: مهار شورش با تلفات، جراحت دانشمند و پرواز موریارتی",
        titleEn: "ENDING 2: BITTERSWEET — Riot Quelled, Formulas Scorched in the Bog",
        badgeTitleFa: "⚠️ پرونده نیمه‌تمام: مهار شورش اما سوختن بخشی از فرمول‌های MI6",
        imageSrc: "/images/skills/speaking/b2_scene_case_failed.jpg",
        climaxStoryFa: "شورش دارتمور سرکوب می‌شود اما در جریان شلیک مستقیم، کپسول‌ها آتش گرفته و دکتر ونس دچار جراحت شدید می‌شود. نیمی از فرمول‌های شیمیایی در آتش از بین می‌رود، هرچند برگه زرکوب دفترچه تاج موریارتی روی خاکستر باقی می‌ماند و خبر از توطئه‌ای مهیب در کاخ لندن می‌دهد.",
        climaxStoryEn: "The riot is suppressed, but the chemical canisters ignited during the direct assault, badly injuring Dr. Vance. Half the formulas are burned, though the gold Crown Ledger page survives in the ashes, beckoning Holmes to London.",
        revealDialogueFa: `پلات‌توییست بزرگ و شوکه‌کننده (The Big Plot Twist):
روی خاکستر صخره‌های گریمپن، برگه زرکوب دفترچه تاج (The Crown Ledger [C1]) خودنمایی می‌کند.
پیام تلخ موریارتی در کنار آن باقی مانده است:
«دانشمند را با جراحت گرفتی شرلوک، اما دربار بریتانیا در مشت من است. در کاخ باکینگهام منتظرت هستم...»`,
        revealDialogueEn: "THE BIG PLOT TWIST: Half the chemical formula was scorched, but the Crown Ledger [C1] page was retrieved. Moriarty has entrenched himself in London's royal circle, setting up Level C1.",
        nextTierHintFa: "اگرچه اسناد شیمیایی ناقص بازیابی شد، اما با به دست آمدن برگه زرکوب دربار، پرونده سطح C1 در کاخ باکینگهام در انتظار شماست!",
      },
    },
  },
];
