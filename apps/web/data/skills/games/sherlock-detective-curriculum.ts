import type { CefrLevel } from "./types";

export interface CutsceneDialogue {
  speakerId: "white" | "sherlock" | "aunt" | "flower_seller" | "driver" | "clerk" | "guard" | "henchman" | "lily" | "watson" | "moriarty" | "judge" | "lestrade";
  speakerNameFa: string;
  speakerRoleFa: string;
  speakerAvatar: string;
  textEn: string;
  textFa: string;
  bubblePosition: "left" | "right" | "center";
}

export interface CutsceneScene {
  titleFa: string;
  titleEn: string;
  imageSrc: string;
  dialogues: CutsceneDialogue[];
}

export interface DetectiveDecisionChoice {
  id: string;
  labelEn: string;
  labelFa: string;
  descriptionFa: string;
  pointsDelta: number;
}

export interface DetectiveDecisionPoint {
  id: string;
  promptFa: string;
  promptEn: string;
  choices: [DetectiveDecisionChoice, DetectiveDecisionChoice];
}

export interface DetectiveTargetKeyword {
  phrase: string;
  hintFa: string;
  synonyms: string[];
  weight: number;
}

export interface DetectiveSpeakingTask {
  id: string;
  titleFa: string;
  speakerPromptEn: string;
  speakerPromptFa: string; // Persian translation for the translation toggle button!
  speakerRoleFa: string;
  speakerAvatar: string;
  taskInstructionFa: string;
  targetKeywords: DetectiveTargetKeyword[];
  idealVoiceResponseEn: string;
  alternativeResponsesEn: Array<{
    phraseEn: string;
    translationFa: string;
  }>;
  whiteHintFa: string; // Friendly colloquial guidance from Detective White in A1
  fallbackChoices: string[]; // Hidden initially! Only revealed on mistake
  aefReference: string;
  npcResponse?: DetectiveNpcResponse; // Live NPC response answering Sherlock's line!
}

export interface DetectiveNpcResponse {
  speakerNameFa: string;
  speakerRoleFa: string;
  speakerAvatar: string;
  textEn: string;
  textFa: string;
}

export interface DetectiveStageBranchVariant {
  conditionChoiceId: string; // Matches previous decision choice ID, e.g. "choice-3b"
  titleFa?: string;
  titleEn?: string;
  locationFa?: string;
  locationEn?: string;
  storyIntroFa?: string;
  cutscene?: CutsceneScene;
  decisionPoint?: DetectiveDecisionPoint;
  tasks: DetectiveSpeakingTask[];
}

export interface DetectiveStageEnding {
  endingType: "ending-1-vault-trap" | "ending-2-girl-rescue" | "ending-1-case-solved" | "ending-2-case-failed";
  titleFa: string;
  titleEn: string;
  badgeTitleFa: string;
  imageSrc: string;
  climaxStoryFa: string;
  climaxStoryEn: string;
  revealDialogueEn: string;
  revealDialogueFa: string;
  nextTierHintFa: string;
}

export interface DetectiveStage {
  levelNumber: number; // 1 to 10
  cefr: CefrLevel;
  titleFa: string;
  titleEn: string;
  locationFa: string;
  locationEn: string;
  storyIntroFa: string;
  cutscene: CutsceneScene;
  decisionPoint?: DetectiveDecisionPoint;
  tasks: DetectiveSpeakingTask[];
  branchVariants?: DetectiveStageBranchVariant[]; // Branching paths depending on previous decisions!
  possibleEndings?: {
    ending1: DetectiveStageEnding;
    ending2: DetectiveStageEnding;
  };
}

// ============================================================================
// CEFR A1 CASE: "THE DISAPPEARANCE OF LILY" (پرونده نجات دخترک گمشده در لندن)
// Official CEFR A1 Vocabulary & Grammar: Where, Who, What, Can/Could, Present Simple,
// Prepositions, Everyday Descriptors, Polite Greetings.
// ============================================================================

export const A1_SHERLOCK_CASE: DetectiveStage[] = [
  // --------------------------------------------------------------------------
  // STAGE 1: زنگ خطر در خیابان بیکر (The Baker Street Summons)
  // --------------------------------------------------------------------------
  {
    levelNumber: 1,
    cefr: "A1",
    titleFa: "احضار فوری در خیابان بیکر: آغاز پرونده",
    titleEn: "The Baker Street Summons: Case Inception",
    locationFa: "دفتر کارآگاهی شرلوک هلمز، خیابان بیکر، لندن ۱۸۹۳",
    locationEn: "Sherlock Holmes's Study, Baker Street, London",
    storyIntroFa: "صدای رعدوبرق با شتاب درهای چوبی طبقه پایین را می‌لرزاند. کارآگاه جوانی با کلاه سیلندر خیس و بارانی تیره وارد اتاق می‌شود.",
    cutscene: {
      titleFa: "ملاقات کارآگاه وایت با شرلوک هلمز در خیابان بیکر",
      titleEn: "Detective White Enters Baker Street",
      imageSrc: "/images/skills/speaking/sherlock_stage1_baker_street.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Hello Detective Holmes! I am Detective White from Scotland Yard. A few hours ago, an orphan girl was kidnapped in King's Cross, and we need your help.",
          textFa: "سلام کارآگاه هلمز! من کارآگاه وایت از اسکاتلندیارد هستم. چند ساعت پیش دختربچه یتیمی در کینگزکراس ربوده شده و ما به هوش و کمک شما نیاز داریم.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "Ah, Detective White! I have heard of you. I thought you were older.",
          textFa: "آها کارآگاه وایت! در مورد شما شنیده‌ام، فکر می‌کردم مسن‌تر باشید.",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "London is in the shadow of a ruthless criminal, Holmes. I need your help.",
          textFa: "هلمز، لندن زیر سایه جنایتکاری بی‌رحم است، به کمکت نیاز دارم.",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-1-girl-name",
        titleFa: "پرسیدن نام دخترک ربوده‌شده",
        speakerPromptEn: "A cruel shadow hangs over London tonight...",
        speakerPromptFa: "سایه‌ای بی‌رحم امشب بر فراز لندن سایه افکنده است...",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "از کارآگاه وایت بپرس: «نام دخترک چیست؟»",
        targetKeywords: [
          { phrase: "What is", hintFa: "(چیست)", synonyms: ["what is", "what's", "tell me"], weight: 50 },
          { phrase: "the girl's name", hintFa: "(نام دخترک)", synonyms: ["the girl's name", "her name", "the name"], weight: 50 },
        ],
        idealVoiceResponseEn: "What is the girl's name?",
        alternativeResponsesEn: [
          { phraseEn: "Can you tell me, what is the girl's name?", translationFa: "می‌توانید به من بگویید، نام دخترک چیست؟" },
          { phraseEn: "What is her name, Detective White?", translationFa: "نام او چیست، کارآگاه وایت؟" },
        ],
        whiteHintFa: "راحت و روان شروع کن شرلوک! با عبارت ساده What is the girl's name نامش رو بپرس. دوباره امتحان کن!",
        fallbackChoices: [
          "What is the girl's name?",
          "I have a cold tea in my cup.",
          "Girl is running fast today.",
        ],
        aefReference: "AEF 1 Unit 1A (What is... questions & names)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Her name is Lily Clarke. She is eight years old, and she lived with her aunt after her parents died.",
          textFa: "نام او لیلی کلارک است، هشت سال دارد و بعد از فوت والدینش با خاله‌اش زندگی می‌کرد.",
        },
      },
      {
        id: "task-a1-1-kidnap-location",
        titleFa: "پرسیدن محل ربوده شدن دخترک",
        speakerPromptEn: "We must hurry before the rain washes away all the evidence...",
        speakerPromptFa: "باید عجله کنیم قبل از اینکه باران تمام شواهد را بشوید...",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "از وایت بپرس دخترک از کجا ربوده شد: «او از کجا دزدیده شد؟»",
        targetKeywords: [
          { phrase: "Where was", hintFa: "(کجا بود)", synonyms: ["where was", "where did", "where"], weight: 50 },
          { phrase: "kidnapped from", hintFa: "(ربوده شده از)", synonyms: ["kidnapped from", "taken from", "stolen from"], weight: 50 },
        ],
        idealVoiceResponseEn: "Where was she kidnapped from?",
        alternativeResponsesEn: [
          { phraseEn: "Where was she taken from, Inspector?", translationFa: "او از کجا ربوده شد، بازرس؟" },
          { phraseEn: "Where did they kidnap the girl from?", translationFa: "آن‌ها دخترک را از کجا دزدیدند؟" },
        ],
        whiteHintFa: "دقتت بالاست شرلوک! از کلمه پرسشی Where was she kidnapped from استفاده کن تا موقعیت صحنه جرم مشخص بشه. دوباره امتحان کن!",
        fallbackChoices: [
          "Where was she kidnapped from?",
          "Where is my black umbrella tonight?",
          "She is sleeping in the bed.",
        ],
        aefReference: "AEF 1 Unit 2A (Where was... questions)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "She was kidnapped from her upstairs bedroom near King's Cross. Let us go there at once!",
          textFa: "او از اتاق خوابش در طبقه بالا در نزدیکی کینگزکراس ربوده شده است. بیایید فوراً به آنجا برویم!",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 2: اتاق خواب خالی دخترک (The Empty Bedroom)
  // --------------------------------------------------------------------------
  {
    levelNumber: 2,
    cefr: "A1",
    titleFa: "صحنه جرم: اتاق خواب خالی لیلی در کینگز کراس",
    titleEn: "Crime Scene: The Empty Bedroom",
    locationFa: "خانه خاله لیلی، خیابان کینگز کراس، لندن",
    locationEn: "Aunt's House, King's Cross, London",
    storyIntroFa: "خانه خاله کلارک، پنجره باز رو به باد و باران، پارکت خیس و خاله گریان روی صندلی راحتی نشسته است.",
    cutscene: {
      titleFa: "اتاق خواب خالی در کینگزکراس",
      titleEn: "The Empty Bedroom at Midnight",
      imageSrc: "/images/skills/speaking/sherlock_stage2_empty_bedroom.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "The window was left open to the alley, and rain marks stretch across the wooden floor.",
          textFa: "پنجره رو به کوچه باز مانده و رد باران روی پارکت کف اتاق کشیده شده است.",
          bubblePosition: "right",
        },
        {
          speakerId: "aunt",
          speakerNameFa: "خاله کلارک",
          speakerRoleFa: "خاله لیلی",
          speakerAvatar: "👵",
          textEn: "Gentlemen... my little niece Lily is gone! Her room was empty at midnight!",
          textFa: "آقایان... خواهرزاده کوچکم لیلی غیبش زده! اتاقش در نیمه‌شب خالی بود!",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-2-disappearance-time",
        titleFa: "پرسیدن زمان ناپدید شدن لیلی",
        speakerPromptEn: "I heard the clock strike outside in the dark...",
        speakerPromptFa: "صدای زنگ ساعت را در تاریکی شنیدم...",
        speakerRoleFa: "خاله کلارک",
        speakerAvatar: "👵",
        taskInstructionFa: "از خاله بپرس دخترک چه زمانی ناپدید شد: «او چه زمانی ناپدید شد؟»",
        targetKeywords: [
          { phrase: "When did", hintFa: "(چه زمانی)", synonyms: ["when did", "what time did", "when"], weight: 50 },
          { phrase: "she disappear", hintFa: "(ناپدید شد)", synonyms: ["she disappear", "she go", "lily disappear"], weight: 50 },
        ],
        idealVoiceResponseEn: "When did she disappear?",
        alternativeResponsesEn: [
          { phraseEn: "What time did she disappear, please?", translationFa: "چه ساعتی او ناپدید شد، لطفاً؟" },
          { phraseEn: "When did little Lily disappear?", translationFa: "چه زمانی لیلی کوچک ناپدید شد؟" },
        ],
        whiteHintFa: "خیلی مؤدبانه با When did she disappear زمان ناپدید شدنش رو جویا شو شرلوک. دوباره امتحان کن!",
        fallbackChoices: [
          "When did she disappear?",
          "Time is clock fast loud.",
          "I do not hear nothing.",
        ],
        aefReference: "AEF 1 Unit 3B (Past questions with When did...)",
        npcResponse: {
          speakerNameFa: "خاله کلارک",
          speakerRoleFa: "خاله لیلی",
          speakerAvatar: "👵",
          textEn: "Right at midnight, when the heavy rain was falling and the clock struck twelve.",
          textFa: "درست در نیمه‌شب، وقتی صدای تند باران می‌آمد و ساعت دوازده ضربه نواخت.",
        },
      },
      {
        id: "task-a1-2-letter-check",
        titleFa: "پرسیدن درباره یادداشت یا نامه از رباینده",
        speakerPromptEn: "There was a strange mess near the open window...",
        speakerPromptFa: "به‌هم‌ریختگی عجیبی نزدیک پنجره باز دیده می‌شد...",
        speakerRoleFa: "خاله کلارک",
        speakerAvatar: "👵",
        taskInstructionFa: "از خاله بپرس آیا نامه‌ای جا گذاشته‌اند: «آیا آن‌ها نامه‌ای جا گذاشتند؟»",
        targetKeywords: [
          { phrase: "Did they", hintFa: "(آیا آن‌ها)", synonyms: ["did they", "did he", "did the man"], weight: 50 },
          { phrase: "leave a letter", hintFa: "(نامه‌ای گذاشتند)", synonyms: ["leave a letter", "leave a note", "leave any letter"], weight: 50 },
        ],
        idealVoiceResponseEn: "Did they leave a letter?",
        alternativeResponsesEn: [
          { phraseEn: "Did the kidnapper leave a letter or a note?", translationFa: "آیا رباینده نامه یا یادداشتی جا گذاشت؟" },
          { phraseEn: "Did they leave any note on the table?", translationFa: "آیا آن‌ها یادداشتی روی میز گذاشتند؟" },
        ],
        whiteHintFa: "سؤال طلایی رو با Did they leave a letter بپرس تا یادداشت باج‌خواهی رو پیدا کنیم. دوباره امتحان کن!",
        fallbackChoices: [
          "Did they leave a letter?",
          "Letter is red apple table.",
          "Green scarf window open.",
        ],
        aefReference: "AEF 1 Unit 4A (Past simple questions with Did...)",
        npcResponse: {
          speakerNameFa: "خاله کلارک",
          speakerRoleFa: "خاله لیلی",
          speakerAvatar: "👵",
          textEn: "A note that says 'Tick-tock!' Lily's pink doll is missing, and I found this green scarf by the open window! Aha... She is wearing a gold locket",
          textFa: "یه کاغذ که نوشته «تیک تاک!» عروسک صورتی لیلی نیست و این شال‌گردن سبز را کنار پنجره باز پیدا کردم! آها... او یک مدال طلایی به گردن دارد",
        },
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 3: کوچه مه‌آلود و پیرزن گل‌فروش ⭐️ [نقطه تصمیم‌گیری اول]
  // --------------------------------------------------------------------------
  {
    levelNumber: 3,
    cefr: "A1",
    titleFa: "بررسی کوچه مه‌آلود جنایت",
    titleEn: "The Foggy Crime Alley",
    locationFa: "کوچه سنگ‌فرش کینگز کراس، لندن",
    locationEn: "Cobblestone Alleyway, King's Cross",
    storyIntroFa: "مه غلیظی کوچه را فراگرفته. پیرزن گل‌فروشی کنار تیر چراغ گاز نشسته و رد چرخ‌های یک کالسکه سیاه روی گل‌ولای کوچه کشیده شده است.",
    cutscene: {
      titleFa: "بررسی کوچه مه‌آلود جنایت و بازجویی از گل‌فروش",
      titleEn: "Investigating the Foggy Crime Alley",
      imageSrc: "/images/skills/speaking/sherlock_stage3_flower_seller.jpg",
      dialogues: [
        {
          speakerId: "flower_seller",
          speakerNameFa: "خانم هادسون (گل‌فروش)",
          speakerRoleFa: "خانم هادسون (گل‌فروش)",
          speakerAvatar: "💐",
          textEn: "Fresh violets, sir... London streets are cold and quiet tonight.",
          textFa: "بنفشه‌های تازه آقا... خیابان‌های لندن امشب سرد و ساکت است.",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "Good evening. Did you see a tall man and a black carriage?",
          textFa: "عصر بخیر. آیا مردی قدبلند و یک کالسکه سیاه اینجا دیدید؟",
          bubblePosition: "left",
        },
        {
          speakerId: "flower_seller",
          speakerNameFa: "خانم هادسون (گل‌فروش)",
          speakerRoleFa: "خانم هادسون (گل‌فروش)",
          speakerAvatar: "💐",
          textEn: "A suspicious tall man got into a carriage towards the old school! But I am not sure, you know the fog is very thick...",
          textFa: "یک مرد مشکوک قدبلند سوار کالسکه شد به طرف مدرسه قدیمی! ولی مطمئن نیستم، می‌دانید که مه خیلی غلیظ است...",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Look at these deep carriage tracks in the wet mud, Holmes. Where did the carriage go?",
          textFa: "به این رد چرخ‌های عمیق روی گل خیس نگاه کن هلمز. کالسکه به کجا رفته است؟",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-stage-3",
      promptFa: "شرلوک، دو جهت برای بررسی شواهد پیش روی ماست! کدام مسیر را انتخاب می‌کنی؟",
      promptEn: "Sherlock, two investigation paths lie ahead. Which one do you pursue?",
      choices: [
        {
          id: "choice-3a",
          labelEn: "Go to the old school down the alley",
          labelFa: "رفتن به سمت مدرسه قدیمی",
          descriptionFa: "حرکت به سمت مدرسه قدیمی در انتهای کوچه برای بررسی حضور کالسکه",
          pointsDelta: 100,
        },
        {
          id: "choice-3b",
          labelEn: "Examine the carriage wheel marks in the mud",
          labelFa: "بررسی مستقیم رد چرخ‌های کالسکه روی گل‌ولای خیابان",
          descriptionFa: "بررسی رد چرخ‌های تازه کالسکه بر روی سنگ‌فرش خیس کوچه",
          pointsDelta: 150,
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-3-wheel-tracks",
        titleFa: "دستور دنبال کردن رد چرخ‌های کالسکه با کارآگاه وایت",
        speakerPromptEn: "White: 'Look at these deep carriage tracks in the wet mud, Holmes. Where did the carriage go?'",
        speakerPromptFa: "کارآگاه وایت: «به این رد چرخ‌های عمیق روی گل خیس نگاه کن هلمز. کالسکه به کجا رفته است؟»",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "به وایت بگو: «ما باید رد چرخ‌ها را دنبال کنیم!»",
        targetKeywords: [
          { phrase: "We must follow", hintFa: "(ما باید دنبال کنیم)", synonyms: ["we must follow", "follow", "let us follow", "we need to follow"], weight: 50 },
          { phrase: "the wheel tracks", hintFa: "(رد چرخ‌ها)", synonyms: ["the wheel tracks", "the tracks", "wheel tracks", "wheel marks"], weight: 50 },
        ],
        idealVoiceResponseEn: "We must follow the wheel tracks!",
        alternativeResponsesEn: [
          { phraseEn: "We must follow the tracks!", translationFa: "ما باید ردپاها/رد چرخ‌ها را دنبال کنیم!" },
          { phraseEn: "Let us follow the wheel tracks.", translationFa: "بیا رد چرخ‌ها را دنبال کنیم." },
        ],
        whiteHintFa: "خیلی رسا با عبارت We must follow the wheel tracks مسیر رو مشخص کن. دوباره امتحان کن!",
        fallbackChoices: [
          "We must follow the wheel tracks!",
          "I like walking in the cold rain.",
          "The carriage is painted yellow.",
        ],
        aefReference: "AEF 1 Unit 6A (Must + verb: follow)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Good deduction, Holmes! The tracks lead directly to St. Paul's Square. Let's follow them now!",
          textFa: "استنتاج دقیقی بود هلمز! رد چرخ‌ها مستقیماً به میدان سنت پال می‌رسد. بیا فوراً رد آن‌ها را بگیریم!",
        },
      },
    ],
    branchVariants: [
      {
        conditionChoiceId: "choice-3a",
        titleFa: "بررسی مدرسه قدیمی در انتهای کوچه",
        titleEn: "Investigating the Old School",
        locationFa: "حیاط مدرسه قدیمی کینگزکراس، لندن",
        locationEn: "Old School Yard, King's Cross, London",
        storyIntroFa: "شما و کارآگاه وایت به سمت مدرسه قدیمی در انتهای کوچه می‌روید، اما در چوبی ورودی مدرسه با زنجیر و قفل بزرگی بسته است.",
        tasks: [
          {
            id: "task-a1-3-school-question-white",
            titleFa: "پرسش شرلوک از کارآگاه وایت",
            speakerPromptEn: "White: 'The door is locked, we must go back.'\nSherlock: 'Why did you come to me?'",
            speakerPromptFa: "کارآگاه وایت: «در قفل هست، باید برگردیم.»\nشرلوک هلمز: «چرا پیش من آمدی؟»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "به وایت بگو: «مطمئن هستم خودت می‌تونستی از گل‌فروش سؤال بپرسی!»",
            targetKeywords: [
              { phrase: "ask the flower seller", hintFa: "(از گل‌فروش بپرسی)", synonyms: ["ask the flower seller", "ask the woman", "ask the lady"], weight: 50 },
              { phrase: "yourself", hintFa: "(خودت)", synonyms: ["yourself", "you could ask", "you can ask"], weight: 50 },
            ],
            idealVoiceResponseEn: "I am sure you could ask the flower seller yourself!",
            alternativeResponsesEn: [
              { phraseEn: "You can ask the flower seller yourself!", translationFa: "تو خودت می‌توانی از گل‌فروش بپرسی!" },
              { phraseEn: "I am sure you could ask her yourself.", translationFa: "مطمئنم خودت می‌تونستی ازش بپرسی." },
            ],
            whiteHintFa: "خیلی ساده با I am sure you could ask the flower seller yourself بپرس. دوباره امتحان کن!",
            fallbackChoices: [
              "I am sure you could ask the flower seller yourself!",
              "The school is old and big.",
              "Rain is cold tonight.",
            ],
            aefReference: "AEF 1 Unit 5A (Modal verbs: could / can)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "I am a fan of your work, and I wanted to see how you work.",
              textFa: "من از طرفداران تو هستم و می‌خواستم ببینم چطور کار می‌کنی.",
            },
          },
          {
            id: "task-a1-3-school-special",
            titleFa: "پاسخ شرلوک به کارآگاه وایت",
            speakerPromptEn: "White: 'I am a fan of your work, and I wanted to see how you work.'",
            speakerPromptFa: "کارآگاه وایت: «من از طرفداران تو هستم و می‌خواستم ببینم چطور کار می‌کنی.»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "به وایت بگو: «آره من خاص هستم، اما این پرونده آسونه!»",
            targetKeywords: [
              { phrase: "I am special", hintFa: "(من خاص هستم)", synonyms: ["i am special", "yeah i am special", "yes i am special"], weight: 50 },
              { phrase: "this case is easy", hintFa: "(این پرونده آسان است)", synonyms: ["this case is easy", "the case is easy", "easy case"], weight: 50 },
            ],
            idealVoiceResponseEn: "Yeah I am special, but this case is easy.",
            alternativeResponsesEn: [
              { phraseEn: "Yes, I am special, but this case is easy.", translationFa: "بله، من خاص هستم، اما این پرونده آسان است." },
              { phraseEn: "I am special, but this investigation is easy.", translationFa: "من خاص هستم، اما این بررسی آسان است." },
            ],
            whiteHintFa: "با اعتمادبه‌نفس بگو Yeah I am special, but this case is easy. دوباره امتحان کن!",
            fallbackChoices: [
              "Yeah I am special, but this case is easy.",
              "I like drinking hot tea.",
              "London is very big.",
            ],
            aefReference: "AEF 1 Unit 4B (Adjectives: special / easy)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Alright Holmes, we lost forty minutes! Let's return to the alley and follow the wheel tracks.",
              textFa: "بسیار خب هلمز، چهل دقیقه وقت تلف کردیم! بیا به کوچه برگردیم و رد چرخ‌ها را دنبال کنیم.",
            },
          },
          {
            id: "task-a1-3-follow-tracks-after-school",
            titleFa: "دستور دنبال کردن رد چرخ‌های کالسکه",
            speakerPromptEn: "White: 'We are back at the alley, Holmes. Look at the mud near the house!'",
            speakerPromptFa: "کارآگاه وایت: «به کوچه برگشتیم هلمز. به گل‌ولای نزدیک خانه نگاه کن!»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "به وایت بگو: «ما باید رد چرخ‌ها را دنبال کنیم!»",
            targetKeywords: [
              { phrase: "We must follow", hintFa: "(ما باید دنبال کنیم)", synonyms: ["we must follow", "follow", "let us follow", "we need to follow"], weight: 50 },
              { phrase: "the wheel tracks", hintFa: "(رد چرخ‌ها)", synonyms: ["the wheel tracks", "the tracks", "wheel tracks", "wheel marks"], weight: 50 },
            ],
            idealVoiceResponseEn: "We must follow the wheel tracks!",
            alternativeResponsesEn: [
              { phraseEn: "We must follow the tracks!", translationFa: "ما باید ردپاها/رد چرخ‌ها را دنبال کنیم!" },
              { phraseEn: "Let us follow the wheel tracks now.", translationFa: "بیا همین الان رد چرخ‌ها را دنبال کنیم." },
            ],
            whiteHintFa: "ساده و قدرتمند بگو We must follow the wheel tracks. دوباره امتحان کن!",
            fallbackChoices: [
              "We must follow the wheel tracks!",
              "I like walking in the cold rain.",
              "The carriage is painted yellow.",
            ],
            aefReference: "AEF 1 Unit 6A (Must + verb: follow)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Good deduction, Holmes! The tracks lead directly to St. Paul's Square. Let's follow them now!",
              textFa: "استنتاج دقیقی بود هلمز! رد چرخ‌ها مستقیماً به میدان سنت پال می‌رسد. بیا فوراً رد آن‌ها را بگیریم!",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-3b",
        titleFa: "بررسی مستقیم رد چرخ‌های کالسکه",
        titleEn: "Examining Carriage Tracks in Foggy Alley",
        locationFa: "کوچه سنگ‌فرش کینگزکراس، لندن",
        locationEn: "Cobblestone Alley, Kings Cross, London",
        storyIntroFa: "شما مستقیماً به بررسی رد چرخ‌های تازه کالسکه بر روی گل‌ولای سنگ‌فرش می‌پردازید. کارآگاه وایت فانوس را به سمت زمین می‌گیرد.",
        tasks: [
          {
            id: "task-a1-3-wheel-tracks",
            titleFa: "دستور دنبال کردن رد چرخ‌های کالسکه با کارآگاه وایت",
            speakerPromptEn: "White: 'Look at these deep carriage tracks in the wet mud, Holmes. Where did the carriage go?'",
            speakerPromptFa: "کارآگاه وایت: «به این رد چرخ‌های عمیق روی گل خیس نگاه کن هلمز. کالسکه به کجا رفته است؟»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "به وایت بگو: «ما باید رد چرخ‌ها را دنبال کنیم!»",
            targetKeywords: [
              { phrase: "We must follow", hintFa: "(ما باید دنبال کنیم)", synonyms: ["we must follow", "follow", "let us follow", "we need to follow"], weight: 50 },
              { phrase: "the wheel tracks", hintFa: "(رد چرخ‌ها)", synonyms: ["the wheel tracks", "the tracks", "wheel tracks", "wheel marks"], weight: 50 },
            ],
            idealVoiceResponseEn: "We must follow the wheel tracks!",
            alternativeResponsesEn: [
              { phraseEn: "We must follow the tracks!", translationFa: "ما باید ردپاها/رد چرخ‌ها را دنبال کنیم!" },
              { phraseEn: "Let us follow the wheel tracks.", translationFa: "بیا رد چرخ‌ها را دنبال کنیم." },
            ],
            whiteHintFa: "خیلی رسا با عبارت We must follow the wheel tracks مسیر رو مشخص کن. دوباره امتحان کن!",
            fallbackChoices: [
              "We must follow the wheel tracks!",
              "I like walking in the cold rain.",
              "The carriage is painted yellow.",
            ],
            aefReference: "AEF 1 Unit 6A (Must + verb: follow)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Good deduction, Holmes! The tracks lead directly to St. Paul's Square. Let's follow them now!",
              textFa: "استنتاج دقیقی بود هلمز! رد چرخ‌ها مستقیماً به میدان سنت پال می‌رسد. بیا فوراً رد آن‌ها را بگیریم!",
            },
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 4: میدان سنت پال و کالسکه‌چی مظنون (The Black Carriage)
  // --------------------------------------------------------------------------
  {
    levelNumber: 4,
    cefr: "A1",
    titleFa: "میدان سنت پال: بازجویی از کالسکه‌چی شبانه",
    titleEn: "St. Paul's Square: The Midnight Driver",
    locationFa: "میدان کلیسای سنت پال، لندن",
    locationEn: "St. Paul's Cathedral Square, London",
    storyIntroFa: "کالسکه‌ای با دو اسب سیاه زیر سایه برج‌های کلیسای سنت پال متوقف است. راننده کالسکه با دیدن کارآگاهان نگران به نظر می‌رسد.",
    cutscene: {
      titleFa: "مواجهه با راننده کالسکه سیاه زیر باران میدان سنت پال",
      titleEn: "Confronting the Nervous Driver",
      imageSrc: "/images/skills/speaking/sherlock_stage4_carriage_driver.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Look at the horses, Holmes. They are breathing hard. This carriage just arrived.",
          textFa: "به اسب‌ها نگاه کن هلمز. نفس‌نفس می‌زنند. این کالسکه تازه رسیده است.",
          bubblePosition: "right",
        },
        {
          speakerId: "driver",
          speakerNameFa: "تام (کالسکه‌چی)",
          speakerRoleFa: "راننده کالسکه کرایه‌ای",
          speakerAvatar: "🎩",
          textEn: "Good evening sirs. Is there any trouble? I am only resting my horses.",
          textFa: "عصر بخیر آقایان. مشکلی پیش آمده؟ من فقط دارم به اسب‌هایم استراحت می‌دهم.",
          bubblePosition: "left",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "You had a passenger with a young girl. We need to know where you drove them.",
          textFa: "شما مسافری به همراه یک دختربچه داشتید. ما باید بدانیم آنها را کجا بردید.",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-4-destination",
        titleFa: "پرسیدن مقصد مسافر و دخترک از راننده",
        speakerPromptEn: "A gentleman in dark clothes hired my carriage near King's Cross...",
        speakerPromptFa: "آقایی با لباس تیره کالسکه‌ام را نزدیک کینگز کراس کرایه کرد...",
        speakerRoleFa: "تام (کالسکه‌چی)",
        speakerAvatar: "🎩",
        taskInstructionFa: "با قاطعیت بگو: «مرد و دخترک را کجا بردی؟ راستش را بگو!»",
        targetKeywords: [
          { phrase: "Where did you drive", hintFa: "(کجا راندی / بردی)", synonyms: ["where did you drive", "where did you take", "where did they go"], weight: 40 },
          { phrase: "the girl", hintFa: "(دخترک)", synonyms: ["the girl", "the child", "the little girl"], weight: 30 },
          { phrase: "tell me the truth", hintFa: "(راستش را به من بگو)", synonyms: ["tell me the truth", "tell the truth", "truth please"], weight: 30 },
        ],
        idealVoiceResponseEn: "Where did you drive the gentleman and the girl? Tell me the truth!",
        alternativeResponsesEn: [
          { phraseEn: "Where did you take the man and the young girl?", translationFa: "مرد و دخترک جوان را به کجا بردی؟" },
          { phraseEn: "Where did you drive them tonight? Tell the truth please.", translationFa: "امشب آن‌ها را کجا بردی؟ لطفاً حقیقت را بگو." },
          { phraseEn: "Where did you go with the girl?", translationFa: "به همراه دخترک کجا رفتی؟" },
        ],
        whiteHintFa: "حرفه‌ای برخورد کردی شرلوک! از کلمه پرسشی Where did you drive (کجا بردی) استفاده کن تا مقصد رو لو بده. دوباره امتحان کن!",
        fallbackChoices: [
          "Where did you drive the gentleman and the girl? Tell me the truth!",
          "Horses run fast in the morning.",
          "I have two gold coins in my pocket.",
        ],
        aefReference: "AEF 1 Unit 6A (Where did you go / Past simple questions)",
        npcResponse: {
          speakerNameFa: "تام (کالسکه‌چی)",
          speakerRoleFa: "راننده کالسکه کرایه‌ای",
          speakerAvatar: "🎩",
          textEn: "Oh, you must be Sherlock! That man said you would follow him, and he told me to tell you where I drove them: I drove them to Wharf Number Nine near the River Thames! The gentleman paid with a shiny gold coin.",
          textFa: "اوه، تو باید شرلوک باشی! آن مرد گفت که تو به دنبالش می‌آیی و به من گفت بهت بگویم کجا بردمشان: من آن‌ها را به بارانداز شماره ۹ نزدیک رودخانه تایمز بردم! آن آقا با یک سکه طلای براق کرایه داد.",
        },
      },
      {
        id: "task-a1-4-condition",
        titleFa: "پرسیدن از وضعیت روحی دخترک در کالسکه",
        speakerPromptEn: "White: 'How can we trust your words?'\nDriver: 'He asked me to stop near the river docks. The girl was holding a pink doll...'",
        speakerPromptFa: "کارآگاه وایت: «چطور می‌توانیم به حرف‌های تو اعتماد کنیم؟»\nتام (کالسکه‌چی): «او از من خواست نزدیک اسکله‌های رودخانه توقف کنم. دخترک یک عروسک صورتی در دست داشت...»",
        speakerRoleFa: "تام (کالسکه‌چی)",
        speakerAvatar: "🎩",
        taskInstructionFa: "از راننده بپرس: «آیا دخترک گریه می‌کرد؟ او ترسیده بود؟»",
        targetKeywords: [
          { phrase: "Was the girl", hintFa: "(آیا دخترک بود)", synonyms: ["was the girl", "was she", "did she", "did she have a doll"], weight: 35 },
          { phrase: "crying", hintFa: "(گریه می‌کرد)", synonyms: ["crying", "sad", "have a doll"], weight: 35 },
          { phrase: "afraid", hintFa: "(ترسیده / وحشت‌زده)", synonyms: ["afraid", "scared"], weight: 30 },
        ],
        idealVoiceResponseEn: "Was the girl crying? Was she afraid?",
        alternativeResponsesEn: [
          { phraseEn: "Did she have a doll? Was she afraid?", translationFa: "آیا او یک عروسک داشت؟ آیا ترسیده بود؟" },
          { phraseEn: "Was she crying, and was she scared?", translationFa: "آیا او گریه می‌کرد و ترسیده بود؟" },
          { phraseEn: "Did the little girl cry in the carriage?", translationFa: "آیا دختربچه در کالسکه گریه کرد؟" },
        ],
        whiteHintFa: "به‌به شرلوک، با فعل گذشته Was she crying و صفت afraid حال دخترک رو بپرس تا وضعیت رو ارزیابی کنیم. دوباره امتحان کن!",
        fallbackChoices: [
          "Was the girl crying? Was she afraid?",
          "Did she have a doll? Was she afraid?",
          "The carriage is big and black.",
        ],
        aefReference: "AEF 1 Unit 6B (Past simple of TO BE: Was / Were + adjectives)",
        npcResponse: {
          speakerNameFa: "تام (کالسکه‌چی)",
          speakerRoleFa: "راننده کالسکه کرایه‌ای",
          speakerAvatar: "🎩",
          textEn: "Yes, sir! She was crying and holding her pink doll. She said 'I want my aunt!'. The gentleman covered her in a dark blanket as they went into the docks!",
          textFa: "بله آقا! او گریه می‌کرد و عروسک صورتی‌اش را در آغوش داشت. می‌گفت «من خاله‌ام را می‌خواهم!». آن مرد هنگام ورود به اسکله او را با یک پتوی تیره پوشاند!",
        },
      },
    ],
      },

  // --------------------------------------------------------------------------
  // STAGE 5: محوطه کلیسای سنت پال: تردید کارآگاه وایت ⭐️ [نقطه تصمیم‌گیری]
  // --------------------------------------------------------------------------
  {
    levelNumber: 5,
    cefr: "A1",
    titleFa: "محوطه کلیسای سنت پال: تردید کارآگاه وایت",
    titleEn: "Outside St. Paul's: White's Hesitation",
    locationFa: "محوطه بیرونی کلیسای سنت پال، لندن",
    locationEn: "Outside St. Paul's Cathedral, London",
    storyIntroFa: "باران بی‌وقفه می‌بارد و صدای زنگ برج ساعت بلند است. کارآگاه وایت دستش را روی شانه شرلوک می‌گذارد و به رفتن به اسکله بدبین است.",
    cutscene: {
      titleFa: "گفتگو با کارآگاه وایت در محوطه مه‌آلود کلیسا",
      titleEn: "Conversation in the Rainy Churchyard",
      imageSrc: "/images/skills/speaking/sherlock_stage5_st_pauls.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "It is a trap, Holmes! We should not go to the docks. Let us go back and ask more questions.",
          textFa: "این یک تله است، هلمز! نباید به اسکله برویم. بیا برگردیم و سؤالات بیشتری بپرسیم.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "The driver gave us the location. Every minute is important now.",
          textFa: "راننده محل را به ما گفت. الان هر دقیقه اهمیت دارد.",
          bubblePosition: "left",
        },
      ],
    },
    decisionPoint: {
      id: "decision-stage-5",
      promptFa: "دو مسیر پیش روی شماست! کدام جهت را انتخاب می‌کنی؟",
      promptEn: "Detective White urges you to turn back. Which path do you take?",
      choices: [
        {
          id: "choice-5b",
          labelEn: "Go straight to Warehouse Number Nine",
          labelFa: "حرکت مستقیم به سمت انبار شماره ۹",
          descriptionFa: "حرکت به سمت انبار شماره ۹ در اسکله‌های رودخانه تیمز",
          pointsDelta: 150,
        },
        {
          id: "choice-5a",
          labelEn: "Return to check the old school",
          labelFa: "برگشت و بررسی مدرسه قدیمی",
          descriptionFa: "برگشت به کینگزکراس برای بازرسی مجدد ساختمان مدرسه قدیمی",
          pointsDelta: 50,
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-5-reading-code",
        titleFa: "اعلام فوری حرکت به سمت انبار شماره ۹",
        speakerPromptEn: "White: 'Are you sure we should go directly to the river docks?'",
        speakerPromptFa: "کارآگاه وایت: «آیا مطمئنی باید مستقیماً به سمت اسکله‌های رودخانه برویم؟»",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "با قاطعیت به وایت بگو: «دختر در انبار شماره ۹ است! ما باید الان برویم!»",
        targetKeywords: [
          { phrase: "The girl is in", hintFa: "(دختر در ... است)", synonyms: ["the girl is in", "she is in", "lily is in"], weight: 35 },
          { phrase: "warehouse number nine", hintFa: "(انبار شماره ۹)", synonyms: ["warehouse number nine", "warehouse nine", "the warehouse"], weight: 35 },
          { phrase: "We must go now", hintFa: "(باید الان برویم)", synonyms: ["we must go now", "we must go", "let us go now", "let's go now"], weight: 30 },
        ],
        idealVoiceResponseEn: "The girl is in warehouse number nine! We must go now!",
        alternativeResponsesEn: [
          { phraseEn: "She is in warehouse number nine! Let's go now.", translationFa: "او در انبار شماره نه است! بیا همین الان برویم." },
          { phraseEn: "The girl is at warehouse nine. We must hurry!", translationFa: "دختر در انبار نه است. باید عجله کنیم!" },
          { phraseEn: "Lily is in warehouse number nine, we need to go.", translationFa: "لیلی در انبار شماره نه است، ما باید برویم." },
        ],
        whiteHintFa: "آفرین هلمز! از جمله The girl is in warehouse number nine و عبارت We must go now استفاده کن. دوباره امتحان کن!",
        fallbackChoices: [
          "The girl is in warehouse number nine! We must go now!",
          "I have two cats at home.",
          "The river is very cold.",
        ],
        aefReference: "AEF 1 Unit 7B (Must / Need to for urgent action)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Very well, Holmes! Our carriage is ready. Let us go to warehouse number nine!",
          textFa: "بسیار خوب هلمز! کالسکه‌مان آماده است. بیا به انبار شماره نه برویم!",
        },
      },
    ],
    branchVariants: [
      {
        conditionChoiceId: "choice-5a",
        titleFa: "برگشت به مدرسه قدیمی: مواجهه با سرایدار",
        titleEn: "Return to the Old School: The Caretaker",
        locationFa: "حیاط مدرسه قدیمی کینگزکراس، لندن",
        locationEn: "Old School Yard, King's Cross, London",
        storyIntroFa: "شما با کالسکه به طرف مدرسه مخروبه برمی‌گردید. در قفل است. در را باز می‌کنید و ناگهان سرایدار پیر با چراغ‌موشی بیرون می‌آید.",
        cutscene: {
          titleFa: "گفتگو با سرایدار پیر در حیاط مدرسه",
          titleEn: "Questioning the Old Caretaker",
          imageSrc: "/images/skills/speaking/sherlock_stage3_flower_seller.jpg",
          dialogues: [
            {
              speakerId: "guard",
              speakerNameFa: "سرایدار مدرسه",
              speakerRoleFa: "شاهد محلی",
              speakerAvatar: "🗝️",
              textEn: "Who is making noise here at night?!",
              textFa: "چه کسی نصف شب اینجا سر و صدا می‌کند؟! ",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-a1-5-school-caretaker",
            titleFa: "پرسیدن از سرایدار درباره آوردن دخترک",
            speakerPromptEn: "The school is dark and cold, sirs. Nobody is here...",
            speakerPromptFa: "مدرسه تاریک و سرد است آقایان. هیچ‌کس اینجا نیست...",
            speakerRoleFa: "سرایدار مدرسه",
            speakerAvatar: "🗝️",
            taskInstructionFa: "از سرایدار بپرس: «آیا امشب کسی دختربچه‌ای را به این مدرسه آورد؟»",
            targetKeywords: [
              { phrase: "Did anyone bring", hintFa: "(آیا کسی آورد)", synonyms: ["did anyone bring", "did a man bring", "did someone bring"], weight: 40 },
              { phrase: "a little girl", hintFa: "(دختربچه‌ای)", synonyms: ["a little girl", "the girl", "a child"], weight: 35 },
              { phrase: "tonight", hintFa: "(امشب)", synonyms: ["tonight", "here tonight", "to this school"], weight: 25 },
            ],
            idealVoiceResponseEn: "Did anyone bring a little girl to this school tonight?",
            alternativeResponsesEn: [
              { phraseEn: "Did a man bring a little girl here tonight?", translationFa: "آیا مردی امشب دختربچه‌ای را به اینجا آورد؟" },
              { phraseEn: "Did someone bring a girl to the school tonight?", translationFa: "آیا کسی امشب دختری را به مدرسه آورد؟" },
            ],
            whiteHintFa: "خیلی ساده با Did anyone bring a little girl to this school tonight سرنخ رو بپرس. دوباره امتحان کن!",
            fallbackChoices: [
              "Did anyone bring a little girl to this school tonight?",
              "I like school books very much.",
              "Rain is falling outside.",
            ],
            aefReference: "AEF 1 Unit 7A (Past Simple questions with Did...)",
            npcResponse: {
              speakerNameFa: "سرایدار مدرسه",
              speakerRoleFa: "شاهد محلی",
              speakerAvatar: "🗝️",
              textEn: "No, sir! The school was closed. But one hour ago, a man in a black coat dropped a pink ribbon and went to the river!",
              textFa: "خیر قربان! اینجا از عصر تعطیل بوده است. فقط یک ساعت پیش مردی با پالتوی مشکی یک تکه روبان صورتی روی زمین انداخت و به طرف رودخانه رفت!",
            },
          },
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------  // --------------------------------------------------------------------------
  // STAGE 6: اسکله‌های تاریک رود تیمز ⭐️ [نقطه تصمیم‌گیری دوم]
  // --------------------------------------------------------------------------
  {
    levelNumber: 6,
    cefr: "A1",
    titleFa: "اسکله‌های مه‌آلود تیمز: مواجهه با نگهبان انبار ۹",
    titleEn: "The Thames Docks: Warehouse Entrance",
    locationFa: "اسکله‌های انبار زغال‌سنگ تیمز، شرق لندن",
    locationEn: "Thames Coal Wharves, East London",
    storyIntroFa: "بوی رطوبت و نمک رودخانه به مشام می‌رسد. انبار شماره ۹ یک ساختمان آجری غول‌پیکر با پنجره‌های میله‌دار است و نگهبانی با فانوس جلوی در ایستاده است.",
    cutscene: {
      titleFa: "رسیدن به انبار شماره ۹ در اسکله مه‌آلود",
      titleEn: "Arriving at Warehouse Number Nine",
      imageSrc: "/images/skills/speaking/sherlock_stage6_thames_docks.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Here is warehouse number nine, Holmes. The front watchman looks suspicious.",
          textFa: "اینجا انبار شماره نه است هلمز. نگهبان جلوی در مشکوک به نظر می‌رسد.",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-stage-6",
      promptFa: "دو روش برای ورود به محوطه انبار پیش روی شماست! کدام تاکتیک را برمی‌گزینی؟",
      promptEn: "Two approaches to enter the warehouse grounds. Which tactic do you employ?",
      choices: [
        {
          id: "choice-6a",
          labelEn: "Official confrontation: Command the guard to open the door",
          labelFa: "مواجهه رسمی با نشان پلیس: دستور باز کردن در به نگهبان",
          descriptionFa: "مواجهه مستقیم با دربان در ورودی اصلی و صدور دستور پلیسی برای باز کردن در انبار شماره ۹",
          pointsDelta: 150,
        },
        {
          id: "choice-6b",
          labelEn: "Stealth Infiltration: Climb through the broken window",
          labelFa: "نفوذ پنهانی: بالا رفتن از پنجره شکسته انبار",
          descriptionFa: "ورود در سکوت مطلق از پنجره چوبی شکسته بالای سطح آب",
          pointsDelta: 150,
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-6-authority",
        titleFa: "دستور رسمی پلیس به نگهبان اسکله",
        speakerPromptEn: "Guard: 'Stop there! Private wharf! No visitors permitted after midnight!'\nSherlock: 'We are investigating an urgent case. Stand aside and let us inspect the building.'",
        speakerPromptFa: "نگهبان: «همان‌جا بایستید! اسکله خصوصی است! ورود هیچ بازدیدکننده‌ای بعد از نیمه‌شب مجاز نیست!»\nشرلوک: «ما در حال بررسی یک پرونده فوری هستیم. کنار برو و اجازه بده ساختمان را بازرسی کنیم.»",
        speakerRoleFa: "نگهبان اسکله",
        speakerAvatar: "⚓",
        taskInstructionFa: "با تحکم بگو: «ما افسران پلیس هستیم! همین الان در را باز کن!»",
        targetKeywords: [
          { phrase: "We are police", hintFa: "(ما افسران پلیس هستیم)", synonyms: ["we are police", "we are police officers", "police officers"], weight: 40 },
          { phrase: "open this door", hintFa: "(این در را باز کن)", synonyms: ["open this door", "open the door"], weight: 40 },
          { phrase: "now", hintFa: "(الان / فوراً)", synonyms: ["now", "immediately", "right now"], weight: 20 },
        ],
        idealVoiceResponseEn: "We are police officers, open this door now!",
        alternativeResponsesEn: [
          { phraseEn: "We are police officers, open this door immediately!", translationFa: "ما افسران پلیس هستیم، فوراً این در را باز کن!" },
          { phraseEn: "Open this door now! We are police officers.", translationFa: "همین الان این در را باز کن! ما افسران پلیس هستیم." },
        ],
        whiteHintFa: "با قاطعیت بگو We are police officers, open this door now تا نگهبان تسلیم بشه. دوباره امتحان کن!",
        fallbackChoices: [
          "We are police officers, open this door now!",
          "I love boats on the water.",
          "Fish is delicious for dinner.",
        ],
        aefReference: "AEF 1 Unit 8A (Imperatives & Present Simple with TO BE)",
        npcResponse: {
          speakerNameFa: "نگهبان اسکله",
          speakerRoleFa: "دربان انبار شماره ۹",
          speakerAvatar: "⚓",
          textEn: "The guard drops his lantern and runs away! The warehouse door is open.",
          textFa: "نگهبان فانوسش را می‌اندازد و فرار می‌کند! درِ انبار باز مانده است.",
        },
      },
    ],
    branchVariants: [
      {
        conditionChoiceId: "choice-6a",
        titleFa: "مواجهه رسمی با نشان پلیس: در ورودی انبار ۹",
        titleEn: "Official Police Confrontation at Warehouse 9",
        locationFa: "ورودی اصلی انبار شماره ۹، شرق لندن",
        locationEn: "Main Entrance, Warehouse 9",
        storyIntroFa: "شما و کارآگاه وایت به سمت در اصلی انبار قدم برمی‌دارید. نگهبان فانوسش را بالا می‌آورد و با فریاد سد راه می‌شود.",
        cutscene: {
          titleFa: "رویارویی با نگهبان اسکله انبار شماره ۹",
          titleEn: "Confronting the Wharf Guard",
          imageSrc: "/images/skills/speaking/sherlock_stage6_thames_docks.jpg",
          dialogues: [
            {
              speakerId: "white",
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Here is warehouse number nine, Holmes. The front watchman looks suspicious.",
              textFa: "اینجا انبار شماره نه است هلمز. نگهبان جلوی در مشکوک به نظر می‌رسد.",
              bubblePosition: "right",
            },
            {
              speakerId: "guard",
              speakerNameFa: "نگهبان اسکله",
              speakerRoleFa: "نگهبان محلی",
              speakerAvatar: "⚓",
              textEn: "Stop there! Private wharf! No visitors permitted after midnight!",
              textFa: "همان‌جا بایستید! اسکله خصوصی است! ورود هیچ بازدیدکننده‌ای بعد از نیمه‌شب مجاز نیست!",
              bubblePosition: "left",
            },
            {
              speakerId: "sherlock",
              speakerNameFa: "شرلوک هلمز",
              speakerRoleFa: "شرلوک هلمز",
              speakerAvatar: "🔍",
              textEn: "We are investigating an urgent case. Stand aside and let us inspect the building.",
              textFa: "ما در حال بررسی یک پرونده فوری هستیم. کنار برو و اجازه بده ساختمان را بازرسی کنیم.",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-a1-6-authority",
            titleFa: "دستور رسمی پلیس به نگهبان اسکله",
            speakerPromptEn: "Guard: 'Stop there! Private wharf! No visitors permitted after midnight!'\nSherlock: 'We are investigating an urgent case. Stand aside and let us inspect the building.'",
            speakerPromptFa: "نگهبان: «همان‌جا بایستید! اسکله خصوصی است! ورود هیچ بازدیدکننده‌ای بعد از نیمه‌شب مجاز نیست!»\nشرلوک: «ما در حال بررسی یک پرونده فوری هستیم. کنار برو و اجازه بده ساختمان را بازرسی کنیم.»",
            speakerRoleFa: "نگهبان اسکله",
            speakerAvatar: "⚓",
            taskInstructionFa: "با تحکم بگو: «ما افسران پلیس هستیم! همین الان در را باز کن!»",
            targetKeywords: [
              { phrase: "We are police", hintFa: "(ما افسران پلیس هستیم)", synonyms: ["we are police", "we are police officers", "police officers"], weight: 40 },
              { phrase: "open this door", hintFa: "(این در را باز کن)", synonyms: ["open this door", "open the door"], weight: 40 },
              { phrase: "now", hintFa: "(الان / فوراً)", synonyms: ["now", "immediately", "right now"], weight: 20 },
            ],
            idealVoiceResponseEn: "We are police officers, open this door now!",
            alternativeResponsesEn: [
              { phraseEn: "We are police officers, open this door immediately!", translationFa: "ما افسران پلیس هستیم، فوراً این در را باز کن!" },
              { phraseEn: "Open this door now! We are police officers.", translationFa: "همین الان این در را باز کن! ما افسران پلیس هستیم." },
            ],
            whiteHintFa: "با قاطعیت بگو We are police officers, open this door now تا نگهبان تسلیم بشه. دوباره امتحان کن!",
            fallbackChoices: [
              "We are police officers, open this door now!",
              "I love boats on the water.",
              "Fish is delicious for dinner.",
            ],
            aefReference: "AEF 1 Unit 8A (Imperatives & Present Simple with TO BE)",
            npcResponse: {
              speakerNameFa: "نگهبان اسکله",
              speakerRoleFa: "دربان انبار شماره ۹",
              speakerAvatar: "⚓",
              textEn: "The guard drops his lantern and runs away! The warehouse door is open.",
              textFa: "نگهبان فانوسش را می‌اندازد و فرار می‌کند! درِ انبار باز مانده است.",
            },
          },
        ],
      },
      {
        conditionChoiceId: "choice-6b",
        titleFa: "نفوذ پنهانی از پنجره شکسته انبار",
        titleEn: "Stealth Entry via Broken Window",
        locationFa: "پای دیوار انبار شماره ۹ روی آب، شرق لندن",
        locationEn: "Waterfront Wall, Warehouse 9",
        storyIntroFa: "شما و کارآگاه وایت در سکوت از کنار آب پیش می‌روید و پنجره چوبی شکسته‌ای را بالای سطح آب پیدا می‌کنید.",
        cutscene: {
          titleFa: "پیدا کردن پنجره چوبی شکسته بالای آب",
          titleEn: "Finding the Broken Window",
          imageSrc: "/images/skills/speaking/sherlock_stage6_thames_docks.jpg",
          dialogues: [
            {
              speakerId: "white",
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Here is warehouse number nine, Holmes. The front watchman looks suspicious.",
              textFa: "اینجا انبار شماره نه است هلمز. نگهبان جلوی در مشکوک به نظر می‌رسد.",
              bubblePosition: "right",
            },
            {
              speakerId: "white",
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Look Holmes, this wooden window is broken! We can climb inside quietly.",
              textFa: "نگاه کن هلمز، این پنجره چوبی شکسته است! می‌توانیم بی‌صدا وارد شویم.",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a1-6-stealth-window",
            titleFa: "دستور نفوذ بی‌صدا از پنجره شکسته",
            speakerPromptEn: "White: 'Look Holmes, this wooden window is broken! We can climb inside quietly.'",
            speakerPromptFa: "کارآگاه وایت: «نگاه کن هلمز، این پنجره چوبی شکسته است! می‌توانیم بی‌صدا وارد شویم.»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "به وایت زمزمه کن: «ساکت، از پنجره شکسته بالا برو!»",
            targetKeywords: [
              { phrase: "Quiet", hintFa: "(ساکت / آرام)", synonyms: ["quiet", "be quiet", "silence"], weight: 35 },
              { phrase: "climb through", hintFa: "(بالا برو / وارد شو از)", synonyms: ["climb through", "climb in", "go through"], weight: 35 },
              { phrase: "broken window", hintFa: "(پنجره شکسته)", synonyms: ["broken window", "the window", "this window"], weight: 30 },
            ],
            idealVoiceResponseEn: "Quiet, climb through the broken window!",
            alternativeResponsesEn: [
              { phraseEn: "Be quiet, climb through the broken window.", translationFa: "ساکت باش، از پنجره شکسته بالا برو." },
              { phraseEn: "Quiet! Let us climb through the window.", translationFa: "ساکت! بیا از پنجره بالا برویم." },
            ],
            whiteHintFa: "خیلی آروم بگو Quiet, climb through the broken window تا بدون سر و صدا بریم تو. دوباره امتحان کن!",
            fallbackChoices: [
              "Quiet, climb through the broken window!",
              "Boat is blue on water.",
              "I love eating fish in the evening.",
            ],
            aefReference: "AEF 1 Unit 8A (Imperatives: Quiet / Climb)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "We climbed silently through the wooden frame! We are inside the dark warehouse.",
              textFa: "ما در سکوت از قاب چوبی بالا رفتیم! داخل انبار تاریک هستیم.",
            },
          },
        ],
      },
    ],
  },
  // --------------------------------------------------------------------------
  // STAGE 7: بازرسی داخل مخفیگاه انبار (Inside the Lair)
  // --------------------------------------------------------------------------
  {
    levelNumber: 7,
    cefr: "A1",
    titleFa: "داخل انبار مخوف: کشف مدال طلایی لیلی",
    titleEn: "Inside the Lair: The Gold Locket",
    locationFa: "داخل انبار شماره ۹، اسکله تیمز، لندن",
    locationEn: "Interior Warehouse 9, Thames Docks",
    storyIntroFa: "بوی باروت و الوار کهنه در هوای انبار پیچیده است. چراغ‌دستی نور اندکی روی جعبه‌های بزرگ چوبی می‌اندازد. چیزی روی یک صندوق می‌درخشد!",
    cutscene: {
      titleFa: "کشف مدال طلایی عکس والدین لیلی در میان صندوق‌ها",
      titleEn: "Finding Lily's Golden Keepsake",
      imageSrc: "/images/skills/speaking/a1_scene_thames_docks.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "Look down at this wooden crate, White! It is an antique golden locket.",
          textFa: "روی این صندوق چوبی را نگاه کن وایت! یک مدال طلایی عتیقه است.",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "That must belong to the little girl! She was definitely brought inside this hall.",
          textFa: "این باید متعلق به دخترک باشد! او قطعاً به داخل این سالن آورده شده است.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "And there are fresh footprints leading toward the stone stairs in the back.",
          textFa: "و ردپاهای تازه‌ای وجود دارد که به سمت پله‌های سنگی پشت انبار می‌روند.",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-7-object-locket",
        titleFa: "بیان مشاهده سرنخ طلایی روی جعبه چوبی",
        speakerPromptEn: "What did your sharp eyes discover on that wooden box, Holmes?",
        speakerPromptFa: "چشمان تیزبینت چه چیزی روی آن جعبه چوبی کشف کرد، هلمز؟",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "به وایت بگو: «من مدال طلایی لیلی را روی این جعبه پیدا کردم!»",
        targetKeywords: [
          { phrase: "I found", hintFa: "(من پیدا کردم)", synonyms: ["i found", "i see", "look i found", "we found"], weight: 35 },
          { phrase: "gold locket", hintFa: "(مدال طلایی)", synonyms: ["gold locket", "golden locket", "the locket", "necklace"], weight: 35 },
          { phrase: "on the box", hintFa: "(روی جعبه)", synonyms: ["on the box", "on the wooden box", "on this crate"], weight: 30 },
        ],
        idealVoiceResponseEn: "I found Lily's gold locket on the wooden box!",
        alternativeResponsesEn: [
          { phraseEn: "Look, I found a gold locket on this box.", translationFa: "نگاه کن، من یک مدال طلایی روی این جعبه پیدا کردم." },
          { phraseEn: "I found her gold locket right here on the crate.", translationFa: "من مدال طلای او را همین‌جا روی صندوق پیدا کردم." },
          { phraseEn: "There is her gold locket on the wooden box!", translationFa: "مدال طلای او روی جعبه چوبی است!" },
        ],
        whiteHintFa: "دمت گرم هلمز! با فعل گذشته I found و کلمه gold locket سرنخ رو اعلام کن. دوباره امتحان کن!",
        fallbackChoices: [
          "I found Lily's gold locket on the wooden box!",
          "I want to sleep on this box.",
          "Gold watches are very expensive.",
        ],
        aefReference: "AEF 1 Unit 8B (Past simple regular/irregular: I found)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Lily's gold locket! She dropped it intentionally on this box. The child is definitely down in the cellar!",
          textFa: "مدال طلایی لیلی! او عمداً این را روی جعبه انداخته. کودک قطعاً در زیرزمین پایین اینجاست!",
        },
      },
    ],
    decisionPoint: {
      id: "decision-stage-7",
      promptFa: "دو مسیر برای ورود به اعماق زیرزمین انبار وجود دارد! کدام تاکتیک را برمی‌گزینی؟",
      promptEn: "Two descent routes lead into the subterranean cellar. Which tactic do you choose?",
      choices: [
        {
          id: "choice-7a",
          labelEn: "Descend directly via the central stone staircase",
          labelFa: "پایین رفتن مستقیم از پله‌های سنگی مرکزی انبار",
          descriptionFa: "ورود مستقیم و پرسرعت از دهانه اصلی پله‌های سنگی به سمت درگاه زیرزمین",
          pointsDelta: 150,
        },
        {
          id: "choice-7b",
          labelEn: "Climb down through the damp riverside coal chute",
          labelFa: "نفوذ از دریچه بارگیری زغال‌سنگ و کانال مرطوب غربی",
          descriptionFa: "دور زدن پله‌های اصلی و ورود نامحسوس از دریچه بارگیری زیرین به پشت سر نگهبان",
          pointsDelta: 100,
        },
      ],
    },
  },

  // --------------------------------------------------------------------------
  // STAGE 8: نگهبان نقاب‌دار و در پشتی (The Masked Henchman)
  // --------------------------------------------------------------------------
  {
    levelNumber: 8,
    cefr: "A1",
    titleFa: "نگهبان نقاب‌دار: خلع سلاح در دهانه پله‌ها",
    titleEn: "The Masked Guard: Confrontation at the Hatch",
    locationFa: "پله‌های سنگی زیرزمین انبار ۹، لندن",
    locationEn: "Cellar Staircase, Warehouse 9",
    storyIntroFa: "در تاریکی پله‌های سنگی، هیکلی درشت با نقاب سیاه و چماقی چوبی ظاهر می‌شود و راه پله‌ها را سد می‌کند!",
    cutscene: {
      titleFa: "مواجهه با محافظ نقاب‌دار روی پله‌های سنگی",
      titleEn: "Standoff on the Cellar Stairs",
      imageSrc: "/images/skills/speaking/sherlock_stage8_masked_guard.jpg",
      dialogues: [
        {
          speakerId: "henchman",
          speakerNameFa: "محافظ نقاب‌دار",
          speakerRoleFa: "محافظ مسلح",
          speakerAvatar: "👺",
          textEn: "Halt! You cannot take another step down these stairs!",
          textFa: "ایست! یک قدم دیگر نمی‌توانید از این پله‌ها پایین بروید!",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "He has the key hanging from his belt, Holmes! Order him to surrender!",
          textFa: "کلید از کمربندش آویزان است هلمز! به او دستور بده تسلیم شود!",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "Stand back. You are facing Scotland Yard. Drop your club this instant.",
          textFa: "عقب بایست. در برابر اسکاتلندیارد قرار داری. همین لحظه چماقت را بینداز.",
          bubblePosition: "left",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-8-demand-key",
        titleFa: "دستور خلع سلاح و تسلیم کلیدها",
        speakerPromptEn: "Step back into the hall or I will defend this doorway!",
        speakerPromptFa: "به عقب برگردید وگرنه از این درگاه دفاع خواهم کرد!",
        speakerRoleFa: "محافظ نقاب‌دار",
        speakerAvatar: "👺",
        taskInstructionFa: "با صدایی رسا و محکم دستور بده: «چماقت را بینداز و کلید را به من بده!»",
        targetKeywords: [
          { phrase: "Drop the weapon", hintFa: "(سلاحت را بینداز)", synonyms: ["drop the weapon", "put down the weapon", "drop your club", "drop it"], weight: 40 },
          { phrase: "give me the key", hintFa: "(کلید را به من بده)", synonyms: ["give me the key", "hand over the key", "give the keys"], weight: 40 },
          { phrase: "now", hintFa: "(همین حالا)", synonyms: ["now", "immediately", "right now", "at once"], weight: 20 },
        ],
        idealVoiceResponseEn: "Drop the weapon and give me the key now!",
        alternativeResponsesEn: [
          { phraseEn: "Put down the weapon and hand over the key!", translationFa: "سلاح را زمین بگذار و کلید را تحویل بده!" },
          { phraseEn: "Drop your stick and give me the keys immediately!", translationFa: "چوبت را بینداز و کلیدها را فوراً به من بده!" },
          { phraseEn: "Surrender the key and drop that weapon right now!", translationFa: "کلید را تسلیم کن و همین الان آن سلاح را بینداز!" },
        ],
        whiteHintFa: "اقتدار کارآگاهیت رو نشون بده شرلوک! دو فعل امری Drop the weapon و give me the key رو محکم بگو. دوباره امتحان کن!",
        fallbackChoices: [
          "Drop the weapon and give me the key now!",
          "I want to play baseball in the park.",
          "The key is in my pocket yesterday.",
        ],
        aefReference: "AEF 1 Unit 9B (Direct imperative commands)",
        npcResponse: {
          speakerNameFa: "محافظ نقاب‌دار",
          speakerRoleFa: "محافظ مسلح",
          speakerAvatar: "👺",
          textEn: "Take the brass key! But you are too late, Mr. Holmes... the master will soon finish his grand game!",
          textFa: "کلید برنجی را بگیر! اما خیلی دیر رسیدی آقای هلمز... رئیس به زودی بازی بزرگش را تمام خواهد کرد!",
        },
      },
    ],
    branchVariants: [
      {
        conditionChoiceId: "choice-7b",
        titleFa: "نفوذ از دریچه زغال‌سنگ: دور زدن محافظان",
        titleEn: "Coal Chute Infiltration: Bypassing the Guard",
        locationFa: "کانال مرطوب زغال‌سنگ، زیرزمین انبار ۹",
        locationEn: "Damp Coal Chute Vaults, Warehouse 9",
        storyIntroFa: "شما با موفقیت از دریچه زغال‌سنگ پایین خزیدید و بدون درگیری مستقیم به پشت سر درگاه زیرزمین رسیدید. نگهبان دوم در حال قفل کردن دروازه است!",
        cutscene: {
          titleFa: "غافلگیری نگهبان دروازه زیرزمینی در تاریکی",
          titleEn: "Surprising the Tunnel Guard in the Shadows",
          imageSrc: "/images/skills/speaking/sherlock_stage8_masked_guard.jpg",
          dialogues: [
            {
              speakerId: "white",
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Brilliant maneuver, Holmes! We are right behind him. Disarm him before he turns around!",
              textFa: "مانور فوق‌العاده‌ای بود هلمز! ما درست پشت سر او هستیم. قبل از اینکه برگردد خلع سلاحش کن!",
              bubblePosition: "right",
            },
            {
              speakerId: "henchman",
              speakerNameFa: "محافظ دوم",
              speakerRoleFa: "نگهبان دالان",
              speakerAvatar: "👺",
              textEn: "Who is behind me in the shadows?! Stay back!",
              textFa: "چه کسی پشت سر من در سایه‌هاست؟! عقب بایستید!",
              bubblePosition: "left",
            },
          ],
        },
        tasks: [
          {
            id: "task-a1-8-sneak-command",
            titleFa: "دستور غافلگیرانه تسلیم کلیدها",
            speakerPromptEn: "Who stepped into this dark cellar passage behind my back?!",
            speakerPromptFa: "چه کسی پشت سر من وارد این دالان تاریک زیرزمین شد؟!",
            speakerRoleFa: "محافظ دوم",
            speakerAvatar: "👺",
            taskInstructionFa: "با تحکم بگو: «تکان نخور و کلیدها را فوراً تحویل بده!»",
            targetKeywords: [
              { phrase: "Do not move", hintFa: "(تکان نخور)", synonyms: ["do not move", "don't move", "stay there", "freeze"], weight: 40 },
              { phrase: "give me the keys", hintFa: "(کلیدها را به من بده)", synonyms: ["give me the keys", "hand over the keys", "the keys"], weight: 40 },
              { phrase: "now", hintFa: "(همین الان)", synonyms: ["now", "immediately", "at once"], weight: 20 },
            ],
            idealVoiceResponseEn: "Do not move and give me the keys now!",
            alternativeResponsesEn: [
              { phraseEn: "Freeze! Hand over the keys immediately.", translationFa: "تکان نخور! کلیدها را فوراً تحویل بده." },
              { phraseEn: "Do not move, drop the lock and give me the keys.", translationFa: "تکان نخور، قفل را رها کن و کلیدها را به من بده." },
            ],
            whiteHintFa: "عالی غافلگیرش کردی هلمز! از Do not move و give me the keys استفاده کن. دوباره امتحان کن!",
            fallbackChoices: [
              "Do not move and give me the keys now!",
              "I have a red apple in my bag.",
              "Water flows fast tonight.",
            ],
            aefReference: "AEF 1 Unit 9B (Negative imperatives: Do not move)",
            npcResponse: {
              speakerNameFa: "محافظ دوم",
              speakerRoleFa: "نگهبان دالان",
              speakerAvatar: "👺",
              textEn: "Here... take the heavy ring of keys! The master has already locked the vault!",
              textFa: "بگیر... این دسته کلیدهای سنگین! رئیس قبلاً در گاوصندوق را قفل کرده است!",
            },
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 9: دوراهی زیرزمین مخفی ⭐️ [نقطه تصمیم‌گیری سوم و سرنوشت‌ساز]
  // --------------------------------------------------------------------------
  {
    levelNumber: 9,
    cefr: "A1",
    titleFa: "دوراهی زیرزمین سنگی: انتخاب مسیر نهایی",
    titleEn: "The Stone Cellar: The Final Crossroads",
    locationFa: "زیرزمین مرطوب انبار شماره ۹، لندن",
    locationEn: "Deep Cellar Vaults, Warehouse 9",
    storyIntroFa: "کلید در دستان توست. زیرزمین به دو دالان سنگی ختم می‌شود: دالان سمت چپ به سمت اسکله زیرزمینی قایق‌ها می‌رود و دالان سمت راست به یک در سنگین آهنی با صدایی ضعیف از پشت آن!",
    cutscene: {
      titleFa: "بر سر دوراهی دالان‌های سنگی زیرزمین انبار",
      titleEn: "At the Vault Crossroads",
      imageSrc: "/images/skills/speaking/sherlock_stage8_masked_guard.jpg",
      dialogues: [
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Listen Holmes! I think they might use the underground boat tunnel on the left to leave by water.",
          textFa: "گوش کن هلمز! فکر می‌کنم شاید از تونل قایق سمت چپ استفاده کنند تا از مسیر آب بروند.",
          bubblePosition: "right",
        },
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "Wait a moment, White. Hear that quiet sound coming from the locked iron door on the right?",
          textFa: "یک لحظه صبر کن وایت. آن صدای آرام که از پشت در آهنی سمت راست می‌آید را می‌شنوی؟",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "We must decide quickly, Holmes. Every second counts in this cold cellar.",
          textFa: "باید سریع تصمیم بگیریم هلمز. در این زیرزمین سرد هر ثانیه ارزشمند است.",
          bubblePosition: "right",
        },
      ],
    },
    decisionPoint: {
      id: "decision-stage-9",
      promptFa: "دو مسیر در انتهای دالان سنگی قرار دارد! شهود کارآگاهی‌ات کدام را برمی‌گزیند؟",
      promptEn: "Two corridors extend into the dark. Which passage do you investigate?",
      choices: [
        {
          id: "choice-9a",
          labelEn: "Breach the locked iron door on the right corridor",
          labelFa: "بررسی در سنگین آهنی سمت راست دالان",
          descriptionFa: "تمرکز بر دالان سنگی و گوش سپردن به صداهای مبهم پشت در آهنی",
          pointsDelta: 200,
        },
        {
          id: "choice-9b",
          labelEn: "Advance toward the underground river boat slipway",
          labelFa: "حرکت به سمت اسکله زیرزمینی قایق‌ها در دالان چپ",
          descriptionFa: "پیشروی سریع به سمت دالان تاریک چپ و بررسی مسیر خروجی قایق‌های متصل به رودخانه",
          pointsDelta: 0,
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-9-hear-whisper",
        titleFa: "اعلام شنیدن صدای دخترک پشت در آهنی",
        speakerPromptEn: "Why are you pausing at this iron door, Holmes? What do you notice?",
        speakerPromptFa: "چرا جلوی این در آهنی درنگ کردی هلمز؟ چه چیزی متوجه شدی؟",
        speakerRoleFa: "کارآگاه وایت",
        speakerAvatar: "🕵️‍♂️",
        taskInstructionFa: "به وایت بگو: «گوش کن! من صدای دخترک را پشت این در می‌شنوم!»",
        targetKeywords: [
          { phrase: "Listen", hintFa: "(گوش کن)", synonyms: ["listen", "wait", "hark", "hear"], weight: 30 },
          { phrase: "I can hear", hintFa: "(من می‌توانم بشنوم)", synonyms: ["i can hear", "i hear", "do you hear"], weight: 35 },
          { phrase: "behind the door", hintFa: "(پشت در)", synonyms: ["behind the door", "behind this door", "inside"], weight: 35 },
        ],
        idealVoiceResponseEn: "Listen! I can hear the little girl behind the door!",
        alternativeResponsesEn: [
          { phraseEn: "Listen carefully, I can hear a voice behind this door.", translationFa: "دقت گوش کن، من صدایی را پشت این در می‌شنوم." },
          { phraseEn: "Stop! I hear the little girl crying behind the door.", translationFa: "صبر کن! من صدای گریه دخترک را پشت در می‌شنوم." },
          { phraseEn: "Listen to me, she is crying behind this heavy door!", translationFa: "به من گوش کن، او پشت این در سنگین گریه می‌کند!" },
        ],
        whiteHintFa: "باریکلا شرلوک! از فعل حسی I can hear و عبارت مکانی behind the door استفاده کن تا حقیقت روشن بشه. دوباره امتحان کن!",
        fallbackChoices: [
          "Listen! I can hear the little girl behind the door!",
          "I like swimming in the deep river.",
          "The door is painted green and brown.",
        ],
        aefReference: "AEF 1 Unit 10A (Stative verbs with Can: I can hear / I can see)",
        npcResponse: {
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "You have sharp ears, Holmes. The brass key fits this lock... are you ready to face the truth?",
          textFa: "گوش‌های تیزی داری هلمز. کلید برنجی به این قفل می‌خورد... آیا آماده‌ای تا با حقیقت روبه‌رو شوی؟",
        },
      },
    ],
    branchVariants: [
      {
        conditionChoiceId: "choice-9b",
        titleFa: "اسکله زیرزمینی قایق‌ها",
        titleEn: "Underground Boat Slipway",
        locationFa: "اسکله زیرزمینی تاریک انبار ۹، لندن",
        locationEn: "Dark Underground Pier, Warehouse 9",
        storyIntroFa: "شما به سمت اسکله زیرزمینی می‌دوید، اما قایق چوبی کاملاً خالی است و فقط یک فانوس روشن در آن رها شده است!",
        cutscene: {
          titleFa: "قایق خالی در اسکله تاریک زیرزمینی",
          titleEn: "The Empty Rowboat in the Shadows",
          imageSrc: "/images/skills/speaking/sherlock_stage9_underground_crossroads.jpg",
          dialogues: [
            {
              speakerId: "white",
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Look at the water, Holmes! Is anyone in the boat?",
              textFa: "به آب نگاه کن هلمز! آیا کسی در قایق است؟",
              bubblePosition: "right",
            },
          ],
        },
        tasks: [
          {
            id: "task-a1-9-empty-boat",
            titleFa: "اعلام خالی بودن قایق زیرزمینی",
            speakerPromptEn: "White: 'Did they escape by water? Look inside the boat!'",
            speakerPromptFa: "کارآگاه وایت: «آیا از راه آب فرار کردند؟ داخل قایق را نگاه کن!»",
            speakerRoleFa: "کارآگاه وایت",
            speakerAvatar: "🕵️‍♂️",
            taskInstructionFa: "با ناامیدی بگو: «قایق خالی است!»",
            targetKeywords: [
              { phrase: "The boat", hintFa: "(قایق)", synonyms: ["the boat", "this boat", "boat"], weight: 50 },
              { phrase: "is empty", hintFa: "(خالی است)", synonyms: ["is empty", "empty", "nobody is here"], weight: 50 },
            ],
            idealVoiceResponseEn: "The boat is empty!",
            alternativeResponsesEn: [
              { phraseEn: "Look, the boat is empty!", translationFa: "نگاه کن، قایق خالی است!" },
              { phraseEn: "The boat is empty, nobody is here.", translationFa: "قایق خالی است، هیچ‌کس اینجا نیست." },
            ],
            whiteHintFa: "خیلی کوتاه و رسا بگو The boat is empty تا سریع برگردیم. دوباره امتحان کن!",
            fallbackChoices: [
              "The boat is empty!",
              "I like swimming in the river.",
              "Water is cold tonight.",
            ],
            aefReference: "AEF 1 Unit 10A (Simple Subject + TO BE + Adjective)",
            npcResponse: {
              speakerNameFa: "کارآگاه وایت",
              speakerRoleFa: "کارآگاه وایت",
              speakerAvatar: "🕵️‍♂️",
              textEn: "Oh no, Holmes! We lost valuable time... let us run back to the iron door quickly!",
              textFa: "اوه نه هلمز! زمان ارزشمندی را از دست دادیم... بیا سریع به طرف در آهنی بدویم!",
            },
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // STAGE 10: نقطه اوج پرونده: افشای موریارتی ⭐️ [دو پایان متفاوت]
  // --------------------------------------------------------------------------
  {
    levelNumber: 10,
    cefr: "A1",
    titleFa: "نقطه اوج نهایی: گشودن قفل و افشای راز بزرگ",
    titleEn: "The Final Climax: The Unmasking",
    locationFa: "دخمه زیرین انبار شماره ۹، لندن",
    locationEn: "The Hidden Vault, Warehouse 9",
    storyIntroFa: "کلید در قفل می‌چرخد. قفل سنگین با صدای بلندی باز می‌شود. پرده از راز بزرگ این پرونده جنایی برداشته خواهد شد!",
    cutscene: {
      titleFa: "چرخش کلید در قفل نهایی دخمه سنگی",
      titleEn: "Unlocking the Vault Gate",
      imageSrc: "/images/skills/speaking/a1_scene_vault_trap.jpg",
      dialogues: [
        {
          speakerId: "sherlock",
          speakerNameFa: "شرلوک هلمز",
          speakerRoleFa: "شرلوک هلمز",
          speakerAvatar: "🔍",
          textEn: "The lock is open! Lily, are you inside? Do not be afraid, you are safe now!",
          textFa: "قفل باز شد! لیلی، آیا داخل هستی؟ نترس، تو الان در امان هستی!",
          bubblePosition: "left",
        },
        {
          speakerId: "white",
          speakerNameFa: "کارآگاه وایت",
          speakerRoleFa: "کارآگاه وایت",
          speakerAvatar: "🕵️‍♂️",
          textEn: "Well done, Holmes... but every grand play must reach its final curtain.",
          textFa: "آفرین هلمز... اما هر نمایش باشکوهی باید به پرده آخرش برسد.",
          bubblePosition: "right",
        },
      ],
    },
    tasks: [
      {
        id: "task-a1-10-comfort-girl",
        titleFa: "دلجویی از دخترک و اعلام نجات و امنیت",
        speakerPromptEn: "A frightened child in a red coat looks up into your eyes with tears...",
        speakerPromptFa: "کودکی وحشت‌زده با پالتوی قرمز در میان اشک‌ها به چشمانت نگاه می‌کند...",
        speakerRoleFa: "لیلی (دخترک ربوده‌شده)",
        speakerAvatar: "👧",
        taskInstructionFa: "با لحنی مهربان و آرامش‌بخش به دخترک بگو: «نترس لیلی! تو الان در امانی، من شرلوک هلمز هستم.»",
        targetKeywords: [
          { phrase: "Do not be afraid", hintFa: "(نترس)", synonyms: ["do not be afraid", "don't be afraid", "do not worry", "don't worry"], weight: 40 },
          { phrase: "safe now", hintFa: "(الان در امان هستی)", synonyms: ["safe now", "safe", "you are safe"], weight: 35 },
          { phrase: "Sherlock Holmes", hintFa: "(شرلوک هلمز)", synonyms: ["sherlock holmes", "holmes", "detective holmes"], weight: 25 },
        ],
        idealVoiceResponseEn: "Do not be afraid Lily, you are safe now. I am Sherlock Holmes.",
        alternativeResponsesEn: [
          { phraseEn: "Do not worry, you are safe now with me.", translationFa: "نگران نباش، تو الان در کنار من در امان هستی." },
          { phraseEn: "Do not be afraid, I am Detective Holmes and you are safe.", translationFa: "نترس، من کارآگاه هلمز هستم و تو در امانی." },
          { phraseEn: "You are completely safe now Lily, do not cry.", translationFa: "تو الان کاملاً در امانی لیلی، گریه نکن." },
        ],
        whiteHintFa: "آرامش کلامت نجات‌بخشه هلمز! با Do not be afraid و عبارت you are safe now روحیه دخترک رو نجات بده. دوباره امتحان کن!",
        fallbackChoices: [
          "Do not be afraid Lily, you are safe now. I am Sherlock Holmes.",
          "I am hungry let us eat bread.",
          "Where is my umbrella in the rain?",
        ],
        aefReference: "AEF 1 Unit 10B (Imperatives for comfort + Present simple)",
        npcResponse: {
          speakerNameFa: "لیلی (دخترک نجات‌یافته)",
          speakerRoleFa: "شاهد نجات‌یافته",
          speakerAvatar: "👧",
          textEn: "Thank you Mr. Holmes! But look at the door... that man behind you! He is the one who kidnapped me from my bedroom!",
          textFa: "متشکرم آقای هلمز! اما به درگاه نگاه کن... آن مرد پشت سرت! او همان کسی است که مرا از اتاقم دزدید!",
        },
      },
    ],
    possibleEndings: {
      ending2: {
        endingType: "ending-2-girl-rescue",
        titleFa: "پایان نجات و رسوایی: اشاره انگشت لیلی به موریارتی",
        titleEn: "Ending: Heroic Rescue & The Unmasking of Moriarty",
        badgeTitleFa: "🎖️ نجات لیلی و برملا شدن نقاب موریارتی",
        imageSrc: "/images/skills/speaking/a1_scene_girl_rescue.jpg",
        climaxStoryFa: "دخترک دست شرلوک را می‌گیرد و اشک‌هایش را پاک می‌کند. ناگهان نگاهش به کارآگاه وایت که در آستانه در ایستاده می‌افتد. چشمان دخترک از وحشت گشاد می‌شود و با دست لرزان به وایت اشاره می‌کند!",
        climaxStoryEn: "Lily holds Holmes's hand and wipes her tears. Suddenly, her eyes lock onto Detective White standing in the doorway. She gasps in terror, pointing her trembling finger directly at White!",
        revealDialogueEn: "LILY: 'That man! That is the man who kidnapped me from my bedroom!'\n\nWHITE: *His warm smile vanishes into a sharp, chilling smirk as he holds his cane* 'Bravo, Holmes! You solved the riddle of the girl... but Detective White was only a mask. I am Professor James Moriarty! You were only a pawn in my master game. Until we meet in Level A2, detective!' *Slips into the foggy London night*",
        revealDialogueFa: "لیلی: «اون مرد! اون همون کسیه که منو از توی اتاقم دزدید!»\n\nوایت: *لبخند مهربانش ناپدید می‌شود و چهره سرد و باهوش موریارتی با عصایش نمایان می‌گردد* «براوو هلمز! معمای دخترک رو حل کردی... اما کارآگاه وایت فقط یک نقاب بود. من پروفسور جیمز موریارتی هستم! تو تمام این مدت مهره بازی من بودی. تا دیدار ما در سطح A2، کارآگاه!» *در مه غلیظ شب لندن ناپدید می‌شود*",
        nextTierHintFa: "پرونده سطح A1 با نجات جان لیلی و رسوایی هویت موریارتی به پایان رسید. در سطح A2، دکتر جان واتسون به عنوان همراه و مربی هوشمند سیستم به شما ملحق می‌شود تا شبکه موریارتی را متلاشی کنید!",
      },
      ending1: {
        endingType: "ending-1-vault-trap",
        titleFa: "پایان اسارت در دخمه: لبخند پیروزمندانه موریارتی",
        titleEn: "Ending: The Iron Trap & The Villain Revealed",
        badgeTitleFa: "⛓️ اسارت موقت در تله پروفسور موریارتی",
        imageSrc: "/images/skills/speaking/a1_scene_vault_trap.jpg",
        climaxStoryFa: "دخمه خالی است! دخترک از این محل منتقل شده و تنها یک یادداشت روی میز قرار دارد: «خیلی دیر رسیدی هلمز». ناگهان در آهنی سنگین پشت سرت با صدای هولناکی کوبیده و قفل می‌شود!",
        climaxStoryEn: "The vault is empty! The girl was moved, leaving only a mocking letter on the cold table: 'Too late, Holmes.' Suddenly, the heavy iron gate slams shut behind you and locks from the outside!",
        revealDialogueEn: "WHITE: *Smiles mockingly through the iron bars, holding the key and a signed letter* 'Did you really believe I was Detective White, Holmes? I am Professor James Moriarty! You followed every clue I laid out for you. You are trapped... but our grand duel is only beginning. See you in Level A2!'",
        revealDialogueFa: "وایت: *با لبخندی شیطانی و سرد از پشت میله‌های آهنی نگاه می‌کند و کلید و نامه امضا شده را نشان می‌دهد* «واقعاً باور کردی من کارآگاه وایت بودم هلمز؟ من پروفسور جیمز موریارتی هستم! تو تمام این مدت طبق سرنخ‌هایی که خودم برات چیده بودم جلو اومدی. حالا در تله منی... اما دوئل بزرگ ما تازه شروع شده. در سطح A2 می‌بینمت!»",
        nextTierHintFa: "موریارتی نقاب از چهره برداشت و شما را موقتاً محبوس ساخت. در آغاز سطح A2، ورود دکتر جان واتسون شما را از این دخمه نجات می‌دهد تا به سراغ موریارتی بروید!",
      },
    },
  },
];

import { A2_SHERLOCK_CASE } from "./sherlock-case-a2.ts";
export { A2_SHERLOCK_CASE };

export function getSherlockStage(levelNum: number, cefr: CefrLevel = "A1"): DetectiveStage {
  const caseList = cefr === "A2" ? A2_SHERLOCK_CASE : A1_SHERLOCK_CASE;
  const found = caseList.find((s) => s.levelNumber === levelNum);
  if (found) return found;
  return caseList[0];
}

export const A1_DECISION_SCORES: Record<string, number> = {
  "choice-3b": 150,
  "choice-3a": 100,
  "choice-5b": 150,
  "choice-5a": 50,
  "choice-6a": 150,
  "choice-6b": 150,
  "choice-7a": 150,
  "choice-7b": 100,
  "choice-9a": 200,
  "choice-9b": 0,
};

export const A1_WIN_THRESHOLD = 610;

export function calculateA1DecisionScore(decisions: Record<number, string>): number {
  let total = 0;
  for (const choiceId of Object.values(decisions || {})) {
    if (typeof A1_DECISION_SCORES[choiceId] === "number") {
      total += A1_DECISION_SCORES[choiceId];
    }
  }
  return total;
}


