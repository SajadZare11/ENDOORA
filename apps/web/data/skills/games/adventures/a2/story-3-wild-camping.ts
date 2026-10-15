import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3 (A2): The Wild River Camping Trip (ماجراجویی در کمپینگ رودخانه وحشی)
// Genre: Travel & Adventure (سفر و ماجراجویی)
// CEFR: A2 (Outdoor vocabulary, past simple/continuous, directions, nature)
// Characters: Jack, Toby, Scout Leader Dan, Sarah
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "The morning sun rose over Pine Valley as Jack and his best friend Toby strapped on their heavy green backpacks. They were on a weekend scouting trip with Scout Leader Dan. Crisp pine needles crunched under their hiking boots. Ahead, the rushing blue water of Whispering River sparkled through the tall trees. At the riverbank, the trail split into two exciting paths: a narrow wooden suspension bridge and a rocky canoe dock.",
    keywords: [
      { word: "scouting", meaningFa: "پیش‌آهنگی و اردوی طبیعت‌گردی", phonetic: "/ˈskaʊtɪŋ/" },
      { word: "crunched", meaningFa: "خش‌خش صدا داد زیر پا", phonetic: "/krʌntʃt/" },
      { word: "suspension bridge", meaningFa: "پل معلق چوبی و طنابی", phonetic: "/səˈspenʃn brɪdʒ/" },
      { word: "riverbank", meaningFa: "ساحل سرسبز رودخانه", phonetic: "/ˈrɪvəbæŋk/" },
    ],
    question: {
      promptEn: "What crunched under the boys' hiking boots?",
      promptFa: "زیر پوتین‌های بچه‌ها چه چیزی خش‌خش صدا می‌داد؟",
      options: ["Crisp pine needles", "Broken glass", "Plastic bottles"],
      correctIndex: 0,
      hintSnippet: "Crisp pine needles crunched under their hiking boots",
      clueFa: "خط سوم رو ببین دوست من! سوزن‌های کاج خشک روی زمین خش‌خش صدا می‌دادند.",
    },
    choiceA: {
      labelEn: "Cross the wooden suspension bridge toward Eagle Peak trail!",
      labelFa: "از روی پل معلق چوبی به سمت مسیر قله عقاب حرکت کنید!",
      descriptionFa: "پل روی دره سرسبز تاب می‌خوره و منظره قشنگی داره.",
    },
    choiceB: {
      labelEn: "Launch the red wooden canoe down the sparkling river rapids!",
      labelFa: "کانوی چوبی قرمز رو به آب خروشان رودخونه بندازید!",
      descriptionFa: "قایقرانی روی موج‌های خنک هیجان زیادی داره.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Jack and Toby stepped carefully onto the wooden planks of the suspension bridge. The bridge swayed gently in the mountain breeze, high above the foaming turquoise rapids. Halfway across, Toby spotted a family of wild mountain goats climbing the sheer cliffs. Below them, near a cluster of pine trees, stood a cozy wooden scout shelter with smoke curling from its stone chimney.",
    keywords: [
      { word: "swayed", meaningFa: "به آرامی تاب خورد", phonetic: "/sweɪd/" },
      { word: "sheer", meaningFa: "عمودی و صخره‌ای تند", phonetic: "/ʃɪər/" },
      { word: "chimney", meaningFa: "دودکش سنگی", phonetic: "/ˈtʃɪmni/" },
    ],
    question: {
      promptEn: "What wild animals did Toby spot on the cliffs?",
      promptFa: "توبی چه جانوران وحشی روی صخره‌ها دید؟",
      options: ["Mountain goats", "Black bears", "Wild wolves"],
      correctIndex: 0,
      hintSnippet: "spotted a family of wild mountain goats",
      clueFa: "خط دوم رو بخون! یک خانواده از بزهای کوهی رو دید.",
    },
    choiceA: {
      labelEn: "Head down to the cozy scout shelter to unpack your tents!",
      labelFa: "به کلبه امن پیش‌آهنگ‌ها برید تا چادرها رو باز کنید!",
      descriptionFa: "یک جای گرم و راحت برای استراحت بعد از پیاده‌روی.",
    },
    choiceB: {
      labelEn: "Hike higher up the rocky ridge to the Eagle Peak lookout!",
      labelFa: "مسیر رو به سمت برج دیده‌بانی قله عقاب ادامه بدید!",
      descriptionFa: "از نوک قله کل دره و دریاچه زیر پاتونه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "The boys put on bright orange life jackets and grabbed wooden paddles. Leader Dan steered the red canoe from the stern. Whoosh! The cool river spray splashed their faces as the canoe zipped between smooth granite boulders. Toby laughed with excitement as colorful silver trout leaped right out of the water beside their paddles.",
    keywords: [
      { word: "life jackets", meaningFa: "جلیقه‌های نجات", phonetic: "/ˈlaɪf dʒækɪts/" },
      { word: "spray", meaningFa: "قطره‌های پاشیده‌شده آب", phonetic: "/spreɪ/" },
      { word: "trout", meaningFa: "ماهی‌های قزل‌آلای رودخانه‌ای", phonetic: "/traʊt/" },
    ],
    question: {
      promptEn: "What leaped out of the water beside the canoe paddles?",
      promptFa: "چه چیزی از آب کنار پاروهای قایق بیرون پرید؟",
      options: ["Colorful silver trout", "Green frogs", "A river snake"],
      correctIndex: 0,
      hintSnippet: "colorful silver trout leaped right out of the water",
      clueFa: "خط آخر رو ببین! ماهی‌های قزل‌آلای نقره‌ای از آب بیرون پریدن.",
    },
    choiceA: {
      labelEn: "Paddle the canoe into the calm waters of Emerald Cove!",
      labelFa: "قایق رو به خلیج آرام زمردی هدایت کنید!",
      descriptionFa: "آب زلال و شفاف که کف رودخونه پیداست.",
    },
    choiceB: {
      labelEn: "Navigate toward the sandy beach beneath the grand waterfall!",
      labelFa: "به سمت ساحل شنی زیر آبشار بزرگ پارو بزنید!",
      descriptionFa: "صدای ریزش آب آبشار مثل یک موسیقی باشکوهه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Inside the scout shelter, friendly ranger Sarah was boiling herbal pine tea on a cast-iron stove. She showed Jack how to pitch a three-person dome tent using aluminum poles and taut guy lines. Outside, the scent of burning cedar and sweet pine filled the evening air as the sun dipped behind the mountain ridges.",
    keywords: [
      { word: "ranger", meaningFa: "محیط‌بان پارک ملی", phonetic: "/ˈreɪndʒər/" },
      { word: "pitch", meaningFa: "برپا کردن چادر", phonetic: "/pɪtʃ/" },
      { word: "poles", meaningFa: "تیرک‌های آلومینیومی چادر", phonetic: "/pəʊlz/" },
    ],
    question: {
      promptEn: "What was ranger Sarah boiling on the cast-iron stove?",
      promptFa: "محیط‌بان سارا روی اجاق چدنی چی می‌جوشاند؟",
      options: ["Herbal pine tea", "Hot chocolate", "Chicken soup"],
      correctIndex: 0,
      hintSnippet: "boiling herbal pine tea on a cast-iron stove",
      clueFa: "خط اول رو بخون! دمنوش گیاهی کاج آماده می‌کرد.",
    },
    choiceA: {
      labelEn: "Build a safe campfire ring using smooth river stones!",
      labelFa: "یک حلقه سنگی ایمن با سنگ‌های رودخانه برای آتش بسازید!",
      descriptionFa: "ایمنی در جنگل مهم‌ترین اصل یک پیش‌آهنگ است.",
    },
    choiceB: {
      labelEn: "Learn star navigation with Leader Dan's brass astrolabe!",
      labelFa: "جهت‌یابی با ستاره‌ها رو با اسطرلاب برنجی یاد بگیرید!",
      descriptionFa: "پیدا کردن ستاره قطبی در آسمان صاف کوهستان.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The rocky ridge trail was steep, but the panoramic view took their breath away. Standing on the wooden observation platform of Eagle Peak, Jack used his binoculars. Far below, the entire valley looked like a lush green carpet cut by a silver ribbon of water. An eagle soared gracefully in circles directly above their heads.",
    keywords: [
      { word: "panoramic", meaningFa: "دید گسترده ۳۶۰ درجه و چشم‌نواز", phonetic: "/ˌpænəˈræmɪk/" },
      { word: "observation", meaningFa: "دیده‌بانی و رصد", phonetic: "/ˌɒbzəˈveɪʃn/" },
      { word: "soared", meaningFa: "اوج گرفت و با آرامش پرواز کرد", phonetic: "/sɔːd/" },
    ],
    question: {
      promptEn: "What bird soared directly above their heads?",
      promptFa: "چه پرنده‌ای درست بالای سرشان اوج گرفت؟",
      options: ["An eagle", "A noisy crow", "A white owl"],
      correctIndex: 0,
      hintSnippet: "An eagle soared gracefully in circles directly above their heads",
      clueFa: "خط آخر رو نگاه کن! یک عقاب باشکوه پرواز می‌کرد.",
    },
    choiceA: {
      labelEn: "Sketch the soaring eagle in your wildlife nature diary!",
      labelFa: "طرح پرواز عقاب رو در دفترچه حیات‌وحشت نقاشی کن!",
      descriptionFa: "بال‌های باز عقاب در برابر کوهستان شاهکاره.",
    },
    choiceB: {
      labelEn: "Use the mountaintop radio to check tomorrow's mountain weather!",
      labelFa: "با بی‌سیم قله وضعیت هوای فردا رو استعلام کن!",
      descriptionFa: "پیش‌بینی باران و باد برای کوهنوردان حیاتیه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Emerald Cove was as peaceful as a dream. The water was so emerald-clear that Jack could count smooth pebbles on the riverbed five meters down. Along the sandy shore, Toby discovered an ancient clay pot half-buried near a cedar stump. Inside the pot was an antique arrowhead carved from shiny obsidian glass.",
    keywords: [
      { word: "pebbles", meaningFa: "قلوه‌سنگ‌های صیقلی کف رود", phonetic: "/ˈpeblz/" },
      { word: "stump", meaningFa: "کنده بریده‌شده درخت", phonetic: "/stʌmp/" },
      { word: "obsidian", meaningFa: "سنگ شیشه‌ای آتشفشانی سیاه", phonetic: "/əbˈsɪdiən/" },
    ],
    question: {
      promptEn: "What was found inside the ancient clay pot?",
      promptFa: "داخل کوزه سفالی کهن چی پیدا شد؟",
      options: ["An obsidian arrowhead", "A gold coin", "A silver ring"],
      correctIndex: 0,
      hintSnippet: "an antique arrowhead carved from shiny obsidian glass",
      clueFa: "خط آخر رو ببین! یک سرپیکان باستانی از سنگ آبسیدین بود.",
    },
    choiceA: {
      labelEn: "Document the archaeological discovery with photos and GPS!",
      labelFa: "کشف باستان‌شناسی رو با عکس و مختصات ثبت کن!",
      descriptionFa: "گزارش علمی به موزه پارک ملی اهدا می‌شه.",
    },
    choiceB: {
      labelEn: "Set up a lightweight beach camp right here at Emerald Cove!",
      labelFa: "همین‌جا در ساحل زمردی یک کمپ سبک برپا کنید!",
      descriptionFa: "خوابیدن با صدای ملایم آب خیلی آرامش‌بخشه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The canoe glided onto the fine golden sand of Waterfall Beach. The roaring curtain of water dropped forty meters into a turquoise basin, creating a dazzling permanent rainbow in the morning mist. Cool droplets refreshed the tired hikers. Behind the cascading water, Jack noticed a shadowy cave entrance.",
    keywords: [
      { word: "roaring", meaningFa: "خروشان و پرصدا", phonetic: "/ˈrɔːrɪŋ/" },
      { word: "mist", meaningFa: "مه خنک و قطرات معلق آب", phonetic: "/mɪst/" },
      { word: "cascading", meaningFa: "آبشارگونه ریزان", phonetic: "/kæˈskeɪdɪŋ/" },
    ],
    question: {
      promptEn: "What did Jack notice behind the cascading water?",
      promptFa: "جک پشت آبشار ریزان متوجه چه چیزی شد؟",
      options: ["A shadowy cave entrance", "A wooden boat", "A big red tent"],
      correctIndex: 0,
      hintSnippet: "Jack noticed a shadowy cave entrance",
      clueFa: "خط آخر رو بخون! دهانه یک غار رازآلود رو دید.",
    },
    choiceA: {
      labelEn: "Explore the secret cave behind the waterfall with waterproof torches!",
      labelFa: "با چراغ‌قوه‌های ضدآب وارد غار پشت آبشار بشید!",
      descriptionFa: "شاید قندیل‌های نمکی و نقش‌های باستانی اونجا باشه.",
    },
    choiceB: {
      labelEn: "Skip flat skipping stones across the crystal waterfall basin!",
      labelFa: "روی آب زلال حوضچه سنگ‌های پهن پرتاب کنید!",
      descriptionFa: "مسابقه قورباغه‌ای پرتاب سنگ روی آب.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Jack arranged dry birch bark and pine cones inside the stone ring. Using a flint striker, he showered sparks onto the tinder. Puff! A warm, friendly flame danced upward. Toby brought wooden skewers with marshmallows, and Leader Dan roasted sweet corn over the glowing embers.",
    keywords: [
      { word: "flint", meaningFa: "سنگ چخماق آتش‌زنه", phonetic: "/flɪnt/" },
      { word: "tinder", meaningFa: "پوشال و تکه‌های چوب خشک آتش‌گیر", phonetic: "/ˈtɪndər/" },
      { word: "embers", meaningFa: "زغال‌های گداخته و سرخ", phonetic: "/ˈembəz/" },
    ],
    question: {
      promptEn: "What did Jack use to create sparks for the fire?",
      promptFa: "جک با چه چیزی برای آتش جرقه زد؟",
      options: ["A flint striker", "A matchbox", "A battery"],
      correctIndex: 0,
      hintSnippet: "Using a flint striker, he showered sparks",
      clueFa: "خط دوم رو ببین! با سنگ چخماق و فولاد جرقه زد.",
    },
    choiceA: {
      labelEn: "Sing classic scout campfire songs while strumming the ukulele!",
      labelFa: "دور آتش با ساز یوکللی آهنگ‌های شاد پیش‌آهنگی بخونید!",
      descriptionFa: "آهنگ‌های دسته‌جمعی دلپذیرترین بخش کمپینگ هستند.",
    },
    choiceB: {
      labelEn: "Tell mysterious mountain legends under the starry sky!",
      labelFa: "زیر آسمان پرستاره قصه‌های رازآلود کوهستان بگید!",
      descriptionFa: "قصه‌های کهن سرخپوستان درباره دره کاج‌ها.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Leader Dan pointed his laser pointer at the crystal-clear night sky. He showed the scouts Polaris, the Big Dipper, and Cassiopeia. 'If you ever lose your way, the North Star will always guide you home,' Leader Dan taught. Jack adjusted the brass dials, feeling like an ancient explorer.",
    keywords: [
      { word: "laser", meaningFa: "اشاره‌گر نوری لیزر", phonetic: "/ˈleɪzər/" },
      { word: "explorer", meaningFa: "کاوشگر کهن", phonetic: "/ɪkˈsplɔːrər/" },
      { word: "Polaris", meaningFa: "ستاره قطبی شمال", phonetic: "/pəˈlɑːrɪs/" },
    ],
    question: {
      promptEn: "Which star will always guide you home according to Leader Dan?",
      promptFa: "طبق گفته مربی دن کدام ستاره همیشه راهنمای بازگشته؟",
      options: ["The North Star", "The Moon", "The Red Planet"],
      correctIndex: 0,
      hintSnippet: "the North Star will always guide you home",
      clueFa: "خط دوم رو بخون! ستاره قطبی راهنمای همیشگیه.",
    },
    choiceA: {
      labelEn: "Earn the official Junior Astronomer Scout Badge!",
      labelFa: "نشان رسمی پیش‌آهنگ ستاره‌شناس نوجوان را دریافت کن!",
      descriptionFa: "یک نشان افتخار روی شانه یونیفرم پیش‌آهنگی.",
    },
    choiceB: {
      labelEn: "Spot a blazing shooting star and make a silent wish!",
      labelFa: "یک شهاب‌سنگ پرنور در آسمان پیدا کن و آرزو کن!",
      descriptionFa: "شهاب‌سنگ دنباله‌دار آسمان را برای لحظه‌ای روشن کرد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Jack's pencil flew across the sketchpad, capturing the eagle's magnificent seven-foot wingspan against snowy mountain peaks. Toby wrote down observations: 'Golden eagle, flying northwest at 2,000 meters altitude.' Ranger Sarah stamped their wildlife journals with the official national park seal.",
    keywords: [
      { word: "wingspan", meaningFa: "فاصله بین دو سر بال پرنده", phonetic: "/ˈwɪŋspæn/" },
      { word: "altitude", meaningFa: "ارتفاع از سطح دریا", phonetic: "/ˈæltɪtjuːd/" },
      { word: "seal", meaningFa: "مهر رسمی برجسته", phonetic: "/siːl/" },
    ],
    question: {
      promptEn: "What was the estimated wingspan of the golden eagle?",
      promptFa: "فاصله بال‌های عقاب طلایی چقدر تخمین زده شد؟",
      options: ["Seven-foot wingspan", "Two feet", "Twenty meters"],
      correctIndex: 0,
      hintSnippet: "the eagle's magnificent seven-foot wingspan",
      clueFa: "خط اول رو ببین! هفت فوت (بیش از دو متر) بود.",
    },
    choiceA: {
      labelEn: "Donate the eagle sketch to the mountain visitor center!",
      labelFa: "طرح نقاشی عقاب رو به مرکز گردشگری کوهستان اهدا کنید!",
      descriptionFa: "همه کوهنوردان طراحی شما رو در سالن می‌بینند.",
    },
    choiceB: {
      labelEn: "Keep the sketch as the centerpiece of your scout portfolio!",
      labelFa: "نقاشی رو به عنوان شاهکار پرونده پیش‌آهنگی‌ات نگه دار!",
      descriptionFa: "برای دریافت نشان درجه یک پیش‌آهنگی عالیه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The radio crackled with weather telemetry from the summit station: 'Clear skies, gentle southwest breeze of five knots, zero percent chance of rain for the next forty-eight hours.' Leader Dan gave a thumbs up: 'Perfect conditions for our summit trek tomorrow!'",
    keywords: [
      { word: "telemetry", meaningFa: "داده‌های سنجش از دور هواشناسی", phonetic: "/təˈlemətri/" },
      { word: "knots", meaningFa: "گره دریایی (واحد سرعت باد)", phonetic: "/nɒts/" },
      { word: "trek", meaningFa: "کوهپیمایی در ارتفاعات", phonetic: "/trek/" },
    ],
    question: {
      promptEn: "What was the chance of rain for the next 48 hours?",
      promptFa: "احتمال بارندگی در ۴۸ ساعت آینده چند درصد بود؟",
      options: ["Zero percent", "Fifty percent", "Ninety percent"],
      correctIndex: 0,
      hintSnippet: "zero percent chance of rain for the next forty-eight hours",
      clueFa: "خط دوم رو بخون! صفر درصد یعنی هوای کاملاً آفتابی و عالی.",
    },
    choiceA: {
      labelEn: "Plan the sunrise summit climb to catch dawn at the peak!",
      labelFa: "برنامه صعود سحرگاهی رو برای تماشای طلوع خورشید تنظیم کنید!",
      descriptionFa: "طلوع آفتاب از بالای ابرها دیدنی‌ترین منظره جهانه.",
    },
    choiceB: {
      labelEn: "Pack a hearty trail-mix breakfast for the morning hike!",
      labelFa: "صبحانه مقوی آجیل و میوه خشک برای مسیر صعود آماده کنید!",
      descriptionFa: "انرژی لازم برای فتح قله با بادام و کشمش.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Toby carefully logged the GPS coordinates of the clay pot site into his handheld device. Leader Dan wrapped the obsidian artifact in protective cotton batting. 'Professional archaeologists will study this site to teach children about ancient Native river cultures,' Dan explained proudly.",
    keywords: [
      { word: "coordinates", meaningFa: "مختصات جغرافیایی", phonetic: "/kəʊˈɔːdɪnəts/" },
      { word: "batting", meaningFa: "پنبه محافظ بسته‌بندی", phonetic: "/ˈbætɪŋ/" },
      { word: "artifact", meaningFa: "اثر تاریخی باستانی", phonetic: "/ˈɑːtɪfækt/" },
    ],
    question: {
      promptEn: "What did Toby log into his handheld device?",
      promptFa: "توبی چی رو در دستگاه جی‌پی‌اس ثبت کرد؟",
      options: ["The GPS coordinates of the site", "A funny game", "A song"],
      correctIndex: 0,
      hintSnippet: "logged the GPS coordinates of the clay pot site",
      clueFa: "خط اول رو ببین! مختصات دقیق جغرافیایی محل رو ثبت کرد.",
    },
    choiceA: {
      labelEn: "Deliver the obsidian artifact to the National Heritage Museum!",
      labelFa: "اثر باستانی رو به موزه میراث ملی تحویل بدید!",
      descriptionFa: "در بخش کاوش‌های دره کاج‌ها به نمایش درمیاد.",
    },
    choiceB: {
      labelEn: "Publish an article in the Young Explorer's Monthly magazine!",
      labelFa: "یک مقاله در ماهنامه کاوشگران نوجوان چاپ کنید!",
      descriptionFa: "ثبت کشف به اسم تیم پیش‌آهنگی شما.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "The scouts set up their green dome tent right on the soft sand of Emerald Cove. They anchored the tent pegs firmly into the ground with wooden mallets. As the full moon rose, it cast a shimmering silver pathway across the glassy water, illuminating the sleeping wilderness.",
    keywords: [
      { word: "pegs", meaningFa: "میخ‌های مهار چادر", phonetic: "/peɡz/" },
      { word: "mallets", meaningFa: "چکش‌های چوبی کمپینگ", phonetic: "/ˈmælɪts/" },
      { word: "illuminating", meaningFa: "روشن کردن با نور ملایم", phonetic: "/ɪˈluːmɪneɪtɪŋ/" },
    ],
    question: {
      promptEn: "What did the rising full moon cast across the water?",
      promptFa: "طلوع ماه کامل چه بازتابی روی آب انداخت؟",
      options: ["A shimmering silver pathway", "A dark shadow", "Red flames"],
      correctIndex: 0,
      hintSnippet: "cast a shimmering silver pathway across the glassy water",
      clueFa: "خط سوم رو بخون! یک راه باریک نقره‌ای درخشان روی آب انداخت.",
    },
    choiceA: {
      labelEn: "Listen to the night crickets and river murmurs until sleep comes!",
      labelFa: "به صدای جیرجیرک‌ها و زمزمه رودخانه گوش بدید تا خوابتون ببره!",
      descriptionFa: "آرامش‌بخش‌ترین لالایی طبیعت در دل جنگل.",
    },
    choiceB: {
      labelEn: "Wake up early for a refreshing sunrise swim in Emerald Cove!",
      labelFa: "صبح زود برای آب‌تنی سحرگاهی در آب زلال بیدار بشید!",
      descriptionFa: "شنا در آب خنک انرژی کل روز رو تامین می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Wearing their headlamps, Jack and Toby stepped into the cavern behind the waterfall. The roar of water faded into a rhythmic echo. Stalactites hung like stone icicles from the ceiling. On the smooth cave wall, ancient ochre paintings showed bison, deer, and people holding hands under a sun.",
    keywords: [
      { word: "cavern", meaningFa: "غار بزرگ و شگفت‌انگیز", phonetic: "/ˈkævən/" },
      { word: "stalactites", meaningFa: "قندیل‌های سنگی آویزان از سقف", phonetic: "/ˈstæləktaɪts/" },
      { word: "ochre", meaningFa: "رنگ اخرایی خاکی سنتی", phonetic: "/ˈəʊkər/" },
    ],
    question: {
      promptEn: "What did the ancient cave paintings depict?",
      promptFa: "نقاشی‌های کهن دیواره غار چه چیزهایی رو نشان می‌داد؟",
      options: ["Bison, deer, and people holding hands", "Cars and planes", "Modern houses"],
      correctIndex: 0,
      hintSnippet: "showed bison, deer, and people holding hands under a sun",
      clueFa: "خط آخر رو ببین! گاومیش‌ها، گوزن‌ها و انسان‌هایی که دست هم رو گرفته بودن.",
    },
    choiceA: {
      labelEn: "Document the cave art for the State Archaeological Register!",
      labelFa: "نقاشی‌های دیواری رو در دفتر ثبت آثار باستانی ثبت کنید!",
      descriptionFa: "این غار حفاظت‌شده ملی اعلام می‌شه.",
    },
    choiceB: {
      labelEn: "Hold hands in friendship, mirroring the ancient painting!",
      labelFa: "دست در دست هم به نشانه دوستی شبیه نقاشی باستانی عکس بگیرید!",
      descriptionFa: "پیوند دوستی جاودانه در دل غار کهن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Jack and Toby picked up flat, smooth river stones. Jack took a low stance and flicked his wrist. Plip-plop-plip-plop! The stone skipped seven times across the glassy waterfall pool! Toby cheered and tried his own stone, reaching an impressive six skips.",
    keywords: [
      { word: "stance", meaningFa: "حالت ایستادن ورزشی", phonetic: "/stɑːns/" },
      { word: "flicked", meaningFa: "با چابکی حرکت داد / چرخش مچ", phonetic: "/flɪkt/" },
      { word: "impressive", meaningFa: "چشمگیر و عالی", phonetic: "/ɪmˈpresɪv/" },
    ],
    question: {
      promptEn: "How many times did Jack's stone skip across the water?",
      promptFa: "سنگ جک چند بار روی آب پرش کرد؟",
      options: ["Seven times", "Zero times", "Twenty times"],
      correctIndex: 0,
      hintSnippet: "The stone skipped seven times across the glassy waterfall pool",
      clueFa: "خط دوم رو بخون! هفت بار روی آب جست زد.",
    },
    choiceA: {
      labelEn: "Name this secret cove 'The Seven Skips Lagoon'!",
      labelFa: "اسم این برکه مخفی رو 'تالاب هفت جهش' بگذارید!",
      descriptionFa: "یک نام یادگاری برای نقشه پیش‌آهنگی‌تون.",
    },
    choiceB: {
      labelEn: "Teach stone skipping to the younger cubs back at camp!",
      labelFa: "هنر پرتاب سنگ روی آب رو به بچه‌های کوچک‌تر یاد بدید!",
      descriptionFa: "انتقال مهارت‌های لذت‌بخش طبیعت به دیگران.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The campfire crackled warmly while Jack strummed his wooden ukulele. The whole troop sang 'Down in the Valley' under a canopy of blazing stars. Golden firelight danced on happy, smiling faces.",
    keywords: [{ word: "canopy", meaningFa: "چتر پر ستاره آسمان", phonetic: "/ˈkænəpi/" }],
    question: {
      promptEn: "What song did the whole troop sing?",
      promptFa: "کل گروه چه ترانه‌ای رو با هم خواندند؟",
      options: ["'Down in the Valley'", "'Fast Rock Song'", "'Silent Night'"],
      correctIndex: 0,
      hintSnippet: "sang 'Down in the Valley'",
      clueFa: "آهنگ 'پایین در دره' رو خواندند.",
    },
    choiceA: {
      labelEn: "Earn the Master Campfire Minstrel Badge!",
      labelFa: "نشان نوازنده برتر دور آتش را دریافت کن!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Safely douse the embers with water and soil before bed!",
      labelFa: "آتش رو با آب و خاک کاملاً خاموش کنید و بخوابید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Leader Dan told the legend of the Great White Elk of Pine Valley who protects the forest. As if on cue, a distant gentle owl hooted, sending pleasant shivers of wonder through the listeners.",
    keywords: [{ word: "shivers", meaningFa: "لرزه ملایم و لذت‌بخش هیجان", phonetic: "/ˈʃɪvəz/" }],
    question: {
      promptEn: "What animal hooted gently in the distance?",
      promptFa: "چه حیوانی در دوردست هوهو کرد؟",
      options: ["A gentle owl", "A loud monkey", "A barking dog"],
      correctIndex: 0,
      hintSnippet: "a distant gentle owl hooted",
      clueFa: "یک جغد مهربان در دوردست صدا داد.",
    },
    choiceA: {
      labelEn: "Write the Elk legend into the troop's campfire chronicle!",
      labelFa: "افسانه گوزن سفید رو در کتابچه خاطرات گروه ثبت کن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Sleep soundly in the tent, dreaming of friendly woodland creatures!",
      labelFa: "با آرامش در چادر بخواب و خواب جانوران مهربان رو ببین!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Leader Dan pinned the embroidered Junior Astronomer badge onto Jack's uniform. In the crisp night air, Jack looked up at Polaris with a new understanding of the universe.",
    keywords: [{ word: "embroidered", meaningFa: "گلدوزی‌شده و زیبا", phonetic: "/ɪmˈbrɔɪdəd/" }],
    question: {
      promptEn: "What badge did Leader Dan pin on Jack's uniform?",
      promptFa: "مربی دن چه نشانی به یونیفرم جک زد؟",
      options: ["The Junior Astronomer badge", "A swimming medal", "A cooking badge"],
      correctIndex: 0,
      hintSnippet: "the embroidered Junior Astronomer badge",
      clueFa: "نشان ستاره‌شناس نوجوان رو به او داد.",
    },
    choiceA: {
      labelEn: "Teach basic celestial navigation to your school classmates!",
      labelFa: "جهت‌یابی با ستارگان رو به همکلاسی‌هایت آموزش بده!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Build a mini cardboard planetarium for the community center!",
      labelFa: "یک آسمان‌نمای مقوایی برای خانه فرهنگ محله بساز!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "A brilliant emerald shooting star streaked across the Milky Way, leaving a sparkling trail for three full seconds. Jack and Toby made a wish to stay adventurous friends forever.",
    keywords: [{ word: "streaked", meaningFa: "خطی درخشان انداخت و رد شد", phonetic: "/striːkt/" }],
    question: {
      promptEn: "What color was the brilliant shooting star?",
      promptFa: "شهاب‌سنگ درخشان چه رنگی بود؟",
      options: ["Emerald", "Bright red", "Dark black"],
      correctIndex: 0,
      hintSnippet: "A brilliant emerald shooting star",
      clueFa: "رنگ زمردی درخشان داشت.",
    },
    choiceA: {
      labelEn: "Celebrate the shooting star with a high-five under the moon!",
      labelFa: "با یک دست دادن محکم زیر نور ماه جشن بگیرید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Record the meteor sighting in the International Meteor Database!",
      labelFa: "مشاهده شهاب‌سنگ رو در پایگاه جهانی ثبت کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The head ranger accepted Jack's eagle sketch and framed it inside the Pine Valley Visitor Center. Below the sketch, a plaque reads: 'Golden Eagle observed by Scout Jack, age 11.'",
    keywords: [{ word: "plaque", meaningFa: "لوح یادبود برنجی", phonetic: "/plɑːk/" }],
    question: {
      promptEn: "Where was Jack's eagle sketch framed?",
      promptFa: "نقاشی عقاب جک کجا قاب گرفته شد؟",
      options: ["Inside the Pine Valley Visitor Center", "In a shoe shop", "On a bus stop"],
      correctIndex: 0,
      hintSnippet: "inside the Pine Valley Visitor Center",
      clueFa: "در مرکز بازدیدکنندگان دره کاج‌ها.",
    },
    choiceA: {
      labelEn: "Become the park's official youth wildlife artist!",
      labelFa: "هنرمند نقاش نوجوان رسمی پارک ملی بشو!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Illustrate the new Pine Valley nature trail brochures!",
      labelFa: "بروشورهای جدید راهنمای طبیعت دره را نقاشی کن!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The eagle sketch became the star piece of Jack's portfolio. At the annual regional scouting gala, the council awarded Jack the Eagle Scout Art Ribbon for exceptional nature observation.",
    keywords: [{ word: "portfolio", meaningFa: "پرونده و آلبوم افتخارات", phonetic: "/pɔːtˈfəʊliəʊ/" }],
    question: {
      promptEn: "What award did the council give Jack?",
      promptFa: "شورای پیش‌آهنگی چه جایزه‌ای به جک اهدا کرد؟",
      options: ["The Eagle Scout Art Ribbon", "A gold trophy", "A bicycle"],
      correctIndex: 0,
      hintSnippet: "the Eagle Scout Art Ribbon",
      clueFa: "روبان افتخار هنری پیش‌آهنگی رو دریافت کرد.",
    },
    choiceA: {
      labelEn: "Wear the Art Ribbon proudly on your uniform sash!",
      labelFa: "روبان هنر رو با افتخار به شال یونیفرمت وصل کن!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Mentor younger cubs in outdoor field sketching!",
      labelFa: "به بچه‌های کوچک‌تر نقاشی زنده در طبیعت رو یاد بده!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Standing atop Eagle Peak at dawn, Jack and Toby watched the golden sun breach the horizon. Pink clouds bathed the pine forests below in radiant morning light. They breathed the crisp mountain air in triumph.",
    keywords: [{ word: "breach", meaningFa: "طلوع کردن و سر زدن", phonetic: "/briːtʃ/" }],
    question: {
      promptEn: "What bathed the pine forests below in radiant light?",
      promptFa: "چه چیزی جنگل‌های کاج را در نور درخشان فرو برد؟",
      options: ["Pink morning clouds and the sun", "Dark rain storm", "City smoke"],
      correctIndex: 0,
      hintSnippet: "Pink clouds bathed the pine forests below in radiant morning light",
      clueFa: "ابرهای صورتی و آفتاب زرین صبحگاهی.",
    },
    choiceA: {
      labelEn: "Sound the summit horn to greet the valley below!",
      labelFa: "بوق قله رو برای سلام به دره به صدا درآورید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Place a commemorative summit stone on the peak cairn!",
      labelFa: "یک سنگ یادبود روی تپه سنگی قله به نشانه صعود بگذارید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Sitting on a flat sunlit boulder at the peak, the scouts enjoyed roasted almonds, sweet dried cranberries, and warm honey tea. Toby smiled: 'Breakfast at two thousand meters tastes better than any feast!'",
    keywords: [{ word: "feast", meaningFa: "جشن و ضیافت شاهانه", phonetic: "/fiːst/" }],
    question: {
      promptEn: "What did the scouts eat for breakfast at the peak?",
      promptFa: "بچه‌ها در نوک قله برای صبحانه چی خوردند؟",
      options: ["Roasted almonds and dried cranberries", "Cold pizza", "Fish soup"],
      correctIndex: 0,
      hintSnippet: "roasted almonds, sweet dried cranberries, and warm honey tea",
      clueFa: "بادام برشته، کرنبری خشک و چای عسل خوردند.",
    },
    choiceA: {
      labelEn: "Create the official Pine Valley Trail-Mix recipe book!",
      labelFa: "دستور پخت معجون مقوی کوهنوردی رو در کتابچه بنویسید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Begin the gentle descent down the pine needle trail!",
      labelFa: "فرود آرام رو از میان بوی خوش برگ‌های کاج آغاز کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The State Heritage Museum unveiled a new permanent display: 'The Whispering River Obsidian Cache, Discovered by Scout Troop 42.' School classes from across the state visit to learn from the discovery.",
    keywords: [{ word: "unveiled", meaningFa: "پرده‌برداری کرد و به نمایش گذاشت", phonetic: "/ʌnˈveɪld/" }],
    question: {
      promptEn: "Who was credited on the museum display?",
      promptFa: "کشف در موزه به نام چه گروهی ثبت شد؟",
      options: ["Scout Troop 42", "A private company", "Nobody"],
      correctIndex: 0,
      hintSnippet: "Discovered by Scout Troop 42",
      clueFa: "به نام گروه پیش‌آهنگی ۴۲ ثبت شد.",
    },
    choiceA: {
      labelEn: "Deliver the opening keynote speech at the museum gala!",
      labelFa: "سخنرانی افتتاحیه نمایشگاه موزه رو ارائه بده!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Lead youth archaeology workshops in national parks!",
      labelFa: "کارگاه‌های باستان‌شناسی نوجوانان رو در پارک‌ها برگزار کن!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Jack and Toby's article was published as the cover story of 'Young Explorer's Monthly'. Over fifty thousand young readers learned the principles of respectful outdoor archaeology and ethical discovery.",
    keywords: [{ word: "principles", meaningFa: "اصول اخلاقی و علمی", phonetic: "/ˈprɪnsəplz/" }],
    question: {
      promptEn: "What magazine featured their story on the cover?",
      promptFa: "کدام مجله داستان آنها را روی جلد برد؟",
      options: ["'Young Explorer's Monthly'", "'Fashion Weekly'", "'Car Driver'"],
      correctIndex: 0,
      hintSnippet: "Young Explorer's Monthly",
      clueFa: "ماهنامه کاوشگران نوجوان.",
    },
    choiceA: {
      labelEn: "Establish an annual Young Explorer Scholarship Fund!",
      labelFa: "صندوق سالانه بورسیه کاوشگران نوجوان تاسیس کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Write a monthly wilderness discovery column for the magazine!",
      labelFa: "ستون ماهانه ماجراجویی در طبیعت رو برای مجله بنویسید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Tucked inside warm sleeping bags with rainfly open to the stars, the boys listened to the peaceful lapping of river waves. Sleep came quickly, deep and restorative as only mountain sleep can be.",
    keywords: [{ word: "restorative", meaningFa: "بخشاینده آرامش و انرژی‌بخش", phonetic: "/rɪˈstɔːrətɪv/" }],
    question: {
      promptEn: "What sound lulled the boys to sleep?",
      promptFa: "چه صدایی بچه‌ها رو به خواب برد؟",
      options: ["The peaceful lapping of river waves", "Loud alarms", "Car horns"],
      correctIndex: 0,
      hintSnippet: "the peaceful lapping of river waves",
      clueFa: "صدای آرامش‌بخش موج‌های رودخانه.",
    },
    choiceA: {
      labelEn: "Wake to the aroma of pine needle tea brewed by Leader Dan!",
      labelFa: "با بوی خوش چای کاج که مربی دم کرده بیدار شو!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Pack the camp leaving zero trace in nature!",
      labelFa: "کمپ رو بدون به جا گذاشتن حتی یک ذره ردپا جمع کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "At sunrise, Jack and Toby leaped into the turquoise waters of Emerald Cove. The cool mountain water was invigorating. They swam together to the middle sandbar, laughing under the morning sun.",
    keywords: [{ word: "invigorating", meaningFa: "انرژی‌بخش و شاداب‌کننده", phonetic: "/ɪnˈvɪɡəreɪtɪŋ/" }],
    question: {
      promptEn: "Where did the boys swim at sunrise?",
      promptFa: "بچه‌ها هنگام طلوع کجا شنا کردند؟",
      options: ["In the turquoise waters of Emerald Cove", "In a swimming pool", "In a muddy puddle"],
      correctIndex: 0,
      hintSnippet: "the turquoise waters of Emerald Cove",
      clueFa: "در آب‌های فیروزه‌ای خلیج زمردی.",
    },
    choiceA: {
      labelEn: "Award Toby the Wild River Swimmer Certificate!",
      labelFa: "مدرک شناگر رودخانه وحشی رو به توبی اهدا کن!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Dry off by a small driftwood fire with roasted apples!",
      labelFa: "کنار آتش چوب‌های خشک با سیب کبابی گرم بشید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "State archaeologists arrived with specialized non-invasive scanners to register the rock art. They declared the waterfall cavern an official protected national sanctuary, naming Jack and Toby its honorary custodians.",
    keywords: [{ word: "custodians", meaningFa: "پاسداران و امانت‌داران رسمی", phonetic: "/kʌˈstəʊdiənz/" }],
    question: {
      promptEn: "What did the archaeologists name Jack and Toby?",
      promptFa: "باستان‌شناسان جک و توبی رو چه نامیدند؟",
      options: ["Honorary custodians of the sanctuary", "Tourists", "Trespassers"],
      correctIndex: 0,
      hintSnippet: "naming Jack and Toby its honorary custodians",
      clueFa: "پاسداران افتخاری پناهگاه ملی.",
    },
    choiceA: {
      labelEn: "Lead educational conservation tours for local schools!",
      labelFa: "تورهای آموزشی حفاظت از میراث رو برای مدرسه‌ها برگزار کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Install respectful solar-powered viewing platforms!",
      labelFa: "سکوهای خورشیدی تماشای امن بدون آسیب به غار بسازید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Under the ancient rock art of friendship, Leader Dan took a photograph of Jack and Toby clasping hands. The photograph captures the spirit of scout brotherhood that has connected humans for millennia.",
    keywords: [{ word: "millennia", meaningFa: "هزاران سال در طول تاریخ", phonetic: "/mɪˈleniə/" }],
    question: {
      promptEn: "What did the photograph capture under the ancient art?",
      promptFa: "عکس زیر اثر باستانی چه پیامی رو ثبت کرد؟",
      options: ["The spirit of scout brotherhood", "A cold rock", "A broken torch"],
      correctIndex: 0,
      hintSnippet: "captures the spirit of scout brotherhood",
      clueFa: "روح برادری و دوستی جاودانه پیش‌آهنگی.",
    },
    choiceA: {
      labelEn: "Print the friendship photo for the scout troop hall!",
      labelFa: "عکس دوستی رو در تالار پیش‌آهنگی شهر قاب کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Carve your scout troop pledge onto a smooth walking stick!",
      labelFa: "عهد پیش‌آهنگی‌تون رو روی یک چوب‌دستی کوهنوردی زیبا حک کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The ranger station officially added 'The Seven Skips Lagoon' to the national park map. Every summer, campers come to try beating Jack's record of seven skips across the waterfall pool.",
    keywords: [{ word: "lagoon", meaningFa: "برکه و آبگیر طبیعی آرام", phonetic: "/ləˈɡuːn/" }],
    question: {
      promptEn: "What was added to the national park map?",
      promptFa: "چه نامی به نقشه رسمی پارک ملی اضافه شد؟",
      options: ["The Seven Skips Lagoon", "A new parking lot", "A shoe shop"],
      correctIndex: 0,
      hintSnippet: "added 'The Seven Skips Lagoon' to the national park map",
      clueFa: "نام 'تالاب هفت جهش' اضافه شد.",
    },
    choiceA: {
      labelEn: "Hold the Annual Seven Skips Championship every August!",
      labelFa: "مسابقه سالانه پرتاب سنگ رو هر مردادماه برگزار کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Award flat polished stones as honorary trophies!",
      labelFa: "سنگ‌های صیقلی پهن رو به عنوان کاپ مسابقه به قهرمانان بدید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Gathering the younger scout cubs by the lakeshore, Jack and Toby patiently taught the low-angle wrist flick. Soon, fifteen children were skipping stones, cheering with joy as water splashed like diamonds in the sun.",
    keywords: [{ word: "flick", meaningFa: "حرکت چابک مچ دست", phonetic: "/flɪk/" }],
    question: {
      promptEn: "What did the water splash like in the sun?",
      promptFa: "آب زیر نور آفتاب مثل چه چیزی برق می‌زد؟",
      options: ["Diamonds in the sun", "Mud", "Dark ink"],
      correctIndex: 0,
      hintSnippet: "splashed like diamonds in the sun",
      clueFa: "مثل الماس‌های درخشان در آفتاب.",
    },
    choiceA: {
      labelEn: "Award every young cub a Junior Skipper badge!",
      labelFa: "به همه بچه‌ها نشان پرتاب سنگ نوجوان اهدا کنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Hike back to basecamp singing scout marching cadences!",
      labelFa: "با سرودهای ریتمیک شاد به سمت کمپ اصلی پیاده‌روی کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Master Minstrel of Pine Valley", titleFa: "نوازنده برتر دره کاج‌ها", badgeCategory: "legendary", badgeIcon: "🪕", badgeNameFa: "پایان افسانه‌ای", climaxEn: "Jack's ukulele songs become the official anthem of Pine Valley scout camps for generations.", climaxFa: "آهنگ‌های زیبای یوکللی جک به سرود رسمی تمام اردوهای پیش‌آهنگی دره کاج‌ها بدل شد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "Leave No Trace Champions", titleFa: "قهرمانان طبیعت پاک", badgeCategory: "heroic", badgeIcon: "🌿", badgeNameFa: "پایان محیط‌زیستی", climaxEn: "The campsite is left perfectly spotless, setting the highest standard for wilderness stewardship.", climaxFa: "محل کمپ به قدری پاکیزه ماند که الگوی درخشان حفاظت از طبیعت برای همه شد.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "Chronicle of the White Elk", titleFa: "سالنامه افسانه گوزن سپید", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آموزنده و ماندگار", climaxEn: "Generations of campers read Jack's storybook of the gentle White Elk around twilight fires.", climaxFa: "نسل‌های بعد قصه گوزن سفید را کنار آتش‌های گرگ‌ومیش با لذت خواندند.", xpReward: 175 },
  { pathCode: "AAABB", titleEn: "The Woodland Dreamers", titleFa: "رؤیاهای شیرین بیشه‌زار", badgeCategory: "explorer", badgeIcon: "⛺", badgeNameFa: "پایان آرامش‌بخش", climaxEn: "Sleeping peacefully under pine trees, the scouts awaken to morning bird song and dewy sunshine.", climaxFa: "در دل خوابی آرام، با آواز پرندگان و نسیم شبنم‌دار صبحگاهی با نشاط بیدار شدند.", xpReward: 160 },
  { pathCode: "AABAA", titleEn: "The Youth Celestial Navigator", titleFa: "ناوبری ستارگان آسمان", badgeCategory: "scholar", badgeIcon: "🧭", badgeNameFa: "پایان علمی", climaxEn: "Jack's school astronomy lectures inspire forty students to look at the night sky with wonder.", climaxFa: "کلاس‌های نجوم جک چهل دانش‌آموز را شیفته کاوش در آسمان شب کرد.", xpReward: 185 },
  { pathCode: "AABAB", titleEn: "The Cardboard Starlight Theater", titleFa: "آسمان‌نمای ستاره‌های کاغذی", badgeCategory: "funny", badgeIcon: "⭐", badgeNameFa: "پایان خلاقانه و شاد", climaxEn: "Children at the community center gaze into the homemade planetarium, reciting star names.", climaxFa: "کودکان در خانه فرهنگ به آسمان‌نمای دست‌ساز خیره شدند و نام ستارگان را آموختند.", xpReward: 170 },
  { pathCode: "AABBA", titleEn: "The Wish on the Emerald Meteor", titleFa: "آرزوی شهاب‌سنگ زمردین", badgeCategory: "legendary", badgeIcon: "🌠", badgeNameFa: "پایان پیوند دوستی", climaxEn: "Jack and Toby remain lifelong adventure companions, exploring mountains across continents.", climaxFa: "جک و توبی بهترین رفیقان همیشگی ماندند و در کوهستان‌های جهان ماجراجویی کردند.", xpReward: 195 },
  { pathCode: "AABBB", titleEn: "International Meteor Record", titleFa: "ثبت در پایگاه بین‌المللی شهاب‌ها", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان پژوهشگری", climaxEn: "The International Meteor Organization officially records their precise high-altitude observation.", climaxFa: "سازمان جهانی نجوم رصد دقیق بچه‌ها را در فهرست کشفیات رسمی ثبت کرد.", xpReward: 180 },
  { pathCode: "ABAAA", titleEn: "The Youth Wildlife Laurels", titleFa: "مدال زرین نقاش حیات‌وحش", badgeCategory: "legendary", badgeIcon: "🎨", badgeNameFa: "پایان هنرمندانه", climaxEn: "Jack's framed golden eagle sketch greets thousands of mountain visitors every single summer.", climaxFa: "نقاشی قاب‌شده عقاب طلایی جک هر تابستان به هزاران گردشگر پارک خوش‌آمد می‌گوید.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "Pine Valley Trail Illustrator", titleFa: "تصویرگر نقشه‌های راهنمای دره", badgeCategory: "scholar", badgeIcon: "🗺️", badgeNameFa: "پایان خدمت به طبیعت", climaxEn: "Every hiker now carries a trail guide illustrated with Jack's vibrant animal drawings.", climaxFa: "همه کوهنوردان بروشورهای راهنما با نقاشی‌های حیوانات جک را همراه دارند.", xpReward: 175 },
  { pathCode: "ABABA", titleEn: "The Eagle Scout Art Ribbon", titleFa: "نشان عالی هنر پیش‌آهنگی", badgeCategory: "heroic", badgeIcon: "🦅", badgeNameFa: "پایان افتخار ملی", climaxEn: "Jack is recognized as the top youth nature illustrator in the entire regional scout federation.", climaxFa: "جک به عنوان برترین نقاش طبیعت در کل فدراسیون پیش‌آهنگی منطقه تجلیل شد.", xpReward: 190 },
  { pathCode: "ABABB", titleEn: "Master of Field Sketching", titleFa: "مربی کارگاه‌های طراحی زنده", badgeCategory: "scholar", badgeIcon: "✏️", badgeNameFa: "پایان معلمی", climaxEn: "Dozens of young cubs learn to look closely at nature and express its beauty with pencils.", climaxFa: "ده‌ها پیش‌آهنگ خردسال یاد گرفتند با مداد زیبایی‌های کوهستان را به تصویر بکشند.", xpReward: 180 },
  { pathCode: "ABBAA", titleEn: "Conquerors of Eagle Peak", titleFa: "فاتحان سحرگاه قله عقاب", badgeCategory: "legendary", badgeIcon: "🏔️", badgeNameFa: "پایان فتح قله", climaxEn: "The horn echo announces their arrival atop the highest summit in Pine Valley at sunrise.", climaxFa: "صدای بوق صعود، فتح بلندترین قله دره کاج‌ها در سحرگاه را به گوش همگان رساند.", xpReward: 200 },
  { pathCode: "ABBAB", titleEn: "The Summit Cairn of Honor", titleFa: "سنگ‌چین جاودانه صعود", badgeCategory: "heroic", badgeIcon: "🪨", badgeNameFa: "پایان افتخارآمیز", climaxEn: "Their marked stone rests on the highest cairn, kissed by clouds and morning breezes.", climaxFa: "سنگ یادبود بچه‌ها بر بلندترین نقطه قله در میان ابرها و نسیم صبحگاهی ماندگار شد.", xpReward: 185 },
  { pathCode: "ABBBA", titleEn: "The Mountain Feast Cookbook", titleFa: "کتابچه خوراکی‌های نیروبخش کوه", badgeCategory: "funny", badgeIcon: "🍯", badgeNameFa: "پایان شیرین و مقوی", climaxEn: "Campers everywhere adopt Jack's honey-almond trail mix as the best mountain fuel.", climaxFa: "کوهنوردان معجون عسل و بادام جک را به عنوان بهترین خوراکی صعود انتخاب کردند.", xpReward: 165 },
  { pathCode: "ABBBB", titleEn: "The Scented Pine Descent", titleFa: "فرود شادمانه از میان عطر کاج‌ها", badgeCategory: "explorer", badgeIcon: "🌲", badgeNameFa: "پایان لذت‌بخش", climaxEn: "With light steps and full hearts, the scouts return through fragrant pine needle pathways.", climaxFa: "با قدم‌هایی چابک و دل‌هایی شاد، بچه‌ها از مسیر معطر کاج‌ها بازگشتند.", xpReward: 175 },
  { pathCode: "BAAAA", titleEn: "The State Heritage Hall of Fame", titleFa: "تالار افتخارات میراث ایالت", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان علمی و تاریخی", climaxEn: "The obsidian artifact display educates hundreds of thousands on indigenous river wisdom.", climaxFa: "نمایشگاه اثر باستانی خرد و فرهنگ کهن بومیان رودخانه را به صدها هزار نفر آموخت.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "Junior Archaeology Ambassador", titleFa: "سفیر باستان‌شناسی نوجوانان", badgeCategory: "scholar", badgeIcon: "🎖️", badgeNameFa: "پایان پژوهشگرانه", climaxEn: "Leader Dan and the boys lecture at parks nationwide on ethical discovery and respect.", climaxFa: "مربی دن و بچه‌ها در پارک‌های ملی درباره اهمیت نجات آثار کهن سخنرانی کردند.", xpReward: 190 },
  { pathCode: "BAABA", titleEn: "The Young Explorer Foundation", titleFa: "بنیاد کاوشگران طبیعت", badgeCategory: "legendary", badgeIcon: "💎", badgeNameFa: "پایان سخاوتمندانه", climaxEn: "The scholarship funds wilderness exploration gear for hundred under-resourced youth.", climaxFa: "صندوق بورسیه لوازم کوهنوردی را برای صد نوجوان علاقه‌مند فراهم کرد.", xpReward: 200 },
  { pathCode: "BAABB", titleEn: "The Wilderness Columnist", titleFa: "نویسنده ماهنامه ماجراجویی", badgeCategory: "scholar", badgeIcon: "📰", badgeNameFa: "پایان نویسندگی", climaxEn: "Jack's monthly stories inspire an entire generation to explore the great outdoors safely.", climaxFa: "داستان‌های ماهانه جک الهام‌بخش یک نسل برای ماجراجویی مسئولانه در دل طبیعت شد.", xpReward: 180 },
  { pathCode: "BABAA", titleEn: "The Morning Camp Brew", titleFa: "عطر چای صبحگاهی در جنگل", badgeCategory: "scholar", badgeIcon: "🍵", badgeNameFa: "پایان باصفا و آرام", climaxEn: "Sipping hot pine tea in the cool dawn, the scouts greet a brand new day of wonders.", climaxFa: "با نوشیدن چای داغ در خنکای سحرگاه، بچه‌ها به پیشواز روزی پر از شگفتی رفتند.", xpReward: 170 },
  { pathCode: "BABAB", titleEn: "The Zero-Trace Guardians", titleFa: "محافظان بی‌ردپای حیات‌وحش", badgeCategory: "heroic", badgeIcon: "🏕️", badgeNameFa: "پایان حفاظت محیط‌زیست", climaxEn: "The green cove remains pure and pristine, untouched by human presence.", climaxFa: "خلیج زمردی دست‌نخورده و زلال، پاکیزه مانند روز نخست باقی ماند.", xpReward: 180 },
  { pathCode: "BABBA", titleEn: "The Wild River Swimmer", titleFa: "شناگر شجاع رودخانه وحشی", badgeCategory: "heroic", badgeIcon: "🏊", badgeNameFa: "پایان پرانرژی", climaxEn: "Toby frames his swimming certificate, remembering the clear emerald waters of the cove.", climaxFa: "توبی مدرک شنای خود را قاب گرفت و آب‌های زلال خلیج را به خاطر سپرد.", xpReward: 185 },
  { pathCode: "BABBB", titleEn: "The Driftwood Campfire Feast", titleFa: "جشن سیب‌های کباب‌شده کنار آب", badgeCategory: "funny", badgeIcon: "🍎", badgeNameFa: "پایان لذیذ و خاطره‌انگیز", climaxEn: "Sweet roasted cinnamon apples by the river shore taste like the greatest reward on earth.", climaxFa: "سیب‌های دارچینی کبابی کنار ساحل، شیرین‌ترین پاداش برای این ماجراجویی بودند.", xpReward: 165 },
  { pathCode: "BBAAA", titleEn: "The Sanctuary of Painted Caves", titleFa: "پناهگاه ملی غار نقاشی‌ها", badgeCategory: "legendary", badgeIcon: "🪨", badgeNameFa: "پایان ماندگار تاریخ", climaxEn: "The waterfall cavern is preserved forever, a protected treasure of ancient human art.", climaxFa: "غار پشت آبشار برای همیشه به عنوان گنجینه‌ای از هنر کهن بشر جاودانه شد.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Solar Eco-Observatory", titleFa: "رصدگاه پاک غار باستان", badgeCategory: "scholar", badgeIcon: "☀️", badgeNameFa: "پایان فناوری سبز", climaxEn: "Gentle solar lights illuminate the rock paintings without causing any heat or damage.", climaxFa: "چراغ‌های ملایم خورشیدی نقاشی‌های باستانی را بدون آسیب به زیبایی روشن کردند.", xpReward: 185 },
  { pathCode: "BBABA", titleEn: "The Brotherhood of Ancient Stone", titleFa: "پیوند برادری بر سنگ کهن", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان صمیمانه و عمیق", climaxEn: "The photograph of their handshake hangs in the scout hall as an emblem of timeless loyalty.", climaxFa: "عکس دست دادن بچه‌ها در تالار پیش‌آهنگی نماد وفاداری و رفاقت همیشگی شد.", xpReward: 195 },
  { pathCode: "BBABB", titleEn: "The Carved Staff of Pine Valley", titleFa: "عصای چوبی پیمان پیش‌آهنگ", badgeCategory: "heroic", badgeIcon: "🦯", badgeNameFa: "پایان نشان شجاعت", climaxEn: "Jack's carved walking staff accompanies him on every summit and mountain pass in life.", climaxFa: "عصای چوبی حکاکی‌شده در تمام قله‌ها و سفرهای زندگی همراه همیشگی جک شد.", xpReward: 180 },
  { pathCode: "BBBAA", titleEn: "The Seven Skips Grand Cup", titleFa: "جام بزرگ هفت پرش آبشار", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان ورزشی و مفرح", climaxEn: "The annual stone skipping championship draws hundreds of families to the sparkling lagoon.", climaxFa: "مسابقه سالانه پرتاب سنگ صدها خانواده را به کنار تالاب زلال آبشار کشاند.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Polished River Stone Trophy", titleFa: "کاپ صیقلی سنگ رودخانه", badgeCategory: "funny", badgeIcon: "🥇", badgeNameFa: "پایان خلاقانه", climaxEn: "Each champion receives a smooth river stone inscribed with golden letters: 'Master Skipper'.", climaxFa: "هر قهرمان سنگی صیقلی با خط زرین دریافت کرد که نماد مهارت و شادی بود.", xpReward: 165 },
  { pathCode: "BBBBA", titleEn: "The Junior Skipper Legion", titleFa: "سپاه کاوشگران پرتاب سنگ", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان محبوبیت", climaxEn: "Fifteen smiling cubs wear their skipping badges with pride, practicing along every riverbank.", climaxFa: "پانزده پیش‌آهنگ خردسال با افتخار نشان خود را زدند و در تمام رودخانه‌ها تمرین کردند.", xpReward: 185 },
  { pathCode: "BBBBB", titleEn: "The Pine Valley Scout Triumph", titleFa: "پیروزی جاودانه پیش‌آهنگان دره کاج‌ها", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Singing joyful cadences together under a boundless sky, Jack and Toby know that true adventure is shared with trusted friends.", climaxFa: "با سرودهای شاد زیر آسمان بی‌کران، جک و توبی دریافتند که زیباترین ماجراجویی‌ها در کنار دوستان باوفا رقم می‌خورد.", xpReward: 200 },
];

export const story3WildCamping: AdventureStory = buildAdventureStory({
  id: "a2-wild-camping",
  storyIndex: 3,
  cefr: "A2",
  titleEn: "The Wild River Camping Trip",
  titleFa: "ماجراجویی در کمپینگ رودخانه وحشی",
  genre: "travel",
  genreLabelFa: "🏕️ سفر و ماجراجویی",
  genreIcon: "🏕️",
  synopsisEn:
    "Jack and Toby strap on backpacks for a scout camping trip along Whispering River in Pine Valley. Cross the swaying suspension bridge or paddle the canoe across 32 unforgettable endings!",
  synopsisFa:
    "جک و توبی کوله‌پشتی‌ها را می‌بندند و به همراه مربی دن به کمپینگ هیجان‌انگیز کنار رودخانه دره کاج‌ها می‌روند. آیا از روی پل معلق رد می‌شوی یا با قایق از روی موج‌های خروشان؟ ۳۲ پایان ماجراجویانه در انتظار توست!",
  coverImage: "/images/skills/reading/a2-wild-camping.webp",
  nodes,
  endings,
});
