// @ts-check
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CEFR_SOURCE_DIR = "E:/0/Work/Website/The General Website/Books and CEFR";
const OUTPUT_DIR = path.resolve(__dirname, "../apps/web/data/cefr");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Common POS mapping to standardized types
 */
function normalizePOS(posRaw) {
  const p = (posRaw || "").toLowerCase().trim();
  if (p.includes("noun") || p === "n") return { pos: "noun", labelFa: "اسم (Noun)" };
  if (p.includes("verb") || p === "v") return { pos: "verb", labelFa: "فعل (Verb)" };
  if (p.includes("adj")) return { pos: "adjective", labelFa: "صفت (Adjective)" };
  if (p.includes("adv")) return { pos: "adverb", labelFa: "قید (Adverb)" };
  if (p.includes("prep")) return { pos: "preposition", labelFa: "حرف اضافه (Preposition)" };
  if (p.includes("pron")) return { pos: "pronoun", labelFa: "ضمیر (Pronoun)" };
  if (p.includes("conj")) return { pos: "conjunction", labelFa: "حرف ربط (Conjunction)" };
  if (p.includes("det")) return { pos: "determiner", labelFa: "معین‌کننده (Determiner)" };
  if (p.includes("interj")) return { pos: "interjection", labelFa: "صوت / اصطلاح (Interjection)" };
  if (p.includes("num")) return { pos: "number", labelFa: "عدد (Number)" };
  return { pos: "other", labelFa: "واژه (Word)" };
}

/**
 * Parse raw line e.g. "to add (v)" or "action (n)"
 */
function parseToken(raw) {
  const match = raw.match(/^(.*?)\s*\((.*?)\)$/);
  let term = raw.trim();
  let posRaw = "";
  if (match) {
    term = match[1].trim();
    posRaw = match[2].trim();
  }
  let baseWord = term;
  if (baseWord.startsWith("to ")) {
    baseWord = baseWord.slice(3).trim();
  }
  const { pos, labelFa } = normalizePOS(posRaw);
  return {
    raw,
    displayTerm: raw.trim(),
    word: baseWord.toLowerCase(),
    partOfSpeech: pos,
    partOfSpeechLabelFa: labelFa,
    posRaw,
  };
}

/**
 * High-quality curated dictionary for foundational A1 vocabulary
 */
const CURATED_A1_DICTIONARY = {
  "a / an": {
    phonetic: "/ə/ , /æn/",
    meaningFa: "یک (نشانه نکره قبل از اسم مفرد)",
    englishDef: "Used before a singular noun referring to one person or thing",
    synonyms: ["one", "single"],
    antonyms: [],
    contextClue: "I bought [ ___ ] apple and [ ___ ] banana from the shop.",
    situationHintFa: "وقتی می‌خواهید درباره یک چیز مفرد یا ناشناس صحبت کنید (مثلاً یک کتاب، یک سیب)",
    exampleEn: "She adopted a cute puppy from an animal shelter yesterday.",
    exampleFa: "او دیروز یک توله‌سگ بامزه را از پناهگاه حیوانات به سرپرستی گرفت.",
  },
  "about": {
    phonetic: "/əˈbaʊt/",
    meaningFa: "درباره، در مورد / تقریباً",
    englishDef: "On the subject of; or approximately",
    synonyms: ["regarding", "concerning", "approximately"],
    antonyms: ["exactly"],
    contextClue: "This documentary is all [ ___ ] wild animals in Africa.",
    situationHintFa: "وقتی می‌خواهید موضوع یا مبحث یک فیلم، کتاب یا گفتگو را مشخص کنید",
    exampleEn: "We had a long discussion about our future travel plans.",
    exampleFa: "ما گفتگوی مفصلی درباره برنامه‌های سفر آینده‌مان داشتیم.",
  },
  "above": {
    phonetic: "/əˈbʌv/",
    meaningFa: "بالاتر از، در بالای",
    englishDef: "At or to a higher place or position than something",
    synonyms: ["over", "higher than"],
    antonyms: ["below", "under"],
    contextClue: "The plane flew high in the sky [ ___ ] the clouds.",
    situationHintFa: "وقتی چیزی در ارتفاع یا مکان بالاتر از جسم دیگری قرار دارد بدون اینکه لزوماً با آن تماس داشته باشد",
    exampleEn: "There is a beautiful painting hanging above the fireplace.",
    exampleFa: "یک تابلوی نقاشی زیبا بالای شومینه آویزان است.",
  },
  "across": {
    phonetic: "/əˈkrɒs/",
    meaningFa: "آن‌طرف، از عرض، در سرتاسر",
    englishDef: "From one side to the other side of something",
    synonyms: ["over", "through"],
    antonyms: ["along"],
    contextClue: "Be careful when you walk [ ___ ] the busy street.",
    situationHintFa: "وقتی از یک سمت خیابان، رودخانه یا پل به سمت دیگر می‌روید",
    exampleEn: "The kids ran safely across the pedestrian crossing.",
    exampleFa: "بچه‌ها با ایمنی از عرض گذرگاه عابر پیاده دویدند.",
  },
  "action": {
    phonetic: "/ˈæk.ʃən/",
    meaningFa: "اقدام، عمل، فعالیت",
    englishDef: "The process of doing something, especially to solve a problem",
    synonyms: ["act", "step", "measure"],
    antonyms: ["inaction", "rest"],
    contextClue: "In an emergency, quick and decisive [ ___ ] saves lives.",
    situationHintFa: "وقتی فقط حرف نمی‌زنید بلکه دست به کار می‌شوید و کار موثری انجام می‌دهید",
    exampleEn: "The government took immediate action to repair the damaged bridge.",
    exampleFa: "دولت برای تعمیر پل آسیب‌دیده اقدام فوری انجام داد.",
  },
  "activity": {
    phonetic: "/ækˈtɪv.ə.ti/",
    meaningFa: "فعالیت، سرگرمی، کار پویا",
    englishDef: "A thing that a person or group does or has done",
    synonyms: ["pastime", "exercise", "occupation"],
    antonyms: ["inactivity", "idleness"],
    contextClue: "Swimming is my favorite outdoor [ ___ ] during hot summer days.",
    situationHintFa: "کاری پرانرژی که برای سرگرمی، ورزش یا یادگیری انجام می‌دهید",
    exampleEn: "The teacher prepared a fun group activity for the English lesson.",
    exampleFa: "معلم یک فعالیت گروهی سرگرم‌کننده برای درس انگلیسی آماده کرد.",
  },
  "actor": {
    phonetic: "/ˈæk.tər/",
    meaningFa: "بازیگر (مرد یا عمومی)",
    englishDef: "A person who performs in plays, movies, or television shows",
    synonyms: ["performer", "player"],
    antonyms: ["audience", "spectator"],
    contextClue: "The famous [ ___ ] gave an incredible performance in the drama film.",
    situationHintFa: "شخصی که در صحنه تئاتر یا جلوی دوربین سینما نقشی را بازی می‌کند",
    exampleEn: "He has dreamed of becoming a professional film actor since childhood.",
    exampleFa: "او از کودکی آرزوی تبدیل شدن به یک بازیگر حرفه‌ای سینما را داشت.",
  },
  "actress": {
    phonetic: "/ˈæk.trəs/",
    meaningFa: "بازیگر زن",
    englishDef: "A woman who performs in plays, movies, or television shows",
    synonyms: ["performer", "heroine"],
    antonyms: ["spectator"],
    contextClue: "The talented [ ___ ] won an academy award for her lead role.",
    situationHintFa: "خانمی که در تئاتر یا فیلم‌های سینمایی به ایفای نقش می‌پردازد",
    exampleEn: "The actress received standing applause from the theater audience.",
    exampleFa: "این بازیگر زن با تشویق ایستاده تماشاگران تئاتر روبه‌رو شد.",
  },
  "add": {
    phonetic: "/æd/",
    meaningFa: "اضافه کردن، افزودن، جمع بستن",
    englishDef: "To put something with something else to increase the number or size",
    synonyms: ["include", "attach", "combine"],
    antonyms: ["subtract", "remove"],
    contextClue: "Please don't forget to [ ___ ] a little pinch of salt to the soup.",
    situationHintFa: "وقتی ماده‌ای جدید به غذا اضافه می‌کنید یا دو عدد را با هم جمع می‌زنید",
    exampleEn: "You can add your comments and feedback at the bottom of the page.",
    exampleFa: "شما می‌توانید نظرات و بازخوردهای خود را در انتهای صفحه اضافه کنید.",
  },
  "address": {
    phonetic: "/əˈdres/",
    meaningFa: "نشانی، آدرس محل سکونت یا کار",
    englishDef: "The number of the house and the name of the street where someone lives",
    synonyms: ["location", "domicile"],
    antonyms: [],
    contextClue: "Write your postal [ ___ ] clearly on the envelope so the mail arrives.",
    situationHintFa: "مشخصات پلاک، کوچه و خیابانی که نشان می‌دهد کجا زندگی یا کار می‌کنید",
    exampleEn: "Please send the official contract to our new office address.",
    exampleFa: "لطفاً قرارداد رسمی را به آدرس جدید دفتر ما ارسال کنید.",
  },
  "adult": {
    phonetic: "/ˈæd.ʌlt/",
    meaningFa: "بزرگسال، شخص بالغ",
    englishDef: "A person who is fully grown or legally of age (18+)",
    synonyms: ["grown-up", "mature person"],
    antonyms: ["child", "infant"],
    contextClue: "Children must be accompanied by a responsible [ ___ ] at the pool.",
    situationHintFa: "فردی که از سنین کودکی و نوجوانی عبور کرده و به سن بلوغ و قانونی رسیده است",
    exampleEn: "Movie ticket prices are slightly higher for adults than children.",
    exampleFa: "قیمت بلیت سینما برای بزرگسالان کمی بالاتر از کودکان است.",
  },
  "afraid": {
    phonetic: "/əˈfreɪd/",
    meaningFa: "ترسیده، نگران، هراسان",
    englishDef: "Feeling fear or anxiety about something",
    synonyms: ["scared", "frightened", "fearful"],
    antonyms: ["brave", "confident", "fearless"],
    contextClue: "My little sister is very [ ___ ] of dark rooms and spiders.",
    situationHintFa: "احساسی که هنگام روبه‌رو شدن با تاریکی، خطر یا چیزی ترسناک تجربه می‌کنید",
    exampleEn: "Don't be afraid to ask questions whenever you don't understand.",
    exampleFa: "هر زمان که متوجه مطلبی نشدید، از پرسیدن سوال نترسید.",
  },
  "after": {
    phonetic: "/ˈɑːf.tər/",
    meaningFa: "بعد از، پس از",
    englishDef: "Following in time, place, or order",
    synonyms: ["following", "subsequent to"],
    antonyms: ["before", "prior to"],
    contextClue: "We will go for a relaxing walk [ ___ ] finishing our dinner.",
    situationHintFa: "وقتی کاری پس از انجام کار دیگری در خط زمان قرار می‌گیرد",
    exampleEn: "I always wash my hands before and after having a meal.",
    exampleFa: "من همیشه قبل و بعد از غذا خوردن دست‌هایم را می‌شویم.",
  },
  "afternoon": {
    phonetic: "/ˌɑːf.təˈnuːn/",
    meaningFa: "بعدازظهر، عصر",
    englishDef: "The time from noon until evening",
    synonyms: ["midday", "postmeridian"],
    antonyms: ["morning", "night"],
    contextClue: "I usually enjoy a warm cup of tea at four o'clock in the [ ___ ].",
    situationHintFa: "بخش میانی روز که از ساعت ۱۲ ظهر شروع می‌شود و تا غروب آفتاب ادامه دارد",
    exampleEn: "The weather was pleasantly warm and sunny this afternoon.",
    exampleFa: "هوای امروز بعدازظهر به طرز دلپذیری گرم و آفتابی بود.",
  },
  "again": {
    phonetic: "/əˈɡen/",
    meaningFa: "دوباره، مجدداً، بار دیگر",
    englishDef: "One more time; once more",
    synonyms: ["once more", "repeatedly"],
    antonyms: ["never"],
    contextClue: "Could you please pronounce that word once [ ___ ]? I missed it.",
    situationHintFa: "وقتی کاری تکرار می‌شود یا می‌خواهید چیزی یک‌بار دیگر انجام شود",
    exampleEn: "She practiced the song again and again until it was perfect.",
    exampleFa: "او آهنگ را بارها و بارها تمرین کرد تا کاملاً بی‌نقص شد.",
  },
  "age": {
    phonetic: "/eɪdʒ/",
    meaningFa: "سن، سالخوردگی، عصر و دوران",
    englishDef: "The number of years someone has lived",
    synonyms: ["years", "era", "epoch"],
    antonyms: ["youth"],
    contextClue: "At the young [ ___ ] of ten, he could already play chess brilliantly.",
    situationHintFa: "تعداد سال‌هایی که از زمان تولد یک فرد گذشته است",
    exampleEn: "She looks amazingly energetic and healthy for her age.",
    exampleFa: "او نسبت به سن و سالش بسیار پرانرژی و سالم به نظر می‌رسد.",
  },
  "ago": {
    phonetic: "/əˈɡəʊ/",
    meaningFa: "پیش، قبل (برای زمان گذشته)",
    englishDef: "In the past; before the present time",
    synonyms: ["earlier", "previously", "back"],
    antonyms: ["later", "ahead"],
    contextClue: "I moved to this beautiful city three years [ ___ ].",
    situationHintFa: "وقتی زمان وقوع اتفاقی در گذشته را بیان می‌کنید (مثلاً ۲ روز پیش، ۵ سال قبل)",
    exampleEn: "The train departed ten minutes ago, so we must wait for the next one.",
    exampleFa: "قطار ده دقیقه پیش حرکت کرد، بنابراین باید منتظر قطار بعدی بمانیم.",
  },
  "air": {
    phonetic: "/eər/",
    meaningFa: "هوا، جو زمین",
    englishDef: "The invisible mixture of gases that surrounds the earth and that people breathe",
    synonyms: ["atmosphere", "breeze"],
    antonyms: [],
    contextClue: "Open the window and let some fresh [ ___ ] circulate inside the room.",
    situationHintFa: "گاز نامرئی که با ریه‌هایتان نفس می‌کشید و تنفس می‌کنید",
    exampleEn: "Mountain air is wonderfully fresh and crisp in the morning.",
    exampleFa: "هوای کوهستان در صبحگاه فوق‌العاده تازه و باطراوت است.",
  },
  "airport": {
    phonetic: "/ˈeə.pɔːt/",
    meaningFa: "فرودگاه بین‌المللی یا داخلی",
    englishDef: "A place where airplanes land and take off, with buildings for passengers",
    synonyms: ["airfield", "terminal"],
    antonyms: [],
    contextClue: "We must arrive at the [ ___ ] two hours before our flight departs.",
    situationHintFa: "محل نشست و برخاست هواپیماها که مسافران با چمدان به آنجا می‌روند",
    exampleEn: "The international airport was bustling with travelers from around the world.",
    exampleFa: "فرودگاه بین‌المللی پر از مسافرانی از سراسر جهان بود.",
  },
  "all": {
    phonetic: "/ɔːl/",
    meaningFa: "همه، تمام، کل",
    englishDef: "The whole quantity or number of something",
    synonyms: ["every", "entire", "whole"],
    antonyms: ["none", "nothing"],
    contextClue: "[ ___ ] students in our classroom passed the final examination.",
    situationHintFa: "وقتی تک‌تک اعضای یک مجموعه بدون استثناء مد نظر هستند",
    exampleEn: "All the lights in the house were turned off before bedtime.",
    exampleFa: "تمام چراغ‌های خانه قبل از زمان خواب خاموش شدند.",
  },
  "all right": {
    phonetic: "/ˌɔːl ˈraɪt/",
    meaningFa: "بسیار خوب، روبه‌راه، مشکلی نیست",
    englishDef: "Satisfactory; safe and well; acceptable",
    synonyms: ["okay", "fine", "acceptable"],
    antonyms: ["bad", "wrong"],
    contextClue: "Are you feeling [ ___ ] after the long workout? You look a bit tired.",
    situationHintFa: "وقتی از حال کسی جویا می‌شوید یا موافقت خود را با پیشنهادی اعلام می‌کنید",
    exampleEn: "Everything turned out all right in the end, so you don't need to worry.",
    exampleFa: "در نهایت همه‌چیز روبه‌راه شد، پس نیازی نیست نگران باشی.",
  },
  "also": {
    phonetic: "/ˈɔːl.səʊ/",
    meaningFa: "همچنین، علاوه بر این",
    englishDef: "In addition; too",
    synonyms: ["too", "as well", "furthermore"],
    antonyms: [],
    contextClue: "She speaks fluent French and she can [ ___ ] understand Italian.",
    situationHintFa: "وقتی می‌خواهید نکته یا مهارت دیگری را به مطلب قبلی اضافه کنید",
    exampleEn: "The hotel offers free breakfast and also provides complimentary airport transfer.",
    exampleFa: "هتل صبحانه رایگان ارائه می‌دهد و همچنین ترانسفر فرودگاهی رایگان دارد.",
  },
  "always": {
    phonetic: "/ˈɔːl.weɪz/",
    meaningFa: "همیشه، همواره، پیوسته",
    englishDef: "At all times; on every occasion",
    synonyms: ["constantly", "forever", "perpetually"],
    antonyms: ["never", "seldom"],
    contextClue: "The sun [ ___ ] rises in the east and sets in the west.",
    situationHintFa: "کاری یا حقیقتی که صد در صد مواقع اتفاق می‌افتد و هیچ‌گاه تغییر نمی‌کند",
    exampleEn: "My mother always drinks a warm glass of water every morning.",
    exampleFa: "مادرم همیشه هر روز صبح یک لیوان آب گرم می‌نوشد.",
  },
  "amazing": {
    phonetic: "/əˈmeɪ.zɪŋ/",
    meaningFa: "شگفت‌انگیز، فوق‌العاده، حیرت‌آور",
    englishDef: "Causing great surprise, admiration, or wonder",
    synonyms: ["wonderful", "incredible", "astonishing"],
    antonyms: ["ordinary", "terrible", "boring"],
    contextClue: "The magician performed an [ ___ ] trick that left everyone speechless.",
    situationHintFa: "چیزی چنان عالی یا عجیب که با دیدنش چشمانتان از شگفتی گرد می‌شود",
    exampleEn: "We watched an amazing sunset from the top of the mountain.",
    exampleFa: "ما از بالای کوه نظاره‌گر یک غروب آفتاب فوق‌العاده بودیم.",
  },
  "and": {
    phonetic: "/ænd/ , /ənd/",
    meaningFa: "و (حرف پیوند)",
    englishDef: "Used to connect words of the same grammatical category",
    synonyms: ["plus", "along with"],
    antonyms: ["without"],
    contextClue: "I ordered a cup of black coffee [ ___ ] a delicious chocolate muffin.",
    situationHintFa: "حرف ربطی که دو کلمه، دو شخص یا دو جمله را به یکدیگر متصل می‌کند",
    exampleEn: "Ali and Reza are best friends and study together every day.",
    exampleFa: "علی و رضا بهترین دوستان یکدیگر هستند و هر روز با هم درس می‌خوانند.",
  },
  "angry": {
    phonetic: "/ˈæŋ.ɡri/",
    meaningFa: "عصبانی، خشمگین",
    englishDef: "Having a strong feeling of displeasure or hostility",
    synonyms: ["mad", "furious", "irritated"],
    antonyms: ["calm", "happy", "peaceful"],
    contextClue: "He became very [ ___ ] when someone scratched his new car.",
    situationHintFa: "احساس خشم و ناراحتی شدیدی که وقتی کسی به شما بی‌احترامی یا ظلم می‌کند بروز می‌دهید",
    exampleEn: "Take a deep breath before speaking when you feel angry.",
    exampleFa: "هنگامی که احساس عصبانیت می‌کنی، قبل از صحبت کردن نفس عمیقی بکش.",
  },
  "animal": {
    phonetic: "/ˈæn.ɪ.məl/",
    meaningFa: "حیوان، جانور",
    englishDef: "A living organism that feeds on organic matter and can move independently",
    synonyms: ["creature", "beast"],
    antonyms: ["plant"],
    contextClue: "The lion is a magnificent wild [ ___ ] that lives in open savannas.",
    situationHintFa: "موجودی جاندار مثل سگ، گربه، اسب یا شیر که گیاه یا انسان نیست",
    exampleEn: "We should always treat every domestic and stray animal with kindness.",
    exampleFa: "ما همیشه باید با هر حیوان اهلی و خیابانی با مهربانی رفتار کنیم.",
  },
  "another": {
    phonetic: "/əˈnʌð.ər/",
    meaningFa: "یک ... دیگر، دیگری",
    englishDef: "Used to refer to an additional person or thing of the same type",
    synonyms: ["additional", "one more", "alternative"],
    antonyms: ["same"],
    contextClue: "This coffee is delicious! May I please have [ ___ ] cup?",
    situationHintFa: "وقتی علاوه بر چیزی که دارید، یک مورد دیگر از همان جنس می‌خواهید",
    exampleEn: "Let's postpone the meeting to another day when everyone is free.",
    exampleFa: "بیایید جلسه را به روز دیگری موکول کنیم که همه وقت داشته باشند.",
  },
  "answer": {
    phonetic: "/ˈɑːn.sər/",
    meaningFa: "پاسخ، جواب دادن / جواب",
    englishDef: "A thing said, written, or done to deal with a question or situation",
    synonyms: ["reply", "response", "solution"],
    antonyms: ["question", "ask"],
    contextClue: "Do you know the correct [ ___ ] to question number seven?",
    situationHintFa: "کلام یا نوشته‌ای که در پاسخ به یک سوال یا تلفن ارائه می‌دهید",
    exampleEn: "Please answer the phone when it rings; it might be an urgent call.",
    exampleFa: "لطفاً وقتی تلفن زنگ می‌زند پاسخ بده؛ ممکن است تماس فوری باشد.",
  },
  "apple": {
    phonetic: "/ˈæp.əl/",
    meaningFa: "سیب (میوه)",
    englishDef: "A round fruit with red, green, or yellow skin and crisp flesh",
    synonyms: [],
    antonyms: [],
    contextClue: "Eating a crisp green [ ___ ] a day keeps the doctor away.",
    situationHintFa: "میوه گرد و آبدار سرخ، سبز یا زرد که نماد سلامتی و تغذیه است",
    exampleEn: "She sliced a fresh red apple and shared it with her younger brother.",
    exampleFa: "او یک سیب سرخ تازه را قاچ کرد و با برادر کوچکش قسمت کرد.",
  },
  "book": {
    phonetic: "/bʊk/",
    meaningFa: "کتاب / رزرو کردن",
    englishDef: "A written or printed work consisting of pages bound together",
    synonyms: ["volume", "publication", "reserve"],
    antonyms: [],
    contextClue: "I spent the rainy weekend reading an exciting novel [ ___ ].",
    situationHintFa: "مجموعه‌ای از برگه‌های کاغذی یا الکترونیکی حاوی داستان، علم یا درس",
    exampleEn: "He loves to read a chapter of his favorite book before sleeping.",
    exampleFa: "او دوست دارد قبل از خواب یک فصل از کتاب مورد علاقه‌اش را بخواند.",
  },
};

export { CURATED_A1_DICTIONARY, parseToken, normalizePOS, CEFR_SOURCE_DIR, OUTPUT_DIR };
