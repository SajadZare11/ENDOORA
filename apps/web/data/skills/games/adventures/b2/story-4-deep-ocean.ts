import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 4 (B2 - Adult): Echoes of the Ocean Trench (زمزمه‌های اعماق اقیانوس آرام)
// Genre: Sci-Fi & Fantasy (فانتزی و علمی‌تخیلی)
// CEFR: B2 (Passive voice, 3rd/mixed conditionals, past deduction modals, marine science B2 vocab)
// Characters: Dr. Adrian Cole (Biologist), Dr. Meera Ray (AI Director), Captain Thorne
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "Dr. Adrian Cole and AI systems director Dr. Meera Ray were stationed at 'Hadal Station', an experimental underwater biosphere dome anchored five miles beneath the surface of the Mariana Trench. While monitoring hydrothermal volcanic vents through the reinforced titanium observation dome, their deep-frequency hydrophones picked up an unprecedented rhythmic acoustic resonance. Synchronized with the sound, an entire canyon of colossal abyssal coral began pulsing with coordinated waves of electric violet and turquoise bioluminescence.",
    keywords: [
      { word: "abyssal", meaningFa: "مربوط به اعماق تاریک و ژرف اقیانوس", phonetic: "/əˈbɪsl/" },
      { word: "hydrophones", meaningFa: "میکروفون‌های گیرنده امواج صوتی زیر آب", phonetic: "/ˈhaɪdrəfəʊnz/" },
      { word: "bioluminescence", meaningFa: "زیست‌تابی و تولید نور طبیعی توسط موجودات زنده", phonetic: "/ˌbaɪəʊˌluːmɪˈnesns/" },
      { word: "hydrothermal", meaningFa: "آب‌گرمابی و بخارات جوشان از پوسته زمین", phonetic: "/ˌhaɪdrəʊˈθɜːml/" },
    ],
    question: {
      promptEn: "What phenomenon was synchronized with the rhythmic acoustic resonance picked up by the hydrophones?",
      promptFa: "چه پدیده‌ای همزمان با ارتعاش صوتی ریتمیک دریافت‌شده توسط هیدروفون‌ها رخ داد؟",
      options: [
        "An entire canyon of abyssal coral pulsed with coordinated bioluminescent light waves",
        "A sudden underwater mudslide damaged the solar panels",
        "A school of ordinary surface sardines swam past",
      ],
      correctIndex: 0,
      hintSnippet: "Synchronized with the sound, an entire canyon of colossal abyssal coral began pulsing with coordinated waves of electric violet and turquoise bioluminescence",
      clueFa: "خط آخر رو نگاه کن دوست من؛ کل دره صخره‌های مرجانی اعماق با امواج هماهنگ نور زیست‌تاب بنفش و فیروزه‌ای شروع به درخشش کردند.",
    },
    choiceA: {
      labelEn: "Deploy deep-sea submersible *Nautilus Two* to collect live coral neural tissue samples!",
      labelFa: "زیردریایی سرنشین‌دار ناتیلوس ۲ را برای برداشت نمونه از بافت عصبی زنده مرجان اعزام کن!",
      descriptionFa: "بررسی مستقیم بافت سلولی و سلول‌های عصبی ساطع‌کننده نور در عمق ۸۰۰۰ متری.",
    },
    choiceB: {
      labelEn: "Feed the acoustic and optical frequency pulses into the station's AI neural decoder!",
      labelFa: "فرکانس‌های صوتی و نوری رو به سامانه هوش مصنوعی رمزگشای زیستی متصل کن!",
      descriptionFa: "شاید این پالس‌های نوری حامل یک زبان محاسباتی و هوشمند ناشناخته باشند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Piloting the heavy titanium submersible into the pitch-black abyss, Captain Thorne activated the external halogen floodlights. The deep canyon revealed colossal, tree-like crystal coral spires towering ninety feet above the seafloor. As Adrian extended the robotic claw, the coral did not retract; instead, thousands of delicate bioluminescent tendrils reached out, gently wrapping around the metallic sample pod while projecting harmonic rings of sapphire light across the submersible's viewport.",
    keywords: [
      { word: "submersible", meaningFa: "زیردریایی ویژه کاوش در اعماق ژرف", phonetic: "/səbˈmɜːsəbl/" },
      { word: "tendrils", meaningFa: "شاخک‌ها و رشته‌های باریک و حساس زنده", phonetic: "/ˈtendrəlz/" },
      { word: "viewport", meaningFa: "پنجره شیشه‌ای ضخیم دید زیردریایی", phonetic: "/ˈvjuːpɔːt/" },
      { word: "harmonic", meaningFa: "هماهنگ، منظم و موسیقایی", phonetic: "/hɑːˈmɒnɪk/" },
    ],
    question: {
      promptEn: "What did the coral tendrils do when Adrian extended the robotic sample claw?",
      promptFa: "وقتی آدریان بازوی مکانیکی را جلو برد شاخک‌های مرجان چه واکنشی نشان دادند؟",
      options: [
        "Reached out, wrapped around the pod, and projected rings of sapphire light",
        "Broke into pieces and fell onto the seafloor",
        "Discharged an electric shock that damaged the engines",
      ],
      correctIndex: 0,
      hintSnippet: "thousands of delicate bioluminescent tendrils reached out, gently wrapping around the metallic sample pod while projecting harmonic rings of sapphire light",
      clueFa: "خط آخر رو بخون؛ شاخک‌ها با ظرافت دور محفظه پیچیدند و حلقه‌هایی از نور یاقوت کبود تاباندند.",
    },
    choiceA: {
      labelEn: "Synthesize an optical response using the submersible's multi-spectrum strobe lamps!",
      labelFa: "با پروژکتورهای چندطیفی زیردریایی پالس نوری هماهنگ در پاسخ بتابان!",
      descriptionFa: "برقراری نخستین مکالمه مستقیم نوری میان انسان و هوش زیستی اعماق.",
    },
    choiceB: {
      labelEn: "Carefully detach the sample pod and ascend to Hadal Station's wet laboratory!",
      labelFa: "محفظه نمونه رو با احتیاط جدا کن و برای آزمایش‌های دقیق به پایگاه برگردان!",
      descriptionFa: "بررسی ساختار ژنتیکی این ارگانیسم شگفت‌انگیز در محیط آزمایشگاه.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Dr. Meera Ray's quantum neural network processed the audio-optical stream at forty teraflops. The spectral spectrogram resolved into an undeniable Fibonacci sequence encoded in mathematical ratios of prime numbers. Meera leaned forward, her voice trembling with scientific awe: 'Adrian, this isn't an instinctual biological defense mechanism; this entire oceanic trench is an interconnected planetary neural network.'",
    keywords: [
      { word: "spectrogram", meaningFa: "طیف‌نگار تجزیه فرکانس‌های صوتی و نوری", phonetic: "/ˈspektrəɡræm/" },
      { word: "Fibonacci", meaningFa: "دنباله ریاضی مشهور فیبوناچی موجود در نظم طبیعت", phonetic: "/ˌfɪbəˈnɑːtʃi/" },
      { word: "prime", meaningFa: "اعداد اول ریاضیاتی که بر هیچ عددی بخش‌پذیر نیستند", phonetic: "/praɪm/" },
      { word: "interconnected", meaningFa: "شبکه‌ای به‌هم‌پیوسته و یکپارچه", phonetic: "/ˌɪntəkəˈnektɪd/" },
    ],
    question: {
      promptEn: "What mathematical pattern was encoded in the coral's bioluminescent signals?",
      promptFa: "چه الگوی ریاضیاتی در پالس‌های نوری زیست‌تاب مرجان‌ها کدگذاری شده بود؟",
      options: [
        "A Fibonacci sequence encoded in prime number ratios",
        "Random chaotic noise with no pattern",
        "Simple Morse code spelling human words",
      ],
      correctIndex: 0,
      hintSnippet: "resolved into an undeniable Fibonacci sequence encoded in mathematical ratios of prime numbers",
      clueFa: "خط دوم رو ببین عزیزم؛ دنباله بی‌نقص فیبوناچی در قالب نسبت‌های اعداد اول.",
    },
    choiceA: {
      labelEn: "Transmit the next sequence of prime numbers through the station's sonar transducers!",
      labelFa: "دنباله اعداد اول بعدی رو با مبدل‌های صوتی ایستگاه به درون دره مخابره کن!",
      descriptionFa: "پاسخ دادن به زبان جهانی ریاضیات برای اثبات هوشمندی انسان.",
    },
    choiceB: {
      labelEn: "Map the geographical extent of the subterranean oceanic neural network!",
      labelFa: "گستره جغرافیایی شبکه عصبی اقیانوسی رو در سراسر دره ماریانا نقشه‌برداری کن!",
      descriptionFa: "کشف وسعت این مغز زنده طبیعی که در اعماق اقیانوس پنهان شده است.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Captain Thorne keyed the strobe lamps, flashing three precise optical bursts in golden amber. Instantly, the entire ninety-foot coral spire rippled with an identical golden echo, followed by an intricate cascading wave that illuminated five miles of the deep trench like a glowing subterranean metropolis. A peaceful warmth registered on the submersible's external thermal sensors.",
    keywords: [
      { word: "cascading", meaningFa: "آبشاروار و موجی ریزان و پی‌درپی", phonetic: "/kæˈskeɪdɪŋ/" },
      { word: "metropolis", meaningFa: "کلان‌شهر باشکوه و درخشان", phonetic: "/məˈtrɒpəlɪs/" },
      { word: "thermal", meaningFa: "گرمایی و حرارتی", phonetic: "/ˈθɜːml/" },
    ],
    question: {
      promptEn: "What did the five-mile coral illumination look like in the dark trench?",
      promptFa: "روشنایی پنج مایلی صخره مرجانی در عمق تاریک دره شبیه چه چیزی بود؟",
      options: [
        "A glowing subterranean metropolis",
        "A dark muddy cave",
        "A burning oil spill",
      ],
      correctIndex: 0,
      hintSnippet: "illuminated five miles of the deep trench like a glowing subterranean metropolis",
      clueFa: "خط ماقبل آخر رو بخون؛ مثل یک کلان‌شهر درخشان و زنده در اعماق زمین.",
    },
    choiceA: {
      labelEn: "Cruise slowly along the canyon floor to record the full light symphony!",
      labelFa: "با زیردریایی در بستر دره حرکت کن تا کل این سمفونی نوری رو ثبت کنی!",
      descriptionFa: "تصویربرداری ۴K از بزرگترین پدیده زیستی کشف‌شده در تاریخ زمین.",
    },
    choiceB: {
      labelEn: "Hover near the central master spire to monitor bio-electrical exchange!",
      labelFa: "کنار برج مرجانی مادر معلق بمان تا تبادل بارهای الکتریکی زیستی رو بسنجی!",
      descriptionFa: "درک مستقیم چگونگی انتقال داده‌ها میان توده‌های مرجانی.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Inside the pressurized marine laboratory, the living tendril rested in a nutrient-rich hyperbaric chamber. Under electron cryo-microscopy, Adrian observed that the cells contained microscopic superconducting crystal filaments capable of quantum computing at near-absolute-zero temperatures. Dr. Thorne whistled softly: 'This organism doesn't just store energy; it computes planetary climate cycles.'",
    keywords: [
      { word: "hyperbaric", meaningFa: "تحت فشار فوق‌العاده بالا مشابه اعماق اقیانوس", phonetic: "/ˌhaɪpəˈbærɪk/" },
      { word: "superconducting", meaningFa: "ابررسانای الکتریکی بدون هیچ‌گونه اتلاف انرژی", phonetic: "/ˌsuːpəkənˈdʌktɪŋ/" },
      { word: "quantum", meaningFa: "کوانتومی و پردازش در سطح ذرات بنیادین", phonetic: "/ˈkwɒntəm/" },
    ],
    question: {
      promptEn: "What did the living coral cells contain according to cryo-microscopy?",
      promptFa: "طبق بررسی‌های میکروسکوپی سلول‌های زنده مرجان چه چیزی در خود داشتند؟",
      options: [
        "Microscopic superconducting crystal filaments capable of quantum computing",
        "Ordinary dead sea salt crystals",
        "Plastic pieces and engine soot",
      ],
      correctIndex: 0,
      hintSnippet: "contained microscopic superconducting crystal filaments capable of quantum computing",
      clueFa: "خط دوم رو ببین دوست من؛ رشته‌های بلورین ابررسانای میکروسکوپی با توان پردازش کوانتومی.",
    },
    choiceA: {
      labelEn: "Sequence the quantum genome to develop clean biological supercomputers!",
      labelFa: "ژنوم کوانتومی رو رمزگشایی کن تا ابرکامپیوترهای زیستی بدون گرما بسازی!",
      descriptionFa: "جهشی تاریخی در فناوری پردازنده‌های آینده جهان بدون آلایندگی.",
    },
    choiceB: {
      labelEn: "Safely return the living tendril to its mother spire in the trench!",
      labelFa: "شاخه زنده رو با نهایت احترام به برج مرجانی مادر در اعماق بازگردان!",
      descriptionFa: "اخلاق علمی حکم می‌کند که این موجود هوشمند دست‌نخورده در خانه‌اش بماند.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "When Hadal Station's acoustic transducers boomed the prime numbers thirteen, seventeen, and nineteen into the abyss, the response was immediate. The deep-trench coral network answered with twenty-three, twenty-nine, and thirty-one, followed by a holographic projection of the solar system formed by billions of glowing bioluminescent plankton swirling outside the glass observation dome.",
    keywords: [
      { word: "transducers", meaningFa: "مبدل‌های ارسال امواج صوتی زیرآبی", phonetic: "/trænzˈdjuːsəz/" },
      { word: "swirling", meaningFa: "چرخیدن آرام و گرداب‌وار در آب", phonetic: "/ˈswɜːlɪŋ/" },
      { word: "holographic", meaningFa: "هولوگرافیک و سه‌بعدی نوری شناور", phonetic: "/ˌhɒləˈɡræfɪk/" },
    ],
    question: {
      promptEn: "What did billions of bioluminescent plankton project outside the dome?",
      promptFa: "میلیاردها پلانکتون زیست‌تاب بیرون گنبد شیشه‌ای چه تصویری تشکیل دادند؟",
      options: [
        "A holographic projection of the solar system",
        "A scary shark mouth",
        "A cloud of black ink",
      ],
      correctIndex: 0,
      hintSnippet: "followed by a holographic projection of the solar system formed by billions of glowing bioluminescent plankton",
      clueFa: "خط آخر رو نگاه کن؛ تصویر سه‌بعدی خیره‌کننده‌ای از کل منظومه شمسی ساختند.",
    },
    choiceA: {
      labelEn: "Record the plankton celestial projection with multi-angle scientific cameras!",
      labelFa: "تصویر کیهانی پلانکتون‌ها رو با دوربین‌های علمی چندزاویه‌ای ضبط کن!",
      descriptionFa: "سندی ماندگار از درک کیهانی هوش زیستی اعماق زمین.",
    },
    choiceB: {
      labelEn: "Send an optical greeting identifying Earth as the home of humanity!",
      labelFa: "پیام نوری خوش‌آمدی بفرست که زمین رو به عنوان خانه مشترک ما و آنها معرفی کنه!",
      descriptionFa: "اعلام صلح، دوستی و احترام عمیق انسان به ساکنان اعماق اقیانوس.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Deep seismic telemetry combined with AI satellite bathymetry revealed that the neural reef extended for over twelve hundred miles along the Pacific Ring of Fire. Connected to deep mantle thermal vents, this organic megastructure functioned as Earth's ancient thermodynamic heat sink, absorbing excess planetary carbon and stabilizing ocean temperatures for millions of years.",
    keywords: [
      { word: "bathymetry", meaningFa: "ژرفاسنجی و نقشه‌برداری ناهمواری‌های کف دریا", phonetic: "/bəˈθɪmətri/" },
      { word: "thermodynamic", meaningFa: "ترمودینامیکی و مدیریت تبادل حرارت", phonetic: "/ˌθɜːməʊdaɪˈnæmɪk/" },
      { word: "megastructure", meaningFa: "ابرسازه غول‌پیکر طبیعی یا مهندسی", phonetic: "/ˈmeɡəstrʌktʃə/" },
    ],
    question: {
      promptEn: "How many miles did the neural reef extend along the Pacific Ring of Fire?",
      promptFa: "صخره عصبی مرجانی تا چه مسافتی در طول کمربند آتش اقیانوس آرام امتداد داشت؟",
      options: [
        "Over twelve hundred miles",
        "Only fifty yards",
        "Less than one mile",
      ],
      correctIndex: 0,
      hintSnippet: "revealed that the neural reef extended for over twelve hundred miles along the Pacific Ring of Fire",
      clueFa: "خط اول رو بخون؛ بیش از ۱۲۰۰ مایل در دل اقیانوس آرام امتداد داشت.",
    },
    choiceA: {
      labelEn: "Present the discovery to the United Nations Oceans Climate Summit!",
      labelFa: "این کشف را در اجلاس تغییرات اقلیمی اقیانوس‌های سازمان ملل ارائه کن!",
      descriptionFa: "اثبات اینکه حفاظت از این صخره کلید نجات آب‌وهوای کل کره زمین است.",
    },
    choiceB: {
      labelEn: "Establish an international deep-ocean biological observatory network!",
      labelFa: "شبکه دیده‌بانی بین‌المللی زیست‌شناسی اعماق اقیانوس را تأسیس کن!",
      descriptionFa: "همکاری جهانی دانشمندان برای پاسداری از این ریه حیاتی زمین.",
    },
  },

  // STEP 4 (8 nodes: AAA to BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Submersible *Nautilus Two* glided through the glowing canyon as electric sapphire and magenta light pulses rippled around its hull. Thorne adjusted the descent thrusters, capturing panoramic footage that would redefine humanity's understanding of deep-sea consciousness. The coral spires seemed to acknowledge their presence, guiding the vessel through a breathtaking archway of crystal light.",
    keywords: [
      { word: "consciousness", meaningFa: "آگاهی، شعور و ادراک زنده", phonetic: "/ˈkɒnʃəsnəs/" },
      { word: "panoramic", meaningFa: "سراسرنما و با زاویه دید گسترده", phonetic: "/ˌpænəˈræmɪk/" },
      { word: "acknowledge", meaningFa: "به رسمیت شناختن و پاسخ احترام‌آمیز دادن", phonetic: "/əkˈnɒlɪdʒ/" },
    ],
    question: {
      promptEn: "What did the coral spires seem to acknowledge as the vessel glided through?",
      promptFa: "صخره‌های مرجانی در حین عبور زیردریایی چه چیزی را مورد احترام قرار دادند؟",
      options: [
        "The vessel's presence, guiding it through an archway of light",
        "They tried to crush the submarine",
        "They turned off and disappeared",
      ],
      correctIndex: 0,
      hintSnippet: "seemed to acknowledge their presence, guiding the vessel through a breathtaking archway of crystal light",
      clueFa: "خط آخر رو نگاه کن؛ حضور زیردریایی رو پذیرفتند و اون رو از طاق نورانی عبور دادند.",
    },
    choiceA: {
      labelEn: "Broadcast the live deep-sea footage worldwide on the Global Science Grid!",
      labelFa: "تصاویر زنده اعماق را در شبکه جهانی علوم برای تمام مردم زمین پخش کن!",
      descriptionFa: "میلیاردها انسان محو تماشای این دنیای شگفت‌انگیز زیر آب می‌شوند.",
    },
    choiceB: {
      labelEn: "Establish a permanent diplomatic communications link with the trench reef!",
      labelFa: "خط ارتباطی دائمی نوری میان پایگاه هادل و صخره برقرار کن!",
      descriptionFa: "تبادل مستمر پیام‌ها برای درک عمیق‌تر حکمت اقیانوس.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Hovering beside the master spire, Adrian measured an ambient bio-electrical field generating three hundred gigawatts of clean, harmonic resonance. The network acted as a subterranean power grid, utilizing volcanic heat from the Earth's core to fuel bioluminescence across thousands of square miles without generating carbon emissions.",
    keywords: [
      { word: "gigawatts", meaningFa: "گیگاوات (میلیارد وات توان الکتریکی)", phonetic: "/ˈɡɪɡəwɒts/" },
      { word: "emissions", meaningFa: "آلاینده‌ها و گازهای گلخانه‌ای", phonetic: "/ɪˈmɪʃnz/" },
      { word: "resonance", meaningFa: "طنین و تشدید نوسانی انرژی", phonetic: "/ˈrezənəns/" },
    ],
    question: {
      promptEn: "What did the master spire network utilize to fuel its massive bio-electrical power grid?",
      promptFa: "شبکه مرجانی مادر از چه منبعی برای تأمین انرژی شبکه الکتریکی خود استفاده می‌کرد؟",
      options: [
        "Volcanic heat from the Earth's core without generating emissions",
        "Burning oil from sunken tankers",
        "Batteries dropped from the surface",
      ],
      correctIndex: 0,
      hintSnippet: "utilizing volcanic heat from the Earth's core to fuel bioluminescence across thousands of square miles without generating carbon emissions",
      clueFa: "خط آخر رو بخون عزیزم؛ گرمای آتشفشانی هسته زمین بدون کوچکترین آلودگی کربنی.",
    },
    choiceA: {
      labelEn: "Design ocean-floor geothermal generators modeled on the coral's clean heat sink!",
      labelFa: "ژنراتورهای زمین‌گرمایی پاک با الگوبرداری از سیستم مرجان‌ها طراحی کن!",
      descriptionFa: "انرژی پاک و نامحدود برای تأمین برق تمام شهرهای ساحلی جهان.",
    },
    choiceB: {
      labelEn: "Declare the master spire an inviolable Sanctuary of Planetary Life!",
      labelFa: "برج مرجانی مادر را پناهگاه دست‌نیافتنی و مقدس حیات زمین اعلام کن!",
      descriptionFa: "محافظت قانونی در برابر هرگونه بهره‌برداری تجاری.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Sequencing the quantum genome, Meera engineered the first biological microchip operating on organic superconducting crystal filaments. The prototype executed fifty trillion calculations per second while consuming barely one watt of power and generating zero thermal heat, revolutionizing the global semiconductor industry.",
    keywords: [
      { word: "prototype", meaningFa: "نمونه اولیه مهندسی پیشرفته", phonetic: "/ˈprəʊtətaɪp/" },
      { word: "semiconductor", meaningFa: "صنعت نیمه‌رساناها و ریزتراشه‌های الکترونیکی", phonetic: "/ˌsemikənˈdʌktə/" },
      { word: "calculations", meaningFa: "محاسبات فوق‌سریع پردازشی", phonetic: "/ˌkælkjuˈleɪʃnz/" },
    ],
    question: {
      promptEn: "How much power did the bio-microchip prototype consume while executing 50 trillion calculations?",
      promptFa: "تراشه زیستی در هنگام اجرای ۵۰ تریلیون محاسبه در ثانیه چقدر برق مصرف کرد؟",
      options: [
        "Barely one watt of power with zero thermal heat",
        "As much power as a small city",
        "It overheated and burned out",
      ],
      correctIndex: 0,
      hintSnippet: "consuming barely one watt of power and generating zero thermal heat",
      clueFa: "خط ماقبل آخر رو ببین؛ فقط یک وات برق مصرف کرد و هیچ گرمایی تولید نکرد.",
    },
    choiceA: {
      labelEn: "Open-source the bio-microchip architecture to advance global environmental science!",
      labelFa: "معماری این تراشه زیستی رو به صورت متن‌باز در اختیار دانشمندان جهان بگذار!",
      descriptionFa: "شتاب‌بخشی به پژوهش‌های نجات اقلیم زمین با ابرکامپیوترهای سبز.",
    },
    choiceB: {
      labelEn: "Found the Hadal Bio-Quantum Research Institute in Geneva and Tokyo!",
      labelFa: "آموزشکده زیست‌کوانتومی هادل رو در ژنو و توکیو پایه‌گذاری کن!",
      descriptionFa: "مرکز تربیت نسل آینده نوابغ هوش مصنوعی زیستی.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Carried safely inside the specialized pressure shuttle, the living tendril was reunited with its parent spire in the trench. The moment the organic fibers touched, a radiant burst of gold and violet light surged through the entire canyon. The reef pulsed with what could only be interpreted as a deep, harmonic expression of gratitude.",
    keywords: [
      { word: "gratitude", meaningFa: "سپاسگزاری و قدردانی عمیق", phonetic: "/ˈɡrætɪtjuːd/" },
      { word: "fibers", meaningFa: "رشته‌های زنده بیولوژیکی", phonetic: "/ˈfaɪbəz/" },
      { word: "reunited", meaningFa: "به هم پیوستند و به آغوش هم بازگشتند", phonetic: "/ˌriːjuːˈnaɪtɪd/" },
    ],
    question: {
      promptEn: "What happened when the tendril touched its parent spire?",
      promptFa: "وقتی شاخه به صخره مادر متصل شد چه رخ داد؟",
      options: [
        "A radiant burst of gold and violet light surged through the canyon",
        "The spire withered away",
        "A shockwave broke the submarine glass",
      ],
      correctIndex: 0,
      hintSnippet: "a radiant burst of gold and violet light surged through the entire canyon",
      clueFa: "خط دوم رو بخون؛ فورانی درخشان از نور طلایی و بنفش در تمام دره پیچید.",
    },
    choiceA: {
      labelEn: "Pledge an international oath of non-interference with the abyssal neural network!",
      labelFa: "سوگند بین‌المللی عدم مداخله در شبکه عصبی اعماق اقیانوس را به امضا برسانید!",
      descriptionFa: "رعایت بالاترین اصول اخلاق علمی و احترام به شعور کهن طبیعت.",
    },
    choiceB: {
      labelEn: "Install permanent passive acoustic hydrophones to listen to the ocean's heartbeat!",
      labelFa: "هیدروفون‌های غیرمخرب دائمی نصب کنید تا به صدای تپش قلب اقیانوس گوش بسپارید!",
      descriptionFa: "ثبت آرامش‌بخش‌ترین نغمه‌های زنده اعماق زمین.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "The cameras recorded the swirling plankton projection with unprecedented clarity. The holographic map depicted not only the planets of our solar system, but also seven detailed ocean worlds across Jupiter and Saturn's moons—Europa, Enceladus, and Titan—marking them as fellow living aquatic biospheres.",
    keywords: [
      { word: "unprecedented", meaningFa: "بی‌سابقه، شگفت‌انگیز و منحصربه‌فرد", phonetic: "/ʌnˈpresɪdentɪd/" },
      { word: "aquatic", meaningFa: "آبی و متکی به اقیانوس‌ها", phonetic: "/əˈkwætɪk/" },
      { word: "biospheres", meaningFa: "زیست‌کره‌های دارای حیات فعال", phonetic: "/ˈbaɪəʊsfɪəz/" },
    ],
    question: {
      promptEn: "Which ocean worlds were marked on the plankton's holographic celestial map?",
      promptFa: "کدام جهان‌های اقیانوسی در نقشه هولوگرافیک پلانکتون‌ها نشانه‌گذاری شده بودند؟",
      options: [
        "Europa, Enceladus, and Titan as living aquatic biospheres",
        "Dry rocky asteroids with no water",
        "The burning surface of the sun",
      ],
      correctIndex: 0,
      hintSnippet: "seven detailed ocean worlds across Jupiter and Saturn's moons—Europa, Enceladus, and Titan—marking them as fellow living aquatic biospheres",
      clueFa: "خط آخر رو ببین؛ قمرهای اقیانوس‌دار مشتری و زحل: اروپا، انسلادوس و تیتان.",
    },
    choiceA: {
      labelEn: "Transmit the deep-sea celestial coordinates to NASA and the European Space Agency!",
      labelFa: "مختصات کیهانی اعماق را به ناسا و آژانس فضایی اروپا مخابره کن!",
      descriptionFa: "هدایت مأموریت‌های آینده فضاپیماها به سوی اقیانوس‌های زنده منظومه شمسی.",
    },
    choiceB: {
      labelEn: "Design a deep-space probe equipped with abyssal coral optical decoders!",
      labelFa: "کاوشگر فضایی مجهز به رمزگشای نوری مرجان‌های اعماق بسازید!",
      descriptionFa: "سفر به قمر اروپا برای صحبت با اقیانوس‌های دیگر به همان زبان نوری.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Adrian transmitted an optical message depicting Earth's continents, atmosphere, and human DNA helices. Outside the dome, the coral reef pulsed with brilliant azure harmonics, echoing human heartbeat rhythms. Two forms of terrestrial consciousness—one of land, one of the abyss—had established mutual understanding.",
    keywords: [
      { word: "helices", meaningFa: "مارپیچ‌های دوگانه ساختار دی‌ان‌ای", phonetic: "/ˈhiːlɪsiːz/" },
      { word: "terrestrial", meaningFa: "زمینی و ساکن سیاره زمین", phonetic: "/təˈrestriəl/" },
      { word: "mutual", meaningFa: "متقابل و دوطرفه", phonetic: "/ˈmjuːtʃuəl/" },
    ],
    question: {
      promptEn: "What rhythm did the coral reef echo in response to the human message?",
      promptFa: "صخره مرجانی در پاسخ به پیام انسان چه ریتمی را بازتاب داد؟",
      options: [
        "Human heartbeat rhythms in brilliant azure harmonics",
        "A loud explosion",
        "Total silence with no reaction",
      ],
      correctIndex: 0,
      hintSnippet: "echoing human heartbeat rhythms. Two forms of terrestrial consciousness—one of land, one of the abyss—had established mutual understanding",
      clueFa: "خط آخر رو نگاه کن؛ ریتم تپش قلب انسان را با هارمونی‌های لاجوردی بازتاب داد.",
    },
    choiceA: {
      labelEn: "Draft the 'Earth Charter of Interspecies Consciousness' for world leaders!",
      labelFa: "«منشور آگاهی گونه‌های سیاره زمین» را برای رهبران جهان تدوین کن!",
      descriptionFa: "سندی تاریخی که حقوق بنیادین حیات هوشمند اقیانوس را به رسمیت می‌شناسد.",
    },
    choiceB: {
      labelEn: "Host a live interspecies concert streaming coral light pulses to symphony halls!",
      labelFa: "کنسرت جهانی هم‌نوازی با پالس‌های نوری اعماق در سالن‌های سمفونی جهان پخش کن!",
      descriptionFa: "اجرای مشترک موسیقی انسان و اقیانوس در تالارهای بزرگ جهان.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Addressing the United Nations General Assembly via live satellite link from Hadal Station, Adrian and Meera presented the 1,200-mile neural reef map. The delegates rose in unanimous standing ovation, passing the historic Treaty of the Deep Trench to outlaw all seafloor seabed mining across international waters.",
    keywords: [
      { word: "unanimous", meaningFa: "متفق‌القول و با رأی قاطع صد در صدی", phonetic: "/juːˈnænɪməs/" },
      { word: "seabed", meaningFa: "بستر عمیق کف دریاها و اقیانوس‌ها", phonetic: "/ˈsiːbed/" },
      { word: "treaty", meaningFa: "معاهده بین‌المللی الزام‌آور", phonetic: "/ˈtriːti/" },
    ],
    question: {
      promptEn: "What did the Treaty of the Deep Trench outlaw across international waters?",
      promptFa: "معاهده دره ژرف چه فعالیتی را در آب‌های بین‌المللی ممنوع کرد؟",
      options: [
        "All seafloor seabed mining",
        "Scientific research submarines",
        "Swimming in surface waters",
      ],
      correctIndex: 0,
      hintSnippet: "passing the historic Treaty of the Deep Trench to outlaw all seafloor seabed mining across international waters",
      clueFa: "خط آخر رو بخون؛ استخراج صنعتی از معادن بستر اقیانوس‌ها را ممنوع کرد.",
    },
    choiceA: {
      labelEn: "Establish the International Deep-Sea Ranger Patrol to protect the trench!",
      labelFa: "یگان گشت محیط‌بانی اعماق دریا را برای پاسداری از دره ماریانا تأسیس کن!",
      descriptionFa: "حفاظت دائمی از بزرگترین سرمایه زیستی زمین.",
    },
    choiceB: {
      labelEn: "Accept the United Nations Blue Planet Laureate Medal on behalf of the team!",
      labelFa: "مدال افتخار سیاره آبی سازمان ملل را به نمایندگی از دانشمندان دریافت کن!",
      descriptionFa: "بالاترین نشان افتخار محیط‌زیستی در تاریخ بشریت.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "The International Deep Ocean Biological Observatory Network was established with five permanent underwater biosphere stations spanning the Pacific, Atlantic, and Indian Oceans. Humanity had taken its first mature steps toward becoming true stewards of the blue planet.",
    keywords: [
      { word: "stewards", meaningFa: "نگهبانان، پاسداران و حامیان امین", phonetic: "/ˈstjuːədz/" },
      { word: "spanning", meaningFa: "در بر گیرنده و امتدادیافته در پهنه", phonetic: "/ˈspænɪŋ/" },
      { word: "mature", meaningFa: "بالغ، خردمند و دنیاکاردیده", phonetic: "/məˈtʃʊə/" },
    ],
    question: {
      promptEn: "Across which oceans did the five permanent biosphere stations span?",
      promptFa: "پنج پایگاه دائمی زیست‌کره در پهنه کدام اقیانوس‌ها مستقر شدند؟",
      options: [
        "The Pacific, Atlantic, and Indian Oceans",
        "Only in a small swimming pool",
        "In dry mountain lakes",
      ],
      correctIndex: 0,
      hintSnippet: "five permanent underwater biosphere stations spanning the Pacific, Atlantic, and Indian Oceans",
      clueFa: "خط اول رو ببین؛ اقیانوس آرام، اطلس و هند را در بر گرفتند.",
    },
    choiceA: {
      labelEn: "Supervise the launch of Hadal Station Two in the South Atlantic Abyss!",
      labelFa: "بر پرتاب پایگاه هادل ۲ در اعماق اقیانوس اطلس جنوبی نظارت کن!",
      descriptionFa: "گسترش مرزهای دانش به دورافتاده‌ترین آب‌های زمین.",
    },
    choiceB: {
      labelEn: "Host the World Ocean Youth Fellowship inside Hadal Station's observation dome!",
      labelFa: "همایش بین‌المللی جوانان اقیانوس را درون گنبد پایگاه هادل میزبانی کن!",
      descriptionFa: "انتقال مشعل نگهبانی زمین به نسل‌های آینده.",
    },
  },

  // STEP 5 (16 nodes: AAAA to BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Two billion viewers watched in awe as live 4K footage streamed from the deep canyon. For the first time, humanity saw the living lights of the abyss dancing in harmony with human science.",
    keywords: [{ word: "streamed", meaningFa: "پخش زنده اینترنتی شد", phonetic: "/striːmd/" }],
    question: {
      promptEn: "How many viewers watched the live deep-sea footage stream?",
      promptFa: "چند میلیارد نفر پخش زنده تصاویر اعماق اقیانوس را تماشا کردند؟",
      options: ["Two billion viewers", "Only ten people", "Five thousand students"],
      correctIndex: 0,
      hintSnippet: "Two billion viewers watched in awe as live 4K footage streamed from the deep canyon",
      clueFa: "دو میلیارد بیننده در سراسر جهان به تماشا نشستند.",
    },
    choiceA: {
      labelEn: "Designate World Ocean Day as a global holiday of wonder and peace!",
      labelFa: "روز جهانی اقیانوس را روز تعطیل رسمی شگفتی و صلح در تقویم اعلام کنید!",
      descriptionFa: "پایان شماره ۱",
    },
    choiceB: {
      labelEn: "Publish the open-access Deep Abyss Scientific Archive for all schools!",
      labelFa: "آرشیو علمی اعماق اقیانوس را به صورت رایگان در اختیار تمام مدارس جهان بگذارید!",
      descriptionFa: "پایان شماره ۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "The optical communication link operated without interruption for thirty days, proving that deep-sea bioluminescent code could transmit weather forecasts and climate warnings to the surface.",
    keywords: [{ word: "interruption", meaningFa: "وقفه، قطعی و اختلال در ارتباط", phonetic: "/ˌɪntəˈrʌpʃn/" }],
    question: {
      promptEn: "What vital information could the deep-sea bioluminescent code transmit to the surface?",
      promptFa: "کد نوری اعماق چه اطلاعات حیاتی‌ای را به سطح زمین مخابره می‌کرد؟",
      options: ["Weather forecasts and climate warnings", "Junk advertisements", "Cooking recipes"],
      correctIndex: 0,
      hintSnippet: "could transmit weather forecasts and climate warnings to the surface",
      clueFa: "پیش‌بینی آب‌وهوا و هشدارهای زودهنگام طوفان‌ها و تغییرات اقلیمی.",
    },
    choiceA: {
      labelEn: "Integrate trench climate data into the Global Early Tsunami Warning System!",
      labelFa: "داده‌های دره ماریانا را وارد سامانه هشدار سریع سونامی جهان کنید!",
      descriptionFa: "پایان شماره ۳",
    },
    choiceB: {
      labelEn: "Publish 'Dialogues with the Deep' in the International Journal of Astrobiology!",
      labelFa: "مقاله «گفتگو با اعماق» را در نشریه بین‌المللی اخترزیست‌شناسی منتشر کنید!",
      descriptionFa: "پایان شماره ۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "The bio-inspired geothermal generators produced clean zero-carbon baseload electricity for fifteen coastal cities, proving that nature's deep-sea wisdom holds the solutions to the climate crisis.",
    keywords: [{ word: "baseload", meaningFa: "بار پایه و حداقل برق دائمی شبکه بدون نوسان", phonetic: "/ˈbeɪsləʊd/" }],
    question: {
      promptEn: "For how many coastal cities did the geothermal generators produce clean electricity?",
      promptFa: "ژنراتورهای زمین‌گرمایی برای چند شهر ساحلی برق پاک تأمین کردند؟",
      options: ["For fifteen coastal cities", "Zero cities", "Only one small farm"],
      correctIndex: 0,
      hintSnippet: "produced clean zero-carbon baseload electricity for fifteen coastal cities",
      clueFa: "برای پانزده شهر بزرگ ساحلی برق پاک تولید کردند.",
    },
    choiceA: {
      labelEn: "Receive the Global Clean Energy Innovation Prize in Stockholm!",
      labelFa: "جایزه جهانی نوآوری انرژی پاک را در استکهلم دریافت کنید!",
      descriptionFa: "پایان شماره ۵",
    },
    choiceB: {
      labelEn: "Deploy five hundred geothermal units across vulnerable island nations!",
      labelFa: "پانصد واحد ژنراتور زمین‌گرمایی در کشورهای جزیره‌ای نیازمند نصب کنید!",
      descriptionFa: "پایان شماره ۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "The Master Spire was ratified as the world's first International Inviolable Marine Sanctuary, legally protected by thirty-two maritime nations against any industrial exploitation.",
    keywords: [{ word: "inviolable", meaningFa: "تخطی‌ناپذیر، مصون و کاملاً حفاظت‌شده", phonetic: "/ɪnˈvaɪələbl/" }],
    question: {
      promptEn: "How many maritime nations ratified the Master Spire as an Inviolable Sanctuary?",
      promptFa: "چند کشور ساحلی صخره مادر را به عنوان پناهگاه تخطی‌ناپذیر به رسمیت شناختند؟",
      options: ["Thirty-two maritime nations", "Only one country", "No countries agreed"],
      correctIndex: 0,
      hintSnippet: "legally protected by thirty-two maritime nations against any industrial exploitation",
      clueFa: "سی و دو کشور دریایی جهان این معاهده را امضا کردند.",
    },
    choiceA: {
      labelEn: "Install automated guardian buoys to safeguard the sanctuary perimeter!",
      labelFa: "بویه‌های هوشمند دیده‌بانی برای پاسداری از مرزهای منطقه نصب کنید!",
      descriptionFa: "پایان شماره ۷",
    },
    choiceB: {
      labelEn: "Host the World Marine Sanctuary Conference inside Hadal Station!",
      labelFa: "کنفرانس جهانی پناهگاه‌های دریایی را درون پایگاه هادل برگزار کنید!",
      descriptionFa: "پایان شماره ۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Open-sourcing the bio-microchip architecture sparked a technological renaissance: computing power tripled worldwide while global data center energy consumption plunged by seventy percent.",
    keywords: [{ word: "plunged", meaningFa: "به شدت کاهش یافت و سقوط کرد", phonetic: "/plʌndʒd/" }],
    question: {
      promptEn: "By how much did global data center energy consumption plunge?",
      promptFa: "مصرف برق مراکز داده در سراسر جهان چند درصد کاهش یافت؟",
      options: ["Plunged by seventy percent", "Increased by fifty percent", "Did not change"],
      correctIndex: 0,
      hintSnippet: "global data center energy consumption plunged by seventy percent",
      clueFa: "هفتاد درصد کاهش یافت و میلیاردها تن دی‌اکسید کربن حذف شد.",
    },
    choiceA: {
      labelEn: "Accept the Turing Award in Computer Science for biological computing!",
      labelFa: "جایزه تورینگ در علوم کامپیوتر را برای پردازش زیستی دریافت کنید!",
      descriptionFa: "پایان شماره ۹",
    },
    choiceB: {
      labelEn: "Equip climate modeling supercomputers with bio-chips to simulate planetary healing!",
      labelFa: "ابرکامپیوترهای پیش‌بینی اقلیم را برای بازسازی سیاره به تراشه‌های زیستی مجهز کنید!",
      descriptionFa: "پایان شماره ۱۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "The Hadal Bio-Quantum Institute graduated its first class of two hundred international doctoral fellows, pioneering organic technologies that harmonize human civilization with nature.",
    keywords: [{ word: "doctoral", meaningFa: "دوره دکتری تخصصی دانشگاهی", phonetic: "/ˈdɒktərəl/" }],
    question: {
      promptEn: "How many international doctoral fellows graduated in the institute's first class?",
      promptFa: "چند دانشجوی دکتری در اولین دوره آموزشکده فارغ‌التحصیل شدند؟",
      options: ["Two hundred international doctoral fellows", "Only two students", "One professor"],
      correctIndex: 0,
      hintSnippet: "graduated its first class of two hundred international doctoral fellows",
      clueFa: "دویست پژوهشگر دکتری برجسته فارغ‌التحصیل شدند.",
    },
    choiceA: {
      labelEn: "Establish student research fellowships in thirty developing coastal nations!",
      labelFa: "بورسیه‌های پژوهشی برای دانشجویان سی کشور ساحلی در حال توسعه ایجاد کنید!",
      descriptionFa: "پایان شماره ۱۱",
    },
    choiceB: {
      labelEn: "Publish the Manifesto of Bio-Quantum Ecology across university presses!",
      labelFa: "مانیفست بوم‌شناسی زیست‌کوانتومی را در دانشگاه‌های جهان منتشر کنید!",
      descriptionFa: "پایان شماره ۱۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Fifty-four nations signed the Geneva Oath of Abyssal Non-Interference, ensuring that humanity approaches the deep ocean neural network with humility, reverence, and ethical peace.",
    keywords: [{ word: "humility", meaningFa: "فروتنی، تواضع و دوری از غرور", phonetic: "/hjuːˈmɪləti/" }],
    question: {
      promptEn: "What values did the Geneva Oath ensure humanity approaches the abyss with?",
      promptFa: "سوگند ژنو تضمین کرد که انسان با چه ارزش‌هایی به اعماق اقیانوس نزدیک شود؟",
      options: ["With humility, reverence, and ethical peace", "With greed and weapons", "With noisy explosions"],
      correctIndex: 0,
      hintSnippet: "humanity approaches the deep ocean neural network with humility, reverence, and ethical peace",
      clueFa: "با فروتنی، احترام و صلح اخلاقی.",
    },
    choiceA: {
      labelEn: "Engrave the Oath of Non-Interference on a titanium plaque anchored at the trench rim!",
      labelFa: "سوگندنامه را بر لوحی تیتانیومی در لبه دره ماریانا ثبت و مهار کنید!",
      descriptionFa: "پایان شماره ۱۳",
    },
    choiceB: {
      labelEn: "Deliver the closing address at the World Environmental Ethics Tribunal in The Hague!",
      labelFa: "خطابه پایانی را در دیوان بین‌المللی اخلاق محیط‌زیست در لاهه ایراد کنید!",
      descriptionFa: "پایان شماره ۱۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "The passive acoustic hydrophone arrays recorded the rhythmic heartbeat of the ocean trench. Distributed online, the sound helped fifty million people worldwide find peace and serenity.",
    keywords: [{ word: "serenity", meaningFa: "آرامش درونی، صلح و سکون دلپذیر", phonetic: "/səˈrenəti/" }],
    question: {
      promptEn: "What did the rhythmic hydrophone recording of the trench sound like to listeners?",
      promptFa: "صدای ریتمیک هیدروفون‌های اعماق شبیه چه چیزی بود و چه حسی ایجاد کرد؟",
      options: ["The rhythmic heartbeat of the ocean trench bringing peace and serenity", "Loud factory noise", "Thunderclaps"],
      correctIndex: 0,
      hintSnippet: "recorded the rhythmic heartbeat of the ocean trench. Distributed online, the sound helped fifty million people worldwide find peace",
      clueFa: "تپش آرامش‌بخش قلب اقیانوس که به ۵۰ میلیون نفر آرامش بخشید.",
    },
    choiceA: {
      labelEn: "Create the 'Heartbeat of Earth' global ambient sound archive for mental health!",
      labelFa: "آرشیو جهانی صدای تپش زمین را برای سلامت روان و آرامش انسان‌ها راه‌اندازی کنید!",
      descriptionFa: "پایان شماره ۱۵",
    },
    choiceB: {
      labelEn: "Compose an orchestral symphony accompanied by live deep-trench audio feeds!",
      labelFa: "سمفونی ارکسترال با پخش زنده اصوات اعماق اقیانوس اجرا کنید!",
      descriptionFa: "پایان شماره ۱۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "NASA and ESA incorporated the abyssal coordinates into the upcoming Europa Clipper and Titan Ocean Explorer missions, equipping deep-space probes with bio-optical decoders.",
    keywords: [{ word: "incorporated", meaningFa: "ادغام کردند و در دستور کار قرار دادند", phonetic: "/ɪnˈkɔːpəreɪtɪd/" }],
    question: {
      promptEn: "Which space missions incorporated the deep-sea bio-optical decoders?",
      promptFa: "کدام مأموریت‌های فضایی رمزگشاهای نوری اعماق دریا را در فضاپیماها نصب کردند؟",
      options: ["Europa Clipper and Titan Ocean Explorer missions", "Commercial tourist rockets", "Satellite TV launchers"],
      correctIndex: 0,
      hintSnippet: "incorporated the abyssal coordinates into the upcoming Europa Clipper and Titan Ocean Explorer missions",
      clueFa: "مأموریت‌های اروپا کلیپر و کاوشگر اقیانوس‌های تیتان.",
    },
    choiceA: {
      labelEn: "Appoint Adrian as Chief Astrobiological Consultant to the Outer Planets Exploration Council!",
      labelFa: "آدریان را به سمت مشاور ارشد اخترزیست‌شناسی شورای کاوش سیارات منصوب کنید!",
      descriptionFa: "پایان شماره ۱۷",
    },
    choiceB: {
      labelEn: "Witness the rocket launch bound for Jupiter's moon Europa from Cape Canaveral!",
      labelFa: "پرتاب موشک عازم قمر اروپای مشتری را از پایگاه فضایی کیپ کاناورال تماشا کنید!",
      descriptionFa: "پایان شماره ۱۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "The newly designed deep-space probe *Abyssal Pioneer* carried living synthetic crystal nodes. As it exited Earth orbit, it flashed prime number sequences, ready to greet foreign oceans.",
    keywords: [{ word: "synthetic", meaningFa: "سنتز‌شده و بازآفرینی‌شده در آزمایشگاه", phonetic: "/sɪnˈθetɪk/" }],
    question: {
      promptEn: "What name was given to the deep-space probe carrying the crystal nodes?",
      promptFa: "کاوشگر فضایی حامل بلورهای نوری چه نام گرفت؟",
      options: ["Abyssal Pioneer", "Dark Star", "Iron Bird"],
      correctIndex: 0,
      hintSnippet: "deep-space probe Abyssal Pioneer carried living synthetic crystal nodes",
      clueFa: "کاوشگر «پیشگام اعماق (Abyssal Pioneer)» نام گرفت.",
    },
    choiceA: {
      labelEn: "Monitor the probe's telemetry alongside astronomers at the Mauna Kea Observatory!",
      labelFa: "داده‌های مخابراتی کاوشگر را در رصدخانه مائونا کیا رصد کنید!",
      descriptionFa: "پایان شماره ۱۹",
    },
    choiceB: {
      labelEn: "Publish an educational comic book about Abyssal Pioneer for young dreamers!",
      labelFa: "کتاب مصور ماجراهای پیشگام اعماق را برای نوجوانان منتشر کنید!",
      descriptionFa: "پایان شماره ۲۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "The 'Earth Charter of Interspecies Consciousness' was ratified by one hundred and ninety-three countries, officially recognizing that consciousness belongs to the planet as a living whole.",
    keywords: [{ word: "interspecies", meaningFa: "میان‌گونه‌ای و فراتر از گونه انسان", phonetic: "/ˌɪntəˈspiːʃiːz/" }],
    question: {
      promptEn: "How many countries ratified the Earth Charter of Interspecies Consciousness?",
      promptFa: "چند کشور منشور آگاهی میان‌گونه‌ای زمین را تصویب کردند؟",
      options: ["One hundred and ninety-three countries", "Only three countries", "None"],
      correctIndex: 0,
      hintSnippet: "ratified by one hundred and ninety-three countries",
      clueFa: "صد و نود و سه کشور جهان آن را تصویب کردند.",
    },
    choiceA: {
      labelEn: "Receive the Nobel Peace Prize in Oslo for uniting humanity with planetary nature!",
      labelFa: "جایزه صلح نوبل را در اسلو برای پیوند انسان با طبیعت زنده سیاره دریافت کنید!",
      descriptionFa: "پایان شماره ۲۱",
    },
    choiceB: {
      labelEn: "Incorporate interspecies ecological ethics into university law curriculums worldwide!",
      labelFa: "حقوق بوم‌شناختی میان‌گونه‌ای را وارد دروس دانشکده‌های حقوق جهان کنید!",
      descriptionFa: "پایان شماره ۲۲",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "The live interspecies symphony streamed to sixty symphony halls worldwide: the London Philharmonic harmonized live with bioluminescent light pulses from five miles beneath the sea.",
    keywords: [{ word: "philharmonic", meaningFa: "ارکستر فیلارمونیک بزرگ سازهای کلاسیک", phonetic: "/ˌfɪlhɑːˈmɒnɪk/" }],
    question: {
      promptEn: "Which world-famous orchestra harmonized live with the deep-sea coral pulses?",
      promptFa: "کدام ارکستر نامدار جهان با پالس‌های نوری اعماق هم‌نوازی زنده اجرا کرد؟",
      options: ["The London Philharmonic", "A local school band", "A street drum circle"],
      correctIndex: 0,
      hintSnippet: "The London Philharmonic harmonized live with bioluminescent light pulses from five miles beneath the sea",
      clueFa: "ارکستر فیلارمونیک لندن با پالس‌های اعماق اقیانوس هم‌نوازی کرد.",
    },
    choiceA: {
      labelEn: "Release the live vinyl album titled 'Song of the Trench' for charity!",
      labelFa: "آلبوم موسیقی «نغمه دره ژرف» را برای امور خیریه منتشر کنید!",
      descriptionFa: "پایان شماره ۲۳",
    },
    choiceB: {
      labelEn: "Establish an annual 'Symphony of the Oceans' festival in coastal cities!",
      labelFa: "جشنواره سالانه «سمفونی اقیانوس‌ها» را در شهرهای ساحلی جهان برپا کنید!",
      descriptionFa: "پایان شماره ۲۴",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The International Deep-Sea Ranger Patrol launched twelve silent solar-powered trimaran cutters, patrolling the Mariana Trench to ensure no illicit deep-sea dredging ever occurs.",
    keywords: [{ word: "trimaran", meaningFa: "قایق سه‌بدنه پرسرعت و فوق‌پایدار دریایی", phonetic: "/ˈtraɪməræn/" }],
    question: {
      promptEn: "What kind of vessels were launched for the Deep-Sea Ranger Patrol?",
      promptFa: "چه نوع شناورهایی برای یگان محیط‌بانی اعماق دریا به آب انداخته شدند؟",
      options: ["Silent solar-powered trimaran cutters", "Heavy diesel oil tankers", "Broken wooden rafts"],
      correctIndex: 0,
      hintSnippet: "launched twelve silent solar-powered trimaran cutters",
      clueFa: "دوازده شناور تندرو و بی‌صدای سه‌بدنه خورشیدی.",
    },
    choiceA: {
      labelEn: "Command the flagship cutter *Ocean Guardian* on its inaugural patrol!",
      labelFa: "شناور پرچمدار «نگهبان اقیانوس» را در نخستین گشت‌زنی هدایت کنید!",
      descriptionFa: "پایان شماره ۲۵",
    },
    choiceB: {
      labelEn: "Equip the patrol fleet with live sonar links to Hadal Station!",
      labelFa: "ناوگان گشتی را به خطوط زنده سونار پایگاه هادل مجهز کنید!",
      descriptionFa: "پایان شماره ۲۶",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "The Blue Planet Laureate was awarded to Adrian, Meera, and Thorne at Tokyo's Imperial Hotel. The citation praised their courage for proving the ocean's depths are living sanctuaries.",
    keywords: [{ word: "citation", meaningFa: "متن لوح تقدیر و ستایش‌نامه رسمی", phonetic: "/saɪˈteɪʃn/" }],
    question: {
      promptEn: "Where was the Blue Planet Laureate presentation ceremony held?",
      promptFa: "مراسم اهدای جایزه سیاره آبی در کجا برگزار شد؟",
      options: ["At Tokyo's Imperial Hotel", "On a city subway platform", "At an airport gate"],
      correctIndex: 0,
      hintSnippet: "The Blue Planet Laureate was awarded to Adrian, Meera, and Thorne at Tokyo's Imperial Hotel",
      clueFa: "در هتل مجلل ایمپریال توکیو برگزار شد.",
    },
    choiceA: {
      labelEn: "Donate the award purse to build underwater marine science laboratories for schools!",
      labelFa: "پاداش نقدی جایزه را برای ساخت آزمایشگاه‌های دریایی در مدارس اهدا کنید!",
      descriptionFa: "پایان شماره ۲۷",
    },
    choiceB: {
      labelEn: "Deliver a televised speech on how science and humility can save the earth!",
      labelFa: "سخنرانی تلویزیونی درباره نقش علم و فروتنی در نجات زمین ایراد کنید!",
      descriptionFa: "پایان شماره ۲۸",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "Hadal Station Two anchored successfully in the South Atlantic Abyss. When its observation dome lit up, an identical network of luminescent coral spires pulsed in warm welcome.",
    keywords: [{ word: "identical", meaningFa: "مشابه، یکسان و هم‌نوع", phonetic: "/aɪˈdentɪkl/" }],
    question: {
      promptEn: "What welcomed Hadal Station Two when its observation dome lit up in the South Atlantic?",
      promptFa: "وقتی گنبد پایگاه هادل ۲ در اقیانوس اطلس جنوبی روشن شد چه چیزی به آن خوش‌آمد گفت؟",
      options: [
        "An identical network of luminescent coral spires pulsing in welcome",
        "A fleet of hostile submarines",
        "An underwater volcano exploding",
      ],
      correctIndex: 0,
      hintSnippet: "an identical network of luminescent coral spires pulsed in warm welcome",
      clueFa: "شبکه مشابهی از صخره‌های مرجانی درخشان با نور خوش‌آمد گفتند.",
    },
    choiceA: {
      labelEn: "Link both stations into a unified trans-oceanic acoustic research corridor!",
      labelFa: "هر دو پایگاه را به یک دالان پژوهشی صوتی میان‌اقیانوسی متصل کنید!",
      descriptionFa: "پایان شماره ۲۹",
    },
    choiceB: {
      labelEn: "Toast with synthetic deep-sea algae tea to the global brotherhood of the abyss!",
      labelFa: "با چای جلبک اعماق به سلامتی همبستگی جهانی پاسداران اقیانوس بنوشید!",
      descriptionFa: "پایان شماره ۳۰",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Standing inside the panoramic glass dome beneath five miles of dark water, Adrian and Meera watched glowing ribbons of electric violet coral light pulse like the heartbeat of an awake planet.",
    keywords: [{ word: "awake", meaningFa: "بیدار، هوشیار و آگاه", phonetic: "/əˈweɪk/" }],
    question: {
      promptEn: "What did the glowing ribbons of electric violet coral light pulse like?",
      promptFa: "روبان‌های نورانی بنفش صخره مرجانی شبیه چه چیزی می‌تپیدند؟",
      options: [
        "Like the heartbeat of an awake planet",
        "Like a blinking street traffic light",
        "Like an alarm clock",
      ],
      correctIndex: 0,
      hintSnippet: "pulse like the heartbeat of an awake planet",
      clueFa: "شبیه به تپش قلب یک سیاره زنده، هوشیار و بیدار.",
    },
    choiceA: {
      labelEn: "Hold hands and smile, knowing that humanity has finally found its place in the cosmos!",
      labelFa: "دست در دست هم لبخند بزنید و بدانید که انسان سرانجام جایگاه راستین خود را در کیهان یافت!",
      descriptionFa: "پایان شماره ۳۱",
    },
    choiceB: {
      labelEn: "Dedicate your lives to safeguarding the deep blue soul of planet Earth!",
      labelFa: "زندگی‌تان را وقف پاسداری ابدی از روح نیلگون و زنده سیاره زمین کنید!",
      descriptionFa: "پایان شماره ۳۲",
    },
  },
];

// 32 UNIQUE ENDINGS
const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "World Ocean Day Reborn", titleFa: "تولّد دوباره روز جهانی اقیانوس", badgeCategory: "legendary", badgeIcon: "🌊", badgeNameFa: "پایان جهانی و جاودان", climaxEn: "Two billion people celebrate the living lights of the abyss, uniting humanity in wonder and reverence for the blue planet.", climaxFa: "دو میلیارد انسان با تماشای نورهای زنده اعماق، در شگفتی و احترام به سیاره آبی متحد شدند.", xpReward: 275 },
  { pathCode: "AAAAB", titleEn: "The Open Ocean Archive", titleFa: "آرشیو علمی آزاد اقیانوس", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان آموزشی و الهام‌بخش", climaxEn: "Millions of school students study the deep-sea video archive, inspired to dedicate their futures to ocean conservation.", climaxFa: "میلیون‌ها دانش‌آموز آرشیو ویدیویی اعماق را مطالعه کردند و آینده‌شان را وقف نجات اقیانوس‌ها ساختند.", xpReward: 255 },
  { pathCode: "AAABA", titleEn: "The Tsunami Guardian Network", titleFa: "نگهبان هوشمند سونامی", badgeCategory: "heroic", badgeIcon: "📡", badgeNameFa: "پایان نجات‌بخش بشر", climaxEn: "The coral network's early acoustic warnings save three hundred thousand lives across coastal Pacific communities.", climaxFa: "هشدارهای اولیه صخره مرجانی جان سیصد هزار انسان را در سواحل اقیانوس آرام از خطر سونامی نجات داد.", xpReward: 280 },
  { pathCode: "AAABB", titleEn: "Dialogues with the Deep", titleFa: "گفتگو با اعماق زمین", badgeCategory: "scholar", badgeIcon: "📚", badgeNameFa: "پایان علمی و فلسفی", climaxEn: "The published research paper bridges marine biology and astrobiology, altering scientific history forever.", climaxFa: "مقاله علمی منتشرشده پیوندی تاریخی میان زیست‌شناسی دریا و اخترزیست‌شناسی ایجاد کرد.", xpReward: 260 },
  { pathCode: "AABAA", titleEn: "The Clean Heat Breakthrough", titleFa: "انرژی زمین‌گرمایی پاک", badgeCategory: "legendary", badgeIcon: "⚡", badgeNameFa: "پایان فناوری نوین سبز", climaxEn: "Fifteen coastal megacities replace fossil fuel plants with clean geothermal energy inspired by the deep trench.", climaxFa: "پانزده کلان‌شهر ساحلی نیروگاه‌های فسیلی را با انرژی زمین‌گرمایی پاک برگرفته از اعماق جایگزین کردند.", xpReward: 280 },
  { pathCode: "AABAB", titleEn: "Islands of Green Power", titleFa: "جزایر انرژی پاک", badgeCategory: "explorer", badgeIcon: "🏝️", badgeNameFa: "پایان زیست‌محیطی جزایر", climaxEn: "Vulnerable Pacific island nations achieve total energy independence through deep-sea geothermal units.", climaxFa: "کشورهای جزیره‌ای آسیب‌پذیر اقیانوس آرام با ژنراتورهای اعماق به استقلال کامل انرژی پاک رسیدند.", xpReward: 265 },
  { pathCode: "AABBA", titleEn: "The Inviolable Sanctuary", titleFa: "پناهگاه مقدس و تخطی‌ناپذیر", badgeCategory: "legendary", badgeIcon: "🛡️", badgeNameFa: "پایان دیپلماتیک ماندگار", climaxEn: "Thirty-two nations unite to legally protect the master spire, establishing the world's first sacred ocean reserve.", climaxFa: "سی و دو کشور جهان برای حفاظت قانونی از صخره مادر متحد شدند و نخستین ذخیره‌گاه مقدس دریا را ساختند.", xpReward: 275 },
  { pathCode: "AABBB", titleEn: "The Hadal Conference", titleFa: "همایش بین‌المللی هادل", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان همایش اعماق", climaxEn: "Marine scientists from seventy nations convene inside the underwater dome to plan the future of planetary conservation.", climaxFa: "دانشمندان هفتاد کشور درون گنبد زیر آب گرد آمدند تا آینده حفاظت از سیاره زمین را طرح‌ریزی کنند.", xpReward: 260 },
  { pathCode: "ABAAA", titleEn: "The Turing Award for Bio-Chips", titleFa: "جایزه تورینگ برای تراشه‌های زیستی", badgeCategory: "legendary", badgeIcon: "🏆", badgeNameFa: "پایان فتح قله‌های کامپیوتر", climaxEn: "The zero-carbon bio-microchip revolutionizes global computing, winning the highest honor in computer science.", climaxFa: "ریزتراشه‌های بدون کربن زیستی پردازش داده‌ها را متحول ساختند و برنده معتبرترین جایزه کامپیوتر شدند.", xpReward: 285 },
  { pathCode: "ABAAB", titleEn: "Planetary Healing Simulations", titleFa: "شبیه‌سازی احیای زمین", badgeCategory: "scholar", badgeIcon: "💻", badgeNameFa: "پایان نجات اقلیم زمین", climaxEn: "Supercomputers running on coral bio-chips accurately model global reforestation and ocean cleanup pathways.", climaxFa: "ابرکامپیوترهای زیستی نقشه‌های دقیق احیای جنگل‌ها و پاکسازی اقیانوس‌های جهان را طراحی کردند.", xpReward: 270 },
  { pathCode: "ABABA", titleEn: "Fellows of the Blue Future", titleFa: "دانش‌پژوهان فردای نیلگون", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان آینده‌ساز آموزشی", climaxEn: "Two hundred doctoral fellows fan out across the globe, leading sustainable marine biotechnology initiatives.", climaxFa: "دویست پژوهشگر دکتری به سراسر جهان رفتند و رهبری پروژه‌های زیست‌فناوری پایدار را به دست گرفتند.", xpReward: 265 },
  { pathCode: "ABABB", titleEn: "Manifesto of Bio-Quantum Ecology", titleFa: "مانیفست بوم‌شناسی کوانتومی", badgeCategory: "scholar", badgeIcon: "📜", badgeNameFa: "پایان علمی بنیادین", climaxEn: "The published manifesto bridges indigenous nature philosophy with quantum computing in top universities.", climaxFa: "مانیفست منتشرشده پیوندی عمیق میان حکمت اصیل بومی و پردازش کوانتومی در دانشگاه‌ها برقرار ساخت.", xpReward: 260 },
  { pathCode: "ABBAA", titleEn: "The Titanium Oath of The Deep", titleFa: "لوح تیتانیومی سوگند اعماق", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان اخلاقی و ابدی", climaxEn: "Anchored five miles deep, the titanium plaque reminds all explorers to tread with reverence and love.", climaxFa: "لوح تیتانیومی در عمق هشت کیلومتری آب نصب شد تا به انسان‌ها یادآوری کند با عشق و فروتنی قدم بردارند.", xpReward: 275 },
  { pathCode: "ABBAB", titleEn: "The Hague Environmental Tribunal", titleFa: "دیوان محیط‌زیست لاهه", badgeCategory: "heroic", badgeIcon: "⚖️", badgeNameFa: "پایان حقوقی بین‌المللی", climaxEn: "The tribunal incorporates interspecies rights into international law, legally defending the rights of the oceans.", climaxFa: "دیوان بین‌المللی حقوق موجودات زنده را وارد قوانین جهان کرد و از حقوق پایه‌ای اقیانوس‌ها دفاع نمود.", xpReward: 270 },
  { pathCode: "ABBBA", titleEn: "Heartbeat of the Earth", titleFa: "طنین تپش قلب زمین", badgeCategory: "scholar", badgeIcon: "🎧", badgeNameFa: "پایان آرامش‌بخش جهانی", climaxEn: "Fifty million listeners find daily calm in the rhythmic hydrophone recordings of the abyss's quiet pulse.", climaxFa: "پنجاه میلیون نفر با نوای آرامش‌بخش تپش‌های منظم اعماق اقیانوس به آرامش و سکون درونی رسیدند.", xpReward: 260 },
  { pathCode: "ABBBB", titleEn: "The Ocean's Orchestral Symphony", titleFa: "سمفونی ارکسترال اقیانوس", badgeCategory: "legendary", badgeIcon: "🎼", badgeNameFa: "پایان هنری شاهکار", climaxEn: "The live musical composition uniting strings and deep-sea acoustic harmonics brings tears to audiences worldwide.", climaxFa: "قطعه موسیقی مشترک ارکستر و امواج اعماق اشک شوق را بر دیدگان شنوندگان در سراسر گیتی نشاند.", xpReward: 275 },
  { pathCode: "BAAAA", titleEn: "Chief Consultant to Outer Oceans", titleFa: "مشاور ارشد اقیانوس‌های فضا", badgeCategory: "legendary", badgeIcon: "🚀", badgeNameFa: "پایان اخترزیست‌شناسی ممتاز", climaxEn: "Adrian leads planning for planetary probes sent to search for living neural oceans on Jupiter's moon Europa.", climaxFa: "آدریان مأموریت طراحی کاوشگرهای فضایی عازم اقیانوس‌های زنده قمر اروپای مشتری را رهبری کرد.", xpReward: 285 },
  { pathCode: "BAAAB", titleEn: "Launch to Jupiter's Moons", titleFa: "پرواز به سوی قمرهای مشتری", badgeCategory: "heroic", badgeIcon: "🌌", badgeNameFa: "پایان فضایی پرهیجان", climaxEn: "Watching the rocket ignite into the Florida sky, the scientists celebrate a message bridging Earth and space.", climaxFa: "با تماشای صعود موشک به آسمان، دانشمندان پیامی را جشن گرفتند که اعماق زمین را به فضا وصل کرد.", xpReward: 270 },
  { pathCode: "BAABA", titleEn: "Telemetry of Abyssal Pioneer", titleFa: "مخابرات کاوشگر پیشگام اعماق", badgeCategory: "scholar", badgeIcon: "🛰️", badgeNameFa: "پایان رصد اعماق کیهان", climaxEn: "Deep-space antennas track Abyssal Pioneer as it flashes prime number light codes across interplanetary space.", climaxFa: "آنتن‌های اعماق فضا کاوشگر را که پالس‌های اعداد اول را به کهکشان می‌تاباند با افتخار ردیابی کردند.", xpReward: 265 },
  { pathCode: "BAABB", titleEn: "The Abyssal Pioneer Storybook", titleFa: "کتاب مصور پیشگام اعماق", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان الهام‌بخش کودکان", climaxEn: "Five million young readers learn how deep-sea coral technology powers humanity's greatest voyages to the stars.", climaxFa: "پنج میلیون کودک آموختند چگونه دانش مرجان‌های اعماق، سفر انسان به ستارگان را ممکن ساخت.", xpReward: 250 },
  { pathCode: "BABA", titleEn: "Nobel Peace Prize of Oslo", titleFa: "جایزه صلح نوبل در اسلو", badgeCategory: "legendary", badgeIcon: "🏅", badgeNameFa: "پایان والامرتبه صلح", climaxEn: "Adrian and Meera accept the Nobel Peace Prize for uniting humanity in recognition of Earth's living soul.", climaxFa: "آدریان و میرا جایزه صلح نوبل را برای پیوند آگاهی انسان با روح زنده سیاره زمین بر سینه زدند.", xpReward: 285 },
  { pathCode: "BABB", titleEn: "The Interspecies Law Standard", titleFa: "قانون بین‌المللی حقوق حیات", badgeCategory: "scholar", badgeIcon: "⚖️", badgeNameFa: "پایان حقوقی مترقی", climaxEn: "Law schools across sixty countries mandate curriculum on planetary rights and the defense of oceanic life.", climaxFa: "دانشکده‌های حقوق شصت کشور تدریس دفاع قانونی از حقوق زیستی اقیانوس‌ها را اجباری کردند.", xpReward: 265 },
  { pathCode: "BABBA", titleEn: "Song of the Trench Vinyl", titleFa: "آلبوم گرامافون نغمه دره ژرف", badgeCategory: "legendary", badgeIcon: "🎵", badgeNameFa: "پایان موسیقی جاودان", climaxEn: "The historic charity record raises thirty million dollars to fund ocean sanctuaries worldwide.", climaxFa: "صفحه گرامافون خیریه سی میلیون دلار برای ساخت پناهگاه‌های امن دریایی در جهان جمع‌آوری کرد.", xpReward: 270 },
  { pathCode: "BABBB", titleEn: "The Annual Symphony of Oceans", titleFa: "جشنواره سالانه سمفونی اقیانوس", badgeCategory: "heroic", badgeIcon: "🎻", badgeNameFa: "پایان کارناوال موسیقی", climaxEn: "Coastal cities dim exterior lights to listen to live deep-trench acoustic harmonies every summer equinox.", climaxFa: "شهرهای ساحلی چراغ‌ها را خاموش کردند تا در شب تابستان به موسیقی زنده اعماق اقیانوس گوش دهند.", xpReward: 260 },
  { pathCode: "BBAAA", titleEn: "Helm of the Ocean Guardian", titleFa: "فرماندهی شناور نگهبان اقیانوس", badgeCategory: "heroic", badgeIcon: "🚢", badgeNameFa: "پایان شجاعانه پاسداری", climaxEn: "Patrolling the high seas aboard the solar trimaran, rangers ensure the Mariana Trench remains untouched forever.", climaxFa: "محیط‌بانان بر فراز امواج پاسداری دادند تا دره ماریانا تا ابد دست‌نخورده و مقدس باقی بماند.", xpReward: 275 },
  { pathCode: "BBAAB", titleEn: "The Real-Time Acoustic Shield", titleFa: "سپر صوتی زنده اعماق", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان نظارت هوشمند", climaxEn: "Live hydrophone links alert international authorities to unauthorized ships within seconds, halting all poaching.", climaxFa: "خطوط زنده هیدروفون ظرف چند ثانیه ورود غیرمجاز کشتی‌ها را هشدار داد و هرگونه تخلف را متوقف کرد.", xpReward: 265 },
  { pathCode: "BBABA", titleEn: "Laboratories of the Blue Planet", titleFa: "آزمایشگاه‌های رایگان سیاره آبی", badgeCategory: "scholar", badgeIcon: "🏫", badgeNameFa: "پایان بخشندگی و آموزش", climaxEn: "Fifty coastal schools receive mobile marine science labs, training the next generation of ocean protectors.", climaxFa: "پنجاه مدرسه ساحلی به آزمایشگاه‌های مجهز سیار مجهز شدند تا نسلی نو از مدافعان دریا تربیت شوند.", xpReward: 260 },
  { pathCode: "BBABB", titleEn: "The Humility Speech Broadcast", titleFa: "سخنرانی فروتنی و علم در رسانه‌ها", badgeCategory: "legendary", badgeIcon: "📺", badgeNameFa: "پایان رسانه‌ای ماندگار", climaxEn: "One hundred million viewers are moved as Adrian reflects: 'We did not conquer the deep; we listened to it.'", climaxFa: "صد میلیون بیننده متأثر شدند وقتی آدریان گفت: «ما اعماق را فتح نکردیم، بلکه به نغمه‌هایش گوش دادیم».", xpReward: 275 },
  { pathCode: "BBBAA", titleEn: "The Trans-Oceanic Corridor", titleFa: "دالان میان‌اقیانوسی هادل", badgeCategory: "legendary", badgeIcon: "🌐", badgeNameFa: "پایان علمی ابرشبکه", climaxEn: "Linked across the Atlantic and Pacific, Hadal Stations reveal the singular continuous heartbeat of global waters.", climaxFa: "با پیوند دو اقیانوس، پایگاه‌های هادل تپش واحد و هماهنگ آب‌های کل کره زمین را آشکار کردند.", xpReward: 280 },
  { pathCode: "BBBAB", titleEn: "Tea in the South Atlantic Abyss", titleFa: "چای در اعماق اقیانوس اطلس", badgeCategory: "funny", badgeIcon: "🍵", badgeNameFa: "پایان صمیمی و دوستانه", climaxEn: "Clinking mugs inside the observation dome, the scientists celebrate human friendship five miles down.", climaxFa: "با به هم زدن ماگ‌های چای در عمق هشت کیلومتری، دانشمندان دوستی جاودانه انسان‌ها را جشن گرفتند.", xpReward: 250 },
  { pathCode: "BBBBA", titleEn: "Found in the Cosmos", titleFa: "یافته‌شده در آغوش کیهان", badgeCategory: "legendary", badgeIcon: "✨", badgeNameFa: "پایان فلسفی و متعالی", climaxEn: "Holding hands before the electric violet lights, Adrian and Meera realize that love and wonder connect all living things.", climaxFa: "دست در دست هم روبروی نورهای بنفش، دریافتند که عشق و شگفتی تمام اجزای جهان را به هم پیوند می‌دهد.", xpReward: 285 },
  { pathCode: "BBBBB", titleEn: "Guardians of the Blue Soul", titleFa: "پاسداران روح نیلگون زمین", badgeCategory: "legendary", badgeIcon: "⭐", badgeNameFa: "پایان اسطوره‌ای و ابدی", climaxEn: "Under the vast dark ocean waters, the coral pulses peacefully, guarded forever by the reverence of humankind.", climaxFa: "در زیر آب‌های بیکران اقیانوس، صخره مرجانی با آرامش می‌تپد؛ در پناه مراقبت و احترام ابدی انسان‌ها.", xpReward: 285 },
];

export const story4DeepOcean: AdventureStory = buildAdventureStory({
  id: "b2-deep-ocean-biosphere",
  storyIndex: 4,
  cefr: "B2",
  titleEn: "Echoes of the Ocean Trench",
  titleFa: "زمزمه‌های اعماق اقیانوس آرام",
  genre: "scifi",
  genreLabelFa: "🚀 فانتزی و علمی‌تخیلی",
  genreIcon: "🚀",
  synopsisEn:
    "Dr. Adrian Cole and AI systems director Dr. Meera Ray discover an intelligent bioluminescent coral network five miles beneath the Pacific. Decode its planetary secrets across 32 sci-fi endings!",
  synopsisFa:
    "دکتر آدریان کول، زیست‌شناس اعماق دریا، و دکتر میرا ری، مدیر سامانه‌های هوش مصنوعی، در پایگاه پژوهشی اعماق دره ماریانا در عمق هشت کیلومتری اقیانوس آرام متوجه سیگنال‌های صوتی و پالس‌های نوری هماهنگ یک صخره مرجانی غول‌پیکر می‌شوند! آیا با رمزگشایی کدهای ریاضی فیبوناچی زبان این هوش زیستی کهن را کشف می‌کنی و زمین را نجات می‌دهی؟ ۳۲ پایان علمی‌تخیلی شگفت‌انگیز در انتظارته!",
  coverImage: "/images/skills/reading/b2-deep-ocean.webp",
  nodes,
  endings,
});
