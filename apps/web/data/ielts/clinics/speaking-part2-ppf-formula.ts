import type { IeltsClinicData } from "@endoora/contracts";

export const SPEAKING_PART2_PPF_CLINIC: IeltsClinicData = {
  id: "speaking-part2-ppf-formula",
  skill: "speaking",
  titleFa: "تکنیک ۲ دقیقه‌ای PPF برای پارت ۲ اسپیکینگ",
  titleEn: "The Past-Present-Future Cue Card Engine",
  targetBands: "باند ۷.۰ تا ۸.۵",
  estimatedMinutes: 22,
  heroIcon: "🎙️",
  badgeLabelFa: "موتور داستان‌سرایی PPF",
  hurdleSummaryFa:
    "چگونه در ۱ دقیقه یادداشت‌برداری طوفانی انجام دهیم و با فرمول گذشته-حال-آینده (Past-Present-Future) بدون توقف و من‌من کردن تا ثانیه ۱۲۰ پیوسته صحبت کنیم.",

  strategyGuide: {
    corePrinciplesFa: [
      "بحران دقیقه اول در پارت ۲: ۸۰٪ داوطلبان پس از ۵۰ ثانیه تمام بولت‌پوینت‌های کیوکارت را جواب می‌دهند و با سکوت وحشتناک روبرو می‌شوند که نمره Fluency را نابود می‌کند.",
      "فرمول PPF (Past, Present, Future): موضوع هر چه باشد (یک کتاب، یک سفر، یک دوست)، آن را در سه زمان بسط دهید: ۱) در گذشته چطور اتفاق افتاد (۶۰ ثانیه)، ۲) امروز چه تاثیری روی زندگی شما دارد (۳۵ ثانیه)، ۳) در آینده چه برنامه‌ای مرتبط با آن دارید (۲۵ ثانیه).",
      "یادداشت‌برداری با کلیدواژه عمودی: در ۱ دقیقه زمان آماده‌سازی هرگز جمله ننویسید! فقط ۵ کلمه کلیدی پیشرفته (Collocations) و اصطلاحات موضوعی را عمودی بنویسید تا هنگام صحبت چشمتان به آن‌ها بیفتد.",
      "جملات انتقالی نرم (Signposting Transitions): برای حرکت بین گذشته و آینده از عباراتی مثل 'Looking back at that era...', 'Nowadays in retrospect...', 'Looking ahead to the upcoming years...' استفاده کنید.",
    ],
    goldenFormulaFa:
      "تایم‌لاین ۱۲۰ ثانیه‌ای: ۳۰ ثانیه معارفه و سابقه در گذشته $\\rightarrow$ ۵۰ ثانیه خاطره و توصیف اوج ماجرا $\\rightarrow$ ۲۵ ثانیه وضعیت کنونی $\\rightarrow$ ۱۵ ثانیه چشم‌انداز آینده.",
    goldenFormulaEn:
      "Past Background (0-45s) $\\rightarrow$ Climax Detail (45-80s) $\\rightarrow$ Present Significance (80-105s) $\\rightarrow$ Future Outlook (105-120s).",
    timeManagementTipFa:
      "تا زمانی که اگزمینر نگفته 'Thank you' به صحبت کردن ادامه دهید. صحبت کردن تا قطع شدن توسط اگزمینر بالاترین امتیاز در Fluency & Coherence است.",
    keyVocabulary: [
      { word: "in retrospect", fa: "در نگاه به گذشته، با مرور ایام", ipa: "/ɪn ˈret.rə.spekt/" },
      { word: "indelible impression", fa: "تاثیر پاک‌نشدنی و ماندگار", ipa: "/ɪnˈdel.ə.bəl ɪmˈpreʃ.ən/" },
      { word: "watershed moment", fa: "نقطه عطف حیاتی و دگرگون‌کننده", ipa: "/ˈwɔː.tə.ʃed ˈməʊ.mənt/" },
      { word: "looking ahead", fa: "با نگاه به آینده", ipa: "/ˈlʊk.ɪŋ əˈhed/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-literal-bullet-rush",
      trapTitleFa: "تله روخوانی فهرست‌وار از بولت‌ها (Bullet Checklist Trap)",
      trapTitleEn: "Answering Bullets Like an Interrogation Checklist",
      contextPassageOrPrompt:
        "Cue Card: Describe an energetic teacher you had.\n- Who this person was\n- What subject they taught\n- What made them special\n- And explain why you remember them.",
      commonWrongChoice:
        "Candidate says: 'The teacher was Mr. Ahmadi. He taught physics. He was special because he did experiments. I remember him because he was kind.' (زمان صرف شده: ۲۵ ثانیه! و سکوت طولانی)",
      whyWrongFa:
        "داوطلب به هر سوال فقط یک جمله پاسخ داده و متوقف شده است. کیوکارت یک فرم مصاحبه اداری نیست؛ بلکه چارچوبی برای یک مونولوگ روایی (Storytelling) است.",
      correctChoice:
        "روایت داستان‌گونه با PPF: 'To be completely honest, if I look back at my high school years, Mr. Ahmadi immediately springs to mind. Back then, physics was considered a dreaded chore... Nowadays, whenever I face complex analytical problems, I still employ his visualization tricks... In the future, I hope to emulate that exact pedagogical style.'",
      whyCorrectFa:
        "داستان از گذشته به حال و سپس به آینده پیوند می‌خورد و به راحتی ۱۲۰ ثانیه با واژگان غنی پوشش داده می‌شود.",
      examinerSecretFa:
        "اگزمینر هرگز کیفیت یادداشت‌های کاغذی شما را نمره نمی‌دهد؛ نمره فقط بر اساس روانی کلام و توانایی ادامه صحبت بدون وقفه داده می‌شود.",
    },
  ],

  drills: [
    {
      id: "spk2-q1",
      orderNumber: 1,
      promptFa: "کدام ساختار عبارتی برای انتقال از خاطره گذشته به چشم‌انداز آینده در انتهای پارت ۲ مناسب‌ترین نمره باند ۸ را تولید می‌کند؟",
      promptEn: "Select the most cohesive Band 8 discourse marker to transition into the Future phase of your Cue Card story.",
      options: [
        "Looking ahead, if circumstances permit, I would jump at the opportunity to revisit that remarkable place and explore its lesser-known trails.",
        "And in the future I will go there again with my family because it is good.",
        "That is all about my topic. Thank you.",
        "Future is very unpredictable so I do not know what will happen.",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#HypotheticalConditionalBridge",
      explanation: {
        briefFa: "گزینه ۱ بی‌نقص است: استفاده از شرطی نوع دوم ترکیبی ('if circumstances permit, I would jump at...') و اصطلاح 'jump at the opportunity'.",
        detailedFa:
          "این عبارت هم تنوع گرامری (GRA) را بالا می‌برد و هم انتقال زمانی روانی ایجاد می‌کند. گزینه ۳ با گفتن 'That is all' قبل از پایان وقت اگزمینر نمره را کم می‌کند.",
        cambridgeTipFa:
          "هرگز خودتان نگویید 'That's all'؛ بگذارید اگزمینر با لبخند و عبارت 'Thank you' صحبت شما را قطع کند.",
      },
    },
    {
      id: "spk2-q2",
      orderNumber: 2,
      promptFa: "هنگام یادداشت‌برداری ۱ دقیقه‌ای قبل از شروع پارت ۲، کدام استراتژی بیشترین بازدهی نمره را ایجاد می‌کند؟",
      promptEn: "What is the optimal note-taking strategy during the 1-minute preparation window?",
      options: [
        "Jotting down 4 to 6 sophisticated topical collocations and adjectives vertically (e.g. 'indelible impression', 'watershed moment')",
        "Writing full complete grammatical sentences covering every single bullet point in writing",
        "Writing down Persian translations of sentences and trying to translate them word-by-word",
        "Putting down your pencil and just staring at the examiner to show confidence",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#VerticalCollocationNoteTaking",
      explanation: {
        briefFa: "گزینه ۱ درست است: یادداشت عمودی کالوکیشن‌ها و واژگان موضوعی قوی.",
        detailedFa:
          "نوشتن جملات کامل وقت شما را می‌سوزاند (در ۱ دقیقه حداکثر ۲ جمله ناقص نوشته می‌شود). نوشتن عمودی کلیدواژه‌های موضوعی باعث می‌شود چشم شما حین صحبت سریعاً آنها را ببیند و در جمله طبیعی استفاده کند.",
        cambridgeTipFa:
          "اگزمینر کاغذ یادداشت شما را نمره نمی‌دهد؛ کاغذ صرفاً تخته پرش ذهنی برای روانی بیان شماست.",
      },
    },
  ],
};
