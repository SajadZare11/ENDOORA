import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4 (C2 - Adult Mastery): The Oort Cloud Singularity (پژوهش کوانتومی در ابر اورت)
// Genre: Sci-Fi & Fantasy (فانتزی و علمی‌تخیلی)
// CEFR: C2 (Advanced theoretical physics diction, metaphysical elegance, participial clauses, literary inversion)
// Characters: Dr. Kian Bennett (Quantum Astrophysicist), Commander Yvaine Cross (Expedition Commander)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Hovering five thousand astronomical units from the Sun at the desolate outer frontier of the Oort Cloud, where solar light was reduced to a brilliant, diamond-hard needlepoint, the deep-space research vessel *Prometheus IV* drifted in silent majesty. Quantum Astrophysicist Dr. Kian Bennett monitored their graviton interferometer, where an impossible reading was steadily registering: a monolithic, twelve-kilometer octahedron constructed of vitreous hyper-crystalline carbon, adrift inside an icy cometary nursery. Commander Yvaine Cross peered through the flight deck viewport; illuminated by the ship's fusion searchlights, the artifact's faceted facets pulsed with iridescent cerulean veins. Suddenly, an acoustic vibration resonated directly through the vessel's titanium hull—not sound waves traveling through the vacuum, but an entangled quantum harmonic tone oscillating at the exact mathematical frequency of Planck time, inviting contact.",
    keywords: [
      { word: "vitreous", meaningFa: "شیشه‌ای، شفاف و زلال با ساختار آمورف شیشه‌مانند", phonetic: "/ˈvɪtriəs/" },
      { word: "octahedron", meaningFa: "هشت‌وجهی منتظم هندسی در بلورشناسی", phonetic: "/ˌɒktəˈhiːdrən/" },
      { word: "entangled", meaningFa: "درهم‌تنیده کوانتومی، دارای پیوستگی فیزیکی در ابعاد کوانتوم", phonetic: "/ɪnˈtæŋɡld/" },
      { word: "interferometer", meaningFa: "تداخل‌سنج امواج گرانشی و نوری برای اندازه‌گیری بی‌نهایت دقیق", phonetic: "/ˌɪntəfəˈrɒmɪtə(r)/" },
    ],
    question: {
      promptEn: "What unprecedented cosmic artifact was detected by the ship's graviton interferometer?",
      promptFa: "تداخل‌سنج گرانشی فضاپیما چه شیء کیهانی بی‌سابقه‌ای را در ابر اورت شناسایی کرد؟",
      options: [
        "A 12-kilometer vitreous hyper-crystalline octahedron pulsing with entangled quantum harmonics",
        "A derelict alien military dreadnought trapped inside an iron asteroid",
        "A miniature black hole venting superheated baryonic plasma",
      ],
      correctIndex: 0,
      hintSnippet: "a monolithic, twelve-kilometer octahedron constructed of vitreous hyper-crystalline carbon... pulsing with iridescent cerulean veins",
      clueFa: "خط چهارم و پنجم رو ببین دوست من؛ یک سازه هشت‌وجهی عظیم ۱۲ کیلومتری از کربن فوق‌بلورین بود که رگه‌های آبی درخشان داشت و هارمونی کوانتومی می‌فرستاد!",
    },
    choiceA: {
      labelEn: "Transmit a prime-number tachyon handshake pulse directly into the crystal's central aperture!",
      labelFa: "پالس پاسخی تاکیونی با کدهای ریاضی اعداد اول به سوی دریچه مرکزی سازه بفرست!",
      descriptionFa: "آغاز نخستین گفت‌وگوی تمدنی میان بشریت و سازندگان مرموز کهن این سازه.",
    },
    choiceB: {
      labelEn: "Deploy a triad of quantum sensor probes to scan the artifact's internal Casimir energy field!",
      labelFa: "سه کاوشگر کوانتومی بفرست تا میدان انرژی خلأ (کازیمیر) درون سازه را بررسی کنند!",
      descriptionFa: "رویکردی کاملاً تحلیلی و ایمن برای ارزیابی پایداری امواج قبل از هرگونه تماس مستقیم.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "As the ship’s tachyon transmitter pulsed the sequence of prime numbers—2, 3, 5, 7, 11—the massive octahedron responded instantly. A hexagonal iris dilated at its geometric apex, projecting an atmospheric tractor conduit of coherent violet gravitons that enveloped *Prometheus IV*. Inside the bridge, gravimetric gauges stabilized at exactly one standard Earth gravity, and the ship’s artificial intelligence, AURA, announced: 'Atmospheric envelope detected inside the conduit: breathable nitrogen-oxygen at twenty degrees Celsius. The interior geometry is non-Euclidean, spanning an interior volume larger than the planet Jupiter.'",
    keywords: [
      { word: "dilated", meaningFa: "گشاد شد، باز شد (مانند مردمک چشم یا دیافراگم)", phonetic: "/daɪˈleɪtɪd/" },
      { word: "non-Euclidean", meaningFa: "نااقلیدسی، هندسه‌ای که خطوط موازی در آن همگرا یا واگرا می‌شوند", phonetic: "/ˌnɒn juːˈklɪdiən/" },
      { word: "conduit", meaningFa: "مجرا، کانال هدایت‌کننده انرژی یا مایع", phonetic: "/ˈkɒndjuɪt/" },
      { word: "gravimetric", meaningFa: "گرانش‌سنجی، سنجش شدت میدان جاذبه", phonetic: "/ˌɡrævɪˈmetrɪk/" },
    ],
    question: {
      promptEn: "What astonishing spatial anomaly existed inside the crystalline octahedron?",
      promptFa: "چه پدیده فضایی شگفت‌انگیزی درون این هشت‌وجهی بلورین حاکم بود؟",
      options: [
        "A non-Euclidean interior volume spanning a space larger than the planet Jupiter",
        "A temporal loop where seconds repeated thirty times in reverse",
        "A compressed vacuum with zero gravity and intense antimatter radiation",
      ],
      correctIndex: 0,
      hintSnippet: "The interior geometry is non-Euclidean, spanning an interior volume larger than the planet Jupiter",
      clueFa: "خط آخر رو نگاه کن؛ هندسه درونی سازه نااقلیدسی بود و فضایی بزرگ‌تر از کل سیاره مشتری را در خود جای داده بود!",
    },
    choiceA: {
      labelEn: "Pilot *Prometheus IV* through the violet tractor conduit into the crystalline mega-structure!",
      labelFa: "فضاپیما را از میان کانال گرانشی بنفش‌رنگ به دل سازه عظیم و شگفت‌انگیز هدایت کن!",
      descriptionFa: "قدم گذاشتن به ژرفای تمدنی کیهانی که فضا و زمان را در هم نوردیده است.",
    },
    choiceB: {
      labelEn: "Anchor the ship at the threshold and send an autonomous tethered explorer probe!",
      labelFa: "فضاپیما را در آستانه درگاه نگه دار و یک ربات کاوشگر مجهز را با کابل ارتباطی بفرست!",
      descriptionFa: "محافظت کامل از جان سرنشینان در حین بررسی اولیه این دنیای بی‌پایان.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "The triad of sensor probes mapped a profound quantum equilibrium: the octahedron was not merely an inert monument, but a dormant 'Stellar Genesis Node' drawing zero-point energy directly from the quantum foam. Internal telemetry revealed an archive of petabytes of holographic data stored in lattice-bound carbon atoms, recording the birth, evolution, and final transcendent sublimation of two hundred thousand advanced civilizations across the Virgo Supercluster.",
    keywords: [
      { word: "sublimation", meaningFa: "تصعید، استعلا و تکامل روحی و مادی به مرتبه‌ای فراتر", phonetic: "/ˌsʌblɪˈmeɪʃn/" },
      { word: "equilibrium", meaningFa: "تعادل پایدار، توازن دقیق نیروها", phonetic: "/ˌiːkwɪˈlɪbriəm/" },
      { word: "transcendent", meaningFa: "فرامادی، متعالی و برتر از محدودیت‌های فیزیکی", phonetic: "/trænˈsendənt/" },
      { word: "lattice-bound", meaningFa: "تثبیت‌شده در شبکه بلورین اتمی", phonetic: "/ˈlætɪs baʊnd/" },
    ],
    question: {
      promptEn: "What historic archive was encoded within the carbon atoms of the Genesis Node?",
      promptFa: "چه آرشیو تاریخی عظیمی در میان اتم‌های کربن سازه ذخیره شده بود؟",
      options: [
        "Data recording the evolution and transcendence of 200,000 civilizations across the supercluster",
        "A military log detailing planetary invasions across the Milky Way",
        "Star maps charting only mineral-rich asteroid fields near Alpha Centauri",
      ],
      correctIndex: 0,
      hintSnippet: "recording the birth, evolution, and final transcendent sublimation of two hundred thousand advanced civilizations",
      clueFa: "خط چهارم و پنجم رو ببین رفیق؛ تاریخچه تولد، تکامل و عروج ۲۰۰ هزار تمدن باستانی کهکشان‌ها در شبکه بلورها ثبت شده بود!",
    },
    choiceA: {
      labelEn: "Initiate a quantum resonant bridge to download the civilization archive into ship memory!",
      labelFa: "یک پل تشدید کوانتومی بساز تا کل آرشیو تمدن‌های کیهان در حافظه کوانتومی فضاپیما بارگیری شود!",
      descriptionFa: "به ارمغان آوردن گنجینه جاودان دانش و هنر کائنات برای زمینیان.",
    },
    choiceB: {
      labelEn: "Synthesize an AI interface to communicate directly with the artifact's dormant consciousness!",
      labelFa: "یک رابط هوش مصنوعی برای گفت‌وگوی مستقیم با هوشیاری کهن و خفته سازه فعال کن!",
      descriptionFa: "سخن گفتن با نگهبان باستانی که هزاره‌ها در سکوت ابدی منتظر بوده است.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Drifting inside the impossible interior, the crew beheld an artificial Dyson biosphere. Artificial ring-worlds of suspended crystalline continents rotated around a luminous miniature white dwarf star that bathed oceans of liquid liquid diamond in warm, golden light. Flocks of luminescent, energy-based creatures resembling crystalline mantas soared through the nitrogen atmosphere, their flight paths creating shimmering aurora borealis across the inner vault.",
    keywords: [
      { word: "biosphere", meaningFa: "زیست‌کره، محیط زیستی خودکفا و حیات‌بخش", phonetic: "/ˈbaɪəʊsfɪə(r)/" },
      { word: "luminous", meaningFa: "درخشان، تابان و نورافشان", phonetic: "/ˈluːmɪnəs/" },
      { word: "mantas", meaningFa: "پرتوماهی‌های مانتا (موجودات بال‌دار دریایی یا کیهانی)", phonetic: "/ˈmæntəz/" },
      { word: "aurora", meaningFa: "شفق قطبی، پرده‌های نوری رنگارنگ و درخشان در آسمان", phonetic: "/ɔːˈrɔːrə/" },
    ],
    question: {
      promptEn: "What artificial celestial body occupied the center of the non-Euclidean interior?",
      promptFa: "چه جرم آسمانی مصنوعی در مرکز این دنیای نااقلیدسی شگفت‌انگیز می‌درخشید؟",
      options: [
        "A luminous miniature white dwarf star bathing oceans of liquid diamond in golden light",
        "A swirling red supergiant in the final stages of a supernova explosion",
        "A giant iron flywheel generating kinetic artificial gravity",
      ],
      correctIndex: 0,
      hintSnippet: "rotated around a luminous miniature white dwarf star that bathed oceans of liquid diamond in warm, golden light",
      clueFa: "خط دوم رو ببین؛ یک کوتوله سفید مینیاتوری درخشان بود که اقیانوس‌های الماس مایع را در نوری طلایی غرق کرده بود!",
    },
    choiceA: {
      labelEn: "Land *Prometheus IV* upon the shores of the crystal continent to collect pure planetary seeds!",
      labelFa: "فضاپیما را در سواحل قاره بلورین فرود بیاور تا بذرهای بنیادی حیات سیاره‌ای را نمونه‌برداری کنی!",
      descriptionFa: "یافتن ژنتیک حیات فرازمینی که راز پیدایش کهکشان‌ها را برملا می‌سازد.",
    },
    choiceB: {
      labelEn: "Transmit a harmonic musical salute to the energy mantas to establish empathic rapport!",
      labelFa: "یک پیام ملودیک و هم‌آهنگ موسیقایی برای موجودات نوری بفرست تا پیوند عاطفی برقرار شود!",
      descriptionFa: "ارتباط با گونه‌ای از حیات که بر پایه انرژی محض زندگی می‌کنند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The tethered explorer probe transmitted 8K telemetry of the threshold chamber: an altar of dark matter containment prisms holding a dormant, micro-cosmic seed of a newborn universe. Sensor readings indicated that this seed was designed to trigger an orderly, vacuum-stable Big Bang within an isolated pocket dimension, offering humanity a sanctuary if our universe should ever suffer thermodynamic heat death.",
    keywords: [
      { word: "prisms", meaningFa: "منشورها، محفظه‌های بلورین شکست نور و ماده", phonetic: "/ˈprɪzəmz/" },
      { word: "thermodynamic", meaningFa: "ترمودینامیکی، وابسته به مبادله گرما و انرژی در کائنات", phonetic: "/ˌθɜːməʊdaɪˈnæmɪk/" },
      { word: "dimension", meaningFa: "بعد فیزیکی، گستره مکانی و زمانی در کیهان‌شناسی", phonetic: "/daɪˈmenʃn/" },
      { word: "sanctuary", meaningFa: "پناهگاه ابدی، جان‌پناه امن و مصون", phonetic: "/ˈsæŋktʃuəri/" },
    ],
    question: {
      promptEn: "What existential safeguard for human civilization was contained within the dark matter prisms?",
      promptFa: "چه پناهگاه شگفت‌انگیزی برای بقای تمدن بشر درون منشورهای ماده تاریک تعبیه شده بود؟",
      options: [
        "A dormant micro-cosmic seed capable of creating an orderly sanctuary universe",
        "A weapon system powerful enough to extinguish neighboring solar systems",
        "A stasis field containing biological clones of the expedition crew",
      ],
      correctIndex: 0,
      hintSnippet: "a dormant, micro-cosmic seed of a newborn universe... offering humanity a sanctuary if our universe should ever suffer thermodynamic heat death",
      clueFa: "خط دوم و سوم رو نگاه کن دوست من؛ بذر کیهانی یک جهان نوزاد و پایدار بود تا در صورت مرگ حرارتی کیهان، تمدن بشر به آنجا پناه ببرد!",
    },
    choiceA: {
      labelEn: "Carefully interface the ship's nav-computer to map the pocket dimension's physics constants!",
      labelFa: "ثابت‌های فیزیکی این جهان نو را با کامپیوتر فضاپیما فرمول‌بندی و ثبت کن!",
      descriptionFa: "شناخت قوانین فیزیک دنیایی تازه که در آن مرگ و بیماری معنایی نخواهد داشت.",
    },
    choiceB: {
      labelEn: "Broadcast an encrypted quantum beacon to Earth's scientific institutes announcing the discovery!",
      labelFa: "پیام رمزشده کوانتومی کشف این پناهگاه کیهانی را برای آکادمی‌های علوم زمین مخابره کن!",
      descriptionFa: "بشارت جاودانگی بشر به جهانیان از دورترین نقطه منظومه شمسی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The resonant quantum download was breathtaking. As sixty petabytes of data streamed per second through the crystalline optical link, Kian witnessed holographic visions of ancient star-faring civilizations: architects who shaped star-clusters into works of art, philosophers who translated gravitational waves into symphonies of peace, and poets who wrote on the event horizons of supermassive black holes.",
    keywords: [
      { word: "petabytes", meaningFa: "پتابایت‌ها (میلیون‌ها گیگابایت داده رقومی)", phonetic: "/ˈpetəbaɪts/" },
      { word: "supermassive", meaningFa: "ابرسیاه‌چاله، سیاه‌چاله‌های غول‌آسای مرکز کهکشان‌ها", phonetic: "/ˌsuːpəˈmæsɪv/" },
      { word: "symphonies", meaningFa: "سمفونی‌ها، قطعات عظیم و هارمونیک موسیقی کائنات", phonetic: "/ˈsɪmfəniz/" },
      { word: "horizons", meaningFa: "افق رویداد (مرز بازگشت‌ناپذیر پیرامون سیاه‌چاله)", phonetic: "/həˈraɪznz/" },
    ],
    question: {
      promptEn: "What artistic and philosophical achievements of ancient civilizations were revealed during the download?",
      promptFa: "چه دستاوردهای هنری و فلسفی والایی از تمدن‌های کهن در حین دانلود داده‌ها آشکار شد؟",
      options: [
        "Architects shaping stars into art, gravitational wave symphonies, and poems on black hole event horizons",
        "Conquerors building armored space stations to subjugate primitive star systems",
        "Societies that destroyed their own planets through relentless resource mining",
      ],
      correctIndex: 0,
      hintSnippet: "architects who shaped star-clusters into works of art, philosophers who translated gravitational waves into symphonies of peace",
      clueFa: "خط سوم و چهارم رو ببین؛ معمارانی که خوشه‌های ستاره‌ای را مثل مجسمه شکل می‌دادند و شعرایی که روی افق رویداد سیاه‌چاله‌ها شعر می‌نوشتند!",
    },
    choiceA: {
      labelEn: "Synthesize the gravitational symphonies into an open-access global audio broadcast for Earth!",
      labelFa: "سمفونی‌های امواج گرانشی را به قطعات صوتی تبدیل و برای مردم زمین پخش کن!",
      descriptionFa: "نخستین بار که گوش انسان‌ها با موسیقی واقعی کائنات آرامش می‌یابد.",
    },
    choiceB: {
      labelEn: "Translate the architectural star-engineering schematics to solve Earth's energy crises!",
      labelFa: "فرمول‌های مهندسی ستاره‌ها را برای حل بحران انرژی بشریت ترجمه کن!",
      descriptionFa: "دستیابی به انرژی نامحدود و رایگان ستاره‌ها برای همیشه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The synthesized holographic interface manifested as an iridescent figure of luminous starlight calling itself 'Aethel'. Speaking in a voice that harmonized across forty octaves, the entity smiled with benevolent warmth: 'Welcome, children of the Sun. We planted this beacon when your ancestors first gathered around terrestrial campfires. You have passed the trial of patience; you have ventured beyond your cradle.'",
    keywords: [
      { word: "benevolent", meaningFa: "خیرخواه، مهربان و سرشار از نیک‌اندیشی", phonetic: "/bəˈnevələnt/" },
      { word: "octaves", meaningFa: "اکتاوها، فواصل هشت‌گانه زیر و بمی نت‌های موسیقی", phonetic: "/ˈɒktɪvz/" },
      { word: "terrestrial", meaningFa: "زمینی، متعلق به سیاره خاکی زمین", phonetic: "/təˈrestriəl/" },
      { word: "iridescent", meaningFa: "رنگین‌کمانی، هفت‌رنگ و دارای تلألو رنگارنگ", phonetic: "/ˌɪrɪˈdesnt/" },
    ],
    question: {
      promptEn: "What welcoming message did the holographic entity Aethel deliver to the crew?",
      promptFa: "موجود هوشمند هولوگرافیک 'ایتل' چه پیام گرم و مهرآمیزی به سرنشینان داد؟",
      options: [
        "'Welcome, children of the Sun... You have passed the trial of patience; you have ventured beyond your cradle.'",
        "'Prepare to surrender your vessel to the High Galactic Imperium'",
        "'You are trespassing in an abandoned quarantine sector; depart immediately'",
      ],
      correctIndex: 0,
      hintSnippet: "'Welcome, children of the Sun. We planted this beacon when your ancestors first gathered around terrestrial campfires. You have passed the trial of patience; you have ventured beyond your cradle.'",
      clueFa: "خط آخر رو نگاه کن دوست من؛ گفت: 'خوش آمدید فرزندان خورشید... شما آزمون صبوری را با موفقیت گذراندید و از گهواره خود فراتر آمدید!'",
    },
    choiceA: {
      labelEn: "Ask Aethel to reveal the ultimate cosmic purpose of consciousness in the universe!",
      labelFa: "از ایتل بخواه راز غایی هدف آفرینش و نقش هوشیاری در کیهان را برای بشر بازگو کند!",
      descriptionFa: "پاسخ به بزرگ‌ترین پرسش فلسفی و علمی تاریخ بشریت.",
    },
    choiceB: {
      labelEn: "Invite Aethel to accompany *Prometheus IV* as an ambassador of cosmic enlightenment to Earth!",
      labelFa: "از ایتل دعوت کن تا به عنوان سفیر آگاهی کائنات همراه فضاپیما به زمین بیاید!",
      descriptionFa: "آغاز عصری نوین در تاریخ بشر با حضور نماینده‌ای خردمند از کهکشان‌ها.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Landing on the shores of the liquid diamond sea, Kian and Yvaine walked upon shores of pulverized sapphire dust. In an ornate crystalline pavilion, they discovered thousands of dormant bio-seeds: genetic templates capable of terraforming barren worlds into verdant paradise planets without genetic defects or disease. Each seed held the blueprint for entire ecosystems balanced in perfect symbiotic harmony.",
    keywords: [
      { word: "terraforming", meaningFa: "زمین‌سازی، آماده‌سازی سیارات دیگر برای سکونت بشر و حیات", phonetic: "/ˈterəfɔːmɪŋ/" },
      { word: "symbiotic", meaningFa: "همزیستانه، تعاملی مسالمت‌آمیز و متقابل میان موجودات", phonetic: "/ˌsɪmbaɪˈɒtɪk/" },
      { word: "verdant", meaningFa: "سرسبز، خرم و پوشیده از گیاهان شاداب", phonetic: "/ˈvɜːdnt/" },
      { word: "pulverized", meaningFa: "پودرشده، خرد و نرم‌شده به صورت ذرات ریز", phonetic: "/ˈpʌlvəraɪzd/" },
    ],
    question: {
      promptEn: "What miraculous genetic technology was found within the bio-seeds in the pavilion?",
      promptFa: "چه فناوری زیستی شگفت‌انگیزی درون بذرهای زیستی پاویون بلورین کشف شد؟",
      options: [
        "Genetic templates capable of terraforming barren worlds into disease-free paradise planets",
        "Spores capable of converting planet atmospheres into pure methane gas",
        "Biological crystals designed to grow autonomous military fighter craft",
      ],
      correctIndex: 0,
      hintSnippet: "genetic templates capable of terraforming barren worlds into verdant paradise planets without genetic defects or disease",
      clueFa: "خط دوم و سوم رو ببین؛ الگوهای ژنتیکی که قادر بودند سیارات بایر و بی‌جان را به بهشت‌هایی سرسبز، بدون بیماری و با توازن زیستی بدل کنند!",
    },
    choiceA: {
      labelEn: "Seed the barren Martian rust-deserts to inaugurate humanity's second emerald home!",
      labelFa: "کویرهای سرخ و بی‌جان مریخ را با این بذرها به دومین خانه سرسبز بشریت بدل ساز!",
      descriptionFa: "تولد سیاره زمردین مریخ با جنگل‌ها و دریاچه‌های زلال.",
    },
    choiceB: {
      labelEn: "Safely preserve the genetic templates in the Global Biosphere Seed Vault on the Moon!",
      labelFa: "الگوهای ژنتیکی را در انبار مرکزی بذرهای ماه برای حفاظت ابدی پلمب کن!",
      descriptionFa: "بیمه دائمی بقای حیات در منظومه شمسی در برابر هرگونه فاجعه کیهانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The musical harmonics transmitted by *Prometheus IV* resonated with the crystalline mantas. The majestic creatures converged, swimming in sweeping spiral formations around the ship's observation blister. Their bioluminescent wings flashed in synchronized response, projecting mathematical equations of interstellar warp geometry directly into the vessel's primary sensors, granting humanity faster-than-light travel.",
    keywords: [
      { word: "converged", meaningFa: "همگرا شدند، گرد هم آمدند در یک نقطه", phonetic: "/kənˈvɜːdʒd/" },
      { word: "warp", meaningFa: "تحدب و انحنای فضا-زمان برای سفر سریع‌تر از نور", phonetic: "/wɔːp/" },
      { word: "bioluminescent", meaningFa: "زیست‌تاب، تولیدکننده نور طبیعی توسط موجود زنده", phonetic: "/ˌbaɪəʊˌluːmɪˈnesnt/" },
      { word: "blister", meaningFa: "برآمدگی شیشه‌ای برجسته روی بدنه فضاپیما برای رصد", phonetic: "/ˈblɪstə(r)/" },
    ],
    question: {
      promptEn: "What technological gift did the energy mantas transmit to the ship's sensors?",
      promptFa: "موجودات نوری مانتا چه هدیه فناوری بزرگی به حسگرهای فضاپیما منتقل کردند؟",
      options: [
        "Mathematical equations of interstellar warp geometry granting faster-than-light travel",
        "A targeting grid for orbital laser bombardment",
        "A recipe for synthetic rocket fuels using water ice",
      ],
      correctIndex: 0,
      hintSnippet: "projecting mathematical equations of interstellar warp geometry directly into the vessel's primary sensors, granting humanity faster-than-light travel",
      clueFa: "خط چهارم رو نگاه کن دوست من؛ معادلات ریاضی انحنای فضا-زمان (وارپ) را منتقل کردند که سفر سریع‌تر از نور میان ستارگان را ممکن ساخت!",
    },
    choiceA: {
      labelEn: "Engage the newly unlocked warp drive to take humanity's maiden leap to the stars!",
      labelFa: "موتور انحنای فضا-زمان را فعال کن و نخستین جهش تاریخ بشر را به سوی ستارگان آغاز کن!",
      descriptionFa: "گشوده شدن درهای پهنه کهکشان به روی سفینه‌های انسان.",
    },
    choiceB: {
      labelEn: "Map a peaceful galactic navigation network connecting peaceful civilized worlds!",
      labelFa: "نقشه ناوبری صلح‌آمیز میان دنیاهای خردمند کهکشان را پی‌ریزی کن!",
      descriptionFa: "بنا نهادن بزرگراه صلح و دوستی میان تمدن‌های کیهانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Mapping the pocket universe's physical constants revealed a cosmological masterpiece: the fine-structure constant and cosmological constant were harmonized to prevent entropy, aging, and cellular degeneration. In this sanctuary dimension, conscious beings could thrive for quadrillions of years in immortal physical wellness, exploring philosophy, art, and the boundless depths of mind.",
    keywords: [
      { word: "entropy", meaningFa: "آنتروپی، تمایل طبیعی سیستم‌ها به بی‌نظمی و فروپاشی حرارتی", phonetic: "/ˈentrəpi/" },
      { word: "quadrillions", meaningFa: "میلیاردها میلیارد (عدد ۱۰ به توان ۱۵)", phonetic: "/kwɒˈdrɪljənz/" },
      { word: "degeneration", meaningFa: "تباهی، زوال تدریجی و فرسودگی سلولی", phonetic: "/dɪˌdʒenəˈreɪʃn/" },
      { word: "cosmological", meaningFa: "کیهان‌شناختی، وابسته به پیدایش و ساختار جهان", phonetic: "/ˌkɒzməˈlɒdʒɪkl/" },
    ],
    question: {
      promptEn: "What remarkable physical properties characterized the pocket sanctuary universe?",
      promptFa: "جهان نوزاد پناهگاه چه ویژگی‌های فیزیکی خارق‌العاده‌ای داشت؟",
      options: [
        "Constants harmonized to prevent entropy and aging, allowing conscious life to thrive for quadrillions of years",
        "Extreme gravity that compressed all matter into solid iron balls",
        "A toxic atmosphere where biological life could survive only inside lead chambers",
      ],
      correctIndex: 0,
      hintSnippet: "constants were harmonized to prevent entropy, aging, and cellular degeneration. In this sanctuary dimension, conscious beings could thrive for quadrillions of years",
      clueFa: "خط اول و دوم رو ببین؛ ثابت‌های فیزیکی به شکلی تنظیم شده بودند که آنتروپی و پیری سلول‌ها متوقف می‌شد و حیات می‌توانست میلیاردها میلیارد سال بالنده بماند!",
    },
    choiceA: {
      labelEn: "Design the first inter-dimensional migration gateway at the edge of the solar system!",
      labelFa: "اولین درگاه مهاجرت بین‌بعدی را در مرز منظومه شمسی پایه‌گذاری کن!",
      descriptionFa: "تضمین بقای ابدی بشریت در جهانی بدون رنج، پیری و بیماری.",
    },
    choiceB: {
      labelEn: "Preserve the gateway as a sacred reserve of eternal contemplation for artists and thinkers!",
      labelFa: "درگاه را به عنوان معبد جاودانه تفکر و هنر برای اندیشمندان و هنرمندان حفظ کن!",
      descriptionFa: "مکانی الهام‌بخش برای خلق والاترین شاهکارهای فکری تاریخ هستی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The encrypted quantum transmission reached Earth's orbital defense and research command in eight seconds via quantum entanglement. The revelation that humanity possessed an eternal sanctuary universe brought an end to all geopolitical conflicts on Earth; knowing that human survival was forever assured, nations dismantled their weapons and redirected all resources toward exploration and education.",
    keywords: [
      { word: "entanglement", meaningFa: "درهم‌تنیدگی کوانتومی، پیوند آنی دو ذره در فضا بدون تاخیر زمانی", phonetic: "/ɪnˈtæŋɡlmənt/" },
      { word: "geopolitical", meaningFa: "ژئوپلیتیک، جغرافیای سیاسی و رقابت‌های مرزی دولت‌ها", phonetic: "/ˌdʒiːəʊpəˈlɪtɪkl/" },
      { word: "dismantled", meaningFa: "برچیدند، قطعات را باز و خلع سلاح کردند", phonetic: "/dɪsˈmæntld/" },
      { word: "revelation", meaningFa: "وحی، کشف پرده‌بردارانه حقیقت بزرگ", phonetic: "/ˌrevəˈleɪʃn/" },
    ],
    question: {
      promptEn: "What transformative historical impact did the news of the sanctuary universe have on Earth?",
      promptFa: "خبر کشف این جهان پناهگاه چه تحول شگفت‌انگیزی در سیاره زمین ایجاد کرد؟",
      options: [
        "Nations dismantled their weapons and ended conflicts, redirecting all resources toward exploration and education",
        "It triggered a worldwide panic and hoarding of space rations",
        "It was suppressed by military censors and erased from public broadcasts",
      ],
      correctIndex: 0,
      hintSnippet: "brought an end to all geopolitical conflicts on Earth; knowing that human survival was forever assured, nations dismantled their weapons",
      clueFa: "خط سوم رو ببین؛ تمام جنگ‌های سیاسی جهان پایان یافت؛ کشورها سلاح‌هایشان را کنار گذاشتند و همه بودجه‌ها خرج آموزش و اکتشاف شد!",
    },
    choiceA: {
      labelEn: "Broadcast a message of eternal peace from the bridge of *Prometheus IV* to Earth!",
      labelFa: "پیام صلح جاودان را از پل فرماندهی پرومتئوس برای هشت میلیارد انسان در زمین مخابره کن!",
      descriptionFa: "لحظه پیوند همه انسان‌ها در شادمانی آغاز عصری طلایی.",
    },
    choiceB: {
      labelEn: "Inaugurate the United Earth Star Fleet dedicated to peaceful cosmic voyages!",
      labelFa: "ناوگان متحد فضایی زمین را برای سفرهای صلح‌آمیز کیهانی افتتاح کن!",
      descriptionFa: "خروج انسان‌ها به عنوان پیام‌آوران صلح و دوستی به کهکشان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "When the gravitational wave symphonies were broadcast across Earth's planetary media networks, a profound hush swept over humanity. Millions of citizens in every continent sat beneath the night sky, listening to the harmonized cosmic chords recorded from the event horizons of supermassive black holes. The music possessed an inexplicable, soothing clarity that healed old grief and inspired universal empathy.",
    keywords: [
      { word: "inexplicable", meaningFa: "توضیح‌ناپذیر، شگفت‌آور و فراتر از بیان", phonetic: "/ˌɪnɪkˈsplɪkəbl/" },
      { word: "empathy", meaningFa: "همدلی، درک عمیق احساسات و پیوند با دیگران", phonetic: "/ˈempəθi/" },
      { word: "hush", meaningFa: "سکوت سرشار از احترام و آرامش، آرامش مطلق", phonetic: "/hʌʃ/" },
      { word: "chords", meaningFa: "آکوردهای موسیقی، همنوازی چند نت هم‌زمان", phonetic: "/kɔːdz/" },
    ],
    question: {
      promptEn: "What profound emotional effect did the broadcast of cosmic symphonies have on Earth's population?",
      promptFa: "پخش این سمفونی‌های کیهانی چه اثر شگفت‌انگیز روحی بر مردم زمین گذاشت؟",
      options: [
        "A soothing clarity that healed old grief and inspired universal empathy across all nations",
        "A widespread auditory hallucination that disabled radio transmitters",
        "A temporary loss of balance in low-altitude coastal regions",
      ],
      correctIndex: 0,
      hintSnippet: "The music possessed an inexplicable, soothing clarity that healed old grief and inspired universal empathy",
      clueFa: "خط آخر رو نگاه کن دوست من؛ آرامشی شگفت‌انگیز آورد که غم‌های کهنه را شفا داد و حس همدلی جهانی میان تمام ملت‌ها آفرید!",
    },
    choiceA: {
      labelEn: "Establish the Global Conservatory of Cosmic Harmony to teach cosmic music worldwide!",
      labelFa: "هنرستان جهانی هارمونی کیهانی را برای آموزش این موسیقی آرامش‌بخش تاسیس کن!",
      descriptionFa: "هنری که دل‌های تمام انسان‌ها را با نغمه ستارگان پیوند می‌زند.",
    },
    choiceB: {
      labelEn: "Broadcast the symphonies toward neighboring star systems as a beacon of friendship!",
      labelFa: "این سمفونی‌ها را به سوی منظومه‌های همسایه به عنوان کارت تبریک دوستی بفرست!",
      descriptionFa: "اعلام حضور صلح‌آمیز بشریت به دیگر ساکنان کهکشان راه شیری.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Engineers at the Geneva Quantum Dynamics Institute decoded the star-engineering schematics, constructing the first 'Tachyon Fusion Micro-Sun'. Producing unlimited, clean electrical power directly from the sub-atomic oscillation of the quantum vacuum, the technology rendered oil, coal, and uranium obsolete in a single afternoon, permanently healing the terrestrial climate.",
    keywords: [
      { word: "obsolete", meaningFa: "منسوخ، از رده خارج‌شده و غیرکاربردی", phonetic: "/ˈɒbsəliːt/" },
      { word: "sub-atomic", meaningFa: "زیراتمی، کوچک‌تر از ابعاد اتم", phonetic: "/ˌsʌb əˈtɒmɪk/" },
      { word: "terrestrial", meaningFa: "زمینی، وابسته به محیط زیست کره زمین", phonetic: "/təˈrestriəl/" },
      { word: "oscillation", meaningFa: "نوسان، ارتعاش منظم بسامدی", phonetic: "/ˌɒsɪˈleɪʃn/" },
    ],
    question: {
      promptEn: "What revolutionary technological feat was achieved using the translated star schematics?",
      promptFa: "با نقشه‌های مهندسی ستارگان چه دستاورد انقلابی در ژنو محقق شد؟",
      options: [
        "The first Tachyon Fusion Micro-Sun producing unlimited clean energy from the quantum vacuum",
        "A machine capable of turning lead ingots into solid platinum",
        "A military particle cannon deployed in geostationary orbit",
      ],
      correctIndex: 0,
      hintSnippet: "constructing the first 'Tachyon Fusion Micro-Sun'. Producing unlimited, clean electrical power directly from the sub-atomic oscillation of the quantum vacuum",
      clueFa: "خط اول و دوم رو ببین؛ اولین 'میکرو-خورشید تاکیونی' ساخته شد که انرژی پاک و بی‌نهایت از خلأ کوانتومی تولید کرد و سوخت‌های فسیلی را برای همیشه منسوخ ساخت!",
    },
    choiceA: {
      labelEn: "Switch off the final coal and fossil power plant on Earth in a worldwide celebration!",
      labelFa: "آخرین نیروگاه زغال‌سنگ و آلاینده زمین را در جشنی همگانی برای همیشه خاموش کن!",
      descriptionFa: "آغاز عصری پاک و آسمانی آبی و زلال برای تمام فرزندان زمین.",
    },
    choiceB: {
      labelEn: "Power thousands of atmospheric carbon scrubbers to restore polar ice sheets!",
      labelFa: "هزاران دستگاه تصفیه کربن جوی را برای بازسازی یخچال‌های قطب روشن کن!",
      descriptionFa: "بازگرداندن تعادل طبیعی به آب‌وهوای کره زمین در کوتاه‌ترین زمان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Aethel stood upon the observation deck, glowing with gentle luminescence. 'The ultimate purpose of consciousness,' the entity explained, 'is to be the eyes through which the cosmos marvels at its own beauty. The universe without conscious observers is merely dead stone and nuclear fire; with you, it becomes poetry, love, and living light.' Kian and Yvaine felt tears of gratitude in the quiet bridge.",
    keywords: [
      { word: "luminescence", meaningFa: "نورتابی، درخشش ملایم بدون تولید گرمای شدید", phonetic: "/ˌluːmɪˈnesns/" },
      { word: "observers", meaningFa: "ناظران، موجودات خودآگاهی که بر جهان می‌نگرند", phonetic: "/əbˈzɜːvəz/" },
      { word: "cosmos", meaningFa: "کیهان، کائنات با تمام شکوه و نظم شگفتش", phonetic: "/ˈkɒzmɒs/" },
      { word: "marvels", meaningFa: "شگفت‌زده می‌شود، با حیرت و تحسین می‌نگرد", phonetic: "/ˈmɑːvlz/" },
    ],
    question: {
      promptEn: "What sublime definition of consciousness did Aethel reveal to the crew?",
      promptFa: "ایتل چه تعریف والایی از هدف وجودی هوشیاری در کیهان ارائه داد؟",
      options: [
        "Consciousness is the eyes through which the universe marvels at its own beauty and becomes poetry",
        "Consciousness is an accidental biological mutation that must eventually be erased",
        "Consciousness is a mathematical virus designed to consume energy",
      ],
      correctIndex: 0,
      hintSnippet: "The ultimate purpose of consciousness... is to be the eyes through which the cosmos marvels at its own beauty. The universe... becomes poetry, love, and living light.",
      clueFa: "خط اول و دوم رو نگاه کن؛ گفت: 'هدف هوشیاری اینه که چشمانی باشه که جهان از طریق اون به زیبایی خودش خیره بشه و به شعر، عشق و نور زنده بدل بشه!'",
    },
    choiceA: {
      labelEn: "Inscribe this cosmic revelation on the central golden monument of the United Nations!",
      labelFa: "این کلام والا را روی بنای یادبود طلایی سازمان ملل در زمین حکاکی کن!",
      descriptionFa: "ثبت فلسفه راستین هستی برای تمام فرهنگ‌ها و مکاتب بشری.",
    },
    choiceB: {
      labelEn: "Compose the foundational text of the Cosmic Humanist Enlightenment!",
      labelFa: "منشور روشنگری اومانیسم کیهانی را تدوین کن تا راهنمای معنوی نسل‌ها شود!",
      descriptionFa: "پیوند عقل، عشق و دانش در منظومه فکری نوین بشریت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Aethel accepted the invitation to serve as Galactic Envoy, stepping aboard *Prometheus IV* as an honored companion. As the vessel turned its fusion thrusters toward the inner solar system, the 12-kilometer crystalline octahedron dissolved into a swirling ring of benign tachyon photons that will guard the frontier of our solar system against cosmic radiation forever.",
    keywords: [
      { word: "envoy", meaningFa: "فرستاده، سفیر ارشد دیپلماتیک میان دو تمدن", phonetic: "/ˈenvɔɪ/" },
      { word: "benign", meaningFa: "بی‌ضرر، مهرآمیز و محافظت‌کننده", phonetic: "/bɪˈnaɪn/" },
      { word: "thrusters", meaningFa: "پیشران‌ها، موتورهای رانشی فضاپیما", phonetic: "/ˈθrʌstəz/" },
      { word: "frontier", meaningFa: "مرز، سرحد نهایی شناخته‌شده", phonetic: "/ˈfrʌntɪə(r)/" },
    ],
    question: {
      promptEn: "What did the massive crystalline octahedron become after Aethel boarded the ship?",
      promptFa: "سازه ۱۲ کیلومتری بلورین پس از سوار شدن ایتل به چه چیزی تبدیل شد؟",
      options: [
        "A swirling protective ring of tachyon photons guarding our solar system forever",
        "A dangerous supernova that illuminated outer space",
        "A dense lead sphere that sank into the Sun",
      ],
      correctIndex: 0,
      hintSnippet: "the 12-kilometer crystalline octahedron dissolved into a swirling ring of benign tachyon photons that will guard the frontier of our solar system against cosmic radiation forever",
      clueFa: "خط آخر رو ببین؛ به یک حلقه محافظتی درخشان از فوتون‌های تاکیونی بدل شد تا تا ابد از منظومه شمسی در برابر پرتوهای کیهانی پاسداری کند!",
    },
    choiceA: {
      labelEn: "Chart a triumphant homeward voyage toward Earth's welcoming orbital stations!",
      labelFa: "مسیر بازگشت شکوهمند به سوی ایستگاه‌های مداری مشتاق زمین را تنظیم کن!",
      descriptionFa: "بازگشت قهرمانان با سفیری از ژرفای کهکشان در آغوش هلهله زمین.",
    },
    choiceB: {
      labelEn: "Transmit live greetings in all human languages alongside Aethel from the bridge!",
      labelFa: "پیام تبریک و صلح را در کنار ایتل به تمام زبان‌های زنده زمین پخش کن!",
      descriptionFa: "آغاز زیباترین روز در تاریخ سیاره زمین با نغمه دوستی کیهانی.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Within thirty months, the crimson sands of Mars were transformed into rolling emerald valleys, crystal rivers, and breathable temperate pine forests. Millions of pioneer families migrated into pristine domeless settlements under a warm blue Martian sky, celebrating the miracle of alien bio-seeds that made humanity a two-world species in enduring peace.",
    keywords: [
      { word: "pioneer", meaningFa: "پیشگام، مهاجران پیشرو در سرزمین‌های نو", phonetic: "/ˌpaɪəˈnɪə(r)/" },
      { word: "temperate", meaningFa: "معتدل، دارای آب‌وهوای مطبوع و ملایم", phonetic: "/ˈtempərət/" },
      { word: "domeless", meaningFa: "بدون گنبد محافظ، در هوای آزاد و پاک", phonetic: "/ˈdəʊmləs/" },
      { word: "enduring", meaningFa: "پایدار، همیشگی و زوال‌ناپذیر", phonetic: "/ɪnˈdjʊərɪŋ/" },
    ],
    question: {
      promptEn: "What miraculous transformation took place on the planet Mars within thirty months?",
      promptFa: "ظرف سی ماه چه دگرگونی معجزه‌آسایی در سیاره مریخ رخ داد؟",
      options: [
        "Red sands became emerald valleys, rivers, and forests under a blue breathable sky",
        "The planet cooled into an uninhabitable frozen snowball",
        "The moons Phobos and Deimos collided with the polar ice caps",
      ],
      correctIndex: 0,
      hintSnippet: "the crimson sands of Mars were transformed into rolling emerald valleys, crystal rivers, and breathable temperate pine forests",
      clueFa: "خط اول و دوم رو ببین؛ شن‌های سرخ مریخ به دره‌های سرسبز زمردین، رودخانه‌های زلال و جنگل‌های کاج در هوای آزاد بدل شدند!",
    },
    choiceA: {
      labelEn: "Breathe the fresh mountain pine air of Mars on the balcony of Mount Olympus!",
      labelFa: "هوای تازه و عطر کاج مریخ را بر فراز کوهستان المپوس با آرامش نفس بکش!",
      descriptionFa: "پایانی شکوهمند و بهشتی در دومین خانه سبز بشریت.",
    },
    choiceB: {
      labelEn: "Toast a cup of Martian spring water with Yvaine under two peaceful moons!",
      labelFa: "با ایوین یک لیوان آب زلال چشمه‌های مریخ را زیر دو ماه آرام بنوش!",
      descriptionFa: "پایان ماموریتی جاودان که رویای هزاران ساله بشر را محقق کرد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Deep inside the lunar bedrock at Shackleton Crater, the Global Biosphere Seed Vault sealed thirty thousand alien genetic templates inside argon stasis vaults. Protected by two hundred meters of solid basalt, the repository became the eternal insurance policy of earthly and interstellar life, guarded by a joint international council of bioscientists.",
    keywords: [
      { word: "bedrock", meaningFa: "سنگ بستر، صخره‌های زیرین و مستحکم سیاره", phonetic: "/ˈbedrɒk/" },
      { word: "stasis", meaningFa: "حالت ایستایی زیستی، تعلیق زمان برای محافظت", phonetic: "/ˈsteɪsɪs/" },
      { word: "insurance", meaningFa: "بیمه، تضمین امنیت و بقا در برابر حوادث", phonetic: "/ɪnˈʃʊərəns/" },
      { word: "repository", meaningFa: "مخزن، انبارگاه فوق‌العاده امن نگهداری گنجینه‌ها", phonetic: "/rɪˈpɒzətri/" },
    ],
    question: {
      promptEn: "Where was the permanent planetary seed repository constructed?",
      promptFa: "انبارگاه دائمی بذرهای کیهانی در کجا احداث شد؟",
      options: [
        "In the lunar bedrock beneath Shackleton Crater under two hundred meters of basalt",
        "On an abandoned artificial satellite orbiting Jupiter",
        "In an underground bunker beneath the Sahara Desert",
      ],
      correctIndex: 0,
      hintSnippet: "Deep inside the lunar bedrock at Shackleton Crater... sealed thirty thousand alien genetic templates",
      clueFa: "خط اول و دوم رو نگاه کن؛ در دل سنگ بستر ماه در دهانه شَکلتون زیر ۲۰۰ متر سنگ بازالت مستحکم ساخته شد!",
    },
    choiceA: {
      labelEn: "Turn the ceremonial golden vault key alongside the United Nations Secretary-General!",
      labelFa: "کلید طلایی مخزن را در کنار دبیرکل سازمان ملل با افتخار بچرخان!",
      descriptionFa: "روزی که بقای حیات در کهکشان برای همیشه تضمین شد.",
    },
    choiceB: {
      labelEn: "Gaze at the blue marble of Earth rising over the lunar horizon with peaceful pride!",
      labelFa: "به زمین نیلگون که بر افق ماه طلوع می‌کند با آرامش و غرور بنگر!",
      descriptionFa: "پایانی آرامش‌بخش، شاعرانه و باشکوه در پهنه فضا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Engaging the newly unlocked warp drive, the research vessel *Prometheus IV* folded space-time around its hull with a chime like silver crystal. In under twenty minutes, the ship covered four light-years, arriving in orbit above the twin hospitable planets of Alpha Centauri. Humanity had stepped out of its planetary cradle, embarking on its eternal voyage across the stars.",
    keywords: [
      { word: "hospitable", meaningFa: "مهمان‌نواز، مناسب سکونت و دارای شرایط مطبوع زیستی", phonetic: "/hɒˈspɪtəbl/" },
      { word: "folded", meaningFa: "تا کرد، انحنا داد به ابعاد فضا-زمان", phonetic: "/ˈfəʊldɪd/" },
      { word: "embarking", meaningFa: "آغاز کردن سفر بزرگ، سوار شدن به کشتی ماجراجویی", phonetic: "/ɪmˈbɑːkɪŋ/" },
      { word: "cradle", meaningFa: "گهواره، زادگاه نخستین و پناهگاه آغازین بشر", phonetic: "/ˈkreɪdl/" },
    ],
    question: {
      promptEn: "In how many minutes did the warp drive carry *Prometheus IV* to Alpha Centauri?",
      promptFa: "موتور انحنای فضا فضاپیمای پرومتئوس را در چند دقیقه به منظومه آلفا قنطورس رساند؟",
      options: [
        "In under twenty minutes across four light-years",
        "In six months of continuous acceleration",
        "In seventy-two hours of gravitational slingshots",
      ],
      correctIndex: 0,
      hintSnippet: "In under twenty minutes, the ship covered four light-years, arriving in orbit above the twin hospitable planets",
      clueFa: "خط دوم رو ببین؛ در کمتر از بیست دقیقه فاصله چهار سال نوری را طی کرد و به مدار سیارات مسکونی رسید!",
    },
    choiceA: {
      labelEn: "Beam the first interstellar greetings message back to Earth across the warp corridor!",
      labelFa: "اولین پیام پیروزی میان‌ستاره‌ای را از طریق کانال وارپ به زمین مخابره کن!",
      descriptionFa: "لحظه پیوستن زمین به خانواده تمدن‌های میان‌ستاره‌ای.",
    },
    choiceB: {
      labelEn: "Watch twin suns set over the turquoise oceans of Alpha Centauri Prime with awe!",
      labelFa: "غروب دو خورشید طلایی را بر اقیانوس‌های فیروزه‌ای قنطورس با شگفتی به تماشا بنشین!",
      descriptionFa: "پایانی رویایی و حیرت‌انگیز در نخستین افق دنیایی تازه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The Galactic Cartographic Guild published the First Peaceful Interstellar Highway Map. Linking sixty star systems with stable warp transit lanes, the network was safeguarded by automatic treaty buoys prohibiting military vessels. For the first time, human merchant ships traded clean energy and culture with benevolent alien worlds under eternal interstellar peace.",
    keywords: [
      { word: "cartographic", meaningFa: "نقشه‌نگاری، مربوط به تهیه و ترسیم نقشه‌های کیهانی", phonetic: "/ˌkɑːtəˈɡræfɪk/" },
      { word: "buoys", meaningFa: "بویه‌ها، شناورها و ایستگاه‌های هشداردهنده مسیریابی", phonetic: "/bɔɪz/" },
      { word: "prohibiting", meaningFa: "ممنوع‌کننده، بازدارنده از هرگونه اقدام نظامی", phonetic: "/prəˈhɪbɪtɪŋ/" },
      { word: "transit", meaningFa: "ترانزیت، عبور و مرور امن میان منظومه‌ها", phonetic: "/ˈtrænzɪt/" },
    ],
    question: {
      promptEn: "What vital peaceful regulation was enforced across the interstellar highway network?",
      promptFa: "چه قانون صلح‌آمیز حیاتی در سراسر بزرگراه میان‌ستاره‌ای به اجرا درآمد؟",
      options: [
        "Automatic treaty buoys strictly prohibiting military warships across warp lanes",
        "A mandatory high toll fee paid in gold bullion",
        "A ban on all unmanned commercial cargo vessels",
      ],
      correctIndex: 0,
      hintSnippet: "safeguarded by automatic treaty buoys prohibiting military vessels",
      clueFa: "خط سوم رو ببین؛ ایستگاه‌های خودکار بویه عبور هرگونه فضاپیمای جنگی را ممنوع ساختند تا مسیر تجارت و فرهنگ امن بماند!",
    },
    choiceA: {
      labelEn: "Sign the First Interstellar Peace Charter on behalf of the peoples of Earth!",
      labelFa: "اولین منشور صلح میان‌ستاره‌ای را به نمایندگی از مردم زمین با افتخار امضا کن!",
      descriptionFa: "پیمانی جاودان برای دوستی بشر با ساکنان خردمند کهکشان.",
    },
    choiceB: {
      labelEn: "Guide the maiden merchant fleet carrying Earth's poetry and music into warp space!",
      labelFa: "اولین ناوگان حامل شعر، هنر و موسیقی زمین را به سوی ستارگان هدایت کن!",
      descriptionFa: "به اشتراک گذاشتن زیباترین میراث روح انسان با کائنات.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "At the edge of the Oort Cloud, the Gateway to the Sanctuary Dimension stood open like a radiant ring of starlight. Over four decades, millions of human philosophers, artists, and families migrated into the timeless universe, founding the eternal city of 'Elysium Nova' where minds could create, love, and explore without death or sorrow forever.",
    keywords: [
      { word: "radiant", meaningFa: "نورانی، درخشان و پر از انوار الهام‌بخش", phonetic: "/ˈreɪdiənt/" },
      { word: "timeless", meaningFa: "فرازمان، بدون گذر فرساینده زمان و پیری", phonetic: "/ˈtaɪmləs/" },
      { word: "sorrow", meaningFa: "اندوه، حزن و رنج روحی", phonetic: "/ˈsɒrəʊ/" },
      { word: "migrated", meaningFa: "مهاجرت کردند، راهی سرزمینی ابدی شدند", phonetic: "/maɪˈɡreɪtɪd/" },
    ],
    question: {
      promptEn: "What name was given to the eternal city founded inside the sanctuary dimension?",
      promptFa: "شهر جاودانه‌ای که درون جهان پناهگاه ساخته شد چه نام گرفت؟",
      options: [
        "'Elysium Nova', where minds could create and explore without death or sorrow",
        "'New Babylon', a fortress of diamond walls",
        "'Terminus Prime', an automated industrial hub",
      ],
      correctIndex: 0,
      hintSnippet: "founding the eternal city of 'Elysium Nova' where minds could create, love, and explore without death or sorrow forever",
      clueFa: "خط سوم رو نگاه کن؛ شهر 'الیسیوم نووا' نامیده شد؛ جایی که اندیشه‌ها بدون مرگ و اندوه تا ابد خلق می‌کردند و عشق می‌ورزیدند!",
    },
    choiceA: {
      labelEn: "Step across the threshold of Elysium Nova into a realm of eternal light and beauty!",
      labelFa: "از آستانه شهر الیسیوم نووا به قلمرو نور، زیبایی و جاودانگی ابدی قدم بگذار!",
      descriptionFa: "پایانی عرفانی، بهشتی و آرامش‌بخش در دل جهان نوزاد.",
    },
    choiceB: {
      labelEn: "Hold hands with Yvaine as the shimmering gateway harmonizes in perfect peace!",
      labelFa: "دست در دست ایوین در سکوت سرشار از آرامش درگاه پیوند دل‌ها را جشن بگیرید!",
      descriptionFa: "آسودگی مطلق دو کاشف پس از رساندن انسان به ساحل ابدیت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Designated as the 'Sanctuary of the Pure Mind', the dimensional gateway welcomed sixty thousand scholars, poets, and mathematicians annually. Working in perpetual physical youth, they solved the deepest mysteries of quantum gravitation and unified field theory, transmitting their discoveries back to Earth to illuminate the human spirit.",
    keywords: [
      { word: "perpetual", meaningFa: "دائمی، همیشگی و بی‌پایان", phonetic: "/pəˈpetʃuəl/" },
      { word: "unified", meaningFa: "یکپارچه، وحدت‌یافته در نظریه میدان واحد", phonetic: "/ˈjuːnɪfaɪd/" },
      { word: "gravitation", meaningFa: "گرانش، نیروی جاذبه بنیادین هستی", phonetic: "/ˌɡrævɪˈteɪʃn/" },
      { word: "mysteries", meaningFa: "اسرار، معماهای ژرف و ناگشوده خلقت", phonetic: "/ˈmɪstriz/" },
    ],
    question: {
      promptEn: "What profound scientific breakthroughs were achieved by the scholars in the sanctuary?",
      promptFa: "پژوهشگران در پناهگاه ذهن به چه دستاوردهای شگرف علمی دست یافتند؟",
      options: [
        "Solving the deepest mysteries of quantum gravitation and unified field theory",
        "Creating biological weapons capable of destroying nebulae",
        "Building automated mining drillers to strip-mine comets",
      ],
      correctIndex: 0,
      hintSnippet: "solved the deepest mysteries of quantum gravitation and unified field theory, transmitting their discoveries back to Earth",
      clueFa: "خط سوم رو ببین؛ اسرار گرانش کوانتومی و نظریه وحدت نیروهای فیزیک را گشودند و به زمین مخابره کردند!",
    },
    choiceA: {
      labelEn: "Publish the Unified Theory of Cosmic Existence for universities across Earth!",
      labelFa: "نظریه وحدت وجود کیهانی را برای تمام دانشگاه‌های جهان منتشر کن!",
      descriptionFa: "شاهکاری علمی که تمام مجهولات فیزیک را در نوری زلال روشن کرد.",
    },
    choiceB: {
      labelEn: "Gather in the amphitheater of starlight to listen to new verses of cosmic poetry!",
      labelFa: "در تماشاخانه نور ستارگان گرد هم آیید و به اشعار نو کیهانی گوش بسپارید!",
      descriptionFa: "پایانی فرهنگی، پرمعنا و سرشار از شکوه معنوی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Broadcast from five thousand astronomical units away, Kian and Yvaine’s message of peace illuminated every display screen on Earth. Outside the United Nations, a crowd of two million citizens cheered and wept tears of pure joy, knowing that fear and resource scarcity had been banished from human history forever.",
    keywords: [
      { word: "scarcity", meaningFa: "کمیابی، کمبود منابع و نیازهای اولیه", phonetic: "/ˈskeəsəti/" },
      { word: "banished", meaningFa: "رانده شد، برای همیشه از میان برداشته شد", phonetic: "/ˈbænɪʃt/" },
      { word: "illuminated", meaningFa: "روشن ساخت، تابش انداخت بر صفحه‌های نمایش", phonetic: "/ɪˈluːmɪneɪtɪd/" },
      { word: "rejoiced", meaningFa: "شادی کردند، از ته دل جشن گرفتند", phonetic: "/rɪˈdʒɔɪst/" },
    ],
    question: {
      promptEn: "What global realization brought tears of joy to two million citizens gathered in New York?",
      promptFa: "چه آگاهی جمعی بزرگی اشک شوق به چشمان دو میلیون شهروند آورد؟",
      options: [
        "Knowing that fear and resource scarcity had been banished from human history forever",
        "That the ship was returning with thirty tons of solid gold bullion",
        "That an alien fleet would conquer Earth within thirty days",
      ],
      correctIndex: 0,
      hintSnippet: "knowing that fear and resource scarcity had been banished from human history forever",
      clueFa: "خط آخر رو نگاه کن دوست من؛ با این باور که ترس و فقر منابع برای همیشه از تاریخ زندگی انسان رخت بربست!",
    },
    choiceA: {
      labelEn: "Raise a crystal glass of port on the bridge in a silent salute to humanity’s triumph!",
      labelFa: "در پل فرماندهی پرومتئوس به سلامتی پیروزی نهایی بشریت جام را بالا ببر!",
      descriptionFa: "پایانی شاد، اصیل و فراموش‌نشدنی در آرامش فضا.",
    },
    choiceB: {
      labelEn: "Watch Earth shine like an azure jewel amidst the infinite field of velvet stars!",
      labelFa: "زمین را تماشا کن که مانند گوهری فیروزه‌ای در پهنه مخملین ستارگان می‌درخشد!",
      descriptionFa: "دیدن زیبایی بیکران وطن انسان‌ها از اعماق کائنات.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The United Earth Star Fleet was officially commissioned at the Lunar Gateway Station. Composed of two hundred science cruisers crewed by astronauts, poets, and medics from every continent, the fleet set sail into the cosmos under the flag of the Blue Marble, dedicated to peaceful diplomacy and shared wonder.",
    keywords: [
      { word: "commissioned", meaningFa: "به آب انداخته شد، رسماً افتتاح و عملیاتی شد", phonetic: "/kəˈmɪʃnd/" },
      { word: "cruisers", meaningFa: "رزم‌ناوهای اکتشافی و فضاپیماهای گشت‌زنی بزرگ", phonetic: "/ˈkruːzəz/" },
      { word: "wonder", meaningFa: "حیرت و شگفتی، اشتیاق کشف زیبایی‌های جهان", phonetic: "/ˈwʌndə(r)/" },
      { word: "marble", meaningFa: "تیله شیشه‌ای، سنگ مرمر (اشاره به کره زمین از فضا)", phonetic: "/ˈmɑːbl/" },
    ],
    question: {
      promptEn: "What was the founding mission of the newly commissioned United Earth Star Fleet?",
      promptFa: "رسالت بنیادین ناوگان متحد فضایی زمین چه بود؟",
      options: [
        "Peaceful diplomacy, medical aid, and shared cosmic wonder across star systems",
        "Conquering neighboring alien planets for resource extraction",
        "Enforcing strict commercial space tariffs on private cargo shuttles",
      ],
      correctIndex: 0,
      hintSnippet: "dedicated to peaceful diplomacy and shared wonder",
      clueFa: "خط آخر رو ببین؛ دیپلماسی صلح‌آمیز، امداد و به اشتراک گذاشتن شگفتی‌های کیهان با تمام تمدن‌ها!",
    },
    choiceA: {
      labelEn: "Lead the star fleet flagship out of lunar orbit toward the Orion Nebula!",
      labelFa: "کشتی پرچمدار ناوگان را از مدار ماه به سوی سحابی باصلابت جبار هدایت کن!",
      descriptionFa: "آغاز بزرگ‌ترین حماسه دریانوردی فضایی تاریخ بشر.",
    },
    choiceB: {
      labelEn: "Salute the departing ships from the observation deck alongside Commander Yvaine!",
      labelFa: "در کنار فرمانده ایوین به فضاپیماهای در حال خروج با افتخار ادای احترام کن!",
      descriptionFa: "غرور دیدن نسلی که گام در راه بی‌انتهای کهکشان نهاده‌اند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The Global Conservatory of Cosmic Harmony opened in Florence, Vienna, and Kyoto. Musicians mastered the translation of black hole event horizon chords into terrestrial orchestral instruments. Concert halls were filled nightly with audiences moved to serene tears by melodies that originated from the heart of cosmic gravity.",
    keywords: [
      { word: "conservatory", meaningFa: "هنرستان عالی موسیقی و آکادمی هنرهای صوتی", phonetic: "/kənˈsɜːvətri/" },
      { word: "orchestral", meaningFa: "ارکسترال، نواخته‌شده با ارکستر سمفونیک بزرگ", phonetic: "/ɔːˈkestrəl/" },
      { word: "serene", meaningFa: "آرام، بی‌دغدغه و سرشار از وقار معنوی", phonetic: "/səˈriːn/" },
      { word: "melodies", meaningFa: "ملودی‌ها، نغمه‌ها و آهنگ‌های دلنشین", phonetic: "/ˈmelədiz/" },
    ],
    question: {
      promptEn: "What unique source inspired the melodies performed in the new global conservatories?",
      promptFa: "نغمه‌های اجراشده در هنرستان‌های جهانی جدید از چه منبع شگفت‌انگیزی الهام گرفته بود؟",
      options: [
        "Translations of black hole event horizon chords and cosmic gravity waveforms",
        "Traditional military drum marches from ancient empires",
        "Electronic synthesized dance rhythms generated by computer algorithms",
      ],
      correctIndex: 0,
      hintSnippet: "Musicians mastered the translation of black hole event horizon chords into terrestrial orchestral instruments",
      clueFa: "خط دوم رو ببین؛ ترجمه آکوردهای افق رویداد سیاه‌چاله‌ها و امواج گرانش کیهان به سازهای ارکسترال بود!",
    },
    choiceA: {
      labelEn: "Conduct the first Cosmic Symphony at the Vienna State Opera House to roaring ovations!",
      labelFa: "اولین سمفونی کیهانی را در تالار اپرای دولتی وین با شکوه تمام رهبری کن!",
      descriptionFa: "طنین زیباترین موسیقی تاریخ خلقت در کهن‌ترین تالار موسیقی جهان.",
    },
    choiceB: {
      labelEn: "Listen quietly to the cello solo echoing in the courtyard of Florence at dusk!",
      labelFa: "در گرگ‌ومیش حیاط تاریخی فلورانس به تک‌نوازی آرام چلو گوش فرا بده!",
      descriptionFa: "لحظه‌ای عرفانی و شاعرانه میان آسمان و هنر انسان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The broadcast of cosmic symphonies toward the Trappist-1 system received a reply four months later: a series of harmonized photonic laser pulses confirming contact. The alien civilization had recognized the melody, returning a sequence of musical answers that laid the foundation for the first interstellar cultural dialogue.",
    keywords: [
      { word: "photonic", meaningFa: "فوتونیک، مبتنی بر ذرات نور و امواج نوری لیزری", phonetic: "/fəʊˈtɒnɪk/" },
      { word: "dialogue", meaningFa: "گفت‌وگو، تبادل اندیشه و پیام دوطرفه", phonetic: "/ˈdaɪəlɒɡ/" },
      { word: "confirming", meaningFa: "تاییدکننده، تصدیق‌کننده دریافت پیام", phonetic: "/kənˈfɜːmɪŋ/" },
      { word: "sequence", meaningFa: "توالی، زنجیره منظم و پیاپی پالس‌ها", phonetic: "/ˈsiːkwəns/" },
    ],
    question: {
      promptEn: "How did the alien civilization of Trappist-1 respond to Earth's musical transmission?",
      promptFa: "تمدن فرازمینی ترپیست-۱ چه واکنشی به پیام موسیقی ارسالی زمین نشان داد؟",
      options: [
        "A series of harmonized photonic laser pulses establishing a musical cultural dialogue",
        "A fleet of warships dispatched to quarantine the solar system",
        "Complete radio silence and jamming of frequencies",
      ],
      correctIndex: 0,
      hintSnippet: "returning a sequence of musical answers that laid the foundation for the first interstellar cultural dialogue",
      clueFa: "خط دوم و سوم رو نگاه کن؛ با پالس‌های هماهنگ نوری پاسخ دادند و اولین گفت‌وگوی فرهنگی بر بستر موسیقی را آغاز کردند!",
    },
    choiceA: {
      labelEn: "Decode the first musical message from Trappist-1 with the international linguistics team!",
      labelFa: "اولین پیام منظومه ترپیست-۱ را با تیم بین‌المللی زبان‌شناسان رمزگشایی کن!",
      descriptionFa: "خواندن نخستین کلمات ارسال‌شده از سوی ساکنان سیاره‌ای دیگر.",
    },
    choiceB: {
      labelEn: "Raise a toast under the night sky celebrating humanity's new cosmic friends!",
      labelFa: "زیر آسمان شب جامی به سلامتی دوستان جدید کیهانی بشریت بالا ببر!",
      descriptionFa: "احساس رهایی از تنهایی در گستره بی‌پایان کائنات.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The golden monument bearing Aethel’s revelation was unveiled in the General Assembly Hall in New York: 'Consciousness is the eyes through which the cosmos marvels at its own beauty.' World leaders touched the warm golden plaque, pledging that humanity's newfound technological might would forever serve empathy, art, and enlightenment.",
    keywords: [
      { word: "plaque", meaningFa: "لوح یادبود، کتیبه طلایی حکاکی‌شده", phonetic: "/plɑːk/" },
      { word: "unveiled", meaningFa: "رونمایی شد، از پرده برون آمد", phonetic: "/ʌnˈveɪld/" },
      { word: "enlightenment", meaningFa: "روشنگری، بیداری فکری و معنوی انسان", phonetic: "/ɪnˈlaɪtnmənt/" },
      { word: "newfound", meaningFa: "تازه‌یافته، تازه به دست آمده", phonetic: "/ˈnjuːfaʊnd/" },
    ],
    question: {
      promptEn: "What sacred pledge did world leaders take upon touching the golden monument?",
      promptFa: "رهبران جهان با لمس لوح یادبود طلایی چه عهد مقدسی بستند؟",
      options: [
        "That technological power would forever serve empathy, art, and enlightenment",
        "That they would monopolize interstellar energy for private corporations",
        "That they would censor all future deep-space discoveries",
      ],
      correctIndex: 0,
      hintSnippet: "pledging that humanity's newfound technological might would forever serve empathy, art, and enlightenment",
      clueFa: "خط آخر رو ببین؛ عهد بستند که قدرت علمی نوین بشر تا ابد در خدمت همدلی، هنر و روشنگری معنوی قرار گیرد!",
    },
    choiceA: {
      labelEn: "Sign the charter of Enlightenment alongside leaders of every sovereign nation!",
      labelFa: "منشور روشنگری را در کنار سران تمام کشورهای جهان امضا کن!",
      descriptionFa: "امضای سندی تاریخی که آغاز عصر طلایی صلح پایدار بر زمین است.",
    },
    choiceB: {
      labelEn: "Walk through the quiet gardens of the East River in deep, serene gratitude!",
      labelFa: "در باغ‌های آرام رودخانه شرقی نیویورک با سپاسگزاری و آرامش قدم بزن!",
      descriptionFa: "پایانی باوقار، متین و سرشار از آسودگی خاطر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The 'Manifesto of Cosmic Humanism' became the guiding philosophy of the twenty-first century, translated into every human tongue. Reconciling science with compassion, the text inspired millions of young students to view themselves not as isolated competitors, but as cherished custodians of the universe's awakening intellect.",
    keywords: [
      { word: "manifesto", meaningFa: "بیانیه، مانیفست و مرام‌نامه بنیادین فکری", phonetic: "/ˌmænɪˈfestəʊ/" },
      { word: "reconciling", meaningFa: "آشتی دادن، پیوند دادن مسالمت‌آمیز میان دو اندیشه", phonetic: "/ˈrekənsaɪlɪŋ/" },
      { word: "custodians", meaningFa: "نگهبانان، امانت‌داران حیات و خرد در کیهان", phonetic: "/kʌˈstəʊdiənz/" },
      { word: "compassion", meaningFa: "شفقت، مهرورزی و دلسوزی عمیق برای همنوع", phonetic: "/kəmˈpæʃn/" },
    ],
    question: {
      promptEn: "How did the Manifesto of Cosmic Humanism reshape the perspective of young students worldwide?",
      promptFa: "مانیفست اومانیسم کیهانی چگونه نگاه نسل جوان جهان را بازتعریف کرد؟",
      options: [
        "They viewed themselves not as isolated competitors, but as cherished custodians of awakening cosmic intellect",
        "They abandoned scientific inquiry to pursue extreme ascetic hermeticism",
        "They resolved to compete ruthlessly for remaining mineral resources",
      ],
      correctIndex: 0,
      hintSnippet: "to view themselves not as isolated competitors, but as cherished custodians of the universe's awakening intellect",
      clueFa: "خط آخر رو نگاه کن دوست من؛ به جای رقابت کورکورانه، خود را امانت‌داران عزیز و نگهبانان بیداری خرد در کائنات دانستند!",
    },
    choiceA: {
      labelEn: "Deliver the inaugural lecture of Cosmic Humanism at the Sorbonne in Paris!",
      labelFa: "نخستین درس‌گفتار اومانیسم کیهانی را در دانشگاه سوربن پاریس تدریس کن!",
      descriptionFa: "شکوفایی بزرگ‌ترین نهضت فکری تاریخ در مهد فلسفه جهان.",
    },
    choiceB: {
      labelEn: "Sign presentation copies of the manifesto for eager high school students!",
      labelFa: "نسخه‌های کتابچه را برای دانش‌آموزان پرشور دبیرستانی با لبخند امضا کن!",
      descriptionFa: "سپردن مشعل مهر و آگاهی به دستان نسل آینده‌ساز زمین.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The research vessel *Prometheus IV* docked at the orbital rings of Earth to thunderous global acclaim. Millions lined the observation decks and parks of Earth, gazing up through telescopes as Commander Yvaine and Dr. Kian stepped forward, flanked by the luminous form of Aethel. Humanity stood hand in hand with the stars, united in eternal wonder.",
    keywords: [
      { word: "acclaim", meaningFa: "تحسین همگانی، هلهله و استقبال پرشور", phonetic: "/əˈkleɪm/" },
      { word: "docked", meaningFa: "پهلو گرفت، به ایستگاه فضایی متصل شد", phonetic: "/dɒkt/" },
      { word: "flanked", meaningFa: "احاطه‌شده در طرفین، همراهی‌شده در کنار هم", phonetic: "/flæŋkt/" },
      { word: "rings", meaningFa: "حلقه‌های مداری سکونتگاهی به دور کره زمین", phonetic: "/rɪŋz/" },
    ],
    question: {
      promptEn: "Who accompanied Kian and Yvaine as they stepped onto the orbital dock of Earth?",
      promptFa: "چه کسی در کنار کیان و ایوین هنگام ورود به ایستگاه مداری زمین حضور داشت؟",
      options: [
        "The luminous, benevolent form of the Galactic Envoy Aethel",
        "A squad of armed lunar security commandos",
        "An automated diplomatic protocol drone",
      ],
      correctIndex: 0,
      hintSnippet: "flanked by the luminous form of Aethel. Humanity stood hand in hand with the stars",
      clueFa: "خط سوم رو ببین؛ فرم نورانی و مهربان نماینده کهکشان، 'ایتل'، در کنارشان بود و بشریت دست در دست ستارگان نهاد!",
    },
    choiceA: {
      labelEn: "Wave to the cheering millions across Earth from the panoramic orbital balcony!",
      labelFa: "از بالکن پانورامای ایستگاه مداری به میلیون‌ها انسان خندان در زمین دست تکان بده!",
      descriptionFa: "اوج افتخار، پیوند و شادمانی تمدن بشر بر فراز سیاره مادری.",
    },
    choiceB: {
      labelEn: "Embrace Yvaine in silent, profound joy as the dawn sunlight bathes the station!",
      labelFa: "ایوین را در آغوش بگیر در حالی که آفتاب طلایی سپیده‌دم ایستگاه را غرق نور می‌کند!",
      descriptionFa: "پایان شاهکار علمی-تخیلی با گرمای عشق و رفاقت واقعی انسان‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Broadcasting from the observation blister of *Prometheus IV*, Kian, Yvaine, and Aethel spoke in unison across planetary channels: 'To every child who ever gazed at the night sky and dreamed: the stars are not distant cold fires. They are waiting for you. Welcome to the cosmic family.' On Earth below, eight billion hearts beat as one, looking up into a future without limits.",
    keywords: [
      { word: "unison", meaningFa: "یکصدا، با بیانی کاملاً هماهنگ و یکدل", phonetic: "/ˈjuːnɪsn/" },
      { word: "channels", meaningFa: "کانال‌های ارتباطی و شبکه‌های رادیویی-تلویزیونی", phonetic: "/ˈtʃænlz/" },
      { word: "blister", meaningFa: "پنجره گنبدی رصدخانه فضاپیما", phonetic: "/ˈblɪstə(r)/" },
      { word: "infinite", meaningFa: "نامتناهی، بی‌پایان و بی‌کران", phonetic: "/ˈɪnfɪnət/" },
    ],
    question: {
      promptEn: "What inspiring closing words did the trio broadcast to the eight billion people of Earth?",
      promptFa: "این جمع سه‌نفره چه پیام پایانی الهام‌بخشی برای هشت میلیارد انسان در زمین مخابره کردند؟",
      options: [
        "'The stars are not distant cold fires. They are waiting for you. Welcome to the cosmic family.'",
        "'Prepare for interstellar taxes to fund the star fleet'",
        "'Lock your doors and extinguish all surface lights after twilight'",
      ],
      correctIndex: 0,
      hintSnippet: "'To every child who ever gazed at the night sky and dreamed: the stars are not distant cold fires. They are waiting for you. Welcome to the cosmic family.'",
      clueFa: "خط دوم و سوم رو نگاه کن؛ گفتند: 'ستارگان آتش‌های سرد و دوردست نیستند؛ آنها منتظر شما هستند. به خانواده بزرگ کیهان خوش آمدید!'",
    },
    choiceA: {
      labelEn: "Step into the starlight hand in hand, ready for the eternal voyage of discovery!",
      labelFa: "دست در دست هم به سوی نور ستارگان گام بردارید؛ آماده برای سفر ابدی کشف و دانایی!",
      descriptionFa: "پایانی حماسی، اشک‌انگیز و جاودانه در قلب کائنات.",
    },
    choiceB: {
      labelEn: "Smile into the quiet void of space, feeling the eternal rhythm of the living cosmos!",
      labelFa: "به پهنه آرام فضا لبخند بزن و ضربان نبض زندگانی کائنات را در جانت حس کن!",
      descriptionFa: "پایان رویایی ماجرای ابر اورت؛ وصال انسان با راز بزرگ هستی.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Emerald Valleys of Mars", titleFa: "دره‌های زمردین مریخ", badgeCategory: "legendary", badgeIcon: "🪐", badgeNameFa: "پایان فتح سیاره سرخ", climaxEn: "Under a warm blue sky, millions of human families thrive in verdant Martian forests, making humanity a two-world species in peace.", climaxFa: "زیر آسمان آبی مریخ، میلیون‌ها خانواده در جنگل‌های سرسبز به آرامش رسیدند؛ تمدنی دوسیره که در صلح جاودانه شد.", xpReward: 300 },
  { pathCode: "AAAAB", titleEn: "The Olympus Mountain Springs", titleFa: "چشمه‌های گوارای کوه المپوس", badgeCategory: "heroic", badgeIcon: "🏔️", badgeNameFa: "پایان پیروزی بزرگ", climaxEn: "Drinking pure spring water upon Mount Olympus, two explorers watch twin moons rise over a healed and blooming planet.", climaxFa: "با نوشیدن آب زلال چشمه‌ها بر فراز کوه المپوس، دو کاشف طلوع دو ماه را بر فراز سیاره‌ای شکوفا به نظاره نشستند.", xpReward: 290 },
  { pathCode: "AAABA", titleEn: "The Shackleton Lunar Vault", titleFa: "خزانه ابدی حیات در ماه", badgeCategory: "scholar", badgeIcon: "🌕", badgeNameFa: "پایان بقای جاودان", climaxEn: "Thirty thousand genetic templates rest deep inside lunar basalt, guaranteeing the eternal survival of terrestrial and cosmic life.", climaxFa: "سی هزار الگوی ژنتیکی در اعماق سنگ بستر ماه پلمب شدند تا بقای جاودانه حیات را در برابر هر خطری بیمه کنند.", xpReward: 295 },
  { pathCode: "AAABB", titleEn: "The Earthrise of Peace", titleFa: "طلوع زمین نیلگون در افق ماه", badgeCategory: "legendary", badgeIcon: "🌍", badgeNameFa: "پایان آرامش کیهانی", climaxEn: "Looking at Earth rising in pristine blue majesty over the Moon, scientists feel the timeless peace of a mission accomplished.", climaxFa: "با تماشای طلوع باشکوه زمین نیلگون بر فراز ماه، دانشمندان آرامش ابدی ماموریتی انجام‌یافته را حس کردند.", xpReward: 290 },
  { pathCode: "AABAA", titleEn: "The Maiden Warp to Alpha Centauri", titleFa: "اولین جهش وارپ به آلفا قنطورس", badgeCategory: "legendary", badgeIcon: "🚀", badgeNameFa: "پایان شکست مرزهای فضا", climaxEn: "Crossing four light-years in twenty minutes, humanity steps out of its cradle to orbit the paradise worlds of twin suns.", climaxFa: "با پیمودن چهار سال نوری در بیست دقیقه، بشریت از گهواره خاکی پای بیرون نهاد و به مدار سیارات بهشتی رسید.", xpReward: 300 },
  { pathCode: "AABAB", titleEn: "The Twin Suns of Centauri", titleFa: "غروب دو خورشید طلایی", badgeCategory: "explorer", badgeIcon: "☀️", badgeNameFa: "پایان کشف افق‌های نو", climaxEn: "Gazing at the turquoise oceans of an alien world bathed in the light of two suns, explorers celebrate the dawn of the interstellar age.", climaxFa: "با تماشای اقیانوس‌های فیروزه‌ای دنیایی تازه زیر نور دو خورشید، کاشفان آغاز عصر میان‌ستاره‌ای را جشن گرفتند.", xpReward: 295 },
  { pathCode: "AABBA", titleEn: "The Interstellar Peace Charter", titleFa: "منشور صلح میان‌ستاره‌ای", badgeCategory: "heroic", badgeIcon: "📜", badgeNameFa: "پایان پیمان کهکشان", climaxEn: "Automatic treaty buoys safeguard sixty star systems, establishing the first demilitarized trade and cultural highway in the galaxy.", climaxFa: "بویه‌های خودکار ۶۰ منظومه ستاره‌ای را محافظت کردند و اولین بزرگراه فرهنگی و بدون سلاح کهکشان را بنا نهادند.", xpReward: 295 },
  { pathCode: "AABBB", titleEn: "The Maiden Fleet of Poets", titleFa: "ناوگان پیام‌آوران شعر و هنر", badgeCategory: "scholar", badgeIcon: "🎶", badgeNameFa: "پایان فرهنگ و انسانیت", climaxEn: "Humanity's first interstellar merchant fleet enters warp space, carrying poetry, philosophy, and music to peaceful alien worlds.", climaxFa: "اولین ناوگان فضایی بشر با کوله‌باری از شعر، فلسفه و موسیقی وارد فضای وارپ شد تا دل‌های کهکشان را فتح کند.", xpReward: 290 },
  { pathCode: "ABAAA", titleEn: "The Eternal City of Elysium Nova", titleFa: "شهر جاودانه الیسیوم نووا", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان تمدن نامیرا", climaxEn: "Inside the sanctuary dimension, millions thrive in the eternal city of Elysium Nova, exploring art and love without death or sorrow.", climaxFa: "درون جهان پناهگاه، میلیون‌ها انسان در شهر جاودان الیسیوم به خلق هنر و عشق بدون مرگ و اندوه پرداختند.", xpReward: 300 },
  { pathCode: "ABAAB", titleEn: "The Threshold of Starlight", titleFa: "آستانه نور در جهان نوزاد", badgeCategory: "scholar", badgeIcon: "✨", badgeNameFa: "پایان آرامش ابدی", climaxEn: "Hand in hand, two explorers watch the dimensional gateway hum in golden resonance, knowing humanity's survival is forever sealed.", climaxFa: "دست در دست هم، دو کاشف طنین طلایی درگاه را تماشا کردند؛ با این اطمینان که بقای انسان برای همیشه مهر تایید خورد.", xpReward: 290 },
  { pathCode: "ABABA", titleEn: "The Unified Theory of Existence", titleFa: "نظریه وحدت وجود کیهانی", badgeCategory: "scholar", badgeIcon: "📐", badgeNameFa: "پایان فتح قله‌های فیزیک", climaxEn: "The Unified Theory of Quantum Gravitation is published across Earth, solving the deepest cosmological questions of all time.", climaxFa: "نظریه وحدت گرانش کوانتومی در زمین منتشر شد و ژرف‌ترین معماهای کیهان‌شناسی تاریخ را برای همیشه گشود.", xpReward: 295 },
  { pathCode: "ABABB", titleEn: "The Starlight Amphitheater", titleFa: "تماشاخانه نور در قلب ابدیت", badgeCategory: "scholar", badgeIcon: "🎭", badgeNameFa: "پایان شعر و دانایی", climaxEn: "Scholars in the sanctuary universe compose epic verses under alien constellations, illuminating the infinite wonder of the mind.", climaxFa: "اندیشمندان در جهان پناهگاه زیر صور فلکی تازه به سرودن شعر نشستند و شگفتی بیکران ذهن انسان را ستودند.", xpReward: 285 },
  { pathCode: "ABBAA", titleEn: "The Toast of the UN Assembly", titleFa: "سلامتی اشرافی در مجمع عمومی", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان صلح فراگیر زمین", climaxEn: "Two million citizens outside the United Nations rejoice as the message from the Oort Cloud brings an end to global fear forever.", climaxFa: "دو میلیون شهروند در نیویورک غرق در اشک شوق شدند؛ پیامی از ابر اورت که ترس و کمبود را برای همیشه پایان داد.", xpReward: 295 },
  { pathCode: "ABBAB", titleEn: "The Azure Jewel of the Stars", titleFa: "گوهر فیروزه‌ای در دل مخمل سیاه", badgeCategory: "legendary", badgeIcon: "💎", badgeNameFa: "پایان زیبایی آسمانی", climaxEn: "Looking at Earth shining like an azure gem against the velvet void, explorers toast the triumphant resilience of human compassion.", climaxFa: "با تماشای زمین که چون نگین فیروزه‌ای در سیاهی کیهان می‌درخشید، کاشفان به پایمردی و مهربانی انسان درود فرستادند.", xpReward: 290 },
  { pathCode: "ABBBA", titleEn: "The Launch of the United Fleet", titleFa: "پرواز ناوگان متحد زمین به سوی جبار", badgeCategory: "heroic", badgeIcon: "🛸", badgeNameFa: "پایان شکوه دریانوردی فضایی", climaxEn: "Two hundred science cruisers set sail toward the Orion Nebula, carrying the flag of the Blue Marble into peaceful eternity.", climaxFa: "دویست رزم‌ناو علمی به سوی سحابی جبار بادبان کشیدند؛ پرچم آبی زمین را به اعماق کهکشان به ارمغان بردند.", xpReward: 295 },
  { pathCode: "ABBBB", titleEn: "The Lunar Balcony Salute", titleFa: "احترام نظامی بر فراز مدار ماه", badgeCategory: "scholar", badgeIcon: "🫡", badgeNameFa: "پایان افتخار و شجاعت", climaxEn: "Watching the armada disappear into starlight, Commander Yvaine and Dr. Kian salute a new era of courage and shared wonder.", climaxFa: "با تماشای محو شدن ناوگان در نور ستارگان، فرمانده ایوین و دکتر کیان به عصری تازه از شجاعت و شگفتی درود فرستادند.", xpReward: 290 },
  { pathCode: "BAAAA", titleEn: "The Vienna Event Horizon Symphony", titleFa: "سمفونی افق رویداد در اپرای وین", badgeCategory: "scholar", badgeIcon: "🎻", badgeNameFa: "پایان هارمونی کیهانی", climaxEn: "The Vienna State Opera House roars with standing ovations as gravitational wave symphonies bring serene tears to the audience.", climaxFa: "تالار اپرای وین با تشویق‌های ایستاده منفجر شد؛ سمفونی امواج گرانشی اشک آرامش و شوق را بر گونه‌ها نشاند.", xpReward: 295 },
  { pathCode: "BAAAB", titleEn: "The Twilight Cello of Florence", titleFa: "تک‌نوازی چلو در شامگاه فلورانس", badgeCategory: "scholar", badgeIcon: "🎼", badgeNameFa: "پایان آرامش هنر", climaxEn: "A single cello echoes black hole harmonics in a Florentine courtyard, connecting human hearts with the heartbeat of the cosmos.", climaxFa: "طنین ملودی‌های سیاه‌چاله از یک ساز چلو در حیاط تاریخی فلورانس پیچید و دل انسان را به ضربان قلب کیهان پیوند زد.", xpReward: 285 },
  { pathCode: "BAABA", titleEn: "The Trappist-1 First Contact", titleFa: "تماس تاریخی با منظومه ترپیست-۱", badgeCategory: "legendary", badgeIcon: "📡", badgeNameFa: "پایان گفت‌وگوی تمدن‌ها", climaxEn: "Photonic laser pulses from Trappist-1 return the melody, inaugurating the first harmonious cultural dialogue across stars.", climaxFa: "پالس‌های نوری لیزر از ترپیست-۱ ملودی را پاسخ دادند و اولین گفت‌وگوی فرهنگی بر بستر موسیقی را در کهکشان کلید زدند.", xpReward: 300 },
  { pathCode: "BAABB", titleEn: "The Toast to the Cosmic Kin", titleFa: "سلامتی به خویشاوندان آسمانی", badgeCategory: "heroic", badgeIcon: "🌌", badgeNameFa: "پایان پایان تنهایی بشر", climaxEn: "Sipping wine beneath starlight, explorers rejoice that humanity is no longer alone in the grand cosmic tapestry.", climaxFa: "با نوشیدن جامی زیر نور ستارگان، کاشفان شادمان شدند که بشر دیگر در بافت باشکوه کائنات تنها و بی‌یار نیست.", xpReward: 290 },
  { pathCode: "BABAA", titleEn: "The Extinguished Fires of Industry", titleFa: "خاموشی آخرین دودکش آلاینده زمین", badgeCategory: "heroic", badgeIcon: "🏭", badgeNameFa: "پایان پیروزی محیط زیست", climaxEn: "Earth celebrates as the final coal plant is shut down forever, replaced by clean quantum tachyon fusion micro-suns.", climaxFa: "مردم زمین خاموشی ابدی آخرین نیروگاه زغال‌سنگ را جشن گرفتند؛ جایگزین‌شده با خورشیدهای پاک تاکیونی.", xpReward: 295 },
  { pathCode: "BABAB", titleEn: "The Rebirth of the Arctic Ice", titleFa: "تولد دوباره یخچال‌های سپید قطب", badgeCategory: "scholar", badgeIcon: "❄️", badgeNameFa: "پایان شفای سیاره زمین", climaxEn: "Atmospheric quantum scrubbers heal the ozone and restore the Arctic glaciers, returning crystalline purity to the biosphere.", climaxFa: "تصفیه‌کننده‌های کوانتومی لایه ازون و یخچال‌های قطبی را بازسازی کردند و خلوص بلورین را به زمین هدیه دادند.", xpReward: 290 },
  { pathCode: "BBAAA", titleEn: "The Golden Plaque of Enlightenment", titleFa: "لوح طلایی آگاهی در سازمان ملل", badgeCategory: "legendary", badgeIcon: "🥇", badgeNameFa: "پایان حکمت و وحدت بشر", climaxEn: "World leaders pledge at the golden monument that technology will forever serve empathy, turning human intellect toward peace.", climaxFa: "سران جهان در برابر لوح طلایی سوگند یاد کردند که دانش بشری تا ابد در خدمت مهر و صلح و روشنگری قرار گیرد.", xpReward: 295 },
  { pathCode: "BBAAB", titleEn: "The Stroll Along the East River", titleFa: "قدم زدن در کنار رودخانه آرام", badgeCategory: "scholar", badgeIcon: "🌊", badgeNameFa: "پایان متانت و شکرگزاری", climaxEn: "Walking beneath golden autumn leaves beside the river, two scientists feel the sublime quiet of a world healed by wisdom.", climaxFa: "با قدم زدن زیر برگ‌های طلایی پاییزی کنار رودخانه، دو دانشمند آرامش والای دنیایی شفا‌یافته را حس کردند.", xpReward: 285 },
  { pathCode: "BBBAA", titleEn: "The Sorbonne Manifesto of Mind", titleFa: "خطابه اومانیسم کیهانی در سوربن", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان رنسانس فلسفه", climaxEn: "The Manifesto of Cosmic Humanism inspires millions of students, establishing that conscious life is the sacred crown of the universe.", climaxFa: "بیانیه اومانیسم کیهانی میلیون‌ها دانشجو را به وجد آورد؛ با این باور که حیات آگاه تاج مقدس پادشاهی کائنات است.", xpReward: 290 },
  { pathCode: "BBBAB", titleEn: "The Autographs of Hope", titleFa: "امضای امید در دفتر دانش‌آموزان", badgeCategory: "funny", badgeIcon: "✍️", badgeNameFa: "پایان صمیمی و پرشور", climaxEn: "Smiling students surround the explorers in Paris, holding copies of the manifesto that gave them a boundless cosmic future.", climaxFa: "دانش‌آموزان خندان در پاریس کاشفان را در میان گرفتند و کتابچه‌هایی را به دست داشتند که آینده‌ای بی‌پایان به آنان بخشیده بود.", xpReward: 280 },
  { pathCode: "BBBBA", titleEn: "The Triumphant Orbital Embrace", titleFa: "آغوش پیروزی در ایستگاه مداری", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان پیوند با ستارگان", climaxEn: "Flanked by the Galactic Envoy Aethel, the crew of Prometheus IV receives the gratitude of eight billion human hearts.", climaxFa: "در کنار فرستاده کهکشان ایتل، خدمه پرومتئوس سپاس و عشق هشت میلیارد قلب تپنده انسان را دریافت کردند.", xpReward: 300 },
  { pathCode: "BBBBB", titleEn: "The Welcome to the Cosmic Family", titleFa: "خوش‌آمد به خانواده بزرگ کیهان", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان آسمانی و جاودانه", climaxEn: "'The stars are not distant cold fires; they are waiting for you.' Humanity steps together into an infinite, loving future.", climaxFa: "'ستارگان آتش‌های سرد و دوردست نیستند؛ آنها منتظر شمایند.' بشریت دست در دست هم به سوی آینده‌ای بیکران و پرمهر گام نهاد.", xpReward: 300 },
];

export const story4OortCloud: AdventureStory = buildAdventureStory({
  id: "c2-oort-cloud-singularity",
  storyIndex: 4,
  cefr: "C2",
  titleEn: "The Oort Cloud Singularity",
  titleFa: "پژوهش کوانتومی در ابر اورت",
  genre: "scifi",
  genreLabelFa: "🚀 فانتزی و علمی‌تخیلی",
  genreIcon: "🚀",
  synopsisEn:
    "At the extreme outer perimeter of the solar system, five thousand astronomical units from the Sun, Dr. Kian Bennett and Commander Yvaine Cross pilot research vessel *Prometheus IV* to investigate a dormant crystalline Dyson artifact emitting harmonic tachyon frequencies across 32 cosmic and philosophical endings.",
  synopsisFa:
    "در دورافتاده‌ترین مرز منظومه شمسی و در فاصله ۵۰۰۰ واحد نجومی از خورشید، دکتر کیان بنت (اخترفیزیکدان کوانتومی) و فرمانده ایوین کراس با فضاپیمای تحقیقاتی پرومتئوس به سراغ یک سازه بلورین و خاموش متعلق به تمدنی مافوق‌پیشرفته می‌روند که امواج موزون تاکیونی ساطع می‌کند! ۳۲ پایان پر از شکوه کیهانی، فیزیک نظری سطح بالا و تصمیمات فلسفی تکان‌دهنده پیش روی شماست!",
  coverImage: "/images/skills/reading/c2-oort-cloud.webp",
  nodes,
  endings,
});
