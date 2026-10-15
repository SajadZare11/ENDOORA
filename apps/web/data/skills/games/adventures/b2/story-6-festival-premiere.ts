import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 6 (B2): The Final Reel of Venice (آخرین حلقه فیلم در ونیز)
// Genre: Cinema & Filmmaking (دنیای سینما و فیلم‌سازی)
// CEFR: B2 (Passives, modals of deduction, cinematic terminology, artistic dilemmas)
// Characters: Julian (Director), Sofia (Cinematographer), Matteo (Projectionist), Bianca (Producer), Rossi (Archivist)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "A misty October fog rolled off the Venetian lagoon, curling around the marble pillars of the historic Palazzo del Cinema. Inside the grand auditorium, thirty-two-year-old independent filmmaker Julian adjusted his black tuxedo tie, feeling the sharp pang of adrenaline in his chest. In exactly three hours, eighteen hundred critics, jury members, and international distributors would take their velvet seats for the world premiere of his magnum opus, The Glass Labyrinth. Suddenly, Sofia, his brilliant chief cinematographer, bolted down the aisle with an ashen face: 'Julian, Reel Six—the climactic twenty-minute master cut on thirty-five millimeter Kodak stock—has been taken from the projection booth!'",
    keywords: [
      { word: "magnum opus", meaningFa: "شاهکار زندگی هنری یک هنرمند", phonetic: "/ˌmæɡnəm ˈəʊpəs/" },
      { word: "cinematographer", meaningFa: "مدیر فیلم‌برداری", phonetic: "/ˌsɪnəməˈtɒɡrəfə/" },
      { word: "projection booth", meaningFa: "اتاق آپارات و نمایش فیلم سینما", phonetic: "/prəˈdʒekʃn buːθ/" },
      { word: "stock", meaningFa: "نگاتیو و نوار خام فیلم سینمایی", phonetic: "/stɒk/" },
    ],
    question: {
      promptEn: "What critical item went missing just three hours before the premiere?",
      promptFa: "درست سه ساعت قبل از اکران افتتاحیه چه چیزی ناپدید شد؟",
      options: ["Reel Six: the climactic twenty-minute 35mm master film cut", "Julian's tuxedo shoes", "The Golden Lion trophy"],
      correctIndex: 0,
      hintSnippet: "Reel Six—the climactic twenty-minute master cut on thirty-five millimeter Kodak stock—has been taken",
      clueFa: "به جمله آخر نگاه کن: حلقه ششم فیلم شامل بیست دقیقه اوج داستان از اتاق آپارات به سرقت رفته بود.",
    },
    choiceA: {
      labelEn: "Rush up the winding spiral stairs to inspect the projection booth with Sofia!",
      labelFa: "همراه با سوفیا از پله‌های مارپیچ بالا بدوید تا اتاق آپارات را بررسی کنید!",
      descriptionFa: "شاید سارق یا آپاراتچی کهنه‌کار ردپایی از خود بر جا گذاشته باشند.",
    },
    choiceB: {
      labelEn: "Confront powerful studio executive Bianca in the VIP canal lounge!",
      labelFa: "بیانکا، تهیه‌کننده قدرتمند هالیوودی را در سالن تشریفات بازخواست کن!",
      descriptionFa: "او قبلاً تهدید کرده بود که پایان‌بندی فیلم باید تجاری و عامه‌پسند شود.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "The projection booth was bathed in the warm amber glow of antique vacuum tubes and the scent of cellulose solvent. Matteo, an elderly projectionist who had threaded film reels here for forty-five years, was trembling beside an empty heavy metal canister labeled 'REEL 6 - MASTER NEGATIVE'. 'Signor Julian! Someone bypassed my magnetic security lock while I stepped out for espresso,' Matteo whispered hoarsely. On the velvet drafting table, Julian discovered a heavy wax seal stamped with an emblem: a winged lion over an ancient gondola, the watermark of the historic San Marco Cineteca archive.",
    keywords: [
      { word: "cellulose", meaningFa: "سلولز / ماده سازنده نگاتیو فیلم‌های قدیمی", phonetic: "/ˈseljʊləʊs/" },
      { word: "canister", meaningFa: "قوطی فلزی استوانه‌ای نگهداری نوار فیلم", phonetic: "/ˈkænɪstə/" },
      { word: "bypassed", meaningFa: "دور زد و میان‌بر امنیتی زد", phonetic: "/ˈbaɪpɑːst/" },
      { word: "cineteca", meaningFa: "سینماتک / بایگانی و فیلم‌خانه تاریخی", phonetic: "/ˌtʃɪnəˈtekə/" },
    ],
    question: {
      promptEn: "What emblem was stamped on the wax seal found in the booth?",
      promptFa: "چه نشانه‌ای بر روی مهر مومی پیدا شده در اتاق آپارات حک شده بود؟",
      options: ["A winged lion over an ancient gondola", "A crown with two swords", "A simple red anchor"],
      correctIndex: 0,
      hintSnippet: "a heavy wax seal stamped with an emblem: a winged lion over an ancient gondola",
      clueFa: "مهر مومی متعلق به شیر بالدار روی گوندولای سن مارکو بود.",
    },
    choiceA: {
      labelEn: "Charter a high-speed wooden water taxi to the secluded Cineteca island archive!",
      labelFa: "یک تاکسی قایقی سریع‌السیر به مقصد آرشیو کهن سینماتک در جزیره کرایه کن!",
      descriptionFa: "شاید حلقه برای بررسی یا دستکاری به بایگانی مخفی منتقل شده باشد.",
    },
    choiceB: {
      labelEn: "Review the booth's private surveillance camera tape with Sofia!",
      labelFa: "نوار دوربین مداربسته اختصاصی اتاق آپارات را با سوفیا بازبینی کن!",
      descriptionFa: "چهره فرد ناشناس در آخرین فریم‌های ضبط‌شده نمایان خواهد شد.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Bianca sat in a leather armchair overlooking the Grand Canal, sipping vintage prosecco. She was the influential head of Apex Global Cinema, the studio that had funded forty percent of Julian's production. 'Julian darling, don't look at me like that,' Bianca purred smoothly, though her manicured fingers clenched slightly. 'Your original twenty-minute ending was too bleak for American multiplexes. A tragic ending would destroy our twenty-million-dollar box office projection. Perhaps the universe did you a favor.' Julian noticed a courier slip for Venice Santa Lucia train station sticking out of her designer handbag.",
    keywords: [
      { word: "bleak", meaningFa: "تاریک، تلخ و اندوه‌بار", phonetic: "/bliːk/" },
      { word: "multiplexes", meaningFa: "مجموعه‌های مدرن سینمایی چندسالنه", phonetic: "/ˈmʌltɪpleksɪz/" },
      { word: "courier", meaningFa: "پیک ویژه بار و محموله", phonetic: "/ˈkʊriə/" },
      { word: "prosecco", meaningFa: "نوشیدنی گازدار اصیل ایتالیایی", phonetic: "/prəˈsekəʊ/" },
    ],
    question: {
      promptEn: "What did Julian spot sticking out of Bianca's designer handbag?",
      promptFa: "جولیان چه کاغذی را دید که از کیف دستی بیانکا بیرون زده بود؟",
      options: ["A courier slip for Venice Santa Lucia train station", "An airplane ticket to Paris", "A restaurant receipt"],
      correctIndex: 0,
      hintSnippet: "a courier slip for Venice Santa Lucia train station sticking out of her designer handbag",
      clueFa: "یک برگه ارسال محموله پستی به مقصد ایستگاه قطار سانتا لوسیا ونیز.",
    },
    choiceA: {
      labelEn: "Race by motorized boat to Santa Lucia station to intercept the courier!",
      labelFa: "با قایق موتوری به ایستگاه قطار بتاز تا جلو ارسال محموله را بگیری!",
      descriptionFa: "اگر قطار میلان حرکت کند، نگاتیو اصلی برای همیشه از دست می‌رود.",
    },
    choiceB: {
      labelEn: "Stand your ground and threaten to withdraw the entire movie from the festival!",
      labelFa: "محکم بایست و تهدید کن که کل فیلم را از بخش مسابقه فستیوال بیرون می‌کشی!",
      descriptionFa: "بیانکا نمی‌تواند رسوایی بین‌المللی لغو اکران افتتاحیه را تحمل کند.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "The wooden water taxi carved through black canal ripples, pulling up beside the iron gates of San Marco Cineteca. Inside the subterranean climate-controlled vault, Julian found Signor Rossi, an eighty-year-old historian holding Reel Six under an infrared loupe. 'Julian, do not judge me!' Rossi pleaded with tears in his aged eyes. 'Forty years ago, legendary master Michelangelo Antonioni shot secret alternate frames on this very stock. Your producer was going to dissolve it in chemical bath to produce modern digital DCP prints!'",
    keywords: [
      { word: "subterranean", meaningFa: "زیرزمینی و پنهان در اعماق", phonetic: "/ˌsʌbtəˈreɪniən/" },
      { word: "infrared", meaningFa: "مادون قرمز مخصوص عکاسی و بازرسی", phonetic: "/ˌɪnfrəˈred/" },
      { word: "loupe", meaningFa: "ذره‌بین چشمی ظریف نگاتیو", phonetic: "/luːp/" },
      { word: "dissolve", meaningFa: "حل کردن و از بین بردن شیمیایی", phonetic: "/dɪˈzɒlv/" },
    ],
    question: {
      promptEn: "Why did Signor Rossi take Reel Six to the Cineteca?",
      promptFa: "چرا سرکار روسی حلقه ششم را به سینماتک برده بود؟",
      options: ["To protect secret Antonioni frames from being destroyed by the studio", "To sell it on an auction site", "To watch it on his television"],
      correctIndex: 0,
      hintSnippet: "Forty years ago, legendary master Michelangelo Antonioni shot secret alternate frames on this very stock",
      clueFa: "برای محافظت از فریم‌های تاریخی آنتونیونی در برابر تخریب توسط استودیو.",
    },
    choiceA: {
      labelEn: "Carefully splice the historic frames into your premiere cut as an homage!",
      labelFa: "آن فریم‌های تاریخی را به عنوان ادای احترام با دقت درون فیلمت تدوین کن!",
      descriptionFa: "ترکیب اثر تو و شاهکار کهن تاریخ سینما را تکان خواهد داد.",
    },
    choiceB: {
      labelEn: "Pack the original reel safely and race back to the Palazzo with Rossi as your honored guest!",
      labelFa: "حلقه را بردار و با روسی به عنوان مهمان ویژه به کاخ فستیوال بازگردید!",
      descriptionFa: "نجات نسخه اصلی کارگردان بدون دخل و تصرف زمانی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Sofia scrubbed through the timestamped digital surveillance file. At 17:42, a tall figure in a black trench coat entered the booth, carrying a distinctive yellow padded flight case with the logo of CineTech Labs Milano. 'That is Giorgio, the chief digital colorist who worked on our post-production!' Sofia gasped. 'He did not steal the reel to destroy it—he brought it to his mobile color grading van outside the lagoon pier to fix a minor emulsion flaw!'",
    keywords: [
      { word: "colorist", meaningFa: "متخصص اصلاح رنگ و نور دیجیتال فیلم", phonetic: "/ˈkʌlərɪst/" },
      { word: "emulsion", meaningFa: "امولسیون حساس به نور روی نگاتیو", phonetic: "/ɪˈmʌlʃn/" },
      { word: "timestamped", meaningFa: "ثبت‌شده با مهر زمانی دقیقه و ثانیه", phonetic: "/ˈtaɪmstæmpt/" },
      { word: "grading", meaningFa: "تنظیم و تصحیح تناژ رنگی صحنه‌ها", phonetic: "/ˈɡreɪdɪŋ/" },
    ],
    question: {
      promptEn: "Who had taken the reel according to the surveillance video?",
      promptFa: "طبق نوار امنیتی چه کسی حلقه را برده بود؟",
      options: ["Giorgio, the chief digital colorist, to fix an emulsion flaw", "A masked international jewel thief", "A disgruntled movie critic"],
      correctIndex: 0,
      hintSnippet: "That is Giorgio, the chief digital colorist who worked on our post-production",
      clueFa: "جورجو، متخصص ارشد رنگ فیلم، برای برطرف کردن یک نقص نوری آن را برده بود.",
    },
    choiceA: {
      labelEn: "Run to the mobile grading van to inspect the newly perfected film master!",
      labelFa: "به سمت ون مجهز اصلاح رنگ بدو تا نسخه بی‌نقص نگاتیو را تحویل بگیری!",
      descriptionFa: "کیفیت بصری خیره‌کننده فیلم همه را شگفت‌زده خواهد کرد.",
    },
    choiceB: {
      labelEn: "Set up a synchronized dual 35mm and 4K digital projection system!",
      labelFa: "سیستم اکران همزمان نگاتیو ۳۵ میلی‌متری و دیجیتال 4K را راه‌اندازی کنید!",
      descriptionFa: "نوآوری فنی بی‌سابقه در تاریخ فستیوال فیلم ونیز.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Julian's speedboat roared down the Giudecca canal, waves spraying against the hull as the station clock struck 19:15. Julian leaped onto the marble quayside of Santa Lucia station just as the express train to Milan began sounding its departure whistle. Spotting a messenger in a red delivery cap carrying a steel film canister, Julian darted past startled passengers and grabbed the courier's arm: 'That canister is the cultural property of the Venice Biennale!'",
    keywords: [
      { word: "quayside", meaningFa: "اسکله و لنگرگاه سنگی ایستگاه", phonetic: "/ˈkiːsaɪd/" },
      { word: "departure", meaningFa: "حرکت و خروج قطار", phonetic: "/dɪˈpɑːtʃə/" },
      { word: "biennale", meaningFa: "دوسالانه و فستیوال بین‌المللی بینال", phonetic: "/ˌbiːəˈnɑːleɪ/" },
      { word: "canister", meaningFa: "محفظه استوانه‌ای نگاتیو", phonetic: "/ˈkænɪstə/" },
    ],
    question: {
      promptEn: "Where did Julian intercept the courier carrying the film canister?",
      promptFa: "جولیان در کجا راه را بر پیک حامل قوطی فیلم بست؟",
      options: ["On the marble platform of Santa Lucia train station", "Inside an airport terminal", "At an Italian bakery"],
      correctIndex: 0,
      hintSnippet: "leaped onto the marble quayside of Santa Lucia station just as the express train to Milan began sounding its departure whistle",
      clueFa: "روی سکوی ایستگاه قطار سانتا لوسیا درست پیش از سوت حرکت قطار.",
    },
    choiceA: {
      labelEn: "Flash your official festival director badge and reclaim the steel canister!",
      labelFa: "نشان رسمی کارگردانی فستیوال را نشان بده و قوطی نگاتیو را پس بگیر!",
      descriptionFa: "اقتدار قانونی و هنری شما راه را بر هر اعتراضی می‌بندد.",
    },
    choiceB: {
      labelEn: "Negotiate calmly and offer the courier double compensation for an immediate return!",
      labelFa: "آرام صحبت کن و برای بازگرداندن فوری محموله پاداش دوبرابر پیشنهاد بده!",
      descriptionFa: "صداقت و خوش‌قولی مانع از هرگونه درگیری فیزیکی می‌شود.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Julian leaned across the glass table, his voice calm and steely: 'Listen carefully, Bianca. The President of the International Jury is my former professor. If Reel Six is not back in the booth within twenty minutes, I will step onto the red carpet in front of four hundred journalists and announce that Apex Studio hijacked the film. Your corporate stock will plummet by morning.' Bianca turned pale, set down her glass, and opened her smartphone contacts.",
    keywords: [
      { word: "steely", meaningFa: "محکم، خونسرد و پولادین", phonetic: "/ˈstiːli/" },
      { word: "hijacked", meaningFa: "به سرقت برده و گروگان گرفته", phonetic: "/ˈhaɪdʒækt/" },
      { word: "plummet", meaningFa: "سقوط ناگهانی ارزش سهام", phonetic: "/ˈplʌmɪt/" },
      { word: "corporate", meaningFa: "سازمانی و تجاری شرکتی", phonetic: "/ˈkɔːpərət/" },
    ],
    question: {
      promptEn: "What did Julian threaten to do if the reel was not returned within twenty minutes?",
      promptFa: "جولیان تهدید کرد اگر حلقه در بیست دقیقه بازنگردد چه خواهد کرد؟",
      options: ["Announce to 400 journalists on the red carpet that Apex Studio hijacked the film", "Call the fire brigade", "Refuse to wear his tuxedo"],
      correctIndex: 0,
      hintSnippet: "step onto the red carpet in front of four hundred journalists and announce that Apex Studio hijacked the film",
      clueFa: "اعلام رسمی ماجرا به چهارصد خبرنگار رسانه‌ها روی فرش قرمز.",
    },
    choiceA: {
      labelEn: "Demand that Bianca apologize to Sofia and fund an uncompromised director's cut!",
      labelFa: "خواستار عذرخواهی رسمی از سوفیا و تأمین مالی نسخه کامل و بی‌پایان کارگردان شو!",
      descriptionFa: "پیروزی استقلال هنری بر محاسبات سرد بازاریابی استودیو.",
    },
    choiceB: {
      labelEn: "Agree to a respectful compromise: screen the director's cut tonight and test both cuts later!",
      labelFa: "یک توافق حرفه‌ای بکن: امشب نسخه کارگردان اکران شود و درباره اکران عمومی تصمیم بگیرید!",
      descriptionFa: "دیپلماسی سینمایی که منافع مادی و معنوی هر دو طرف را تضمین می‌کند.",
    },
  },

  // STEP 4 (8 NODES: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "With trembling surgical precision, Julian and Rossi spliced Antonioni's long-lost poetic footage into the final reel. The transition from Julian's modern noir cinematography into the shimmering 1960s grain created an otherworldly cinematic transcendence. Sofia held her breath: 'Julian, this elevates your film from a festival thriller into an eternal masterpiece.'",
    keywords: [
      { word: "transcendence", meaningFa: "تعالی و ارتقای مافوق تصور هنری", phonetic: "/trænˈsendəns/" },
      { word: "grain", meaningFa: "بافت دانه‌دانه نگاتیو آنالوگ", phonetic: "/ɡreɪn/" },
      { word: "spliced", meaningFa: "چسباند و پیوند داد نوار فیلم را", phonetic: "/splaɪst/" },
      { word: "noir", meaningFa: "سبک تیره و جنایی رازآلود نوآر", phonetic: "/nwɑː/" },
    ],
    question: {
      promptEn: "What effect did the 1960s footage have on the final film?",
      promptFa: "راش‌های دهه ۱۹۶۰ چه تأثیری بر فیلم نهایی گذاشت؟",
      options: ["Elevated it from a thriller into an eternal masterpiece", "Ruined the soundtrack", "Made it too dark to see"],
      correctIndex: 0,
      hintSnippet: "elevates your film from a festival thriller into an eternal masterpiece",
      clueFa: "فیلم را از یک تریلر معمولی به یک شاهکار ابدی و تاریخی ارتقا داد.",
    },
    choiceA: { labelEn: "Dedicate the premiere to the golden memory of Italian auteur cinema!", labelFa: "شب افتتاحیه را به یاد ماندگار سینمای مؤلف ایتالیا تقدیم کن!", descriptionFa: "پایان‌های ۳۱ و ۳۲" },
    choiceB: { labelEn: "Establish an archival film preservation fund with your prize money!", labelFa: "با جوایز نقدی فستیوال یک بنیاد محافظت از نگاتیوهای تاریخی بساز!", descriptionFa: "پایان‌های ۳۳ و ۳۴" },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Julian strapped the metal canister securely to his chest as their water taxi cut through the waves toward the Palazzo. Rossi accompanied them, clutching his original projection manual from 1958. When they entered through the VIP backstage doors, Matteo wept with joy and immediately threaded the celluloid leader into the twin carbon-arc projectors.",
    keywords: [
      { word: "carbon-arc", meaningFa: "پروژکتورهای زغالی اصیل با نور درخشان", phonetic: "/ˌkɑːbən ˈɑːk/" },
      { word: "celluloid", meaningFa: "نوار سلولوئید ۳۵ میلی‌متری", phonetic: "/ˈseljʊlɔɪd/" },
      { word: "clutching", meaningFa: "محکم در آغوش فشردن", phonetic: "/ˈklʌtʃɪŋ/" },
      { word: "leader", meaningFa: "نوار ابتدایی شمارش معکوس فیلم", phonetic: "/ˈliːdə/" },
    ],
    question: {
      promptEn: "What did Matteo do as soon as Julian delivered the canister?",
      promptFa: "متئو به محض تحویل گرفتن قوطی چه کرد؟",
      options: ["Threaded the celluloid leader into the carbon-arc projectors", "Locked the doors and went home", "Threw the canister into the canal"],
      correctIndex: 0,
      hintSnippet: "immediately threaded the celluloid leader into the twin carbon-arc projectors",
      clueFa: "بلافاصله نوار راهنما را در پروژکتورهای زغالی سالن سوار کرد.",
    },
    choiceA: { labelEn: "Stand beside Matteo in the booth to watch the film unspool!", labelFa: "کنار متئو در اتاق آپارات بایست و باز شدن حلقه‌ها را تماشا کن!", descriptionFa: "پایان‌های ۳۵ و ۳۶" },
    choiceB: { labelEn: "Take your seat in the center of the auditorium beside your lead actors!", labelFa: "در مرکز سالن در کنار بازیگران اصلی فیلمت بنشین!", descriptionFa: "پایان‌های ۳۷ و ۳۸" },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Inside Giorgio's state-of-the-art mobile van, multi-spectral laser scanners were finishing the micro-restoration of Reel Six's delicate emulsion layer. The colors on the reference OLED monitor glowed with hypnotic depth—velvet indigos, Venetian ochres, and shimmering emeralds. 'Julian, this is the most pristine analogue projection Venice has seen in thirty years,' Giorgio beamed.",
    keywords: [
      { word: "ochres", meaningFa: "رنگ اخرایی و خاکی اصیل", phonetic: "/ˈəʊkəz/" },
      { word: "pristine", meaningFa: "بسیار تمیز، شفاف و دست‌نخورده", phonetic: "/ˈprɪstiːn/" },
      { word: "scanners", meaningFa: "اسکنرهای لیزری بازسازی فیلم", phonetic: "/ˈskænəz/" },
      { word: "restoration", meaningFa: "مرمت و بازسازی اثر هنری", phonetic: "/ˌrestəˈreɪʃn/" },
    ],
    question: {
      promptEn: "How did Giorgio describe the restored analogue projection?",
      promptFa: "جورجو نمایش آنالوگ بازسازی‌شده را چگونه توصیف کرد؟",
      options: ["The most pristine analogue projection Venice has seen in thirty years", "A cheap digital copy", "Too blurry to project"],
      correctIndex: 0,
      hintSnippet: "this is the most pristine analogue projection Venice has seen in thirty years",
      clueFa: "شفاف‌ترین و پاکیزه‌ترین اکران آنالوگ که ونیز در سی سال گذشته به خود دیده است.",
    },
    choiceA: { labelEn: "Deliver the pristine reel personally to the festival projection team!", labelFa: "حلقه مرمت‌شده را شخصاً به تیم نمایش فستیوال تحویل بده!", descriptionFa: "پایان‌های ۳۹ و ۴۰" },
    choiceB: { labelEn: "Offer Giorgio the head of post-production post on your next film!", labelFa: "سمت مدیریت پس‌تولید پروژه بعدی‌ات را به جورجو پیشنهاد کن!", descriptionFa: "پایان‌های ۴۱ و ۴۲" },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Sofia and Giorgio wired an ultra-fast optical data bridge between the digital color van and the theater's dual Barco 4K laser projector. They orchestrated an unprecedented hybrid screening: the first four acts projected on warm 35mm film stock, transitioning seamlessly into high-dynamic-range digital laser for the climactic underwater sequences.",
    keywords: [
      { word: "orchestrated", meaningFa: "هماهنگ کرد و به زیبایی چیدمان داد", phonetic: "/ˈɔːkɪstreɪtɪd/" },
      { word: "unprecedented", meaningFa: "بی‌سابقه و نخستین بار در تاریخ", phonetic: "/ʌnˈpresɪdentɪd/" },
      { word: "hybrid", meaningFa: "ترکیبی از دو فناوری مختلف", phonetic: "/ˈhaɪbrɪd/" },
      { word: "sequences", meaningFa: "سکانس‌ها و فصل‌های فیلم", phonetic: "/ˈsiːkwənsɪz/" },
    ],
    question: {
      promptEn: "What innovative screening method did Sofia and Giorgio set up?",
      promptFa: "سوفیا و جورجو چه شیوه نوآورانه‌ای در نمایش راه‌اندازی کردند؟",
      options: ["A hybrid screening combining 35mm film stock and 4K digital laser", "An old black-and-white television", "A single slide projector"],
      correctIndex: 0,
      hintSnippet: "orchestrated an unprecedented hybrid screening: the first four acts projected on warm 35mm film stock, transitioning seamlessly into high-dynamic-range digital laser",
      clueFa: "اکران هیبریدی بی‌سابقه‌ای که ۳۵ میلی‌متری را با لیزر دیجیتال 4K ترکیب می‌کرد.",
    },
    choiceA: { labelEn: "Publish a technical manifesto on the future of hybrid cinema!", labelFa: "مانیفست فنی درباره آینده سینمای ترکیبی منتشر کنید!", descriptionFa: "پایان‌های ۴۳ و ۴۴" },
    choiceB: { labelEn: "Demonstrate the technology live to the International Cinematography Guild!", labelFa: "فناوری را به صورت زنده برای انجمن بین‌المللی فیلم‌برداران نمایش دهید!", descriptionFa: "پایان‌های ۴۵ و ۴۶" },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Julian displayed his golden official director credential, signed by the Venice Biennale Board of Trustees. The young courier's eyes widened with respect: 'Signor Julian! I was hired on a rush contract by an anonymous agent in Milan. I had no idea this was the festival master print!' The courier surrendered the locked metal container immediately, offering to escort Julian back on his motorcycle taxi.",
    keywords: [
      { word: "credential", meaningFa: "کارت هویت رسمی و مجوز معتبر", phonetic: "/krəˈdenʃl/" },
      { word: "trustees", meaningFa: "هیئت امنای عالی فستیوال", phonetic: "/trʌsˈtiːz/" },
      { word: "surrendered", meaningFa: "تحویل داد و واگذار کرد", phonetic: "/səˈrendəd/" },
      { word: "escort", meaningFa: "همراهی و اسکورت کردن", phonetic: "/ˈeskɔːt/" },
    ],
    question: {
      promptEn: "Why did the courier surrender the container immediately?",
      promptFa: "چرا پیک محموله را بلافاصله تحویل داد؟",
      options: ["He recognized Julian's official Biennale director credential", "He wanted to take a nap", "He dropped it accidentally"],
      correctIndex: 0,
      hintSnippet: "Julian displayed his golden official director credential, signed by the Venice Biennale Board of Trustees",
      clueFa: "او با دیدن کارت رسمی کارگردانی جولیان با امضای هیئت امنا متوجه ماجرا شد.",
    },
    choiceA: { labelEn: "Motorcycle through the narrow alleys to arrive with sirens blazing!", labelFa: "با اسکورت موتوری از کوچه‌های باریک با آژیر اختصاصی وارد شو!", descriptionFa: "پایان‌های ۴۷ و ۴۸" },
    choiceB: { labelEn: "Walk through the front red carpet doors carrying the canister like a trophy!", labelFa: "قوطی نگاتیو را مثل جام قهرمانی روی فرش قرمز حمل کن!", descriptionFa: "پایان‌های ۴۹ و ۵۰" },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Julian placed five hundred euros in cash into the courier's hand with genuine empathy: 'Brother, you are just doing your job, but this film represents five years of blood, sweat, and tears for sixty artists.' Touched by Julian's sincerity, the courier handed over the canister and gave Julian a private contact number of the Milanese broker who had ordered the heist.",
    keywords: [
      { word: "empathy", meaningFa: "همدلی و درک متقابل انسانی", phonetic: "/ˈempəθi/" },
      { word: "sincerity", meaningFa: "صداقت و اخلاص قلبی", phonetic: "/sɪnˈserəti/" },
      { word: "broker", meaningFa: "واسطه و دلال سفارش‌دهنده", phonetic: "/ˈbrəʊkə/" },
      { word: "heist", meaningFa: "سرقت سازمان‌یافته و پیچیده", phonetic: "/haɪst/" },
    ],
    question: {
      promptEn: "What valuable information did the courier share with Julian?",
      promptFa: "پیک چه اطلاعات باارزشی در اختیار جولیان گذاشت؟",
      options: ["A private contact number of the broker who ordered the heist", "A secret train schedule", "A coupon for pasta"],
      correctIndex: 0,
      hintSnippet: "gave Julian a private contact number of the Milanese broker who had ordered the heist",
      clueFa: "شماره تماس اختصاصی دلالی در میلان که دستور سرقت را داده بود.",
    },
    choiceA: { labelEn: "Hand the contact number to the Italian cultural police after the premiere!", labelFa: "شماره را پس از اکران تحویل پلیس امنیت فرهنگی ایتالیا بده!", descriptionFa: "پایان‌های ۵۱ و ۵۲" },
    choiceB: { labelEn: "Turn the whole investigation into the plot of your next feature film!", labelFa: "کل این ماجرای رازآلود را فیلم‌نامه اثر بعدی‌ات قرار بده!", descriptionFa: "پایان‌های ۵۳ و ۵۴" },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Bianca picked up her private phone, trembling under Julian's unwavering gaze. Within twelve minutes, a studio messenger arrived at the Palazzo carrying the original uncut reel, untouched in its velvet sleeve. Bianca looked down at her hands: 'I only wanted the film to be profitable, Julian. I forgot what genuine art feels like.'",
    keywords: [
      { word: "unwavering", meaningFa: "تزلزل‌ناپذیر و مصمم", phonetic: "/ʌnˈweɪvərɪŋ/" },
      { word: "gaze", meaningFa: "نگاه نافذ و عمیق", phonetic: "/ɡeɪz/" },
      { word: "profitable", meaningFa: "سودآور و پرفروش تجاری", phonetic: "/ˈprɒfɪtəbl/" },
      { word: "sleeve", meaningFa: "کاور مخملی محافظ نوار فیلم", phonetic: "/sliːv/" },
    ],
    question: {
      promptEn: "What did Bianca confess to Julian after returning the reel?",
      promptFa: "بیانکا پس از بازگرداندن حلقه چه اعترافی به جولیان کرد؟",
      options: ["That she had forgotten what genuine art feels like", "That she disliked movies", "That she was leaving cinema forever"],
      correctIndex: 0,
      hintSnippet: "I forgot what genuine art feels like",
      clueFa: "اعتراف کرد که در تب‌وتاب سودآوری فراموش کرده بود هنر اصیل چه طعمی دارد.",
    },
    choiceA: { labelEn: "Forgive Bianca and invite her to walk the red carpet as your producing partner!", labelFa: "بیانکا را ببخش و او را در کنار خودت روی فرش قرمز ببر!", descriptionFa: "پایان‌های ۵۵ و ۵۶" },
    choiceB: { labelEn: "Sign an agreement with an independent European cinema collective!", labelFa: "قرارداد پخش را با اتحادیه مستقل سینماگران اروپا امضا کن!", descriptionFa: "پایان‌های ۵۷ و ۵۸" },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Julian and Bianca drafted a landmark artistic memorandum right on the terrace napkin: The Venice audience would experience Julian's unapologetic original tragic ending tonight, while future worldwide theatrical distribution would test both endings with specialized audience surveys. Both artist and executive shook hands with newfound respect.",
    keywords: [
      { word: "memorandum", meaningFa: "تفاهم‌نامه رسمی همکاری", phonetic: "/ˌmeməˈrændəm/" },
      { word: "unapologetic", meaningFa: "بی‌پروا، صریح و بدون مصالحه", phonetic: "/ˌʌnəˌpɒləˈdʒetɪk/" },
      { word: "surveys", meaningFa: "نظرسنجی‌های آماری دقیق", phonetic: "/ˈsɜːveɪz/" },
      { word: "newfound", meaningFa: "به‌تازگی یافته‌شده و نوظهور", phonetic: "/ˈnjuːfaʊnd/" },
    ],
    question: {
      promptEn: "Which ending would the Venice audience see tonight according to the memorandum?",
      promptFa: "بر اساس تفاهم‌نامه، تماشاگران ونیز امشب کدام پایان‌بندی را می‌دیدند؟",
      options: ["Julian's unapologetic original tragic ending", "A happy comedy ending", "No ending at all"],
      correctIndex: 0,
      hintSnippet: "The Venice audience would experience Julian's unapologetic original tragic ending tonight",
      clueFa: "امشب پایان تراژیک و اصیل مدنظر جولیان روی پرده بزرگ نقش می‌بست.",
    },
    choiceA: { labelEn: "Present the film with an impassioned speech about creative truth!", labelFa: "فیلم را با نطقی پرشور درباره حقیقت خلاقیت هنری معرفی کن!", descriptionFa: "پایان‌های ۵۹ و ۶۰" },
    choiceB: { labelEn: "Host a debate between film theorists and studio heads at the Biennale!", labelFa: "مناظره‌ای میان نظریه‌پردازان و تهیه‌کنندگان در کاخ فستیوال برپا کن!", descriptionFa: "پایان‌های ۶۱ و ۶۲" },
  },

  // STEP 5 (16 NODES: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "As the final twenty minutes unspooled, Antonioni's long-lost poetic imagery merged with Julian's brooding modern scenes. In the darkened theater, the International Jury sat upright, captivated by the metaphysical mystery. When the screen faded to velvet black, eighteen hundred people erupted in a thunderous twelve-minute standing ovation.",
    keywords: [
      { word: "metaphysical", meaningFa: "متافیزیکی و ماورای ادراک عادی", phonetic: "/ˌmetəˈfɪzɪkl/" },
      { word: "brooding", meaningFa: "ژرف، متفکرانه و پررمزوراز", phonetic: "/ˈbruːdɪŋ/" },
      { word: "unspooled", meaningFa: "از قرقره پروژکتور باز شد و به نمایش درآمد", phonetic: "/ʌnˈspuːld/" },
      { word: "captivated", meaningFa: "افسون‌شده و مات‌ومبهوت", phonetic: "/ˈkæptɪveɪtɪd/" },
    ],
    question: {
      promptEn: "How long did the standing ovation last inside the Palazzo del Cinema?",
      promptFa: "تشویق ایستاده تماشاگران در کاخ سینما چقدر طول کشید؟",
      options: ["Twelve minutes", "Two minutes", "One hour"],
      correctIndex: 0,
      hintSnippet: "erupted in a thunderous twelve-minute standing ovation",
      clueFa: "تشویق پرشور و ایستاده دوازده دقیقه پیاپی ادامه داشت.",
    },
    choiceA: { labelEn: "Accept the coveted Golden Lion Trophy from the jury president!", labelFa: "تندیس زرین شیر طلایی ونیز را از رئیس هیئت داوران دریافت کن!", descriptionFa: "پایان شماره ۱" },
    choiceB: { labelEn: "Call eighty-year-old Signor Rossi onto the stage to share the honor!", labelFa: "سرکار روسی کهنسال را به روی صحنه فرا بخوان تا افتخار را شریک شوید!", descriptionFa: "پایان شماره ۲" },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Standing at the gala podium with flashbulbs sparkling like lightning, Julian announced that half of the film's international profits would endow a permanent restoration lab at the San Marco Cineteca. Signor Rossi held up his vintage carbon arc tools with tears streaming down his face.",
    keywords: [
      { word: "endow", meaningFa: "وقف کردن و تأمین مالی دائمی", phonetic: "/ɪnˈdaʊ/" },
      { word: "podium", meaningFa: "تریبون سخنرانی تالار", phonetic: "/ˈpəʊdiəm/" },
      { word: "preservation", meaningFa: "حفظ و نگهداری میراث کهن", phonetic: "/ˌprezəˈveɪʃn/" },
      { word: "streaming", meaningFa: "جاری و روان بر گونه‌ها", phonetic: "/ˈstriːmɪŋ/" },
    ],
    question: {
      promptEn: "What did Julian establish with half of the film's international profits?",
      promptFa: "جولیان با نیمی از درآمدهای بین‌المللی فیلم چه مرکزی را پایه‌گذاری کرد؟",
      options: ["A permanent restoration lab at the San Marco Cineteca", "A chain of popcorn stands", "A private helicopter fleet"],
      correctIndex: 0,
      hintSnippet: "endow a permanent restoration lab at the San Marco Cineteca",
      clueFa: "آزمایشگاه دائمی مرمت فیلم‌های تاریخی در سینماتک سن مارکو ونیز.",
    },
    choiceA: { labelEn: "Lead a global campaign to digitize fragile nitrate film classics!", labelFa: "کمپین جهانی برای نجات نگاتیوهای شکننده نیترات به راه بیندازید!", descriptionFa: "پایان شماره ۳" },
    choiceB: { labelEn: "Curate an annual retrospective of forgotten Mediterranean cinema!", labelFa: "جشنواره سالانه مرور آثار گمشده سینمای مدیترانه را برپا کنید!", descriptionFa: "پایان شماره ۴" },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "High inside the projection booth, Julian watched through the tiny optical port as light flickered across eighteen hundred faces. Matteo gently placed a weathered hand on Julian's shoulder: 'Look at them, maestro. They are living inside your dream.' The audience wept and gasped at every rhythmic cut.",
    keywords: [
      { word: "port", meaningFa: "دریچه دید شیشه‌ای اتاق آپارات", phonetic: "/pɔːt/" },
      { word: "weathered", meaningFa: "دست‌های کارکرده و دنیا دیده", phonetic: "/ˈweðəd/" },
      { word: "maestro", meaningFa: "استاد و پیشوای بزرگ هنر", phonetic: "/ˈmaɪstrəʊ/" },
      { word: "flickered", meaningFa: "چشمک زد و سوسو زد", phonetic: "/ˈflɪkəd/" },
    ],
    question: {
      promptEn: "What did Matteo say to Julian while watching from the booth?",
      promptFa: "متئو در حین تماشای سالن از پنجره آپارات به جولیان چه گفت؟",
      options: ["Look at them, maestro. They are living inside your dream.", "The film is too long.", "I need more coffee."],
      correctIndex: 0,
      hintSnippet: "Look at them, maestro. They are living inside your dream",
      clueFa: "گفت: به آنها نگاه کن استاد، آنان دارند درون رویای تو زندگی می‌کنند.",
    },
    choiceA: { labelEn: "Embrace Matteo as the unsung hero of the evening!", labelFa: "متئو را به عنوان قهرمان گمنام این شب فراموش‌نشدنی در آغوش بگیر!", descriptionFa: "پایان شماره ۵" },
    choiceB: { labelEn: "Carve your initials together beside the antique projector chassis!", labelFa: "نام‌هایتان را کنار هم روی شاسی پروژکتور تاریخی حکاکی کنید!", descriptionFa: "پایان شماره ۶" },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Julian slipped into the central aisle just as the climactic scene revealed the labyrinth's golden exit. His lead actress grasped his hand, her knuckles white with suspense. When the credits rolled against a haunting Venetian melody, the entire theater rose to applaud the young director.",
    keywords: [
      { word: "knuckles", meaningFa: "بندانگشتان دست", phonetic: "/ˈnʌklz/" },
      { word: "suspense", meaningFa: "تعلیق و اضطراب لذت‌بخش درام", phonetic: "/səˈspens/" },
      { word: "haunting", meaningFa: "فراموش‌نشدنی و مسحورکننده", phonetic: "/ˈhɔːntɪŋ/" },
      { word: "credits", meaningFa: "تیتراژ پایانی اسامی عوامل", phonetic: "/ˈkredɪts/" },
    ],
    question: {
      promptEn: "What music played as the closing credits rolled?",
      promptFa: "با پخش تیتراژ پایانی چه موسیقی به گوش رسید؟",
      options: ["A haunting Venetian melody", "Loud techno music", "Silence"],
      correctIndex: 0,
      hintSnippet: "credits rolled against a haunting Venetian melody",
      clueFa: "ملودی مسحورکننده و فراموش‌نشدنی اصیل ونیزی پخش شد.",
    },
    choiceA: { labelEn: "Take a bow with your cast and crew under golden spotlights!", labelFa: "با بازیگران و عواملت زیر نورهای طلایی تعظیم کن!", descriptionFa: "پایان شماره ۷" },
    choiceB: { labelEn: "Host a midnight celebratory feast at an antique palazzo on the canal!", labelFa: "جشن شبانه پیروزی را در کاخی قدیمی کنار آب برگزار کنید!", descriptionFa: "پایان شماره ۸" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Julian handed the pristine reel directly to the chief projectionist ten minutes before curtain call. The projected image had zero scratches and exquisite dynamic range. Reviewers from Cahiers du Cinema wrote that the film marked the triumphant renaissance of celluloid in the digital era.",
    keywords: [
      { word: "curtain call", meaningFa: "زمان باز شدن پرده سالن سینما", phonetic: "/ˈkɜːtn kɔːl/" },
      { word: "renaissance", meaningFa: "رنسانس و نوزایی شکوهمند", phonetic: "/rɪˈneɪsns/" },
      { word: "exquisite", meaningFa: "بسیار ظریف، چشم‌نواز و عالی", phonetic: "/ɪkˈskwɪzɪt/" },
      { word: "celluloid", meaningFa: "نگاتیو سنتی آنالوگ", phonetic: "/ˈseljʊlɔɪd/" },
    ],
    question: {
      promptEn: "What did the reviewers from Cahiers du Cinema declare in their review?",
      promptFa: "منتقدان نشریه کایه دو سینما در نقد خود چه نوشتند؟",
      options: ["The film marked the triumphant renaissance of celluloid", "The movie was too short", "The actors were unknown"],
      correctIndex: 0,
      hintSnippet: "marked the triumphant renaissance of celluloid in the digital era",
      clueFa: "نوشتند این فیلم نشان‌دهنده رنسانس و نوزایی پیروزمندانه نگاتیو است.",
    },
    choiceA: { labelEn: "Tour the celluloid master copy across thirty art-house theaters in Europe!", labelFa: "نسخه نگاتیو را در سی سینمای هنری اروپا به نمایش بگذارید!", descriptionFa: "پایان شماره ۹" },
    choiceB: { labelEn: "Archive the master reel in the Swiss Alpine Deep Vault for eternity!", labelFa: "نگاتیو اصلی را برای ابدیت در پناهگاه کوه‌های آلپ سوئیس ذخیره کنید!", descriptionFa: "پایان شماره ۱۰" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "At the post-premiere cocktail party on the Lido beachfront, Julian raised a glass of bellini to Giorgio: 'Without your dedication to color science, tonight's triumph would have been impossible.' Giorgio beamed as top producers offered him five new feature films on the spot.",
    keywords: [
      { word: "cocktail", meaningFa: "جشن و گردهمایی پذیرایی رسمی", phonetic: "/ˈkɒkteɪl/" },
      { word: "bellini", meaningFa: "نوشیدنی هلو ونیزی اصیل", phonetic: "/bəˈliːni/" },
      { word: "dedication", meaningFa: "فداکاری، تعهد و سخت‌کوشی", phonetic: "/ˌdedɪˈkeɪʃn/" },
      { word: "science", meaningFa: "علم و دانش فنی", phonetic: "/ˈsaɪəns/" },
    ],
    question: {
      promptEn: "What drink did Julian raise to thank Giorgio?",
      promptFa: "جولیان چه نوشیدنی را برای قدردانی از جورجو بالا برد؟",
      options: ["A glass of bellini", "Black tea", "Warm milk"],
      correctIndex: 0,
      hintSnippet: "raised a glass of bellini to Giorgio",
      clueFa: "یک گیلاس نوشیدنی بلینی ونیزی برای قدردانی بالا برد.",
    },
    choiceA: { labelEn: "Establish a collaborative studio with Giorgio in Rome!", labelFa: "یک استودیوی مشترک تخصصی با جورجو در رم تأسیس کن!", descriptionFa: "پایان شماره ۱۱" },
    choiceB: { labelEn: "Conduct an international masterclass on cinema color theory!", labelFa: "یک مسترکلاس جهانی درباره نظریه رنگ در سینما تدریس کنید!", descriptionFa: "پایان شماره ۱۲" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "The international press hailed the hybrid projection as a breakthrough in cinematic presentation. In their manifesto, Julian and Sofia demonstrated how honoring photochemical warmth while embracing digital precision gives cinema its most expressive future.",
    keywords: [
      { word: "manifesto", meaningFa: "بیانیه اصولی و مانیفست هنری", phonetic: "/ˌmænɪˈfestəʊ/" },
      { word: "photochemical", meaningFa: "فتوشیمیایی و فرآیند نگاتیو", phonetic: "/ˌfəʊtəʊˈkemɪkl/" },
      { word: "precision", meaningFa: "دقت ریاضی‌گونه و شفافیت", phonetic: "/prɪˈsɪʒn/" },
      { word: "expressive", meaningFa: "بیانگر، گویا و سرشار از حس", phonetic: "/ɪkˈspresɪv/" },
    ],
    question: {
      promptEn: "What did the technical manifesto argue for?",
      promptFa: "مانیفست فنی چه رویکردی را ترویج می‌کرد؟",
      options: ["Honoring photochemical warmth while embracing digital precision", "Abandoning all cameras", "Making films only with smartphones"],
      correctIndex: 0,
      hintSnippet: "demonstrated how honoring photochemical warmth while embracing digital precision gives cinema its most expressive future",
      clueFa: "ترکیب گرمای فتوشیمیایی با دقت دیجیتال برای آینده پربار سینما.",
    },
    choiceA: { labelEn: "Found the Institute for Experimental Cinema Formats!", labelFa: "پژوهشکده قالب‌های تجربی سینما را راه‌اندازی کنید!", descriptionFa: "پایان شماره ۱۳" },
    choiceB: { labelEn: "Direct a sci-fi epic utilizing this patented dual-projection format!", labelFa: "یک فیلم حماسی علمی‌تخیلی با همین شیوه نوآورانه بسازید!", descriptionFa: "پایان شماره ۱۴" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "At the annual congress of the International Cinematography Guild, Sofia was awarded the Golden Clapper for technical vision. With Julian beside her, she proved that cinematic storytelling is limited only by an artist's imagination, not technical boundaries.",
    keywords: [
      { word: "congress", meaningFa: "کنگره و همایش بین‌المللی", phonetic: "/ˈkɒŋɡres/" },
      { word: "clapper", meaningFa: "نشان کلاکت طلایی افتخار", phonetic: "/ˈklæpə/" },
      { word: "boundaries", meaningFa: "مرزها و محدودیت‌های دست‌وپاگیر", phonetic: "/ˈbaʊndriz/" },
      { word: "guild", meaningFa: "صنف و اتحادیه حرفه‌ای", phonetic: "/ɡɪld/" },
    ],
    question: {
      promptEn: "What prestigious award was Sofia granted by the Guild?",
      promptFa: "صنف فیلم‌برداران چه جایزه معتبری به سوفیا اهدا کرد؟",
      options: ["The Golden Clapper for technical vision", "A wooden compass", "A bronze medal"],
      correctIndex: 0,
      hintSnippet: "Sofia was awarded the Golden Clapper for technical vision",
      clueFa: "نشان کلاکت زرین برای چشم‌انداز فنی نوین در سینما.",
    },
    choiceA: { labelEn: "Embark on an eight-month desert shoot for your next feature!", labelFa: "فیلم‌برداری هشت ماهه اثر بعدی‌ات را در بیابان‌های بکر آغاز کن!", descriptionFa: "پایان شماره ۱۵" },
    choiceB: { labelEn: "Publish Sofia's stunning production photographs as a luxury art book!", labelFa: "عکس‌های صحنه سوفیا را به عنوان کتاب نفیس عکاسی سینما چاپ کنید!", descriptionFa: "پایان شماره ۱۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Sirens echoed along the quayside as the police escort boat brought Julian directly to the festival pier. Dashing across the red carpet with the steel canister held high, Julian arrived to wild applause from fans who thought it was a brilliant promotional publicity stunt.",
    keywords: [
      { word: "publicity", meaningFa: "تبلیغاتی و جلب توجه رسانه‌ای", phonetic: "/pʌbˈlɪsəti/" },
      { word: "stunt", meaningFa: "شعبده تبلیغاتی و حرکت نمایشی", phonetic: "/stʌnt/" },
      { word: "dashing", meaningFa: "با شتاب و شجاعت دویدن", phonetic: "/ˈdæʃɪŋ/" },
      { word: "promotional", meaningFa: "ترویجی و بازاریابی", phonetic: "/prəˈməʊʃənl/" },
    ],
    question: {
      promptEn: "What did the fans mistakenly think Julian's rush with the canister was?",
      promptFa: "هواداران با دیدن دویدن جولیان چه تصور اشتباهی کردند؟",
      options: ["A brilliant promotional publicity stunt", "An Olympic race", "An emergency fire drill"],
      correctIndex: 0,
      hintSnippet: "thought it was a brilliant promotional publicity stunt",
      clueFa: "فکر کردند این دویدن با قوطی فیلم یک شیرین‌کاری تبلیغاتی جذاب برای فیلم است.",
    },
    choiceA: { labelEn: "Bow with a charming wink and hand the reel directly to the projectionist!", labelFa: "با چشمکی جذاب تعظیم کن و حلقه را به آپاراتچی برسان!", descriptionFa: "پایان شماره ۱۷" },
    choiceB: { labelEn: "Turn the headline 'The Director Who Ran for His Art' into cinema lore!", labelFa: "تیتر 'کارگردانی که برای هنرش دوید' را به افسانه تاریخ سینما تبدیل کن!", descriptionFa: "پایان شماره ۱۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Julian stood before the gala crowd in his tailored tuxedo, holding the heavy steel canister. 'Tonight, you will not just watch a movie,' he spoke softly into the gold microphone. 'You will witness an artifact of conviction that survived every effort to extinguish it.' The applause shook the chandeliers.",
    keywords: [
      { word: "conviction", meaningFa: "باور عمیق قلبی و پایداری", phonetic: "/kənˈvɪkʃn/" },
      { word: "extinguish", meaningFa: "خاموش کردن و از بین بردن", phonetic: "/ɪkˈstɪŋɡwɪʃ/" },
      { word: "artifact", meaningFa: "اثر ارزشمند دست‌ساز انسانی", phonetic: "/ˈɑːtɪfækt/" },
      { word: "chandeliers", meaningFa: "لوسترهای مجلل کریستالی", phonetic: "/ˌʃændəˈlɪəz/" },
    ],
    question: {
      promptEn: "What shook under the power of the audience's applause?",
      promptFa: "چه چیزی زیر شدت تشویق‌های تماشاگران لرزید؟",
      options: ["The palace chandeliers", "The outside bridge", "The harbor water"],
      correctIndex: 0,
      hintSnippet: "The applause shook the chandeliers",
      clueFa: "لوسترهای کریستالی سالن زیر غرش دست‌زدن‌ها به لرزه افتادند.",
    },
    choiceA: { labelEn: "Lead your cast in a joyful toast of sparkling Venetian wine!", labelFa: "بازیگران را در جشنی با نوشیدنی گوارای ونیزی رهبری کن!", descriptionFa: "پایان شماره ۱۹" },
    choiceB: { labelEn: "Seal the canister permanently in the Venice Film Festival Vault!", labelFa: "قوطی نگاتیو را برای همیشه در مخزن رسمی فستیوال مهروموم کنید!", descriptionFa: "پایان شماره ۲۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Julian handed the contact dossier to the Carabinieri Cultural Heritage Squad. Within three days, an international film piracy and extortion ring operating out of Milan was dismantled, saving dozens of rare European film reels from black market smuggling.",
    keywords: [
      { word: "dossier", meaningFa: "پرونده و اسناد محرمانه", phonetic: "/ˈdɒsieɪ/" },
      { word: "dismantled", meaningFa: "منحل و متلاشی شد", phonetic: "/dɪsˈmæntld/" },
      { word: "extortion", meaningFa: "اخاذی و باج‌گیری غیرقانونی", phonetic: "/ɪkˈstɔːʃn/" },
      { word: "smuggling", meaningFa: "قاچاق و انتقال غیرقانونی", phonetic: "/ˈsmʌɡlɪŋ/" },
    ],
    question: {
      promptEn: "What was dismantled thanks to the dossier Julian shared?",
      promptFa: "به لطف پرونده‌ای که جولیان تحویل داد چه باندی منهدم شد؟",
      options: ["An international film piracy and extortion ring in Milan", "A counterfeit watch ring", "A smuggling ship"],
      correctIndex: 0,
      hintSnippet: "an international film piracy and extortion ring operating out of Milan was dismantled",
      clueFa: "باند بین‌المللی سرقت و اخاذی فیلم‌های نادر در میلان منهدم شد.",
    },
    choiceA: { labelEn: "Receive the Medal of Honor for Cultural Protection from Italy's President!", labelFa: "مدال افتخار حفاظت از میراث فرهنگی را از رئیس جمهور ایتالیا بگیر!", descriptionFa: "پایان شماره ۲۱" },
    choiceB: { labelEn: "Write a bestselling memoir titled 'Midnight in the Canal Archives'!", labelFa: "کتاب پرفروشی با نام 'نیمه‌شب در بایگانی کانال‌ها' بنویس!", descriptionFa: "پایان شماره ۲۲" },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Julian poured his dramatic real-life ordeal into a gripping new screenplay titled 'Celluloid Conspiracy'. Major European studios entered a fierce bidding war, granting Julian full final cut privilege and a budget of fifteen million euros.",
    keywords: [
      { word: "ordeal", meaningFa: "تجربه دشوار، نفس‌گیر و پرمخاطره", phonetic: "/ɔːˈdiːl/" },
      { word: "screenplay", meaningFa: "فیلم‌نامه سینمایی", phonetic: "/ˈskriːnpleɪ/" },
      { word: "privilege", meaningFa: "امتیاز و اختیار انحصاری", phonetic: "/ˈprɪvəlɪdʒ/" },
      { word: "conspiracy", meaningFa: "توطئه و تبانی پیچیده", phonetic: "/kənˈspɪrəsi/" },
    ],
    question: {
      promptEn: "What was the title of Julian's new screenplay based on his experience?",
      promptFa: "عنوان فیلم‌نامه جدید جولیان بر اساس این تجربه واقعی چه بود؟",
      options: ["Celluloid Conspiracy", "The Lost Camera", "Summer Vacation"],
      correctIndex: 0,
      hintSnippet: "a gripping new screenplay titled 'Celluloid Conspiracy'",
      clueFa: "فیلم‌نامه‌ای جذاب با عنوان توطئه سلولوئید.",
    },
    choiceA: { labelEn: "Begin filming in the historic alleys and hidden bridges of Venice!", labelFa: "فیلم‌برداری را در کوچه‌های کهن و پل‌های پنهان ونیز آغاز کن!", descriptionFa: "پایان شماره ۲۳" },
    choiceB: { labelEn: "Cast Jack Sterling from Hollywood alongside local Venetian talent!", labelFa: "ستاره هالیوود را در کنار هنرمندان محلی ونیز انتخاب کن!", descriptionFa: "پایان شماره ۲۴" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Arm in arm, Julian, Sofia, and Bianca walked onto the illuminated red carpet. European film journalists praised Bianca's courage for standing beside an uncompromising artistic vision. The premiere was hailed as a triumphant victory for cinema integrity.",
    keywords: [
      { word: "uncompromising", meaningFa: "سازش‌ناپذیر و استوار در اصول", phonetic: "/ʌnˈkɒmprəmaɪzɪŋ/" },
      { word: "integrity", meaningFa: "اصالت، درستی و شرافت حرفه‌ای", phonetic: "/ɪnˈteɡrəti/" },
      { word: "illuminated", meaningFa: "غرق در نور فلاش‌ها و پروژکتورها", phonetic: "/ɪˈluːmɪneɪtɪd/" },
      { word: "journalists", meaningFa: "روزنامه‌نگاران و خبرنگاران", phonetic: "/ˈdʒɜːnəlɪsts/" },
    ],
    question: {
      promptEn: "What did the European journalists praise Bianca for?",
      promptFa: "روزنامه‌نگاران اروپایی چه چیزی از بیانکا را ستودند؟",
      options: ["Her courage for standing beside an uncompromising artistic vision", "Her designer gown", "Her expensive jewelry"],
      correctIndex: 0,
      hintSnippet: "praised Bianca's courage for standing beside an uncompromising artistic vision",
      clueFa: "شجاعت او برای حمایت از یک چشم‌انداز هنری اصیل و سازش‌ناپذیر.",
    },
    choiceA: { labelEn: "Sign a multi-picture partnership prioritizing visionary auteur films!", labelFa: "قرارداد چندفیلمی با تمرکز بر سینمای مؤلف و الهام‌بخش امضا کنید!", descriptionFa: "پایان شماره ۲۵" },
    choiceB: { labelEn: "Celebrate with an intimate gondola cruise down the moonlit Grand Canal!", labelFa: "با گشت قایقی اختصاصی در مهتاب کانال بزرگ پیروزی را جشن بگیرید!", descriptionFa: "پایان شماره ۲۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Julian severed ties with predatory Hollywood financiers, partnering instead with the European Independent Cinema Cooperative. His film opened in four hundred independent art houses across Europe, generating historic box office profits driven by passionate word of mouth.",
    keywords: [
      { word: "severed", meaningFa: "قطع کرد و گسست", phonetic: "/ˈsevəd/" },
      { word: "predatory", meaningFa: "استثمارگر و غارت‌گر", phonetic: "/ˈpredətri/" },
      { word: "cooperative", meaningFa: "اتحادیه تعاونی سینماگران", phonetic: "/kəʊˈɒpərətɪv/" },
      { word: "financiers", meaningFa: "سرمایه‌گذاران بزرگ مالی", phonetic: "/fəˈnænsiəz/" },
    ],
    question: {
      promptEn: "Where did Julian's film open after partnering with the European collective?",
      promptFa: "فیلم جولیان پس از همکاری با اتحادیه اروپا در چند سینما اکران شد؟",
      options: ["In four hundred independent art houses across Europe", "In only one small room", "Nowhere"],
      correctIndex: 0,
      hintSnippet: "opened in four hundred independent art houses across Europe",
      clueFa: "در چهارصد سینمای مستقل هنری در سراسر قاره اروپا اکران شد.",
    },
    choiceA: { labelEn: "Reinvest your profits into micro-budget indie cinema grants!", labelFa: "درآمدهایت را به گرنت‌های ساخت فیلم مستقل کم‌بودجه اختصاص بده!", descriptionFa: "پایان شماره ۲۷" },
    choiceB: { labelEn: "Establish an annual 'Freedom of Expression' film award in Venice!", labelFa: "جایزه سالانه آزادی بیان سینمایی را در ونیز پایه‌گذاری کن!", descriptionFa: "پایان شماره ۲۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Before the lights dimmed, Julian delivered a moving speech that moved the audience deeply: 'Cinema is not commerce disguised as entertainment; it is the collective soul of humanity examining its own fragility.' When the tragic finale ended, people wept openly, celebrating pure emotional truth.",
    keywords: [
      { word: "fragility", meaningFa: "شکنندگی و آسیب‌پذیری انسان", phonetic: "/frəˈdʒɪləti/" },
      { word: "disguised", meaningFa: "پنهان‌شده در نقاب و لباس مبدل", phonetic: "/dɪsˈɡaɪzd/" },
      { word: "humanity", meaningFa: "بشریت و جهان انسانی", phonetic: "/hjuːˈmænəti/" },
      { word: "dimmed", meaningFa: "کم‌نور شد پیش از شروع فیلم", phonetic: "/dɪmd/" },
    ],
    question: {
      promptEn: "What did Julian call cinema in his opening speech?",
      promptFa: "جولیان در سخنرانی افتتاحیه سینما را چه نامید؟",
      options: ["The collective soul of humanity examining its own fragility", "Just a business to sell candy", "A fast amusement park ride"],
      correctIndex: 0,
      hintSnippet: "it is the collective soul of humanity examining its own fragility",
      clueFa: "روح جمعی بشریت که در حال بررسی شکنندگی و عمق وجود خویش است.",
    },
    choiceA: { labelEn: "Receive a standing ovation from the entire International Film Critics Jury!", labelFa: "تشویق یکپارچه هیئت داوران منتقدان بین‌المللی را دریافت کن!", descriptionFa: "پایان شماره ۲۹" },
    choiceB: { labelEn: "Be invited to teach the prestigious Director's Masterclass at Cannes!", labelFa: "برای تدریس در مسترکلاس عالی کارگردانی جشنواره کن دعوت شو!", descriptionFa: "پایان شماره ۳۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "The spirited debate between Julian and film theorists in the Palazzo's courtyard was broadcast live to millions of cinema students worldwide. They proved that great cinema must provoke, challenge, and heal—sparking a new renaissance of thoughtful filmmaking across the globe.",
    keywords: [
      { word: "spirited", meaningFa: "پرشور، زنده و پرحرارت", phonetic: "/ˈspɪrɪtɪd/" },
      { word: "theorists", meaningFa: "نظریه‌پردازان و فیلسوفان هنر", phonetic: "/ˈθɪərɪsts/" },
      { word: "provoke", meaningFa: "به چالش کشیدن و برانگیختن اندیشه", phonetic: "/prəˈvəʊk/" },
      { word: "courtyard", meaningFa: "حیاط مرکزی و صحن کاخ", phonetic: "/ˈkɔːtjɑːd/" },
    ],
    question: {
      promptEn: "What did the live debate prove about great cinema?",
      promptFa: "مناظره زنده چه چیزی را درباره سینمای بزرگ اثبات کرد؟",
      options: ["Great cinema must provoke, challenge, and heal", "Movies should only show advertisements", "Cinema is obsolete"],
      correctIndex: 0,
      hintSnippet: "proved that great cinema must provoke, challenge, and heal",
      clueFa: "سینمای بزرگ باید ذهن را به چالش بکشد، اندیشه برانگیزد و التیام‌بخش باشد.",
    },
    choiceA: { labelEn: "Publish the debate transcripts as the definitive text on modern auteur cinema!", labelFa: "متن مناظره را به عنوان کتاب مرجع سینمای مدرن مؤلف منتشر کنید!", descriptionFa: "پایان شماره ۳۱" },
    choiceB: { labelEn: "Walk into the Venetian night with Sofia, ready to write your next masterpiece!", labelFa: "در دل شب آرام ونیز با سوفیا قدم بزن، آماده برای نوشتن شاهکار بعدی!", descriptionFa: "پایان شماره ۳۲" },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Golden Lion of Venice", titleFa: "شیر طلایی ونیز", badgeCategory: "legendary", badgeIcon: "🦁", badgeNameFa: "پایان اوج افتخار سینمایی", climaxEn: "The jury president hands Julian the solid gold winged lion as eighteen hundred guests roar with approval.", climaxFa: "رئیس هیئت داوران تندیس زرین شیر بالدار را به جولیان تقدیم کرد و سالن در تشویق‌های پرشور غرق شد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "The Archivist's Standing Ovation", titleFa: "تشویق باشکوه بایگان کهنه‌کار", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان تجلیل از میراث کهن", climaxEn: "Eighty-year-old Signor Rossi stands beside Julian on stage, wiping tears as cinema history honors him.", climaxFa: "سرکار روسی در هشتاد سالگی روی سن کنار جولیان ایستاد؛ تاریخ سینما برای نخستین بار از نگهبان گمنامش تجلیل کرد.", xpReward: 190 },
  { pathCode: "AAABA", titleEn: "The San Marco Nitrate Laboratory", titleFa: "آزمایشگاه مرمت نگاتیو سن مارکو", badgeCategory: "heroic", badgeIcon: "🔬", badgeNameFa: "پایان ماندگاری میراث فرهنگی", climaxEn: "The new restoration lab restores hundreds of fragile Italian silent cinema treasures for future generations.", climaxFa: "آزمایشگاه جدید مرمت فیلم صدها اثر نایاب سینمای صامت ایتالیا را برای نسل‌های آینده از نابودی نجات داد.", xpReward: 185 },
  { pathCode: "AAABB", titleEn: "Retrospective of Forgotten Dreams", titleFa: "مرور رویاهای گمشده سینما", badgeCategory: "scholar", badgeIcon: "📽️", badgeNameFa: "پایان پژوهشگر سینمایی", climaxEn: "Julian's festival curation reintroduces visionary female directors of the 1920s to worldwide acclaim.", climaxFa: "جشنواره مروری جولیان نام کارگردانان زن پیشگام دهه ۱۹۲۰ را دوباره بر سر زبان‌های جهانیان انداخت.", xpReward: 180 },
  { pathCode: "AABAA", titleEn: "Unsung Heroes of the Projection Booth", titleFa: "قهرمانان گمنام اتاق آپارات", badgeCategory: "legendary", badgeIcon: "🎞️", badgeNameFa: "پایان احترام به پیشکسوتان", climaxEn: "Julian introduces Matteo to international media as the true heartbeat and soul behind every cinema screening.", climaxFa: "جولیان متئو را در برابر رسانه‌های دنیا به عنوان قلب تپنده و روح زنده هر اکران سینمایی معرفی کرد.", xpReward: 195 },
  { pathCode: "AABBB", titleEn: "The Engraved Projector Legend", titleFa: "نشان ماندگار روی پروژکتور باستانی", badgeCategory: "secret", badgeIcon: "⚙️", badgeNameFa: "پایان یادگاری ابدی", climaxEn: "Their initials carved on the 1958 carbon-arc projector remain an inspirational secret for future projectionists.", climaxFa: "نام‌های حک‌شده آن دو روی پروژکتور سال ۱۹۵۸ به رازی الهام‌بخش برای آپاراتچی‌های دهه‌های بعد تبدیل شد.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Red Carpet Ovation with the Cast", titleFa: "تعظیم گروهی زیر نورهای طلایی", badgeCategory: "heroic", badgeIcon: "🌟", badgeNameFa: "پایان همبستگی بازیگران", climaxEn: "Julian holds hands with his lead actors as cameras flash, celebrating the triumph of collaborative artistry.", climaxFa: "جولیان دست در دست بازیگرانش در برابر درخشش فلاش‌ها تعظیم کرد و پیروزی هنر جمعی را جشن گرفت.", xpReward: 185 },
  { pathCode: "ABAAB", titleEn: "Midnight Banquet at Palazzo Morosini", titleFa: "ضیافت نیمه‌شب در کاخ موروسینی", badgeCategory: "funny", badgeIcon: "🥂", badgeNameFa: "پایان رمانتیک و ونیزی", climaxEn: "Toasting with vintage prosecco beneath centuries-old chandeliers, the crew celebrates till dawn on the canal.", climaxFa: "در میان لوسترهای چندصدساله کاخ و نجوای امواج کانال، عوامل تا سپیده صبح پیروزی اثر را جشن گرفتند.", xpReward: 175 },
  { pathCode: "ABBAA", titleEn: "The Thirty-City Art-House Pilgrimage", titleFa: "تور سی شهر سینمای هنری", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان اصالت آنالوگ", climaxEn: "Film lovers wait in long overnight lines in Paris, Berlin, and Rome to experience the 35mm master print.", climaxFa: "علاقه‌مندان سینما در پاریس، برلین و رم شب را برای تماشای نسخه نگاتیو ۳۵ میلی‌متری در صف صبح کردند.", xpReward: 190 },
  { pathCode: "ABBAB", titleEn: "The Alpine Vault Eternity", titleFa: "جاودانگی در پناهگاه کوه‌های آلپ", badgeCategory: "secret", badgeIcon: "🏔️", badgeNameFa: "پایان گنجینه ابدی", climaxEn: "Deep inside a granite Swiss bunker, Reel Six is sealed in an argon gas chamber to endure for ten centuries.", climaxFa: "حلقه ششم در محفظه گاز آرگون میان صخره‌های گرانیتی آلپ جا گرفت تا برای ده قرن سالم بماند.", xpReward: 185 },
  { pathCode: "BAAAA", titleEn: "The Roman Laboratory Partnership", titleFa: "تأسیس آزمایشگاه سینمایی در رم", badgeCategory: "legendary", badgeIcon: "🏢", badgeNameFa: "پایان کارآفرینی هنری", climaxEn: "Julian and Giorgio build CineArte Roma, Europe's foremost boutique studio for photochemical and digital craft.", climaxFa: "جولیان و جورجو استودیوی سینه‌آرته رم را ساختند؛ برترین مرکز تلفیق شیمی نگاتیو و جادوی دیجیتال قاره اروپا.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "The Masterclass of Visual Poetry", titleFa: "مسترکلاس شعر تصویری در ونیز", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان تدریس بین‌المللی", climaxEn: "Five hundred aspiring cinematographers hang on every word as Giorgio and Julian deconstruct Reel Six's lighting.", climaxFa: "پانصد فیلم‌ساز جوان شیفته تحلیل گام‌به‌گام نورپردازی و رنگ شاهکار حلقه ششم توسط جولیان و جورجو شدند.", xpReward: 185 },
  { pathCode: "BAABA", titleEn: "The Institute of Experimental Formats", titleFa: "پژوهشکده قالب‌های نوین سینما", badgeCategory: "legendary", badgeIcon: "🔮", badgeNameFa: "پایان نوآوری مرزشکن", climaxEn: "The new institute pioneers projection technologies that merge tactile film textures with holographic lasers.", climaxFa: "پژوهشکده تازه نوآوری‌هایی پدید آورد که بافت ملموس نگاتیو را با لیزرهای هولوگرافیک پیوند می‌زد.", xpReward: 200 },
  { pathCode: "BAABB", titleEn: "The Sci-Fi Desert Masterpiece", titleFa: "شاهکار علمی‌تخیلی در دل کویر", badgeCategory: "explorer", badgeIcon: "🌌", badgeNameFa: "پایان حماسی و بصری", climaxEn: "Their follow-up space drama, shot on 65mm in the Namib desert, wins universal acclaim for its visual power.", climaxFa: "فیلم بعدی‌شان با نگاتیو ۶۵ میلی‌متری در کویر نامیب ساخته شد و منتقدان جهان را به شگفتی واداشت.", xpReward: 195 },
  { pathCode: "BABAA", titleEn: "The Golden Clapper Trophy", titleFa: "تندیس کلاکت طلایی برای سوفیا", badgeCategory: "heroic", badgeIcon: "🏆", badgeNameFa: "پایان درخشش مدیر فیلم‌برداری", climaxEn: "Sofia receives the International Guild Trophy as the youngest woman ever to win top cinematography honors.", climaxFa: "سوفیا به عنوان جوان‌ترین زن تاریخ، جایزه بزرگ انجمن بین‌المللی مدیران فیلم‌برداری را از آن خود کرد.", xpReward: 190 },
  { pathCode: "BABAB", titleEn: "Behind the Lens Luxury Book", titleFa: "کتاب نفیس 'پشت لنز دوربین'", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان شکوه عکاسی سینما", climaxEn: "Sofia's monochrome film photographs from the Venice shoot become an essential coffee-table art book.", climaxFa: "عکس‌های سیاه و سفید سوفیا از پشت صحنه ونیز به یکی از زیباترین کتاب‌های مرجع عکاسی سینما تبدیل شد.", xpReward: 180 },
  { pathCode: "BBAAA", titleEn: "The Running Director Folklore", titleFa: "اسطوره کارگردان دونده در ونیز", badgeCategory: "funny", badgeIcon: "🏃", badgeNameFa: "پایان شیرین و افسانه‌ای", climaxEn: "The image of Julian sprinting in a tuxedo with the metal canister becomes an iconic emblem of cinematic passion.", climaxFa: "تصویر دویدن جولیان با کت‌وشلوار شیک و قوطی فلزی به نماد جاودانه عشق و تعهد به هنر سینما بدل شد.", xpReward: 175 },
  { pathCode: "BBAAB", titleEn: "The Uncompromising Artist Creed", titleFa: "سوگندنامه هنرمند سازش‌ناپذیر", badgeCategory: "legendary", badgeIcon: "✍️", badgeNameFa: "پایان ماندگاری فلسفی", climaxEn: "Film schools print Julian's red carpet quotes on their studio entrance doors: 'Run for your art.'", climaxFa: "دانشکده‌های سینمایی جمله جولیان روی فرش قرمز را بر سردر خود حک کردند: 'برای هنرت از جان مایه بگذار.'", xpReward: 195 },
  { pathCode: "BBABA", titleEn: "Toast of the Venetian Night", titleFa: "سلامتی بر فراز آب‌های مهتابی", badgeCategory: "heroic", badgeIcon: "🍷", badgeNameFa: "پایان آرامش و افتخار", climaxEn: "Glass in hand, Julian looks out over the moonlit lagoon, knowing he refused to dilute his artistic soul.", climaxFa: "با جامی در دست رو به تالاب مهتابی، جولیان می‌دانست که روح هنری‌اش را هرگز به ثمن بخس نفروخته است.", xpReward: 185 },
  { pathCode: "BBABB", titleEn: "The Vault of the Venice Biennale", titleFa: "مخزن مهروموم‌شده دوسالانه ونیز", badgeCategory: "secret", badgeIcon: "🔒", badgeNameFa: "پایان گنجینه جاودان", climaxEn: "Reel Six is placed inside the Biennale President's personal vault as the defining film print of the festival.", climaxFa: "حلقه ششم در مخزن ویژه رئیس بینال جای گرفت تا نماد اصیل‌ترین نسخه تاریخ این رویداد باشد.", xpReward: 190 },
  { pathCode: "BBBBA", titleEn: "Medal of Cultural Honor", titleFa: "مدال افتخار محافظت از فرهنگ", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان شجاعت مدنی", climaxEn: "The President of the Italian Republic pins the Star of Merit onto Julian's lapel for saving cultural heritage.", climaxFa: "رئیس جمهور ایتالیا نشان زرین شایستگی را به پاس نجات آثار نادر فرهنگی بر سینه جولیان نشاند.", xpReward: 200 },
  { pathCode: "BBBBB", titleEn: "Midnight in the Canal Archives", titleFa: "شاهکار 'نیمه‌شب در کانال‌های ونیز'", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Julian's gripping memoir tops international bestseller lists, showing the world that behind every silver screen lies a thrilling battle for human truth and beauty.", climaxFa: "کتاب پرفروش جولیان جهانی شد و به همگان نشان داد که در پشت هر پرده نقره‌ای سینما، نبردی نفس‌گیر برای حقیقت، زیبایی و شرافت انسانی جریان دارد.", xpReward: 200 },
  { pathCode: "BAAAA", titleEn: "The Milan Film Ring Extinction", titleFa: "انهدام باند مافیای نگاتیو", badgeCategory: "heroic", badgeIcon: "⚖️", badgeNameFa: "پایان عدالت و قانون", climaxEn: "Cultural authorities recover over sixty priceless European negative master prints thanks to Julian's leads.", climaxFa: "پلیس با سرنخ‌های جولیان بیش از شصت نسخه اصلی از نگاتیوهای تاریخی اروپا را از چنگ قاچاقچیان نجات داد.", xpReward: 185 },
  { pathCode: "BAAAB", titleEn: "Celluloid Conspiracy Premiere", titleFa: "اکران پرسرصدای توطئه سلولوئید", badgeCategory: "legendary", badgeIcon: "🎥", badgeNameFa: "پایان بلاک‌باستر سینمایی", climaxEn: "Julian's movie about the heist opens at Cannes to rave reviews, cementing his place among cinema masters.", climaxFa: "فیلم تازه جولیان درباره ماجرای واقعی سرقت در فستیوال کن اکران شد و او را در زمره اساتید سینما نشاند.", xpReward: 200 },
  { pathCode: "BAABA", titleEn: "Venice Canal Noir Masterpiece", titleFa: "نوآر باشکوه کانال‌های مه گرفته", badgeCategory: "explorer", badgeIcon: "🛶", badgeNameFa: "پایان اصالت بصری", climaxEn: "The haunting night scenes filmed in silent Venetian canals become recognized as a triumph of modern noir.", climaxFa: "صحنه‌های فیلم‌برداری شده در سکوت آب‌های ونیز به عنوان اوج شکوه سینمای نوآر مدرن شناخته شدند.", xpReward: 190 },
  { pathCode: "BAABB", titleEn: "Hollywood and Venice Collaboration", titleFa: "پیوند هالیوود و سینمای مؤلف", badgeCategory: "heroic", badgeIcon: "🤝", badgeNameFa: "پایان درخشش مشترک", climaxEn: "Jack Sterling's nuanced dramatic performance under Julian's direction earns him his first Oscar nomination.", climaxFa: "بازی درخشان و متفاوت جک استرلینگ زیر هدایت جولیان نخستین نامزدی اسکار را برایش به ارمغان آورد.", xpReward: 195 },
  { pathCode: "BABAA", titleEn: "Auteur Cinema Studio Alliance", titleFa: "ائتلاف بزرگ سینمای مؤلف", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان اتحاد بین‌المللی", climaxEn: "Bianca and Julian found an international film fund that finances three uncompromising visionary directors every year.", climaxFa: "بیانکا و جولیان بنیادی جهانی تأسیس کردند که هر ساله هزینه ساخت آثار سه کارگردان نوآور را تأمین می‌کند.", xpReward: 200 },
  { pathCode: "BABAB", titleEn: "Grand Canal Moonlit Serenade", titleFa: "گوندولای پیروزی در مهتاب", badgeCategory: "funny", badgeIcon: "🌙", badgeNameFa: "پایان شاعرانه و شاد", climaxEn: "Drifting in a carved wooden gondola past illuminated palazzos, Julian and Sofia raise glasses to genuine art.", climaxFa: "در گوندولایی چوبی میان انعکاس نور کاخ‌ها روی آب، جولیان و سوفیا جام پیروزی هنر خالص را نوشیدند.", xpReward: 175 },
  { pathCode: "BBAAA", titleEn: "The Independent Art-House Revolution", titleFa: "انقلاب سینماهای مستقل اروپا", badgeCategory: "legendary", badgeIcon: "✊", badgeNameFa: "پایان استقلال و آزادی", climaxEn: "Four hundred independent cinemas prove that artistic conviction draws millions of passionate moviegoers.", climaxFa: "چهارصد سینمای هنری مستقل اثبات کردند که صداقت و شجاعت هنری میلیون‌ها بیننده مشتاق را به سینما می‌کشاند.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Venice Freedom of Expression Prize", titleFa: "جایزه سالانه آزادی بیان ونیز", badgeCategory: "heroic", badgeIcon: "🕊️", badgeNameFa: "پایان آزادی‌خواهی هنری", climaxEn: "Julian's annual foundation grants financial independence to brave young directors around the globe.", climaxFa: "بنیاد جولیان هر ساله استقلال مالی و امنیت خاطر را به کارگردانان جسور سراسر جهان هدیه می‌دهد.", xpReward: 195 },
  { pathCode: "BBBAA", titleEn: "Standing Ovation of the Critics", titleFa: "تشویق یکپارچه منتقدان جهان", badgeCategory: "legendary", badgeIcon: "🖋️", badgeNameFa: "پایان تحسین نخبگان", climaxEn: "The International Federation of Film Critics awards Julian the FIPRESCI Prize with a unanimous score.", climaxFa: "فدراسیون بین‌المللی منتقدان با آرای کامل جایزه معتبر فیپرشی را به شاهکار جولیان اهدا کرد.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "Cannes Masterclass of Directing", titleFa: "تدریس عالی در فستیوال کن", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان استادی در سینما", climaxEn: "Julian takes the masterclass podium at the Palais des Festivals, inspiring the next generation of cinematic visionaries.", climaxFa: "جولیان در کاخ جشنواره کن به عنوان استاد روی صحنه رفت تا نسل آینده فیلم‌سازان جهان را آموزش دهد.", xpReward: 195 },
];

export const story6FestivalPremiere: AdventureStory = buildAdventureStory({
  id: "b2-festival-premiere",
  storyIndex: 6,
  cefr: "B2",
  titleEn: "The Final Reel of Venice",
  titleFa: "آخرین حلقه فیلم در ونیز",
  genre: "cinema",
  genreLabelFa: "🎬 دنیای سینما و فیلم‌سازی",
  genreIcon: "🎬",
  synopsisEn:
    "Ambitious indie film director Julian is hours away from his prestigious Venice International Film Festival gala premiere, when the final 35mm master projection reel vanishes from the historic theater booth! Confront ruthless studio producers, decode cryptic marks in the canal film archives, or stage an emergency digital reconstruct across 32 thrilling endings!",
  synopsisFa:
    "جولیان، کارگردان مستقل و تحسین‌شده، تنها چند ساعت با شب افتتاحیه بزرگ فیلمش در فستیوال بین‌المللی فیلم ونیز فاصله دارد که آخرین حلقه نگاتیو ۳۵ میلی‌متری اثر از اتاق آپارات سینمای باستانی ناپدید می‌شود! با تهیه‌کنندگان سخت‌گیر، بایگانان مرموز نگاتیو در کانال‌های ونیز و دوراهی‌های هنری شجاعانه دست‌وپنجه نرم کنید تا در ۳۲ پایان سینمایی نفس‌گیر به حقیقت برسید!",
  coverImage: "/images/skills/reading/b2-festival-premiere.webp",
  nodes,
  endings,
});
