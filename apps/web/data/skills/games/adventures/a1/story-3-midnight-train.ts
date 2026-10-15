import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 3: The Midnight Train to the Sea (قطار شب به سوی دریا)
// Style: Family and Friends Readers (CEFR A1)
// Grammar: Present Simple, Present Continuous, To Be, was/were, Regular Past (-ed) only!
// Common English Names: Jack, Mr. Green, Tim, Lily, Chef Dan
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Tonight, a boy named Jack is on a big blue train. The train is traveling to the sea. Outside, the night sky is full of bright stars. A kind conductor named Mr. Green walks down the hall. He wears a blue hat and smiles at Jack. 'Tickets, please!' he says. Jack shows his shiny train ticket. Ahead, two doors are open.",
    keywords: [
      { word: "train", meaningFa: "قطار", phonetic: "/treɪn/" },
      { word: "conductor", meaningFa: "مسئول مهربان قطار", phonetic: "/kənˈdʌktər/" },
      { word: "ticket", meaningFa: "بلیت قطار", phonetic: "/ˈtɪkɪt/" },
      { word: "traveling", meaningFa: "سفر کردن", phonetic: "/ˈtrævlɪŋ/" },
    ],
    question: {
      promptEn: "Where is the train traveling?",
      promptFa: "قطار به کجا سفر می‌کند؟",
      options: ["To the sea", "To the moon", "To the farm"],
      correctIndex: 0,
      hintSnippet: "The train is traveling to the sea.",
      clueFa: "خط دوم را نگاه کن دوست من! قطار به سمت دریا می‌رود.",
    },
    choiceA: {
      labelEn: "Walk into Cabin 4 to listen to music!",
      labelFa: "وارد کوپه ۴ شو تا به موسیقی گوش بدهی!",
      descriptionFa: "صدای یک ساز چوبی آرام از داخل کوپه می‌آید.",
    },
    choiceB: {
      labelEn: "Walk to the Kitchen Car to smell fresh pies!",
      labelFa: "به واگن آشپزخانه برو تا بوی پای سیب را حس کنی!",
      descriptionFa: "عطر خوشمزه دارچین و کیک در هوا پیچیده است.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Jack walks into Cabin 4. The seats are soft and green. A boy named Tim is playing a small wooden guitar. Tim looks up and smiles. 'Hello! Do you like music?' asks Tim. On the table is a red puzzle box. The room is very cozy.",
    keywords: [
      { word: "seats", meaningFa: "صندلی‌ها", phonetic: "/siːts/" },
      { word: "guitar", meaningFa: "گیتار کوچک چوبی", phonetic: "/ɡɪˈtɑːr/" },
      { word: "cozy", meaningFa: "راحت و گرم و نرم", phonetic: "/ˈkəʊzi/" },
    ],
    question: {
      promptEn: "What musical instrument is Tim playing?",
      promptFa: "تیم چه سازی می‌نوازد؟",
      options: ["A small wooden guitar", "A loud drum", "A big piano"],
      correctIndex: 0,
      hintSnippet: "Tim is playing a small wooden guitar.",
      clueFa: "خط سوم را بخوان! تیم یک گیتار کوچک چوبی می‌نوازد.",
    },
    choiceA: {
      labelEn: "Play music together with Tim!",
      labelFa: "با تیم با هم آهنگ بنوازید!",
      descriptionFa: "تیم می‌تواند آهنگ‌های ساده به تو یاد بدهد.",
    },
    choiceB: {
      labelEn: "Open the red puzzle box!",
      labelFa: "جعبه قرمز معما را باز کن!",
      descriptionFa: "شاید کارت‌های بازی جالبی داخل آن باشد.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Jack walks into the warm Kitchen Car. Chef Dan is wearing a tall white hat. He is baking sweet apple pies in the oven. A kind girl named Lily is washing clean white plates. 'Hello Jack!' says Lily. 'Can you help us?'",
    keywords: [
      { word: "kitchen", meaningFa: "آشپزخانه قطار", phonetic: "/ˈkɪtʃɪn/" },
      { word: "baking", meaningFa: "پختن شیرینی و پای", phonetic: "/ˈbeɪkɪŋ/" },
      { word: "plates", meaningFa: "بشقاب‌های تمیز", phonetic: "/pleɪts/" },
    ],
    question: {
      promptEn: "What is Chef Dan wearing?",
      promptFa: "سرآشپز دن چه چیزی بر سر دارد؟",
      options: ["A tall white hat", "A red baseball cap", "A funny crown"],
      correctIndex: 0,
      hintSnippet: "Chef Dan is wearing a tall white hat.",
      clueFa: "خط دوم را بخوان دوست من! یک کلاه سفید بلند دارد.",
    },
    choiceA: {
      labelEn: "Help Lily wash and dry the plates!",
      labelFa: "به لیلی در شستن و خشک کردن بشقاب‌ها کمک کن!",
      descriptionFa: "کف صابون حباب‌های بامزه درست می‌کند.",
    },
    choiceB: {
      labelEn: "Help Chef Dan decorate the apple pies!",
      labelFa: "به سرآشپز در تزیین پای‌های سیب کمک کن!",
      descriptionFa: "می‌توانید روی پای توت‌های قرمز شیرین بگذارید.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Tim shows Jack how to play three soft notes: one, two, three. The sound is sweet and gentle. Mr. Green walks past the door and claps his hands. 'What lovely music!' he says with a smile.",
    keywords: [
      { word: "notes", meaningFa: "نت‌های موسیقی", phonetic: "/nəʊts/" },
      { word: "gentle", meaningFa: "ملایم و آرام", phonetic: "/ˈdʒentl/" },
      { word: "claps", meaningFa: "دست می‌زند", phonetic: "/klæps/" },
    ],
    question: {
      promptEn: "How many notes does Tim show Jack?",
      promptFa: "تیم چند نت به جک یاد می‌دهد؟",
      options: ["Three soft notes", "Ten loud notes", "One note"],
      correctIndex: 0,
      hintSnippet: "three soft notes: one, two, three",
      clueFa: "خط اول را ببین! سه نت ملایم یاد می‌دهد.",
    },
    choiceA: {
      labelEn: "Sing a happy sea song together!",
      labelFa: "با هم یک آهنگ شاد درباره دریا بخوانید!",
      descriptionFa: "آهنگ دریا همه مسافران را خوشحال می‌کند.",
    },
    choiceB: {
      labelEn: "Look out the window at the bright stars!",
      labelFa: "از پنجره به ستاره‌های درخشان نگاه کنید!",
      descriptionFa: "ستاره‌ها مثل چراغ‌های کوچک در آسمان می‌درخشند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Jack and Tim open the red puzzle box. Inside are picture cards of ocean animals! A blue card shows a smiling dolphin. A green card shows a gentle sea turtle. Jack holds the turtle card happily.",
    keywords: [
      { word: "puzzle", meaningFa: "پازل و جورچین", phonetic: "/ˈpʌzl/" },
      { word: "dolphin", meaningFa: "دلفین", phonetic: "/ˈdɒlfɪn/" },
      { word: "turtle", meaningFa: "لاک‌پشت دریایی", phonetic: "/ˈtɜːtl/" },
    ],
    question: {
      promptEn: "What animal is on the green card?",
      promptFa: "روی کارت سبز چه جانوری کشیده شده؟",
      options: ["A gentle sea turtle", "A noisy monkey", "A big tiger"],
      correctIndex: 0,
      hintSnippet: "A green card shows a gentle sea turtle.",
      clueFa: "خط سوم را نگاه کن! یک لاک‌پشت دریایی آرام روی کارت است.",
    },
    choiceA: {
      labelEn: "Match all the animal cards together!",
      labelFa: "کارت‌های حیوانات را با هم جفت کن!",
      descriptionFa: "پیدا کردن جفت کارت‌ها یک بازی فکری عالی است.",
    },
    choiceB: {
      labelEn: "Show the turtle card to Lily in the kitchen!",
      labelFa: "کارت لاک‌پشت را به لیلی در آشپزخانه نشان بده!",
      descriptionFa: "لیلی عاشق حیوانات مهربان دریایی است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Jack helps Lily wash the white plates. They use warm water and lemon soap. Big bubbles float in the warm air. Lily laughs and points at a round bubble. 'Look at that shiny bubble!' she shouts.",
    keywords: [
      { word: "bubbles", meaningFa: "حباب‌های صابون", phonetic: "/ˈbʌblz/" },
      { word: "lemon", meaningFa: "لیمو", phonetic: "/ˈlemən/" },
      { word: "float", meaningFa: "شناور بودن در هوا", phonetic: "/fləʊt/" },
    ],
    question: {
      promptEn: "What kind of soap do they use?",
      promptFa: "آن‌ها از چه صابونی استفاده می‌کنند؟",
      options: ["Lemon soap", "Salt soap", "Coffee soap"],
      correctIndex: 0,
      hintSnippet: "warm water and lemon soap",
      clueFa: "خط دوم را بخوان دوست من! صابون لیمویی استفاده می‌کنند.",
    },
    choiceA: {
      labelEn: "Make more soap bubbles with a straw!",
      labelFa: "با نی حباب‌های صابونی بزرگ‌تر درست کن!",
      descriptionFa: "حباب‌ها در نور مهتاب مثل رنگین‌کمان می‌درخشند.",
    },
    choiceB: {
      labelEn: "Stack the clean dry plates neatly!",
      labelFa: "بشقاب‌های تمیز و خشک را مرتب روی هم بچین!",
      descriptionFa: "بشقاب‌ها برای صبحانه مسافران آماده می‌شوند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Jack helps Chef Dan decorate the apple pies. They place sweet red berries on each pie. Chef Dan smiles warmly. 'You are a wonderful baker, Jack,' says Chef Dan. He offers Jack a small berry muffin.",
    keywords: [
      { word: "berries", meaningFa: "توت‌های شیرین قرمز", phonetic: "/ˈberiz/" },
      { word: "muffin", meaningFa: "کیک فنجانی کوچک", phonetic: "/ˈmʌfɪn/" },
      { word: "baker", meaningFa: "شیرینی‌پز ماهر", phonetic: "/ˈbeɪkər/" },
    ],
    question: {
      promptEn: "What does Chef Dan offer to Jack?",
      promptFa: "سرآشپز به جک چه چیزی تعارف می‌کند؟",
      options: ["A small berry muffin", "A cold onion", "A cup of salt"],
      correctIndex: 0,
      hintSnippet: "He offers Jack a small berry muffin.",
      clueFa: "خط آخر را ببین! یک کیک کوچک توتی به او تعارف می‌کند.",
    },
    choiceA: {
      labelEn: "Taste the warm berry muffin!",
      labelFa: "کیک کوچک توت را بچش!",
      descriptionFa: "کیک تازه از فر درآمده و بسیار شیرین است.",
    },
    choiceB: {
      labelEn: "Share a piece of pie with Mr. Green!",
      labelFa: "یک تکه پای را به آقای گرین تعارف کن!",
      descriptionFa: "آقای گرین بعد از بازرسی قطار خسته است.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Jack and Tim sing a happy song about the sea. The song is called 'Little Boat on the Waves.' Other passengers in the car smile and tap their feet to the music.",
    keywords: [
      { word: "waves", meaningFa: "موج‌های دریا", phonetic: "/weɪvz/" },
      { word: "boat", meaningFa: "قایق کوچک", phonetic: "/bəʊt/" },
      { word: "tap", meaningFa: "پا کوبیدن با ریتم آهنگ", phonetic: "/tæp/" },
    ],
    question: {
      promptEn: "What is the song called?",
      promptFa: "اسم آهنگ چیست؟",
      options: ["'Little Boat on the Waves'", "'Fast Red Car'", "'The Cold Snow'"],
      correctIndex: 0,
      hintSnippet: "The song is called 'Little Boat on the Waves.'",
      clueFa: "خط دوم را بخوان! اسمش 'قایق کوچک روی موج‌ها' است.",
    },
    choiceA: {
      labelEn: "Invite the passengers to sing along!",
      labelFa: "مسافران را به هم‌خوانی دعوت کن!",
      descriptionFa: "همه با هم ترانه دریا را زمزمه می‌کنند.",
    },
    choiceB: {
      labelEn: "Bow politely after the song ends!",
      labelFa: "بعد از پایان آهنگ با لبخند تعظیم کن!",
      descriptionFa: "همه برای اجرای زیبایتان دست می‌زنند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Jack and Tim look out the wide window. In the dark sky, they spot the big North Star. The train moves smoothly beside green pine trees. A tiny moonbeam shines on the window glass.",
    keywords: [
      { word: "window", meaningFa: "پنجره بزرگ", phonetic: "/ˈwɪndəʊ/" },
      { word: "pine", meaningFa: "درختان کاج سرسبز", phonetic: "/paɪn/" },
      { word: "moonbeam", meaningFa: "پرتو نور ماه", phonetic: "/ˈmuːnbiːm/" },
    ],
    question: {
      promptEn: "What star do they spot in the dark sky?",
      promptFa: "چه ستاره‌ای را در آسمان تاریک پیدا می‌کنند؟",
      options: ["The big North Star", "A red firework", "A street lamp"],
      correctIndex: 0,
      hintSnippet: "they spot the big North Star",
      clueFa: "خط اول را نگاه کن! ستاره قطبی بزرگ را پیدا می‌کنند.",
    },
    choiceA: {
      labelEn: "Draw the stars on a paper notebook!",
      labelFa: "ستاره‌ها را در دفتر نقاشی بکشید!",
      descriptionFa: "نقاشی ستاره‌ها در شب بسیار رویایی است.",
    },
    choiceB: {
      labelEn: "Use a toy telescope to view the night sky!",
      labelFa: "با دوربین کوچک به آسمان شب نگاه کنید!",
      descriptionFa: "ستاره‌ها از پشت لنز دوربین نزدیک‌تر دیده می‌شوند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Jack and Tim match all the animal cards. Jack pairs the blue dolphin with the blue ocean card. Tim cheers! They count ten matching pairs on the table.",
    keywords: [
      { word: "pairs", meaningFa: "جفت‌ها", phonetic: "/peəz/" },
      { word: "cheers", meaningFa: "هورا می‌کشد و خوشحالی می‌کند", phonetic: "/tʃɪəz/" },
      { word: "count", meaningFa: "می‌شمارند", phonetic: "/kaʊnt/" },
    ],
    question: {
      promptEn: "How many matching pairs are on the table?",
      promptFa: "چند جفت کارت روی میز است؟",
      options: ["Ten matching pairs", "Two pairs", "Zero pairs"],
      correctIndex: 0,
      hintSnippet: "They count ten matching pairs on the table.",
      clueFa: "خط آخر را ببین! ده جفت کارت را می‌شمارند.",
    },
    choiceA: {
      labelEn: "Teach the card game to younger kids on the train!",
      labelFa: "بازی کارت‌ها را به بچه‌های کوچک‌تر یاد بده!",
      descriptionFa: "بچه‌ها با این بازی نام حیوانات را یاد می‌گیرند.",
    },
    choiceB: {
      labelEn: "Pack the cards neatly back into the box!",
      labelFa: "کارت‌ها را با دقت در جعبه جمع کن!",
      descriptionFa: "جعبه برای ماجراجویی بعدی تمیز می‌ماند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Jack carries the green turtle card to the Kitchen Car. Lily claps her hands. 'My favorite animal is the sea turtle!' she whispers. Lily gives Jack a shiny sticker of a seashell.",
    keywords: [
      { word: "seashell", meaningFa: "صدف دریایی", phonetic: "/ˈsiːʃel/" },
      { word: "whispers", meaningFa: "پچ‌پچ می‌کند / با آرامش می‌گوید", phonetic: "/ˈwɪspəz/" },
      { word: "sticker", meaningFa: "برچسب قشنگ", phonetic: "/ˈstɪkər/" },
    ],
    question: {
      promptEn: "What is Lily's favorite animal?",
      promptFa: "حیوان مورد علاقه لیلی چیست؟",
      options: ["The sea turtle", "A green crocodile", "A noisy bird"],
      correctIndex: 0,
      hintSnippet: "My favorite animal is the sea turtle!",
      clueFa: "خط دوم را بخوان! حیوان مورد علاقه‌اش لاک‌پشت دریایی است.",
    },
    choiceA: {
      labelEn: "Stick the seashell sticker on your train ticket!",
      labelFa: "برچسب صدف را روی بلیت قطارت بچسبان!",
      descriptionFa: "بلیتت زیباترین بلیت قطار می‌شود.",
    },
    choiceB: {
      labelEn: "Invite Lily to play the card game in Cabin 4!",
      labelFa: "لیلی را به بازی کارت‌ها در کوپه ۴ دعوت کن!",
      descriptionFa: "با هم سه نفری بازی کردن خیلی کیف می‌دهد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Jack blows through a small straw. A huge soap bubble forms and floats up! It gently taps the kitchen window and pops with a soft 'pop!' Lily giggles.",
    keywords: [
      { word: "straw", meaningFa: "نی نوشیدنی", phonetic: "/strɔː/" },
      { word: "giggles", meaningFa: "می‌خندد / غش‌غش می‌خندد", phonetic: "/ˈɡɪɡlz/" },
      { word: "pops", meaningFa: "می‌ترکد", phonetic: "/pɒps/" },
    ],
    question: {
      promptEn: "What does Jack blow through?",
      promptFa: "جک در چه چیزی فوت می‌کند؟",
      options: ["A small straw", "A silver whistle", "A big tube"],
      correctIndex: 0,
      hintSnippet: "Jack blows through a small straw.",
      clueFa: "خط اول را ببین! در یک نی کوچک فوت می‌کند.",
    },
    choiceA: {
      labelEn: "Blow five tiny bubbles at the same time!",
      labelFa: "پنج حباب ریز را هم‌زمان درست کن!",
      descriptionFa: "حباب‌های کوچک مثل ستاره‌ها معلق می‌شوند.",
    },
    choiceB: {
      labelEn: "Wipe the counter clean with a soft towel!",
      labelFa: "میز را با یک حوله نرم پاک و تمیز کن!",
      descriptionFa: "آشپزخانه تمیز و درخشان باقی می‌ماند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Jack and Lily stack the clean plates on the wooden shelf. Each plate is dry and shiny. Chef Dan gives them each a golden star badge. 'Great teamwork!' he says.",
    keywords: [
      { word: "shelf", meaningFa: "قفسه چوبی", phonetic: "/ʃelf/" },
      { word: "badge", meaningFa: "نشان / مدال کوچک", phonetic: "/bædʒ/" },
      { word: "teamwork", meaningFa: "کار گروهی و همکاری", phonetic: "/ˈtiːmwɜːk/" },
    ],
    question: {
      promptEn: "What does Chef Dan give them?",
      promptFa: "سرآشپز به آن‌ها چه چیزی هدیه می‌دهد؟",
      options: ["A golden star badge", "A wooden spoon", "A big potato"],
      correctIndex: 0,
      hintSnippet: "a golden star badge",
      clueFa: "خط سوم را بخوان! یک نشان ستاره طلایی می‌دهد.",
    },
    choiceA: {
      labelEn: "Pin the star badge proudly on your shirt!",
      labelFa: "نشان ستاره را با افتخار به پیراهنت بزن!",
      descriptionFa: "شبیه یک دستیار سرآشپز واقعی می‌شوی.",
    },
    choiceB: {
      labelEn: "Help set the breakfast tables for morning!",
      labelFa: "میزهای صبحانه را برای فردا صبح آماده کن!",
      descriptionFa: "مسافران صبح از دیدن میزهای چیده شده شاد می‌شوند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Jack tastes the berry muffin. It is sweet and fluffy. Warm blueberry jam melts on his tongue. 'This is the tastiest muffin in the world!' Jack smiles.",
    keywords: [
      { word: "fluffy", meaningFa: "نرم و پفکی", phonetic: "/ˈflʌfi/" },
      { word: "jam", meaningFa: "مربای میوه", phonetic: "/dʒæm/" },
      { word: "tastiest", meaningFa: "خوشمزه‌ترین", phonetic: "/ˈteɪstiɪst/" },
    ],
    question: {
      promptEn: "What kind of muffin is it?",
      promptFa: "چه نوع مافینی است؟",
      options: ["A sweet berry muffin", "A salty bread", "A chocolate cookie"],
      correctIndex: 0,
      hintSnippet: "the berry muffin",
      clueFa: "خط اول را ببین! یک مافین شیرین توتی است.",
    },
    choiceA: {
      labelEn: "Ask Chef Dan for the easy recipe!",
      labelFa: "دستور پخت ساده آن را از سرآشپز بپرس!",
      descriptionFa: "می‌توانی در خانه هم با مامان آن را بپزی.",
    },
    choiceB: {
      labelEn: "Pack a mini muffin in a napkin for Tim!",
      labelFa: "یک مافین کوچک در دستمال برای تیم بپیچ!",
      descriptionFa: "تیم در کوپه ۴ از این هدیه شگفت‌زده می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Jack carries a warm plate of pie to Mr. Green. The conductor is resting in his chair. Mr. Green smiles widely. 'Thank you, young friend! This pie smells wonderful,' he says.",
    keywords: [
      { word: "resting", meaningFa: "استراحت کردن", phonetic: "/ˈrestɪŋ/" },
      { word: "chair", meaningFa: "صندلی راحتی", phonetic: "/tʃeər/" },
      { word: "widely", meaningFa: "با لبخند پهن و گشاده", phonetic: "/ˈwaɪdli/" },
    ],
    question: {
      promptEn: "What does Jack carry to Mr. Green?",
      promptFa: "جک چه چیزی برای آقای گرین می‌برد؟",
      options: ["A warm plate of pie", "A cold glass of water", "A heavy box"],
      correctIndex: 0,
      hintSnippet: "a warm plate of pie",
      clueFa: "خط اول را بخوان دوست من! یک بشقاب پای گرم می‌برد.",
    },
    choiceA: {
      labelEn: "Ask Mr. Green about the ocean station!",
      labelFa: "از آقای گرین درباره ایستگاه کنار دریا بپرس!",
      descriptionFa: "او همه‌چیز را درباره فانوس دریایی و قایق‌ها می‌داند.",
    },
    choiceB: {
      labelEn: "Ring the tiny silver conductor bell!",
      labelFa: "زنگوله نقره‌ای کوچک رئیس قطار را به صدا درآور!",
      descriptionFa: "صدای دینگ‌دینگ زنگوله در سالن می‌پیچد.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "All the passengers clap and join the chorus. The carriage is filled with joyful songs as the train approaches the beach station.",
    keywords: [{ word: "chorus", meaningFa: "هم‌خوانی و هم‌آوایی", phonetic: "/ˈkɔːrəs/" }],
    question: {
      promptEn: "What is the carriage filled with?",
      promptFa: "واگن قطار با چه چیزی پر می‌شود؟",
      options: ["Joyful songs", "Cold wind", "Loud noise"],
      correctIndex: 0,
      hintSnippet: "filled with joyful songs",
      clueFa: "با آوازهای شاد پر می‌شود.",
    },
    choiceA: {
      labelEn: "Lead the travelers down to the beach at sunrise!",
      labelFa: "مسافران را هنگام طلوع به سمت ساحل راهنمایی کن!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Take a group photo on the wooden platform!",
      labelFa: "یک عکس یادگاری دسته‌جمعی روی سکو بگیرید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Jack and Tim bow politely. The passengers cheer and give them shiny souvenir pins. The conductor pats Jack on the shoulder.",
    keywords: [{ word: "souvenir", meaningFa: "یادگاری سفر", phonetic: "/ˌsuːvəˈnɪər/" }],
    question: {
      promptEn: "What do the passengers give them?",
      promptFa: "مسافران چه چیزی به آن‌ها هدیه می‌دهند؟",
      options: ["Shiny souvenir pins", "Old boots", "Empty bottles"],
      correctIndex: 0,
      hintSnippet: "shiny souvenir pins",
      clueFa: "نشان‌های یادگاری درخشان هدیه می‌دهند.",
    },
    choiceA: {
      labelEn: "Wear the souvenir pin on your coat!",
      labelFa: "نشان یادگاری را به کتت بزن!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Give the souvenir pin to a little child!",
      labelFa: "نشان یادگاری را به یک کودک کوچک ببخش!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Jack draws the night sky and the pine trees in his notebook. Tim plays a slow, quiet lullaby. Soon, the train whistle signals arrival.",
    keywords: [{ word: "lullaby", meaningFa: "لالایی ملایم و آرام", phonetic: "/ˈlʌləbaɪ/" }],
    question: {
      promptEn: "What signals the train arrival?",
      promptFa: "چه چیزی رسیدن قطار را خبر می‌دهد؟",
      options: ["The train whistle", "A car horn", "A barking dog"],
      correctIndex: 0,
      hintSnippet: "the train whistle signals arrival",
      clueFa: "سوت قطار خبر رسیدن را می‌دهد.",
    },
    choiceA: {
      labelEn: "Show the drawing to your parents at the station!",
      labelFa: "نقاشی را در ایستگاه به پدر و مادرت نشان بده!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Hang the drawing inside the train cabin!",
      labelFa: "نقاشی را داخل کوپه قطار یادگاری بگذار!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Through the toy telescope, Jack spots a bright lighthouse blinking on the rocky coast. The sea waves glow under the silver moon.",
    keywords: [{ word: "lighthouse", meaningFa: "فانوس دریایی", phonetic: "/ˈlaɪthaʊs/" }],
    question: {
      promptEn: "What is blinking on the rocky coast?",
      promptFa: "چه چیزی روی ساحل صخره‌ای چشمک می‌زند؟",
      options: ["A bright lighthouse", "A campfire", "A street light"],
      correctIndex: 0,
      hintSnippet: "a bright lighthouse blinking",
      clueFa: "یک فانوس دریایی پرنور چشمک می‌زند.",
    },
    choiceA: {
      labelEn: "Visit the tall lighthouse in the morning!",
      labelFa: "صبح برای دیدن فانوس دریایی بلند برو!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Wave at the lighthouse keeper from the train!",
      labelFa: "از داخل قطار برای فانوس‌بان دست تکان بده!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Jack and Tim gather three younger children and teach them the animal cards. The children giggle and guess each animal correctly.",
    keywords: [{ word: "gather", meaningFa: "دور هم جمع کردن", phonetic: "/ˈɡæðər/" }],
    question: {
      promptEn: "How many younger children join them?",
      promptFa: "چند کودک کوچک‌تر به آن‌ها می‌پیوندند؟",
      options: ["Three children", "Twenty children", "Nobody"],
      correctIndex: 0,
      hintSnippet: "gather three younger children",
      clueFa: "سه کودک به آن‌ها می‌پیوندند.",
    },
    choiceA: {
      labelEn: "Build a beach sandcastle with the kids tomorrow!",
      labelFa: "فردا با بچه‌ها قلعه شنی در ساحل بسازید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Give each child a picture animal card!",
      labelFa: "به هر کدام یک کارت نقاشی حیوانات هدیه بده!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Jack packs the cards neatly into the red box. He places the box on the cabin table. Everything is ready for the next passenger.",
    keywords: [{ word: "packs", meaningFa: "بسته‌بندی و جمع کردن", phonetic: "/pæks/" }],
    question: {
      promptEn: "Where does Jack place the box?",
      promptFa: "جک جعبه را کجا می‌گذارد؟",
      options: ["On the cabin table", "Under the seat", "In the trash"],
      correctIndex: 0,
      hintSnippet: "on the cabin table",
      clueFa: "روی میز کوپه می‌گذارد.",
    },
    choiceA: {
      labelEn: "Write a kind note inside the box: 'Enjoy the game!'",
      labelFa: "یک یادداشت مهربان در جعبه بگذار: 'از بازی لذت ببر!'",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Take a short sweet nap before arrival!",
      labelFa: "قبل از رسیدن یک چرت کوتاه و شیرین بزن!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Jack sticks the shiny seashell sticker onto his train ticket. The ticket looks like a magical ocean pass. Jack smiles proudly.",
    keywords: [{ word: "pass", meaningFa: "کارت ورود / مجوز", phonetic: "/pɑːs/" }],
    question: {
      promptEn: "What does the ticket look like?",
      promptFa: "بلیت شبیه چه چیزی می‌شود؟",
      options: ["A magical ocean pass", "A plain newspaper", "A piece of wood"],
      correctIndex: 0,
      hintSnippet: "a magical ocean pass",
      clueFa: "شبیه یک کارت جادویی ورود به دریا می‌شود.",
    },
    choiceA: {
      labelEn: "Keep the ticket in your diary forever!",
      labelFa: "بلیت را برای همیشه در دفتر خاطراتت نگه دار!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Show the shiny ticket to the conductor!",
      labelFa: "بلیت درخشان را به رئیس قطار نشان بده!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Lily joins Jack and Tim in Cabin 4. They play the animal matching game together, laughing and sharing stories about the sea.",
    keywords: [{ word: "sharing", meaningFa: "تعریف کردن و به اشتراک گذاشتن", phonetic: "/ˈʃeərɪŋ/" }],
    question: {
      promptEn: "Where does Lily join them?",
      promptFa: "لیلی در کجا به آن‌ها ملحق می‌شود؟",
      options: ["In Cabin 4", "On the roof", "At the station shop"],
      correctIndex: 0,
      hintSnippet: "in Cabin 4",
      clueFa: "در کوپه ۴ به آن‌ها ملحق می‌شود.",
    },
    choiceA: {
      labelEn: "Plan to meet on the beach tomorrow morning!",
      labelFa: "قرار بگذارید فردا صبح همدیگر را در ساحل ببینید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Share fresh fruit together before sleeping!",
      labelFa: "قبل از خواب میوه تازه با هم بخورید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Jack blows five tiny bubbles that float across the kitchen. The kitchen crew laughs as the bubbles shimmer like floating jewels.",
    keywords: [{ word: "jewels", meaningFa: "جواهرات درخشان", phonetic: "/ˈdʒuːəlz/" }],
    question: {
      promptEn: "What do the bubbles look like?",
      promptFa: "حباب‌ها شبیه چه چیزی می‌درخشند؟",
      options: ["Floating jewels", "Dark rocks", "Old dust"],
      correctIndex: 0,
      hintSnippet: "like floating jewels",
      clueFa: "مثل جواهرات معلق می‌درخشند.",
    },
    choiceA: {
      labelEn: "Clap your hands as the last bubble pops!",
      labelFa: "وقتی آخرین حباب ترکید با شادی دست بزن!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Thank Chef Dan and Lily for the fun time!",
      labelFa: "از سرآشپز دن و لیلی برای این زمان شاد تشکر کن!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Jack wipes the stainless table until it shines like a mirror. Chef Dan smiles. 'The kitchen is sparkling clean thanks to you!'",
    keywords: [{ word: "mirror", meaningFa: "آینه شفاف", phonetic: "/ˈmɪrər/" }],
    question: {
      promptEn: "What does the table shine like?",
      promptFa: "میز مثل چه چیزی می‌درخشد؟",
      options: ["A mirror", "A potato", "A rug"],
      correctIndex: 0,
      hintSnippet: "shines like a mirror",
      clueFa: "مثل آینه می‌درخشد.",
    },
    choiceA: {
      labelEn: "Earn the title of Junior Train Chef!",
      labelFa: "عنوان سرآشپز نوجوان قطار را به دست بیاور!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Receive a souvenir chef's hat to take home!",
      labelFa: "یک کلاه سرآشپز یادگاری برای خانه هدیه بگیر!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Jack pins the golden star badge onto his shirt. In the mirror, he looks like a real train captain. He walks proudly down the aisle.",
    keywords: [{ word: "aisle", meaningFa: "راهروی بین صندلی‌ها", phonetic: "/aɪl/" }],
    question: {
      promptEn: "Where does Jack pin the star badge?",
      promptFa: "جک نشان ستاره را کجا می‌زند؟",
      options: ["Onto his shirt", "On his shoes", "On his backpack"],
      correctIndex: 0,
      hintSnippet: "onto his shirt",
      clueFa: "به پیراهنش می‌زند.",
    },
    choiceA: {
      labelEn: "Salute Mr. Green like a young officer!",
      labelFa: "مثل یک دستیار به آقای گرین ادای احترام کن!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Guide travelers to their seats with a smile!",
      labelFa: "مسافران را با لبخند به صندلی‌هایشان راهنمایی کن!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Jack and Lily set twenty small tables with clean napkins and silver spoons. Everything is orderly and beautiful for breakfast.",
    keywords: [{ word: "napkins", meaningFa: "دستمال‌های سفره", phonetic: "/ˈnæpkɪnz/" }],
    question: {
      promptEn: "How many tables do they set?",
      promptFa: "چند میز را آماده می‌کنند؟",
      options: ["Twenty small tables", "Only one table", "Fifty tables"],
      correctIndex: 0,
      hintSnippet: "twenty small tables",
      clueFa: "بیست میز کوچک را آماده می‌کنند.",
    },
    choiceA: {
      labelEn: "Place a fresh flower on every table!",
      labelFa: "روی هر میز یک شاخه گل تازه بگذار!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Fold the napkins into swan shapes!",
      labelFa: "دستمال‌ها را به شکل قوهای قشنگ تا کن!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Chef Dan writes down the berry muffin recipe on a blue card: 'Flour, sweet berries, and a spoon of kindness.' Jack folds it carefully.",
    keywords: [{ word: "recipe", meaningFa: "دستور پخت", phonetic: "/ˈresəpi/" }],
    question: {
      promptEn: "What is on the blue card?",
      promptFa: "روی کارت آبی چیست؟",
      options: ["The berry muffin recipe", "A bus schedule", "A math exam"],
      correctIndex: 0,
      hintSnippet: "the berry muffin recipe",
      clueFa: "دستور پخت مافین توتی است.",
    },
    choiceA: {
      labelEn: "Bake muffins for your family next Sunday!",
      labelFa: "یکشنبه آینده برای خانواده‌ات مافین بپز!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Share the recipe with your school friends!",
      labelFa: "دستور پخت را به دوستان مدرسه‌ات بده!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Jack brings the warm mini muffin to Tim. Tim takes a bite and his face lights up. 'This is so delicious, Jack! Thank you!'",
    keywords: [{ word: "bite", meaningFa: "یک لقمه کوچک", phonetic: "/baɪt/" }],
    question: {
      promptEn: "Who does Jack bring the mini muffin to?",
      promptFa: "جک مافین کوچک را برای چه کسی می‌برد؟",
      options: ["Tim", "The cat", "The bus driver"],
      correctIndex: 0,
      hintSnippet: "brings the warm mini muffin to Tim",
      clueFa: "برای تیم می‌برد.",
    },
    choiceA: {
      labelEn: "Play a victory tune on the guitar together!",
      labelFa: "با گیتار یک آهنگ شاد پیروزی بنوازید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Watch the ocean sunrise from Cabin 4!",
      labelFa: "طلوع خورشید روی دریا را از کوپه تماشا کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Mr. Green tells Jack about the sea station: 'When the train stops, you will hear the waves and smell the fresh salty sea air!'",
    keywords: [{ word: "salty", meaningFa: "نمکی و دریایی", phonetic: "/ˈsɔːlti/" }],
    question: {
      promptEn: "What will Jack hear when the train stops?",
      promptFa: "وقتی قطار بایستد جک صدای چه چیزی را خواهد شنید؟",
      options: ["The waves", "Traffic cars", "Loud alarms"],
      correctIndex: 0,
      hintSnippet: "you will hear the waves",
      clueFa: "صدای موج‌های دریا را خواهد شنید.",
    },
    choiceA: {
      labelEn: "Step onto the sunny beach platform first!",
      labelFa: "اولین نفری باش که روی سکوی آفتابی ساحل قدم می‌گذارد!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Listen to the seagulls calling in the dawn!",
      labelFa: "به صدای مرغان دریایی در سحرگاه گوش بده!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Jack rings the conductor's silver bell: Ding! Ding! Ding! The train slowly pulls into the Seaside Station. The dawn sky is pink and gold.",
    keywords: [{ word: "pulls", meaningFa: "آهسته وارد ایستگاه می‌شود", phonetic: "/pʊlz/" }],
    question: {
      promptEn: "What color is the dawn sky?",
      promptFa: "آسمان سحرگاه چه رنگی است؟",
      options: ["Pink and gold", "Dark black", "Gray and rainy"],
      correctIndex: 0,
      hintSnippet: "The dawn sky is pink and gold.",
      clueFa: "آسمان صورتی و طلایی است.",
    },
    choiceA: {
      labelEn: "Run to the ocean waves with joyful cheers!",
      labelFa: "با فریاد شادی به سمت موج‌های دریا بدو!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Hug your family and celebrate the great train journey!",
      labelFa: "خانواده‌ات را در آغوش بگیر و سفر زیبای قطار را جشن بگیر!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "Sunrise Beach March", titleFa: "قدم زدن در طلوع ساحل", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان طلوع زرین", climaxEn: "Jack leads happy travelers to the water as the morning sun turns the waves golden.", climaxFa: "جک مسافران شاد را به ساحل برد و خورشید صبحگاهی امواج را طلایی کرد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Station Platform Photo", titleFa: "عکس یادگاری سکوی قطار", badgeCategory: "heroic", badgeIcon: "📸", badgeNameFa: "پایان پرخاطره", climaxEn: "A bright group picture captures all the smiling faces under the station clock.", climaxFa: "یک عکس قشنگ تمام لبخندهای شاد مسافران را زیر ساعت ایستگاه ثبت کرد.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "The Golden Coat Pin", titleFa: "مدال درخشان روی کت", badgeCategory: "funny", badgeIcon: "🏅", badgeNameFa: "پایان افتخارآمیز", climaxEn: "Jack wears the souvenir pin proudly as the train arrives at the blue sea.", climaxFa: "جک با افتخار نشان یادگاری را روی کتش زده و قطار به دریای آبی رسید.", xpReward: 155 },
  { pathCode: "AAABB", titleEn: "The Gift of Kindness", titleFa: "هدیه مهربانی", badgeCategory: "scholar", badgeIcon: "🎁", badgeNameFa: "پایان صمیمانه", climaxEn: "A little child smiles warmly and holds the gifted pin like a treasure.", climaxFa: "کودک خردسال با لبخندی گرم نشان اهدایی را مثل یک گنج در دست گرفت.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Proud Parents Hug", titleFa: "آغوش پرمهر خانواده", badgeCategory: "legendary", badgeIcon: "👨‍👩‍👧", badgeNameFa: "پایان خانوادگی", climaxEn: "Jack's parents hug him at the gate and praise his wonderful drawings.", climaxFa: "پدر و مادر جک دم در او را در آغوش کشیدند و نقاشی‌هایش را تحسین کردند.", xpReward: 200 },
  { pathCode: "AABAB", titleEn: "The Cabin Art Gallery", titleFa: "گالری نقاشی کوپه", badgeCategory: "scholar", badgeIcon: "🖼️", badgeNameFa: "پایان هنرمندانه", climaxEn: "The drawing remains pinned on the cabin wall, delighting future riders.", climaxFa: "نقاشی زیبا روی دیوار کوپه ماند تا دل مسافران بعدی را شاد کند.", xpReward: 180 },
  { pathCode: "AABBA", titleEn: "The Coastal Lighthouse Walk", titleFa: "دیدار با فانوس دریایی", badgeCategory: "explorer", badgeIcon: "🗼", badgeNameFa: "پایان کاوشگرانه", climaxEn: "Jack visits the tall white lighthouse and climbs the spiral stairs.", climaxFa: "جک به دیدار فانوس دریایی بلند رفت و از پله‌های مارپیچ آن بالا رفت.", xpReward: 185 },
  { pathCode: "AABBB", titleEn: "A Wave to the Lighthouse Keeper", titleFa: "دست تکان دادن برای فانوس‌بان", badgeCategory: "scholar", badgeIcon: "👋", badgeNameFa: "پایان دوستانه", climaxEn: "The lighthouse keeper waves back with a lantern from across the rocky bay.", climaxFa: "فانوس‌بان مهربان با چراغ‌دستی از آن سوی صخره‌ها دست تکان داد.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Sandcastle Champions", titleFa: "قهرمانان قلعه شنی", badgeCategory: "funny", badgeIcon: "🏰", badgeNameFa: "پایان شاد کودکانه", climaxEn: "Jack and the kids build a tall sandcastle decorated with shiny shells.", climaxFa: "جک و بچه‌ها یک قلعه شنی بلند با تزیین صدف‌های براق در ساحل ساختند.", xpReward: 160 },
  { pathCode: "ABAAB", titleEn: "The Animal Card Teacher", titleFa: "آموزگار حیوانات دریایی", badgeCategory: "scholar", badgeIcon: "🐬", badgeNameFa: "پایان آموزنده", climaxEn: "Each child learns the English names of dolphins, turtles, and whales.", climaxFa: "همه بچه‌ها نام انگلیسی دلفین، لاک‌پشت و نهنگ را با شادی یاد گرفتند.", xpReward: 170 },
  { pathCode: "ABABA", titleEn: "The Secret Note in the Box", titleFa: "یادداشت رازآلود در جعبه", badgeCategory: "legendary", badgeIcon: "💌", badgeNameFa: "پایان رازآلود", climaxEn: "The next traveler discovers Jack's kind note and smiles with joy.", climaxFa: "مسافر بعدی یادداشت مهربان جک را پیدا کرد و از ته دل لبخند زد.", xpReward: 200 },
  { pathCode: "ABABB", titleEn: "Sweet Dreams on Rails", titleFa: "خواب شیرین روی ریل‌ها", badgeCategory: "explorer", badgeIcon: "🌙", badgeNameFa: "پایان آرامش‌بخش", climaxEn: "Jack rests comfortably, dreaming of dolphins jumping in sparkling waves.", climaxFa: "جک با آرامش خوابید و خواب دلفین‌های بازیگوش در امواج درخشان را دید.", xpReward: 180 },
  { pathCode: "ABBAA", titleEn: "The Keepsake Ocean Ticket", titleFa: "بلیت یادگاری دریا", badgeCategory: "heroic", badgeIcon: "🎫", badgeNameFa: "پایان ماندگار", climaxEn: "The seashell ticket becomes Jack's favorite bookmark for years to come.", climaxFa: "بلیت صدفی برای سال‌ها نشان‌کتاب مورد علاقه جک در داستان‌هایش شد.", xpReward: 175 },
  { pathCode: "ABBAB", titleEn: "The Conductor's Golden Seal", titleFa: "مهر زرین رئیس قطار", badgeCategory: "secret", badgeIcon: "⭐", badgeNameFa: "پایان افتخاری", climaxEn: "Mr. Green presses a shiny star stamp onto Jack's decorated ticket.", climaxFa: "آقای گرین یک مهر ستاره‌ای طلایی روی بلیت تزیین‌شده جک زد.", xpReward: 185 },
  { pathCode: "ABBBA", titleEn: "The Morning Beach Meeting", titleFa: "دیدار صبحگاهی در ساحل", badgeCategory: "explorer", badgeIcon: "🏖️", badgeNameFa: "پایان دوستی", climaxEn: "Jack, Tim, and Lily meet on the sunny shore to hunt for colorful pebbles.", climaxFa: "جک، تیم و لیلی صبح در ساحل آفتابی جمع شدند تا سنگ‌های رنگین جمع کنند.", xpReward: 190 },
  { pathCode: "ABBBB", titleEn: "The Fruit Feast on the Train", titleFa: "جشن میوه در قطار", badgeCategory: "heroic", badgeIcon: "🍇", badgeNameFa: "پایان شیرین", climaxEn: "Sweet grapes and crisp apples make their late-night chat unforgettable.", climaxFa: "انگورهای شیرین و سیب‌های ترد گفتگوی شبانه‌شان را فراموش‌نشدنی کرد.", xpReward: 180 },
  { pathCode: "BAAAA", titleEn: "The Soap Bubble Carnival", titleFa: "جشن حباب‌های صابونی", badgeCategory: "legendary", badgeIcon: "🫧", badgeNameFa: "پایان شادمانه", climaxEn: "The whole kitchen car fills with laughter as the last rainbow bubble pops.", climaxFa: "تمام واگن آشپزخانه پر از خنده شد و آخرین حباب رنگین‌کمانی ترکید.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Chef's Grateful Hug", titleFa: "تشکر گرم سرآشپز", badgeCategory: "scholar", badgeIcon: "🧑‍🍳", badgeNameFa: "پایان قدردانی", climaxEn: "Chef Dan thanks Jack with a warm handshake and a basket of apples.", climaxFa: "سرآشپز دن با یک دست دادن گرم و سبدی پر از سیب از جک تشکر کرد.", xpReward: 175 },
  { pathCode: "BAABA", titleEn: "The Junior Train Chef", titleFa: "سرآشپز نوجوان قطار", badgeCategory: "funny", badgeIcon: "🏆", badgeNameFa: "پایان پرافتخار", climaxEn: "Everyone calls Jack the star assistant of the Silver Star Express.", climaxFa: "همه جک را ستاره و دستیار نمونه قطار سریع‌السیر ستاره نقره‌ای نامیدند.", xpReward: 165 },
  { pathCode: "BAABB", titleEn: "The Souvenir Chef Hat", titleFa: "کلاه آشپزی یادگاری", badgeCategory: "scholar", badgeIcon: "👒", badgeNameFa: "پایان یادگاری", climaxEn: "Jack wears the tall white hat all the way down to the ocean dock.", climaxFa: "جک کلاه سفید سرآشپز را تا اسکله ساحل بر سر گذاشت و خندید.", xpReward: 170 },
  { pathCode: "BABAA", titleEn: "The Young Officer Salute", titleFa: "سلام افسر کوچک", badgeCategory: "scholar", badgeIcon: "🎖️", badgeNameFa: "پایان باوقار", climaxEn: "Mr. Green salutes Jack back with a warm smile and a whistle salute.", climaxFa: "آقای گرین با لبخندی گرم و یک سوت کوتاه به جک ادای احترام کرد.", xpReward: 180 },
  { pathCode: "BABAB", titleEn: "The Smiling Guide", titleFa: "راهنمای مهربان مسافران", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان یاری‌رسان", climaxEn: "Travelers thank Jack for his cheerful assistance and bright attitude.", climaxFa: "مسافران از کمک‌های پرانرژی و اخلاق خوش جک صمیمانه تشکر کردند.", xpReward: 175 },
  { pathCode: "BABBA", titleEn: "Fresh Flowers on Every Table", titleFa: "گل‌های تازه روی میزها", badgeCategory: "heroic", badgeIcon: "🌸", badgeNameFa: "پایان معطر", climaxEn: "The morning dining car looks like a blooming garden beside the sea.", climaxFa: "رستوران صبحگاهی قطار مثل باغچه‌ای پرگل در کنار دریا شد.", xpReward: 190 },
  { pathCode: "BABBB", titleEn: "The Swan Napkin Artist", titleFa: "هنرمند قوهای دستمالی", badgeCategory: "legendary", badgeIcon: "🦢", badgeNameFa: "پایان خلاقانه", climaxEn: "Every passenger admires the folded swan napkins greeting their breakfast.", climaxFa: "مسافران از دیدن دستمال‌های قویی‌شکل روی میزهای صبحانه شگفت‌زده شدند.", xpReward: 200 },
  { pathCode: "BBAAA", titleEn: "Sunday Muffin Baker", titleFa: "شیرینی‌پز یکشنبه‌ها", badgeCategory: "heroic", badgeIcon: "🧁", badgeNameFa: "پایان آشپزی خانگی", climaxEn: "Jack bakes warm berry muffins at home, filling the house with love.", climaxFa: "جک در خانه مافین‌های توت تازه پخت و خانه را پر از عطر خوشمزه کرد.", xpReward: 180 },
  { pathCode: "BBAAB", titleEn: "The School Recipe Star", titleFa: "ستاره دستور پخت مدرسه", badgeCategory: "explorer", badgeIcon: "📜", badgeNameFa: "پایان محبوبیت", climaxEn: "Classmates try the simple muffin recipe and bring treats to school.", climaxFa: "همکلاسی‌ها دستور مافین را امتحان کردند و برای مدرسه شیرینی آوردند.", xpReward: 175 },
  { pathCode: "BBABA", titleEn: "The Seaside Guitar Duet", titleFa: "هم‌نوازی گیتار کنار دریا", badgeCategory: "funny", badgeIcon: "🎸", badgeNameFa: "پایان موزیکال", climaxEn: "Jack and Tim strum happy chords together as seagulls glide above.", climaxFa: "جک و تیم آهنگ‌های شاد نواختند و مرغان دریایی بالای سرشان پرواز کردند.", xpReward: 160 },
  { pathCode: "BBABB", titleEn: "Sunrise Over Cabin 4", titleFa: "طلوع خورشید در کوپه ۴", badgeCategory: "heroic", badgeIcon: "☀️", badgeNameFa: "پایان درخشان", climaxEn: "Golden sunlight streams through the glass, welcoming a wonderful day.", climaxFa: "نور طلایی آفتاب از شیشه تابید و روزی شگفت‌انگیز را آغاز کرد.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "First Steps on the Shore", titleFa: "اولین قدم‌ها بر شن‌های ساحل", badgeCategory: "scholar", badgeIcon: "👣", badgeNameFa: "پایان ماجراجوی ساحل", climaxEn: "Jack dips his toes in the cool foaming tide, smiling under the sun.", climaxFa: "جک پاهایش را در آب خنک کف‌آلود دریا گذاشت و زیر نور خورشید خندید.", xpReward: 195 },
  { pathCode: "BBBAB", titleEn: "The Seagulls Calling", titleFa: "آواز مرغان دریایی", badgeCategory: "legendary", badgeIcon: "🕊️", badgeNameFa: "پایان نغمه پرندگان", climaxEn: "White seagulls swoop down gracefully, greeting the train with soft calls.", climaxFa: "مرغان دریایی سفید با نرمی پرواز کردند و با صداهای آرام به قطار درود گفتند.", xpReward: 200 },
  { pathCode: "BBBBA", titleEn: "A Race to the Ocean Waves", titleFa: "دویدن به سوی امواج", badgeCategory: "scholar", badgeIcon: "🌊", badgeNameFa: "پایان پرانرژی", climaxEn: "Jack runs along the sandy beach, feeling the cool morning sea breeze.", climaxFa: "جک روی شن‌های ساحل دوید و نسیم خنک صبحگاهی دریا صورتش را نوازش کرد.", xpReward: 170 },
  { pathCode: "BBBBB", titleEn: "The Seaside Family Feast", titleFa: "جشن بزرگ خانوادگی در ساحل", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "With full hearts, happy laughter, and morning sunshine, the journey is complete.", climaxFa: "با دلی شاد، خنده‌های گرم و نور آفتاب صبحگاهی، این سفر زیبا به یاد ماندنی شد.", xpReward: 200 },
];

export const story3MidnightTrain: AdventureStory = buildAdventureStory({
  id: "a1-midnight-train",
  storyIndex: 3,
  cefr: "A1",
  titleEn: "The Midnight Train to the Sea",
  titleFa: "قطار شب به سوی دریا",
  genre: "travel",
  genreLabelFa: "🚂 سفر و ماجراجویی",
  genreIcon: "🚂",
  synopsisEn:
    "Jack rides the cozy train under star-filled skies heading to the sea. Play sweet music with Tim or help Chef Dan bake apple pies across 32 heartwarming endings!",
  synopsisFa:
    "جک سوار بر قطار آبی گرم و نرم به سمت دریا سفر می‌کند. آیا با تیم در کوپه گیتار می‌نوازی یا به سرآشپز در پختن پای سیب کمک می‌کنی؟ ۳۲ پایان شیرین و پر از صمیمیت منتظر توست!",
  coverImage: "/images/skills/reading/midnight-train.webp",
  nodes,
  endings,
});
