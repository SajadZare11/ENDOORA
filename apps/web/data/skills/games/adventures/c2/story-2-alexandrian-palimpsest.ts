import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 2 (C2 - Adult Mastery): The Alexandrian Palimpsest (راز طومار گمشده کتابخانه اسکندریه)
// Genre: Mystery & Curiosity (معمایی و کنجکاوی)
// CEFR: C2 (Archaic and scholarly diction, erudite deduction, cleft sentences, participial clauses)
// Characters: Dr. Julian Mercer (Senior Codicologist), Dr. Soraya Khorsandi (Epigraphist & Archaeologist)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Deep beneath the subterranean basalt vaults of the Saint Mercurius Monastery in Old Cairo, where air had hung motionless for nine centuries, Dr. Julian Mercer and Dr. Soraya Khorsandi scrutinized an extraordinary codex. Bound in cracked lambskin, the manuscript appeared to be an ascetic tenth-century liturgical prayer book. Yet, beneath Julian’s multispectral ultraviolet illuminator, the scraped undertext emerged like ghosts rising from lime-washed vellum: pristine Greek uncials penned in the fourth century, hailing from the Great Library of Alexandria itself. Soraya’s magnifying lens paused over an intricate geometric diagram depicting Archimedean concentric spheres and an astronomical mechanism thought lost during the burning of the Serapeum. As her stylus gently traced an erased marginal cipher, a faint click reverberated within the hollow stone pedestal beneath the reading desk, revealing a concealed bronze aperture inlaid with lapis lazuli.",
    keywords: [
      { word: "palimpsest", meaningFa: "پوست‌نوشت بازیافتی که متون قبلی‌اش تراشیده و دوباره رویش نوشته شده", phonetic: "/ˈpælɪmpsest/" },
      { word: "uncials", meaningFa: "حروف درشت و گرد باستانی در دست‌نوشته‌های یونانی و لاتین", phonetic: "/ˈʌnʃiəlz/" },
      { word: "aperture", meaningFa: "روزنه، شکاف یا دریچه ظریف مکانیکی", phonetic: "/ˈæpətʃʊə(r)/" },
      { word: "ascetic", meaningFa: "زاهدانه، بی‌پیرایه و پرهیزگارانه", phonetic: "/əˈsetɪk/" },
    ],
    question: {
      promptEn: "What astonishing historical discovery lay concealed beneath the medieval prayer book?",
      promptFa: "چه کشف حیرت‌انگیز تاریخی زیر نوشته‌های کتاب دعای قرون‌وسطایی پنهان شده بود؟",
      options: [
        "Fourth-century Alexandrian Greek uncials showing lost Archimedean astronomical diagrams",
        "A Byzantine pirate map depicting gold stashed in the Red Sea",
        "An imperial decree from Julius Caesar prohibiting the study of astronomy",
      ],
      correctIndex: 0,
      hintSnippet: "pristine Greek uncials penned in the fourth century, hailing from the Great Library of Alexandria itself",
      clueFa: "خط چهارم و پنجم رو ببین دوست من؛ زیر نور فرابنفش دست‌خط یونانی قرن چهارم با دیاگرام‌های گم‌شده ارشمیدس از کتابخانه اسکندریه نمایان شد!",
    },
    choiceA: {
      labelEn: "Align the astronomical cipher coordinates directly with the bronze lapis aperture!",
      labelFa: "مختصات نجومی رمزگشایی‌شده از حاشیه طومار را مستقیماً روی روزنه برنجی و لاجوردی تنظیم کن!",
      descriptionFa: "استفاده از محاسبات دقیق ریاضی باستان برای باز کردن مکانیزم مخفی بدون آسیب به سنگ.",
    },
    choiceB: {
      labelEn: "Cross-reference the erased Greek marginalia with the monastery's Arabic astronomical ledgers!",
      labelFa: "یادداشت‌های یونانی محوشده را با دفاتر نجومی عربی قرن دهم صومعه تطبیق بده!",
      descriptionFa: "رویکردی محتاطانه و دانش‌پژوهانه برای پیشگیری از فعال شدن هرگونه تله مکانیکی.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Julian manipulated the bronze bezel with surgical precision. As the lapis markers aligned with the declination of Sirius at the autumnal equinox of 391 AD, the stone pedestal parted with an exhalation of dry, cedar-scented air. Within rested a geared bronze armillary orb no larger than a pomegranate, its interlocking gear trains gleaming untarnished in the lamplight. Soraya gasped; this was neither decorative bauble nor crude astrolabe, but an intact mechanical calculating engine descended directly from the Antikythera lineage, capable of computing lunar eclipses and planetary retrogrades across three millennia.",
    keywords: [
      { word: "armillary", meaningFa: "مربوط به گوی فلکی با حلقه‌های متداخل نجومی", phonetic: "/ɑːˈmɪləri/" },
      { word: "retrogrades", meaningFa: "حرکات رجعی و بازگشتی ظاهری سیارات در مدار", phonetic: "/ˈretrəɡreɪdz/" },
      { word: "untarnished", meaningFa: "کدرنشده، درخشان و بدون زنگ‌زدگی", phonetic: "/ʌnˈtɑːnɪʃt/" },
      { word: "bezel", meaningFa: "زه چرخان مدرج یا شیار نگه‌دارنده فلزی", phonetic: "/ˈbezl/" },
    ],
    question: {
      promptEn: "What remarkable artifact was found inside the opened stone pedestal?",
      promptFa: "چه شاهکار تاریخی ارزشمندی داخل ستون سنگی مخفی قرار داشت؟",
      options: [
        "An intact bronze armillary calculating engine capable of predicting planetary retrogrades",
        "A golden crown belonging to Cleopatra inscribed with hieroglyphs",
        "An alabaster jar containing preserved scrolls of Aristotle's lost comedies",
      ],
      correctIndex: 0,
      hintSnippet: "an intact mechanical calculating engine descended directly from the Antikythera lineage, capable of computing lunar eclipses and planetary retrogrades",
      clueFa: "خط پنجم و ششم رو بخون؛ یک گوی مکانیکی برنجی از نسل سازوکار آنتیکیترا بود که خسوف‌ها و حرکات سیارات را تا سه هزار سال محاسبه می‌کرد!",
    },
    choiceA: {
      labelEn: "Gently wind the primary differential gear using Soraya's precision brass torque key!",
      labelFa: "چرخ‌دنده اصلی دستگاه را با آچار گشتاور برنجی و ظریف ثریا به آرامی کوک کن!",
      descriptionFa: "به کار انداختن موتور محاسباتی برای مشاهده نقشه افلاک باستانی.",
    },
    choiceB: {
      labelEn: "Subject the gear metallurgy to handheld X-ray fluorescence before applying mechanical torque!",
      labelFa: "قبل از چرخاندن دنده‌ها، با دستگاه فلورسانس اشعه ایکس آلیاژ را اسکن کن!",
      descriptionFa: "محافظت کامل از پیوستگی دندانه‌ها برای جلوگیری از کوچک‌ترین شکستگی میکروسکوپی.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Soraya retrieved the eleventh-century manuscript catalog compiled by the Fatimid astronomer Ibn al-Haytham. Cross-referencing the palimpsest's marginal symbols against Arabic commentaries on Ptolemy’s Almagest, she deciphered an overlooked epistle: the codex was not smuggled alone, but was one of three sister volumes hidden by the philosopher Hypatia's disciples on the eve of the library’s sack. A cryptic marginal annotation in faded iron-gall ink instructed the reader: 'Where the shadow of the altar’s Coptic cross intersects the floor at high noon, the subterranean cistern yields the lost library of geometry.'",
    keywords: [
      { word: "epistle", meaningFa: "رساله، نامه‌نگاری کهن با بار فلسفی و علمی", phonetic: "/ɪˈpɪsl/" },
      { word: "iron-gall", meaningFa: "جوهر سنتی باستانی از ترکیب براده آهن و زاج مازو", phonetic: "/ˈaɪən ɡɔːl/" },
      { word: "cistern", meaningFa: "آب‌انبار باستانی زیرزمینی یا حوضچه ذخیره آب", phonetic: "/ˈsɪstən/" },
      { word: "annotation", meaningFa: "حاشیه‌نویسی، یادداشت توضیحی در کنار متن", phonetic: "/ˌænəˈteɪʃn/" },
    ],
    question: {
      promptEn: "What historical revelation did Soraya discover in the comparative Arabic catalog?",
      promptFa: "ثریا از مقایسه با فهرست عربی ابن‌هیثم به چه حقیقت تاریخی تکان‌دهنده‌ای پی برد؟",
      options: [
        "The codex was hidden by Hypatia's disciples and pointed toward a lost geometric library",
        "The manuscript was a seventeenth-century Venetian forgery",
        "The monks had traded the other volumes for olive oil during the Crusades",
      ],
      correctIndex: 0,
      hintSnippet: "the codex was not smuggled alone, but was one of three sister volumes hidden by the philosopher Hypatia's disciples",
      clueFa: "خط چهارم و پنجم رو ببین؛ فهمید این کتاب یکی از سه جلد مخفی‌شده توسط شاگردان هیپاتیاست که مکان مخفی آب‌انبار کتابخانه هندسه رو لو میده!",
    },
    choiceA: {
      labelEn: "Descend into the flooded monastic cistern with waterproof ultraviolet lanterns!",
      labelFa: "با چراغ‌های فرابنفش ضدآب به آب‌انبار تاریخی و تاریک زیر صومعه فرود بیا!",
      descriptionFa: "جست‌وجوی طاق‌های سنگی غوطه‌ور در آب برای یافتن محفظه‌های پلمب‌شده اسکندریه.",
    },
    choiceB: {
      labelEn: "Wait until solar noon to verify the precise geometric intersection of the cross's shadow!",
      labelFa: "تا ظهر شرعی صبر کن تا تلاقی هندسی سایه صلیب با کف سنگی را با لیزر ثبت کنی!",
      descriptionFa: "دقت ریاضی محض برای پرهیز از اتلاف وقت و پیدا کردن درب مخفی در روشنایی کامل.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "As the differential gear engaged with a melodious chiming of bronze teeth, twenty-eight concentric rings began to whirl in silent, counterbalanced harmony. Holographic beams of light, refracted through miniature quartz lenses embedded in the celestial sphere, projected a stellar cartography onto the vaulted ceiling of the crypt. The projection delineated the northern night sky as it appeared over Alexandria in 300 BC, with one pulsing crimson star marking an uncharted coordinates grid along the Nile Delta.",
    keywords: [
      { word: "refracted", meaningFa: "شکسته شد (شکست نور در منشور یا عدسی)", phonetic: "/rɪˈfræktɪd/" },
      { word: "delineated", meaningFa: "ترسیم کرد، با خطوط دقیق به تصویر کشید", phonetic: "/dɪˈlɪnieɪtɪd/" },
      { word: "counterbalanced", meaningFa: "متعادل‌شده، توازن‌یافته با وزنه‌های دقیق", phonetic: "/ˈkaʊntəbælənst/" },
      { word: "cartography", meaningFa: "نقشه‌نگاری، هنر و دانش ترسیم نقشه‌های فلکی و زمینی", phonetic: "/kɑːˈtɒɡrəfi/" },
    ],
    question: {
      promptEn: "What phenomenon occurred when the bronze calculating engine was gently wound?",
      promptFa: "وقتی چرخ‌دنده دستگاه محاسباتی کوک شد چه پدیده شگفت‌انگیزی رخ داد؟",
      options: [
        "It projected the night sky of ancient Alexandria with a pulsed crimson beacon over the Nile Delta",
        "It self-destructed by melting its gears in acidic mineral oil",
        "It sounded an alarm bell that alerted the local antiquities police",
      ],
      correctIndex: 0,
      hintSnippet: "projected a stellar cartography onto the vaulted ceiling of the crypt... marking an uncharted coordinates grid along the Nile Delta",
      clueFa: "خط دوم و سوم رو ببین؛ نور از میان عدسی‌های کوارتز آسمان شب ۳۰۰ سال قبل از میلاد را روی سقف انداخت و نقطه‌ای قرمز در دلتای نیل درخشید!",
    },
    choiceA: {
      labelEn: "Calibrate the delta coordinates against modern satellite thermal imaging data!",
      labelFa: "مختصات کهن دلتای نیل را با داده‌های حرارتی ماهواره‌های مدرن تطبیق بده!",
      descriptionFa: "شناسایی سازه‌های مدفون زیر رسوبات رودخانه نیل از فضا.",
    },
    choiceB: {
      labelEn: "Record the mechanical gear ratios to publish the complete mathematical schematic!",
      labelFa: "ضریب چرخ‌دنده‌ها را ثبت کن تا نقشه فنی کامل این کامپیوتر باستانی در دانشگاه آکسفورد منتشر شود!",
      descriptionFa: "انقلابی علمی در تاریخ مکانیک جهان که تمام کتب درسی را دگرگون می‌کند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "The X-ray fluorescence scan produced a crystalline spectral readout on Soraya's tablet. The bronze gears were forged from an extraordinary alloy of copper, tin, and trace meteoritic iridium—a metallurgic signature unique to the royal workshops of Ptolemaic Egypt. Furthermore, microscopic inscriptions engraved along the inner gear teeth revealed a step-by-step proof of the heliocentric solar system, predating Copernicus and Aristarchus of Samos by centuries.",
    keywords: [
      { word: "iridium", meaningFa: "ایریدیوم (فلز بسیار متراکم، گرانبها و شهاب‌سنگی)", phonetic: "/ɪˈrɪdiəm/" },
      { word: "heliocentric", meaningFa: "خورشیدمرکزی، نظریه گردش زمین به دور خورشید", phonetic: "/ˌhiːliəʊˈsentrɪk/" },
      { word: "metallurgic", meaningFa: "فلزکاری، وابسته به دانش ذوب و آلیاژسازی", phonetic: "/ˌmetəlˈɜːdʒɪk/" },
      { word: "predating", meaningFa: "مقدم بودن بر، تاریخ قبل‌تری داشتن از", phonetic: "/ˌpriːˈdeɪtɪŋ/" },
    ],
    question: {
      promptEn: "What revolutionary scientific theory was engraved along the inner teeth of the gears?",
      promptFa: "کدام نظریه انقلابی علمی روی دندانه‌های داخلی چرخ‌دنده‌ها حکاکی شده بود؟",
      options: [
        "A mathematical proof of the heliocentric solar system predating modern astronomy",
        "An alchemical formula for turning river silt into solid silver",
        "A tactical blueprint for defending Alexandria with giant curved mirrors",
      ],
      correctIndex: 0,
      hintSnippet: "microscopic inscriptions engraved along the inner gear teeth revealed a step-by-step proof of the heliocentric solar system",
      clueFa: "خط چهارم و پنجم رو بخون؛ اثبات ریاضیاتی گردش زمین به دور خورشید قرن‌ها قبل از کوپرنیک حک شده بود!",
    },
    choiceA: {
      labelEn: "Transmit the peer-reviewed spectral findings to the International Astronomical Union!",
      labelFa: "گزارش اسکن آلیاژ و اثبات خورشیدمرکزی را برای اتحادیه بین‌المللی نجوم مخابره کن!",
      descriptionFa: "ثبت افتخاری جاودانه برای دانش مشرق‌زمین و دانشمندان اسکندریه.",
    },
    choiceB: {
      labelEn: "Safely encapsulate the armillary engine in an argon-purged preservation chamber!",
      labelFa: "دستگاه گوی فلکی را در محفظه بدون اکسیژن و پر از گاز آرگون پلمب کن!",
      descriptionFa: "حفاظت دائمی از شاهکار مهندسی بشر در برابر هرگونه اکسیداسیون و فرسایش.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Wading waist-deep into the subterranean cistern beneath the ancient monastery, Julian held the ultraviolet torch over the submerged Roman brickwork. Through the limpid turquoise water, Soraya spotted an underwater archway sealed with bitumen and stamped with the personal signet of Hypatia: an astrolabe encircled by seven stars. Prying the bitumen seal gently with titanium levers, they discovered an airtight copper cylinder holding thirty papyrus scrolls, their inks as fresh as if penned yesterday afternoon.",
    keywords: [
      { word: "limpid", meaningFa: "زلال، شفاف و بسیار پاکیزه", phonetic: "/ˈlɪmpɪd/" },
      { word: "bitumen", meaningFa: "قیر طبیعی ضدآب، ملات قیری باستانی", phonetic: "/ˈbɪtʃʊmən/" },
      { word: "signet", meaningFa: "مهر اختصاصی، نشان سلطنتی یا شخصی", phonetic: "/ˈsɪɡnət/" },
      { word: "levers", meaningFa: "اهرم‌ها، ابزارهای فلزی برای باز کردن", phonetic: "/ˈliːvəz/" },
    ],
    question: {
      promptEn: "What seal marked the submerged copper cylinder found in the monastic cistern?",
      promptFa: "روی استوانه مسی غوطه‌ور در آب‌انبار چه مهری نقش بسته بود؟",
      options: [
        "The personal signet of Hypatia showing an astrolabe encircled by seven stars",
        "The imperial seal of Emperor Justinian in red sealing wax",
        "A carved skull and crossbones of Mediterranean corsairs",
      ],
      correctIndex: 0,
      hintSnippet: "stamped with the personal signet of Hypatia: an astrolabe encircled by seven stars",
      clueFa: "خط سوم و چهارم رو ببین دوست من؛ مهر شخصی بانو هیپاتیا بود: یک اسطرلاب احاطه‌شده توسط هفت ستاره درخشان!",
    },
    choiceA: {
      labelEn: "Unfurl the first scroll in the onsite hyperbaric conservation tent!",
      labelFa: "اولین طومار پاپیروس را داخل چادر حفاظت با هوای تحت فشار باز کن!",
      descriptionFa: "مطالعه دقیق کهن‌ترین نسخه دست‌نویس ریاضیات و فلسفه بدون آسیب به الیاف گیاهی.",
    },
    choiceB: {
      labelEn: "Catalog the thirty scrolls using fiber-optic infrared transillumination!",
      labelFa: "هر سی طومار را با نور فروسرخ بدون باز کردن الیاف پاپیروس اسکن سه‌بعدی کن!",
      descriptionFa: "روشی فوق‌پیشرفته برای خواندن متن در لایه‌های لوله‌شده بدون هیچ‌گونه ریسک فیزیکی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "At exactly 12:04 PM, the desert sun crested the clerestory aperture. The shadow of the Coptic cross drifted across the mosaic floor, its tip coming to rest precisely upon an octagonal porphyry tile adorned with an engraved compass rose. Pressing the eight corner tesserae in mathematical sequence—1, 1, 2, 3, 5, 8, the Fibonacci sequence understood by ancient Hellenistic geometers—the stone floor hissed and sank four feet, revealing a flight of limestone steps leading into an intact Roman hypostyle archive.",
    keywords: [
      { word: "porphyry", meaningFa: "سنگ سماق (سنگ آذرین سرخ‌رنگ سلطنتی و بسیار سخت)", phonetic: "/ˈpɔːfəri/" },
      { word: "clerestory", meaningFa: "ردیف پنجره‌های بالایی در زیر طاق کلیساها و بناهای کهن", phonetic: "/ˈklɪəstɔːri/" },
      { word: "tesserae", meaningFa: "قطعات کوچک موزاییک یا کاشی‌کاری باستانی", phonetic: "/ˈtesəriː/" },
      { word: "hypostyle", meaningFa: "تالار ستون‌دار باستانی با ردیف ستون‌های سنگی", phonetic: "/ˈhaɪpəstaɪl/" },
    ],
    question: {
      promptEn: "What mathematical sequence unlocked the descending staircase under the porphyry tile?",
      promptFa: "کدام دنباله ریاضی پله‌های سنگی به سوی آرشیو باستانی را باز کرد؟",
      options: [
        "The Fibonacci sequence: 1, 1, 2, 3, 5, 8 pressed on the corner tesserae",
        "The prime numbers from 2 to 31 in descending order",
        "The golden ratio calculated to twenty decimal places",
      ],
      correctIndex: 0,
      hintSnippet: "Pressing the eight corner tesserae in mathematical sequence—1, 1, 2, 3, 5, 8",
      clueFa: "خط چهارم رو نگاه کن؛ با فشردن کاشی‌ها طبق دنباله فیبوناچی (۱، ۱، ۲، ۳، ۵، ۸) کف سنگی پایین رفت و پله‌ها نمایان شدند!",
    },
    choiceA: {
      labelEn: "Illuminate the hypostyle hall with cool LED floodlights to inspect the scroll niches!",
      labelFa: "تالار ستون‌دار را با نور ملایم ال‌ای‌دی روشن کن تا طاقچه‌های دست‌نوشته‌ها را بررسی کنی!",
      descriptionFa: "قدم نهادن به تالاری دست‌نخورده پس از ۱۶۰۰ سال سکوت تاریخی.",
    },
    choiceB: {
      labelEn: "Analyze the atmospheric gas composition inside the sealed vault before entering!",
      labelFa: "ترکیب گازهای درون اتاق بسته را پیش از ورود با حسگرهای الکترونیکی بسنج!",
      descriptionFa: "اطمینان از ایمنی ریه‌ها و پیشگیری از اکسید شدن ناگهانی اسناد در معرض هوای آزاد.",
    },
  },

  // STEP 4 (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Satellite synthetic aperture radar corroborated the celestial coordinates: buried beneath thirty meters of alluvial silt near the Rosetta branch of the Nile lay the polygonal foundation of the Mouseion's coastal observatory. Julian and Soraya obtained emergency permits from the Supreme Council of Antiquities, deploying ground-penetrating radar that revealed marble arcades intact beneath the dunes.",
    keywords: [
      { word: "alluvial", meaningFa: "رسوبی، ناشی از گل و لای ته‌نشین‌شده رودخانه", phonetic: "/əˈluːviəl/" },
      { word: "synthetic", meaningFa: "ترکیبی، ساخته‌شده با فناوری پیشرفته راداری", phonetic: "/sɪnˈθetɪk/" },
      { word: "arcades", meaningFa: "ردیف طاق‌ها و راهروهای ستون‌دار باستانی", phonetic: "/ɑːˈkeɪdz/" },
      { word: "dunes", meaningFa: "تپه‌های شنی ساحلی یا بیابانی", phonetic: "/djuːnz/" },
    ],
    question: {
      promptEn: "What architectural structure did ground-penetrating radar detect beneath the silt?",
      promptFa: "رادار نفوذ در زمین چه سازه‌ای را زیر رسوبات دلتای نیل شناسایی کرد؟",
      options: [
        "The intact marble arcades and foundation of the Mouseion's coastal observatory",
        "A subterranean roman amphitheater used for gladiator battles",
        "A submerged naval shipyard filled with sunken triremes",
      ],
      correctIndex: 0,
      hintSnippet: "ground-penetrating radar that revealed marble arcades intact beneath the dunes",
      clueFa: "خط آخر رو ببین؛ رادار نفوذ در خاک، طاق‌های مرمرین دست‌نخورده رصدخانه ساحلی موزیون اسکندریه را زیر شن‌ها نشان داد!",
    },
    choiceA: {
      labelEn: "Commence an international archaeological excavation under UNESCO auspices!",
      labelFa: "کاوش رسمی باستان‌شناسی را تحت نظارت یونسکو آغاز کن!",
      descriptionFa: "بزرگ‌ترین پروژه باستان‌شناسی قرن برای رونمایی از نگین دانش باستان.",
    },
    choiceB: {
      labelEn: "Establish a non-invasive robotic core sampling borehole to survey the chamber!",
      labelFa: "با دوربین‌های رباتیک و باریک بدون تخریب خاک وارد تالار مدفون شو!",
      descriptionFa: "بررسی هوشمندانه فضای داخلی قبل از هرگونه خاک‌برداری گسترده.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Julian published the mechanical schematics in Nature, revealing a 72-gear differential train that calculated the synodic cycle of Venus and the Saros eclipse cycle with micro-arc accuracy. The revelation disproved the dogma that precision gear mechanics originated in the European Renaissance, establishing Alexandria as the birthplace of computational engineering.",
    keywords: [
      { word: "synodic", meaningFa: "هلالی، دوره بازگشت زاویه‌ای سیاره یا ماه نسبت به خورشید", phonetic: "/sɪˈnɒdɪk/" },
      { word: "schematics", meaningFa: "نقشه‌های شماتیک و دیاگرام‌های فنی مهندسی", phonetic: "/skɪˈmætɪks/" },
      { word: "computational", meaningFa: "محاسباتی، مبتنی بر رایانش و داده‌ها", phonetic: "/ˌkɒmpjuˈteɪʃənl/" },
      { word: "differential", meaningFa: "دیفرانسیل، مکانیزم تفاضلی چرخ‌دنده‌ها", phonetic: "/ˌdɪfəˈrenʃl/" },
    ],
    question: {
      promptEn: "What long-held historical dogma did the publication of the gear schematics dismantle?",
      promptFa: "انتشار نقشه‌های فنی چرخ‌دنده‌ها کدام باور قدیمی و تعصب‌آمیز تاریخی را باطل کرد؟",
      options: [
        "That precision geared mechanics originated in the European Renaissance",
        "That the Greeks did not believe the earth was spherical",
        "That water clocks were invented by the Vikings",
      ],
      correctIndex: 0,
      hintSnippet: "The revelation disproved the dogma that precision gear mechanics originated in the European Renaissance",
      clueFa: "خط سوم رو نگاه کن دوست من؛ این باور غلط که چرخ‌دنده‌های دقیق از عصر رنسانس شروع شدند باطل شد و اسکندریه خاستگاه مهندسی شناخته شد!",
    },
    choiceA: {
      labelEn: "Build a functioning titanium replica for the Science Museum in London!",
      labelFa: "یک نمونه کارآمد تیتانیومی از این کامپیوتر باستانی برای موزه علوم لندن بساز!",
      descriptionFa: "جان بخشیدن به نبوغ مهندسان اسکندریه جلوی چشم میلیون‌ها بیننده.",
    },
    choiceB: {
      labelEn: "Incorporate the mathematical algorithm into modern aerospace orbital tracking code!",
      labelFa: "الگوریتم محاسباتی باستان را در سیستم رهگیری مداری هوافضا وارد کن!",
      descriptionFa: "پیوند شگفت‌انگیز دانش دو هزار سال پیش با فضاپیماهای مدرن.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "The International Astronomical Union convened a special assembly in Athens to review the spectral findings. The proof of heliocentrism, verified by five independent metallurgical laboratories, forced historians to rewrite the foundations of science. Dr. Soraya Khorsandi received the prestigious Kepler Medal, addressing thousands of scholars on the enduring brilliance of ancient scholarship.",
    keywords: [
      { word: "metallurgical", meaningFa: "فلز‌شناسی، وابسته به تجزیه و شناخت فلزات", phonetic: "/ˌmetəlˈɜːdʒɪkl/" },
      { word: "heliocentrism", meaningFa: "نظام خورشیدمرکزی کائنات", phonetic: "/ˌhiːliəʊˈsentrɪzəm/" },
      { word: "enduring", meaningFa: "ماندگار، زوال‌ناپذیر و پایدار", phonetic: "/ɪnˈdjʊərɪŋ/" },
      { word: "convened", meaningFa: "تشکیل جلسه دادند، گردهم آمدند", phonetic: "/kənˈviːnd/" },
    ],
    question: {
      promptEn: "What international accolade did Dr. Soraya Khorsandi receive in Athens?",
      promptFa: "دکتر ثریا خرسندی در آتن مفتخر به دریافت چه نشان معتبری شد؟",
      options: [
        "The Kepler Medal for revolutionary contributions to astronomical history",
        "The Nobel Prize in Literature for translating ancient poetry",
        "An honorary captaincy in the Greek merchant navy",
      ],
      correctIndex: 0,
      hintSnippet: "Dr. Soraya Khorsandi received the prestigious Kepler Medal, addressing thousands of scholars",
      clueFa: "خط سوم رو ببین؛ مدال معتبر کپلر را به خاطر اثبات تاریخ نجوم و خورشیدمرکزی در برابر هزاران دانشمند دریافت کرد!",
    },
    choiceA: {
      labelEn: "Establish an endowment for Middle Eastern women in astrophysics and archaeology!",
      labelFa: "بنیاد موقوفه تحصیلی برای دختران خاورمیانه در رشته‌های اخترفیزیک و باستان‌شناسی تاسیس کن!",
      descriptionFa: "هموار کردن راه برای نسل جدید پژوهشگران نخبه در زادگاه این تمدن کهن.",
    },
    choiceB: {
      labelEn: "Lead a joint international symposia series across Alexandria, Athens, and Rome!",
      labelFa: "سلسله همایش‌های بین‌المللی تاریخی را میان اسکندریه، آتن و رم هدایت کن!",
      descriptionFa: "گفت‌وگوی تمدن‌ها بر محور کشفیات دست‌نویس‌های اسکندریه.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Sealed safely within its argon-purged crystal enclosure, the armillary calculating engine was transported under armed escort to the Grand Egyptian Museum in Giza. Positioned in the central atrium bathed in natural sunlight, the artifact became the museum's crowning marvel, flanked by interactive digital holograms that allowed visitors to simulate rotating its 72 bronze gear wheels.",
    keywords: [
      { word: "enclosure", meaningFa: "محفظه پوشیده و ایزوله‌شده، اتاقک بسته", phonetic: "/ɪnˈkləʊʒə(r)/" },
      { word: "escort", meaningFa: "اسکورت حفاظتی، کاروان نگهبانان مسلح", phonetic: "/ˈeskɔːt/" },
      { word: "simulate", meaningFa: "شبیه‌سازی کردن، بازسازی تعاملی رایانه‌ای", phonetic: "/ˈsɪmjuleɪt/" },
      { word: "flanked", meaningFa: "احاطه‌شده در دو سو، قرار گرفته در طرفین", phonetic: "/flæŋkt/" },
    ],
    question: {
      promptEn: "Where was the armillary calculating engine permanently installed for public exhibition?",
      promptFa: "دستگاه محاسباتی گوی فلکی برای نمایش عمومی برای همیشه در کجا نصب شد؟",
      options: [
        "In the central atrium of the Grand Egyptian Museum in Giza with holographic simulations",
        "In a subterranean bank vault beneath Zurich",
        "In the private collection of an anonymous tech investor",
      ],
      correctIndex: 0,
      hintSnippet: "transported under armed escort to the Grand Egyptian Museum in Giza... became the museum's crowning marvel",
      clueFa: "خط اول و دوم رو نگاه کن؛ با اسکورت به موزه بزرگ مصر در جیزه منتقل شد و در سرسرای اصلی با شبیه‌سازهای هولوگرام قرار گرفت!",
    },
    choiceA: {
      labelEn: "Deliver the inaugural keynote speech to three thousand visiting international dignitaries!",
      labelFa: "سخنرانی افتتاحیه را در حضور سه هزار مهمان و سفیر برجسته جهانی ایراد کن!",
      descriptionFa: "روزی باشکوه که تاریخ اسکندریه بر تارک فرهنگ جهان درخشید.",
    },
    choiceB: {
      labelEn: "Guide a group of local Cairo students through their first interactive simulation!",
      labelFa: "دانش‌آموزان مدارس قاهره را برای اولین کار با شبیه‌ساز چرخ‌دنده‌ها راهنمایی کن!",
      descriptionFa: "کاشتن بذر اشتیاق به علم در دل کودکان این سرزمین باستانی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Inside the hyperbaric conservation tent, Julian eased open the first papyrus scroll with micro-forceps. What unrolled was nothing less than the lost treatise 'On Floating Bodies and Mechanical Optics' written in Archimedes' own distinctive Doric Greek. Marginal annotations in purple ink confirmed that Hypatia herself had edited and annotated the work just months before her tragic death.",
    keywords: [
      { word: "treatise", meaningFa: "رساله علمی، مقاله مفصل و مدون تخصصی", phonetic: "/ˈtriːtɪs/" },
      { word: "forceps", meaningFa: "انبرک‌های ظریف جراحی یا حفاظت آثار باستانی", phonetic: "/ˈfɔːseps/" },
      { word: "distinctive", meaningFa: "متمایز، مشخص و دارای ویژگی‌های منحصربه‌فرد", phonetic: "/dɪˈstɪŋktɪv/" },
      { word: "annotated", meaningFa: "حاشیه‌نویسی‌شده، شرح‌داده‌شده با نکات علمی", phonetic: "/ˈænəteɪtɪd/" },
    ],
    question: {
      promptEn: "What lost mathematical masterpiece was contained in the first unrolled papyrus scroll?",
      promptFa: "اولین طومار پاپیروسی که باز شد حاوی کدام شاهکار گم‌شده علمی بود؟",
      options: [
        "Archimedes' treatise 'On Floating Bodies and Mechanical Optics' annotated by Hypatia",
        "A comedic play by Aristophanes mocking Athenian philosophers",
        "A ledger of grain shipments to the Roman legions in Syria",
      ],
      correctIndex: 0,
      hintSnippet: "the lost treatise 'On Floating Bodies and Mechanical Optics' written in Archimedes' own distinctive Doric Greek",
      clueFa: "خط دوم رو ببین؛ رساله گم‌شده ارشمیدس درباره اجسام شناور و اپتیک مکانیکی بود که دست‌نوشته‌های حاشیه آن متعلق به خود بانو هیپاتیا بود!",
    },
    choiceA: {
      labelEn: "Digitize the complete Archimedean manuscript in open-access ultra-high-definition!",
      labelFa: "کل رساله ارشمیدس و حواشی هیپاتیا را با بالاترین کیفیت برای همه مردم جهان آنلاین منتشر کن!",
      descriptionFa: "آزاد کردن دانش برای تمام بشریت بدون هیچ هزینه یا محدودیتی.",
    },
    choiceB: {
      labelEn: "Translate the Greek-Doric text into six modern languages with comprehensive scholarly apparatus!",
      labelFa: "متن یونانی را با توضیحات کامل به ۶ زبان زنده دنیا ترجمه و چاپ کن!",
      descriptionFa: "ارائه متنی شیوا و قابل فهم برای جامعه دانشگاهی و علاقه‌مندان به علم.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "The fiber-optic infrared transillumination revealed text across all thirty scrolls without unrolling a single centimeter of brittle papyrus. The virtual unrolling software reconstructed lost geometric proofs of conical sections, an early treatise on calculus by Eratosthenes, and medical treatises detailing brain anatomy from the physician Herophilus. The discovery expanded the known corpus of classical science by forty percent overnight.",
    keywords: [
      { word: "transillumination", meaningFa: "نورافشانی از پشت شیء برای دیدن لایه‌های داخلی", phonetic: "/ˌtrænzɪˌluːmɪˈneɪʃn/" },
      { word: "brittle", meaningFa: "شکننده، ترد و بسیار آسیب‌پذیر", phonetic: "/ˈbrɪtl/" },
      { word: "corpus", meaningFa: "پیکره، مجموعه کامل اسناد و متون گردآوری‌شده", phonetic: "/ˈkɔːpəs/" },
      { word: "conical", meaningFa: "مخروطی، مقاطع مخروطی در هندسه", phonetic: "/ˈkɒnɪkl/" },
    ],
    question: {
      promptEn: "By how much did the virtual unrolling of the thirty scrolls expand classical scientific literature?",
      promptFa: "بازخوانی مجازی سی طومار باستانی چقدر ادبیات علمی کلاسیک بشر را گسترش داد؟",
      options: [
        "It expanded the known corpus of classical science by forty percent overnight",
        "It duplicated documents already preserved in the Vatican Library",
        "It added only three short commercial poems about Egyptian flax farming",
      ],
      correctIndex: 0,
      hintSnippet: "The discovery expanded the known corpus of classical science by forty percent overnight",
      clueFa: "خط آخر رو نگاه کن دوست من؛ کل مجموعه متون علمی شناخته‌شده دنیای باستان را یک‌شبه ۴۰ درصد افزایش داد!",
    },
    choiceA: {
      labelEn: "Publish the Virtual Alexandrian Library online for global researchers!",
      labelFa: "سامانه آنلاین 'کتابخانه مجازی اسکندریه' را برای تمام پژوهشگران جهان فعال کن!",
      descriptionFa: "تولدی دوباره برای مشهورترین کتابخانه تاریخ در بستر اینترنت.",
    },
    choiceB: {
      labelEn: "Host a global academic symposium in Alexandria to present the newly discovered proofs!",
      labelFa: "کنفرانس بزرگ دانشگاهی را در خود شهر اسکندریه برای بررسی این قضایای ریاضی برگزار کن!",
      descriptionFa: "بازگشت دانشمندان پس از قرن‌ها به زادگاه هیپاتیا و ارشمیدس.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Illuminated by LED lights, the hypostyle hall revealed two hundred cedarwood library cabinets resting in stone alcoves. Each cabinet bore an ivory label engraved with authors whose names had survived only in fragmentary citations: Ctesibius, Aglaonice, Aristarchus. Julian stepped forward, gently sliding open a cedar drawer: stacked inside were scrolls wrapped in oiled linen, untouched by humidity or vermin for sixteen centuries.",
    keywords: [
      { word: "alcoves", meaningFa: "طاقچه‌ها، تورفتگی‌های دیواری باستانی", phonetic: "/ˈælkəʊvz/" },
      { word: "vermin", meaningFa: "حشرات موذی و موریانه‌های آسیب‌رسان به کاغذ", phonetic: "/ˈvɜːmɪn/" },
      { word: "citations", meaningFa: "ارجاعات، استنادهای کوتاه در کتب تاریخی", phonetic: "/saɪˈteɪʃnz/" },
      { word: "cedarwood", meaningFa: "چوب سدر معطر و دافع حشرات", phonetic: "/ˈsiːdəwʊd/" },
    ],
    question: {
      promptEn: "What preserved the scrolls inside the two hundred cedarwood cabinets for sixteen centuries?",
      promptFa: "چه چیزی طومارهای داخل ۲۰۰ کمد چوب سدر را به مدت ۱۶ قرن سالم نگه داشته بود؟",
      options: [
        "They were wrapped in oiled linen inside cedarwood cabinets immune to humidity and vermin",
        "They were petrified into solid stone by volcanic ash",
        "They were submerged in sealed glass jars of olive oil",
      ],
      correctIndex: 0,
      hintSnippet: "stacked inside were scrolls wrapped in oiled linen, untouched by humidity or vermin for sixteen centuries",
      clueFa: "خط آخر رو بخون؛ در کتان روغنی پیچیده شده بودند و چوب سدر معطر اجازه نفوذ رطوبت و موریانه را نداده بود!",
    },
    choiceA: {
      labelEn: "Install climate-controlled microclimate monitoring across the hypostyle chamber!",
      labelFa: "سامانه هوشمند کنترل دما و رطوبت پایدار در کل تالار زیرزمینی نصب کن!",
      descriptionFa: "ایمن‌سازی کامل این گنجینه بی‌نظیر برای نسل‌های آینده.",
    },
    choiceB: {
      labelEn: "Carefully catalogue the first fifty astronomical folios of Aristarchus!",
      labelFa: "پنجاه طومار نجومی آریستارخوس را با شماره‌گذاری دقیق ثبت رسمی کن!",
      descriptionFa: "ثبت آثار ستاره‌شناسی که خورشیدمرکزی را نخستین بار در تاریخ پیشنهاد داد.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Gas sensors confirmed that the vault's atmosphere was stable nitrogen-argon with negligible oxygen, which had prevented biological decay. Soraya and Julian carefully extracted the central bronze catalog chest, inscribed with the Greek dedication: 'To the Seekers of Truth, that reason may survive the dark.' Standing amidst the silent columns, they realized they had rescued the greatest intellectual heritage of human civilization.",
    keywords: [
      { word: "negligible", meaningFa: "ناچیز، بسیار کم و قابل چشم‌پوشی", phonetic: "/ˈneɡlɪdʒəbl/" },
      { word: "dedication", meaningFa: "اهدا، وقف‌نامه و تقدیم‌نامه کتیبه‌ای", phonetic: "/ˌdedɪˈkeɪʃn/" },
      { word: "decay", meaningFa: "پوسیدگی، زوال و فرسایش زیستی", phonetic: "/dɪˈkeɪ/" },
      { word: "heritage", meaningFa: "میراث کهن، دستاورد تاریخی و فرهنگی", phonetic: "/ˈherɪtɪdʒ/" },
    ],
    question: {
      promptEn: "What noble Greek dedication was inscribed upon the central bronze catalog chest?",
      promptFa: "چه وقف‌نامه زیبایی به زبان یونانی روی صندوقچه برنجی مرکزی حک شده بود؟",
      options: [
        "'To the Seekers of Truth, that reason may survive the dark'",
        "'Gold belongs to kings, but silence belongs to the dead'",
        "'Whoever disturbs this crypt shall perish by fire'",
      ],
      correctIndex: 0,
      hintSnippet: "inscribed with the Greek dedication: 'To the Seekers of Truth, that reason may survive the dark.'",
      clueFa: "خط سوم رو ببین؛ حک کرده بودند: 'تقدیم به جویندگان حقیقت، تا مشعل خرد و دانایی در تاریکی‌ها زنده بماند!'",
    },
    choiceA: {
      labelEn: "Broadcast the opening of the catalog live to scientific academies across five continents!",
      labelFa: "گشودن صندوقچه فهرست را زنده برای فرهنگستان‌های علوم پنج قاره جهان پخش کن!",
      descriptionFa: "اشتراک‌گذاری این لحظه تاریخی با تمام انسان‌های خردورز روی زمین.",
    },
    choiceB: {
      labelEn: "Seal a modern gratitude parchment inside the chamber alongside the ancient founders!",
      labelFa: "طومار سپاسگزاری دانشمندان قرن بیست‌ویکم را کنار بنیان‌گذاران باستان به یادگار بگذار!",
      descriptionFa: "پیوند قلبی میان کاشفان امروز و اندیشمندان دو هزار سال پیش.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Under the joint patronage of UNESCO and the Egyptian Ministry of Tourism, the Rosetta delta archaeological dig broke ground. Workers uncovered white Pentelic marble columns, intact mosaics depicting celestial constellations, and an amphitheater where Eratosthenes once computed the circumference of the globe. Julian and Soraya stood together as dawn bathed the ancient stones in rosy light.",
    keywords: [
      { word: "patronage", meaningFa: "حمایت رسمی، سرپرستی و پشتیبانی مالی و دولتی", phonetic: "/ˈpætrənɪdʒ/" },
      { word: "circumference", meaningFa: "محیط دایره یا پیرامون کره زمین", phonetic: "/səˈkʌmfərəns/" },
      { word: "constellations", meaningFa: "صور فلکی، خوشه‌های ستارگان در آسمان شب", phonetic: "/ˌkɒnstəˈleɪʃnz/" },
      { word: "amphitheater", meaningFa: "آمفی‌تئاتر، تماشاخانه باستانی با صندلی‌های پلکانی", phonetic: "/ˈæmfɪθɪətə(r)/" },
    ],
    question: {
      promptEn: "What historical calculation was once performed by Eratosthenes at the unearthed site?",
      promptFa: "اراتوستن در محوطه کشف‌شده چه محاسبه تاریخی و مشهوری را انجام داده بود؟",
      options: [
        "Computing the circumference of the Earth using shadow angles",
        "Calculating the exact speed of Mediterranean winds",
        "Measuring the depth of the Red Sea during low tide",
      ],
      correctIndex: 0,
      hintSnippet: "an amphitheater where Eratosthenes once computed the circumference of the globe",
      clueFa: "خط سوم رو نگاه کن؛ همان آمفی‌تئاتری بود که اراتوستن با زاویه سایه‌ها محیط کره زمین را محاسبه کرده بود!",
    },
    choiceA: {
      labelEn: "Inaugurate the International Research Center of Hellenistic Astronomy!",
      labelFa: "مرکز بین‌المللی پژوهش‌های ستاره‌شناسی باستان را در همان محل افتتاح کن!",
      descriptionFa: "تبدیل محوطه به پردیسی پرجنب‌وجوش برای دانشمندان جهان.",
    },
    choiceB: {
      labelEn: "Watch the golden sun crest the Nile with tears of scholarly gratitude!",
      labelFa: "طلوع خورشید طلایی بر نیل را با اشک شوق و قدردانی از تاریخ تماشا کن!",
      descriptionFa: "پایانی معنوی، آرام‌بخش و شکوهمند در دل تمدن مصر.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The robotic micro-borehole entered the subterranean chamber without displacing a single grain of ancient sand. The 4K probe beamed panoramic imagery of gilded papyrus urns, astrolabes, and a life-sized bronze statue of Hypatia seated at a drafting table. The global archaeological community watched the live stream in breathless awe.",
    keywords: [
      { word: "panoramic", meaningFa: "پانوراما، چشم‌انداز ۳۶۰ درجه و گسترده", phonetic: "/ˌpænəˈræmɪk/" },
      { word: "urns", meaningFa: "کوزه‌ها و خمره‌های باستانی نگهداری اسناد", phonetic: "/ɜːnz/" },
      { word: "probe", meaningFa: "کاوشگر الکترونیکی یا دوربین رباتیک", phonetic: "/prəʊb/" },
      { word: "displacing", meaningFa: "جا‌به‌جا کردن، تکان دادن و به هم ریختن", phonetic: "/dɪsˈpleɪsɪŋ/" },
    ],
    question: {
      promptEn: "What central statue was illuminated by the robotic probe inside the sealed chamber?",
      promptFa: "دوربین رباتیک در مرکز تالار پلمب‌شده تصویر چه تندیسی را مخابره کرد؟",
      options: [
        "A life-sized bronze statue of Hypatia seated at a drafting table",
        "A marble lion holding an Egyptian ankh key",
        "A golden likeness of Alexander the Great wearing a Persian helmet",
      ],
      correctIndex: 0,
      hintSnippet: "a life-sized bronze statue of Hypatia seated at a drafting table",
      clueFa: "خط دوم و سوم رو ببین؛ تندیس برنجی و در اندازه واقعی بانو هیپاتیا که پشت میز طراحی نشسته بود!",
    },
    choiceA: {
      labelEn: "Declare the chamber an inviolable international cultural sanctuary!",
      labelFa: "تالار را به عنوان پناهگاه بین‌المللی و دست‌نخورده فرهنگ بشریت اعلام کن!",
      descriptionFa: "حفظ حریم این معبد علم برای ابدیت بدون هیچ دست‌کاری تجاری.",
    },
    choiceB: {
      labelEn: "Compose the foundational charter of the Hypatia Science Fellowship!",
      labelFa: "اساسنامه بنیاد بورسیه جهانی علوم هیپاتیا را همان شب تدوین کن!",
      descriptionFa: "الهام بخشیدن به دانشمندان زن در تمام دانشگاه‌های دنیا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The gleaming titanium replica of the 72-gear calculating engine was unveiled in London before three thousand mathematicians and historians. When Julian demonstrated the mechanism predicting an eclipse down to the exact second, the auditorium rose in thunderous acclaim. The working model proved that human intellect had achieved modern computational precision two millennia ago.",
    keywords: [
      { word: "acclaim", meaningFa: "تحسین پرشور، ستایش و تشویق همگانی", phonetic: "/əˈkleɪm/" },
      { word: "auditorium", meaningFa: "تالار همایش، سالن بزرگ سخنرانی", phonetic: "/ˌɔːdɪˈtɔːriəm/" },
      { word: "replica", meaningFa: "ماکت دقیق، نمونه بازسازی‌شده همتا", phonetic: "/ˈreplɪkə/" },
      { word: "millennia", meaningFa: "هزاره‌ها (جمع هزاره، هر هزاره هزار سال)", phonetic: "/mɪˈleniə/" },
    ],
    question: {
      promptEn: "What capability of the titanium replica stunned the gathered mathematicians in London?",
      promptFa: "کدام توانایی ماکت تیتانیومی ریاضیدانان حاضر در لندن را شگفت‌زده کرد؟",
      options: [
        "It predicted an eclipse down to the exact second using its 72 gears",
        "It generated electricity using internal magnets",
        "It decoded ancient encrypted Roman military ciphers",
      ],
      correctIndex: 0,
      hintSnippet: "Julian demonstrated the mechanism predicting an eclipse down to the exact second",
      clueFa: "خط دوم رو ببین؛ پیش‌بینی زمان دقیق وقوع کسوف تا ثانیه آخر با چرخ‌دنده‌های مکانیکی تالار را مبهوت کرد!",
    },
    choiceA: {
      labelEn: "Tour the working model across university campuses in twenty-four countries!",
      labelFa: "این مدل فعال را در دانشگاه‌های ۲۴ کشور جهان به نمایش بگذار!",
      descriptionFa: "برانگیختن شوق مهندسی و علم در میان میلیون‌ها دانشجوی جوان.",
    },
    choiceB: {
      labelEn: "Publish an open-source 3D printable blueprint for schools worldwide!",
      labelFa: "نقشه سه‌بعدی رایگان ساخت دستگاه را برای مدارس سراسر جهان منتشر کن!",
      descriptionFa: "هر مدرسه‌ای در دنیا بتواند این کامپیوتر باستانی را خودش بسازد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Engineers at the European Space Agency integrated the Archimedean gear differential ratios into the navigational telemetry of a deep-space comet rendezvous probe. The algorithm, running on microchips millions of miles from Earth, computed orbital intersections with flawless efficiency, turning an ancient Alexandrian mathematical insight into a guide across the cosmos.",
    keywords: [
      { word: "telemetry", meaningFa: "دورسنجی، ارسال بی‌سیم داده‌های اندازه‌گیری از فضا", phonetic: "/təˈlemətri/" },
      { word: "rendezvous", meaningFa: "ملاقات مداری فضاپیما با جرم آسمانی", phonetic: "/ˈrɒndeɪvuː/" },
      { word: "cosmos", meaningFa: "کیهان، جهان هستی و افلاک بی‌پایان", phonetic: "/ˈkɒzmɒs/" },
      { word: "efficiency", meaningFa: "بهره‌وری، کارایی بالا و بی‌نقص", phonetic: "/ɪˈfɪʃnsi/" },
    ],
    question: {
      promptEn: "How did the European Space Agency apply the ancient Alexandrian algorithm?",
      promptFa: "سازمان فضایی اروپا الگوریتم باستانی اسکندریه را چطور به کار گرفت؟",
      options: [
        "In the navigational telemetry of a deep-space comet rendezvous probe",
        "To calculate fuel consumption for transatlantic commercial airliners",
        "To design landing parachutes for Mars rovers",
      ],
      correctIndex: 0,
      hintSnippet: "integrated the Archimedean gear differential ratios into the navigational telemetry of a deep-space comet rendezvous probe",
      clueFa: "خط اول و دوم رو نگاه کن؛ در سیستم ناوبری فضاپیمای کاوشگر دنباله‌دار در اعماق فضا به کار رفت!",
    },
    choiceA: {
      labelEn: "Broadcast the historic probe comet rendezvous live from mission control!",
      labelFa: "رسیدن موفق فضاپیما به دنباله‌دار را زنده از اتاق فرمان فضایی پخش کن!",
      descriptionFa: "لحظه افتخار بشر وقتی علم باستان فضاپیمای مدرن را به مقصد رساند.",
    },
    choiceB: {
      labelEn: "Name the newly mapped crater on the comet 'Hypatia' in eternal tribute!",
      labelFa: "دهانه تازه کشف‌شده روی دنباله‌دار را به یاد بانو هیپاتیا نام‌گذاری کن!",
      descriptionFa: "ثبت نام بانوی خرد اسکندریه در نقشه دائمی منظومه شمسی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "The Middle Eastern Women in Science Endowment launched in Cairo with forty million dollars in scholarship capital. Standing in the historic auditorium where she had first studied, Dr. Soraya Khorsandi presented doctoral fellowships to sixty brilliant young women in physics, astrobiology, and archaeology, ensuring that Hypatia's legacy would never fade.",
    keywords: [
      { word: "endowment", meaningFa: "موقوفه، بنیاد مالی پایدار برای امور خیریه و علمی", phonetic: "/ɪnˈdaʊmənt/" },
      { word: "fellowships", meaningFa: "بورسیه‌های پژوهشی تخصصی برای دانشجویان نخبه", phonetic: "/ˈfeləʊʃɪps/" },
      { word: "astrobiology", meaningFa: "اخترزیست‌شناسی، پژوهش حیات در کیهان", phonetic: "/ˌæstrəʊbaɪˈɒlədʒi/" },
      { word: "legacy", meaningFa: "میراث ماندگار، یادگار گرانبهای گذشتگان", phonetic: "/ˈleɡəsi/" },
    ],
    question: {
      promptEn: "What was the mission of the endowment launched by Dr. Soraya Khorsandi?",
      promptFa: "رسالت بنیاد موقوفه‌ای که دکتر ثریا خرسندی افتتاح کرد چه بود؟",
      options: [
        "To award doctoral fellowships to brilliant Middle Eastern women in science",
        "To purchase rare gold coins from private European auctions",
        "To fund submarine tourist excursions along the Alexandria coast",
      ],
      correctIndex: 0,
      hintSnippet: "presented doctoral fellowships to sixty brilliant young women in physics, astrobiology, and archaeology",
      clueFa: "خط سوم رو ببین؛ اهدای بورسیه تحصیلی دکترا به ۶۰ دختر نخبه در فیزیک، اخترزیست‌شناسی و باستان‌شناسی بود.",
    },
    choiceA: {
      labelEn: "Embrace the sixty doctoral scholars on the auditorium stage with joyful tears!",
      labelFa: "دانشجویان نخبه را روی صحنه با اشک شوق در آغوش بگیر و تشویق کن!",
      descriptionFa: "دیدن آینده درخشان علمی منطقه در چشمان پرامید نسل جوان.",
    },
    choiceB: {
      labelEn: "Publish the inaugural anthology of scientific discoveries made by the fellows!",
      labelFa: "اولین کتاب مقالات و کشفیات علمی این پژوهشگران جوان را منتشر کن!",
      descriptionFa: "درخشش مقالات علمی دختران خاورمیانه در معتبرترین ژورنال‌های جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The tri-city symposia series connected Alexandria, Athens, and Rome via synchronized satellite links. Over two million citizens and scholars joined the civic debates on scientific reason, democracy, and preservation. Standing in the restored Roman theater in Alexandria, Julian concluded: 'We did not merely recover parchment; we recovered our collective faith in human curiosity.'",
    keywords: [
      { word: "synchronized", meaningFa: "همگام‌سازی‌شده، هماهنگ و هم‌زمان", phonetic: "/ˈsɪŋkrənaɪzd/" },
      { word: "civic", meaningFa: "مدنی، وابسته به شهروندان و جامعه مدنی", phonetic: "/ˈsɪvɪk/" },
      { word: "curiosity", meaningFa: "کنجکاوی، حس جست‌وجوگری و اشتیاق دانستن", phonetic: "/ˌkjʊəriˈɒsəti/" },
      { word: "collective", meaningFa: "جمعی، مشترک میان تمام انسان‌ها", phonetic: "/kəˈlektɪv/" },
    ],
    question: {
      promptEn: "What profound conclusion did Julian share at the restored Roman theater?",
      promptFa: "جولین در تماشاخانه رومی اسکندریه به چه نتیجه‌گیری عمیقی رسید؟",
      options: [
        "We did not merely recover parchment; we recovered our faith in human curiosity",
        "All ancient amphitheaters should be converted into modern movie theaters",
        "Archaeology is only valuable if it uncovers precious gemstones",
      ],
      correctIndex: 0,
      hintSnippet: "We did not merely recover parchment; we recovered our collective faith in human curiosity",
      clueFa: "خط آخر رو نگاه کن دوست من؛ گفت ما فقط پوست‌نوشته پیدا نکردیم، بلکه ایمان مشترکمان به کنجکاوی و خرد بشر را دوباره بازیافتیم!",
    },
    choiceA: {
      labelEn: "Lead the assembly in a heartfelt standing ovation echoing across the harbor!",
      labelFa: "دست زدن ایستاده حاضران را هدایت کن تا طنین آن بر فراز بندرگاه بپیچد!",
      descriptionFa: "لحظه‌ای تاریخی که غرور و امید را به قلب مردم اسکندریه بازگرداند.",
    },
    choiceB: {
      labelEn: "Unfurl an olive branch peace banner between the flags of Egypt, Greece, and Italy!",
      labelFa: "پرچم صلح با نشان شاخه زیتون را میان پرچم‌های مصر، یونان و ایتالیا برافراز!",
      descriptionFa: "نماد اتحاد دوباره سه تمدن کهن دریای مدیترانه پس از قرن‌ها.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Inside the sunlit atrium of the Grand Egyptian Museum, three thousand diplomats, royalty, and scientists witnessed the ceremonial activation of the armillary calculating engine. As the 72 bronze wheels turned with rhythmic precision, the mechanical sphere aligned with the planets in real time. The President of Egypt presented Julian and Soraya with the Grand Cordon of the Nile.",
    keywords: [
      { word: "atrium", meaningFa: "سرسرای مرکزی با سقف بلند و نورگیر شیشه‌ای", phonetic: "/ˈeɪtriəm/" },
      { word: "cordon", meaningFa: "حمایل و نشان افتخار عالی دولتی", phonetic: "/ˈkɔːdn/" },
      { word: "ceremonial", meaningFa: "تشریفاتی، با آداب و رسوم رسمی", phonetic: "/ˌserəˈməʊniəl/" },
      { word: "rhythmic", meaningFa: "موزون، دارای آهنگ و ضرب‌آهنگ منظم", phonetic: "/ˈrɪðmɪk/" },
    ],
    question: {
      promptEn: "What highest state honor did the President of Egypt confer upon Julian and Soraya?",
      promptFa: "رئیس‌جمهور مصر چه نشان عالی دولتی را به جولین و ثریا اعطا کرد؟",
      options: [
        "The Grand Cordon of the Nile for recovering the nation's crowning intellectual treasure",
        "A golden key to the port of Alexandria",
        "An honorary captaincy of the presidential yacht",
      ],
      correctIndex: 0,
      hintSnippet: "The President of Egypt presented Julian and Soraya with the Grand Cordon of the Nile",
      clueFa: "خط آخر رو ببین؛ بالاترین نشان افتخار کشور यानी 'حمایل بزرگ نیل' را به پاس نجات این گنجینه بی‌همتا به آنها اهدا کرد!",
    },
    choiceA: {
      labelEn: "Bow respectfully to the assembled international delegation with humble grace!",
      labelFa: "با تواضع و وقار در برابر نمایندگان کشورهای جهان سر تعظیم فرود آور!",
      descriptionFa: "پایانی شکوهمند برای دو دانشمندی که نامشان در تاریخ جاودانه شد.",
    },
    choiceB: {
      labelEn: "Invite the children of Cairo to step forward and touch the outer protective glass!",
      labelFa: "بچه‌های قاهره را دعوت کن تا جلو بیایند و شیشه محافظ این شاهکار را لمس کنند!",
      descriptionFa: "بخشیدن حس غرور و الهام به نسلی که صاحب واقعی این میراثند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "A class of forty schoolchildren from a Cairo public school gathered around the interactive hologram station. Ten-year-old Amina reached out, spinning the virtual bronze gear of the Antikythera-Alexandrian computer with her fingertips, watching celestial orbits dance on the glass. Julian smiled gently: 'Never forget, Amina—the same blood and curiosity that designed these stars flows through you today.'",
    keywords: [
      { word: "interactive", meaningFa: "تعاملی، دارای امکان مشارکت دوطرفه", phonetic: "/ˌɪntərˈæktɪv/" },
      { word: "hologram", meaningFa: "هولوگرام، تصویر سه‌بعدی نوری شناور در فضا", phonetic: "/ˈhɒləɡræm/" },
      { word: "celestial", meaningFa: "آسمانی، فلکی و وابسته به ستارگان", phonetic: "/səˈlestiəl/" },
      { word: "fingertips", meaningFa: "سرانگشتان، نوک انگشتان دست", phonetic: "/ˈfɪŋɡətɪps/" },
    ],
    question: {
      promptEn: "What encouraging words did Julian share with ten-year-old Amina at the museum?",
      promptFa: "جولین چه سخن دلگرم‌کننده‌ای به امینه، دختر ده‌ساله دانش‌آموز در موزه گفت؟",
      options: [
        "'The same blood and curiosity that designed these stars flows through you today'",
        "'You must memorize all Greek planetary names before tomorrow morning'",
        "'Machines can never replace the beauty of an antique brass compass'",
      ],
      correctIndex: 0,
      hintSnippet: "the same blood and curiosity that designed these stars flows through you today",
      clueFa: "خط آخر رو نگاه کن دوست من؛ بهش گفت: 'هیچ‌وقت یادت نره، همون خون و همون حس کنجکاوی که این افلاک رو خلق کرد، امروز در رگ‌های تو جاریه!'",
    },
    choiceA: {
      labelEn: "Hand Amina a small miniature brass model of the astronomical gear!",
      labelFa: "یک ماکت مینیاتوری برنجی از چرخ‌دنده نجومی را به امینه یادگاری بده!",
      descriptionFa: "هدیه‌ای کوچک که شاید جرقه‌ای برای تولد دانشمندی بزرگ شود.",
    },
    choiceB: {
      labelEn: "Watch the children's eyes light up with wonder under the museum's glass dome!",
      labelFa: "برق شگفتی و شوق را در چشمان کودکان زیر گنبد شیشه‌ای موزه تماشا کن!",
      descriptionFa: "پایانی گرم، الهام‌بخش و پر از امید برای فردای دانش.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "The open-access digital release of Archimedes' 'On Floating Bodies' overwhelmed academic servers worldwide. Within twelve hours, three million readers downloaded the high-resolution folios. Mathematicians, engineers, and philosophers celebrated the definitive proof that classical science had conceptualized calculus and hydrodynamics millennia ahead of its time.",
    keywords: [
      { word: "open-access", meaningFa: "دسترسی آزاد و رایگان برای عموم بدون اشتراک پولی", phonetic: "/ˌəʊpən ˈækses/" },
      { word: "hydrodynamics", meaningFa: "هیدرودینامیک، دینامیک شاره‌ها و حرکت مایعات", phonetic: "/ˌhaɪdrəʊdaɪˈnæmɪks/" },
      { word: "folios", meaningFa: "برگه‌های بزرگ دست‌نوشته‌های کهن", phonetic: "/ˈfəʊliəʊz/" },
      { word: "definitive", meaningFa: "قطعی، نهایی و تردیدناپذیر", phonetic: "/dɪˈfɪnətɪv/" },
    ],
    question: {
      promptEn: "How many downloads of the open-access Archimedes manuscript occurred in twelve hours?",
      promptFa: "در دوازده ساعت اول انتشار آزاد رساله ارشمیدس چند بار دانلود شد؟",
      options: [
        "Three million readers downloaded the high-resolution folios",
        "Only fifty specialist university professors downloaded the file",
        "Ten thousand military engineers accessed the mathematical text",
      ],
      correctIndex: 0,
      hintSnippet: "Within twelve hours, three million readers downloaded the high-resolution folios",
      clueFa: "خط دوم رو ببین؛ سه میلیون نفر در کمتر از ۱۲ ساعت این برگه‌های باکیفیت را دانلود کردند!",
    },
    choiceA: {
      labelEn: "Celebrate the viral triumph with the digital archival team in Alexandria!",
      labelFa: "پیروزی جهانی انتشار اینترنتی را با تیم انفورماتیک در اسکندریه جشن بگیر!",
      descriptionFa: "دیدن ثمره ماه‌ها تلاش در استقبال میلیونی انسان‌ها از علم.",
    },
    choiceB: {
      labelEn: "Toast a cup of Egyptian mint tea to Archimedes and Hypatia under the starlight!",
      labelFa: "یک فنجان چای نعنای داغ مصری زیر آسمان شب به یاد ارشمیدس و هیپاتیا بنوش!",
      descriptionFa: "لحظه‌ای آرام و لبریز از خلسه در حیاط باصفای کتابخانه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The multi-language translation volume, complete with extensive commentary and high-definition color facsimiles, was awarded the Nobel Prize in Literature’s special citation for historical restitution. Universities on every continent integrated the newly recovered proofs into their standard undergraduate mathematics curricula, restoring ancient scholarship to its rightful throne.",
    keywords: [
      { word: "restitution", meaningFa: "اعاده حق، بازگرداندن میراث غصب‌شده یا گمشده", phonetic: "/ˌrestɪˈtjuːʃn/" },
      { word: "facsimiles", meaningFa: "نسخه‌های عکسی و بازتولیدهای دقیق از روی اصل سند", phonetic: "/fækˈsɪmɪliz/" },
      { word: "curricula", meaningFa: "برنامه‌های درسی دانشگاهی و آموزشی (جمع curriculum)", phonetic: "/kəˈrɪkjələ/" },
      { word: "undergraduate", meaningFa: "دوره کارشناسی دانشجویان دانشگاه", phonetic: "/ˌʌndəˈɡrædʒuət/" },
    ],
    question: {
      promptEn: "What global recognition was awarded to the complete multi-language edition of the palimpsest?",
      promptFa: "نسخه چندزبانه کامل دست‌نوشته چه افتخار بین‌المللی کسب کرد؟",
      options: [
        "A special Nobel Prize citation for historical restitution and global integration into curricula",
        "A gold trophy from the International Olympic Committee",
        "An honorary membership in the French Foreign Legion",
      ],
      correctIndex: 0,
      hintSnippet: "awarded the Nobel Prize in Literature’s special citation for historical restitution",
      clueFa: "خط دوم رو ببین دوست من؛ نشان تقدیر ویژه نوبل ادبیات را به پاس احیای تاریخ دریافت کرد و وارد متون درسی دانشگاه‌های جهان شد!",
    },
    choiceA: {
      labelEn: "Deliver the Nobel acceptance address in Stockholm honoring forgotten scholars!",
      labelFa: "خطابه دریافت نوبل را در استکهلم به یاد دانشمندان گمنام تاریخ ایراد کن!",
      descriptionFa: "یادآوری نام صدها فیلسوف و دانشمندی که در سایه تعصبات تاریخ فراموش شدند.",
    },
    choiceB: {
      labelEn: "Sign presentation copies for national libraries across sixty developing countries!",
      labelFa: "نسخه‌های نفیس کتاب را برای کتابخانه‌های ملی ۶۰ کشور در حال توسعه امضا و ارسال کن!",
      descriptionFa: "رساندن نور دانش اصیل به کتابخانه‌های سراسر گیتی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The 'Virtual Alexandrian Library' portal went live, granting every human being with an internet connection free, searchable access to the reconstructed scrolls of Eratosthenes, Archimedes, and Herophilus. Over ten million users accessed the portal during its first weekend, transcribing, translating, and discovering forgotten theorems from their own living rooms.",
    keywords: [
      { word: "reconstructed", meaningFa: "بازسازی‌شده، مرمت‌شده و دوباره پیاده‌سازی‌شده", phonetic: "/ˌriːkənˈstrʌktɪd/" },
      { word: "theorems", meaningFa: "قضایای هندسی و ریاضی اثبات‌شده", phonetic: "/ˈθɪərəmz/" },
      { word: "portal", meaningFa: "پرتال جامع اینترنتی، درگاه دسترسی دیجیتال", phonetic: "/ˈpɔːtl/" },
      { word: "transcribing", meaningFa: "رونویسی کردن، استنساخ حروف کهن به خط مدرن", phonetic: "/trænˈskraɪbɪŋ/" },
    ],
    question: {
      promptEn: "How many users engaged with the Virtual Alexandrian Library portal on its opening weekend?",
      promptFa: "در اولین آخر هفته راه‌اندازی پرتال کتابخانه مجازی اسکندریه چند نفر وارد آن شدند؟",
      options: [
        "Over ten million users transcribing, translating, and exploring forgotten theorems",
        "Barely three hundred specialized scholars from Oxford",
        "Only government employees reviewing copyright laws",
      ],
      correctIndex: 0,
      hintSnippet: "Over ten million users accessed the portal during its first weekend",
      clueFa: "خط سوم رو نگاه کن؛ بیش از ۱۰ میلیون نفر از سراسر جهان وارد سایت شدند و به رونویسی قضایای فراموش‌شده پرداختند!",
    },
    choiceA: {
      labelEn: "Watch live user traffic map illuminate cities and villages across every continent!",
      labelFa: "نقشه زنده اتصال کاربران را تماشا کن که شهرهای سراسر پنج قاره را غرق نور کرده!",
      descriptionFa: "دیدن تحقق رویای خرد همگانی در دهکده جهانی.",
    },
    choiceB: {
      labelEn: "Award the first crowdsourced transcription prize to a student from Nairobi!",
      labelFa: "جایزه اولین بازخوانی متن را به یک دانشجوی باهوش از نایروبی اهدا کن!",
      descriptionFa: "جشن گرفتن برابری فرصت‌های علمی برای تمام فرزندان زمین.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "In the modern Bibliotheca Alexandrina, scholars from seventy nations gathered for the Great Symposium of Recovered Knowledge. As Soraya and Julian stepped to the podium, the four-thousand-seat auditorium erupted into a five-minute standing ovation. Outside, the Mediterranean waves broke gently against the corniche, as if applauding the return of its lost crown.",
    keywords: [
      { word: "corniche", meaningFa: "بلوار و جاده ساحلی صخره‌ای و مشرف به دریا", phonetic: "/kɔːˈniːʃ/" },
      { word: "symposium", meaningFa: "همایش علمی، گردهمایی پژوهشگران و صاحب‌نظران", phonetic: "/sɪmˈpəʊziəm/" },
      { word: "erupted", meaningFa: "منفجر شد، به ناگاه با شور و فریاد شادمانه برخاست", phonetic: "/ɪˈrʌptɪd/" },
      { word: "ovation", meaningFa: "تشویق ایستاده و پرشور حاضران", phonetic: "/əʊˈveɪʃn/" },
    ],
    question: {
      promptEn: "What symbolic scene took place outside as the symposium cheered Soraya and Julian?",
      promptFa: "هم‌زمان با تشویق پرشور در سالن همایش، چه صحنه نمادینی در ساحل بیرون رخ داد؟",
      options: [
        "The Mediterranean waves broke gently against the corniche as if applauding the return of its crown",
        "A sudden thunderous waterspout sank fishing vessels in the harbor",
        "A flock of seagulls landed on the library dome in military formation",
      ],
      correctIndex: 0,
      hintSnippet: "Outside, the Mediterranean waves broke gently against the corniche, as if applauding the return of its lost crown",
      clueFa: "خط آخر رو بخون؛ موج‌های آرام دریای مدیترانه به ساحل می‌خوردند گویی برای بازگشت نگین گم‌شده‌شان دست می‌زدند!",
    },
    choiceA: {
      labelEn: "Deliver the keynote address declaring the rebirth of scientific humanism!",
      labelFa: "سخنرانی افتتاحیه را درباره تولد دوباره اومانیسم و خرد علمی ایراد کن!",
      descriptionFa: "پیامی ماندگار برای پیوند زدن علم مدرن با اخلاق و دانایی کهن.",
    },
    choiceB: {
      labelEn: "Walk along the moonlit Mediterranean shore in quiet, peaceful fulfillment!",
      labelFa: "در ساحل مهتابی مدیترانه با آرامش و احساس رضایت عمیق قدم بزن!",
      descriptionFa: "پایانی رویایی و سرشار از آسودگی خاطر پس از اتمام ماموریتی تاریخی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The subterranean hypostyle hall was transformed into the world's most secure environmental sanctuary for ancient manuscripts. Encased in temperature-regulated glass vaults bathed in non-actinic amber lighting, the cedarwood cabinets of Aristarchus and Hypatia welcomed researchers from across the globe, protected for another thousand years.",
    keywords: [
      { word: "non-actinic", meaningFa: "غیرفعال نوری، نوری که مواد حساس شیمیایی و کاغذ را تخریب نمی‌کند", phonetic: "/ˌnɒnækˈtɪnɪk/" },
      { word: "sanctuary", meaningFa: "پناهگاه مقدس، جایگاه امن و محافظت‌شده", phonetic: "/ˈsæŋktʃuəri/" },
      { word: "amber", meaningFa: "کهربایی، رنگ زرد متمایل به قهوه‌ای گرم", phonetic: "/ˈæmbə(r)/" },
      { word: "encased", meaningFa: "پوشیده در محفظه، جاسازی‌شده در قاب شیشه‌ای", phonetic: "/ɪnˈkeɪst/" },
    ],
    question: {
      promptEn: "What protective lighting was installed to safeguard the cedarwood cabinets in the vault?",
      promptFa: "برای در امان ماندن کمدهای چوب سدر و دست‌نوشته‌ها چه نوری در تالار تعبیه شد؟",
      options: [
        "Non-actinic amber lighting that does not degrade fragile organic materials",
        "Intense strobe halogen beams for television broadcasting",
        "Fluorescent neon blue tubes powered by solar generators",
      ],
      correctIndex: 0,
      hintSnippet: "bathed in non-actinic amber lighting, the cedarwood cabinets of Aristarchus and Hypatia welcomed researchers",
      clueFa: "خط دوم رو ببین؛ نور کهربایی بی‌ضرر و محافظی نصب شد تا الیاف حساس و باستانی کاغذ تخریب نشوند.",
    },
    choiceA: {
      labelEn: "Escort the first team of visiting paleographers into the amber sanctuary!",
      labelFa: "اولین تیم متخصصان خطوط کهن را به تالار کهربایی هدایت کن!",
      descriptionFa: "آغاز فصلی نوین در خواندن اسناد محرمانه دنیای باستان.",
    },
    choiceB: {
      labelEn: "Sign the sanctuary ledger as Chief Curators of the Alexandrian Vault!",
      labelFa: "دفترچه رسمی نگهداری گنجینه را به عنوان امین و سرپرست ارشد امضا کن!",
      descriptionFa: "پذیرش مسئولیتی مقدس برای پاسداری از خرد بشریت.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Dr. Julian Mercer completed the definitive 500-page critical edition of Aristarchus’s 'On the Sizes and Distances of the Sun and Moon'. The manuscript proved that the ancient astronomer had calculated the distance to the moon within one percent of modern laser measurements, fundamentally altering the timeline of human scientific achievement.",
    keywords: [
      { word: "definitive", meaningFa: "مرجع، بی‌نقص و سند نهایی علمی", phonetic: "/dɪˈfɪnətɪv/" },
      { word: "critical edition", meaningFa: "تصحیح انتقادی نسخه خطی با مقابله نسخه‌ها", phonetic: "/ˈkrɪtɪkl ɪˈdɪʃn/" },
      { word: "fundamentally", meaningFa: "به‌طور بنیادین، از ریشه و اساس", phonetic: "/ˌfʌndəˈmentəli/" },
      { word: "altering", meaningFa: "دگرگون‌کننده، تغییردهنده", phonetic: "/ˈɔːltərɪŋ/" },
    ],
    question: {
      promptEn: "What astonishing accuracy did Aristarchus achieve in his calculated lunar distance?",
      promptFa: "محاسبه آریستارخوس برای فاصله ماه تا زمین چه دقت شگفت‌انگیزی داشت؟",
      options: [
        "Within one percent of modern laser measurements",
        "Off by more than fifty percent due to spherical distortion",
        "Equal only to crude Babylonian sundial estimates",
      ],
      correctIndex: 0,
      hintSnippet: "calculated the distance to the moon within one percent of modern laser measurements",
      clueFa: "خط سوم رو نگاه کن دوست من؛ فاصله ماه تا زمین را با دقتی معادل یک درصد اندازه‌گیری‌های لیزری امروز به دست آورده بود!",
    },
    choiceA: {
      labelEn: "Present the critical edition to the Royal Astronomical Society in London!",
      labelFa: "نسخه تصحیح انتقادی را به انجمن سلطنتی نجوم در لندن تقدیم کن!",
      descriptionFa: "افتخاری بزرگ در معتبرترین محفل ستاره‌شناسی جهان.",
    },
    choiceB: {
      labelEn: "Place a copy beside Newton’s Principia in Cambridge University Library!",
      labelFa: "یک جلد از کتاب را کنار کتاب اصول ریاضی نیوتن در کمبریج بگذار!",
      descriptionFa: "قراردادن اثر اسکندریه در جایگاه واقعی‌اش در کنار بزرگ‌ترین آثار تاریخ علم.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "The worldwide live broadcast reached over eighty million viewers as the central bronze catalog was unlocked. Inside lay the master index of all seven hundred thousand scrolls once housed in the Great Library of Alexandria, organized by Callimachus' pinakes cataloging system. Historians wept openly across news studios as titles of lost plays by Sophocles and lost histories by Polybius were read aloud.",
    keywords: [
      { word: "pinakes", meaningFa: "پیناکس (اولین نظام رده‌بندی و فهرست‌نویسی کتابداری جهان در اسکندریه)", phonetic: "/ˈpɪnəkiːz/" },
      { word: "cataloging", meaningFa: "فهرست‌نویسی، رده‌بندی کتابداری اسناد", phonetic: "/ˈkætəlɒɡɪŋ/" },
      { word: "unlocked", meaningFa: "قفل‌گشایی‌شده، باز شده", phonetic: "/ʌnˈlɒkt/" },
      { word: "broadcast", meaningFa: "پخش زنده رادیویی یا تلویزیونی", phonetic: "/ˈbrɔːdkɑːst/" },
    ],
    question: {
      promptEn: "What invaluable historical record was contained inside the central bronze chest?",
      promptFa: "صندوقچه برنجی مرکزی حاوی چه سند تاریخی فوق‌العاده باارزشی بود؟",
      options: [
        "The master index of all 700,000 scrolls of the Great Library organized by Callimachus",
        "The personal diary of Cleopatra describing naval victories",
        "An inventory of gold bullion stored in Alexandria's citadel",
      ],
      correctIndex: 0,
      hintSnippet: "the master index of all seven hundred thousand scrolls once housed in the Great Library of Alexandria",
      clueFa: "خط دوم رو ببین؛ فهرست جامع تمام ۷۰۰ هزار طومار کتابخانه بزرگ اسکندریه با سیستم کتابداری کالیماخوس بود!",
    },
    choiceA: {
      labelEn: "Read aloud the titles of five lost tragedies of Euripides to the emotional global audience!",
      labelFa: "عناوین پنج نمایشنامه گم‌شده اوریپید را با صدای بلند و بغض شوق برای مردم جهان بخوان!",
      descriptionFa: "روزی که ادبیات گمشده جهان از خاک برخاست.",
    },
    choiceB: {
      labelEn: "Launch the International Retrieval Initiative to trace remaining sister vaults!",
      labelFa: "طرح بین‌المللی جست‌وجوی سایر دخمه‌های مخفی خواهر را کلید بزن!",
      descriptionFa: "آغاز بزرگ‌ترین ماجراجویی باستان‌شناسی برای کشف سایر بخش‌های گم‌شده کتابخانه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Holding a newly penned parchment with indelible archival ink, Julian and Soraya inscribed their gratitude: 'We found what you hid. We remembered what you loved. The light still shines.' Slipping the cylinder into a dedicated niche alongside Hypatia's dedication, they exited into the Cairo dusk, knowing that while libraries may burn and empires fall, the human spirit of discovery remains eternal.",
    keywords: [
      { word: "indelible", meaningFa: "پاک‌نشدنی، ماندگار و محوناشدنی", phonetic: "/ɪnˈdeləbl/" },
      { word: "archival", meaningFa: "بایگانی‌شده، با ماندگاری قرن‌ها در آرشیو", phonetic: "/ɑːˈkaɪvl/" },
      { word: "eternal", meaningFa: "جاودانه، ابدی و ازلی", phonetic: "/ɪˈtɜːnl/" },
      { word: "spirit", meaningFa: "روح، گوهر و جوهره وجودی انسان", phonetic: "/ˈspɪrɪt/" },
    ],
    question: {
      promptEn: "What moving message did Julian and Soraya leave in the niche alongside Hypatia's dedication?",
      promptFa: "جولین و ثریا چه پیام تکان‌دهنده‌ای را در کنار دست‌نوشته هیپاتیا به یادگار گذاشتند؟",
      options: [
        "'We found what you hid. We remembered what you loved. The light still shines.'",
        "'May future generations seek gold rather than old words'",
        "'This vault is forever sealed by order of the international consortium'",
      ],
      correctIndex: 0,
      hintSnippet: "'We found what you hid. We remembered what you loved. The light still shines.'",
      clueFa: "خط دوم رو نگاه کن؛ نوشتند: 'ما آنچه پنهان کرده بودید را یافتیم. آنچه عاشقش بودید را به خاطر سپردیم. نور حقیقت هنوز می‌درخشد!'",
    },
    choiceA: {
      labelEn: "Step out into the warm starlit desert night in profound, timeless serenity!",
      labelFa: "با آرامشی عمیق و ابدی به دل شب پرستاره کویر قدم بگذار!",
      descriptionFa: "پایانی باشکوه، عرفانی و جاودانه برای کاشفان حقیقت.",
    },
    choiceB: {
      labelEn: "Clasp hands in silent brotherhood and sisterhood under the eternal Cairo sky!",
      labelFa: "دست در دست هم زیر آسمان نیلگون قاهره پیمان همیشگی رفاقت و دانش ببندید!",
      descriptionFa: "پیوند قلب‌هایی که در راه زنده نگه‌داشتن مشعل آگاهی یکی شدند.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Marble Arcades of Alexandria", titleFa: "طاق‌های مرمرین اسکندریه", badgeCategory: "legendary", badgeIcon: "🏛️", badgeNameFa: "پایان کشف تمدن", climaxEn: "Under the golden Nile dawn, the unearthed Mouseion observatory becomes a vibrant world center for classical archaeology.", climaxFa: "زیر طلوع زرین نیل، رصدخانه کشف‌شده موزیون اسکندریه به کانون تپنده باستان‌شناسی جهان بدل گشت.", xpReward: 290 },
  { pathCode: "AAAAB", titleEn: "The Nile Dawn of Gratitude", titleFa: "سپیده‌دم شکرگزاری نیل", badgeCategory: "scholar", badgeIcon: "🌅", badgeNameFa: "پایان آرامش و بینش", climaxEn: "Julian and Soraya watch the sunrise reflect across the ancient Nile, knowing they restored a lost world to human memory.", climaxFa: "جولین و ثریا بازتاب آفتاب را در نیل به تماشا نشستند؛ با این آرامش که دنیایی گمشده را به حافظه تاریخ بازگرداندند.", xpReward: 285 },
  { pathCode: "AAABA", titleEn: "The Sanctuary of Hypatia", titleFa: "پناهگاه جاودانه هیپاتیا", badgeCategory: "heroic", badgeIcon: "🛡️", badgeNameFa: "پایان حفاظت فرهنگی", climaxEn: "Declared an inviolable international sanctuary, the subterranean vault preserves the legacy of Alexandria's greatest scholar.", climaxFa: "با ثبت به عنوان پناهگاه بین‌المللی مصون از تعرض، دخمه اسکندریه میراث بزرگ‌ترین بانوی دانشمند تاریخ را برای همیشه حفظ کرد.", xpReward: 280 },
  { pathCode: "AAABB", titleEn: "The Torch of the Science Fellowship", titleFa: "مشعل‌داران دانایی آینده", badgeCategory: "scholar", badgeIcon: "🔥", badgeNameFa: "پایان پرامید و علمی", climaxEn: "The Hypatia Science Fellowship empowers ten thousand young researchers worldwide, lighting the path of human knowledge.", climaxFa: "بنیاد علمی هیپاتیا به ده هزار پژوهشگر جوان در جهان بال و پر داد تا راه دانش بشری را روشن نگاه دارند.", xpReward: 285 },
  { pathCode: "AABAA", titleEn: "The Global Tour of Wisdom", titleFa: "سفیران جهانی خرد کهن", badgeCategory: "explorer", badgeIcon: "🌍", badgeNameFa: "پایان آموزشی بین‌المللی", climaxEn: "The working titanium mechanical computer tours twenty-four countries, inspiring millions to marvel at classical intellect.", climaxFa: "مدل تیتانیومی کامپیوتر باستانی در ۲۴ کشور به نمایش درآمد و میلیون‌ها نفر را مبهوت نبوغ تمدن کهن ساخت.", xpReward: 285 },
  { pathCode: "AABAB", titleEn: "The Open Blueprint of Alexandria", titleFa: "نقشه باز برای همه مدارس جهان", badgeCategory: "scholar", badgeIcon: "📐", badgeNameFa: "پایان دانش همگانی", climaxEn: "Schoolchildren worldwide 3D-print and assemble their own calculating gears, proving that true genius belongs to all humanity.", climaxFa: "دانش‌آموزان در سراسر جهان با پرینت سه‌بعدی چرخ‌دنده‌ها، اثبات کردند که نبوغ واقعی متعلق به تمام بشریت است.", xpReward: 280 },
  { pathCode: "AABBA", titleEn: "The Celestial Comet Rendezvous", titleFa: "ملاقات مداری در دل کیهان", badgeCategory: "legendary", badgeIcon: "☄️", badgeNameFa: "پایان پیوند با فضا", climaxEn: "Deep in space, the probe's ancient Archimedean telemetry completes a flawless rendezvous with a distant interstellar comet.", climaxFa: "در اعماق کیهان، ناوبری برآمده از ریاضیات ارشمیدس فضاپیما را بدون کوچک‌ترین خطایی به دنباله‌دار دوردست رساند.", xpReward: 295 },
  { pathCode: "AABBB", titleEn: "The Star of Hypatia", titleFa: "ستاره جاودان هیپاتیا در افلاک", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان آسمانی ماندگار", climaxEn: "The comet crater 'Hypatia' shines against the cosmic void, carrying the name of Alexandria's daughter into deep eternity.", climaxFa: "دهانه 'هیپاتیا' بر فراز دنباله‌دار در پهنه تاریک کیهان درخشید و نام دختر خردمند اسکندریه را به ابدیت پیوند زد.", xpReward: 290 },
  { pathCode: "ABAAA", titleEn: "The Sixty Daughters of Science", titleFa: "شصت ستاره فروزان دانش", badgeCategory: "heroic", badgeIcon: "✨", badgeNameFa: "پایان افتخار زنان نخبه", climaxEn: "Sixty brilliant doctoral scholars receive their diplomas, vowing to expand the frontiers of physics and human understanding.", climaxFa: "شصت پژوهشگر نخبه زن مدارک دکتری خود را دریافت کردند و سوگند یاد کردند که مرزهای فیزیک و آگاهی را گسترش دهند.", xpReward: 285 },
  { pathCode: "ABAAB", titleEn: "The Anthology of Enlightenment", titleFa: "جُنگ زرین روشنگری نوین", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان دانشگاهی درخشان", climaxEn: "The published papers of the endowment scholars lead global breakthroughs in cosmology and materials engineering.", climaxFa: "مجموعه مقالات این پژوهشگران جوان به کشفیات بزرگی در کیهان‌شناسی و مهندسی مواد در جهان انجامید.", xpReward: 280 },
  { pathCode: "ABABA", titleEn: "The Echo of Alexandria's Harbor", titleFa: "طنین پرشکوه بندر اسکندریه", badgeCategory: "heroic", badgeIcon: "🌊", badgeNameFa: "پایان غرورآفرین ملی", climaxEn: "Standing ovations in Alexandria's Roman theater celebrate the triumphant return of scientific reason to the Mediterranean.", climaxFa: "تشویق‌های ایستاده در تماشاخانه رومی اسکندریه بازگشت پیروزمندانه خرد علمی به مدیترانه را جشن گرفت.", xpReward: 285 },
  { pathCode: "ABABB", titleEn: "The Mediterranean Olive Pact", titleFa: "پیمان صلح زیتون در مدیترانه", badgeCategory: "legendary", badgeIcon: "🕊️", badgeNameFa: "پایان دیپلماتیک و صلح", climaxEn: "Flags of three ancient civilizations wave in unison, united by the shared recovery of classical wisdom and peace.", climaxFa: "پرچم‌های سه تمدن باستانی در کنار هم به اهتزاز درآمدند؛ یکی‌شده در بازیابی خرد، فرهنگ و صلح مشترک.", xpReward: 290 },
  { pathCode: "ABBAA", titleEn: "The Grand Cordon of the Nile", titleFa: "نشان عالی نیل بر سینه کاشفان", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان عالی‌ترین نشان ملی", climaxEn: "Julian and Soraya wear the Grand Cordon of the Nile, hailed as national heroes who brought Egypt's ancient light back to life.", climaxFa: "جولین و ثریا نشان عالی نیل را بر سینه زدند؛ قهرمانانی ملی که نور دانش باستان مصر را دوباره روشن ساختند.", xpReward: 290 },
  { pathCode: "ABBAB", titleEn: "The Children of Alexandria", titleFa: "فرزندان خورشید در جیزه", badgeCategory: "funny", badgeIcon: "🧒", badgeNameFa: "پایان شیرین و الهام‌بخش", climaxEn: "Thousands of laughing children touch the museum glass, marveling that the genius of antiquity belongs to their own future.", climaxFa: "هزاران کودک خندان شیشه‌های موزه را لمس کردند و بالیدند که نبوغ نیاکانشان آینده‌ای روشن برای خودشان می‌سازد.", xpReward: 275 },
  { pathCode: "ABBBA", titleEn: "The Clockwork Compass of Amina", titleFa: "قطب‌نمای زرین امینه", badgeCategory: "scholar", badgeIcon: "🧭", badgeNameFa: "پایان بارقه‌های امید", climaxEn: "Ten-year-old Amina clutches her miniature brass gear, inspired to become Egypt's first woman astrophysicist.", climaxFa: "امینه ده‌ساله چرخ‌دنده برنجی کوچک را به سینه فشرد؛ با این رویا که روزی نخستین بانوی اخترفیزیکدان مصر شود.", xpReward: 285 },
  { pathCode: "ABBBB", titleEn: "The Dome of Eternal Wonder", titleFa: "گنبد شگفتی‌های جاودان", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان شکوهمند و باوقار", climaxEn: "Under the glass dome of Giza, the armillary sphere turns forever in sunlight, an eternal monument to human ingenuity.", climaxFa: "زیر گنبد شیشه‌ای موزه جیزه، گوی فلکی در نور آفتاب می‌چرخد؛ یادبودی جاودانه از هوش بی‌انتهای انسان.", xpReward: 295 },
  { pathCode: "BAAAA", titleEn: "The Feast of Open Knowledge", titleFa: "جشنواره جهانی دانش آزاد", badgeCategory: "heroic", badgeIcon: "💻", badgeNameFa: "پایان دسترسی همگانی", climaxEn: "Three million downloads turn Archimedes' lost hydrodynamics into the most celebrated open-source triumph in modern history.", climaxFa: "سه میلیون دانلود، رساله گمشده هیدرودینامیک ارشمیدس را به بزرگ‌ترین پیروزی تاریخ دانش آزاد و رایگان بدل کرد.", xpReward: 285 },
  { pathCode: "BAAAB", titleEn: "The Toast to the Ancient Scribes", titleFa: "سلامتی به کاتبان باستان", badgeCategory: "scholar", badgeIcon: "🍵", badgeNameFa: "پایان آرام و صمیمی", climaxEn: "Sipping hot mint tea under the Cairo stars, Julian and Soraya raise their cups in quiet reverence to Hypatia's courage.", climaxFa: "با نوشیدن چای نعنا زیر آسمان قاهره، جولین و ثریا فنجان‌هایشان را به نشانه احترام عمیق به شجاعت هیپاتیا بالا بردند.", xpReward: 280 },
  { pathCode: "BAABA", titleEn: "The Stockholm Nobel Laurels", titleFa: "برگ زرین نوبل در استکهلم", badgeCategory: "scholar", badgeIcon: "👑", badgeNameFa: "پایان پرافتخار جهانی", climaxEn: "The Nobel citation in Stockholm honors the restitution of classical mathematics, restoring truth to the global historical canon.", climaxFa: "تقدیرنامه نوبل در استکهلم احیای ریاضیات باستان را ستود و حقیقت را به متون مرجع تاریخ جهان بازگرداند.", xpReward: 295 },
  { pathCode: "BAABB", titleEn: "The Library of Developing Nations", titleFa: "گنجینه کتابخانه‌های جهان", badgeCategory: "explorer", badgeIcon: "📚", badgeNameFa: "پایان عدالت آموزشی", climaxEn: "Facsimile editions arrive at libraries across sixty developing nations, ensuring that ancient brilliance inspires every corner of Earth.", climaxFa: "نسخه‌های نفیس به کتابخانه‌های ۶۰ کشور در حال توسعه رسید تا نور دانایی باستان گوشه‌گوشه زمین را فراگیرد.", xpReward: 285 },
  { pathCode: "BABAA", titleEn: "The Map of Ten Million Minds", titleFa: "نقشه ده میلیون جوینده دانش", badgeCategory: "heroic", badgeIcon: "🌐", badgeNameFa: "پایان پیوند دل‌های جهان", climaxEn: "Ten million active researchers illuminate the global portal, transcribing lost theorems in a breathtaking display of unity.", climaxFa: "ده میلیون پژوهشگر پرتال جهانی را غرق نور کردند و قضایای کهن را در تجلی باشکوهی از یکدلی بشریت بازخوانی نمودند.", xpReward: 290 },
  { pathCode: "BABAB", titleEn: "The Nairobi Transcription Laurels", titleFa: "نشان زرین محقق جوان نایروبی", badgeCategory: "scholar", badgeIcon: "🇰🇪", badgeNameFa: "پایان الهام‌بخش جوانان", climaxEn: "A talented young mathematics student in Nairobi decodes a lost theorem of Herophilus, celebrated worldwide as an equal peer.", climaxFa: "دانشجوی بااستعداد ریاضی در نایروبی قضیه گم‌شده هروفیلوس را رمزگشایی کرد و در سراسر جهان به عنوان دانشمندی نخبه ستایش شد.", xpReward: 280 },
  { pathCode: "BABBA", titleEn: "The Keynote of the Reborn Light", titleFa: "خطابه رنسانس دوباره علم", badgeCategory: "legendary", badgeIcon: "🎙️", badgeNameFa: "پایان حماسی و الهام‌بخش", climaxEn: "Julian and Soraya proclaim the rebirth of scientific humanism before four thousand cheering delegates in Alexandria.", climaxFa: "جولین و ثریا تولد دوباره اومانیسم علمی را در حضور چهار هزار نماینده مشتاق در اسکندریه با شکوه تمام اعلام کردند.", xpReward: 295 },
  { pathCode: "BABBB", titleEn: "The Mediterranean Starlight Walk", titleFa: "قدم زدن در ساحل مهتابی", badgeCategory: "scholar", badgeIcon: "🌙", badgeNameFa: "پایان شاعرانه و دلنشین", climaxEn: "Walking along the quiet Mediterranean corniche, two lifelong scholars listen to the waves whispering secrets of ancient light.", climaxFa: "با قدم زدن در امتداد ساحل آرام مدیترانه، دو دانشمند به نجوای امواج گوش سپردند که از رازهای نور کهن سخن می‌گفتند.", xpReward: 285 },
  { pathCode: "BBAAA", titleEn: "The Amber Hall of Codicology", titleFa: "تالار کهربایی نسخه‌شناسی", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان پژوهش پایدار", climaxEn: "The world's leading paleographers convene within the amber vault, deciphering forgotten manuscripts with reverent awe.", climaxFa: "بزرگ‌ترین نسخه‌شناسان جهان در تالار کهربایی گرد آمدند تا با احترامی عمیق دست‌نوشته‌های بازیافته را رمزگشایی کنند.", xpReward: 285 },
  { pathCode: "BBAAB", titleEn: "The Guardians of the Alexandrian Vault", titleFa: "نگهبانان گنجینه جاویدان اسکندریه", badgeCategory: "legendary", badgeIcon: "🗝️", badgeNameFa: "پایان حراست از میراث بشر", climaxEn: "Julian and Soraya sign the golden ledger as permanent guardians of the greatest archive ever entrusted to humankind.", climaxFa: "جولین و ثریا دفترچه زرین را به عنوان نگهبانان دائمی بزرگ‌ترین آرشیو به امانت گذاشته‌شده برای بشر امضا کردند.", xpReward: 290 },
  { pathCode: "BBBAA", titleEn: "The Cambridge Altar of Geometry", titleFa: "محراب هندسه در کمبریج", badgeCategory: "scholar", badgeIcon: "📐", badgeNameFa: "پایان افتخار دانشگاهی", climaxEn: "Aristarchus's critical edition rests alongside Newton's Principia, bridging two thousand years of mathematical brilliance.", climaxFa: "نسخه نفیس آریستارخوس در کنار اصول ریاضی نیوتن آرام گرفت و پلی میان دو هزار سال نبوغ ریاضی بشر زد.", xpReward: 290 },
  { pathCode: "BBBAB", titleEn: "The Laser of Aristarchus", titleFa: "لیزر آریستارخوس بر تارک افلاک", badgeCategory: "legendary", badgeIcon: "🔭", badgeNameFa: "پایان دقت خارق‌العاده", climaxEn: "Modern satellite observatories name their precision lunar telemetry grid in honor of the ancient Alexandrian astronomer.", climaxFa: "رصدخانه‌های ماهواره‌ای مدرن شبکه فاصله‌سنجی لیزری ماه را به افتخار ستاره‌شناس نابغه اسکندریه نام‌گذاری کردند.", xpReward: 295 },
  { pathCode: "BBBBA", titleEn: "The Tears of the Lost Tragedies", titleFa: "اشک شوق برای شاهکارهای گمشده", badgeCategory: "heroic", badgeIcon: "🎭", badgeNameFa: "پایان احیای ادبیات جهان", climaxEn: "Eighty million listeners weep with joy as the recovered verses of Sophocles and Euripides are read aloud for the first time in millennia.", climaxFa: "هشتاد میلیون بیننده اشک شوق ریختند وقتی ابیات گم‌شده سوفوکل و اوریپید پس از هزاران سال دوباره خوانده شد.", xpReward: 290 },
  { pathCode: "BBBBB", titleEn: "The Eternal Light of the Nile", titleFa: "نور جاودانه نیل در دل تاریکی", badgeCategory: "legendary", badgeIcon: "🕯️", badgeNameFa: "پایان آسمانی و جاودانه", climaxEn: "Beneath the starry Cairo sky, Julian and Soraya leave their message of gratitude, knowing that truth will forever outshine the dark.", climaxFa: "زیر آسمان پرستاره قاهره، جولین و ثریا پیام سپاس خود را به یادگار گذاشتند؛ با این ایمان که حقیقت تا ابد تاریکی را مغلوب خواهد کرد.", xpReward: 300 },
];

export const story2AlexandrianPalimpsest: AdventureStory = buildAdventureStory({
  id: "c2-alexandrian-palimpsest",
  storyIndex: 2,
  cefr: "C2",
  titleEn: "The Alexandrian Palimpsest",
  titleFa: "راز طومار گمشده کتابخانه اسکندریه",
  genre: "mystery",
  genreLabelFa: "🔍 معمایی و کنجکاوی",
  genreIcon: "🔍",
  synopsisEn:
    "When a fourth-century scraped parchment from the Great Library of Alexandria is uncovered in a subterranean Cairo monastery vault, Senior Codicologist Dr. Julian Mercer and Epigraphist Dr. Soraya Khorsandi decode Archimedes' lost spherical calculus and celestial sphere mechanisms across 32 scholarly and breathtaking endings.",
  synopsisFa:
    "در دخمه‌ای زیرزمینی در قاهره، دست‌نوشته‌ای پوستی از قرن چهارم میلادی متعلق به کتابخانه افسانه‌ای اسکندریه کشف می‌شود که روی متون کهنه‌اش لایه‌ای از دعاهای مذهبی قرون‌وسطایی نوشته شده! دکتر جولین مرسر (متخصص ارشد خطوط کهن و نسخه‌شناسی) و دکتر ثریا خرسندی (کتیبه‌شناس و باستان‌شناس برجسته) با نور فرابنفش، لایه‌های محوشده محاسبات کروی ارشمیدس و چرخ‌دنده‌های مکانیکی گوی فلکی را رمزگشایی می‌کنند! ۳۲ پایان پر از نبوغ باستان‌شناسی، هیجان کشف علمی و رمزگشایی تاریخی در انتظار شماست!",
  coverImage: "/images/skills/reading/c2-alexandrian-palimpsest.webp",
  nodes,
  endings,
});
