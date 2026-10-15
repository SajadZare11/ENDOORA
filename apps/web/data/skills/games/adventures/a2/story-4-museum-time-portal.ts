import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4 (A2): The Secret Time Machine in the Museum (ماشین زمان مخفی در موزه علوم)
// Genre: Sci-Fi & Fantasy (فانتزی و علمی‌تخیلی)
// CEFR: A2 (Sci-fi gadgets, past tenses, conditionals, futuristic/ancient vocab)
// Characters: Lucas, Sparky (robo-dog), Professor Helen
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Lucas and his brass robot dog Sparky were exploring the Science and Innovation Museum on a quiet Friday afternoon. Sparky had shiny copper paws, blue LED eyes, and an antenna that twitched whenever he detected electricity. While examining a giant 19th-century steam engine in the basement hall, Sparky suddenly barked: Beep-woof! Sparky's nose touched a brass lever hidden behind a velvet curtain. Suddenly, gears whirred, and a glowing circular time portal materialized in the air!",
    keywords: [
      { word: "antenna", meaningFa: "آنتن کوچک گیرنده", phonetic: "/ænˈtenə/" },
      { word: "lever", meaningFa: "اهرم برنجی فلزی", phonetic: "/ˈliːvər/" },
      { word: "whirred", meaningFa: "صدای وزوز چرخ‌دنده‌ها", phonetic: "/wɜːd/" },
      { word: "materialized", meaningFa: "پدیدار شد / ظاهر گشت", phonetic: "/məˈtɪəriəlaɪzd/" },
    ],
    question: {
      promptEn: "What did Sparky touch behind the velvet curtain?",
      promptFa: "اسپارکی پشت پرده مخملی به چه چیزی دست زد؟",
      options: ["A hidden brass lever", "An old shoe", "A plastic clock"],
      correctIndex: 0,
      hintSnippet: "Sparky's nose touched a brass lever hidden behind a velvet curtain",
      clueFa: "خط پنجم رو ببین دوست من! دماغش به یک اهرم برنجی مخفی خورد.",
    },
    choiceA: {
      labelEn: "Step into the golden portal leading to Ancient Alexandria!",
      labelFa: "وارد دروازه طلایی بشید که به اسکندریه باستان باز می‌شه!",
      descriptionFa: "شهری که بزرگ‌ترین کتابخانه و دانشمندان تاریخ رو داشت.",
    },
    choiceB: {
      labelEn: "Step into the neon-cyan portal leading to Neo-City 2150!",
      labelFa: "وارد دروازه نئونی فیروزه‌ای بشید که به شهر آینده سال ۲۱۵۰ می‌ره!",
      descriptionFa: "ماشین‌های پرنده و آسمان‌خراش‌های شیشه‌ای شناور.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Whoosh! The golden light swept Lucas and Sparky through a warm vortex. When they opened their eyes, warm Mediterranean sunshine warmed their faces. White marble pillars and palm trees framed a sparkling harbor filled with wooden trireme ships. A kind woman wearing Greek robes and holding papyrus scrolls ran toward them: 'Welcome, travelers! I am Hypatia, chief scholar of the Great Library!'",
    keywords: [
      { word: "vortex", meaningFa: "گرداب نوری زمان", phonetic: "/ˈvɔːteks/" },
      { word: "marble", meaningFa: "سنگ مرمر سفید", phonetic: "/ˈmɑːbl/" },
      { word: "papyrus", meaningFa: "کاغذهای پاپیروس مصر باستان", phonetic: "/pəˈpaɪrəs/" },
    ],
    question: {
      promptEn: "Who greeted Lucas and Sparky in ancient Alexandria?",
      promptFa: "چه کسی در اسکندریه باستان به پیشوازشان آمد؟",
      options: ["Hypatia, chief scholar", "A roman soldier", "A pirate captain"],
      correctIndex: 0,
      hintSnippet: "I am Hypatia, chief scholar of the Great Library",
      clueFa: "خط آخر رو نگاه کن! هیپاتیا، دانشمند برجسته کتابخانه کهن بود.",
    },
    choiceA: {
      labelEn: "Help Hypatia solve the lost astronomical water-clock puzzle!",
      labelFa: "به هیپاتیا در حل معمای ساعت آبی نجومی کمک کنید!",
      descriptionFa: "ساعت آبی زمان طلوع ستارگان رو با آب اندازه می‌گیره.",
    },
    choiceB: {
      labelEn: "Show Sparky's brass solar battery to the library inventors!",
      labelFa: "باتری خورشیدی برنجی اسپارکی رو به مخترعان باستان نشون بدید!",
      descriptionFa: "دانشمندان باستان از دیدن انرژی خورشید شگفت‌زده می‌شن.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Flash! Lucas and Sparky stepped out onto a magnetic skybridge three hundred meters above Neo-City 2150. Solar sky-cars zoomed silently through laser highways. Giant vertical gardens covered every floating glass skyscraper. A friendly flying drone with a smiling digital face zipped up: 'Welcome, historical guests! Professor Helen from the Chrono-Physics institute has been waiting for you!'",
    keywords: [
      { word: "magnetic", meaningFa: "مغناطیسی و معلق", phonetic: "/mæɡˈnetɪk/" },
      { word: "skybridge", meaningFa: "پل هوایی شیشه‌ای بین برج‌ها", phonetic: "/ˈskaɪbrɪdʒ/" },
      { word: "skyscraper", meaningFa: "آسمان‌خراش مدرن", phonetic: "/ˈskaɪskreɪpər/" },
    ],
    question: {
      promptEn: "What covered every floating skyscraper in the year 2150?",
      promptFa: "روی تمام آسمان‌خراش‌های سال ۲۱۵۰ چه چیزی روییده بود؟",
      options: ["Giant vertical gardens", "Solar billboards", "Thick black smoke"],
      correctIndex: 0,
      hintSnippet: "Giant vertical gardens covered every floating glass skyscraper",
      clueFa: "خط سوم رو ببین! باغ‌های عمودی سرسبز آسمان‌خراش‌ها رو پوشونده بود.",
    },
    choiceA: {
      labelEn: "Board the solar sky-car to Professor Helen's gravity lab!",
      labelFa: "سوار تاکسی هوایی خورشیدی بشید به آزمایشگاه جاذبه برید!",
      descriptionFa: "پرواز بر فراز ابرها بدون کوچک‌ترین آلودگی هوا.",
    },
    choiceB: {
      labelEn: "Test the futuristic anti-gravity hoverboard with Sparky!",
      labelFa: "اسکیت‌برد معلق ضدجاذبه رو با اسپارکی امتحان کن!",
      descriptionFa: "حرکت آزادانه و معلق روی هوا با هیجان زیاد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Inside the grand marble courtyard of the Great Library, the enormous copper water-clock had stopped ticking because silt clogged its narrow nozzle. Sparky used his tiny robotic screwdriver paw to clear the bronze valve. Swooosh! Pure water flowed, bronze gears turned smoothly, and a miniature mechanical astrolabe rotated to point straight at the North Star.",
    keywords: [
      { word: "courtyard", meaningFa: "حیاط بزرگ عمارت", phonetic: "/ˈkɔːtjɑːd/" },
      { word: "clogged", meaningFa: "گرفته و مسدود شده بود", phonetic: "/klɒɡd/" },
      { word: "valve", meaningFa: "دریچه و شیر جریان آب", phonetic: "/vælv/" },
    ],
    question: {
      promptEn: "What clogged the narrow nozzle of the water-clock?",
      promptFa: "چه چیزی لوله باریک ساعت آبی رو مسدود کرده بود؟",
      options: ["Silt and sand", "A piece of bread", "A gold coin"],
      correctIndex: 0,
      hintSnippet: "because silt clogged its narrow nozzle",
      clueFa: "خط دوم رو بخون! لای و گل‌ولای باریک مجرا رو گرفته بود.",
    },
    choiceA: {
      labelEn: "Receive an honorary papyrus scroll of ancient mathematical secrets!",
      labelFa: "طومار پاپیروس افتخاری رازهای ریاضی باستان رو هدیه بگیر!",
      descriptionFa: "هیپاتیا قوانین نور و هندسه رو روی آن نوشته است.",
    },
    choiceB: {
      labelEn: "Calibrate the water-clock to track the four seasons accurately!",
      labelFa: "ساعت آبی رو برای محاسبه دقیق چهار فصل تنظیم کن!",
      descriptionFa: "کشاورزان باستان می‌تونن زمان دقیق کاشت رو بدونن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Sparky opened his chest compartment, revealing a tiny photovoltaic crystal that converted sunlight into electrical current. Hypatia and her fellow scholars gathered around in utter fascination. 'A stone that captures the light of Apollo and produces invisible energy!' Hypatia gasped in wonder, eagerly sketching diagrams on a papyrus sheet.",
    keywords: [
      { word: "photovoltaic", meaningFa: "فتوولتائیک / تبدیل‌کننده نور به برق", phonetic: "/ˌfəʊtəʊvɒlˈteɪɪk/" },
      { word: "fascination", meaningFa: "شگفتی و مجذوب شدن علمی", phonetic: "/ˌfæsɪˈneɪʃn/" },
      { word: "diagrams", meaningFa: "نمودارها و نقشه‌های علمی", phonetic: "/ˈdaɪəɡræmz/" },
    ],
    question: {
      promptEn: "What did Sparky's photovoltaic crystal convert sunlight into?",
      promptFa: "کریستال نوری اسپارکی نور خورشید را به چه چیزی تبدیل می‌کرد؟",
      options: ["Electrical current", "Cold water", "Loud music"],
      correctIndex: 0,
      hintSnippet: "converted sunlight into electrical current",
      clueFa: "خط اول رو ببین! به جریان الکتریسیته و برق تبدیل می‌کرد.",
    },
    choiceA: {
      labelEn: "Help scholars build an ancient prototype solar mirror!",
      labelFa: "به دانشمندان در ساخت اولین آینه خورشیدی باستان کمک کنید!",
      descriptionFa: "اختراعی که روشنایی شب کتابخانه را تأمین می‌کند.",
    },
    choiceB: {
      labelEn: "Charge Sparky's backup battery under the Egyptian sun!",
      labelFa: "باتری کمکی اسپارکی رو زیر آفتاب طلایی مصر شارژ کن!",
      descriptionFa: "شارژ کامل برای سفر بازگشت به خانه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The solar sky-car docked at the Chrono-Physics institute. Professor Helen welcomed Lucas and Sparky with nutrient fruit smoothies that sparkled with edible vitamin stars. 'We have harnessed clean quantum energy,' Helen explained, 'and your little 2026 robot has the exact missing frequency chip we need to stabilize our city shields!'",
    keywords: [
      { word: "nutrient", meaningFa: "مغذی و پر از ویتامین", phonetic: "/ˈnjuːtriənt/" },
      { word: "frequency", meaningFa: "فرکانس و طول موج دقیق", phonetic: "/ˈfriːkwənsi/" },
      { word: "shields", meaningFa: "سپرهای محافظ پاک انرژی شهر", phonetic: "/ʃiːldz/" },
    ],
    question: {
      promptEn: "What sparkled inside the fruit smoothies?",
      promptFa: "توی اسموتی‌های میوه‌ای چه چیزهایی می‌درخشید؟",
      options: ["Edible vitamin stars", "Ice cubes", "Sugar rocks"],
      correctIndex: 0,
      hintSnippet: "sparkled with edible vitamin stars",
      clueFa: "خط دوم رو بخون! ستاره‌های خوراکی ویتامینی می‌درخشید.",
    },
    choiceA: {
      labelEn: "Connect Sparky's frequency chip to the city shield console!",
      labelFa: "تراشه اسپارکی رو برای تقویت سپرهای محافظ شهر وصل کنید!",
      descriptionFa: "شهر از طوفان‌های مغناطیسی فضایی نجات پیدا می‌کنه.",
    },
    choiceB: {
      labelEn: "Tour the quantum garden where vegetables grow in pure zero-gravity!",
      labelFa: "از باغ کوانتومی که گیاهان بدون جاذبه رشد می‌کنن دیدن کنید!",
      descriptionFa: "گوجه‌فرنگی‌های معلق در هوا که مثل حباب شناورند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Lucas stepped onto the magnetic hoverboard and leaned forward. Whoosh! He floated thirty centimeters off the floor, gliding smoothly around floating neon rings. Sparky leaped onto the front of the board, ears fluttering in the wind. 'Beep-hurrah!' Sparky chimed as they performed a perfect 360-degree aerial spin.",
    keywords: [
      { word: "hoverboard", meaningFa: "اسکیت‌برد معلق ضدجاذبه", phonetic: "/ˈhɒvəbɔːd/" },
      { word: "fluttering", meaningFa: "تکان خوردن در باد", phonetic: "/ˈflʌtərɪŋ/" },
      { word: "aerial", meaningFa: "هوایی و معلق", phonetic: "/ˈeəriəl/" },
    ],
    question: {
      promptEn: "What aerial stunt did Lucas and Sparky perform?",
      promptFa: "لوکاس و اسپارکی چه حرکت نمایشی در هوا اجرا کردند؟",
      options: ["A 360-degree aerial spin", "A backflip into water", "A sudden stop"],
      correctIndex: 0,
      hintSnippet: "performed a perfect 360-degree aerial spin",
      clueFa: "خط آخر رو ببین! چرخش کامل ۳۶۰ درجه در هوا انجام دادن.",
    },
    choiceA: {
      labelEn: "Enter the Neo-City Youth Hoverboard Championship!",
      labelFa: "در مسابقات اسکیت‌برد معلق نوجوانان آینده شرکت کنید!",
      descriptionFa: "مسابقه پرواز در تونل‌های نوری هیجان‌انگیز.",
    },
    choiceB: {
      labelEn: "Receive a mini pocket hoverboard to take home to 2026!",
      labelFa: "یک اسکیت‌برد جیبی ضدجاذبه به عنوان یادگاری بگیرید!",
      descriptionFa: "شگفت‌انگیزترین سوغاتی تاریخ برای دوستان مدرسه.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Hypatia rolled open the golden papyrus scroll and dipped her reed pen in indigo ink. She inscribed Lucas and Sparky's names into the roll of honorary scholars. 'In two thousand years, children will still celebrate your cleverness,' Hypatia promised with a radiant smile.",
    keywords: [
      { word: "reed pen", meaningFa: "قلم نی سنتی خوشنویسی", phonetic: "/riːd pen/" },
      { word: "indigo", meaningFa: "جوهر نیلی لاجوردی", phonetic: "/ˈɪndɪɡəʊ/" },
      { word: "radiant", meaningFa: "درخشان و پر از مهر", phonetic: "/ˈreɪdiənt/" },
    ],
    question: {
      promptEn: "What did Hypatia use to write their names?",
      promptFa: "هیپاتیا با چه قلمی اسم آن‌ها را نوشت؟",
      options: ["A reed pen in indigo ink", "A pencil", "A modern marker"],
      correctIndex: 0,
      hintSnippet: "dipped her reed pen in indigo ink",
      clueFa: "خط اول رو بخون! قلم نی با جوهر نیلی لاجوردی.",
    },
    choiceA: {
      labelEn: "Preserve the golden scroll inside the museum vault back in 2026!",
      labelFa: "طومار طلایی رو در گاوصندوق موزه در سال ۲۰۲۶ نگهداری کنید!",
      descriptionFa: "یک سند باستانی واقعی با دستخط هیپاتیا.",
    },
    choiceB: {
      labelEn: "Learn ancient Greek astronomy greetings from Hypatia!",
      labelFa: "کلمات سلام و احوالپرسی ستاره‌شناسی یونانی رو یاد بگیر!",
      descriptionFa: "یادگیری زبان دانشمندان کهن بسیار جذابه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "With Sparky's precise gear calculations, the water-clock now ticked with perfect mathematical rhythm. A bronze bell chimed softly every hour on the hour. Alexandria's farmers cheered because the clock accurately predicted irrigation cycles for the fertile Nile delta.",
    keywords: [
      { word: "irrigation", meaningFa: "آبیاری مزارع کشاورزی", phonetic: "/ˌɪrɪˈɡeɪʃn/" },
      { word: "fertile", meaningFa: "حاصلخیز و پربار", phonetic: "/ˈfɜːtaɪl/" },
      { word: "delta", meaningFa: "دلتای حاصلخیز رود نیل", phonetic: "/ˈdeltə/" },
    ],
    question: {
      promptEn: "Who cheered because the clock predicted irrigation cycles?",
      promptFa: "چه کسانی از کارکرد دقیق ساعت آبی خوشحال شدند؟",
      options: ["Alexandria's farmers", "Roman soldiers", "Ship captains"],
      correctIndex: 0,
      hintSnippet: "Alexandria's farmers cheered",
      clueFa: "خط آخر رو ببین! کشاورزان اسکندریه هورا کشیدند.",
    },
    choiceA: {
      labelEn: "Attend a joyous Nile harvest banquet in your honor!",
      labelFa: "در جشن بزرگ برداشت محصول نیل به افتخارتون شرکت کنید!",
      descriptionFa: "انجیرهای شیرین، نان تازه و انگورهای لذیذ.",
    },
    choiceB: {
      labelEn: "Craft a miniature bronze model of the water-clock!",
      labelFa: "ماکت برنجی مینیاتوری از ساعت آبی برای یادگاری بسازید!",
      descriptionFa: "ماکت ساعت به عنوان شاهکار مهندسی باستان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Using polished silver plates and Sparky's crystal lens, the scholars built Alexandria's first solar reflector lamp. That night, the Great Library's reading hall glowed with warm, flameless sunlight, allowing fifty scholars to read without smoky oil lamps.",
    keywords: [
      { word: "reflector", meaningFa: "بازتاباننده نور", phonetic: "/rɪˈflektər/" },
      { word: "flameless", meaningFa: "بدون دود و شعله / پاک", phonetic: "/ˈfleɪmləs/" },
      { word: "smoky", meaningFa: "دودزا و تاریک", phonetic: "/ˈsməʊki/" },
    ],
    question: {
      promptEn: "What did the reading hall glow with?",
      promptFa: "سالن مطالعه کتابخانه با چه نوری روشن شد؟",
      options: ["Warm, flameless sunlight", "Smoky wood fire", "Candlelight"],
      correctIndex: 0,
      hintSnippet: "glowed with warm, flameless sunlight",
      clueFa: "خط دوم رو بخون! با نور ملایم خورشید ذخیره‌شده بدون دود.",
    },
    choiceA: {
      labelEn: "Name the clean lighting invention 'The Sparky Lamp'!",
      labelFa: "اسم این چراغ خورشیدی رو 'چراغ اسپارکی' بگذارید!",
      descriptionFa: "نام سگ رباتیک در تاریخ باستان جاودانه می‌شه.",
    },
    choiceB: {
      labelEn: "Draw the solar circuit diagram on papyrus for future ages!",
      labelFa: "نقشه مدار خورشیدی رو روی پاپیروس برای آیندگان رسم کن!",
      descriptionFa: "ثبت اولین نقشه انرژی پاک در تاریخ بشر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Sparky's battery meter climbed to 100% capacity under the desert sun. His blue eyes shone brighter than ever, and his tail wagged at sixty beats per minute. Lucas opened the return portal: 'Thank you, friends of Alexandria! We will always remember you!'",
    keywords: [
      { word: "capacity", meaningFa: "ظرفیت کامل باتری", phonetic: "/kəˈpæsəti/" },
      { word: "beats", meaningFa: "ضربان و تکان‌های شاد", phonetic: "/biːts/" },
      { word: "remember", meaningFa: "به یاد داشتن", phonetic: "/rɪˈmembər/" },
    ],
    question: {
      promptEn: "To what percentage did Sparky's battery charge?",
      promptFa: "باتری اسپارکی به چند درصد رسید؟",
      options: ["100% capacity", "Ten percent", "Fifty percent"],
      correctIndex: 0,
      hintSnippet: "climbed to 100% capacity",
      clueFa: "خط اول رو ببین! به ظرفیت کامل ۱۰۰ درصد رسید.",
    },
    choiceA: {
      labelEn: "Step back through the portal to the 2026 science museum!",
      labelFa: "از دروازه زمان به موزه علوم سال ۲۰۲۶ برگردید!",
      descriptionFa: "بازگشت به خانه با خاطراتی فراموش‌نشدنی.",
    },
    choiceB: {
      labelEn: "Take one final panoramic look at the ancient Alexandria lighthouse!",
      labelFa: "یک نگاه آخر به فانوس دریایی باشکوه اسکندریه بندازید!",
      descriptionFa: "یکی از عجایب هفت‌گانه دنیای باستان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Lucas plugged Sparky's frequency chip into the quantum grid. Hummmm! A shimmering teal energy shield enveloped the entire floating city. Flying birds chirped safely as solar radiation harmlessly bounced off the shield. Professor Helen clapped her hands in triumph: 'Neo-City is safe for the next thousand years!'",
    keywords: [
      { word: "teal", meaningFa: "فیروزه‌ای درخشان و زلال", phonetic: "/tiːl/" },
      { word: "enveloped", meaningFa: "در آغوش کشید و احاطه کرد", phonetic: "/ɪnˈveləpt/" },
      { word: "radiation", meaningFa: "پرتوهای خورشیدی فضا", phonetic: "/ˌreɪdiˈeɪʃn/" },
    ],
    question: {
      promptEn: "What color was the energy shield that enveloped Neo-City?",
      promptFa: "سپر محافظتی چه رنگی بود؟",
      options: ["Shimmering teal", "Dark brown", "Pitch black"],
      correctIndex: 0,
      hintSnippet: "A shimmering teal energy shield enveloped the entire floating city",
      clueFa: "خط اول رو بخون! فیروزه‌ای درخشان بود.",
    },
    choiceA: {
      labelEn: "Receive the Honorary Golden Key to Neo-City 2150!",
      labelFa: "کلید طلایی افتخاری شهر سال ۲۱۵۰ را دریافت کن!",
      descriptionFa: "عالی‌ترین مدال شهروندی افتخاری آینده.",
    },
    choiceB: {
      labelEn: "Broadcast a message of universal friendship to the cosmos!",
      labelFa: "پیام دوستی جهانی رو با فرستنده کوانتومی به کهکشان بفرستید!",
      descriptionFa: "پیام صلح زمین به تمام سیارات دوردست.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "In the zero-gravity quantum greenhouse, giant floating watermelons and glowing cherry tomatoes drifted in mid-air. Sparky floated upside down, playfully barking as a zero-gravity strawberry floated into his mouth. Lucas picked a sweet glowing pear that tasted like honey and mint.",
    keywords: [
      { word: "drifted", meaningFa: "آهسته و معلق در هوا حرکت می‌کردند", phonetic: "/ˈdrɪftɪd/" },
      { word: "upside down", meaningFa: "وارونه در هوا", phonetic: "/ˌʌpsaɪd ˈdaʊn/" },
      { word: "glowing", meaningFa: "نورانی و درخشان", phonetic: "/ˈɡləʊɪŋ/" },
    ],
    question: {
      promptEn: "What fruit did Lucas pick that tasted like honey and mint?",
      promptFa: "لوکاس چه میوه‌ای چید که طعم عسل و نعناع می‌داد؟",
      options: ["A sweet glowing pear", "A sour lemon", "A salty potato"],
      correctIndex: 0,
      hintSnippet: "a sweet glowing pear that tasted like honey and mint",
      clueFa: "خط آخر رو نگاه کن! یک گلابی شیرین نورانی بود.",
    },
    choiceA: {
      labelEn: "Bring seeds of the zero-gravity glowing pear back to 2026!",
      labelFa: "دانه‌های گلابی نورانی رو برای کاشتن به سال ۲۰۲۶ ببرید!",
      descriptionFa: "کاشت میوه‌های شگفت‌انگیز آینده در حیاط خانه.",
    },
    choiceB: {
      labelEn: "Learn zero-gravity gymnastics with the robotic gardeners!",
      labelFa: "ژیمناستیک بی‌وزنی رو با ربات‌های باغبان تمرین کنید!",
      descriptionFa: "پشتک زدن روی هوا بدون خطر افتادن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Zipping through the sky-high holographic obstacle course, Lucas and Sparky navigated glowing laser hoops with lightning reflexes. With fifty thousand digital spectators cheering on holographic screens, Lucas crossed the finish line first! Sparky wagged his antenna in victory.",
    keywords: [
      { word: "reflexes", meaningFa: "عکس‌العمل‌های سریع و چابک", phonetic: "/ˈriːfleksɪz/" },
      { word: "spectators", meaningFa: "تماشاگران پرهیجان", phonetic: "/spekˈteɪtəz/" },
      { word: "obstacle", meaningFa: "موانع پروازی مسیر", phonetic: "/ˈɒbstəkl/" },
    ],
    question: {
      promptEn: "How many digital spectators cheered on holographic screens?",
      promptFa: "چند تماشاگر دیجیتال روی صفحه‌ها هورا می‌کشیدند؟",
      options: ["Fifty thousand spectators", "Ten people", "Nobody"],
      correctIndex: 0,
      hintSnippet: "fifty thousand digital spectators cheering",
      clueFa: "خط دوم رو ببین! پنجاه هزار تماشاگر بودند.",
    },
    choiceA: {
      labelEn: "Lift the Grand Holographic Hoverboard Trophy!",
      labelFa: "جام بلورین هولوگرافیک مسابقات اسکیت‌برد رو بالا ببر!",
      descriptionFa: "قهرمانی پرواز هوایی در آینده.",
    },
    choiceB: {
      labelEn: "Sign holographic autographs for young futuristic fans!",
      labelFa: "امضاهای نوری برای طرفداران خردسال آینده ثبت کن!",
      descriptionFa: "محبوب‌ترین خلبان جوان بین بچه‌های شهر آینده.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Professor Helen handed Lucas a sleek titanium case containing the Nano-Hoverboard. 'It collapses to the size of a chocolate bar,' she whispered with a smile, 'and runs on kinetic footsteps. A reward for saving our energy grid.'",
    keywords: [
      { word: "collapses", meaningFa: "جمع می‌شود و تا می‌خورد", phonetic: "/kəˈlæpsɪz/" },
      { word: "kinetic", meaningFa: "حرکتی و مکانیکی پاک", phonetic: "/kɪˈnetɪk/" },
      { word: "sleek", meaningFa: "شیک، براق و سبک", phonetic: "/sliːk/" },
    ],
    question: {
      promptEn: "What size does the nano-hoverboard collapse to?",
      promptFa: "اسکیت‌برد نانو وقتی جمع بشه اندازه چی می‌شه؟",
      options: ["The size of a chocolate bar", "A big truck", "A football field"],
      correctIndex: 0,
      hintSnippet: "collapses to the size of a chocolate bar",
      clueFa: "خط اول رو بخون! اندازه یک شکلات تخته‌ای کوچک می‌شه.",
    },
    choiceA: {
      labelEn: "Fly the nano-hoverboard right through the return time portal!",
      labelFa: "با اسکیت‌برد نانو مستقیم از داخل دروازه زمان پرواز کن!",
      descriptionFa: "فرود تماشایی در سالن موزه سال ۲۰۲۶.",
    },
    choiceB: {
      labelEn: "Program Sparky to recognize the hoverboard's digital voice remote!",
      labelFa: "اسپارکی رو برای کنترل صوتی اسکیت‌برد تنظیم کن!",
      descriptionFa: "اسپارکی با پارس کردن سرعت برد رو کنترل می‌کنه.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Back in the 2026 museum, the chief curator placed the ancient papyrus scroll inside a climate-controlled glass case. Millions of visitors now admire the document bearing Lucas and Sparky's names in ancient Greek.",
    keywords: [{ word: "curator", meaningFa: "رئیس و مدیر موزه", phonetic: "/kjʊəˈreɪtər/" }],
    question: {
      promptEn: "What document do millions of visitors admire?",
      promptFa: "میلیون‌ها بازدیدکننده چه سندی رو تحسین می‌کنند؟",
      options: ["The ancient papyrus scroll", "A parking ticket", "A newspaper"],
      correctIndex: 0,
      hintSnippet: "the ancient papyrus scroll inside a climate-controlled glass case",
      clueFa: "طومار پاپیروس باستانی رو در موزه تماشا می‌کنند.",
    },
    choiceA: {
      labelEn: "Deliver opening guided tours for school history classes!",
      labelFa: "تورهای راهنمای تاریخی برای کلاس‌های مدرسه برگزار کن!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Publish a research paper on ancient Greek mathematical friendship!",
      labelFa: "یک مقاله علمی درباره ریاضیات و دوستی در باستان بنویس!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Lucas taught his classmates the ancient Greek words for 'Friendship' (Philia) and 'Knowledge' (Episteme). The classroom painted an inspirational mural blending ancient pillars with futuristic stars.",
    keywords: [{ word: "mural", meaningFa: "نقاشی دیواری بزرگ", phonetic: "/ˈmjʊərəl/" }],
    question: {
      promptEn: "What ancient Greek word did Lucas teach for friendship?",
      promptFa: "لوکاس چه کلمه یونانی برای دوستی به بچه‌ها یاد داد؟",
      options: ["Philia", "Robot", "Telescope"],
      correctIndex: 0,
      hintSnippet: "ancient Greek words for 'Friendship' (Philia)",
      clueFa: "کلمه فیلیا (Philia) به معنی دوستی رو یاد داد.",
    },
    choiceA: {
      labelEn: "Lead the school's Ancient History and Philosophy Club!",
      labelFa: "باشگاه تاریخ باستان و فلسفه مدرسه رو اداره کن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Create an illustrated Greek vocabulary comic book!",
      labelFa: "یک کتاب کمیک مصور از کلمات یونانی بساز!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The memory of the Nile harvest banquet stayed vivid in Lucas's heart: the aroma of fresh pomegranates, the sound of lyres, and the joy of helping real people across thousands of years.",
    keywords: [{ word: "pomegranates", meaningFa: "انارهای شیرین و سرخ", phonetic: "/ˈpɒmɪɡrænɪts/" }],
    question: {
      promptEn: "What musical instruments played at the ancient harvest banquet?",
      promptFa: "چه سازی در جشن برداشت باستان نواخته شد؟",
      options: ["Lyres", "Electric guitars", "Drums only"],
      correctIndex: 0,
      hintSnippet: "the sound of lyres",
      clueFa: "صدای ساز سنتی لیر (چنگ کهن).",
    },
    choiceA: {
      labelEn: "Plant a memory pomegranate tree in your school garden!",
      labelFa: "یک درخت انار یادبود در حیاط مدرسه بکار!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Learn to play gentle ancient melodies on an acoustic harp!",
      labelFa: "نواختن آهنگ‌های کهن رو با چنگ سنتی یاد بگیر!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The miniature bronze water-clock rests on Lucas's bedroom desk. Every hour, a tiny brass owl inside the clock flaps its wings, a joyful reminder of his Egyptian time adventure.",
    keywords: [{ word: "reminder", meaningFa: "یادآور خاطره شیرین", phonetic: "/rɪˈmaɪndər/" }],
    question: {
      promptEn: "What bird inside the clock flaps its wings every hour?",
      promptFa: "چه پرنده‌ای در ساعت هر ساعت بال‌هایش را تکان می‌دهد؟",
      options: ["A tiny brass owl", "A duck", "An eagle"],
      correctIndex: 0,
      hintSnippet: "a tiny brass owl inside the clock flaps its wings",
      clueFa: "یک جغد برنجی کوچک بال می‌زند.",
    },
    choiceA: {
      labelEn: "Demonstrate the water-clock at the regional science fair!",
      labelFa: "ساعت آبی رو در مسابقات علمی استان نمایش بده!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Keep the secret of the clockwork portal safe forever!",
      labelFa: "راز ماشین زمان رو مثل یک راز شیرین در قلبت نگه دار!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Historians at the museum were astonished to find a historical Greek scroll describing 'The Sparky Solar Lamp'. Sparky barked proudly as the museum director saluted him with a golden treat.",
    keywords: [{ word: "astonished", meaningFa: "شگفت‌زده و مات و مبهوت", phonetic: "/əˈstɒnɪʃt/" }],
    question: {
      promptEn: "What invention was described in the Greek scroll?",
      promptFa: "چه اختراعی در طومار تاریخی شرح داده شده بود؟",
      options: ["The Sparky Solar Lamp", "A steam car", "A submarine"],
      correctIndex: 0,
      hintSnippet: "describing 'The Sparky Solar Lamp'",
      clueFa: "چراغ خورشیدی اسپارکی در طومار ثبت شده بود.",
    },
    choiceA: {
      labelEn: "Erect a small bronze statue of Sparky in the museum garden!",
      labelFa: "یک مجسمه برنجی از اسپارکی در حیاط موزه نصب کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Invent practical solar lamps for modern camping trips!",
      labelFa: "چراغ‌های خورشیدی واقعی برای کمپینگ‌های امروزی بساز!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The papyrus circuit diagram preserved in the museum proved that green solar concepts were dreamed of millennia ago. Lucas's science paper on the artifact earned a national youth scholarship.",
    keywords: [{ word: "concepts", meaningFa: "مفاهیم و ایده‌های علمی", phonetic: "/ˈkɒnsepts/" }],
    question: {
      promptEn: "What did Lucas earn for his science paper on the artifact?",
      promptFa: "لوکاس برای مقاله علمی‌اش چه جایزه‌ای گرفت؟",
      options: ["A national youth scholarship", "A box of pencils", "A comic book"],
      correctIndex: 0,
      hintSnippet: "earned a national youth scholarship",
      clueFa: "یک بورسیه تحصیلی معتبر کشوری گرفت.",
    },
    choiceA: {
      labelEn: "Study renewable clean energy at the top technical university!",
      labelFa: "در بهترین دانشگاه صنعتی انرژی‌های پاک تحصیل کن!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Build a community solar project for the city library roof!",
      labelFa: "پروژه پنل‌های خورشیدی رو برای پشت‌بام کتابخانه بساز!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Lucas and Sparky landed safely on the basement carpet of the 2026 museum. The time portal closed with a soft chime. Sparky's tail wagged as his blue eyes blinked three times: 'Home sweet home!'",
    keywords: [{ word: "carpet", meaningFa: "فرش کف سالن", phonetic: "/ˈkɑːpɪt/" }],
    question: {
      promptEn: "Where did Lucas and Sparky land safely?",
      promptFa: "لوکاس و اسپارکی کجا با سلامت فرود آمدند؟",
      options: ["On the basement carpet of the 2026 museum", "On a tree", "In the ocean"],
      correctIndex: 0,
      hintSnippet: "landed safely on the basement carpet of the 2026 museum",
      clueFa: "روی فرش سالن موزه در سال ۲۰۲۶ فرود آمدند.",
    },
    choiceA: {
      labelEn: "Lock the time portal lever safely with a secret brass padlock!",
      labelFa: "اهرم ماشین زمان رو با قفل برنجی مطمئن قفل کن!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Celebrate with warm pizza and cocoa with friends!",
      labelFa: "با پیتزای داغ و هات‌چاکلت بازگشت به خانه رو جشن بگیر!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Before leaving, Lucas looked at the Pharos lighthouse of Alexandria standing proud against the setting sun. The memory of the ancient wonder filled his heart with respect for human engineering.",
    keywords: [{ word: "Pharos", meaningFa: "فانوس دریایی تاریخی فاروس اسکندریه", phonetic: "/ˈfeərɒs/" }],
    question: {
      promptEn: "What ancient wonder did Lucas admire before leaving?",
      promptFa: "لوکاس قبل از بازگشت کدام شگفتی باستان را تحسین کرد؟",
      options: ["The Pharos lighthouse", "The Eiffel Tower", "The Golden Gate"],
      correctIndex: 0,
      hintSnippet: "the Pharos lighthouse of Alexandria",
      clueFa: "فانوس دریایی فاروس در اسکندریه.",
    },
    choiceA: {
      labelEn: "Build an architectural 3D model of the Pharos lighthouse!",
      labelFa: "یک ماکت سه‌بعدی از فانوس دریایی باستان بساز!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Become a lighthouse history researcher in your spare time!",
      labelFa: "پژوهشگر تاریخ فانوس‌های دریایی جهان بشو!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The Golden Key to Neo-City 2150 sits in Lucas's display case. It emits a soft holographic projection of the floating city whenever touched, reminding him of the bright clean future waiting ahead.",
    keywords: [{ word: "projection", meaningFa: "تصویر هولوگرام سه‌بعدی", phonetic: "/prəˈdʒekʃn/" }],
    question: {
      promptEn: "What does the Golden Key emit whenever touched?",
      promptFa: "کلید طلایی وقتی لمس بشه چه تصویری ساطع می‌کنه؟",
      options: ["A soft holographic projection of the city", "Loud music", "Cold water"],
      correctIndex: 0,
      hintSnippet: "a soft holographic projection of the floating city",
      clueFa: "یک هولوگرام سه‌بعدی از شهر آینده ساطع می‌کنه.",
    },
    choiceA: {
      labelEn: "Work passionately toward building the real green city of tomorrow!",
      labelFa: "با انگیزه برای ساختن شهر سرسبز و پاک فردا تلاش کن!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Show the hologram to inspire your school science club!",
      labelFa: "هولوگرام رو به بچه‌های باشگاه علوم نشون بده تا انگیزه بگیرن!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The quantum radio signal carrying Earth's message of friendship echoed across thousands of light years: 'We are humanity: explorers, dreamers, and protectors of life.'",
    keywords: [{ word: "humanity", meaningFa: "انسانیت و تمدن بشری", phonetic: "/hjuːˈmænəti/" }],
    question: {
      promptEn: "What was Earth's quantum message about?",
      promptFa: "پیام ارسالی زمین درباره چه چیزی بود؟",
      options: ["Explorers, dreamers, and protectors of life", "A weather report", "A traffic alert"],
      correctIndex: 0,
      hintSnippet: "explorers, dreamers, and protectors of life",
      clueFa: "کاوشگران، اهل رویا و محافظان مهربان حیات.",
    },
    choiceA: {
      labelEn: "Become an astrophysicist listening for peaceful cosmic signals!",
      labelFa: "دانشمند اخترفیزیک بشو و به آواهای کهکشان گوش بده!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Write science fiction stories about peaceful first contact!",
      labelFa: "داستان‌های علمی‌تخیلی درباره پیوند صلح‌آمیز با فضا بنویس!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Lucas planted the futuristic glowing pear seed in his backyard. Two years later, a young tree with silver leaves sprouted, producing pears that glowed gently in the dark, delighting the neighborhood.",
    keywords: [{ word: "sprouted", meaningFa: "جوانه زد و رویید", phonetic: "/ˈspraʊtɪd/" }],
    question: {
      promptEn: "What color leaves did the futuristic pear tree have?",
      promptFa: "درخت گلابی آینده چه رنگ برگ‌هایی داشت؟",
      options: ["Silver leaves", "Black leaves", "Red leaves"],
      correctIndex: 0,
      hintSnippet: "a young tree with silver leaves sprouted",
      clueFa: "برگ‌های نقره‌ای درخشان داشت.",
    },
    choiceA: {
      labelEn: "Share silver pear saplings with botanical gardens!",
      labelFa: "نهال‌های گلابی نقره‌ای رو به باغ‌های گیاه‌شناسی اهدا کن!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Host midnight garden tea parties under the glowing fruit tree!",
      labelFa: "شب‌نشینی‌های چای زیر درخت نورانی گلابی برگزار کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Lucas won the city gymnastics championship with his zero-gravity inspired floor routine. His leaps were so light and effortless that spectators joked he still had anti-gravity boots on.",
    keywords: [{ word: "effortless", meaningFa: "روان، بی‌نقص و بدون زحمت", phonetic: "/ˈefətləs/" }],
    question: {
      promptEn: "What championship did Lucas win?",
      promptFa: "لوکاس برنده چه مسابقه‌ای شد؟",
      options: ["The city gymnastics championship", "A swimming race", "A chess match"],
      correctIndex: 0,
      hintSnippet: "the city gymnastics championship",
      clueFa: "مسابقات ژیمناستیک شهر را برد.",
    },
    choiceA: {
      labelEn: "Represent the nation at the Junior World Games!",
      labelFa: "به عنوان نماینده کشور در مسابقات جهانی نوجوانان شرکت کن!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Coach children in fun gravity-defying acrobatic tricks!",
      labelFa: "به کودکان حرکات آکروباتیک پرانرژی آموزش بده!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The Grand Holographic Hoverboard Trophy rotates on a pedestal in the museum's future gallery. Below it, Sparky's metallic paw print is engraved as co-pilot champion of the year 2150.",
    keywords: [{ word: "pedestal", meaningFa: "پایه ستون نمایشگاهی", phonetic: "/ˈpedɪstl/" }],
    question: {
      promptEn: "Whose paw print was engraved as co-pilot champion?",
      promptFa: "رد پای چه کسی به عنوان قهرمان کمکی روی پایه ثبت شد؟",
      options: ["Sparky's paw print", "A cat's paw", "A bear's claw"],
      correctIndex: 0,
      hintSnippet: "Sparky's metallic paw print is engraved",
      clueFa: "رد پای فلزی اسپارکی ثبت شد.",
    },
    choiceA: {
      labelEn: "Give inspirational talks on teamwork between humans and robots!",
      labelFa: "سخنرانی‌های انگیزشی درباره همکاری انسان و ربات ارائه بده!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Design custom holographic decals for future sports equipment!",
      labelFa: "طرح‌های هولوگرافیک اختصاصی برای وسایل ورزشی طراحی کن!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Young students in Neo-City 2150 wear replica jerseys bearing 'Lucas & Sparky 2026'. The story of the boy and dog who traversed time inspires youth across two centuries to believe in courage.",
    keywords: [{ word: "traversed", meaningFa: "پیمودند و گذر کردند", phonetic: "/trəˈvɜːst/" }],
    question: {
      promptEn: "What do young students in 2150 wear in their honor?",
      promptFa: "بچه‌های سال ۲۱۵۰ به افتخار آن‌ها چه می‌پوشند؟",
      options: ["Replica jerseys bearing 'Lucas & Sparky'", "Heavy coats", "Space helmets"],
      correctIndex: 0,
      hintSnippet: "replica jerseys bearing 'Lucas & Sparky 2026'",
      clueFa: "پیراهن‌های ورزشی با نام لوکاس و اسپارکی.",
    },
    choiceA: {
      labelEn: "Send an encrypted holiday greeting back through time to Neo-City!",
      labelFa: "یک پیام تبریک عید رمزشده به آینده مخابره کن!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Host a futuristic costume day at school!",
      labelFa: "روز لباس‌های علمی‌تخیلی آینده رو در مدرسه جشن بگیرید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Gliding home on his nano-hoverboard ten centimeters above the sidewalk, Lucas enjoys the breeze. Neighbors turn their heads in amazement as Sparky trots proudly alongside the floating board.",
    keywords: [{ word: "sidewalk", meaningFa: "پیاده‌رو", phonetic: "/ˈsaɪdwɔːk/" }],
    question: {
      promptEn: "How high above the sidewalk does Lucas glide?",
      promptFa: "لوکاس چقدر بالاتر از پیاده‌رو معلق پرواز می‌کرد؟",
      options: ["Ten centimeters", "Fifty meters", "On the ground"],
      correctIndex: 0,
      hintSnippet: "ten centimeters above the sidewalk",
      clueFa: "ده سانتی‌متر بالاتر از پیاده‌رو پرواز می‌کرد.",
    },
    choiceA: {
      labelEn: "Use the hoverboard for clean daily travel to school!",
      labelFa: "با اسکیت‌برد پاک و بدون دود هر روز به مدرسه برو!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Invent safety pads for hoverboard riders worldwide!",
      labelFa: "تجهیزات ایمنی هوشمند برای سوارکاران اسکیت‌برد بساز!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "With a soft bark, Sparky commands the nano-hoverboard: 'Beep-halt!' The board lands smoothly at Lucas's doorstep. Smiling at the stars, Lucas knows that the future is something we invent with kindness every day.",
    keywords: [{ word: "doorstep", meaningFa: "پله جلوی در خانه", phonetic: "/ˈdɔːstep/" }],
    question: {
      promptEn: "What command did Sparky give to stop the hoverboard?",
      promptFa: "اسپارکی چه دستوری برای توقف اسکیت‌برد داد؟",
      options: ["'Beep-halt!'", "'Go fast!'", "'Jump high!'"],
      correctIndex: 0,
      hintSnippet: "commands the nano-hoverboard: 'Beep-halt!'",
      clueFa: "دستور 'بیپ-هالت' یعنی توقف رو صادر کرد.",
    },
    choiceA: {
      labelEn: "Give Sparky a warm bowl of puppy treats and clean his copper paws!",
      labelFa: "یک کاسه خوراکی خوشمزه به اسپارکی بده و دست‌هایش را تمیز کن!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Celebrate the infinite wonders of time and science with your family!",
      labelFa: "شگفتی‌های بی‌پایان علم و زمان را با خانواده جشن بگیر!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Master of Ancient Wisdom", titleFa: "استاد دانایی کهن", badgeCategory: "legendary", badgeIcon: "📜", badgeNameFa: "پایان افسانه‌ای", climaxEn: "The Great Library scroll remains a beacon of international youth scholarship in the city museum.", climaxFa: "طومار کتابخانه کهن به عنوان نماد دانایی و پژوهش نوجوانان در موزه ماندگار شد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Philosophy of Two Ages", titleFa: "رساله دوستی دو عصر", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان علمی", climaxEn: "Lucas's published paper on ancient friendship is cited by historians worldwide.", climaxFa: "مقاله لوکاس درباره دوستی در جهان باستان مورد تحسین تاریخ‌نگاران جهان قرار گرفت.", xpReward: 180 },
  { pathCode: "AAABA", titleEn: "The School Philosophy Circle", titleFa: "حلقه فیلسوفان کوچک", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان آموزنده", climaxEn: "Classmates debate big questions about life, time, and science with joyful curiosity.", climaxFa: "همکلاسی‌ها درباره پرسش‌های بزرگ زندگی و زمان با شوق به گفتگو نشستند.", xpReward: 175 },
  { pathCode: "AAABB", titleEn: "The Greek Vocabulary Comic", titleFa: "کمیک کلمات یونانی باستان", badgeCategory: "funny", badgeIcon: "🎨", badgeNameFa: "پایان هنری و شاد", climaxEn: "The comic book turns learning ancient languages into the most popular hobby in school.", climaxFa: "کتاب مصور یادگیری زبان‌های کهن را به محبوب‌ترین تفریح مدرسه تبدیل کرد.", xpReward: 165 },
  { pathCode: "AABAA", titleEn: "The Living Pomegranate Tree", titleFa: "درخت انار یادبود نیل", badgeCategory: "heroic", badgeIcon: "🌳", badgeNameFa: "پایان سرسبز", climaxEn: "The pomegranate tree yields sweet red fruit every autumn, a symbol of timeless harmony.", climaxFa: "درخت انار هر پاییز میوه‌های شیرین داد، نمادی زنده از پیوند با تاریخ کهن نیل.", xpReward: 185 },
  { pathCode: "AABAB", titleEn: "The Harp of Antiquity", titleFa: "نغمه‌های چنگ باستان", badgeCategory: "explorer", badgeIcon: "🪕", badgeNameFa: "پایان موسیقیایی", climaxEn: "Lucas plays ancient melodies that soothe listeners and bring peaceful dreams.", climaxFa: "لوکاس نغمه‌های باستانی نواخت که آرامش را به دل تمام شنوندگان هدیه داد.", xpReward: 170 },
  { pathCode: "AABBA", titleEn: "The Water-Clock Blue Ribbon", titleFa: "روبان آبی ساعت آبی", badgeCategory: "legendary", badgeIcon: "💧", badgeNameFa: "پایان افتخار علمی", climaxEn: "The precision water-clock wins first prize at the national engineering fair.", climaxFa: "ساعت آبی دقیق برنده رتبه اول نمایشگاه مهندسی کشور شد.", xpReward: 195 },
  { pathCode: "AABBB", titleEn: "The Secret Keeper of Time", titleFa: "پاسدار راز نهان زمان", badgeCategory: "secret", badgeIcon: "🕰️", badgeNameFa: "پایان رازآلود", climaxEn: "Lucas keeps the secret of the basement lever safe, guarding time with wisdom.", climaxFa: "لوکاس راز اهرم ماشین زمان را حفظ کرد و با خرد از مرزهای تاریخ پاسداری نمود.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Bronze Statue of Sparky", titleFa: "تندیس برنجی سگ رباتیک", badgeCategory: "legendary", badgeIcon: "🐕", badgeNameFa: "پایان پرافتخار", climaxEn: "Sparky's statue greets visitors with a wagging brass tail, inspiring young roboticists.", climaxFa: "تندیس برنجی اسپارکی با دمی متحرک الهام‌بخش مهندسان خردسال رباتیک شد.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "The Campers' Solar Light", titleFa: "چراغ خورشیدی کوهنوردان", badgeCategory: "heroic", badgeIcon: "💡", badgeNameFa: "پایان کاربردی", climaxEn: "Lucas's invented camp lamp illuminates mountain tents cleanly without batteries.", climaxFa: "چراغ خورشیدی اختراع لوکاس چادرهای کوهنوردان را بدون باتری روشن کرد.", xpReward: 180 },
  { pathCode: "ABABA", titleEn: "The Clean Tech Scholar", titleFa: "پژوهشگر جوان فناوری پاک", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان علمی و درخشان", climaxEn: "Lucas's research paves the way for clean solar energy in ten local schools.", climaxFa: "پژوهش‌های لوکاس مسیر انرژی خورشیدی پاک را در ده مدرسه هموار ساخت.", xpReward: 190 },
  { pathCode: "ABABB", titleEn: "The Rooftop Solar Library", titleFa: "کتابخانه خورشیدی بام شهر", badgeCategory: "heroic", badgeIcon: "☀️", badgeNameFa: "پایان محیط‌زیستی", climaxEn: "The library generates 100% of its power from the sun, celebrated as an eco-model.", climaxFa: "کتابخانه صد در صد برق خود را از خورشید گرفت و الگوی انرژی پاک شهر شد.", xpReward: 185 },
  { pathCode: "ABBAA", titleEn: "The Secure Time Vault", titleFa: "قفل ایمن دروازه زمان", badgeCategory: "secret", badgeIcon: "🔒", badgeNameFa: "پایان مسئولیت‌پذیری", climaxEn: "The time portal remains locked and protected, ready only when humanity needs it.", climaxFa: "دروازه زمان با ایمنی کامل قفل شد تا فقط در صورت نیاز بشر به کار گرفته شود.", xpReward: 175 },
  { pathCode: "ABBAB", titleEn: "The Time Traveler's Pizza Feast", titleFa: "جشن پیتزای مسافران زمان", badgeCategory: "funny", badgeIcon: "🍕", badgeNameFa: "پایان خوشمزه و شاد", climaxEn: "Warm pizza and laughter with friends make the year 2026 the sweetest time of all.", climaxFa: "پیتزای داغ و خنده با دوستان، سال ۲۰۲۶ را به شیرین‌ترین دوران زندگی بدل کرد.", xpReward: 160 },
  { pathCode: "ABBBA", titleEn: "The Wonder of Pharos Model", titleFa: "ماکت شگفتی فانوس اسکندریه", badgeCategory: "scholar", badgeIcon: "🗼", badgeNameFa: "پایان معماری", climaxEn: "Lucas's 3D model of the Pharos lighthouse wins the architecture youth award.", climaxFa: "ماکت سه‌بعدی فانوس اسکندریه برنده جایزه معماری نوجوانان شد.", xpReward: 185 },
  { pathCode: "ABBBB", titleEn: "The Guardian of Coastal Beacons", titleFa: "پاسدار فانوس‌های دریایی جهان", badgeCategory: "explorer", badgeIcon: "🌊", badgeNameFa: "پایان کاوشگری", climaxEn: "Lucas explores historic lighthouses, preserving stories of sailors and storms.", climaxFa: "لوکاس به دیدار فانوس‌های تاریخی رفت و خاطرات کهن دریانوردان را زنده نگه داشت.", xpReward: 175 },
  { pathCode: "BAAAA", titleEn: "The Architect of Neo-Tomorrow", titleFa: "معمار شهر سبز آینده", badgeCategory: "legendary", badgeIcon: "🏙️", badgeNameFa: "پایان باشکوه", climaxEn: "Lucas's ideas help design real floating eco-parks in futuristic city master plans.", climaxFa: "ایده‌های لوکاس در طراحی پارک‌های معلق طرح جامع شهر آینده به کار رفت.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Hologram of Hope", titleFa: "هولوگرام امید برای همه", badgeCategory: "scholar", badgeIcon: "✨", badgeNameFa: "پایان انگیزشی", climaxEn: "The floating city projection inspires thousands of youth to study green sciences.", climaxFa: "هولوگرام شهر معلق هزاران نوجوان را به آموختن علوم پاک تشویق کرد.", xpReward: 180 },
  { pathCode: "BAABA", titleEn: "Cosmic Messenger of Peace", titleFa: "پیام‌آور صلح کهکشان", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان صلح جهانی", climaxEn: "Earth's message travels endlessly through star clusters, carrying a voice of love.", climaxFa: "پیام زمین در خوشه‌های کهکشانی تا ابد سفر کرد و صدای صلح و مهربانی را رساند.", xpReward: 200 },
  { pathCode: "BAABB", titleEn: "The Sci-Fi Author Laurels", titleFa: "نویسنده برتر داستان‌های آینده", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان ادبی", climaxEn: "Lucas's science fiction novels sell millions, praised for optimistic visions of tomorrow.", climaxFa: "رمان‌های علمی‌تخیلی لوکاس با تصویر امیدبخش از فردا میلیون‌ها نسخه فروختند.", xpReward: 185 },
  { pathCode: "BABAA", titleEn: "The Orchard of Starlight Pears", titleFa: "باغ گلابی‌های نقره‌فام", badgeCategory: "legendary", badgeIcon: "🍐", badgeNameFa: "پایان گیاه‌شناسی نوین", climaxEn: "Glowing silver pears become the town's most famous sweet delight, harvested at night.", climaxFa: "گلابی‌های نقره‌ای نورانی به شهرت جهانی رسیدند و در شب چیده شدند.", xpReward: 200 },
  { pathCode: "BABAB", titleEn: "Midnight Garden Tea Parties", titleFa: "شب‌نشینی‌های ماه و میوه نورانی", badgeCategory: "funny", badgeIcon: "🍵", badgeNameFa: "پایان رویایی", climaxEn: "Neighbors gather under glowing fruit branches, drinking mint tea under the stars.", climaxFa: "همسایگان زیر شاخه‌های درخشان جمع شدند و چای نعناع نوشیدند و قصه گفتند.", xpReward: 165 },
  { pathCode: "BABBA", titleEn: "The Junior World Gymnast", titleFa: "قهرمان آکروباتیک نوجوانان جهان", badgeCategory: "heroic", badgeIcon: "🤸", badgeNameFa: "پایان ورزشی", climaxEn: "Lucas's zero-gravity routine wins gold at the Junior World Athletic Games.", climaxFa: "حرکات روان ژیمناستیک لوکاس مدال طلای مسابقات جهانی نوجوانان را به ارمغان آورد.", xpReward: 190 },
  { pathCode: "BABBB", titleEn: "The Acrobatics Coach", titleFa: "مربی مهربان حرکات هوایی", badgeCategory: "scholar", badgeIcon: "🏅", badgeNameFa: "پایان معلمی", climaxEn: "Children learn balance, courage, and graceful flips in Lucas's youth academy.", climaxFa: "کودکان تعادل، شجاعت و چرخش‌های زیبا را در آکادمی لوکاس آموختند.", xpReward: 175 },
  { pathCode: "BBAAA", titleEn: "Ambassadors of Human-AI Harmony", titleFa: "سفیران همبستگی انسان و هوش مصنوعی", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان فناوری و خرد", climaxEn: "Lucas and Sparky tour university tech centers, proving love makes technology wise.", climaxFa: "لوکاس و اسپارکی ثابت کردند مهربانی فناوری را به خدمت خرد و زندگی درمی‌آورد.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Futuristic Decals Designer", titleFa: "طراح نقش‌های نوری آینده", badgeCategory: "scholar", badgeIcon: "🎨", badgeNameFa: "پایان هنری", climaxEn: "Sports gear worldwide features Lucas's signature neon lightning emblems.", climaxFa: "وسایل ورزشی جهان با نشان‌های نئونی اختصاصی لوکاس آراسته شدند.", xpReward: 175 },
  { pathCode: "BBABA", titleEn: "The Encrypted Signal to 2150", titleFa: "پیام رمزشده به سوی آینده", badgeCategory: "secret", badgeIcon: "📡", badgeNameFa: "پایان فناوری نوین", climaxEn: "Professor Helen receives the friendly signal in 2150 and smiles across centuries.", climaxFa: "پروفسور هلن در سال ۲۱۵۰ پیام دوستانه را دریافت کرد و در دل تاریخ لبخند زد.", xpReward: 185 },
  { pathCode: "BBABB", titleEn: "The Futuristic Costume Carnival", titleFa: "کارناوال لباس‌های شهر آینده", badgeCategory: "funny", badgeIcon: "🎭", badgeNameFa: "پایان شاد و مفرح", climaxEn: "The whole school dresses in shiny silver suits, celebrating the wonders of time.", climaxFa: "تمام مدرسه با لباس‌های نقره‌ای درخشان جشن گرفتند و به آینده خوش‌آمد گفتند.", xpReward: 165 },
  { pathCode: "BBBAA", titleEn: "The Eco-Hoverboard Commuter", titleFa: "سوارکار پاک خیابان‌های شهر", badgeCategory: "heroic", badgeIcon: "🛹", badgeNameFa: "پایان پیشگامانه", climaxEn: "Lucas glides to school silently on his nano-board, inspiring a zero-carbon lifestyle.", climaxFa: "لوکاس با اسکیت‌برد بی‌صدا به مدرسه رفت و مروج سبک زندگی پاک بدون کربن شد.", xpReward: 190 },
  { pathCode: "BBBAB", titleEn: "The Hoverboard Safety Pioneer", titleFa: "پیشگام ایمنی پرواز نوین", badgeCategory: "scholar", badgeIcon: "🛡️", badgeNameFa: "پایان سلامت و امنیت", climaxEn: "Lucas's invented safety gear protects thousands of young sports adventurers.", climaxFa: "تجهیزات ایمنی هوشمند لوکاس جان هزاران نوجوان ورزشکار را محافظت کرد.", xpReward: 180 },
  { pathCode: "BBBBA", titleEn: "The Loyal Robopup's Reward", titleFa: "پاداش وفاداری هاپوی رباتیک", badgeCategory: "heroic", badgeIcon: "🦴", badgeNameFa: "پایان وفاداری و محبت", climaxEn: "Sparky curls up happily on his charging mat, purring with satisfaction and love.", climaxFa: "اسپارکی روی پد شارژش با آرامش خوابید و با خروپفی شاد از محبت سیراب شد.", xpReward: 185 },
  { pathCode: "BBBBB", titleEn: "The Master of Infinite Horizons", titleFa: "استاد افق‌های بی‌کران زمان", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Surrounded by ancient wisdom and futuristic dreams, Lucas knows that true innovation is shaped by a compassionate heart.", climaxFa: "در تلاقی خرد کهن و رؤیاهای آینده، لوکاس دریافت که بزرگ‌ترین اختراع بشر قلبی سرشار از مهر و فداکاری است.", xpReward: 200 },
];

export const story4MuseumTimePortal: AdventureStory = buildAdventureStory({
  id: "a2-museum-time-portal",
  storyIndex: 4,
  cefr: "A2",
  titleEn: "The Secret Time Machine in the Museum",
  titleFa: "ماشین زمان مخفی در موزه علوم",
  genre: "scifi",
  genreLabelFa: "🤖 فانتزی و علمی‌تخیلی",
  genreIcon: "🤖",
  synopsisEn:
    "Lucas and his brass robot dog Sparky accidentally trigger an ancient time portal in the science museum basement. Travel to ancient Alexandria or futuristic Neo-City across 32 wondrous endings!",
  synopsisFa:
    "لوکاس و سگ رباتیکش اسپارکی به طور اتفاقی یک دروازه زمان برنجی را در زیرزمین موزه علوم فعال می‌کنند! آیا به اسکندریه باستان سفر می‌کنی یا به شهر شناور سال ۲۱۵۰؟ ۳۲ پایان علمی‌تخیلی شگفت‌انگیز در انتظار توست!",
  coverImage: "/images/skills/reading/a2-museum-time-portal.webp",
  nodes,
  endings,
});
