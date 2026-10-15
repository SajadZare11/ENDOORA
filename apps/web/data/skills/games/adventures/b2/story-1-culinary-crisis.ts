import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1 (B2 - Adult): The Bistro Opening Crisis (ماجرای خنده‌دار افتتاحیه رستوران سرآشپز)
// Genre: Humor & Everyday Life (طنز و روزمره)
// CEFR: B2 (Third/mixed conditionals, passive voice, deduction modals, adult workplace satire)
// Characters: Chef Julian, General Manager Claire, Food Critic Laurent, Sous-Chef Marco
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Chef Julian had invested his life savings into opening 'L'Aura', an ambitious contemporary bistro in the city center. Tonight was opening night, and every table was booked three weeks in advance. However, at seven-fifteen, disaster struck the open kitchen: Julian discovered that his new apprentice had accidentally swapped the imported Persian saffron with dried hibiscus powder, turning his signature savory roast sauce into an alarming, fluorescent magenta reduction. Across the dining room, Monsieur Laurent, the city's most feared culinary critic, had just been seated at table nine.",
    keywords: [
      { word: "contemporary", meaningFa: "معاصر، مدرن و امروزی", phonetic: "/kənˈtemprəri/" },
      { word: "apprentice", meaningFa: "کارآموز تازه‌کار در آشپزخانه", phonetic: "/əˈprentɪs/" },
      { word: "hibiscus", meaningFa: "گل چای ترش و زرشکی‌رنگ", phonetic: "/hɪˈbɪskəs/" },
      { word: "reduction", meaningFa: "سس غلیظ‌شده از جوشاندن آرام عصاره غذا", phonetic: "/rɪˈdʌkʃn/" },
    ],
    question: {
      promptEn: "What caused Chef Julian's signature sauce to turn bright magenta on opening night?",
      promptFa: "چه عاملی باعث شد سس مخصوص سرآشپز ژولین در شب افتتاحیه به رنگ سرخابی درآید؟",
      options: [
        "The apprentice accidentally swapped saffron with dried hibiscus powder",
        "A bottle of red wine shattered into the pot",
        "The kitchen stove overheated and burned the sugar",
      ],
      correctIndex: 0,
      hintSnippet: "had accidentally swapped the imported Persian saffron with dried hibiscus powder, turning his signature savory roast sauce into an alarming, fluorescent magenta reduction",
      clueFa: "خط ماقبل آخر رو بخون دوست من؛ کارآموز زعفران اصیل رو اشتباهاً با پودر چای ترش (هیبیسکوس) عوض کرده بود.",
    },
    choiceA: {
      labelEn: "Embrace the bold color and present it as an avant-garde fusion masterpiece!",
      labelFa: "رنگ خیره‌کننده رو بپذیر و اون رو به عنوان شاهکار مدرن و جسورانه آشپزی معرفی کن!",
      descriptionFa: "گاهی اشتباهات خلاقانه تبدیل به امضای ماندگار رستوران می‌شن.",
    },
    choiceB: {
      labelEn: "Quickly rework the flavor profile by balancing the tart acidity with honey and cracked pepper!",
      labelFa: "طعم ترش سس رو فوراً با عسل کوهی و فلفل سیاه آسیاب‌شده متعادل کن!",
      descriptionFa: "ترکیب ترش و شیرین با گوشت برشته هارمونی بی‌نظیری می‌سازه.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Claire, the elegant general manager, raised an eyebrow at the vibrant magenta sauce on the porcelain plate, but she didn't panic. 'Julian, in this town, confidence is everything,' she whispered. She glided over to table nine and announced the dish with flourish: 'Tonight, Chef Julian debuts an exclusive botanical reduction inspired by Parisian modern art.' Monsieur Laurent squinted through his tortoiseshell spectacles, noticeably intrigued by the brazen aesthetic.",
    keywords: [
      { word: "flourish", meaningFa: "آراستگی، اعتمادبه‌نفس و ژست نمایشی جذاب", phonetic: "/ˈflʌrɪʃ/" },
      { word: "exclusive", meaningFa: "منحصربه‌فرد، اختصاصی و لوکس", phonetic: "/ɪkˈskluːsɪv/" },
      { word: "spectacles", meaningFa: "عینک‌های شیک کلاسیک", phonetic: "/ˈspektəklz/" },
      { word: "brazen", meaningFa: "جسورانه، ساختارشکن و بی‌پروا", phonetic: "/ˈbreɪzn/" },
    ],
    question: {
      promptEn: "How did Claire present the unusual magenta sauce to the food critic?",
      promptFa: "کلر سس بنفش‌رنگ نامتعارف را چگونه به منتقد سخت‌گیر معرفی کرد؟",
      options: [
        "As an exclusive botanical reduction inspired by Parisian modern art",
        "As a clumsy cooking mistake made by an intern",
        "As an ordinary tomato ketchup",
      ],
      correctIndex: 0,
      hintSnippet: "announced the dish with flourish: 'Tonight, Chef Julian debuts an exclusive botanical reduction inspired by Parisian modern art'",
      clueFa: "خط سوم رو ببین عزیزم؛ با اعتمادبه‌نفس اون رو یک نوآوری گیاهی الهام‌گرفته از هنر پاریس نامید.",
    },
    choiceA: {
      labelEn: "Pair the dish with an aromatic sparkling elderflower white wine!",
      labelFa: "غذا رو با نوشیدنی گوارای گل‌سرخ و شاه‌بلوط معطر هماهنگ کن!",
      descriptionFa: "عطر نوشیدنی طعم‌های گیاهی سس رو به اوج می‌رسونه.",
    },
    choiceB: {
      labelEn: "Garnish the plate tableside with edible gold leaf and violet petals!",
      labelFa: "بشقاب غذا رو جلوی چشمان منتقد با ورق طلای خوراکی و گلبرگ بنفشه تزیین کن!",
      descriptionFa: "جلوه‌ای خیره‌کننده که تمام نگاه‌های سالن رو مجذوب می‌کنه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Julian tasted the reduction with a silver spoon, tasting sharp tartness from the dried petals. Thinking rapidly on his feet, he stirred in three tablespoons of aged mountain lavender honey and crushed Madagascar peppercorns. The mixture transformed into an intoxicating, glossy sweet-and-sour glaze with subtle floral notes. Sous-Chef Marco gasped with admiration as Julian glazed the roasted duck breast to golden perfection.",
    keywords: [
      { word: "reduction", meaningFa: "سس غلیظ‌شده روی حرارت آرام", phonetic: "/rɪˈdʌkʃn/" },
      { word: "intoxicating", meaningFa: "مست‌کننده و بسیار دلپذیر و اشتهاآور", phonetic: "/ɪnˈtɒksɪkeɪtɪŋ/" },
      { word: "subtle", meaningFa: "ظریف، نامحسوس و هنرمندانه", phonetic: "/ˈsʌtl/" },
      { word: "glazed", meaningFa: "لعاب‌کاری و روکش براق روی گوشت", phonetic: "/ɡleɪzd/" },
    ],
    question: {
      promptEn: "What ingredients did Julian stir in to balance the sharp hibiscus tartness?",
      promptFa: "ژولین چه موادی را برای ایجاد تعادل در ترشی تند سس اضافه کرد؟",
      options: [
        "Aged mountain lavender honey and crushed Madagascar peppercorns",
        "White vinegar and table salt",
        "Cold tap water and cornstarch",
      ],
      correctIndex: 0,
      hintSnippet: "stirred in three tablespoons of aged mountain lavender honey and crushed Madagascar peppercorns",
      clueFa: "خط دوم رو نگاه کن؛ عسل کوهی اسطوخودوس و فلفل سیاه معطر ماداگاسکار اضافه کرد.",
    },
    choiceA: {
      labelEn: "Serve the glazed duck alongside caramelized wild figs and rosemary potatoes!",
      labelFa: "اردک لعاب‌دار رو کنار انجیر کاراملی وحشی و سیب‌زمینی رزماری سرو کن!",
      descriptionFa: "ترکیب انجیر شیرین و گوشت گرم یک تجربه بی‌نظیر می‌سازه.",
    },
    choiceB: {
      labelEn: "Instruct the waitstaff to offer warm artisan brioche bread for dipping!",
      labelFa: "به گارسون‌ها بسپار نان داغ سنتی فرانسوی (بریوش) برای امتحان سس بیارن!",
      descriptionFa: "هیچ منتقدی نمی‌تونه در برابر نان کره‌ای تازه مقاومت کنه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Monsieur Laurent raised his crystal flute, tasting the chilled elderflower blend before cutting into the duck. The pairing worked with uncanny harmony: the crisp sparkling floral notes balanced the bold acidity of the hibiscus reduction flawlessly. The critic closed his eyes for five agonizing seconds, nodded twice in silent reverence, and scribbled an enthusiastic note on his black moleskine pad.",
    keywords: [
      { word: "uncanny", meaningFa: "فوق‌العاده، اعجاب‌انگیز و باورنکردنی", phonetic: "/ʌnˈkæni/" },
      { word: "reverence", meaningFa: "احترام و تکریم قلبی عمیق", phonetic: "/ˈrevərəns/" },
      { word: "agonizing", meaningFa: "طولانی، دلهره‌آور و پر از هیجان", phonetic: "/ˈæɡənaɪzɪŋ/" },
    ],
    question: {
      promptEn: "What did Monsieur Laurent do after tasting the dish with the sparkling elderflower pairing?",
      promptFa: "منتقد پس از چشیدن غذا همراه با نوشیدنی شکوفه چه کرد؟",
      options: [
        "Nodded twice in silent reverence and scribbled an enthusiastic note",
        "Spit his napkin into the glass",
        "Walked out of the restaurant in anger",
      ],
      correctIndex: 0,
      hintSnippet: "nodded twice in silent reverence, and scribbled an enthusiastic note on his black moleskine pad",
      clueFa: "خط آخر رو ببین؛ دو بار سرش رو با احترام تکان داد و یادداشتی مشتاقانه نوشت.",
    },
    choiceA: {
      labelEn: "Send out Julian's signature cardamom-infused chocolate soufflé for dessert!",
      labelFa: "سوفله شکلاتی دست‌ساز با طعم هل سبز رو به عنوان دسر بفرست!",
      descriptionFa: "پایانی گرم، لوکس و به یاد ماندنی برای ضیافت شام.",
    },
    choiceB: {
      labelEn: "Step out of the kitchen in your chef whites to introduce yourself to Laurent!",
      labelFa: "با روپوش سفید سرآشپز به سالن برو و با وقار با لوران گفتگو کن!",
      descriptionFa: "گفتگوی چهره به چهره احترام و صمیمیت عمیقی ایجاد می‌کنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Claire approached the table with silver tweezers, delicately resting three shimmering flakes of 24-karat gold leaf over the magenta glaze alongside fresh violet petals. Diners at neighboring tables gasped softly and pulled out their smartphones to record the visual spectacle. Monsieur Laurent took his fork, smiled faintly at the theatrical presentation, and tasted the first bite.",
    keywords: [
      { word: "tweezers", meaningFa: "پنس ظریف تزیین غذا در آشپزی مدرن", phonetic: "/ˈtwiːzəz/" },
      { word: "spectacle", meaningFa: "صحنه دیدنی و شگفت‌انگیز بصری", phonetic: "/ˈspektəkl/" },
      { word: "theatrical", meaningFa: "نمایشی، باشکوه و دراماتیک", phonetic: "/θiˈætrɪkl/" },
    ],
    question: {
      promptEn: "What did diners at neighboring tables do when Claire placed the gold leaf?",
      promptFa: "وقتی کلر ورق طلا را روی غذا گذاشت، مهمانان میزهای کناری چه کردند؟",
      options: [
        "Gasped softly and pulled out smartphones to record the spectacle",
        "Complained about the room lighting",
        "Asked for their checks immediately",
      ],
      correctIndex: 0,
      hintSnippet: "gasped softly and pulled out their smartphones to record the visual spectacle",
      clueFa: "خط سوم رو بخون دوست من؛ گوشی‌هاشون رو درآوردن تا از این صحنه باشکوه فیلم بگیرن.",
    },
    choiceA: {
      labelEn: "Encourage the room to applaud the artistry of modern culinary innovation!",
      labelFa: "فضای سالن رو به تشویق نوآوری و هنر آشپزی مدرن دعوت کن!",
      descriptionFa: "شور و هیجان سالن رو فرا می‌گیره.",
    },
    choiceB: {
      labelEn: "Present Laurent with a miniature silver spice cellar containing the raw hibiscus!",
      labelFa: "ظرف نقره‌ای کوچکی حاوی گل‌های خشک چای ترش به عنوان هدیه به لوران بده!",
      descriptionFa: "احترام به اصالت مواد اولیه نظر منتقدان باهوش رو جلب می‌کنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The combination of savory roast duck, sticky caramelized wild figs, and the floral pepper reduction proved to be a sensational triumph. Monsieur Laurent cut a second slice before finishing his first, an unprecedented occurrence for a man known for taking mere solitary mouthfuls. Whispers spread across the dining room that L'Aura had delivered a culinary revelation.",
    keywords: [
      { word: "sensational", meaningFa: "تکان‌دهنده، فوق‌العاده و چشمگیر", phonetic: "/senˈseɪʃənl/" },
      { word: "unprecedented", meaningFa: "بی‌سابقه در تاریخ", phonetic: "/ʌnˈpresɪdentɪd/" },
      { word: "revelation", meaningFa: "الهام و مکاشفه بزرگ هنری", phonetic: "/ˌrevəˈleɪʃn/" },
    ],
    question: {
      promptEn: "What unusual behavior did Monsieur Laurent exhibit while eating the duck?",
      promptFa: "منتقد معروف هنگام خوردن اردک چه رفتار نامعمولی نشان داد؟",
      options: [
        "Cut a second slice before finishing his first",
        "Asked for a hamburger instead",
        "Pushed the plate away untouched",
      ],
      correctIndex: 0,
      hintSnippet: "cut a second slice before finishing his first, an unprecedented occurrence",
      clueFa: "خط دوم رو ببین؛ قبل از تموم کردن لقمه اول، تکه دوم رو برید که نشانه شیفتگی‌اش بود.",
    },
    choiceA: {
      labelEn: "Feature the dish on the permanent menu as 'The Serendipity Duck'!",
      labelFa: "این غذا رو به عنوان غذای نمادین رستوران با نام «اردک بخت خوش» ثبت کن!",
      descriptionFa: "تبدیل یک بحران غیرمنتظره به مشهورترین غذای شهر.",
    },
    choiceB: {
      labelEn: "Compliment Laurent with a bespoke palate-cleansing pomegranate sorbet!",
      labelFa: "سوربه انار و گلاب خنک به عنوان پیش‌دسر برای تمیز کردن ذائقه براش بفرست!",
      descriptionFa: "ظرافت سنتی و مدرن در پذیرایی از یک استاد طعم‌شناسی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The warm, crusty brioche rolls arrived in a woven linen basket, steam rising gently as Monsieur Laurent broke one open with his fingers. He wiped the golden crumb through the remaining glossy honey-hibiscus sauce on his plate, leaving the porcelain spotless. Claire caught Julian's eye through the kitchen pass, giving a triumphant, discreet thumbs-up.",
    keywords: [
      { word: "woven", meaningFa: "بافته‌شده از کتان سنتی", phonetic: "/ˈwəʊvn/" },
      { word: "spotless", meaningFa: "کاملاً پاکیزه و تمیز و بدون لکه", phonetic: "/ˈspɒtləs/" },
      { word: "discreet", meaningFa: "محتاطانه، شیک و بدون جلب توجه غیرضروری", phonetic: "/dɪˈskriːt/" },
    ],
    question: {
      promptEn: "How clean was Monsieur Laurent's porcelain plate after dipping his brioche?",
      promptFa: "بشقاب چینی لوران بعد از تمیز کردن با نان بریوش چقدر تمیز شد؟",
      options: [
        "Left the porcelain spotless",
        "Completely covered in leftover meat",
        "Cracked in half from heat",
      ],
      correctIndex: 0,
      hintSnippet: "leaving the porcelain spotless",
      clueFa: "خط ماقبل آخر رو بخون؛ بشقاب چینی انقدر تمیز شد که ذره‌ای سس باقی نماند.",
    },
    choiceA: {
      labelEn: "Send a glass of vintage Sauternes dessert wine to celebrate the clean plate!",
      labelFa: "یک گیلاس نوشیدنی کهن ساترن برای ادای احترام به سلیقه نابش بفرست!",
      descriptionFa: "پایانی اشرافی که دل هر منتقدی رو نرم می‌کنه.",
    },
    choiceB: {
      labelEn: "Personally thank the bread baker at the bakery station with applause!",
      labelFa: "نانوای زحمتکش ایستگاه نان رو در آشپزخانه تشویق کن!",
      descriptionFa: "احترام به تک‌تک اعضای تیم آشپزخانه رمز موفقیت پایداره.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "The molten cardamom chocolate soufflé rose six inches above its ramekin, dusted in fine powdered sugar that smelled of warm cinnamon and orange zest. Monsieur Laurent dipped his silver spoon into the steaming center, sighing in sheer gastronomic bliss as the velvety chocolate coated his palate.",
    keywords: [
      { word: "ramekin", meaningFa: "کاسه کوچک سرامیکی مخصوص پخت سوفله", phonetic: "/ˈræmɪkɪn/" },
      { word: "gastronomic", meaningFa: "مرتبط با هنر آشپزی و خوراک‌شناسی سطح بالا", phonetic: "/ˌɡæstrəˈnɒmɪk/" },
      { word: "velvety", meaningFa: "مخملی و لطیف", phonetic: "/ˈvelvəti/" },
    ],
    question: {
      promptEn: "What scent did the powdered sugar on the chocolate soufflé carry?",
      promptFa: "پودر شکر روی سوفله شکلات چه عطری به همراه داشت؟",
      options: [
        "Warm cinnamon and orange zest",
        "Burning smoke",
        "Sour lemon vinegar",
      ],
      correctIndex: 0,
      hintSnippet: "dusted in fine powdered sugar that smelled of warm cinnamon and orange zest",
      clueFa: "خط اول رو بخون؛ بوی دارچین گرم و پوست رنده‌شده پرتقال تازه.",
    },
    choiceA: {
      labelEn: "Pour a drizzle of warm espresso cream directly into the soufflé center!",
      labelFa: "سس کرم اسپرسوی داغ رو مستقیماً وسط سوفله سرازیر کن!",
      descriptionFa: "طعم تلخ قهوه و شکلات شیرین ترکیبی بهشتی می‌سازه.",
    },
    choiceB: {
      labelEn: "Gently inquire if the evening met Monsieur Laurent's rigorous standards!",
      labelFa: "با فروتنی بپرس آیا این شب استانداردهای سخت‌گیرانه لوران رو برآورده کرد؟",
      descriptionFa: "یک گفتگوی حرفه‌ای میان دو استاد خوراک‌شناسی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Julian stepped into the warm dining room, wiping his hands on a clean linen apron. When Laurent saw the young chef, he stood up from his table—an action that stunned the entire dining room into absolute silence. The formidable critic extended his hand with a broad, genuine smile: 'Young man, you possess the rarest culinary gift: true artistic audacity.'",
    keywords: [
      { word: "formidable", meaningFa: "ابهت‌دار، سرسخت و مقتدر", phonetic: "/ˈfɔːmɪdəbl/" },
      { word: "audacity", meaningFa: "جسارت، دلیری و شجاعت نوآوری", phonetic: "/ɔːˈdæsəti/" },
      { word: "stunned", meaningFa: "مبهوت و شگفت‌زده کرد", phonetic: "/stʌnd/" },
    ],
    question: {
      promptEn: "What rare culinary gift did Monsieur Laurent say Julian possessed?",
      promptFa: "منتقد سخت‌گیر چه استعداد نادری را به ژولین نسبت داد؟",
      options: [
        "True artistic audacity",
        "Fast vegetable chopping skills",
        "The ability to wash dishes quickly",
      ],
      correctIndex: 0,
      hintSnippet: "The formidable critic extended his hand with a broad, genuine smile: 'Young man, you possess the rarest culinary gift: true artistic audacity.'",
      clueFa: "خط آخر رو نگاه کن؛ گفت تو شجاعت و جسارت واقعی یک هنرمند رو داری.",
    },
    choiceA: {
      labelEn: "Invite Monsieur Laurent to sign the restaurant's first guestbook page!",
      labelFa: "از لوران بخواه صفحه اول دفتر یادبود رستوران رو امضا کنه!",
      descriptionFa: "امضایی که به عنوان برکت رستوران قاب خواهد شد.",
    },
    choiceB: {
      labelEn: "Share a champagne toast with your entire front-of-house and kitchen team!",
      labelFa: "همراه با تمام کارکنان سالن و آشپزخانه گیلاس پیروزی رو بنوشید!",
      descriptionFa: "قدردانی از زحمات بی‌پایان تیمی که در بحران درخشیدند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The entire dining room broke into spontaneous, warm applause. Customers raised their glasses to Julian and Claire, charmed by the electric energy of opening night. Smartphone notifications were already chiming: diners had tagged L'Aura on international foodie channels, with photos of the gold-garnished magenta duck racking up thousands of likes within minutes.",
    keywords: [
      { word: "spontaneous", meaningFa: "خودجوش، بدون برنامه‌ریزی قبلی و قلبی", phonetic: "/spɒnˈteɪniəs/" },
      { word: "notifications", meaningFa: "اعلان‌ها و هشدارهای شبکه‌های اجتماعی", phonetic: "/ˌnəʊtɪfɪˈkeɪʃnz/" },
      { word: "foodie", meaningFa: "علاقه‌مند و متخصص در چشیدن غذاهای خاص", phonetic: "/ˈfuːdi/" },
    ],
    question: {
      promptEn: "What were diners already doing on social media during the applause?",
      promptFa: "مشتریان هنگام دست زدن چه کاری در شبکه‌های اجتماعی انجام می‌دادند؟",
      options: [
        "Tagging L'Aura with photos that gained thousands of likes",
        "Writing complaints about long waiting times",
        "Searching for train schedules",
      ],
      correctIndex: 0,
      hintSnippet: "diners had tagged L'Aura on international foodie channels, with photos of the gold-garnished magenta duck racking up thousands of likes",
      clueFa: "خط آخر رو ببین؛ عکس‌های اردک با ورق طلا هزاران لایک در دقایق اول گرفت.",
    },
    choiceA: {
      labelEn: "Announce a weekly 'Chef's Experimental Table' for avant-garde food lovers!",
      labelFa: "میز هفتگی «آزمایشگاه سرآشپز» رو برای دوستداران غذاهای آوانگارد افتتاح کن!",
      descriptionFa: "رزروهای ماه‌های آینده ظرف چند ساعت پر می‌شن.",
    },
    choiceB: {
      labelEn: "Offer every guest in the dining room a complimentary glass of sparkling cider!",
      labelFa: "به افتخار این شب رویایی به همه مهمانان سالن یک نوشیدنی پذیرایی هدیه بده!",
      descriptionFa: "سخاوت و احترامی که مشتریان وفادار همیشگی می‌سازه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Monsieur Laurent accepted the engraved silver spice box with genuine reverence, inhaling the dry, floral hibiscus perfume. 'A master chef honors the origins of flavor,' he murmured thoughtfully. 'I haven't witnessed such intelligent culinary wit in fifteen years of restaurant reviewing.'",
    keywords: [
      { word: "reverence", meaningFa: "احترام آمیخته با تحسین و وقار", phonetic: "/ˈrevərəns/" },
      { word: "origins", meaningFa: "ریشه‌ها و منشأ اصیل مواد", phonetic: "/ˈɒrɪdʒɪnz/" },
      { word: "wit", meaningFa: "هوش، ذکاوت و شوخ‌طبعی ظریف", phonetic: "/wɪt/" },
    ],
    question: {
      promptEn: "For how many years had Monsieur Laurent been reviewing restaurants?",
      promptFa: "منتقد معروف چند سال بود که کار نقد حرفه‌ای رستوران‌ها را انجام می‌داد؟",
      options: [
        "For fifteen years",
        "Only two months",
        "Over forty years",
      ],
      correctIndex: 0,
      hintSnippet: "haven't witnessed such intelligent culinary wit in fifteen years of restaurant reviewing",
      clueFa: "خط آخر رو نگاه کن؛ پانزده سال بود که نقدهای سخت‌گیرانه می‌نوشت.",
    },
    choiceA: {
      labelEn: "Gift the silver spice box to Laurent as a permanent token of mutual respect!",
      labelFa: "جعبه نقره‌ای ادویه رو به عنوان یادگاری ماندگار احترام متقابل بهش ببخش!",
      descriptionFa: "یادگاری باارزش که همیشه روی میزش خواهد ماند.",
    },
    choiceB: {
      labelEn: "Discuss the future of Persian spice integration in contemporary European cuisine!",
      labelFa: "درباره تلفیق ادویه‌های اصیل ایرانی در آشپزی مدرن اروپا با او تبادل نظر کن!",
      descriptionFa: "گفتگویی فرهنگی و جذاب در بالاترین سطح هنر خوراک‌شناسی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "By morning, Monsieur Laurent's review was published on the front page of the Culture & Cuisine gazette with a glowing five-star rating: *'L'Aura: Where Serendipity Becomes Pure Culinary Sorcery'*. The telephone at the reservation desk began ringing non-stop, with callers seeking bookings through New Year's Eve.",
    keywords: [
      { word: "gazette", meaningFa: "روزنامه و نشریه رسمی معتبر", phonetic: "/ɡəˈzet/" },
      { word: "serendipity", meaningFa: "بخت خوش و اتفاق فرخنده‌ای که بدون نقشه رخ می‌دهد", phonetic: "/ˌserənˈdɪpəti/" },
      { word: "sorcery", meaningFa: "جادوگری و افسون هنرمندانه", phonetic: "/ˈsɔːsəri/" },
    ],
    question: {
      promptEn: "What star rating did Monsieur Laurent award L'Aura in his front-page review?",
      promptFa: "منتقد در نقد صفحه اول خود چه امتیازی به رستوران لورا داد؟",
      options: [
        "A glowing five-star rating",
        "A mediocre two-star rating",
        "Zero stars",
      ],
      correctIndex: 0,
      hintSnippet: "published on the front page of the Culture & Cuisine gazette with a glowing five-star rating",
      clueFa: "خط اول رو ببین دوست من؛ پنج ستاره درخشان و کامل به رستوران داد.",
    },
    choiceA: {
      labelEn: "Frame the five-star newspaper review beside the brass kitchen pass!",
      labelFa: "نقد پنج‌ستاره روزنامه رو کنار ورودی آشپزخانه قاب کن!",
      descriptionFa: "افتخاری که روزانه انگیزه تیم رو دوچندان می‌کنه.",
    },
    choiceB: {
      labelEn: "Expand the kitchen brigade and promote apprentice Leo to Junior Pastry Cook!",
      labelFa: "تیم آشپزخانه رو گسترش بده و کارآموز لئو رو به کمک‌آشپز قنادی ارتقا بده!",
      descriptionFa: "اشتباه او سرآغاز این پیروزی تاریخی شد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "The ruby pomegranate sorbet was presented in carved crystal ice bowls with crystallized mint leaves. Laurent took one refreshing spoonful, exhaled with utter satisfaction, and smiled at Julian: 'You have orchestrated a flawless symphony from the opening overture to the final chord.'",
    keywords: [
      { word: "orchestrated", meaningFa: "با هماهنگی کامل ارکستروار رهبری و اجرا کرد", phonetic: "/ˈɔːkɪstreɪtɪd/" },
      { word: "overture", meaningFa: "مقدمه و پیش‌درآمد قطعه موسیقی", phonetic: "/ˈəʊvətjʊə/" },
      { word: "satisfaction", meaningFa: "رضایت کامل و خشنودی عمیق", phonetic: "/ˌsætɪsˈfækʃn/" },
    ],
    question: {
      promptEn: "What did Laurent compare Julian's dining experience to?",
      promptFa: "لوران تجربه صرف شام ژولین را به چه چیزی تشبیه کرد؟",
      options: [
        "A flawless symphony from opening overture to final chord",
        "A bumpy train ride",
        "A boring lecture",
      ],
      correctIndex: 0,
      hintSnippet: "You have orchestrated a flawless symphony from the opening overture to the final chord",
      clueFa: "خط آخر رو نگاه کن؛ به یک سمفونی بی‌نقص از مقدمه تا آکورد پایانی.",
    },
    choiceA: {
      labelEn: "Invite Laurent to be patron of honor at the Annual Autumn Gastronomy Summit!",
      labelFa: "از لوران دعوت کن تا حامی افتخاری همایش سالانه خوراک‌شناسی پاییز باشه!",
      descriptionFa: "پیوندی ماندگار میان سرآشپز و معتبرترین منتقد شهر.",
    },
    choiceB: {
      labelEn: "Celebrate by hosting a midnight family supper for all staff members!",
      labelFa: "شام نیمه‌شب خودمانی و دلپذیری برای تمام کارکنان برپا کنید!",
      descriptionFa: "گرمی و قدردانی از کسانی که شانه به شانه کار کردند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "The golden vintage Sauternes dessert wine flowed smoothly into crystal glasses, offering honeyed apricot notes that brought the evening to an opulent close. Laurent raised his glass toward the kitchen pass where Julian and his crew stood with tired but jubilant grins.",
    keywords: [
      { word: "opulent", meaningFa: "مجلل، شاهانه و سرشار از شکوه", phonetic: "/ˈɒpjələnt/" },
      { word: "jubilant", meaningFa: "شادمان، سرمست از پیروزی", phonetic: "/ˈdʒuːbɪlənt/" },
      { word: "apricot", meaningFa: "زردآلو و میوه‌های تابستانی شیرین", phonetic: "/ˈeɪprɪkɒt/" },
    ],
    question: {
      promptEn: "What notes did the vintage Sauternes dessert wine offer?",
      promptFa: "نوشیدنی کهن ساترن چه عطر و طعمی در خود داشت؟",
      options: [
        "Honeyed apricot notes",
        "Sour vinegar notes",
        "Bitter black pepper",
      ],
      correctIndex: 0,
      hintSnippet: "offering honeyed apricot notes that brought the evening to an opulent close",
      clueFa: "خط اول رو بخون عزیزم؛ طعم عسلی زردآلو با شکوه فراوان.",
    },
    choiceA: {
      labelEn: "Lead the dining room in a final toast to great food and serendipitous courage!",
      labelFa: "سالن غذاخوری رو به یک سلامتی باشکوه برای شجاعت و هنر دعوت کن!",
      descriptionFa: "پایانی درخشان در میان کف زدن ممتد مهمانان.",
    },
    choiceB: {
      labelEn: "Archive the evening's dinner ticket as the foundational charter of L'Aura!",
      labelFa: "فیش غذای میز شماره ۹ رو به عنوان سند تولد و بنیان رستوران قاب کنید!",
      descriptionFa: "سندی ماندگار از شبی که رویا به حقیقت پیوست.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Julian gathered the entire kitchen brigade around the bakery station. As the room erupted into cheers for head baker Marie, Laurent joined the round of applause from his table, saluting the unsung heroes whose humble craft turned a meal into poetry.",
    keywords: [
      { word: "brigade", meaningFa: "تیم منظم و سلسله‌مراتبی سرآشپزان در آشپزخانه حرفه‌ای", phonetic: "/brɪˈɡeɪd/" },
      { word: "unsung", meaningFa: "گمنام و کمتر دیده‌شده اما فداکار", phonetic: "/ˌʌnˈsʌŋ/" },
      { word: "poetry", meaningFa: "شعر و هنر والای انسانی", phonetic: "/ˈpəʊətri/" },
    ],
    question: {
      promptEn: "Who did Laurent salute from his table during the kitchen applause?",
      promptFa: "لوران در هنگام تشویق آشپزخانه به چه کسانی ادای احترام کرد؟",
      options: [
        "The unsung heroes whose humble craft turned a meal into poetry",
        "The city parking inspectors",
        "The tax accountants",
      ],
      correctIndex: 0,
      hintSnippet: "saluting the unsung heroes whose humble craft turned a meal into poetry",
      clueFa: "خط آخر رو نگاه کن؛ قهرمانان گمنامی که هنر دستشان غذا را به شعر تبدیل کرد.",
    },
    choiceA: {
      labelEn: "Establish an annual 'Artisan Baker Award' funded by the restaurant's profits!",
      labelFa: "جایزه سالانه نانوای خلاق رو با حمایت درآمدهای رستوران پایه‌گذاری کن!",
      descriptionFa: "حمایت از هنرمندان اصیل نان سنتی.",
    },
    choiceB: {
      labelEn: "Close the night with a warm group embrace and an unforgettable victory feast!",
      labelFa: "شب رو با آغوش گرم دسته‌جمعی و ضیافت پیروزی خاطره‌انگیز تموم کنید!",
      descriptionFa: "شبی که سرآغاز برترین رستوران شهر شد.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The rich espresso cream flowed into the molten chocolate center, melding warm bitterness with dark cocoa sweetness. Laurent put down his spoon, completely conquered.",
    keywords: [{ word: "melding", meaningFa: "درآمیختن و یکی شدن طعم‌ها", phonetic: "/ˈmeldɪŋ/" }],
    question: {
      promptEn: "What did the warm espresso cream meld with?",
      promptFa: "کرم اسپرسوی داغ با چه طعمی درآمیخت؟",
      options: ["Dark cocoa sweetness", "Cold tomato soup", "Salty butter"],
      correctIndex: 0,
      hintSnippet: "melding warm bitterness with dark cocoa sweetness",
      clueFa: "شیرینی شکلات تلخ با تلخی گرم قهوه درآمیخت.",
    },
    choiceA: {
      labelEn: "Accept Laurent's nomination for the prestigious Golden Whisk Award!",
      labelFa: "نامزدی جایزه معتبر همزن طلایی رو از طرف لوران بپذیرید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Dedicate the dessert recipe to opening night's fortunate mishaps!",
      labelFa: "دستور دسر رو به اشتباهات خوش‌یمن شب افتتاحیه تقدیم کنید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Laurent leaned back and smiled warmly: 'Young man, you didn't just meet my standards; you reminded me why I fell in love with dining four decades ago.'",
    keywords: [{ word: "decades", meaningFa: "دهه‌ها در گذر زمان", phonetic: "/ˈdekeɪdz/" }],
    question: {
      promptEn: "How long ago did Laurent fall in love with dining?",
      promptFa: "لوران چند دهه قبل شیفته هنر رستوران‌گردی و غذا شده بود؟",
      options: ["Four decades ago", "Yesterday", "Ten years ago"],
      correctIndex: 0,
      hintSnippet: "why I fell in love with dining four decades ago",
      clueFa: "چهار دهه (چهل سال) پیش.",
    },
    choiceA: {
      labelEn: "Frame Laurent's handwritten quote on the dining room wall!",
      labelFa: "جمله دست‌نویس لوران رو روی دیوار سالن قاب کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Invite Laurent to co-judge next month's Young Chefs' Charity Gala!",
      labelFa: "از لوران برای داوری مشترک جشن خیریه سرآشپزان جوان دعوت کنید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "On the creamy leather guestbook page, Laurent inked: 'Here lies the beating heart of culinary reinvention. 5 Stars.' The restaurant's reputation was solidified forever.",
    keywords: [{ word: "solidified", meaningFa: "تثبیت‌شده، پایدار و خلل‌ناپذیر", phonetic: "/səˈlɪdɪfaɪd/" }],
    question: {
      promptEn: "What words did Laurent ink into the guestbook?",
      promptFa: "لوران چه عبارتی را در دفتر یادبود ثبت کرد؟",
      options: ["'Here lies the beating heart of culinary reinvention. 5 Stars.'", "'Service too slow'", "'Food was cold'"],
      correctIndex: 0,
      hintSnippet: "Here lies the beating heart of culinary reinvention. 5 Stars",
      clueFa: "اینجا قلب تپنده بازآفرینی در هنر آشپزی است.",
    },
    choiceA: {
      labelEn: "Hang the guestbook under glass at the restaurant entrance!",
      labelFa: "دفترچه رو زیر محفظه شیشه‌ای ورودی به نمایش بگذارید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Celebrate with an all-night kitchen terrace party overlooking the city lights!",
      labelFa: "جشن شبانه روی تراس مشرف به چراغ‌های شهر برپا کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Glasses clinked with bubbly champagne as Julian hugged Claire, Marco, and the front staff. They had taken a potential nightmare and turned it into culinary gold.",
    keywords: [{ word: "bubbly", meaningFa: "کف‌آلود و جوشان و پر از حباب", phonetic: "/ˈbʌbli/" }],
    question: {
      promptEn: "What had the team turned a potential nightmare into?",
      promptFa: "تیم رستوران یک فاجعه احتمالی را به چه چیزی تبدیل کردند؟",
      options: ["Culinary gold", "A total disaster", "An empty room"],
      correctIndex: 0,
      hintSnippet: "turned it into culinary gold",
      clueFa: "به طلای درخشان در هنر آشپزی تبدیل کردند.",
    },
    choiceA: {
      labelEn: "Declare every opening anniversary an open-bar celebration for loyal diners!",
      labelFa: "سالگرد افتتاحیه رو جشن رایگان همیشگی برای مشتریان وفادار اعلام کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Award bonus checks to every staff member from the first week's proceeds!",
      labelFa: "پاداش ویژه به تمام کارکنان از سود هفته اول تقدیم کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The 'Chef's Experimental Table' sold out six months of bookings by midnight. Food lovers traveled from Paris, London, and Tokyo to taste Julian's botanical masterpieces.",
    keywords: [{ word: "botanical", meaningFa: "گیاهی و با بهره‌گیری از عصاره گیاهان", phonetic: "/bəˈtænɪkl/" }],
    question: {
      promptEn: "From which cities did food lovers travel to taste Julian's dishes?",
      promptFa: "علاقه‌مندان به خوراک از کدام شهرها برای چشیدن غذاهای ژولین سفر کردند؟",
      options: ["Paris, London, and Tokyo", "Nowhere nearby", "Only from the next street"],
      correctIndex: 0,
      hintSnippet: "traveled from Paris, London, and Tokyo",
      clueFa: "از پاریس، لندن و توکیو برای تجربه این طعم‌ها آمدند.",
    },
    choiceA: {
      labelEn: "Open a seasonal rooftop herb greenhouse to grow organic botanical ingredients!",
      labelFa: "گلخانه پشت‌بام رستوران رو برای کاشت گیاهان دارویی تازه راه‌اندازی کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Publish 'The Botanical Kitchen' cookbook with global publishing houses!",
      labelFa: "کتاب آشپزی گیاهی نوآورانه رو در سراسر جهان منتشر کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Every guest clinked their glasses in joyous unison, raising their drinks to Chef Julian. The atmosphere was charged with warmth, goodwill, and unforgettable hospitality.",
    keywords: [{ word: "hospitality", meaningFa: "مهمان‌نوازی و پذیرایی گرم", phonetic: "/ˌhɒspɪˈtæləti/" }],
    question: {
      promptEn: "What was the dining room atmosphere charged with?",
      promptFa: "فضای سالن غذاخوری آکنده از چه حسی بود؟",
      options: ["Warmth, goodwill, and unforgettable hospitality", "Anger and cold silence", "Smoke and dust"],
      correctIndex: 0,
      hintSnippet: "charged with warmth, goodwill, and unforgettable hospitality",
      clueFa: "سرشار از گرمی، حسن نیت و مهمان‌نوازی فراموش‌نشدنی.",
    },
    choiceA: {
      labelEn: "Make the welcoming toast a signature tradition on every busy Saturday night!",
      labelFa: "این سلامتی پرشور رو سنت همیشگی شنبه‌شب‌های رستوران قرار بدید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Take a wide panoramic photograph of the entire dining room in celebration!",
      labelFa: "عکس پانورامای یادگاری از کل سالن در حال جشن بگیرید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Laurent slipped the silver spice box into his inner jacket pocket, promising to treasure it on all his worldwide restaurant journeys as a reminder of culinary bravery.",
    keywords: [{ word: "treasure", meaningFa: "گرامی داشتن و مثل گنج حفظ کردن", phonetic: "/ˈtreʒə/" }],
    question: {
      promptEn: "What did Laurent promise to treasure the silver spice box as?",
      promptFa: "لوران قول داد جعبه نقره‌ای ادویه را به عنوان چه نمادی حفظ کند؟",
      options: ["A reminder of culinary bravery", "An ordinary metal box", "A piece of junk"],
      correctIndex: 0,
      hintSnippet: "as a reminder of culinary bravery",
      clueFa: "به عنوان یادآور شجاعت و جسارت در آشپزی.",
    },
    choiceA: {
      labelEn: "Write a personal thank-you letter to Laurent on handmade parchment!",
      labelFa: "نامه سپاسگزاری صمیمانه‌ای روی کاغذ دست‌ساز برای لوران بنویسید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Create an exclusive 'Laurent Tasting Menu' for food connoisseurs!",
      labelFa: "منوی چشایی اختصاصی با نام لوران برای علاقه‌مندان به خوراک‌های خاص بسازید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Their late-night conversation on Persian saffron, sumac, and wild barberries inspired an academic lecture series, bridging historical spice routes with modern gastronomy.",
    keywords: [{ word: "gastronomy", meaningFa: "علم و هنر خوراک‌شناسی سطح بالا", phonetic: "/ɡæˈstrɒnəmi/" }],
    question: {
      promptEn: "Which traditional ingredients were central to their discussion?",
      promptFa: "کدام مواد سنتی اصیل محور گفتگوی آنها بود؟",
      options: ["Persian saffron, sumac, and wild barberries", "Processed canned beans", "White sugar cubes"],
      correctIndex: 0,
      hintSnippet: "conversation on Persian saffron, sumac, and wild barberries",
      clueFa: "زعفران اصیل، سماق و زرشک وحشی کوهستان.",
    },
    choiceA: {
      labelEn: "Host the International Silk Road Culinary Symposium at L'Aura!",
      labelFa: "همایش بین‌المللی آشپزی جاده ابریشم را در رستوران لورا برگزار کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Partner with traditional spice growers in Khorasan for direct-trade sourcing!",
      labelFa: "با کشاورزان سنتی خراسان برای واردات مستقیم زعفران قرارداد ببندید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Framed in antique brass on the dining room wall, the five-star review became a local legend, drawing culinary tourists and establishing L'Aura as the city's crowning jewel.",
    keywords: [{ word: "crowning", meaningFa: "شاهکار، تاج افتخار و برترین دستاورد", phonetic: "/ˈkraʊnɪŋ/" }],
    question: {
      promptEn: "What did L'Aura become established as after the framed five-star review?",
      promptFa: "رستوران لورا پس از این نقد به چه عنوانی در شهر شناخته شد؟",
      options: ["The city's crowning jewel", "An average coffee shop", "A closed business"],
      correctIndex: 0,
      hintSnippet: "establishing L'Aura as the city's crowning jewel",
      clueFa: "نگین و تاج افتخار رستوران‌های شهر.",
    },
    choiceA: {
      labelEn: "Celebrate by hosting an annual charity dinner for aspiring culinary students!",
      labelFa: "ضیافت خیریه سالانه برای حمایت از دانشجویان رشته آشپزی برگزار کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Accept the Mayor's Medal of Economic and Cultural Excellence!",
      labelFa: "مدال افتخار شهردار را برای رونق گردشگری و فرهنگ شهر بپذیرید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Promoted to Junior Pastry Cook, young Leo beamed with pride. His accidental hibiscus swap had become the foundation of a culinary empire, proving every mistake holds opportunity.",
    keywords: [{ word: "opportunity", meaningFa: "فرصت طلایی و گرانبها", phonetic: "/ˌɒpəˈtjuːnəti/" }],
    question: {
      promptEn: "What did Leo's accidental hibiscus swap prove?",
      promptFa: "اشتباه ناخواسته لئو چه درسی را ثابت کرد؟",
      options: ["That every mistake holds opportunity", "That cooking is bad", "That apprentices should be fired"],
      correctIndex: 0,
      hintSnippet: "proving every mistake holds opportunity",
      clueFa: "ثابت کرد که درون هر اشتباهی یک فرصت طلایی نهفته است.",
    },
    choiceA: {
      labelEn: "Let Leo invent his own signature hibiscus macaron dessert!",
      labelFa: "به لئو اجازه بدهید ماکارون اختصاصی چای ترش خودش را خلق کند!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Enroll Leo in the prestigious Culinary Arts Academy in Lyon!",
      labelFa: "لئو را در آکادمی معتبر هنرهای آشپزی لیون ثبت‌نام کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Laurent accepted the patron of honor role with a gracious bow. Together, Julian and Laurent elevated regional dining, mentoring a new generation of bold, fearless culinary artists.",
    keywords: [{ word: "gracious", meaningFa: "باوقار، متواضع و سرشار از ادب", phonetic: "/ˈɡreɪʃəs/" }],
    question: {
      promptEn: "What did Julian and Laurent elevate together?",
      promptFa: "ژولین و لوران با هم سطح چه چیزی را ارتقا دادند؟",
      options: ["Regional dining and a new generation of fearless culinary artists", "Car prices", "Hotel room costs"],
      correctIndex: 0,
      hintSnippet: "elevated regional dining, mentoring a new generation of bold, fearless culinary artists",
      clueFa: "فرهنگ غذایی منطقه و تربیت نسلی جسور از سرآشپزان جوان.",
    },
    choiceA: {
      labelEn: "Establish the 'Julian-Laurent Gastronomic Fellowship' for young cooks!",
      labelFa: "بورسیه تحصیلی مشترک ژولین-لوران رو برای آشپزهای جوان پایه‌گذاری کنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Publish a joint manifesto on the philosophy of intuitive cooking!",
      labelFa: "مانیفست مشترکی درباره فلسفه آشپزی شهودی منتشر کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "At three in the morning, the kitchen team sat around the main dining table, sharing crusty bread, laughter, and warm tea. The bond forged tonight would weather any future storm.",
    keywords: [{ word: "forged", meaningFa: "شکل‌گرفته و آبدیده مثل فولاد", phonetic: "/fɔːdʒd/" }],
    question: {
      promptEn: "What would the bond forged tonight weather in the future?",
      promptFa: "پیوند دوستی که امشب شکل گرفت در برابر چه چیزی مقاومت خواهد کرد؟",
      options: ["Any future storm", "Nothing at all", "Only quiet weather"],
      correctIndex: 0,
      hintSnippet: "The bond forged tonight would weather any future storm",
      clueFa: "در برابر هر طوفان و سختی در آینده محکم خواهد ایستاد.",
    },
    choiceA: {
      labelEn: "Make this midnight staff supper a beloved monthly tradition!",
      labelFa: "این شام دورهمی نیمه‌شب رو سنت دوست‌داشتنی ماهانه قرار بدید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Take a silly Polaroid photo of everyone wearing flour-covered chef aprons!",
      labelFa: "عکس پولاروید خنده‌داری با پیش‌بندهای آردی بگیرید و به دیوار بزنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The final toast resonated through the hall, celebrating human creativity and the courage to transform crisis into triumph. Diners clinked glasses with strangers, sharing joyful smiles.",
    keywords: [{ word: "resonated", meaningFa: "طنین انداخت و در دل‌ها نشست", phonetic: "/ˈrezəneɪtɪd/" }],
    question: {
      promptEn: "What did the final toast celebrate?",
      promptFa: "سلامتی پایانی چه پیامی را جشن گرفت؟",
      options: ["Human creativity and courage to transform crisis into triumph", "Leaving early", "Eating fast"],
      correctIndex: 0,
      hintSnippet: "celebrating human creativity and the courage to transform crisis into triumph",
      clueFa: "خلاقیت انسان و شجاعت تبدیل بحران به پیروزی.",
    },
    choiceA: {
      labelEn: "Carve the quote 'Courage is the Finest Ingredient' above the kitchen pass!",
      labelFa: "جمله «شجاعت برترین چاشنی غذاست» رو بالای پیشخوان آشپزخانه حک کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Send a gourmet dessert basket to every food writer across the country!",
      labelFa: "سبد دسرهای ویژه رو برای تمام نویسندگان خوراک کشور ارسال کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Framing table nine's original handwritten ticket beside the Michelin inspection guide, Julian smiled. That single piece of paper marked the exact moment L'Aura made history.",
    keywords: [{ word: "inspection", meaningFa: "بازرسی و ارزیابی تخصصی", phonetic: "/ɪnˈspekʃn/" }],
    question: {
      promptEn: "What did table nine's ticket mark for L'Aura?",
      promptFa: "فیش غذای میز شماره ۹ چه نقطه‌ای را برای رستوران لورا رقم زد؟",
      options: ["The exact moment L'Aura made history", "A lost bill", "An expired coupon"],
      correctIndex: 0,
      hintSnippet: "marked the exact moment L'Aura made history",
      clueFa: "دقیقاً لحظه‌ای که رستوران لورا تاریخ‌ساز شد.",
    },
    choiceA: {
      labelEn: "Invite the Michelin inspectors for an official tasting review next season!",
      labelFa: "بازرسان رسمی راهنمای میشلن رو برای بررسی فصل بعد دعوت کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Create an open-source kitchen apprenticeship program for underprivileged youth!",
      labelFa: "برنامه آموزش رایگان آشپزی حرفه‌ای برای جوانان کم‌بضاعت تأسیس کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The 'Artisan Baker Award' funded six new traditional sourdough bakeries in the region, preserving historic brick ovens and centuries-old heirloom grain strains.",
    keywords: [{ word: "heirloom", meaningFa: "بذرهای کهن و بومی اصیل که دست‌نخورده مانده‌اند", phonetic: "/ˈeəluːm/" }],
    question: {
      promptEn: "What did the Artisan Baker Award fund in the region?",
      promptFa: "جایزه نانوای سنتی چه چیزهایی را در منطقه تأمین مالی کرد؟",
      options: ["Six new traditional sourdough bakeries", "A plastic factory", "A parking garage"],
      correctIndex: 0,
      hintSnippet: "funded six new traditional sourdough bakeries in the region",
      clueFa: "شش نانوایی سنتی نان خمیرترش با تنورهای آجری تاریخی.",
    },
    choiceA: {
      labelEn: "Host an annual Bread & Wine Carnival at the central town square!",
      labelFa: "کارناوال سالانه نان سنتی و طعم‌های اصیل رو در میدان اصلی شهر برپا کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Publish a documentary honoring traditional bakery craftspeople!",
      labelFa: "مستند زیبایی در ستایش هنرمندان گمنام نانوایی سنتی بسازید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Standing arm-in-arm in the quiet early hours as the first delivery trucks arrived, Julian and Claire knew that tonight wasn't just survival; it was the start of an empire.",
    keywords: [{ word: "survival", meaningFa: "بقا و نجات از گرداب مشکلات", phonetic: "/səˈvaɪvl/" }],
    question: {
      promptEn: "What did tonight represent for Julian and Claire?",
      promptFa: "امشب برای ژولین و کلر نماد چه چیزی بود؟",
      options: ["Not just survival, but the start of an empire", "A day they wanted to forget", "A regular Tuesday"],
      correctIndex: 0,
      hintSnippet: "tonight wasn't just survival; it was the start of an empire",
      clueFa: "تنها یک نجات از بحران نبود، بلکه سرآغاز یک امپراتوری باشکوه شد.",
    },
    choiceA: {
      labelEn: "Look into each other's eyes and toast to the greatest adventure of your lives!",
      labelFa: "به چشمان هم لبخند بزنید و به سلامتی بزرگترین ماجراجویی زندگی‌تان بنوشید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Open the kitchen doors to welcome the morning bakers with fresh espresso!",
      labelFa: "درهای آشپزخانه رو باز کنید و با اسپرسوی داغ به نانوایان صبحگاهی خوش‌آمد بگید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Golden Whisk", titleFa: "همزن زرین افتخار", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان قهرمانانه و اسطوره‌ای", climaxEn: "Nominated for the Golden Whisk, Julian's hibiscus reduction becomes the defining culinary sensation of the decade.", climaxFa: "با نامزدی در جایزه همزن طلایی، سس نوآورانه ژولین به پرسر و صداترین شاهکار خوراک‌شناسی دهه تبدیل شد.", xpReward: 260 },
  { pathCode: "AAAAB", titleEn: "Serendipity Soufflé", titleFa: "سوفله بخت خوش", badgeCategory: "scholar", badgeIcon: "🍫", badgeNameFa: "پایان لذیذ و دلپذیر", climaxEn: "The cardamom hibiscus chocolate soufflé is named the city's most requested dessert for five straight years.", climaxFa: "سوفله شکلات با طعم هل و گل سرخ برای پنج سال پیاپی محبوب‌ترین دسر شهر لقب گرفت.", xpReward: 240 },
  { pathCode: "AAABA", titleEn: "The Critic's Golden Quote", titleFa: "جمله طلایی منتقد", badgeCategory: "legendary", badgeIcon: "📜", badgeNameFa: "پایان تاریخی و افتخارآفرین", climaxEn: "Framed at the entrance, Laurent's handwritten tribute brings international travelers to L'Aura's tables daily.", climaxFa: "یادداشت دست‌نویس لوران در ورودی رستوران هر روز مسافران بین‌المللی را به این سالن غذاخوری کشاند.", xpReward: 250 },
  { pathCode: "AAABB", titleEn: "The Young Chefs' Patron", titleFa: "حامی سرآشپزان جوان", badgeCategory: "scholar", badgeIcon: "👨‍🍳", badgeNameFa: "پایان اخلاقی و آموزشی", climaxEn: "Their charity gala raises half a million dollars to fund scholarships for talented young cooks across the globe.", climaxFa: "جشن خیریه آنها نیم میلیون دلار برای بورسیه جوانان مستعد در سراسر دنیا جمع‌آوری کرد.", xpReward: 235 },
  { pathCode: "AABAA", titleEn: "Heart of Reinvention", titleFa: "قلب بازآفرینی هنر", badgeCategory: "legendary", badgeIcon: "💎", badgeNameFa: "پایان ابدی و ماندگار", climaxEn: "The guestbook with Laurent's five-star inscription becomes a historic relic visited by culinary pilgrims.", climaxFa: "دفترچه یادبود پنج‌ستاره به سندی تاریخی تبدیل شد که سرآشپزان مشهور برای الهام گرفتن به دیدارش آمدند.", xpReward: 260 },
  { pathCode: "AABAB", titleEn: "The Rooftop Toast to Dawn", titleFa: "سلامتی سحرگاه بر فراز شهر", badgeCategory: "heroic", badgeIcon: "🥂", badgeNameFa: "پایان رفاقتی و پرشور", climaxEn: "Watching the sunrise from the terrace, Julian and Claire celebrate a triumph forged from pure panic.", climaxFa: "با تماشای طلوع آفتاب از روی تراس، ژولین و کلر پیروزی شگفت‌انگیزی را که از دل بحران زاده شد جشن گرفتند.", xpReward: 245 },
  { pathCode: "AABBA", titleEn: "The Anniversary Open Bar", titleFa: "سالگرد وفاداری مشتریان", badgeCategory: "funny", badgeIcon: "🎉", badgeNameFa: "پایان شاد و مردمی", climaxEn: "Every year on opening night, regular diners drink bubbly wine for free, celebrating the sauce that almost ruined everything.", climaxFa: "هر سال در شب افتتاحیه، مشتریان قدیمی خاطره سسی را که نزدیک بود کار را خراب کند با خنده مرور می‌کنند.", xpReward: 220 },
  { pathCode: "AABBB", titleEn: "The Shared Bonus Victory", titleFa: "پاداش وفاداری تیم", badgeCategory: "scholar", badgeIcon: "💰", badgeNameFa: "پایان ارزشمند تیمی", climaxEn: "Julian's generous bonus checks create the most loyal, talented kitchen and service brigade in the province.", climaxFa: "پاداش‌های سخاوتمندانه ژولین، وفادارترین و حرفه‌ای‌ترین کادر خدماتی و آشپزی استان را پدید آورد.", xpReward: 230 },
  { pathCode: "ABAAA", titleEn: "The Rooftop Herb Sanctuary", titleFa: "باغچه سبز پشت‌بام", badgeCategory: "explorer", badgeIcon: "🌿", badgeNameFa: "پایان سبز و ارگانیک", climaxEn: "L'Aura's rooftop greenhouse yields rare organic herbs that define a revolutionary farm-to-table dining standard.", climaxFa: "گلخانه پشت‌بام رستوران استانداردی نوین در استفاده از سبزیجات تازه از مزرعه تا سر میز خلق کرد.", xpReward: 250 },
  { pathCode: "ABAAB", titleEn: "The Botanical Bestseller", titleFa: "کتاب پرفروش آشپزی گیاهی", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان موفقیت ادبی", climaxEn: "Julian's debut cookbook sells two million copies, translated into fourteen languages across the world.", climaxFa: "کتاب اول ژولین دو میلیون نسخه فروخت و به چهارده زبان دنیا ترجمه شد.", xpReward: 255 },
  { pathCode: "ABABA", titleEn: "The Saturday Night Tradition", titleFa: "سنت همیشگی شنبه‌شب‌ها", badgeCategory: "scholar", badgeIcon: "✨", badgeNameFa: "پایان گرم و مهمان‌نواز", climaxEn: "The weekly chef's toast becomes an iconic city tradition, filling the dining room with warmth every week.", climaxFa: "سلامتی هفتگی سرآشپز به یکی از سنت‌های جذاب شهر تبدیل شد و هر شنبه سالن را پر از شور کرد.", xpReward: 230 },
  { pathCode: "ABABB", titleEn: "The Panoramic Memory", titleFa: "عکس پانورامای جاودان", badgeCategory: "heroic", badgeIcon: "📸", badgeNameFa: "پایان تصویری باشکوه", climaxEn: "The framed opening night photo hangs proudly in the foyer, reminding every guest that magic is real.", climaxFa: "عکس دسته‌جمعی شب افتتاحیه در لابی نصب شد تا به همه یادآوری کند معجزه در دستان انسان است.", xpReward: 235 },
  { pathCode: "ABBAA", titleEn: "The Critic's Token", titleFa: "یادگار ارزشمند منتقد", badgeCategory: "legendary", badgeIcon: "🥈", badgeNameFa: "پایان محترمانه و اصیل", climaxEn: "Laurent carries the silver spice box on four continents, writing praised columns on L'Aura's timeless panache.", climaxFa: "لوران جعبه ادویه نقره‌ای را در چهار قاره همراه داشت و مقالات ستایش‌آمیزی درباره اصالت لورا نوشت.", xpReward: 250 },
  { pathCode: "ABBAB", titleEn: "The Tasting Menu of Legends", titleFa: "منوی چشایی اساطیر", badgeCategory: "scholar", badgeIcon: "🍽️", badgeNameFa: "پایان لوکس و منحصربه‌فرد", climaxEn: "The twelve-course Laurent Tasting Menu earns three stars and reservations booked a year in advance.", climaxFa: "منوی چشایی اختصاصی دوازده‌بخشی لوران سه ستاره گرفت و تا یک سال بعد کاملاً رزرو شد.", xpReward: 260 },
  { pathCode: "ABBBA", titleEn: "The Silk Road Symposium", titleFa: "همایش بزرگ جاده ابریشم", badgeCategory: "scholar", badgeIcon: "🌍", badgeNameFa: "پایان فرهنگی و بین‌المللی", climaxEn: "Fifty world-class chefs gather at L'Aura to study the culinary alchemy of ancient spice routes.", climaxFa: "پنجاه سرآشپز تراز اول جهان در لورا گرد هم آمدند تا کیمیاگری ادویه‌های کهن را بررسی کنند.", xpReward: 250 },
  { pathCode: "ABBBB", titleEn: "The Direct Trade Saffron Bridge", titleFa: "پل اصالت زعفران ایران", badgeCategory: "legendary", badgeIcon: "🌺", badgeNameFa: "پایان بازرگانی اخلاقی", climaxEn: "Direct partnerships with Khorasan saffron farms guarantee fair wages for growers and golden purity for L'Aura.", climaxFa: "همکاری مستقیم با مزارع زعفران خراسان ضامن درآمد منصفانه کشاورزان و اصالت طلایی لورا شد.", xpReward: 255 },
  { pathCode: "BAAAA", titleEn: "The Crowning Jewel of the City", titleFa: "نگین درخشان شهر", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان اشرافی و جاودان", climaxEn: "L'Aura transforms the downtown district into a world-class culinary capital, attracting global visitors.", climaxFa: "رستوران لورا مرکز شهر را به پایتخت گردشگری غذا بدل کرد و مهمانانی از سراسر گیتی آورد.", xpReward: 260 },
  { pathCode: "BAAAB", titleEn: "The Mayor's Excellence Medal", titleFa: "مدال افتخار شهردار", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان رسمی دولتی", climaxEn: "City hall honors Chef Julian and Claire for breathing vibrant life and prestige into the municipal economy.", climaxFa: "شهرداری از ژولین و کلر برای بخشیدن روح تازه و شکوه اقتصادی به شهر تقدیر رسمی کرد.", xpReward: 245 },
  { pathCode: "BAABA", titleEn: "The Hibiscus Macaron Legend", titleFa: "افسانه ماکارون هیبیسکوس", badgeCategory: "funny", badgeIcon: "🧁", badgeNameFa: "پایان شیرین و خلاق", climaxEn: "Leo's bright magenta macarons sell ten thousand boxes a month, establishing him as a pastry prodigy.", climaxFa: "ماکارون‌های خوش‌رنگ لئو ماهی ده هزار جعبه فروخت و او را به نابغه قنادی تبدیل کرد.", xpReward: 235 },
  { pathCode: "BAABB", titleEn: "The Graduate of Lyon", titleFa: "دانش‌آموخته آکادمی لیون", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان پربار آموزشی", climaxEn: "Leo graduates first in his class at Lyon, returning to become Julian's indispensable executive sous-chef.", climaxFa: "لئو با رتبه اول از لیون فارغ‌التحصیل شد و به عنوان معاون ارشد اجرایی به کنار ژولین بازگشت.", xpReward: 250 },
  { pathCode: "BABAA", titleEn: "The Gastronomic Fellowship", titleFa: "بنیاد پژوهش‌های خوراک", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان ماندگار علمی", climaxEn: "The Julian-Laurent fellowship funds one hundred young culinary visionaries, altering culinary history forever.", climaxFa: "بنیاد مشترک ژولین و لوران به صد سرآشپز جوان خلاق بال پرواز بخشید و تاریخ آشپزی را دگرگون کرد.", xpReward: 255 },
  { pathCode: "BABAB", titleEn: "Manifesto of Intuition", titleFa: "مانیفست آشپزی شهودی", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان فلسفی و هنری", climaxEn: "Their published book on trusting instincts in the kitchen becomes mandatory reading in culinary institutes.", climaxFa: "کتاب آنها درباره اعتماد به الهام در آشپزخانه، کتاب درسی اصلی مدارس آشپزی دنیا شد.", xpReward: 240 },
  { pathCode: "BABBA", titleEn: "The Monthly Kitchen Supper", titleFa: "ضیافت ماهانه کادر آشپزی", badgeCategory: "funny", badgeIcon: "🍲", badgeNameFa: "پایان صمیمی و دوستانه", climaxEn: "Every month, the restaurant closes early so the entire staff can eat, laugh, and brainstorm together.", climaxFa: "هر ماه رستوران زود تعطیل می‌شد تا تمام کادر در کنار هم غذا بخورند، بخندند و ایده بسازند.", xpReward: 225 },
  { pathCode: "BABBB", titleEn: "The Flour-Dusted Polaroid", titleFa: "عکس یادگاری آردی", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان نوستالژیک و پرخنده", climaxEn: "The silly Polaroid of Julian and Marco covered in flour hangs above the stove, a permanent smile for tough nights.", climaxFa: "عکس خنده‌دار ژولین و مارکو با صورت‌های آردی بالای اجاق ماند تا در شب‌های شلوغ لبخند بیافریند.", xpReward: 220 },
  { pathCode: "BBAAA", titleEn: "The Ingredient of Courage", titleFa: "شجاعت: برترین چاشنی", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان الهام‌بخش", climaxEn: "The carved motto above the pass reminds generations of young cooks that bravery turns disasters into art.", climaxFa: "شعار حک‌شده بالای پیشخوان به نسل‌ها یادآوری کرد که شجاعت، بحران‌ها را به شاهکار تبدیل می‌کند.", xpReward: 250 },
  { pathCode: "BBAAB", titleEn: "The Sweet Symphony Gift", titleFa: "سبد دسرهای شیرین", badgeCategory: "scholar", badgeIcon: "🎁", badgeNameFa: "پایان ارتباطات عالی", climaxEn: "Every major food critic across the continent hails L'Aura as the benchmark of modern culinary elegance.", climaxFa: "تمام منتقدان برجسته قاره، رستوران لورا را به عنوان الگوی وقار و ظرافت مدرن ستودند.", xpReward: 240 },
  { pathCode: "BBABA", titleEn: "The Three Michelin Stars", titleFa: "سه ستاره درخشان میشلن", badgeCategory: "legendary", badgeIcon: "⭐⭐⭐", badgeNameFa: "پایان فتح قله‌های جهان", climaxEn: "Within three years, L'Aura earns three coveted Michelin stars, praised for unbridled culinary courage.", climaxFa: "ظرف سه سال، رستوران لورا هر سه ستاره طلایی میشلن را برای شجاعت و هنر بی‌مانندش درو کرد.", xpReward: 260 },
  { pathCode: "BBABB", titleEn: "The Open Kitchen Academy", titleFa: "آکادمی رایگان آشپزی لورا", badgeCategory: "scholar", badgeIcon: "🏫", badgeNameFa: "پایان خیریه و بزرگمنشانه", climaxEn: "Three hundred underprivileged young students graduate into top careers, inspired by Julian's mentorship.", climaxFa: "سیصد جوان کم‌بضاعت با آموزش رایگان ژولین به بهترین موقعیت‌های شغلی آشپزی دنیا رسیدند.", xpReward: 250 },
  { pathCode: "BBBAA", titleEn: "The Town Square Bread Carnival", titleFa: "کارناوال نان و پنیر شهر", badgeCategory: "heroic", badgeIcon: "🎪", badgeNameFa: "پایان پرشور مردمی", climaxEn: "Twenty thousand locals celebrate annually with crusty brioche and artisan reductions under festive banners.", climaxFa: "بیست هزار نفر از مردم شهر هر سال با نان‌های برشته و سس‌های معطر در کارناوال جشن گرفتند.", xpReward: 245 },
  { pathCode: "BBBAB", titleEn: "Poetry of the Hearth", titleFa: "مستند شعر تنورهای کهن", badgeCategory: "explorer", badgeIcon: "🎬", badgeNameFa: "پایان سینمایی و هنری", climaxEn: "The documentary on traditional bakers wins the Golden Reel at the International Culinary Film Festival.", climaxFa: "مستند ستایش نانوایان سنتی برنده جایزه حلقه طلای جشنواره بین‌المللی فیلم‌های خوراک شد.", xpReward: 240 },
  { pathCode: "BBBBA", titleEn: "The Toast to the Horizon", titleFa: "سلامتی به افق‌های بی‌پایان", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان عاشقانه و رفاقتی", climaxEn: "Julian and Claire clink glasses as dawn breaks, realizing that love and imagination conquered the night.", climaxFa: "ژولین و کلر در سپیده‌دم با لبخند جام‌ها را به هم زدند و فهمیدند عشق و تخیل شب را تسخیر کرد.", xpReward: 260 },
  { pathCode: "BBBBB", titleEn: "The Morning Bakers' Welcome", titleFa: "سلام به سپیده‌دم و نانوایان", badgeCategory: "legendary", badgeIcon: "🌅", badgeNameFa: "پایان اسطوره‌ای و ابدی", climaxEn: "Handing steaming espresso to the dawn bakers, Julian stands as the maestro of a thriving culinary empire.", climaxFa: "با تعارف اسپرسوی داغ به نانوایان سحرخیز، ژولین به عنوان استاد مسلم یک امپراتوری شکوفا ایستاد.", xpReward: 260 },
];

export const story1CulinaryCrisis: AdventureStory = buildAdventureStory({
  id: "b2-culinary-chaos",
  storyIndex: 1,
  cefr: "B2",
  titleEn: "The Bistro Opening Crisis",
  titleFa: "ماجرای خنده‌دار افتتاحیه رستوران سرآشپز",
  genre: "comedy",
  genreLabelFa: "😄 طنز و روزمره",
  genreIcon: "😄",
  synopsisEn:
    "Chef Julian faces disaster on opening night when an apprentice swaps saffron for hibiscus, turning his roast sauce bright magenta. Can he convince the city's fiercest food critic across 32 witty endings?",
  synopsisFa:
    "سرآشپز ژولین تمام پس‌انداز زندگی‌اش را صرف افتتاح رستوران لوکس «لورا» کرده، اما در شب افتتاحیه و درست جلوی چشم سخت‌گیرترین منتقد غذا، کارآموز آشپزخانه زعفران را با پودر چای ترش اشتباه می‌گیرد و سس مخصوص به رنگ سرخابی جیغ درمی‌آید! آیا ژولین با جسارت و ظرافت غذا را به شاهکاری مدرن بدل می‌کند؟ ۳۲ پایان خنده‌دار، هوشمندانه و هیجان‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b2-culinary-crisis.webp",
  nodes,
  endings,
});
