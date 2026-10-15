import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 5: The Sandy Beach Rescue (مأموریت نجات در ساحل شنی)
// Style: Family and Friends Readers (CEFR A1)
// Grammar: Present Simple, Present Continuous, To Be, was/were, Regular Past (-ed) only!
// Common English Names: Ben, Sunny, Shelly, Captain Amy
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Today is a sunny morning at the beach. A boy named Ben is walking on the warm sand with his puppy, Sunny. Sunny is a golden puppy with floppy ears. Sunny wears a red lifeguard jacket. The blue waves are very gentle. Suddenly, Sunny barks: Woof! Woof! Sunny points his nose at the wet rocks. Near the rocks, a tiny baby turtle is stuck in green seaweed. Ben wants to help.",
    keywords: [
      { word: "beach", meaningFa: "ساحل دریا", phonetic: "/biːtʃ/" },
      { word: "puppy", meaningFa: "توله‌سگ بامزه", phonetic: "/ˈpʌpi/" },
      { word: "turtle", meaningFa: "لاک‌پشت کوچولو", phonetic: "/ˈtɜːtl/" },
      { word: "seaweed", meaningFa: "جلبک‌های سبز دریایی", phonetic: "/ˈsiːwiːd/" },
    ],
    question: {
      promptEn: "Who is Sunny?",
      promptFa: "سانی کیست؟",
      options: ["A golden puppy", "A green parrot", "A big black cat"],
      correctIndex: 0,
      hintSnippet: "Sunny is a golden puppy with floppy ears.",
      clueFa: "خط سوم را ببین دوست من! سانی یک توله‌سگ طلایی با گوش‌های آویزان است.",
    },
    choiceA: {
      labelEn: "Walk to the wet rocks with a small yellow bucket!",
      labelFa: "با یک سطل زرد کوچک به سمت صخره‌های خیس برو!",
      descriptionFa: "می‌توانید آب تمیز دریا را برای لاک‌پشت بیاورید.",
    },
    choiceB: {
      labelEn: "Call Captain Amy near the wooden pier!",
      labelFa: "کاپیتان اِیمی را کنار اسکله چوبی صدا کن!",
      descriptionFa: "کاپیتان یک قایق نجات سفید و وسایل امداد دارد.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Ben walks across the warm sand with his yellow bucket. Sunny walks beside him, wagging his tail. They reach the wet rocks. The tiny baby turtle is green with brown spots. It blinks its small eyes. Ben smiles kindly. 'Hello little friend! I name you Shelly,' whispers Ben.",
    keywords: [
      { word: "bucket", meaningFa: "سطل آب", phonetic: "/ˈbʌkɪt/" },
      { word: "wagging", meaningFa: "تکان دادن دم از خوشحالی", phonetic: "/ˈwæɡɪŋ/" },
      { word: "spots", meaningFa: "خال‌ها و نقطه‌ها", phonetic: "/spɒts/" },
    ],
    question: {
      promptEn: "What color is Ben's bucket?",
      promptFa: "سطل بن چه رنگی است؟",
      options: ["Yellow", "Purple", "Black"],
      correctIndex: 0,
      hintSnippet: "with his yellow bucket",
      clueFa: "خط اول را بخوان! سطل بن زرد رنگ است.",
    },
    choiceA: {
      labelEn: "Gently untangle Shelly from the green seaweed!",
      labelFa: "با آرامش جلبک‌های سبز را از دور شلی باز کن!",
      descriptionFa: "دست‌های مهربان بهترین راه نجات لاک‌پشت هستند.",
    },
    choiceB: {
      labelEn: "Splash cool seawater onto Shelly's shell!",
      labelFa: "آب خنک دریا را روی لاک شلی بریز!",
      descriptionFa: "لاک‌پشت‌ها عاشق خنک ماندن در آفتاب هستند.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Ben calls Captain Amy near the wooden pier. Captain Amy is standing by her white motorboat. She wears a sailor cap and smiles. 'Hello Ben! What is happening?' she asks. Ben points at the rocks. 'A baby turtle needs our help!' shouted Ben.",
    keywords: [
      { word: "pier", meaningFa: "اسکله چوبی", phonetic: "/pɪər/" },
      { word: "motorboat", meaningFa: "قایق موتوری", phonetic: "/ˈməʊtəbəʊt/" },
      { word: "sailor", meaningFa: "ملوان / دریانورد", phonetic: "/ˈseɪlər/" },
    ],
    question: {
      promptEn: "Where is Captain Amy standing?",
      promptFa: "کاپیتان ایمی کجا ایستاده است؟",
      options: ["Near her white motorboat", "On a red bus", "Inside the kitchen"],
      correctIndex: 0,
      hintSnippet: "standing by her white motorboat",
      clueFa: "خط دوم را ببین دوست من! کنار قایق موتوری سفیدش ایستاده است.",
    },
    choiceA: {
      labelEn: "Step into Captain Amy's white boat!",
      labelFa: "سوار قایق سفید کاپیتان ایمی شوید!",
      descriptionFa: "قایق سریع شما را به کنار صخره‌ها می‌رساند.",
    },
    choiceB: {
      labelEn: "Borrow Captain Amy's green rescue net!",
      labelFa: "تور نرم نجات کاپیتان ایمی را قرض بگیر!",
      descriptionFa: "با تور می‌توان لاک‌پشت را بدون آسیب بلند کرد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Ben gently removes the green seaweed with his fingers. Shelly kicks her small flippers happily. Ben lifts Shelly and places her inside the yellow bucket with clean seawater. Sunny licks Ben's cheek. 'Good boy, Sunny!' smiles Ben.",
    keywords: [
      { word: "removes", meaningFa: "جدا می‌کند / برمی‌دارد", phonetic: "/rɪˈmuːvz/" },
      { word: "flippers", meaningFa: "باله‌های شنا", phonetic: "/ˈflɪpəz/" },
      { word: "cheek", meaningFa: "گونه", phonetic: "/tʃiːk/" },
    ],
    question: {
      promptEn: "Where does Ben place Shelly?",
      promptFa: "بن شلی را کجا می‌گذارد؟",
      options: ["Inside the yellow bucket", "In his coat pocket", "On a dry rock"],
      correctIndex: 0,
      hintSnippet: "places her inside the yellow bucket",
      clueFa: "خط سوم را بخوان! داخل سطل زرد با آب تمیز دریا می‌گذارد.",
    },
    choiceA: {
      labelEn: "Carry Shelly to the shallow baby turtle pool!",
      labelFa: "شلی را به حوضچه شنی کم‌عمق لاک‌پشت‌ها ببر!",
      descriptionFa: "آنجا آب آرام است و موج‌های تند ندارد.",
    },
    choiceB: {
      labelEn: "Show Shelly to the friendly beach lifeguard!",
      labelFa: "شلی را به نجات‌غریق مهربان ساحل نشان بده!",
      descriptionFa: "نجات‌غریق یک جعبه امداد مخصوص حیوانات دارد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Ben scoops cool seawater in his hands and pours it gently on Shelly's shell. The green shell shines like an emerald in the sunlight. Shelly crawls forward onto the clean wet sand. Sunny watches quietly.",
    keywords: [
      { word: "scoops", meaningFa: "با دست آب برمی‌دارد", phonetic: "/skuːps/" },
      { word: "emerald", meaningFa: "زمرد درخشان سبز", phonetic: "/ˈemərəld/" },
      { word: "crawls", meaningFa: "سینه‌خیز می‌رود / راه می‌رود", phonetic: "/krɔːlz/" },
    ],
    question: {
      promptEn: "What shines like an emerald?",
      promptFa: "چه چیزی مثل زمرد می‌درخشد؟",
      options: ["The green shell", "A silver coin", "A yellow hat"],
      correctIndex: 0,
      hintSnippet: "The green shell shines like an emerald",
      clueFa: "خط دوم را نگاه کن! لاک سبز شلی می‌درخشد.",
    },
    choiceA: {
      labelEn: "Guide Shelly down to the gentle waves!",
      labelFa: "شلی را به سمت موج‌های آرام دریا راهنمایی کن!",
      descriptionFa: "شلی آماده شنا در آب‌های خنک است.",
    },
    choiceB: {
      labelEn: "Build a soft sand shelter for Shelly!",
      labelFa: "یک سایه‌بان شنی نرم برای استراحت شلی بساز!",
      descriptionFa: "آفتاب ظهر گرم است و سایه برای او خوب است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Ben and Sunny step into Captain Amy's boat. Captain Amy turns the key and the motor hums: chug-chug! The boat glides across the water to the rocks. Captain Amy reaches down and lifts Shelly safely aboard.",
    keywords: [
      { word: "hums", meaningFa: "صدای ملایم کار کردن موتور", phonetic: "/hʌmz/" },
      { word: "aboard", meaningFa: "روی عرشه قایق", phonetic: "/əˈbɔːd/" },
      { word: "reaches", meaningFa: "دست دراز می‌کند", phonetic: "/ˈriːtʃɪz/" },
    ],
    question: {
      promptEn: "What sound does the motor make?",
      promptFa: "موتور قایق چه صدایی تولید می‌کند؟",
      options: ["Chug-chug", "Beep-beep", "Ring-ring"],
      correctIndex: 0,
      hintSnippet: "the motor hums: chug-chug!",
      clueFa: "خط دوم را ببین! صدای چاگ-چاگ می‌دهد.",
    },
    choiceA: {
      labelEn: "Wrap Shelly in a soft blue towel!",
      labelFa: "شلی را در یک حوله نرم آبی بپیچ!",
      descriptionFa: "حوله مرطوب لاک‌پشت را آرام و شاداب نگه می‌دارد.",
    },
    choiceB: {
      labelEn: "Check Shelly's little flippers with Captain Amy!",
      labelFa: "با کاپیتان ایمی باله‌های کوچک شلی را بررسی کنید!",
      descriptionFa: "باید مطمئن شوید هیچ جلبکی به پایش نمانده باشد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Ben holds the soft green rescue net. He walks to the wet rocks. Carefully, he slips the net under Shelly and lifts her up. Shelly is safe! Captain Amy claps her hands. 'Excellent rescue, Ben!' she cheers.",
    keywords: [
      { word: "slips", meaningFa: "آهسته سر می‌دهد و می‌گذارد", phonetic: "/slɪps/" },
      { word: "safe", meaningFa: "امن و در امان", phonetic: "/seɪf/" },
      { word: "cheers", meaningFa: "تشویق می‌کند و هورا می‌کشد", phonetic: "/tʃɪəz/" },
    ],
    question: {
      promptEn: "What color is the rescue net?",
      promptFa: "تور نجات چه رنگی است؟",
      options: ["Soft green", "Dark red", "Bright pink"],
      correctIndex: 0,
      hintSnippet: "the soft green rescue net",
      clueFa: "خط اول را بخوان دوست من! تور نرم سبز رنگ است.",
    },
    choiceA: {
      labelEn: "Walk Shelly back to the soft sand beach!",
      labelFa: "شلی را به ساحل شنی نرم برگردانید!",
      descriptionFa: "روی شن‌های نرم بچه‌ها منتظر دیدن او هستند.",
    },
    choiceB: {
      labelEn: "Reward Sunny with a crunchy dog biscuit!",
      labelFa: "به سانی یک بیسکویت ترد سگ جایزه بده!",
      descriptionFa: "سانی با پارس کردن اول لاک‌پشت را پیدا کرد.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Ben carries the yellow bucket to the baby turtle pool. The water in the pool is clear and warm. Three other tiny turtles are swimming there. Shelly paddles her feet and joins them.",
    keywords: [
      { word: "pool", meaningFa: "حوضچه طبیعی کم‌عمق", phonetic: "/puːl/" },
      { word: "paddles", meaningFa: "پارو می‌زند و شنا می‌کند", phonetic: "/ˈpædlz/" },
      { word: "joins", meaningFa: "به آن‌ها ملحق می‌شود", phonetic: "/dʒɔɪnz/" },
    ],
    question: {
      promptEn: "How many other turtles are swimming in the pool?",
      promptFa: "چند لاک‌پشت دیگر در حوضچه شنا می‌کنند؟",
      options: ["Three other turtles", "Twenty turtles", "Zero turtles"],
      correctIndex: 0,
      hintSnippet: "Three other tiny turtles are swimming there.",
      clueFa: "خط سوم را نگاه کن! سه لاک‌پشت کوچک دیگر آنجا هستند.",
    },
    choiceA: {
      labelEn: "Watch the four baby turtles swim happily!",
      labelFa: "شنای شاد چهار لاک‌پشت کوچک را تماشا کنید!",
      descriptionFa: "آن‌ها با هم دور حوضچه چرخ می‌زنند.",
    },
    choiceB: {
      labelEn: "Sprinkle healthy turtle food into the water!",
      labelFa: "غذای مخصوص لاک‌پشت‌ها را در آب بپاش!",
      descriptionFa: "لاک‌پشت‌ها برگ‌های سبز آبزی را خیلی دوست دارند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Ben shows Shelly to the beach lifeguard named Jack. Jack checks Shelly's shell and smiles warmly. 'She is completely healthy, Ben! You are a real hero,' Jack says.",
    keywords: [
      { word: "lifeguard", meaningFa: "نجات‌غریق ساحل", phonetic: "/ˈlaɪfɡɑːd/" },
      { word: "hero", meaningFa: "قهرمان مهربان", phonetic: "/ˈhɪərəʊ/" },
      { word: "healthy", meaningFa: "سالم و قوی", phonetic: "/ˈhelθi/" },
    ],
    question: {
      promptEn: "What is the lifeguard's name?",
      promptFa: "اسم نجات‌غریق ساحل چیست؟",
      options: ["Jack", "Tom", "Leo"],
      correctIndex: 0,
      hintSnippet: "the beach lifeguard named Jack",
      clueFa: "خط اول را بخوان! اسمش جک است.",
    },
    choiceA: {
      labelEn: "Receive a junior lifeguard badge from Jack!",
      labelFa: "یک مدال نجات‌غریق نوجوان از جک هدیه بگیر!",
      descriptionFa: "مدال ستاره‌ای روی پیراهنت می‌درخشد.",
    },
    choiceB: {
      labelEn: "Put a clean white bandage on your scratch!",
      labelFa: "یک چسب‌زخم سفید روی خراش دستت بزن!",
      descriptionFa: "جک با مهربانی دستت را ضدعفونی می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Shelly crawls toward the foaming blue waves. Sunny walks beside Shelly like a little guard dog. When the cool water touches Shelly's feet, she glides into the ocean with joy.",
    keywords: [
      { word: "foaming", meaningFa: "کف‌آلود و سفید", phonetic: "/ˈfəʊmɪŋ/" },
      { word: "guard", meaningFa: "محافظ مهربان", phonetic: "/ɡɑːd/" },
      { word: "glides", meaningFa: "به آرامی در آب شنا می‌کند", phonetic: "/ɡlaɪdz/" },
    ],
    question: {
      promptEn: "Who walks beside Shelly like a guard dog?",
      promptFa: "چه کسی مثل یک سگ محافظ کنار شلی راه می‌رود؟",
      options: ["Sunny", "A big horse", "A yellow duck"],
      correctIndex: 0,
      hintSnippet: "Sunny walks beside Shelly like a little guard dog.",
      clueFa: "خط اول را ببین! سانی کنار شلی راه می‌رود.",
    },
    choiceA: {
      labelEn: "Wave goodbye to Shelly as she swims!",
      labelFa: "در حالی که شلی شنا می‌کند برایش دست تکان بده!",
      descriptionFa: "شلی سر کوچکش را از آب بیرون می‌آورد و نگاه می‌کند.",
    },
    choiceB: {
      labelEn: "Take a souvenir photo of Shelly in the water!",
      labelFa: "یک عکس یادگاری از شنا کردن شلی در آب بگیر!",
      descriptionFa: "این عکس همیشه در آلبوم خاطراتت می‌ماند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Ben and Sunny build a little sand castle with palm leaves on top. The shelter keeps Shelly cool in the afternoon sun. Shelly rests peacefully on the damp sand.",
    keywords: [
      { word: "palm", meaningFa: "نخل ساحلی", phonetic: "/pɑːm/" },
      { word: "damp", meaningFa: "مرطوب و خنک", phonetic: "/dæmp/" },
      { word: "shelter", meaningFa: "سایه‌بان و پناهگاه", phonetic: "/ˈʃeltər/" },
    ],
    question: {
      promptEn: "What leaves are on top of the castle?",
      promptFa: "چه برگ‌هایی بالای قلعه شنی است؟",
      options: ["Palm leaves", "Oak leaves", "Rose petals"],
      correctIndex: 0,
      hintSnippet: "with palm leaves on top",
      clueFa: "خط اول را نگاه کن! برگ‌های درخت نخل است.",
    },
    choiceA: {
      labelEn: "Decorate the sand castle with pretty seashells!",
      labelFa: "قلعه شنی را با صدف‌های خوشگل تزیین کن!",
      descriptionFa: "صدف‌های صورتی و سفید قلعه را قشنگ‌تر می‌کنند.",
    },
    choiceB: {
      labelEn: "Wait until sunset to release Shelly into the sea!",
      labelFa: "تا غروب آفتاب صبر کن و بعد شلی را به آب بسپار!",
      descriptionFa: "هنگام غروب آفتاب آب دریا آرام و خنک‌تر است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Captain Amy wraps Shelly in the blue towel. Shelly tucks her head in and closes her eyes. Sunny sniffs Shelly's shell gently. 'She is resting now,' says Captain Amy.",
    keywords: [
      { word: "towel", meaningFa: "حوله نرم", phonetic: "/ˈtaʊəl/" },
      { word: "sniffs", meaningFa: "بو می‌کشد", phonetic: "/snɪfs/" },
      { word: "tucks", meaningFa: "داخل می‌برد / جمع می‌کند", phonetic: "/tʌks/" },
    ],
    question: {
      promptEn: "What does Sunny sniff gently?",
      promptFa: "سانی با مهربانی چه چیزی را بو می‌کشد؟",
      options: ["Shelly's shell", "A motor wheel", "A piece of cheese"],
      correctIndex: 0,
      hintSnippet: "Sunny sniffs Shelly's shell gently.",
      clueFa: "خط دوم را بخوان! لاک شلی را بو می‌کشد.",
    },
    choiceA: {
      labelEn: "Steer the boat back to the harbor dock!",
      labelFa: "قایق را به سمت اسکله بندرگاه هدایت کنید!",
      descriptionFa: "مردم در اسکله منتظر شنیدن خبر نجات هستند.",
    },
    choiceB: {
      labelEn: "Feed Shelly small fresh ocean shrimp!",
      labelFa: "به شلی میگوهای ریز تازه تعارف کن!",
      descriptionFa: "غذای تازه انرژی لاک‌پشت را برمی‌گرداند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Captain Amy and Ben check Shelly's flippers. Every flipper is strong and clean. No seaweed is left. Shelly flaps her flippers in the air as if flying. Ben laughs with joy.",
    keywords: [
      { word: "flaps", meaningFa: "بال بال می‌زند", phonetic: "/flæps/" },
      { word: "left", meaningFa: "باقی مانده", phonetic: "/left/" },
      { word: "flying", meaningFa: "پرواز کردن", phonetic: "/ˈflaɪɪŋ/" },
    ],
    question: {
      promptEn: "How are Shelly's flippers?",
      promptFa: "باله‌های شلی چطور هستند؟",
      options: ["Strong and clean", "Hurt and dirty", "Cold and broken"],
      correctIndex: 0,
      hintSnippet: "Every flipper is strong and clean.",
      clueFa: "خط اول را ببین! قوی و کاملاً تمیز هستند.",
    },
    choiceA: {
      labelEn: "Lower Shelly into the calm bay water!",
      labelFa: "شلی را به آرامی در آب‌های آرام خلیج بگذار!",
      descriptionFa: "شلی با خوشحالی به سوی خانه دریایی‌اش شنا می‌کند.",
    },
    choiceB: {
      labelEn: "Sound the boat horn to celebrate the rescue!",
      labelFa: "بوق شاد قایق را برای جشن نجات به صدا درآور!",
      descriptionFa: "صدای بوق قایق خبر سلامتی شلی را اعلام می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Ben carries the green net to the soft sand beach. A group of school children gather around. 'Look at the baby turtle!' they shout happily. Ben explains how Sunny helped Shelly.",
    keywords: [
      { word: "gather", meaningFa: "دور هم جمع شدن", phonetic: "/ˈɡæðər/" },
      { word: "group", meaningFa: "گروهی از بچه‌ها", phonetic: "/ɡruːp/" },
      { word: "explains", meaningFa: "توضیح می‌دهد", phonetic: "/ɪkˈspleɪnz/" },
    ],
    question: {
      promptEn: "Who gathers around Ben on the beach?",
      promptFa: "چه کسانی دور بن در ساحل جمع می‌شوند؟",
      options: ["A group of school children", "Three sailors", "Nobody"],
      correctIndex: 0,
      hintSnippet: "A group of school children gather around.",
      clueFa: "خط اول را بخوان! گروهی از دانش‌آموزان جمع می‌شوند.",
    },
    choiceA: {
      labelEn: "Teach the kids how to keep the beach clean!",
      labelFa: "به بچه‌ها یاد بده چطور ساحل را تمیز نگه دارند!",
      descriptionFa: "ساحل تمیز جان تمام حیوانات دریایی را نجات می‌دهد.",
    },
    choiceB: {
      labelEn: "Let each child gently wave at Shelly!",
      labelFa: "بگذار هر کودک با مهربانی برای شلی دست تکان دهد!",
      descriptionFa: "همه از دیدن این لاک‌پشت کوچولو غرق شادی می‌شوند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Ben feeds Sunny a bone-shaped biscuit. Crunch! Sunny wags his golden tail and jumps with joy. Captain Amy smiles. 'Sunny is the best rescue puppy on the coast!' she says.",
    keywords: [
      { word: "biscuit", meaningFa: "بیسکویت استخوانی ترد", phonetic: "/ˈbɪskɪt/" },
      { word: "crunch", meaningFa: "صدای خرد شدن بیسکویت", phonetic: "/krʌntʃ/" },
      { word: "coast", meaningFa: "خط ساحلی", phonetic: "/kəʊst/" },
    ],
    question: {
      promptEn: "What shape is the biscuit?",
      promptFa: "بیسکویت چه شکلی است؟",
      options: ["Bone-shaped", "Star-shaped", "Round"],
      correctIndex: 0,
      hintSnippet: "a bone-shaped biscuit",
      clueFa: "خط اول را ببین! به شکل استخوان است.",
    },
    choiceA: {
      labelEn: "Give Sunny a clean bowl of fresh water!",
      labelFa: "یک کاسه آب خنک و تمیز به سانی بده!",
      descriptionFa: "سانی بعد از دویدن تشنه شده است.",
    },
    choiceB: {
      labelEn: "Put a red rescue bandana on Sunny's collar!",
      labelFa: "دستمال‌گردن قرمز نجات را به قلاده سانی ببند!",
      descriptionFa: "سانی شبیه یک سگ نجات واقعی و قهرمان می‌شود.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "All four baby turtles swim in a circle. Shelly leads the group with quick flipper kicks. The shallow water sparkles with morning sun.",
    keywords: [{ word: "sparkles", meaningFa: "می‌درخشد", phonetic: "/ˈspɑːklz/" }],
    question: {
      promptEn: "Who leads the group of baby turtles?",
      promptFa: "چه کسی گروه لاک‌پشت‌ها را رهبری می‌کند؟",
      options: ["Shelly", "A fish", "Sunny"],
      correctIndex: 0,
      hintSnippet: "Shelly leads the group",
      clueFa: "شلی گروه را رهبری می‌کند.",
    },
    choiceA: {
      labelEn: "Name the baby turtle pool 'Shelly's Haven'!",
      labelFa: "اسم حوضچه را 'پناهگاه شلی' بگذار!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Create an informational sign about sea turtles!",
      labelFa: "یک تابلوی آموزشی درباره لاک‌پشت‌های دریایی بساز!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Ben drops green seaweed flakes into the clear pool. The baby turtles nibble the food eagerly. Sunny watches with wagging tail.",
    keywords: [{ word: "nibble", meaningFa: "نوک زدن و گاز زدن با آرامش", phonetic: "/ˈnɪbl/" }],
    question: {
      promptEn: "What do the baby turtles nibble?",
      promptFa: "لاک‌پشت‌های کوچک چه چیزی را می‌خورند؟",
      options: ["Green seaweed flakes", "Chocolate cake", "Bread crumbs"],
      correctIndex: 0,
      hintSnippet: "green seaweed flakes",
      clueFa: "تکه‌های جلبک سبز را می‌خورند.",
    },
    choiceA: {
      labelEn: "Feed the baby turtles every morning at ten!",
      labelFa: "هر صبح ساعت ده به لاک‌پشت‌ها غذا بده!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Plant green marine plants around the pool edge!",
      labelFa: "گیاهان دریایی دور لبه حوضچه بکار!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Jack pins a golden junior lifeguard badge onto Ben's shirt. 'You showed great bravery and kindness today,' Jack announces.",
    keywords: [{ word: "bravery", meaningFa: "شجاعت و دلیری", phonetic: "/ˈbreɪvəri/" }],
    question: {
      promptEn: "What does Jack pin onto Ben's shirt?",
      promptFa: "جک چه نشانی روی پیراهن بن می‌زند؟",
      options: ["A golden junior lifeguard badge", "A flower", "A plastic button"],
      correctIndex: 0,
      hintSnippet: "a golden junior lifeguard badge",
      clueFa: "یک نشان طلایی نجات‌غریق نوجوان می‌زند.",
    },
    choiceA: {
      labelEn: "Join the beach lifeguard patrol every weekend!",
      labelFa: "هر آخر هفته در گشت نجات‌غریق ساحل شرکت کن!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Wear the badge proudly to school on Monday!",
      labelFa: "دوشنبه مدال را با افتخار به مدرسه ببر!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Jack covers the scratch with a dolphin-patterned bandage. Ben smiles. 'It does not hurt at all now!' he says.",
    keywords: [{ word: "bandage", meaningFa: "چسب‌زخم قشنگ", phonetic: "/ˈbændɪdʒ/" }],
    question: {
      promptEn: "What pattern is on the bandage?",
      promptFa: "چه نقشی روی چسب‌زخم است؟",
      options: ["Dolphin pattern", "Car pattern", "Apple pattern"],
      correctIndex: 0,
      hintSnippet: "dolphin-patterned bandage",
      clueFa: "طرح دلفین روی چسب‌زخم است.",
    },
    choiceA: {
      labelEn: "Thank Jack with a warm high-five!",
      labelFa: "با یک دست دادن محکم و شاد از جک تشکر کن!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Help Jack pack the beach first-aid kit!",
      labelFa: "به جک در مرتب کردن جعبه کمک‌های اولیه کمک کن!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Ben and Sunny stand on the wet sand, waving their hands and paws. Shelly surfaces one last time, bobs her head, and swims into the blue sea.",
    keywords: [{ word: "bobs", meaningFa: "بالا و پایین تکان می‌دهد", phonetic: "/bɒbz/" }],
    question: {
      promptEn: "What does Shelly do before swimming away?",
      promptFa: "شلی قبل از شنا کردن چه کار می‌کند؟",
      options: ["Bobs her head", "Cries loudly", "Sleeps on sand"],
      correctIndex: 0,
      hintSnippet: "bobs her head",
      clueFa: "سرش را به نشانه تشکر تکان می‌دهد.",
    },
    choiceA: {
      labelEn: "Watch the open ocean until sunset arrives!",
      labelFa: "تا غروب آفتاب به افق دریای باز نگاه کن!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Collect ten shiny seashells to remember this day!",
      labelFa: "ده صدف درخشان برای یادگاری این روز جمع کن!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Ben takes a photo of Shelly gliding through the foam. The picture captures the sunlight glistening on her emerald shell.",
    keywords: [{ word: "glistening", meaningFa: "درخشش قطره‌های آب", phonetic: "/ˈɡlɪsnɪŋ/" }],
    question: {
      promptEn: "What glistens in the picture?",
      promptFa: "در عکس چه چیزی می‌درخشد؟",
      options: ["Sunlight on Shelly's shell", "A rock", "A hat"],
      correctIndex: 0,
      hintSnippet: "sunlight glistening on her emerald shell",
      clueFa: "نور آفتاب روی لاک زمردی شلی می‌درخشد.",
    },
    choiceA: {
      labelEn: "Print the photo for the school science magazine!",
      labelFa: "عکس را برای مجله علمی مدرسه چاپ کن!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Hang the photo above Sunny's dog bed!",
      labelFa: "عکس را بالای جای خواب سانی آویزان کن!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Ben presses pink and white seashells into the walls of the sand castle. Shelly rests under the palm shade, cool and comfortable.",
    keywords: [{ word: "shade", meaningFa: "سایه خنک", phonetic: "/ʃeɪd/" }],
    question: {
      promptEn: "What color seashells does Ben press into the walls?",
      promptFa: "بن چه صدف‌هایی روی دیوارهای قلعه می‌گذارد؟",
      options: ["Pink and white seashells", "Black stones", "Blue buttons"],
      correctIndex: 0,
      hintSnippet: "pink and white seashells",
      clueFa: "صدف‌های صورتی و سفید می‌گذارد.",
    },
    choiceA: {
      labelEn: "Take a picture of the seashell sand castle!",
      labelFa: "از قلعه شنی صدفی عکس بگیر!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Add tiny sand towers on the four corners!",
      labelFa: "چهار برج شنی کوچک در گوشه‌های قلعه بساز!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "When the evening sun turns the sky orange, Ben carries Shelly to the cool tide. Shelly walks into the water and paddles toward the reef.",
    keywords: [{ word: "reef", meaningFa: "صخره‌های زیر آب دریا", phonetic: "/riːf/" }],
    question: {
      promptEn: "What color does the sky turn in the evening?",
      promptFa: "هنگام غروب آسمان چه رنگی می‌شود؟",
      options: ["Orange", "Green", "White"],
      correctIndex: 0,
      hintSnippet: "turns the sky orange",
      clueFa: "آسمان نارنجی می‌شود.",
    },
    choiceA: {
      labelEn: "Sing a gentle sea lullaby with Sunny!",
      labelFa: "با سانی یک آهنگ ملایم برای دریا بخوانید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Walk home under the first evening stars!",
      labelFa: "زیر اولین ستاره‌های شب به خانه برگردید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Captain Amy docks the boat smoothly. Other fishermen wave their caps. 'Three cheers for Ben and Sunny!' they shout in unison.",
    keywords: [{ word: "unison", meaningFa: "با هم و یک‌صدا", phonetic: "/ˈjuːnɪsn/" }],
    question: {
      promptEn: "What do the fishermen shout?",
      promptFa: "ماهیگیران با هم چه فریاد می‌زنند؟",
      options: ["'Three cheers for Ben and Sunny!'", "'Go home!'", "'Rain is coming!'"],
      correctIndex: 0,
      hintSnippet: "Three cheers for Ben and Sunny!",
      clueFa: "هورا برای بن و سانی فریاد می‌زنند.",
    },
    choiceA: {
      labelEn: "Wave back at the cheerful fishermen!",
      labelFa: "برای ماهیگیران شاد دست تکان بده!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Share fresh fruit with Captain Amy!",
      labelFa: "با کاپیتان ایمی میوه تازه بخورید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Shelly eats two tiny shrimp from Ben's hand. She licks her lips and wiggles her feet. Captain Amy laughs warmly.",
    keywords: [{ word: "wiggles", meaningFa: "تکان تکان دادن", phonetic: "/ˈwɪɡlz/" }],
    question: {
      promptEn: "What does Shelly eat from Ben's hand?",
      promptFa: "شلی از دست بن چه چیزی می‌خورد؟",
      options: ["Two tiny shrimp", "Dry leaves", "A potato"],
      correctIndex: 0,
      hintSnippet: "two tiny shrimp",
      clueFa: "دو میگوی ریز می‌خورد.",
    },
    choiceA: {
      labelEn: "Place Shelly safely in the marine sanctuary!",
      labelFa: "شلی را در پناهگاه دریایی بگذار!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Write Shelly's weight in the rescue logbook!",
      labelFa: "وزن شلی را در دفترچه امداد یادداشت کن!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Ben lowers Shelly into the turquoise bay water. Shelly takes a deep breath and dives cleanly into the gentle depths.",
    keywords: [{ word: "depths", meaningFa: "عمق زلال دریا", phonetic: "/depθs/" }],
    question: {
      promptEn: "What color is the bay water?",
      promptFa: "آب خلیج چه رنگی است؟",
      options: ["Turquoise", "Brown", "Black"],
      correctIndex: 0,
      hintSnippet: "the turquoise bay water",
      clueFa: "آبی فیروزه‌ای است.",
    },
    choiceA: {
      labelEn: "Watch Shelly swim with a school of silver fish!",
      labelFa: "شنای شلی را در کنار ماهی‌های نقره‌ای تماشا کن!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Say a gentle prayer for all ocean creatures!",
      labelFa: "برای سلامتی تمام موجودات دریا دعا کن!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Captain Amy pulls the boat horn: Toot! Toot! The joyful sound echoes across the cliffs. White seagulls take flight and circle overhead.",
    keywords: [{ word: "echoes", meaningFa: "می‌پیچد در هوا", phonetic: "/ˈekəʊz/" }],
    question: {
      promptEn: "What takes flight when the horn blows?",
      promptFa: "وقتی بوق به صدا درمی‌آید چه پرندگانی پرواز می‌کنند؟",
      options: ["White seagulls", "Black crows", "Green parrots"],
      correctIndex: 0,
      hintSnippet: "White seagulls take flight",
      clueFa: "مرغان دریایی سفید پرواز می‌کنند.",
    },
    choiceA: {
      labelEn: "Scatter breadcrumbs for the seagulls on the dock!",
      labelFa: "برای مرغان دریایی روی اسکله تکه نان بریز!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Celebrate with cold lemonade on the pier!",
      labelFa: "روی اسکله لیموناد خنک نوش جان کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Ben tells the children: 'Always put your plastic wrappers in the trash can, so the turtles stay safe!' The children cheer and agree.",
    keywords: [{ word: "wrappers", meaningFa: "جلد‌های پلاستیکی خوراکی", phonetic: "/ˈræpəz/" }],
    question: {
      promptEn: "Where should children put plastic wrappers?",
      promptFa: "بچه‌ها باید پوست پلاستیکی را کجا بیندازند؟",
      options: ["In the trash can", "In the ocean", "On the sand"],
      correctIndex: 0,
      hintSnippet: "in the trash can",
      clueFa: "در سطل زباله باید بیندازند.",
    },
    choiceA: {
      labelEn: "Organize a ten-minute beach cleanup with the kids!",
      labelFa: "یک پاکسازی ده‌دقیقه‌ای ساحل با بچه‌ها راه بینداز!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Give each child an ocean sticker!",
      labelFa: "به هر کودک یک برچسب دریایی هدیه بده!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Each school child takes turns waving at Shelly. Shelly blinks her friendly eyes. Sunny wags his tail and lets the children pat his back.",
    keywords: [{ word: "pat", meaningFa: "نوازش کردن آرام", phonetic: "/pæt/" }],
    question: {
      promptEn: "What do the children pat?",
      promptFa: "بچه‌ها چه چیزی را نوازش می‌کنند؟",
      options: ["Sunny's back", "A tree", "A car"],
      correctIndex: 0,
      hintSnippet: "pat his back",
      clueFa: "پشت سانی را نوازش می‌کنند.",
    },
    choiceA: {
      labelEn: "Walk Shelly safely into the water together!",
      labelFa: "با هم شلی را تا لبه آب همراهی کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Take a big group photo on the sand!",
      labelFa: "یک عکس دسته‌جمعی روی شن‌های ساحل بگیرید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Sunny drinks the clean water greedily. Then he rests his furry head on Ben's knee. The sea breeze cools his golden coat.",
    keywords: [{ word: "furry", meaningFa: "پشمالو و نرم", phonetic: "/ˈfɜːri/" }],
    question: {
      promptEn: "Where does Sunny rest his head?",
      promptFa: "سانی سرش را کجا می‌گذارد؟",
      options: ["On Ben's knee", "In the water", "On a rock"],
      correctIndex: 0,
      hintSnippet: "on Ben's knee",
      clueFa: "روی زانوی بن می‌گذارد.",
    },
    choiceA: {
      labelEn: "Brush Sunny's golden coat with a soft brush!",
      labelFa: "موی طلایی سانی را با برس نرم شانه کن!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Throw a tennis ball for Sunny on the wet sand!",
      labelFa: "یک توپ تنیس برای بازی سانی روی شن‌ها پرتاب کن!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Ben ties the bright red rescue bandana around Sunny's neck. Sunny looks like a proud lifeguard pup. Captain Amy salutes him playfully.",
    keywords: [{ word: "bandana", meaningFa: "دستمال‌گردن تزیینی", phonetic: "/bænˈdænə/" }],
    question: {
      promptEn: "What color is the bandana?",
      promptFa: "دستمال‌گردن چه رنگی است؟",
      options: ["Bright red", "Dark green", "Plain white"],
      correctIndex: 0,
      hintSnippet: "bright red rescue bandana",
      clueFa: "قرمز روشن است.",
    },
    choiceA: {
      labelEn: "Take a hero portrait of Sunny wearing the bandana!",
      labelFa: "یک عکس پرتره قهرمانانه از سانی بگیر!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Celebrate the best rescue day ever with your family!",
      labelFa: "بهترین روز نجات را با خانواده جشن بگیر!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Shelly's Haven", titleFa: "پناهگاه امن شلی", badgeCategory: "legendary", badgeIcon: "🐢", badgeNameFa: "پایان افسانه‌ای", climaxEn: "The baby turtle pool becomes a protected sanctuary where hundreds of turtles grow safely.", climaxFa: "حوضچه نوزادان لاک‌پشت به پناهگاهی امن تبدیل شد که صدها لاک‌پشت در آن به سلامت رشد کردند.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Educational Beach Sign", titleFa: "تابلوی آموزشی ساحل", badgeCategory: "scholar", badgeIcon: "🪧", badgeNameFa: "پایان آموزنده", climaxEn: "Visitors read Ben's colorful sign and learn how to help stranded sea creatures.", climaxFa: "گردشگران تابلوی زیبای بن را خواندند و یاد گرفتند چگونه به موجودات در راه مانده کمک کنند.", xpReward: 175 },
  { pathCode: "AAABA", titleEn: "Daily Morning Feeders", titleFa: "دوستان صبحگاهی لاک‌پشت‌ها", badgeCategory: "heroic", badgeIcon: "🥗", badgeNameFa: "پایان مراقبت", climaxEn: "Ben brings fresh seaweed every morning, greeted by happy flapping flippers.", climaxFa: "بن هر روز صبح جلبک تازه می‌آورد و لاک‌پشت‌ها با بال‌بال زدن به او خوش‌آمد می‌گفتند.", xpReward: 190 },
  { pathCode: "AAABB", titleEn: "The Green Pool Garden", titleFa: "باغچه سبز حوضچه", badgeCategory: "scholar", badgeIcon: "🌱", badgeNameFa: "پایان سرسبز", climaxEn: "Healthy sea grass grows around the pool, creating a cool shady paradise.", climaxFa: "علف‌های دریایی دور حوضچه رشد کردند و بهشتی خنک و زیبا ساختند.", xpReward: 180 },
  { pathCode: "AABAA", titleEn: "Junior Lifeguard on Patrol", titleFa: "گشت نجات‌غریق نوجوان", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان افتخارآمیز", climaxEn: "Ben wears his badge on the weekend patrol, keeping swimmers and wildlife safe.", climaxFa: "بن با نشان نجات‌غریقش آخر هفته‌ها در ساحل مراقب سلامت شناگران و حیوانات بود.", xpReward: 185 },
  { pathCode: "AABBB", titleEn: "The Hero of the Classroom", titleFa: "قهرمان دوست‌داشتنی کلاس", badgeCategory: "funny", badgeIcon: "🏫", badgeNameFa: "پایان محبوبیت", climaxEn: "All the students applaud Ben's courage and ask to hear the turtle story.", climaxFa: "تمام دانش‌آموزان برای بن دست زدند و مشتاقانه داستان نجات لاک‌پشت را شنیدند.", xpReward: 165 },
  { pathCode: "AABBA", titleEn: "The Dolphin Bandage Smile", titleFa: "لبخند چسب‌زخم دلفینی", badgeCategory: "explorer", badgeIcon: "🐬", badgeNameFa: "پایان مهربانی", climaxEn: "With a dolphin sticker and a happy heart, Ben celebrates a joyful rescue.", climaxFa: "با یک چسب‌زخم دلفینی و قلبی شاد، بن روز نجات پرخاطره‌اش را جشن گرفت.", xpReward: 170 },
  { pathCode: "AABBB", titleEn: "First-Aid Kit Master", titleFa: "یادگیری جعبه امداد", badgeCategory: "scholar", badgeIcon: "🩹", badgeNameFa: "پایان امدادگری", climaxEn: "Ben learns basic safety skills that help him care for friends on the beach.", climaxFa: "بن مهارت‌های اولیه امداد را یاد گرفت و توانست در ساحل همیشه مراقب دوستانش باشد.", xpReward: 180 },
  { pathCode: "ABAAA", titleEn: "The Sunset Farewell", titleFa: "خداحافظی در غروب آفتاب", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان رویایی", climaxEn: "Shelly swims peacefully toward the golden horizon under the warm evening glow.", climaxFa: "شلی با آرامش به سمت افق زرین دریا و نور گرم غروب شنا کرد و دور شد.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "Ten Seashell Keepsakes", titleFa: "ده صدف یادگاری", badgeCategory: "scholar", badgeIcon: "🐚", badgeNameFa: "پایان خاطره‌انگیز", climaxEn: "Ten shiny seashells on Ben's desk remind him forever of Shelly's gentle eyes.", climaxFa: "ده صدف درخشان روی میز بن همیشه یادآور چشمان مهربان شلی شدند.", xpReward: 185 },
  { pathCode: "ABABA", titleEn: "Science Magazine Cover", titleFa: "روی جلد مجله علمی", badgeCategory: "legendary", badgeIcon: "📰", badgeNameFa: "پایان مشهور", climaxEn: "The school paper publishes Ben's photo on the front page, inspiring young eco-helpers.", climaxFa: "روزنامه مدرسه عکس بن را در صفحه اول چاپ کرد و الهام‌بخش بقیه بچه‌ها شد.", xpReward: 200 },
  { pathCode: "ABABB", titleEn: "Above the Dog Bed", titleFa: "بالای جای خواب سانی", badgeCategory: "scholar", badgeIcon: "🖼️", badgeNameFa: "پایان دوستانه", climaxEn: "Sunny sleeps under the picture of Shelly, dreaming of waves and sand.", climaxFa: "سانی زیر عکس شلی آرام خوابید و خواب امواج و شن‌های ساحل را دید.", xpReward: 175 },
  { pathCode: "ABBAA", titleEn: "The Seashell Palace", titleFa: "کاخ صدفی ساحل", badgeCategory: "legendary", badgeIcon: "🏰", badgeNameFa: "پایان هنری", climaxEn: "Beach visitors admire the castle of pink shells that sheltered a tiny turtle.", climaxFa: "گردشگران قلعه صدفی صورتی را که پناهگاه لاک‌پشت کوچولو بود تحسین کردند.", xpReward: 200 },
  { pathCode: "ABBAB", titleEn: "Four Corner Sand Towers", titleFa: "چهار برج شنی محکم", badgeCategory: "heroic", badgeIcon: "🏖️", badgeNameFa: "پایان خلاقانه", climaxEn: "The sand fortress stands strong against the breeze until nightfall.", climaxFa: "قلعه شنی با برج‌های چهارتایی‌اش تا شب در برابر نسیم دریا محکم ایستاد.", xpReward: 180 },
  { pathCode: "ABBBA", titleEn: "Sea Lullaby by the Waves", titleFa: "لالایی امواج دریا", badgeCategory: "scholar", badgeIcon: "🎵", badgeNameFa: "پایان موسیقیایی", climaxEn: "Ben and Sunny sing a soft tune as the gentle tide rolls onto the shore.", climaxFa: "بن و سانی آوازی دلنشین خواندند و امواج دریا آرام به ساحل رسیدند.", xpReward: 190 },
  { pathCode: "ABBBB", titleEn: "Walking Home Under Stars", titleFa: "قدم زدن زیر ستاره‌های شب", badgeCategory: "heroic", badgeIcon: "✨", badgeNameFa: "پایان آرامش‌بخش", climaxEn: "Under sparkling stars, Ben and Sunny walk home with happy, proud hearts.", climaxFa: "زیر نور ستاره‌های درخشان، بن و سانی با قلبی سرشار از شادی به خانه برگشتند.", xpReward: 185 },
  { pathCode: "BAAAA", titleEn: "Three Cheers on the Dock", titleFa: "هورا در اسکله بندرگاه", badgeCategory: "legendary", badgeIcon: "⚓", badgeNameFa: "پایان افتخار ملی", climaxEn: "The harbor fishermen celebrate the brave rescue with cheerful whistles.", climaxFa: "ماهیگیران بندرگاه نجات شجاعانه را با سوت و هورا جشن گرفتند.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "Fruit Picnic on the Boat", titleFa: "پیک‌نیک میوه روی قایق", badgeCategory: "scholar", badgeIcon: "🍎", badgeNameFa: "پایان صمیمی", climaxEn: "Juicy apples and sweet oranges taste wonderful after a successful mission.", climaxFa: "سیب‌های آبدار و پرتقال‌های شیرین بعد از یک ماموریت موفقیت‌آمیز چسبیدند.", xpReward: 195 },
  { pathCode: "BAABA", titleEn: "The Marine Sanctuary Star", titleFa: "ستاره پناهگاه دریایی", badgeCategory: "heroic", badgeIcon: "🌊", badgeNameFa: "پایان حفاظت", climaxEn: "Shelly thrives in the safe sanctuary waters, growing into a strong swimmer.", climaxFa: "شلی در آب‌های امن پناهگاه رشد کرد و به شناگری قوی و شاداب تبدیل شد.", xpReward: 175 },
  { pathCode: "BAABB", titleEn: "The Official Rescue Log", titleFa: "ثبت در دفترچه رسمی امداد", badgeCategory: "legendary", badgeIcon: "📖", badgeNameFa: "پایان علمی", climaxEn: "Ben's notes are saved in the harbor archives as a shining example of care.", climaxFa: "یادداشت‌های بن در بایگانی بندرگاه به عنوان نمونه‌ای عالی از مراقبت ثبت شد.", xpReward: 200 },
  { pathCode: "BABAA", titleEn: "Swimming with Silver Fish", titleFa: "شنا با ماهی‌های نقره‌ای", badgeCategory: "heroic", badgeIcon: "🐟", badgeNameFa: "پایان زیبای دریا", climaxEn: "Shelly glides alongside hundreds of shimmering fish in turquoise waters.", climaxFa: "شلی در کنار صدها ماهی درخشان در آب‌های فیروزه‌ای خلیج شنا کرد.", xpReward: 190 },
  { pathCode: "BABAB", titleEn: "Prayer for the Oceans", titleFa: "دعای خیر برای اقیانوس‌ها", badgeCategory: "scholar", badgeIcon: "🙏", badgeNameFa: "پایان معنوی", climaxEn: "Ben hopes that all sea animals find clean waters and gentle friends.", climaxFa: "بن آرزو کرد تمام موجودات دریا آب‌های پاکیزه و دوستانی مهربان داشته باشند.", xpReward: 185 },
  { pathCode: "BABBA", titleEn: "Seagulls Flying High", titleFa: "پرواز مرغان دریایی", badgeCategory: "legendary", badgeIcon: "🕊️", badgeNameFa: "پایان باصفا", climaxEn: "Dozens of white gulls swoop down to share crumbs on the sunlit dock.", climaxFa: "ده‌ها مرغ دریایی فرود آمدند تا تکه‌های نان را روی اسکله آفتابی نوش جان کنند.", xpReward: 200 },
  { pathCode: "BABBB", titleEn: "Cold Lemonade on the Pier", titleFa: "شربت لیمو روی اسکله", badgeCategory: "scholar", badgeIcon: "🍋", badgeNameFa: "پایان دلپذیر", climaxEn: "Sipping cool lemonade with friends is the sweetest way to end a rescue.", climaxFa: "نوشیدن لیموناد خنک در کنار دوستان شیرین‌ترین پایان برای یک روز نجات بود.", xpReward: 180 },
  { pathCode: "BBAAA", titleEn: "The Ten-Minute Clean Beach", titleFa: "ساحل تمیز ده‌دقیقه‌ای", badgeCategory: "legendary", badgeIcon: "🏖️", badgeNameFa: "پایان محیط‌زیستی", climaxEn: "The children fill two big bags of litter, leaving the beach sparkling clean.", climaxFa: "بچه‌ها دو کیسه بزرگ زباله جمع کردند و ساحل را مثل الماس تمیز و درخشان ساختند.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Ocean Sticker Club", titleFa: "باشگاه برچسب‌های دریایی", badgeCategory: "explorer", badgeIcon: "🐬", badgeNameFa: "پایان دوستی", climaxEn: "Every child sticks a turtle badge on their hat, promising to protect nature.", climaxFa: "همه بچه‌ها یک برچسب لاک‌پشت به کلاهشان زدند و قول دادند دوستدار طبیعت باشند.", xpReward: 190 },
  { pathCode: "BBABA", titleEn: "Escort to the Water", titleFa: "بدرقه تا لبه آب", badgeCategory: "scholar", badgeIcon: "🌊", badgeNameFa: "پایان همبستگی", climaxEn: "Twenty smiling children cheer as Shelly paddles out to sea safely.", climaxFa: "بیست کودک خندان با هورا و شادی شلی را تا ورود به آب بدرقه کردند.", xpReward: 175 },
  { pathCode: "BBABB", titleEn: "Big Beach Group Photo", titleFa: "عکس یادگاری بزرگ ساحل", badgeCategory: "scholar", badgeIcon: "📸", badgeNameFa: "پایان خاطره‌انگیز", climaxEn: "A bright group picture shows children, puppy, and the sparkling blue sea.", climaxFa: "یک عکس پر از لبخند بچه‌ها، سانی و دریای آبی درخشان را برای همیشه ثبت کرد.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "The Golden Coat Grooming", titleFa: "شانه زدن موهای طلایی", badgeCategory: "legendary", badgeIcon: "🐕", badgeNameFa: "پایان محبت به حیوانات", climaxEn: "Sunny rests happily as his coat is brushed clean of beach sand.", climaxFa: "سانی در حالی که موهای طلایی‌اش از شن‌های ساحل پاک می‌شد با آرامش خندید.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Sand Tennis Game", titleFa: "بازی با توپ تنیس", badgeCategory: "heroic", badgeIcon: "🎾", badgeNameFa: "پایان بازی و سرگرمی", climaxEn: "Sunny chases the green ball across the wet sand, barking with delight.", climaxFa: "سانی دنبال توپ سبز روی شن‌های خیس دوید و از ته دل پارس شادمانه سر داد.", xpReward: 195 },
  { pathCode: "BBBBA", titleEn: "The Bandana Pup Portrait", titleFa: "عکس پرتره سگ امدادگر", badgeCategory: "funny", badgeIcon: "🧣", badgeNameFa: "پایان خوش‌تیپ", climaxEn: "Sunny's red bandana photo wins the town photo contest as Cutest Lifeguard.", climaxFa: "عکس سانی با دستمال‌گردن قرمز برنده مسابقه بانمک‌ترین غریق‌نجات شهر شد.", xpReward: 170 },
  { pathCode: "BBBBB", titleEn: "The Greatest Beach Rescue Day", titleFa: "بهترین روز نجات در ساحل", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "With love, kindness, and teamwork, Ben and Sunny saved a life and touched every heart.", climaxFa: "با عشق، مهربانی و کار گروهی، بن و سانی جانی را نجات دادند و دل‌های همه را شاد کردند.", xpReward: 200 },
];

export const story5BeachRescue: AdventureStory = buildAdventureStory({
  id: "a1-beach-rescue",
  storyIndex: 5,
  cefr: "A1",
  titleEn: "The Sandy Beach Rescue",
  titleFa: "مأموریت نجات در ساحل شنی",
  genre: "rescue",
  genreLabelFa: "🌊 هیجان و امدادگری",
  genreIcon: "🌊",
  synopsisEn:
    "Ben and his playful puppy Sunny discover a tiny baby turtle stuck in seaweed at the beach. Untangle the seaweed or team up with Captain Amy across 32 heroic endings!",
  synopsisFa:
    "بن و هاپوی بازیگوشش سانی یک بچه لاک‌پشت را پیدا می‌کنند که توی جلبک‌ها گیر کرده. آیا جلبک‌ها را با دست باز می‌کنی یا با قایق کاپیتان ایمی به کمکش می‌روی؟ ۳۲ پایان مهربان و قهرمانانه در انتظار توست!",
  coverImage: "/images/skills/reading/beach-rescue.webp",
  nodes,
  endings,
});
