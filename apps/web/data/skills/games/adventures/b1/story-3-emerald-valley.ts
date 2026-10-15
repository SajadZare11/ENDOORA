import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3 (B1): The Trek to Emerald Valley (سفر هیجان‌انگیز به دره زمرد)
// Genre: Travel & Adventure (سفر و ماجراجویی)
// CEFR: B1 (Past tenses, conditionals, conjunctions, modals, travel/nature B1 vocab)
// Characters: Maya, Tariq, Elder Samuel, Jasper (the retriever dog)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Maya and Tariq had prepared for months to undertake the legendary three-day trek to Emerald Valley, a remote highland canyon famous for turquoise glacial streams and hidden ancient trails. Accompanied by Jasper, their spirited golden retriever, they stood at the trailhead beneath misty granite peaks. According to their topographic map, the main lower trail followed a rushing river through dense pine forests, while an older, steeper ridge path promised breathtaking panoramic views from high above the clouds.",
    keywords: [
      { word: "undertake", meaningFa: "عهده‌دار شدن / آغاز کردن یک سفر یا کار بزرگ", phonetic: "/ˌʌndəˈteɪk/" },
      { word: "glacial", meaningFa: "یخچالی و آب‌شده از برف‌های کوهستان", phonetic: "/ˈɡlæsiəl/" },
      { word: "spirited", meaningFa: "پرشور، پرانرژی و سرزنده", phonetic: "/ˈspɪrɪtɪd/" },
      { word: "topographic", meaningFa: "توپوگرافی و نقشه‌برداری ناهمواری‌های زمین", phonetic: "/ˌtɒpəˈɡræfɪk/" },
    ],
    question: {
      promptEn: "What did the steeper ridge path promise according to the topographic map?",
      promptFa: "طبق نقشه، مسیر کوهستانی شیب‌دارتر چه منظره‌ای را نوید می‌داد؟",
      options: [
        "Breathtaking panoramic views from high above the clouds",
        "A shortcut with modern paved highways",
        "An underground shopping mall",
      ],
      correctIndex: 0,
      hintSnippet: "steeper ridge path promised breathtaking panoramic views from high above the clouds",
      clueFa: "خط آخر رو نگاه کن دوست من؛ چشم‌اندازهای سراسرنما و نفس‌گیر از بالای ابرها.",
    },
    choiceA: {
      labelEn: "Follow the sheltered pine forest trail along the rushing turquoise river!",
      labelFa: "مسیر جنگل کاج در امتداد رودخانه فیروزه‌ای خروشان رو انتخاب کن!",
      descriptionFa: "هوای خنک و صدای دلنشین آب شما رو همراهی می‌کنه.",
    },
    choiceB: {
      labelEn: "Climb the rugged mountain ridge to gaze above the sea of clouds!",
      labelFa: "از یال صخره‌ای کوه بالا برو تا بر فراز اقیانوس ابرها قدم بزنی!",
      descriptionFa: "دیدن قله‌های برفی از ارتفاع بالا هیجان بی‌پایانی داره.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "The forest path was carpeted with fragrant pine needles, and the roaring river provided a refreshing mist. After trekking for two hours, they encountered a historic wooden suspension bridge swaying gently across a dramatic sixty-foot gorge. Jasper whined slightly at the roaring water below, but Tariq noticed that the thick steel cables were reinforced and well maintained by local park rangers.",
    keywords: [
      { word: "carpeted", meaningFa: "پوشیده شده مثل فرش طبیعی", phonetic: "/ˈkɑːpɪtɪd/" },
      { word: "suspension", meaningFa: "معلق و آویزان با کابل‌ها", phonetic: "/səˈspenʃn/" },
      { word: "gorge", meaningFa: "دره عمیق و صخره‌ای پرشیب", phonetic: "/ɡɔːdʒ/" },
      { word: "reinforced", meaningFa: "تقویت‌شده و محکم‌سازی شده", phonetic: "/ˌriːɪnˈfɔːst/" },
    ],
    question: {
      promptEn: "Who maintained the thick steel cables of the suspension bridge?",
      promptFa: "چه کسانی کابل‌های فولادی ضخیم پل معلق را نگهداری و تقویت کرده بودند؟",
      options: [
        "Local park rangers",
        "Unknown mountain hikers",
        "River fishermen",
      ],
      correctIndex: 0,
      hintSnippet: "reinforced and well maintained by local park rangers",
      clueFa: "خط آخر رو ببین عزیزم؛ محیط‌بانان محلی پارک کابل‌ها رو تقویت کرده بودند.",
    },
    choiceA: {
      labelEn: "Cross the wooden suspension bridge one by one with Jasper!",
      labelFa: "یکی‌یکی همراه جسپر با آرامش از روی پل معلق چوبی رد بشید!",
      descriptionFa: "هیجان تماشای کف دره از لابلای تخته‌های چوبی پل.",
    },
    choiceB: {
      labelEn: "Hike along the riverbank to find the shallow pebble ford crossing!",
      labelFa: "کنار ساحل رودخونه برو تا به گذرگاه کم‌عمق سنگ‌ریزه‌ای برسی!",
      descriptionFa: "عبور با پای پیاده از میان آب خنک رودخانه کوهستانی.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Trekking up the rocky ridge required determination, but the cool mountain breeze kept their spirits high. When they cleared the tree line, the entire valley unfolded beneath them like a vast green emerald. An old shepherd named Samuel was tending his flock near a stone hut. He greeted them warmly with steaming wild-mint tea and warned that an afternoon wind was picking up along the summit trail.",
    keywords: [
      { word: "determination", meaningFa: "عزم راسخ و اراده قوی", phonetic: "/dɪˌtɜːmɪˈneɪʃn/" },
      { word: "unfolded", meaningFa: "گشوده شد و جلوه‌گر گشت", phonetic: "/ʌnˈfəʊldɪd/" },
      { word: "steaming", meaningFa: "داغ و بخارآلود", phonetic: "/ˈstiːmɪŋ/" },
      { word: "tending", meaningFa: "رسیدگی و مراقبت کردن از گله", phonetic: "/ˈtendɪŋ/" },
    ],
    question: {
      promptEn: "What did the shepherd Samuel offer the hikers?",
      promptFa: "چوپان مهربان، ساموئل، چه چیزی به کوهنوردان تعارف کرد؟",
      options: [
        "Steaming wild-mint tea",
        "Cold mountain soda",
        "A slice of frozen watermelon",
      ],
      correctIndex: 0,
      hintSnippet: "greeted them warmly with steaming wild-mint tea",
      clueFa: "خط ماقبل آخر رو بخون؛ چای داغ و معطر نعنای کوهی بهشون داد.",
    },
    choiceA: {
      labelEn: "Rest at Samuel's stone hut and hear the folklore of Emerald Waterfall!",
      labelFa: "کنار کلبه سنگی ساموئل استراحت کن و قصه‌های کهن آبشار زمرد رو بشنو!",
      descriptionFa: "ساموئل بهترین مسیرهای مخفی دره رو می‌شناسه.",
    },
    choiceB: {
      labelEn: "Push onward toward Eagle Pass before the afternoon winds strengthen!",
      labelFa: "قبل از وزش بادهای شدید عصرگاهی به سمت گردنه عقاب حرکت کن!",
      descriptionFa: "رسیدن زودهنگام به گردنه زمان بیشتری برای کمپ زدن میده.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Maya led the way across the suspension bridge, gripping the steel guide cables firmly. Jasper walked beside her, tail wagging bravely as the bridge swayed gently in the mountain breeze. Looking down, they spotted a secluded sandbar beneath the cliff where crystal-clear water pooled in turquoise circles. On the opposite bank, a hidden wooden marker pointed to the 'Ancient Cedar Grove'.",
    keywords: [
      { word: "secluded", meaningFa: "دنج، خلوت و دورافتاده", phonetic: "/sɪˈkluːdɪd/" },
      { word: "pooled", meaningFa: "جمع شد و حوضچه‌ای تشکیل داد", phonetic: "/puːld/" },
      { word: "cedar", meaningFa: "درخت سرو کهنسال و معطر", phonetic: "/ˈsiːdə/" },
    ],
    question: {
      promptEn: "Where did the wooden marker point on the opposite bank?",
      promptFa: "تابلوی چوبی در آن سوی رودخانه به کدام سمت اشاره می‌کرد؟",
      options: [
        "To the 'Ancient Cedar Grove'",
        "To the city bus station",
        "To an abandoned mine shaft",
      ],
      correctIndex: 0,
      hintSnippet: "pointed to the 'Ancient Cedar Grove'",
      clueFa: "خط آخر رو نگاه کن دوست من؛ به سمت «بیشه سروهای کهنسال» اشاره داشت.",
    },
    choiceA: {
      labelEn: "Trek into the Ancient Cedar Grove to seek the thousand-year-old tree!",
      labelFa: "وارد بیشه سروهای کهنسال شو تا درخت هزارساله افسانه‌ای رو پیدا کنی!",
      descriptionFa: "سایه دل‌انگیز درختان غول‌پیکر عطر جنگل‌های باستانی رو داره.",
    },
    choiceB: {
      labelEn: "Follow the river gorge path toward the crashing Whispering Falls!",
      labelFa: "مسیر صخره‌ای رودخانه رو به سمت آبشار پرغرش زمزمه پیش بگیر!",
      descriptionFa: "قطرات معلق آب در هوا مثل رنگین‌کمان می‌درخشند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Tariq and Maya unlaced their hiking boots, tied them securely to their packs, and waded into the crystal pebble ford. The glacier water was invigoratingly cold, sending prickles of energy through their legs. Midway across, Jasper nudged a smooth, translucent river stone with his paw: when Maya held it up to the sunlight, it glowed with vibrant green veins like a genuine rough emerald.",
    keywords: [
      { word: "invigoratingly", meaningFa: "طراوت‌بخش و انرژی‌آفرین", phonetic: "/ɪnˈvɪɡəreɪtɪŋli/" },
      { word: "translucent", meaningFa: "نیمه‌شفاف و عبوردهنده نور", phonetic: "/trænzˈluːsnt/" },
      { word: "veins", meaningFa: "رگه‌ها و خطوط طبیعی سنگ", phonetic: "/veɪnz/" },
    ],
    question: {
      promptEn: "What did the smooth river stone look like when held up to the sunlight?",
      promptFa: "وقتی سنگ صیقلی رودخانه جلوی نور خورشید گرفته شد چه شکلی داشت؟",
      options: [
        "It glowed with vibrant green veins like a rough emerald",
        "It was completely pitch black",
        "It melted like an ice cube",
      ],
      correctIndex: 0,
      hintSnippet: "it glowed with vibrant green veins like a genuine rough emerald",
      clueFa: "خط آخر رو ببین؛ با رگه‌های سبز درخشان مثل زمرد طبیعی می‌درخشید.",
    },
    choiceA: {
      labelEn: "Pocket the green gemstone as a lucky expedition talisman!",
      labelFa: "سنگ زمردین رو به عنوان نشان شانس سفر در جیب کوله‌پشتی بگذار!",
      descriptionFa: "یادگاری زیبایی از رودخانه خروشان.",
    },
    choiceB: {
      labelEn: "Inspect the pebble bed for an ancient geological mineral vein!",
      labelFa: "بستر سنگی رودخانه رو برای یافتن رگه معدنی طبیعی بررسی کن!",
      descriptionFa: "شاید یک پدیده زمین‌شناسی شگفت‌انگیز کشف کنید.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Samuel unrolled a hand-drawn leather map showing secret shepherd paths etched across the high plateau. 'Generations of shepherds have guarded the secret of the Sky Sanctuary,' he smiled warmly. 'If you take the High Ridge route, you will find a natural crystal spring where mountain eagles nest. It will cut two hours off your journey to the valley floor.'",
    keywords: [
      { word: "plateau", meaningFa: "فلات مرتفع کوهستانی", phonetic: "/ˈplætəʊ/" },
      { word: "sanctuary", meaningFa: "پناهگاه امن و مقدس طبیعت", phonetic: "/ˈsæŋktʃuəri/" },
      { word: "generations", meaningFa: "نسل‌های پیاپی در طول تاریخ", phonetic: "/ˌdʒenəˈreɪʃnz/" },
    ],
    question: {
      promptEn: "What birds nested near the crystal spring on the high ridge?",
      promptFa: "چه پرندگانی نزدیک چشمه بلورین در یال بالایی لانه داشتند؟",
      options: [
        "Mountain eagles",
        "Green parrots",
        "Sea gulls",
      ],
      correctIndex: 0,
      hintSnippet: "where mountain eagles nest",
      clueFa: "خط سوم رو نگاه کن عزیزم؛ عقاب‌های بلندپرواز کوهستان لانه داشتند.",
    },
    choiceA: {
      labelEn: "Follow Samuel's secret shepherd trail to the Sky Sanctuary!",
      labelFa: "مسیر چوپانی مخفی ساموئل به سمت پناهگاه آسمان رو دنبال کن!",
      descriptionFa: "دیدن آشیانه عقاب‌ها و نوشیدن از چشمه گوارای کوه.",
    },
    choiceB: {
      labelEn: "Ask Samuel to join your expedition as chief mountain guide!",
      labelFa: "از ساموئل خواهش کن به عنوان راهنمای ارشد به سفر شما ملحق بشه!",
      descriptionFa: "تجربه چهل‌ساله پیرمرد امنیت سفر رو تضمین می‌کنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Marching determinedly along Eagle Pass, they reached an elevation of seven thousand feet. The gusting winds sang between the jagged limestone spires, creating an eerie yet majestic sound. Perched atop a flat granite lookout was an old stone cairn built by mountaineers in nineteen-fifty. Tucked beneath the stones was a weather-sealed brass cylinder containing the summit guestbook.",
    keywords: [
      { word: "jagged", meaningFa: "دندانه‌دار و نوک‌تیز صخره‌ای", phonetic: "/ˈdʒæɡɪd/" },
      { word: "spires", meaningFa: "برجک‌ها و ستون‌های نوک‌تیز طبیعی سنگ", phonetic: "/ˈspaɪəz/" },
      { word: "cairn", meaningFa: "هرم سنگی یادبود ساخته کوهنوردان", phonetic: "/keən/" },
    ],
    question: {
      promptEn: "What was tucked beneath the stones of the mountaineers' cairn?",
      promptFa: "زیر سنگ‌های هرم یادبود کوهنوردان چه چیزی قرار داشت؟",
      options: [
        "A weather-sealed brass cylinder containing the guestbook",
        "A box of warm woolen blankets",
        "A rusted climbing axe",
      ],
      correctIndex: 0,
      hintSnippet: "a weather-sealed brass cylinder containing the summit guestbook",
      clueFa: "خط آخر رو ببین؛ استوانه برنجی ضدآب حاوی دفترچه یادبود صعودکنندگان.",
    },
    choiceA: {
      labelEn: "Sign your names into the historic mountaineers' summit log!",
      labelFa: "نام خودتون و جسپر رو در دفترچه تاریخی قله ثبت کنید!",
      descriptionFa: "جاودانه شدن خاطره صعود در دل کوهستان.",
    },
    choiceB: {
      labelEn: "Use your binoculars to scout the safest descent trail into the valley!",
      labelFa: "با دوربین دوچشمی امن‌ترین مسیر فرود به دره زمرد رو شناسایی کن!",
      descriptionFa: "پیدا کردن شیب ملایم کار فرود رو راحت‌تر می‌کنه.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "The ancient cedars soared over two hundred feet into the sky, their colossal trunks draped in velvet emerald moss. Standing in the silent heart of the grove was the 'Grandfather Tree', so wide that eight hikers joining hands could barely encircle it. At its base, a crystal-clear natural fountain bubbled into a pool ringed with wild mountain orchids.",
    keywords: [
      { word: "colossal", meaningFa: "غول‌پیکر و عظیم‌الجثه", phonetic: "/kəˈlɒsl/" },
      { word: "encircle", meaningFa: "احاطه کردن / حلقه زدن دور چیزی", phonetic: "/ɪnˈsɜːkl/" },
      { word: "orchids", meaningFa: "گل‌های ارکیده کوهی کمیاب", phonetic: "/ˈɔːkɪdz/" },
    ],
    question: {
      promptEn: "How many hikers joining hands could barely encircle the Grandfather Tree?",
      promptFa: "چند کوهنورد با گرفتن دست‌های هم به زحمت می‌توانستند دور درخت حلقه بزنند؟",
      options: [
        "Eight hikers",
        "Two hikers",
        "Twenty hikers",
      ],
      correctIndex: 0,
      hintSnippet: "so wide that eight hikers joining hands could barely encircle it",
      clueFa: "خط دوم رو بخون؛ هشت کوهنورد دست در دست هم به زحمت به هم می‌رسیدند.",
    },
    choiceA: {
      labelEn: "Pitch your lightweight expedition tent beside the orchid pool!",
      labelFa: "چادر سبک کوهنوردی رو کنار حوضچه ارکیده‌ها برپا کنید!",
      descriptionFa: "شبی جادویی در آرامش بیشه هزارساله.",
    },
    choiceB: {
      labelEn: "Sketch the colossal tree trunk in your nature botanical journal!",
      labelFa: "طرح درخت باستانی رو با مداد در دفترچه گیاه‌شناسی نقاشی کن!",
      descriptionFa: "ثبت گونه‌های نادر گیاهی برای علاقه‌مندان به طبیعت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Following the gorge, the roar of falling water intensified until they rounded a granite bend and beheld Whispering Falls. A roaring veil of white water plunged two hundred feet into a glowing turquoise lagoon, generating an eternal rainbow that arched across the canyon walls. Cool, fragrant spray washed over their tired faces, filling them with boundless joy.",
    keywords: [
      { word: "intensified", meaningFa: "شدت گرفت و قوی‌تر شد", phonetic: "/ɪnˈtensɪfaɪd/" },
      { word: "veil", meaningFa: "پرده و تور آبشار", phonetic: "/veɪl/" },
      { word: "lagoon", meaningFa: "تالاب و آبگیر فیروزه‌ای آرام", phonetic: "/ləˈɡuːn/" },
    ],
    question: {
      promptEn: "What arched across the canyon walls near Whispering Falls?",
      promptFa: "نزدیک آبشار زمزمه چه پدیده‌ای روی دیواره‌های دره کمانه زده بود؟",
      options: [
        "An eternal rainbow",
        "A wooden rope bridge",
        "A flock of flying bats",
      ],
      correctIndex: 0,
      hintSnippet: "generating an eternal rainbow that arched across the canyon walls",
      clueFa: "خط سوم رو ببین؛ یک رنگین‌کمان ابدی و درخشان ایجاد شده بود.",
    },
    choiceA: {
      labelEn: "Swim cautiously in the turquoise lagoon pool under the rainbow!",
      labelFa: "با احتیاط در آبگیر فیروزه‌ای زیر طاق رنگین‌کمان شنا کنید!",
      descriptionFa: "آب‌تنی در خنکای آبشار خستگی چند ساعت پیاده‌روی رو می‌شوره.",
    },
    choiceB: {
      labelEn: "Search behind the waterfall curtain for a secret cavern!",
      labelFa: "پشت پرده ریزش آبشار رو برای پیدا کردن غار مخفی بگرد!",
      descriptionFa: "همیشه پشت آبشارهای بزرگ غارهای شگفت‌انگیز پنهان شده‌اند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Tariq wrapped the green translucent gemstone in a soft cotton bandana. As dusk descended, they set up their camp on a high pebble terrace. When Tariq built a small campfire with dry birch branches, the stone caught the flickering golden flames and radiated an emerald beacon that reflected warmly off their tent fabric.",
    keywords: [
      { word: "bandana", meaningFa: "دستمال‌سر پارچه‌ای", phonetic: "/bænˈdænə/" },
      { word: "flickering", meaningFa: "سوسوزننده و رقصان (شعله آتش)", phonetic: "/ˈflɪkərɪŋ/" },
      { word: "radiated", meaningFa: "پرتوافشانی کرد / نور تاباند", phonetic: "/ˈreɪdieɪtɪd/" },
    ],
    question: {
      promptEn: "What did the green stone do when the campfire was lit?",
      promptFa: "وقتی آتش اردوگاه روشن شد سنگ سبز چه واکنشی نشان داد؟",
      options: [
        "Radiated an emerald beacon reflecting on the tent",
        "Turned completely into gray dust",
        "Made a loud whistling noise",
      ],
      correctIndex: 0,
      hintSnippet: "the stone caught the flickering golden flames and radiated an emerald beacon",
      clueFa: "خط آخر رو نگاه کن؛ مثل مشعل زمردین درخشید و نور به چادر تاباند.",
    },
    choiceA: {
      labelEn: "Roast campfire marshmallows and share ghost stories under the stars!",
      labelFa: "مارشملو روی آتش کباب کنید و زیر آسمان پرستاره قصه بگویید!",
      descriptionFa: "لحظاتی گرم و صمیمی دور آتش هیزمی.",
    },
    choiceB: {
      labelEn: "Use your stargazing app to identify celestial constellations!",
      labelFa: "با نرم‌افزار ستاره‌شناسی، صورت‌های فلکی کهکشان راه شیری رو رصد کن!",
      descriptionFa: "آسمان کوهستان شفاف‌ترین تصویر از کهکشان رو نشون میده.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Examining the riverbed with their geology hammer, they traced the source of the emerald rocks to a hidden mineral fault line running along the riverbank. Embedded in the white quartz rock were clusters of raw, hexagonal beryl crystals, indicating a major natural geological formation untouched by human mining.",
    keywords: [
      { word: "mineral", meaningFa: "معدنی و کانی‌های طبیعی", phonetic: "/ˈmɪnərəl/" },
      { word: "quartz", meaningFa: "سنگ کوارتز بلورین", phonetic: "/kwɔːts/" },
      { word: "hexagonal", meaningFa: "شش‌ضلعی هندسی منظم", phonetic: "/hekˈsæɡənl/" },
    ],
    question: {
      promptEn: "What shape were the raw beryl crystals embedded in the quartz?",
      promptFa: "بلورهای بریل طبیعی درون کوارتز چه شکلی داشتند؟",
      options: [
        "Hexagonal crystals",
        "Perfect spherical balls",
        "Flat square sheets",
      ],
      correctIndex: 0,
      hintSnippet: "clusters of raw, hexagonal beryl crystals",
      clueFa: "خط ماقبل آخر رو بخون؛ بلورهای شش‌ضلعی منظم بودند.",
    },
    choiceA: {
      labelEn: "Log the precise GPS coordinates to request national park protection!",
      labelFa: "مختصات دقیق جی‌پی‌اس رو ثبت کن تا منطقه تحت حفاظت ملی دربیاد!",
      descriptionFa: "حفظ طبیعت از گزند بهره‌برداری غیرقانونی.",
    },
    choiceB: {
      labelEn: "Take high-resolution scientific photos for the Geological Survey!",
      labelFa: "عکس‌های علمی باکیفیت برای سازمان زمین‌شناسی تهیه کن!",
      descriptionFa: "سندی ماندگار برای جامعه علمی کشور.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Following the shepherd's directions, they ascended to the Sky Sanctuary: a tranquil alpine meadow perched on a natural rock shelf six thousand feet high. In the center, pure meltwater bubbled from a limestone spring into a crystal basin. Just above on the crags, a pair of magnificent golden eagles watched peacefully over the valley.",
    keywords: [
      { word: "tranquil", meaningFa: "آرام، بی‌سر و صدا و باصفا", phonetic: "/ˈtræŋkwɪl/" },
      { word: "meltwater", meaningFa: "آب زلال حاصل از ذوب برف‌های قله", phonetic: "/ˈmɛltwɔːtə/" },
      { word: "basin", meaningFa: "حوضچه طبیعی سنگی", phonetic: "/ˈbeɪsn/" },
    ],
    question: {
      promptEn: "What was watching peacefully from the crags above the meadow?",
      promptFa: "از روی صخره‌های بالای چمنزار چه پرندگانی با آرامش تماشا می‌کردند؟",
      options: [
        "A pair of magnificent golden eagles",
        "A flock of white mountain geese",
        "Two small mountain owls",
      ],
      correctIndex: 0,
      hintSnippet: "a pair of magnificent golden eagles watched peacefully over the valley",
      clueFa: "خط آخر رو ببین؛ یک جفت عقاب طلایی باشکوه.",
    },
    choiceA: {
      labelEn: "Fill your canteens with pure sweet water from the crystal spring!",
      labelFa: "قمقمه‌ها رو از آب زلال و شیرین چشمه کوهستان پر کنید!",
      descriptionFa: "خنک‌ترین و گواراترین آبی که تا به حال چشیده‌اید.",
    },
    choiceB: {
      labelEn: "Set up your telephoto camera to capture the soaring eagles!",
      labelFa: "دوربین تله‌فوتو رو برای ثبت پرواز عقاب‌ها تنظیم کن!",
      descriptionFa: "تصویری حماسی از بال گشودن پرندگان شکاری.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Elder Samuel led with the surefooted stride of a mountain goat, entertaining them with legends of miners and explorers who had searched for the valley's secrets. With his guidance, they navigated a tricky scree slope effortlessly, arriving at the lower canyon gate hours before the sun began to sink below the horizon.",
    keywords: [
      { word: "surefooted", meaningFa: "استوارگام و بدون لغزش در شیب‌ها", phonetic: "/ˌʃɔːˈfʊtɪd/" },
      { word: "stride", meaningFa: "گام‌های بلند و محکم", phonetic: "/straɪd/" },
      { word: "scree", meaningFa: "شن‌اسکی و سنگ‌ریزه‌های لغزان دامنه کوه", phonetic: "/skriː/" },
    ],
    question: {
      promptEn: "How did Samuel navigate the tricky scree slope?",
      promptFa: "ساموئل چطور از دامنه لغزان شن‌اسکی عبور کرد؟",
      options: [
        "Effortlessly with surefooted steps like a mountain goat",
        "He slid down on a piece of cardboard",
        "He had to crawl very slowly on hands and knees",
      ],
      correctIndex: 0,
      hintSnippet: "navigated a tricky scree slope effortlessly",
      clueFa: "خط دوم رو ببین عزیزم؛ با گام‌های استوار و بدون هیچ زحمتی مثل بز کوهی.",
    },
    choiceA: {
      labelEn: "Help Samuel pitch camp at the ancient shepherd's pine grove!",
      labelFa: "به ساموئل در برپایی اردوگاه در بیشه کاج کهنسال کمک کنید!",
      descriptionFa: "شام گرم دور آتش همراه با خنده‌های پیرمرد خردمند.",
    },
    choiceB: {
      labelEn: "Celebrate reaching the canyon gate by preparing a shared feast!",
      labelFa: "رسیدن به دروازه دره رو با پختن یک شام کوهستانی جشن بگیرید!",
      descriptionFa: "سوپ گرم سبزیجات و نان کوهی در هوای خنک عصر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Tariq inscribed their names into the mountaineers' log: 'Maya, Tariq, and Jasper the brave dog — October 2026'. As he flipped through earlier pages, he found entries from legendary explorers dating back seventy years, each leaving words of wisdom about respecting the wild mountains.",
    keywords: [
      { word: "inscribed", meaningFa: "ثبت کرد / با دقت نوشت", phonetic: "/ɪnˈskraɪbd/" },
      { word: "wisdom", meaningFa: "حکمت و پند ارزشمند", phonetic: "/ˈwɪzdəm/" },
      { word: "respecting", meaningFa: "احترام گذاشتن و پاسداری از چیزی", phonetic: "/rɪˈspektɪŋ/" },
    ],
    question: {
      promptEn: "What did earlier explorers leave in the summit guestbook?",
      promptFa: "کوهنوردان قدیمی چه چیزی در دفترچه قله به یادگار گذاشته بودند؟",
      options: [
        "Words of wisdom about respecting the wild mountains",
        "Complaints about cold weather",
        "Drawings of fast racing cars",
      ],
      correctIndex: 0,
      hintSnippet: "each leaving words of wisdom about respecting the wild mountains",
      clueFa: "خط آخر رو نگاه کن؛ سخنان حکیمانه درباره احترام به طبیعت وحشی کوه.",
    },
    choiceA: {
      labelEn: "Read the oldest nineteen-fifties entry aloud by the stone cairn!",
      labelFa: "قدیمی‌ترین یادداشت سال ۱۹۵۰ رو با صدای بلند کنار هرم سنگی بخون!",
      descriptionFa: "طنین تاریخ و احساس پیوند با کوهنوردان گذشته.",
    },
    choiceB: {
      labelEn: "Leave a miniature brass compass inside the cylinder for future hikers!",
      labelFa: "یک قطب‌نمای کوچک برنجی برای کوهنوردان بعدی در استوانه یادگار بذار!",
      descriptionFa: "هدیه‌ای غافلگیرکننده برای نفر بعدی که به قله می‌رسد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Through the high-magnification binoculars, Maya spotted a gentle switchback trail zigzagging down through fields of purple alpine wildflowers directly to the Emerald Lake campsite. The path bypassed dangerous rocky cliffs completely, ensuring an easy and joyful descent.",
    keywords: [
      { word: "switchback", meaningFa: "مسیر مارپیچ زیگزاگی ملایم در شیب", phonetic: "/ˈswɪtʃbæk/" },
      { word: "zigzagging", meaningFa: "حرکت زیگزاگی و پرپیچ‌وخم", phonetic: "/ˈzɪɡzæɡɪŋ/" },
      { word: "bypassed", meaningFa: "دور زد و میان‌بُر زد", phonetic: "/ˈbaɪpɑːst/" },
    ],
    question: {
      promptEn: "What flowers were blooming along the switchback descent trail?",
      promptFa: "چه گل‌هایی در طول مسیر زیگزاگی فرود شکوفه داده بودند؟",
      options: [
        "Purple alpine wildflowers",
        "Red roses from a greenhouse",
        "Yellow desert cactus flowers",
      ],
      correctIndex: 0,
      hintSnippet: "fields of purple alpine wildflowers directly to the Emerald Lake campsite",
      clueFa: "خط اول رو ببین؛ دشت‌هایی از گل‌های وحشی بنفش کوهستان.",
    },
    choiceA: {
      labelEn: "Hike briskly down through the fragrant purple wildflower fields!",
      labelFa: "با نشاط و پرانرژی از میان دشت‌های گل بنفش معطر فرود بیایید!",
      descriptionFa: "عطر گل‌ها و هوای عصرگاهی بهترین حس دنیاست.",
    },
    choiceB: {
      labelEn: "Pause at the halfway wildflower meadow to watch the fiery sunset!",
      labelFa: "در دشت میانی توقف کن تا غروب آتشین خورشید رو تماشا کنی!",
      descriptionFa: "رنگ‌های طلایی و سرخ روی قله‌ها منظره‌ای نقاشی‌مانند می‌سازند.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Nestled beside the orchid pool beneath the thousand-year-old cedar, Maya and Tariq zipped up their cozy sleeping bags. Jasper curled at their feet, purring with content under the starry canopy.",
    keywords: [{ word: "canopy", meaningFa: "سقف شاخ‌وبرگ درختان", phonetic: "/ˈkænəpi/" }],
    question: {
      promptEn: "Where did Jasper sleep for the night?",
      promptFa: "جسپر شب را در کجا به خواب رفت؟",
      options: ["Curled at their feet inside the tent", "Up in the tree branches", "Outside in the river water"],
      correctIndex: 0,
      hintSnippet: "Jasper curled at their feet, purring with content",
      clueFa: "پایین پاهای بچه‌ها با آرامش حلقه زد و خوابید.",
    },
    choiceA: {
      labelEn: "Awake to sunrise songbirds singing in the cedar boughs!",
      labelFa: "با نغمه پرندگان سحرخیز در شاخه‌های سرو کهنسال بیدار شوید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Brew morning tea using fresh orchid dew drops!",
      labelFa: "با قطرات شبنم تازه روی گل‌های ارکیده چای صبحگاهی دم کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Maya completed an exquisite colored sketch of the Grandfather Tree, recording its circumference, moss patterns, and accompanying botanical notes with scientific precision.",
    keywords: [{ word: "circumference", meaningFa: "محیط دایره تنه درخت", phonetic: "/səˈkʌmfərəns/" }],
    question: {
      promptEn: "What did Maya record in her botanical notebook?",
      promptFa: "مایا چه مواردی را در دفترچه گیاه‌شناسی‌اش ثبت کرد؟",
      options: ["Tree circumference, moss patterns, and botanical notes", "Math test scores", "A shopping list for groceries"],
      correctIndex: 0,
      hintSnippet: "recording its circumference, moss patterns, and accompanying botanical notes",
      clueFa: "محیط تنه، الگوهای خزه و نکات علمی گیاهی را یادداشت کرد.",
    },
    choiceA: {
      labelEn: "Submit the botanical discovery to the National Forest Conservatory!",
      labelFa: "کشف گیاهی را به سازمان حفاظت جنگل‌های ملی ارائه دهید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Display your botanical artwork at the Mountain Travelers' Expo!",
      labelFa: "طراحی‌های هنری گیاهان را در نمایشگاه گردشگران کوهستان عرضه کنید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Wading into the warm shallows beneath the misty rainbow, Maya and Tariq floated peacefully. The spray filled the air with negative ions, leaving them refreshed and exhilarated.",
    keywords: [{ word: "exhilarated", meaningFa: "سرشار از نشاط و سرزندگی وصف‌ناپذیر", phonetic: "/ɪɡˈzɪləreɪtɪd/" }],
    question: {
      promptEn: "How did the waterfall spray make them feel?",
      promptFa: "قطرات معلق آبشار چه حسی در آنها ایجاد کرد؟",
      options: ["Refreshed and exhilarated", "Freezing and sick", "Sleepy and bored"],
      correctIndex: 0,
      hintSnippet: "leaving them refreshed and exhilarated",
      clueFa: "سرشار از حس شادابی، تازگی و نشاط بی‌پایان.",
    },
    choiceA: {
      labelEn: "Swim right to the rainbow center for an iconic adventure photo!",
      labelFa: "تا مرکز رنگین‌کمان شنا کنید تا عکسی تاریخی و رویایی بگیرید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Dive gently to collect smooth turquoise pebbles from the lagoon floor!",
      labelFa: "برای جمع‌آوری سنگ‌ریزه‌های صیقلی فیروزه‌ای غواصی کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Stepping behind the curtain of falling water, they entered a dry, echoing chamber whose quartz walls sparkled like a hall of mirrors reflecting turquoise light.",
    keywords: [{ word: "chamber", meaningFa: "تالار و اتاقک طبیعی درون غار", phonetic: "/ˈtʃeɪmbə/" }],
    question: {
      promptEn: "What did the quartz walls inside the hidden cavern look like?",
      promptFa: "دیواره‌های کوارتزی درون غار مخفی شبیه چه چیزی بودند؟",
      options: ["A hall of mirrors reflecting turquoise light", "Dark muddy bricks", "A cold iron wall"],
      correctIndex: 0,
      hintSnippet: "sparkled like a hall of mirrors reflecting turquoise light",
      clueFa: "مثل تالار آینه‌ها که نور فیروزه‌ای را بازتاب می‌داد.",
    },
    choiceA: {
      labelEn: "Light a camping lantern to illuminate the shimmering crystal ceiling!",
      labelFa: "فانوس اردوگاهی را روشن کنید تا سقف بلورین درخشان روشن شود!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Sing an acoustic harmony that reverberates through the waterfall cave!",
      labelFa: "آوازی بخوانید که پژواک آن در دل غار آبشار طنین بیندازد!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Sitting close by the crackling campfire, they toasted marshmallows until golden brown. Stories flowed freely while the Milky Way arced like diamond dust across the indigo sky.",
    keywords: [{ word: "crackling", meaningFa: "ترق‌تروق صدا کردن آتش هیزم", phonetic: "/ˈkræklɪŋ/" }],
    question: {
      promptEn: "What arced across the indigo night sky above the camp?",
      promptFa: "چه چیزی مثل غبار الماس بر فراز آسمان نیلگون شب کمانه زده بود؟",
      options: ["The Milky Way galaxy", "A bright green airplane", "A smoke cloud"],
      correctIndex: 0,
      hintSnippet: "while the Milky Way arced like diamond dust across the indigo sky",
      clueFa: "کهکشان راه شیری مثل ستاره‌های درخشان الماس‌گون.",
    },
    choiceA: {
      labelEn: "Sleep beneath the open stars without putting up the rain fly!",
      labelFa: "زیر آسمان باز و ستارگان بدون کشیدن سقف چادر بخوابید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Toast an extra golden marshmallow to reward Jasper's loyalty!",
      labelFa: "یک خوراکی خوشمزه برای پاداش وفاداری جسپر کنار بگذارید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Tariq aligned their telescope with Jupiter, viewing its four Galilean moons with astonishing clarity. Jasper sat quietly, resting his head on Maya's knee under the vast cosmos.",
    keywords: [{ word: "astonishing", meaningFa: "حیرت‌انگیز و شگفت‌آور", phonetic: "/əˈstɒnɪʃɪŋ/" }],
    question: {
      promptEn: "Which planet and its four moons did they view through the telescope?",
      promptFa: "کدام سیاره و چهار قمرش را با تلسکوپ تماشا کردند؟",
      options: ["Jupiter and its four Galilean moons", "Mars and its two moons", "Saturn and its rings"],
      correctIndex: 0,
      hintSnippet: "aligned their telescope with Jupiter, viewing its four Galilean moons",
      clueFa: "سیاره مشتری و چهار قمر معروف گالیله‌ای آن.",
    },
    choiceA: {
      labelEn: "Map out the satellite orbits in your astronomy travel diary!",
      labelFa: "مدار ماه‌های مشتری را در دفترچه رصد سفر ثبت کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Make a wish upon a bright shooting star streaking across the ridge!",
      labelFa: "با عبور شهاب‌سنگ درخشان از بالای قله یک آرزوی قشنگ کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Park authorities officially accepted the GPS coordinates, immediately designating the canyon a Grade-A Geological Reserve to protect its emerald formations forever.",
    keywords: [{ word: "designating", meaningFa: "تعیین کردن و نام‌گذاری رسمی", phonetic: "/ˈdezɪɡneɪtɪŋ/" }],
    question: {
      promptEn: "What did park authorities designate the canyon as?",
      promptFa: "مسئولان پارک دره را رسماً چه منطقه‌ای نامیدند؟",
      options: ["A Grade-A Geological Reserve", "A public mining zone", "A highway construction site"],
      correctIndex: 0,
      hintSnippet: "designating the canyon a Grade-A Geological Reserve",
      clueFa: "منطقه درجه یک حفاظت‌شده ذخیره‌گاه زمین‌شناسی.",
    },
    choiceA: {
      labelEn: "Receive honorary Conservation Badges at the Park Headquarters!",
      labelFa: "مدال‌های افتخاری حفاظت از محیط‌زیست را در اداره پارک دریافت کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Name the newly protected site 'The Jasper Emerald Fault'!",
      labelFa: "محل رگه زمردین را به افتخار سگ باوفایتان «گسل زمرد جسپر» بنامید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Their macro photographs of the hexagonal beryl crystals won first place in the National Earth Science Gallery, earning scholarships for both young explorers.",
    keywords: [{ word: "scholarships", meaningFa: "بورسیه‌های تحصیلی دانشگاهی", phonetic: "/ˈskɒləʃɪps/" }],
    question: {
      promptEn: "What did the high-resolution crystal photos win?",
      promptFa: "عکس‌های ماکرو و دقیق بلورها چه افتخاری کسب کردند؟",
      options: ["First place in National Earth Science Gallery and scholarships", "A box of pencils", "A free meal coupon"],
      correctIndex: 0,
      hintSnippet: "won first place in the National Earth Science Gallery, earning scholarships",
      clueFa: "رتبه اول گالری علوم زمین و بورسیه کامل تحصیلی.",
    },
    choiceA: {
      labelEn: "Deliver a presentation on mineral conservation at the University!",
      labelFa: "کنفرانسی درباره حفاظت از کانی‌های طبیعی در دانشگاه ارائه دهید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Publish a full-page photo spread in Outdoor Explorer Magazine!",
      labelFa: "عکس‌ها را به صورت تمام‌صفحه در مجله کاشفان طبیعت منتشر کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The crystal spring water tasted cold and naturally sweet, rich with beneficial minerals. Rejuvenated, Maya and Tariq felt strong enough to hike another twenty miles.",
    keywords: [{ word: "rejuvenated", meaningFa: "تجدید قوا کرده و سرشار از جوانی و قدرت دوباره", phonetic: "/rɪˈdʒuːvəneɪtɪd/" }],
    question: {
      promptEn: "How did the spring water taste?",
      promptFa: "طعم آب چشمه کوهستان چگونه بود؟",
      options: ["Cold and naturally sweet, rich with minerals", "Warm and muddy", "Salty like ocean water"],
      correctIndex: 0,
      hintSnippet: "tasted cold and naturally sweet, rich with beneficial minerals",
      clueFa: "خنک و به طور طبیعی شیرین و سرشار از املاح مفید.",
    },
    choiceA: {
      labelEn: "Fill two insulated bottles to bring home as the 'Elixir of the Peaks'!",
      labelFa: "دو قمقمه عایق‌دار را به عنوان اکسیر سلامتی قله‌ها پر کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Toast with your metal mugs to eternal friendship and wild journeys!",
      labelFa: "لیوان‌های فلزی را به سلامتی دوستی ابدی و سفرهای آینده به هم بزنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Tariq captured a breathtaking telephoto image of the golden eagle banking against the snowy peak of Mount Serenity, its massive wings catching the golden hour light.",
    keywords: [{ word: "banking", meaningFa: "تغییر جهت و اوج گرفتن مورب در آسمان", phonetic: "/ˈbæŋkɪŋ/" }],
    question: {
      promptEn: "What was the golden eagle banking against in the photograph?",
      promptFa: "عقاب طلایی در پس‌زمینه تصویر رو به کدام کوه اوج گرفته بود؟",
      options: ["The snowy peak of Mount Serenity", "A line of electrical poles", "A smokestack from a factory"],
      correctIndex: 0,
      hintSnippet: "banking against the snowy peak of Mount Serenity",
      clueFa: "قله برفی کوهستان آرامش در پس‌زمینه بود.",
    },
    choiceA: {
      labelEn: "Submit the majestic eagle photograph to Geographic Wildlife Annual!",
      labelFa: "عکس باشکوه پرواز عقاب را به سالنامه حیات‌وحش ارسال کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Frame the eagle print as a gift for Samuel's mountainside cabin!",
      labelFa: "تصویر قاب‌شده عقاب را به عنوان یادگاری به کلبه ساموئل هدیه دهید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Around the crackling campfire in the pine grove, Samuel showed them how to carve wooden walking staffs from fallen ash branches, engraving intricate eagle feathers on the handles.",
    keywords: [{ word: "intricate", meaningFa: "بسیار ظریف، پیچیده و هنرمندانه", phonetic: "/ˈɪntrɪkət/" }],
    question: {
      promptEn: "What did Samuel show them how to carve from fallen ash branches?",
      promptFa: "ساموئل چطور ساخت چه وسیله‌ای را به آنها آموزش داد؟",
      options: ["Wooden walking staffs with eagle feathers", "Wooden soup spoons", "Toy sailboats"],
      correctIndex: 0,
      hintSnippet: "how to carve wooden walking staffs from fallen ash branches",
      clueFa: "چوب‌دستی‌های کوهنوردی منبت‌کاری‌شده با طرح پر عقاب.",
    },
    choiceA: {
      labelEn: "Use your newly carved staffs on all future expeditions worldwide!",
      labelFa: "چوب‌دستی‌های دست‌ساز را در تمام سفرهای آینده در سراسر جهان به دست بگیرید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Thank Samuel with a heartfelt handshake and promise to visit each summer!",
      labelFa: "با دست دادن صمیمانه از ساموئل تشکر کنید و قول دیدار در تابستان بعد بدهید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Together they cooked a mouthwatering mountain stew: red beans, wild root vegetables, and fragrant rosemary dumplings simmering in a cast-iron pot over glowing embers.",
    keywords: [{ word: "simmering", meaningFa: "به آرامی غل‌غل کردن و جا افتادن غذا", phonetic: "/ˈsɪmərɪŋ/" }],
    question: {
      promptEn: "What kind of stew did they cook in the cast-iron pot?",
      promptFa: "چه نوع خوراک خوشمزه‌ای را درون قابلمه چدنی پختند؟",
      options: ["Red beans, wild root vegetables, and rosemary dumplings", "Instant noodles with water", "Plain white rice"],
      correctIndex: 0,
      hintSnippet: "red beans, wild root vegetables, and fragrant rosemary dumplings",
      clueFa: "خوراک کوهستانی لوبیا، سبزیجات ریشه‌ای کوهی و لقمه‌های رزماری.",
    },
    choiceA: {
      labelEn: "Savor the warm meal together under the canopy of whispering pines!",
      labelFa: "شام لذیذ را زیر سایه درختان کاج زمزمه‌گر با هم نوش جان کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Write down Samuel's secret stew recipe in your trail journal!",
      labelFa: "دستور پخت ویژه خوراک ساموئل را در دفترچه سفرتان یادداشت کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Tariq read the nineteen-fifties mountaineers' pledge aloud: 'Leave nothing but footprints, take nothing but memories, kill nothing but time.' The timeless words resonated deeply in the crisp evening air.",
    keywords: [{ word: "footprints", meaningFa: "ردپاها روی زمین", phonetic: "/ˈfʊtprɪnts/" }],
    question: {
      promptEn: "What was the timeless pledge inscribed in nineteen-fifty?",
      promptFa: "عهدنامه تاریخی کوهنوردان در سال ۱۹۵۰ چه پندی داشت؟",
      options: [
        "'Leave nothing but footprints, take nothing but memories'",
        "'Hurry fast and conquer the peaks'",
        "'Build big houses everywhere'",
      ],
      correctIndex: 0,
      hintSnippet: "Leave nothing but footprints, take nothing but memories, kill nothing but time",
      clueFa: "تنها ردپا به جا بگذار و تنها خاطره با خودت ببر.",
    },
    choiceA: {
      labelEn: "Recite the pledge together as an unbreakable explorers' promise!",
      labelFa: "عهدنامه را با هم تکرار کنید تا سوگند همیشگی شما به عنوان کاشفان طبیعت باشد!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Carve the quote into a fallen pine log near the trail summit!",
      labelFa: "این جمله زیبا را روی تنه افتاده کاج کنار قله حکاکی کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Tariq placed the miniature brass compass inside the cylinder, sealing it tightly. Someday, another tired young hiker would open it and find the guiding instrument waiting.",
    keywords: [{ word: "guiding", meaningFa: "راهنما و هدایت‌کننده", phonetic: "/ˈɡaɪdɪŋ/" }],
    question: {
      promptEn: "What did Tariq leave inside the brass cylinder for future hikers?",
      promptFa: "طارق چه چیزی را برای کوهنوردان آینده در استوانه برنجی باقی گذاشت؟",
      options: ["A miniature brass compass", "A flashlight with dead batteries", "An empty candy wrapper"],
      correctIndex: 0,
      hintSnippet: "placed the miniature brass compass inside the cylinder",
      clueFa: "قطب‌نمای کوچک برنجی را به عنوان یادگاری قرار داد.",
    },
    choiceA: {
      labelEn: "Raise your hands in triumph atop the Eagle Summit rock!",
      labelFa: "دست‌هایتان را با پیروزی بر فراز صخره قله عقاب بالا ببرید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Take a triumphant silhouette photo of the three friends at sunset!",
      labelFa: "عکس ضد نور (ضدسیلوئت) تماشایی از هر سه نفر در غروب آفتاب بگیرید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Descending through the ocean of purple lupines and mountain bells, the sweet floral fragrance surrounded them. Jasper bounded playfully ahead, his golden coat shining in the evening glow.",
    keywords: [{ word: "lupines", meaningFa: "گل‌های کوهستانی لوپین بنفش", phonetic: "/ˈluːpɪnz/" }],
    question: {
      promptEn: "What surrounded the hikers as they descended through the wildflower meadows?",
      promptFa: "وقتی از میان دشت گل‌های وحشی پایین آمدند چه چیزی آنها را فرا گرفت؟",
      options: ["Sweet floral fragrance", "A heavy smoke cloud", "A swarm of angry bees"],
      correctIndex: 0,
      hintSnippet: "the sweet floral fragrance surrounded them",
      clueFa: "عطر دلنشین و شیرین گل‌های وحشی کوهستان.",
    },
    choiceA: {
      labelEn: "Plunge your hands into the cool water of Emerald Lake at the trail base!",
      labelFa: "در انتهای مسیر دست‌هایتان را در آب خنک و آرام دریاچه زمرد فرو ببرید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Celebrate the completed descent with an energetic victory dance!",
      labelFa: "پایان موفقیت‌آمیز فرود را با رقص پیروزی پرانرژی جشن بگیرید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "They halted at the sunset lookout as the sun ignited the horizon in blazing vermilion, magenta, and gold. The sheer beauty of Emerald Valley brought an awestruck silence over them.",
    keywords: [{ word: "vermilion", meaningFa: "سرخ آتشین و شنگرفی درخشان", phonetic: "/vəˈmɪliən/" }],
    question: {
      promptEn: "What colors ignited the horizon at the sunset lookout?",
      promptFa: "چه رنگ‌هایی افق غروب را بر فراز دره آتشین کرده بودند؟",
      options: ["Blazing vermilion, magenta, and gold", "Only plain gray", "Dark muddy brown"],
      correctIndex: 0,
      hintSnippet: "ignited the horizon in blazing vermilion, magenta, and gold",
      clueFa: "رنگ‌های سرخ شنگرفی، ارغوانی و طلایی درخشان.",
    },
    choiceA: {
      labelEn: "Embrace each other in awe of this unforgettable wilderness victory!",
      labelFa: "یکدیگر را در آغوش بگیرید و این پیروزی بزرگ در دل طبیعت را جشن بگیرید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Vow to explore the wild mountain ranges together for the rest of your lives!",
      labelFa: "عهد ببندید که تا پایان عمر همیشه کاوشگر و دوستدار کوهستان‌های وحشی بمانید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Songbirds of the Dawn", titleFa: "نغمه پرندگان سحرخیز", badgeCategory: "legendary", badgeIcon: "🌲", badgeNameFa: "پایان بهشتی و آرام", climaxEn: "Waking to morning songbirds beneath the ancient cedar, Maya and Tariq understand the soul of the forest.", climaxFa: "با بیدار شدن با نغمه پرندگان زیر سرو هزارساله، مایا و طارق روح زنده طبیعت را حس کردند.", xpReward: 235 },
  { pathCode: "AAAAB", titleEn: "The Dewdrop Tea", titleFa: "چای شبنم ارکیده", badgeCategory: "scholar", badgeIcon: "🍵", badgeNameFa: "پایان شاعرانه و دلنشین", climaxEn: "The sweet orchid dew tea warms their spirits as sunrise gilds the emerald canopy.", climaxFa: "چای شبنم ارکیده جانشان را گرم کرد و پرتوهای زرین خورشید بر شاخسار سروها تابید.", xpReward: 215 },
  { pathCode: "AAABA", titleEn: "The Conservatory Record", titleFa: "ثبت در بایگانی ملی جنگل", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان علمی و ماندگار", climaxEn: "The National Conservatory declares the Grandfather Tree a permanent protected national monument.", climaxFa: "سازمان منابع طبیعی درخت کهنسال را به عنوان اثر ملی ماندگار و محافظت‌شده ثبت کرد.", xpReward: 240 },
  { pathCode: "AAABB", titleEn: "The Botanical Artist", titleFa: "نقاش گیاهان کوهستان", badgeCategory: "explorer", badgeIcon: "🎨", badgeNameFa: "پایان هنری درخشان", climaxEn: "Maya's botanical illustrations win the Grand Gold Ribbon at the National Outdoor Arts Gala.", climaxFa: "نقاشی‌های گیاه‌شناسی مایا روبان طلای جشنواره ملی هنرهای طبیعت را از آن خود کرد.", xpReward: 220 },
  { pathCode: "AABAA", titleEn: "The Rainbow Center", titleFa: "در قلب رنگین‌کمان", badgeCategory: "legendary", badgeIcon: "🌈", badgeNameFa: "پایان اسطوره‌ای و رویایی", climaxEn: "Standing inside the shimmering rainbow spray, their triumphant photograph becomes world famous.", climaxFa: "ایستادن در میان قطرات نورانی رنگین‌کمان عکسی جاودانه در رسانه‌های گردشگری جهان شد.", xpReward: 250 },
  { pathCode: "AABAB", titleEn: "Pebbles of the Turquoise Deep", titleFa: "سنگ‌های فیروزه‌ای تالاب", badgeCategory: "explorer", badgeIcon: "💎", badgeNameFa: "پایان درخشان", climaxEn: "The polished turquoise stones they collected shine on their desks as reminders of pure wonder.", climaxFa: "سنگ‌ریزه‌های صیقلی فیروزه‌ای روی میزهایشان نمادی ابدی از شگفتی‌های طبیعت شدند.", xpReward: 210 },
  { pathCode: "AABBA", titleEn: "The Crystal Cavern Hall", titleFa: "تالار آیینه‌ای بلورها", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان ماجراجویانه برتر", climaxEn: "The lantern illuminates a secret crystal palace behind the falls that had stayed hidden for centuries.", climaxFa: "نور فانوس قصر بلورین پنهان‌شده پشت آبشار را که قرن‌ها مخفی مانده بود آشکار کرد.", xpReward: 245 },
  { pathCode: "AABBB", titleEn: "The Echo Behind the Veil", titleFa: "پژواک آواز در دل آبشار", badgeCategory: "heroic", badgeIcon: "🎶", badgeNameFa: "پایان پرشور و هنری", climaxEn: "Their clear voices harmonize with the falling water, creating an enchanting melody that echoes forever.", climaxFa: "صدای همخوانی آنها با صدای آبشار درآمیخت و زیباترین موسیقی طبیعت را پدید آورد.", xpReward: 225 },
  { pathCode: "ABAAA", titleEn: "Under the Milky Way", titleFa: "خواب زیر کهکشان ستاره‌ها", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان پرستاره و باشکوه", climaxEn: "Sleeping beneath the infinite sea of stars, they dream the timeless dreams of true explorers.", climaxFa: "خوابیدن زیر اقیانوس بی‌کران ستارگان، رویای شیرین کاشفان راستین زمین را محقق ساخت.", xpReward: 240 },
  { pathCode: "ABAAB", titleEn: "The Golden Retriever's Treat", titleFa: "پاداش جسپر قهرمان", badgeCategory: "funny", badgeIcon: "🐕", badgeNameFa: "پایان شیرین و صمیمی", climaxEn: "Jasper happily wags his tail, celebrated as the bravest and most faithful mountain companion.", climaxFa: "جسپر با شادی دمش را تکان داد و به عنوان شجاع‌ترین همراه کوهستان تشویق شد.", xpReward: 195 },
  { pathCode: "ABABA", titleEn: "The Celestial Explorer", titleFa: "رصدگر منظومه مشتری", badgeCategory: "scholar", badgeIcon: "🪐", badgeNameFa: "پایان نجومی", climaxEn: "Their detailed telescope notes earn praise from the Astronomical Union's youth research society.", climaxFa: "یادداشت‌های رصدی آنها مورد تحسین انجمن تحقیقات نجومی جوانان قرار گرفت.", xpReward: 220 },
  { pathCode: "ABABB", titleEn: "The Shooting Star Vow", titleFa: "آرزوی ستاره دنباله‌دار", badgeCategory: "heroic", badgeIcon: "🌠", badgeNameFa: "پایان آرزومندانه", climaxEn: "Their wish on the blazing meteor seals a lifetime promise to protect wild nature everywhere.", climaxFa: "آرزوی آنها زیر نور شهاب‌سنگ، پیمانی ابدی برای پاسداری از طبیعت وحشی شد.", xpReward: 230 },
  { pathCode: "ABBAA", titleEn: "The Jasper Geological Reserve", titleFa: "ذخیره‌گاه زمین‌شناسی جسپر", badgeCategory: "legendary", badgeIcon: "🏞️", badgeNameFa: "پایان تاریخی و افتخارآفرین", climaxEn: "A bronze park plaque names the pristine canyon after Jasper, honoring the dog who smelled the emeralds.", climaxFa: "لوح یادبود پارک ملی، دره را به نام جسپر ثبت کرد تا یاد سگی که زمردها را یافت زنده بماند.", xpReward: 250 },
  { pathCode: "ABBAB", titleEn: "Guardians of the Fault", titleFa: "پاسداران کانی‌های کهن", badgeCategory: "heroic", badgeIcon: "🛡️", badgeNameFa: "پایان زیست‌محیطی", climaxEn: "Park rangers award Maya and Tariq golden badges for stopping illegal mineral prospectors.", climaxFa: "محیط‌بانان مدال طلای افتخار را برای جلوگیری از تخریب معادن به مایا و طارق اهدا کردند.", xpReward: 235 },
  { pathCode: "ABBBA", titleEn: "The Earth Science Scholars", titleFa: "دانشمندان جوان علوم زمین", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان دانشگاهی ممتاز", climaxEn: "Their university presentation on crystal genesis earns standing applause from geology professors.", climaxFa: "کنفرانس دانشگاهی آنها درباره تشکیل بلورها تشویق ایستاده اساتید زمین‌شناسی را به همراه داشت.", xpReward: 245 },
  { pathCode: "ABBBB", titleEn: "The Cover of Explorer", titleFa: "روی جلد نشریه کاوشگران", badgeCategory: "explorer", badgeIcon: "📸", badgeNameFa: "پایان مطبوعاتی پرشکوه", climaxEn: "The macro crystal photo graces the front cover of international outdoor magazines worldwide.", climaxFa: "تصویر ماکروی بلورهای زمرد روی جلد معتبرترین نشریات گردشگری جهان رفت.", xpReward: 225 },
  { pathCode: "BAAAA", titleEn: "The Elixir of the Peaks", titleFa: "اکسیر قله‌های سرسبز", badgeCategory: "legendary", badgeIcon: "💧", badgeNameFa: "پایان گوارا و سلامتی", climaxEn: "The sweet limestone spring water is remembered by the friends as the purest taste on earth.", climaxFa: "آب زلال چشمه کوهستان در خاطره هر دو دوست به عنوان پاک‌ترین طعم زمین ثبت شد.", xpReward: 230 },
  { pathCode: "BAAAB", titleEn: "The Mug of Brotherhood", titleFa: "سلامتی لیوان‌های فلزی", badgeCategory: "scholar", badgeIcon: "☕", badgeNameFa: "پایان رفاقتی و زیبا", climaxEn: "The clinking of metal camp mugs celebrates a bond forged by granite peaks and roaring rivers.", climaxFa: "به هم خوردن لیوان‌های فلزی اردوگاه، پیوند دوستی ساخته‌شده در دل صخره‌ها را جشن گرفت.", xpReward: 205 },
  { pathCode: "BAABA", titleEn: "The Soaring Golden Eagle", titleFa: "پرواز طلایی عقاب کوهستان", badgeCategory: "legendary", badgeIcon: "🦅", badgeNameFa: "پایان حماسی و دیدنی", climaxEn: "The breathtaking photo of the eagle over Mount Serenity wins Wildlife Photograph of the Year.", climaxFa: "عکس پرواز عقاب بر فراز قله کوهستان آرامش جایزه برترین عکس حیات‌وحش سال را برد.", xpReward: 250 },
  { pathCode: "BAABB", titleEn: "Samuel's Cabin Gift", titleFa: "یادگاری کلبه ساموئل", badgeCategory: "scholar", badgeIcon: "🖼️", badgeNameFa: "پایان صمیمانه و روستایی", climaxEn: "Samuel hangs the eagle photograph above his fireplace, proudly showing it to every mountain hiker.", climaxFa: "ساموئل عکس عقاب را بالای شومینه‌اش نصب کرد و با غرور به تمام کوهنوردان نشان داد.", xpReward: 215 },
  { pathCode: "BABAA", titleEn: "Staffs of the High Plateau", titleFa: "عصاهای دست‌ساز فلات", badgeCategory: "explorer", badgeIcon: "🦯", badgeNameFa: "پایان سنتی و اصیل", climaxEn: "Their hand-carved walking staffs support them across mountain ridges for decades of adventure.", climaxFa: "چوب‌دستی‌های دست‌ساز برای دهه‌ها در سفرهای کوهستانی تکیه‌گاه مطمئن آنها باقی ماندند.", xpReward: 230 },
  { pathCode: "BABAB", titleEn: "The Summer Promise", titleFa: "پیمان بازگشت در هر تابستان", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان باوفا و ماندگار", climaxEn: "A warm handshake with Samuel begins a lifelong tradition of returning to the high meadows.", climaxFa: "دست دادن گرم با پیرمرد سرآغاز رسمی برای بازگشت هرساله به این دره شگفت‌انگیز شد.", xpReward: 220 },
  { pathCode: "BABBA", titleEn: "The Feast of Whispering Pines", titleFa: "ضیافت کاج‌های زمزمه‌گر", badgeCategory: "funny", badgeIcon: "🍲", badgeNameFa: "پایان لذیذ و خاطره‌انگیز", climaxEn: "Sharing the aromatic herb stew under the stars, they experience the richest simple joys of life.", climaxFa: "چشیدن خوراک کوهستانی زیر آسمان شب، زیباترین لذت‌های ساده و ناب زندگی را به آنها چشاند.", xpReward: 210 },
  { pathCode: "BABBB", titleEn: "The Secret Trail Recipe", titleFa: "دستور پخت جادویی کوهستان", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آشپزی کوهنوردی", climaxEn: "Samuel's stew recipe becomes a favorite tradition on family camping trips for generations.", climaxFa: "دستور خوراک ساموئل به پای ثابت تمام سفرهای کمپینگ خانوادگی در نسل‌های بعد تبدیل شد.", xpReward: 200 },
  { pathCode: "BBAAA", titleEn: "The Unbreakable Explorers' Oath", titleFa: "سوگند شکست‌ناپذیر کاشفان", badgeCategory: "legendary", badgeIcon: "📜", badgeNameFa: "پایان جوانمردی و تعهد", climaxEn: "Repeating the 1950 pledge, Maya and Tariq commit their lives to defending earth's wilderness.", climaxFa: "با تکرار سوگند سال ۱۹۵۰، مایا و طارق زندگی‌شان را وقف پاسداری از حیات وحش زمین کردند.", xpReward: 250 },
  { pathCode: "BBAAB", titleEn: "The Inscribed Pine Log", titleFa: "یادگار حکاکی‌شده بر تنه کاج", badgeCategory: "heroic", badgeIcon: "🌲", badgeNameFa: "پایان انگیزشی برای همه", climaxEn: "Generations of summit climbers stop to read the carved words and walk more gently upon the earth.", climaxFa: "نسل‌های بعدی کوهنوردان پای تنه کاج ایستادند و یاد گرفتند با احترام بر زمین قدم بگذارند.", xpReward: 225 },
  { pathCode: "BBABA", titleEn: "Hands Raised on Eagle Rock", titleFa: "دست‌ها برافراشته بر صخره عقاب", badgeCategory: "heroic", badgeIcon: "⛰️", badgeNameFa: "پایان حماسی و پرافتخار", climaxEn: "Standing tall on the summit precipice, they let out a triumphant cheer that echoes across valleys.", climaxFa: "بر فراز قله عقاب، فریاد شادمانی سر دادند که پژواک آن در دل تمام دره‌ها پیچید.", xpReward: 235 },
  { pathCode: "BBABB", titleEn: "The Sunset Silhouette", titleFa: "سیلوئت طلایی سه دوست", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان شاعرانه و ماندگار", climaxEn: "The breathtaking silhouette photo of two hikers and their dog at sunset captures the spirit of youth.", climaxFa: "عکس ضد نور دو کوهنورد و سگ وفادارشان در غروب آفتاب نماد جاودانه شور جوانی شد.", xpReward: 245 },
  { pathCode: "BBBAA", titleEn: "The Touch of Emerald Lake", titleFa: "آرامش در دریاچه زمرد", badgeCategory: "explorer", badgeIcon: "🏊", badgeNameFa: "پایان باطراوت", climaxEn: "Dipping their hands into the cool water of Emerald Lake, all fatigue melts away into pure joy.", climaxFa: "با لمس آب زلال دریاچه زمرد، تمام خستگی سفر به آرامشی بهشتی و عمیق بدل شد.", xpReward: 230 },
  { pathCode: "BBBAB", titleEn: "The Victory Dance of the Valley", titleFa: "رقص پیروزی در دشت گل‌ها", badgeCategory: "funny", badgeIcon: "💃", badgeNameFa: "پایان شاد و پرخنده", climaxEn: "Their spontaneous victory dance in the wildflower meadow has Jasper barking with happy delight.", climaxFa: "رقص شادمانه در میان گل‌های وحشی با پارس‌های شاد و پرشور جسپر همراه شد.", xpReward: 210 },
  { pathCode: "BBBBA", titleEn: "The Triumphant Embrace", titleFa: "آغوش پیروزی در دل طبیعت", badgeCategory: "heroic", badgeIcon: "🤗", badgeNameFa: "پایان احساسی و پرغرور", climaxEn: "Hugging tightly as the last sunlight gilds the canyon peaks, they know they have conquered the wild.", climaxFa: "با در آغوش کشیدن یکدیگر زیر نور واپسین پرتوهای خورشید، پیروزی بر سختی‌ها را جشن گرفتند.", xpReward: 240 },
  { pathCode: "BBBBB", titleEn: "The Lifelong Trail Companions", titleFa: "همسفران همیشگی جاده‌ها", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان اسطوره‌ای و ابدی", climaxEn: "Watching the horizon turn to molten gold, they vow to explore the wilderness together forever.", climaxFa: "با تماشای طلای مذاب افق، عهد بستند که تا ابد همسفر شجاع ماجراجویی‌های زمین باقی بمانند.", xpReward: 250 },
];

export const story3EmeraldValley: AdventureStory = buildAdventureStory({
  id: "b1-emerald-valley-trek",
  storyIndex: 3,
  cefr: "B1",
  titleEn: "The Trek to Emerald Valley",
  titleFa: "سفر هیجان‌انگیز به دره زمرد",
  genre: "travel",
  genreLabelFa: "🏕️ سفر و ماجراجویی",
  genreIcon: "🏕️",
  synopsisEn:
    "Maya and Tariq embark on a 3-day trek to find the legendary Emerald Waterfall, crossing suspension bridges and camping under mountain stars. Navigate 32 adventurous endings!",
  synopsisFa:
    "مایا و طارق به همراه سگ باوفاشون جسپر، کوله‌پشتی‌هاشون رو برای سفری سه‌روزه به دره زمرد و آبشار مخفی کوهستان می‌بندن. از پل‌های معلق چوبی رد می‌شن، در دشت‌های ارکیده کوهی کمپ می‌زنن و زیر آسمون پر از ستاره کهکشان راه شیری رازهای طبیعت رو کشف می‌کنن! ۳۲ پایان ماجراجویانه در انتظارته!",
  coverImage: "/images/skills/reading/b1-emerald-valley.webp",
  nodes,
  endings,
});
