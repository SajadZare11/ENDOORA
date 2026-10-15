import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4: The Tiny Clockwork Robot (روبات کوچولوی اسباب‌بازی‌فروشی)
// Style: Family and Friends Readers (CEFR A1)
// Grammar: Present Simple, Present Continuous, To Be, was/were, Regular Past (-ed) only!
// Common English Names: Max, Mr. White, Bolt, Barnaby
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "This is a cozy toy shop. The shop owner is Mr. White. Mr. White is a kind old man. On a high wooden shelf sits a tiny robot named Bolt. Bolt has two round eyes. His eyes glow bright blue: beep-boop! Next to the shelf is a little boy named Max. Max loves toys. Bolt points his small metal hand at the wide window. Bright stars are in the dark sky.",
    keywords: [
      { word: "shop", meaningFa: "مغازه اسباب‌بازی", phonetic: "/ʃɒp/" },
      { word: "robot", meaningFa: "ربات کوچولو", phonetic: "/ˈrəʊbɒt/" },
      { word: "shelf", meaningFa: "قفسه چوبی", phonetic: "/ʃelf/" },
      { word: "glow", meaningFa: "درخشیدن و نور دادن", phonetic: "/ɡləʊ/" },
    ],
    question: {
      promptEn: "What color do Bolt's eyes glow?",
      promptFa: "چشم‌های بولت چه رنگی می‌درخشند؟",
      options: ["Bright blue", "Dark green", "Deep red"],
      correctIndex: 0,
      hintSnippet: "His eyes glow bright blue: beep-boop!",
      clueFa: "خط چهارم را بخوان دوست من! چشم‌هایش آبی درخشان است.",
    },
    choiceA: {
      labelEn: "Help Bolt climb down the wooden shelf!",
      labelFa: "به بولت کمک کن از قفسه چوبی پایین بیاید!",
      descriptionFa: "روی زمین یک خرس عروسکی نرم و پشمالو نشسته است.",
    },
    choiceB: {
      labelEn: "Wind up the toy plane next to Bolt!",
      labelFa: "کوک هواپیمای اسباب‌بازی کنار بولت را بچرخان!",
      descriptionFa: "هواپیما یک پروانه کوچک چوبی دارد که می‌چرخد.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Max helps Bolt climb down the shelf. Bolt hops down and lands softly on a big teddy bear named Barnaby. Barnaby is brown and very fluffy. Bolt beeps with joy: beep-beep! Next to Barnaby is a shiny toy drum with two yellow sticks.",
    keywords: [
      { word: "climb", meaningFa: "پایین آمدن / بالا رفتن", phonetic: "/klaɪm/" },
      { word: "teddy bear", meaningFa: "خرس عروسکی", phonetic: "/ˈtedi beər/" },
      { word: "drum", meaningFa: "طبل اسباب‌بازی", phonetic: "/drʌm/" },
    ],
    question: {
      promptEn: "What color is the big teddy bear?",
      promptFa: "خرس عروسکی بزرگ چه رنگی است؟",
      options: ["Brown", "Pink", "Black"],
      correctIndex: 0,
      hintSnippet: "Barnaby is brown and very fluffy.",
      clueFa: "خط دوم را بخوان! خرس عروسکی قهوه‌ای است.",
    },
    choiceA: {
      labelEn: "Tap the shiny toy drum with Bolt!",
      labelFa: "با بولت روی طبل اسباب‌بازی ضرب بزنید!",
      descriptionFa: "صدای شاد طبل مثل آهنگ در اتاق پخش می‌شود.",
    },
    choiceB: {
      labelEn: "Build a tall tower with wooden blocks!",
      labelFa: "با مکعب‌های چوبی یک برج بلند بسازید!",
      descriptionFa: "مکعب‌های قرمز و آبی زیادی روی فرش است.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Max turns the silver key on the toy plane. The little wooden propeller spins: whirr-whirr! Bolt sits safely inside the plane seat. The plane glides across the room and lands on the big table. Mr. White's star map is on the table.",
    keywords: [
      { word: "key", meaningFa: "کوک چرخان اسباب‌بازی", phonetic: "/kiː/" },
      { word: "propeller", meaningFa: "پروانه هواپیما", phonetic: "/prəˈpelər/" },
      { word: "glides", meaningFa: "آرام در هوا پرواز می‌کند", phonetic: "/ɡlaɪdz/" },
    ],
    question: {
      promptEn: "What spins on the toy plane?",
      promptFa: "روی هواپیمای اسباب‌بازی چه چیزی می‌چرخد؟",
      options: ["The little wooden propeller", "A big red wheel", "A round clock"],
      correctIndex: 0,
      hintSnippet: "The little wooden propeller spins",
      clueFa: "خط دوم را ببین دوست من! پروانه کوچک چوبی می‌چرخد.",
    },
    choiceA: {
      labelEn: "Guide the plane to the window sill!",
      labelFa: "هواپیما را به سمت طاقچه پنجره هدایت کن!",
      descriptionFa: "از آنجا ستاره‌های واقعی در آسمان دیده می‌شوند.",
    },
    choiceB: {
      labelEn: "Look at the colorful star map on the table!",
      labelFa: "نقشه ستاره‌های رنگارنگ روی میز را نگاه کن!",
      descriptionFa: "روی نقشه شکل یک خرس کوچک و یک کشتی کشیده شده است.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Bolt taps the shiny drum with the wooden sticks: tap-tap-tap! A music box on the counter begins to play a sweet song. Mr. White walks in and claps his hands. 'What a happy band!' he says with a wide smile.",
    keywords: [
      { word: "counter", meaningFa: "پیشخوان مغازه", phonetic: "/ˈkaʊntər/" },
      { word: "band", meaningFa: "گروه موسیقی شاد", phonetic: "/bænd/" },
      { word: "taps", meaningFa: "ضربه می‌زند", phonetic: "/tæps/" },
    ],
    question: {
      promptEn: "What begins to play a sweet song?",
      promptFa: "چه چیزی شروع به پخش آهنگ شیرین می‌کند؟",
      options: ["A music box on the counter", "A loud television", "A noisy bell"],
      correctIndex: 0,
      hintSnippet: "A music box on the counter begins to play a sweet song.",
      clueFa: "خط دوم را بخوان! جعبه موسیقی روی پیشخوان شروع به نواختن می‌کند.",
    },
    choiceA: {
      labelEn: "Dance around the carpet with Max and Bolt!",
      labelFa: "با مکس و بولت دور فرش شادی و رقص کنید!",
      descriptionFa: "خرس عروسکی بارنابی هم با ریتم سر تکان می‌دهد.",
    },
    choiceB: {
      labelEn: "Play the silver triangle chime!",
      labelFa: "ساز مثلثی نقره‌ای را به صدا درآور!",
      descriptionFa: "صدای دینگ‌دینگ شفاف آن به موسیقی اضافه می‌شود.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Max and Bolt stack the wooden blocks together. They stack one, two, three, four red and blue blocks! The tower is very tall. Bolt places a bright yellow star block on top. 'Beep-hurrah!' chirps Bolt.",
    keywords: [
      { word: "stack", meaningFa: "روی هم چیدن", phonetic: "/stæk/" },
      { word: "tower", meaningFa: "برج بلند", phonetic: "/ˈtaʊər/" },
      { word: "blocks", meaningFa: "مکعب‌های اسباب‌بازی", phonetic: "/blɒks/" },
    ],
    question: {
      promptEn: "What color is the star block on top?",
      promptFa: "مکعب ستاره‌ای بالای برج چه رنگی است؟",
      options: ["Bright yellow", "Dark purple", "Deep gray"],
      correctIndex: 0,
      hintSnippet: "Bolt places a bright yellow star block on top.",
      clueFa: "خط سوم را ببین! یک مکعب ستاره‌ای زرد درخشان است.",
    },
    choiceA: {
      labelEn: "Add a wooden bridge between the towers!",
      labelFa: "یک پل چوبی بین برج‌ها اضافه کن!",
      descriptionFa: "ماشین‌های اسباب‌بازی می‌توانند از روی پل عبور کنند.",
    },
    choiceB: {
      labelEn: "Take a photo of the tall block tower!",
      labelFa: "از برج بلند مکعبی عکس یادگاری بگیر!",
      descriptionFa: "این بلندترین برجی است که تا حالا ساخته‌اید.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The toy plane rests on the wide window sill. Max and Bolt look outside through the clean glass. The dark night sky is full of stars. They spot the big silver moon. Bolt blinks his blue eyes happily.",
    keywords: [
      { word: "sill", meaningFa: "طاقچه پنجره", phonetic: "/sɪl/" },
      { word: "glass", meaningFa: "شیشه پنجره", phonetic: "/ɡlɑːs/" },
      { word: "blinks", meaningFa: "پلک می‌زند / چشمک می‌زند", phonetic: "/blɪŋks/" },
    ],
    question: {
      promptEn: "What do Max and Bolt spot outside?",
      promptFa: "مکس و بولت بیرون چه چیزی را می‌بینند؟",
      options: ["The big silver moon", "A flying kite", "A red bicycle"],
      correctIndex: 0,
      hintSnippet: "They spot the big silver moon.",
      clueFa: "خط سوم را نگاه کن! ماه نقره‌ای بزرگ را می‌بینند.",
    },
    choiceA: {
      labelEn: "Draw the moon and stars on white paper!",
      labelFa: "ماه و ستاره‌ها را روی کاغذ سفید نقاشی کن!",
      descriptionFa: "رنگ آبی و زرد نقاشی را بسیار قشنگ می‌کند.",
    },
    choiceB: {
      labelEn: "Flash Bolt's blue lights at the night sky!",
      labelFa: "نور آبی بولت را به سمت آسمان شب روشن و خاموش کن!",
      descriptionFa: "انگار بولت دارد به ستاره‌ها سلام می‌کند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Max unrolls the colorful star map on the wooden table. The map shows constellations of a little bear and a wooden sailing ship. Bolt points his finger at the ship constellation. 'Beep-boop!'",
    keywords: [
      { word: "unrolls", meaningFa: "باز و پهن می‌کند", phonetic: "/ʌnˈrəʊlz/" },
      { word: "constellations", meaningFa: "صورت‌های فلکی ستاره‌ها", phonetic: "/ˌkɒnstəˈleɪʃnz/" },
      { word: "sailing ship", meaningFa: "کشتی بادبانی", phonetic: "/ˈseɪlɪŋ ʃɪp/" },
    ],
    question: {
      promptEn: "What constellation does Bolt point at?",
      promptFa: "بولت به کدام صورت فلکی اشاره می‌کند؟",
      options: ["The sailing ship", "A swimming frog", "A red wagon"],
      correctIndex: 0,
      hintSnippet: "Bolt points his finger at the ship constellation.",
      clueFa: "خط سوم را بخوان دوست من! به صورت فلکی کشتی بادبانی اشاره می‌کند.",
    },
    choiceA: {
      labelEn: "Trace the star lines with a glowing crayon!",
      labelFa: "خط‌های ستاره‌ها را با مداد شمعی درخشان پررنگ کن!",
      descriptionFa: "نقشه در تاریکی اتاق مثل ستاره واقعی می‌درخشد.",
    },
    choiceB: {
      labelEn: "Show the star map to Mr. White!",
      labelFa: "نقشه ستاره‌ها را به آقای وایت نشان بده!",
      descriptionFa: "آقای وایت عاشق قصه‌های دریانوردان قدیمی است.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Max, Bolt, and Barnaby dance across the colorful carpet. Bolt spins on his little metal feet: whirr! The shop bells tinkle softly with the music. Mr. White brings warm milk and honey cookies.",
    keywords: [
      { word: "spins", meaningFa: "می‌چرخد", phonetic: "/spɪnz/" },
      { word: "tinkle", meaningFa: "جیرینگ‌جیرینگ صدا کردن", phonetic: "/ˈtɪŋkl/" },
      { word: "honey", meaningFa: "عسل شیرین", phonetic: "/ˈhʌni/" },
    ],
    question: {
      promptEn: "What does Mr. White bring for them?",
      promptFa: "آقای وایت برای آن‌ها چه می‌آورد؟",
      options: ["Warm milk and honey cookies", "Cold soup", "Sour lemons"],
      correctIndex: 0,
      hintSnippet: "warm milk and honey cookies",
      clueFa: "خط آخر را ببین! شیر گرم و کلوچه‌های عسلی می‌آورد.",
    },
    choiceA: {
      labelEn: "Share a honey cookie with Mr. White!",
      labelFa: "یک کلوچه عسلی به آقای وایت تعارف کن!",
      descriptionFa: "دور هم کلوچه خوردن خیلی دلپذیر است.",
    },
    choiceB: {
      labelEn: "Teach Bolt how to bow after the dance!",
      labelFa: "به بولت یاد بده بعد از رقص تعظیم کند!",
      descriptionFa: "بولت مثل یک ربات باادب تعظیم می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Max taps the silver triangle chime: ting-ting! The clear sound rings across the toy shop. The wooden toy soldiers stand straight and salute. Bolt beeps in rhythm.",
    keywords: [
      { word: "chime", meaningFa: "ساز زنگوله‌ای / مثلث", phonetic: "/tʃaɪm/" },
      { word: "soldiers", meaningFa: "سربازهای چوبی اسباب‌بازی", phonetic: "/ˈsəʊldʒəz/" },
      { word: "salute", meaningFa: "سلام نظامی دادن", phonetic: "/səˈluːt/" },
    ],
    question: {
      promptEn: "What do the wooden toy soldiers do?",
      promptFa: "سربازهای چوبی چه کار می‌کنند؟",
      options: ["Stand straight and salute", "Fall on the floor", "Run outside"],
      correctIndex: 0,
      hintSnippet: "stand straight and salute",
      clueFa: "خط سوم را بخوان! صاف می‌ایستند و ادای احترام می‌کنند.",
    },
    choiceA: {
      labelEn: "Lead the toy soldiers in a playful march!",
      labelFa: "سربازهای اسباب‌بازی را در یک رژه شاد هدایت کن!",
      descriptionFa: "سربازها در یک خط منظم پشت سر بولت راه می‌روند.",
    },
    choiceB: {
      labelEn: "Place the silver triangle carefully on the shelf!",
      labelFa: "ساز نقره‌ای را با دقت روی قفسه بگذار!",
      descriptionFa: "قفسه‌ها همیشه باید مرتب و تمیز باشند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Max and Bolt connect a wooden bridge between two block towers. A tiny green toy car drives across the bridge smoothly. Bolt claps his metal hands.",
    keywords: [
      { word: "bridge", meaningFa: "پل چوبی", phonetic: "/brɪdʒ/" },
      { word: "car", meaningFa: "ماشین اسباب‌بازی", phonetic: "/kɑːr/" },
      { word: "smoothly", meaningFa: "روان و بی‌صدا", phonetic: "/ˈsmuːðli/" },
    ],
    question: {
      promptEn: "What color is the toy car?",
      promptFa: "ماشین اسباب‌بازی چه رنگی است؟",
      options: ["Green", "Yellow", "Purple"],
      correctIndex: 0,
      hintSnippet: "A tiny green toy car drives across the bridge",
      clueFa: "خط دوم را ببین دوست من! یک ماشین سبز کوچک است.",
    },
    choiceA: {
      labelEn: "Build a whole toy city on the carpet!",
      labelFa: "یک شهر کامل اسباب‌بازی روی فرش بسازید!",
      descriptionFa: "با خانه‌ها، خیابان‌ها و درخت‌های چوبی کوچک.",
    },
    choiceB: {
      labelEn: "Park the green car inside a block garage!",
      labelFa: "ماشین سبز را در پارکینگ مکعبی پارک کن!",
      descriptionFa: "ماشین برای بازی فردا آماده می‌ماند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Max snaps a photo of the tall block tower using Mr. White's instant camera. Click! The photo slides out showing Bolt smiling beside the yellow star block.",
    keywords: [
      { word: "photo", meaningFa: "عکس چاپ فوری", phonetic: "/ˈfəʊtəʊ/" },
      { word: "instant", meaningFa: "فوری و سریع", phonetic: "/ˈɪnstənt/" },
      { word: "slides", meaningFa: "بیرون می‌آید", phonetic: "/slaɪdz/" },
    ],
    question: {
      promptEn: "What does the photo show?",
      promptFa: "عکس چه چیزی را نشان می‌دهد؟",
      options: ["Bolt smiling beside the star block", "An empty shelf", "A rainy street"],
      correctIndex: 0,
      hintSnippet: "showing Bolt smiling beside the yellow star block",
      clueFa: "خط آخر را بخوان! بولت را در حال لبخند کنار ستاره زرد نشان می‌دهد.",
    },
    choiceA: {
      labelEn: "Pin the photo on the shop window board!",
      labelFa: "عکس را به تابلوی پنجره مغازه بچسبان!",
      descriptionFa: "همه بچه‌های محله برج قشنگ شما را می‌بینند.",
    },
    choiceB: {
      labelEn: "Give the photo to Max's mother as a gift!",
      labelFa: "عکس را به عنوان هدیه به مادر مکس بده!",
      descriptionFa: "مادر با دیدن هنر پسرش لبخند می‌زند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Max draws the silver moon and five yellow stars on white paper. Bolt dips his finger in blue paint and adds little blue dots. The artwork looks magical.",
    keywords: [
      { word: "paint", meaningFa: "رنگ نقاشی", phonetic: "/peɪnt/" },
      { word: "dots", meaningFa: "نقطه‌های کوچک", phonetic: "/dɒts/" },
      { word: "magical", meaningFa: "جادویی و رویایی", phonetic: "/ˈmædʒɪkl/" },
    ],
    question: {
      promptEn: "How many yellow stars does Max draw?",
      promptFa: "مکس چند ستاره زرد نقاشی می‌کند؟",
      options: ["Five yellow stars", "One star", "Fifty stars"],
      correctIndex: 0,
      hintSnippet: "five yellow stars on white paper",
      clueFa: "خط اول را ببین! پنج ستاره زرد نقاشی می‌کند.",
    },
    choiceA: {
      labelEn: "Hang the starry picture near the window!",
      labelFa: "نقاشی ستاره‌ای را کنار پنجره آویزان کن!",
      descriptionFa: "نور ماه به نقاشی می‌تابد و آن را روشن می‌کند.",
    },
    choiceB: {
      labelEn: "Sign the bottom of the painting: 'Max & Bolt'!",
      labelFa: "پایین نقاشی را امضا کنید: 'مکس و بولت'!",
      descriptionFa: "یک اثر هنری مشترک از دو دوست صمیمی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Bolt flashes his blue glowing eyes at the dark window: blink, blink, blink! Outside, a firefly taps gently on the glass as if saying hello. Max claps his hands with joy.",
    keywords: [
      { word: "firefly", meaningFa: "کرم شب‌تاب", phonetic: "/ˈfaɪəflaɪ/" },
      { word: "taps", meaningFa: "آرام به شیشه می‌زند", phonetic: "/tæps/" },
      { word: "flashes", meaningFa: "چشمک می‌زند / نور می‌اندازد", phonetic: "/ˈflæʃɪz/" },
    ],
    question: {
      promptEn: "What taps gently on the outside glass?",
      promptFa: "چه چیزی از پشت شیشه آرام ضربه می‌زند؟",
      options: ["A firefly", "A big bird", "A wet fish"],
      correctIndex: 0,
      hintSnippet: "a firefly taps gently on the glass",
      clueFa: "خط دوم را بخوان! یک کرم شب‌تاب روی شیشه ضربه می‌زند.",
    },
    choiceA: {
      labelEn: "Draw a friendly firefly in your art book!",
      labelFa: "یک کرم شب‌تاب مهربان در دفترت نقاشی کن!",
      descriptionFa: "کرم شب‌تاب با نور سبزش مثل یک ستاره کوچک است.",
    },
    choiceB: {
      labelEn: "Open the window latch slightly for cool night breeze!",
      labelFa: "پنجره را کمی باز کن تا نسیم خنک شب بیاید!",
      descriptionFa: "بوی گل‌های باغچه به داخل مغازه می‌آید.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Bolt traces the glowing crayon across the star map. The lines glow soft green in the dim light. Max reads the letters aloud: 'S-H-I-P! A starry ship!'",
    keywords: [
      { word: "glowing", meaningFa: "درخشان و شب‌تاب", phonetic: "/ˈɡləʊɪŋ/" },
      { word: "dim", meaningFa: "کم‌نور و ملایم", phonetic: "/dɪm/" },
      { word: "letters", meaningFa: "حروف الفبا", phonetic: "/ˈletəz/" },
    ],
    question: {
      promptEn: "What word does Max read aloud?",
      promptFa: "مکس با صدای بلند چه کلمه‌ای را می‌خواند؟",
      options: ["'SHIP'", "'CAT'", "'SUN'"],
      correctIndex: 0,
      hintSnippet: "Max reads the letters aloud: 'S-H-I-P!'",
      clueFa: "خط آخر را ببین دوست من! کلمه SHIP (کشتی) را می‌خواند.",
    },
    choiceA: {
      labelEn: "Fold a paper boat and place it on the map!",
      labelFa: "یک قایق کاغذی تا کن و روی نقشه بگذار!",
      descriptionFa: "قایق کاغذی روی دریای ستاره‌ها سفر می‌کند.",
    },
    choiceB: {
      labelEn: "Learn the names of five constellations!",
      labelFa: "نام پنج صورت فلکی را یاد بگیر!",
      descriptionFa: "ستاره‌شناسی یک تفریح بسیار آموزنده است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Mr. White smiles at the star map. 'My grandfather was a sailor,' he tells Max and Bolt. He points to a shiny brass compass on his desk and explains how it points North.",
    keywords: [
      { word: "sailor", meaningFa: "دریانورد و ملوان", phonetic: "/ˈseɪlər/" },
      { word: "compass", meaningFa: "قطب‌نما", phonetic: "/ˈkʌmpəs/" },
      { word: "North", meaningFa: "جهت شمال", phonetic: "/nɔːθ/" },
    ],
    question: {
      promptEn: "What shiny object is on Mr. White's desk?",
      promptFa: "چه شیء براقی روی میز آقای وایت است؟",
      options: ["A shiny brass compass", "An old hammer", "A tennis ball"],
      correctIndex: 0,
      hintSnippet: "a shiny brass compass on his desk",
      clueFa: "خط دوم را بخوان! یک قطب‌نمای برنجی براق است.",
    },
    choiceA: {
      labelEn: "Hold the compass and find the North Star!",
      labelFa: "قطب‌نما را در دست بگیر و ستاره قطبی را پیدا کن!",
      descriptionFa: "عقربه قطب‌نما آرام به سمت شمال می‌چرخد.",
    },
    choiceB: {
      labelEn: "Ask Mr. White for a sailor bedtime story!",
      labelFa: "از آقای وایت بخواه قصه دریانوردی تعریف کند!",
      descriptionFa: "قصه‌های ملوانان پر از ماجراهای شگفت‌انگیز است.",
    },
  },

  // STEP 5 (16 nodes)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Mr. White eats the honey cookie with warm tea. 'You are kind boys,' he whispers. Bolt beeps happily as his little wind-up dial rests.",
    keywords: [{ word: "whispers", meaningFa: "با صدای آرام و مهربان می‌گوید", phonetic: "/ˈwɪspəz/" }],
    question: {
      promptEn: "What does Mr. White drink with the cookie?",
      promptFa: "آقای وایت با کلوچه چه می‌نوشد؟",
      options: ["Warm tea", "Cold soda", "Salty water"],
      correctIndex: 0,
      hintSnippet: "with warm tea",
      clueFa: "با چای گرم می‌نوشد.",
    },
    choiceA: {
      labelEn: "Help Mr. White tidy the tea mugs!",
      labelFa: "به آقای وایت در جمع کردن فنجان‌ها کمک کن!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Tuck Bolt into a cozy soft bed!",
      labelFa: "بولت را در تخت نرم و راحتش بخوابان!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Bolt bows gracefully like a tiny prince. Max and Mr. White clap. Outside, the church clock chimes one. The night is peace and quiet.",
    keywords: [{ word: "gracefully", meaningFa: "با ادب و زیبایی", phonetic: "/ˈɡreɪsfəli/" }],
    question: {
      promptEn: "What clock chimes outside?",
      promptFa: "ساعت چه جایی در بیرون زنگ می‌زند؟",
      options: ["The church clock", "An alarm clock", "A wrist watch"],
      correctIndex: 0,
      hintSnippet: "the church clock chimes one",
      clueFa: "ساعت کلیسا یک بار زنگ می‌زند.",
    },
    choiceA: {
      labelEn: "Place Bolt proudly on the shop counter!",
      labelFa: "بولت را با افتخار روی پیشخوان مغازه بگذار!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Turn off the shop nightlight softly!",
      labelFa: "چراغ‌خواب مغازه را به آرامی خاموش کن!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The wooden soldiers march in a perfect circle around the carpet. Bolt marches in front, waving a tiny golden flag.",
    keywords: [{ word: "flag", meaningFa: "پرچم کوچک", phonetic: "/flæɡ/" }],
    question: {
      promptEn: "What does Bolt wave?",
      promptFa: "بولت چه چیزی را تکان می‌دهد؟",
      options: ["A tiny golden flag", "A broom", "A pencil"],
      correctIndex: 0,
      hintSnippet: "a tiny golden flag",
      clueFa: "یک پرچم کوچک طلایی را تکان می‌دهد.",
    },
    choiceA: {
      labelEn: "Salute the toy parade with Max!",
      labelFa: "با مکس به رژه اسباب‌بازی‌ها سلام نظامی بده!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Pack the toy soldiers neatly in their wooden box!",
      labelFa: "سربازها را در جعبه چوبی‌شان مرتب بچین!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Max puts the silver triangle on the high wooden shelf. The soft chimes echo gently through the quiet toy shop.",
    keywords: [{ word: "echo", meaningFa: "طنین انداختن صدا", phonetic: "/ˈekəʊ/" }],
    question: {
      promptEn: "Where does Max put the silver triangle?",
      promptFa: "مکس ساز مثلثی را کجا می‌گذارد؟",
      options: ["On the high wooden shelf", "In the trash", "Outside"],
      correctIndex: 0,
      hintSnippet: "on the high wooden shelf",
      clueFa: "روی قفسه چوبی بالا می‌گذارد.",
    },
    choiceA: {
      labelEn: "Read a bedtime fairy tale to Barnaby bear!",
      labelFa: "یک قصه شیرین شب برای خرس بارنابی بخوان!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Cover Bolt with a soft knitted cloth!",
      labelFa: "روی بولت یک دستمال بافتنی نرم بینداز!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Max and Bolt finish the toy city. It has twenty houses, three bridges, and a park with toy trees. Mr. White is amazed.",
    keywords: [{ word: "amazed", meaningFa: "شگفت‌زده و ذوق‌زده", phonetic: "/əˈmeɪzd/" }],
    question: {
      promptEn: "How many toy houses are in the city?",
      promptFa: "چند خانه اسباب‌بازی در این شهر است؟",
      options: ["Twenty houses", "Two houses", "No houses"],
      correctIndex: 0,
      hintSnippet: "twenty houses",
      clueFa: "بیست خانه اسباب‌بازی در شهر است.",
    },
    choiceA: {
      labelEn: "Display the toy city for all shop visitors tomorrow!",
      labelFa: "شهر را فردا برای همه مشتریان مغازه به نمایش بگذار!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Add tiny paper streetlights that glow in the dark!",
      labelFa: "چراغ‌های کاغذی شب‌تاب برای خیابان‌ها بساز!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The green car rests inside the block garage. Bolt closes the little wooden garage gate: click! The tiny city is peaceful.",
    keywords: [{ word: "gate", meaningFa: "دروازه پارکینگ", phonetic: "/ɡeɪt/" }],
    question: {
      promptEn: "What does Bolt close?",
      promptFa: "بولت چه چیزی را می‌بندد؟",
      options: ["The little wooden garage gate", "A big book", "A suitcase"],
      correctIndex: 0,
      hintSnippet: "the little wooden garage gate",
      clueFa: "دروازه کوچک چوبی پارکینگ را می‌بندد.",
    },
    choiceA: {
      labelEn: "Place a tiny 'Welcome' sign by the garage!",
      labelFa: "یک تابلوی کوچک 'خوش آمدید' کنار پارکینگ بگذار!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Blow out the tiny candle lantern!",
      labelFa: "فانوس کوچک شمعی را خاموش کن!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Mr. White pins the instant photo right on the front shop window. Next morning, children stop to look and smile.",
    keywords: [{ word: "front", meaningFa: "جلوی ویترین مغازه", phonetic: "/frʌnt/" }],
    question: {
      promptEn: "Where does Mr. White pin the photo?",
      promptFa: "آقای وایت عکس را کجا نصب می‌کند؟",
      options: ["On the front shop window", "Under the rug", "In his pocket"],
      correctIndex: 0,
      hintSnippet: "on the front shop window",
      clueFa: "روی ویترین جلوی مغازه نصب می‌کند.",
    },
    choiceA: {
      labelEn: "Invite neighborhood kids to build towers on Saturday!",
      labelFa: "بچه‌های محله را شنبه به مسابقه برج‌سازی دعوت کن!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Win the town trophy for the creative toy display!",
      labelFa: "جام خلاقانه‌ترین ویترین اسباب‌بازی شهر را ببر!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Max puts the photo into his backpack for his mother. Bolt beeps softly: 'Beep-cheer!' Everyone is happy and calm.",
    keywords: [{ word: "backpack", meaningFa: "کوله پشتی", phonetic: "/ˈbækpæk/" }],
    question: {
      promptEn: "Where does Max put the photo?",
      promptFa: "مکس عکس را کجا می‌گذارد؟",
      options: ["Into his backpack", "In the shoe", "In the drawer"],
      correctIndex: 0,
      hintSnippet: "into his backpack",
      clueFa: "در کوله پشتی‌اش می‌گذارد.",
    },
    choiceA: {
      labelEn: "Give mother a big hug at home!",
      labelFa: "در خانه مادرت را محکم بغل کن!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Keep the photo framed on your study desk!",
      labelFa: "عکس را در قابی روی میز مطالعه‌ات بگذار!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The starry painting hangs next to the window. Outside starlight touches the paper, making the yellow stars shine like real gold.",
    keywords: [{ word: "touches", meaningFa: "لمس می‌کند / می‌تابد", phonetic: "/ˈtʌtʃɪz/" }],
    question: {
      promptEn: "What touches the paper from outside?",
      promptFa: "چه چیزی از بیرون به کاغذ می‌تابد؟",
      options: ["Starlight", "Rain drops", "A dark shadow"],
      correctIndex: 0,
      hintSnippet: "starlight touches the paper",
      clueFa: "نور ستاره‌ها به کاغذ می‌تابد.",
    },
    choiceA: {
      labelEn: "Show the starry drawing to the toy shop customers!",
      labelFa: "نقاشی ستاره‌ها را به خریداران مغازه نشان بده!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Start an art club for young toy builders!",
      labelFa: "باشگاه نقاشی برای سازندگان کوچک اسباب‌بازی بساز!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Max writes 'Max & Bolt' in neat letters at the corner of the painting. Bolt presses his tiny round stamp beside the names.",
    keywords: [{ word: "stamp", meaningFa: "مهر کوچک رباتی", phonetic: "/stæmp/" }],
    question: {
      promptEn: "What does Bolt press beside the names?",
      promptFa: "بولت چه چیزی را کنار اسم‌ها می‌زند؟",
      options: ["His tiny round stamp", "A coin", "An apple"],
      correctIndex: 0,
      hintSnippet: "his tiny round stamp",
      clueFa: "مهر کوچک گرد خود را می‌زند.",
    },
    choiceA: {
      labelEn: "Frame the artwork with golden cardboard!",
      labelFa: "نقاشی را با مقوای طلایی قاب بگیر!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Make matching friendship postcards!",
      labelFa: "کارت‌پستال‌های دوستی دونفره درست کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Max draws the friendly firefly with light yellow chalk. Bolt blinks his eyes in green to match the firefly glow.",
    keywords: [{ word: "chalk", meaningFa: "گچ رنگی نقاشی", phonetic: "/tʃɔːk/" }],
    question: {
      promptEn: "What does Max use to draw the firefly?",
      promptFa: "مکس با چه چیزی کرم شب‌تاب را می‌کشد؟",
      options: ["Light yellow chalk", "Water", "A wooden stick"],
      correctIndex: 0,
      hintSnippet: "with light yellow chalk",
      clueFa: "با گچ زرد روشن نقاشی می‌کند.",
    },
    choiceA: {
      labelEn: "Feed flower nectar to garden bugs in spring!",
      labelFa: "در بهار به حشرات باغچه شهد گل بده!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Set up a bug hotel in the backyard!",
      labelFa: "یک لانه کوچک چوبی برای حشرات در حیاط بساز!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "A cool night breeze enters through the window, carrying the scent of night jasmine. Bolt's tiny gears click into sleep mode.",
    keywords: [{ word: "jasmine", meaningFa: "گل یاس خوشبو", phonetic: "/ˈdʒæzmɪn/" }],
    question: {
      promptEn: "What scent does the night breeze carry?",
      promptFa: "نسیم شب بوی چه گلی را می‌آورد؟",
      options: ["Night jasmine", "Salt water", "Hot pepper"],
      correctIndex: 0,
      hintSnippet: "the scent of night jasmine",
      clueFa: "عطر خوش گل یاس را می‌آورد.",
    },
    choiceA: {
      labelEn: "Close the window quietly and whisper goodnight!",
      labelFa: "پنجره را آرام ببند و شب‌به‌خیر بگو!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Place a fresh flower on Bolt's shelf!",
      labelFa: "یک شاخه گل یاس روی قفسه بولت بگذار!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The paper boat sails across the star map table. Bolt sits proudly at the bow as the ship captain. Max smiles warmly.",
    keywords: [{ word: "bow", meaningFa: "نوک کشتی", phonetic: "/baʊ/" }],
    question: {
      promptEn: "Where does Bolt sit proudly?",
      promptFa: "بولت با افتخار کجا می‌نشیند؟",
      options: ["At the bow of the paper boat", "On the floor", "Inside a box"],
      correctIndex: 0,
      hintSnippet: "at the bow as the ship captain",
      clueFa: "نوک قایق کاغذی می‌نشیند.",
    },
    choiceA: {
      labelEn: "Sail the paper boat in the bathroom basin tomorrow!",
      labelFa: "فردا قایق کاغذی را روی آب شناور کن!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Teach other kids how to fold paper boats!",
      labelFa: "به بچه‌های دیگر تا کردن قایق کاغذی یاد بده!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Max points out the Big Dipper and the Little Bear constellations. Bolt memorizes each one with a quiet series of beeps.",
    keywords: [{ word: "memorizes", meaningFa: "به حافظه می‌سپارد", phonetic: "/ˈmeməraɪzɪz/" }],
    question: {
      promptEn: "What constellations does Max point out?",
      promptFa: "مکس به کدام صورت‌های فلکی اشاره می‌کند؟",
      options: ["The Big Dipper and Little Bear", "The Dog and Cat", "The Fish and Bird"],
      correctIndex: 0,
      hintSnippet: "the Big Dipper and the Little Bear",
      clueFa: "به خرس بزرگ و خرس کوچک اشاره می‌کند.",
    },
    choiceA: {
      labelEn: "Write the English star names in your notebook!",
      labelFa: "اسم‌های انگلیسی ستاره‌ها را در دفترت بنویس!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Look through a real telescope at the astronomy club!",
      labelFa: "با تلسکوپ واقعی در باشگاه نجوم آسمان را ببین!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The brass compass needle points straight to the North Star. Mr. White shows Max how navigators find their way home in the dark.",
    keywords: [{ word: "needle", meaningFa: "عقربه قطب‌نما", phonetic: "/ˈniːdl/" }],
    question: {
      promptEn: "What does the compass needle point straight to?",
      promptFa: "عقربه قطب‌نما مستقیم به چه سمتی اشاره می‌کند؟",
      options: ["The North Star", "The ground", "The lamp"],
      correctIndex: 0,
      hintSnippet: "straight to the North Star",
      clueFa: "مستقیم به سمت ستاره قطبی اشاره می‌کند.",
    },
    choiceA: {
      labelEn: "Keep the pocket compass safely in your pocket!",
      labelFa: "قطب‌نمای جیبی را در جیبت نگه دار!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Draw a pirate treasure map with a compass rose!",
      labelFa: "یک نقشه گنج با علامت قطب‌نما بکش!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Mr. White finishes the gentle sea story. The fireplace crackles warmly. Bolt's blue eyes dim down, ready for sweet dreams.",
    keywords: [{ word: "crackles", meaningFa: "تلق‌تلوق آرام سوختن چوب", phonetic: "/ˈkræklz/" }],
    question: {
      promptEn: "What crackles warmly in the room?",
      promptFa: "چه چیزی با گرمی در اتاق صدا می‌دهد؟",
      options: ["The fireplace", "A radio", "A car"],
      correctIndex: 0,
      hintSnippet: "The fireplace crackles warmly.",
      clueFa: "شومینه به آرامی صدا می‌دهد و گرمابخش است.",
    },
    choiceA: {
      labelEn: "Say goodnight to Mr. White and Bolt!",
      labelFa: "به آقای وایت و بولت شب‌به‌خیر بگو!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Celebrate a magical night in the friendliest toy shop!",
      labelFa: "یک شب رویایی در دوست‌داشتنی‌ترین اسباب‌بازی‌فروشی را جشن بگیر!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Tidy Helpers", titleFa: "دستیاران تمیز و مرتب", badgeCategory: "legendary", badgeIcon: "🫖", badgeNameFa: "پایان تمیزی و نظم", climaxEn: "Mr. White smiles at the clean table and thanks Max with a toy badge.", climaxFa: "آقای وایت به میز تمیز نگاه کرد و با یک نشان اسباب‌بازی از مکس تشکر کرد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "Bolt's Cozy Soft Bed", titleFa: "تخت نرم و گرم بولت", badgeCategory: "heroic", badgeIcon: "🛏️", badgeNameFa: "پایان آرامش", climaxEn: "Bolt rests warmly in his soft box, dreaming of happy melodies.", climaxFa: "بولت در جعبه نرمش خوابید و خواب آهنگ‌های شاد را دید.", xpReward: 165 },
  { pathCode: "AAABA", titleEn: "The Counter Star", titleFa: "ستاره روی پیشخوان", badgeCategory: "funny", badgeIcon: "⭐", badgeNameFa: "پایان پرافتخار", climaxEn: "Bolt sits proudly on the counter, greeting morning shoppers with beeps.", climaxFa: "بولت روی پیشخوان نشست و صبح‌ها با بیپ‌بیپ به مشتریان سلام می‌گوید.", xpReward: 155 },
  { pathCode: "AAABB", titleEn: "Quiet Night at the Toy Shop", titleFa: "شب آرام در مغازه اسباب‌بازی", badgeCategory: "scholar", badgeIcon: "🌙", badgeNameFa: "پایان رویایی", climaxEn: "Soft starlight fills the shop as all the toys sleep peacefully.", climaxFa: "نور ملایم ستاره‌ها مغازه را پر کرد و تمام اسباب‌بازی‌ها آرام خوابیدند.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Toy Soldier Parade", titleFa: "رژه سربازهای چوبی", badgeCategory: "legendary", badgeIcon: "💂", badgeNameFa: "پایان باشکوه", climaxEn: "The parade of toy soldiers becomes a joyful morning memory.", climaxFa: "رژه سربازهای چوبی به خاطره‌ای شاد و به‌یادماندنی تبدیل شد.", xpReward: 200 },
  { pathCode: "AABAB", titleEn: "The Neatly Packed Box", titleFa: "جعبه مرتب سربازها", badgeCategory: "scholar", badgeIcon: "📦", badgeNameFa: "پایان باانضباط", climaxEn: "All the soldiers rest neatly in their wooden case ready for playtime.", climaxFa: "تمام سربازها در جعبه چوبی‌شان مرتب چیده شدند تا فردا بازی کنند.", xpReward: 180 },
  { pathCode: "AABBA", titleEn: "Barnaby's Bedtime Story", titleFa: "قصه شب خرس بارنابی", badgeCategory: "secret", badgeIcon: "🧸", badgeNameFa: "پایان مهربانی", climaxEn: "Barnaby the bear hugs Max's hand as the sweet fairy tale ends.", climaxFa: "خرس بارنابی دست مکس را در دست گرفت و قصه شیرین به پایان رسید.", xpReward: 185 },
  { pathCode: "AABBB", titleEn: "The Soft Knitted Blanket", titleFa: "پتوی بافتنی نرم", badgeCategory: "scholar", badgeIcon: "🧶", badgeNameFa: "پایان گرم و نرم", climaxEn: "Bolt stays cozy under the warm blanket all through the starry night.", climaxFa: "بولت زیر پتوی بافتنی گرم در تمام طول شب ستاره‌ای راحت خوابید.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Famous Toy City", titleFa: "شهر اسباب‌بازی مشهور", badgeCategory: "legendary", badgeIcon: "🏰", badgeNameFa: "پایان شاهکار", climaxEn: "Children crowd around the shop window to marvel at the wooden city.", climaxFa: "بچه‌ها دور ویترین مغازه جمع شدند تا از دیدن شهر چوبی لذت ببرند.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "The Glowing Streetlights", titleFa: "چراغ‌های شب‌تاب شهر", badgeCategory: "heroic", badgeIcon: "💡", badgeNameFa: "پایان درخشان", climaxEn: "Tiny paper lanterns glow in the dark, lighting up block roads.", climaxFa: "فانوس‌های کوچک کاغذی جاده‌های مکعبی شهر را در تاریکی روشن کردند.", xpReward: 170 },
  { pathCode: "ABABA", titleEn: "The Welcome Gate", titleFa: "دروازه خوش‌آمدگویی", badgeCategory: "legendary", badgeIcon: "🚪", badgeNameFa: "پایان دوستانه", climaxEn: "A tiny sign welcomes every toy to the peaceful garage.", climaxFa: "یک تابلوی کوچک ورود اسباب‌بازی‌ها به پارکینگ را تبریک می‌گوید.", xpReward: 200 },
  { pathCode: "ABABB", titleEn: "The Candlelight Glow", titleFa: "روشنایی شمع کوچک", badgeCategory: "scholar", badgeIcon: "🕯️", badgeNameFa: "پایان دل‌انگیز", climaxEn: "A gentle glow marks the end of a magical evening with toys.", climaxFa: "نور ملایم شمع پایانی زیبا برای یک شب جادویی با اسباب‌بازی‌ها رقم زد.", xpReward: 180 },
  { pathCode: "ABBAA", titleEn: "Saturday Building Club", titleFa: "باشگاه برج‌سازی شنبه‌ها", badgeCategory: "scholar", badgeIcon: "🧱", badgeNameFa: "پایان اجتماعی", climaxEn: "Ten neighborhood children arrive with blocks to build together.", climaxFa: "ده کودک از محله با مکعب‌هایشان آمدند تا دور هم برج بسازند.", xpReward: 190 },
  { pathCode: "ABBAB", titleEn: "The Best Window Trophy", titleFa: "جام بهترین ویترین شهر", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان برنده طلایی", climaxEn: "The town mayor awards Mr. White the golden cup for best window display.", climaxFa: "شهردار جام طلایی زیباترین ویترین شهر را به آقای وایت اهدا کرد.", xpReward: 200 },
  { pathCode: "ABBBA", titleEn: "Mother's Proud Smile", titleFa: "لبخند پر از افتخار مادر", badgeCategory: "heroic", badgeIcon: "❤️", badgeNameFa: "پایان خانوادگی", climaxEn: "Mother pins the photo on the fridge with a giant hug for Max.", climaxFa: "مادر عکس را به یخچال زد و مکس را محکم در آغوش کشید.", xpReward: 185 },
  { pathCode: "ABBBB", titleEn: "The Framed Desk Treasure", titleFa: "یادگاری روی میز تحریر", badgeCategory: "funny", badgeIcon: "🖼️", badgeNameFa: "پایان ماندگار", climaxEn: "The picture of Bolt inspires Max whenever he does his school homework.", climaxFa: "عکس بولت هر بار که مکس تکالیفش را می‌نویسد به او انگیزه می‌دهد.", xpReward: 160 },
  { pathCode: "BAAAA", titleEn: "The Starry Art Gallery", titleFa: "نمایشگاه نقاشی ستاره‌ها", badgeCategory: "legendary", badgeIcon: "🎨", badgeNameFa: "پایان هنری", climaxEn: "Shoppers admire the painting of moon and stars drawn with love.", climaxFa: "مشتریان نقاشی ماه و ستاره‌ها را با ذوق و تحسین تماشا کردند.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "Young Builders Art Club", titleFa: "باشگاه نقاشان اسباب‌بازی", badgeCategory: "heroic", badgeIcon: "🖌️", badgeNameFa: "پایان خلاقانه", climaxEn: "Kids gather every Friday to paint their favorite toys and animals.", climaxFa: "بچه‌ها هر جمعه جمع می‌شوند تا نقاشی اسباب‌بازی‌هایشان را بکشند.", xpReward: 190 },
  { pathCode: "BAABA", titleEn: "The Golden Cardboard Frame", titleFa: "قاب طلایی مقوایی", badgeCategory: "heroic", badgeIcon: "🖼️", badgeNameFa: "پایان تزیینی", climaxEn: "The painting shines brightly in its shiny golden border on the wall.", climaxFa: "نقاشی با حاشیه طلایی‌اش مثل یک اثر هنری زیبا روی دیوار می‌درخشد.", xpReward: 180 },
  { pathCode: "BAABB", titleEn: "Best Friends Forever Postcards", titleFa: "کارت‌پستال‌های بهترین دوستان", badgeCategory: "explorer", badgeIcon: "💌", badgeNameFa: "پایان صمیمی", climaxEn: "Max and Bolt's postcard reminds everyone that friendship is sweet.", climaxFa: "کارت‌پستال مکس و بولت یادآور شیرینی دوستی و مهربانی شد.", xpReward: 175 },
  { pathCode: "BABAA", titleEn: "Garden Flower Protectors", titleFa: "محافظان گل‌های باغچه", badgeCategory: "legendary", badgeIcon: "🌼", badgeNameFa: "پایان طبیعت‌دوست", climaxEn: "Honeybees and butterflies visit the blooming flowers all summer.", climaxFa: "زنبورها و پروانه‌ها تمام تابستان به دیدن گل‌های باغچه آمدند.", xpReward: 200 },
  { pathCode: "BABAB", titleEn: "The Backyard Bug House", titleFa: "هتل کوچک حشرات حیاط", badgeCategory: "scholar", badgeIcon: "🐞", badgeNameFa: "پایان علمی", climaxEn: "Tiny ladybugs find a safe warm home in the wooden bug hotel.", climaxFa: "کفشدوزک‌های کوچک خانه‌ای امن در هتل چوبی حیاط پیدا کردند.", xpReward: 185 },
  { pathCode: "BABBA", titleEn: "Sweet Jasmine Dreams", titleFa: "خواب آرام با عطر یاس", badgeCategory: "heroic", badgeIcon: "🌸", badgeNameFa: "پایان معطر", climaxEn: "The sweet scent of flowers brings gentle sleep to the whole house.", climaxFa: "بوی خوش گل‌های یاس خوابی آرام و شیرین به تمام خانه بخشید.", xpReward: 190 },
  { pathCode: "BABBB", titleEn: "A Blossom on Bolt's Shelf", titleFa: "یک شاخه گل روی قفسه بولت", badgeCategory: "scholar", badgeIcon: "🌿", badgeNameFa: "پایان زیبا", climaxEn: "A white jasmine flower rests beside Bolt, filling the shelf with scent.", climaxFa: "یک گل سفید یاس کنار بولت قرار گرفت و قفسه را معطر کرد.", xpReward: 180 },
  { pathCode: "BBAAA", titleEn: "The Basin Sailing Adventure", titleFa: "دریانوردی قایق کاغذی", badgeCategory: "legendary", badgeIcon: "⛵", badgeNameFa: "پایان شادمانه", climaxEn: "The paper boat sails on water without tipping over even once.", climaxFa: "قایق کاغذی بدون حتی یک بار واژگون شدن روی آب شناور ماند.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "Paper Boat Origami Masters", titleFa: "استادان اوریگامی قایق", badgeCategory: "heroic", badgeIcon: "📄", badgeNameFa: "پایان آموزنده", climaxEn: "Classmates learn to fold colorful boats from green and blue paper.", climaxFa: "همکلاسی‌ها یاد گرفتند چطور با کاغذهای رنگی قایق‌های قشنگ بسازند.", xpReward: 185 },
  { pathCode: "BBABA", titleEn: "The Starry English Notebook", titleFa: "دفترچه انگلیسی ستاره‌ها", badgeCategory: "funny", badgeIcon: "📓", badgeNameFa: "پایان یادگیری زبان", climaxEn: "Max writes words like Star, Moon, and Ship with perfect spelling.", climaxFa: "مکس کلماتی مثل ستاره، ماه و کشتی را با املای درست در دفترش نوشت.", xpReward: 165 },
  { pathCode: "BBABB", titleEn: "The Astronomy Club Discovery", titleFa: "کشف ستاره در باشگاه نجوم", badgeCategory: "heroic", badgeIcon: "🔭", badgeNameFa: "پایان علمی", climaxEn: "Looking through the big lens, Max sees the craters on the silver moon.", climaxFa: "مکس از پشت عدسی بزرگ تلسکوپ کوه‌های ماه نقره‌ای را تماشا کرد.", xpReward: 180 },
  { pathCode: "BBBAA", titleEn: "The Pocket Compass Explorer", titleFa: "کاوشگر با قطب‌نمای جیبی", badgeCategory: "legendary", badgeIcon: "🧭", badgeNameFa: "پایان ماجراجویانه", climaxEn: "With the compass in hand, Max always knows which way is North.", climaxFa: "با قطب‌نما در دست، مکس همیشه می‌داند جهت شمال کجاست.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Treasure Island Map", titleFa: "نقشه جزیره گنج", badgeCategory: "heroic", badgeIcon: "🗺️", badgeNameFa: "پایان خلاقیت", climaxEn: "Max draws a wonderful treasure map that wins an art prize at school.", climaxFa: "مکس نقشه گنج زیبایی کشید که برنده جایزه نقاشی مدرسه شد.", xpReward: 185 },
  { pathCode: "BBBBA", titleEn: "Warm Goodnight Whispers", titleFa: "نجوای گرم شب‌به‌خیر", badgeCategory: "secret", badgeIcon: "✨", badgeNameFa: "پایان صمیمانه", climaxEn: "Max smiles at Mr. White and Bolt, knowing tomorrow brings new fun.", climaxFa: "مکس به آقای وایت و بولت لبخند زد و می‌دانست فردا بازی‌های تازه‌ای در راه است.", xpReward: 175 },
  { pathCode: "BBBBB", titleEn: "The Magic of the Toy Shop", titleFa: "جادوی اسباب‌بازی‌فروشی مهربان", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "In the warm glow of friendship, toys, and stars, heart-filled magic lives on.", climaxFa: "در گرمای دوستی، اسباب‌بازی‌ها و نور ستاره‌ها، جادوی عشق و مهربانی جاودانه شد.", xpReward: 200 },
];

export const story4ClockworkRobot: AdventureStory = buildAdventureStory({
  id: "a1-clockwork-robot",
  storyIndex: 4,
  cefr: "A1",
  titleEn: "The Tiny Clockwork Robot",
  titleFa: "روبات کوچولوی اسباب‌بازی‌فروشی",
  genre: "scifi",
  genreLabelFa: "🤖 فانتزی و علمی‌تخیلی",
  genreIcon: "🤖",
  synopsisEn:
    "Bolt, a tiny toy robot with glowing blue eyes, explores the cozy toy shop with his friend Max. Play toy instruments or study the star map across 32 delightful endings!",
  synopsisFa:
    "بولت، ربات کوچولوی کوکی با چشم‌های آبی درخشان، همراه دوستش مکس در مغازه اسباب‌بازی‌فروشی بازی می‌کند. آیا با سازهای اسباب‌بازی آهنگ می‌زنید یا نقشه ستاره‌ها را نگاه می‌کنید؟ ۳۲ پایان شاد و رویایی منتظر توست!",
  coverImage: "/images/skills/reading/clockwork-robot.webp",
  nodes,
  endings,
});
