import type { IeltsClinicData } from "@endoora/contracts";

export const READING_SUMMARY_DIAGRAMS_CLINIC: IeltsClinicData = {
  id: "reading-summary-diagrams",
  skill: "reading",
  titleFa: "تکمیل خلاصه و دیاگرام با محدودیت کلمه",
  titleEn: "Word-Count Constraints & Synonym Bridges",
  targetBands: "باند ۶.۵ تا ۸.۰",
  estimatedMinutes: 18,
  heroIcon: "📊",
  badgeLabelFa: "پل پارافریز و محدودیت کلمات",
  hurdleSummaryFa:
    "چگونه محدودیت‌های سختگیرانه NO MORE THAN TWO WORDS را مدیریت کنیم و جای خالی را با پیش‌بینی نقش دستوری و ردیابی مترادف‌ها پر کنیم.",

  strategyGuide: {
    corePrinciplesFa: [
      "پیش‌بینی نقش دستوری (Grammar Prediction): قبل از رفتن به متن، حدس بزنید جای خالی نیاز به اسم (Noun)، صفت (Adjective)، یا فعل (Verb) دارد.",
      "محدودیت شمارش کلمه قانون مرگ و زندگی است: اگر دستور سوال 'NO MORE THAN TWO WORDS' است و شما ۳ کلمه بنویسید، حتی با پاسخ درست نمره صفر می‌گیرید.",
      "تله حروف اضافه و شناسه: کلمات a / an / the را بررسی کنید؛ گاهی در متن با the آمده ولی جای خالی نیاز به خود کلمه دارد یا بالعکس.",
      "کلمات کناری جای خالی (Collocational Anchors): کلماتی که بلافاصله قبل یا بعد از جای خالی هستند در متن با مترادف‌هایشان منتظر شما هستند.",
    ],
    goldenFormulaFa:
      "نقش دستوری را حدس بزن $\\rightarrow$ کلمات لنگر (Anchors) را در متن پیدا کن $\\rightarrow$ کلمه دقیق را بدون تغییر املایی از متن استخراج کن.",
    goldenFormulaEn:
      "Predict Part of Speech $\\rightarrow$ Locate Contextual Anchors in Text $\\rightarrow$ Extract Exact Morphological Form without modification.",
    timeManagementTipFa:
      "هرگز شکل کلمه را تغییر ندهید (مثلا مفرد به جمع یا اسم به صفت نکنید)؛ کلمه دقیقاً به همان صورت در متن وجود دارد.",
    keyVocabulary: [
      { word: "part of speech", fa: "نقش دستوری کلمه (اسم، صفت و...)", ipa: "/pɑːt əv spiːtʃ/" },
      { word: "anchor words", fa: "کلمات لنگر یا راهنمای متن", ipa: "/ˈæŋ.kər wɜːdz/" },
      { word: "verbatim", fa: "کلمه‌به‌کلمه، بدون دخل و تصرف", ipa: "/vɜːˈbeɪ.tɪm/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-word-limit-overrun",
      trapTitleFa: "تله سرریز محدودیت کلمه (Word Limit Violation)",
      trapTitleEn: "Writing Modifiers That Invalidate the Question",
      contextPassageOrPrompt:
        "Passage: 'The newly developed desalination membrane employs microscopic carbon nanotubes to filter mineral salts.'\nQuestion: Complete the sentence. Choose NO MORE THAN TWO WORDS: 'The membrane uses [blank] to separate salt molecules.'",
      commonWrongChoice: "microscopic carbon nanotubes (۳ کلمه)",
      whyWrongFa: "داوطلب صفت microscopic را اضافه می‌کند و از سقف مجاز ۲ کلمه تجاوز می‌کند.",
      correctChoice: "carbon nanotubes (یا nanotubes)",
      whyCorrectFa: "دقیقاً ۲ کلمه است و هسته اصلی اسم مورد نیاز جمله را بدون نقض محدودیت تامین می‌کند.",
      examinerSecretFa:
        "سیستم نمره‌دهی کامپیوتری هر پاسخی بیش از محدودیت اعلام شده را به صورت خودکار رد می‌کند.",
    },
  ],

  drills: [
    {
      id: "sum-q1",
      orderNumber: 1,
      promptFa: "بر اساس متن زیر، جای خالی را با 'حداکثر دو کلمه' پر کنید:",
      promptEn: "Complete the summary: Choose NO MORE THAN TWO WORDS from the passage. 'Engineers integrated [blank] into the turbines to dampen mechanical vibrations.'",
      passageSnippet:
        "Passage: To withstand offshore squalls, the structural engineers installed flexible polymer dampeners directly onto the rotor shafts, mitigating severe mechanical vibrations and prolonging gear bearing longevity.",
      options: [
        "flexible polymer dampeners",
        "polymer dampeners",
        "rotor shafts",
        "offshore squalls",
      ],
      correctAnswerIndex: 1,
      trapTypeBadge: "#WordCountLimitTrap",
      explanation: {
        briefFa: "گزینه ۲ ('polymer dampeners') دقیقاً ۲ کلمه است و هسته اسم مورد نیاز جمله است.",
        detailedFa:
          "گزینه ۱ دارای ۳ کلمه است و دستور 'NO MORE THAN TWO WORDS' را نقض می‌کند. گزینه ۲ کاملاً روان و با گرامر جمله مطابقت دارد.",
        cambridgeTipFa:
          "صفت‌های غیرضروری اول جمله را حذف کنید تا پاسخ در سقف مجاز جا بگیرد.",
      },
    },
    {
      id: "sum-q2",
      orderNumber: 2,
      promptFa: "کدام کلمه جای خالی را از لحاظ دستوری و معنایی بدون نقص تکمیل می‌کند؟",
      promptEn: "Summary: 'Researchers discovered that soil with high [blank] significantly accelerated seedling root proliferation.' (ONE WORD ONLY)",
      passageSnippet:
        "Passage: Controlled agricultural trials confirmed that enriched humus content fostered rapid subterranean root expansion in newly planted saplings.",
      options: ["humus", "content", "saplings", "proliferation"],
      correctAnswerIndex: 0,
      trapTypeBadge: "#ExactLexicalExtraction",
      explanation: {
        briefFa: "کلمه 'humus' (گیاخاک / کود گیاهی) اسم دقیق مورد نظر است.",
        detailedFa:
          "در متن آمده 'enriched humus content fostered rapid... root expansion'. کلمه humus اسم مناسب بعد از صفت high است (خاک با گیاخاک بالا).",
        cambridgeTipFa:
          "عین کلمه داخل متن را انتخاب کنید و هرگز تغییر گرامری در آن ایجاد نکنید.",
      },
    },
  ],
};
