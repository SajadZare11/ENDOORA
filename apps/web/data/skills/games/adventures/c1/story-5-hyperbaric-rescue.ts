import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 5 (C1 - Adult): Operation Abyssal Chamber (عملیات نجات اتاقک فشار در اعماق دریای شمال)
// Genre: Thriller & Rescue (هیجان و نجات‌بخشی)
// CEFR: C1 (Inversion with negative adverbials, mixed conditionals, hyperbaric deduction, high-stakes subsea thriller)
// Characters: Nathan Vance (Subsea Incident Commander), Kelly Zhang (Lead Hyperbaric Physiologist), Lars (Submersible ROV Pilot)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "At twenty-two hundred hours, an acoustic Mayday tone pierced the bridge of the deep-sea dive support vessel 'Ocean Titan', stationed above the stormy Viking Graben trench in the North Sea. Four hundred and twenty meters below fifty-foot waves, Saturation Diving Bell Three had suffered a catastrophic structural emergency: an unpredicted seismic seabed slide had severed its umbilical lifeline, cutting off primary electrical heating and heliox gas circulation. Inside the titanium diving capsule, three veteran commercial divers were trapped in pitch-black, four-degree-Celsius brine under forty-three atmospheres of crushing hydrostatic pressure. Nathan Vance, a legendary subsea incident commander, knew that if internal body temperatures dropped below thirty degrees, the divers would succumb to hypothermic cardiac arrest in less than ninety minutes. Beside him, hyperbaric medical physiologist Kelly Zhang prepared the vessel's heavy rescue submersible while chief pilot Lars spun up dual thruster manifolds.",
    keywords: [
      { word: "umbilical", meaningFa: "کابل مادری نافی (تامین‌کننده برق، گاز تنفسی، گرما و ارتباط کپسول غواصی)", phonetic: "/ʌmˈbɪlɪkl/" },
      { word: "heliox", meaningFa: "هلیوکس (مخلوط تنفسی هلیوم و اکسیژن برای غواصی در اعماق بسیار زیاد)", phonetic: "/ˈhiːliɒks/" },
      { word: "saturation", meaningFa: "غواصی اشباع (اقامت چند هفته‌ای غواصان در فشار بالا برای کار در کف دریا)", phonetic: "/ˌsætʃəˈreɪʃn/" },
      { word: "hydrostatic", meaningFa: "فشار هیدرواستاتیک خردکننده ستون آب در عمق ۴۰۰ متری", phonetic: "/ˌhaɪdrəʊˈstætɪk/" },
    ],
    question: {
      promptEn: "What critical time limit did the team face before hypothermia would prove fatal to the trapped divers?",
      promptFa: "تیم امداد قبل از اینکه سرمازدگی برای غواصان مرگبار شود با چه محدودیت زمانی بحرانی روبرو بود؟",
      options: [
        "In less than ninety minutes, hypothermic cardiac arrest would occur",
        "Forty-eight hours of battery reserve",
        "Ten minutes before the ship's fuel ran out",
      ],
      correctIndex: 0,
      hintSnippet: "divers would succumb to hypothermic cardiac arrest in less than ninety minutes",
      clueFa: "خط ماقبل آخر رو ببین دوست من؛ دمای بدن غواصان در کمتر از ۹۰ دقیقه دچار ایست قلبی ناشی از سرمای ۴ درجه می‌شد.",
    },
    choiceA: {
      labelEn: "Deploy the heavy rescue submersible 'Triton' on an emergency high-speed free-fall descent!",
      labelFa: "زیردریایی سنگین نجات «تریتون» را با شیرجه عمودی سریع به عمق ۴۲۰ متری اعزام کن!",
      descriptionFa: "سرعت فوق‌العاده برای رسیدن به کف دریا در کمتر از بیست دقیقه.",
    },
    choiceB: {
      labelEn: "Lower an automated heavy-duty hydraulic hot-water umbilical line via robotic crane rig!",
      labelFa: "کابل هیدرولیکی آب گرم اضطراری را با بازوی جرثقیل روباتیک به سوی کپسول هدایت کن!",
      descriptionFa: "تزریق فوری گرما به بدنه کپسول برای نجات غواصان از انجماد مرگبار.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Triton sliced down through the black water at four knots, its four-thousand-lumen forward halogen clusters piercing the abyssal gloom. At four hundred meters, pilot Lars leveled the thrusters. The crippled saturation bell lay tilted at thirty-five degrees against a jagged granite ridge, surrounded by unstable mud drifts. Internal pressure sensors inside the bell revealed an alarming development: the severed gas manifold was leaking gas into the ocean, causing interior cabin pressure to fluctuate wildly. If Kelly could not mate the rescue submersible’s transfer lock onto the bell within eighteen minutes, the pressure drop would trigger explosive decompression sickness inside the divers' bloodstream.",
    keywords: [
      { word: "crippled", meaningFa: "آسیب‌دیده، از کار افتاده و زمین‌گیرشده", phonetic: "/ˈkrɪpld/" },
      { word: "decompression", meaningFa: "برداشت فشار (خطرات کشنده تشکیل حباب‌های نیتروژن و هلیوم در خون)", phonetic: "/ˌdiːkəmˈpreʃn/" },
      { word: "manifold", meaningFa: "چندراهی لوله‌کشی و توزیع گازهای پرفشار", phonetic: "/ˈmænɪfəʊld/" },
      { word: "fluctuate", meaningFa: "نوسان کردن، بالا و پایین رفتن بی‌ثبات", phonetic: "/ˈflʌktʃueɪt/" },
    ],
    question: {
      promptEn: "What lethal physiological danger did the leaking gas manifold create for the divers?",
      promptFa: "نشتی چندراهی گاز چه خطر کشنده فیزیولوژیکی برای غواصان ایجاد می‌کرد؟",
      options: [
        "Explosive decompression sickness in their bloodstream due to pressure drop",
        "Permanent hearing loss from hydrophone feedback",
        "Carbon monoxide poisoning from the ship's engine exhaust",
      ],
      correctIndex: 0,
      hintSnippet: "the pressure drop would trigger explosive decompression sickness inside the divers' bloodstream",
      clueFa: "خط آخر رو نگاه کن رفیق؛ افت فشار می‌توانست باعث جوشش گاز در رگ‌ها و بیماری کشنده کاهش ناگهانی فشار شود.",
    },
    choiceA: {
      labelEn: "Engage dynamic thruster docking to lock Triton's hyperbaric mating collar directly onto the bell hatch!",
      labelFa: "با نیروی پیشران پویا حلقه اتصال فشار قوی تریتون را مستقیماً روی دریچه کپسول قفل کن!",
      descriptionFa: "اتصال یکپارچه برای هم‌فشار کردن دو محفظه و انتقال مستقیم غواصان به داخل زیردریایی.",
    },
    choiceB: {
      labelEn: "Deploy Triton's dual hydraulic manipulator arms to seal the ruptured external gas bypass valve!",
      labelFa: "با دو بازوی مکانیکی هیدرولیک شیر خروجی گاز آسیب‌دیده را از بیرون مسدود و مهار کن!",
      descriptionFa: "توقف فوری نشتی گاز برای پایدار ساختن فشار محیط قبل از شروع مانور اتصال.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "The heavy winch crane lowered the armored emergency hot-water umbilical through raging thirty-foot surface swells. Guided by a remote acoustic transponder beacon, the umbilical coupler reached the seabed sixty meters from the bell. Nathan donned his specialized atmospheric diving suit (ADS)—an armored titanium exoskeleton rated to six hundred meters depth—and stepped out into the freezing water. Propelled by twin back-mounted thrusters, Nathan hauled the sixty-kilogram braided umbilical hose through the mud toward the bell’s emergency thermal port.",
    keywords: [
      { word: "exoskeleton", meaningFa: "اسکلت بیرونی زره‌پوش تیتانیومی غواصی جوی", phonetic: "/ˈeksəʊskelɪtn/" },
      { word: "transponder", meaningFa: "فرستنده-پاسخ‌دهنده خودکار سونار در زیر آب", phonetic: "/trænˈspɒndər/" },
      { word: "braided", meaningFa: "بافته‌شده با روکش فولادی مقاوم در برابر بریدگی", phonetic: "/ˈbreɪdɪd/" },
      { word: "swells", meaningFa: "امواج خروشان و سهمگین سطح اقیانوس", phonetic: "/swelz/" },
    ],
    question: {
      promptEn: "What specialized equipment allowed Nathan to personally haul the heavy umbilical through the deep water?",
      promptFa: "چه تجهیزات پیشرفته‌ای به ناتان اجازه داد شلنگ سنگین کابل را شخصاً در عمق آب حمل کند؟",
      options: [
        "An atmospheric diving suit (ADS) with an armored titanium exoskeleton",
        "A standard rubber scuba wetsuit and flippers",
        "A buoyant inflatable underwater life-raft",
      ],
      correctIndex: 0,
      hintSnippet: "donned his specialized atmospheric diving suit (ADS)—an armored titanium exoskeleton rated to six hundred meters depth",
      clueFa: "خط سوم رو ببین؛ لباس زرهی جوی تیتانیومی مجهز به موتورهای پیشران که فشار ۶۰۰ متری را مهار می‌کند.",
    },
    choiceA: {
      labelEn: "Lock the hot-water connector into the bell manifold and initiate high-pressure warm saline heating!",
      labelFa: "کوپلر آب گرم را به مجرای کپسول قفل کن و تزریق پرفشار حرارتی را آغاز کن!",
      descriptionFa: "بازگرداندن فوری دمای کپسول به ۳۷ درجه برای نجات غواصان از مرگ حتمی ناشی از سرما.",
    },
    choiceB: {
      labelEn: "Rig a heavy-lift secondary hoist cable to right the tilted bell and pull it clear of the unstable mud ledge!",
      labelFa: "کابل کشش ثانویه را ببند تا کپسول را از لبه شیب‌دار گل‌آلود بیرون بکشی و تراز کنی!",
      descriptionFa: "پیشگیری از سقوط کپسول به اعماق شکاف هزار متری بستر دریا.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Triton’s titanium mating collar latched onto the bell hatch with a resonant hydraulic clunk. Operating the pressure equalization valves, Kelly matched Triton’s cabin to the bell’s exact forty-three point two atmospheres of pressure. Cracking the lower hatch, she was greeted by three exhausted, shivering divers wrapped in aluminum survival bags. Divers Henderson, Walsh, and Miller were severely hypothermic but conscious. Kelly immediately began infusing warmed intravenous fluids while wrapping them in electric heating blankets, their vital signs stabilizing within minutes.",
    keywords: [
      { word: "equalization", meaningFa: "هم‌فشارسازی دقیق دو اتاقک جهت جلوگیری از شوک فشاری", phonetic: "/ˌiːkwəlaɪˈzeɪʃn/" },
      { word: "infusing", meaningFa: "تزریق تدریجی سرم‌های گرم درمانی به وریدها", phonetic: "/ɪnˈfjuːzɪŋ/" },
      { word: "hypothermic", meaningFa: "دچار افت شدید و کشنده دمای بدن", phonetic: "/ˌhaɪpəˈθɜːrmɪk/" },
      { word: "clunk", meaningFa: "صدای محکم و فلزی قفل شدن اتصالات هیدرولیک", phonetic: "/klʌŋk/" },
    ],
    question: {
      promptEn: "What medical procedure stabilized the three rescued divers once inside Triton?",
      promptFa: "چه اقدامات پزشکی به محض ورود غواصان به داخل تریتون علائم حیاتی آنان را پایدار کرد؟",
      options: [
        "Equalized cabin pressure, warmed intravenous fluids, and electric heating blankets",
        "Immediate transfer to cold seawater baths",
        "Administering pure sleeping gas",
      ],
      correctIndex: 0,
      hintSnippet: "Kelly matched Triton’s cabin to the bell’s exact forty-three point two atmospheres of pressure... infusing warmed intravenous fluids while wrapping them in electric heating blankets",
      clueFa: "خطوط دوم و سوم رو نگاه کن؛ هم‌فشار کردن اتاقک در ۴۳.۲ اتمسفر، سرم گرم و پتوهای برقی حرارتی.",
    },
    choiceA: {
      labelEn: "Ascend Triton smoothly at controlled ascent rates directly to Ocean Titan's hyperbaric reception chamber!",
      labelFa: "تریتون را با سرعت صعود برنامه‌ریزی‌شده مستقیماً به اتاقک پذیرش فشار کشتی در سطح آب بالا ببر!",
      descriptionFa: "صعود ایمن و اتصال مستقیم به مجتمع درمانی عرشه بدون افت حتی یک اتمسفر فشار.",
    },
    choiceB: {
      labelEn: "Perform on-site deep-saturation emergency decompression stabilization at three hundred meters depth!",
      labelFa: "تثبیت فشار و کاهش پله‌ای اولیه را در عمق ۳۰۰ متری در داخل آب اجرا کن!",
      descriptionFa: "رفع شوک اولیه بدن قبل از حرکت به سمت تلاطم امواج سطح دریا.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "With micrometer precision, Lars guided Triton’s robotic manipulator arms to clamp a high-pressure pneumatic sealing collar over the ruptured heliox valve. The whistling roar of escaping gas ceased instantly; internal cabin telemetry showed the bell’s pressure stabilizing at forty-two point eight atmospheres. Through the thick quartz viewport, diver Henderson flashed a faint, grateful thumbs-up. With the leak plugged, Kelly was able to mate the transfer lock smoothly without risking atmospheric decompression shock.",
    keywords: [
      { word: "micrometer", meaningFa: "میکرومتری، با نهایت ظرافت و دقت در حد میکرون", phonetic: "/ˈmaɪkrəʊmiːtər/" },
      { word: "viewport", meaningFa: "پنجره شیشه‌ای کوارتز ضخیم ضد فشار بسیار بالا", phonetic: "/ˈvjuːpɔːrt/" },
      { word: "pneumatic", meaningFa: "پنوماتیک، مهارشده با فشار هوای فشرده", phonetic: "/njuːˈmætɪk/" },
      { word: "decompression shock", meaningFa: "شوک ناشی از افت ناگهانی فشار محیط", phonetic: "/ˌdiːkəmˈpreʃn ʃɒk/" },
    ],
    question: {
      promptEn: "What signal of survival did diver Henderson give through the quartz viewport after the leak was sealed?",
      promptFa: "پس از مهار نشتی، غواص هندرسون از پشت پنجره کوارتز چه علامتی برای تایید سلامتی داد؟",
      options: [
        "A faint, grateful thumbs-up gesture",
        "Waved an emergency flare",
        "Tapped SOS on the hull with a wrench",
      ],
      correctIndex: 0,
      hintSnippet: "Through the thick quartz viewport, diver Henderson flashed a faint, grateful thumbs-up",
      clueFa: "خط سوم رو ببین دوست من؛ با دستش علامت تایید و شکرگزاری نشان داد که زنده و پایدار هستند.",
    },
    choiceA: {
      labelEn: "Transfer all three divers into Triton's warm medical pod and lock the transfer hatch!",
      labelFa: "هر سه غواص را به اتاقک گرم درمانی تریتون منتقل کرده و دریچه را قفل کن!",
      descriptionFa: "انتقال امن تمام نفرات به محیط گرم و تحت کنترل پزشکی زیردریایی.",
    },
    choiceB: {
      labelEn: "Attach a secondary autonomous gas recirculator pod to the bell to maintain redundant life support!",
      labelFa: "کپسول تصفیه و بازچرخانی خودکار پشتیبان گاز را به بدنه وصل کن تا ذخیره گاز پایدار بماند!",
      descriptionFa: "اطمینان صددرصد از تداوم اکسیژن در هر شرایط پیش‌بینی‌نشده.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Struggling against deep currents inside his titanium exoskeleton, Nathan locked the heavy brass coupler into the bell’s thermal intake valve. High-pressure water heated to fifty degrees Celsius pumped through the bell’s internal radiative heating jackets. Within ten minutes, internal cabin temperatures rose from near-freezing to a comfortable twenty-six degrees. Over the acoustic comms, diver Miller’s voice came through clear and steady: 'Nathan, you just brought us back from the edge of the grave. Our shivering stopped, and our fingers have feeling again.'",
    keywords: [
      { word: "radiative", meaningFa: "تابشی (ژاکت‌های حرارتی گرمایش از طریق لوله‌های آب داغ)", phonetic: "/ˈreɪdiətɪv/" },
      { word: "coupler", meaningFa: "کوپلر و اتصال‌دهنده قفل‌شونده فشار قوی", phonetic: "/ˈkʌplər/" },
      { word: "exoskeleton", meaningFa: "اسکلت فلزی محافظ غواص", phonetic: "/ˈeksəʊskelɪtn/" },
      { word: "shivering", meaningFa: "لرزیدن شدید بدن در اثر سرمای استخوان‌سوز", phonetic: "/ˈʃɪvərɪŋ/" },
    ],
    question: {
      promptEn: "To what comfortable temperature did the bell's interior rise after pumping the warm water?",
      promptFa: "دمای درون کپسول پس از تزریق آب گرم به چند درجه مطبوع افزایش یافت؟",
      options: [
        "A comfortable twenty-six degrees Celsius",
        "Barely five degrees Celsius",
        "An overheated fifty degrees Celsius",
      ],
      correctIndex: 0,
      hintSnippet: "internal cabin temperatures rose from near-freezing to a comfortable twenty-six degrees",
      clueFa: "خط دوم رو ببین؛ دما از نزدیکی نقطه انجماد به ۲۶ درجه سانتی‌گراد گرم و مطبوع رسید.",
    },
    choiceA: {
      labelEn: "Hook the heavy crane hoist directly to the bell's primary lift bail and initiate recovery to surface!",
      labelFa: "قلاب جرثقیل سنگین را به حلقه اصلی بالابر کپسول وصل کن و صعود به سطح را آغاز کن!",
      descriptionFa: "بالا کشیدن کل کپسول با سرعت یکنواخت به سوی عرشه کشتی.",
    },
    choiceB: {
      labelEn: "Guide Triton to dock beneath the warmed bell and escort it through the turbulent thermocline layers!",
      labelFa: "زیردریایی تریتون را زیر کپسول قرار بده تا آن را در عبور از لایه‌های مواج آب اسکورت کند!",
      descriptionFa: "پایداری کامل و جلوگیری از چرخش کپسول در جریان‌های شدید اقیانوسی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Nathan secured two ultra-high-tensile Dyneema lifting strops beneath the bell’s tubular titanium frame. Using the ADS suit’s hydraulic winch, he hoisted the bell four meters off the mud shelf, clearing it from the collapsing fault line just as three hundred tons of silt and shale slid into the trench below. The bell swung cleanly into open water, perfectly level and stable. Lars radioed down from Triton: 'Nathan, that was a masterclass in deep-water rigging under fire. The bell is clear and ready for the main hoist.'",
    keywords: [
      { word: "strops", meaningFa: "تسمه‌های فوق‌العاده قوی و پهن بالابر صنعتی", phonetic: "/strɒps/" },
      { word: "tubular", meaningFa: "لوله‌ای، ساخته‌شده از لوله‌های توخالی اما مستحکم", phonetic: "/ˈtjuːbjələr/" },
      { word: "silt", meaningFa: "لای و گل‌ولای بسیار نرم ته‌نشین‌شده در کف دریا", phonetic: "/sɪlt/" },
      { word: "rigging", meaningFa: "مهار و بکسل‌بندی فنی و مهندسی تجهیزات سنگین", phonetic: "/ˈrɪɡɪŋ/" },
    ],
    question: {
      promptEn: "What disaster did Nathan avert by lifting the bell off the mud shelf just in time?",
      promptFa: "ناتان با بالا کشیدن کپسول از لبه گل‌آلود از چه فاجعه‌ای جلوگیری کرد؟",
      options: [
        "Three hundred tons of silt and shale collapsed into the trench where the bell had stood",
        "A rogue torpedo struck the seabed",
        "A giant octopus tangled the lift cables",
      ],
      correctIndex: 0,
      hintSnippet: "clearing it from the collapsing fault line just as three hundred tons of silt and shale slid into the trench below",
      clueFa: "خط دوم رو بخون رفیق؛ ۳۰۰ تن سنگ و گل درست همان لحظه به قعر دره ریخت و اگر جابجا نمی‌شد کپسول دفن می‌شد.",
    },
    choiceA: {
      labelEn: "Signal Ocean Titan’s bridge to begin hoisting the stabilized bell at twelve meters per minute!",
      labelFa: "به پل فرماندهی کشتی علامت بده تا بالا کشیدن کپسول را با سرعت ۱۲ متر در دقیقه آغاز کنند!",
      descriptionFa: "حرکت آرام و پیوسته به سوی سطح دریا با پایش دقیق فشار درونی.",
    },
    choiceB: {
      labelEn: "Dock Nathan’s ADS suit onto Triton’s external platform and ascend together as a unified convoy!",
      labelFa: "لباس زرهی ناتان را روی سکوی تریتون قفل کن و همگی به صورت کاروان یکپارچه بالا بیایید!",
      descriptionFa: "حفاظت تیمی هم‌زمان از امدادگر و کپسول نجات در طول صعود.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Triton surfaced through raging twelve-meter waves, docking seamlessly into Ocean Titan's moonpool reception tunnel. The vessel’s heave-compensated hydraulic gantry locked onto Triton, transferring the entire pressurized pod into the ship's saturation medical suite. The three divers were transferred directly into the living chambers without losing a single pound of pressure. Kelly sat beside them, adjusting the gradual decompression schedule: it would take eighteen days of slow decompression to safely desaturate their tissues, but their lives were completely secure.",
    keywords: [
      { word: "moonpool", meaningFa: "حوضچه مرکزی درون کشتی (دهانه باز در کف کشتی برای اعزام تجهیزات به دریا)", phonetic: "/ˈmuːnpuːl/" },
      { word: "heave-compensated", meaningFa: "تعدیل‌کننده تلاطم امواج با جک‌های هیدرولیک هوشمند", phonetic: "/hiːv ˈkɒmpənseɪtɪd/" },
      { word: "desaturate", meaningFa: "تخلیه تدریجی و بی‌خطر گازهای اشباع‌شده از بافت‌های بدن", phonetic: "/diːˈsætʃəreɪt/" },
      { word: "gantry", meaningFa: "دکل و جرثقیل متحرک دروازه‌ای سنگین روی عرشه", phonetic: "/ˈɡæntri/" },
    ],
    question: {
      promptEn: "How many days of gradual decompression were required to safely desaturate the divers' tissues?",
      promptFa: "چند روز کاهش فشار تدریجی لازم بود تا گازهای حل‌شده در بدن غواصان با ایمنی کامل تخلیه شوند؟",
      options: [
        "Eighteen days of slow, controlled decompression",
        "Two hours in a warm sauna",
        "Six months of complete bed rest",
      ],
      correctIndex: 0,
      hintSnippet: "it would take eighteen days of slow decompression to safely desaturate their tissues, but their lives were completely secure",
      clueFa: "خط آخر رو نگاه کن دوست من؛ هجده روز کاهش فشار مداوم و کنترل‌شده در اتاقک فشار روی کشتی.",
    },
    choiceA: {
      labelEn: "Manage the eighteen-day hyperbaric decompression schedule with round-the-clock medical monitoring!",
      labelFa: "برنامه ۱۸ روزه کاهش فشار را با پایش پزشکی شبانه‌روزی و تخصصی سرپرستی کن!",
      descriptionFa: "تضمین بازگشت کامل سلامتی غواصان بدون کمترین عارضه جانبی.",
    },
    choiceB: {
      labelEn: "Celebrate the successful extraction with the vessel's engineering crew in the mess hall!",
      labelFa: "پیروزی نجات را در سالن غذاخوری کشتی در کنار کادر فنی و ملوانان جشن بگیرید!",
      descriptionFa: "خداقوت گفتن به همه کسانی که در دل طوفان دریا جان همکارانشان را نجات دادند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Hovering in the stable subsea zone at three hundred meters, Kelly performed a critical hyperbaric neurological assessment on the divers. By stabilizing their gas mixture with an enriched normoxic heliox blend, she completely eliminated early signs of high-pressure nervous syndrome (HPNS). Diver Walsh grinned through his oxygen mask: 'Kelly, you're the finest subsea doctor from Aberdeen to Stavanger.' Lars maneuvered Triton toward the surface, the dark oceanic abyss giving way to green surface light.",
    keywords: [
      { word: "normoxic", meaningFa: "دارای درصد اکسیژن بهینه و طبیعی برای پیشگیری از مسمومیت", phonetic: "/nɔːˈmɒksɪk/" },
      { word: "HPNS", meaningFa: "سندرم عصبی فشار بالا (لرزش و سرگیجه ناشی از فشار شدید اعماق)", phonetic: "/ˌeɪtʃ piː en ˈes/" },
      { word: "neurological", meaningFa: "عصبی و مربوط به کارکرد مغز و نخاع", phonetic: "/ˌnjʊərəˈlɒdʒɪkl/" },
      { word: "abyss", meaningFa: "ژرفای تاریک و بی‌انتهای اقیانوس", phonetic: "/əˈbɪs/" },
    ],
    question: {
      promptEn: "What medical syndrome did Kelly's enriched gas blend successfully eliminate?",
      promptFa: "ترکیب گاز غنی‌شده کلی چه سندرم پزشکی خطرناکی را کاملاً برطرف کرد؟",
      options: [
        "Early signs of high-pressure nervous syndrome (HPNS)",
        "Severe acute motion sickness",
        "Permanent deep-sea colorblindness",
      ],
      correctIndex: 0,
      hintSnippet: "completely eliminated early signs of high-pressure nervous syndrome (HPNS)",
      clueFa: "خط دوم رو ببین؛ علائم اولیه سندرم عصبی فشار بالا (HPNS) که باعث لرزش اندام‌ها می‌شود.",
    },
    choiceA: {
      labelEn: "Publish a landmark hyperbaric medicine case study on acute subsea neuro-stabilization!",
      labelFa: "مطالعه موردی برجسته پزشکی پرفشار در تثبیت عصبی اعماق را در مجلات جهانی منتشر کن!",
      descriptionFa: "ارتقای استانداردهای بین‌المللی درمان غواصان در سراسر صنایع فراساحلی.",
    },
    choiceB: {
      labelEn: "Safely dock into Ocean Titan's moonpool as the gale winds begin to subside on the horizon!",
      labelFa: "در حوضچه کشتی پهلو بگیر در حالی که بادهای طوفانی در افق رو به آرامش می‌روند!",
      descriptionFa: "پایانی آرامش‌بخش پس از ساعاتی سرشار از دلهره و آدرنالین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "All three divers were securely sealed inside Triton’s medical compartment, sipping warm electrolyte broth as their vital signs normalized. Lars backed the submersible away from the abandoned bell, engaging the high-speed ballast blow. Triton surged toward the surface like an express elevator. Through the topside comms, Nathan announced to the anxious control room: 'All three divers are in the pod, stable, warm, and heading home.' A roar of thunderous cheers erupted from the ship’s bridge.",
    keywords: [
      { word: "ballast blow", meaningFa: "تخلیه سریع آب مخازن توازن با هوای فشرده جهت صعود سریع", phonetic: "/ˈbæləst bləʊ/" },
      { word: "compartment", meaningFa: "بخش، محفظه ایزوله و مستقل درون فضاپیما یا زیردریایی", phonetic: "/kəmˈpɑːrtmənt/" },
      { word: "normalized", meaningFa: "به حالت طبیعی و پایدار بازگشت", phonetic: "/ˈnɔːrməlaɪzd/" },
      { word: "anxious", meaningFa: "نگران، چشم‌انتظار و پر از اضطراب", phonetic: "/ˈæŋkʃəs/" },
    ],
    question: {
      promptEn: "How did Nathan report the status of the three divers to the anxious control room?",
      promptFa: "ناتان وضعیت سه غواص را به اتاق کنترل نگران چگونه مخابره کرد؟",
      options: [
        "All three divers are in the pod, stable, warm, and heading home",
        "The operation was aborted due to engine smoke",
        "We need three more hours of seabed search",
      ],
      correctIndex: 0,
      hintSnippet: "Nathan announced to the anxious control room: 'All three divers are in the pod, stable, warm, and heading home.'",
      clueFa: "خط سوم رو نگاه کن؛ با افتخار گفت: هر سه نفر داخل اتاقک هستند، علائمشان پایدار است، گرم شدند و داریم می‌آییم خانه!",
    },
    choiceA: {
      labelEn: "Award Lars the Subsea Aviation Cross for flawless submersible navigation under fire!",
      labelFa: "صلیب شجاعت ناوبری اعماق را به لارس برای مانور بی‌نقص زیردریایی در بحران اهدا کن!",
      descriptionFa: "تقدیری پرفخر از مهارت خلبانی که جان سه انسان را نجات داد.",
    },
    choiceB: {
      labelEn: "Escort the divers directly into the saturation complex for family video calls!",
      labelFa: "غواصان را به مجتمع اشباع هدایت کن تا تماس تصویری با خانواده‌های نگرانشان برقرار کنند!",
      descriptionFa: "دیدن اشک شوق همسران و فرزندان غواصان در آن سوی مانیتور.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The secondary autonomous gas recirculator pod clicked into the bell’s emergency manifold, locking with triple redundant seals. Internal scrubbers absorbed carbon dioxide while injecting micro-dosed oxygen and helium with surgical precision. The divers' environmental monitors glowed reassuring green across all parameters. Lars piloted Triton alongside the bell as the primary crane cables tensioned smoothly, guiding both craft through the stormy sea layers as a unified defensive formation.",
    keywords: [
      { word: "redundant", meaningFa: "پشتیبان، مازاد بر نیاز برای تضمین ضریب ایمنی", phonetic: "/rɪˈdʌndənt/" },
      { word: "scrubbers", meaningFa: "تصفیه‌کننده‌های شیمیایی دی‌اکسید کربن هوا", phonetic: "/ˈskrʌbərz/" },
      { word: "parameters", meaningFa: "پارامترها و شاخص‌های حیاتی و محیطی", phonetic: "/pəˈræmɪtərz/" },
      { word: "formation", meaningFa: "آرایش هماهنگ پروازی یا دریایی در حرکت گروهی", phonetic: "/fɔːrˈmeɪʃn/" },
    ],
    question: {
      promptEn: "What color did the divers' environmental monitors glow after connecting the recirculator pod?",
      promptFa: "پس از اتصال کپسول تصفیه پشتیبان، مانیتورهای محیطی به چه رنگ اطمینان‌بخشی درآمدند؟",
      options: [
        "Reassuring green across all parameters",
        "Flashing red warning of system failure",
        "Dark yellow indicating low battery",
      ],
      correctIndex: 0,
      hintSnippet: "The divers' environmental monitors glowed reassuring green across all parameters",
      clueFa: "خط سوم رو ببین دوست من؛ تمام شاخص‌ها با رنگ سبز آرامش‌بخش نشان دادند که اکسیژن و فشار کاملاً طبیعی است.",
    },
    choiceA: {
      labelEn: "Establish the redundant life support protocol as standard international offshore diving safety policy!",
      labelFa: "پروتکل سیستم‌های تصفیه پشتیبان را به قانون الزامی ایمنی غواصی فراساحلی جهان بدل کن!",
      descriptionFa: "قانونی که تا ابد جان هزاران غواص صنعتی را در سراسر دنیا نجات خواهد داد.",
    },
    choiceB: {
      labelEn: "Recover the bell through the ship's moonpool under the cheering spotlights of the deck crew!",
      labelFa: "کپسول را از حوضچه مرکزی کشتی زیر نورافکن‌ها و هلهله کادر عرشه بالا بکشید!",
      descriptionFa: "پیروزی کار تیمی درخشان مهندسان بر امواج سرکش اقیانوس.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Tensioning the main hoist winch smoothly at twelve meters per minute, the heavy steel cables hauled the warm bell upward through the North Sea darkness. Nathan, riding inside his ADS exoskeleton right alongside the bell, monitored the rigging lines to ensure no twist or snag occurred. At fifty meters depth, they entered the green sunlight filtering through surface swells. As the bell breached the foam-crested surface and swung into Ocean Titan’s moonpool, fifty engineers erupted in triumphant applause.",
    keywords: [
      { word: "snag", meaningFa: "گیر کردن، پیچ خوردن یا قفل شدن کابل", phonetic: "/snæɡ/" },
      { word: "filtering", meaningFa: "پالایش یافتن و گذر کردن نور از میان آب", phonetic: "/ˈfɪltərɪŋ/" },
      { word: "foam-crested", meaningFa: "پوشیده از کف سفید امواج خروشان", phonetic: "/fəʊm ˈkrestɪd/" },
      { word: "hoist", meaningFa: "بالابر و قرقره‌های سنگین جرثقیل دریایی", phonetic: "/hɔɪst/" },
    ],
    question: {
      promptEn: "Where was the rescued diving bell transferred upon breaching the surface?",
      promptFa: "کپسول نجات‌یافته پس از شکافتن امواج سطح آب به کدام بخش کشتی منتقل شد؟",
      options: [
        "Swung smoothly into Ocean Titan's moonpool reception chamber",
        "Landed onto a rocky beach five miles away",
        "Towed behind a fishing trawler",
      ],
      correctIndex: 0,
      hintSnippet: "As the bell breached the foam-crested surface and swung into Ocean Titan’s moonpool, fifty engineers erupted in triumphant applause",
      clueFa: "خط آخر رو نگاه کن؛ با چرخش آرام جرثقیل مستقیماً وارد حوضچه مرکزی امن درون کشتی شد.",
    },
    choiceA: {
      labelEn: "Connect the bell directly to the living chambers to begin the controlled decompression cycle!",
      labelFa: "کپسول را مستقیماً به اتاقک‌های زندگی متصل کن تا چرخه کنترل‌شده کاهش فشار آغاز شود!",
      descriptionFa: "انتقال بدون تغییر فشار به محیطی راحت با امکانات رفاهی کامل.",
    },
    choiceB: {
      labelEn: "Present Nathan with the Subsea Lifesaving Star on the moonpool deck!",
      labelFa: "نشان ستاره نجات اعماق را روی عرشه حوضچه به ناخدا ناتان اهدا کن!",
      descriptionFa: "تجلیل از اسطوره شجاعت و مهندسی نجات در آب‌های عمیق.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Escorted by Triton’s powerful hydraulic thrusters, the warmed diving bell rose through the turbulent thermocline without a single degree of wobble. In the moonpool, the heave-compensated arms grasped the bell’s lifting ring with surgical security. With the divers warm, breathing clean heliox, and in high spirits, the hatch was mated to the saturation living complex. Nathan popped the seal of his ADS helmet, grinning through beads of sweat: 'We don't leave anyone behind in the North Sea. Not on my watch.'",
    keywords: [
      { word: "thermocline", meaningFa: "لایه جهش دمایی آب در اقیانوس (مرز میان آب گرم و سرد با چگالی متفاوت)", phonetic: "/ˈθɜːrməklaɪn/" },
      { word: "wobble", meaningFa: "لرزش، تکان و انحراف ناپایدار", phonetic: "/ˈwɒbl/" },
      { word: "heave-compensated", meaningFa: "جبران‌کننده تلاطم امواج با فناوری هیدرولیک", phonetic: "/hiːv ˈkɒmpənseɪtɪd/" },
      { word: "watch", meaningFa: "شیفت، نوبت دیده‌بانی و مسئولیت فرماندهی", phonetic: "/wɒtʃ/" },
    ],
    question: {
      promptEn: "What memorable motto did Nathan deliver as he removed his atmospheric diving helmet?",
      promptFa: "ناتان هنگام باز کردن کلاه زرهی خود چه جمله ماندگاری بیان کرد؟",
      options: [
        "We don't leave anyone behind in the North Sea. Not on my watch.",
        "Deep water is too dangerous for commercial work",
        "Next time we should bring electric blankets from home",
      ],
      correctIndex: 0,
      hintSnippet: "Nathan popped the seal of his ADS helmet, grinning through beads of sweat: 'We don't leave anyone behind in the North Sea. Not on my watch.'",
      clueFa: "جمله آخر رو بخون؛ با لبخند گفت: ما هیچ‌کس را در اعماق دریای شمال جا نمی‌گذاریم. در شیفت کاری من هرگز!",
    },
    choiceA: {
      labelEn: "Toast the crew's unshakable brotherhood with hot coffee in the galley while the gale rages outside!",
      labelFa: "برادری ناگسستنی تیم را با قهوه داغ در غذاخوری جشن بگیرید در حالی که طوفان بیرون زوزه می‌کشد!",
      descriptionFa: "لحظاتی صمیمی و شیرین از پیروزی اراده انسان بر خشم طبیعت.",
    },
    choiceB: {
      labelEn: "Broadcast the miraculous rescue to global maritime news networks under live satellite feeds!",
      labelFa: "خبر این عملیات معجزه‌آسا را از طریق ماهواره برای رسانه‌های دریایی جهان مخابره کن!",
      descriptionFa: "الهام‌بخشی به جامعه دریانوردی و خانواده‌های نگران ملوانان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Hovering safely above the collapsed seabed trench, the crane winch hauled the bell at twelve meters per minute. The internal telemetry screens in the bridge showed steady cabin pressure and rising core body temperatures for all three divers. The ship’s motion-damped heave compensators completely neutralized the rolling effects of thirty-foot surface waves. As the bell cleared the water into the ship’s hangar, the medical team took custody of the divers, declaring them completely free from hypothermic tissue damage.",
    keywords: [
      { word: "motion-damped", meaningFa: "میراکننده تکان‌ها و حرکات شدید کشتی با جک‌های هیدرولیک", phonetic: "/ˈməʊʃn dæmpt/" },
      { word: "compensators", meaningFa: "متعادل‌کننده‌ها و جبران‌کننده‌های فشار و تکان", phonetic: "/ˈkɒmpənseɪtərz/" },
      { word: "hangar", meaningFa: "آشیانه سرپوشیده و ایزوله نگهداری تجهیزات غواصی در کشتی", phonetic: "/ˈhæŋər/" },
      { word: "custody", meaningFa: "مراقبت، تحت نظر گرفتن و تحویل پزشکی", phonetic: "/ˈkʌstədi/" },
    ],
    question: {
      promptEn: "What did the ship's medical team declare about the divers upon arrival in the hangar?",
      promptFa: "تیم پزشکی کشتی پس از ورود کپسول به آشیانه چه خبری درباره وضعیت غواصان داد؟",
      options: [
        "Declared them completely free from hypothermic tissue damage",
        "Stated they needed urgent leg surgeries",
        "Reported permanent loss of memory",
      ],
      correctIndex: 0,
      hintSnippet: "the medical team took custody of the divers, declaring them completely free from hypothermic tissue damage",
      clueFa: "خط آخر رو ببین؛ اعلام کردند خوشبختانه هیچ بافتی از بدنشان دچار آسیب ناشی از سرمازدگی نشده است.",
    },
    choiceA: {
      labelEn: "Escort the divers into the luxury saturation living quarters for a feast of hot broth and steaks!",
      labelFa: "غواصان را به اتاقک‌های اشباع لوکس هدایت کن تا با سوپ داغ و استیک کبابی از آنها پذیرایی شود!",
      descriptionFa: "شبی لذت‌بخش و آرام در کنار کادر درمانی برای بازیافتن کامل قوا.",
    },
    choiceB: {
      labelEn: "Award the entire deck operations crew the Queen's Commendation for Bravery at Sea!",
      labelFa: "مدال تقدیر شجاعت در دریا را به تمام کادر عرشه و عملیات اهدا کن!",
      descriptionFa: "بالاترین افتخار مدنی برای فداکاری در شرایط طوفانی اقیانوس.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Locked securely onto Triton's exterior transport rig, Nathan and the ADS suit ascended alongside the diving bell in a disciplined three-tier formation. The synchronized convoy reached Ocean Titan’s moonpool with zero incidents. As Nathan stepped out of the heavy titanium suit, diver Henderson clapped him on the shoulder through the chamber viewport with tears of profound relief. The North Sea storm had thrown its worst fury at the team, and human engineering, discipline, and loyalty had won completely.",
    keywords: [
      { word: "three-tier", meaningFa: "سه‌سطحی، آرایش سه‌گانه منظم", phonetic: "/θriː tɪər/" },
      { word: "disciplined", meaningFa: "منظم، باانضباط و طبق پروتکل‌های دقیق", phonetic: "/ˈdɪsəplɪnd/" },
      { word: "convoy", meaningFa: "کاروان امدادی منسجم در حرکت دسته‌جمعی", phonetic: "/ˈkɒnvɔɪ/" },
      { word: "fury", meaningFa: "خشم، غرش و توحش ویرانگر طوفان", phonetic: "/ˈfjʊəri/" },
    ],
    question: {
      promptEn: "How was the convoy described as it reached the ship's moonpool with zero incidents?",
      promptFa: "کاروان امدادی هنگام رسیدن به حوضچه کشتی بدون هیچ حادثه‌ای چگونه توصیف شد؟",
      options: [
        "A disciplined three-tier formation that conquered the storm through engineering and loyalty",
        "A chaotic scramble of broken ropes",
        "A drifting wreck caught in fishing nets",
      ],
      correctIndex: 0,
      hintSnippet: "ascended alongside the diving bell in a disciplined three-tier formation. The synchronized convoy reached Ocean Titan’s moonpool with zero incidents",
      clueFa: "خطوط اول و دوم رو بخون؛ کاروانی منظم و سه‌گانه که با مهندسی، انضباط و وفاداری بر طوفان غلبه کرد.",
    },
    choiceA: {
      labelEn: "Sign the vessel's official logbook recording the most daring deep-sea rescue in North Sea history!",
      labelFa: "دفترچه وقایع رسمی کشتی را به عنوان جسورانه‌ترین عملیات نجات تاریخ دریای شمال امضا کنید!",
      descriptionFa: "ثبت ابدی سندی از حماسه امدادگران در تاریخ دریانوردی.",
    },
    choiceB: {
      labelEn: "Gather the entire crew for a champagne toast as dawn illuminates the calm, victorious sea!",
      labelFa: "تمام کادر کشتی را برای جشن پیروزی گرد هم بیاور وقتی سپیده‌دم دریای آرام را زرین می‌کند!",
      descriptionFa: "پایانی شکوهمند و الهام‌بخش در آغوش آفتاب بامدادی اقیانوس.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Eighteen days later, the decompression chamber pressure gauge clicked down to one atmosphere. The heavy brass hatch swung open, and divers Henderson, Walsh, and Miller stepped out into the bright Aberdeen sunlight to roaring cheers from their families and colleagues. Kelly and Nathan stood beside them, holding up the divers' intact pressure logs. A senior offshore executive approached Nathan with tears of gratitude: 'Commander, because of your protocol, three children have their fathers home tonight.'",
    keywords: [
      { word: "gauge", meaningFa: "گیج فشارسنج دقیق اتاقک", phonetic: "/ɡeɪdʒ/" },
      { word: "colleagues", meaningFa: "همکاران حرفه‌ای و همرزمان کاری", phonetic: "/ˈkɒliːɡz/" },
      { word: "intact", meaningFa: "دست‌نخورده، سالم و بدون نقص", phonetic: "/ɪnˈtækt/" },
      { word: "gratitude", meaningFa: "سپاسگزاری صمیمانه و قلبی", phonetic: "/ˈɡrætɪtjuːd/" },
    ],
    question: {
      promptEn: "What happened when the decompression gauge finally clicked down to one atmosphere?",
      promptFa: "وقتی درجه فشارسنج بالاخره روی یک اتمسفر نشست چه اتفاقی افتاد؟",
      options: [
        "The hatch opened and the three rescued divers stepped out into the sunlight to embrace their families",
        "The chamber began leaking helium again",
        "The divers were transferred to a military submarine",
      ],
      correctIndex: 0,
      hintSnippet: "The heavy brass hatch swung open, and divers Henderson, Walsh, and Miller stepped out into the bright Aberdeen sunlight to roaring cheers from their families",
      clueFa: "خط دوم رو ببین؛ دریچه باز شد و هر سه غواص سالم زیر نور آفتاب در آغوش گرم خانواده‌هایشان قرار گرفتند.",
    },
    choiceA: {
      labelEn: "Celebrate the reunion with a grand family banquet on the Aberdeen pier!",
      labelFa: "این دیدار دوباره را با ضیافت خانوادگی باشکوه در اسکله آبردین جشن بگیرید!",
      descriptionFa: "لحظاتی سرشار از اشک شوق، خنده و در آغوش کشیدن فرزندان.",
    },
    choiceB: {
      labelEn: "Accept the International Maritime Organization's Exceptional Bravery Award!",
      labelFa: "جایزه شجاعت استثنایی سازمان بین‌المللی دریانوردی را در لندن دریافت کن!",
      descriptionFa: "بالاترین افتخار جامعه جهانی دریانوردی برای نجات جان انسان‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The mess hall of Ocean Titan resounded with laughter, accordion music, and clinking mugs of hot cider as sixty engineers and divers celebrated. Outside, the autumn gale had blown itself out, leaving gentle starlight mirrored on the swell. Nathan toasted Kelly and Lars: 'The North Sea will test your metal and your nerve, but when you stand with people who refuse to yield, there is no depth you cannot conquer.'",
    keywords: [
      { word: "accordion", meaningFa: "آکاردئون (ساز موسیقی سنتی دریانوردان اروپایی)", phonetic: "/əˈkɔːrdiən/" },
      { word: "yield", meaningFa: "تسلیم شدن، کوتاه آمدن در برابر سختی‌ها", phonetic: "/jiːld/" },
      { word: "conquer", meaningFa: "فتح کردن، چیره شدن بر موانع", phonetic: "/ˈkɒŋkər/" },
      { word: "metal", meaningFa: "جوهر وجود، عیار شجاعت و اصالت درونی", phonetic: "/ˈmetl/" },
    ],
    question: {
      promptEn: "What truth about standing with unyielding teammates did Nathan share in his toast?",
      promptFa: "ناتان در سخنانش درباره هم‌تیمی‌های تسلیم‌ناپذیر به چه حقیقت زیبایی اشاره کرد؟",
      options: [
        "When you stand with people who refuse to yield, there is no depth you cannot conquer",
        "Always avoid eating seafood during autumn storms",
        "Deep-sea diving is only for those who dislike sunny weather",
      ],
      correctIndex: 0,
      hintSnippet: "when you stand with people who refuse to yield, there is no depth you cannot conquer",
      clueFa: "جمله آخر رو بخون؛ وقتی در کنار انسان‌هایی بایستی که هرگز تسلیم نمی‌شوند، هیچ ژرفایی نیست که نتوانی فتح کنی.",
    },
    choiceA: {
      labelEn: "Lead the traditional sea-shanty chorus with the crew until dawn breaks over the North Sea!",
      labelFa: "ترانه‌های حماسی سنتی دریانوردان را با کادر کشتی تا طلوع آفتاب هم‌خوانی کنید!",
      descriptionFa: "پایانی شاداب، پرشور و پر از خاطرات ماندگار رفاقت.",
    },
    choiceB: {
      labelEn: "Share a peaceful cup of tea on the bridge wing as dawn paints the waters in gold!",
      labelFa: "یک فنجان چای در سکوت ایوان پل فرماندهی بنوشید در حالی که طلوع دریا را طلایی می‌کند!",
      descriptionFa: "آرامشی ناب و عمیق پس از شبی سرشار از دلاوری.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Kelly’s clinical case study on 'Immediate Subsea Normoxic Stabilization in Deep-Saturation Emergencies' was published in The New England Journal of Medicine. Global diving contractors in Norway, the Gulf of Mexico, and Singapore immediately updated their hyperbaric emergency manuals. Kelly was awarded the prestigious Undersea and Hyperbaric Medical Society Pioneer Medal, forever remembered as the physician who saved three divers when conventional medical dogma insisted it was impossible.",
    keywords: [
      { word: "dogma", meaningFa: "باورهای جزمی، تعصبات قدیمی و قواعد تغییرناپذیر گذشته", phonetic: "/ˈdɒɡmə/" },
      { word: "pioneer", meaningFa: "پیشگام، پیشاهنگ نوآوری و راه‌گشا", phonetic: "/ˌpaɪəˈnɪər/" },
      { word: "normoxic", meaningFa: "تثبیت اکسیژن در تراز طبیعی بدون مسمومیت", phonetic: "/nɔːˈmɒksɪk/" },
      { word: "contractors", meaningFa: "پیمانکاران و شرکت‌های بزرگ عملیات فراساحلی", phonetic: "/kənˈtræktərz/" },
    ],
    question: {
      promptEn: "What prestigious medical medal was awarded to Kelly for her groundbreaking case study?",
      promptFa: "کدام نشان افتخار پزشکی به پاس این پژوهش بنیادین به کلی اهدا شد؟",
      options: [
        "The Undersea and Hyperbaric Medical Society Pioneer Medal",
        "The Royal Navy Volunteer Ribbon",
        "The Geneva Pharmaceutical Trophy",
      ],
      correctIndex: 0,
      hintSnippet: "Kelly was awarded the prestigious Undersea and Hyperbaric Medical Society Pioneer Medal",
      clueFa: "خط سوم رو ببین دوست من؛ مدال پیشگامان پزشکی پرفشار و اعماق دریا (Pioneer Medal).",
    },
    choiceA: {
      labelEn: "Deliver the keynote address at the World Congress on Diving and Hyperbaric Medicine in Oslo!",
      labelFa: "سخنرانی افتتاحیه کنگره جهانی غواصی و پزشکی پرفشار را در اسلو ایراد کن!",
      descriptionFa: "درخشش بانوی پیشگام پزشکی در جمع برجسته‌ترین جراحان و متخصصان جهان.",
    },
    choiceB: {
      labelEn: "Endow an annual scholarship in deep-sea medical physiology at the University of Aberdeen!",
      labelFa: "بورسیه سالانه فیزیولوژی پزشکی اعماق دریا را در دانشگاه آبردین تاسیس کن!",
      descriptionFa: "آموزش نسل جدید پزشکان نجات برای حفاظت از جان کارگران دریا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "As Triton docked into the moonpool, morning sunlight illuminated the calm harbor of Stavanger. The three divers sat wrapped in blankets inside the living complex, eating warm oatmeal and watching the peaceful fjord waters through the portholes. Nathan and Kelly clinked enamel mugs of hot coffee on the deck: against forty-three atmospheres of crushing pressure, human dedication had triumphed completely, proving that no soul is ever beyond the reach of courage.",
    keywords: [
      { word: "portholes", meaningFa: "پنجره‌های گرد و ضخیم کشتی‌ها و اتاقک‌های فشار", phonetic: "/ˈpɔːrthəʊlz/" },
      { word: "enamel", meaningFa: "لیوان‌های لعابی سنتی ملوانان و کوهنوردان", phonetic: "/ɪˈnæml/" },
      { word: "triumphed", meaningFa: "پیروز شد، فاتح میدان گشت", phonetic: "/ˈtraɪəmft/" },
      { word: "dedication", meaningFa: "فداکاری، تعهد خالصانه و ازخودگذشتگی", phonetic: "/ˌdedɪˈkeɪʃn/" },
    ],
    question: {
      promptEn: "What truth did Nathan and Kelly reflect upon as they clinked coffee mugs in the calm harbor?",
      promptFa: "ناتان و کلی هنگام زدن لیوان‌های قهوه در بندرگاه آرام به چه حقیقت زیبایی اندیشیدند؟",
      options: [
        "That no soul is ever beyond the reach of courage",
        "That coffee tastes better at high sea levels",
        "That titanium is cheaper than steel",
      ],
      correctIndex: 0,
      hintSnippet: "proving that no soul is ever beyond the reach of courage",
      clueFa: "جمله آخر رو نگاه کن؛ اثبات اینکه هیچ انسانی فراتر از دسترسی شجاعت و فداکاری نیست.",
    },
    choiceA: {
      labelEn: "Celebrate on the quay with the local harbor pilots and families who cheered their arrival!",
      labelFa: "در اسکله در کنار ناخدایان بندر و خانواده‌های شاد که به پیشواز آمدند جشن بگیرید!",
      descriptionFa: "لحظاتی ماندگار از شادی و همبستگی در اسکله زیبای استاوانگر.",
    },
    choiceB: {
      labelEn: "Photograph the sunrise reflecting off the hull of Triton as a symbol of hope for world news!",
      labelFa: "عکسی از بازتاب طلوع آفتاب بر بدنه زیردریایی تریتون به عنوان نماد امید ثبت کن!",
      descriptionFa: "تصویری حماسی که در صفحه اول روزنامه‌های معتبر جهان خواهد درخشید.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The Subsea Aviation Cross was pinned onto Lars's uniform in a formal naval ceremony at Portsmouth. The citation praised his millimeter-precise robotic arm maneuvering in sub-zero currents, which had plugged the lethal gas leak under extreme tidal forces. Flanked by his crewmates, Lars smiled modestly: 'I just flew the boat; it was the bravery of the divers and Kelly's medical brilliance that brought everyone home alive.'",
    keywords: [
      { word: "citation", meaningFa: "بیانیه رسمی تقدیرنامه شجاعت و افتخار", phonetic: "/saɪˈteɪʃn/" },
      { word: "flanked", meaningFa: "احاطه‌شده، در کنار یاران در دو سو ایستاده", phonetic: "/flæŋkt/" },
      { word: "modestly", meaningFa: "با فروتنی، بدون خودستایی و با تواضع", phonetic: "/ˈmɒdɪstli/" },
      { word: "tidal", meaningFa: "جزرومدی، ناشی از جریان‌های پرقدرت آب دریا", phonetic: "/ˈtaɪdl/" },
    ],
    question: {
      promptEn: "What did pilot Lars modestly attribute the mission's ultimate success to?",
      promptFa: "خلبان لارس با فروتنی موفقیت ماموریت را مدیون چه کسانی دانست؟",
      options: [
        "The bravery of the divers and Kelly's medical brilliance",
        "The high speed of the submersible's electric thrusters",
        "Good weather forecasts from London",
      ],
      correctIndex: 0,
      hintSnippet: "it was the bravery of the divers and Kelly's medical brilliance that brought everyone home alive",
      clueFa: "خط آخر رو بخون؛ گفت من فقط زیردریایی را هدایت کردم؛ این شجاعت خود غواصان و نبوغ پزشکی کلی بود که همه را نجات داد.",
    },
    choiceA: {
      labelEn: "Celebrate the medal with the engineering battalion in a Portsmouth naval gala dinner!",
      labelFa: "این مدال را با یگان مهندسی در ضیافت شام نیروی دریایی در پورتسموث جشن بگیرید!",
      descriptionFa: "شبی سرشار از شکوه نظامی و تجلیل از مهارت فنی.",
    },
    choiceB: {
      labelEn: "Commission a high-tech training simulator modeled after the Viking Graben trench rescue!",
      labelFa: "یک شبیه‌ساز فوق‌پیشرفته تمرینی بر اساس ماموریت نجات دریای شمال طراحی و راه‌اندازی کن!",
      descriptionFa: "آموزش نسل بعدی خلبانان زیردریایی برای مقابله با بحران‌های واقعی اعماق.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Inside the saturation complex, the encrypted video terminal connected to three living rooms in England and Scotland. Through the glass, Henderson, Walsh, and Miller saw their wives and children weeping tears of overwhelming joy. Little seven-year-old Sophie Walsh held up a handmade drawing of a yellow submarine rescuing three divers with the words: 'Thank you for giving me my dad back.' Nathan stood in the control room, wiping away a quiet tear of profound professional fulfillment.",
    keywords: [
      { word: "terminal", meaningFa: "ترمینال و مانیتور ارتباط تصویری", phonetic: "/ˈtɜːrmɪnl/" },
      { word: "fulfillment", meaningFa: "رضایت درونی، حس پرمعنای تحقق وظیفه انسانی", phonetic: "/fʊlˈfɪlmənt/" },
      { word: "handmade", meaningFa: "دست‌ساز، کشیده‌شده با دستان معصوم کودک", phonetic: "/ˌhændˈmeɪd/" },
      { word: "overwhelming", meaningFa: "سرشار، وصف‌ناپذیر و لبریز از احساس", phonetic: "/ˌəʊvərˈwelmɪŋ/" },
    ],
    question: {
      promptEn: "What did seven-year-old Sophie Walsh display on the video screen that moved Nathan to tears?",
      promptFa: "سوفی هفت ساله چه چیزی را روی مانیتور نشان داد که اشک شوق را بر چشمان ناتان نشاند؟",
      options: [
        "A handmade drawing of a yellow submarine rescuing three divers with 'Thank you for giving me my dad back'",
        "A photograph of a gold medal from school",
        "A newspaper clipping of the storm",
      ],
      correctIndex: 0,
      hintSnippet: "held up a handmade drawing of a yellow submarine rescuing three divers with the words: 'Thank you for giving me my dad back.'",
      clueFa: "خط سوم رو ببین دوست من؛ نقاشی کودکانه‌ای از یک زیردریایی زرد با این نوشته: ممنونم که بابایم را به من برگرداندید.",
    },
    choiceA: {
      labelEn: "Frame Sophie's drawing and hang it in Ocean Titan's control room as the vessel's permanent guardian angel!",
      labelFa: "نقاشی سوفی را قاب بگیر و در اتاق کنترل کشتی به عنوان فرشته نگهبان همیشگی نصب کن!",
      descriptionFa: "یادآوری ابدی به تمام مهندسان که چرا کارشان باارزش‌ترین شغل دنیاست.",
    },
    choiceB: {
      labelEn: "Invite all three families to the shipyard reunion banquet upon final decompression completion!",
      labelFa: "خانواده هر سه غواص را به جشن بزرگ اسکله پس از پایان دوره کاهش فشار دعوت کن!",
      descriptionFa: "دیدار حضوری و در آغوش کشیدن کودکانی که چشم‌انتظار پدرانشان بودند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "The International Association of Oil & Gas Producers formally codified the 'Vance-Zhang Redundant Life Support Protocol' into international offshore legislation. Under the new global safety convention, all saturation diving bells operating below two hundred meters worldwide were legally required to carry autonomous triple-redundant gas scrubbers and automated sealing collars. The executive director declared: 'Because three divers survived the North Sea abyss, ten thousand commercial divers will work more safely across every ocean on Earth.'",
    keywords: [
      { word: "codified", meaningFa: "مدون کرد و به قانون رسمی مکتوب تبدیل ساخت", phonetic: "/ˈkəʊdɪfaɪd/" },
      { word: "legislation", meaningFa: "قانون‌گذاری رسمی بین‌المللی", phonetic: "/ˌledʒɪsˈleɪʃn/" },
      { word: "convention", meaningFa: "کنوانسیون و پیمان‌نامه الزام‌آور جهانی", phonetic: "/kənˈvenʃn/" },
      { word: "autonomous", meaningFa: "خودکار و مستقل از مدار اصلی", phonetic: "/ɔːˈtɒnəməs/" },
    ],
    question: {
      promptEn: "What new global safety requirement was codified into international offshore legislation?",
      promptFa: "چه استاندارد الزامی جدیدی در قوانین بین‌المللی غواصی فراساحلی به ثبت رسید؟",
      options: [
        "All saturation bells operating below 200m must carry autonomous triple-redundant gas scrubbers and sealing collars",
        "Diving bells must be accompanied by trained dolphins",
        "Diving operations must shut down whenever it rains",
      ],
      correctIndex: 0,
      hintSnippet: "all saturation diving bells operating below two hundred meters worldwide were legally required to carry autonomous triple-redundant gas scrubbers",
      clueFa: "خط دوم رو بخون؛ تجهیز اجباری تمام کپسول‌های اعماق به سیستم‌های تصفیه پشتیبان سه‌گانه خودکار.",
    },
    choiceA: {
      labelEn: "Sign the International Maritime Safety Charter alongside European energy ministers in Brussels!",
      labelFa: "منشور ایمنی دریانوردی بین‌المللی را در کنار وزیران انرژی اروپا در بروکسل امضا کن!",
      descriptionFa: "پایانی پرافتخار از تبدیل یک بحران سخت به استانداردی ماندگار برای بشریت.",
    },
    choiceB: {
      labelEn: "Host an offshore safety symposium on board Ocean Titan for global industry leaders!",
      labelFa: "همایش بین‌المللی ایمنی فراساحلی را روی عرشه کشتی اوشن تایتان میزبانی کن!",
      descriptionFa: "آموزش تجربیات واقعی نجات به مدیران ارشد صنایع نفت و گاز جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Under blazing deck floodlights, the recovered diving bell was swung onto the cradle of Ocean Titan’s hangar. The entire crew cheered as technicians connected the primary umbilical umbilical umbilical conduits, stabilizing the divers in five-star comfort. Inside, the three divers raised mugs of steaming soup to the viewing window, saluting their rescuers with broad smiles. Nathan, standing beside Kelly, clinked his cup against the titanium viewport: 'Good work, team. We gave the sea a fight, and we brought our brothers home.'",
    keywords: [
      { word: "cradle", meaningFa: "بستر یا نشیمنگاه فولادی نگهداری کپسول روی عرشه", phonetic: "/ˈkreɪdl/" },
      { word: "conduits", meaningFa: "کانال‌ها، لوله‌ها و خطوط اتصالات فنی", phonetic: "/ˈkɒndjuːɪts/" },
      { word: "saluting", meaningFa: "ادای احترام کردن، سلام نظامی دادن با قدرشناسی", phonetic: "/səˈluːtɪŋ/" },
      { word: "viewport", meaningFa: "پنجره شیشه‌ای ضخیم اتاقک فشار", phonetic: "/ˈvjuːpɔːrt/" },
    ],
    question: {
      promptEn: "What did the three rescued divers do at the viewing window to salute their rescuers?",
      promptFa: "سه غواص نجات‌یافته پشت پنجره اتاقک برای ادای احترام به امدادگران چه حرکتی کردند؟",
      options: [
        "Raised mugs of steaming soup to the viewing window, saluting with broad smiles",
        "Turned off all cabin lights in protest",
        "Knocked with an iron hammer on the glass",
      ],
      correctIndex: 0,
      hintSnippet: "the three divers raised mugs of steaming soup to the viewing window, saluting their rescuers with broad smiles",
      clueFa: "خط سوم رو ببین؛ لیوان‌های سوپ داغ را به نشانه سلامتی بالا بردند و با لبخندی پهن به امدادگران ادای احترام کردند.",
    },
    choiceA: {
      labelEn: "Celebrate the successful recovery with a lavish captain's dinner in the officers' wardroom!",
      labelFa: "پیروزی عملیات را با شام شاهانه کاپیتان در سالن غذاخوری افسران جشن بگیرید!",
      descriptionFa: "شبی به‌یادماندنی با بهترین غذاها و شادباش‌های همکاران.",
    },
    choiceB: {
      labelEn: "Inspect the recovered bell to document lessons learned for future subsea engineering!",
      labelFa: "کپسول نجات‌یافته را بررسی فنی کن تا درس‌های آموخته‌شده را برای آینده مستندسازی کنی!",
      descriptionFa: "تکمیل گزارش‌های مهندسی برای ارتقای استحکام تجهیزات در برابر زلزله‌های کف دریا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Connected directly to the saturation living chambers, divers Henderson, Walsh, and Miller were transferred into spacious bunks with heated mattresses and entertainment systems. Medical scans confirmed zero pulmonary barotrauma and complete cardiac recovery. Meeting his wife through the transparent hyperbaric partition, Henderson whispered: 'The cold was eating into my bones, Sarah, but I heard Nathan's voice over the comms, and I knew I was coming home to you.'",
    keywords: [
      { word: "barotrauma", meaningFa: "باروتروما (آسیب بافتی ریه یا گوش ناشی از تغییرات فشار محیط)", phonetic: "/ˌbærəˈtrɔːmə/" },
      { word: "pulmonary", meaningFa: "ریوی، وابسته به شش‌ها و دستگاه تنفس", phonetic: "/ˈpʌlmənəri/" },
      { word: "partition", meaningFa: "دیواره یا پنجره شفاف جداکننده دو اتاقک", phonetic: "/pɑːrˈtɪʃn/" },
      { word: "spacious", meaningFa: "جادار، بزرگ و راحت", phonetic: "/ˈspeɪʃəs/" },
    ],
    question: {
      promptEn: "What did the comprehensive medical scans confirm about the rescued divers' lungs and heart?",
      promptFa: "اسکن‌های پزشکی چه چیزی را درباره وضعیت ریه و قلب غواصان نجات‌یافته تایید کرد؟",
      options: [
        "Zero pulmonary barotrauma and complete cardiac recovery",
        "Severe internal bleeding requiring open surgery",
        "Permanent lung collapse from breathing helium",
      ],
      correctIndex: 0,
      hintSnippet: "Medical scans confirmed zero pulmonary barotrauma and complete cardiac recovery",
      clueFa: "خط دوم رو بخون؛ بدون کوچک‌ترین آسیب ریوی و با بهبود کامل کارکرد قلب.",
    },
    choiceA: {
      labelEn: "Host an emotional family celebration outside the saturation chamber partition!",
      labelFa: "جشن پر از احساس دیدار با خانواده را پشت دیواره شفاف اتاقک برگزار کنید!",
      descriptionFa: "خنده‌ها و اشک‌های شوقی که التیام‌بخش روزهای سخت انتظار است.",
    },
    choiceB: {
      labelEn: "Award Nathan the Lifetime Maritime Distinction Medal at the Aberdeen City Hall!",
      labelFa: "مدال یک عمر افتخار دریانوردی را در تالار شهر آبردین به ناخدا ناتان تقدیم کن!",
      descriptionFa: "تقدیری درخور از اسطوره‌ای که نماد وفاداری و شجاعت در دریاست.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "On the moonpool deck of Ocean Titan, surrounded by sixty applauding engineers, Nathan was presented with the Subsea Lifesaving Star—the highest civilian award for bravery in commercial offshore diving. Flanked by Kelly and Lars, Nathan raised the golden medal in tribute to his crew: 'This star belongs to the mechanics who checked the winches, the doctors who watched the monitors, and the divers who never gave up hope.'",
    keywords: [
      { word: "lifesaving", meaningFa: "نجات‌بخش زندگی و نجات جان انسان‌ها", phonetic: "/ˈlaɪfseɪvɪŋ/" },
      { word: "civilian", meaningFa: "غیرنظامی، مدنی و مردمی", phonetic: "/səˈvɪliən/" },
      { word: "tribute", meaningFa: "ادای احترام، تقدیر و سپاسگزاری بزرگ", phonetic: "/ˈtrɪbjuːt/" },
      { word: "applauding", meaningFa: "کف‌زدن، تشویق پرشور و ستایش با دست", phonetic: "/əˈplɔːdɪŋ/" },
    ],
    question: {
      promptEn: "To whom did Nathan dedicate his Subsea Lifesaving Star medal?",
      promptFa: "ناتان مدال ستاره نجات اعماق خود را به چه کسانی تقدیم کرد؟",
      options: [
        "To the mechanics, the doctors, and the divers who never gave up hope",
        "To the government tax collectors in London",
        "To the oil company shareholders in New York",
      ],
      correctIndex: 0,
      hintSnippet: "This star belongs to the mechanics who checked the winches, the doctors who watched the monitors, and the divers who never gave up hope",
      clueFa: "خط آخر رو نگاه کن دوست من؛ به تکنسین‌هایی که کابل‌ها را چک کردند، پزشکانی که مانیتورها را پاییدند و غواصانی که هرگز امید را از دست ندادند.",
    },
    choiceA: {
      labelEn: "Hang the Lifesaving Star in the vessel's mess hall to inspire every future crew member!",
      labelFa: "مدال ستاره نجات را در غذاخوری کشتی نصب کن تا الهام‌بخش تمام نسل‌های آینده ملوانان باشد!",
      descriptionFa: "یادگاری جاودان از شبی که کار تیمی بر خشم دریا چیره شد.",
    },
    choiceB: {
      labelEn: "Sail into Aberdeen harbor with triumphant ship horns sounding across the bay!",
      labelFa: "با بوق‌های شیپور پیروزی کشتی وارد خلیج آبردین شوید در میان استقبال صدها قایق!",
      descriptionFa: "بازگشتی حماسی و دیدنی به وطن در میان هلهله مردمان ساحل.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Inside the warm galley of Ocean Titan, laughter and storytelling echoed late into the night. While thirty-foot waves crashed harmlessly against the reinforced hull outside, the team shared steaming mugs of dark roast coffee and freshly baked pastries. Divers Miller and Walsh, smiling through the video comms from their saturation quarters, challenged Lars to a virtual chess match. Nathan sat back in his leather chair, watching his crew with deep, quiet pride: brotherhood had held the line against the abyss.",
    keywords: [
      { word: "galley", meaningFa: "آشپزخانه و غذاخوری سنتی کشتی‌های دریانوردی", phonetic: "/ˈɡæli/" },
      { word: "storytelling", meaningFa: "روایت داستان‌ها، مرور خاطرات پرهیجان شب حادثه", phonetic: "/ˈstɔːritelɪŋ/" },
      { word: "pastries", meaningFa: "شیرینی‌های تازه و گرم پخته‌شده در تنور کشتی", phonetic: "/ˈpeɪstriz/" },
      { word: "reinforced", meaningFa: "تقویت‌شده با فولاد دوبل ضد طوفان", phonetic: "/ˌriːɪnˈfɔːrst/" },
    ],
    question: {
      promptEn: "What friendly game did the divers challenge pilot Lars to from their saturation quarters?",
      promptFa: "غواصان از داخل اتاقک اشباع خلبان لارس را به چه بازی دوستانه‌ای دعوت کردند؟",
      options: [
        "A virtual chess match through the video monitors",
        "A game of darts on the mess hall wall",
        "An arm-wrestling contest",
      ],
      correctIndex: 0,
      hintSnippet: "challenged Lars to a virtual chess match. Nathan sat back in his leather chair, watching his crew with deep, quiet pride",
      clueFa: "خط سوم رو ببین؛ یک مسابقه شطرنج مجازی دوستانه از پشت مانیتورهای اتاقک فشار.",
    },
    choiceA: {
      labelEn: "Play out the virtual chess match amid cheers and laughter from the entire night watch!",
      labelFa: "مسابقه شطرنج را در میان تشویق و شوخی‌های تمام کادر شیفت شب به پایان برسانید!",
      descriptionFa: "پایانی شاداب، دلنشین و سرشار از خنده‌های بی‌ریا.",
    },
    choiceB: {
      labelEn: "Promise to meet every autumn in Scotland to celebrate the unbreakable bond forged in the deep!",
      labelFa: "عهد ببندید هر پاییز در اسکاتلند گرد هم آیید و پیوند برادری‌تان را جشن بگیرید!",
      descriptionFa: "پیمانی جاودان میان دوستانی که مرگ را با هم شکست دادند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Live satellite video feeds carried the dramatic story of Operation Abyssal Chamber to fifty international television networks. Over eighty million viewers watched the footage of the atmospheric diving suit braving deep mud currents to lock the thermal conduits. Broadcasters hailed the operation as the greatest subsea rescue since the invention of commercial saturation diving, turning Nathan, Kelly, and Lars into global symbols of selfless professional courage.",
    keywords: [
      { word: "broadcasters", meaningFa: "شبکه‌های پخش تلویزیونی و خبرگزاری‌های بین‌المللی", phonetic: "/ˈbrɔːdkɑːstərz/" },
      { word: "selfless", meaningFa: "فداکارانه، خالی از خودخواهی و در راه دیگران", phonetic: "/ˈselfləs/" },
      { word: "conduits", meaningFa: "لوله‌ها و خطوط انتقال آب گرم و گاز", phonetic: "/ˈkɒndjuːɪts/" },
      { word: "footage", meaningFa: "فیلم‌ها و تصاویر ضبط‌شده واقعی از صحنه حادثه", phonetic: "/ˈfʊtɪdʒ/" },
    ],
    question: {
      promptEn: "How many international viewers watched the live broadcast of the dramatic rescue footage?",
      promptFa: "چند میلیون بیننده در جهان فیلم‌های واقعی عملیات نجات اعماق دریا را تماشا کردند؟",
      options: [
        "Over eighty million viewers across fifty networks",
        "One hundred thousand local sailors",
        "Five hundred university professors",
      ],
      correctIndex: 0,
      hintSnippet: "Over eighty million viewers watched the footage of the atmospheric diving suit braving deep mud currents",
      clueFa: "خط دوم رو بخون؛ بیش از ۸۰ میلیون بیننده در ۵۰ شبکه تلویزیونی مبهوت شجاعت امدادگران شدند.",
    },
    choiceA: {
      labelEn: "Host an international press conference aboard Ocean Titan to advocate for subsea worker safety!",
      labelFa: "کنفرانس خبری بین‌المللی را در کشتی برای دفاع از حقوق و ایمنی غواصان جهان برگزار کن!",
      descriptionFa: "رساندن صدای کارگران فداکار دریا به گوش قانون‌گذاران دنیا.",
    },
    choiceB: {
      labelEn: "Accept the World Maritime Heroism Ribbon at the European Parliament in Strasbourg!",
      labelFa: "روبان قهرمانی دریانوردی جهان را در پارلمان اروپا در استراسبورگ دریافت کن!",
      descriptionFa: "افتخاری بین‌المللی برای تجلیل از نجات‌بخش‌ترین ماموریت دریایی سال.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "In the saturation living suite, the divers enjoyed a gourmet banquet of roasted beef tenderloin, baked potatoes, and steamed vegetables prepared by the ship’s chef and passed through the medical airlock. With body temperatures completely stabilized and zero tissue micro-bubbles detected on ultrasound scans, the divers laughed as Walsh strummed his acoustic guitar inside the chamber. Through the intercom, Nathan raised his mug: 'Enjoy the feast, boys. You earned every bite.'",
    keywords: [
      { word: "airlock", meaningFa: "اتاقک قفل هوابند دوطرفه مخصوص انتقال غذا و دارو بدون افت فشار", phonetic: "/ˈeəlɒk/" },
      { word: "tenderloin", meaningFa: "راسته لطیف و لذیذ گوشت", phonetic: "/ˈtendərlɔɪn/" },
      { word: "micro-bubbles", meaningFa: "حباب‌های میکروسکوپی گاز که در صورت افت سریع فشار تشکیل می‌شوند", phonetic: "/ˈmaɪkrəʊ bʌblz/" },
      { word: "intercom", meaningFa: "سیستم صوتی مخابرات داخلی دوطرفه", phonetic: "/ˈɪntərkɒm/" },
    ],
    question: {
      promptEn: "What musical instrument did diver Walsh play inside the saturation chamber during their banquet?",
      promptFa: "غواص والش در حین صرف ضیافت شام درون اتاقک اشباع چه ساز موسیقی نواخت؟",
      options: [
        "An acoustic guitar strummed through the chamber intercom",
        "A brass trumpet",
        "A grand piano",
      ],
      correctIndex: 0,
      hintSnippet: "the divers laughed as Walsh strummed his acoustic guitar inside the chamber",
      clueFa: "خط سوم رو ببین دوست من؛ با گیتار آکوستیک خود آهنگ‌های دلنشینی نواخت و شادی را به اتاقک آورد.",
    },
    choiceA: {
      labelEn: "Sing along with Walsh over the ship's intercom in a chorus of joyous survival!",
      labelFa: "از پشت میکروفون با والش هم‌آوازی کنید در نغمه‌ای شادمانه از جشن زندگی!",
      descriptionFa: "شبی سرشار از صمیمیت، خنده و موسیقی بر فراز امواج اقیانوس.",
    },
    choiceB: {
      labelEn: "Document the dietary protocols that accelerated the divers' physical recovery for offshore medicine!",
      labelFa: "رژیم غذایی مقوی و پروتکل‌های تغذیه درمانی بهبود سریع غواصان را مستندسازی کن!",
      descriptionFa: "ارتقای استانداردهای تغذیه در درمان بیماران تحت کاهش فشار طولانی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Surrounded by senior naval admirals and government ministers in Edinburgh, Nathan, Kelly, and the deck crew were awarded the Queen's Commendation for Valuable Service at Sea. The citation commended their split-second decisions in thirty-foot swells that averted a catastrophic industrial loss of life. Presenting the honors, the First Minister of Scotland declared: 'The waters of the North Sea are merciless, but the courage of these men and women proved that human resolve is stronger than any storm.'",
    keywords: [
      { word: "commendation", meaningFa: "تقدیرنامه رسمی و مدال افتخار شایستگی کشوری", phonetic: "/ˌkɒmenˈdeɪʃn/" },
      { word: "merciless", meaningFa: "بی‌رحم، سنگدل و خشن (مانند سرمای دریا)", phonetic: "/ˈmɜːrsɪləs/" },
      { word: "resolve", meaningFa: "عزم راسخ، اراده پولادین و پایمردی", phonetic: "/rɪˈzɒlv/" },
      { word: "admirals", meaningFa: "دریاداران ارشد نیروی دریایی", phonetic: "/ˈædmərəlz/" },
    ],
    question: {
      promptEn: "What did the First Minister of Scotland state about human resolve in the face of the storm?",
      promptFa: "وزیر ارشد اسکاتلند درباره اراده پولادین انسان در برابر طوفان چه بیان کرد؟",
      options: [
        "Human resolve is stronger than any storm",
        "Storms will always defeat steel ships",
        "Diving should be banned in winter months",
      ],
      correctIndex: 0,
      hintSnippet: "the courage of these men and women proved that human resolve is stronger than any storm",
      clueFa: "خط آخر رو نگاه کن؛ شجاعت این زنان و مردان ثابت کرد که عزم راسخ انسان از هر طوفانی نیرومندتر است.",
    },
    choiceA: {
      labelEn: "Celebrate the royal commendation with a formal piping ceremony at Edinburgh Castle!",
      labelFa: "مدال افتخار را با مراسم سنتی نی‌انبان اسکاتلندی در قلعه ادینبرو جشن بگیرید!",
      descriptionFa: "شکوهی اصیل و تاریخی برای تجلیل از دلاوران دریای شمال.",
    },
    choiceB: {
      labelEn: "Establish an emergency hardship fund for the families of offshore commercial divers!",
      labelFa: "صندوق حمایت مالی و رفاهی خانواده‌های غواصان فراساحلی را تاسیس کن!",
      descriptionFa: "پشتیبانی دائمی از قهرمانانی که در سخت‌ترین اعماق دریا کار می‌کنند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "In the mahogany-paneled chartroom of Ocean Titan, Captain Henderson and Nathan Vance signed the official voyage logbook, officially closing 'Operation Abyssal Chamber'. The entry recorded seventy-four minutes from acoustic distress signal to complete thermal stabilization, setting a world record for deep-water saturation rescue. Closing the leather cover, Nathan looked up at his officers with a smile: 'A ship is just welded steel, gentlemen; it’s the heart of the crew that makes it legendary.'",
    keywords: [
      { word: "chartroom", meaningFa: "اتاق نقشه‌ها و اسناد ناوبری در پل فرماندهی", phonetic: "/ˈtʃɑːrtruːm/" },
      { word: "welded", meaningFa: "جوشکاری‌شده با صفحات فولادی", phonetic: "/ˈweldɪd/" },
      { word: "stabilization", meaningFa: "تثبیت وضعیت و رفع کامل خطر", phonetic: "/ˌsteɪbəlaɪˈzeɪʃn/" },
      { word: "legendary", meaningFa: "افسانه‌ای، ماندگار در تاریخ و زبانزد", phonetic: "/ˈledʒəndri/" },
    ],
    question: {
      promptEn: "How many minutes elapsed from the initial distress signal to complete thermal stabilization?",
      promptFa: "از زمان دریافت اولین سیگنال اضطراری تا تثبیت کامل حرارتی کپسول چند دقیقه طول کشید؟",
      options: [
        "Seventy-four minutes, setting an international deep-water rescue record",
        "Twelve hours of confusion",
        "Three hundred seconds",
      ],
      correctIndex: 0,
      hintSnippet: "The entry recorded seventy-four minutes from acoustic distress signal to complete thermal stabilization",
      clueFa: "خط دوم رو ببین دوست من؛ درست ۷۴ دقیقه که رکوردی بی‌سابقه در نجات آب‌های عمیق جهان برپا کرد.",
    },
    choiceA: {
      labelEn: "Enshrine the signed logbook in the National Maritime Museum in Greenwich!",
      labelFa: "دفترچه وقایع امضاشده را در موزه ملی دریانوردی گرینویچ لندن به یادگار بگذار!",
      descriptionFa: "اثری ماندگار که الهام‌بخش دریانوردان نسل‌های آینده خواهد بود.",
    },
    choiceB: {
      labelEn: "Toast the seventy-four-minute miracle with hot cocoa as the ship sails into port!",
      labelFa: "معجزه ۷۴ دقیقه‌ای را با شکلات داغ در هنگام ورود کشتی به بندرگاه جشن بگیرید!",
      descriptionFa: "شیرینی بی‌نظیر بازگشت به خشکی پس از فتح سخت‌ترین نبرد با دریا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "As dawn crested the horizon, the golden sunlight transformed the North Sea from a cauldron of gray foam into a sparkling sheet of aquamarine glass. On the open helicopter deck of Ocean Titan, sixty crew members, divers, and engineers stood shoulder to shoulder, raising crystal champagne flutes toward the rising sun. Beside Nathan, Kelly laughed freely, her face warmed by the morning rays. They had descended into the black abyss of death, and together, through unyielding courage and brotherhood, they had brought life back into the light.",
    keywords: [
      { word: "cauldron", meaningFa: "دیگ جوشان و خروشان امواج کف‌آلود", phonetic: "/ˈkɔːldrən/" },
      { word: "aquamarine", meaningFa: "آبی زمردین و درخشان دریا", phonetic: "/ˌækwəməˈriːn/" },
      { word: "unyielding", meaningFa: "تسلیم‌ناپذیر، خم‌نشونده در برابر طوفان", phonetic: "/ʌnˈjiːldɪŋ/" },
      { word: "brotherhood", meaningFa: "برادری، همبستگی عمیق و وفاداری تا پای جان", phonetic: "/ˈbrʌðəhʊd/" },
    ],
    question: {
      promptEn: "What transformed the North Sea into a sparkling sheet of aquamarine glass at the story's climax?",
      promptFa: "چه چیزی در پایان داستان دریای شمال را از دیگ جوشان کف‌آلود به پهنه‌ای درخشان و زمردین بدل کرد؟",
      options: [
        "Golden sunlight as dawn crested the horizon with the return of calm weather",
        "A chemical spill turning the sea yellow",
        "A layer of frozen snow covering the waves",
      ],
      correctIndex: 0,
      hintSnippet: "As dawn crested the horizon, the golden sunlight transformed the North Sea from a cauldron of gray foam into a sparkling sheet of aquamarine glass",
      clueFa: "خط اول رو نگاه کن؛ تابش زرین آفتاب سپیده‌دم با آرام گرفتن طوفان دریا را به تابلویی از زمرد و آرامش بدل کرد.",
    },
    choiceA: {
      labelEn: "Clink champagne flutes in eternal gratitude for the brotherhood that conquered the abyss!",
      labelFa: "جام‌ها را به سلامتی برادری جاودانی که بر ژرفای مرگ چیره شد به هم بزنید!",
      descriptionFa: "پایانی حماسی، پرشکوه و ماندگار در قلب دریای شمال.",
    },
    choiceB: {
      labelEn: "Promise to always answer the call whenever a soul is trapped in the darkness of the sea!",
      labelFa: "پیمان ببندید هر زمان که انسانی در تاریکی اعماق دریا گرفتار شد به یاری‌اش بشتابید!",
      descriptionFa: "چشمان همیشه بیدار و قلب‌های شجاعی که نگهبانان ابدی اقیانوس‌ها هستند.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Aberdeen Pier Reunion", titleFa: "دیدار پر از اشک در اسکله آبردین", badgeCategory: "legendary", badgeIcon: "👨‍👩‍👧", badgeNameFa: "پایان طلایی بازگشت به خانه", climaxEn: "Stepping onto the sunlit pier after eighteen days, the divers embrace their weeping families, their lives saved by precision engineering.", climaxFa: "با گام نهادن بر اسکله آفتابی پس از ۱۸ روز، غواصان در آغوش پر از اشک خانواده‌هایشان قرار گرفتند؛ نجاتی که با مهندسی دقیق رقم خورد.", xpReward: 280 },
  { pathCode: "AAAAB", titleEn: "The IMO Gold Medal of Valor", titleFa: "نشان شجاعت سازمان دریانوردی", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان بین‌المللی پرافتخار", climaxEn: "The International Maritime Organization awards Nathan and Kelly its highest medal, hailed as legends of modern saturation diving.", climaxFa: "سازمان بین‌المللی دریانوردی بالاترین مدال شجاعت را به ناتان و کلی اهدا کرد؛ اسطوره‌های نجات غواصی اشباع در دنیای نوین.", xpReward: 275 },
  { pathCode: "AAABA", titleEn: "The Sea-Shanty of the Brave", titleFa: "سرود حماسی دریانوردان", badgeCategory: "funny", badgeIcon: "🪗", badgeNameFa: "پایان صمیمی و پرآواز", climaxEn: "Singing shanties by the warm mess hall hearth, sixty engineers celebrate the triumph of human spirit over forty-three atmospheres of doom.", climaxFa: "با ترانه‌خوانی کنار شومینه غذاخوری، شصت مهندس پیروزی روح تسلیم‌ناپذیر انسان بر ۴۳ اتمسفر فشار مرگبار را جشن گرفتند.", xpReward: 260 },
  { pathCode: "AAABB", titleEn: "The Golden Bridge of Dawn", titleFa: "پل زرین سپیده‌دم", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان آرامش و افتخار", climaxEn: "Sipping hot tea on the bridge wing, Nathan and Kelly watch the North Sea calm into liquid gold, knowing they conquered the impossible.", climaxFa: "با نوشیدن چای در ایوان فرماندهی، ناتان و کلی آرامش طلایی دریا را نگریستند؛ با آگاهی از اینکه ناممکن را به ممکن بدل ساختند.", xpReward: 275 },
  { pathCode: "AABAA", titleEn: "The Oslo Hyperbaric Keynote", titleFa: "سخنرانی تاریخی اسلو", badgeCategory: "scholar", badgeIcon: "🎙️", badgeNameFa: "پایان علمی و الهام‌بخش", climaxEn: "Kelly addresses twelve hundred subsea surgeons in Oslo, revolutionizing emergency deep-water resuscitation protocols worldwide.", climaxFa: "کلی در برابر ۱۲۰۰ جراح و متخصص اعماق در اسلو سخنرانی کرد و پروتکل‌های احیای اضطراری غواصی جهان را متحول ساخت.", xpReward: 280 },
  { pathCode: "AABAB", titleEn: "The Aberdeen Medical Endowment", titleFa: "بنیاد پژوهش‌های پزشکی آبردین", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان ماندگار آموزشی", climaxEn: "Kelly's endowed foundation trains eighty subsea physicians annually, safeguarding the lives of offshore workers across every ocean.", climaxFa: "بنیاد علمی کلی سالانه هشتاد پزشک تخصصی غواصی تربیت می‌کند تا نگهبان جان کارگران فراساحلی در تمام اقیانوس‌ها باشند.", xpReward: 270 },
  { pathCode: "AABBA", titleEn: "The Stavanger Harbor Salute", titleFa: "استقبال پرشور در استاوانگر", badgeCategory: "heroic", badgeIcon: "🚢", badgeNameFa: "پایان مردمی و باشکوه", climaxEn: "Tugboats shoot towering geysers of water in salute as Ocean Titan docks in Norway, celebrated by thousands of cheering citizens.", climaxFa: "یدک‌کش‌ها فواره‌های عظیم آب را به نشانه ادای احترام شلیک کردند وقتی اوشن تایتان در میان هلهله هزاران شهروند در نروژ پهلو گرفت.", xpReward: 275 },
  { pathCode: "AABBB", titleEn: "The Sunlit Hull of Hope", titleFa: "بدنه درخشان امید بر آب", badgeCategory: "legendary", badgeIcon: "📸", badgeNameFa: "پایان نمادین و تاریخی", climaxEn: "The iconic photograph of Triton resting in golden morning water becomes the global emblem of courage in extreme engineering.", climaxFa: "عکس خیره‌کننده زیردریایی تریتون در آب‌های زرین صبحگاه به نماد جهانی شجاعت در مهندسی شرایط حاد تبدیل شد.", xpReward: 270 },
  { pathCode: "ABAAA", titleEn: "The Portsmouth Naval Laurels", titleFa: "مدال افتخار دریانوردی پورتسموث", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان پرشکوه نظامی", climaxEn: "Admirals salute Lars as the Subsea Aviation Cross is pinned to his chest, honoring the most precise robotic intervention in deep-water history.", climaxFa: "دریاداران به لارس ادای احترام کردند و صلیب ناوبری اعماق را بر سینه‌اش نشاندند؛ به پاس دقیق‌ترین مانور روباتیک تاریخ در اعماق.", xpReward: 275 },
  { pathCode: "ABAAB", titleEn: "The Viking Simulator Academy", titleFa: "آکادمی شبیه‌ساز وایکینگ", badgeCategory: "scholar", badgeIcon: "🖥️", badgeNameFa: "پایان فناوری و مهارت", climaxEn: "The new training simulator prepares two hundred robotic submersible pilots each year, eliminating deep-water accidents worldwide.", climaxFa: "شبیه‌ساز نوین تمرینی سالانه ۲۰۰ خلبان زیردریایی تربیت می‌کند و حوادث آب‌های عمیق را در جهان به صفر نزدیک می‌سازد.", xpReward: 270 },
  { pathCode: "ABABA", titleEn: "Sophie's Yellow Submarine", titleFa: "زیردریایی زرد کوچک سوفی", badgeCategory: "legendary", badgeIcon: "🎨", badgeNameFa: "پایان پرمهر و معصومانه", climaxEn: "Sophie's handmade drawing hangs permanently in Ocean Titan's bridge, reminding every sailor that love is the greatest compass.", climaxFa: "نقاشی کودکانه سوفی برای همیشه بر دیوار اتاق فرماندهی نصب شد تا به ملوانان یادآوری کند عشق قطب‌نمای واقعی زندگی است.", xpReward: 275 },
  { pathCode: "ABABB", titleEn: "The Shipyard Harvest Banquet", titleFa: "ضیافت پیوند خانواده‌ها در اسکله", badgeCategory: "funny", badgeIcon: "🍗", badgeNameFa: "پایان گرم و خانوادگی", climaxEn: "Sixty sailors and their families feast under the stars, laughing with the divers who cheated forty-three atmospheres of doom.", climaxFa: "شصت ملوان و خانواده‌هایشان زیر آسمان جشن گرفتند و در کنار غواصانی که مرگ را شکست دادند از ته دل خندیدند.", xpReward: 260 },
  { pathCode: "ABBAA", titleEn: "The Brussels Safety Charter", titleFa: "منشور ایمنی اروپا در بروکسل", badgeCategory: "legendary", badgeIcon: "📜", badgeNameFa: "پایان تاریخی قانون‌گذاری", climaxEn: "European energy ministers ratify the Vance-Zhang Protocol, mandating autonomous safety scrubbers on every diving bell on the planet.", climaxFa: "وزیران انرژی اروپا معاهده ناتان و کلی را تصویب کردند و سیستم‌های پشتیبان خودکار را در تمام کپسول‌های جهان اجباری ساختند.", xpReward: 280 },
  { pathCode: "ABBAB", titleEn: "The Offshore Safety Summit", titleFa: "همایش جهانی ایمنی فراساحل", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان تخصصی و صنعتی", climaxEn: "Industry leaders gather on Ocean Titan to study the North Sea rescue, adopting military-grade redundant life support across all rigs.", climaxFa: "رهبران صنعت نفت و گاز در کشتی اوشن تایتان گرد آمدند و سیستم‌های پشتیبان نوین نجات را برای تمام سکوهای جهان تصویب کردند.", xpReward: 270 },
  { pathCode: "ABBBA", titleEn: "The Captain's Wardroom Toast", titleFa: "ضیافت شاهانه کاپیتان", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان اشرافی دریانوردی", climaxEn: "Raising crystal flutes of champagne, the ship's officers salute the courage that brought three brothers safely home through the storm.", climaxFa: "با بالا بردن جام‌های بلورین، افسران کشتی به شجاعتی درود فرستادند که سه برادر را از دل طوفان سهمگین به خانه بازگرداند.", xpReward: 275 },
  { pathCode: "ABBBB", titleEn: "The Blueprint of Resilience", titleFa: "نقشه پایداری در برابر زلزله", badgeCategory: "scholar", badgeIcon: "📐", badgeNameFa: "پایان مهندسی سازه", climaxEn: "The engineering analysis of the recovered bell inspires seismic-resistant submarine habitats capable of withstanding ocean slides.", climaxFa: "بررسی‌های مهندسی کپسول الهام‌بخش ساخت زیستگاه‌های زیردریایی مقاوم به زلزله شد که در برابر رانش کف اقیانوس نفوذناپذیرند.", xpReward: 270 },
  { pathCode: "BAAAA", titleEn: "The Warmth Through the Glass", titleFa: "گرما از ورای پنجره شیشه‌ای", badgeCategory: "legendary", badgeIcon: "❤️", badgeNameFa: "پایان عاشقانه و پرامید", climaxEn: "Henderson presses his hand against the glass to meet Sarah's palm, knowing that love and courage pulled him from the frozen deep.", climaxFa: "هندرسون دستش را بر شیشه گذاشت تا دست سارا را لمس کند؛ با این یقین که عشق و شجاعت او را از اعماق یخ‌زده به زندگی بازگرداند.", xpReward: 280 },
  { pathCode: "BAAAB", titleEn: "The Aberdeen Civic Distinction", titleFa: "مدال افتخار شهروندی آبردین", badgeCategory: "heroic", badgeIcon: "🗝️", badgeNameFa: "پایان حماسی شهری", climaxEn: "The Lord Provost of Aberdeen presents Nathan with the Golden Key to the Port, celebrating forty years of fearless subsea service.", climaxFa: "شهردار آبردین کلید طلایی بندر را به پاس ۴۰ سال خدمت دلاورانه در اعماق دریاها به ناخدا ناتان اهدا کرد.", xpReward: 275 },
  { pathCode: "BAABA", titleEn: "The Star in the Mess Hall", titleFa: "ستاره نجات بر دیوار دل‌ها", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان نمادین الهام‌بخش", climaxEn: "The Subsea Lifesaving Star shines in the ship's galley, an eternal reminder that courage and teamwork overcome any ocean crisis.", climaxFa: "ستاره نجات اعماق بر دیوار غذاخوری کشتی نشست تا یادآور جاودان پیروزی کار تیمی و شجاعت بر خشم اقیانوس‌ها باشد.", xpReward: 275 },
  { pathCode: "BAABB", titleEn: "The Horns of Aberdeen Bay", titleFa: "غرش شیپورهای پیروزی در خلیج", badgeCategory: "heroic", badgeIcon: "🎺", badgeNameFa: "پایان باصلابت و حماسی", climaxEn: "A hundred ship horns blare in unison as Ocean Titan enters harbor, saluting the crew that rewrote maritime rescue history.", climaxFa: "صد کشتی یک‌صدا بوق‌های خود را در خلیج به صدا درآوردند و به تیمی درود فرستادند که تاریخ نجات دریانوردی را بازنویسی کرد.", xpReward: 275 },
  { pathCode: "BABAA", titleEn: "The Virtual Checkmate of Champions", titleFa: "کیش و مات مجازی قهرمانان", badgeCategory: "funny", badgeIcon: "♟️", badgeNameFa: "پایان پرخنده و رفاقتی", climaxEn: "Lars checkmates Henderson through the intercom, filling the ship with uproarious laughter that chases away all memories of the dark.", climaxFa: "لارس از پشت مانیتور هندرسون را کیش‌ومات کرد و کشتی را از خنده‌های شادی پر ساخت؛ خنده‌هایی که یاد تاریکی را شست.", xpReward: 260 },
  { pathCode: "BABAB", titleEn: "The Autumn Highland Pact", titleFa: "پیمان همیشگی پاییز اسکاتلند", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان رفاقت مادام‌العمر", climaxEn: "Every October, sixty crew members gather in the Scottish Highlands, toasting the unbreakable bond forged in the black water.", climaxFa: "هر سال در ماه اکتبر، شصت خدمه در کوهستان‌های اسکاتلند گرد هم می‌آیند و به سلامتی پیوند ناگسستنی اعماق دریا جام می‌نوشند.", xpReward: 275 },
  { pathCode: "BABBA", titleEn: "The Voice of the Abyss", titleFa: "صدای حقیقت در پارلمان اروپا", badgeCategory: "heroic", badgeIcon: "🏛️", badgeNameFa: "پایان حامیان کارگران دریا", climaxEn: "Standing before European legislators, Nathan secures higher wages and safety protections for fifty thousand offshore energy divers.", climaxFa: "ناتان در برابر قانون‌گذاران اروپا ایستاد و حقوق عادلانه و حمایت‌های ایمنی را برای ۵۰ هزار غواص فراساحلی تضمین کرد.", xpReward: 275 },
  { pathCode: "BABBB", titleEn: "The Strasbourg Heroism Ribbon", titleFa: "روبان قهرمانی استراسبورگ", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان پرشکوه بین‌المللی", climaxEn: "The European Parliament awards its Grand Medal of Honor to Nathan, Kelly, and Lars for selfless valor in extreme conditions.", climaxFa: "پارلمان اروپا مدال عالی افتخار خود را برای فداکاری بی‌همتا در شرایط بحرانی به ناتان، کلی و لارس اهدا کرد.", xpReward: 280 },
  { pathCode: "BBAAA", titleEn: "The Intercom Concert of Hope", titleFa: "کنسرت امید از پشت میکروفون", badgeCategory: "funny", badgeIcon: "🎸", badgeNameFa: "پایان موزیکال و شاداب", climaxEn: "Walsh's guitar melodies echo across the ship, celebrated with singing and clapping as the crew toasts life's precious triumph.", climaxFa: "نغمه‌های گیتار والش در سراسر کشتی پیچید و ملوانان با دست زدن و ترانه‌خوانی پیروزی ارزشمند زندگی را جشن گرفتند.", xpReward: 260 },
  { pathCode: "BBAAB", titleEn: "The Offshore Nutrition Manifesto", titleFa: "مانیفست تغذیه درمانی اعماق", badgeCategory: "scholar", badgeIcon: "🥗", badgeNameFa: "پایان علمی و درمانی", climaxEn: "The specialized nutritional recovery regimen becomes standard practice in deep-sea saturation medicine worldwide.", climaxFa: "رژیم غذایی مقوی درمانی این ماموریت به استاندارد رسمی و جهانی مراقبت‌های پزشکی غواصی اشباع بدل شد.", xpReward: 270 },
  { pathCode: "BBBAA", titleEn: "The Edinburgh Castle Fanfare", titleFa: "نوای نی‌انبان در قلعه ادینبرو", badgeCategory: "legendary", badgeIcon: "🏰", badgeNameFa: "پایان کهن و باشکوه", climaxEn: "Under the stone battlements of Edinburgh Castle, royal pipers play an ancient salute to the heroes who defeated the North Sea storm.", climaxFa: "زیر برج‌های باستانی قلعه ادینبرو، نوازندگان سازهای سنتی نغمه افتخار را برای قهرمانان فاتح طوفان نواختند.", xpReward: 275 },
  { pathCode: "BBBAB", titleEn: "The Diver Relief Foundation", titleFa: "بنیاد امداد و رفاه غواصان", badgeCategory: "heroic", badgeIcon: "🌱", badgeNameFa: "پایان نیکوکارانه ماندگار", climaxEn: "The new foundation raises five million pounds, providing lifelong medical security and education grants for commercial divers' children.", climaxFa: "بنیاد نوبنیاد ۵ میلیون پوند کمک مالی جمع‌آوری کرد تا بیمه درمانی و بورسیه تحصیلی فرزندان غواصان را برای ابد تامین کند.", xpReward: 275 },
  { pathCode: "BBBBA", titleEn: "The Greenwich Logbook Memorial", titleFa: "دفترچه افتخارات گرینویچ", badgeCategory: "scholar", badgeIcon: "📘", badgeNameFa: "پایان جاودانه در موزه ملی", climaxEn: "The signed logbook of Operation Abyssal Chamber is permanently enshrined at Greenwich, inspiring generations of maritime pioneers.", climaxFa: "دفترچه وقایع امضاشده عملیات نجات در موزه ملی گرینویچ لندن نصب شد تا الهام‌بخش نسل‌های آینده دریانوردان باشد.", xpReward: 275 },
  { pathCode: "BBBBB", titleEn: "The Toast to the Rising Sun", titleFa: "سلامتی به خورشید بامدادی و برادری", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان ابدی و حماسی", climaxEn: "Clinking crystal flutes under the golden sunrise, sixty companions celebrate the eternal truth that human courage can conquer any storm.", climaxFa: "با بالا بردن جام‌ها در سپیده‌دم زرین دریا، شصت یار باوفا حقیقت جاودان را جشن گرفتند: شجاعت و فداکاری بر هر طوفانی پیروز است.", xpReward: 280 },
];

export const story5HyperbaricRescue: AdventureStory = buildAdventureStory({
  id: "c1-hyperbaric-subsea-rescue",
  storyIndex: 5,
  cefr: "C1",
  titleEn: "Operation Abyssal Chamber",
  titleFa: "عملیات نجات اتاقک فشار در اعماق دریای شمال",
  genre: "rescue",
  genreLabelFa: "❄️ هیجان و نجات‌بخشی",
  genreIcon: "❄️",
  synopsisEn:
    "When a deep-saturation diving capsule suffers catastrophic ballast failure and a heliox gas leak four hundred meters below the storm-tossed North Sea, commander Nathan Vance and hyperbaric physiologist Kelly Zhang mount a high-stakes decompression extraction across 32 white-knuckle endings.",
  synopsisFa:
    "هنگامی که یک کپسول غواصی اشباع در عمق ۴۲۰ متری دریای خروشان شمال دچار نقص فنی سیستم توازن و نشتی گاز هلیوکس می‌شود، ناخدا ناتان ونس و متخصص فیزیولوژی غواصی کلی ژانگ برای نجات جان سه غواص گرفتار، عملیات فوق‌سریع و خطرناک بارومتریک را در دل امواج سهمگین آغاز می‌کنند. ۳۲ پایان پر از آدرنالین، فداکاری، مهارت فنی و پیروزی انسان در انتظارته!",
  coverImage: "/images/skills/reading/c1-hyperbaric-rescue.webp",
  nodes,
  endings,
});
