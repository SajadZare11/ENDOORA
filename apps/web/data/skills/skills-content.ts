export type SkillKey = "listening" | "speaking" | "reading" | "writing" | "vocabulary" | "grammar";

export interface QuickToolItem {
  id: string;
  phraseEn: string;
  phraseFa: string;
  contextFa: string;
  pronunciationTipFa?: string;
  categoryTag: string;
}

export interface MiniPracticeQuestion {
  id: string;
  orderNumber: number;
  promptFa: string;
  promptEn?: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    briefFa: string;
    detailedFa: string;
    goldenRuleFa: string;
  };
}

export interface PersianL1Fix {
  id: string;
  titleFa: string;
  persianRootFa: string;
  wrongEn: string;
  correctEn: string;
  whyFixFa: string;
  goldenTipFa: string;
}

export interface ActionPlanMilestone {
  step: number;
  levelBadge: string;
  titleFa: string;
  dailyRoutineFa: string;
  coreActionsFa: string[];
  recommendedTool: {
    titleFa: string;
    href: string;
    icon: string;
  };
}

export interface SkillPageData {
  slug: SkillKey;
  icon: string;
  titleFa: string;
  titleEn: string;
  cefrRange: string;
  heroBadgeFa: string;
  heroCatchphraseFa: string;
  heroDescriptionFa: string;
  quickToolkit: {
    sectionTitleFa: string;
    sectionDescFa: string;
    items: QuickToolItem[];
  };
  miniPractice: {
    sectionTitleFa: string;
    sectionDescFa: string;
    questions: MiniPracticeQuestion[];
  };
  l1Fixes: {
    sectionTitleFa: string;
    sectionDescFa: string;
    fixes: PersianL1Fix[];
  };
  actionPlan: {
    sectionTitleFa: string;
    sectionDescFa: string;
    milestones: ActionPlanMilestone[];
  };
  relatedModules: Array<{
    title: string;
    desc: string;
    href: string;
    badge: string;
    icon: string;
  }>;
}

export const SKILLS_CONTENT: Record<SkillKey, SkillPageData> = {
  listening: {
    slug: "listening",
    icon: "🎧",
    titleFa: "مهارت شنیداری و ادراک صوتی",
    titleEn: "Listening Comprehension",
    cefrRange: "A1 تا C2",
    heroBadgeFa: "گوش دادن بدون ترجمه در ذهن",
    heroCatchphraseFa: "دیگه لازم نیست کلمه به کلمه تو سرت ترجمه کنی؛ گفتار سریع انگلیسی رو مثل آب خوردن بفهم!",
    heroDescriptionFa: "بزرگ‌ترین گیر ما فارسی‌زبان‌ها توی شنیدن اینه که تا می‌خوایم یه کلمه رو تو ذهنمون به فارسی برگردونیم، طرف سه تا جمله بعدی رو هم گفته و کلاً رشته کلام از دستمون درمیره! اینجا با یادگیری پیوستگی کلام (Connected Speech)، حذف صداها (Elision) و شکار کلمات کلیدی، گوش‌هات رو طوری تربیت می‌کنی که مثل زبان مادری بشنوی.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار فوری شنیداری (Quick Toolkit)",
      sectionDescFa: "۵ عبارت طلایی و فوق‌العاده کاربردی که هر روز در پادکست‌ها، فیلم‌ها و مکالمات واقعی می‌شنوی:",
      items: [
        {
          id: "lis-tool-1",
          phraseEn: "Whaddya think?",
          phraseFa: "نظرت چیه؟ چی فکر می‌کنی؟",
          contextFa: "وقتی توی یک گپ صمیمی یا جلسه می‌خوای خیلی سریع نظر طرف مقابل رو بپرسی.",
          pronunciationTipFa: "در گفتار محاوره‌ای به جای /wɒt duː juː θɪŋk/، دقیقاً شبیه «وات‌یا تینک؟» شنیده می‌شه.",
          categoryTag: "گفتار متصل روزمره",
        },
        {
          id: "lis-tool-2",
          phraseEn: "I'm gonna head out.",
          phraseFa: "من دیگه باید راه بیفتم / من برم دیگه.",
          contextFa: "پایان مهمانی، پایان ساعت کاری یا خداحافظی دوستانه در کافه.",
          pronunciationTipFa: "به جای «I am going to leave»، بومی‌ها می‌گن «آیم گانا هِد آوت».",
          categoryTag: "اصطلاحات خودمانی",
        },
        {
          id: "lis-tool-3",
          phraseEn: "Coulda, woulda, shoulda!",
          phraseFa: "گذشته‌ها گذشته / کار از کار گذشته (حسرت فایده نداره)!",
          contextFa: "وقتی کسی مدام می‌گه «کاش اون کار رو می‌کردم» و می‌خوای بهش بگی دیگه فایده نداره غصه بخوری.",
          pronunciationTipFa: "تلفظ روان: «کودا، وودا، شودا». ادغام Could have, Would have, Should have.",
          categoryTag: "اصطلاحات پرکاربرد",
        },
        {
          id: "lis-tool-4",
          phraseEn: "Lemme know when you're free.",
          phraseFa: "هروقت وقتت آزاد شد بهم خبر بده.",
          contextFa: "هماهنگی قرارهای کاری، دوستانه یا پایان چت صمیمانه.",
          pronunciationTipFa: "به جای «Let me know»، صدای t حذف شده و «لِمی نُو» تلفظ می‌شه.",
          categoryTag: "کاهش و حذف صدا (Elision)",
        },
        {
          id: "lis-tool-5",
          phraseEn: "Outta nowhere!",
          phraseFa: "یهویی / کاملاً ناگهانی و بی‌مقدمه!",
          contextFa: "تعریف کردن یک اتفاق غافلگیرکننده در داستان‌گویی روزمره.",
          pronunciationTipFa: "تلفظ پیوسته «آوتا نُوور» به جای «Out of nowhere».",
          categoryTag: "داستان‌گویی مکالمه‌ای",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی شنیداری (Mini-Practice)",
      sectionDescFa: "با حل این تست‌های فوری، گوشت رو برای شنیدن گفتار واقعی انگلیسی آماده کن. بعد از انتخاب، فیدبک سبز و قرمز آنی دریافت می‌کنی!",
      questions: [
        {
          id: "lis-q1",
          orderNumber: 1,
          promptFa: "در مکالمه سریع و محاوره‌ای، یک فرد بومی عبارت «Did you eat yet?» را معمولاً چطور بیان می‌کند که ما متوجه آن نمی‌شویم؟",
          promptEn: "How is 'Did you eat yet?' typically pronounced in fast casual speech?",
          options: [
            "Did you eat yet (تلفظ کاملاً کتابی با مکث بین تک‌تک واژه‌ها)",
            "Jeet yet? / /dʒiːt jɛt/ (ادغام شدید صداها و حذف فعل کمکی)",
            "Do you eat yet? (تغییر زمان فعل به حال ساده)",
            "Have you eat yet? (استفاده از شکل کامل زمان حال کامل)",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! دقیقاً به همین صورته.",
            detailedFa: "در گفتار سریع آمریکایی، صدای /d/ در انتهای Did با صدای /j/ در ابتدای you ترکیب شده و صدای /dʒ/ ایجاد می‌کند. در مکالمات فوق‌سریع روزمره، کل این ساختار خلاصه شده و فقط صدایی شبیه «Jeet yet?» شنیده می‌شود!",
            goldenRuleFa: "در شنیدن مکالمات واقعی، منتظر تلفظ کلمه‌به‌کلمه کتابی نباش؛ گوشت رو به پیوند صداها (Assimilation & Linking) عادت بده.",
          },
        },
        {
          id: "lis-q2",
          orderNumber: 2,
          promptFa: "وقتی یک انگلیسی‌زبان می‌گوید «I can do it» در مقایسه با «I can't do it»، اصلی‌ترین راه تشخیص فرم منفی در گفتار سریع چیه؟",
          promptEn: "What is the primary acoustic cue to distinguish 'can' vs 'can't' in fast speech?",
          options: [
            "شنیدن صدای بلند و واضح حرف /t/ در آخر کلمه can't",
            "تکیه صوتی قوی‌تر (Stress) و صدای کشیده‌تر روی can't، در حالی که can مثبت معمولاً کوتاه، ضعیف و شبیه /kən/ ادا می‌شود",
            "ساکت شدن کامل گوینده بعد از کلمه can't",
            "هیچ فرقی ندارند و فقط از اشاره دست گوینده می‌توان حدس زد",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "فوق‌العاده بود! نکته بسیار مهمی رو تشخیص دادی.",
            detailedFa: "افراد بومی معمولاً در انتهای can't صدای /t/ را رها نمی‌کنند (Glottal Stop می‌گذارند)، بنابراین گوش دادن به دنبال صدای /t/ خطاست! در عوض، خود کلمه can't با تکیه صوتی سنگین و مصوت باز /æ/ یا /ɑː/ ادا می‌شود، در حالی که can مثبت بی‌تکیه است و مصوت آن به شوآ (/kən/) تبدیل می‌شود.",
            goldenRuleFa: "در زبان انگلیسی، کلمات منفی‌ساز همیشه استرس وزنی (Heavy Stress) می‌گیرند و پررنگ‌تر شنیده می‌شوند.",
          },
        },
        {
          id: "lis-q3",
          orderNumber: 3,
          promptFa: "در پادکست‌های خبری، سخنرانی‌ها و فیلم‌ها، برای اینکه رشته کلام گوینده از دستت در نره، باید تمرکزت روی چه کلماتی باشه؟",
          promptEn: "To follow fast speech without getting lost, which words should you focus on?",
          options: [
            "حروف اضافه مثل in, at, on و ضمایر فاعلی",
            "کلمات محتوایی (Content Words) شامل اسم‌ها، افعال اصلی و صفت‌های کلیدی",
            "تک‌تک کلمات به ترتیب چیدمان جمله بدون هیچ اولویتی",
            "فقط کلمه اول و کلمه آخر هر جمله",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "کاملاً درسته! تکنیک شکار کلمات کلیدی.",
            detailedFa: "کلمات ساختاری (Structure Words) مثل حروف تعریف، حروف اضافه و افعال کمکی معمولاً با حجم صدای ضعیف‌تر و سریع‌تر خوانده می‌شوند. مغز شما برای درک معنا فقط نیاز دارد اسم‌ها و افعال اصلی را شکار کند تا کل مفهوم بازسازی شود.",
            goldenRuleFa: "۸۰ درصد معنا در ۲۰ درصد کلمات کلیدی جمله نهفته است؛ انرژی گوشت رو برای تحلیل حروف اضافه تلف نکن!",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در شنیداری (L1 Fixes)",
      sectionDescFa: "ریشه اشتباهات و سوءتفاهم‌های شایع ایرانی‌ها هنگام گوش دادن به انگلیسی و راهکارهای غلبه بر آن‌ها:",
      fixes: [
        {
          id: "lis-fix-1",
          titleFa: "تله ترجمه همزمان در ذهن (Mental Translation Trap)",
          persianRootFa: "از دوران مدرسه عادت کردیم که تا صدایی شنیدیم، اول ترجمه فارسیش رو توی ذهن بسازیم و بعد ادراک کنیم!",
          wrongEn: "گوش دادن با تاخیر ۲ ثانیه‌ای به ازای هر کلمه و هنگ کردن مغز در جمله سوم",
          correctEn: "ادراک مستقیم مفاهیم از طریق تصویرسازی ذهنی بدون واسطه کلمات فارسی",
          whyFixFa: "سرعت نرمال صحبت کردن در انگلیسی بین ۱۵۰ تا ۱۸۰ کلمه در دقیقه است. مغز انسان از نظر فیزیولوژیک توانایی ترجمه دوطرفه این حجم واژه در زمان واقعی را ندارد.",
          goldenTipFa: "هنگام گوش دادن، صحنه و تصاویر ماجرا رو در ذهنت مجسم کن (Mental Imagery)، نه کلمات فارسی رو!",
        },
        {
          id: "lis-fix-2",
          titleFa: "گیر دادن به کلمات ناشناخته (Unknown Word Obsession)",
          persianRootFa: "ترس از اینکه اگر یک لغت از ده لغت جمله را نشنویم یا بلد نباشیم، کل پیام از بین رفته است.",
          wrongEn: "قفل کردن ذهن روی یک کلمه مبهم که ۵ ثانیه پیش گفته شد و نشنیدن ادامه صحبت",
          correctEn: "نادیده گرفتن واژه ناشناخته و بازسازی پازل معنا از روی بقیه جمله",
          whyFixFa: "بیشتر اوقات کلمه ناشناخته یک صفت تزیینی یا قید کم‌اهمیت است که نبودش تاثیری در پیام اصلی گوینده ندارد.",
          goldenTipFa: "کلمات ناشناخته رو مثل دست‌اندازهای جاده بدون؛ سرعتت رو کم نکن، از روشون رد شو و مسیر رو ادامه بده!",
        },
        {
          id: "lis-fix-3",
          titleFa: "انتظار تلفظ شمرده و استودیویی",
          persianRootFa: "سال‌ها گوش دادن به نوارهای ضبط شده آرام کتاب‌های درسی که هیچ شباهتی به واقعیت خیابان‌های لندن یا نیویورک ندارند.",
          wrongEn: "انتظار شنیدن 'Going to' و 'Want to' به صورت جداگانه با تلفظ حروف الفبایی",
          correctEn: "عادت دادن گوش به شکل‌های واقعی 'Gonna', 'Wanna', 'Gotta', 'Dunno'",
          whyFixFa: "در زبان انگلیسی طبیعی، فواصل بین کلمات حذف شده و حروف انتهایی و ابتدایی در هم حل می‌شوند.",
          goldenTipFa: "روزی ۱۰ دقیقه ولاگ‌های یوتیوب یا مصاحبه‌های خیابانی غیررسمی رو با سرعت طبیعی گوش بده.",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر شنیداری (Action Plan)",
      sectionDescFa: "گام‌های روزانه و ابزارهای پیشنهادی ایندورا برای ارتقای گوش دادن از مبتدی تا تسلط کامل:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "عادت‌سازی سیستم شنوایی و تکنیک سایه‌زنی",
          dailyRoutineFa: "روزانه ۱۵ دقیقه گوش دادن متمرکز",
          coreActionsFa: [
            "گوش دادن به پادکست‌های سطح‌بندی شده ساده با متن همزمان",
            "اجرای تکنیک سایه‌زنی (Shadowing): تکرار جملات با فاصله نیم‌ثانیه پشت سر گوینده",
            "حل تمرین‌های شنیداری پایه برای تفکیک اعداد، ساعت‌ها و نام‌ها",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (بخش شنیداری با صوت نهایی)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "رمزگشایی گفتار متصل و پادکست‌های موضوعی",
          dailyRoutineFa: "روزانه ۲۵ دقیقه گوش دادن فعال",
          coreActionsFa: [
            "تماشای ویدیوهای کوتاه TED-Ed یا یوتیوب؛ بار اول با زیرنویس انگلیسی، بار دوم بدون زیرنویس",
            "یادداشت‌برداری از کلمات کلیدی (Content Words) هنگام شنیدن خبرهای روزمره",
            "تمرین تشخیص لهجه‌های بریتانیایی، آمریکایی و استرالیایی",
          ],
          recommendedTool: {
            titleFa: "لابراتوار مکالمه و نقش‌آفرینی صوتی",
            href: "/roleplay",
            icon: "🎙️",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "درک مکالمات سریع و تخصصی در شرایط واقعی",
          dailyRoutineFa: "روزانه ۳۰ دقیقه گوش دادن در پس‌زمینه + خلاصه شفاهی",
          coreActionsFa: [
            "شنیدن پادکست‌های تخصصی و سریع بومی (The Daily, NPR, Joe Rogan) با سرعت ۱.۲۵ برابر",
            "گوش دادن در محیط‌های نویزدار و شلوغ برای شبیه‌سازی مکالمات واقعی فرودگاه و دانشگاه",
            "بازگویی و خلاصه‌سازی شفاهی یک مکالمه ۱۰ دقیقه‌ای بلافاصله بعد از اتمام آن",
          ],
          recommendedTool: {
            titleFa: "جعبه واژگان هوشمند (SRS)",
            href: "/vocabulary",
            icon: "💡",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "تمرین تا ۲۰ (زبان دوازدهم)",
        desc: "سوالات شنیداری امتحانات نهایی با پلیر صوتی اختصاصی و تصحیح آنی",
        href: "/high-school/grade-12/tamrin20",
        badge: "امتحانات نهایی",
        icon: "🎓",
      },
      {
        title: "لابراتوار مکالمه هوش مصنوعی",
        desc: "مکالمه صوتی دوطرفه و ارزیابی بی‌درنگ لهجه و تلفظ",
        href: "/roleplay",
        badge: "شبیه‌ساز تعاملی",
        icon: "🎙️",
      },
      {
        title: "فرهنگ و روابط اجتماعی (Small Talk)",
        desc: "آداب خوش‌وبش روزمره، شوخ‌طبعی و هنجارهای فرهنگی انگلیسی",
        href: "/skills/culture",
        badge: "ارتباطات واقعی",
        icon: "🌐",
      },
    ],
  },

  speaking: {
    slug: "speaking",
    icon: "🎙️",
    titleFa: "مهارت مکالمه و روانی کلام",
    titleEn: "Speaking & Spoken Fluency",
    cefrRange: "A1 تا C2",
    heroBadgeFa: "آب کردن یخ مکالمه بدون تپق و مکث",
    heroCatchphraseFa: "ترس از قضاوت و اشتباه گرامری رو بذار کنار؛ راحت و روان حرف دلت رو به انگلیسی بزن!",
    heroDescriptionFa: "خیلی از ما وقتی می‌خوایم انگلیسی صحبت کنیم، صد تا قانون گرامر میاد جلوی چشممون، زبونمون قفل می‌کنه و ترجیح می‌دیم سکوت کنیم! واقعیت اینه که انگلیسی‌زبان‌ها اصلاً دنبال مچ‌گیری نیستن؛ اونا فقط می‌خوان بفهمن چی می‌گی. اینجا با یادگیری اصطلاحات آماده و تکنیک‌های بداهه‌گویی، مکث‌های طولانی رو برای همیشه از بین می‌بری.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار فوری مکالمه (Quick Toolkit)",
      sectionDescFa: "۵ عبارت طلایی برای خرید زمان، پر کردن سکوت و نجات پیدا کردن از مکث‌های خجالت‌آور:",
      items: [
        {
          id: "spk-tool-1",
          phraseEn: "Well, to be perfectly honest...",
          phraseFa: "راستش رو بخوای / اگه بخوام باهات روراست باشم...",
          contextFa: "خرید ۲ تا ۳ ثانیه وقت طلایی برای فکر کردن بدون اینکه طرف فکر کنه هنگ کردی!",
          pronunciationTipFa: "آهسته و طبیعی شروع کن: «وِل، تو بی پِرفِکتلی آنِست...»",
          categoryTag: "خرید زمان (Filler)",
        },
        {
          id: "spk-tool-2",
          phraseEn: "What I'm trying to say is...",
          phraseFa: "منظورم اینه که / حرف حسابم اینه که...",
          contextFa: "وقتی وسط جمله واژه‌ای یادت رفته و می‌خوای همون مفهوم رو با کلمات ساده‌تر بازگو کنی.",
          pronunciationTipFa: "تکنیک بازتعریف (Paraphrasing) برای فرار از بن‌بست واژگانی.",
          categoryTag: "بازتعریف و رفع ابهام",
        },
        {
          id: "spk-tool-3",
          phraseEn: "How should I put this?",
          phraseFa: "چطور بگم آخه؟ / چطور مطرحش کنم؟",
          contextFa: "وقتی می‌خوای درباره یک موضوع حساس، کاری یا پیچیده نظر بدی و دنبال بهترین کلمات می‌گردی.",
          pronunciationTipFa: "پر کردن سکوت به جای گفتن «اوممم... اوممم...».",
          categoryTag: "مدیریت مکث",
        },
        {
          id: "spk-tool-4",
          phraseEn: "That makes total sense!",
          phraseFa: "کاملاً منطقیه! / حرفت کاملاً درسته و قبولت دارم.",
          contextFa: "همراهی صمیمانه و نشان دادن گوش دادن فعال در مکالمه دوستانه یا بیزنسی.",
          pronunciationTipFa: "با لحن انرژی‌بخش بگو: «دَت مِیکس توتِل سِنس!»",
          categoryTag: "همراهی و تایید (Active Listening)",
        },
        {
          id: "spk-tool-5",
          phraseEn: "I see what you mean, but...",
          phraseFa: "می‌فهمم چی می‌گی، ولی...",
          contextFa: "مخالفت محترمانه و حرفه‌ای بدون اینکه لحنت تهاجمی به نظر برسه.",
          pronunciationTipFa: "ابتدا پذیرش و سپس ابراز نظر متفاوت: «آی سی وات یو مین، بات...»",
          categoryTag: "مخالفت محترمانه",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی مکالمه (Mini-Practice)",
      sectionDescFa: "سناریوهای واقعی روزمره رو حل کن و ببین چطور می‌شه مکالمه رو بدون گیر کردن جلو برد:",
      questions: [
        {
          id: "spk-q1",
          orderNumber: 1,
          promptFa: "وسط یک مصاحبه کاری یا گپ دوستانه، ناگهان یک کلمه انگلیسی یادتان می‌رود. بهترین واکنش طبیعی چیه؟",
          promptEn: "When you forget a word in a conversation, what is the best natural response?",
          options: [
            "سکوت کامل کنید و مدام بگویید «Ummm... Ummm...» تا بالاخره لغت یادتان بیاید",
            "از عبارت‌های پرکننده مثل «The word has slipped my mind, but basically...» استفاده کرده و مفهوم را با کلمات ساده‌تر توضیح دهید",
            "معذرت‌خواهی مکرر کنید و بگویید زبان انگلیسی شما خیلی ضعیف است",
            "ناگهان بحث را قطع کرده و موضوع صحبت را عوض کنید",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "عالی بود! فرمول طلایی روانی کلام.",
            detailedFa: "حتی افراد بومی هم گاهی کلمات یادشان می‌رود! گفتن جملاتی مثل «The word has slipped my mind, but it is something you use when...» تسلط بالا و روانی کلام (Fluency) شما را اثبات می‌کند، در حالی که سکوت یا عذرخواهی حس عدم اعتمادبه‌نفس می‌دهد.",
            goldenRuleFa: "روانی کلام (Fluency) یعنی انتقال بی‌وقفه پیام، نه دیکشنری متحرک بودن!",
          },
        },
        {
          id: "spk-q2",
          orderNumber: 2,
          promptFa: "کدام گزینه برای شروع یک گفتگوی خودمانی (Small Talk) با یک همکار بین‌المللی در ساعت ناهار مناسب‌تر و خوشایندتر است؟",
          promptEn: "Which opener is most polite and natural for workplace small talk?",
          options: [
            "Hello, what is your exact salary and why are you not married yet?",
            "Hey! How is your week going so far? Working on anything exciting?",
            "Why are you sitting here alone eating salad?",
            "Do you agree that taxes in your country are unfair?",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "دقیقاً درسته! رعایت حریم شخصی و آداب گفتگوی کوتاه.",
            detailedFa: "پرسیدن درباره روند هفته و پروژه‌های کاری (Safe Topics) بهترین روش شکستن یخ مکالمه است. سوالات درباره درآمد، تاهل یا وضعیت مالی در فرهنگ غربی ورود به حریم ممنوعه محسوب می‌شوند.",
            goldenRuleFa: "مکالمه رو همیشه با موضوعات امن و روزمره (روند کاری، آب‌وهوا، برنامه‌های آخر هفته) شروع کن.",
          },
        },
        {
          id: "spk-q3",
          orderNumber: 3,
          promptFa: "می‌خواهید به دوست خارجی خود که قصد دارد کارش را به صورت احساسی رها کند، یک نصیحت صمیمانه بدهید. کدام ساختار طبیعی‌ترین است؟",
          promptEn: "Which structure is the most natural way to offer friendly advice?",
          options: [
            "If I was in your body, I would not do this.",
            "If I were in your shoes, I would think twice before making that call.",
            "I must order you to keep your current job.",
            "You make a very terrible mistake if you resign.",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! اصطلاح و ساختار شرطی کاملاً بومی.",
            detailedFa: "اصطلاح «in someone's shoes» به معنای «جای کسی بودن» است و ساختار شرطی نوع دوم «If I were in your shoes, I would...» طبیعی‌ترین، همدلانه‌ترین و محترمانه‌ترین شیوه ارائه پیشنهاد و نصیحت در زبان انگلیسی است.",
            goldenRuleFa: "برای نصیحت همدلانه، همیشه از قالب طلایی «If I were in your shoes...» استفاده کن.",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در مکالمه (L1 Fixes)",
      sectionDescFa: "عادت‌های ذهنی زبان مادری که باعث لغزش و تپق زدن در انگلیسی می‌شوند:",
      fixes: [
        {
          id: "spk-fix-1",
          titleFa: "ترجمه واژه‌به‌واژه تعارفات ایرانی",
          persianRootFa: "فرهنگ پرمهر و غنی تعارف در فارسی باعث می‌شود بخواهیم جملاتی مثل «دستت درد نکنه» یا «خسته نباشی» را کلمه به کلمه ترجمه کنیم!",
          wrongEn: "I'm tired of your hand! / Don't be tired!",
          correctEn: "Thank you so much! / I really appreciate your help! / Have a good one!",
          whyFixFa: "در زبان انگلیسی عبارتی به عنوان «خسته نباشی» وجود ندارد. بسته به موقعیت، انگلیسی‌زبانان از تشکر گرم یا آرزوی داشتن ادامه روز خوب استفاده می‌کنند.",
          goldenTipFa: "به جای ترجمه لفظی کلمات، پیام احساسی پشت تعارف (قدردانی یا خداحافظی گرم) رو با اصطلاحات انگلیسی منتقل کن.",
        },
        {
          id: "spk-fix-2",
          titleFa: "اشتباه شایع 'I am agree with you'",
          persianRootFa: "چون در فارسی می‌گوییم «من موافقم» (ترکیب فاعل و صفت)، به اشتباه فعل am را وارد جمله می‌کنیم.",
          wrongEn: "I am agree with you.",
          correctEn: "I agree with you. / I completely agree.",
          whyFixFa: "واژه Agree در زبان انگلیسی خودش یک فعل مستقل است و اصلاً نیازی به افعال to be (am/is/are) ندارد.",
          goldenTipFa: "یادت باشه: Agree فعله! بگو «I agree»، درست مثل اینکه می‌گی «I know»!",
        },
        {
          id: "spk-fix-3",
          titleFa: "کمال‌گرایی افراطی و توقف برای چک کردن گرامر",
          persianRootFa: "ترس شدید از قضاوت شدن یا گرفتن نمره منفی از طرف مقابل، ریشه در سیستم نمره‌دهی مدارس دارد.",
          wrongEn: "سکوت طولانی ۱۵ ثانیه‌ای برای فرمول‌بندی یک جمله بی‌نقص بدون هیچ خطای کوچک",
          correctEn: "صحبت کردن روان حتی با خطای جزئی و اصلاح در ادامه جمله",
          whyFixFa: "در دنیای واقعی، شنونده به جریان پیام و برقراری ارتباط اهمیت می‌دهد نه به رعایت مویی ساختارهای پیچیده.",
          goldenTipFa: "اشتباه کردن تاوان نداره؛ تا اشتباه نکنی، زبونت برای حرف زدن باز نمی‌شه!",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر مکالمه (Action Plan)",
      sectionDescFa: "برنامه روزانه گام‌به‌گام برای بالا بردن اعتمادبه‌نفس و سرعت گفتار:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "شکستن قفل زبان و تکنیک خودگویی (Self-Talk)",
          dailyRoutineFa: "روزانه ۱۰ دقیقه صحبت کردن با خود",
          coreActionsFa: [
            "توصیف کارهای روزمره به انگلیسی با صدای بلند جلوی آینه (مثلاً هنگام آماده کردن صبحانه)",
            "ضبط صدای خود با سناریوهای پایه (معرفی خود، سفارش قهوه) و گوش دادن بدون قضاوت",
            "حفظ کردن ۱۰ عبارت یخ‌شکن کوتاه برای شروع مکالمات ساده",
          ],
          recommendedTool: {
            titleFa: "شبیه‌ساز مکالمه و سناریوهای روزمره",
            href: "/roleplay",
            icon: "🎙️",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "تمرین بداهه‌گویی و مکالمات کاربردی بدون مکث",
          dailyRoutineFa: "روزانه ۲۰ دقیقه نقش‌آفرینی تعاملی",
          coreActionsFa: [
            "تمرین نقش‌آفرینی در ۱۰ موقعیت پرکاربرد (مصاحبه شغلی، تحویل اتاق هتل، خرید در فروشگاه)",
            "استفاده هدفمند از Fillerها (Well, actually, what I mean is) برای از بین بردن مکث‌ها",
            "داستان‌گویی یک دقیقه‌ای درباره یک اتفاق روز بدون توقف کلام",
          ],
          recommendedTool: {
            titleFa: "فرهنگ و روابط اجتماعی (Small Talk)",
            href: "/skills/culture",
            icon: "🌐",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "مذاکره، بحث‌های پیچیده و تسلط بر لحن گفتار",
          dailyRoutineFa: "روزانه ۲۵ دقیقه مکالمه تحلیلی",
          coreActionsFa: [
            "تمرین مناظره و ابراز مخالفت محترمانه در موضوعات انتزاعی و شغلی",
            "استفاده از ضرب‌المثل‌ها و شوخ‌طبعی بومی برای عمق بخشیدن به ارتباط",
            "ارائه پرزنتیشن‌های کاری ۵ دقیقه‌ای همراه با پاسخ به سوالات چالشی مخاطب",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (بخش مکالمه دبیرستان و کنکور)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "لابراتوار مکالمه هوش مصنوعی",
        desc: "نقش‌آفرینی صوتی در ۱۰ سناریوی واقعی کاری و مسافرتی با بازخورد آنی",
        href: "/roleplay",
        badge: "شبیه‌ساز هوشمند",
        icon: "🎙️",
      },
      {
        title: "فرهنگ و مکالمات خودمانی (Small Talk)",
        desc: "چگونه با افراد بین‌المللی ارتباط دوستانه و پایدار برقرار کنیم",
        href: "/skills/culture",
        badge: "روابط اجتماعی",
        icon: "🌐",
      },
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "تثبیت همنشین‌های طلایی و افعال دوکلمه‌ای برای روانی مکالمه",
        href: "/vocabulary",
        badge: "بانک واژگان",
        icon: "💡",
      },
    ],
  },

  reading: {
    slug: "reading",
    icon: "📖",
    titleFa: "مهارت خواندن و درک مطلب",
    titleEn: "Reading Comprehension",
    cefrRange: "A1 تا C1",
    heroBadgeFa: "سریع خواندن بدون دیکشنری مداوم",
    heroCatchphraseFa: "متن‌های انگلیسی رو تند و روان بخون و پیام اصلی رو بدون ورق زدن دیکشنری درک کن!",
    heroDescriptionFa: "وقتی برای خوندن یه مقاله کوتاه بیست بار سراغ دیکشنری بری، هم خسته می‌شی و هم بعد از پنج خط یادت میره اول پاراگراف چی بود! درک مطلب واقعی یعنی حدس زدن معنا از بافت جمله، تندخوانی با تکنیک‌های Skimming و Scanning و شناخت سرنخ‌های نشانه‌گذاری در متن.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار فوری درک مطلب (Quick Toolkit)",
      sectionDescFa: "۵ کلمه ربط استراتژیک که مسیر جریان متن را به شما نشان می‌دهند:",
      items: [
        {
          id: "rd-tool-1",
          phraseEn: "However / Nonetheless",
          phraseFa: "با این حال / اما از طرف دیگر...",
          contextFa: "علامت دوربرگردان متن! جهت استدلال نویسنده ۱۸۰ درجه عوض شده است.",
          pronunciationTipFa: "هر وقت این کلمه رو دیدی، بدون ایده‌ای کاملاً مخالف با جمله قبلی در راهه.",
          categoryTag: "تابلوهای راهنمای متن (Signposts)",
        },
        {
          id: "rd-tool-2",
          phraseEn: "Furthermore / Moreover",
          phraseFa: "علاوه بر این / به علاوه...",
          contextFa: "چسب استدلال؛ یک مدرک یا شاهد محکم دیگر در تایید ادعای قبلی اضافه شد.",
          pronunciationTipFa: "نشانه اینه که نویسنده داره روی همون ایده قبلی پافشاری می‌کنه.",
          categoryTag: "افزودن استدلال",
        },
        {
          id: "rd-tool-3",
          phraseEn: "Consequently / As a result",
          phraseFa: "در نتیجه / به دنبال این اتفاق...",
          contextFa: "پرش به نتیجه‌گیری! اثر مستقیم و عواقب ماجرا همین‌جا توضیح داده شده.",
          pronunciationTipFa: "در تست‌های درک مطلب، پاسخ سوالات علت و معلول معمولاً بعد از این کلمات است.",
          categoryTag: "نتیجه‌گیری مستقیم",
        },
        {
          id: "rd-tool-4",
          phraseEn: "In contrast to / Unlike",
          phraseFa: "برخلافِ / در مقایسه با...",
          contextFa: "بررسی تفاوت‌های دو مفهوم، دو شخص یا دو کشور در یک نگاه.",
          pronunciationTipFa: "کلید پاسخ به سوالات مقایسه‌ای و جدول‌های متنی.",
          categoryTag: "مقایسه و تضاد",
        },
        {
          id: "rd-tool-5",
          phraseEn: "In a nutshell",
          phraseFa: "خلاصه کلام / لب مطلب اینکه...",
          contextFa: "جمع‌بندی فوق‌العاده سریع از زبان نویسنده در انتهای پاراگراف یا مقاله.",
          pronunciationTipFa: "اصطلاحی که پیام نهایی و خلاصه‌ترین فرم متن را ارائه می‌دهد.",
          categoryTag: "خلاصه‌سازی سریع",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی درک مطلب (Mini-Practice)",
      sectionDescFa: "تکنیک‌های تندخوانی و حدس معنا رو توی این تست‌های تحلیلی محک بزن:",
      questions: [
        {
          id: "rd-q1",
          orderNumber: 1,
          promptFa: "هنگام خواندن یک متن طولانی برای درک «ایده اصلی» (Main Idea)، خواندن کدام بخش هر پاراگراف بیشترین بازدهی را دارد؟",
          promptEn: "Which part of a paragraph typically reveals its main idea most efficiently?",
          options: [
            "دقیقاً خط پنجم و جملات میانی پاراگراف",
            "جمله اول (Topic Sentence) و گاهی جمله آخر (Concluding Sentence)",
            "فقط کلماتی که با فونت ایتالیک نوشته شده‌اند",
            "ایده اصلی هیچ‌وقت در ابتدای پاراگراف‌ها نوشته نمی‌شود",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! قانون طلایی ساختار پاراگراف در انگلیسی.",
            detailedFa: "نویسندگان انگلیسی‌زبان مقید به ساختار هستند؛ جمله اول (Topic Sentence) چتر مفهومی کل پاراگراف است و جملات بعدی شواهد و جزئیات هستند. با خواندن جمله اول هر پاراگراف در ۳۰ ثانیه، نقشه کل متن را کشف می‌کنید.",
            goldenRuleFa: "اگر وقتت کمه، فقط جمله اول هر پاراگراف رو بخون تا استخوان‌بندی متن دستت بیاد.",
          },
        },
        {
          id: "rd-q2",
          orderNumber: 2,
          promptFa: "وقتی حین خواندن با یک کلمه کاملاً غریب و دشوار روبرو می‌شوید، بهترین راهکار حرفه‌ای چیه؟",
          promptEn: "When you encounter an unfamiliar word while reading, what is the best strategy?",
          options: [
            "بلافاصله خواندن را متوقف کرده و در دیکشنری جستجو کنید",
            "نقش گرامری کلمه (اسم، فعل، صفت) و بار مثبت یا منفی جملات اطراف را ارزیابی کرده و معنا را از بافت حدس بزنید",
            "متن را کنار بگذارید چون برای سطح شما خیلی سخت است",
            "آن پاراگراف را کاملاً رد کرده و نخوانید",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "فوق‌العاده بود! مهارت استنباط معنا (Contextual Clues).",
            detailedFa: "بیش از ۸۰ درصد کلمات ناآشنا از روی متضادها، مترادف‌ها یا کلمات ربط دوروبرشان قابل پیش‌بینی هستند. توقف مدام برای چک کردن دیکشنری سرعت درک مطلب را ۸۰ درصد کاهش می‌دهد.",
            goldenRuleFa: "به کلمات مثل قطعات یک پازل نگاه کن؛ تصویر کلی با بافت جمله ساخته می‌شه، نه با ترجمه ایزوله یک لغت.",
          },
        },
        {
          id: "rd-q3",
          orderNumber: 3,
          promptFa: "برای پیدا کردن یک عدد خاص، تاریخ تولد یا نام یک شهر در یک متن چندصفحه‌ای، کدام تکنیک سریع‌ترین نتیجه را دارد؟",
          promptEn: "Which technique is fastest for locating specific facts like dates or names?",
          options: [
            "خواندن کلمه به کلمه از اول تا آخر با دقت بالا",
            "تکنیک پویش (Scanning): حرکت چشمی زیگزاگی به دنبال الگوهای دیداری (اعداد یا حروف بزرگ Capital)",
            "ترجمه خط به خط متن روی برگه کاغذ",
            "بلندبلند خواندن متن با صدای واضح",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "کاملاً درسته! تکنیک اسکنینگ (Scanning).",
            detailedFa: "در تکنیک Scanning، شما اصلاً متن را نمی‌خوانید؛ بلکه چشمانتان مثل یک اسکنر لیزری فقط دنبال سرنخ‌های بصری مشخص (اعداد، علائم نگارشی یا اسامی خاص با حروف بزرگ) می‌گردد.",
            goldenRuleFa: "برای درک کلی متن Skim کن؛ برای شکار یک فکت مشخص Scan کن!",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در درک مطلب (L1 Fixes)",
      sectionDescFa: "عادت‌های سنتی مطالعه که سرعت خواندن و درک انگلیسی ما را کاهش می‌دهند:",
      fixes: [
        {
          id: "rd-fix-1",
          titleFa: "توقف پشت هر کلمه ناآشنا",
          persianRootFa: "عادت به خواندن کتاب‌های مدرسه که باید معنای تک‌تک لغات بالای کلمه نوشته می‌شد!",
          wrongEn: "ورق زدن دیکشنری به ازای هر لغتی که در سطر اول و دوم بلد نیستیم",
          correctEn: "پیشروی تا انتهای پاراگراف و حدس زدن ایده اصلی از روی ۹۰ درصد باقی‌مانده متن",
          whyFixFa: "با توقف مکرر، حافظه کوتاه‌مدت خالی می‌شود و رشته استدلال نویسنده کاملاً گم خواهد شد.",
          goldenTipFa: "زیر لغت ناآشنا خط بکش و رد شو! اگر در پایان پاراگراف معنا مبهم ماند، آن‌وقت نگاهش کن.",
        },
        {
          id: "rd-fix-2",
          titleFa: "زیرلب‌خوانی و تکان دادن لب‌ها (Subvocalization)",
          persianRootFa: "روش‌های سنتی روخوانی در مدارس ابتدایی که همه باید با صدای بلند می‌خواندند.",
          wrongEn: "تلفظ تک‌تک کلمات در گلو یا با لب، که سرعت مطالعه را به حداکثر ۲۰۰ کلمه در دقیقه محدود می‌کند",
          correctEn: "خواندن مستقیم با چشم و مغز بدون واسطه تارهای صوتی (تا ۶۰۰ کلمه در دقیقه)",
          whyFixFa: "چشم انسان بسیار سریع‌تر از اندام‌های صوتی حرکت می‌کند. زیرلب‌خوانی گلوگاه سرعت خواندن است.",
          goldenTipFa: "هنگام مطالعه با یک مداد یا انگشت، سریع‌تر از سرعت حرف زدنت زیر خطوط حرکت کن.",
        },
        {
          id: "rd-fix-3",
          titleFa: "بازخوانی وسواسی خطوط (Regression)",
          persianRootFa: "اضطراب از نفهمیدن و برگشت مکرر به اول سطر از ترس جا افتادن مطلب.",
          wrongEn: "خواندن دوباره و سه‌باره هر سطر بلافاصله بعد از رسیدن به نقطه",
          correctEn: "اعتماد به چشم و جریان پیوسته رو به جلو تا پایان پاراگراف",
          whyFixFa: "بازخوانی مداوم ریتم مغز را می‌شکند و باعث خستگی زودهنگام چشم می‌شود.",
          goldenTipFa: "با یک کارت ویزیت یا کاغذ روی خطوط خوانده شده را بپوشان تا چشمت راه برگشت نداشته باشه!",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر خواندن و درک مطلب (Action Plan)",
      sectionDescFa: "برنامه عملیاتی برای افزایش سرعت مطالعه و درک عمیق متون:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "خواندن داستان‌های کوتاه سطح‌بندی شده (Graded Readers)",
          dailyRoutineFa: "روزانه ۱۵ دقیقه مطالعه پیوسته",
          coreActionsFa: [
            "شروع با کتاب‌های داستان سطح ۱ و ۲ انتشارات آکسفورد یا پنگوئن",
            "خواندن فصول بدون نگاه کردن به دیکشنری تا انتهای هر فصل",
            "نوشتن خلاصه ۲ خطی از اتفاقات هر داستان در یک دفترچه یادداشت",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (درک مطلب و کلوزتست)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "تسلط بر مقالات خبری ساده و تکنیک‌های Skimming",
          dailyRoutineFa: "روزانه ۲۰ دقیقه مطالعه تحلیلی",
          coreActionsFa: [
            "مطالعه روزانه یک مقاله از سایت‌های خبری ساده‌شده (مانند BBC Learning English یا News in Levels)",
            "تمرین Skimming: درک ایده اصلی یک مقاله ۵۰۰ کلمه‌ای در کمتر از ۶۰ ثانیه",
            "استخراج ساختارهای تحلیلی و کلمات ربطی درون متون",
          ],
          recommendedTool: {
            titleFa: "جعبه واژگان هوشمند (SRS)",
            href: "/vocabulary",
            icon: "💡",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "خواندن متون پیچیده، مقالات آکادمیک و تحلیل لحن نویسنده",
          dailyRoutineFa: "روزانه ۳۰ دقیقه مطالعه عمیق",
          coreActionsFa: [
            "مطالعه مقالات تحلیلی معتبر (The Economist, Nature, Scientific American)",
            "تمرین درک لحن نویسنده (طنز، انتقادی، بی‌طرف، بدبینانه) در تست‌های سطح بالا",
            "افزایش سرعت مطالعه به بالای ۳۵۰ کلمه در دقیقه با درک مطلب بالای ۸۵ درصد",
          ],
          recommendedTool: {
            titleFa: "لابراتوار مکالمه و سناریوهای تحلیلی",
            href: "/roleplay",
            icon: "🎙️",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "تمرین تا ۲۰ (زبان دوازدهم)",
        desc: "سوالات درک مطلب و کلوزتست امتحانات نهایی با پاسخ تشریحی جامع",
        href: "/high-school/grade-12/tamrin20",
        badge: "امتحانات نهایی",
        icon: "🎓",
      },
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "یادگیری معانی در بافت جمله و ترکیب‌های همنشین",
        href: "/vocabulary",
        badge: "دایره لغات",
        icon: "💡",
      },
      {
        title: "فرهنگ و روابط اجتماعی (Small Talk)",
        desc: "متون و سناریوهای فرهنگی تعاملات اجتماعی در کشورهای انگلیسی‌زبان",
        href: "/skills/culture",
        badge: "فرهنگ کاربردی",
        icon: "🌐",
      },
    ],
  },

  writing: {
    slug: "writing",
    icon: "✍️",
    titleFa: "مهارت نگارش و رایتینگ",
    titleEn: "Writing & Composition",
    cefrRange: "A1 تا C2",
    heroBadgeFa: "استودیوی نویسندگان برتر و شکار کلمات CEFR",
    heroCatchphraseFa: "با ماموریت‌های واقعی و شکار کلمات طلایی کتاب، مهارت نوشتن رو از A1 تا C2 استاد شو!",
    heroDescriptionFa: "خیلی از ما وقتی می‌خوایم انگلیسی بنویسیم، عین انشاهای فارسی یه جمله سه خطی با ده تا 'که' و 'چون' می‌نویسیم که تهش فاعل و فعل گم می‌شن! ساختار نگارش انگلیسی شفاف، خطی و استدلال‌محوره. در استودیوی نویسندگان برتر، از ساختار ساده فاعل+فعل در سطح A1 شروع می‌کنی، با کلمات ربط در B1 متن‌های منسجم می‌سازی، و در B2 تا C2 با مدل استدلالی PEEL و وارونگی‌های نحوی، مقالات و نامه‌هایی در سطح آزمون‌های بین‌المللی می‌نویسی.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار ۶ سطحی نگارش (CEFR Writing Toolkit)",
      sectionDescFa: "۶ قالب و عبارت کلیدی تفکیک‌شده از سطوح A1 تا C2 بر اساس کتب American English File:",
      items: [
        {
          id: "wrt-tool-a1",
          phraseEn: "My name is [Name] and I live in [City].",
          phraseFa: "نام من ... است و در شهر ... زندگی می‌کنم.",
          contextFa: "شروع اساسی برای معرفی فردی، فرم‌های رسمی و پیام‌های اولیه با رعایت نظم فاعل و فعل (SVO).",
          pronunciationTipFa: "در سطح A1، تفکیک دقیق فاعل، فعل و حرف اضافه مکانی (in) اساس نمره است.",
          categoryTag: "سطح A1: معرفی و پایه",
        },
        {
          id: "wrt-tool-a2",
          phraseEn: "I am writing to let you know that...",
          phraseFa: "این پیام را می‌نویسم تا به اطلاع شما برسانم که...",
          contextFa: "آغاز نامه‌ها، ایمیل‌های دوستانه و پیام‌های کوتاه با استفاده از ساختار پیوند دهنده that.",
          pronunciationTipFa: "جایگزین حرفه‌ای برای جملات مقطع و جدا از هم در سطح A2.",
          categoryTag: "سطح A2: توصیف و پیوند",
        },
        {
          id: "wrt-tool-b1",
          phraseEn: "From my perspective, although..., we should...",
          phraseFa: "از دیدگاه من، اگرچه...، با این حال باید...",
          contextFa: "بیان نظر در وبلاگ‌ها، نقدها و ایمیل‌های نیمه‌رسمی با ربط‌دهنده‌های تضاد هم‌زمان.",
          pronunciationTipFa: "استفاده از although بدون آوردن but در ادامه جمله، نشان تسلط به B1 است.",
          categoryTag: "سطح B1: بیان نظر و تضاد",
        },
        {
          id: "wrt-tool-b2",
          phraseEn: "A compelling case can be made that...",
          phraseFa: "می‌توان استدلال مستحکمی ارائه داد که...",
          contextFa: "معرفی ایده اصلی (Topic Sentence) در مقالات آکادمیک، تسک ۲ آیلتس و ایمیل‌های رسمی استدلالی.",
          pronunciationTipFa: "استفاده از صفت compelling به جای strong، نمره دایره واژگان (Lexical Resource) را بالا می‌برد.",
          categoryTag: "سطح B2: استدلال رسمی و PEEL",
        },
        {
          id: "wrt-tool-c1",
          phraseEn: "Not only does this approach foster..., but it also...",
          phraseFa: "این رویکرد نه تنها باعث تقویت ... می‌شود، بلکه همچنین...",
          contextFa: "ساختار وارونگی نحوی (Inversion) برای مقالات تحلیلی انتقادی و پروپوزال‌های دانشگاهی سطح C1.",
          pronunciationTipFa: "بعد از Not only فعل کمکی (does) قبل از فاعل می‌آید و به متن استحکام ادبی می‌بخشد.",
          categoryTag: "سطح C1: وارونگی نحوی و آکادمیک",
        },
        {
          id: "wrt-tool-c2",
          phraseEn: "Notwithstanding these reservations, the salient reality remains that...",
          phraseFa: "با وجود این ملاحظات، واقعیت برجسته و بنیادین همچنان این است که...",
          contextFa: "سرمقاله‌های مطبوعاتی، متون فلسفی-حقوقی و گفتمان اقناعی در سطح تسلط کامل زبان (Mastery).",
          pronunciationTipFa: "واژگان Notwithstanding و Salient نمونه اوج بلاغت و ایجاز در زبان انگلیسی پیشرفته هستند.",
          categoryTag: "سطح C2: بلاغت و سرمقاله",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی نگارش (Mini-Practice)",
      sectionDescFa: "خطاهای رایج جمله‌سازی و ساختار پاراگراف را در این سوالات اصلاح کن:",
      questions: [
        {
          id: "wrt-q1",
          orderNumber: 1,
          promptFa: "به این جمله نگاه کنید: «The project faced major delays, moreover the team put in endless hours.» اشکال اساسی این جمله چیه و چطور اصلاح می‌شه؟",
          promptEn: "What is the logical flaw in the sentence and how should it be fixed?",
          options: [
            "هیچ اشکالی ندارد و کاملاً طبیعی است",
            "کلمه moreover برای افزودن دلیل هم‌جهت است؛ اما دو بخش جمله متناقض هستند و باید از however یا although استفاده شود",
            "باید کلمه delays به delay تبدیل شود",
            "استفاده از past tense در این جمله ممنوع است",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! تسلط به انسجام منطقی متن (Logical Cohesion).",
            detailedFa: "کلمه Moreover زمانی استفاده می‌شود که بخواهید یک فکت همسو به ادعای قبلی اضافه کنید. وقتی پروژه با وجود تلاش زیاد تیم به تاخیر افتاده، تضاد و تناقض وجود دارد و باید از کلماتی مثل However, Yet یا Even though استفاده شود.",
            goldenRuleFa: "کلمات ربط تابلوهای راهنمایی متن هستند؛ جهت مثبت و منفی بودن ایده‌ها رو با کلمه ربط هماهنگ کن.",
          },
        },
        {
          id: "wrt-q2",
          orderNumber: 2,
          promptFa: "کدام ساختار استانداردترین فرمول را برای نوشتن یک پاراگراف استدلالی موفق به روش PEEL نشان می‌دهد؟",
          promptEn: "Which option correctly defines the PEEL paragraph structure?",
          options: [
            "شعر و تعارف -> داستان شخصی -> نتیجه‌گیری بدون مدرک -> تشکر",
            "نقطه نظر اصلی (Point) -> توضیح و بسط (Explanation) -> مثال عینی (Evidence) -> پیوند به موضوع کلی (Link)",
            "مقدمه طولانی پنج خطی -> یک جمله کوتاه بدون هیچ مثالی",
            "ترجمه خط به خط انشای توصیفی فارسی",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "عالی بود! فرمول طلایی رایتینگ استاندارد جهانی.",
            detailedFa: "مدل PEEL (Point, Explanation, Evidence, Link) معتبرترین و دقیق‌ترین چارچوب برای مقاله‌نویسی آکادمیک، تسک ۲ آیلتس و گزارش‌های کاری است. این مدل جلوی سردرگمی و پرش موضوعی را می‌گیرد.",
            goldenRuleFa: "یک ایده شفاف، یک توضیح منطقی، یک مثال مستند و یک پیوند نهایی: تمام راز رایتینگ خوب همینه!",
          },
        },
        {
          id: "wrt-q3",
          orderNumber: 3,
          promptFa: "در مکاتبات کاری بین‌المللی، کدام جمله برای اشاره به یک فایل پیوست (ضمیمه) حرفه‌ای‌تر و رایج‌تر است؟",
          promptEn: "Which sentence is standard and professional for attaching a file?",
          options: [
            "Look at the picture down here right now.",
            "Please find the attached document for your review.",
            "I stuck the paper in this email box.",
            "See attachment immediately or else.",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "دقیقاً درسته! اصطلاح استاندارد بیزنسی.",
            detailedFa: "عبارت «Please find attached...» یا «I have attached the requested document...» زبان رسمی و استاندارد مراودات اداری و تجاری در سراسر دنیاست.",
            goldenRuleFa: "در ایمیل‌نگاری کاری، از قالب‌های آزمایش‌شده و استاندارد استفاده کن تا اعتبار حرفه‌ایت حفظ بشه.",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در نگارش (L1 Fixes)",
      sectionDescFa: "ریشه اشتباهات ساختاری و گرامری که در رایتینگ انگلیسی مرتکب می‌شویم:",
      fixes: [
        {
          id: "wrt-fix-1",
          titleFa: "جملات کش‌دار و بی‌پایان به سبک انشای فارسی (Run-on Sentences)",
          persianRootFa: "در فارسی اتصال چند جمله با «و»، «که»، «سپس» نشانه فصاحت و قلم ادیبانه است!",
          wrongEn: "The weather was terrible and we could not go out because the roads were blocked and it was raining all day long...",
          correctEn: "The weather was terrible. Consequently, we stayed home as the roads were completely blocked.",
          whyFixFa: "رایتینگ انگلیسی ساختار خطی و قطعه‌قطعه دارد. جملات طولانی باعث گم شدن فاعل و افت شدید نمره خوانایی می‌شوند.",
          goldenTipFa: "قانون یک ایده = یک جمله! وقتی پیامت تمام شد، بدون خجالت نقطه بذار.",
        },
        {
          id: "wrt-fix-2",
          titleFa: "حذف فاعل مجازی (Dummy Subject Drop)",
          persianRootFa: "در زبان فارسی فعل می‌تواند بدون فاعل بیاید؛ مثلاً می‌گوییم «خیلی مهمه که...» یا «دیروز سرد بود».",
          wrongEn: "Is very important to remember that... / Was very cold yesterday.",
          correctEn: "It is very important to remember that... / It was very cold yesterday.",
          whyFixFa: "در زبان انگلیسی تقریباً هیچ جمله‌ای بدون فاعل صریح (حتی فاعل صوری مثل It یا There) تشکیل نمی‌شود.",
          goldenTipFa: "هرگز جمله‌ات رو با فعل To be بدون فاعل شروع نکن؛ همیشه از «It is» یا «There are» کمک بگیر.",
        },
        {
          id: "wrt-fix-3",
          titleFa: "ترجمه تحت‌اللفظی حروف اضافه وابسته",
          persianRootFa: "تطبیق مستقیم حروف اضافه فارسی مثل «ازدواج با» یا «علاقه‌مند به».",
          wrongEn: "She is married with a doctor. / I am interested to modern art.",
          correctEn: "She is married to a doctor. / I am interested in modern art.",
          whyFixFa: "حروف اضافه در زبان انگلیسی قراردادی و جفت واژه هستند، نه پیرو منطق زبان مادری ما.",
          goldenTipFa: "افعال و صفت‌ها رو با حرف اضافه‌شون با هم حفظ کن (Married to, Interested in, Depend on).",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر نگارش و رایتینگ (Action Plan)",
      sectionDescFa: "برنامه گام‌به‌گام برای تبدیل شدن به یک نویسنده مسلط و دقیق به زبان انگلیسی:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "جمله‌سازی پایه و یادداشت‌نویسی روزمره",
          dailyRoutineFa: "روزانه ۱۵ دقیقه نوشتن کوتاه",
          coreActionsFa: [
            "نوشتن روزانه ۳ تا ۵ جمله درباره اتفاقات روز با رعایت دقیق ساختار فاعل + فعل + مفعول (SVO)",
            "استفاده صحیح از حروف بزرگ (Capitalization) در اسامی خاص، روزهای هفته و شروع جملات",
            "پرهیز از جملات تو در تو و استفاده از جملات ساده و مرکب استاندارد",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (بخش نگارش دبیرستان)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "نامه‌نگاری رسمی و پاراگراف‌نویسی استدلالی",
          dailyRoutineFa: "روزانه ۲۰ دقیقه نگارش ساختارمند",
          coreActionsFa: [
            "نوشتن ایمیل‌های رسمی اداری و دانشگاهی با استفاده از قالب‌های استاندارد",
            "تمرین ساختار پاراگراف ۴ بخشی با تکنیک PEEL (نقطه نظر، توضیح، مثال، اتصال)",
            "به کارگیری کلمات ربط منطقی (Furthermore, However, As a result) برای انسجام متن",
          ],
          recommendedTool: {
            titleFa: "لابراتوار مکالمه و نگارش هوشمند",
            href: "/roleplay",
            icon: "🎙️",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "مقاله‌نویسی تحلیلی و نگارش آکادمیک سطح بالا",
          dailyRoutineFa: "هفته‌ای ۲ مقاله کامل ۵ پاراگرافی",
          coreActionsFa: [
            "نگارش مقالات استدلالی کامل (IELTS Task 2 / TOEFL) با مقدمه قوی و نتیجه‌گیری وزین",
            "استفاده از تنوع ساختار گرامری (جملات شرطی وارونه، مجهول‌های پیشرفته، Relative Clauses)",
            "ویرایش و بازنویسی متون خود با تمرکز بر شفافیت لحن و حذف زوائد کلامی",
          ],
          recommendedTool: {
            titleFa: "جعبه واژگان هوشمند (SRS)",
            href: "/vocabulary",
            icon: "💡",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "تمرین تا ۲۰ (زبان دوازدهم)",
        desc: "سوالات نگارش، پاراگراف‌نویسی و بازنویسی امتحانات نهایی با تصحیح آنی",
        href: "/high-school/grade-12/tamrin20",
        badge: "امتحانات نهایی",
        icon: "🎓",
      },
      {
        title: "لابراتوار مکالمه هوش مصنوعی",
        desc: "تمرین ساختار جملات و تعامل زنده متنی و صوتی",
        href: "/roleplay",
        badge: "شبیه‌ساز هوشمند",
        icon: "🎙️",
      },
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "افزایش دایره لغات آکادمیک و رسمی برای ارتقای کیفیت رایتینگ",
        href: "/vocabulary",
        badge: "بانک واژگان",
        icon: "💡",
      },
    ],
  },

  vocabulary: {
    slug: "vocabulary",
    icon: "💡",
    titleFa: "واژگان و اصطلاحات کاربردی",
    titleEn: "Vocabulary & Lexical Chunks",
    cefrRange: "A1 تا C2",
    heroBadgeFa: "یادگیری کلمات با جفت‌های طلایی",
    heroCatchphraseFa: "کلمات رو در قالب جفت‌های طبیعی یاد بگیر؛ نه حفظ کردن طوطی‌وار لیست‌های تکی!",
    heroDescriptionFa: "حفظ کردن لیست‌های ۵۰ تایی کلمات روی برگه یا فلش‌کارت‌های بی‌روح هیچ‌وقت به کار صحبت کردن نمیاد؛ چون سر بزنگاه نمی‌دونی این کلمه با کدوم فعل میاد! انگلیسی زبانی از ترکیب‌هاست (Collocations). وقتی یاد بگیری بگی 'make a decision' نه 'do a decision'، کلامت در لحظه شبیه یک فرد بومی می‌شه.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار فوری واژگان (Quick Toolkit)",
      sectionDescFa: "۵ جفت طلایی (Collocations) که مکالمه شما را درجا حرفه‌ای و بومی می‌کنند:",
      items: [
        {
          id: "voc-tool-1",
          phraseEn: "Make a decision / Make an effort",
          phraseFa: "تصمیم گرفتن / تلاش کردن",
          contextFa: "همنشین‌های طلایی با فعل Make (نه Do!).",
          pronunciationTipFa: "در انگلیسی کارهای فکری، ابداعی و برنامه‌ریزی‌ها معمولاً با Make می‌آیند.",
          categoryTag: "همنشینی Make و Do",
        },
        {
          id: "voc-tool-2",
          phraseEn: "Do business / Do research",
          phraseFa: "تجارت کردن / تحقیق و پژوهش انجام دادن",
          contextFa: "همنشین‌های طلایی با فعل Do (نه Make!).",
          pronunciationTipFa: "کارهای فرآیندی، پروژه‌ها و وظایف روتین کاری با Do همنشین هستند.",
          categoryTag: "همنشینی Make و Do",
        },
        {
          id: "voc-tool-3",
          phraseEn: "Heavy traffic / Deep sleep",
          phraseFa: "ترافیک سنگین / خواب عمیق",
          contextFa: "ترکیب صفت و اسم طبیعی به جای صفت‌های ترجمه شده از فارسی.",
          pronunciationTipFa: "هرگز نگویید «Hard traffic» یا «Thick traffic»؛ بومی‌ها می‌گویند «Heavy traffic».",
          categoryTag: "جفت‌های صفت و اسم",
        },
        {
          id: "voc-tool-4",
          phraseEn: "Catch a cold / Take a break",
          phraseFa: "سرما خوردن / استراحت کوتاه کردن",
          contextFa: "افعال سبک و پرکاربرد روزمره برای موقعیت‌های زندگی و سلامت.",
          pronunciationTipFa: "به جای «get sick»، طبیعی‌تر است بگویید «I caught a cold».",
          categoryTag: "افعال سبک روزمره",
        },
        {
          id: "voc-tool-5",
          phraseEn: "Bear in mind that...",
          phraseFa: "به یاد داشته باش که / این نکته رو مد نظر قرار بده که...",
          contextFa: "گوشزد کردن یک نکته مهم و حیاتی در مکالمه دوستانه یا اداری.",
          pronunciationTipFa: "اصطلاحی که در مکالمات حرفه‌ای به کار می‌رود و نشان تسلط زبانی است.",
          categoryTag: "اصطلاحات مفهومی",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی واژگان (Mini-Practice)",
      sectionDescFa: "همنشینی‌ها و کاربرد دقیق واژه‌ها را در این چالش‌های کاربردی محک بزن:",
      questions: [
        {
          id: "voc-q1",
          orderNumber: 1,
          promptFa: "در زبان انگلیسی برای گفتن «اشتباه کردن»، کدام ترکیب استاندارد و طبیعی است؟",
          promptEn: "Which collocation is standard for expressing error creation?",
          options: [
            "Do a mistake",
            "Make a mistake",
            "Create an error",
            "Perform a fault",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! همنشینی کلاسیک Make و Do.",
            detailedFa: "واژه mistake همیشه با فعل make جفت می‌شود. اگر بگویید «do a mistake»، گرچه مخاطب منظورتان را متوجه می‌شود، اما غیرطبیعی بودن گفتارتان بلافاصله توی ذوق می‌زند.",
            goldenRuleFa: "هیچ کلمه‌ای رو تنها یاد نگیر؛ همیشه بپرس: «این کلمه با کدوم فعل جفت می‌شه؟»",
          },
        },
        {
          id: "voc-q2",
          orderNumber: 2,
          promptFa: "کدام گزینه تفاوت بین Borrow و Lend را در یک موقعیت واقعی به درستی نشان می‌دهد؟",
          promptEn: "Which option explains the difference between Borrow and Lend accurately?",
          options: [
            "هر دو کاملاً مترادف هستند و هیچ فرقی با هم ندارند",
            "Borrow یعنی قرض گرفتن (ورود به سمت خود): Can I borrow your pen? اما Lend یعنی قرض دادن (خروج به سمت دیگری): Can you lend me your pen?",
            "Borrow فقط برای مبالغ پول است و Lend فقط برای اشیای فیزیکی",
            "Borrow زمان حال است و Lend شکل گذشته آن",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "عالی بود! تفکیک جفت‌واژه‌های گیج‌کننده.",
            detailedFa: "جهت جریان در Borrow به سمت گوینده است (دریافت موقت)، اما در Lend جهت جریان به سمت شخص دیگر است (ارائه موقت).",
            goldenRuleFa: "Borrow یعنی گرفتن؛ Lend یعنی دادن! جهت فلش جابجایی رو تو ذهنت مجسم کن.",
          },
        },
        {
          id: "voc-q3",
          orderNumber: 3,
          promptFa: "در محیط کار و پروژه‌ها، برای گفتن «لغو کردن یک جلسه»، کدام فعل دوکلمه‌ای (Phrasal Verb) طبیعی‌تر است؟",
          promptEn: "Which phrasal verb means canceling a scheduled meeting completely?",
          options: [
            "Call off the meeting",
            "Put off the meeting",
            "Break the meeting",
            "Delete the meeting",
          ],
          correctAnswer: 0,
          explanation: {
            briefFa: "کاملاً درسته! تسلط بر افعال دوکلمه‌ای کاری.",
            detailedFa: "فعل Call off یعنی لغو کامل جلسه، در حالی که Put off یعنی به تعویق انداختن آن به زمانی دیگر (Postpone).",
            goldenRuleFa: "افعال دوکلمه‌ای ستون فقرات انگلیسی محاوره‌ای و اداری هستند؛ تفاوت‌شون رو با تصویر یاد بگیر.",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در واژگان (L1 Fixes)",
      sectionDescFa: "تله‌های ذهنی که باعث ترجمه لفظی و لغات نامانوس در انگلیسی می‌شوند:",
      fixes: [
        {
          id: "voc-fix-1",
          titleFa: "حفظ لیست‌های تک‌کلمه‌ای بدون بافت جمله",
          persianRootFa: "روش‌های سنتی حفظ لغات با فلش‌کارت‌های کاغذی و نوشتن معنای فارسی روبه‌روی واژه انگلیسی.",
          wrongEn: "حفظ کردن ۵۰ لغت انتزاعی در یک روز بدون دانستن اینکه با چه فعلی جفت می‌شوند",
          correctEn: "یادگیری کلمات در قالب عبارت‌های دوتایی و سه‌تایی (Collocations) در جملات نمونه",
          whyFixFa: "مغز انسان واژه‌ها را شبکه‌ای ذخیره می‌کند. واژه تنها موقع صحبت کردن سر زمان به یاد نمی‌آید.",
          goldenTipFa: "همیشه یک لغت را با همسرش یاد بگیر! (مثلاً Strong tea, Deep sleep, Make progress).",
        },
        {
          id: "voc-fix-2",
          titleFa: "استفاده از یک واژه برای چند مفهوم متمایز فارسی",
          persianRootFa: "در فارسی برای دیدن فیلم، دیدن دوست در خیابان و نگاه کردن به ساعت از یک فعل «دیدن» استفاده می‌کنیم!",
          wrongEn: "I watched my friend on the street yesterday.",
          correctEn: "I saw / ran into my friend on the street yesterday. (Watch is for screens and movement).",
          whyFixFa: "زبان انگلیسی در تفکیک حوزه‌های ادراکی بسیار دقیق‌تر است (Watch, See, Look, Glance).",
          goldenTipFa: "به دامنه و کاربری واژه توجه کن نه فقط به تک‌معنای موجود در لغت‌نامه‌ها.",
        },
        {
          id: "voc-fix-3",
          titleFa: "پناه بردن به واژه‌های عمومی و دم دستی (Very Good, Bad, Nice)",
          persianRootFa: "تنبلی واژگانی و تکرار واژه‌های ساده به دلیل عدم تثبیت صفت‌های غنی‌تر در مکالمه.",
          wrongEn: "The food was very good and the weather was very good too.",
          correctEn: "The food was delicious and the weather was delightful.",
          whyFixFa: "استفاده از صفت‌های متنوع و دقیق کلام شما را بلافاصله از سطح مقدماتی به متوسط رو به بالا ارتقا می‌دهد.",
          goldenTipFa: "به جای کلمه Very + صفت، یک صفت قوی مستقل یاد بگیر (مثلاً Furious به جای Very angry).",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر واژگان و اصطلاحات (Action Plan)",
      sectionDescFa: "برنامه عملیاتی برای ساخت دایره لغات فعال و فراموش‌نشدنی:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "تثبیت ۱۰۰۰ واژه پرکاربرد با سیستم تکرار فاصله‌دار (SRS)",
          dailyRoutineFa: "روزانه ۱۰ دقیقه مرور هوشمند لغات",
          coreActionsFa: [
            "مرور روزانه ۷ تا ۱۰ کارت واژگان در سیستم SRS هوشمند ایندورا با فاصله زمانی علمی",
            "یادگیری کلمات در قالب جفت‌های ساده روزمره (Clean room, Have breakfast, Go home)",
            "استفاده از کلمات جدید در حداقل دو جمله شخصی درباره زندگی روزمره خود",
          ],
          recommendedTool: {
            titleFa: "جعبه واژگان هوشمند (SRS)",
            href: "/vocabulary",
            icon: "💡",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "یادگیری همنشینی‌ها و افعال دوکلمه‌ای (Phrasal Verbs)",
          dailyRoutineFa: "روزانه ۲۰ دقیقه استخراج واژگان از متون",
          coreActionsFa: [
            "استخراج همنشین‌های طبیعی از پادکست‌ها و متون و دسته‌بندی در دفترچه واژگان",
            "تسلط بر ۵۰ فعل دوکلمه‌ای پرکاربرد روزمره (Carry out, Figure out, Look forward to)",
            "حل تست‌های واژگانی چهارگزینه‌ای برای سنجش تمایزات ظریف معنایی",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (بخش واژگان کنکور و نهایی)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "اصطلاحات خودمانی (Idioms) و واژگان تخصصی آکادمیک (AWL)",
          dailyRoutineFa: "روزانه ۲۵ دقیقه گسترش دایره لغات فعال",
          coreActionsFa: [
            "یادگیری ضرب‌المثل‌ها و استعاره‌های محاوره‌ای رایج در فیلم‌ها و سریال‌ها",
            "تسلط بر لیست کلمات آکادمیک (AWL) برای رایتینگ و مقالات تخصصی",
            "جایگزینی هوشمندانه کلمات ساده با مترادف‌های دقیق‌تر در گفتار روزمره",
          ],
          recommendedTool: {
            titleFa: "فرهنگ و روابط اجتماعی (Small Talk)",
            href: "/skills/culture",
            icon: "🌐",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "مرور کلمات فعال و تثبیت در حافظه بلندمدت با الگوریتم تکرار فاصله‌دار SM-2",
        href: "/vocabulary",
        badge: "سیستم هوشمند",
        icon: "💡",
      },
      {
        title: "تمرین تا ۲۰ (زبان دوازدهم)",
        desc: "بانک جامع تست‌های واژگان امتحانات نهایی با پاسخ تشریحی",
        href: "/high-school/grade-12/tamrin20",
        badge: "امتحانات نهایی",
        icon: "🎓",
      },
      {
        title: "لابراتوار مکالمه هوش مصنوعی",
        desc: "استفاده از واژگان و اصطلاحات جدید در سناریوهای صوتی زنده",
        href: "/roleplay",
        badge: "تمرین کاربردی",
        icon: "🎙️",
      },
    ],
  },

  grammar: {
    slug: "grammar",
    icon: "⚡",
    titleFa: "دستور زبان و گرامر کاربردی",
    titleEn: "Grammar in Action",
    cefrRange: "A1 تا C1",
    heroBadgeFa: "فرمول‌های ساده در خدمت صحبت کردن",
    heroCatchphraseFa: "گرامر رو به عنوان ابزار ارتباط یاد بگیر، نه یک مشت فرمول خشک برای تست زدن!",
    heroDescriptionFa: "گرامر قرار نیست مانع حرف زدنت بشه، قرار هم نیست کابوس امتحانات باشه! گرامر مثل کدهای پشت صحنه یک بازی کامپیوتریه؛ فقط لازمه بدونی هر ساختار چه حسی رو منتقل می‌کنه. وقتی تفاوت حال کامل و گذشته ساده رو در زندگی واقعی درک کنی، دیگه سر گفتن یک جمله ساده به تپق زدن نمی‌افتی.",
    quickToolkit: {
      sectionTitleFa: "جعبه ابزار فوری گرامر (Quick Toolkit)",
      sectionDescFa: "۵ فرمول طلایی و شاه‌کلید گرامری که در مکالمه و نوشتن معجزه می‌کنند:",
      items: [
        {
          id: "grm-tool-1",
          phraseEn: "Used to + verb",
          phraseFa: "قدیما عادت داشتم... (کاری که در گذشته انجام می‌دادی ولی الان دیگه متوقف شده).",
          contextFa: "تعریف کردن عادت‌ها و سبک زندگی گذشته: «I used to play tennis every Friday».",
          pronunciationTipFa: "تلفظ روان: «یوست تو» نه «یوزد تو».",
          categoryTag: "عادت‌های گذشته",
        },
        {
          id: "grm-tool-2",
          phraseEn: "Be used to + -ing",
          phraseFa: "برام عادی شده / بهش عادت کردم.",
          contextFa: "بیان اینکه شرایط جدیدی برایتان کاملاً طبیعی شده: «I'm used to waking up early».",
          pronunciationTipFa: "حواستان باشد بعد از این ساختار حتماً فعل با -ing می‌آید.",
          categoryTag: "عادت‌های جاری",
        },
        {
          id: "grm-tool-3",
          phraseEn: "If I were you, I would...",
          phraseFa: "اگه جای تو بودم، حتماً...",
          contextFa: "قالب طلایی، صمیمانه و فوق‌العاده مودبانه برای نصیحت کردن دیگران.",
          pronunciationTipFa: "استفاده از Were به جای Was در حالت فرضی غیرواقعی (Subjunctive).",
          categoryTag: "نصیحت و پیشنهاد",
        },
        {
          id: "grm-tool-4",
          phraseEn: "I've been working on this for...",
          phraseFa: "چند وقته دارم روی این پروژه کار می‌کنم (و هنوزم ادامه داره).",
          contextFa: "نشان دادن تداوم کار از گذشته تا زمان حال با زمان حال کامل استمراری.",
          pronunciationTipFa: "به جای «I work on this since...»، این فرمول دقیق و استاندارد است.",
          categoryTag: "پیوند گذشته به حال",
        },
        {
          id: "grm-tool-5",
          phraseEn: "Had better + verb",
          phraseFa: "بهتره که فلان کار رو بکنی (وگرنه پیامد بدی داره!).",
          contextFa: "هشدار محترمانه و قوی‌تر از Should در موقعیت‌های حساس روزمره و کاری.",
          pronunciationTipFa: "به صورت مخفف ادا می‌شود: «You'd better hurry up».",
          categoryTag: "توصیه و هشدار",
        },
      ],
    },
    miniPractice: {
      sectionTitleFa: "کارگاه تعاملی گرامر (Mini-Practice)",
      sectionDescFa: "تله‌های تستی و گرامری رو در این چالش‌های هوشمندانه حل کن و بازخورد تحلیلی بگیر:",
      questions: [
        {
          id: "grm-q1",
          orderNumber: 1,
          promptFa: "همکارتان می‌پرسد چقدر است در این شرکت مشغول به کار هستید؟ کدام پاسخ از نظر ساختار گرامری انگلیسی صحیح و طبیعی است؟",
          promptEn: "Which sentence correctly expresses an action continuing up to the present?",
          options: [
            "I work here since 3 years ago.",
            "I have been working here for 3 years.",
            "I worked here since 3 years.",
            "I am working here since 3 years.",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "آفرین! شاه‌کلید زمان حال کامل استمراری.",
            detailedFa: "وقتی کاری در گذشته شروع شده و تا زمان حال ادامه دارد، حتماً از زمان Present Perfect (استمراری یا ساده) همراه با For برای بیان طول دوره زمان استفاده می‌کنیم. استفاده از حال ساده یا آوردن Since برای طول دوره از خطاهای بسیار شایع است.",
            goldenRuleFa: "برای پیوند گذشته به حال حاضر، ترکیب Have/Has been + -ing بهترین انتخابته!",
          },
        },
        {
          id: "grm-q2",
          orderNumber: 2,
          promptFa: "تفاوت اساسی بین دو جمله «I stopped smoking» و «I stopped to smoke» چیست؟",
          promptEn: "What is the difference between 'stopped smoking' and 'stopped to smoke'?",
          options: [
            "هیچ تفاوتی ندارند و صرفاً دو سلیقه نگارشی هستند",
            "اولی یعنی سیگار کشیدن را برای همیشه ترک کردم؛ اما دومی یعنی کارم را متوقف کردم تا سیگار بکشم!",
            "جمله اول غلط گرامری دارد و شکل درست فقط با To می‌آید",
            "دومی یعنی از سیگار کشیدن متنفرم",
          ],
          correctAnswer: 1,
          explanation: {
            briefFa: "فوق‌العاده بود! نکته ظریف و تعیین‌کننده مصدر و اسم مصدر (Gerund vs Infinitive).",
            detailedFa: "افعالی مثل Stop وقتی با Gerund (-ing) می‌آیند به معنای پایان کامل یک عمل هستند؛ اما با To-Infinitive نشان‌دهنده توقف موقت یک فعالیت برای انجام هدفی دیگر می‌باشند.",
            goldenRuleFa: "حواست به افعال چندمعنایی مثل Stop, Remember, Forget باشه؛ ساختار To و Ing معنای ماجرا رو دگرگون می‌کنه!",
          },
        },
        {
          id: "grm-q3",
          orderNumber: 3,
          promptFa: "کدام ساختار شرطی برای ابراز پشیمانی و صحبت درباره گذشته‌ای که دیگر تغییر نمی‌کند به کار می‌رود؟",
          promptEn: "Which conditional structure expresses regret about an unchangeable past event?",
          options: [
            "شرطی نوع اول: If it rains tomorrow, we will stay home.",
            "شرطی نوع دوم: If I had a car, I would drive to work.",
            "شرطی نوع سوم: If I had studied harder, I would have passed the exam.",
            "شرطی نوع صفر: If you freeze water, it becomes ice.",
          ],
          correctAnswer: 2,
          explanation: {
            briefFa: "کاملاً درسته! شرطی نوع سوم برای گذشته غیرممکن.",
            detailedFa: "شرطی نوع سوم با ترکیب If + Past Perfect در بخش اول و Would have + P.P در بخش دوم، موقعیت‌های فرضی گذشته را بیان می‌کند که دیگر اتفاق نیفتاده‌اند و حسرت یا انتقاد به همراه دارند.",
            goldenRuleFa: "حسرت گذشته در گرامر انگلیسی یعنی شرطی نوع ۳: «If I had known... I would have done...»",
          },
        },
      ],
    },
    l1Fixes: {
      sectionTitleFa: "حل چالش ما فارسی‌زبان‌ها در گرامر (L1 Fixes)",
      sectionDescFa: "خطاهای ساختاری گرامری که در اثر تداخل مستقیم دستور زبان فارسی به وجود می‌آیند:",
      fixes: [
        {
          id: "grm-fix-1",
          titleFa: "اشتباه گرفتن حال کامل و گذشته ساده",
          persianRootFa: "در زبان فارسی می‌گوییم «من دو ساله که اینجام» (حال ساده) یا «دیروز دیدمش» (گاهی ماضی نقلی).",
          wrongEn: "I live here since 2021. / I have seen him yesterday.",
          correctEn: "I have lived here since 2021. / I saw him yesterday.",
          whyFixFa: "در زبان انگلیسی اگر زمان مشخص و تمام‌شده‌ای در گذشته داشته باشیم (Yesterday, Last week) استفاده از گذشته ساده قطعی است و استفاده از Have/Has خطاست.",
          goldenTipFa: "قید زمان معین در گذشته (Yesterday, In 2020) خط قرمز حال کامل است؛ باهاش فقط گذشته ساده بگو!",
        },
        {
          id: "grm-fix-2",
          titleFa: "فراموش کردن `s` سوم‌شخص در زمان حال ساده",
          persianRootFa: "در زبان فارسی شناسه فعل در انتهای آن قرار دارد («او می‌رود»)، اما در انگلیسی فاعل مجزاست و ذهن ناخودآگاه s را حذف می‌کند.",
          wrongEn: "He know the truth. / My brother live in Shiraz.",
          correctEn: "He knows the truth. / My brother lives in Shiraz.",
          whyFixFa: "حذف s سوم‌شخص رایج‌ترین خطای گفتاری ایرانیان در تمام سطوح زبانی است که به ساختار صوتی زبان مادری برمی‌گردد.",
          goldenTipFa: "ضمایر He, She, It مثل آهنربا حرف S رو به انتهای فعل جذب می‌کنند!",
        },
        {
          id: "grm-fix-3",
          titleFa: "استفاده نابه‌جا از Will در بخش شرطی جمله (If Clause)",
          persianRootFa: "در فارسی می‌گوییم «اگر فردا باران بیاید...» که ذهن ما آن را اتفاقی در آینده دانسته و ناخودآگاه Will می‌گذارد.",
          wrongEn: "If it will rain tomorrow, we will cancel the picnic.",
          correctEn: "If it rains tomorrow, we will cancel the picnic.",
          whyFixFa: "در قواعد زبان انگلیسی، در بندی که با If شروع می‌شود، هرگز از فعل کمکی Will استفاده نمی‌شود و حال ساده می‌نشیند.",
          goldenTipFa: "کلمه If با Will سر جنگ دارد! بعد از If همیشه حال ساده بیار.",
        },
      ],
    },
    actionPlan: {
      sectionTitleFa: "نقشه راه تسلط بر دستور زبان و گرامر (Action Plan)",
      sectionDescFa: "برنامه کاربردی برای مسلط شدن بر فرمول‌های گرامری بدون حفظ کردن فرمول‌های خشک:",
      milestones: [
        {
          step: 1,
          levelBadge: "مبتدی (A1-A2)",
          titleFa: "تثبیت زمان‌های اصلی و جمله‌سازی روزمره",
          dailyRoutineFa: "روزانه ۱۵ دقیقه تمرین ساختاری",
          coreActionsFa: [
            "تسلط بر زمان‌های حال ساده، حال استمراری و گذشته ساده از طریق ساخت جملات درباره زندگی شخصی",
            "تمرین ضمایر، حروف اضافه مکان و زمان و افعال باقاعده و بی‌قاعده پرکاربرد",
            "حل تست‌های ساده چهارگزینه‌ای برای رفع خطای s سوم‌شخص و ساختار سوالی",
          ],
          recommendedTool: {
            titleFa: "تمرین تا ۲۰ (بخش گرامر دبیرستان)",
            href: "/high-school/grade-12/tamrin20",
            icon: "🎓",
          },
        },
        {
          step: 2,
          levelBadge: "متوسط (B1-B2)",
          titleFa: "زمان‌های کامل، ساختار مجهول و شرطی‌های تحلیلی",
          dailyRoutineFa: "روزانه ۲۰ دقیقه تمرین تحلیلی",
          coreActionsFa: [
            "درک تفاوت‌های عمیق کاربردی بین Past Simple و Present Perfect در موقعیت‌های زنده",
            "تمرین جملات مجهول (Passive Voice) برای نگارش گزارش‌های رسمی کاری",
            "تسلط بر جملات شرطی نوع اول و دوم برای تحلیل تصمیمات و پیشنهادات",
          ],
          recommendedTool: {
            titleFa: "جعبه واژگان هوشمند (SRS)",
            href: "/vocabulary",
            icon: "💡",
          },
        },
        {
          step: 3,
          levelBadge: "پیشرفته (C1-C2)",
          titleFa: "ساختارهای پیشرفته تأکیدی، وارونگی و وجه التزامی",
          dailyRoutineFa: "روزانه ۲۵ دقیقه تمرین نگارش و تحلیل گرامری",
          coreActionsFa: [
            "تسلط بر ساختارهای وارونگی (Inversion) برای ایجاد تاکید و تنوع سبک در سخنرانی و رایتینگ",
            "استفاده صحیح از وجه التزامی (Subjunctive Mood) در مکاتبات دیپلماتیک و رسمی",
            "تحلیل جملات پیچیده مقالات آکادمیک و تبدیل جملات مرکب به فرم‌های فشرده و شیوا",
          ],
          recommendedTool: {
            titleFa: "لابراتوار مکالمه هوش مصنوعی",
            href: "/roleplay",
            icon: "🎙️",
          },
        },
      ],
    },
    relatedModules: [
      {
        title: "تمرین تا ۲۰ (زبان دوازدهم)",
        desc: "تحلیل جامع تمام تست‌های گرامری امتحانات نهایی با نکات تشریحی کتاب درسی",
        href: "/high-school/grade-12/tamrin20",
        badge: "امتحانات نهایی",
        icon: "🎓",
      },
      {
        title: "لابراتوار مکالمه هوش مصنوعی",
        desc: "ارزیابی درستی گرامر در هنگام صحبت کردن بدون سرزنش و با بازخورد طبیعی",
        href: "/roleplay",
        badge: "شبیه‌ساز هوشمند",
        icon: "🎙️",
      },
      {
        title: "جعبه واژگان هوشمند (SRS)",
        desc: "تقویت ساختار کلمات، پسوندها و پیشوندهای گرامری در قالب فلش‌کارت‌های فعال",
        href: "/vocabulary",
        badge: "تکرار فاصله‌دار",
        icon: "💡",
      },
    ],
  },
};
