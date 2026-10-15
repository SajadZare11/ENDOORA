import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2 (C1 - Adult): The Scriptorium Cipher (راز کتیبه پنهان صومعه آکسفورد)
// Genre: Mystery & Curiosity (معمایی و کنجکاوی)
// CEFR: C1 (Inversion with negative adverbials, mixed conditionals, historical deduction, paleographic mystery)
// Characters: Dr. Clara Vance (Senior Paleographer), Julian Croft (Archival Conservator), Father Thomas (Monastic Archivist)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Deep within the climate-controlled vaults of Oxford's Bodleian Library, Dr. Clara Vance adjusted her binocular stereomicroscope over a fourteenth-century illuminated gospel. For centuries, scholars had assumed the gilded vellum folio contained merely orthodox liturgical antiphons. However, while calibrating a multispectral ultraviolet scan, Clara detected faint micro-inscriptions etched into the gold leaf surrounding the miniature of Saint Jerome. Scarcely had she adjusted the focal prism when the Latin characters resolved into an intricate mathematical cryptogram attributed to Roger Bacon, the legendary Franciscan polymath. Beside her, chief archival conservator Julian Croft leaned over the monitor, his voice trembling: 'Had this manuscript not been selected for binding conservation today, this cipher would have remained buried in the archives for another six hundred years.'",
    keywords: [
      { word: "stereomicroscope", meaningFa: "میکروسکوپ برجسته‌بین دوچشمی برای دیدن عمق", phonetic: "/ˌsteriəʊˈmaɪkrəskəʊp/" },
      { word: "vellum", meaningFa: "پوست مرغوب دست‌ساز برای نگارش کتاب‌های باستانی", phonetic: "/ˈveləm/" },
      { word: "multispectral", meaningFa: "چندطیفی (تصویربرداری با طول موج‌های نوری مختلف)", phonetic: "/ˌmʌltiˈspektrəl/" },
      { word: "polymath", meaningFa: "علامه، دانشمند جامع‌الاطراف و همه‌فن‌حریف", phonetic: "/ˈpɒlimæθ/" },
    ],
    question: {
      promptEn: "What technological method revealed the hidden micro-inscriptions in the gold leaf?",
      promptFa: "چه فناوری پیشرفته‌ای کتیبه‌های رمزی ریز را درون ورق طلای مینیاتور آشکار کرد؟",
      options: [
        "A multispectral ultraviolet scan and stereomicroscope calibration",
        "A chemical acid bath that dissolved the binding glue",
        "A high-frequency acoustic ultrasound probe",
      ],
      correctIndex: 0,
      hintSnippet: "while calibrating a multispectral ultraviolet scan, Clara detected faint micro-inscriptions etched into the gold leaf",
      clueFa: "خط سوم رو ببین دوست من؛ اسکن نوری چندطیفی فرابنفش همراه با تنظیم دقیق میکروسکوپ برجسته‌بین باعث آشکار شدنش شد.",
    },
    choiceA: {
      labelEn: "Cross-reference the mathematical Latin cryptogram with Roger Bacon's cipher wheel in the restricted vault!",
      labelFa: "رمز ریاضی لاتین را با گردونه رمزی تاریخی راجر بیکن در گنجینه محرمانه تطبیق بده!",
      descriptionFa: "رمزگشایی زبان باستانی با ابزارهای ریاضی معتبر سده چهاردهم.",
    },
    choiceB: {
      labelEn: "Analyze the chemical composition of the iridescent gold pigment using X-ray fluorescence spectroscopy!",
      labelFa: "ترکیب شیمیایی رنگدانه‌های طلای هفت‌رنگ را با طیف‌سنجی پرتو ایکس بررسی کن!",
      descriptionFa: "تحلیل علمی مواد سازنده جوهر راز منشأ جغرافیایی و معدن آن را فاش می‌کند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Clara and Julian unlocked the steel grille guarding the library’s rare instrument safe, retrieving Bacon’s 1267 brass cipher wheel. Rotating the concentric brass rings in accordance with the prime number sequence hidden in Saint Jerome’s halo, Clara heard the subtle click of internal alignment. Suddenly, the Latin syllables decoded into a chilling directive: 'Beneath the cloister well of Saint Jude's Priory lies the ocular prism of truth.' Julian stared at her, wide-eyed: Saint Jude's was an abandoned priory located five miles outside the city, scheduled for demolition by commercial property developers in forty-eight hours.",
    keywords: [
      { word: "concentric", meaningFa: "هم‌مرکز (حلقه‌های دایره‌ای درون یکدیگر)", phonetic: "/kənˈsentrɪk/" },
      { word: "directive", meaningFa: "دستورالعمل، رهنمود محرمانه رسمی", phonetic: "/dəˈrektɪv/" },
      { word: "cloister", meaningFa: "صحن سرپوشیده و دالان ستون‌دار صومعه", phonetic: "/ˈklɔɪstər/" },
      { word: "demolition", meaningFa: "تخریب و با خاک یکسان کردن ساختمان", phonetic: "/ˌdeməˈlɪʃn/" },
    ],
    question: {
      promptEn: "What urgent crisis threatened Saint Jude's Priory where the artifact was hidden?",
      promptFa: "چه بحران فوری صومعه سنت جود را که اثر تاریخی در آن پنهان بود تهدید می‌کرد؟",
      options: [
        "It was scheduled for demolition by commercial property developers in forty-eight hours",
        "It was surrounded by rising river floodwaters",
        "It had been seized by an international antiquities cartel",
      ],
      correctIndex: 0,
      hintSnippet: "Saint Jude's was an abandoned priory located five miles outside the city, scheduled for demolition by commercial property developers in forty-eight hours",
      clueFa: "خط آخر رو نگاه کن؛ شرکت‌های ساختمانی قرار بود صومعه تاریخی رو ظرف ۴۸ ساعت آینده با لودر تخریب کنند.",
    },
    choiceA: {
      labelEn: "Secure an emergency archaeological preservation injunction from the High Court at daybreak!",
      labelFa: "حکم قضایی فوری توقف تخریب را به عنوان اثر ملی از دادگاه عالی دریافت کن!",
      descriptionFa: "مسیر رسمی و قانونی برای حفاظت همیشگی از محوطه باستانی.",
    },
    choiceB: {
      labelEn: "Mount an immediate nighttime covert reconnaissance to the abandoned cloister well before dawn!",
      labelFa: "همین امشب و قبل از روشن شدن هوا شناسایی محرمانه چاه صومعه متروکه را آغاز کن!",
      descriptionFa: "سرعت عمل مستقیم قبل از اینکه فرصت طلایی برای همیشه از دست برود.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "The X-ray fluorescence spectrometer completed its sweep, generating an astonishing elemental breakdown. Not only did the pigment contain pure Cornish gold, but it was alloyed with pulverized lapis lazuli and traces of pitchblende—an exceptionally rare radioactive mineral known only to advanced medieval alchemists. Father Thomas, the visiting monastic archivist from Gloucestershire, gasped as the molecular signature appeared: 'This pigment was compounded at the secret scriptorium of Friar William in 1342. Legend says William engineered a stone chamber that could only be opened when touched by the light of a solar eclipse!'",
    keywords: [
      { word: "spectrometer", meaningFa: "طیف‌سنج دقیق عنصری و شیمیایی", phonetic: "/spekˈtrɒmɪtər/" },
      { word: "pulverized", meaningFa: "پودرشده و آسیاب‌شده به ذرات بسیار ریز", phonetic: "/ˈpʌlvəraɪzd/" },
      { word: "pitchblende", meaningFa: "اورانینیت یا سنگ معدنی رادیواکتیو نایاب", phonetic: "/ˈpɪtʃblend/" },
      { word: "compounded", meaningFa: "ترکیب و فرآوری‌شده به شیوه داروسازی سنتی", phonetic: "/kəmˈpaʊndɪd/" },
    ],
    question: {
      promptEn: "What rare mineral in the gold pigment revealed its origin at Friar William's scriptorium?",
      promptFa: "کدام ماده معدنی نایاب در رنگدانه طلا، منشأ آن را در کارگاه مخفی برادر ویلیام فاش کرد؟",
      options: [
        "Traces of pitchblende alloyed with pulverized lapis lazuli",
        "Refined volcanic obsidian flakes",
        "Crushed sapphire dust from Ceylon",
      ],
      correctIndex: 0,
      hintSnippet: "it was alloyed with pulverized lapis lazuli and traces of pitchblende—an exceptionally rare radioactive mineral",
      clueFa: "خط دوم رو ببین رفیق؛ ردپای سنگ معدنی رادیواکتیو پیچ‌بلند همراه با پودر سنگ لاجورد اعلا.",
    },
    choiceA: {
      labelEn: "Consult the Bodleian's 14th-century astronomical almanac to calculate the exact historical eclipse coordinates!",
      labelFa: "گاهشمار نجومی قرن چهاردهم را بررسی کن تا مختصات دقیق زاویه تابش خورشیدگرفتگی باستانی را بیابی!",
      descriptionFa: "محاسبه هندسی دقیق برای باز کردن مکانیزم نوری اتاقک بدون شکستن سنگ‌ها.",
    },
    choiceB: {
      labelEn: "Replicate the precise optical wavelength using a tunable frequency laser in the laboratory!",
      labelFa: "طول موج دقیق نور خورشیدگرفتگی را با لیزر فرکانس متغیر در آزمایشگاه شبیه‌سازی کن!",
      descriptionFa: "استفاده از فناوری مدرن فوتونیک برای تحریک حسگرهای نوری کهن.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "By six in the morning, Clara stood before the High Court judge, presenting the decoded Bacon manuscripts alongside high-resolution spectral imagery. Mesmerized by the academic rigor and historical gravity of the petition, Her Ladyship signed a six-month emergency preservation decree. Armed with the court order, Clara, Julian, and a squad of heritage wardens arrived at Saint Jude’s just as bulldozers were warming their diesel engines. The site foreman grudgingly killed the motors, stepping aside as Clara approached the ivy-strangled stone wellhead in the priory courtyard.",
    keywords: [
      { word: "injunction", meaningFa: "دستور یا حکم قضایی بازدارنده", phonetic: "/ɪnˈdʒʌŋkʃn/" },
      { word: "wardens", meaningFa: "نگهبانان و بازرسان رسمی میراث فرهنگی", phonetic: "/ˈwɔːrdnz/" },
      { word: "grudgingly", meaningFa: "با بی‌میلی، از سر ناچاری و اکراه", phonetic: "/ˈɡrʌdʒɪŋli/" },
      { word: "wellhead", meaningFa: "دهانه سنگی و طوقه باستانی چاه", phonetic: "/ˈwelhed/" },
    ],
    question: {
      promptEn: "What forced the commercial demolition bulldozers to shut down their engines?",
      promptFa: "چه چیزی لودرهای ساختمانی را وادار کرد موتورهایشان را خاموش کنند و کنار بکشند؟",
      options: [
        "A six-month emergency heritage preservation decree signed by the High Court judge",
        "A sudden mechanical engine breakdown across all vehicles",
        "A protest by local university students holding banners",
      ],
      correctIndex: 0,
      hintSnippet: "Her Ladyship signed a six-month emergency preservation decree. Armed with the court order, Clara, Julian, and a squad of heritage wardens arrived",
      clueFa: "خط دوم رو ببین؛ حکم قضایی شش‌ماهه حفاظت اضطراری میراث ملی که قاضی دادگاه عالی صادر کرد.",
    },
    choiceA: {
      labelEn: "Rig a technical tripod pulley and rappel directly down the thirty-meter dry well shaft!",
      labelFa: "سه‌پایه و قرقره نجات فنی را برپا کن و مستقیماً به عمق ۳۰ متری چاه خشک فرود بیا!",
      descriptionFa: "فرود عمودی امن و مجهز به عمق پناهگاه تاریخی زیرزمینی.",
    },
    choiceB: {
      labelEn: "Deploy a remote crawler probe equipped with LiDAR and thermal imaging to map the subterranean masonry!",
      labelFa: "یک ربات کاوشگر شنی‌دار مجهز به اسکنر لیدار و دوربین حرارتی را برای نقشه‌برداری پایین بفرست!",
      descriptionFa: "شناسایی کامل تله‌ها و ساختار دالان‌ها قبل از ورود انسان.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Under the cover of a dense midnight fog, Clara and Julian slipped through the priory's rusty iron gates. Armed with headlamps and portable climbing harnesses, they located the cloister wellhead hidden beneath dense briars. Descending via caving ladders, they reached a subterranean masonry landing at twenty meters depth. In the curved limestone wall, Julian spotted an ornate bronze keyway shaped like an eight-pointed Franciscan star. Above it, a Latin inscription warned: 'Let only the pure of intellect turn the spindle, lest the waters of the Cherwell inundate this crypt.'",
    keywords: [
      { word: "briars", meaningFa: "بوته‌های خاردار متراکم و وحشی", phonetic: "/ˈbraɪərz/" },
      { word: "keyway", meaningFa: "شکاف جا کلیدی قفل‌های مکانیکی", phonetic: "/ˈkiːweɪ/" },
      { word: "spindle", meaningFa: "محور یا میله چرخنده درون قفل", phonetic: "/ˈspɪndl/" },
      { word: "inundate", meaningFa: "غرقاب کردن، به زیر سیلاب بردن", phonetic: "/ˈɪnʌndeɪt/" },
    ],
    question: {
      promptEn: "What catastrophe did the Latin inscription warn would occur if the lock spindle was turned incorrectly?",
      promptFa: "کتیبه لاتین هشدار داد که چرخش اشتباه قفل چه فاجعه‌ای به بار خواهد آورد؟",
      options: [
        "The waters of the Cherwell river would inundate and drown the crypt",
        "A lethal cloud of alchemical poison gas would vent",
        "The ceiling would collapse under five tons of masonry",
      ],
      correctIndex: 0,
      hintSnippet: "lest the waters of the Cherwell inundate this crypt",
      clueFa: "خط آخر رو نگاه کن دوست من؛ هشدار داده بود آب رودخانه چِروِل تمام سرداب را به زیر سیلاب غرق خواهد کرد.",
    },
    choiceA: {
      labelEn: "Insert Bacon's bronze cipher key, turning it counter-clockwise by exactly forty-two degrees!",
      labelFa: "کلید برنجی بیکن را وارد کن و آن را دقیقاً چهل و دو درجه پادساعت‌گرد بچرخان!",
      descriptionFa: "زاویه‌ای که طبق محاسبات نجومی halo سنت جروم محاسبه شده است.",
    },
    choiceB: {
      labelEn: "Temporarily disengage the hydraulic water sluice gate using pneumatic jacks before turning the key!",
      labelFa: "دریچه سیل‌گیر هیدرولیکی آب را با جک‌های پنوماتیک مهار کن و سپس کلید را بچرخان!",
      descriptionFa: "پیشگیری کامل از خطر سیلاب با مهندسی ایمن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Working by candlelight in the Bodleian's Map Room, Father Thomas located the 1342 monastic solar chart. It revealed that during the annular solar eclipse of June 8, 1342, the sun's rays aligned precisely through the rose window of the priory's south transept at three-fifteen in the afternoon. Correlating this with modern geodesic data, Clara realized the beam had been engineered to strike a parabolic quartz reflector embedded inside the crypt altar, focusing a concentrated beam of amber light directly onto a hidden bimetallic latch.",
    keywords: [
      { word: "transept", meaningFa: "بال یا بازوی متقاطع کلیسا در معماری گوتیک", phonetic: "/ˈtrænsept/" },
      { word: "geodesic", meaningFa: "ژئودزیک (مربوط به هندسه و انحنای زمین)", phonetic: "/ˌdʒiːəʊˈdesɪk/" },
      { word: "parabolic", meaningFa: "سهموی (آینه‌های مقعر متمرکزکننده پرتوهای نور)", phonetic: "/ˌpærəˈbɒlɪk/" },
      { word: "bimetallic", meaningFa: "دوفلزی (مکانیزمی که با انبساط حرارتی دو فلز فعال می‌شود)", phonetic: "/ˌbaɪmɪˈtælɪk/" },
    ],
    question: {
      promptEn: "What optical mechanism did the medieval monks design to trigger the hidden latch?",
      promptFa: "راهبان قرون وسطی چه مکانیزم نوری را برای باز کردن قفل مخفی طراحی کرده بودند؟",
      options: [
        "A parabolic quartz reflector focusing concentrated amber sunlight onto a bimetallic latch",
        "A magnifying glass focusing candlelight onto a gunpowder fuse",
        "A water mirror reflecting moonlight onto an acoustic crystal",
      ],
      correctIndex: 0,
      hintSnippet: "engineered to strike a parabolic quartz reflector embedded inside the crypt altar, focusing a concentrated beam of amber light directly onto a hidden bimetallic latch",
      clueFa: "خطوط سوم و چهارم رو ببین؛ یک بازتابنده کوارتز سهموی که نور کهربایی را روی یک ضامن دوفلزی حساس به گرما متمرکز می‌کرد.",
    },
    choiceA: {
      labelEn: "Wait for the afternoon sun and use precision mirrors to recreate the exact 1342 angle of incidence!",
      labelFa: "منتظر آفتاب بعدازظهر بمان و با آینه‌های زاویه‌سنج زاویه تابش تاریخی سال ۱۳۴۲ را بازآفرینی کن!",
      descriptionFa: "روش طبیعی و باشکوه که نور خورشید را با همان ظرافت باستانی بازمی‌تاباند.",
    },
    choiceB: {
      labelEn: "Mount a calibrated solar-spectrum spotlight to trip the bimetallic latch immediately!",
      labelFa: "پروژکتور شبیه‌ساز طیف خورشید را روشن کن تا بدون معطلی ضامن دوفلزی را فعال کند!",
      descriptionFa: "صرفه‌جویی در ساعت‌ها انتظار و دستیابی سریع به محتویات اتاقک.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Inside the photonics laboratory, Clara calibrated the tunable titanium-sapphire laser to the exact five-hundred-and-eighty-nanometer wavelength of eclipse-filtered solar light. Transporting the portable laser rig to the priory crypt, Julian aimed the coherent amber beam directly at the quartz crystal set into the altar masonry. As the photons energized the crystal matrix, a deep, harmonic hum resonated through the stone floor. Slowly, with the graceful precision of ancient water clocks, a two-ton granite sarcophagus slid aside, revealing a spiral staircase leading into the subterranean scriptorium.",
    keywords: [
      { word: "photonics", meaningFa: "علم فوتونیک و فناوری کنترل فوتون‌های نور", phonetic: "/fəˈtɒnɪks/" },
      { word: "coherent", meaningFa: "همدوس (امواج نوری هم‌فاز و متمرکز لیزر)", phonetic: "/kəʊˈhɪərənt/" },
      { word: "sarcophagus", meaningFa: "تابوت سنگی بزرگ و باستانی", phonetic: "/sɑːrˈkɒfəɡəs/" },
      { word: "water clocks", meaningFa: "ساعت‌های آبی دقیق دنیای باستان (کلپسیدرا)", phonetic: "/ˈwɔːtər klɒks/" },
    ],
    question: {
      promptEn: "What happened when the coherent laser beam energized the altar's quartz crystal?",
      promptFa: "وقتی پرتو لیزر همدوس کریستال کوارتز محراب را فعال کرد چه اتفاقی افتاد؟",
      options: [
        "A deep hum resonated and a two-ton granite sarcophagus slid aside, revealing a spiral staircase",
        "The crystal shattered into glowing dust and blinded the sensors",
        "An alarm bell chimed in the cathedral tower miles away",
      ],
      correctIndex: 0,
      hintSnippet: "a deep, harmonic hum resonated through the stone floor. Slowly, with the graceful precision of ancient water clocks, a two-ton granite sarcophagus slid aside, revealing a spiral staircase",
      clueFa: "خط آخر رو نگاه کن رفیق؛ طنینی هارمونیک در زمین پیچید و سنگ قبر دو تنی به نرمی کنار رفت و پلکان مارپیچ مخفی پدیدار شد.",
    },
    choiceA: {
      labelEn: "Descend the spiral staircase equipped with positive-pressure air respirators and conservation kits!",
      labelFa: "با دستگاه‌های تنفسی فشار مثبت و کیت‌های مرمت اسناد از پلکان مارپیچ پایین برو!",
      descriptionFa: "ایمنی صددرصد برای تنفس هوای حبس‌شده ۶۰۰ ساله و حفاظت از دست‌نوشته‌ها.",
    },
    choiceB: {
      labelEn: "Stabilize the ancient underground chamber atmosphere using inert nitrogen gas infusion!",
      labelFa: "جو اتاقک باستانی را با تزریق گاز نیتروژن خنثی پایدار کن تا از اکسیداسیون جوهر جلوگیری شود!",
      descriptionFa: "بالاترین سطح استانداردهای حفاظت از میراث خطی در جهان.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Lowering down the well shaft in technical harnesses, Clara and Julian stepped into an immaculate fourteenth-century vaulted library chamber. On a carved oak lectern stood a silver chest sealed with the wax insignia of King Edward III. Beside it lay Roger Bacon's lost treatise: 'Opus Majus Pars Octava'—the suppressed eighth volume detailing experimental lens manufacturing and proto-telescopes three centuries before Galileo. Clara’s breath hitched: this discovery would rewrite the history of Western scientific methodology.",
    keywords: [
      { word: "lectern", meaningFa: "پایه‌کتاب، رحل چوبی مخصوص مطالعه کتاب‌های بزرگ", phonetic: "/ˈlektərn/" },
      { word: "treatise", meaningFa: "رساله پژوهشی و کتاب علمی مفصل", phonetic: "/ˈtriːtɪs/" },
      { word: "proto-telescopes", meaningFa: "تلسکوپ‌های نخستین و ابزارهای بزرگ‌نمایی آغازین", phonetic: "/ˈprəʊtəʊ ˈtelɪskəʊps/" },
      { word: "methodology", meaningFa: "روش‌شناسی، اصول پژوهش علمی", phonetic: "/ˌmeθəˈdɒlədʒi/" },
    ],
    question: {
      promptEn: "What world-changing manuscript lay on the oak lectern in the vaulted chamber?",
      promptFa: "کدام دست‌نوشته دگرگون‌کننده تاریخ علم روی رحل بلوط قرار داشت؟",
      options: [
        "Roger Bacon's lost Opus Majus Pars Octava on lenses and proto-telescopes",
        "A handwritten diary of King Arthur",
        "An encrypted map of Atlantis",
      ],
      correctIndex: 0,
      hintSnippet: "Roger Bacon's lost treatise: 'Opus Majus Pars Octava'—the suppressed eighth volume detailing experimental lens manufacturing and proto-telescopes three centuries before Galileo",
      clueFa: "خط دوم رو ببین؛ جلد هشتم گمشده کتاب شاهکار راجر بیکن درباره ساخت عدسی‌ها و تلسکوپ‌های سه قرن قبل از گالیله!",
    },
    choiceA: {
      labelEn: "Transmit encrypted digital scans to Oxford University Press for immediate academic publication!",
      labelFa: "اسکن‌های رمزگذاری‌شده دیجیتال را فوراً برای انتشار به انتشارات دانشگاه آکسفورد ارسال کن!",
      descriptionFa: "رساندن بی‌درنگ این کشف علمی بزرگ به دست پژوهشگران سراسر جهان.",
    },
    choiceB: {
      labelEn: "Display the silver chest and manuscript in an airtight argon glass case at the Bodleian Great Hall!",
      labelFa: "جعبه نقره‌ای و دست‌نوشته را در ویترین شیشه‌ای ضدگلوله حاوی گاز آرگون در تالار بزرگ به نمایش بگذار!",
      descriptionFa: "حفاظت ابدی و امکان بازدید میلیون‌ها نفر از این گنجینه تکرارنشدنی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "The miniature LiDAR crawler navigated the subterranean gallery, sending back three-dimensional point-cloud data to Julian’s rugged laptop. Not only did the masonry feature advanced rib vaulting, but the walls were lined with thousands of labeled ceramic jars containing medieval botanical extracts, metallurgical catalysts, and crystal prisms. What amazed the team was an intact mechanical planetary orrery powered by a subterranean thermal siphon—still ticking quietly after six centuries.",
    keywords: [
      { word: "point-cloud", meaningFa: "ابر نقاط سه‌بعدی حاصل از اسکن لیدار", phonetic: "/pɔɪnt klaʊd/" },
      { word: "orrery", meaningFa: "افلاک‌نما، مدل مکانیکی منظومه شمسی با چرخ‌دنده‌ها", phonetic: "/ˈɒrəri/" },
      { word: "metallurgical", meaningFa: "فلزکاری و متالورژی کهن", phonetic: "/ˌmetəˈlɜːrdʒɪkl/" },
      { word: "siphon", meaningFa: "سیفون و لوله انتقال مکانیکی مایعات", phonetic: "/ˈsaɪfn/" },
    ],
    question: {
      promptEn: "What extraordinary medieval mechanical device was discovered still operating in the vault?",
      promptFa: "کدام دستگاه مکانیکی قرون وسطایی شگفت‌انگیز کشف شد که هنوز پس از ۶۰۰ سال کار می‌کرد؟",
      options: [
        "A mechanical planetary orrery powered by a subterranean thermal siphon",
        "A steam-driven textile loom",
        "An automatic clockwork musical organ",
      ],
      correctIndex: 0,
      hintSnippet: "an intact mechanical planetary orrery powered by a subterranean thermal siphon—still ticking quietly after six centuries",
      clueFa: "خط آخر رو نگاه کن؛ یک افلاک‌نمای مکانیکی منظومه شمسی که با انرژی حرارتی زمین هنوز بی‌صدا می‌چرخید.",
    },
    choiceA: {
      labelEn: "Invite international horologists and astronomers to study the medieval planetary orrery!",
      labelFa: "ساعت‌سازان و ستاره‌شناسان تراز اول جهان را برای بررسی این افلاک‌نما دعوت کن!",
      descriptionFa: "کشف رازهای مهندسی مکانیک پیشرفته در قرون وسطی.",
    },
    choiceB: {
      labelEn: "Establish an underground subterranean museum directly inside the preserved priory vaults!",
      labelFa: "یک موزه زیرزمینی دائمی دقیقاً در دل دالان‌های بازسازی‌شده صومعه برپا کن!",
      descriptionFa: "تجربه‌ای زنده و بی‌واسطه از قدم زدن در تاریخ قرن چهاردهم.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "With a breath of reverent concentration, Clara aligned the eight-pointed key and turned it forty-two degrees counter-clockwise. Heavy counterweights swung silently inside the limestone wall. Instead of a devastating deluge of river water, an ingenious acoustic siphon opened, draining the ancient moisture away through subterranean gravel channels. A concealed oak portal swung ajar, revealing an alchemical laboratory lined with emerald glassware, copper distillation alembics, and notebooks written in Bacon’s unmistakable cursive cipher.",
    keywords: [
      { word: "reverent", meaningFa: "همراه با احترام عمیق و خضوع", phonetic: "/ˈrevərənt/" },
      { word: "deluge", meaningFa: "سیلاب خروشان، طغیان ناگهانی آب", phonetic: "/ˈdeljuːdʒ/" },
      { word: "alembics", meaningFa: "انبیق‌های تقطیر مسی مخصوص کیمیاگری کهن", phonetic: "/əˈlembɪks/" },
      { word: "cursive", meaningFa: "خط شکسته، دست‌خط پیوسته", phonetic: "/ˈkɜːrsɪv/" },
    ],
    question: {
      promptEn: "What apparatus was revealed inside the opened alchemical laboratory?",
      promptFa: "چه ابزارهایی درون آزمایشگاه کیمیاگری تازه گشوده‌شده نمایان شد؟",
      options: [
        "Emerald glassware, copper distillation alembics, and Bacon's cursive notebooks",
        "Iron armors and medieval broadswords",
        "Crates of Roman silver denarii coins",
      ],
      correctIndex: 0,
      hintSnippet: "revealing an alchemical laboratory lined with emerald glassware, copper distillation alembics, and notebooks written in Bacon’s unmistakable cursive cipher",
      clueFa: "خط آخر رو بخون؛ ظروف شیشه‌ای زمردین، انبیق‌های تقطیر مسی و دفترچه‌های دست‌نویس با خط رمزی راجر بیکن.",
    },
    choiceA: {
      labelEn: "Decipher Bacon's handwritten notebooks on botanical pharmacology and herbal cures!",
      labelFa: "یادداشت‌های دست‌نویس بیکن درباره داروسازی گیاهی و درمان‌های سنتی را رمزگشایی کن!",
      descriptionFa: "دستیابی به فرمول‌های دارویی شگفت‌انگیز کهن برای طب مدرن.",
    },
    choiceB: {
      labelEn: "Catalog and preserve the intact 13th-century glassware for the British Museum of Science!",
      labelFa: "ظروف شیشه‌ای دست‌نخورده قرن سیزدهم را برای موزه علوم لندن فهرست‌نویسی و محافظت کن!",
      descriptionFa: "حفظ سالم‌ترین مجموعه تجهیزات آزمایشگاهی تاریخ اروپا.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Julian positioned two high-capacity hydraulic struts against the water barrier, bracing the masonry with steel spreader plates. With the flood risk completely neutralized, Clara turned the key without fear. The vault locks disengaged with a solid brass thud. Inside, they found a pristine workshop containing not only medieval scientific apparatus, but a bronze astrolabe of breathtaking accuracy inscribed with the coordinates of thirty-two stars known only to Persian astronomers of the Maragheh Observatory.",
    keywords: [
      { word: "struts", meaningFa: "پایه‌ها و جک‌های محکم نگهدارنده هیدرولیکی", phonetic: "/strʌts/" },
      { word: "disengaged", meaningFa: "رها شد، قفل باز شد", phonetic: "/ˌdɪsɪnˈɡeɪdʒd/" },
      { word: "astrolabe", meaningFa: "اسطرلاب (ابزار کهن نجومی برای رصد ستارگان)", phonetic: "/ˈæstrəleɪb/" },
      { word: "coordinates", meaningFa: "مختصات دقیق جغرافیایی و فلکی", phonetic: "/kəʊˈɔːrdɪnəts/" },
    ],
    question: {
      promptEn: "What remarkable foreign scientific connection was inscribed on the bronze astrolabe?",
      promptFa: "چه پیوند علمی شگفت‌انگیز با دانشمندان خارجی روی اسطرلاب برنجی حک شده بود؟",
      options: [
        "Star coordinates known to Persian astronomers of the Maragheh Observatory",
        "Hieroglyphs from the Library of Alexandria",
        "Chinese navigation marks from the Ming fleet",
      ],
      correctIndex: 0,
      hintSnippet: "inscribed with the coordinates of thirty-two stars known only to Persian astronomers of the Maragheh Observatory",
      clueFa: "خط آخر متن رو ببین دوست من؛ مختصات ۳۲ ستاره که منحصراً در رصدخانه مراغه توسط دانشمندان ایرانی رصد شده بود.",
    },
    choiceA: {
      labelEn: "Publish an international monograph on medieval Anglo-Persian scientific exchanges!",
      labelFa: "رساله پژوهشی بین‌المللی درباره تبادلات علمی انگلیس و ایران در قرون وسطی منتشر کن!",
      descriptionFa: "اثبات پل‌های تاریخی دانش و همکاری میان شرق و غرب.",
    },
    choiceB: {
      labelEn: "Present the Maragheh-linked astrolabe to the Royal Astronomical Society in London!",
      labelFa: "این اسطرلاب بی‌نظیر را به انجمن سلطنتی نجوم در لندن اهدا کن!",
      descriptionFa: "نگینی درخشان در تاریخ ستاره‌شناسی جهان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "As the afternoon sun reached three-fifteen, Clara adjusted the polished silver heliostat mirrors on the church floor. A brilliant golden beam lanced through the south transept rose window, striking the quartz reflector in the altar. Instantly, the focused amber beam energized the bimetallic latch. With a sharp metallic ping, a heavy limestone panel swung outward. Within rested a velvet-lined rosewood box containing Bacon's personal optical reading spectacles and his handwritten manifesto: 'On the Experimental Verification of Nature.'",
    keywords: [
      { word: "heliostat", meaningFa: "هلیوستات (دستگاه آینه‌ای دنبال‌کننده خودکار نور خورشید)", phonetic: "/ˈhiːliəstæt/" },
      { word: "lanced", meaningFa: "همچون نیزه شکافت و به جلو تابید", phonetic: "/lɑːnst/" },
      { word: "spectacles", meaningFa: "عینک‌های ذره‌بینی دستی کهن", phonetic: "/ˈspektəklz/" },
      { word: "verification", meaningFa: "آزمون، راستی‌آزمایی و اثبات تجربی", phonetic: "/ˌverɪfɪˈkeɪʃn/" },
    ],
    question: {
      promptEn: "What personal items belonging to Roger Bacon were revealed inside the rosewood box?",
      promptFa: "چه وسایل شخصی متعلق به راجر بیکن درون جعبه چوب رز پدیدار شد؟",
      options: [
        "His personal optical spectacles and his manifesto 'On the Experimental Verification of Nature'",
        "His silver signet ring and a bag of medieval coins",
        "A feather quill and a flask of holy water",
      ],
      correctIndex: 0,
      hintSnippet: "containing Bacon's personal optical reading spectacles and his handwritten manifesto: 'On the Experimental Verification of Nature'",
      clueFa: "خط آخر رو نگاه کن؛ عینک مطالعه اپتیکال شخصی بیکن همراه با مانیفست دست‌نویس او درباره آزمون تجربی طبیعت.",
    },
    choiceA: {
      labelEn: "Endow the Roger Bacon Chair in Experimental Physics at Oxford University!",
      labelFa: "کرسی استادی دائمی راجر بیکن در فیزیک تجربی را در دانشگاه آکسفورد پایه‌گذاری کن!",
      descriptionFa: "افتخاری ماندگار برای پیشگام تجربه و مشاهده علمی در جهان.",
    },
    choiceB: {
      labelEn: "Take high-resolution spectral photographs of the manifesto for an interactive global web archive!",
      labelFa: "عکس‌های طیف‌نگاری با وضوح فوق‌العاده از مانیفست تهیه کن تا در آرشیو جهانی آنلاین قرار گیرد!",
      descriptionFa: "دسترسی رایگان همه عاشقان علم در جهان به اصل سند کهن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "The calibrated solar spotlight struck the parabolic quartz with blinding intensity. The simulated 1342 wavelength tripped the bimetallic spring mechanism in less than ten seconds. The altar base swung aside to reveal a subterranean chamber whose walls were covered in intricate gilded astrological diagrams. Father Thomas, kneeling by the entrance, whispered a prayer of thanksgiving: 'What was hidden from the darkness of prejudice is now returned to the light of knowledge.'",
    keywords: [
      { word: "simulated", meaningFa: "شبیه‌سازی‌شده با ابزار دقیق", phonetic: "/ˈsɪmjuleɪtɪd/" },
      { word: "astrological", meaningFa: "نجومی و طالع‌شناختی کهن", phonetic: "/ˌæstrəˈlɒdʒɪkl/" },
      { word: "prejudice", meaningFa: "تعصب، پیش‌داوری و کوته‌فکری", phonetic: "/ˈpredʒədɪs/" },
      { word: "gilded", meaningFa: "زراندود، پوشیده از ورق‌های زرین طلا", phonetic: "/ˈɡɪldɪd/" },
    ],
    question: {
      promptEn: "What adorned the walls of the subterranean chamber revealed by the spotlight?",
      promptFa: "دیوارهای اتاقک زیرزمینی که با نور پروژکتور گشوده شد با چه چیزهایی آراسته شده بود؟",
      options: [
        "Intricate gilded astrological diagrams spanning the entire masonry",
        "Carvings of mythical sea monsters",
        "Inscriptions of ancient medieval taxes",
      ],
      correctIndex: 0,
      hintSnippet: "walls were covered in intricate gilded astrological diagrams",
      clueFa: "خط دوم رو ببین دوست من؛ دیاگرام‌ها و نقشه‌های فلکی زراندود فوق‌العاده دقیق بر سراسر دیوارهای سنگی.",
    },
    choiceA: {
      labelEn: "Restore the golden astrological frescoes using reversible micro-laser cleaning!",
      labelFa: "نقاشی‌های دیواری زرین را با فناوری پاک‌سازی لیزری برگشت‌پذیر مرمت کن!",
      descriptionFa: "احیای درخشش طلایی نقوش بدون کمترین آسیب به بافت باستانی.",
    },
    choiceB: {
      labelEn: "Publish a documentary series exploring the medieval origins of modern science!",
      labelFa: "ساخت یک مجموعه مستند فاخر تلویزیونی درباره ریشه‌های علم نوین را کلید بزن!",
      descriptionFa: "روایت جذاب تلاش‌های دانشمندان پیشگام برای مخاطبان امروزی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Equipped with positive-pressure respirators, Clara and Julian descended into the oxygen-sealed scriptorium. The air was dry, scented with beeswax and sandalwood. On oak drafting tables rested drafting compasses, unrolled parchment maps of the Atlantic ocean drawn two centuries before Columbus, and Bacon's prototype compound microscope. Clara touched Julian's arm in awe: 'History recorded that Bacon was imprisoned for his unorthodox science, but here he built a private sanctuary where knowledge could survive untouched.'",
    keywords: [
      { word: "respirators", meaningFa: "دستگاه‌های تنفسی اکسیژن و محافظ ریه", phonetic: "/ˈrespəreɪtərz/" },
      { word: "unorthodox", meaningFa: "غیرمتعارف، بدعت‌گذار و خارج از چارچوب سنتی", phonetic: "/ʌnˈɔːrθədɒks/" },
      { word: "sandalwood", meaningFa: "چوب صندل خوشبو و محافظ در برابر حشرات", phonetic: "/ˈsændlwʊd/" },
      { word: "sanctuary", meaningFa: "پناهگاه امن، مأمن آرامش", phonetic: "/ˈsæŋktʃuəri/" },
    ],
    question: {
      promptEn: "What pre-Columbian navigational artifacts were discovered on the drafting tables?",
      promptFa: "چه اسناد ناوبری شگفت‌انگیزی پیش از کلمب روی میزهای طراحی پیدا شد؟",
      options: [
        "Unrolled parchment maps of the Atlantic Ocean drawn two centuries before Columbus",
        "A golden compass belonging to Viking explorers",
        "A nautical chart of the Indian Ocean reefs",
      ],
      correctIndex: 0,
      hintSnippet: "unrolled parchment maps of the Atlantic ocean drawn two centuries before Columbus, and Bacon's prototype compound microscope",
      clueFa: "خط دوم رو بخون؛ نقشه‌های پوستی بازشده از اقیانوس اطلس که دو قرن قبل از کریستف کلمب ترسیم شده بودند!",
    },
    choiceA: {
      labelEn: "Present the Atlantic maps at the International Cartographic Congress in Lisbon!",
      labelFa: "نقشه‌های اقیانوس اطلس را در کنگره بین‌المللی نقشه‌نگاری در لیسبون ارائه بده!",
      descriptionFa: "دگرگون کردن تاریخ سفرهای دریایی و نقشه‌برداری کهن.",
    },
    choiceB: {
      labelEn: "Found the Oxford Institute for Pre-Modern Scientific Cartography!",
      labelFa: "موسسه پژوهشی نقشه‌نگاری علمی پیشامدرن را در دانشگاه آکسفورد تاسیس کن!",
      descriptionFa: "قطب جهانی تحقیق پیرامون نقشه‌های کهن و اکتشافات اولیه بشر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "The inert nitrogen infusion successfully stabilized the underground atmosphere, preventing atmospheric degradation of delicate organic artifacts. Working in temperature-monitored clean-room suits, Clara cataloged forty-eight leather-bound folios containing lost translations of ancient Greek and Arabic mathematics. Father Thomas and Julian carefully packed the folios into hermetic climate cases. Julian smiled through his visor: 'Clara, we have rescued not merely parchment, but the very bridge between the ancient and modern worlds.'",
    keywords: [
      { word: "degradation", meaningFa: "فرسایش، تجزیه و زوال تدریجی ناشی از هوا", phonetic: "/ˌdeɡrəˈdeɪʃn/" },
      { word: "hermetic", meaningFa: "هوابندی‌شده، کاملاً نفوذناپذیر در برابر گاز و رطوبت", phonetic: "/hɜːrˈmetɪk/" },
      { word: "infusion", meaningFa: "تزریق تدریجی گاز یا مایع به محیط", phonetic: "/ɪnˈfjuːʒn/" },
      { word: "visor", meaningFa: "محافظ شیشه‌ای شفاف کلاه ایمنی", phonetic: "/ˈvaɪzər/" },
    ],
    question: {
      promptEn: "What treasures were contained inside the forty-eight leather-bound folios?",
      promptFa: "چه گنجینه‌هایی درون ۴۸ جلد کتاب چرمی باستانی قرار داشت؟",
      options: [
        "Lost translations of ancient Greek and Arabic mathematics",
        "Inventories of medieval abbey land holdings",
        "Hymns composed for royal coronations",
      ],
      correctIndex: 0,
      hintSnippet: "cataloged forty-eight leather-bound folios containing lost translations of ancient Greek and Arabic mathematics",
      clueFa: "خط دوم رو ببین رفیق؛ ترجمه‌های گمشده از متون ریاضی یونان باستان و دانشمندان جهان اسلام.",
    },
    choiceA: {
      labelEn: "Digitize and open-source all forty-eight folios in high resolution for global researchers!",
      labelFa: "تمام ۴۸ جلد را با کیفیت بی‌نظیر اسکن کرده و به صورت متن‌باز در اختیار دانشمندان دنیا بگذار!",
      descriptionFa: "دموکراتیزه کردن علم و اشتراک رایگان دانش برای تمام بشریت.",
    },
    choiceB: {
      labelEn: "Organize a global traveling exhibition titled 'The Great Bridge of Knowledge'!",
      labelFa: "نمایشگاه گردشی بین‌المللی با عنوان «پل بزرگ دانش» را در پایتخت‌های جهان برپا کن!",
      descriptionFa: "الهام‌بخشی به نسل‌ها درباره پیوند عمیق فرهنگ‌ها از طریق علم.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Oxford University Press published the critical edition of 'Opus Majus Pars Octava' within three months, triggering a worldwide renaissance in the history of optics. Reviewers in Nature and Science praised Clara and Julian's paleographic brilliance. Standing before a packed auditorium at the Sheldonian Theatre, Clara received the prestigious Bodley Medal, remarking: 'When we listen to the quiet whispers of the archives, we realize that human genius never dies; it simply waits for the light of patience.'",
    keywords: [
      { word: "renaissance", meaningFa: "رنسانس، نوزایی و تجدید حیات علمی", phonetic: "/rɪˈneɪsns/" },
      { word: "paleographic", meaningFa: "دیرینه‌شناسی دست‌نوشته‌ها و خطوط کهن", phonetic: "/ˌpeɪliəˈɡræfɪk/" },
      { word: "prestigious", meaningFa: "معتبر، باپرستیژ و پرافتخار", phonetic: "/preˈstɪdʒəs/" },
      { word: "auditorium", meaningFa: "تالار اجتماعات بزرگ سخنرانی", phonetic: "/ˌɔːdɪˈtɔːriəm/" },
    ],
    question: {
      promptEn: "What medal was awarded to Clara at Oxford's Sheldonian Theatre?",
      promptFa: "چه نشان افتخاری در تئاتر شلدونیان آکسفورد به کلارا اهدا شد؟",
      options: [
        "The prestigious Bodley Medal",
        "The Royal Navy Navigation Cross",
        "The City of London Civic Cup",
      ],
      correctIndex: 0,
      hintSnippet: "Clara received the prestigious Bodley Medal, remarking: 'When we listen to the quiet whispers of the archives'",
      clueFa: "خط سوم رو ببین؛ مدال معتبر و پرافتخار بادلین (Bodley Medal) از سوی دانشگاه آکسفورد.",
    },
    choiceA: {
      labelEn: "Deliver the keynote address at the World Science History Congress in Cambridge!",
      labelFa: "سخنرانی افتتاحیه کنگره جهانی تاریخ علم را در کمبریج ایراد کن!",
      descriptionFa: "درخشش برترین پژوهشگر سال در میان برترین دانشمندان زمین.",
    },
    choiceB: {
      labelEn: "Toast this lifetime breakthrough with Julian over quiet port in the Bodleian courtyard!",
      labelFa: "این پیروزی علمی ماندگار را با جولیان در آرامش صحن تاریخی کتابخانه جشن بگیر!",
      descriptionFa: "لحظاتی سرشار از غرور حرفه‌ای و رفاقت دانشگاهی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The airtight argon vitrine housing the silver chest and Bacon's manuscript became the crowning attraction of the Bodleian Great Hall. Under protective low-lux fiber-optic lighting, two million visitors a year filed past the gold-leaf cipher of Saint Jerome. A young student, gazing at the illuminated folio, turned to her teacher with shining eyes, inspired to study ancient languages. Clara, watching from the gallery balcony, smiled quietly: the cipher had fulfilled its ultimate destiny—to awaken the flame of curiosity in young souls.",
    keywords: [
      { word: "vitrine", meaningFa: "ویترین شیشه‌ای ضدگلوله و ایزوله موزه", phonetic: "/vɪˈtriːn/" },
      { word: "low-lux", meaningFa: "نور ملایم با لوکس پایین برای جلوگیری از رنگ‌پریدگی کاغذ", phonetic: "/ləʊ lʌks/" },
      { word: "destiny", meaningFa: "سرنوشت، هدف غایی و رسالت نهایی", phonetic: "/ˈdestəni/" },
      { word: "awakened", meaningFa: "بیدار کرد، مشتعل ساخت", phonetic: "/əˈweɪkənd/" },
    ],
    question: {
      promptEn: "What was the cipher's ultimate destiny according to Clara as she watched museum visitors?",
      promptFa: "به باور کلارا رسالت نهایی این رمز تاریخی در نگاه بازدیدکنندگان موزه چه بود؟",
      options: [
        "To awaken the flame of curiosity in young souls",
        "To increase ticket revenues for the county council",
        "To settle political arguments about medieval property rights",
      ],
      correctIndex: 0,
      hintSnippet: "the cipher had fulfilled its ultimate destiny—to awaken the flame of curiosity in young souls",
      clueFa: "جمله آخر رو بخون دوست من؛ بیدار کردن شعله اشتیاق و کنجکاوی در دل جوانان.",
    },
    choiceA: {
      labelEn: "Launch the Bodleian Junior Fellowship to mentor young manuscript cryptographers!",
      labelFa: "بورسیه پژوهشگران نوجوان بادلین را برای آموزش رمزگشایی به نسل جدید تاسیس کن!",
      descriptionFa: "پرورش کارآگاهان آینده دنیای متون باستانی.",
    },
    choiceB: {
      labelEn: "Publish an illustrated volume on the discovery for school libraries across the country!",
      labelFa: "کتاب مصور ماجرای کشف رمز را برای تمام کتابخانه‌های مدارس کشور چاپ کن!",
      descriptionFa: "آشنا کردن هزاران نوجوان با هیجان پژوهش و کشف.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Sixty of the world's preeminent mechanical horologists and astrophysicists gathered in Saint Jude's vault to marvel at the thermal planetary orrery. With precision gears made of hardened gunmetal and polished obsidian planets revolving in fluid harmony, the apparatus tracked orbital motions with an accuracy rivaling contemporary atomic timepieces. A joint white paper in Nature Astronomy confirmed that medieval Franciscan scholars had achieved mechanical computing capabilities centuries ahead of their era.",
    keywords: [
      { word: "preeminent", meaningFa: "سرآمد، برجسته و در رتبه نخست", phonetic: "/priːˈemɪnənt/" },
      { word: "gunmetal", meaningFa: "برنز محکم و صیقلی مخصوص توپ‌های جنگی و چرخ‌دنده‌ها", phonetic: "/ˈɡʌnmetl/" },
      { word: "white paper", meaningFa: "گزارش جامع و مقاله معتبر مرجع علمی", phonetic: "/waɪt ˈpeɪpər/" },
      { word: "computing", meaningFa: "محاسبات ماشینی و رایانشی", phonetic: "/kəmˈpjuːtɪŋ/" },
    ],
    question: {
      promptEn: "What groundbreaking conclusion did the joint white paper in Nature Astronomy reach?",
      promptFa: "گزارش مرجع علمی در نیچر آسترونومی به چه نتیجه شگفت‌آوری رسید؟",
      options: [
        "That medieval Franciscan scholars had achieved mechanical computing capabilities centuries ahead of their era",
        "That the planets were made of melted Roman gold coins",
        "That the mechanism was powered by an alien electrical battery",
      ],
      correctIndex: 0,
      hintSnippet: "confirmed that medieval Franciscan scholars had achieved mechanical computing capabilities centuries ahead of their era",
      clueFa: "خط آخر رو ببین؛ دانشمندان قرون وسطی قرن‌ها پیش از عصر مدرن به توانایی رایانش مکانیکی دست یافته بودند.",
    },
    choiceA: {
      labelEn: "Present the historical orrery at the Royal Observatory in Greenwich under world spotlight!",
      labelFa: "افلاک‌نمای تاریخی را در رصدخانه سلطنتی گرینویچ در برابر چشمان جهانیان به نمایش بگذار!",
      descriptionFa: "افتخاری ماندگار در مهد زمان و ستاره‌شناسی مدرن.",
    },
    choiceB: {
      labelEn: "Establish a high-tech university laboratory dedicated to studying ancient kinetic mechanisms!",
      labelFa: "آزمایشگاه فوق‌پیشرفته دانشگاهی را برای کشف اسرار ماشین‌های متحرک کهن افتتاح کن!",
      descriptionFa: "پیوند فناوری‌های باستانی با نوآوری‌های مهندسی فردا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Saint Jude’s Priory was transformed into an extraordinary underground heritage site, visited by hundreds of thousands of international cultural pilgrims. Wooden catwalks suspended above the intact medieval excavations allowed guests to observe the vaulted scriptorium, the well shaft, and the functioning planetary orrery in their authentic subterranean context. The commercial developers who had once sought to demolish the site were now its proudest corporate benefactors, sponsoring free admission for every school in Oxfordshire.",
    keywords: [
      { word: "catwalks", meaningFa: "پل‌های چوبی یا فلزی معلق برای تردد بازدیدکنندگان", phonetic: "/ˈkætwɔːks/" },
      { word: "excavations", meaningFa: "کاوش‌ها و سایت‌های حفاری باستان‌شناسی", phonetic: "/ˌekskəˈveɪʃnz/" },
      { word: "benefactors", meaningFa: "حامیان مالی و نیکوکاران بزرگ", phonetic: "/ˈbenɪfæktərz/" },
      { word: "pilgrims", meaningFa: "شیفتگان و زائران مشتاق فرهنگ و تاریخ", phonetic: "/ˈpɪlɡrɪmz/" },
    ],
    question: {
      promptEn: "How did the relationship between the commercial developers and the historic site change?",
      promptFa: "رابطه سازندگان تجاری با این محوطه تاریخی چگونه تغییر کرد؟",
      options: [
        "They became the site's proudest corporate benefactors, sponsoring free admission for all local schools",
        "They filed a compensation lawsuit against the university",
        "They built a skyscraper directly on top of the wellhead",
      ],
      correctIndex: 0,
      hintSnippet: "The commercial developers who had once sought to demolish the site were now its proudest corporate benefactors, sponsoring free admission",
      clueFa: "خط آخر رو نگاه کن دوست من؛ همون شرکت‌هایی که می‌خواستند خرابش کنند، حامی مالی اصلی شدند و ورود مدارس را رایگان کردند.",
    },
    choiceA: {
      labelEn: "Host the European Heritage Awards ceremony inside the restored medieval cloister!",
      labelFa: "مراسم جایزه بزرگ میراث فرهنگی اروپا را در صحن مرمت‌شده صومعه برگزار کن!",
      descriptionFa: "جشن باشکوه حفاظت از تاریخ با حضور وزیران فرهنگ قاره.",
    },
    choiceB: {
      labelEn: "Cut the ceremonial ribbon on the underground museum with Clara, Julian, and Father Thomas!",
      labelFa: "روبان افتتاح موزه زیرزمینی را در کنار کلارا، جولیان و پدر توماس قیچی کن!",
      descriptionFa: "پایانی پرافتخار برای سه یاری که تاریخ را از ویرانی نجات دادند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Deciphering Bacon’s botanical cursive, Clara identified seventeen herbal compounds capable of inhibiting bacterial biofilm growth—a discovery that sparked immediate clinical trials at Oxford’s Department of Pharmacology. The historical formulas, preserved for seven centuries in amber glass, proved effective against modern antibiotic-resistant pathogens. Medical researchers hailed the discovery as a triumph of historical ethnobotany, proving that medieval natural philosophy held vital solutions for the urgent challenges of the twenty-first century.",
    keywords: [
      { word: "biofilm", meaningFa: "بیوفیلم (لایه مقاوم باکتریایی در برابر داروها)", phonetic: "/ˈbaɪəʊfɪlm/" },
      { word: "pathogens", meaningFa: "عوامل بیماری‌زا و میکروب‌های عفونی", phonetic: "/ˈpæθədʒənz/" },
      { word: "ethnobotany", meaningFa: "گیاه‌شناسی سنتی و مردم‌شناختی", phonetic: "/ˌeθnəʊˈbɒtəni/" },
      { word: "inhibiting", meaningFa: "مهار کردن و متوقف ساختن رشد میکروب", phonetic: "/ɪnˈhɪbɪtɪŋ/" },
    ],
    question: {
      promptEn: "What medical application did Bacon's deciphered botanical formulas demonstrate in modern laboratories?",
      promptFa: "فرمول‌های دارویی رمزشده بیکن در آزمایشگاه‌های امروزی چه کاربرد پزشکی نشان دادند؟",
      options: [
        "They inhibited bacterial biofilm growth and combated antibiotic-resistant pathogens",
        "They cured common headaches within three seconds",
        "They created a synthetic red dye for clothing",
      ],
      correctIndex: 0,
      hintSnippet: "seventeen herbal compounds capable of inhibiting bacterial biofilm growth... effective against modern antibiotic-resistant pathogens",
      clueFa: "خطوط دوم و سوم رو ببین؛ ۱۷ ترکیب گیاهی که مانع رشد لایه‌های باکتریایی مقاوم به آنتی‌بیوتیک می‌شدند.",
    },
    choiceA: {
      labelEn: "Establish the Oxford Institute for Ancient Pharmacopoeia and Drug Discovery!",
      labelFa: "موسسه فارماکوپه باستانی و کشف داروهای نوین را در دانشگاه آکسفورد پایه‌گذاری کن!",
      descriptionFa: "مرکزی پیشرفته برای درمان بیماری‌ها با الهام از دانش کهن گیاهی.",
    },
    choiceB: {
      labelEn: "Publish a landmark monograph on Roger Bacon's medical science in The Lancet!",
      labelFa: "مقاله ماندگار درباره دستاوردهای دارویی راجر بیکن را در ژورنال معتبر لنست به چاپ برسان!",
      descriptionFa: "اثبات جایگاه علمی یک راهب فیلسوف در معتبرترین نشریه پزشکی جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The British Museum of Science unveiled the 'Alchemist's Vault' exhibition, featuring forty-two restored emerald glassware alembics and distillation retorts. Curators praised Julian's delicate restoration technique, which had preserved microscopic traces of botanical tinctures inside the glass matrices without chemical degradation. A televised documentary titled 'The Secret Flasks of Roger Bacon' captivated ten million viewers, making Julian and Clara national ambassadors of British archaeological excellence.",
    keywords: [
      { word: "retorts", meaningFa: "ظروف شیشه‌ای لوله‌دار تقطیر و آزمایشگاهی", phonetic: "/rɪˈtɔːts/" },
      { word: "tinctures", meaningFa: "عصاره‌های غلیظ دارویی حل‌شده در الکل", phonetic: "/ˈtɪŋktʃərz/" },
      { word: "matrices", meaningFa: "ماتریس‌ها و بافت‌های مولکولی شیشه", phonetic: "/ˈmeɪtrɪsiːz/" },
      { word: "ambassadors", meaningFa: "سفیران، نمایندگان برجسته و نمادهای افتخار", phonetic: "/æmˈbæsədərz/" },
    ],
    question: {
      promptEn: "How many television viewers watched the documentary on Roger Bacon's glassware?",
      promptFa: "چند میلیون بیننده تلویزیونی مستند شیشه‌آلات کیمیاگری را تماشا کردند؟",
      options: [
        "Ten million viewers across the nation",
        "Over fifty thousand university professors",
        "One million museum subscribers",
      ],
      correctIndex: 0,
      hintSnippet: "A televised documentary titled 'The Secret Flasks of Roger Bacon' captivated ten million viewers",
      clueFa: "خط آخر رو نگاه کن؛ ده میلیون بیننده مشتاق مستند شگفت‌انگیز جام‌های سر به مهر را تماشا کردند.",
    },
    choiceA: {
      labelEn: "Host an exclusive evening reception for museum curators and scientists in London!",
      labelFa: "ضیافت شبانه اختصاصی برای پژوهشگران و مدیران موزه‌های جهان در لندن برگزار کن!",
      descriptionFa: "شبی ماندگار از تجلیل هنر و علم مرمت تاریخی.",
    },
    choiceB: {
      labelEn: "Endow an annual master's scholarship in delicate archaeological glass conservation!",
      labelFa: "بورسیه کارشناسی ارشد مرمت شیشه‌های تاریخی را برای دانشجویان مستعد اهدا کن!",
      descriptionFa: "تربیت نسل جدید متخصصان مرمت آثار کهن در کشور.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "The bilingual monograph 'From Maragheh to Oxford: Celestial Bridges of the 13th Century' was co-published by Oxford University and the Iranian Academy of Sciences. Academics worldwide celebrated the revelation that Nasir al-Din al-Tusi's mathematical treatises had traveled along Silk Road diplomatic routes to inspire Roger Bacon's optics and cartography. In the Sheldonian Theatre, Clara and her Iranian counterparts held up the bronze astrolabe together, declaring that science transcends political borders, uniting humanity across centuries.",
    keywords: [
      { word: "bilingual", meaningFa: "دو زبانه (انگلیسی و فارسی)", phonetic: "/baɪˈlɪŋɡwəl/" },
      { word: "celestial", meaningFa: "آسمانی، فلکی و وابسته به ستارگان", phonetic: "/səˈlestiəl/" },
      { word: "counterparts", meaningFa: "همتایان، پژوهشگران هم‌رده در کشور دیگر", phonetic: "/ˈkaʊntərpɑːrts/" },
      { word: "transcends", meaningFa: "فراتر می‌رود، از مرزها عبور می‌کند", phonetic: "/trænˈsendz/" },
    ],
    question: {
      promptEn: "What historical connection between Maragheh and Oxford did the bilingual monograph reveal?",
      promptFa: "کتاب پژوهشی دوزبانه چه پیوند تاریخی میان رصدخانه مراغه و آکسفورد را اثبات کرد؟",
      options: [
        "Nasir al-Din al-Tusi's mathematical treatises inspired Bacon's optics via Silk Road diplomatic routes",
        "Oxford was built by architects from Tabriz",
        "Roger Bacon lived in Isfahan for twenty years",
      ],
      correctIndex: 0,
      hintSnippet: "Nasir al-Din al-Tusi's mathematical treatises had traveled along Silk Road diplomatic routes to inspire Roger Bacon's optics and cartography",
      clueFa: "خط دوم رو بخون دوست من؛ رساله‌های ریاضی خواجه نصیرالدین طوسی از مسیر جاده ابریشم به دست راجر بیکن رسیده بود و الهام‌بخش او شد.",
    },
    choiceA: {
      labelEn: "Launch the annual Tusi-Bacon International Scientific Symposium alternating between Oxford and Tehran!",
      labelFa: "همایش سالانه بین‌المللی طوسی-بیکن را به صورت دوره‌ای در آکسفورد و تهران پایه‌گذاری کن!",
      descriptionFa: "پل دائمی گفتگوی علمی و فرهنگی میان دانشمندان دو تمدن بزرگ.",
    },
    choiceB: {
      labelEn: "Mount a replica of the Maragheh astrolabe on the historic facade of Oxford's Museum of History of Science!",
      labelFa: "تندیس یادبود اسطرلاب مراغه را بر سردر موزه تاریخ علم آکسفورد نصب کن!",
      descriptionFa: "نمادی همیشگی از قدرشناسی جامعه علمی غرب نسبت به مفاخر شرق.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Under the soaring dome of the Royal Astronomical Society in Piccadilly, the Maragheh-linked astrolabe was unveiled before the diplomatic corps and international astronomers. The brass plates, calibrated to calculate planetary occultations with ninety-nine percent accuracy, were recognized as one of the three most important observational instruments surviving from the Middle Ages. The President of the Society toasted Clara and Julian: 'Through your diligence, you have restored a beacon of shared human genius to its rightful place in our collective memory.'",
    keywords: [
      { word: "occultations", meaningFa: "پوشیده‌شدن و اختفای ستارگان در پشت ماه یا سیارات", phonetic: "/ˌɒkʌlˈteɪʃnz/" },
      { word: "observational", meaningFa: "رصدی و دیدبانی فلکی", phonetic: "/ˌɒbzərˈveɪʃənl/" },
      { word: "diligence", meaningFa: "پشتکار، دقت و تعهد خستگی‌ناپذیر", phonetic: "/ˈdɪlɪdʒəns/" },
      { word: "soaring", meaningFa: "بسیار بلند و باابهت", phonetic: "/ˈsɔːrɪŋ/" },
    ],
    question: {
      promptEn: "What observational capability made the medieval astrolabe one of the three most important in the world?",
      promptFa: "چه توانایی رصدی خارق‌العاده‌ای این اسطرلاب را در شمار سه ابزار مهم جهان قرون وسطی قرار داد؟",
      options: [
        "It calculated planetary occultations with ninety-nine percent accuracy",
        "It predicted tides on the moons of Jupiter",
        "It decoded spoken Latin into Greek text",
      ],
      correctIndex: 0,
      hintSnippet: "calibrated to calculate planetary occultations with ninety-nine percent accuracy, were recognized as one of the three most important observational instruments",
      clueFa: "خط دوم رو ببین؛ محاسبه اختفای سیارات با دقت ۹۹ درصد که در نوع خود در جهان قرون وسطی شاهکار بود.",
    },
    choiceA: {
      labelEn: "Celebrate this historic induction with a champagne banquet in the Royal Society library!",
      labelFa: "پذیرش این اثر در تاریخ جهان را با ضیافت شام در تالار انجمن سلطنتی جشن بگیرید!",
      descriptionFa: "شبی پرافتخار در جمع نخبگان اخترشناسی و فیزیک جهان.",
    },
    choiceB: {
      labelEn: "Publish a high-resolution interactive digital model of the astrolabe for public online education!",
      labelFa: "مدل دیجیتال سه‌بعدی و تعاملی اسطرلاب را برای آموزش همگانی در اینترنت منتشر کن!",
      descriptionFa: "امکان چرخاندن و کار با اسطرلاب برای میلیون‌ها دانش‌آموز در سراسر گیتی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The newly established Roger Bacon Chair in Experimental Physics attracted three hundred world-class applicants from Harvard, MIT, and Cambridge. Endowed with private research funds and the recovered manuscripts, the university laboratory focused on cutting-edge metamaterials and advanced optical cloaking. In her inaugural lecture, Clara looked out over five hundred eager young physicists: 'Seven hundred years ago, a solitary friar dared to believe that nature could be understood through measurement. Today, his spirit guides the frontier of quantum optics.'",
    keywords: [
      { word: "metamaterials", meaningFa: "فرامواد (موادی دست‌ساز با خواص اپتیکی نوین)", phonetic: "/ˌmetəməˈtɪəriəlz/" },
      { word: "cloaking", meaningFa: "پنهان‌سازی نوری و نامرئی‌سازی اشیا", phonetic: "/ˈkləʊkɪŋ/" },
      { word: "solitary", meaningFa: "تک‌وتنها، در انزوای پر از تمرکز", phonetic: "/ˈsɒlətri/" },
      { word: "frontier", meaningFa: "مرزهای دانش و پیشتازی علمی", phonetic: "/frʌnˈtɪər/" },
    ],
    question: {
      promptEn: "What modern scientific fields did the new Roger Bacon research laboratory focus on?",
      promptFa: "آزمایشگاه پژوهشی جدید راجر بیکن روی کدام حوزه‌های علمی مدرن متمرکز شد؟",
      options: [
        "Cutting-edge metamaterials and advanced optical cloaking",
        "Coal steam power generation",
        "Deep-ocean oil drilling techniques",
      ],
      correctIndex: 0,
      hintSnippet: "the university laboratory focused on cutting-edge metamaterials and advanced optical cloaking",
      clueFa: "خط دوم رو نگاه کن؛ فرامواد پیشرفته و نامرئی‌سازی اپتیکال بر پایه اصول کوانتومی.",
    },
    choiceA: {
      labelEn: "Award the first Roger Bacon Fellowship to a brilliant young quantum optics researcher!",
      labelFa: "اولین بورسیه پژوهشی راجر بیکن را به محقق جوان نابغه اپتیک کوانتومی اهدا کن!",
      descriptionFa: "حمایت از استعدادهای جوانی که آینده فیزیک را رقم می‌زنند.",
    },
    choiceB: {
      labelEn: "Lead a ceremonial academic procession through Oxford's cobblestone streets in medieval regalia!",
      labelFa: "رژه باشکوه اساتید با ردای سنتی را در سنگفرش‌های آکسفورد رهبری کن!",
      descriptionFa: "گرامیداشت پرشکوه پیوند سنت‌های علمی هفتصد ساله با آینده.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Within forty-eight hours of launching the interactive web archive 'The Scriptorium Open Vault', sixty million pages were accessed by teachers, students, and independent scholars worldwide. High-resolution multispectral scans allowed users to zoom into individual gold flakes and manipulate virtual models of Bacon’s optical lenses. Social media channels celebrated Clara and Julian as modern intellectual heroes, demonstrating that authentic historical discovery can ignite the imagination of the digital generation.",
    keywords: [
      { word: "multispectral", meaningFa: "چندطیفی با تفکیک‌پذیری بسیار بالا", phonetic: "/ˌmʌltiˈspektrəl/" },
      { word: "manipulate", meaningFa: "دستکاری و حرکت دادن اشیای سه‌بعدی مجازی", phonetic: "/məˈnɪpjuleɪt/" },
      { word: "intellectual", meaningFa: "روشنفکری، اندیشمندانه و متفکرانه", phonetic: "/ˌɪntəˈlektʃuəl/" },
      { word: "ignite", meaningFa: "مشتعل کردن، برانگیختن شور و اشتیاق", phonetic: "/ɪɡˈnaɪt/" },
    ],
    question: {
      promptEn: "How many pages of the interactive digital archive were accessed in the first forty-eight hours?",
      promptFa: "در ۴۸ ساعت اول چند صفحه از آرشیو تعاملی دیجیتال توسط کاربران بازدید شد؟",
      options: [
        "Sixty million pages were accessed worldwide",
        "Ten thousand university emails",
        "Five hundred PDF downloads",
      ],
      correctIndex: 0,
      hintSnippet: "sixty million pages were accessed by teachers, students, and independent scholars worldwide",
      clueFa: "خط اول رو ببین دوست من؛ شصت میلیون صفحه توسط معلمان، دانش‌آموزان و محققان مستقل در سراسر جهان ورق خورد.",
    },
    choiceA: {
      labelEn: "Win the UNESCO World Summit Award for Digital Preservation of Cultural Heritage!",
      labelFa: "جایزه جهانی اجلاس یونسکو را برای حفظ دیجیتال میراث بشری دریافت کن!",
      descriptionFa: "بالاترین افتخار سازمان ملل در ترویج رایگان علم و فرهنگ.",
    },
    choiceB: {
      labelEn: "Celebrate the global digital milestone with a cozy tea party with Julian in the Bodleian library!",
      labelFa: "این دستاورد جهانی را با نوشیدن چای گرم در کنار جولیان در کتابخانه جشن بگیر!",
      descriptionFa: "پایانی آرامش‌بخش، خودمانی و دلپذیر برای دو پژوهشگر خستگی‌ناپذیر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Using non-thermal green lasers, conservators revealed the brilliant gold leaf and cobalt blue pigments of the underground astrological frescoes without touching a single flake of ancient plaster. Art critics from the Louvre and the Uffizi declared the Saint Jude's vault to be the finest surviving cycle of English Gothic wall paintings. As the lighting was turned on for the inaugural private view, Father Thomas clasped Clara's hand: 'Clara, this room was painted in hope that future ages would understand; today, you have fulfilled that hope.'",
    keywords: [
      { word: "frescoes", meaningFa: "فرسکوها (نقاشی‌های دیواری روی گچ تازه)", phonetic: "/ˈfreskəʊz/" },
      { word: "cobalt", meaningFa: "آبی کبالت بسیار شفاف و درخشان لاجوردی", phonetic: "/ˈkəʊbɔːlt/" },
      { word: "cycle", meaningFa: "مجموعه پیوسته از نقاشی‌ها با موضوع واحد", phonetic: "/ˈsaɪkl/" },
      { word: "inaugural", meaningFa: "افتتاحیه، نخستین نمایش رسمی", phonetic: "/ɪˈnɔːɡjərəl/" },
    ],
    question: {
      promptEn: "What did critics from the Louvre and Uffizi declare about the restored wall paintings?",
      promptFa: "منتقدان برجسته موزه لوور و اوفیتزی درباره نقاشی‌های دیواری مرمت‌شده چه نظری دادند؟",
      options: [
        "That they were the finest surviving cycle of English Gothic wall paintings",
        "That they were painted by Flemish merchant sailors",
        "That they were copies of Roman mosaics",
      ],
      correctIndex: 0,
      hintSnippet: "declared the Saint Jude's vault to be the finest surviving cycle of English Gothic wall paintings",
      clueFa: "خط سوم رو ببین؛ اعلام کردند زیباترین و سالم‌ترین مجموعه نقاشی‌های دیواری گوتیک انگلیسی در تاریخ است.",
    },
    choiceA: {
      labelEn: "Host the European Conservation Summit inside the illuminated astrological vault!",
      labelFa: "اجلاس مرمت‌کاران برجسته اروپا را در این سرداب باشکوه ستاره‌شناسی برگزار کن!",
      descriptionFa: "گردهمایی تخصصی در میان زیباترین فرسکوهای قرون وسطی.",
    },
    choiceB: {
      labelEn: "Publish a luxury art monograph featuring full-color foldout plates of the frescoes!",
      labelFa: "کتاب نفیس هنری با پوسترهای بزرگ تاشو از نقاشی‌های دیواری منتشر کن!",
      descriptionFa: "اثری ماندگار در کتابخانه‌های هنری سراسر جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The six-part documentary series 'The Alchemist's Shadow' won three BAFTA television awards, reaching an audience of forty million across six continents. Viewers were captivated by the dramatic reenactments of Bacon’s nocturnal experiments and Clara’s modern technological sleuthing. Tourism to Oxfordshire broke all historical records, with travelers flocking to experience the real-world locations where science and courage had rewritten the boundaries of medieval history.",
    keywords: [
      { word: "BAFTA", meaningFa: "بفتا (جایزه معتبر آکادمی فیلم و تلویزیون بریتانیا)", phonetic: "/ˈbæftə/" },
      { word: "reenactments", meaningFa: "بازآفرینی‌های دراماتیک صحنه‌های تاریخی در سینما", phonetic: "/riːɪˈnæktmənts/" },
      { word: "sleuthing", meaningFa: "کاوشگری دقیق و کشف سرنخ‌های معمایی همانند کارآگاه", phonetic: "/ˈsluːθɪŋ/" },
      { word: "flocking", meaningFa: "هجوم آوردن دسته‌جمعی از سر اشتیاق", phonetic: "/ˈflɒkɪŋ/" },
    ],
    question: {
      promptEn: "How many BAFTA awards did the documentary series 'The Alchemist's Shadow' win?",
      promptFa: "مجموعه مستند «سایه کیمیاگر» برنده چند جایزه بفتا شد؟",
      options: [
        "Three BAFTA television awards",
        "Five Golden Globe trophies",
        "One honorary radio citation",
      ],
      correctIndex: 0,
      hintSnippet: "The six-part documentary series 'The Alchemist's Shadow' won three BAFTA television awards",
      clueFa: "خط اول رو نگاه کن دوست من؛ برنده ۳ جایزه معتبر بفتا شد و به ۴۰ میلیون مخاطب در جهان رسید.",
    },
    choiceA: {
      labelEn: "Celebrate on the BAFTA red carpet with the film crew and university archivist team!",
      labelFa: "روی فرش قرمز بفتا همراه با گروه سازنده فیلم و همکاران دانشگاهی بدرخشید!",
      descriptionFa: "شبی درخشان زیر نور فلاش‌های سینمایی و تجلیل از علم.",
    },
    choiceB: {
      labelEn: "Donate fifty percent of film royalties to fund scholarship programs for young historians!",
      labelFa: "نیمی از عواید مستند را به بورسیه دانشجویان جوان تاریخ اختصاص بده!",
      descriptionFa: "یاری رساندن به نسل بعد برای کشف ناشناخته‌های گذشته.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "At the International Cartographic Congress in Lisbon, Clara and Julian stood on stage as the unrolled 14th-century Atlantic maps were displayed beneath protective polarization filters. The maps clearly depicted the coastlines of Newfoundland, Greenland, and the Caribbean Gulf Stream two full centuries before 1492. As three thousand geographers rose in a thundering standing ovation, the President of the Congress declared: 'Today, the maritime history of the world is rewritten by the bravery of two English scholars.'",
    keywords: [
      { word: "polarization", meaningFa: "قطبش نوری (فیلترهای محافظت در برابر بازتاب و اشعه)", phonetic: "/ˌpəʊləraɪˈzeɪʃn/" },
      { word: "depicted", meaningFa: "تصویر کرده بود، به تصویر کشیده بود", phonetic: "/dɪˈpɪktɪd/" },
      { word: "maritime", meaningFa: "دریایی، دریانوردی و ملوانی", phonetic: "/ˈmærɪtaɪm/" },
      { word: "ovation", meaningFa: "تشویق پرشور و ادای احترام ایستاده", phonetic: "/əʊˈveɪʃn/" },
    ],
    question: {
      promptEn: "What pre-Columbian coastlines were clearly depicted on the fourteenth-century Atlantic maps?",
      promptFa: "چه خطوط ساحلی پیش از کلمب بر روی نقشه‌های اقیانوس اطلس قرن چهاردهم ترسیم شده بود؟",
      options: [
        "Newfoundland, Greenland, and the Caribbean Gulf Stream two centuries before 1492",
        "The complete perimeter of Antarctica without ice",
        "Underwater mountain ridges of the Indian Ocean",
      ],
      correctIndex: 0,
      hintSnippet: "maps clearly depicted the coastlines of Newfoundland, Greenland, and the Caribbean Gulf Stream two full centuries before 1492",
      clueFa: "خط دوم رو ببین؛ سواحل نیوفاندلند، گرینلند و جریان گلف استریم دریای کارائیب دویست سال قبل از سال ۱۴۹۲!",
    },
    choiceA: {
      labelEn: "Publish the landmark atlas 'The Pre-Columbian Atlantic' in a museum-grade edition!",
      labelFa: "اطلس تاریخی «اقیانوس اطلس پیش از کلمب» را در نسخه‌ای نفیس و موزه‌ای به چاپ برسان!",
      descriptionFa: "مرجعی بی‌بدیل در کتابخانه‌های جغرافیایی و دریانوردی جهان.",
    },
    choiceB: {
      labelEn: "Sail from Bristol to Newfoundland aboard a reconstructed medieval caravel following Bacon's coordinates!",
      labelFa: "سفر با کشتی بادبانی تاریخی را از بریستول تا سواحل آمریکا طبق مختصات بیکن تجربه کن!",
      descriptionFa: "سفری ماجراجویانه در دل تاریخ برای اثبات عملی دقت نقشه‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The newly chartered Oxford Institute for Pre-Modern Scientific Cartography secured a thirty-million-pound private endowment to construct a state-of-the-art spectral analysis laboratory. Clara was appointed the Founding Director, with Julian serving as Master Conservator. Together, they led expeditions to monastic libraries across twenty countries, discovering overlooked cartographic fragments that revealed an interconnected medieval world far more sophisticated than previously conceived.",
    keywords: [
      { word: "endowment", meaningFa: "سرمایه وقفی دائمی و کمک مالی بلاعوض", phonetic: "/ɪnˈdaʊmənt/" },
      { word: "interconnected", meaningFa: "به هم پیوسته، دارای ارتباطات عمیق شبکه‌ای", phonetic: "/ˌɪntərkəˈnektɪd/" },
      { word: "fragments", meaningFa: "تکه‌ها، قطعات برجامانده از اسناد تاریخی", phonetic: "/ˈfræɡmənts/" },
      { word: "conceived", meaningFa: "تصورشده، پنداشته‌شده در گذشته", phonetic: "/kənˈsiːvd/" },
    ],
    question: {
      promptEn: "What role did Clara assume at the newly chartered Oxford Institute?",
      promptFa: "کلارا چه سمتی را در پژوهشکده تازه تاسیس آکسفورد بر عهده گرفت؟",
      options: [
        "Founding Director of the Institute",
        "Visiting Lecturer in Latin Grammar",
        "Chief Financial Officer of the Bodleian",
      ],
      correctIndex: 0,
      hintSnippet: "Clara was appointed the Founding Director, with Julian serving as Master Conservator",
      clueFa: "خط دوم رو بخون دوست من؛ به عنوان رئیس موسس (Founding Director) پژوهشکده منصوب شد.",
    },
    choiceA: {
      labelEn: "Inaugurate the institute's new glass-and-stone research library in central Oxford!",
      labelFa: "ساختمان نوین شیشه‌ای و سنگی پژوهشکده را در قلب آکسفورد افتتاح کن!",
      descriptionFa: "مرکزی باشکوه برای دهه‌ها پژوهش آینده‌سازان تاریخ علم.",
    },
    choiceB: {
      labelEn: "Toast their ten-year expedition plan with Father Thomas under the Bodleian arches!",
      labelFa: "برنامه سفرهای اکتشافی ده ساله را در کنار پدر توماس زیر طاق‌های بادلین جشن بگیرید!",
      descriptionFa: "پایانی پرامید برای آغاز ماجراجویی‌های بی‌پایان در خزانه‌های جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Making all forty-eight leather-bound folios open-source triggered an unprecedented wave of global collaborative research. Within six months, mathematicians from Tokyo, Cairo, Paris, and Stanford had translated and analyzed the lost Arabic and Greek algebraic commentaries. The collaborative findings proved that the foundations of modern calculus and optics were forged through intercultural dialog along ancient trade routes. The international scholarly community awarded Clara Vance the Golden Quill of World Historical Unity.",
    keywords: [
      { word: "open-source", meaningFa: "متن‌باز و رایگان در دسترس همگان", phonetic: "/ˌəʊpən ˈsɔːs/" },
      { word: "algebraic", meaningFa: "جبری (وابسته به علم جبر و ریاضیات)", phonetic: "/ˌældʒɪˈbreɪɪk/" },
      { word: "commentaries", meaningFa: "تفسیرها، شرح‌ها و حاشیه‌نویسی‌های علمی", phonetic: "/ˈkɒməntriz/" },
      { word: "forged", meaningFa: "پایه‌ریزی شد، شکل گرفت و قوام یافت", phonetic: "/fɔːrdʒd/" },
    ],
    question: {
      promptEn: "What did the global analysis of the Arabic and Greek commentaries prove?",
      promptFa: "بررسی بین‌المللی تفاسیر عربی و یونانی چه چیزی را اثبات کرد؟",
      options: [
        "That calculus and optics were forged through intercultural dialog along ancient trade routes",
        "That ancient mathematics had no practical uses",
        "That Greek scholars never traded with other nations",
      ],
      correctIndex: 0,
      hintSnippet: "proved that the foundations of modern calculus and optics were forged through intercultural dialog along ancient trade routes",
      clueFa: "خط سوم رو ببین؛ پایه‌های حسابان و اپتیک نوین از طریق گفتگوی میان‌فرهنگی در مسیرهای تجاری کهن شکل گرفته بود.",
    },
    choiceA: {
      labelEn: "Accept the Golden Quill of World Historical Unity at the UNESCO headquarters in Paris!",
      labelFa: "نشان قلم طلایی وحدت تاریخی جهان را در مقر یونسکو در پاریس دریافت کن!",
      descriptionFa: "تقدیری جهانی از ترویج صلح، گفتگو و دانش مشترک بشری.",
    },
    choiceB: {
      labelEn: "Share a reflective walk through Oxford's misty parks with Julian, celebrating truth's triumph!",
      labelFa: "با جولیان در پارک‌های مه‌آلود آکسفورد قدم بزنید و پیروزی حقیقت بر تعصب را جشن بگیرید!",
      descriptionFa: "آرامشی عمیق پس از به ثمر نشستن سال‌ها تلاش علمی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The traveling exhibition 'The Great Bridge of Knowledge' opened at the Smithsonian in Washington, D.C., before journeying to Cairo, Istanbul, and Kyoto. Over five million citizens gazed upon the original folios, learning how knowledge passed freely across empires, religions, and continents. In the guestbook, a high-school teacher wrote: 'Thank you for proving that the brightest light in human history is the curiosity that connects us all.'",
    keywords: [
      { word: "journeying", meaningFa: "سفر کردن به دیارها و شهرهای دوردست", phonetic: "/ˈdʒɜːrniɪŋ/" },
      { word: "curiosity", meaningFa: "کنجکاوی، میل بی‌پایان به یادگیری و کشف", phonetic: "/ˌkjʊəriˈɒsəti/" },
      { word: "guestbook", meaningFa: "دفتر یادبود میهمانان موزه", phonetic: "/ˈɡestbʊk/" },
      { word: "empires", meaningFa: "امپراتوری‌های بزرگ تاریخی", phonetic: "/ˈempaɪərz/" },
    ],
    question: {
      promptEn: "What memorable sentence was written in the exhibition guestbook by a high-school teacher?",
      promptFa: "چه جمله الهام‌بخشی توسط یک معلم در دفتر یادبود نمایشگاه ثبت شد؟",
      options: [
        "The brightest light in human history is the curiosity that connects us all",
        "Ancient books should never be taken outside libraries",
        "Parchment preserves ink better than computer screens",
      ],
      correctIndex: 0,
      hintSnippet: "the brightest light in human history is the curiosity that connects us all",
      clueFa: "جمله آخر رو بخون دوست من؛ درخشان‌ترین نور در تاریخ بشر، کنجکاوی است که همه ما را به هم پیوند می‌دهد.",
    },
    choiceA: {
      labelEn: "Conclude the world tour with a lantern-lit celebration at Oxford's historic Radcliffe Camera!",
      labelFa: "تور جهانی را با جشنی باشکوه در میدان رادکلیف آکسفورد زیر نور فانوس‌ها به پایان برسان!",
      descriptionFa: "پایانی رویایی و تاریخی در قلب زادگاه این کشف بزرگ.",
    },
    choiceB: {
      labelEn: "Retire with Julian to the library scriptorium to prepare the next volume of ancient secrets!",
      labelFa: "همراه با جولیان به اتاق کار کتابخانه بازگردید تا رمزگشایی از سند باستانی بعدی را آغاز کنید!",
      descriptionFa: "چرا که ماجراجویی علم و کشف حقیقت هیچ‌گاه پایانی ندارد.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Sheldonian Laurels", titleFa: "مدال افتخار شلدونیان", badgeCategory: "scholar", badgeIcon: "🏅", badgeNameFa: "پایان عالی دانشگاهی", climaxEn: "Clara receives the Bodley Medal amidst thunderous applause, celebrated worldwide as the savior of Roger Bacon's lost legacy.", climaxFa: "کلارا مدال معتبر بادلین را در تشویق ایستاده دانشگاهیان دریافت کرد؛ زنی که میراث گمشده راجر بیکن را به تاریخ بازگرداند.", xpReward: 275 },
  { pathCode: "AAAAB", titleEn: "The Bodleian Evening Toast", titleFa: "جام سپاس در صحن بادلین", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان صمیمی و پرغرور", climaxEn: "Sipping vintage port under library arches, Clara and Julian celebrate the quiet triumph of scholarship over centuries of obscurity.", climaxFa: "با نوشیدن چای کهن در ایوان کتابخانه، کلارا و جولیان پیروزی آرام علم بر تاریکی قرون را با لبخند جشن گرفتند.", xpReward: 265 },
  { pathCode: "AAABA", titleEn: "The Junior Cryptographer Foundation", titleFa: "بنیاد کاوشگران نوجوان", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان الهام‌بخش آموزشی", climaxEn: "The Bodleian Junior Fellowship mentors two thousand young students annually, training the next generation of historical sleuths.", climaxFa: "بورسیه نوجوانان بادلین هر سال دو هزار دانش‌آموز را در رمزگشایی و کشف اسناد تاریخی آموزش می‌دهد.", xpReward: 270 },
  { pathCode: "AAABB", titleEn: "The National School Chronicle", titleFa: "کتابخانه پرشور مدارس", badgeCategory: "heroic", badgeIcon: "📖", badgeNameFa: "پایان پرتیراژ ملی", climaxEn: "Ten thousand school libraries display the illustrated discovery chronicle, inspiring a nationwide surge in youth historical interest.", climaxFa: "ده هزار کتابخانه در سراسر کشور کتاب داستان این کشف را دریافت کردند و شوق مطالعه تاریخ را در دل نوجوانان افروختند.", xpReward: 260 },
  { pathCode: "AABAA", titleEn: "The Greenwich Cosmic Induction", titleFa: "افلاک‌نمای تاریخی گرینویچ", badgeCategory: "legendary", badgeIcon: "🪐", badgeNameFa: "پایان جهانی نجوم", climaxEn: "The thermal planetary orrery is installed at Greenwich Observatory, celebrated as the crown jewel of pre-modern kinetic genius.", climaxFa: "افلاک‌نمای مکانیکی در رصدخانه گرینویچ نصب شد و به عنوان نگین درخشان نبوغ ماشین‌سازی پیشامدرن ستایش گشت.", xpReward: 275 },
  { pathCode: "AABAB", titleEn: "The Ancient Kinetic Laboratory", titleFa: "آزمایشگاه مکانیزم‌های باستانی", badgeCategory: "scholar", badgeIcon: "⚙️", badgeNameFa: "پایان پژوهشی و صنعتی", climaxEn: "The new Oxford laboratory reverse-engineers medieval mechanisms, inspiring revolutionary sustainable mechanical technologies.", climaxFa: "آزمایشگاه جدید آکسفورد با مهندسی معکوس ابزارهای کهن، فناوری‌های مکانیکی پایدار و پاک نوینی را خلق کرد.", xpReward: 270 },
  { pathCode: "AABBA", titleEn: "The European Heritage Crown", titleFa: "تاج افتخار میراث اروپا", badgeCategory: "heroic", badgeIcon: "🏰", badgeNameFa: "پایان تاریخی و دیپلماتیک", climaxEn: "European ministers award the Priory Vaults the Grand Conservation Laurel, praising the miraculous rescue of ancient architecture.", climaxFa: "وزیران فرهنگ اروپا مدال عالی حفاظت را به صومعه اعطا کردند و نجات معجزه‌آسای معماری تاریخی را ستودند.", xpReward: 270 },
  { pathCode: "AABBB", titleEn: "The Ribbon of Resurrection", titleFa: "روبان حیات دوباره صومعه", badgeCategory: "legendary", badgeIcon: "✂️", badgeNameFa: "پایان ماندگار مردمی", climaxEn: "Clara, Julian, and Father Thomas cut the museum ribbon before thousands of cheering citizens, opening the underground vault forever.", climaxFa: "کلارا، جولیان و پدر توماس در برابر هزاران شهروند روبان را قیچی کردند؛ گشودن همیشگی درهای تاریخ به روی مردم.", xpReward: 265 },
  { pathCode: "ABAAA", titleEn: "The Antibiotic Pharmacopoeia", titleFa: "فارماکوپه نجات‌بخش باستانی", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان تحول دارویی", climaxEn: "Bacon's revived herbal compounds enter clinical production, providing life-saving natural treatments for drug-resistant infections.", climaxFa: "فرمول‌های دارویی بیکن به تولید صنعتی رسید و درمانی طبیعی برای نجات بیماران مبتلا به عفونت‌های مقاوم فراهم آورد.", xpReward: 275 },
  { pathCode: "ABAAB", titleEn: "The Lancet Triumph", titleFa: "برگ زرین نشریه لنست", badgeCategory: "scholar", badgeIcon: "📑", badgeNameFa: "پایان علمی و پزشکی", climaxEn: "The landmark paper on 14th-century natural therapeutics redefines historical medicine, winning international scientific citations.", climaxFa: "مقاله ماندگار درباره درمان‌های طبیعی قرن چهاردهم در نشریه لنست، نگاه جامعه پزشکی به تاریخ طب را دگرگون ساخت.", xpReward: 270 },
  { pathCode: "ABABA", titleEn: "The Alchemist's London Gala", titleFa: "شب شیشه‌آلات کیمیا در لندن", badgeCategory: "legendary", badgeIcon: "🧪", badgeNameFa: "پایان درخشان موزه‌ای", climaxEn: "The British Museum exhibition attracts global dignitaries, establishing 13th-century laboratory glassware as peerless human art.", climaxFa: "نمایشگاه موزه بریتانیا با حضور رهبران فرهنگی جهان، ظروف آزمایشگاهی قرن سیزدهم را به عنوان شاهکار هنر بشر تثبیت کرد.", xpReward: 265 },
  { pathCode: "ABABB", titleEn: "The Glass Conservation Chair", titleFa: "بورسیه حفاظت شیشه‌های باستان", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان ماندگار آموزشی", climaxEn: "Julian's endowed master's program trains fifty conservators annually, ensuring fragile historical glass survives for millennia.", climaxFa: "برنامه کارشناسی ارشد جولیان سالانه پنجاه مرمت‌کار نخبه تربیت می‌کند تا آثار شیشه‌ای تا هزاران سال سالم بمانند.", xpReward: 260 },
  { pathCode: "ABBAA", titleEn: "The Tusi-Bacon Symposium", titleFa: "کنگره جهانی طوسی و بیکن", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان وحدت تمدن‌ها", climaxEn: "The perpetual Oxford-Tehran symposium celebrates intercultural medieval scientific genius, forging bonds of peace through wisdom.", climaxFa: "همایش همیشگی آکسفورد و تهران پیوند علمی متقابل شرق و غرب را گرامی داشت و از دل حکمت کهن، صلح آفرید.", xpReward: 275 },
  { pathCode: "ABBAB", titleEn: "The Facade of the Astrolabe", titleFa: "نقش اسطرلاب بر عمارت علم", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان نمادین و تاریخی", climaxEn: "The bronze astrolabe memorial graces the Museum of History of Science, reminding future scholars of ancient Persian astronomy.", climaxFa: "تندیس برنجی اسطرلاب بر سردر موزه تاریخ علم نشست تا یادآور جاودان سهم بزرگ منجمان ایرانی در تکامل دانش بشری باشد.", xpReward: 270 },
  { pathCode: "ABBBA", titleEn: "The Royal Astrolabe Toast", titleFa: "سلامتی به اسطرلاب پادشاهی", badgeCategory: "heroic", badgeIcon: "🌌", badgeNameFa: "پایان اشرافی اخترشناسی", climaxEn: "Under starry Piccadilly skies, international astronomers celebrate the induction of the world's most accurate medieval instrument.", climaxFa: "زیر آسمان پرستاره لندن، ستاره‌شناسان جهان ورود دقیق‌ترین اسطرلاب قرون وسطایی به تالار افتخارات را جشن گرفتند.", xpReward: 270 },
  { pathCode: "ABBBB", titleEn: "The Virtual Astrolabe Horizon", titleFa: "افق مجازی اسطرلاب جهانی", badgeCategory: "scholar", badgeIcon: "💻", badgeNameFa: "پایان فناوری و آموزش", climaxEn: "Ten million virtual rotations of the digital astrolabe inspire classrooms globally, connecting students to the ancient night sky.", climaxFa: "ده میلیون بار چرخش آنلاین اسطرلاب مجازی در کلاس‌های درس سراسر جهان، دانش‌آموزان را با زیبایی کهکشان پیوند داد.", xpReward: 265 },
  { pathCode: "BAAAA", titleEn: "The Quantum Metamaterial Frontier", titleFa: "مرزهای اپتیک و فرامواد کوانتوم", badgeCategory: "scholar", badgeIcon: "🔬", badgeNameFa: "پایان پیشگامی فیزیک", climaxEn: "The Roger Bacon laboratory pioneers light-bending quantum cloaking, fulfilling a seven-century-old vision of optical mastery.", climaxFa: "آزمایشگاه نوین راجر بیکن فرامواد انحراف‌دهنده نور را ساخت و رویای هفتصد ساله تسلط بر اپتیک را محقق نمود.", xpReward: 275 },
  { pathCode: "BAAAB", titleEn: "The Sheldonian Medieval Procession", titleFa: "رژه باشکوه شلدونیان در سنگفرش‌ها", badgeCategory: "legendary", badgeIcon: "🎓", badgeNameFa: "پایان پرشکوه دانشگاهی", climaxEn: "Robed scholars march through Oxford to bagpipes and fanfares, honoring the eternal covenant between courage and knowledge.", climaxFa: "اساتید با رداهای سنتی در میان نوای سازها در آکسفورد رژه رفتند؛ تجلیل از پیوند ناگسستنی شجاعت و خرد.", xpReward: 265 },
  { pathCode: "BAABA", titleEn: "The UNESCO Summit Trophy", titleFa: "تندیس زرین یونسکو برای فرهنگ", badgeCategory: "heroic", badgeIcon: "🏆", badgeNameFa: "پایان جهانی یونسکو", climaxEn: "The United Nations honors the Scriptorium Project for revolutionizing free public access to humanity's rarest cultural archives.", climaxFa: "سازمان ملل از پروژه اتاقک خطی برای انقلابی در دسترسی رایگان مردم جهان به کهن‌ترین اسناد بشری تقدیر کرد.", xpReward: 275 },
  { pathCode: "BAABB", titleEn: "The Library Teacup Concord", titleFa: "آرامش فنجان چای در بادلین", badgeCategory: "funny", badgeIcon: "🫖", badgeNameFa: "پایان صمیمی و آرام", climaxEn: "Sitting quietly among ancient bookshelves, Clara and Julian clink porcelain cups, content that their quest changed the world.", climaxFa: "در آرامش میان قفسه‌های کتابخانه، کلارا و جولیان فنجان‌های چای را به هم زدند؛ با قلبی آرام که تلاششان جهان را تغییر داد.", xpReward: 255 },
  { pathCode: "BABAA", titleEn: "The Vault Fresco Summit", titleFa: "اجلاس فرسکوهای جاودان", badgeCategory: "legendary", badgeIcon: "🎨", badgeNameFa: "پایان هنری بین‌المللی", climaxEn: "International art historians gather under the illuminated cobalt frescoes, hailing the priory as Britain's Sistine Chapel.", climaxFa: "مورخان برجسته هنر زیر نقاشی‌های لاجوردی گرد آمدند و صومعه را کلیسای سیستین بریتانیا در هنر گوتیک نامیدند.", xpReward: 270 },
  { pathCode: "BABAB", titleEn: "The Gothic Monograph Masterpiece", titleFa: "شاهکار مکتوب هنر گوتیک", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان فاخر انتشاراتی", climaxEn: "The full-color folio monograph on the astrological frescoes wins three publishing prizes, prized in libraries worldwide.", climaxFa: "کتاب نفیس مصور فرسکوهای نجومی سه جایزه بزرگ نشر بین‌المللی را درو کرد و در معتبرترین کتابخانه‌ها ماندگار شد.", xpReward: 265 },
  { pathCode: "BABBA", titleEn: "The Red Carpet BAFTA Triumph", titleFa: "درخشش بفتا بر فرش قرمز", badgeCategory: "heroic", badgeIcon: "🎬", badgeNameFa: "پایان سینمایی و پرافتخار", climaxEn: "Clara and Julian hold their BAFTA statuettes before cheering crowds, proving that the search for historical truth makes great cinema.", climaxFa: "کلارا و جولیان تندیس‌های طلایی بفتا را در تشویق مردم بالای سر بردند؛ گواه اینکه حقیقت تاریخ بزرگ‌ترین سینماست.", xpReward: 270 },
  { pathCode: "BABBB", titleEn: "The Historian's Legacy Fund", titleFa: "صندوق حمایت از کاوشگران فردا", badgeCategory: "scholar", badgeIcon: "🌱", badgeNameFa: "پایان خیریه و آینده‌ساز", climaxEn: "Documentary royalties fund three hundred doctoral research grants, sending young scholars to uncover forgotten archives.", climaxFa: "عواید مستند، سیصد گرنت پژوهشی دکتری تامین کرد تا نسل جوان به کشف گنجینه‌های فراموش‌شده تاریخ بپردازند.", xpReward: 265 },
  { pathCode: "BBAAA", titleEn: "The Pre-Columbian Lisbon Accord", titleFa: "پیمان بازنگری تاریخ در لیسبون", badgeCategory: "legendary", badgeIcon: "🗺️", badgeNameFa: "پایان دگرگون‌ساز تاریخ", climaxEn: "The Lisbon Congress formally adopts the 14th-century Atlantic maps into textbooks, fundamentally reshaping world maritime history.", climaxFa: "کنگره لیسبون نقشه‌های قرن چهاردهمی اقیانوس اطلس را رسماً در کتاب‌های درسی گنجاند و تاریخ ناوبری را بازنویسی کرد.", xpReward: 275 },
  { pathCode: "BBAAB", titleEn: "The Caravel of Bacon's Sea", titleFa: "سفر با کاراول در اقیانوس اطلس", badgeCategory: "explorer", badgeIcon: "⛵", badgeNameFa: "پایان حماسی دریانوردی", climaxEn: "Clara and Julian sail into St. John's harbor aboard a wooden caravel, proving the absolute navigational precision of Bacon's charts.", climaxFa: "کلارا و جولیان با کشتی بادبانی تاریخی در بندر سنت جانز لنگر انداختند و دقت بی‌نقص نقشه‌های بیکن را در عمل اثبات کردند.", xpReward: 275 },
  { pathCode: "BBBAA", titleEn: "The Cartography Institute Hearth", titleFa: "عمارت نوین پژوهشکده کارتوگرافی", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان زیرساختی ملی", climaxEn: "The Oxford Institute's gleaming new home welcomes researchers from eighty nations, charting the forgotten networks of the past.", climaxFa: "عمارت جدید پژوهشکده آکسفورد میزبان دانشمندان از هشتاد کشور شد تا شبکه‌های پیوند کهن تمدن‌ها را بازترسیم کنند.", xpReward: 270 },
  { pathCode: "BBBAB", titleEn: "The Ten-Year Horizon Pact", titleFa: "پیمان افق‌های ده ساله اکتشاف", badgeCategory: "explorer", badgeIcon: "🧭", badgeNameFa: "پایان ماجراجویانه بی‌پایان", climaxEn: "Father Thomas, Clara, and Julian clink glasses under ancient cloisters, ready to unearth thirty more forgotten monastic vaults.", climaxFa: "پدر توماس، کلارا و جولیان در آرامش صومعه جام‌ها را به هم زدند؛ آماده برای گشودن سی خزانه ناشناخته دیگر در جهان.", xpReward: 265 },
  { pathCode: "BBBBA", titleEn: "The UNESCO Golden Quill", titleFa: "قلم طلایی یونسکو برای همبستگی", badgeCategory: "legendary", badgeIcon: "🪶", badgeNameFa: "پایان یگانگی بشریت", climaxEn: "In Paris, Clara Vance receives the Golden Quill for demonstrating that modern civilization was built by the shared hands of all nations.", climaxFa: "در پاریس، کلارا ونس قلم طلایی را دریافت کرد؛ برای اثبات اینکه تمدن امروز با دست‌های پیوسته همه ملت‌ها ساخته شده است.", xpReward: 275 },
  { pathCode: "BBBBB", titleEn: "The Radcliffe Camera Lantern Night", titleFa: "شب فانوس‌های رادکلیف آکسفورد", badgeCategory: "legendary", badgeIcon: "🏮", badgeNameFa: "پایان رویایی و ابدی", climaxEn: "Under glowing lanterns by the Radcliffe Camera, five thousand citizens cheer as Clara holds high the Scriptorium Cipher in triumph.", climaxFa: "زیر نور فانوس‌های رادکلیف آکسفورد، پنج هزار نفر هورا کشیدند وقتی کلارا کتیبه صومعه را در اوج پیروزی بالا برد.", xpReward: 275 },
];

export const story2AntiquarianCipher: AdventureStory = buildAdventureStory({
  id: "c1-antiquarian-cipher",
  storyIndex: 2,
  cefr: "C1",
  titleEn: "The Scriptorium Cipher",
  titleFa: "راز کتیبه پنهان صومعه آکسفورد",
  genre: "mystery",
  genreLabelFa: "🔍 معمایی و کنجکاوی",
  genreIcon: "🔍",
  synopsisEn:
    "When senior paleographer Dr. Clara Vance and archival conservator Julian Croft uncover micro-inscribed alchemical marginalia inside a fourteenth-century gospel, they must decode Roger Bacon's subterranean laboratory secrets across 32 thrilling endings.",
  synopsisFa:
    "هنگام مرمت یک انجیل تذهیب‌شده باستانی قرن چهاردهم در کتابخانه بادلین آکسفورد، دکتر کلارا ونس و جولیان کرافت حاشیه‌نویسی‌های رمزی با ورق طلا و جوهر نامرئی پیدا می‌کنند که به آزمایشگاه زیرزمینی گمشده راجر بیکن منتهی می‌شود. ۳۲ پایان پر از رمزگشایی، هیجان تاریخی و پیوندهای علمی کهن در انتظارته!",
  coverImage: "/images/skills/reading/c1-antiquarian-cipher.webp",
  nodes,
  endings,
});
