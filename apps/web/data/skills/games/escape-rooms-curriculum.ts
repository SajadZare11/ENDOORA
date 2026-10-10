import type { CefrLevel } from "./types";

// ============================================================================
// ESCAPE ROOM DATA TYPES (POINT-AND-CLICK ADVENTURE SPEAKING GAME)
// ============================================================================

export type EscapeRoomArchetype =
  | "point-and-click-room" // A1 & A2: Inspect room objects, telephone, voice safe, exit door
  | "wiretap-spy-van"       // B1 & B2: Radio eavesdropping, walkie-talkie intel report, emergency hatch
  | "high-security-vault";  // C1 & C2: Laser scanner, suspicion meter, interrogation blast door

export interface InteractiveRoomObject {
  id: string;
  nameFa: string;
  nameEn: string;
  icon: string;
  coordinates: { xPct: number; yPct: number }; // Relative position on the room canvas (e.g. x: 25%, y: 40%)
  unlockedItemIcon?: string; // Icon that pops into the inventory bag (e.g. 🗝️, 📼, 💳)
  unlockedItemNameFa?: string;
  speakerPromptEn: string;
  speakerRoleFa: string;
  taskInstructionFa: string;
  targetKeywords: Array<{
    phrase: string;
    hintFa: string;
    weight: number;
  }>;
  idealVoiceResponseEn: string;
  fallbackChoices: string[];
  aefReference: string; // e.g. "AEF 1 Unit 3A (Polite requests with Can/Could)"
  requiredToEscape: boolean;
}

export interface EscapeRoomStage {
  levelNumber: number; // 1 to 10
  cefr: CefrLevel;
  titleFa: string;
  titleEn: string;
  storyIntroFa: string;
  roomTheme: "hotel" | "cafe" | "airport" | "train" | "safehouse" | "server-room" | "vault" | "courtroom";
  archetype: EscapeRoomArchetype;
  escapeTimeLimitSeconds: number; // e.g. 50s to 75s
  targetGhostTimeSeconds: number; // Ghost benchmark e.g. 38s
  ghostRivalName: string;
  ghostRivalAvatar: string;
  aefBookAndUnit: string;
  objects: InteractiveRoomObject[]; // 3 objects per room
}

// ============================================================================
// A1 ESCAPE ROOMS: THE HOTEL, CAFE, SUBWAY & TOURIST STATIONS (AEF Starter & 1)
// ============================================================================
export const A1_ESCAPE_ROOMS: EscapeRoomStage[] = [
  {
    levelNumber: 1,
    cefr: "A1",
    titleFa: "فرار از اتاق هتل قفل‌شده در لندن",
    titleEn: "The Locked London Hotel Room",
    storyIntroFa: "ای وای! کارت اتاقت کار نمی‌کنه و در قفل شده! به پذیرش زنگ بزن، رمز گاوصندوق رو بگو تا کلید طلایی رو برداری و بزنی به چاک!",
    roomTheme: "hotel",
    archetype: "point-and-click-room",
    escapeTimeLimitSeconds: 65,
    targetGhostTimeSeconds: 42,
    ghostRivalName: "سارا رضایی",
    ghostRivalAvatar: "🕵️‍♀️",
    aefBookAndUnit: "AEF 1 Units 1-2 (Everyday Objects & Polite Greetings)",
    objects: [
      {
        id: "obj-a1-1-phone",
        nameFa: "تلفن قرمز پذیرش",
        nameEn: "Reception Intercom",
        icon: "📞",
        coordinates: { xPct: 22, yPct: 48 },
        unlockedItemIcon: "📜",
        unlockedItemNameFa: "یادداشت رمز گاوصندوق",
        speakerPromptEn: "Front desk speaking! How can we assist you with room 302?",
        speakerRoleFa: "پذیرش هتل",
        taskInstructionFa: "گوشی رو بردار و خیلی شیک و باادب بگو کارتم کار نمی‌کنه و کمک می‌خوام (بگو: 'Excuse me, my key card isn't working').",
        targetKeywords: [
          { phrase: "Excuse me", hintFa: "(ببخشید)", weight: 30 },
          { phrase: "isn't working", hintFa: "(کار نمی‌کنه)", weight: 35 },
        ],
        idealVoiceResponseEn: "Excuse me, my room key card isn't working. Can you help me please?",
        fallbackChoices: [
          "Excuse me, my room key card isn't working. Can you help me please?",
          "Key is bad open door now.",
          "I want to break the window.",
        ],
        aefReference: "AEF 1 Unit 1B (Subject pronouns & basic greetings)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-1-safe",
        nameFa: "گاوصندوق صوتی پای پای‌تختی",
        nameEn: "Voice-Activated Wall Safe",
        icon: "🔐",
        coordinates: { xPct: 52, yPct: 62 },
        unlockedItemIcon: "🗝️",
        unlockedItemNameFa: "کلید طلایی خروج",
        speakerPromptEn: "VOICE LOCK: Please state the master emergency numbers clearly.",
        speakerRoleFa: "هوش مصنوعی گاوصندوق",
        taskInstructionFa: "رمز چهار رقمی رو شمرده و رسا بخون تا قفل باز بشه: 'Seven, two, four, nine'.",
        targetKeywords: [
          { phrase: "Seven", hintFa: "(هفت)", weight: 20 },
          { phrase: "two", hintFa: "(دو)", weight: 20 },
          { phrase: "four", hintFa: "(چهار)", weight: 20 },
          { phrase: "nine", hintFa: "(نُه)", weight: 25 },
        ],
        idealVoiceResponseEn: "Seven, two, four, nine. Unlock safe please.",
        fallbackChoices: [
          "Seven, two, four, nine. Unlock safe please.",
          "Number 7249 fast.",
          "One two three four.",
        ],
        aefReference: "AEF Starter Unit 1 & AEF 1 Unit 1A (Numbers 1-100)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-1-door",
        nameFa: "درب سنگین خروج",
        nameEn: "Locked Hotel Suite Door",
        icon: "🚪",
        coordinates: { xPct: 82, yPct: 40 },
        unlockedItemIcon: "🏃",
        unlockedItemNameFa: "فرار موفقیت‌آمیز به لابی",
        speakerPromptEn: "SECURITY LATCH: Insert golden key and state formal checkout phrase.",
        speakerRoleFa: "قفل هوشمند درب",
        taskInstructionFa: "کلید طلایی رو بچرخون و با گفتن جمله قشنگ 'Thank you for your help, goodbye!' در رو باز کن و بزن بیرون!",
        targetKeywords: [
          { phrase: "Thank you for your help", hintFa: "(ممنون برای کمکتون)", weight: 40 },
          { phrase: "goodbye", hintFa: "(خداحافظ)", weight: 25 },
        ],
        idealVoiceResponseEn: "Thank you for your help, goodbye!",
        fallbackChoices: [
          "Thank you for your help, goodbye!",
          "Door open now please.",
          "Bye bye hotel.",
        ],
        aefReference: "AEF 1 Unit 2B (Polite formulas and closing dialogues)",
        requiredToEscape: true,
      },
    ],
  },
  {
    levelNumber: 2,
    cefr: "A1",
    titleFa: "فرار از آشپزخانه کافی‌شاپ منهتن",
    titleEn: "The Locked Manhattan Coffee Bar",
    storyIntroFa: "درِ پشتی کافه قفل شده و باریستا حواسش نیست! دستگاه اسپرسوی صوتی رو راه بنداز، سفارشت رو بگو و تا قبل از اینکه دیر بشه فرار کن!",
    roomTheme: "cafe",
    archetype: "point-and-click-room",
    escapeTimeLimitSeconds: 60,
    targetGhostTimeSeconds: 40,
    ghostRivalName: "امیر حسینی",
    ghostRivalAvatar: "☕",
    aefBookAndUnit: "AEF 1 Unit 3A (Food & Drink, Ordering with 'Can I have...')",
    objects: [
      {
        id: "obj-a1-2-machine",
        nameFa: "دستگاه اسپرسو صوتی",
        nameEn: "Smart Espresso Machine",
        icon: "☕",
        coordinates: { xPct: 24, yPct: 52 },
        unlockedItemIcon: "🥛",
        unlockedItemNameFa: "ماگ قهوه رمزدار",
        speakerPromptEn: "COFFEE PROTOCOL: State your drink order correctly to disarm the pressure valve.",
        speakerRoleFa: "سیستم صوتی اسپرسو",
        taskInstructionFa: "خیلی باحال و انگلیسی سفارش لاته بده تا دستگاه شروع به کار کنه: 'Can I have a hot latte with oat milk, please?'.",
        targetKeywords: [
          { phrase: "Can I have", hintFa: "(می‌تونم داشته باشم)", weight: 35 },
          { phrase: "oat milk", hintFa: "(شیر جو دوسر)", weight: 30 },
        ],
        idealVoiceResponseEn: "Can I have a hot latte with oat milk, please?",
        fallbackChoices: [
          "Can I have a hot latte with oat milk, please?",
          "Give me coffee drink quick.",
          "Hot water brown milk.",
        ],
        aefReference: "AEF 1 Unit 3A (Food & Drink / Ordering phrases)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-2-cashier",
        nameFa: "صندوق پرداخت الکترونیک",
        nameEn: "Digital Cash Register",
        icon: "💳",
        coordinates: { xPct: 54, yPct: 50 },
        unlockedItemIcon: "🎟️",
        unlockedItemNameFa: "رسید حاوی بارکد خروج",
        speakerPromptEn: "REGISTER PROMPT: How will you be paying for this order today?",
        speakerRoleFa: "صندوق فروشگاه",
        taskInstructionFa: "به صندوق بگو با کارت پرداخت می‌کنی و بفرما: 'By credit card, please. Here you go!'.",
        targetKeywords: [
          { phrase: "By credit card", hintFa: "(با کارت اعتباری)", weight: 35 },
          { phrase: "Here you go", hintFa: "(بفرمایید خدمت شما)", weight: 30 },
        ],
        idealVoiceResponseEn: "By credit card, please. Here you go!",
        fallbackChoices: [
          "By credit card, please. Here you go!",
          "No cash machine take.",
          "Plastic card pay.",
        ],
        aefReference: "AEF 1 Practical English Episode 1 (In a Coffee Shop)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-2-exit",
        nameFa: "درب پشتی کوچه",
        nameEn: "Alleyway Exit Gate",
        icon: "🚪",
        coordinates: { xPct: 84, yPct: 44 },
        unlockedItemIcon: "🏃‍♂️",
        unlockedItemNameFa: "فرار موفق به خیابان",
        speakerPromptEn: "BARISTA BOB: Leaving so soon? Have a wonderful day in New York!",
        speakerRoleFa: "باریستای کافه",
        taskInstructionFa: "با جمله گرم 'You too! Have a great day, see you soon!' در خروج رو باز کن و فرار کن!",
        targetKeywords: [
          { phrase: "You too", hintFa: "(همچنین شما)", weight: 30 },
          { phrase: "See you soon", hintFa: "(به زودی می‌بینمت)", weight: 30 },
        ],
        idealVoiceResponseEn: "You too! Have a great day, see you soon!",
        fallbackChoices: [
          "You too! Have a great day, see you soon!",
          "Bye New York street.",
          "I run outside now.",
        ],
        aefReference: "AEF 1 Unit 2 (Farewells & Daily Routine)",
        requiredToEscape: true,
      },
    ],
  },
  {
    levelNumber: 3,
    cefr: "A1",
    titleFa: "فرار از باجه ایستگاه قطار کینگز کراس",
    titleEn: "Kings Cross Ticket Vault Escape",
    storyIntroFa: "در اتاق کنترل قطار مترو گیر افتاده‌ای. با بی‌سیم کنترل، گاوصندوق بلیت و اسکنر سوزنبانی صحبت کن تا قطار راه بیفتد!",
    roomTheme: "train",
    archetype: "point-and-click-room",
    escapeTimeLimitSeconds: 60,
    targetGhostTimeSeconds: 39,
    ghostRivalName: "مریم احمدی",
    ghostRivalAvatar: "🚇",
    aefBookAndUnit: "AEF 1 Unit 4 (Time, Travel & Schedules)",
    objects: [
      {
        id: "obj-a1-3-clock",
        nameFa: "ساعت دیواری ایستگاه",
        nameEn: "Station Wall Clock Panel",
        icon: "⏱️",
        coordinates: { xPct: 26, yPct: 35 },
        unlockedItemIcon: "🎫",
        unlockedItemNameFa: "بلیت ساعت طلایی",
        speakerPromptEn: "DISPATCH AUTOMATION: State the current train departure time.",
        speakerRoleFa: "ساعت گویای ایستگاه",
        taskInstructionFa: "ساعت را به انگلیسی بخوان: 'It is quarter past four' (ساعت چهار و ربع است).",
        targetKeywords: [
          { phrase: "quarter past", hintFa: "(یک ربع گذشته از...)", weight: 40 },
          { phrase: "four", hintFa: "(چهار)", weight: 25 },
        ],
        idealVoiceResponseEn: "It is quarter past four in the afternoon.",
        fallbackChoices: [
          "It is quarter past four in the afternoon.",
          "Time is 4:15 clock.",
          "Four hour fifteen minutes.",
        ],
        aefReference: "AEF 1 Unit 4A (Telling the Time)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-3-radio",
        nameFa: "بیسیم ارتباط با راننده قطار",
        nameEn: "Driver Radio Console",
        icon: "📻",
        coordinates: { xPct: 56, yPct: 58 },
        unlockedItemIcon: "🔑",
        unlockedItemNameFa: "کلید استارت لکوموتیو",
        speakerPromptEn: "TRAIN DRIVER: Conductor, do you require a single or return journey?",
        speakerRoleFa: "راننده لکوموتیو",
        taskInstructionFa: "بگو بلیت تک‌سفره به مرکز لندن می‌خواهی: 'A single ticket to central London, please.'.",
        targetKeywords: [
          { phrase: "single ticket", hintFa: "(بلیت یک‌طرفه)", weight: 35 },
          { phrase: "central London", hintFa: "(مرکز لندن)", weight: 30 },
        ],
        idealVoiceResponseEn: "A single ticket to central London, please.",
        fallbackChoices: [
          "A single ticket to central London, please.",
          "One ticket train London now.",
          "Go center of city.",
        ],
        aefReference: "AEF 1 Practical English Episode 2 (Buying a ticket)",
        requiredToEscape: true,
      },
      {
        id: "obj-a1-3-turnstile",
        nameFa: "گیت چرخشی خروج اضطراری",
        nameEn: "Emergency Platform Gate",
        icon: "🚪",
        coordinates: { xPct: 85, yPct: 48 },
        unlockedItemIcon: "🚂",
        unlockedItemNameFa: "سوار شدن به قطار اکسپرس",
        speakerPromptEn: "GATE AGENT: Ticket verified! What is your final passenger clearance?",
        speakerRoleFa: "متصدی گیت",
        taskInstructionFa: "تشکر کن و بگو روز خوبی داشته باشید: 'Thank you very much, have a safe trip!'.",
        targetKeywords: [
          { phrase: "Thank you very much", hintFa: "(خیلی متشکرم)", weight: 35 },
          { phrase: "safe trip", hintFa: "(سفر بی‌خطر)", weight: 30 },
        ],
        idealVoiceResponseEn: "Thank you very much, have a safe trip!",
        fallbackChoices: [
          "Thank you very much, have a safe trip!",
          "Yes gate open go.",
          "Thanks train bye.",
        ],
        aefReference: "AEF 1 Unit 4B (Travel phrases)",
        requiredToEscape: true,
      },
    ],
  },
];

// ============================================================================
// A2 ESCAPE ROOMS: AIRPORT CUSTOMS, DOCTOR'S CLINIC & HOTEL (AEF 2)
// ============================================================================
export const A2_ESCAPE_ROOMS: EscapeRoomStage[] = [
  {
    levelNumber: 1,
    cefr: "A2",
    titleFa: "فرار از باجه گمرک و بار گمشده فرودگاه",
    titleEn: "Airport Lost Baggage Vault Escape",
    storyIntroFa: "در اتاق بازرسی اشیاء گمشده فرودگاه هستی و باید چمدانت را با کد شناسایی کنی، با مأمور صحبت کنی و برگه خروج گمرک را تحویل بگیری!",
    roomTheme: "airport",
    archetype: "point-and-click-room",
    escapeTimeLimitSeconds: 65,
    targetGhostTimeSeconds: 41,
    ghostRivalName: "پویا کریمی",
    ghostRivalAvatar: "🧳",
    aefBookAndUnit: "AEF 2 Unit 2 (Airports, Present Continuous & Travel)",
    objects: [
      {
        id: "obj-a2-1-luggage",
        nameFa: "چمدان مشکوک با روبان قرمز",
        nameEn: "Tagged Suitcase on Rack",
        icon: "🧳",
        coordinates: { xPct: 24, yPct: 56 },
        unlockedItemIcon: "🏷️",
        unlockedItemNameFa: "برچسب بار تأییدشده",
        speakerPromptEn: "CUSTOMS OFFICER: Describe your missing suitcase and what distinguishing feature it has.",
        speakerRoleFa: "مأمور بازرسی گمرک",
        taskInstructionFa: "چمدانت را توصیف کن: 'It is a black suitcase with a red ribbon on the handle.'.",
        targetKeywords: [
          { phrase: "black suitcase", hintFa: "(چمدان مشکی)", weight: 30 },
          { phrase: "red ribbon", hintFa: "(روبان قرمز)", weight: 35 },
        ],
        idealVoiceResponseEn: "It is a black suitcase with a red ribbon on the handle.",
        fallbackChoices: [
          "It is a black suitcase with a red ribbon on the handle.",
          "My bag is big and black color.",
          "Give luggage with red thing.",
        ],
        aefReference: "AEF 2 Unit 2A (Describing luggage & flight vocabulary)",
        requiredToEscape: true,
      },
      {
        id: "obj-a2-1-scanner",
        nameFa: "اسکنر اسناد پاسپورت",
        nameEn: "Passport Optical Reader",
        icon: "🛂",
        coordinates: { xPct: 54, yPct: 45 },
        unlockedItemIcon: "📄",
        unlockedItemNameFa: "برگه ترخیص رسمی بار",
        speakerPromptEn: "SCANNER VOICE: State the purpose of your trip and your accommodation.",
        speakerRoleFa: "دستگاه بیومتریک گمرک",
        taskInstructionFa: "بگو برای تعطیلات آمده‌ام و در هتل اقامت دارم: 'I am traveling for holiday and staying at a hotel.'.",
        targetKeywords: [
          { phrase: "traveling for holiday", hintFa: "(سفر برای تعطیلات)", weight: 35 },
          { phrase: "staying at a hotel", hintFa: "(اقامت در هتل)", weight: 30 },
        ],
        idealVoiceResponseEn: "I am traveling for holiday and staying at a hotel in the center.",
        fallbackChoices: [
          "I am traveling for holiday and staying at a hotel in the center.",
          "I come sleep hotel holiday.",
          "Vacation visit tourist.",
        ],
        aefReference: "AEF 2 Unit 2B (Future with Present Continuous / Travel plans)",
        requiredToEscape: true,
      },
      {
        id: "obj-a2-1-gate",
        nameFa: "درب کشویی خروج مسافرین",
        nameEn: "Arrivals Sliding Glass Gate",
        icon: "🚪",
        coordinates: { xPct: 84, yPct: 40 },
        unlockedItemIcon: "🚕",
        unlockedItemNameFa: "خروج به سمت تاکسی‌های شهر",
        speakerPromptEn: "CUSTOMS OFFICER: You are cleared! What a relief, isn't it?",
        speakerRoleFa: "مأمور بازرسی گمرک",
        taskInstructionFa: "تشکر کن و بگو چه خیالی آسوده شد: 'What a relief! Thank you so much for your assistance.'.",
        targetKeywords: [
          { phrase: "What a relief", hintFa: "(چه خیالی راحت شد / چه آرامشی!)", weight: 40 },
          { phrase: "assistance", hintFa: "(کمک و راهنمایی)", weight: 25 },
        ],
        idealVoiceResponseEn: "What a relief! Thank you so much for your assistance.",
        fallbackChoices: [
          "What a relief! Thank you so much for your assistance.",
          "I am happy thanks officer.",
          "Bag taken bye bye.",
        ],
        aefReference: "AEF 2 Practical English (At the airport)",
        requiredToEscape: true,
      },
    ],
  },
  {
    levelNumber: 2,
    cefr: "A2",
    titleFa: "فرار از سوئیت هتل با رزرو اشتباهی",
    titleEn: "Hotel Suite Mix-up Escape",
    storyIntroFa: "کلید اتاقی پر از سروصدا کنار آسانسور به تو داده شده است. با پذیرش تماس بگیر، تعویض اتاق بخواه و کد اتاق آرام را دریافت کن!",
    roomTheme: "hotel",
    archetype: "point-and-click-room",
    escapeTimeLimitSeconds: 65,
    targetGhostTimeSeconds: 43,
    ghostRivalName: "نگار فراهانی",
    ghostRivalAvatar: "🛎️",
    aefBookAndUnit: "AEF 2 Unit 3 (Hotels, Requests with 'Could I possibly...')",
    objects: [
      {
        id: "obj-a2-2-phone",
        nameFa: "تلفن میز پذیرش هتل",
        nameEn: "Bedside Hotel Phone",
        icon: "📞",
        coordinates: { xPct: 22, yPct: 52 },
        unlockedItemIcon: "🗝️",
        unlockedItemNameFa: "کارت کلید اتاق طبقه پنجم",
        speakerPromptEn: "CONCIERGE: Front desk! Is everything to your satisfaction in room 204?",
        speakerRoleFa: "مسئول تشریفات هتل",
        taskInstructionFa: "بگو اتاق خیلی پر سر و صداست و تقاضای اتاق آرام کن: 'Could I possibly change to a quiet room?'.",
        targetKeywords: [
          { phrase: "Could I possibly", hintFa: "(آیا امکانش هست که...)", weight: 35 },
          { phrase: "quiet room", hintFa: "(اتاق آرام و ساکت)", weight: 30 },
        ],
        idealVoiceResponseEn: "Could I possibly change to a quiet room away from the elevator?",
        fallbackChoices: [
          "Could I possibly change to a quiet room away from the elevator?",
          "Room has loud noise change me.",
          "I cannot sleep give other room.",
        ],
        aefReference: "AEF 2 Practical English Episode 1 (Hotel Check-in & Requests)",
        requiredToEscape: true,
      },
      {
        id: "obj-a2-2-minibar",
        nameFa: "مینی‌بار قفل‌شده اتاق",
        nameEn: "Locked Suite Minibar Console",
        icon: "🧊",
        coordinates: { xPct: 55, yPct: 60 },
        unlockedItemIcon: "🍾",
        unlockedItemNameFa: "کلید بازگشایی مینی‌بار",
        speakerPromptEn: "MINIBAR SENSOR: State the item name you would like to consume without charge.",
        speakerRoleFa: "سنسور مینی‌بار",
        taskInstructionFa: "بگو آب معدنی می‌خواهی: 'I would like a bottle of still mineral water, please.'.",
        targetKeywords: [
          { phrase: "would like", hintFa: "(میل دارم / می‌خواهم)", weight: 30 },
          { phrase: "mineral water", hintFa: "(آب معدنی)", weight: 35 },
        ],
        idealVoiceResponseEn: "I would like a bottle of still mineral water, please.",
        fallbackChoices: [
          "I would like a bottle of still mineral water, please.",
          "Give water bottle now.",
          "Drink cold water please.",
        ],
        aefReference: "AEF 2 Unit 4 (Food, Drink and polite requests)",
        requiredToEscape: true,
      },
      {
        id: "obj-a2-2-balcony",
        nameFa: "درب شیشه‌ای بالکن مشرف به باغ",
        nameEn: "Balcony Glass Door to Garden",
        icon: "🚪",
        coordinates: { xPct: 85, yPct: 45 },
        unlockedItemIcon: "🌿",
        unlockedItemNameFa: "خروج به باغ آرام هتل",
        speakerPromptEn: "CONCIERGE: We moved you to suite 514 facing the garden! How does that sound?",
        speakerRoleFa: "مسئول تشریفات هتل",
        taskInstructionFa: "بگو عالی به نظر می‌رسد و تشکر کن: 'That sounds fantastic! Thank you for your assistance.'.",
        targetKeywords: [
          { phrase: "sounds fantastic", hintFa: "(فوق‌العاده به نظر می‌رسد)", weight: 35 },
          { phrase: "for your assistance", hintFa: "(برای کمک و پیگیریتون)", weight: 30 },
        ],
        idealVoiceResponseEn: "That sounds fantastic! Thank you for your assistance.",
        fallbackChoices: [
          "That sounds fantastic! Thank you for your assistance.",
          "Good sound I go garden.",
          "Thanks for room move.",
        ],
        aefReference: "AEF 2 Unit 3 (Agreeing & enthusiastic responses)",
        requiredToEscape: true,
      },
    ],
  },
];

// ============================================================================
// B1 & B2 ESCAPE ROOMS: SPY SURVEILLANCE VAN & WIRETAP (AEF 3 & 4)
// ============================================================================
export const B1_ESCAPE_ROOMS: EscapeRoomStage[] = [
  {
    levelNumber: 1,
    cefr: "B1",
    titleFa: "فرار از ون شنود جاسوسی در برلین",
    titleEn: "The Berlin Surveillance Van Wiretap",
    storyIntroFa: "در ون جاسوسی مخفی هستی. سیگنال مکالمه مشکوک دو متهم در هتل را شنود کن، وضعیت را به فرمانده با بیسیم گزارش بده و قبل از ردیابی فرار کن!",
    roomTheme: "safehouse",
    archetype: "wiretap-spy-van",
    escapeTimeLimitSeconds: 70,
    targetGhostTimeSeconds: 46,
    ghostRivalName: "شایان رستمی",
    ghostRivalAvatar: "🕵️‍♂️",
    aefBookAndUnit: "AEF 3 Unit 2 (Transport, travel delays & reporting problems)",
    objects: [
      {
        id: "obj-b1-1-tape",
        nameFa: "دستگاه ضبط نوار رادیویی",
        nameEn: "Reel-to-Reel Tape Wiretap",
        icon: "📻",
        coordinates: { xPct: 25, yPct: 45 },
        unlockedItemIcon: "📼",
        unlockedItemNameFa: "نوار شنود مکالمه فرودگاه",
        speakerPromptEn: "INTERCEPTED AUDIO: '...The flight was grounded due to unexpected engine complications, so we are rerouting the courier via Frankfurt...'",
        speakerRoleFa: "شنود فرکانس دشمن",
        taskInstructionFa: "علت تاخیر را با عبارت 'The flight was delayed due to technical difficulties' خلاصه کن.",
        targetKeywords: [
          { phrase: "delayed due to", hintFa: "(به دلیلِ... به تعویق افتاد)", weight: 35 },
          { phrase: "technical difficulties", hintFa: "(مشکلات و نقص‌های فنی)", weight: 35 },
        ],
        idealVoiceResponseEn: "The flight was delayed due to technical difficulties with the engine.",
        fallbackChoices: [
          "The flight was delayed due to technical difficulties with the engine.",
          "Plane not fly because engine broken.",
          "They wait in airport for plane.",
        ],
        aefReference: "AEF 3 Unit 2A (Air travel problems & narrative tenses)",
        requiredToEscape: true,
      },
      {
        id: "obj-b1-1-walkie",
        nameFa: "بیسیم تاکتیکی فرماندهی",
        nameEn: "Tactical Walkie-Talkie Intercom",
        icon: "🎙️",
        coordinates: { xPct: 55, yPct: 58 },
        unlockedItemIcon: "🗺️",
        unlockedItemNameFa: "نقشه فرار از محاصره",
        speakerPromptEn: "HANDLER (STATIC): 'Agent, HQ here. What alternative rerouting options do they have? Over!'",
        speakerRoleFa: "فرمانده عملیات در بیسیم",
        taskInstructionFa: "دکمه بیسیم را فشار بده و بگو: 'They are rerouting via Frankfurt to catch a connecting flight. Over!'.",
        targetKeywords: [
          { phrase: "rerouting via", hintFa: "(تغییر مسیر از طریقِ...)", weight: 35 },
          { phrase: "connecting flight", hintFa: "(پرواز اتصالی)", weight: 30 },
        ],
        idealVoiceResponseEn: "They are rerouting via Frankfurt to catch a connecting flight. Over!",
        fallbackChoices: [
          "They are rerouting via Frankfurt to catch a connecting flight. Over!",
          "They go Frankfurt with another plane. Over!",
          "Courier change airplane now.",
        ],
        aefReference: "AEF 3 Unit 2B (Connecting flights & travel transitions)",
        requiredToEscape: true,
      },
      {
        id: "obj-b1-1-hatch",
        nameFa: "دریچه خروج اضطراری کف ون",
        nameEn: "Subfloor Escape Hatch",
        icon: "🚨",
        coordinates: { xPct: 82, yPct: 52 },
        unlockedItemIcon: "⚡",
        unlockedItemNameFa: "فرار موفق قبل از ردیابی",
        speakerPromptEn: "HANDLER (STATIC): 'Signal trace incoming in fifteen seconds! State clearance code to pop the hatch!'",
        speakerRoleFa: "فرمانده عملیات در بیسیم",
        taskInstructionFa: "کد خروج را بگو: 'Mission accomplished, sorting this out immediately, signing off!'.",
        targetKeywords: [
          { phrase: "Mission accomplished", hintFa: "(مأموریت با موفقیت انجام شد)", weight: 35 },
          { phrase: "sorting this out", hintFa: "(سروسامان دادن به موضوع)", weight: 35 },
        ],
        idealVoiceResponseEn: "Mission accomplished, sorting this out immediately, signing off!",
        fallbackChoices: [
          "Mission accomplished, sorting this out immediately, signing off!",
          "I open hatch and jump out now.",
          "Van open door bye.",
        ],
        aefReference: "AEF 3 Unit 3 (Phrasal verbs like sort out, sign off)",
        requiredToEscape: true,
      },
    ],
  },
  {
    levelNumber: 2,
    cefr: "B1",
    titleFa: "فرار از اتاق کنفرانس پروژه‌ای در زوریخ",
    titleEn: "Zurich Sprint Room Deadlock Escape",
    storyIntroFa: "تیم مهندسی بر سر دیتابیس قدیمی به بن‌بست خورده و در جلسه قفل شده است! با استدلال فنی مؤدبانه راهکار ارائه بده تا جلسه به توافق برسد و قفل در باز شود.",
    roomTheme: "server-room",
    archetype: "wiretap-spy-van",
    escapeTimeLimitSeconds: 70,
    targetGhostTimeSeconds: 47,
    ghostRivalName: "یاسمین صبور",
    ghostRivalAvatar: "💻",
    aefBookAndUnit: "AEF 3 Unit 4 (Polite disagreement, conditionals & technology)",
    objects: [
      {
        id: "obj-b1-2-screen",
        nameFa: "مانیتور نمایش معماری نرم‌افزار",
        nameEn: "Architecture Screen Terminal",
        icon: "💻",
        coordinates: { xPct: 25, yPct: 40 },
        unlockedItemIcon: "📊",
        unlockedItemNameFa: "گزارش تست عملکرد سرور",
        speakerPromptEn: "SENIOR LEAD: Relational databases worked for ten years. Why abandon what is already familiar?",
        speakerRoleFa: "توسعه‌دهنده ارشد سنتی",
        taskInstructionFa: "با فرمول مؤدبانه بگو: 'I see your point, but modern databases handle concurrency much better.'.",
        targetKeywords: [
          { phrase: "I see your point", hintFa: "(نظرت رو کاملاً درک می‌کنم، اما...)", weight: 35 },
          { phrase: "concurrency", hintFa: "(هم‌روندی و پردازش همزمان)", weight: 30 },
        ],
        idealVoiceResponseEn: "I see your point, but modern databases handle concurrency much better under high load.",
        fallbackChoices: [
          "I see your point, but modern databases handle concurrency much better under high load.",
          "Old database is too slow throw it away.",
          "No I disagree we need new thing.",
        ],
        aefReference: "AEF 3 Unit 4A (Polite opinions with 'I see your point, but...')",
        requiredToEscape: true,
      },
      {
        id: "obj-b1-2-whiteboard",
        nameFa: "وایت‌برد هزینه‌ها و بدهی فنی",
        nameEn: "Sprint Whiteboard Matrix",
        icon: "📋",
        coordinates: { xPct: 55, yPct: 42 },
        unlockedItemIcon: "💡",
        unlockedItemNameFa: "راهکار توافقی اسپرینت",
        speakerPromptEn: "SENIOR LEAD: Migrating now will delay our release by two weeks! Who justifies that cost?",
        speakerRoleFa: "توسعه‌دهنده ارشد سنتی",
        taskInstructionFa: "دفاع کن: 'Taking the time now will prevent massive technical debt later on.'.",
        targetKeywords: [
          { phrase: "technical debt", hintFa: "(بدهی و زیان فنی آینده)", weight: 40 },
          { phrase: "prevent massive", hintFa: "(جلوگیری از زیان‌های سنگین)", weight: 25 },
        ],
        idealVoiceResponseEn: "Taking the time now will prevent massive technical debt later on.",
        fallbackChoices: [
          "Taking the time now will prevent massive technical debt later on.",
          "Two weeks delay is better than broken code later.",
          "We must fix code now.",
        ],
        aefReference: "AEF 3 Unit 5B (Conditionals & long-term consequences)",
        requiredToEscape: true,
      },
      {
        id: "obj-b1-2-exitlock",
        nameFa: "دستگیره بیومتریک درب خروج",
        nameEn: "Biometric Consensus Door Latch",
        icon: "🚪",
        coordinates: { xPct: 84, yPct: 50 },
        unlockedItemIcon: "🤝",
        unlockedItemNameFa: "خروج با توافق کامل تیم",
        speakerPromptEn: "TEAM SPONSOR: We need a sensible compromise before unlocking the conference room!",
        speakerRoleFa: "اسپانسر پروژه",
        taskInstructionFa: "توافق منطقی پیشنهاد بده: 'Let us adopt a sensible compromise and run benchmark tests today.'.",
        targetKeywords: [
          { phrase: "sensible compromise", hintFa: "(سازش و توافق منطقی و معقول)", weight: 40 },
          { phrase: "run benchmark tests", hintFa: "(اجرای آزمون‌های سنجش عملکرد)", weight: 30 },
        ],
        idealVoiceResponseEn: "Let us adopt a sensible compromise and run benchmark tests today.",
        fallbackChoices: [
          "Let us adopt a sensible compromise and run benchmark tests today.",
          "We test together and open door.",
          "Compromise is good let us leave.",
        ],
        aefReference: "AEF 3 Unit 6 (Professional negotiations & compromise)",
        requiredToEscape: true,
      },
    ],
  },
];

// ============================================================================
// C1 & C2 ESCAPE ROOMS: HIGH-SECURITY BLAST DOORS & INTERROGATION (AEF 5)
// ============================================================================
export const C1_ESCAPE_ROOMS: EscapeRoomStage[] = [
  {
    levelNumber: 1,
    cefr: "C1",
    titleFa: "نفوذ به گاوصندوق فوق‌امنیتی بانک مرکزی در زوریخ",
    titleEn: "Swiss Central Bank Vault Infiltration",
    storyIntroFa: "در راهروی لیزری منتهی به گاوصندوق مرکزی گیر افتاده‌ای! هوش مصنوعی امنیتی و نگهبان ارشد از پشت درب فولادی تو را استنطاق می‌کنند. با زبان فاخر و ادله دیپلماتیک سوءظن را به زیر ۲۰٪ برسان تا درب باز شود!",
    roomTheme: "vault",
    archetype: "high-security-vault",
    escapeTimeLimitSeconds: 75,
    targetGhostTimeSeconds: 50,
    ghostRivalName: "کیمیا رحمانی",
    ghostRivalAvatar: "🏛️",
    aefBookAndUnit: "AEF 5 Unit 1-2 (Discourse Markers, Inversions & Rhetorical Persuasion)",
    objects: [
      {
        id: "obj-c1-1-scanner",
        nameFa: "اسکنر شبکیه و سنسور لیزری",
        nameEn: "AI Retinal Biometric Console",
        icon: "🤖",
        coordinates: { xPct: 24, yPct: 40 },
        unlockedItemIcon: "👁️",
        unlockedItemNameFa: "تأیید هویت دیپلماتیک",
        speakerPromptEn: "SECURITY AI: 'Unidentified operative detected! Why should this vault not trigger lethal lockdown countermeasures?'",
        speakerRoleFa: "هوش مصنوعی امنیتی گاوصندوق",
        taskInstructionFa: "با استدلال قاطع اتهام را رد کن: 'I unequivocally reject the premise of unauthorized intrusion; I am conducting an emergency forensic audit.'.",
        targetKeywords: [
          { phrase: "unequivocally reject the premise", hintFa: "(قاطعانه فرض و اتهام مطرح‌شده را رد می‌کنم)", weight: 45 },
          { phrase: "forensic audit", hintFa: "(حسابرسی مستقل قانونی-فنی)", weight: 35 },
        ],
        idealVoiceResponseEn: "I unequivocally reject the premise of unauthorized intrusion; I am conducting an emergency forensic audit.",
        fallbackChoices: [
          "I unequivocally reject the premise of unauthorized intrusion; I am conducting an emergency forensic audit.",
          "Do not shoot me, I am an auditor with legal papers.",
          "I am allowed to be here check my files.",
        ],
        aefReference: "AEF 5 Unit 1A (High-register formal discourse & refutations)",
        requiredToEscape: true,
      },
      {
        id: "obj-c1-1-intercom",
        nameFa: "اسپیکر استنطاق نگهبان ارشد",
        nameEn: "Vault Intercom Interrogation Speaker",
        icon: "🔊",
        coordinates: { xPct: 54, yPct: 52 },
        unlockedItemIcon: "📊",
        unlockedItemNameFa: "کاهش سوءظن نگهبان به ۱۵٪",
        speakerPromptEn: "CHIEF GUARDIAN: 'Our market telemetry indicated severe volatility prior to your arrival! Explain this correlation!'",
        speakerRoleFa: "سرپرست نگهبانان گاوصندوق",
        taskInstructionFa: "پاسخ حرفه‌ای بده: 'Market sentiment fluctuates in the wake of incomplete disclosures; empirical verification will anchor certainty.'.",
        targetKeywords: [
          { phrase: "Market sentiment fluctuates", hintFa: "(احساسات بازار دچار نوسان موقت می‌شود)", weight: 40 },
          { phrase: "empirical verification", hintFa: "(راستی‌آزمایی و اثبات عینی)", weight: 40 },
        ],
        idealVoiceResponseEn: "Market sentiment fluctuates in the wake of incomplete disclosures; empirical verification will anchor certainty.",
        fallbackChoices: [
          "Market sentiment fluctuates in the wake of incomplete disclosures; empirical verification will anchor certainty.",
          "Stock panic happens because rumors, real audit will prove truth.",
          "Numbers move up and down all the time relax.",
        ],
        aefReference: "AEF 5 Unit 2B (Advanced vocabulary of economics & logic)",
        requiredToEscape: true,
      },
      {
        id: "obj-c1-1-blastdoor",
        nameFa: "درب فولادی ضد انفجار (Blast Door)",
        nameEn: "Titanium Blast Vault Door",
        icon: "🚪",
        coordinates: { xPct: 84, yPct: 42 },
        unlockedItemIcon: "👑",
        unlockedItemNameFa: "فرار تاریخی و باز شدن گاوصندوق",
        speakerPromptEn: "VAULT SYSTEM: 'Suspicion lowered to fifteen percent! State your final clearance thesis to release the titanium locks!'",
        speakerRoleFa: "سیستم کنترل هیدرولیک درب",
        taskInstructionFa: "جمله باشکوه پایانی را ادا کن: 'Transparency is the bedrock of enduring stability; disarm all locks post-haste!'.",
        targetKeywords: [
          { phrase: "bedrock of enduring stability", hintFa: "(سنگ‌بنای ثبات و اعتماد پایدار)", weight: 45 },
          { phrase: "post-haste", hintFa: "(بدون اتلاف وقت و با حداکثر سرعت)", weight: 35 },
        ],
        idealVoiceResponseEn: "Transparency is the bedrock of enduring stability; disarm all locks post-haste!",
        fallbackChoices: [
          "Transparency is the bedrock of enduring stability; disarm all locks post-haste!",
          "Open the door fast because everything is legal.",
          "Access granted open titanium door now.",
        ],
        aefReference: "AEF 5 Unit 4 (Rhetorical eloquence and archaic/formal adverbs)",
        requiredToEscape: true,
      },
    ],
  },
  {
    levelNumber: 2,
    cefr: "C1",
    titleFa: "فرار از بازداشتگاه دیپلماتیک دادگاه بین‌المللی",
    titleEn: "International Courtroom Detainment Escape",
    storyIntroFa: "در اتاق قرنطینه دادگاه لاهه محبوس شده‌ای. قاضی تحقیق و نگهبان دادگاه به اعتبار اسناد شما شک دارند. تناقضات شهادت را آشکار کن تا تبرئه شوی و از درب خارج شوی!",
    roomTheme: "courtroom",
    archetype: "high-security-vault",
    escapeTimeLimitSeconds: 75,
    targetGhostTimeSeconds: 49,
    ghostRivalName: "روژان پاکزاد",
    ghostRivalAvatar: "⚖️",
    aefBookAndUnit: "AEF 5 Unit 3 (Law, Justice & Courtroom Cross-examination)",
    objects: [
      {
        id: "obj-c1-2-dossier",
        nameFa: "پرونده سوگندخورده متناقض",
        nameEn: "Sworn Deposition Dossier",
        icon: "📁",
        coordinates: { xPct: 25, yPct: 54 },
        unlockedItemIcon: "📜",
        unlockedItemNameFa: "سند اثبات تناقض شاهد",
        speakerPromptEn: "INVESTIGATOR: 'The eyewitness swears they observed you holding the contraband beyond reasonable doubt!'",
        speakerRoleFa: "قاضی تحقیق دادگاه",
        taskInstructionFa: "تناقض را بکوب: 'In their sworn deposition, they attested that torrential rain obscured their visibility completely.'.",
        targetKeywords: [
          { phrase: "sworn deposition", hintFa: "(شهادت‌نامه رسمی سوگندخورده)", weight: 40 },
          { phrase: "obscured their visibility", hintFa: "(دید آن‌ها را کاملاً مسدود و کدر کرده بود)", weight: 40 },
        ],
        idealVoiceResponseEn: "In their sworn deposition, they attested that torrential rain obscured their visibility completely.",
        fallbackChoices: [
          "In their sworn deposition, they attested that torrential rain obscured their visibility completely.",
          "Witness lied because it was heavy dark rain.",
          "The witness could not see anything five meters away.",
        ],
        aefReference: "AEF 5 Unit 3A (Legal discourse & cross-examination)",
        requiredToEscape: true,
      },
      {
        id: "obj-c1-2-gavel",
        nameFa: "چکش بازرسی قاضی دادگاه",
        nameEn: "Chief Justice Intercom Gavel",
        icon: "⚖️",
        coordinates: { xPct: 55, yPct: 40 },
        unlockedItemIcon: "🎖️",
        unlockedItemNameFa: "حکم برائت قانونی",
        speakerPromptEn: "JUDGE: 'Does counsel contend that this evidence fails the evidentiary threshold of the court?'",
        speakerRoleFa: "رئیس دیوان دادگاه",
        taskInstructionFa: "با اصطلاح حقوقی بگو: 'Precisely, Your Honor; the prosecution cannot sustain its burden of proof.'.",
        targetKeywords: [
          { phrase: "Your Honor", hintFa: "(عالیجناب / جناب قاضی)", weight: 30 },
          { phrase: "burden of proof", hintFa: "(بار اثبات دعوی بر عهده دادستان)", weight: 45 },
        ],
        idealVoiceResponseEn: "Precisely, Your Honor; the prosecution cannot sustain its burden of proof.",
        fallbackChoices: [
          "Precisely, Your Honor; the prosecution cannot sustain its burden of proof.",
          "Yes Judge, they have zero proof against me.",
          "The law says you must let me go free.",
        ],
        aefReference: "AEF 5 Unit 3B (Formal court etiquette and courtroom jargon)",
        requiredToEscape: true,
      },
      {
        id: "obj-c1-2-courtdoor",
        nameFa: "درب چوبی بزرگ سالن اصلی دادگاه",
        nameEn: "Oak Courtroom Grand Portal",
        icon: "🚪",
        coordinates: { xPct: 85, yPct: 44 },
        unlockedItemIcon: "🕊️",
        unlockedItemNameFa: "آزادی کامل و خروج سرافرازانه",
        speakerPromptEn: "CHIEF JUSTICE: 'The court orders immediate release! Deliver your closing statement to the assembly!'",
        speakerRoleFa: "رئیس دیوان دادگاه",
        taskInstructionFa: "جمله آزادگی را با طنین بگو: 'Justice thrives on accountability, not courtroom theater. I rest my case!'.",
        targetKeywords: [
          { phrase: "Justice thrives on accountability", hintFa: "(عدالت بر پایه پاسخگویی شکوفا می‌شود)", weight: 45 },
          { phrase: "I rest my case", hintFa: "(دفاع من تمام است و پرونده بسته شد)", weight: 40 },
        ],
        idealVoiceResponseEn: "Justice thrives on accountability, not courtroom theater. I rest my case!",
        fallbackChoices: [
          "Justice thrives on accountability, not courtroom theater. I rest my case!",
          "Thank you Court, I am innocent goodbye.",
          "Release me now case is closed.",
        ],
        aefReference: "AEF 5 Unit 3 (Classic American courtroom rhetorical closings)",
        requiredToEscape: true,
      },
    ],
  },
];

// Combine all tiers for easy retrieval
export const ESCAPE_ROOMS_BY_TIER: Record<CefrLevel, EscapeRoomStage[]> = {
  A1: A1_ESCAPE_ROOMS,
  A2: A2_ESCAPE_ROOMS,
  B1: B1_ESCAPE_ROOMS,
  B2: B1_ESCAPE_ROOMS, // shares rich B1/B2 wiretap curriculum
  C1: C1_ESCAPE_ROOMS,
  C2: C1_ESCAPE_ROOMS, // shares rich C1/C2 high-security infiltration curriculum
};

export function getEscapeRoomStage(cefr: CefrLevel, levelNum: number): EscapeRoomStage {
  const list = ESCAPE_ROOMS_BY_TIER[cefr] || A1_ESCAPE_ROOMS;
  const found = list.find((s) => s.levelNumber === levelNum);
  if (found) return found;
  // If stage number exceeds curated list, adapt cycle smoothly
  const fallback = list[(levelNum - 1) % list.length];
  return {
    ...fallback,
    levelNumber: levelNum,
  };
}
