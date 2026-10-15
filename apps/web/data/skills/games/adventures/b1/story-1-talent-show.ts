import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 1 (B1): The Chaotic Talent Show (دردسرهای شیرین مسابقه استعدادیابی)
// Genre: Humor & Everyday Life (طنز و روزمره)
// CEFR: B1 (Past tenses, conditionals, relative clauses, modals, conversational B1 vocab)
// Characters: Sam, Leo, Maya, Mr. Henderson, Principal Davis
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Sam had been practicing his acoustic guitar for three weeks because he really wanted to win the annual community talent show. His best friend Leo, who loved tinkering with old gadgets, had built an eccentric wooden robot named 'Beat-Bot' to play the drums. However, backstage ten minutes before the performance, Beat-Bot started shaking violently and playing at triple speed. Maya, their keyboard player, looked terrified as screws began rattling loose across the floor.",
    keywords: [
      { word: "practicing", meaningFa: "تمرین کردن مداوم", phonetic: "/ˈpræktɪsɪŋ/" },
      { word: "eccentric", meaningFa: "عجیب و غریب / نامتعارف اما بامزه", phonetic: "/ɪkˈsentrɪk/" },
      { word: "violently", meaningFa: "با شدت زیاد / تکان‌های شدید", phonetic: "/ˈvaɪələntli/" },
      { word: "terrified", meaningFa: "بسیار نگران و وحشت‌زده", phonetic: "/ˈterɪfaɪd/" },
    ],
    question: {
      promptEn: "Why was Beat-Bot causing panic backstage before the show?",
      promptFa: "چرا ربات بیت‌بات قبل از اجرا باعث نگرانی پشت صحنه شد؟",
      options: [
        "Because it was shaking and playing at triple speed",
        "Because it refused to turn on at all",
        "Because someone spilled water on its battery",
      ],
      correctIndex: 0,
      hintSnippet: "Beat-Bot started shaking violently and playing at triple speed",
      clueFa: "خط چهارم رو بخون دوست من؛ ربات شروع کرد به لرزیدن شدید و با سه برابر سرعت درام زد!",
    },
    choiceA: {
      labelEn: "Quickly tighten the screws and recalibrate Beat-Bot's rhythm dial!",
      labelFa: "پیچ‌ها رو با آچار محکم کن و درجه سرعت بیت‌بات رو تنظیم کن!",
      descriptionFa: "شاید بشه قبل از رفتن روی صحنه سرعتش رو متعادل کرد.",
    },
    choiceB: {
      labelEn: "Embrace the crazy fast beat and switch to an energetic rock tempo!",
      labelFa: "ریتم تند و دیوانه‌وارش رو بپذیر و آهنگ رو به سبک راک پرانرژی تغییر بده!",
      descriptionFa: "اگه موسیقی رو با ریتم تند ربات هماهنگ کنید شاید همه عاشقش بشن!",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Leo grabbed his lucky blue screwdriver and tightened three loose brass bolts just as the stage curtains opened. The sudden spotlight blinded Sam for a second, but he smiled confidently at the packed auditorium. Beat-Bot gave a polite mechanical bow and started a steady, gentle jazz rhythm. The audience tapped their shoes with appreciation, although Leo noticed a tiny puff of purple smoke escaping from the robot's left speaker.",
    keywords: [
      { word: "screwdriver", meaningFa: "پیچ‌گوشتی", phonetic: "/ˈskruːdraɪvə/" },
      { word: "confidently", meaningFa: "با اعتماد به نفس کامل", phonetic: "/ˈkɒnfɪdəntli/" },
      { word: "steady", meaningFa: "پایدار و منظم", phonetic: "/ˈstedi/" },
      { word: "appreciation", meaningFa: "تحسین و قدردانی", phonetic: "/əˌpriːʃiˈeɪʃn/" },
    ],
    question: {
      promptEn: "What did the audience do when the band started playing?",
      promptFa: "وقتی گروه شروع به نواختن کرد، تماشاگران چه واکنشی نشان دادند؟",
      options: [
        "They tapped their shoes with appreciation",
        "They booed and threw paper airplanes",
        "They left their seats immediately",
      ],
      correctIndex: 0,
      hintSnippet: "The audience tapped their shoes with appreciation",
      clueFa: "خط آخر رو نگاه کن عزیزم؛ تماشاگرها با لذت با کفش‌هاشون ریتم گرفتن.",
    },
    choiceA: {
      labelEn: "Play an elegant guitar solo to keep everyone's eyes on you!",
      labelFa: "یک سولو گیتار فوق‌العاده بنواز تا حواس همه از دود بنفش پرت بشه!",
      descriptionFa: "هنر گیتارنوازی سام توجه همه رو جلب می‌کنه.",
    },
    choiceB: {
      labelEn: "Nod to Maya to perform a playful synthesizer chime sequence!",
      labelFa: "به مایا اشاره کن تا ملودی شاد و جادویی با کیبورد بزنه!",
      descriptionFa: "صدای کیبورد به دود بنفش جلوه‌ای شبیه شعبده‌بازی می‌ده.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Sam grinned boldly and counted down: 'One, two, three, go!' Instead of their slow ballad, they launched into an electrifying, high-energy rock song. Sam stomped across the stage while Maya leaned into her keyboard with wild enthusiasm. Beat-Bot banged the wooden drumsticks so passionately that festive rainbow confetti shot out from its tin hat, showering the front row with sparkling paper stars. The students stood up and screamed with excitement.",
    keywords: [
      { word: "boldly", meaningFa: "شجاعانه و جسورانه", phonetic: "/ˈbəʊldli/" },
      { word: "electrifying", meaningFa: "مهیج و پر از شور و هیجان", phonetic: "/ɪˈlektrɪfaɪ-ɪŋ/" },
      { word: "enthusiasm", meaningFa: "شور و اشتیاق فراوان", phonetic: "/ɪnˈθjuːziæzəm/" },
      { word: "confetti", meaningFa: "کاغذهای رنگی جشن", phonetic: "/kənˈfeti/" },
    ],
    question: {
      promptEn: "What shot out from Beat-Bot's tin hat during the song?",
      promptFa: "در حین اجرای آهنگ چه چیزی از کلاه حلبی بیت‌بات به هوا پرتاب شد؟",
      options: [
        "Festive rainbow confetti",
        "Sparks of hot electricity",
        "Cold drops of green slime",
      ],
      correctIndex: 0,
      hintSnippet: "festive rainbow confetti shot out from its tin hat",
      clueFa: "خط ماقبل آخر رو بخون؛ تکه‌های کاغذ رنگی جشن مثل ستاره به هوا پریدن!",
    },
    choiceA: {
      labelEn: "Jump off the stage edge and lead a lively clapping circle!",
      labelFa: "از لبه صحنه بپر پایین و ردیف جلو رو به دست زدن هماهنگ دعوت کن!",
      descriptionFa: "ارتباط نزدیک با تماشاچی‌ها سالن رو منفجر می‌کنه.",
    },
    choiceB: {
      labelEn: "Challenge Beat-Bot to a high-speed guitar-versus-drum duel!",
      labelFa: "بیت‌بات رو به دوئل سرعتی و خنده‌دار گیتار در برابر درام دعوت کن!",
      descriptionFa: "یک کل‌کل هنری جذاب بین انسان و ربات روی صحنه شکل می‌گیره.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Sam stepped right to the microphone and delivered a breathtaking guitar solo, his fingers dancing effortlessly across the frets. Mr. Henderson, the stern music teacher in the judges' seat, lowered his glasses in astonishment. Meanwhile, Leo subtly fanned the tiny puff of smoke with his sheet music, disguising it as an intentional stage fog effect that earned impressed nods from the audience.",
    keywords: [
      { word: "breathtaking", meaningFa: "نفس‌گیر و تماشایی", phonetic: "/ˈbreθteɪkɪŋ/" },
      { word: "astonishment", meaningFa: "شگفتی و حیرت عمیق", phonetic: "/əˈstɒnɪʃmənt/" },
      { word: "subtly", meaningFa: "با زیرکی و ظرافت", phonetic: "/ˈsʌtli/" },
      { word: "disguising", meaningFa: "پنهان کردن / وانمود کردن", phonetic: "/dɪsˈɡaɪzɪŋ/" },
    ],
    question: {
      promptEn: "How did Leo cleverly hide the small puff of smoke?",
      promptFa: "لئو چطور با هوشمندی دود کوچک ربات را پنهان کرد؟",
      options: [
        "He fanned it with sheet music like a stage effect",
        "He threw a heavy blanket over Beat-Bot",
        "He poured orange juice onto the wires",
      ],
      correctIndex: 0,
      hintSnippet: "Leo subtly fanned the tiny puff of smoke with his sheet music, disguising it as an intentional stage fog effect",
      clueFa: "لئو با برگه نُت موسیقی دود رو باد زد تا شبیه مه مصنوعی روی صحنه به نظر برسه.",
    },
    choiceA: {
      labelEn: "Sing an acoustic harmony together with Maya on the chorus!",
      labelFa: "با مایا همخوانی آکوستیک آرامش‌بخش و زیبایی در بند ترانه اجرا کن!",
      descriptionFa: "هارمونی دلنشین صداها احساسات داوران رو تسخیر می‌کنه.",
    },
    choiceB: {
      labelEn: "Let Beat-Bot perform a gentle xylophone chime solo!",
      labelFa: "اجازه بده بیت‌بات تک‌نوازی زنگوله‌ای و ملایم اجرا کنه!",
      descriptionFa: "صدای ناقوسی ربات جلوه‌ای بامزه و هنری به آهنگ می‌ده.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Maya grinned and activated a sparkling bell chime effect on her synthesizer. The cheerful melody floated through the hall, and the purple smoke drifted upward under the pink stage spotlight, creating an unexpectedly magical atmosphere. A toddler in the third row giggled and pointed, believing Beat-Bot was a friendly fairytale dragon. Even Principal Davis was seen humming along cheerfully.",
    keywords: [
      { word: "synthesizer", meaningFa: "کیبورد سینتی‌سایزر الکترونیکی", phonetic: "/ˈsɪnθəsaɪzə/" },
      { word: "fairytale", meaningFa: "قصه‌های پریان و افسانه‌ای", phonetic: "/ˈfeəriteɪl/" },
      { word: "humming", meaningFa: "زیر لب با دهان بسته آواز خواندن", phonetic: "/ˈhʌmɪŋ/" },
    ],
    question: {
      promptEn: "What did the young child in the third row think Beat-Bot was?",
      promptFa: "کودک خردسال ردیف سوم فکر کرد بیت‌بات چه موجودی است؟",
      options: [
        "A friendly fairytale dragon",
        "A scary space monster",
        "A vacuum cleaner",
      ],
      correctIndex: 0,
      hintSnippet: "believing Beat-Bot was a friendly fairytale dragon",
      clueFa: "خط ماقبل آخر رو ببین دوست خوبم؛ فکر کرد اژدهای مهربون قصه‌هاست!",
    },
    choiceA: {
      labelEn: "Invite the little children to wave glowing wristbands!",
      labelFa: "از بچه‌های سالن بخواه دستبندهای نورانی‌شون رو تکون بدن!",
      descriptionFa: "سالن پر از ستاره‌های رنگین‌کمانی می‌شه.",
    },
    choiceB: {
      labelEn: "Transition smoothly into a groovy retro funk rhythm!",
      labelFa: "آهنگ رو به یک ریتم فانک پرنشاط و خاطره‌انگیز تغییر بده!",
      descriptionFa: "پدر و مادرها هم همراه بچه‌ها شروع به شادی می‌کنن.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Sam leaped lightly off the low wooden platform into the center aisle. He strummed a catchy rhythm and invited the whole gym to clap in sync: 'One! Two! Clap! Clap!' Within ten seconds, three hundred people were clapping together with infectious joy. Beat-Bot nodded its copper antenna rhythmically, projecting two tiny laser smiley faces onto the auditorium ceiling that made everyone cheer wildly.",
    keywords: [
      { word: "aisle", meaningFa: "راهروی بین صندلی‌ها", phonetic: "/aɪl/" },
      { word: "infectious", meaningFa: "واگیردار و سرایت‌کننده (شادی واگیر)", phonetic: "/ɪnˈfekʃəs/" },
      { word: "antenna", meaningFa: "آنتن مخابراتی", phonetic: "/ænˈtenə/" },
      { word: "projecting", meaningFa: "تاباندن و نمایش نور روی سطح", phonetic: "/prəˈdʒektɪŋ/" },
    ],
    question: {
      promptEn: "What did Beat-Bot project onto the auditorium ceiling?",
      promptFa: "بیت‌بات چه تصویری روی سقف سالن نمایش انداخت؟",
      options: [
        "Two tiny laser smiley faces",
        "A scary spider shadow",
        "A giant clock showing time",
      ],
      correctIndex: 0,
      hintSnippet: "projecting two tiny laser smiley faces onto the auditorium ceiling",
      clueFa: "خط آخر رو نگاه کن؛ دو تا شکلک خندان لیزری روی سقف تاباند.",
    },
    choiceA: {
      labelEn: "Ask Principal Davis to announce a funny cheer on the microphone!",
      labelFa: "میکروفون رو جلو مدیر بیار تا یه هورای خنده‌دار بگه!",
      descriptionFa: "همه می‌دونن آقای دیویس شوخ‌طبع‌ترین مدیر مدرسه‌ست.",
    },
    choiceB: {
      labelEn: "Run back onstage and hit an epic high guitar bend!",
      labelFa: "بدو روی صحنه و سیم گیتار رو برای یک تکنوازی آتشین خم کن!",
      descriptionFa: "یک اجرای پرشور راک اند رولی که سالن رو به وجد میاره.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Sam stood face-to-face with Beat-Bot, grinning like a challenger in a musical contest. Sam ripped a fast four-note lick, and Beat-Bot immediately responded with a lightning-fast drum roll: Rat-a-tat-tat! Back and forth they exchanged rhythms, getting faster and more theatrical with every round. The crowd stood on their feet, laughing and gasping at how a home-built wooden robot could hold such incredible rhythm against human skill.",
    keywords: [
      { word: "challenger", meaningFa: "هماورد / حریف مبارز", phonetic: "/ˈtʃælɪndʒə/" },
      { word: "lightning-fast", meaningFa: "به سرعت برق و باد", phonetic: "/ˈlaɪtnɪŋ fɑːst/" },
      { word: "theatrical", meaningFa: "نمایشی و پرزرق‌وبرق", phonetic: "/θiˈætrɪkl/" },
      { word: "incredible", meaningFa: "باورنکردنی و فوق‌العاده", phonetic: "/ɪnˈkredəbl/" },
    ],
    question: {
      promptEn: "How did the crowd react to the fast-paced duel between Sam and Beat-Bot?",
      promptFa: "تماشاگران به دوئل سرعتی سام و بیت‌بات چه واکنشی نشان دادند؟",
      options: [
        "They stood on their feet, laughing and gasping",
        "They asked the principal to stop the noise",
        "They quietly took notes on paper",
      ],
      correctIndex: 0,
      hintSnippet: "The crowd stood on their feet, laughing and gasping",
      clueFa: "خط آخر رو ببین عزیزم؛ تماشاگرها ایستادند و با خنده و هیجان تشویق کردند.",
    },
    choiceA: {
      labelEn: "Have Beat-Bot spin completely around on one wheel while drumming!",
      labelFa: "بیت‌بات در حین درام زدن روی تک‌چرخش یک دور کامل ۳۶۰ درجه بزنه!",
      descriptionFa: "یک حرکت آکروباتیک رباتیک خنده‌دار روی صحنه.",
    },
    choiceB: {
      labelEn: "Finish the duel by harmonizing guitar chords with Maya's synth bells!",
      labelFa: "دوئل رو با هماهنگ کردن آکوردهای گیتار و زنگوله‌های کیبورد به اوج برسون!",
      descriptionFa: "ترکیب ملودی با ریتم درام یک فینال بی‌نقص می‌سازه.",
    },
  },

  // STEP 4 (8 nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Sam and Maya blended their voices in a warm, soulful acoustic harmony that silenced the entire hall. The gentle acoustics highlighted Sam's honest lyrics about friendship and second chances. In the front row, Mr. Henderson took off his glasses and wiped away a joyful tear, thoroughly moved by how two teenagers had turned technical glitches into pure musical beauty.",
    keywords: [
      { word: "soulful", meaningFa: "پراحساس و دلنشین", phonetic: "/ˈsəʊlfl/" },
      { word: "lyrics", meaningFa: "شعر و متن ترانه", phonetic: "/ˈlɪrɪks/" },
      { word: "glitches", meaningFa: "اشکالات و خطاهای کوچک فنی", phonetic: "/ˈɡlɪtʃɪz/" },
    ],
    question: {
      promptEn: "What did Mr. Henderson do when he heard the heartfelt acoustic harmony?",
      promptFa: "وقتی آقای هندرسون همخوانی پر از احساس را شنید چه کرد؟",
      options: [
        "He wiped away a joyful tear",
        "He walked out of the room",
        "He rang a loud bell",
      ],
      correctIndex: 0,
      hintSnippet: "Mr. Henderson took off his glasses and wiped away a joyful tear",
      clueFa: "خط سوم رو ببین؛ عینکش رو برداشت و اشک شوق رو پاک کرد.",
    },
    choiceA: {
      labelEn: "Whisper the final poetic line in gentle unison!",
      labelFa: "آخرین مصراع شعر رو با زمزمه‌ای هماهنگ و آرام به پایان برسونید!",
      descriptionFa: "پایانی عمیق و پر از آرامش.",
    },
    choiceB: {
      labelEn: "Let Beat-Bot ring a tiny silver bicycle bell to conclude!",
      labelFa: "بذار بیت‌بات با زنگ دوچرخه کوچیکش پایان قطعه رو اعلام کنه!",
      descriptionFa: "یک چاشنی خنده‌دار و بامزه در آخرین ثانیه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Beat-Bot tapped its wooden arms against miniature brass xylophone bars with charming precision: Ding-dong-chime! The bright acoustic notes sounded like raindrops in a sunny garden. The judges smiled at each other, noting down top scores for creativity and instrument invention. Leo gave a quiet thumbs-up from behind his amplifier, knowing his crazy contraption had won hearts.",
    keywords: [
      { word: "miniature", meaningFa: "بسیار ریز و مینیاتوری", phonetic: "/ˈmɪnətʃə/" },
      { word: "precision", meaningFa: "دقت بالا و حساب‌شده", phonetic: "/prɪˈsɪʒn/" },
      { word: "contraption", meaningFa: "دستگاه و وسیله عجیب دست‌ساز", phonetic: "/kənˈtræpʃn/" },
    ],
    question: {
      promptEn: "What kind of instrument did Beat-Bot play during its solo?",
      promptFa: "بیت‌بات در تک‌نوازی‌اش چه سازی را نواخت؟",
      options: [
        "Miniature brass xylophone bars",
        "A heavy electric bass",
        "An ancient church organ",
      ],
      correctIndex: 0,
      hintSnippet: "Beat-Bot tapped its wooden arms against miniature brass xylophone bars",
      clueFa: "خط اول رو بخون؛ میله‌های برنجی زیلوفون مینیاتوری رو نواخت.",
    },
    choiceA: {
      labelEn: "Have Beat-Bot take a dramatic mechanical bow until its hat drops!",
      labelFa: "بیت‌بات تعظیم پر زرق‌وبرق مکانیکی بکنه تا کلاهش بیفته زمین!",
      descriptionFa: "خنده تماشاچیان به سقف سالن می‌رسه.",
    },
    choiceB: {
      labelEn: "Present Leo from behind the amplifier as the genius inventor!",
      labelFa: "لئو رو از پشت آمپلی‌فایر به عنوان مهندس نابغه معرفی کن!",
      descriptionFa: "حق لئو هست که وسط صحنه تشویق بشه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The entire gymnasium erupted into waves of glowing green and pink light as hundreds of students shook their wristbands to the tempo. Maya kicked into an upbeat retro chorus, and Sam smiled radiantly. Even the backstage lighting technician was so captivated that he synchronized the ceiling spotlights to match the crowd's waving arms, creating a genuine stadium concert sensation.",
    keywords: [
      { word: "erupted", meaningFa: "منفجر شد / به غوغا تبدیل شد", phonetic: "/ɪˈrʌptɪd/" },
      { word: "radiantly", meaningFa: "با درخشش و شادی وصف‌ناپذیر", phonetic: "/ˈreɪdiəntli/" },
      { word: "synchronized", meaningFa: "هماهنگ و همگام‌سازی کرد", phonetic: "/ˈsɪŋkrənaɪzd/" },
    ],
    question: {
      promptEn: "What did the backstage lighting technician do?",
      promptFa: "مسئول نورپردازی پشت صحنه چه کاری انجام داد؟",
      options: [
        "Synchronized spotlights to match the waving arms",
        "Turned off all the lights accidentally",
        "Left the control desk to eat lunch",
      ],
      correctIndex: 0,
      hintSnippet: "synchronized the ceiling spotlights to match the crowd's waving arms",
      clueFa: "خط ماقبل آخر؛ نورهای سقف رو با موج دست‌های بچه‌ها هماهنگ کرد.",
    },
    choiceA: {
      labelEn: "Sing the chorus one more time with the entire auditorium!",
      labelFa: "بند ترانه رو یک بار دیگه همراه با صدای کل سالن همخوانی کنید!",
      descriptionFa: "همه سالن یک‌صدا شعر رو فریاد می‌زنن.",
    },
    choiceB: {
      labelEn: "Launch a shower of sparkling silver streamers over the stage!",
      labelFa: "بارانی از روبان‌های نقره‌ای درخشان روی صحنه پرتاب کنید!",
      descriptionFa: "یک جلوه بصری ماندگار در پایان ترانه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "The retro funk groove was so infectious that the town mayor in the VIP booth stood up and began tapping his shiny loafers. Sam delivered sharp rhythmic strums, perfectly complementing Maya's bouncy keyboard riffs. Beat-Bot bobbed its wooden head in time, giving off rhythmic electronic beeps that sounded like a catchy video game soundtrack from the nineteen-eighties.",
    keywords: [
      { word: "groove", meaningFa: "ریتم و ضرباهنگ جذاب موسیقی", phonetic: "/ɡruːv/" },
      { word: "loafers", meaningFa: "کفش‌های شیک راحتی و مجلسی", phonetic: "/ˈləʊfəz/" },
      { word: "soundtrack", meaningFa: "موسیقی متن", phonetic: "/ˈsaʊndtræk/" },
    ],
    question: {
      promptEn: "Who stood up and tapped his shoes in the VIP booth?",
      promptFa: "چه کسی در جایگاه ویژه ایستاد و با کفش‌هایش ریتم گرفت؟",
      options: [
        "The town mayor",
        "The school janitor",
        "A visiting soccer coach",
      ],
      correctIndex: 0,
      hintSnippet: "the town mayor in the VIP booth stood up and began tapping his shiny loafers",
      clueFa: "خط دوم رو ببین دوست من؛ شهردار شهر در جایگاه ویژه شروع به ریتم گرفتن کرد.",
    },
    choiceA: {
      labelEn: "Dedicate the final funk chord to the smiling mayor!",
      labelFa: "آکورد پایانی فانک رو با احترامی طنزآمیز به شهردار تقدیم کن!",
      descriptionFa: "شهردار از ته دل می‌خنده و دست تکون میده.",
    },
    choiceB: {
      labelEn: "Speed up the beat for a lightning thirty-second finale!",
      labelFa: "ریتم رو برای یک فینال ۳۰ ثانیه‌ای موشکی تندتر کن!",
      descriptionFa: "انرژی انفجاری آخر قطعه همه رو به وجد میاره.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Principal Davis took the stage microphone with a booming laugh: 'I promised myself I would stay dignified today, but Endoora High has the best rhythm in the county!' He joined Sam in shouting the chorus while making exaggerated air-guitar poses that had every teacher and parent holding their sides with laughter. Mobile phones lit up across the crowd, recording the principal's hilarious performance.",
    keywords: [
      { word: "dignified", meaningFa: "باوقار و متین", phonetic: "/ˈdɪɡnɪfaɪd/" },
      { word: "exaggerated", meaningFa: "اغراق‌آمیز و نمایشی", phonetic: "/ɪɡˈzædʒəreɪtɪd/" },
      { word: "recording", meaningFa: "فیلمبرداری و ضبط کردن", phonetic: "/rɪˈkɔːdɪŋ/" },
    ],
    question: {
      promptEn: "What funny pose did Principal Davis make on stage?",
      promptFa: "آقای دیویس مدیر مدرسه چه ژست خنده‌داری روی صحنه گرفت؟",
      options: [
        "Exaggerated air-guitar poses",
        "A clumsy ballet spin",
        "A superhero cape pose",
      ],
      correctIndex: 0,
      hintSnippet: "making exaggerated air-guitar poses",
      clueFa: "خط سوم رو ببین؛ با دست ژست خنده‌دار گیتار زدن خیالی (Air guitar) گرفت!",
    },
    choiceA: {
      labelEn: "Hand Principal Davis a real acoustic guitar for the last strum!",
      labelFa: "یک گیتار واقعی دست آقای مدیر بده تا آخرین ضربه رو بزنه!",
      descriptionFa: "شاید بلد نباشه ولی صحنه خنده‌داری خلق می‌شه.",
    },
    choiceB: {
      labelEn: "Gather the whole band and principal for an iconic rock jump!",
      labelFa: "همه گروه و مدیر با هم در انتهای آهنگ یک پرش راک تماشایی بزنید!",
      descriptionFa: "عکسی تاریخی که در مجله سالانه مدرسه چاپ می‌شه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Sam sprinted back onto the stage, slid onto his knees, and nailed a screaming high-register guitar bend right into the spotlight. Beat-Bot kept absolute precision on the hi-hat cymbal, while Maya layered deep electronic organ chords underneath. The sheer rock energy shook the timber floorboards, and even the sternest judges couldn't hide their enthusiastic grins.",
    keywords: [
      { word: "sprinted", meaningFa: "با سرعت دوید", phonetic: "/ˈsprɪntɪd/" },
      { word: "cymbal", meaningFa: "سنج درامز", phonetic: "/ˈsɪmbl/" },
      { word: "floorboards", meaningFa: "تخته‌های چوبی کف صحنه", phonetic: "/ˈflɔːbɔːdz/" },
    ],
    question: {
      promptEn: "How did Sam slide onto the stage for his guitar solo?",
      promptFa: "سام چطور برای اجرای تکنوازی روی صحنه سُر خورد؟",
      options: [
        "He slid onto his knees into the spotlight",
        "He rolled across a wooden table",
        "He walked backwards very slowly",
      ],
      correctIndex: 0,
      hintSnippet: "slid onto his knees, and nailed a screaming high-register guitar bend",
      clueFa: "خط اول رو بخون عزیزم؛ روی زانوهاش زیر نور پروژکتور سُر خورد.",
    },
    choiceA: {
      labelEn: "Strike a frozen rock star statue pose under the spotlight!",
      labelFa: "در آخرین ثانیه زیر نور مثل مجسمه راک بی‌حرکت خشک شو!",
      descriptionFa: "سکوت ناگهانی قبل از انفجار صدای تشویق‌ها.",
    },
    choiceB: {
      labelEn: "Cue Beat-Bot to fire harmless golden sparkler trails!",
      labelFa: "دستور بده بیت‌بات جرقه‌های درخشان و بی‌خطر طلایی روشن کنه!",
      descriptionFa: "یک جلوه پایانی آتشین و پر از زرق‌وبرق.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Beat-Bot balanced gracefully on its central rubber roller, spinning three full three-hundred-and-sixty degree pirouettes without skipping a single beat. As it spun, colorful ribbon streamers unfurled from its wooden waist, flying like carnival ribbons around Maya and Sam. The audience roared with approval at the ridiculous yet brilliant engineering masterpiece.",
    keywords: [
      { word: "pirouettes", meaningFa: "چرخش‌های سریع و تماشایی روی یک پا یا چرخ", phonetic: "/ˌpɪruˈets/" },
      { word: "unfurled", meaningFa: "باز شدند و به پرواز درآمدند", phonetic: "/ʌnˈfɜːld/" },
      { word: "engineering", meaningFa: "مهندسی و طراحی فنی", phonetic: "/ˌendʒɪˈnɪərɪŋ/" },
    ],
    question: {
      promptEn: "What unfurled from Beat-Bot's waist while spinning?",
      promptFa: "وقتی بیت‌بات می‌چرخید چه چیزی از کمرش باز شد و به پرواز درآمد؟",
      options: [
        "Colorful ribbon streamers",
        "A long black electric cable",
        "A bunch of helium balloons",
      ],
      correctIndex: 0,
      hintSnippet: "colorful ribbon streamers unfurled from its wooden waist",
      clueFa: "خط دوم رو ببین؛ روبان‌های رنگارنگ جشن مثل کارناوال باز شدند.",
    },
    choiceA: {
      labelEn: "Catch the ribbons and weave an impromptu victory web!",
      labelFa: "روبان‌ها رو بگیر و یک شبکه پیروزی دور سازها بباف!",
      descriptionFa: "صحنه تبدیل به جشنی تمام‌عیار می‌شه.",
    },
    choiceB: {
      labelEn: "Command Beat-Bot to halt with a dramatic robo-salute!",
      labelFa: "به بیت‌بات دستور بده با یک ادای احترام رسمی رباتیک متوقف بشه!",
      descriptionFa: "نظم و دقت بامزه‌اش خنده به لب همه میاره.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Sam's rich guitar chords and Maya's sparkling keyboard bells locked into a triumphant musical climax. Every frequency felt tuned to perfection; the frantic chaos from ten minutes ago had transformed into the tightest, most unforgettable performance of the school year. The clock above the exit showed only thirty seconds remaining in their allotted time slot.",
    keywords: [
      { word: "triumphant", meaningFa: "پیروزمندانه و پرافتخار", phonetic: "/traɪˈʌmfənt/" },
      { word: "frequency", meaningFa: "فرکانس و موج صوتی", phonetic: "/ˈfriːkwənsi/" },
      { word: "allotted", meaningFa: "اختصاص‌یافته / تعیین‌شده", phonetic: "/əˈlɒtɪd/" },
    ],
    question: {
      promptEn: "How much time remained on the clock for their performance?",
      promptFa: "چقدر از زمان اجرای گروه روی ساعت باقی مانده بود؟",
      options: [
        "Only thirty seconds",
        "Over twenty minutes",
        "No time was left at all",
      ],
      correctIndex: 0,
      hintSnippet: "showed only thirty seconds remaining in their allotted time slot",
      clueFa: "خط آخر رو ببین دوست خوبم؛ فقط ۳۰ ثانیه از وقت مجاز مونده بود.",
    },
    choiceA: {
      labelEn: "Finish with a dramatic triple-chord harmony hit!",
      labelFa: "با سه ضربه همزمان و هماهنگ آکوردهای گیتار و کیبورد تمومش کنید!",
      descriptionFa: "یک پایان محکم و حرفه‌ای در رأس ثانیه ۳۰.",
    },
    choiceB: {
      labelEn: "Invite the audience to yell the band name on the final count!",
      labelFa: "از تماشاگران بخواه با شماره سه اسم گروه رو فریاد بزنن!",
      descriptionFa: "فریاد نام گروه سقف سالن رو به لرزه درمیاره.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Sam and Maya dropped their voices to a gentle whisper for the final line. Beat-Bot lowered its drumsticks with absolute silence. For two breathless seconds, you could hear a pin drop in the five-hundred-seat auditorium.",
    keywords: [{ word: "breathless", meaningFa: "در سکوت و نفس در سینه حبس شده", phonetic: "/ˈbreθləs/" }],
    question: {
      promptEn: "What sound could you hear in the auditorium for two seconds?",
      promptFa: "برای دو ثانیه چه صدایی در سالن شنیده می‌شد؟",
      options: ["A pin drop", "A loud fire truck", "A dog barking"],
      correctIndex: 0,
      hintSnippet: "you could hear a pin drop in the five-hundred-seat auditorium",
      clueFa: "سکوت چنان بود که صدای افتادن سوزن هم شنیده می‌شد.",
    },
    choiceA: {
      labelEn: "Smile gently and bow as the thunderous applause erupts!",
      labelFa: "لبخند بزنید و با فوران صدای تشویق‌ها تعظیم کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Raise your acoustic guitar high in quiet gratitude!",
      labelFa: "گیتار آکوستیک را به نشانه سپاسگزاری بی‌صدا بالا ببرید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "With a soft mechanical 'ping', Beat-Bot rang its tiny chrome bell. The sweet bell sound hung in the air like a silver raindrop, making everyone smile at the sweet comedic finish.",
    keywords: [{ word: "chrome", meaningFa: "روکش براق و نقره‌ای فلزی", phonetic: "/krəʊm/" }],
    question: {
      promptEn: "What was the final sound made by Beat-Bot?",
      promptFa: "آخرین صدایی که بیت‌بات تولید کرد چه بود؟",
      options: ["A sweet mechanical ping from a chrome bell", "A loud bass boom", "A siren whistle"],
      correctIndex: 0,
      hintSnippet: "Beat-Bot rang its tiny chrome bell",
      clueFa: "صدای پینگ نرم از یک زنگوله براق کرومی بود.",
    },
    choiceA: {
      labelEn: "Take a joint bow with Beat-Bot tipping its bell!",
      labelFa: "تعظیم مشترک کنید در حالی که بیت‌بات زنگوله‌اش را تکان می‌دهد!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Pass the little chrome bell to Mr. Henderson as a souvenir!",
      labelFa: "زنگوله براق را به عنوان یادگاری به آقای هندرسون هدیه دهید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "Beat-Bot tilted forward so deep in gratitude that its aluminum chef's hat tumbled off, bouncing into the lap of the front-row judge. The entire gym burst into warm, joyful laughter.",
    keywords: [{ word: "tumbled", meaningFa: "سقوط کرد و افتاد", phonetic: "/ˈtʌmbld/" }],
    question: {
      promptEn: "Where did Beat-Bot's aluminum hat land?",
      promptFa: "کلاه آلومینیومی بیت‌بات کجا افتاد؟",
      options: ["In the front-row judge's lap", "Under Maya's keyboard", "Inside a trash can"],
      correctIndex: 0,
      hintSnippet: "bouncing into the lap of the front-row judge",
      clueFa: "توی دامن داور ردیف اول فرود اومد.",
    },
    choiceA: {
      labelEn: "Let the judge wear the hat as he signs the victory certificate!",
      labelFa: "بگذارید داور کلاه را سرش بگذارد و مدرک پیروزی را امضا کند!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Snap a group victory photo with the hat perched on the trophy!",
      labelFa: "یک عکس یادگاری با کلاه روی جام قهرمانی بگیرید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Leo stepped out shyly from behind the huge amplifier, blushing under the spotlights. Sam put his arm around his friend's shoulder: 'Give it up for the true genius of the band!' The cheers grew twice as loud.",
    keywords: [{ word: "blushing", meaningFa: "سرخ شدن از خجالت و ذوق", phonetic: "/ˈblʌʃɪŋ/" }],
    question: {
      promptEn: "Why was Leo blushing when he stepped out?",
      promptFa: "چرا لئو وقتی از پشت آمپلی‌فایر بیرون آمد سرخ شد؟",
      options: ["Because of the spotlight and loud cheers", "Because he was angry", "Because he fell down"],
      correctIndex: 0,
      hintSnippet: "blushing under the spotlights",
      clueFa: "از شدت نور صحنه و تشویق‌های پرشور خجالت کشید و سرخ شد.",
    },
    choiceA: {
      labelEn: "Award Leo the gold medal of honorary engineering!",
      labelFa: "مدال طلای مهندسی افتخاری مدرسه را به لئو اهدا کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Invite Leo to give a witty ten-second acceptance speech!",
      labelFa: "لئو را دعوت کنید تا سخنرانی ده ثانیه‌ای بامزه‌ای ایراد کند!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Five hundred voices sang the chorus together in pure, ringing harmony. The vibration rattled the stage lights, making every student feel part of something truly unforgettable.",
    keywords: [{ word: "vibration", meaningFa: "ارتعاش و لرزش صدا", phonetic: "/vaɪˈbreɪʃn/" }],
    question: {
      promptEn: "How many people sang the chorus together?",
      promptFa: "چند نفر در همخوانی بند ترانه با هم شرکت کردند؟",
      options: ["Five hundred voices", "Only ten people", "Three teachers"],
      correctIndex: 0,
      hintSnippet: "Five hundred voices sang the chorus together",
      clueFa: "پانصد صدا با هم بند ترانه را همخوانی کردند.",
    },
    choiceA: {
      labelEn: "Declare this day the official School Harmony Day!",
      labelFa: "این روز را روز رسمی همبستگی و موسیقی مدرسه بنامید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Film an encore music video right there in the gym!",
      labelFa: "یک موزیک‌ویدئوی خودمانی درست در همان سالن ورزشی ضبط کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Cannons of sparkling silver streamers shot across the auditorium, catching the multicolored stage lights. Streamers fluttered down like shooting stars onto the delighted audience.",
    keywords: [{ word: "streamers", meaningFa: "روبان‌ها و نوارهای بلند جشن", phonetic: "/ˈstriːməz/" }],
    question: {
      promptEn: "What did the streamers look like as they fell?",
      promptFa: "روبان‌ها هنگام باریدن شبیه چه چیزی بودند؟",
      options: ["Like shooting stars", "Like heavy stones", "Like gray clouds"],
      correctIndex: 0,
      hintSnippet: "fluttered down like shooting stars",
      clueFa: "مثل ستاره‌های دنباله‌دار به پایین سرازیر شدند.",
    },
    choiceA: {
      labelEn: "Collect the streamers to decorate the music room trophy shelf!",
      labelFa: "روبان‌ها را برای تزیین قفسه جام اتاق موسیقی جمع کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Toss a glittering handful of silver ribbons into the camera lens!",
      labelFa: "یک مشت روبان نقره‌ای درخشان جلوی لنز دوربین پرتاب کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Sam directed his final guitar chord toward the VIP booth with a theatrical wink. The mayor grinned, stood up, and clapped above his head with genuine delight.",
    keywords: [{ word: "theatrical", meaningFa: "نمایشی و پرانرژی", phonetic: "/θiˈætrɪkl/" }],
    question: {
      promptEn: "What did the mayor do after the dedicated final chord?",
      promptFa: "شهردار بعد از تقدیم آکورد پایانی چه کرد؟",
      options: ["Stood up and clapped above his head", "Walked out of the hall", "Looked at his watch"],
      correctIndex: 0,
      hintSnippet: "stood up, and clapped above his head with genuine delight",
      clueFa: "ایستاد و با خوشحالی دست‌هایش را بالای سرش به هم کوبید.",
    },
    choiceA: {
      labelEn: "Receive an invitation to perform at the Town Summer Festival!",
      labelFa: "دعوتنامه رسمی برای اجرای کنسرت در جشنواره تابستانه شهر دریافت کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Take a selfie with the mayor holding Beat-Bot's wooden drumsticks!",
      labelFa: "با شهردار عکسی بگیرید در حالی که چوب‌های درام بیت‌بات را در دست دارد!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The thirty-second turbo finale hit like a lightning bolt. Maya's keyboard arpeggios raced against Sam's blazing guitar licks until both smashed the closing chord exactly together.",
    keywords: [{ word: "arpeggios", meaningFa: "آرپژهای تند پیانو و کیبورد", phonetic: "/ɑːˈpedʒiəʊz/" }],
    question: {
      promptEn: "How did Sam and Maya finish the thirty-second turbo song?",
      promptFa: "سام و مایا ترانه توربوی سی ثانیه‌ای را چطور به پایان بردند؟",
      options: ["Smashed the closing chord exactly together", "One stopped early by mistake", "The power cut out"],
      correctIndex: 0,
      hintSnippet: "both smashed the closing chord exactly together",
      clueFa: "هر دو دقیقاً با هم آخرین آکورد را نواختند.",
    },
    choiceA: {
      labelEn: "Raise your instruments to the ceiling in triumphant victory!",
      labelFa: "سازهایتان را با افتخار به سمت سقف بالا ببرید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Celebrate by sharing a high-five that echoes across the stage!",
      labelFa: "با یک دست دادن محکم (High-five) شادی‌تان را روی صحنه تقسیم کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Sam handed his wooden acoustic guitar to Principal Davis, who playfully strummed one loud, triumphant chord. The entire school erupted in wild, happy laughter.",
    keywords: [{ word: "triumphant", meaningFa: "پیروزمندانه و باشکوه", phonetic: "/traɪˈʌmfənt/" }],
    question: {
      promptEn: "Who strummed the final acoustic chord?",
      promptFa: "چه کسی آخرین آکورد آکوستیک را نواخت؟",
      options: ["Principal Davis", "The cafeteria cook", "A security guard"],
      correctIndex: 0,
      hintSnippet: "handed his wooden acoustic guitar to Principal Davis",
      clueFa: "آقای مدیر مدرسه گیتار را گرفت و آکورد پیروزی را نواخت.",
    },
    choiceA: {
      labelEn: "Crown the principal as the honorary rock legend of the year!",
      labelFa: "مدیر را اسطوره افتخاری راک سال اعلام کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Sign the guitar pickguard together with all the teachers!",
      labelFa: "صفحه محافظ گیتار را همراه تمام معلمان امضا کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "On the count of three, the whole band and Principal Davis leaped high into the air simultaneously. The school newspaper photographer captured the mid-air jump in crystal perfection.",
    keywords: [{ word: "simultaneously", meaningFa: "به طور همزمان و در یک لحظه", phonetic: "/ˌsɪmlˈteɪniəsli/" }],
    question: {
      promptEn: "What did the school photographer capture?",
      promptFa: "عکاس روزنامه مدرسه چه صحنه‌ای را ثبت کرد؟",
      options: ["The mid-air jump in crystal perfection", "Someone dropping a drink", "An empty hallway"],
      correctIndex: 0,
      hintSnippet: "captured the mid-air jump in crystal perfection",
      clueFa: "پرش معلق در هوای همه را با کیفیت عالی ثبت کرد.",
    },
    choiceA: {
      labelEn: "Put the mid-air jump photo on the front page of the yearbook!",
      labelFa: "عکس پرش هوایی را روی جلد سالنامه مدرسه چاپ کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Frame the picture and hang it outside the main music hall!",
      labelFa: "عکس را قاب کرده و ورودی سالن موسیقی نصب کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Sam, Maya, and Leo froze completely motionless in dramatic rock star poses under the white spotlight. The contrast between total freeze and previous chaos brought the house down.",
    keywords: [{ word: "motionless", meaningFa: "کاملاً بی‌حرکت و ساکن", phonetic: "/ˈməʊʃnləs/" }],
    question: {
      promptEn: "What pose did the band strike under the spotlight?",
      promptFa: "اعضای گروه زیر نور چه ژستی گرفتند؟",
      options: ["Dramatic rock star poses completely motionless", "Sitting on chairs reading books", "Pretending to sleep"],
      correctIndex: 0,
      hintSnippet: "froze completely motionless in dramatic rock star poses",
      clueFa: "ژست ستاره‌های راک گرفتند و بی‌حرکت ماندند.",
    },
    choiceA: {
      labelEn: "Break the freeze with a synchronized bow and big smiles!",
      labelFa: "مجسمه را با تعظیم هماهنگ و لبخندهای پهن بشکنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Let Beat-Bot break the freeze by waving a tiny victory flag!",
      labelFa: "بگذارید بیت‌بات با تکان دادن پرچم کوچک سکوت را بشکند!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Two harmless golden sparkler showers flared from Beat-Bot's copper shoulders, framing the band in a breathtaking fountain of golden light as the final cymbal echoed.",
    keywords: [{ word: "sparkler", meaningFa: "فشفشه‌های درخشان جرقه‌ای", phonetic: "/ˈspɑːklə/" }],
    question: {
      promptEn: "What came out of Beat-Bot's copper shoulders?",
      promptFa: "چه چیزی از شانه‌های مسی بیت‌بات فوران کرد؟",
      options: ["Two harmless golden sparkler showers", "A jet of black oil", "Cold blue ice water"],
      correctIndex: 0,
      hintSnippet: "Two harmless golden sparkler showers flared from Beat-Bot's copper shoulders",
      clueFa: "فوران جرقه‌های طلایی درخشان و بی‌خطر بود.",
    },
    choiceA: {
      labelEn: "Step through the golden light to receive the First Place Trophy!",
      labelFa: "از میان نورهای طلایی برای گرفتن جام قهرمانی اول قدم بردارید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Salute the crowd as the golden light fades to warm amber!",
      labelFa: "با غروب نور طلایی به جمعیت پرشور دست تکان دهید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "Sam, Maya, and Leo gathered the ribbons, weaving a bright canopy across their instruments. Beat-Bot stood in the center, glowing like a friendly carnival mascot.",
    keywords: [{ word: "canopy", meaningFa: "سایه بان و سقف تزیینی", phonetic: "/ˈkænəpi/" }],
    question: {
      promptEn: "What did the band weave with the ribbons?",
      promptFa: "گروه با روبان‌ها چه چیزی بافتند؟",
      options: ["A bright canopy across their instruments", "A heavy rope bridge", "A basketball net"],
      correctIndex: 0,
      hintSnippet: "weaving a bright canopy across their instruments",
      clueFa: "یک سایه‌بان تزیینی و شاد بالای سازها بافتند.",
    },
    choiceA: {
      labelEn: "Invite all other contestants to join under the ribbon canopy!",
      labelFa: "تمام شرکت‌کنندگان دیگر را به زیر سایه‌بان جشن دعوت کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Present the colorful ribbon canopy to the kindergarten visitors!",
      labelFa: "روبان‌های رنگین را به کودکان پیش‌دبستانی مهمان هدیه دهید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Beat-Bot snapped its wooden arm to its forehead in a snappy military salute, clicking its heels with comical precision. The crowd burst into loud applause and cheer.",
    keywords: [{ word: "salute", meaningFa: "احترام نظامی", phonetic: "/səˈluːt/" }],
    question: {
      promptEn: "How did Beat-Bot salute the crowd?",
      promptFa: "بیت‌بات چطور به تماشاگران ادای احترام کرد؟",
      options: ["Snapped its wooden arm to its forehead in a snappy salute", "Fell onto its face", "Turned off its battery"],
      correctIndex: 0,
      hintSnippet: "snapped its wooden arm to its forehead in a snappy military salute",
      clueFa: "دست چوبی‌اش را به نشانه احترام نظامی بالای پیشانی برد.",
    },
    choiceA: {
      labelEn: "Offer Beat-Bot a shiny brass medal for exceptional service!",
      labelFa: "یک مدال برنجی شجاعت برای خدمت استثنایی به گردن بیت‌بات بیندازید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Name Beat-Bot the official school robotics mascot for the year!",
      labelFa: "بیت‌بات را به عنوان نماد رسمی رباتیک سال مدرسه معرفی کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Three massive final chords resonated through the auditorium in perfect, jaw-dropping synchronization. Every single judge stood up, applauding with both hands held high.",
    keywords: [{ word: "synchronization", meaningFa: "هماهنگی و همزمانی بی‌نقص", phonetic: "/ˌsɪŋkrənaɪˈzeɪʃn/" }],
    question: {
      promptEn: "What did the judges do after the three synchronized chords?",
      promptFa: "داوران بعد از سه آکورد هماهنگ چه کردند؟",
      options: ["Every judge stood up, applauding with both hands", "They argued about the score", "They checked their phones"],
      correctIndex: 0,
      hintSnippet: "Every single judge stood up, applauding with both hands held high",
      clueFa: "همه داوران ایستادند و با دو دست بالا تشویق کردند.",
    },
    choiceA: {
      labelEn: "Accept the First Place Grand Trophy from the panel of judges!",
      labelFa: "جام بزرگ مقام اول را با غرور از دست داوران تحویل بگیرید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Dedicate the victory to everyone who loves making things by hand!",
      labelFa: "پیروزی را به تمام دوستداران ساخت وسایل دست‌ساز تقدیم کنید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Sam held his guitar aloft and counted: 'One! Two! Three!' Five hundred people shouted 'THE BEAT BOTS!' with thunderous roar, cementing the band in school folklore.",
    keywords: [{ word: "folklore", meaningFa: "خاطرات ماندگار و افسانه‌های محلی", phonetic: "/ˈfəʊklɔː/" }],
    question: {
      promptEn: "What name did five hundred people shout together?",
      promptFa: "پانصد نفر چه نامی را با هم فریاد زدند؟",
      options: ["THE BEAT BOTS!", "THE QUIET GUYS", "NO MORE SCHOOL"],
      correctIndex: 0,
      hintSnippet: "Five hundred people shouted 'THE BEAT BOTS!' with thunderous roar",
      clueFa: "نام «بیت باتس» را با غرش رعدآسا فریاد زدند.",
    },
    choiceA: {
      labelEn: "Take a triumphant victory lap around the gym with the band!",
      labelFa: "همراه گروه یک دور پیروزی پرشور دور سالن بزنید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Promise to return with an even bigger Beat-Bot next year!",
      labelFa: "قول بدهید سال بعد با یک ربات غول‌پیکرتر برگردید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Silent Masterpiece", titleFa: "شاهکار سکوت و احساس", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان هنرمندانه و ماندگار", climaxEn: "The hall erupts in heartfelt tears and standing ovations as Sam and Maya share an unforgettable smile.", climaxFa: "سالن با اشک شوق و تشویق‌های ایستاده منفجر شد و سام و مایا زیباترین لبخند زندگی‌شان را تجربه کردند.", xpReward: 220 },
  { pathCode: "AAAAB", titleEn: "The Acoustic Salute", titleFa: "احترام گیتار آکوستیک", badgeCategory: "heroic", badgeIcon: "🎸", badgeNameFa: "پایان اصیل و باوقار", climaxEn: "Sam holds his instrument high toward the rafters, sealing a triumph of pure musical craft.", climaxFa: "سام گیتارش را به سمت سقف سالن بالا برد و پیروزی هنر اصیل موسیقی را جشن گرفت.", xpReward: 190 },
  { pathCode: "AAABA", titleEn: "The Bell of True Friendship", titleFa: "زنگوله دوستی جاودان", badgeCategory: "scholar", badgeIcon: "🔔", badgeNameFa: "پایان صمیمی و شیرین", climaxEn: "Beat-Bot's silver chime echoes in hearts long after the stage lights fade.", climaxFa: "صدای زنگوله نقره‌ای بیت‌بات حتی بعد از خاموش شدن چراغ‌های صحنه در قلب‌ها طنین‌انداز ماند.", xpReward: 180 },
  { pathCode: "AAABB", titleEn: "The Teacher's Souvenir", titleFa: "یادگاری استاد موسیقی", badgeCategory: "scholar", badgeIcon: "🎁", badgeNameFa: "پایان پراحترام و عاطفی", climaxEn: "Mr. Henderson keeps the chrome bell on his classroom desk as a symbol of courage.", climaxFa: "آقای هندرسون زنگوله کرومی را روی میزش گذاشت تا نماد شجاعت و خلاقیت دانش‌آموزان باشد.", xpReward: 185 },
  { pathCode: "AABAA", titleEn: "The Judge's Chef Hat", titleFa: "کلاه قنادی داور", badgeCategory: "funny", badgeIcon: "👨‍🍳", badgeNameFa: "پایان طنز و خنده‌دار", climaxEn: "The head judge wears the tin chef hat proudly while handing over the highest score in school history.", climaxFa: "سرداور کلاه حلبی را با افتخار سرش گذاشت و بالاترین نمره تاریخ مسابقه را ثبت کرد.", xpReward: 195 },
  { pathCode: "AABAB", titleEn: "The Trophy and the Tin Hat", titleFa: "جام طلا و کلاه حلبی", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان خاطره‌انگیز", climaxEn: "The official photo of the trophy wearing the tin chef hat becomes the school's most viral post.", climaxFa: "عکس جام قهرمانی با کلاه حلبی به پربازدیدترین تصویر مدرسه در شبکه‌های اجتماعی تبدیل شد.", xpReward: 210 },
  { pathCode: "AABBA", titleEn: "The Young Engineer's Glory", titleFa: "افتخار مهندس جوان", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان انگیزشی و شجاعانه", climaxEn: "Leo receives a special innovation medal from the STEM department for his incredible invention.", climaxFa: "لئو به خاطر اختراع شگفت‌انگیزش مدال طلای نوآوری و مهندسی مدرسه را بر گردن آویخت.", xpReward: 200 },
  { pathCode: "AABBB", titleEn: "Leo's Ten-Second Wisdom", titleFa: "سخنرانی ۱۰ ثانیه‌ای لئو", badgeCategory: "funny", badgeIcon: "🎤", badgeNameFa: "پایان شیرین و بذله‌گو", climaxEn: "Leo's short speech about 'loose screws making great music' becomes the quote of the graduation year.", climaxFa: "جمله لئو درباره اینکه «پیچ‌های شل بهترین موسیقی‌ها رو می‌سازن» به شعار سال مدرسه تبدیل شد.", xpReward: 180 },
  { pathCode: "ABAAA", titleEn: "The Day of Harmony", titleFa: "روز بزرگ همبستگی", badgeCategory: "legendary", badgeIcon: "🌈", badgeNameFa: "پایان افسانه‌ای و مردمی", climaxEn: "The school establishes an annual day of harmony, inspired by five hundred voices singing as one.", climaxFa: "مدرسه به یاد همخوانی ۵۰۰ نفره آن روز، روز سالانه همبستگی و دوستی را نامگذاری کرد.", xpReward: 230 },
  { pathCode: "ABAAB", titleEn: "The Gym Video Phenomenon", titleFa: "موزیک‌ویدئوی دیدنی سالن", badgeCategory: "explorer", badgeIcon: "📹", badgeNameFa: "پایان مدرن و پرطرفدار", climaxEn: "Their spontaneous gym concert video reaches forty thousand views before sunrise.", climaxFa: "ویدئوی کنسرت خودمانی سالن تا صبح فردا بیش از چهل هزار بازدید کسب کرد.", xpReward: 195 },
  { pathCode: "ABABA", titleEn: "The Silver Ribbon Shelf", titleFa: "قفسه روبان‌های نقره‌ای", badgeCategory: "scholar", badgeIcon: "🎀", badgeNameFa: "پایان خاطره‌انگیز و ماندگار", climaxEn: "Silver streamers wind around the first-place plaque in the school showcase for decades.", climaxFa: "روبان‌های نقره‌ای برای دهه‌ها دور تندیس پیروزی در ویترین مدرسه درخشیدند.", xpReward: 185 },
  { pathCode: "ABABB", titleEn: "The Silver Lens Shot", titleFa: "برق نقره‌ای لنز دوربین", badgeCategory: "heroic", badgeIcon: "✨", badgeNameFa: "پایان سینمایی و درخشان", climaxEn: "The glittering ribbon shot wins first place in the state youth photography competition.", climaxFa: "عکس پرتاب روبان‌های نقره‌ای رتبه اول مسابقه عکاسی نوجوانان را از آن خود کرد.", xpReward: 200 },
  { pathCode: "ABBAA", titleEn: "The Mayor's Summer Festival", titleFa: "جشنواره تابستانه شهردار", badgeCategory: "legendary", badgeIcon: "🎪", badgeNameFa: "پایان پرافتخار شهری", climaxEn: "The band is booked as the headline act for the town's Grand Fourth of July Celebration.", climaxFa: "گروه به عنوان اجرای اصلی جشن بزرگ تابستانه شهر روی صحنه مرکزی دعوت شد.", xpReward: 240 },
  { pathCode: "ABBAB", titleEn: "The Mayor's Drumstick Selfie", titleFa: "سلفی شهردار با چوب‌های درام", badgeCategory: "funny", badgeIcon: "📸", badgeNameFa: "پایان خنده‌دار و صمیمی", climaxEn: "The mayor sets the silly Beat-Bot photo as his official city hall avatar.", climaxFa: "شهردار عکس سلفی با چوب‌های درام بیت‌بات را عکس پروفایل رسمی‌اش قرار داد.", xpReward: 190 },
  { pathCode: "ABBBA", titleEn: "The Ceiling of Glory", titleFa: "آسمان افتخار و پیروزی", badgeCategory: "heroic", badgeIcon: "🚀", badgeNameFa: "پایان پرشور و حماسی", climaxEn: "Their final turbo chord leaves the audience roaring with admiration for three solid minutes.", climaxFa: "آکورد انفجاری آخر کاری کرد که سالن سه دقیقه تمام بی‌وقفه فریاد هورا سر دهد.", xpReward: 215 },
  { pathCode: "ABBBB", titleEn: "The Echoing High-Five", titleFa: "صدای دست پیروزی", badgeCategory: "scholar", badgeIcon: "🖐️", badgeNameFa: "پایان رفاقتی و زیبا", climaxEn: "That iconic high-five cements Sam, Maya, and Leo as friends who can conquer any challenge.", climaxFa: "آن دست زدن پیروزی نشان داد دوستی و همدلی از پس هر مشکلی برمی‌آید.", xpReward: 185 },
  { pathCode: "BAAAA", titleEn: "Principal Davis: Rock Legend", titleFa: "آقای مدیر: اسطوره راک", badgeCategory: "funny", badgeIcon: "👑", badgeNameFa: "پایان طنز تاریخی", climaxEn: "Principal Davis is voted the coolest educator in the state thanks to his legendary guitar pose.", climaxFa: "آقای دیویس به عنوان شوخ‌طبع‌ترین و جذاب‌ترین مدیر مدرسه انتخاب شد.", xpReward: 210 },
  { pathCode: "BAAAB", titleEn: "The Signed Pickguard", titleFa: "امضاهای ماندگار روی گیتار", badgeCategory: "scholar", badgeIcon: "🖋️", badgeNameFa: "پایان یادگاری ارزشمند", climaxEn: "Every teacher's signature graces Sam's guitar, turning it into a priceless artifact.", climaxFa: "امضای تمام معلمان روی گیتار سام، این ساز را به باارزش‌ترین یادگاری دوران تحصیل تبدیل کرد.", xpReward: 190 },
  { pathCode: "BAABA", titleEn: "The Cover of the Century", titleFa: "جلد تاریخی سالنامه", badgeCategory: "heroic", badgeIcon: "📰", badgeNameFa: "پایان مطبوعاتی پرشکوه", climaxEn: "The mid-air jump photo becomes the most requested yearbook print in school archives.", climaxFa: "عکس پرش معلق گروه پرطرفدارترین تصویر در بایگانی سالنامه مدرسه شد.", xpReward: 205 },
  { pathCode: "BAABB", titleEn: "The Music Hall of Fame", titleFa: "تالار مشاهیر موسیقی", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان ماندگار و افتخارآفرین", climaxEn: "A glossy framed print of the jump hangs permanently beside portraits of famous alumni.", climaxFa: "قاب عکس پرش پرانرژی گروه در ورودی تالار موسیقی برای همیشه نصب شد.", xpReward: 225 },
  { pathCode: "BABAA", titleEn: "The Synchronized Smile", titleFa: "تعظیم ستاره‌های صحنه", badgeCategory: "scholar", badgeIcon: "🎭", badgeNameFa: "پایان هنری و نمایشی", climaxEn: "The synchronized bow receives a roaring standing ovation from every row in the hall.", climaxFa: "تعظیم هماهنگ گروه تشویق ایستاده و پرشور تمام ردیف‌های سالن را به همراه داشت.", xpReward: 190 },
  { pathCode: "BABAB", titleEn: "Beat-Bot's Victory Pennant", titleFa: "پرچم افتخار بیت‌بات", badgeCategory: "funny", badgeIcon: "🚩", badgeNameFa: "پایان بامزه و خلاق", climaxEn: "Beat-Bot's little victory flag draws thunderous chuckles and wild cheers from the back row.", climaxFa: "پرچم کوچولوی پیروزی در دست بیت‌بات خنده و هورای پرشوری به همراه آورد.", xpReward: 195 },
  { pathCode: "BABBA", titleEn: "The Golden Sparkle Triumph", titleFa: "پیروزی در باران طلا", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان زرین و افسانه‌ای", climaxEn: "Walking through golden sparklers to lift the cup, the band enters school history books.", climaxFa: "عبور از میان باران جرقه‌های طلایی برای بالا بردن جام، نام گروه را در تاریخ مدرسه ثبت کرد.", xpReward: 250 },
  { pathCode: "BABBB", titleEn: "The Amber Glow Farewell", titleFa: "غروب طلایی صحنه", badgeCategory: "heroic", badgeIcon: "🌅", badgeNameFa: "پایان زیبا و احساسی", climaxEn: "The warm amber lights illuminate three friends who triumphed through pure imagination.", climaxFa: "نور گرم صحنه چهره سه دوست صمیمی را روشن کرد که با خلاقیت به اوج رسیدند.", xpReward: 200 },
  { pathCode: "BBAAA", titleEn: "The Contestants' Unity", titleFa: "همبستگی همه رقیبان", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان اخلاقی و ارزشمند", climaxEn: "All eleven competing acts join on stage, sharing hugs and singing together in harmony.", climaxFa: "هر یازده گروه شرکت‌کننده روی صحنه آمدند و نشان دادند رفاقت از رقابت مهم‌تر است.", xpReward: 205 },
  { pathCode: "BBAAB", titleEn: "Gifts for the Little Guests", titleFa: "هدیه روبان‌ها به کودکان", badgeCategory: "funny", badgeIcon: "🎈", badgeNameFa: "پایان مهربانی و بخشندگی", climaxEn: "The young kindergarten kids dance happily with ribbons, making it a festival of smiles.", climaxFa: "بچه‌های کوچک با روبان‌های رنگارنگ رقصیدند و سالن پر از لبخندهای کودکانه شد.", xpReward: 190 },
  { pathCode: "BBABA", titleEn: "Medal of Mechanical Valor", titleFa: "مدال شجاعت مکانیکی", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان پرافتخار برای ربات", climaxEn: "Beat-Bot proudly displays its shiny medal while helping clean up cables backstage.", climaxFa: "بیت‌بات با مدال شجاعتی که به گردن داشت در جمع کردن وسایل پشت صحنه کمک کرد.", xpReward: 195 },
  { pathCode: "BBABB", titleEn: "The Mascot of Endoora High", titleFa: "نماد رباتیک مدرسه", badgeCategory: "legendary", badgeIcon: "🤖", badgeNameFa: "پایان جاودانه در مدرسه", climaxEn: "Beat-Bot sits permanently in the robotics lab, greeting every incoming freshman class.", climaxFa: "بیت‌بات به عنوان نماد رسمی رباتیک مدرسه به تمام دانش‌آموزان جدید خوش‌آمد می‌گوید.", xpReward: 220 },
  { pathCode: "BBBAA", titleEn: "The Grand Trophy of Talent", titleFa: "جام بزرگ استعدادهای برتر", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان فتح قله قهرمانی", climaxEn: "Lifting the heavy bronze cup together, Sam, Maya, and Leo know this is just the beginning.", climaxFa: "با بالا بردن جام برنزین مسابقات، سام و مایا و لئو فهمیدند که این تازه آغاز راهه.", xpReward: 250 },
  { pathCode: "BBBAB", titleEn: "The Makers' Dedication", titleFa: "تقدیم به مخترعان خلاق", badgeCategory: "scholar", badgeIcon: "🛠️", badgeNameFa: "پایان الهام‌بخش و فنی", climaxEn: "Their success inspires twenty new students to build handmade instruments for the science fair.", climaxFa: "پیروزی آنها بیست دانش‌آموز دیگر را ترغیب کرد تا سازهای دست‌ساز خودشان را بسازند.", xpReward: 210 },
  { pathCode: "BBBBA", titleEn: "The Victory Parade", titleFa: "دور افتخار دور سالن", badgeCategory: "heroic", badgeIcon: "🎉", badgeNameFa: "پایان پرشور و حماسی", climaxEn: "Carried on their classmates' shoulders, the band completes the loudest victory parade ever.", climaxFa: "بچه‌ها گروه را روی دوش‌هایشان گذاشتند و پرشورترین دور افتخار را دور سالن رقم زدند.", xpReward: 230 },
  { pathCode: "BBBBB", titleEn: "The Legend of Next Year", titleFa: "وعده دیدار سال آینده", badgeCategory: "legendary", badgeIcon: "🚀", badgeNameFa: "پایان پرامید و هیجان‌انگیز", climaxEn: "The crowd chants for ten minutes, already excited for what Beat-Bot version two will bring.", climaxFa: "تماشاگرها تا ده دقیقه شعار می‌دادند و مشتاقانه منتظر نسخه دوم بیت‌بات در سال آینده بودند.", xpReward: 250 },
];

export const story1TalentShow: AdventureStory = buildAdventureStory({
  id: "b1-talent-show-trouble",
  storyIndex: 1,
  cefr: "B1",
  titleEn: "The Chaotic Talent Show",
  titleFa: "دردسرهای شیرین مسابقه استعدادیابی",
  genre: "comedy",
  genreLabelFa: "😄 طنز و روزمره",
  genreIcon: "😄",
  synopsisEn:
    "Sam and his band enter the community talent show with a quirky handmade robot drummer, but backstage mix-ups cause hilarious panic. Help them improvise across 32 funny endings!",
  synopsisFa:
    "سام و گروهش با یک ربات درام‌نواز دست‌ساز وارد مسابقه استعدادیابی می‌شن، اما شل شدن پیچ‌ها و دود بنفش پشت صحنه، اوضاع رو حسابی قاطی‌پاتی می‌کنه! آیا ماجرا رو نجات می‌دی یا یه سبک راک پرانرژی خلق می‌کنی؟ ۳۲ پایان خنده‌دار و پرماجرا منتظرته!",
  coverImage: "/images/skills/reading/b1-talent-show.webp",
  nodes,
  endings,
});
