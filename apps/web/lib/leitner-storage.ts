export type LeitnerBoxLevel = 1 | 2 | 3 | 4 | 5;

export interface LeitnerCard {
  id: string;
  category: string; // "grammar" | "vocabulary" | "pronunciation" | "l1_persian" | "collocation"
  categoryLabelFa: string;
  sourceTitle: string; // e.g. "کلاس آنلاین با استاد رضایی"
  originalMistake: string; // ❌ What went wrong
  correctedText: string; // ✅ Standard correct sentence
  explanationFa: string; // 💡 Linguistic root cause
  exampleSentenceEn?: string;
  boxLevel: LeitnerBoxLevel;
  intervalDays: number;
  lastReviewedAt?: string; // ISO
  nextReviewAt: string; // ISO
  totalReviews: number;
  consecutiveSuccesses: number;
  lapseCount: number;
  isMastered: boolean;
  createdAt: string;
}

export interface LeitnerDeckStats {
  totalCards: number;
  dueTodayCount: number;
  boxCounts: Record<LeitnerBoxLevel, number>;
  masteredCount: number;
  successRatePercentage: number;
}

export const LEITNER_INTERVALS: Record<LeitnerBoxLevel, number> = {
  1: 1, // 1 day
  2: 3, // 3 days
  3: 7, // 1 week
  4: 14, // 2 weeks
  5: 30, // 1 month / Mastered
};

export const LEITNER_BOX_META: Record<
  LeitnerBoxLevel,
  { labelFa: string; color: string; intervalDescFa: string }
> = {
  1: { labelFa: "خانه ۱: تازه‌واردها", color: "#ef4444", intervalDescFa: "مرور روزانه (هر ۱ روز)" },
  2: { labelFa: "خانه ۲: در حال یادگیری", color: "#f97316", intervalDescFa: "هر ۳ روز یک‌بار" },
  3: { labelFa: "خانه ۳: تثبیت اولیه", color: "#eab308", intervalDescFa: "هر هفته (۷ روز)" },
  4: { labelFa: "خانه ۴: حافظه پایدار", color: "#3b82f6", intervalDescFa: "هر ۲ هفته (۱۴ روز)" },
  5: { labelFa: "خانه ۵: فتح‌شده طلایی", color: "#10b981", intervalDescFa: "ماهانه / گنجینه تسلط" },
};

const STORAGE_KEY = "endoora_leitner_deck_v1";
const CLASSROOM_MISTAKES_KEY = "endoora_learner_mistakes_v1";

export const INITIAL_SEEDED_MISTAKES: LeitnerCard[] = [
  {
    id: "seed-agree-1",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    sourceTitle: "کالبدشکافی خطاهای متداول فارسی‌زبان‌ها",
    originalMistake: "I am agree with your opinion about modern technology.",
    correctedText: "I agree with your opinion about modern technology.",
    explanationFa:
      "فعل agree در زبان انگلیسی یک فعل اصلی است و نیازی به فعل کمکی to be (مانند am) ندارد. در فارسی می‌گوییم «موافق هستم» که صفت است، اما در انگلیسی یک فعل تام است.",
    exampleSentenceEn: "I wholeheartedly agree with the proposed environmental policy.",
    boxLevel: 1,
    intervalDays: 1,
    nextReviewAt: new Date().toISOString(), // due today
    totalReviews: 0,
    consecutiveSuccesses: 0,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-discuss-2",
    category: "l1_persian",
    categoryLabelFa: "تداخل زبان فارسی (L1 Transfer)",
    sourceTitle: "استودیوی کلاس زنده ایندورا",
    originalMistake: "We discussed about the new marketing proposal yesterday.",
    correctedText: "We discussed the new marketing proposal yesterday.",
    explanationFa:
      "فعل discuss متعدی مستقیم است و نباید بعد از آن حرف اضافه about آورده شود. این خطا ناشی از ترجمه کلمه‌به‌کلمه عبارت «بحث کردن درباره» است.",
    exampleSentenceEn: "The committee will discuss the annual financial budget tomorrow.",
    boxLevel: 1,
    intervalDays: 1,
    nextReviewAt: new Date().toISOString(), // due today
    totalReviews: 0,
    consecutiveSuccesses: 0,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-make-do-3",
    category: "collocation",
    categoryLabelFa: "همایند واژگان (Collocation)",
    sourceTitle: "کلینیک رایتینگ آیلتس",
    originalMistake: "It is difficult to do a decision under heavy pressure.",
    correctedText: "It is difficult to make a decision under heavy pressure.",
    explanationFa:
      "در زبان فارسی فعل «کردن/انجام دادن» برای تصمیم‌گیری استفاده می‌شود، اما همایند انگلیسی منحصراً 'make a decision' است.",
    exampleSentenceEn: "Leaders must make tough decisions during international crises.",
    boxLevel: 2,
    intervalDays: 3,
    nextReviewAt: new Date().toISOString(), // due today
    totalReviews: 1,
    consecutiveSuccesses: 1,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "seed-stress-4",
    category: "pronunciation",
    categoryLabelFa: "تلفظ و تکیه هجایی (Pronunciation)",
    sourceTitle: "کلینیک اسپیکینگ آیلتس",
    originalMistake: "She is a talented pho-to-GRAPH-er (تکیه اشتباه بر هجای سوم).",
    correctedText: "She is a talented pho-TOG-ra-pher (تکیه اصلی بر هجای دوم).",
    explanationFa:
      "در خانواده واژه photo، با افزودن پسوند -er تکیه به هجای دوم یعنی TOG جابه‌جا می‌شود: /fəˈtɒɡ.rə.fər/.",
    exampleSentenceEn: "The wildlife photographer captured an extraordinary sunset.",
    boxLevel: 2,
    intervalDays: 3,
    nextReviewAt: new Date().toISOString(),
    totalReviews: 1,
    consecutiveSuccesses: 1,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "seed-forward-5",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    sourceTitle: "تمرین تا ۲۰ (زبان دوازدهم)",
    originalMistake: "I am really looking forward to see you soon.",
    correctedText: "I am really looking forward to seeing you soon.",
    explanationFa:
      "در اصطلاح look forward to، کلمه to یک حرف اضافه (Preposition) است نه نشانه مصدر، بنابراین فعل پس از آن حتماً باید ing بگیرد (Gerund).",
    exampleSentenceEn: "We are looking forward to hearing your feedback.",
    boxLevel: 3,
    intervalDays: 7,
    nextReviewAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), // due in 2 days
    totalReviews: 2,
    consecutiveSuccesses: 2,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "seed-despite-6",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    sourceTitle: "کلینیک ریدینگ آیلتس",
    originalMistake: "Despite of the heavy rain, the outdoor match continued.",
    correctedText: "Despite the heavy rain, the outdoor match continued.",
    explanationFa:
      "واژه despite هرگز حرف اضافه of نمی‌گیرد (برخلاف in spite of). ترکیب despite of یک خطای رایج در رایتینگ است.",
    exampleSentenceEn: "Despite numerous financial obstacles, the research project succeeded.",
    boxLevel: 4,
    intervalDays: 14,
    nextReviewAt: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    totalReviews: 3,
    consecutiveSuccesses: 3,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "seed-conditional-7",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    sourceTitle: "کالبدشکافی خطاهای متداول فارسی‌زبان‌ها",
    originalMistake: "If they trained harder, they would win the championship yesterday.",
    correctedText: "If they had trained harder, they would have won the championship yesterday.",
    explanationFa:
      "برای بیان موقعیت‌های فرضی در گذشته، شرطی نوع سوم الزامی است (If + past perfect ... would have + p.p). ترجمه کلمه‌به‌کلمه از فارسی باعث حذف would have می‌شود.",
    exampleSentenceEn: "If I had known about the schedule change, I would have arrived earlier.",
    boxLevel: 1,
    intervalDays: 1,
    nextReviewAt: new Date().toISOString(),
    totalReviews: 0,
    consecutiveSuccesses: 0,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date().toISOString(),
  },
];

export function getLeitnerDeck(): LeitnerCard[] {
  if (typeof window === "undefined") {
    return INITIAL_SEEDED_MISTAKES;
  }

  let deck: LeitnerCard[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      deck = JSON.parse(raw);
    } else {
      deck = [...INITIAL_SEEDED_MISTAKES];
      saveLeitnerDeck(deck);
    }
  } catch {
    deck = [...INITIAL_SEEDED_MISTAKES];
  }

  // Auto-sync any mistakes logged by Classroom Studio
  try {
    const rawClassroom = localStorage.getItem(CLASSROOM_MISTAKES_KEY);
    if (rawClassroom) {
      const classroomMistakes = JSON.parse(rawClassroom);
      let addedCount = 0;
      for (const cm of classroomMistakes) {
        if (!deck.some((c) => c.id === cm.id)) {
          const newCard: LeitnerCard = {
            id: cm.id,
            category: "l1_persian",
            categoryLabelFa: cm.category || "جلسه کلاس زنده",
            sourceTitle: cm.source || "کلاس آنلاین ایندورا",
            originalMistake: cm.originalMistake,
            correctedText: cm.correctedText,
            explanationFa: cm.explanation || "خطای ثبت‌شده در کلاس اختصاصی.",
            boxLevel: 1,
            intervalDays: 1,
            nextReviewAt: new Date().toISOString(),
            totalReviews: 0,
            consecutiveSuccesses: 0,
            lapseCount: 0,
            isMastered: false,
            createdAt: cm.timestamp ? new Date().toISOString() : new Date().toISOString(),
          };
          deck.unshift(newCard);
          addedCount++;
        }
      }
      if (addedCount > 0) {
        saveLeitnerDeck(deck);
      }
    }
  } catch {
    // ignore classroom sync error
  }

  return deck;
}

export function saveLeitnerDeck(deck: LeitnerCard[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
  } catch (err) {
    console.error("Failed to save Leitner deck:", err);
  }
}

export function isCardDue(card: LeitnerCard): boolean {
  if (card.isMastered && card.boxLevel === 5) return false;
  const nextDate = new Date(card.nextReviewAt).getTime();
  const now = Date.now();
  return nextDate <= now;
}

export function getDueCards(deck?: LeitnerCard[]): LeitnerCard[] {
  const cards = deck || getLeitnerDeck();
  return cards.filter(isCardDue);
}

export function promoteCard(cardId: string): { updatedDeck: LeitnerCard[]; updatedCard: LeitnerCard } {
  const deck = getLeitnerDeck();
  const targetIndex = deck.findIndex((c) => c.id === cardId);
  if (targetIndex < 0) {
    throw new Error(`Card not found: ${cardId}`);
  }

  const current = deck[targetIndex];
  const nextBoxLevel = Math.min(5, current.boxLevel + 1) as LeitnerBoxLevel;
  const isMastered = nextBoxLevel === 5;
  const interval = LEITNER_INTERVALS[nextBoxLevel];

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + interval * 24 * 3600 * 1000);

  const updated: LeitnerCard = {
    ...current,
    boxLevel: nextBoxLevel,
    intervalDays: interval,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewDate.toISOString(),
    totalReviews: current.totalReviews + 1,
    consecutiveSuccesses: current.consecutiveSuccesses + 1,
    isMastered,
  };

  deck[targetIndex] = updated;
  saveLeitnerDeck(deck);
  return { updatedDeck: deck, updatedCard: updated };
}

export function demoteCard(cardId: string): { updatedDeck: LeitnerCard[]; updatedCard: LeitnerCard } {
  const deck = getLeitnerDeck();
  const targetIndex = deck.findIndex((c) => c.id === cardId);
  if (targetIndex < 0) {
    throw new Error(`Card not found: ${cardId}`);
  }

  const current = deck[targetIndex];
  const resetBoxLevel: LeitnerBoxLevel = 1;
  const interval = LEITNER_INTERVALS[resetBoxLevel];

  const now = new Date();
  // Due again tomorrow (or in a few hours)
  const nextReviewDate = new Date(now.getTime() + interval * 24 * 3600 * 1000);

  const updated: LeitnerCard = {
    ...current,
    boxLevel: resetBoxLevel,
    intervalDays: interval,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewDate.toISOString(),
    totalReviews: current.totalReviews + 1,
    consecutiveSuccesses: 0,
    lapseCount: current.lapseCount + 1,
    isMastered: false,
  };

  deck[targetIndex] = updated;
  saveLeitnerDeck(deck);
  return { updatedDeck: deck, updatedCard: updated };
}

export function calculateDeckStats(deck?: LeitnerCard[]): LeitnerDeckStats {
  const cards = deck || getLeitnerDeck();
  const boxCounts: Record<LeitnerBoxLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let masteredCount = 0;
  let totalReviewsCount = 0;
  let totalLapses = 0;

  cards.forEach((c) => {
    boxCounts[c.boxLevel] = (boxCounts[c.boxLevel] || 0) + 1;
    if (c.isMastered || c.boxLevel === 5) {
      masteredCount++;
    }
    totalReviewsCount += c.totalReviews;
    totalLapses += c.lapseCount;
  });

  const dueToday = cards.filter(isCardDue).length;
  const successReviews = Math.max(0, totalReviewsCount - totalLapses);
  const successRate =
    totalReviewsCount > 0 ? Math.round((successReviews / totalReviewsCount) * 100) : 100;

  return {
    totalCards: cards.length,
    dueTodayCount: dueToday,
    boxCounts,
    masteredCount,
    successRatePercentage: successRate,
  };
}

export function addCustomMistakeCard(cardData: {
  originalMistake: string;
  correctedText: string;
  explanationFa: string;
  category?: string;
  categoryLabelFa?: string;
  sourceTitle?: string;
}): LeitnerCard {
  const deck = getLeitnerDeck();
  const newCard: LeitnerCard = {
    id: `custom-${Date.now()}`,
    category: cardData.category || "grammar",
    categoryLabelFa: cardData.categoryLabelFa || "خطای یادداشت شخصی",
    sourceTitle: cardData.sourceTitle || "دفترچه شخصی زبان‌آموز",
    originalMistake: cardData.originalMistake.trim(),
    correctedText: cardData.correctedText.trim(),
    explanationFa: cardData.explanationFa.trim() || "یادداشت شخصی تصحیح خطا.",
    boxLevel: 1,
    intervalDays: 1,
    nextReviewAt: new Date().toISOString(), // due immediately
    totalReviews: 0,
    consecutiveSuccesses: 0,
    lapseCount: 0,
    isMastered: false,
    createdAt: new Date().toISOString(),
  };

  deck.unshift(newCard);
  saveLeitnerDeck(deck);
  return newCard;
}
