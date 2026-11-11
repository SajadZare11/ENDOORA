import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR C2 CASE: "CASE FILE #06: THE RED FOLDER & THE REICHENBACH RECKONING"
// Official CEFR C2 Vocabulary & Grammar (Cambridge C2 Proficiency / AEF Advanced Plus):
// - High-Register Rhetorical Inversion: Little did the mastermind anticipate..., Hardly had we scaled...
// - Complex Multi-Layered Cleft Sentences: What sealed Moriarty's ultimate undoing was not merely... but...
// - Advanced Subjunctive & Hypothetical Conditionals: Were Sebastian Moran to command..., Had I not neutralized...
// - Elite Discourse Markers & Participle Clauses: Notwithstanding the treacherous precipice..., Insofar as...
// - Epic Victorian Horological, Alpine Ballistics, Forensic & Philosophical Master Lexicon
// ============================================================================

export const C2_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: Arrival at Meiringen & The Fraudulent Dispatch (ورود به مایرینگن)
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "C2",
    titleFa: "پرونده سرخ: ورود به مایرینگن و تلگراف جعلی زن بیمار",
    titleEn: "The Red Folder: Arrival at Meiringen & The Fraudulent Dispatch",
    locationFa: "مهمان‌خانه دِزینگلاند در دهکده کوهستانی مایرینگن، آلپ سوئیس",
    locationEn: "Englischer Hof Inn, Meiringen, Swiss Alps",
    storyIntroFa: "عصرگاهی مه‌آلود در دامنه‌های یخ‌بسته آلپ سوئیس است. پس از متوقف کردن عقربه‌های ساعت بیگ بن در لندن و بازیابی دفترچه تاج، پاکت ممهور به موم سرخ جیمز موریارتی شما و دکتر واتسون را به دهکده کوهستانی مایرینگن در کانتون برن کشانده است؛ جایی که آخرین و مخوف‌ترین سند ربوده‌شده MI6 یعنی «پرونده سرخ [C2]» پنهان شده است. کالسکه جلوی مهمان‌خانه دِزینگلاند توقف می‌کند. هتل‌دار سالخورده با شتاب نامه‌ای اضطراری به واتسون می‌دهد: «یک بانوی نجیب‌زاده انگلیسی در هتل دچار خونریزی ریوی شده و التماس پزشک انگلیسی دارد!» واتسون قصد رفتن دارد، اما شرلوک به علامت تمبر نگاه می‌کند: جوهر مهر هنوز خیس است و خط پیام متعلق به موریارتی است! ترفندی برای تنها کشاندن هلمز به پرتگاه آبشار.",
    cutscene: {
      titleFa: "افشای تلگراف جعلی موریارتی در مهمان‌خانه مایرینگن",
      titleEn: "The Fraudulent Telegram Exposed at the Meiringen Inn",
      imageSrc: "/images/skills/speaking/c2_scene_1_meiringen_inn.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در لباس سفر آلپ",
          speakerAvatar: "🩺",
          textEn: "Good heavens, Holmes! An Englishwoman dying of a pulmonary hemorrhage at the inn! My medical oath compels me to return at once!",
          textFa: "خدای من هلمز! یک زن انگلیسی در مهمان‌خانه دچار خونریزی ریوی شده است! سوگند پزشکی‌ام مرا ملزم می‌کند فوراً برگردم!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور با پالتوی زمستانی",
          speakerAvatar: "🔍",
          textEn: "Touch the ink, John; it was blotted barely fifteen minutes ago in an unmistakable hand. Moriarty desires me alone on the Reichenbach ledge!",
          textFa: "جوهر را لمس کن جان؛ این خط به سختی پانزده دقیقه پیش با دست‌خطی کاملاً آشنا نوشته شده است. موریارتی مرا روی باریکه صخره‌ای رایشنباخ تنها می‌خواهد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-1-inversion-little-did",
        titleFa: "استنتاج استادی با وارونگی بلاغی پیشرفته (Little did the mastermind anticipate)",
        speakerPromptEn: "Hold up the forged telegram and expose Moriarty's divisive deception using advanced negative inversion...",
        speakerPromptFa: "تلگراف جعلی را بالا می‌گیری و فریب تفرقه‌افکنانه موریارتی را با وارونگی نفی سطح استادی فاش می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی استادی Little did the mastermind anticipate)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «مغز متفکر هرگز پیش‌بینی نمی‌کرد که استنتاج‌های ما فوراً در تلگراف جعلی او که برای جدا کردن ما طراحی شده بود نفوذ کند.»",
        targetKeywords: [
          { phrase: "Little did the mastermind anticipate", hintFa: "(مغز متفکر هرگز پیش‌بینی نمی‌کرد)", synonyms: ["little did the mastermind anticipate", "little did moriarty anticipate", "rarely did the mastermind foresee"], weight: 50 },
          { phrase: "penetrate his fraudulent telegram", hintFa: "(در تلگراف جعلی او نفوذ کند)", synonyms: ["penetrate his fraudulent telegram", "expose his fraudulent telegram", "pierce his fabricated dispatch"], weight: 50 },
        ],
        idealVoiceResponseEn: "Little did the mastermind anticipate that our deductions would instantly penetrate his fraudulent telegram designed to separate us.",
        alternativeResponsesEn: [
          { phraseEn: "Little did Professor Moriarty foresee that our deductions would immediately unmask this fabricated dispatch.", translationFa: "پروفسور موریارتی هرگز پیش‌بینی نمی‌کرد که استنتاج‌های ما بلافاصله این پیام ساختگی را برملا سازد." },
          { phraseEn: "Rarely did the mastermind expect that we would so readily penetrate his forged telegram meant to divide us.", translationFa: "به ندرت مغز متفکر انتظار داشت که ما تا این اندازه سریع در تلگراف جعلی او نفوذ کنیم." },
        ],
        whiteHintFa: "از ساختار وارونگی عالی‌رتبه Little did the mastermind anticipate that our deductions would instantly penetrate his fraudulent telegram... استفاده کن!",
        fallbackChoices: [
          "Little did the mastermind anticipate that our deductions would instantly penetrate his fraudulent telegram designed to separate us.",
          "The jagged peaks of the Wetterhorn are shrouded in thick winter mist.",
          "The landlord has prepared two walking staves reinforced with steel tips.",
        ],
        aefReference: "Cambridge C2 Mastery / AEF Advanced Plus (Rhetorical inversion with Little did someone anticipate/realize)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The devil! He sought to lure me away so he could corner you! I stand by your side to the bitter end, Holmes!",
          textFa: "اهریمن صفت! او می‌خواست مرا دور کند تا تو را در تنگنا قرار دهد! من تا تلخ‌ترین فرجام کنارت می‌مانم هلمز!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: DECISION 1 — Grindelwald Pass & Colonel Moran's Silent Ambush
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "C2",
    titleFa: "تصمیم اول: گردنه سنگی گریندلوالد و کمین تفنگ بادی سرهنگ موران",
    titleEn: "DECISION 1: Grindelwald Pass & Colonel Moran's Silent Ambush",
    locationFa: "گردنه باریک سنگی با قندیل‌های یخ و صخره‌های گریندلوالد",
    locationEn: "Grindelwald Rocky Pass, Bernese Oberland, Swiss Alps",
    storyIntroFa: "شما و واتسون در امتداد گردنه سنگی گریندلوالد پیش می‌روید. مه غلیظی از روی دره‌ها بالا می‌آید و باد زوزه می‌کشد. ناگهان گلوله‌ای سربی و بدون صدا به سنگ خارا در دو سانتی‌متری کلاه هلمز اصابت کرده و پودر گرانیت را در هوا پخش می‌کند! در دهانه غاری در دیواره روبه‌رو، برق لوله استیل تفنگ بادی سنگین سرهنگ سباستین موران (دست راست نظامی موریارتی و تک‌تیرانداز مخوف ارتش هند) دیده می‌شود. موران گردنه را زیر آتش خاموش گرفته است و هر حرکتی به معنای مرگ است.",
    cutscene: {
      titleFa: "شلیک گلوله سربی خاموش سرهنگ موران در شکاف صخره‌ها",
      titleEn: "Colonel Moran's Silent Heavy Air Rifle Strikes the Granite",
      imageSrc: "/images/skills/speaking/c2_scene_2_moran_ambush.jpg",
      dialogues: [
        {
          speakerId: "moran",
          speakerNameFa: "سرهنگ سباستین موران",
          speakerRoleFa: "تک‌تیرانداز ارشد موریارتی",
          speakerAvatar: "🎯",
          textEn: "You take not another step toward the falls, Holmes! The professor's orders are absolute: your journey concludes here!",
          textFa: "یک قدم دیگر به سمت آبشار برنمی‌داری هلمز! دستور پروفسور قطعی است: سفرت همین‌جا به پایان می‌رسد!",
          bubblePosition: "right",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک نظامی در سنگر",
          speakerAvatar: "🩺",
          textEn: "Von Herder's silent air rifle! He has the high ground, Holmes! Do we blind his scope with our flare, or draw weapons and scramble through?!",
          textFa: "تفنگ بادی بی‌صدای فون هِردِر! او موضع بالاتر را در دست دارد هلمز! آیا با منور دید دوربینش را کور کنیم، یا سلاح بکشیم و هجوم ببریم؟! ",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-1",
      promptFa: "کمین تک‌تیرانداز مخوف موریارتی بر فراز گردنه: آیا با انفجار نور کپسول فسفری دید او را کور می‌کنید یا با تبادل آتش رولور پیشروی می‌نمایید؟",
      promptEn: "Perilous Alpine Ambush: Blind Colonel Moran's telescopic sight with a phosphorus flare, or engage in a direct revolver firefight?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Detonate the chemical phosphorus flare to blind Moran's telescopic sight",
          labelFa: "گزینه ۱الف: پرتاب نارنجک فسفری و کور کردن دید تک‌تیرانداز جهت عبور امن از شکاف صخره",
          descriptionFa: "دید تلسکوپی موران موقتاً محو می‌شود؛ هلمز و واتسون در سکوت از شکاف صخره‌ای عبور کرده و بدون جراحت پیشروی می‌کنند.",
          pointsDelta: 150,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Open fire with service revolvers and scramble beneath falling debris",
          labelFa: "گزینه ۱ب: شلیک متقابل با رولور و دویدن زیر رگبار سنگ‌ها با پذیرش ریسک جراحت و بهمن",
          descriptionFa: "پژواک شلیک رولورها باعث ریزش سنگ و بهمن در تنگه می‌شود؛ بازوی واتسون زخمی شده و مسیر صعود بسیار کند و فرساینده می‌گردد.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-2-inversion-hardly-moran",
        titleFa: "توصیف کمین ناگهانی با ساختار وارونگی روایی Hardly had we",
        speakerPromptEn: "Take cover behind the granite outcrop and articulate the ambush with dramatic inversion...",
        speakerPromptFa: "پشت صخره گرانیتی سنگر می‌گیری و کمین ناگهانی را با ساختار وارونگی دراماتیک بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی Hardly had we scaled)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «هنوز به سختی از جان‌پناه یخ‌بسته بالا رفته بودیم که تفنگ بادی بی‌صدای موران آرامش کوهستان را بر فراز سرمان درهم شکست.»",
        targetKeywords: [
          { phrase: "Hardly had we scaled the", hintFa: "(هنوز به سختی بالا رفته بودیم)", synonyms: ["hardly had we scaled the", "scarcely had we scaled the", "barely had we ascended the"], weight: 50 },
          { phrase: "Moran's silent air rifle shattered", hintFa: "(تفنگ بادی بی‌صدای موران درهم شکست)", synonyms: ["moran's silent air rifle shattered", "moran's air rifle shattered", "the silent air rifle shattered"], weight: 50 },
        ],
        idealVoiceResponseEn: "Hardly had we scaled the frozen parapet when Moran's silent air rifle shattered the mountain tranquility above us.",
        alternativeResponsesEn: [
          { phraseEn: "Scarcely had we ascended the icy ledge when Colonel Moran's silent air rifle shattered the stillness above us.", translationFa: "به سختی از لبه یخی بالا رفته بودیم که تفنگ بادی خاموش سرهنگ موران سکون بالای سرمان را درهم شکست." },
          { phraseEn: "Hardly had we climbed past the frozen boulders when Moran's deadly projectile struck the rock beside us.", translationFa: "هنوز به سختی از تخته‌سنگ‌های یخ‌زده رد شده بودیم که پرتابه مرگبار موران به سنگ کنارمان خورد." },
        ],
        whiteHintFa: "از ساختار وارونگی دراماتیک Hardly had we scaled the frozen parapet when Moran's silent air rifle shattered the mountain tranquility... استفاده کن!",
        fallbackChoices: [
          "Hardly had we scaled the frozen parapet when Moran's silent air rifle shattered the mountain tranquility above us.",
          "The air rifle fires custom soft-lead projectiles with devastating concussive power.",
          "Icicles hanging from the ledge measure over six feet in length.",
        ],
        aefReference: "Cambridge C2 Mastery (Inversion with Hardly... when / Scarcely... when)",
        npcResponse: {
          speakerNameFa: "سرهنگ سباستین موران",
          speakerRoleFa: "تک‌تیرانداز در کمین",
          speakerAvatar: "🎯",
          textEn: "My next bullet finds your forehead, Holmes!",
          textFa: "گلوله بعدی‌ام پیشانی‌ات را خواهد شکافت، هلمز!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: Aftermath of Decision 1 — Quiet Ascent or Mountain Avalanche
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "C2",
    titleFa: "پرده سوم: پیامد تصمیم اول — صعود آرام از شکاف صخره یا طوفان بهمن",
    titleEn: "Stage 3: Aftermath of Decision 1 — Quiet Ascent or Mountain Avalanche",
    locationFa: "صخره‌های شیب‌دار منتهی به پل معلق ژرف‌دره",
    locationEn: "Steep Glacial Shelf leading to the Chasm Bridge",
    storyIntroFa: "پیامدهای تصمیم نخست شما در گذرگاه گریندلوالد آشکار می‌شود...",
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "شاخه ۱الف: کپسول فسفری، کور شدن موران و عبور ایمن",
        titleEn: "Branch 1A: Phosphorus Flare & Safe Crevice Traverse",
        locationFa: "شکاف سنگی محافظت‌شده مشرف به دره عمیق",
        locationEn: "Sheltered Crevice Overlooking the Chasm",
        storyIntroFa: "نارنجک فسفری در دهانه غار موران منفجر می‌شود؛ نوری کورکننده چشمان او را می‌سوزاند و تفنگ بادی از دستش رها می‌شود. شما و واتسون با چابکی از شکاف باریک صخره‌ای عبور می‌کنید و به ورودی پل معلق چوبی ژرف‌دره رایشنباخ می‌رسید، در حالی که موران در کولاک ناتوان مانده است.",
        tasks: [
          {
            id: "task-c2-3-subjunctive-moran-command",
            titleFa: "بیان فرضی التزامی استادی (Inverted Subjunctive Were Moran to command)",
            speakerPromptEn: "Survey the steep chasm path and articulate the averted danger using inverted subjunctive...",
            speakerPromptFa: "مسیر پرشیب دره را برانداز می‌کنی و خطر خنثی‌شده را با وجه التزامی معکوس بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (وجه التزامی Were Sebastian Moran to command)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر بنا بود سباستین موران بدون رقیب بر این گردنه تسلط یابد، هیچ روح زنده‌ای هرگز نمی‌توانست از این پرتگاه یخ‌بسته زنده عبور کند.»",
            targetKeywords: [
              { phrase: "Were Sebastian Moran to command", hintFa: "(اگر بنا بود موران تسلط یابد)", synonyms: ["were sebastian moran to command", "were moran to command", "should sebastian moran command"], weight: 50 },
              { phrase: "traverse this icy precipice alive", hintFa: "(از این پرتگاه یخ‌بسته زنده عبور کند)", synonyms: ["traverse this icy precipice alive", "cross this icy precipice alive", "pass this frozen precipice alive"], weight: 50 },
            ],
            idealVoiceResponseEn: "Were Sebastian Moran to command this gorge unchallenged, no living soul could ever traverse this icy precipice alive.",
            alternativeResponsesEn: [
              { phraseEn: "Were Colonel Moran to control this ravine unchecked, no one could traverse this icy precipice alive.", translationFa: "اگر سرهنگ موران مهارنشدنی بر این دره تسلط می‌داشت، هیچ‌کس نمی‌توانست زنده از این پرتگاه یخی عبور کند." },
              { phraseEn: "Should Moran hold absolute mastery over this pass, no living being could traverse this freezing precipice.", translationFa: "اگر موران تسلط کامل بر این گردنه می‌داشت، هیچ موجود زنده‌ای نمی‌توانست از این پرتگاه منجمد بگذرد." },
            ],
            whiteHintFa: "از ساختار شرطی التزامی معکوس Were Sebastian Moran to command this gorge unchallenged, no living soul could ever traverse this icy precipice alive استفاده کن!",
            fallbackChoices: [
              "Were Sebastian Moran to command this gorge unchallenged, no living soul could ever traverse this icy precipice alive.",
              "The gorge plunges eight hundred cubits into frozen mist.",
              "The wooden suspension bridge ahead sways precariously against the gale.",
            ],
            aefReference: "Cambridge C2 Mastery (High-Register Inverted Subjunctive: Were X to do Y)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look ahead at the bridge, Holmes! There are wires attached beneath the center planks!",
              textFa: "جلوتر به پل نگاه کن هلمز! سیم‌هایی زیر تخته‌های میانی متصل شده است!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "شاخه ۱ب: ریزش بهمن سنگی و صعود فرساینده در کولاک",
        titleEn: "Branch 1B: Rockslide Chaos & Exhausting Ice Ascent",
        locationFa: "توده سنگ‌های فروریخته و برف یخ‌زده در گذرگاه",
        locationEn: "Avalanche Rubble, Upper Grindelwald Trail",
        storyIntroFa: "انعکاس تیراندازی رولورها باعث شکستن قندیل‌های یخ و ریزش سنگین سنگ و برف شد. موران عقب نشست اما گردنه کاملاً مسدود گشت. شرلوک و واتسون با کت‌های پاره و شانه خونین واتسون مجبور شدند با تبر یخ از دیواره پرشیب صعود کنند. زمان ارزشمندی تلف شده و سرما توان جسمانی هر دو را به شدت فرسوده است.",
        tasks: [
          {
            id: "task-c2-3-mixed-conditional-flare",
            titleFa: "تحلیل اشتباه تاکتیکی با شرطی ترکیبی سطح C2",
            speakerPromptEn: "Catch your breath on the glacial ridge and state the tactical reality...",
            speakerPromptFa: "روی یال یخچالی نفس تازه می‌کنی و واقعیت تاکتیکی را با شرطی ترکیبی بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی Had we deployed the flare)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر نارنجک شیمیایی را علیه موران به کار گرفته بودیم، اکنون گروه ما روی این دیواره یخ‌بسته گرفتار نشده بود.»",
            targetKeywords: [
              { phrase: "Had we deployed the chemical", hintFa: "(اگر به کار گرفته بودیم)", synonyms: ["had we deployed the chemical", "if we had deployed the chemical", "had we utilized the chemical"], weight: 50 },
              { phrase: "would not now be stranded upon", hintFa: "(اکنون گرفتار نشده بود)", synonyms: ["would not now be stranded upon", "would not be stranded on", "would not currently be trapped upon"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we deployed the chemical flare against Moran, our party would not now be stranded upon this frozen wall.",
            alternativeResponsesEn: [
              { phraseEn: "If we had blinded the sniper with phosphorus, we would not now be trapped on this sheer ice cliff.", translationFa: "اگر تک‌تیرانداز را با فسفر کور کرده بودیم، اکنون روی این صخره یخی لغزنده به دام نمی‌افتادیم." },
              { phraseEn: "Had we employed the flare, we would not now be struggling across this freezing parapet.", translationFa: "اگر منور را به کار بسته بودیم، اکنون در حال دست‌وپنجه نرم کردن با این دیواره منجمد نبودیم." },
            ],
            whiteHintFa: "از ساختار شرطی ترکیبی Had we deployed the chemical flare against Moran, our party would not now be stranded upon this frozen wall استفاده کن!",
            fallbackChoices: [
              "Had we deployed the chemical flare against Moran, our party would not now be stranded upon this frozen wall.",
              "My hands are trembling from the penetrating alpine frost.",
              "The wooden bridge is visible two hundred yards through the blizzard.",
            ],
            aefReference: "Cambridge C2 Mastery (Mixed Conditionals: past hypothetical condition with present progressive/state outcome)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "We made it to the bridgehead, Holmes! But look at the wooden span—it is rigged to blow!",
              textFa: "ما به ابتدای پل رسیدیم هلمز! اما به عرشه چوبی نگاه کن—بمب‌گذاری شده تا منفجر شود!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-3-default-fallback",
        titleFa: "تحلیل صعود در امتداد ژرف‌دره رایشنباخ",
        speakerPromptEn: "Survey the path to the suspension bridge...",
        speakerPromptFa: "مسیر منتهی به پل معلق را ارزیابی می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وجه التزامی پیشرفته Were Sebastian Moran)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر بنا بود سباستین موران بدون رقیب بر این گردنه تسلط یابد، هیچ روح زنده‌ای هرگز نمی‌توانست از این پرتگاه یخ‌بسته زنده عبور کند.»",
        targetKeywords: [
          { phrase: "Were Sebastian Moran to command", hintFa: "(اگر موران تسلط می‌یافت)", synonyms: ["were sebastian moran to command", "were moran to command"], weight: 50 },
          { phrase: "traverse this icy precipice alive", hintFa: "(زنده عبور کند)", synonyms: ["traverse this icy precipice alive", "cross this precipice alive"], weight: 50 },
        ],
        idealVoiceResponseEn: "Were Sebastian Moran to command this gorge unchallenged, no living soul could ever traverse this icy precipice alive.",
        alternativeResponsesEn: [
          { phraseEn: "Were Moran to control this gorge, no soul could cross alive.", translationFa: "اگر موران بر این گردنه مسلط بود، هیچ روحی زنده رد نمی‌شد." },
        ],
        whiteHintFa: "از ساختار Were Sebastian Moran to command... استفاده کن!",
        fallbackChoices: [
          "Were Sebastian Moran to command this gorge unchallenged, no living soul could ever traverse this icy precipice alive.",
          "The roaring torrent shakes the granite foundations below.",
        ],
        aefReference: "Cambridge C2 Mastery",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The bridge is ahead!",
          textFa: "پل جلوتر است!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: The Swaying Cable Suspension Bridge & The Clockwork Detonator
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "C2",
    titleFa: "پرده چهارم: پل معلق چوبی بر فراز ژرف‌دره و چاشنی دینامیت",
    titleEn: "Stage 4: The Swaying Cable Suspension Bridge & The Clockwork Detonator",
    locationFa: "پل کابلی طنابی و چوبی معلق در ارتفاع ۱۵۰ متری بر فراز ژرف‌دره سیاه",
    locationEn: "The Swaying Cable Suspension Bridge, Reichenbach Gorge",
    storyIntroFa: "شما و واتسون به پل معلق چوبی باستانی بر فراز دره مهیب رایشنباخ می‌رسید؛ تنها پلی که مسیر مایرینگن را به صخره‌های آبشار متصل می‌کند. پل در ارتفاع ۱۵۰ متری بر فراز صخره‌های سیاه تیز آویزان است و در اثر بادهای سهمگین کوهستان به شدت تکان می‌خورد. در میانه پل، زیر تخته‌های باریک چوبی، دو بسته دینامیت فشرده با یک زمان‌سنج مکانیکی برنجی سیم‌کشی شده است! عقربه ساعت با صدای تیک‌تاک مرگبار به ۲ دقیقه پایانی نزدیک می‌شود. در آن سوی دره، سایه موریارتی دیده می‌شود که به سمت غار یخی پشت دیواره آبشار می‌رود.",
    cutscene: {
      titleFa: "دینامیت سیم‌کشی‌شده در میانه پل معلق لرزان",
      titleEn: "The Rigged Clockwork Dynamite Beneath the Swaying Bridge",
      imageSrc: "/images/skills/speaking/c2_scene_4_chasm_bridge.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با چاقوی جراحی",
          speakerAvatar: "🩺",
          textEn: "Look below the center planks, Holmes! Two sticks of mining dynamite connected to a clockwork escapement! Two minutes until detonation!",
          textFa: "زیر تخته‌های میانی را ببین هلمز! دو قالب دینامیت معدنی متصل به چرخ‌دنگ ساعت‌شمار! دو دقیقه تا انفجار!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "He seeks to sever our singular artery of pursuit and trap us on the abyss's threshold. Keep your balance on these swaying cables!",
          textFa: "او می‌خواهد شاهرگ یگانه تعقیب ما را قطع کند و ما را در آستانه مغاک به دام اندازد. تعادلت را روی این کابل‌های لرزان حفظ کن!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-4-cleft-suspension-bridge",
        titleFa: "استنتاج فلسفی و تاکتیکی با جمله شکافته پیچیده C2",
        speakerPromptEn: "Step onto the shuddering wooden slats and articulate the strategic significance of this chasm crossing...",
        speakerPromptFa: "پا بر تخته‌های چوبی لرزان می‌گذاری و اهمیت استراتژیک این گذرگاه دره را با جمله شکافته بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته It is precisely this fragile suspension bridge)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «دقیقاً همین پل معلق شکننده است که تنها شاهرگ میان عدالت متمدنانه و مغاک وحشیانه را تشکیل می‌دهد.»",
        targetKeywords: [
          { phrase: "It is precisely this fragile suspension", hintFa: "(دقیقاً همین پل معلق شکننده است)", synonyms: ["it is precisely this fragile suspension", "it is exactly this fragile suspension", "it is truly this fragile suspension"], weight: 50 },
          { phrase: "between civilized justice and barbarous", hintFa: "(میان عدالت متمدنانه و مغاک وحشیانه)", synonyms: ["between civilized justice and barbarous", "between civil justice and barbarous abyss", "between justice and the barbarous abyss"], weight: 50 },
        ],
        idealVoiceResponseEn: "It is precisely this fragile suspension bridge that constitutes the solitary artery between civilized justice and barbarous abyss.",
        alternativeResponsesEn: [
          { phraseEn: "It is precisely this precarious bridge that serves as the solitary artery between civilization and the barbarous abyss.", translationFa: "دقیقاً همین پل متزلزل است که به عنوان شاهرگ یگانه میان تمدن و مغاک وحشیانه عمل می‌کند." },
          { phraseEn: "It is truly this fragile suspension bridge that forms the sole connection between imperial law and the abyss.", translationFa: "به راستی همین پل معلق شکننده است که تنها پیوند میان قانون و ورطه را شکل می‌دهد." },
        ],
        whiteHintFa: "از ساختار شکافته استادی It is precisely this fragile suspension bridge that constitutes the solitary artery between civilized justice and barbarous abyss استفاده کن!",
        fallbackChoices: [
          "It is precisely this fragile suspension bridge that constitutes the solitary artery between civilized justice and barbarous abyss.",
          "The black gorge below is perpetually misted by the spray of the falls.",
          "The steel wires connecting the detonator are coated with paraffin wax.",
        ],
        aefReference: "Cambridge C2 Mastery (Emphatic Cleft Sentences with It is precisely X that constitutes Y)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The timer is racing toward zero! We must act this very second!",
          textFa: "زمان‌سنج دارد به صفر نزدیک می‌شود! همین ثانیه باید دست به کار شویم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 5: DECISION 2 — The Severed Cables & The Sabotaged Chasm Bridge
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "C2",
    titleFa: "تصمیم دوم: بحران تخریب پل معلق در میان کولاک",
    titleEn: "DECISION 2: The Severed Cables & The Sabotaged Chasm Bridge",
    locationFa: "میانه لرزان پل معلق چوبی در کولاک آلپ",
    locationEn: "Mid-Span, Swaying Chasm Bridge, Swiss Alps",
    storyIntroFa: "عقربه چاشنی به ثانیه ۹۰ رسیده است. باد کولاک طناب‌های پل را تا مرز پاره شدن می‌کشد. هم‌زمان، یکی از افراد موریارتی در آن سوی پرتگاه، مشعل باروتی را روی کابل‌های مهار پل انداخته تا طناب‌های صخره روبه‌رو بسوزد و پل سقوط کند. دو انتخاب پیش روی شماست: آیا روی تخته‌های معلق دراز کشیده و چاشنی دینامیت را خنثی می‌کنید تا پل حفظ شود، یا طناب‌ها را قطع کرده و با یک پرش دیوانه‌وار به لبه مقابل شیرجه می‌زنید؟",
    cutscene: {
      titleFa: "خنثی‌سازی سیم‌های دینامیت در باد سهمگین ژرف‌دره",
      titleEn: "Severing the Clockwork Detonator Wires in the Chasm Tempest",
      imageSrc: "/images/skills/speaking/c2_scene_5_bridge_defusal.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با تیغ جراحی",
          speakerAvatar: "🩺",
          textEn: "I have my surgical scalpel, Holmes! I can sever the trigger wire, but one slip on these icy boards sends us plunging into eternity!",
          textFa: "من تیغ جراحی‌ام را در دست دارم هلمز! می‌توانم سیم چاشنی را قطع کنم، اما یک لغزش روی این تخته‌های یخی ما را به درون ابدیت پرتاب می‌کند!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "If this bridge collapses, our lifeline to the world is severed forever. We must secure this passage!",
          textFa: "اگر این پل فرو ریزد، شاهرگ ارتباط ما با جهان تا ابد قطع می‌شود. ما باید این گذرگاه را ایمن کنیم!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-2",
      promptFa: "تخریب تنها شاهرگ نجات در برابر مهار دینامیت: آیا سیم‌های چاشنی ساعت‌شمار را قطع می‌کنید یا طناب‌ها را بریده و به لبه مقابل می‌پرید؟",
      promptEn: "Catastrophic Engineering Dilemma: Defuse the clockwork dynamite beneath the bridge planks, or sever the cables and leap into the unknown?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Defuse the clockwork dynamite mechanism beneath the planks using Watson's scalpel",
          labelFa: "گزینه ۲الف: خنثی‌سازی چاشنی و مهار دینامیت با تیغ جراحی واتسون جهت حفظ پل و مسیر بازگشت",
          descriptionFa: "سیم چاشنی ساعت قطع می‌شود و دینامیت در برف خنثی می‌گردد؛ پل سالم می‌ماند و تیم امداد کوهستان می‌توانند به یاری شما بیایند.",
          pointsDelta: 150,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Sever the suspension cables and leap across to the opposing ledge before detonation",
          labelFa: "گزینه ۲ب: بریدن طناب‌های مهار و پرش پرمخاطره به لبه مقابل با پذیرش نابودی پل و قطع خطوط امداد",
          descriptionFa: "پل با غرش وحشتناکی به قعر دره سقوط می‌کند؛ هلمز و واتسون به لبه سنگی پرت می‌شوند اما در محاصره برف و انزوای مطلق گرفتار می‌آیند.",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-5-inversion-under-no-circumstances",
        titleFa: "فرمان قاطع استادی با ساختار وارونگی نفی بازدارنده (Under no circumstances)",
        speakerPromptEn: "Steady Watson's arm upon the shuddering cables and state the imperative necessity with absolute authority...",
        speakerPromptFa: "دست واتسون را روی کابل‌های لرزان ثابت نگه می‌داری و ضرورت حیاتی را با اقتدار وارونگی بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی Under no circumstances should we allow)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «تحت هیچ شرایطی نباید اجازه دهیم این تنها شاهرگ کوهستان پیش از اتمام وظیفه‌مان قطع شود.»",
        targetKeywords: [
          { phrase: "Under no circumstances should we allow", hintFa: "(تحت هیچ شرایطی نباید اجازه دهیم)", synonyms: ["under no circumstances should we allow", "under no circumstances must we allow", "on no account should we permit"], weight: 50 },
          { phrase: "mountain lifeline to be severed", hintFa: "(شاهرگ کوهستان قطع شود)", synonyms: ["mountain lifeline to be severed", "sole lifeline to be severed", "mountain passage to be destroyed"], weight: 50 },
        ],
        idealVoiceResponseEn: "Under no circumstances should we allow this sole mountain lifeline to be severed before our task is accomplished.",
        alternativeResponsesEn: [
          { phraseEn: "Under no circumstances must we permit this vital lifeline to be severed before our mission is completed.", translationFa: "تحت هیچ شرایطی نباید اجازه دهیم این شاهرگ حیاتی پیش از تکمیل مأموریت‌مان قطع گردد." },
          { phraseEn: "On no account should we allow this solitary mountain passage to be destroyed prior to our task's completion.", translationFa: "به هیچ وجه نباید اجازه دهیم این گذرگاه کوهستانی پیش از پایان وظیفه‌مان تخریب شود." },
        ],
        whiteHintFa: "از ساختار وارونگی عالی‌رتبه Under no circumstances should we allow this sole mountain lifeline to be severed before our task is accomplished استفاده کن!",
        fallbackChoices: [
          "Under no circumstances should we allow this sole mountain lifeline to be severed before our task is accomplished.",
          "The copper wire connected to the mercury switch is severed cleanly.",
          "The smell of unburned sulfur powder drifts across the chasm.",
        ],
        aefReference: "Cambridge C2 Mastery (High-Register Inversion with Under no circumstances / On no account)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The circuit is dead, Holmes! The clockwork mechanism has frozen! The bridge stands firm!",
          textFa: "مدار قطع شد هلمز! سازوکار ساعت‌شمار متوقف شد! پل استوار ماند!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 6: Aftermath of Decision 2 — Mountain Lifeline Secured or Total Isolation
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "C2",
    titleFa: "پرده ششم: پیامد تصمیم دوم — حفظ شاهرگ نجات یا انزوای مطلق در پرتگاه",
    titleEn: "Stage 6: Aftermath of Decision 2 — Mountain Lifeline Secured or Total Isolation",
    locationFa: "صخره‌های باریک آن سوی دره، غرش نزدیک آبشار رایشنباخ",
    locationEn: "The Far Gorge Rocks, Approaching the Thunder of Reichenbach",
    storyIntroFa: "پیامدهای تصمیم شما بر فراز ژرف‌دره خود را نشان می‌دهد...",
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "شاخه ۲الف: پل پابرجا و پیشروی مطمئن با پشتیبانی امداد",
        titleEn: "Branch 2A: Bridge Intact & Reinforced Pursuit",
        locationFa: "مسیر سنگی هموارشده به سوی غار یخی",
        locationEn: "Granite Path to the Ice Cavern Portal",
        storyIntroFa: "پل سالم مانده است. راهنمایان ورزیده کوهستان مایرینگن که متوجه صدای درگیری شده بودند، با طناب‌های حمایتی از روی پل گذشته و پشت سر شما را امن می‌کنند. واتسون با خیالی آسوده همراه هلمز گام برمی‌دارد و مسیر رسیدن به غار یخی پشت دیواره خروشان آبشار باز می‌گردد.",
        tasks: [
          {
            id: "task-c2-6-participle-bridge-secured",
            titleFa: "توصیف تثبیت پیروزمندانه گذرگاه با وجه وصفی کامل C2",
            speakerPromptEn: "Step onto the solid granite of the opposing shelf and articulate your strategic preservation...",
            speakerPromptFa: "پا بر سنگ خارای محکم آن سوی پرتگاه می‌گذاری و حفظ راهبردی گذرگاه را با وجه وصفی بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (وجه وصفی Having secured the swaying chasm bridge)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «پس از ایمن ساختن پل معلق ژرف‌دره در برابر نابودی، تنها راه بازگشت گروه خود را حفظ نمودیم.»",
            targetKeywords: [
              { phrase: "Having secured the swaying chasm bridge", hintFa: "(پس از ایمن ساختن پل معلق)", synonyms: ["having secured the swaying chasm bridge", "having preserved the swaying chasm bridge", "after securing the suspension bridge"], weight: 50 },
              { phrase: "singular avenue of retreat", hintFa: "(تنها راه بازگشت)", synonyms: ["singular avenue of retreat", "sole avenue of retreat", "vital avenue of retreat"], weight: 50 },
            ],
            idealVoiceResponseEn: "Having secured the swaying chasm bridge against destruction, we preserved the singular avenue of retreat for our expedition.",
            alternativeResponsesEn: [
              { phraseEn: "Having protected this suspension bridge from demolition, we ensured the sole avenue of retreat for our party.", translationFa: "پس از محافظت از این پل معلق در برابر تخریب، تنها راه عقب‌نشینی را برای گروه‌مان تضمین کردیم." },
              { phraseEn: "Having stabilized the perilous bridge against collapse, we kept open our singular route of return.", translationFa: "پس از پایدار ساختن پل پرخطر در برابر سقوط، تنها مسیر بازگشت خود را باز نگه داشتیم." },
            ],
            whiteHintFa: "از ساختار وجه وصفی کامل Having secured the swaying chasm bridge against destruction, we preserved the singular avenue of retreat... استفاده کن!",
            fallbackChoices: [
              "Having secured the swaying chasm bridge against destruction, we preserved the singular avenue of retreat for our expedition.",
              "The granite walls of the gorge amplify the crescendo of the waterfall.",
              "A narrow cavern mouth glimmers with bluish glacial reflections ahead.",
            ],
            aefReference: "Cambridge C2 Mastery (Perfect Participle Clauses: Having done X, we achieved Y)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The mist from the Reichenbach Falls is soaking our coats! Look—an ice cavern behind the veil of water!",
              textFa: "مه آبشار رایشنباخ پالتوهایمان را خیس کرده است! نگاه کن—یک غار یخی پشت پرده آب!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "شاخه ۲ب: سقوط پل و انزوای مطلق در پرتگاه‌های مهیب",
        titleEn: "Branch 2B: Severed Chasm & Perilous Alpine Isolation",
        locationFa: "صخره‌های دورافتاده یخچالی بدون هیچ راه بازگشت",
        locationEn: "Isolated Glacial Ridge, No Retreat",
        storyIntroFa: "پل چوبی با تکه‌تکه شدن به درون تاریکی دره غلتید. پل سقوط کرد و شما روی صخره روبه‌رو پرت شدید. هیچ راهی برای بازگشت به دنیای زندگان وجود ندارد؛ هر دو در محاصره سنگ و مه و سرمای استخوان‌سوز قرار دارید. تنها راه پیش روی شما ورود به قلمرو موریارتی است.",
        tasks: [
          {
            id: "task-c2-6-mixed-conditional-bridge",
            titleFa: "تحلیل انزوای استراتژیک با شرطی نوع سوم گذشته C2",
            speakerPromptEn: "Look back across the yawning void and evaluate the consequence of the severed passage...",
            speakerPromptFa: "به ژرفای دره خالی نگاه می‌کنی و پیامد گذرگاه قطع‌شده را با شرطی گذشته ارزیابی می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (شرطی معکوس Had we defused the explosive clockwork)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «اگر بمب ساعت‌شمار را به موقع خنثی کرده بودیم، راه بازگشت ما در امتداد ژرف‌دره کاملاً دست‌نخورده باقی می‌ماند.»",
            targetKeywords: [
              { phrase: "Had we defused the explosive clockwork", hintFa: "(اگر خنثی کرده بودیم)", synonyms: ["had we defused the explosive clockwork", "if we had defused the explosive clockwork", "had we neutralized the clockwork"], weight: 50 },
              { phrase: "would remain entirely uncompromised", hintFa: "(کاملاً دست‌نخورده باقی می‌ماند)", synonyms: ["would remain entirely uncompromised", "would have remained uncompromised", "would be completely intact"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we defused the explosive clockwork in time, our retreat across the abyss would remain entirely uncompromised.",
            alternativeResponsesEn: [
              { phraseEn: "If we had disarmed the clockwork bomb in time, our retreat across the gorge would remain entirely secure.", translationFa: "اگر بمب ساعت‌شمار را به موقع خنثی می‌کردیم، عقب‌نشینی ما در امتداد دره کاملاً ایمن باقی می‌ماند." },
              { phraseEn: "Had we preserved that bridge, our route back to civilization would remain open.", translationFa: "اگر آن پل را حفظ کرده بودیم، مسیر بازگشت ما به تمدن باز باقی می‌ماند." },
            ],
            whiteHintFa: "از ساختار شرطی معکوس Had we defused the explosive clockwork in time, our retreat across the abyss would remain entirely uncompromised استفاده کن!",
            fallbackChoices: [
              "Had we defused the explosive clockwork in time, our retreat across the abyss would remain entirely uncompromised.",
              "The void behind us drops sheer into white foam.",
              "We have burned our bridges behind us in the most literal sense.",
            ],
            aefReference: "Cambridge C2 Mastery (Inverted Conditionals with Present State Outcome)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "There is no turning back now, Holmes. Forward into the ice cavern!",
              textFa: "اکنون دیگر راه بازگشتی نیست، هلمز. به پیش به سوی غار یخی!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-6-default-fallback",
        titleFa: "تحلیل ورود به محوطه آبشار رایشنباخ",
        speakerPromptEn: "Advance toward the roaring water curtain...",
        speakerPromptFa: "به سمت پرده خروشان آب پیش می‌روی...",
        speakerRoleFa: "شرلوک هلمز (وجه وصفی پیشرفته Having secured)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «پس از ایمن ساختن پل معلق ژرف‌دره در برابر نابودی، تنها راه بازگشت گروه خود را حفظ نمودیم.»",
        targetKeywords: [
          { phrase: "Having secured the swaying chasm bridge", hintFa: "(پس از ایمن ساختن پل)", synonyms: ["having secured the swaying chasm bridge", "after securing the bridge"], weight: 50 },
          { phrase: "singular avenue of retreat", hintFa: "(تنها راه بازگشت)", synonyms: ["singular avenue of retreat", "sole avenue of retreat"], weight: 50 },
        ],
        idealVoiceResponseEn: "Having secured the swaying chasm bridge against destruction, we preserved the singular avenue of retreat for our expedition.",
        alternativeResponsesEn: [
          { phraseEn: "Having preserved the bridge, we secured our avenue of retreat.", translationFa: "با حفظ پل، راه بازگشت‌مان را ایمن کردیم." },
        ],
        whiteHintFa: "از ساختار Having secured the swaying chasm bridge... استفاده کن!",
        fallbackChoices: [
          "Having secured the swaying chasm bridge against destruction, we preserved the singular avenue of retreat for our expedition.",
          "The waterfall deafens all speech with its thunder.",
        ],
        aefReference: "Cambridge C2 Mastery",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Enter the ice cavern!",
          textFa: "وارد غار یخی شو!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3 — The Ice Cavern Behind the Falls & The Red Folder Vault
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "C2",
    titleFa: "تصمیم سوم: غار یخی پشت دیواره آبشار و گاوصندوق پرونده سرخ",
    titleEn: "DECISION 3: The Ice Cavern Behind the Falls & The Red Folder Vault",
    locationFa: "غار بلورین یخی در اعماق دیواره سنگ خارا پشت آبشار خروشان رایشنباخ",
    locationEn: "The Ice Cavern Behind Reichenbach Falls, Swiss Alps",
    storyIntroFa: "شما وارد غار بلورین یخی در پشت دیواره پرده آبشار رایشنباخ می‌شوید. غرش مهیب آب گوش‌ها را کر می‌کند و قندیل‌های یخی غول‌پیکر مانند خنجرهای شیشه‌ای از سقف آویزان‌اند. بر روی یک میز سنگی صیقلی، صندوقچه فولادی مسافرتی باز است: درون آن، **«پرونده سرخ [C2]»** (The Red Folder) با جلد چرم زرشکی تیره و نشان مومی دوگانه موریارتی قرار دارد! اما زیر صندوقچه، لوله‌ای شیشه‌ای پر از نیتروگلیسیرین حرارتی با فتیله گوگردی سوزان قرار دارد؛ موریارتی غار را تله‌گذاری کرده تا در صورت ورود شما، انفجار حرارتی غار را فرو ریزد و پرونده سرخ به همراه تمام کدهای زرادخانه‌های اروپا خاکستر شود!",
    cutscene: {
      titleFa: "پرونده سرخ روی میز سنگی و فتیله شعله‌ور نیتروگلیسیرین",
      titleEn: "The Red Folder on the Granite Slab & The Burning Nitroglycerin Fuse",
      imageSrc: "/images/skills/speaking/c2_scene_7_ice_cavern_vault.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه در غار یخی",
          speakerAvatar: "🩺",
          textEn: "Holmes, there it is! The crimson leather dossier containing Moriarty's master syndicate! But that sulfur fuse is burning down to the nitroglycerin!",
          textFa: "هلمز، آنجاست! پرونده چرم زرشکی حاوی سندیکای کلان موریارتی! اما آن فتیله گوگردی دارد به نیتروگلیسیرین می‌رسد!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور با کیسه پودر نیترات",
          speakerAvatar: "🔍",
          textEn: "Water will merely accelerate the chemical combustion! We have one second to freeze the reaction, or grab the burning leather and flee!",
          textFa: "آب فقط احتراق شیمیایی را تسریع می‌کند! ما یک ثانیه فرصت داریم تا واکنش را منجمد کنیم، یا چرم شعله‌ور را چنگ بزنیم و بگریزیم!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-3",
      promptFa: "انجماد فتیله بمب یا قاپیدن عجولانه اسناد: چگونه پرونده سرخ را از تله حرارتی نیتروگلیسیرین موریارتی نجات می‌دهید؟",
      promptEn: "Explosive Forensic Crisis: Freeze the burning sulfur fuse with nitrate cooling powder, or snatch the folder and dive clear?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Freeze the sulfur fuse using endothermic nitrate cooling powder to save the entire ledger",
          labelFa: "گزینه ۳الف: انجماد فوری فتیله با پودر نیترات سردکننده جهت نجات کامل و دست‌نخورده پرونده سرخ و کدهای زرادخانه‌ها",
          descriptionFa: "واکنش حرارتی فوراً متوقف می‌شود؛ پرونده سرخ به همراه ۱۰۰ صفحه اسناد محرمانه و کدهای فعال‌سازی کاملاً سالم نجات می‌یابد.",
          pointsDelta: 150,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Snatch the scorching folder and leap outward as the cavern collapses in flames",
          labelFa: "گزینه ۳ب: قاپیدن شتاب‌زده پرونده و فرار به بیرون غار با پذیرش سوختن پیوست کدهای زرادخانه‌ها",
          descriptionFa: "انفجار رخ می‌دهد و غار یخی فرو می‌ریزد؛ هلمز نجات می‌یابد اما صفحات پیوست زرادخانه‌ها در آتش می‌سوزد و پرونده ناقص می‌ماند.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-7-mixed-conditional-instantaneously",
        titleFa: "استنتاج راهبردی مهار انفجار با شرطی ترکیبی سطح C2",
        speakerPromptEn: "Scatter the cooling nitrate crystals over the burning wick and deliver your profound deduction...",
        speakerPromptFa: "بلورهای خنک‌کننده نیترات را روی فتیله سوزان می‌پاشی و استنتاج ژرف خود را بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی Had I not neutralized)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «اگر من چاشنی حرارتی را بی‌درنگ خنثی نکرده بودم، اکنون سندیکای موریارتی شروط خود را به هر دولت مستقلی دیکته می‌کرد.»",
        targetKeywords: [
          { phrase: "Had I not neutralized the thermal", hintFa: "(اگر بی‌درنگ خنثی نکرده بودم)", synonyms: ["had i not neutralized the thermal", "if i had not neutralized the thermal", "had we not extinguished the thermal"], weight: 50 },
          { phrase: "dictate terms to every sovereign government", hintFa: "(شروط خود را به هر دولتی دیکته می‌کرد)", synonyms: ["dictate terms to every sovereign government", "dictate terms to every government", "impose terms on every sovereign nation"], weight: 50 },
        ],
        idealVoiceResponseEn: "Had I not neutralized the thermal detonator instantaneously, Moriarty's syndicate would currently dictate terms to every sovereign government.",
        alternativeResponsesEn: [
          { phraseEn: "Had we not suppressed this thermal fuse instantaneously, Moriarty's syndicate would now control every sovereign government.", translationFa: "اگر ما این فتیله حرارتی را در دم خفه نکرده بودیم، سندیکای موریارتی اکنون کنترل تمام دولت‌های مستقل را در دست داشت." },
          { phraseEn: "If I had failed to neutralize this chemical detonator, the syndicate would currently dictate terms across Europe.", translationFa: "اگر در خنثی‌سازی این چاشنی شیمیایی ناکام می‌ماندم، این سندیکا هم‌اکنون شروط خود را بر سراسر اروپا تحمیل می‌کرد." },
        ],
        whiteHintFa: "از ساختار شرطی ترکیبی پیشرفته Had I not neutralized the thermal detonator instantaneously, Moriarty's syndicate would currently dictate terms to every sovereign government استفاده کن!",
        fallbackChoices: [
          "Had I not neutralized the thermal detonator instantaneously, Moriarty's syndicate would currently dictate terms to every sovereign government.",
          "The crystalline formations within this cavern refract the roaring spray.",
          "The crimson leather of Folder Number Four bears the wax cipher MM.",
        ],
        aefReference: "Cambridge C2 Mastery (Advanced Mixed Conditionals: Inverted past condition with present imperative consequence)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The Red Folder is in our hands, Holmes! But look at the outer opening—a path leads to the sheer rock ledge over the abyss!",
          textFa: "پرونده سرخ در دستان ماست هلمز! اما به خروجی بیرونی نگاه کن—مسیری به باریکه صخره‌ای بر فراز مغاک می‌رود!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 8: Ascent to the Sheer Precipice & Moriarty's Final Summons
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "C2",
    titleFa: "پرده هشتم: صعود به باریکه صخره‌ای و دست‌نوشته موریارتی روی تخته‌سنگ",
    titleEn: "Stage 8: Ascent to the Sheer Precipice & Moriarty's Final Summons",
    locationFa: "باریکه صخره‌ای مرطوب و لغزنده بر فراز آبشار عظیم رایشنباخ",
    locationEn: "The Sheer Ledge of the Reichenbach Falls, Roaring Waters",
    storyIntroFa: "پیامدهای عملیات غار یخی خود را در صعود نهایی نشان می‌دهد...",
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "شاخه ۳الف: پرونده سرخ کاملاً سالم و وقار کارآگاه بر لبه پرتگاه",
        titleEn: "Branch 3A: Pristine Red Dossier & Resolute Ledge Ascent",
        locationFa: "باریکه صخره‌ای مشرف به سقوط مهیب آبشار",
        locationEn: "Narrow Granite Ledge, Roaring Reichenbach Mists",
        storyIntroFa: "پرونده سرخ با تمام ۱۰۰ صفحه اسناد محرمانه، نقشه‌های ترور و فرمول‌های زرادخانه‌ها کاملاً دست‌نخورده در کیف چرمی شرلوک قرار دارد. هلمز با گام‌هایی استوار به انتهای باریکه صخره‌ای بر فراز آبشار می‌رسد؛ جایی که غرش کرکننده آب گوش‌ها را پر کرده است. روی تخته‌سنگی سیاه، پیپ هلمز که قبلاً در مهمان‌خانه جا مانده بود و نامه‌ای با جوهر طلایی از موریارتی قرار دارد: «وقت سنجش فرا رسیده است، شرلوک.»",
        tasks: [
          {
            id: "task-c2-8-pseudo-cleft-torrent",
            titleFa: "استنتاج مرگبار با جمله شبه‌شکافته فلسفی (What remains indisputable)",
            speakerPromptEn: "Stand upon the spray-drenched ledge and articulate the fatal inevitability with cold philosophical resolve...",
            speakerPromptFa: "روی باریکه لغزنده غرق در قطرات آب می‌ایستی و حتمیت مرگبار را با عزم فلسفی سرد بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (جمله شبه‌شکافته What remains indisputable amidst)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «آنچه در میان این غرش سیل‌آسای کرکننده مسلم و انکارناپذیر باقی می‌ماند این است که یکی از ما هرگز زنده از این پرتگاه بازنخواهد گشت.»",
            targetKeywords: [
              { phrase: "What remains indisputable amidst this", hintFa: "(آنچه مسلم و انکارناپذیر باقی می‌ماند)", synonyms: ["what remains indisputable amidst this", "what is indisputable amidst this", "what remains undeniable amidst this"], weight: 50 },
              { phrase: "depart this precipice alive", hintFa: "(زنده از این پرتگاه بازنخواهد گشت)", synonyms: ["depart this precipice alive", "leave this precipice alive", "quit this precipice alive"], weight: 50 },
            ],
            idealVoiceResponseEn: "What remains indisputable amidst this deafening torrent is that one of us shall not depart this precipice alive.",
            alternativeResponsesEn: [
              { phraseEn: "What remains undeniable amidst this deafening roar is that one of us will not leave this precipice alive.", translationFa: "آنچه در میان این غرش کرکننده انکارناپذیر است این است که یکی از ما زنده این پرتگاه را ترک نخواهد کرد." },
              { phraseEn: "What is indisputable in this blinding mist is that only one of us shall walk away from this ledge.", translationFa: "آنچه در این مه کورکننده مسلم است این است که تنها یکی از ما از این صخره بازخواهد گشت." },
            ],
            whiteHintFa: "از ساختار شبه‌شکافته استادی What remains indisputable amidst this deafening torrent is that one of us shall not depart this precipice alive استفاده کن!",
            fallbackChoices: [
              "What remains indisputable amidst this deafening torrent is that one of us shall not depart this precipice alive.",
              "The abyss below churns with emerald foam and shattered spray.",
              "My walking staff is firmly wedged between the granite fissures.",
            ],
            aefReference: "Cambridge C2 Mastery (Complex Pseudo-cleft Sentences: What remains indisputable is that...)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look behind the great boulder, Holmes! He emerges from the mist!",
              textFa: "پشت تخته‌سنگ عظیم را ببین هلمز! او از میان مه بیرون می‌آید!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "شاخه ۳ب: اسناد نیمه‌سوخته و ظهور شبح‌گونه موریارتی در مه",
        titleEn: "Branch 3B: Scorched Documents & Moriarty's Shadow Emergence",
        locationFa: "لبه صخره‌ای خیس از پودر آب و دوده انفجار",
        locationEn: "Spray-Swept Precipice, Scorched Granite",
        storyIntroFa: "غار یخی فرو ریخت و پرونده سرخ با کناره‌های سوخته نجات یافت. دوده انفجار روی دست‌ها و گونه‌های هلمز نشسته است. هنوز غبار انفجار در باد فرو ننشسته است که سایه سیاه و بلند پروفسور موریارتی از مه سفید آبشار پدیدار می‌شود.",
        tasks: [
          {
            id: "task-c2-8-inversion-scarcely-cavern",
            titleFa: "روایت دراماتیک مواجهه با ساختار وارونگی زمانی Scarcely had",
            speakerPromptEn: "Step through the smoky vapor and express the dramatic confrontation using negative inversion...",
            speakerPromptFa: "از میان بخار دودآلود عبور می‌کنی و مواجهه دراماتیک را با وارونگی زمانی بیان می‌کنی...",
            speakerRoleFa: "شرلوک هلمز (وارونگی Scarcely had the echoes)",
            speakerAvatar: "🔍",
            taskInstructionFa: "بگو: «هنوز به سختی پژواک انفجار غار فروکش کرده بود که شبح موریارتی از میان مه کورکننده نمایان شد.»",
            targetKeywords: [
              { phrase: "Scarcely had the echoes of", hintFa: "(هنوز به سختی پژواک فروکش کرده بود)", synonyms: ["scarcely had the echoes of", "hardly had the echoes of", "barely had the echoes of"], weight: 50 },
              { phrase: "Moriarty's silhouette emerged through the", hintFa: "(شبح موریارتی نمایان شد)", synonyms: ["moriarty's silhouette emerged through the", "moriarty's figure emerged through the", "moriarty emerged through the blinding mist"], weight: 50 },
            ],
            idealVoiceResponseEn: "Scarcely had the echoes of the cavern blast subsided when Moriarty's silhouette emerged through the blinding mist.",
            alternativeResponsesEn: [
              { phraseEn: "Hardly had the reverberations of the explosion died down when Moriarty's figure stepped from the mist.", translationFa: "به سختی طنین انفجار فروکش کرده بود که پیکر موریارتی از مه بیرون آمد." },
              { phraseEn: "Scarcely had the smoke cleared from the ledge when Moriarty's dark silhouette confronted us.", translationFa: "هنوز به سختی دود از صخره کنار رفته بود که سایه سیاه موریارتی در برابر ما قد علم کرد." },
            ],
            whiteHintFa: "از ساختار وارونگی زمانی Scarcely had the echoes of the cavern blast subsided when Moriarty's silhouette emerged through the blinding mist استفاده کن!",
            fallbackChoices: [
              "Scarcely had the echoes of the cavern blast subsided when Moriarty's silhouette emerged through the blinding mist.",
              "The wind whips the drenched edges of the recovered dossier.",
              "The Reichenbach waters plummet into the black abyss below.",
            ],
            aefReference: "Cambridge C2 Mastery (Inversion with Scarcely... when / Hardly... when)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "He has drawn a blade from his walking cane, Holmes!",
              textFa: "او تیغه‌ای از چوب‌دستی‌اش بیرون کشیده است هلمز!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-8-default-fallback",
        titleFa: "تحلیل رویارویی نهایی بر لبه باریکه صخره‌ای",
        speakerPromptEn: "Face the roaring cataract on the edge...",
        speakerPromptFa: "رو به آبشار خروشان بر لبه پرتگاه می‌ایستی...",
        speakerRoleFa: "شرلوک هلمز (جمله شبه‌شکافته What remains indisputable)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «آنچه در میان این غرش سیل‌آسای کرکننده مسلم و انکارناپذیر باقی می‌ماند این است که یکی از ما هرگز زنده از این پرتگاه بازنخواهد گشت.»",
        targetKeywords: [
          { phrase: "What remains indisputable amidst this", hintFa: "(آنچه مسلم باقی می‌ماند)", synonyms: ["what remains indisputable amidst this", "what is indisputable amidst"], weight: 50 },
          { phrase: "depart this precipice alive", hintFa: "(زنده بازنخواهد گشت)", synonyms: ["depart this precipice alive", "leave this precipice alive"], weight: 50 },
        ],
        idealVoiceResponseEn: "What remains indisputable amidst this deafening torrent is that one of us shall not depart this precipice alive.",
        alternativeResponsesEn: [
          { phraseEn: "What is indisputable is that one of us will not leave this precipice alive.", translationFa: "مسلم این است که یکی از ما زنده این صخره را ترک نخواهد کرد." },
        ],
        whiteHintFa: "از ساختار What remains indisputable amidst this deafening torrent... استفاده کن!",
        fallbackChoices: [
          "What remains indisputable amidst this deafening torrent is that one of us shall not depart this precipice alive.",
          "The foam churns a hundred yards beneath our boots.",
        ],
        aefReference: "Cambridge C2 Mastery",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Moriarty is stepping onto the ledge!",
          textFa: "موریارتی پا بر روی باریکه صخره‌ای می‌گذارد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4 — The Ultimate Duel with Professor Moriarty on the Brink
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "C2",
    titleFa: "تصمیم چهارم: رویارویی نهایی تن‌به‌تن با پروفسور موریارتی",
    titleEn: "DECISION 4: The Ultimate Duel with Professor Moriarty on the Brink",
    locationFa: "لبه صخره گرانیتی لغزنده از خزه و یخ بر فراز گرداب جوشان رایشنباخ",
    locationEn: "The Edge of the Abyss, Roaring Mists, Reichenbach Falls",
    storyIntroFa: "پروفسور جیمز موریارتی با کت سیاه و صورت استخوانی‌اش، تنها در دو متری شما بر لبه لغزنده پرتگاه ایستاده است. پودر سفید آبشار مانند کفن هوا را پوشانده و صخره زیر پای دو مرد از خزه و یخ لغزنده است. موریارتی چوب‌دستی‌اش را با دو دست می‌چرخاند و تیغه فولادی باریک و بلندی از آن بیرون می‌جهد! چشمانش از خشم و جنون عقلانی می‌سوزد: «هلمز! تو تمام مهره‌های مرا در اسکاتلند [B1]، دارتمور [B2] و باکینگهام [C1] سوزاندی؛ اما شاه شطرنج اینجاست! پرونده سرخ را پس بده، یا هر دو در این دیگ جوشان به ابدیت سقوط خواهیم کرد!» موریارتی آماده جهش مرگبار است.",
    cutscene: {
      titleFa: "رویارویی تن‌به‌تن تاریخی هلمز و موریارتی بر لبه آبشار رایشنباخ",
      titleEn: "The Historic Hand-to-Hand Clash of Holmes & Moriarty on the Brink",
      imageSrc: "/images/skills/speaking/c2_scene_9_reichenbach_duel.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "مغز متفکر جنایت جهان",
          speakerAvatar: "🕷️",
          textEn: "All that you have won, Holmes, ends upon this granite shelf! Give me Folder Number Four, or I drag you down into the churning waters!",
          textFa: "تمام آنچه به دست آورده‌ای هلمز، روی این تخته‌سنگ گرانیت پایان می‌یابد! پوشه شماره چهار را به من بده، یا تو را به درون این آب‌های جوشان به زیر می‌کشم!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور بر لبه صخره",
          speakerAvatar: "🔍",
          textEn: "If I am assured of your destruction, Professor, I would cheerfully welcome my own! But intellect shall not yield to madness!",
          textFa: "اگر از نابودی تو اطمینان یابم پروفسور، با کمال میل از نابودی خود استقبال خواهم کرد! اما خرد هرگز تسلیم جنون نخواهد شد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-4",
      promptFa: "رویارویی نهایی بر لبه پرتگاه مرگبار ۹۰ متری: آیا با فن رزمی ژاپنی باریتسو شمشیر موریارتی را مهار می‌کنید یا با دست خالی گلاویز می‌شوید؟",
      promptEn: "Historic Showdown on the Abyss: Execute the Japanese martial art of Baritsu to disarm Moriarty, or engage in a desperate physical grapple?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Execute the martial art of Baritsu to pivot around Moriarty's thrust and overthrow his balance",
          labelFa: "گزینه ۴الف: اجرای فن دفاع شخصی رزمی ژاپنی «باریتسو» (Baritsu) برای برهم زدن تعادل موریارتی و رها کردن او در پرتگاه",
          descriptionFa: "هلمز با انحراف مرکز ثقل و قفل مفصل، موریارتی را روی خزه لغزنده منحرف می‌کند؛ موریارتی به گرداب سقوط می‌کند و هلمز استوار می‌ماند.",
          pointsDelta: 150,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Lock into a direct bare-knuckle grapple on the slippery moss-covered precipice",
          labelFa: "گزینه ۴ب: گلاویز شدن خشن با دست خالی روی لبه پرتگاه مرگبار با ریسک لغزش و سقوط دوطرفه",
          descriptionFa: "درگیری تن‌به‌تن سنگینی درمی‌گیرد؛ موریارتی به پایین پرتاب می‌شود اما هلمز را به همراه خود می‌کشد و هلمز با جراحت شدید در لبه معلق می‌ماند.",
          pointsDelta: 100,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-9-inversion-not-for-a-fraction",
        titleFa: "بیان باور تزلزل‌ناپذیر با ساختار وارونگی نفی تأکیدی C2",
        speakerPromptEn: "Brace your boots upon the moss and deliver your ultimate intellectual conviction with negative inversion...",
        speakerPromptFa: "پوتین‌هایت را روی خزه محکم می‌کنی و باور تزلزل‌ناپذیر فکری‌ات را با وارونگی نفی بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (وارونگی Not for a solitary fraction of a second)",
        speakerAvatar: "🔍",
        taskInstructionFa: "بگو: «حتی برای کسری از ثانیه نیز تردید نکردم که عقلانیت استنتاجی بر بدخواهی حساب‌شده غلبه خواهد کرد.»",
        targetKeywords: [
          { phrase: "Not for a solitary fraction of", hintFa: "(حتی برای کسری از ثانیه)", synonyms: ["not for a solitary fraction of", "not for a single fraction of", "never for a fraction of a"], weight: 50 },
          { phrase: "vanquish calculated malevolence", hintFa: "(بر بدخواهی حساب‌شده غلبه خواهد کرد)", synonyms: ["vanquish calculated malevolence", "overcome calculated malevolence", "triumph over calculated malevolence"], weight: 50 },
        ],
        idealVoiceResponseEn: "Not for a solitary fraction of a second did I doubt that deductive intellect would vanquish calculated malevolence.",
        alternativeResponsesEn: [
          { phraseEn: "Never for a single fraction of a second did I doubt that deductive reason would triumph over your calculated evil.", translationFa: "هرگز حتی برای کسری از ثانیه شک نکردم که عقل استنتاجی بر پلیدی حساب‌شده‌ات پیروز خواهد شد." },
          { phraseEn: "Not for one solitary moment did I believe that your malevolence could conquer our deductive intellect.", translationFa: "حتی برای یک لحظه تنها باور نداشتم که بدخواهی تو بتواند بر عقلانیت استنتاجی ما چیره گردد." },
        ],
        whiteHintFa: "از ساختار وارونگی عالی‌رتبه Not for a solitary fraction of a second did I doubt that deductive intellect would vanquish calculated malevolence استفاده کن!",
        fallbackChoices: [
          "Not for a solitary fraction of a second did I doubt that deductive intellect would vanquish calculated malevolence.",
          "Moriarty's cane blade flashes like lightning against the spray.",
          "The torrent roars with deafening, inescapable fury.",
        ],
        aefReference: "Cambridge C2 Mastery (Elite Negative Inversion: Not for a fraction of a second did I...)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "مغز متفکر در لبه پرتگاه",
          speakerAvatar: "🕷️",
          textEn: "Then die with your intellect, Holmes!",
          textFa: "پس با همان عقلانیتت بمیر، هلمز!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: Climax, Dual Endings & The Grand Resolution of the Four Folders
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "C2",
    titleFa: "پرده دهم: فرجام حماسه، ارزیابی امتیازات و حل نهایی ۴ پوشه MI6",
    titleEn: "Stage 10: The Reichenbach Resolution, The Four Folders & The Legend",
    locationFa: "صخره‌های پاک‌شده با باران رایشنباخ در تابش پرتوهای آفتاب از میان ابرها",
    locationEn: "The Sunlit Summit of the Reichenbach, Dawn, Swiss Alps",
    storyIntroFa: "موریارتی با شمشیر برهنه‌اش خیز برمی‌دارد. شرلوک با اجرای استادانه فن باستانی باریتسو از مسیر تیغه خالی کرده و با یک چرخش سریع دست و اهرم کردن مچ، تعادل پروفسور را روی لجن لغزنده لبه صخره برهم می‌زند. موریارتی با فریادی وحشتناک دست‌وپا می‌زند، چوب‌دستی‌اش در هوا می‌چرخد و به درون غرش جوشان و کف‌آلود آبشار سقوط می‌کند و برای همیشه در ژرفای تاریک آب‌های رایشنباخ ناپدید می‌شود! هلمز نفس‌زنان اما سربلند بر لبه پرتگاه می‌ایستد. پرونده سرخ در دست اوست. صدای پای شتابان واتسون به گوش می‌رسد؛ او با راهنمایان آلپ سر می‌رسد و با ناباوری و اشک شوق، هلمز را زنده و پیروز در آغوش می‌گیرد. هر چهار پرونده تاریخی MI6 بازیابی شده‌اند...",
    cutscene: {
      titleFa: "سقوط موریارتی به گرداب و آغوش برادرانه هلمز و واتسون در طلوع آفتاب",
      titleEn: "Moriarty's Plunge into the Abyss & The Brotherly Embrace at Sunrise",
      imageSrc: "/images/skills/speaking/c2_scene_10_reichenbach_dawn.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با اشک شوق",
          speakerAvatar: "🩺",
          textEn: "Holmes! Great God in heaven, Holmes! You live! The monster has fallen into the abyss!",
          textFa: "هلمز! خدای بزرگ آسمان‌ها، هلمز! تو زنده‌ای! هیولا به درون مغاک سقوط کرد!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور با پرونده سرخ",
          speakerAvatar: "🔍",
          textEn: "Baritsu, my dear Watson—the Japanese system of self-defense has more than once stood me in good stead. The Red Folder is secure, and Europe is saved!",
          textFa: "باریتسو، واتسون عزیزم—سامانه دفاع شخصی ژاپنی بیش از یک بار به کارم آمده است. پرونده سرخ امن است و اروپا نجات یافت!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-10-cleft-undoing-loyalty",
        titleFa: "استنتاج جاودانه فرجام حماسه با جمله شبه‌شکافته و کانون تقابلی C2",
        speakerPromptEn: "Look out across the golden dawn breaking over the Swiss Alps and deliver the concluding verdict of the epic saga...",
        speakerPromptFa: "به طلوع طلایی آفتاب بر فراز آلپ سوئیس چشم می‌دوزی و حکم فرجامین این حماسه باشکوه را با جمله شکافته بیان می‌کنی...",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته What sealed Moriarty's ultimate undoing)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «آنچه نابودی نهایی موریارتی را مهروموم کرد صرفاً غرور بی‌حدوحصرش نبود، بلکه دست‌کم گرفتن مرگبار وفاداری انسانی بود.»",
        targetKeywords: [
          { phrase: "What sealed Moriarty's ultimate undoing was", hintFa: "(آنچه نابودی نهایی او را رقم زد)", synonyms: ["what sealed moriarty's ultimate undoing was", "what sealed his ultimate undoing was", "what caused moriarty's ultimate undoing was"], weight: 50 },
          { phrase: "fatal underestimation of human loyalty", hintFa: "(دست‌کم گرفتن مرگبار وفاداری انسانی)", synonyms: ["fatal underestimation of human loyalty", "fatal misjudgment of human loyalty", "underestimation of human loyalty"], weight: 50 },
        ],
        idealVoiceResponseEn: "What sealed Moriarty's ultimate undoing was not merely his overweening hubris, but his fatal underestimation of human loyalty.",
        alternativeResponsesEn: [
          { phraseEn: "What brought about Moriarty's final undoing was not only his immense arrogance, but his fatal underestimation of human loyalty.", translationFa: "آنچه نابودی نهایی موریارتی را پدید آورد صرفاً تکبر بیکرانش نبود، بلکه دست‌کم گرفتن مرگبار وفاداری انسانی بود." },
          { phraseEn: "What sealed his ultimate defeat was not just intellectual hubris, but his fatal disregard for loyal friendship.", translationFa: "آنچه شکست غایی او را رقم زد نه صرفاً کبر فکری، بلکه نادیده گرفتن مرگبار دوستی وفادارانه بود." },
        ],
        whiteHintFa: "از ساختار شبه‌شکافته جاودانه What sealed Moriarty's ultimate undoing was not merely his overweening hubris, but his fatal underestimation of human loyalty استفاده کن!",
        fallbackChoices: [
          "What sealed Moriarty's ultimate undoing was not merely his overweening hubris, but his fatal underestimation of human loyalty.",
          "The Reichenbach waters gleam like liquid silver in the morning light.",
          "Four imperial folders of MI6 are gathered together once again.",
        ],
        aefReference: "Cambridge C2 Mastery (Complex Multi-clause Cleft with Antithetical Focus)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "London awaits us, my dear friend. Pack the folders; our rooms at Baker Street have never seemed so welcoming.",
          textFa: "لندن در انتظار ماست دوست عزیزم. پرونده‌ها را بردار؛ اتاق‌هایمان در خیابان بیکر هرگز تا این حد دل‌پذیر به نظر نرسیده‌اند.",
        },
      },
    ],
    possibleEndings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان جاودانه: فتح رایشنباخ، انهدام کامل سندیکا و بازگشت شکوهمند به ۲۲۱ب بیکر استریت",
        titleEn: "ENDING 1: THE REICHENBACH TRIUMPH — The Legend of 221B Baker Street!",
        badgeTitleFa: "👑 حماسه به پایان رسید: ۴ پوشه MI6 بازیابی شد و بزرگ‌ترین کارآگاهان تاریخ جاودانه شدند",
        imageSrc: "/images/skills/speaking/c2_scene_case_solved.jpg",
        climaxStoryFa: "پروفسور جیمز موریارتی با فریادی گوش‌خراش به گرداب جوشان آبشار رایشنباخ سقوط می‌کند و در اعماق بی‌پایان امواج محو می‌گردد. شرلوک هلمز استوار و سربلند، پوشه سرخ [C2] را در کنار دکتر واتسون باز می‌کند. هر چهار پرونده فوق‌محرمانه MI6 که در ابتدا نمادهایشان در روبان صورتی لیلی در ایستگاه پدینگتون مخفی شده بود (قطار آبی B1، سکه هاوند B2، دفترچه تاج C1، و پرونده سرخ C2) با موفقیت کامل بازیابی شدند. هلمز و واتسون با قطار سریع‌السیر به لندن بازمی‌گردند. در خیابان ۲۲۱ب بیکر استریت، مایکرافت هلمز و نخست‌وزیر بریتانیا شخصاً به استقبال آن‌ها می‌آیند. پادشاهی و صلح اروپا نجات یافت و پیوند برادرانه شرلوک و واتسون به عنوان درخشان‌ترین اسطوره کارآگاهی تاریخ ثبت گردید.",
        climaxStoryEn: "Professor James Moriarty plunges screaming into the churning abyss of the Reichenbach Falls, vanished forever beneath the roaring foam. Sherlock Holmes stands resolute and triumphant upon the sunlit precipice, holding Folder Number Four [C2] intact beside Dr. Watson. All four stolen MI6 dossiers—whose ciphers were once sewn within Lily's pink ribbon at Paddington (The Blue Train [B1], The Hound Coin [B2], The Crown Ledger [C1], and The Red Folder [C2])—have been comprehensively reclaimed. Returning by express to 221B Baker Street, Holmes and Watson are received by Mycroft and the Prime Minister. The realm is saved, and their partnership is immortalized as the greatest detective legend in history.",
        revealDialogueFa: `فرجام باشکوه حماسه چهار پوشه (The Grand Saga Finale):
در اتاق پذیرایی ۲۲۱ب خیابان بیکر، آتش شومینه با هیزم بلوط روشن است. پیپ شرلوک دودی ملایم برمی‌انگیزد و فنجان چای گرم در دست دکتر واتسون می‌درخشد.
روی میز ماهوگانی کارآگاه، چهار پوشه چرمی رسمی ممهور به نشان عقاب و تاج MI6 در کنار یکدیگر آرام گرفته‌اند:
۱. «قطار آبی [B1]»: کدهای پدافند دریایی ناوگان بریتانیا
۲. «سکه هاوند [B2]»: فرمول‌های بیوشیمیایی و نجات دانشمند ارشد، دکتر ونس
۳. «دفترچه تاج [C1]»: دفترچه سیاه دربار و مهار نفوذ موریارتی به کاخ باکینگهام
۴. «پرونده سرخ [C2]»: مانیفست کامل سندیکا و کدهای زرادخانه‌های اروپا که با سقوط موریارتی در رایشنباخ منهدم گردید!

مایکرافت هلمز با تبسمی نادر، پوشه‌ها را در کیف فولادی مخصوص مهروموم می‌کند:
«برادر عزیزم شرلوک، و تو دکتر واتسون؛ شما نه تنها امپراتوری بریتانیا، بلکه تمدن اروپا را از پرتگاه جنگ و هرج‌ومرج نجات دادید. ملت تا ابد مدیون شماست.»
شرلوک به پنجره بارانی خیابان بیکر چشم می‌دوزد، دست بر شانه واتسون می‌گذارد و با صدایی آرام می‌گوید:
«هر پرونده‌ای رازی داشت مایکرافت؛ اما بزرگ‌ترین دستاورد این سفر، وفاداری مردی بود که در دهانه جهنم نیز در کنارم ایستاد: برادرم، دکتر جان واتسون. حالا پرونده‌ها را ببند؛ ما پرونده دیگری برای گشودن داریم.»`,
        revealDialogueEn: `THE GRAND SAGA FINALE — 221B BAKER STREET:
In the sitting room of 221B Baker Street, the oak fire crackles warmly. Sherlock's pipe sends gentle spirals toward the ceiling while Dr. Watson cradles a steaming cup of tea.
Upon the mahogany table, all four official leather folders bearing the Crown and MI6 cipher rest triumphantly side by side:
1. «The Blue Train [B1]»: The British Royal Navy naval defense ciphers
2. «The Hound Coin [B2]»: The biochemical formulas and the rescue of Dr. Alistair Vance
3. «The Crown Ledger [C1]»: The Royal Privy Council ledger secured beneath Big Ben
4. «The Red Folder [C2]»: The master European syndicate manifesto neutralized with Moriarty's fall!

Mycroft Holmes secures the dossiers into a diplomatic steel dispatch case:
"My dear Sherlock, and Dr. Watson; you have shielded not merely the British realm, but European civilization itself from the precipice of ruin. The Crown is forever in your debt."
Sherlock gazes through the rain-streaked window of Baker Street, resting a hand upon Watson's shoulder:
"Every dossier held a secret, Mycroft; but the crowning discovery of this journey was the steadfast fidelity of the man who stood beside me on the brink of the abyss: my brother, Dr. John Watson. Close the files; London is peaceful once more."`,
        nextTierHintFa: "تبریک بی‌کران! شما دوره کامل کارآگاهی شرلوک هلمز را از سطح A1 تا پایان استادی C2 با موفقیت خارق‌العاده به اتمام رساندید!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان تلخ و کلاسیک کانن دویل: وقفه بزرگ (The Great Hiatus) و ناپدید شدن در مه",
        titleEn: "ENDING 2: THE GREAT HIATUS — The Vanishing in the Alpine Mists",
        badgeTitleFa: "🕊️ وقفه بزرگ: موریارتی نابود شد، اما هلمز در سایه‌ها ناپدید گشت",
        imageSrc: "/images/skills/speaking/c2_scene_case_failed.jpg",
        climaxStoryFa: "در کشمکش خشن و تن‌به‌تن در لبه باریکه صخره‌ای، موریارتی با زخمی عمیق به قعر گرداب آبشار سقوط می‌کند اما هلمز را نیز با خود تا لبه پرتگاه می‌کشد. شرلوک به سختی لبه سنگ را چنگ می‌زند اما دست راست و دنده‌هایش آسیب جدی می‌بیند. پرونده سرخ با اوراق نیمه‌سوخته روی صخره می‌ماند. هلمز با آگاهی از اینکه بقایای خطرناک سندیکای موریارتی به سرکردگی سرهنگ موران در پی انتقام خواهند بود، برای محافظت از جان واتسون تصمیمی تلخ می‌گیرد: او پیپ، جاسیگاری نقره‌ای و یادداشتی به خط خودش روی صخره برای واتسون بر جای می‌گذارد و برای چند سال در سایه‌های تبت و خاورمیانه ناپدید می‌شود («وقفه بزرگ» / The Great Hiatus)...",
        climaxStoryEn: "In the desperate hand-to-hand grapple upon the brink, Moriarty plunges into the abyss, yet nearly drags Holmes over the edge. Clinging to the rock, Sherlock survives with severe fractures. Recognizing that Moran and the armed remnants of the syndicate would hunt Watson mercilessly, Holmes makes a noble sacrifice: leaving his silver cigarette case and a final farewell letter upon the rock, he vanishes into the mists of the high Alps, embarking upon the legendary 'Great Hiatus' while leaving Watson with bittersweet reverence and an everlasting bond.",
        revealDialogueFa: `یادداشت بر روی صخره رایشنباخ (The Great Hiatus Farewell):
دکتر واتسون در میان مه خروشان به باریکه صخره‌ای می‌رسد. اثری از هلمز نیست؛ تنها جای پای دو مرد که به لبه پرتگاه ختم شده و بازنگشته است دیده می‌شود!
روی تخته‌سنگ، کیف چرمی حاوی پرونده سرخ نیمه‌سوخته، فندک نقره‌ای هلمز و نامه‌ای با دست‌خط ظریف او قرار دارد:

«دوست عزیزم واتسون،
این چند سطر را با لطف و صبری که موریارتی برایم به جا گذاشت برایت می‌نویسم.
نبرد ما در رایشنباخ به پایان رسید و بزرگ‌ترین جنایتکار قرن به اعماق آبشار سقوط کرد. پرونده سرخ [C2] اینجاست؛ آن را به مایکرافت برسان.
اما بقایای مسلح او هنوز در کمین‌اند. اگر زنده بودنم آشکار شود، جان تو و آنان که دوستشان داریم به خطر خواهد افتاد.
بنابراین، من برای مدتی به سایه‌ها سفر می‌کنم تا شبکه او را تا ریشه بسوزانم.
بدان که همواره به خاطر دوستی پرمهر و برادرانه‌ات در تمام این سال‌ها سپاسگزارت خواهم بود.
به باکر استریت بازگرد و مشعل حقیقت را روشن نگه دار؛ تا روزی که سایه‌ها کنار بروند و دوباره در کنار شومینه ۲۲۱ب بنشینیم.
— دوستدار همیشگی تو، شرلوک هلمز»

واتسون نامه را به سینه می‌فشارد و با صدایی لرزان در میان غرش آبشار زمزمه می‌کند:
«خداوند نگهدارت باشد، شرلوک هلمز... بهترین و خردمندترین مردی که تا به حال شناخته‌ام.»`,
        revealDialogueEn: `THE LETTER UPON THE REICHENBACH ROCK:
Dr. Watson reaches the spray-soaked ledge in anguish. Holmes is gone; two sets of footprints lead to the precipice and do not return!
Resting upon the flat stone lies the leather case containing the scorched Red Folder, Holmes's silver cigarette case, and a handwritten note:

"My dear Watson,
I write these few lines through the courtesy of Professor Moriarty.
Our struggle at Reichenbach is concluded, and the greatest criminal of our era lies at the bottom of the falls. The Red Folder [C2] is here; convey it safely to Mycroft.
Yet armed remnants of his syndicate still lurk in the passes. Were my survival known, your life and those we cherish would remain in mortal jeopardy.
Thus, I must journey for a season into the shadows until every root of this conspiracy is eradicated.
Know that I am deeply conscious of the noble affection and comradeship that has bound us through all our trials.
Return to Baker Street and keep the flame of truth burning bright; until the day the mists disperse and we sit once more beside the hearth of 221B.
— Ever yours, Sherlock Holmes"

Watson clasps the letter to his chest, whispering through his tears into the thunder of the cataract:
"Farewell, Sherlock Holmes... the best and the wisest man whom I have ever known."`,
        nextTierHintFa: "شما حماسه جاودانه شرلوک هلمز را با فرجام اسطوره‌ای وقفه بزرگ به پایان رساندید!",
      },
    },
  },
];
