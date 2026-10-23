import {
  LEITNER_INTERVALS,
  LEITNER_BOX_META,
  INITIAL_SEEDED_MISTAKES,
  calculateDeckStats,
  isCardDue,
  getLeitnerDeck,
  promoteCard,
  demoteCard,
  addCustomMistakeCard,
} from "../apps/web/lib/leitner-storage.ts";

console.log("=== RUNNING LEITNER 5-BOX ENGINE VERIFICATION ===");

// 1. Verify Intervals
const expectedIntervals = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
for (const [box, days] of Object.entries(expectedIntervals)) {
  const boxNum = Number(box);
  if (LEITNER_INTERVALS[boxNum] !== days) {
    throw new Error(`Box ${box} interval mismatch: expected ${days}, got ${LEITNER_INTERVALS[boxNum]}`);
  }
}
console.log("✓ 5-Box Leitner interval progression (1d, 3d, 7d, 14d, 30d) verified.");

// 2. Verify Box Metadata
for (let b = 1; b <= 5; b++) {
  const meta = LEITNER_BOX_META[b];
  if (!meta || !meta.labelFa || !meta.color || !meta.intervalDescFa) {
    throw new Error(`Box ${b} is missing required visual metadata: ${JSON.stringify(meta)}`);
  }
}
console.log("✓ All 5 Box visual metadata descriptors verified.");

// 3. Verify Seeded Dataset
if (!Array.isArray(INITIAL_SEEDED_MISTAKES) || INITIAL_SEEDED_MISTAKES.length < 5) {
  throw new Error(`Expected at least 5 seeded mistake cards, got ${INITIAL_SEEDED_MISTAKES?.length}`);
}

for (const card of INITIAL_SEEDED_MISTAKES) {
  if (!card.id || !card.originalMistake || !card.correctedText || !card.explanationFa) {
    throw new Error(`Invalid seeded card schema: ${JSON.stringify(card)}`);
  }
  if (card.boxLevel < 1 || card.boxLevel > 5) {
    throw new Error(`Invalid boxLevel ${card.boxLevel} on card ${card.id}`);
  }
  if (!card.categoryLabelFa || !card.sourceTitle) {
    throw new Error(`Card ${card.id} is missing category or source metadata`);
  }
}
console.log(`✓ ${INITIAL_SEEDED_MISTAKES.length} Initial Iranian-English mistake cards verified.`);

// 4. Test isCardDue logic
const pastCard = {
  ...INITIAL_SEEDED_MISTAKES[0],
  boxLevel: 1,
  nextReviewAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
};
if (!isCardDue(pastCard)) {
  throw new Error("isCardDue failed: past review date should be due");
}

const futureCard = {
  ...INITIAL_SEEDED_MISTAKES[0],
  boxLevel: 2,
  nextReviewAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 1 day in future
};
if (isCardDue(futureCard)) {
  throw new Error("isCardDue failed: future review date should NOT be due");
}
console.log("✓ Active recall scheduling and due calculation verified.");

// 5. Test Deck Statistics calculation
const sampleDeck = [
  { ...INITIAL_SEEDED_MISTAKES[0], boxLevel: 1, totalReviews: 2, lapseCount: 0, isMastered: false },
  { ...INITIAL_SEEDED_MISTAKES[1], boxLevel: 2, totalReviews: 3, lapseCount: 1, isMastered: false },
  { ...INITIAL_SEEDED_MISTAKES[2], boxLevel: 5, totalReviews: 5, lapseCount: 0, isMastered: true },
];

const stats = calculateDeckStats(sampleDeck);
if (stats.totalCards !== 3) throw new Error(`Stats totalCards mismatch: ${stats.totalCards}`);
if (stats.boxCounts[1] !== 1 || stats.boxCounts[2] !== 1 || stats.boxCounts[5] !== 1) {
  throw new Error(`Stats boxCounts mismatch: ${JSON.stringify(stats.boxCounts)}`);
}
if (stats.masteredCount !== 1) throw new Error(`Stats masteredCount mismatch: ${stats.masteredCount}`);
console.log("✓ Leitner deck aggregate stats computation verified.");

// 6. Test Mock LocalStorage Promotion and Demotion cycle
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

// Initial deck load into mock storage
const initialDeck = getLeitnerDeck();
if (initialDeck.length < 5) throw new Error("getLeitnerDeck failed to seed initial deck");
console.log(`✓ Initial mock deck loaded with ${initialDeck.length} cards.`);

// Test Promotion
const testCardId = initialDeck[0].id;
const initialBox = initialDeck[0].boxLevel;
const promoteResult = promoteCard(testCardId);

if (promoteResult.updatedCard.boxLevel !== initialBox + 1) {
  throw new Error(
    `Promotion failed: expected box ${initialBox + 1}, got ${promoteResult.updatedCard.boxLevel}`
  );
}
if (promoteResult.updatedCard.intervalDays !== LEITNER_INTERVALS[initialBox + 1]) {
  throw new Error(`Promotion interval mismatch`);
}
console.log(`✓ Card promotion verified (Box ${initialBox} -> Box ${promoteResult.updatedCard.boxLevel}).`);

// Test Demotion (Lapse)
const demoteResult = demoteCard(testCardId);
if (demoteResult.updatedCard.boxLevel !== 1) {
  throw new Error(`Demotion failed: card did not reset to Box 1`);
}
if (demoteResult.updatedCard.intervalDays !== 1) {
  throw new Error(`Demotion interval mismatch`);
}
if (demoteResult.updatedCard.lapseCount < 1) {
  throw new Error(`Demotion lapseCount was not incremented`);
}
console.log("✓ Card demotion on lapse verified (resets to Box 1, interval 1d).");

// 7. Test Adding Custom Mistake
const customCard = addCustomMistakeCard({
  originalMistake: "I am agree with you.",
  correctedText: "I agree with you.",
  explanationFa: "فعل agree نیازی به am ندارد.",
  category: "grammar",
});

if (!customCard.id || customCard.boxLevel !== 1 || customCard.intervalDays !== 1) {
  throw new Error(`Custom card creation failed: ${JSON.stringify(customCard)}`);
}
const updatedDeckAfterAdd = getLeitnerDeck();
if (!updatedDeckAfterAdd.some((c) => c.id === customCard.id)) {
  throw new Error("Custom card was not saved to deck");
}
console.log(`✓ Custom learner mistake creation verified (ID: ${customCard.id}).`);

console.log("=== ALL LEITNER ENGINE TESTS PASSED SUCCESSFULLY! ===");
