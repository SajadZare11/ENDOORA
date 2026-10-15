import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2 (A2): The Mystery of the Whispering Treehouse (راز خانه درختی نجواگر)
// Genre: Mystery & Curiosity (معمایی و کنجکاوی)
// CEFR: A2 (Past tenses, descriptive clues, prepositions, connectors)
// Characters: Liam, Chloe, Mr. Miller, Mrs. Davis
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "On a windy autumn afternoon, Liam and his sister Chloe climbed up the wooden ladder to their backyard treehouse. The wind was whispering through the yellow oak leaves. While Chloe was sweeping the floor, her broom hit a loose wooden plank. Click! Under the floorboard, Liam saw a dusty carved box with a brass lock shaped like a sleeping owl. A silver note said: 'Only curious minds find the hidden path.'",
    keywords: [
      { word: "treehouse", meaningFa: "خانه درختی", phonetic: "/ˈtriːhaʊs/" },
      { word: "broom", meaningFa: "جاروی دستی", phonetic: "/bruːm/" },
      { word: "plank", meaningFa: "تخته چوبی کف اتاق", phonetic: "/plæŋk/" },
      { word: "owl", meaningFa: "جغد دانا", phonetic: "/aʊl/" },
    ],
    question: {
      promptEn: "What shape was the brass lock on the carved box?",
      promptFa: "قفل برنجی روی جعبه به چه شکلی بود؟",
      options: ["A sleeping owl", "A running lion", "A swimming fish"],
      correctIndex: 0,
      hintSnippet: "a brass lock shaped like a sleeping owl",
      clueFa: "خط ششم رو نگاه کن دوست من! قفل شبیه یک جغد خوابیده بود.",
    },
    choiceA: {
      labelEn: "Turn the owl's wing to unlock the secret box!",
      labelFa: "بال جغد رو بچرخون تا قفل جعبه رمزآلود باز بشه!",
      descriptionFa: "شاید یک کلید چرخشی مخفی زیر بال پرنده باشه.",
    },
    choiceB: {
      labelEn: "Search the treehouse hollow for a hidden brass key!",
      labelFa: "توی حفره تنه درخت دنبال کلید برنجی بگرد!",
      descriptionFa: "سنجاب‌ها یا صاحب قبلی شاید کلید رو اونجا گذاشته باشن.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Liam gently turned the owl's brass wing to the right. Click-clack! The wooden lid popped open with a puff of cedar scent. Inside rested an antique pocket compass with a glowing green needle, a small brass magnifying glass, and an old riddle written in blue ink: 'Where paper sleeps and clocks stand still, seek the third shelf near the green hill.'",
    keywords: [
      { word: "cedar", meaningFa: "چوب سدر خوشبو", phonetic: "/ˈsiːdər/" },
      { word: "compass", meaningFa: "قطب‌نما", phonetic: "/ˈkʌmpəs/" },
      { word: "magnifying glass", meaningFa: "ذره‌بین کارآگاهی", phonetic: "/ˈmæɡnɪfaɪɪŋ ɡlɑːs/" },
      { word: "riddle", meaningFa: "شعر معماگونه", phonetic: "/ˈrɪdl/" },
    ],
    question: {
      promptEn: "What color was the compass needle?",
      promptFa: "عقربه قطب‌نما چه رنگی بود؟",
      options: ["Glowing green", "Bright red", "Dark purple"],
      correctIndex: 0,
      hintSnippet: "with a glowing green needle",
      clueFa: "خط سوم رو ببین! عقربه سبز شب‌تاب داشت.",
    },
    choiceA: {
      labelEn: "Take the compass to the town library on Green Hill!",
      labelFa: "با قطب‌نما به کتابخانه قدیمی روی تپه سبز برید!",
      descriptionFa: "جایی که 'کاغذها می‌خوابند' قطعاً کتابخانه است.",
    },
    choiceB: {
      labelEn: "Examine the riddle poem under Chloe's magnifying glass!",
      labelFa: "شعر معما رو زیر ذره‌بین کلویی با دقت بررسی کنید!",
      descriptionFa: "شاید حروف ریزی بین کلمات پنهان شده باشه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Chloe reached deep into the knotty oak hollow with her flashlight. Her fingers touched something cold and metallic. She pulled out a small brass key tied with a faded red ribbon! Liam clapped his hands. 'Chloe, you are a master detective!' he shouted. The little key fit into the owl lock perfectly.",
    keywords: [
      { word: "flashlight", meaningFa: "چراغ‌قوه", phonetic: "/ˈflæʃlaɪt/" },
      { word: "metallic", meaningFa: "فلزی و خنک", phonetic: "/məˈtælɪk/" },
      { word: "ribbon", meaningFa: "روبان پارچه‌ای", phonetic: "/ˈrɪbən/" },
    ],
    question: {
      promptEn: "What color was the ribbon on the key?",
      promptFa: "روبان بسته شده به کلید چه رنگی بود؟",
      options: ["Faded red", "Bright yellow", "Deep black"],
      correctIndex: 0,
      hintSnippet: "tied with a faded red ribbon",
      clueFa: "خط سوم رو بخون! با یک روبان قرمز کمرنگ بسته شده بود.",
    },
    choiceA: {
      labelEn: "Open the box and look at the folded map inside!",
      labelFa: "جعبه رو باز کن و به نقشه تاشده نگاه بنداز!",
      descriptionFa: "نقشه خیابان‌های قدیمی شهر رو با جوهر قرمز نشون می‌ده.",
    },
    choiceB: {
      labelEn: "Check the tree trunk for carved arrow symbols!",
      labelFa: "تنه درخت رو برای پیدا کردن علامت‌های پیکان چک کن!",
      descriptionFa: "شاید روی پوست درخت جهت‌های مخفی حک شده باشه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Liam and Chloe rode their bicycles to the Old Town Library on Green Hill. Kind Mr. Miller, the chief librarian with round silver spectacles, welcomed them with a warm smile. 'We have books from two hundred years ago,' Mr. Miller whispered. He led the kids to the historic archives room where ancient leather books smelled like sweet tea.",
    keywords: [
      { word: "spectacles", meaningFa: "عینک گرد مطالعه", phonetic: "/ˈspektəklz/" },
      { word: "librarian", meaningFa: "کتابدار مهربان", phonetic: "/laɪˈbreəriən/" },
      { word: "archives", meaningFa: "بخش اسناد و کتاب‌های کهن", phonetic: "/ˈɑːkaɪvz/" },
    ],
    question: {
      promptEn: "What did the ancient leather books smell like?",
      promptFa: "کتاب‌های چرمی کهن چه بویی می‌دادند؟",
      options: ["Sweet tea", "Cold pepper", "Old onions"],
      correctIndex: 0,
      hintSnippet: "ancient leather books smelled like sweet tea",
      clueFa: "خط آخر رو نگاه کن! بوی چای شیرین و مطبوع می‌دادند.",
    },
    choiceA: {
      labelEn: "Search shelf number three for the book with an owl bookmark!",
      labelFa: "قفسه شماره سه رو برای پیدا کردن کتاب با علامت جغد بگرد!",
      descriptionFa: "معما اشاره کرده بود به قفسه سوم نزدیک تپه سبز.",
    },
    choiceB: {
      labelEn: "Ask Mr. Miller about the history of the old oak tree!",
      labelFa: "از آقای میلر درباره تاریخچه درخت بلوط کهنسال بپرس!",
      descriptionFa: "کتابدار تاریخ تمام درخت‌ها و خانه‌های قدیمی رو می‌دونه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Under the magnifying glass, Chloe spotted microscopic numbers drawn inside the owl's eye: '1-9-2-4'. Below the numbers was a sketch of the town clock tower. '1924 was one hundred years ago!' Liam realized. 'Someone hid a time capsule behind the clock tower bricks exactly a century ago!'",
    keywords: [
      { word: "microscopic", meaningFa: "بسیار ریز و میکروسکوپی", phonetic: "/ˌmaɪkrəˈskɒpɪk/" },
      { word: "century", meaningFa: "یک قرن / صد سال", phonetic: "/ˈsentʃəri/" },
      { word: "time capsule", meaningFa: "کپسول زمان یادگاری", phonetic: "/ˈtaɪm kæpsjuːl/" },
    ],
    question: {
      promptEn: "What numbers were hidden inside the owl's eye?",
      promptFa: "چه اعدادی داخل چشم جغد پنهان شده بود؟",
      options: ["1-9-2-4", "2-0-2-6", "1-0-0-0"],
      correctIndex: 0,
      hintSnippet: "microscopic numbers drawn inside the owl's eye: '1-9-2-4'",
      clueFa: "خط اول رو ببین! عدد سال ۱۹۲۴ بود.",
    },
    choiceA: {
      labelEn: "Run to the town clock tower in the central square!",
      labelFa: "به سمت برج ساعت شهر در میدان مرکزی بدوید!",
      descriptionFa: "ساعت تاریخی شهر رازهای صد ساله داره.",
    },
    choiceB: {
      labelEn: "Show the numbers to Mrs. Davis at the town museum!",
      labelFa: "عددها رو به خانم دیویس در موزه شهر نشان بدید!",
      descriptionFa: "خانم دیویس مسئول اشیای تاریخی صد سال پیش است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The yellowed map showed their garden, the neighborhood river, and a secret garden pathway lined with stone statues. Chloe noticed an X marked beside the Whispering Willow pond. 'The map shows where the school founder hid his student diary in 1924!' Chloe whispered with excitement.",
    keywords: [
      { word: "yellowed", meaningFa: "زردرنگ و قدیمی", phonetic: "/ˈjeləʊd/" },
      { word: "statues", meaningFa: "مجسمه‌های سنگی", phonetic: "/ˈstætʃuːz/" },
      { word: "founder", meaningFa: "بنیان‌گذار مدرسه", phonetic: "/ˈfaʊndər/" },
    ],
    question: {
      promptEn: "Where was the X marked on the yellowed map?",
      promptFa: "علامت ضربدر کجا روی نقشه زده شده بود؟",
      options: ["Beside the Whispering Willow pond", "Inside a bakery", "On the airport runway"],
      correctIndex: 0,
      hintSnippet: "beside the Whispering Willow pond",
      clueFa: "خط دوم رو بخون! کنار برکه بید نجواگر بود.",
    },
    choiceA: {
      labelEn: "Follow the stone statues toward the willow pond!",
      labelFa: "مسیر مجسمه‌های سنگی رو به سمت برکه دنبال کنید!",
      descriptionFa: "درختان بید مجنون کنار آب سایه انداخته‌اند.",
    },
    choiceB: {
      labelEn: "Copy the map carefully into your detective notebook!",
      labelFa: "نقشه رو توی دفترچه کارآگاهی‌تون بازنویسی کنید!",
      descriptionFa: "داشتن یک کپی تمیز برای تحقیقات بعدی لازمه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "On the rough tree bark, Liam discovered three small carved arrows pointing toward the garden greenhouse. Following the arrows, Liam and Chloe stepped along the mossy stone steps. Between two terracotta flower pots, they saw a miniature wooden door set into the garden wall.",
    keywords: [
      { word: "bark", meaningFa: "پوست درخت", phonetic: "/bɑːk/" },
      { word: "mossy", meaningFa: "پوشیده از خزه سبز", phonetic: "/ˈmɒsi/" },
      { word: "terracotta", meaningFa: "سفالی و آجری‌رنگ", phonetic: "/ˌterəˈkɒtə/" },
    ],
    question: {
      promptEn: "What was set into the garden wall between flower pots?",
      promptFa: "بین گلدان‌های سفالی چی توی دیوار کار گذاشته شده بود؟",
      options: ["A miniature wooden door", "A broken window", "An iron pipe"],
      correctIndex: 0,
      hintSnippet: "a miniature wooden door set into the garden wall",
      clueFa: "خط آخر رو نگاه کن! یک درِ کوچک چوبی مینیاتوری بود.",
    },
    choiceA: {
      labelEn: "Use the small brass key to unlock the miniature door!",
      labelFa: "با کلید برنجی کوچک در مینیاتوری رو باز کن!",
      descriptionFa: "پشت این در کوچک شاید گنجینه‌ای پنهان باشه.",
    },
    choiceB: {
      labelEn: "Peek through the tiny round keyhole with your flashlight!",
      labelFa: "با چراغ‌قوه از سوراخ کلید داخل رو نگاه بنداز!",
      descriptionFa: "نور انداختن قبل از باز کردن کار یک کارآگاه باهوشه.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Liam pulled out a heavy velvet-bound encyclopedia on shelf three. Inside a hollowed-out section of the book sat a shiny silver medallion! The medallion was engraved with an open book and seven stars. A note inside said: 'Knowledge is the true treasure.'",
    keywords: [
      { word: "encyclopedia", meaningFa: "دایرةالمعارف بزرگ", phonetic: "/ɪnˌsaɪkləˈpiːdiə/" },
      { word: "medallion", meaningFa: "مدال یادبود بزرگ نقره‌ای", phonetic: "/məˈdæliən/" },
      { word: "engraved", meaningFa: "حکاکی‌شده با ظرافت", phonetic: "/ɪnˈɡreɪvd/" },
    ],
    question: {
      promptEn: "What was engraved on the silver medallion?",
      promptFa: "روی مدال نقره‌ای چه نقشی حک شده بود؟",
      options: ["An open book and seven stars", "A sword and shield", "A horse and carriage"],
      correctIndex: 0,
      hintSnippet: "engraved with an open book and seven stars",
      clueFa: "خط دوم رو ببین! کتاب باز و هفت ستاره حک شده بود.",
    },
    choiceA: {
      labelEn: "Present the historical medallion to Mr. Miller for the library display!",
      labelFa: "مدال تاریخی رو برای نمایشگاه کتابخانه به آقای میلر بدید!",
      descriptionFa: "تمام بچه‌های شهر می‌تونن این افتخار رو ببینن.",
    },
    choiceB: {
      labelEn: "Wear the medallion proudly during your school science presentation!",
      labelFa: "مدال رو موقع کنفرانس علمی مدرسه به گردن بنداز!",
      descriptionFa: "نماد دانایی و کارآگاهی بهت اعتمادبه‌نفس می‌ده.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Mr. Miller opened a vintage photo album showing the oak tree in 1924. A group of school children in vintage school uniforms were smiling beneath its branches. 'That young boy on the left was my grandfather,' Mr. Miller said with tears of wonder. 'He built the first treehouse!'",
    keywords: [
      { word: "uniforms", meaningFa: "لباس‌های فرم قدیمی مدرسه", phonetic: "/ˈjuːnɪfɔːmz/" },
      { word: "branches", meaningFa: "شاخه های پربرگ", phonetic: "/ˈbrɑːntʃɪz/" },
      { word: "wonder", meaningFa: "شگفتی و حس دل‌انگیز", phonetic: "/ˈwʌndər/" },
    ],
    question: {
      promptEn: "Who was the young boy on the left in the 1924 photograph?",
      promptFa: "پسر سمت چپ در عکس سال ۱۹۲۴ چه کسی بود؟",
      options: ["Mr. Miller's grandfather", "The city mayor", "A famous astronaut"],
      correctIndex: 0,
      hintSnippet: "That young boy on the left was my grandfather",
      clueFa: "خط دوم رو بخون! پدربزرگ خود آقای میلر بود.",
    },
    choiceA: {
      labelEn: "Invite Mr. Miller to visit the treehouse this afternoon!",
      labelFa: "آقای میلر رو بعدازظهر به خانه درختی دعوت کنید!",
      descriptionFa: "دیدن یادگاری پدربزرگش او را خیلی شاد می‌کنه.",
    },
    choiceB: {
      labelEn: "Frame the 1924 photograph to hang in the treehouse!",
      labelFa: "عکس سال ۱۹۲۴ رو قاب بگیرید و در خانه درختی نصب کنید!",
      descriptionFa: "خانه درختی شناسنامه تاریخی پیدا می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Liam and Chloe climbed the spiral stone staircase of the town clock tower. Behind a loose brick near the copper bells, they felt a sturdy metal tin. Inside were shiny 1924 silver coins, a fountain pen, and a letter written by children who wished future students a world full of peace and friendship.",
    keywords: [
      { word: "spiral", meaningFa: "مارپیچ و پله‌پله", phonetic: "/ˈspaɪrəl/" },
      { word: "fountain pen", meaningFa: "خودنویس قدیمی", phonetic: "/ˈfaʊntɪn pen/" },
      { word: "peace", meaningFa: "صلح و آرامش", phonetic: "/piːs/" },
    ],
    question: {
      promptEn: "What was inside the metal tin in the clock tower?",
      promptFa: "داخل قوطی فلزی توی برج ساعت چی بود؟",
      options: ["Silver coins, a pen, and a letter", "Old boots and ropes", "Dried leaves and dirt"],
      correctIndex: 0,
      hintSnippet: "shiny 1924 silver coins, a fountain pen, and a letter",
      clueFa: "خط دوم رو نگاه کن! سکه‌های نقره، خودنویس و یک نامه بود.",
    },
    choiceA: {
      labelEn: "Ring the clock tower bell to announce the centennial discovery!",
      labelFa: "زنگ برج ساعت رو برای اعلام این کشف صد ساله به صدا درآورید!",
      descriptionFa: "صدای ناقوس در تمام دره و شهر می‌پیچه.",
    },
    choiceB: {
      labelEn: "Add your own letter to the tin capsule for the year 2124!",
      labelFa: "نامه خودتون رو برای سال ۲۱۲۴ به این کپسول اضافه کنید!",
      descriptionFa: "بچه‌های صد سال بعد پیام شما رو می‌خونن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Mrs. Davis at the town museum adjusted her magnifying visor. 'Splendid research!' she declared. 'We have been searching for the lost 1924 student archives for twenty years.' She awarded Liam and Chloe honorary Junior Archivist gold badges.",
    keywords: [
      { word: "visor", meaningFa: "کلاهک ذره‌بینی تخصصی", phonetic: "/ˈvaɪzər/" },
      { word: "splendid", meaningFa: "عالی و تحسین‌برانگیز", phonetic: "/ˈsplendɪd/" },
      { word: "archivist", meaningFa: "سندپژوه و تاریخ‌نگار", phonetic: "/ˈɑːkɪvɪst/" },
    ],
    question: {
      promptEn: "What badges did Mrs. Davis award the kids?",
      promptFa: "خانم دیویس چه نشانی به بچه‌ها هدیه داد؟",
      options: ["Junior Archivist gold badges", "Swimming badges", "Traffic police badges"],
      correctIndex: 0,
      hintSnippet: "honorary Junior Archivist gold badges",
      clueFa: "خط آخر رو بخون! نشان طلای سندپژوه نوجوان رو بهشون داد.",
    },
    choiceA: {
      labelEn: "Open a temporary 'Treehouse Mystery' exhibit in the museum!",
      labelFa: "یک نمایشگاه موقت 'راز خانه درختی' در موزه برپا کنید!",
      descriptionFa: "مردم برای دیدن کشف کارآگاهی شما صف می‌کشن.",
    },
    choiceB: {
      labelEn: "Help Mrs. Davis decode other historical letters from 1924!",
      labelFa: "به خانم دیویس در رمزگشایی بقیه نامه‌های قدیمی کمک کنید!",
      descriptionFa: "کشف تاریخ ادامه دارد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Beside the Whispering Willow pond, under the shade of sweeping branches, Liam found a smooth granite stone with a carved compass rose. Chloe reached into a stone hollow beneath it and extracted a sealed glass bottle containing dried flower seeds and a poetry scroll.",
    keywords: [
      { word: "granite", meaningFa: "سنگ خارا / گرانیت محکم", phonetic: "/ˈɡrænɪt/" },
      { word: "extracted", meaningFa: "بیرون کشید و برداشت", phonetic: "/ɪkˈstræktɪd/" },
      { word: "scroll", meaningFa: "طومار کاغذی لوله‌شده", phonetic: "/skrəʊl/" },
    ],
    question: {
      promptEn: "What was inside the sealed glass bottle?",
      promptFa: "داخل بطری شیشه‌ای پلمپ‌شده چی بود؟",
      options: ["Dried flower seeds and a poetry scroll", "Sweet honey", "Clear ocean water"],
      correctIndex: 0,
      hintSnippet: "containing dried flower seeds and a poetry scroll",
      clueFa: "خط سوم رو ببین! دانه‌های گل و طومار شعر بود.",
    },
    choiceA: {
      labelEn: "Plant the century-old flower seeds near the treehouse!",
      labelFa: "دانه‌های گل صد ساله رو کنار خانه درختی بکارید!",
      descriptionFa: "گل‌های تاریخی بعد از یک قرن دوباره شکوفا می‌شن.",
    },
    choiceB: {
      labelEn: "Read the ancient nature poem aloud at the school assembly!",
      labelFa: "شعر زیبای طبیعت رو در صف صبحگاه مدرسه بخونید!",
      descriptionFa: "تمام مدرسه به شعر صد ساله گوش می‌دن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Liam and Chloe carefully drew every statue, tree, and pond feature into their leather detective notebook. Chloe labeled each landmark with neat English captions: 'The Whispering Willow', 'The Granite Owl', and 'The Secret Bridge'.",
    keywords: [
      { word: "captions", meaningFa: "توضیحات و زیرنویس‌های نوشته‌شده", phonetic: "/ˈkæpʃnz/" },
      { word: "landmark", meaningFa: "نشانه‌ها و اماکن برجسته", phonetic: "/ˈlændmɑːk/" },
      { word: "feature", meaningFa: "ویژگی‌های جغرافیایی", phonetic: "/ˈfiːtʃər/" },
    ],
    question: {
      promptEn: "What did Chloe label each landmark with?",
      promptFa: "کلویی کنار هر نشانه روی نقشه چی نوشت؟",
      options: ["Neat English captions", "Funny cartoons", "Math numbers"],
      correctIndex: 0,
      hintSnippet: "with neat English captions",
      clueFa: "خط دوم رو بخون! با زیرنویس‌های مرتب انگلیسی نام‌گذاری کرد.",
    },
    choiceA: {
      labelEn: "Publish a treasure hunt guidebook for neighborhood children!",
      labelFa: "یک کتابچه راهنمای شکار گنج برای بچه‌های محله چاپ کنید!",
      descriptionFa: "بچه‌های محله هم می‌تونن این ماجرا رو کشف کنن.",
    },
    choiceB: {
      labelEn: "Create an interactive treasure map website with English vocabulary!",
      labelFa: "یک سایت اینترنتی نقشه گنج با کلمات انگلیسی بسازید!",
      descriptionFa: "یک بازی اینترنتی هیجان‌انگیز برای همه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "The miniature wooden door clicked open. Behind it lay a tiny stone chamber lit by a shaft of green sunlight. Sitting on a miniature velvet pillow was a beautifully carved brass whistle shaped like a songbird. When Liam blew gently, it produced a musical warble that attracted three real bluebirds.",
    keywords: [
      { word: "chamber", meaningFa: "اتاقک کوچک مخفی", phonetic: "/ˈtʃeɪmbər/" },
      { word: "warble", meaningFa: "آواز چهچهه‌مانند پرنده", phonetic: "/ˈwɔːbl/" },
      { word: "bluebirds", meaningFa: "پرندگان نغمه‌خوان آبی‌رنگ", phonetic: "/ˈbluːbɜːdz/" },
    ],
    question: {
      promptEn: "What birds gathered when Liam blew the whistle?",
      promptFa: "وقتی لیام در سوت دمید چه پرندگانی دورشان جمع شدند؟",
      options: ["Three real bluebirds", "Two big eagles", "A noisy duck"],
      correctIndex: 0,
      hintSnippet: "attracted three real bluebirds",
      clueFa: "خط آخر رو ببین! سه پرنده آبی خوش‌آواز اومدن.",
    },
    choiceA: {
      labelEn: "Learn bird songs and become the garden's youth bird keeper!",
      labelFa: "آواز پرنده‌ها رو یاد بگیر و نگهبان پرندگان باغ شو!",
      descriptionFa: "با پرندگان دوست می‌شی و براشون دانه می‌ذاری.",
    },
    choiceB: {
      labelEn: "Keep the brass bird whistle safely in your detective kit!",
      labelFa: "سوت پرنده برنجی رو در جعبه کارآگاهی‌ات نگه دار!",
      descriptionFa: "یک وسیله جادویی برای ماجراجویی‌های بعدی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Peeking through the keyhole with the beam of the flashlight, Chloe saw a tiny crystal prism refracting a rainbow across the hidden cavity. 'It is an optical puzzle!' Chloe whispered. 'When the afternoon sun hits this hole, a rainbow points to the hidden compartment.'",
    keywords: [
      { word: "prism", meaningFa: "منشور شیشه‌ای بلورین", phonetic: "/ˈprɪzəm/" },
      { word: "refracting", meaningFa: "شکستن نور و تجزیه به رنگین‌کمان", phonetic: "/rɪˈfræktɪŋ/" },
      { word: "compartment", meaningFa: "محفظه مخفی درون دیوار", phonetic: "/kəmˈpɑːtmənt/" },
    ],
    question: {
      promptEn: "What did the crystal prism create?",
      promptFa: "منشور بلورین چه چیزی تولید می‌کرد؟",
      options: ["A rainbow across the cavity", "Loud smoke", "Cold water"],
      correctIndex: 0,
      hintSnippet: "refracting a rainbow across the hidden cavity",
      clueFa: "خط اول رو بخون! یک رنگین‌کمان زیبا ساخت.",
    },
    choiceA: {
      labelEn: "Follow the rainbow beam to find the secret wall safe!",
      labelFa: "مسیر پرتو رنگین‌کمان رو تا گاوصندوق مخفی دیوار دنبال کن!",
      descriptionFa: "جایی که نور فرود میاد کلید نهایی پنهان شده.",
    },
    choiceB: {
      labelEn: "Draw the optical prism diagram in your science project!",
      labelFa: "شکل شکست نور منشور رو برای پروژه علوم نقاشی کن!",
      descriptionFa: "استاد علوم نمره بیست به تحقیقت می‌ده.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The silver medallion now shines under glass in the central library lobby. Below it, a brass plaque reads: 'Discovered by Young Detectives Liam and Chloe.' Library visitors stop daily to read the inspiring story.",
    keywords: [{ word: "lobby", meaningFa: "سالن ورودی بزرگ کتابخانه", phonetic: "/ˈlɒbi/" }],
    question: {
      promptEn: "Whose names are on the brass plaque?",
      promptFa: "اسم چه کسانی روی پلاک برنجی نوشته شده؟",
      options: ["Liam and Chloe", "Captain Dan", "Mr. Watson"],
      correctIndex: 0,
      hintSnippet: "Discovered by Young Detectives Liam and Chloe",
      clueFa: "اسم لیام و کلویی نوشته شده.",
    },
    choiceA: {
      labelEn: "Lead a weekly youth mystery club in the library!",
      labelFa: "باشگاه هفتگی کارآگاهان نوجوان رو در کتابخانه اداره کن!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Donate detective novels to the children's reading room!",
      labelFa: "کتاب‌های رمان معمایی به بخش کودکان هدیه بده!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "During the school assembly, Liam wore the medallion and presented his findings. The principal announced a school-wide detective award and congratulated Liam on inspiring all students to read and investigate.",
    keywords: [{ word: "findings", meaningFa: "دستاوردهای پژوهشی و کشفیات", phonetic: "/ˈfaɪndɪŋz/" }],
    question: {
      promptEn: "What did the school principal announce?",
      promptFa: "مدیر مدرسه چه چیزی رو اعلام کرد؟",
      options: ["A school-wide detective award", "School cancellation", "A math test"],
      correctIndex: 0,
      hintSnippet: "announced a school-wide detective award",
      clueFa: "جایزه سالانه کارآگاهی مدرسه رو اعلام کرد.",
    },
    choiceA: {
      labelEn: "Design the official silver medal for future student winners!",
      labelFa: "مدال رسمی نقره‌ای رو برای برندگان سال‌های آینده طراحی کن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Write an inspiring article for the regional youth newspaper!",
      labelFa: "یک مقاله پرانگیزه برای روزنامه نوجوانان منطقه بنویس!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Mr. Miller climbed the treehouse ladder carrying tea and honey cakes. Looking at the carvings and the peaceful garden, he smiled with tears in his eyes: 'My grandfather would be so proud to see you keeping the magic alive.'",
    keywords: [{ word: "alive", meaningFa: "زنده و پویا", phonetic: "/əˈlaɪv/" }],
    question: {
      promptEn: "What did Mr. Miller bring to the treehouse?",
      promptFa: "آقای میلر چی برای پذیرایی به خانه درختی آورد؟",
      options: ["Tea and honey cakes", "Sandwiches", "Cold water"],
      correctIndex: 0,
      hintSnippet: "carrying tea and honey cakes",
      clueFa: "چای و کیک‌های عسلی آورد.",
    },
    choiceA: {
      labelEn: "Carve Mr. Miller's family initials onto the oak post!",
      labelFa: "حروف اسم خانواده آقای میلر رو روی تنه چوبی حک کن!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Record Mr. Miller's childhood tales in an audio archive!",
      labelFa: "قصه‌های کودکی آقای میلر رو در یک فایل صوتی ضبط کن!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The vintage 1924 photograph hangs inside a wooden frame next to the treehouse window. Every time sunlight streams in, the smiling faces of historical school children seem to greet Liam and Chloe.",
    keywords: [{ word: "streams", meaningFa: "می‌تابد و روان می‌شود", phonetic: "/striːmz/" }],
    question: {
      promptEn: "Where does the 1924 framed photo hang?",
      promptFa: "عکس قاب‌شده سال ۱۹۲۴ کجا نصب شد؟",
      options: ["Next to the treehouse window", "Under the bed", "On a car door"],
      correctIndex: 0,
      hintSnippet: "next to the treehouse window",
      clueFa: "کنار پنجره خانه درختی نصب شد.",
    },
    choiceA: {
      labelEn: "Host a sunset history evening with hot cocoa for friends!",
      labelFa: "یک عصرانه تاریخی با هات‌چاکلت برای دوستانت برگزار کن!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Create a miniature replica of the 1924 schoolhouse!",
      labelFa: "یک ماکت مینیاتوری از مدرسه صد سال پیش بساز!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Liam and Chloe pulled the brass rope, and the clock tower chime boomed across the town: Bong! Bong! Citizens gathered in the square below, applauding the rediscovery of their town's lost historical treasure.",
    keywords: [{ word: "boomed", meaningFa: "طنین انداخت با صدای بلند", phonetic: "/buːmd/" }],
    question: {
      promptEn: "What did the citizens in the square do?",
      promptFa: "مردم در میدان شهر چه کار کردند؟",
      options: ["Applauded the rediscovery", "Ran away scared", "Complained loudly"],
      correctIndex: 0,
      hintSnippet: "applauding the rediscovery of their town's lost historical treasure",
      clueFa: "کشف تاریخی رو تشویق کردند.",
    },
    choiceA: {
      labelEn: "Become the honorary bell keepers of the town clock tower!",
      labelFa: "نگهبانان افتخاری زنگ برج ساعت شهر بشوید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Organize an annual Centennial Festival every October!",
      labelFa: "یک جشنواره سالانه صد ساله هر مهرماه برگزار کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Liam and Chloe sealed their own letter inside the tin box, describing their treehouse, school, and dreams for the future. The town council resealed the capsule into the brickwork, to be opened in October 2124.",
    keywords: [{ word: "council", meaningFa: "شورای شهر", phonetic: "/ˈkaʊnsl/" }],
    question: {
      promptEn: "When will the resealed time capsule be opened?",
      promptFa: "کپسول زمان دوباره کی باز خواهد شد؟",
      options: ["In October 2124", "Tomorrow morning", "In year 3000"],
      correctIndex: 0,
      hintSnippet: "to be opened in October 2124",
      clueFa: "در سال ۲۱۲۴ باز خواهد شد.",
    },
    choiceA: {
      labelEn: "Carve your names on the historic clock tower donor stone!",
      labelFa: "اسم‌هاتون رو روی سنگ یادبود برج ساعت ثبت کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Promise to meet your future descendants in spirit!",
      labelFa: "پیامی برای نوادگان آینده به یادگار بذارید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Over four hundred visitors toured the 'Treehouse Mystery' exhibition on opening weekend. Liam and Chloe gave guided tours, explaining how English reading clues helped them solve the hundred-year-old puzzle.",
    keywords: [{ word: "toured", meaningFa: "بازدید کردند و گشت زدند", phonetic: "/tʊəd/" }],
    question: {
      promptEn: "How many visitors toured the exhibit on opening weekend?",
      promptFa: "چند بازدیدکننده در آخر هفته اول آمدند؟",
      options: ["Over four hundred visitors", "Only ten people", "Zero visitors"],
      correctIndex: 0,
      hintSnippet: "Over four hundred visitors",
      clueFa: "بیش از چهارصد نفر بازدید کردند.",
    },
    choiceA: {
      labelEn: "Take the mystery exhibition on tour to other provincial museums!",
      labelFa: "نمایشگاه رو به موزه‌های شهرهای دیگر بفرستید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Write a bilingual children's book about the treehouse mystery!",
      labelFa: "یک کتاب کودک دوزبانه درباره این معما بنویسید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Working beside Mrs. Davis, the young detectives helped catalog ten forgotten historical letters. The local government awarded them an educational scholarship for their remarkable historical dedication.",
    keywords: [{ word: "scholarship", meaningFa: "بورسیه تحصیلی تشویقی", phonetic: "/ˈskɒləʃɪp/" }],
    question: {
      promptEn: "What did the local government award the kids?",
      promptFa: "شهرداری چه جایزه‌ای به بچه‌ها اهدا کرد؟",
      options: ["An educational scholarship", "A box of candy", "A bicycle helmet"],
      correctIndex: 0,
      hintSnippet: "an educational scholarship",
      clueFa: "یک بورسیه تحصیلی اهدا کرد.",
    },
    choiceA: {
      labelEn: "Attend junior archaeology summer camp at the university!",
      labelFa: "در اردوی تابستانی باستان‌شناسی دانشگاه شرکت کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Establish an after-school historical research laboratory!",
      labelFa: "یک آزمایشگاه پژوهش تاریخ در مدرسه تاسیس کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Six months later, magnificent purple and gold irises bloomed near the treehouse from the century-old seeds. Botanical experts from the university arrived to photograph the rare historical blossoms.",
    keywords: [{ word: "irises", meaningFa: "گل‌های زنبق باشکوه", phonetic: "/ˈaɪrɪsɪz/" }],
    question: {
      promptEn: "What flowers bloomed from the century-old seeds?",
      promptFa: "چه گل‌هایی از دانه‌های صد ساله شکوفا شدند؟",
      options: ["Purple and gold irises", "Cactus thorns", "Red roses"],
      correctIndex: 0,
      hintSnippet: "purple and gold irises bloomed",
      clueFa: "گل‌های زنبق بنفش و طلایی شکوفا شدند.",
    },
    choiceA: {
      labelEn: "Share iris seeds with botanical gardens across the nation!",
      labelFa: "دانه‌های زنبق رو به باغ‌های گیاه‌شناسی کشور هدیه بدید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Name the new flower 'The Whispering Treehouse Iris'!",
      labelFa: "اسم گل رو 'زنبق خانه درختی نجواگر' ثبت کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Chloe read the ancient nature poem at the morning assembly. Her recitation was so moving that the entire school stood in silent admiration, followed by thunderous applause.",
    keywords: [{ word: "recitation", meaningFa: "دکلمه و شعرخوانی با احساس", phonetic: "/ˌresɪˈteɪʃn/" }],
    question: {
      promptEn: "How did the school respond to Chloe's recitation?",
      promptFa: "مدرسه چطور به شعرخوانی کلویی واکنش نشان داد؟",
      options: ["Silent admiration followed by applause", "They walked away", "They fell asleep"],
      correctIndex: 0,
      hintSnippet: "silent admiration, followed by thunderous applause",
      clueFa: "با تحسین عمیق و تشویق پرشور واکنش نشان دادند.",
    },
    choiceA: {
      labelEn: "Publish an anthology of nature poetry illustrated by students!",
      labelFa: "کتاب گلچین شعرهای طبیعت رو با نقاشی بچه‌ها چاپ کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Found an annual poetry festival by the willow pond!",
      labelFa: "جشنواره سالانه شعر کنار برکه بید راه بندازید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Liam and Chloe printed fifty copies of their illustrated treasure hunt map. Every Saturday, neighborhood kids explore the garden paths, learning English words while searching for harmless hidden landmarks.",
    keywords: [{ word: "copies", meaningFa: "نسخه‌های چاپی", phonetic: "/ˈkɒpiz/" }],
    question: {
      promptEn: "How many copies of the map did they print?",
      promptFa: "چند نسخه از نقشه چاپ کردند؟",
      options: ["Fifty copies", "Two copies", "A million"],
      correctIndex: 0,
      hintSnippet: "printed fifty copies of their illustrated treasure hunt map",
      clueFa: "پنجاه نسخه چاپ کردند.",
    },
    choiceA: {
      labelEn: "Organize the Great Summer Neighborhood Quest every July!",
      labelFa: "مسابقه بزرگ ماجراجویی تابستانه رو هر تیرماه برگزار کنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Award wooden compass medals to all finishing teams!",
      labelFa: "به همه تیم‌های برنده مدال قطب‌نمای چوبی اهدا کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Liam launched the interactive web map, featuring recorded English pronunciation for every clue. Teachers across the district now use the interactive adventure in their ESL classrooms.",
    keywords: [{ word: "district", meaningFa: "منطقه آموزشی و مدارس", phonetic: "/ˈdɪstrɪkt/" }],
    question: {
      promptEn: "Who uses the interactive map website in their classrooms?",
      promptFa: "چه کسانی از سایت نقشه تعاملی در کلاس‌ها استفاده می‌کنند؟",
      options: ["Teachers across the district", "Car mechanics", "Cooks in restaurants"],
      correctIndex: 0,
      hintSnippet: "Teachers across the district",
      clueFa: "معلمان زبان در مدارس سراسر منطقه.",
    },
    choiceA: {
      labelEn: "Win the National Educational Innovation Trophy!",
      labelFa: "جام نوآوری آموزشی برتر کشور را برنده شوید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Translate the interactive map into five foreign languages!",
      labelFa: "نقشه تعاملی رو به پنج زبان دیگر دنیا ترجمه کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Liam built three comfortable wooden birdhouses near the treehouse. The bluebirds nested safely, raising chirping chicks. Every morning, soft bird songs wake Liam and Chloe with peace.",
    keywords: [{ word: "chicks", meaningFa: "جوجه‌های کوچک پرندگان", phonetic: "/tʃɪks/" }],
    question: {
      promptEn: "What did the bluebirds raise in the safe birdhouses?",
      promptFa: "پرندگان آبی چه چیزی را در لانه‌ها پرورش دادند؟",
      options: ["Chirping chicks", "Small frogs", "Snakes"],
      correctIndex: 0,
      hintSnippet: "raising chirping chicks",
      clueFa: "جوجه‌های جیک‌جیکو پرورش دادند.",
    },
    choiceA: {
      labelEn: "Start a certified backyard wildlife sanctuary!",
      labelFa: "حیاط خانه رو به پناهگاه رسمی حیات‌وحش تبدیل کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Photograph the growing bluebird chicks for a wildlife blog!",
      labelFa: "از بزرگ شدن جوجه‌ها برای وبلاگ طبیعت عکس بگیرید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The antique brass whistle now rests in a velvet-lined wooden box in Liam's room. Whenever a difficult riddle or puzzle arises, Liam looks at the whistle and remembers: curiosity unlocks every door.",
    keywords: [{ word: "curiosity", meaningFa: "کنجکاوی و ذهن پویا", phonetic: "/ˌkjʊəriˈɒsəti/" }],
    question: {
      promptEn: "What does curiosity unlock according to the story?",
      promptFa: "طبق پیام داستان کنجکاوی چه چیزی رو باز می‌کنه؟",
      options: ["Every door", "Only car doors", "Nothing"],
      correctIndex: 0,
      hintSnippet: "curiosity unlocks every door",
      clueFa: "کنجکاوی تمام درها رو باز می‌کنه.",
    },
    choiceA: {
      labelEn: "Pass down the detective box to your younger cousins!",
      labelFa: "جعبه کارآگاهی رو به بچه‌های کوچک‌تر فامیل هدیه بده!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Begin investigating the mystery of the abandoned lighthouse!",
      labelFa: "تحقیق روی معمای فانوس دریایی متروکه رو آغاز کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Following the rainbow beam, Liam unlocked a secret compartment behind a garden brick. Inside sat an ornate silver locket containing a photograph of the treehouse builders from 1924, laughing under the sun.",
    keywords: [{ word: "locket", meaningFa: "گردنبند قاب‌دار یادگاری", phonetic: "/ˈlɒkɪt/" }],
    question: {
      promptEn: "What was inside the silver locket?",
      promptFa: "داخل گردنبند قاب‌دار نقره‌ای چی بود؟",
      options: ["A photograph of the 1924 builders", "A gold coin", "Sand"],
      correctIndex: 0,
      hintSnippet: "containing a photograph of the treehouse builders from 1924",
      clueFa: "عکس سازندگان خانه درختی در سال ۱۹۲۴.",
    },
    choiceA: {
      labelEn: "Wear the silver locket as a talisman of lifelong friendship!",
      labelFa: "گردنبند رو به عنوان نشان دوستی همیشگی به گردن بنداز!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Donate the historical locket to the town heritage archive!",
      labelFa: "گردنبند رو به موزه اسناد تاریخی شهر اهدا کن!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Chloe's science poster explaining optical light refraction with prisms won First Place at the State Youth Science Fair. The judges praised her clever real-world demonstration based on the treehouse puzzle.",
    keywords: [{ word: "judges", meaningFa: "داوران علمی مسابقه", phonetic: "/ˈdʒʌdʒɪz/" }],
    question: {
      promptEn: "What place did Chloe's science poster win?",
      promptFa: "پروژه علمی کلویی چه رتبه‌ای آورد؟",
      options: ["First Place", "Tenth Place", "Last Place"],
      correctIndex: 0,
      hintSnippet: "won First Place at the State Youth Science Fair",
      clueFa: "رتبه اول رو در مسابقات علمی استان کسب کرد.",
    },
    choiceA: {
      labelEn: "Represent your town at the National Science Olympiad!",
      labelFa: "به عنوان نماینده شهر در المپیاد علمی کشور شرکت کن!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Build a permanent optical kaleidoscope inside the treehouse!",
      labelFa: "یک کالیدوسکوپ منشوری دائمی در خانه درختی نصب کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Library Mystery Circle", titleFa: "محفل کارآگاهان کتابخانه", badgeCategory: "legendary", badgeIcon: "🔍", badgeNameFa: "پایان افسانه‌ای", climaxEn: "Every Thursday, twenty young mystery lovers gather in the library lobby, decoding historical puzzles.", climaxFa: "هر پنجشنبه بیست نوجوان علاقه‌مند در کتابخانه جمع می‌شوند و معماهای تاریخی را حل می‌کنند.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Young Detective Library Corner", titleFa: "گوشه کارآگاهان خردسال", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان فرهنگی و ماندگار", climaxEn: "Hundreds of children read your donated mystery books, dreaming of thrilling discoveries.", climaxFa: "صدها کودک کتاب‌های اهدایی شما را خواندند و رؤیای کشف اسرار شیرین جهان را در سر پروراندند.", xpReward: 175 },
  { pathCode: "AAABA", titleEn: "The Annual Detective Medal", titleFa: "مدال سالانه کاوشگران نوجوان", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان افتخار مدرسه", climaxEn: "Every year, the school awards the 'Liam and Chloe Medallion' to the most curious student.", climaxFa: "هر سال مدال افتخار لیام و کلویی به کنجکاوترین و باسوادترین دانش‌آموز مدرسه اهدا می‌شود.", xpReward: 190 },
  { pathCode: "AAABB", titleEn: "The Regional Feature Article", titleFa: "مقاله درخشان روزنامه استانی", badgeCategory: "scholar", badgeIcon: "📰", badgeNameFa: "پایان پژوهشی", climaxEn: "Your front-page newspaper article inspires thousands of families to research their local history.", climaxFa: "مقاله زیبای شما در صفحه اول روزنامه، هزاران خانواده را به کشف تاریخ محله‌هایشان تشویق کرد.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Century Tree Carving", titleFa: "یادگار حکاکی صد ساله", badgeCategory: "heroic", badgeIcon: "🌳", badgeNameFa: "پایان پیوند نسل‌ها", climaxEn: "The oak tree proudly bears three generations of initials, uniting families across a century.", climaxFa: "تنه درخت نام سه نسل را در آغوش کشید و پیوند یک قرن خاطره و محبت را جاودانه کرد.", xpReward: 185 },
  { pathCode: "AABAB", titleEn: "The Living Voice of History", titleFa: "آوای زنده خاطرات کهن", badgeCategory: "scholar", badgeIcon: "🎙️", badgeNameFa: "پایان ثبت تاریخ", climaxEn: "Mr. Miller's recorded stories become the most cherished audio collection in the town archives.", climaxFa: "صدای قصه‌های آقای میلر ارزشمندترین گنجینه صوتی موزه تاریخ شهر شد.", xpReward: 175 },
  { pathCode: "AABBA", titleEn: "Sunset Treehouse Gatherings", titleFa: "غروب‌های گرم خانه درختی", badgeCategory: "explorer", badgeIcon: "☕", badgeNameFa: "پایان صمیمی", climaxEn: "Friends sip hot cocoa under the 1924 photo, sharing laughter and stories as stars twinkle.", climaxFa: "دوستان با نوشیدن هات‌چاکلت زیر عکس قدیمی به تماشای ستاره‌ها نشستند و خندیدند.", xpReward: 165 },
  { pathCode: "AABBB", titleEn: "The Miniature Heritage Model", titleFa: "ماکت میراث کهن شهر", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان هنرمندانه", climaxEn: "Your detailed model of the 1924 schoolhouse is permanently displayed in the town hall.", climaxFa: "ماکت دقیق مدرسه صد سال پیش برای همیشه در تالار شهر به نمایش عموم درآمد.", xpReward: 180 },
  { pathCode: "ABAAA", titleEn: "The Guardians of the Tower", titleFa: "پاسداران برج کهنسال", badgeCategory: "legendary", badgeIcon: "🔔", badgeNameFa: "پایان باشکوه", climaxEn: "Liam and Chloe ring the great tower bells every New Year, welcoming a century of hopes.", climaxFa: "لیام و کلویی هر سال نو زنگ بزرگ برج را به صدا درمی‌آورند و امید را به شهر مژده می‌دهند.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "The Centennial Town Gala", titleFa: "جشن بزرگ قرن شهر", badgeCategory: "heroic", badgeIcon: "🎈", badgeNameFa: "پایان پرشور", climaxEn: "The annual festival fills the town square with music, costumes, and historical joy.", climaxFa: "جشنواره سالانه شهر را با لباس‌های زیبا، موسیقی و شادی صد ساله پر کرد.", xpReward: 185 },
  { pathCode: "ABABA", titleEn: "The Tower Donor Stone", titleFa: "سنگ زرین یادبود برج", badgeCategory: "heroic", badgeIcon: "💎", badgeNameFa: "پایان ماندگار", climaxEn: "Carved in golden marble, your names will inspire curious youth for centuries to come.", climaxFa: "نام شما بر سنگ مرمر طلایی حک شد تا قرن‌ها الهام‌بخش نوجوانان کاوشگر باشد.", xpReward: 190 },
  { pathCode: "ABABB", titleEn: "The Letter to Year 2124", titleFa: "نامه‌ای به سوی قرن آینده", badgeCategory: "legendary", badgeIcon: "💌", badgeNameFa: "پایان رازآلود", climaxEn: "Resting safely inside brickwork, your heartfelt words travel across time toward the future.", climaxFa: "نامه صمیمانه شما در دل دیوار برج، سفری صد ساله را به سوی آینده آغاز کرد.", xpReward: 200 },
  { pathCode: "ABBAA", titleEn: "The Touring Mystery Gallery", titleFa: "نمایشگاه سیار رازهای کهن", badgeCategory: "legendary", badgeIcon: "🖼️", badgeNameFa: "پایان پرافتخار", climaxEn: "The exhibition travels to five cities, celebrated as the best youth historical project in the nation.", climaxFa: "نمایشگاه به پنج شهر کشور سفر کرد و برترین پروژه تاریخی نوجوانان شناخته شد.", xpReward: 200 },
  { pathCode: "ABBAB", titleEn: "The Bestselling Mystery Book", titleFa: "کتاب پرفروش کارآگاهان کوچک", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان نویسندگی", climaxEn: "Your illustrated book sells thousands of copies, turning children into passionate English readers.", climaxFa: "کتاب مصور شما هزاران نسخه فروخت و بچه‌ها را عاشق ریدینگ و یادگیری زبان کرد.", xpReward: 180 },
  { pathCode: "ABBBA", titleEn: "The Young Archaeologist Laurels", titleFa: "نشان پژوهشگر جوان باستان‌شناسی", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان علمی و درخشان", climaxEn: "University professors welcome you to their dig sites, predicting brilliant scientific careers.", climaxFa: "استادان دانشگاه شما را به پروژه‌های کاوش خود دعوت کردند و آینده درخشانی برایتان رقم زدند.", xpReward: 195 },
  { pathCode: "ABBBB", titleEn: "The Youth History Laboratory", titleFa: "آزمایشگاه تاریخ نوجوانان", badgeCategory: "heroic", badgeIcon: "🔬", badgeNameFa: "پایان نوآورانه", climaxEn: "The school lab becomes a bustling center where students analyze old artifacts with science.", climaxFa: "آزمایشگاه مدرسه به کانونی پرشور برای تحلیل آثار تاریخی با روش‌های علمی بدل شد.", xpReward: 185 },
  { pathCode: "BAAAA", titleEn: "The Whispering Botanical Gift", titleFa: "هدیه زرین زنبق‌های تاریخ", badgeCategory: "legendary", badgeIcon: "🌸", badgeNameFa: "پایان طبیعت‌دوست", climaxEn: "Descendants of the 1924 irises bloom in fifty public parks, celebrated for their golden petals.", climaxFa: "فرزندان زنبق‌های صد ساله در پنجاه بوستان شهر شکوفا شدند و زیبایی آفریدند.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Registered Royal Iris", titleFa: "زنبق ثبت‌شده سلطنتی", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان علمی گیاه‌شناسی", climaxEn: "The Royal Horticultural Society officially registers 'The Whispering Treehouse Iris'.", climaxFa: "انجمن بین‌المللی گیاه‌شناسی نام گل را رسماً در فهرست گل‌های کمیاب ثبت کرد.", xpReward: 180 },
  { pathCode: "BAABA", titleEn: "The Youth Poetry Anthology", titleFa: "کتاب شعر شاعران کوچک", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان ادبی و ماندگار", climaxEn: "The published poetry anthology inspires thousands of students to write about nature in English.", climaxFa: "مجموعه اشعار چاپ‌شده هزاران دانش‌آموز را تشویق کرد تا به زبان انگلیسی شعر بسرایند.", xpReward: 175 },
  { pathCode: "BAABB", titleEn: "The Willow Poetry Festival", titleFa: "جشنواره شعر بید مجنون", badgeCategory: "explorer", badgeIcon: "🪕", badgeNameFa: "پایان شاعرانه", climaxEn: "Every autumn, poets recite under the whispering willow branches beside the quiet pond.", climaxFa: "هر پاییز شاعران نوجوان زیر شاخه‌های بید کنار برکه گرد هم می‌آیند و شعر می‌خوانند.", xpReward: 170 },
  { pathCode: "BABAA", titleEn: "The Great Summer Quest", titleFa: "مسابقه بزرگ ماجراجویی تابستانه", badgeCategory: "explorer", badgeIcon: "🗺️", badgeNameFa: "پایان پرشور محله", climaxEn: "Fifty excited children run through the garden paths every July, solving riddle after riddle.", climaxFa: "پنجاه کودک شاد هر تیرماه در مسیرهای باغ می‌دوند و معماها را یکی‌یکی حل می‌کنند.", xpReward: 185 },
  { pathCode: "BABAB", titleEn: "The Wooden Compass Champions", titleFa: "قهرمانان قطب‌نمای چوبی", badgeCategory: "funny", badgeIcon: "🧭", badgeNameFa: "پایان دوستانه و شاد", climaxEn: "Every kid in the neighborhood proudly wears a wooden compass medal carved by Liam.", climaxFa: "همه بچه‌های محله با افتخار مدال قطب‌نمای چوبی دست‌ساز لیام را به سینه زدند.", xpReward: 165 },
  { pathCode: "BABBA", titleEn: "The National Innovation Cup", titleFa: "جام طلایی نوآوری آموزشی", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان فناوری و افتخار", climaxEn: "The Ministry of Education awards your interactive web map the top award for digital learning.", climaxFa: "وزارت آموزش و پرورش جایزه برتر نوآوری دیجیتال را به سایت نقشه شما اهدا کرد.", xpReward: 200 },
  { pathCode: "BABBB", titleEn: "The Global Multilingual Map", titleFa: "نقشه پنج‌زبانه جهانی", badgeCategory: "scholar", badgeIcon: "🌐", badgeNameFa: "پایان بین‌المللی", climaxEn: "Children in ten countries now explore the mystery using five languages on your website.", climaxFa: "کودکان در ده کشور جهان معما را با پنج زبان مختلف در سایت شما کشف می‌کنند.", xpReward: 190 },
  { pathCode: "BBAAA", titleEn: "The Bluebird Backyard Sanctuary", titleFa: "پناهگاه پرندگان بهشتی", badgeCategory: "legendary", badgeIcon: "🐦", badgeNameFa: "پایان نغمه پرندگان", climaxEn: "Over thirty colorful bluebirds now sing in the garden, making it the most musical home in town.", climaxFa: "بیش از سی پرنده آبی در باغچه آواز می‌خوانند و آنجا را به خوش‌آواترین خانه شهر بدل کرده‌اند.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Wildlife Chronicles", titleFa: "سالنامه مصور پرندگان", badgeCategory: "scholar", badgeIcon: "📸", badgeNameFa: "پایان عکاسی طبیعت", climaxEn: "Your bird photography blog reaches fifty thousand followers who care deeply for nature.", climaxFa: "وبلاگ عکاسی شما پنجاه هزار دنبال‌کننده پیدا کرد که با عشق از پرندگان مراقبت می‌کنند.", xpReward: 180 },
  { pathCode: "BBABA", titleEn: "The Detective Keepsake Box", titleFa: "صندوقچه زرین کارآگاهان آینده", badgeCategory: "heroic", badgeIcon: "🗝️", badgeNameFa: "پایان ماندگار", climaxEn: "The cousins open the detective box with shining eyes, eager to continue the adventure.", climaxFa: "بچه‌های فامیل با چشمانی پر از شوق صندوقچه را گشودند تا ماجراجویی را ادامه دهند.", xpReward: 175 },
  { pathCode: "BBABB", titleEn: "The Mystery of the Old Lighthouse", titleFa: "راز فانوس دریایی متروکه", badgeCategory: "explorer", badgeIcon: "🗼", badgeNameFa: "پایان ماجراجویی تازه", climaxEn: "Standing on the coastal cliff, Liam and Chloe hold their compass, ready for the next case.", climaxFa: "بر فراز صخره ساحلی، لیام و کلویی با قطب‌نما در دست آماده کشف معمای بعدی شدند.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "The Silver Locket of Friendship", titleFa: "گردنبند نقره‌ای پیوند ابدی", badgeCategory: "legendary", badgeIcon: "💖", badgeNameFa: "پایان عاطفی و صمیمانه", climaxEn: "Wearing the 1924 locket, Chloe knows that kindness and curiosity unite all human hearts.", climaxFa: "با در دست داشتن گردنبند، کلویی دریافت که مهربانی و کنجکاوی قلب‌های تمام نسل‌ها را به هم پیوند می‌دهد.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Heritage Museum Wing", titleFa: "تالار یادگاری‌های ماندگار موزه", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان موزه تاریخی", climaxEn: "The silver locket rests beside historical journals, teaching children the value of family history.", climaxFa: "گردنبند در موزه شهر آرام گرفت تا ارزش خاطرات کهن را به کودکان یادآوری کند.", xpReward: 180 },
  { pathCode: "BBBBA", titleEn: "The National Science Laurels", titleFa: "مدال طلای المپیاد علوم کشور", badgeCategory: "legendary", badgeIcon: "🥇", badgeNameFa: "پایان علمی و درخشان", climaxEn: "Chloe is crowned the Junior Scientist of the Year, cheered on by her proud brother and school.", climaxFa: "کلویی برنده مدال طلای دانشمند خردسال سال شد و تمام مدرسه به افتخارش هورا کشیدند.", xpReward: 200 },
  { pathCode: "BBBBB", titleEn: "The Treehouse of Rainbow Wonders", titleFa: "خانه درختی رنگین‌کمان‌های شگفت", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "With the prism sparkling rainbows across the oak branches, the whispering treehouse holds the magic of eternal wonder.", climaxFa: "با رقص رنگین‌کمان‌های منشور در میان شاخه‌های کهنسال، خانه درختی برای همیشه مهد جادو، خرد و شگفتی شد.", xpReward: 200 },
];

export const story2TreehouseMystery: AdventureStory = buildAdventureStory({
  id: "a2-treehouse-mystery",
  storyIndex: 2,
  cefr: "A2",
  titleEn: "The Mystery of the Whispering Treehouse",
  titleFa: "راز خانه درختی نجواگر",
  genre: "mystery",
  genreLabelFa: "🗝️ معمایی و کنجکاوی",
  genreIcon: "🗝️",
  synopsisEn:
    "Detective Liam and his sister Chloe find an antique carved puzzle box hidden under the treehouse floorboards. Unlock the owl lock or decode the 1924 compass riddle across 32 thrilling mystery endings!",
  synopsisFa:
    "لیام و کلویی در کف خانه درختی یک جعبه چوبی حکاکی‌شده با قفل جغد برنجی پیدا می‌کنند! آیا با چرخاندن بال جغد معما را باز می‌کنی یا سرنخ‌ها را در کتابخانه و برج ساعت دنبال می‌کنی؟ ۳۲ پایان معمایی و جذاب در انتظار توست!",
  coverImage: "/images/skills/reading/a2-treehouse-mystery.webp",
  nodes,
  endings,
});
