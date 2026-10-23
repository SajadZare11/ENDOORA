import type { IeltsClinicData } from "@endoora/contracts";

export const WRITING_TASK1_OVERVIEW_CLINIC: IeltsClinicData = {
  id: "writing-task1-overview",
  skill: "writing",
  titleFa: "فرمول طلایی بند ۸ برای Overview تسک ۱",
  titleEn: "Task 1 Overview Master Formulation",
  targetBands: "باند ۷.۰ تا ۹.۰",
  estimatedMinutes: 22,
  heroIcon: "📈",
  badgeLabelFa: "معماری اورویو بند ۸",
  hurdleSummaryFa:
    "مهم‌ترین جمله کل رایتینگ تسک ۱ که تعیین می‌کند نمره Task Achievement شما به بند ۷ به بالا می‌رسد یا روی ۵ قفل می‌شود: نگارش اورویو دو جمله‌ای بدون آمار عددی.",

  strategyGuide: {
    corePrinciplesFa: [
      "قانون آهنینی که نمره ۶ را به ۵ تبدیل می‌کند: اگر رایتینگ تسک ۱ شما Overview شفاف نداشته باشد، اگزمینر مجاز نیست به شما نمره‌ای بالاتر از ۵ در Task Achievement بدهد.",
      "هیچ عدد و رقمی در اورویو راه ندارد: اورویو خلاصه روندهای کلان (Overall Trends) است، نه گزارش ریز داده‌ها (مثلا ننویسید 'it rose to 45%').",
      "فرمول ۲ جمله‌ای استاندارد بند ۸: جمله ۱: روند کلی صعودی/نزولی یا تغییر غالب + جمله ۲: بیشترین/کمترین یا استثنای چشمگیر نمودار.",
      "عبارت کلیدی شروع‌کننده: همیشه با 'Overall, it is readily apparent that...' یا 'In general, what stands out from the chart is that...' آغاز کنید تا اگزمینر در نگاه اول آن را تشخیص دهد.",
    ],
    goldenFormulaFa:
      "جمله اول: روند عمومی همه متغیرها (General Trend) + جمله دوم: برجسته‌ترین اوج یا نقطه عطف متضاد (Striking Contrast or Exception). بدون هیچ عدد و رقم!",
    goldenFormulaEn:
      "Overall, [Macro-Trend across all categories], whereas [Single highest peak or sharpest anomaly]. NO raw statistical percentages allowed.",
    timeManagementTipFa:
      "اورویو را بلافاصله پس از پارافریز صورت سوال (پاراگراف دوم) بنویسید؛ تا اگر وقت کم آوردید، نمره Task Achievement شما تضمین شده باشد.",
    keyVocabulary: [
      { word: "overall trend", fa: "روند کلی نمودار", ipa: "/ˈəʊ.vər.ɔːl trend/" },
      { word: "upward trajectory", fa: "مسیر صعودی", ipa: "/ˈʌp.wəd trəˈdʒek.tər.i/" },
      { word: "downward trajectory", fa: "مسیر نزولی", ipa: "/ˈdaʊn.wəd trəˈdʒek.tər.i/" },
      { word: "anomaly", fa: "ناهنجاری، استثنای آماری", ipa: "/əˈnɒm.ə.li/" },
      { word: "plateaued", fa: "ثابت ماندن پس از رشد (به سطح مسطح رسیدن)", ipa: "/ˈplæt.əʊd/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-cramming-numbers",
      trapTitleFa: "تله انباشت اعداد و ارقام در اورویو (Data Dumping Trap)",
      trapTitleEn: "Including Percentages and Values in the Overview",
      contextPassageOrPrompt:
        "Prompt: The line graph shows the proportion of internet users in three countries (UK, Japan, Mexico) from 2000 to 2020.",
      commonWrongChoice:
        "Overview: 'Overall, internet users in the UK grew from 40% to 92%, while Japan increased from 30% to 85% and Mexico started at 10%.'",
      whyWrongFa:
        "این جمله اورویو نیست، بلکه گزارش آماری و خلاصه بدنه است. وارد کردن اعداد خام به اورویو نمره Task Achievement را تخریب می‌کند.",
      correctChoice:
        "Overview: 'Overall, all three countries witnessed a substantial upward trajectory in internet penetration over the period, with the UK consistently recording the highest figures throughout.'",
      whyCorrectFa:
        "بدون ذکر حتی یک عدد، دو ویژگی ماکرو را بیان می‌کند: ۱) رشد عمومی در هر سه کشور، ۲) رتبه اول همیشگی بریتانیا.",
      examinerSecretFa:
        "معیار رسمی بند ۷ کمبریج تصریح می‌کند: 'Presents a clear overview of main trends, differences or stages'. اعداد متعلق به پاراگراف‌های بدنه تحلیلی هستند.",
    },
    {
      id: "trap-2-missing-exception",
      trapTitleFa: "تله نادیده گرفتن استثنای نمودار (Single-Trend Blindspot)",
      trapTitleEn: "Ignoring the Sole Decreasing Category",
      contextPassageOrPrompt:
        "Prompt: Bar chart showing car production in 5 European nations. 4 countries rose, but Germany fell sharply.",
      commonWrongChoice:
        "Overview: 'Overall, car manufacturing experienced positive growth across Europe during the surveyed timeframe.'",
      whyWrongFa:
        "ادعای رشد در کل اروپا غلط است، چون بزرگ‌ترین خودروساز (آلمان) سقوط شدیدی داشته و این استثنا از قلم افتاده است.",
      correctChoice:
        "Overview: 'Overall, while automotive manufacturing expanded across the vast majority of surveyed nations, Germany represented a notable exception by recording a marked decline.'",
      whyCorrectFa:
        "هر دو جنبه را صادقانه و حرفه‌ای بازتاب می‌دهد: رشد در اکثریت، سقوط استثنایی در آلمان.",
      examinerSecretFa:
        "نمودارهایی که یک شاخص برعکس بقیه دارند، تله عمدی اگزمینر برای سنجش جامعیت اورویو داوطلب هستند.",
    },
  ],

  drills: [
    {
      id: "t1ov-q1",
      orderNumber: 1,
      promptFa: "کدام یک از گزینه‌های زیر یک Overview بی‌نقص و بند ۸ برای نمودار خطی سه کشور است؟",
      promptEn: "Identify the best Band 8+ Overview for a graph where renewable energy rose in all 4 nations, with Norway leading at all times.",
      passageSnippet:
        "Line Graph: Renewable electricity production in Norway, Germany, Spain, and Poland (2010–2025). All rose steadily; Norway hovered between 95%–98%, while Poland rose from 5% to 22%.",
      options: [
        "Overall, renewable electricity generation demonstrated an upward trend across all four nations, with Norway maintaining an overwhelming supremacy throughout the timeframe.",
        "Overall, Norway had 98% clean energy, whereas Poland had 5% in 2010 and climbed up to 22% by the end of 2025.",
        "Overall, clean power is very good for saving the environment and stopping global warming in European nations.",
        "In conclusion, Poland was the lowest country and Norway was the highest country.",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#Band8MacroSynthesis",
      explanation: {
        briefFa: "گزینه ۱ بی‌نقص است: روند کلی را به زیبایی بیان کرده و برتری مداوم نروژ را بدون ورود داده‌های عددی نام برده است.",
        detailedFa:
          "گزینه ۲ آمار عددی ریخته است؛ گزینه ۳ انشا و نظر شخصی درباره محیط زیست نوشته که در تسک ۱ اکیداً ممنوع است؛ گزینه ۴ با In conclusion شروع شده که برای نتیجه‌گیری تسک ۲ است نه اورویو تسک ۱.",
        cambridgeTipFa:
          "کلمات 'maintaining an overwhelming supremacy' و 'upward trajectory' نشان‌دهنده واژگان آکادمیک سطح C1 هستند.",
      },
    },
    {
      id: "t1ov-q2",
      orderNumber: 2,
      promptFa: "در فرآیند ۲ مرحله‌ای تولید چای سیاه، بهترین اورویو چیست؟",
      promptEn: "Select the most effective overview for a diagram depicting a 6-stage mechanical tea production process.",
      passageSnippet:
        "Process Diagram: Stages include Plucking $\\rightarrow$ Withering $\\rightarrow$ Crushing $\\rightarrow$ Fermenting $\\rightarrow$ Drying $\\rightarrow$ Packaging.",
      options: [
        "Overall, the commercial production of black tea comprises six sequential linear stages, initiating with hand plucking of mature leaves and culminating in consumer packaging.",
        "Overall, tea is plucked by workers in the fields and then dried in very hot ovens before being sold in grocery markets.",
        "Overall, the process takes approximately three weeks and requires 45 industrial machines.",
        "Overall, drinking tea has been part of British tradition since the seventeenth century.",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#ProcessOverviewRule",
      explanation: {
        briefFa: "گزینه ۱ استاندارد طلایی دیاگرام فرآیند است: شمارش مراحل کلان و اشاره به گام نخست و گام نهایی.",
        detailedFa:
          "برای فرآیندها، بهترین اورویو ذکر تعداد مراحل (six sequential linear stages)، نقطه آغاز (initiating with...) و نقطه پایان (culminating in...) است.",
        cambridgeTipFa:
          "ساختار 'initiating with X and culminating in Y' نمره Lexical Resource و Cohesion شما را به سقف می‌رساند.",
      },
    },
  ],
};
