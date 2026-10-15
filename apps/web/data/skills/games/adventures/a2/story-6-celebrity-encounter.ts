import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 6 (A2): The Accidental Movie Star (ماجرای تصادفی با ستاره سینما)
// Genre: Actors & Celebrities (بازیگران و سلبریتی‌ها)
// CEFR: A2 (Past simple & continuous, adjectives, dialogues, everyday entertainment vocabulary)
// Characters: Leo, Uncle Sam, Jack Sterling (Movie Star), Mr. Bennett (Director), Chloe (Costumer)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "On Tuesday afternoon, twelve-year-old Leo visited his Uncle Sam at Silver Screen Studios. Uncle Sam ran the studio cafe and carried twenty boxed lunches for the film crew. Suddenly, a woman with a clipboard ran over to Leo. 'There you are! You are wearing the perfect tweed coat for the young detective scene!' she shouted happily. Before Leo could explain that he was only carrying sandwiches, she pulled him into the bustling film studio.",
    keywords: [
      { word: "studios", meaningFa: "استودیوهای فیلم‌برداری", phonetic: "/ˈstjuːdiəʊz/" },
      { word: "clipboard", meaningFa: "تخته‌شاسی یادداشت", phonetic: "/ˈklɪpbɔːd/" },
      { word: "detective", meaningFa: "کارآگاه", phonetic: "/dɪˈtektɪv/" },
      { word: "bustling", meaningFa: "پر رفت‌وآمد و شلوغ", phonetic: "/ˈbʌslɪŋ/" },
    ],
    question: {
      promptEn: "Why did the woman with the clipboard pull Leo into the studio?",
      promptFa: "چرا خانمی که تخته‌شاسی داشت لئو را به داخل استودیو برد؟",
      options: ["She thought he was the young detective actor", "She wanted to buy all the sandwiches", "She was his school teacher"],
      correctIndex: 0,
      hintSnippet: "You are wearing the perfect tweed coat for the young detective scene",
      clueFa: "خط چهارم رو بخون دوست خوبم! اون خانم فکر کرد لئو بازیگر نوجوان نقش کارآگاهه.",
    },
    choiceA: {
      labelEn: "Put on the brown detective hat and step onto the movie set!",
      labelFa: "کلاه قهوه‌ای کارآگاهی رو سرت بذار و برو روی صحنه فیلم‌برداری!",
      descriptionFa: "شاید یک تجربه فوق‌العاده در برابر دوربین‌ها به دست بیاری.",
    },
    choiceB: {
      labelEn: "Quickly explain the mix-up and deliver the lunches to Uncle Sam!",
      labelFa: "سریع سوءتفاهم رو توضیح بده و ناهارها رو ببر پیش دایی سام!",
      descriptionFa: "صداقت بهتره، و شاید پشت صحنه راز دیگری منتظرت باشه.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Leo stepped onto the brightly lit stage. Giant spotlights shone like miniature suns, and three huge cameras pointed at him. Standing across a wooden desk was Jack Sterling, the world-famous action movie star. Jack smiled warmly and whispered, 'Remember your cue, kid: when I drop the silver key, show me your clue!' Director Bennett shouted through a megaphone: 'Quiet on set... and ACTION!'",
    keywords: [
      { word: "spotlights", meaningFa: "پروژکتورهای نورپردازی صحنه", phonetic: "/ˈspɒtlaɪts/" },
      { word: "miniature", meaningFa: "کوچک و مینیاتوری", phonetic: "/ˈmɪnətʃə/" },
      { word: "action movie", meaningFa: "فیلم اکشن و پرهیجان", phonetic: "/ˈækʃn ˈmuːvi/" },
      { word: "megaphone", meaningFa: "بلندگوی دستی", phonetic: "/ˈmeɡəfəʊn/" },
    ],
    question: {
      promptEn: "What did Jack Sterling tell Leo to do?",
      promptFa: "جک استرلینگ به لئو گفت چه کاری انجام دهد؟",
      options: ["Show his clue when Jack drops the silver key", "Run away from the cameras", "Sing a loud pop song"],
      correctIndex: 0,
      hintSnippet: "when I drop the silver key, show me your clue",
      clueFa: "جک به لئو گفت وقتی کلید نقره‌ای افتاد، مدرک و سرنخت رو نشون بده.",
    },
    choiceA: {
      labelEn: "Pull out Uncle Sam's sandwich receipt as the secret clue!",
      labelFa: "رسید ساندویچ‌های دایی سام رو مثل یه سرنخ محرمانه بیرون بکش!",
      descriptionFa: "یک خلاقیت بامزه که ممکنه همه رو شگفت‌زده کنه.",
    },
    choiceB: {
      labelEn: "Improvise a funny dramatic speech about the missing diamond!",
      labelFa: "یه سخنرانی دراماتیک و خنده‌دار درباره الماس گمشده از خودت دربیار!",
      descriptionFa: "ستاره‌های هالیوود عاشق بازیگرهای شجاع و جسور هستن.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Leo smiled politely and said, 'Excuse me, ma'am, but I am actually Leo from the cafe!' The woman laughed cheerfully and replied, 'Oh goodness, you look just like him! Since you are here, could you take these hot meals to Director Bennett in Trailer 4?' Leo walked down the sunny studio alley and noticed Director Bennett looking under every chair with a worried expression.",
    keywords: [
      { word: "politely", meaningFa: "مؤدبانه و بااحترام", phonetic: "/pəˈlaɪtli/" },
      { word: "trailer", meaningFa: "اتاقک متحرک / کاروان اختصاصی", phonetic: "/ˈtreɪlə/" },
      { word: "worried", meaningFa: "نگران و مضطرب", phonetic: "/ˈwʌrid/" },
      { word: "expression", meaningFa: "حالت چهره", phonetic: "/ɪkˈspreʃn/" },
    ],
    question: {
      promptEn: "What was Director Bennett doing outside Trailer 4?",
      promptFa: "کارگردان بنت بیرون کاروان شماره ۴ چه کار می‌کرد؟",
      options: ["Looking under every chair with a worried face", "Eating a giant slice of pizza", "Sleeping on a comfortable couch"],
      correctIndex: 0,
      hintSnippet: "Director Bennett looking under every chair with a worried expression",
      clueFa: "به جمله آخر نگاه کن: آقای بنت با چهره‌ای نگران زیر همه صندلی‌ها رو می‌گشت.",
    },
    choiceA: {
      labelEn: "Offer the director a warm sandwich and ask what is lost!",
      labelFa: "به کارگردان یه ساندویچ گرم تعارف کن و بپرس چی گم شده!",
      descriptionFa: "شاید بتونی کمکش کنی تا چیزی که گم کرده رو پیدا کنه.",
    },
    choiceB: {
      labelEn: "Check the curious muddy footprints leading toward the costume barn!",
      labelFa: "ردپاهای گلی عجیب رو که به سمت انبار لباس‌ها می‌رن دنبال کن!",
      descriptionFa: "شاید یک ماجرای کارآگاهی واقعی توی استودیو جریان داشته باشه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "When the silver key hit the floor with a loud CLINK, Leo dramatically pulled out the long paper receipt from his coat. 'Aha! The suspect ordered forty pickles at midnight!' he declared boldly. Jack Sterling paused, gasped with genuine amusement, and burst into character: 'Brilliant deduction, Detective Leo!' The entire camera crew held their breath in delight.",
    keywords: [
      { word: "receipt", meaningFa: "رسید کاغذی / فاکتور", phonetic: "/rɪˈsiːt/" },
      { word: "suspect", meaningFa: "فرد مظنون", phonetic: "/ˈsʌspekt/" },
      { word: "deduction", meaningFa: "نتیجه‌گیری هوشمندانه کارآگاهی", phonetic: "/dɪˈdʌkʃn/" },
      { word: "delight", meaningFa: "خوشحالی و ذوق‌زدگی", phonetic: "/dɪˈlaɪt/" },
    ],
    question: {
      promptEn: "What did Leo's funny receipt say about the suspect?",
      promptFa: "رسید خنده‌دار لئو درباره مظنون چه می‌گفت؟",
      options: ["The suspect ordered forty pickles at midnight", "The suspect bought a flying car", "The suspect forgot his homework"],
      correctIndex: 0,
      hintSnippet: "The suspect ordered forty pickles at midnight",
      clueFa: "لئو به شوخی گفت مظنون نیمه‌شب چهل تا خیارشور سفارش داده بود!",
    },
    choiceA: {
      labelEn: "Hand the receipt to Jack and point dramatically at the camera!",
      labelFa: "رسید رو بده دست جک و با ژست کارآگاهی به دوربین اشاره کن!",
      descriptionFa: "صحنه رو با یک حرکت قهرمانانه کامل کن.",
    },
    choiceB: {
      labelEn: "Whisper a secret code into Jack's ear to keep the scene going!",
      labelFa: "یه رمز خنده‌دار در گوش جک زمزمه کن تا صحنه ادامه پیدا کنه!",
      descriptionFa: "بازی بداهه بین تو و ستاره فیلم تماشایی خواهد شد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Leo cleared his throat and stepped forward with passion. 'The diamond was not stolen by a thief, Mr. Sterling! It was carried away by the studio mascot, Barnaby the golden retriever!' Jack Sterling's eyes widened in surprise, and Director Bennett jumped out of his chair, grinning. 'Keep rolling! This kid is a natural comedic genius!' the director whispered.",
    keywords: [
      { word: "mascot", meaningFa: "نماد خوش‌شانسی / حیوان خانگی استودیو", phonetic: "/ˈmæskət/" },
      { word: "retriever", meaningFa: "سگ نژاد رتریور", phonetic: "/rɪˈtriːvə/" },
      { word: "grinning", meaningFa: "لبخند گشاد زدن", phonetic: "/ˈɡrɪnɪŋ/" },
      { word: "genius", meaningFa: "نابغه", phonetic: "/ˈdʒiːniəs/" },
    ],
    question: {
      promptEn: "Who did Leo say took the diamond in his funny speech?",
      promptFa: "لئو در سخنرانی خنده‌دارش گفت چه کسی الماس را برده بود؟",
      options: ["Barnaby the golden retriever", "A mischievous monkey", "A robot from space"],
      correctIndex: 0,
      hintSnippet: "It was carried away by the studio mascot, Barnaby the golden retriever",
      clueFa: "لئو گفت بارنابی، سگ طلایی معروف استودیو الماس رو برده!",
    },
    choiceA: {
      labelEn: "Whistle for friendly dog Barnaby to run onto the set!",
      labelFa: "سوت بزن تا بارنابی مهربون بدوه بیاد وسط صحنه فیلم!",
      descriptionFa: "یک پایان کارتونی و به‌یادماندنی با حضور سگ بازیگوش.",
    },
    choiceB: {
      labelEn: "Show a sparkling shiny toy badge as evidence of the crime!",
      labelFa: "یه نشان براق اسباب‌بازی رو به عنوان مدرک جرم نشون بده!",
      descriptionFa: "کارآگاه واقعی همیشه نشان خودش رو همراه داره.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Leo handed a warm chicken wrap to Director Bennett. 'Here is some lunch, sir! Are you looking for something important?' The director sighed with relief after a tasty bite. 'My lucky golden sunglasses! I have worn them on every hit movie since 2010. Without them, I cannot shoot the big red-carpet finale today!' Leo noticed a glint of gold near the makeup trailer.",
    keywords: [
      { word: "sunglasses", meaningFa: "عینک آفتابی", phonetic: "/ˈsʌnɡlɑːsɪz/" },
      { word: "relief", meaningFa: "آرامش و تسکین خیال", phonetic: "/rɪˈliːf/" },
      { word: "finale", meaningFa: "بخش پایانی و باشکوه", phonetic: "/fɪˈnɑːli/" },
      { word: "glint", meaningFa: "درخشش کوتاه و برقی از نور", phonetic: "/ɡlɪnt/" },
    ],
    question: {
      promptEn: "What lucky item was Director Bennett searching for?",
      promptFa: "کارگردان بنت دنبال کدام وسیله خوش‌شانسی‌اش می‌گشت؟",
      options: ["His lucky golden sunglasses", "His silver watch", "His favorite fountain pen"],
      correctIndex: 0,
      hintSnippet: "My lucky golden sunglasses! I have worn them on every hit movie",
      clueFa: "کارگردان گفت عینک آفتابی طلایی خوش‌شانسی‌اش که از سال ۲۰۱۰ همراهشه گم شده.",
    },
    choiceA: {
      labelEn: "Run to the makeup trailer to check the golden sparkle!",
      labelFa: "سریع برو سمت کاروان گریم تا اون برق طلایی رو بررسی کنی!",
      descriptionFa: "شاید عینک روی میز گریم بازیگرها جا مونده باشه.",
    },
    choiceB: {
      labelEn: "Ask costume designer Chloe if she cleaned the director's jacket!",
      labelFa: "از طراح لباس، کلوئی، بپرس آیا کت کارگردان رو تمیز کرده یا نه!",
      descriptionFa: "طراحان لباس همه‌چیز رو در استودیو با دقت زیر نظر دارن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Leo followed the tiny muddy footprints along the wooden boardwalk. Near the costume barn, he heard soft classical music. Peeking through the double doors, he saw Jack Sterling practicing an elegant dance step while balancing a velvet hat on his head. Beside Jack was a friendly fluffy parrot perched on a coat rack, holding something shiny in its beak!",
    keywords: [
      { word: "boardwalk", meaningFa: "مسیر چوبی پیاده‌رو", phonetic: "/ˈbɔːdwɔːk/" },
      { word: "peeking", meaningFa: "سرک کشیدن و زیرچشمی نگاه کردن", phonetic: "/ˈpiːkɪŋ/" },
      { word: "perched", meaningFa: "نشسته روی شاخه یا میله", phonetic: "/pɜːtʃt/" },
      { word: "beak", meaningFa: "منقار پرنده", phonetic: "/biːk/" },
    ],
    question: {
      promptEn: "What was the parrot holding in its beak?",
      promptFa: "طوطی چه چیزی را در منقارش نگه داشته بود؟",
      options: ["Something shiny", "A red apple", "A small microphone"],
      correctIndex: 0,
      hintSnippet: "holding something shiny in its beak",
      clueFa: "به جمله آخر دقت کن: طوطی یک شیء براق رو در منقارش نگه داشته بود.",
    },
    choiceA: {
      labelEn: "Offer the parrot a piece of apple from your pocket!",
      labelFa: "یه تیکه سیب تازه از جیبت به طوطی تعارف کن تا شیء براق رو بده!",
      descriptionFa: "حیوانات با میوه‌های شیرین سریع دوست می‌شن.",
    },
    choiceB: {
      labelEn: "Politely greet Jack Sterling and show him the clever bird!",
      labelFa: "مؤدبانه به جک استرلینگ سلام کن و پرنده شیطون رو نشونش بده!",
      descriptionFa: "جک حتماً از دیدن این پرنده بامزه خوشحال می‌شه.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Leo handed the receipt to Jack with a confident smile. Jack laughed so heartily that his detective mustache almost peeled off. The director shouted, 'Cut! That was pure magic! Son, what is your name?' Leo proudly answered, 'Leo, sir!' Jack placed a hand on Leo's shoulder: 'Would you like to film the big city chase scene with me this afternoon?'",
    keywords: [
      { word: "heartily", meaningFa: "از ته دل و باصدای بلند", phonetic: "/ˈhɑːtɪli/" },
      { word: "mustache", meaningFa: "سبیل گریم", phonetic: "/məˈstɑːʃ/" },
      { word: "magic", meaningFa: "شگفت‌انگیز و جادویی", phonetic: "/ˈmædʒɪk/" },
      { word: "chase scene", meaningFa: "صحنه تعقیب و گریز", phonetic: "/ˈtʃeɪs siːn/" },
    ],
    question: {
      promptEn: "What did Jack invite Leo to do this afternoon?",
      promptFa: "جک به لئو پیشنهاد داد بعدازظهر در چه صحنه‌ای بازی کند؟",
      options: ["The big city chase scene", "A boring lecture scene", "A quiet library scene"],
      correctIndex: 0,
      hintSnippet: "Would you like to film the big city chase scene with me this afternoon",
      clueFa: "جک از لئو خواست در صحنه هیجان‌انگیز تعقیب و گریز در شهر همراهش باشه.",
    },
    choiceA: {
      labelEn: "Agree excitedly and hop into the vintage red convertible car!",
      labelFa: "با ذوق قبول کن و بپر توی ماشین کروک قرمز کلاسیک فیلم!",
      descriptionFa: "پایان‌های ۳۱ و ۳۲ در ماشین سینمایی منتظرند.",
    },
    choiceB: {
      labelEn: "Ask if Uncle Sam can watch from the director's VIP tent!",
      labelFa: "بپرس آیا دایی سام هم می‌تونه از جایگاه ویژه کارگردان تماشا کنه!",
      descriptionFa: "خانواده همیشه در لحظات درخشان باید همراهت باشن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Leo leaned close to Jack and whispered, 'The code word is Double Choco Cookie!' Jack smiled mischievously, grabbed an acoustic guitar from the corner, and began singing a catchy detective ballad. The entire camera crew started clapping to the rhythm. Director Bennett danced in his socks, completely thrilled by the spontaneous comedy song.",
    keywords: [
      { word: "mischievously", meaningFa: "با شیطنت و شوخ‌طبعی", phonetic: "/ˈmɪstʃɪvəsli/" },
      { word: "ballad", meaningFa: "ترانه آرام و ملایم داستانی", phonetic: "/ˈbæləd/" },
      { word: "rhythm", meaningFa: "ریتم و آهنگ", phonetic: "/ˈrɪðəm/" },
      { word: "spontaneous", meaningFa: "خودجوش و بدون هماهنگی قبلی", phonetic: "/spɒnˈteɪniəs/" },
    ],
    question: {
      promptEn: "What did Jack Sterling start doing with the guitar?",
      promptFa: "جک استرلینگ با گیتار چه کار کرد؟",
      options: ["Singing a catchy detective ballad", "Throwing it out the window", "Painting it blue"],
      correctIndex: 0,
      hintSnippet: "began singing a catchy detective ballad",
      clueFa: "جک گیتار رو برداشت و شروع کرد به خوندن یک ترانه کارآگاهی شاد.",
    },
    choiceA: {
      labelEn: "Sing the funny chorus together into the boom microphone!",
      labelFa: "هم‌صدا با جک بخش ترجیع‌بند خنده‌دار رو توی میکروفون بزرگ بخونید!",
      descriptionFa: "پایان‌های ۳۳ و ۳۴ در موسیقی زنده هالیوودی.",
    },
    choiceB: {
      labelEn: "Play a mini drum beat on the wooden desk with two pencils!",
      labelFa: "با دو تا مداد روی میز چوبی ریتم طبل بزن و هیجان رو بالا ببر!",
      descriptionFa: "استعداد موسیقیایی کارآگاه کوچک همه رو شگفت‌زده می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Leo let out a loud whistle. Seconds later, Barnaby the golden retriever bounded into the studio with his tail wagging like a propeller. In his mouth was a shiny golden award trophy! Director Bennett gasped: 'My Best Comedy Director Trophy from last year! Barnaby had hidden it in the garden!' Everyone clapped and cheered for Leo and Barnaby.",
    keywords: [
      { word: "bounded", meaningFa: "با جهش و جست‌وخیز وارد شد", phonetic: "/ˈbaʊndɪd/" },
      { word: "propeller", meaningFa: "پروانه هواپیما یا قایق", phonetic: "/prəˈpelə/" },
      { word: "trophy", meaningFa: "جام قهرمانی / تندیس جایزه", phonetic: "/ˈtrəʊfi/" },
      { word: "cheered", meaningFa: "هورا کشیدند و تشویق کردند", phonetic: "/tʃɪəd/" },
    ],
    question: {
      promptEn: "What did Barnaby the dog have in his mouth?",
      promptFa: "بارنابی سگ چه چیزی در دهانش داشت؟",
      options: ["The Best Comedy Director Trophy", "A tennis ball", "An old leather boot"],
      correctIndex: 0,
      hintSnippet: "In his mouth was a shiny golden award trophy",
      clueFa: "بارنابی تندیس زرین بهترین کارگردان کمدی رو آورده بود!",
    },
    choiceA: {
      labelEn: "Pose with Barnaby and Jack for the official studio poster!",
      labelFa: "با بارنابی و جک کنار تندیس برای پوستر رسمی فیلم عکس بگیرید!",
      descriptionFa: "یک عکس خاطره‌انگیز که روی بیلبوردهای شهر می‌ره.",
    },
    choiceB: {
      labelEn: "Reward brave Barnaby with a big bowl of crunchy dog biscuits!",
      labelFa: "به بارنابی شجاع یه ظرف پر از بیسکویت‌های ترد جایزه بده!",
      descriptionFa: "بهترین دوست وفادار شایسته خوشمزه‌ترین جایزه‌هاست.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Leo held up the shiny silver badge that Uncle Sam had given him for his birthday. Under the studio lights, it gleamed like pure platinum. Jack Sterling knelt on one knee in front of Leo: 'Chief Detective, we need your brain for the next three blockbuster movies!' The movie crew broke into thunderous applause, and the director ordered a customized director chair with Leo's name on it.",
    keywords: [
      { word: "gleamed", meaningFa: "درخشید و برق زد", phonetic: "/ɡliːmd/" },
      { word: "platinum", meaningFa: "پلاتین ارزشمند و درخشان", phonetic: "/ˈplætɪnəm/" },
      { word: "blockbuster", meaningFa: "فیلم پرفروش و بسیار پرطرفدار", phonetic: "/ˈblɒkbʌstə/" },
      { word: "customized", meaningFa: "سفارشی ساخته شده با نام شخص", phonetic: "/ˈkʌstəmaɪzd/" },
    ],
    question: {
      promptEn: "What did the director order for Leo?",
      promptFa: "کارگردان چه چیزی را به صورت اختصاصی برای لئو سفارش داد؟",
      options: ["A customized director chair with his name", "A giant skateboard", "A box of magic pens"],
      correctIndex: 0,
      hintSnippet: "ordered a customized director chair with Leo's name on it",
      clueFa: "کارگردان یک صندلی مخصوص با اسم چاپ‌شده لئو سفارش داد.",
    },
    choiceA: {
      labelEn: "Sit on the customized director chair and shout 'Action!'",
      labelFa: "روی صندلی ویژه کارگردان بنشین و بلند فریاد بزن 'حرکت!'",
      descriptionFa: "تجربه فرماندهی در پشت صحنه یک فیلم هالیوودی.",
    },
    choiceB: {
      labelEn: "Invite your school friends to visit the film set on Friday!",
      labelFa: "بچه‌های کلاستون رو دعوت کن تا جمعه به پشت صحنه بیان!",
      descriptionFa: "یک روز فراموش‌نشدنی با همکلاسی‌ها در شهرک سینمایی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Leo rushed into the makeup trailer and inspected the vanity mirror. Sitting right on top of a glittery wig were the golden sunglasses! Beside them was a handwritten note from the makeup artist: 'Polished for Mr. Bennett!' Leo carefully lifted the glasses and ran back out to the studio lawn, holding them up high.",
    keywords: [
      { word: "vanity mirror", meaningFa: "آینه قدی با چراغ‌های گریم", phonetic: "/ˈvænəti ˈmɪrə/" },
      { word: "glittery", meaningFa: "براق و اکلیلی", phonetic: "/ˈɡlɪtəri/" },
      { word: "wig", meaningFa: "کلاه‌گیس گریم", phonetic: "/wɪɡ/" },
      { word: "polished", meaningFa: "تمیز و براق‌شده", phonetic: "/ˈpɒlɪʃt/" },
    ],
    question: {
      promptEn: "Where were the golden sunglasses found?",
      promptFa: "عینک آفتابی طلایی کجا پیدا شد؟",
      options: ["On top of a glittery wig by the vanity mirror", "Inside an empty trash can", "Under a wooden bridge"],
      correctIndex: 0,
      hintSnippet: "Sitting right on top of a glittery wig were the golden sunglasses",
      clueFa: "عینک درست روی یک کلاه‌گیس براق کنار آینه گریم نشسته بود.",
    },
    choiceA: {
      labelEn: "Hand the sunglasses to Director Bennett with a superhero bow!",
      labelFa: "عینک رو با یک تعظیم ابرقهرمانی به کارگردان بنت تقدیم کن!",
      descriptionFa: "آقای بنت فوق‌العاده سپاسگزار خواهد شد.",
    },
    choiceB: {
      labelEn: "Try them on for five seconds and snap a stylish selfie with Jack!",
      labelFa: "پنج ثانیه عینک رو بزن و یک سلفی خفن با جک استرلینگ بنداز!",
      descriptionFa: "این عکس در شبکه‌های اجتماعی طوفان به پا می‌کنه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Leo found Chloe the costume designer threading golden needles. When Leo asked about the jacket, Chloe smiled warmly: 'Mr. Bennett left his sunglasses in his navy velvet blazer! I had put them in this special velvet pouch so they would not get scratched.' She handed the pouch to Leo and gave him a golden star pin for being such a clever helper.",
    keywords: [
      { word: "threading", meaningFa: "نخ کردن سوزن", phonetic: "/ˈθredɪŋ/" },
      { word: "blazer", meaningFa: "کت تک اسپرت و شیک", phonetic: "/ˈbleɪzə/" },
      { word: "pouch", meaningFa: "کیسه مخملی کوچک محافظ", phonetic: "/paʊtʃ/" },
      { word: "pin", meaningFa: "سنجاق سینه نشان افتخار", phonetic: "/pɪn/" },
    ],
    question: {
      promptEn: "What did Chloe give Leo along with the velvet pouch?",
      promptFa: "کلوئی علاوه بر کیسه مخملی چه چیزی به لئو هدیه داد؟",
      options: ["A golden star pin", "A pair of socks", "A blue umbrella"],
      correctIndex: 0,
      hintSnippet: "gave him a golden star pin for being such a clever helper",
      clueFa: "کلوئی یک سنجاق سینه ستاره طلایی به لباس لئو وصل کرد.",
    },
    choiceA: {
      labelEn: "Pin the golden star on your coat and deliver the glasses to the set!",
      labelFa: "ستاره رو به لباست بزن و عینک رو ببر سر صحنه فیلم‌برداری!",
      descriptionFa: "ورود افتخارآمیز دستیار ارشد صحنه.",
    },
    choiceB: {
      labelEn: "Ask Chloe to design a cool junior detective jacket for you!",
      labelFa: "از کلوئی بخواه یه کت کارآگاهی نوجوانان شیک برات طراحی کنه!",
      descriptionFa: "پوشیدن لباس طراحی‌شده توسط برترین طراح لباس هالیوود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Leo gently held out a juicy slice of red apple toward the parrot. 'Here you go, Captain Feather!' The smart parrot tilted its colorful head, took the apple slice happily, and dropped the shiny object into Leo's palm. It was the director's golden sunglasses, without a single scratch! Jack Sterling chuckled: 'Captain Feather loves shiny things, but he loves sweet apples even more!'",
    keywords: [
      { word: "tilted", meaningFa: "خم کرد و کج گرفت", phonetic: "/ˈtɪltɪd/" },
      { word: "palm", meaningFa: "کف دست", phonetic: "/pɑːm/" },
      { word: "scratch", meaningFa: "خط و خش", phonetic: "/skrætʃ/" },
      { word: "chuckled", meaningFa: "ریز و با ملایمت خندید", phonetic: "/ˈtʃʌkld/" },
    ],
    question: {
      promptEn: "What did the parrot drop into Leo's palm?",
      promptFa: "طوطی چه چیزی را در کف دست لئو انداخت؟",
      options: ["The director's golden sunglasses", "A silver coin", "A green feather"],
      correctIndex: 0,
      hintSnippet: "dropped the shiny object into Leo's palm. It was the director's golden sunglasses",
      clueFa: "طوطی سیب رو گرفت و عینک طلایی کارگردان رو توی دست لئو گذاشت.",
    },
    choiceA: {
      labelEn: "Carry the parrot on your shoulder to present the glasses to the director!",
      labelFa: "طوطی رو روی شونت بذار و عینک رو با هم به کارگردان تحویل بدید!",
      descriptionFa: "ورود خنده‌دار و قهرمانانه مثل یک دزد دریایی شجاع.",
    },
    choiceB: {
      labelEn: "Teach the clever parrot to repeat 'Cut and Print!' into the microphone!",
      labelFa: "به طوطی یاد بده پشت میکروفون جمله معروف 'برداشت عالی بود' رو بگه!",
      descriptionFa: "همه عوامل صحنه از خنده روده‌بر خواهند شد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Leo greeted Jack politely: 'Hello Mr. Sterling, look at your feathery friend!' Jack gasped in astonishment: 'That pirate parrot took the director's lucky sunglasses! You solved the studio mystery in five minutes, Leo!' Jack shook Leo's hand warmly and called Director Bennett on the studio walkie-talkie: 'Chief, our mystery is solved by young Leo!'",
    keywords: [
      { word: "astonishment", meaningFa: "حیرت و شگفتی فراوان", phonetic: "/əˈstɒnɪʃmənt/" },
      { word: "feathery", meaningFa: "پردار و پرپوش", phonetic: "/ˈfeðəri/" },
      { word: "walkie-talkie", meaningFa: "بیسیم دستی", phonetic: "/ˌwɔːki ˈtɔːki/" },
      { word: "mystery", meaningFa: "راز و معما", phonetic: "/ˈmɪstri/" },
    ],
    question: {
      promptEn: "How did Jack contact Director Bennett?",
      promptFa: "جک چطور با کارگردان بنت تماس گرفت؟",
      options: ["On the studio walkie-talkie", "By sending a letter", "By blowing a horn"],
      correctIndex: 0,
      hintSnippet: "called Director Bennett on the studio walkie-talkie",
      clueFa: "جک با بیسیم دستی استودیو کارگردان رو صدا زد.",
    },
    choiceA: {
      labelEn: "Speak directly into the walkie-talkie to give the all-clear code!",
      labelFa: "خودت پشت بیسیم صحبت کن و اعلام وضعیت سفید بده!",
      descriptionFa: "پایان‌های ۴۷ و ۴۸ در بی‌سیم‌های عوامل صحنه.",
    },
    choiceB: {
      labelEn: "Ask Jack Sterling for an autograph on your sandwich delivery menu!",
      labelFa: "از جک استرلینگ بخواه روی منوی ساندویچ‌فروشی دایی امضا بزنه!",
      descriptionFa: "منوی امضاشده به باارزش‌ترین یادگاری کافه تبدیل می‌شه.",
    },
  },

  // STEP 5 (16 NODES: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Leo climbed into the shiny red convertible beside Jack Sterling. Cameras mounted on high crane arms swooped through the air like eagles. 'Hit the gas, Detective!' shouted Jack as safe movie sparks lit up the tunnel. Leo held the steering wheel with confidence, delivering lines with perfect comedic timing.",
    keywords: [
      { word: "convertible", meaningFa: "خودروی روباز / کروک", phonetic: "/kənˈvɜːtəbl/" },
      { word: "crane", meaningFa: "جرثقیل فیلم‌برداری بوم بلند", phonetic: "/kreɪn/" },
      { word: "swooped", meaningFa: "به سمت پایین شیرجه زد", phonetic: "/swuːpt/" },
      { word: "sparks", meaningFa: "جرقه‌های جلوه‌های ویژه", phonetic: "/spɑːks/" },
    ],
    question: {
      promptEn: "What vehicle did Leo ride with Jack?",
      promptFa: "لئو و جک سوار چه خودرویی شدند؟",
      options: ["A shiny red convertible", "A yellow school bus", "A rusty bicycle"],
      correctIndex: 0,
      hintSnippet: "climbed into the shiny red convertible beside Jack",
      clueFa: "لئو سوار ماشین کروک قرمز براق فیلم شد.",
    },
    choiceA: { labelEn: "Do a spectacular movie brake spin in front of the bank set!", labelFa: "یک دور ترمز تماشایی جلوی دکور بانک بزن!", descriptionFa: "پایان شماره ۱" },
    choiceB: { labelEn: "Wave to Uncle Sam who is filming from the sidewalk!", labelFa: "برای دایی سام که از پیاده‌رو فیلم می‌گیره دست تکان بده!", descriptionFa: "پایان شماره ۲" },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Uncle Sam entered the VIP tent wearing a gold director headset. Tears of pride sparkled in his eyes as he saw Leo on the high-definition production monitors. Jack Sterling handed Leo an honorary Junior Actor card signed in gold ink. 'Today, this studio found a real star!' Uncle Sam cheered.",
    keywords: [
      { word: "headset", meaningFa: "هدفون عوامل صحنه", phonetic: "/ˈhedset/" },
      { word: "monitors", meaningFa: "مانیتورهای نظارت کارگردانی", phonetic: "/ˈmɒnɪtəz/" },
      { word: "honorary", meaningFa: "افتخاری و نمادین", phonetic: "/ˈɒnərəri/" },
      { word: "pride", meaningFa: "غرور و افتخار", phonetic: "/praɪd/" },
    ],
    question: {
      promptEn: "Where was Uncle Sam watching Leo?",
      promptFa: "دایی سام از کجا بازی لئو را تماشا می‌کرد؟",
      options: ["In the VIP tent on high-definition monitors", "From a tree branch outside", "Through a kitchen window"],
      correctIndex: 0,
      hintSnippet: "entered the VIP tent wearing a gold director headset",
      clueFa: "دایی سام توی چادر VIP با مانیتورهای باکیفیت تماشا می‌کرد.",
    },
    choiceA: { labelEn: "Dedicate your performance to the neighborhood cafe!", labelFa: "اجرای این صحنه رو به کافه صمیمی محله تقدیم کن!", descriptionFa: "پایان شماره ۳" },
    choiceB: { labelEn: "Frame the gold-ink junior actor card above the cash register!", labelFa: "کارت طلایی بازیگری رو قاب بگیر و بزن بالای دخل کافه!", descriptionFa: "پایان شماره ۴" },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Leo and Jack sang into the suspended boom microphone: 'No crime can hide, no puzzle too deep, when detective sandwiches are warm and cheap!' The sound engineers danced behind the mixing console, and the director laughed until his face turned cherry red.",
    keywords: [
      { word: "suspended", meaningFa: "معلق در هوا", phonetic: "/səˈspendɪd/" },
      { word: "console", meaningFa: "میز میکس و صدابرداری", phonetic: "/ˈkɒnsəʊl/" },
      { word: "cherry", meaningFa: "گیلاسی و گلگون", phonetic: "/ˈtʃeri/" },
      { word: "engineers", meaningFa: "مهندسان صدا و تدوین", phonetic: "/ˌendʒɪˈnɪəz/" },
    ],
    question: {
      promptEn: "What funny song did Leo and Jack sing?",
      promptFa: "لئو و جک چه شعر خنده‌داری خواندند؟",
      options: ["A song about detective sandwiches", "A lullaby about sleepy cats", "A poem about rainy days"],
      correctIndex: 0,
      hintSnippet: "when detective sandwiches are warm and cheap",
      clueFa: "اونا شعر بامزه‌ای درباره ساندویچ‌های گرم کارآگاهی خوندن.",
    },
    choiceA: { labelEn: "Release the song as the official movie soundtrack single!", labelFa: "این ترانه رو به عنوان آهنگ رسمی تیتراژ فیلم پخش کنید!", descriptionFa: "پایان شماره ۵" },
    choiceB: { labelEn: "Perform the sandwich song live on a morning talk show!", labelFa: "آهنگ رو صبح فردا در برنامه زنده تلویزیونی اجرا کنید!", descriptionFa: "پایان شماره ۶" },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Leo drummed a snappy syncopated beat on the desk with two sharpened yellow pencils. Jack tapped his polished leather shoes, and thirty crew members joined in with clapping and finger-snapping. The studio felt like a cheerful Hollywood Broadway musical.",
    keywords: [
      { word: "syncopated", meaningFa: "ریتمیک و شاد با تکیه‌های ضربی", phonetic: "/ˈsɪŋkəpeɪtɪd/" },
      { word: "finger-snapping", meaningFa: "بشکن زدن با انگشتان", phonetic: "/ˈfɪŋɡə snæpɪŋ/" },
      { word: "musical", meaningFa: "فیلم یا تئاتر موزیکال", phonetic: "/ˈmjuːzɪkl/" },
      { word: "broadway", meaningFa: "تئاتر برادوی و هنرهای نمایشی", phonetic: "/ˈbrɔːdweɪ/" },
    ],
    question: {
      promptEn: "What instruments did Leo use to play the drum beat?",
      promptFa: "لئو با چه وسیله‌ای ریتم طبل نواخت؟",
      options: ["Two sharpened yellow pencils", "Metal spoons", "His cell phone"],
      correctIndex: 0,
      hintSnippet: "drummed a snappy syncopated beat on the desk with two sharpened yellow pencils",
      clueFa: "لئو با دو تا مداد زردرنگ تراشیده‌شده روی میز طبل زد.",
    },
    choiceA: { labelEn: "Sign up for drum lessons and star in a music comedy!", labelFa: "در کلاس‌های درامز ثبت‌نام کن و در یک فیلم کمدی-موزیکال بازی کن!", descriptionFa: "پایان شماره ۷" },
    choiceB: { labelEn: "Keep the two pencils as lucky souvenirs in your pencil case!", labelFa: "مدادها رو به عنوان یادگاری خوش‌شانسی توی جامدادیت نگه دار!", descriptionFa: "پایان شماره ۸" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The official photographer arrived with five studio flash units. Leo sat between movie icon Jack Sterling and smiling dog Barnaby, holding the gold trophy together. Flashbulbs lit up the room like fireworks, capturing the happiest moment in Silver Screen Studios history.",
    keywords: [
      { word: "flashbulbs", meaningFa: "فلاش‌های عکاسی پرنور", phonetic: "/ˈflæʃbʌlbz/" },
      { word: "fireworks", meaningFa: "آتش‌بازی جشن", phonetic: "/ˈfaɪəwɜːks/" },
      { word: "capturing", meaningFa: "ثبت کردن عکس و لحظه", phonetic: "/ˈkæptʃərɪŋ/" },
      { word: "icon", meaningFa: "ستاره مشهور و الگو", phonetic: "/ˈaɪkɒn/" },
    ],
    question: {
      promptEn: "Who sat next to Leo in the official photo?",
      promptFa: "در عکس رسمی چه کسانی کنار لئو نشستند؟",
      options: ["Jack Sterling and Barnaby the dog", "Two robotic dinosaurs", "The school principal"],
      correctIndex: 0,
      hintSnippet: "between movie icon Jack Sterling and smiling dog Barnaby",
      clueFa: "جک استرلینگ و بارنابی سگ وفادار کنار لئو نشستند.",
    },
    choiceA: { labelEn: "Ask for a signed photo for your bedroom wall!", labelFa: "یک نسخه امضاشده رو برای دیوار اتاقت بگیر!", descriptionFa: "پایان شماره ۹" },
    choiceB: { labelEn: "Put the photo on the front page of the town newspaper!", labelFa: "عکس رو چاپ اول صفحه روزنامه شهر بذارید!", descriptionFa: "پایان شماره ۱۰" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Barnaby happily munched on heart-shaped crunchy biscuits while resting his golden head on Leo's knee. The director declared Barnaby and Leo the official studio goodwill ambassadors, with lifetime passes to every movie premiere in the city.",
    keywords: [
      { word: "munched", meaningFa: "با اشتها و صدا جوید", phonetic: "/mʌntʃt/" },
      { word: "ambassadors", meaningFa: "سفیران صلح و دوستی", phonetic: "/æmˈbæsədəz/" },
      { word: "premiere", meaningFa: "مراسم فرش قرمز افتتاحیه فیلم", phonetic: "/ˈpremieə/" },
      { word: "goodwill", meaningFa: "حسن‌نیت و مهربانی", phonetic: "/ˌɡʊdˈwɪl/" },
    ],
    question: {
      promptEn: "What special pass did Leo and Barnaby receive?",
      promptFa: "لئو و بارنابی چه کارت ویژه‌ای دریافت کردند؟",
      options: ["Lifetime passes to every movie premiere", "Free bus tickets", "A pass to the zoo"],
      correctIndex: 0,
      hintSnippet: "lifetime passes to every movie premiere in the city",
      clueFa: "بلیط ویژه مادام‌العمر برای تمام افتتاحیه‌های فیلم شهر گرفتند.",
    },
    choiceA: { labelEn: "Walk the red carpet in matching tuxedos with Barnaby!", labelFa: "با بارنابی در کت‌وشلوارهای ست روی فرش قرمز راه بروید!", descriptionFa: "پایان شماره ۱۱" },
    choiceB: { labelEn: "Host a movie night in the backyard for all your neighbors!", labelFa: "یک شب فیلم خاطره‌انگیز توی حیاط خونه برای همسایه‌ها برگزار کن!", descriptionFa: "پایان شماره ۱۲" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Leo sat down on the high wooden director chair that had 'DIRECTOR LEO' written in bold white letters across the back. He peered through the optical viewfinder and yelled through the megaphone: 'Quiet on set, cameras ready... ACTION!' The scene rolled flawlessly.",
    keywords: [
      { word: "viewfinder", meaningFa: "چشمی دوربین فیلم‌برداری", phonetic: "/ˈvjuːfaɪndə/" },
      { word: "flawlessly", meaningFa: "بی‌نقص و عالی", phonetic: "/ˈflɔːləsli/" },
      { word: "optical", meaningFa: "نوری و چشمی", phonetic: "/ˈɒptɪkl/" },
      { word: "bold", meaningFa: "درشت و پررنگ", phonetic: "/bəʊld/" },
    ],
    question: {
      promptEn: "What was written on the back of Leo's chair?",
      promptFa: "پشت صندلی لئو چه نوشته شده بود؟",
      options: ["DIRECTOR LEO", "SUPER CHEF", "STAR DETECTIVE"],
      correctIndex: 0,
      hintSnippet: "had 'DIRECTOR LEO' written in bold white letters across the back",
      clueFa: "با حروف درشت سفید نوشته شده بود: کارگردان لئو.",
    },
    choiceA: { labelEn: "Direct Jack in a dramatic jump over a cardboard river!", labelFa: "صحنه پرش دراماتیک جک از روی رودخانه مقوایی رو کارگردانی کن!", descriptionFa: "پایان شماره ۱۳" },
    choiceB: { labelEn: "Call 'That is a wrap!' and treat the whole crew to milkshakes!", labelFa: "پایان فیلم‌برداری رو اعلام کن و همه رو به میلک‌شیک مهمون کن!", descriptionFa: "پایان شماره ۱۴" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "On Friday afternoon, a bright yellow bus brought thirty of Leo's schoolmates to the studio. Jack Sterling showed them the special effects green screen, and Leo demonstrated how stunt doubles jump onto giant soft cushions. Every kid cheered Leo's name.",
    keywords: [
      { word: "schoolmates", meaningFa: "هم‌مدرسه‌ای‌ها و همکلاسی‌ها", phonetic: "/ˈskuːlmeɪts/" },
      { word: "green screen", meaningFa: "پرده سبز جلوه‌های ویژه سینمایی", phonetic: "/ˈɡriːn skriːn/" },
      { word: "stunt", meaningFa: "بدل‌کاری و حرکات نمایشی خطرناک", phonetic: "/stʌnt/" },
      { word: "cushions", meaningFa: "تشک‌های ایمنی بزرگ و نرم", phonetic: "/ˈkʊʃnz/" },
    ],
    question: {
      promptEn: "What did Jack Sterling show to Leo's schoolmates?",
      promptFa: "جک استرلینگ چه چیزی را به همکلاسی‌های لئو نشان داد؟",
      options: ["The special effects green screen", "The cafeteria kitchen", "A math textbook"],
      correctIndex: 0,
      hintSnippet: "Jack Sterling showed them the special effects green screen",
      clueFa: "جک پرده سبز هیجان‌انگیز جلوه‌های ویژه رو نشونشون داد.",
    },
    choiceA: { labelEn: "Let every kid record a funny flying scene on the green screen!", labelFa: "به تک‌تک بچه‌ها اجازه بده یک صحنه پرواز روی پرده سبز بازی کنند!", descriptionFa: "پایان شماره ۱۵" },
    choiceB: { labelEn: "Award Leo the Student Hero Medal at Monday morning assembly!", labelFa: "صبح دوشنبه در صف مدرسه مدال افتخار دانش‌آموزی رو به لئو بدهید!", descriptionFa: "پایان شماره ۱۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Leo bowed politely and handed the gleaming golden sunglasses to Director Bennett. The director cheered with delight and slid them onto his nose: 'My lucky vision is back! We can now film the final five-hundred-person ballroom dance scene!'",
    keywords: [
      { word: "vision", meaningFa: "دید و دیدگاه هنری", phonetic: "/ˈvɪʒn/" },
      { word: "ballroom", meaningFa: "تالار بزرگ رقص و جشن", phonetic: "/ˈbɔːlruːm/" },
      { word: "gleaming", meaningFa: "بسیار درخشان و تابناک", phonetic: "/ˈɡliːmɪŋ/" },
      { word: "slid", meaningFa: "سر داد و روی صورت گذاشت", phonetic: "/slɪd/" },
    ],
    question: {
      promptEn: "What big scene could now be filmed thanks to Leo?",
      promptFa: "به لطف پیدا شدن عینک، چه صحنه بزرگی فیلم‌برداری شد؟",
      options: ["The five-hundred-person ballroom dance scene", "A scene in an empty elevator", "A rainy street scene"],
      correctIndex: 0,
      hintSnippet: "film the final five-hundred-person ballroom dance scene",
      clueFa: "صحنه رقص باشکوه پانصد نفره در تالار فیلم‌برداری شد.",
    },
    choiceA: { labelEn: "Join the grand ballroom waltz as the honorary guest dancer!", labelFa: "به عنوان مهمان افتخاری در رقص والس باشکوه تالار شرکت کن!", descriptionFa: "پایان شماره ۱۷" },
    choiceB: { labelEn: "Help operate the giant golden spotlight from the balcony!", labelFa: "از بالای بالکن به نورپرداز کمک کن تا نور طلایی رو هدایت کنه!", descriptionFa: "پایان شماره ۱۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Leo slipped the sunglasses on for three seconds while Jack Sterling knelt beside him, making funny faces. Leo clicked the camera button on Uncle Sam's phone. The photo went viral on the studio's official page with two million likes by dinner time!",
    keywords: [
      { word: "viral", meaningFa: "وایرال و به سرعت پربازدید شده", phonetic: "/ˈvaɪrəl/" },
      { word: "likes", meaningFa: "پسندیدن‌ها در شبکه‌های اجتماعی", phonetic: "/laɪks/" },
      { word: "faces", meaningFa: "شکلک‌های خنده‌دار درآوردن", phonetic: "/ˈfeɪsɪz/" },
      { word: "official", meaningFa: "رسمی و معتبر", phonetic: "/əˈfɪʃl/" },
    ],
    question: {
      promptEn: "How many likes did the funny selfie get by dinner time?",
      promptFa: "عکس سلفی خنده‌دار تا زمان شام چند لایک گرفت؟",
      options: ["Two million likes", "Ten likes", "Fifty likes"],
      correctIndex: 0,
      hintSnippet: "with two million likes by dinner time",
      clueFa: "عکس تا وقت شام دو میلیون لایک از سراسر دنیا گرفت!",
    },
    choiceA: { labelEn: "Create a fun youth detective show inspired by the viral photo!", labelFa: "یک سریال کارآگاهی نوجوانان با الهام از این عکس بسازید!", descriptionFa: "پایان شماره ۱۹" },
    choiceB: { labelEn: "Use your fame to raise money for the town animal shelter!", labelFa: "از شهرتت برای کمک به پناهگاه حیوانات شهر استفاده کن!", descriptionFa: "پایان شماره ۲۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Leo pinned the golden star badge proudly to his chest and marched onto the set. Director Bennett saluted: 'Welcome back, Chief Investigator Leo! With my glasses back, I want you to give the opening speech of the movie right into camera one!'",
    keywords: [
      { word: "saluted", meaningFa: "احترام نظامی گذاشت", phonetic: "/səˈluːtɪd/" },
      { word: "investigator", meaningFa: "بازرس و بازجو", phonetic: "/ɪnˈvestɪɡeɪtə/" },
      { word: "speech", meaningFa: "سخنرانی آغازین", phonetic: "/spiːtʃ/" },
      { word: "marched", meaningFa: "با گام‌های محکم راه رفت", phonetic: "/mɑːtʃt/" },
    ],
    question: {
      promptEn: "What did Director Bennett ask Leo to deliver?",
      promptFa: "کارگردان بنت از لئو خواست چه چیزی را اجرا کند؟",
      options: ["The opening speech of the movie right into camera one", "A plate of cookies", "A cup of tea"],
      correctIndex: 0,
      hintSnippet: "give the opening speech of the movie right into camera one",
      clueFa: "کارگردان از لئو خواست دیالوگ افتتاحیه فیلم رو مستقیم رو به دوربین یک بگه.",
    },
    choiceA: { labelEn: "Deliver the mystery speech with a charming British accent!", labelFa: "دیالوگ رمزآلود رو با لهجه جذاب و شیرین بریتانیایی بگو!", descriptionFa: "پایان شماره ۲۱" },
    choiceB: { labelEn: "Add a warm shout-out to Uncle Sam's delicious pies!", labelFa: "یک سلام گرم به پای‌های سیب خوشمزه دایی سام چاشنی دیالوگت کن!", descriptionFa: "پایان شماره ۲۲" },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Chloe tailored a custom navy jacket with silver buttons and secret hidden pockets for Leo. 'Every world-class detective needs a signature coat!' she declared. When Leo slipped it on, he looked so dashing that Jack Sterling asked who his fashion designer was.",
    keywords: [
      { word: "tailored", meaningFa: "اندازه دوخت و خیاطی کرد", phonetic: "/ˈteɪləd/" },
      { word: "signature", meaningFa: "امضای شخصی / سبک اختصاصی", phonetic: "/ˈsɪɡnətʃə/" },
      { word: "dashing", meaningFa: "خوش‌پوش و شیک و برازنده", phonetic: "/ˈdæʃɪŋ/" },
      { word: "buttons", meaningFa: "دکمه‌های فلزی براق", phonetic: "/ˈbʌtnz/" },
    ],
    question: {
      promptEn: "What kind of jacket did Chloe tailor for Leo?",
      promptFa: "کلوئی چه مدل کتی برای لئو طراحی و دوخت؟",
      options: ["A navy jacket with silver buttons and hidden pockets", "A pink plastic raincoat", "A heavy wool winter sweater"],
      correctIndex: 0,
      hintSnippet: "tailored a custom navy jacket with silver buttons and secret hidden pockets",
      clueFa: "یک کت سرمه‌ای شیک با دکمه‌های نقره‌ای و جیب‌های مخفی دوخت.",
    },
    choiceA: { labelEn: "Wear the jacket to the London film festival premiere!", labelFa: "کت رو در مراسم فرش قرمز فستیوال فیلم لندن به تن کن!", descriptionFa: "پایان شماره ۲۳" },
    choiceB: { labelEn: "Keep the secret pockets stocked with tasty snacks for film shoots!", labelFa: "جیب‌های مخفیش رو همیشه پر از خوراکی‌های خوشمزه برای فیلم‌برداری نگه دار!", descriptionFa: "پایان شماره ۲۴" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "With Captain Feather the green parrot perched regally on Leo's left shoulder, Leo walked down the red carpet toward Director Bennett. The whole studio crew fell silent, then erupted into laughter and applause. The parrot squawked: 'Movie time! Movie time!'",
    keywords: [
      { word: "regally", meaningFa: "باشکوه و شاهانه", phonetic: "/ˈriːɡəli/" },
      { word: "erupted", meaningFa: "منفجر شد از شادی و همهمه", phonetic: "/ɪˈrʌptɪd/" },
      { word: "squawked", meaningFa: "با صدای بلند غارغار پرنده صدا کرد", phonetic: "/skwɔːkt/" },
      { word: "silent", meaningFa: "ساکت و آرام", phonetic: "/ˈsaɪlənt/" },
    ],
    question: {
      promptEn: "What did the parrot squawk on Leo's shoulder?",
      promptFa: "طوطی روی شانه لئو چه جمله‌ای را فریاد زد؟",
      options: ["Movie time! Movie time!", "Goodnight everybody!", "Give me crackers!"],
      correctIndex: 0,
      hintSnippet: "The parrot squawked: 'Movie time! Movie time!'",
      clueFa: "طوطی با صدای بامزه گفت: وقت فیلمه! وقت فیلمه!",
    },
    choiceA: { labelEn: "Make Captain Feather your permanent co-star in the pirate movie!", labelFa: "کاپیتان فِدِر رو هم‌بازی دائمی خودت در فیلم دزدان دریایی کن!", descriptionFa: "پایان شماره ۲۵" },
    choiceB: { labelEn: "Build a golden perch inside the cafe for Captain Feather!", labelFa: "یک نشیمنگاه طلایی برای طوطی داخل کافه دایی بسازید!", descriptionFa: "پایان شماره ۲۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Leo spent twenty minutes patiently training the clever parrot. When Director Bennett walked onto the stage, the parrot leaned near the microphone and announced clearly: 'That is a wrap, folks!' The entire studio clapped, and Bennett promoted Leo to Animal Trainer Apprentice.",
    keywords: [
      { word: "patiently", meaningFa: "با صبوری و حوصله", phonetic: "/ˈpeɪʃntli/" },
      { word: "training", meaningFa: "آموزش دادن و تربیت کردن", phonetic: "/ˈtreɪnɪŋ/" },
      { word: "apprentice", meaningFa: "دستیار کارآموز", phonetic: "/əˈprentɪs/" },
      { word: "promoted", meaningFa: "ارتقای درجه داد", phonetic: "/prəˈməʊtɪd/" },
    ],
    question: {
      promptEn: "What job did Director Bennett give Leo after training the parrot?",
      promptFa: "کارگردان بنت بعد از آموزش طوطی چه سمتی به لئو داد؟",
      options: ["Animal Trainer Apprentice", "Studio cleaner", "Bus driver"],
      correctIndex: 0,
      hintSnippet: "promoted Leo to Animal Trainer Apprentice",
      clueFa: "کارگردان لئو را به عنوان کارآموز تربیت حیوانات استودیو انتخاب کرد.",
    },
    choiceA: { labelEn: "Train a pair of clever dolphins for an underwater adventure film!", labelFa: "دو دلفین باهوش رو برای فیلم ماجراجویی زیر آب آموزش بده!", descriptionFa: "پایان شماره ۲۷" },
    choiceB: { labelEn: "Open a cozy animal rescue sanctuary next to the film lot!", labelFa: "یک پناهگاه حیوانات مهربان کنار شهرک سینمایی تأسیس کن!", descriptionFa: "پایان شماره ۲۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Leo pressed the red talk button on the walkie-talkie: 'Director Bennett, this is Detective Leo! The golden sunglasses are secure with Jack Sterling at Stage 4!' Bennett's voice crackled back with enormous excitement: 'Copy that, Detective! The whole studio owes you a giant ice cream sundae!'",
    keywords: [
      { word: "crackled", meaningFa: "با خش‌خش رادیویی صدا آمد", phonetic: "/ˈkrækld/" },
      { word: "enormous", meaningFa: "بسیار زیاد و عظیم", phonetic: "/ɪˈnɔːməs/" },
      { word: "sundae", meaningFa: "بستنی میوه‌ای و خامه‌ای مخصوص", phonetic: "/ˈsʌndeɪ/" },
      { word: "owes", meaningFa: "بدهکار است / مدیون است", phonetic: "/əʊz/" },
    ],
    question: {
      promptEn: "What treat did Director Bennett promise Leo over the walkie-talkie?",
      promptFa: "کارگردان بنت پشت بیسیم چه خوراکی خوشمزه‌ای به لئو قول داد؟",
      options: ["A giant ice cream sundae", "A bag of dry crackers", "A sour lemon"],
      correctIndex: 0,
      hintSnippet: "The whole studio owes you a giant ice cream sundae",
      clueFa: "کارگردان قول یک ظرف بزرگ بستنی سانده میوه‌ای رو داد.",
    },
    choiceA: { labelEn: "Share a three-story ice cream bowl with Jack and Uncle Sam!", labelFa: "یک ظرف بستنی سه طبقه رو با جک و دایی سام شریک شو!", descriptionFa: "پایان شماره ۲۹" },
    choiceB: { labelEn: "Add 'Detective Sundae' to Uncle Sam's official cafe menu!", labelFa: "بستنی مخصوص کارآگاه رو به منوی رسمی کافه دایی اضافه کن!", descriptionFa: "پایان شماره ۳۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Jack Sterling took a gold pen and signed the cafe sandwich menu: 'To my favorite detective and best lunch partner, Leo! Love, Jack Sterling.' Uncle Sam laminated the signed menu right away and hung it above the cafe entrance, where tourists lined up around the block.",
    keywords: [
      { word: "laminated", meaningFa: "پرس پلاستیکی و براق کرد", phonetic: "/ˈlæmɪneɪtɪd/" },
      { word: "partner", meaningFa: "یار و همکار", phonetic: "/ˈpɑːtnə/" },
      { word: "tourists", meaningFa: "گردشگران و مسافران", phonetic: "/ˈtʊərɪsts/" },
      { word: "entrance", meaningFa: "ورودی ساختمان", phonetic: "/ˈentrəns/" },
    ],
    question: {
      promptEn: "What did Uncle Sam do with the signed menu?",
      promptFa: "دایی سام با منوی امضاشده چه کار کرد؟",
      options: ["Laminated it and hung it above the cafe entrance", "Threw it in the recycling bin", "Gave it to a passing bird"],
      correctIndex: 0,
      hintSnippet: "Uncle Sam laminated the signed menu right away and hung it above the cafe entrance",
      clueFa: "دایی سام اون رو لمینت کرد و بالای درب ورودی کافه زد.",
    },
    choiceA: { labelEn: "Name the cafe 'The Hollywood Detective Bistro'!", labelFa: "اسم کافه رو بذار 'کافه کارآگاه هالیوود'!", descriptionFa: "پایان شماره ۳۱" },
    choiceB: { labelEn: "Film a commercial with Jack Sterling inside the cafe!", labelFa: "یک تیزر تبلیغاتی تلویزیونی همراه با جک داخل کافه ضبط کنید!", descriptionFa: "پایان شماره ۳۲" },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Hollywood Stunt Champion", titleFa: "قهرمان بدل‌کاری هالیوود", badgeCategory: "legendary", badgeIcon: "🏎️", badgeNameFa: "پایان ستاره رانندگی", climaxEn: "Leo spins the red convertible safely onto the movie marks, earning a standing ovation from the film crew.", climaxFa: "لئو با چرخش استادانه ماشین روی نقطه علامت‌گذاری متوقف شد و همه عوامل صحنه با تحسین براش کف زدند.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "Family Cameo in the Blockbuster", titleFa: "نقش کوتاه خانوادگی در فیلم", badgeCategory: "heroic", badgeIcon: "🎬", badgeNameFa: "پایان پیوند خانوادگی", climaxEn: "Uncle Sam waves on camera, making this summer blockbuster a cherished family memory forever.", climaxFa: "دست تکان دادن دایی سام در فیلم پرفروش سال ماندگار شد و به زیباترین خاطره خانوادگی تبدیل گشت.", xpReward: 175 },
  { pathCode: "AAABA", titleEn: "The Pride of the Studio Cafe", titleFa: "افتخار کافه استودیو", badgeCategory: "scholar", badgeIcon: "☕", badgeNameFa: "پایان افتخار محلی", climaxEn: "The cafe becomes a favorite hangout for actors, who all come to taste Detective Leo's famous sandwiches.", climaxFa: "کافه دایی سام پاتوق بازیگران سرشناس شد که همه برای چشیدن ساندویچ‌های کارآگاه لئو صف می‌کشیدند.", xpReward: 165 },
  { pathCode: "AAABB", titleEn: "The Golden Junior Actor Card", titleFa: "کارت طلایی بازیگر جوان", badgeCategory: "secret", badgeIcon: "💳", badgeNameFa: "پایان ستاره آینده", climaxEn: "Leo's golden card opens the studio gates whenever he wants to visit movie sets on weekends.", climaxFa: "کارت زرین بازیگری به لئو اجازه داد هر آخر هفته آزادانه به پشت صحنه فیلم‌ها سر بزند.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Chart-Topping Detective Song", titleFa: "ترانه شماره یک جداول موسیقی", badgeCategory: "legendary", badgeIcon: "🎵", badgeNameFa: "پایان پاپ استار", climaxEn: "The sandwich song hits number one on radio charts, with children singing it in schoolyards everywhere.", climaxFa: "ترانه شاد ساندویچ به رتبه اول رادیو رسید و همه بچه‌ها در حیاط مدرسه‌ها با ذوق آن را هم‌خوانی می‌کردند.", xpReward: 200 },
  { pathCode: "AABAB", titleEn: "Morning Television Stars", titleFa: "ستاره‌های برنامه صبحگاهی", badgeCategory: "funny", badgeIcon: "📺", badgeNameFa: "پایان تلویزیونی", climaxEn: "Leo and Jack make the morning show hosts laugh with their cheerful harmonies and funny detective props.", climaxFa: "لئو و جک در برنامه زنده صبحگاهی دل میلیون‌ها بیننده را با ترانه خنده‌دارشان شاد کردند.", xpReward: 160 },
  { pathCode: "AABBA", titleEn: "The Rhythmic Drum Prodigy", titleFa: "نابغه ریتم و درامز", badgeCategory: "scholar", badgeIcon: "🥁", badgeNameFa: "پایان نوازنده بااستعداد", climaxEn: "The studio music director invites Leo to play percussion on their next big animated adventure movie.", climaxFa: "آهنگساز برجسته فیلم از لئو خواست در انیمیشن بعدی استودیو قطعات ریتمیک طبل بنوازد.", xpReward: 180 },
  { pathCode: "AABBB", titleEn: "The Lucky Yellow Pencils", titleFa: "مدادهای زرین خوش‌شانسی", badgeCategory: "secret", badgeIcon: "✏️", badgeNameFa: "پایان یادگاری ماندگار", climaxEn: "Leo uses the two pencils to write his very first movie script, which wins the school film festival.", climaxFa: "لئو با آن دو مداد اولین فیلم‌نامه زندگی‌اش را نوشت که برنده فستیوال فیلم مدرسه شد.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Bedroom Wall of Fame", titleFa: "دیوار خاطرات طلایی اتاق", badgeCategory: "heroic", badgeIcon: "🖼️", badgeNameFa: "پایان گرم و صمیمی", climaxEn: "The framed photo with Jack Sterling and Barnaby shines above Leo's study desk, inspiring him daily.", climaxFa: "عکس پرخاطره کنار جک استرلینگ و بارنابی بالای میز تحریر لئو جا گرفت و الهام‌بخش هر روز او شد.", xpReward: 170 },
  { pathCode: "ABAAB", titleEn: "Front Page Town Hero", titleFa: "تیتر اول روزنامه شهر", badgeCategory: "legendary", badgeIcon: "📰", badgeNameFa: "پایان قهرمان شهر", climaxEn: "The headline reads 'Local Boy and Golden Retriever Save Hollywood Blockbuster!' with smiling photos.", climaxFa: "تیتر یک روزنامه نوشت: پسر نوجوان محله و سگ وفادار فیلم پرهزینه هالیوود را نجات دادند!", xpReward: 195 },
  { pathCode: "ABABA", titleEn: "Red Carpet Best Friends", titleFa: "بهترین رفقای فرش قرمز", badgeCategory: "funny", badgeIcon: "🐶", badgeNameFa: "پایان خنده‌دار و ناز", climaxEn: "Barnaby wears a tiny red bow tie as he walks the red carpet alongside Leo to the flashes of cameras.", climaxFa: "بارنابی با پاپیون قرمزش در کنار لئو روی فرش قرمز قدم زد و توجه تمام عکاسان را جلب کرد.", xpReward: 185 },
  { pathCode: "ABABB", titleEn: "The Neighborhood Backyard Cinema", titleFa: "سینمای تابستانی حیاط خانه", badgeCategory: "explorer", badgeIcon: "🍿", badgeNameFa: "پایان دوستی و صمیمیت", climaxEn: "Neighbors bring blankets and popcorn to watch the finished film on a huge white sheet hung between apple trees.", climaxFa: "همسایه‌ها با پتو و ذرت بوداده آمدند و فیلم را روی پرده سفید میان درختان سیب تماشا کردند.", xpReward: 180 },
  { pathCode: "ABBAA", titleEn: "The Youngest Film Director", titleFa: "جوان‌ترین کارگردان صحنه", badgeCategory: "legendary", badgeIcon: "🎥", badgeNameFa: "پایان افتخار کارگردانی", climaxEn: "Leo's creative river scene becomes the most exciting action highlight of the entire movie trailer.", climaxFa: "صحنه خلاقانه رودخانه با کارگردانی لئو به هیجان‌انگیزترین بخش تیزر تبلیغاتی فیلم تبدیل شد.", xpReward: 200 },
  { pathCode: "ABBAB", titleEn: "The Milkshake Celebration", titleFa: "جشن میلک‌شیک عوامل صحنه", badgeCategory: "funny", badgeIcon: "🥤", badgeNameFa: "پایان شیرین و شاد", climaxEn: "Sixty strawberry and chocolate milkshakes are shared by the crew, toasting to hard work and friendship.", climaxFa: "شصت لیوان میلک‌شیک توت‌فرنگی و شکلاتی بین عوامل پخش شد و همه به سلامتی دوستی جشن گرفتند.", xpReward: 165 },
  { pathCode: "ABBBA", titleEn: "Flying on the Green Screen", titleFa: "پرواز بر فراز پرده سبز", badgeCategory: "explorer", badgeIcon: "🦅", badgeNameFa: "پایان ماجراجویانه", climaxEn: "Every classmate flies through CGI clouds on the monitors, experiencing the wonder of cinema magic.", climaxFa: "تمام همکلاسی‌های لئو میان ابرهای شبیه‌سازی‌شده پرواز کردند و شگفتی جادوی سینما را لمس کردند.", xpReward: 180 },
  { pathCode: "ABBBB", titleEn: "School Assembly Hero Medal", titleFa: "مدال افتخار صف صبحگاه", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان محبوبیت در مدرسه", climaxEn: "The school principal awards Leo the Golden Star Medal for bringing real Hollywood magic to his friends.", climaxFa: "مدیر مدرسه مدال ستاره زرین را به خاطر آوردن جادوی سینما برای هم‌مدرسه‌ای‌ها به لئو اهدا کرد.", xpReward: 190 },
  { pathCode: "BAAAA", titleEn: "The Grand Ballroom Waltz Star", titleFa: "ستاره رقص باشکوه والس", badgeCategory: "legendary", badgeIcon: "💃", badgeNameFa: "پایان درخشان و رمانتیک", climaxEn: "Leo dances in the lavish ballroom scene, receiving warm praise from top international movie critics.", climaxFa: "لئو در صحنه مجلل تالار با وقار رقصید و منتقدان سرشناس سینما اجرای طبیعی او را تحسین کردند.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "Master of the Golden Spotlight", titleFa: "استاد نورپردازی طلایی", badgeCategory: "scholar", badgeIcon: "💡", badgeNameFa: "پایان تسلط فنی صحنه", climaxEn: "The lighting crew teaches Leo how to direct giant lamps, illuminating the grand finale in warm gold.", climaxFa: "تیم فنی به لئو یاد دادند چطور نورها را تنظیم کند تا صحنه پایانی با درخشش طلایی جاودانه شود.", xpReward: 175 },
  { pathCode: "BAABA", titleEn: "The Mystery Kids Television Series", titleFa: "سریال پربیننده بچه‌های کارآگاه", badgeCategory: "legendary", badgeIcon: "📺", badgeNameFa: "پایان ستاره تلویزیون", climaxEn: "A national network signs Leo for a six-episode detective series where he solves hilarious studio riddles.", climaxFa: "شبکه معتبر تلویزیونی قراردادی شش قسمتی با لئو برای حل معماهای خنده‌دار امضا کرد.", xpReward: 200 },
  { pathCode: "BAABB", titleEn: "Champion of the Animal Shelter", titleFa: "حامی مهربان پناهگاه حیوانات", badgeCategory: "heroic", badgeIcon: "🐾", badgeNameFa: "پایان سخاوتمندانه", climaxEn: "Leo's viral photo raises thousands of dollars to buy cozy warm beds and toys for rescued dogs.", climaxFa: "عکس پربازدید لئو هزاران دلار برای خرید تخت‌خواب‌های گرم و اسباب‌بازی برای حیوانات پناهگاه جمع کرد.", xpReward: 185 },
  { pathCode: "BABAA", titleEn: "The Dapper British Detective", titleFa: "کارآگاه شیک‌پوش با لهجه لندنی", badgeCategory: "scholar", badgeIcon: "🎩", badgeNameFa: "پایان بازیگری درخشان", climaxEn: "Leo's funny British accent charms moviegoers in cinemas from New York to London and Sydney.", climaxFa: "لهجه بانمک لئو تماشاگران سینما را از نیویورک تا لندن و سیدنی مجذوب خود کرد.", xpReward: 190 },
  { pathCode: "BABAB", titleEn: "The Famous Apple Pie Cameo", titleFa: "شهرت جهانی پای سیب دایی", badgeCategory: "funny", badgeIcon: "🥧", badgeNameFa: "پایان خوشمزه و طنز", climaxEn: "Uncle Sam's warm apple pies become famous worldwide, with celebrities ordering boxes every week.", climaxFa: "پای‌های سیب دایی سام در دنیا معروف شدند و سلبریتی‌ها هر هفته جعبه‌جعبه سفارش می‌دادند.", xpReward: 170 },
  { pathCode: "BABBA", titleEn: "London Film Premiere Royalty", titleFa: "ستاره فرش قرمز لندن", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان شیک‌پوش‌ترین", climaxEn: "Wearing his custom navy coat, Leo walks with Jack through cheering fans in London's Leicester Square.", climaxFa: "لئو با کت شیک سرمه‌ای‌اش در میدان لستر لندن در میان تشویق هزاران هوادار قدم زد.", xpReward: 200 },
  { pathCode: "BABBB", titleEn: "The Secret Snack Hero", titleFa: "قهرمان خوراکی‌های مخفی", badgeCategory: "funny", badgeIcon: "🍫", badgeNameFa: "پایان پرانرژی و شوخ", climaxEn: "Whenever actors get hungry between takes, Leo pulls fresh warm cookies from his secret jacket pockets.", climaxFa: "هر وقت بازیگران بین برداشت‌ها گرسنه می‌شدند، لئو از جیب‌های مخفی کتش کلوچه گرم بیرون می‌آورد.", xpReward: 165 },
  { pathCode: "BBAAA", titleEn: "The Pirate and His Feathered First Mate", titleFa: "دزد دریایی و دستیار پردار", badgeCategory: "explorer", badgeIcon: "🦜", badgeNameFa: "پایان ماجراجویانه خنده‌دار", climaxEn: "Captain Feather perches proudly on Leo's hat in every sea adventure movie, stealing every single scene.", climaxFa: "کاپیتان فدر در تمام صحنه‌های ماجراجویی دریایی روی کلاه لئو نشست و خنده را به سینما آورد.", xpReward: 185 },
  { pathCode: "BBAAB", titleEn: "The Cafe's Golden Parrot Perch", titleFa: "نشیمنگاه طلایی طوطی در کافه", badgeCategory: "scholar", badgeIcon: "🍎", badgeNameFa: "پایان دلنشین و آرام", climaxEn: "Captain Feather greets cafe customers every morning with a cheerful 'Fresh sandwich, please!'", climaxFa: "طوطی هر روز صبح در کافه با جمله بامزه 'ساندویچ تازه لطفاً!' به مشتریان خوش‌آمد می‌گفت.", xpReward: 175 },
  { pathCode: "BBABA", titleEn: "The Dolphin Film Expedition", titleFa: "سفر اکتشافی دلفین‌های زیر آب", badgeCategory: "explorer", badgeIcon: "🐬", badgeNameFa: "پایان هیجان‌انگیز اقیانوسی", climaxEn: "Leo works with marine biologists to film dolphins leaping gracefully through azure tropical waves.", climaxFa: "لئو در کنار زیست‌شناسان صحنه‌های جهش باشکوه دلفین‌ها را در امواج نیلگون اقیانوس ثبت کرد.", xpReward: 190 },
  { pathCode: "BBABB", titleEn: "The Silver Screen Animal Haven", titleFa: "واحه مهربانی حیوانات هالیوود", badgeCategory: "heroic", badgeIcon: "🏡", badgeNameFa: "پایان فداکارانه", climaxEn: "The sanctuary provides loving homes and Hollywood training for dozens of abandoned animals.", climaxFa: "پناهگاه مهربانی برای ده‌ها حیوان بی‌پناه خانه امن و آموزش‌های محبت‌آمیز فراهم ساخت.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "The Giant Three-Story Sundae Party", titleFa: "جشن بستنی غول‌پیکر سه طبقه", badgeCategory: "funny", badgeIcon: "🍨", badgeNameFa: "پایان شیرین و خاطره‌ساز", climaxEn: "Jack, Leo, and Uncle Sam dig into mountains of whipped cream and fudge, laughing until nightfall.", climaxFa: "جک، لئو و دایی سام تا پاسی از شب بستنی‌های خامه‌ای و شکلاتی خوردند و از ته دل خندیدند.", xpReward: 170 },
  { pathCode: "BBBAB", titleEn: "The Detective Sundae Tradition", titleFa: "رسم همیشگی بستنی کارآگاهی", badgeCategory: "scholar", badgeIcon: "🍒", badgeNameFa: "پایان محبوبیت کافه", climaxEn: "Kids across town flock to the cafe to order the Detective Sundae, complete with chocolate magnifying glasses.", climaxFa: "بچه‌های شهر برای سفارش بستنی کارآگاهی با ذره‌بین‌های شکلاتی جلو کافه صف کشیدند.", xpReward: 180 },
  { pathCode: "BBBBA", titleEn: "The Hollywood Detective Bistro", titleFa: "کافه کارآگاهان هالیوود", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان تجاری پرافتخار", climaxEn: "The cafe becomes the most famous themed eatery in the film district, full of movie props and warmth.", climaxFa: "کافه به مشهورترین رستوران تم‌دار منطقه سینمایی با انبوهی از وسایل صحنه و صمیمیت بدل شد.", xpReward: 200 },
  { pathCode: "BBBBB", titleEn: "The Blockbuster Cafe Commercial", titleFa: "تیزر تلویزیونی طلایی کافه", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان نهایی افتخارآمیز", climaxEn: "Jack Sterling winks at the camera inside Uncle Sam's cafe: 'For real movie magic, trust Detective Leo!'", climaxFa: "جک استرلینگ با چشمک به دوربین گفت: برای جادوی واقعی سینما، به کارآگاه لئو و ساندویچ‌های دایی اعتماد کنید!", xpReward: 200 },
];

export const story6CelebrityEncounter: AdventureStory = buildAdventureStory({
  id: "a2-celebrity-encounter",
  storyIndex: 6,
  cefr: "A2",
  titleEn: "The Accidental Movie Star",
  titleFa: "ماجرای تصادفی با ستاره سینما",
  genre: "celebrity",
  genreLabelFa: "🌟 بازیگران و سلبریتی‌ها",
  genreIcon: "🌟",
  synopsisEn:
    "When young Leo delivers lunch to a busy movie set in town, he gets mistaken for a background actor by a famous movie star! Will he shine under the bright studio lights or help solve a missing costume mystery across 32 exciting endings?",
  synopsisFa:
    "وقتی لئو برای تحویل ناهار به لوکیشن فیلم‌برداری در شهر می‌ره، دست‌اندرکاران اشتباهی اون رو به عنوان بازیگر نقش مکمل انتخاب می‌کنن و روبه‌روی یک سوپراستار معروف قرار می‌گیره! آیا تو صحنه می‌درخشه یا راز وسایل گم‌شده رو کشف می‌کنه؟ ۳۲ پایان پر از هیجان و خنده منتظرته!",
  coverImage: "/images/skills/reading/a2-celebrity-encounter.webp",
  nodes,
  endings,
});
