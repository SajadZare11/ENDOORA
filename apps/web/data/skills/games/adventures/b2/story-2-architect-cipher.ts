import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2 (B2 - Adult): The Palazzo's Hidden Blueprint (راز پنهان عمارت قدیمی ونتیا)
// Genre: Mystery & Curiosity (معمایی و کنجکاوی)
// CEFR: B2 (Passive voice, 3rd/mixed conditionals, past deduction modals, architectural B2 vocab)
// Characters: Elena (Restoration Architect), Marco (Archivist), Inspector Vane
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Elena had been overseeing the delicate structural conservation of Palazzo Morosini, a fifteenth-century Venetian manor situated along the Grand Canal. While peeling away layers of water-damaged nineteenth-century plaster in the palazzo's subterranean wine cellar, she detected an anomaly in the masonry: a circular limestone seal engraved with the Latin phrase *'Aqua Regnat Sub Terra'*. Behind the loose stones lay a cylindrical copper vault containing a vellum architectural blueprint, depicting an unmapped network of vaulted hydraulic canals running deep beneath the city's foundations.",
    keywords: [
      { word: "conservation", meaningFa: "حفاظت و مرمت آثار تاریخی", phonetic: "/ˌkɒnsəˈveɪʃn/" },
      { word: "subterranean", meaningFa: "زیرزمینی و مدفون در دل زمین", phonetic: "/ˌsʌbtəˈreɪniən/" },
      { word: "masonry", meaningFa: "بنایی، آجرچینی و سنگ‌کاری ساختمانی", phonetic: "/ˈmeɪsənri/" },
      { word: "vellum", meaningFa: "پوست مرغوب حیوانی ویژه اسناد کهن", phonetic: "/ˈveləm/" },
    ],
    question: {
      promptEn: "What did the vellum architectural blueprint depict?",
      promptFa: "نقشه معماری پوستی کهن چه چیزی را به تصویر کشیده بود؟",
      options: [
        "An unmapped network of vaulted hydraulic canals beneath the city",
        "A treasure map leading to the Caribbean islands",
        "A drawing of a renaissance festival costume",
      ],
      correctIndex: 0,
      hintSnippet: "depicting an unmapped network of vaulted hydraulic canals running deep beneath the city's foundations",
      clueFa: "خط آخر رو نگاه کن دوست من؛ شبکه نقشه‌برداری‌نشده‌ای از کانال‌های طاق‌دار زیربنایی شهر ونیز.",
    },
    choiceA: {
      labelEn: "Decipher the geometric Latin compass symbols drawn in the margins!",
      labelFa: "نمادهای هندسی و قطب‌نمای لاتین در حاشیه نقشه رو رمزگشایی کن!",
      descriptionFa: "شاید مکان کلید و سازوکار ورودی کانال‌های مخفی رو نشان بده.",
    },
    choiceB: {
      labelEn: "Consult the State Archives with Marco to identify the master architect!",
      labelFa: "با همراهی مارکو به آرشیو ملی برو تا معمار سازنده این شاهکار رو شناسایی کنی!",
      descriptionFa: "بررسی اسناد تاریخی قرن پانزدهم رازهای سیاسی پشت این بنا رو فاش می‌کنه.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Using a high-precision digital caliper, Elena measured the compass bearings sketched along the margins. The mathematical ratios aligned precisely with the palazzo's marble courtyard sundial. When she tapped the third bronze quadrant at high noon, an iron counterbalance within the central well shifted with a resonant groan. The flagstones beneath the courtyard fountain parted, unveiling a spiral marble staircase descending directly into the water-level catacombs.",
    keywords: [
      { word: "caliper", meaningFa: "کولیس اندازه‌گیری دقیق مهندسی", phonetic: "/ˈkælɪpə/" },
      { word: "counterbalance", meaningFa: "وزنه تعادل مکانیکی", phonetic: "/ˈkaʊntəbæləns/" },
      { word: "flagstones", meaningFa: "سنگ‌فرش‌های تخت و بزرگ کف حیاط", phonetic: "/ˈflæɡstəʊnz/" },
      { word: "catacombs", meaningFa: "دخمه‌ها و راهروهای زیرزمینی کهن", phonetic: "/ˈkætəkuːmz/" },
    ],
    question: {
      promptEn: "What opened when the courtyard fountain flagstones parted?",
      promptFa: "وقتی سنگ‌فرش‌های فواره حیاط کنار رفتند چه چیزی نمایان شد؟",
      options: [
        "A spiral marble staircase descending into the water-level catacombs",
        "A deep pit full of salt water",
        "A collapsed cellar full of broken glass",
      ],
      correctIndex: 0,
      hintSnippet: "unveiling a spiral marble staircase descending directly into the water-level catacombs",
      clueFa: "خط آخر رو ببین عزیزم؛ یک پلکان مارپیچ مرمرین به سمت راهروهای زیرزمینی آشکار شد.",
    },
    choiceA: {
      labelEn: "Descend into the illuminated catacombs equipped with headlamps and waterproof gear!",
      labelFa: "با چراغ‌پیشانی و تجهیزات ضدآب از پلکان به سمت دخمه‌های روشن فرود بیا!",
      descriptionFa: "کشف مستقیم شگفتی‌های مهندسی زیر سطح آب دریا.",
    },
    choiceB: {
      labelEn: "Deploy a remote sonar drone to map the flooded passages first!",
      labelFa: "ابتدا پهپاد سونار زیرآبی بفرست تا مسیر کانال‌های غرق‌آب رو نقشه‌برداری کنه!",
      descriptionFa: "ایمنی کامل مهندسی قبل از ورود به دالان‌های ناشناخته.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Marco pulled heavy parchment folios from the climate-controlled vaults of the Archivio di Stato. Under the yellow lamplight, he located the private journals of Fra Giocondo, the visionary Renaissance hydraulic engineer. The records confirmed that in 1509, a secret aqueduct system had been commissioned by the Venetian Senate to preserve the city's freshwater reserves in the event of an offshore naval siege.",
    keywords: [
      { word: "folios", meaningFa: "برگه‌های بزرگ کتاب‌های خطی کهن", phonetic: "/ˈfəʊliəʊz/" },
      { word: "hydraulic", meaningFa: "هیدرولیک و مرتبط با فشار و جریان آب", phonetic: "/haɪˈdrɔːlɪk/" },
      { word: "aqueduct", meaningFa: "آبراهه، قنات و کانال انتقال آب پاک", phonetic: "/ˈækwɪdʌkt/" },
      { word: "siege", meaningFa: "محاصره نظامی شهر از دریا یا خشکی", phonetic: "/siːdʒ/" },
    ],
    question: {
      promptEn: "Why did the Venetian Senate secretly commission the aqueduct in 1509?",
      promptFa: "چرا سنای ونیز در سال ۱۵۰۹ مخفیانه دستور ساخت این آبراهه را صادر کرده بود؟",
      options: [
        "To preserve freshwater reserves in the event of a naval siege",
        "To store luxury silk fabrics from China",
        "To drain all water from the Grand Canal",
      ],
      correctIndex: 0,
      hintSnippet: "to preserve the city's freshwater reserves in the event of an offshore naval siege",
      clueFa: "خط آخر رو نگاه کن؛ برای حفظ ذخایر آب شیرین شهر در صورت محاصره نظامی.",
    },
    choiceA: {
      labelEn: "Locate the primary intake sluice gate along the Rio San Polo canal!",
      labelFa: "دریچه اصلی تنظیم ورود آب (اسلویس گیت) رو در کانال سن پولو پیدا کن!",
      descriptionFa: "ورودی اصلی جریان آب شیرین به این شبکه پنهان.",
    },
    choiceB: {
      labelEn: "Cross-reference the journal sketches with modern satellite radar topography!",
      labelFa: "طرح‌های ژورنال باستانی رو با رادار ماهواره‌ای توپوگرافی امروز مقایسه کن!",
      descriptionFa: "تلفیق دانش ۵۰۰ سال پیش با پیشرفته‌ترین فناوری ماهواره‌ای روز.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Wading through ankle-deep crystalline water, Elena and Marco marveled at the vaulted Istrian stone arches overhead. The masonry was in immaculate condition, unaffected by five centuries of saltwater tides. Embedded along the corridor walls were carved bronze sluice wheels, still interlocking with massive wooden floodgates that regulated canal water levels with uncanny mechanical ingenuity.",
    keywords: [
      { word: "immaculate", meaningFa: "دست‌نخورده، بی‌نقص و پاکیزه", phonetic: "/ɪˈmækjələt/" },
      { word: "sluice", meaningFa: "دریچه کشویی کنترل جریان آب", phonetic: "/sluːs/" },
      { word: "ingenuity", meaningFa: "نبوغ، خلاقیت و ابتکار عمل درخشان", phonetic: "/ˌɪndʒəˈnjuːəti/" },
      { word: "interlocking", meaningFa: "درگیر و چفت‌شده با چرخ‌دنده‌ها", phonetic: "/ˌɪntəˈlɒkɪŋ/" },
    ],
    question: {
      promptEn: "What stone was used for the vaulted arches in the underground corridor?",
      promptFa: "چه سنگی در ساخت طاق‌های زیرزمینی به کار رفته بود؟",
      options: [
        "Istrian stone unaffected by centuries of saltwater tides",
        "Crumbling red mud bricks",
        "Fragile volcanic ash blocks",
      ],
      correctIndex: 0,
      hintSnippet: "vaulted Istrian stone arches overhead. The masonry was in immaculate condition, unaffected by five centuries",
      clueFa: "خط اول رو ببین دوست من؛ سنگ مرغوب ایستریا که قرن‌ها در برابر آب شور مقاوم مانده بود.",
    },
    choiceA: {
      labelEn: "Turn the bronze sluice wheel to test the historic flood-control mechanism!",
      labelFa: "چرخ برنزی تنظیم دریچه رو بچرخون تا کارکرد سیستم باستانی مهار سیلاب رو بسنجی!",
      descriptionFa: "شاید این سازوکار بتواند راهکاری برای بحران مدهای بلند ونیز باشد.",
    },
    choiceB: {
      labelEn: "Document the inscriptions carved into the keystone arch with 3D scanners!",
      labelFa: "کتیبه‌های حک‌شده بر سنگ تاج طاق رو با اسکنر سه‌بعدی مستندنگاری کن!",
      descriptionFa: "ثبت دقیق خطوط برای مطالعات باستان‌شناسی بین‌المللی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The sonar drone navigated smoothly through three hundred meters of submerged aqueducts, sending crystal-clear 4K sonar imagery back to Elena's tablet. The drone breached a dry air pocket beneath the Basilica of San Giovanni, revealing an astonishing octagonal chamber housing sixteen marble cisterns designed to filter rainwater through layers of charcoal and quartz sand.",
    keywords: [
      { word: "cisterns", meaningFa: "آب‌انبارهای بزرگ تصفیه و ذخیره آب", phonetic: "/ˈsɪstənz/" },
      { word: "octagonal", meaningFa: "هشت‌ضلعی هندسی منظم", phonetic: "/ɒkˈtæɡənl/" },
      { word: "charcoal", meaningFa: "زغال فعال طبیعی تصفیه‌کننده", phonetic: "/ˈtʃɑːkəʊl/" },
    ],
    question: {
      promptEn: "How did the ancient marble cisterns filter rainwater?",
      promptFa: "آب‌انبارهای مرمرین باستانی آب باران را چگونه تصفیه می‌کردند؟",
      options: [
        "Through layers of natural charcoal and quartz sand",
        "By boiling it over coal fires",
        "With chemical chlorine tablets",
      ],
      correctIndex: 0,
      hintSnippet: "filter rainwater through layers of charcoal and quartz sand",
      clueFa: "خط آخر رو نگاه کن؛ با لایه‌های زغال طبیعی و ماسه کوارتز بلورین تصفیه می‌کردند.",
    },
    choiceA: {
      labelEn: "Restore the historic filtration chamber to provide sustainable clean water!",
      labelFa: "سیستم تصفیه تاریخی رو برای تأمین آب پاک و پایدار بازسازی کن!",
      descriptionFa: "تلفیق شگفت‌انگیز اکولوژی تاریخی با نیازهای روز شهر ونیز.",
    },
    choiceB: {
      labelEn: "Notify the Ministry of Cultural Heritage to secure the chamber as a sanctuary!",
      labelFa: "وزارت میراث فرهنگی رو مطلع کن تا تالار رو به عنوان اثر ملی حفاظت‌شده ثبت کنه!",
      descriptionFa: "حفاظت قانونی کامل از این شاهکار معماری.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "At low tide along Rio San Polo, Elena located a carved stone lion mask whose mouth served as an overflow drain. When she inserted a customized brass key into the hidden keyway behind the lion's ear, the bronze sluice gate lowered soundlessly on greased counterweights, exposing an ancient dry maintenance tunnel extending beneath the Rialto bridge.",
    keywords: [
      { word: "customized", meaningFa: "شخصی‌سازی‌شده و طراحی‌شده بر اساس الگو", phonetic: "/ˈkʌstəmaɪzd/" },
      { word: "counterweights", meaningFa: "وزنه‌های متعادل‌کننده گرانشی", phonetic: "/ˈkaʊntəweɪts/" },
      { word: "overflow", meaningFa: "سرریز آب", phonetic: "/ˈəʊvəfləʊ/" },
    ],
    question: {
      promptEn: "Where did the dry maintenance tunnel extend beneath?",
      promptFa: "تونل خشک تعمیراتی به زیر کدام بخش تاریخی شهر امتداد داشت؟",
      options: [
        "Beneath the famous Rialto Bridge",
        "Under the airport runway",
        "Beneath an offshore oil rig",
      ],
      correctIndex: 0,
      hintSnippet: "exposing an ancient dry maintenance tunnel extending beneath the Rialto bridge",
      clueFa: "خط آخر رو بخون عزیزم؛ به زیر پل تاریخی و مشهور ریالتو می‌رسید.",
    },
    choiceA: {
      labelEn: "Trek along the Rialto maintenance tunnel to inspect the bridge foundations!",
      labelFa: "از درون تونل ریالتو پیاده برو تا پی و پایه‌های پل کهن رو ارزیابی کنی!",
      descriptionFa: "بررسی استحکام پایه‌های چوبی پل ریالتو که قرن‌ها زیر آب مانده‌اند.",
    },
    choiceB: {
      labelEn: "Take water samples from the subterranean canal to test salinity levels!",
      labelFa: "نمونه‌هایی از آب کانال زیرزمینی برای سنجش میزان شوری و املاح بردار!",
      descriptionFa: "تحلیل آزمایشگاهی کیفیت آب محصور در عمق زمین.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Overlaying satellite ground-penetrating radar with Fra Giocondo's sixteenth-century vellum drawings, Elena spotted an astonishing subterranean alignment: the aqueduct connected the bell towers of four historic churches, utilizing their colossal brick foundations as natural pressure dampeners against rising Adriatic storm surges.",
    keywords: [
      { word: "ground-penetrating", meaningFa: "نفوذکننده در اعماق خاک و سنگ (رادارهای ژئوفیزیکی)", phonetic: "/ɡraʊnd ˈpenɪtreɪtɪŋ/" },
      { word: "dampeners", meaningFa: "تعدیل‌کننده‌ها و مستهلک‌کننده‌های فشار ضربه", phonetic: "/ˈdæmpnəz/" },
      { word: "surges", meaningFa: "امواج خروشان و پیشروی طوفانی آب دریا", phonetic: "/sɜːdʒɪz/" },
    ],
    question: {
      promptEn: "What did the ancient aqueduct utilize the bell towers' foundations as?",
      promptFa: "آبراهه باستانی از پی برج‌های ناقوس کلیساها به عنوان چه چیزی استفاده می‌کرد؟",
      options: [
        "Natural pressure dampeners against rising storm surges",
        "Bell storage rooms",
        "Emergency gold vaults",
      ],
      correctIndex: 0,
      hintSnippet: "utilizing their colossal brick foundations as natural pressure dampeners against rising Adriatic storm surges",
      clueFa: "خط آخر رو ببین؛ به عنوان تعدیل‌کننده‌های طبیعی فشار در برابر مدهای طوفانی آدریاتیک.",
    },
    choiceA: {
      labelEn: "Propose integrating the historic pressure dampeners into Venice's modern flood defenses!",
      labelFa: "پیشنهاد ادغام این مستهلک‌کننده‌های تاریخی رو در پروژه سد متحرک ونیز مطرح کن!",
      descriptionFa: "پیوند شاهکار رنسانس با مهندسی قرن بیست و یکم برای نجات شهر.",
    },
    choiceB: {
      labelEn: "Present the findings to the International Architectural Conservation Congress!",
      labelFa: "یافته‌ها رو در کنگره بین‌المللی حفاظت معماری در رم ارائه بده!",
      descriptionFa: "ثبت جهانی نبوغ معماری رنسانس در معتبرترین محافل علمی.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "With a satisfying mechanical rumble, the bronze sluice wheel engaged a hidden series of wooden gear trains. Across the subterranean gallery, massive counterweighted stone gates descended smoothly into the channel, diverting rushing canal water away from vulnerable building foundations with clockwork precision.",
    keywords: [
      { word: "counterweighted", meaningFa: "متعادل‌شده با وزنه‌های سنگی", phonetic: "/ˈkaʊntəweɪtɪd/" },
      { word: "vulnerable", meaningFa: "آسیب‌پذیر و حساس به فرسایش", phonetic: "/ˈvʌlnərəbl/" },
      { word: "clockwork", meaningFa: "ساعت‌وار، بسیار منظم و بی‌نقص", phonetic: "/ˈklɒkwɜːk/" },
    ],
    question: {
      promptEn: "What did the stone gates do when the bronze sluice wheel was engaged?",
      promptFa: "وقتی چرخ دنده‌های برنزی درگیر شدند، دریچه‌های سنگی چه کردند؟",
      options: [
        "Diverted rushing canal water away from vulnerable foundations",
        "Broke into small pebbles",
        "Blocked the airflow completely",
      ],
      correctIndex: 0,
      hintSnippet: "diverting rushing canal water away from vulnerable building foundations with clockwork precision",
      clueFa: "خط آخر رو نگاه کن؛ مسیر آب پرخروش رو از پی‌های آسیب‌پذیر ساختمان‌ها منحرف کردند.",
    },
    choiceA: {
      labelEn: "Demonstrate the operational mechanism live to city engineering authorities!",
      labelFa: "کارکرد زنده سیستم رو به مدیران مهندسی شهرداری ونیز نشان بده!",
      descriptionFa: "راهکاری عملی و بی‌هزینه برای مهار آسیب‌های فرسایش ساختمان‌ها.",
    },
    choiceB: {
      labelEn: "Publish an exhaustive structural engineering treatise on Renaissance hydraulics!",
      labelFa: "رساله جامع مهندسی سازه درباره هیدرولیک عصر رنسانس تالیف کن!",
      descriptionFa: "مرجعی معتبر برای دانشگاه‌های معماری سراسر جهان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The 3D LiDAR scanner captured micron-accurate geometry of the keystone inscriptions. When translated from Renaissance Latin, the text read: *'To those who inherit this lagoon: guard the waters beneath, and the city shall endure forever.'* Signed personally by Fra Giocondo in June 1509.",
    keywords: [
      { word: "geometry", meaningFa: "هندسه، زاویه‌ها و ابعاد فضایی", phonetic: "/dʒiˈɒmətri/" },
      { word: "endure", meaningFa: "پایدار ماندن، دوام آوردن در طول قرن‌ها", phonetic: "/ɪnˈdjʊə/" },
      { word: "keystone", meaningFa: "سنگ تاج طاق که قفل‌کننده اصلی قوس است", phonetic: "/ˈkiːstəʊn/" },
    ],
    question: {
      promptEn: "What did Fra Giocondo's keystone inscription say about Venice?",
      promptFa: "کتیبه فرا جیوکوندو روی سنگ تاج درباره ونیز چه پیامی داشت؟",
      options: [
        "'Guard the waters beneath, and the city shall endure forever'",
        "'Flee the city before the winter storms arrive'",
        "'Build taller palaces above the roofs'",
      ],
      correctIndex: 0,
      hintSnippet: "guard the waters beneath, and the city shall endure forever",
      clueFa: "خط دوم رو ببین؛ نوشته بود: پاسدار آب‌های زیرین باشید تا شهر تا ابد استوار بماند.",
    },
    choiceA: {
      labelEn: "Preserve the keystone as the centerpiece of a new underground heritage museum!",
      labelFa: "سنگ تاج رو به عنوان نگین موزه جدید میراث زیرزمینی حفاظت کن!",
      descriptionFa: "بازدید عموم از پیام تاریخی معمار بزرگ ونیز.",
    },
    choiceB: {
      labelEn: "Pledge to establish the Giocondo Foundation for lagoon conservation!",
      labelFa: "پیمان ببند که بنیاد دائمی جیوکوندو رو برای حفاظت از مرداب ونیز تأسیس کنی!",
      descriptionFa: "تعهدی پایدار برای نجات همیشگی شهر بر روی آب.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Recommissioning the charcoal and quartz filtration beds, laboratory assays confirmed that water drawn from the cisterns was pure, crisp, and completely free of modern industrial microplastics. The medieval filtration design outperformed contemporary municipal water filters.",
    keywords: [
      { word: "filtration", meaningFa: "تصفیه و پالایش مایعات", phonetic: "/fɪlˈtreɪʃn/" },
      { word: "assays", meaningFa: "آزمایش‌ها و تجزیه و تحلیل‌های دقیق آزمایشگاهی", phonetic: "/ˈæseɪz/" },
      { word: "microplastics", meaningFa: "ذرات پلاستیکی بسیار ریز آلاینده آب", phonetic: "/ˈmaɪkrəʊˌplæstɪks/" },
    ],
    question: {
      promptEn: "What harmful pollutant was the ancient filtration bed completely free of?",
      promptFa: "آب تصفیه‌شده آب‌انبار باستانی از کدام آلاینده مضر کاملاً عاری بود؟",
      options: [
        "Modern industrial microplastics",
        "Beneficial natural minerals",
        "Dissolved oxygen",
      ],
      correctIndex: 0,
      hintSnippet: "completely free of modern industrial microplastics",
      clueFa: "خط دوم رو بخون؛ ذرات میکروپلاستیک‌های صنعتی مدرن در آب وجود نداشت.",
    },
    choiceA: {
      labelEn: "Equip local public fountains with restored historic quartz water lines!",
      labelFa: "فواره‌های عمومی شهر رو به لوله‌های آب تصفیه‌شده کوارتزی باستانی وصل کن!",
      descriptionFa: "آب گوارا و طبیعی برای تمام شهروندان و گردشگران.",
    },
    choiceB: {
      labelEn: "Patent the bio-mineral filtration method for global humanitarian disaster relief!",
      labelFa: "روش تصفیه کانی‌های طبیعی رو برای امدادرسانی در بلایای طبیعی ثبت جهانی کن!",
      descriptionFa: "نجات جان میلیون‌ها انسان در مناطقی که به آب پاک دسترسی ندارند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Inspector Vane and the Ministry of Cultural Patrimony arrived with police security boats. Standing in the octagonal marble chamber, the inspector declared the site a UNESCO World Heritage Sanctuary of Extraordinary Universal Value, placing it under immediate international protection.",
    keywords: [
      { word: "patrimony", meaningFa: "میراث ملی و فرهنگی کهن", phonetic: "/ˈpætrɪməni/" },
      { word: "sanctuary", meaningFa: "منطقه امن و حفاظت‌شده ویژه", phonetic: "/ˈsæŋktʃuəri/" },
      { word: "universal", meaningFa: "جهانی، فراملیتی و متعلق به تمام بشریت", phonetic: "/ˌjuːnɪˈvɜːsl/" },
    ],
    question: {
      promptEn: "What international designation did Inspector Vane grant the octagonal chamber?",
      promptFa: "بازرس وین چه عنوان بین‌المللی به تالار هشت‌ضلعی اعطا کرد؟",
      options: [
        "A UNESCO World Heritage Sanctuary of Extraordinary Universal Value",
        "A private commercial parking depot",
        "A regular storage cellar",
      ],
      correctIndex: 0,
      hintSnippet: "declared the site a UNESCO World Heritage Sanctuary of Extraordinary Universal Value",
      clueFa: "خط آخر رو ببین؛ اثر میراث جهانی یونسکو با ارزش جهانی استثنایی.",
    },
    choiceA: {
      labelEn: "Lead the grand opening delegation at the UNESCO proclamation ceremony!",
      labelFa: "هیئت افتتاحیه رسمی رو در مراسم اعلان جهانی یونسکو رهبری کن!",
      descriptionFa: "افتخاری بزرگ برای کشور و تاریخ جهان.",
    },
    choiceB: {
      labelEn: "Design a respectful low-impact glass skywalk for visitors above the water!",
      labelFa: "پل معلق شیشه‌ای سازگار با محیط برای بازدید گردشگران بالای آب طراحی کن!",
      descriptionFa: "امکان تماشای شگفتی‌ها بدون آسیب به ساختار تاریخی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Elena stepped onto the ancient wooden piling deck beneath the Rialto bridge. The centuries-old oak piles, submerged permanently in oxygen-depleted mud, were as rock-solid as petrified wood. Her ultrasonic testing proved the historic bridge could safely support human foot traffic for another five hundred years.",
    keywords: [
      { word: "piling", meaningFa: "شمع‌کوبی و پایه‌های چوبی کوبیده‌شده در بستر آب", phonetic: "/ˈpaɪlɪŋ/" },
      { word: "petrified", meaningFa: "فسیل‌شده، سنگ‌شده و فوق‌العاده مستحکم", phonetic: "/ˈpetrɪfaɪd/" },
      { word: "ultrasonic", meaningFa: "فراصوت برای تست غیرمخرب سازه‌ها", phonetic: "/ˌʌltrəˈsɒnɪk/" },
    ],
    question: {
      promptEn: "For how many more years could the Rialto bridge support foot traffic according to testing?",
      promptFa: "طبق آزمایش‌های فراصوت، پل ریالتو تا چند سال دیگر توان باربری دارد؟",
      options: [
        "For another five hundred years",
        "Only three more days",
        "Less than one month",
      ],
      correctIndex: 0,
      hintSnippet: "proved the historic bridge could safely support human foot traffic for another five hundred years",
      clueFa: "خط آخر رو نگاه کن؛ تا پانصد سال دیگر با امنیت کامل پابرجاست.",
    },
    choiceA: {
      labelEn: "Publish the ultrasonic Rialto structural survey in Architectural Digest!",
      labelFa: "گزارش ارزیابی سازه‌ای پل ریالتو را در نشریه معتبر معماری منتشر کن!",
      descriptionFa: "آرامش خاطر تمام دوستداران هنر و میراث ونیز.",
    },
    choiceB: {
      labelEn: "Carve a small bronze marker honoring the unknown Renaissance pile-drivers!",
      labelFa: "لوح برنزی یادبود کارگران و معماران گمنام قرون وسطی را نصب کن!",
      descriptionFa: "احترام به انسان‌هایی که شالوده ونیز را با دست ساختند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Chemical analysis revealed that water trapped in the deep aqueduct carried zero salinity and contained trace limestone bicarbonates identical to alpine glacial springs. This proved that Fra Giocondo had secretly tapped an underground subterranean artesian river flowing directly from the Dolomite Alps.",
    keywords: [
      { word: "salinity", meaningFa: "میزان شوری و نمک آب", phonetic: "/səˈlɪnəti/" },
      { word: "artesian", meaningFa: "آرتزین و چاه‌های جهنده طبیعی با فشار زمین", phonetic: "/ɑːˈtiːziən/" },
      { word: "dolomite", meaningFa: "رشته‌کوه‌های دالومیت در شمال ایتالیا", phonetic: "/ˈdɒləmaɪt/" },
    ],
    question: {
      promptEn: "Where did the underground artesian river originate from according to chemical analysis?",
      promptFa: "طبق آزمایش‌های شیمیایی، رودخانه زیرزمینی از کجا سرچشمه می‌گرفت؟",
      options: [
        "Directly from the Dolomite Alps",
        "From the salty Mediterranean sea",
        "From city rainwater drains",
      ],
      correctIndex: 0,
      hintSnippet: "flowing directly from the Dolomite Alps",
      clueFa: "خط آخر رو ببین؛ مستقیماً از یخچال‌های رشته‌کوه‌های آلپ دالومیت سرچشمه می‌گرفت.",
    },
    choiceA: {
      labelEn: "Map the alpine artesian flow to establish a strategic municipal freshwater reservoir!",
      labelFa: "مسیر جریان آب آرتزین آلپ رو برای ساخت مخزن استراتژیک شهر ثبت کن!",
      descriptionFa: "استقلال آبی ونیز در شرایط بحران‌های اقلیمی آینده.",
    },
    choiceB: {
      labelEn: "Author a scientific paper on Alpine-Venetian subterranean hydrology!",
      labelFa: "مقاله علمی معتبری درباره آب‌شناسی زیرزمینی آلپ و ونیز منتشر کن!",
      descriptionFa: "اثبات نظریه‌ای که دانشمندان قرن‌ها به دنبالش بودند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Venice's Chief Coastal Engineer reviewed Elena's proposal with unmasked awe. By reopening the bell tower pressure dampeners, the city could dissipate high tide kinetic energy by forty percent, relieving immense stress from fragile canal embankments during seasonal flooding.",
    keywords: [
      { word: "dissipate", meaningFa: "پراکنده کردن و خنثی ساختن انرژی", phonetic: "/ˈdɪsɪpeɪt/" },
      { word: "kinetic", meaningFa: "جنبشی و حرکتی", phonetic: "/kɪˈnetɪk/" },
      { word: "embankments", meaningFa: "دیواره‌های مهار ساحلی کانال‌ها", phonetic: "/ɪmˈbæŋkmənts/" },
    ],
    question: {
      promptEn: "By what percentage could reopening the dampeners reduce high tide kinetic energy?",
      promptFa: "بازگشایی تعدیل‌کننده‌های تاریخی چقدر از انرژی جنبشی مدها را خنثی می‌کرد؟",
      options: [
        "By forty percent",
        "By less than one percent",
        "It had no effect",
      ],
      correctIndex: 0,
      hintSnippet: "could dissipate high tide kinetic energy by forty percent",
      clueFa: "خط دوم رو بخون؛ چهل درصد انرژی امواج مد را کاهش می‌داد.",
    },
    choiceA: {
      labelEn: "Supervise the pilot reactivation of the Campanile dampening sluices!",
      labelFa: "بر اجرای آزمایشی فعال‌سازی مجدد دریچه‌های برج ناقوس نظارت کن!",
      descriptionFa: "پایان تاریخی غرق شدن‌های مکرر میدان سن‌مارکو.",
    },
    choiceB: {
      labelEn: "Draft a modern engineering manual integrating Renaissance flood wisdom!",
      labelFa: "کتابچه نوین مهندسی با تلفیق حکمت رنسانس و دانش روز تدوین کن!",
      descriptionFa: "راهنمایی برای تمام شهرهای ساحلی جهان که در معرض بالا آمدن آب دریا هستند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "At the International Conservation Congress in Rome, Elena and Marco's presentation earned a standing ovation from five hundred heritage architects. The Italian Minister of Culture awarded them the prestigious Palladio Gold Medal for historic structural revelation.",
    keywords: [
      { word: "ovation", meaningFa: "تشویق پرشور و ایستاده حضار", phonetic: "/əʊˈveɪʃn/" },
      { word: "revelation", meaningFa: "کشف و آشکارسازی علمی بزرگ", phonetic: "/ˌrevəˈleɪʃn/" },
      { word: "prestigious", meaningFa: "معتبر، پرافتخار و عالی‌رتبه", phonetic: "/preˈstɪdʒəs/" },
    ],
    question: {
      promptEn: "What prestigious award did the Italian Minister of Culture present to Elena and Marco?",
      promptFa: "وزیر فرهنگ ایتالیا چه نشان پرافتخاری به النا و مارکو اهدا کرد؟",
      options: [
        "The prestigious Palladio Gold Medal",
        "A certificate of attendance",
        "A free city tour ticket",
      ],
      correctIndex: 0,
      hintSnippet: "awarded them the prestigious Palladio Gold Medal for historic structural revelation",
      clueFa: "خط آخر رو ببین؛ مدال طلای پالادیو برای کشف شگفت‌انگیز سازه‌ای.",
    },
    choiceA: {
      labelEn: "Found the Institute for Historic Coastal Resilience in Palazzo Morosini!",
      labelFa: "آموزشکده بین‌المللی تاب‌آوری سواحل تاریخی رو در عمارت موروسینی پایه‌گذاری کن!",
      descriptionFa: "مرکزی جهانی برای پژوهش‌های نجات شهرهای تاریخی جهان.",
    },
    choiceB: {
      labelEn: "Host a gala on the Grand Canal celebrating the eternity of Venice!",
      labelFa: "جشن باشکوهی بر فراز گراند کانال در ستایش جاودانگی ونیز برگزار کنید!",
      descriptionFa: "شبی فراموش‌نشدنی زیر نور چراغ‌های لرزان روی آب‌های نیلگون.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "As the city engineers watched the floodgates lower smoothly, cheers echoed along the stone quays. The five-hundred-year-old engineering masterpiece functioned with immaculate modern grace.",
    keywords: [{ word: "quays", meaningFa: "اسکله‌ها و دیواره‌های سنگی لنگرگاه", phonetic: "/kiːz/" }],
    question: {
      promptEn: "How did the five-hundred-year-old mechanism function before the engineers?",
      promptFa: "سازوکار ۵۰۰ ساله جلوی چشمان مهندسان چگونه کار کرد؟",
      options: ["With immaculate modern grace", "With heavy broken noises", "It failed to move"],
      correctIndex: 0,
      hintSnippet: "functioned with immaculate modern grace",
      clueFa: "با وقار و دقتی بی‌نقص و مثل ابزارهای مدرن کار کرد.",
    },
    choiceA: {
      labelEn: "Celebrate the successful reactivation with a glass of Bellini on the quay!",
      labelFa: "راه‌اندازی موفقیت‌آمیز رو با نوشیدن بلینی در اسکله جشن بگیرید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Install automated digital telemetry sensors to monitor the ancient gates!",
      labelFa: "حسگرهای مخابره دیجیتال برای پایش دائمی دریچه‌های باستانی نصب کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Elena's published structural treatise became the definitive international textbook on historic masonry, winning the European Union Prize for Cultural Heritage Research.",
    keywords: [{ word: "treatise", meaningFa: "رساله علمی و پژوهشی تخصصی جامع", phonetic: "/ˈtriːtɪs/" }],
    question: {
      promptEn: "What major award did Elena's structural engineering treatise win?",
      promptFa: "رساله مهندسی سازه النا چه جایزه بزرگی را از آن خود کرد؟",
      options: ["European Union Prize for Cultural Heritage Research", "A local school badge", "A small plastic ruler"],
      correctIndex: 0,
      hintSnippet: "winning the European Union Prize for Cultural Heritage Research",
      clueFa: "جایزه اتحادیه اروپا برای پژوهش در میراث فرهنگی.",
    },
    choiceA: {
      labelEn: "Deliver the keynote address at Oxford University's Faculty of Architecture!",
      labelFa: "سخنرانی افتتاحیه رو در دانشکده معماری دانشگاه آکسفورد ایراد کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Establish a fellowship funding young architectural conservators in Italy!",
      labelFa: "بورسیه تحصیلی سالانه‌ای برای معماران مرمت‌کار جوان در ایتالیا تأسیس کنید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The newly inaugurated Subterranean Heritage Museum welcomed its first thousand visitors. Guests walked above crystal waters, admiring Fra Giocondo's illuminated keystone in silent awe.",
    keywords: [{ word: "inaugurated", meaningFa: "افتتاح‌شده و رسماً گشایش‌یافته", phonetic: "/ɪˈnɔːɡjəreɪtɪd/" }],
    question: {
      promptEn: "What did guests walk above in the Subterranean Heritage Museum?",
      promptFa: "بازدیدکنندگان در موزه میراث زیرزمینی از بالای چه چیزی عبور می‌کردند؟",
      options: ["Crystal waters", "Dry sand", "Rusty iron pipes"],
      correctIndex: 0,
      hintSnippet: "Guests walked above crystal waters",
      clueFa: "از بالای آب‌های زلال و بلورین عبور کردند.",
    },
    choiceA: {
      labelEn: "Host a classical Vivaldi violin concert in the echoing underground chamber!",
      labelFa: "کنسرت زهی ویوالدی رو در دل تالار طنین‌انداز زیرزمینی برپا کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Present Fra Giocondo's original vellum blueprint to the museum archive!",
      labelFa: "نقشه پوستی اصلی معمار رو به آرشیو موزه هدیه دهید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The Giocondo Foundation secured fifty million euros in international endowments, dedicating perpetual funding to safeguard Venice's delicate maritime architecture forever.",
    keywords: [{ word: "endowments", meaningFa: "موقوفات و کمک‌های مالی بلاعوض دائمی", phonetic: "/ɪnˈdaʊmənts/" }],
    question: {
      promptEn: "How many euros in international endowments did the Giocondo Foundation secure?",
      promptFa: "بنیاد جیوکوندو چند میلیون یورو موقوفات بین‌المللی جذب کرد؟",
      options: ["Fifty million euros", "One hundred dollars", "Ten thousand euros"],
      correctIndex: 0,
      hintSnippet: "secured fifty million euros in international endowments",
      clueFa: "پنجاه میلیون یورو برای حفاظت دائمی جذب کرد.",
    },
    choiceA: {
      labelEn: "Restore twenty historic palazzi along the Grand Canal with green technologies!",
      labelFa: "بیست عمارت تاریخی گراند کانال رو با فناوری‌های سبز مرمت کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Commission an artisan bronze monument to Renaissance hydraulic masters!",
      labelFa: "تندیس برنزی باشکوهی برای اساتید هیدرولیک رنسانس سفارش دهید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Restored public fountains across Venice gushed with pure, crystal-clear alpine water. Locals filled their glass bottles daily, celebrating a historic triumph over plastic waste.",
    keywords: [{ word: "gushed", meaningFa: "جوشید و جاری شد با قدرت", phonetic: "/ɡʌʃt/" }],
    question: {
      promptEn: "What triumph did locals celebrate while filling their glass bottles at the fountains?",
      promptFa: "شهروندان در حین پر کردن بطری‌های شیشه‌ای چه پیروزی‌ای را جشن گرفتند؟",
      options: ["A historic triumph over plastic waste", "Winning a soccer game", "A holiday festival"],
      correctIndex: 0,
      hintSnippet: "celebrating a historic triumph over plastic waste",
      clueFa: "پیروزی تاریخی در حذف بطری‌های پلاستیکی و حفظ محیط‌زیست.",
    },
    choiceA: {
      labelEn: "Declare Venice the world's first single-use-plastic-free historic city!",
      labelFa: "ونیز رو به عنوان اولین شهر تاریخی بدون پلاستیک جهان اعلام کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Toast the clean waters with city elders in Saint Mark's Square!",
      labelFa: "با بزرگان شهر در میدان سن‌مارکو به سلامتی آب پاک بنوشید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The bio-mineral filtration patent was released royalty-free to the Red Cross and UNICEF, saving hundreds of thousands of lives in drought-stricken regions worldwide.",
    keywords: [{ word: "royalty-free", meaningFa: "رایگان، بدون حق‌الامتیاز و در دسترس همگان", phonetic: "/ˈrɔɪəlti friː/" }],
    question: {
      promptEn: "To which organizations was the water filtration patent released royalty-free?",
      promptFa: "حق اختراع تصفیه آب به کدام سازمان‌ها رایگان واگذار شد؟",
      options: ["To the Red Cross and UNICEF", "To private soft drink companies", "To commercial banks"],
      correctIndex: 0,
      hintSnippet: "released royalty-free to the Red Cross and UNICEF",
      clueFa: "به صلیب سرخ و یونیسف برای کمک به مناطق محروم.",
    },
    choiceA: {
      labelEn: "Accept the United Nations Humanitarian Laureate Medal in Geneva!",
      labelFa: "مدال افتخار بشردوستانه سازمان ملل را در ژنو دریافت کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Deploy volunteer engineering teams to build modular cisterns in East Africa!",
      labelFa: "تیم‌های داوطلب مهندسی برای ساخت آب‌انبارهای شنی به شرق آفریقا اعزام کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Representatives from one hundred nations witnessed the UNESCO plaque unveiled on the facade of Palazzo Morosini, cementing its legacy as a sanctuary of human genius.",
    keywords: [{ word: "facade", meaningFa: "نمای اصلی بیرونی ساختمان", phonetic: "/fəˈsɑːd/" }],
    question: {
      promptEn: "On what building's facade was the UNESCO plaque unveiled?",
      promptFa: "لوح یونسکو بر نمای کدام ساختمان تاریخی پرده‌برداری شد؟",
      options: ["Palazzo Morosini", "A modern railway station", "A shopping mall"],
      correctIndex: 0,
      hintSnippet: "unveiled on the facade of Palazzo Morosini",
      clueFa: "بر نمای عمارت تاریخی موروسینی در گراند کانال.",
    },
    choiceA: {
      labelEn: "Lead the honorary ceremonial gondola regatta along the Grand Canal!",
      labelFa: "رژه قایق‌های سنتی گوندولا را در گراند کانال رهبری کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Publish an illustrated art monograph with the Metropolitan Museum of Art!",
      labelFa: "کتاب مصور نفیس با همکاری موزه متروپولیتن نیویورک منتشر کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The translucent glass skywalk hovered silently over the historic waters, allowing half a million visitors annually to admire the ancient hydraulic vaults without touching a stone.",
    keywords: [{ word: "translucent", meaningFa: "نیمه‌شفاف و عبوردهنده نور", phonetic: "/trænzˈluːsnt/" }],
    question: {
      promptEn: "How many visitors annually walked the glass skywalk to admire the vaults?",
      promptFa: "سالانه چند بازدیدکننده از روی پل شیشه‌ای از آبراه‌های تاریخی بازدید کردند؟",
      options: ["Half a million visitors annually", "Ten people", "One hundred tourists"],
      correctIndex: 0,
      hintSnippet: "allowing half a million visitors annually to admire the ancient hydraulic vaults",
      clueFa: "نیم میلیون بازدیدکننده در سال بدون آسیب به بناها تماشا کردند.",
    },
    choiceA: {
      labelEn: "Receive the Pritzker Architectural Preservation Award for sensitive design!",
      labelFa: "جایزه معماری پریتزکر را برای طراحی هوشمندانه و نامحسوس دریافت کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Design similar non-intrusive visitor bridges for submerged Roman ruins!",
      labelFa: "پل‌های مشابهی برای بازدید از بقایای غرق‌شده امپراتوری روم باستان طراحی کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Architectural Digest published the ultrasonic survey under the headline *'The Eternal Foundations of Venice'*, reassuring citizens that ancient oak piles remain strong as steel.",
    keywords: [{ word: "reassuring", meaningFa: "اطمینان‌بخش و آرامش‌دهنده", phonetic: "/ˌriːəˈʃɔːrɪŋ/" }],
    question: {
      promptEn: "What did the Architectural Digest survey reassure citizens about?",
      promptFa: "گزارش مجله معماری چه اطمینانی به شهروندان ونیز داد؟",
      options: ["That ancient oak piles remain strong as steel", "That the city will sink tomorrow", "That bridges must be demolished"],
      correctIndex: 0,
      hintSnippet: "reassuring citizens that ancient oak piles remain strong as steel",
      clueFa: "پایه‌های چوب بلوط باستانی مثل فولاد محکم و استوارند.",
    },
    choiceA: {
      labelEn: "Lead an international webinar for engineers preserving vulnerable historic ports!",
      labelFa: "وبینار بین‌المللی برای مهندسان حفاظت از بنادر تاریخی جهان برگزار کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Host an architectural photography exhibition on the Rialto Bridge walkway!",
      labelFa: "نمایشگاه عکس معماری روی گذرگاه پیاده پل ریالتو برپا کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The newly unveiled bronze plaque beside the Rialto Bridge honored the medieval carpenters whose nameless labor anchored the city upon sea mud for over five centuries.",
    keywords: [{ word: "carpenters", meaningFa: "نجاران و چوب‌تراشان هنرمند کهن", phonetic: "/ˈkɑːpəntəz/" }],
    question: {
      promptEn: "Who did the bronze plaque beside the Rialto Bridge honor?",
      promptFa: "لوح برنزی کنار پل ریالتو از چه کسانی تجلیل کرد؟",
      options: ["The medieval carpenters whose nameless labor anchored the city", "Modern tax collectors", "Car drivers"],
      correctIndex: 0,
      hintSnippet: "honored the medieval carpenters whose nameless labor anchored the city upon sea mud",
      clueFa: "نجاران قرون وسطی که کار بی‌نام‌ونشان آنها شهر را روی گل‌ولای دریا استوار کرد.",
    },
    choiceA: {
      labelEn: "Lay a wreath of laurel leaves upon the Grand Canal waters in silent homage!",
      labelFa: "تاج‌گلی از برگ‌های بو در آب‌های گراند کانال به یاد آنها رها کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Found the Venetian Guild of Restoration Crafts to train future wood restorers!",
      labelFa: "انجمن صنفی مرمتگران چوب ونیز را برای آموزش جوانان تأسیس کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The newly surveyed alpine artesian reservoir provided Venice with five hundred thousand cubic meters of pristine emergency water, immunizing the lagoon city against dry spells.",
    keywords: [{ word: "immunizing", meaningFa: "مصون‌سازی و واکسینه کردن در برابر خطر", phonetic: "/ˈɪmjunaɪzɪŋ/" }],
    question: {
      promptEn: "How many cubic meters of emergency water did the artesian reservoir provide?",
      promptFa: "مخزن آرتزین چند متر مکعب آب گوارای اضطراری تأمین کرد؟",
      options: ["Five hundred thousand cubic meters", "Only ten liters", "One gallon"],
      correctIndex: 0,
      hintSnippet: "provided Venice with five hundred thousand cubic meters of pristine emergency water",
      clueFa: "پانصد هزار متر مکعب آب پاک و زلال.",
    },
    choiceA: {
      labelEn: "Inaugurate the 'Dolomite Aqueduct Portal' with city and regional leaders!",
      labelFa: "دروازه آبراهه دالومیت را با حضور رهبران شهر و منطقه افتتاح کنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Celebrate by sharing a commemorative glass of alpine water at City Hall!",
      labelFa: "یک گیلاس آب گوارای آلپ را در تالار شهرداری به سلامتی بنوشید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The paper on Alpine-Venetian hydrology won the Golden Medal of the Royal Geographical Society, establishing a groundbreaking new paradigm for coastal geology worldwide.",
    keywords: [{ word: "paradigm", meaningFa: "پارادایم، الگو و مدل علمی بنیادین", phonetic: "/ˈpærədaɪm/" }],
    question: {
      promptEn: "What medal did the hydrology research paper win?",
      promptFa: "مقاله پژوهشی آب‌شناسی چه مدالی کسب کرد؟",
      options: ["The Golden Medal of the Royal Geographical Society", "A silver coin", "A plastic medal"],
      correctIndex: 0,
      hintSnippet: "won the Golden Medal of the Royal Geographical Society",
      clueFa: "مدال طلای انجمن سلطنتی جغرافیا.",
    },
    choiceA: {
      labelEn: "Deliver a lecture tour across Harvard, Cambridge, and Sorbonne Universities!",
      labelFa: "سلسله‌سخنرانی‌هایی در دانشگاه‌های هاروارد، کمبریج و سوربن برگزار کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Publish a popular science book translating ancient hydrology for everyday readers!",
      labelFa: "کتاب علمی عامه‌فهمی برای درک شگفتی‌های آب‌شناسی کهن منتشر کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "During the autumn equinox high tides, the reactivated campanile dampeners absorbed forty-two percent of the storm surge. For the first time in sixty years, Piazza San Marco stayed dry.",
    keywords: [{ word: "equinox", meaningFa: "اعتدال پاییزی و زمان مدهای حداکثری", phonetic: "/ˈiːkwɪnɒks/" }],
    question: {
      promptEn: "What historic landmark remained dry during the autumn high tides for the first time in 60 years?",
      promptFa: "کدام نماد تاریخی ونیز برای اولین بار در ۶۰ سال گذشته در مدهای پاییزی خشک ماند؟",
      options: ["Piazza San Marco", "The airport runway", "The railway station"],
      correctIndex: 0,
      hintSnippet: "For the first time in sixty years, Piazza San Marco stayed dry",
      clueFa: "میدان تاریخی سن‌مارکو کاملاً خشک و محفوظ ماند.",
    },
    choiceA: {
      labelEn: "Dance in the dry, dry square of Saint Mark under the evening moonlight!",
      labelFa: "در میدان خشک و باصفای سن‌مارکو زیر نور مهتاب شبانه شادی کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Ring the great bells of the Campanile in triumphant celebration across the lagoon!",
      labelFa: "ناقوس‌های بزرگ برج را در جشنی پرشکوه در سراسر مرداب به صدا درآورید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The new engineering manual became standard curriculum for coastal adaptation engineers in Rotterdam, New Orleans, Alexandria, and Tokyo, shielding coastal heritage everywhere.",
    keywords: [{ word: "adaptation", meaningFa: "سازگاری و انطباق با تغییرات اقلیمی", phonetic: "/ˌædæpˈteɪʃn/" }],
    question: {
      promptEn: "In which cities was the coastal engineering manual adopted as standard curriculum?",
      promptFa: "کتابچه مهندسی ساحلی در کدام شهرهای بزرگ دنیا به عنوان درس استاندارد تدریس شد؟",
      options: ["Rotterdam, New Orleans, Alexandria, and Tokyo", "Nowhere outside Italy", "In desert mountain villages"],
      correctIndex: 0,
      hintSnippet: "standard curriculum for coastal adaptation engineers in Rotterdam, New Orleans, Alexandria, and Tokyo",
      clueFa: "در روتردام، نیواورلئان، اسکندریه و توکیو.",
    },
    choiceA: {
      labelEn: "Establish an international coastal engineering exchange program for students!",
      labelFa: "برنامه تبادل بین‌المللی دانشجویان مهندسی سواحل را پایه‌گذاری کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Advise the Global Climate Resilience Council on protecting historic sea ports!",
      labelFa: "به شورای جهانی تاب‌آوری اقلیمی در حفاظت از بنادر باستانی مشاوره دهید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Palazzo Morosini was inaugurated as the Global Institute for Historic Coastal Resilience. Scholars, students, and engineers gathered in its frescoed halls to defend world heritage.",
    keywords: [{ word: "frescoed", meaningFa: "مزین به دیوارنگاره‌های فرسکوی تاریخی", phonetic: "/ˈfreskəʊd/" }],
    question: {
      promptEn: "What was Palazzo Morosini inaugurated as?",
      promptFa: "عمارت موروسینی به چه عنوانی افتتاح شد؟",
      options: [
        "The Global Institute for Historic Coastal Resilience",
        "A private luxury casino",
        "An empty tourist warehouse",
      ],
      correctIndex: 0,
      hintSnippet: "inaugurated as the Global Institute for Historic Coastal Resilience",
      clueFa: "آموزشکده جهانی تاب‌آوری سواحل تاریخی.",
    },
    choiceA: {
      labelEn: "Cut the ceremonial ribbon alongside Venice's master conservators!",
      labelFa: "روبان افتتاحیه را همراه با استادان پیشکسوت مرمت ونیز قیچی کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Dedicate the institute library to Fra Giocondo and Renaissance visionaries!",
      labelFa: "کتابخانه آموزشکده را به یاد فرا جیوکوندو و معماران رنسانس نام‌گذاری کنید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "A grand gala illuminated the Grand Canal with floating candle lanterns and acoustic mandolins. Raising their glasses under the stars, Elena and Marco toasted the city that would never sink.",
    keywords: [{ word: "mandolins", meaningFa: "سازهای زهی سنتی ماندولین ایتالیایی", phonetic: "/ˈmændəlɪnz/" }],
    question: {
      promptEn: "What did Elena and Marco toast under the stars at the grand gala?",
      promptFa: "النا و مارکو در جشن بزرگ زیر نور ستارگان به چه چیزی سلامتی گفتند؟",
      options: ["The city that would never sink", "Leaving the country", "Buying a fast yacht"],
      correctIndex: 0,
      hintSnippet: "Elena and Marco toasted the city that would never sink",
      clueFa: "به شهری که هرگز غرق نخواهد شد.",
    },
    choiceA: {
      labelEn: "Step onto a wooden gondola to glide through moonlit historic canals!",
      labelFa: "سوار بر گوندولای چوبی در کانال‌های مهتابی تاریخ قدم بزنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Smile knowing that human ingenuity has preserved Venice for all generations to come!",
      labelFa: "با لبخند بدانید که نبوغ انسان، ونیز را برای تمام نسل‌های آینده جاودان ساخت!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Toast of the Grand Sluice", titleFa: "سلامتی در کنار آبراهه کهن", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان باشکوه مهندسی", climaxEn: "Raising glasses of Bellini, the engineers celebrate a Renaissance mechanism that saved modern Venice.", climaxFa: "با نوشیدن بلینی در اسکله، مهندسان نجات شهر را به دست سازوکار ۵۰۰ ساله رنسانس جشن گرفتند.", xpReward: 260 },
  { pathCode: "AAAAB", titleEn: "Digital Guardians of Stone", titleFa: "پاسداران دیجیتال سنگ‌ها", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان تلفیق مدرن و کهن", climaxEn: "Modern telemetry sensors harmonize with ancient bronze gears, creating a perpetual shield for the city.", climaxFa: "حسگرهای مدرن با چرخ‌دنده‌های باستانی برنزی پیوند خوردند تا سپری دائمی برای شهر بسازند.", xpReward: 245 },
  { pathCode: "AAABA", titleEn: "Vivaldi in the Catacombs", titleFa: "ویوالدی در دل دخمه‌ها", badgeCategory: "legendary", badgeIcon: "🎻", badgeNameFa: "پایان هنری و رویایی", climaxEn: "The soaring notes of the Four Seasons echo across subterranean waters, moving visitors to tears of wonder.", climaxFa: "نوای سحرانگیز چهار فصل ویوالدی بر فراز آب‌های زیرزمینی طنین انداخت و همه را مبهوت کرد.", xpReward: 265 },
  { pathCode: "AAABB", titleEn: "The Vellum Archive", titleFa: "طومار جاویدان در آرشیو", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان ماندگار اسناد کهن", climaxEn: "Fra Giocondo's blueprint rests in a climate-controlled vault, studied by scholars from sixty nations.", climaxFa: "نقشه پوستی فرا جیوکوندو در محفظه ویژه آرشیو قرار گرفت و توسط پژوهشگران ۶۰ کشور مطالعه شد.", xpReward: 250 },
  { pathCode: "AABAA", titleEn: "The Oxford Address", titleFa: "خطابه در دانشگاه آکسفورد", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان دانشگاهی ممتاز", climaxEn: "Elena receives an honorary doctorate at Oxford, acclaimed as the foremost structural conservator of her era.", climaxFa: "النا دکترای افتخاری دانشگاه آکسفورد را دریافت کرد و به عنوان برترین معمار مرمت دوران نامیده شد.", xpReward: 260 },
  { pathCode: "AABAB", titleEn: "The Restorers' Fellowship", titleFa: "بورسیه استادان جوان مرمت", badgeCategory: "heroic", badgeIcon: "🏛️", badgeNameFa: "پایان آموزشی و الهام‌بخش", climaxEn: "The new fellowship trains fifty brilliant young conservators who safeguard historic cities across Europe.", climaxFa: "بورسیه تأسیس‌شده پنجاه معمار جوان را آموزش داد تا پاسدار شهرهای کهن اروپا باشند.", xpReward: 240 },
  { pathCode: "AABBA", titleEn: "The Twenty Palazzi", titleFa: "مرمت بیست عمارت تاریخی", badgeCategory: "legendary", badgeIcon: "🏰", badgeNameFa: "پایان نجات میراث", climaxEn: "Twenty decaying palazzi along the Grand Canal are revived using non-destructive historic techniques.", climaxFa: "بیست کاخ رو به فرسایش در امتداد گراند کانال با روش‌های غیرمخرب باستانی حیاتی دوباره یافتند.", xpReward: 265 },
  { pathCode: "AABBB", titleEn: "Monuments of the Masters", titleFa: "تندیس استادان رنسانس", badgeCategory: "scholar", badgeIcon: "🗿", badgeNameFa: "پایان باشکوه یادبود", climaxEn: "A bronze monument to Renaissance hydraulic visionaries stands tall at the entrance to the lagoon.", climaxFa: "تندیس برنزی یادبود مهندسان هیدرولیک رنسانس در ورودی مرداب ونیز برافراشته شد.", xpReward: 245 },
  { pathCode: "ABAAA", titleEn: "Venice: The Plastic-Free Gem", titleFa: "ونیز: نگین پاک از پلاستیک", badgeCategory: "legendary", badgeIcon: "🌿", badgeNameFa: "پایان زیست‌محیطی برتر", climaxEn: "Venice becomes a zero-plastic global beacon as residents and tourists drink pure quartz-filtered water.", climaxFa: "ونیز با آب زلال تصفیه‌شده با کوارتز به الگوی جهانی حذف کامل پلاستیک تبدیل شد.", xpReward: 260 },
  { pathCode: "ABAAB", titleEn: "The Piazza San Marco Toast", titleFa: "سلامتی در میدان سن‌مارکو", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان مردمی و صمیمانه", climaxEn: "City elders and travelers clink glasses in the shadow of the basilica, celebrating pure mountain waters.", climaxFa: "بزرگان شهر و گردشگران در سایه کلیسای باستانی به افتخار آب زلال کوهستان جام‌ها را به هم زدند.", xpReward: 240 },
  { pathCode: "ABABA", titleEn: "The Geneva Humanitarian Laureate", titleFa: "نشان افتخار بشردوستانه ژنو", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان بشردوستانه جهانی", climaxEn: "The United Nations recognizes the royalty-free sand filtration design for saving millions across drought zones.", climaxFa: "سازمان ملل از واگذاری رایگان طرح تصفیه شنی که جان میلیون‌ها انسان تشنه را نجات داد تجلیل کرد.", xpReward: 270 },
  { pathCode: "ABABB", titleEn: "Wells of the Serengeti", titleFa: "آب‌انبارهای سرنگتی", badgeCategory: "explorer", badgeIcon: "💧", badgeNameFa: "پایان خدمت به جهان", climaxEn: "One hundred modular sand cisterns supply clean drinking water to remote villages across East Africa.", climaxFa: "صد آب‌انبار شنی دست‌ساز در روستاهای دورافتاده شرق آفریقا آب آشامیدنی گوارا تأمین کردند.", xpReward: 250 },
  { pathCode: "ABBAA", titleEn: "The Regatta of Triumph", titleFa: "رژه باشکوه گوندولاها", badgeCategory: "legendary", badgeIcon: "🚣", badgeNameFa: "پایان کارناوال باشکوه", climaxEn: "A hundred decorated historical gondolas parade down the Grand Canal to celebrate the UNESCO status.", climaxFa: "صد قایق گوندولای سنتی تزیین‌شده در گراند کانال ثبت اثر جهانی یونسکو را جشن گرفتند.", xpReward: 260 },
  { pathCode: "ABBAB", titleEn: "The Met Monograph", titleFa: "کتاب نفیس موزه متروپولیتن", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان هنری برجسته", climaxEn: "The Metropolitan Museum's published monograph on the secret Venetian vaults wins the Art Book Prize.", climaxFa: "کتاب مصور موزه متروپولیتن نیویورک درباره کانال‌های پنهان ونیز جایزه برترین کتاب هنری را برد.", xpReward: 245 },
  { pathCode: "ABBBA", titleEn: "The Pritzker Preservation Award", titleFa: "جایزه معماری پریتزکر", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان عالی‌رتبه معماری", climaxEn: "Elena receives the Pritzker Medal for her invisible glass skywalk that protects ancient stones.", climaxFa: "النا برای طراحی پل شیشه‌ای نامحسوس که از سنگ‌های باستانی پاسداری می‌کرد جایزه پریتزکر را گرفت.", xpReward: 270 },
  { pathCode: "ABBBB", titleEn: "Bridges of Ancient Rome", titleFa: "پل‌های تاریخ‌نگار روم", badgeCategory: "explorer", badgeIcon: "🏛️", badgeNameFa: "پایان باستان‌شناسی زیرآبی", climaxEn: "Her innovative non-invasive visitor skywalks are installed across submerged Roman ruins in Baiae.", climaxFa: "پل‌های شیشه‌ای نوآورانه او در شهر غرق‌شده بایائه از دوران روم باستان نصب شدند.", xpReward: 255 },
  { pathCode: "BAAAA", titleEn: "The Eternal Oak Piles", titleFa: "شمع‌های بلوط جاودان", badgeCategory: "scholar", badgeIcon: "🪵", badgeNameFa: "پایان علمی و فنی", climaxEn: "The Rialto bridge survey becomes the definitive guide to maintaining ancient submerged timber structures.", climaxFa: "پژوهش سازه پل ریالتو به معتبرترین مرجع جهانی نگهداری سازه‌های چوبی زیر آب تبدیل شد.", xpReward: 250 },
  { pathCode: "BAAAB", titleEn: "Exhibition on the Rialto", titleFa: "نمایشگاه روی پل ریالتو", badgeCategory: "heroic", badgeIcon: "🖼️", badgeNameFa: "پایان فرهنگی و عمومی", climaxEn: "A quarter-million visitors view the architectural photographs mounted along the historic arches.", climaxFa: "یک چهارم میلیون نفر از نمایشگاه عکس‌های ساختار پل روی گذرگاه تاریخی ریالتو بازدید کردند.", xpReward: 240 },
  { pathCode: "BAABA", titleEn: "The Laurel Wreath on the Waters", titleFa: "تاج‌گل بو بر پهنه آب‌ها", badgeCategory: "legendary", badgeIcon: "🌿", badgeNameFa: "پایان احساسی و شاعرانه", climaxEn: "The floating laurel wreath drifts toward the sea, honoring nameless carpenters who built a miracle.", climaxFa: "تاج‌گل برگ‌های بو به سمت افق اقیانوس شناور شد و یاد نجاران گمنام سازنده معجزه ونیز را گرامی داشت.", xpReward: 255 },
  { pathCode: "BAABB", titleEn: "The Venetian Woodcraft Guild", titleFa: "صنف مرمتگران چوب ونیز", badgeCategory: "scholar", badgeIcon: "🛠️", badgeNameFa: "پایان صنفی و اصیل", climaxEn: "The restored guild trains hundreds of master carpenters in historic timber piling conservation.", climaxFa: "صنف احیاشده صدها نجار ماهر را در شیوه‌های حفاظت از چوب‌های باستانی آموزش داد.", xpReward: 245 },
  { pathCode: "BABAA", titleEn: "The Dolomite Portal Opening", titleFa: "افتتاح دروازه آبراهه دالومیت", badgeCategory: "legendary", badgeIcon: "🏔️", badgeNameFa: "پایان زیربنایی و پایدار", climaxEn: "City leaders open the artesian portal, securing an independent alpine water supply for future centuries.", climaxFa: "رهبران شهر دروازه جریان آرتزین را گشودند و امنیت آبی ونیز را برای قرن‌های آینده تضمین کردند.", xpReward: 265 },
  { pathCode: "BABAB", titleEn: "The City Hall Toast", titleFa: "سلامتی در تالار شهرداری", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان رسمی و پرنشاط", climaxEn: "Clinking glasses of pure mountain water, municipal leaders praise Elena and Marco's historic discovery.", climaxFa: "با نوشیدن آب زلال آلپ در تالار شهرداری، مدیران شهر از کشف تاریخی النا و مارکو تقدیر کردند.", xpReward: 245 },
  { pathCode: "BABBA", titleEn: "The Grand Academic Tour", titleFa: "تور علمی دانشگاه‌های جهان", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان علمی و معتبر", climaxEn: "Elena lectures at Harvard, Cambridge, and the Sorbonne on the secret hydrogeology of the Renaissance.", climaxFa: "النا در هاروارد، کمبریج و سوربن درباره آب‌زمین‌شناسی پنهان عصر رنسانس سخنرانی کرد.", xpReward: 260 },
  { pathCode: "BABBB", titleEn: "The Waters Beneath Venice", titleFa: "کتاب آب‌های زیرین ونیز", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان پرطرفدار و آموزنده", climaxEn: "Their popular science book spends twenty weeks atop national non-fiction bestseller lists.", climaxFa: "کتاب علمی آنها بیست هفته پیاپی در صدر فهرست پرفروش‌ترین کتاب‌های غیرداستانی کشور ماند.", xpReward: 250 },
  { pathCode: "BBAAA", titleEn: "Dancing on Dry Stones", titleFa: "شادی روی سنگ‌های خشک سن‌مارکو", badgeCategory: "legendary", badgeIcon: "💃", badgeNameFa: "پایان احساسی و تاریخی", climaxEn: "Venetians dance across the dry flagstones of Piazza San Marco during the highest tides in memory.", climaxFa: "مردم ونیز در بالاترین مدهای تاریخ روی سنگ‌فرش‌های کاملاً خشک میدان سن‌مارکو جشن گرفتند.", xpReward: 270 },
  { pathCode: "BBAAB", titleEn: "Bells of the Campanile", titleFa: "ناقوس‌های پیروزی برج سن‌مارکو", badgeCategory: "heroic", badgeIcon: "🔔", badgeNameFa: "پایان باشکوه و طنین‌انداز", climaxEn: "The five colossal bells ring in thunderous joy, their vibrations dampening the surging waters below.", climaxFa: "پنج ناقوس غول‌پیکر با شادمانی نواخته شدند و طنین آنها امواج خروشان آب را مهار کرد.", xpReward: 260 },
  { pathCode: "BBABA", titleEn: "The Coastal Resilience Program", titleFa: "برنامه بین‌المللی تاب‌آوری سواحل", badgeCategory: "scholar", badgeIcon: "🌍", badgeNameFa: "پایان آموزشی بین‌المللی", climaxEn: "Engineers from thirty sinking coastal cities study Venice's historic dampeners to protect their own shores.", climaxFa: "مهندسان سی شهر ساحلی جهان سیستم‌های ونیز را مطالعه کردند تا سواحل خود را نجات دهند.", xpReward: 255 },
  { pathCode: "BBABB", titleEn: "Advisors to the Climate Council", titleFa: "مشاوران شورای اقلیمی جهان", badgeCategory: "legendary", badgeIcon: "🛡️", badgeNameFa: "پایان عالی‌رتبه دیپلماتیک", climaxEn: "Elena and Marco address world leaders at COP, proving ancient wisdom holds the answers to modern crises.", climaxFa: "النا و مارکو در نشست اقلیمی ثابت کردند حکمت باستان پاسخگوی بزرگترین بحران‌های امروز است.", xpReward: 270 },
  { pathCode: "BBBAA", titleEn: "The Institute Ribbon", titleFa: "روبان افتتاح آموزشکده جهانی", badgeCategory: "heroic", badgeIcon: "✂️", badgeNameFa: "پایان بنیان‌گذاری ماندگار", climaxEn: "Cutting the ribbon to Palazzo Morosini's new institute, Elena and Marco dedicate their lives to heritage.", climaxFa: "با قیچی کردن روبان آموزشکده عمارت موروسینی، النا و مارکو زندگی خود را وقف میراث زمین کردند.", xpReward: 260 },
  { pathCode: "BBBAB", titleEn: "The Giocondo Memorial Library", titleFa: "کتابخانه یادبود جیوکوندو", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان گرانبهای پژوهشی", climaxEn: "The library houses ten thousand rare architectural folios, preserving Renaissance brilliance forever.", climaxFa: "کتابخانه ده هزار طومار و نسخه خطی نادر معماری را در خود جای داد تا نبوغ رنسانس زنده بماند.", xpReward: 250 },
  { pathCode: "BBBBA", titleEn: "The Moonlit Gondola", titleFa: "گوندولای نقره‌ای زیر مهتاب", badgeCategory: "legendary", badgeIcon: "🛶", badgeNameFa: "پایان شاعرانه و ماندگار", climaxEn: "Gliding across dark waters under moonlight, Elena and Marco hear the quiet breathing of the timeless city.", climaxFa: "با حرکت در کانال‌های آرام زیر نور نقره‌ای ماه، النا و مارکو نفس‌های آرام شهر جاودان را شنیدند.", xpReward: 270 },
  { pathCode: "BBBBB", titleEn: "The City That Will Never Sink", titleFa: "شهری که هرگز غرق نخواهد شد", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان اسطوره‌ای و نهایی", climaxEn: "With its ancient waterways restored and guardians vigilant, Venice stands eternal upon the blue waves.", climaxFa: "با احیای آبراه‌های باستانی و هوشیاری پاسدارانش، ونیز تا ابد با غرور بر فراز امواج آبی ایستاد.", xpReward: 275 },
];

export const story2ArchitectCipher: AdventureStory = buildAdventureStory({
  id: "b2-architect-cipher",
  storyIndex: 2,
  cefr: "B2",
  titleEn: "The Palazzo's Hidden Blueprint",
  titleFa: "راز پنهان عمارت قدیمی ونتیا",
  genre: "mystery",
  genreLabelFa: "🔍 معمایی و کنجکاوی",
  genreIcon: "🔍",
  synopsisEn:
    "Architectural conservator Elena discovers a Renaissance blueprint behind cellar masonry in a Venetian palazzo, revealing an unmapped network of vaulted canals. Unravel 32 mysterious endings!",
  synopsisFa:
    "النا، معمار و مرمت‌کار برجسته آثار باستانی، در حین بازسازی یک عمارت تاریخی قرن پانزدهمی در گراند کانال ونیز، زیر آجرچینی‌های زیرزمین به مهری سنگی و نقشه‌ای پوستی از کانال‌های پنهان زیر پایه‌های شهر برمی‌خورد! آیا با رمزگشایی کتیبه‌های باستانی راز این شاهکار مهندسی رنسانس را برملا می‌کنی و شهر را از مدهای ویرانگر نجات می‌دهی؟ ۳۲ پایان معمایی و هیجان‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b2-architect-cipher.webp",
  nodes,
  endings,
});
