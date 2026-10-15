import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 6 (B1): Echoes of the Sunset Festival (طنین ملودی در فستیوال غروب)
// Genre: Music & Live Performance (موسیقی و اجرای زنده)
// CEFR: B1 (Present perfect, conditionals, music festival & audio gear vocabulary)
// Characters: Maya (Vocalist/Guitar), Noah (Drums), Sam (Bass/Tech), Elena (Director), Marco (Sound Tech)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Golden twilight settled over Harbor Bay as five thousand excited music fans filled the open-air festival lawn. Maya, nineteen-year-old lead singer and guitarist of The Neon Tide, tightened the strap on her vintage seafoam-green electric guitar. 'We have dreamed of headlining the Sunset Music Festival all summer,' she told Noah, the energetic drummer who was tapping his rhythm sticks against an equipment case. Suddenly, the stage monitors buzzed with a sharp crackle, and the entire main amplifier rack went completely dead.",
    keywords: [
      { word: "headlining", meaningFa: "اجرای اصلی فستیوال را داشتن", phonetic: "/ˈhedlaɪnɪŋ/" },
      { word: "vintage", meaningFa: "کلاسیک و باارزش و قدیمی", phonetic: "/ˈvɪntɪdʒ/" },
      { word: "monitors", meaningFa: "بلندگوهای مانیتورینگ روی صحنه", phonetic: "/ˈmɒnɪtəz/" },
      { word: "amplifier", meaningFa: "تقویت‌کننده صدای آمپلی‌فایر", phonetic: "/ˈæmplɪfaɪə/" },
    ],
    question: {
      promptEn: "What happened to the equipment right before the performance?",
      promptFa: "درست قبل از شروع اجرا چه اتفاقی برای تجهیزات افتاد؟",
      options: ["The main amplifier rack went completely dead", "The drum kit broke into pieces", "It began raining heavily"],
      correctIndex: 0,
      hintSnippet: "the entire main amplifier rack went completely dead",
      clueFa: "به جمله آخر نگاه کن: دستگاه تقویت‌کننده اصلی صدا ناگهان کاملاً قطع شد.",
    },
    choiceA: {
      labelEn: "Sprint backstage with Sam to inspect the circuit breaker and sound console!",
      labelFa: "سریع با سم برو پشت صحنه تا فیوزها و میز صدابرداری رو بررسی کنید!",
      descriptionFa: "شاید یک اتصالی ساده در مدار برق یا کابل‌های اصلی رخ داده باشه.",
    },
    choiceB: {
      labelEn: "Step straight to the stage edge and launch an unplugged acoustic set!",
      labelFa: "برو لبه صحنه و یک اجرای آکوستیک زنده بدون نیاز به برق شروع کن!",
      descriptionFa: "تماشاگران عاشق هنرمندهای شجاع و صمیمی هستند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Backstage was a maze of thick black audio cables and glowing rack lights. Sound engineer Marco was wiping sweat from his forehead beside a smoking junction box. 'A power surge from the coastal wind turbines blew the transformer fuses,' Marco explained anxiously. Sam, who studied electrical engineering at college, knelt beside the rack: 'We have two choices: we can rewire the backup generator in ten minutes, or switch to the classic tube amp in the storage trailer.'",
    keywords: [
      { word: "junction box", meaningFa: "جعبه تقسیم برق", phonetic: "/ˈdʒʌŋkʃn bɒks/" },
      { word: "transformer", meaningFa: "ترانسفورماتور تبدیل ولتاژ", phonetic: "/trænsˈfɔːmə/" },
      { word: "rewire", meaningFa: "سیم‌کشی مجدد و تغییر اتصالات", phonetic: "/ˌriːˈwaɪə/" },
      { word: "tube amp", meaningFa: "آمپلی‌فایر لامپی با صدای گرم کلاسیک", phonetic: "/tjuːb æmp/" },
    ],
    question: {
      promptEn: "What caused the power failure according to Marco?",
      promptFa: "به گفته مارکو چه چیزی باعث قطعی برق شد؟",
      options: ["A power surge from coastal wind turbines", "Someone spilled tea on the mixer", "A lightning bolt struck the stage"],
      correctIndex: 0,
      hintSnippet: "A power surge from the coastal wind turbines blew the transformer fuses",
      clueFa: "نوسان برق ناشی از توربین‌های بادی ساحلی باعث سوختن فیوز ترانس شده بود.",
    },
    choiceA: {
      labelEn: "Help Sam rewire the heavy-duty backup generator cables!",
      labelFa: "به سَم کمک کن کابل‌های ژنراتور اضطراری پرقدرت رو وصل کنه!",
      descriptionFa: "برق کل استیج و رقص‌نورها به طور کامل برمی‌گرده.",
    },
    choiceB: {
      labelEn: "Fetch the legendary vintage tube amplifier from the storage trailer!",
      labelFa: "آمپلی‌فایر لامپی افسانه‌ای قدیمی رو از انبار تجهیزات بیار!",
      descriptionFa: "صدای گرم و نوستالژیک اون آمپلی‌فایر کنسرت رو تاریخی می‌کنه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Maya grabbed a hollow-body acoustic guitar while Noah picked up a wooden cajon drum box. Together, they walked right up to the stage apron where thousands of fans were starting to murmur in confusion. Maya tapped her microphone stand, took a deep breath, and smiled warmly: 'Harbor Bay! The electricity took a nap, but our music does not need a plug!' The crowd erupted into deafening cheers at her boldness.",
    keywords: [
      { word: "hollow-body", meaningFa: "گیتار با کاسه چوبی توخالی آکوستیک", phonetic: "/ˈhɒləʊ ˈbɒdi/" },
      { word: "cajon", meaningFa: "ساز کوبه‌ای کاخن چوبی", phonetic: "/kəˈhɒn/" },
      { word: "apron", meaningFa: "پیش‌آمدگی لبه استیج به سمت تماشاگران", phonetic: "/ˈeɪprən/" },
      { word: "deafening", meaningFa: "بسیار بلند و گوش‌نواز", phonetic: "/ˈdefnɪŋ/" },
    ],
    question: {
      promptEn: "What percussion instrument did Noah pick up for the acoustic performance?",
      promptFa: "نوآ چه ساز کوبه‌ای برای اجرای آکوستیک برداشت؟",
      options: ["A wooden cajon drum box", "A pair of silver cymbals", "A heavy brass gong"],
      correctIndex: 0,
      hintSnippet: "Noah picked up a wooden cajon drum box",
      clueFa: "نوآ یک ساز کوبه‌ای کاخن چوبی برداشت و همراه مایا رفت.",
    },
    choiceA: {
      labelEn: "Start singing the band's most famous ballad, 'Midnight Ocean'!",
      labelFa: "ترانه مشهور گروه، 'اقیانوس نیمه‌شب'، رو با گیتار آکوستیک شروع کن!",
      descriptionFa: "پنج هزار نفر در تاریکی با شما هم‌خوانی خواهند کرد.",
    },
    choiceB: {
      labelEn: "Invite an indie cellist practicing in the front row to join you on stage!",
      labelFa: "از نوازنده ویولنسل که ردیف اول نشسته دعوت کن بیاد روی صحنه!",
      descriptionFa: "یک ترکیب جادویی میان راک مدرن و ویولنسل کلاسیک خلق می‌شه.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Sam and Maya aligned the thick copper terminals on the auxiliary generator. As Sam tightened the final ground clamp with his wrench, the diesel motor roared to life with a satisfying hum. Backstage monitor lights turned from red to vibrant emerald green. 'We have full voltage!' Marco cheered over his headset. 'Tell Maya to hit the stage with full overdrive!'",
    keywords: [
      { word: "terminals", meaningFa: "پایانه‌ها و سرپیچ‌های اتصال الکتریکی", phonetic: "/ˈtɜːmɪnlz/" },
      { word: "auxiliary", meaningFa: "کمکی و پشتیبان", phonetic: "/ɔːɡˈzɪliəri/" },
      { word: "voltage", meaningFa: "ولتاژ و نیروی محرکه الکتریکی", phonetic: "/ˈvəʊltɪdʒ/" },
      { word: "overdrive", meaningFa: "افکت صدای پرقدرت و پرطنین گیتار الکتریک", phonetic: "/ˈəʊvədraɪv/" },
    ],
    question: {
      promptEn: "What color did the monitor lights turn when power was restored?",
      promptFa: "وقتی برق وصل شد چراغ‌های مانیتورینگ چه رنگی شدند؟",
      options: ["Vibrant emerald green", "Deep purple", "Bright neon yellow"],
      correctIndex: 0,
      hintSnippet: "monitor lights turned from red to vibrant emerald green",
      clueFa: "چراغ‌ها از رنگ قرمز به رنگ سبز زمردی درخشان تغییر پیدا کردند.",
    },
    choiceA: {
      labelEn: "Fire up the computerized moving laser lights for a stadium rock spectacle!",
      labelFa: "رقص‌نورهای لیزری هوشمند رو برای یک اجرای راک آتشین روشن کنید!",
      descriptionFa: "هیجان فستیوال را با نورپردازی دیجیتال به اوج برسانید.",
    },
    choiceB: {
      labelEn: "Introduce a surprise synth-pop keyboard solo with Sam!",
      labelFa: "یک تکنوازی کیبورد سینث‌سایزر هیجان‌انگیز همراه با سَم اجرا کنید!",
      descriptionFa: "ریتم‌های رقص الکترونیک تماشاگران را به هیجان می‌آورد.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Maya and Marco unlocked the vintage storage flight case. Inside rested a 1968 custom valve amplifier with chrome knobs and tweed cloth. As Maya plugged her electric guitar into the warm tube circuit, the guitar sang with an organic, velvety tone that modern digital amps could never replicate. The sound was warm, intimate, and profoundly soulful.",
    keywords: [
      { word: "flight case", meaningFa: "جعبه محافظ چرخ‌دار تجهیزات پرواز", phonetic: "/ˈflaɪt keɪs/" },
      { word: "knobs", meaningFa: "پیچ‌های تنظیم صدا و تن", phonetic: "/nɒbz/" },
      { word: "velvety", meaningFa: "مخملی و لطیف و دلنشین", phonetic: "/ˈvelvəti/" },
      { word: "replicate", meaningFa: "بازسازی و تقلید کردن", phonetic: "/ˈreplɪkeɪt/" },
    ],
    question: {
      promptEn: "What kind of tone did the 1968 tube amplifier produce?",
      promptFa: "آمپلی‌فایر لامپی سال ۱۹۶۸ چه جور صدایی تولید کرد؟",
      options: ["An organic, velvety, and soulful tone", "A screeching metallic noise", "A very faint whisper"],
      correctIndex: 0,
      hintSnippet: "sang with an organic, velvety tone that modern digital amps could never replicate",
      clueFa: "گیتار با صدایی مخملی، طبیعی و بسیار عمیق به نواختن درآمد.",
    },
    choiceA: {
      labelEn: "Play an emotional blues-rock guitar solo that echoes across the bay!",
      labelFa: "یک سولو گیتار بلوز-راک احساسی بزن که طنینش در تمام خلیج بپیچه!",
      descriptionFa: "استعداد نوازندگی گیتار شما همه را شگفت‌زده خواهد کرد.",
    },
    choiceB: {
      labelEn: "Blend the retro guitar tone with Noah's jazz shuffle drum rhythm!",
      labelFa: "صدای رترو گیتار رو با ریتم درامز جَز نوآ ترکیب کن!",
      descriptionFa: "یک اثر هنری خلاقانه و باوقار که منتقدان عاشقش می‌شن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Under the starlight, Maya sang the opening melody of 'Midnight Ocean'. Without big speakers, five thousand voices quietly joined her in singing the chorus. Noah tapped complex rhythmic patterns on the cajon box, creating an enchanting acoustic heartbeat. Suddenly, thousands of fans raised their glowing mobile phones, transforming the dark lawn into a sea of shimmering stars.",
    keywords: [
      { word: "chorus", meaningFa: "هم‌خوانی ترجیع‌بند ترانه", phonetic: "/ˈkɔːrəs/" },
      { word: "enchanting", meaningFa: "سحرانگیز و مسحورکننده", phonetic: "/ɪnˈtʃɑːntɪŋ/" },
      { word: "shimmering", meaningFa: "درخشان و سوسوزننده", phonetic: "/ˈʃɪmərɪŋ/" },
      { word: "heartbeat", meaningFa: "ضربان ریتمیک قلب‌مانند", phonetic: "/ˈhɑːtbiːt/" },
    ],
    question: {
      promptEn: "What did the fans do during the chorus of 'Midnight Ocean'?",
      promptFa: "هواداران در طول هم‌خوانی چه کار کردند؟",
      options: ["Raised their glowing phones like a sea of stars", "Ran to the exit gates", "Sat down on the grass in silence"],
      correctIndex: 0,
      hintSnippet: "thousands of fans raised their glowing mobile phones, transforming the dark lawn into a sea of shimmering stars",
      clueFa: "هزاران نفر گوشی‌های روشن خودشون رو بالا گرفتند مثل دریایی از ستاره‌ها.",
    },
    choiceA: {
      labelEn: "Lead the crowd in an epic three-part vocal harmony!",
      labelFa: "تماشاگران رو در یک هم‌خوانی سه‌صدایی پرشکوه و منظم رهبری کن!",
      descriptionFa: "همبستگی بی‌نظیر پنج هزار نفر زیر آسمان شب.",
    },
    choiceB: {
      labelEn: "Step down into the front barrier to share the microphone with fans!",
      labelFa: "بیا پایین جلوی نرده‌های استیج و میکروفون رو با هواداران شریک شو!",
      descriptionFa: "صمیمیت خالص با طرفدارانی که از شهرهای دور آمده‌اند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "The cellist, a talented music student named Tara, climbed onto the stage with her wooden instrument. She tuned her strings in seconds and added a deep, melancholy counter-melody to Maya's guitar progression. The fusion of acoustic rock and rich classical cello gave goosebumps to everyone in attendance, including festival director Elena, who was filming from the sound tower.",
    keywords: [
      { word: "counter-melody", meaningFa: "کنترپوان / خط ملودی متقابل و همراه", phonetic: "/ˈkaʊntə ˈmelədi/" },
      { word: "progression", meaningFa: "توالی آکوردهای موسیقی", phonetic: "/prəˈɡreʃn/" },
      { word: "fusion", meaningFa: "تلفیق دو سبک موسیقی متفاوت", phonetic: "/ˈfjuːʒn/" },
      { word: "goosebumps", meaningFa: "سیخ شدن مو به تن از لذت و هیجان", phonetic: "/ˈɡuːsbʌmps/" },
    ],
    question: {
      promptEn: "Who was Tara and what instrument did she play?",
      promptFa: "تارا چه کسی بود و چه سازی می‌نواخت؟",
      options: ["A talented music student playing the wooden cello", "A famous trumpet player", "A radio host playing the flute"],
      correctIndex: 0,
      hintSnippet: "The cellist, a talented music student named Tara, climbed onto the stage with her wooden instrument",
      clueFa: "تارا دانشجوی بااستعداد موسیقی بود که ویولنسل چوبی می‌نواخت.",
    },
    choiceA: {
      labelEn: "Compose an instant instrumental bridge combining guitar and cello!",
      labelFa: "یک پل دونوازی بداهه میان گیتار و ویولنسل خلق کن!",
      descriptionFa: "اوج خلاقیت موسیقیایی که همه را مبهوت می‌کند.",
    },
    choiceB: {
      labelEn: "Invite Tara to become a permanent touring member of The Neon Tide!",
      labelFa: "از تارا دعوت کن تا عضو رسمی تورهای کنسرت گروه شما بشه!",
      descriptionFa: "تولد یک گروه موسیقی جدید با سبکی خاص و جهانی.",
    },
  },

  // STEP 4 (8 NODES: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Beams of azure and gold laser light pierced the night sky as Maya's electric guitar screamed through eight massive speaker stacks. The crowd jumped in unison, sending vibrations through the pier. Drone cameras captured the breathtaking spectacle from two hundred meters above the festival grounds.",
    keywords: [
      { word: "pierced", meaningFa: "شکافت و در آسمان نفوذ کرد", phonetic: "/pɪəst/" },
      { word: "unison", meaningFa: "با هماهنگی کامل و هم‌زمان", phonetic: "/ˈjuːnɪsn/" },
      { word: "vibrations", meaningFa: "لرزش‌های صوتی پرقدرت", phonetic: "/vaɪˈbreɪʃnz/" },
      { word: "spectacle", meaningFa: "منظره و نمایش باشکوه بصری", phonetic: "/ˈspektəkl/" },
    ],
    question: {
      promptEn: "What captured the aerial view of the concert?",
      promptFa: "چه چیزی تصویر هوایی کنسرت را ثبت کرد؟",
      options: ["Drone cameras flying above the festival", "A hot air balloon", "A traffic helicopter"],
      correctIndex: 0,
      hintSnippet: "Drone cameras captured the breathtaking spectacle from two hundred meters above",
      clueFa: "دوربین‌های پهپاد از فراز ۲۰۰ متری این منظره باابهت را فیلم‌برداری کردند.",
    },
    choiceA: { labelEn: "Finish with a synchronized drum-and-guitar power leap!", labelFa: "با یک پرش هماهنگ گیتار و درامز روی صحنه آهنگ رو تموم کن!", descriptionFa: "پایان‌های ۳۱ و ۳۲" },
    choiceB: { labelEn: "Announce the release of your debut vinyl album tonight!", labelFa: "انتشار اولین آلبوم گرامافون گروه رو همین امشب اعلام کن!", descriptionFa: "پایان‌های ۳۳ و ۳۴" },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Sam switched on an analog synthesizer, playing funky retro basslines beneath Noah's energetic four-on-the-floor beat. Maya added catchy rhythm guitar chops, turning the festival into a massive seaside dance party. Even the food truck chefs were dancing with spatulas in hand.",
    keywords: [
      { word: "synthesizer", meaningFa: "سینث‌سایزر الکترونیک", phonetic: "/ˈsɪnθəsaɪzə/" },
      { word: "analog", meaningFa: "آنالوگ و اصیل با مدار الکتریکی گرم", phonetic: "/ˈænəlɒɡ/" },
      { word: "funky", meaningFa: "ریتمیک و رقصی به سبک فانک", phonetic: "/ˈfʌŋki/" },
      { word: "spatulas", meaningFa: "کفگیرهای آشپزی", phonetic: "/ˈspætʃələz/" },
    ],
    question: {
      promptEn: "What instrument did Sam play during the dance section?",
      promptFa: "سَم در بخش ریتمیک چه سازی نواخت؟",
      options: ["An analog synthesizer", "A wooden recorder", "A brass tuba"],
      correctIndex: 0,
      hintSnippet: "Sam switched on an analog synthesizer, playing funky retro basslines",
      clueFa: "سَم سینث‌سایزر آنالوگ رو روشن کرد و بیس‌های ریتمیک نواخت.",
    },
    choiceA: { labelEn: "Teach the crowd a fun two-step festival dance move!", labelFa: "یک رقص هماهنگ دوضرب ساده به هواداران یاد بده!", descriptionFa: "پایان‌های ۳۵ و ۳۶" },
    choiceB: { labelEn: "Record the crowd's stomping feet as a live sample for the next single!", labelFa: "صدای هماهنگ پای تماشاگران رو برای آهنگ بعدی ضبط کن!", descriptionFa: "پایان‌های ۳۷ و ۳۸" },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The warm tubes of the 1968 amplifier glowed amber behind the speaker grille. Maya bent the high strings on her guitar, sustaining a breathtaking note for twelve seconds that sailed over the ocean waves. A senior music reviewer from Rolling Harmony magazine nodded in genuine reverence.",
    keywords: [
      { word: "amber", meaningFa: "کهربایی و نارنجی درخشان", phonetic: "/ˈæmbə/" },
      { word: "sustaining", meaningFa: "ممتد نگه داشتن طنین نت", phonetic: "/səˈsteɪnɪŋ/" },
      { word: "reverence", meaningFa: "احترام عمیق و ستایش هنری", phonetic: "/ˈrevərəns/" },
      { word: "grille", meaningFa: "شبکه محافظ توری بلندگو", phonetic: "/ɡrɪl/" },
    ],
    question: {
      promptEn: "How long did Maya sustain her guitar note?",
      promptFa: "مایا چقدر نت گیتار را ممتد نگه داشت؟",
      options: ["Twelve seconds", "Two minutes", "One second"],
      correctIndex: 0,
      hintSnippet: "sustaining a breathtaking note for twelve seconds",
      clueFa: "مایا نت گیتار را دوازده ثانیه کامل در هوا معلق نگه داشت.",
    },
    choiceA: { labelEn: "Dedicate the blues solo to classic rock legends who inspired you!", labelFa: "تکنوازی بلوز رو به اسطوره‌های راک که الهام‌بخشت بودن تقدیم کن!", descriptionFa: "پایان‌های ۳۹ و ۴۰" },
    choiceB: { labelEn: "Invite your guitar mentor from town onto the stage!", labelFa: "استاد قدیمی گیتارت در شهر رو به روی استیج دعوت کن!", descriptionFa: "پایان‌های ۴۱ و ۴۲" },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The combination of vintage guitar overdrive and Noah's swing groove created an irresistible indie-jazz swing. Music producers standing near the VIP marquee hurried to take notes. 'That sound has timeless character,' one major record label executive whispered to Elena.",
    keywords: [
      { word: "groove", meaningFa: "ریتم و ضرب روان و دلنشین", phonetic: "/ɡruːv/" },
      { word: "timeless", meaningFa: "جاودانه و فارغ از زمان", phonetic: "/ˈtaɪmləs/" },
      { word: "executive", meaningFa: "مدیر ارشد کمپانی موسیقی", phonetic: "/ɪɡˈzekjətɪv/" },
      { word: "marquee", meaningFa: "چادر بزرگ تشریفاتی VIP", phonetic: "/mɑːˈkiː/" },
    ],
    question: {
      promptEn: "What did the record label executive praise about the band's sound?",
      promptFa: "مدیر ارشد کمپانی موسیقی چه چیزی از صدای گروه را تحسین کرد؟",
      options: ["Its timeless character", "Its loud volume", "The shiny instruments"],
      correctIndex: 0,
      hintSnippet: "That sound has timeless character, one major record label executive whispered",
      clueFa: "او گفت این صدا دارای شخصیتی اصیل و جاودانه است.",
    },
    choiceA: { labelEn: "Negotiate a creative contract that guarantees artistic freedom!", labelFa: "یک قرارداد اختصاصی با تضمین آزادی کامل هنری ببندید!", descriptionFa: "پایان‌های ۴۳ و ۴۴" },
    choiceB: { labelEn: "Release the entire live concert recording as a charity album!", labelFa: "کل ضبط زنده کنسرت رو به عنوان آلبوم خیریه منتشر کنید!", descriptionFa: "پایان‌های ۴۵ و ۴۶" },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Maya divided the crowd into three sections: left, center, and right. With clear hand signals, she guided each section to sing different musical intervals. Five thousand voices merged into a magnificent cathedral of sound that resonated across the entire coastline without a single watt of electric power.",
    keywords: [
      { word: "intervals", meaningFa: "فواصل پرده‌های موسیقی", phonetic: "/ˈɪntəvlz/" },
      { word: "merged", meaningFa: "ادغام شدند و به هم پیوستند", phonetic: "/mɜːdʒd/" },
      { word: "cathedral", meaningFa: "شکوه باشکوه و طنین‌انداز", phonetic: "/kəˈθiːdrəl/" },
      { word: "watt", meaningFa: "وات / واحد توان برق", phonetic: "/wɒt/" },
    ],
    question: {
      promptEn: "How many sections did Maya divide the crowd into for singing?",
      promptFa: "مایا جمعیت را برای هم‌خوانی به چند بخش تقسیم کرد؟",
      options: ["Three sections: left, center, and right", "Ten small groups", "Only two people"],
      correctIndex: 0,
      hintSnippet: "Maya divided the crowd into three sections: left, center, and right",
      clueFa: "مایا تماشاگران را به سه بخش چپ، وسط و راست تقسیم کرد.",
    },
    choiceA: { labelEn: "Hold the final chord until total silence falls over the bay!", labelFa: "آکورد پایانی رو تا سکوت کامل خلیج نگه دار!", descriptionFa: "پایان‌های ۴۷ و ۴۸" },
    choiceB: { labelEn: "Start a massive peaceful singalong of an ancient folk anthem!", labelFa: "یک سرود کهن محلی رو با تمام جمعیت هم‌صدا بخونید!", descriptionFa: "پایان‌های ۴۹ و ۵۰" },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Maya knelt at the front barrier, holding the microphone toward two young sisters wearing matching band T-shirts. Their voices rang clear and pure into the quiet night, singing the lyrics word for word. Tears welled up in fans' eyes at the touching moment of musical connection.",
    keywords: [
      { word: "barrier", meaningFa: "نرده حائل استیج", phonetic: "/ˈbæriə/" },
      { word: "lyrics", meaningFa: "کلمات و متن ترانه", phonetic: "/ˈlɪrɪks/" },
      { word: "welled", meaningFa: "حلقه زد و جاری شد", phonetic: "/weld/" },
      { word: "connection", meaningFa: "پیوند عمیق عاطفی", phonetic: "/kəˈnekʃn/" },
    ],
    question: {
      promptEn: "Who did Maya share the microphone with at the front barrier?",
      promptFa: "مایا میکروفون را با چه کسانی در ردیف جلو شریک شد؟",
      options: ["Two young sisters wearing matching band T-shirts", "A festival security guard", "A photographer"],
      correctIndex: 0,
      hintSnippet: "holding the microphone toward two young sisters wearing matching band T-shirts",
      clueFa: "مایا میکروفون رو جلوی دو خواهر با تیشرت‌های ست گروه گرفت.",
    },
    choiceA: { labelEn: "Hand your favorite guitar pick to the young sisters as a gift!", labelFa: "مضراب خوش‌شانسی گیتارت رو به عنوان یادگاری به دو خواهر هدیه بده!", descriptionFa: "پایان‌های ۵۱ و ۵۲" },
    choiceB: { labelEn: "Invite them backstage after the show for juice and photos!", labelFa: "بعد از کنسرت اون‌ها رو برای عکس و نوشیدنی به پشت صحنه دعوت کن!", descriptionFa: "پایان‌های ۵۳ و ۵۴" },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Maya's delicate acoustic picking intertwined with Tara's weeping cello lines. The melody climbed and descended like ocean tides, drawing every listener into a hypnotic trance. Festival director Elena whispered to the crew: 'This is the most extraordinary piece of live music in our twenty-year history.'",
    keywords: [
      { word: "intertwined", meaningFa: "در هم تنیده شد", phonetic: "/ˌɪntəˈtwaɪnd/" },
      { word: "weeping", meaningFa: "محزون و عمیقاً سوزناک", phonetic: "/ˈwiːpɪŋ/" },
      { word: "hypnotic", meaningFa: "مسحورکننده و هیپنوتیزم‌کننده", phonetic: "/hɪpˈnɒtɪk/" },
      { word: "extraordinary", meaningFa: "فوق‌العاده و استثنایی", phonetic: "/ɪkˈstrɔːdnri/" },
    ],
    question: {
      promptEn: "How long had the festival been running according to Elena?",
      promptFa: "به گفته النا، فستیوال چند سال قدمت داشت؟",
      options: ["Twenty years", "Fifty years", "Five years"],
      correctIndex: 0,
      hintSnippet: "in our twenty-year history",
      clueFa: "النا گفت در تاریخ بیست ساله فستیوال چنین قطعه‌ای اجرا نشده بود.",
    },
    choiceA: { labelEn: "Record a studio version of the guitar-cello duet next Monday!", labelFa: "دوشنبه آینده نسخه استودیویی دونوازی گیتار-ویولنسل رو ضبط کنید!", descriptionFa: "پایان‌های ۵۵ و ۵۶" },
    choiceB: { labelEn: "Perform the piece at the National Symphony Hall next month!", labelFa: "این قطعه رو ماه آینده در تالار سمفونی ملی اجرا کنید!", descriptionFa: "پایان‌های ۵۷ و ۵۸" },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "During the passionate crescendo, Tara smiled at Maya and nodded her head in full agreement. The music built up to a triumphant peak, and when the final note faded into the ocean breeze, the entire park rose in a five-minute standing ovation. Elena handed Maya a golden microphone trophy.",
    keywords: [
      { word: "crescendo", meaningFa: "کرشندو / اوج‌گیری تدریجی صدای موسیقی", phonetic: "/krəˈʃendəʊ/" },
      { word: "triumphant", meaningFa: "پیروزمندانه و شکوهمند", phonetic: "/traɪˈʌmfənt/" },
      { word: "ovation", meaningFa: "تشویق ایستاده و پرشور تماشاگران", phonetic: "/əʊˈveɪʃn/" },
      { word: "faded", meaningFa: "به آرامی محو شد", phonetic: "/ˈfeɪdɪd/" },
    ],
    question: {
      promptEn: "What did Elena hand Maya at the end of the standing ovation?",
      promptFa: "النا در پایان تشویق پرشور چه چیزی به مایا تقدیم کرد؟",
      options: ["A golden microphone trophy", "A bouquet of plastic flowers", "A wooden chair"],
      correctIndex: 0,
      hintSnippet: "Elena handed Maya a golden microphone trophy",
      clueFa: "النا تندیس میکروفون طلایی فستیوال رو به مایا اهدا کرد.",
    },
    choiceA: { labelEn: "Headline the International World Music Festival in Paris!", labelFa: "سرگروه فستیوال بین‌المللی موسیقی پاریس در سال آینده بشید!", descriptionFa: "پایان‌های ۵۹ و ۶۰" },
    choiceB: { labelEn: "Establish a free music school for underprivileged kids in the bay!", labelFa: "یک آموزشگاه رایگان موسیقی برای کودکان کم‌بضاعت ساحل تأسیس کنید!", descriptionFa: "پایان‌های ۶۱ و ۶۲" },
  },

  // STEP 5 (16 NODES: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "On the final thunderous crash of Noah's cymbals, Maya and Sam leaped simultaneously off the amplifier risers. Pyrotechnic gold spark fountains lit up the edge of the stage, creating an unforgettable rock-and-roll climax.",
    keywords: [
      { word: "simultaneously", meaningFa: "به طور همزمان", phonetic: "/ˌsɪmlˈteɪniəsli/" },
      { word: "risers", meaningFa: "سکوهای برجسته استیج", phonetic: "/ˈraɪzəz/" },
      { word: "pyrotechnic", meaningFa: "آتش‌بازی و نورافشانی استیج", phonetic: "/ˌpaɪrəʊˈteknɪk/" },
      { word: "climax", meaningFa: "نقطه اوج هیجان", phonetic: "/ˈklaɪmæks/" },
    ],
    question: {
      promptEn: "What lit up the edge of the stage at the climax?",
      promptFa: "در لحظه اوج چه چیزی لبه صحنه را روشن کرد؟",
      options: ["Pyrotechnic gold spark fountains", "Candles", "Car headlights"],
      correctIndex: 0,
      hintSnippet: "Pyrotechnic gold spark fountains lit up the edge of the stage",
      clueFa: "آبشارهای جرقه طلایی آتش‌بازی لبه استیج را روشن کردند.",
    },
    choiceA: { labelEn: "Raise your guitar high above your head to thank the fans!", labelFa: "گیتارت رو بالای سرت بگیر و از هواداران تشکر کن!", descriptionFa: "پایان شماره ۱" },
    choiceB: { labelEn: "Toss your sweatband and drumsticks into the cheering crowd!", labelFa: "مچ‌بند و چوب‌های درامز رو به میان تماشاگران پرتاب کنید!", descriptionFa: "پایان شماره ۲" },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Maya stepped to the center microphone: 'Tonight, our debut album Seafoam Dreams is officially out on limited-edition vinyl!' The festival merchandise booth was swarmed within minutes, selling every single copy before midnight.",
    keywords: [
      { word: "vinyl", meaningFa: "صفحه گرامافون وینیلی باکیفیت", phonetic: "/ˈvaɪnl/" },
      { word: "merchandise", meaningFa: "غرفه فروش اقلام رسمی گروه", phonetic: "/ˈmɜːtʃəndaɪs/" },
      { word: "swarmed", meaningFa: "ازدحام کردند و هجوم آوردند", phonetic: "/swɔːmd/" },
      { word: "limited-edition", meaningFa: "نسخه کلکسیونی و با تعداد محدود", phonetic: "/ˌlɪmɪtɪd ɪˈdɪʃn/" },
    ],
    question: {
      promptEn: "What format was the debut album released on?",
      promptFa: "آلبوم اول در چه قالبی منتشر شد؟",
      options: ["Limited-edition vinyl", "Cassette tape", "Floppy disk"],
      correctIndex: 0,
      hintSnippet: "our debut album Seafoam Dreams is officially out on limited-edition vinyl",
      clueFa: "آلبوم بر روی صفحات گرامافون وینیلی کلکسیونی عرضه شد.",
    },
    choiceA: { labelEn: "Sign copies at the festival booth until 2 AM!", labelFa: "تا ساعت دو بامداد در غرفه برای طرفداران امضا بزنید!", descriptionFa: "پایان شماره ۳" },
    choiceB: { labelEn: "Keep copy number one framed in the band's rehearsal garage!", labelFa: "نسخه شماره یک رو در گاراژ تمرین گروه قاب بگیرید!", descriptionFa: "پایان شماره ۴" },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Five thousand people stepped to the left, then hopped to the right in perfect sync with the bassline. The synchronized movement created a tidal wave of smiles across the lawn, making festival security guards grin and dance along.",
    keywords: [
      { word: "sync", meaningFa: "هماهنگی کامل", phonetic: "/sɪŋk/" },
      { word: "tidal", meaningFa: "جزر و مدی و خروشان", phonetic: "/ˈtaɪdl/" },
      { word: "security", meaningFa: "مأموران انتظامات فستیوال", phonetic: "/sɪˈkjʊərəti/" },
      { word: "movement", meaningFa: "حرکت موزون", phonetic: "/ˈmuːvmənt/" },
    ],
    question: {
      promptEn: "What did the security guards do when the crowd started dancing?",
      promptFa: "وقتی جمعیت شروع به رقصیدند نگهبانان چه کار کردند؟",
      options: ["Grinned and danced along with the crowd", "Ran away", "Blow their whistles angrily"],
      correctIndex: 0,
      hintSnippet: "making festival security guards grin and dance along",
      clueFa: "مأموران انتظامات هم با لبخند شروع به رقصیدن کردند.",
    },
    choiceA: { labelEn: "Post the drone dance video online to start a global trend!", labelFa: "ویدئوی رقص پهپاد رو منتشر کن تا تبدیل به ترند جهانی بشه!", descriptionFa: "پایان شماره ۵" },
    choiceB: { labelEn: "Invite the security team on stage for the final encore bow!", labelFa: "تیم انتظامات رو برای تعظیم پایانی روی صحنه دعوت کن!", descriptionFa: "پایان شماره ۶" },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Marco captured the resonant stomping of ten thousand boots with boundary microphones placed along the wooden stage barriers. The thunderous, primal pulse was pure organic rhythm that would power the band's next breakthrough studio single.",
    keywords: [
      { word: "boundary", meaningFa: "میکروفون‌های مسطح مرزی حساس", phonetic: "/ˈbaʊndri/" },
      { word: "primal", meaningFa: "اصیل و پرانرژی و پرقدرت", phonetic: "/ˈpraɪml/" },
      { word: "breakthrough", meaningFa: "اثر موفقیت‌آمیز و رکوردشکن", phonetic: "/ˈbreɪkθruː/" },
      { word: "pulse", meaningFa: "نبض ریتمیک موسیقی", phonetic: "/pʌls/" },
    ],
    question: {
      promptEn: "What was captured by the boundary microphones?",
      promptFa: "چه صدایی توسط میکروفون‌های مرزی ضبط شد؟",
      options: ["The resonant stomping of ten thousand boots", "Wind noise", "Crying babies"],
      correctIndex: 0,
      hintSnippet: "captured the resonant stomping of ten thousand boots",
      clueFa: "صدای کوبش طنین‌انداز پاهای هزاران هوادار ضبط شد.",
    },
    choiceA: { labelEn: "Title the new single 'Heartbeat of Harbor Bay'!", labelFa: "اسم آهنگ جدید رو بذار 'ضربان قلب خلیج هاربر'!", descriptionFa: "پایان شماره ۷" },
    choiceB: { labelEn: "Credit all five thousand festival fans in the album liner notes!", labelFa: "نام تمام هواداران فستیوال رو در دفترچه آلبوم درج کنید!", descriptionFa: "پایان شماره ۸" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Maya closed her eyes and poured raw soul into every note, honoring the blues pioneers who shaped modern rock music. The crowd stood transfixed under the moonlight as the vintage amplifier delivered the purest sustain ever heard on the bay.",
    keywords: [
      { word: "pioneers", meaningFa: "پیشگامان و بنیان‌گذاران سبک", phonetic: "/ˌpaɪəˈnɪəz/" },
      { word: "transfixed", meaningFa: "مات و مبهوت مانده", phonetic: "/trænsˈfɪkst/" },
      { word: "moonlight", meaningFa: "نور مهتاب", phonetic: "/ˈmuːnlaɪt/" },
      { word: "sustain", meaningFa: "ماندگاری طنین ساز", phonetic: "/səˈsteɪn/" },
    ],
    question: {
      promptEn: "Who did Maya honor during her emotional guitar solo?",
      promptFa: "مایا در تکنوازی احساسی‌اش از چه کسانی تجلیل کرد؟",
      options: ["Classic blues rock pioneers", "Her math teacher", "A sports athlete"],
      correctIndex: 0,
      hintSnippet: "honoring the blues pioneers who shaped modern rock music",
      clueFa: "مایا از پیشگامان سبک بلوز راک که موسیقی را متحول کردند تجلیل کرد.",
    },
    choiceA: { labelEn: "Donate the vintage guitar to the National Rock Museum!", labelFa: "این گیتار کلاسیک رو به موزه ملی موسیقی راک اهدا کن!", descriptionFa: "پایان شماره ۹" },
    choiceB: { labelEn: "Receive a standing ovation from legendary artists in attendance!", labelFa: "تشویق ایستاده اسطوره‌های حاضر در سالن رو دریافت کن!", descriptionFa: "پایان شماره ۱۰" },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Elderly Mr. Davies, who taught Maya her first chord at age nine, walked up the stage stairs with his battered acoustic guitar. Together, student and teacher traded sweet blues licks, proving that great music bridges every generation.",
    keywords: [
      { word: "battered", meaningFa: "قدیمی و رنگ‌ورورفته با اصالت", phonetic: "/ˈbætəd/" },
      { word: "licks", meaningFa: "جملات کوتاه و ملودیک گیتار", phonetic: "/lɪks/" },
      { word: "bridges", meaningFa: "پل زدن میان دو چیز", phonetic: "/ˈbrɪdʒɪz/" },
      { word: "generation", meaningFa: "نسل‌های مختلف", phonetic: "/ˌdʒenəˈreɪʃn/" },
    ],
    question: {
      promptEn: "Who was Mr. Davies to Maya?",
      promptFa: "آقای دیویس چه نسبتی با مایا داشت؟",
      options: ["Her first guitar teacher who taught her at age nine", "Her doctor", "A taxi driver"],
      correctIndex: 0,
      hintSnippet: "Mr. Davies, who taught Maya her first chord at age nine",
      clueFa: "او اولین معلم گیتار مایا بود که در نه سالگی به او آکورد یاد داد.",
    },
    choiceA: { labelEn: "Dedicate the entire festival tour to music teachers everywhere!", labelFa: "کل تور فستیوال رو به تمام معلمان دلسوز موسیقی تقدیم کنید!", descriptionFa: "پایان شماره ۱۱" },
    choiceB: { labelEn: "Endow an annual music scholarship in Mr. Davies' name!", labelFa: "یک بورسیه سالانه موسیقی به نام آقای دیویس تأسیس کن!", descriptionFa: "پایان شماره ۱۲" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "At 1 AM in the festival production office, Maya and the label executive signed an indie contract that gave the band 100% control over their songwriting, album artwork, and tour locations. 'Art first, always,' Maya stated firmly.",
    keywords: [
      { word: "artwork", meaningFa: "طراحی جلد و هویت بصری آلبوم", phonetic: "/ˈɑːtwɜːk/" },
      { word: "firmly", meaningFa: "با قاطعیت و استواری", phonetic: "/ˈfɜːmli/" },
      { word: "guarantees", meaningFa: "تضمین‌ها و گارانتی‌ها", phonetic: "/ˌɡærənˈtiːz/" },
      { word: "songwriting", meaningFa: "ترانه‌سرایی و آهنگسازی", phonetic: "/ˈsɒŋraɪtɪŋ/" },
    ],
    question: {
      promptEn: "What did the contract guarantee for the band?",
      promptFa: "قرارداد چه چیزی را برای گروه تضمین کرد؟",
      options: ["100% creative control over songs, artwork, and tours", "Free pizza every day", "A trip to the moon"],
      correctIndex: 0,
      hintSnippet: "gave the band 100% control over their songwriting, album artwork, and tour locations",
      clueFa: "آزادی ۱۰۰ درصدی در آهنگسازی، طراحی جلد و برگزاری تورها.",
    },
    choiceA: { labelEn: "Celebrate with midnight pancakes at the harbor diner!", labelFa: "پیروزی رو با پنکیک‌های نیمه‌شب در غذاخوری ساحل جشن بگیرید!", descriptionFa: "پایان شماره ۱۳" },
    choiceB: { labelEn: "Announce your worldwide indie tour starting in Tokyo!", labelFa: "شروع تور جهانی مستقل گروه از توکیو را اعلام کنید!", descriptionFa: "پایان شماره ۱۴" },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The live concert recording, captured on tape with the vintage 1968 amplifier, raised half a million dollars for ocean conservation along Harbor Bay. Environmentalists and music critics alike hailed the project as a masterpiece of social purpose.",
    keywords: [
      { word: "conservation", meaningFa: "حفاظت از محیط‌زیست و دریا", phonetic: "/ˌkɒnsəˈveɪʃn/" },
      { word: "hailed", meaningFa: "با ستایش نام بردند", phonetic: "/heɪld/" },
      { word: "purpose", meaningFa: "هدف ارزشمند و رسالت", phonetic: "/ˈpɜːpəs/" },
      { word: "masterpiece", meaningFa: "شاهکار هنری", phonetic: "/ˈmɑːstəpiːs/" },
    ],
    question: {
      promptEn: "What cause did the live album raise half a million dollars for?",
      promptFa: "آلبوم زنده برای چه هدفی نیم میلیون دلار پول جمع‌آوری کرد؟",
      options: ["Ocean conservation along Harbor Bay", "Buying expensive sports cars", "A new parking lot"],
      correctIndex: 0,
      hintSnippet: "raised half a million dollars for ocean conservation along Harbor Bay",
      clueFa: "برای حفاظت از محیط زیست دریایی خلیج هاربر.",
    },
    choiceA: { labelEn: "Plant ten thousand native mangrove trees with the funds!", labelFa: "ده هزار نهال حرا با درآمدهای آلبوم در ساحل بکارید!", descriptionFa: "پایان شماره ۱۵" },
    choiceB: { labelEn: "Perform an annual green concert completely powered by solar energy!", labelFa: "هر سال یک کنسرت سبز تماماً با انرژی خورشیدی برگزار کنید!", descriptionFa: "پایان شماره ۱۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "When the final glorious chord subsided, five thousand people held their breath in reverent silence. For fifteen seconds, only the soft rhythm of ocean waves hitting the pebbles could be heard. Then, the night erupted in ecstatic cheers.",
    keywords: [
      { word: "subsided", meaningFa: "به آرامی فروکش کرد", phonetic: "/səbˈsaɪdɪd/" },
      { word: "reverent", meaningFa: "احترام‌آمیز و پرابهت", phonetic: "/ˈrevərənt/" },
      { word: "ecstatic", meaningFa: "سرشار از شعف و شوریدگی", phonetic: "/ɪkˈstætɪk/" },
      { word: "pebbles", meaningFa: "سنگ‌ریزه‌های صیقلی ساحل", phonetic: "/ˈpeblz/" },
    ],
    question: {
      promptEn: "What sound was heard during the fifteen seconds of silence?",
      promptFa: "در طول پانزده ثانیه سکوت چه صدایی به گوش می‌رسید؟",
      options: ["Ocean waves hitting the beach pebbles", "Car engines roaring", "A ringing telephone"],
      correctIndex: 0,
      hintSnippet: "only the soft rhythm of ocean waves hitting the pebbles could be heard",
      clueFa: "تنها صدای برخورد ملایم امواج دریا با سنگ‌ریزه‌ها شنیده می‌شد.",
    },
    choiceA: { labelEn: "Bow deeply alongside the entire band under the starlight!", labelFa: "در کنار تمام اعضای گروه زیر نور ستارگان تعظیم کنید!", descriptionFa: "پایان شماره ۱۷" },
    choiceB: { labelEn: "Whisper 'Thank you Harbor Bay' into the silent night air!", labelFa: "آرام در تاریکی شب بگو 'سپاس از تو خلیج هاربر'!", descriptionFa: "پایان شماره ۱۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Thousands joined in the ancient regional fishing ballad that had been sung on these waters for three centuries. Voices old and young intertwined, creating an emotional bridge across time that brought elder fishermen in the audience to tears.",
    keywords: [
      { word: "ballad", meaningFa: "ترانه فولکلوریک و آواز سنتی", phonetic: "/ˈbæləd/" },
      { word: "centuries", meaningFa: "قرن‌ها و سده‌ها", phonetic: "/ˈsentʃəriz/" },
      { word: "intertwined", meaningFa: "پیوند خورد و در هم آمیخت", phonetic: "/ˌɪntəˈtwaɪnd/" },
      { word: "audience", meaningFa: "حضار و تماشاگران", phonetic: "/ˈɔːdiəns/" },
    ],
    question: {
      promptEn: "How long had the regional fishing ballad been sung on these waters?",
      promptFa: "سرود صیادی منطقه چند قرن روی این آب‌ها خوانده شده بود؟",
      options: ["Three centuries", "Ten years", "One month"],
      correctIndex: 0,
      hintSnippet: "had been sung on these waters for three centuries",
      clueFa: "این سرود به مدت سه قرن روی آب‌های منطقه خوانده می‌شد.",
    },
    choiceA: { labelEn: "Preserve the acoustic recording in the National Folk Archives!", labelFa: "این اجرای ماندگار رو در آرشیو ملی موسیقی کهن ثبت کنید!", descriptionFa: "پایان شماره ۱۹" },
    choiceB: { labelEn: "Invite local harbor fishermen to perform on your next record!", labelFa: "ماهیگیران قدیمی بندر رو برای ضبط اثر بعدیتون دعوت کنید!", descriptionFa: "پایان شماره ۲۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Maya knelt and placed her custom tour guitar pick into the palms of the two young sisters. The girls hugged Maya with boundless joy, promising to start their own school band on Monday morning. Maya smiled: 'The stage belongs to you next!'",
    keywords: [
      { word: "boundless", meaningFa: "بی‌انتها و بی‌پایان", phonetic: "/ˈbaʊndləs/" },
      { word: "promising", meaningFa: "قول دادن و تعهد دادن", phonetic: "/ˈprɒmɪsɪŋ/" },
      { word: "palms", meaningFa: "کف دست‌ها", phonetic: "/pɑːmz/" },
      { word: "belongs", meaningFa: "تعلق دارد", phonetic: "/bɪˈlɒŋz/" },
    ],
    question: {
      promptEn: "What did the two young sisters promise to do on Monday?",
      promptFa: "دو خواهر نوجوان چه قولی برای صبح دوشنبه دادند؟",
      options: ["To start their own school band", "To throw away their guitars", "To move to another town"],
      correctIndex: 0,
      hintSnippet: "promising to start their own school band on Monday morning",
      clueFa: "قول دادند صبح دوشنبه گروه موسیقی مدرسه خودشون رو تشکیل بدن.",
    },
    choiceA: { labelEn: "Mentor the young sisters' band throughout the school year!", labelFa: "در طول سال تحصیلی مربی و راهنمای گروه موسیقی دخترها بشید!", descriptionFa: "پایان شماره ۲۱" },
    choiceB: { labelEn: "Gift them two beginner electric guitars and starter amplifiers!", labelFa: "دو گیتار الکتریک نو و دو آمپلی‌فایر بهشون هدیه بدید!", descriptionFa: "پایان شماره ۲۲" },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Backstage, Maya, Noah, and the young sisters enjoyed sparkling cider and fresh apple pastries. They laughed over funny rehearsal stories, and Jack the photographer snapped a candid portrait that captured the warmest spirit of music festivals.",
    keywords: [
      { word: "cider", meaningFa: "آب‌میوه طبیعی سیب گازدار", phonetic: "/ˈsaɪdə/" },
      { word: "pastries", meaningFa: "شیرینی‌های تازه خانگی", phonetic: "/ˈpeɪstriz/" },
      { word: "candid", meaningFa: "طبیعی و بی‌هوا و صمیمی", phonetic: "/ˈkændɪd/" },
      { word: "portrait", meaningFa: "عکس پرتره چهره", phonetic: "/ˈpɔːtreɪt/" },
    ],
    question: {
      promptEn: "What drink did they enjoy backstage together?",
      promptFa: "پشت صحنه چه نوشیدنی خوشمزه‌ای با هم نوشیدند؟",
      options: ["Sparkling cider", "Cold black coffee", "Salty water"],
      correctIndex: 0,
      hintSnippet: "enjoyed sparkling cider and fresh apple pastries",
      clueFa: "آب‌سیب طبیعی گازدار و شیرینی‌های تازه سیب خوردند.",
    },
    choiceA: { labelEn: "Make the candid portrait the official festival poster for next year!", labelFa: "عکس صمیمی پشت صحنه رو پوستر رسمی فستیوال سال آینده کنید!", descriptionFa: "پایان شماره ۲۳" },
    choiceB: { labelEn: "Create a 'Youth in Music' backstage mentorship program!", labelFa: "یک کارگاه انتقال تجربه پشت صحنه برای نوجوانان علاقه‌مند بسازید!", descriptionFa: "پایان شماره ۲۴" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "In the famous Ocean Studios on Monday, Maya and Tara recorded the duet in a single breathtaking take. The cello's resonant low notes combined with Maya's acoustic fingerpicking became an overnight global streaming phenomenon.",
    keywords: [
      { word: "fingerpicking", meaningFa: "نواختن با سرانگشتان بدون مضراب", phonetic: "/ˈfɪŋɡəpɪkɪŋ/" },
      { word: "phenomenon", meaningFa: "پدیده بزرگ و شگفت‌انگیز", phonetic: "/fəˈnɒmɪnən/" },
      { word: "overnight", meaningFa: "در عرض یک شب و بسیار سریع", phonetic: "/ˌəʊvəˈnaɪt/" },
      { word: "duet", meaningFa: "دونوازی دو نفره", phonetic: "/djuːˈet/" },
    ],
    question: {
      promptEn: "How many takes did Maya and Tara need to record the duet in studio?",
      promptFa: "مایا و تارا در استودیو با چند برداشت قطعه را ضبط کردند؟",
      options: ["A single breathtaking take", "Fifty takes", "Ten long days"],
      correctIndex: 0,
      hintSnippet: "recorded the duet in a single breathtaking take",
      clueFa: "قطعه را تنها در یک برداشت بی‌نقص و نفس‌گیر ضبط کردند.",
    },
    choiceA: { labelEn: "Film an evocative music video amidst foggy ocean cliffs!", labelFa: "یک موزیک ویدئوی رویایی میان صخره‌های مه‌آلود ساحل بسازید!", descriptionFa: "پایان شماره ۲۵" },
    choiceB: { labelEn: "Win Best Collaborative Single at the Global Music Awards!", labelFa: "جایزه بهترین تک‌آهنگ دونوازی سال را در جوایز جهانی ببرید!", descriptionFa: "پایان شماره ۲۶" },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "A month later, Maya and Tara stepped into the gilded National Symphony Hall. Backed by sixty orchestral musicians, their rock-classical suite brought the distinguished audience to their feet in a thunderous ten-minute ovation.",
    keywords: [
      { word: "gilded", meaningFa: "مذهب و زراندود", phonetic: "/ˈɡɪldɪd/" },
      { word: "orchestral", meaningFa: "ارکسترال و سمفونیک", phonetic: "/ɔːˈkestrəl/" },
      { word: "suite", meaningFa: "سوئیت موسیقیایی چندبخشی", phonetic: "/swiːt/" },
      { word: "distinguished", meaningFa: "برجسته و صاحب‌نام", phonetic: "/dɪˈstɪŋɡwɪʃt/" },
    ],
    question: {
      promptEn: "How many orchestral musicians accompanied Maya and Tara?",
      promptFa: "چند نوازنده ارکستر مایا و تارا را همراهی کردند؟",
      options: ["Sixty orchestral musicians", "Three musicians", "No one"],
      correctIndex: 0,
      hintSnippet: "Backed by sixty orchestral musicians",
      clueFa: "شصت نوازنده ارکستر سمفونیک آن دو را همراهی کردند.",
    },
    choiceA: { labelEn: "Broadcast the symphony concert live across fifty countries!", labelFa: "کنسرت سمفونیک را در پنجاه کشور جهان به صورت زنده پخش کنید!", descriptionFa: "پایان شماره ۲۷" },
    choiceB: { labelEn: "Publish the sheet music for youth orchestras worldwide!", labelFa: "پارتیتور و نت‌های ارکستر را برای مدارس موسیقی دنیا منتشر کنید!", descriptionFa: "پایان شماره ۲۸" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The Neon Tide arrived in Paris to headline the World Music Festival beneath the illuminated Eiffel Tower. With Tara's cello soaring alongside Maya's electric lead, seventy thousand international fans cheered for the champions of Harbor Bay.",
    keywords: [
      { word: "illuminated", meaningFa: "نورانی و چراغانی‌شده", phonetic: "/ɪˈluːmɪneɪtɪd/" },
      { word: "soaring", meaningFa: "اوج‌گیرنده و طنین‌انداز در آسمان", phonetic: "/ˈsɔːrɪŋ/" },
      { word: "champions", meaningFa: "قهرمانان و پیشتازان", phonetic: "/ˈtʃæmpiənz/" },
      { word: "international", meaningFa: "بین‌المللی", phonetic: "/ˌɪntəˈnæʃnəl/" },
    ],
    question: {
      promptEn: "Where did The Neon Tide perform their international headline concert?",
      promptFa: "گروه نئون تاید اجرای بین‌المللی خود را در کجا برگزار کردند؟",
      options: ["In Paris beneath the illuminated Eiffel Tower", "In a small garage in London", "At an airport terminal"],
      correctIndex: 0,
      hintSnippet: "arrived in Paris to headline the World Music Festival beneath the illuminated Eiffel Tower",
      clueFa: "در پاریس زیر برج درخشان ایفل به عنوان سرگروه اجرا کردند.",
    },
    choiceA: { labelEn: "Launch a global stadium tour across Europe and Asia!", labelFa: "تور بزرگ استادیومی در سراسر اروپا و آسیا برگزار کنید!", descriptionFa: "پایان شماره ۲۹" },
    choiceB: { labelEn: "Compose an anthem for international cultural unity!", labelFa: "سرود رسمی همبستگی فرهنگی ملل را آهنگسازی کنید!", descriptionFa: "پایان شماره ۳۰" },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "With proceeds from the festival and donations from music companies, Maya, Noah, Sam, and Tara founded The Harbor Sound Academy. Over two hundred local children received free instruments and lessons, keeping music alive for generations to come.",
    keywords: [
      { word: "proceeds", meaningFa: "عواید مالی و درآمدهای حاصله", phonetic: "/ˈprəʊsiːdz/" },
      { word: "founded", meaningFa: "تأسیس کرد و بنیان نهاد", phonetic: "/ˈfaʊndɪd/" },
      { word: "academy", meaningFa: "فرهنگستان و آکادمی تخصصی", phonetic: "/əˈkædəmi/" },
      { word: "generations", meaningFa: "نسل‌های آینده", phonetic: "/ˌdʒenəˈreɪʃnz/" },
    ],
    question: {
      promptEn: "What did the band establish with the festival proceeds?",
      promptFa: "گروه با عواید فستیوال چه چیزی تأسیس کردند؟",
      options: ["The Harbor Sound Academy providing free music lessons", "A luxury car dealership", "A private airplane company"],
      correctIndex: 0,
      hintSnippet: "founded The Harbor Sound Academy. Over two hundred local children received free instruments and lessons",
      clueFa: "آکادمی موسیقی خلیج هاربر که آموزش و ساز رایگان به کودکان ارائه می‌دهد.",
    },
    choiceA: { labelEn: "Host the annual Youth Talent Gala on the festival stage!", labelFa: "جشنواره سالانه استعدادهای جوان را روی استیج فستیوال برگزار کنید!", descriptionFa: "پایان شماره ۳۱" },
    choiceB: { labelEn: "Perform alongside your students in a grand community concert!", labelFa: "کنار هنرجویان خود در کنسرتی مردمی و باشکوه بنوازید!", descriptionFa: "پایان شماره ۳۲" },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Golden Sunset Rock Climax", titleFa: "اوج طلایی راک غروب", badgeCategory: "legendary", badgeIcon: "🎸", badgeNameFa: "پایان پرقدرت و تاریخی", climaxEn: "Maya lifts her vintage guitar high as gold sparks rain down, sealing the greatest festival headline in history.", climaxFa: "مایا گیتار کلاسیکش را بالا برد و در باران جرقه‌های طلایی، پرشکوه‌ترین اجرای تاریخ فستیوال را جاودانه کرد.", xpReward: 200 },
  { pathCode: "AAAAB", titleEn: "Gifts of the Ocean Stage", titleFa: "یادگاری‌های صحنه اقیانوس", badgeCategory: "heroic", badgeIcon: "🥁", badgeNameFa: "پایان خاطره‌انگیز هواداران", climaxEn: "Noah's drumsticks land into the hands of ecstatic teenage fans, inspiring them to form their own band.", climaxFa: "چوب‌های درامز نوآ میان دستان پرشور دو نوجوان فرود آمد و جرقه تشکیل گروه جدید را در قلبشان روشن کرد.", xpReward: 175 },
  { pathCode: "AAABA", titleEn: "The Midnight Signing Marathon", titleFa: "ماراتن امضای شبانه آلبوم", badgeCategory: "scholar", badgeIcon: "✍️", badgeNameFa: "پایان صمیمیت با مخاطب", climaxEn: "The band signs records until 2 AM under moonlight, exchanging heartfelt stories with every music lover.", climaxFa: "اعضای گروه تا پاسی از شب زیر نور ماه با صبر آلبوم‌ها را امضا کردند و به تک‌تک داستان‌های هواداران گوش دادند.", xpReward: 180 },
  { pathCode: "AAABB", titleEn: "Vinyl Number One in the Garage", titleFa: "گرامافون شماره یک در گاراژ", badgeCategory: "secret", badgeIcon: "💿", badgeNameFa: "پایان یادگاری اصیل", climaxEn: "Copy number one of Seafoam Dreams hangs proudly in the garage where the band's journey first started.", climaxFa: "نسخه شماره یک آلبوم در گاراژ قدیمی نصب شد، جایی که تمام رویاهای گروه از آنجا آغاز شده بود.", xpReward: 170 },
  { pathCode: "AABAA", titleEn: "The Viral Festival Dance Wave", titleFa: "موج وایرال رقص ساحلی", badgeCategory: "funny", badgeIcon: "🕺", badgeNameFa: "پایان پرشور و رقصنده", climaxEn: "The synchronized seaside dance becomes a global internet phenomenon with twenty million views.", climaxFa: "رقص هماهنگ ساحلی پنج هزار نفر با بیست میلیون بازدید به داغ‌ترین ویدئوی موسیقی اینترنت تبدیل شد.", xpReward: 185 },
  { pathCode: "AABAB", titleEn: "Security Guards on the Stage Bow", titleFa: "تعظیم گروهی همراه با انتظامات", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان اتحاد و برابری", climaxEn: "Security guards, stagehands, and musicians bow together, proving that harmony belongs to everyone.", climaxFa: "نگهبانان مهربان، عوامل صحنه و نوازندگان دست در دست هم تعظیم کردند و زیبایی هنر را به نمایش گذاشتند.", xpReward: 195 },
  { pathCode: "AABBA", titleEn: "Heartbeat of Harbor Bay", titleFa: "ضربان پایدار خلیج هاربر", badgeCategory: "legendary", badgeIcon: "🎧", badgeNameFa: "پایان پرانرژی استودیویی", climaxEn: "The crowd's thunderous stomp powers the band's new single straight to the top of national radio charts.", climaxFa: "کوبش پای هواداران ریتم اصلی تک‌آهنگ شد و ترانه را به صدر جدول رادیویی کشور رساند.", xpReward: 200 },
  { pathCode: "AABBB", titleEn: "Five Thousand Co-Writers", titleFa: "پنج هزار ترانه‌سرای افتخاری", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان افتخار تماشاگران", climaxEn: "The album booklet lists 'The People of Harbor Bay' as co-producers, creating a timeless historic keepsake.", climaxFa: "در دفترچه آلبوم نام تمام تماشاگران به عنوان تهیه‌کنندگان معنوی ثبت شد و اثری تاریخی به یادگار ماند.", xpReward: 175 },
  { pathCode: "ABAAA", titleEn: "The Museum of Rock Royalty", titleFa: "گیتار زرین در موزه راک", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان جاودانگی هنری", climaxEn: "Maya's seafoam guitar is enshrined in the National Rock Museum, recognized as the sound of a new decade.", climaxFa: "گیتار کلاسیک مایا به عنوان صدای نسل نو به موزه ملی موسیقی اهدا شد و در ویترینی طلایی قرار گرفت.", xpReward: 200 },
  { pathCode: "ABAAB", titleEn: "Standing Ovation of the Legends", titleFa: "تشویق استادان کهنه‌کار", badgeCategory: "heroic", badgeIcon: "👏", badgeNameFa: "پایان تحسین بزرگان", climaxEn: "Rock icons of the seventies salute Maya's mastery, welcoming The Neon Tide to the pinnacle of music.", climaxFa: "اسطوره‌های راک دهه هفتاد به احترام تکنوازی مایا کلاه از سر برداشتند و هنر بی‌پایانش را ستودند.", xpReward: 190 },
  { pathCode: "ABABA", titleEn: "The Mentor and the Prodigy", titleFa: "شاگرد و استاد روی استیج", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان احترام و قدردانی", climaxEn: "Mr. Davies and Maya finish their duet with a gentle smile that celebrates the true gift of music education.", climaxFa: "آقای دیویس و مایا با لبخندی پدرانه سازهایشان را خاموش کردند و ارزش آموزش صمیمانه را نشان دادند.", xpReward: 185 },
  { pathCode: "ABABB", titleEn: "The Davies Music Fellowship", titleFa: "بورسیه جاودانه موسیقی دیویس", badgeCategory: "secret", badgeIcon: "🎓", badgeNameFa: "پایان نیکوکاری فرهنگی", climaxEn: "The annual scholarship supports twenty young musicians every year, keeping Mr. Davies' legacy burning.", climaxFa: "بورسیه سالانه به بیست نوجوان بااستعداد فرصت آموزش رایگان داد و نام معلم مهربان را زنده نگه داشت.", xpReward: 180 },
  { pathCode: "ABBAA", titleEn: "Pancakes and Complete Artistic Freedom", titleFa: "پنکیک شبانه و استقلال هنری", badgeCategory: "funny", badgeIcon: "🥞", badgeNameFa: "پایان شیرین و مستقل", climaxEn: "Dipping blueberry pancakes into maple syrup, the band toasts to pure independent creative control.", climaxFa: "با پنکیک‌های داغ بلوبری در نیمه‌شب ساحل، گروه استقلال کامل و پیروزی خلاقیت خود را جشن گرفتند.", xpReward: 170 },
  { pathCode: "ABBAB", titleEn: "Tokyo to London World Tour", titleFa: "از توکیو تا لندن بر بال موسیقی", badgeCategory: "legendary", badgeIcon: "✈️", badgeNameFa: "پایان شهرت جهانی", climaxEn: "Tickets for their forty-city international world tour sell out within ten minutes of announcement.", climaxFa: "بلیط‌های تور چهل شهر بزرگ دنیا ظرف ده دقیقه تمام شد و جهان چشم‌انتظار اجرای گروه ماند.", xpReward: 200 },
  { pathCode: "ABBBA", titleEn: "Guardians of the Coastal Mangroves", titleFa: "نگهبانان جنگل‌های حرا", badgeCategory: "heroic", badgeIcon: "🌱", badgeNameFa: "پایان سبز و زیست‌محیطی", climaxEn: "Ten thousand young mangrove trees root firmly in the bay waters, shielding the coast from future storms.", climaxFa: "ده هزار نهال حرا به دست اعضای گروه در آب ریشه دواندند و ساحل را از گزند طوفان‌های آینده مصون داشتند.", xpReward: 185 },
  { pathCode: "ABBBB", titleEn: "The 100% Solar Festival Revolution", titleFa: "انقلاب کنسرت‌های خورشیدی", badgeCategory: "explorer", badgeIcon: "☀️", badgeNameFa: "پایان نوآوری پاک", climaxEn: "The annual festival becomes the first in the nation powered entirely by clean sunlight and battery banks.", climaxFa: "فستیوال به نخستین رویداد موسیقی پاک کشور با باتری‌های ذخیره خورشیدی تبدیل شد.", xpReward: 190 },
  { pathCode: "BAAAA", titleEn: "The Reverent Silence of Harbor Bay", titleFa: "سکوت باشکوه خلیج در مهتاب", badgeCategory: "legendary", badgeIcon: "🌊", badgeNameFa: "پایان عمیق و عرفانی", climaxEn: "The memory of five thousand people listening to the ocean waves in total harmony echoes across the years.", climaxFa: "خاطره پنج هزار انسانی که در سکوت محض به صدای امواج گوش سپردند برای سال‌ها در یادها زمزمه شد.", xpReward: 200 },
  { pathCode: "BAAAB", titleEn: "Thank You, Harbor Bay", titleFa: "سپاس از تو، خلیج مهربان", badgeCategory: "scholar", badgeIcon: "🌌", badgeNameFa: "پایان شاعرانه و ماندگار", climaxEn: "Maya's quiet whisper into the night air becomes the opening audio snippet of their greatest live album.", climaxFa: "نجوای آرام مایا در سکوت شب به ماندگارترین بخش آغازین آلبوم زنده گروه تبدیل شد.", xpReward: 180 },
  { pathCode: "BAABA", titleEn: "The Three-Century Folk Archive", titleFa: "گنجینه آواز سه قرن دریانوردان", badgeCategory: "scholar", badgeIcon: "⚓", badgeNameFa: "پایان کهن و میراثی", climaxEn: "The acoustic sea ballad is inducted into the UNESCO intangible cultural heritage registry.", climaxFa: "سرود باستانی دریا با اجرای مشترک مردم در فهرست میراث ناملموس فرهنگی به ثبت جهانی رسید.", xpReward: 195 },
  { pathCode: "BAABB", titleEn: "Sons and Daughters of the Sea", titleFa: "فرزندان دریای خروشان", badgeCategory: "explorer", badgeIcon: "⛵", badgeNameFa: "پایان پیوند نسل‌ها", climaxEn: "Local fishermen join the band in the studio, harmonizing old work shanties with electric guitars.", climaxFa: "صیادان کهنه‌کار در استودیو به گروه پیوستند و سرودهای قدیمی دریا را با گیتار الکتریک هم‌آوا کردند.", xpReward: 185 },
  { pathCode: "BABAA", titleEn: "Mentors to the Next Generation", titleFa: "پرورش‌دهندگان ستاره‌های فردا", badgeCategory: "heroic", badgeIcon: "👭", badgeNameFa: "پایان الهام‌بخش و مربیگری", climaxEn: "The two young sisters win first place at their middle school battle of the bands with Maya cheering on.", climaxFa: "دو خواهر با هدایت و تشویق مایا مقام اول مسابقه موسیقی مدارس را با افتخار کسب کردند.", xpReward: 185 },
  { pathCode: "BABAB", titleEn: "The Twin Guitar Gift", titleFa: "هدیه گیتارهای دوقلو", badgeCategory: "secret", badgeIcon: "🎁", badgeNameFa: "پایان بخشندگی و محبت", climaxEn: "The two seafoam-green mini guitars inspire twenty more neighborhood kids to pick up instruments.", climaxFa: "هدیه دو گیتار فیروزه‌ای کوچک الهام‌بخش ده‌ها کودک محله شد تا ساز به دست بگیرند و بنوازند.", xpReward: 175 },
  { pathCode: "BABBA", titleEn: "The Sunset Poster Icon", titleFa: "پوستر نمادین غروب", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان شاد و ماندگار", climaxEn: "The candid backstage pastry photo hangs in record shops across forty cities as a symbol of pure joy.", climaxFa: "عکس پر از خنده پشت صحنه با شیرینی‌های سیب روی دیوار تمام فروشگاه‌های موسیقی چهل شهر نصب شد.", xpReward: 170 },
  { pathCode: "BABBB", titleEn: "Backstage Pass for Tomorrow's Leaders", titleFa: "کارگاه پشت صحنه جوانان", badgeCategory: "scholar", badgeIcon: "🎟️", badgeNameFa: "پایان آموزشی و تخصصی", climaxEn: "Young music enthusiasts learn sound engineering and stage management directly from festival masters.", climaxFa: "نوجوانان علاقه‌مند فوت‌وفن صدابرداری و مدیریت استیج را مستقیماً از اساتید باسابقه آموختند.", xpReward: 180 },
  { pathCode: "BBAAA", titleEn: "Cliffside Cello and Guitar Video", titleFa: "ویدئوی سحرانگیز صخره‌های مه‌آلود", badgeCategory: "legendary", badgeIcon: "🎬", badgeNameFa: "پایان سینمایی و هنری", climaxEn: "The music video filmed atop sea mist cliffs wins Best Cinematography at the International Music Video Awards.", climaxFa: "موزیک ویدئوی برفراز صخره‌های مه‌آلود جایزه بهترین تصویربرداری جشنواره جهانی را درو کرد.", xpReward: 200 },
  { pathCode: "BBAAB", titleEn: "The Global Collaboration Trophy", titleFa: "تندیس همکاری طلایی سال", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان افتخار مشترک", climaxEn: "Maya and Tara receive the Best Collaboration Trophy, smiling arm in arm on the world stage.", climaxFa: "مایا و تارا دست در دست یکدیگر تندیس برترین دونوازی سال را در برابر نگاه جهانیان بالا بردند.", xpReward: 200 },
  { pathCode: "BBABA", titleEn: "Live from the Golden Symphony Hall", titleFa: "پخش زنده از تالار سمفونی ملی", badgeCategory: "legendary", badgeIcon: "🎻", badgeNameFa: "پایان شکوهمند ارکسترال", climaxEn: "Ten million viewers watch the rock-classical fusion live, bridging classical rigor and raw rock energy.", climaxFa: "ده میلیون بیننده پیوند بی‌نظیر شور راک و شکوه ارکستر سمفونیک را در پخش زنده جهانی تماشا کردند.", xpReward: 200 },
  { pathCode: "BBABB", titleEn: "Score of the Next Millennium", titleFa: "پارتیتور موسیقی برای نسل نو", badgeCategory: "scholar", badgeIcon: "🎼", badgeNameFa: "پایان ماندگاری آموزشی", climaxEn: "High school orchestras from Tokyo to Berlin perform Tara and Maya's evocative suite with devotion.", climaxFa: "ارکسترهای مدارس از توکیو تا برلین قطعه مشترک تارا و مایا را با اشتیاق تمام تمرین و اجرا کردند.", xpReward: 185 },
  { pathCode: "BBBAA", titleEn: "Eiffel Tower Headline Triumph", titleFa: "پیروزی بزرگ در پای برج ایفل", badgeCategory: "legendary", badgeIcon: "🗼", badgeNameFa: "پایان اوج افتخار جهانی", climaxEn: "Seventy thousand Paris festivalgoers chant the band's name, cementing their status as international icons.", climaxFa: "هفتاد هزار تماشاگر پاریسی با فریاد نام گروه، آنان را نماد جاودانه موسیقی نوین خواندند.", xpReward: 200 },
  { pathCode: "BBBAB", titleEn: "The Global Anthem of Harmony", titleFa: "سرود جهانی همبستگی و امید", badgeCategory: "heroic", badgeIcon: "🌍", badgeNameFa: "پایان صلح و دوستی بین‌المللی", climaxEn: "The anthem composed in Paris is performed at the International Youth Summit, promoting world peace.", climaxFa: "سرود خلق‌شده در پاریس در اجلاس جوانان جهان به نشانه صلح و دوستی ملل به اجرا درآمد.", xpReward: 195 },
  { pathCode: "BBBBA", titleEn: "The Harbor Sound Academy Gala", titleFa: "جشن بزرگ آکادمی خلیج هاربر", badgeCategory: "heroic", badgeIcon: "🏫", badgeNameFa: "پایان آینده‌ساز و الهام‌بخش", climaxEn: "Over two hundred kids perform their first festival concert, their eyes shining with artistic confidence.", climaxFa: "بیش از دویست کودک در نخستین کنسرت زندگی‌شان با چشمانی پر از امید و اعتمادبه‌نفس نواختند.", xpReward: 190 },
  { pathCode: "BBBBB", titleEn: "Symphony of the Coastal Community", titleFa: "سمفونی بزرگ مردم ساحل", badgeCategory: "legendary", badgeIcon: "👑", badgeNameFa: "پایان نهایی افسانه‌ای", climaxEn: "Maya, Noah, Sam, Tara, and their students take the final bow together under warm festival lights, proving that music is the universal language of love and courage.", climaxFa: "مایا، نوآ، سَم، تارا و هنرجویان کوچکشان دست در دست هم زیر نورهای فستیوال تعظیم کردند؛ اثباتی جاودانه که موسیقی زبان مشترک عشق، شجاعت و زندگی است.", xpReward: 200 },
];

export const story6SunsetFestival: AdventureStory = buildAdventureStory({
  id: "b1-sunset-festival",
  storyIndex: 6,
  cefr: "B1",
  titleEn: "Echoes of the Sunset Festival",
  titleFa: "طنین ملودی در فستیوال غروب",
  genre: "music",
  genreLabelFa: "🎵 موسیقی و اجرای زنده",
  genreIcon: "🎵",
  synopsisEn:
    "Maya and her indie rock band arrive at the open-air Sunset Music Festival by the bay, but right before their headline performance, a sudden power surge disables the main sound system! Improvise an acoustic set, fix the vacuum-tube amplifiers, or collaborate with a guest cellist across 32 electrifying endings!",
  synopsisFa:
    "مایا و گروه موسیقی مستقلش به فستیوال بزرگ موسیقی غروب در ساحل می‌رسند، اما درست دقایقی قبل از اجرای اصلی‌شان، نوسان برق سیستم صوتی سالن را از کار می‌اندازد! آیا تجهیزات صوتی لامپی را تعمیر می‌کنید، یک اجرای زنده آکوستیک شاهکار روی صحنه می‌برید یا با تکنوازی ویولنسل تماشاگران را به وجد می‌آورید؟ ۳۲ پایان پرانرژی و جذاب منتظر شماست!",
  coverImage: "/images/skills/reading/b1-sunset-festival.webp",
  nodes,
  endings,
});
