import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 5 (B1): Night of the Canyon Flood (شب حادثه در دره طوفانی)
// Genre: Thriller & Rescue (هیجان و نجات‌بخشی)
// CEFR: B1 (Past tenses, passive voice, conditionals, modals, rescue/emergency B1 vocab)
// Characters: Dan (Junior Ranger), Chief Sarah, Lucas & Chloe (campers), Rex (rescue dog)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "A sudden cloudburst had broken over Silver Canyon at dusk, dumping four inches of rain in less than an hour. Dan, a dedicated nineteen-year-old junior park ranger, stood on the muddy canyon rim watching the brown rapids rise menacingly. His radio crackled with Chief Sarah's voice: two high school campers, Lucas and Chloe, were stranded on a narrow sandstone ledge across the swollen river, unable to reach the high ground before darkness fell.",
    keywords: [
      { word: "cloudburst", meaningFa: "بارش ناگهانی شدید و سیل‌آسا", phonetic: "/ˈklaʊdbɜːst/" },
      { word: "rapids", meaningFa: "تندآب‌ها و امواج خروشان رودخانه", phonetic: "/ˈræpɪdz/" },
      { word: "stranded", meaningFa: "گیر افتاده و بی‌پناه در محلی خطرناک", phonetic: "/ˈstrændɪd/" },
      { word: "swollen", meaningFa: "طغیان‌کرده و بالا آمده (آب رودخانه)", phonetic: "/ˈswəʊlən/" },
    ],
    question: {
      promptEn: "Why were Lucas and Chloe unable to escape from the sandstone ledge?",
      promptFa: "چرا لوکاس و کلوئی نتوانستند از صخره شنی خارج شوند؟",
      options: [
        "Because the swollen river rapids trapped them before darkness fell",
        "Because they forgot where they parked their bicycles",
        "Because their tent blew away in the wind",
      ],
      correctIndex: 0,
      hintSnippet: "were stranded on a narrow sandstone ledge across the swollen river, unable to reach the high ground",
      clueFa: "خط آخر رو نگاه کن دوست خوبم؛ طغیان رودخانه و امواج خروشان راه برگشت رو بست.",
    },
    choiceA: {
      labelEn: "Launch the inflatable swiftwater rescue raft into the foaming rapids!",
      labelFa: "قایق بادی نجات ویژه آب‌های خروشان رو به دل امواج کف‌آلود بنداز!",
      descriptionFa: "پاروزنان ماهر می‌تونن با سرعت به اون سمت رودخونه برسن.",
    },
    choiceB: {
      labelEn: "Rig a high-tension cable zip-line across the seventy-foot gorge!",
      labelFa: "طناب و کابل نجات هوایی (زیپ‌لاین) رو محکم روی دهانه دره نصب کن!",
      descriptionFa: "راه هوایی بدون نیاز به برخورد با امواج وحشی رودخانه.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Dan zipped his fluorescent orange life vest, grabbed the carbon-fiber oars, and pushed the reinforced raft into the surging current. Alongside him was Rex, the ranger patrol's fearless German shepherd, wearing a flotation harness. Navigating sharp boulders by the beam of his headlamp, Dan expertly guided the raft through swirling whirlpools until they safely pulled up onto the campers' rocky ledge.",
    keywords: [
      { word: "fluorescent", meaningFa: "شب‌رنگ و بسیار درخشان", phonetic: "/ˌflɔːˈresnt/" },
      { word: "harness", meaningFa: "کمربند و مهار ایمنی مخصوص نجات", phonetic: "/ˈhɑːnɪs/" },
      { word: "whirlpools", meaningFa: "گرداب‌های چرخان خطرناک آب", phonetic: "/ˈwɜːlpuːlz/" },
      { word: "oars", meaningFa: "پاروهای مقاوم قایق", phonetic: "/ɔːz/" },
    ],
    question: {
      promptEn: "What was Rex the German shepherd wearing during the boat crossing?",
      promptFa: "سگ نژاد ژرمن شپرد (رکس) هنگام عبور قایق چه بر تن داشت؟",
      options: [
        "A flotation harness",
        "A heavy winter coat",
        "A pair of plastic sunglasses",
      ],
      correctIndex: 0,
      hintSnippet: "wearing a flotation harness",
      clueFa: "خط دوم رو ببین عزیزم؛ جلیقه و مهار ایمنی نجات شناور بر تن داشت.",
    },
    choiceA: {
      labelEn: "Wrap the shivering campers in thermal blankets and load them aboard!",
      labelFa: "نوجوانان لرزان رو در پتوهای حرارتی نجات بپیچ و سوار قایق کن!",
      descriptionFa: "گرم نگه‌داشتن بدن اون‌ها در سرمای شب اولویت اوله.",
    },
    choiceB: {
      labelEn: "Scout the rock wall for an elevated emergency dry ledge to wait for daybreak!",
      labelFa: "دیواره صخره رو برای پیدا کردن تاقچه سنگی خشک و مرتفع‌تر بررسی کن!",
      descriptionFa: "اگه امواج خیلی شدید بشن شاید تا صبح موندن در جای امن بهتر باشه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Dan loaded the heavy pneumatic line-launcher, aimed carefully at a sturdy pine trunk on the opposite cliff, and pulled the trigger. With a sharp crack, the weighted line soared through the storm and anchored securely around the tree. Dan tightened the pulley harness on his side, anchoring the main tension cable to a reinforced steel eyelet set into the granite cliff.",
    keywords: [
      { word: "pneumatic", meaningFa: "پنوماتیک و با فشار باد کار کننده", phonetic: "/njuːˈmætɪk/" },
      { word: "pulley", meaningFa: "قرقره مکانیکی بالابر و انتقال", phonetic: "/ˈpʊli/" },
      { word: "eyelet", meaningFa: "حلقه فلزی محکم مهار کابل در سنگ", phonetic: "/ˈaɪlət/" },
      { word: "soared", meaningFa: "به پرواز درآمد و اوج گرفت", phonetic: "/sɔːd/" },
    ],
    question: {
      promptEn: "What did the pneumatic line-launcher anchor the cable to across the cliff?",
      promptFa: "طناب‌انداز بادی کابل را به چه چیزی در آن سوی صخره مهار کرد؟",
      options: [
        "A sturdy pine trunk on the opposite cliff",
        "A small bush of berries",
        "A wooden picnic table",
      ],
      correctIndex: 0,
      hintSnippet: "anchored securely around a sturdy pine trunk on the opposite cliff",
      clueFa: "خط دوم رو بخون؛ دور تنه تنومند یک درخت کاج در صخره مقابل محکم شد.",
    },
    choiceA: {
      labelEn: "Send a rescue harness basket across the cable to retrieve Chloe first!",
      labelFa: "سبد نجات متحرک رو با کابل به اون سمت بفرست تا اول کلوئی رو بیاره!",
      descriptionFa: "سبد ایمن‌ترین وسیله برای عبور از بالای آب‌های خروشان است.",
    },
    choiceB: {
      labelEn: "Clip into the line and slide across to guide both campers personally!",
      labelFa: "خودت به کابل وصل شو و سر بخور تا شخصاً هر دو رو هدایت کنی!",
      descriptionFa: "حضور مستقیم نجاتگر شجاعت و اعتمادبه‌نفس بالایی به اون‌ها میده.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Lucas and Chloe climbed into the center of the raft, clinging tightly to the perimeter safety ropes. Rex rested his head on Chloe's lap, instantly soothing her trembling hands. Dan pushed off into the surging river, steering along the calmer eddy current near the canyon wall. However, five hundred yards downstream, a fallen cottonwood tree had jammed between two boulders, partially blocking the exit channel.",
    keywords: [
      { word: "perimeter", meaningFa: "پیرامون و لبه بیرونی قایق", phonetic: "/pəˈrɪmɪtə/" },
      { word: "eddy", meaningFa: "گردابک آرام و جریان برگشتی ملایم آب", phonetic: "/ˈedi/" },
      { word: "cottonwood", meaningFa: "درخت صنوبر و سپیدار بلند ساحلی", phonetic: "/ˈkɒtnwʊd/" },
    ],
    question: {
      promptEn: "What was blocking the exit channel five hundred yards downstream?",
      promptFa: "در پانصد متری پایین‌دست چه چیزی مسیر خروجی رودخانه را مسدود کرده بود؟",
      options: [
        "A fallen cottonwood tree jammed between two boulders",
        "A concrete water dam",
        "A sunken fisherman's rowboat",
      ],
      correctIndex: 0,
      hintSnippet: "a fallen cottonwood tree had jammed between two boulders, partially blocking the exit channel",
      clueFa: "خط آخر رو نگاه کن؛ تنه یک درخت صنوبر افتاده بین دو تخته‌سنگ گیر کرده بود.",
    },
    choiceA: {
      labelEn: "Steer hard toward the narrow left chute to shoot past the tree branches!",
      labelFa: "با قدرت به سمت کانال باریک سمت چپ پارو بزن تا از کنار شاخه‌ها رد بشی!",
      descriptionFa: "مهارت سریع در مانور قایق در آب‌های خروشان.",
    },
    choiceB: {
      labelEn: "Pull into a sheltered gravel cove to portage around the fallen tree!",
      labelFa: "قایق رو به ساحل شنی امن پهلو بده تا پیاده از کنار مانع رد بشید!",
      descriptionFa: "ایمنی اول؛ پیاده روی در ساحل از واژگونی قایق جلوگیری می‌کنه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Dan shone his spotlight upward, spotting an expansive dry cavern ledge twenty feet above the highest flood waterline. Rex bounded up the stone steps, finding a natural windbreak protected by an overhanging granite arch. Dan assisted the teenagers up the natural staircase, lighting two emergency heat flares that filled the cozy shelter with cheerful red warmth.",
    keywords: [
      { word: "expansive", meaningFa: "فراخ، پهناور و جادار", phonetic: "/ɪkˈspænsɪv/" },
      { word: "windbreak", meaningFa: "بادگیر طبیعی و پناهگاه در برابر باد", phonetic: "/ˈwɪndbreɪk/" },
      { word: "flares", meaningFa: "مشعل‌های منور نورانی و گرمادهنده امدادی", phonetic: "/fleəz/" },
    ],
    question: {
      promptEn: "How many feet above the flood waterline was the dry cavern ledge?",
      promptFa: "تاقچه غاری خشک چند فوت بالاتر از خط آب سیلاب قرار داشت؟",
      options: [
        "Twenty feet above the highest flood waterline",
        "Only one inch above the mud",
        "Over a thousand feet high",
      ],
      correctIndex: 0,
      hintSnippet: "spotting an expansive dry cavern ledge twenty feet above the highest flood waterline",
      clueFa: "خط اول رو ببین دوست من؛ بیست فوت بالاتر از بالاترین خط سیل قرار داشت.",
    },
    choiceA: {
      labelEn: "Transmit your exact cavern coordinates to the rescue helicopter team!",
      labelFa: "مختصات دقیق پناهگاه غاری رو برای تیم هلیکوپتر نجات مخابره کن!",
      descriptionFa: "روشنایی منورهای قرمز موقعیت شما رو از آسمان نشان میده.",
    },
    choiceB: {
      labelEn: "Brew hot emergency cocoa and share heartwarming camp stories!",
      labelFa: "کاکائوی داغ امدادی درست کن و با گفتن خاطرات گرم به بچه‌ها روحیه بده!",
      descriptionFa: "روحیه و گرمای بدن بچه‌ها با هات‌چاکلت داغ بازمی‌گرده.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "The rescue basket zipped smoothly along the tension cable, hovering fifty feet above the foaming torrent. Chloe stepped inside with courage, securing her chest buckle. Dan cranked the mechanical retrieval winch on his side, drawing the basket smoothly across the chasm. Within two minutes, Chloe was safe on the mainland, wrapped in Chief Sarah's heavy wool jacket.",
    keywords: [
      { word: "chasm", meaningFa: "پرتگاه و شکاف عمیق بین دو کوه", phonetic: "/ˈkæzəm/" },
      { word: "retrieval", meaningFa: "بازیابی و برگرداندن به جای امن", phonetic: "/rɪˈtriːvl/" },
      { word: "winch", meaningFa: "وینچ و بالابر مکانیکی کابل", phonetic: "/wɪntʃ/" },
    ],
    question: {
      promptEn: "How many minutes did it take to retrieve Chloe across the gorge?",
      promptFa: "انتقال کلوئی از روی دره با سبد بالابر چند دقیقه طول کشید؟",
      options: [
        "Within two minutes",
        "Nearly four hours",
        "Over thirty minutes",
      ],
      correctIndex: 0,
      hintSnippet: "Within two minutes, Chloe was safe on the mainland",
      clueFa: "خط آخر رو نگاه کن؛ فقط در دو دقیقه به ساحل امن رسید.",
    },
    choiceA: {
      labelEn: "Immediately reel the basket back across to rescue Lucas!",
      labelFa: "فوراً سبد نجات رو به اون سمت بفرست تا لوکاس رو هم به این طرف بیاری!",
      descriptionFa: "هر ثانیه قبل از بالا آمدن بیشتر آب حیاتی است.",
    },
    choiceB: {
      labelEn: "Inspect the cable tension bolts to ensure maximum safety before the second run!",
      labelFa: "پیچ‌ها و کشش کابل رو چک کن تا ایمنی کامل قبل از پرواز دوم تضمین بشه!",
      descriptionFa: "کابل زیر وزن نفر اول کشیده شده و باید بازرسی بشه.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Dan clicked his heavy steel carabiner onto the cable pulley, stepped backward off the edge, and zipped through the roaring mist like an eagle. He landed softly beside Lucas and Chloe on the ledge. His calm, reassuring smile brought tears of relief to both teenagers. 'Ranger Dan at your service,' he smiled warmly. 'Let us get you home to dry socks and hot soup.'",
    keywords: [
      { word: "carabiner", meaningFa: "کارابین و قلاب فولادی قفل‌شونده کوهنوردی", phonetic: "/ˌkærəˈbiːnə/" },
      { word: "reassuring", meaningFa: "آرامش‌بخش و اطمینان‌دهنده", phonetic: "/ˌriːəˈʃɔːrɪŋ/" },
      { word: "relief", meaningFa: "آسودگی خاطر و رهایی از اضطراب", phonetic: "/rɪˈliːf/" },
    ],
    question: {
      promptEn: "What brought tears of relief to both teenagers on the ledge?",
      promptFa: "چه چیزی باعث اشک شوق و آسودگی هر دو نوجوان شد؟",
      options: [
        "Dan's calm, reassuring smile and arrival",
        "A thunderbolt hitting a rock",
        "Finding an empty water bottle",
      ],
      correctIndex: 0,
      hintSnippet: "His calm, reassuring smile brought tears of relief to both teenagers",
      clueFa: "خط سوم رو ببین عزیزم؛ لبخند آرامش‌بخش و حضور گرم و شجاعانه دن.",
    },
    choiceA: {
      labelEn: "Rig a tandem harness so you can escort Lucas and Chloe together!",
      labelFa: "یک مهار دوبل ببند تا هر دو نوجوان رو همزمان با خودت همراهی کنی!",
      descriptionFa: "هیچ‌کدام حتی یک ثانیه دیگر تنها نمی‌مانند.",
    },
    choiceB: {
      labelEn: "Attach an emergency radio beacon to the ledge to guide the patrol boat!",
      labelFa: "یک فرستنده اضطراری رادیویی روی صخره نصب کن تا قایق گشت به راحتی برسه!",
      descriptionFa: "سیگنال رادیویی برای پشتیبانی عملیات امداد.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Dan dug his oars deep, pulling the raft into the fast chute with razor-sharp timing. The raft shot past the tangled cottonwood branches with inches to spare, bursting out into the broad, tranquil waters of Silver Lake where three patrol boats were waiting with bright searchlights.",
    keywords: [
      { word: "chute", meaningFa: "آبراهه باریک و پرسرعت طبیعی", phonetic: "/ʃuːt/" },
      { word: "tranquil", meaningFa: "آرام، بی‌خروش و امن", phonetic: "/ˈtræŋkwɪl/" },
      { word: "searchlights", meaningFa: "پروژکتورهای نورافکن جستجو", phonetic: "/ˈsɜːtʃlaɪts/" },
    ],
    question: {
      promptEn: "Where did the raft burst out after clearing the branches?",
      promptFa: "قایق پس از عبور از کنار شاخه‌ها وارد چه منطقه‌ای شد؟",
      options: [
        "The broad, tranquil waters of Silver Lake",
        "A dark underwater tunnel",
        "A rocky dry desert",
      ],
      correctIndex: 0,
      hintSnippet: "bursting out into the broad, tranquil waters of Silver Lake",
      clueFa: "خط ماقبل آخر رو بخون؛ وارد آب‌های آرام و پهناور دریاچه نقره‌ای شد.",
    },
    choiceA: {
      labelEn: "Pull alongside Chief Sarah's flagship patrol boat to a hero's welcome!",
      labelFa: "قایق رو کنار قایق پرچمدار رئیس سارا ببر تا مورد تشویق همه قرار بگیری!",
      descriptionFa: "پایان پیروزمندانه عملیات نجات در دریاچه.",
    },
    choiceB: {
      labelEn: "Deliver the shivering teens directly to the lakeside heated medical yurt!",
      labelFa: "نوجوان‌ها رو مستقیم به چادر درمانی گرم‌شده اسکله هدایت کن!",
      descriptionFa: "معاینه پزشکی فوری و نوشیدن سوپ گرم.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "They beached the raft on a gentle gravel bar and portaged sixty yards along the sandy cliff base, bypassing the fallen tree completely. Dan carried Chloe on his shoulders while Lucas held Rex's harness. When they relaunched, the river opened into calm lake shallows with the storm clouds parting above.",
    keywords: [
      { word: "portaged", meaningFa: "حمل زمینی قایق برای دور زدن موانع آبی", phonetic: "/ˈpɔːtɪdʒd/" },
      { word: "shallows", meaningFa: "بخش‌های کم‌عمق آب", phonetic: "/ˈʃæləʊz/" },
      { word: "parting", meaningFa: "کنار رفتن ابرها و باز شدن آسمان", phonetic: "/ˈpɑːtɪŋ/" },
    ],
    question: {
      promptEn: "Who did Dan carry on his shoulders while portaging along the cliff base?",
      promptFa: "دن در حین حمل قایق در ساحل چه کسی را روی شانه‌هایش حمل کرد؟",
      options: [
        "Chloe",
        "Chief Sarah",
        "A heavy iron stove",
      ],
      correctIndex: 0,
      hintSnippet: "Dan carried Chloe on his shoulders while Lucas held Rex's harness",
      clueFa: "خط دوم رو ببین؛ کلوئی را روی شانه‌هایش حمل کرد.",
    },
    choiceA: {
      labelEn: "Build a victory bonfire on the gravel beach to warm the whole crew!",
      labelFa: "یک آتش بزرگ پیروزی در ساحل شنی روشن کن تا همه گرم بشن!",
      descriptionFa: "شعله‌های پرشور در دل تاریکی شب.",
    },
    choiceB: {
      labelEn: "Signal the ranger rescue helicopter with your high-lumen strobe!",
      labelFa: "با چراغ استروب پرقدرتت به هلیکوپتر نجات محیط‌بانی علامت بده!",
      descriptionFa: "فرود هلی‌کوپتر در ساحل امن برای بازگرداندن بچه‌ها.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Hearing the twin turbine thrum of the search helicopter, Dan waved his infrared beacon. The chopper hovered gracefully over the canyon chasm, lowering a paramedic in a rescue hoist right onto their cavern shelf. Within minutes, both teenagers and Rex were securely strapped into the helicopter cabin.",
    keywords: [
      { word: "turbine", meaningFa: "موتورهای توربینی هلیکوپتر", phonetic: "/ˈtɜːbaɪn/" },
      { word: "infrared", meaningFa: "فروسرخ و مادون قرمز دید در شب", phonetic: "/ˌɪnfrəˈred/" },
      { word: "paramedic", meaningFa: "امدادگر فوریت‌های پزشکی", phonetic: "/ˌpærəˈmedɪk/" },
    ],
    question: {
      promptEn: "How was the paramedic lowered onto the cavern shelf?",
      promptFa: "امدادگر چطور روی تاقچه غاری فرود آمد؟",
      options: [
        "Lowered in a rescue hoist from the helicopter",
        "Climbed up with a rope ladder from below",
        "Parachuted from an airplane",
      ],
      correctIndex: 0,
      hintSnippet: "lowering a paramedic in a rescue hoist right onto their cavern shelf",
      clueFa: "خط دوم رو بخون؛ با بالابر مخصوص نجات از هلیکوپتر فرود آمد.",
    },
    choiceA: {
      labelEn: "Climb aboard the chopper for a breathtaking night flight to headquarters!",
      labelFa: "سوار هلیکوپتر شو تا پرواز شبانه دیدنی به مقر فرماندهی رو تجربه کنی!",
      descriptionFa: "نمای خیره‌کننده دره نقره‌ای از پنجره‌های هلیکوپتر.",
    },
    choiceB: {
      labelEn: "Salute the departing helicopter as you guide the support boat back!",
      labelFa: "با احترام به هلیکوپتر دست تکان بده و قایق گشت رو به اسکله بازگردان!",
      descriptionFa: "مسئولیت‌پذیری تا بازگرداندن آخرین تجهیزات به پایگاه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Inside the warm dry shelter of the cavern, the hot cocoa worked wonders. Lucas and Chloe smiled through tears of relief, petting Rex as Dan checked their vital signs. By two in the morning, the rain had stopped completely, and the raging river had dropped six feet back to its normal channels.",
    keywords: [
      { word: "vital", meaningFa: "علائم حیاتی بدن مانند ضربان قلب و تنفس", phonetic: "/ˈvaɪtl/" },
      { word: "raging", meaningFa: "خشمگین و پرخروش", phonetic: "/ˈreɪdʒɪŋ/" },
      { word: "wonder", meaningFa: "معجزه و اثر فوق‌العاده", phonetic: "/ˈwʌndə/" },
    ],
    question: {
      promptEn: "By what time had the rain stopped and the river dropped six feet?",
      promptFa: "تا چه ساعتی باران قطع شد و آب رودخانه شش فوت پایین آمد؟",
      options: [
        "By two in the morning",
        "At noon the next week",
        "It never stopped raining",
      ],
      correctIndex: 0,
      hintSnippet: "By two in the morning, the rain had stopped completely",
      clueFa: "خط ماقبل آخر رو ببین؛ تا ساعت دو بامداد باران کاملاً متوقف شد.",
    },
    choiceA: {
      labelEn: "Walk down the drained riverbed trail at first light under the morning sun!",
      labelFa: "در اولین پرتوهای خورشید صبحگاهی از بستر خشک‌شده رودخانه عبور کنید!",
      descriptionFa: "طلوع دل‌انگیز آفتاب بر دره نقره‌ای پس از شبی پرحادثه.",
    },
    choiceB: {
      labelEn: "Celebrate sunrise by cooking fresh pancakes on Dan's portable camping stove!",
      labelFa: "طلوع خورشید رو با پختن پنکیک‌های گرم روی اجاق مسافرتی جشن بگیرید!",
      descriptionFa: "بوی عطر پنکیک و چای در هوای تازه کوهستان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Dan cranked the winch handle with steady rhythm as Lucas stepped into the basket. The cable glided smoothly above the foaming torrent. Chief Sarah caught the basket on the cliff rim, hugging Lucas tightly as the boy whispered: 'Your rangers are true guardian angels!'",
    keywords: [
      { word: "handle", meaningFa: "دسته اهرم مکانیکی چرخشی", phonetic: "/ˈhændl/" },
      { word: "guardian", meaningFa: "نگهبان و حامی فداکار", phonetic: "/ˈɡɑːdiən/" },
      { word: "angels", meaningFa: "فرشتگان نجات", phonetic: "/ˈeɪndʒlz/" },
    ],
    question: {
      promptEn: "What did Lucas whisper when Chief Sarah caught the basket?",
      promptFa: "وقتی رئیس سارا سبد را گرفت، لوکاس زیر لب چه گفت؟",
      options: [
        "'Your rangers are true guardian angels!'",
        "'I want to go back and swim'",
        "'Where is my homework?'",
      ],
      correctIndex: 0,
      hintSnippet: "whispered: 'Your rangers are true guardian angels!'",
      clueFa: "خط آخر رو نگاه کن؛ گفت: «محیط‌بانان شما فرشتگان واقعی نجات هستند!».",
    },
    choiceA: {
      labelEn: "Reunite Lucas with his sister Chloe under the rescue pavilion!",
      labelFa: "لوکاس و خواهرش کلوئی رو زیر سایه‌بان امداد به آغوش هم برسون!",
      descriptionFa: "لحظاتی عاطفی و سرشار از اشک شوق دیدار.",
    },
    choiceB: {
      labelEn: "Award Dan the Silver Star of Coastal Park Valor in an impromptu ceremony!",
      labelFa: "نشان ستاره نقره‌ای شجاعت پارک رو در مراسمی صمیمانه به دن اهدا کن!",
      descriptionFa: "تقدیر رسمی از نجاتگری که در دل طوفان درخشید.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Dan checked the steel bolts and torque pins, discovering that vibration had loosened one retaining nut by two turns. He quickly torqued it down with his heavy ratchet wrench, securing the system just before Lucas climbed aboard for a completely smooth and flawless evacuation.",
    keywords: [
      { word: "torque", meaningFa: "پیچاندن و سفت کردن دقیق مهره‌ها با گشتاورسنج", phonetic: "/tɔːk/" },
      { word: "ratchet", meaningFa: "آچار جغجغه‌ای صنعتی", phonetic: "/ˈrætʃɪt/" },
      { word: "evacuation", meaningFa: "تخلیه اضطراری به مکان امن", phonetic: "/ɪˌvækjuˈeɪʃn/" },
    ],
    question: {
      promptEn: "What tool did Dan use to securely tighten the retaining nut?",
      promptFa: "دن با چه ابزاری مهره مهار کابل را محکم کرد؟",
      options: [
        "His heavy ratchet wrench",
        "A plastic butter knife",
        "A piece of wooden stick",
      ],
      correctIndex: 0,
      hintSnippet: "quickly torqued it down with his heavy ratchet wrench",
      clueFa: "خط دوم رو بخون؛ با آچار جغجغه‌ای سنگینش پیچ را محکم کرد.",
    },
    choiceA: {
      labelEn: "Send Lucas safely across the fully reinforced cable zip-line!",
      labelFa: "لوکاس را با خیال راحت از کابل تقویت‌شده به آن سمت بفرست!",
      descriptionFa: "عملیاتی بی‌نقص و ۱۰۰٪ ایمن.",
    },
    choiceB: {
      labelEn: "Document the preventive maintenance procedure for the ranger training manual!",
      labelFa: "این اقدام پیشگیرانه هوشمندانه رو در کتابچه آموزش محیط‌بانان ثبت کن!",
      descriptionFa: "نکته‌ای حیاتی برای نجات جان انسان‌ها در آینده.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "With Dan holding both teenagers securely in the reinforced tandem harness, the trio soared across the canyon chasm in a single graceful glide. Chief Sarah and five paramedics caught them smoothly, wrapping everyone in warm fleece blankets to thunderous applause.",
    keywords: [
      { word: "tandem", meaningFa: "دوبل و متصل به هم", phonetic: "/ˈtændəm/" },
      { word: "glide", meaningFa: "پرواز سرخورنده و آرام در هوا", phonetic: "/ɡlaɪd/" },
      { word: "fleece", meaningFa: "پشم پولار گرم و سبک", phonetic: "/fliːs/" },
    ],
    question: {
      promptEn: "How did Dan and the teenagers cross the canyon chasm together?",
      promptFa: "دن و نوجوانان چطور با هم از روی دره عبور کردند؟",
      options: [
        "In a single graceful glide using a reinforced tandem harness",
        "By swimming through the bottom rocks",
        "By jumping onto a tree branch",
      ],
      correctIndex: 0,
      hintSnippet: "soared across the canyon chasm in a single graceful glide",
      clueFa: "خط اول رو ببین؛ با مهار دوبل تقویت‌شده در یک پرواز آرام و باشکوه.",
    },
    choiceA: {
      labelEn: "Lead the teenagers to their parents waiting anxiously at the visitor center!",
      labelFa: "نوجوان‌ها رو به آغوش پدر و مادر نگرانشون در مرکز بازدیدکنندگان ببر!",
      descriptionFa: "پایان شیرین ساعت‌ها انتظار و نگرانی خانواده.",
    },
    choiceB: {
      labelEn: "Take a heroic group photo with Rex wearing his ranger medal!",
      labelFa: "یک عکس یادگاری حماسی همراه رکس و مدال شجاعتش بگیرید!",
      descriptionFa: "تصویری افتخارآفرین که در صفحه اول روزنامه چاپ می‌شه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "The emergency radio beacon pulsed a high-frequency chirp that guided the county patrol boat straight to the canyon entrance. Within five minutes, twin searchlights illuminated the ledge, and four swiftwater experts hauled everyone aboard their heavy fiberglass patrol cutter.",
    keywords: [
      { word: "chirp", meaningFa: "صدای پالس منظم فرستنده رادیویی", phonetic: "/tʃɜːp/" },
      { word: "illuminated", meaningFa: "روشن کرد و نورافشانی نمود", phonetic: "/ɪˈluːmɪneɪtɪd/" },
      { word: "cutter", meaningFa: "قایق گشتی سنگین و تندرو", phonetic: "/ˈkʌtə/" },
    ],
    question: {
      promptEn: "What kind of boat arrived guided by the emergency radio beacon?",
      promptFa: "چه نوع قایقی با هدایت فرستنده رادیویی به محل رسید؟",
      options: [
        "A heavy fiberglass patrol cutter",
        "A wooden rowboat with broken oars",
        "A small rubber kayak",
      ],
      correctIndex: 0,
      hintSnippet: "hauled everyone aboard their heavy fiberglass patrol cutter",
      clueFa: "خط آخر رو نگاه کن؛ قایق گشتی سنگین فایبرگلاس نجات.",
    },
    choiceA: {
      labelEn: "Escort the patrol boat through the clearing storm back to the marina!",
      labelFa: "قایق گشتی رو در هوای صاف‌شده به سمت اسکله تفریحی هدایت کن!",
      descriptionFa: "بازگشت پر از آرامش به بندرگاه.",
    },
    choiceB: {
      labelEn: "Hold an emergency debriefing with Chief Sarah to praise team coordination!",
      labelFa: "جلسه ارزیابی فوری با رئیس سارا برای ستایش هماهنگی بی‌نقص تیم برگزار کن!",
      descriptionFa: "بررسی موفقیت چشمگیر عملیات بدون کوچکترین حادثه.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Arriving at the marina docks, Dan was lifted onto the shoulders of fellow rangers while Chief Sarah pinned the Silver Cross of Heroism to his orange jacket.",
    keywords: [{ word: "heroism", meaningFa: "قهرمانی، شجاعت و فداکاری بزرگ", phonetic: "/ˈherəʊɪzəm/" }],
    question: {
      promptEn: "What medal did Chief Sarah pin to Dan's orange jacket?",
      promptFa: "رئیس سارا چه مدالی را بر جلیقه نارنجی دن نصب کرد؟",
      options: ["The Silver Cross of Heroism", "A chocolate coin", "A plastic name tag"],
      correctIndex: 0,
      hintSnippet: "pinned the Silver Cross of Heroism to his orange jacket",
      clueFa: "مدال صلیب نقره‌ای شجاعت و قهرمانی.",
    },
    choiceA: {
      labelEn: "Give an inspiring speech about dedication to protecting human life!",
      labelFa: "سخنرانی امیدبخشی درباره تعهد به نجات جان انسان‌ها ایراد کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Present Rex with a gold-plated ranger rescue bone at the ceremony!",
      labelFa: "استخوان طلایی افتخاری نجات را به رکس هدیه دهید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "Inside the cozy yurt, the doctor confirmed that Lucas and Chloe had suffered no hypothermia. Clinking mugs of hot vegetable soup, both families smiled through tears of relief.",
    keywords: [{ word: "hypothermia", meaningFa: "افت دمای خطرناک بدن بر اثر سرما", phonetic: "/ˌhaɪpəʊˈθɜːmiə/" }],
    question: {
      promptEn: "What did the doctor confirm about Lucas and Chloe?",
      promptFa: "پزشک چه خبری درباره وضعیت سلامتی لوکاس و کلوئی داد؟",
      options: ["They had suffered no hypothermia and were completely fine", "They had broken legs", "They needed surgery"],
      correctIndex: 0,
      hintSnippet: "confirmed that Lucas and Chloe had suffered no hypothermia",
      clueFa: "دچار افت دمای بدن نشده بودند و کاملاً سالم بودند.",
    },
    choiceA: {
      labelEn: "Sign the honorary Guestbook of Rescued Explorers with heartfelt messages!",
      labelFa: "دفترچه یادبود نجات‌یافتگان پارک را با پیام‌های پراحساس امضا کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Promise to return next summer for safe, ranger-guided hiking expeditions!",
      labelFa: "قول بدهید تابستان بعد برای طبیعت‌گردی با راهنمایی محیط‌بانان بازگردید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The crackling beach bonfire leaped into the starry night sky. Rangers, campers, and parents gathered around, singing acoustic folk ballads in celebration of survival.",
    keywords: [{ word: "survival", meaningFa: "بقا و نجات از خطرات مرگبار", phonetic: "/səˈvaɪvl/" }],
    question: {
      promptEn: "What did the crowd sing around the crackling beach bonfire?",
      promptFa: "جمعیت دور آتش پرشور ساحل چه آوازی خواندند؟",
      options: ["Acoustic folk ballads in celebration of survival", "Loud rock screams", "Sad funeral songs"],
      correctIndex: 0,
      hintSnippet: "singing acoustic folk ballads in celebration of survival",
      clueFa: "تصنیف‌های فولکلور آرامش‌بخش در جشن نجات و زندگی.",
    },
    choiceA: {
      labelEn: "Toast golden marshmallows over the beach embers with Lucas and Chloe!",
      labelFa: "مارشملوهای طلایی را روی زغال‌های آتش با لوکاس و کلوئی کباب کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Dedicate the bonfire as the annual 'Campers' Guardian Festival'!",
      labelFa: "این جشن را به عنوان جشنواره سالانه حامیان طبیعت نام‌گذاری کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The rescue helicopter landed softly on the wide gravel bar, its rotor blades slowing to a quiet whir. Chief Sarah stepped out to embrace Dan with unbridled pride.",
    keywords: [{ word: "unbridled", meaningFa: "بی‌حد و حصر، خالص و بی‌پایان", phonetic: "/ʌnˈbraɪdld/" }],
    question: {
      promptEn: "Who stepped out of the helicopter to embrace Dan?",
      promptFa: "چه کسی از هلیکوپتر پیاده شد تا دن را در آغوش بگیرد؟",
      options: ["Chief Sarah with unbridled pride", "A stranger with an umbrella", "A visiting tourist"],
      correctIndex: 0,
      hintSnippet: "Chief Sarah stepped out to embrace Dan with unbridled pride",
      clueFa: "رئیس سارا با غرور و شادی بی‌حد و حصر.",
    },
    choiceA: {
      labelEn: "Promote Dan on the spot to Full Senior Ranger of Silver Canyon!",
      labelFa: "دن را در همان لحظه به رتبه محیط‌بان ارشد دره نقره‌ای ارتقا دهید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Board the helicopter together to watch the sun rise above the peaks!",
      labelFa: "با هلیکوپتر به هوا برخیزید تا طلوع آفتاب بر فراز قله‌ها را تماشا کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Flying through the crystal morning skies, the helicopter crew gave Dan and Rex a standing salute. Below them, Silver Canyon sparkled peacefully under golden dawn light.",
    keywords: [{ word: "salute", meaningFa: "ادای احترام رسمی و ایستاده", phonetic: "/səˈluːt/" }],
    question: {
      promptEn: "How did Silver Canyon look below the helicopter at dawn?",
      promptFa: "دره نقره‌ای در طلوع خورشید از درون هلیکوپتر چگونه به نظر می‌رسید؟",
      options: ["Sparkled peacefully under golden dawn light", "Flooded in deep black mud", "Covered in flames"],
      correctIndex: 0,
      hintSnippet: "Silver Canyon sparkled peacefully under golden dawn light",
      clueFa: "در پرتوهای زرین سحرگاهی با آرامش می‌درخشید.",
    },
    choiceA: {
      labelEn: "Land at the park headquarters to receive the Governor's Life-Saving Ribbon!",
      labelFa: "در مقر فرود بیایید تا روبان نجات‌بخش زندگی فرماندار را دریافت کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Broadcast an inspiring safety message to all hikers across the national parks!",
      labelFa: "پیام آموزشی ایمنی را برای تمام کوهنوردان پارک‌های ملی مخابره کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Guiding the patrol boat safely through the marina breakwater, Dan smiled as morning seagulls wheeled in the clear blue air. Every piece of rescue equipment was accounted for.",
    keywords: [{ word: "breakwater", meaningFa: "موج‌شکن ورودی بندرگاه", phonetic: "/ˈbreɪkwɔːtə/" }],
    question: {
      promptEn: "What birds were flying in the clear morning air above the marina?",
      promptFa: "چه پرندگانی در هوای صاف صبحگاهی بالای اسکله پرواز می‌کردند؟",
      options: ["Morning seagulls", "Heavy condors", "Flocks of crows"],
      correctIndex: 0,
      hintSnippet: "morning seagulls wheeled in the clear blue air",
      clueFa: "مرغان دریایی سحرخیز در آسمان آبی اوج می‌گرفتند.",
    },
    choiceA: {
      labelEn: "Hang the dried orange life vest in the ranger station hall of honor!",
      labelFa: "جلیقه نجات را در تالار افتخارات پایگاه محیط‌بانی به یادگار آویزان کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Enjoy a hot breakfast of scrambled eggs and biscuits with the patrol crew!",
      labelFa: "صبحانه گرم با تخم‌مرغ و کلوچه‌های تازه با همکاران نوش جان کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Walking down the dry riverbed at sunrise, the canyon revealed fresh sandstone sculptures carved by the waters. Lucas and Chloe walked hand-in-hand, forever bonded by survival.",
    keywords: [{ word: "sculptures", meaningFa: "تندیس‌ها و سنگ‌تراشی‌های طبیعی آب", phonetic: "/ˈskʌlptʃəz/" }],
    question: {
      promptEn: "What had the waters carved along the canyon walls at sunrise?",
      promptFa: "آب سیلاب در طلوع آفتاب چه آثاری روی صخره‌های دره خلق کرده بود؟",
      options: ["Fresh sandstone sculptures", "Piles of plastic trash", "Cracked concrete walls"],
      correctIndex: 0,
      hintSnippet: "revealed fresh sandstone sculptures carved by the waters",
      clueFa: "تندیس‌ها و قوس‌های شگفت‌انگیز سنگی طبیعی.",
    },
    choiceA: {
      labelEn: "Photograph the natural sandstone arches for a geology journal!",
      labelFa: "از قوس‌های شگفت‌انگیز سنگ‌شنی برای مجله زمین‌شناسی عکس بگیرید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Carve a small gratitude marker on the trailhead stone: 'Saved by Courage'!",
      labelFa: "نشان یادبود «نجات‌یافته با شجاعت» را در آغاز مسیر صخره‌ای ثبت کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The smell of fluffy golden pancakes and maple syrup wafted through the morning canyon. The teenagers laughed happily, knowing the darkest storm had given way to the brightest dawn.",
    keywords: [{ word: "fluffy", meaningFa: "پف‌کرده، سبک و نرم", phonetic: "/ˈflʌfi/" }],
    question: {
      promptEn: "What delicious breakfast did Dan cook on his camp stove?",
      promptFa: "دن چه صبحانه خوشمزه‌ای را روی اجاق مسافرتی پخت؟",
      options: ["Fluffy golden pancakes and maple syrup", "Cold canned tuna", "Burnt toast"],
      correctIndex: 0,
      hintSnippet: "smell of fluffy golden pancakes and maple syrup wafted through the morning canyon",
      clueFa: "پنکیک‌های طلایی پف‌کرده همراه با شیره افرا.",
    },
    choiceA: {
      labelEn: "Share the last pancake with Rex as a hero's breakfast!",
      labelFa: "آخرین پنکیک طلایی را به عنوان پاداش به رکس هدیه دهید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Toast your coffee mugs to the power of courage and calm judgment!",
      labelFa: "ماگ‌های قهوه را به افتخار تصمیم‌گیری آرام و شجاعت به هم بزنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Parents of both teenagers rushed across the visitor center lobby, weeping with gratitude as they held their children tight. Dan stood quietly in the corner, smiling with humble joy.",
    keywords: [{ word: "humble", meaningFa: "فروتن، بی‌ادعا و باوقار", phonetic: "/ˈhʌmbl/" }],
    question: {
      promptEn: "How did Dan react as the families embraced in tears of joy?",
      promptFa: "دن هنگام آغوش پر از اشک شوق خانواده‌ها چه واکنشی نشان داد؟",
      options: ["Stood quietly in the corner, smiling with humble joy", "Demanded money from them", "Complained about being tired"],
      correctIndex: 0,
      hintSnippet: "Dan stood quietly in the corner, smiling with humble joy",
      clueFa: "در گوشه‌ای آرام ایستاد و با فروتنی و شادی لبخند زد.",
    },
    choiceA: {
      labelEn: "Accept the family's heartfelt invitation to Sunday victory dinner!",
      labelFa: "دعوت گرم خانواده‌ها برای شام خانوادگی یکشنبه را بپذیرید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Present Chloe and Lucas with Junior Ranger Honorary Badges!",
      labelFa: "نشان‌های افتخاری محیط‌بان جوان را به سینه لوکاس و کلوئی نصب کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Chief Sarah officially pinned the Silver Star of Valor to Dan's uniform before forty assembled rangers. Dan dedicated the medal to team preparedness and Rex's sharp instincts.",
    keywords: [{ word: "preparedness", meaningFa: "آمادگی کامل در برابر حوادث", phonetic: "/prɪˈpeədnəs/" }],
    question: {
      promptEn: "To what did Dan dedicate his Silver Star of Valor medal?",
      promptFa: "دن مدال شجاعت ستاره نقره‌ای را به چه چیزی تقدیم کرد؟",
      options: ["Team preparedness and Rex's sharp instincts", "His own great strength", "A computer video game"],
      correctIndex: 0,
      hintSnippet: "dedicated the medal to team preparedness and Rex's sharp instincts",
      clueFa: "به آمادگی گروهی و غریزه تیزهوشانه رکس تقدیم کرد.",
    },
    choiceA: {
      labelEn: "Lead the ranger company in the traditional 'Guardians of the Wild' toast!",
      labelFa: "همکاران محیط‌بان را به سلامتی پاسداران طبیعت دعوت کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Frame the medal in the headquarters entryway to inspire future cadets!",
      labelFa: "مدال شجاعت را در ورودی پایگاه نصب کنید تا الهام‌بخش نیروهای جدید باشد!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Lucas crossed the gorge with soaring confidence, landing in the waiting arms of Chief Sarah. The entire rescue team erupted in cheers as the final camper reached safety.",
    keywords: [{ word: "confidence", meaningFa: "اعتماد به نفس و اطمینان خاطر", phonetic: "/ˈkɒnfɪdəns/" }],
    question: {
      promptEn: "How did the rescue team react when Lucas safely landed?",
      promptFa: "تیم نجات وقتی لوکاس به سلامت فرود آمد چه واکنشی نشان دادند؟",
      options: ["Erupted in cheers of celebration", "Turned off the lights and left", "Looked disappointed"],
      correctIndex: 0,
      hintSnippet: "The entire rescue team erupted in cheers as the final camper reached safety",
      clueFa: "همگی با فریادهای شادی و هورا جشن گرفتند.",
    },
    choiceA: {
      labelEn: "Share a three-way high-five with Chief Sarah and Lucas on the cliff edge!",
      labelFa: "دست پیروزی سه‌نفره با رئیس سارا و لوکاس روی لبه صخره بزنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Pack up the rescue gear with the smooth precision of seasoned professionals!",
      labelFa: "تجهیزات نجات را با آرامش و دقت استادانه جمع‌آوری کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Dan's swift inspection procedure was published in the State Search & Rescue Operations Handbook, credited with establishing a new safety protocol that saved lives statewide.",
    keywords: [{ word: "protocol", meaningFa: "پروتکل و دستورالعمل استاندارد ایمنی", phonetic: "/ˈprəʊtəkɒl/" }],
    question: {
      promptEn: "Where was Dan's inspection procedure officially published?",
      promptFa: "دستورالعمل بازرسی فنی دن رسماً در کجا منتشر شد؟",
      options: [
        "In the State Search & Rescue Operations Handbook",
        "In a comic magazine",
        "On a restaurant menu",
      ],
      correctIndex: 0,
      hintSnippet: "published in the State Search & Rescue Operations Handbook",
      clueFa: "در کتابچه راهنمای عملیات جستجو و نجات ایالتی.",
    },
    choiceA: {
      labelEn: "Deliver a keynote training lecture to five hundred emergency responders!",
      labelFa: "کارگاه آموزشی نجات فنی برای پانصد امدادگر هلال‌احمر برگزار کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Receive the National Safety Council's Golden Carabiner Award!",
      labelFa: "تندیس کارابین زرین شورای ملی ایمنی را دریافت کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The tearful reunion at the visitor center made national headlines: parents hugging their children under bright television cameras, thanking Dan for his swift heroism.",
    keywords: [{ word: "reunion", meaningFa: "دیدار دوباره پس از جدایی و دلهره", phonetic: "/ˌriːˈjuːniən/" }],
    question: {
      promptEn: "Where was the tearful reunion featured?",
      promptFa: "دیدار پر از اشک شوق خانواده‌ها در کجا بازتاب پیدا کرد؟",
      options: ["Made national headlines across news channels", "In a local phone book", "Nowhere"],
      correctIndex: 0,
      hintSnippet: "The tearful reunion at the visitor center made national headlines",
      clueFa: "در سرخط اخبار رسانه‌های سراسری کشور قرار گرفت.",
    },
    choiceA: {
      labelEn: "Politely step back from the cameras to let the families enjoy their reunion!",
      labelFa: "با فروتنی از جلوی دوربین‌ها کنار بروید تا خانواده‌ها با آرامش خلوت کنند!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Give an educational TV interview about flash flood preparedness!",
      labelFa: "مصاحبه تلویزیونی آموزنده‌ای درباره هوشیاری در برابر سیلاب‌های ناگهانی انجام دهید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Rex sat proudly beside Dan on the ranger headquarters steps, wearing a shiny bronze collar engraved 'Hero Dog of Silver Canyon'. Tourists stopped to applaud the brave dog.",
    keywords: [{ word: "collar", meaningFa: "قلاده تزئینی گردن سگ", phonetic: "/ˈkɒlə/" }],
    question: {
      promptEn: "What was engraved on Rex's shiny bronze collar?",
      promptFa: "روی قلاده برنزی براق رکس چه عبارتی حک شده بود؟",
      options: ["'Hero Dog of Silver Canyon'", "'Friendly House Pet'", "'Quiet Walker'"],
      correctIndex: 0,
      hintSnippet: "wearing a shiny bronze collar engraved 'Hero Dog of Silver Canyon'",
      clueFa: "عبارت «سگ قهرمان دره نقره‌ای» حکاکی شده بود.",
    },
    choiceA: {
      labelEn: "Reward Rex with a giant ribeye bone from the local butchers!",
      labelFa: "استخوان کباب آبدار بزرگی به عنوان پاداش به رکس هدیه دهید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Photograph Rex for the cover of National Wildlife & Working Dogs!",
      labelFa: "عکس پرتره رکس را روی جلد مجله سگ‌های نجات چاپ کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Guiding the fiberglass cutter into the marina slip, the sunrise reflected like molten copper on the calm water. The storm had passed, leaving behind a legacy of lives saved.",
    keywords: [{ word: "legacy", meaningFa: "میراث ماندگار و کارنامه درخشان", phonetic: "/ˈleɡəsi/" }],
    question: {
      promptEn: "What did the sunrise look like on the calm water at the marina?",
      promptFa: "طلوع خورشید روی آب آرام اسکله شبیه چه چیزی بود؟",
      options: ["Reflected like molten copper", "A puddle of black oil", "Pitch-black darkness"],
      correctIndex: 0,
      hintSnippet: "the sunrise reflected like molten copper on the calm water",
      clueFa: "مثل مس مذاب درخشان بازتاب می‌یافت.",
    },
    choiceA: {
      labelEn: "Secure the cutter lines and celebrate with fresh hot blueberry muffins!",
      labelFa: "طناب‌های قایق را ببندید و با کلوچه‌های بلوبری داغ پیروزی را جشن بگیرید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Sound the cutter's foghorn in three triumphant blasts across the harbor!",
      labelFa: "بوق مه‌شکن قایق را سه بار به نشانه پیروزی در بندر به صدا درآورید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Chief Sarah logged the official incident conclusion: zero casualties, zero injuries, and a benchmark demonstration of emergency response under extreme conditions.",
    keywords: [{ word: "casualties", meaningFa: "تلفات جانی و آسیب‌دیدگان", phonetic: "/ˈkæʒuəltiz/" }],
    question: {
      promptEn: "How many casualties or injuries were recorded in the official incident log?",
      promptFa: "در گزارش رسمی چند نفر مصدوم یا تلفات ثبت شد؟",
      options: ["Zero casualties and zero injuries", "Ten injured people", "Five lost bags"],
      correctIndex: 0,
      hintSnippet: "logged the official incident conclusion: zero casualties, zero injuries",
      clueFa: "صفر تلفات و صفر مصدومیت؛ پیروزی صد در صدی.",
    },
    choiceA: {
      labelEn: "File the report with pride and take a well-deserved rest in the rangers' lodge!",
      labelFa: "گزارش را با سربلندی ثبت کنید و برای استراحتی شیرین به اقامتگاه بروید!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Vow to stand ready as guardians of Silver Canyon for years to come!",
      labelFa: "عهد ببندید که همیشه پاسدار جان انسان‌ها در دل کوهستان‌های وحشی بمانید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Silver Cross of Heroism", titleFa: "مدال صلیب نقره‌ای شجاعت", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان افتخارآفرین حماسی", climaxEn: "Pinned with the Silver Cross, Dan's speech inspires twenty volunteers to join the swiftwater search patrol.", climaxFa: "با دریافت مدال صلیب نقره‌ای، سخنان دن بیست جوان دیگر را برای پیوستن به گروه امداد کوهستان ترغیب کرد.", xpReward: 250 },
  { pathCode: "AAAAB", titleEn: "Rex's Golden Bone", titleFa: "استخوان زرین رکس قهرمان", badgeCategory: "funny", badgeIcon: "🦴", badgeNameFa: "پایان شیرین و بامزه", climaxEn: "Rex proudly prances around headquarters with his shiny gold-plated bone, wagging his tail happily.", climaxFa: "رکس با استخوان طلایی‌اش با غرور دور پایگاه چرخید و دمش را از خوشحالی تکان داد.", xpReward: 200 },
  { pathCode: "AAABA", titleEn: "The Rescued Explorers' Ledger", titleFa: "دفترچه ماندگار نجات‌یافتگان", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان عاطفی و صمیمانه", climaxEn: "Lucas and Chloe write: 'Rangers turn fear into hope.' The book is displayed in the canyon museum.", climaxFa: "لوکاس و کلوئی نوشتند: «محیط‌بانان ترس را به امید بدل می‌کنند» و این یادداشت در موزه پارک نصب شد.", xpReward: 220 },
  { pathCode: "AAABB", titleEn: "The Summer Trail Promise", titleFa: "پیمان دیدار در تابستان بعد", badgeCategory: "scholar", badgeIcon: "🤝", badgeNameFa: "پایان وفادارانه و اخلاقی", climaxEn: "Next July, the teens return with their parents for an unforgettable safe hike led personally by Dan.", climaxFa: "تابستان بعد، هر دو نوجوان همراه خانواده برگشتند و با راهنمایی دن در کمال آرامش کوهپیمایی کردند.", xpReward: 215 },
  { pathCode: "AABAA", titleEn: "The Campers' Guardian Festival", titleFa: "جشنواره حامیان طبیعت", badgeCategory: "legendary", badgeIcon: "🔥", badgeNameFa: "پایان مردمی و باشکوه", climaxEn: "The annual beach bonfire becomes the park's biggest festival, celebrating safety and wilderness love.", climaxFa: "جشن آتش ساحلی به بزرگترین همایش سالانه پارک برای ترویج ایمنی و عشق به طبیعت تبدیل شد.", xpReward: 240 },
  { pathCode: "AABAB", titleEn: "Marshmallow Victory Cheers", titleFa: "شادی دور آتش با کلوچه‌ها", badgeCategory: "funny", badgeIcon: "🍢", badgeNameFa: "پایان شاد و خودمانی", climaxEn: "Laughing around the embers, Dan and the teenagers share toasted treats as the morning sun rises.", climaxFa: "دور زغال‌های روشن، دن و بچه‌ها در گرمای اولین پرتوهای خورشید از طعم خوراکی‌ها لذت بردند.", xpReward: 205 },
  { pathCode: "AABBA", titleEn: "Senior Ranger Promotion", titleFa: "ارتقا به محیط‌بان ارشد", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان شایسته‌سالاری ممتاز", climaxEn: "Chief Sarah pins the gold senior star onto Dan's shoulder boards, honoring his fearless leadership.", climaxFa: "رئیس سارا ستاره طلای ارشدیت را بر دوش دن نصب کرد و رهبری شجاعانه‌اش را ستود.", xpReward: 250 },
  { pathCode: "AABBB", titleEn: "Sunrise Over Silver Peaks", titleFa: "طلوع خورشید بر قله‌های نقره‌ای", badgeCategory: "heroic", badgeIcon: "🌄", badgeNameFa: "پایان دیدنی و آرامش‌بخش", climaxEn: "Flying through morning rays in the helicopter, they witness the majestic canyon reborn in peace.", climaxFa: "پرواز در میان پرتوهای صبحگاهی با هلیکوپتر، تولد دوباره دره را در آرامشی بهشتی به تصویر کشید.", xpReward: 230 },
  { pathCode: "ABAAA", titleEn: "The Governor's Life-Saving Ribbon", titleFa: "روبان نجات‌بخش فرماندار", badgeCategory: "legendary", badgeIcon: "🎗️", badgeNameFa: "پایان عالی‌رتبه دولتی", climaxEn: "The Governor pins the ribbon in state capitol chambers before cheering cameras and reporters.", climaxFa: "استاندار روبان فداکاری را در تالار مرکزی دولت با حضور رسانه‌ها به سینه دن آویخت.", xpReward: 250 },
  { pathCode: "ABAAB", titleEn: "The Voice of Mountain Safety", titleFa: "صدای ایمنی کوهستان", badgeCategory: "scholar", badgeIcon: "📢", badgeNameFa: "پایان آموزشی و رسانه‌ای", climaxEn: "Dan's broadcast interview is watched by millions, teaching young hikers how to survive sudden flash floods.", climaxFa: "مصاحبه دن میلیون‌ها بیننده داشت و به کوهنوردان راهکارهای زنده ماندن در سیل را آموخت.", xpReward: 225 },
  { pathCode: "ABABA", titleEn: "The Hall of Honor Vest", titleFa: "جلیقه نارنجی تالار افتخارات", badgeCategory: "scholar", badgeIcon: "🦺", badgeNameFa: "پایان یادگاری ارزشمند", climaxEn: "Dan's fluorescent life vest hangs in the station museum, a symbol that vigilance conquers danger.", climaxFa: "جلیقه شب‌رنگ دن در موزه پایگاه نصب شد تا نماد غلبه هوشیاری بر خطرات مرگبار باشد.", xpReward: 215 },
  { pathCode: "ABABB", titleEn: "The Rangers' Breakfast Table", titleFa: "میز صبحانه گرم پایگاه", badgeCategory: "funny", badgeIcon: "🍳", badgeNameFa: "پایان صمیمی و لذیذ", climaxEn: "Warm biscuits, hot coffee, and heartfelt banter wrap up a grueling night in sweet fellowship.", climaxFa: "کلوچه‌های داغ، قهوه مطبوع و خنده‌های همکاران شبی سخت را در شیرینی رفاقت به پایان برد.", xpReward: 200 },
  { pathCode: "ABBAA", titleEn: "Sculptures of the Flood", titleFa: "تندیس‌های شنی آبشار", badgeCategory: "explorer", badgeIcon: "🗿", badgeNameFa: "پایان زمین‌شناسی دیدنی", climaxEn: "The newly carved sandstone canyon features are protected as a geological landmark.", climaxFa: "قوس‌های شنی تازه تراشیده‌شده توسط آبشار به عنوان اثر ملی زمین‌شناسی ثبت شدند.", xpReward: 235 },
  { pathCode: "ABBAB", titleEn: "The Stone of Courage", titleFa: "سنگ یادبود شجاعت", badgeCategory: "heroic", badgeIcon: "🪨", badgeNameFa: "پایان ماندگار در صخره‌ها", climaxEn: "Generations of hikers pause at the rock marker, inspired by the tale of the canyon flood rescue.", climaxFa: "کوهنوردان سال‌ها پای این سنگ یادبود ایستادند و از داستان شجاعت نجاتگران نیرو گرفتند.", xpReward: 220 },
  { pathCode: "ABBBA", titleEn: "The Pancake Feast of Dawn", titleFa: "ضیافت پنکیک سحرگاهی", badgeCategory: "funny", badgeIcon: "🥞", badgeNameFa: "پایان شیرین و خوش‌طعم", climaxEn: "Rex chomps his pancake happily while the campers laugh, savoring life's simple, delicious gifts.", climaxFa: "رکس با لذت پنکیکش را خورد و نوجوانان خندیدند و قدر لحظات ناب زندگی را دانستند.", xpReward: 210 },
  { pathCode: "ABBBB", titleEn: "Mugs of Iron Resolve", titleFa: "لیوان‌های عزم پولادین", badgeCategory: "scholar", badgeIcon: "☕", badgeNameFa: "پایان همبستگی و اراده", climaxEn: "Clinking their camp mugs together, they salute the unshakeable bravery that pulled them through.", climaxFa: "با به هم زدن ماگ‌های فلزی، اراده پولادین و شجاعتی را که نجاتشان داد ستایش کردند.", xpReward: 220 },
  { pathCode: "BAAAA", titleEn: "The Sunday Family Table", titleFa: "ضیافت خانوادگی یکشنبه", badgeCategory: "scholar", badgeIcon: "🍽️", badgeNameFa: "پایان عاطفی و ماندگار", climaxEn: "Dan sits at the head of the campers' family dinner table, forever embraced as an honorary son.", climaxFa: "دن در صدر میز شام خانوادگی نشست و برای همیشه به عنوان فرزندی فداکار در قلبشان ماندگار شد.", xpReward: 230 },
  { pathCode: "BAAAB", titleEn: "The Junior Ranger Badges", titleFa: "مدال‌های افتخاری محیط‌بان جوان", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان انگیزشی جوانان", climaxEn: "Chloe and Lucas wear their bronze badges with pride, vowing to study outdoor conservation.", climaxFa: "کلوئی و لوکاس مدال‌های برنزی‌شان را به سینه زدند و قول دادند حافظ محیط‌زیست باشند.", xpReward: 215 },
  { pathCode: "BAABA", titleEn: "The Guardians' Toast", titleFa: "سلامتی نگهبانان طبیعت", badgeCategory: "legendary", badgeIcon: "🌲", badgeNameFa: "پایان حماسی کوهستان", climaxEn: "Forty rangers raise their metal mugs in unison, honoring the timeless creed of search and rescue.", climaxFa: "چهل محیط‌بان یکصدا لیوان‌هایشان را بالا بردند و مرام جوانمردانه امداد را پاس داشتند.", xpReward: 245 },
  { pathCode: "BAABB", titleEn: "The Framed Silver Star", titleFa: "قاب زرین ستاره نقره‌ای", badgeCategory: "scholar", badgeIcon: "🖼️", badgeNameFa: "پایان الهام‌بخش پایگاه", climaxEn: "The framed medal in headquarters entryway inspires every young rookie to serve with unwavering heart.", climaxFa: "قاب مدال شجاعت در ورودی پایگاه الهام‌بخش نیروهای جوان برای خدمتی فداکارانه شد.", xpReward: 225 },
  { pathCode: "BABAA", titleEn: "The Three-Way High-Five", titleFa: "دست پیروزی سه‌نفره", badgeCategory: "heroic", badgeIcon: "🖐️", badgeNameFa: "پایان پرانرژی و شاد", climaxEn: "Their resounding high-five echoes off the canyon walls, sealing a triumphant rescue for the ages.", climaxFa: "صدای محکم دست پیروزی در دیواره دره پیچید و نجات تاریخی را برای همیشه جاودانه کرد.", xpReward: 230 },
  { pathCode: "BABAB", titleEn: "The Professional Pack-Down", titleFa: "نظم استادانه تجهیزات", badgeCategory: "scholar", badgeIcon: "🎒", badgeNameFa: "پایان انضباط حرفه‌ای", climaxEn: "Every rope is coiled with textbook precision, ready to respond to the next mountain call.", climaxFa: "تمام طناب‌ها با نظمی مثال‌زدنی جمع شدند تا برای مأموریت بعدی در حالت آماده‌باش بمانند.", xpReward: 210 },
  { pathCode: "BABBA", titleEn: "The Operations Handbook Master", titleFa: "استاد کتابچه عملیات نجات", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان علمی و فنی", climaxEn: "Dan's preventive inspection protocol is taught in SAR academies nationwide, preventing countless cable failures.", climaxFa: "پروتکل بازرسی فنی دن در آکادمی‌های نجات کشور تدریس شد و جان‌های بی‌شماری را نجات داد.", xpReward: 240 },
  { pathCode: "BABBB", titleEn: "The Golden Carabiner", titleFa: "تندیس کارابین زرین", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان پرافتخار ملی", climaxEn: "The National Safety Council presents Dan with their highest honor for technical precision under pressure.", climaxFa: "شورای ملی ایمنی بالاترین نشان افتخار خود را برای دقت فنی در شرایط بحران به دن اهدا کرد.", xpReward: 250 },
  { pathCode: "BBAAA", titleEn: "The Quiet Hero", titleFa: "قهرمان آرام و بی‌ادعا", badgeCategory: "legendary", badgeIcon: "🛡️", badgeNameFa: "پایان اخلاقی و بزرگمنشانه", climaxEn: "Stepping away from the spotlight, Dan knows that real reward is seeing families reunited in love.", climaxFa: "با دوری از هیاهوی دوربین‌ها، دن دریافت بزرگترین پاداش اشک شادی دیدار خانواده‌هاست.", xpReward: 250 },
  { pathCode: "BBAAB", titleEn: "The National Broadcast Lesson", titleFa: "آموزش همگانی در رسانه ملی", badgeCategory: "scholar", badgeIcon: "📺", badgeNameFa: "پایان آموزشی گسترده", climaxEn: "Dan's televised interview reaches ten million households, drastically reducing mountain flood accidents.", climaxFa: "مصاحبه تلویزیونی دن در ده میلیون خانه دیده شد و آمار حوادث سیل کوهستان را به شدت کاهش داد.", xpReward: 235 },
  { pathCode: "BBABA", titleEn: "The Hero Dog of Silver Canyon", titleFa: "سگ قهرمان دره نقره‌ای", badgeCategory: "legendary", badgeIcon: "🐕", badgeNameFa: "پایان باشکوه رکس", climaxEn: "Rex's bronze collar gleams as visitors cheer, celebrating the fearless four-legged guardian.", climaxFa: "قلاده برنزی رکس در میان تشویق گردشگران درخشید و نگهبان وفادار چهارپا تجلیل شد.", xpReward: 245 },
  { pathCode: "BBABB", titleEn: "Cover of Working Dogs", titleFa: "روی جلد مجله سگ‌های نجات", badgeCategory: "explorer", badgeIcon: "📸", badgeNameFa: "پایان مطبوعاتی دیدنی", climaxEn: "Rex's heroic portrait on the magazine cover raises two million dollars for K-9 search rescue teams.", climaxFa: "عکس زیبای رکس روی جلد مجله دو میلیون دلار کمک مالی برای سگ‌های امدادگر جمع‌آوری کرد.", xpReward: 230 },
  { pathCode: "BBBAA", titleEn: "The Triple Foghorn Blast", titleFa: "سه بوق پیروزی در بندر", badgeCategory: "heroic", badgeIcon: "🚢", badgeNameFa: "پایان پرصلابت و غرورآفرین", climaxEn: "Three deep foghorn blasts echo across the harbor, answered by cheers from every fishing vessel.", climaxFa: "سه بوق بلند قایق در بندرگاه طنین انداخت و قایق‌های صیادی با هورا به آن پاسخ دادند.", xpReward: 235 },
  { pathCode: "BBBAB", titleEn: "The Blueberry Muffin Dock", titleFa: "کلوچه‌های بلوبری اسکله", badgeCategory: "funny", badgeIcon: "🧁", badgeNameFa: "پایان شیرین و صمیمی", climaxEn: "Sharing warm muffins on the wooden dock, the patrol celebrates an exhausting night conquered by skill.", climaxFa: "خوردن کلوچه‌های تازه روی اسکله چوبی پایان شبی پرماجرا را به خاطره‌ای شیرین بدل ساخت.", xpReward: 205 },
  { pathCode: "BBBBA", titleEn: "The Flawless Log Entry", titleFa: "گزارش درخشان بدون تلفات", badgeCategory: "legendary", badgeIcon: "📋", badgeNameFa: "پایان استاندارد طلایی", climaxEn: "Chief Sarah's report of 'zero casualties' enters the emergency management hall of fame.", climaxFa: "ثبت گزارش رسمی «صفر تلفات» به عنوان استاندارد طلایی مدیریت بحران در تاریخ ثبت شد.", xpReward: 250 },
  { pathCode: "BBBBB", titleEn: "Guardians of Silver Canyon", titleFa: "نگهبانان همیشگی دره نقره‌ای", badgeCategory: "legendary", badgeIcon: "🌟", badgeNameFa: "پایان جاودانه و اسطوره‌ای", climaxEn: "Watching the sun illuminate the canyon walls, Dan and Rex stand ready to answer whenever duty calls.", climaxFa: "با تابش آفتاب بر صخره‌های دره، دن و رکس آماده ماندند تا هر زمان که خطری پیش آمد نجات‌بخش باشند.", xpReward: 250 },
];

export const story5CanyonFlood: AdventureStory = buildAdventureStory({
  id: "b1-flash-flood-rescue",
  storyIndex: 5,
  cefr: "B1",
  titleEn: "Night of the Canyon Flood",
  titleFa: "شب حادثه در دره طوفانی",
  genre: "rescue",
  genreLabelFa: "❄️ هیجان و نجات‌بخشی",
  genreIcon: "❄️",
  synopsisEn:
    "When a cloudburst floods Silver Canyon, junior ranger Dan and his rescue dog Rex must save two stranded teenagers from rising rapids across 32 thrilling endings!",
  synopsisFa:
    "با شروع بارش ناگهانی سیل‌آسا در دره نقره‌ای، رودخانه طغیان می‌کنه و دو کوهنورد نوجوان روی یک صخره خطرناک گیر می‌افتن! دن، محیط‌بان جوان، همراه با سگ شجاعش رکس باید با قایق بادی مخصوص آب‌های خروشان یا کابل معلق هوایی به نجات اون‌ها برن. ۳۲ پایان نفس‌گیر و هیجان‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b1-canyon-flood.webp",
  nodes,
  endings,
});
