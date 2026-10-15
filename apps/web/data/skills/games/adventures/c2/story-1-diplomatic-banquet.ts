import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1 (C2 - Adult Mastery): The Diplomatic Gastronome Catastrophe (ماجرای خنده‌دار ضیافت سفارت و سوپ نامرئی)
// Genre: Humor & Everyday Life (طنز و روزمره)
// CEFR: C2 (Advanced literary inversion, subjunctive mood, sophisticated satire, cleft sentences)
// Characters: Ambassador Lord Sterling, Chief Protocol Officer Beatrice Caldwell, Chef Pierre Moreau
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Scarcely had the ceremonial heralds sounded their fanfare in the gilded ballroom of the British Embassy when disaster struck the grand banquet. The occasion was the ratification of the Continental Trade Accord, attended by eighty dignitaries, sovereign envoys, and the famously acerbic Ambassador Von Klaus. Presiding with forty years of unflappable diplomatic acumen was Ambassador Lord Arthur Sterling, alongside his meticulous Chief of Protocol, Beatrice Caldwell. At the center of the menu stood Chef Pierre Moreau’s culinary masterpiece: a crystal terrine of 'Consommé Royale' simmered for seventy-two hours. Yet, as the silver cloches were lifted with theatrical flourishes, the silver tureen proved entirely vacant—save for a single floating sprig of French parsley and a handwritten sticky note in erratic cursive: 'The diplomatic parrot has absconded with the broth; improvise with alacrity!' Across the banquet table, Von Klaus raised an inquisitorial monocle, his thin lips twitching with acerbic suspicion.",
    keywords: [
      { word: "acerbic", meaningFa: "تند و تیز، تلخ‌زبان و نیش‌دار", phonetic: "/əˈsɜːbɪk/" },
      { word: "acumen", meaningFa: "تیزهوشی، بصیرت و زیرکی دیپلماتیک", phonetic: "/ˈækjəmən/" },
      { word: "alacrity", meaningFa: "چابکی، اشتیاق و سرعت عمل بالا", phonetic: "/əˈlækrəti/" },
      { word: "absconded", meaningFa: "فرار کرده، دزدکی گریخته", phonetic: "/əbˈskɒndɪd/" },
    ],
    question: {
      promptEn: "What bizarre mishap was revealed when the silver cloches were theatrically lifted?",
      promptFa: "وقتی سرپوش‌های نقره‌ای با تشریفات برداشته شدند، چه خرابکاری عجیبی معلوم شد؟",
      options: [
        "The crystal soup tureen was empty except for a sprig of parsley and a note blaming the parrot",
        "A live diplomatic parrot was perched on the chandelier singing opera anthems",
        "The soup had accidentally turned solid purple due to excessive beetroot extract",
      ],
      correctIndex: 0,
      hintSnippet: "the silver tureen proved entirely vacant—save for a single floating sprig of French parsley and a handwritten sticky note",
      clueFa: "خط ششم و هفتم رو ببین دوست من؛ ظرف سوپ کاملاً خالی بود و فقط یک شاخه جعفری و یه یادداشت دستی توش بود که می‌گفت طوطی سوپ رو برده!",
    },
    choiceA: {
      labelEn: "Proclaim the empty dish to be a revolutionary conceptual dish of 'Zen Minimalism' and toast to visionary diplomacy!",
      labelFa: "ظرف خالی را با اعتماد‌به‌نفس کامل به عنوان 'سوپ نامرئی مینیمال' معرفی کن و به افتخار دیپلماسی مدرن جام را بالا ببر!",
      descriptionFa: "تبدیل یک سوتی وحشتناک به شاهکار هنری قرن با حاضر‌جوابی اشرافی و جذاب.",
    },
    choiceB: {
      labelEn: "Signal Beatrice to stage a distraction while Chef Pierre whips up an emergency fondue from the embassy cellar!",
      labelFa: "به بئاتریس چشمک بزن تا سر مهمان‌ها را با موسیقی گرم کند تا سرآشپز سریع یک پنیر فوندوی اورژانسی بیاورد!",
      descriptionFa: "نجات آبروی سفارت پشت پرده با عطر پنیر سوئیسی و شوخ‌طبعی انگلیسی.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Lord Sterling did not flinch; rather, he stood with consummate gravitas, raising his crystal chalice toward the vaulted fresco. 'Excellencies,' he proclaimed, his baritone resonating through the hushed hall, 'tonight we present the pinnacle of post-modern gastronomy: the Essence of Atmospheric Purity. To appreciate this broth requires not pedestrian palate, but geopolitical imagination!' Ambassador Von Klaus stared into his empty porcelain bowl, sniffed the scented steam of thin air, and furrowed his bushy brows. Seldom had diplomacy demanded such earnest contemplation of nothingness. Beside the velvet drapery, Beatrice held her breath, clutching the embassy fire extinguisher lest Pierre’s backup kitchen antics ignite the antique drapes.",
    keywords: [
      { word: "consummate", meaningFa: "کامل، بی‌عیب‌ونقص و در اوج مهارت", phonetic: "/ˈkɒnsəmət/" },
      { word: "gravitas", meaningFa: "وقار، سنگینی و هیبت باشکوه", phonetic: "/ˈɡrævɪtɑːs/" },
      { word: "pedestrian", meaningFa: "معمولی، پیش‌پاافتاده و کسل‌کننده", phonetic: "/pəˈdestriən/" },
      { word: "contemplation", meaningFa: "تامل عمیق، ژرف‌اندیشی و مراقبه", phonetic: "/ˌkɒntəmˈpleɪʃn/" },
    ],
    question: {
      promptEn: "How did Lord Sterling cleverly justify the vacant soup bowl to the assembly?",
      promptFa: "لرد استرلینگ چطور با زیرکی خالی بودن کاسه سوپ را جلوی مهمان‌ها توجیه کرد؟",
      options: [
        "He termed it 'Atmospheric Purity', demanding high geopolitical imagination to savor it",
        "He claimed the chef was fasting for an ancient maritime festival",
        "He blamed customs regulations for delaying the broth shipment at Dover",
      ],
      correctIndex: 0,
      hintSnippet: "tonight we present the pinnacle of post-modern gastronomy: the Essence of Atmospheric Purity",
      clueFa: "خط سوم و چهارم رو ببین؛ گفت این اوج غذای پست‌مدرنه، یعنی 'جوهر خلوص اتمسفری' که فقط ذهن‌های دیپلماتیک می‌تونن مزه‌اش رو حس کنن!",
    },
    choiceA: {
      labelEn: "Invite Von Klaus to articulate the subtle political notes of the 'invisible broth' before the press corps!",
      labelFa: "فون کلاوس را ترغیب کن تا طعم‌های نمادین این 'سوپ نامرئی' را برای خبرنگاران تحلیل کند!",
      descriptionFa: "انداختن توپ در زمین حریف تا خودش با زبون خودش هنر سفارت را تحسین کند.",
    },
    choiceB: {
      labelEn: "Segue swiftly to the second course: a savory black truffle soufflé brought out by synchronized footmen!",
      labelFa: "بلافاصله با بشکن دستور بده پیشخدمت‌ها با رژه باشکوه سوفله قارچ دنبلان سیاه را روی میز بگذارند!",
      descriptionFa: "پوشاندن ماجرا با یک شاهکار معطر واقعی قبل از اینکه کسی شک کند.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Beatrice leapt into motion with military precision. She signaled the imperial string quartet to launch into a boisterous Hungarian csárdás, while whispering to the sommelier to uncork double magnums of 1961 Bordeaux. Meanwhile, behind the brass double doors, Chef Pierre was waging war against thirty wheels of Gruyère and Emmental over a roaring gas burner. 'Mon Dieu!' Pierre hissed, his white toque tilted at a precarious sixty-degree angle, 'the rogue parrot is roosting atop the spice rack, pelting my sous-chefs with dried juniper berries!' With an improvised copper cauldron bubbling, the aroma of melted alpine cheese began wafting into the formal salon, causing the austere delegates to glance up with unexpected gluttonous anticipation.",
    keywords: [
      { word: "boisterous", meaningFa: "پرشور، پرهیاهو و پرانرژی", phonetic: "/ˈbɔɪstərəs/" },
      { word: "precarious", meaningFa: "ناپایدار، متزلزل و در آستانه سقوط", phonetic: "/prɪˈkeəriəs/" },
      { word: "austere", meaningFa: "خشک، سخت‌گیر و بی‌لبخند", phonetic: "/ɔːˈstɪə(r)/" },
      { word: "gluttonous", meaningFa: "شکم‌پرستانه، مشتاق پرخوری لذیذ", phonetic: "/ˈɡlʌtənəs/" },
    ],
    question: {
      promptEn: "What culinary emergency was unfolding behind the brass kitchen doors?",
      promptFa: "پشت درهای برنجی آشپزخانه چه بحران خنده‌داری در جریان بود؟",
      options: [
        "Pierre melted mounds of cheese while the parrot pelted cooks with juniper berries",
        "The pastry chef accidentally dropped the wedding cake into the dishwasher",
        "The embassy cellar had flooded with sparkling mineral water",
      ],
      correctIndex: 0,
      hintSnippet: "Pierre was waging war against thirty wheels of Gruyère... the rogue parrot is roosting atop the spice rack, pelting my sous-chefs",
      clueFa: "خط چهارم و پنجم رو نگاه کن رفیق؛ پیر در حال ذوب کردن پنیرها بود در حالی که طوطی بازیگوش از بالای قفسه دانه سرو کوهی به سمت آشپزها پرت می‌کرد!",
    },
    choiceA: {
      labelEn: "Wheel the copper cauldron into the ballroom and declare a rustic Swiss friendship ritual!",
      labelFa: "دیگ مسی پر از پنیر داغ را وسط سالن ببر و رسم دوستی سنتی و صمیمانه سوئیسی راه بینداز!",
      descriptionFa: "شکستن فضای خشک دیپلماتیک و دعوت سفیران به لقمه‌پیچی دور دیگ پنیر.",
    },
    choiceB: {
      labelEn: "Serve the fondue delicately in miniature silver teacups as a bespoke appetizer!",
      labelFa: "فوندو را شیک و مینیاتوری در فنجان‌های نقره‌ای چای سرو کن تا لوکس و اشرافی بماند!",
      descriptionFa: "سرو بی‌نقص و اتوکشیده که حتی سخت‌گیرترین منتقدان تشریفات را شگفت‌زده کند.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "All eyes pivoted to Ambassador Von Klaus. Caught between admitting lack of discernment or feigning transcendental gastronomic acumen, the German diplomat cleared his throat pompously. 'Indeed,' he pontificated, stroking his imperial mustache, 'one detects subtle notes of Himalayan ozone and an allegorical hint of rosemary, symbolizing our unencumbered bilateral trade!' The assembly burst into thunderous applause, and several junior ministers began nodding vigorously, claiming they too tasted the ephemeral notes of diplomatic integrity. Beatrice exchanged a glance of sheer comedic ecstasy with Lord Sterling, who subtly nudged the parrot’s cage keys deeper into his waistcoat pocket.",
    keywords: [
      { word: "pontificated", meaningFa: "با لحن علامه دهر و فخرفروشانه سخن گفت", phonetic: "/pɒnˈtɪfɪkeɪtɪd/" },
      { word: "unencumbered", meaningFa: "بی‌مانع، آزاد از قید و بند و تعرفه", phonetic: "/ˌʌnɪnˈkʌmbəd/" },
      { word: "ephemeral", meaningFa: "زودگذر، گذرا و لطیف", phonetic: "/ɪˈfemərəl/" },
      { word: "discernment", meaningFa: "قدرت تشخیص، بصیرت و تمیز دادن", phonetic: "/dɪˈsɜːnmənt/" },
    ],
    question: {
      promptEn: "What allegorical ingredients did Ambassador Von Klaus claim to discern in the invisible broth?",
      promptFa: "سفیر فون کلاوس ادعا کرد چه طعم‌های نمادینی را در این سوپ نامرئی حس کرده است؟",
      options: [
        "Himalayan ozone and an allegorical hint of rosemary symbolizing free trade",
        "Smoked Baltic salmon with roasted chestnuts of friendship",
        "A hint of aged vinegar representing past historical treaties",
      ],
      correctIndex: 0,
      hintSnippet: "one detects subtle notes of Himalayan ozone and an allegorical hint of rosemary, symbolizing our unencumbered bilateral trade",
      clueFa: "خط دوم و سوم رو بخون؛ ادعا کرد بوی ازون هیمالیا و رزماری نمادین تجارت آزاد رو چشیده تا کم نیاره!",
    },
    choiceA: {
      labelEn: "Draft a hilarious official treaty clause commemorating the 'Invisible Soup Consensus'!",
      labelFa: "یک بند طنزآمیز به قرارداد رسمی اضافه کن و آن را 'توافق تاریخی سوپ نامرئی' بنام!",
      descriptionFa: "جاودانه کردن این حاضر‌جوابی در تاریخ روابط بین‌الملل با لبخند.",
    },
    choiceB: {
      labelEn: "Commission an avant-garde porcelain sculpture of the empty bowl for the United Nations gallery!",
      labelFa: "ماکت چینی این کاسه خالی را به عنوان نماد صداقت دیپلماتیک برای نمایشگاه ژنو بفرست!",
      descriptionFa: "تبدیل یک سوتی به اثر هنری الهام‌بخش در محافل بین‌المللی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Before Von Klaus could interrogate the metaphysical nature of atmospheric soup, eighteen white-gloved footmen advanced in synchronization, depositing golden ramekins of black truffle soufflé that quivered like autumn leaves. The intoxicating perfume of Périgord truffles instantly banished all lingering skepticism. Lord Sterling toasted the room with effortless wit: 'Having purified our palates with intellectual ether, we now ground our friendship in the earth’s richest harvest!' Even the dour finance minister from Luxembourg broke into a broad grin, enthusiastically devouring his portion with un-diplomatic haste.",
    keywords: [
      { word: "quivered", meaningFa: "لرزید، تکان‌های ظریف و لرزان خورد", phonetic: "/ˈkwɪvəd/" },
      { word: "intoxicating", meaningFa: "مست‌کننده، سرمست‌کننده و بی‌نهایت دلپذیر", phonetic: "/ɪnˈtɒksɪkeɪtɪŋ/" },
      { word: "skepticism", meaningFa: "تردید، شک‌گرایی و بدبینی", phonetic: "/ˈskeptɪsɪzəm/" },
      { word: "dour", meaningFa: "اخمو، عبوس و سخت‌گیر", phonetic: "/dʊə(r)/" },
    ],
    question: {
      promptEn: "How did the presentation of the truffle soufflés affect the banquet's tense atmosphere?",
      promptFa: "آوردن سوفله‌های قارچ دنبلان چه تاثیری روی فضای پرتنش ضیافت گذاشت؟",
      options: [
        "The heavenly aroma immediately dispelled all skepticism, bringing smiles to the delegates",
        "It caused a theological argument about vegetarian protocols",
        "The delegates refused to eat until the chef apologized in Latin",
      ],
      correctIndex: 0,
      hintSnippet: "The intoxicating perfume of Périgord truffles instantly banished all lingering skepticism",
      clueFa: "خط سوم رو ببین؛ عطر مست‌کننده قارچ دنبلان پرگورد تمام شک و تردیدها رو شست و حتی وزیر اخمو رو هم به خنده انداخت.",
    },
    choiceA: {
      labelEn: "Auction the chef’s secret truffle recipe to fund youth diplomatic scholarships across Europe!",
      labelFa: "دستورپخت سری این سوفله را برای بورسیه تحصیلی جوانان نخبه دیپلمات به حراج بگذار!",
      descriptionFa: "اقدامی فرهنگی و ماندگار که محبوبیت سفارت را دوچندان می‌کند.",
    },
    choiceB: {
      labelEn: "Invite Chef Pierre out to receive a standing ovation from the ambassadors!",
      labelFa: "سرآشپز پیر را با همان کلاه کج به سالن بیاور تا کل سفیران برایش ایستاده دست بزنند!",
      descriptionFa: "تجلیل از قهرمان گمنام آشپزخانه در برابر چشم سران قاره.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "When Lord Sterling rolled the gleaming copper cauldron into the ballroom, an audible gasp swept through the gathering. With practiced charm, Sterling seized an ornamental silver skewer, speared a chunk of crusty sourdough, and plunged it into the swirling golden fondue. 'Forget stuffy protocol!' Sterling announced, 'In the Alps, true brothers share from the same pot. He who drops his bread into the cheese must buy the next round of champagne!' Von Klaus’s eyes glittered; discarding his formal gloves, the formidable statesman stepped forward: 'Challenge accepted, Arthur!' Within ten minutes, prime ministers and ambassadors were cheering around the cauldron like schoolboys.",
    keywords: [
      { word: "skewer", meaningFa: "سیخ فلزی یا چوبی باریک", phonetic: "/ˈskjuːə(r)/" },
      { word: "formidable", meaningFa: "مهیب، پرابهت و سرسخت", phonetic: "/ˈfɔːmɪdəbl/" },
      { word: "audible", meaningFa: "شنیدنی، قابل شنیدن و رسا", phonetic: "/ˈɔːdəbl/" },
      { word: "protocol", meaningFa: "تشریفات و آداب رسمی دولتی", phonetic: "/ˈprəʊtəkɒl/" },
    ],
    question: {
      promptEn: "What playful Swiss rule did Lord Sterling introduce to engage the ambassadors around the fondue?",
      promptFa: "لرد استرلینگ چه قانون سنتی و بامزه‌ای را برای گرم کردن بازی دور دیگ پنیر مطرح کرد؟",
      options: [
        "Whoever dropped bread into the cheese pot had to buy the next round of champagne",
        "Everyone had to sing a traditional alpine yodel before taking a bite",
        "The ambassador with the cleanest fork would draft the treaty preamble",
      ],
      correctIndex: 0,
      hintSnippet: "He who drops his bread into the cheese must buy the next round of champagne!",
      clueFa: "خط چهارم رو نگاه کن؛ گفت هر کی نونش توی دیگ بیفته باید دست‌به‌جیب بشه و دور بعدی نوشیدنی رو برای همه مهمون کنه!",
    },
    choiceA: {
      labelEn: "Award Von Klaus a ceremonial golden cheese fondue fork as the Accord's official trophy!",
      labelFa: "یک چنگال طلایی فوندو به عنوان یادبود صلح و برادری به فون کلاوس اهدا کن!",
      descriptionFa: "هدیه‌ای نمادین و خنده‌دار که برای همیشه در ویترین سفارت برلین خواهد درخشید.",
    },
    choiceB: {
      labelEn: "Establish an annual 'Embassy Fondue Summit' in the Swiss Alps to resolve international disputes!",
      labelFa: "یک اجلاس سالانه 'فوندوی دیپلماتیک' در آلپ تاسیس کن تا اختلافات جهانی با پنیر داغ حل شوند!",
      descriptionFa: "راهکاری دوستانه و نبوغ‌آمیز برای صلح جهانی دور دیگ غذای گرم.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Presented in fragile Georgian silver teacups, the frothy cheese fondue was infused with kirschwasser and white truffles, masquerading as 'Velouté Alpine'. The diplomats sipped with ecclesiastical reverence. 'Sublime,' murmured the French ambassador, tilting his cup, 'an audacity of texture that borders on the miraculous!' Meanwhile, in the rafters above, Maximilian the parrot quietly peered down through the crystal chandelier, his emerald feathers dusted with flour. He let out a loud squawk that sounded uncannily like 'Hear, hear!' The assembly chuckled warmly, assuming it was a ventriloquist stunt arranged by the flamboyant British hosts.",
    keywords: [
      { word: "ecclesiastical", meaningFa: "کلیسایی، روحانی و آمیخته به احترام عمیق", phonetic: "/ɪˌkliːziˈæstɪkl/" },
      { word: "audacity", meaningFa: "جسارت، بی‌باکی و ساختارشکنی", phonetic: "/ɔːˈdæsəti/" },
      { word: "ventriloquist", meaningFa: "شعبده‌باز یا عروسک‌گردان صداساز (صدا از شکم)", phonetic: "/venˈtrɪləkwɪst/" },
      { word: "sublime", meaningFa: "والا، شکوهمند و بی‌نهایت دل‌انگیز", phonetic: "/səˈblaɪm/" },
    ],
    question: {
      promptEn: "What caused the delegates to chuckle warmly while sipping their cups of cheese velouté?",
      promptFa: "چه اتفاقی باعث خنده صمیمانه سفیران هنگام چشیدن فنجان‌های پنیر شد؟",
      options: [
        "The parrot squawked 'Hear, hear!' from the chandelier, sounding like a comedic stunt",
        "The butler accidentally dropped an empty tray that made a musical chime",
        "The French ambassador composed an impromptu rhyming poem about melted cheese",
      ],
      correctIndex: 0,
      hintSnippet: "Maximilian the parrot quietly peered down... let out a loud squawk that sounded uncannily like 'Hear, hear!'",
      clueFa: "خط چهارم و پنجم رو ببین دوست من؛ طوطی از بالای لوستر فریاد زد 'احسنت، احسنت!' و همه فکر کردن شیرین‌کاری از پیش هماهنگ‌شده میزبانه!",
    },
    choiceA: {
      labelEn: "Lure Maximilian down with a candied walnut and dub him the Official Diplomatic Mascot!",
      labelFa: "طوطی را با یک گردوی شیرین پایین بیاور و او را 'سفیر افتخاری پرندگان' اعلام کن!",
      descriptionFa: "آشتی دادن همه با شیطنت‌های طوطی و تبدیل او به ستاره شبکه خبرنگاران.",
    },
    choiceB: {
      labelEn: "Offer a witty toast in three languages crediting the parrot with ratifying the trade accord!",
      labelFa: "یک سلامتی سه زبانه به افتخار طوطی بگو که با صدای بلند موافقتش را با پیمان تجاری اعلام کرد!",
      descriptionFa: "شادی و قهقهه مهمانان در اوج هنر دیپلماسی دوستانه.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "The treaty ratification room transformed into a chamber of spirited satire. The chief legal counsel penned Article 42, declaring that 'whereas true concord exists beyond material manifestation, signatory nations pledge transparency lighter than consommé.' Ambassadors queued up with fountain pens, eager to sign what the morning press was already hailing as 'The Zen Treaty of Mayfair'. Von Klaus signed with a dramatic flourish: 'In forty years of drafting protocols, never have I signed an accord with such genuine mirth!'",
    keywords: [
      { word: "concord", meaningFa: "وفاق، هماهنگی و همبستگی ملی", phonetic: "/ˈkɒŋkɔːd/" },
      { word: "manifestation", meaningFa: "نمود عینی، تجلی و ظهور مادی", phonetic: "/ˌmænɪfeˈsteɪʃn/" },
      { word: "mirth", meaningFa: "شادی، نشاط و خنده از صمیم قلب", phonetic: "/mɜːθ/" },
      { word: "flourish", meaningFa: "حرکت نمایشی، امضای زیبا و با خطوط چشم‌نواز", phonetic: "/ˈflʌrɪʃ/" },
    ],
    question: {
      promptEn: "What was the witty essence of Article 42 inserted into the continental accord?",
      promptFa: "جوهر طنزآمیز بند ۴۲ که به پیمان بین‌المللی اضافه شد چه بود؟",
      options: [
        "Signatory nations pledged mutual transparency lighter and purer than consommé",
        "Every official banquet must henceforth serve double portions of French fries",
        "Diplomatic couriers were banned from traveling with pet parrots",
      ],
      correctIndex: 0,
      hintSnippet: "signatory nations pledge transparency lighter than consommé",
      clueFa: "خط دوم رو ببین؛ کشورهای عضو متعهد شدند شفافیت روابطشون حتی از سوپ نامرئی هم زلال‌تر و سبک‌تر باشه!",
    },
    choiceA: {
      labelEn: "Frame the signed Article 42 in 24-carat gold leaf for the Foreign Office atrium!",
      labelFa: "متن امضاشده بند ۴۲ را با ورق طلای ۲۴ عیار برای ورودی وزارت خارجه قاب کن!",
      descriptionFa: "یادبودی دائمی از روزی که شوخ‌طبعی انگلیسی به داد صلح جهانی رسید.",
    },
    choiceB: {
      labelEn: "Publish an authorized satirical memoir titled 'Broth of Concord' for public libraries!",
      labelFa: "کتاب طنز رسمی با نام 'عصاره وفاق' برای عموم مردم چاپ کن تا همه بخندند!",
      descriptionFa: "کتابی پرفروش که نشان می‌دهد سیاستمداران هم بلدند به خودشان بخندند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Word of the 'Invisible Gastronomy' reached the international art guild in Geneva within hours. Sculptor Jean-Luc Vaneck unveiled a transparent hand-blown Murano glass chalice titled 'The Ambassador's Broth', celebrating the triumphs of conceptual rhetoric over culinary dogma. Art patrons flew in from Zurich and Milan to marvel at the sculpture placed in the embassy courtyard, raising their glasses to diplomatic ingenuity.",
    keywords: [
      { word: "rhetoric", meaningFa: "بلاغت، سخن‌وری و فن بیان شیوا", phonetic: "/ˈretərɪk/" },
      { word: "dogma", meaningFa: "عقاید خشک، تعصب و باور جزمی", phonetic: "/ˈdɒɡmə/" },
      { word: "ingenuity", meaningFa: "نبوغ، خلاقیت و هوش سرشار", phonetic: "/ˌɪndʒəˈnjuːəti/" },
      { word: "chalice", meaningFa: "جام نفیس، قدح شراب یا ظرف پایه‌دار", phonetic: "/ˈtʃælɪs/" },
    ],
    question: {
      promptEn: "What art piece did sculptor Jean-Luc Vaneck unveil to honor the diplomatic incident?",
      promptFa: "ژان لوک ونک برای تجلیل از این ماجرا از چه اثر هنری پرده‌برداری کرد؟",
      options: [
        "A transparent Murano glass chalice celebrating conceptual rhetoric over dogma",
        "A bronze statue of Chef Pierre holding an oversized soup ladle",
        "A mosaic of Ambassador Von Klaus eating roasted chestnuts",
      ],
      correctIndex: 0,
      hintSnippet: "Jean-Luc Vaneck unveiled a transparent hand-blown Murano glass chalice titled 'The Ambassador's Broth'",
      clueFa: "خط دوم رو بخون؛ یک جام کریستال مورانو شفاف ساخت به نام 'سوپ سفیر' که نماد پیروزی خلاقیت کلامی بود.",
    },
    choiceA: {
      labelEn: "Host a global gala in Geneva auctioning replicas for global famine relief!",
      labelFa: "در ژنو یک جشن بزرگ خیریه برای کمک به ریشه‌کنی گرسنگی در جهان برگزار کن!",
      descriptionFa: "تبدیل یک نماد هنری به لقمه نان برای نیازمندان واقعی دنیا.",
    },
    choiceB: {
      labelEn: "Donate the original sculpture to the British Museum's permanent Enlightenment collection!",
      labelFa: "مجسمه اصلی را به بخش دائمی عصر روشنگری در موزه بریتانیا اهدا کن!",
      descriptionFa: "ثبت همیشگی این شوخی تاریخی در قلب یکی از بزرگ‌ترین موزه‌های جهان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The impromptu auction of Chef Pierre’s truffle recipe sparked a feverish bidding war among the culinary-minded ambassadors. Ambassador De Smet of Belgium opened at ten thousand euros; the Italian delegate countered with twenty thousand; finally, Lord Harrington offered fifty thousand euros with the proviso that the recipe be published freely in European cooking academies. Cheering erupted, and Pierre wiped tears of joy from his flour-stained apron.",
    keywords: [
      { word: "feverish", meaningFa: "پرتب‌وتاب، پرهیجان و پرشور", phonetic: "/ˈfiːvərɪʃ/" },
      { word: "proviso", meaningFa: "شرط لازم، قید و تبصره قراردادی", phonetic: "/prəˈvaɪzəʊ/" },
      { word: "culinary", meaningFa: "آشپزی، مربوط به پخت‌وپز و خوراک‌شناسی", phonetic: "/ˈkʌlɪnəri/" },
      { word: "impromptu", meaningFa: "فی‌البداهه، بی‌مقدمه و خودجوش", phonetic: "/ɪmˈprɒmptjuː/" },
    ],
    question: {
      promptEn: "What noble condition was attached to the winning fifty-thousand-euro bid?",
      promptFa: "چه شرط ارزشمندی ضمیمه پیشنهاد برنده ۵۰ هزار یورویی شد؟",
      options: [
        "The recipe had to be published freely across European culinary academies",
        "Chef Pierre had to cook exclusively for the House of Lords for five years",
        "The recipe was to be kept in a vault beneath the Swiss National Bank",
      ],
      correctIndex: 0,
      hintSnippet: "with the proviso that the recipe be published freely in European cooking academies",
      clueFa: "خط سوم و چهارم رو ببین؛ شرط کرد که این دستورپخت محرمانه به صورت رایگان در اختیار تمام دانشکده‌های آشپزی اروپا قرار بگیره!",
    },
    choiceA: {
      labelEn: "Inaugurate the 'Pierre Moreau Scholarship' for underprivileged young pastry apprentices!",
      labelFa: "بنیاد بورسیه 'پیر مورو' را برای کارآموزان بااستعداد اما کم‌بضاعت افتتاح کن!",
      descriptionFa: "حمایت از استعدادهای جوانی که رویای سرآشپز شدن در سر دارند.",
    },
    choiceB: {
      labelEn: "Publish a beautiful illustrated cookbook containing Pierre's secret embassy menus!",
      labelFa: "کتاب آشپزی مصور و نفیسی از منوهای مخفی سفارتخانه منتشر کن!",
      descriptionFa: "کتابی جذاب که رازهای آشپزی سیاسی را با قلمی صمیمی بازگو کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Chef Pierre stepped onto the parquet flooring of the ballroom, still clutching his wooden whisk like an admiral’s baton. The ambassadors rose in unison, applauding with thunderous vigor. Von Klaus bowed with solemn theatricality: 'Mon cher Pierre, you have taught us that in diplomacy, as in pastry, perfection is not rigid conformity, but the sublime courage to rise above the flames!' The applause rattled the crystal chandeliers, and Pierre beamed with triumphant Gallic pride.",
    keywords: [
      { word: "unison", meaningFa: "یکصدا، هماهنگ و همگام", phonetic: "/ˈjuːnɪsn/" },
      { word: "conformity", meaningFa: "پیروی کورکورانه، همرنگ جماعت شدن", phonetic: "/kənˈfɔːməti/" },
      { word: "theatricality", meaningFa: "حالت نمایشی، ژست اغراق‌آمیز و پرزرق‌وبرق", phonetic: "/ˌθiːəˈtrɪkæləti/" },
      { word: "Gallic", meaningFa: "فرانسوی اصیل، مربوط به قوم گل", phonetic: "/ˈɡælɪk/" },
    ],
    question: {
      promptEn: "What profound analogy did Ambassador Von Klaus draw when praising Chef Pierre?",
      promptFa: "سفیر فون کلاوس هنگام تمجید از پیر چه تشبیه زیبایی به کار برد؟",
      options: [
        "In diplomacy as in pastry, perfection is the courage to rise above the flames",
        "Good ambassadors must be seasoned like roasted duck with orange peel",
        "A chef's hat is more powerful than an admiral's ceremonial sword",
      ],
      correctIndex: 0,
      hintSnippet: "in diplomacy, as in pastry, perfection is not rigid conformity, but the sublime courage to rise above the flames",
      clueFa: "خط سوم و چهارم رو ببین؛ گفت در سیاست مثل شیرینی‌پزی، کمال یعنی شجاعت قد کشیدن و نسوختن در میان شعله‌ها!",
    },
    choiceA: {
      labelEn: "Present Pierre with the Grand Cross of the Diplomatic Order of Gastronomy!",
      labelFa: "مدال صلیب بزرگ شوالیه‌های دیپلماسی غذا را به سینه پیر سنجاق کن!",
      descriptionFa: "بالاترین نشانی که یک سرآشپز سفارت می‌تواند به آن افتخار کند.",
    },
    choiceB: {
      labelEn: "Appoint Pierre the honorary chancellor of the annual European state banquets!",
      labelFa: "پیر را به عنوان ناظر ارشد و افتخاری تمام ضیافت‌های سران اروپا برگزین!",
      descriptionFa: "سپرده شدن مدیریت تمام جشن‌های بین‌المللی به دستان معجزه‌گر او.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "The presentation of the solid golden fondue fork to Ambassador Von Klaus became the legendary snapshot of the diplomatic season. Clad in his starched tuxedo, the iron diplomat brandished the glittering fork like Poseidon’s trident, declaring that he would defend the principles of shared bread and alpine camaraderie in every parliamentary debate. Journalists clambered on chairs, their camera flashes illuminating the most cheerful treaty summit in European history.",
    keywords: [
      { word: "camaraderie", meaningFa: "رفاقت، صمیمیت و همدلی میان دوستان", phonetic: "/ˌkæməˈrɑːdəri/" },
      { word: "brandished", meaningFa: "در هوا چرخاند، با غرور به نمایش گذاشت", phonetic: "/ˈbrændɪʃt/" },
      { word: "starched", meaningFa: "آهارزده، شق‌ورق و بسیار رسمی", phonetic: "/stɑːtʃt/" },
      { word: "trident", meaningFa: "نیزه سه‌شاخه خدای دریاها (پوزئیدون)", phonetic: "/ˈtraɪdnt/" },
    ],
    question: {
      promptEn: "How did Ambassador Von Klaus playfully hold the ceremonial golden fondue fork?",
      promptFa: "سفیر فون کلاوس چنگال طلایی فوندو را چطور با شوخی در دست گرفت؟",
      options: [
        "He brandished it like Poseidon's trident, vowing to defend camaraderie in parliament",
        "He tucked it into his jacket like a concealed military dagger",
        "He balanced it precariously on the bridge of his aristocratic nose",
      ],
      correctIndex: 0,
      hintSnippet: "the iron diplomat brandished the glittering fork like Poseidon’s trident",
      clueFa: "خط دوم رو ببین دوست من؛ چنگال رو مثل نیزه سه‌شاخه پوزئیدون بالای سر گرفت و گفت از رفاقت و برادری در پارلمان دفاع می‌کنه!",
    },
    choiceA: {
      labelEn: "Design a diplomatic commemorative medal bearing the crossed golden fondue forks!",
      labelFa: "مدال یادبود رسمی با نقش دو چنگال طلایی فوندو به نشانه صلح ضرب کن!",
      descriptionFa: "نمادی جاودان از روزی که پنیر بر اختلافات مرزی پیروز شد.",
    },
    choiceB: {
      labelEn: "Invite all present envoys to carve their initials on the embassy fondue table!",
      labelFa: "از همه سفیران بخواه حروف اول اسمشان را با چاقو یادگاری روی میز چوبی حک کنند!",
      descriptionFa: "میز تاریخی که به نماد برادری دل‌ها در تاریخ سیاست بدل می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "The proposal for an annual 'Alpine Fondue Summit' was ratified with unanimous enthusiasm. The Swiss delegation offered a scenic lodge in the shadow of the Matterhorn, where world leaders would convene annually—strictly without briefing binders, advisors, or ties—to debate climate, trade, and peace over bubbling cauldrons of cheese. Lord Sterling and Beatrice toasted the initiative, marveling at how a runaway parrot had accomplished what twenty committees had failed to achieve.",
    keywords: [
      { word: "unanimous", meaningFa: "به اتفاق آرا، همگانی و بدون مخالف", phonetic: "/juˈnænɪməs/" },
      { word: "convene", meaningFa: "گردهم آمدن، تشکیل جلسه دادن", phonetic: "/kənˈviːn/" },
      { word: "binders", meaningFa: "زونکن‌ها و پرونده‌های سنگین اداری", phonetic: "/ˈbaɪndəz/" },
      { word: "initiative", meaningFa: "ابتکار عمل، طرح نو و پیشگامانه", phonetic: "/ɪˈnɪʃətɪv/" },
    ],
    question: {
      promptEn: "What unique rule was established for the newly ratified Alpine Fondue Summit?",
      promptFa: "چه قانون خاصی برای اجلاس سالانه فوندو در دامنه‌های ماترهورن تصویب شد؟",
      options: [
        "Leaders would meet strictly without ties, briefing binders, or political aides",
        "Every speech had to be delivered while ski-jumping over snowbanks",
        "Only diplomats with culinary degrees could cast voting ballots",
      ],
      correctIndex: 0,
      hintSnippet: "world leaders would convene annually—strictly without briefing binders, advisors, or ties",
      clueFa: "خط دوم و سوم رو نگاه کن؛ سران دنیا باید بدون کراوات، بدون زونکن‌های خسته‌کننده و بدون مشاور دور دیگ غذا بشینن و گپ بزنن!",
    },
    choiceA: {
      labelEn: "Erect a brass plaque at the Swiss alpine lodge dedicated to 'Maximilian the Peacemaker'!",
      labelFa: "یک لوح برنجی در کلبه کوهستانی سوئیس به یاد 'ماکسیمیلیان، طوطی صلح‌آفرین' نصب کن!",
      descriptionFa: "قدردانی از پرنده‌ای که آغازگر این گفت‌وگوی صمیمی بود.",
    },
    choiceB: {
      labelEn: "Organize the inaugural winter torchlight fondue banquet for eighty international youths!",
      labelFa: "اولین ضیافت زمستانه با مشعل را برای ۸۰ جوان نخبه از سراسر دنیا در آلپ ترتیب بده!",
      descriptionFa: "تربیت نسلی از دیپلمات‌های آینده که صلح را با دوستی و لبخند می‌آموزند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Lured by Beatrice’s candied walnut, Maximilian fluttered down onto Lord Sterling’s shoulder with regal nonchalance. Wearing a miniature tricolor ribbon tied by the sommelier, the parrot promptly bowed toward the German ambassador and announced in a clear, resonant whistle: 'Treaty ratified! More walnuts!' The room dissolved into unrestrained laughter. Even the stern security guards behind the pillars buried their faces in white handkerchiefs to conceal their mirth.",
    keywords: [
      { word: "nonchalance", meaningFa: "خونسردی، بی‌خیالی و بی‌اعتنایی شاهانه", phonetic: "/ˈnɒnʃələns/" },
      { word: "regal", meaningFa: "شاهانه، اشرافی و باوقار", phonetic: "/ˈriːɡl/" },
      { word: "unrestrained", meaningFa: "مهارنشده، بی‌اختیار و رها", phonetic: "/ˌʌnrɪˈstreɪnd/" },
      { word: "tricolor", meaningFa: "سه رنگ (مانند پرچم ملی فرانسه یا ایتالیا)", phonetic: "/ˈtrɪkələ(r)/" },
    ],
    question: {
      promptEn: "What did the parrot Maximilian announce upon landing on Lord Sterling's shoulder?",
      promptFa: "طوطی ماکسیمیلیان بعد از فرود آمدن روی شانه لرد استرلینگ چه کلماتی به زبان آورد؟",
      options: [
        "'Treaty ratified! More walnuts!' in a clear, resonant whistle",
        "'Long live the King and down with taxes!' in theatrical Latin",
        "'Beware the cheese fondue is too salty!' in flawless French",
      ],
      correctIndex: 0,
      hintSnippet: "announced in a clear, resonant whistle: 'Treaty ratified! More walnuts!'",
      clueFa: "خط سوم رو ببین؛ با سوتی رسا گفت: 'قرارداد تایید شد! گردوی بیشتر بیارید!' و همه از خنده غش کردند.",
    },
    choiceA: {
      labelEn: "Register Maximilian officially in the Foreign Office civil service registry with full pension!",
      labelFa: "ماکسیمیلیان را با حقوق بازنشستگی و بیمه در دفتر رسمی کارکنان وزارت خارجه ثبت کن!",
      descriptionFa: "ثبت طنزآمیز اولین طوطی کارمند دولت با حقوق گردوی روزانه.",
    },
    choiceB: {
      labelEn: "Commission a royal oil portrait of Maximilian perched on the ambassadorial lectern!",
      labelFa: "یک تابلوی رنگ‌روغن باشکوه از ماکسیمیلیان روی تریبون سفارت سفارش بده!",
      descriptionFa: "تابلویی دیدنی که در سرسرای کاخ سفارت کنار پرتره نخست‌وزیران نصب شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Lord Sterling raised his crystal flute, delivering a toast in English, French, and German that would be studied in diplomatic colleges for decades: 'To our feathered envoy, who understood that true negotiations require not empty grandiloquence, but the sweet crunch of common sense!' Glasses clinked across the hall, ringing like silver bells. The trade accord was formally signed ten minutes later, without a single contentious amendment.",
    keywords: [
      { word: "grandiloquence", meaningFa: "گزافه‌گویی، کلمات پرطمطراق و قلمبه‌سلمبه", phonetic: "/ɡrænˈdɪləkwəns/" },
      { word: "contentious", meaningFa: "بحث‌برانگیز، پرمناقشه و تنش‌زا", phonetic: "/kənˈtenʃəs/" },
      { word: "amendment", meaningFa: "متمم، اصلاحیه قانونی یا تبصره الحاقی", phonetic: "/əˈmendmənt/" },
      { word: "flute", meaningFa: "گیلاس باریک پایه‌دار مخصوص نوشیدنی تشریفاتی", phonetic: "/fluːt/" },
    ],
    question: {
      promptEn: "What central truth did Lord Sterling highlight in his three-language toast?",
      promptFa: "لرد استرلینگ در سلامتی سه زبانه‌اش روی چه حقیقت مهمی دست گذاشت؟",
      options: [
        "True negotiations require not empty grandiloquence, but the sweet crunch of common sense",
        "All diplomatic problems can be resolved by increasing tariff duties",
        "A banquet without cheese is like an ocean without water",
      ],
      correctIndex: 0,
      hintSnippet: "true negotiations require not empty grandiloquence, but the sweet crunch of common sense",
      clueFa: "خط دوم رو ببین؛ گفت مذاکرات واقعی به واژه‌های قلمبه‌سلمبه و ادعا نیاز نداره، بلکه به عقل سلیم و دلگرمی مشترک محتاجه!",
    },
    choiceA: {
      labelEn: "Host an annual diplomatic garden party at Kew Gardens celebrating feathered wildlife!",
      labelFa: "یک جشن سالانه در باغ سلطنتی کیو برای حمایت از پرندگان و حیات وحش ترتیب بده!",
      descriptionFa: "پیوند دادن سیاست با محیط زیست و حفظ زیبایی‌های آفرینش.",
    },
    choiceB: {
      labelEn: "Award Sterling and Beatrice the Royal Sovereign Medal of Diplomatic Harmony!",
      labelFa: "مدال سلطنتی هماهنگی دیپلماتیک را به استرلینگ و بئاتریس تقدیم کن!",
      descriptionFa: "پاداش بالاترین درایت و حاضر‌جوابی در آرام‌ترین شب تاریخ لندن.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "The morning broadsheets erupted in praise of the 'Golden Leaf Clause'. The Times declared that where statesmen usually hide behind opaque verbiage, the Mayfair Summit had elevated humor into high art. Lord Sterling and Beatrice stood before the gilded atrium, unveiling the framed calligraphy of Article 42 before hundreds of cheering civil servants.",
    keywords: [
      { word: "verbiage", meaningFa: "اطناب کلام، پرگویی بیهوده و واژگان توخالی", phonetic: "/ˈvɜːbiɪdʒ/" },
      { word: "broadsheets", meaningFa: "روزنامه‌های معتبر قطع بزرگ", phonetic: "/ˈbrɔːdʃiːts/" },
      { word: "opaque", meaningFa: "مبهم، کدر و غیرقابل فهم", phonetic: "/əʊˈpeɪk/" },
      { word: "calligraphy", meaningFa: "خوشنویسی، خطاطی هنرمندانه", phonetic: "/kəˈlɪɡrəfi/" },
    ],
    question: {
      promptEn: "How did The Times describe the achievement of the Mayfair Summit?",
      promptFa: "روزنامه تایمز دستاورد این گردهمایی در لندن را چگونه توصیف کرد؟",
      options: [
        "It declared that humor had been elevated into high art over opaque verbiage",
        "It criticized the diplomats for making light of serious tariff laws",
        "It demanded an immediate audit of the embassy's kitchen expenditures",
      ],
      correctIndex: 0,
      hintSnippet: "The Times declared that where statesmen usually hide behind opaque verbiage, the Mayfair Summit had elevated humor into high art",
      clueFa: "خط دوم رو ببین؛ نوشت در حالی که سیاستمدارها پشت واژه‌های گنگ قایم میشن، این نشست شوخ‌طبعی رو به یک هنر ناب تبدیل کرد.",
    },
    choiceA: {
      labelEn: "Clink crystal glasses with Beatrice in celebration of timeless British diplomacy!",
      labelFa: "با بئاتریس به افتخار پیروزی پایدار دیپلماسی دوستانه جام بلورین را بنوش!",
      descriptionFa: "پایانی شاد، اصیل و فراموش‌نشدنی.",
    },
    choiceB: {
      labelEn: "Address the parliamentary press corps with a triumphant, warm-hearted speech!",
      labelFa: "جلوی خبرنگاران پارلمان سخنرانی گرم و دلنشینی درباره قدرت لبخند ایراد کن!",
      descriptionFa: "پیامی الهام‌بخش برای تمام کسانی که باور دارند خنده پل ارتباطی انسان‌هاست.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Published as a charming pocket edition, 'The Broth of Concord' became an overnight literary sensation across forty nations. Proceeds funded thirty state-of-the-art community kitchens in working-class neighborhoods, proving that genuine mirth can feed both the intellect and the hungry.",
    keywords: [
      { word: "sensation", meaningFa: "پدیده جنجالی، رویداد شگفت‌انگیز و پرطرفدار", phonetic: "/senˈseɪʃn/" },
      { word: "proceeds", meaningFa: "عواید حاصل از فروش، درآمد خالص خیرخواهانه", phonetic: "/ˈprəʊsiːdz/" },
      { word: "working-class", meaningFa: "طبقه کارگر، زحمتکشان جامعه", phonetic: "/ˌwɜːkɪŋ ˈklɑːs/" },
      { word: "intellect", meaningFa: "عقل، خرد و قوه تفکر انسان", phonetic: "/ˈɪntəlekt/" },
    ],
    question: {
      promptEn: "How were the profits of the pocketbook 'The Broth of Concord' utilized?",
      promptFa: "عواید حاصل از فروش این کتابچه جیبی چگونه مصرف شد؟",
      options: [
        "They funded thirty community kitchens in working-class neighborhoods",
        "They paid for an exotic yacht tour for the ambassador's staff",
        "They bought golden cages for rare imported parakeets",
      ],
      correctIndex: 0,
      hintSnippet: "Proceeds funded thirty state-of-the-art community kitchens in working-class neighborhoods",
      clueFa: "خط دوم رو نگاه کن؛ تمام درآمدش خرج ساخت ۳۰ آشپزخانه مجهز خیریه برای محله‌های کارگری شد.",
    },
    choiceA: {
      labelEn: "Distribute the very first bowl of hot stew personally to neighborhood families!",
      labelFa: "اولین کاسه سوپ داغ آشپزخانه خیریه را خودت با لبخند به دست خانواده‌ها بده!",
      descriptionFa: "خدمت به مردم با همان دلی که برای صلح جهانی می‌تپد.",
    },
    choiceB: {
      labelEn: "Ring the ceremonial brass gong celebrating the hundredth community meal served!",
      labelFa: "ناقوس برنجی یادبود را برای صدمین وعده غذای پربرکت به صدا درآور!",
      descriptionFa: "شادی در دل جامعه در کنار مردمی که طعم مهربانی را چشیده‌اند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The Geneva International Charity Gala was a resounding triumph. The hand-blown Murano glass chalice was auctioned to an anonymous philanthropist for four million Swiss francs, guaranteeing school meal programs for half a million children across arid regions. Jean-Luc and Beatrice embraced on stage amidst standing ovations.",
    keywords: [
      { word: "philanthropist", meaningFa: "انسان‌دوست، نیکوکار و خیر بزرگ", phonetic: "/fɪˈlænθrəpɪst/" },
      { word: "resounding", meaningFa: "چشمگیر، پرطنين و پیروزمندانه", phonetic: "/rɪˈzaʊndɪŋ/" },
      { word: "arid", meaningFa: "خشک، کم‌آب و قحطی‌زده", phonetic: "/ˈærɪd/" },
      { word: "ovation", meaningFa: "تشویق ایستاده، ابراز احساسات گرم حاضران", phonetic: "/əʊˈveɪʃn/" },
    ],
    question: {
      promptEn: "What humanitarian achievement did the Murano glass chalice auction accomplish?",
      promptFa: "حراج جام شیشه‌ای مورانو چه دستاورد انسان‌دوستانه‌ای به همراه داشت؟",
      options: [
        "It guaranteed school meals for half a million children in arid regions",
        "It paid for the construction of a new golf resort in the Alps",
        "It funded private vocal coaching for the diplomatic parrot",
      ],
      correctIndex: 0,
      hintSnippet: "guaranteeing school meal programs for half a million children across arid regions",
      clueFa: "خط دوم و سوم رو ببین؛ با پولش برنامه غذای مدارس برای نیم میلیون کودک در مناطق محروم تامین شد.",
    },
    choiceA: {
      labelEn: "Cut the inaugural ribbon of the Global Children's Nutrition Fund!",
      labelFa: "روبان افتتاح صندوق جهانی تغذیه کودکان را با لبخند قیچی کن!",
      descriptionFa: "اقدامی الهام‌بخش که جهان را جای بهتری برای زیستن می‌کند.",
    },
    choiceB: {
      labelEn: "Clink flutes of sparkling cider with the international relief delegates!",
      labelFa: "با نمایندگان بین‌المللی امدادرسانی به سلامتی کودکان دنیا جام بنوش!",
      descriptionFa: "جشنی ماندگار برای پیروزی امید بر رنج انسان‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "In the Enlightenment Gallery of the British Museum, the empty porcelain bowl was placed between Isaac Newton’s prism and Voltaire’s quill. The plaque bore Lord Sterling’s words: 'Here rests the soup that never was, yet bound twenty nations in eternal good humor.' Schoolchildren and scholars flocked to view the quirky relic daily.",
    keywords: [
      { word: "relic", meaningFa: "یادگار کهن، اثر تاریخی ماندگار", phonetic: "/ˈrelɪk/" },
      { word: "flocked", meaningFa: "دسته‌دسته آمدند، هجوم آوردند", phonetic: "/flɒkt/" },
      { word: "prism", meaningFa: "منشور نوری برای تجزیه نور", phonetic: "/ˈprɪzəm/" },
      { word: "quill", meaningFa: "قلم‌پر باستانی برای نگارش", phonetic: "/kwɪl/" },
    ],
    question: {
      promptEn: "Where was the famous empty porcelain bowl permanently installed?",
      promptFa: "کاسه چینی خالی معروف برای همیشه در کجا قرار گرفت؟",
      options: [
        "In the British Museum's Enlightenment Gallery between Newton's prism and Voltaire's quill",
        "In the kitchen cupboard of the French ambassador in Paris",
        "In a private safe at the Bank of England",
      ],
      correctIndex: 0,
      hintSnippet: "In the Enlightenment Gallery of the British Museum, the empty porcelain bowl was placed between Isaac Newton’s prism and Voltaire’s quill",
      clueFa: "خط اول و دوم رو نگاه کن؛ در موزه بریتانیا درست بین منشور نیوتن و قلم‌پر ولتر به عنوان نماد روشنگری گذاشته شد.",
    },
    choiceA: {
      labelEn: "Lead the inaugural museum tour for young history students with a joyful chuckle!",
      labelFa: "اولین تور بازدید موزه را با خنده برای بچه‌های علاقه‌مند به تاریخ هدایت کن!",
      descriptionFa: "یاد دادن تاریخ با زبان شیرین و خاطره‌انگیز به نسل نو.",
    },
    choiceB: {
      labelEn: "Write the concluding sentence in the museum's golden commemorative guestbook!",
      labelFa: "جمله پایانی دفترچه یادبود طلایی موزه را با خطی خوش امضا کن!",
      descriptionFa: "ثبت خاطره‌ای جاودان در دل تاریخ فرهنگ و ادب.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The 'Pierre Moreau Scholarship' welcomed its first cohort of forty aspiring young chefs from remote mountain villages. Clad in crisp white jackets, the apprentices learned the secrets of pastry and diplomacy alike under Pierre's affectionate tutelage. 'Remember,' Pierre shouted happily, 'a great sauce needs patience, but a great life needs laughter!'",
    keywords: [
      { word: "cohort", meaningFa: "گروه هم‌دوره، ورودی‌های یک دوره آموزشی", phonetic: "/ˈkəʊhɔːt/" },
      { word: "tutelage", meaningFa: "آموزش و مربی‌گری، تحت سرپرستی بودن", phonetic: "/ˈtjuːtɪlɪdʒ/" },
      { word: "aspiring", meaningFa: "مشتاق، پرانگیزه و آرزومند پیشرفت", phonetic: "/əˈspaɪərɪŋ/" },
      { word: "affectionate", meaningFa: "مهربان، پرمهر و صمیمی", phonetic: "/əˈfekʃənət/" },
    ],
    question: {
      promptEn: "What inspiring motto did Pierre share with his young culinary apprentices?",
      promptFa: "پیر چه شعار دلنشینی را به کارآموزان جوان آشپزی‌اش آموخت؟",
      options: [
        "A great sauce needs patience, but a great life needs laughter",
        "Never cook soup on rainy days without an umbrella",
        "Diplomats should always pay double for dessert",
      ],
      correctIndex: 0,
      hintSnippet: "a great sauce needs patience, but a great life needs laughter",
      clueFa: "جمله آخر رو ببین؛ گفت یک سس عالی به صبر نیاز داره، اما یک زندگی فوق‌العاده به خنده و شادی احتیاج داره!",
    },
    choiceA: {
      labelEn: "Taste-test forty golden soufflés prepared by the graduating apprentice class!",
      labelFa: "چهل سوفله طلایی پخته‌شده به دست کارآموزان فارغ‌التحصیل را با لبخند بچش!",
      descriptionFa: "طعم موفقیت نسل جوان در بزرگ‌ترین جشن قنادی پایتخت.",
    },
    choiceB: {
      labelEn: "Present each student with an engraved silver whisk to launch their culinary careers!",
      labelFa: "به هر دانشجو یک همزن نقره‌ای یادگاری برای شروع مسیر درخشانش هدیه بده!",
      descriptionFa: "هدیه‌ای نمادین و ارزشمند برای فردای روشن شاگردان پیر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The illustrated state cookbook topped global bestseller lists for forty consecutive weeks. Featuring watercolor sketches of the banquet and candid behind-the-scenes recipes, the book taught millions of households that great food is an act of shared affection rather than aristocratic pretension.",
    keywords: [
      { word: "consecutive", meaningFa: "پی‌درپی، متوالی و پشت‌سرهم", phonetic: "/kənˈsekjətɪv/" },
      { word: "pretension", meaningFa: "تظاهر، خودنمایی و فخرفروشی بیجا", phonetic: "/prɪˈtenʃn/" },
      { word: "candid", meaningFa: "بی‌پرده، خودمانی و بدون روتوش", phonetic: "/ˈkændɪd/" },
      { word: "affection", meaningFa: "محبت، مهر و علاقه صمیمانه", phonetic: "/əˈfekʃn/" },
    ],
    question: {
      promptEn: "What moral did millions of readers draw from the illustrated state banquet cookbook?",
      promptFa: "میلیون‌ها خواننده از این کتاب آشپزی چه پیام اخلاقی دلنشینی گرفتند؟",
      options: [
        "Great food is an act of shared affection rather than aristocratic pretension",
        "Cooking with truffles should be mandatory for all government banquets",
        "Silver cloches must be inspected three times before serving",
      ],
      correctIndex: 0,
      hintSnippet: "great food is an act of shared affection rather than aristocratic pretension",
      clueFa: "خط سوم رو ببین دوست من؛ یاد گرفتند که غذای عالی نشانه محبت مشترک آدم‌هاست نه فخرفروشی اشرافی!",
    },
    choiceA: {
      labelEn: "Sign copies for a long queue of cheerful home cooks at the London Book Fair!",
      labelFa: "کتاب را برای صف طولانی علاقه‌مندان در نمایشگاه کتاب لندن امضا کن!",
      descriptionFa: "دیدار صمیمانه با مردمی که عشق به آشپزی در دل‌هایشان زنده شده.",
    },
    choiceB: {
      labelEn: "Host a nationwide family bake-off broadcast live on national television!",
      labelFa: "مسابقه سراسری پخت شیرینی خانوادگی در تلویزیون با شور و نشاط برگزار کن!",
      descriptionFa: "آوردن خنده و عطر نان و شیرینی تازه به خانه‌های مردم.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "At Buckingham Palace, Chef Pierre Moreau knelt on the crimson velvet cushion to receive the Grand Cross. As the medal was pinned to his chef's whites, Pierre leaned forward and whispered to the monarch: 'Your Majesty, if the kitchen ever catches fire, serve cheese immediately!' The monarch erupted into royal laughter.",
    keywords: [
      { word: "crimson", meaningFa: "زرشکی، سرخ آتشین و اشرافی", phonetic: "/ˈkrɪmzn/" },
      { word: "monarch", meaningFa: "پادشاه یا ملکه، حاکم ارشد کشور", phonetic: "/ˈmɒnək/" },
      { word: "cushion", meaningFa: "بالشتک مخملی تشریفاتی", phonetic: "/ˈkʊʃn/" },
      { word: "kneeling", meaningFa: "زانو زدن به نشانه احترام در مراسم اعطای نشان", phonetic: "/ˈniːlɪŋ/" },
    ],
    question: {
      promptEn: "What witty culinary advice did Pierre whisper to the monarch during his knighthood?",
      promptFa: "پیر موقع گرفتن نشان افتخار چه شوخی بامزه‌ای در گوش پادشاه گفت؟",
      options: [
        "'Your Majesty, if the kitchen ever catches fire, serve cheese immediately!'",
        "'Beware of diplomat parrots when ordering afternoon tea'",
        "'Never trust a soup that smells of cold air'",
      ],
      correctIndex: 0,
      hintSnippet: "whispered to the monarch: 'Your Majesty, if the kitchen ever catches fire, serve cheese immediately!'",
      clueFa: "خط سوم رو بخون؛ به پادشاه گفت: 'اعلی‌حضرت، اگر روزی آشپزخونه آتیش گرفت، بی‌معطلی پنیر ذوب‌شده سرو کنید!'",
    },
    choiceA: {
      labelEn: "Step out into the palace courtyard to greet the cheering culinary guild!",
      labelFa: "به حیاط کاخ بیا و به تشویق‌های پرشور صنف آشپزان با افتخار پاسخ بده!",
      descriptionFa: "افتخاری بزرگ برای تمام زحمتکشان و هنرمندان عرصه آشپزی.",
    },
    choiceB: {
      labelEn: "Raise a celebratory flute of cider with Lord Sterling and Beatrice!",
      labelFa: "جام نوشیدنی را با لرد استرلینگ و بئاتریس به یاد آن شب تاریخی بنوش!",
      descriptionFa: "پایان شیرین همکاری دوستانی که بحران را به حماسه بدل کردند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "As Honorary Chancellor of European State Banquets, Pierre decreed three unbreakable golden rules: first, no speech could exceed eight minutes; second, every table must feature warm bread and honest butter; third, laughter was declared the mandatory aperitif of peace.",
    keywords: [
      { word: "decreed", meaningFa: "حکم داد، قانون رسمی و قاطع صادر کرد", phonetic: "/dɪˈkriːd/" },
      { word: "aperitif", meaningFa: "پیش‌غذا یا نوشیدنی آغازین اشتهاآور", phonetic: "/əˈperətɪf/" },
      { word: "unbreakable", meaningFa: "شکست‌ناپذیر، نقض‌نشدنی و قطعی", phonetic: "/ʌnˈbreɪkəbl/" },
      { word: "mandatory", meaningFa: "اجباری، الزامی و ضروری", phonetic: "/ˈmændətəri/" },
    ],
    question: {
      promptEn: "What was Pierre's third unbreakable rule for all European state banquets?",
      promptFa: "قانون طلایی سوم پیر برای تمام ضیافت‌های سران اروپا چه بود؟",
      options: [
        "Laughter was declared the mandatory aperitif of peace",
        "Every ambassador had to wear a white apron during dessert",
        "Wine must only be served from antique copper decanters",
      ],
      correctIndex: 0,
      hintSnippet: "third, laughter was declared the mandatory aperitif of peace",
      clueFa: "خط سوم رو ببین دوست من؛ تصویب کرد که خنده و روی گشاده، اشتهاآور اجباری برای صلح در همه ضیافت‌هاست!",
    },
    choiceA: {
      labelEn: "Bang the chancellor's gavel to inaugurate the Vienna Peace Summit banquet!",
      labelFa: "چکش ریاست را برای آغاز ضیافت صلح وین با شکوه بر میز بکوب!",
      descriptionFa: "شروع عصری تازه در روابط کشورها با عطر صلح و آرامش.",
    },
    choiceB: {
      labelEn: "Share a warm basket of fresh croissants with the young diplomatic attachés!",
      labelFa: "یک سبد کروسان داغ را با دیپلمات‌های جوان با محبت تقسیم کن!",
      descriptionFa: "یاد دادن رفاقت و صمیمیت به جوانانی که آینده جهان را می‌سازند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The newly struck Diplomatic Peace Medal featuring crossed golden fondue forks was officially minted in Zurich. At the unveiling, Lord Sterling joked that while ancient emperors conquered with iron swords, modern diplomats unite humanity with cheese forks and shared goodwill.",
    keywords: [
      { word: "minted", meaningFa: "ضرب شد (سکه یا مدال رسمی)", phonetic: "/ˈmɪntɪd/" },
      { word: "goodwill", meaningFa: "حسن نیت، خیرخواهی و دوستی راستین", phonetic: "/ˌɡʊdˈwɪl/" },
      { word: "unveiling", meaningFa: "رونمایی، پرده‌برداری از یک اثر", phonetic: "/ʌnˈveɪlɪŋ/" },
      { word: "conquered", meaningFa: "فتح کردند، تسخیر کردند", phonetic: "/ˈkɒŋkəd/" },
    ],
    question: {
      promptEn: "What humorous contrast did Lord Sterling highlight at the medal unveiling?",
      promptFa: "لرد استرلینگ در مراسم رونمایی مدال چه مقایسه خنده‌داری انجام داد؟",
      options: [
        "Emperors conquered with iron swords, but modern diplomats unite humanity with cheese forks",
        "Old treaties were written in blood, but new ones are stained with olive oil",
        "Gold medals are heavier than silver soup spoons",
      ],
      correctIndex: 0,
      hintSnippet: "while ancient emperors conquered with iron swords, modern diplomats unite humanity with cheese forks",
      clueFa: "خط دوم رو ببین؛ گفت پادشاهان قدیم با شمشیر جهانگشایی می‌کردند، اما دیپلمات‌های امروز با چنگال پنیر و مهربانی دل‌ها رو یکی می‌کنن!",
    },
    choiceA: {
      labelEn: "Pin the very first Peace Medal on Ambassador Von Klaus with a joyful salute!",
      labelFa: "اولین مدال صلح را با احترامی دوستانه به سینه سفیر فون کلاوس نصب کن!",
      descriptionFa: "تجلیل از دوستی که در روزهای سخت کنار هم ایستادند.",
    },
    choiceB: {
      labelEn: "Hang the ceremonial medal in the main conference hall of the United Nations!",
      labelFa: "مدال یادبود را در سرسرای اصلی سازمان ملل متحد با افتخار نصب کن!",
      descriptionFa: "یادآوری همیشگی برای همه که صلح با رفاقت به دست می‌آید.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The rustic oak fondue table, bearing eighty carved diplomatic initials, was placed on permanent display in the Peace Palace in The Hague. Beneath Lord Sterling’s initials 'A.S.' and Von Klaus’s 'V.K.', visitors read the engraved proverb: 'Where bread is shared, borders dissolve.'",
    keywords: [
      { word: "dissolve", meaningFa: "حل شدن، از بین رفتن و محو شدن مرزها", phonetic: "/dɪˈzɒlv/" },
      { word: "initials", meaningFa: "حروف اختصاری نام و نام خانوادگی", phonetic: "/ɪˈnɪʃlz/" },
      { word: "proverb", meaningFa: "ضرب‌المثل، پند آموزنده و کهن", phonetic: "/ˈprɒvɜːb/" },
      { word: "rustic", meaningFa: "روستایی، چوبی ساده و طبیعی", phonetic: "/ˈrʌstɪk/" },
    ],
    question: {
      promptEn: "What inspiring proverb was engraved beneath the carved initials on the historic table?",
      promptFa: "چه پند زیبایی زیر حروف اختصاری روی میز تاریخی حک شده بود؟",
      options: [
        "'Where bread is shared, borders dissolve'",
        "'Silence is golden, but soup is hotter'",
        "'Never leave a parrot unattended in a wine cellar'",
      ],
      correctIndex: 0,
      hintSnippet: "visitors read the engraved proverb: 'Where bread is shared, borders dissolve'",
      clueFa: "خط آخر رو نگاه کن دوست من؛ حک کرده بودند: 'جایی که نان مشترک تقسیم شود، مرزها رنگ می‌بازند.'",
    },
    choiceA: {
      labelEn: "Trace the carved letters with your fingers in quiet gratitude for global friendship!",
      labelFa: "حروف حک‌شده روی چوب را با آرامش و سپاسگزاری از دوستی لمس کن!",
      descriptionFa: "لحظه‌ای عرفانی و سرشار از صلح در سکوت کاخ لاهه.",
    },
    choiceB: {
      labelEn: "Invite school groups to sit around the table and listen to the humorous legend!",
      labelFa: "دانش‌آموزان را دور میز بنشان و ماجرای خنده‌دار آن شب را با قصه برایشان بگو!",
      descriptionFa: "انتقال درس صلح و مدارا با قصه و لبخند به نسل آینده.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "High in the Swiss Alps, the brass plaque of 'Maximilian the Peacemaker' caught the golden sunrise over the Matterhorn. Mountaineers and international delegates hiking the scenic trail often paused to salute the plaque, chuckling at the plaque’s final line: 'Dedicated to the only parrot who ever ratified a European tariff treaty.'",
    keywords: [
      { word: "plaque", meaningFa: "پلاک یادبود، لوح فلزی کتیبه‌دار", phonetic: "/plɑːk/" },
      { word: "mountaineers", meaningFa: "کوه‌نوردان و صخره‌نوردان", phonetic: "/ˌmaʊntəˈnɪəz/" },
      { word: "tariff", meaningFa: "تعرفه گمرکی و بازرگانی", phonetic: "/ˈtærɪf/" },
      { word: "scenic", meaningFa: "چشم‌نواز، دارای مناظر طبیعی تماشایی", phonetic: "/ˈsiːnɪk/" },
    ],
    question: {
      promptEn: "What funny inscription concluded the alpine plaque dedicated to the parrot?",
      promptFa: "کدام جمله خنده‌دار در انتهای لوح یادبود طوطی در آلپ حک شده بود؟",
      options: [
        "'Dedicated to the only parrot who ever ratified a European tariff treaty'",
        "'Beware of low-flying parakeets in snowstorms'",
        "'This bird ate thirty kilograms of dried juniper berries'",
      ],
      correctIndex: 0,
      hintSnippet: "Dedicated to the only parrot who ever ratified a European tariff treaty",
      clueFa: "خط سوم رو ببین؛ نوشته بودند: 'تقدیم به تنها طوطی جهان که یک قرارداد تعرفه بازرگانی را در اروپا به تصویب رساند!'",
    },
    choiceA: {
      labelEn: "Yodel a joyful alpine salute toward the snow-capped peaks in celebration!",
      labelFa: "فریاد شادمانه کوهستانی (یودل) در دل کوه‌های برفی آلپ سر بده!",
      descriptionFa: "طنین شادی و نشاط در هوای پاکیزه قله‌ها.",
    },
    choiceB: {
      labelEn: "Pour hot chocolate for the weary hiking companions around the roaring fireplace!",
      labelFa: "برای همسفران کوهنوردت دور شومینه کلبه شکلات داغ بریز!",
      descriptionFa: "صفا و صمیمیت در کلبه کوهستانی پس از فتح قله‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Under starry alpine skies, eighty young students from twenty countries gathered around a colossal fondue cauldron lit by roaring pine torches. Clinking forks and laughing over lost crusts of bread, they formed bonds of friendship that would transcend any future political dispute. From the cabin balcony, Sterling and Beatrice watched with content smiles.",
    keywords: [
      { word: "colossal", meaningFa: "غول‌پیکر، بسیار عظیم و باشکوه", phonetic: "/kəˈlɒsl/" },
      { word: "transcend", meaningFa: "فراتر رفتن، چیره شدن بر محدودیت‌ها", phonetic: "/trænˈsend/" },
      { word: "torches", meaningFa: "مشعل‌های فروزان آتشین", phonetic: "/ˈtɔːtʃɪz/" },
      { word: "dispute", meaningFa: "اختلاف، مناقشه و دعوای سیاسی", phonetic: "/dɪˈspjuːt/" },
    ],
    question: {
      promptEn: "What heartwarming scene unfolded under the starry skies of the Swiss Alps?",
      promptFa: "زیر آسمان پرستاره آلپ چه صحنه دلنشین و صمیمانه‌ای رقم خورد؟",
      options: [
        "Eighty international students bonded over cheese and pine torches in lasting friendship",
        "The students staged a mock debate about border customs regulations",
        "An unexpected avalanche forced the lodge to cancel dinner",
      ],
      correctIndex: 0,
      hintSnippet: "eighty young students from twenty countries gathered around a colossal fondue cauldron lit by roaring pine torches",
      clueFa: "خط اول و دوم رو ببین؛ ۸۰ دانشجوی جوان از بیست کشور دور دیگ عظیم فوندو با مشعل جمع شدند و پیمان دوستی ابدی بستند.",
    },
    choiceA: {
      labelEn: "Raise a wooden mug of alpine cider to toast the future leaders of the world!",
      labelFa: "لیوان چوبی نوشیدنی را به سلامتی رهبران فردای جهان بالا ببر!",
      descriptionFa: "امید به فردایی روشن‌تر با جوانانی که همدلی را برگزیده‌اند.",
    },
    choiceB: {
      labelEn: "Join the students in singing traditional folk songs around the crackling campfire!",
      labelFa: "با جوانان هم‌صدا شو و دور آتش سرودهای شاد محلی بخوان!",
      descriptionFa: "شبی جادویی و پیوندی عمیق میان نسل‌ها در دل کوهستان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Maximilian the parrot sat proudly on his custom mahogany perch in the Foreign Office lobby, adorned with a miniature civil service badge. His daily duties included tasting dried fruit shipments and greeting visiting prime ministers with cheerful squawks of 'Order, order!' He became the most beloved diplomatic figure in Whitehall.",
    keywords: [
      { word: "perch", meaningFa: "شاخه یا جایگاه نشستن پرنده", phonetic: "/pɜːtʃ/" },
      { word: "adorned", meaningFa: "آراسته شده، مزین به مدال", phonetic: "/əˈdɔːnd/" },
      { word: "civil service", meaningFa: "خدمات اداری دولتی و دیوان‌سالاری", phonetic: "/ˌsɪvl ˈsɜːvɪs/" },
      { word: "beloved", meaningFa: "محبوب، عزیز و دوست‌داشتنی", phonetic: "/bɪˈlʌvd/" },
    ],
    question: {
      promptEn: "What playful 'daily duty' did Maximilian perform at the Foreign Office lobby?",
      promptFa: "ماکسیمیلیان در لابی وزارت خارجه چه وظیفه اداری بامزه‌ای داشت؟",
      options: [
        "Tasting dried fruit shipments and squawking 'Order, order!' to prime ministers",
        "Carrying secret encrypted telegrams to the Prime Minister's residence",
        "Guarding the front entrance against unauthorized stray cats",
      ],
      correctIndex: 0,
      hintSnippet: "His daily duties included tasting dried fruit shipments and greeting visiting prime ministers with cheerful squawks of 'Order, order!'",
      clueFa: "خط دوم رو ببین؛ محموله‌های میوه خشک رو تست می‌کرد و به نخست‌وزیران با فریاد شاد 'نظم جلسه را رعایت کنید!' خوشامد می‌گفت!",
    },
    choiceA: {
      labelEn: "Hand Maximilian a plump golden walnut with a fond scratch behind his ears!",
      labelFa: "یک گردوی طلایی چاق به ماکسیمیلیان بده و پرهای پشت سرش را نوازش کن!",
      descriptionFa: "دوستی صمیمانه با باهوش‌ترین پرنده دنیای دیپلماسی.",
    },
    choiceB: {
      labelEn: "Photograph visiting heads of state smiling beside the diplomatic parrot!",
      labelFa: "عکس‌های خندان رهبران کشورهای دیگر در کنار این طوطی دوست‌داشتنی را ثبت کن!",
      descriptionFa: "روابط عمومی جذاب و پرطرفداری که اخم سیاستمداران را به لبخند بدل می‌کند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The life-size oil portrait of Maximilian perched on the ambassadorial lectern was unveiled in the grand ballroom. Painted with baroque grandeur, the parrot possessed an expression of supreme statesmanship that rivaled Gladstone or Disraeli. Below the frame was written in gold: 'In Memory of the Scribe of Concord.'",
    keywords: [
      { word: "statesmanship", meaningFa: "هنر دولتمردی، کاردانی سیاسی و تدبیر مملکت", phonetic: "/ˈsteɪtsmənʃɪp/" },
      { word: "lectern", meaningFa: "تریبون سخنرانی، میز خطابه", phonetic: "/ˈlektən/" },
      { word: "baroque", meaningFa: "باروک، پرنقش‌ونگار و باشکوه کلاسیک", phonetic: "/bəˈrɒk/" },
      { word: "scribe", meaningFa: "کاتب، نویسنده اسناد رسمی و تاریخی", phonetic: "/skraɪb/" },
    ],
    question: {
      promptEn: "What inscription was gilded below the majestic oil painting of Maximilian?",
      promptFa: "چه جمله‌ای با طلا زیر تابلوی رنگ‌روغن باشکوه ماکسیمیلیان نقش بسته بود؟",
      options: [
        "'In Memory of the Scribe of Concord'",
        "'The Parrot Who Knew Too Much'",
        "'Feathers Before Formalities'",
      ],
      correctIndex: 0,
      hintSnippet: "Below the frame was written in gold: 'In Memory of the Scribe of Concord.'",
      clueFa: "خط آخر رو نگاه کن دوست من؛ با طلا حک کرده بودند: 'به یاد کاتب صلح و وفاق.'",
    },
    choiceA: {
      labelEn: "Raise a silent glass of port to the painted portrait under the chandeliers!",
      labelFa: "جام چای یا نوشیدنی را در سکوت احترام زیر لوسترها به سوی پرتره بالا ببر!",
      descriptionFa: "احترامی باشکوه به نماد حاضر‌جوابی و درایت سفارت.",
    },
    choiceB: {
      labelEn: "Invite gallery patrons to admire the masterly feather brushstrokes up close!",
      labelFa: "مهمانان را دعوت کن تا ظرافت قلم‌مو در نقاشی پرهای طوطی را از نزدیک ببینند!",
      descriptionFa: "تجلیل از شاهکار نقاشی که طنز و وقار را در هم آمیخته است.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The annual Kew Gardens Wildlife Jubilee attracted fifty thousand Londoners to celebrate feathered wildlife. Under blooming cherry blossoms, children competed in bird-sketching contests while brass bands played cheerful marches. Lord Sterling cut the commemorative cake, reminding all that nature always holds the finest lessons in harmony.",
    keywords: [
      { word: "jubilee", meaningFa: "جشن بزرگ، سالگرد باشکوه و شادمانی ملی", phonetic: "/ˈdʒuːbɪliː/" },
      { word: "harmony", meaningFa: "هارمونی، هماهنگی و همزیستی مسالمت‌آمیز", phonetic: "/ˈhɑːməni/" },
      { word: "blossoms", meaningFa: "شکوفه‌های بهاری درختان", phonetic: "/ˈblɒsəmz/" },
      { word: "feathered", meaningFa: "پردار، متعلق به پرندگان", phonetic: "/ˈfeðəd/" },
    ],
    question: {
      promptEn: "What lesson did Lord Sterling share while cutting the cake at Kew Gardens?",
      promptFa: "لرد استرلینگ هنگام بریدن کیک در باغ کیو چه پیامی به مردم داد؟",
      options: [
        "Nature always holds the finest lessons in harmony",
        "Every bird should be taught to sing the national anthem",
        "Diplomats should always garden before attending conferences",
      ],
      correctIndex: 0,
      hintSnippet: "reminding all that nature always holds the finest lessons in harmony",
      clueFa: "خط سوم رو ببین؛ به همه یادآوری کرد که طبیعت همیشه زیباترین و اصیل‌ترین درس‌های صلح و هماهنگی را به ما می‌آموزد.",
    },
    choiceA: {
      labelEn: "Hand slices of strawberry cake to smiling children gathered around the podium!",
      labelFa: "برش‌های کیک توت‌فرنگی را با خنده میان کودکان شادمان پخش کن!",
      descriptionFa: "بخشیدن شادی و شیرینی به دل پاک کودکان.",
    },
    choiceB: {
      labelEn: "Release a flock of white peace doves into the azure London sky!",
      labelFa: "دسته‌ای از کبوتران سپید صلح را در آسمان نیلگون لندن به پرواز درآور!",
      descriptionFa: "نمادی چشم‌نواز از آزادی، آرامش و امید برای زمین.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "In the tranquil private library of the embassy, the Sovereign Medals were placed on velvet display cases. Lord Sterling poured two small snifters of twenty-year-old single malt for himself and Beatrice. Sitting beside the crackling fireplace as rain pattered on the stained glass, Sterling smiled softly: 'My dear Beatrice, we weathered four decades of diplomatic storms, but tonight we proved that the sweetest triumph is simply leaving the world with a smile.'",
    keywords: [
      { word: "snifters", meaningFa: "گیلاس‌های پایه‌کوتاه کریستالی مخصوص نوشیدنی کهن", phonetic: "/ˈsnɪftəz/" },
      { word: "weathered", meaningFa: "از سر گذراندند، پشت سر گذاشتند و مقاومت کردند", phonetic: "/ˈweðəd/" },
      { word: "pattered", meaningFa: "شرشر بارید، صدای ملایم برخورد قطرات باران", phonetic: "/ˈpætəd/" },
      { word: "tranquil", meaningFa: "آرام، بی‌دغدغه و آسوده", phonetic: "/ˈtræŋkwɪl/" },
    ],
    question: {
      promptEn: "What philosophical thought did Lord Sterling share with Beatrice by the fireplace?",
      promptFa: "لرد استرلینگ کنار شومینه چه جمله دلنشین و حکیمانه‌ای به بئاتریس گفت؟",
      options: [
        "The sweetest triumph is simply leaving the world with a smile",
        "Good protocol officers are harder to find than golden chalices",
        "Rainy nights in London require double rations of firewood",
      ],
      correctIndex: 0,
      hintSnippet: "we proved that the sweetest triumph is simply leaving the world with a smile",
      clueFa: "خط آخر رو نگاه کن دوست من؛ گفت شیرین‌ترین پیروزی در زندگی اینه که دنیا رو با یک لبخند ترک کنیم و خاطره‌ای خوش به جا بگذاریم.",
    },
    choiceA: {
      labelEn: "Clink glasses softly beside the warm fireplace in quiet, lifelong camaraderie!",
      labelFa: "لیوان‌ها را کنار شعله‌های گرم شومینه به سلامتی این رفاقت ماندگار به هم بزنید!",
      descriptionFa: "پایانی اصیل، گرم و سرشار از آرامش در دل شب بارانی لندن.",
    },
    choiceB: {
      labelEn: "Close the embassy diary for the season with a content, peaceful smile!",
      labelFa: "دفترچه خاطرات سفارت را برای این فصل با لبخندی آرام و آسوده ببند!",
      descriptionFa: "پایان شاهکاری دیپلماتیک که برای نسل‌ها در یادها خواهد ماند.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Sovereign Toast of Mayfair", titleFa: "سلامتی اشرافی لندن", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان وقار و شکوه", climaxEn: "Under the gilded chandeliers of Mayfair, the diplomatic triumph turns a kitchen mishap into the defining social legend of modern Europe.", climaxFa: "زیر لوسترهای باشکوه لندن، این پیروزی دیپلماتیک خرابکاری آشپزخانه را به ماندگارترین افسانه اجتماعی اروپای نوین بدل کرد.", xpReward: 280 },
  { pathCode: "AAAAB", titleEn: "The Parliamentary Laurels", titleFa: "برگ زرین پارلمان", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان افتخار ملی", climaxEn: "Members of Parliament give Lord Sterling a standing ovation for proving that wit and honesty remain Britain's finest exports.", climaxFa: "نمایندگان پارلمان ایستاده برای استرلینگ کف زدند چون اثبات کرد شوخ‌طبعی و صداقت هنوز ارزشمندترین دارایی‌های کشورند.", xpReward: 275 },
  { pathCode: "AAABA", titleEn: "The Table of the People", titleFa: "سفره پربرکت مردم", badgeCategory: "heroic", badgeIcon: "🍲", badgeNameFa: "پایان مهربانی و خدمت", climaxEn: "Thirty community kitchens serve hot, nourishing meals to thousands of families, born from a book that made the world laugh.", climaxFa: "سی آشپزخانه خیریه به هزاران خانواده غذای گرم رساندند؛ برکتی که از دل کتابی متولد شد که دنیا را به خنده انداخته بود.", xpReward: 280 },
  { pathCode: "AAABB", titleEn: "The Jubilee Gong", titleFa: "طنین ناقوس صفا", badgeCategory: "funny", badgeIcon: "🔔", badgeNameFa: "پایان صمیمی و پرخنده", climaxEn: "The ceremonial gong rings out across the neighborhood as citizens gather with soup bowls, celebrating unity over formality.", climaxFa: "ناقوس برنجی در محله به صدا درآمد و مردم با کاسه‌های سوپ دور هم جمع شدند تا یکدلی را بر تکلف پیروز کنند.", xpReward: 265 },
  { pathCode: "AABAA", titleEn: "The Geneva Ribbon of Hope", titleFa: "روبان امید در ژنو", badgeCategory: "heroic", badgeIcon: "🎗️", badgeNameFa: "پایان نجات‌بخش جهانی", climaxEn: "The Global Children's Nutrition Fund launches with four million francs, ensuring no child goes hungry across arid regions.", climaxFa: "صندوق جهانی تغذیه با ۴ میلیون فرانک آغاز به کار کرد تا هیچ کودکی در مناطق محروم گرسنه سر بر بالین نگذارد.", xpReward: 285 },
  { pathCode: "AABAB", titleEn: "The Toast to the Relief Workers", titleFa: "درود به امدادگران جهان", badgeCategory: "explorer", badgeIcon: "🌍", badgeNameFa: "پایان فرامرزی و انسانی", climaxEn: "Humanitarian workers toast across continents, celebrating an artistic auction that turned laughter into lifesaving nourishment.", climaxFa: "امدادگران در سراسر قاره‌ها به سلامتی حراجی هنری جام نوشیدند که خنده را به غذایی نجات‌بخش برای نیازمندان بدل ساخت.", xpReward: 270 },
  { pathCode: "AABBA", titleEn: "The Scholar of the Empty Bowl", titleFa: "استاد کاسه نامرئی", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان دانایی و آموزش", climaxEn: "Generations of students gaze at the museum exhibit, learning that true enlightenment begins when we cease taking ourselves too seriously.", climaxFa: "نسل‌های پیاپی دانشجویان به تماشای ویترین موزه آمدند تا بیاموزند دانایی راستین زمانی آغاز می‌شود که خود را بیش از حد جدی نگیریم.", xpReward: 275 },
  { pathCode: "AABBB", titleEn: "The Golden Signature", titleFa: "امضای زرین روشنگری", badgeCategory: "legendary", badgeIcon: "✒️", badgeNameFa: "پایان تاریخی و جاودان", climaxEn: "Sterling's closing inscription in the British Museum guestbook is etched in the hearts of visitors as a beacon of diplomatic wit.", climaxFa: "دست‌نوشته پایانی استرلینگ در موزه بریتانیا به عنوان مشعل خرد و شوخ‌طبعی در دل بازدیدکنندگان جاودانه شد.", xpReward: 280 },
  { pathCode: "ABAAA", titleEn: "The Golden Whisk Vanguard", titleFa: "پیشتازان همزن طلایی", badgeCategory: "scholar", badgeIcon: "🍳", badgeNameFa: "پایان شکوفایی جوانان", climaxEn: "Forty young culinary apprentices open artisan bakeries across Europe, proving that patience and joy make the finest ingredients.", climaxFa: "چهل جوان فارغ‌التحصیل قنادی‌های خود را در اروپا گشودند و ثابت کردند صبر و شادی اصیل‌ترین چاشنی‌های زندگی‌اند.", xpReward: 275 },
  { pathCode: "ABAAB", titleEn: "The Apprentice's Oath", titleFa: "سوگند کارآموزان پیر", badgeCategory: "heroic", badgeIcon: "🌟", badgeNameFa: "پایان الهام‌بخش نسل‌ها", climaxEn: "Holding their engraved silver whisks high, the new generation of chefs pledges to feed both the bodies and spirits of mankind.", climaxFa: "با بالا بردن همزن‌های نقره‌ای، نسل جدید آشپزها سوگند یاد کردند که جسم و روح بشریت را با مهر تغذیه کنند.", xpReward: 280 },
  { pathCode: "ABABA", titleEn: "The Bestseller of Joy", titleFa: "پرفروش‌ترین کتاب امید", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان فرهنگی و پرمخاطب", climaxEn: "Two million home cooks master the art of soufflés and smiles, turning kitchens everywhere into sanctuaries of warmth.", climaxFa: "دو میلیون آشپز خانگی هنر پخت سوفله و لبخند را آموختند و آشپزخانه‌ها را به پناهگاه‌های گرمی و صفا بدل ساختند.", xpReward: 270 },
  { pathCode: "ABABB", titleEn: "The Great National Bake-Off", titleFa: "جشن بزرگ شیرینی‌پزی خانوادگی", badgeCategory: "funny", badgeIcon: "🥧", badgeNameFa: "پایان شاداب و مردمی", climaxEn: "Millions tune in to the live television finale as families bake and laugh together, united in delicious confectionery harmony.", climaxFa: "میلیون‌ها خانواده پای تلویزیون به تماشای مسابقه شیرینی‌پزی نشستند و با عطر وانیل و صدای خنده یکی شدند.", xpReward: 265 },
  { pathCode: "ABBAA", titleEn: "The Palace Courtyard Ovation", titleFa: "تشویق پرشور در حیاط کاخ", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان سلطنتی و باشکوه", climaxEn: "Thousands of chefs in starched white uniforms wave spatulas outside Buckingham Palace in tribute to Sir Pierre Moreau.", climaxFa: "هزاران آشپز با کلاه‌ها و کفگیرهایشان در حیاط کاخ باکینگهام برای ادای احترام به سر پیر مورو هلهله کردند.", xpReward: 285 },
  { pathCode: "ABBAB", titleEn: "The Triad of Comradeship", titleFa: "پیمان سه‌گانه یاران وفادار", badgeCategory: "heroic", badgeIcon: "🤝", badgeNameFa: "پایان رفاقت بی‌همتا", climaxEn: "Sterling, Beatrice, and Pierre clink glasses under the stars, knowing that the greatest alliance of all is unfailing loyalty.", climaxFa: "استرلینگ، بئاتریس و پیر زیر آسمان پرستاره جام را بالا بردند؛ با این باور که بزرگ‌ترین پیمان جهان، وفاداری پایدار است.", xpReward: 280 },
  { pathCode: "ABBBA", titleEn: "The Chancellor of Miracles", titleFa: "صدراعظم معجزات خوشمزه", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان بین‌المللی ماندگار", climaxEn: "Pierre bangs the presidential gavel at Vienna, proving that good cuisine and honest smiles resolve disputes faster than armies.", climaxFa: "پیر در وین چکش ریاست را بر میز زد و ثابت کرد خوراک لذیذ و لبخند صادقانه سریع‌تر از لشکرها اختلافات را پایان می‌دهد.", xpReward: 285 },
  { pathCode: "ABBBB", titleEn: "The Croissant of Diplomacy", titleFa: "کروسان آشتی و صمیمیت", badgeCategory: "funny", badgeIcon: "🥐", badgeNameFa: "پایان شیرین و صمیمی", climaxEn: "Young diplomats share warm croissants at sunrise, entering treaty rooms not with icy stares, but with fraternal laughter.", climaxFa: "دیپلمات‌های جوان در سپیده‌دم کروسان داغ خوردند و با خنده‌های برادرانه وارد اتاق مذاکرات صلح شدند.", xpReward: 265 },
  { pathCode: "BAAAA", titleEn: "The Fondue Trident of Peace", titleFa: "سه‌شاخه طلایی صلح و فوندو", badgeCategory: "legendary", badgeIcon: "🔱", badgeNameFa: "پایان حماسی و شوخ‌طبع", climaxEn: "Von Klaus brandishes the crossed-forks medal in the Reichstag, declaring that brotherhood born of cheese is unbreakable.", climaxFa: "فون کلاوس مدال دو چنگال را در پارلمان بالا برد و اعلام کرد برادری زاده‌شده از پنیر داغ هرگز شکست نخواهد خورد.", xpReward: 285 },
  { pathCode: "BAAAB", titleEn: "The Wall of Shared Bread", titleFa: "دیوار نان و برادری در سازمان ملل", badgeCategory: "heroic", badgeIcon: "🕊️", badgeNameFa: "پایان صلح‌طلبانه جهانی", climaxEn: "Delegates from 190 nations salute the crossed fondue forks at the UN entrance, reminded that peace is nourished together.", climaxFa: "نمایندگان ۱۹۰ کشور در ورودی سازمان ملل به نماد دو چنگال درود فرستادند؛ یادآور اینکه صلح با هم‌سفرگی جان می‌گیرد.", xpReward: 280 },
  { pathCode: "BAABA", titleEn: "The Hague Monument to Shared Bread", titleFa: "بنای یادبود نان مشترک در لاهه", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان حقوقی و انسانی", climaxEn: "International jurists convene around the carved oak table, applying the timeless lesson: where bread is broken, hatred falls.", climaxFa: "حقوق‌دانان بین‌المللی دور میز چوبی گرد آمدند و به این حقیقت ایمان آوردند: جایی که نان تقسیم شود، کینه فرو می‌ریزد.", xpReward: 280 },
  { pathCode: "BAABB", titleEn: "The Storyteller of The Hague", titleFa: "قصه‌گوی صلح کاخ لاهه", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آموزنده و دلنشین", climaxEn: "Children gather around the historic table as elderly statesmen recount how a playful dinner saved a continent from discord.", climaxFa: "کودکان دور میز جمع شدند و سیاستمداران برایشان تعریف کردند که چگونه یک شام پرخنده قاره‌ای را از جنگ رهانید.", xpReward: 275 },
  { pathCode: "BABAA", titleEn: "The Matterhorn Yodel of Concord", titleFa: "طنین یودل صلح در ماترهورن", badgeCategory: "explorer", badgeIcon: "🏔️", badgeNameFa: "پایان پرانرژی کوهستان", climaxEn: "The echoes of alpine yodeling roll across snow-dusted glaciers, celebrating the only parrot who ever wrote European history.", climaxFa: "پژواک نغمه‌های کوهستانی در یخچال‌های برفی طنین‌انداز شد تا تنها طوطی تاریخ‌ساز اروپا را در یادها زنده نگه دارد.", xpReward: 275 },
  { pathCode: "BABAB", titleEn: "The Alpine Hearth of Comrades", titleFa: "آتشدان صمیمیت در کلبه کوهستان", badgeCategory: "heroic", badgeIcon: "🔥", badgeNameFa: "پایان گرمابخش و رمانتیک", climaxEn: "Holding steaming mugs of spiced cider, weary mountaineers rest beside the fire, united in the timeless sanctuary of nature.", climaxFa: "با لیوان‌های شکلات داغ، کوهنوردان خسته در کنار شعله‌های آتش آرام گرفتند؛ یکی‌شده در پناهگاه آرامش‌بخش طبیعت.", xpReward: 270 },
  { pathCode: "BABBA", titleEn: "The Torchlit Summit of Youth", titleFa: "مشعل‌داران جوان قله‌های صلح", badgeCategory: "heroic", badgeIcon: "🌄", badgeNameFa: "پایان آینده‌نگر و پرامید", climaxEn: "Eighty young delegates raise their glowing pine torches toward the starry heavens, vowing to lead their nations with empathy.", climaxFa: "هشتاد جوان مشعل‌های فروزان کاج را به سوی آسمان پرستاره گرفتند و عهد بستند که کشورهایشان را با همدلی رهبری کنند.", xpReward: 285 },
  { pathCode: "BABBB", titleEn: "The Alpine Starlight Anthem", titleFa: "سرود ستارگان در دامنه‌های آلپ", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان حماسی و الهام‌بخش", climaxEn: "Folk songs ring out across the snow valleys as the younger generation proves that boundaries disappear when voices unite.", climaxFa: "سرودهای محلی در دره‌های برفی پیچید و نسل جوان اثبات کرد زمانی که صداها یکی شوند، تمام مرزها ناپدید می‌گردند.", xpReward: 280 },
  { pathCode: "BBAAA", titleEn: "The Whitehall Feathered Hero", titleFa: "شوالیه پردار وایت‌هال", badgeCategory: "funny", badgeIcon: "🦜", badgeNameFa: "پایان طنزآمیز و جذاب", climaxEn: "Maximilian munches on golden walnuts on his mahogany throne, greeted by ambassadors who bow before his diplomatic majesty.", climaxFa: "ماکسیمیلیان روی تخت چوب ماهون گردوی طلایی می‌خورد و سفرای جهان در برابر هیبت دیپلماتیکش سر تعظیم فرود می‌آورند.", xpReward: 270 },
  { pathCode: "BBAAB", titleEn: "The Smile of the Statesmen", titleFa: "لبخند دولتمردان در کنار پرنده", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان بانشاط و رسانه‌ای", climaxEn: "Photographs of world leaders laughing with the parrot become the most viral diplomatic campaign in international history.", climaxFa: "عکس‌های خندان رهبران جهان با طوطی به پرطرفدارترین کمپین رسانه‌ای تاریخ روابط بین‌الملل بدل شد.", xpReward: 275 },
  { pathCode: "BBBAA", titleEn: "The Grand Toast to the Scribe", titleFa: "سلامتی اشرافی به کاتب صلح", badgeCategory: "legendary", badgeIcon: "🖼️", badgeNameFa: "پایان فاخر و ماندگار", climaxEn: "Under the embassy chandeliers, dignitaries clink glasses toward the magnificent portrait of the parrot who united a continent.", climaxFa: "زیر لوسترهای سفارت، دولتمردان جام را به افتخار پرتره شکوهمند طوطی که قاره‌ای را متحد ساخت بالا بردند.", xpReward: 285 },
  { pathCode: "BBBAB", titleEn: "The Canvas of Diplomatic Irony", titleFa: "بوم شاهکار طنز دیپلماسی", badgeCategory: "scholar", badgeIcon: "🎨", badgeNameFa: "پایان هنری و آموزنده", climaxEn: "Art lovers marvel at the delicate oil brushstrokes of the feathered diplomat, celebrating that ironies of fate shape history.", climaxFa: "دوستداران هنر به تماشای ضربات قلم‌موی پرتره طوطی نشستند و تجلیل کردند که چطور بازی‌های سرنوشت مسیر تاریخ را عوض می‌کند.", xpReward: 280 },
  { pathCode: "BBBBA", titleEn: "The Jubilee of the Flying Feathers", titleFa: "جشنواره بهاری پرندگان و شکوفه‌ها", badgeCategory: "heroic", badgeIcon: "🌸", badgeNameFa: "پایان شاداب و بهاری", climaxEn: "Fifty thousand Londoners picnic beneath falling cherry blossoms, celebrating that true peace is as light and gentle as a feather.", climaxFa: "پنجاه هزار لندنی زیر بارش شکوفه‌های بهاری جشن گرفتند؛ با این باور که صلح واقعی به سبکی و لطافت یک پر است.", xpReward: 275 },
  { pathCode: "BBBBB", titleEn: "The Doves of the London Twilight", titleFa: "کبوتران سپید در گرگ‌ومیش لندن", badgeCategory: "legendary", badgeIcon: "🕊️", badgeNameFa: "پایان جاودانه و آسمانی", climaxEn: "White doves circle above Big Ben in the azure twilight, carrying the message that kindness and mirth can illuminate the world.", climaxFa: "کبوتران سپید در غروب نیلگون بالای بیگ‌بن به پرواز درآمدند؛ حامل این پیام که مهربانی و خنده تاریکی جهان را می‌زداید.", xpReward: 290 },
];

export const story1DiplomaticBanquet: AdventureStory = buildAdventureStory({
  id: "c2-diplomatic-banquet-satire",
  storyIndex: 1,
  cefr: "C2",
  titleEn: "The Diplomatic Gastronome Catastrophe",
  titleFa: "ماجرای خنده‌دار ضیافت سفارت و سوپ نامرئی",
  genre: "comedy",
  genreLabelFa: "😄 طنز و روزمره",
  genreIcon: "😄",
  synopsisEn:
    "When a runaway protocol parrot absconds with the seventy-two-hour royal consommé minutes before an eighty-nation treaty ratification banquet, Ambassador Lord Sterling, Chief of Protocol Beatrice Caldwell, and eccentric Chef Pierre Moreau must disguise the disaster as 'Zen Minimalist Atmospheric Purity' across 32 uproarious and sophisticated endings.",
  synopsisFa:
    "چند دقیقه قبل از آغاز ضیافت بزرگ شام برای امضای پیمان تجاری با حضور ۸۰ سفیر و دیپلمات عبوس اروپایی، طوطی بازیگوش تشریفات کل سوپ سلطنتی ۷۲ ساعته سرآشپز را می‌رباید! لرد استرلینگ خونسرد، بئاتریس کالدول (مدیر وسواسی تشریفات) و سرآشپز پیر باید کاسه خالی را با حاضر‌جوابی به عنوان 'سوپ مینیمال و نامرئی خلوص جوّی' قالب کنند! ۳۲ پایان پر از طنز فاخر، کنایه‌های هوشمندانه و پیروزی دلنشین در انتظار شماست!",
  coverImage: "/images/skills/reading/c2-diplomatic-banquet.webp",
  nodes,
  endings,
});
