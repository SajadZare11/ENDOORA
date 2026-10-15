import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1 (A2): The Great Cake Catastrophe (ماجرای خنده‌دار کیک تولد)
// Genre: Humor & Everyday Life (طنز و روزمره)
// CEFR: A2 (Past simple & continuous, conjunctions, everyday life vocabulary)
// Characters: Emma, Oliver, Mom, Dad, Mr. Watson
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "It was Saturday morning, and Mom was at the supermarket. Emma and her younger brother Oliver had a secret plan. 'Today is Mom's birthday! Let us bake a huge surprise chocolate cake,' Emma said excitedly. Oliver put on a funny chef's hat that fell over his eyes. They found Mom's big recipe book on the kitchen counter, but the cake recipe had sticky chocolate marks over the ingredients list.",
    keywords: [
      { word: "supermarket", meaningFa: "سوپرمارکت", phonetic: "/ˈsuːpəmɑːkɪt/" },
      { word: "surprise", meaningFa: "غافلگیری / سورپرایز", phonetic: "/səˈpraɪz/" },
      { word: "recipe", meaningFa: "دستور پخت", phonetic: "/ˈresəpi/" },
      { word: "ingredients", meaningFa: "مواد لازم برای آشپزی", phonetic: "/ɪnˈɡriːdiənts/" },
    ],
    question: {
      promptEn: "Why did Emma and Oliver want to bake a cake?",
      promptFa: "چرا اِما و اولیور می‌خواستند کیک بپزند؟",
      options: ["Because it was Mom's birthday", "Because school was closed", "Because they were bored"],
      correctIndex: 0,
      hintSnippet: "Today is Mom's birthday! Let us bake a huge surprise chocolate cake",
      clueFa: "خط سوم رو ببین دوست خوبم! امروز تولد مامان بود و می‌خواستن سورپرایزش کنن.",
    },
    choiceA: {
      labelEn: "Follow the sticky chocolate recipe carefully!",
      labelFa: "دستور پخت شکلاتی رو با دقت بخون و شروع کن!",
      descriptionFa: "شاید بتونید کلمات پاک‌شده رو حدس بزنید.",
    },
    choiceB: {
      labelEn: "Ask Dad in the garage for baking advice!",
      labelFa: "از بابا که تو پارکینگه کمک و راهنمایی بخواه!",
      descriptionFa: "بابا همیشه ایده‌های جالب و خنده‌دار داره.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Emma measured two cups of white flour while Oliver tried to open the baking cocoa. Suddenly, the cocoa box slipped from his hands! A giant brown dust cloud exploded into the air: Poof! Oliver sneezed loudly, and flour flew across the table like a winter snowstorm. Both kids looked at each other and burst into laughter because they looked like two walking snowmen.",
    keywords: [
      { word: "measured", meaningFa: "اندازه گرفت / پیمانه زد", phonetic: "/ˈmeʒəd/" },
      { word: "slipped", meaningFa: "سر خورد و افتاد", phonetic: "/slɪpt/" },
      { word: "sneezed", meaningFa: "عطسه کرد", phonetic: "/sniːzd/" },
      { word: "snowstorm", meaningFa: "کولاک برف", phonetic: "/ˈsnəʊstɔːm/" },
    ],
    question: {
      promptEn: "What happened when the cocoa box slipped?",
      promptFa: "وقتی جعبه کاکائو لیز خورد چه اتفاقی افتاد؟",
      options: ["A giant dust cloud exploded", "A glass broke loudly", "Water spilled on the floor"],
      correctIndex: 0,
      hintSnippet: "A giant brown dust cloud exploded into the air",
      clueFa: "خط سوم رو بخون عزیزم! گرد کاکائو مثل یک ابر قهوه‌ای تو هوا پخش شد.",
    },
    choiceA: {
      labelEn: "Clean up the flour storm before continuing the batter!",
      labelFa: "اول طوفان آرد رو تمیز کنید بعد خمیر رو هم بزنید!",
      descriptionFa: "تا مامان نیومده باید آشپزخونه تمیز بشه.",
    },
    choiceB: {
      labelEn: "Add milk and honey quickly to save the batter!",
      labelFa: "سریع شیر و عسل اضافه کن تا خمیر خراب نشه!",
      descriptionFa: "مخلوط کردن سریع شاید کیک رو نجات بده.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Emma ran to the garage where Dad was fixing his old green bicycle. Dad smiled and wiped grease from his hands. 'Baking is like engineering,' Dad said proudly. 'We need eggs, sugar, and good teamwork!' Dad marched into the kitchen like a general, wearing Mom's pink floral apron over his overalls.",
    keywords: [
      { word: "fixing", meaningFa: "تعمیر کردن", phonetic: "/ˈfɪksɪŋ/" },
      { word: "engineering", meaningFa: "مهندسی و طراحی دقیق", phonetic: "/ˌendʒɪˈnɪərɪŋ/" },
      { word: "apron", meaningFa: "پیش‌بند آشپزی", phonetic: "/ˈeɪprən/" },
    ],
    question: {
      promptEn: "What was Dad wearing when he marched into the kitchen?",
      promptFa: "بابا وقتی با ژست اومد تو آشپزخونه چی تنش بود؟",
      options: ["Mom's pink floral apron", "A yellow raincoat", "A leather jacket"],
      correctIndex: 0,
      hintSnippet: "wearing Mom's pink floral apron over his overalls",
      clueFa: "خط آخر رو نگاه کن! پیش‌بند صورتی گل‌گلی مامان رو بسته بود.",
    },
    choiceA: {
      labelEn: "Let Dad crack six fresh eggs with his fast trick!",
      labelFa: "بذار بابا با شیرین‌کاری تخم‌مرغ‌ها رو بشکنه!",
      descriptionFa: "بابا ادعا می‌کنه با یک دست تخم‌مرغ می‌شکنه.",
    },
    choiceB: {
      labelEn: "Check the kitchen fridge for fresh strawberries!",
      labelFa: "توی یخچال رو برای پیدا کردن توت‌فرنگی تازه بگرد!",
      descriptionFa: "کیک شکلاتی با توت‌فرنگی فوق‌العاده می‌شه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Oliver grabbed the vacuum cleaner, but he accidentally pushed the reverse button. Whoosh! The vacuum blew the flour high onto the ceiling fan! When Emma switched on the fan by mistake, white flour rained gently over the whole room. Oliver laughed so hard that his tummy hurt. 'Emma, we made an indoor ski resort!' he shouted.",
    keywords: [
      { word: "vacuum cleaner", meaningFa: "جاروبرقی", phonetic: "/ˈvækjuːm kliːnər/" },
      { word: "ceiling fan", meaningFa: "پنکه سقفی", phonetic: "/ˈsiːlɪŋ fæn/" },
      { word: "resort", meaningFa: "پیست تفریحی و استراحتگاه", phonetic: "/rɪˈzɔːt/" },
    ],
    question: {
      promptEn: "What happened when Emma switched on the ceiling fan?",
      promptFa: "وقتی اِما اشتباهی پنکه سقفی رو روشن کرد چی شد؟",
      options: ["Flour rained gently over the room", "The light went out", "The window shattered"],
      correctIndex: 0,
      hintSnippet: "white flour rained gently over the whole room",
      clueFa: "خط سوم رو ببین مهربونم! آردها مثل بارون سفید از سقف ریختن پایین.",
    },
    choiceA: {
      labelEn: "Use paper towels to wipe the kitchen sparkling clean!",
      labelFa: "با دستمال و آب کل آشپزخونه رو تمیز و براق کنید!",
      descriptionFa: "یک کار تیمی سریع برای غافلگیر نشدن توسط مامان.",
    },
    choiceB: {
      labelEn: "Turn the messy dough into chocolate cookies instead!",
      labelFa: "خمیر رو به کلوچه‌های شکلاتی خوشمزه تبدیل کنید!",
      descriptionFa: "کلوچه سریع‌تر از کیک آماده و پخته می‌شه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Emma poured whole milk into the bowl while Oliver added golden honey. The batter became smooth, dark, and shiny like melted chocolate. Oliver tasted a spoonful and licked his lips. 'This tastes better than ice cream!' he cheered. But the batter was growing so thick that Emma's wooden spoon stood straight up by itself.",
    keywords: [
      { word: "batter", meaningFa: "مایه کیک / خمیر روان", phonetic: "/ˈbætər/" },
      { word: "spoonful", meaningFa: "یک قاشق پر", phonetic: "/ˈspuːnfʊl/" },
      { word: "melted", meaningFa: "آب‌شده و روان", phonetic: "/ˈmeltɪd/" },
    ],
    question: {
      promptEn: "What stood straight up in the thick batter?",
      promptFa: "چه چیزی توی مایه غلیظ کیک صاف ایستاد؟",
      options: ["Emma's wooden spoon", "A metal fork", "A birthday candle"],
      correctIndex: 0,
      hintSnippet: "Emma's wooden spoon stood straight up by itself",
      clueFa: "خط آخر رو نگاه کن! قاشق چوبی اِما خودش صاف ایستاد.",
    },
    choiceA: {
      labelEn: "Pour the thick batter into a giant star-shaped pan!",
      labelFa: "مایه غلیظ رو توی قالب ستاره‌ای بزرگ بریزید!",
      descriptionFa: "کیک به شکل ستاره طلایی درمیاد.",
    },
    choiceB: {
      labelEn: "Ask friendly neighbor Mr. Watson for vanilla extract!",
      labelFa: "از آقای واتسون همسایه مهربان عصاره وانیل بگیر!",
      descriptionFa: "وانیل تازه عطر کیک رو بی‌نظیر می‌کنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Dad tapped the first egg on the counter edge with flair. Crack! The egg white flew into the bowl, but a yellow yolk landed right on Oliver's nose! Oliver crossed his eyes to look at the yellow yolk and giggled. Dad wiped Oliver's nose with a paper napkin. 'First law of baking: never panic,' Dad announced happily.",
    keywords: [
      { word: "flair", meaningFa: "ژست هنرمندانه و نمایشی", phonetic: "/fleər/" },
      { word: "yolk", meaningFa: "زرده تخم‌مرغ", phonetic: "/jəʊk/" },
      { word: "panic", meaningFa: "هول شدن و دستپاچگی", phonetic: "/ˈpænɪk/" },
    ],
    question: {
      promptEn: "Where did the yellow egg yolk land?",
      promptFa: "زرده تخم‌مرغ کجا فرود اومد؟",
      options: ["Right on Oliver's nose", "On Dad's shoe", "In the garbage"],
      correctIndex: 0,
      hintSnippet: "a yellow yolk landed right on Oliver's nose",
      clueFa: "خط دوم رو ببین! زرده صاف نشست روی نوک دماغ اولیور.",
    },
    choiceA: {
      labelEn: "Mix the remaining five eggs carefully with a whisk!",
      labelFa: "بقیه تخم‌مرغ‌ها رو با همزن دستی آروم مخلوط کن!",
      descriptionFa: "هم زدن آروم باعث می‌شه کیک پف کنه.",
    },
    choiceB: {
      labelEn: "Preheat the oven and set a musical timer!",
      labelFa: "فر رو روشن کن و تایمر موزیکال بذار!",
      descriptionFa: "گرم شدن فر مهم‌ترین راز پختنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Emma opened the fridge and found a basket of bright red strawberries and sweet blueberries. Oliver wanted to decorate the cake like a colorful garden. Dad stirred melted butter into the chocolate mixture. The kitchen smelled like the sweetest bakery in Paris.",
    keywords: [
      { word: "basket", meaningFa: "سبد میوه", phonetic: "/ˈbɑːskɪt/" },
      { word: "blueberries", meaningFa: "بلوبری‌های شیرین", phonetic: "/ˈbluːbəriz/" },
      { word: "stirred", meaningFa: "به هم زد / مخلوط کرد", phonetic: "/stɜːd/" },
    ],
    question: {
      promptEn: "What was in the basket inside the fridge?",
      promptFa: "توی سبد داخل یخچال چی بود؟",
      options: ["Strawberries and blueberries", "Green apples", "Lemons and carrots"],
      correctIndex: 0,
      hintSnippet: "a basket of bright red strawberries and sweet blueberries",
      clueFa: "خط اول رو بخون! توت‌فرنگی‌های قرمز و بلوبری‌های شیرین بود.",
    },
    choiceA: {
      labelEn: "Slice the berries into heart shapes for Mom!",
      labelFa: "توت‌فرنگی‌ها رو به شکل قلب برای مامان برش بزن!",
      descriptionFa: "قلب‌های میوه‌ای روی کیک خیلی احساساتی و قشنگن.",
    },
    choiceB: {
      labelEn: "Blend half the berries into sweet pink frosting!",
      labelFa: "نصف توت‌ها رو به خامه صورتی خوشمزه تبدیل کن!",
      descriptionFa: "خامه صورتی با کیک شکلاتی عالی می‌شه.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Working together, Emma and Oliver scrubbed the counter until every surface shone like glass. They washed the bowls with warm soapy water and dried the spoons. Just as the kitchen was spotless, they heard a car engine in the driveway. Mom was home earlier than expected!",
    keywords: [
      { word: "scrubbed", meaningFa: "سابیدند و تمیز کردند", phonetic: "/skrʌbd/" },
      { word: "spotless", meaningFa: "کاملاً پاکیزه و بدون لک", phonetic: "/ˈspɒtləs/" },
      { word: "driveway", meaningFa: "مسیر ورودی جلوی خانه", phonetic: "/ˈdraɪvweɪ/" },
    ],
    question: {
      promptEn: "What did the kids hear outside?",
      promptFa: "بچه‌ها چه صدایی از بیرون شنیدن؟",
      options: ["A car engine in the driveway", "A barking dog", "Loud thunder"],
      correctIndex: 0,
      hintSnippet: "they heard a car engine in the driveway",
      clueFa: "خط آخر رو ببین دوست من! صدای ماشین مامان دم در اومد.",
    },
    choiceA: {
      labelEn: "Hide behind the sofa and shout 'Happy Birthday'!",
      labelFa: "پشت کاناپه قایم بشید و داد بزنید 'تولدت مبارک'!",
      descriptionFa: "یک سوپرایز خندان و پر از هیجان.",
    },
    choiceB: {
      labelEn: "Present Mom with a handmade birthday card first!",
      labelFa: "اول کارت‌پستال دست‌سازتون رو به مامان تقدیم کنید!",
      descriptionFa: "کارت نقاشی‌شده با شعر خنده‌دار بچه‌ها.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Emma and Oliver shaped the rich dough into twelve round cookies on a baking sheet. Oliver pressed chocolate chips into each cookie with a grin. They baked them for ten minutes. Soon, golden cookies puffed up, filling the room with the most mouthwatering chocolate aroma.",
    keywords: [
      { word: "shaped", meaningFa: "شکل دادند / قالب زدند", phonetic: "/ʃeɪpt/" },
      { word: "puffed up", meaningFa: "پف کردند و بالا آمدند", phonetic: "/pʌft ʌp/" },
      { word: "mouthwatering", meaningFa: "دهان‌پرکن و اشتهابرانگیز", phonetic: "/ˈmaʊθwɔːtərɪŋ/" },
    ],
    question: {
      promptEn: "How many cookies did they shape?",
      promptFa: "چند تا کلوچه شکل دادند؟",
      options: ["Twelve round cookies", "Two cookies", "Fifty cookies"],
      correctIndex: 0,
      hintSnippet: "twelve round cookies on a baking sheet",
      clueFa: "خط اول رو بخون! دوازده کلوچه گرد درست کردن.",
    },
    choiceA: {
      labelEn: "Stack the cookies into a festive birthday tower!",
      labelFa: "کلوچه‌ها رو مثل یک برج جشن روی هم بچینید!",
      descriptionFa: "یک برج کلوچه‌ای با شمع تولد در نوک آن.",
    },
    choiceB: {
      labelEn: "Drizzle melted white chocolate over the warm cookies!",
      labelFa: "شکلات سفید آب‌شده روی کلوچه‌ها بریزید!",
      descriptionFa: "خط‌های سفید شکلات روی کلوچه ظاهرش رو عالی می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The star cake baked inside the oven, rising beautifully. When Dad pulled it out with oven mitts, the chocolate cake looked majestic. Oliver decorated the five star points with shiny cherries, while Emma dusted powdered sugar over the center.",
    keywords: [
      { word: "mitts", meaningFa: "دستکش‌های ضخیم فر", phonetic: "/mɪts/" },
      { word: "majestic", meaningFa: "باشکوه و تماشایی", phonetic: "/məˈdʒestɪk/" },
      { word: "powdered", meaningFa: "پودرشده / خاکه‌قند", phonetic: "/ˈpaʊdəd/" },
    ],
    question: {
      promptEn: "What did Oliver place on the five star points?",
      promptFa: "اولیور روی پنج گوشه ستاره چی گذاشت؟",
      options: ["Shiny cherries", "Small stones", "Plastic flags"],
      correctIndex: 0,
      hintSnippet: "Oliver decorated the five star points with shiny cherries",
      clueFa: "خط سوم رو ببین! گیلاس‌های براق قرمز گذاشت.",
    },
    choiceA: {
      labelEn: "Light colorful birthday candles on the star cake!",
      labelFa: "شمع‌های رنگین‌کمانی رو روی کیک ستاره روشن کنید!",
      descriptionFa: "شمع‌ها که روشن بشن مراسم تولد شروع می‌شه.",
    },
    choiceB: {
      labelEn: "Write 'Best Mom Ever' with golden sugar icing!",
      labelFa: "با خامه طلایی روی کیک بنویسید 'بهترین مامان دنیا'!",
      descriptionFa: "یک پیام پر از محبت که مامان رو شاد می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Mr. Watson knocked on the kitchen door carrying a bottle of pure Madagascar vanilla and a plate of warm scones. 'I smelled chocolate from across the street!' Mr. Watson chuckled. He showed Emma how one drop of vanilla makes cocoa taste twice as rich.",
    keywords: [
      { word: "scones", meaningFa: "نان‌شیرینی‌های سنتی انگلیسی", phonetic: "/skɒnz/" },
      { word: "chuckled", meaningFa: "زیر لب خندید / قاه‌قاه آرام", phonetic: "/ˈtʃʌkld/" },
      { word: "drop", meaningFa: "یک قطره", phonetic: "/drɒp/" },
    ],
    question: {
      promptEn: "What did neighbor Mr. Watson bring?",
      promptFa: "آقای واتسون همسایه چی آورد؟",
      options: ["Vanilla and warm scones", "A cold pizza", "A bag of flour"],
      correctIndex: 0,
      hintSnippet: "a bottle of pure Madagascar vanilla and a plate of warm scones",
      clueFa: "خط اول رو بخون! عصاره وانیل و شیرینی‌های گرم آورد.",
    },
    choiceA: {
      labelEn: "Invite Mr. Watson to join Mom's surprise party!",
      labelFa: "آقای واتسون رو به جشن تولد سورپرایزی مامان دعوت کنید!",
      descriptionFa: "دورهمی با همسایه‌ها همیشه گرم‌تره.",
    },
    choiceB: {
      labelEn: "Bake a mini cupcake as a thank-you gift for Mr. Watson!",
      labelFa: "یک کاپ‌کیک کوچک به عنوان تشکر برای آقای واتسون بپزید!",
      descriptionFa: "هدیه دادن به همسایه مهربان نشان ادب است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "With Dad directing like a musical conductor, Emma whipped the eggs and sugar until fluffy yellow peaks formed. Oliver poured cocoa powder through a small sieve, giggling as the brown snow fell gently. The cake batter was completely lump-free and silky.",
    keywords: [
      { word: "peaks", meaningFa: "قله‌های پف‌کرده خامه و تخم‌مرغ", phonetic: "/piːks/" },
      { word: "sieve", meaningFa: "الک / صافی آشپزی", phonetic: "/sɪv/" },
      { word: "lump-free", meaningFa: "یکدست و بدون گلوله", phonetic: "/lʌmp friː/" },
    ],
    question: {
      promptEn: "What did Oliver pour cocoa through?",
      promptFa: "اولیور پودر کاکائو رو از چی رد کرد؟",
      options: ["A small sieve", "A coffee cup", "A plastic straw"],
      correctIndex: 0,
      hintSnippet: "poured cocoa powder through a small sieve",
      clueFa: "خط دوم رو ببین! از یک الک کوچک رد کرد تا گلوله نشه.",
    },
    choiceA: {
      labelEn: "Bake the cake in three round layers for a tall tower!",
      labelFa: "کیک رو در سه لایه گرد بپزید تا یک برج بلند بشه!",
      descriptionFa: "کیک سه طبقه مجلل‌ترین کیک تولد است.",
    },
    choiceB: {
      labelEn: "Pour the silky batter into cupcake molds with paper cups!",
      labelFa: "مایه نرم رو توی قالب‌های کاپ‌کیک رنگی بریزید!",
      descriptionFa: "هر کس می‌تونه کاپ‌کیک مخصوص خودش رو داشته باشه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Dad set the digital oven timer to chime with Beethoven's happy melody. As the oven warmed, the cake began to rise like a mini volcano. Emma, Oliver, and Dad sat on the kitchen floor watching through the glass door, cheering every time it rose another centimeter.",
    keywords: [
      { word: "digital", meaningFa: "دیجیتالی و هوشمند", phonetic: "/ˈdɪdʒɪtl/" },
      { word: "volcano", meaningFa: "کوه آتشفشان", phonetic: "/vɒlˈkeɪnəʊ/" },
      { word: "cheering", meaningFa: "هورا کشیدن و ذوق کردن", phonetic: "/ˈtʃɪərɪŋ/" },
    ],
    question: {
      promptEn: "What melody did the oven timer chime?",
      promptFa: "تایمر فر با چه آهنگی زنگ می‌زد؟",
      options: ["Beethoven's happy melody", "A rock song", "A simple beep"],
      correctIndex: 0,
      hintSnippet: "chime with Beethoven's happy melody",
      clueFa: "خط اول رو بخون! آهنگ شاد بتهوون بود.",
    },
    choiceA: {
      labelEn: "Sing a funny baking song while waiting for the timer!",
      labelFa: "تا زنگ زدن فر یک شعر بامزه آشپزی بخونید!",
      descriptionFa: "خوندن شعر زمان انتظار رو خیلی شیرین می‌کنه.",
    },
    choiceB: {
      labelEn: "Set the party table with Mom's favorite flowers!",
      labelFa: "میز جشن رو با گل‌های محبوب مامان بچینید!",
      descriptionFa: "گل‌های تازه میز رو برای جشن آماده می‌کنن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Emma carefully sliced the sweet red strawberries into heart shapes. Oliver arranged twenty little strawberry hearts around the cake border. The bright red fruit looked stunning against the rich dark chocolate. Dad took a photo with his phone and whispered: 'Mom is going to cry tears of joy.'",
    keywords: [
      { word: "border", meaningFa: "حاشیه و دور کیک", phonetic: "/ˈbɔːdər/" },
      { word: "stunning", meaningFa: "فوق‌العاده زیبا و خیره‌کننده", phonetic: "/ˈstʌnɪŋ/" },
      { word: "tears of joy", meaningFa: "اشک شوق و خوشحالی", phonetic: "/tɪəz əv dʒɔɪ/" },
    ],
    question: {
      promptEn: "How many strawberry hearts did Oliver arrange?",
      promptFa: "اولیور چند تا قلب توت‌فرنگی دور کیک چید؟",
      options: ["Twenty strawberry hearts", "Two hearts", "Fifty hearts"],
      correctIndex: 0,
      hintSnippet: "arranged twenty little strawberry hearts",
      clueFa: "خط دوم رو ببین! بیست تا قلب توت‌فرنگی چید.",
    },
    choiceA: {
      labelEn: "Sprinkle mint leaves between the strawberry hearts!",
      labelFa: "برگ‌های نعناع تازه بین قلب‌ها بذارید!",
      descriptionFa: "ترکیب سبز و قرمز جلوه‌ای مثل نقاشی به کیک می‌ده.",
    },
    choiceB: {
      labelEn: "Carry the heart cake to the dining room table!",
      labelFa: "کیک قلبی رو با احتیاط به میز پذیرایی ببرید!",
      descriptionFa: "میز پذیرایی آماده آمدن مامان است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Emma blended fresh berries with powdered sugar and heavy cream until a fluffy pastel pink frosting formed. Oliver helped spread the pink cloud over the chocolate cake. The two-tone contrast between dark chocolate and pink cream looked like a masterpiece from a TV cooking show.",
    keywords: [
      { word: "frosting", meaningFa: "خامه و روکش کیک", phonetic: "/ˈfrɒstɪŋ/" },
      { word: "two-tone", meaningFa: "دو رنگ و متضاد", phonetic: "/ˈtuː təʊn/" },
      { word: "masterpiece", meaningFa: "شاهکار هنری", phonetic: "/ˈmɑːstəpiːs/" },
    ],
    question: {
      promptEn: "What color was the berry frosting?",
      promptFa: "خامه میوه‌ای چه رنگی شد؟",
      options: ["Pastel pink", "Dark brown", "Bright yellow"],
      correctIndex: 0,
      hintSnippet: "fluffy pastel pink frosting formed",
      clueFa: "خط اول رو بخون! صورتی ملایم و پاستلی شد.",
    },
    choiceA: {
      labelEn: "Pipe decorative rosettes along the top edge!",
      labelFa: "با ماسوره خامه گل‌های رز تزیینی دور کیک بزن!",
      descriptionFa: "کیک شبیه کیک‌های قنادی‌های لوکس می‌شه.",
    },
    choiceB: {
      labelEn: "Top the frosting with rainbow sugar pearls!",
      labelFa: "روی خامه مرواریدهای شکری رنگین‌کمانی بپاش!",
      descriptionFa: "مرواریدهای شکری زیر نور چراغ برق می‌زنند.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Mom opened the front door carrying heavy grocery bags. The house was quiet and smelled like sweet vanilla. Suddenly, Emma, Oliver, and Dad jumped up: 'Surprise! Happy Birthday!' Mom dropped her keys in sheer joy and hugged all three of them tightly.",
    keywords: [{ word: "sheer joy", meaningFa: "شادی و شگفتی خالص", phonetic: "/ʃɪər dʒɔɪ/" }],
    question: {
      promptEn: "What did Mom drop in joy?",
      promptFa: "مامان از ذوق و خوشحالی چی از دستش افتاد؟",
      options: ["Her keys", "An orange", "A shoe"],
      correctIndex: 0,
      hintSnippet: "dropped her keys in sheer joy",
      clueFa: "کلیدهاش از خوشحالی از دستش افتاد.",
    },
    choiceA: {
      labelEn: "Slice the cake and make a birthday toast for Mom!",
      labelFa: "کیک رو برش بزنید و به سلامتی مامان تبریک بگید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Unwrap Mom's birthday presents together!",
      labelFa: "کادوهای تولد مامان رو با هم باز کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Oliver proudly handed Mom the giant colorful card. Inside, he had drawn a funny picture of Dad with flour on his ears and Emma in an oversized apron. Mom laughed until tears ran down her cheeks: 'This is the funniest card in the world!'",
    keywords: [{ word: "oversized", meaningFa: "بزرگ و گشاد", phonetic: "/ˌəʊvəˈsaɪzd/" }],
    question: {
      promptEn: "Who did Oliver draw with flour on his ears?",
      promptFa: "اولیور کی رو با گوش‌های آردی نقاشی کرده بود؟",
      options: ["Dad", "The mailman", "Mr. Watson"],
      correctIndex: 0,
      hintSnippet: "Dad with flour on his ears",
      clueFa: "بابا رو با گوش‌های آردی کشیده بود.",
    },
    choiceA: {
      labelEn: "Frame the funny birthday drawing on the living room wall!",
      labelFa: "نقاشی خنده‌دار رو قاب کن به دیوار پذیرایی بزن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Read the funny poem inside the card aloud!",
      labelFa: "شعر خنده‌دار داخل کارت رو با صدای بلند بخون!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The twelve cookies stood in a majestic pyramid on a silver platter. Mom walked in, gasped in delight, and grabbed the top cookie. 'Crunchy outside, chewy inside—absolutely perfect!' Mom cheered.",
    keywords: [{ word: "pyramid", meaningFa: "هرم طبقه‌طبقه", phonetic: "/ˈpɪrəmɪd/" }],
    question: {
      promptEn: "How was the texture of the cookies?",
      promptFa: "بافت کلوچه‌ها چطور بود؟",
      options: ["Crunchy outside, chewy inside", "Too hard and dry", "Raw and cold"],
      correctIndex: 0,
      hintSnippet: "Crunchy outside, chewy inside",
      clueFa: "رویش ترد و داخلش نرم و عالی بود.",
    },
    choiceA: {
      labelEn: "Pour four glasses of cold milk for a cookie toast!",
      labelFa: "چهار لیوان شیر خنک برای جشن کلوچه بریزید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Pack three cookies in a tin for Grandma Mary!",
      labelFa: "سه تا کلوچه رو تو قوطی برای مادربزرگ مری بذارید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The white chocolate drizzle hardened into sweet zebra stripes across the dark cookies. Mom took photos and posted them to the family chat. Within minutes, relatives sent heart emojis and congratulations.",
    keywords: [{ word: "drizzle", meaningFa: "خطوط باریک شکلات ریخته‌شده", phonetic: "/ˈdrɪzl/" }],
    question: {
      promptEn: "What did the white chocolate drizzle look like?",
      promptFa: "خطوط شکلات سفید شبیه چی شد؟",
      options: ["Zebra stripes", "Spider webs", "Polka dots"],
      correctIndex: 0,
      hintSnippet: "sweet zebra stripes",
      clueFa: "شبیه خط‌های گورخر شد.",
    },
    choiceA: {
      labelEn: "Vote Emma and Oliver the Master Bakers of the family!",
      labelFa: "اِما و اولیور رو استادان قنادی خانواده اعلام کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Plan a Sunday cookie bake-off with the cousins!",
      labelFa: "یک مسابقه کلوچه‌پزی یکشنبه با بچه‌های فامیل بذارید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The five colorful candles flickered brightly atop the star cake. As Mom blew them out with one big breath, Emma and Oliver cheered. Mom closed her eyes and made a wish for a happy, healthy family.",
    keywords: [{ word: "flickered", meaningFa: "چشمک می‌زد و می‌سوخت", phonetic: "/ˈflɪkəd/" }],
    question: {
      promptEn: "What did Mom wish for?",
      promptFa: "مامان چه آرزویی کرد؟",
      options: ["A happy, healthy family", "A new red car", "A bigger television"],
      correctIndex: 0,
      hintSnippet: "a happy, healthy family",
      clueFa: "خانواده‌ای شاد و سلامت آرزو کرد.",
    },
    choiceA: {
      labelEn: "Serve the first big star slice to Mom!",
      labelFa: "اولین برش بزرگ کیک ستاره رو به مامان تعارف کن!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Play happy acoustic birthday guitar with Dad!",
      labelFa: "با بابا گیتار تولد بنوازید و همخوانی کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The golden letters 'Best Mom Ever' sparkled under the dining room chandelier. Mom felt tears in her eyes as she hugged Emma and Oliver: 'No bakery in the world could make a cake sweeter than this!'",
    keywords: [{ word: "chandelier", meaningFa: "لوستر درخشان سقف", phonetic: "/ˌʃændəˈlɪər/" }],
    question: {
      promptEn: "What words were written in golden icing?",
      promptFa: "چه جمله‌ای با خامه طلایی نوشته شده بود؟",
      options: ["'Best Mom Ever'", "'Welcome Home'", "'Happy Weekend'"],
      correctIndex: 0,
      hintSnippet: "Best Mom Ever",
      clueFa: "جمله 'بهترین مامان دنیا' نوشته شده بود.",
    },
    choiceA: {
      labelEn: "Keep the golden candle as a lucky family keepsake!",
      labelFa: "شمع طلایی رو به عنوان یادگاری شانس نگه دارید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Share cake slices with all the neighbors on the block!",
      labelFa: "تکه‌های کیک رو برای همسایه‌های کوچه ببرید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Mr. Watson sat at the head of the party table, telling funny stories about neighborhood adventures from twenty years ago. Everyone ate warm cake, drank tea, and laughed until their cheeks turned pink.",
    keywords: [{ word: "adventures", meaningFa: "ماجراهای شیرین گذشته", phonetic: "/ədˈventʃəz/" }],
    question: {
      promptEn: "What did Mr. Watson tell stories about?",
      promptFa: "آقای واتسون درباره چی قصه تعریف کرد؟",
      options: ["Neighborhood adventures", "Car accidents", "Math exams"],
      correctIndex: 0,
      hintSnippet: "neighborhood adventures from twenty years ago",
      clueFa: "ماجراهای جالب بیست سال پیش محله.",
    },
    choiceA: {
      labelEn: "Make the Saturday tea party a weekly neighborhood tradition!",
      labelFa: "عصرانه شنبه‌ها رو به یک رسم هفتگی با همسایه‌ها تبدیل کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Give Mr. Watson the remaining vanilla cake to take home!",
      labelFa: "باقیمانده کیک رو برای آقای واتسون بسته‌بندی کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Oliver delivered the warm mini cupcake with a handmade thank-you tag to Mr. Watson's front porch. Mr. Watson was so touched that he promised to teach Emma and Oliver his secret scone recipe next week.",
    keywords: [{ word: "porch", meaningFa: "ایوان جلوی خانه", phonetic: "/pɔːtʃ/" }],
    question: {
      promptEn: "What did Mr. Watson promise to teach the kids?",
      promptFa: "آقای واتسون قول داد چه چیزی به بچه‌ها یاد بده؟",
      options: ["His secret scone recipe", "How to drive a car", "French language"],
      correctIndex: 0,
      hintSnippet: "his secret scone recipe next week",
      clueFa: "دستور پخت مخفی نان‌شیرینی‌هایش را.",
    },
    choiceA: {
      labelEn: "Learn secret English scone baking next Saturday!",
      labelFa: "شنبه آینده پخت شیرینی‌های سنتی رو یاد بگیرید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Write the scone recipe down in Emma's kitchen journal!",
      labelFa: "دستور پخت رو در دفترچه آشپزی اِما ثبت کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The three-layer chocolate tower was nearly forty centimeters tall! When Mom walked into the kitchen, she clapped her hands in awe. 'Did a royal baker visit our house while I was shopping?' she teased.",
    keywords: [{ word: "awe", meaningFa: "شگفتی و تحسین زیاد", phonetic: "/ɔː/" }],
    question: {
      promptEn: "How tall was the three-layer cake tower?",
      promptFa: "برج کیک سه طبقه چقدر ارتفاع داشت؟",
      options: ["Nearly forty centimeters", "Five centimeters", "Two meters"],
      correctIndex: 0,
      hintSnippet: "nearly forty centimeters tall",
      clueFa: "نزدیک به چهل سانتی‌متر ارتفاع داشت.",
    },
    choiceA: {
      labelEn: "Win the town fair Blue Ribbon for Tallest Family Cake!",
      labelFa: "مدال افتخار نمایشگاه شهر برای بلندترین کیک خانوادگی را ببرید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Take a hilarious family selfie behind the giant cake tower!",
      labelFa: "یک سلفی خانوادگی خنده‌دار پشت کیک غول‌پیکر بگیرید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Twenty-four cupcakes in bright polka-dot paper cups lined the counter. Oliver frosted half with dark chocolate and half with vanilla cream. Mom hugged both kids and called them her 'Junior MasterChefs'.",
    keywords: [{ word: "polka-dot", meaningFa: "خال‌خالی و رنگارنگ", phonetic: "/ˈpɒlkə dɒt/" }],
    question: {
      promptEn: "How many cupcakes were on the counter?",
      promptFa: "چند تا کاپ‌کیک روی پیشخوان چیده شده بود؟",
      options: ["Twenty-four cupcakes", "Three cupcakes", "One cupcake"],
      correctIndex: 0,
      hintSnippet: "Twenty-four cupcakes in bright polka-dot paper cups",
      clueFa: "بیست و چهار کاپ‌کیک خال‌خالی بود.",
    },
    choiceA: {
      labelEn: "Bring a box of cupcakes to Emma's school friends on Monday!",
      labelFa: "دوشنبه یک جعبه کاپ‌کیک برای دوستان مدرسه ببرید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Decorate each cupcake with a personalized family face!",
      labelFa: "روی هر کاپ‌کیک شکل خنده‌دار یکی از اعضای فامیل رو بکشید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Emma and Oliver invented a song called 'The Flour Snowman Boogie' and danced around Dad while the cake cooled. Mom walked in, laughed out loud, and joined the silly dance with her shopping bags still in hand.",
    keywords: [{ word: "boogie", meaningFa: "رقص شاد و پر انرژی", phonetic: "/ˈbuːɡi/" }],
    question: {
      promptEn: "What was the funny dance called?",
      promptFa: "اسم رقص خنده‌دار چی بود؟",
      options: ["'The Flour Snowman Boogie'", "'The Fast Cheetah'", "'The Quiet Nap'"],
      correctIndex: 0,
      hintSnippet: "The Flour Snowman Boogie",
      clueFa: "رقص 'آدم‌برفی آردی' نام داشت.",
    },
    choiceA: {
      labelEn: "Record a family dance video to send to grandparents!",
      labelFa: "یک ویدئوی رقص خانوادگی شاد برای پدربزرگ و مادربزرگ بفرستید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Perform the Flour Boogie at the school talent show!",
      labelFa: "این رقص خنده‌دار رو در جشن استعدادهای مدرسه اجرا کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "A bouquet of fresh yellow daisies sat beside the warm chocolate cake. The dining room felt like a five-star tea salon. Mom wiped a happy tear and said: 'I have the most loving family in the whole world.'",
    keywords: [{ word: "daisies", meaningFa: "گل‌های داوودی زرد", phonetic: "/ˈdeɪziz/" }],
    question: {
      promptEn: "What flowers sat beside the warm cake?",
      promptFa: "چه گل‌هایی کنار کیک گرم چیده شده بود؟",
      options: ["Yellow daisies", "Plastic roses", "Dry grass"],
      correctIndex: 0,
      hintSnippet: "fresh yellow daisies",
      clueFa: "گل‌های داوودی تازه و زرد.",
    },
    choiceA: {
      labelEn: "Press a yellow daisy petal inside Mom's birthday book!",
      labelFa: "یک گلبرگ داوودی رو لای دفترچه خاطرات مامان خشک کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Toast Mom's special day with sparkling apple juice!",
      labelFa: "با آب‌سیب گازدار گوارا به افتخار مامان جشن بگیرید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Fresh green mint leaves accentuated the red strawberry hearts, making the cake look like an exquisite Christmas wreath in June. Mom took a bite and sighed in bliss: 'The rich dark cocoa with fresh mint is sublime!'",
    keywords: [{ word: "sublime", meaningFa: "فوق‌العاده لذیذ و دلپذیر", phonetic: "/səˈblaɪm/" }],
    question: {
      promptEn: "What did the mint leaves make the cake look like?",
      promptFa: "برگ‌های نعناع باعث شدن کیک شبیه چی بشه؟",
      options: ["An exquisite wreath", "A soccer ball", "A plain box"],
      correctIndex: 0,
      hintSnippet: "an exquisite Christmas wreath in June",
      clueFa: "شبیه یک حلقه گل زیبا و دلنشین شد.",
    },
    choiceA: {
      labelEn: "Send the mint-chocolate recipe to a national cooking magazine!",
      labelFa: "دستور پخت شکلات-نعناع رو برای مجله آشپزی بفرستید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Plant sweet mint in the kitchen window herb garden!",
      labelFa: "توی باغچه پنجره آشپزخانه نعناع تازه بکارید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Dad placed the heavy heart-themed cake right in the center of the mahogany dining table. Mom turned off the ceiling lights and lit the candles. The room filled with warm golden shadows and laughter.",
    keywords: [{ word: "mahogany", meaningFa: "چوب ماهون مرغوب و تیره", phonetic: "/məˈhɒɡəni/" }],
    question: {
      promptEn: "Where was the cake placed?",
      promptFa: "کیک کجا قرار گرفت؟",
      options: ["In the center of the mahogany table", "On the refrigerator", "Outside on the grass"],
      correctIndex: 0,
      hintSnippet: "in the center of the mahogany dining table",
      clueFa: "وسط میز غذاخوری چوبی.",
    },
    choiceA: {
      labelEn: "Sing 'Happy Birthday to You' in both English and Persian!",
      labelFa: "آهنگ تولدت مبارک رو هم انگلیسی و هم فارسی با هم بخونید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Cut the largest heart slice for Mom with an extra cherry!",
      labelFa: "بزرگ‌ترین تکه قلبی رو با یک گیلاس اضافه به مامان تقدیم کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The delicate pink rosettes around the cake edge looked like real roses from Grandma's garden. Mom marveled at Emma's steady piping hand: 'Emma, you are truly talented at pastry art!'",
    keywords: [{ word: "marveled", meaningFa: "با حیرت و افتخار تحسین کرد", phonetic: "/ˈmɑːvld/" }],
    question: {
      promptEn: "What did the pink rosettes look like?",
      promptFa: "گل‌های خامه صورتی شبیه چی بودن؟",
      options: ["Real roses from Grandma's garden", "Small stones", "Plastic buttons"],
      correctIndex: 0,
      hintSnippet: "real roses from Grandma's garden",
      clueFa: "شبیه گل‌های رز واقعی باغچه مادربزرگ.",
    },
    choiceA: {
      labelEn: "Sign Emma up for junior pastry decorating classes!",
      labelFa: "اِما رو در کلاس‌های تزیین کیک نوجوانان ثبت‌نام کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Bake a floral anniversary cake for Grandma and Grandpa!",
      labelFa: "یک کیک گل‌دار برای سالگرد ازدواج پدربزرگ و مادربزرگ بپزید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The rainbow sugar pearls sparkled like gems on the pastel frosting. As the family tasted the first bites, Oliver grinned with chocolate on his chin. Mom smiled: 'This cake catastrophe turned into the greatest birthday memory of my life.'",
    keywords: [{ word: "gems", meaningFa: "نگین‌ها و جواهرات درخشان", phonetic: "/dʒemz/" }],
    question: {
      promptEn: "Where did Oliver have chocolate on his face?",
      promptFa: "کجای صورت اولیور شکلاتی شده بود؟",
      options: ["On his chin", "On his forehead", "On his ears"],
      correctIndex: 0,
      hintSnippet: "with chocolate on his chin",
      clueFa: "روی چونهاش شکلاتی شده بود.",
    },
    choiceA: {
      labelEn: "Take a funny selfie with chocolate smeared on everyone's chins!",
      labelFa: "یک سلفی خانوادگی خنده‌دار با چانه‌های شکلاتی بگیرید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Crown Mom the Birthday Queen with a paper party crown!",
      labelFa: "تاج کاغذی جشن رو سر مامان بذارید و ملکه روز اعلامش کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Sweet Birthday Toast", titleFa: "جشن تولد پر از خنده", badgeCategory: "legendary", badgeIcon: "🎂", badgeNameFa: "پایان شیرین و صمیمی", climaxEn: "Mom raises her fork, smiling through tears of joy as the whole family sings in cheerful harmony.", climaxFa: "مامان با لبخندی سرشار از اشک شوق چنگالش را بالا برد و تمام خانواده با شادی سرود تولد خواندند.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Mountain of Presents", titleFa: "کوه کادوهای رنگارنگ", badgeCategory: "heroic", badgeIcon: "🎁", badgeNameFa: "پایان غافلگیرکننده", climaxEn: "Mom unwraps handmade gifts and hugs her children, declaring this her happiest birthday ever.", climaxFa: "مامان هدیه‌های دست‌ساز بچه‌ها را باز کرد و آن روز را شادترین روز زندگی‌اش نامید.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "The Framed Kitchen Masterpiece", titleFa: "قاب خنده‌دار آشپزخانه", badgeCategory: "funny", badgeIcon: "🖼️", badgeNameFa: "پایان طنز و خاطره‌انگیز", climaxEn: "Oliver's flour-faced drawing hangs permanently in the kitchen, making visitors giggle for years.", climaxFa: "نقاشی خنده‌دار صورت‌های آردی برای سال‌ها روی دیوار آشپزخانه ماند و خنده به لب همه آورد.", xpReward: 155 },
  { pathCode: "AAABB", titleEn: "The Rhyme of the Flour Storm", titleFa: "شعر طوفان آرد سفید", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان شاعرانه و شاد", climaxEn: "Emma recites her silly rhyming poem, and Dad taps his feet to the hilarious rhythm.", climaxFa: "اِما شعر خنده‌دار طوفان آرد را خواند و بابا با ریتم شعر دست زد و همه خندیدند.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Milk & Cookie Cheers", titleFa: "سلامتی با شیر و کلوچه", badgeCategory: "funny", badgeIcon: "🥛", badgeNameFa: "پایان کودکانه و شیرین", climaxEn: "Four cold glasses of milk clink together in a toast to warm cookies and endless love.", climaxFa: "چهار لیوان شیر خنک به افتخار کلوچه‌های داغ به هم خوردند و خنده فضا را پر کرد.", xpReward: 160 },
  { pathCode: "AABAB", titleEn: "Grandma's Cookie Tin", titleFa: "قوطی شیرینی مادربزرگ", badgeCategory: "scholar", badgeIcon: "👵", badgeNameFa: "پایان مهربانی خانوادگی", climaxEn: "Grandma calls on the phone, delighted by the fresh cookies delivered to her doorstep.", climaxFa: "مادربزرگ مری پشت تلفن با ذوق تشکر کرد و طعم کلوچه‌ها را بهشتی خواند.", xpReward: 175 },
  { pathCode: "AABBA", titleEn: "The Junior Master Bakers", titleFa: "استادان کوچک قنادی", badgeCategory: "heroic", badgeIcon: "🏆", badgeNameFa: "پایان پرافتخار", climaxEn: "Dad presents Emma and Oliver with wooden spoons engraved 'Master Bakers 2026'.", climaxFa: "بابا دو قاشق چوبی با عنوان استادان قنادی به اِما و اولیور هدیه داد.", xpReward: 185 },
  { pathCode: "AABBB", titleEn: "The Cousins Cookie Battle", titleFa: "مسابقه کلوچه‌پزی فامیلی", badgeCategory: "explorer", badgeIcon: "🍪", badgeNameFa: "پایان پرهیجان", climaxEn: "Next Sunday, six cousins gather in the kitchen for the messiest, tastiest bake-off ever.", climaxFa: "یکشنبه بعد تمام بچه‌های فامیل جمع شدند و شادترین مسابقه کلوچه‌پزی را برگزار کردند.", xpReward: 180 },
  { pathCode: "ABAAA", titleEn: "The Star of Mom's Heart", titleFa: "ستاره قلب مادر", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان افسانه‌ای", climaxEn: "Mom tastes the star cake, eyes shining with tears, praising the delicious chocolate and cherries.", climaxFa: "مامان با چشمانی درخشان طعم کیک ستاره‌ای و گیلاس‌های تازه را چشید و بچه‌ها را بوسید.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "The Birthday Guitar Serenade", titleFa: "ترانه گیتار تولد", badgeCategory: "explorer", badgeIcon: "🎸", badgeNameFa: "پایان موسیقیایی", climaxEn: "Dad strums joyful chords as Emma and Oliver sing in sweet harmony under dining room lights.", climaxFa: "بابا آهنگ‌های شاد نواخت و اِما و اولیور با صدای زنگ‌دارشان قشنگ‌ترین ترانه را خواندند.", xpReward: 170 },
  { pathCode: "ABABA", titleEn: "The Golden Candle Keepsake", titleFa: "شمع طلایی خوش‌شانسی", badgeCategory: "secret", badgeIcon: "🕯️", badgeNameFa: "پایان خاطره‌انگیز", climaxEn: "The golden candle rests on the fireplace mantel, a shining reminder of teamwork and love.", climaxFa: "شمع طلایی بالای شومینه قرار گرفت، یادآور ابدی این‌که عشق بر هر بی‌نظمی پیروز می‌شود.", xpReward: 175 },
  { pathCode: "ABABB", titleEn: "The Neighborhood Cake Drive", titleFa: "پخش کیک بین همسایه‌ها", badgeCategory: "heroic", badgeIcon: "🍰", badgeNameFa: "پایان سخاوتمندانه", climaxEn: "Every neighbor on the street enjoys a slice, praising the kids' sweet baking skills.", climaxFa: "تمام همسایه‌های کوچه یک تکه کیک خوردند و دستپخت فوق‌العاده بچه‌ها را تحسین کردند.", xpReward: 185 },
  { pathCode: "ABBAA", titleEn: "The Saturday Tea Tradition", titleFa: "رسم عصرانه‌های شنبه", badgeCategory: "legendary", badgeIcon: "☕", badgeNameFa: "پایان صمیمانه", climaxEn: "Saturday tea with Mr. Watson becomes the warmest weekly event on the entire street.", climaxFa: "عصرانه‌های شنبه با آقای واتسون به گرم‌ترین رسم هفتگی اهالی کوچه تبدیل شد.", xpReward: 195 },
  { pathCode: "ABBAB", titleEn: "A Sweet Gift for Neighbor Watson", titleFa: "هدیه شیرین برای آقای واتسون", badgeCategory: "scholar", badgeIcon: "🎁", badgeNameFa: "پایان احترام و ادب", climaxEn: "Mr. Watson waves warmly from his porch, enjoying the rich chocolate cake with afternoon tea.", climaxFa: "آقای واتسون با دست تکان دادن از ایوان، کیک لذیذ را با چای عصرانه‌اش میل کرد.", xpReward: 165 },
  { pathCode: "ABBBA", titleEn: "The Master of Secret Scones", titleFa: "استاد نان‌شیرینی‌های اصیل", badgeCategory: "scholar", badgeIcon: "🥧", badgeNameFa: "پایان آموزنده", climaxEn: "Emma and Oliver bake golden English scones that rise higher and fluffier than cloud peaks.", climaxFa: "اِما و اولیور پخت شیرینی‌های اصیل را یاد گرفتند و نان‌هایی به پف ابرها درست کردند.", xpReward: 180 },
  { pathCode: "ABBBB", titleEn: "Emma's Golden Recipe Journal", titleFa: "دفترچه زرین دستورهای اِما", badgeCategory: "secret", badgeIcon: "📖", badgeNameFa: "پایان نویسنده کوچک", climaxEn: "Emma's kitchen journal becomes a family heirloom filled with secret notes and funny sketches.", climaxFa: "دفترچه آشپزی اِما به گنجینه‌ای خانوادگی از دستورها و نقاشی‌های بامزه تبدیل شد.", xpReward: 175 },
  { pathCode: "BAAAA", titleEn: "The Blue Ribbon Cake Tower", titleFa: "روبان آبی بلندترین کیک", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان قهرمانانه", climaxEn: "The town fair awards the family a giant blue ribbon for the tallest and tastiest chocolate tower.", climaxFa: "نمایشگاه سالانه شهر روبان آبی افتخار را برای بلندترین و خوشمزه‌ترین کیک به آنها داد.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Giant Cake Selfie", titleFa: "سلفی غول‌پیکر کیک خانوادگی", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان خنده‌دار", climaxEn: "The family selfie captures four chocolate-smeared noses and twenty smiling teeth.", climaxFa: "عکس سلفی خانوادگی با چهار دماغ شکلاتی و خنده‌های از ته دل در تاریخ ماندگار شد.", xpReward: 160 },
  { pathCode: "BAABA", titleEn: "The Monday School Surprise", titleFa: "سورپرایز دوشنبه مدرسه", badgeCategory: "heroic", badgeIcon: "🎒", badgeNameFa: "پایان محبوبیت", climaxEn: "Emma's classmates cheer as she opens a box of twenty-four delicious cupcakes at lunch.", climaxFa: "همکلاسی‌های اِما در ساعت ناهار با دیدن جعبه کاپ‌کیک‌ها هورا کشیدند و جشن گرفتند.", xpReward: 185 },
  { pathCode: "BAABB", titleEn: "The Family Face Cupcakes", titleFa: "کاپ‌کیک‌های چهره‌های خندان", badgeCategory: "funny", badgeIcon: "🧁", badgeNameFa: "پایان هنرمندانه و طنز", climaxEn: "Everyone giggles guessing which cupcake represents Dad with frosting glasses and ears.", climaxFa: "همه با خنده حدس می‌زدند کدام کاپ‌کیک با عینک خامه‌ای شبیه باباست.", xpReward: 165 },
  { pathCode: "BABAA", titleEn: "The Viral Flour Boogie", titleFa: "رقص طوفان آردی در اینترنت", badgeCategory: "funny", badgeIcon: "💃", badgeNameFa: "پایان شاد و پرشور", climaxEn: "The family dance video brings smiles to cousins across the globe with over a thousand likes.", climaxFa: "ویدئوی رقص خنده‌دار خانواده با چهره‌های آردی دل تمام فامیل را در دنیا شاد کرد.", xpReward: 170 },
  { pathCode: "BABAB", titleEn: "The School Talent Champions", titleFa: "قهرمانان جشن استعدادهای مدرسه", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان درخشان", climaxEn: "Emma and Oliver perform their baking dance on stage to thunderous standing ovations.", climaxFa: "اِما و اولیور رقص شاد آشپزی‌شان را روی صحنه اجرا کردند و تشویق پرشور گرفتند.", xpReward: 195 },
  { pathCode: "BABBA", titleEn: "The Pressed Daisy Keepsake", titleFa: "گلبرگ خشکیده یادگاری", badgeCategory: "scholar", badgeIcon: "🌼", badgeNameFa: "پایان لطیف و زیبا", climaxEn: "The yellow daisy petal remains inside Mom's diary, preserving the scent of birthday joy.", climaxFa: "گلبرگ داوودی زرد در دفتر خاطرات مامان خشک شد و بوی خوش آن روز را زنده نگه داشت.", xpReward: 175 },
  { pathCode: "BABBB", titleEn: "Sparkling Apple Juice Toast", titleFa: "جام بلورین آب‌سیب", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان باوقار", climaxEn: "Bubbles dance in crystal glasses as Dad declares Mom the queen of their cozy universe.", climaxFa: "حباب‌های آب‌سیب در لیوان‌ها درخشیدند و بابا مامان را ملکه دنیای خانه‌شان خواند.", xpReward: 180 },
  { pathCode: "BBAAA", titleEn: "The National Food Magazine Star", titleFa: "ستاره مجله ملی آشپزی", badgeCategory: "legendary", badgeIcon: "📰", badgeNameFa: "پایان مشهور", climaxEn: "A national food magazine publishes the kids' mint chocolate recipe with full-page photos.", climaxFa: "مجله معتبر آشپزی کشور دستور کیک نعناع-شکلات بچه‌ها را با عکسی بزرگ چاپ کرد.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Window Herb Sanctuary", titleFa: "باغچه کوچک پشت پنجره", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان سرسبز", climaxEn: "Fragrant sweet mint flourishes on the windowsill, filling every morning with fresh aroma.", climaxFa: "نعناع‌های خوشبو پشت پنجره آشپزخانه سبز شدند و هر روز صبح خانه را معطر کردند.", xpReward: 175 },
  { pathCode: "BBABA", titleEn: "The Bilingual Birthday Serenade", titleFa: "سرود دوزبانه تولد", badgeCategory: "legendary", badgeIcon: "🎶", badgeNameFa: "پایان پیوند و مهربانی", climaxEn: "Singing together in two languages, the family celebrates love that transcends borders.", climaxFa: "با خواندن ترانه تولد به دو زبان، خانواده پیوند گرم و پر از عشقشان را جشن گرفتند.", xpReward: 195 },
  { pathCode: "BBABB", titleEn: "The Cherry on Top of Love", titleFa: "گیلاس زرین عشق", badgeCategory: "heroic", badgeIcon: "🍒", badgeNameFa: "پایان محبت خالص", climaxEn: "Mom takes the largest slice with the extra cherry, holding her children close to her heart.", climaxFa: "مامان بزرگ‌ترین تکه کیک قلبی را با گیلاس اضافه چشید و فرزندانش را در آغوش کشید.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "The Rising Pastry Prodigy", titleFa: "نبوغ خردسال قنادی", badgeCategory: "scholar", badgeIcon: "👩‍🍳", badgeNameFa: "پایان هنرمند آینده", climaxEn: "Emma's teacher praises her piping technique as the most promising in the junior academy.", climaxFa: "مربی قنادی ظرافت دستان اِما را ستود و او را بااستعدادترین هنرجوی آکادمی نامید.", xpReward: 185 },
  { pathCode: "BBBAB", titleEn: "Grandparents' Golden Jubilee", titleFa: "کیک جشن طلایی پدربزرگ", badgeCategory: "legendary", badgeIcon: "🎉", badgeNameFa: "پایان افتخار خانوادگی", climaxEn: "Emma and Oliver bake a five-tier floral cake for their grandparents' fiftieth anniversary.", climaxFa: "اِما و اولیور یک کیک گل‌دار پنج طبقه برای پنجاهمین سالگرد ازدواج پدربزرگ پختند.", xpReward: 200 },
  { pathCode: "BBBBA", titleEn: "The Chocolate Chin Hall of Fame", titleFa: "تالار مشاهیر چانه‌های شکلاتی", badgeCategory: "funny", badgeIcon: "🍫", badgeNameFa: "پایان بی‌نهایت خنده‌دار", climaxEn: "The framed photo of four chocolate-stained chins makes every visitor laugh out loud.", climaxFa: "قاب عکس چانه‌های شکلاتی همه را به خنده انداخت و نماد صمیمیت بی‌پایان خانواده شد.", xpReward: 165 },
  { pathCode: "BBBBB", titleEn: "The Queen of the Sweetest Day", titleFa: "ملکه شیرین‌ترین روز دنیا", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Wearing her paper party crown, surrounded by chocolate, laughter, and pure love, Mom celebrates the best birthday ever.", climaxFa: "با تاجی کاغذی بر سر، در میان عطر شکلات و خنده‌های گرم، مامان بهترین روز تولد عمرش را جشن گرفت.", xpReward: 200 },
];

export const story1CakeCatastrophe: AdventureStory = buildAdventureStory({
  id: "a2-cake-catastrophe",
  storyIndex: 1,
  cefr: "A2",
  titleEn: "The Great Cake Catastrophe",
  titleFa: "ماجرای خنده‌دار کیک تولد",
  genre: "comedy",
  genreLabelFa: "😄 طنز و روزمره",
  genreIcon: "😄",
  synopsisEn:
    "Emma and Oliver decide to bake a surprise chocolate birthday cake for Mom, but a cocoa dust storm turns the kitchen upside down! Help clean up or add secret ingredients across 32 hilarious endings!",
  synopsisFa:
    "اِما و برادر کوچولوش اولیور می‌خوان برای تولد مامان کیک شکلاتی بپزن، ولی طوفان آرد و کاکائو آشپزخونه رو زیر و رو می‌کنه! آیا کیک رو نجات می‌دی یا به کلوچه تبدیلش می‌کنی؟ ۳۲ پایان خنده‌دار و پرماجرا منتظرته!",
  coverImage: "/images/skills/reading/a2-cake-catastrophe.webp",
  nodes,
  endings,
});
