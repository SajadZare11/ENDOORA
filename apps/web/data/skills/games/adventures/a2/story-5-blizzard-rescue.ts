import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 5 (A2): The Blizzard Mountain Rescue (عملیات نجات در کولاک کوهستان)
// Genre: Thriller & Rescue (هیجان و نجات‌بخشی)
// CEFR: A2 (Winter/rescue vocabulary, past tenses, urgent dialogues, action)
// Characters: Ben, Barney (Saint Bernard dog), Captain Mark, Lisa
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "A fierce winter blizzard hit Eagle Mountain on Saturday afternoon. Inside the wooden rescue station, the wood stove crackled warmly. Eleven-year-old junior rescuer Ben was brushing his loyal Saint Bernard dog, Barney. Barney had thick brown-and-white fur, kind brown eyes, and wore a red rescue collar with a silver bell. Suddenly, the emergency radio crackled with static: 'Mayday! This is Captain Mark at Base Camp. A hiker named Lisa and her father are stranded near Frosty Ridge. The snow is falling fast!'",
    keywords: [
      { word: "blizzard", meaningFa: "کولاک شدید و طوفان برف", phonetic: "/ˈblɪzəd/" },
      { word: "rescuer", meaningFa: "امدادگر کوهستان", phonetic: "/ˈreskjuːər/" },
      { word: "static", meaningFa: "خش‌خش امواج بی‌سیم", phonetic: "/ˈstætɪk/" },
      { word: "stranded", meaningFa: "گیر افتاده در برف", phonetic: "/ˈstrændɪd/" },
    ],
    question: {
      promptEn: "Who was stranded near Frosty Ridge?",
      promptFa: "چه کسانی نزدیک تیغه یخی در برف گیر افتاده بودند؟",
      options: ["A hiker named Lisa and her father", "Three skiers", "A bus driver"],
      correctIndex: 0,
      hintSnippet: "A hiker named Lisa and her father are stranded near Frosty Ridge",
      clueFa: "خط آخر رو ببین دوست من! کوهنوردی به نام لیزا و پدرش بودند.",
    },
    choiceA: {
      labelEn: "Strap on snowshoes and take the protected Pine Forest trail!",
      labelFa: "راکت‌های برفی رو ببندید و از مسیر امن جنگل کاج حرکت کنید!",
      descriptionFa: "درختان متراکم کاج شما رو از باد شدید محافظت می‌کنند.",
    },
    choiceB: {
      labelEn: "Ride the snowmobile across the frozen Whispering Valley!",
      labelFa: "با موتور برفی اسنوموبیل از دل دره یخ‌زده با سرعت برانید!",
      descriptionFa: "سریع‌ترین مسیر مستقیم برای رساندن پتو و کمک.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Ben snapped on lightweight aluminum snowshoes and pulled his thick red goggles over his eyes. Barney barked a deep, brave 'Woof!' and trotted ahead through the snowdrifts. The pine trees formed a natural roof, shielding them from the swirling gale. Barney stopped near an old wooden trail marker, sniffing the deep white powder. He raised his black nose toward a rocky crevice.",
    keywords: [
      { word: "goggles", meaningFa: "عینک ایمنی ضدطوفان برف", phonetic: "/ˈɡɒɡlz/" },
      { word: "snowdrifts", meaningFa: "توده‌های انباشته‌شده برف", phonetic: "/ˈsnəʊdrɪfts/" },
      { word: "crevice", meaningFa: "شکاف صخره‌ای در کوه", phonetic: "/ˈkrevɪs/" },
    ],
    question: {
      promptEn: "What formed a natural roof shielding them from the gale?",
      promptFa: "چه چیزی سقف طبیعی برای محافظت در برابر طوفان ساخته بود؟",
      options: ["The pine trees", "A metal bridge", "A stone tunnel"],
      correctIndex: 0,
      hintSnippet: "The pine trees formed a natural roof",
      clueFa: "خط سوم رو بخون! درختان بلند کاج مثل یک سقف طبیعی بودند.",
    },
    choiceA: {
      labelEn: "Follow Barney's nose toward the sheltered rocky crevice!",
      labelFa: "مسیر بویایی بارنی رو به سمت شکاف صخره‌ای دنبال کن!",
      descriptionFa: "شاید کوهنوردان داخل شکاف پناه گرفته باشن.",
    },
    choiceB: {
      labelEn: "Fire an orange rescue flare into the sky to signal hope!",
      labelFa: "یک منور نارنجی امداد به آسمان شلیک کن تا علامت بدی!",
      descriptionFa: "نور درخشان منور از چند کیلومتری در کولاک دیده می‌شه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Ben pulled the starter cord of the yellow rescue snowmobile: Vrooom! The engine roared to life with powerful treads. Barney jumped into the sidecar, wearing custom dog goggles and a warm thermal vest. The snowmobile glided over the frozen powder like a boat on water. The dual halogen headlights pierced through the blinding whiteout.",
    keywords: [
      { word: "treads", meaningFa: "شنی‌ها و زنجیرچرخ اسنوموبیل", phonetic: "/tredz/" },
      { word: "sidecar", meaningFa: "اتاقک جانبی متصل به موتور", phonetic: "/ˈsaɪdkɑːr/" },
      { word: "whiteout", meaningFa: "کولاک شدید که همه‌جا سفید و تار می‌شه", phonetic: "/ˈwaɪtaʊt/" },
    ],
    question: {
      promptEn: "What color was the rescue snowmobile?",
      promptFa: "اسنوموبیل امداد چه رنگی بود؟",
      options: ["Yellow", "Black", "Green"],
      correctIndex: 0,
      hintSnippet: "the yellow rescue snowmobile",
      clueFa: "خط اول رو ببین! زرد رنگ بود تا در برف به راحتی دیده بشه.",
    },
    choiceA: {
      labelEn: "Follow the faint GPS distress beacon signal on your dashboard!",
      labelFa: "سیگنال ردیاب بی‌سیم روی صفحه داشبورد رو دنبال کن!",
      descriptionFa: "مختصات دقیق کوهنوردان رو روی صفحه نشون می‌ده.",
    },
    choiceB: {
      labelEn: "Honk the loud rescue horn to alert anyone nearby!",
      labelFa: "بوق قوی اسنوموبیل رو به صدا دربیار تا صدات به گوششون برسه!",
      descriptionFa: "صدای بوق در میان طوفان امیدبخش‌ترین صداییه که می‌شنون.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Barney dug through two feet of soft powder with his front paws, whining excitedly. In the sheltered crevice under a granite overhang, Ben saw two shivering figures wrapped in a silver emergency blanket. It was Lisa and her father! 'Help is here!' Ben called out warmly. Barney trotted right up to Lisa and gently licked her cold frozen hands.",
    keywords: [
      { word: "shivering", meaningFa: "لرزان از شدت سرما", phonetic: "/ˈʃɪvərɪŋ/" },
      { word: "overhang", meaningFa: "لبه برآمده صخره پناهگاهی", phonetic: "/ˈəʊvəhæŋ/" },
      { word: "licked", meaningFa: "لیسید با مهربانی", phonetic: "/lɪkt/" },
    ],
    question: {
      promptEn: "Who were the two shivering figures in the crevice?",
      promptFa: "دو نفری که در شکاف از سرما می‌لرزیدند چه کسانی بودند؟",
      options: ["Lisa and her father", "Two park rangers", "Tourists from a hotel"],
      correctIndex: 0,
      hintSnippet: "It was Lisa and her father!",
      clueFa: "خط سوم رو بخون! لیزا و پدرش بودند.",
    },
    choiceA: {
      labelEn: "Wrap Lisa and her father in thick thermal fleece blankets!",
      labelFa: "لیزا و پدرش رو در پتوهای گرم پشمی بپیچید!",
      descriptionFa: "گرم شدن سریع جان کوهنوردان رو نجات می‌ده.",
    },
    choiceB: {
      labelEn: "Pour steaming hot cocoa from your stainless steel thermos!",
      labelFa: "شکلات داغ بخارآلود از فلاسک استیل براشون بریز!",
      descriptionFa: "نوشیدنی داغ و شیرین انرژی از دست‌رفته رو برمی‌گردونه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Psssssh-boom! The orange flare shot high into the stormy sky, blooming into a bright star that drifted under a tiny parachute. A few seconds later, three loud whistle blasts echoed through the wind from three hundred meters to the north: Tweet! Tweet! Tweet! 'They heard us!' Ben shouted with joy.",
    keywords: [
      { word: "parachute", meaningFa: "چتر نجات کوچک منور", phonetic: "/ˈpærəʃuːt/" },
      { word: "blasts", meaningFa: "صدای سوت ممتد و قوی", phonetic: "/blɑːsts/" },
      { word: "echoed", meaningFa: "طنین انداخت در باد", phonetic: "/ˈekəʊd/" },
    ],
    question: {
      promptEn: "How many whistle blasts echoed from the north?",
      promptFa: "چند صدای سوت ممتد از سمت شمال شنیده شد؟",
      options: ["Three loud whistle blasts", "One blast", "Fifty blasts"],
      correctIndex: 0,
      hintSnippet: "three loud whistle blasts echoed through the wind",
      clueFa: "خط دوم رو ببین! سه صدای سوت پی‌درپی علامت استاندارد امداده.",
    },
    choiceA: {
      labelEn: "Navigate toward the whistle sound with Barney leading the way!",
      labelFa: "به سمت صدای سوت با هدایت بارنی حرکت کنید!",
      descriptionFa: "بارنی در میان برف مستقیم به سمت صدا می‌ره.",
    },
    choiceB: {
      labelEn: "Radio Base Camp to confirm you have located the hikers!",
      labelFa: "با بی‌سیم به پایگاه خبر بده که موقعیت کوهنوردان پیدا شد!",
      descriptionFa: "کاپیتان مارک باید بدونه که همه سالم هستید.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The GPS blip pulsed steadily on Ben's screen: fifty meters... thirty meters... ten meters! In the bright snowmobile headlights, Ben spotted a red emergency tent flapping violently in the blizzard. Lisa's father was securing the tent stakes against the freezing wind while Lisa held their flashlights.",
    keywords: [
      { word: "blip", meaningFa: "نقطه نوری چشمک‌زن روی رادار", phonetic: "/blɪp/" },
      { word: "flapping", meaningFa: "بال‌بال زدن چادر در باد", phonetic: "/ˈflæpɪŋ/" },
      { word: "stakes", meaningFa: "میخ‌های طوفانی چادر", phonetic: "/steɪks/" },
    ],
    question: {
      promptEn: "What was flapping violently in the blizzard?",
      promptFa: "چه چیزی در کولاک شدید تکان می‌خورد؟",
      options: ["A red emergency tent", "An umbrella", "A car cover"],
      correctIndex: 0,
      hintSnippet: "a red emergency tent flapping violently in the blizzard",
      clueFa: "خط دوم رو بخون! چادر قرمز اضطراری در باد تکان می‌خورد.",
    },
    choiceA: {
      labelEn: "Anchor the tent with heavy snowmobile tie-down ropes!",
      labelFa: "چادر رو با طناب‌های محکم اسنوموبیل مهار کنید!",
      descriptionFa: "طناب‌ها مانع کنده شدن چادر توسط طوفان می‌شن.",
    },
    choiceB: {
      labelEn: "Help Lisa and her father safely into the heated snowmobile!",
      labelFa: "لیزا و پدرش رو به داخل اسنوموبیل با صندلی گرم هدایت کنید!",
      descriptionFa: "کابین موتور گرم و از باد کاملاً در امانه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Ben honked the dual horn: Honk! Honk! Lisa heard the sound and flashed her high-beam lantern in three rhythmic pulses. Barney leaped from the snowmobile, bounding through waist-deep snow like a dolphin in waves. Within moments, Barney stood beside Lisa, who hugged the big furry dog with tears of gratitude.",
    keywords: [
      { word: "pulses", meaningFa: "پالس‌های نوری متناوب", phonetic: "/ˈpʌlsɪz/" },
      { word: "bounding", meaningFa: "جهش‌های بلند در برف عمیق", phonetic: "/ˈbaʊndɪŋ/" },
      { word: "gratitude", meaningFa: "سپاسگزاری و حس قدردانی", phonetic: "/ˈɡrætɪtjuːd/" },
    ],
    question: {
      promptEn: "Who did Lisa hug with tears of gratitude?",
      promptFa: "لیزا با اشک قدردانی چه کسی رو در آغوش کشید؟",
      options: ["Barney the Saint Bernard", "A tree", "A snowman"],
      correctIndex: 0,
      hintSnippet: "hugged the big furry dog with tears of gratitude",
      clueFa: "خط آخر رو ببین! سگ پشمالوی مهربان بارنی رو بغل کرد.",
    },
    choiceA: {
      labelEn: "Give Lisa a warm wool beanie and dry ski mittens!",
      labelFa: "کلاه پشمی و دستکش‌های اسکی خشک به لیزا بده!",
      descriptionFa: "گرم کردن دست‌ها و سر از سرمازدگی جلوگیری می‌کنه.",
    },
    choiceB: {
      labelEn: "Check Lisa's father's sprained ankle and wrap it firmly!",
      labelFa: "مچ پای پیچ‌خورده پدر لیزا رو با باند محکم ببند!",
      descriptionFa: "پای پدر در سقوط روی سنگ‌ها پیچ خورده بود.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Wrapped in thick fleece blankets with Barney lying warm against their feet, color returned to Lisa and her father's cheeks. 'You saved our lives, young man,' Lisa's father whispered with a strong handshake. Ben smiled modestly: 'Teamwork between humans and dogs makes miracles happen.'",
    keywords: [
      { word: "miracles", meaningFa: "معجزه‌های بزرگ نجات", phonetic: "/ˈmɪrəklz/" },
      { word: "modestly", meaningFa: "با فروتنی و مهربانی", phonetic: "/ˈmɒdɪstli/" },
      { word: "cheeks", meaningFa: "گونه‌های گل‌انداخته", phonetic: "/tʃiːks/" },
    ],
    question: {
      promptEn: "Who lay warm against the hikers' feet?",
      promptFa: "چه کسی روی پاهای کوهنوردان خوابید تا گرمشان کند؟",
      options: ["Barney", "A cat", "Nobody"],
      correctIndex: 0,
      hintSnippet: "with Barney lying warm against their feet",
      clueFa: "خط اول رو بخون! سگ مهربان بارنی.",
    },
    choiceA: {
      labelEn: "Trek back slowly through the forest to the warm rescue station!",
      labelFa: "آهسته از مسیر جنگل به سمت ایستگاه نجات حرکت کنید!",
      descriptionFa: "آتش بخاری هیزمی و سوپ داغ در ایستگاه منتظره.",
    },
    choiceB: {
      labelEn: "Radio the rescue helicopter that the hikers are safe and warm!",
      labelFa: "به بالگرد امداد بی‌سیم بزن که حال کوهنوردان خوبه!",
      descriptionFa: "بالگرد می‌تونه سریع‌تر اون‌ها رو به بیمارستان برسونه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Steam rose from the stainless thermos as Ben poured rich, creamy cocoa into metal mugs. The hot sweet drink warmed Lisa from the inside out. She smiled, her eyes sparkling: 'This is the most delicious hot chocolate on planet Earth!'",
    keywords: [
      { word: "mugs", meaningFa: "ماگ‌های فلزی کوهنوردی", phonetic: "/mʌɡz/" },
      { word: "steaming", meaningFa: "بخارآلود و داغ", phonetic: "/ˈstiːmɪŋ/" },
      { word: "creamy", meaningFa: "شکلات خامه‌ای و غلیظ", phonetic: "/ˈkriːmi/" },
    ],
    question: {
      promptEn: "What did Ben pour into metal mugs?",
      promptFa: "بن داخل ماگ‌های فلزی چه چیزی ریخت؟",
      options: ["Rich, creamy cocoa", "Cold tea", "Plain water"],
      correctIndex: 0,
      hintSnippet: "poured rich, creamy cocoa into metal mugs",
      clueFa: "خط اول رو ببین! شکلات داغ خامه‌ای و لذیذ ریخت.",
    },
    choiceA: {
      labelEn: "Award Barney a big piece of dried beef jerky for his heroism!",
      labelFa: "یک تکه گوشت خشک جایزه به بارنی برای شجاعتش بده!",
      descriptionFa: "بارنی لایق بهترین پاداش دنیاست.",
    },
    choiceB: {
      labelEn: "Guide the hikers step-by-step down the sheltered trail!",
      labelFa: "قدم‌به‌قدم کوهنوردان رو در مسیر امن به پایین راهنمایی کن!",
      descriptionFa: "با آرامش و گام‌های مطمئن حرکت کردن رمز سلامته.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Barney plowed through the snow like a friendly polar bear, leading Ben directly to a stone hollow where Lisa and her dad stood waving their arms. 'We followed your flare!' Lisa cheered. Within minutes, Ben had both hikers secured with thermal blankets and walking poles.",
    keywords: [
      { word: "plowed", meaningFa: "برف‌ها را شکافت و راه باز کرد", phonetic: "/plaʊd/" },
      { word: "secured", meaningFa: "محافظت و آماده حرکت کرد", phonetic: "/sɪˈkjʊəd/" },
      { word: "polar bear", meaningFa: "خرس قطبی سپید", phonetic: "/ˈpəʊlə beər/" },
    ],
    question: {
      promptEn: "What did Barney plow through the snow like?",
      promptFa: "بارنی چطور برف‌ها رو می‌شکافت و جلو می‌رفت؟",
      options: ["Like a friendly polar bear", "Like a tiny bird", "Like a slow turtle"],
      correctIndex: 0,
      hintSnippet: "plowed through the snow like a friendly polar bear",
      clueFa: "خط اول رو بخون! مثل یک خرس قطبی مهربان راه باز می‌کرد.",
    },
    choiceA: {
      labelEn: "Lead the party toward the mountain rescue hut for the night!",
      labelFa: "گروه رو به سمت کلبه امن امداد کوهستان هدایت کن!",
      descriptionFa: "کلبه چوبی با شومینه و تختهای گرم.",
    },
    choiceB: {
      labelEn: "Send a digital tracking update to regional coast guard radar!",
      labelFa: "موقعیت زنده نجات‌یافتگان رو به رادار امداد بفرست!",
      descriptionFa: "پایگاه از سلامت تمام اعضا مطمئن می‌شه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Ben spoke clearly into his radio mic: 'Base Camp, this is Junior Rescuer Ben. Both hikers located at coordinates 45-North. No serious injuries. Beginning descent.' Captain Mark's voice came back cheering: 'Copy that, Ben! You and Barney are true heroes!'",
    keywords: [
      { word: "descent", meaningFa: "پایین آمدن و فرود از کوهستان", phonetic: "/dɪˈsent/" },
      { word: "injuries", meaningFa: "جراحات و آسیب‌های جدی", phonetic: "/ˈɪndʒəriz/" },
      { word: "located", meaningFa: "مکان‌یابی شدند", phonetic: "/ləʊˈkeɪtɪd/" },
    ],
    question: {
      promptEn: "What did Captain Mark call Ben and Barney over the radio?",
      promptFa: "کاپیتان مارک پشت بی‌سیم بن و بارنی رو چی نامید؟",
      options: ["True heroes", "Tourists", "Late helpers"],
      correctIndex: 0,
      hintSnippet: "You and Barney are true heroes!",
      clueFa: "خط آخر رو ببین! آنها رو قهرمانان واقعی نامید.",
    },
    choiceA: {
      labelEn: "Begin the safe march home under clearing starry skies!",
      labelFa: "حرکت به خانه رو زیر آسمان صاف پرستاره آغاز کنید!",
      descriptionFa: "طوفان کم‌کم فروکش کرده و ستاره‌ها پیدا شدن.",
    },
    choiceB: {
      labelEn: "Prepare a warm broth feast at the basecamp kitchen!",
      labelFa: "یک سوپ مقوی و گرم در آشپزخانه پایگاه بپزید!",
      descriptionFa: "سوپ سبزیجات داغ بعد از سرمای کوهستان عالیه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Ben secured the steel winch cable from the snowmobile to the tent's main anchor. The sturdy tension held the tent rock-steady against the fifty-knot blizzard gusts. Inside, the wind stopped howling, and the hikers rested in safety.",
    keywords: [
      { word: "winch", meaningFa: "قرقره و سیم‌بکسل اسنوموبیل", phonetic: "/wɪntʃ/" },
      { word: "gusts", meaningFa: "تندبادهای ناگهانی شدید", phonetic: "/ɡʌsts/" },
      { word: "howling", meaningFa: "زوزه کشیدن باد شدید", phonetic: "/ˈhaʊlɪŋ/" },
    ],
    question: {
      promptEn: "What secured the tent against the blizzard gusts?",
      promptFa: "چه چیزی چادر رو در برابر تندباد محکم نگه داشت؟",
      options: ["The steel winch cable from the snowmobile", "A wooden stick", "A snowball"],
      correctIndex: 0,
      hintSnippet: "secured the steel winch cable from the snowmobile",
      clueFa: "خط اول رو بخون! کابل فولادی اسنوموبیل مهارش کرد.",
    },
    choiceA: {
      labelEn: "Wait out the peak of the storm inside the anchored tent!",
      labelFa: "تا فروکش کردن اوج طوفان در چادر ایمن استراحت کنید!",
      descriptionFa: "گاهی صبر کردن هوشمندانه‌ترین کار در کوهستانه.",
    },
    choiceB: {
      labelEn: "Evacuate the hikers directly onto the snowmobile sidecar!",
      labelFa: "کوهنوردان رو به اتاقک گرم اسنوموبیل منتقل کنید!",
      descriptionFa: "حرکت سریع به سمت دره گرم.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Lisa and her father settled into the heated seats of the snowmobile, wrapping in thermal blankets. The windshield protected them from the bitter wind. 'I thought we were going to freeze,' Lisa whispered, hugging Barney, 'until your golden headlights appeared.'",
    keywords: [
      { word: "heated", meaningFa: "گرم‌کن‌دار و مطبوع", phonetic: "/ˈhiːtɪd/" },
      { word: "windshield", meaningFa: "شیشه جلو محافظ در برابر باد", phonetic: "/ˈwɪndʃiːld/" },
      { word: "bitter", meaningFa: "سوزان و گزنده (سرما)", phonetic: "/ˈbɪtər/" },
    ],
    question: {
      promptEn: "What protected the hikers from the bitter wind?",
      promptFa: "چه چیزی کوهنوردان را از باد گزنده محافظت کرد؟",
      options: ["The snowmobile windshield and blankets", "A paper bag", "A light umbrella"],
      correctIndex: 0,
      hintSnippet: "The windshield protected them from the bitter wind",
      clueFa: "خط اول رو ببین! شیشه جلو و پتوهای حرارتی.",
    },
    choiceA: {
      labelEn: "Drive the snowmobile smoothly down the groomed valley trail!",
      labelFa: "با اسنوموبیل نرم و آرام در مسیر پاکسازی‌شده برانید!",
      descriptionFa: "فرود ایمن به سمت جاده آسفالت.",
    },
    choiceB: {
      labelEn: "Flash headlights to signal the incoming rescue convoy!",
      labelFa: "با چراغ‌ها به کاروان خودروهای امدادی علامت بدید!",
      descriptionFa: "آمبولانس و خودروهای امداد در پای کوه منتظرند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Ben gently slipped a warm wool beanie onto Lisa's head and wrapped her freezing fingers in dry, fleece-lined ski mittens. Lisa wiggled her fingers with a joyful grin: 'My hands are warm again! Thank you, Ben!'",
    keywords: [
      { word: "beanie", meaningFa: "کلاه بافتنی گرم", phonetic: "/ˈbiːni/" },
      { word: "fleece-lined", meaningFa: "دارای آستر پشمی نرم", phonetic: "/fliːs laɪnd/" },
      { word: "wiggled", meaningFa: "تکان تکان داد با شادی", phonetic: "/ˈwɪɡld/" },
    ],
    question: {
      promptEn: "What did Ben give Lisa for her hands?",
      promptFa: "بن برای دست‌های لیزا چه چیزی بهش داد؟",
      options: ["Fleece-lined ski mittens", "A plastic cup", "Cold snow"],
      correctIndex: 0,
      hintSnippet: "dry, fleece-lined ski mittens",
      clueFa: "خط اول رو بخون! دستکش‌های اسکی آستردار پشمی داد.",
    },
    choiceA: {
      labelEn: "Transport Lisa safely to the valley medical chalet!",
      labelFa: "لیزا رو با احتیاط به کلینیک کوهستانی دره منتقل کنید!",
      descriptionFa: "معاینه توسط پزشکان امدادگر.",
    },
    choiceB: {
      labelEn: "Celebrate full recovery with hot spiced cider!",
      labelFa: "با نوشیدنی گرم سیب و دارچین بهبودی کامل را جشن بگیرید!",
      descriptionFa: "عصرانه‌ای گرم برای جشن نجات.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Ben applied a flexible splint and wrapped Lisa's father's swollen ankle with an elastic bandage. The father stood up with the help of a walking pole, testing his weight. 'You have expert medical hands, young man,' the father thanked him warmly.",
    keywords: [
      { word: "splint", meaningFa: "آتل و تخته‌بندی پزشکی", phonetic: "/splɪnt/" },
      { word: "swollen", meaningFa: "متورم و ورم‌کرده", phonetic: "/ˈswəʊlən/" },
      { word: "elastic", meaningFa: "کشسان و انعطاف‌پذیر", phonetic: "/ɪˈlæstɪk/" },
    ],
    question: {
      promptEn: "What did Ben apply to the father's sprained ankle?",
      promptFa: "بن به مچ پای آسیب‌دیده پدر چه چیزی بست؟",
      options: ["A flexible splint and elastic bandage", "A heavy iron bar", "A piece of rope"],
      correctIndex: 0,
      hintSnippet: "applied a flexible splint and wrapped Lisa's father's swollen ankle",
      clueFa: "خط اول رو ببین! آتل انعطاف‌پذیر و باند کشی بست.",
    },
    choiceA: {
      labelEn: "Assist the father gently into the rescue sled behind the snowmobile!",
      labelFa: "به پدر کمک کنید سوار سورتمه پشت اسنوموبیل بشه!",
      descriptionFa: "سورتمه نرم بدون تکان دادن پا او را حمل می‌کنه.",
    },
    choiceB: {
      labelEn: "Award Ben the Mountain First-Aid Gold Star!",
      labelFa: "مدال ستاره طلای امداد و کمک‌های اولیه رو به بن اهدا کنید!",
      descriptionFa: "مهارت حرفه‌ای در شرایط بحرانی.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Arriving at the warm rescue station, the wood stove radiated cozy heat. Captain Mark wrapped everyone in oversized flannel robes. Lisa smiled gratefully: 'Today I saw what true courage and kindness look like.'",
    keywords: [{ word: "flannel", meaningFa: "پارچه نرم و گرم فلانل", phonetic: "/ˈflænl/" }],
    question: {
      promptEn: "What was waiting inside the rescue station?",
      promptFa: "داخل ایستگاه نجات چه چیزی منتظرشان بود؟",
      options: ["A warm wood stove and flannel robes", "A cold shower", "Darkness"],
      correctIndex: 0,
      hintSnippet: "the wood stove radiated cozy heat",
      clueFa: "بخاری هیزمی گرم و لباس‌های نرم فلانل.",
    },
    choiceA: {
      labelEn: "Award Ben the National Youth Life-Saving Cross!",
      labelFa: "نشان ملی نجات جان انسان‌ها را به بن اهدا کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Host a celebratory pancake dinner for the whole rescue squad!",
      labelFa: "شام پنکیک داغ برای کل تیم امداد برگزار کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The rescue helicopter landed smoothly on the cleared helipad. Flight medics whisked the hikers aboard for a routine health check. The chief paramedic saluted Ben and Barney: 'Remarkable job, rescuers!'",
    keywords: [{ word: "helipad", meaningFa: "سکوی فرود بالگرد", phonetic: "/ˈhelipæd/" }],
    question: {
      promptEn: "What vehicle landed on the cleared helipad?",
      promptFa: "چه وسیله‌ای روی سکو فرود آمد؟",
      options: ["The rescue helicopter", "A big truck", "An airplane"],
      correctIndex: 0,
      hintSnippet: "The rescue helicopter landed smoothly",
      clueFa: "بالگرد امداد و نجات فرود آمد.",
    },
    choiceA: {
      labelEn: "Fly co-pilot in the helicopter back to the regional valley base!",
      labelFa: "به عنوان کمک‌خلبان افتخاری در بالگرد پرواز کن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Wave as the helicopter ascends into the sunset clouds!",
      labelFa: "در حالی که بالگرد به سوی افق اوج می‌گیرد دست تکان بده!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Barney gnawed happily on the delicious beef jerky, wagging his massive bushy tail. Lisa sat beside him, gently stroking his ears: 'Barney, you are my guardian angel in the snow.'",
    keywords: [{ word: "gnawed", meaningFa: "با لذت گاز زد و جوید", phonetic: "/nɔːd/" }],
    question: {
      promptEn: "What did Lisa call Barney?",
      promptFa: "لیزا بارنی را چه نامید؟",
      options: ["'My guardian angel in the snow'", "A fast runner", "A wild wolf"],
      correctIndex: 0,
      hintSnippet: "my guardian angel in the snow",
      clueFa: "فرشته نجات من در میان برف‌ها.",
    },
    choiceA: {
      labelEn: "Crown Barney with an honorary gold collar of bravery!",
      labelFa: "قلاده طلایی شجاعت را به گردن بارنی بیندازید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Start the Saint Bernard Mountain Rescue Foundation!",
      labelFa: "بنیاد سگ‌های امدادگر سنت برنارد را تاسیس کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Walking down the mountain under clearing skies, the stars shone like diamonds over the snowy peaks. The danger was over, replaced by the profound peace of a successful mission.",
    keywords: [{ word: "profound", meaningFa: "عمیق، ماندگار و آرامش‌بخش", phonetic: "/prəˈfaʊnd/" }],
    question: {
      promptEn: "What shone like diamonds over the snowy peaks?",
      promptFa: "چه چیزی مثل الماس بالای قله‌های برفی می‌درخشید؟",
      options: ["The stars", "Street lights", "Campfires"],
      correctIndex: 0,
      hintSnippet: "the stars shone like diamonds",
      clueFa: "ستاره‌های آسمان شب.",
    },
    choiceA: {
      labelEn: "Sing a mountain triumph song on the walk home!",
      labelFa: "آهنگ پیروزی کوهستان را در مسیر بازگشت بخوانید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Record the mission details in the historic station logbook!",
      labelFa: "جزئیات عملیات را در دفترچه خاطرات امداد ثبت کن!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Inside the warm mountain hut, the hikers gathered around the stone fireplace. Lisa shared her travel sketchbook with Ben, and her father roasted marshmallows over the embers.",
    keywords: [{ word: "fireplace", meaningFa: "شومینه گرم هیزمی", phonetic: "/ˈfaɪəpleɪs/" }],
    question: {
      promptEn: "What did Lisa share with Ben inside the hut?",
      promptFa: "لیزا داخل کلبه چه چیزی را به بن نشان داد؟",
      options: ["Her travel sketchbook", "A bag of coins", "A mobile phone"],
      correctIndex: 0,
      hintSnippet: "shared her travel sketchbook with Ben",
      clueFa: "دفترچه طراحی سفرهایش را نشان داد.",
    },
    choiceA: {
      labelEn: "Draw a friendship portrait of Ben, Barney, and Lisa!",
      labelFa: "نقاشی پرتره یادگاری بن، بارنی و لیزا را بکشید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Plan a summer hiking expedition together to Eagle Lake!",
      labelFa: "یک اردوی تابستانه مشترک به دریاچه عقاب برنامه‌ریزی کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Coast guard radar confirmed that all mountain sectors were clear of danger. Captain Mark officially declared Operation Blizzard Shield a complete success, saluting Ben over the airwaves.",
    keywords: [{ word: "sectors", meaningFa: "بخش‌ها و نواحی کوهستان", phonetic: "/ˈsektəz/" }],
    question: {
      promptEn: "What operation was declared a complete success?",
      promptFa: "چه عملیاتی با موفقیت کامل به پایان رسید؟",
      options: ["Operation Blizzard Shield", "Operation Gold Hunt", "Operation Fast Run"],
      correctIndex: 0,
      hintSnippet: "Operation Blizzard Shield a complete success",
      clueFa: "عملیات 'سپر کولاک'.",
    },
    choiceA: {
      labelEn: "Receive an honorary junior commission in the mountain rescue corps!",
      labelFa: "حکم افتخاری افسر نوجوان سپاه امداد کوهستان را دریافت کن!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Broadcast safety advice on regional mountain radio for skiers!",
      labelFa: "نکات ایمنی طوفان را از رادیو برای اسکی‌بازان بازگو کن!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Walking under the crystal-clear night sky with Barney trotting proudly, Ben felt the deep satisfaction of knowing two people were safe because he chose to be brave.",
    keywords: [{ word: "satisfaction", meaningFa: "رضایت درونی و آرامش وجدان", phonetic: "/ˌsætɪsˈfækʃn/" }],
    question: {
      promptEn: "How did Ben feel as he walked home under the stars?",
      promptFa: "بن در مسیر بازگشت زیر ستاره‌ها چه حسی داشت؟",
      options: ["Deep satisfaction and pride", "Tired and bored", "Angry"],
      correctIndex: 0,
      hintSnippet: "felt the deep satisfaction of knowing two people were safe",
      clueFa: "رضایت و آرامش عمیق از نجات جان دو انسان.",
    },
    choiceA: {
      labelEn: "Write an inspiring essay on alpine rescue for your school journal!",
      labelFa: "مقاله الهام‌بخش امداد کوهستان را برای مجله مدرسه بنویس!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Sleep peacefully with Barney resting his big head on your bed!",
      labelFa: "با آرامش بخواب در حالی که بارنی سرش را روی تختت گذاشته!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The warm vegetable broth and fresh rolls were delicious. Around the kitchen table, Captain Mark, Lisa's family, and Ben toasted with mugs of apple juice, celebrating friendship born in a blizzard.",
    keywords: [{ word: "broth", meaningFa: "سوپ و آبگوشت سبزیجات معطر", phonetic: "/brɒθ/" }],
    question: {
      promptEn: "What did they drink around the kitchen table to celebrate?",
      promptFa: "سر میز آشپزخانه برای جشن چه نوشیدند؟",
      options: ["Mugs of warm apple juice", "Cold milk", "Coffee"],
      correctIndex: 0,
      hintSnippet: "toasted with mugs of apple juice",
      clueFa: "ماگ‌های آب‌سیب گرم نوشیدند.",
    },
    choiceA: {
      labelEn: "Make the Blizzard Reunion an annual family tradition!",
      labelFa: "دیدار سالانه یادبود کولاک را به یک رسم خانوادگی تبدیل کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Bake a big beef cake for Barney's upcoming birthday!",
      labelFa: "یک کیک گوشتی خوشمزه برای تولد بارنی بپزید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The storm passed after three hours, leaving the mountain wrapped in silent, sparkling snow. When the sun broke through, the rescue team emerged to a breathtaking landscape of winter wonder.",
    keywords: [{ word: "breathtaking", meaningFa: "نفس‌گیر و حیرت‌انگیز", phonetic: "/ˈbreθteɪkɪŋ/" }],
    question: {
      promptEn: "What did the mountain look like when the sun broke through?",
      promptFa: "وقتی آفتاب بیرون آمد کوهستان چه شکلی شد؟",
      options: ["A breathtaking landscape of winter wonder", "Dark and scary", "Flooded with water"],
      correctIndex: 0,
      hintSnippet: "a breathtaking landscape of winter wonder",
      clueFa: "منظره‌ای نفس‌گیر از شگفتی و زیبایی زمستان.",
    },
    choiceA: {
      labelEn: "Take a panoramic victory photo on the sparkling snowfield!",
      labelFa: "عکس یادگاری پانوراما در دشت برفی درخشان بگیرید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Lead the skiers safely back down to the resort lodge!",
      labelFa: "اسکی‌بازان را با آرامش به سمت هتل استراحتگاه راهنمایی کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The snowmobile glided into the resort village. Dozens of tourists clapped and cheered as Lisa and her father stepped out safe and sound. The resort hotel offered Ben a lifetime pass for free winter stays.",
    keywords: [{ word: "safe and sound", meaningFa: "صحیح و سالم", phonetic: "/seɪf ənd saʊnd/" }],
    question: {
      promptEn: "What did the resort hotel offer Ben?",
      promptFa: "هتل پیست اسکی چه پاداشی به بن اهدا کرد؟",
      options: ["A lifetime pass for free winter stays", "A pair of socks", "A ticket"],
      correctIndex: 0,
      hintSnippet: "a lifetime pass for free winter stays",
      clueFa: "اقامت رایگان مادام‌العمر در فصل زمستان.",
    },
    choiceA: {
      labelEn: "Teach mountain safety classes to young winter vacationers!",
      labelFa: "کلاس‌های ایمنی کوهستان را برای مسافران نوجوان تدریس کن!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Dedicate the award to volunteer mountain rescue teams everywhere!",
      labelFa: "جایزه را به تمام تیم‌های داوطلب امداد کوهستان تقدیم کن!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The snowmobile reached the highway where an ambulance was waiting. Emergency doctors quickly examined Lisa and her father, declaring them in excellent health thanks to the rapid rescue.",
    keywords: [{ word: "rapid", meaningFa: "سریع و به موقع", phonetic: "/ˈræpɪd/" }],
    question: {
      promptEn: "Where was the ambulance waiting?",
      promptFa: "آمبولانس کجا منتظر بود؟",
      options: ["At the highway", "On the peak", "Inside a cave"],
      correctIndex: 0,
      hintSnippet: "reached the highway where an ambulance was waiting",
      clueFa: "کنار جاده اصلی منتظر بود.",
    },
    choiceA: {
      labelEn: "Shake hands with the emergency doctors and salute their service!",
      labelFa: "با پزشکان امداد دست بده و به زحماتشان ادای احترام کن!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Ride the snowmobile back to basecamp under glowing sunrise skies!",
      labelFa: "با اسنوموبیل زیر نور طلوع آفتاب به پایگاه برگردید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The rescue convoy of four snow vehicles formed an escort down the winding mountain pass. Sirens gave cheerful blips of victory, echoing through the pine valley as dawn broke.",
    keywords: [{ word: "convoy", meaningFa: "کاروان خودروهای امدادی", phonetic: "/ˈkɒnvɔɪ/" }],
    question: {
      promptEn: "What formed an escort down the mountain pass?",
      promptFa: "چه چیزی کاروان اسکورت را در گردنه کوهستان تشکیل داد؟",
      options: ["The rescue convoy of four snow vehicles", "A train", "Three buses"],
      correctIndex: 0,
      hintSnippet: "The rescue convoy of four snow vehicles formed an escort",
      clueFa: "کاروان چهار خودروی برف‌پیما.",
    },
    choiceA: {
      labelEn: "Lead the rescue convoy through the town square to cheers!",
      labelFa: "کاروان نجات را با هلهله مردم از میدان شهر عبور بده!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Park the snowmobile neatly ready for future emergency calls!",
      labelFa: "اسنوموبیل را تمیز و آماده مأموریت‌های بعدی در گاراژ پارک کن!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "At the medical chalet, Lisa rested comfortably under wool duvets while doctors confirmed zero frostbite. Her father raised a mug of hot tea: 'Ben and Barney are the guardians of Eagle Peak.'",
    keywords: [{ word: "duvets", meaningFa: "لحاف‌های نرم و گرم", phonetic: "/ˈduːveɪz/" }],
    question: {
      promptEn: "What did doctors confirm about Lisa?",
      promptFa: "پزشکان چه چیزی را درباره سلامتی لیزا تأیید کردند؟",
      options: ["Zero frostbite", "Serious fever", "Broken leg"],
      correctIndex: 0,
      hintSnippet: "confirmed zero frostbite",
      clueFa: "تأیید کردند هیچ سرمازدگی ندارد و کاملاً سالمه.",
    },
    choiceA: {
      labelEn: "Receive a permanent seat on the Alpine Safety Board!",
      labelFa: "عضویت دائمی هیئت ایمنی کوهستان را به دست بیاور!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Equip all mountain chalets with emergency beacon kits!",
      labelFa: "همه کلبه‌های کوهستان را به کیت‌های ردیاب مجهز کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Sitting before the chalet fire, Lisa and Ben sipped hot spiced apple cider. The sweet aroma of cinnamon filled the room as they shared stories about school, hobbies, and animal training.",
    keywords: [{ word: "spiced", meaningFa: "معطر با دارچین و ادویه‌جات خوشبو", phonetic: "/spaɪst/" }],
    question: {
      promptEn: "What filled the room as they sipped hot cider?",
      promptFa: "وقتی آب‌سیب می‌نوشیدند اتاق با چه عطری پر شد؟",
      options: ["The sweet aroma of cinnamon", "Wood smoke", "Cold snow"],
      correctIndex: 0,
      hintSnippet: "The sweet aroma of cinnamon filled the room",
      clueFa: "عطر شیرین دارچین.",
    },
    choiceA: {
      labelEn: "Exchange friendship bracelets woven from rescue cord!",
      labelFa: "دستبندهای دوستی بافته‌شده از طناب نجات با هم ردوبدل کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Form the Junior Alpine Friendship Society!",
      labelFa: "انجمن دوستی جوانان کوهنورد را پایه‌گذاری کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Towed safely behind the snowmobile, Lisa's father arrived at the clinic without any pain. Doctors fitted a lightweight walking cast, praising Ben's textbook first-aid splinting technique.",
    keywords: [{ word: "textbook", meaningFa: "نمونه و بی‌نقص مثل کتاب‌های درسی", phonetic: "/ˈtekstbʊk/" }],
    question: {
      promptEn: "What did doctors praise about Ben's work?",
      promptFa: "پزشکان از چه چیزی در کار بن تمجید کردند؟",
      options: ["His textbook first-aid splinting technique", "His singing voice", "His hat"],
      correctIndex: 0,
      hintSnippet: "praising Ben's textbook first-aid splinting technique",
      clueFa: "تکنیک آتل‌بندی امدادی بی‌نقص و مثل کتاب درسی.",
    },
    choiceA: {
      labelEn: "Publish a First-Aid for Young Rescuers manual!",
      labelFa: "کتابچه راهنمای کمک‌های اولیه برای امدادگران نوجوان را منتشر کن!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Conduct live rescue demonstrations at national park fairs!",
      labelFa: "مانورهای زنده امداد و نجات را در نمایشگاه‌های پارک ملی اجرا کن!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The State Medical Board awarded Ben the Mountain First-Aid Gold Star, while Barney received a medal of valor. Standing side-by-side under the morning sun, boy and dog symbolized the best of courage.",
    keywords: [{ word: "valor", meaningFa: "دلاوری، شجاعت و فداکاری", phonetic: "/ˈvælər/" }],
    question: {
      promptEn: "What medal did Barney receive from the State Medical Board?",
      promptFa: "بارنی چه مدالی از انجمن پزشکی دریافت کرد؟",
      options: ["A medal of valor", "A wooden toy", "A biscuit"],
      correctIndex: 0,
      hintSnippet: "Barney received a medal of valor",
      clueFa: "مدال دلاوری و شجاعت را گرفت.",
    },
    choiceA: {
      labelEn: "Frame the two medals on the rescue station wall of honor!",
      labelFa: "هر دو مدال را در تالار افتخارات ایستگاه امداد قاب کنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Look out across the snowy peaks, ready for whatever tomorrow brings!",
      labelFa: "به افق قله‌های برفی نگاه کن، آماده برای هر ماجراجویی نو!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The National Life-Saving Cross", titleFa: "نشان ملی نجات‌غریق کوهستان", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان افسانه‌ای", climaxEn: "The state governor pins the golden Life-Saving Cross on Ben's jacket, broadcast live across the country.", climaxFa: "استاندار نشان طلای نجات جان را به کاپشن بن زد و این مراسم در سراسر کشور پخش شد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Rescuers' Pancake Feast", titleFa: "جشن پنکیک داغ امدادگران", badgeCategory: "funny", badgeIcon: "🥞", badgeNameFa: "پایان شیرین و صمیمی", climaxEn: "Towers of golden pancakes and hot maple syrup bring joyful laughter to the whole rescue crew.", climaxFa: "برج‌های پنکیک داغ با شربت افرا خنده‌های شاد را به ایستگاه امداد آورد.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "Flight of the Silver Helo", titleFa: "پرواز بر فراز دره سپید", badgeCategory: "explorer", badgeIcon: "🚁", badgeNameFa: "پایان پروازی", climaxEn: "Soaring high in the cockpit beside the flight captain, Ben watches snowy peaks gleam in sunlight.", climaxFa: "در کابین خلبان بالگرد، بن قله‌های برفی درخشان زیر نور خورشید را تماشا کرد.", xpReward: 185 },
  { pathCode: "AAABB", titleEn: "Sunset on Eagle Peak", titleFa: "غروب طلایی قله عقاب", badgeCategory: "heroic", badgeIcon: "🌄", badgeNameFa: "پایان باشکوه", climaxEn: "The helicopter vanishes into crimson clouds, leaving peace and safety across the mountain.", climaxFa: "بالگرد در میان ابرهای ارغوانی غروب دور شد و امنیت را در کوهستان به جا گذاشت.", xpReward: 175 },
  { pathCode: "AABAA", titleEn: "Barney's Golden Collar of Valor", titleFa: "قلاده زرین شجاعت بارنی", badgeCategory: "legendary", badgeIcon: "🐕", badgeNameFa: "پایان افتخار حیوانات", climaxEn: "Barney's gold medal tinkles proudly against his bell, making him the most celebrated dog in the state.", climaxFa: "مدال طلای بارنی کنار زنگوله‌اش صدا می‌دهد و او را محبوب‌ترین هاپوی امدادگر ایالت کرد.", xpReward: 200 },
  { pathCode: "AABAB", titleEn: "The Saint Bernard Legacy", titleFa: "بنیاد سگ‌های نجات کوهستان", badgeCategory: "scholar", badgeIcon: "🐶", badgeNameFa: "پایان ماندگار", climaxEn: "Over thirty Saint Bernard puppies are trained annually, saving hundreds of lost winter hikers.", climaxFa: "سالانه بیش از سی سگ امدادگر آموزش می‌بینند و جان صدها کوهنورد را نجات می‌دهند.", xpReward: 190 },
  { pathCode: "AABBA", titleEn: "The Song of the Summit Rescuers", titleFa: "ترانه دلاوران قله", badgeCategory: "heroic", badgeIcon: "🎶", badgeNameFa: "پایان افتخارآمیز", climaxEn: "Their rhythmic mountain cadence echoes down the valley, celebrating bravery that conquers storms.", climaxFa: "سرود ریتمیک شجاعت بچه‌ها در دره طنین انداخت و نماد پیروزی بر کولاک شد.", xpReward: 180 },
  { pathCode: "AABBB", titleEn: "The Log of Golden Heroes", titleFa: "دفترچه زرین عملیات امداد", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان ثبت افتخار", climaxEn: "Ben's written report becomes required reading in the state mountain rescue training curriculum.", climaxFa: "گزارش عملیات بن در جزوه درسی رسمی آموزش تمام امدادگران کوهستان کشور قرار گرفت.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Friendship Sketch of Frosty Ridge", titleFa: "طرح پرتره دوستی تیغه یخی", badgeCategory: "legendary", badgeIcon: "🎨", badgeNameFa: "پایان هنری و ماندگار", climaxEn: "Lisa's drawing of Ben and Barney standing in the snowstorm hangs permanently in the alpine club.", climaxFa: "نقاشی لیزا از بن و بارنی در میان کولاک برای همیشه در باشگاه کوهنوردی نصب شد.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "The Summer Ridge Expedition", titleFa: "اردوی تابستانه دریاچه عقاب", badgeCategory: "explorer", badgeIcon: "🏕️", badgeNameFa: "پایان ماجراجویانه", climaxEn: "Six months later, Lisa and Ben hike to the sparkling lake under warm sun, celebrating true friendship.", climaxFa: "شش ماه بعد در زیر آفتاب تابستان، لیزا و بن به دریاچه رفتند و دوستی‌شان را جشن گرفتند.", xpReward: 180 },
  { pathCode: "ABABA", titleEn: "The Junior Alpine Commission", titleFa: "حکم افسر نوجوان امداد کوهستان", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان رسمی و باوقار", climaxEn: "Ben is appointed the youngest honorary safety officer in the state search-and-rescue history.", climaxFa: "بن به عنوان جوان‌ترین افسر افتخاری ایمنی در تاریخ امداد و نجات ایالت منصوب شد.", xpReward: 195 },
  { pathCode: "ABABB", titleEn: "The Radio Voice of Mountain Safety", titleFa: "صدای رادیویی محافظان کوهستان", badgeCategory: "scholar", badgeIcon: "📻", badgeNameFa: "پایان آگاهی‌بخش", climaxEn: "Ben's weekly safety broadcasts help thousands of weekend skiers avoid avalanche zones.", climaxFa: "برنامه‌های رادیویی هفتگی بن جان هزاران اسکی‌باز را از خطرات بهمن نجات داد.", xpReward: 175 },
  { pathCode: "ABBAA", titleEn: "The School Alpine Essay Prize", titleFa: "جایزه بزرگ مقاله کوهستان مدرسه", badgeCategory: "scholar", badgeIcon: "🏆", badgeNameFa: "پایان ادبی", climaxEn: "Ben's moving story of the rescue wins the Governor's Youth Writing Award with top honors.", climaxFa: "روایت پرشور بن از عملیات نجات برنده جایزه نویسندگی نوجوانان استاندار شد.", xpReward: 185 },
  { pathCode: "ABBAB", titleEn: "The Rest of the Brave", titleFa: "خواب آرام دلاوران", badgeCategory: "funny", badgeIcon: "🛌", badgeNameFa: "پایان صمیمی و شیرین", climaxEn: "Curled under warm blankets with Barney softly snoring beside him, Ben sleeps the sleep of a hero.", climaxFa: "زیر پتوهای گرم در حالی که بارنی آرام خروپف می‌کرد، بن با وجدانی آسوده خوابید.", xpReward: 165 },
  { pathCode: "ABBBA", titleEn: "The Annual Blizzard Gathering", titleFa: "دیدار سالانه یادبود طوفان", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان خانوادگی", climaxEn: "Every December, Lisa's family returns to the station to bake cookies and celebrate life with Ben.", climaxFa: "هر آذرماه خانواده لیزا به ایستگاه می‌آیند تا کلوچه بپزند و نجات جانشان را جشن بگیرند.", xpReward: 190 },
  { pathCode: "ABBBB", titleEn: "Barney's Giant Beef Cake", titleFa: "کیک گوشت غول‌پیکر بارنی", badgeCategory: "funny", badgeIcon: "🥩", badgeNameFa: "پایان بامزه و لذیذ", climaxEn: "Barney wags his tail so hard he knocks over a chair, devouring his savory birthday meat cake.", climaxFa: "بارنی از ذوق کیک تولد گوشتی‌اش دمش را چنان تکان داد که همه از خنده غش کردند.", xpReward: 160 },
  { pathCode: "BAAAA", titleEn: "The Winter Wonder Panorama", titleFa: "تصویر پانورامای شگفتی زمستان", badgeCategory: "legendary", badgeIcon: "📷", badgeNameFa: "پایان عکاسی باشکوه", climaxEn: "The rescue photo of Ben, dog, and snowmobile wins the National Geographic Youth Photo Award.", climaxFa: "عکس پرشکوه بن، بارنی و اسنوموبیل برنده جایزه عکاسی نوجوانان نشنال جئوگرافیک شد.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Ski Lodge Safe Escort", titleFa: "راهنمای امن هتل کوهستان", badgeCategory: "heroic", badgeIcon: "🎿", badgeNameFa: "پایان یاری‌رسان", climaxEn: "Tourists cheer wildly as Ben guides fifty stranded skiers to warm hearths and hot cocoa.", climaxFa: "گردشگران با هلهله بن را تشویق کردند که پنجاه اسکی‌باز را به گرمای هتل رساند.", xpReward: 185 },
  { pathCode: "BAABA", titleEn: "The Alpine Resort Lifetime Pass", titleFa: "کارت طلایی مادام‌العمر پیست", badgeCategory: "legendary", badgeIcon: "🎫", badgeNameFa: "پایان پاداش بزرگ", climaxEn: "Ben and his family enjoy free winter ski chalets for life, honored as the valley's guardian.", climaxFa: "بن و خانواده‌اش کارت اقامت طلایی رایگان مادام‌العمر در پیست اسکی را هدیه گرفتند.", xpReward: 195 },
  { pathCode: "BAABB", titleEn: "The Tribute to Mountain Volunteers", titleFa: "یادبود فرشتگان داوطلب کوه", badgeCategory: "scholar", badgeIcon: "🏔️", badgeNameFa: "پایان احترام و قدردانی", climaxEn: "Ben donates his prize to buy rescue snowmobiles for mountain volunteer crews statewide.", climaxFa: "بن جایزه‌اش را برای خرید اسنوموبیل برای تیم‌های داوطلب امداد کوهستان اهدا کرد.", xpReward: 180 },
  { pathCode: "BABA", titleEn: "The Handshake of Healing", titleFa: "دست در دست فرشتگان نجات", badgeCategory: "heroic", badgeIcon: "🚑", badgeNameFa: "پایان باوقار", climaxEn: "Paramedics praise the timely rescue that saved two hikers from severe frostbite and hypothermia.", climaxFa: "پزشکان اورژانس از سرعت عمل نجات که مانع هرگونه سرمازدگی شد تقدیر کردند.", xpReward: 185 },
  { pathCode: "BABB", titleEn: "Sunrise over the Snowfields", titleFa: "طلوع آفتاب بر دشت‌های برفی", badgeCategory: "explorer", badgeIcon: "🌅", badgeNameFa: "پایان درخشان", climaxEn: "Driving the snowmobile into the golden dawn, Ben feels the warmth of a completed mission.", climaxFa: "با راندن اسنوموبیل در طلوع طلایی آفتاب، بن گرمای یک مأموریت موفق را حس کرد.", xpReward: 175 },
  { pathCode: "BABBA", titleEn: "The Escort of Victory", titleFa: "رژه پیروزی کاروان امداد", badgeCategory: "heroic", badgeIcon: "🚨", badgeNameFa: "پایان پرشور", climaxEn: "Sirens chirp happily as citizens line the streets waving flags to welcome the brave rescuers.", climaxFa: "مردم با پرچم در خیابان‌ها ایستادند و با سوت و دست به کاروان نجات خوش‌آمد گفتند.", xpReward: 185 },
  { pathCode: "BABBB", titleEn: "Always Prepared for Tomorrow", titleFa: "همیشه آماده برای فداکاری", badgeCategory: "scholar", badgeIcon: "🔧", badgeNameFa: "پایان باانضباط", climaxEn: "The snowmobile rests fueled, cleaned, and polished in the bay, ready whenever the radio calls.", climaxFa: "اسنوموبیل تمیز، پربنزین و براق در گاراژ پارک شد، آماده برای ندای امداد بعدی.", xpReward: 170 },
  { pathCode: "BBAAA", titleEn: "The Alpine Safety Council Seat", titleFa: "کرسی دائمی شورای ایمنی", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان خدمت ملی", climaxEn: "Ben advises regional authorities on implementing smarter avalanche warning networks.", climaxFa: "بن به مشاور رسمی مدیریت بحران برای نصب سیستم‌های هوشمند هشدار بهمن بدل شد.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Universal Beacon Network", titleFa: "شبکه سراسری ردیاب‌های کوه", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان فناوری ایمنی", climaxEn: "Every alpine shelter is equipped with satellite emergency beacons thanks to Ben's drive.", climaxFa: "تمام پناهگاه‌های کوهستان با پویش بن به فرستنده‌های ماهواره‌ای امداد مجهز شدند.", xpReward: 185 },
  { pathCode: "BBABA", titleEn: "The Rescue Cord Bracelet", titleFa: "دستبند بافته از طناب نجات", badgeCategory: "heroic", badgeIcon: "🪢", badgeNameFa: "پایان دوستی پایدار", climaxEn: "Lisa and Ben wear matching paracord bracelets, reminding them that courage overcomes fear.", climaxFa: "لیزا و بن دستبندهای طناب نجات به دست کردند، یادآور این‌که شجاعت بر هر ترسی پیروز است.", xpReward: 175 },
  { pathCode: "BBABB", titleEn: "The Young Mountaineers Fellowship", titleFa: "انجمن نوجوانان کوهنورد شجاع", badgeCategory: "explorer", badgeIcon: "🤝", badgeNameFa: "پایان همبستگی", climaxEn: "The youth club trains hundreds in wilderness navigation, making mountains safe for all.", climaxFa: "باشگاه صدها نوجوان را در جهت‌یابی کوهستان آموزش داد و مسیرها را امن ساخت.", xpReward: 180 },
  { pathCode: "BBBAA", titleEn: "The Junior First-Aid Manual", titleFa: "کتابچه راهنمای کمک‌های اولیه کوه", badgeCategory: "legendary", badgeIcon: "📕", badgeNameFa: "پایان علمی و آموزشی", climaxEn: "Ben's illustrated pocket guide is carried by scout troops across thirty countries.", climaxFa: "کتابچه جیبی کمک‌های اولیه بن در جیب پیش‌آهنگان سی کشور جهان قرار گرفت.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Live Avalanche Drill Star", titleFa: "ستاره مانور زنده امداد بهمن", badgeCategory: "heroic", badgeIcon: "⭐", badgeNameFa: "پایان الگوی عملی", climaxEn: "Thousands watch Ben and Barney demonstrate snow-burrow extraction at the national expo.", climaxFa: "هزاران نفر مانور زنده نجات از بهمن بن و بارنی را با تشویق پرشور تماشا کردند.", xpReward: 185 },
  { pathCode: "BBBBA", titleEn: "The Hall of Mountain Valor", titleFa: "تالار افتخارات شجاعت کوهستان", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان جاودانه", climaxEn: "The gold medals of boy and dog shine in the station, inspiring generations of future rescuers.", climaxFa: "مدال‌های طلای بن و بارنی در ایستگاه درخشیدند و الهام‌بخش امدادگران آینده شدند.", xpReward: 190 },
  { pathCode: "BBBBB", titleEn: "The Guardians of the High Peaks", titleFa: "پاسداران سرافراز قله‌های برفی", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Standing tall beside loyal Barney, looking out over the magnificent snowy ridges under the winter sun, Ben knows that true heroism is choosing to care when others need help most.", climaxFa: "در کنار سگ باوفایش بارنی بر فراز قله‌های برفی در زیر نور خورشید ایستاد و دانست قهرمانی واقعی یعنی فداکاری و یاری رساندن در سخت‌ترین لحظات زندگی.", xpReward: 200 },
];

export const story5BlizzardRescue: AdventureStory = buildAdventureStory({
  id: "a2-blizzard-rescue",
  storyIndex: 5,
  cefr: "A2",
  titleEn: "The Blizzard Mountain Rescue",
  titleFa: "عملیات نجات در کولاک کوهستان",
  genre: "rescue",
  genreLabelFa: "🏔️ هیجان و نجات‌بخشی",
  genreIcon: "🏔️",
  synopsisEn:
    "A fierce winter blizzard traps two hikers on Eagle Mountain. Eleven-year-old rescuer Ben and his loyal Saint Bernard dog Barney set out into the storm. Snowshoe through the pines or ride the rescue snowmobile across 32 heroic endings!",
  synopsisFa:
    "یک کولاک سهمگین دو کوهنورد را در کوهستان عقاب محاصره کرده است. بن، امدادگر نوجوان، به همراه سگ باوفایش بارنی آماده نجات می‌شوند. آیا با راکت‌های برفی از دل جنگل کاج می‌روی یا با اسنوموبیل پرسرعت؟ ۳۲ پایان پر از هیجان و فداکاری در انتظار توست!",
  coverImage: "/images/skills/reading/a2-blizzard-rescue.webp",
  nodes,
  endings,
});
