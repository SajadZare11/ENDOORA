import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2: The Golden Key in the Attic (کلید طلایی در اتاق زیرشیروانی)
// Style: Family and Friends Readers (CEFR A1)
// Grammar: Present Simple, Present Continuous, To Be, was/were, Regular Past (-ed) only!
// Common English Names: Sam, Grandma Mary, Lucy
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Today is Sunday. A boy named Sam is visiting Grandma Mary. Grandma Mary lives in a lovely old house. Sam walks up the wooden stairs to the attic. Sunlight shines through a round window. On a small table, Sam looks at a shiny golden key. The key looks like a little bird. Next to the key is a card: 'Hello Sam!'",
    keywords: [
      { word: "attic", meaningFa: "اتاق زیرشیروانی", phonetic: "/ˈætɪk/" },
      { word: "stairs", meaningFa: "پله‌ها", phonetic: "/steəz/" },
      { word: "golden", meaningFa: "طلایی و درخشان", phonetic: "/ˈɡəʊldən/" },
      { word: "shines", meaningFa: "می‌تابد / می‌درخشد", phonetic: "/ʃaɪnz/" },
    ],
    question: {
      promptEn: "What does the golden key look like?",
      promptFa: "کلید طلایی شبیه به چه چیزی است؟",
      options: ["A little bird", "A big fish", "A green frog"],
      correctIndex: 0,
      hintSnippet: "The key looks like a little bird.",
      clueFa: "جمله ششم را بخوان دوست من! کلید مثل یک پرنده کوچک است.",
    },
    choiceA: {
      labelEn: "Try the golden key on the wooden box!",
      labelFa: "کلید طلایی را روی جعبه چوبی امتحان کن!",
      descriptionFa: "شاید یک چیز قشنگ داخل جعبه باشد.",
    },
    choiceB: {
      labelEn: "Look behind the long green curtain!",
      labelFa: "پشت پرده بلند سبز را نگاه کن!",
      descriptionFa: "انگار یک درِ کوچک پشت پرده پنهان شده است.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Sam walks to the wooden box in the corner. The box has pictures of small dolphins. Sam puts the golden key into the lock. Click! The lock opens smoothly. Inside, Sam looks at a yellow notebook and a brown hat. Everything is clean and neat.",
    keywords: [
      { word: "corner", meaningFa: "گوشه اتاق", phonetic: "/ˈkɔːnər/" },
      { word: "dolphins", meaningFa: "دلفین‌ها", phonetic: "/ˈdɒlfɪnz/" },
      { word: "lock", meaningFa: "قفل", phonetic: "/lɒk/" },
    ],
    question: {
      promptEn: "What animals are pictured on the box?",
      promptFa: "عکس چه جانورانی روی جعبه کشیده شده است؟",
      options: ["Small dolphins", "Big lions", "Pink birds"],
      correctIndex: 0,
      hintSnippet: "The box has pictures of small dolphins.",
      clueFa: "خط دوم را نگاه کن! عکس دلفین‌های کوچک روی جعبه است.",
    },
    choiceA: {
      labelEn: "Open the yellow notebook!",
      labelFa: "دفترچه زرد را باز کن!",
      descriptionFa: "شاید داخل آن نقاشی‌های قدیمی باشد.",
    },
    choiceB: {
      labelEn: "Pick up the brown hat!",
      labelFa: "کلاه قهوه‌ای را بردار!",
      descriptionFa: "شاید زیر کلاه یک چیز جالب باشد.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Sam walks to the long green curtain. He pushes the curtain with his hand. Behind the curtain, he looks at a small door. There is a tiny bell near the door. The door has a small bird picture on it. Sam is excited.",
    keywords: [
      { word: "curtain", meaningFa: "پرده", phonetic: "/ˈkɜːtn/" },
      { word: "pushes", meaningFa: "هل می‌دهد / کنار می‌زند", phonetic: "/ˈpʊʃɪz/" },
      { word: "bell", meaningFa: "زنگوله کوچک", phonetic: "/bel/" },
    ],
    question: {
      promptEn: "What is near the small door?",
      promptFa: "نزدیک درِ کوچک چه چیزی هست؟",
      options: ["A tiny bell", "A big ball", "A red apple"],
      correctIndex: 0,
      hintSnippet: "There is a tiny bell near the door.",
      clueFa: "خط چهارم را بخوان! یک زنگوله کوچک نزدیک در است.",
    },
    choiceA: {
      labelEn: "Open the small door with the key!",
      labelFa: "درِ کوچک را با کلید باز کن!",
      descriptionFa: "کلید پرنده‌ای شاید به این در بخورد.",
    },
    choiceB: {
      labelEn: "Ring the tiny bell!",
      labelFa: "زنگوله کوچک را به صدا درآور!",
      descriptionFa: "شاید صدایش به طبقه پایین برسد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Sam opens the yellow notebook. On the first page, Grandma Mary painted a map of the garden! Next to the map, Sam looks at three shiny stickers. A girl named Lucy walks into the attic. Lucy is Sam's sister. She smiles at Sam.",
    keywords: [
      { word: "notebook", meaningFa: "دفترچه یادداشت", phonetic: "/ˈnəʊtbʊk/" },
      { word: "painted", meaningFa: "نقاشی کرد / کشید", phonetic: "/ˈpeɪntɪd/" },
      { word: "sister", meaningFa: "خواهر", phonetic: "/ˈsɪstər/" },
    ],
    question: {
      promptEn: "Who painted the garden map?",
      promptFa: "چه کسی نقشه باغچه را کشیده بود؟",
      options: ["Grandma Mary", "Mr. Brown", "The baker"],
      correctIndex: 0,
      hintSnippet: "Grandma Mary painted a map of the garden!",
      clueFa: "خط دوم را ببین دوست من! مادربزرگ مری نقشه را کشیده است.",
    },
    choiceA: {
      labelEn: "Follow the garden map downstairs!",
      labelFa: "با نقشه به سمت حیاط و باغچه برو!",
      descriptionFa: "شاید یک گل یا درخت خاص توی باغچه باشد.",
    },
    choiceB: {
      labelEn: "Show the map to Lucy!",
      labelFa: "نقشه را به لوسی نشان بده!",
      descriptionFa: "لوسی عاشق معما و ماجراجویی است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Sam picks up the brown hat. Under the hat is an old camera. The camera is blue. Sam smiles happily. 'Look, a nice camera!' he shouts. Grandma Mary knocks on the attic door. She is holding a plate of warm cookies.",
    keywords: [
      { word: "camera", meaningFa: "دوربین عکاسی", phonetic: "/ˈkæmrə/" },
      { word: "shouts", meaningFa: "با هیجان صدا می‌زند", phonetic: "/ʃaʊts/" },
      { word: "cookies", meaningFa: "شیرینی‌ها / بیسکویت‌ها", phonetic: "/ˈkʊkiz/" },
    ],
    question: {
      promptEn: "What color is the old camera?",
      promptFa: "دوربین عکاسی چه رنگی است؟",
      options: ["Blue", "Red", "Black"],
      correctIndex: 0,
      hintSnippet: "The camera is blue.",
      clueFa: "خط سوم را بخوان! نوشته دوربین آبی است.",
    },
    choiceA: {
      labelEn: "Take a photo of Grandma Mary!",
      labelFa: "یک عکس قشنگ از مادربزرگ مری بگیر!",
      descriptionFa: "مادربزرگ یک بشقاب شیرینی خوشمزه در دست دارد.",
    },
    choiceB: {
      labelEn: "Share the warm cookies with Grandma!",
      labelFa: "شیرینی‌های گرم را با مادربزرگ بخور!",
      descriptionFa: "نشستن و قصه شنیدن خیلی لذت‌بخش است.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Sam opens the small door with the golden key. It opens into a sunny plant room! Green plants are everywhere. A small yellow bird is singing near the window. Sunlight fills the warm room.",
    keywords: [
      { word: "plants", meaningFa: "گیاهان و گلدان‌ها", phonetic: "/plɑːnts/" },
      { word: "singing", meaningFa: "آواز خواندن", phonetic: "/ˈsɪŋɪŋ/" },
      { word: "sunlight", meaningFa: "نور خورشید", phonetic: "/ˈsʌnlaɪt/" },
    ],
    question: {
      promptEn: "What is singing near the window?",
      promptFa: "چه چیزی کنار پنجره آواز می‌خواند؟",
      options: ["A small yellow bird", "A black cat", "A noisy frog"],
      correctIndex: 0,
      hintSnippet: "A small yellow bird is singing near the window.",
      clueFa: "خط سوم را ببین! یک پرنده زرد کوچک آواز می‌خواند.",
    },
    choiceA: {
      labelEn: "Water the green plants!",
      labelFa: "به گیاهان سبز آب بده!",
      descriptionFa: "گیاهان تشنه هستند و نور خورشید را دوست دارند.",
    },
    choiceB: {
      labelEn: "Listen to the yellow bird!",
      labelFa: "به صدای پرنده زرد گوش بده!",
      descriptionFa: "پرنده یک آواز شیرین و شاد می‌خواند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Sam rings the tiny bell. Ding-dong! The bell sounds like sweet music. Lucy walks up the attic stairs. She is smiling. She is holding a box of colored pencils and white paper. 'Let us play together!' says Lucy.",
    keywords: [
      { word: "music", meaningFa: "موسیقی و آهنگ", phonetic: "/ˈmjuːzɪk/" },
      { word: "pencils", meaningFa: "مدادرنگی‌ها", phonetic: "/ˈpenslz/" },
      { word: "paper", meaningFa: "کاغذ سفید", phonetic: "/ˈpeɪpər/" },
    ],
    question: {
      promptEn: "What is Lucy holding?",
      promptFa: "لوسی چه چیزی در دست دارد؟",
      options: ["A box of colored pencils", "A big football", "A red cup"],
      correctIndex: 0,
      hintSnippet: "She is holding a box of colored pencils and white paper.",
      clueFa: "خط چهارم را بخوان! یک جعبه مدادرنگی در دست دارد.",
    },
    choiceA: {
      labelEn: "Draw a picture of the attic!",
      labelFa: "نقاشی اتاق زیرشیروانی را بکشید!",
      descriptionFa: "می‌توانید کلید طلایی و پنجره گرد را بکشید.",
    },
    choiceB: {
      labelEn: "Help Grandma Mary bake a pie!",
      labelFa: "به مادربزرگ در پختن پای سیب کمک کنید!",
      descriptionFa: "بوی سیب و دارچین از آشپزخانه می‌آید.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Sam and Lucy walk down to the green garden. The map points to an old wooden bench under a big apple tree. Behind the bench, they look at a small tin box with a heart on it.",
    keywords: [
      { word: "bench", meaningFa: "نیمکت چوبی", phonetic: "/bentʃ/" },
      { word: "apple tree", meaningFa: "درخت سیب", phonetic: "/ˈæpl triː/" },
      { word: "tin", meaningFa: "جعبه فلزی کوچک", phonetic: "/tɪn/" },
    ],
    question: {
      promptEn: "Where is the old wooden bench?",
      promptFa: "نیمکت چوبی قدیمی کجاست؟",
      options: ["Under a big apple tree", "On the roof", "In the cold river"],
      correctIndex: 0,
      hintSnippet: "under a big apple tree",
      clueFa: "خط دوم را بخوان! زیر درخت بزرگ سیب است.",
    },
    choiceA: {
      labelEn: "Open the small tin box!",
      labelFa: "جعبه فلزی کوچک را باز کن!",
      descriptionFa: "شاید دانه‌های گل درون آن باشد.",
    },
    choiceB: {
      labelEn: "Plant flowers near the bench!",
      labelFa: "نزدیک نیمکت گل‌های زیبا بکار!",
      descriptionFa: "گل‌های تازه باغچه را زیباتر می‌کنند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Sam shows the map to Lucy. Lucy points at the garden pond. 'Look! The pond has white water lilies,' says Lucy. They walk together to the water. Shiny orange fish swim under the green leaves.",
    keywords: [
      { word: "pond", meaningFa: "حوضچه / برکه کوچک", phonetic: "/pɒnd/" },
      { word: "lilies", meaningFa: "گل‌های نیلوفر آبی", phonetic: "/ˈlɪliz/" },
      { word: "swim", meaningFa: "شنا می‌کنند", phonetic: "/swɪm/" },
    ],
    question: {
      promptEn: "What color are the water lilies?",
      promptFa: "نیلوفرهای آبی چه رنگی هستند؟",
      options: ["White", "Black", "Brown"],
      correctIndex: 0,
      hintSnippet: "The pond has white water lilies",
      clueFa: "خط دوم را بخوان! نیلوفرهای آبی سفید هستند.",
    },
    choiceA: {
      labelEn: "Feed the orange fish in the pond!",
      labelFa: "به ماهی‌های نارنجی توی حوضچه غذا بده!",
      descriptionFa: "ماهی‌ها کنار برگ‌های نیلوفر شنا می‌کنند.",
    },
    choiceB: {
      labelEn: "Paint the water lilies with watercolors!",
      labelFa: "از نیلوفرهای آبی با آبرنگ نقاشی بکش!",
      descriptionFa: "گل‌های سفید روی آب خیلی قشنگ هستند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Sam takes a photo of Grandma Mary with the blue camera. Grandma Mary smiles and holds up a plate of cookies. Click! The photo is bright and clear. 'You are a good photographer!' Grandma Mary says.",
    keywords: [
      { word: "photo", meaningFa: "عکس", phonetic: "/ˈfəʊtəʊ/" },
      { word: "bright", meaningFa: "روشن و درخشان", phonetic: "/braɪt/" },
      { word: "photographer", meaningFa: "عکاس", phonetic: "/fəˈtɒɡrəfər/" },
    ],
    question: {
      promptEn: "What is Grandma Mary holding in the photo?",
      promptFa: "مادربزرگ در عکس چه چیزی در دست دارد؟",
      options: ["A plate of cookies", "A big clock", "A green umbrella"],
      correctIndex: 0,
      hintSnippet: "Grandma Mary smiles and holds up a plate of cookies.",
      clueFa: "خط دوم را ببین! یک بشقاب شیرینی در دست دارد.",
    },
    choiceA: {
      labelEn: "Make a photo album for Grandma!",
      labelFa: "یک آلبوم عکس برای مادربزرگ درست کن!",
      descriptionFa: "عکس‌های خانوادگی یادگاری‌های قشنگی هستند.",
    },
    choiceB: {
      labelEn: "Hang the photo on the living room wall!",
      labelFa: "عکس را به دیوار اتاق پذیرایی بزن!",
      descriptionFa: "همه مهمان‌ها این عکس قشنگ را می‌بینند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Sam and Grandma Mary sit on the soft attic sofa. They eat the warm cookies together. Grandma Mary tells a sweet story about her childhood garden. Sam listens with a big smile.",
    keywords: [
      { word: "sofa", meaningFa: "کاناپه نرم", phonetic: "/ˈsəʊfə/" },
      { word: "childhood", meaningFa: "دوران کودکی", phonetic: "/ˈtʃaɪldhʊd/" },
      { word: "listens", meaningFa: "گوش می‌دهد", phonetic: "/ˈlɪsnz/" },
    ],
    question: {
      promptEn: "Where do Sam and Grandma sit?",
      promptFa: "سام و مادربزرگ کجا می‌نشینند؟",
      options: ["On the soft attic sofa", "On the cold ground", "In a car"],
      correctIndex: 0,
      hintSnippet: "on the soft attic sofa",
      clueFa: "خط اول را بخوان! روی کاناپه نرم زیرشیروانی می‌نشینند.",
    },
    choiceA: {
      labelEn: "Write down Grandma's story in a notebook!",
      labelFa: "قصه قشنگ مادربزرگ را در دفتر بنویس!",
      descriptionFa: "قصه‌های مادربزرگ همیشه در یاد می‌مانند.",
    },
    choiceB: {
      labelEn: "Plant a young tree in the garden!",
      labelFa: "یک نهال درخت جوان در باغچه بکار!",
      descriptionFa: "درخت با گذشت زمان بزرگ و پربرگ می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Sam waters the green plants in the sunny room. The leaves shine in the morning light. A small red tomato is growing on one vine! Sam is very proud of the garden room.",
    keywords: [
      { word: "waters", meaningFa: "آب می‌دهد", phonetic: "/ˈwɔːtəz/" },
      { word: "tomato", meaningFa: "گوجه‌فرنگی", phonetic: "/təˈmɑːtəʊ/" },
      { word: "proud", meaningFa: "خوشحال و مغرور", phonetic: "/praʊd/" },
    ],
    question: {
      promptEn: "What is growing on one vine?",
      promptFa: "روی یکی از شاخه‌ها چه چیزی در حال رشد است؟",
      options: ["A small red tomato", "A yellow lemon", "A purple plum"],
      correctIndex: 0,
      hintSnippet: "A small red tomato is growing on one vine!",
      clueFa: "خط سوم را ببین! یک گوجه‌فرنگی کوچک قرمز دارد رشد می‌کند.",
    },
    choiceA: {
      labelEn: "Pick the ripe tomato for lunch salad!",
      labelFa: "گوجه‌فرنگی رسیده را برای سالاد ناهار بچین!",
      descriptionFa: "گوجه‌های تازه باغچه خیلی خوشمزه هستند.",
    },
    choiceB: {
      labelEn: "Care for the plants every weekend!",
      labelFa: "هر آخر هفته به گیاهان رسیدگی کن!",
      descriptionFa: "گلخانه پشت‌بام پر از گل‌های شاداب می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Sam listens to the yellow bird. The bird hops onto a wooden perch. It chirps a happy song. Lucy brings small seeds in a bowl. She places the bowl near the sunny window.",
    keywords: [
      { word: "hops", meaningFa: "ورجه وورجه می‌کند / می‌پرد", phonetic: "/hɒps/" },
      { word: "chirps", meaningFa: "جیک‌جیک می‌کند", phonetic: "/tʃɜːps/" },
      { word: "seeds", meaningFa: "دانه‌ها", phonetic: "/siːdz/" },
    ],
    question: {
      promptEn: "What does Lucy bring in a bowl?",
      promptFa: "لوسی در کاسه چه چیزی می‌آورد؟",
      options: ["Small seeds", "Cold milk", "Hot soup"],
      correctIndex: 0,
      hintSnippet: "Lucy brings small seeds in a bowl.",
      clueFa: "خط سوم را بخوان! لوسی دانه‌های کوچک در کاسه می‌آورد.",
    },
    choiceA: {
      labelEn: "Build a small wooden birdhouse!",
      labelFa: "یک لانه چوبی کوچک برای پرنده‌ها بساز!",
      descriptionFa: "پرنده‌ها در زمستان خانه گرم خواهند داشت.",
    },
    choiceB: {
      labelEn: "Draw the yellow bird in an art book!",
      labelFa: "عکس پرنده زرد را در دفتر نقاشی بکش!",
      descriptionFa: "پرهای زرد و چشمان ریز پرنده بسیار زیبا است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Sam and Lucy sit on the clean wooden floor. They use colored pencils to draw the attic. They draw the golden key, the round window, and the bright sun. Grandma Mary looks at their picture and smiles.",
    keywords: [
      { word: "clean", meaningFa: "تمیز و پاکیزه", phonetic: "/kliːn/" },
      { word: "draw", meaningFa: "نقاشی کشیدن", phonetic: "/drɔː/" },
      { word: "picture", meaningFa: "تصویر / نقاشی", phonetic: "/ˈpɪktʃər/" },
    ],
    question: {
      promptEn: "Where do Sam and Lucy sit?",
      promptFa: "سام و لوسی کجا می‌نشینند؟",
      options: ["On the clean wooden floor", "On the attic roof", "Under the table"],
      correctIndex: 0,
      hintSnippet: "on the clean wooden floor",
      clueFa: "خط اول را ببین دوست من! روی کف چوبی تمیز می‌نشینند.",
    },
    choiceA: {
      labelEn: "Frame the drawing for the living room!",
      labelFa: "نقاشی را قاب کن و به دیوار بزن!",
      descriptionFa: "یک قاب چوبی زیبا نقاشی را عالی نشان می‌دهد.",
    },
    choiceB: {
      labelEn: "Send the drawing to your cousins!",
      labelFa: "نقاشی را با یک نامه برای بچه‌های فامیل بفرست!",
      descriptionFa: "آن‌ها از دیدن نقاشی قشنگ شما خیلی خوشحال می‌شوند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Sam and Lucy walk downstairs to the warm kitchen. Grandma Mary is rolling pie dough on the table. 'You can help me with the apples!' she says kindly. Sweet cinnamon smells wonderful.",
    keywords: [
      { word: "kitchen", meaningFa: "آشپزخانه", phonetic: "/ˈkɪtʃɪn/" },
      { word: "dough", meaningFa: "خمیر پای", phonetic: "/dəʊ/" },
      { word: "cinnamon", meaningFa: "دارچین خوشبو", phonetic: "/ˈsɪnəmən/" },
    ],
    question: {
      promptEn: "What is Grandma Mary rolling?",
      promptFa: "مادربزرگ چه چیزی را روی میز پهن می‌کند؟",
      options: ["Pie dough", "A soccer ball", "A red carpet"],
      correctIndex: 0,
      hintSnippet: "Grandma Mary is rolling pie dough on the table.",
      clueFa: "خط دوم را بخوان! خمیر پای را روی میز پهن می‌کند.",
    },
    choiceA: {
      labelEn: "Mix sweet cinnamon into the apples!",
      labelFa: "دارچین خوشبو را با سیب‌ها مخلوط کن!",
      descriptionFa: "پای سیب با دارچین خیلی خوشمزه می‌شود.",
    },
    choiceB: {
      labelEn: "Decorate the pie with dough stars!",
      labelFa: "روی پای را با ستاره‌های خمیری تزیین کن!",
      descriptionFa: "ستاره‌های خمیری شکل پای را دیدنی می‌کنند.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Sam opens the small tin box. Inside are flower seeds in paper packets. The label says: 'Plant with love.' Sam and Lucy smile at each other.",
    keywords: [{ word: "packets", meaningFa: "بسته‌های کاغذی کوچک", phonetic: "/ˈpækɪts/" }],
    question: {
      promptEn: "What is inside the small tin box?",
      promptFa: "داخل جعبه فلزی کوچک چه چیزی است؟",
      options: ["Flower seeds", "Old coins", "Small stones"],
      correctIndex: 0,
      hintSnippet: "Inside are flower seeds in paper packets.",
      clueFa: "دانه‌های گل داخل بسته‌های کاغذی است.",
    },
    choiceA: {
      labelEn: "Plant the flower seeds by the garden gate!",
      labelFa: "دانه‌ها را کنار دروازه باغچه بکار!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Give the seeds to the neighborhood school!",
      labelFa: "دانه‌ها را به حیاط مدرسه هدیه بده!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Sam and Lucy plant flowers near the wooden bench. They water the soil with a small watering can. Butterflies fly over the colorful garden.",
    keywords: [{ word: "soil", meaningFa: "خاک باغچه", phonetic: "/sɔɪl/" }],
    question: {
      promptEn: "What flies over the garden?",
      promptFa: "چه چیزی بالای باغچه پرواز می‌کند؟",
      options: ["Butterflies", "Airplane", "Kite"],
      correctIndex: 0,
      hintSnippet: "Butterflies fly over the colorful garden.",
      clueFa: "پروانه‌ها بالای باغچه پرواز می‌کنند.",
    },
    choiceA: {
      labelEn: "Place a small birdbath by the flowers!",
      labelFa: "یک حوضچه کوچک آب برای پرنده‌ها بگذار!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Invite Grandma Mary to sit on the bench!",
      labelFa: "مادربزرگ را به نشستن روی نیمکت دعوت کن!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Sam sprinkles fish food into the pond. The orange fish swim up and splash softly. Lucy claps her hands with joy.",
    keywords: [{ word: "splash", meaningFa: "شلپ‌شلوپ کردن آب", phonetic: "/splæʃ/" }],
    question: {
      promptEn: "Who claps her hands with joy?",
      promptFa: "چه کسی از خوشحالی دست می‌زند؟",
      options: ["Lucy", "Mr. Brown", "The cat"],
      correctIndex: 0,
      hintSnippet: "Lucy claps her hands with joy.",
      clueFa: "لوسی از خوشحالی دست می‌زند.",
    },
    choiceA: {
      labelEn: "Name the biggest orange fish Sunny!",
      labelFa: "اسم بزرگ‌ترین ماهی را سانی بگذار!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Clean the small pond every weekend!",
      labelFa: "هر آخر هفته آب حوضچه را تمیز کن!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Lucy paints the white water lilies with her watercolors. The blue water and green leaves look wonderful on her paper. Grandma Mary frames the art.",
    keywords: [{ word: "watercolors", meaningFa: "رنگ‌های آبرنگ", phonetic: "/ˈwɔːtəkʌləz/" }],
    question: {
      promptEn: "Who frames the art?",
      promptFa: "چه کسی نقاشی را قاب می‌کند؟",
      options: ["Grandma Mary", "The mailman", "Sam's teacher"],
      correctIndex: 0,
      hintSnippet: "Grandma Mary frames the art.",
      clueFa: "مادربزرگ مری نقاشی را قاب می‌کند.",
    },
    choiceA: {
      labelEn: "Display the painting in the local library!",
      labelFa: "نقاشی را در کتابخانه محله نمایش بده!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Teach other kids how to paint water lilies!",
      labelFa: "به بچه‌های دیگر نقاشی نیلوفر یاد بده!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Sam pastes the bright photo into a blue family album. Grandma Mary writes the date under the picture with a silver pen.",
    keywords: [{ word: "pastes", meaningFa: "می‌چسباند", phonetic: "/peɪsts/" }],
    question: {
      promptEn: "What color is the pen?",
      promptFa: "خودکار چه رنگی است؟",
      options: ["Silver", "Yellow", "Orange"],
      correctIndex: 0,
      hintSnippet: "with a silver pen",
      clueFa: "با یک خودکار نقره‌ای می‌نویسد.",
    },
    choiceA: {
      labelEn: "Fill the entire album with happy memories!",
      labelFa: "کل آلبوم را پر از خاطرات شاد کن!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Show the album at the family dinner!",
      labelFa: "آلبوم را در شام خانوادگی نشان بده!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Sam hangs the photo frame on the living room wall. Whenever guests enter the house, they smile at Grandma's happy face.",
    keywords: [{ word: "guests", meaningFa: "مهمان‌ها", phonetic: "/ɡests/" }],
    question: {
      promptEn: "Where does Sam hang the photo frame?",
      promptFa: "سام قاب عکس را کجا آویزان می‌کند؟",
      options: ["On the living room wall", "In the dark closet", "Outside on the tree"],
      correctIndex: 0,
      hintSnippet: "on the living room wall",
      clueFa: "روی دیوار اتاق پذیرایی آویزان می‌کند.",
    },
    choiceA: {
      labelEn: "Add more photos of family adventures!",
      labelFa: "عکس‌های بیشتری از ماجراجویی‌ها اضافه کن!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Become the family photographer every holiday!",
      labelFa: "عکاس رسمی خانواده در همه تعطیلات بشو!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Sam writes Grandma's story in the notebook. He draws pictures of Grandma's old puppy and the big sunflower in the yard.",
    keywords: [{ word: "sunflower", meaningFa: "گل آفتابگردان", phonetic: "/ˈsʌnflaʊər/" }],
    question: {
      promptEn: "What flower does Sam draw?",
      promptFa: "سام چه گلی را نقاشی می‌کند؟",
      options: ["A big sunflower", "A small cactus", "A blue tulip"],
      correctIndex: 0,
      hintSnippet: "the big sunflower in the yard",
      clueFa: "گل آفتابگردان بزرگ را نقاشی می‌کند.",
    },
    choiceA: {
      labelEn: "Read the story aloud to your classmates!",
      labelFa: "قصه را برای همکلاسی‌هایت با صدای بلند بخوان!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Keep the story notebook in your schoolbag!",
      labelFa: "دفترچه قصه را در کیفت نگه دار!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Sam and Grandma plant a young cherry tree in the corner of the garden. They water the roots together under the afternoon sun.",
    keywords: [{ word: "cherry", meaningFa: "گیلاس", phonetic: "/ˈtʃeri/" }],
    question: {
      promptEn: "What tree do they plant?",
      promptFa: "آن‌ها چه درختی می‌کارند؟",
      options: ["A young cherry tree", "A pine tree", "A palm tree"],
      correctIndex: 0,
      hintSnippet: "a young cherry tree",
      clueFa: "یک نهال درخت گیلاس جوان می‌کارند.",
    },
    choiceA: {
      labelEn: "Measure the tree every spring!",
      labelFa: "هر بهار قد درخت را اندازه بگیر!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Hang a wooden bird swing on the branch!",
      labelFa: "یک تاب چوبی کوچک برای پرنده‌ها به شاخه بزن!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Sam picks the sweet red tomato. Grandma Mary washes it with cool water and cuts it for the salad. The salad tastes fresh and delicious.",
    keywords: [{ word: "salad", meaningFa: "سالاد سبزیجات", phonetic: "/ˈsæləd/" }],
    question: {
      promptEn: "How does the salad taste?",
      promptFa: "مزه سالاد چطور است؟",
      options: ["Fresh and delicious", "Sour and cold", "Too salty"],
      correctIndex: 0,
      hintSnippet: "The salad tastes fresh and delicious.",
      clueFa: "سالاد تازه و خوشمزه است.",
    },
    choiceA: {
      labelEn: "Grow green mint and parsley next!",
      labelFa: "دفعه بعد نعناع و جعفری تازه بکار!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Share fresh vegetables with neighbors!",
      labelFa: "سبزیجات تازه را با همسایه‌ها تقسیم کن!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Every Saturday, Sam waters the attic plants. The plant room becomes a mini jungle of green leaves and pretty blossoms.",
    keywords: [{ word: "blossoms", meaningFa: "شکوفه‌های رنگارنگ", phonetic: "/ˈblɒsəmz/" }],
    question: {
      promptEn: "When does Sam water the attic plants?",
      promptFa: "سام چه زمانی به گیاهان آب می‌دهد؟",
      options: ["Every Saturday", "Only at midnight", "Once a year"],
      correctIndex: 0,
      hintSnippet: "Every Saturday, Sam waters the attic plants.",
      clueFa: "هر شنبه به گیاهان آب می‌دهد.",
    },
    choiceA: {
      labelEn: "Invite school friends to see the indoor garden!",
      labelFa: "دوستان مدرسه را به تماشای باغچه دعوت کن!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Add tiny fairy lights around the window!",
      labelFa: "چراغ‌های ریز ریسه‌ای دور پنجره نصب کن!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Sam builds a small birdhouse from wooden blocks. He paints the roof bright red. The yellow bird hops inside and chirps happily.",
    keywords: [{ word: "birdhouse", meaningFa: "لانه پرنده", phonetic: "/ˈbɜːdhaʊs/" }],
    question: {
      promptEn: "What color is the birdhouse roof?",
      promptFa: "سقف لانه پرنده چه رنگی است؟",
      options: ["Bright red", "Dark black", "Pale grey"],
      correctIndex: 0,
      hintSnippet: "He paints the roof bright red.",
      clueFa: "سقف لانه قرمز روشن است.",
    },
    choiceA: {
      labelEn: "Build two more birdhouses for the garden!",
      labelFa: "دو لانه دیگر برای باغچه بساز!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Keep clean water in the bird tray every day!",
      labelFa: "هر روز آب تمیز در ظرف پرنده‌ها بگذار!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Sam finishes the drawing of the yellow bird. The yellow feathers look warm and bright. Lucy puts a gold star sticker on the page.",
    keywords: [{ word: "feathers", meaningFa: "پرها", phonetic: "/ˈfeðəz/" }],
    question: {
      promptEn: "What sticker does Lucy put on the page?",
      promptFa: "لوسی چه برچسبی روی صفحه می‌زند؟",
      options: ["A gold star sticker", "A frog sticker", "A car sticker"],
      correctIndex: 0,
      hintSnippet: "Lucy puts a gold star sticker on the page.",
      clueFa: "یک برچسب ستاره طلایی می‌زند.",
    },
    choiceA: {
      labelEn: "Give the picture to Grandma as a gift!",
      labelFa: "نقاشی را به عنوان هدیه به مادربزرگ بده!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Start a bird drawing scrapbook!",
      labelFa: "یک دفترچه مخصوص نقاشی پرنده‌ها درست کن!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The drawing of the attic hangs in a wooden frame in the hallway. Grandma Mary smiles every time she walks past the frame.",
    keywords: [{ word: "hallway", meaningFa: "راهرو خانه", phonetic: "/ˈhɔːlweɪ/" }],
    question: {
      promptEn: "Where does the drawing hang?",
      promptFa: "نقاشی کجا آویزان است؟",
      options: ["In the hallway", "In the garden shed", "Behind the door"],
      correctIndex: 0,
      hintSnippet: "in the hallway",
      clueFa: "در راهروی خانه آویزان است.",
    },
    choiceA: {
      labelEn: "Tell the story of the key to every visitor!",
      labelFa: "قصه کلید را برای هر مهمانی تعریف کن!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Draw a new picture of the garden next week!",
      labelFa: "هفته بعد یک نقاشی جدید از باغچه بکش!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Sam and Lucy mail their drawing to their cousins in a red envelope. Three days later, their cousins call and say: 'We love your art!'",
    keywords: [{ word: "envelope", meaningFa: "پاکت نامه", phonetic: "/ˈenvələʊp/" }],
    question: {
      promptEn: "What color is the envelope?",
      promptFa: "پاکت نامه چه رنگی است؟",
      options: ["Red", "Blue", "Green"],
      correctIndex: 0,
      hintSnippet: "in a red envelope",
      clueFa: "در یک پاکت قرمز است.",
    },
    choiceA: {
      labelEn: "Invite the cousins to visit the attic!",
      labelFa: "بچه‌های فامیل را به دیدن اتاق زیرشیروانی دعوت کن!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Make art postcards for holidays!",
      labelFa: "کارت‌پستال‌های نقاشی‌شده برای عید بساز!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The kitchen smells of sweet baked apples and cinnamon. The warm pie comes out of the oven golden and crisp. Sam and Lucy cheer.",
    keywords: [{ word: "oven", meaningFa: "فر آشپزی", phonetic: "/ˈʌvn/" }],
    question: {
      promptEn: "What comes out of the oven?",
      promptFa: "چه چیزی از داخل فر بیرون می‌آید؟",
      options: ["The warm pie", "A cold fish", "A soccer ball"],
      correctIndex: 0,
      hintSnippet: "The warm pie comes out of the oven",
      clueFa: "پای گرم و خوشمزه از فر بیرون می‌آید.",
    },
    choiceA: {
      labelEn: "Eat a slice of warm pie with vanilla ice cream!",
      labelFa: "یک تکه پای گرم را با بستنی وانیلی بخور!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Take a warm pie to kind Mr. Brown!",
      labelFa: "یک پای گرم برای آقای براون مهربان ببر!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The pie with dough stars looks beautiful on the table. Grandma Mary hugs Sam and Lucy. 'You are wonderful helpers,' she whispers.",
    keywords: [{ word: "helpers", meaningFa: "کمک‌یارهای مهربان", phonetic: "/ˈhelpəz/" }],
    question: {
      promptEn: "What shape is on the pie?",
      promptFa: "روی پای چه شکلی تزیین شده است؟",
      options: ["Dough stars", "Plastic toys", "Round stones"],
      correctIndex: 0,
      hintSnippet: "dough stars",
      clueFa: "ستاره‌های خمیری روی پای است.",
    },
    choiceA: {
      labelEn: "Keep the golden key safely on your bedroom desk!",
      labelFa: "کلید طلایی را با دقت روی میز اتاقت نگه دار!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Celebrate a happy Sunday with the whole family!",
      labelFa: "یک یکشنبه شاد و پر از مهربانی را با خانواده جشن بگیر!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Garden of Flowers", titleFa: "باغچه پر از گل", badgeCategory: "legendary", badgeIcon: "🌸", badgeNameFa: "پایان گل‌های زیبا", climaxEn: "Colorful flowers grow near the gate, welcoming everyone with a sweet scent.", climaxFa: "گل‌های رنگارنگ دم در شکوفا شدند و بوی خوششان به همه خوش‌آمد می‌گوید.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The School Garden Gift", titleFa: "هدیه سبز به مدرسه", badgeCategory: "heroic", badgeIcon: "🏫", badgeNameFa: "پایان مهربانی", climaxEn: "The school yard is bright with flowers planted by happy children.", climaxFa: "حیاط مدرسه با گل‌هایی که بچه‌ها با شادی کاشتند زیبا و روشن شد.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "The Singing Birds Haven", titleFa: "پناهگاه پرندگان شاد", badgeCategory: "scholar", badgeIcon: "🐦", badgeNameFa: "پایان آرامش‌بخش", climaxEn: "Little birds splash in the clean birdbath every warm morning.", climaxFa: "پرنده‌های کوچک هر صبح در حوضچه تمیز آب‌تنی می‌کنند و آواز می‌خوانند.", xpReward: 170 },
  { pathCode: "AAABB", titleEn: "Grandma's Peaceful Bench", titleFa: "نیمکت آرامش مادربزرگ", badgeCategory: "explorer", badgeIcon: "🪑", badgeNameFa: "پایان محبت‌آمیز", climaxEn: "Grandma Mary sits on the bench, smiles at the flowers, and reads a book.", climaxFa: "مادربزرگ مری روی نیمکت می‌نشیند، به گل‌ها لبخند می‌زند و کتاب می‌خواند.", xpReward: 155 },
  { pathCode: "AABAA", titleEn: "Sunny the Golden Fish", titleFa: "سانی، ماهی طلایی", badgeCategory: "legendary", badgeIcon: "🐟", badgeNameFa: "پایان دوستانه", climaxEn: "Sunny swims up to the surface every time Sam approaches the pond.", climaxFa: "سانی هر بار که سام کنار حوض می‌آید با خوشحالی بالا می‌آید.", xpReward: 195 },
  { pathCode: "AABAB", titleEn: "The Sparkling Pond", titleFa: "حوضچه زلال و تمیز", badgeCategory: "heroic", badgeIcon: "✨", badgeNameFa: "پایان کوشا", climaxEn: "The pond water stays clear and the white lilies bloom all summer long.", climaxFa: "آب حوضچه شفاف ماند و نیلوفرهای سفید تمام تابستان شکوفا شدند.", xpReward: 160 },
  { pathCode: "AABBA", titleEn: "The Library Art Display", titleFa: "نمایشگاه نقاشی کتابخانه", badgeCategory: "scholar", badgeIcon: "🖼️", badgeNameFa: "پایان هنری", climaxEn: "Children at the library stop to admire Lucy's water lily painting.", climaxFa: "بچه‌ها در کتابخانه می‌ایستند و نقاشی نیلوفرهای آبی لوسی را تحسین می‌کنند.", xpReward: 180 },
  { pathCode: "AABBB", titleEn: "The Young Art Club", titleFa: "باشگاه نقاشان کوچک", badgeCategory: "secret", badgeIcon: "🎨", badgeNameFa: "پایان آموزگار کوچک", climaxEn: "Lucy and Sam teach their friends how to blend watercolors gently.", climaxFa: "لوسی و سام به دوستانشان یاد می‌دهند چطور با آبرنگ نقاشی‌های زیبا بکشند.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Memory Book", titleFa: "کتاب خاطرات خانوادگی", badgeCategory: "legendary", badgeIcon: "📖", badgeNameFa: "پایان ماندگار", climaxEn: "The album holds twenty wonderful family photos filled with laughter.", climaxFa: "آلبوم پر از عکس‌های خندان و خاطرات گرم خانوادگی شد.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "Family Dinner Smiles", titleFa: "لبخندهای شام خانوادگی", badgeCategory: "explorer", badgeIcon: "🍽️", badgeNameFa: "پایان صمیمی", climaxEn: "Everyone at dinner looks at the photo and shares happy stories.", climaxFa: "همه سر میز شام عکس را دیدند و قصه‌های شیرین تعریف کردند.", xpReward: 160 },
  { pathCode: "ABABA", titleEn: "The Hall of Adventures", titleFa: "دیوار ماجراهای شیرین", badgeCategory: "funny", badgeIcon: "🖼️", badgeNameFa: "پایان پرشور", climaxEn: "A whole wall of frames shows Sam and Lucy's happiest moments.", climaxFa: "یک دیوار پر از قاب‌های قشنگ از بهترین لحظات سام و لوسی پر شد.", xpReward: 145 },
  { pathCode: "ABABB", titleEn: "The Official Photographer", titleFa: "عکاس کوچک خانواده", badgeCategory: "heroic", badgeIcon: "📸", badgeNameFa: "پایان افتخارآمیز", climaxEn: "Sam takes lovely pictures at every birthday and holiday celebration.", climaxFa: "سام در تمام جشن‌های تولد و تعطیلات عکس‌های دیدنی می‌گیرد.", xpReward: 190 },
  { pathCode: "ABBAA", titleEn: "The Class Storyteller", titleFa: "قصه‌گوی محبوب کلاس", badgeCategory: "heroic", badgeIcon: "📚", badgeNameFa: "پایان شیرین‌سخن", climaxEn: "All the students listen quietly and clap when Sam finishes the story.", climaxFa: "همه همکلاسی‌ها با دقت گوش دادند و در پایان برای سام دست زدند.", xpReward: 170 },
  { pathCode: "ABBAB", titleEn: "The Secret Tale Notebook", titleFa: "دفترچه قصه‌های رازآلود", badgeCategory: "legendary", badgeIcon: "📒", badgeNameFa: "پایان نویسنده کوچک", climaxEn: "Sam carries the notebook everywhere, writing new ideas every day.", climaxFa: "سام دفترچه را همه‌جا همراه دارد و هر روز فکرهای جالبش را می‌نویسد.", xpReward: 185 },
  { pathCode: "ABBBA", titleEn: "The Growing Cherry Tree", titleFa: "درخت گیلاس سربلند", badgeCategory: "scholar", badgeIcon: "🍒", badgeNameFa: "پایان سرسبز", climaxEn: "The cherry tree grows taller each year, bearing sweet red fruit.", climaxFa: "درخت گیلاس هر سال بلندتر می‌شود و گیلاس‌های شیرین و آبدار می‌دهد.", xpReward: 175 },
  { pathCode: "ABBBB", titleEn: "The Bird Swing", titleFa: "تاب کوچک پرنده‌ها", badgeCategory: "explorer", badgeIcon: "🎪", badgeNameFa: "پایان شادمانه", climaxEn: "Singing birds swing on the branch and chirp from sunrise to sunset.", climaxFa: "پرنده‌ها روی شاخه درخت تاب می‌خورند و از صبح تا غروب آواز می‌خوانند.", xpReward: 165 },
  { pathCode: "BAAAA", titleEn: "The Garden Salad Feast", titleFa: "جشن سالاد تازه باغچه", badgeCategory: "legendary", badgeIcon: "🥗", badgeNameFa: "پایان خوشمزه", climaxEn: "The fresh mint and tomatoes make the lunch table smell delightful.", climaxFa: "نعناع و گوجه‌های تازه باغچه میز ناهار را پر از عطر دلپذیر کردند.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Generous Neighbors", titleFa: "همسایه‌های مهربان", badgeCategory: "secret", badgeIcon: "🧺", badgeNameFa: "پایان سخاوتمند", climaxEn: "Neighbors bring fresh bread in return for baskets of ripe tomatoes.", climaxFa: "همسایه‌ها در جواب سبد گوجه‌های تازه، نان گرم و تازه هدیه آوردند.", xpReward: 170 },
  { pathCode: "BAABA", titleEn: "The Rooftop Nature Tour", titleFa: "گردش علمی در بام سبز", badgeCategory: "heroic", badgeIcon: "🌿", badgeNameFa: "پایان کاوشگر", climaxEn: "School friends love visiting the attic jungle to learn about plant care.", climaxFa: "دوستان مدرسه عاشق دیدن باغچه زیرشیروانی برای یادگیری نگهداری گیاهان شدند.", xpReward: 185 },
  { pathCode: "BAABB", titleEn: "The Glowing Green Room", titleFa: "اتاق نورانی گیاهان", badgeCategory: "explorer", badgeIcon: "💡", badgeNameFa: "پایان درخشان", climaxEn: "Fairy lights make the green leaves sparkle like stars in the evening.", climaxFa: "ریسه چراغ‌ها برگ‌های سبز را هنگام غروب مثل ستاره‌ها درخشان کرد.", xpReward: 165 },
  { pathCode: "BABAA", titleEn: "The Bird Village", titleFa: "دهکده پرندگان", badgeCategory: "legendary", badgeIcon: "🏡", badgeNameFa: "پایان پرندگان مهربان", climaxEn: "Three colorful birdhouses sit in the trees, welcoming wild birds.", climaxFa: "سه لانه رنگارنگ روی درخت‌ها نصب شد و پرندگان مهربان در آن‌ها ساکن شدند.", xpReward: 190 },
  { pathCode: "BABAB", titleEn: "The Morning Bird Guests", titleFa: "مهمان‌های صبحگاهی پرنده", badgeCategory: "scholar", badgeIcon: "💧", badgeNameFa: "پایان مهربان", climaxEn: "Every morning, birds drink fresh water from the clean window tray.", climaxFa: "هر روز صبح پرندگان از سینی تمیز پنجره آب خنک می‌نوشند.", xpReward: 160 },
  { pathCode: "BABBA", titleEn: "Grandma's Best Present", titleFa: "بهترین هدیه مادربزرگ", badgeCategory: "heroic", badgeIcon: "🎁", badgeNameFa: "پایان صمیمی", climaxEn: "Grandma keeps Sam's bird drawing right by her favorite armchair.", climaxFa: "مادربزرگ نقاشی پرنده سام را کنار مبل راحتی همیشگی‌اش گذاشت.", xpReward: 180 },
  { pathCode: "BABBB", titleEn: "The Bird Sketchbook", titleFa: "دفترچه نقاشی طبیعت", badgeCategory: "scholar", badgeIcon: "📒", badgeNameFa: "پایان هنرمند کوشا", climaxEn: "Sam's scrapbook is full of colorful sketches of garden creatures.", climaxFa: "دفترچه سام پر از نقاشی‌های رنگارنگ از پرندگان و جانوران باغچه شد.", xpReward: 175 },
  { pathCode: "BBAAA", titleEn: "The Story in the Hallway", titleFa: "قصه راهروی خانه", badgeCategory: "legendary", badgeIcon: "🗝️", badgeNameFa: "پایان اسرارآمیز", climaxEn: "Every visitor listens eagerly as Sam explains the golden bird key.", climaxFa: "هر مهمانی که می‌آید با شوق به ماجرای کلید پرنده‌ای گوش می‌دهد.", xpReward: 195 },
  { pathCode: "BBAAB", titleEn: "The Spring Painting Series", titleFa: "مجموعه نقاشی‌های بهار", badgeCategory: "scholar", badgeIcon: "🖌️", badgeNameFa: "پایان خلاقانه", climaxEn: "Sam and Lucy paint new pictures of blooming flowers every weekend.", climaxFa: "سام و لوسی هر آخر هفته نقاشی‌های تازه‌ای از گل‌های بهاری می‌کشند.", xpReward: 165 },
  { pathCode: "BBABA", titleEn: "The Cousins Reunion", titleFa: "دورهمی بچه‌های فامیل", badgeCategory: "heroic", badgeIcon: "🎈", badgeNameFa: "پایان جشن فامیلی", climaxEn: "The cousins arrive on Saturday to explore the attic together.", climaxFa: "بچه‌های فامیل شنبه آمدند تا با هم اتاق زیرشیروانی را کشف کنند.", xpReward: 185 },
  { pathCode: "BBABB", titleEn: "Holiday Art Postcards", titleFa: "کارت‌پستال‌های عید", badgeCategory: "legendary", badgeIcon: "💌", badgeNameFa: "پایان پیوند و دوستی", climaxEn: "All the relatives receive warm handmade cards drawn with care.", climaxFa: "تمام اقوام کارت‌پستال‌های دست‌ساز و پر از محبت بچه‌ها را دریافت کردند.", xpReward: 200 },
  { pathCode: "BBBAA", titleEn: "Warm Pie and Ice Cream", titleFa: "پای گرم با بستنی", badgeCategory: "legendary", badgeIcon: "🥧", badgeNameFa: "پایان دلپذیر", climaxEn: "Eating warm apple pie with cool ice cream is the best treat ever.", climaxFa: "خوردن پای گرم سیب با بستنی خنک بهترین عصرانه دنیا شد.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "A Sweet Gift for Mr. Brown", titleFa: "هدیه شیرین برای آقای براون", badgeCategory: "scholar", badgeIcon: "🥐", badgeNameFa: "پایان همسایه مهربان", climaxEn: "Mr. Brown is delighted and gives Sam and Lucy fresh warm pretzels.", climaxFa: "آقای براون خوشحال شد و به سام و لوسی نان‌های نمکی تازه تعارف کرد.", xpReward: 175 },
  { pathCode: "BBBBA", titleEn: "The Golden Desk Keepsake", titleFa: "یادگاری روی میز تحریر", badgeCategory: "secret", badgeIcon: "⭐", badgeNameFa: "پایان امیدبخش", climaxEn: "The golden bird key shines on Sam's desk, inspiring good dreams.", climaxFa: "کلید پرنده طلایی روی میز سام می‌درخشد و به او امید و انگیزه می‌دهد.", xpReward: 170 },
  { pathCode: "BBBBB", titleEn: "The Best Sunday Feast", titleFa: "شادترین یکشنبه خانوادگی", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Surrounded by love, delicious pie, and family laughter, Sunday is magical.", climaxFa: "در جمع گرم خانواده با خنده‌های شاد و پای خوشمزه، یکشنبه رویایی شد.", xpReward: 200 },
];

export const story2GoldenKey: AdventureStory = buildAdventureStory({
  id: "a1-golden-key",
  storyIndex: 2,
  cefr: "A1",
  titleEn: "The Golden Key in the Attic",
  titleFa: "کلید طلایی در اتاق زیرشیروانی",
  genre: "mystery",
  genreLabelFa: "🗝️ معمایی و کنجکاوی",
  genreIcon: "🗝️",
  synopsisEn:
    "Sam explores Grandma Mary's sunny attic and discovers a golden key shaped like a bird. Open the wooden box or explore behind the green curtain across 32 cozy endings!",
  synopsisFa:
    "سام به اتاق زیرشیروانی مادربزرگ مری می‌رود و یک کلید طلایی شبیه پرنده پیدا می‌کند. آیا جعبه چوبی را باز می‌کنی یا پشت پرده سبز را می‌گردی؟ ۳۲ پایان شیرین و کودکانه در انتظار توست!",
  coverImage: "/images/skills/reading/golden-key.webp",
  nodes,
  endings,
});
