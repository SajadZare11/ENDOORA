import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3 (B2 - Adult): Expedition Across the Red Dunes (سفر پرماجرا به کویر سرخ و شهرهای باستانی)
// Genre: Travel & Adventure (سفر و ماجراجویی)
// CEFR: B2 (Participle clauses, 3rd/mixed conditionals, passive voice, travel/expedition B2 vocab)
// Characters: Soraya (Field Geologist), David (Photographer), Kaan (Desert Navigator)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Having spent five weeks preparing their twin expedition 4x4 vehicles in Samarkand, field geologist Soraya and documentary photographer David were finally crossing the desolate crimson dunes of the Kyzylkum desert. Accompanying them was Kaan, an experienced nomadic navigator whose family had guided camel caravans across the Silk Road for generations. According to fragmented fourteenth-century Persian manuscripts in Soraya's possession, an unmapped monolithic oasis settlement named 'The Crimson Citadel' was carved directly into volcanic tuff cliffs within a hidden box canyon ahead.",
    keywords: [
      { word: "desolate", meaningFa: "خلوت، دورافتاده و بی‌آب‌وعلف", phonetic: "/ˈdesələt/" },
      { word: "monolithic", meaningFa: "تک‌سنگی، تراشیده‌شده از دل یک صخره یکپارچه", phonetic: "/ˌmɒnəˈlɪθɪk/" },
      { word: "tuff", meaningFa: "سنگ‌های آتشفشانی نرم و متخلخل قابل تراشیدن", phonetic: "/tʌf/" },
      { word: "manuscripts", meaningFa: "نسخه‌های خطی و کهن دست‌نویس", phonetic: "/ˈmænjuskrɪpts/" },
    ],
    question: {
      promptEn: "What was 'The Crimson Citadel' carved directly into according to the historical manuscripts?",
      promptFa: "طبق دست‌نوشته‌های تاریخی، «قلعه سرخ» مستقیماً درون چه چیزی تراشیده شده بود؟",
      options: [
        "Volcanic tuff cliffs within a hidden box canyon",
        "A floating iceberg in the ocean",
        "A pile of loose gravel on the roadside",
      ],
      correctIndex: 0,
      hintSnippet: "an unmapped monolithic oasis settlement named 'The Crimson Citadel' was carved directly into volcanic tuff cliffs",
      clueFa: "خط آخر رو نگاه کن دوست من؛ مستقیماً در دل صخره‌های آتشفشانی یک دره بن‌بست پنهان تراشیده شده بود.",
    },
    choiceA: {
      labelEn: "Navigate along the ancient dry riverbed wadi using satellite telemetry!",
      labelFa: "مسیر وادی (رودخانه خشک باستانی) رو با استفاده از موقعیت‌یاب ماهواره‌ای پیش بگیر!",
      descriptionFa: "بستر رودخانه‌های خشک معمولاً بهترین راه ورود به دره‌های پنهان است.",
    },
    choiceB: {
      labelEn: "Ascend the high ridgeline dunes to scout for desert wind carved landmarks!",
      labelFa: "از فراز تپه‌های شنی مرتفع بالا برو تا نشانه‌ها و قله‌های سنگی راهنما رو پیدا کنی!",
      descriptionFa: "دید گسترده ۳۶۰ درجه از تمام پهنه کویر سرخ.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Steering the heavy vehicles through the packed clay wadi, Soraya monitored ground-penetrating radar scans. Suddenly, the canyon narrowed dramatically between sheer crimson sandstone walls that blocked the scorching afternoon sun. Kaan raised a hand, pointing toward a natural rock arch ahead: weathered into the stone was an ancient Aramaic inscription beside an intact stone cistern where clear artesian water bubbled softly into a reed-fringed pool.",
    keywords: [
      { word: "wadi", meaningFa: "وادی، دره و بستر خشک رودخانه فصلی", phonetic: "/ˈwɑːdi/" },
      { word: "sheer", meaningFa: "بسیار پرشیب، عمودی و دیواره‌مانند", phonetic: "/ʃɪə/" },
      { word: "cistern", meaningFa: "آب‌انبار سنگی طبیعی یا دست‌ساز", phonetic: "/ˈsɪstən/" },
      { word: "reed-fringed", meaningFa: "احاطه‌شده با نیزارهای سرسبز کویری", phonetic: "/riːd frɪndʒd/" },
    ],
    question: {
      promptEn: "What bubbled into the reed-fringed pool beside the rock arch?",
      promptFa: "کنار طاق سنگی چه چیزی به آرامی درون حوضچه نیزار می‌جوشید؟",
      options: [
        "Clear artesian water",
        "Hot boiling mud",
        "Thick crude oil",
      ],
      correctIndex: 0,
      hintSnippet: "where clear artesian water bubbled softly into a reed-fringed pool",
      clueFa: "خط آخر رو بخون عزیزم؛ آب زلال و گوارای چشمه آرتزین طبیعی.",
    },
    choiceA: {
      labelEn: "Camp beside the ancient oasis pool to analyze the water's mineral signatures!",
      labelFa: "کنار حوضچه باصفای واحه کمپ بزنید و مواد معدنی آب چشمه رو آزمایش کنید!",
      descriptionFa: "استراحتی دلچسب زیر سایه خنک صخره‌ها پس از ساعت‌ها رانندگی در کویر.",
    },
    choiceB: {
      labelEn: "Hike through the narrow rock fissure behind the cistern to find the citadel portal!",
      labelFa: "از شکاف صخره‌ای باریک پشت آب‌انبار پیاده عبور کن تا دروازه قلعه رو پیدا کنی!",
      descriptionFa: "راهروی مخفی که به دل شهر صخره‌ای راه دارد.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Tackling the steep red crests tested their off-road differentials to the limit, but David's drone captured breathtaking golden-hour footage of endless sand ripples extending to the horizon. Looking through 10x telephoto binoculars, Kaan spotted three towering stone watchtowers standing like sentinels atop a secluded mesa five miles to the south, their carved loopholes catching the amber glow of the setting sun.",
    keywords: [
      { word: "differentials", meaningFa: "دیفرانسیل خودروهای آفرود دو دیفرانسیل", phonetic: "/ˌdɪfəˈrenʃlz/" },
      { word: "ripples", meaningFa: "چین و شکن‌ها و موج‌های ریز روی شن", phonetic: "/ˈrɪplz/" },
      { word: "sentinels", meaningFa: "دیده‌بانان و نگهبانان مراقب و هوشیار", phonetic: "/ˈsentɪnlz/" },
      { word: "loopholes", meaningFa: "روزنه‌ها و دریچه‌های تیراندازی در برج‌های کهن", phonetic: "/ˈluːphəʊlz/" },
    ],
    question: {
      promptEn: "What did Kaan spot standing atop the secluded mesa five miles south?",
      promptFa: "کان در بالای فلات صخره‌ای در پنج مایلی جنوب چه چیزی مشاهده کرد؟",
      options: [
        "Three towering stone watchtowers catching the setting sun",
        "A modern radar antenna",
        "A group of wild camels drinking soda",
      ],
      correctIndex: 0,
      hintSnippet: "spotted three towering stone watchtowers standing like sentinels atop a secluded mesa",
      clueFa: "خط ماقبل آخر رو ببین؛ سه برج دیده‌بانی سنگی باشکوه که زیر نور غروب می‌درخشیدند.",
    },
    choiceA: {
      labelEn: "Plot an off-road trajectory across the salt flats directly toward the watchtowers!",
      labelFa: "مسیر آفرود رو از میان نمک‌زارهای هموار مستقیماً به سمت برج‌های دیده‌بانی طراحی کن!",
      descriptionFa: "سرعت بالا در دشت مسطح قبل از تاریکی کامل شب.",
    },
    choiceB: {
      labelEn: "Launch high-altitude drone photogrammetry to create a 3D elevation map!",
      labelFa: "پهپاد فتوگرامتری رو به پرواز دربیار تا نقشه ارتفاعی سه‌بعدی از منطقه بسازه!",
      descriptionFa: "شناسایی موانع و پستی‌بلندی‌ها از ارتفاع بالا با دقتی میلی‌متری.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Pitching their expedition tents beneath the sheltering rock canopy, Soraya tested the water: it was sweet, icy, and saturated with calcium bicarbonate from deep underground aquifers. Around their campfire, Kaan brewed aromatic green tea with wild mountain cardamom, sharing legends of Silk Road merchants who had traded lapis lazuli and raw silk at this exact pool seven hundred years ago.",
    keywords: [
      { word: "aquifers", meaningFa: "سفره‌های آب زیرزمینی غنی در دل سنگ‌ها", phonetic: "/ˈækwɪfəz/" },
      { word: "cardamom", meaningFa: "دانه معطر هل سبز کوهی", phonetic: "/ˈkɑːdəməm/" },
      { word: "lapis lazuli", meaningFa: "سنگ لاجورد نیلگون گرانبها", phonetic: "/ˌlæpɪs ˈlæzjʊlaɪ/" },
    ],
    question: {
      promptEn: "What precious stone had Silk Road merchants traded at this pool centuries ago?",
      promptFa: "بازرگانان کهن جاده ابریشم قرن‌ها پیش چه سنگ گرانبهایی را در کنار این حوضچه معامله می‌کردند؟",
      options: [
        "Lapis lazuli",
        "Cheap red glass",
        "Ordinary granite",
      ],
      correctIndex: 0,
      hintSnippet: "merchants who had traded lapis lazuli and raw silk at this exact pool",
      clueFa: "خط آخر رو نگاه کن؛ سنگ لاجورد لاجوردی و ابریشم خام معامله می‌کردند.",
    },
    choiceA: {
      labelEn: "Examine the sandstone bedrock for merchant petroglyphs and trade seals!",
      labelFa: "بستر سنگی صخره‌ها رو برای یافتن سنگ‌نگاره‌ها و مهرهای تجاری کهن بررسی کن!",
      descriptionFa: "سنگ‌نوشته‌های بازرگانان پر از اسامی کاروان‌ها و مقاصد سفر است.",
    },
    choiceB: {
      labelEn: "Deploy night-vision infrared cameras around the waterhole to record desert fauna!",
      labelFa: "دوربین‌های دید در شب فروسرخ رو دور حوضچه نصب کن تا حیات‌وحش شبانه رو ثبت کنی!",
      descriptionFa: "گربه‌های شنی، روباه‌های کویری و پرندگان شب‌گرد به کنار آب می‌آیند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Squeezing through the narrow crevice with helmets and headlamps, Soraya, David, and Kaan emerged into a colossal subterranean amphitheater illuminated by shafts of starlight penetrating high natural chimneys. Carved into the monolithic red cliff was a multi-tiered troglodyte city complete with colonnaded facades, grain silos, and living quarters that could have housed two thousand souls.",
    keywords: [
      { word: "troglodyte", meaningFa: "غارنشین و معماری دست‌کند در دل صخره‌ها", phonetic: "/ˈtrɒɡlədaɪt/" },
      { word: "colonnaded", meaningFa: "دارای ستون‌های باوقار ردیفی متوالی", phonetic: "/ˌkɒləˈneɪdɪd/" },
      { word: "silos", meaningFa: "سیلوها و مخازن ذخیره‌سازی غلات", phonetic: "/ˈsaɪləʊz/" },
    ],
    question: {
      promptEn: "How many people could the multi-tiered carved city have housed?",
      promptFa: "شهر صخره‌ای چندطبقه ظرفیت سکونت چند نفر را داشته است؟",
      options: [
        "Two thousand souls",
        "Only five travelers",
        "Over two million people",
      ],
      correctIndex: 0,
      hintSnippet: "living quarters that could have housed two thousand souls",
      clueFa: "خط آخر رو بخون؛ ظرفیت سکونت دو هزار نفر را در خود داشت.",
    },
    choiceA: {
      labelEn: "Ascend the carved stone stairs to the central administrative council hall!",
      labelFa: "از پلکان سنگی تراشیده‌شده به سمت تالار مرکزی شورای حاکمان بالا برو!",
      descriptionFa: "کشف اسناد و کتیبه‌های تاریخی در قلب تالار تشریفات.",
    },
    choiceB: {
      labelEn: "Explore the lower subterranean grain storage vaults and ancient bakeries!",
      labelFa: "انبارها و سیلوهای غلات و تنورهای پخت نان باستانی زیرزمینی رو کاوش کن!",
      descriptionFa: "آشنایی با سیستم خودکفایی و ذخیره آذوقه کاروان‌های کهن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Crossing the flat white salt crust with steady tire momentum, they reached the foot of the ancient mesa just as dusk surrendered to a velvet starry night. The three sandstone watchtowers were linked by a fortified rampart carved seamlessly out of the mountain ridge, guarding an ancient mountain pass that once connected Central Asia to the Mediterranean.",
    keywords: [
      { word: "momentum", meaningFa: "شتاب، تکانه و سرعت پایدار خودرو در مسیر", phonetic: "/məˈmentəm/" },
      { word: "rampart", meaningFa: "استحکامات، بارو و دیواره دفاعی قلعه", phonetic: "/ˈræmpɑːt/" },
      { word: "seamlessly", meaningFa: "به طور یکپارچه و بدون هیچ درز و شکافی", phonetic: "/ˈsiːmləsli/" },
    ],
    question: {
      promptEn: "What did the fortified rampart and watchtowers once guard?",
      promptFa: "باروی دفاعی و برج‌های دیده‌بانی روزگاری از چه چیزی پاسداری می‌کردند؟",
      options: [
        "An ancient mountain pass connecting Central Asia to the Mediterranean",
        "A private golf course",
        "An airport runway",
      ],
      correctIndex: 0,
      hintSnippet: "guarding an ancient mountain pass that once connected Central Asia to the Mediterranean",
      clueFa: "خط آخر رو ببین عزیزم؛ از گردنه راهبردی کوهستانی که آسیای مرکزی را به مدیترانه وصل می‌کرد.",
    },
    choiceA: {
      labelEn: "Climb the northern watchtower to inspect the signal brazier beacons!",
      labelFa: "از برج دیده‌بانی شمالی بالا برو تا آتشدان‌های مخابره پیام نوری رو ببینی!",
      descriptionFa: "سیستم ارسال پیام تلگراف نوری قرن‌ها قبل از برق.",
    },
    choiceB: {
      labelEn: "Set up the high-resolution telescope to photograph the desert cosmos above the towers!",
      labelFa: "تلسکوپ حرفه‌ای رو برای عکاسی نجومی از ستارگان بالای برج‌ها تنظیم کن!",
      descriptionFa: "آسمان کویر بکرترین و درخشان‌ترین چشم‌انداز راه شیری رو به تصویر می‌کشه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "David's 3D photogrammetry drone stitched sixty thousand aerial snapshots into an ultra-high-definition topographical model. The screen revealed an immense concentric irrigation grid radiating four miles into the desert basin, proving that this arid canyon had once been a lush, terraced agricultural paradise fed by underground snowmelt canals.",
    keywords: [
      { word: "concentric", meaningFa: "هم‌مرکز، حلقه‌ای و منظم", phonetic: "/kənˈsentrɪk/" },
      { word: "irrigation", meaningFa: "آبیاری مزارع و مدیریت منابع آب", phonetic: "/ˌɪrɪˈɡeɪʃn/" },
      { word: "terraced", meaningFa: "پلکانی، تراس‌بندی‌شده در شیب کوهستان", phonetic: "/ˈterɪst/" },
    ],
    question: {
      promptEn: "What did the 3D aerial model reveal radiating across the desert basin?",
      promptFa: "مدل سه‌بعدی هوایی پهپاد چه چیزی را در دل دشت کویری نمایان ساخت؟",
      options: [
        "An immense concentric irrigation grid proving past lush agriculture",
        "A vast pile of metal scrap",
        "A modern highway with cars",
      ],
      correctIndex: 0,
      hintSnippet: "revealed an immense concentric irrigation grid radiating four miles into the desert basin",
      clueFa: "خط ماقبل آخر رو بخون؛ شبکه آبیاری هم‌مرکز عظیمی که نشان از سرسبزی باستانی منطقه داشت.",
    },
    choiceA: {
      labelEn: "Conduct core soil drilling to collect ancient fossilized pollen grains!",
      labelFa: "حفاری نمونه خاک انجام بده تا گرده‌های فسیلی گیاهان باستانی رو جمع‌آوری کنی!",
      descriptionFa: "بازسازی گونه‌های گیاهی که قرن‌ها پیش در این واحه می‌روییدند.",
    },
    choiceB: {
      labelEn: "Publish the irrigation blueprint in World Archaeological Review!",
      labelFa: "نقشه مهندسی آبیاری باستانی رو در نشریه باستان‌شناسی جهان منتشر کن!",
      descriptionFa: "اثبات شگفتی‌های کشاورزی هوشمند نیاکان جاده ابریشم.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Scraping away fine wind-blown sand along the bedrock with a soft camel-hair brush, Soraya unveiled over thirty carved inscriptions in Sogdian, Middle Persian, and Chinese calligraphy. One beautifully preserved inscription documented a diplomatic caravan carrying thirty chests of emeralds and saffron from Shiraz to Chang'an in the year 682 AD.",
    keywords: [
      { word: "calligraphy", meaningFa: "خوشنویسی و خطاطی هنرمندانه", phonetic: "/kəˈlɪɡrəfi/" },
      { word: "diplomatic", meaningFa: "دیپلماتیک و روابط سیاسی بین‌المللی", phonetic: "/ˌdɪpləˈmætɪk/" },
      { word: "caravan", meaningFa: "کاروان بازرگانی با اسب و شتر", phonetic: "/ˈkærəvæn/" },
    ],
    question: {
      promptEn: "What goods was the 682 AD diplomatic caravan carrying from Shiraz to Chang'an?",
      promptFa: "کاروان سال ۶۸۲ میلادی چه کالاهایی از شیراز به چانگ‌آن حمل می‌کرد؟",
      options: [
        "Thirty chests of emeralds and saffron",
        "Barrels of dry salted fish",
        "Bags of heavy river stones",
      ],
      correctIndex: 0,
      hintSnippet: "carrying thirty chests of emeralds and saffron from Shiraz to Chang'an in the year 682 AD",
      clueFa: "خط آخر رو نگاه کن؛ سی صندوق زمرد درخشان و زعفران اصیل ایرانی.",
    },
    choiceA: {
      labelEn: "Cast silicone impressions of the inscriptions for museum preservation!",
      labelFa: "از کتیبه‌ها قالب‌گیری سیلیکونی دقیق برای نگهداری در موزه ملی انجام بده!",
      descriptionFa: "ثبت بی‌نقص خطوط بدون کوچکترین فرسایش بر روی سنگ اصلی.",
    },
    choiceB: {
      labelEn: "Trace the trade route coordinates to locate the caravan's desert waystation!",
      labelFa: "مختصات کاروان رو دنبال کن تا ایستگاه استراحت بعدی در کویر رو پیدا کنی!",
      descriptionFa: "کشف کاروانسراهای دیگر در طول شاهراه باستانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The motion-activated infrared camera captured breathtaking footage under the desert moon: a mother sand cat with three playful kittens drinking peacefully from the crystal pool, alongside rare nocturnal desert jerboas. David whispered with reverence: 'This ancient oasis still sustains life in the heart of complete wilderness.'",
    keywords: [
      { word: "nocturnal", meaningFa: "شب‌زی و فعال در تاریکی شب", phonetic: "/nɒkˈtɜːnl/" },
      { word: "jerboas", meaningFa: "دوپای کویری و جانوران جهنده بیابان", phonetic: "/dʒɜːˈbəʊəz/" },
      { word: "reverence", meaningFa: "احترام، خشوع و شگفتی عمیق", phonetic: "/ˈrevərəns/" },
    ],
    question: {
      promptEn: "What rare animals did the infrared cameras capture drinking from the pool?",
      promptFa: "دوربین فروسرخ چه جانوران نادری را در حال نوشیدن آب از حوضچه ثبت کرد؟",
      options: [
        "A mother sand cat with three kittens and desert jerboas",
        "A pack of howling timber wolves",
        "A herd of polar bears",
      ],
      correctIndex: 0,
      hintSnippet: "a mother sand cat with three playful kittens drinking peacefully from the crystal pool, alongside rare nocturnal desert jerboas",
      clueFa: "خط دوم رو ببین؛ گربه شنی با سه بچه‌اش همراه با دوپاهای کویری.",
    },
    choiceA: {
      labelEn: "Propose designating the box canyon a Protected Wildlife & Heritage Sanctuary!",
      labelFa: "پیشنهاد ثبت دره به عنوان منطقه حفاظت‌شده حیات‌وحش و میراث باستانی رو ارائه بده!",
      descriptionFa: "پناهگاهی امن برای گونه‌های نادر جانوری و تاریخی.",
    },
    choiceB: {
      labelEn: "Publish an article titled 'The Living Oasis' in National Geographic Expeditions!",
      labelFa: "مقاله مصور «واحه زنده» رو در نشنال جئوگرافیک منتشر کن!",
      descriptionFa: "تصاویری شگفت‌انگیز که توجه جهان رو به حفظ کویر جلب می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Inside the central council chamber, Soraya illuminated a stone altar bearing a bronze astrolabe dial and an ivory cylinder containing rolled diplomatic letters written on pressed mulberry paper. The seals bore the personal crest of Queen Boran, proving that peace treaties were signed in this sanctuary during the seventh century.",
    keywords: [
      { word: "astrolabe", meaningFa: "اسطرلاب فلزی محاسبات ستاره‌شناسی", phonetic: "/ˈæstrəleɪb/" },
      { word: "mulberry", meaningFa: "درخت توت و کاغذ مرغوب سنتی توت", phonetic: "/ˈmʌlbəri/" },
      { word: "treaties", meaningFa: "معاهدات صلح و پیمان‌های بین‌المللی", phonetic: "/ˈtriːtiz/" },
    ],
    question: {
      promptEn: "Whose royal crest was stamped on the seventh-century peace letters?",
      promptFa: "نشان سلطنتی چه کسی بر نامه‌های صلح قرن هفتم میلادی مهر شده بود؟",
      options: [
        "The personal crest of Queen Boran",
        "A modern company logo",
        "A pirate skull flag",
      ],
      correctIndex: 0,
      hintSnippet: "The seals bore the personal crest of Queen Boran, proving that peace treaties were signed",
      clueFa: "خط آخر رو نگاه کن؛ نشان شخصی پوران‌دخت (Queen Boran) بود.",
    },
    choiceA: {
      labelEn: "Conserve the mulberry paper letters in hermetic argon gas chambers!",
      labelFa: "نامه‌های تاریخی رو درون کپسول‌های گاز آرگون محفوظ و نگهداری کنید!",
      descriptionFa: "حفظ اسناد تاریخی در برابر هرگونه اکسیداسیون و فرسایش.",
    },
    choiceB: {
      labelEn: "Translate the peace treaties for the International Institute of Diplomacy!",
      labelFa: "متن پیمان‌های صلح باستانی رو برای مؤسسه بین‌المللی دیپلماسی ترجمه کن!",
      descriptionFa: "نشان دادن تاریخ کهن صلح‌طلبی و همزیستی مسالمت‌آمیز تمدن‌ها.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "In the subterranean bakery, they discovered twenty beehive-shaped clay ovens, still holding charred remnants of ancient wild wheat loaves and sesame seed pots. Chemical residue analysis proved the citadel had operated as a self-sustaining refuge capable of feeding its population during year-long sandstorms.",
    keywords: [
      { word: "beehive-shaped", meaningFa: "به شکل کندوی زنبور عسل و گنبدی", phonetic: "/ˈbiːhaɪv ʃeɪpt/" },
      { word: "charred", meaningFa: "سوخته و نیم‌سوز شده در گذر قرن‌ها", phonetic: "/tʃɑːd/" },
      { word: "residue", meaningFa: "رسوبات و بقایای شیمیایی مواد", phonetic: "/ˈrezɪdjuː/" },
    ],
    question: {
      promptEn: "What did the subterranean bakery contain that was still intact?",
      promptFa: "نانوایی زیرزمینی چه بخش سالمی داشت که هنوز پابرجا مانده بود؟",
      options: [
        "Twenty beehive-shaped clay ovens with charred wheat loaves",
        "A modern electric microwave",
        "An empty steel freezer",
      ],
      correctIndex: 0,
      hintSnippet: "discovered twenty beehive-shaped clay ovens, still holding charred remnants of ancient wild wheat loaves",
      clueFa: "خط اول رو بخون؛ بیست تنور گنبدی گلی با بقایای نان‌های گندم وحشی.",
    },
    choiceA: {
      labelEn: "Cultivate the ancient preserved wheat grains in modern agricultural laboratories!",
      labelFa: "دانه‌های گندم باستانی نجات‌یافته رو در آزمایشگاه کشاورزی دوباره بکارید!",
      descriptionFa: "احیای گونه‌های گیاهی مقاوم به خشکی برای مبارزه با گرمایش زمین.",
    },
    choiceB: {
      labelEn: "Reconstruct an authentic Renaissance Silk Road bakery in the town museum!",
      labelFa: "نانوایی سنتی جاده ابریشم رو به صورت کامل در موزه شهر بازسازی کن!",
      descriptionFa: "پخت نان‌های باستانی با عطر و طعم هزار سال پیش برای بازدیدکنندگان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Inside the watchtower brazier, Kaan discovered an ingenious copper parabolic mirror array used to focus signal fires into intense directional light beams. By night, fires signaled across thirty leagues of desert; by day, mirrors flashed reflected sunlight from peak to peak with astonishing speed.",
    keywords: [
      { word: "parabolic", meaningFa: "مقعر و سهموی با تمرکز بالای نور", phonetic: "/ˌpærəˈbɒlɪk/" },
      { word: "leagues", meaningFa: "فرسنگ‌ها (واحد مسافت کهن)", phonetic: "/liːɡz/" },
      { word: "directional", meaningFa: "جهت‌دار و متمرکز در یک نقطه", phonetic: "/dəˈrekʃənl/" },
    ],
    question: {
      promptEn: "How did the watchtower send signals across thirty leagues of desert?",
      promptFa: "برج دیده‌بانی چگونه پیام‌ها را تا ۳۰ فرسنگ در کویر مخابره می‌کرد؟",
      options: [
        "By night with focused fires, and by day with parabolic mirror arrays",
        "By sending running messengers on foot",
        "By ringing a church bell",
      ],
      correctIndex: 0,
      hintSnippet: "By night, fires signaled across thirty leagues of desert; by day, mirrors flashed reflected sunlight",
      clueFa: "خط ماقبل آخر رو ببین؛ در شب با آتش متمرکز و در روز با بازتاب آینه‌های مقعر.",
    },
    choiceA: {
      labelEn: "Light a symbolic ceremonial lantern in the copper mirror array at twilight!",
      labelFa: "در هنگام غروب یک فانوس نمادین در مرکز آینه‌های مسی روشن کن!",
      descriptionFa: "پرتوی درخشان که پس از قرن‌ها دوباره در دل کویر جان می‌گیرد.",
    },
    choiceB: {
      labelEn: "Document the optical communication network for the History of Science Journal!",
      labelFa: "شبکه ارتباطات نوری کهن رو برای نشریه تاریخ علم مستندسازی کن!",
      descriptionFa: "اثبات اینکه بشر قرن‌ها پیش از فیبر نوری پیام‌های پرسرعت نوری می‌فرستاد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Framed by the monolithic sandstone ramparts, the Milky Way arched across the desert sky in breathtaking diamond grandeur. David captured a twelve-minute deep-sky exposure: the ancient towers stood in sharp silhouette against millions of glowing spiral galaxies.",
    keywords: [
      { word: "grandeur", meaningFa: "شکوه، عظمت و جلال بی‌پایان", phonetic: "/ˈɡrændʒə/" },
      { word: "exposure", meaningFa: "نوردهی طولانی در عکاسی حرفه‌ای نجومی", phonetic: "/ɪkˈspəʊʒə/" },
      { word: "silhouette", meaningFa: "تصویر ضد نور و سایه‌رخ مشکی", phonetic: "/ˌsɪluˈet/" },
    ],
    question: {
      promptEn: "What stood in sharp silhouette against the glowing galaxies in David's photograph?",
      promptFa: "در عکس دیوید چه چیزی به صورت سایه‌رخ در برابر کهکشان‌ها ایستاده بود؟",
      options: [
        "The ancient towers",
        "A line of modern electricity pylons",
        "A passing cargo train",
      ],
      correctIndex: 0,
      hintSnippet: "the ancient towers stood in sharp silhouette against millions of glowing spiral galaxies",
      clueFa: "خط آخر رو نگاه کن؛ برج‌های باستانی در برابر میلیون‌ها کهکشان می‌درخشیدند.",
    },
    choiceA: {
      labelEn: "Submit the astrophotography masterpiece to the Royal Astronomy Society!",
      labelFa: "این شاهکار عکاسی نجومی رو به انجمن سلطنتی نجوم ارسال کن!",
      descriptionFa: "عکسی که چشم هر بیننده‌ای رو مسحور عظمت کیهان می‌کنه.",
    },
    choiceB: {
      labelEn: "Print a gallery exhibition titled 'Sentinels of Eternity' across world capitals!",
      labelFa: "نمایشگاهی با عنوان «دیده‌بانان ابدیت» در پایتخت‌های جهان برپا کن!",
      descriptionFa: "معرفی زیبایی سحرانگیز کویر به مردم سراسر کره زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Core soil extraction confirmed that the ancient desert basin was once covered with pomegranate orchards, almond groves, and sweet melon terraces. Fossilized pollen demonstrated that ancient hydrologists had created an artificial microclimate capable of lowering ambient summer heat by eight degrees Celsius.",
    keywords: [
      { word: "microclimate", meaningFa: "ریزاقلیم و آب‌وهوای بومی خنک‌تر در یک منطقه خاص", phonetic: "/ˈmaɪkrəʊklaɪmət/" },
      { word: "ambient", meaningFa: "محیطی و دمای پیرامون", phonetic: "/ˈæmbiənt/" },
      { word: "fossilized", meaningFa: "فسیل‌شده در گذر اعصار", phonetic: "/ˈfɒsəlaɪzd/" },
    ],
    question: {
      promptEn: "By how many degrees Celsius did the ancient microclimate lower summer heat?",
      promptFa: "ریزاقلیم هوشمند باستانی دمای تابستان را چند درجه سانتی‌گراد خنک‌تر می‌کرد؟",
      options: [
        "By eight degrees Celsius",
        "By less than one degree",
        "It did not change the temperature",
      ],
      correctIndex: 0,
      hintSnippet: "lowering ambient summer heat by eight degrees Celsius",
      clueFa: "خط آخر رو بخون؛ هشت درجه سانتی‌گراد دمای محیط را خنک‌تر می‌کرد.",
    },
    choiceA: {
      labelEn: "Integrate ancient oasis microclimate engineering into modern desert greening projects!",
      labelFa: "مهندسی ریزاقلیم باستانی رو در پروژه‌های نوین بیابان‌زدایی به کار بگیر!",
      descriptionFa: "نجات مناطق خشک زمین با الهام از دانش گذشتگان.",
    },
    choiceB: {
      labelEn: "Publish a comparative climatological study in Science Environment Monthly!",
      labelFa: "پژوهش مقایسه‌ای اقلیم‌شناسی رو در ماهنامه معتبر علوم محیطی منتشر کن!",
      descriptionFa: "اثبات راهکارهای پایدار در مدیریت بحران گرمایش زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "The World Archaeological Review published the irrigation blueprint as its cover feature. International engineering teams acclaimed the four-mile concentric design as one of antiquity's greatest civil engineering achievements, comparing it to the Roman aqueducts and Persian qanats.",
    keywords: [
      { word: "antiquity", meaningFa: "دوران باستان و اعصار کهن تاریخ", phonetic: "/ænˈtɪkwəti/" },
      { word: "qanats", meaningFa: "قنات‌ها و کاریزهای شگفت‌انگیز ایرانی", phonetic: "/kəˈnɑːts/" },
      { word: "acclaimed", meaningFa: "تحسین کردند و با احترام ستودند", phonetic: "/əˈkleɪmd/" },
    ],
    question: {
      promptEn: "What did international engineering teams compare the concentric irrigation design to?",
      promptFa: "تیم‌های بین‌المللی مهندسی این سیستم آبیاری را با چه شاهکارهایی مقایسه کردند؟",
      options: [
        "Roman aqueducts and Persian qanats",
        "Modern plastic sprinkler hoses",
        "A simple wooden bucket",
      ],
      correctIndex: 0,
      hintSnippet: "comparing it to the Roman aqueducts and Persian qanats",
      clueFa: "خط آخر رو ببین؛ با آبراهه‌های رومی و قنات‌های شگفت‌انگیز ایرانی مقایسه کردند.",
    },
    choiceA: {
      labelEn: "Receive the UNESCO Masterwork of Human Creative Genius Award!",
      labelFa: "جایزه شاهکار نبوغ خلاق بشری یونسکو رو دریافت کنید!",
      descriptionFa: "بالاترین افتخار باستان‌شناسی و میراث جهانی.",
    },
    choiceB: {
      labelEn: "Spearhead a ten-year excavation masterplan with international universities!",
      labelFa: "رهبری طرح جامع کاوش ده‌ساله با دانشگاه‌های تراز اول جهان رو به دست بگیر!",
      descriptionFa: "آغاز فصلی بزرگ در کشف ناشناخته‌های تمدن باستان.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The silicone impressions revealed every delicate brushstroke of the Sogdian and Chinese characters. The national museum in Tashkent unveiled a permanent exhibition honoring the peace and prosperity of the ancient Silk Road.",
    keywords: [{ word: "prosperity", meaningFa: "رونق، شکوفایی و آبادانی اقتصادی", phonetic: "/prɒˈsperəti/" }],
    question: {
      promptEn: "Where was the permanent exhibition of the carved trade records unveiled?",
      promptFa: "نمایشگاه دائمی کتیبه‌های تجاری در کجا گشایش یافت؟",
      options: ["In the national museum in Tashkent", "In a local post office", "At a car repair garage"],
      correctIndex: 0,
      hintSnippet: "The national museum in Tashkent unveiled a permanent exhibition",
      clueFa: "در موزه ملی تاشکند به نمایش درآمد.",
    },
    choiceA: {
      labelEn: "Cut the ceremonial ribbon opening the 'Golden Road to Samarkand' wing!",
      labelFa: "روبان افتتاح تالار «جاده زرین به سمرقند» را قیچی کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Dedicate the catalog to desert nomads who kept the stories alive for centuries!",
      labelFa: "کاتالوگ علمی را به کوچ‌نشینان وفاداری که این خاطرات را حفظ کردند تقدیم کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Following the ancient caravan coordinates thirty miles west, Soraya and Kaan discovered a buried fortress waystation with intact clay jars holding ancient dried cloves and Persian pistachios.",
    keywords: [{ word: "waystation", meaningFa: "کاروانسرا و منزلگاه بین‌راهی", phonetic: "/ˈweɪsteɪʃn/" }],
    question: {
      promptEn: "What did the intact clay jars inside the fortress waystation hold?",
      promptFa: "خمره‌های سفالی سالم درون کاروانسرا حاوی چه موادی بودند؟",
      options: ["Ancient dried cloves and Persian pistachios", "Wet gray cement", "Seawater and shells"],
      correctIndex: 0,
      hintSnippet: "holding ancient dried cloves and Persian pistachios",
      clueFa: "میخک‌های معطر خشک‌شده و پسته‌های اصیل ایرانی.",
    },
    choiceA: {
      labelEn: "Photograph the spice artifacts for the World Food History Museum!",
      labelFa: "از این ظروف ادویه برای موزه تاریخ خوراک جهان عکاسی کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Toast with camel-milk tea to the boundless perseverance of desert merchants!",
      labelFa: "با چای شیر شتر به افتخار استقامت بی‌پایان بازرگانان کویر بنوشید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The Ministry of Environment declared the Crimson Canyon a National Biosphere Sanctuary, banning industrial mining and protecting the rare sand cat population forever.",
    keywords: [{ word: "biosphere", meaningFa: "زیست‌کره حفاظت‌شده تنوع زیستی", phonetic: "/ˈbaɪəʊsfɪə/" }],
    question: {
      promptEn: "What did the Ministry of Environment ban in Crimson Canyon?",
      promptFa: "وزارت محیط‌زیست چه فعالیتی را در دره سرخ ممنوع اعلام کرد؟",
      options: ["Industrial mining", "Walking on foot", "Bird watching"],
      correctIndex: 0,
      hintSnippet: "banning industrial mining and protecting the rare sand cat population forever",
      clueFa: "بهره‌برداری صنعتی از معادن را برای حفاظت از حیات‌وحش ممنوع کرد.",
    },
    choiceA: {
      labelEn: "Appoint Kaan as the Chief Honorary Ranger of the Crimson Canyon Sanctuary!",
      labelFa: "کان را به عنوان سرپرست افتخاری محیط‌بانان پناهگاه دره سرخ منصوب کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Construct solar-powered wildlife observation hideaways for ecological researchers!",
      labelFa: "دیده‌بانی‌های سازگار با خورشید برای پژوهشگران محیط‌زیست بسازید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "David's photograph of the mother sand cat drinking under the desert moon graced the cover of National Geographic, touching the hearts of forty million readers worldwide.",
    keywords: [{ word: "graced", meaningFa: "زینت بخشید و آراست", phonetic: "/ɡreɪst/" }],
    question: {
      promptEn: "What magazine cover did David's sand cat photograph grace?",
      promptFa: "عکس زیبای گربه شنی دیوید روی جلد کدام نشریه معتبر رفت؟",
      options: ["National Geographic", "A local newspaper flyer", "A fashion catalog"],
      correctIndex: 0,
      hintSnippet: "graced the cover of National Geographic, touching the hearts of forty million readers",
      clueFa: "روی جلد نشریه نشنال جئوگرافیک درخشید.",
    },
    choiceA: {
      labelEn: "Accept the International Wildlife Photographer of the Year Gold Medal!",
      labelFa: "مدال طلای برترین عکاس حیات‌وحش سال جهان را دریافت کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Establish a non-profit fund to preserve waterholes across Central Asian deserts!",
      labelFa: "صندوق خیریه‌ای برای احیا و حفظ آبشخورهای کویری در آسیای مرکزی تأسیس کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Sealed in argon glass vaults, the seventh-century peace charters signed by Queen Boran were displayed in the Louvre Museum, hailed as monuments to human diplomacy.",
    keywords: [{ word: "charters", meaningFa: "منشورها و اسناد رسمی معاهدات صلح", phonetic: "/ˈtʃɑːtəz/" }],
    question: {
      promptEn: "In which world-famous museum were Queen Boran's peace treaties displayed?",
      promptFa: "پیمان‌نامه‌های صلح پوران‌دخت در کدام موزه مشهور جهان به نمایش درآمد؟",
      options: ["The Louvre Museum in Paris", "A regional bus terminal", "A bank lobby"],
      correctIndex: 0,
      hintSnippet: "displayed in the Louvre Museum, hailed as monuments to human diplomacy",
      clueFa: "در موزه لوور پاریس به عنوان نماد دیپلماسی صلح بشریت به نمایش درآمد.",
    },
    choiceA: {
      labelEn: "Deliver the keynote address on ancient female rulers and peacemakers!",
      labelFa: "سخنرانی افتتاحیه را درباره حاکمان صلح‌جوی زن در دوران باستان ایراد کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Gift exact parchment facsimiles to the National Library in Tehran!",
      labelFa: "نسخه‌های فاکسیمیله نفیس از پوستین‌ها را به کتابخانه ملی اهدا کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The translation of the peace treaty was adopted by the United Nations Peace Council, proving that dialogue and mutual respect flourished along the Silk Road fourteen centuries ago.",
    keywords: [{ word: "mutual", meaningFa: "متقابل و دوطرفه", phonetic: "/ˈmjuːtʃuəl/" }],
    question: {
      promptEn: "What did the ancient treaty prove flourished along the Silk Road 14 centuries ago?",
      promptFa: "پیمان باستانی چه چیزی را ثابت کرد که ۱۴ قرن پیش در جاده ابریشم شکوفا بود؟",
      options: ["Dialogue and mutual respect", "Constant wars without end", "Only trading weapons"],
      correctIndex: 0,
      hintSnippet: "proving that dialogue and mutual respect flourished along the Silk Road fourteen centuries ago",
      clueFa: "گفتگو و احترام متقابل میان تمدن‌ها.",
    },
    choiceA: {
      labelEn: "Ring the Peace Bell at the UN Headquarters during the treaty commemoration!",
      labelFa: "ناقوس صلح سازمان ملل را در مراسم یادبود این پیمان تاریخی به صدا درآورید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Publish a multilingual peace edition distributed to schools worldwide!",
      labelFa: "نسخه چندزبانه کتابچه صلح باستان را در تمام مدارس جهان توزیع کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Agronomists successfully germinated the seventh-century wheat seeds. The ancient strain proved completely immune to modern crop rust and thrived with sixty percent less water.",
    keywords: [{ word: "germinated", meaningFa: "جوانه زد و سبز شد", phonetic: "/ˈdʒɜːmɪneɪtɪd/" }],
    question: {
      promptEn: "What remarkable agricultural trait did the ancient wheat strain display?",
      promptFa: "دانه گندم باستانی چه ویژگی شگفت‌انگیز کشاورزی از خود نشان داد؟",
      options: ["Immune to crop rust and thrived with 60% less water", "Died immediately", "Required twice as much water"],
      correctIndex: 0,
      hintSnippet: "immune to modern crop rust and thrived with sixty percent less water",
      clueFa: "مقاوم در برابر آفت‌ها و نیازمند شصت درصد آب کمتر.",
    },
    choiceA: {
      labelEn: "Distribute the resilient seed stock to dryland farmers facing desertification!",
      labelFa: "بذرهای مقاوم را میان کشاورزان مناطق در معرض خشکسالی توزیع کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Name the ancient crop 'Boran's Golden Wheat' in international gene banks!",
      labelFa: "نام دانه را در بانک‌های جهانی بذر «گندم زرین پوران» ثبت کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The reconstructed Silk Road bakery opened in Samarkand, baking fragrant loaves of ancient wild wheat. Visitors lined up for blocks to taste the authentic flavors of antiquity.",
    keywords: [{ word: "authentic", meaningFa: "اصیل، واقعی و دست‌نخورده", phonetic: "/ɔːˈθentɪk/" }],
    question: {
      promptEn: "What did visitors line up to taste at the reconstructed bakery?",
      promptFa: "بازدیدکنندگان برای چشیدن چه چیزی صف کشیدند؟",
      options: ["Authentic flavors of antiquity in ancient wild wheat loaves", "Processed sugary candy", "Cold soup"],
      correctIndex: 0,
      hintSnippet: "lined up for blocks to taste the authentic flavors of antiquity",
      clueFa: "طعم اصیل و باستانی نان‌های گندم وحشی جاده ابریشم.",
    },
    choiceA: {
      labelEn: "Host the International Artisan Bread Summit at the historical ovens!",
      labelFa: "همایش بین‌المللی نان سنتی را کنار تنورهای بازسازی‌شده برگزار کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Donate fifty freshly baked loaves daily to local senior care homes!",
      labelFa: "روزانه پنجاه قرص نان تازه داغ به سرای سالمندان شهر هدیه دهید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Lighting the copper mirror array at twilight, a focused beam of amber light cut forty miles across the desert darkness, answered seconds later by an echo flash from a distant peak.",
    keywords: [{ word: "echo", meaningFa: "پژواک و پاسخ بازتابی نور یا صدا", phonetic: "/ˈekəʊ/" }],
    question: {
      promptEn: "How far across the desert did the focused amber beam travel?",
      promptFa: "پرتوی متمرکز کهربایی تا چه مسافتی در تاریکی کویر نفوذ کرد؟",
      options: ["Forty miles across the desert darkness", "Only five meters", "One foot"],
      correctIndex: 0,
      hintSnippet: "cut forty miles across the desert darkness, answered seconds later",
      clueFa: "تا چهل مایل در دل شب کویر درخشید و قله روبرو پاسخ داد.",
    },
    choiceA: {
      labelEn: "Reactivate the ancient chain of optical fire towers as an annual festival beacon!",
      labelFa: "زنجیره باستانی برج‌های نوری را به عنوان جشنواره سالانه مشعل‌ها احیا کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Record a stunning drone video of the forty-mile light beam for world science channels!",
      labelFa: "ویدئوی هوایی خیره‌کننده‌ای از این پرتو ۴۰ مایلی برای رسانه‌های علمی جهان بگیرید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The Science History Journal published the detailed optical mechanics of the Silk Road parabolic mirrors, acclaiming them as the ancient world's fastest information highway.",
    keywords: [{ word: "mechanics", meaningFa: "سازوکارها و اصول فنی مکانیک", phonetic: "/məˈkænɪks/" }],
    question: {
      promptEn: "What did the journal acclaim the parabolic mirrors as?",
      promptFa: "نشریه علمی آینه‌های مقعر را به عنوان چه پدیده‌ای ستود؟",
      options: ["The ancient world's fastest information highway", "A simple cooking pot", "A decorative metal ornament"],
      correctIndex: 0,
      hintSnippet: "acclaiming them as the ancient world's fastest information highway",
      clueFa: "سریع‌ترین بزرگراه اطلاعاتی جهان باستان.",
    },
    choiceA: {
      labelEn: "Accept the Galileo Medal for Historical Technology Innovation in Florence!",
      labelFa: "مدال گالیله برای نوآوری‌های تاریخی علم را در فلورانس دریافت کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Install interactive optical signal mirrors in science centers worldwide!",
      labelFa: "آینه‌های تعاملی مخابره نور را در مراکز علمی و موزه‌های علوم جهان نصب کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "David's photograph won First Prize at the World Astronomy Photography Gala. The silhouette of the ancient watchtower against the galactic core hung permanently in London's Royal Observatory.",
    keywords: [{ word: "galactic", meaningFa: "کهکشانی و مربوط به قلب راه شیری", phonetic: "/ɡəˈlæktɪk/" }],
    question: {
      promptEn: "Where was David's award-winning astrophotograph permanently hung?",
      promptFa: "عکس نجومی برنده جایزه دیوید برای همیشه در کجا نصب شد؟",
      options: ["In London's Royal Observatory", "In a train baggage car", "At a subway station"],
      correctIndex: 0,
      hintSnippet: "hung permanently in London's Royal Observatory",
      clueFa: "در رصدخانه سلطنتی گرینویچ در لندن نصب شد.",
    },
    choiceA: {
      labelEn: "Lead a high-end astrophotography safari across the desert for young astronomers!",
      labelFa: "سافاری عکاسی نجومی در کویر برای رصدگران جوان ترتیب دهید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Donate print sales to fund desert astronomical research stations!",
      labelFa: "درآمد فروش تابلوهای عکس را برای ساخت رصدخانه‌های کویری اختصاص دهید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The 'Sentinels of Eternity' exhibition toured Paris, New York, Tokyo, and Rome. Millions of gallery visitors marveled at the timeless majesty of Silk Road desert monuments.",
    keywords: [{ word: "majesty", meaningFa: "عظمت، شکوه و والایی بی‌پایان", phonetic: "/ˈmædʒəsti/" }],
    question: {
      promptEn: "How many gallery visitors marveled at the exhibition across world capitals?",
      promptFa: "چند میلیون نفر از نمایشگاه دیده‌بانان ابدیت در پایتخت‌های جهان بازدید کردند؟",
      options: ["Millions of gallery visitors", "Ten tourists", "Only fifty students"],
      correctIndex: 0,
      hintSnippet: "Millions of gallery visitors marveled at the timeless majesty",
      clueFa: "میلیون‌ها بازدیدکننده در پاریس، نیویورک، توکیو و رم محو شکوه کویر شدند.",
    },
    choiceA: {
      labelEn: "Publish a luxury art monograph featuring David's complete desert portfolio!",
      labelFa: "کتاب مصور نفیس از مجموعه کامل عکس‌های کویر دیوید منتشر کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Advise international tourism boards on ethical, low-impact heritage travel!",
      labelFa: "به نهادهای گردشگری جهانی در زمینه سفرهای اخلاقی و حفظ محیط‌زیست مشاوره دهید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Integrating the ancient microclimate techniques, engineers lowered temperatures in modern desert greenhouses by seven degrees Celsius, drastically reducing power consumption.",
    keywords: [{ word: "consumption", meaningFa: "مصرف و اتلاف انرژی", phonetic: "/kənˈsʌmpʃn/" }],
    question: {
      promptEn: "What did integrating the ancient microclimate techniques drastically reduce?",
      promptFa: "تلفیق روش‌های خنک‌سازی باستانی چه چیزی را به شدت کاهش داد؟",
      options: ["Power consumption in modern desert greenhouses", "Vegetable growth", "Water cleanliness"],
      correctIndex: 0,
      hintSnippet: "drastically reducing power consumption",
      clueFa: "مصرف انرژی برق در گلخانه‌های کویری را به شدت کاهش داد.",
    },
    choiceA: {
      labelEn: "Present the findings to the World Renewable Energy Congress in Berlin!",
      labelFa: "یافته‌ها را در کنگره جهانی انرژی‌های تجدیدپذیر در برلین ارائه دهید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Build experimental solar-shaded melon orchards modeled on ancient terraces!",
      labelFa: "باغ‌های میوه پلکانی خورشیدی با الهام از تراس‌های باستانی احداث کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The published climatological study proved that ancient Silk Road civilizations practiced regenerative agriculture capable of halting and reversing creeping desertification.",
    keywords: [{ word: "desertification", meaningFa: "بیابان‌زایی و پیشروی شن‌های روان", phonetic: "/dɪˌzɜːtɪfɪˈkeɪʃn/" }],
    question: {
      promptEn: "What did the study prove ancient agricultural techniques could halt and reverse?",
      promptFa: "پژوهش نشان داد که روش‌های کهن کشاورزی چه روندی را متوقف و معکوس کردند؟",
      options: ["Creeping desertification", "Rainfall completely", "Plant flowering"],
      correctIndex: 0,
      hintSnippet: "halting and reversing creeping desertification",
      clueFa: "پیشروی بیابان‌ها و خشکسالی را متوقف و معکوس کردند.",
    },
    choiceA: {
      labelEn: "Award Soraya the Global Earth Stewardship Medal in Oslo!",
      labelFa: "مدال سرپرستی کره زمین را در اسلو به ثریا اهدا کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Launch a youth tree-planting movement along historic caravan paths!",
      labelFa: "پویش کاشت درخت در امتداد جاده‌های کاروانی کهن برای جوانان راه بیندازید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "UNESCO awarded the Masterwork of Human Creative Genius Trophy to the expedition team, placing the Crimson Citadel on the supreme World Heritage list alongside Petra and Machu Picchu.",
    keywords: [{ word: "supreme", meaningFa: "والاترین، عالی‌ترین و برجسته‌ترین", phonetic: "/suːˈpriːm/" }],
    question: {
      promptEn: "Alongside which famous ancient monuments was the Crimson Citadel placed?",
      promptFa: "قلعه سرخ در کنار کدام آثار باستانی مشهور در فهرست والای یونسکو قرار گرفت؟",
      options: ["Alongside Petra and Machu Picchu", "Next to a modern steel bridge", "Beside a city stadium"],
      correctIndex: 0,
      hintSnippet: "on the supreme World Heritage list alongside Petra and Machu Picchu",
      clueFa: "در کنار شهر پترا و ماچو پیچو به عنوان نمادهای نبوغ بشر ثبت شد.",
    },
    choiceA: {
      labelEn: "Lead the honorary international ribbon-cutting at the citadel portal!",
      labelFa: "روبان افتتاحیه رسمی درگاه قلعه باستانی را قیچی کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Host a global symposium inside the stone amphitheater under torchlight!",
      labelFa: "همایش جهانی باستان‌شناسی را در آمفی‌تئاتر سنگی زیر نور مشعل‌ها برگزار کنید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "As dawn ignited the red dunes in crimson fire, Soraya, David, and Kaan stood on the mesa summit, gazing at the restored oasis: a timeless testament to human courage and endurance.",
    keywords: [{ word: "endurance", meaningFa: "پایداری، صبوری و تاب‌آوری شگفت‌انگیز", phonetic: "/ɪnˈdjʊərəns/" }],
    question: {
      promptEn: "What was the restored desert oasis a timeless testament to?",
      promptFa: "واحه احیاشده کویری گواهی ابدی بر چه خصلت‌های انسانی بود؟",
      options: ["Human courage and endurance", "Fear and weakness", "Giving up easily"],
      correctIndex: 0,
      hintSnippet: "a timeless testament to human courage and endurance",
      clueFa: "شجاعت، استقامت و تاب‌آوری انسان در گذر قرن‌ها.",
    },
    choiceA: {
      labelEn: "Embrace in tears of triumph as the golden morning sun warms the ancient stones!",
      labelFa: "با اشک شوق پیروزی یکدیگر را در آغوش بگیرید و طلوع آفتاب بر سنگ‌های کهن را تماشا کنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Pack the expedition Land Rovers and set your compass toward the next uncharted horizon!",
      labelFa: "خودروهای آفرود را تجهیز کنید و قطب‌نما را به سمت افق ناشناخته بعدی تنظیم کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Golden Road to Samarkand", titleFa: "جاده زرین به سمرقند", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان تاریخی و باشکوه", climaxEn: "Cutting the ribbon to the museum wing, Soraya and Kaan cement the timeless friendship of nations along the Silk Road.", climaxFa: "با افتتاح تالار موزه، ثریا و کان پیوند دوستی همیشگی ملت‌های جاده ابریشم را جشن گرفتند.", xpReward: 270 },
  { pathCode: "AAAAB", titleEn: "Tribute to the Nomads", titleFa: "ستایش کوچ‌نشینان وفادار", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان اخلاقی و اصیل", climaxEn: "The catalog dedicates all discoveries to the nomadic wanderers who guarded desert history through oral tradition.", climaxFa: "کاتالوگ علمی، تمام افتخارات را به بادیه‌نشینانی تقدیم کرد که تاریخ کویر را سینه به سینه حفظ کردند.", xpReward: 250 },
  { pathCode: "AAABA", titleEn: "Cloves and Pistachios of Antiquity", titleFa: "میخک و پسته باستانی", badgeCategory: "explorer", badgeIcon: "🏺", badgeNameFa: "پایان کاوشگرانه برتر", climaxEn: "The fragrant sealed jars prove that trade networks spanned continents with astonishing sophistication.", climaxFa: "خمره‌های عطرآگین ثابت کردند بازرگانی کهن با ظرافتی شگفت‌آور قاره‌ها را به هم پیوند داده بود.", xpReward: 260 },
  { pathCode: "AAABB", titleEn: "The Caravan Toast", titleFa: "سلامتی کاروان‌های کهن", badgeCategory: "heroic", badgeIcon: "🍵", badgeNameFa: "پایان سنتی و پرصلابت", climaxEn: "Drinking tea under desert stars, the explorers salute the unbreakable endurance of ancient travelers.", climaxFa: "با نوشیدن چای زیر ستارگان کویر، کاشفان به استقامت پولادین کاروانیان باستان ادای احترام کردند.", xpReward: 245 },
  { pathCode: "AABAA", titleEn: "Chief Ranger of Crimson Canyon", titleFa: "سرپرست پناهگاه دره سرخ", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان پرافتخار بومی", climaxEn: "Kaan pins the ranger badge to his traditional nomadic robe, protecting the sacred canyon for future generations.", climaxFa: "کان نشان محیط‌بانی را بر ردای سنتی‌اش نصب کرد و پاسدار ابدی دره مقدس نیاکانش شد.", xpReward: 265 },
  { pathCode: "AABAB", titleEn: "Solar Sanctuaries of the Wild", titleFa: "دیده‌بانی‌های پاک خورشیدی", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان علمی و مدرن", climaxEn: "Researchers from forty countries study desert ecology inside non-intrusive solar-powered observation domes.", climaxFa: "پژوهشگران چهل کشور در دیده‌بانی‌های خورشیدی به مطالعه بوم‌شناسی کویر پرداختند.", xpReward: 250 },
  { pathCode: "AABBA", titleEn: "The National Geographic Cover", titleFa: "روی جلد نشنال جئوگرافیک", badgeCategory: "legendary", badgeIcon: "📸", badgeNameFa: "پایان مطبوعاتی جهانی", climaxEn: "David's sand cat portrait touches forty million hearts, inspiring global donations to save desert habitats.", climaxFa: "عکس زیبای گربه شنی قلب چهل میلیون خواننده را لرزاند و سیل کمک‌ها را برای نجات کویر سرازیر کرد.", xpReward: 275 },
  { pathCode: "AABBB", titleEn: "The Desert Waterhole Fund", titleFa: "صندوق احیای آبشخورهای کویر", badgeCategory: "scholar", badgeIcon: "💧", badgeNameFa: "پایان زیست‌محیطی", climaxEn: "The fund restores sixty historic natural desert springs, bringing endangered desert fauna back from the brink.", climaxFa: "این بنیاد شصت چشمه باستانی را احیا کرد و حیات‌وحش کمیاب کویر را از خطر انقراض نجات داد.", xpReward: 255 },
  { pathCode: "ABAAA", titleEn: "Queen Boran's Peace at the Louvre", titleFa: "صلح پوران‌دخت در لوور", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان دیپلماتیک جاودان", climaxEn: "Queen Boran's seventh-century charters are celebrated in Paris as a masterpiece of ancient diplomacy.", climaxFa: "منشور صلح پوران‌دخت در پاریس به عنوان شاهکار دیپلماسی و عدالت در تاریخ جهان تجلیل شد.", xpReward: 275 },
  { pathCode: "ABAAB", titleEn: "The Facsimiles of Tehran", titleFa: "نسخه‌های نفیس کتابخانه ملی", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان ماندگار فرهنگی", climaxEn: "The precise parchment facsimiles are housed in the National Archives, inspiring generations of historians.", climaxFa: "نسخه‌های نفیس در آرشیو ملی جای گرفتند تا چراغ راه نسل‌های آینده پژوهشگران تاریخ باشند.", xpReward: 250 },
  { pathCode: "ABABA", titleEn: "The UN Peace Bell Echo", titleFa: "طنین ناقوس صلح در سازمان ملل", badgeCategory: "legendary", badgeIcon: "🔔", badgeNameFa: "پایان بین‌المللی برتر", climaxEn: "The UN Peace Bell tolls in New York as Soraya reads Queen Boran's words: 'Justice unites all peoples.'", climaxFa: "ناقوس صلح در نیویورک نواخته شد در حالی که کلام پوران‌دخت خوانده شد: «عدالت تمام ملت‌ها را یکی می‌کند».", xpReward: 270 },
  { pathCode: "ABABB", titleEn: "The Global Peace Edition", titleFa: "کتابچه جهانی پیام صلح", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آموزشی و الهام‌بخش", climaxEn: "Ten million schoolchildren read the translated Silk Road treaties, learning that peace is humanity's oldest craft.", climaxFa: "ده میلیون دانش‌آموز پیمان صلح را خواندند و آموختند که آشتی کهن‌ترین هنر انسان است.", xpReward: 255 },
  { pathCode: "ABBAA", titleEn: "Boran's Golden Wheat", titleFa: "گندم زرین پوران‌دخت", badgeCategory: "legendary", badgeIcon: "🌾", badgeNameFa: "پایان کشاورزی حیاتی", climaxEn: "The drought-proof ancient wheat saves millions from famine across arid regions of the globe.", climaxFa: "گندم باستانی مقاوم در برابر خشکسالی میلیون‌ها انسان را در مناطق خشک جهان از قحطی نجات داد.", xpReward: 280 },
  { pathCode: "ABBAB", titleEn: "Gene Bank of Antiquity", titleFa: "بانک جهانی بذور باستان", badgeCategory: "scholar", badgeIcon: "🌱", badgeNameFa: "پایان نجات ژنتیک بومی", climaxEn: "The ancient wheat strain is permanently preserved in the Svalbard Global Seed Vault inside the Arctic ice.", climaxFa: "دانه گندم در خزانه جهانی بذر در دل یخ‌های قطب شمال برای همیشه حفظ شد.", xpReward: 260 },
  { pathCode: "ABBBA", titleEn: "The Artisan Hearth of Samarkand", titleFa: "تنورهای سنتی سمرقند", badgeCategory: "heroic", badgeIcon: "🥖", badgeNameFa: "پایان فرهنگی و پرطرفدار", climaxEn: "The aroma of wild wheat bread draws food lovers from around the world to Samarkand's old quarter.", climaxFa: "عطر نان گندم وحشی علاقه‌مندان به خوراک را از سراسر جهان به کوچه پس‌کوچه‌های سمرقند کشاند.", xpReward: 250 },
  { pathCode: "ABBBB", titleEn: "Loaves of Kindness", titleFa: "نان‌های گرم مهربانی", badgeCategory: "scholar", badgeIcon: "🍞", badgeNameFa: "پایان خیریه و صمیمانه", climaxEn: "Elderly residents enjoy steaming fresh loaves daily, sharing stories of past generations with open hearts.", climaxFa: "سالمندان هر روز نان تازه داغ نوش جان کردند و با دل‌های باز خاطرات گذشته را روایت کردند.", xpReward: 245 },
  { pathCode: "BAAAA", titleEn: "Beacons of the Desert Night", titleFa: "مشعل‌های شبانه کویر", badgeCategory: "legendary", badgeIcon: "🔥", badgeNameFa: "پایان شگفت‌انگیز نوری", climaxEn: "The forty-mile light beam reawakens an ancient chain of fire, celebrated annually by desert communities.", climaxFa: "پرتوی ۴۰ مایلی نور زنجیره کهن آتش را بیدار کرد و جشن سالانه جوامع کویری شد.", xpReward: 265 },
  { pathCode: "BAAAB", titleEn: "The Forty-Mile Light Beam", titleFa: "ویدئوی پرتو چهل مایلی", badgeCategory: "explorer", badgeIcon: "🎥", badgeNameFa: "پایان رسانه‌ای جذاب", climaxEn: "The viral drone footage of the optical beam traveling between peaks amasses eighty million views.", climaxFa: "ویدئوی هوایی عبور پرتو نور میان قله‌ها بیش از هشتاد میلیون بازدید در اینترنت کسب کرد.", xpReward: 255 },
  { pathCode: "BAABA", titleEn: "The Galileo Medal of Florence", titleFa: "مدال گالیله در فلورانس", badgeCategory: "scholar", badgeIcon: "🏅", badgeNameFa: "پایان تاریخی و افتخارآفرین", climaxEn: "Historians acclaim the parabolic mirror study as proof of advanced ancient telecommunication systems.", climaxFa: "تاریخ‌شناسان کشف آینه‌های مقعر را سندی از سیستم‌های ارتباطی فوق‌پیشرفته دوران باستان دانستند.", xpReward: 265 },
  { pathCode: "BAABB", titleEn: "Mirrors in the Museums", titleFa: "آینه‌های پیام‌رسان در موزه‌ها", badgeCategory: "scholar", badgeIcon: "🪞", badgeNameFa: "پایان آموزشی تعاملی", climaxEn: "Children in science centers across twenty nations flash light signals across galleries using replica mirrors.", climaxFa: "کودکان در موزه‌های بیست کشور با شبیه‌ساز آینه‌های باستانی پیام‌های نوری ارسال کردند.", xpReward: 250 },
  { pathCode: "BABAA", titleEn: "The Royal Astronomy Award", titleFa: "جایزه بزرگ نجوم لندن", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان نجومی شاهکار", climaxEn: "David's photograph of the desert watchtower beneath the galactic core becomes an international icon of wonder.", climaxFa: "تصویر برج باستانی در برابر هسته درخشان کهکشان به نماد جهانی شگفتی آسمان شب بدل شد.", xpReward: 275 },
  { pathCode: "BABAB", titleEn: "The Desert Astrophotography Safari", titleFa: "سافاری عکاسی نجومی در کویر", badgeCategory: "explorer", badgeIcon: "🔭", badgeNameFa: "پایان ماجراجویانه کویر", climaxEn: "Youth astronomers gather annually under pristine Kyzylkum skies to photograph deep-space nebulae.", climaxFa: "منجمان جوان هر سال زیر آسمان زلال کویر گرد آمدند تا سحابی‌های اعماق فضا را ثبت کنند.", xpReward: 255 },
  { pathCode: "BABBA", titleEn: "The Sentinels of Eternity Portfolio", titleFa: "کتاب نفیس دیده‌بانان ابدیت", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان لوکس و هنری", climaxEn: "The art book of desert watchtowers wins the Grand Prix of the International Publishing Arts.", climaxFa: "کتاب مصور برج‌های دیده‌بانی کویر جایزه بزرگ هنرهای چاپ و نشر جهان را از آن خود کرد.", xpReward: 260 },
  { pathCode: "BABBB", titleEn: "The Heritage Travel Protocol", titleFa: "پروتکل سفرهای اخلاقی میراث", badgeCategory: "heroic", badgeIcon: "🚙", badgeNameFa: "پایان پاسداری از طبیعت", climaxEn: "Strict guidelines protect delicate desert dunes while allowing travelers to experience ancient wonders.", climaxFa: "قوانین هوشمندانه از تپه‌های ماسه‌ای محافظت کردند و در عین حال راه را برای عاشقان سفر باز گذاشتند.", xpReward: 250 },
  { pathCode: "BBAAA", titleEn: "The Berlin Clean Energy Summit", titleFa: "همایش انرژی پاک برلین", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان مهندسی پایدار", climaxEn: "Ancient terraced microclimate engineering inspires modern passive cooling designs for desert architecture.", climaxFa: "مهندسی اقلیمی کهن الهام‌بخش ساخت سازه‌های خنک‌کننده بدون برق در معماری نوین کویر شد.", xpReward: 265 },
  { pathCode: "BBAAB", titleEn: "Orchards of the Sun", titleFa: "باغ‌های میوه خورشیدی", badgeCategory: "legendary", badgeIcon: "🍈", badgeNameFa: "پایان سرسبز و بارور", climaxEn: "Terraced melon orchards produce bountiful harvests with seventy percent less irrigation in the arid basin.", climaxFa: "باغ‌های پلکانی خربزه با هفتاد درصد آب کمتر محصولاتی بی‌نظیر و شیرین در کویر به بار آوردند.", xpReward: 260 },
  { pathCode: "BBABA", titleEn: "The Oslo Earth Stewardship Medal", titleFa: "مدال سرپرستی زمین در اسلو", badgeCategory: "legendary", badgeIcon: "🌍", badgeNameFa: "پایان عالی‌رتبه جهانی", climaxEn: "Soraya receives the highest international environmental honor for reviving ancient regenerative farming.", climaxFa: "ثریا بالاترین نشان محیط‌زیست جهان را برای احیای کشاورزی پایدار گذشتگان بر سینه زد.", xpReward: 275 },
  { pathCode: "BBABB", titleEn: "The Green Caravan Movement", titleFa: "پویش کاروان‌های سبز", badgeCategory: "heroic", badgeIcon: "🌳", badgeNameFa: "پایان پرشور جوانان", climaxEn: "A million young volunteers plant drought-resistant trees along thousand-mile Silk Road heritage paths.", climaxFa: "یک میلیون جوان داوطلب در امتداد جاده‌های کاروانی درختان مقاوم کاشتند و کویر را سرسبز کردند.", xpReward: 260 },
  { pathCode: "BBBAA", titleEn: "The Ribbon of the Crimson Portal", titleFa: "روبان دروازه قلعه سرخ", badgeCategory: "legendary", badgeIcon: "✂️", badgeNameFa: "پایان جاودانه افتتاح", climaxEn: "Cutting the ribbon alongside world leaders, the explorers unveil an architectural marvel to humanity.", climaxFa: "با بریدن روبان کنار رهبران جهان، کاشفان شاهکاری معماری را به پیشگاه بشریت تقدیم کردند.", xpReward: 275 },
  { pathCode: "BBBAB", titleEn: "The Torchlight Symposium", titleFa: "همایش باستان‌شناسی زیر نور مشعل‌ها", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان دراماتیک و باستانی", climaxEn: "Five hundred archaeologists discuss the future of exploration inside the ancient carved stone amphitheater.", climaxFa: "پانصد باستان‌شناس آینده کاوشگری را درون آمفی‌تئاتر سنگی دست‌کند زیر نور مشعل‌ها به بحث گذاشتند.", xpReward: 265 },
  { pathCode: "BBBBA", titleEn: "The Golden Sunrise Embrace", titleFa: "آغوش پیروزی در طلوع زرین", badgeCategory: "heroic", badgeIcon: "🌅", badgeNameFa: "پایان احساسی و پرغرور", climaxEn: "Tears of joy wash away weeks of sandstorm fatigue as dawn bathes the ancient citadel in gold.", climaxFa: "اشک شوق خستگی هفته‌ها طوفان شن را شست و طلوع آفتاب قلعه کهن را غرق در نور زرین کرد.", xpReward: 270 },
  { pathCode: "BBBBB", titleEn: "The Eternal Desert Pioneers", titleFa: "پیشگامان همیشگی افق‌های ناشناخته", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان اسطوره‌ای و ابدی", climaxEn: "With their expedition complete, Soraya, David, and Kaan set their compass toward the next uncharted horizon.", climaxFa: "با پایان این سفر بزرگ، ثریا، دیوید و کان قطب‌نما را به سمت افق ناشناخته بعدی تنظیم کردند.", xpReward: 280 },
];

export const story3SilkRoad: AdventureStory = buildAdventureStory({
  id: "b2-silk-road-expedition",
  storyIndex: 3,
  cefr: "B2",
  titleEn: "Expedition Across the Red Dunes",
  titleFa: "سفر پرماجرا به کویر سرخ و شهرهای باستانی",
  genre: "travel",
  genreLabelFa: "🏕️ سفر و ماجراجویی",
  genreIcon: "🏕️",
  synopsisEn:
    "Geologist Soraya and photographer David traverse the Kyzylkum desert with a nomadic navigator, hunting for a monolithic carved citadel along the Silk Road across 32 adventurous endings!",
  synopsisFa:
    "زمین‌شناس برجسته، ثریا، و عکاس مستند، دیوید، به همراه راهنمای کارکشته بادیه‌نشین، کان، با خودروهای مجهز آفرود به دل کویر سرخ و ریگزارهای قزل‌قوم می‌زنند تا بر اساس نسخه‌های خطی قرن هفتم هجری، قلعه و شهر صخره‌ای دست‌کند «دژ سرخ» را در دل صخره‌های آتشفشانی کشف کنند! آیا راز پیمان‌های صلح پوران‌دخت، قنات‌های باستانی و ارتباطات نوری کهن را آشکار می‌کنی؟ ۳۲ پایان ماجراجویانه در انتظارته!",
  coverImage: "/images/skills/reading/b2-silk-road.webp",
  nodes,
  endings,
});
