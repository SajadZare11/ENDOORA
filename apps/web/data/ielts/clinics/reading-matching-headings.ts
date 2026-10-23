import type { IeltsClinicData } from "@endoora/contracts";

export const READING_MATCHING_HEADINGS_CLINIC: IeltsClinicData = {
  id: "reading-matching-headings",
  skill: "reading",
  titleFa: "کشف تم محوری در Matching Headings",
  titleEn: "Heading Matching & Topic Sentence Traps",
  targetBands: "باند ۷.۰ تا ۸.۵",
  estimatedMinutes: 20,
  heroIcon: "📑",
  badgeLabelFa: "تسلط بر تیترهای موازی",
  hurdleSummaryFa:
    "چگونه تله تطابق سطحی کلمات کلیدی (Keyword Matching) را کنار بزنیم و ایده کلی (Macro-idea) پاراگراف را از مثال‌های فرعی تفکیک کنیم.",

  strategyGuide: {
    corePrinciplesFa: [
      "هرگز به دنبال تطابق عین کلمه نباشید: تیترهایی که عین کلمات پاراگراف را دارند معمولاً فقط یک مثال فرعی هستند، نه ایده محوری کل پاراگراف.",
      "ساختار اسکلت پاراگراف را اسکن کنید: جمله اول (Topic Sentence)، جمله دوم (بسط یا تقابل)، و جمله پایانی (نتیجه‌گیری) ۸۰٪ محتوای تماتیک را آشکار می‌کنند.",
      "به دنبال واژگان مفهومی انتزاعی باشید: عناوینی با کلماتی مثل Causes، Solutions، Financial obstacles یا Controversial findings خلاصه‌کننده چند خط هستند.",
      "تکنیک حذف (Process of Elimination): ابتدا تیترهایی را که قطعاً به پاراگراف‌های دیگر تعلق دارند خط بزنید تا انتخاب بین حداکثر ۲ گزینه نهایی انجام شود.",
    ],
    goldenFormulaFa:
      "تیتر درست = پوشش‌دهنده کل چتر محتوایی پاراگراف (نه فقط یک سطر جالب یا عدد آماری که در میانه متن آمده).",
    goldenFormulaEn:
      "A valid heading summarizes the macro-theme, not an isolated supporting anecdote or statistical footnote.",
    timeManagementTipFa:
      "ابتدا لیست هدینگ‌ها را یک‌بار سریع بخوانید و کلمات کلیدی را مشخص کنید، سپس پاراگراف به پاراگراف پیش بروید. هرگز تمام متن را اول نخوانید.",
    keyVocabulary: [
      { word: "macro-theme", fa: "تم کلان، مفهوم محوری", ipa: "/ˈmæk.rəʊ θiːm/" },
      { word: "distractor", fa: "گزینه گمراه‌کننده، تله", ipa: "/dɪˈstræk.tər/" },
      { word: "topic sentence", fa: "جمله موضوعی پاراگراف", ipa: "/ˈtɒp.ɪk ˈsen.təns/" },
      { word: "anecdote", fa: "روایت شخصی، مثال فرعی", ipa: "/ˈæn.ɪk.dəʊt/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-keyword-bait",
      trapTitleFa: "تله طعمه کلمات کلیدی (Keyword Baiting Trap)",
      trapTitleEn: "Choosing a Heading Because Words Reappear",
      contextPassageOrPrompt:
        "Paragraph: 'Although laboratory experiments on carbon capture filters showed promising molecular absorption, the prohibitive cost of rare platinum catalysts makes industrial scaling economically non-viable for most developing municipalities.'",
      commonWrongChoice: "Heading: 'Advances in Molecular Filter Technology'",
      whyWrongFa:
        "داوطلب کلمات 'molecular' و 'filter' را در متن می‌بیند و سریعاً این هدینگ را انتخاب می‌کند بدون توجه به اینکه پاراگراف در واقع درباره مانع اقتصادی است.",
      correctChoice: "Heading: 'Economic Barriers to Widespread Implementation'",
      whyCorrectFa:
        "پیام اصلی پاراگراف این است که به دلیل هزینه سرسام‌آور کاتالیزور پلاتین (prohibitive cost)، اجرای این فناوری در شهرداری‌ها توجیه اقتصادی ندارد.",
      examinerSecretFa:
        "اگزمینر همیشه واژگان تکنیکی پاراگراف را در تیترهای غلط قرار می‌دهد تا افرادی را که صرفاً کلمه‌به‌کلمه جستجو می‌کنند به دام بیندازد.",
    },
    {
      id: "trap-2-example-vs-theme",
      trapTitleFa: "تله اشتباه گرفتن مثال با موضوع اصلی (Example vs Main Theme)",
      trapTitleEn: "Mistaking a Case Study for the Whole Paragraph",
      contextPassageOrPrompt:
        "Paragraph: 'Urban agricultural initiatives face regulatory hurdles. In Berlin, rooftop gardening collectives were forced to dismantle soil beds due to archaic fire safety codes from 1954, while Zurich municipal boards impose stringent water tariffs.'",
      commonWrongChoice: "Heading: 'The Fire Safety Restrictions of Berlin'",
      whyWrongFa:
        "این تیتر فقط مثال اول است و برلین را پوشش می‌دهد در حالی که پاراگراف درباره موانع قانونی شهری در کل (با مثال زوریخ) است.",
      correctChoice: "Heading: 'Regulatory Constraints on City Farming'",
      whyCorrectFa:
        "تیتر چتری (City Farming Constraints) هم برلین و هم زوریخ را زیر یک عنوان مفهومی جامع پوشش می‌دهد.",
      examinerSecretFa:
        "اگر تیتری اسم یک شهر، شخص خاص یا سال را بیاورد که فقط نیمی از پاراگراف را شامل می‌شود، معمولاً تله است مگر آنکه کل پاراگراف روی آن فرد متمرکز باشد.",
    },
  ],

  drills: [
    {
      id: "head-q1",
      orderNumber: 1,
      promptFa: "مناسب‌ترین تیتر برای پاراگراف زیر کدام است؟",
      promptEn: "Select the most suitable heading for Paragraph A.",
      passageSnippet:
        "Paragraph A: Despite aggressive global marketing campaigns emphasizing sustainability, recent life-cycle assessments indicate that electric vehicle manufacturing generates up to 60% more carbon emissions than traditional petrol engines, primarily due to lithium extraction and battery cell synthesis.",
      options: [
        "The Environmental Footprint of Battery Production",
        "Global Marketing Strategies of Electric Carmakers",
        "The Decline of Traditional Petrol Engines",
        "Consumer Perceptions of Sustainability",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#CoreThemeMatch",
      explanation: {
        briefFa: "گزینه ۱ درست است: تمرکز اصلی پاراگراف بر اثرات زیست‌محیطی پنهان تولید باتری و لیتیوم است.",
        detailedFa:
          "جمله اول به بازاریابی اشاره دارد ولی هسته استدلال (life-cycle assessment) نشان می‌دهد تولید باتری کربن بیشتری آزاد می‌کند. گزینه ۲ تله طعمه کلمات (marketing) است.",
        cambridgeTipFa:
          "به کلمات بعد از 'Despite' توجه کنید؛ پیام اصلی در نیمه دوم جمله قرار دارد.",
      },
    },
    {
      id: "head-q2",
      orderNumber: 2,
      promptFa: "مناسب‌ترین تیتر برای پاراگراف زیر چیست؟",
      promptEn: "Select the most suitable heading for Paragraph B.",
      passageSnippet:
        "Paragraph B: In response to rising sea levels, architectural consortiums have abandoned concrete sea walls in favor of engineered salt marshes and mangrove reintroduction. These living barriers not only absorb wave energy more effectively than stone masonry, but also regenerate coastal biodiversity without recurring reconstruction costs.",
      options: [
        "A Costly Struggle Against Ocean Waves",
        "Nature-Based Alternatives to Conventional Defense Structures",
        "The History of Concrete Masonry in Coastal Towns",
        "Threats to Mangrove Habitats Worldwide",
      ],
      correctAnswerIndex: 1,
      trapTypeBadge: "#AbstractSynthesisTrap",
      explanation: {
        briefFa: "گزینه ۲ صحیح است: معرفی باتلاق‌های نمکی و مانگرو به عنوان راه‌حل‌های طبیعی به‌جای دیوارهای سنگی و بتنی.",
        detailedFa:
          "عبارت 'living barriers' و 'engineered salt marshes' به جای 'concrete sea walls' مصداق بارز جایگزین‌های طبیعت‌محور (Nature-Based Alternatives) هستند.",
        cambridgeTipFa:
          "توجه کنید که چگونه 'salt marshes and mangroves' به 'Nature-Based Alternatives' پارافریز مفهومی شده‌اند.",
      },
    },
    {
      id: "head-q3",
      orderNumber: 3,
      promptFa: "کدام تیتر تله است و نباید برای پاراگراف زیر انتخاب شود؟",
      promptEn: "Select the correct overarching heading for Paragraph C.",
      passageSnippet:
        "Paragraph C: While remote instruction democratized access to university lectures during 2020, longitudinal dropout rates among first-generation college students surged by 34%. Without informal campus peer networks and hands-on lab tutoring, self-motivation alone proved insufficient for sustained academic persistence.",
      options: [
        "How Peer Networks Function on Campus",
        "The Unforeseen Educational Disparities of Virtual Learning",
        "The Complete Abolition of Traditional Lectures",
        "Government Grants for First-Generation Scholars",
      ],
      correctAnswerIndex: 1,
      trapTypeBadge: "#NuancedDrawbackTrap",
      explanation: {
        briefFa: "گزینه ۲ درست است؛ پاراگراف به شکاف‌ها و آسیب‌های پیش‌بینی‌نشده آموزش آنلاین برای دانشجویان نسل اول می‌پردازد.",
        detailedFa:
          "گزینه ۱ صرفاً یک جزئیات در خط آخر است؛ گزینه ۳ گزافه‌گویی محض است. گزینه ۲ چتر مفهومی دقیق برای ۳۴٪ ترک تحصیل و نارسایی آموزش مجازی است.",
        cambridgeTipFa:
          "کلمه 'Disparities' یا 'Shortcomings' معمولاً بهترین تیتر برای پاراگراف‌هایی با محتوای نقادانه است.",
      },
    },
  ],
};
