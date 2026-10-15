import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4 (C1 - Adult): The Europa Quantum Resonance (پژواک کوانتومی در مدار قمر اروپا)
// Genre: Sci-Fi & Fantasy (فانتزی و علمی‌تخیلی)
// CEFR: C1 (Inversion with negative adverbials, mixed conditionals, quantum deduction, hard sci-fi adult drama)
// Characters: Dr. Paul Bennett (Senior Astrophysicist), Maya Lin (Lead Quantum Engineer), Commander Elena Ryan (Orbital Commander)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Hovering four hundred kilometers above Jupiter's moon Europa aboard the orbital research platform 'Archimedes', Dr. Paul Bennett monitored the deep-crust neutrino receiver array. Below them, Europa’s vast ice crust gleamed under the titanic banded face of Jupiter like a cracked eggshell of blue-white marble. For eighteen months, the scientific consortium had detected only static solar wind interference. However, at zero-two-hundred hours, the station's superconducting quantum interference device (SQUID) recorded an impossible phenomenon: an organized electromagnetic harmonic surging through twenty kilometers of solid ice from the subterranean global ocean. Scarcely had Maya Lin, the station’s lead quantum engineer, initiated calibration protocols when the signal shifted into an intricate prime-number Fibonacci sequence. Commander Elena Ryan gripped the telemetry console: 'Had we not angled our superconducting array into the polar rift today, this transmission would have dissipated into the Jovian radiation belt undetected.'",
    keywords: [
      { word: "superconducting", meaningFa: "ابررسانا (انتقال جریان بدون مقاومت الکتریکی در سرمای مطلق)", phonetic: "/ˌsuːpərkənˈdʌktɪŋ/" },
      { word: "subterranean", meaningFa: "زیرسطحی و مدفون در اعماق پوسته", phonetic: "/ˌsʌbtəˈreɪniən/" },
      { word: "Fibonacci", meaningFa: "دنباله ریاضی فیبوناچی که در ساختارهای طبیعی حیات تکرار می‌شود", phonetic: "/ˌfɪbəˈnɑːtʃi/" },
      { word: "dissipated", meaningFa: "پراکنده شد، محو و تلف گشت", phonetic: "/ˈdɪsɪpeɪtɪd/" },
    ],
    question: {
      promptEn: "What mathematical pattern did the subterranean Europa signal shift into upon calibration?",
      promptFa: "سیگنال زیرسطحی قمر اروپا پس از کالیبراسیون به چه الگوی ریاضی مشخصی تبدیل شد؟",
      options: [
        "An intricate prime-number Fibonacci sequence",
        "A random radio burst caused by Jupiter's auroral rings",
        "A standard Morse code navigation ping from an old Earth probe",
      ],
      correctIndex: 0,
      hintSnippet: "the signal shifted into an intricate prime-number Fibonacci sequence",
      clueFa: "خط چهارم رو نگاه کن دوست من؛ سیگنال الگوی منظم اعداد اول و دنباله ریاضی فیبوناچی به خودش گرفت.",
    },
    choiceA: {
      labelEn: "Deploy a high-frequency entangled photon laser to establish a two-way quantum communication handshake!",
      labelFa: "یک پرتو لیزر فوتون‌های درهم‌تنیده با فرکانس بالا بفرست تا ارتباط کوانتومی دوطرفه برقرار شود!",
      descriptionFa: "ارتباط از طریق فیزیک کوانتوم که سرعت نور و مانع ۲۰ کیلومتری یخ را بی‌اثر می‌کند.",
    },
    choiceB: {
      labelEn: "Launch an autonomous nuclear thermal melt-probe directly into the active ice fracture zone!",
      labelFa: "کاوشگر حرارتی با سوخت هسته‌ای را مستقیماً به سمت شکاف فعال یخ پرتاب کن تا به اقیانوس نفوذ کند!",
      descriptionFa: "دستیابی مستقیم به نمونه‌های آب مایع و برقراری تماس در اعماق تاریک اقیانوس.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Maya energized the station's orbital ultraviolet quantum transceiver, aiming the coherent blue photon beam into the heart of the Conamara Chaos fracture. As the entangled photons penetrated the translucent ice sheets, the return echo arrived in less than half a millisecond. What flashed across the observatory monitors was not binary computational data, but a holographic quantum topography: a conscious, bioluminescent neural lattice spanning two thousand square kilometers along the sub-oceanic hydrothermal vents. Paul’s heart hammered against his ribs: they were not merely observing an alien species—they were looking into the colossal, dreaming mind of a living planetary ocean.",
    keywords: [
      { word: "transceiver", meaningFa: "فرستنده-گیرنده یکپارچه امواج و فوتون‌ها", phonetic: "/trænˈsiːvər/" },
      { word: "translucent", meaningFa: "نیمه‌شفاف و عبوردهنده نور", phonetic: "/trænzˈluːsnt/" },
      { word: "bioluminescent", meaningFa: "دارای نور زیستی طبیعی در اعماق تاریک", phonetic: "/ˌbaɪəʊˌluːmɪˈnesnt/" },
      { word: "lattice", meaningFa: "شبکه مشبک عصبی درهم‌تنیده با ساختار هندسی", phonetic: "/ˈlætɪs/" },
    ],
    question: {
      promptEn: "What did the returned quantum holographic echo reveal beneath the ice?",
      promptFa: "پژواک هولوگرافیک کوانتومی چه پدیده‌ای را در زیر یخ‌ها آشکار کرد؟",
      options: [
        "A conscious bioluminescent neural lattice spanning two thousand square kilometers",
        "A metallic fleet of derelict alien battlecruisers",
        "An empty subterranean lake with dormant crystal rocks",
      ],
      correctIndex: 0,
      hintSnippet: "a conscious, bioluminescent neural lattice spanning two thousand square kilometers along the sub-oceanic hydrothermal vents",
      clueFa: "خط سوم رو ببین؛ یک شبکه عصبی هوشمند با نور زیستی به مساحت دو هزار کیلومتر مربع در کنار دهانه‌های آب‌گرمایی.",
    },
    choiceA: {
      labelEn: "Modulate the beam to transmit human music, literature, and mathematical geometry to the entity!",
      labelFa: "پرتو را تنظیم کن تا موسیقی، شاهکارهای ادبی و هندسه بنیادین ریاضی را به این هوش زیستی مخابره کند!",
      descriptionFa: "آغاز دیپلماسی فرهنگی بین‌ستاره‌ای از طریق هنر و هارمونی جهانی.",
    },
    choiceB: {
      labelEn: "Synchronize Archimedes' quantum computer with the neural lattice to initiate direct telepathic processing!",
      labelFa: "ابررایانه کوانتومی ایستگاه را با شبکه عصبی اقیانوس همگام کن تا پردازش مستقیم ذهنی آغاز شود!",
      descriptionFa: "اتصال بی واسطه ذهن رایانه به اقیانوس برای درک رازهای پیدایش کیهان.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "The nuclear-thermal melt-probe 'Nautilus 1' detached from the station's ventral docking bay, plummeting through Europa's vacuum and impacting the designated fissure at five kilometers per second. Activating its high-temperature tungsten-carbide heating nosecone, the probe liquified the freezing nitrogen-methane ice crust at three meters per minute. Eighteen hours later, telemetry screamed with excitement: the probe had breached the bottom of the twenty-kilometer ice shelf, deploying its high-definition sonar and floodlights into the pitch-black waters of the alien ocean.",
    keywords: [
      { word: "ventral", meaningFa: "شکمی، بخش زیرین بدنه فضاپیما", phonetic: "/ˈventrəl/" },
      { word: "nosecone", meaningFa: "دماغه مخروطی مقاوم در برابر حرارت بالا", phonetic: "/ˈnəʊzkəʊn/" },
      { word: "liquified", meaningFa: "ذوب کرد و به مایع تبدیل ساخت", phonetic: "/ˈlɪkwɪfaɪd/" },
      { word: "breached", meaningFa: "شکافت، پوسته را سوراخ کرد و عبور نمود", phonetic: "/briːtʃt/" },
    ],
    question: {
      promptEn: "How thick was the ice shelf that the thermal probe melted through before reaching the ocean?",
      promptFa: "ضخامت پوسته یخی که کاوشگر حرارتی ذوب کرد تا به اقیانوس برسد چقدر بود؟",
      options: [
        "Twenty kilometers of solid ice",
        "Fifty meters of soft slush",
        "One kilometer of volcanic glass",
      ],
      correctIndex: 0,
      hintSnippet: "the probe had breached the bottom of the twenty-kilometer ice shelf, deploying its high-definition sonar",
      clueFa: "خط آخر رو نگاه کن دوست من؛ بیست کیلومتر یخ سخت و متراکم در دمای منفی ۱۷۰ درجه.",
    },
    choiceA: {
      labelEn: "Pilot Nautilus 1 toward a towering cluster of hydrothermal mineral chimneys on the seafloor!",
      labelFa: "کاوشگر را به سمت دودکش‌های عظیم آب‌گرمایی در بستر اقیانوس هدایت کن!",
      descriptionFa: "کشف چشمه‌های جوشان اعماق که زادگاه حیات در اقیانوس بیگانه است.",
    },
    choiceB: {
      labelEn: "Deploy autonomous acoustic hydrophones to record the whale-like harmonic songs filling the ocean depths!",
      labelFa: "میکروفون‌های زیرآبی را برای ضبط نغمه‌های هارمونیک شبه‌نهنگ در اعماق رها کن!",
      descriptionFa: "رمزگشایی از زبان آوازی موجودات غول‌پیکر آبزی قمر اروپا.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "When Maya transmitted Beethoven's Ninth Symphony transposed into optical wave frequencies, the entire surface of Europa responded. Along forty major fracture rifts, ribbons of shimmering amber and turquoise light began glowing through the translucent ice crust, visible to Archimedes’ optical telescopes four hundred kilometers above. The planetary intelligence was not merely listening; it was transposing the musical mathematics into synchronized atmospheric auroras across Europa's tenuous oxygen exosphere. Commander Ryan stared at the viewing dome in tears: 'It understands the concept of beauty.'",
    keywords: [
      { word: "transposed", meaningFa: "تبدیل‌یافته، منتقل‌شده از یک فرم به فرم دیگر", phonetic: "/trænˈspəʊzd/" },
      { word: "auroras", meaningFa: "شفق‌های درخشان نوری در آسمان سیارات", phonetic: "/ɔːˈrɔːrəz/" },
      { word: "exosphere", meaningFa: "لایه بیرونی و بسیار رقیق جو سیاره", phonetic: "/ˈeksəʊsfɪər/" },
      { word: "tenuous", meaningFa: "بسیار رقیق، لطیف و کم‌تراکم", phonetic: "/ˈtenjuəs/" },
    ],
    question: {
      promptEn: "How did the planetary intelligence respond to the transmission of Beethoven's Ninth Symphony?",
      promptFa: "هوش زیستی اقیانوس به ارسال سمفونی نهم بتهوون چه واکنشی نشان داد؟",
      options: [
        "Rifts glowed with amber and turquoise lights, creating synchronized auroras across the sky",
        "It fired a magnetic pulse that disabled the station's communication dish",
        "It remained completely silent and cold",
      ],
      correctIndex: 0,
      hintSnippet: "ribbons of shimmering amber and turquoise light began glowing through the translucent ice crust... transposing the musical mathematics into synchronized atmospheric auroras",
      clueFa: "خط دوم رو ببین؛ شکاف‌های یخ با نورهای کهربایی و فیروزه‌ای روشن شدند و شفق‌های باشکوهی در جو پدید آوردند.",
    },
    choiceA: {
      labelEn: "Transmit humanity's collective scientific archive encoded into harmonic optical chords!",
      labelFa: "کل آرشیو علوم بشری را به صورت آکوردهای هارمونیک نوری برای این موجود بفرست!",
      descriptionFa: "تبادل کامل دانش میان دو گونه متمدن در کمال صلح و خرد.",
    },
    choiceB: {
      labelEn: "Invite the planetary entity to send back its own cosmological historical chronicle!",
      labelFa: "از این هوش سیاره‌ای بخواه تاریخچه پیدایش کیهان و حافظه کهن خود را مخابره کند!",
      descriptionFa: "شنیدن سرگذشت منظومه شمسی از زبان موجودی که میلیاردها سال شاهد آن بوده است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The synchronization between Archimedes’ quantum core and Europa’s bioluminescent neural grid caused the station’s processing speed to accelerate by eight orders of magnitude. The quantum entangled interface bypassed temporal latency entirely. On the main holographic projector, complex topological multidimensional equations began solving themselves: unified field theories connecting quantum mechanics with general relativity that had baffled human physicists for three centuries. Maya breathed softly: 'It's not computing with silicon or code; it's computing with the fabric of spacetime itself.'",
    keywords: [
      { word: "latency", meaningFa: "تاخیر زمانی در ارسال و دریافت داده‌ها", phonetic: "/ˈleɪtənsi/" },
      { word: "topological", meaningFa: "توپولوژیکی، مربوط به هندسه فضایی و تغییر شکل اجسام", phonetic: "/ˌtɒpəˈlɒdʒɪkl/" },
      { word: "spacetime", meaningFa: "فضا-زمان (پیوستار چهاربعدی کیهانی اینشتین)", phonetic: "/ˈspeɪstaɪm/" },
      { word: "orders of magnitude", meaningFa: "مراتب بزرگی (هر مرتبه ده برابر توان قبلی)", phonetic: "/ˈɔːrdərz əv ˈmæɡnɪtjuːd/" },
    ],
    question: {
      promptEn: "What major physics problem did the synchronized quantum connection instantly solve?",
      promptFa: "اتصال کوانتومی همگام‌شده چه معمای بزرگی در فیزیک را در یک لحظه حل کرد؟",
      options: [
        "Unified field theories connecting quantum mechanics with general relativity",
        "The speed of sound inside wooden violins",
        "How to extract fuel from rusty copper coins",
      ],
      correctIndex: 0,
      hintSnippet: "unified field theories connecting quantum mechanics with general relativity that had baffled human physicists for three centuries",
      clueFa: "خط سوم رو نگاه کن؛ نظریه میدان واحد که مکانیک کوانتوم را با نسبیت عام اینشتین پیوند می‌داد.",
    },
    choiceA: {
      labelEn: "Harness the unified field equations to design humanity's first zero-point quantum gravity drive!",
      labelFa: "از معادلات میدان واحد برای طراحی اولین موتور پیشران گرانش کوانتومی بشر استفاده کن!",
      descriptionFa: "انقلابی در سفرهای فضایی که دسترسی به دورترین ستاره‌ها را در چند ساعت ممکن می‌سازد.",
    },
    choiceB: {
      labelEn: "Safeguard the quantum knowledge inside an unhackable diplomatic beacon before transmitting to Earth!",
      labelFa: "این دانش کوانتومی کیهانی را در فرستنده‌ای دیپلماتیک و غیرقابل دستکاری برای زمین ذخیره کن!",
      descriptionFa: "تضمین اینکه این قدرت عظیم علمی فقط در راه صلح و رفاه بشریت به کار رود.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Navigating through fifty atmospheres of hydrostatic pressure, Nautilus 1 reached the abyssal plain. Before the probe's camera lenses stood a breathtaking panorama: three-hundred-meter mineral spires of black sulfide venting shimmering mineral soups into the freezing brine. Gliding gracefully around the volcanic chimneys were translucent, manta-like beings measuring thirty meters across, pulsing with bioluminescent violet mandalas. These magnificent ocean leviathans showed no fear, gently stroking the probe's titanium hull with velvet-like sensory fronds.",
    keywords: [
      { word: "hydrostatic", meaningFa: "هیدرواستاتیک (فشار سنگین ناشی از وزن آب در اعماق)", phonetic: "/ˌhaɪdrəʊˈstætɪk/" },
      { word: "mandalas", meaningFa: "ماندالاها (الگوهای هندسی پیچیده و دوار نوری)", phonetic: "/ˈmændələz/" },
      { word: "leviathans", meaningFa: "لویاتان‌ها، موجودات غول‌پیکر و باابهت اعماق دریا", phonetic: "/ləˈvaɪəθənz/" },
      { word: "fronds", meaningFa: "اندام‌های حسی شاخه‌ای و برگ‌مانند نرم", phonetic: "/frɒndz/" },
    ],
    question: {
      promptEn: "What magnificent organisms did Nautilus 1 encounter around the hydrothermal mineral chimneys?",
      promptFa: "کاوشگر ناتیلوس ۱ در کنار دودکش‌های معدنی با چه موجودات شگفت‌انگیزی روبرو شد؟",
      options: [
        "Translucent manta-like leviathans pulsing with bioluminescent violet mandalas",
        "Schools of mechanical predator fish with laser eyes",
        "Colossal coral reefs made of fossilized diamond",
      ],
      correctIndex: 0,
      hintSnippet: "translucent, manta-like beings measuring thirty meters across, pulsing with bioluminescent violet mandalas",
      clueFa: "خط سوم رو ببین؛ موجوداتی سفره‌ماهی‌مانند به طول ۳۰ متر با الگوهای نوری بنفش درخشان و بسیار مهربان.",
    },
    choiceA: {
      labelEn: "Record a non-intrusive 3D biometric behavioral archive of the Europa ocean leviathans!",
      labelFa: "آرشیو سه‌بعدی و بی‌خطر از رفتارشناسی این نهنگ‌های بیگانه ثبت کن!",
      descriptionFa: "مطالعه علمی بی‌آسیب بر صلح‌آمیزترین موجودات کیهان.",
    },
    choiceB: {
      labelEn: "Sample the hydrothermal chemical broth to understand their biochemical sustenance!",
      labelFa: "از عصاره آب‌گرمایی نمونه‌برداری کن تا سوخت‌وساز و تغذیه شیمیایی آنان را بررسی کنی!",
      descriptionFa: "کشف راز طول عمر هزاران ساله در سرمای تاریک اقیانوس‌های یخ‌زده.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The acoustic hydrophones submerged into the Europan sea picked up a breathtaking choir of resonant frequencies echoing across thousands of kilometers of ocean. Unlike Earth cetaceans, these acoustic songs carried complex mathematical harmonics that encoded information across multiple octaves simultaneously. As Maya applied audio neural decoding, the sounds resolved into an oral astronomical chronicle: a living historical record documenting ancient asteroid bombardments and the cooling of Jupiter's core spanning three billion years.",
    keywords: [
      { word: "cetaceans", meaningFa: "آب‌بازسانان (نهنگ‌ها و دلفین‌های پستاندار اقیانوس)", phonetic: "/sɪˈteɪʃnz/" },
      { word: "octaves", meaningFa: "اکتاوها، زیر و بمی پرده‌های موسیقی", phonetic: "/ˈɒktɪvz/" },
      { word: "chronicle", meaningFa: "سالنامه تاریخی، تاریخچه مدون رویدادها", phonetic: "/ˈkrɒnɪkl/" },
      { word: "bombardments", meaningFa: "بمباران‌های سهمگین شهاب‌سنگی در تاریخ باستان منظومه شمسی", phonetic: "/bɒmˈbɑːrdmənts/" },
    ],
    question: {
      promptEn: "What did the acoustic songs of the Europan ocean encode when decoded by Maya?",
      promptFa: "نغمه‌های صوتی موجودات اقیانوس اروپا پس از رمزگشایی حاوی چه چیزی بود؟",
      options: [
        "A living historical chronicle of asteroid impacts and Jupiter's cooling over three billion years",
        "A distress message calling for military assistance from Mars",
        "An encrypted map showing deposits of uranium on Ganymede",
      ],
      correctIndex: 0,
      hintSnippet: "resolved into an oral astronomical chronicle: a living historical record documenting ancient asteroid bombardments and the cooling of Jupiter's core spanning three billion years",
      clueFa: "خط آخر رو نگاه کن دوست من؛ یک تاریخچه زنده سه میلیارد ساله از برخورد سیارک‌ها و خنک شدن هسته سیاره مشتری.",
    },
    choiceA: {
      labelEn: "Broadcast the three-billion-year Europan chronicle to human universities as a living cosmic history!",
      labelFa: "تاریخچه زنده سه میلیارد ساله اروپا را برای دانشگاه‌های زمین مخابره کن!",
      descriptionFa: "کتاب تاریخ کیهانی که نگاه انسان به گذشته منظومه شمسی را دگرگون می‌کند.",
    },
    choiceB: {
      labelEn: "Compose an answering harmonic chorus using Archimedes' acoustic resonance arrays!",
      labelFa: "با سیستم‌های صوتی ایستگاه پاسخی هارمونیک از صدای امواج زمین بساز و ارسال کن!",
      descriptionFa: "گفتگوی شاعرانه میان اقیانوس‌های دو سیاره در منظومه شمسی.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Responding to the musical transmission of human scientific knowledge, the Europan ocean mind generated a focused tachyon beam that resonated inside Archimedes' quantum storage crystals. The incoming data was staggering: complete blueprints for closed-cycle planetary ecologies, cold-fusion atmospheric scrubbers, and biotechnology that could reverse climate degradation on Earth in less than a decade. Elena Ryan touched Paul's shoulder: 'We came looking for microbes, and we have been handed the keys to humanity's survival.'",
    keywords: [
      { word: "tachyon", meaningFa: "تاکیون (ذرات فرضی سریع‌تر از نور در فیزیک نظری)", phonetic: "/ˈtækiɒn/" },
      { word: "cold-fusion", meaningFa: "همجوشی هسته‌ای سرد (تولید انرژی پاک و نامحدود در دمای اتاق)", phonetic: "/kəʊld ˈfjuːʒn/" },
      { word: "scrubbers", meaningFa: "فیلترها و دستگاه‌های تصفیه گازهای گلخانه‌ای از جو", phonetic: "/ˈskrʌbərz/" },
      { word: "degradation", meaningFa: "تخریب و زوال اقلیمی زمین", phonetic: "/ˌdeɡrəˈdeɪʃn/" },
    ],
    question: {
      promptEn: "What life-saving technology did the Europan entity bestow upon the scientific team?",
      promptFa: "موجود هوشمند اقیانوس چه فناوری‌های حیاتی و نجات‌بخشی را به دانشمندان هدیه داد؟",
      options: [
        "Blueprints for cold-fusion scrubbers that could reverse Earth's climate degradation in a decade",
        "Schematics for planetary laser weapons",
        "A formula to turn lunar dust into diamond jewelry",
      ],
      correctIndex: 0,
      hintSnippet: "complete blueprints for closed-cycle planetary ecologies, cold-fusion atmospheric scrubbers, and biotechnology that could reverse climate degradation on Earth in less than a decade",
      clueFa: "خط دوم رو ببین؛ نقشه‌های همجوشی سرد و فناوری پاک‌سازی جو زمین که می‌تواند در ده سال گرمایش زمین را درمان کند.",
    },
    choiceA: {
      labelEn: "Dispatch the ecological blueprints to the United Nations General Assembly via quantum link!",
      labelFa: "نقشه‌های نجات اقلیم را از طریق خط کوانتومی برای مجمع عمومی سازمان ملل بفرست!",
      descriptionFa: "هدیه‌ای از اعماق فضا برای نجات آینده زمین و ریشه‌کنی بحران‌های آب‌وهوا.",
    },
    choiceB: {
      labelEn: "Construct the first cold-fusion prototype reactor directly aboard Archimedes station!",
      labelFa: "اولین راکتور همجوشی سرد کیهانی را در کارگاه ایستگاه آرشمیدس بساز!",
      descriptionFa: "تامین انرژی پاک و نامحدود برای تبدیل ایستگاه به پایگاه دائمی منظومه مشتری.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The cosmological chronicle transmitted by the ocean entity unfolded on the panoramic monitors: visual memories of the Solar System's violent youth, the formation of the Galilean moons, and the birth of single-celled life in Earth's primeval seas. The entity revealed that it regarded all conscious life as branches of a single cosmic tree, longing for the day when its distant terrestrial kin would build ships to cross the void. Paul and Maya wept quietly, feeling the profound comfort of knowing humanity was never alone in the vast cosmic silence.",
    keywords: [
      { word: "primeval", meaningFa: "کهن، باستانی و مربوط به سپیده‌دم پیدایش زمین", phonetic: "/praɪˈmiːvl/" },
      { word: "kin", meaningFa: "خویشاوند، هم‌تبار و هم‌خون کیهانی", phonetic: "/kɪn/" },
      { word: "profound", meaningFa: "عمیق، شگرف و دگرگون‌کننده روان", phonetic: "/prəˈfaʊnd/" },
      { word: "Galilean", meaningFa: "قمرهای گالیله‌ای (چهار قمر بزرگ سیاره مشتری)", phonetic: "/ˌɡælɪˈliːən/" },
    ],
    question: {
      promptEn: "How did the Europan entity view humanity in its cosmological chronicle?",
      promptFa: "موجود باستانی اقیانوس در خاطرات کیهانی‌اش به بشریت چه دیدگاهی داشت؟",
      options: [
        "As distant terrestrial kin and branches of a single cosmic tree",
        "As dangerous invaders that must be repelled",
        "As primitive creatures devoid of consciousness",
      ],
      correctIndex: 0,
      hintSnippet: "it regarded all conscious life as branches of a single cosmic tree, longing for the day when its distant terrestrial kin would build ships to cross the void",
      clueFa: "خط سوم رو بخون؛ همه حیات هوشمند را شاخه‌های یک درخت واحد کیهانی می‌دانست که مشتاق دیدار خویشاوندان زمینی‌اش بوده است.",
    },
    choiceA: {
      labelEn: "Declare Europa an Open Planetary Embassy for Interstellar Fellowship!",
      labelFa: "قمر اروپا را به عنوان سفارت رسمی بین‌ستاره‌ای برای پیوند تمدن‌ها نام‌گذاری کن!",
      descriptionFa: "آغاز دوران زرین دیپلماسی کیهانی میان انسان‌ها و موجودات فرامرزی.",
    },
    choiceB: {
      labelEn: "Transmit the cosmic chronicle to every radio receiver on Earth as an ode to cosmic brotherhood!",
      labelFa: "این خاطرات کیهانی را برای تمام رادیوهای زمین پخش کن تا نوای برادری جهانی سر داده شود!",
      descriptionFa: "پایان دادن همیشگی به تنهایی انسان در وسعت کهکشان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Integrating the zero-point gravity equations into Archimedes’ auxiliary thrusters, Maya achieved the holy grail of aerospace physics: reactionless propulsion. Without consuming a single gram of chemical propellant, the forty-thousand-ton space station smoothly altered its orbital inclination with zero inertia, floating like a leaf on gravitational ripples. Commander Ryan gripped the helm: with this technology, journeys to Mars would take forty-eight hours, and human exploration could reach Alpha Centauri within a human lifetime.",
    keywords: [
      { word: "reactionless", meaningFa: "بدون پسماند و پیشران بدون نیاز به خروج گاز و سوخت", phonetic: "/riˈækʃnləs/" },
      { word: "propulsion", meaningFa: "پیشرانش و نیروی محرکه فضاپیما", phonetic: "/prəˈpʌlʃn/" },
      { word: "inertia", meaningFa: "لختی، مقاومت جسم در برابر شتاب و تکانه", phonetic: "/ɪˈnɜːrʃə/" },
      { word: "propellant", meaningFa: "ماده پیشران و سوخت موشکی", phonetic: "/prəˈpelənt/" },
    ],
    question: {
      promptEn: "What revolutionary capability did reactionless propulsion provide for human space travel?",
      promptFa: "پیشرانش بدون پسماند چه جهش انقلابی را برای سفرهای فضایی بشر به ارمغان آورد؟",
      options: [
        "Journeys to Mars in forty-eight hours and Alpha Centauri within a human lifetime",
        "Instant teleportation inside black holes",
        "Creating artificial stars in Earth's upper atmosphere",
      ],
      correctIndex: 0,
      hintSnippet: "with this technology, journeys to Mars would take forty-eight hours, and human exploration could reach Alpha Centauri within a human lifetime",
      clueFa: "خط آخر رو نگاه کن؛ سفر به مریخ ظرف ۴۸ ساعت و رسیدن به نزدیک‌ترین ستاره یعنی آلفا قنطورس در طول عمر یک انسان!",
    },
    choiceA: {
      labelEn: "Fly Archimedes on its maiden reactionless voyage to circle Saturn's glorious rings!",
      labelFa: "ایستگاه را در اولین پرواز بدون سوختش به سوی حلقه‌های شکوهمند زحل به پرواز درآور!",
      descriptionFa: "نخستین سفر میان‌سیاره‌ای فوق‌سریع تاریخ بشر.",
    },
    choiceB: {
      labelEn: "Publish the open-source gravity blueprints to liberate humanity from fossil energy forever!",
      labelFa: "نقشه‌های پیشران پاک را متن‌باز منتشر کن تا بشریت برای همیشه از بند سوخت‌های فسیلی رها شود!",
      descriptionFa: "عدالت علمی و فراهم ساختن انرژی نامحدود برای همه ملل زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Encrypted inside a quantum-entangled crystal ledger, the unified field archive was beamed directly to the United Nations Planetary Science Council in Geneva. Verified by a blue-ribbon panel of Nobel laureates, the mathematics proved absolute and irrefutable. World leaders signed the Geneva Accord on Planetary Knowledge, legally guaranteeing that zero-point gravity and subglacial technology would remain common human heritage, dedicated solely to peaceful exploration and planetary healing.",
    keywords: [
      { word: "ledger", meaningFa: "دفتر ثبت اسناد غیرقابل دستکاری و رمزگذاری‌شده", phonetic: "/ˈledʒər/" },
      { word: "blue-ribbon", meaningFa: "تیم سرآمد و متشکل از برترین نخبگان جهان", phonetic: "/bluː ˈrɪbən/" },
      { word: "irrefutable", meaningFa: "انکارناپذیر، خدشه‌ناپذیر و کاملاً اثبات‌شده", phonetic: "/ˌɪrɪˈfjuːtəbl/" },
      { word: "laureates", meaningFa: "برندگان و دارندگان مدال‌های معتبر افتخار", phonetic: "/ˈlɔːriəts/" },
    ],
    question: {
      promptEn: "What did the Geneva Accord on Planetary Knowledge legally guarantee?",
      promptFa: "پیمان ژنو درباره دانش سیاره‌ای چه تضمین حقوقی مهمی داد؟",
      options: [
        "That zero-point technology would remain common human heritage dedicated solely to peaceful exploration",
        "That all space stations must be painted white",
        "That Europa would be annexed as a mining colony",
      ],
      correctIndex: 0,
      hintSnippet: "legally guaranteeing that zero-point gravity and subglacial technology would remain common human heritage, dedicated solely to peaceful exploration",
      clueFa: "خط آخر متن رو ببین دوست من؛ تضمین کرد که این فناوری‌ها به عنوان میراث مشترک بشریت فقط در راه صلح و درمان زمین به کار روند.",
    },
    choiceA: {
      labelEn: "Establish the United Nations Interplanetary Council Headquarters aboard Archimedes Station!",
      labelFa: "ستاد مرکزی شورای بین‌سیاره‌ای سازمان ملل را در ایستگاه آرشمیدس مستقر کن!",
      descriptionFa: "تبدیل قمر اروپا به پایتخت دیپلماسی صلح‌آمیز منظومه شمسی.",
    },
    choiceB: {
      labelEn: "Celebrate the signing of the Geneva Accord with an orbital viewing party over Europa's glowing ice!",
      labelFa: "امضای پیمان ژنو را با جشن تماشای درخشش شفق‌های اروپا از فراز ایستگاه گرامی بدار!",
      descriptionFa: "لحظاتی سرشار از غرور و امید به فردای روشن انسانیت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "The 3D volumetric archive captured by Nautilus 1 recorded the Europan leviathans communicating through bioluminescent patterns that matched the geometry of crystal lattices. The beings possessed an organ capable of manipulating local magnetic fields, allowing them to carve and reshape ice caves without physical contact. The video streams sparked global awe on Earth: millions gathered in city plazas to watch giant gentle beings dancing around hydrothermal geysers five hundred million miles away.",
    keywords: [
      { word: "volumetric", meaningFa: "حجمی، سه‌بعدی و ثبت‌کننده تمام ابعاد فضا", phonetic: "/ˌvɒljʊˈmetrɪk/" },
      { word: "geometry", meaningFa: "هندسه و ساختار خطوط و زوایا", phonetic: "/dʒiˈɒmətri/" },
      { word: "manipulating", meaningFa: "کنترل و هدایت هوشمندانه میدان‌های انرژی", phonetic: "/məˈnɪpjuleɪtɪŋ/" },
      { word: "plazas", meaningFa: "میادین بزرگ شهری", phonetic: "/ˈplɑːzəz/" },
    ],
    question: {
      promptEn: "What remarkable physical ability did the Europan leviathans demonstrate?",
      promptFa: "موجودات غول‌پیکر اروپا چه توانایی فیزیکی شگفت‌انگیزی از خود نشان دادند؟",
      options: [
        "Manipulating local magnetic fields to reshape ice caves without physical contact",
        "Flying through Europa's outer atmosphere into Jupiter's clouds",
        "Shooting streams of boiling magma to hunt smaller fish",
      ],
      correctIndex: 0,
      hintSnippet: "possessed an organ capable of manipulating local magnetic fields, allowing them to carve and reshape ice caves without physical contact",
      clueFa: "خط دوم رو ببین؛ کنترل میدان‌های مغناطیسی به طوری که بدون برخورد فیزیکی غارهای یخی را فرم می‌دادند.",
    },
    choiceA: {
      labelEn: "Formally declare the Europan Ocean an Inviolate Interplanetary Marine Sanctuary!",
      labelFa: "اقیانوس قمر اروپا را به عنوان منطقه حفاظت‌شده دریایی دست‌نخورده اعلام کن!",
      descriptionFa: "حفاظت ابدی از زیستگاه این موجودات باشکوه در برابر هرگونه آلودگی.",
    },
    choiceB: {
      labelEn: "Construct an orbital bio-resonance acoustic observatory to maintain permanent gentle contact!",
      labelFa: "رصدخانه رزونانس صوتی را در مدار برای ارتباط ملایم همیشگی با آنها برپا کن!",
      descriptionFa: "پل ارتباطی ابدی میان دو تمدن بدون ورود فیزیکی به دنیای آنها.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Chemical analysis of the hydrothermal vent fluids revealed dense concentrations of synthetic amino acids and complex polymers that functioned as cryogenic antifreeze. The leviathans’ biological cells possessed triple-helix DNA reinforced with carbon nanotube scaffolds, making them virtually immune to radiation and aging. The scientific papers authored by Paul and Maya established a new branch of medicine: xenocellular longevity, offering potential therapies for human cellular degeneration.",
    keywords: [
      { word: "antifreeze", meaningFa: "ضدیخ طبیعی در بافت‌های زیستی سلول", phonetic: "/ˈæntifriːz/" },
      { word: "triple-helix", meaningFa: "مارپیچ سه‌گانه ژنتیکی با پیوندهای پایدار", phonetic: "/ˈtrɪpl ˈhiːlɪks/" },
      { word: "xenocellular", meaningFa: "زیست‌شناسی سلولی بیگانگان فضایی", phonetic: "/ˌzenəʊˈseljʊlər/" },
      { word: "degeneration", meaningFa: "تحلیل رفتن و فرسایش سلولی در اثر کهولت سن", phonetic: "/dɪˌdʒenəˈreɪʃn/" },
    ],
    question: {
      promptEn: "What extraordinary genetic structure protected the leviathans from radiation and cellular aging?",
      promptFa: "چه ساختار ژنتیکی شگفت‌انگیزی این موجودات را در برابر تشعشعات و پیری سلولی مصون می‌کرد؟",
      options: [
        "Triple-helix DNA reinforced with carbon nanotube scaffolds",
        "Lead plating surrounding their internal organs",
        "A biological cooling system based on liquid helium",
      ],
      correctIndex: 0,
      hintSnippet: "biological cells possessed triple-helix DNA reinforced with carbon nanotube scaffolds, making them virtually immune to radiation and aging",
      clueFa: "خط دوم رو بخون؛ دی‌ان‌ای با مارپیچ سه‌گانه تقویت‌شده با داربست‌های نانولوله کربنی.",
    },
    choiceA: {
      labelEn: "Launch the International Xenomedical Research Institute in Zurich using Europan data!",
      labelFa: "موسسه پزشکی بین‌المللی با الهام از ژنتیک اروپا را در زوریخ افتتاح کن!",
      descriptionFa: "درمان بیماری‌های لاعلاج و افزایش سلامت انسان با الگوبرداری از حیات مقاوم کیهانی.",
    },
    choiceB: {
      labelEn: "Toast the monumental medical revelation in Archimedes' observation lounge with Maya and Ryan!",
      labelFa: "این کشف بزرگ پزشکی را در سالن رصد ایستگاه همراه با مایا و رایان جشن بگیرید!",
      descriptionFa: "غرور و شادمانی از کشفی که مرزهای سلامتی بشر را جابجا می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "As the three-billion-year astronomical chronicle was decoded, it solved twenty enduring mysteries of astrophysics, including the origin of the Kuiper Belt, the migratory orbit of Jupiter, and the precise epoch when water was first brought to early Earth by cometary swarms. Universities across six continents revised their textbooks simultaneously. In Stockholm, the Royal Swedish Academy of Sciences voted to award Paul Bennett and Maya Lin the Nobel Prize in Physics for unraveling the living memory of the Solar System.",
    keywords: [
      { word: "Kuiper Belt", meaningFa: "کمربند کویپر (ناحیه پر از اجرام یخی در لبه منظومه شمسی)", phonetic: "/ˈkaɪpər belt/" },
      { word: "epoch", meaningFa: "عصر، دوره بزرگ تاریخی در تحول زمین", phonetic: "/ˈepək/" },
      { word: "cometary", meaningFa: "دنباله‌داری، وابسته به دنباله‌دارها", phonetic: "/ˈkɒmɪtri/" },
      { word: "unraveling", meaningFa: "گشودن گره‌ها، آشکار ساختن رازهای پنهان", phonetic: "/ʌnˈrævəlɪŋ/" },
    ],
    question: {
      promptEn: "What prestigious global prize was awarded to Paul and Maya for decoding the planetary memory?",
      promptFa: "چه جایزه جهانی بزرگی برای رمزگشایی حافظه باستانی منظومه شمسی به پل و مایا اهدا شد؟",
      options: [
        "The Nobel Prize in Physics",
        "The Olympic Aviation Medal",
        "The Jules Verne Science Fiction Cup",
      ],
      correctIndex: 0,
      hintSnippet: "voted to award Paul Bennett and Maya Lin the Nobel Prize in Physics for unraveling the living memory of the Solar System",
      clueFa: "خط آخر رو نگاه کن دوست من؛ جایزه نوبل فیزیک از سوی آکادمی سلطنتی علوم سوئد.",
    },
    choiceA: {
      labelEn: "Deliver the Nobel acceptance address from orbit via live interplanetary holographic broadcast!",
      labelFa: "سخنرانی دریافت جایزه نوبل را از مدار اروپا به صورت هولوگرافیک زنده ایراد کن!",
      descriptionFa: "اولین سخنرانی نوبل تاریخ که از ورای مدار یک قمر بیگانه پخش می‌شود.",
    },
    choiceB: {
      labelEn: "Share a peaceful viewing of Jupiter's swirling red spot from the cupola as history is made!",
      labelFa: "به تماشای لکه سرخ مشتری از پنجره گنبدی ایستگاه بنشینید در شبی که تاریخ دگرگون شد!",
      descriptionFa: "آرامشی عمیق در دل بی‌کرانگی کیهان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Archimedes' acoustic transducers beamed Earth’s answering chorus—a composite recording of Atlantic whale songs, Pacific surf, and human choral harmonies—down through the twenty kilometers of ice. Seconds later, the ocean erupted in an acoustic response of transcendent beauty: twenty thousand Europan leviathans joined together in a harmonious antiphonal chorus that shook the ice shelf with joy. The two worlds had established contact not with weapons or exploitation, but through the universal language of melody.",
    keywords: [
      { word: "transducers", meaningFa: "مبدل‌ها و فرستنده‌های قوی امواج صوتی و الکتریکی", phonetic: "/trænzˈdjuːsərz/" },
      { word: "transcendent", meaningFa: "متعالی، شکوهمند و فراتر از ماده", phonetic: "/trænˈsendənt/" },
      { word: "antiphonal", meaningFa: "پاسخ‌گویی دو گروه هم‌سرا در موسیقی (هم‌نوایی متناوب)", phonetic: "/ænˈtɪfənl/" },
      { word: "choral", meaningFa: "آوازی، هم‌سرایی کرال گروهی", phonetic: "/ˈkɔːrəl/" },
    ],
    question: {
      promptEn: "What did the answering transmission from Earth contain that established universal harmony?",
      promptFa: "پیام ارسالی از زمین به اقیانوس اروپا شامل چه اصواتی بود که هارمونی کیهانی آفرید؟",
      options: [
        "Atlantic whale songs, Pacific surf, and human choral harmonies",
        "Mechanical engine noises from supersonic fighter jets",
        "Synthesizer alarm sirens from space shuttles",
      ],
      correctIndex: 0,
      hintSnippet: "a composite recording of Atlantic whale songs, Pacific surf, and human choral harmonies—down through the twenty kilometers of ice",
      clueFa: "خط اول رو ببین؛ آوای نهنگ‌های اقیانوس اطلس، موج‌های اقیانوس آرام و هم‌سرایی کرال انسانی.",
    },
    choiceA: {
      labelEn: "Publish the two-world symphonic chorus as an open interplanetary cultural gift to all humanity!",
      labelFa: "این هم‌نوایی دو جهان را به عنوان هدیه فرهنگی بین‌سیاره‌ای در اختیار مردم زمین بگذار!",
      descriptionFa: "نوایی که امید و صلح را در دل هر شنونده‌ای در زمین زنده می‌کند.",
    },
    choiceB: {
      labelEn: "Pledge to keep the acoustic connection alive as a permanent inter-species bridge across the dark!",
      labelFa: "عهد ببند که خط ارتباط صوتی را به عنوان پلی همیشگی میان انسان و اقیانوس اروپا زنده نگه داری!",
      descriptionFa: "دوستی ابدی در ژرفای منظومه شمسی.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "In the Great Hall of the United Nations in New York, delegates from one hundred and ninety-three countries rose in unison as the cold-fusion atmospheric scrubber blueprints were unveiled. By harnessing the Jovian technologies, global carbon levels could be restored to pre-industrial baselines within eight years, ending the climate crisis forever. Commander Ryan addressed the assembly via live orbital feed: 'Europa did not simply offer us knowledge; it taught us that the price of exploring the stars is learning to heal our own home.'",
    keywords: [
      { word: "unison", meaningFa: "یکصدا، با هماهنگی کامل همگان", phonetic: "/ˈjuːnɪsn/" },
      { word: "baselines", meaningFa: "ترازهای پایه و استانداردهای اولیه پیش از آلودگی", phonetic: "/ˈbeɪslaɪnz/" },
      { word: "interplanetary", meaningFa: "بین‌سیاره‌ای، فراتر از مرزهای زمین", phonetic: "/ˌɪntərˈplænɪtri/" },
      { word: "healing", meaningFa: "التیام‌بخشی، درمان و احیای سلامت", phonetic: "/ˈhiːlɪŋ/" },
    ],
    question: {
      promptEn: "Within how many years could the cold-fusion technology restore Earth's pre-industrial climate baselines?",
      promptFa: "فناوری همجوشی سرد اروپا ظرف چند سال تراز آب‌وهوای زمین را به دوران پیش از صنعت بازمی‌گرداند؟",
      options: [
        "Within eight years",
        "After five centuries",
        "In one hundred days",
      ],
      correctIndex: 0,
      hintSnippet: "global carbon levels could be restored to pre-industrial baselines within eight years, ending the climate crisis forever",
      clueFa: "خط دوم رو ببین؛ ظرف هشت سال تمام بحران تغییرات اقلیمی پایان می‌یافت و زمین التیام پیدا می‌کرد.",
    },
    choiceA: {
      labelEn: "Receive the United Nations World Environmental Peace Prize in an emotional global broadcast!",
      labelFa: "جایزه صلح محیط‌زیست جهانی سازمان ملل را در پخش زنده بین‌المللی دریافت کن!",
      descriptionFa: "بزرگ‌ترین افتخار تاریخ علم در نجات حیات بر روی کره زمین.",
    },
    choiceB: {
      labelEn: "Return to Earth to oversee the construction of the first thousand atmospheric healing towers!",
      labelFa: "به زمین بازگرد تا ساخت هزار برج تصفیه هوای سیاره‌ای را نظارت کنی!",
      descriptionFa: "مشاهده پاک شدن آسمان شهرهای جهان با چشمان خودت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Aboard Archimedes, the construction of the prototype cold-fusion reactor was completed in forty-two days. When Maya initiated the magnetic pinch, the core lit up with a brilliant violet sun that generated two gigawatts of clean, silent power without releasing a single particle of radioactive waste. With unlimited energy at their disposal, the station deployed artificial magnetic shields that protected the entire Europa orbital corridor from Jupiter’s lethal radiation belts, creating a permanent safe haven for scientific exploration.",
    keywords: [
      { word: "pinch", meaningFa: "انقباض مغناطیسی پلاسما در راکتورهای همجوشی", phonetic: "/pɪntʃ/" },
      { word: "gigawatts", meaningFa: "گیگاوات (یک میلیارد وات توان انرژی)", phonetic: "/ˈɡɪɡəwɒts/" },
      { word: "haven", meaningFa: "پناهگاه امن، لنگرگاه آرامش", phonetic: "/ˈheɪvn/" },
      { word: "corridor", meaningFa: "دالان، کریدور امن پروازی میان‌سیاره‌ای", phonetic: "/ˈkɒrɪdɔːr/" },
    ],
    question: {
      promptEn: "What major safety shield was created using the unlimited clean energy of the cold-fusion reactor?",
      promptFa: "با انرژی نامحدود راکتور همجوشی چه سپر محافظتی بزرگی بر فراز اروپا ایجاد شد؟",
      options: [
        "Artificial magnetic shields protecting the orbital corridor from Jupiter's lethal radiation",
        "A laser barrier blocking commercial satellites",
        "A dome of solid ice freezing the station into orbit",
      ],
      correctIndex: 0,
      hintSnippet: "deployed artificial magnetic shields that protected the entire Europa orbital corridor from Jupiter’s lethal radiation belts",
      clueFa: "خط آخر رو نگاه کن دوست من؛ سپرهای مغناطیسی مصنوعی که مدار اروپا را از تشعشعات مرگبار مشتری ایمن ساخت.",
    },
    choiceA: {
      labelEn: "Inaugurate the Archimedes Deep-Space University for students from all continents!",
      labelFa: "دانشگاه فضایی آرشمیدس را در مدار مشتری برای دانشجویان جهان افتتاح کن!",
      descriptionFa: "مرکزی علمی که آینده دانش‌پژوهان منظومه شمسی را تربیت می‌کند.",
    },
    choiceB: {
      labelEn: "Toast this cosmic victory with a glass of synthesized celebratory cider in the cupola!",
      labelFa: "این پیروزی کیهانی را در سالن گنبدی ایستگاه با یک نوشیدنی گوارا جشن بگیرید!",
      descriptionFa: "پایانی شاداب و سرشار از نور در مدار سیاره مشتری.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The Treaty of Conamara was signed aboard Archimedes by representatives of Earth and the biological council of the ocean mind. Europa was declared an Inviolate Sovereign Biosphere, permanently protected under interplanetary law. At the orbital station’s observation pavilion, a commemorative plaque was dedicated: 'Here humanity encountered the mind of the abyss, and discovered that the true measure of civilization is not the power to dominate, but the capacity to revere.'",
    keywords: [
      { word: "sovereign", meaningFa: "دارای حاکمیت مستقل و تمامیت ارضی", phonetic: "/ˈsɒvrɪn/" },
      { word: "inviolate", meaningFa: "دست‌نخورده، مصون از هرگونه تجاوز و تخریب", phonetic: "/ɪnˈvaɪələt/" },
      { word: "revere", meaningFa: "احترام عمیق گذاشتن، گرامی داشتن با خضوع", phonetic: "/rɪˈvɪər/" },
      { word: "dominate", meaningFa: "تسلط یافتن و به زیر یوغ درآوردن", phonetic: "/ˈdɒmɪneɪt/" },
    ],
    question: {
      promptEn: "What true measure of civilization was engraved on the commemorative plaque?",
      promptFa: "چه معیاری برای سنجش تمدن واقعی بر لوح یادبود ایستگاه نقش بست؟",
      options: [
        "Not the power to dominate, but the capacity to revere",
        "The number of battleships built per decade",
        "The tons of gold mined from asteroids",
      ],
      correctIndex: 0,
      hintSnippet: "the true measure of civilization is not the power to dominate, but the capacity to revere",
      clueFa: "جمله آخر رو بخون؛ عیار واقعی تمدن نه در توانایی سلطه یافتن، بلکه در ظرفیت احترام و تکریم دیگران است.",
    },
    choiceA: {
      labelEn: "Accept the appointment as Earth's Permanent Ambassador to the Jovian Biosphere!",
      labelFa: "سمت سفیر دائمی زمین در اکوسیستم مشتری را با افتخار بپذیر!",
      descriptionFa: "دیپلماتی که پیوند دو تمدن را برای نسل‌های آینده پاسداری می‌کند.",
    },
    choiceB: {
      labelEn: "Lead a quiet moment of reflection in the observation dome as Europa pulses in harmonious peace!",
      labelFa: "در سکوت احترام‌آمیز گنبد به تماشای تپش‌های آرامش‌بخش اقیانوس اروپا بنشینید!",
      descriptionFa: "لحظاتی پر از آرامش، خضوع و شکوه در ژرفای فضا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "When the planetary chronicle was broadcast across Earth, over four billion people tuned in simultaneously. In every capital, crowds watched the cosmic memories projected onto monument walls and night clouds. For the first time in human history, global conflicts halted: the petty divisions of nation-states dissolved in the overwhelming realization that humanity was part of a grand, ancient cosmic family. Millions gathered outdoors under starry skies, looking toward Jupiter with shining eyes of wonder and solidarity.",
    keywords: [
      { word: "divisions", meaningFa: "تفرقه‌ها، مرزبندی‌ها و اختلافات ساختگی", phonetic: "/dɪˈvɪʒnz/" },
      { word: "solidarity", meaningFa: "همبستگی، یگانگی و همدلی یکپارچه", phonetic: "/ˌsɒlɪˈdærəti/" },
      { word: "dissolved", meaningFa: "محو شد، در هم آمیخت و رنگ باخت", phonetic: "/dɪˈzɒlvd/" },
      { word: "overwhelming", meaningFa: "شگرف، مقاومت‌ناپذیر و خیره‌کننده", phonetic: "/ˌəʊvərˈwelmɪŋ/" },
    ],
    question: {
      promptEn: "What historic event occurred across Earth when the cosmic chronicle was broadcast?",
      promptFa: "وقتی خاطرات کیهانی در زمین پخش شد چه رویداد تاریخی بی‌سابقه‌ای رخ داد؟",
      options: [
        "Global conflicts halted as four billion people realized humanity is part of an ancient cosmic family",
        "All computer networks crashed permanently",
        "A worldwide gold rush began toward the asteroid belt",
      ],
      correctIndex: 0,
      hintSnippet: "global conflicts halted: the petty divisions of nation-states dissolved in the overwhelming realization that humanity was part of a grand, ancient cosmic family",
      clueFa: "خط سوم رو ببین؛ تمام جنگ‌ها متوقف شدند وقتی ۴ میلیارد انسان فهمیدند عضوی از یک خانواده بزرگ کیهانی هستند.",
    },
    choiceA: {
      labelEn: "Inaugurate the First Global Day of Cosmic Solidarity at the United Nations!",
      labelFa: "اولین روز جهانی همبستگی کیهانی را در سازمان ملل پایه‌گذاری کن!",
      descriptionFa: "جشنی سالانه برای تجلیل صلح و برادری میان تمام ساکنان زمین.",
    },
    choiceB: {
      labelEn: "Raise a cup of coffee with Paul and Maya, gazing out at the stars that now feel like home!",
      labelFa: "فنجان قهوه را با پل و مایا بنوشید در حالی که ستارگان حالا بوی خانه می‌دهند!",
      descriptionFa: "پایانی گرم، خودمانی و صمیمانه در آغوش کیهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Archimedes became humanity's first operational interstellar vessel, gliding out of Europa's orbit on reactionless gravity drives. Slicing past the rings of Saturn in less than twelve hours, the ship demonstrated that interstellar space was no longer a lethal abyss, but a wide-open highway for peaceful exploration. Standing on the bridge, Paul Bennett logged the first entry of a new historical epoch: 'Today, humanity leaves the cradle of the Solar System, guided by the wisdom of the frozen seas.'",
    keywords: [
      { word: "interstellar", meaningFa: "میان‌ستاره‌ای، فراتر از منظومه شمسی", phonetic: "/ˌɪntərˈstelər/" },
      { word: "propulsion", meaningFa: "پیشرانش و نیروی محرکه بدون سوخت", phonetic: "/prəˈpʌlʃn/" },
      { word: "cradle", meaningFa: "گهواره (آغازگاه نخستین بشر در زمین)", phonetic: "/ˈkreɪdl/" },
      { word: "highway", meaningFa: "بزرگراه باز و هموار برای سفر", phonetic: "/ˈhaɪweɪ/" },
    ],
    question: {
      promptEn: "How quickly did Archimedes slice past the rings of Saturn using its reactionless drive?",
      promptFa: "کشتی آرشمیدس با پیشران بدون سوخت چقدر سریع از کنار حلقه‌های زحل عبور کرد؟",
      options: [
        "In less than twelve hours",
        "After twenty-five years",
        "In two hundred days",
      ],
      correctIndex: 0,
      hintSnippet: "Slicing past the rings of Saturn in less than twelve hours, the ship demonstrated that interstellar space was no longer a lethal abyss",
      clueFa: "خط اول رو نگاه کن دوست من؛ ظرف کمتر از ۱۲ ساعت از کنار حلقه‌های باشکوه زحل گذشت.",
    },
    choiceA: {
      labelEn: "Set course for the Alpha Centauri star system on humanity's first interstellar voyage!",
      labelFa: "مسیر اولین سفر میان‌ستاره‌ای بشر را به سمت سامانه آلفا قنطورس تنظیم کن!",
      descriptionFa: "گام نهادن در سرزمین ستارگان دوردست با اراده پولادین انسان.",
    },
    choiceB: {
      labelEn: "Transmit a parting message of love and gratitude back to the glowing ice of Europa!",
      labelFa: "پیام عشق و قدردانی ابدی را به سوی اقیانوس درخشان اروپا مخابره کن!",
      descriptionFa: "بدرودی پرمهر با سرزمینی که بال پرواز انسان به سوی کهکشان شد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The open-source publication of zero-point gravity equations eliminated humanity’s dependence on fossil fuels in less than thirty-six months. Across Earth, smog-choked metropolises cleared as clean, silent atmospheric skyships replaced diesel trucks and jet aircraft. Power grids operated with zero emissions, and global living standards soared. History books recognized Paul, Maya, and Ryan not as inventors of a machine, but as stewards who shared the gifts of the cosmos freely with all people.",
    keywords: [
      { word: "skyships", meaningFa: "کشتی‌های پرنده آسمانی بی‌صدا با گرانش منفی", phonetic: "/ˈskaɪʃɪps/" },
      { word: "stewards", meaningFa: "امانت‌داران بااخلاق و حافظان منافع جمعی", phonetic: "/ˈstjuːərdz/" },
      { word: "metropolises", meaningFa: "کلان‌شهرهای پرجمعیت و صنعتی", phonetic: "/məˈtrɒpəlɪsɪz/" },
      { word: "emissions", meaningFa: "آلاینده‌ها و گازهای گلخانه‌ای خروجی", phonetic: "/ɪˈmɪʃnz/" },
    ],
    question: {
      promptEn: "How quickly did the open-source zero-point equations eliminate dependence on fossil fuels?",
      promptFa: "انتشار رایگان معادلات گرانش صفر ظرف چند ماه وابستگی بشر به سوخت‌های فسیلی را پایان داد؟",
      options: [
        "In less than thirty-six months",
        "After fifty years of strikes",
        "Only in three wealthy nations",
      ],
      correctIndex: 0,
      hintSnippet: "eliminated humanity’s dependence on fossil fuels in less than thirty-six months",
      clueFa: "خط اول رو بخون؛ ظرف کمتر از ۳۶ ماه وابستگی به سوخت‌های آلاینده در سراسر زمین محو شد.",
    },
    choiceA: {
      labelEn: "Celebrate on the green rooftop of the United Nations as clean air fills the blue skies!",
      labelFa: "بر بام سبز سازمان ملل در هوای پاکیزه آسمان آبی زمین جشن بگیرید!",
      descriptionFa: "دیدن تنفس دوباره طبیعت با چشمان خود در روزی آفتابی.",
    },
    choiceB: {
      labelEn: "Retire to an organic orchard in the Andes, knowing you gifted the world a clean future!",
      labelFa: "در باغی سرسبز در دامنه‌های آند آرام بگیر با این یقین که آینده‌ای پاک به کودکان زمین بخشیدی!",
      descriptionFa: "پایانی آرامش‌بخش، معنوی و جاودان در آغوش طبیعت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "The United Nations Interplanetary Council formally inaugurated its permanent chamber aboard Archimedes. In a historic first session, delegates from Earth sat beside holographic ambassadors representing the Europan ocean mind. Joint scientific programs were established to monitor space weather across the asteroid belt and prevent cometary collisions. The station became the shining beacon of interplanetary diplomacy, proving that dialogue is the greatest power in the universe.",
    keywords: [
      { word: "inaugurated", meaningFa: "رسماً افتتاح کرد و گشود", phonetic: "/ɪˈnɔːɡjəreɪtɪd/" },
      { word: "collisions", meaningFa: "برخوردهای مرگبار سنگ‌های آسمانی", phonetic: "/kəˈlɪʒnz/" },
      { word: "beacon", meaningFa: "مشعل تابناک، راهنما و نشان افتخار", phonetic: "/ˈbiːkən/" },
      { word: "dialogue", meaningFa: "گفتگو و دیپلماسی صمیمانه", phonetic: "/ˈdaɪəlɒɡ/" },
    ],
    question: {
      promptEn: "What was the purpose of the joint scientific programs established aboard Archimedes?",
      promptFa: "هدف برنامه‌های علمی مشترک تاسیس‌شده در ایستگاه آرشمیدس چه بود؟",
      options: [
        "To monitor space weather across the asteroid belt and prevent cometary collisions",
        "To build military garrisons on Mars",
        "To tax private space tourism flights",
      ],
      correctIndex: 0,
      hintSnippet: "established to monitor space weather across the asteroid belt and prevent cometary collisions",
      clueFa: "خط دوم رو ببین دوست من؛ پایش آب‌وهوای فضایی و پیشگیری از برخورد دنباله‌دارها با سیارات مسکونی.",
    },
    choiceA: {
      labelEn: "Gavel the opening of the First Jovian Peace Assembly under blinding media applause!",
      labelFa: "چکش افتتاحیه مجمع صلح مشتری را در میان تشویق رسانه‌های جهان بکوب!",
      descriptionFa: "نخستین گردهمایی دیپلماتیک دو جهان هوشمند در تاریخ کیهان.",
    },
    choiceB: {
      labelEn: "Toast this diplomatic masterpiece with Elena Ryan as Europa shines beneath the station!",
      labelFa: "این شاهکار دیپلماتیک را در کنار النا رایان در روشنایی قمر اروپا جشن بگیر!",
      descriptionFa: "شبی ماندگار و لبریز از آرامش در فراز مدار قمر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Inside the panoramic observation lounge of Archimedes, the crew gathered with hot mugs of tea to watch Europa’s night hemisphere come alive. Below them, across thousands of miles of ice, rhythmic bioluminescent ripples pulsed in time with the gentle hum of the station’s engines. In the soft golden light, Commander Ryan smiled at Paul and Maya: 'We set out to explore the darkness, and the darkness answered with light.'",
    keywords: [
      { word: "hemisphere", meaningFa: "نیم‌کره سیاره یا قمر", phonetic: "/ˈhemɪsfɪər/" },
      { word: "ripples", meaningFa: "امواج کوچک و لایه‌های نوسانی نوری", phonetic: "/ˈrɪplz/" },
      { word: "pulsed", meaningFa: "تپش کرد، با ریتم موزون روشن و خاموش شد", phonetic: "/pʌlst/" },
      { word: "panoramic", meaningFa: "دید سراسرنما از تمام زوایا", phonetic: "/ˌpænəˈræmɪk/" },
    ],
    question: {
      promptEn: "What memorable thought did Commander Ryan share as Europa's night hemisphere glowed?",
      promptFa: "فرمانده رایان در حین تماشای درخشش قمر اروپا چه جمله دلنشینی به زبان آورد؟",
      options: [
        "We set out to explore the darkness, and the darkness answered with light",
        "We should have brought more solar panels from Earth",
        "Jupiter looks like a giant copper coin",
      ],
      correctIndex: 0,
      hintSnippet: "We set out to explore the darkness, and the darkness answered with light",
      clueFa: "جمله آخر رو بخون؛ گفت ما راه افتادیم تا تاریکی را بکاویم، و تاریکی با نور به ما پاسخ داد.",
    },
    choiceA: {
      labelEn: "Pledge lifelong dedication to the peaceful custody of the Jovian moons!",
      labelFa: "پیمان وفاداری همیشگی برای حراست صلح‌آمیز از قمرهای مشتری ببندید!",
      descriptionFa: "تعهدی جاودان به راستی، خرد و حفظ کرامت همه موجودات.",
    },
    choiceB: {
      labelEn: "Take a commemorative crew photograph with the glowing cracked ice world in the background!",
      labelFa: "عکس یادگاری تیم را با پس‌زمینه دنیای درخشان یخی اروپا ثبت کنید!",
      descriptionFa: "تصویری تاریخی که بر جلد تمام مجلات و کتاب‌های تاریخ علم خواهد ماند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The United Nations General Assembly officially ratified the 'Europan Marine Sanctuary Treaty', declaring all waters beneath the ice crust completely off-limits to military, industrial, or robotic interference. Protected by satellite surveillance, the gentle leviathans were free to sing and dance in their abyssal gardens for millennia to come. In public squares across seven continents, children created paper lanterns shaped like the violet Europan manta-beings, releasing them into the night sky in celebration of life's boundless variety.",
    keywords: [
      { word: "ratified", meaningFa: "رسماً به تصویب رساند و قانونی کرد", phonetic: "/ˈrætɪfaɪd/" },
      { word: "off-limits", meaningFa: "ممنوعه، غیرقابل ورود برای اهداف صنعتی و نظامی", phonetic: "/ˌɔːf ˈlɪmɪts/" },
      { word: "lanterns", meaningFa: "فانوس‌های کاغذی نورانی در آسمان شب", phonetic: "/ˈlæntərnz/" },
      { word: "boundless", meaningFa: "بی‌کران، بی‌پایان و نامحدود", phonetic: "/ˈbaʊndləs/" },
    ],
    question: {
      promptEn: "How did children across seven continents celebrate the ratification of the marine sanctuary?",
      promptFa: "کودکان در هفت قاره جهان تصویب معاهده حفاظت را چگونه جشن گرفتند؟",
      options: [
        "By creating paper lanterns shaped like Europan manta-beings and releasing them into the sky",
        "By demanding free admission to amusement parks",
        "By staging mock space battles in playgrounds",
      ],
      correctIndex: 0,
      hintSnippet: "children created paper lanterns shaped like the violet Europan manta-beings, releasing them into the night sky",
      clueFa: "خط آخر رو نگاه کن دوست من؛ با ساختن فانوس‌های کاغذی به شکل سفره‌ماهی‌های بنفش و پرواز دادنشان در آسمان شب.",
    },
    choiceA: {
      labelEn: "Watch the floating lanterns from orbit as Earth glows with childlike wonder!",
      labelFa: "پرواز فانوس‌های درخشان را از مدار تماشا کن وقتی زمین غرق در شادی کودکان است!",
      descriptionFa: "زیباترین پیوند عاطفی میان نسل آینده و جهان‌های دوردست.",
    },
    choiceB: {
      labelEn: "Designate Archimedes as the permanent orbital ranger post of the Jovian Sanctuary!",
      labelFa: "ایستگاه آرشمیدس را به عنوان پایگاه دائمی محیط‌بانان فضایی اروپا ثبت کن!",
      descriptionFa: "چشمان همیشه بیداری که از آرامش این اقیانوس حفاظت می‌کنند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The newly commissioned Orbital Bio-Resonance Array maintained a gentle, continuous acoustic bridge with the Europan leviathans. Every day, subtle variations in the beings’ electromagnetic mandalas were decoded into poetry, geometry, and philosophical reflections. Maya Lin published the first volume of 'Dialogues Across the Ice', which topped global bestseller charts. In her preface, Maya wrote: 'We sought an empire of conquerors among the stars; instead, we found teachers who showed us the beauty of silence.'",
    keywords: [
      { word: "commissioned", meaningFa: "راه‌اندازی‌شده و رسماً به کار گرفته شده", phonetic: "/kəˈmɪʃnd/" },
      { word: "preface", meaningFa: "مقدمه، دیباچه و سرآغاز کتاب", phonetic: "/ˈprefɪs/" },
      { word: "conquerors", meaningFa: "فاتحان جنگ‌طلب و سلطه‌جویان", phonetic: "/ˈkɒŋkərərz/" },
      { word: "philosophical", meaningFa: "فلسفی و تامل‌برانگیز", phonetic: "/ˌfɪləˈsɒfɪkl/" },
    ],
    question: {
      promptEn: "What profound sentence did Maya write in the preface of her bestselling book?",
      promptFa: "مایا در مقدمه کتاب پرفروش خود چه جمله ژرفی نوشت؟",
      options: [
        "We sought an empire of conquerors among the stars; instead, we found teachers who showed us the beauty of silence",
        "Space exploration is only worthwhile if it yields precious metals",
        "Jupiter's radiation makes human memory fade quickly",
      ],
      correctIndex: 0,
      hintSnippet: "We sought an empire of conquerors among the stars; instead, we found teachers who showed us the beauty of silence",
      clueFa: "جمله آخر رو ببین؛ ما در میان ستارگان به دنبال امپراتوری فاتحان بودیم، اما در عوض آموزگارانی یافتیم که زیبایی سکوت را به ما آموختند.",
    },
    choiceA: {
      labelEn: "Host the world premiere of the documentary 'Teachers of the Silence' at the Cannes Film Festival!",
      labelFa: "افتتاحیه جهانی مستند «آموزگاران سکوت» را در فستیوال فیلم کن برگزار کن!",
      descriptionFa: "اثری هنری و فلسفی که قلب میلیون‌ها بیننده را مسحور ساخت.",
    },
    choiceB: {
      labelEn: "Toast the endless wisdom of the abyss over tea with Paul and Ryan in the wardroom!",
      labelFa: "حکمت بی‌پایان اعماق را با چای گرم در کنار پل و رایان جشن بگیرید!",
      descriptionFa: "پایانی صمیمی، آرامش‌بخش و پرمعنا در سکوت ایستگاه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The Zurich Xenomedical Center announced unprecedented clinical breakthroughs using synthetic formulations derived from Europan triple-helix DNA. Clinical trials demonstrated a complete reversal of cellular senescence in human tissues, effectively curing degenerative neurological diseases including Alzheimer's and Parkinson's. The World Health Organization hailed the mission as the greatest humanitarian triumph of the modern era, saving twenty million lives in its very first year of implementation.",
    keywords: [
      { word: "senescence", meaningFa: "پیری و فرسودگی طبیعی سلول‌ها", phonetic: "/sɪˈnesns/" },
      { word: "degenerative", meaningFa: "تحلیل‌برنده و تخریب‌کننده بافت‌های عصبی", phonetic: "/dɪˈdʒenərətɪv/" },
      { word: "formulations", meaningFa: "فرمولاسیون‌ها و ترکیبات دارویی نوین", phonetic: "/ˌfɔːrmjuˈleɪʃnz/" },
      { word: "humanitarian", meaningFa: "بشردوستانه، خیرخواهانه و نجات‌بخش انسان‌ها", phonetic: "/hjuːˌmænɪˈteəriən/" },
    ],
    question: {
      promptEn: "How many human lives were saved in the first year of clinical implementation of Europan therapies?",
      promptFa: "در اولین سال کاربرد درمان‌های برگرفته از دی‌ان‌ای اروپا جان چند میلیون بیمار نجات یافت؟",
      options: [
        "Twenty million lives were saved worldwide",
        "Five hundred hospital volunteers",
        "Ten thousand private patients",
      ],
      correctIndex: 0,
      hintSnippet: "saving twenty million lives in its very first year of implementation",
      clueFa: "خط آخر رو نگاه کن دوست من؛ نجات جان ۲۰ میلیون انسان مبتلا به بیماری‌های سخت در همان سال اول.",
    },
    choiceA: {
      labelEn: "Receive the Nobel Prize in Medicine in Stockholm on behalf of the Archimedes science crew!",
      labelFa: "جایزه نوبل پزشکی را در استکهلم به نمایندگی از تیم علمی آرشمیدس دریافت کن!",
      descriptionFa: "بالاترین افتخار برای دانشمندانی که مرهمی بر دردهای بشریت نهادند.",
    },
    choiceB: {
      labelEn: "Dedicate the medical triumph to the gentle leviathans who dwell beneath the frozen ocean!",
      labelFa: "این پیروزی بزرگ درمانی را به موجودات مهربان زیر یخ‌های قمر اروپا تقدیم کن!",
      descriptionFa: "سپاسگزاری همیشگی از آموزگاران خاموش اعماق کیهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Standing in the Archimedes observation cupola, Paul, Maya, and Commander Ryan clinked crystal goblets of synthesized sparkling vintage as Jupiter rose above the horizon. The great gas giant’s ochre bands and swirling storms filled the entire curved window, casting warm amber highlights across their smiling faces. Beside them, the telemetry screens confirmed that their research data had reached every continent on Earth without cost or restriction. They had entered the void as scientists, and returned as the benefactors of human civilization.",
    keywords: [
      { word: "cupola", meaningFa: "گنبدک رصد شیشه‌ای چندضلعی در فضاپیما", phonetic: "/ˈkjuːpələ/" },
      { word: "ochre", meaningFa: "اخرایی، زرد مایل به قهوه‌ای گرم", phonetic: "/ˈəʊkər/" },
      { word: "benefactors", meaningFa: "نیکوکاران بزرگ، بخشندگان خیر و برکت به جامعه", phonetic: "/ˈbenɪfæktərz/" },
      { word: "restriction", meaningFa: "محدودیت، انحصار و مانع دسترسی", phonetic: "/rɪˈstrɪkʃn/" },
    ],
    question: {
      promptEn: "How was the scientific research data distributed to the continents of Earth?",
      promptFa: "داده‌های پژوهشی علمی چگونه به قاره‌های زمین ارسال و توزیع شد؟",
      options: [
        "Without cost or restriction to every continent on Earth",
        "Sold at public auctions to the highest bidder",
        "Stored in secret military vaults under the Pentagon",
      ],
      correctIndex: 0,
      hintSnippet: "research data had reached every continent on Earth without cost or restriction",
      clueFa: "خط ماقبل آخر رو بخون؛ کاملاً رایگان و بدون هیچ محدودیتی در اختیار تمام مردم زمین قرار گرفت.",
    },
    choiceA: {
      labelEn: "Broadcast a heartfelt farewell to the Jovian night as Archimedes readies for its journey home!",
      labelFa: "با شب پر رمز و راز مشتری خداحافظی کن وقتی آرشمیدس برای بازگشت به زمین آماده می‌شود!",
      descriptionFa: "پایان شیرین و موفقیت‌آمیز بزرگ‌ترین ماموریت قرن.",
    },
    choiceB: {
      labelEn: "Pledge to return with the next generation of explorers to deepen this sacred bond!",
      labelFa: "پیمان ببندید که با نسل جدید کاوشگران برای تعمیق این پیوند مقدس بازگردید!",
      descriptionFa: "آغازی تازه برای سفرهای بی‌پایان به سوی خرد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Beamed across three hundred and ninety million miles of space, Paul Bennett and Maya Lin delivered their Nobel Physics Lecture live from Europa's orbit. Projected as thirty-foot holographic figures in the Stockholm Concert Hall, they stood before royalty and Nobel laureates, narrating the three-billion-year cosmic memory preserved within the icy crust. The audience rose in a ten-minute standing ovation, weeping with joy as the final slide showed Earth and Europa suspended side-by-side like two luminous pearls in the dark.",
    keywords: [
      { word: "laureates", meaningFa: "برگزیدگان نوبل و مفاخر علمی جهان", phonetic: "/ˈlɔːriəts/" },
      { word: "luminous", meaningFa: "تابناک، درخشان و پرفروغ", phonetic: "/ˈluːmɪnəs/" },
      { word: "pearls", meaningFa: "مرواریدهای سپید و گرانبها", phonetic: "/pɜːrlz/" },
      { word: "side-by-side", meaningFa: "دوشادوش هم در کنار یکدیگر", phonetic: "/saɪd baɪ saɪd/" },
    ],
    question: {
      promptEn: "What did the final slide of the live interplanetary Nobel lecture display?",
      promptFa: "اسلاید پایانی سخنرانی نوبل میان‌سیاره‌ای چه تصویری را نشان داد؟",
      options: [
        "Earth and Europa suspended side-by-side like two luminous pearls in the dark",
        "A schematic diagram of a nuclear fusion warhead",
        "A photo of the Nobel banquet dinner menu",
      ],
      correctIndex: 0,
      hintSnippet: "the final slide showed Earth and Europa suspended side-by-side like two luminous pearls in the dark",
      clueFa: "خط آخر رو ببین؛ زمین و قمر اروپا دوشادوش هم مثل دو مروارید درخشان در پهنه تاریکی کیهان.",
    },
    choiceA: {
      labelEn: "Accept the Nobel Gold Medals transported to orbit aboard the relief resupply shuttle!",
      labelFa: "مدال‌های طلای نوبل را که با شاتل تدارکاتی به مدار فرستاده شده با افتخار تحویل بگیر!",
      descriptionFa: "نخستین مدال‌های نوبل که فراتر از سیاره زمین تحویل داده شدند.",
    },
    choiceB: {
      labelEn: "Toast the Nobel victory in the station galley with dehydrated strawberries and warm smiles!",
      labelFa: "پیروزی نوبل را در غذاخوری ایستگاه با توت‌فرنگی‌های خشک‌شده فضایی و لبخند جشن بگیرید!",
      descriptionFa: "پایانی خودمانی، گرم و پر از فروتنی برای دو برنده نوبل در فضا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Gazing out through the triple-pane quartz viewing port of the cupola, Paul watched the Great Red Spot churn majestically in Jupiter’s stormy atmosphere. Beside him, Maya held her notebook, recording the final coordinates of their mission. In the silence of the cosmos, the station felt like a sanctuary of human willpower. Elena walked in with three warm mugs: 'Paul, Maya, we proved that when humanity listens with humility, the universe speaks in a voice we can all understand.'",
    keywords: [
      { word: "triple-pane", meaningFa: "شیشه‌های سه‌جداره مقاوم در برابر فشار و سرمای فضا", phonetic: "/ˈtrɪpl peɪn/" },
      { word: "churn", meaningFa: "غلیان کردن و به گردش درآمدن امواج گازهای جوی", phonetic: "/tʃɜːrn/" },
      { word: "humility", meaningFa: "تواضع، فروتنی در برابر عظمت هستی", phonetic: "/hjuːˈmɪləti/" },
      { word: "sanctuary", meaningFa: "مأمن آرامش و کانون امن اندیشه", phonetic: "/ˈsæŋktʃuəri/" },
    ],
    question: {
      promptEn: "What truth did Commander Elena share about listening to the universe?",
      promptFa: "فرمانده النا چه حقیقتی را درباره گوش سپردن به جهان هستی بیان کرد؟",
      options: [
        "When humanity listens with humility, the universe speaks in a voice we can all understand",
        "The universe only respects ships with powerful laser cannons",
        "Jupiter's red spot will fade away in five days",
      ],
      correctIndex: 0,
      hintSnippet: "when humanity listens with humility, the universe speaks in a voice we can all understand",
      clueFa: "جمله آخر رو بخون دوست من؛ وقتی بشر با تواضع گوش فرا دهد، جهان به زبانی سخن می‌گوید که همه می‌فهمیم.",
    },
    choiceA: {
      labelEn: "Engage the orbital return burns and head home to Earth as heroes of human history!",
      labelFa: "موتورهای بازگشت به مدار را روشن کن و به عنوان قهرمانان تاریخ به سوی زمین بازگردید!",
      descriptionFa: "سفر بازگشت به آغوش گرم خانواده و انسان‌های منتظر.",
    },
    choiceB: {
      labelEn: "Remain aboard Archimedes to lead the second exploration phase into the outer moons of Jupiter!",
      labelFa: "در ایستگاه آرشمیدس بمانید تا فاز دوم اکتشاف قمرهای بیرونی مشتری را آغاز کنید!",
      descriptionFa: "ماجراجویی بی‌پایانی که در راه دانش هیچ‌گاه متوقف نمی‌شود.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The interplanetary musical album 'Symphony of Two Oceans' was released freely across all digital channels on Earth. Combining the melodic whale songs of the Pacific with the ancient electromagnetic harmonics of Europa, the recording became a cultural phenomenon. Symphony halls in Vienna, London, Tokyo, and Sydney performed live orchestrations accompanied by the live hydrophone feed from Europa’s sea. Reviewers called it 'the most sublime aesthetic experience in human memory—the song of life celebrating itself across the stars.'",
    keywords: [
      { word: "sublime", meaningFa: "والا، شکوهمند، ماورایی و ملکوتی", phonetic: "/səˈblaɪm/" },
      { word: "orchestrations", meaningFa: "تنظیم‌های ارکسترال سازهای موسیقی", phonetic: "/ˌɔːrkɪˈstreɪʃnz/" },
      { word: "aesthetic", meaningFa: "زیباشناختی، هنری و حس‌برانگیز", phonetic: "/iːsˈθetɪk/" },
      { word: "phenomenon", meaningFa: "پدیده شگفت‌انگیز و خارق‌العاده", phonetic: "/fəˈnɒmɪnən/" },
    ],
    question: {
      promptEn: "What did international reviewers call the 'Symphony of Two Oceans' musical release?",
      promptFa: "منتقدان برجسته جهان آلبوم موسیقی «سمفونی دو اقیانوس» را چه نامیدند؟",
      options: [
        "The most sublime aesthetic experience in human memory—the song of life celebrating itself",
        "A dull recording of underwater static",
        "An experimental jazz exercise for synthesizers",
      ],
      correctIndex: 0,
      hintSnippet: "the most sublime aesthetic experience in human memory—the song of life celebrating itself across the stars",
      clueFa: "خط آخر رو ببین؛ والاترین تجربه زیباشناختی در حافظه بشر؛ نغمه حیات که خود را در میان ستارگان جشن می‌گیرد.",
    },
    choiceA: {
      labelEn: "Direct the symphony's global concert proceeds to clean ocean restoration projects on Earth!",
      labelFa: "تمام درآمدهای کنسرت‌های جهانی سمفونی را به پاک‌سازی اقیانوس‌های زمین اختصاص بده!",
      descriptionFa: "پیوند هنر کیهانی با نجات محیط‌زیست دریایی سیاره مادری.",
    },
    choiceB: {
      labelEn: "Listen together in the silence of Archimedes as the final notes echo into eternity!",
      labelFa: "در سکوت ایستگاه آرشمیدس به انعکاس آخرین نت‌های هم‌نوایی در ابدیت گوش بسپارید!",
      descriptionFa: "پایانی سحرانگیز، عمیق و آرامش‌بخش در دل کهکشان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "As the acoustic array maintained its gentle daily transmission between the two worlds, the Europa orbital mission concluded its primary charter. Looking down through the glass floor of the telemetry suite, Paul and Maya saw the vast white expanse of Europa illuminated by Jupiter’s amber crescent. Beneath twenty kilometers of ice, the ancient leviathans sang their peaceful songs into the warm hydrothermal currents. The bridge was built, the silence was broken, and the universe was forever home.",
    keywords: [
      { word: "charter", meaningFa: "اساسنامه و منشور ماموریت رسمی", phonetic: "/ˈtʃɑːrtər/" },
      { word: "suite", meaningFa: "اتاق و مجموعه ابزارهای هدایت و مخابرات", phonetic: "/swiːt/" },
      { word: "crescent", meaningFa: "هلال درخشان سیاره یا ماه در آسمان", phonetic: "/ˈkresnt/" },
      { word: "leviathans", meaningFa: "موجودات غول‌آسای مهربان اعماق", phonetic: "/ləˈvaɪəθənz/" },
    ],
    question: {
      promptEn: "What did Paul and Maya see through the glass floor as the mission concluded its primary charter?",
      promptFa: "پل و مایا با پایان منشور ماموریت از کف شیشه‌ای اتاق مخابرات چه صحنه‌ای را دیدند؟",
      options: [
        "The vast white expanse of Europa illuminated by Jupiter's amber crescent",
        "A fleet of military gunboats landing on the ice",
        "A black hole swallowing Jupiter's outer moons",
      ],
      correctIndex: 0,
      hintSnippet: "saw the vast white expanse of Europa illuminated by Jupiter’s amber crescent",
      clueFa: "خط دوم رو بخون؛ پهنه سفید و گسترده قمر اروپا که با هلال کهربایی سیاره مشتری روشن شده بود.",
    },
    choiceA: {
      labelEn: "Sign the permanent treaty log as Founders of the First Interplanetary Bridge!",
      labelFa: "دفتر دائمی معاهده را به عنوان بنیان‌گذاران نخستین پل بین‌سیاره‌ای امضا کنید!",
      descriptionFa: "ثبت همیشگی نام تیم در تاریخ پرافتخار صلح کیهانی.",
    },
    choiceB: {
      labelEn: "Clink tea mugs in contented silence, smiling at the stars that shine in lasting harmony!",
      labelFa: "فنجان‌های چای را در سکوتی سرشار از آرامش به هم بزنید؛ با لبخندی به ستارگانی که در صلح می‌درخشند!",
      descriptionFa: "پایانی ماندگار، شاعرانه و آرام در قلب هستی.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Planetary Environmental Restoration", titleFa: "احیای زیست‌محیطی سیاره مادری", badgeCategory: "legendary", badgeIcon: "🌍", badgeNameFa: "پایان نجات زمین", climaxEn: "The UN adopts Europa's cold-fusion atmospheric scrubbers, reversing two centuries of carbon pollution in a single decade.", climaxFa: "سازمان ملل فناوری همجوشی سرد اروپا را به کار گرفت و در یک دهه تمام آلودگی‌های کربنی زمین را التیام بخشید.", xpReward: 280 },
  { pathCode: "AAAAB", titleEn: "The Towers of Clean Sky", titleFa: "برج‌های آسمان پاک زمین", badgeCategory: "heroic", badgeIcon: "🏙️", badgeNameFa: "پایان شکوفایی زمین", climaxEn: "Paul and Ryan oversee one thousand atmospheric healing towers across Earth, watching skies turn sapphire blue again.", climaxFa: "پل و رایان ساخت هزار برج تصفیه هوا را در پنج قاره سرپرستی کردند و آسمان آبی را به چشمان مردم زمین بازگرداندند.", xpReward: 275 },
  { pathCode: "AAABA", titleEn: "The Archimedes Space University", titleFa: "دانشگاه فضایی آرشمیدس", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان آکادمیک کیهانی", climaxEn: "Archimedes becomes humanity's premier deep-space research institute, training thousands of young planetary scientists.", climaxFa: "ایستگاه آرشمیدس به نخستین دانشگاه فضایی بشر در مدار مشتری بدل گشت و هزاران دانشمند جوان را آموزش داد.", xpReward: 275 },
  { pathCode: "AAABB", titleEn: "The Jovian Sun Toast", titleFa: "سلامتی به خورشید بنفش مشتری", badgeCategory: "funny", badgeIcon: "🥂", badgeNameFa: "پایان صمیمی و پیروزمند", climaxEn: "Clinking mugs under the glow of the station's miniature fusion star, the crew smiles at a mission that changed history forever.", climaxFa: "با نوشیدن یک فنجان گرم زیر نور خورشید مینیاتوری همجوشی، خدمه به ماموریتی بالیدند که تاریخ را برای همیشه دگرگون کرد.", xpReward: 260 },
  { pathCode: "AABAA", titleEn: "The Conamara Ambassadorial Oath", titleFa: "سوگند سفیر صلح در کنامارا", badgeCategory: "legendary", badgeIcon: "📜", badgeNameFa: "پایان دیپلماتیک بین‌سیاره‌ای", climaxEn: "Elena Ryan is appointed Earth's Permanent Envoy to the Jovian Biosphere, establishing the first interplanetary embassy.", climaxFa: "النا رایان به عنوان نخستین سفیر رسمی انسان در اکوسیستم مشتری منصوب شد و سفارت صلح کیهانی را بنا نهاد.", xpReward: 280 },
  { pathCode: "AABAB", titleEn: "The Twilight Vigil of Europa", titleFa: "دیده‌بانی گرگ‌ومیش در مدار", badgeCategory: "explorer", badgeIcon: "🌌", badgeNameFa: "پایان آرامش‌بخش فضایی", climaxEn: "Watching Europa pulse in rhythmic light beneath the viewing dome, the scientists know that knowledge is the truest prayer.", climaxFa: "با تماشای تپش‌های موزون نور در زیر یخ‌ها، دانشمندان دریافتند که کسب دانش پاک‌ترین نیایش هستی است.", xpReward: 270 },
  { pathCode: "AABBA", titleEn: "The First Day of Cosmic Kinship", titleFa: "روز بزرگ برادری در کهکشان", badgeCategory: "heroic", badgeIcon: "🕊️", badgeNameFa: "پایان یگانگی بشریت", climaxEn: "Four billion people celebrate the Global Day of Cosmic Solidarity, uniting humanity under a single sky of wonder.", climaxFa: "چهار میلیارد انسان روز جهانی همبستگی کیهانی را جشن گرفتند و زیر سقفی از شگفتی و برادری یکی شدند.", xpReward: 280 },
  { pathCode: "AABBB", titleEn: "The Stars That Feel Like Home", titleFa: "ستارگانی که بوی خانه می‌دهند", badgeCategory: "legendary", badgeIcon: "☕", badgeNameFa: "پایان گرم و ابدی", climaxEn: "Sipping coffee by the station window, Paul and Maya look out at a universe that is no longer cold and silent, but warm and full of life.", climaxFa: "با نوشیدن قهوه در کنار پنجره ایستگاه، پل و مایا به کیهانی نگریستند که دیگر سرد و خاموش نبود، بلکه سرشار از مهر و حیات بود.", xpReward: 275 },
  { pathCode: "ABAAA", titleEn: "The Voyage to Alpha Centauri", titleFa: "سفر تاریخی به آلفا قنطورس", badgeCategory: "explorer", badgeIcon: "🚀", badgeNameFa: "پایان گشودن دروازه ستاره‌ها", climaxEn: "Archimedes engages its zero-point gravity drive, departing the Solar System as humanity's first interstellar starship.", climaxFa: "کشتی آرشمیدس با پیشران گرانش صفر از مرزهای منظومه شمسی گذشت؛ نخستین سفینه میان‌ستاره‌ای تاریخ بشر.", xpReward: 280 },
  { pathCode: "ABAAB", titleEn: "The Farewell Ode to Europa", titleFa: "بدرود عاشقانه با اقیانوس یخ", badgeCategory: "legendary", badgeIcon: "📡", badgeNameFa: "پایان شاعرانه و ماندگار", climaxEn: "A final transmission of love echoes into Europa's ice as the starship leaps toward the constellations on gravitational waves.", climaxFa: "آخرین پیام عشق در دل یخ‌های اروپا طنین انداخت هنگامی که فضاپیما بر امواج گرانش به سوی صورت‌های فلکی پر کشید.", xpReward: 275 },
  { pathCode: "ABABA", titleEn: "The Rooftop of Clean Skies", titleFa: "بام آسمان آبی زمین", badgeCategory: "heroic", badgeIcon: "🌤️", badgeNameFa: "پایان آزادی از سوخت فسیلی", climaxEn: "From the rooftop of the UN, world leaders celebrate the complete end of fossil fuels, breathing pristine clean air.", climaxFa: "بر بام سازمان ملل، رهبران جهان پایان همیشگی سوخت‌های فسیلی را در تنفس هوایی بلورین و پاک جشن گرفتند.", xpReward: 275 },
  { pathCode: "ABABB", titleEn: "The Andean Orchard of Peace", titleFa: "باغ آرامش در دامنه‌های آند", badgeCategory: "scholar", badgeIcon: "🍎", badgeNameFa: "پایان معنوی و پرآرامش", climaxEn: "Walking through his Andean apple orchard, Paul smiles at the morning sun, content that his science healed his mother world.", climaxFa: "پل در میان درختان سیب باغش در آند با لبخندی به آفتاب نگریست؛ با قلبی آرام که دانشش زمین مادری را التیام بخشید.", xpReward: 265 },
  { pathCode: "ABBAA", titleEn: "The Jovian Peace Gavel", titleFa: "چکش صلح در مدار مشتری", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان تمدنی بزرگ", climaxEn: "The First Interplanetary Peace Assembly opens aboard Archimedes, turning the Jovian moons into the capital of cosmic harmony.", climaxFa: "نخستین مجمع صلح بین‌سیاره‌ای در ایستگاه آرشمیدس گشوده شد و قمرهای مشتری را به پایتخت همبستگی کیهانی بدل کرد.", xpReward: 280 },
  { pathCode: "ABBAB", titleEn: "The Amber Glow Over the Station", titleFa: "درخشش کهربایی بر فراز ایستگاه", badgeCategory: "heroic", badgeIcon: "✨", badgeNameFa: "پایان باشکوه رفاقت", climaxEn: "Elena and Paul raise their cups as Jupiter’s amber rings light up their faces, forever bonded as pioneers of the stars.", climaxFa: "النا و پل فنجان‌ها را بالا بردند در حالی که نور حلقه‌های کهربایی مشتری چهره‌هایشان را روشن کرده بود؛ پیشگامان جاودان ستارگان.", xpReward: 270 },
  { pathCode: "ABBBA", titleEn: "The Sacred Silence of the Void", titleFa: "سکوت مقدس در دل تاریکی", badgeCategory: "scholar", badgeIcon: "🧘", badgeNameFa: "پایان فلسفی و ژرف", climaxEn: "In the quiet cupola, the crew honors the sacred balance between exploration and reverence, watching the universe breathe.", climaxFa: "در سکوت گنبد رصد، کادر پرواز تعادل مقدس میان کاوشگری و احترام به حیات را به نظاره نشستند؛ تماشای نبض هستی.", xpReward: 275 },
  { pathCode: "ABBBB", titleEn: "The Crew Photograph of Legends", titleFa: "عکس یادگاری اسطوره‌ها", badgeCategory: "legendary", badgeIcon: "📸", badgeNameFa: "پایان تاریخی و افتخارآمیز", climaxEn: "The framed portrait of Paul, Maya, and Ryan against Europa's glowing ice hangs in every school, reminding youth that magic is real.", climaxFa: "تصویر قاب‌گرفته پل، مایا و رایان بر دیوارهای مدارس جهان نشست تا به نسل‌ها بیاموزد شگفتی و امید واقعی است.", xpReward: 275 },
  { pathCode: "BAAAA", titleEn: "The Lanterns of Seven Continents", titleFa: "فانوس‌های هفت قاره در آسمان", badgeCategory: "heroic", badgeIcon: "🏮", badgeNameFa: "پایان الهام‌بخش کودکان", climaxEn: "Millions of violet lanterns float into the night skies of Earth, celebrating the eternal protection of the Europan marine leviathans.", climaxFa: "میلیون‌ها فانوس بنفش در آسمان شب‌های زمین رها شدند؛ جشن حفاظت ابدی از نهنگ‌های مهربان قمر اروپا.", xpReward: 275 },
  { pathCode: "BAAAB", titleEn: "The Ranger of the Abyss", titleFa: "دیده‌بان اقیانوس‌های اعماق", badgeCategory: "explorer", badgeIcon: "🛡️", badgeNameFa: "پایان وظیفه‌شناسی کیهانی", climaxEn: "Archimedes stands permanent sentinel in the polar orbit of Europa, ensuring that no weapon or drill ever pierces the sacred ice.", climaxFa: "ایستگاه آرشمیدس به عنوان دیده‌بان دائمی در مدار اروپا ایستاد تا هیچ مته یا سلاحی به یخ‌های مقدس آسیبی نرساند.", xpReward: 270 },
  { pathCode: "BAABA", titleEn: "The Cannes Golden Palm of Truth", titleFa: "نخل طلای حقیقت در جشنواره کن", badgeCategory: "legendary", badgeIcon: "🌴", badgeNameFa: "پایان هنری و سینمایی", climaxEn: "'Teachers of the Silence' wins the Palme d'Or at Cannes, touching forty million cinema viewers with the beauty of cosmic peace.", climaxFa: "مستند «آموزگاران سکوت» نخل طلای کن را از آن خود کرد و ۴۰ میلیون تماشاگر را مبهوت زیبایی صلح کیهانی ساخت.", xpReward: 280 },
  { pathCode: "BAABB", titleEn: "The Wardroom Tea Fellowship", titleFa: "همدلی فنجان چای در اتاق افسران", badgeCategory: "funny", badgeIcon: "🫖", badgeNameFa: "پایان صمیمی و آرامش‌بخش", climaxEn: "Laughing softly over steaming mugs, Paul and Ryan celebrate the quiet victory of wisdom over conquest in deep space.", climaxFa: "با خنده‌های آرام و چای داغ در دست، پل و رایان پیروزی بی‌صدای خرد بر سلطه‌جویی را در اعماق فضا گرامی داشتند.", xpReward: 260 },
  { pathCode: "BABAA", titleEn: "The Nobel Hall of Stockholm", titleFa: "تالار افتخارات نوبل استکهلم", badgeCategory: "scholar", badgeIcon: "🏅", badgeNameFa: "پایان نجات‌بخش پزشکی", climaxEn: "The Nobel Prize in Medicine celebrates Europa's cellular breakthroughs, saving twenty million human lives each year.", climaxFa: "جایزه نوبل پزشکی دستاوردهای درمانی سلولی اروپا را تجلیل کرد؛ دستاوردی که جان سالانه ۲۰ میلیون انسان را نجات داد.", xpReward: 280 },
  { pathCode: "BABAB", titleEn: "The Leviathan's Gratitude", titleFa: "سپاسگزاری از موجودات اعماق", badgeCategory: "legendary", badgeIcon: "🐋", badgeNameFa: "پایان پیوند پاک زیستی", climaxEn: "In their subglacial grottoes, the gentle leviathans pulse with violet light, forever remembered as the saviors of human health.", climaxFa: "در غارهای زیر یخ‌ها، موجودات غول‌آسا با نور بنفش تپیدند؛ فرشتگانی که تا ابد به عنوان نجات‌بخش سلامت انسان‌ها در یادها ماندند.", xpReward: 275 },
  { pathCode: "BABBA", titleEn: "The Farewell to the Red Spot", titleFa: "بدرود با لکه سرخ مشتری", badgeCategory: "explorer", badgeIcon: "🔭", badgeNameFa: "پایان خاطره‌انگیز رصد", climaxEn: "Archimedes fires its departure engines, heading home to Earth as Jupiter’s great storm spins peacefully into the starlight.", climaxFa: "آرشمیدس موتورهای بازگشت را روشن کرد و به سوی زمین شتافت؛ در حالی که طوفان عظیم مشتری در نور ستارگان آرام می‌چرخید.", xpReward: 275 },
  { pathCode: "BABBB", titleEn: "The Sacred Promise of Return", titleFa: "پیمان مقدس برای بازگشت", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان امیدبخش فردا", climaxEn: "Paul and Maya look back at Europa’s silver crescent, vowing that humanity’s future journeys will always be guided by love.", climaxFa: "پل و مایا به هلال سیمین اروپا نگاه کردند و عهد بستند که سفرهای آینده انسان همیشه با عشق و احترام همراه باشد.", xpReward: 275 },
  { pathCode: "BBAAA", titleEn: "The Interplanetary Nobel Gold", titleFa: "مدال طلای نوبل در مدار مشتری", badgeCategory: "legendary", badgeIcon: "🥇", badgeNameFa: "پایان درخشان علمی", climaxEn: "Paul and Maya hold their gold Nobel medals aboard Archimedes, the first honors presented four hundred million miles from Earth.", climaxFa: "پل و مایا مدال‌های طلای نوبل را در ایستگاه بالا بردند؛ نخستین نشان‌های افتخار که در فاصله ۶۰۰ میلیون کیلومتری از زمین اهدا شدند.", xpReward: 280 },
  { pathCode: "BBAAB", titleEn: "The Galley Berry Toast", titleFa: "سلامتی با توت‌فرنگی‌های فضایی", badgeCategory: "funny", badgeIcon: "🍓", badgeNameFa: "پایان شیرین و خاکی", climaxEn: "Chewing dehydrated strawberries in the microgravity galley, the Nobel laureates laugh with childlike joy at their incredible journey.", climaxFa: "با خوردن توت‌فرنگی‌های خشک در بی‌وزنی غذاخوری، برندگان نوبل با معصومیت کودکانه به مسیر شگفت‌انگیزشان خندیدند.", xpReward: 260 },
  { pathCode: "BBBAA", titleEn: "The Ocean Restoration Trust", titleFa: "بنیاد پاک‌سازی اقیانوس‌های زمین", badgeCategory: "heroic", badgeIcon: "🌊", badgeNameFa: "پایان زیست‌محیطی ماندگار", climaxEn: "Symphony royalties fund forty ocean cleanup flotillas on Earth, restoring pristine coral reefs from the Pacific to the Caribbean.", climaxFa: "عواید سمفونی چهل ناوگان پاک‌سازی اقیانوس‌های زمین را تامین کرد و صخره‌های مرجانی را از اقیانوس آرام تا کارائیب احیا نمود.", xpReward: 275 },
  { pathCode: "BBBAB", titleEn: "The Final Note into Eternity", titleFa: "آخرین نت هم‌نوایی در ابدیت", badgeCategory: "legendary", badgeIcon: "🎼", badgeNameFa: "پایان رویایی موسیقی", climaxEn: "As the last chords of the two-world symphony fade into Europa's ice, the crew rests in the knowledge that beauty transcends all worlds.", climaxFa: "با محو شدن آخرین آکوردهای سمفونی دو جهان در دل یخ‌ها، کادر پرواز در آرامش دریافتند که زیبایی از تمام مرزهای جهان فراتر است.", xpReward: 275 },
  { pathCode: "BBBBA", titleEn: "The Interplanetary Bridge Charter", titleFa: "منشور نخستین پل بین‌سیاره‌ای", badgeCategory: "legendary", badgeIcon: "🌉", badgeNameFa: "پایان تاریخی تمدن‌ها", climaxEn: "Paul, Maya, and Ryan sign their names to the Interplanetary Bridge Charter, sealing an eternal alliance of peace between two worlds.", climaxFa: "پل، مایا و رایان منشور نخستین پل بین‌سیاره‌ای را امضا کردند؛ پیمان ابدی صلح و پیوند میان دو تمدن هوشمند در کیهان.", xpReward: 280 },
  { pathCode: "BBBBB", titleEn: "The Harmony of the Starfield", titleFa: "هارمونی جاودان ستارگان", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان ابدی و آرامش‌بخش", climaxEn: "Clinking mugs in peaceful silence, the three companions watch the stars sparkle in lasting harmony, forever at home in the cosmos.", climaxFa: "با زدن فنجان‌ها به هم در سکوتی لبریز از صلح، سه یار دیرین به چشمک ستارگان نگریستند؛ تا ابد در آغوش پرمهر جهان هستی.", xpReward: 280 },
];

export const story4QuantumStation: AdventureStory = buildAdventureStory({
  id: "c1-quantum-orbital-siphon",
  storyIndex: 4,
  cefr: "C1",
  titleEn: "The Europa Quantum Resonance",
  titleFa: "پژواک کوانتومی در مدار قمر اروپا",
  genre: "scifi",
  genreLabelFa: "🚀 فانتزی و علمی‌تخیلی",
  genreIcon: "🚀",
  synopsisEn:
    "Aboard the orbital research platform Archimedes orbiting Jupiter's frozen moon Europa, astrophysicist Dr. Paul Bennett and quantum engineer Maya Lin detect an impossible mathematical harmonic surging from the subterranean ocean across 32 mind-bending endings.",
  synopsisFa:
    "در ایستگاه فضایی پیشرفته آرشمیدس در مدار قمر یخ‌زده اروپا در سیاره مشتری، دکتر پل بنت و مهندس ارشد کوانتوم مایا لین متوجه امواج هارمونیک ناشناخته‌ای می‌شوند که از اقیانوس زیر پوسته ۲۰ کیلومتری یخ ساطع شده و قوانین پایه‌ای فیزیک امواج را به چالش می‌کشد. ۳۲ پایان ژرف‌نگرانه، پر از شگفتی‌های کیهانی و صلح بین‌ستاره‌ای در انتظارته!",
  coverImage: "/images/skills/reading/c1-quantum-station.webp",
  nodes,
  endings,
});
