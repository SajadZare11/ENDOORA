import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3 (C1 - Adult): The Patagonian Glacial Crossing (سفر اکتشافی به شکاف‌های یخچالی پاتاگونیا)
// Genre: Travel & Adventure (سفر و ماجراجویی)
// CEFR: C1 (Inversion with negative adverbials, mixed conditionals, geophysical deduction, high-latitude expedition)
// Characters: Dr. Gabriel Morales (Chief Glaciologist), Sofia Alvarez (Alpine Geoscientist), Mateo Ramos (Patagonian Guide)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Scarcely had the twin-engine ski plane departed from the ice runway when an unseasonal polar tempest swept across the Southern Patagonian Ice Field. At three thousand meters above sea level, Dr. Gabriel Morales adjusted his snow goggles against the blinding blizzard. Satellite radar telemetry had indicated anomalous subterranean heat signatures beneath the Upsala Glacier—unprecedented thermal plumes that threatened to trigger a catastrophic calving event into Lake Argentino. Accompanied by alpine geoscientist Sofia Alvarez and veteran Patagonian guide Mateo Ramos, Gabriel needed to plant a seismic sensor array at the rim of the Great Fissure before nightfall. However, thirty-knot winds were rapidly opening hidden crevasses across the blue ice plateau.",
    keywords: [
      { word: "tempest", meaningFa: "طوفان سهمگین با بادهای ویرانگر و کولاک", phonetic: "/ˈtempɪst/" },
      { word: "anomalous", meaningFa: "ناهنجار، غیرعادی و نامتعارف", phonetic: "/əˈnɒmələs/" },
      { word: "calving", meaningFa: "زایش یا فروریختن تکه‌های عظیم یخ به دریاچه یا اقیانوس", phonetic: "/ˈkɑːvɪŋ/" },
      { word: "crevasses", meaningFa: "شکاف‌های عمیق و مرگبار در دل یخچال‌های طبیعی", phonetic: "/krəˈvæsɪz/" },
    ],
    question: {
      promptEn: "What alarming geological phenomenon compelled the team to traverse the ice field in a storm?",
      promptFa: "چه پدیده نگران‌کننده زمین‌شناسی تیم را وادار به عبور از میدان یخی در دل طوفان کرد؟",
      options: [
        "Unprecedented subterranean thermal plumes threatening a catastrophic glacial calving event",
        "A volcanic ash cloud grounding all aircraft in South America",
        "The sudden migration of polar wolves across the border",
      ],
      correctIndex: 0,
      hintSnippet: "indicated anomalous subterranean heat signatures beneath the Upsala Glacier—unprecedented thermal plumes that threatened to trigger a catastrophic calving event",
      clueFa: "خط سوم رو ببین دوست من؛ فواره‌های حرارتی زیرزمینی بی‌سابقه که تهدید می‌کردند کوه یخ را شکسته و به دریاچه فرو بریزند.",
    },
    choiceA: {
      labelEn: "Rope together as a three-person alpine team and navigate through the wind-scoured serac labyrinth!",
      labelFa: "هر سه نفر با طناب حمایتی به هم متصل شوید و از میان پیچ‌وخم برج‌های یخی ناپایدار عبور کنید!",
      descriptionFa: "عبور از هزارتوی طبیعی دیواره‌های یخی که پناهگاهی در برابر بادهای کشنده است.",
    },
    choiceB: {
      labelEn: "Skis with ground-penetrating radar sleds along the exposed windward ridge for maximum speed!",
      labelFa: "با اسکی‌های فنی و سورتمه مجهز به رادار نفوذ در زمین از روی یال رو به باد با حداکثر سرعت حرکت کنید!",
      descriptionFa: "سرعت بسیار بالا که رسیدن به لبه شکاف را قبل از تاریکی کامل تضمین می‌کند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Tied into an eighty-meter dynamic dry rope, Gabriel, Sofia, and Mateo picked their way through the towering blue seracs. The ice pillars groaned under immense gravitational shear stress, echoing like distant artillery. Sofia swung her carbon-fiber ice axe into a frozen bridge spanning a seventy-meter abyssal crevasse. Suddenly, the snow bridge gave way beneath her right crampon. Had Mateo not instantly planted his steel ice axe into a solid granite outcrop behind them, Sofia would have plummeted into the turquoise abyss. Hanging suspended over the void, Sofia called out calmly: 'Gabriel, the crevasse wall isn't pure ice—it's layered with volcanic basalt and geothermal steam vents!'",
    keywords: [
      { word: "seracs", meaningFa: "سِراک‌ها (ستون‌ها و برج‌های نوک‌تیز یخی عظیم)", phonetic: "/seˈrækz/" },
      { word: "shear stress", meaningFa: "تنش برشی و فشار جانبی سنگین بر بافت یخ", phonetic: "/ʃɪər stres/" },
      { word: "abyssal", meaningFa: "مربوط به اعماق تاریک و ژرفای پرتگاه‌ها", phonetic: "/əˈbɪsl/" },
      { word: "basalt", meaningFa: "سنگ بازالت آتشفشانی سخت و تیره", phonetic: "/ˈbæsɔːlt/" },
    ],
    question: {
      promptEn: "What extraordinary geological discovery did Sofia make while suspended over the crevasse?",
      promptFa: "سوفیا در حالی که روی پرتگاه معلق بود چه پدیده زمین‌شناسی شگفت‌انگیزی را کشف کرد؟",
      options: [
        "The crevasse wall was layered with volcanic basalt and geothermal steam vents",
        "A hidden cave filled with pre-Columbian gold pottery",
        "A frozen mammoth preserved inside an ice dome",
      ],
      correctIndex: 0,
      hintSnippet: "the crevasse wall isn't pure ice—it's layered with volcanic basalt and geothermal steam vents!",
      clueFa: "خط آخر رو نگاه کن رفیق؛ دیواره شکاف یخ خالص نبود، بلکه از لایه‌های بازالت آتشفشانی و روزنه‌های بخار زمین‌گرمایی تشکیل شده بود.",
    },
    choiceA: {
      labelEn: "Lower Sofia into the geothermal crevasse chamber to collect mineralized core samples directly!",
      labelFa: "سوفیا را با طناب به داخل اتاقک زمین‌گرمایی شکاف بفرست تا مستقیماً نمونه‌های معدنی جمع کند!",
      descriptionFa: "دستیابی مستقیم به نمونه‌های داغ سنگ و گاز برای اثبات قطعی فعالیت آتشفشانی.",
    },
    choiceB: {
      labelEn: "Haul Sofia onto the solid rim and detour around the fracture line to reach the summit plateau!",
      labelFa: "سوفیا را سریعاً روی لبه مستحکم بالا بکش و با دور زدن خط شکستگی به فلات قله صعود کنید!",
      descriptionFa: "اولویت دادن به امنیت جانی تیم و صعود به نقطه دیده‌بانی مسلط بر یخچال.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Gliding across the frozen firn on technical touring skis, Gabriel pulled the ground-penetrating radar sled at fifteen kilometers per hour. The digital display revealed real-time cross-sections of the subterranean glacier: forty meters beneath their ski tips, a colossal river of hydrothermal meltwater was carving a cavernous subterranean tunnel through the ice bed. If this pressurized subglacial torrent breached the terminal moraine, an unprecedented glacial lake outburst flood would surge toward downstream towns in less than six hours.",
    keywords: [
      { word: "firn", meaningFa: "برف فشرده و نیمه‌یخچالی متراکم", phonetic: "/fɜːrn/" },
      { word: "hydrothermal", meaningFa: "آب‌گرمایی (آب‌های جوشان زیرزمینی ناشی از ماگما)", phonetic: "/ˌhaɪdrəʊˈθɜːrml/" },
      { word: "moraine", meaningFa: "مورن (توده رسوبات سنگی انباشته‌شده در لبه یخچال)", phonetic: "/məˈreɪn/" },
      { word: "outburst", meaningFa: "طغیان ناگهانی و فورانی سیلاب دریاچه‌های یخی", phonetic: "/ˈaʊtbɜːrst/" },
    ],
    question: {
      promptEn: "What catastrophe threatened downstream towns if the hydrothermal torrent breached the moraine?",
      promptFa: "اگر جریان پرفشار آب گرم سد مورنی را می‌شکست چه فاجعه‌ای شهرهای پایین‌دست را تهدید می‌کرد؟",
      options: [
        "A catastrophic glacial lake outburst flood surging downstream in less than six hours",
        "A toxic chemical smog enveloping the mountain valleys",
        "A magnetic storm knocking out the national power grid",
      ],
      correctIndex: 0,
      hintSnippet: "If this pressurized subglacial torrent breached the terminal moraine, an unprecedented glacial lake outburst flood would surge toward downstream towns in less than six hours",
      clueFa: "خط آخر رو بخون؛ سیلاب فاجعه‌بار طغیان دریاچه یخی ظرف کمتر از ۶ ساعت آبادی‌های پایین‌دست را می‌بلعید.",
    },
    choiceA: {
      labelEn: "Transmit real-time satellite emergency flood telemetry directly to Argentina's Civil Protection Directorate!",
      labelFa: "داده‌های اضطراری سیلاب را از طریق ماهواره مستقیماً به ستاد مدیریت بحران کشور مخابره کن!",
      descriptionFa: "هشدار زودهنگام به اهالی دره تا هزاران خانواده به نقاط امن پناه ببرند.",
    },
    choiceB: {
      labelEn: "Deploy autonomous acoustic resonance beacons into the ice to monitor fracture propagation in real time!",
      labelFa: "حسگرهای صوتی هوشمند را در دل یخ کار بگذار تا سرعت گسترش شکاف را لحظه به لحظه بسنجند!",
      descriptionFa: "محاسبه دقیق زمان شکستن سد یخچالی جهت کنترل هدفمند خروجی آب.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Suspended twenty-five meters down the steaming crevasse, Sofia felt the ambient air temperature jump from minus fifteen to a balmy plus twenty-five degrees Celsius. Illuminated by her high-intensity halogen helmet lamp, the subterranean basalt chamber opened into a breathtaking volcanic grotto. Micro-crystals of sulfur and prismatic quartz sparkled along the wet rock walls. In the center, a subterranean boiling geyser pulsed rhythmically into a turquoise mineral pool, surrounded by rare thermophilic bacterial colonies never before documented at sub-polar latitudes.",
    keywords: [
      { word: "balmy", meaningFa: "مطبوع، ملایم و دلپذیر", phonetic: "/ˈbɑːmi/" },
      { word: "grotto", meaningFa: "غار یا تالار زیرزمینی دنج و شگفت‌انگیز", phonetic: "/ˈɡrɒtəʊ/" },
      { word: "thermophilic", meaningFa: "گرماپژوه (میکروب‌هایی که در آب‌های جوشان زندگی می‌کنند)", phonetic: "/ˌθɜːrməˈfɪlɪk/" },
      { word: "geyser", meaningFa: "آب‌فشان طبیعی جوشان در دل زمین", phonetic: "/ˈɡiːzər/" },
    ],
    question: {
      promptEn: "What unprecedented biological discovery was found thriving around the subterranean boiling pool?",
      promptFa: "چه پدیده زیست‌شناسی بی‌سابقه‌ای در اطراف استخر آب جوشان زیرزمینی زندگی می‌کرد؟",
      options: [
        "Thermophilic bacterial colonies never before documented at sub-polar latitudes",
        "A species of glowing blind subterranean cave fish",
        "Luminescent giant fungi growing on volcanic glass",
      ],
      correctIndex: 0,
      hintSnippet: "surrounded by rare thermophilic bacterial colonies never before documented at sub-polar latitudes",
      clueFa: "خط آخر متن رو ببین دوست من؛ کلنی‌های باکتری گرماپژوه که هرگز در عرض‌های جغرافیایی قطبی دیده نشده بودند.",
    },
    choiceA: {
      labelEn: "Collect hermetic bio-samples of the thermophilic bacteria using cryogenic containment flasks!",
      labelFa: "نمونه‌های زیستی باکتری را درون فلاسک‌های منجمدکننده عایق‌بندی‌شده جمع‌آوری کن!",
      descriptionFa: "نمونه‌هایی انقلابی که راز حیات در سرمای کرات دیگر مانند مریخ را روشن می‌سازند.",
    },
    choiceB: {
      labelEn: "Plant a deep-crust thermal thermocouple probe directly into the hydrothermal geyser conduit!",
      labelFa: "کاوشگر حرارتی پرقدرت را مستقیماً درون مجرای آب‌فشان کار بگذار تا دمای ماگما را بسنجد!",
      descriptionFa: "پایش ضربان قلب آتشفشان فعال زیر یخ‌ها با تجهیزات دقیق ژئوفیزیک.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Hauling Sofia back onto the solid plateau, the three mountaineers scrambled across a series of frozen basalt terraces leading to the summit of Nunatak Esperanza. Standing on the jagged granite spine, Gabriel peered through his optical rangefinder. Below them, the vast expanse of the Southern Ice Field stretched two hundred kilometers toward the Pacific horizon, lit by the eerie golden glow of twilight piercing storm clouds. Directly beneath their vantage point, an enormous pressure ridge was actively heaving, lifting ten-thousand-ton blocks of sapphire ice like building blocks.",
    keywords: [
      { word: "nunatak", meaningFa: "نوناتاک (قله یا صخره بیرون‌زده از دل میدان یخ و برف)", phonetic: "/ˈnʌnətæk/" },
      { word: "rangefinder", meaningFa: "فاصله‌یاب اپتیکال لیزری دقیق", phonetic: "/ˈreɪndʒfaɪndər/" },
      { word: "vantage point", meaningFa: "موقعیت دیده‌بانی مسلط و مرتفع", phonetic: "/ˈvɑːntɪdʒ pɔɪnt/" },
      { word: "heaving", meaningFa: "برآمده شدن، بالا و پایین رفتن سنگین زمین یا یخ", phonetic: "/ˈhiːvɪŋ/" },
    ],
    question: {
      promptEn: "What dynamic movement was the massive pressure ridge undergoing below their vantage point?",
      promptFa: "یخ‌های تحت فشار در زیر پای تیم دیده‌بانی چه حرکتی از خود نشان می‌دادند؟",
      options: [
        "Actively heaving and lifting ten-thousand-ton blocks of sapphire ice",
        "Slowly melting into a peaceful alpine meadow",
        "Drifting peacefully into the Pacific ocean",
      ],
      correctIndex: 0,
      hintSnippet: "an enormous pressure ridge was actively heaving, lifting ten-thousand-ton blocks of sapphire ice like building blocks",
      clueFa: "خط آخر رو نگاه کن؛ با تکان‌های شدید بلوک‌های ده هزار تنی یخ یاقوتی را مثل مکعب‌های بازی به هوا بلند می‌کرد.",
    },
    choiceA: {
      labelEn: "Establish an automated geodetic laser station on the nunatak to monitor the tectonic heaving!",
      labelFa: "ایستگاه لیزری خودکار ژئودتیک را روی قله برپا کن تا بالاآمدگی تکتونیکی زمین را رصد کند!",
      descriptionFa: "ثبت دقیق‌ترین حرکات لایه‌های زمین با ماهواره‌های اروپایی.",
    },
    choiceB: {
      labelEn: "Deploy a high-resolution drone survey to photograph the entire fault line before the storm closes in!",
      labelFa: "پهپاد شناسایی را پرواز بده تا قبل از تاریکی از تمام خط گسل عکس‌برداری کند!",
      descriptionFa: "ثبت نقشه‌های هوایی بی‌نظیر برای مدیریت مسیر تخلیه یخچال.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Gabriel connected the satellite uplink terminal, transmitting the raw subglacial hydro-radar logs directly to Buenos Aires. The Civil Protection Directorate responded in four minutes: sirens were immediately activated along the Santa Cruz river basin, alerting three downstream agricultural communities to move to high ground. The Director of Emergency Management praised Gabriel's swift protocol: 'Had your team not detected this subglacial river tonight, thousands would have been caught sleeping as the flood crest struck at midnight.'",
    keywords: [
      { word: "uplink", meaningFa: "ارسال داده به ماهواره در مدار زمین", phonetic: "/ˈʌplɪŋk/" },
      { word: "basin", meaningFa: "حوضه آبریز رودخانه و دشت‌های اطراف", phonetic: "/ˈbeɪsn/" },
      { word: "protocol", meaningFa: "دستورالعمل‌های حرفه‌ای و پروتکل اقدام سریع", phonetic: "/ˈprəʊtəkɒl/" },
      { word: "flood crest", meaningFa: "اوج تراز آب سیلاب خروشان", phonetic: "/flʌd krest/" },
    ],
    question: {
      promptEn: "How many minutes did it take for Civil Protection to initiate town evacuations following the uplink?",
      promptFa: "چند دقیقه پس از ارسال داده‌های ماهواره‌ای، ستاد مدیریت بحران تخلیه شهرها را آغاز کرد؟",
      options: [
        "In four minutes, sirens were activated across the river basin",
        "After twenty-four hours of council meetings",
        "Only when the water reached the bridge pillars",
      ],
      correctIndex: 0,
      hintSnippet: "The Civil Protection Directorate responded in four minutes: sirens were immediately activated along the Santa Cruz river basin",
      clueFa: "خط دوم رو ببین؛ ظرف ۴ دقیقه آژیرهای خطر به صدا درآمدند و تخلیه مناطق آغاز شد.",
    },
    choiceA: {
      labelEn: "Coordinate with the regional air brigade to guide water-diversion explosive charges onto the moraine!",
      labelFa: "با یگان هوانوردی هماهنگ کن تا خروج آب را با انفجارهای کنترل‌شده به دره خالی هدایت کنند!",
      descriptionFa: "تخلیه آرام فشار دریاچه بدون تخریب سد اصلی.",
    },
    choiceB: {
      labelEn: "Descend rapidly to Lake Argentino's scientific base to manage the incoming hydro-surge on site!",
      labelFa: "سریعاً به پایگاه علمی دریاچه آرژانتینو فرود بیایید تا مهار میدانی سیلاب را مدیریت کنید!",
      descriptionFa: "فرماندهی میدانی در خط مقدم جهت هدایت قایق‌های نجات و سدها.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Drilling eighty-centimeter boreholes into the blue ice with a portable thermal drill, Sofia and Mateo planted six acoustic resonance geophones. As the sensors locked into the global seismological network, their screens lit up with a rhythmic acoustic frequency—a deep, seventy-hertz resonance known to volcanologists as harmonic tremor. It confirmed beyond all doubt that an active magma chamber three kilometers beneath the ice field had awakened, warming the subglacial aquifers.",
    keywords: [
      { word: "geophones", meaningFa: "ژئوفون‌ها (حسگرهای حساس لرزه‌نگاری زمین)", phonetic: "/ˈdʒiːəfəʊnz/" },
      { word: "boreholes", meaningFa: "گمانه‌ها یا چاهک‌های باریک حفاری‌شده در یخ و سنگ", phonetic: "/ˈbɔːrhəʊlz/" },
      { word: "harmonic tremor", meaningFa: "لرزش‌های هارمونیک مداوم ناشی از حرکت ماگما", phonetic: "/hɑːˈmɒnɪk ˈtremər/" },
      { word: "aquifers", meaningFa: "سفره‌های آب زیرزمینی محبوس در اعماق", phonetic: "/ˈækwɪfərz/" },
    ],
    question: {
      promptEn: "What frequency confirmed the awakening of the subterranean magma chamber?",
      promptFa: "چه فرکانس لرزشی بیدار شدن محفظه ماگما در زیر یخچال را تایید کرد؟",
      options: [
        "A deep seventy-hertz harmonic tremor characteristic of active magma",
        "A high-pitched supersonic ping from shifting ice",
        "A static electrical hum from lightning strikes",
      ],
      correctIndex: 0,
      hintSnippet: "a deep, seventy-hertz resonance known to volcanologists as harmonic tremor. It confirmed beyond all doubt that an active magma chamber",
      clueFa: "خط سوم رو نگاه کن دوست من؛ یک لرزش هارمونیک عمیق ۷۰ هرتزی که ویژگی بارز حرکت ماگماست.",
    },
    choiceA: {
      labelEn: "Broadcast the volcanic awakening coordinates to the Global Volcanism Program in Washington!",
      labelFa: "مختصات بیداری آتشفشان را به برنامه بین‌المللی آتشفشان‌شناسی مخابره کن!",
      descriptionFa: "هشدار فوری جهانی جهت بسیج ماهواره‌ها و دانشمندان زمین.",
    },
    choiceB: {
      labelEn: "Deploy deep seismic hydrophones into the terminal glacial lagoon to track underwater boiling vents!",
      labelFa: "میکروفون‌های هیدروفونیک زیرآبی را در تالاب یخچال کار بگذار تا جوشش حباب‌ها را رصد کنند!",
      descriptionFa: "ثبت دقیق‌ترین صداهای فعالیت هیدروترمال در زیر سطح آب.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Working with surgical precision inside the steaming volcanic grotto, Sofia sealed the bacterial cultures into insulated cryogenic vessels. The genetic markers detected on her portable sequencer matched nothing in the international GenBank database: these organisms utilized sulfur-iron chemosynthesis in total darkness under extreme pressure. As Mateo signaled over the comms that the storm outside was abating, Sofia completed the cataloging, holding aloft a biological breakthrough capable of revolutionizing astrobiology.",
    keywords: [
      { word: "chemosynthesis", meaningFa: "شیمیوسنتز (تولید انرژی زیستی از مواد شیمیایی بدون نور خورشید)", phonetic: "/ˌkiːməʊˈsɪnθəsɪs/" },
      { word: "cryogenic", meaningFa: "برودتی، منجمد در سرمای فوق‌العاده پایین نیتروژن", phonetic: "/ˌkraɪəʊˈdʒenɪk/" },
      { word: "sequencer", meaningFa: "دستگاه توالی‌یاب دی‌ان‌ای و ژنتیک", phonetic: "/ˈsiːkwənsər/" },
      { word: "abating", meaningFa: "فروکش کردن، آرام گرفتن طوفان", phonetic: "/əˈbeɪtɪŋ/" },
    ],
    question: {
      promptEn: "What metabolic process did the newly discovered subterranean bacteria utilize to survive in darkness?",
      promptFa: "باکتری‌های تازه کشف‌شده برای بقا در تاریکی مطلق از چه فرآیند متابولیکی استفاده می‌کردند؟",
      options: [
        "Sulfur-iron chemosynthesis under extreme pressure",
        "Photosynthesis using reflected moonbeams",
        "Consuming ancient fossil petroleum",
      ],
      correctIndex: 0,
      hintSnippet: "these organisms utilized sulfur-iron chemosynthesis in total darkness under extreme pressure",
      clueFa: "خط دوم رو ببین؛ شیمیوسنتز گوگرد و آهن در تاریکی مطلق و تحت فشار فوق‌العاده بالا.",
    },
    choiceA: {
      labelEn: "Transport the cryogenic bio-samples directly to NASA's Astrobiology Institute for planetary research!",
      labelFa: "نمونه‌های زیستی را مستقیماً به انستیتوی اخترزیست‌شناسی ناسا برای پژوهش‌های مریخ منتقل کن!",
      descriptionFa: "اثبات اینکه حیات می‌تواند در اقیانوس‌های یخ‌زده قمرهای مشتری و زحل وجود داشته باشد.",
    },
    choiceB: {
      labelEn: "Publish an open-access genomic monograph in Cell revealing the extreme ecology of Patagonian extremophiles!",
      labelFa: "مقاله جامع ژنتیکی را در مجله معتبر سل منتشر کن و بوم‌شناسی موجودات سخت‌پای پاتاگونیا را فاش ساز!",
      descriptionFa: "دستیابی به داروهای ضدباکتری و آنزیم‌های صنعتی نوین از دل طبیعت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Sofia secured the titanium thermocouple probe deep into the geyser’s fractured bedrock. Instantly, real-time telemetry showed magma conduit temperatures rising to two hundred and eighty degrees Celsius. Gabriel’s satellite computer calculated that the volcanic heat was turning subglacial ice into high-pressure steam, acting as a pneumatic wedge beneath the glacier. With this data, scientists could predict the exact hour the glacier terminus would detach into Lake Argentino.",
    keywords: [
      { word: "thermocouple", meaningFa: "ترمومتر یا حسگر دماسنج دقیق حرارت‌های فوق‌العاده بالا", phonetic: "/ˈθɜːrməʊkʌpl/" },
      { word: "conduit", meaningFa: "کانال، لوله یا مجرای عبور ماگما و بخار داغ", phonetic: "/ˈkɒndjuːɪt/" },
      { word: "terminus", meaningFa: "جبهه یا پیشانی انتهایی یخچال طبیعی", phonetic: "/ˈtɜːrmɪnəs/" },
      { word: "pneumatic wedge", meaningFa: "گُوِه یا اهرم فشاری بادی پرقدرت", phonetic: "/njuːˈmætɪk wedʒ/" },
    ],
    question: {
      promptEn: "What physical effect was the subterranean steam producing beneath the glacier?",
      promptFa: "بخار زیرزمینی چه تاثیر فیزیکی روی لایه‌های زیرین یخچال می‌گذاشت؟",
      options: [
        "Acting as a pneumatic wedge lifting the glacier bed",
        "Freezing the glacier solidly into the rock",
        "Evaporating the entire lake in three minutes",
      ],
      correctIndex: 0,
      hintSnippet: "turning subglacial ice into high-pressure steam, acting as a pneumatic wedge beneath the glacier",
      clueFa: "خط سوم رو نگاه کن دوست من؛ بخار پرفشار مثل یک گوه بادی عمل می‌کرد و بستر کوه یخ را از جا بلند می‌کرد.",
    },
    choiceA: {
      labelEn: "Issue the definitive forty-eight-hour glacier detachment evacuation alert to lake marinas!",
      labelFa: "هشدار نهایی تخلیه چهل و هشت ساعته اسکله‌ها و قایق‌های دریاچه را صادر کن!",
      descriptionFa: "جلوگیری از غرق شدن کشتی‌های گردشگری در اثر سونامی زایش کوه یخ.",
    },
    choiceB: {
      labelEn: "Deploy continuous automated thermal drones over the terminus to film the historic collapse!",
      labelFa: "پهپادهای دید در شب حرارتی را برای ثبت فیلم مستند تاریخی این فروریزش به پرواز درآور!",
      descriptionFa: "ثبت بی‌نظیرترین رخداد ژئوفیزیکی قاره با تجهیزات مستندسازی علمی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The automated geodetic laser station was bolted into the granite crest of Nunatak Esperanza, pinging the Copernicus satellite constellation every fifteen seconds. The interferometry data showed the entire ice field was bulging upward by four millimeters per hour—a phenomenon known as subglacial magmatic inflation. Standing beside the tripod in the howling wind, Gabriel and Sofia felt the solid rock shudder beneath their boots as deep mantle tremors resonated through the continent.",
    keywords: [
      { word: "interferometry", meaningFa: "تداخل‌سنجی راداری برای سنجش تغییرات میلی‌متری زمین", phonetic: "/ˌɪntəfəˈrɒmətri/" },
      { word: "bulging", meaningFa: "برآمده شدن، تحدب پیدا کردن رو به بالا", phonetic: "/ˈbʌldʒɪŋ/" },
      { word: "mantle", meaningFa: "گوشته زمین (لایه مذاب زیر پوسته)", phonetic: "/ˈmæntl/" },
      { word: "inflation", meaningFa: "بادکردگی و تورم لایه‌های زمین بر اثر فشار ماگما", phonetic: "/ɪnˈfleɪʃn/" },
    ],
    question: {
      promptEn: "By how much was the ice field bulging upward per hour due to magmatic inflation?",
      promptFa: "میدان یخی به دلیل تورم ماگمایی ساعتی چند میلی‌متر رو به بالا متورم می‌شد؟",
      options: [
        "Four millimeters per hour",
        "Ten centimeters per minute",
        "One meter every twelve hours",
      ],
      correctIndex: 0,
      hintSnippet: "The interferometry data showed the entire ice field was bulging upward by four millimeters per hour",
      clueFa: "خط دوم رو ببین؛ ماهواره نشان داد که تمام میدان یخ با سرعت ۴ میلی‌متر در هر ساعت رو به بالا باد می‌کند.",
    },
    choiceA: {
      labelEn: "Publish an emergency alert in Geophysical Research Letters to mobilize global satellite tracking!",
      labelFa: "هشدار فوری را در نشریه پژوهش‌های ژئوفیزیک منتشر کن تا تمام ماهواره‌های زمین به این نقطه خیره شوند!",
      descriptionFa: "همبستگی علمی دانشمندان جهان برای ثبت این پدیده کمیاب زمین‌شناسی.",
    },
    choiceB: {
      labelEn: "Descend to the base camp to celebrate the successful installation with hot mate and roasted empanadas!",
      labelFa: "به کمپ فرود بیایید و موفقیت نصب حسگر را با چای سنتی ماته و پیراشکی داغ جشن بگیرید!",
      descriptionFa: "پایانی گرم، بومی و سرشار از صمیمیت در کنار راهنمایان باوفای محلی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The carbon-fiber reconnaissance drone braved the freezing forty-knot tailwinds, capturing thermal photogrammetry across the Great Fissure. The high-resolution composite images revealed an astonishing topographic layout: the geothermal steam had carved an emerald subglacial canyon stretching eight kilometers under the ice sheet. Deep inside this sheltered corridor, warm microclimates supported pristine ferns and ancient mosses that had survived dormant since the last glacial maximum.",
    keywords: [
      { word: "photogrammetry", meaningFa: "فتوگرامتری (تهیه نقشه‌های سه‌بعدی از عکس‌های هوایی)", phonetic: "/ˌfəʊtəʊˈɡræmətri/" },
      { word: "dormant", meaningFa: "خفته، غیرفعال اما زنده و آماده شکوفایی", phonetic: "/ˈdɔːrmənt/" },
      { word: "ferns", meaningFa: "سرخس‌های سبز باستانی", phonetic: "/fɜːrnz/" },
      { word: "corridor", meaningFa: "راهرو، دالان طبیعی میان صخره‌ها یا یخ", phonetic: "/ˈkɒrɪdɔːr/" },
    ],
    question: {
      promptEn: "What pre-historic botanical life was revealed surviving inside the sheltered subglacial canyon?",
      promptFa: "چه پوشش گیاهی کهنی در دالان امن زیر یخ‌ها کشف شد که از عصر یخبندان زنده مانده بود؟",
      options: [
        "Pristine ferns and ancient mosses surviving in warm geothermal microclimates",
        "Giant carnivorous pine trees",
        "A forest of fossilized palm trees",
      ],
      correctIndex: 0,
      hintSnippet: "warm microclimates supported pristine ferns and ancient mosses that had survived dormant since the last glacial maximum",
      clueFa: "خط آخر رو بخون دوست من؛ سرخس‌های باطراوت و خزه‌های کهن که در اقلیم گرم زیر یخ‌ها از عصر یخبندان زنده مانده بودند.",
    },
    choiceA: {
      labelEn: "Declare the subterranean canyon a protected UNESCO World Biosphere Sanctuary!",
      labelFa: "دالان زیرزمینی را به عنوان ذخیره‌گاه زیست‌کره حفاظت‌شده یونسکو اعلام کن!",
      descriptionFa: "محافظت ابدی از کهن‌ترین پوشش گیاهی دست‌نخورده سیاره زمین.",
    },
    choiceB: {
      labelEn: "Lead a specialized botanical research expedition into the subglacial green corridor next spring!",
      labelFa: "سفر اکتشافی تخصصی گیاه‌شناسی را در بهار آینده به درون این دالان سرسبز هدایت کن!",
      descriptionFa: "ثبت گونه‌های گیاهی جدیدی که می‌توانند خواص دارویی بی‌نظیر داشته باشند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Hovering two hundred meters above the terminal moraine, an Argentine Air Force helicopter guided the water-diversion demolition squad. Following Gabriel’s precise GPS coordinates, engineers fired controlled micro-charges that severed a granite choke point. The pressurized subglacial meltwater surged smoothly down the uninhabited western rocky canyon into the Atlantic fjord, completely bypassing the populated farming settlements. Down in the valley, church bells chimed in celebration of the miraculous deliverance.",
    keywords: [
      { word: "demolition", meaningFa: "انفجار و تخریب مهندسی‌شده و کنترل‌شده", phonetic: "/ˌdeməˈlɪʃn/" },
      { word: "choke point", meaningFa: "گلوگاه تنگ و مسدودکننده مسیر جریان", phonetic: "/tʃəʊk pɔɪnt/" },
      { word: "deliverance", meaningFa: "رهایی، نجات معجزه‌آسا از بلا و خطر", phonetic: "/dɪˈlɪvrəns/" },
      { word: "fjord", meaningFa: "آبدره عمیق و باریک ساحلی میان صخره‌ها", phonetic: "/fjɔːrd/" },
    ],
    question: {
      promptEn: "Where did the controlled explosive diversion channel the dangerous meltwater flood?",
      promptFa: "عملیات انفجار کنترل‌شده سیلاب خطرناک را به کجا هدایت کرد؟",
      options: [
        "Down the uninhabited western rocky canyon into an Atlantic fjord",
        "Directly into the municipal water reservoir",
        "Onto a ski resort parking lot",
      ],
      correctIndex: 0,
      hintSnippet: "meltwater surged smoothly down the uninhabited western rocky canyon into the Atlantic fjord, completely bypassing the populated farming settlements",
      clueFa: "خط سوم رو ببین؛ آب با آرامش به سمت دره صخره‌ای خالی غربی و آبدره اقیانوس اطلس هدایت شد و از شهرها دور ماند.",
    },
    choiceA: {
      labelEn: "Accept the Medal of Environmental Heroism from the Governor of Santa Cruz!",
      labelFa: "مدال افتخار قهرمانی محیط‌زیست را از استاندار سانتاکروز دریافت کن!",
      descriptionFa: "تقدیری رسمی از شجاعت و نبوغ مهندسی که جان هزاران نفر را نجات داد.",
    },
    choiceB: {
      labelEn: "Establish a permanent early-warning glacier civil defense network across Patagonia!",
      labelFa: "شبکه دائمی هشدار زودهنگام دفاع مدنی یخچال‌ها را در سرتاسر پاتاگونیا تاسیس کن!",
      descriptionFa: "تجهیز تمام شهرهای دره‌ای به رادارهای پیش‌بینی سیلاب.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Arriving at the Lake Argentino scientific station as dawn broke, Gabriel and Sofia coordinated with local park rangers and emergency flotillas. When the glacial surge reached the lake, the engineered channels successfully absorbed the forty-foot swell without overflowing the fortified harbor retaining wall. Fishermen and hotel owners lined the docks, cheering as the three mud-spattered scientists stepped off their transport rover, hailed as the guardians of the southern frontier.",
    keywords: [
      { word: "flotillas", meaningFa: "ناوگان‌های کوچک قایق‌های نجات و گشت", phonetic: "/fləˈtɪləz/" },
      { word: "swell", meaningFa: "امواج خروشان و بلند ناشی از سیلاب یا طوفان", phonetic: "/swel/" },
      { word: "retaining wall", meaningFa: "دیوار ساحلی حائل و موج‌شکن محافظ بندر", phonetic: "/rɪˈteɪnɪŋ wɔːl/" },
      { word: "mud-spattered", meaningFa: "گل‌آلود از سختی‌های مسیر و عملیات", phonetic: "/mʌd ˈspætərd/" },
    ],
    question: {
      promptEn: "How high was the glacial surge that hit Lake Argentino's harbor wall?",
      promptFa: "موج خروشان ناشی از زایش یخچال که به دیوار بندر رسید چند فوت ارتفاع داشت؟",
      options: [
        "A forty-foot swell that was successfully absorbed by the retaining wall",
        "A one-hundred-foot tidal wave that destroyed the lighthouse",
        "A gentle five-inch ripple",
      ],
      correctIndex: 0,
      hintSnippet: "the engineered channels successfully absorbed the forty-foot swell without overflowing the fortified harbor retaining wall",
      clueFa: "خط دوم رو بخون؛ موجی عظیم به ارتفاع ۴۰ فوت (حدود ۱۲ متر) که توسط دیواره ساحلی مهار شد.",
    },
    choiceA: {
      labelEn: "Host a massive lakefront victory barbecue with roasted lamb and local Malbec wine!",
      labelFa: "جشن پیروزی بزرگ ساحلی را با کباب سنتی بره و موسیقی محلی آرژانتینی برپا کنید!",
      descriptionFa: "شبی سرشار از رقص، خنده و قدردانی اهالی منطقه.",
    },
    choiceB: {
      labelEn: "Commission a granite monument on the lakeside honoring mountaineer courage and science!",
      labelFa: "بنای یادبود گرانیتی را در ساحل دریاچه به پاس شجاعت علمی کوهنوردان برپا کن!",
      descriptionFa: "نمادی جاودان از اراده انسان در برابر خشم طبیعت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "The Global Volcanism Program immediately upgraded the Upsala Volcanic Complex from dormant to active status, dispatching an international task force of volcanologists. High-resolution satellite synthetic aperture radar confirmed a magma chamber swelling forty cubic kilometers beneath the ice sheet. Gabriel and Sofia were appointed Co-Chairs of the International Patagonian Geohazard Consortium, holding their first briefing before the United Nations Geological Forum in Geneva.",
    keywords: [
      { word: "synthetic aperture", meaningFa: "رادار روزنه مصنوعی ماهواره‌ای با وضوح فوق‌العاده بالا", phonetic: "/sɪnˈθetɪk ˈæpətʃər/" },
      { word: "consortium", meaningFa: "کنسرسیوم و اتحادیه علمی بین‌المللی", phonetic: "/kənˈsɔːrtiəm/" },
      { word: "dormant", meaningFa: "خفته، غیرفعال پس از قرن‌ها سکوت", phonetic: "/ˈdɔːrmənt/" },
      { word: "geohazard", meaningFa: "مخاطرات زمین‌شناختی و بلایای طبیعی زمین", phonetic: "/ˈdʒiːəʊhæzərd/" },
    ],
    question: {
      promptEn: "What volume was the subterranean magma chamber calculated to be beneath the ice sheet?",
      promptFa: "حجم محفظه ماگمای زیر لایه‌های یخی چقدر برآورد شد؟",
      options: [
        "Forty cubic kilometers of swelling magma",
        "Ten liters of hot mud",
        "Five hundred cubic meters of lava",
      ],
      correctIndex: 0,
      hintSnippet: "confirmed a magma chamber swelling forty cubic kilometers beneath the ice sheet",
      clueFa: "خط دوم رو ببین دوست من؛ چهل کیلومتر مکعب ماگمای جوشان در اعماق زمین.",
    },
    choiceA: {
      labelEn: "Establish the Southern Volcanological Observatory on the shores of Lake Viedma!",
      labelFa: "رصدخانه آتشفشان‌شناسی جنوب را در ساحل دریاچه ویدما تاسیس کن!",
      descriptionFa: "مرکزی علمی که شبانه‌روز فعالیت‌های اعماق زمین را رصد می‌کند.",
    },
    choiceB: {
      labelEn: "Publish a definitive textbook on glacio-volcanism with Cambridge University Press!",
      labelFa: "کتاب مرجع آتشفشان‌شناسی یخچالی را با انتشارات دانشگاه کمبریج به چاپ برسان!",
      descriptionFa: "آموزش اصول نوظهور پیوند یخ و آتش به نسل‌های آینده زمین‌شناسی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Lowering the hydrophone array sixty meters down into the glacial lagoon, Mateo captured extraordinary acoustic audio streams: deep, rhythmic steam eruptions bubbling like subterranean pipe organs through the mineral waters. As the acoustic waveforms were uploaded, marine biologists identified sound reflections indicating hydrothermal vents sustaining endemic deep-lake flora. The expedition had uncovered a completely closed subglacial aquatic ecosystem untouched for thirty thousand years.",
    keywords: [
      { word: "hydrophone", meaningFa: "هیدروفون (میکروفون ضدآب برای ضبط صدا در اعماق آب)", phonetic: "/ˈhaɪdrəfəʊn/" },
      { word: "endemic", meaningFa: "بومی، منحصربه‌فرد و خاص یک منطقه جغرافیایی", phonetic: "/enˈdemɪk/" },
      { word: "flora", meaningFa: "پوشش گیاهی و جلبکی محیطی", phonetic: "/ˈflɔːrə/" },
      { word: "waveforms", meaningFa: "شکل‌موج‌های صوتی ثبت‌شده روی مانیتور", phonetic: "/ˈweɪvfɔːrmz/" },
    ],
    question: {
      promptEn: "How long had the closed subglacial aquatic ecosystem remained untouched by the outside world?",
      promptFa: "این زیست‌بوم آبی دست‌نخورده در زیر یخ‌ها چند هزار سال از دنیای بیرون جدا مانده بود؟",
      options: [
        "Untouched for thirty thousand years",
        "For fifty years since the gold rush",
        "For five centuries since Magellan's voyage",
      ],
      correctIndex: 0,
      hintSnippet: "uncovered a completely closed subglacial aquatic ecosystem untouched for thirty thousand years",
      clueFa: "خط آخر رو نگاه کن؛ سی هزار سال بود که این اکوسیستم زیرزمینی دست‌نخورده باقی مانده بود.",
    },
    choiceA: {
      labelEn: "Design a clean-room submersible rover to explore the thirty-thousand-year-old aquatic ecosystem!",
      labelFa: "زیردریایی بدون سرنشین فوق‌استریل را برای کاوش در این اکوسیستم ۳۰ هزار ساله طراحی کن!",
      descriptionFa: "کشف ناشناخته‌ترین جانداران بدون آلوده کردن آب‌های خالص کهن.",
    },
    choiceB: {
      labelEn: "Release the mesmerizing acoustic recordings as an ambient symphonic album to raise conservation funds!",
      labelFa: "صداهای آرامش‌بخش ضبط‌شده از دل یخ‌ها را در قالب آلبوم موسیقی صوتی برای امور خیریه منتشر کن!",
      descriptionFa: "نوای جادویی طبیعت که قلب میلیون‌ها شنونده در دنیا را تسخیر می‌کند.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "At NASA's Johnson Space Center in Houston, astrobiologists stood mesmerized as Sofia presented the genomic analysis of the Patagonian thermophiles. The sulfur-iron metabolic pathways matched theoretical models developed for hypothetical life inside Europa's ice-covered oceans. NASA formally named the discovery 'The Alvarez Extremophile', appointing Sofia to the science advisory board for the upcoming Europa Lander mission. Back in El Chaltén, Gabriel and Mateo celebrated with a glass of vintage Malbec: Patagonia had helped unlock the doors to extraterrestrial biology.",
    keywords: [
      { word: "extremophile", meaningFa: "سخت‌پای، موجود زنده‌ای که در شرایط فوق‌سخت زیست می‌کند", phonetic: "/ɪkˈstremiəʊfaɪl/" },
      { word: "hypothetical", meaningFa: "فرضی، نظری و پیش‌بینی‌شده در مدل‌های علمی", phonetic: "/ˌhaɪpəˈθetɪkl/" },
      { word: "advisory", meaningFa: "مشاوره‌ای و ارائه‌دهنده راهکارهای تخصصی", phonetic: "/ədˈvaɪzəri/" },
      { word: "extraterrestrial", meaningFa: "فرازمینی، فراتر از مدار زمین", phonetic: "/ˌekstrətəˈrestriəl/" },
    ],
    question: {
      promptEn: "What space exploration mission appointed Sofia to its scientific advisory board?",
      promptFa: "کدام ماموریت فضایی بین‌المللی سوفیا را به عضویت هیئت علمی خود منصوب کرد؟",
      options: [
        "The upcoming Europa Lander mission to search for life on Jupiter's moon",
        "The Apollo anniversary lunar flyby",
        "The orbital space debris cleanup crew",
      ],
      correctIndex: 0,
      hintSnippet: "appointing Sofia to the science advisory board for the upcoming Europa Lander mission",
      clueFa: "خط سوم رو ببین؛ ماموریت کاوشگر قمر اروپا (Europa Lander) متعلق به ناسا.",
    },
    choiceA: {
      labelEn: "Celebrate the milestone in Washington at the National Academy of Sciences gala banquet!",
      labelFa: "این دستاورد بزرگ را در ضیافت شام آکادمی ملی علوم در واشنگتن جشن بگیرید!",
      descriptionFa: "درخشش دانشمندان آمریکای جنوبی در بالاترین مجمع علمی جهان.",
    },
    choiceB: {
      labelEn: "Return to the Patagonian ice field to establish the world's highest planetary analog station!",
      labelFa: "به میدان یخی بازگرد تا مرتفع‌ترین پایگاه شبیه‌ساز سیارات را در زمین تاسیس کنی!",
      descriptionFa: "آموزش فضانوردان آینده در شرایط واقعی کوهستان‌های یخی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The cover of Cell magazine showcased a striking electron microscope image of the golden bacteria, with the title 'Life in the Subglacial Crucible'. The publication catalyzed global research in enzymatic catalysts, with pharmaceutical laboratories developing heat-resistant enzymes for clean industrial chemistry. In Buenos Aires, the National Congress voted unanimously to award Gabriel and Sofia the Gran Cruz of Scientific Merit, cementing Patagonia’s role as the living laboratory of the modern world.",
    keywords: [
      { word: "crucible", meaningFa: "دیگ ذوب، بوته آزمایشگاهی و کوره تحول", phonetic: "/ˈkruːsɪbl/" },
      { word: "enzymatic", meaningFa: "آنزیمی و وابسته به کاتالیزورهای زیستی", phonetic: "/ˌenzaɪˈmætɪk/" },
      { word: "unanimously", meaningFa: "به اتفاق آرا و با رای مثبت همگان", phonetic: "/juːˈnænɪməsli/" },
      { word: "merit", meaningFa: "شایستگی، شرف و لیاقت برجسته", phonetic: "/ˈmerɪt/" },
    ],
    question: {
      promptEn: "What major industrial application was developed from the heat-resistant enzymes of the bacteria?",
      promptFa: "چه کاربرد صنعتی بزرگی از آنزیم‌های مقاوم به حرارت این باکتری‌ها توسعه یافت؟",
      options: [
        "Heat-resistant enzymes for clean, sustainable industrial chemistry",
        "A synthetic polymer for manufacturing high-speed racing tires",
        "An additive for military jet aviation fuel",
      ],
      correctIndex: 0,
      hintSnippet: "with pharmaceutical laboratories developing heat-resistant enzymes for clean industrial chemistry",
      clueFa: "خط دوم رو بخون؛ آنزیم‌های مقاوم به گرما برای صنایع شیمیایی پاک و پایدار زیست‌محیطی.",
    },
    choiceA: {
      labelEn: "Found the Institute for Sustainable Bio-Catalysis in Bariloche with international funding!",
      labelFa: "پژوهشکده بیوکاتالیزورهای پایدار را با سرمایه‌گذاری بین‌المللی در باریلوچه افتتاح کن!",
      descriptionFa: "ایجاد هزاران شغل علمی برای پژوهشگران جوان در آمریکای جنوبی.",
    },
    choiceB: {
      labelEn: "Toast their scientific crusade by the cozy hearth of the Los Glaciares rangers' lodge!",
      labelFa: "موفقیت این جهاد علمی را در کنار شومینه گرم کلبه محیط‌بانان جشن بگیرید!",
      descriptionFa: "پایانی صمیمی و پرخاطره در آغوش طبیعت بکر پاتاگونیا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Thanks to the definitive forty-eight-hour detachment alert, three hundred tour boats and private yachts were safely anchored behind reinforced breakwaters before the calving occurred. When the twelve-billion-ton ice mass sheared away from the glacier, it triggered a massive tsunami wave across Lake Argentino that crashed harmlessly against empty shores. Maritime safety authorities hailed Gabriel's predictive model as the greatest civil protection triumph in South American polar history.",
    keywords: [
      { word: "breakwaters", meaningFa: "موج‌شکن‌های سنگی و بتنی محافظ بندر", phonetic: "/ˈbreɪkwɔːtərz/" },
      { word: "sheared away", meaningFa: "جدا شد و با صدای مهیب کنده شد", phonetic: "/ʃɪəd əˈweɪ/" },
      { word: "tsunami", meaningFa: "سونامی و امواج عظیم ناشی از جابجایی توده‌های بزرگ", phonetic: "/tsuːˈnɑːmi/" },
      { word: "calving", meaningFa: "زایش و سقوط تکه عظیم یخ به آب", phonetic: "/ˈkɑːvɪŋ/" },
    ],
    question: {
      promptEn: "How heavy was the ice mass that sheared away from the glacier into Lake Argentino?",
      promptFa: "توده یخی عظیمی که از یخچال کنده شد و به دریاچه افتاد چند تن وزن داشت؟",
      options: [
        "Twelve billion tons of sapphire ice",
        "Fifty thousand kilograms of slush",
        "One million tons of surface snow",
      ],
      correctIndex: 0,
      hintSnippet: "When the twelve-billion-ton ice mass sheared away from the glacier, it triggered a massive tsunami wave",
      clueFa: "خط دوم رو ببین دوست من؛ توده یخ به وزن باورنکردنی ۱۲ میلیارد تن از بدنه کوه جدا شد.",
    },
    choiceA: {
      labelEn: "Award Gabriel the International Polar Safety Gold Medal at the Arctic-Antarctic Summit!",
      labelFa: "مدال طلای ایمنی قطبی جهان را در اجلاس مشترک قطب شمال و جنوب به گابریل اهدا کن!",
      descriptionFa: "بالاترین افتخار بین‌المللی برای نجات جان هزاران دریانورد و گردشگر.",
    },
    choiceB: {
      labelEn: "Host a scenic lakeside picnic with the boat captains who cheered their timely warnings!",
      labelFa: "پیک‌نیک باشکوه ساحلی را در کنار ناخدایان سپاسگزار قایق‌ها برپا کنید!",
      descriptionFa: "لحظاتی گرم و دلنشین از پیوند علم با مردم دریاچه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The cinematic 4K thermal footage captured by Sofia’s autonomous drones went viral across the world, viewed by two hundred million people within forty-eight hours. The footage showed the colossal blue glacier collapsing into the misty lake under twilight skies, accompanied by Gabriel’s clear, poetic voiceover explaining the geological harmony between fire and ice. Streaming platforms and international film festivals awarded the documentary the Golden Eagle Trophy for Environmental Filmmaking.",
    keywords: [
      { word: "cinematic", meaningFa: "سینمایی، باشکوه و دراماتیک", phonetic: "/ˌsɪnəˈmætɪk/" },
      { word: "voiceover", meaningFa: "گفتار متن، روایت‌گری صوتی روی فیلم", phonetic: "/ˈvɔɪsəʊvər/" },
      { word: "harmony", meaningFa: "توازن، هارمونی و هم‌نوایی باشکوه", phonetic: "/ˈhɑːrməni/" },
      { word: "viral", meaningFa: "وایرال، پربازدید در سراسر اینترنت", phonetic: "/ˈvaɪrəl/" },
    ],
    question: {
      promptEn: "How many people viewed the viral thermal footage within forty-eight hours?",
      promptFa: "چند میلیون نفر در ۴۸ ساعت اول این فیلم مستند باشکوه را تماشا کردند؟",
      options: [
        "Two hundred million people across the world",
        "Ten thousand local residents",
        "Fifty million cinema ticket holders",
      ],
      correctIndex: 0,
      hintSnippet: "viewed by two hundred million people within forty-eight hours",
      clueFa: "خط اول رو نگاه کن؛ بیش از ۲۰۰ میلیون بیننده در سراسر جهان مبهوت این تصاویر شدند.",
    },
    choiceA: {
      labelEn: "Direct all documentary streaming royalties into an emergency Patagonian glacier preservation fund!",
      labelFa: "تمام درآمد پخش مستند را به صندوق نجات و حفاظت از یخچال‌های پاتاگونیا واریز کن!",
      descriptionFa: "تامین مالی پروژه‌های پایدار محیط‌زیستی برای نسل‌های آینده.",
    },
    choiceB: {
      labelEn: "Present the Golden Eagle Trophy to the mountain rangers in a festive town hall ceremony!",
      labelFa: "تندیس عقاب زرین را به محیط‌بانان دلاور پارک در تالار شهر تقدیم کن!",
      descriptionFa: "تقدیری صمیمانه از نگهبانان واقعی کوهستان‌های جنوب.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The paper in Geophysical Research Letters galvanized twenty space agencies into real-time collaborative tracking. The European Space Agency re-tasked two Sentinel radar satellites to monitor the Patagonian ice field continuously. Geologists worldwide acknowledged that Gabriel and Sofia had discovered the first active continental subglacial rift in the Southern Hemisphere, establishing a new paradigm for understanding how climate change and mantle plumes interact to reshape planetary landmasses.",
    keywords: [
      { word: "galvanized", meaningFa: "برانگیخت، به جنبش و تکاپوی گسترده واداشت", phonetic: "/ˈɡælvənaɪzd/" },
      { word: "paradigm", meaningFa: "پارادایم، الگوی بنیادین علمی و چارچوب نظری", phonetic: "/ˈpærədaɪm/" },
      { word: "rift", meaningFa: "شکاف بزرگ تکتونیکی پوسته زمین", phonetic: "/rɪft/" },
      { word: "plumes", meaningFa: "ستون‌های بالاآینده ماگما از اعماق گوشته", phonetic: "/pluːmz/" },
    ],
    question: {
      promptEn: "What major tectonic structure did Gabriel and Sofia discover in the Southern Hemisphere?",
      promptFa: "گابریل و سوفیا چه ساختار بزرگ تکتونیکی را در نیم‌کره جنوبی کشف کردند؟",
      options: [
        "The first active continental subglacial rift in the Southern Hemisphere",
        "An underground salt desert beneath the Andes",
        "A subterranean river flowing directly to Antarctica",
      ],
      correctIndex: 0,
      hintSnippet: "discovered the first active continental subglacial rift in the Southern Hemisphere",
      clueFa: "خط سوم رو ببین دوست من؛ اولین شکاف قاره‌ای فعال در زیر یخ‌ها در نیم‌کره جنوبی زمین.",
    },
    choiceA: {
      labelEn: "Accept the International Wegener Medal for Excellence in Geosciences at the European Geosciences Union!",
      labelFa: "مدال افتخار بین‌المللی وگنر را در مجمع علوم زمین اروپا دریافت کن!",
      descriptionFa: "بالاترین افتخار علمی در زمینه علوم زمین‌شناسی و قاره‌شناسی.",
    },
    choiceB: {
      labelEn: "Toast their monumental discovery with mates and guitars around the Andean campfire!",
      labelFa: "این کشف تاریخی را دور آتش کمپ آندی با نوای گیتار و چای ماته جشن بگیرید!",
      descriptionFa: "پایانی اصیل و سرشار از صمیمیت در زیر ستارگان کوهستان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Gathered around the crackling pine-log hearth at Mateo's family ranch in El Calafate, the three companions toasted their survival and triumph. The aroma of roasted lamb empanadas and freshly brewed mate filled the rustic room. Outside, snow fell softly against the windowpanes, no longer an adversary, but a peaceful blanket covering a preserved wilderness. Mateo raised his wooden gourd: 'To the ice, to the fire within the earth, and to the friends who walk through storms together.'",
    keywords: [
      { word: "empanadas", meaningFa: "امپاناداس (پیراشکی سنتی و خوشمزه گوشت و سبزیجات آمریکای جنوبی)", phonetic: "/ˌempəˈnɑːdəz/" },
      { word: "gourd", meaningFa: "فنجان کدو قلیانی سنتی برای نوشیدن چای ماته", phonetic: "/ɡɔːrd/" },
      { word: "rustic", meaningFa: "روستایی، گرم و باصفا با چوب‌های طبیعی", phonetic: "/ˈrʌstɪk/" },
      { word: "adversary", meaningFa: "حریف، دشمن یا هماورد سرسخت", phonetic: "/ˈædvərsəri/" },
    ],
    question: {
      promptEn: "What heartfelt toast did Mateo propose around the crackling fireplace?",
      promptFa: "ماتئو در کنار شومینه باصفا چه جمله زیبایی را برای سلامتی گفت؟",
      options: [
        "To the ice, the fire within the earth, and the friends who walk through storms together",
        "To commercial mining companies in the mountains",
        "To warm city offices with electric radiators",
      ],
      correctIndex: 0,
      hintSnippet: "To the ice, to the fire within the earth, and to the friends who walk through storms together",
      clueFa: "جمله آخر رو نگاه کن؛ سلامتی یخ‌ها، آتش درون زمین و دوستانی که در دل طوفان کنار هم گام برمی‌دارند.",
    },
    choiceA: {
      labelEn: "Promise to reunite every winter on the slopes of Mount Fitz Roy to celebrate lifelong brotherhood!",
      labelFa: "عهد ببندید که هر زمستان در دامنه‌های فیتزروی گرد هم آیید و برادری‌تان را تازه کنید!",
      descriptionFa: "پیمانی جاودان میان کوهنوردانی که در سخت‌ترین شرایط کنار هم بودند.",
    },
    choiceB: {
      labelEn: "Hang their battered ice axes above the ranch fireplace as symbols of indomitable human spirit!",
      labelFa: "تبرهای یخ خط‌افتاده‌تان را بالای شومینه کلبه نصب کنید تا نماد روح تسلیم‌ناپذیر باشد!",
      descriptionFa: "یادگاری همیشگی از شبی که بر خشم طوفان پیروز شدید.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "The United Nations officially designated the subglacial corridor as the 'Patagonian Emerald Biosphere Sanctuary', banning all mining and industrial exploitation permanently. Guarded by park rangers and monitored by automated scientific stations, the eight-kilometer hidden canyon became a global sanctuary where nature’s deepest ancient secrets remained protected. Clara and Gabriel were appointed Lifetime Trustees of the Sanctuary, ensuring that scientific discovery served preservation rather than destruction.",
    keywords: [
      { word: "biosphere", meaningFa: "زیست‌کره (بخش‌های دارای حیات در زمین)", phonetic: "/ˈbaɪəʊsfɪər/" },
      { word: "sanctuary", meaningFa: "منطقه امن حفاظت‌شده حیات وحش و گیاهان", phonetic: "/ˈsæŋktʃuəri/" },
      { word: "exploitation", meaningFa: "بهره‌کشی و تخریب اقتصادی منابع طبیعی", phonetic: "/ˌeksplɔɪˈteɪʃn/" },
      { word: "trustees", meaningFa: "متولیان و امنای رسمی حفاظت", phonetic: "/trʌˈstiːz/" },
    ],
    question: {
      promptEn: "What activities were permanently banned in the new UNESCO Emerald Biosphere Sanctuary?",
      promptFa: "چه فعالیت‌هایی در ذخیره‌گاه زیست‌کره جدید زمردین برای همیشه ممنوع شد؟",
      options: [
        "All mining and industrial exploitation was banned permanently",
        "Scientific photography using drones",
        "Wearing technical mountaineering boots",
      ],
      correctIndex: 0,
      hintSnippet: "banning all mining and industrial exploitation permanently",
      clueFa: "خط اول رو ببین رفیق؛ تمام فعالیت‌های معدنی و بهره‌کشی صنعتی برای ابد ممنوع شد.",
    },
    choiceA: {
      labelEn: "Lead the inaugural diplomatic delegation through the ice field to dedicate the UNESCO plaque!",
      labelFa: "اولین هیئت دیپلماتیک یونسکو را برای نصب لوح جهانی در میدان یخی همراهی کن!",
      descriptionFa: "لحظه‌ای تاریخی از تعهد بین‌المللی برای حفظ محیط‌زیست زمین.",
    },
    choiceB: {
      labelEn: "Publish an educational children's book on the secret green canyon under the ice!",
      labelFa: "کتاب داستانی آموزنده‌ای برای کودکان درباره دره سرسبز پنهان زیر یخ‌ها بنویس!",
      descriptionFa: "کاشتن بذر عشق به طبیعت در قلب نسل‌های آینده.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Returning with a team of thirty specialized botanists and geneticists the following spring, Sofia led the first systematic exploration of the subglacial corridor. They discovered forty-six previously unknown species of bryophytes and micro-orchids blooming in the warm geothermal vapor. The botanical discoveries provided new insights into how plant life survived repeated Ice Age glaciations, revolutionizing the field of paleobotany across the world.",
    keywords: [
      { word: "bryophytes", meaningFa: "خزه‌تباران و گیاهان کهن بدون آوند", phonetic: "/ˈbraɪəfaɪts/" },
      { word: "paleobotany", meaningFa: "دیرینه‌گیاه‌شناسی (بررسی گیاهان دوران‌های کهن زمین)", phonetic: "/ˌpeɪliəʊˈbɒtəni/" },
      { word: "glaciations", meaningFa: "دوره‌های پیشروی یخچال‌ها و عصر یخبندان", phonetic: "/ˌɡleɪsiˈeɪʃnz/" },
      { word: "vapor", meaningFa: "بخار گرم و مطبوع برآمده از چشمه‌ها", phonetic: "/ˈveɪpər/" },
    ],
    question: {
      promptEn: "How many previously unknown plant species were discovered blooming in the geothermal corridor?",
      promptFa: "چند گونه گیاهی ناشناخته در بخار مطبوع زمین‌گرمایی دالان در حال شکوفایی کشف شد؟",
      options: [
        "Forty-six previously unknown species of bryophytes and micro-orchids",
        "Ten types of giant carnivorous ivy",
        "A field of glowing crimson roses",
      ],
      correctIndex: 0,
      hintSnippet: "discovered forty-six previously unknown species of bryophytes and micro-orchids blooming in the warm geothermal vapor",
      clueFa: "خط دوم رو بخون؛ ۴۶ گونه جدید از خزه‌ها و ارکیده‌های مینیاتوری شگفت‌انگیز.",
    },
    choiceA: {
      labelEn: "Present the botanical findings at the Royal Botanic Gardens in Kew under world acclaim!",
      labelFa: "یافته‌های گیاه‌شناسی را در باغ گیاه‌شناسی سلطنتی کیو لندن در میان تحسین جهانیان ارائه بده!",
      descriptionFa: "افتخاری ماندگار در مهد دانش گیاه‌شناسی جهان.",
    },
    choiceB: {
      labelEn: "Endow an alpine herbarium in Patagonia to preserve living strains for environmental science!",
      labelFa: "باغ گیاهان کوهستانی پاتاگونیا را برای نگهداری گونه‌های زنده تاسیس کن!",
      descriptionFa: "مرکزی علمی که سرمایه ژنتیکی گیاهان کهن را برای نسل‌ها حفظ می‌کند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "At a solemn ceremony in the provincial capital of Río Gallegos, the Governor pinned the Medal of Environmental Heroism onto Gabriel, Sofia, and Mateo. The citation honored their extraordinary courage in braving a Category 4 polar tempest to pinpoint the exact hydrological coordinates that saved three river valley townships from catastrophic destruction. Ten thousand citizens packed the plaza, their cheers echoing across the Patagonian steppe in gratitude for the scientists who stood between them and the raging waters.",
    keywords: [
      { word: "solemn", meaningFa: "رسمی، باوقار و آکنده از احترام عمیق", phonetic: "/ˈsɒləm/" },
      { word: "steppe", meaningFa: "استپ‌ها و دشت‌های پهناور و بادخیز پاتاگونیا", phonetic: "/step/" },
      { word: "citation", meaningFa: "بیانیه تقدیر و تقدیرنامه رسمی شجاعت", phonetic: "/saɪˈteɪʃn/" },
      { word: "hydrological", meaningFa: "آب‌شناختی و وابسته به گردش آب‌های زمین", phonetic: "/ˌhaɪdrəˈlɒdʒɪkl/" },
    ],
    question: {
      promptEn: "How many river valley townships were saved from destruction by the team's precise coordinates?",
      promptFa: "با مختصات دقیق ارسالی تیم، چند شهرک و آبادی دره از نابودی نجات پیدا کردند؟",
      options: [
        "Three river valley townships were saved from destruction",
        "One hundred mining camps in Chile",
        "Fifty luxury hotels on the coast",
      ],
      correctIndex: 0,
      hintSnippet: "exact hydrological coordinates that saved three river valley townships from catastrophic destruction",
      clueFa: "خط دوم رو ببین؛ سه شهرک و آبادی پرجمعیت دره از سیلاب مهیب نجات یافتند.",
    },
    choiceA: {
      labelEn: "Wave to the cheering citizens from the municipal balcony in a triumphant civic salute!",
      labelFa: "از بالکن شهرداری در میان تشویق پرشور ده هزار شهروند به احساسات مردم پاسخ بده!",
      descriptionFa: "لحظه‌ای پرشکوه از پیوند ناگسستنی دانش و فداکاری با مردم.",
    },
    choiceB: {
      labelEn: "Dedicate the medal to the volunteer search-and-rescue rangers of Los Glaciares!",
      labelFa: "مدال افتخار را به امدادگران داوطلب کوهستان در پارک ملی تقدیم کن!",
      descriptionFa: "قدردانی از جوانان فداکاری که بی‌صدا جان انسان‌ها را حفظ می‌کنند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The newly inaugurated Patagonian Early Warning Consortium connected forty seismic stations, twelve river basin radars, and two orbiting European satellites into a unified emergency grid. Operating from their command center in El Calafate, Gabriel and Sofia monitored the glacial movements in real time, reducing flood emergency reaction windows from twelve hours down to twenty-two minutes. The network became a benchmark for polar nations worldwide, praised by the UN Disaster Reduction Bureau.",
    keywords: [
      { word: "unified", meaningFa: "یکپارچه، متحد و هماهنگ‌شده", phonetic: "/ˈjuːnɪfaɪd/" },
      { word: "benchmark", meaningFa: "معیار، استاندارد طلایی و الگوی سنجش جهانی", phonetic: "/ˈbentʃmɑːrk/" },
      { word: "reaction windows", meaningFa: "بازه زمانی فرصت اقدام و پاسخگویی به بحران", phonetic: "/riˈækʃn ˈwɪndəʊz/" },
      { word: "inaugurated", meaningFa: "افتتاح‌شده و رسماً آغاز به کار کرده", phonetic: "/ɪˈnɔːɡjəreɪtɪd/" },
    ],
    question: {
      promptEn: "To how many minutes was the flood emergency reaction window reduced by the new network?",
      promptFa: "با شبکه یکپارچه جدید، زمان پاسخگویی به بحران سیلاب از ۱۲ ساعت به چند دقیقه کاهش یافت؟",
      options: [
        "Reduced down to twenty-two minutes",
        "Down to five hours",
        "Down to three seconds",
      ],
      correctIndex: 0,
      hintSnippet: "reducing flood emergency reaction windows from twelve hours down to twenty-two minutes",
      clueFa: "خط ماقبل آخر رو بخون؛ زمان طلایی واکنش از ۱۲ ساعت به ۲۲ دقیقه کاهش پیدا کرد.",
    },
    choiceA: {
      labelEn: "Demonstrate the real-time early warning network to international polar delegates in Geneva!",
      labelFa: "عملکرد سامانه رصد زودهنگام را به نمایندگان کشورهای قطبی در ژنو نمایش بده!",
      descriptionFa: "صدور الگوی موفق ایمنی کوهستان از آمریکای جنوبی به تمام جهان.",
    },
    choiceB: {
      labelEn: "Celebrate the network's launch with a glass of champagne in the high-tech command center!",
      labelFa: "آغاز به کار رسمی مرکز فرماندهی را در کنار تیم مهندسان با افتخار جشن بگیرید!",
      descriptionFa: "آرامش خاطر از اینکه دیگر هیچ کودکی در خواب اسیر سیلاب نخواهد شد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Under twinkling festive fairy lights along the shores of Lake Argentino, five hundred local townspeople, park rangers, and gauchos gathered for the legendary victory barbecue. Roasting spits of Patagonian lamb crackled over sweet aromatic guindo wood coals, while musicians strummed zambas and chacareras on acoustic guitars. Gabriel and Sofia raised clay cups of rich Malbec wine with Mateo: 'To science, to the mountain that tested our courage, and to the people we protected.'",
    keywords: [
      { word: "gauchos", meaningFa: "گاچوها (دامداران و سوارکاران سنتی و دلاور پاتاگونیا)", phonetic: "/ˈɡaʊtʃəʊz/" },
      { word: "spits", meaningFa: "سیخ‌های بزرگ گردان کباب روی زغال", phonetic: "/spɪts/" },
      { word: "zambas", meaningFa: "سامباها و موسیقی‌های سنتی فولکلور آرژانتین", phonetic: "/ˈzæmbəz/" },
      { word: "guindo", meaningFa: "چوب آلبالوی وحشی با بوی معطر مخصوص باربیکیو", phonetic: "/ˈɡwiːndəʊ/" },
    ],
    question: {
      promptEn: "What traditional acoustic music accompanied the festive lakeside victory barbecue?",
      promptFa: "چه موسیقی‌های محلی سنتی فضای جشن باربیکیو ساحلی را پرشور کرد؟",
      options: [
        "Zambas and chacareras strummed on acoustic guitars by local musicians",
        "Opera arias sung in Italian",
        "Electronic synthesizer dance tracks",
      ],
      correctIndex: 0,
      hintSnippet: "while musicians strummed zambas and chacareras on acoustic guitars",
      clueFa: "خط دوم رو ببین؛ نوای زامباها و چاکارراهای دلنشین سنتی که با گیتار نواخته می‌شد.",
    },
    choiceA: {
      labelEn: "Dance the traditional chacarera with the villagers until dawn breaks over the Andes!",
      labelFa: "تا سپیده‌دم در کنار اهالی پرمهر روستا زیر آسمان آند پایکوبی کنید!",
      descriptionFa: "پایانی شاداب و سرشار از گرمای انسانی و خاطرات خوش.",
    },
    choiceB: {
      labelEn: "Raise a final toast to the rugged Patagonian wilderness under the starry Southern Cross!",
      labelFa: "آخرین سلامتی شب را زیر ستارگان صورت فلکی صلیب جنوبی به طبیعت پاتاگونیا تقدیم کن!",
      descriptionFa: "عظمتی بی‌پایان زیر آسمان پرستاره آمریکای جنوبی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Standing beside the turquoise lake water, the Governor and Gabriel unveiled a magnificent three-meter granite sculpture titled 'Guardians of the Ice'. Carved from local Cerro Fitz Roy granite, the monument depicted a mountaineer, a geoscientist, and a local guide holding up a stylized radar beacon against storm winds. Below, an inscribed plaque read: 'Dedicated to the triumph of courage and science over catastrophe—proving that human dedication is the truest fortress of the earth.'",
    keywords: [
      { word: "sculpture", meaningFa: "تندیس، مجسمه تراشیده‌شده از سنگ", phonetic: "/ˈskʌlptʃər/" },
      { word: "stylized", meaningFa: "سبک‌پردازی‌شده، نمادین و هنرمندانه", phonetic: "/ˈstaɪlaɪzd/" },
      { word: "fortress", meaningFa: "دژ نفوذناپذیر، سنگر امن و پایدار", phonetic: "/ˈfɔːrtrəs/" },
      { word: "inscribed", meaningFa: "حکاکی‌شده و نگاشته‌شده بر سنگ", phonetic: "/ɪnˈskraɪbd/" },
    ],
    question: {
      promptEn: "What figures were depicted on the granite monument 'Guardians of the Ice'?",
      promptFa: "چه چهره‌هایی بر تندیس گرانیتی «نگهبانان یخ» به تصویر کشیده شده بودند؟",
      options: [
        "A mountaineer, a geoscientist, and a local guide holding up a radar beacon against winds",
        "Three polar bears hunting along an ice shelf",
        "An ancient Spanish explorer planting a royal flag",
      ],
      correctIndex: 0,
      hintSnippet: "depicted a mountaineer, a geoscientist, and a local guide holding up a stylized radar beacon against storm winds",
      clueFa: "خط دوم رو نگاه کن دوست من؛ یک کوهنورد، یک دانشمند زمین و یک راهنمای محلی که حسگر رادار را در برابر باد افراشته‌اند.",
    },
    choiceA: {
      labelEn: "Celebrate the dedication with schoolchildren placing white alpine flowers at the monument base!",
      labelFa: "رونمایی را با گل‌های سفید کوهستانی که کودکان بر پای مجسمه نهادند جشن بگیرید!",
      descriptionFa: "امیدی تازه در چشمان نسل جدید که به آینده افتخار می‌کنند.",
    },
    choiceB: {
      labelEn: "Photograph the monument reflecting the golden sunset across Lake Argentino for world news!",
      labelFa: "عکسی تماشایی از تندیس در بازتاب غروب زرین دریاچه برای رسانه‌های جهان ثبت کن!",
      descriptionFa: "تصویری حماسی که الهام‌بخش قهرمانان علم در سراسر دنیا خواهد بود.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Perched on the rugged shores of Lake Viedma, the new Southern Volcanological Observatory was hailed as South America's most advanced geohazard surveillance center. With Gabriel as Director and Sofia leading satellite geodesy, the facility monitored fifty-two volcanoes across the Andean volcanic arc. During the inaugural international conference, the Secretary General of the UN Disaster Relief Program stated: 'The vigilance born on the Southern Ice Field has built a shield of safety for ninety million people across South America.'",
    keywords: [
      { word: "surveillance", meaningFa: "دیدبانی، پایش و نظارت مداوم و دقیق", phonetic: "/sɜːrˈveɪləns/" },
      { word: "volcanic arc", meaningFa: "کمان آتشفشانی (زنجیره آتشفشان‌های فعال در امتداد گسل)", phonetic: "/vɒlˈkænɪk ɑːrk/" },
      { word: "vigilance", meaningFa: "هوشیاری، چشم بیدار و مراقبت خستگی‌ناپذیر", phonetic: "/ˈvɪdʒɪləns/" },
      { word: "shield", meaningFa: "سپر محافظ و پشتیبان امنیتی", phonetic: "/ʃiːld/" },
    ],
    question: {
      promptEn: "How many people across South America were safeguarded by the new volcanological observatory?",
      promptFa: "چند میلیون نفر در سراسر آمریکای جنوبی تحت پوشش امنیتی رصدخانه جدید قرار گرفتند؟",
      options: [
        "Ninety million people across South America",
        "Ten thousand ski tourists in Bariloche",
        "One million sailors in the Magellan strait",
      ],
      correctIndex: 0,
      hintSnippet: "built a shield of safety for ninety million people across South America",
      clueFa: "خط آخر رو بخون؛ سپری امنیتی برای محافظت از جان ۹۰ میلیون انسان در آمریکای جنوبی.",
    },
    choiceA: {
      labelEn: "Host the inaugural Latin American Volcanology Congress at the new Lake Viedma facility!",
      labelFa: "اولین کنگره آتشفشان‌شناسی آمریکای لاتین را در مرکز جدید دریاچه ویدما برگزار کن!",
      descriptionFa: "گردهمایی برجسته‌ترین محققان زمین در مدرن‌ترین پایگاه رصدی قاره.",
    },
    choiceB: {
      labelEn: "Establish a fellowship program sponsoring Indigenous Andean students in advanced geophysics!",
      labelFa: "بورسیه تحصیلی اختصاصی برای دانشجویان بومی آند در ژئوفیزیک پیشرفته تاسیس کن!",
      descriptionFa: "پیوند دانش بومیان کوهستان با فناوری‌های مدرن زمین‌شناسی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The Cambridge University Press textbook 'Glaciovolcanism: Fire and Ice Dynamics in Sub-Polar Rifts' co-authored by Gabriel and Sofia became mandatory reading in academic departments worldwide. Featuring full-color foldouts of the Upsala magma chamber and acoustic signatures recorded during their midnight blizzard crossing, the book won the prestigious Lyell Award for Earth Sciences Literature. University deans praised the authors for seamlessly bridging rigorous field bravery with world-class theoretical physics.",
    keywords: [
      { word: "mandatory", meaningFa: "الزامی، کتاب درسی اصلی و مرجع", phonetic: "/ˈmændətɔːri/" },
      { word: "rigorous", meaningFa: "دقیق، منضبط و پایبند به اصول علمی", phonetic: "/ˈrɪɡərəs/" },
      { word: "foldouts", meaningFa: "صفحات تاشو و نقشه‌های بزرگ داخل کتاب", phonetic: "/ˈfəʊldaʊts/" },
      { word: "glaciovolcanism", meaningFa: "آتشفشان‌شناسی یخچالی (برهم‌کنش گدازه‌ها با صفحات یخ)", phonetic: "/ˌɡleɪsiəʊvɒlˈkænɪzəm/" },
    ],
    question: {
      promptEn: "What prestigious international literature award was bestowed upon the textbook?",
      promptFa: "کدام جایزه ادبیات علوم زمین به کتاب مرجع دانشگاهی اهدا شد؟",
      options: [
        "The prestigious Lyell Award for Earth Sciences Literature",
        "The Pulitzer Prize for Investigative Journalism",
        "The Nobel Memorial Certificate in Economics",
      ],
      correctIndex: 0,
      hintSnippet: "the book won the prestigious Lyell Award for Earth Sciences Literature",
      clueFa: "خط سوم رو ببین؛ جایزه معتبر بین‌المللی لایل (Lyell Award) برای نگارش برترین اثر علوم زمین.",
    },
    choiceA: {
      labelEn: "Deliver the Lyell Lecture before the Geological Society of London in Burlington House!",
      labelFa: "سخنرانی افتخاری لایل را در انجمن زمین‌شناسی لندن در عمارت برلینگتون ایراد کن!",
      descriptionFa: "شبی درخشان از تجلیل دو محقق جسور در مهد زمین‌شناسی جهان.",
    },
    choiceB: {
      labelEn: "Sign textbooks for a crowd of aspiring young geology undergraduates in Cambridge!",
      labelFa: "کتاب‌ها را برای دانشجویان پرشور و آینده‌ساز زمین‌شناسی در کمبریج امضا کن!",
      descriptionFa: "الهام‌بخشی به جوانانی که رویای گام نهادن در سرزمین‌های ناشناخته را دارند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Operating with surgical micro-thrusters in the crystal-clear mineral water sixty meters beneath the ice, the sterile robotic rover 'Glacius 1' beamed back panoramic 8K video. The subglacial lagoon was carpeted in luminescent turquoise sponges and delicate volcanic glass spires that resonated like chimes in the hydrothermal currents. The discoveries confirmed that subglacial ecosystems could harbor diverse, complex biospheres independently of sunlight, revolutionizing humanity's search for life on frozen worlds across the cosmos.",
    keywords: [
      { word: "sponges", meaningFa: "اسفنج‌های دریایی و جانداران آبزی باستانی", phonetic: "/ˈspʌndʒɪz/" },
      { word: "luminescent", meaningFa: "فسفری و درخشان با نور زیستی ملایم", phonetic: "/ˌluːmɪˈnesnt/" },
      { word: "cosmos", meaningFa: "کیهان، کهکشان و جهان هستی", phonetic: "/ˈkɒzmɒs/" },
      { word: "chimes", meaningFa: "زنگوله‌ها، آواهای دلنشین برخورد بلورها", phonetic: "/tʃaɪmz/" },
    ],
    question: {
      promptEn: "What astonishing aquatic creatures carpeted the floor of the subglacial lagoon?",
      promptFa: "چه موجودات شگفت‌انگیزی بستر تالاب زیر یخ‌ها را پوشانده بودند؟",
      options: [
        "Luminescent turquoise sponges and delicate volcanic glass spires",
        "Giant armored electric eels",
        "Schools of gold-plated seahorses",
      ],
      correctIndex: 0,
      hintSnippet: "carpeted in luminescent turquoise sponges and delicate volcanic glass spires that resonated like chimes",
      clueFa: "خط دوم رو بخون دوست من؛ اسفنج‌های فیروزه‌ای درخشان و برج‌های بلورین شیشه آتشفشانی.",
    },
    choiceA: {
      labelEn: "Stream the live 8K subglacial exploration directly to planetariums and schools globally!",
      labelFa: "تصاویر زنده با وضوح ۸K را مستقیماً به افلاک‌نماها و مدارس سراسر دنیا پخش کن!",
      descriptionFa: "نمایشی سحرانگیز از شگفتی‌های پنهان زمین برای میلیون‌ها کودک مشتاق.",
    },
    choiceB: {
      labelEn: "Publish the marine biological survey in Nature Ecology and Evolution with worldwide praise!",
      labelFa: "مقاله جامع زیست‌شناسی دریایی را در نیچر اکولوژی منتشر کن!",
      descriptionFa: "دگرگون کردن تعاریف زیست‌شناسی و شرایط شکل‌گیری حیات در کیهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The vinyl album 'Echoes of the Deep Ice' soared to number one on ambient and classical music charts across thirty nations. Mastering engineers had transformed the rhythmic hydrophone recordings of hydrothermal steam, cracking seracs, and melodic bubble vents into an ethereal acoustic symphony. All royalties—surpassing four million dollars in the first six months—were placed into an endowment supporting Indigenous conservation rangers throughout the Patagonian wilderness.",
    keywords: [
      { word: "ethereal", meaningFa: "آسمانی، لطیف، رویایی و غیرمادی", phonetic: "/iˈθɪəriəl/" },
      { word: "endowment", meaningFa: "سرمایه‌گذاری دائمی وقفی و خیریه", phonetic: "/ɪnˈdaʊmənt/" },
      { word: "hydrophone", meaningFa: "میکروفون زیرآبی ضبط امواج صوتی", phonetic: "/ˈhaɪdrəfəʊn/" },
      { word: "surpassing", meaningFa: "فراتر رفتن، سبقت گرفتن از مرزها", phonetic: "/sərˈpæsɪŋ/" },
    ],
    question: {
      promptEn: "How much money did the vinyl ambient album raise in its first six months for conservation?",
      promptFa: "آلبوم موسیقی اصوات اعماق یخ در شش ماه اول چند میلیون دلار برای حفاظت از طبیعت جمع‌آوری کرد؟",
      options: [
        "Over four million dollars in royalties for Indigenous conservation rangers",
        "Ten thousand dollars for local bus tickets",
        "Fifty thousand euros for ski lift repairs",
      ],
      correctIndex: 0,
      hintSnippet: "All royalties—surpassing four million dollars in the first six months—were placed into an endowment",
      clueFa: "خط آخر رو نگاه کن؛ بیش از ۴ میلیون دلار که صرف حمایت از محیط‌بانان بومی پاتاگونیا شد.",
    },
    choiceA: {
      labelEn: "Host a live acoustic concert inside the cavernous mountain hall of El Calafate!",
      labelFa: "کنسرت زنده ارکسترال با بازپخش اصوات یخ را در تالار بزرگ شهر ال کالافاته برگزار کن!",
      descriptionFa: "شبی جادویی و رویایی از هم‌نوایی موسیقی انسانی با نفس‌های کوهستان.",
    },
    choiceB: {
      labelEn: "Share a peaceful cup of mate on the shores of Lake Argentino as evening stars mirror on water!",
      labelFa: "فنجان چای ماته را در آرامش ساحل دریاچه در انعکاس ستارگان شب بر آب بنوشید!",
      descriptionFa: "پایانی رویایی، شاعرانه و آرام‌بخش در آغوش زیبایی‌های ابدی پاتاگونیا.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The NASA Astrobiology Laurels", titleFa: "مدال اخترزیست‌شناسی ناسا", badgeCategory: "scholar", badgeIcon: "🚀", badgeNameFa: "پایان علمی کیهانی", climaxEn: "NASA appoints Sofia to the Europa Science Directorate, celebrating the Patagonian extremophile as the blueprint for life beyond Earth.", climaxFa: "ناسا سوفیا را به مدیریت علمی کاوشگر اروپا منصوب کرد و باکتری پاتاگونیا را الگوی کشف حیات در منظومه شمسی نامید.", xpReward: 280 },
  { pathCode: "AAAAB", titleEn: "The Planetary Analog Frontier", titleFa: "مرتفع‌ترین شبیه‌ساز سیارات", badgeCategory: "explorer", badgeIcon: "🏔️", badgeNameFa: "پایان پیشگامی فضایی", climaxEn: "The new high-altitude research station trains international astronauts on the ice field for upcoming crewed Mars missions.", climaxFa: "ایستگاه پژوهشی جدید در میدان یخی، فضانوردان بین‌المللی را برای ماموریت‌های سرنشین‌دار آینده مریخ آموزش می‌دهد.", xpReward: 275 },
  { pathCode: "AAABA", titleEn: "The Bariloche Bio-Catalysis Chair", titleFa: "پژوهشکده آنزیم‌های پاک باریلوچه", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان فناوری زیستی", climaxEn: "Patagonian bacterial enzymes replace toxic heavy metals in green chemical factories across forty industrialized nations.", climaxFa: "آنزیم‌های باکتریایی پاتاگونیا جایگزین فلزات سمی در صنایع پاک چهل کشور صنعتی جهان شد.", xpReward: 280 },
  { pathCode: "AAABB", titleEn: "The Hearth of Los Glaciares", titleFa: "شومینه گرم پارک ملی لوس گلاسیارس", badgeCategory: "funny", badgeIcon: "🔥", badgeNameFa: "پایان صمیمی و دوستانه", climaxEn: "Surrounded by smiling rangers and glowing embers, Gabriel, Sofia, and Mateo toast the enduring magic of the southern ice.", climaxFa: "در کنار محیط‌بانان مهربان و اخگرهای گرم شومینه، گابریل، سوفیا و ماتئو به جادوی ابدی یخ‌های جنوب سلامتی گفتند.", xpReward: 260 },
  { pathCode: "AABAA", titleEn: "The Polar Safety Gold Medal", titleFa: "مدال طلای ایمنی قطبی جهان", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان نجات‌بخش دریانوردی", climaxEn: "Maritime safety councils award Gabriel their highest honor for saving three hundred vessels from the massive calving tsunami.", climaxFa: "شورای ایمنی دریانوردی بالاترین نشان خود را به گابریل برای نجات جان سرنشینان سیصد قایق از سونامی زایش یخ اهدا کرد.", xpReward: 280 },
  { pathCode: "AABAB", titleEn: "The Lakefront Captains' Picnic", titleFa: "پیک‌نیک ناخدایان در ساحل دریاچه", badgeCategory: "funny", badgeIcon: "⛵", badgeNameFa: "پایان شاداب دریانوردی", climaxEn: "A hundred boat captains celebrate with roasted lamb and music, thanking the scientists who kept their families safe.", climaxFa: "صد ناخدای قایق با کباب بره و موسیقی محلی جشن گرفتند و از دانشمندانی که جان عزیزانشان را حفظ کردند قدردانی نمودند.", xpReward: 260 },
  { pathCode: "AABBA", titleEn: "The Patagonian Preservation Trust", titleFa: "بنیاد دائمی حفاظت از یخچال‌ها", badgeCategory: "heroic", badgeIcon: "🌱", badgeNameFa: "پایان خیریه زیست‌محیطی", climaxEn: "Ten million dollars in film streaming proceeds fund automated sensor beacons that safeguard the ice field forever.", climaxFa: "ده میلیون دلار از درآمد پخش فیلم مستند صرف نصب حسگرهای دائمی محافظت از تمام میدان یخی پاتاگونیا شد.", xpReward: 275 },
  { pathCode: "AABBB", titleEn: "The Town Hall Golden Eagle", titleFa: "تندیس عقاب زرین در تالار شهر", badgeCategory: "legendary", badgeIcon: "🦅", badgeNameFa: "پایان نمادین و افتخارآمیز", climaxEn: "The Golden Eagle Trophy rests in the El Calafate civic museum, honoring the courage of local rangers and scientists.", climaxFa: "تندیس عقاب طلایی در موزه شهرداری قرار گرفت؛ تجلیلی جاودان از شجاعت محیط‌بانان بومی و دانشمندان زمین.", xpReward: 270 },
  { pathCode: "ABAAA", titleEn: "The International Wegener Medal", titleFa: "مدال بزرگ وگنر برای علوم زمین", badgeCategory: "scholar", badgeIcon: "🌍", badgeNameFa: "پایان سرآمد ژئوفیزیک", climaxEn: "The European Geosciences Union honors Gabriel and Sofia for discovering the first active subglacial continental rift in the south.", climaxFa: "مجمع علوم زمین اروپا از گابریل و سوفیا برای کشف نخستین شکاف قاره‌ای فعال در زیر یخ‌های جنوب تجلیل کرد.", xpReward: 280 },
  { pathCode: "ABAAB", titleEn: "The Andean Guitar Strum", titleFa: "نوای گیتار در کمپ شبانه آند", badgeCategory: "legendary", badgeIcon: "🎸", badgeNameFa: "پایان خاطره‌انگیز و شاعرانه", climaxEn: "Strumming zambas under the Southern Cross, the three companions celebrate the eternal harmony between humans and the mountains.", climaxFa: "با نواختن ملودی‌های سنتی زیر آسمان پرستاره، سه یار دیرین هارمونی جاودان میان انسان و کوهستان را جشن گرفتند.", xpReward: 270 },
  { pathCode: "ABABA", titleEn: "The Fitz Roy Brotherhood Pact", titleFa: "پیمان برادری در قله فیتزروی", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان وفاداری و رفاقت", climaxEn: "Sofia, Gabriel, and Mateo renew their sacred oath to protect the wilderness, bonded as family by the perils of the tempest.", climaxFa: "سوفیا، گابریل و ماتئو عهد مقدس خود را برای حفاظت از طبیعت تازه کردند؛ خانواده‌ای که در دل طوفان زاده شد.", xpReward: 275 },
  { pathCode: "ABABB", titleEn: "The Axes Above the Hearth", titleFa: "تبرهای یخ بر فراز شومینه", badgeCategory: "heroic", badgeIcon: "⛏️", badgeNameFa: "پایان نماد شجاعت", climaxEn: "Their scratched titanium ice axes hang crossed above the ranch fireplace, silent witnesses to human courage in the storm.", climaxFa: "تبرهای یخ خط‌افتاده تیتانیومی بالای شومینه کلبه نصب شدند؛ شاهدان خاموش شجاعت انسان در برابر طوفان.", xpReward: 270 },
  { pathCode: "ABBAA", titleEn: "The UNESCO Biosphere Plaque", titleFa: "لوح زرین ذخیره‌گاه یونسکو", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان میراث جهانی بشر", climaxEn: "UN ambassadors unveil the bronze sanctuary monument, protecting the hidden emerald canyon for all future generations.", climaxFa: "سفیران سازمان ملل از لوح برنزی پرده‌برداری کردند؛ حفاظتی همیشگی از دالان زمردین پنهان برای نسل‌های فردا.", xpReward: 280 },
  { pathCode: "ABBAB", titleEn: "The Secret Canyon Chronicle", titleFa: "کتاب قصه دره سبز زیر یخ‌ها", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان پرتیراژ کودکان", climaxEn: "Sofia's illustrated children's book on the hidden warm mosses tops global lists, inspiring youth to cherish our planet.", climaxFa: "کتاب مصور داستانی سوفیا درباره خزه‌های باستانی پنهان زیر یخ‌ها پرفروش شد و عشق به زمین را در دل کودکان کاشت.", xpReward: 265 },
  { pathCode: "ABBBA", titleEn: "The Kew Botanical Acclaim", titleFa: "شکوفه‌های پاتاگونیا در باغ کیو لندن", badgeCategory: "scholar", badgeIcon: "🌸", badgeNameFa: "پایان گیاه‌شناسی جهانی", climaxEn: "Scientists at Kew Gardens celebrate the forty-six newly discovered subglacial plant species as milestones in paleobotany.", climaxFa: "دانشمندان باغ سلطنتی کیو لندن ۴۶ گونه گیاهی جدید کشف‌شده زیر یخ‌ها را دستاوردی تاریخی در گیاه‌شناسی کهن نامیدند.", xpReward: 275 },
  { pathCode: "ABBBB", titleEn: "The Living Alpine Herbarium", titleFa: "باغ گیاهان زنده کوهستان", badgeCategory: "heroic", badgeIcon: "🌿", badgeNameFa: "پایان حفاظت ژنتیکی گیاهان", climaxEn: "The newly built Patagonian botanical vault cultivates living strains of pre-Ice-Age flora, preserving ancient life from extinction.", climaxFa: "خزانه زیستی پاتاگونیا گونه‌های زنده گیاهان پیش از عصر یخبندان را تکثیر کرد و گیاهان باستانی را از انقراض نجات داد.", xpReward: 270 },
  { pathCode: "BAAAA", titleEn: "The Civic Salute of Río Gallegos", titleFa: "ادای احترام ده هزار شهروند", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان حماسی و مردمی", climaxEn: "Ten thousand cheering citizens wave white and sky-blue flags as the Governor pins the Gold Medal on Gabriel and Sofia.", climaxFa: "ده هزار شهروند پرچم‌های سپید و آبی را به اهتزاز درآوردند هنگامی که استاندار مدال زرین شجاعت را به دانشمندان اهدا کرد.", xpReward: 280 },
  { pathCode: "BAAAB", titleEn: "The Rangers' Shared Honor", titleFa: "افتخار مشترک با محیط‌بانان", badgeCategory: "heroic", badgeIcon: "🌲", badgeNameFa: "پایان قدرشناسی بومی", climaxEn: "Mateo and the mountain rangers hoist the civic trophy high, celebrated as the true guardians of the southern frontier.", climaxFa: "ماتئو و محیط‌بانان کوهستان جام قهرمانی را بالای سر بردند و به عنوان محافظان واقعی مرزهای جنوب ستایش شدند.", xpReward: 270 },
  { pathCode: "BAABA", titleEn: "The Geneva Early Warning Protocol", titleFa: "پروتکل هشدار زودهنگام در ژنو", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان استاندارد بین‌المللی", climaxEn: "The UN Disaster Reduction Bureau adopts the twenty-two-minute glacial warning model for vulnerable mountain valleys globally.", climaxFa: "ستاد مدیریت بحران سازمان ملل مدل هشدار ۲۲ دقیقه‌ای پاتاگونیا را به عنوان الگوی جهانی دره‌های کوهستانی تصویب کرد.", xpReward: 280 },
  { pathCode: "BAABB", titleEn: "The Command Center Toast", titleFa: "جام افتخار در مرکز فرماندهی", badgeCategory: "funny", badgeIcon: "🥂", badgeNameFa: "پایان درخشان و خستگی‌ناپذیر", climaxEn: "Raising crystal glasses beside real-time satellite screens, the engineers celebrate that no child will ever fear glacial floods again.", climaxFa: "با بالا بردن جام‌ها کنار مانیتورهای ماهواره، مهندسان اطمینان یافتند که دیگر هیچ کودکی در خواب اسیر سیلاب نخواهد شد.", xpReward: 265 },
  { pathCode: "BABAA", titleEn: "The Chacarera Under the Stars", titleFa: "پایکوبی سنتی چاکاررا زیر ستارگان", badgeCategory: "funny", badgeIcon: "💃", badgeNameFa: "پایان شاداب فولکلور", climaxEn: "Dancing the traditional chacarera with laughing villagers until sunrise, the team celebrates the sweetest victory of all: life.", climaxFa: "با رقص سنتی در کنار روستاییان شاداب تا سپیده‌دم، تیم شیرین‌ترین پیروزی عالم یعنی موهبت زندگی را جشن گرفتند.", xpReward: 260 },
  { pathCode: "BABAB", titleEn: "The Southern Cross Concord", titleFa: "پیمان صورت فلکی صلیب جنوبی", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان آرامش در دل طبیعت", climaxEn: "Clinking clay cups under the Southern Cross, Gabriel and Sofia gaze at the mountains with deep peace in their souls.", climaxFa: "با زدن فنجان‌های سفالی به هم زیر ستارگان درخشان جنوب، گابریل و سوفیا آرامشی عمیق را در روح خود حس کردند.", xpReward: 275 },
  { pathCode: "BABBA", titleEn: "The Alpine Flower Offering", titleFa: "شکوفه‌های سپید بر پای مجسمه", badgeCategory: "heroic", badgeIcon: "🌼", badgeNameFa: "پایان عاطفی و معصومانه", climaxEn: "Local schoolchildren carpet the base of the granite monument with fresh mountain blooms, honoring their guardians forever.", climaxFa: "دانش‌آموزان پای مجسمه گرانیتی را با گل‌های تازه کوهی پوشاندند تا برای همیشه از نجات‌دهندگان شهرشان تجلیل کنند.", xpReward: 270 },
  { pathCode: "BABBB", titleEn: "The Golden Sunset of Lake Argentino", titleFa: "غروب طلایی دریاچه آرژانتینو", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان حماسی و دیدنی", climaxEn: "The iconic photo of the Guardians of the Ice sculpture reflecting sunset waters becomes a viral global symbol of perseverance.", climaxFa: "تصویر تندیس نگهبانان یخ در بازتاب امواج زرین غروب به نماد جهانی پایداری و استقامت در برابر سختی‌ها بدل گشت.", xpReward: 275 },
  { pathCode: "BBAAA", titleEn: "The Andean Volcanology Congress", titleFa: "کنگره آتشفشان‌شناسی آند", badgeCategory: "scholar", badgeIcon: "🌋", badgeNameFa: "پایان علمی قاره‌ای", climaxEn: "Five hundred volcanologists gather at Lake Viedma, establishing Latin America's premier geohazard surveillance center.", climaxFa: "پانصد دانشمند آتشفشان‌شناس در دریاچه ویدما گرد آمدند و مدرن‌ترین پایگاه دیدبانی مخاطرات زمین قاره را افتتاح کردند.", xpReward: 280 },
  { pathCode: "BBAAB", titleEn: "The Indigenous Geophysics Fellowship", titleFa: "بورسیه ژئوفیزیک جوانان بومی", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان آینده‌ساز آموزشی", climaxEn: "The new endowment sponsors sixty Indigenous Andean students each year, uniting ancient mountain wisdom with high-tech sensors.", climaxFa: "بنیاد جدید سالانه ۶۰ دانشجوی بومی آند را بورسیه می‌کند تا حکمت باستانی کوهستان با فناوری حسگرها پیوند یابد.", xpReward: 275 },
  { pathCode: "BBBAA", titleEn: "The Burlington House Lyell Address", titleFa: "سخنرانی لایل در عمارت برلینگتون", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان عالی زمین‌شناسی", climaxEn: "London's Geological Society honors Gabriel and Sofia with a standing ovation, adopting their glaciovolcanic models into textbooks.", climaxFa: "انجمن زمین‌شناسی لندن با تشویق ایستاده از گابریل و سوفیا تقدیر کرد و مدل‌های آنان را به کتاب‌های درسی جهان سپرد.", xpReward: 280 },
  { pathCode: "BBBAB", titleEn: "The Cambridge Book Signing Queue", titleFa: "صف امضای کتاب در کمبریج", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان دانشگاهی و الهام‌بخش", climaxEn: "A thousand geology undergraduates line the cobblestones of Cambridge, inspired by the team that dared to explore the subglacial rift.", climaxFa: "هزار دانشجوی جوان در سنگفرش‌های کمبریج صف بستند؛ الهام‌گرفته از تیمی که جرات کرد به ژرفای شکاف‌های یخ قدم بگذارد.", xpReward: 270 },
  { pathCode: "BBBBA", titleEn: "The 8K Planetarium Broadcast", titleFa: "پخش زنده ۸K در افلاک‌نماهای جهان", badgeCategory: "legendary", badgeIcon: "📽️", badgeNameFa: "پایان شگفت‌انگیز تصویری", climaxEn: "Fifty million schoolchildren marvel at the live 8K footage of turquoise sponges blooming under forty meters of glacial ice.", climaxFa: "پنجاه میلیون دانش‌آموز در افلاک‌نماهای دنیا محو تماشای تصاویر زنده اسفنج‌های فیروزه‌ای در زیر ۴۰ متر یخ شدند.", xpReward: 280 },
  { pathCode: "BBBBB", titleEn: "The Vinyl Symphony of the Depths", titleFa: "سمفونی اعماق یخ و جاودانگی", badgeCategory: "legendary", badgeIcon: "🎼", badgeNameFa: "پایان ابدی و آرامش‌بخش", climaxEn: "Listening to the gentle acoustic breathing of the glacier under the starry sky, Gabriel and Sofia know the wilderness will sing forever.", climaxFa: "با گوش سپردن به نفس‌های آرامش‌بخش یخچال زیر آسمان پرستاره، گابریل و سوفیا دانستند که این طبیعت بکر تا ابد زنده خواهد ماند.", xpReward: 280 },
];

export const story3PatagoniaExpedition: AdventureStory = buildAdventureStory({
  id: "c1-patagonia-expedition",
  storyIndex: 3,
  cefr: "C1",
  titleEn: "The Patagonian Glacial Crossing",
  titleFa: "سفر اکتشافی به شکاف‌های یخچالی پاتاگونیا",
  genre: "travel",
  genreLabelFa: "🧭 سفر و ماجراجویی",
  genreIcon: "🧭",
  synopsisEn:
    "Braving an unseasonal polar tempest across the Southern Patagonian Ice Field, senior glaciologists Dr. Gabriel Morales and Sofia Alvarez investigate geothermal fissures threatening to destabilize the continental ice shelf across 32 breathtaking endings.",
  synopsisFa:
    "در سفری پرمخاطره و نفس‌گیر در میان میدان یخی پاتاگونیای جنوبی در آمریکای جنوبی، دکتر گابریل مورالس و کاوشگر ارشد سوفیا آلوارز در میان بوران سهمگین قطبی به دنبال منشأ شکاف‌های زمین‌گرمایی ناگهانی هستند که ثبات کوه‌های یخ و یخچال‌های قاره‌ای را تهدید می‌کند. ۳۲ پایان پر از هیجان اکتشاف، شگفتی‌های ناشناخته طبیعت و کار تیمی در انتظارته!",
  coverImage: "/images/skills/reading/c1-patagonia-expedition.webp",
  nodes,
  endings,
});

