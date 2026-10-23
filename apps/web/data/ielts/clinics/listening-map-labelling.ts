import type { IeltsClinicData } from "@endoora/contracts";

export const LISTENING_MAP_LABELLING_CLINIC: IeltsClinicData = {
  id: "listening-map-labelling",
  skill: "listening",
  titleFa: "جهت‌یابی بی‌نقص در نقشه‌ها و دیاگرام‌ها",
  titleEn: "Map & Plan Navigational Pointers",
  targetBands: "باند ۷.۰ تا ۸.۵",
  estimatedMinutes: 18,
  heroIcon: "🗺️",
  badgeLabelFa: "قطب‌نمای نقشه و دیاگرام",
  hurdleSummaryFa:
    "رمزگشایی از اصطلاحات فضایی، ساعت‌گردی و موقعیت‌های جغرافیایی در نقشه‌های پارت ۲ لیسنینگ آیلتس بدون گم کردن رد پای گوینده.",

  strategyGuide: {
    corePrinciplesFa: [
      "نقطه شروع (Starting Point) را فوراً روی نقشه پیدا کنید: گوینده همیشه از یک درب ورودی (Main Entrance)، لابی، یا ایستگاه راهنما (Information Desk) شروع به حرکت می‌کند. نوک قلم خود را روی نقطه شروع بگذارید.",
      "همگام با گوینده راه بروید: خود را یک گردشگر تصور کنید که در راهرو قدم می‌زند. چپ و راست بر اساس جهت نگاه شما در راهرو تعیین می‌شود نه لبه کاغذ مانیتور!",
      "جهت‌های جغرافیایی (North, South, East, West): به گوشه نقشه نگاه کنید؛ اگر علامت قطب‌نما (Compass Rose) وجود دارد، گوینده به جای چپ و راست از North-Eastern corner یا South-Facing wing استفاده خواهد کرد.",
      "حروف اضافه مکانی کلیدی: کلماتی مثل 'Adjacent to' (کنار)، 'Opposite' (دقیقاً روبرو، آن طرف راهرو)، 'Tucked away behind' (مخفی شده در پشت) و 'At the far end' (در انتهای راهرو).",
    ],
    goldenFormulaFa:
      "نوک مداد روی نقطه شروع $\\rightarrow$ تعقیب کلمات حرکتی (Turn left, Proceed along) $\\rightarrow$ انطباق با حروف الفبای روی نقشه.",
    goldenFormulaEn:
      "Anchor at Entrance $\\rightarrow$ Track speaker's forward perspective $\\rightarrow$ Match spatial prepositions to lettered pins.",
    timeManagementTipFa:
      "در فرصت قبل از شروع صوت، نام تمام ساختمان‌های ثابت را که روی نقشه چاپ شده‌اند (مثل Library, Cafe, Fountain) اسکن کنید زیرا گوینده از آن‌ها به عنوان نقطه عطف (Landmarks) استفاده می‌کند.",
    keyVocabulary: [
      { word: "adjacent to", fa: "همجوار، چسبیده به", ipa: "/əˈdʒeɪ.sənt tuː/" },
      { word: "opposite", fa: "روبرو، در طرف مقابل", ipa: "/ˈɒp.ə.zɪt/" },
      { word: "cul-de-sac", fa: "بن‌بست، انتهای بن‌بست", ipa: "/ˈkʌl.də.sæk/" },
      { word: "junction / intersection", fa: "تقاطع، سه‌راهی یا چهارراه", ipa: "/ˈdʒʌŋk.ʃən/" },
    ],
  },

  trapDeconstructions: [
    {
      id: "trap-1-paper-left-vs-walk-left",
      trapTitleFa: "تله چپ کاغذ در برابر چپ مسیر (Paper-Left vs Path-Left)",
      trapTitleEn: "Failing to Rotate Perspective Relative to Movement",
      contextPassageOrPrompt:
        "Transcript: 'As you enter through the South Gates and walk up the main path, take the second pathway on your right. The gift shop is the second pavilion on your left.'",
      commonWrongChoice: "انتخاب ساختمانی که در سمت چپ نقشه کاغذ کشیده شده است.",
      whyWrongFa:
        "وقتی در مسیر به سمت شمال حرکت می‌کنید، راست و چپ شما تغییر می‌کند. چرخش به سمت راست و سپس نگاه به سمت چپ جهت جدیدی را شکل می‌دهد.",
      correctChoice: "دنبال کردن زاویه نگاه گوینده از جنوب به شمال",
      whyCorrectFa: "همیشه باید زاویه دید خود را همسو با جهت گام‌های گوینده در نظر بگیرید.",
      examinerSecretFa:
        "اگزمینر با استفاده از واژه‌هایی مثل 'Face the building and turn around' عمداً جهت عقربه‌های ساعت را برای داوطلبان بی‌دقت معکوس می‌کند.",
    },
  ],

  drills: [
    {
      id: "map-q1",
      orderNumber: 1,
      promptFa: "بر اساس نشانی داده شده، مکان 'اتاق سمعی و بصری' کجاست؟",
      promptEn: "Transcript: 'Standing in the central reception atrium with your back to the exterior revolving doors, proceed past the reception counter. You will see two corridors; ignore the eastern wing. Take the western corridor, and the Audio-Visual lab is the first doorway on your right, directly opposite the computer room.'\nWhere is the Audio-Visual Lab?",
      options: [
        "First door on the right along the western corridor",
        "At the end of the eastern corridor",
        "Inside the central reception atrium",
        "Directly next to the revolving exterior doors",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#DirectionalNavigationTrap",
      explanation: {
        briefFa: "گزینه ۱ صحیح است: اولین درب سمت راست در راهروی غربی.",
        detailedFa:
          "گوینده صریحاً می‌گوید: 'Take the western corridor, and the Audio-Visual lab is the first doorway on your right'. راهروی شرقی یک تله بود که گوینده گفت ignore the eastern wing.",
        cambridgeTipFa:
          "عبارت 'ignore X' یا 'don't take the corridor on the...' نشانه حذف سریع آن شاخه از گزینه‌هاست.",
      },
    },
    {
      id: "map-q2",
      orderNumber: 2,
      promptFa: "بر اساس مکالمه، 'باجه امانت چمدان' دقیقاً در کجای محوطه راه‌آهن واقع شده است؟",
      promptEn: "Transcript: 'Exiting the ticket hall through the northern turnstiles onto Platform 1, you will spot the passenger waiting lounge immediately to your left. If you walk past the lounge toward the clock tower at the far western corner, the luggage storage office is tucked away behind the postal kiosk.'\nWhere is the luggage storage office?",
      options: [
        "Tucked away behind the postal kiosk near the western clock tower",
        "Inside the ticket hall before passing through turnstiles",
        "Directly next to the northern turnstiles on Platform 1",
        "Inside the passenger waiting lounge on the left",
      ],
      correctAnswerIndex: 0,
      trapTypeBadge: "#LandmarkSequenceTracking",
      explanation: {
        briefFa: "گزینه ۱ صحیح است: پشت کیوسک پستی در نزدیکی برج ساعت غربی.",
        detailedFa:
          "گوینده به ترتیب از گیت‌های شمالی $\\rightarrow$ سالن انتظار $\\rightarrow$ عبور به سمت برج ساعت غربی حرکت کرده و مکان را 'tucked away behind the postal kiosk' معرفی می‌کند.",
        cambridgeTipFa:
          "اصطلاح 'tucked away behind' یعنی پنهان شده در پشت یک ساختمان دیگر.",
      },
    },
  ],
};
