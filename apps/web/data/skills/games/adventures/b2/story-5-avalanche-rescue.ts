import { buildAdventureStory, NodeDraft, EndingDraft } from "../builder";
import type { AdventureStory } from "../../reading-adventure-types";

// ============================================================================
// STORY 5 (B2 - Adult): Midnight on Avalanche Ridge (عملیات نجات نیمه‌شب در گردنه بهمن)
// Genre: Thriller & Rescue (هیجان و نجات‌بخشی)
// CEFR: B2 (Past perfect progressive, mixed conditionals, modals of deduction, technical SAR thriller)
// Characters: Jack Reynolds (SAR Commander), Valerie Lin (Flight Paramedic), Pilot Dave, Marcus Vance (Surveyor)
// ============================================================================

const nodes: NodeDraft[] = [
  // STEP 1: Root
  {
    stepNumber: 1,
    pathCode: "root",
    passageEn:
      "At twenty-one hundred hours, an urgent distress signal echoed through Alpine SAR Sector Four. Marcus Vance, a senior environmental surveyor, had been measuring glacier recession at three thousand meters when a massive slab avalanche severed his descent route, leaving him stranded on a crumbling granite ledge. Outside the base hangar, howling gale-force winds whipped freezing spindrift across the runway. Jack Reynolds, a veteran search-and-rescue commander, knew that if they hesitated until daybreak, hypothermia would claim the surveyor's life. Beside him, flight paramedic Valerie Lin double-checked her technical harnesses while pilot Dave spun up the twin turbine engines of their high-altitude helicopter.",
    keywords: [
      { word: "distress signal", meaningFa: "پیام یا سیگنال اضطراری کمک", phonetic: "/dɪˈstres ˈsɪɡnəl/" },
      { word: "slab avalanche", meaningFa: "بهمن تخته‌ای (سقوط لایه‌ای عظیم و فشرده از برف)", phonetic: "/slæb ˈævəlæntʃ/" },
      { word: "spindrift", meaningFa: "پودر برف معلق در اثر وزش باد شدید", phonetic: "/ˈspɪndrɪft/" },
      { word: "hypothermia", meaningFa: "افت خطرناک دمای مرکزی بدن به دلیل سرمای شدید", phonetic: "/ˌhaɪpəˈθɜːrmiə/" },
    ],
    question: {
      promptEn: "Why was immediate rescue necessary instead of waiting for daylight?",
      promptFa: "چرا شروع فوری عملیات نجات در همان شب ضروری بود و نمی‌شد تا روشن شدن هوا صبر کرد؟",
      options: [
        "Hypothermia would claim the stranded surveyor's life before daybreak",
        "The rescue helicopter's fuel was about to expire",
        "A second team had challenged their mountain jurisdiction",
      ],
      correctIndex: 0,
      hintSnippet: "knew that if they hesitated until daybreak, hypothermia would claim the surveyor's life",
      clueFa: "به جمله ماقبل آخر دقت کن رفیق؛ دمای بدن نقشه‌بردار به خاطر سرمای کشنده انقدر سریع پایین می‌اومد که تا صبح زنده نمی‌موند.",
    },
    choiceA: {
      labelEn: "Launch an immediate aerial reconnaissance and attempt a direct winch hoist from the helicopter!",
      labelFa: "پرواز فوری را آغاز کرده و تلاش کن از طریق سیم‌بکسل و قرقره بالگرد او را مستقیماً بالا بکشی!",
      descriptionFa: "سرعت عمل بالاست اما تکان‌های بالگرد در باد شدید خطرآفرین خواهد بود.",
    },
    choiceB: {
      labelEn: "Land the aircraft on a stable lower saddle and ascend on technical climbing ropes along the ridge!",
      labelFa: "بالگرد را در گردنه پایدار پایینی فرود آورده و با طناب‌های فنی از یال صخره‌ای بالا بروید!",
      descriptionFa: "امنیت تیم بالاتر است اما صعود در بوران دقایق باارزشی را تلف می‌کند.",
    },
  },

  // STEP 2 (A & B)
  {
    stepNumber: 2,
    pathCode: "A",
    passageEn:
      "Dave maneuvered the twin-turbine aircraft directly through turbulent downdrafts above the sheer north face. Below, the helicopter's ten-million-candlepower spotlight pierced the swirl of blizzard snow, illuminating Marcus huddled inside an emergency bivy sack on a precariously narrow ledge. However, thermal sensors indicated that the hovering rotor wash was actively destabilizing an enormous snow overhang fifty meters above the survivor. If Valerie lowered on the winch cable immediately, the acoustic vibrations might trigger a secondary avalanche directly onto the ledge.",
    keywords: [
      { word: "downdrafts", meaningFa: "جریان‌های هوایی شدید رو به پایین در کوهستان", phonetic: "/ˈdaʊndrɑːfts/" },
      { word: "precariously", meaningFa: "به طرز بسیار ناپایدار و متزلزل", phonetic: "/prɪˈkeəriəsli/" },
      { word: "destabilizing", meaningFa: "از تعادل خارج کردن و ناپایدار ساختن", phonetic: "/diːˈsteɪbəlaɪzɪŋ/" },
      { word: "rotor wash", meaningFa: "گردباد شدید ناشی از چرخش پره‌های هلیکوپتر", phonetic: "/ˈrəʊtər wɒʃ/" },
    ],
    question: {
      promptEn: "What hazard did the hovering helicopter pose to the stranded surveyor?",
      promptFa: "چرخش پره‌های بالگرد در حالت ایستایی چه خطری برای نقشه‌بردار گرفتار ایجاد می‌کرد؟",
      options: [
        "The rotor wash and vibrations were destabilizing a massive snow overhang above him",
        "The spotlight was causing permanent blindness to his eyes",
        "The fuel exhaust was depleting oxygen on the ledge",
      ],
      correctIndex: 0,
      hintSnippet: "indicated that the hovering rotor wash was actively destabilizing an enormous snow overhang fifty meters above the survivor",
      clueFa: "خط سوم متن رو بخون؛ فشار باد پره‌ها و لرزش شدید داشت نقاب برفی غول‌پیکر بالای سرش رو می‌ریخت.",
    },
    choiceA: {
      labelEn: "Pull back the helicopter forty meters and insert Valerie via an angled pendulum cable descent!",
      labelFa: "بالگرد را چهل متر عقب بکش و والری را با فرود آونگی و زاویه‌دار روی لبه صخره فرود بیاور!",
      descriptionFa: "باد هلیکوپتر از برف فاصله می‌گیرد اما کنترل فرود آونگی والری مهارت خارق‌العاده می‌خواهد.",
    },
    choiceB: {
      labelEn: "Drop an automated acoustic avalanche charge to safely release the unstable cornice before inserting rescuers!",
      labelFa: "یک خرج صوتی کنترل‌شده پرتاب کن تا نقاب برفی ناپایدار را قبل از ورود امدادگران ایمن فروریزد!",
      descriptionFa: "تخلیه پیش‌دستانه برف مسیر را برای مانور بدون استرس هلیکوپتر باز می‌کند.",
    },
  },
  {
    stepNumber: 2,
    pathCode: "B",
    passageEn:
      "Dave touched the helicopter skids onto the icy saddle at twenty-six hundred meters, maintaining partial collective pitch to prevent sinking into powdery drifts. Jack and Valerie unloaded four heavy packs containing static kernmantle ropes, titanium snow anchors, and high-energy medical warmers. As the helicopter lifted away to conserve fuel, the sheer silence of the freezing wilderness engulfed them. Ahead lay the 'Devil's Backbone'—a razor-thin arête buffeted by sixty-knot arctic gusts that had claimed experienced mountaineers in past winters.",
    keywords: [
      { word: "collective", meaningFa: "اهرم کنترل گام ملخ در خلبانی بالگرد", phonetic: "/kəˈlektɪv/" },
      { word: "kernmantle", meaningFa: "طناب کوهنوردی با بافت مقاوم مغزی و روکش کشسان", phonetic: "/ˈkɜːrnmæntl/" },
      { word: "arête", meaningFa: "یال تیغه‌ای و باریک میان دو پرتگاه کوهستانی", phonetic: "/əˈreɪt/" },
      { word: "buffeted", meaningFa: "مورد ضربات متوالی و سهمگین باد قرار گرفته", phonetic: "/ˈbʌfɪtɪd/" },
    ],
    question: {
      promptEn: "What treacherous terrain did Jack and Valerie have to cross after landing?",
      promptFa: "جک و والری پس از فرود بالگرد باید از چه مسیر خطرناکی عبور می‌کردند؟",
      options: [
        "A razor-thin arête named Devil's Backbone battered by fierce arctic gusts",
        "An underground cavern filled with rising groundwater",
        "A frozen lake with cracking surface ice",
      ],
      correctIndex: 0,
      hintSnippet: "Ahead lay the 'Devil's Backbone'—a razor-thin arête buffeted by sixty-knot arctic gusts",
      clueFa: "جمله آخر رو ببین رفیق؛ یال تیغه‌ای و خطرناکی به نام ستون فقرات شیطان که بادهای قطبی بی‌رحمانه بهش می‌کوبید.",
    },
    choiceA: {
      labelEn: "Pound heavy snow pickets deep into the ridge firn to establish a secure continuous running belay!",
      labelFa: "نبشی‌های فولادی برف را در لایه‌های یخی فرو بکوب تا کارگاه حمایتی پیوسته و ایمن ساخته شود!",
      descriptionFa: "ایمنی صددرصد تضمین می‌شود اما حرکت با کوبیدن مداوم مهارها کند خواهد بود.",
    },
    choiceB: {
      labelEn: "Traverse rapidly along the leeward rock face using crampons and ice axes to beat incoming blizzard squalls!",
      labelFa: "با استفاده از کرامپون و تبر یخ با حداکثر سرعت از دیواره پشت‌به‌باد حرکت کنید تا قبل از تشدید کولاک برسید!",
      descriptionFa: "سرعت رسیدن به مصدوم دو برابر می‌شود اما لغزش کوچک بهای سنگینی دارد.",
    },
  },

  // STEP 3 (AA, AB, BA, BB)
  {
    stepNumber: 3,
    pathCode: "AA",
    passageEn:
      "Hanging forty meters beneath the helicopter on the steel hoist wire, Valerie executed a daring pendulum swing against the blinding blizzard. Timed to the second, she kicked off a granite protrusion and landed squarely on the six-foot snow ledge. Marcus looked up, shivering uncontrollably, his lips tinged blue from severe hypothermia. 'Took your sweet time,' Marcus muttered faintly through frozen whiskers. Valerie immediately assessed his vital signs: his core body temperature had plummeted to thirty-one degrees Celsius, and an unstable compound fracture immobilized his left ankle.",
    keywords: [
      { word: "pendulum", meaningFa: "حرکت آونگی و نوسانی با طناب در فضا", phonetic: "/ˈpendʒələm/" },
      { word: "protrusion", meaningFa: "برآمدگی یا پیش‌آمدگی صخره", phonetic: "/prəˈtruːʒn/" },
      { word: "hypothermia", meaningFa: "سرمازدگی مفرط و افت خطرناک دمای بدن", phonetic: "/ˌhaɪpəˈθɜːrmiə/" },
      { word: "immobilized", meaningFa: "بی‌حرکت و قفل‌شده در اثر آسیب‌دیدگی", phonetic: "/ɪˈməʊbəlaɪzd/" },
    ],
    question: {
      promptEn: "What critical medical conditions did Valerie discover when examining Marcus?",
      promptFa: "والری هنگام معاینه مصدوم متوجه چه شرایط پزشکی حساسی شد؟",
      options: [
        "A core temperature of thirty-one degrees Celsius and an immobilized fractured ankle",
        "Severe head trauma and complete loss of consciousness",
        "Third-degree frostbite on both hands requiring immediate surgery",
      ],
      correctIndex: 0,
      hintSnippet: "core body temperature had plummeted to thirty-one degrees Celsius, and an unstable compound fracture immobilized his left ankle",
      clueFa: "خط آخر رو نگاه کن؛ دمای بدنش به ۳۱ درجه افت کرده بود و قوزک پایش دچار شکستگی باز و بی‌حرکت شده بود.",
    },
    choiceA: {
      labelEn: "Administer heated intravenous saline and splint the fracture before preparing a rescue litter hoist!",
      labelFa: "سرم گرم تزریقی وصل کن، آتل پای شکسته را ببند و سبد برانکاردی حمل هوایی را آماده کن!",
      descriptionFa: "تثبیت کامل علائم حیاتی و عضو آسیب‌دیده خطر شوک جابجایی را از بین می‌برد.",
    },
    choiceB: {
      labelEn: "Slip Marcus directly into a rescue extraction harness and signal the hoist winch for instant evacuation!",
      labelFa: "مارکوس را مستقیماً داخل جلیقه مثلثی نجات قرار بده و با قرقره سریعاً به داخل کابین بالا بکش!",
      descriptionFa: "سرعت عمل در اولویت است تا قبل از تخریب کامل طاقچه صخره‌ای تخلیه شود.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "AB",
    passageEn:
      "Pilot Dave released the micro-charge canister precisely three hundred meters above the fractured cornice. The controlled concussion echoed like rolling thunder across the valley, releasing forty tons of unstable slab down the uninhabited eastern chute in a roaring plume of snow dust. The ledge below shuddered violently but held firm. With the lethal avalanche threat neutralized, Dave smoothly hovered within fifteen meters of the granite perch, giving Jack a rock-solid window to lower the emergency carbon-fiber stretcher directly onto the snow shelf.",
    keywords: [
      { word: "concussion", meaningFa: "موج انفجار ناشی از ضربه صوتی کنترل‌شده", phonetic: "/kənˈkʌʃn/" },
      { word: "plume", meaningFa: "ستون متراکم و برآمده از دود، پودر برف یا گاز", phonetic: "/pluːm/" },
      { word: "neutralized", meaningFa: "خنثی و بی‌اثر شده", phonetic: "/ˈnjuːtrəlaɪzd/" },
      { word: "carbon-fiber", meaningFa: "الیاف کربن سبک و فوق‌العاده مستحکم", phonetic: "/ˌkɑːrbən ˈfaɪbər/" },
    ],
    question: {
      promptEn: "What was the result of detonating the controlled avalanche micro-charge?",
      promptFa: "نتیجه شلیک خرج صوتی و انفجار کنترل‌شده چه بود؟",
      options: [
        "It safely discharged forty tons of unstable snow down the eastern chute, neutralizing the threat",
        "It triggered an unexpected secondary fracture that broke the radio antenna",
        "It alarmed the valley wildlife and alerted rival climbers",
      ],
      correctIndex: 0,
      hintSnippet: "releasing forty tons of unstable slab down the uninhabited eastern chute in a roaring plume of snow dust. The ledge below shuddered violently but held firm. With the lethal avalanche threat neutralized",
      clueFa: "جملات وسط متن رو ببین دوست من؛ چهل تن برف ناپایدار بدون آسیب به شیار خلوت شرقی ریخت و خطر بهمن کامل خنثی شد.",
    },
    choiceA: {
      labelEn: "Deploy Jack and Valerie together down the dual-hoist system to package Marcus in record time!",
      labelFa: "جک و والری را هم‌زمان با قرقره دوبل پایین بفرست تا مصدوم را در کمترین زمان بسته‌بندی و آماده کنند!",
      descriptionFa: "کار تیمی دو امدادگر زمان را به نصف می‌رساند.",
    },
    choiceB: {
      labelEn: "Anchor the hovering helicopter with a dynamic guide line while Jack descends alone with trauma equipment!",
      labelFa: "هلیکوپتر را با طناب راهنمای پویا مهار کرده و جک به تنهایی با تجهیزات تروما فرود بیاید!",
      descriptionFa: "پایداری بالگرد در تلاطم باد تضمین می‌شود.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BA",
    passageEn:
      "Step by methodical step, Jack hammered fifty-centimeter aluminum pickets into the dense neve snow, stringing high-tensile dyneema cord across the exposed ridge. Valerie moved right behind him, her headlamp cutting through the swirling blizzard like a beacon. The continuous running belay proved lifesaving when an eighty-mile-per-hour gust suddenly sheared off the leeward lip under Valerie's crampons; the dynamic rope arrested her fall immediately, leaving her dangling securely above the abyss until Jack hauled her back onto solid ice.",
    keywords: [
      { word: "methodical", meaningFa: "برنامه‌ریزی‌شده، منظم و دقیق", phonetic: "/məˈθɒdɪkl/" },
      { word: "dyneema", meaningFa: "الیاف فوق‌قوی و سبک مصنوعی مخصوص کوهنوردی سنگین", phonetic: "/daɪˈniːmə/" },
      { word: "beacon", meaningFa: "چراغ راهنما و نشانگر در تاریکی", phonetic: "/ˈbiːkən/" },
      { word: "arrested", meaningFa: "مهار و متوقف کرد (توقف سقوط ناگهانی)", phonetic: "/əˈrestɪd/" },
    ],
    question: {
      promptEn: "How did the continuous running belay save Valerie's life on the ridge?",
      promptFa: "کارگاه حمایتی پیوسته طناب چگونه جان والری را روی یال نجات داد؟",
      options: [
        "It immediately caught her when a ferocious wind gust sheared the snow ledge beneath her crampons",
        "It provided an electrical ground against static lightning strikes",
        "It warmed her hands through friction heating",
      ],
      correctIndex: 0,
      hintSnippet: "an eighty-mile-per-hour gust suddenly sheared off the leeward lip under Valerie's crampons; the dynamic rope arrested her fall immediately",
      clueFa: "به خط آخر نگاه کن رفیق؛ طناب محکم دینامیک به محض شکسته شدن لبه برفی زیر پایش سقوطش رو مهار کرد.",
    },
    choiceA: {
      labelEn: "Establish a bombproof equalized quad anchor directly above Marcus's trapped ledge!",
      labelFa: "یک کارگاه چهارنقطه‌ای فوق‌العاده مستحکم دقیقاً بالای سر طاقچه مارکوس برپا کن!",
      descriptionFa: "امن‌ترین کارگاه ممکن برای فرود و بالا کشیدن مصدوم و تجهیزات پزشکی.",
    },
    choiceB: {
      labelEn: "Rig a high-angle tensioned tyrolean traverse line to zip Marcus across to the safe plateau!",
      labelFa: "یک تیرولین شیب‌دار تحت کشش برپا کن تا مارکوس را با قرقره به فلات امن روبه‌رو سر بدهی!",
      descriptionFa: "روشی هوشمندانه برای دور زدن مسیر پرتگاهی خطرناک به سمت دشت پایدار.",
    },
  },
  {
    stepNumber: 3,
    pathCode: "BB",
    passageEn:
      "Trusting their instincts and aggressive technical crampon work, Jack and Valerie traversed the leeward granite wall with lightning agility. By hugging the frozen rock buttress, they escaped the direct hammer of the summit jet stream. Twenty minutes later, breathing heavily through their neoprene storm masks, they reached a rocky outcrop directly overlooking Marcus's shelter. Below them, Marcus was burning the last pages of his geological survey notebook inside a titanium cup to keep his fingers from freezing.",
    keywords: [
      { word: "buttress", meaningFa: "دیواره یا ستون نگهدارنده صخره‌ای در کوه", phonetic: "/ˈbʌtrəs/" },
      { word: "jet stream", meaningFa: "بادهای فوق‌سریع و خروشان در ارتفاعات بسیار بالا", phonetic: "/ˈdʒet striːm/" },
      { word: "neoprene", meaningFa: "نئوپرن (پارچه عایق سرمای شدید)", phonetic: "/ˈniːəpriːn/" },
      { word: "outcrop", meaningFa: "برآمدگی صخره‌ای بیرون‌زده از دل خاک یا برف", phonetic: "/ˈaʊtkrɒp/" },
    ],
    question: {
      promptEn: "What was Marcus doing to stave off freezing when the rescuers arrived above him?",
      promptFa: "مارکوس برای فرار از یخ زدن انگشتانش در لحظه رسیدن امدادگران چه می‌کرد؟",
      options: [
        "Burning pages of his geological notebook inside a titanium cup",
        "Doing jumping jacks inside his bivy sack",
        "Using an electric battery heating pad",
      ],
      correctIndex: 0,
      hintSnippet: "Marcus was burning the last pages of his geological survey notebook inside a titanium cup to keep his fingers from freezing",
      clueFa: "خط آخر رو ببین؛ داشت آخرین برگه‌های دفترچه نقشه‌برداری زمین‌شناسی‌اش رو توی لیوان تیتانیومی می‌سوزوند تا دست‌هاش گرم بمونن.",
    },
    choiceA: {
      labelEn: "Rappel down instantly on twin static lines with a chemical hypothermia wrap and hot bouillon!",
      labelFa: "فوراً با طناب‌های دوقلو همراه با پتوی نجات شیمیایی و عصاره داغ مقوی پیش او فرود بیا!",
      descriptionFa: "تغذیه سریع و بالا بردن دمای بدن نجات‌یافته در همان لحظه ورود.",
    },
    choiceB: {
      labelEn: "Lower an illuminated emergency radio and harness beacon while preparing the heavy hauling pulley!",
      labelFa: "بیسیم اضطراری روشن و چراغ سیگنال مهار را پایین بفرست و سیستم قرقره سنگین کشش را بچین!",
      descriptionFa: "برقراری ارتباط روحی و روانی با مارکوس قبل از شروع عملیات فنی بالا کشیدن.",
    },
  },

  // STEP 4 (8 Nodes: AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)
  {
    stepNumber: 4,
    pathCode: "AAA",
    passageEn:
      "Valerie expertly infused warmed medical saline while wrapping Marcus in an insulated vapor-barrier sleeping cocoon. As the heated fluids circulated, color returned to the surveyor's sunken cheeks. Jack signaled pilot Dave over the helmet comms: the wind gusts had momentarily dropped to twenty-five knots—a rare atmospheric lull known as an eye in the squall. With Marcus securely strapped into the titanium basket litter, Valerie clipped her own safety lanyard to the master locking carabiner.",
    keywords: [
      { word: "infused", meaningFa: "سرم درمانی را از طریق وریدی تزریق کرد", phonetic: "/ɪnˈfjuːzd/" },
      { word: "saline", meaningFa: "محلول نمکی فیزیولوژیک پزشکی", phonetic: "/ˈseɪlaɪn/" },
      { word: "atmospheric lull", meaningFa: "آرامش موقتی میان طوفان یا گردباد", phonetic: "/ˌætməsˈferɪk lʌl/" },
      { word: "carabiner", meaningFa: "کارابین (حلقه قلاب‌دار کوهنوردی)", phonetic: "/ˌkærəˈbiːnər/" },
    ],
    question: {
      promptEn: "What temporary weather phenomenon gave the team a crucial extraction opportunity?",
      promptFa: "چه پدیده جوی موقت فرصت طلایی بالا کشیدن را برای تیم فراهم کرد؟",
      options: [
        "A rare atmospheric lull in the storm where gusts dropped to twenty-five knots",
        "Sudden sunny skies melting the summit snow",
        "A reversal in the mountain magnetic field",
      ],
      correctIndex: 0,
      hintSnippet: "wind gusts had momentarily dropped to twenty-five knots—a rare atmospheric lull known as an eye in the squall",
      clueFa: "خط سوم رو بخون دوست من؛ طوفان یک لحظه آرام گرفت و سرعت باد به ۲۵ گره رسید که بهش چشم طوفان می‌گن.",
    },
    choiceA: {
      labelEn: "Execute a rapid tandem hoist with Valerie guiding the litter clear of the jagged overhang!",
      labelFa: "بالا کشیدن دونفره را انجام بده در حالی که والری برانکارد را از برخورد به لبه‌های تیز صخره دور نگه می‌دارد!",
      descriptionFa: "همراهی پزشک از برخورد بیمار با صخره جلوگیری می‌کند.",
    },
    choiceB: {
      labelEn: "Send the litter up solo on the electric winch while Valerie anchors on the ledge to retrieve scientific data!",
      labelFa: "برانکارد را تکی با بالابر الکترونیکی بالا بکش در حالی که والری روی لبه می‌ماند تا داده‌های علمی مارکوس را بردارد!",
      descriptionFa: "داده‌های ارزشمند ذوب یخچال‌های طبیعی نجات پیدا می‌کنند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "AAB",
    passageEn:
      "Clipped securely into the rapid extraction harness, Marcus gasped as the high-speed winch hoisted him and Valerie upward into the icy night. Just ten meters above the ledge, a freak crosswind slammed the cable sideways, threatening to swing the pair into a razor-sharp granite fang jutting from the cliff wall. Valerie held a carbon-reinforced ice axe ready in her right gauntlet, her muscles burning under the immense gravitational torque.",
    keywords: [
      { word: "crosswind", meaningFa: "باد شدید متقاطع و عمود بر مسیر حرکت", phonetic: "/ˈkrɒswɪnd/" },
      { word: "gauntlet", meaningFa: "دستکش ضخیم فنی محافظ دست در سرمای قطبی", phonetic: "/ˈɡɔːntlɪt/" },
      { word: "torque", meaningFa: "گشتاور و نیروی پیچشی ناشی از چرخش", phonetic: "/tɔːrk/" },
      { word: "extraction", meaningFa: "خروج و تخلیه اضطراری از منطقه خطر", phonetic: "/ɪkˈstrækʃn/" },
    ],
    question: {
      promptEn: "What immediate hazard emerged while hoisting Marcus and Valerie into the air?",
      promptFa: "هنگام بالا کشیدن کابل چه خطر ناگهانی سر راه والری و مارکوس قرار گرفت؟",
      options: [
        "A ferocious crosswind swung the cable toward a razor-sharp granite protrusion on the cliff",
        "The winch motor overheated and began sparking",
        "Marcus accidentally released his safety harness buckle",
      ],
      correctIndex: 0,
      hintSnippet: "a freak crosswind slammed the cable sideways, threatening to swing the pair into a razor-sharp granite fang jutting from the cliff wall",
      clueFa: "خط دوم رو ببین؛ باد ناگهانی متقاطع کابل رو کج کرد و نزدیک بود اون‌ها رو محکم به شاخ تیز صخره‌ای بکوبه.",
    },
    choiceA: {
      labelEn: "Fend off the granite face with the ice axe pick and guide Dave to veer starboard into clear air!",
      labelFa: "با نوک تبر یخ دیواره صخره را پس بزن و به خلبان دستور بده به سمت راست به فضای باز منحرف شود!",
      descriptionFa: "دفع دستی ضربه با مهارت فردی نجات‌بخش خواهد بود.",
    },
    choiceB: {
      labelEn: "Deploy a small stabilization drogue chute to instantly dampen the violent oscillation of the cable!",
      labelFa: "یک چتر ترمز پایدارکننده کوچک باز کن تا نوسان شدید تاب خوردن کابل را فوراً آرام کند!",
      descriptionFa: "فیزیک آیرودینامیک تعادل کابل را بدون خطر تثبیت می‌کند.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABA",
    passageEn:
      "Working in tandem on the freshly cleared ledge, Jack set two ice screw anchors while Valerie wrapped Marcus's leg in an inflatable pneumatic traction splint. With the threat of the overhang eliminated, Dave was able to lower the helicopter's heavy-duty rescue hoist directly above them with surgical accuracy. Marcus, gripping Jack's hand, pointed weakly to a silver hard drive sealed in his chest pocket: 'The ice-core data from the upper glacier... it proves the summit snowpack is shifting sixty percent faster than predicted.'",
    keywords: [
      { word: "pneumatic", meaningFa: "بادی (تجهیزات ارتوپدی که با فشار باد تنظیم می‌شوند)", phonetic: "/njuːˈmætɪk/" },
      { word: "ice screw", meaningFa: "پیچ یخ مخصوص برپایی کارگاه در یخ‌های سخت", phonetic: "/ˈaɪs skruː/" },
      { word: "surgical", meaningFa: "بسیار دقیق و ظریف همانند عمل جراحی", phonetic: "/ˈsɜːrdʒɪkl/" },
      { word: "ice-core", meaningFa: "نمونه استوانه‌ای حفرشده از اعماق یخ‌های تاریخی", phonetic: "/ˈaɪs kɔːr/" },
    ],
    question: {
      promptEn: "What vital scientific information did Marcus reveal on the hard drive in his pocket?",
      promptFa: "مارکوس چه اطلاعات علمی مهمی را درباره هارد دیسک داخل جیبش فاش کرد؟",
      options: [
        "Ice-core data proving the summit snowpack is shifting sixty percent faster than predicted",
        "Coordinates to a hidden vein of gold under the glacier",
        "A lost weather satellite's encrypted telemetry log",
      ],
      correctIndex: 0,
      hintSnippet: "The ice-core data from the upper glacier... it proves the summit snowpack is shifting sixty percent faster than predicted",
      clueFa: "جمله آخر رو بخون؛ داده‌های مغزه یخ نشون می‌داد ذوب و حرکت برف‌های قله ۶۰ درصد سریع‌تر از پیش‌بینی‌هاست.",
    },
    choiceA: {
      labelEn: "Transmit the critical climate telemetry immediately over the helicopter's satellite link to warn towns below!",
      labelFa: "داده‌های اضطراری آب‌وهوایی را فوراً با دیتالینک ماهواره‌ای بالگرد بفرست تا شهرهای پایین دست هشدار بگیرند!",
      descriptionFa: "هشدار زودهنگام به اهالی دره از سیلاب‌های احتمالی جلوگیری می‌کند.",
    },
    choiceB: {
      labelEn: "Secure Marcus and the hard drive inside the heated main cabin and commence emergency flight to the regional trauma hospital!",
      labelFa: "مارکوس و هارد داده‌ها را در کابین گرم ایمن کن و پرواز سریع به بیمارستان تخصصی تروما را آغاز کن!",
      descriptionFa: "اولویت اول درمان فوری شکستگی و افت دمای بدن بیمار است.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "ABB",
    passageEn:
      "Using the dynamic guideline connected between the cliff face and the helicopter's belly hook, Jack eliminated all swinging momentum. He loaded Marcus into the high-angle rescue basket and locked the reinforced Kevlar covers. Over the headset, Dave reported an incoming weather alert: radar indicated an arctic supercell would envelop the entire massif in less than twelve minutes. If they didn't break out of the mountain vortex immediately, zero-visibility whiteout conditions would ground the helicopter on the glacier.",
    keywords: [
      { word: "supercell", meaningFa: "ابرباتلاق یا طوفان عظیم چرخشی با قدرت تخریب بالا", phonetic: "/ˈsuːpəsel/" },
      { word: "massif", meaningFa: "توده کوهستانی یکپارچه و صعب‌العبور", phonetic: "/mæˈsiːf/" },
      { word: "vortex", meaningFa: "گرداب هوایی خروشان و پرفشار", phonetic: "/ˈvɔːrteks/" },
      { word: "whiteout", meaningFa: "سفیدپوشی کامل افق بر اثر کولاک برف و صفر شدن دید", phonetic: "/ˈwaɪtaʊt/" },
    ],
    question: {
      promptEn: "What severe weather event gave the team only twelve minutes to escape the mountain?",
      promptFa: "چه پدیده جوی شدیدی فقط دوازده دقیقه به تیم برای فرار از کوه مهلت داد؟",
      options: [
        "An arctic supercell storm heading directly toward the mountain massif",
        "A sudden volcanic eruption from the crater ridge",
        "A thermal solar flare blinding radar instruments",
      ],
      correctIndex: 0,
      hintSnippet: "radar indicated an arctic supercell would envelop the entire massif in less than twelve minutes",
      clueFa: "به خط سوم دقت کن؛ رادار نشان داد که یک طوفان فوق‌سلولی قطبی ظرف کمتر از ۱۲ دقیقه کل توده کوهستان رو می‌بلعه.",
    },
    choiceA: {
      labelEn: "Engage maximum turbine throttle and fly an aggressive low-level contour escape through the western river gorge!",
      labelFa: "گاز توربین‌ها را روی حداکثر بگذار و با پرواز ارتفاع پست از تنگه رودخانه غربی خارج شو!",
      descriptionFa: "پرواز در کف دره پناهگاهی امن در برابر طوفان ارتفاع بالاست.",
    },
    choiceB: {
      labelEn: "Climb aggressively through the cloud deck into the stable stratosphere to ride high-altitude tailwinds home!",
      labelFa: "با اوج‌گیری پرقدرت از لایه ابرها عبور کن و بالای طوفان در بادهای موافق پرواز کن!",
      descriptionFa: "بالا رفتن از ابرها خطر پرواز کور را رفع می‌کند اما سرما بیشتر می‌شود.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAA",
    passageEn:
      "Jack pounded four equalized solid rock pitons into a sound granite crack, rigging an ultra-smooth five-to-one mechanical advantage hauling system. Valerie rappelled down the static line, touched down beside Marcus, and swiftly transferred his weight onto the rescue harness. 'Hang on tight, Marcus,' Valerie shouted over the gale. 'You're going home tonight!' Up above, Jack hauled smoothly on the pulleys, his bicep muscles straining rhythmically as Marcus was lifted off the crumbling ledge just moments before a section of rock collapsed into the fog below.",
    keywords: [
      { word: "pitons", meaningFa: "میخ‌های فولادی محکم برای کوبیدن در درز صخره‌ها", phonetic: "/ˈpiːtɒnz/" },
      { word: "mechanical advantage", meaningFa: "مزیت مکانیکی قرقره‌ها جهت کاهش نیروی لازم برای کشیدن", phonetic: "/məˌkænɪkl ədˈvɑːntɪdʒ/" },
      { word: "straining", meaningFa: "تحت فشار شدید عضلانی قرار گرفتن", phonetic: "/ˈstreɪnɪŋ/" },
      { word: "rhythmically", meaningFa: "با ریتم یکنواخت و هماهنگ", phonetic: "/ˈrɪðmɪkli/" },
    ],
    question: {
      promptEn: "What happened to the snow ledge moments after Marcus was lifted off it?",
      promptFa: "لحظاتی بعد از بالا کشیدن مارکوس چه اتفاقی برای لبه صخره‌ای افتاد؟",
      options: [
        "A section of the granite rock collapsed into the fog below",
        "It burst into flames from an electrical short",
        "It was struck by an incoming weather balloon",
      ],
      correctIndex: 0,
      hintSnippet: "lifted off the crumbling ledge just moments before a section of rock collapsed into the fog below",
      clueFa: "خط آخر رو ببین رفیق؛ درست چند لحظه بعد از اینکه پایش از زمین جدا شد، بخشی از سنگ طاقچه به قعر مه سقوط کرد.",
    },
    choiceA: {
      labelEn: "Establish an emergency heated hypothermia dome tent on the ridge to stabilize Marcus through the blizzard peak!",
      labelFa: "چادر گنبدی حرارتی امداد را روی یال برپا کن تا مارکوس در اوج کولاک تثبیت دما شود!",
      descriptionFa: "پناهگاهی مطمئن روی زمین تا آرام شدن تندباد هوایی.",
    },
    choiceB: {
      labelEn: "Guide Marcus into the secure lower col where Dave's helicopter can land under the wind shadow of the mountain peak!",
      labelFa: "مارکوس را به گردنه پایینی در سایه باد قله منتقل کنید تا بالگرد راحت روی زمین بنشیند!",
      descriptionFa: "انتقال زمینی به نقطه امن فرود بدون خطر سیم بکسل.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BAB",
    passageEn:
      "Tensioning the high-strength tyrolean cable across the five-hundred-meter chasm to the stable opposing plateau, Jack and Valerie created an aerial lifeline. Marcus was clipped into a tandem pulley cart with double auto-locking braking cams. With a steady push, the carriage glided across the whistling darkness, suspended hundreds of meters above the glaciers. On the far side, an automated mountain shelter with thermal heating and satellite connectivity offered immediate safety.",
    keywords: [
      { word: "chasm", meaningFa: "شکاف عمیق و دهانه‌باز در دل کوهستان", phonetic: "/ˈkæzəm/" },
      { word: "tyrolean", meaningFa: "تیرولین (عبور معلق از روی سیم یا طناب بر فراز دره)", phonetic: "/tɪˈrəʊliən/" },
      { word: "cams", meaningFa: "بادامک‌های ترمز خودکار در ابزارهای کوهنوردی", phonetic: "/kæmz/" },
      { word: "connectivity", meaningFa: "ارتباط و اتصال اینترنتی و مخابراتی", phonetic: "/ˌkɒnekˈtɪvəti/" },
    ],
    question: {
      promptEn: "How did the tyrolean traverse line transport Marcus to safety?",
      promptFa: "خط تیرولین هوایی چگونه مارکوس را به نقطه امن رساند؟",
      options: [
        "It carried him on an aerial tandem pulley cart across a five-hundred-meter chasm to an automated shelter",
        "It pulled him behind an electric snowmobile across a frozen glacier",
        "It operated an inflatable raft down the river canyon",
      ],
      correctIndex: 0,
      hintSnippet: "Tensioning the high-strength tyrolean cable across the five-hundred-meter chasm to the stable opposing plateau... the carriage glided across the whistling darkness",
      clueFa: "خطوط اول و دوم رو ببین؛ مارکوس روی یک واگن قرقره‌ای دوبل معلق بر فراز شکاف ۵۰۰ متری مستقیماً به سمت پناهگاه خودکار رفت.",
    },
    choiceA: {
      labelEn: "Enter the automated alpine shelter, fire up the geothermal generator, and request a medical evacuation team for dawn!",
      labelFa: "وارد پناهگاه خودکار شو، ژنراتور زمین‌گرمایی را روشن کن و درخواست تیم پزشکی سپیده‌دم بده!",
      descriptionFa: "گرما و رفاه کامل در پناهگاهی با انرژی پاک تا فرارسیدن روز.",
    },
    choiceB: {
      labelEn: "Utilize the shelter's radio transponder to guide Dave's helicopter to the heated helipad on the plateau!",
      labelFa: "از فرستنده رادیویی پناهگاه استفاده کن تا هلیکوپتر دیو را روی پد گرمایش‌دار فرود بیاورد!",
      descriptionFa: "تخلیه هوایی فوری در همان شب بدون تاخیر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBA",
    passageEn:
      "Reaching Marcus on the narrow ledge, Valerie wrapped him in an aluminized space blanket while Jack fed him a thermos of steaming hot mineral broth. 'My body feels warm again,' Marcus whispered, tears thawing on his cheeks. As they packed his gear, Marcus pointed to a GPS seismometer bolted into the granite: 'The tremors we recorded aren't just shifting snow—there's an underground magma surge warming the glacier bed!' This startling discovery meant the entire north ridge was unstable, requiring immediate evacuation of down-valley settlements.",
    keywords: [
      { word: "aluminized", meaningFa: "پوشیده از لایه نازک آلومینیوم بازتاب‌دهنده گرما", phonetic: "/əˈluːmɪnaɪzd/" },
      { word: "seismometer", meaningFa: "لرزه‌نگار حساس برای ثبت ارتعاشات زمین", phonetic: "/saɪzˈmɒmɪtər/" },
      { word: "magma surge", meaningFa: "بالا آمدن و جوشش توده‌های گدازه آتشفشانی در عمق زمین", phonetic: "/ˈmæɡmə sɜːrdʒ/" },
      { word: "settlements", meaningFa: "سکونت‌گاه‌ها، روستاها و آبادی‌های مسکونی", phonetic: "/ˈsetlmənts/" },
    ],
    question: {
      promptEn: "What alarming geological phenomenon did the GPS seismometer record?",
      promptFa: "دستگاه لرزه‌نگار جی‌پی‌اس چه پدیده نگران‌کننده زمین‌شناسی را ثبت کرده بود؟",
      options: [
        "An underground magma surge warming the glacier bed and destabilizing the ridge",
        "A meteorite impact near the mountain summit",
        "A collapsed railway tunnel deep in the valley",
      ],
      correctIndex: 0,
      hintSnippet: "The tremors we recorded aren't just shifting snow—there's an underground magma surge warming the glacier bed!",
      clueFa: "به جمله مارکوس دقت کن؛ لرزش‌ها فقط مال برف نبود، بلکه جوشش گدازه‌های زیرزمینی داشت بستر یخچال رو ذوب و بی‌ثبات می‌کرد.",
    },
    choiceA: {
      labelEn: "Sound the regional emergency geothermal alarm immediately through the satellite emergency beacon!",
      labelFa: "آژیر هشدار فوری زمین‌گرمایی منطقه را از طریق فرستنده اضطراری ماهواره به صدا درآور!",
      descriptionFa: "نجات جان هزاران نفر از ساکنان دره با اعلام خطر زودهنگام.",
    },
    choiceB: {
      labelEn: "Focus first on a rapid tandem rope rappel to the extraction meadow before broadcasting the seismic warning!",
      labelFa: "ابتدا فرود دونفره با طناب به دشت تخلیه را به پایان برسان و سپس گزارش لرزه‌نگاری را ارسال کن!",
      descriptionFa: "رساندن مصدوم به محل امن پیش از هر اقدام دیگر.",
    },
  },
  {
    stepNumber: 4,
    pathCode: "BBB",
    passageEn:
      "Hearing Valerie's voice over the emergency radio handset, Marcus wept with immense relief. Jack lowered the heavy hauling rig, and within eight minutes, the three of them were reunited on the safe upper plateau. Dave's helicopter hovered just above the ridge crest, illuminated by the flashing strobes of Jack's avalanche beacon. Despite thirty-five-knot crosswinds, Dave demonstrated why he was the division's top mountain pilot, touching his port skid gently onto an ice pinnacle to create a boarding bridge.",
    keywords: [
      { word: "reunited", meaningFa: "دوباره به هم پیوسته و گرد هم آمده", phonetic: "/ˌriːjuːˈnaɪtɪd/" },
      { word: "strobes", meaningFa: "چراغ‌های چشمک‌زن قوی سیگنال‌دهی در شب", phonetic: "/strəʊbz/" },
      { word: "pinnacle", meaningFa: "برج یا ستون باریک و نوک‌تیز یخی و سنگی", phonetic: "/ˈpɪnəkl/" },
      { word: "port skid", meaningFa: "پایه یا اسکی سمت چپ بالگرد", phonetic: "/pɔːrt skɪd/" },
    ],
    question: {
      promptEn: "How did pilot Dave allow the team to board the helicopter on the ridge?",
      promptFa: "خلبان دیو چگونه به تیم اجازه داد روی یال سوار بالگرد شوند؟",
      options: [
        "He gently touched the helicopter's port skid onto an ice pinnacle to form a boarding bridge",
        "He landed completely in a deep snowdrift with engines turned off",
        "He dropped a steel ladder while hovering one hundred feet above them",
      ],
      correctIndex: 0,
      hintSnippet: "touching his port skid gently onto an ice pinnacle to create a boarding bridge",
      clueFa: "خط آخر رو ببین؛ اسکی سمت چپ هلیکوپتر رو با مهارت تمام روی یک ستون یخی گذاشت تا مثل یک پل برای سوار شدن عمل کنه.",
    },
    choiceA: {
      labelEn: "Hustle Marcus into the warm cabin while Jack secures Valerie and all alpine gear aboard!",
      labelFa: "مارکوس را به داخل کابین گرم هدایت کن در حالی که جک والری و تجهیزات را مهار می‌کند!",
      descriptionFa: "تخلیه منظم و حساب‌شده بدون جا ماندن هیچ وسیله‌ای در کوهستان.",
    },
    choiceB: {
      labelEn: "Instruct Dave to perform an immediate low-angle dive takeoff into the valley to outrun wind shears!",
      labelFa: "به خلبان بگو بلافاصله با شیرجه زاویه‌دار کم‌ارتفاع به سمت دره اوج بگیرد تا از تلاطم باد فرار کند!",
      descriptionFa: "مانور سریع هوایی برای فرار از قیچی‌های خطرناک باد.",
    },
  },

  // STEP 5 (16 Nodes: AAAA through BBBB)
  {
    stepNumber: 5,
    pathCode: "AAAA",
    passageEn:
      "Valerie maintained a steady grip on the litter's stabilization bridle as the hoist hoisted them into the helicopter cabin. Inside, Jack secured the latch and cranked the cabin heater to maximum. Marcus was wrapped in dry wool blankets and monitored closely. As the helicopter cleared the jagged peaks, city lights sparkled like a field of diamonds on the horizon. The flight paramedic turned to Jack with a proud smile: 'We pulled him out of the frozen jaws of death, Commander.'",
    keywords: [
      { word: "bridle", meaningFa: "تسمه مهار و متعادل‌کننده برانکارد در عملیات هوایی", phonetic: "/ˈbraɪdl/" },
      { word: "cranked", meaningFa: "تا آخرین درجه بالا برد یا زیاد کرد", phonetic: "/kræŋkt/" },
      { word: "sparkled", meaningFa: "چشمک زد، درخشید", phonetic: "/ˈspɑːrkld/" },
      { word: "jaws of death", meaningFa: "دهان مرگ و لبه پرتگاه نیستی", phonetic: "/dʒɔːz əv deθ/" },
    ],
    question: {
      promptEn: "What greeted the rescuers on the horizon as they cleared the mountain peaks?",
      promptFa: "وقتی بالگرد از قله‌های صخره‌ای عبور کرد چه صحنه‌ای در افق پیش چشمان امدادگران نمایان شد؟",
      options: [
        "City lights sparkling like a field of diamonds on the horizon",
        "A massive thunderstorm blocking their flight path",
        "A fleet of military search planes",
      ],
      correctIndex: 0,
      hintSnippet: "As the helicopter cleared the jagged peaks, city lights sparkled like a field of diamonds on the horizon",
      clueFa: "خط سوم رو ببین دوست من؛ چراغ‌های درخشان شهر در افق مثل دشت الماس خودنمایی می‌کردن و نوید نجات رو می‌دادن.",
    },
    choiceA: {
      labelEn: "Notify the regional base hospital for a high-priority direct trauma landing on the roof!",
      labelFa: "به بیمارستان منطقه‌ای پیام بده تا پد هلیکوپتر روی بام را برای فرود اضطراری آماده کنند!",
      descriptionFa: "رسیدن مستقیم به اتاق عمل بدون اتلاف ثانیه‌ای.",
    },
    choiceB: {
      labelEn: "Celebrate the flawless rescue with high-fives and a warm cup of cocoa in the cockpit!",
      labelFa: "این عملیات نجات بی‌نقص را با دست دادن به هم‌تیمی‌ها و نوشیدن شکلات داغ در کابین جشن بگیرید!",
      descriptionFa: "پایان شیرین یک شب پر از فداکاری و همدلی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AAAB",
    passageEn:
      "While Marcus was being hoisted to safety, Valerie swiftly packed his water-resistant data satchel into her chest pouch. As she stepped into the rescue sling for her own retrieval, the mountain shuddered again—a second avalanche swept the very ledge she had occupied seconds prior. Flying up through the storm, she held the irreplaceable climate findings safe against her heart, realizing that this mission had rescued not only a human life, but the key to understanding glacier preservation for future generations.",
    keywords: [
      { word: "satchel", meaningFa: "کیف چرمی یا ضدآب کوچک مخصوص اسناد و مدارک", phonetic: "/ˈsætʃəl/" },
      { word: "retrieval", meaningFa: "بازیابی، بالا کشیدن و انتقال مجدد به نقطه امن", phonetic: "/rɪˈtriːvl/" },
      { word: "irreplaceable", meaningFa: "تکرارنشدنی، گرانبها و بی‌بدیل", phonetic: "/ˌɪrɪˈpleɪsəbl/" },
      { word: "preservation", meaningFa: "حفظ و نگهداری برای آیندگان", phonetic: "/ˌprezərˈveɪʃn/" },
    ],
    question: {
      promptEn: "What happened to the ledge immediately after Valerie was hoisted into the air?",
      promptFa: "بلافاصله پس از بالا کشیده شدن والری به هوا چه اتفاقی برای لبه صخره افتاد؟",
      options: [
        "A second avalanche completely swept away the ledge she had just stood upon",
        "A large flock of mountain eagles landed on it",
        "It turned into an icy spring of fresh water",
      ],
      correctIndex: 0,
      hintSnippet: "the mountain shuddered again—a second avalanche swept the very ledge she had occupied seconds prior",
      clueFa: "خط دوم رو بخون؛ کوه لرزید و یک بهمن ثانویه همون لبه‌ای که چند ثانیه قبل روش ایستاده بود رو با خودش برد.",
    },
    choiceA: {
      labelEn: "Deliver the critical climate satchel directly to the International Glaciology Institute!",
      labelFa: "کیف اسناد داده‌های حساس اقلیمی را مستقیماً به انستیتوی بین‌المللی یخچال‌شناسی تحویل بده!",
      descriptionFa: "داده‌هایی که علم حفاظت از محیط‌زیست را متحول خواهند کرد.",
    },
    choiceB: {
      labelEn: "Present Marcus with his intact research at the city council ceremony as an honored hero!",
      labelFa: "نتایج سالم تحقیقات را در مراسم رسمی شورای شهر به عنوان قهرمان به مارکوس تقدیم کن!",
      descriptionFa: "تقدیری شایسته از تلاش‌های علمی و امدادی در برابر چشمان مردم.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABA",
    passageEn:
      "With nerves of steel, Valerie used the tempered pick of her technical ice axe to push forcefully against the jagged granite fang. The controlled counter-thrust rotated them away from the impact zone just as Dave smoothly veered the helicopter ten meters to starboard. The cable cleared the cliff face by mere inches. Inside the cabin, Jack pulled both of them across the threshold to thunderous relief. Marcus gripped Valerie's arm: 'That was the most extraordinary display of courage I have ever witnessed.'",
    keywords: [
      { word: "counter-thrust", meaningFa: "نیروی دافعه متقابل برای دور شدن از مانع", phonetic: "/ˈkaʊntər θrʌst/" },
      { word: "veered", meaningFa: "مسیر حرکت خود را کج کرد و تغییر داد", phonetic: "/vɪəd/" },
      { word: "threshold", meaningFa: "آستانه یا درگاه ورودی کابین", phonetic: "/ˈθreʃhəʊld/" },
      { word: "extraordinary", meaningFa: "فوق‌العاده، کم‌نظیر و خارق‌العاده", phonetic: "/ɪkˈstrɔːrdnri/" },
    ],
    question: {
      promptEn: "How did Valerie prevent the cable from slamming into the granite cliff?",
      promptFa: "والری چگونه مانع از برخورد کابل به دیواره سنگی صخره شد؟",
      options: [
        "She pushed forcefully against the rock with the pick of her ice axe to deflect their trajectory",
        "She cut the cable with a pocket knife",
        "She threw her medical backpack to soften the blow",
      ],
      correctIndex: 0,
      hintSnippet: "Valerie used the tempered pick of her technical ice axe to push forcefully against the jagged granite fang. The controlled counter-thrust rotated them away",
      clueFa: "جمله اول رو ببین دوست من؛ با نوک تبر یخش محکم به صخره فشار آورد و نیروی رانشی باعث شد از دیواره فاصله بگیرن.",
    },
    choiceA: {
      labelEn: "Award Valerie the National Medal for Exceptional Mountain Bravery!",
      labelFa: "مدال افتخار ملی شجاعت در کوهستان را به والری اهدا کن!",
      descriptionFa: "افتخاری ماندگار برای شجاع‌ترین بانوی امداد و نجات کشور.",
    },
    choiceB: {
      labelEn: "Document the technical deflection maneuver as standard curriculum in the SAR flight manual!",
      labelFa: "مانور انحراف فنی با تبر یخ را در کتابچه آموزش رسمی خلبانان و امدادگران نجات ثبت کن!",
      descriptionFa: "آموزشی ارزشمند که در آینده جان صدها کوهنورد دیگر را نجات می‌دهد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "AABB",
    passageEn:
      "Valerie snapped the release pin on her belt-mounted aerodynamic drogue chute. The bright blaze-orange miniature canopy blossomed instantly in the howling downwash, producing fifty pounds of steady aerodynamic drag that immediately snuffed out the violent pendulum swing. Hoisted straight up like a plumb line, they cleared the overhang without a scratch. Pilot Dave breathed a deep sigh of relief over the comms: 'Textbook physics under fire, team. Setting course for base hospital.'",
    keywords: [
      { word: "drogue chute", meaningFa: "چتر پایدارکننده ترمز در تجهیزات هوایی و نجات", phonetic: "/ˈdrəʊɡ ʃuːt/" },
      { word: "plumb line", meaningFa: "شاغول (کاملاً صاف و عمود بر خط افق)", phonetic: "/ˈplʌm laɪn/" },
      { word: "snuffed out", meaningFa: "فرونشاند، خاموش و بی‌اثر کرد", phonetic: "/snʌft aʊt/" },
      { word: "textbook", meaningFa: "بی‌نقص و کاملاً منطبق بر اصول کتاب‌های علمی", phonetic: "/ˈtekstbʊk/" },
    ],
    question: {
      promptEn: "What effect did deploying the miniature drogue chute have on the hoist cable?",
      promptFa: "باز کردن چتر ترمز کوچک چه تاثیری روی کابل بالابر گذاشت؟",
      options: [
        "It produced aerodynamic drag that eliminated the violent pendulum swing, pulling them up straight",
        "It spun them rapidly in circles until the winch snapped",
        "It deployed an emergency flotation device",
      ],
      correctIndex: 0,
      hintSnippet: "producing fifty pounds of steady aerodynamic drag that immediately snuffed out the violent pendulum swing. Hoisted straight up like a plumb line",
      clueFa: "خط دوم رو ببین؛ نیروی پسار آیرودینامیک نوسان کابل رو کامل خنثی کرد و اون‌ها کاملاً صاف مثل شاغول بالا رفتن.",
    },
    choiceA: {
      labelEn: "File an international patent on the rapid-deployment rescue drogue system!",
      labelFa: "سیستم چتر ترمز بالابر امداد را به عنوان اختراع بین‌المللی ثبت کن!",
      descriptionFa: "نوآوری بی‌نظیر تیم که صنعت نجات کوهستان را در جهان متحول می‌کند.",
    },
    choiceB: {
      labelEn: "Celebrate the smooth landing with the hangar ground crew who waited anxiously in the cold!",
      labelFa: "فرود امن را در کنار تکنسین‌های فداکار پایگاه جشن بگیر که در سرما چشم‌انتظار شما بودند!",
      descriptionFa: "قدردانی از زحمات شبانه‌روزی کادر فنی فرودگاه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAA",
    passageEn:
      "Jack routed Marcus's high-resolution satellite drive through the helicopter's military-grade broadband uplink. Within seconds, real-time telemetry flashed onto the screens of the State Emergency Operations Center. The data pinpointed a sudden subglacial water buildup that was threatening to trigger a massive debris flow into the northern river valley. Because the warning was received three hours before sunrise, municipal sirens evacuated twelve hundred residents from low-lying neighborhoods safely.",
    keywords: [
      { word: "broadband", meaningFa: "پهنای باند اینترنتی سریع و ماهواره‌ای", phonetic: "/ˈbrɔːdbænd/" },
      { word: "debris flow", meaningFa: "جریان گل‌ولای و نخاله‌های سنگی سیلابی", phonetic: "/dəˈbriː fləʊ/" },
      { word: "municipal", meaningFa: "شهری، وابسته به شهرداری و مدیریت شهری", phonetic: "/mjuːˈnɪsɪpl/" },
      { word: "evacuated", meaningFa: "تخلیه اضطراری جمعیت از منطقه پرخطر", phonetic: "/ɪˈvækjuːeɪtɪd/" },
    ],
    question: {
      promptEn: "How many residents were safely evacuated thanks to Marcus's early telemetry transmission?",
      promptFa: "با ارسال زودهنگام داده‌های ماهواره‌ای چند تن از ساکنان محله‌های پایین‌دست به سلامت تخلیه شدند؟",
      options: [
        "Twelve hundred residents were evacuated before the debris flow struck",
        "Fifty miners working inside the quarry",
        "Over ten thousand tourists at the ski resort",
      ],
      correctIndex: 0,
      hintSnippet: "municipal sirens evacuated twelve hundred residents from low-lying neighborhoods safely",
      clueFa: "خط آخر رو نگاه کن؛ با به صدا درآمدن آژیرهای خطر، ۱۲۰۰ نفر از ساکنان دره قبل از آمدن سیلاب سنگ و گل تخلیه شدند.",
    },
    choiceA: {
      labelEn: "Establish a permanent early-warning glacier monitoring station named in Marcus's honor!",
      labelFa: "ایستگاه دائمی پایش یخچال‌های طبیعی را به افتخار مارکوس در دره افتتاح کن!",
      descriptionFa: "پایگاهی هوشمند که تا ابد محافظ جان و مال مردم منطقه خواهد بود.",
    },
    choiceB: {
      labelEn: "Publish a joint scientific paper by Jack, Valerie, and Marcus in Nature Geosciences!",
      labelFa: "مقاله مشترک علمی جک، والری و مارکوس را در معتبرترین ژورنال علوم زمین به چاپ برسان!",
      descriptionFa: "ترکیب قهرمانانه شجاعت میدانی و علم در سطح جهانی.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABAB",
    passageEn:
      "Dave set the helicopter down directly on the hospital trauma helipad forty-five minutes after the midnight distress call. Paramedics and orthopedic surgeons wheeled Marcus straight into the trauma bay, where his fractured ankle was aligned and his body warmed in a specialized thermal bath. By morning, doctor reports confirmed Marcus was fully stabilized with no permanent nerve damage. As dawn broke over the city, Marcus held his wife's hand, whispering: 'The SAR crew flew through a hurricane to bring me home.'",
    keywords: [
      { word: "orthopedic", meaningFa: "مربوط به استخوان‌شناسی و جراحی استخوان", phonetic: "/ˌɔːrθəˈpiːdɪk/" },
      { word: "stabilized", meaningFa: "پایدار و از بحران خارج شده", phonetic: "/ˈsteɪbəlaɪzd/" },
      { word: "whispering", meaningFa: "با صدای آرام و نجوایی گفتن", phonetic: "/ˈwɪspərɪŋ/" },
      { word: "hurricane", meaningFa: "طوفان سهمگین با بادهای ویرانگر", phonetic: "/ˈhʌrɪkən/" },
    ],
    question: {
      promptEn: "What did the morning medical reports confirm about Marcus's health?",
      promptFa: "گزارش پزشکی صبح درباره وضعیت سلامتی مارکوس چه چیزی را تایید کرد؟",
      options: [
        "He was fully stabilized with no permanent nerve damage",
        "He required an immediate leg amputation",
        "He would need six months in a hyperbaric oxygen chamber",
      ],
      correctIndex: 0,
      hintSnippet: "confirmed Marcus was fully stabilized with no permanent nerve damage",
      clueFa: "خط سوم رو ببین؛ پزشکان تایید کردند که وضعیتش کاملاً پایدار شده و هیچ آسیب عصبی دائمی ندیده است.",
    },
    choiceA: {
      labelEn: "Invite Marcus and his family to the SAR annual thanksgiving banquet as guests of honor!",
      labelFa: "مارکوس و خانواده‌اش را به عنوان میهمانان ویژه به جشن سالانه امدادگران دعوت کن!",
      descriptionFa: "شبی سرشار از اشک شوق، خاطره‌گویی و پیوند عمیق انسانی.",
    },
    choiceB: {
      labelEn: "Commission a documentary film covering the midnight rescue on Avalanche Ridge!",
      labelFa: "ساخت یک فیلم مستند سینمایی از عملیات نیمه‌شب در گردنه بهمن را کلید بزن!",
      descriptionFa: "نمایشی الهام‌بخش از فداکاری برای تماشاگران سراسر جهان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBA",
    passageEn:
      "Dave dropped the helicopter's nose into the river canyon, carving through the dense air at one hundred and forty knots. Flying below the storm's churning ceiling, the canyon walls sheltered the aircraft from the raging fifty-knot summit crosswinds. With terrain-following radar guiding every banking turn around granite cliffs, they broke through into the calm valley skies within seven minutes. The radar operator at base radioed in astonishment: 'Incredible flying, Dave. You just outmaneuvered the worst arctic supercell of the decade.'",
    keywords: [
      { word: "carving", meaningFa: "شکافتن مسیر با سرعت و دقت در دل هوا یا سنگ", phonetic: "/ˈkɑːrvɪŋ/" },
      { word: "terrain-following", meaningFa: "سیستم رادار ناوبری دنبال‌کننده پستی و بلندی زمین در ارتفاع پایین", phonetic: "/təˈreɪn ˌfɒləʊɪŋ/" },
      { word: "banking", meaningFa: "چرخش و خم شدن بالگرد یا هواپیما به طرفین در پیچ", phonetic: "/ˈbæŋkɪŋ/" },
      { word: "outmaneuvered", meaningFa: "با مانور هوشمندانه حریف یا مانع را شکست دادن", phonetic: "/ˌaʊtməˈnuːvərd/" },
    ],
    question: {
      promptEn: "How did flying through the river gorge protect the helicopter during its escape?",
      promptFa: "پرواز از داخل تنگه رودخانه چگونه هلیکوپتر را در فرار از طوفان محافظت کرد؟",
      options: [
        "The steep canyon walls sheltered the aircraft from ferocious fifty-knot summit crosswinds",
        "The river mist masked the helicopter from enemy sensors",
        "The cold river water cooled the hot turbine engines",
      ],
      correctIndex: 0,
      hintSnippet: "The canyon walls sheltered the aircraft from the raging fifty-knot summit crosswinds. With terrain-following radar guiding every banking turn",
      clueFa: "خط دوم رو ببین رفیق؛ دیواره‌های بلند تنگه مثل سپر جلوی بادهای ویرانگر قله رو گرفتن و هواپیما به سلامت رد شد.",
    },
    choiceA: {
      labelEn: "Present Dave with the Distinguished Flying Cross for extreme alpine aviation!",
      labelFa: "نشان عالی شجاعت پرواز را به دیو برای مهارت بی‌نظیر خلبانی در شرایط حاد اهدا کن!",
      descriptionFa: "مدالی پرفخر برای یکی از جسورانه‌ترین پروازهای تاریخ هوانوردی کوهستان.",
    },
    choiceB: {
      labelEn: "Upgrade the entire helicopter fleet with cutting-edge terrain-following LiDAR systems!",
      labelFa: "تمام ناوگان بالگردهای امداد را به رادارهای سه‌بعدی لیدار مجهز کن!",
      descriptionFa: "تضمین حداکثر امنیت پروازی برای تمام ماموریت‌های شبانه آینده.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "ABBB",
    passageEn:
      "Pushing the collective to maximum climb power, Dave pointed the helicopter skyward, rocketing through the churning overcast layer. At four thousand meters, the aircraft breached the cloud tops into a breathtaking, crystal-clear night sky. Above, the aurora borealis pulsed with vibrant emerald and violet ribbons of light across the moonlit stratosphere. Behind them in the warm cabin, Marcus gazed out the panoramic window with wide, grateful eyes: 'I thought my world ended in the dark, but you brought me to heaven.'",
    keywords: [
      { word: "breached", meaningFa: "شکافت و عبور کرد", phonetic: "/briːtʃt/" },
      { word: "aurora borealis", meaningFa: "شفق قطبی (نورهای رقصان و جادویی در آسمان شب قطب)", phonetic: "/ɔːˌrɔːrə ˌbɔːriˈælɪs/" },
      { word: "panoramic", meaningFa: "دید گسترده و سراسرنما از تمام زوایا", phonetic: "/ˌpænəˈræmɪk/" },
      { word: "stratosphere", meaningFa: "لایه استراتوسفر جو بالای ابرها", phonetic: "/ˈstrætəsfɪər/" },
    ],
    question: {
      promptEn: "What spectacular sight awaited the crew when they climbed above the mountain cloud deck?",
      promptFa: "چه منظره شگفت‌انگیزی بالای ابرها به پیشواز کادر پرواز آمد؟",
      options: [
        "The aurora borealis pulsing with vibrant emerald and violet ribbons of light",
        "A flock of glowing nocturnal birds migrating north",
        "The launch of a space exploration rocket",
      ],
      correctIndex: 0,
      hintSnippet: "Above, the aurora borealis pulsed with vibrant emerald and violet ribbons of light across the moonlit stratosphere",
      clueFa: "خط سوم رو ببین؛ شفق قطبی جادویی با نوارهای سبز زمردی و بنفش در سکوت آرامش‌بخش آسمان می‌درخشید.",
    },
    choiceA: {
      labelEn: "Capture a crew photograph under the aurora to inspire future rescue volunteers!",
      labelFa: "زیر نور شفق قطبی یک عکس یادگاری از تیم بگیر تا الهام‌بخش داوطلبان آینده نجات شود!",
      descriptionFa: "تصویری تاریخی که بر دیوارهای ستاد امداد جهان خواهد درخشید.",
    },
    choiceB: {
      labelEn: "Glide down smoothly to the valley airfield on tailwinds as dawn illuminates the snowy world!",
      labelFa: "با استفاده از بادهای موافق نرم و آرام در روشنایی طلوع بر فرودگاه دره فرود بیا!",
      descriptionFa: "فرودی باشکوه در آغوش آفتاب زرین بامداد.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAA",
    passageEn:
      "Inside the expedition-grade four-season dome tent secured to the granite ridge, Jack turned on the catalytic propane heater. Within minutes, the ambient interior temperature rose to a cozy twenty-two degrees Celsius. Valerie wrapped Marcus in fleece sleeping liners, administering warm electrolyte fluids while monitoring his blood pressure. Outside, the blizzard howled harmlessly against the wind-shedding silicone fly. By dawn, the mountain was serene, and the morning relief team walked up the ridge on snowshoes to carry Marcus down safely.",
    keywords: [
      { word: "catalytic", meaningFa: "کاتالیزوری (تولید گرمای ایمن و بدون شعله گاز)", phonetic: "/ˌkætəˈlɪtɪk/" },
      { word: "ambient", meaningFa: "دمای محیطی پیرامون", phonetic: "/ˈæmbiənt/" },
      { word: "silicone fly", meaningFa: "روکش سیلیکونی ضدآب و ضدباد چادر کوهنوردی", phonetic: "/ˈsɪlɪkəʊn flaɪ/" },
      { word: "serene", meaningFa: "آرام، بی‌دغدغه و سرشار از صلح و صفا", phonetic: "/səˈriːn/" },
    ],
    question: {
      promptEn: "How warm did the emergency shelter tent become inside during the blizzard?",
      promptFa: "دمای داخل چادر امدادی در اوج کولاک چقدر گرم و مطبوع شد؟",
      options: [
        "It rose to a cozy twenty-two degrees Celsius",
        "It barely reached freezing at zero degrees",
        "It overheated to forty degrees Celsius",
      ],
      correctIndex: 0,
      hintSnippet: "Within minutes, the ambient interior temperature rose to a cozy twenty-two degrees Celsius",
      clueFa: "خط دوم رو ببین؛ هیتر کاتالیزوری دما رو به ۲۲ درجه سانتی‌گراد گرم و مطبوع رسوند.",
    },
    choiceA: {
      labelEn: "Establish a permanent survival emergency shelter hut right on Avalanche Ridge!",
      labelFa: "یک جان‌پناه دائمی مجهز نجات در همین نقطه از گردنه بهمن بساز!",
      descriptionFa: "پناهگاهی همیشگی برای هر کوهنوردی که در بوران‌های زمستان گرفتار شود.",
    },
    choiceB: {
      labelEn: "Hike down triumphantly with the sunrise patrol to a lavish mountaineer breakfast in the village!",
      labelFa: "با گروه گشت صبحگاهی همراه با طلوع خورشید به سمت صبحانه گرم و دلچسب روستا حرکت کنید!",
      descriptionFa: "پایان خستگی شبانه با نان تازه و مربای کوهی در کنار مردم باصفا.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BAAB",
    passageEn:
      "Supporting Marcus between them with expert mountain balance, Jack and Valerie navigated down the wind-sheltered lee slope into the lower mountain col. Behind the towering granite buttress, the air was surprisingly tranquil. Exactly on schedule, Dave touched down the helicopter's skids upon the firm snow crust. With doors sliding open, the medical orderly helped slide Marcus into the heated cabin. As the turbine spool whined for liftoff, Marcus gave Jack a firm handshake: 'You gave me back my tomorrow, brother.'",
    keywords: [
      { word: "tranquil", meaningFa: "آرام، ساکت و بدون تلاطم باد", phonetic: "/ˈtræŋkwɪl/" },
      { word: "buttress", meaningFa: "تیغه صخره‌ای حائل در برابر طوفان", phonetic: "/ˈbʌtrəs/" },
      { word: "spool", meaningFa: "دور گرفتن و شتاب گرفتن محور موتور توربینی", phonetic: "/spuːl/" },
      { word: "liftoff", meaningFa: "کنده شدن از زمین و شروع پرواز", phonetic: "/ˈlɪftɒf/" },
    ],
    question: {
      promptEn: "Why was the lower col so much calmer than the summit ridge?",
      promptFa: "چرا گردنه پایینی بسیار آرام‌تر و ساکت‌تر از یال بالایی قله بود؟",
      options: [
        "It sat behind a towering granite buttress that sheltered it completely from the wind",
        "The blizzard had run out of snow",
        "An underground thermal spring warmed the valley air",
      ],
      correctIndex: 0,
      hintSnippet: "Behind the towering granite buttress, the air was surprisingly tranquil",
      clueFa: "خط دوم رو نگاه کن؛ دیواره سنگی عظیم کوه مثل بادشکن عمل کرده بود و هوا کاملاً آرام شده بود.",
    },
    choiceA: {
      labelEn: "Celebrate the crew's unyielding teamwork with a toast at the flight wing debriefing!",
      labelFa: "پیروزی کار تیمی بی‌نقص کادر پرواز را در جلسه تحلیل ماموریت با یک نوشیدنی داغ جشن بگیر!",
      descriptionFa: "تقویت روحیه برادری و آمادگی برای ماموریت‌های بزرگ آینده.",
    },
    choiceB: {
      labelEn: "Sign Marcus up as a volunteer guest lecturer for junior mountain safety recruits!",
      labelFa: "مارکوس را به عنوان مدرس مهمان برای آموزش ایمنی به نجات‌گران جوان دعوت کن!",
      descriptionFa: "انتقال درس‌های واقعی بقا از زبان کسی که از لبه مرگ بازگشته است.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABA",
    passageEn:
      "Inside the solar-and-geothermal autonomous mountain shelter, lights flickered on automatically as the proximity sensors detected the rescuers. Jack initiated the geothermal heat loop, filling the wooden lodge with welcoming radiant warmth. Marcus lay comfortably on an orthopedic bunk, sipping hot tea while Valerie redressed his splint. Over the high-speed satellite terminal, Jack patched through to Marcus's research team at the university, confirming that all glacier sensor streams had been saved and archived.",
    keywords: [
      { word: "geothermal", meaningFa: "زمین‌گرمایی (گرمایش ناشی از حرارت اعماق زمین)", phonetic: "/ˌdʒiːəʊˈθɜːrml/" },
      { word: "autonomous", meaningFa: "خودمختار و مستقل از شبکه سراسری", phonetic: "/ɔːˈtɒnəməs/" },
      { word: "radiant", meaningFa: "تابشی (گرمایش مطبوع از کف و دیوار)", phonetic: "/ˈreɪdiənt/" },
      { word: "archived", meaningFa: "بایگانی و در پایگاه داده‌های امن ذخیره شد", phonetic: "/ˈɑːrkaɪvd/" },
    ],
    question: {
      promptEn: "What powered the heating system inside the autonomous mountain shelter?",
      promptFa: "سیستم گرمایش پناهگاه مستقل کوهستانی با چه انرژی کار می‌کرد؟",
      options: [
        "A geothermal heat loop powered by natural underground warmth",
        "An old wood-burning stove with chopped pine logs",
        "A nuclear micro-reactor",
      ],
      correctIndex: 0,
      hintSnippet: "Jack initiated the geothermal heat loop, filling the wooden lodge with welcoming radiant warmth",
      clueFa: "خط دوم رو ببین؛ جک مدار گرمایش زمین‌گرمایی رو فعال کرد که کل کلبه چوبی رو با گرمای دلپذیر پر کرد.",
    },
    choiceA: {
      labelEn: "Expand the geothermal alpine refuge network across all thirteen mountain national parks!",
      labelFa: "شبکه پناهگاه‌های هوشمند زمین‌گرمایی را در تمام پارک‌های ملی کوهستانی گسترش بده!",
      descriptionFa: "پروژه‌ای ملی که ایمنی کوهنوردان را برای همیشه تضمین خواهد کرد.",
    },
    choiceB: {
      labelEn: "Publish a heartwarming memoir titled 'Night at Shelter Seven' detailing their survival ordeal!",
      labelFa: "کتاب خاطرات پرفروش «شبی در جان‌پناه شماره هفت» را منتشر کن!",
      descriptionFa: "داستانی پرکشش از امید و شجاعت که قلب میلیون‌ها خواننده را لمس می‌کند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BABB",
    passageEn:
      "Activating the shelter's microwave radar beacon, Valerie synchronized the landing lights on the heated concrete pad. Guided through the snowfall by the automated approach vector, Dave smoothly lowered the helicopter skids onto the illuminated grid. Marcus was transferred directly from the shelter's warm vestibule into the aircraft without experiencing a single gust of arctic air. As the helicopter lifted away, Jack glanced down at the gleaming refuge: modern technology and human willpower had combined into absolute triumph.",
    keywords: [
      { word: "synchronized", meaningFa: "همگام‌سازی و هماهنگ کرد", phonetic: "/ˈsɪŋkrənaɪzd/" },
      { word: "vestibule", meaningFa: "دهلیز یا راهروی ورودی عایق در ساختمان‌های قطبی", phonetic: "/ˈvestɪbjuːl/" },
      { word: "illuminated", meaningFa: "نورپردازی‌شده و روشن با چراغ‌های راهنما", phonetic: "/ɪˈluːmɪneɪtɪd/" },
      { word: "willpower", meaningFa: "اراده پولادین و عزم راسخ", phonetic: "/ˈwɪlpaʊər/" },
    ],
    question: {
      promptEn: "How was Marcus transferred into the helicopter without facing the bitter wind?",
      promptFa: "مارکوس چگونه بدون اینکه حتی یک نسیم سرد به او بخورد سوار هلیکوپتر شد؟",
      options: [
        "Transferred directly from the warm shelter vestibule onto the heated pad where the aircraft stood",
        "Carried inside a heated airtight capsule",
        "Transported via an underground tunnel",
      ],
      correctIndex: 0,
      hintSnippet: "transferred directly from the shelter's warm vestibule into the aircraft without experiencing a single gust of arctic air",
      clueFa: "خط ماقبل آخر رو بخون؛ از راهروی عایق و گرم پناهگاه مستقیماً وارد بالگرد شد بدون اینکه سرمای بیرون رو حس کنه.",
    },
    choiceA: {
      labelEn: "Award the entire rescue crew the Presidential Lifesaving Trophy!",
      labelFa: "جام افتخار نجات زندگی ریاست‌جمهوری را به تمام اعضای تیم اهدا کن!",
      descriptionFa: "بالاترین افتخار مدنی کشور برای فداکاری در عملیات‌های اضطراری.",
    },
    choiceB: {
      labelEn: "Toast their victory together at the pilot's favorite fireside lodge in the valley!",
      labelFa: "پیروزی را در کنار شومینه کلبه چوبی محبوب خلبان با دوستان قدیمی جشن بگیرید!",
      descriptionFa: "دورهمی گرم و خودمانی با خنده‌ها و خاطرات شب حادثه.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAA",
    passageEn:
      "The emergency satellite transmission triggered an instantaneous response from the national geological survey and civil defense headquarters. Civil sirens wailed throughout the river valley towns, awakening residents hours before the underground magma surge triggered flash meltwater flooding down the north face. By sunrise, over eight thousand people were safe on elevated plateaus. The regional governor personally radioed Jack's team on the descent: 'Your geological warning prevented what could have been the worst mountain cataclysm in our nation's history.'",
    keywords: [
      { word: "instantaneous", meaningFa: "فوری و بی‌درنگ", phonetic: "/ˌɪnstənˈteɪniəs/" },
      { word: "meltwater", meaningFa: "سیلاب خروشان ناشی از ذوب ناگهانی برف و یخ", phonetic: "/ˈmɛltˌwɔːtər/" },
      { word: "cataclysm", meaningFa: "فاجعه بزرگ طبیعی و مصیبت بار", phonetic: "/ˈkætəklɪzəm/" },
      { word: "governor", meaningFa: "استاندار یا فرماندار کل منطقه", phonetic: "/ˈɡʌvərnər/" },
    ],
    question: {
      promptEn: "What disaster did the emergency seismic alert prevent?",
      promptFa: "هشدار فوری زمین‌لرزه‌ای از چه فاجعه‌ای جلوگیری کرد؟",
      options: [
        "A catastrophic flash meltwater flood from devastating valley towns with eight thousand residents",
        "A forest fire sweeping through the timber logging mills",
        "A toxic chemical spill from an industrial plant",
      ],
      correctIndex: 0,
      hintSnippet: "awakening residents hours before the underground magma surge triggered flash meltwater flooding down the north face. By sunrise, over eight thousand people were safe",
      clueFa: "خطوط دوم و سوم رو ببین؛ هشدار باعث شد ۸ هزار نفر از اهالی دره قبل از آمدن سیلاب مهیب ذوب برف به بلندی‌ها پناه ببرن.",
    },
    choiceA: {
      labelEn: "Receive the Key to the Valley City at an outdoor parade with eight thousand cheering citizens!",
      labelFa: "کلید طلایی شهر را در رژه باشکوه مردمی با حضور هشت هزار شهروند قدردان دریافت کن!",
      descriptionFa: "لحظه‌ای تاریخی که تا نسل‌ها در حافظه مردم دره جاودان خواهد ماند.",
    },
    choiceB: {
      labelEn: "Found the Reynolds-Lin Institute for Advanced Volcanic and Glacier Disaster Preparedness!",
      labelFa: "موسسه مشترک رینولدز و لین را برای پیشگیری از بلایای آتشفشانی و یخبندان تاسیس کن!",
      descriptionFa: "مرکزی علمی که آینده ایمنی اقلیمی کوهستان‌ها را تضمین می‌کند.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBAB",
    passageEn:
      "Jack and Valerie completed the double rope rappel smoothly, landing on the wind-packed snow of the lower extraction meadow with Marcus safely cushioned between them. Minutes later, they broadcast the geological seismometer data to the state geology department. Dave's helicopter swooped in low beneath the clouds, touching down without kicking up spindrift. Inside the cabin, Marcus beamed with pride as he handed over his field maps: 'We did it. We saved the people, and we beat the mountain at its own game.'",
    keywords: [
      { word: "cushioned", meaningFa: "محافظت‌شده و با ملایمت در بر گرفته شده", phonetic: "/ˈkʊʃnd/" },
      { word: "broadcast", meaningFa: "مخابره و ارسال عمومی داده‌ها به مراجع ذی‌ربط", phonetic: "/ˈbrɔːdkɑːst/" },
      { word: "swooped", meaningFa: "با شیرجه ملایم و سریع پایین آمد", phonetic: "/swuːpt/" },
      { word: "beat at own game", meaningFa: "حریف را با شیوه‌های خودش شکست دادن", phonetic: "/biːt æt əʊn ɡeɪm/" },
    ],
    question: {
      promptEn: "Where did Jack and Valerie complete their rappel with Marcus safely cushioned?",
      promptFa: "جک و والری فرود با طناب را در کجا به پایان رساندند در حالی که مارکوس در امنیت کامل بود؟",
      options: [
        "On the wind-packed snow of the lower extraction meadow",
        "On the roof of an abandoned railway depot",
        "Directly inside the helicopter cargo bay",
      ],
      correctIndex: 0,
      hintSnippet: "completed the double rope rappel smoothly, landing on the wind-packed snow of the lower extraction meadow",
      clueFa: "جمله اول رو بخون دوست من؛ روی برف‌های فشرده دشت پایینی مخصوص تخلیه به سلامت فرود آمدند.",
    },
    choiceA: {
      labelEn: "Retire Marcus's battered climbing boots into the Mountain Hall of Fame exhibit!",
      labelFa: "پوتین‌های آسیب‌دیده مارکوس را در تالار افتخارات کوهنوردی کشور به یادگار بگذار!",
      descriptionFa: "نمادی جاودان از اراده و مقاومت انسانی در سخت‌ترین شرایط.",
    },
    choiceB: {
      labelEn: "Reunite with all SAR squad members at the lodge for a feast of roasted trout and hot cider!",
      labelFa: "با تمام اعضای تیم در کلبه گرد هم بیایید و با ماهی قزل‌آلای کبابی و نوشیدنی سیب داغ جشن بگیرید!",
      descriptionFa: "پایانی شاداب، صمیمی و دوستانه در جمع همرزمان.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBA",
    passageEn:
      "As Jack secured the heavy cargo latch on the helicopter door, Valerie was already warming Marcus's IV line and checking his peripheral pulses. Pilot Dave lifted the twin-engine helicopter cleanly into the mountain air, banking into the dawn sky as golden sunlight crested the snowy jagged peaks of the Cascades. Below, Avalanche Ridge looked majestic and peaceful in the morning light—no longer a trap of ice and stone, but a testament to human courage, loyalty, and unmatched professional skill.",
    keywords: [
      { word: "peripheral", meaningFa: "محیطی (مانند نبض‌های دست و پا در پزشکی)", phonetic: "/pəˈrɪfərəl/" },
      { word: "crested", meaningFa: "به بالاترین لبه رسید و تاج قله را روشن کرد", phonetic: "/ˈkrestɪd/" },
      { word: "testament", meaningFa: "گواهی، سند زنده و اثبات آشکار", phonetic: "/ˈtestəmənt/" },
      { word: "unmatched", meaningFa: "بی‌رقیب، بی‌همتا و کم‌نظیر", phonetic: "/ʌnˈmætʃt/" },
    ],
    question: {
      promptEn: "What transformed the ominous Avalanche Ridge into a majestic sight in the morning?",
      promptFa: "چه چیزی گردنه مخوف بهمن را در سپیده‌دم به منظره‌ای باشکوه تبدیل کرد؟",
      options: [
        "Golden sunlight cresting the snowy peaks as a testament to human courage and skill",
        "A colorful hot air balloon festival rising over the valley",
        "A fresh dusting of rainbow-tinted snow",
      ],
      correctIndex: 0,
      hintSnippet: "golden sunlight crested the snowy jagged peaks of the Cascades. Below, Avalanche Ridge looked majestic and peaceful in the morning light—no longer a trap of ice and stone, but a testament to human courage",
      clueFa: "خط سوم رو نگاه کن؛ تابش زرین آفتاب صبحگاهی روی قله‌های برفی، گردنه رو به گواه شجاعت و مهارت انسان تبدیل کرد.",
    },
    choiceA: {
      labelEn: "Celebrate Valerie and Jack's masterclass rescue with the National SAR Lifesaving Cross!",
      labelFa: "عملیات شاهکار والری و جک را با اهدای صلیب نجات کوهستان کشور جاودانه کن!",
      descriptionFa: "نشان زرینی که بر سینه قهرمانان واقعی خواهد درخشید.",
    },
    choiceB: {
      labelEn: "Share a reflective cup of coffee with pilot Dave on the tarmac as the world wakes up in peace!",
      labelFa: "یک فنجان قهوه آرامش‌بخش با خلبان دیو روی باند بنوشید وقتی جهان در امنیت از خواب بیدار می‌شود!",
      descriptionFa: "لذت ناب خدمت بی‌صدا به انسان‌ها در آغاز یک روز پرامید.",
    },
  },
  {
    stepNumber: 5,
    pathCode: "BBBB",
    passageEn:
      "Executing a steep, controlled dive out of the high-altitude turbulence zone, Dave harnessed gravity to achieve maximum airspeed through the descending mountain draft. The aircraft sliced through the squall like an arrow, breaking into the serene lower valley within four minutes. Marcus breathed deeply, his vital signs stable, smiling as he saw his wife and two young children waiting on the hospital lawn below waving frantic yellow banners of gratitude. The long night on Avalanche Ridge was finally over.",
    keywords: [
      { word: "turbulence", meaningFa: "تلاطم شدید و آشفتگی جریان هوا", phonetic: "/ˈtɜːrbjələns/" },
      { word: "harnessed", meaningFa: "مهار کرد و به خدمت گرفت", phonetic: "/ˈhɑːrnɪst/" },
      { word: "serene", meaningFa: "آرام و بدون تلاطم", phonetic: "/səˈriːn/" },
      { word: "gratitude", meaningFa: "سپاسگزاری عمیق و قدردانی از صمیم قلب", phonetic: "/ˈɡrætɪtjuːd/" },
    ],
    question: {
      promptEn: "Who was waiting on the hospital lawn waving yellow banners of gratitude?",
      promptFa: "چه کسانی روی چمن بیمارستان ایستاده بودند و پرچم‌های زرد سپاسگزاری را تکان می‌دادند؟",
      options: [
        "Marcus's wife and two young children waiting with overwhelming relief",
        "The mayor and the municipal marching band",
        "A group of foreign glaciology students",
      ],
      correctIndex: 0,
      hintSnippet: "smiling as he saw his wife and two young children waiting on the hospital lawn below waving frantic yellow banners of gratitude",
      clueFa: "خط ماقبل آخر رو بخون؛ همسر و دو فرزند کوچک مارکوس با چشمانی اشک‌بار از شوق و پرچم‌های زرد منتظرش بودند.",
    },
    choiceA: {
      labelEn: "Join Marcus's emotional family reunion on the lawn for a moment none of them will ever forget!",
      labelFa: "به جمع پر از احساس و اشک شوق خانواده مارکوس بپیوند در لحظه‌ای که هرگز فراموش نخواهد شد!",
      descriptionFa: "بزرگ‌ترین پاداش یک امدادگر دیدن آغوش گرم یک خانواده است.",
    },
    choiceB: {
      labelEn: "Salute your SAR comrades and prepare the bird for the next life that calls for help in the dark!",
      labelFa: "به همرزمان امدادگرت ادای احترام کن و بالگرد را برای نجات جان بعدی که در تاریکی صدا می‌زند آماده نگه دار!",
      descriptionFa: "چشمان بیدار و دست‌های آماده‌ای که نگهبان جان انسان‌ها هستند.",
    },
  },
];

const endings: EndingDraft[] = [
  { pathCode: "AAAAA", titleEn: "The Rooftop Miracle", titleFa: "معجزه پد بیمارستان", badgeCategory: "heroic", badgeIcon: "🏥", badgeNameFa: "پایان نجات طلایی", climaxEn: "Surgeons repair Marcus's fracture within an hour, hailing Jack and Valerie's precision rescue as an alpine medical triumph.", climaxFa: "پزشکان شکستگی مارکوس را ظرف یک ساعت جراحی کردند و امداد دقیق جک و والری را پیروزی بزرگ پزشکی کوهستان خواندند.", xpReward: 260 },
  { pathCode: "AAAAB", titleEn: "The Cockpit Brotherhood", titleFa: "برادری در آسمان", badgeCategory: "legendary", badgeIcon: "☕", badgeNameFa: "پایان صمیمی و قهرمانانه", climaxEn: "Sharing steaming mugs of cocoa, the crew watches dawn light up the peaks, bonded forever by the midnight extraction.", climaxFa: "با نوشیدن شکلات داغ در سپیده‌دم، کادر پرواز درخشش قله‌ها را نظاره کردند؛ پیوندی جاودان از دل خطرات نیمه‌شب.", xpReward: 250 },
  { pathCode: "AAABA", titleEn: "The Climate Legacy", titleFa: "میراث نجات زمین", badgeCategory: "scholar", badgeIcon: "🌍", badgeNameFa: "پایان علمی و نجات‌بخش", climaxEn: "Marcus's retrieved glacier core data unlocks crucial breakthroughs in combating flash glacial floods worldwide.", climaxFa: "داده‌های نجات‌یافته مغزه یخ مارکوس، راهکارهای حیاتی برای مقابله با سیلاب‌های یخچالی در جهان خلق کرد.", xpReward: 260 },
  { pathCode: "AAABB", titleEn: "The Citizen's Honor", titleFa: "افتخار شهروندی", badgeCategory: "heroic", badgeIcon: "🎖️", badgeNameFa: "پایان رسمی و پرفخر", climaxEn: "The city council awards Marcus and the SAR crew lifetime medals of civic resilience under standing ovations.", climaxFa: "شورای شهر در تشویق ایستاده مردم، مدال‌های دائمی پایداری مدنی را به مارکوس و امدادگران اهدا کرد.", xpReward: 245 },
  { pathCode: "AABAA", titleEn: "The Medal of Valor", titleFa: "نشان شجاعت ملی", badgeCategory: "heroic", badgeIcon: "🏅", badgeNameFa: "پایان دلاورانه", climaxEn: "Valerie receives the National Lifesaving Cross, celebrated nationwide for her unmatched composure on the cliff face.", climaxFa: "والری مدال نجات ملی را به پاس خونسردی و مهارت بی‌همتایش در پرتگاه‌های صخره‌ای دریافت کرد.", xpReward: 255 },
  { pathCode: "AABAB", titleEn: "The Golden SAR Standard", titleFa: "استاندارد طلایی نجات", badgeCategory: "scholar", badgeIcon: "📘", badgeNameFa: "پایان مرجع آموزشی", climaxEn: "Valerie's deflection technique becomes mandatory curriculum, training thousands of young alpine rescue rangers.", climaxFa: "تکنیک والری در کتاب‌های مرجع ثبت شد و هزاران محیط‌بان و امدادگر جوان را در نجات کوهستان آموزش داد.", xpReward: 250 },
  { pathCode: "AABBA", titleEn: "The Guardian Canopy", titleFa: "چتر نجات فرشتگان", badgeCategory: "scholar", badgeIcon: "🪂", badgeNameFa: "پایان نوآوری فناوری", climaxEn: "The patented rescue drogue saves over four hundred mountain climbers across five continents in its first two years.", climaxFa: "اختراع چتر ترمز بالابر در دو سال اول جان بیش از چهارصد کوهنورد را در پنج قاره نجات داد.", xpReward: 260 },
  { pathCode: "AABBB", titleEn: "The Warm Hangar Welcome", titleFa: "آغوش گرم آشیانه", badgeCategory: "funny", badgeIcon: "🍲", badgeNameFa: "پایان دلگرم‌کننده", climaxEn: "Mechanics and ground crew welcome the frost-covered helicopter with hot chili and roaring cheers on the tarmac.", climaxFa: "مکانیک‌ها و کادر فنی با کاسه‌های سوپ داغ و هلهله شادی به پیشواز هلیکوپتر یخ‌زده آمدند.", xpReward: 235 },
  { pathCode: "ABAAA", titleEn: "The Sanctuary of the Peaks", titleFa: "ایستگاه پایش قله‌ها", badgeCategory: "scholar", badgeIcon: "📡", badgeNameFa: "پایان علمی و ماندگار", climaxEn: "The Marcus Vance Glacier Observatory operates 24/7, safeguarding twelve valley townships from natural catastrophes.", climaxFa: "رصدخانه یخچال‌های طبیعی مارکوس ونس شبانه‌روزی شد و دوازده شهرک دره را از بلایای طبیعی مصون نگه داشت.", xpReward: 260 },
  { pathCode: "ABAAB", titleEn: "The Voice of Science", titleFa: "پژواک علم در جهان", badgeCategory: "scholar", badgeIcon: "📑", badgeNameFa: "پایان دانشگاهی برجسته", climaxEn: "Their joint study in Nature Geosciences redefines global mountain safety standards and wins international praise.", climaxFa: "پژوهش مشترک آنها در مجله نیچر استانداردهای ایمنی کوهستان‌های جهان را ارتقا داد و ستایش جهانی برانگیخت.", xpReward: 250 },
  { pathCode: "ABABA", titleEn: "The Banquet of Gratitude", titleFa: "ضیافت شکرگزاری", badgeCategory: "legendary", badgeIcon: "🥂", badgeNameFa: "پایان احساسی و پرشکوه", climaxEn: "Marcus toasts the SAR brigade as family, their friendship forged forever in the blizzard of Sector Four.", climaxFa: "مارکوس با چشمان اشک‌بار امدادگران را خانواده خود خواند؛ پیوندی که در سرمای قطاع چهار جاودان شد.", xpReward: 250 },
  { pathCode: "ABABB", titleEn: "The Midnight Legend", titleFa: "افسانه سینمایی نیمه‌شب", badgeCategory: "heroic", badgeIcon: "🎬", badgeNameFa: "پایان الهام‌بخش سینمایی", climaxEn: "The documentary on Avalanche Ridge wins three festival awards, motivating a record surge of volunteer medics.", climaxFa: "مستند نجات گردنه بهمن سه جایزه سینمایی برد و موجی بی‌سابقه از داوطلبان امداد پزشکی کوهستان ساخت.", xpReward: 245 },
  { pathCode: "ABBAA", titleEn: "The Aviator's Crown", titleFa: "تاج افتخار هوانورد", badgeCategory: "legendary", badgeIcon: "✈️", badgeNameFa: "پایان پروازی اسطوره‌ای", climaxEn: "Pilot Dave is inducted into the Aviation Hall of Fame for his breathtaking canyon evasion under storm conditions.", climaxFa: "خلبان دیو برای فرار شاهکار از دره و مهار طوفان سهمگین به تالار مشاهیر هوانوردی کشور راه یافت.", xpReward: 260 },
  { pathCode: "ABBAB", titleEn: "The Vision of LiDAR", titleFa: "دید عقاب با لیدار", badgeCategory: "scholar", badgeIcon: "🛰️", badgeNameFa: "پایان پیشرفته مهندسی", climaxEn: "The fleet's new LiDAR sensors map every canyon contour in pitch darkness, eliminating blind-flight risks forever.", climaxFa: "رادارهای لیدار جدید تمام پیچ‌وخم‌های دره‌ها را در ظلمات مطلق نقشه‌برداری کردند و پرواز کور را پایان دادند.", xpReward: 245 },
  { pathCode: "ABBBA", titleEn: "The Aurora Oath", titleFa: "سوگند در شفق قطبی", badgeCategory: "legendary", badgeIcon: "🌌", badgeNameFa: "پایان چشم‌نواز و جادویی", climaxEn: "The viral photo of the helicopter under northern lights becomes the global symbol of mountain rescue dedication.", climaxFa: "عکس خیره‌کننده هلیکوپتر زیر شفق قطبی به نماد جهانی فداکاری و نجات در کوهستان‌ها بدل شد.", xpReward: 255 },
  { pathCode: "ABBBB", titleEn: "Dawn Over the Cascades", titleFa: "سپیده‌دم بر فراز رشته‌کوه", badgeCategory: "explorer", badgeIcon: "🌄", badgeNameFa: "پایان آرامش و امید", climaxEn: "Touching down in golden morning mist, the team breathes easy, having brought another soul safely home.", climaxFa: "با لمس زمین در مه زرین صبح، تیم نفس راحتی کشید؛ جانی دیگر با عشق به آغوش زندگی بازگشت.", xpReward: 240 },
  { pathCode: "BAAAA", titleEn: "The Iron Haven", titleFa: "جان‌پناه آهنین گردنه", badgeCategory: "heroic", badgeIcon: "🛖", badgeNameFa: "پایان جاودانه امداد", climaxEn: "The new Ridge Refuge 4 saves seventy stranded climbers in its first winter, standing firm against arctic gales.", climaxFa: "جان‌پناه جدید شماره ۴ در اولین زمستان جان هفتاد کوهنورد گرفتار در کولاک‌های قطبی را نجات داد.", xpReward: 255 },
  { pathCode: "BAAAB", titleEn: "The Village Hearth", titleFa: "گرمای اجاق روستا", badgeCategory: "funny", badgeIcon: "🥞", badgeNameFa: "پایان گرم و صمیمی", climaxEn: "The villagers shower the rescuers with fresh berry pies, hot tea, and songs celebrating the dawn victory.", climaxFa: "اهالی روستا با پای تمشک تازه، چای آتشی و ترانه‌های محلی پیروزی سپیده‌دم را با امدادگران جشن گرفتند.", xpReward: 235 },
  { pathCode: "BAABA", titleEn: "The Unbroken Circle", titleFa: "حلقه ناگسستنی برادری", badgeCategory: "legendary", badgeIcon: "🤝", badgeNameFa: "پایان وفاداری و رفاقت", climaxEn: "Jack, Valerie, Dave, and Marcus toast to courage, vowing to stand together whenever the sirens wail.", climaxFa: "جک، والری، دیو و مارکوس جام همدلی را بالا بردند و عهد بستند هر جا آژیر خطری بصدا درآید در کنار هم باشند.", xpReward: 250 },
  { pathCode: "BAABB", titleEn: "The Mentor's Torch", titleFa: "مشعل معرفت نجات‌یافته", badgeCategory: "scholar", badgeIcon: "🎓", badgeNameFa: "پایان پربار آموزشی", climaxEn: "Marcus trains eight hundred cadets in mountain awareness, turning his near-death ordeal into life-saving wisdom.", climaxFa: "مارکوس به هشتصد دانشجوی نجات درس هوشیاری در کوه داد و تجربه مرگ را به خرد زندگی تبدیل کرد.", xpReward: 245 },
  { pathCode: "BABAA", titleEn: "The Network of Angels", titleFa: "شبکه پناهگاه‌های فرشته", badgeCategory: "scholar", badgeIcon: "🏞️", badgeNameFa: "پایان زیرساختی ملی", climaxEn: "All thirteen alpine parks install automated geothermal refuges, reducing winter fatalities to near zero.", climaxFa: "هر سیزده پارک کوهستانی به جان‌پناه‌های زمین‌گرمایی مجهز شدند و مرگ‌ومیر زمستانه کوهنوردان را به صفر رساندند.", xpReward: 260 },
  { pathCode: "BABAB", titleEn: "Chronicle of Survival", titleFa: "روایت جاودان بقا", badgeCategory: "scholar", badgeIcon: "📖", badgeNameFa: "پایان پرفروش ادبی", climaxEn: "'Night at Shelter Seven' sells three million copies, its royalties funding mountain rescue equipment nationwide.", climaxFa: "کتاب پرفروش «شبی در جان‌پناه هفت» سه میلیون نسخه فروخت و تمام عوایدش صرف تجهیز پایگاه‌های نجات شد.", xpReward: 250 },
  { pathCode: "BABBA", titleEn: "The Presidential Laurel", titleFa: "افتخار ریاست‌جمهوری", badgeCategory: "heroic", badgeIcon: "🏆", badgeNameFa: "پایان بلندمرتبه دولتی", climaxEn: "The President presents the National Lifesaving Cup, lauding the team's relentless precision in sub-zero fury.", climaxFa: "رئیس‌جمهور جام نجات ملی را به تیم اهدا کرد و دقت خیره‌کننده آنان در سرمای زیر صفر را ستود.", xpReward: 260 },
  { pathCode: "BABBB", titleEn: "The Fireside Harmony", titleFa: "نوای شومینه چوبی", badgeCategory: "funny", badgeIcon: "🔥", badgeNameFa: "پایان آرامش‌بخش خانوادگی", climaxEn: "Laughter echoes in the valley lodge as Dave strums his acoustic guitar by the fire, celebrating life's precious gift.", climaxFa: "خنده‌ها در کلبه چوبی پیچید وقتی دیو کنار شومینه گیتار زد و همه قدردان موهبت ارزشمند زندگی شدند.", xpReward: 230 },
  { pathCode: "BBAAA", titleEn: "The City's Protectors", titleFa: "نگهبانان جان شهر", badgeCategory: "legendary", badgeIcon: "🗝️", badgeNameFa: "پایان حماسی و شهری", climaxEn: "Eight thousand citizens cheer as Jack and Valerie hold the Golden Key, forever revered as the valley's guardian angels.", climaxFa: "هشت هزار شهروند یک‌صدا هورا کشیدند؛ جک و والری با کلید طلایی، فرشتگان نگهبان همیشگی دره شدند.", xpReward: 260 },
  { pathCode: "BBAAB", titleEn: "The Sentinel Foundation", titleFa: "بنیاد دیده‌بانان کوهستان", badgeCategory: "scholar", badgeIcon: "🏛️", badgeNameFa: "پایان علمی و ماندگار", climaxEn: "The Reynolds-Lin Institute installs fifty deep-crust seismic probes, revolutionizing early warning for mountain towns.", climaxFa: "موسسه رینولدز و لین پنجاه کاوشگر لرزه‌نگاری نصب کرد و پیش‌بینی زودهنگام خطرات کوهستان را متحول ساخت.", xpReward: 255 },
  { pathCode: "BBBAA", titleEn: "The Boot of the Brave", titleFa: "پوتین‌های مرد دلاور", badgeCategory: "heroic", badgeIcon: "🥾", badgeNameFa: "پایان نمادین و تاریخی", climaxEn: "Marcus's frost-bitten climbing boots stand on brass plinths in the museum, inspiring youth never to give up hope.", climaxFa: "پوتین‌های یخ‌زده مارکوس در موزه کوهنوردی نصب شد تا نماد امید و تسلیم‌ناپذیری برای نسل‌ها باشد.", xpReward: 240 },
  { pathCode: "BBBAB", titleEn: "The Trout Feast of Victors", titleFa: "ضیافت شاهانه پیروزی", badgeCategory: "funny", badgeIcon: "🐟", badgeNameFa: "پایان دل‌چسب و لذیذ", climaxEn: "Forty squad members devour skillet-fried river trout and cider, recounting the midnight ridge escape until morning.", climaxFa: "چهل امدادگر دور هم قزل‌آلای تازه بریان و نوشیدنی سیب خوردند و تا صبح ماجرای فرار نیمه‌شب را مرور کردند.", xpReward: 235 },
  { pathCode: "BBBBA", titleEn: "The Cross of Alpine Honor", titleFa: "صلیب افتخار کوهستان", badgeCategory: "legendary", badgeIcon: "🎖️", badgeNameFa: "پایان باشکوه و درخشان", climaxEn: "The Governor pins gold ribbons on Jack, Valerie, and Dave, declaring Sector Four the nation's finest SAR unit.", climaxFa: "استاندار مدال‌های زرین را بر سینه جک، والری و دیو نشاند و قطاع چهار را برترین یگان امداد کشور نامید.", xpReward: 260 },
  { pathCode: "BBBBB", titleEn: "The Guardian's Vigil", titleFa: "دیده‌بان همیشه بیدار", badgeCategory: "legendary", badgeIcon: "🚁", badgeNameFa: "پایان ابدی و الهام‌بخش", climaxEn: "As Marcus hugs his weeping children on the lawn, the crew refuels the helicopter, ready for the next call in the dark.", climaxFa: "در حالی که مارکوس فرزندانش را در آغوش می‌فشرد، کادر پرواز باک بالگرد را پر کردند؛ آماده برای ندای بعدی در تاریکی.", xpReward: 260 },
];

export const story5AvalancheRescue: AdventureStory = buildAdventureStory({
  id: "b2-alpine-avalanche-rescue",
  storyIndex: 5,
  cefr: "B2",
  titleEn: "Midnight on Avalanche Ridge",
  titleFa: "عملیات نجات نیمه‌شب در گردنه بهمن",
  genre: "rescue",
  genreLabelFa: "❄️ هیجان و نجات‌بخشی",
  genreIcon: "❄️",
  synopsisEn:
    "When a massive slab avalanche traps a surveyor on a crumbling ledge at 3,200 meters, SAR commander Jack Reynolds and flight paramedic Valerie Lin launch a daring midnight helicopter extraction in blinding blizzard winds across 32 heart-stopping endings.",
  synopsisFa:
    "وقتی یک بهمن ناگهانی در ارتفاع ۳۲۰۰ متری کوهستان، نقشه‌بردار محیط‌زیست را روی طاقچه صخره‌ای در حال سقوط محبوس می‌کند، جک رینولدز (فرمانده کارکشته نجات) و والری لین (پزشک پرواز و صخره‌نورد فنی) عملیات نفس‌گیر نجات با بالگرد و طناب را در میان بوران مرگبار آغاز می‌کنند. ۳۲ پایان پر از هیجان، فداکاری و مهارت فنی پیش روی توست!",
  coverImage: "/images/skills/reading/b2-avalanche-rescue.webp",
  nodes,
  endings,
});
