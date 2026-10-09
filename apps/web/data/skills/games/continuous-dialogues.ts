// =========================================================================
// CONTINUOUS DIALOGUE STREAM SCENARIOS (CEFR C1 & C2)
// Multi-Turn Narrative Dialogues based on American English File 5 (Units 1-10)
// Designed for Speedrun Stopwatch Challenges & Cohesive Storylines
// =========================================================================

import { CefrLevel } from "./types";

export interface DialogueTurn {
  turnIndex: number;
  partnerPrompt: string;
  correctComeback: string;
  targetIdiom: string;
  contextFa: string;
}

export interface ContinuousDialogueScenario {
  id: string;
  cefr: "C1" | "C2";
  unit: number; // 1 to 10 in AEF 5
  stageNumber: number; // Suggested 1-10 stage mapping
  titleEn: string;
  titleFa: string;
  topicEn: string;
  topicFa: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  partnerFlag: string;
  turns: DialogueTurn[];
  distractorPool: string[]; // High-register distractors for this scenario
}

export const CONTINUOUS_DIALOGUE_SCENARIOS: ContinuousDialogueScenario[] = [
  // =========================================================================
  // CEFR C1 SCENARIOS (American English File 5 Units 1 to 10)
  // =========================================================================

  // --- C1 Scenario 1 (AEF 5 Unit 1: Personality, Habits & First Impressions) ---
  {
    id: "c1-sc-u1",
    cefr: "C1",
    unit: 1,
    stageNumber: 1,
    titleEn: "The Executive Candidate Assessment",
    titleFa: "ارزیابی شخصیت متقاضی مدیریت ارشد",
    topicEn: "Personality Traits & Quirks",
    topicFa: "شخصیت‌شناسی، خودآگاهی و تعامل انسانی",
    partnerName: "Oliver Vance",
    partnerRole: "Head of Talent Acquisition",
    partnerAvatar: "👨‍💼",
    partnerFlag: "🇬🇧 London",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Welcome to the final panel! Our team noticed you can be quite intense during product critiques. Is that accurate?",
        correctComeback: "I admit I tend to wear my heart on my sleeve when discussing design quality.",
        targetIdiom: "wear heart on sleeve",
        contextFa: "ابراز بی‌پرده و شفاف احساسات در محیط کار",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Fair enough, but what about dealing with senior directors who resist new digital methodologies?",
        correctComeback: "It's tough when executives are completely set in their ways, but I stay patient.",
        targetIdiom: "set in one's ways",
        contextFa: "مدیریت افراد سرسخت در عادات و تغییرناپذیر",
      },
      {
        turnIndex: 2,
        partnerPrompt: "One of our department leads has a reputation for being rather defensive when challenged.",
        correctComeback: "I know he has a chip on his shoulder, so I always frame feedback constructively.",
        targetIdiom: "chip on shoulder",
        contextFa: "حساسیت و زودرنجی بیجا ناشی از احساس کمبود",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Lastly, how would your former colleagues describe working alongside you day-to-day?",
        correctComeback: "They would say I am thoroughly down to earth and never beat around the bush.",
        targetIdiom: "down to earth / beat around the bush",
        contextFa: "خاکی و واقع‌بین بودن به دور از حاشیه‌پردازی",
      },
    ],
    distractorPool: [
      "Let's not jump the gun before reviewing the quarterly tax statements.",
      "We'll just have to tighten our belts and freeze external contracts.",
      "That sounds like an outright rip-off given their previous reputation.",
    ],
  },

  // --- C1 Scenario 2 (AEF 5 Unit 2: Modern Career, Rat Race & Work-Life Balance) ---
  {
    id: "c1-sc-u2",
    cefr: "C1",
    unit: 2,
    stageNumber: 2,
    titleEn: "The High-Stakes Project Crisis",
    titleFa: "مدیریت ضرب‌الاجل و فشار فرسایشی کار",
    topicEn: "Careers, Burnout & Hustle Culture",
    topicFa: "فرسودگی شغلی، رقابت فرساینده و خلاقیت",
    partnerName: "Claire Chen",
    partnerRole: "Silicon Valley VP of Product",
    partnerAvatar: "👩‍💻",
    partnerFlag: "🇺🇸 San Francisco",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "We only have 72 hours until the global keynote demo, and our latency is still spiking. Why did you leave your corporate job for this?",
        correctComeback: "I was utterly exhausted by the corporate rat race and wanted genuine ownership.",
        targetIdiom: "the rat race",
        contextFa: "رقابت فرساینده و بی‌پایان زندگی کارمندی",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Well, ownership means pressure. The engineering team has been working non-stop since dawn.",
        correctComeback: "We've all been burning the midnight oil, but the breakthrough is within reach.",
        targetIdiom: "burn the midnight oil",
        contextFa: "شب‌بیداری و کار فشرده تا پاسی از شب",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Conventional optimization isn't cutting latency below 200 milliseconds. What do we do?",
        correctComeback: "It's time to think outside the box and rewrite the caching pipeline completely.",
        targetIdiom: "think outside the box",
        contextFa: "تفکر خلاقانه و راهکارهای نوآورانه غیرمتعارف",
      },
      {
        turnIndex: 3,
        partnerPrompt: "The engineers look exhausted right now. Should we force another consecutive all-nighter?",
        correctComeback: "Let's call it a day and resume with refreshed clarity tomorrow morning.",
        targetIdiom: "call it a day",
        contextFa: "پایان دادن به کار امروز و استراحت برای تجدید قوا",
      },
    ],
    distractorPool: [
      "They left no stone unturned during the forensic tax inspection.",
      "At the end of the day, blood is thicker than water.",
      "His public apology was just an ostentatious display of false remorse.",
    ],
  },

  // --- C1 Scenario 3 (AEF 5 Unit 3: Language, Subtext & Corporate Communication) ---
  {
    id: "c1-sc-u3",
    cefr: "C1",
    unit: 3,
    stageNumber: 3,
    titleEn: "Deciphering the Closed-Door Memo",
    titleFa: "رمزگشایی از بیانیه محرمانه هیئت مدیره",
    topicEn: "Communication Nuances & Subtext",
    topicFa: "درک نانوشته‌ها، صراحت کلام و سوءتفاهمات",
    partnerName: "Julian Ross",
    partnerRole: "Senior Investigative Editor",
    partnerAvatar: "✍️",
    partnerFlag: "🇨🇦 Toronto",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Did you read the CEO's latest internal dispatch about 'optimizing regional workforce structures'?",
        correctComeback: "If you read between the lines, substantial workforce downsizing is inevitable.",
        targetIdiom: "read between the lines",
        contextFa: "خواندن نانوشته‌ها و درک منظور واقعی پشت کلمات",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Why can't executive leadership speak to staff with total honesty for once?",
        correctComeback: "They prefer beating around the bush rather than facing immediate staff backlash.",
        targetIdiom: "beat around the bush",
        contextFa: "حاشیه‌روی و طفره رفتن از اصل مطلب",
      },
      {
        turnIndex: 2,
        partnerPrompt: "During the town hall, the VP accidentally hinted at closing the Munich office.",
        correctComeback: "It was clearly an inadvertent slip of the tongue that embarrassed PR directors.",
        targetIdiom: "slip of the tongue",
        contextFa: "لغزش ناخواسته زبانی و تپق ناگهانی",
      },
      {
        turnIndex: 3,
        partnerPrompt: "What was the final outcome when you questioned the communications director privately?",
        correctComeback: "In a nutshell, severance packages are being drafted as we speak.",
        targetIdiom: "in a nutshell",
        contextFa: "خلاصه کلام و چکیده ماجرا در یک عبارت",
      },
    ],
    distractorPool: [
      "I have itchy feet and crave a solo backpacking trip across Patagonia.",
      "That proposal was a textbook Catch-22 situation for all founders.",
      "They are skating on extremely thin ice with shareholder capital.",
    ],
  },

  // --- C1 Scenario 4 (AEF 5 Unit 4: Family Businesses, Ties & Estrangement) ---
  {
    id: "c1-sc-u4",
    cefr: "C1",
    unit: 4,
    stageNumber: 4,
    titleEn: "The Family Enterprise Dispute",
    titleFa: "اختلاف در کسب‌وکار خانوادگی و آشتی مجدد",
    topicEn: "Family Dynamics & Generational Rift",
    topicFa: "پیوندهای خونی، دوری تدریجی و صلح خانوادگی",
    partnerName: "Sophia Sterling",
    partnerRole: "Family Trust Mediator",
    partnerAvatar: "👩‍⚖️",
    partnerFlag: "🇺🇸 Boston",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Your two partners who happen to be siblings haven't spoken directly since the buyout proposal.",
        correctComeback: "They have drifted apart for years, and inheritance disputes made it worse.",
        targetIdiom: "drift apart",
        contextFa: "کمرنگ شدن تدریجی رابطه با گذشت زمان",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Can outside lawyers force them to cooperate on the distribution agreement?",
        correctComeback: "No; blood is thicker than water, so this must be resolved within the family.",
        targetIdiom: "blood is thicker than water",
        contextFa: "اولویت پیوند خونی و احترام به نهاد خانواده",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Do you believe both parties are genuinely open to settling their grievances today?",
        correctComeback: "Yes, both brothers expressed a desire to sit down and patch things up.",
        targetIdiom: "patch things up",
        contextFa: "ترمیم رابطه و آشتی کردن پس از اختلاف",
      },
      {
        turnIndex: 3,
        partnerPrompt: "How can we ensure the next generation respects the founder's legacy?",
        correctComeback: "The young heirs look up to their grandfather and value his foundational ethos.",
        targetIdiom: "look up to",
        contextFa: "الگو قرار دادن و احترام به بزرگترها",
      },
    ],
    distractorPool: [
      "A minor glitch in the system cascaded into a complete server timeout.",
      "We cannot throw in the towel; let's revamp the sales funnel.",
      "His victory was a quintessential Pyrrhic victory given the legal costs.",
    ],
  },

  // --- C1 Scenario 5 (AEF 5 Unit 5: Wealth, Cost Overruns & Fiscal Discipline) ---
  {
    id: "c1-sc-u5",
    cefr: "C1",
    unit: 5,
    stageNumber: 5,
    titleEn: "The Startup Runway Emergency",
    titleFa: "بحران بودجه و نجات نقدینگی استارتاپ",
    topicEn: "Wealth, Debt & Financial Decisions",
    topicFa: "مدیریت سرمایه، صرفه‌جویی و هزینه‌های سنگین",
    partnerName: "Marcus Vance",
    partnerRole: "Lead Venture Capitalist",
    partnerAvatar: "💼",
    partnerFlag: "🇬🇧 London",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Your monthly burn rate jumped forty percent after hiring the new marketing agency. What happened?",
        correctComeback: "Their custom brand campaign literally cost an arm and a leg with zero return.",
        targetIdiom: "cost an arm and a leg",
        contextFa: "هزینه بسیار سنگین و گزاف برای کسب‌وکار",
      },
      {
        turnIndex: 1,
        partnerPrompt: "We cannot inject fresh venture debt until revenue stabilizes. What is your austerity plan?",
        correctComeback: "We must tighten our belts and freeze all discretionary operational expenses.",
        targetIdiom: "tighten one's belt",
        contextFa: "صرفه‌جویی شدید و محدود کردن مخارج",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Will cancelling client entertainment events be enough to keep the doors open?",
        correctComeback: "Yes, because continuing lavish galas right now is just money down the drain.",
        targetIdiom: "money down the drain",
        contextFa: "هدر دادن و دور ریختن بیهوده سرمایه",
      },
      {
        turnIndex: 3,
        partnerPrompt: "When do your revised financial models show the company turning a sustainable profit?",
        correctComeback: "With disciplined fiscal restraint, we will comfortably break even by Q3.",
        targetIdiom: "break even",
        contextFa: "سر به سر شدن مخارج و درآمدهای مالی",
      },
    ],
    distractorPool: [
      "They turned a blind eye to obvious industrial safety infractions.",
      "She wears her heart on her sleeve during every internal review.",
      "The contract was signed at the eleventh hour right before midnight.",
    ],
  },

  // --- C1 Scenario 6 (AEF 5 Unit 6: History, Retrospect & Iconic Eras) ---
  {
    id: "c1-sc-u6",
    cefr: "C1",
    unit: 6,
    stageNumber: 6,
    titleEn: "The Architectural Heritage Debate",
    titleFa: "مرور خاطرات و تصمیم‌گیری درباره ابنیه تاریخی",
    topicEn: "History, Nostalgia & Retrospect",
    topicFa: "تجدید خاطرات، گذشت زمان و تجربه تاریخی",
    partnerName: "Helena Rostova",
    partnerRole: "Chief Urban Historian",
    partnerAvatar: "🏛️",
    partnerFlag: "🇦🇹 Vienna",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Developers want to demolish the 1920s cinema house to build luxury condos. Does that name resonate with you?",
        correctComeback: "It definitely rings a bell; my grandparents attended their opening gala.",
        targetIdiom: "ring a bell",
        contextFa: "آشنا به نظر رسیدن نام یا مکان در حافظه",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Some council members still hold grudges over the bitter landmark preservation fights from the nineties.",
        correctComeback: "Those disagreements are all water under the bridge now; we must look ahead.",
        targetIdiom: "water under the bridge",
        contextFa: "گذشته‌ها گذشته و کدورت‌های فراموش‌شده",
      },
      {
        turnIndex: 2,
        partnerPrompt: "City council deeply regrets allowing the historical library to be privatized ten years ago.",
        correctComeback: "Hindsight is always twenty-twenty, but we can prevent repeating that mistake.",
        targetIdiom: "hindsight is 20/20",
        contextFa: "عقل کل شدن پس از وقوع حادثه و درس‌آموزی",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Losing public funding for the museum wing felt tragic back in 2018.",
        correctComeback: "It proved to be a blessing in disguise because international donors stepped in.",
        targetIdiom: "blessing in disguise",
        contextFa: "توفیق اجباری و خیریت پنهان در پس حادثه‌ای تلخ",
      },
    ],
    distractorPool: [
      "Someone in marketing definitely spilled the beans before the embargo.",
      "He was caught red-handed tampering with ballot boxes.",
      "The CEO is skating on extremely thin ice with bank regulators.",
    ],
  },

  // --- C1 Scenario 7 (AEF 5 Unit 7: Artificial Intelligence, Automation & Ethics) ---
  {
    id: "c1-sc-u7",
    cefr: "C1",
    unit: 7,
    stageNumber: 7,
    titleEn: "The Autonomous Algorithm Inquiry",
    titleFa: "کمیته اخلاقی هوش مصنوعی و اتوماسیون",
    topicEn: "Technology Revolution & Bioethics",
    topicFa: "پارادایم فناوری، تیغ دو لبه و مرزهای هوش مصنوعی",
    partnerName: "Dr. Aris Thorne",
    partnerRole: "Director of Ethical Computing",
    partnerAvatar: "🔬",
    partnerFlag: "🇨🇭 Zurich",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Our neural networks can now diagnose radiological scans twenty times faster than physicians. How significant is this?",
        correctComeback: "We are witnessing a genuine paradigm shift in clinical diagnostic workflows.",
        targetIdiom: "paradigm shift",
        contextFa: "تحول بنیادین در پارادایم و الگوهای کهن",
      },
      {
        turnIndex: 1,
        partnerPrompt: "However, hospital administrators want to remove doctor oversight completely to save money.",
        correctComeback: "Automated diagnosis is a double-edged sword; unchecked speed creates fatal risks.",
        targetIdiom: "double-edged sword",
        contextFa: "شمشیر دو لبه و منافع توام با خطرات جدی",
      },
      {
        turnIndex: 2,
        partnerPrompt: "What happens if we permit machine learning models to approve insurance claims without human review?",
        correctComeback: "That is a slippery slope toward completely eroding patient advocacy and empathy.",
        targetIdiom: "slippery slope",
        contextFa: "شیب لغزنده و پرتگاه تصمیمات خطرناک پیاپی",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Where should the engineering council draw the boundary on algorithmic autonomy?",
        correctComeback: "We must continually push boundaries while keeping human compassion non-negotiable.",
        targetIdiom: "push boundaries",
        contextFa: "فراتر رفتن از مرزهای دانش ضمن حفظ اصول",
      },
    ],
    distractorPool: [
      "I traveled on a shoestring by staying in student hostels.",
      "He has always had a chip on his shoulder regarding his Ivy League peers.",
      "Their acquisition was a Pyrrhic victory that crippled cash flow.",
    ],
  },

  // --- C1 Scenario 8 (AEF 5 Unit 8: Media Spin, Fake News & Public Scrutiny) ---
  {
    id: "c1-sc-u8",
    cefr: "C1",
    unit: 8,
    stageNumber: 8,
    titleEn: "The Press Room Crisis Management",
    titleFa: "اتاق جنگ روابط عمومی در برابر اخبار جعلی",
    topicEn: "Media, Spin Doctors & Sensationalism",
    topicFa: "تحریف رسانه‌ای، شایعات و کنترل بحران خبر",
    partnerName: "Gemma Lawson",
    partnerRole: "Whitehall Communications Strategist",
    partnerAvatar: "🎙️",
    partnerFlag: "🇬🇧 London",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "A partisan blog claims our environmental agency buried water contamination test data. How should the public treat it?",
        correctComeback: "Voters should take that malicious internet gossip with a huge grain of salt.",
        targetIdiom: "take with a grain of salt",
        contextFa: "تردید عاقلانه و باور نکردن فوری شایعات",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Did the opposition spokesperson answer inquiries about their undisclosed funding?",
        correctComeback: "Not at all; their PR machine attempted to spin the truth with evasive doublespeak.",
        targetIdiom: "spin the truth",
        contextFa: "تحریف حقیقت و روایت‌سازی جانبدارانه",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Who tipped off the press before our official scientific findings were verified?",
        correctComeback: "Someone in communications definitely spilled the beans prematurely.",
        targetIdiom: "spill the beans",
        contextFa: "افشای زودهنگام راز و لو دادن اطلاعات",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Is the contamination as catastrophic as sensationalist headlines suggest?",
        correctComeback: "Not in the slightest; tabloid journalists blew it completely out of proportion.",
        targetIdiom: "blow out of proportion",
        contextFa: "بزرگ‌نمایی افراطی و کوه ساختن از کاه",
      },
    ],
    distractorPool: [
      "Preserving the status quo is completely untenable in this market.",
      "We've been burning the midnight oil to submit our pitch.",
      "It literally cost an arm and a leg to build the prototype.",
    ],
  },

  // --- C1 Scenario 9 (AEF 5 Unit 9: Globetrotting, Off-Grid Travel & Culture Shock) ---
  {
    id: "c1-sc-u9",
    cefr: "C1",
    unit: 9,
    stageNumber: 9,
    titleEn: "The Expedition Across Patagonia",
    titleFa: "ماجراجویی در مسیرهای بکر و مدیریت سفر",
    topicEn: "Travel, Wanderlust & Cultural Immersion",
    topicFa: "عطش سفر، مسیرهای بکر و سازگاری با محیط",
    partnerName: "Mateo Alvarez",
    partnerRole: "Alpine Expedition Guide",
    partnerAvatar: "🧗‍♂️",
    partnerFlag: "🇦🇷 Bariloche",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "You left your comfortable desk job to trek across the Andes alone for two months. What drove you?",
        correctComeback: "I had terrible itchy feet and couldn't bear another year confined to an office.",
        targetIdiom: "itchy feet",
        contextFa: "بی‌قراری و اشتیاق مقاومت‌ناپذیر برای سفر",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Most foreign tourists remain inside luxury resorts in Puerto Montt. Why venture inland?",
        correctComeback: "I wanted to explore off the beaten track where wild habitats remain untouched.",
        targetIdiom: "off the beaten track",
        contextFa: "سفر به نقاط بکر و دور از مسیر گردشگران عادی",
      },
      {
        turnIndex: 2,
        partnerPrompt: "How can a young freelancer afford six months of international travel?",
        correctComeback: "I traveled on a shoestring by hitchhiking, cooking staples, and camping.",
        targetIdiom: "travel on a shoestring",
        contextFa: "سفر بسیار ارزان و مدیریت هزینه‌های سفر",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Was navigating rural Patagonian dialects and extreme weather overwhelming initially?",
        correctComeback: "It was quite a culture shock at first, but I am rapidly finding my feet.",
        targetIdiom: "finding one's feet",
        contextFa: "جا افتادن و مسلط شدن به شرایط محیطی جدید",
      },
    ],
    distractorPool: [
      "The audit team left no stone unturned during their inspection.",
      "Decisive executive decree was required to cut the Gordian knot.",
      "He attempted to sweep the merger blunders under the carpet.",
    ],
  },

  // --- C1 Scenario 10 (AEF 5 Unit 10: Legal Justice, Whistleblowing & Drawing the Line) ---
  {
    id: "c1-sc-u10",
    cefr: "C1",
    unit: 10,
    stageNumber: 10,
    titleEn: "The Corporate Whistleblower Hearing",
    titleFa: "جلسه استماع سوت‌زنی و خطوط قرمز اخلاقی",
    topicEn: "Law, Justice & Whistleblowing",
    topicFa: "عدالت قضایی، سوت‌زنی و مرزبندی‌های اخلاقی",
    partnerName: "Elena Rostova",
    partnerRole: "Chief Federal Prosecutor",
    partnerAvatar: "⚖️",
    partnerFlag: "🇺🇸 Washington",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "The pharmaceutical manufacturer concealed trial failure logs for three consecutive years. What now?",
        correctComeback: "It is finally time for culpable corporate executives to face the music.",
        targetIdiom: "face the music",
        contextFa: "پذیرش عواقب اعمال و پاسخگویی در پیشگاه قانون",
      },
      {
        turnIndex: 1,
        partnerPrompt: "How did internal regulators uncover the encrypted records after they were supposedly shredded?",
        correctComeback: "Forensic investigators left no stone unturned across their offsite cloud backups.",
        targetIdiom: "leave no stone unturned",
        contextFa: "جستجوی موشکافانه و بررسی تمام ابعاد پنهان",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Did the chief compliance officer realize what was happening inside laboratory testing?",
        correctComeback: "He turned a blind eye to obvious safety breaches to secure his quarterly bonus.",
        targetIdiom: "turn a blind eye",
        contextFa: "چشم‌پوشی تعمدی و نادیده گرفتن تخلفات",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Did the defence counsel advise their client to forge falsified validation documents?",
        correctComeback: "Even their aggressive attorneys refused; that is where they firmly drew the line.",
        targetIdiom: "draw the line",
        contextFa: "خط قرمز اخلاقی و مرزبندی صریح در برابر خلاف",
      },
    ],
    distractorPool: [
      "Her keynote speech commanded unconditional academic respect.",
      "We expect to break even by the end of third quarter.",
      "His complimentary remarks were transparently sycophantic behavior.",
    ],
  },

  // =========================================================================
  // CEFR C2 SCENARIOS (Mastery, Executive Debates, Classical Rhetoric)
  // =========================================================================

  // --- C2 Scenario 1: Executive Crises & High-Stakes Classical Dilemmas ---
  {
    id: "c2-sc-1",
    cefr: "C2",
    unit: 1,
    stageNumber: 1,
    titleEn: "The Sovereign Hostile Takeover",
    titleFa: "بحران تصاحب خصمانه و مانورهای استراتژیک",
    topicEn: "Executive Strategy & Classical Allegories",
    topicFa: "تصمیم‌گیری در بحران، پیروزی‌های پرهزینه و شمشیر داموکلس",
    partnerName: "Victoria Sterling",
    partnerRole: "Managing Director of Sovereign Capital",
    partnerAvatar: "💼",
    partnerFlag: "🇬🇧 London",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "We defeated the hostile takeover bid, but our treasury is depleted and bond ratings were downgraded.",
        correctComeback: "At what catastrophic expense? Surviving this battle was a quintessential Pyrrhic victory.",
        targetIdiom: "Pyrrhic victory",
        contextFa: "پیروزی فوق‌العاده پرهزینه که معادل شکست است",
      },
      {
        turnIndex: 1,
        partnerPrompt: "The antitrust regulator has launched an emergency enquiry into our liquidity covenants.",
        correctComeback: "That regulatory threat hangs over our boardroom perpetually like the Sword of Damocles.",
        targetIdiom: "Sword of Damocles",
        contextFa: "خطر دائمی و شمشیر معلق که هر لحظه ممکن است فرود آید",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Their conglomerate claims an unbreachable corporate governance structure.",
        correctComeback: "Complacent oversight in their overseas subsidiaries remains their fatal Achilles' heel.",
        targetIdiom: "Achilles' heel",
        contextFa: "پاشنه آشیل و آسیب‌پذیری مرگبار در سیستم به ظاهر نفوذناپذیر",
      },
      {
        turnIndex: 3,
        partnerPrompt: "How can we disentangle thirty years of conflicting inter-company debt guarantees?",
        correctComeback: "Decisive executive liquidation is the only realistic way to cut this Gordian knot.",
        targetIdiom: "cut the Gordian knot",
        contextFa: "بریدن گره کور با اقدامی قاطع و رادیکال",
      },
    ],
    distractorPool: [
      "Let's call it a day and resume our review tomorrow morning.",
      "He wore his heart on his sleeve during the quarterly debrief.",
      "We will tighten our belts and eliminate all non-core expenses.",
    ],
  },

  // --- C2 Scenario 2: High-Level Diplomatic Treaty & Multilateral Accord ---
  {
    id: "c2-sc-2",
    cefr: "C2",
    unit: 2,
    stageNumber: 2,
    titleEn: "The Multilateral Climate Accord",
    titleFa: "مذاکرات معاهده اقلیمی و بده‌بستان‌های دیپلماتیک",
    topicEn: "Geopolitics, Statecraft & Diplomacy",
    topicFa: "دیپلماسی بین‌المللی، امتیازات متقابل و شرایط لازم",
    partnerName: "Dr. Henri Moreau",
    partnerRole: "UN Special Envoy on Climate Security",
    partnerAvatar: "🌐",
    partnerFlag: "🇨🇭 Geneva",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Developing nations refuse to sign the carbon reduction pact without binding technological subsidies.",
        correctComeback: "Multilateral progress will stall unless we offer an equitable quid pro quo.",
        targetIdiom: "quid pro quo",
        contextFa: "بده‌بستان و معامله متقابل پایاپای در دیپلماسی",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Can we preserve the current voluntary emission reporting framework without sanctions?",
        correctComeback: "Absolutely not; preserving the toothless status quo is completely untenable.",
        targetIdiom: "status quo",
        contextFa: "وضعیت موجود ناکارآمد و اصرار بر حفظ آن",
      },
      {
        turnIndex: 2,
        partnerPrompt: "What is the single non-negotiable prerequisite before industrialized nations ratify?",
        correctComeback: "Verifiable reciprocal satellite monitoring is the absolute sine qua non.",
        targetIdiom: "sine qua non",
        contextFa: "شرط لازم و جزء اساسی غیرقابل مذاکره",
      },
      {
        turnIndex: 3,
        partnerPrompt: "The two negotiating blocs haven't moved an inch regarding maritime territorial waters.",
        correctComeback: "They remain stubbornly at loggerheads over offshore renewable licensing.",
        targetIdiom: "at loggerheads",
        contextFa: "سرشاخ شدن و اختلاف‌نظر عمیق حل‌نشده",
      },
    ],
    distractorPool: [
      "She had itchy feet and booked a transatlantic ticket overnight.",
      "The board tried to sweep financial irregularities under the carpet.",
      "He was caught red-handed altering the ledger numbers.",
    ],
  },

  // --- C2 Scenario 3: Academic Rhetoric, Scholarly Rigor & Fallacies ---
  {
    id: "c2-sc-3",
    cefr: "C2",
    unit: 3,
    stageNumber: 3,
    titleEn: "The Oxford Colloquium Defense",
    titleFa: "مناظره آکادمیک آکسفورد و دفاع از برهان علمی",
    topicEn: "Scholarly Wit, Epistemology & Argumentation",
    topicFa: "فصاحت کلام، سوگیری تاییدی و نقد استدلال‌های رقیب",
    partnerName: "Prof. Alistair Finch",
    partnerRole: "Oxford Fellow in Theoretical Epistemology",
    partnerAvatar: "🎓",
    partnerFlag: "🇬🇧 Oxford",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Critics claim your statistical sample in the sociological survey was curated selectively.",
        correctComeback: "We erected double-blind protocols specifically against insidious confirmation bias.",
        targetIdiom: "confirmation bias",
        contextFa: "سوگیری تاییدی و گزینش شواهد همسو با فرضیه",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Why are you rigorously contesting my corollary if you concede my opening premise?",
        correctComeback: "I am deliberately playing devil's advocate to stress-test your foundational logic.",
        targetIdiom: "play devil's advocate",
        contextFa: "ایفای نقش وکیل مدافع شیطان برای سنجش استحکام نظریه",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Can our unified institutional framework survive aggressive judicial scrutiny?",
        correctComeback: "Undoubtedly; our empirical documentation is completely unassailable.",
        targetIdiom: "unassailable",
        contextFa: "خدشه‌ناپذیر، مستحکم و غیرقابل مناقشه",
      },
      {
        turnIndex: 3,
        partnerPrompt: "The junior dean lavishes constant praise upon university trustees.",
        correctComeback: "His transparently sycophantic posturing is frankly contemptible to the faculty.",
        targetIdiom: "sycophantic",
        contextFa: "چاپلوسانه و متملقانه جهت کسب منفعت",
      },
    ],
    distractorPool: [
      "It literally cost an arm and a leg to revamp the faculty lounge.",
      "Hindsight is always twenty-twenty when looking back at tenure votes.",
      "We must call it a day and convene tomorrow at ten.",
    ],
  },

  // --- C2 Scenario 4: Black Swan Disruptions, Volatility & Antifragility ---
  {
    id: "c2-sc-4",
    cefr: "C2",
    unit: 4,
    stageNumber: 4,
    titleEn: "The Macro Fund Resilience Strategy",
    titleFa: "استراتژی پادشکنندگی صندوق کلان در برابر شوک‌ها",
    topicEn: "Macroeconomics, Risk Management & Epistemology",
    topicFa: "مدیریت بحران‌های قوی سیاه و پادشکنندگی سیستم‌ها",
    partnerName: "Julian Vance",
    partnerRole: "Chief Risk Officer at Sovereign Partners",
    partnerAvatar: "📊",
    partnerFlag: "🇺🇸 Manhattan",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "A sovereign default and supply chain collapse occurred simultaneously. Can standard diversification save us?",
        correctComeback: "By cultivating organizational antifragility rather than rigid defensive postures.",
        targetIdiom: "antifragility",
        contextFa: "پادشکنندگی و قوی‌تر شدن در اثر تنش و شوک",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Did our quantitative algorithms identify the fraud before the exchange halted trading?",
        correctComeback: "Fabricating shell transactions was his established and brazen modus operandi.",
        targetIdiom: "modus operandi",
        contextFa: "شیوه و الگوی عملیاتی ثابت مجرم",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Did the venture fund survive the collapse of the commercial banking partner?",
        correctComeback: "Substantial cash reserves allowed them to weather the storm without panic.",
        targetIdiom: "weather the storm",
        contextFa: "پشت سر گذاشتن بحران سهمگین با آرامش",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Can a global macro fund avoid exposure to chronic geopolitical shocks?",
        correctComeback: "Not in the slightest; volatility is part and parcel of macroeconomic alpha.",
        targetIdiom: "part and parcel",
        contextFa: "جزء لاینفک و بخش جدایی‌ناپذیر پدیده",
      },
    ],
    distractorPool: [
      "He was caught red-handed altering the quarterly accounting balance.",
      "They drifted apart after the estate properties were liquidated.",
      "I had itchy feet and decided to hike across South America.",
    ],
  },

  // --- C2 Scenario 5: Constitutional Jurisprudence & Appellate Bench (Stage 5) ---
  {
    id: "c2-sc-5",
    cefr: "C2",
    unit: 5,
    stageNumber: 5,
    titleEn: "The Supreme Court Constitutional Hearing",
    titleFa: "جلسه استماع دادگاه قانون اساسی و تفسیر حقوقی",
    topicEn: "Constitutional Law, Jurisprudence & Judicial Precedent",
    topicFa: "تفسیر قانون اساسی، شیب لغزنده و رویه‌های قضایی",
    partnerName: "Judge Evelyn Stone",
    partnerRole: "Chief Appellate Justice",
    partnerAvatar: "⚖️",
    partnerFlag: "🇺🇸 Washington D.C.",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Counselor, how do you defend applying emergency statutes during peacetime surveillance?",
        correctComeback: "Granting unchecked executive discretion sets us upon an exceedingly slippery slope.",
        targetIdiom: "slippery slope",
        contextFa: "مغالطه شیب لغزنده و سقوط گام به گام در دام اشتباه",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Has any external legal scholar submitted independent advisory briefs on the clause?",
        correctComeback: "Civil liberty associations have submitted extensive amicus curiae briefings.",
        targetIdiom: "amicus curiae",
        contextFa: "لایحه حقوقی دوست دادگاه از سوی نهادهای بی‌طرف",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Should this bench interpret the charter according to modern ethics or strict statutory wording?",
        correctComeback: "We must adhere faithfully to the spirit rather than merely the rigid letter of the law.",
        targetIdiom: "letter of the law",
        contextFa: "پایبندی صوری به متن در برابر روح و مقصود قانون",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Can the appellate court casually overturn sixty years of continuous common-law ruling?",
        correctComeback: "Stare decisis demands that we respect long-standing and venerable precedent.",
        targetIdiom: "judicial precedent / stare decisis",
        contextFa: "احترام به رویه و سنت قضایی پایدار",
      },
    ],
    distractorPool: [
      "Let's not jump the gun before reviewing quarterly profit statements.",
      "He wore his heart on his sleeve during the political debate.",
      "We will tighten our belts and downsize office space.",
    ],
  },

  // --- C2 Scenario 6: Deep Tech Frontier & Algorithmic Ethics (Stage 6) ---
  {
    id: "c2-sc-6",
    cefr: "C2",
    unit: 6,
    stageNumber: 6,
    titleEn: "The Frontier Quantum & Synthetic Cognition",
    titleFa: "مرزهای هوش مصنوعی و دوگانگی فناوری‌های دگرگون‌ساز",
    topicEn: "Technological Singularity, Philosophy of Mind & Ethics",
    topicFa: "جهش‌های پارادایمی، تیغ دو لبه و نوشداروی کاذب",
    partnerName: "Dr. Aris Thorne",
    partnerRole: "Quantum Architecture Fellow",
    partnerAvatar: "🔬",
    partnerFlag: "🇨🇭 Zurich",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Are the new autonomous neural architectures merely incremental mathematical optimizations?",
        correctComeback: "By no means; they represent a seismic and irreversible paradigm shift.",
        targetIdiom: "paradigm shift",
        contextFa: "تغییر و جهش بنیادین در الگو و پارادایم علمی",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Can synthetic agents be deployed unconditionally to administer medical triage?",
        correctComeback: "Algorithmic triage is a classic double-edged sword demanding rigorous oversight.",
        targetIdiom: "double-edged sword",
        contextFa: "تیغ دو لبه با مزایا و خطرات همزمان",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Silicon Valley venture capital heralds deep learning as the answer to every structural bottleneck.",
        correctComeback: "Overpromising tech executives mistakenly treat automation as a universal panacea.",
        targetIdiom: "panacea",
        contextFa: "نوشدارو و درمان عام و همگانی برای همه دردها",
      },
      {
        turnIndex: 3,
        partnerPrompt: "How do our current quantum coherence algorithms rank against worldwide standards?",
        correctComeback: "Our topological qubits are at the very cutting edge of condensed matter physics.",
        targetIdiom: "cutting edge",
        contextFa: "لبه فناوری و پیشروترین مرز علم",
      },
    ],
    distractorPool: [
      "I had itchy feet and decided to hike across Patagonia.",
      "The board tried to sweep the deficit under the carpet.",
      "It cost an arm and a leg to lease the warehouse.",
    ],
  },

  // --- C2 Scenario 7: Sovereign Debt, Central Banking & Systemic Risk (Stage 7) ---
  {
    id: "c2-sc-7",
    cefr: "C2",
    unit: 7,
    stageNumber: 7,
    titleEn: "The Sovereign Liquidity & Central Bank Summit",
    titleFa: "بحران نقدینگی حاکمیتی و خطرات سیستماتیک پولی",
    topicEn: "Monetary Policy, Sovereign Solvency & Moral Hazard",
    topicFa: "مخاطره اخلاقی، تله نقدینگی و اختیارات تام مالی",
    partnerName: "Dame Margot Vance",
    partnerRole: "Governor of Central Reserve Board",
    partnerAvatar: "🏦",
    partnerFlag: "🇬🇧 London",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "If the central bank unreservedly guarantees all distressed commercial bank deposits, what danger looms?",
        correctComeback: "Unconditional safety nets inevitably breed reckless moral hazard.",
        targetIdiom: "moral hazard",
        contextFa: "مخاطره اخلاقی ناشی از تضمین‌های بی قید و شرط",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Can additional interest rate reductions stimulate private investment when rates approach zero?",
        correctComeback: "Further monetary easing is futile because we are trapped in a liquidity trap.",
        targetIdiom: "liquidity trap",
        contextFa: "تله نقدینگی و بی‌اثر شدن سیاست کاهش نرخ بهره",
      },
      {
        turnIndex: 2,
        partnerPrompt: "Did the parliamentary commission grant the ministry full spending discretion without audit?",
        correctComeback: "No responsible treasury should ever grant the executive arm carte blanche.",
        targetIdiom: "carte blanche",
        contextFa: "اختیار تام و چک سفید امضا دادن به مجریان",
      },
      {
        turnIndex: 3,
        partnerPrompt: "How must public corporations react to the surging sovereign debt spread?",
        correctComeback: "Both public and private institutions must drastically tighten their belts.",
        targetIdiom: "tighten one's belt",
        contextFa: "ریاضت اقتصادی و انضباط سختگیرانه در هزینه‌ها",
      },
    ],
    distractorPool: [
      "He was caught red-handed altering the stock registers.",
      "We will call it a day and finish the audit on Monday.",
      "She wore her heart on her sleeve during the staff briefing.",
    ],
  },

  // --- C2 Scenario 8: Investigative Syndicate & Geopolitical Exposure (Stage 8) ---
  {
    id: "c2-sc-8",
    cefr: "C2",
    unit: 8,
    stageNumber: 8,
    titleEn: "The Transnational Offshore Dossier",
    titleFa: "افشاگری سندیکای فراملی درباره دارایی‌های پنهان",
    topicEn: "Investigative Journalism, Offshore Tax Havens & Disinformation",
    topicFa: "پرده‌پوشی، فریب افکار عمومی و ابعاد پنهان فساد",
    partnerName: "Marcus Holloway",
    partnerRole: "Editor-in-Chief of Investigative Syndicate",
    partnerAvatar: "🕵️",
    partnerFlag: "🇩🇪 Berlin",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "The state energy monopoly claims their offshore trust was merely a standard administrative vehicle.",
        correctComeback: "Their convoluted offshore structure is pure smoke and mirrors to evade audit.",
        targetIdiom: "smoke and mirrors",
        contextFa: "شعبده‌بازی رسانه‌ای، دود و آینه جهت فریب افکار عمومی",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Have our journalists published the entire cache of leaked diplomatic cables?",
        correctComeback: "Our initial leak exposes barely the tip of the iceberg of corporate graft.",
        targetIdiom: "tip of the iceberg",
        contextFa: "نوک کوه یخ و مشتی نمونه خروار از فساد گسترده",
      },
      {
        turnIndex: 2,
        partnerPrompt: "How did security agencies retaliate against the whistleblower in Geneva?",
        correctComeback: "They froze his family assets and revoked his diplomatic passport in cold blood.",
        targetIdiom: "in cold blood",
        contextFa: "با سنگدلی و خونسردی تمام و بی‌رحمانه",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Who authorized the senior analyst to leak the encrypted ledger to the press?",
        correctComeback: "A courageous insider decided to spill the beans to expose toxic dumping.",
        targetIdiom: "spill the beans",
        contextFa: "افشای حقایق و لو دادن اسرار نهفته",
      },
    ],
    distractorPool: [
      "I had itchy feet and booked a ticket across the Himalayas.",
      "They drifted apart after the legal proceedings commenced.",
      "It cost an arm and a leg to install the surveillance suite.",
    ],
  },

  // --- C2 Scenario 9: Geopolitical Diplomacy & Brinkmanship (Stage 9) ---
  {
    id: "c2-sc-9",
    cefr: "C2",
    unit: 9,
    stageNumber: 9,
    titleEn: "The Nuclear Non-Proliferation Brinkmanship",
    titleFa: "دیپلماسی لبه پرتگاه و پیمان‌های خلع سلاح هسته‌ای",
    topicEn: "Geopolitics, Deterrence Theory & Bilateral Treaties",
    topicFa: "سیاست لبه پرتگاه، شاخه زیتون و بن‌بست دیپلماتیک",
    partnerName: "Ambassador Carlos Mendez",
    partnerRole: "Senior Multilateral Peace Negotiator",
    partnerAvatar: "🕊️",
    partnerFlag: "🇦🇹 Vienna",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Both nuclear superpowers have concentrated naval armadas in the contested strait.",
        correctComeback: "This perilous standoff is an irresponsible exercise in geopolitical brinkmanship.",
        targetIdiom: "brinkmanship",
        contextFa: "سیاست لبه پرتگاه تا مرز انفجار و جنگ پیش رفتن",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Did the insurgent coalition respond when the prime minister offered a ceasefire dialogue?",
        correctComeback: "They cynically rebuffed the peaceful olive branch extended by the envoy.",
        targetIdiom: "olive branch",
        contextFa: "شاخه زیتون و پیشنهاد صلح و آشتی",
      },
      {
        turnIndex: 2,
        partnerPrompt: "If uranium enrichment proceeds beyond eighty-five percent, can war be averted?",
        correctComeback: "Passing that threshold represents an irrevocable point of no return.",
        targetIdiom: "point of no return",
        contextFa: "نقطه بی‌بازگشت که پس از آن بازگشتی نیست",
      },
      {
        turnIndex: 3,
        partnerPrompt: "Have the bilateral treaty working groups reached consensus on ballistic inspections?",
        correctComeback: "Negotiations have reached a complete and intractable stalemate.",
        targetIdiom: "stalemate",
        contextFa: "بن‌بست کامل و قفل شدن مذاکرات",
      },
    ],
    distractorPool: [
      "Let's not jump the gun before reviewing the quarterly tax statements.",
      "He was caught red-handed forging the corporate signature.",
      "The council had to call it a day and adjourn until spring.",
    ],
  },

  // --- C2 Scenario 10: Classical Epistemology & Philosophical Summit (Stage 10) ---
  {
    id: "c2-sc-10",
    cefr: "C2",
    unit: 10,
    stageNumber: 10,
    titleEn: "The Sorbonne Philosophical Colloquium",
    titleFa: "مناظره معرفت‌شناسی دانشگاه سوربن و رساله سترگ فکری",
    topicEn: "Classical Epistemology, Philosophy of Mind & Aesthetics",
    topicFa: "لوح سپید ذهن، شاهکار ماندگار و واقعیت‌های دوفاکتو",
    partnerName: "Prof. Beatrice Von Stern",
    partnerRole: "Chair of Continental Metaphysics",
    partnerAvatar: "🏛️",
    partnerFlag: "🇫🇷 Paris",
    turns: [
      {
        turnIndex: 0,
        partnerPrompt: "Does developmental neurobiology uphold the empiricist doctrine that infants possess no innate structures?",
        correctComeback: "Modern cognitive science roundly disproves the notion of an absolute tabula rasa.",
        targetIdiom: "tabula rasa",
        contextFa: "لوح سپید و ذهن خالی از تصورات پیشین",
      },
      {
        turnIndex: 1,
        partnerPrompt: "Has the breakaway territory attained international legal recognition as a sovereign republic?",
        correctComeback: "While lacking de jure recognition, it functions as a de facto independent state.",
        targetIdiom: "de facto",
        contextFa: "دوفاکتو و در عمل گرچه نه طبق قانون رسمی",
      },
      {
        turnIndex: 2,
        partnerPrompt: "When will the faculty senate reconvene regarding the canon curriculum reforms?",
        correctComeback: "The provost adjourned the controversial deliberations sine die.",
        targetIdiom: "sine die",
        contextFa: "بدون تعیین وقت و موکول به زمانی نامعلوم",
      },
      {
        turnIndex: 3,
        partnerPrompt: "How does the academic community evaluate Professor Weber's monumental forty-year treatise on consciousness?",
        correctComeback: "Unanimously hailed as the crowning magnum opus of contemporary metaphysics.",
        targetIdiom: "magnum opus",
        contextFa: "شاهکار و بزرگ‌ترین اثر عمر یک متفکر",
      },
    ],
    distractorPool: [
      "It literally cost an arm and a leg to build the university hall.",
      "She had itchy feet and departed suddenly for the Arctic circle.",
      "He wore his heart on his sleeve during the faculty senate election.",
    ],
  },
];

/**
 * Retrieves scenarios for a specific CEFR level (C1 or C2).
 * Shuffles scenarios so learners get variety on each stage attempt.
 */
export function getScenariosForLevel(cefr: "C1" | "C2"): ContinuousDialogueScenario[] {
  const filtered = CONTINUOUS_DIALOGUE_SCENARIOS.filter((s) => s.cefr === cefr);
  return [...filtered].sort(() => 0.5 - Math.random());
}

/**
 * Retrieves the best scenario for a specific stage number (1 to 10),
 * falling back gracefully if stageNumber exceeds scenario count.
 */
export function getScenarioForStage(cefr: "C1" | "C2", stageNumber: number): ContinuousDialogueScenario {
  const matching = CONTINUOUS_DIALOGUE_SCENARIOS.filter(
    (s) => s.cefr === cefr && s.stageNumber === stageNumber
  );
  if (matching.length > 0) {
    return matching[Math.floor(Math.random() * matching.length)];
  }

  const pool = CONTINUOUS_DIALOGUE_SCENARIOS.filter((s) => s.cefr === cefr);
  return pool[stageNumber % pool.length] || pool[0];
}
