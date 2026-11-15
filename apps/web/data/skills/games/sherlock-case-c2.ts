import type { DetectiveStage } from "./sherlock-detective-curriculum";

// ============================================================================
// CEFR C2 CASE: "CASE FILE #06: THE RED FOLDER & THE REICHENBACH RECKONING"
// Official CEFR C2 Vocabulary & Grammar (Cambridge C2 Proficiency / AEF Advanced Plus):
// - High-Register Rhetorical Inversion: Little did Moriarty anticipate..., Hardly had we reached...
// - Complex Multi-Layered Cleft Sentences: What sealed Moriarty's downfall was..., It is this fragile bridge...
// - Advanced Subjunctive & Hypothetical Conditionals: Were Sebastian Moran to control..., Had I not neutralized...
// - Elite Discourse Markers & Participle Clauses: Having secured the chasm bridge..., Notwithstanding the precipice...
// - Epic Alpine Ballistics, Forensic Climax & Philosophical Master Lexicon
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
    storyIntroFa: "عصرگاهی مه‌آلود در دامنه‌های یخ‌بسته آلپ سوئیس است. پس از متوقف کردن عقربه‌های ساعت بیگ بن در لندن و بازیابی سه پوشه نخست، پاکت ممهور به موم سرخ جیمز موریارتی شما و دکتر واتسون را به دهکده کوهستانی مایرینگن کشانده است؛ جایی که آخرین و مخوف‌ترین سند ربوده‌شده MI6 یعنی «پرونده سرخ» پنهان شده است. هتل‌دار سالخورده با شتاب نامه‌ای اضطراری به واتسون می‌دهد: «یک بانوی نجیب‌زاده انگلیسی در هتل دچار بیماری حاد ریوی شده و التماس پزشک انگلیسی دارد!» واتسون قصد رفتن دارد، اما شرلوک به علامت تمبر نگاه می‌کند: خط پیام متعلق به موریارتی است؛ ترفندی برای تنها کشاندن هلمز به باریکه پرتگاه آبشار.",
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
          textEn: "Good heavens, Holmes! An Englishwoman is critically ill at the inn; my medical oath compels me to return at once!",
          textFa: "خدای من هلمز! یک زن انگلیسی در مهمان‌خانه به شدت بیمار است؛ سوگند پزشکی‌ام مرا ملزم می‌کند فوراً برگردم!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور با پالتوی زمستانی",
          speakerAvatar: "🔍",
          textEn: "Examine the ink, John; it was written barely fifteen minutes ago in Moriarty's unmistakable handwriting to lure me alone!",
          textFa: "جوهر را بررسی کن جان؛ این خط به سختی پانزده دقیقه پیش با دست‌خط آشنای موریارتی نوشته شده تا مرا تنها به دام بیندازد!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-1-inversion-little-did",
        titleFa: "استنتاج استادی با وارونگی بلاغی پیشرفته (Little did Moriarty anticipate)",
        speakerPromptEn: "Hold up the forged telegram and expose Moriarty's deceptive trap using advanced rhetorical inversion.",
        speakerPromptFa: "تلگراف جعلی را بالا می‌گیری و فریب تفرقه‌افکنانه موریارتی را با وارونگی بلاغی فاش می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (وارونگی استادی Little did Moriarty anticipate)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «موریارتی هرگز پیش‌بینی نمی‌کرد که ما تلگراف فریبکارانه‌اش برای جدایی‌مان را به این سادگی برملا کنیم.»",
        targetKeywords: [
          { phrase: "Little did Moriarty anticipate", hintFa: "(موریارتی هرگز پیش‌بینی نمی‌کرد)", synonyms: ["little did moriarty anticipate", "little did the mastermind anticipate", "rarely did moriarty foresee"], weight: 50 },
          { phrase: "see through his deceptive telegram", hintFa: "(پیام فریبکارانه‌اش را برملا کنیم)", synonyms: ["see through his deceptive telegram", "expose his deceptive telegram", "penetrate his fraudulent dispatch"], weight: 50 },
        ],
        idealVoiceResponseEn: "Little did Moriarty anticipate that we would so readily see through his deceptive telegram to divide us.",
        alternativeResponsesEn: [
          { phraseEn: "Little did Professor Moriarty foresee that our deductions would immediately unmask this fabricated dispatch.", translationFa: "پروفسور موریارتی هرگز پیش‌بینی نمی‌کرد که استنتاج‌های ما بلافاصله این پیام ساختگی را برملا سازد." },
          { phraseEn: "Rarely did the mastermind expect that we would so quickly expose his forged message.", translationFa: "به ندرت مغز متفکر انتظار داشت که ما تا این اندازه سریع پیام جعلی او را فاش کنیم." },
        ],
        whiteHintFa: "از ساختار وارونگی فصیح Little did Moriarty anticipate that... برای شروع استنتاج سطح C2 استفاده کن!",
        fallbackChoices: [
          "Little did Moriarty anticipate that we would so readily see through his deceptive telegram to divide us.",
          "The jagged peaks of the Wetterhorn are shrouded in thick winter mist.",
          "The landlord has prepared two walking staves reinforced with steel tips.",
        ],
        aefReference: "Cambridge C2 Mastery / AEF Advanced Plus (Rhetorical inversion with Little did someone anticipate)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The scoundrel sought to isolate you! I stand steadfast by your side to the finish, Holmes!",
          textFa: "مردک خبیث می‌خواست تو را تنها گیر بیندازد! من تا فرجام ماجرا استوار کنارت می‌مانم هلمز!",
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
    storyIntroFa: "شما و واتسون در امتداد گردنه سنگی گریندلوالد پیش می‌روید. مه غلیظی از روی دره‌ها بالا می‌آید و باد زوزه می‌کشد. ناگهان گلوله‌ای سربی و بدون صدا به سنگ خارا در دو سانتی‌متری کلاه هلمز اصابت کرده و پودر گرانیت را در هوا پخش می‌کند! در دهانه غاری در دیواره روبه‌رو، لوله استیل تفنگ بادی سنگین سرهنگ سباستین موران (دست راست نظامی موریارتی و تک‌تیرانداز مخوف ارتش هند) دیده می‌شود. موران گردنه را زیر آتش خاموش گرفته است.",
    cutscene: {
      titleFa: "شلیک گلوله سربی خاموش سرهنگ موران در شکاف صخره‌ها",
      titleEn: "Colonel Moran's Silent Heavy Air Rifle Strikes the Granite",
      imageSrc: "/images/skills/speaking/c2_scene_2_moran_ambush.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Down, Watson! That noiseless impact was Colonel Moran's custom pneumatic rifle concealed in the upper crevice!",
          textFa: "روی زمین بخواب واتسون! آن ضربه بی‌صدا تفنگ بادی سفارشی سرهنگ موران پنهان‌شده در شکاف صخره‌هاست!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "He has pinned us against this narrow precipice! What is our tactical countermeasure, Holmes?",
          textFa: "او ما را روی این باریکه صخره‌ای زمین‌گیر کرده است! تدبیر تاکتیکی ما چیست هلمز؟",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-1",
      promptFa: "تصمیم سرنوشت‌ساز اول: چگونه آتش تک‌تیراندازی مخوف سرهنگ موران را در گردنه سنگی مهار می‌کنید؟",
      promptEn: "Decision 1: Fire a chemical phosphorus flare into Moran's sniper nest or scale the frozen crevasse to flank him?",
      choices: [
        {
          id: "choice-1a",
          labelEn: "Choice 1A: Fire a chemical phosphorus flare directly into Moran's cave to blind his optics",
          labelFa: "گزینه ۱الف: شلیک منور فسفری شیمیایی به دهانه غار برای کور کردن دید موران و عبور ایمن",
          descriptionFa: "دید شبانه و لنزهای اپتیکال موران را مختل می‌کنید و مسیر صخره‌ای را بدون تلفات پشت سر می‌گذارید.",
          pointsDelta: 350,
        },
        {
          id: "choice-1b",
          labelEn: "Choice 1B: Scale the treacherous icy chimney to surprise Moran from the rear ridge",
          labelFa: "گزینه ۱ب: صعود جسورانه از شکاف یخی برای غافلگیر کردن موران از ارتفاعات پشت سر",
          descriptionFa: "سنگر موران را تصرف کرده و تفنگ بادی او را مصادره می‌کنید، اما ریزش یخ زمان صعود را طولانی‌تر می‌سازد.",
          pointsDelta: 250,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-2-inversion-hardly-moran",
        titleFa: "توصیف کمین ناگهانی با ساختار وارونگی زمان (Hardly had we scaled)",
        speakerPromptEn: "Describe the sudden sniper ambush using advanced temporal inversion.",
        speakerPromptFa: "کمین ناگهانی تک‌تیرانداز را با ساختار وارونگی زمانی پیشرفته توصیف می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (وارونگی بلاغی Hardly had we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «هنوز به گردنه سنگی نرسیده بودیم که تفنگ خاموش موران سکوت کوهستان را در هم شکست.»",
        targetKeywords: [
          { phrase: "Hardly had we reached", hintFa: "(هنوز نرسیده بودیم به...)", synonyms: ["hardly had we reached", "scarcely had we reached", "hardly had we scaled"], weight: 50 },
          { phrase: "shattered the mountain stillness", hintFa: "(سکوت کوهستان را در هم شکست)", synonyms: ["shattered the mountain stillness", "shattered the mountain tranquility", "broke the mountain silence"], weight: 50 },
        ],
        idealVoiceResponseEn: "Hardly had we reached the rocky ridge when Moran's silent rifle shattered the mountain stillness above us.",
        alternativeResponsesEn: [
          { phraseEn: "Scarcely had we stepped onto the mountain ridge when Moran's sniper rifle broke the silence.", translationFa: "هنوز قدم روی تیغه کوه نگذاشته بودیم که تفنگ تک‌تیرانداز موران سکوت را در هم شکست." },
          { phraseEn: "Hardly had we navigated the narrow ledge when Moran's silenced bullet struck the granite.", translationFa: "هنوز از لبه باریک عبور نکرده بودیم که گلوله خاموش موران به سنگ خارا اصابت کرد." },
        ],
        whiteHintFa: "از ساختار شیک و اصیل وارونگی زمانی Hardly had we + p.p. ... when استفاده کن!",
        fallbackChoices: [
          "Hardly had we reached the rocky ridge when Moran's silent rifle shattered the mountain stillness above us.",
          "The glacier water rushing through the gorge sounds deafening from this vantage point.",
          "I suggest we inspect the steel crampons before climbing further into the snow.",
        ],
        aefReference: "Cambridge C2 Proficiency (Advanced temporal inversion: Hardly had we... when)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "A masterstroke, Holmes! The flare blinded his scope, allowing us to dash across the ledge!",
          textFa: "شاهکاری بود هلمز! منور لنز تفنگش را کور کرد و به ما اجازه داد از روی صخره بدویم!",
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
    titleFa: "پیامد تصمیم اول: کور شدن تک‌تیرانداز یا غافلگیری از ارتفاعات",
    titleEn: "Stage 3: Aftermath of Decision 1 — Quiet Ascent or Mountain Avalanche",
    locationFa: "ورودی باریکه معلق مشرف به دره خروشان مایرینگن",
    locationEn: "Mist-Veiled Chasm Entry, Reichenbach Ravine",
    storyIntroFa: "پیامد تصمیم اول رقم می‌خورد: در صورتی که منور فسفری را شلیک کرده باشید، موران با چشمان سوخته اسلحه سنگینش را رها کرده و شما بدون تلفات از گردنه گذشته‌اید؛ و اگر از شکاف یخی صعود کرده باشید، غار او را تسخیر کرده‌اید اما صدای ریزش یخ‌های خردشده در دره طنین انداخته است.",
    cutscene: {
      titleFa: "شاخه ۱الف: کپسول فسفری، کور شدن موران و عبور ایمن",
      titleEn: "Moran Disoriented & The Secure Mountain Traversal",
      imageSrc: "/images/skills/speaking/c2_scene_3_chasm_approach.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Moran is neutralized for now, Holmes! But look ahead: the swaying suspension bridge is rigged with dynamite!",
          textFa: "موران فعلاً خلع سلاح شد هلمز! اما جلو را ببین: پل معلق لرزان با دینامیت سیم‌کشی شده است!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The bridge spans the solitary crossing to Reichenbach Falls. We must disarm the clockwork fuses immediately!",
          textFa: "این پل تنها معبر عبور به آبشار رایشنباخ است. باید فوراً فتیله‌های ساعتی را خنثی کنیم!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-1a",
        titleFa: "شاخه ۱الف: کپسول فسفری و عبور سریع بدون تلفات زمانی",
        titleEn: "Branch 1A: Phosphorus Flare & Flawless Rapid Advance",
        storyIntroFa: "دید اپتیکال موران کاملاً سوخت و او برای نجات چشمانش در غار عقب نشست. شما و واتسون با تمام توان بدون از دست دادن ثانیه‌ای به سمت پل کابلی پیشروی کردید.",
        cutscene: {
          titleFa: "عبور در سایه دود فسفر به سوی پل کابلی معلق",
          titleEn: "Dashing Across Under the Phosphorus Veil",
          imageSrc: "/images/skills/speaking/c2_scene_3a_flare_advance.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Moran's sniper fire is silenced! We hold the temporal advantage as we reach the chasm!",
              textFa: "تیراندازی موران خاموش شد! با رسیدن به ژرف‌دره، برتری زمانی در دستان ماست!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The timer on the central cable is ticking down! Only five minutes remain, Holmes!",
              textFa: "تایمر روی کابل اصلی در حال تیک‌تاک است! تنها پنج دقیقه باقی مانده هلمز!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-3-subjunctive-moran-command",
            titleFa: "استنتاج استادی با شرطی فرضی التزامی (Were someone to control)",
            speakerPromptEn: "Frame Moran's strategic threat using an eloquent hypothetical conditional.",
            speakerPromptFa: "تهدید راهبردی موران را با یک شرطی فرضی التزامی فاخر بیان می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (شرطی التزامی Were Sebastian Moran to control)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «اگر سباستین موران این دره را بدون چالش در کنترل می‌گرفت، هیچ‌کس نمی‌توانست زنده از این پرتگاه یخی عبور کند.»",
            targetKeywords: [
              { phrase: "Were Sebastian Moran to control", hintFa: "(اگر سباستین موران در کنترل می‌گرفت)", synonyms: ["were sebastian moran to control", "were moran to control", "had moran controlled"], weight: 50 },
              { phrase: "cross this icy precipice", hintFa: "(عبور از این پرتگاه یخی)", synonyms: ["cross this icy precipice", "traverse this icy precipice", "survive this icy chasm"], weight: 50 },
            ],
            idealVoiceResponseEn: "Were Sebastian Moran to control this gorge unchallenged, no one could cross this icy precipice alive.",
            alternativeResponsesEn: [
              { phraseEn: "Were Moran permitted to dominate this pass, our expedition would have perished upon these rocks.", translationFa: "اگر به موران اجازه تسلط بر این گردنه داده می‌شد، هیئت ما روی این صخره‌ها هلاک شده بود." },
              { phraseEn: "Had Moran held this chasm uncontested, crossing to the falls would have been impossible.", translationFa: "اگر موران این دره را بی‌رقیب در اختیار داشت، عبور به سمت آبشار غیرممکن می‌شد." },
            ],
            whiteHintFa: "از ساختار شرطی فرضی التزامی Were + subject + to-infinitive برای شیوایی سخن استفاده کن!",
            fallbackChoices: [
              "Were Sebastian Moran to control this gorge unchallenged, no one could cross this icy precipice alive.",
              "The wooden planks of this suspension bridge creak ominously in the wind.",
              "I can smell the pungent sulfur of the dynamite fuses ahead.",
            ],
            aefReference: "Cambridge C2 Proficiency (Hypothetical subjunctive inversion: Were + subject + to verb)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let us inspect the dynamite wiring immediately before the clockwork gears lock!",
              textFa: "بیا فوراً سیم‌کشی دینامیت را پیش از قفل شدن چرخ‌دنده‌ها بررسی کنیم!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-1b",
        titleFa: "شاخه ۱ب: تسخیر شکاف یخی و مصادره تفنگ بادی موران",
        titleEn: "Branch 1B: Moran's Weapon Seized & The Frozen Ridge Clamber",
        storyIntroFa: "شما از شکاف یخی صعود کردید و تفنگ بادی موران را شکستید. موران با طناب به قعر دره گریخت، اما خستگی عضلانی و ریزش سنگ‌ها چند دقیقه وقت شما را گرفت.",
        cutscene: {
          titleFa: "تفنگ بادی خردشده روی صخره‌های یخ‌بسته",
          titleEn: "Moran's Smashed Rifle on the Ledge",
          imageSrc: "/images/skills/speaking/c2_scene_3b_broken_rifle.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "His lethal weapon is shattered, but the climb has cost us precious minutes!",
              textFa: "سلاح مرگبارش خرد شد، اما صعود دقایق گرانبهایی از ما گرفت!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Look across the gorge! The detonator timer on the suspension bridge is nearly exhausted!",
              textFa: "آن‌سوی ژرف‌دره را نگاه کن! زمان‌سنج چاشنی روی پل معلق رو به اتمام است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-3-mixed-conditional-flare",
            titleFa: "تحلیل راهبردی گزینه‌ها با شرطی ترکیبی فصیح (Mixed Conditional)",
            speakerPromptEn: "Analyze the tactical delay of the rock climb using an articulate mixed conditional.",
            speakerPromptFa: "تأخیر ناشی از صعود سنگی را با یک شرطی ترکیبی فصیح و استدلالی تحلیل می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی Had we used the flare)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «اگر از منور شیمیایی علیه موران استفاده کرده بودیم، اکنون روی این لبه صخره‌ای معطل نمی‌ماندیم.»",
            targetKeywords: [
              { phrase: "Had we used the chemical flare", hintFa: "(اگر از منور شیمیایی استفاده کرده بودیم)", synonyms: ["had we used the chemical flare", "if we had fired the flare", "had we deployed the flare"], weight: 50 },
              { phrase: "stranded upon this ledge", hintFa: "(معطل و زمین‌گیر روی این لبه صخره)", synonyms: ["stranded upon this ledge", "delayed upon this ledge", "held up upon this ridge"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we used the chemical flare against Moran, we would not now be stranded upon this ledge.",
            alternativeResponsesEn: [
              { phraseEn: "If we had blinded the sniper immediately, we wouldn't be racing against the clock right now.", translationFa: "اگر تک‌تیرانداز را فوراً کور کرده بودیم، هم‌اکنون با ساعت مسابقه نمی‌دادیم." },
              { phraseEn: "Had we chosen the flare, we would already be safely across the suspension bridge.", translationFa: "اگر منور را برگزیده بودیم، تا الان به سلامت از پل معلق گذشته بودیم." },
            ],
            whiteHintFa: "از ساختار شرطی ترکیبی معکوس Had we + p.p. ... would not now be ... استفاده کن!",
            fallbackChoices: [
              "Had we used the chemical flare against Moran, we would not now be stranded upon this ledge.",
              "The steel crampons bite firmly into the blue glacial ice.",
              "Far below, the churning foam of the river looks like boiling milk.",
            ],
            aefReference: "Cambridge C2 Proficiency (Mixed conditional inversion: Had we + p.p. ... would now be)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let us sprint across the abyss, Holmes! Every second is worth a kingdom!",
              textFa: "بیا از روی مغاک بدویم هلمز! هر ثانیه‌اش به اندازه یک پادشاهی می‌ارزد!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-3-default-fallback",
        titleFa: "استنتاج استادی با شرطی فرضی التزامی (Were someone to control)",
        speakerPromptEn: "Frame Moran's strategic threat using an eloquent hypothetical conditional.",
        speakerPromptFa: "تهدید راهبردی موران را با یک شرطی فرضی التزامی فاخر بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (شرطی التزامی Were Sebastian Moran to control)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «اگر سباستین موران این دره را بدون چالش در کنترل می‌گرفت، هیچ‌کس نمی‌توانست زنده از این پرتگاه یخی عبور کند.»",
        targetKeywords: [
          { phrase: "Were Sebastian Moran to control", hintFa: "(اگر سباستین موران در کنترل می‌گرفت)", synonyms: ["were sebastian moran to control", "were moran to control", "had moran controlled"], weight: 50 },
          { phrase: "cross this icy precipice", hintFa: "(عبور از این پرتگاه یخی)", synonyms: ["cross this icy precipice", "traverse this icy precipice", "survive this icy chasm"], weight: 50 },
        ],
        idealVoiceResponseEn: "Were Sebastian Moran to control this gorge unchallenged, no one could cross this icy precipice alive.",
        alternativeResponsesEn: [
          { phraseEn: "Were Moran permitted to dominate this pass, our expedition would have perished upon these rocks.", translationFa: "اگر به موران اجازه تسلط بر این گردنه داده می‌شد، هیئت ما روی این صخره‌ها هلاک شده بود." },
          { phraseEn: "Had Moran held this chasm uncontested, crossing to the falls would have been impossible.", translationFa: "اگر موران این دره را بی‌رقیب در اختیار داشت، عبور به سمت آبشار غیرممکن می‌شد." },
        ],
        whiteHintFa: "از ساختار شرطی فرضی التزامی Were + subject + to-infinitive برای شیوایی سخن استفاده کن!",
        fallbackChoices: [
          "Were Sebastian Moran to control this gorge unchallenged, no one could cross this icy precipice alive.",
          "The wooden planks of this suspension bridge creak ominously in the wind.",
          "I can smell the pungent sulfur of the dynamite fuses ahead.",
        ],
        aefReference: "Cambridge C2 Proficiency (Hypothetical subjunctive inversion: Were + subject + to verb)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Let us inspect the dynamite wiring immediately before the clockwork gears lock!",
          textFa: "بیا فوراً سیم‌کشی دینامیت را پیش از قفل شدن چرخ‌دنده‌ها بررسی کنیم!",
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
    titleFa: "پل معلق کابلی و تله دینامیت ساعتی در میانه باد آلپ",
    titleEn: "Stage 4: The Swaying Cable Suspension Bridge & The Clockwork Detonator",
    locationFa: "میانه پل معلق کابلی لرزان در ارتفاع ۱۵۰ متری آبشار خروشان رایشنباخ",
    locationEn: "The Swaying Wooden Suspension Bridge, Above Reichenbach Gorge",
    storyIntroFa: "پل معلق باریک چوبی بر فراز گرداب سفید و غران آبشار رایشنباخ در باد سهمگین می‌لرزد. در میانه پل، هشت لوله دینامیت سنگین با کابل‌های فولادی به تیرک‌های پل متصل شده است. یک مکانیزم ساعت‌ساز برنجی ساخت زوریخ با فنر فشرده در حال شمارش معکوس است: ۱۲۰ ثانیه تا انفجار! اگر پل منهدم شود، تنها معبر زمینی به غار مخفی موریارتی در پشت آبشار برای همیشه نابود خواهد شد.",
    cutscene: {
      titleFa: "دینامیت سیم‌کشی‌شده در میانه پل معلق لرزان",
      titleEn: "Dynamite Rigged Upon the Chasm Suspension Bridge",
      imageSrc: "/images/skills/speaking/c2_scene_4_bridge_dynamite.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "Look at the twin wires leading into the clockwork ratchet: copper and silver alloyed together!",
          textFa: "به دو سیم منتهی به ضامن ساعت نگاه کن: آلیاژ مس و نقره که به هم متصل شده‌اند!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The wind is threatening to flip the planks under our feet! We have barely ninety seconds, Holmes!",
          textFa: "باد تهدید می‌کند که تخته‌های زیر پایمان را واژگون سازد! به سختی نود ثانیه فرصت داریم هلمز!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-4-cleft-suspension-bridge",
        titleFa: "تبیین اهمیت حیاتی پل با جمله شکافته تأکیدی (It is this bridge that)",
        speakerPromptEn: "Define the strategic vitality of the fragile suspension bridge using an emphatic cleft sentence.",
        speakerPromptFa: "اهمیت استراتژیک پل معلق شکننده را با یک جمله شکافته تأکیدی تبیین می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته It is this fragile bridge)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «همین پل معلق شکننده است که تنها خط ارتباطی و نجات ما را در این ژرف‌دره خطرناک کوهستانی تشکیل می‌دهد.»",
        targetKeywords: [
          { phrase: "fragile suspension bridge", hintFa: "(پل معلق شکننده)", synonyms: ["fragile suspension bridge", "this suspension bridge", "fragile cable bridge"], weight: 50 },
          { phrase: "sole lifeline across the chasm", hintFa: "(تنها خط ارتباطی بر فراز ژرف‌دره)", synonyms: ["sole lifeline across the chasm", "sole lifeline across this chasm", "only lifeline across the chasm"], weight: 50 },
        ],
        idealVoiceResponseEn: "It is this fragile suspension bridge that forms our sole lifeline across this treacherous mountain chasm.",
        alternativeResponsesEn: [
          { phraseEn: "It is precisely this bridge that stands between our mission and catastrophic failure.", translationFa: "دقیقاً همین پل است که میان مأموریت ما و شکستی فاجعه‌بار قرار گرفته است." },
          { phraseEn: "What maintains our connection to the falls is this solitary, fragile cable bridge.", translationFa: "آنچه ارتباط ما با آبشار را حفظ می‌کند همین پل کابلی شکننده و یگانه است." },
        ],
        whiteHintFa: "از ساختار شکافته تأکیدی It is this fragile suspension bridge that forms... استفاده کن!",
        fallbackChoices: [
          "It is this fragile suspension bridge that forms our sole lifeline across this treacherous mountain chasm.",
          "The icy spray of the Reichenbach torrent coats every cable in slippery glaze.",
          "My pocket barometer indicates that atmospheric pressure is dropping sharply.",
        ],
        aefReference: "Cambridge C2 Proficiency (Emphatic cleft structures: It is [noun phrase] that...)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Which wire do we sever, Holmes? The copper ignition strand or the silver ground wire?",
          textFa: "کدام سیم را ببریم هلمز؟ رشته آتش‌زن مسی یا سیم زمین نقره‌ای؟",
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
    titleFa: "تصمیم دوم: خنثی‌سازی چاشنی پل یا پرش شجاعانه به صخره روبه‌رو",
    titleEn: "DECISION 2: The Severed Cables & The Sabotaged Chasm Bridge",
    locationFa: "پرتگاه میانه پل معلق چوبی، تکان‌های شدید در طوفان برف",
    locationEn: "Mid-Span Abyss, Swaying Suspension Bridge, Reichenbach",
    storyIntroFa: "تایمر چرخ‌دنده‌ای روی ثانیه ۰۰:۴۵ به سرعت پایین می‌رود. باد زوزه می‌کشد و بندهای چرمی پل یکی پس از دیگری پاره می‌شوند. سیم مسی مستقیماً به چاشنی ضربه‌ای متصل است، در حالی که سیم نقره‌ای ولتاژ باتری اولیه را تأمین می‌کند. اما اگر سیم را اشتباه قطع کنید، بمب فوراً منفجر خواهد شد. در سمت دیگر پل، صخره‌ای مرطوب در فاصله سه متری قرار دارد که با یک پرش شجاعانه می‌توان به آن رسید و از انفجار فرار کرد، اما پل منهدم شده و بازگشت ناممکن می‌گردد.",
    cutscene: {
      titleFa: "خنثی‌سازی سیم‌های دینامیت در باد سهمگین ژرف‌دره",
      titleEn: "Defusing the Dynamite Fuses Above the Abyss",
      imageSrc: "/images/skills/speaking/c2_scene_5_defusing_bridge.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با انبردست جراحی",
          speakerAvatar: "🩺",
          textEn: "Thirty seconds on the chronometer! Do we cut the silver wire or leap for the rocky shelf?",
          textFa: "سی ثانیه روی زمان‌سنج مانده! سیم نقره‌ای را ببریم یا به سمت لبه صخره بپریم؟",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The silver strand feeds the primary coil. Cut the silver wire and ground the charge with my cane!",
          textFa: "رشته نقره‌ای مدار اولیه را تغذیه می‌کند. سیم نقره‌ای را قطع کن و جریان را با عصایم به زمین وصل کن!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-2",
      promptFa: "تصمیم پرمخاطره دوم: آیا سیم نقره‌ای مکانیزم را در میانه باد قطع می‌کنید، یا با واتسون به صخره روبه‌رو می‌پرید؟",
      promptEn: "Decision 2: Sever the silver alloy wire to preserve the bridge or leap across to the opposing ledge?",
      choices: [
        {
          id: "choice-2a",
          labelEn: "Choice 2A: Sever the silver wire and ground the circuit with your steel-tipped walking stick",
          labelFa: "گزینه ۲الف: قطع دقیق سیم نقره‌ای و تخلیه بار الکتریکی با عصای فولادی جهت حفظ پل",
          descriptionFa: "دینامیت خنثی شده و پل معلق کاملاً پابرجا می‌ماند؛ این اقدام مسیر عقب‌نشینی امن شما را حفظ می‌کند.",
          pointsDelta: 400,
        },
        {
          id: "choice-2b",
          labelEn: "Choice 2B: Vault together across the three-meter chasm to the wet granite ledge",
          labelFa: "گزینه ۲ب: پرش شجاعانه سه متری بر فراز ژرف‌دره به سمت سکوی گرانیتی روبه‌رو",
          descriptionFa: "جان سالم به در می‌برید، اما پل پشت سرتان با انفجار مهیبی خرد شده و راه بازگشت مسدود می‌گردد.",
          pointsDelta: 300,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-5-inversion-under-no-circumstances",
        titleFa: "صدور فرمان قاطع ایمنی با وارونگی ممنوعیت کامل (Under no circumstances must we)",
        speakerPromptEn: "Issue an imperative command using negative inversion to safeguard the vital bridge lifeline.",
        speakerPromptFa: "دستوری قاطع با وارونگی منفی برای پاسداری از این شریان حیاتی کوهستان صادر می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (وارونگی قاطع Under no circumstances must we)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به واتسون بگو: «تحت هیچ شرایطی نباید اجازه دهیم این پل حیاتی پیش از رسیدن به غار نابود شود.»",
        targetKeywords: [
          { phrase: "Under no circumstances must we", hintFa: "(تحت هیچ شرایطی نباید...)", synonyms: ["under no circumstances must we", "under no circumstances should we", "on no account must we"], weight: 50 },
          { phrase: "permit this bridge to be destroyed", hintFa: "(اجازه دهیم این پل نابود شود)", synonyms: ["permit this bridge to be destroyed", "allow this bridge to be destroyed", "permit this lifeline to be severed"], weight: 50 },
        ],
        idealVoiceResponseEn: "Under no circumstances must we permit this vital bridge to be destroyed before reaching the cave.",
        alternativeResponsesEn: [
          { phraseEn: "On no account must we allow this mountain crossing to be severed while our mission hangs in the balance.", translationFa: "به هیچ وجه نباید بگذاریم این گذرگاه کوهستانی در حالی که مأموریتمان در خطر است قطع شود." },
          { phraseEn: "Under no circumstances can we afford to lose our only retreat route across this chasm.", translationFa: "تحت هیچ شرایطی نمی‌توانیم از دست دادن تنها مسیر بازگشتمان بر فراز این ژرف‌دره را تاب بیاوریم." },
        ],
        whiteHintFa: "از ساختار رسمی و مقتدرانه Under no circumstances must we permit... استفاده کن!",
        fallbackChoices: [
          "Under no circumstances must we permit this vital bridge to be destroyed before reaching the cave.",
          "The steel wires of this bridge are anchored deep into the Alpine granite.",
          "The deafening roar of the waterfall vibrates through my chest with every step.",
        ],
        aefReference: "Cambridge C2 Proficiency (Negative rhetorical inversion: Under no circumstances / On no account)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "SNIP! The silver wire is cut! The ratchet has frozen at zero-three seconds! The bridge stands!",
          textFa: "تق! سیم نقره‌ای بریده شد! ضامن در ثانیه ۰۰:۰۳ متوقف شد! پل پابرجا ماند!",
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
    titleFa: "پیامد تصمیم دوم: حفظ شریان کوهستان یا انزوای مطلق در پشت آبشار",
    titleEn: "Stage 6: Aftermath of Decision 2 — Mountain Lifeline Secured or Total Isolation",
    locationFa: "ورودی تاریک غار یخی در پشت پرده آبشار جوشان رایشنباخ",
    locationEn: "The Cavern Mouth, Behind the Roaring Curtain of Reichenbach",
    storyIntroFa: "پیامد انتخاب دوم رقم می‌خورد: اگر سیم نقره‌ای را مهار کرده باشید، پل معلق استوار باقی مانده و مسیر عقب‌نشینی امن است؛ و اگر پرش کرده باشید، پل با غرش انفجار چوب و کابل به قعر گرداب سقوط کرده و شما در انزوای کامل با موریارتی در دهانه غار محبوس شده‌اید.",
    cutscene: {
      titleFa: "شاخه ۲الف: پل پابرجا و پیشروی مطمئن با پشتیبانی امداد",
      titleEn: "The Secured Bridge & Breaching the Ice Cavern",
      imageSrc: "/images/skills/speaking/c2_scene_6_ice_cavern_entry.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The bridge is intact, Watson! We have secured our retreat and cornered Moriarty in his final redoubt!",
          textFa: "پل دست‌نخورده ماند واتسون! مسیر بازگشت را ایمن کردیم و موریارتی را در دژ نهایی‌اش گیر انداختیم!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "Look into the cavern depths! A lantern is burning beside a stone table covered in red wax!",
          textFa: "به اعماق غار نگاه کن! فانوسی در کنار میز سنگی پوشیده از موم سرخ روشن است!",
          bubblePosition: "right",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-2a",
        titleFa: "شاخه ۲الف: پل پابرجا و پیشروی مقتدرانه به سوی گاوصندوق سرخ",
        titleEn: "Branch 2A: The Intact Bridge & Tactical High Ground",
        storyIntroFa: "خنثی‌سازی دقیق سیم نقره‌ای پل را نجات داد. شما با اطمینان خاطر از مسیر بازگشت، به دهانه غار یخی نفوذ کردید؛ جایی که پرونده سرخ بر روی میز سنگی می‌درخشد.",
        cutscene: {
          titleFa: "ورود مقتدرانه به غار یخی پشت آبشار",
          titleEn: "Advancing Confidently Into the Ice Vault",
          imageSrc: "/images/skills/speaking/c2_scene_6a_intact_advance.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Our exit is guaranteed. Now we recover the Red Folder and dismantle this syndicate forever!",
              textFa: "خروج ما تضمین شده است. اکنون پرونده سرخ را بازمی‌ستانیم و این شبکه را برای همیشه متلاشی می‌کنیم!",
              bubblePosition: "left",
            },
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Step carefully, Holmes; the cavern floor is coated with slick mountain ice!",
              textFa: "با احتیاط قدم بردار هلمز؛ کف غار با یخ لغزنده کوهستانی پوشیده شده است!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-6-participle-bridge-secured",
            titleFa: "بیان دستاورد حفظ مسیر با عبارت وجهی مرکب (Participle Clause: Having secured)",
            speakerPromptEn: "Affirm the tactical triumph of preserving the suspension bridge using a sophisticated participle clause.",
            speakerPromptFa: "پیروزی تاکتیکی در حفظ پل معلق را با عبارت وجهی مرکب فاخر بیان می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (ساختار وجهی Having secured)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «با نجات دادن این پل معلق لرزان، ما تنها مسیر بازگشت امن خود را بر فراز پرتگاه حفظ کردیم.»",
            targetKeywords: [
              { phrase: "Having secured the swaying bridge", hintFa: "(با نجات دادن پل لرزان)", synonyms: ["having secured the swaying bridge", "having secured the suspension bridge", "having preserved the bridge"], weight: 50 },
              { phrase: "safe route of retreat", hintFa: "(مسیر بازگشت امن)", synonyms: ["safe route of retreat", "secure avenue of retreat", "safe path of retreat"], weight: 50 },
            ],
            idealVoiceResponseEn: "Having secured the swaying suspension bridge, we preserved our only safe route of retreat across the abyss.",
            alternativeResponsesEn: [
              { phraseEn: "Having disarmed the explosive chasm bridge, we guaranteed our survival and tactical dominance tonight.", translationFa: "با خنثی‌سازی پل معلق انفجاری، امشب بقا و برتری تاکتیکی خود را تضمین کردیم." },
              { phraseEn: "By securing this solitary lifeline, we ensured our expedition would not be stranded upon these rocks.", translationFa: "با ایمن ساختن این شریان یگانه، اطمینان حاصل کردیم که هیئت ما روی این صخره‌ها زمین‌گیر نخواهد شد." },
            ],
            whiteHintFa: "از ساختار وجهی عالی‌رتبه Having secured the swaying suspension bridge, we preserved... استفاده کن!",
            fallbackChoices: [
              "Having secured the swaying suspension bridge, we preserved our only safe route of retreat across the abyss.",
              "The subterranean stream feeding the falls rushes beneath our boots.",
              "I detect the sharp chemical odor of nitroglycerin echoing from the cavern depths.",
            ],
            aefReference: "Cambridge C2 Proficiency (Participle clauses expressing cause and consequence: Having + past participle)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "There it is! The Red Folder rests upon the stone plinth, surrounded by chemical flasks!",
              textFa: "آن‌جاست! پرونده سرخ روی سکوی سنگی قرار دارد و فلاسک‌های شیمیایی احاطه‌اش کرده‌اند!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-2b",
        titleFa: "شاخه ۲ب: نابودی پل در انفجار و انزوای مطلق در غار پشت آبشار",
        titleEn: "Branch 2B: The Bridge Destroyed & Isolated Behind the Chasm",
        storyIntroFa: "با پرش شما، کابل‌ها با صدای مهیبی پاره شده و پل در دود و خاکستر به قعر آبشار سقوط کرد. شما در غار منزوی شدید و دیگر هیچ راه بازگشتی جز شکست دادن رودرروی موریارتی وجود ندارد.",
        cutscene: {
          titleFa: "سقوط تکه‌های چوب پل در آبشار خروشان",
          titleEn: "The Shattered Bridge Swallowed by the Abyss",
          imageSrc: "/images/skills/speaking/c2_scene_6b_shattered_chasm.jpg",
          dialogues: [
            {
              speakerId: "watson",
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "The bridge is gone, Holmes! We are utterly isolated on this narrow precipice!",
              textFa: "پل نابود شد هلمز! ما کاملاً روی این باریکه صخره‌ای منزوی شده‌ایم!",
              bubblePosition: "left",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Then fate has stripped away all retreat. We advance into the vault and finish this duel!",
              textFa: "پس تقدیر هرگونه بازگشتی را سلب کرده است. به داخل گاوصندوق پیش می‌رویم و این دوئل را تمام می‌کنیم!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-6-mixed-conditional-bridge",
            titleFa: "تحلیل انزوای تاکتیکی با شرطی ترکیبی فصیح (Mixed Conditional)",
            speakerPromptEn: "Analyze the total isolation caused by the bridge's destruction using a mixed conditional.",
            speakerPromptFa: "انزوای مطلق ناشی از نابودی پل را با شرطی ترکیبی بیان می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی Had we defused the clockwork)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به دکتر واتسون بگو: «اگر مکانیزم ساعتی را سر وقت خنثی کرده بودیم، مسیر بازگشتمان بر فراز ژرف‌دره کاملاً امن باقی می‌ماند.»",
            targetKeywords: [
              { phrase: "Had we defused the clockwork", hintFa: "(اگر مکانیزم ساعتی را خنثی کرده بودیم)", synonyms: ["had we defused the clockwork", "if we had defused the clockwork", "had we neutralized the bomb"], weight: 50 },
              { phrase: "retreat across the abyss", hintFa: "(مسیر بازگشت بر فراز ژرف‌دره)", synonyms: ["retreat across the abyss", "escape route across the abyss", "route across the chasm"], weight: 50 },
            ],
            idealVoiceResponseEn: "Had we defused the explosive clockwork in time, our retreat across the abyss would remain completely safe.",
            alternativeResponsesEn: [
              { phraseEn: "If we had preserved the bridge, we wouldn't be trapped upon this isolated precipice right now.", translationFa: "اگر پل را حفظ کرده بودیم، هم‌اکنون روی این پرتگاه منزوی به دام نمی‌افتادیم." },
              { phraseEn: "Had we cut the wires safely, our retreat route would be secure instead of ruined.", translationFa: "اگر سیم‌ها را با ایمنی بریده بودیم، مسیر بازگشتمان به جای نابودی کاملاً امن می‌بود." },
            ],
            whiteHintFa: "از ساختار شرطی ترکیبی معکوس Had we defused... our retreat would remain... استفاده کن!",
            fallbackChoices: [
              "Had we defused the explosive clockwork in time, our retreat across the abyss would remain completely safe.",
              "The cold drafts inside this cavern cut like surgical razors.",
              "A single oil lantern flickers in the distant chamber of the cave.",
            ],
            aefReference: "Cambridge C2 Proficiency (Mixed conditionals in formal discourse)",
            npcResponse: {
              speakerNameFa: "دکتر جان واتسون",
              speakerRoleFa: "پزشک همراه",
              speakerAvatar: "🩺",
              textEn: "Let us draw our revolvers, Holmes! Moriarty cannot be far from this stone altar!",
              textFa: "تپانچه‌هایمان را بکشیم هلمز! موریارتی نمی‌تواند از این محراب سنگی دور باشد!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-6-default-fallback",
        titleFa: "بیان دستاورد حفظ مسیر با عبارت وجهی مرکب (Participle Clause: Having secured)",
        speakerPromptEn: "Affirm the tactical triumph of preserving the suspension bridge using a sophisticated participle clause.",
        speakerPromptFa: "پیروزی تاکتیکی در حفظ پل معلق را با عبارت وجهی مرکب فاخر بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (ساختار وجهی Having secured)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «با نجات دادن این پل معلق لرزان، ما تنها مسیر بازگشت امن خود را بر فراز پرتگاه حفظ کردیم.»",
        targetKeywords: [
          { phrase: "Having secured the swaying bridge", hintFa: "(با نجات دادن پل لرزان)", synonyms: ["having secured the swaying bridge", "having secured the suspension bridge", "having preserved the bridge"], weight: 50 },
          { phrase: "safe route of retreat", hintFa: "(مسیر بازگشت امن)", synonyms: ["safe route of retreat", "secure avenue of retreat", "safe path of retreat"], weight: 50 },
        ],
        idealVoiceResponseEn: "Having secured the swaying suspension bridge, we preserved our only safe route of retreat across the abyss.",
        alternativeResponsesEn: [
          { phraseEn: "Having disarmed the explosive chasm bridge, we guaranteed our survival and tactical dominance tonight.", translationFa: "با خنثی‌سازی پل معلق انفجاری، امشب بقا و برتری تاکتیکی خود را تضمین کردیم." },
          { phraseEn: "By securing this solitary lifeline, we ensured our expedition would not be stranded upon these rocks.", translationFa: "با ایمن ساختن این شریان یگانه، اطمینان حاصل کردیم که هیئت ما روی این صخره‌ها زمین‌گیر نخواهد شد." },
        ],
        whiteHintFa: "از ساختار وجهی عالی‌رتبه Having secured the swaying suspension bridge, we preserved... استفاده کن!",
        fallbackChoices: [
          "Having secured the swaying suspension bridge, we preserved our only safe route of retreat across the abyss.",
          "The subterranean stream feeding the falls rushes beneath our boots.",
          "I detect the sharp chemical odor of nitroglycerin echoing from the cavern depths.",
        ],
        aefReference: "Cambridge C2 Proficiency (Participle clauses expressing cause and consequence)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "There it is! The Red Folder rests upon the stone plinth, surrounded by chemical flasks!",
          textFa: "آن‌جاست! پرونده سرخ روی سکوی سنگی قرار دارد و فلاسک‌های شیمیایی احاطه‌اش کرده‌اند!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 7: DECISION 3: The Ice Cavern Behind the Falls & The Red Folder Vault
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "C2",
    titleFa: "تصمیم سوم: دخمه یخی پشت آبشار و تله نیتروگلیسیرین پرونده سرخ",
    titleEn: "DECISION 3: The Ice Cavern Behind the Falls & The Red Folder Vault",
    locationFa: "دخمه یخی طبیعی با قندیل‌های عظیم بلورین در پشت پرده آبشار خروشان رایشنباخ",
    locationEn: "The Subterranean Ice Grotto & Stone Plinth, Reichenbach Falls",
    storyIntroFa: "در دل دخمه یخی پشت غرش کرکننده آبشار، محرابی سنگی برپاست. روی محراب، آخرین پوشه سری یعنی «پرونده سرخ [C2]» که حاوی کدهای رمزنگاری‌شده تسلیحات اتمی اولیه و ساختار شبکه بین‌المللی موریارتی است قرار دارد. اما پرونده درون یک قفس شیشه‌ای قرار گرفته که به فتیله‌ای شیمیایی متصل است؛ فتیله‌ای که با اسید نیتریک در حال سوختن است و تا ۲۰ ثانیه دیگر پوشه را به خاکستر تبدیل می‌کند. در همین لحظه، سایه موریارتی در خروجی باریکه سنگی نمایان می‌شود.",
    cutscene: {
      titleFa: "پرونده سرخ روی میز سنگی و فتیله شعله‌ور نیتروگلیسیرین",
      titleEn: "The Red Folder Upon the Stone Altar Under Chemical Fuse",
      imageSrc: "/images/skills/speaking/c2_scene_7_red_folder_altar.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور",
          speakerAvatar: "🔍",
          textEn: "The Red Folder! The final dossier containing Moriarty's entire global syndicate network!",
          textFa: "پرونده سرخ! آخرین سندی که کل شبکه اتحادیه جهانی موریارتی را در خود دارد!",
          bubblePosition: "left",
        },
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The acid fuse is hissing toward the casing! Ten seconds before the documents incinerate!",
          textFa: "فتیله اسیدی به سمت محفظه در حال هیس‌هیس است! ده ثانیه تا خاکستر شدن اسناد باقی مانده!",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-3",
      promptFa: "تصمیم بحرانی سوم: آیا شیشه اسیدی را با دستکش چرمی خفه می‌کنید تا پرونده سالم بماند، یا فوراً به سمت باریکه پرتگاه می‌دوید تا موریارتی نگریزد؟",
      promptEn: "Decision 3: Smother the nitric acid fuse with your leather gloves or pursue Moriarty out onto the precipice?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Choice 3A: Smother the nitric acid fuse with your reinforced gloves to preserve the Red Folder intact",
          labelFa: "گزینه ۳الف: مهار فتیله اسیدی با دستکش چرمی تقویت‌شده و نجات پرونده سرخ بدون آسیب",
          descriptionFa: "پرونده سرخ را با شجاعت نجات می‌دهید و اسرار چهار پوشه کامل می‌شود، در حالی که موریارتی به لبه صخره رایشنباخ عقب می‌نشیند.",
          pointsDelta: 450,
        },
        {
          id: "choice-3b",
          labelEn: "Choice 3B: Dash past the altar to intercept Moriarty before he reaches the narrow chasm trail",
          labelFa: "گزینه ۳ب: شتاب به سوی خروجی برای بستن راه فرار موریارتی پیش از رسیدن به باریکه پرتگاه",
          descriptionFa: "راه موریارتی را می‌بندید، اما بخشی از صفحات رمزنگاری‌شده پرونده در آتش اسید می‌سوزد.",
          pointsDelta: 300,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-7-mixed-conditional-instantaneously",
        titleFa: "تحلیل پیامد ژئوپلیتیک نجات اسناد با شرطی ترکیبی فصیح (Had I not neutralized)",
        speakerPromptEn: "Articulate the global stakes of securing the Red Folder using an advanced inverted conditional.",
        speakerPromptFa: "اهمیت جهانی نجات پرونده سرخ را با ساختار شرطی معکوس بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (شرطی ترکیبی معکوس Had I not neutralized)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «اگر این چاشنی را بلافاصله خنثی نکرده بودم، تشکیلات موریارتی اکنون شرایط خود را به کل جهان دیکته می‌کرد.»",
        targetKeywords: [
          { phrase: "Had I not neutralized the detonator", hintFa: "(اگر چاشنی را خنثی نکرده بودم)", synonyms: ["had i not neutralized the detonator", "if i had not neutralized the detonator", "had i not disarmed the fuse"], weight: 50 },
          { phrase: "dictate terms to the world", hintFa: "(دیکته کردن شرایط به جهان)", synonyms: ["dictate terms to the world", "dictate terms to every government", "dictate terms globally"], weight: 50 },
        ],
        idealVoiceResponseEn: "Had I not neutralized the detonator immediately, Moriarty's syndicate would currently dictate terms to the entire world.",
        alternativeResponsesEn: [
          { phraseEn: "If we had allowed these files to burn, the criminal syndicate would now hold undisputed power.", translationFa: "اگر اجازه می‌دادیم این پرونده‌ها بسوزند، این شبکه تبهکار اکنون قدرتی بلامنازع در دست داشت." },
          { phraseEn: "Had this master ledger been incinerated, sovereign governments would currently be at Moriarty's mercy.", translationFa: "اگر این دفترچه اصلی خاکستر شده بود، دولت‌های مستقل اکنون زیر دست موریارتی بودند." },
        ],
        whiteHintFa: "از ساختار شرطی ترکیبی معکوس Had I not neutralized... would currently dictate terms... استفاده کن!",
        fallbackChoices: [
          "Had I not neutralized the detonator immediately, Moriarty's syndicate would currently dictate terms to the entire world.",
          "The subterranean river behind the waterfall creates a constant, freezing spray.",
          "The stone walls of this grotto are etched with ancient Swiss mining marks.",
        ],
        aefReference: "Cambridge C2 Proficiency (Advanced mixed conditional: past action with present global consequence)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه",
          speakerAvatar: "🩺",
          textEn: "The Red Folder is secure in your coat! And outside, Moriarty waits on the sheer ledge!",
          textFa: "پرونده سرخ سالم در پالتوی توست! و بیرون، موریارتی روی باریکه پرتگاه منتظر است!",
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
    titleFa: "صعود به لبه پرتگاه عمودی: غرش رایشنباخ و احضاریه فرجامین موریارتی",
    titleEn: "Stage 8: Ascent to the Sheer Precipice & Moriarty's Final Summons",
    locationFa: "باریکه صخره‌ای مرطوب و لغزان در لبه پرتگاه مرگبار آبشار رایشنباخ در ارتفاع ۲۰۰ متری",
    locationEn: "The Sheer Rock Ledge, Overhanging the Reichenbach Abyss",
    storyIntroFa: "شما با پوشه سرخ در جیب، از دهانه غار یخی پا به باریکه صخره‌ای لغزان می‌گذارید؛ باریکه‌ای با عرض کمتر از نیم متر که مستقیماً بر فراز گرداب کف‌آلود و جوشان آبشار معلق است. سقوط از این ارتفاع به معنای خرد شدن بر سنگ‌های گرانیت است. پروفسور جیمز موریارتی با ردا و کلاه سیلندری سیاه در انتهای باریکه ایستاده است. او لبخندی سرد می‌زند و تپانچه‌اش را به داخل ژرف‌دره پرتاب می‌کند: «اسلحه‌ها شایسته مغزهای ما نیستند، شرلوک. این پرونده باید با برتری خالص اراده بسته شود!»",
    cutscene: {
      titleFa: "شاخه ۳الف: پرونده سرخ کاملاً سالم و وقار کارآگاه بر لبه پرتگاه",
      titleEn: "Moriarty Awaits on the Brink of the Roaring Falls",
      imageSrc: "/images/skills/speaking/c2_scene_8_moriarty_standoff.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی تبهکاری قرن در آستانه پرتگاه",
          speakerAvatar: "♟️",
          textEn: "Everything I have to say has already crossed your mind, Sherlock. Our intellectual duel concludes here!",
          textFa: "هر آنچه باید بگویم قبلاً از ذهن تو گذشته است شرلوک. دوئل فکری ما در این نقطه به پایان می‌رسد!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور بر لبه صخره",
          speakerAvatar: "🔍",
          textEn: "Your four folders are recovered, Professor. London is secure, and your syndicate is dismantled!",
          textFa: "چهار پوشه تو بازپس‌گرفته شدند پروفسور. لندن ایمن است و شبکه‌ات متلاشی شد!",
          bubblePosition: "left",
        },
      ],
    },
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "شاخه ۳الف: پرونده سرخ دست‌نخورده و تسلط اخلاقی در لبه آبشار",
        titleEn: "Branch 3A: Red Folder Preserved & Moral Dominance on the Precipice",
        storyIntroFa: "شما پرونده سرخ را بدون کوچک‌ترین آسیبی نجات دادید. با در دست داشتن تمام چهار سند محرمانه MI6، به موریارتی ثابت کردید که هوش کارآگاهی بر تمام تله‌های جنایتکارانه او چیره شده است.",
        cutscene: {
          titleFa: "پرونده سرخ در دست هلمز در برابر چشمان مبهوت موریارتی",
          titleEn: "Displaying the Pristine Red Folder to Moriarty",
          imageSrc: "/images/skills/speaking/c2_scene_8a_folder_display.jpg",
          dialogues: [
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Behold the Red Folder, James. Not a single page of your cipher network was lost to the flame!",
              textFa: "پرونده سرخ را ببین جیمز. حتی یک برگه از شبکه رمزگذاری‌ات طعمه شعله نشد!",
              bubblePosition: "left",
            },
            {
              speakerId: "moriarty",
              speakerNameFa: "پروفسور جیمز موریارتی",
              speakerRoleFa: "نابغه‌ی تبهکاری",
              speakerAvatar: "♟️",
              textEn: "Fascinating... Yet only one of us will walk away from this precipice to deliver it!",
              textFa: "شگفت‌انگیز است... اما تنها یکی از ما از این باریکه صخره‌ای زنده برمی‌گردد تا آن را تحویل دهد!",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-8-pseudo-cleft-torrent",
            titleFa: "اعلام حتمیت سرنوشت با جمله شکافته تأکیدی (What remains undeniable is that)",
            speakerPromptEn: "Declare the inevitable resolution of this existential duel beside the roaring cataract.",
            speakerPromptFa: "حتمیت فرجامین این دوئل اگزیستانسیال در کنار غرش آبشار را با جمله شکافته اعلام می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (جمله شکافته What remains undeniable)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به موریارتی بگو: «آنچه در کنار این آبشار خروشان انکارناپذیر است این است که تنها یکی از ما زنده از اینجا بازخواهد گشت.»",
            targetKeywords: [
              { phrase: "What remains undeniable beside", hintFa: "(آنچه انکارناپذیر است در کنار...)", synonyms: ["what remains undeniable beside", "what remains indisputable beside", "what is undeniable beside"], weight: 50 },
              { phrase: "only one of us will walk away", hintFa: "(تنها یکی از ما زنده بازخواهد گشت)", synonyms: ["only one of us will walk away", "only one of us shall walk away", "one of us will survive"], weight: 50 },
            ],
            idealVoiceResponseEn: "What remains undeniable beside this roaring waterfall is that only one of us will walk away alive.",
            alternativeResponsesEn: [
              { phraseEn: "What is beyond dispute in this misty gorge is that our final reckoning admits no mutual survival.", translationFa: "آنچه در این دره مه‌آلود بی‌چون‌وچراست این است که نبرد نهایی ما بقای دوطرفه نمی‌پذیرد." },
              { phraseEn: "It is an inescapable truth that one of us shall plunge into this abyss tonight.", translationFa: "این حقیقتی گریزناپذیر است که امشب یکی از ما به درون این گرداب سقوط خواهد کرد." },
            ],
            whiteHintFa: "از ساختار شکافته اسمی What remains undeniable beside this roaring waterfall is that... استفاده کن!",
            fallbackChoices: [
              "What remains undeniable beside this roaring waterfall is that only one of us will walk away alive.",
              "The granite ledge beneath our leather boots is wet with freezing glacial spray.",
              "The dark abyss below churns with violent, deafening power.",
            ],
            aefReference: "Cambridge C2 Proficiency (Pseudo-cleft clauses with What remains undeniable...)",
            npcResponse: {
              speakerNameFa: "پروفسور جیمز موریارتی",
              speakerRoleFa: "نابغه‌ی تبهکاری",
              speakerAvatar: "♟️",
              textEn: "Then let us test our strength, Sherlock! No weapons, no escape, only intellect and bone!",
              textFa: "پس بیا نیروی خود را بیازماییم شرلوک! بدون سلاح، بدون فرار، فقط عقل و استخوان!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "شاخه ۳ب: سوختن بخشی از کدهای سرخ و درگیری تن‌به‌تن اضطراری",
        titleEn: "Branch 3B: Charred Red Pages & Direct Interception on the Ledge",
        storyIntroFa: "شما راه موریارتی را بستید، اما گوشه‌ای از پوشه در آتش اسید سوخت. موریارتی با کینه به چشمانتان خیره شد و آماده رویارویی جسمانی شد.",
        cutscene: {
          titleFa: "اسناد نیم‌سوخته و گارد رزمی موریارتی بر لبه صخره",
          titleEn: "Charred Dossier & The Combat Stance",
          imageSrc: "/images/skills/speaking/c2_scene_8b_charred_stance.jpg",
          dialogues: [
            {
              speakerId: "moriarty",
              speakerNameFa: "پروفسور جیمز موریارتی",
              speakerRoleFa: "نابغه‌ی تبهکاری",
              speakerAvatar: "♟️",
              textEn: "You saved a charred skeleton of my cipher, Holmes! But you cannot save your own life!",
              textFa: "تو اسکلت سوخته‌ای از کدهای مرا نجات دادی هلمز! اما جان خودت را نمی‌توانی نجات بدهی!",
              bubblePosition: "right",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "کارآگاه مشاور",
              speakerAvatar: "🔍",
              textEn: "Enough remains to convict your syndicate! Your reign of shadow ends upon this ledge!",
              textFa: "آن‌قدر مانده است که شبکه‌ات را محکوم کند! دوران سلطه در سایه‌ات روی این صخره به پایان می‌رسد!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-c2-8-inversion-scarcely-cavern",
            titleFa: "روایت ورود به نبرد مرگبار با ساختار وارونگی زمان (Scarcely had the explosion echoed)",
            speakerPromptEn: "Chronicle the transition from the cavern explosion to the deadly confrontation.",
            speakerPromptFa: "گذر از انفجار غار به رویارویی مرگبار روی صخره را با وارونگی زمانی روایت می‌کنی.",
            speakerRoleFa: "شرلوک هلمز (وارونگی Scarcely had the explosion)",
            speakerAvatar: "🔍",
            taskInstructionFa: "به موریارتی بگو: «هنوز غرش انفجار غار در دره طنین‌انداز بود که موریارتی از میان مه غلیظ نمایان شد.»",
            targetKeywords: [
              { phrase: "Scarcely had the explosion echoed", hintFa: "(هنوز انفجار طنین‌انداز بود)", synonyms: ["scarcely had the explosion echoed", "hardly had the blast echoed", "scarcely had the blast subsided"], weight: 50 },
              { phrase: "emerged through the blinding mist", hintFa: "(از میان مه غلیظ نمایان شد)", synonyms: ["emerged through the blinding mist", "stepped through the thick mist", "appeared through the icy mist"], weight: 50 },
            ],
            idealVoiceResponseEn: "Scarcely had the cavern explosion echoed across the valley when Moriarty emerged through the blinding mist.",
            alternativeResponsesEn: [
              { phraseEn: "Hardly had the chemical smoke dispersed when the professor stepped onto the wet chasm ledge.", translationFa: "هنوز دود شیمیایی پراکنده نشده بود که پروفسور روی لبه خیس ژرف‌دره گام نهاد." },
              { phraseEn: "No sooner had the vault blast detonated than Moriarty confronted us at the abyss.", translationFa: "به محض اینکه انفجار گاوصندوق رخ داد، موریارتی در کنار مغاک با ما روبرو شد." },
            ],
            whiteHintFa: "از ساختار معکوس شکوهمند Scarcely had the cavern explosion echoed... when... استفاده کن!",
            fallbackChoices: [
              "Scarcely had the cavern explosion echoed across the valley when Moriarty emerged through the blinding mist.",
              "The freezing mist drenches our coats with icy needles of Alpine water.",
              "There is no foothold behind me, only the bottomless abyss.",
            ],
            aefReference: "Cambridge C2 Proficiency (Advanced negative temporal inversion)",
            npcResponse: {
              speakerNameFa: "پروفسور جیمز موریارتی",
              speakerRoleFa: "نابغه‌ی تبهکاری",
              speakerAvatar: "♟️",
              textEn: "Prepare yourself, Sherlock! The waters of Reichenbach await their sacrifice!",
              textFa: "خودت را آماده کن شرلوک! آب‌های خروشان رایشنباخ منتظر قربانی خود هستند!",
            },
          },
        ],
      },
    ],
    tasks: [
      {
        id: "task-c2-8-default-fallback",
        titleFa: "اعلام حتمیت سرنوشت با جمله شکافته تأکیدی (What remains undeniable is that)",
        speakerPromptEn: "Declare the inevitable resolution of this existential duel beside the roaring cataract.",
        speakerPromptFa: "حتمیت فرجامین این دوئل اگزیستانسیال در کنار غرش آبشار را با جمله شکافته اعلام می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته What remains undeniable)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به موریارتی بگو: «آنچه در کنار این آبشار خروشان انکارناپذیر است این است که تنها یکی از ما زنده از اینجا بازخواهد گشت.»",
        targetKeywords: [
          { phrase: "What remains undeniable beside", hintFa: "(آنچه انکارناپذیر است در کنار...)", synonyms: ["what remains undeniable beside", "what remains indisputable beside", "what is undeniable beside"], weight: 50 },
          { phrase: "only one of us will walk away", hintFa: "(تنها یکی از ما زنده بازخواهد گشت)", synonyms: ["only one of us will walk away", "only one of us shall walk away", "one of us will survive"], weight: 50 },
        ],
        idealVoiceResponseEn: "What remains undeniable beside this roaring waterfall is that only one of us will walk away alive.",
        alternativeResponsesEn: [
          { phraseEn: "What is beyond dispute in this misty gorge is that our final reckoning admits no mutual survival.", translationFa: "آنچه در این دره مه‌آلود بی‌چون‌وچراست این است که نبرد نهایی ما بقای دوطرفه نمی‌پذیرد." },
          { phraseEn: "It is an inescapable truth that one of us shall plunge into this abyss tonight.", translationFa: "این حقیقتی گریزناپذیر است که امشب یکی از ما به درون این گرداب سقوط خواهد کرد." },
        ],
        whiteHintFa: "از ساختار شکافته اسمی What remains undeniable beside this roaring waterfall is that... استفاده کن!",
        fallbackChoices: [
          "What remains undeniable beside this roaring waterfall is that only one of us will walk away alive.",
          "The granite ledge beneath our leather boots is wet with freezing glacial spray.",
          "The dark abyss below churns with violent, deafening power.",
        ],
        aefReference: "Cambridge C2 Proficiency (Pseudo-cleft clauses with What remains undeniable...)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی تبهکاری",
          speakerAvatar: "♟️",
          textEn: "Then let us test our strength, Sherlock! No weapons, no escape, only intellect and bone!",
          textFa: "پس بیا نیروی خود را بیازماییم شرلوک! بدون سلاح، بدون فرار، فقط عقل و استخوان!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: DECISION 4: The Ultimate Duel with Professor Moriarty on the Brink
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "C2",
    titleFa: "تصمیم چهارم: نبرد تن‌به‌تن تاریخی با پروفسور موریارتی بر لبه آبشار",
    titleEn: "DECISION 4: The Ultimate Duel with Professor Moriarty on the Brink",
    locationFa: "لبه مرگبار باریکه صخره‌ای رایشنباخ، آب خروشان در زیر پا و مه سرد آلپ",
    locationEn: "The Precipice Brink, Directly Overhanging the Chasm, Reichenbach",
    storyIntroFa: "آبشار رایشنباخ با خشمی کرکننده در زیر پاهایتان به قعر ژرف‌دره می‌ریزد. موریارتی با چشمان گشادشده از جنون و اراده به سمت شما خیز برمی‌دارد و دست‌های استخوانی‌اش را دور یقه‌تان حلقه می‌کند. دو ذهن برتر جهان در گیرودار مبارزه‌ای تن‌به‌تن و بی‌رحمانه بر لبه صخره‌ای لغزان پیچ‌وتاب می‌خورند. پای راست شرلوک از لبه گرانیت معلق است! اکنون زمان استفاده از هنر دفاع شخصی ژاپنی باریتسو (Baritsu) است: موریارتی سنگینی وزنش را به سمت جلو می‌اندازد تا هر دو با هم سقوط کنید. یک حرکت کوچک تفاوت میان حیات و مرگ جاودانه است.",
    cutscene: {
      titleFa: "رویارویی تن‌به‌تن تاریخی هلمز و موریارتی بر لبه آبشار رایشنباخ",
      titleEn: "The Epic Grip at the Brink of the Reichenbach Abyss",
      imageSrc: "/images/skills/speaking/c2_scene_9_reichenbach_duel.jpg",
      dialogues: [
        {
          speakerId: "moriarty",
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی در حال سقوط",
          speakerAvatar: "♟️",
          textEn: "If I am destined to drown in this abyss, Sherlock, I shall drag you down into darkness with me!",
          textFa: "اگر مقدر است در این گرداب غرق شوم شرلوک، تو را همراه خودم به تاریکی خواهم کشید!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور (اجرای باریتسو)",
          speakerAvatar: "🔍",
          textEn: "Your center of gravity is overextended, James! Reason will prevail over brute malice!",
          textFa: "مرکز ثقل بدنت بیش از حد به جلو متمایل است جیمز! عقلانیت بر کینه کور پیروز خواهد شد!",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-c2-4",
      promptFa: "بزرگ‌ترین و فرجامین تصمیم تاریخ ادبیات کارآگاهی: چگونه گره مرگبار موریارتی را بر لبه آبشار می‌گشایید؟",
      promptEn: "Decision 4: Execute the classical Baritsu pivoting throw or lock his arms and roll inward toward the safety wall?",
      choices: [
        {
          id: "choice-4a",
          labelEn: "Choice 4A: Execute the Baritsu pivoting throw to twist his momentum and cast him into the chasm",
          labelFa: "گزینه ۴الف: اجرای فن پرتابی چرخشی باریتسو و منحرف ساختن وزن موریارتی به سوی قعر آبشار",
          descriptionFa: "با رهاسازی ناگهانی بازوانش، تکانه حرکتی خود او را علیه‌اش استفاده کرده و موریارتی را به داخل گرداب پرتاب می‌کنید.",
          pointsDelta: 500,
        },
        {
          id: "choice-4b",
          labelEn: "Choice 4B: Lock his shoulders and drop your weight backward against the inner granite rockface",
          labelFa: "گزینه ۴ب: قفل کردن شانه‌های موریارتی و کشیدن وزن خود به سمت دیواره سنگی امن داخلی",
          descriptionFa: "او را روی صخره زمین‌گیر می‌کنید؛ هر دو به شدت زخمی می‌شوید اما دست‌های موریارتی در دستبندهای فولادی قفل می‌شود.",
          pointsDelta: 400,
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-9-inversion-not-for-a-fraction",
        titleFa: "اعلام پیروزی خرد بر شرارت با ساختار وارونگی حماسی (Not for a single moment did I doubt)",
        speakerPromptEn: "Deliver the decisive philosophical proclamation of intellect over malice using emphatic inversion.",
        speakerPromptFa: "اعلامیه فلسفی قاطع پیروزی خرد بر پلیدی را با وارونگی تأکیدی حماسی بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (وارونگی حماسی Not for a single moment)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به موریارتی بگو: «حتی برای یک لحظه هم تردید نکردم که عقلانیت استنتاجی بر شرارت سنجیده‌ات چیره خواهد شد.»",
        targetKeywords: [
          { phrase: "Not for a single moment", hintFa: "(حتی برای یک لحظه هم...)", synonyms: ["not for a single moment", "not for a solitary second", "never for a single moment"], weight: 50 },
          { phrase: "deductive intellect would overcome", hintFa: "(عقلانیت استنتاجی چیره خواهد شد)", synonyms: ["deductive intellect would overcome", "deductive reason would overcome", "deductive intellect would prevail"], weight: 50 },
        ],
        idealVoiceResponseEn: "Not for a single moment did I doubt that deductive intellect would overcome calculated evil.",
        alternativeResponsesEn: [
          { phraseEn: "Never for an instant did I believe that malevolence could outwit the power of disciplined reason.", translationFa: "هرگز برای یک لحظه باور نکردم که خباثت بتواند بر قدرت خرد منضبط پیروز شود." },
          { phraseEn: "Not for one breath did I doubt that justice would triumph above this roaring abyss.", translationFa: "حتی به اندازه یک نفس تردید نکردم که عدالت بر فراز این ژرف‌دره خروشان پیروز خواهد شد." },
        ],
        whiteHintFa: "از ساختار معکوس شکوهمند Not for a single moment did I doubt that... استفاده کن!",
        fallbackChoices: [
          "Not for a single moment did I doubt that deductive intellect would overcome calculated evil.",
          "The black waters of the Reichenbach torrent swallow every echo in the mist.",
          "My boots hold firm upon the mossy shelf of granite.",
        ],
        aefReference: "Cambridge C2 Proficiency (Emphatic rhetorical inversion with Not for a single moment... did I...)",
        npcResponse: {
          speakerNameFa: "پروفسور جیمز موریارتی",
          speakerRoleFa: "نابغه‌ی تبهکاری (در حال سقوط)",
          speakerAvatar: "♟️",
          textEn: "AARRGH! Sherlock...! You have won... but the game... will never end!",
          textFa: "آآآه! شرلوک...! تو بردی... اما این بازی... هرگز تمام نخواهد شد!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: The Reichenbach Resolution, The Four Folders & The Legend
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "C2",
    titleFa: "پرده دهم: فرجام رایشنباخ، وصال چهار پوشه و تولد اسطوره جاودان",
    titleEn: "Stage 10: The Reichenbach Resolution, The Four Folders & The Legend",
    locationFa: "لبه صخره رایشنباخ، طلوع آفتاب زرین بر فراز قلل برفی مایرینگن و پایان جنگ سایه‌ها",
    locationEn: "The Alpine Ledge at Dawn, Reichenbach Falls, Switzerland",
    storyIntroFa: "مه غلیظ در پرتوهای زرین آفتاب بامدادی آلپ به آرامی کنار می‌رود. آبشار خروشان رایشنباخ در دوردست می‌درخشد. موریارتی در اعماق ژرف‌دره ناپدید شد و سایه شوم اتحادیه تبهکاری برای همیشه فروریخت. دکتر جان واتسون با شتاب و چشمان نگران خود را به لبه صخره می‌رساند و ردپای دوئل مرگبار را می‌بیند... ناگهان صدایی آشنا از پشت تخته‌سنگ بلند می‌شود: «کمی دیر کردی جان، اما کالسکه هنوز برای بازگشت به لندن منتظر ماست!» هر چهار پوشه سلطنتی مفقودشده MI6 اکنون در دست شرلوک است. پرونده‌های بزرگ قرن نوزدهم با پیروزی مطلق عقلانیت و دوستی بسته شد.",
    cutscene: {
      titleFa: "سقوط موریارتی به گرداب و آغوش برادرانه هلمز و واتسون در طلوع آفتاب",
      titleEn: "Sherlock and Watson Reunited at Dawn Above the Reichenbach Falls",
      imageSrc: "/images/skills/speaking/c2_scene_10_reunited_dawn.jpg",
      dialogues: [
        {
          speakerId: "watson",
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "پزشک همراه با اشک شوق",
          speakerAvatar: "🩺",
          textEn: "Holmes! You are alive! By all the heavens, I thought the abyss had claimed you both!",
          textFa: "هلمز! تو زنده‌ای! به خدا قسم فکر کردم ژرف‌دره جان هر دوی شما را گرفته است!",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "کارآگاه مشاور پیروز",
          speakerAvatar: "🔍",
          textEn: "Baritsu served me well, my dear Watson. And look: all four secret imperial folders are safely in our grasp!",
          textFa: "باریتسو به خوبی به کمکم آمد واتسون عزیزم. و ببین: هر چهار پوشه محرمانه امپراتوری به سلامت در دستان ماست!",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-c2-10-cleft-undoing-loyalty",
        titleFa: "استنتاج فرجامین کل دوران کارآگاهی با جمله شکافته فلسفی (What sealed Moriarty's downfall)",
        speakerPromptEn: "Deliver the definitive synthesis of intellect and brotherhood that conquered Moriarty's syndicate.",
        speakerPromptFa: "سنتز نهایی و فلسفی پیروزی خرد و رفاقت بر تشکیلات موریارتی را با جمله شکافته فاخر بیان می‌کنی.",
        speakerRoleFa: "شرلوک هلمز (جمله شکافته فلسفی What sealed Moriarty's downfall)",
        speakerAvatar: "🔍",
        taskInstructionFa: "به دکتر واتسون بگو: «آنچه فرجام سقوط موریارتی را مهر و موم کرد صرفاً تکبر او نبود، بلکه ناتوانی‌اش در درک وفاداری بود.»",
        targetKeywords: [
          { phrase: "What sealed Moriarty's downfall", hintFa: "(آنچه سقوط موریارتی را رقم زد)", synonyms: ["what sealed moriarty's downfall", "what sealed his downfall", "what caused moriarty's downfall"], weight: 50 },
          { phrase: "failure to understand loyalty", hintFa: "(ناتوانی در درک وفاداری انسان)", synonyms: ["failure to understand loyalty", "inability to comprehend loyalty", "underestimation of loyalty"], weight: 50 },
        ],
        idealVoiceResponseEn: "What sealed Moriarty's ultimate downfall was not merely his arrogance, but his failure to understand loyalty.",
        alternativeResponsesEn: [
          { phraseEn: "What destroyed the mastermind was not solitary miscalculation, but his profound blindness to human brotherhood.", translationFa: "آنچه مغز متفکر را نابود ساخت اشتباهی منفرد نبود، بلکه کوری عمیق او در برابر برادری انسانی بود." },
          { phraseEn: "It was not intellectual deficiency that broke Moriarty, but his inability to grasp the power of loyalty.", translationFa: "نقص عقلی نبود که موریارتی را درهم شکست، بلکه ناتوانی او در درک نیروی وفاداری بود." },
        ],
        whiteHintFa: "از ساختار شکافته الهام‌بخش What sealed Moriarty's ultimate downfall was not merely... but his failure... استفاده کن!",
        fallbackChoices: [
          "What sealed Moriarty's ultimate downfall was not merely his arrogance, but his failure to understand loyalty.",
          "The morning sun warms the peaks of the Swiss Alps with golden radiance.",
          "London awaits the return of the four folders and two weary gentlemen.",
        ],
        aefReference: "Cambridge C2 Proficiency (Advanced pseudo-cleft synthesis: What sealed [noun] was not merely... but...)",
        npcResponse: {
          speakerNameFa: "دکتر جان واتسون",
          speakerRoleFa: "همکار و برادر وفادار",
          speakerAvatar: "🩺",
          textEn: "To London, Sherlock! The grandest detective and the greatest friend this world has ever known!",
          textFa: "به سوی لندن شرلوک! بزرگ‌ترین کارآگاه و بهترین دوستی که این جهان به خود دیده است!",
        },
      },
    ],
    possibleEndings: {
      ending1: {
        endingType: "ending-1-case-solved",
        titleFa: "پایان حماسی: سقوط موریارتی، بازگشت هر چهار پوشه به دربار و جاودانگی نام هلمز و واتسون",
        titleEn: "ENDING 1: THE REICHENBACH RECKONING — Victory of Mind and Brotherhood!",
        badgeTitleFa: "👑 فتح نهایی سطح C2: مهار کامل پرونده سرخ و جاودانگی اسطوره شرلوک هلمز",
        imageSrc: "/images/skills/speaking/c2_scene_ending_legend.jpg",
        climaxStoryFa: "موریارتی با یک حرکت دقیق باریتسو از لبه صخره معلق شد و به قعر آبشار خروشان سقوط کرد. پرونده سرخ [C2] در کنار پوشه‌های بنفش [A2]، زرد [B1]، آبی [B2] و طلایی [C1] به دربار بریتانیا بازگردانده شد. تهدید موریارتی پایان یافت و پیوند برادری هلمز و واتسون برای همیشه در تاریخ جاودانه گشت.",
        climaxStoryEn: "Moriarty was cast into the abyss through the art of Baritsu. All four stolen dossiers were restored to the Crown, cementing the eternal partnership of Holmes and Watson.",
        revealDialogueFa: `هلمز پیپ خود را در پرتوهای طلایی طلوع خورشید آلپ روشن می‌کند و در حالی که به افق برف‌گرفته می‌نگرد، می‌گوید:
«جان، موریارتی تصور می‌کرد انسان‌ها مهره‌هایی بی‌احساس در صفحه شطرنج او هستند. او هرگز نفهمید که وفاداری، از خودگذشتگی و شجاعت اخلاقی، معادلاتی هستند که هیچ الگوریتم جنایی نمی‌تواند آن‌ها را پیش‌بینی کند.
پرونده سرخ بسته شد. کار ما در اینجا تمام است.
بیا به خانه برگردیم... به خیابان بیکر ۲۲۱ب.»

واتسون با لبخندی آرام دست شرلوک را می‌فشارد. باد سرد کوهستان هنوز می‌وزد، اما گرمای پیروزی خرد بر تاریکی، تمام آلپ را فرا گرفته است.`,
        revealDialogueEn: "Holmes lights his pipe in the Alpine dawn, declaring that moral loyalty transcends all criminal calculation. They begin their triumphant journey back to 221B Baker Street.",
        nextTierHintFa: "شما کل دوره مکالمه زبان انگلیسی ایندورا از سطح مبتدی تا اوج فصاحت C2 را با بالاترین استانداردهای سخنوری و زبان بین‌المللی با موفقیت به پایان رساندید! تبریک به این دستاورد درخشان!",
      },
      ending2: {
        endingType: "ending-2-case-failed",
        titleFa: "پایان ناکام: سقوط زخمی موریارتی، مفقود شدن صفحات سرخ و بازگشت دشوار به لندن",
        titleEn: "ENDING 2: CASE FAILED — The Bitter Victory in the Alpine Mist!",
        badgeTitleFa: "⚠️ پرونده ناکام: نجات جان به بهای آسیب جدی به اسناد سرخ",
        imageSrc: "/images/skills/speaking/c2_scene_ending_pyrrhic.jpg",
        climaxStoryFa: "موریارتی پس از درگیری به قعر آبشار افتاد اما اسناد سرخ دستخوش رطوبت شدید و آتش اسید شد. اگرچه خطر جانی رفع شد، اما برخی رازهای تشکیلات موریارتی در هاله‌ای از ابهام باقی ماند.",
        climaxStoryEn: "Moriarty fell, but the Red Folder was badly damaged by water and acid. The existential threat was averted, yet at heavy physical and diplomatic cost.",
        revealDialogueFa: `هلمز به آبشار نگاه می‌کند و می‌گوید: «موریارتی دیگر بازنخواهد گشت جان، اما بهای این پیروزی سنگین بود. تاریخ به ما آموخت که حتی در پیروزی نیز باید هشیار ماند.»`,
        revealDialogueEn: "Sherlock and Watson stand bruised beside the falls, knowing that although the villain is vanquished, the price of vigilance is eternal.",
        nextTierHintFa: "شما تمام مراحل را با پشتکار به پایان رساندید. تسلط گفتاری در سطح C2 نیازمند تمرین مداوم و ممارست در سخنوری است!",
      },
    },
  },
];
