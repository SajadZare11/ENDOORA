import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3 (C2 - Adult Mastery): Passage Through the Karakoram Abyss (سفر اکتشافی به گذرگاه دست‌نیافتنی قراقروم)
// Genre: Travel & Adventure (سفر و ماجراجویی) -> type: "travel"
// CEFR: C2 (High-alpine mountaineering diction, literary inversion, complex participial syntax, subjunctive mood)
// Characters: Dr. Tariq Vance (High-Altitude Geomorphologist), Maya Sterling (Glacial Cartographer)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Hardly had the twilight indigo faded over the Siachen Glacier when a shrieking katabatic squall swept across the knife-edge arête of the Karakoram. Clinging to the frozen granite col at 6,400 meters, Dr. Tariq Vance anchored their twin titanium ice screws into blue glacial firn, shielding his frost-rimed visor from wind gusts exceeding eighty knots. Beside him, Glacial Cartographer Maya Sterling stabilized their satellite LiDAR array, analyzing thermal anomalies pulsating beneath a vertical ice precipice. The data was unequivocal: thirty meters inside the hanging glacier lay an unmapped thermal chasm kept liquid by volcanic fumaroles, bypassed by mountaineers for two centuries. Through a crystalline fracture in the serac wall, a cavernous aperture glowed with eerie sapphire luminescence, its walls bearing petroglyphs carved by ancient Sogdian caravaners who crossed this perilous pass during the Bronze Age.",
    keywords: [
      { word: "katabatic", meaningFa: "باد فروباد یا سرازیرشونده، تندبادهای سرد و پرشتاب کوهستانی", phonetic: "/ˌkætəˈbætɪk/" },
      { word: "arête", meaningFa: "یال تیغه‌ای باریک و تیز میان دو دره یال کوهستان", phonetic: "/əˈreɪt/" },
      { word: "fumaroles", meaningFa: "فومارول‌ها، دهانه‌های گازفشان و گرمابی زمین‌ساختی", phonetic: "/ˈfjuːmərəʊlz/" },
      { word: "serac", meaningFa: "سِراک، برج یا تیغه عظیم و ناپایدار یخی در یخچال", phonetic: "/ˈseəræk/" },
    ],
    question: {
      promptEn: "What extraordinary geological phenomenon was revealed beneath the hanging glacier?",
      promptFa: "چه پدیده خارق‌العاده زمین‌شناسی زیر یخچال آویزان شناسایی شد؟",
      options: [
        "An unmapped thermal chasm kept liquid by volcanic fumaroles, containing ancient Sogdian petroglyphs",
        "A buried military bunker from the First World War containing frozen armaments",
        "A frozen riverbed containing solid veins of alluvial gold",
      ],
      correctIndex: 0,
      hintSnippet: "an unmapped thermal chasm kept liquid by volcanic fumaroles, bypassed by mountaineers for two centuries",
      clueFa: "خط ششم و هفتم رو ببین دوست من؛ یک شکاف گرمابی ناشناخته بود که با گازهای آتشفشانی گرم مانده بود و سنگ‌نگاره‌های کاروان‌های باستانی سغدی رو در خود داشت!",
    },
    choiceA: {
      labelEn: "Rappel down the vertical ice fracture directly into the geothermal sapphire sanctuary!",
      labelFa: "با طناب صعود و فرود مستقیم از شکاف عمودی یخ به داخل این پناهگاه گرمابی فرود بیا!",
      descriptionFa: "پناه گرفتن فوری از کولاک مرگبار در گرمای پناهگاه باستانی زیر یخ‌ها.",
    },
    choiceB: {
      labelEn: "Establish a bivouac ledge on the granite lee to map the crevasse fissure using micro-drones!",
      labelFa: "روی دیواره گرانیتی در پناه باد جان‌پناه بساز و با ریزپهپاد شکاف یخی را اسکن کن!",
      descriptionFa: "رویکردی محتاطانه برای ارزیابی پایداری یخچال پیش از ورود به دالان‌های عمیق.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Tariq clipped into the dynamic twin ropes and rappelled sixty feet through the crystalline sapphire chimney. The shriek of the blizzard abruptly vanished, supplanted by the soothing resonance of subterranean thermal springs cascading into jade-colored basins. The ambient temperature hovered at a mild fourteen degrees Celsius, while steam rose from moss-covered basalt shelves. Maya switched off her thermal headlamp; phosphorescent algae blanketed the cavern roof, illuminating bas-relief carvings of winged Bactrian camels and solar discs etched into the living rock three thousand years ago.",
    keywords: [
      { word: "supplanted", meaningFa: "جایگزین شد، جای خود را به دیگری داد", phonetic: "/səˈplɑːntɪd/" },
      { word: "phosphorescent", meaningFa: "فسفرسانس، شب‌تاب و تابنده نور در تاریکی", phonetic: "/ˌfɒsfəˈresnt/" },
      { word: "bas-relief", meaningFa: "نقش‌برجسته کم‌عمق بر روی سنگ یا دیواره", phonetic: "/ˌbɑː rɪˈliːf/" },
      { word: "resonance", meaningFa: "طنین، انعکاس گوش‌نواز و عمیق صدا", phonetic: "/ˈrezənəns/" },
    ],
    question: {
      promptEn: "What astonishing atmospheric transition occurred inside the geothermal cavern?",
      promptFa: "چه تغییر جوی باورنکردنی درون غار زمین‌گرمایی رخ داد؟",
      options: [
        "The howling blizzard ceased, replaced by mild steam, thermal springs, and phosphorescent algae",
        "The cavern filled with suffocating toxic sulfur fumes",
        "The ice ceiling collapsed under the weight of the raging avalanche",
      ],
      correctIndex: 0,
      hintSnippet: "The shriek of the blizzard abruptly vanished, supplanted by the soothing resonance of subterranean thermal springs",
      clueFa: "خط دوم و سوم رو نگاه کن؛ زوزه کولاک قطع شد و دمای مطبوع ۱۴ درجه، چشمه‌های آب گرم و جلبک‌های شب‌تاب نمایان شدند!",
    },
    choiceA: {
      labelEn: "Follow the jade subterranean stream toward a natural stone bridge spanning a steaming canyon!",
      labelFa: "مسیر جویبار یشمی زیرزمینی را به سوی پل سنگی طبیعی روی دره بخارآلود دنبال کن!",
      descriptionFa: "پیشروی در اعماق غار برای یافتن گذرگاه باستانی که از دل کوهستان عبور می‌کند.",
    },
    choiceB: {
      labelEn: "Sample the endemic moss and hot spring water to document the isolated geothermal biosphere!",
      labelFa: "از خزه بومی و آب چشمه نمونه‌برداری کن تا این زیست‌بوم ایزوله کوهستانی ثبت علمی شود!",
      descriptionFa: "کشف گونه‌های زیستی که هزاران سال در انزوای کامل یخچالی تکامل یافته‌اند.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Huddled inside their four-season technical tent anchored into the granite headwall, Maya piloted the autonomous infrared micro-drone through the ice crevice. The telemetry video feed revealed a breathtaking geological spectacle: the crevasse did not plunge into an abyssal dead-end, but acted as a natural wind chimney leading into an expansive trans-mountain transit corridor connecting Pakistan with the high plateaus of Central Asia. Furthermore, thermal sensors detected ancient petroglyphs lining the tunnel walls alongside preserved wooden trail markers left by merchant caravans.",
    keywords: [
      { word: "bivouac", meaningFa: "جان‌پناه موقت در کوهستان، شب‌مانی در شرایط سخت بدون چادر کامل", phonetic: "/ˈbɪvuæk/" },
      { word: "telemetry", meaningFa: "داده‌های سنجش از دور و ارسال بی‌سیم اطلاعات", phonetic: "/təˈlemətri/" },
      { word: "spectacle", meaningFa: "منظره باشکوه و حیرت‌انگیز، تماشایی", phonetic: "/ˈspektəkl/" },
      { word: "headwall", meaningFa: "دیواره صخره‌ای سرپایینی در انتهای یک دره یال یخچالی", phonetic: "/ˈhedwɔːl/" },
    ],
    question: {
      promptEn: "What breakthrough did the infrared micro-drone telemetry reveal about the crevasse?",
      promptFa: "داده‌های ارسالی پهپاد فروسرخ چه راز مهمی را درباره این شکاف یخی فاش کرد؟",
      options: [
        "It was a trans-mountain transit corridor with ancient merchant trail markers",
        "It was a collapsed ice shaft that posed an imminent structural collapse",
        "It led to an abandoned uranium mining tunnel from the Cold War",
      ],
      correctIndex: 0,
      hintSnippet: "an expansive trans-mountain transit corridor connecting Pakistan with the high plateaus of Central Asia",
      clueFa: "خط چهارم و پنجم رو ببین رفیق؛ یک گذرگاه ترانزیتی از دل کوه بود که نشانه‌های راهنمای کاروان‌های باستانی بازرگانان در آن سالم مانده بود!",
    },
    choiceA: {
      labelEn: "Pack the bivouac and enter the corridor while the morning weather window holds!",
      labelFa: "کمپ را جمع کن و تا پنجره هوای مساعد صبحگاهی باز است وارد این راهرو شگفت‌انگیز شو!",
      descriptionFa: "پیمایش سریع مسیر برای رسیدن به آن سوی رشته‌کوه قراقروم.",
    },
    choiceB: {
      labelEn: "Deploy seismic ground-sensors along the granite ridge to monitor avalanche risks!",
      labelFa: "حسگرهای لرزه‌نگار روی یال سنگی کار بگذار تا خطر ریزش بهمن به دقت پایش شود!",
      descriptionFa: "تضمین امنیت کامل مسیر بازگشت و ایمنی زمین‌شناختی تیم کاوش.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Crossing the natural limestone bridge suspended above the thermal abyss, Tariq and Maya entered the 'Chamber of the Great Sirdar'. Carved into a colossal obsidian wall was a bilingual inscription in Sogdian and ancient Gandhari script, declaring this passage the 'Sacred Starlight Road' charted by King Kanishka’s geographers in the first century AD. At the foot of the inscription stood an intact bronze urn sealed with mountain pitch, its surface embossed with astronomical zodiac constellations.",
    keywords: [
      { word: "obsidian", meaningFa: "شیشه آتشفشانی سیاه، سنگ ابسیدین صیقلی و براق", phonetic: "/əbˈsɪdiən/" },
      { word: "bilingual", meaningFa: "دوزبانه، به دو زبان نگاشته‌شده", phonetic: "/ˌbaɪˈlɪŋɡwəl/" },
      { word: "embossed", meaningFa: "برجسته‌کاری‌شده، دارای نقوش برجسته فلزی", phonetic: "/ɪmˈbɒst/" },
      { word: "sirdar", meaningFa: "سردار، راهنمای ارشد یا رهبر کاروان‌های کهن کوهستان", phonetic: "/sɜːˈdɑː(r)/" },
    ],
    question: {
      promptEn: "What historical inscription was carved into the obsidian wall of the chamber?",
      promptFa: "چه کتیبه تاریخی روی دیواره سنگ ابسیدین سیاه تالار نقش بسته بود؟",
      options: [
        "A bilingual inscription declaring the passage the 'Sacred Starlight Road' of King Kanishka",
        "A warning by Genghis Khan commanding troops not to cross the glacial col",
        "A Tibetan poem lamenting the loss of an imperial yak herd",
      ],
      correctIndex: 0,
      hintSnippet: "declaring this passage the 'Sacred Starlight Road' charted by King Kanishka’s geographers",
      clueFa: "خط دوم و سوم رو نگاه کن؛ کتیبه‌ای دوزبانه بود که این راه را 'راه مقدس نور ستارگان' نامیده بود که جغرافی‌دانان شاه کانیشکا ثبت کرده بودند!",
    },
    choiceA: {
      labelEn: "Analyze the sealed bronze urn using non-destructive handheld X-ray radiography!",
      labelFa: "استوانه برنجی پلمب‌شده را با رادیوگرافی اشعه ایکس بدون باز کردن پلمب بررسی کن!",
      descriptionFa: "کشف محتویات ارزشمند داخل کوزه برنجی بدون کوچک‌ترین خدشه به قیر طبیعی.",
    },
    choiceB: {
      labelEn: "Trace and photogrammetrically scan the bilingual inscription for linguistic analysis!",
      labelFa: "کتیبه دوزبانه را با اسکن فتوگرامتری سه‌بعدی برای تحلیل زبان‌شناسی ثبت کن!",
      descriptionFa: "ثبت متنی بی‌نظیر که حلقه مفقوده ارتباط زبانی و تجاری آسیا را روشن می‌کند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Laboratory analysis on the thermal algae and moss cultures revealed an unprecedented extremophile bacterium capable of synthesizing heat-shock proteins that prevent cellular freezing at sub-zero temperatures. Maya realized this microbiological organism held revolutionary potential for cryopreservation and organ transplantation medicine. Tariq carefully stored the biological specimens in cryogenic vacuum canisters, sealing them with liquid nitrogen.",
    keywords: [
      { word: "extremophile", meaningFa: "شدت‌دوست، ریزجانداری که در شرایط دمایی یا فشاری حاد زندگی می‌کند", phonetic: "/ɪkˈstremiəʊfaɪl/" },
      { word: "cryopreservation", meaningFa: "انجمادزیستی، نگهداری بافت‌ها و سلول‌های زنده در سرمای شدید", phonetic: "/ˌkraɪəʊˌprezəˈveɪʃn/" },
      { word: "canisters", meaningFa: "کپسول‌ها و مخازن فلزی عایق‌بندی‌شده", phonetic: "/ˈkænɪstəz/" },
      { word: "unprecedented", meaningFa: "بی‌سابقه، بی‌مانند در تاریخ علم", phonetic: "/ʌnˈpresɪdentɪd/" },
    ],
    question: {
      promptEn: "What revolutionary medical potential did the extremophile bacteria possess?",
      promptFa: "باکتری شدت‌دوست کشف‌شده در آب گرم چه پتانسیل پزشکی انقلابی داشت؟",
      options: [
        "Synthesizing proteins preventing cellular freezing, with major potential for organ transplants",
        "Producing natural antibiotics capable of dissolving synthetic plastics",
        "Purifying heavy metals from contaminated glacial meltwater",
      ],
      correctIndex: 0,
      hintSnippet: "capable of synthesizing heat-shock proteins that prevent cellular freezing... potential for cryopreservation and organ transplantation",
      clueFa: "خط دوم و سوم رو ببین؛ پروتئینی ترشح می‌کرد که مانع یخ‌زدگی سلول‌ها می‌شد و تحولی در پیوند اعضا به شمار می‌رفت!",
    },
    choiceA: {
      labelEn: "Safeguard the specimens for an international medical research consortium!",
      labelFa: "نمونه‌های زیستی را برای کنسرسیوم بین‌المللی پژوهش‌های پزشکی ایمن کن!",
      descriptionFa: "اهدای کشفی نجات‌بخش به علم پزشکی برای نجات جان هزاران بیمار نیازمند پیوند عضو.",
    },
    choiceB: {
      labelEn: "Map the microclimatic geothermal vent network feeding the cavern's ecosystem!",
      labelFa: "شبکه روزنه‌های گرمابی تغذیه‌کننده این اکوسیستم را با سنسورها نقشه‌برداری کن!",
      descriptionFa: "درک مکانیزم زمین‌شناختی که این بهشت حرارتی را در دل یخ زنده نگه داشته است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Entering the trans-mountain transit corridor under the azure morning sky, Tariq and Maya discovered carved granite steps winding through a natural wind tunnel. At the southern portals of the passage, the view exploded in panoramic majesty: the jagged crowns of K2, Broad Peak, and the Gasherbrum massif rose like titans of ice against the indigo stratosphere. Resting beside a cairn of prayer stones lay a cache of ancient Chinese silk fragments embroidered with astronomical charts of the Northern Dipper.",
    keywords: [
      { word: "massif", meaningFa: "توده کوهستانی عظیم و فشرده با چندین قله مرتفع", phonetic: "/mæˈsiːf/" },
      { word: "cairn", meaningFa: "پشته سنگی، سنگ‌چین یادبود یا راهنما در مسیرهای کوهنوردی", phonetic: "/keən/" },
      { word: "stratosphere", meaningFa: "استراتوسفر، لایه بالایی جو با آسمانی به رنگ نیلی سیر", phonetic: "/ˈstrætəsfɪə(r)/" },
      { word: "cache", meaningFa: "انبار مخفی، ذخیره پنهان‌شده اشیای باارزش", phonetic: "/kæʃ/" },
    ],
    question: {
      promptEn: "What ancient artifacts were discovered beside the prayer stone cairn?",
      promptFa: "کنار سنگ‌چین یادبود در گذرگاه چه اشیای باستانی ارزشمندی پیدا شد؟",
      options: [
        "Chinese silk fragments embroidered with astronomical charts of the Northern Dipper",
        "A rusted bronze sword belonging to Alexander the Great's vanguard",
        "A leather pouch containing dried Tibetan tea leaves and silver coins",
      ],
      correctIndex: 0,
      hintSnippet: "a cache of ancient Chinese silk fragments embroidered with astronomical charts of the Northern Dipper",
      clueFa: "خط آخر رو نگاه کن دوست من؛ تکه‌های پارچه ابریشم چینی باستانی بود که نقشه صور فلکی دب اکبر رویش گلدوزی شده بود!",
    },
    choiceA: {
      labelEn: "Preserve the fragile silk embroideries in moisture-sealed silicone sleeves!",
      labelFa: "ابریشم‌های ظریف را در پوشش‌های سیلیکونی غیرقابل نفوذ رطوبت ایزوله کن!",
      descriptionFa: "حفاظت فوری از کهن‌ترین نقشه ابریشمی آسمان در ارتفاعات هیمالیا.",
    },
    choiceB: {
      labelEn: "Trace the high-altitude Silk Road trail down into the Shaksgam Valley!",
      labelFa: "مسیر کاروان‌رو جاده ابریشم را تا دره سرسبز و وحشی شاکسگام دنبال کن!",
      descriptionFa: "گشودن گذرگاهی فراموش‌شده که قرن‌ها مسیر بازرگانان شرق و غرب بوده است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The seismic sensor array detected deep, rhythmic micro-tremors originating four kilometers below the glacier. Triangulating the waveforms, Tariq realized the tremors were not precursor rumbles of an avalanche, but harmonic acoustic pulses generated by a pressurized sub-glacial hydrothermal geyser field. The venting steam created natural ice caves spanning twelve kilometers across the international border, entirely shielded from weather and avalanches.",
    keywords: [
      { word: "triangulating", meaningFa: "مثلث‌بندی کردن موقعیت با استفاده از سه نقطه سنجش", phonetic: "/traɪˈæŋɡjuleɪtɪŋ/" },
      { word: "geyser", meaningFa: "آب‌فشان طبیعی، خروج فورانی آب داغ و بخار از زمین", phonetic: "/ˈɡiːzə(r)/" },
      { word: "precursor", meaningFa: "پیش‌درآمد، نشانه آغازین و پیش‌قراول یک رویداد", phonetic: "/priːˈkɜːsə(r)/" },
      { word: "harmonic", meaningFa: "موزون، دارای بسامد منظم و هماهنگ صوتی", phonetic: "/hɑːˈmɒnɪk/" },
    ],
    question: {
      promptEn: "What was the true source of the seismic micro-tremors detected by the array?",
      promptFa: "منشأ واقعی ریزلرزه‌های ثبت‌شده توسط حسگرهای لرزه‌نگار چه بود؟",
      options: [
        "Harmonic acoustic pulses from a pressurized sub-glacial hydrothermal geyser field",
        "The movement of heavy military tracked vehicles across the glacier",
        "A subterranean collapse of an abandoned limestone mine",
      ],
      correctIndex: 0,
      hintSnippet: "harmonic acoustic pulses generated by a pressurized sub-glacial hydrothermal geyser field",
      clueFa: "خط سوم رو ببین؛ پالس‌های صوتی منظم آب‌فشان‌های داغ و پرفشار زیر یخچال بودند که غارهای یخی ۱۲ کیلومتری ایجاد کرده بودند!",
    },
    choiceA: {
      labelEn: "Chart the safe subterranean ice cave network as an all-weather emergency corridor!",
      labelFa: "شبکه امن غارهای یخی را به عنوان گذرگاه امدادی در تمام فصول سال نقشه‌برداری کن!",
      descriptionFa: "مسیری ایمن از ریزش بهمن برای کوهنوردان و گروه‌های نجات در قراقروم.",
    },
    choiceB: {
      labelEn: "Deploy geothermal temperature monitors to harness clean energy for high-altitude research!",
      labelFa: "حسگرهای دمایی نصب کن تا از این انرژی زمین‌گرمایی برای ایستگاه‌های علمی استفاده شود!",
      descriptionFa: "استفاده از گرمای طبیعی زمین برای راه‌اندازی اولین پایگاه دائمی بدون کربن در ارتفاعات.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Handheld radiography revealed that the sealed bronze urn contained twenty-four rolled sheets of beaten electrum—a natural alloy of gold and silver. Inscribed on the metal foil were astronomical star catalogues compiled during the Kushan Empire, providing planetary positions that matched Ptolemy's data but achieved greater accuracy in computing lunar parallax. Tariq and Maya held their breath; this was an Asian repository of precision science untouched for two thousand years.",
    keywords: [
      { word: "electrum", meaningFa: "الکتروم (آلیاژ طبیعی و گرانبهای طلا و نقره باستان)", phonetic: "/ɪˈlektrəm/" },
      { word: "parallax", meaningFa: "اختلاف منظر، تغییر زاویه دید یک جرم آسمانی از دو نقطه", phonetic: "/ˈpærəlæks/" },
      { word: "repository", meaningFa: "گنجینه، انبارگاه اسناد و ذخایر ارزشمند", phonetic: "/rɪˈpɒzətri/" },
      { word: "radiography", meaningFa: "رادیوگرافی، تصویربرداری با پرتوهای نافذ ایکس", phonetic: "/ˌreɪdiˈɒɡrəfi/" },
    ],
    question: {
      promptEn: "What invaluable scientific documents were inscribed upon the electrum sheets?",
      promptFa: "روی ورقه‌های فلزی الکتروم (طلا و نقره) چه اسناد علمی باارزشی حکاکی شده بود؟",
      options: [
        "Kushan Empire astronomical star catalogues calculating lunar parallax with supreme accuracy",
        "A ledger of ancient tax revenues collected from mountain copper smelters",
        "A list of medicinal alpine roots used to cure altitude sickness",
      ],
      correctIndex: 0,
      hintSnippet: "astronomical star catalogues compiled during the Kushan Empire, providing planetary positions... computing lunar parallax",
      clueFa: "خط دوم و سوم رو بخون؛ کاتالوگ‌های ستاره‌شناسی امپراتوری کوشان بود که اختلاف منظر ماه را با دقتی فوق‌العاده محاسبه کرده بود!",
    },
    choiceA: {
      labelEn: "Publish the Kushan star catalog in collaboration with the Geological Survey of Pakistan!",
      labelFa: "فهرست ستارگان کوشان را با همکاری سازمان زمین‌شناسی پاکستان منتشر کن!",
      descriptionFa: "رونمایی از میراث کهن ستاره‌شناسی آسیا برای جامعه علمی بین‌المللی.",
    },
    choiceB: {
      labelEn: "Establish the High Karakoram Archaeological Sanctuary to protect the cavern forever!",
      labelFa: "منطقه حفاظت‌شده باستان‌شناسی قراقروم را برای پاسداری ابدی از غار تاسیس کن!",
      descriptionFa: "ثبت جهانی این معبد طبیعی به عنوان میراث مشترک بشریت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The 3D photogrammetric scan of the bilingual inscription unraveled a linguistic marvel. The text established a direct philological bridge between Sogdian, Sanskrit, and Hellenistic Greek trade terminology, proving that the Karakoram pass functioned not as an impassable barrier, but as a vibrant multicultural highway of ideas. The finding earned international accolades from linguistic academies in Islamabad, Beijing, and Paris.",
    keywords: [
      { word: "philological", meaningFa: "فیلولوژیک، زبان‌شناختی و بررسی متون کهن تاریخی", phonetic: "/ˌfɪləˈlɒdʒɪkl/" },
      { word: "multicultural", meaningFa: "چندفرهنگی، متشکل از چندین تمدن و فرهنگ گوناگون", phonetic: "/ˌmʌltiˈkʌltʃərəl/" },
      { word: "impassable", meaningFa: "غیرقابل عبور، صعب‌العبور و دست‌نیافتنی", phonetic: "/ɪmˈpɑːsəbl/" },
      { word: "accolades", meaningFa: "تحسین‌ها، جوایز و تقدیرهای عالی علمی", phonetic: "/ˈækəleɪdz/" },
    ],
    question: {
      promptEn: "What historical concept did the bilingual inscription definitively disprove?",
      promptFa: "کتیبه دوزبانه کدام فرضیه تاریخی را به کلی باطل کرد؟",
      options: [
        "That the Karakoram range was an impassable barrier, proving it was a vibrant multicultural highway",
        "That Sogdian merchants traveled only by sea along the Indian Ocean",
        "That ancient trade routes never reached elevations above two thousand meters",
      ],
      correctIndex: 0,
      hintSnippet: "proving that the Karakoram pass functioned not as an impassable barrier, but as a vibrant multicultural highway of ideas",
      clueFa: "خط سوم رو ببین؛ اثبات کرد قراقروم هرگز مانع عبور نبوده، بلکه بزرگراهی چندفرهنگی و پررونق برای تبادل افکار و کالاها بوده است!",
    },
    choiceA: {
      labelEn: "Curate a world-touring museum exhibition of the Karakoram Epigraphic Discovery!",
      labelFa: "نمایشگاه موزه بین‌المللی کتیبه‌های قراقروم را در پایتخت‌های جهان برپا کن!",
      descriptionFa: "شناساندن تاریخ شکوهمند کوهستان به علاقه‌مندان در سراسر گیتی.",
    },
    choiceB: {
      labelEn: "Fund high-altitude youth mountaineering scholarships for Himalayan local guides!",
      labelFa: "بنیاد بورسیه‌های کوهنوردی پیشرفته را برای راهنمایان محلی و شرپاها تاسیس کن!",
      descriptionFa: "تجلیل و حمایت واقعی از ساکنان بومی که نگهبانان راستین این قله‌هایند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The international medical consortium synthesized the first stable batch of synthetic cryo-protective peptide derived from the extremophile bacteria. Clinical trials demonstrated a 400% increase in the viable storage time of donor organs for human transplantation. The World Health Organization awarded Tariq and Maya the Humanitarian Science Medal, recognizing that an alpine expedition had revolutionized modern surgery.",
    keywords: [
      { word: "peptide", meaningFa: "پپتید، زنجیره کوتاه اسیدهای آمینه زیستی", phonetic: "/ˈpeptaɪd/" },
      { word: "viable", meaningFa: "زنده، دارای قابلیت زیست و بقا", phonetic: "/ˈvaɪəbl/" },
      { word: "transplantation", meaningFa: "پیوند اعضای بدن به بیمار", phonetic: "/ˌtrænsplɑːnˈteɪʃn/" },
      { word: "humanitarian", meaningFa: "انسان‌دوستانه، در جهت نجات جان و کاهش رنج بشر", phonetic: "/hjuːˌmænɪˈteəriən/" },
    ],
    question: {
      promptEn: "By what percentage did the synthesized cryo-protective peptide extend donor organ storage time?",
      promptFa: "پپتید زیستی به‌دست‌آمده از باکتری زمان نگهداری اعضای پیوندی را چقدر افزایش داد؟",
      options: [
        "A 400% increase in viable storage time for donor organs",
        "Only a 5% improvement under laboratory conditions",
        "A 50% decrease in transportation costs for surgical coolers",
      ],
      correctIndex: 0,
      hintSnippet: "demonstrated a 400% increase in the viable storage time of donor organs for human transplantation",
      clueFa: "خط دوم رو ببین؛ زمان نگهداری زنده اعضای پیوندی را ۴۰۰ درصد افزایش داد و جان بیماران زیادی را نجات داد!",
    },
    choiceA: {
      labelEn: "Inaugurate the Global Cryo-Med Facility providing free organ preservation to public hospitals!",
      labelFa: "مرکز جهانی کرایومد را برای تامین رایگان داروی پیوند به بیمارستان‌های دولتی افتتاح کن!",
      descriptionFa: "توزیع عادلانه دستاورد علمی در تمام بیمارستان‌ها بدون سودجویی تجاری.",
    },
    choiceB: {
      labelEn: "Establish an endowed research lab in Skardu dedicated to Karakoram microbiology!",
      labelFa: "آزمایشگاه پژوهشی مجهز میکروبیولوژی قراقروم را در شهر سکردو پایه‌گذاری کن!",
      descriptionFa: "توسعه زیرساخت‌های علمی در مناطق کوهستانی شمال پاکستان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Maya’s geothermal microclimatic model revealed an astonishing subterranean heat network extending beneath eighteen glaciers. The volcanic vents maintained stable ambient temperatures year-round, creating subterranean oases capable of supporting scientific stations without external fuel. The Geological Society hailed the research as the blueprint for carbon-neutral research bases in extreme polar and alpine environments.",
    keywords: [
      { word: "oases", meaningFa: "واحه‌ها (جمع واحه، نقاط سرسبز و آرامش‌بخش در دل بیابان یا یخ)", phonetic: "/əʊˈeɪsiːz/" },
      { word: "carbon-neutral", meaningFa: "خنثی از کربن، بدون تولید گازهای گلخانه‌ای و بدون آلایندگی", phonetic: "/ˌkɑːbən ˈnjuːtrəl/" },
      { word: "subterranean", meaningFa: "زیرزمینی، واقع در ژرفای زمین", phonetic: "/ˌsʌbtəˈreɪniən/" },
      { word: "blueprint", meaningFa: "نقشه راه، الگوی طراحی فنی و جامع", phonetic: "/ˈbluːprɪnt/" },
    ],
    question: {
      promptEn: "What sustainable breakthrough did Maya's geothermal model provide for extreme environments?",
      promptFa: "مدل زمین‌گرمایی مایا چه پیشرفت پایداری برای مناطق سخت اقلیمی به ارمغان آورد؟",
      options: [
        "A blueprint for zero-carbon, fuel-free research stations powered by natural geothermal heat",
        "A method for melting ice sheets to build open-pit diamond mines",
        "A technique for piping boiling water to luxury ski chalets",
      ],
      correctIndex: 0,
      hintSnippet: "blueprint for carbon-neutral research bases in extreme polar and alpine environments",
      clueFa: "خط آخر رو نگاه کن؛ الگویی جامع برای ایستگاه‌های علمی بدون آلایندگی و بدون سوخت فسیلی در قطب و کوهستان ارائه داد!",
    },
    choiceA: {
      labelEn: "Build the world’s first geothermal alpine research observatory at Concordia!",
      labelFa: "اولین رصدخانه زمین‌گرمایی و پاک کوهستان را در محل تلاقی کنکوردیا بساز!",
      descriptionFa: "پایگاهی مدرن و سبز در باشکوه‌ترین تلاقی‌گاه یخچال‌های هیمالیا.",
    },
    choiceB: {
      labelEn: "Present the extreme-environment habitat findings to the United Nations Climate Council!",
      labelFa: "دستاوردهای زیستگاه‌های پاک را در شورای اقلیم سازمان ملل متحد ارائه بده!",
      descriptionFa: "الگویی الهام‌بخش برای بهره‌گیری هوشمندانه از انرژی‌های پاک زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Spectrometric analysis confirmed that the silk embroideries dated to 120 BC, woven from mulberry silk and dyed with indigo and cinnabar. The star charts depicted twenty-eight lunar lodges, including supernova remnants documented in ancient Chinese astronomical annals. Curators at the National Museum in Islamabad declared it the most important textile archaeological find in Central Asian history.",
    keywords: [
      { word: "spectrometric", meaningFa: "طیف‌سنجی، روش تجزیه نوری برای تشخیص سن و ساختار ماده", phonetic: "/ˌspektrəˈmetrɪk/" },
      { word: "cinnabar", meaningFa: "شنگرف (ماده معدنی سرخ‌رنگ درخشان حاوی گوگرد و جیوه)", phonetic: "/ˈsɪnəbɑː(r)/" },
      { word: "annals", meaningFa: "سالنامه‌ها، گاه‌شماری و وقایع‌نگاری‌های رسمی کهن", phonetic: "/ˈænlz/" },
      { word: "lodges", meaningFa: "منازل ماه، برج‌های ۲۸گانه تقسیمات فلکی در نجوم باستان", phonetic: "/ˈlɒdʒɪz/" },
    ],
    question: {
      promptEn: "What rare celestial phenomenon was embroidered upon the 120 BC silk textiles?",
      promptFa: "چه پدیده نادر کیهانی روی پارچه‌های ابریشمی سال ۱۲۰ پیش از میلاد گلدوزی شده بود؟",
      options: [
        "Twenty-eight lunar lodges including historic supernova remnants",
        "A solar eclipse witnessed during an imperial coronation",
        "A massive meteor shower that fell upon the Tarim Basin",
      ],
      correctIndex: 0,
      hintSnippet: "The star charts depicted twenty-eight lunar lodges, including supernova remnants documented in ancient Chinese astronomical annals",
      clueFa: "خط دوم و سوم رو ببین؛ ۲۸ منزلگاه ماه به همراه بقایای ابرنواخترهای ثبت‌شده در سالنامه‌های نجومی باستان بود!",
    },
    choiceA: {
      labelEn: "Install the silk star charts in an airtight, humidity-controlled gallery in Islamabad!",
      labelFa: "نقشه‌های ابریشمی را در تالار بدون اکسیژن موزه ملی اسلام‌آباد به نمایش بگذار!",
      descriptionFa: "حفظ این اثر بی‌همتا در شرایط کاملاً استاندارد برای نسل‌های آینده.",
    },
    choiceB: {
      labelEn: "Co-author a landmark monograph on ancient trans-Eurasian celestial cartography!",
      labelFa: "کتاب جامع مرجع درباره نقشه‌نگاری نجومی اوراسیا باستان را تالیف و منتشر کن!",
      descriptionFa: "تحقیقی ماندگار که رابطه علم نجوم چین و تمدن‌های غرب را بازتعریف می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Following the ancient trail markers down the Shaksgam gorge, Tariq and Maya mapped a 40-kilometer historical caravan route completely sheltered from rockfalls by natural granite colonnades. Local high-altitude porter guilds celebrated the discovery: the route shaved five grueling days off the traditional high-pass crossing, reducing exposure to lethal storms and frostbite.",
    keywords: [
      { word: "colonnades", meaningFa: "ردیف ستون‌های سنگی طبیعی یا معماری", phonetic: "/ˌkɒləˈneɪdz/" },
      { word: "grueling", meaningFa: "طاقت‌فرسا، بسیار خسته‌کننده و توان‌فرسا", phonetic: "/ˈɡruːəlɪŋ/" },
      { word: "frostbite", meaningFa: "سرمازدگی، آسیب شدید بافت‌های بدن بر اثر سرمای مفرط", phonetic: "/ˈfrɒstbaɪt/" },
      { word: "gorge", meaningFa: "تنگه عمیق و صخره‌ای با دیواره‌های تند", phonetic: "/ɡɔːdʒ/" },
    ],
    question: {
      promptEn: "How did the newly mapped 40-kilometer Shaksgam route benefit local porter communities?",
      promptFa: "مسیر ۴۰ کیلومتری شاکسگام چه فایده بزرگی برای جوامع محلی و باربران کوهستان داشت؟",
      options: [
        "It shaved five grueling days off the crossing, greatly reducing exposure to lethal storms",
        "It allowed heavy diesel freight trucks to drive all the way to K2 base camp",
        "It provided cable car transport powered by hydroelectric generators",
      ],
      correctIndex: 0,
      hintSnippet: "the route shaved five grueling days off the traditional high-pass crossing, reducing exposure to lethal storms and frostbite",
      clueFa: "خط سوم و چهارم رو ببین؛ پنج روز از سفر مرگبار کم کرد و خطر سرمازدگی و کولاک‌های کشنده را به شدت کاهش داد!",
    },
    choiceA: {
      labelEn: "Officially designate the trail as the 'Vance-Sterling High Safety Corridor'!",
      labelFa: "مسیر را به عنوان 'گذرگاه ایمن ونس-استرلینگ' در نقشه‌های رسمی هیمالیا ثبت کن!",
      descriptionFa: "نجات جان صدها کوهنورد و راهنمای محلی در فصول آینده.",
    },
    choiceB: {
      labelEn: "Build three solar-heated emergency alpine shelters along the sheltered trail!",
      labelFa: "سه پناهگاه خورشیدی گرم برای شرایط اضطراری در طول مسیر بساز!",
      descriptionFa: "پناهگاه‌هایی مجهز برای نجات جان مسافران و باربران در طوفان‌های ناگهانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "The 12-kilometer subterranean ice cave network was officially charted and GPS-tagged. Rescue services conducted a full-scale simulation, transporting an injured mountaineer through the ice corridor in under two hours—a journey that previously required an impossible forty-eight-hour blizzard traverse. Alpine rescue federations worldwide praised the discovery as a miracle of mountaineering safety.",
    keywords: [
      { word: "simulation", meaningFa: "مانور شبیه‌سازی، آزمایش تمرینی در شرایط واقعی", phonetic: "/ˌsɪmjuˈleɪʃn/" },
      { word: "traverse", meaningFa: "پیمایش، تراورس و حرکت افقی در امتداد شیب کوهستان", phonetic: "/trəˈvɜːs/" },
      { word: "federations", meaningFa: "فدراسیون‌ها، اتحادیه‌ها و سازمان‌های رسمی", phonetic: "/ˌfedəˈreɪʃnz/" },
      { word: "charted", meaningFa: "نقشه‌برداری‌شده، به دقت روی نقشه ثبت‌شده", phonetic: "/ˈtʃɑːtɪd/" },
    ],
    question: {
      promptEn: "What dramatic evacuation time improvement was proven in the rescue simulation?",
      promptFa: "در مانور نجات چه بهبود چشمگیری در زمان انتقال مصدوم به اثبات رسید؟",
      options: [
        "An injured mountaineer was evacuated in under two hours instead of a 48-hour blizzard traverse",
        "Helicopter fuel consumption was reduced by ten gallons per flight",
        "Mountain guides learned how to parachute directly onto ice seracs",
      ],
      correctIndex: 0,
      hintSnippet: "transporting an injured mountaineer through the ice corridor in under two hours—a journey that previously required an impossible forty-eight-hour blizzard traverse",
      clueFa: "خط دوم و سوم رو نگاه کن؛ انتقال مصدوم به جای ۴۸ ساعت دست‌وپنجه نرم کردن با طوفان، در کمتر از دو ساعت با موفقیت انجام شد!",
    },
    choiceA: {
      labelEn: "Equip the corridor with solar-powered emergency communication beacons!",
      labelFa: "دالان را به فرستنده‌ها و بیسیم‌های امدادی خورشیدی مجهز کن!",
      descriptionFa: "پوشش رادیویی دائمی برای گزارش فوری هرگونه حادثه در ارتفاعات.",
    },
    choiceB: {
      labelEn: "Train thirty local Balti high-altitude rescue specialists to staff the corridor!",
      labelFa: "سی جوان بومی بلتی را به عنوان نجات‌غریقان حرفه‌ای کوهستان آموزش بده!",
      descriptionFa: "ایجاد شغل و توانمندسازی جامعه بومی برای فرماندهی عملیات امداد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Installation of the pilot geothermal thermoelectric generator at 5,800 meters was an absolute success. Utilizing the thermal gradient between the 40-degree geothermal steam and the minus-30-degree ambient mountain air, the compact solid-state generator produced twenty kilowatts of continuous electricity without moving parts, emissions, or reliance on expensive diesel airlift flights.",
    keywords: [
      { word: "thermoelectric", meaningFa: "تروموالکتریک، تولید برق از اختلاف دما", phonetic: "/ˌθɜːməʊɪˈlektrɪk/" },
      { word: "gradient", meaningFa: "گرادیان، اختلاف یا شیب تغییرات دما میان دو نقطه", phonetic: "/ˈɡreɪdiənt/" },
      { word: "airlift", meaningFa: "انتقال هوایی بار با بالگرد یا هواپیمای ترابری", phonetic: "/ˈeəlɪft/" },
      { word: "emissions", meaningFa: "آلاینده‌ها، گازهای خروجی حاصل از سوخت", phonetic: "/ɪˈmɪʃnz/" },
    ],
    question: {
      promptEn: "How did the thermoelectric generator produce 20 kilowatts of electricity without moving parts?",
      promptFa: "ژنراتور ترموالکتریک چگونه ۲۰ کیلووات برق بدون قطعات متحرک تولید کرد؟",
      options: [
        "By utilizing the temperature gradient between 40-degree steam and minus-30-degree air",
        "By burning kerosene mixed with dried yak dung",
        "By harnessing static electricity from high-velocity blizzard winds",
      ],
      correctIndex: 0,
      hintSnippet: "Utilizing the thermal gradient between the 40-degree geothermal steam and the minus-30-degree ambient mountain air",
      clueFa: "خط دوم رو ببین؛ از اختلاف دمای ۷۰ درجه‌ای میان بخار داغ ۴۰ درجه و هوای منفی ۳۰ درجه بیرون، برق پاک تولید کرد!",
    },
    choiceA: {
      labelEn: "Power the high-altitude weather and glacial melt monitoring station permanently!",
      labelFa: "ایستگاه پایش ذوب یخچال‌ها و وضعیت هواشناسی را برای همیشه با این برق روشن نگه دار!",
      descriptionFa: "ثبت دقیق داده‌های تغییرات اقلیمی برای هشدار به موقع سیلاب‌های کوهستانی.",
    },
    choiceB: {
      labelEn: "Share the open-source engineering schematics with polar and alpine expeditions globally!",
      labelFa: "نقشه‌های مهندسی ژنراتور پاک را رایگان برای تمام تیم‌های اکتشافی قطب و هیمالیا منتشر کن!",
      descriptionFa: "حذف موتورهای دیزلی آلاینده از پاک‌ترین قله‌ها و یخچال‌های کره زمین.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The joint publication of the Kushan electrum star catalogue in Islamabad received the UNESCO Memory of the World inscription. Diplomats, astronomers, and mountain guides toasted the recovery of a lost chapter of Asian intellectual majesty. From the balcony overlooking the Margalla Hills, Tariq and Maya held the commemorative medal, knowing their expedition had enriched human history.",
    keywords: [
      { word: "inscription", meaningFa: "ثبت رسمی در فهرست میراث، کتیبه‌گذاری", phonetic: "/ɪnˈskrɪpʃn/" },
      { word: "commemorative", meaningFa: "یادبود، بزرگداشت رویدادی افتخارآفرین", phonetic: "/kəˈmemərətɪv/" },
      { word: "enriched", meaningFa: "غنی ساخت، پربار و پرمایه کرد", phonetic: "/ɪnˈrɪtʃt/" },
      { word: "majesty", meaningFa: "عظمت، شکوه و والایی تاریخی", phonetic: "/ˈmædʒəsti/" },
    ],
    question: {
      promptEn: "What international honor was conferred upon the Kushan star catalogue?",
      promptFa: "چه افتخار بین‌المللی نصیب فهرست ستارگان امپراتوری کوشان شد؟",
      options: [
        "The UNESCO Memory of the World inscription celebrating Asian intellectual history",
        "A private auction sale at a Swiss luxury gallery",
        "A feature article in a commercial aviation magazine",
      ],
      correctIndex: 0,
      hintSnippet: "The joint publication of the Kushan electrum star catalogue in Islamabad received the UNESCO Memory of the World inscription",
      clueFa: "خط اول و دوم رو ببین؛ در فهرست رسمی 'حافظه جهانی یونسکو' به عنوان شاهکار فکری آسیا ثبت شد!",
    },
    choiceA: {
      labelEn: "Raise a crystal toast to the ancient Kushan astronomers under the twilight stars!",
      labelFa: "جام نوشیدنی را به یاد ستاره‌شناسان باستان امپراتوری کوشان زیر نور مهتاب بالا ببر!",
      descriptionFa: "پایانی شکوهمند، پرخاطره و الهام‌بخش در پایتخت.",
    },
    choiceB: {
      labelEn: "Dedicate the expedition trophy to the brave Balti high-altitude mountain staff!",
      labelFa: "تندیس افتخار کاوش را به تیم باربران و همرزمان فداکار بلتی تقدیم کن!",
      descriptionFa: "تجلیل صمیمانه از برادران کوهستان که بدون آنها این صعود ناممکن بود.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The High Karakoram Archaeological Sanctuary was ratified by the Pakistani Parliament, protecting ten thousand square kilometers of glacial passes from unregulated commercial encroachment. Local communities took ownership of conservation, serving as ranger-custodians who safeguard the sacred cavern and its rock art for future generations.",
    keywords: [
      { word: "encroachment", meaningFa: "تجاوز، دست‌اندازی غیرقانونی به حریم طبیعت", phonetic: "/ɪnˈkrəʊtʃmənt/" },
      { word: "custodians", meaningFa: "نگهبانان، امانت‌داران و محافظان رسمی", phonetic: "/kʌˈstəʊdiənz/" },
      { word: "ratified", meaningFa: "تصویب شد، به قانون رسمی بدل گشت", phonetic: "/ˈrætɪfaɪd/" },
      { word: "sanctuary", meaningFa: "منطقه حفاظت‌شده، پناهگاه حیات وحش و آثار باستانی", phonetic: "/ˈsæŋktʃuəri/" },
    ],
    question: {
      promptEn: "Who was entrusted with the direct stewardship of the High Karakoram Archaeological Sanctuary?",
      promptFa: "سرپرستی و حفاظت مستقیم از این منطقه حفاظت‌شده به چه کسانی سپرده شد؟",
      options: [
        "Local mountain communities serving as empowered ranger-custodians",
        "A multinational private security corporation",
        "A foreign consortium of mining investors",
      ],
      correctIndex: 0,
      hintSnippet: "Local communities took ownership of conservation, serving as ranger-custodians who safeguard the sacred cavern",
      clueFa: "خط دوم و سوم رو نگاه کن؛ جوامع بومی کوهستان به عنوان محیط‌بانان و حافظان رسمی این میراث انتخاب شدند!",
    },
    choiceA: {
      labelEn: "Present the ranger-custodian badges to local village elders in a mountain ceremony!",
      labelFa: "نشان‌های محیط‌بانی رسمی را طی مراسمی باصفا به بزرگان روستاهای کوهستان اهدا کن!",
      descriptionFa: "احترام به سنت‌ها و پیوند نسل‌ها در حفاظت از خاک نیاکان.",
    },
    choiceB: {
      labelEn: "Gaze out over the Karakoram peaks with peaceful, lifelong fulfillment!",
      labelFa: "با آرامشی عمیق و غروری ماندگار به قله‌های سر به فلک کشیده قراقروم بنگر!",
      descriptionFa: "پایانی آرامش‌بخش، باشکوه و جاودانه بر فراز بام جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The Karakoram Epigraphic Exhibition debuted at the Guimet Museum in Paris before traveling to London and New York. Millions of visitors marvelled at the interactive 3D holographic projection of the bilingual inscription, discovering that high-altitude glaciers were once corridors of vibrant peace and cultural exchange.",
    keywords: [
      { word: "epigraphic", meaningFa: "کتیبه‌شناختی، مربوط به سنگ‌نبشته‌ها و متون کنده‌کاری‌شده", phonetic: "/ˌepɪˈɡræfɪk/" },
      { word: "debuted", meaningFa: "برای نخستین بار رونمایی شد، افتتاح گردید", phonetic: "/deɪˈbjuːd/" },
      { word: "corridors", meaningFa: "گذرگاه‌ها، راه‌روهای ارتباطی مهم میان سرزمین‌ها", phonetic: "/ˈkɒrɪdɔːz/" },
      { word: "holographic", meaningFa: "هولوگرافیک، برجسته و سه‌بعدی نوری", phonetic: "/ˌhɒləˈɡræfɪk/" },
    ],
    question: {
      promptEn: "What powerful historical truth did museum visitors discover at the Paris exhibition?",
      promptFa: "بازدیدکنندگان نمایشگاه پاریس به چه حقیقت تاریخی بزرگی پی بردند؟",
      options: [
        "That high-altitude glaciers were once vibrant corridors of peace and cultural exchange",
        "That Sogdian merchants traveled only during full moons",
        "That mountain passes were exclusively used by royal military conquerors",
      ],
      correctIndex: 0,
      hintSnippet: "discovering that high-altitude glaciers were once corridors of vibrant peace and cultural exchange",
      clueFa: "خط آخر رو ببین؛ فهمیدند که یخچال‌های مخوف کوهستان زمانی گذرگاه‌های پرشور صلح و تبادل فرهنگ‌ها بوده‌اند!",
    },
    choiceA: {
      labelEn: "Deliver the opening keynote in Paris flanked by international cultural ambassadors!",
      labelFa: "خطابه افتتاحیه را در پاریس در کنار سفیران فرهنگی جهان با افتخار ایراد کن!",
      descriptionFa: "درخشش نام ایران، پاکستان و جاده ابریشم در قلب موزه گیمه پاریس.",
    },
    choiceB: {
      labelEn: "Toast a cup of French espresso with Maya as evening rain taps on the glass pyramid!",
      labelFa: "یک فنجان اسپرسو با مایا بنوش در حالی که باران عصرگاهی به شیشه‌های هرم می‌بارد!",
      descriptionFa: "خاطره‌بازی دلنشین دو کوهنورد پس از فتح قله‌های سخت تاریخ.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The Himalayan High-Altitude Mountaineering Academy in Gilgit welcomed its first cohort of forty young local climbers on full academic scholarships. Tariq and Maya taught technical glacial cartography and search-and-rescue protocols, training a generation of mountain leaders whose skill and safety standards would lead the global climbing industry.",
    keywords: [
      { word: "cohort", meaningFa: "ورودی‌های یک دوره، گروه هم‌دوره آموزشی", phonetic: "/ˈkəʊhɔːt/" },
      { word: "protocols", meaningFa: "شیوه‌نامه‌های فنی و استانداردهای رسمی ایمنی", phonetic: "/ˈprəʊtəkɒlz/" },
      { word: "cartography", meaningFa: "نقشه‌نگاری و نقشه‌برداری تخصصی", phonetic: "/kɑːˈtɒɡrəfi/" },
      { word: "standards", meaningFa: "معیارها، استانداردهای کیفی بالا", phonetic: "/ˈstændədz/" },
    ],
    question: {
      promptEn: "What subjects did Tariq and Maya teach the scholarship students in Gilgit?",
      promptFa: "طارق و مایا چه علومی را به دانشجویان بورسیه در گلگت آموزش دادند؟",
      options: [
        "Technical glacial cartography and high-altitude search-and-rescue protocols",
        "How to operate commercial tourist souvenir shops in base camps",
        "Traditional wool carpet weaving and dye extraction",
      ],
      correctIndex: 0,
      hintSnippet: "Tariq and Maya taught technical glacial cartography and search-and-rescue protocols",
      clueFa: "خط دوم رو ببین؛ نقشه‌نگاری فنی یخچال‌ها و شیوه‌نامه‌های نجات و جست‌وجوی کوهستان را آموزش دادند!",
    },
    choiceA: {
      labelEn: "Award climbing harnesses and GPS transceivers to the graduating young mountaineers!",
      labelFa: "تجهیزات هارنس فنی و بی‌سیم‌های نجات را به فارغ‌التحصیلان جوان کوهنوردی هدیه بده!",
      descriptionFa: "سپردن فردای کوهستان به دستان پرتوان و مجهز نسل نو.",
    },
    choiceB: {
      labelEn: "Sing mountain folk songs around a roaring pine fire with the students in Gilgit!",
      labelFa: "دور آتش گرم هیزم با دانشجویان سرودهای شاد محلی کوهستان را همخوانی کن!",
      descriptionFa: "شبی پر از گرما، صفا و خاطرات فراموش‌نشدنی در شمال پاکستان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The Global Cryo-Med Facility in Geneva shipped its first million vials of temperature-stabilizing peptide to emergency hospitals in sixty nations. In pediatric cardiac centers, surgeons successfully preserved delicate donor hearts across thirty-hour transatlantic flights, saving thousands of children's lives. The world cheered an alpine adventure that turned frost into the gift of life.",
    keywords: [
      { word: "pediatric", meaningFa: "مربوط به کودکان و طب اطفال", phonetic: "/ˌpiːdiˈætrɪk/" },
      { word: "cardiac", meaningFa: "قلبی، مربوط به قلب و عروق", phonetic: "/ˈkɑːdiæk/" },
      { word: "vials", meaningFa: "شیشه‌های کوچک دارویی، ویال‌های تزریقی", phonetic: "/ˈvaɪəlz/" },
      { word: "transatlantic", meaningFa: "فرااقیانوسی، پرواز از فراز اقیانوس اطلس", phonetic: "/ˌtrænzətˈlæntɪk/" },
    ],
    question: {
      promptEn: "How did the cryo-stabilizing peptide revolutionize pediatric heart surgery?",
      promptFa: "پپتید تثبیت‌کننده دمای زیستی چگونه جراحی قلب کودکان را متحول کرد؟",
      options: [
        "Surgeons preserved delicate donor hearts across 30-hour flights, saving thousands of children",
        "It reduced the duration of open-heart surgery to fifteen minutes",
        "It replaced the need for donor blood in all operating theaters",
      ],
      correctIndex: 0,
      hintSnippet: "surgeons successfully preserved delicate donor hearts across thirty-hour transatlantic flights, saving thousands of children's lives",
      clueFa: "خط دوم و سوم رو نگاه کن؛ قلب‌های اهدایی تا ۳۰ ساعت پرواز سالم ماندند و جان هزاران کودک نجات پیدا کرد!",
    },
    choiceA: {
      labelEn: "Visit the pediatric recovery ward in Geneva to share smiles with thriving children!",
      labelFa: "به بخش بهبودی کودکان در ژنو برو و لبخند را با بچه‌های سالم و شادمان تقسیم کن!",
      descriptionFa: "دیدن زیباترین پاداش انسانی که از دل سختی‌های کوهستان به بار نشست.",
    },
    choiceB: {
      labelEn: "Clink glasses of sparkling apple cider with the medical synthesis research team!",
      labelFa: "با تیم دانشمندان داروسازی به سلامتی نجات جان بیماران جشن بگیر!",
      descriptionFa: "پیروزی علم و انسانیت بر مرزهای ناممکن طبیعت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The Karakoram Institute of Extremophile Research opened its state-of-the-art laboratory in Skardu. Over eighty Pakistani and international doctoral researchers collaborated on biotechnology projects using alpine microorganisms. The town blossomed into a global center for high-altitude bioscience, bringing prosperity, education, and hope to the valley.",
    keywords: [
      { word: "biotechnology", meaningFa: "زیست‌فناوری، استفاده از موجودات زنده در پزشکی و صنعت", phonetic: "/ˌbaɪəʊtekˈnɒlədʒi/" },
      { word: "prosperity", meaningFa: "رونق، شکوفایی اقتصادی و رفاه اجتماعی", phonetic: "/prɒˈsperəti/" },
      { word: "collaborated", meaningFa: "همکاری کردند، در پروژه‌ای مشترک دست در دست هم دادند", phonetic: "/kəˈlæbəreɪtɪd/" },
      { word: "doctoral", meaningFa: "دکترا، مقطع عالی تحصیلات تکمیلی", phonetic: "/ˈdɒktərəl/" },
    ],
    question: {
      promptEn: "How did the opening of the research institute transform the valley town of Skardu?",
      promptFa: "افتتاح پژوهشکده تحقیقاتی چه تحولی در شهر دره‌ای سکردو ایجاد کرد؟",
      options: [
        "It blossomed into a global center for high-altitude bioscience, bringing prosperity and education",
        "It led to the closure of all historical mountaineering hotels",
        "It converted the entire town into a military weapons testing facility",
      ],
      correctIndex: 0,
      hintSnippet: "The town blossomed into a global center for high-altitude bioscience, bringing prosperity, education, and hope to the valley",
      clueFa: "خط آخر رو ببین؛ شهر به کانون جهانی زیست‌فناوری کوهستان بدل شد و رونق و آموزش و امید را برای مردم به ارمغان آورد!",
    },
    choiceA: {
      labelEn: "Cut the inaugural ceremonial ribbon at the institute alongside Skardu's students!",
      labelFa: "روبان افتتاح پژوهشکده را همراه با دانش‌آموزان پرامید سکردو قیچی کن!",
      descriptionFa: "آغاز فصلی نوین در تاریخ علمی و اقتصادی شمال پاکستان.",
    },
    choiceB: {
      labelEn: "Walk through the apricot orchards of Skardu at sunset in peaceful gratitude!",
      labelFa: "در باغ‌های زردآلوی سکردو در غروب آفتاب با سپاسگزاری و آرامش قدم بزن!",
      descriptionFa: "پایانی دلنشین، شاعرانه و روح‌بخش در دل طبیعت بهشتی دره.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "At Concordia, the confluence of the Baltoro and Godwin-Austen glaciers, the world's first geothermal alpine observatory opened its titanium observation dome. Completely self-heated and powered by volcanic vents four hundred meters below the ice, the station became the international hub for climate science, monitoring the third pole of our planet in pristine silence.",
    keywords: [
      { word: "confluence", meaningFa: "تلاقی‌گاه، محل پیوستن دو یا چند رودخانه یا یخچال طبیعی", phonetic: "/ˈkɒnfluəns/" },
      { word: "observatory", meaningFa: "رصدخانه و ایستگاه دیده‌بانی علمی", phonetic: "/əbˈzɜːvətri/" },
      { word: "pristine", meaningFa: "دست‌نخورده، بکر و خالص", phonetic: "/ˈprɪstiːn/" },
      { word: "self-heated", meaningFa: "خودگرمایشی، دارای سامانه گرمایش درونی بدون سوخت", phonetic: "/ˌself ˈhiːtɪd/" },
    ],
    question: {
      promptEn: "What powered the world's first alpine observatory built at Concordia?",
      promptFa: "انرژی نخستین رصدخانه آلپاین ساخته‌شده در کنکوردیا از کجا تامین می‌شد؟",
      options: [
        "It was completely self-heated and powered by volcanic vents 400 meters below the ice",
        "It relied on a nuclear reactor flown in by transport planes",
        "It burned imported Canadian coal carried up by mules",
      ],
      correctIndex: 0,
      hintSnippet: "Completely self-heated and powered by volcanic vents four hundred meters below the ice",
      clueFa: "خط دوم رو ببین؛ کاملاً خودگرمایش بود و انرژی‌اش از دهانه‌های آتشفشانی ۴۰۰ متری زیر یخ تامین می‌شد!",
    },
    choiceA: {
      labelEn: "Gaze at the moonlit pyramid of K2 through the observatory’s telescope dome!",
      labelFa: "هرم باشکوه کی۲ را زیر نور مهتاب از گنبد تلسکوپ رصدخانه به تماشا بنشین!",
      descriptionFa: "تماشای سلطان قله‌های جهان در نهایت وضوح و آرامش کیهانی.",
    },
    choiceB: {
      labelEn: "Transmit the station's first zero-carbon climate telemetry packet to the World Meteorological Organization!",
      labelFa: "اولین بسته داده‌های اقلیمی بدون کربن را به سازمان جهانی هواشناسی ارسال کن!",
      descriptionFa: "افتخار ثبت داده‌های پاک از حساس‌ترین نقطه آب‌وهوایی کره زمین.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Tariq and Maya addressed the United Nations General Assembly in New York, presenting their blueprint for carbon-free extreme-environment human habitats. Delegates from 193 nations rose in a unanimous standing ovation. The resolution established the International Geothermal Alpine Initiative, pledging two billion dollars to convert mountain and polar stations to clean earth energy.",
    keywords: [
      { word: "unanimous", meaningFa: "یکپارچه، به اتفاق آرا و بدون رای مخالف", phonetic: "/juˈnænɪməs/" },
      { word: "resolution", meaningFa: "قطعنامه، مصوبه رسمی مجمع عمومی", phonetic: "/ˌrezəˈluːʃn/" },
      { word: "pledging", meaningFa: "تعهد دادن، متعهد ساختن بودجه مالی", phonetic: "/ˈpledʒɪŋ/" },
      { word: "habitats", meaningFa: "زیستگاه‌ها، سکونتگاه‌های طراحی‌شده برای انسان", phonetic: "/ˈhæbɪtæts/" },
    ],
    question: {
      promptEn: "What global funding was pledged following the UN presentation on clean alpine habitats?",
      promptFa: "به دنبال سخنرانی در سازمان ملل چه بودجه جهانی برای ایستگاه‌های پاک تصویب شد؟",
      options: [
        "Two billion dollars pledged to convert polar and alpine bases to clean geothermal energy",
        "Fifty million dollars to purchase diesel generators for Greenland",
        "A ten-million-dollar fund for luxury mountaineering lodges in the Alps",
      ],
      correctIndex: 0,
      hintSnippet: "pledging two billion dollars to convert mountain and polar stations to clean earth energy",
      clueFa: "خط آخر رو نگاه کن؛ دو میلیارد دلار برای تجهیز تمام پایگاه‌های قطبی و کوهستانی به انرژی پاک زمین‌گرمایی اختصاص یافت!",
    },
    choiceA: {
      labelEn: "Bang the honorary gavel at the UN podium amidst global diplomatic applause!",
      labelFa: "چکش افتخاری سازمان ملل را در میان تشویق نمایندگان جهان بر تریبون بکوب!",
      descriptionFa: "پیروزی اراده انسان برای حفظ پاکیزگی کوهستان‌های زمین.",
    },
    choiceB: {
      labelEn: "Step out into the crisp autumn breeze of Manhattan with heartfelt satisfaction!",
      labelFa: "با احساس رضایتی ماندگار و لبخند به هوای پاییزی منهتن قدم بگذار!",
      descriptionFa: "پایانی شایسته برای دو دانشمندی که دنیا را به جایی پاک‌تر بدل ساختند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "In the National Museum of Pakistan, the 'Silk Star Charts of the Karakoram' were unveiled in a climate-controlled vault. Over fifty thousand visitors queued to view the cinnabar-and-indigo constellations that guided ancient traders across the Siachen snows. The Minister of Culture hailed the exhibit as the crown jewel of Central Asian trade history.",
    keywords: [
      { word: "queued", meaningFa: "صف کشیدند، در صف طولانی منتظر ماندند", phonetic: "/kjuːd/" },
      { word: "jewel", meaningFa: "گوهر گرانبها، نگین ارزشمند", phonetic: "/ˈdʒuːəl/" },
      { word: "unveiled", meaningFa: "رونمایی شد، پرده‌برداری گردید", phonetic: "/ʌnˈveɪld/" },
      { word: "exhibit", meaningFa: "نمایشگاه، اثر نمایشی در موزه", phonetic: "/ɪɡˈzɪbɪt/" },
    ],
    question: {
      promptEn: "What historical significance did the Minister of Culture attribute to the silk star charts?",
      promptFa: "وزیر فرهنگ چه جایگاهی برای این نقشه‌های ابریشمی ستاره‌ها قائل شد؟",
      options: [
        "The crown jewel of Central Asian trade and maritime history",
        "A decorative tapestry without any scientific relevance",
        "An imperial tax receipt from the Tang Dynasty",
      ],
      correctIndex: 0,
      hintSnippet: "hailed the exhibit as the crown jewel of Central Asian trade history",
      clueFa: "خط آخر رو ببین؛ آن را 'نگین تاج تاریخ بازرگانی و فرهنگ آسیای میانه' نامید!",
    },
    choiceA: {
      labelEn: "Guide a group of eager schoolchildren through the ancient star chart gallery!",
      labelFa: "کودکان مشتاق دانش‌آموز را در تالار نقشه ستارگان ابریشمی راهنمایی کن!",
      descriptionFa: "انتقال غرور تمدن کهن به چشمان مشتاق کودکان این دیار.",
    },
    choiceB: {
      labelEn: "Receive the National Star of Pakistan medal from the President with humble honor!",
      labelFa: "نشان ملی 'ستاره پاکستان' را با فروتنی و افتخار از رئیس‌جمهور دریافت کن!",
      descriptionFa: "بالاترین قدردانی یک ملت از کاشفان میراث کهن نیاکانشان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The published 600-page monograph 'Starlight Through the Col' became the definitive textbook in Silk Road cartography, adopted by Oxford, Harvard, and Peking University. The book demonstrated that science and commerce had united East and West long before modern globalization. Tariq and Maya received honorary doctorates amidst the ancient spires of Oxford.",
    keywords: [
      { word: "monograph", meaningFa: "رساله تک‌نگاشت، کتاب جامع پژوهشی درباره یک موضوع واحد", phonetic: "/ˈmɒnəɡrɑːf/" },
      { word: "globalization", meaningFa: "جهانی‌شدن، یکپارچگی ارتباطات و تجارت بین‌الملل", phonetic: "/ˌɡləʊbəlaɪˈzeɪʃn/" },
      { word: "spires", meaningFa: "مناره‌ها و برج‌های مخروطی نوک‌تیز بناهای کهن", phonetic: "/ˈspaɪəz/" },
      { word: "doctorates", meaningFa: "مدارک دکترای افتخاری دانشگاهی", phonetic: "/ˈdɒktərəts/" },
    ],
    question: {
      promptEn: "What overarching historical conclusion did the monograph 'Starlight Through the Col' establish?",
      promptFa: "کتاب جامع مرجع به چه نتیجه‌گیری تاریخی و بنیادینی درباره شرق و غرب رسید؟",
      options: [
        "Science and commerce had united East and West long before modern globalization",
        "Ancient traders never traveled during winter seasons",
        "Central Asian languages shared no common linguistic roots",
      ],
      correctIndex: 0,
      hintSnippet: "demonstrated that science and commerce had united East and West long before modern globalization",
      clueFa: "خط سوم رو ببین؛ اثبات کرد که علم و تجارت مدت‌ها قبل از جهانی‌سازی مدرن، شرق و غرب را به هم پیوند داده بودند!",
    },
    choiceA: {
      labelEn: "Sign presentation copies of the monograph for young graduate historians!",
      labelFa: "نسخه‌های کتاب را برای دانشجویان جوان تاریخ در آکسفورد با افتخار امضا کن!",
      descriptionFa: "الهام بخشیدن به پژوهشگرانی که آینده نگارش تاریخ را در دست دارند.",
    },
    choiceB: {
      labelEn: "Walk along the peaceful River Cherwell reflecting on your Himalayan journey!",
      labelFa: "در کنار رودخانه آرام چِروِل قدم بزن و به حماسه هیمالیا و قراقروم بیاندیش!",
      descriptionFa: "پایانی متین، آرام و لبریز از خرد و آرامش خاطر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The Vance-Sterling High Safety Corridor was opened with a ceremonial flag-raising at 5,400 meters. Over two climbing seasons, zero fatalities were recorded across the Shaksgam traverse, where dozens had previously perished each winter. The International Mountaineering and Climbing Federation (UIAA) recognized it as the single greatest safety innovation in modern Himalayan history.",
    keywords: [
      { word: "fatalities", meaningFa: "تلفات جانی، مرگ و میر ناشی از حوادث", phonetic: "/fəˈtælətiz/" },
      { word: "innovation", meaningFa: "نوآوری، ابتکار عمل نوین و تحول‌آفرین", phonetic: "/ˌɪnəˈveɪʃn/" },
      { word: "perished", meaningFa: "جان باختند، هلاک شدند در سختی‌ها", phonetic: "/ˈperɪʃt/" },
      { word: "traverse", meaningFa: "پیمایش، گذرگاه دشوار کوهستان", phonetic: "/trəˈvɜːs/" },
    ],
    question: {
      promptEn: "What remarkable safety milestone was achieved across the new corridor over two seasons?",
      promptFa: "طی دو فصل صعود، چه رکورد ایمنی شگفت‌انگیزی در گذرگاه ثبت شد؟",
      options: [
        "Zero fatalities were recorded across the Shaksgam traverse",
        "Climbers completed the route in under forty minutes",
        "Helicopter rescues were made completely free of charge",
      ],
      correctIndex: 0,
      hintSnippet: "zero fatalities were recorded across the Shaksgam traverse, where dozens had previously perished",
      clueFa: "خط دوم رو ببین؛ تلفات جانی در این مسیر دشوار به صفر رسید در حالی که پیش از آن ده‌ها نفر هر زمستان جان می‌باختند!",
    },
    choiceA: {
      labelEn: "Fasten the final safety cable on the high cliff path with the local porter guild!",
      labelFa: "آخرین سیم بکسل ایمنی صخره را با همراهی صنف باربران محلی محکم کن!",
      descriptionFa: "اتمام پروژه‌ای که نجات‌بخش جان انسان‌های زحمتکش کوهستان شد.",
    },
    choiceB: {
      labelEn: "Drink hot butter tea inside the porter lodge, listening to tales of gratitude!",
      labelFa: "در جان‌پناه چای کره‌ای داغ بنوش و به قصه‌های سرشار از دعای خیر گوش بسپار!",
      descriptionFa: "صفای بی‌ریا و گرمای دلنشین در دل سرمای کوهستان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The three solar-heated emergency shelters, named 'Hope I', 'Hope II', and 'Hope III', saved forty-two stranded climbers during a sudden Category 5 super-blizzard on the Siachen col. Inside, automatic inductive heaters, dried rations, and satellite distress beacons kept everyone safe until the storm passed. Tariq and Maya were celebrated worldwide as guardians of mountaineers.",
    keywords: [
      { word: "inductive", meaningFa: "القایی، گرمایش الکترومغناطیسی القایی سریع و پاک", phonetic: "/ɪnˈdʌktɪv/" },
      { word: "stranded", meaningFa: "گرفتارشده، درمانده در بوران و بدون راه خروج", phonetic: "/ˈstrændɪd/" },
      { word: "rations", meaningFa: "جیره‌های غذایی فشرده و اضطراری", phonetic: "/ˈræʃnz/" },
      { word: "distress", meaningFa: "اضطرار، خطر مرگ و پیام درخواست کمک فوری", phonetic: "/dɪˈstres/" },
    ],
    question: {
      promptEn: "How many stranded climbers were sheltered and saved by the three alpine huts during the super-blizzard?",
      promptFa: "چند کوهنورد گرفتار در کولاک سهمگین توسط این سه جان‌پناه نجات پیدا کردند؟",
      options: [
        "Forty-two stranded climbers during a sudden Category 5 super-blizzard",
        "Only four professional guides who lost their ropes",
        "Over two hundred tourists stranded on a ski lift",
      ],
      correctIndex: 0,
      hintSnippet: "saved forty-two stranded climbers during a sudden Category 5 super-blizzard on the Siachen col",
      clueFa: "خط دوم رو بخون؛ ۴۲ کوهنورد گرفتار در طوفان درجه ۵ به سلامت نجات پیدا کردند!",
    },
    choiceA: {
      labelEn: "Greet the rescued mountaineers emerging into the crisp sunlit morning snow!",
      labelFa: "به پیشواز کوهنوردان نجات‌یافته بیا که به آفتاب درخشان صبح برفی لبخند می‌زنند!",
      descriptionFa: "دیدن اشک شوق نجات و در آغوش کشیدن دوباره زندگی.",
    },
    choiceB: {
      labelEn: "Toast a steaming mug of hot cocoa with the volunteer alpine patrol team!",
      labelFa: "لیوان کاکائوی داغ را با تیم داوطلب امدادگران کوهستان بالا ببر!",
      descriptionFa: "جشن همدلی و نجات در پایگاه امدادی پس از پایان طوفان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The solar-powered emergency communication grid along the 12-kilometer ice corridor went live, linking every crevasse to the international rescue dispatcher in Skardu via low-Earth-orbit satellites. At the touch of an emergency button, rescue drones could be dispatched within four minutes with automated defibrillators and oxygen canisters.",
    keywords: [
      { word: "dispatcher", meaningFa: "مرکز فرماندهی و اعزام نیروهای امداد", phonetic: "/dɪˈspætʃə(r)/" },
      { word: "defibrillators", meaningFa: "دفیبریلاتورها، دستگاه‌های شوک الکتریکی قلب", phonetic: "/diːˈfɪbrɪleɪtəz/" },
      { word: "low-Earth-orbit", meaningFa: "مدار پایینی زمین (ماهواره‌های ارتباطی سریع)", phonetic: "/ˌləʊ ˈɜːθ ˈɔːbɪt/" },
      { word: "canisters", meaningFa: "کپسول‌های فلزی هوابندی‌شده", phonetic: "/ˈkænɪstəz/" },
    ],
    question: {
      promptEn: "Within how many minutes could emergency rescue drones be dispatched along the corridor?",
      promptFa: "پهپادهای امداد و نجات ظرف چند دقیقه می‌توانستند به محل حادثه اعزام شوند؟",
      options: [
        "Within four minutes with automated defibrillators and oxygen canisters",
        "Within twenty-four hours after weather clearance",
        "Only after local mountain police verified the passport of the victim",
      ],
      correctIndex: 0,
      hintSnippet: "rescue drones could be dispatched within four minutes with automated defibrillators and oxygen canisters",
      clueFa: "خط آخر رو ببین؛ ظرف فقط ۴ دقیقه با شوک قلبی و کپسول‌های اکسیژن به پرواز درمی‌آمدند!",
    },
    choiceA: {
      labelEn: "Test-fire the drone emergency launch system to verify immediate response readiness!",
      labelFa: "پرتاب آزمایشی پهپاد امداد را برای سنجش آمادگی لحظه‌ای فعال کن!",
      descriptionFa: "اطمینان از کارکرد بی‌نقص مدرن‌ترین سامانه نجات کوهستان در جهان.",
    },
    choiceB: {
      labelEn: "Salute the rescue monitoring screens with pride as the network turns entirely green!",
      labelFa: "به مانیتورهای سبز پایگاه امداد ادای احترام کن که نشان از ایمنی کامل منطقه دارند!",
      descriptionFa: "آسودگی خاطر از محافظت کامل تمام کوهنوردان در مرتفع‌ترین دره‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The thirty Balti high-altitude rescue specialists completed their certifications with honors, forming the elite 'Snow Leopard Rescue Corps'. Equipped with custom technical gear and winter snowmobiles, they established the premier alpine rescue team in Asia, proving that local expertise combined with modern technology can conquer any mountain catastrophe.",
    keywords: [
      { word: "certifications", meaningFa: "گواهینامه‌های رسمی مهارت و تخصص", phonetic: "/ˌsɜːtɪfɪˈkeɪʃnz/" },
      { word: "snowmobiles", meaningFa: "خودروهای برف‌رو موتوری مخصوص کوهستان", phonetic: "/ˈsnəʊməbiːlz/" },
      { word: "premier", meaningFa: "برترین، پیشرو و درجه یک", phonetic: "/ˈpremiə(r)/" },
      { word: "catastrophe", meaningFa: "فاجعه، حادثه ناگوار و بحران سنگین", phonetic: "/kəˈtæstrəfi/" },
    ],
    question: {
      promptEn: "What name was chosen for the elite rescue team of thirty certified Balti specialists?",
      promptFa: "سی جوان متخصص و دارای گواهینامه بلتی چه نامی برای یگان نخبه امداد خود برگزیدند؟",
      options: [
        "The 'Snow Leopard Rescue Corps'",
        "The 'Himalayan Golden Eagles'",
        "The 'Baltoro Avalanche Rangers'",
      ],
      correctIndex: 0,
      hintSnippet: "forming the elite 'Snow Leopard Rescue Corps'",
      clueFa: "خط دوم رو ببین دوست من؛ نام پرابهت 'یگان نجات پلنگ‌های برفی' را انتخاب کردند!",
    },
    choiceA: {
      labelEn: "Hand the golden Snow Leopard patch to the corps commander with a proud smile!",
      labelFa: "نشان طلایی پلنگ برفی را با لبخند افتخار به بازوی فرمانده یگان متصل کن!",
      descriptionFa: "لحظه‌ای پرغرور برای جوانان دلاور بلتستان که نجات‌بخش جان همنوعانند.",
    },
    choiceB: {
      labelEn: "Ride in the lead snowmobile through the snowy valley to cheers from local villagers!",
      labelFa: "سوار بر برف‌رو در میان هلهله و شادی اهالی روستا از دره برفی عبور کن!",
      descriptionFa: "جشن پیروزی و امید در کوهپایه‌های زیبای قراقروم.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The high-altitude weather and glacial melt monitoring station at 5,800 meters beamed real-time hydrological data to downstream river basins across Pakistan and India. Providing up to ten days of early warning for catastrophic glacial lake outburst floods, the system safeguarded three million farmers and downstream villages from deadly flash flooding.",
    keywords: [
      { word: "hydrological", meaningFa: "آب‌شناختی، مربوط به چرخه و جریان آب در زمین", phonetic: "/ˌhaɪdrəˈlɒdʒɪkl/" },
      { word: "outburst", meaningFa: "طغیان ناگهانی، سرریز و شکستن ناگهانی سد دریاچه یخچالی", phonetic: "/ˈaʊtbɜːst/" },
      { word: "downstream", meaningFa: "پایین‌دست، مناطق واقع در جهت جریان رودخانه", phonetic: "/ˌdaʊnˈstriːm/" },
      { word: "safeguarded", meaningFa: "حفاظت کرد، در برابر خطر مصون نگه داشت", phonetic: "/ˈseɪfɡɑːdɪd/" },
    ],
    question: {
      promptEn: "How many downstream farmers and villagers were protected by the early flood warning system?",
      promptFa: "سامانه هشدار زودهنگام سیلاب جان و خانه چند میلیون کشاورز در پایین‌دست را حفظ کرد؟",
      options: [
        "Three million farmers and downstream villagers",
        "Only fifty thousand residents of large cities",
        "Less than five hundred nomadic herders",
      ],
      correctIndex: 0,
      hintSnippet: "the system safeguarded three million farmers and downstream villages from deadly flash flooding",
      clueFa: "خط آخر رو نگاه کن؛ جان و زندگی سه میلیون کشاورز و روستایی پایین‌دست را در برابر سیلاب‌های مهلک نجات داد!",
    },
    choiceA: {
      labelEn: "Watch live flood-defense telemetry green lights blink in safety from the control room!",
      labelFa: "چراغ‌های سبز ایمنی سامانه سد سیلاب را در اتاق کنترل تماشا کن!",
      descriptionFa: "دیدن میوه شیرین علم و کوهنوردی در نجات زندگی میلیون‌ها خانواده زحمتکش.",
    },
    choiceB: {
      labelEn: "Share a basket of fresh pomegranates with thankful farmers along the Indus River valley!",
      labelFa: "یک سبد انار تازه را با کشاورزان سپاسگزار در دره رود سند با صفا تقسیم کن!",
      descriptionFa: "پیوند قلب‌های مردم با دانشمندانی که نگهبان آرامش مزارعشان شدند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Open-source engineering schematics for the solid-state geothermal generator were adopted by Antarctic research stations, Greenland glacial observatories, and high-Andean medical posts. Operating completely without diesel fuel, the technology eliminated thirty thousand tons of carbon emissions annually, proving that extreme mountains can teach humanity how to live in harmony with the Earth.",
    keywords: [
      { word: "solid-state", meaningFa: "حالت جامد، الکترونیکی و بدون قطعات مکانیکی متحرک", phonetic: "/ˌsɒlɪd ˈsteɪt/" },
      { word: "emissions", meaningFa: "گازهای آلاینده کربنی خروجی به اتمسفر", phonetic: "/ɪˈmɪʃnz/" },
      { word: "eliminated", meaningFa: "حذف کرد، از میان برداشت", phonetic: "/ɪˈlɪmɪneɪtɪd/" },
      { word: "harmony", meaningFa: "هماهنگی، همزیستی مسالمت‌آمیز با محیط زیست", phonetic: "/ˈhɑːməni/" },
    ],
    question: {
      promptEn: "How many tons of carbon emissions were eliminated annually by the open-source generator?",
      promptFa: "ژنراتور پاک ابداع‌شده سالانه مانع انتشار چند تن گازهای آلاینده کربنی شد؟",
      options: [
        "Thirty thousand tons of carbon emissions annually across polar and alpine stations",
        "Only five hundred kilograms of carbon soot",
        "Ten million tons from commercial maritime container ships",
      ],
      correctIndex: 0,
      hintSnippet: "the technology eliminated thirty thousand tons of carbon emissions annually",
      clueFa: "خط سوم رو ببین؛ سالانه ۳۰ هزار تن آلاینده کربنی را از قطب و کوهستان‌های زمین حذف کرد!",
    },
    choiceA: {
      labelEn: "Watch the clean geothermal exhaust steam rise into the pristine starlit Karakoram night!",
      labelFa: "بخار زلال و پاک ژنراتور را تماشا کن که به آسمان پرستاره و زلال قراقروم اوج می‌گیرد!",
      descriptionFa: "پایانی الهام‌بخش، پاک و جاودانه بر فراز بلندترین قله‌های سیاره زمین.",
    },
    choiceB: {
      labelEn: "Clasp hands with Maya atop the windy col, celebrating a mission that transformed the future!",
      labelFa: "دست در دست مایا بر فراز گردنه بادگیر کوهستان، پیروزی نجات آینده زمین را جشن بگیرید!",
      descriptionFa: "پایان حماسه‌ای بی‌همتا از شجاعت، دانش و دوستی ابدی در دل یخ و سنگ.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Memory of the World Inscription", titleFa: "ثبت در حافظه جهانی یونسکو", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان میراث جاودان", climaxEn: "The Kushan electrum star catalogue receives UNESCO's highest honor, celebrated as a triumph of ancient Asian scientific brilliance.", climaxFa: "کاتالوگ زرین ستارگان امپراتوری کوشان به ثبت جهانی یونسکو رسید و به نماد نبوغ علمی آسیای کهن بدل شد.", xpReward: 295 },
  { pathCode: "AAAAB", titleEn: "The Sirdar's Golden Toast", titleFa: "سلامتی اشرافی به سرداران کوهستان", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان وفاداری و برادری", climaxEn: "Tariq and Maya present the expedition medal to the Balti mountain guides, honoring the unbreakable bond of mountain brotherhood.", climaxFa: "طارق و مایا مدال کاوش را به راهنمایان وفادار بلتی تقدیم کردند تا پیمان برادری کوهستان را جاودانه سازند.", xpReward: 285 },
  { pathCode: "AAABA", titleEn: "The Protectors of the Karakoram Sanctuary", titleFa: "پاسداران حرم امن قراقروم", badgeCategory: "scholar", badgeIcon: "🛡️", badgeNameFa: "پایان حراست از طبیعت", climaxEn: "Local village elders receive their official ranger badges, taking sovereign stewardship over ten thousand square kilometers of peaks.", climaxFa: "بزرگان روستاهای محلی نشان‌های محیط‌بانی را بر سینه زدند تا از ده هزار کیلومتر مربع از پاک‌ترین قله‌ها پاسداری کنند.", xpReward: 285 },
  { pathCode: "AAABB", titleEn: "The Summit of Eternal Peace", titleFa: "بر فراز قله‌های آرامش ابدی", badgeCategory: "legendary", badgeIcon: "🏔️", badgeNameFa: "پایان شکوه و معنویت", climaxEn: "Looking out over the boundless Karakoram spires, two explorers feel the profound peace of a mission dedicated to truth and nature.", climaxFa: "با نگاه به قله‌های بیکران قراقروم، دو کاشف آرامشی عمیق را حس کردند؛ پاداش ماموریتی وقف حقیقت و طبیعت.", xpReward: 290 },
  { pathCode: "AABAA", titleEn: "The Guimet Museum Ovation", titleFa: "تشویق پرشور در موزه گیمه پاریس", badgeCategory: "explorer", badgeIcon: "🎨", badgeNameFa: "پایان بین‌المللی فرهنگی", climaxEn: "Standing before the 3D holographic projection of the bilingual inscription in Paris, Tariq and Maya receive a standing ovation.", climaxFa: "در برابر تصویر هولوگرام کتیبه دوزبانه در پاریس، طارق و مایا در میان هلهله مشتاقان فرهنگ جهان ایستادند.", xpReward: 290 },
  { pathCode: "AABAB", titleEn: "The Pyramid of Starlight", titleFa: "هرم ستاره‌ها و باران پاریس", badgeCategory: "scholar", badgeIcon: "☕", badgeNameFa: "پایان شاعرانه و دلنشین", climaxEn: "Sipping espresso beneath the glass pyramid of the Louvre, two mountain comrades celebrate the survival of ancient ideas.", climaxFa: "با نوشیدن قهوه زیر هرم شیشه‌ای لوور، دو یار کوهستان پیروزی و بقای اندیشه‌های کهن را جشن گرفتند.", xpReward: 280 },
  { pathCode: "AABBA", titleEn: "The Vanguard of the Gilgit Academy", titleFa: "پیشتازان آکادمی کوهنوردی گلگت", badgeCategory: "heroic", badgeIcon: "🧗", badgeNameFa: "پایان پرورش قهرمانان", climaxEn: "Forty young scholarship climbers raise their climbing axes, ready to lead Himalayan mountaineering with unmatched skill and safety.", climaxFa: "چهل جوان کوهنورد کلنگ‌های یخی خود را بالا بردند؛ آماده رهبری صعودهای هیمالیا با بالاترین ایمنی و مهارت.", xpReward: 290 },
  { pathCode: "AABBB", titleEn: "The Campfire of the Karakoram", titleFa: "آتشدان صمیمیت در قراقروم", badgeCategory: "funny", badgeIcon: "🔥", badgeNameFa: "پایان شاداب و صمیمی", climaxEn: "Folk songs ring out under northern stars as local students and researchers celebrate the warmth of human connection.", climaxFa: "سرودهای محلی زیر ستارگان شمال طنین‌انداز شد و دانشجویان و کاشفان گرمای پیوند دل‌ها را جشن گرفتند.", xpReward: 275 },
  { pathCode: "ABAAA", titleEn: "The Geneva Gift of Life", titleFa: "ارمغان حیات در ژنو", badgeCategory: "legendary", badgeIcon: "❤️", badgeNameFa: "پایان نجات‌بخش انسانی", climaxEn: "A million vials of alpine peptide save thousands of children undergoing heart surgery, proving science can turn frost into life.", climaxFa: "یک میلیون ویال پپتید کوهستان جان هزاران کودک را در جراحی پیوند قلب نجات داد؛ اثبات اینکه علم از دل یخ زندگی می‌آفریند.", xpReward: 300 },
  { pathCode: "ABAAB", titleEn: "The Toast to Human Healing", titleFa: "سلامتی به شفای دردهای انسان", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان افتخار پزشکی", climaxEn: "Medical scientists and mountaineers clink glasses in Geneva, celebrating a discovery that redefined the possibilities of transplant surgery.", climaxFa: "پزشکان و کوهنوردان جام شادی را در ژنو نوشیدند و دستاوردی را جشن گرفتند که مرزهای جراحی پیوند را جابه‌جا کرد.", xpReward: 285 },
  { pathCode: "ABABA", titleEn: "The Skardu Dawn of Science", titleFa: "سپیده‌دم علم در دره سکردو", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان شکوفایی منطقه‌ای", climaxEn: "Eighty researchers inaugurate the bioscience institute in Skardu, transforming a mountain town into a beacon of high-altitude discovery.", climaxFa: "هشتاد پژوهشگر پژوهشکده سکردو را افتتاح کردند و شهری کوهستانی را به مشعل دانش زیست‌فناوری جهان بدل ساختند.", xpReward: 290 },
  { pathCode: "ABABB", titleEn: "The Apricot Valley Serenade", titleFa: "آرامش در باغ‌های زردآلو", badgeCategory: "scholar", badgeIcon: "🌸", badgeNameFa: "پایان صلح و زیبایی", climaxEn: "Walking through blooming apricot orchards under the shadow of the Karakoram, Tariq and Maya listen to the river's timeless song.", climaxFa: "با قدم زدن در باغ‌های شکوفای زردآلو در سایه‌سار قراقروم، طارق و مایا به نغمه جاودانه رودخانه گوش سپردند.", xpReward: 280 },
  { pathCode: "ABBAA", titleEn: "The Moonlit Pyramid of K2", titleFa: "هرم مهتابی کی‌دو در افلاک", badgeCategory: "legendary", badgeIcon: "🔭", badgeNameFa: "پایان رصدخانه قله‌ها", climaxEn: "The Concordia geothermal observatory tracks cosmic wonders above the snow pyramids, powered entirely by the heat of the living earth.", climaxFa: "رصدخانه زمین‌گرمایی کنکوردیا شگفتی‌های کیهان را بالای هرم برفی کی۲ ثبت کرد؛ گرم‌شده با حرارت دل زمین پاک.", xpReward: 295 },
  { pathCode: "ABBAB", titleEn: "The Zero-Carbon Signal of Concordia", titleFa: "سیگنال سبز و پاک کنکوردیا", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان محیط‌زیستی برجسته", climaxEn: "The World Meteorological Organization receives the first zero-carbon climate dataset from the roof of the world.", climaxFa: "سازمان جهانی هواشناسی اولین بسته داده‌های اقلیمی کاملاً پاک را از بام جهان مخابره کرد.", xpReward: 285 },
  { pathCode: "ABBBA", titleEn: "The United Nations Gavel of Concord", titleFa: "طنین چکش صلح در سازمان ملل", badgeCategory: "legendary", badgeIcon: "🌐", badgeNameFa: "پایان دیپلماتیک جهانی", climaxEn: "One hundred ninety-three nations pledge two billion dollars to clean alpine habitats, following Tariq and Maya’s visionary presentation.", climaxFa: "صد و نود و سه کشور دو میلیارد دلار برای ایستگاه‌های پاک کوهستان تعهد کردند؛ الهام‌گرفته از سخنرانی طارق و مایا.", xpReward: 295 },
  { pathCode: "ABBBB", titleEn: "The Autumn Stroll of Manhattan", titleFa: "قدم زدن در پاییز منهتن", badgeCategory: "heroic", badgeIcon: "🍂", badgeNameFa: "پایان موفقیت و آرامش", climaxEn: "Stepping onto the avenues of New York, two mountaineers smile at the sky, knowing their footsteps helped heal the planet.", climaxFa: "با قدم نهادن در خیابان‌های نیویورک، دو کوهنورد به آسمان لبخند زدند؛ با این آرامش که گام‌هایشان به سلامت زمین کمک کرد.", xpReward: 285 },
  { pathCode: "BAAAA", titleEn: "The National Star of Pakistan", titleFa: "مدال ستاره پاکستان بر سینه کاشفان", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان افتخار ملی و تاریخی", climaxEn: "The President presents the National Star medal to the expedition leaders, celebrating the recovery of the ancient silk star charts.", climaxFa: "رئیس‌جمهور نشان ملی ستاره پاکستان را به سرپرستان کاوش اهدا کرد و نجات نقشه‌های ابریشمی افلاک را ستود.", xpReward: 295 },
  { pathCode: "BAAAB", titleEn: "The Gallery of Ancient Astronomers", titleFa: "تالار کاشفان باستانی آسمان", badgeCategory: "scholar", badgeIcon: "🌌", badgeNameFa: "پایان آموزشی و ماندگار", climaxEn: "Children gaze at the cinnabar star charts in Islamabad, inspired by the ancient nomads who mapped the heavens from the heights.", climaxFa: "کودکان با چشمان درخشان به نقشه‌های سرخ‌رنگ افلاک در اسلام‌آباد نگریستند؛ الهام‌گرفته از نیاکانی که آسمان را از قله‌ها رسم کردند.", xpReward: 280 },
  { pathCode: "BAABA", titleEn: "The Oxford Laurels of Cartography", titleFa: "برگ زرین نقشه‌نگاری در آکسفورد", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان دانشگاهی ممتاز", climaxEn: "Honorary doctorates at Oxford celebrate 'Starlight Through the Col', establishing ancient Asia as the pioneer of world commerce.", climaxFa: "دکتراهای افتخاری آکسفورد کتاب مرجع را ستایش کردند و آسیای کهن را پیشگام پیوند فرهنگ‌ها و تجارت جهان شناختند.", xpReward: 290 },
  { pathCode: "BAABB", titleEn: "The Whispering Willows of Oxford", titleFa: "بیدهای مجنون در کنار رود چرول", badgeCategory: "scholar", badgeIcon: "🍃", badgeNameFa: "پایان متین و خاطره‌انگیز", climaxEn: "Beside the quiet river Cherwell, Tariq and Maya listen to the rustling leaves, forever connected to the wild Karakoram ice.", climaxFa: "در کنار رود آرام چِروِل، طارق و مایا به صدای برگ‌ها گوش سپردند؛ در پیوندی ابدی با یخچال‌های وحشی قراقروم.", xpReward: 285 },
  { pathCode: "BABAA", titleEn: "The Zero-Fatality Milestone", titleFa: "حماسه نجات بدون قربانی در شاکسگام", badgeCategory: "heroic", badgeIcon: "🛡️", badgeNameFa: "پایان نجات‌بخش ماندگار", climaxEn: "The Vance-Sterling High Safety Corridor registers two consecutive seasons without a single casualty, hailed as a miracle of mountaineering.", climaxFa: "گذرگاه ایمن ونس-استرلینگ دو فصل متوالی بدون حتی یک قربانی را ثبت کرد و به عنوان معجزه ایمنی کوهستان ستایش شد.", xpReward: 295 },
  { pathCode: "BABAB", titleEn: "The Hearth of the Mountain Guides", titleFa: "چای داغ در کلبه راهنمایان", badgeCategory: "funny", badgeIcon: "🫖", badgeNameFa: "پایان صمیمی و پرمحبت", climaxEn: "Laughing around steaming mugs of butter tea, local porters bless the safety cables that brought them home alive to their families.", climaxFa: "با خنده دور لیوان‌های چای کره‌ای، باربران محلی سیم‌های ایمنی را دعا کردند که آنها را زنده به آغوش خانواده‌هایشان بازگرداند.", xpReward: 280 },
  { pathCode: "BABBA", titleEn: "The Forty-Two Lives of Siachen", titleFa: "نجات چهل و دو انسان در کولاک", badgeCategory: "heroic", badgeIcon: "⛺", badgeNameFa: "پایان حماسه امداد", climaxEn: "Forty-two mountaineers emerge safely into the morning sun, saved from a Category 5 blizzard by the automated thermal shelters.", climaxFa: "چهل و دو کوهنورد سالم به آفتاب صبح برفی قدم گذاشتند؛ نجات‌یافته از کولاک سهمگین توسط پناهگاه‌های حرارتی خودکار.", xpReward: 295 },
  { pathCode: "BABBB", titleEn: "The Patrol of the Ice Guardians", titleFa: "گشت شوالیه‌های نجات برفی", badgeCategory: "heroic", badgeIcon: "🎿", badgeNameFa: "پایان رفاقت و شجاعت", climaxEn: "Volunteer rescue rangers celebrate under the peaks with hot cocoa, knowing they turned a deadly col into a sanctuary of life.", climaxFa: "امدادگران داوطلب با لیوان‌های کاکائوی داغ زیر قله‌ها جشن گرفتند؛ با این افتخار که گردنه مرگ را به پناهگاه زندگی بدل کردند.", xpReward: 285 },
  { pathCode: "BBAAA", titleEn: "The Sky Net of the Karakoram", titleFa: "تور نجات ماهواره‌ای در بام جهان", badgeCategory: "legendary", badgeIcon: "🛰️", badgeNameFa: "پایان فناوری پیشرفته نجات", climaxEn: "The automated drone rescue grid ensures immediate medical response across twelve kilometers of crevasses, saving lives instantly.", climaxFa: "شبکه پهپادهای امداد نجات سریع در دوازده کیلومتر شکاف یخی را تضمین کرد و زندگی‌ها را در چند دقیقه نجات بخشید.", xpReward: 295 },
  { pathCode: "BBAAB", titleEn: "The Green Beacons of Concordia", titleFa: "چراغ‌های سبز ایمنی در کنکوردیا", badgeCategory: "heroic", badgeIcon: "🟢", badgeNameFa: "پایان هوشیاری و آرامش", climaxEn: "Every beacon blinks green across the Karakoram map, proving that courage and technology have tamed the most dangerous pass on Earth.", climaxFa: "تمام چراغ‌های نقشه قراقروم به رنگ سبز درآمد؛ اثبات اینکه شجاعت و دانش خطرناک‌ترین گذرگاه زمین را رام کرده‌اند.", xpReward: 285 },
  { pathCode: "BBBAA", titleEn: "The Snow Leopard Patrol Oath", titleFa: "سوگند یگان پلنگ‌های برفی", badgeCategory: "heroic", badgeIcon: "🐆", badgeNameFa: "پایان افتخار نیروهای بومی", climaxEn: "Thirty elite Balti specialists wear their gold Snow Leopard badges with pride, guarding the ice corridors with peerless valor.", climaxFa: "سی جوان دلاور بلتی نشان طلایی پلنگ برفی را بر سینه زدند تا با شجاعتی بی‌مانند نگهبان گذرگاه‌های یخی باشند.", xpReward: 290 },
  { pathCode: "BBBAB", titleEn: "The Snowmobile Cavalcade of Skardu", titleFa: "رژه پیروزی در دره برفی", badgeCategory: "funny", badgeIcon: "🛷", badgeNameFa: "پایان شاداب و مردمی", climaxEn: "Villagers cheer as the Snow Leopard snowmobiles parade through the valley, celebrating a new era of safety and pride.", climaxFa: "روستاییان هلهله کردند وقتی رژه برف‌روهای پلنگ برفی از دره گذشت؛ آغاز عصری تازه از ایمنی، عزت و امید.", xpReward: 280 },
  { pathCode: "BBBBA", titleEn: "The Guardians of Three Million Homes", titleFa: "نگهبانان سه میلیون خانه و مزرعه", badgeCategory: "legendary", badgeIcon: "🌾", badgeNameFa: "پایان نجات جان میلیون‌ها انسان", climaxEn: "Early glacial flood warnings protect three million downstream farming families, turning mountain research into salvation.", climaxFa: "هشدارهای به‌موقع سیلاب جان سه میلیون خانواده کشاورز را نجات داد و دانش کوهستان را به معجزه نجات انسان‌ها بدل ساخت.", xpReward: 300 },
  { pathCode: "BBBBB", titleEn: "The Clean Steam of the Heavens", titleFa: "بخار زلال بر فراز آسمان قراقروم", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان ابدی و بهشتی", climaxEn: "Clean geothermal steam rises toward the stars above K2, as Tariq and Maya celebrate a legacy that unites humanity with Earth.", climaxFa: "بخار زلال زمین‌گرمایی به سوی ستارگان بالای کی۲ اوج گرفت؛ طارق و مایا میراثی جاودان را جشن گرفتند که انسان را با زمین آشتی داد.", xpReward: 300 },
];

export const story3KarakoramTraverse: AdventureStory = buildAdventureStory({
  id: "c2-karakoram-traverse",
  storyIndex: 3,
  cefr: "C2",
  titleEn: "Passage Through the Karakoram Abyss",
  titleFa: "سفر اکتشافی به گذرگاه دست‌نیافتنی قراقروم",
  genre: "travel",
  genreLabelFa: "🧭 سفر و ماجراجویی",
  genreIcon: "🧭",
  synopsisEn:
    "Navigating the unmapped knife-edge seracs of the Siachen-Karakoram corridor at minus forty degrees, High-Altitude Geomorphologist Dr. Tariq Vance and Glacial Cartographer Maya Sterling uncover ancient Silk Road petroglyphs and hydrothermal tectonic vents across 32 heroic and breathtaking endings.",
  synopsisFa:
    "در دمای منفی ۴۰ درجه و در میان تیغه‌های یخی و هولناک قله‌های قراقروم، دکتر طارق ونس (زمین‌ریخت‌شناس ارشد کوهستان) و مایا استرلینگ (نقشه‌نگار حرفه‌ای یخچال‌های طبیعی) یک گذرگاه باستانی و ناشناخته را در ارتفاع ۶۴۰۰ متری پی می‌گیرند تا سنگ‌نگاره‌های گم‌شده جاده ابریشم و روزنه‌های گرمابی زمین‌ساختی را کشف کنند! ۳۲ پایان پر از هیجان کوهنوردی استقامتی، تصمیمات سرنوشت‌ساز و مناظر مسحورکننده کوهستان در انتظار شماست!",
  coverImage: "/images/skills/reading/c2-karakoram-traverse.webp",
  nodes,
  endings,
});
