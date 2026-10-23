import type { IeltsClinicData } from "@endoora/contracts";

export const LISTENING_DISTRACTORS_SPELLING_CLINIC: IeltsClinicData = {
  id: "listening-distractors-spelling",
  skill: "listening",
  titleFa: "شکار تله‌ها و اصلاحات لحظه‌ای در لیسنینگ",
  titleEn: "Distractor Traps & Self-Correction Mastery",
  targetBands: "باند ۷.۰ تا ۹.۰",
  estimatedMinutes: 20,
  heroIcon: "🎧",
  badgeLabelFa: "شکارچی تله‌های شنیداری",
  hurdleSummaryFa:
    "چگونه تله‌های چرخش کلامی (Distractors) را شناسایی کنیم، به نخستین عدد یا روز شنیده شده اعتماد نکنیم، و املاهای انگلیسی بریتانیایی/استرالیایی را درست بنویسیم.",

  strategyGuide: {
    corePrinciplesFa: [
      "قانون برگشت گوینده (The Change-of-Mind Rule): در پارت ۱ و پارت ۲، گوینده تقریباً همیشه گزینه‌ای را بیان می‌کند و چند ثانیه بعد می‌گوید: 'Oh wait, that was last year' یا 'Actually, the manager informed me it's 15th'. اولین جوابی که می‌شنوید معمولاً تله است!",
      "واژگان هشداردهنده چرخش (Pivot Markers): کلماتی مثل 'Actually', 'Though', 'Except', 'Instead of', 'Hang on a second' آژیر خطر تغییر پاسخ هستند.",
      "تله اعدادی مثل 14 و 40 یا 15 و 50 (-teen vs -ty): در تلفظ انگلیسی، تکیه صوتی (Stress) در -teen روی هجای دوم است (four-TEEN) و در -ty روی هجای اول (FOR-ty).",
      "قانون املای الفبا: حواستان به تلفظ حروف فریبنده باشد: A / E / I / R / J / G در زبان انگلیسی بیشترین خطای املایی را در آزمون‌های ایرانی ایجاد می‌کنند.",
    ],
    goldenFormulaFa:
      "هرگز اولین گزینه اعلام‌شده را سریع یادداشت نکنید! تا شنیدن تاییدیه یا تغییر مسیر گوینده (Pivot Marker)، قلم را معلق نگه دارید.",
    goldenFormulaEn:
      "Never commit to the first mentioned date/number. Await confirmation or pivot markers ('Actually...', 'No, scratch that...').",
    timeManagementTipFa:
      "از ۳۰ ثانیه وقت استراحت برای خواندن سوالات بعدی و پیش‌بینی نوع کلمه (اسم شخص، نام خیابان، مبلغ پول، شماره تلفن) استفاده کنید.",
    keyVocabulary: [
      { word: "distractor", fa: "تله صوتی، پاسخ گمراه‌کننده", ipa: "/dɪˈstræk.tər/" },
      { word: "pivot marker", fa: "نشانه چرخش کلامی (مثل Actually، Wait)", ipa: "/ˈpɪv.ət ˈmɑː.kər/" },
      { word: "syllable stress", fa: "تکیه هجایی در تلفظ اعداد", ipa: "/ˈsɪl.ə.bəl stres/" },
      { word: "spelling phonetics", fa: "آواشناسی هجی کلمات و اسامی", ipa: "/ˈspel.ɪŋ fəˈnet.ɪks/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-pivot-date",
      trapTitleFa: "تله تغییر تاریخ یا زمان (The Rescheduling Trap)",
      trapTitleEn: "Speaker Self-Correction Distractor",
      contextPassageOrPrompt:
        "Audio Transcript: 'Caller: I was hoping to book the banquet room for Thursday the 12th. Receptionist: Certainly... oh, I apologize, we have a wedding reception booked on the 12th. But Friday the 13th is entirely vacant. Caller: Friday sounds much better anyway.'\nQuestion: 'Date of booking: [blank]'",
      commonWrongChoice: "Thursday 12th (یا 12th)",
      whyWrongFa:
        "داوطلب به محض شنیدن Thursday the 12th قلم را بر زمین می‌گذارد و ادامه صحبت متصدی را که تاریخ را اصلاح می‌کند از دست می‌دهد.",
      correctChoice: "Friday 13th (یا 13th October)",
      whyCorrectFa:
        "تاریخ نهایی توافق شده پس از اصلاح (Apologize / wedding / entirely vacant) روز سیزدهم است.",
      examinerSecretFa:
        "کمبریج در بخش اول (Section 1) حداقل ۲ سوال با ترفند تغییر نظر (Self-Correction) طراحی می‌کند تا میزان تمرکز شنیداری پیوسته را بسنجد.",
    },
    {
      id: "trap-2-teen-vs-ty",
      trapTitleFa: "تله تلفظ ۱۴ در برابر ۴۰ (-teen vs -ty Acoustic Trap)",
      trapTitleEn: "Phonetic Stress Shift in Numerals",
      contextPassageOrPrompt:
        "Audio Transcript: 'How many attendees are registered for the morning seminar? - Well, we initially capped it at forty, but currently only fourteen have registered.'\nQuestion: 'Current number of registered attendees: [blank]'",
      commonWrongChoice: "40",
      whyWrongFa:
        "داوطلب واژه forty را می‌شنود و متوجه نمی‌شود که این سقف اولیه (capped) بوده است نه تعداد ثبت‌نامی فعلی (currently 14).",
      correctChoice: "14",
      whyCorrectFa:
        "تکیه بر four-TEEN بود و کلمه currently نشان‌دهنده زمان حال است.",
      examinerSecretFa:
        "تفاوت تکیه: Four-TEEN کشیده و بلند است، در حالی که FOR-ty کوتاه و کوبشی است.",
    },
  ],

  drills: [
    {
      id: "lis-q1",
      orderNumber: 1,
      promptFa: "بر اساس مکالمه، هزینه نهایی اشتراک سالانه سالن بدنسازی چقدر است؟",
      promptEn: "Transcript: 'Staff: The regular annual membership fee is £450. However, because you are enrolling during our student promotion week, we can discount that down to £380, plus £25 for the electronic locker key card.'\nQuestion: 'Total membership package cost: £[blank]'",
      options: ["450", "380", "405", "475"],
      correctAnswerIndex: 2,
      trapTypeBadge: "#HiddenFeeCalculation",
      explanation: {
        briefFa: "پاسخ ۴۰۵ پوند است (£380 + £25).",
        detailedFa:
          "تله دو مرحله‌ای کلاسیک: هزینه عادی ۴۵۰ پوند با تخفیف به ۳۸۰ تبدیل می‌شود، اما ۲۵ پوند کلید کمد الکترونیکی به آن اضافه می‌گردد (۳۸۰ + ۲۵ = ۴۰۵).",
        cambridgeTipFa:
          "مراقب عبارات 'plus', 'additional fee' یا 'compulsory insurance' در سوالات مالی لیسنینگ باشید.",
      },
    },
    {
      id: "lis-q2",
      orderNumber: 2,
      promptFa: "بر اساس مکالمه زیر، آدرس ایمیل متقاضی را شناسایی کنید:",
      promptEn: "Transcript: 'Agent: Could you spell your surname for the register? Caller: Yes, it is MacIntyre. That is M-A-C-I-N-T-Y-R-E, without an e between the t and the y.'",
      options: [
        "M-A-C-I-N-T-E-Y-R-E",
        "M-A-C-I-N-T-Y-R-E",
        "M-C-I-N-T-Y-R-E",
        "M-A-K-I-N-T-Y-R-E",
      ],
      correctAnswerIndex: 1,
      trapTypeBadge: "#SpellingAccuracyTrap",
      explanation: {
        briefFa: "گزینه ۲ صحیح است: MacIntyre بدون حرف e اضافی.",
        detailedFa:
          "گوینده دقیقاً تاکید می‌کند: 'without an e between the t and the y'؛ داوطلبان عجول گزینه ۱ را به اشتباه انتخاب می‌کنند.",
        cambridgeTipFa:
          "هجی حروف در پارت ۱ نمره مفت است؛ حروف استثنا مانند 'double L' یا 'without an E' را با دقت بنویسید.",
      },
    },
  ],
};
