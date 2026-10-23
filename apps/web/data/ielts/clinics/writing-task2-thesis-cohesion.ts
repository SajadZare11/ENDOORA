import type { IeltsClinicData } from "@endoora/contracts";

export const WRITING_TASK2_THESIS_COHESION_CLINIC: IeltsClinicData = {
  id: "writing-task2-thesis-cohesion",
  skill: "writing",
  titleFa: "تز استیتمنت و پرهیز از پرگویی در تسک ۲",
  titleEn: "Band 8 Thesis Statements & Natural Cohesion",
  targetBands: "باند ۷.۰ تا ۸.۵",
  estimatedMinutes: 20,
  heroIcon: "✍️",
  badgeLabelFa: "معماری تز و انسجام طبیعی",
  hurdleSummaryFa:
    "چگونه تله مقدمه‌های آبکی و تکرار مکانیکی ربط‌دهنده‌ها (Furthermore, Moreover) را کنار بگذاریم و تز استیتمنت شفاف و استدلال‌های یکپارچه بنویسیم.",

  strategyGuide: {
    corePrinciplesFa: [
      "موضع صریح و بدون لرزش (Clear Position Throughout): اگزمینر باید از همان جمله دوم مقدمه بداند نظر قطعی شما چیست. عبارات مبهم مانند 'This essay will discuss both sides' نمره شما را در ۶ متوقف می‌کند.",
      "پرهیز از بمباران متن با رابط‌های قالبی (Mechanical Linking): قرار دادن Furthermore و In addition در ابتدای هر جمله نمره Coherence & Cohesion را کاهش می‌دهد؛ پیوستگی باید از طریق ارجاع ضمایر (Pronoun referencing) و جریان معنایی باشد.",
      "کالبدشکافی جمله تز دو بخشی: ۱) پذیرش موضع مخالف در جمله وابسته (Concession: While / Although) + ۲) اعلام صریح موضع خود با دلیل اصلی در بند اصلی.",
      "یک ایده محوری برای هر پاراگراف (One Central Idea): هرگز دو استدلال ناهمگون را در یک پاراگراف تلنبار نکنید؛ ایده را با Topic Sentence شروع، با توضیح بسط و با مثال مستند کنید.",
    ],
    goldenFormulaFa:
      "تز استیتمنت حرفه‌ای = While [دیدگاه مقابل را در یک عبارت کوتاه بپذیر], I firmly contend that [دیدگاه قاطع خود با اشاره به دلیل بنیادین].",
    goldenFormulaEn:
      "While [Acknowledged counter-argument], I firmly contend that [Direct position with core rationale].",
    timeManagementTipFa:
      "بیش از ۵ دقیقه صرف مقدمه نکنید. مقدمه دو جمله‌ای است: پارافریز صورت سوال + تز استیتمنت شفاف.",
    keyVocabulary: [
      { word: "thesis statement", fa: "جمله موضع محوری مقاله", ipa: "/ˈθiː.sɪs ˈsteɪt.mənt/" },
      { word: "mechanical linking", fa: "ربط مکانیکی و مصنوعی جملات", ipa: "/mɪˈkæn.ɪ.kəl ˈlɪŋ.kɪŋ/" },
      { word: "concession clause", fa: "بند پذیرش موضع مقابل (با While/Although)", ipa: "/kənˈseʃ.ən klɔːz/" },
      { word: "referencing", fa: "ارجاع هوشمندانه با ضمایر و اشارات", ipa: "/ˈref.ər.ən.sɪŋ/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-vague-roadmap",
      trapTitleFa: "تله مقدمه مبهم کلیشه‌ای (Vague Boilerplate Trap)",
      trapTitleEn: "Announcing the Essay Instead of Stating a Thesis",
      contextPassageOrPrompt:
        "Prompt: 'Some people believe university education should be free for all citizens. Others argue students should pay. Discuss both views and give your opinion.'",
      commonWrongChoice:
        "Introduction Ending: 'This essay will explore the advantages and disadvantages of this controversial topic and provide a conclusion at the end.'",
      whyWrongFa:
        "این جمله هیچ موضعی اعلام نمی‌کند (Zero Position). داوطلب فقط می‌گوید قصد دارد مقاله بنویسد؛ این کار نمره Task Response را در بند ۶ قفل می‌کند.",
      correctChoice:
        "Introduction Ending: 'While subsidized tertiary education fosters meritocracy, I firmly contend that shared tuition models preserve institutional quality and fiscal sustainability.'",
      whyCorrectFa:
        "اگزمینر دقیقاً می‌داند داوطلب چه نظری دارد: طرفدار مدل اشتراکی شهریه برای حفظ کیفیت دانشگاه‌ها است.",
      examinerSecretFa:
        "معیار رسمی Task Response بند ۷: 'Presents a clear position throughout the response'. اگر نظر شما تا پایان مقاله مخفی بماند، نمره زیر ۷ است.",
    },
    {
      id: "trap-2-overlinking-persian",
      trapTitleFa: "تله زیاده‌روی در واژگان ربط (Persian Over-linking Fallacy)",
      trapTitleEn: "Starting Every Sentence with Furthermore / Moreover",
      contextPassageOrPrompt:
        "A student writes: 'Moreover, remote work reduces traffic. Furthermore, it helps parents. In addition, workers save money. Consequently, happiness increases.'",
      commonWrongChoice: "تصور اینکه استفاده از این ۴ کلمه نمره Cohesion را ۸ می‌کند.",
      whyWrongFa:
        "این سبک 'Mechanical Listing' نام دارد و در توصیف‌گر رسمی کمبریج تصریح شده: 'uses cohesive devices inappropriately or over-uses them (Band 5/6)'.",
      correctChoice:
        "بازنویسی طبیعی: 'Beyond alleviating metropolitan traffic congestion, telecommuting grants working parents greater domestic flexibility, which translates into substantial savings on commuting costs.'",
      whyCorrectFa:
        "استفاده از جملات مرکب با حروف ربط ضمنی و ضمایر موصولی (Beyond..., which translates into...) به جای لیست‌کردن سطحی.",
      examinerSecretFa:
        "بند ۸ برای انسجام متنی می‌گوید: 'Uses cohesion in such a way that it attracts no attention' (انسجام آن‌قدر طبیعی است که به چشم نمی‌زند).",
    },
  ],

  drills: [
    {
      id: "t2th-q1",
      orderNumber: 1,
      promptFa: "برای سوال 'آیا هوش مصنوعی جایگزین معلمان خواهد شد؟'، کدام تز استیتمنت شایسته نمره بند ۸ است؟",
      promptEn: "Select the most effective Band 8 Thesis Statement for: 'Some think AI will replace human teachers. Do you agree or disagree?'",
      passageSnippet: "Prompt: AI in Education - Complete replacement vs Human guidance.",
      options: [
        "While algorithmic platforms can effortlessly personalize rote drill instruction, I firmly reject the notion that artificial intelligence can replicate the nuanced pastoral mentorship of human educators.",
        "In this essay I will discuss both points of view and then I will explain my personal idea in the final paragraph.",
        "Nowadays artificial intelligence is everywhere and technology is developing so rapidly that nobody can stop it.",
        "I totally agree that teachers are very important and machines are cold and cannot love children.",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#SophisticatedConcessionThesis",
      explanation: {
        briefFa: "گزینه ۱ بی‌نقص است: پذیرش نقش اتوماسیون با While و سپس رد قاطع امکان جایگزینی مربی‌گری انسانی با دلیلی مستحکم.",
        detailedFa:
          "گزینه ۱ هم موضع را شفاف می‌کند و هم واژگان سطح بالا (nuanced pastoral mentorship) ارائه می‌دهد. گزینه‌های ۲ و ۳ کلیشه هستند و گزینه ۴ لحن احساسی و غیرآکادمیک دارد.",
        cambridgeTipFa:
          "فرم 'While X can do A, I firmly reject/maintain that Y is essential for B' پایدارترین قالب تز برای مقالات بحث و جدل است.",
      },
    },
    {
      id: "t2th-q2",
      orderNumber: 2,
      promptFa: "کدام روش پیوستگی جملات (Cohesion) برای مرتبط ساختن استدلال‌ها در پاراگراف بدنه استاندارد بند ۸ است؟",
      promptEn: "Which technique achieves natural Band 8+ Cohesion between sentences in a body paragraph?",
      passageSnippet: "Topic: Encouraging public transit usage through subsidization.",
      options: [
        "Employing contextual referencing and noun-phrase encapsulation (e.g. 'This fiscal intervention not only eases congestion but also...')",
        "Inserting 'Moreover' at the start of sentence 2, 'Furthermore' at sentence 3, and 'In addition' at sentence 4.",
        "Repeating the exact words 'public transit' in every single sentence to maintain keyword density.",
        "Starting every sentence with short coordinate conjunctions: 'And it is good. But it costs money. So people like it.'",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#NaturalEncapsulationCohesion",
      explanation: {
        briefFa: "گزینه ۱ صحیح است: استفاده از ارجاع هوشمندانه و تلخیص گزاره قبلی در یک عبارت اسمی ('This fiscal intervention').",
        detailedFa:
          "به جای بمباران مکانیکی با Moreover یا تکرار وسواسی واژه public transit، خلاصه کردن مفهوم جمله قبل در یک عبارت انتزاعی ('This fiscal intervention...') بالاترین نمره Coherence and Cohesion را در توصیف‌گر رسمی کمبریج دارد.",
        cambridgeTipFa:
          "تکنیک Noun-Phrase Encapsulation (خلاصه‌سازی گزاره در یک عبارت اسمی معین) شناسه نویسندگان Band 8.5+ است.",
      },
    },
  ],
};
