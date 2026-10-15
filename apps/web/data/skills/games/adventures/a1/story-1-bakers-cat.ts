import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1: The Baker's Cat (گربه بازیگوش نانوا)
// Style: Family and Friends Readers (CEFR A1)
// Grammar: Present Simple, Present Continuous, To Be, was/were, Regular Past (-ed) only!
// Common English Names: Tom, Mr. Brown, Leo, Mrs. Green
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "This is Leo. Leo is an orange cat. He lives in a warm bakery with Mr. Brown. Mr. Brown is a baker. He bakes fresh bread every morning. Today, a sweet cake is on the wooden table. Leo jumps up. He takes the sweet cake and runs out the door! A boy named Tom is watching. Tom wants to help.",
    keywords: [
      { word: "bakery", meaningFa: "نانوایی", phonetic: "/ˈbeɪkəri/" },
      { word: "baker", meaningFa: "نانوا", phonetic: "/ˈbeɪkər/" },
      { word: "sweet", meaningFa: "شیرین و خوشمزه", phonetic: "/swiːt/" },
      { word: "runs", meaningFa: "می‌دود", phonetic: "/rʌnz/" },
    ],
    question: {
      promptEn: "Where does Leo live?",
      promptFa: "لئو کجا زندگی می‌کند؟",
      options: ["In a warm bakery", "In a big school", "In the cold water"],
      correctIndex: 0,
      hintSnippet: "He lives in a warm bakery with Mr. Brown.",
      clueFa: "خط دوم را نگاه کن دوست من! لئو در نانوایی زندگی می‌کند.",
    },
    choiceA: {
      labelEn: "Walk into the garden after Leo!",
      labelFa: "دنبال لئو به سمت باغچه برو!",
      descriptionFa: "شاید لئو پشت گل‌ها قایم شده باشد.",
    },
    choiceB: {
      labelEn: "Call Leo with a small dish of milk!",
      labelFa: "با یک کاسه کوچک شیر لئو را صدا کن!",
      descriptionFa: "گربه‌ها شیر تازه را خیلی دوست دارند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Tom walks into the green garden. He looks around. Leo is sitting near an old blue bicycle. A kind woman named Mrs. Green is watering pink flowers. She smiles at Tom. 'Look behind the big tree!' she says in a soft voice.",
    keywords: [
      { word: "garden", meaningFa: "باغچه", phonetic: "/ˈɡɑːdn/" },
      { word: "bicycle", meaningFa: "دوچرخه", phonetic: "/ˈbaɪsɪkl/" },
      { word: "flowers", meaningFa: "گل‌ها", phonetic: "/ˈflaʊəz/" },
    ],
    question: {
      promptEn: "What color is the old bicycle?",
      promptFa: "دوچرخه قدیمی چه رنگی است؟",
      options: ["Blue", "Red", "Yellow"],
      correctIndex: 0,
      hintSnippet: "an old blue bicycle",
      clueFa: "توی متن نوشته دوچرخه آبی است (blue bicycle).",
    },
    choiceA: {
      labelEn: "Look behind the big apple tree!",
      labelFa: "پشت درخت بزرگ سیب را نگاه کن!",
      descriptionFa: "لئو زیر سایه درخت نشسته است.",
    },
    choiceB: {
      labelEn: "Knock on the small wooden cottage door!",
      labelFa: "درِ کلبه چوبی کوچک را تق‌تق بزن!",
      descriptionFa: "شاید کسی داخل کلبه لئو را دیده باشد.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Tom puts a dish of cold milk on the clean ground. He calls: 'Here, Leo! Good cat!' Leo turns his head. His green eyes are big and bright. But suddenly, a little gray bird lands on the fence. Leo looks at the bird.",
    keywords: [
      { word: "dish", meaningFa: "کاسه / بشقاب کوچک", phonetic: "/dɪʃ/" },
      { word: "fence", meaningFa: "نرده چوبی", phonetic: "/fens/" },
      { word: "bright", meaningFa: "درخشان و براق", phonetic: "/braɪt/" },
    ],
    question: {
      promptEn: "What bird lands on the fence?",
      promptFa: "چه پرنده‌ای روی نرده می‌نشیند؟",
      options: ["A little gray bird", "A big black bird", "A red bird"],
      correctIndex: 0,
      hintSnippet: "a little gray bird lands on the fence",
      clueFa: "یک پرنده خاکستری کوچک (little gray bird).",
    },
    choiceA: {
      labelEn: "Walk softly toward Leo and pet his head!",
      labelFa: "خیلی آرام به سمت لئو برو و سرش را نوازش کن!",
      descriptionFa: "لئو دست مهربان تو را حس می‌کند.",
    },
    choiceB: {
      labelEn: "Wait quietly on the green wooden bench!",
      labelFa: "با آرامش روی نیمکت چوبی سبز منتظر بمان!",
      descriptionFa: "به لئو فرصت بده تا خودش به سمت شیر بیاید.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Tom looks behind the tree. Leo is sitting quietly. In his mouth is the sweet cake. He drops the cake near a nest. Three baby birds are in the nest! They are hungry. Leo wanted to help the baby birds!",
    keywords: [
      { word: "nest", meaningFa: "لانه پرنده", phonetic: "/nest/" },
      { word: "hungry", meaningFa: "گرسنه", phonetic: "/ˈhʌŋɡri/" },
      { word: "drops", meaningFa: "زمین می‌اندازد", phonetic: "/drɒps/" },
    ],
    question: {
      promptEn: "Who is inside the nest?",
      promptFa: "چه کسانی داخل لانه هستند؟",
      options: ["Three baby birds", "Two big cats", "A green frog"],
      correctIndex: 0,
      hintSnippet: "Three baby birds are in the nest",
      clueFa: "سه تا جوجه پرنده کوچک (three baby birds).",
    },
    choiceA: {
      labelEn: "Break the cake into small soft pieces for the birds!",
      labelFa: "کیک را تکه‌های خیلی ریز و نرم کن برای جوجه‌ها!",
      descriptionFa: "تا جوجه‌ها راحت بتوانند بخورند.",
    },
    choiceB: {
      labelEn: "Pick up Leo and carry him back to Mr. Brown!",
      labelFa: "لئو را بغل کن و ببر پیش آقای براون در نانوایی!",
      descriptionFa: "آقای براون خیلی نگران گربه کوچولو است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Tom knocks on the cottage door. An old man named Jack opens the door. Jack smiles warmly. 'Hello! Is this orange cat yours?' Jack asks. Leo is resting on a soft red chair inside the warm room.",
    keywords: [
      { word: "knocks", meaningFa: "در می‌زند", phonetic: "/nɒks/" },
      { word: "opens", meaningFa: "باز می‌کند", phonetic: "/ˈəʊpənz/" },
      { word: "chair", meaningFa: "صندلی راحتی", phonetic: "/tʃeər/" },
    ],
    question: {
      promptEn: "What is the old man's name?",
      promptFa: "اسم پیرمرد مهربان چیست؟",
      options: ["Jack", "Sam", "Leo"],
      correctIndex: 0,
      hintSnippet: "An old man named Jack opens the door",
      clueFa: "اسم پیرمرد جک (Jack) است.",
    },
    choiceA: {
      labelEn: "Ask Jack to show his collection of wooden toys!",
      labelFa: "از جک بخواه اسباب‌بازی‌های چوبی قشنگش را نشان دهد!",
      descriptionFa: "جک اسباب‌بازی‌های دست‌ساز زیبایی دارد.",
    },
    choiceB: {
      labelEn: "Invite Jack and Leo to visit the bakery together!",
      labelFa: "جک و لئو را دعوت کن تا با هم به نانوایی بروند!",
      descriptionFa: "آقای براون برای همه نان داغ می‌پزد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Tom walks softly toward Leo. He pets Leo's soft back. Leo purrs happily: purr, purr! A little girl named Lily arrives with a red ball. 'Can I play with your cat?' Lily asks with a bright smile.",
    keywords: [
      { word: "purrs", meaningFa: "خرخر مهربانانه گربه", phonetic: "/pɜːz/" },
      { word: "arrives", meaningFa: "از راه می‌رسد", phonetic: "/əˈraɪvz/" },
      { word: "ball", meaningFa: "توپ بازی", phonetic: "/bɔːl/" },
    ],
    question: {
      promptEn: "What toy does Lily have in her hand?",
      promptFa: "لیلی چه اسباب‌بازی در دست دارد؟",
      options: ["A red ball", "A toy train", "A book"],
      correctIndex: 0,
      hintSnippet: "Lily arrives with a red ball",
      clueFa: "یک توپ قرمز بازی (red ball).",
    },
    choiceA: {
      labelEn: "Roll the red ball gently across the grass for Leo!",
      labelFa: "توپ قرمز را آرام روی چمن‌ها قل بده برای لئو!",
      descriptionFa: "لئو عاشق دنبال کردن توپ است.",
    },
    choiceB: {
      labelEn: "Sit on the grass and brush Leo's soft orange fur!",
      labelFa: "روی چمن‌ها بنشین و موهای نرم لئو را شانه بزن!",
      descriptionFa: "لئو آرام لم می‌دهد و خرخر می‌کند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Tom waits on the green bench. Leo drinks all the milk! He is very clean. Then, a playful brown puppy named Toby walks into the yard. Toby wags his tail. Toby and Leo look at each other with curious eyes.",
    keywords: [
      { word: "puppy", meaningFa: "توله‌سگ بانمک", phonetic: "/ˈpʌpi/" },
      { word: "wags", meaningFa: "تکان می‌دهد (دمش را)", phonetic: "/wæɡz/" },
      { word: "yard", meaningFa: "حیاط خانه", phonetic: "/jɑːd/" },
    ],
    question: {
      promptEn: "What animal is Toby?",
      promptFa: "توبی چه حیوانی است؟",
      options: ["A playful puppy", "A little bird", "A white rabbit"],
      correctIndex: 0,
      hintSnippet: "a playful brown puppy named Toby",
      clueFa: "یک هاپوی قهوه‌ای بازیگوش (brown puppy).",
    },
    choiceA: {
      labelEn: "Toss a yellow stick for Toby and Leo to play together!",
      labelFa: "یک چوب زرد پرتاب کن تا توبی و لئو با هم بازی کنند!",
      descriptionFa: "بازی دوستانه سگ و گربه در حیاط.",
    },
    choiceB: {
      labelEn: "Walk back to the bakery with both animals!",
      labelFa: "با هر دو حیوان به نانوایی برگرد!",
      descriptionFa: "آقای براون عاشق حیوانات مهربان است.",
    },
  },

  // STEP 4 (8 Nodes: AAA ... BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Tom breaks the cake into little crumbs. The baby birds open their yellow beaks. They eat all the crumbs! Their mother bird lands on the branch and sings a sweet song. Leo watches happily.",
    keywords: [{ word: "crumbs", meaningFa: "خرده‌های نان یا کیک", phonetic: "/krʌmz/" }, { word: "beaks", meaningFa: "نوک پرنده‌ها", phonetic: "/biːks/" }],
    question: { promptEn: "What color are the baby birds' beaks?", promptFa: "نوک جوجه پرنده‌ها چه رنگی است؟", options: ["Yellow beaks", "Black beaks", "Blue beaks"], correctIndex: 0, hintSnippet: "their yellow beaks", clueFa: "نوک‌های زرد (yellow beaks)." },
    choiceA: { labelEn: "Name the baby birds Pip, Pop, and Pet!", labelFa: "اسم جوجه‌ها را پیپ، پاپ و پِت بگذار!", descriptionFa: "پایان شماره ۱ و ۲" },
    choiceB: { labelEn: "Put fresh water in a small dish under the tree!", labelFa: "یک کاسه کوچک آب خنک پای درخت بگذار!", descriptionFa: "پایان شماره ۳ و ۴" },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Tom carries Leo back to the bakery. Mr. Brown is waiting at the door. He is smiling! 'Thank you, Tom!' Mr. Brown says. He gives Tom a fresh, warm apple pie.",
    keywords: [{ word: "carries", meaningFa: "بغل می‌کند و می‌آورد", phonetic: "/ˈkæriz/" }, { word: "waiting", meaningFa: "منتظر بودن", phonetic: "/ˈweɪtɪŋ/" }],
    question: { promptEn: "What does Mr. Brown give to Tom?", promptFa: "آقای براون چی به تام می‌دهد؟", options: ["A warm apple pie", "A cold stone", "A pen"], correctIndex: 0, hintSnippet: "a fresh, warm apple pie", clueFa: "یک پای سیب داغ و خوشمزه (apple pie)." },
    choiceA: { labelEn: "Eat the sweet apple pie with Tom's family!", labelFa: "پای سیب را با خانواده تام بخورید!", descriptionFa: "پایان شماره ۵ و ۶" },
    choiceB: { labelEn: "Help Mr. Brown bake round cookies in the kitchen!", labelFa: "به آقای براون در پختن کوکی‌های گرد کمک کن!", descriptionFa: "پایان شماره ۷ و ۸" },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Jack opens a wooden box. Inside are five wooden animals: a lion, an elephant, a dog, a cat, and a bird. Jack gives Tom the little wooden cat. Leo sniffs the wooden toy gently.",
    keywords: [{ word: "elephant", meaningFa: "فیل", phonetic: "/ˈelɪfənt/" }, { word: "lion", meaningFa: "شیر جنگل", phonetic: "/ˈlaɪən/" }],
    question: { promptEn: "How many wooden animals are inside the box?", promptFa: "چند تا حیوان چوبی داخل جعبه بود؟", options: ["Five", "Two", "Ten"], correctIndex: 0, hintSnippet: "five wooden animals", clueFa: "پنج حیوان چوبی (five)." },
    choiceA: { labelEn: "Paint the wooden cat bright orange like Leo!", labelFa: "گربه چوبی را مثل لئو نارنجی رنگ کن!", descriptionFa: "پایان شماره ۹ و ۱۰" },
    choiceB: { labelEn: "Place the wooden cat on Tom's bedroom desk!", labelFa: "گربه چوبی را روی میز اتاق تام بگذار!", descriptionFa: "پایان شماره ۱۱ و ۱۲" },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Jack and Tom walk into the bakery with Leo. The bakery smells wonderful. Mr. Brown smiles and hugs his old friend Jack. They sit together and drink warm tea.",
    keywords: [{ word: "wonderful", meaningFa: "عالی و شگفت‌انگیز", phonetic: "/ˈwʌndəfl/" }, { word: "hugs", meaningFa: "بغل می‌کند", phonetic: "/hʌɡz/" }],
    question: { promptEn: "What do Jack and Mr. Brown drink together?", promptFa: "جک و آقای براون چی می‌نوشند؟", options: ["Warm tea", "Cold milk", "Salt water"], correctIndex: 0, hintSnippet: "drink warm tea", clueFa: "چای گرم (warm tea)." },
    choiceA: { labelEn: "Listen to funny stories about the old town!", labelFa: "به داستان‌های خنده‌دار از گذشته شهر گوش کن!", descriptionFa: "پایان شماره ۱۳ و ۱۴" },
    choiceB: { labelEn: "Play with Leo on the soft rug by the oven!", labelFa: "کنار فر نانوایی با لئو روی قالیچه بازی کن!", descriptionFa: "پایان شماره ۱۵ و ۱۶" },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Tom rolls the red ball. Leo jumps and catches the ball with his paws! Lily claps her hands. 'Good job, Leo!' she shouts happily. Leo wiggles his tail with joy.",
    keywords: [{ word: "catches", meaningFa: "می‌گیرد / قاپ می‌زند", phonetic: "/ˈkætʃɪz/" }, { word: "shouts", meaningFa: "با صدای بلند فریاد می‌زند", phonetic: "/ʃaʊts/" }],
    question: { promptEn: "How does Leo catch the red ball?", promptFa: "لئو چطور توپ را می‌گیرد؟", options: ["With his paws", "With his ears", "With his eyes"], correctIndex: 0, hintSnippet: "catches the ball with his paws", clueFa: "با پنجه‌هایش (with his paws)." },
    choiceA: { labelEn: "Teach Leo to jump through a plastic yellow hoop!", labelFa: "به لئو یاد بده از داخل حلقه زرد بپرد!", descriptionFa: "پایان شماره ۱۷ و ۱۸" },
    choiceB: { labelEn: "Share fresh red strawberries with Lily and Tom!", labelFa: "با لیلی و تام توت‌فرنگی‌های قرمز تازه بخورید!", descriptionFa: "پایان شماره ۱۹ و ۲۰" },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Tom brushes Leo's orange fur. Leo looks very handsome and tidy. Mrs. Green walks over with a blue ribbon. She ties the blue ribbon around Leo's collar. Leo purrs like a soft engine.",
    keywords: [{ word: "tidy", meaningFa: "مرتب و تمیز", phonetic: "/ˈtaɪdi/" }, { word: "ribbon", meaningFa: "روبان زیبا", phonetic: "/ˈrɪbən/" }],
    question: { promptEn: "What color is the ribbon around Leo's collar?", promptFa: "روبان دور گردن لئو چه رنگی است؟", options: ["Blue", "Yellow", "Green"], correctIndex: 0, hintSnippet: "with a blue ribbon", clueFa: "روبان آبی (blue ribbon)." },
    choiceA: { labelEn: "Take a funny picture of Leo with his blue ribbon!", labelFa: "یک عکس بامزه از لئو با روبان آبی بگیر!", descriptionFa: "پایان شماره ۲۱ و ۲۲" },
    choiceB: { labelEn: "Walk Leo proudly through the sunny town square!", labelFa: "با افتخار لئو را در میدان شهر بگردان!", descriptionFa: "پایان شماره ۲۳ و ۲۴" },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Tom tosses the stick. Toby the puppy runs fast, picks up the stick, and brings it back to Tom. Leo watches from the green grass. Leo and Toby tap noses like best friends.",
    keywords: [{ word: "tosses", meaningFa: "پرتاب می‌کند", phonetic: "/ˈtɒsɪz/" }, { word: "stick", meaningFa: "چوب کوچک", phonetic: "/stɪk/" }],
    question: { promptEn: "Who picks up the stick and brings it back?", promptFa: "چه کسی چوب را برمی‌دارد و برمی‌گرداند؟", options: ["Toby the puppy", "A bird", "A frog"], correctIndex: 0, hintSnippet: "Toby the puppy runs fast, picks up the stick", clueFa: "توبی هاپوی کوچولو (Toby the puppy)." },
    choiceA: { labelEn: "Share a big red blanket on the grass for a nap!", labelFa: "روی چمن‌ها زیر پتوی قرمز چرت بزنید!", descriptionFa: "پایان شماره ۲۵ و ۲۶" },
    choiceB: { labelEn: "Play tag with Toby and Leo around the apple tree!", labelFa: "دور درخت سیب با توبی و لئو گرگم‌به‌هوا بازی کن!", descriptionFa: "پایان شماره ۲۷ و ۲۸" },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Tom, Leo, and Toby arrive at the bakery. Mr. Brown opens the door. He laughs loudly: 'Welcome, little friends!' He fills two bowls with fresh water and gives biscuits to both animals.",
    keywords: [{ word: "biscuits", meaningFa: "بیسکویت‌های خوشمزه", phonetic: "/ˈbɪskɪts/" }, { word: "bowls", meaningFa: "کاسه‌ها", phonetic: "/bəʊlz/" }],
    question: { promptEn: "What does Mr. Brown give to both animals?", promptFa: "آقای براون به هر دو حیوان چی می‌دهد؟", options: ["Biscuits and fresh water", "Nothing", "Old paper"], correctIndex: 0, hintSnippet: "gives biscuits to both animals", clueFa: "بیسکویت و آب تازه (biscuits)." },
    choiceA: { labelEn: "Make Toby and Leo the official bakery helper pets!", labelFa: "توبی و لئو را دستیاران همیشگی نانوایی کن!", descriptionFa: "پایان شماره ۲۹ و ۳۰" },
    choiceB: { labelEn: "Paint a colorful shop sign with pictures of both pets!", labelFa: "یک تابلوی نقاشی با عکس هر دو حیوان بکش!", descriptionFa: "پایان شماره ۳۱ و ۳۲" },
  },

  // STEP 5 (16 Nodes: AAAA ... BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn: "Tom names the birds Pip, Pop, and Pet. The three birds chirp happily in the nest. Leo rests under the tree like a proud guardian.",
    keywords: [{ word: "chirp", meaningFa: "جیک‌جیک کردن", phonetic: "/tʃɜːp/" }],
    question: { promptEn: "How many birds chirp in the nest?", promptFa: "چند پرنده جیک‌جیک می‌کنند؟", options: ["Three", "One", "Ten"], correctIndex: 0, hintSnippet: "The three birds chirp", clueFa: "سه پرنده (three)." },
    choiceA: { labelEn: "Visit the birds every afternoon!", labelFa: "هر روز عصر به دیدن پرنده‌ها بیا!", descriptionFa: "پایان ۱" },
    choiceB: { labelEn: "Sing a happy morning song with the birds!", labelFa: "صبح‌ها با پرنده‌ها ترانه شاد بخوان!", descriptionFa: "پایان ۲" },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn: "Tom puts fresh water in the clean blue dish. The mother bird drinks the water and flutters her wings. Leo watches quietly.",
    keywords: [{ word: "wings", meaningFa: "بال‌های پرنده", phonetic: "/wɪŋz/" }],
    question: { promptEn: "What color is the dish under the tree?", promptFa: "کاسه پای درخت چه رنگی است؟", options: ["Blue", "Black", "Brown"], correctIndex: 0, hintSnippet: "the clean blue dish", clueFa: "کاسه آبی تمیز (blue dish)." },
    choiceA: { labelEn: "Clean the garden path every Saturday!", labelFa: "مسیر باغچه را هر شنبه تمیز کن!", descriptionFa: "پایان ۳" },
    choiceB: { labelEn: "Hang a wooden birdhouse on the tree branch!", labelFa: "یک لانه چوبی قشنگ به شاخه درخت آویزان کن!", descriptionFa: "پایان ۴" },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn: "Tom's mother and father love the warm apple pie. They sit together around the kitchen table. Leo sleeps softly on the rug.",
    keywords: [{ word: "kitchen", meaningFa: "آشپزخانه", phonetic: "/ˈkɪtʃɪn/" }],
    question: { promptEn: "Where do they sit together?", promptFa: "کجا دور هم می‌نشینند؟", options: ["Around the kitchen table", "In the car", "On the roof"], correctIndex: 0, hintSnippet: "around the kitchen table", clueFa: "دور میز آشپزخانه." },
    choiceA: { labelEn: "Say thank you to Mr. Brown with a letter!", labelFa: "با یک نامه قشنگ از آقای براون تشکر کن!", descriptionFa: "پایان ۵" },
    choiceB: { labelEn: "Save a big slice of pie for Tom's best friend!", labelFa: "یک تکه بزرگ پای را برای بهترین دوستت نگه دار!", descriptionFa: "پایان ۶" },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn: "Tom rolls the cookie dough into round shapes. Mr. Brown bakes the cookies in the hot oven. Leo watches with curiosity.",
    keywords: [{ word: "dough", meaningFa: "خمیر شیرینی", phonetic: "/dəʊ/" }],
    question: { promptEn: "Where does Mr. Brown bake the cookies?", promptFa: "آقای براون کوکی‌ها را کجا می‌پزد؟", options: ["In the hot oven", "In the garden", "In the cold water"], correctIndex: 0, hintSnippet: "in the hot oven", clueFa: "داخل فر گرم (hot oven)." },
    choiceA: { labelEn: "Put chocolate chips on top of every cookie!", labelFa: "روی هر کوکی شکلات خوشمزه بگذار!", descriptionFa: "پایان ۷" },
    choiceB: { labelEn: "Pack the cookies in small paper bags for friends!", labelFa: "کوکی‌ها را در پاکت‌های کاغذی برای دوستانت بسته‌بندی کن!", descriptionFa: "پایان ۸" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn: "Tom paints the wooden cat bright orange with yellow stripes. It looks just like Leo! Jack laughs and claps his hands.",
    keywords: [{ word: "stripes", meaningFa: "خط‌ها و راه‌راه‌ها", phonetic: "/straɪps/" }],
    question: { promptEn: "What color stripes does Tom paint on the toy?", promptFa: "تام چه خط‌هایی روی اسباب‌بازی نقاشی می‌کند؟", options: ["Yellow stripes", "Black stripes", "Pink stripes"], correctIndex: 0, hintSnippet: "with yellow stripes", clueFa: "خط‌های زرد (yellow stripes)." },
    choiceA: { labelEn: "Display the painted cat on the bakery counter!", labelFa: "گربه نقاشی‌شده را روی پیشخان نانوایی بگذار!", descriptionFa: "پایان ۹" },
    choiceB: { labelEn: "Give the painted cat to Lily as a gift!", labelFa: "گربه نقاشی‌شده را به لیلی هدیه بده!", descriptionFa: "پایان ۱۰" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn: "Tom places the wooden cat on his study desk beside his English book. Leo jumps up and sleeps right next to the little toy.",
    keywords: [{ word: "desk", meaningFa: "میز تحریر", phonetic: "/desk/" }],
    question: { promptEn: "What book is beside the wooden cat?", promptFa: "چه کتابی کنار گربه چوبی است؟", options: ["His English book", "A map", "A comic"], correctIndex: 0, hintSnippet: "beside his English book", clueFa: "کتاب انگلیسی تام (English book)." },
    choiceA: { labelEn: "Read five pages of English with Leo every night!", labelFa: "هر شب پنج صفحه انگلیسی با لئو بخوان!", descriptionFa: "پایان ۱۱" },
    choiceB: { labelEn: "Keep the toy as a lucky charm for school tests!", labelFa: "اسباب‌بازی را نماد شانس امتحان‌ها قرار بده!", descriptionFa: "پایان ۱۲" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn: "Jack tells funny stories about his childhood adventures. Mr. Brown laughs heartily. Leo purrs warmly on Tom's lap.",
    keywords: [{ word: "lap", meaningFa: "روی زانو و بغل", phonetic: "/læp/" }],
    question: { promptEn: "Where does Leo purr warmly?", promptFa: "لئو کجا آرام خرخر می‌کند؟", options: ["On Tom's lap", "Under a car", "On the street"], correctIndex: 0, hintSnippet: "on Tom's lap", clueFa: "روی زانوی تام (on Tom's lap)." },
    choiceA: { labelEn: "Write Jack's funny stories in a small notebook!", labelFa: "داستان‌های جک را در یک دفترچه یادداشت بنویس!", descriptionFa: "پایان ۱۳" },
    choiceB: { labelEn: "Invite Jack for tea every Sunday morning!", labelFa: "جک را هر یکشنبه صبح برای چای دعوت کن!", descriptionFa: "پایان ۱۴" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn: "Tom and Leo play with a little paper ball on the soft rug. Leo bats the ball with his paw, and it rolls across the floor.",
    keywords: [{ word: "bats", meaningFa: "ضربه می‌زند با پنجه", phonetic: "/bæts/" }],
    question: { promptEn: "What ball does Leo play with on the rug?", promptFa: "لئو با چه توپی روی قالیچه بازی می‌کند؟", options: ["A paper ball", "A heavy stone", "A metal ball"], correctIndex: 0, hintSnippet: "a little paper ball", clueFa: "توپ کاغذی کوچک (paper ball)." },
    choiceA: { labelEn: "Make five colorful paper balls for Leo!", labelFa: "پنج توپ کاغذی رنگارنگ برای لئو درست کن!", descriptionFa: "پایان ۱۵" },
    choiceB: { labelEn: "Tuck Leo into his warm basket for a good night's sleep!", labelFa: "لئو را در سبد گرمش برای خواب ناز بخوابان!", descriptionFa: "پایان ۱۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn: "Leo jumps cleanly through the yellow hoop! Lily and Tom cheer loudly: 'Hooray, Leo!' Leo bows his head like a little circus star.",
    keywords: [{ word: "hoop", meaningFa: "حلقه گرد بازی", phonetic: "/huːp/" }],
    question: { promptEn: "What color is the hoop Leo jumps through?", promptFa: "حلقه‌ای که لئو از آن می‌پرد چه رنگی است؟", options: ["Yellow", "Black", "Brown"], correctIndex: 0, hintSnippet: "the yellow hoop", clueFa: "حلقه زرد رنگ (yellow hoop)." },
    choiceA: { labelEn: "Perform the hoop trick for the neighborhood children!", labelFa: "ترفند حلقه را برای بچه‌های محله اجرا کن!", descriptionFa: "پایان ۱۷" },
    choiceB: { labelEn: "Reward Leo with a delicious piece of cooked fish!", labelFa: "به لئو یک تکه ماهی پخته جایزه بده!", descriptionFa: "پایان ۱۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn: "Lily, Tom, and Leo sit together on the green grass eating sweet red strawberries. The sunny sky is blue and bright.",
    keywords: [{ word: "strawberries", meaningFa: "توت‌فرنگی‌های شیرین", phonetic: "/ˈstrɔːbəriz/" }],
    question: { promptEn: "What fruit do Lily and Tom eat on the grass?", promptFa: "لیلی و تام چه میوه‌ای می‌خورند؟", options: ["Strawberries", "Lemons", "Onions"], correctIndex: 0, hintSnippet: "sweet red strawberries", clueFa: "توت‌فرنگی‌های قرمز (strawberries)." },
    choiceA: { labelEn: "Plant a strawberry bush in the bakery garden!", labelFa: "یک بوته توت‌فرنگی در باغچه نانوایی بکار!", descriptionFa: "پایان ۱۹" },
    choiceB: { labelEn: "Draw a colorful picture of the strawberry picnic!", labelFa: "یک نقاشی قشنگ از پیک‌نیک توت‌فرنگی بکش!", descriptionFa: "پایان ۲۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn: "Tom takes a bright picture of Leo wearing his blue ribbon. In the picture, Leo is winking with one green eye! Lily laughs with joy.",
    keywords: [{ word: "winking", meaningFa: "چشمک زدن", phonetic: "/ˈwɪŋkɪŋ/" }],
    question: { promptEn: "What does Leo do in the picture?", promptFa: "لئو در عکس چه کاری انجام می‌دهد؟", options: ["Winks with one eye", "Cries", "Sleeps"], correctIndex: 0, hintSnippet: "Leo is winking with one green eye", clueFa: "با یک چشم چشمک می‌زند (winking)." },
    choiceA: { labelEn: "Put the funny photo in a picture frame!", labelFa: "عکس خنده‌دار را در قاب عکس بگذار!", descriptionFa: "پایان ۲۱" },
    choiceB: { labelEn: "Show the picture to Mr. Brown at the bakery!", labelFa: "عکس را به آقای براون در نانوایی نشان بده!", descriptionFa: "پایان ۲۲" },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn: "Tom walks Leo through the sunny town square. Neighbors smile and wave. 'What a lovely cat!' an old lady remarks with kindness.",
    keywords: [{ word: "square", meaningFa: "میدان شهر", phonetic: "/skweər/" }],
    question: { promptEn: "Where does Tom walk Leo?", promptFa: "تام لئو را به کجا می‌برد؟", options: ["Through the town square", "Into a dark cave", "On the train"], correctIndex: 0, hintSnippet: "through the sunny town square", clueFa: "میدان آفتابی شهر (town square)." },
    choiceA: { labelEn: "Stop by the fruit shop to buy fresh apples!", labelFa: "جلوی میوه‌فروشی بایست تا سیب تازه بخری!", descriptionFa: "پایان ۲۳" },
    choiceB: { labelEn: "Lead a cheerful parade of friends back to the bakery!", labelFa: "یک رژه شاد از دوستان را به نانوایی هدایت کن!", descriptionFa: "پایان ۲۴" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn: "Toby and Leo cuddle together on the red blanket. The sun is warm. Toby rests his chin on Leo's soft orange back, snoring softly.",
    keywords: [{ word: "cuddle", meaningFa: "بغل کردن و لم دادن با هم", phonetic: "/ˈkʌdl/" }],
    question: { promptEn: "Where does Toby rest his chin?", promptFa: "توبی چانه‌اش را کجا می‌گذارد؟", options: ["On Leo's soft back", "On the grass", "On a stone"], correctIndex: 0, hintSnippet: "on Leo's soft orange back", clueFa: "روی کمر نرم لئو." },
    choiceA: { labelEn: "Cover both sleepy pets with a light towel!", labelFa: "روی هر دو حیوان خوابالو یک حوله سبک بکش!", descriptionFa: "پایان ۲۵" },
    choiceB: { labelEn: "Take a quiet afternoon nap beside the pets!", labelFa: "کنار حیوانات یک چرت آرام بعدازظهری بزن!", descriptionFa: "پایان ۲۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn: "Tom, Toby, and Leo run around the big apple tree. They play tag until everyone is laughing and tired. The birds chirp from the green branches.",
    keywords: [{ word: "tag", meaningFa: "بازی گرگم‌به‌هوا", phonetic: "/tæɡ/" }],
    question: { promptEn: "What tree do they run around?", promptFa: "دور چه درختی می‌دوند؟", options: ["The big apple tree", "A small bush", "A pine tree"], correctIndex: 0, hintSnippet: "around the big apple tree", clueFa: "درخت بزرگ سیب (big apple tree)." },
    choiceA: { labelEn: "Pick two juicy red apples from the low branch!", labelFa: "دو سیب قرمز آبدار از شاخه بچین!", descriptionFa: "پایان ۲۷" },
    choiceB: { labelEn: "Build a small wooden bench under the tree!", labelFa: "یک نیمکت کوچک چوبی زیر درخت بساز!", descriptionFa: "پایان ۲۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn: "Toby and Leo wear matching yellow bandanas. They sit politely by the bakery door, greeting every morning customer with a smile.",
    keywords: [{ word: "bandanas", meaningFa: "دستمال‌گردن‌های پارچه‌ای", phonetic: "/bænˈdænəz/" }],
    question: { promptEn: "What do Toby and Leo wear around their necks?", promptFa: "توبی و لئو چه چیزی به گردن بسته‌اند؟", options: ["Yellow bandanas", "Heavy bells", "Nothing"], correctIndex: 0, hintSnippet: "matching yellow bandanas", clueFa: "دستمال‌گردن‌های زرد (yellow bandanas)." },
    choiceA: { labelEn: "Name them the Bakery's Best Greeters!", labelFa: "آن‌ها را بهترین خوش‌آمدگویان نانوایی بنام!", descriptionFa: "پایان ۲۹" },
    choiceB: { labelEn: "Give them special crunchy biscuits every morning!", labelFa: "هر روز صبح به آن‌ها بیسکویت‌های ترد جایزه بده!", descriptionFa: "پایان ۳۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn: "Tom finishes painting a beautiful wooden sign: 'Mr. Brown's Bakery: Home of Leo and Toby'. Mr. Brown hangs the sign above the front window.",
    keywords: [{ word: "sign", meaningFa: "تابلوی مغازه", phonetic: "/saɪn/" }],
    question: { promptEn: "Where does Mr. Brown hang the wooden sign?", promptFa: "آقای براون تابلو را کجا آویزان می‌کند؟", options: ["Above the front window", "On the floor", "In the trash"], correctIndex: 0, hintSnippet: "above the front window", clueFa: "بالای پنجره جلوی مغازه." },
    choiceA: { labelEn: "Celebrate with fresh milk and warm bread!", labelFa: "با شیر تازه و نان داغ جشن بگیرید!", descriptionFa: "پایان ۳۱" },
    choiceB: { labelEn: "Smile knowing that kindness makes every day happy!", labelFa: "با این دانایی که مهربانی روزها را شاد می‌کند لبخند بزن!", descriptionFa: "پایان ۳۲" },
  },
];

// 32 UNIQUE ENDINGS (Family & Friends Style)
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Friends of the Birds", titleFa: "دوستان پرندگان کوچک", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان طلایی", climaxEn: "Tom, Leo, and the baby birds are great friends. Every day, the birds sing near the bakery window.", climaxFa: "تام، لئو و پرنده‌ها دوستان صمیمی شدند و پرنده‌ها هر روز لب پنجره آواز می‌خوانند.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Morning Song", titleFa: "ترانه شاد صبحگاهی", badgeCategory: "heroic", badgeIcon: "🎶", badgeNameFa: "پایان زیبا", climaxEn: "Tom sings a happy song every morning, and Leo purrs along softly on the windowsill.", climaxFa: "تام هر روز صبح ترانه‌ای شاد می‌خواند و لئو با آرامش روی طاقچه خرخر می‌کند.", xpReward: 160 },
  { pathCode: "AAABA", titleEn: "The Clean Garden Path", titleFa: "مسیر تمیز باغچه", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان مهربان", climaxEn: "The garden is clean and green. Butterflies flutter around the flowers all afternoon.", climaxFa: "باغچه تمیز و سرسبز شد و پروانه‌ها تمام بعدازظهر دور گل‌ها پرواز می‌کنند.", xpReward: 150 },
  { pathCode: "AAABB", titleEn: "The Wooden Birdhouse", titleFa: "لانه چوبی پرنده‌ها", badgeCategory: "secret", badgeIcon: "🏡", badgeNameFa: "پایان پرنده", climaxEn: "The bird family lives safely in the new wooden house on the apple tree branch.", climaxFa: "خانواده پرنده‌ها با امنیت در لانه چوبی جدید روی شاخه درخت زندگی می‌کنند.", xpReward: 155 },
  { pathCode: "AABAA", titleEn: "The Thank-You Letter", titleFa: "نامه تشکر برای نانوا", badgeCategory: "scholar", badgeIcon: "💌", badgeNameFa: "پایان مؤدبانه", climaxEn: "Mr. Brown reads Tom's sweet letter and smiles happily. He hangs it by the oven.", climaxFa: "آقای براون نامه محبت‌آمیز تام را خواند و با خوشحالی آن را کنار تنور نصب کرد.", xpReward: 160 },
  { pathCode: "AABAB", titleEn: "A Sweet Slice for a Friend", titleFa: "تکه شیرین برای دوست", badgeCategory: "funny", badgeIcon: "🥧", badgeNameFa: "پایان شیرین", climaxEn: "Tom shares the delicious apple pie with his friend Sam. Both boys laugh and smile.", climaxFa: "تام پای سیب خوشمزه را با دوستش سام تقسیم کرد و هر دو خندیدند.", xpReward: 145 },
  { pathCode: "AABBA", titleEn: "The Chocolate Chip Cookies", titleFa: "کوکی‌های شکلاتی داغ", badgeCategory: "funny", badgeIcon: "🍪", badgeNameFa: "پایان خوشمزه", climaxEn: "The cookies are sweet and warm. Mr. Brown and Tom eat cookies together with cold milk.", climaxFa: "کوکی‌های شکلاتی آماده شدند و آقای براون و تام با شیر خنک آن‌ها را نوش جان کردند.", xpReward: 150 },
  { pathCode: "AABBB", titleEn: "Paper Bags of Joy", titleFa: "پاکت‌های پر از کوکی", badgeCategory: "heroic", badgeIcon: "🛍️", badgeNameFa: "پایان بخشنده", climaxEn: "Tom hands small bags of fresh cookies to five children in the neighborhood.", climaxFa: "تام به پنج کودک در محله پاکت‌های کوکی تازه هدیه داد و همه خوشحال شدند.", xpReward: 165 },
  { pathCode: "ABAAA", titleEn: "The Orange Cat on the Counter", titleFa: "گربه نارنجی روی پیشخان", badgeCategory: "explorer", badgeIcon: "🎨", badgeNameFa: "پایان هنری", climaxEn: "Every customer smiles when they see the bright orange wooden cat on the bakery desk.", climaxFa: "همه مشتریان با دیدن گربه چوبی نارنجی روی پیشخان نانوایی لبخند می‌زنند.", xpReward: 170 },
  { pathCode: "ABAAB", titleEn: "A Gift for Lily", titleFa: "یک هدیه برای لیلی", badgeCategory: "legendary", badgeIcon: "🎁", badgeNameFa: "پایان دوستی", climaxEn: "Lily hugs the wooden cat toy happily: 'Thank you, Tom! This is my favorite toy!'", climaxFa: "لیلی با خوشحالی اسباب‌بازی را بغل کرد و گفت: 'این اسباب‌بازی محبوب من است!'", xpReward: 180 },
  { pathCode: "ABABA", titleEn: "Bedtime English Reading", titleFa: "خواندن انگلیسی شبانه", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آموزشی", climaxEn: "Tom reads five pages of his English book every night, and Leo listens attentively.", climaxFa: "تام هر شب پنج صفحه از کتاب انگلیسی‌اش را می‌خواند و لئو با دقت گوش می‌دهد.", xpReward: 175 },
  { pathCode: "ABABB", titleEn: "The Lucky Desk Toy", titleFa: "اسباب‌بازی شانس روی میز", badgeCategory: "secret", badgeIcon: "✨", badgeNameFa: "پایان موفقیت", climaxEn: "Tom passes his English test with an A plus! He taps the wooden cat with a smile.", climaxFa: "تام امتحان زبانش را با نمره عالی قبول شد و به گربه کوچولو لبخند زد.", xpReward: 165 },
  { pathCode: "ABBAA", titleEn: "The Notebook of Stories", titleFa: "دفترچه داستان‌های کهن", badgeCategory: "scholar", badgeIcon: "📝", badgeNameFa: "پایان نویسندگی", climaxEn: "Tom writes Jack's funny stories in his notebook. His teacher reads them to the class.", climaxFa: "تام داستان‌های جک را نوشت و معلمش آن‌ها را برای تمام کلاس خواند.", xpReward: 170 },
  { pathCode: "ABBAB", titleEn: "Sunday Morning Tea", titleFa: "چای یکشنبه‌های آفتابی", badgeCategory: "heroic", badgeIcon: "☕", badgeNameFa: "پایان صمیمانه", climaxEn: "Jack visits the bakery every Sunday. Mr. Brown bakes fresh biscuits for everyone.", climaxFa: "جک هر یکشنبه به نانوایی می‌آید و آقای براون برای همه بیسکویت تازه می‌پزد.", xpReward: 160 },
  { pathCode: "ABBBA", titleEn: "Five Colorful Paper Balls", titleFa: "پنج توپ کاغذی رنگارنگ", badgeCategory: "funny", badgeIcon: "🧶", badgeNameFa: "پایان بازیگوش", climaxEn: "Leo chases colorful paper balls across the kitchen floor, wiggling his tail happily.", climaxFa: "لئو دنبال توپ‌های کاغذی رنگی می‌دود و با خوشحالی دمش را تکان می‌دهد.", xpReward: 140 },
  { pathCode: "ABBBB", titleEn: "Good Night, Sweet Leo", titleFa: "شب‌به‌خیر لئوی مهربان", badgeCategory: "explorer", badgeIcon: "🌙", badgeNameFa: "پایان آرامش", climaxEn: "Leo curls up in his soft red basket by the oven, falling into sweet cat dreams.", climaxFa: "لئو در سبد قرمزش کنار تنور نانوایی گلوله شد و خواب‌های شیرین دید.", xpReward: 155 },
  { pathCode: "BAAAA", titleEn: "The Circus Cat Star", titleFa: "ستاره کوچک شیرین‌کاری", badgeCategory: "legendary", badgeIcon: "🎪", badgeNameFa: "پایان پر افتخار", climaxEn: "Children clap as Leo jumps through the yellow hoop. He is the cleverest cat in town!", climaxFa: "کودکان برای پریدن لئو از حلقه هورا کشیدند؛ او باهوش‌ترین گربه شهر شد!", xpReward: 190 },
  { pathCode: "BAAAB", titleEn: "A Tasty Fish Reward", titleFa: "پاداش ماهی خوش‌طعم", badgeCategory: "heroic", badgeIcon: "🐟", badgeNameFa: "پایان گوارا", climaxEn: "Leo eats his warm fish treat hungrily, licking his whiskers clean with his paw.", climaxFa: "لئو ماهی خوشمزه‌اش را خورد و سبیل‌هایش را با پنجه‌اش تمیز کرد.", xpReward: 150 },
  { pathCode: "BAABA", titleEn: "The Strawberry Bush", titleFa: "بوته توت‌فرنگی نانوایی", badgeCategory: "scholar", badgeIcon: "🍓", badgeNameFa: "پایان سرسبز", climaxEn: "Sweet red strawberries grow by the bakery wall, and Tom waters them every day.", climaxFa: "توت‌فرنگی‌های شیرین کنار دیوار نانوایی رشد کردند و تام هر روز به آنها آب می‌دهد.", xpReward: 165 },
  { pathCode: "BAABB", titleEn: "The Picnic Drawing", titleFa: "نقاشی زیبای پیک‌نیک", badgeCategory: "funny", badgeIcon: "🖍️", badgeNameFa: "پایان نقاشی", climaxEn: "Tom's colorful drawing of Lily, Leo, and the red strawberries hangs in the bakery.", climaxFa: "نقاشی زیبای تام از لیلی، لئو و توت‌فرنگی‌ها روی دیوار نانوایی نصب شد.", xpReward: 155 },
  { pathCode: "BABAA", titleEn: "The Winking Cat Picture", titleFa: "عکس چشمک گربه", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان خندان", climaxEn: "The framed photo of Leo winking brings laughter and smiles to all bakery visitors.", climaxFa: "عکس چشمک زدن لئو در قاب عکس خنده را به لب تمام مشتریان نانوایی می‌آورد.", xpReward: 160 },
  { pathCode: "BABAB", titleEn: "Mr. Brown's Big Smile", titleFa: "خنده بلند نانوا", badgeCategory: "heroic", badgeIcon: "😄", badgeNameFa: "پایان شادمانه", climaxEn: "Mr. Brown laughs with delight and gives Leo an extra treat of warm bread crusts.", climaxFa: "آقای براون از دیدن عکس از ته دل خندید و یک تکه نان داغ اضافه به لئو داد.", xpReward: 150 },
  { pathCode: "BABBA", titleEn: "Apples for the Baker", titleFa: "سیب‌های سرخ برای نانوا", badgeCategory: "explorer", badgeIcon: "🍎", badgeNameFa: "پایان میوه‌ای", climaxEn: "Tom brings three red apples from the fruit shop. Mr. Brown bakes a big apple pie.", climaxFa: "تام سه سیب قرمز از مغازه خرید و آقای براون یک پای سیب بزرگ پخت.", xpReward: 165 },
  { pathCode: "BABBB", titleEn: "The Town Square Parade", titleFa: "رژه شاد میدان شهر", badgeCategory: "legendary", badgeIcon: "🎺", badgeNameFa: "پایان باشکوه", climaxEn: "Tom leads ten children with bells and whistles back to the welcoming bakery doors.", climaxFa: "تام ده کودک را با سوت و زنگوله با خوشحالی به سمت نانوایی هدایت کرد.", xpReward: 195 },
  { pathCode: "BBAAA", titleEn: "The Red Blanket Nap", titleFa: "خواب ناز روی پتوی قرمز", badgeCategory: "funny", badgeIcon: "🛏️", badgeNameFa: "پایان خوابالو", climaxEn: "Toby and Leo sleep peacefully side by side under the warm sun on the red blanket.", climaxFa: "توبی و لئو در کنار هم زیر نور آفتاب روی پتوی قرمز به خوابی شیرین رفتند.", xpReward: 140 },
  { pathCode: "BBAAB", titleEn: "Sunny Afternoon Slumber", titleFa: "چرت آرام بعدازظهر", badgeCategory: "scholar", badgeIcon: "☀️", badgeNameFa: "پایان دنج", climaxEn: "Tom, Toby, and Leo rest on the soft grass, listening to the gentle garden breeze.", climaxFa: "تام، توبی و لئو روی چمن‌ها استراحت کردند و به نسیم خنک باغچه گوش دادند.", xpReward: 150 },
  { pathCode: "BBABA", titleEn: "Two Juicy Apples", titleFa: "دو سیب آبدار و شیرین", badgeCategory: "explorer", badgeIcon: "🍏", badgeNameFa: "پایان خوش‌طعم", climaxEn: "Tom and Lily wash the two red apples and crunch them happily under the tree.", climaxFa: "تام و لیلی دو سیب قرمز را شستند و زیر درخت با لذت گاز زدند.", xpReward: 155 },
  { pathCode: "BBABB", titleEn: "The Tree Bench", titleFa: "نیمکت چوبی زیر درخت", badgeCategory: "heroic", badgeIcon: "🪑", badgeNameFa: "پایان دنج", climaxEn: "Tom and Jack build a simple wooden bench where children can sit and read stories.", climaxFa: "تام و جک یک نیمکت چوبی ساختند تا کودکان روی آن بنشینند و داستان بخوانند.", xpReward: 170 },
  { pathCode: "BBBAA", titleEn: "The Best Greeters in Town", titleFa: "بهترین خوش‌آمدگویان شهر", badgeCategory: "legendary", badgeIcon: "🐕", badgeNameFa: "پایان طلایی", climaxEn: "Toby wags his tail and Leo purrs. Everyone in town loves visiting the pet bakery.", climaxFa: "توبی دمش را تکان می‌دهد و لئو خرخر می‌کند؛ همه عاشق دیدن حیوانات نانوایی شدند.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "Morning Crunchy Treats", titleFa: "بیسکویت‌های ترد هر صبح", badgeCategory: "heroic", badgeIcon: "🦴", badgeNameFa: "پایان مهربانی", climaxEn: "Mr. Brown makes healthy whole-grain biscuits for Toby and Leo every single morning.", climaxFa: "آقای براون هر روز صبح بیسکویت‌های ترد و سالم برای توبی و لئو درست می‌کند.", xpReward: 170 },
  { pathCode: "BBBBA", titleEn: "The Milk and Bread Party", titleFa: "جشن شیر تازه و نان داغ", badgeCategory: "funny", badgeIcon: "🥛", badgeNameFa: "پایان پر نشاط", climaxEn: "The bakery is filled with laughter. All the neighbors eat warm barbari bread together.", climaxFa: "نانوایی پر از خنده شد و همه همسایه‌ها نان گرم بربری را با هم نوش جان کردند.", xpReward: 160 },
  { pathCode: "BBBBB", titleEn: "The Golden Sign of Kindness", titleFa: "تابلوی طلایی مهربانی", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "The painted sign hangs proudly. It reminds everyone that gentle kindness makes every home happy.", climaxFa: "تابلوی چوبی به همه یادآوری می‌کند که مهربانی و دوستی خانه و دل انسان را شاد می‌کند.", xpReward: 200 },
];

export const story1BakersCat: AdventureStory = buildAdventureStory({
  id: "a1-bakers-cat",
  storyIndex: 1,
  cefr: "A1",
  titleEn: "The Baker's Cat",
  titleFa: "گربه بازیگوش نانوا",
  genre: "comedy",
  genreLabelFa: "🐱 طنز و روزمره",
  genreIcon: "🐱",
  synopsisEn:
    "Leo is a friendly orange cat. He lives in a warm bakery with Mr. Brown. Today, Leo takes a sweet cake and runs outside! Can Tom help find Leo and make happy choices?",
  synopsisFa:
    "لئو یک گربه نارنجی و بازیگوش است. او در یک نانوایی گرم با آقای براون زندگی می‌کند. امروز لئو یک کیک شیرین را برداشته و به حیاط دویده است! تام می‌خواهد به او کمک کند.",
  coverImage: "/images/skills/reading/bakers-cat.webp",
  nodes,
  endings,
});
