import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2 (B1): The Lighthouse Keeper's Cipher (رمز و راز فانوس دریایی متروکه)
// Genre: Mystery & Curiosity (معمایی و کنجکاوی)
// CEFR: B1 (Past tenses, passive voice, relative clauses, conditionals, modals)
// Characters: Nora, Leo, Captain James (journal), Ranger Evans
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "A dense sea mist was rolling over Gull Rock when Nora and her brother Leo reached the weathered Victorian lighthouse. The building had been decommissioned forty years earlier, yet locals often reported seeing a faint amber pulse from the lantern room on foggy nights. While sheltering from a sudden drizzle in the circular keeper's cabin, Leo brushed away fallen plaster and discovered a heavy brass cipher wheel embedded in the pine floorboards.",
    keywords: [
      { word: "weathered", meaningFa: "باد و باران خورده / کهنه بر اثر زمان", phonetic: "/ˈweðəd/" },
      { word: "decommissioned", meaningFa: "از رده خارج شده / غیرفعال شده", phonetic: "/ˌdiːkəˈmɪʃnd/" },
      { word: "cipher", meaningFa: "رمز و کدهای مخفی نگاری", phonetic: "/ˈsaɪfə/" },
      { word: "embedded", meaningFa: "جاسازی شده / فرورفته در سطح", phonetic: "/ɪmˈbedɪd/" },
    ],
    question: {
      promptEn: "What did Leo discover embedded in the pine floorboards?",
      promptFa: "لئو چه چیزی را جاسازی‌شده درون تخته‌های کف چوبی پیدا کرد؟",
      options: [
        "A heavy brass cipher wheel",
        "An antique silver pocket watch",
        "A rusted fisherman's harpoon",
      ],
      correctIndex: 0,
      hintSnippet: "discovered a heavy brass cipher wheel embedded in the pine floorboards",
      clueFa: "خط آخر رو نگاه کن دوست خوبم؛ یک چرخ‌دنده برنجی رمزگشای سنگین پیدا کرد.",
    },
    choiceA: {
      labelEn: "Rotate the concentric brass rings to align the maritime symbols!",
      labelFa: "حلقه‌های فلزی هم‌مرکز رو بچرخون تا نمادهای دریانوردی تراز بشن!",
      descriptionFa: "شاید یک پیام مخفی یا مکان پنهان رو آشکار کنه.",
    },
    choiceB: {
      labelEn: "Search the mahogany bookshelf for the keeper's coded logbook!",
      labelFa: "قفسه چوب ماهون رو برای پیدا کردن دفترچه ثبت یادداشت‌های ناخدا بگرد!",
      descriptionFa: "معمولاً ناخداها دستورالعمل رمزگشایی رو یادداشت می‌کردن.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Nora aligned the engraved anchor with the north star marking on the outer bronze dial. With an audible mechanical click that startled two resting sea swallows, a hidden square compartment popped open in the stone hearth. Inside lay a rolled nautical parchment detailing twelve secret coastal sea caves, alongside three numbered glass prisms that reflected candlelight in dazzling emerald patterns.",
    keywords: [
      { word: "aligned", meaningFa: "تراز کرد / در یک راستا قرار داد", phonetic: "/əˈlaɪnd/" },
      { word: "compartment", meaningFa: "محفظه مخفی کوچک", phonetic: "/kəmˈpɑːtmənt/" },
      { word: "parchment", meaningFa: "طومار پوستی کهن", phonetic: "/ˈpɑːtʃmənt/" },
      { word: "prisms", meaningFa: "منشورهای شیشه‌ای بازتاب‌دهنده نور", phonetic: "/ˈprɪzəmz/" },
    ],
    question: {
      promptEn: "What popped open after Nora aligned the bronze dials?",
      promptFa: "بعد از اینکه نورا صفحه‌های برنزین را تراز کرد چه چیزی باز شد؟",
      options: [
        "A hidden square compartment in the stone hearth",
        "The heavy iron basement trapdoor",
        "A barred wooden window overlooking the sea",
      ],
      correctIndex: 0,
      hintSnippet: "a hidden square compartment popped open in the stone hearth",
      clueFa: "خط دوم رو ببین؛ یک محفظه مربعی مخفی در شومینه سنگی بیرون پرید.",
    },
    choiceA: {
      labelEn: "Carry the emerald prisms up to the top lantern room!",
      labelFa: "منشورهای شیشه‌ای زمردین رو به اتاق فانوس بالای برج ببر!",
      descriptionFa: "شاید روی عدسی بزرگ فانوس نصب بشن و مسیری رو نشون بدن.",
    },
    choiceB: {
      labelEn: "Follow the parchment map down the rocky cliff path to Smuggler's Cave!",
      labelFa: "نقشه طومار رو دنبال کن و به غار صخره‌ای قاچاقچیان در ساحل برو!",
      descriptionFa: "غارهای ساحلی رازهای تاریخی فراوانی در دل دارند.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Leo scanned the water-damaged titles on the shelf until he pulled a worn leather diary titled 'Observations of 1888'. When he shook it gently, a copper key and a handwritten letter fluttered onto the rug. The letter, signed by Keeper Arthur Vance, warned that an uncharted shipwreck carrying historic astronomical charts was buried just beneath the southern sandbar.",
    keywords: [
      { word: "observations", meaningFa: "مشاهدات و یادداشت‌های ثبت‌شده", phonetic: "/ˌɒbzəˈveɪʃnz/" },
      { word: "uncharted", meaningFa: "ثبت‌نشده در نقشه‌های رسمی", phonetic: "/ʌnˈtʃɑːtɪd/" },
      { word: "astronomical", meaningFa: "ستاره‌شناسی و نجومی", phonetic: "/ˌæstrəˈnɒmɪkl/" },
      { word: "sandbar", meaningFa: "پشته شنی ساحلی در دریا", phonetic: "/ˈsændbɑː/" },
    ],
    question: {
      promptEn: "What was buried beneath the southern sandbar according to the letter?",
      promptFa: "طبق نامه چه چیزی زیر پشته شنی جنوبی دفن شده بود؟",
      options: [
        "An uncharted shipwreck carrying astronomical charts",
        "A chest full of Spanish gold doubloons",
        "The rusty anchor of a pirate frigate",
      ],
      correctIndex: 0,
      hintSnippet: "an uncharted shipwreck carrying historic astronomical charts was buried",
      clueFa: "خط آخر رو بخون؛ لاشه یک کشتی گمشده حاوی نقشه‌های ستاره‌شناسی کهن.",
    },
    choiceA: {
      labelEn: "Use the copper key to unlock the spiral staircase to the observation dome!",
      labelFa: "با کلید مسی قفل پلکان مارپیچ به گنبد رصدخانه برج رو باز کن!",
      descriptionFa: "از بالای برج تمام پشته‌های شنی به وضوح دیده می‌شن.",
    },
    choiceB: {
      labelEn: "Hurry down to the sandbar before the evening high tide covers it!",
      labelFa: "قبل از بالا آمدن مَد شبانه خودت رو به پشته شنی برسون!",
      descriptionFa: "آب دریا به زودی همه جا رو خواهد پوشاند.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "They ascended the spiraling cast-iron staircase, counting one hundred and twenty steps until they reached the magnificent Fresnel lens. Nora carefully placed the three emerald prisms into the brass slots surrounding the lamp bracket. When the setting sun dipped beneath the clouds, a focused beam of green light pierced through the mist, illuminating a mysterious carved seal on an offshore sea arch.",
    keywords: [
      { word: "ascended", meaningFa: "بالا رفتند و صعود کردند", phonetic: "/əˈsendɪd/" },
      { word: "magnificent", meaningFa: "باشکوه و خیره‌کننده", phonetic: "/mæɡˈnɪfɪsnt/" },
      { word: "pierced", meaningFa: "شکافت و نفوذ کرد", phonetic: "/pɪəst/" },
      { word: "illuminating", meaningFa: "روشن کردن و تاباندن نور", phonetic: "/ɪˈluːmɪneɪtɪŋ/" },
    ],
    question: {
      promptEn: "What did the focused beam of green light illuminate?",
      promptFa: "پرتو متمرکز نور سبز چه چیزی را روی صخره دریایی روشن کرد؟",
      options: [
        "A carved seal on an offshore sea arch",
        "A flock of sleeping gulls",
        "An old wooden rescue rowboat",
      ],
      correctIndex: 0,
      hintSnippet: "illuminating a mysterious carved seal on an offshore sea arch",
      clueFa: "خط آخر رو ببین عزیزم؛ یک نشان کنده‌کاری شده روی طاق صخره‌ای دریا رو روشن کرد.",
    },
    choiceA: {
      labelEn: "Focus the lighthouse brass telescope to decipher the stone seal!",
      labelFa: "تلسکوپ برنجی فانوس رو تنظیم کن تا علامت کنده‌کاری‌شده رو بخونی!",
      descriptionFa: "بزرگنمایی عدسی تلسکوپ حروفی مخفی رو آشکار می‌کنه.",
    },
    choiceB: {
      labelEn: "Send a signaling sequence with the lens shutter to test for an echo!",
      labelFa: "با شاتر عدسی یک پیام نوری ارسال کن تا بازتابش رو ببینی!",
      descriptionFa: "شاید آینه‌ای در دل صخره پاسخ بدهد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The path down the cliff was slick with damp moss, but Nora held the map steady while Leo shone his lantern. At the entrance to Smuggler's Cave, the waves receded just enough to reveal a timber chest chained to a granite pillar. The iron padlock had rusted away decades ago, and inside lay bundles of wax-sealed envelopes bearing royal crests from the nineteenth century.",
    keywords: [
      { word: "slick", meaningFa: "لیز و لغزنده", phonetic: "/slɪk/" },
      { word: "receded", meaningFa: "پس‌روی کرد / عقب رفت (آب دریا)", phonetic: "/rɪˈsiːdɪd/" },
      { word: "wax-sealed", meaningFa: "مهر و موم شده با موم قرمز", phonetic: "/wæks siːld/" },
      { word: "crests", meaningFa: "نشان‌ها و نمادهای خاندان‌های اشرافی", phonetic: "/krests/" },
    ],
    question: {
      promptEn: "What was inside the chained timber chest?",
      promptFa: "درون صندوقچه چوبی زنجیرشده چه چیزی قرار داشت؟",
      options: [
        "Wax-sealed envelopes bearing royal crests",
        "Rusty nails and wet cannonballs",
        "Empty glass medicine bottles",
      ],
      correctIndex: 0,
      hintSnippet: "inside lay bundles of wax-sealed envelopes bearing royal crests",
      clueFa: "خط آخر رو نگاه کن؛ دسته‌هایی از نامه‌های مهروموم شده با نشان سلطنتی.",
    },
    choiceA: {
      labelEn: "Inspect the oldest envelope marked with an urgent red crown seal!",
      labelFa: "کهنه‌ترین پاکت نامه رو که نشان تاج قرمز اضطراری داره باز کن!",
      descriptionFa: "احتمالاً مهم‌ترین پیام دیپلماتیک تاریخ این جزیره است.",
    },
    choiceB: {
      labelEn: "Check behind the granite pillar for a smuggler's escape tunnel!",
      labelFa: "پشت ستون گرانیتی رو برای یافتن تونل فرار مخفی جستجو کن!",
      descriptionFa: "غارها معمولاً به راهروهای زیرزمینی متصل می‌شدند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The copper key turned smoothly inside the heavy oak door leading into the observation dome. The circular room was lined with star maps painted on curved brass panels, and a giant celestial astrolabe stood in the center. Through the glass dome, the northern constellation of Cassiopeia shone with unusual brilliance, aligning precisely with an iron pointer on the floor.",
    keywords: [
      { word: "celestial", meaningFa: "آسمانی و افلاکی", phonetic: "/səˈlestiəl/" },
      { word: "astrolabe", meaningFa: "اسطرلاب باستانی دریانوردی", phonetic: "/ˈæstrəleɪb/" },
      { word: "constellation", meaningFa: "صورت فلکی ستارگان", phonetic: "/ˌkɒnstəˈleɪʃn/" },
      { word: "brilliance", meaningFa: "درخشش و تابندگی فوق‌العاده", phonetic: "/ˈbrɪliəns/" },
    ],
    question: {
      promptEn: "What ancient instrument stood in the center of the observation dome?",
      promptFa: "چه ابزار باستانی در مرکز گنبد رصدخانه قرار داشت؟",
      options: [
        "A giant celestial astrolabe",
        "A steam-powered generator",
        "A spinning globe of Mars",
      ],
      correctIndex: 0,
      hintSnippet: "a giant celestial astrolabe stood in the center",
      clueFa: "خط دوم رو ببین دوست من؛ یک اسطرلاب غول‌پیکر فلزی برای رصد ستارگان.",
    },
    choiceA: {
      labelEn: "Align the astrolabe sightline with the brightest star in Cassiopeia!",
      labelFa: "خط دید اسطرلاب رو با پرنورترین ستاره صورت فلکی کاسیوپیا تراز کن!",
      descriptionFa: "شاید زاویه تابش ستاره مکان دقیق لاشه کشتی رو نشون بده.",
    },
    choiceB: {
      labelEn: "Turn the brass floor pointer toward the southern maritime coordinates!",
      labelFa: "عقربه برنجی کف زمین رو به سمت مختصات دریایی جنوب بچرخون!",
      descriptionFa: "پایین برج شاید مکانیزمی زیرزمینی به کار بیفتد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Nora and Leo raced across the damp sands as the low tide exposed a rippling sandbar that normally remained submerged beneath five meters of ocean. Protruding through the wet sand was the blackened oak rib of a sunken schooner from the eighteen-eighties. Resting beside the curved timber was an intact copper diving bell etched with nautical coordinates.",
    keywords: [
      { word: "submerged", meaningFa: "غرق‌شده در زیر آب دریا", phonetic: "/səbˈmɜːdʒd/" },
      { word: "protruding", meaningFa: "بیرون زده از سطح زمین", phonetic: "/prəˈtruːdɪŋ/" },
      { word: "schooner", meaningFa: "کشتی بادبانی دو دکله سنتی", phonetic: "/ˈskuːnə/" },
      { word: "etched", meaningFa: "حکاکی و قلم‌زنی شده", phonetic: "/etʃt/" },
    ],
    question: {
      promptEn: "What kind of sunken vessel's rib was protruding through the sand?",
      promptFa: "دنده چوبی چه نوع کشتی غرق‌شده‌ای از شن‌ها بیرون زده بود؟",
      options: [
        "A sunken schooner from the eighteen-eighties",
        "A modern fiberglass motorboat",
        "A medieval Viking longship",
      ],
      correctIndex: 0,
      hintSnippet: "the blackened oak rib of a sunken schooner from the eighteen-eighties",
      clueFa: "خط سوم رو نگاه کن؛ دنده بلوط سیاه شده یک کشتی بادبانی قدیمی بود.",
    },
    choiceA: {
      labelEn: "Examine the etched coordinates on the copper diving bell!",
      labelFa: "مختصات حکاکی شده روی زنگ غواصی مسی رو یادداشت کن!",
      descriptionFa: "این مختصات دقیقاً مقصد نهایی سفر کشتی رو نشون می‌دهند.",
    },
    choiceB: {
      labelEn: "Dig carefully beside the oak timber before the tide turns!",
      labelFa: "قبل از بازگشت مَد، کنار تیر چوبی رو با احتیاط خاکبرداری کن!",
      descriptionFa: "احتمالاً جعبه ابزار ناخدا در شن‌های خیس مدفون است.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Through the brass telescope, Nora magnified the sea arch carving: it was an intricate compass rose with a Latin inscription reading 'The true beacon shines within'. As she adjusted the focus, she realized the carvings were mirrors that reflected a code back into the lighthouse lantern room.",
    keywords: [
      { word: "magnified", meaningFa: "بزرگنمایی کرد با عدسی", phonetic: "/ˈmæɡnɪfaɪd/" },
      { word: "inscription", meaningFa: "کتیبه و سنگ‌نوشته باستانی", phonetic: "/ɪnˈskrɪpʃn/" },
      { word: "beacon", meaningFa: "مشعل راهنما و فانوس دریایی", phonetic: "/ˈbiːkən/" },
    ],
    question: {
      promptEn: "What did the Latin inscription on the carving translate to?",
      promptFa: "ترجمه سنگ‌نوشته لاتین روی صخره چه بود؟",
      options: [
        "'The true beacon shines within'",
        "'Danger: sharp rocks ahead'",
        "'Turn back before midnight'",
      ],
      correctIndex: 0,
      hintSnippet: "reading 'The true beacon shines within'",
      clueFa: "خط دوم رو ببین؛ نوشته بود: «مشعل حقیقی در درون می‌درخشد».",
    },
    choiceA: {
      labelEn: "Search the interior base of the Fresnel lens for a secret vault!",
      labelFa: "پایه داخلی عدسی بزرگ فانوس رو برای پیدا کردن گاوصندوق مخفی بگرد!",
      descriptionFa: "رمز دقیقاً اشاره به درون خود فانوس داشت.",
    },
    choiceB: {
      labelEn: "Signal the code toward the nearby coastguard watchtower!",
      labelFa: "کد بازتابی رو با پرتو نور به سمت برج دیده‌بانی ساحل مخابره کن!",
      descriptionFa: "شاید محیط‌بانان ساحلی به ثبت این کشف تاریخی کمک کنند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Nora pumped the mechanical shutter lever three times, sending brief emerald flashes into the gathering dusk. Seconds later, a brilliant white beam flared in return from a hidden cave entrance across the water. Someone—or something ancient and automated—had acknowledged the sequence.",
    keywords: [
      { word: "shutter", meaningFa: "دریچه و دیافراگم کنترل نور", phonetic: "/ˈʃʌtə/" },
      { word: "gathering", meaningFa: "فرا رسیدن تدریجی (غروب)", phonetic: "/ˈɡæðərɪŋ/" },
      { word: "acknowledged", meaningFa: "پاسخ داد و تأیید کرد", phonetic: "/əkˈnɒlɪdʒd/" },
    ],
    question: {
      promptEn: "What returned a white flash after Nora signaled?",
      promptFa: "بعد از علامت دادن نورا، چه چیزی با نور سفید پاسخ داد؟",
      options: [
        "A hidden cave entrance across the water",
        "A passing cargo ship",
        "A streetlamp on the highway",
      ],
      correctIndex: 0,
      hintSnippet: "a brilliant white beam flared in return from a hidden cave entrance across the water",
      clueFa: "خط دوم رو نگاه کن؛ یک دهانه غار مخفی از آن سوی آب پاسخ داد.",
    },
    choiceA: {
      labelEn: "Launch the lighthouse dinghy boat to investigate the sea cave!",
      labelFa: "قایق کوچک پارویی فانوس رو به آب بنداز تا به سمت غار حرکت کنی!",
      descriptionFa: "کشف راز منبع نور در تاریکی شب هیجان‌انگیز است.",
    },
    choiceB: {
      labelEn: "Record the light pulse pattern in your expedition journal!",
      labelFa: "الگوی نوری پالس‌ها رو با دقت در دفترچه یادداشتت ثبت کن!",
      descriptionFa: "بررسی الگوها شاید کلید کشف رمزهای باستانی باشد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Nora broke the fragile red wax seal on the royal envelope with steady hands. Inside was a diplomatic charter from Queen Victoria's admiralty, confirming that a royal envoy carrying peace treaties had safely hidden archival gold in the lighthouse foundations during the 1888 crisis.",
    keywords: [
      { word: "diplomatic", meaningFa: "سیاسی و دیپلماتیک", phonetic: "/ˌdɪpləˈmætɪk/" },
      { word: "admiralty", meaningFa: "فرماندهی نیروی دریایی سلطنتی", phonetic: "/ˈædmərəlti/" },
      { word: "foundations", meaningFa: "پی و پی‌ریزی‌های زیربنایی ساختمان", phonetic: "/faʊnˈdeɪʃnz/" },
    ],
    question: {
      promptEn: "What did the royal admiralty letter confirm was hidden in the foundations?",
      promptFa: "نامه رسمی دریاداری چه چیزی را تایید کرد که در پی ساختمان پنهان شده؟",
      options: [
        "Archival gold and peace treaties",
        "A cache of gunpowder barrels",
        "Secret military uniforms",
      ],
      correctIndex: 0,
      hintSnippet: "confirming that a royal envoy carrying peace treaties had safely hidden archival gold",
      clueFa: "خط آخر رو بخون عزیزم؛ طلاهای آرشیوی و معاهده‌های صلح تاریخی.",
    },
    choiceA: {
      labelEn: "Guide Park Ranger Evans to inspect the historic vault!",
      labelFa: "محیط‌بان ایوانز رو برای بررسی رسمی این گنجینه تاریخی راهنمایی کن!",
      descriptionFa: "ثبت قانونی این کشف در موزه ملی یک افتخار بزرگ است.",
    },
    choiceB: {
      labelEn: "Seal the letters back safely and report directly to the maritime university!",
      labelFa: "نامه‌ها رو با احترام بسته‌بندی کن و به دانشگاه دریانوردی تحویل بده!",
      descriptionFa: "دانشمندان تاریخ مشتاق مطالعه این اسناد هستند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Leo crawled into the low passage behind the granite pillar, holding the lantern before him. The tunnel opened into a spacious dry cavern filled with antique wooden barrels and a carved stone desk. Sitting on the desk was Keeper Vance's copper telegraph key, still connected to insulated copper wires leading up into the cliff rock.",
    keywords: [
      { word: "cavern", meaningFa: "غار بزرگ و زیرزمینی", phonetic: "/ˈkævən/" },
      { word: "telegraph", meaningFa: "دستگاه تلگراف ارسال پیام الکتریکی", phonetic: "/ˈtelɪɡrɑːf/" },
      { word: "insulated", meaningFa: "عایق‌بندی شده و محفوظ", phonetic: "/ˈɪnsjuleɪtɪd/" },
    ],
    question: {
      promptEn: "What instrument was sitting on the carved stone desk?",
      promptFa: "چه وسیله‌ای روی میز سنگی تراشیده قرار داشت؟",
      options: [
        "Keeper Vance's copper telegraph key",
        "A rusted pirate sword",
        "A ceramic tea pot",
      ],
      correctIndex: 0,
      hintSnippet: "Sitting on the desk was Keeper Vance's copper telegraph key",
      clueFa: "خط سوم رو ببین؛ دسته تلگراف مسی نگهبان فانوس هنوز به سیم‌ها وصل بود.",
    },
    choiceA: {
      labelEn: "Tap out a Morse code query along the ancient copper wires!",
      labelFa: "با کلید تلگراف یک پیام مورس از طریق سیم‌های قدیمی ارسال کن!",
      descriptionFa: "شاید دستگاه گیرنده‌ای در برج فانوس به کار بیفتد.",
    },
    choiceB: {
      labelEn: "Examine the telegraph operator's secret leather journal on the desk!",
      labelFa: "دفترچه چرمی پیام‌های تلگراف‌چی رو روی میز مطالعه کن!",
      descriptionFa: "شاید آخرین پیام‌های مبادله‌شده ثبت شده باشد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "When Leo swung the celestial astrolabe toward Cassiopeia, a hidden gear mechanism within the pedestal whirred to life. The brass floor plates parted smoothly, revealing an ornate steel case containing the lost navigational sea charts drawn by master cartographer Jonathan Vance in 1888.",
    keywords: [
      { word: "whirred", meaningFa: "با صدای چرخش چرخ‌دنده‌ها به کار افتاد", phonetic: "/wɜːd/" },
      { word: "ornate", meaningFa: "پرتزیین و قلم‌زنی شده", phonetic: "/ɔːˈneɪt/" },
      { word: "cartographer", meaningFa: "نقشه‌نگار و کارتوگراف حرفه‌ای", phonetic: "/kɑːˈtɒɡrəfə/" },
    ],
    question: {
      promptEn: "What did the ornate steel case inside the floor contain?",
      promptFa: "جعبه فولادی مزین درون کف زمین حاوی چه چیزی بود؟",
      options: [
        "Lost navigational sea charts drawn in 1888",
        "Handfuls of rough diamonds",
        "A pair of broken compasses",
      ],
      correctIndex: 0,
      hintSnippet: "containing the lost navigational sea charts drawn by master cartographer Jonathan Vance",
      clueFa: "خط آخر رو نگاه کن؛ نقشه‌های دریایی گمشده از سال ۱۸۸۸.",
    },
    choiceA: {
      labelEn: "Present the master charts to the State Maritime Museum!",
      labelFa: "نقشه‌های نفیس رو به موزه دریانوردی ایالتی اهدا کن!",
      descriptionFa: "نام شما به عنوان کاشفان اسناد تاریخی ثبت می‌شود.",
    },
    choiceB: {
      labelEn: "Use the charts to plan an ocean expedition to the outer reef!",
      labelFa: "از روی نقشه‌ها یک سفر اکتشافی به سمت صخره‌های مرجانی دوردست طراحی کن!",
      descriptionFa: "ماجراهای بزرگتری در دل اقیانوس منتظر شماست.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Rotating the floor pointer clicked seven heavy bolts beneath their feet. A concealed dumbwaiter hoist lifted an antique oak cabinet into the dome. Inside stood a pristine nineteenth-century marine chronometer, its brass pendulum still swaying rhythmically as if wound only yesterday.",
    keywords: [
      { word: "dumbwaiter", meaningFa: "بالابر کوچک مکانیکی دستی", phonetic: "/ˈdʌmweɪtə/" },
      { word: "pristine", meaningFa: "دست‌نخورده و مثل روز اول تمیز", phonetic: "/ˈprɪstiːn/" },
      { word: "chronometer", meaningFa: "کرونومتر و ساعت فوق‌دقیق دریانوردی", phonetic: "/krəˈnɒmɪtə/" },
    ],
    question: {
      promptEn: "What antique device stood inside the oak cabinet?",
      promptFa: "چه دستگاه عتیقه‌ای درون کمد چوب بلوط قرار داشت؟",
      options: [
        "A pristine marine chronometer with swaying pendulum",
        "A steam-driven phonograph",
        "A collection of glass thermometers",
      ],
      correctIndex: 0,
      hintSnippet: "Inside stood a pristine nineteenth-century marine chronometer",
      clueFa: "خط دوم رو ببین؛ ساعت دریایی فوق‌دقیق قرن نوزدهم با پاندول چرخان.",
    },
    choiceA: {
      labelEn: "Verify the chronometer's time against Greenwich Observatory time!",
      labelFa: "دقت زمان ساعت رو با زمان رصدخانه سلطنتی گرینویچ بسنج!",
      descriptionFa: "دقت این ساعت‌های تاریخی شگفت‌انگیز است.",
    },
    choiceB: {
      labelEn: "Listen to the musical chime bell chiming on the hour!",
      labelFa: "به صدای زنگوله دلنشین ساعت در رأس ساعت گوش بسپار!",
      descriptionFa: "نوای ملودیک ساعت پس از صد سال دوباره در برج طنین می‌اندازد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Nora noted the longitude and latitude coordinates etched on the copper diving bell: forty-three degrees north, seventy degrees west. Checking her handheld GPS, she realized these coordinates pointed straight to a shallow underwater reef barely fifty meters off the lighthouse point.",
    keywords: [
      { word: "longitude", meaningFa: "طول جغرافیایی", phonetic: "/ˈlɒŋɡɪtjuːd/" },
      { word: "latitude", meaningFa: "عرض جغرافیایی", phonetic: "/ˈlætɪtjuːd/" },
      { word: "shallow", meaningFa: "کم‌عمق و نزدیک به سطح آب", phonetic: "/ˈʃæləʊ/" },
    ],
    question: {
      promptEn: "How far off the lighthouse point did the coordinates lead?",
      promptFa: "مختصات ثبت‌شده تا چه فاصله‌ای از نوک فانوس دریایی را نشان می‌دادند؟",
      options: [
        "Barely fifty meters off the point",
        "Over fifty miles across the sea",
        "At the bottom of the deepest trench",
      ],
      correctIndex: 0,
      hintSnippet: "barely fifty meters off the lighthouse point",
      clueFa: "خط آخر رو نگاه کن؛ فقط پنجاه متر با نوک فانوس دریایی فاصله داشت.",
    },
    choiceA: {
      labelEn: "Notify the marine archaeological dive team at once!",
      labelFa: "فوراً تیم غواصی باستان‌شناسی دریایی رو مطلع کن!",
      descriptionFa: "متخصصان برای کشف این لاشه کشتی عازم منطقه می‌شوند.",
    },
    choiceB: {
      labelEn: "Deploy an underwater remote drone camera to inspect the reef!",
      labelFa: "دوربین کنترلی زیرآبی رو برای کاوش صخره مرجانی به آب بفرست!",
      descriptionFa: "تصاویر زنده از اعماق آب روی گوشی ظاهر می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Digging rapidly through the moist silt around the schooner's oak timber, Leo's small trowel hit something solid. Pushing aside centuries of packed shells, they uncovered the ship's bronze bell, embossed with the vessel's proud name: *The Sea Falcon 1888*.",
    keywords: [
      { word: "trowel", meaningFa: "بیلچه باغبانی و حفاری", phonetic: "/ˈtraʊəl/" },
      { word: "embossed", meaningFa: "برجسته‌کاری شده با فلز", phonetic: "/ɪmˈbɒst/" },
      { word: "vessel", meaningFa: "کشتی و شناور بزرگ", phonetic: "/ˈvesl/" },
    ],
    question: {
      promptEn: "What was the name embossed on the bronze ship's bell?",
      promptFa: "نام برجسته‌شده روی زنگ برنزی کشتی چه بود؟",
      options: [
        "The Sea Falcon 1888",
        "The Flying Dutchman",
        "The Royal Queen",
      ],
      correctIndex: 0,
      hintSnippet: "embossed with the vessel's proud name: The Sea Falcon 1888",
      clueFa: "خط آخر رو بخون؛ نام «شاهین دریا ۱۸۸۸» روی زنگ حک شده بود.",
    },
    choiceA: {
      labelEn: "Ring the Sea Falcon's bronze bell three times across the cove!",
      labelFa: "زنگ برنزی شاهین دریا را سه بار به یاد دریانوردان کهن به صدا درآور!",
      descriptionFa: "طنین پرشکوه زنگ پس از قرن‌ها ساحل را پر می‌کند.",
    },
    choiceB: {
      labelEn: "Clean and preserve the bronze bell for the town history archive!",
      labelFa: "زنگ تاریخی را تمیز و برای موزه تاریخ شهر محافظت کنید!",
      descriptionFa: "افتخار بزرگی برای تاریخ شهر به دست آمده است.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Inside the lens base, a velvet-lined compartment held Keeper Vance's gold pocket compass and a journal entry praising his brave descendants. Nora and Leo felt an overwhelming sense of wonder.",
    keywords: [{ word: "descendants", meaningFa: "نوادگان و نسل‌های آینده", phonetic: "/dɪˈsendənts/" }],
    question: {
      promptEn: "What was inside the velvet-lined compartment?",
      promptFa: "درون محفظه مخملین چه چیزی قرار داشت؟",
      options: ["A gold pocket compass and a personal journal entry", "A silver pocket knife", "A pair of reading glasses"],
      correctIndex: 0,
      hintSnippet: "held Keeper Vance's gold pocket compass and a journal entry",
      clueFa: "قطب‌نمای طلایی جیبی و یادداشت شخصی نگهبان کهن بود.",
    },
    choiceA: {
      labelEn: "Keep the gold compass as a family heirloom of courage!",
      labelFa: "قطب‌نمای طلایی را به عنوان نماد شجاعت خانوادگی حفظ کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Donate the compass to the Historical Society in a grand ceremony!",
      labelFa: "قطب‌نما را در مراسمی باوقار به انجمن تاریخ تقدیم کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The coastguard cutter arrived within minutes, their blue emergency lights flashing across the water. Ranger Evans saluted the siblings for solving the forty-year-old light anomaly.",
    keywords: [{ word: "anomaly", meaningFa: "پدیده غیرعادی و معمایی", phonetic: "/əˈnɒməli/" }],
    question: {
      promptEn: "Why did Ranger Evans salute the siblings?",
      promptFa: "چرا محیط‌بان ایوانز به خواهر و برادر احترام نظامی گذاشت؟",
      options: ["For solving the forty-year-old light anomaly", "For catching a big fish", "For painting the fence"],
      correctIndex: 0,
      hintSnippet: "saluted the siblings for solving the forty-year-old light anomaly",
      clueFa: "برای حل معمای نورهای ۴۰ ساله فانوس دریایی.",
    },
    choiceA: {
      labelEn: "Receive honorary Coastguard Explorer badges from the captain!",
      labelFa: "مدال‌های افتخاری کاشفان گارد ساحلی را از کاپیتان دریافت کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Join the coastguard patrol for a celebratory night boat ride!",
      labelFa: "برای یک قایق‌سواری شبانه پیروزمندانه به گشت ساحلی ملحق شوید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Rowing through the sea cave arch, they discovered an ancient underground boathouse illuminated by phosphorescent sea plants. A perfectly preserved nineteenth-century launch boat rested on dry timbers.",
    keywords: [{ word: "phosphorescent", meaningFa: "شب‌تاب و فسفری درخشان", phonetic: "/ˌfɒsfəˈresnt/" }],
    question: {
      promptEn: "What was resting on dry timbers inside the underground boathouse?",
      promptFa: "روی تیرهای چوبی درون اسکله زیرزمینی چه چیزی قرار داشت؟",
      options: ["A preserved nineteenth-century launch boat", "A modern jet ski", "A wooden treasure chest full of stones"],
      correctIndex: 0,
      hintSnippet: "A perfectly preserved nineteenth-century launch boat rested on dry timbers",
      clueFa: "قایق بادبانی قرن نوزدهم کاملاً سالم مانده بود.",
    },
    choiceA: {
      labelEn: "Document the cavern coordinates for maritime archaeological research!",
      labelFa: "مختصات این اسکله غاری باستانی را برای تحقیقات باستان‌شناسی ثبت کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Carefully bring the historic carved ship lantern back to land!",
      labelFa: "چراغ دریایی کنده‌کاری‌شده قایق را با احتیاط به ساحل ببرید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Nora transcribed the light pulse sequences into musical notes, discovering that Keeper Vance was a skilled composer who translated ocean tides into symphonic harmonies.",
    keywords: [{ word: "composer", meaningFa: "آهنگساز حرفه‌ای", phonetic: "/kəmˈpəʊzə/" }],
    question: {
      promptEn: "What did Keeper Vance translate into symphonic harmonies?",
      promptFa: "نگهبان فانوس چه چیزی را به هارمونی‌های سمفونیک تبدیل کرده بود؟",
      options: ["Ocean tides", "Train whistles", "Birds singing"],
      correctIndex: 0,
      hintSnippet: "translated ocean tides into symphonic harmonies",
      clueFa: "جزر و مدهای اقیانوس را به ملودی موسیقی تبدیل کرده بود.",
    },
    choiceA: {
      labelEn: "Publish Keeper Vance's 'Lighthouse Symphony' for the town orchestra!",
      labelFa: "سمفونی فانوس دریایی را برای اجرای ارکستر شهر منتشر کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Perform the oceanic melody on the lighthouse observation piano!",
      labelFa: "ملودی اقیانوس را با پیانوی بالای برج فانوس بنوازید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Ranger Evans arrived with two senior historians from the state museum. Together, they inventoried seventy gold sovereign coins that had been preserved to aid distressed sailors.",
    keywords: [{ word: "inventoried", meaningFa: "فهرست‌برداری و ثبت رسمی کردند", phonetic: "/ˈɪnvəntrid/" }],
    question: {
      promptEn: "What had the seventy gold coins been preserved for originally?",
      promptFa: "هفتاد سکه طلای سلطنتی در اصل برای چه مقصودی نگهداری شده بودند؟",
      options: ["To aid distressed sailors", "To buy luxury clothes", "To build a summer castle"],
      correctIndex: 0,
      hintSnippet: "had been preserved to aid distressed sailors",
      clueFa: "برای کمک‌رسانی به ملوانان و دریانوردان آسیب‌دیده بود.",
    },
    choiceA: {
      labelEn: "Establish the 'Vance Foundation' to fund modern coastal rescues!",
      labelFa: "بنیاد ونس را برای حمایت از نجات‌یافتگان دریایی تأسیس کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Display the coins in a bulletproof glass exhibit at the lighthouse!",
      labelFa: "سکه‌ها را درون ویترین شیشه‌ای ضدگلوله در فانوس به نمایش بگذارید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The University Maritime Department awarded Nora and Leo research fellowships after reviewing the pristine Victorian peace documents and authenticated letters.",
    keywords: [{ word: "fellowships", meaningFa: "بورسیه‌های پژوهشی ارزشمند", phonetic: "/ˈfeləʊʃɪps/" }],
    question: {
      promptEn: "What did the University Maritime Department award the siblings?",
      promptFa: "دپارتمان دریانوردی دانشگاه چه چیزی به خواهر و برادر اعطا کرد؟",
      options: ["Research fellowships", "Free train tickets", "A pair of leather boots"],
      correctIndex: 0,
      hintSnippet: "awarded Nora and Leo research fellowships",
      clueFa: "بورسیه‌های پژوهشی ارزشمند برای مطالعه اسناد تاریخی.",
    },
    choiceA: {
      labelEn: "Deliver the keynote address at the International Maritime Gala!",
      labelFa: "سخنرانی افتتاحیه همایش بین‌المللی دریانوردی را ایراد کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Co-author an illustrated book about the secret lighthouse letters!",
      labelFa: "کتاب مصوری درباره رازهای نامه‌های پنهان فانوس دریایی تالیف کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Leo tapped out a greeting in Morse code. Instantly, an antique brass bell in the lighthouse tower echoed with a crisp electronic response: 'SIGNAL VERIFIED 1888'.",
    keywords: [{ word: "verified", meaningFa: "تایید و احراز هویت شد", phonetic: "/ˈverɪfaɪd/" }],
    question: {
      promptEn: "What words echoed from the verified signal?",
      promptFa: "چه کلماتی از سیگنال تاییدشده طنین‌انداز شد؟",
      options: ["'SIGNAL VERIFIED 1888'", "'SYSTEM OFFLINE'", "'PLEASE LEAVE'"],
      correctIndex: 0,
      hintSnippet: "echoed with a crisp electronic response: 'SIGNAL VERIFIED 1888'",
      clueFa: "پیام تایید سیگنال ۱۸۸۸ روی زنگوله ظاهر شد.",
    },
    choiceA: {
      labelEn: "Restore the historic telegraph system as a permanent visitor interactive exhibit!",
      labelFa: "سیستم تلگراف تاریخی را به عنوان بخش تعاملی موزه فانوس راه‌اندازی کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Send the final victory message: 'GUARDIANS OF THE SHORE STAND READY'!",
      labelFa: "آخرین پیام تلگرافی را با عنوان «نگهبانان ساحل آماده‌اند» مخابره کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The telegraph log detailed how Keeper Vance used coded light signals to warn merchant convoys away from enemy raiders during the dark coastal storms of eighteen-ninety.",
    keywords: [{ word: "convoys", meaningFa: "کاروان‌ها و ناوگان‌های کشتی‌ها", phonetic: "/ˈkɒnvɔɪz/" }],
    question: {
      promptEn: "What did Keeper Vance warn merchant ships away from?",
      promptFa: "نگهبان فانوس کشتی‌های تجاری را از چه خطری دور می‌کرد؟",
      options: ["Enemy raiders and dark coastal storms", "Giant sea turtles", "Friendly fishing boats"],
      correctIndex: 0,
      hintSnippet: "warn merchant convoys away from enemy raiders during the dark coastal storms",
      clueFa: "از دست‌اندازی راهزنان دریایی و صخره‌های طوفانی.",
    },
    choiceA: {
      labelEn: "Honor Vance's heroism with a memorial bronze plaque at the cliff summit!",
      labelFa: "فداکاری ناخدا ونس را با تندیس برنزی یادبود در بالای صخره گرامی بدارید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Dedicate the lighthouse foghorn in Keeper Vance's memory!",
      labelFa: "بوق مه‌شکن فانوس دریایی را به یاد او به صدا درآورید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The State Maritime Museum placed the 1888 navigation charts in their grand rotunda. A gilded plaque dedicated the exhibition to Nora and Leo's brilliant deductive curiosity.",
    keywords: [{ word: "rotunda", meaningFa: "سالن گرد و گنبددار مرکزی موزه", phonetic: "/rəʊˈtʌndə/" }],
    question: {
      promptEn: "Where were the historic sea charts placed?",
      promptFa: "نقشه‌های تاریخی در کدام قسمت موزه قرار گرفتند؟",
      options: ["In the grand rotunda", "In the dark basement", "In the cafeteria kitchen"],
      correctIndex: 0,
      hintSnippet: "placed the 1888 navigation charts in their grand rotunda",
      clueFa: "در تالار گنبددار و مجلل مرکزی موزه.",
    },
    choiceA: {
      labelEn: "Cut the ceremonial ribbon opening the 'Vance Maritime Gallery'!",
      labelFa: "روبان افتتاح نگارخانه تاریخی ونس را قیچی کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Host a maritime lecture for young student explorers across the country!",
      labelFa: "یک کارگاه کاوشگری دریایی برای دانش‌آموزان کشور برگزار کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Equipped with the original charts, Nora and Leo sailed toward the outer reef, finding the submerged coral garden exactly where Keeper Vance had sketched it over a century ago.",
    keywords: [{ word: "coral", meaningFa: "مرجانی و صخره‌های دریایی رنگارنگ", phonetic: "/ˈkɒrəl/" }],
    question: {
      promptEn: "What did the siblings find exactly where Keeper Vance sketched it?",
      promptFa: "خواهر و برادر دقیقاً در جایی که نگهبان کشیده بود چه چیزی یافتند؟",
      options: ["A submerged coral garden", "A modern oil rig", "A floating rubber ball"],
      correctIndex: 0,
      hintSnippet: "finding the submerged coral garden exactly where Keeper Vance had sketched it",
      clueFa: "باغ شگفت‌انگیز مرجانی در اعماق آب.",
    },
    choiceA: {
      labelEn: "Declare the outer reef a protected marine sanctuary!",
      labelFa: "صخره‌های مرجانی را منطقه حفاظت‌شده دریایی اعلام کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Photograph the iridescent sea turtles gliding across the reef!",
      labelFa: "از لاک‌پشت‌های دریایی درخشان که روی صخره‌ها شنا می‌کنند عکس بگیرید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Greenwich Royal Observatory confirmed that the chronometer had lost only two seconds over one hundred and thirty-eight years, setting an international record for precision mechanics.",
    keywords: [{ word: "chronometer", meaningFa: "کرونومتر فوق‌دقیق دریانوردی", phonetic: "/krəˈnɒmɪtə/" }],
    question: {
      promptEn: "How many seconds had the chronometer lost over 138 years?",
      promptFa: "کرونومتر پس از ۱۳۸ سال فقط چند ثانیه عقب افتاده بود؟",
      options: ["Only two seconds", "Three whole days", "More than six hours"],
      correctIndex: 0,
      hintSnippet: "had lost only two seconds over one hundred and thirty-eight years",
      clueFa: "فقط دو ثانیه در طول بیش از صد سال!",
    },
    choiceA: {
      labelEn: "Receive the Royal Horological Society's Gold Medal for Conservation!",
      labelFa: "مدال طلای انجمن ساعت‌شناسی سلطنتی را برای حفاظت از این شاهکار دریافت کنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Return the chronometer to the lighthouse dome to run forever!",
      labelFa: "کرونومتر را به گنبد برج بازگردانید تا تا ابد کار کند!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The chime of the historic marine clock rang out across Gull Rock with crystal clarity. The sweet metallic resonance brought tears of nostalgic joy to the oldest fishermen on the pier.",
    keywords: [{ word: "resonance", meaningFa: "طنین و ارتعاش دلنشین صدا", phonetic: "/ˈrezənəns/" }],
    question: {
      promptEn: "Who wept tears of nostalgic joy upon hearing the clock chime?",
      promptFa: "چه کسانی با شنیدن طنین زنگ ساعت اشک شوق ریختند؟",
      options: ["The oldest fishermen on the pier", "A flock of seagulls", "The city accountants"],
      correctIndex: 0,
      hintSnippet: "brought tears of nostalgic joy to the oldest fishermen on the pier",
      clueFa: "ماهیگیران کهنسال اسکله که خاطرات کودکی‌شان زنده شد.",
    },
    choiceA: {
      labelEn: "Ring the clock every evening at sunset to guide homecoming boats!",
      labelFa: "ساعت را هر غروب برای خوش‌آمد به قایق‌های صیادی به صدا درآورید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Celebrate on the pier with a traditional coastal seafood festival!",
      labelFa: "روی اسکله با یک ضیافت غذاهای دریایی سنتی جشن بگیرید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The archaeological dive team arrived with research vessels and sonic scanners. Their live sonar monitors immediately outlined the timber hull of *The Sea Falcon*, preserved under coral.",
    keywords: [{ word: "archaeological", meaningFa: "باستان‌شناسی و کاوش کهن", phonetic: "/ˌɑːkiəˈlɒdʒɪkl/" }],
    question: {
      promptEn: "What did the live sonar monitors outline under the coral?",
      promptFa: "دستگاه‌های سونار چه چیزی را زیر صخره‌های مرجانی ترسیم کردند؟",
      options: ["The timber hull of The Sea Falcon", "A submerged submarine", "A pile of discarded tires"],
      correctIndex: 0,
      hintSnippet: "outlined the timber hull of The Sea Falcon, preserved under coral",
      clueFa: "بدنه چوبی کشتی کهن شاهین دریا.",
    },
    choiceA: {
      labelEn: "Stream the live underwater exploration to classrooms worldwide!",
      labelFa: "کاوش زنده زیرآبی را برای مدارس سراسر جهان پخش کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Publish the dive discoveries in National Geographic Ocean Expedition!",
      labelFa: "اکتشافات غواصی را در نشریه معتبر نشنال جئوگرافیک منتشر کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The underwater drone captured pristine 4K footage of the sunken vessel: schools of luminescent fish darted between the coral-encrusted brass compasses and navigation wheels.",
    keywords: [{ word: "luminescent", meaningFa: "درخشان و شب‌تاب در تاریکی", phonetic: "/ˌluːmɪˈnesnt/" }],
    question: {
      promptEn: "What was darting between the coral-encrusted brass compasses?",
      promptFa: "چه جانورانی در میان قطب‌نماهای پوشیده از مرجان شنا می‌کردند؟",
      options: ["Schools of luminescent fish", "Curious sea crabs", "Sleeping sharks"],
      correctIndex: 0,
      hintSnippet: "schools of luminescent fish darted between the coral-encrusted brass compasses",
      clueFa: "دسته‌های ماهیان شب‌تاب و درخشان.",
    },
    choiceA: {
      labelEn: "Win the International Wildlife Documentary Prize for the reef footage!",
      labelFa: "جایزه بین‌المللی مستند حیات‌وحش را برای این تصاویر کسب کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Build a virtual reality interactive tour of the shipwreck for the local museum!",
      labelFa: "یک تور واقعیت مجازی از لاشه کشتی برای موزه شهر بسازید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Three deep metallic rings from the bronze ship bell rolled across the cove. Far across the headland, three coastal lighthouses flashed their beacons in an ancient, respectful salute.",
    keywords: [{ word: "headland", meaningFa: "دماغه و صخره پیش‌آمده در دریا", phonetic: "/ˈhedlənd/" }],
    question: {
      promptEn: "What did the three distant lighthouses do in response to the bell?",
      promptFa: "سه فانوس دریایی دوردست در پاسخ به صدای زنگ چه کردند؟",
      options: ["Flashed their beacons in an ancient salute", "Turned off completely", "Sounded loud warning sirens"],
      correctIndex: 0,
      hintSnippet: "three coastal lighthouses flashed their beacons in an ancient, respectful salute",
      clueFa: "نورهای فانوس‌ها را به نشانه ادای احترام کهن روشن و خاموش کردند.",
    },
    choiceA: {
      labelEn: "Light the Victorian lighthouse flame in solemn brotherhood with the coast!",
      labelFa: "مشعل کهن فانوس را به نشانه همبستگی با تمام سواحل روشن کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Hold a seaside candlelit ceremony for all seafaring heroes of the past!",
      labelFa: "مراسم یادبود شمع‌آجین در ساحل برای قهرمانان دریانورد برپا کنید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Cleaned and polished to a bright golden shine, *The Sea Falcon*'s bronze bell was mounted at the lighthouse gate, welcoming future generations of maritime lovers.",
    keywords: [{ word: "polished", meaningFa: "صیقل خورده و درخشان شده", phonetic: "/ˈpɒlɪʃt/" }],
    question: {
      promptEn: "Where was the polished bronze bell permanently mounted?",
      promptFa: "زنگ برنزی صیقل‌خورده در کجا برای همیشه نصب شد؟",
      options: ["At the lighthouse gate", "Inside a private bank vault", "On top of a radio antenna"],
      correctIndex: 0,
      hintSnippet: "was mounted at the lighthouse gate, welcoming future generations",
      clueFa: "در ورودی فانوس دریایی نصب شد تا به بازدیدکنندگان خوش‌آمد بگوید.",
    },
    choiceA: {
      labelEn: "Ring the welcome bell to officially reopen the lighthouse heritage park!",
      labelFa: "زنگ را برای بازگشایی رسمی پارک میراث فرهنگی فانوس دریایی به صدا درآورید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Engrave Nora and Leo's names as honorary Guardians of the Coast!",
      labelFa: "نام نورا و لئو را به عنوان نگهبانان افتخاری ساحل روی دروازه ثبت کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Heirloom of the Deep", titleFa: "میراث طلایی اعماق", badgeCategory: "legendary", badgeIcon: "🧭", badgeNameFa: "پایان خانوادگی و جاودان", climaxEn: "Holding Keeper Vance's gold pocket compass, Nora and Leo realize that real courage runs in their blood.", climaxFa: "با در دست داشتن قطب‌نمای طلایی ناخدا ونس، نورا و لئو فهمیدند شجاعت واقعی در رگ‌هایشان جریان دارد.", xpReward: 230 },
  { pathCode: "AAAAB", titleEn: "The Society's Grand Donors", titleFa: "بخشندگان بزرگ تاریخ", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان پرافتخار و علمی", climaxEn: "The state historical society puts their portrait beside Keeper Vance's in the central grand hall.", climaxFa: "انجمن تاریخ ایالتی پرتره این دو نوجوان را کنار عکس ناخدا ونس در تالار اصلی نصب کرد.", xpReward: 210 },
  { pathCode: "AAABA", titleEn: "The Guarded Sea Archive", titleFa: "آرشیو مخفی زیرزمینی", badgeCategory: "explorer", badgeIcon: "⛵", badgeNameFa: "پایان کاوشگرانه", climaxEn: "The subterranean boathouse reveals centuries of navigational secrets safely preserved from the sea.", climaxFa: "اسکله غاری دست‌نخورده قرن‌ها اسرار ناوبری کهن را از گزند امواج طوفانی حفظ کرده بود.", xpReward: 220 },
  { pathCode: "AAABB", titleEn: "Tides in Four Movements", titleFa: "سمفونی چهارگانه امواج", badgeCategory: "scholar", badgeIcon: "🎼", badgeNameFa: "پایان هنری و رویایی", climaxEn: "Keeper Vance's tidal symphony is performed by seventy musicians at the Sydney Opera House.", climaxFa: "سمفونی امواج ناخدا ونس توسط هفتاد نوازنده در تالار بزرگ موسیقی اجرا شد و همه را مبهوت کرد.", xpReward: 240 },
  { pathCode: "AABAA", titleEn: "The Vance Foundation", titleFa: "بنیاد نجات‌بخشی ونس", badgeCategory: "heroic", badgeIcon: "🛡️", badgeNameFa: "پایان بشردوستانه", climaxEn: "The newly minted rescue fund equips six modern lifeboats that save twelve fishermen in their first month.", climaxFa: "بنیاد امدادی تأسیس‌شده شش قایق نجات جدید خرید که در ماه اول جان ۱۲ صیاد را نجات دادند.", xpReward: 250 },
  { pathCode: "AABAB", titleEn: "The Bulletproof Sovereign", titleFa: "سکه‌های طلای سلطنتی", badgeCategory: "legendary", badgeIcon: "🪙", badgeNameFa: "پایان درخشان و باستانی", climaxEn: "The glass-enclosed gold sovereigns become the town's most visited historical landmark.", climaxFa: "سکه‌های زرین پشت شیشه ضدگلوله به پربازدیدترین نماد تاریخی شهر ساحلی تبدیل شدند.", xpReward: 225 },
  { pathCode: "AABBA", titleEn: "Keynote of the Coast", titleFa: "سخنرانی در گرند گالا", badgeCategory: "scholar", badgeIcon: "🎤", badgeNameFa: "پایان دانشگاهی ممتاز", climaxEn: "Nora delivers a stunning presentation on maritime codes, receiving standing applause from admirals.", climaxFa: "سخنرانی نورا درباره رمزهای دریایی تشویق ایستاده دریاسالاران و تاریخ‌نگاران را به همراه داشت.", xpReward: 235 },
  { pathCode: "AABBB", titleEn: "The Bestselling Secret", titleFa: "کتاب پرفروش اسرار فانوس", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان نویسندگی موفق", climaxEn: "Their illustrated chronicle of the 1888 lighthouse mystery tops non-fiction bestseller charts.", climaxFa: "کتاب مصور آنها درباره معمای سال ۱۸۸۸ فانوس دریایی به پرفروش‌ترین کتاب تاریخی سال تبدیل شد.", xpReward: 215 },
  { pathCode: "ABAAA", titleEn: "The Telegraph Network Reborn", titleFa: "تولّد دوباره تلگراف کهن", badgeCategory: "explorer", badgeIcon: "⚡", badgeNameFa: "پایان فنی و تاریخی", climaxEn: "Visitors from around the globe send vintage Morse code greetings along the restored Victorian wire.", climaxFa: "بازدیدکنندگان از سراسر جهان پیام‌های مورس خود را با سیم‌های تاریخی تلگراف ارسال می‌کنند.", xpReward: 220 },
  { pathCode: "ABAAB", titleEn: "Guardians of the Shore", titleFa: "پاسداران شجاع ساحل", badgeCategory: "heroic", badgeIcon: "🌊", badgeNameFa: "پایان حماسی", climaxEn: "The final telegraph confirms that courage and vigilance remain alive on the rocky headland.", climaxFa: "آخرین مخابره تلگرافی نشان داد شجاعت و هوشیاری هنوز در صخره‌های ساحلی زنده و پابرجا است.", xpReward: 230 },
  { pathCode: "ABABA", titleEn: "The Cliffside Memorial", titleFa: "تندیس برنزی بر فراز صخره", badgeCategory: "legendary", badgeIcon: "🗿", badgeNameFa: "پایان ماندگار و باشکوه", climaxEn: "A bronze statue of Keeper Vance with his brass telescope looks out across the peaceful waters.", climaxFa: "تندیس برنزی ناخدا ونس با تلسکوپش برای همیشه رو به آب‌های نیلگون اقیانوس ایستاده است.", xpReward: 245 },
  { pathCode: "ABABB", titleEn: "Voice of the Foghorn", titleFa: "طنین پرشکوه مه‌شکن", badgeCategory: "heroic", badgeIcon: "📢", badgeNameFa: "پایان پرصلابت", climaxEn: "The restored foghorn sounds its deep bass roar, echoing across forty miles of ocean waves.", climaxFa: "صدای بم و پرصلابت مه‌شکن بازسازی‌شده تا چهل مایل روی امواج اقیانوس طنین انداخت.", xpReward: 210 },
  { pathCode: "ABBAA", titleEn: "The Vance Maritime Gallery", titleFa: "نگارخانه دائمی ونس", badgeCategory: "legendary", badgeIcon: "🖼️", badgeNameFa: "پایان باشکوه موزه‌ای", climaxEn: "Governor cuts the ceremonial gold ribbon, declaring the lighthouse a national treasure.", climaxFa: "استاندار روبان طلایی را قیچی کرد و فانوس دریایی را به عنوان گنجینه ملی رسمی ثبت نمود.", xpReward: 250 },
  { pathCode: "ABBAB", titleEn: "The Young Explorers' Academy", titleFa: "آکادمی کاشفان نوجوان", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان آموزشی و الهام‌بخش", climaxEn: "Two hundred young students attend Nora and Leo's first coastal navigation workshop.", climaxFa: "دویست دانش‌آموز نوجوان در اولین کارگاه ناوبری و کاوشگری دریایی خواهر و برادر شرکت کردند.", xpReward: 215 },
  { pathCode: "ABBBA", titleEn: "The Sanctuary of Emerald Reef", titleFa: "پناهگاه صخره زمرد", badgeCategory: "explorer", badgeIcon: "🐠", badgeNameFa: "پایان زیست‌محیطی برتر", climaxEn: "The newly protected reef thrives, becoming home to rare luminescent sea life and playful dolphins.", climaxFa: "صخره‌های مرجانی احیا شدند و به پناهگاه امن دلفین‌ها و ماهیان شب‌تاب تبدیل شدند.", xpReward: 240 },
  { pathCode: "ABBBB", titleEn: "The Gliding Turtles of Vance", titleFa: "لاک‌پشت‌های درخشان ونس", badgeCategory: "explorer", badgeIcon: "🐢", badgeNameFa: "پایان عکاسی طبیعت", climaxEn: "Leo's turtle photograph wins the grand cover of International Nature Photography Magazine.", climaxFa: "عکس زیبای لئو از لاک‌پشت‌های صخره مرجانی روی جلد مجله بین‌المللی عکاسی طبیعت رفت.", xpReward: 205 },
  { pathCode: "BAAAA", titleEn: "The Record of Precision", titleFa: "رکورد جهانی دقت زمان", badgeCategory: "scholar", badgeIcon: "⏱️", badgeNameFa: "پایان علمی و مکانیکی", climaxEn: "Horologists celebrate the 1888 chronometer as the greatest maritime timekeeper in existence.", climaxFa: "ساعت‌شناسان دنیا کرونومتر ۱۸۸۸ را دقیق‌ترین زمان‌سنج دریایی دست‌ساز تاریخ نامیدند.", xpReward: 235 },
  { pathCode: "BAAAB", titleEn: "The Eternal Pendulum", titleFa: "پاندول جاودانه برج", badgeCategory: "legendary", badgeIcon: "🕰️", badgeNameFa: "پایان اسرارآمیز و ابدی", climaxEn: "In the glass dome above the waves, the brass pendulum sways with timeless mechanical grace.", climaxFa: "زیر گنبد شیشه‌ای بالای امواج، پاندول برنجی با وقاری جاودانه به حرکتش ادامه داد.", xpReward: 240 },
  { pathCode: "BAABA", titleEn: "The Sunset Chime", titleFa: "نوای خاطره‌انگیز غروب", badgeCategory: "scholar", badgeIcon: "🌅", badgeNameFa: "پایان احساسی و آرامش‌بخش", climaxEn: "Every evening at twilight, the melodious chime reminds sailors that home is always waiting.", climaxFa: "هر غروب نوای دلنشین ساعت به صیادان یادآوری می‌کند که ساحل امن خانه در انتظار آنهاست.", xpReward: 215 },
  { pathCode: "BAABB", titleEn: "Feast of the Golden Tide", titleFa: "جشنواره طلایی اسکله", badgeCategory: "funny", badgeIcon: "🦞", badgeNameFa: "پایان شاد و مردمی", climaxEn: "The whole town celebrates with grilled seafood, music, and laughter under twinkling dock lights.", climaxFa: "تمام اهالی شهر با موسیقی سنتی، غذاهای لذیذ دریایی و خنده در روشنایی اسکله جشن گرفتند.", xpReward: 200 },
  { pathCode: "BABAA", titleEn: "Sonar of the Deep", titleFa: "امواج سونار در اعماق", badgeCategory: "explorer", badgeIcon: "📡", badgeNameFa: "پایان مدرن اقیانوس‌شناسی", climaxEn: "Classrooms across sixty countries watch live as robots gently survey *The Sea Falcon*.", climaxFa: "کلاس‌های درس در ۶۰ کشور جهان نقشه زنده ربات‌های کاوشگر از بدنه کشتی را تماشا کردند.", xpReward: 245 },
  { pathCode: "BABAB", titleEn: "The National Geographic Story", titleFa: "روایت نشنال جئوگرافیک", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان معتبر بین‌المللی", climaxEn: "The thirty-page expedition article inspires millions of young minds to study marine history.", climaxFa: "گزارش سی‌صفحه‌ای اختصاصی الهام‌بخش میلیون‌ها نوجوان برای کشف رازهای ناشناخته زمین شد.", xpReward: 250 },
  { pathCode: "BABBA", titleEn: "The Documentary of the Year", titleFa: "مستند برگزیده سال", badgeCategory: "explorer", badgeIcon: "🎬", badgeNameFa: "پایان سینمایی درخشان", climaxEn: "The stunning 4K deep-sea film receives the Golden Whale Trophy at the London Film Awards.", climaxFa: "فیلم خیره‌کننده ۴K اعماق دریا جایزه نهنگ طلایی جشنواره بین‌المللی لندن را از آن خود کرد.", xpReward: 230 },
  { pathCode: "BABBB", titleEn: "The VR Shipwreck Experience", titleFa: "تجربه واقعیت مجازی کشتی", badgeCategory: "scholar", badgeIcon: "🥽", badgeNameFa: "پایان فناوری و نوآوری", climaxEn: "Thousands of museum visitors swim through the virtual reef alongside glowing schools of fish.", climaxFa: "هزاران بازدیدکننده موزه با عینک‌های واقعیت مجازی کنار ماهیان شب‌تاب در کشتی غرق‌شده شنا کردند.", xpReward: 220 },
  { pathCode: "BBAAA", titleEn: "The Beacon of Brotherhood", titleFa: "مشعل همبستگی سواحل", badgeCategory: "legendary", badgeIcon: "🔥", badgeNameFa: "پایان حماسی و باستانی", climaxEn: "The four great coastal lighthouses burn together in unity for the first time in ninety years.", climaxFa: "چهار فانوس بزرگ ساحلی برای اولین بار در ۹۰ سال گذشته با نوری متحد و پرشکوه درخشیدند.", xpReward: 250 },
  { pathCode: "BBAAB", titleEn: "The Vigil of the Shore", titleFa: "شمع‌های یادبود ساحل", badgeCategory: "scholar", badgeIcon: "🕯️", badgeNameFa: "پایان عاطفی و معنوی", climaxEn: "A thousand candles float on the calm night water, honoring generations of brave seafarers.", climaxFa: "هزار شمع روشن روی آب‌های آرام شناور شدند تا یاد نسل‌های شجاع دریانوردان را زنده دارند.", xpReward: 210 },
  { pathCode: "BBABA", titleEn: "The Heritage Park Opening", titleFa: "افتتاح پارک میراث فانوس", badgeCategory: "heroic", badgeIcon: "🏞️", badgeNameFa: "پایان پرنشاط عمومی", climaxEn: "The restored Victorian lighthouse park opens its gates, welcoming hikers, families, and dreamers.", climaxFa: "پارک گردشگری تاریخی فانوس افتتاح شد و میزبان هزاران خانواده، کوهنورد و گردشگر شد.", xpReward: 225 },
  { pathCode: "BBABB", titleEn: "Guardians of Gull Rock", titleFa: "نگهبانان صخره مرغان دریایی", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان جاویدان افتخار", climaxEn: "Nora and Leo's names are carved forever in bronze at the portal of the great ocean beacon.", climaxFa: "نام نورا و لئو برای همیشه بر لوح برنزی دروازه ورودی فانوس بزرگ اقیانوس حک شد.", xpReward: 250 },
  { pathCode: "BBBAA", titleEn: "The Echo Across Decades", titleFa: "طنین در گذر دهه‌ها", badgeCategory: "scholar", badgeIcon: "🔔", badgeNameFa: "پایان نوستالژیک", climaxEn: "The bronze chime of *The Sea Falcon* rings true and clear, linking past courage with future dreams.", climaxFa: "صدای زنگ برنزی شاهین دریا، شجاعت گذشته را به رویاهای فردای نسل نو پیوند زد.", xpReward: 230 },
  { pathCode: "BBBAB", titleEn: "The Falcon's Rest", titleFa: "آرامش ابدی شاهین دریا", badgeCategory: "explorer", badgeIcon: "🦅", badgeNameFa: "پایان باوقار دریانوردی", climaxEn: "With its mystery solved and bell preserved, the historic vessel rests in peace beneath the blue.", climaxFa: "با کشف رازها و حفظ زنگ تاریخی، کشتی کهن در آرامش نیلگون اقیانوس آرام گرفت.", xpReward: 220 },
  { pathCode: "BBBBA", titleEn: "The Navigators' Oath", titleFa: "عهدنامه ناوبری اقیانوس", badgeCategory: "heroic", badgeIcon: "📜", badgeNameFa: "پایان پیمان جوانمردی", climaxEn: "Young cadets take their solemn oath beside the restored bell, promising to protect all life at sea.", climaxFa: "دانشجویان جوان دریانوردی کنار زنگ تاریخی سوگند یاد کردند تا پاسدار جان انسان‌ها در دریا باشند.", xpReward: 240 },
  { pathCode: "BBBBB", titleEn: "The Eternal Lighthouse", titleFa: "فانوس دریایی جاودان", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان اسطوره‌ای و نهایی", climaxEn: "The golden pulse of Gull Rock shines every foggy night, a reminder that mysteries await those who seek.", climaxFa: "نور طلایی فانوس صخره هر شب مه‌آلود می‌تابد و یادآور این است که رازها در انتظار کاوشگران شجاع‌اند.", xpReward: 250 },
];

export const story2LighthouseCipher: AdventureStory = buildAdventureStory({
  id: "b1-lighthouse-cipher",
  storyIndex: 2,
  cefr: "B1",
  titleEn: "The Lighthouse Keeper's Cipher",
  titleFa: "رمز و راز فانوس دریایی متروکه",
  genre: "mystery",
  genreLabelFa: "🔍 معمایی و کنجکاوی",
  genreIcon: "🔍",
  synopsisEn:
    "Nora and Leo discover a brass cipher wheel inside an abandoned coastal lighthouse. Crack coded journals and secret coastal caves across 32 mysterious endings!",
  synopsisFa:
    "نورا و لئو در یک عصر مه‌آلود، در فانوس دریایی قدیمی صخره مرغان دریایی، یک چرخ‌دنده رمزی برنجی و دفترچه‌ای با کدهای مورس پیدا می‌کنن! آیا راز اسناد تاریخی و کشتی غرق‌شده رو کشف می‌کنی؟ ۳۲ پایان معمایی و هیجان‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b1-lighthouse-cipher.webp",
  nodes,
  endings,
});
