import {
  CEFR_VOCAB_REGISTRY,
  getVocabForLevel,
  getWordById,
  CEFR_LEVELS_META,
  LEITNER_BOX_META,
  LEITNER_INTERVALS,
} from "../apps/web/data/cefr/index.ts";

console.log("=== RUNNING CEFR VOCABULARY & LEITNER ENGINE TESTS ===");

// 1. Verify all 6 levels exist in registry
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
for (const lvl of levels) {
  const words = getVocabForLevel(lvl);
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error(`Expected vocabulary for level ${lvl}, but found none!`);
  }
  console.log(`✓ Level ${lvl}: loaded ${words.length} vocabulary items`);
}

// 2. Verify A1 Word Schema & Inductive Clues
const a1Words = getVocabForLevel("A1");
const testWord = a1Words.find((w) => w.word === "action") || a1Words[0];
console.log(`Inspecting test word "${testWord.word}":`, {
  id: testWord.id,
  displayTerm: testWord.displayTerm,
  partOfSpeech: testWord.partOfSpeech,
  partOfSpeechLabelFa: testWord.partOfSpeechLabelFa,
  phonetic: testWord.phonetic,
  meaningFa: testWord.meaningFa,
  hasInductiveClues: Boolean(testWord.inductiveClues.contextClueEn && testWord.inductiveClues.situationHintFa),
  hasPracticalExample: Boolean(testWord.practicalExample.sentenceEn && testWord.practicalExample.translationFa),
  lessonIndex: testWord.lessonIndex,
});

if (!testWord.inductiveClues.contextClueEn.includes("[ ___ ]")) {
  throw new Error(`Expected inductive clue to contain masked [ ___ ], but got: ${testWord.inductiveClues.contextClueEn}`);
}

// 3. Verify All A1 Words Have Required Fields
for (let i = 0; i < a1Words.length; i++) {
  const w = a1Words[i];
  if (!w.id || !w.word || !w.meaningFa || !w.inductiveClues || !w.practicalExample) {
    throw new Error(`A1 word at index ${i} is missing mandatory fields: ${JSON.stringify(w)}`);
  }
}
console.log(`✓ All ${a1Words.length} A1 words successfully validated with complete inductive schema.`);

// 4. Verify 5 Leitner Boxes Metadata & Intervals
for (let b = 1; b <= 5; b++) {
  const meta = LEITNER_BOX_META[b];
  const interval = LEITNER_INTERVALS[b];
  if (!meta || !meta.labelFa || !meta.color || !meta.intervalDescFa) {
    throw new Error(`Missing metadata for box ${b}`);
  }
  if (!interval || interval <= 0) {
    throw new Error(`Invalid interval for box ${b}`);
  }
}
console.log("✓ 5-Box Leitner interval progression (1, 3, 7, 14, 30 days) and visual metadata verified.");

// 5. Verify Storage & Leitner Transitions
// Setup mock localStorage in Node
const mockStorage = {};
globalThis.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
globalThis.window = {
  dispatchEvent: () => true
};

const {
  addWordToBox1,
  promoteCard,
  demoteCard,
  getLevelStats,
  getDueCardsForLevel,
  getNextAvailableLesson,
} = await import("../apps/web/lib/cefr-leitner-storage.ts");

// Add word to Box 1
const card1 = addWordToBox1(testWord);
if (card1.boxLevel !== 1 || card1.intervalDays !== 1) {
  throw new Error(`Card not initialized correctly in Box 1: ${JSON.stringify(card1)}`);
}
console.log("✓ addWordToBox1 correctly registered card into Box 1 (1-day interval).");

// Promote card 1 -> 2 -> 3 -> 4 -> 5
const card2 = promoteCard("A1", testWord.id);
if (card2.boxLevel !== 2 || card2.intervalDays !== 3) {
  throw new Error(`Promote to Box 2 failed: ${JSON.stringify(card2)}`);
}
const card3 = promoteCard("A1", testWord.id);
if (card3.boxLevel !== 3 || card3.intervalDays !== 7) {
  throw new Error(`Promote to Box 3 failed: ${JSON.stringify(card3)}`);
}
const card4 = promoteCard("A1", testWord.id);
if (card4.boxLevel !== 4 || card4.intervalDays !== 14) {
  throw new Error(`Promote to Box 4 failed: ${JSON.stringify(card4)}`);
}
const card5 = promoteCard("A1", testWord.id);
if (card5.boxLevel !== 5 || card5.intervalDays !== 30 || !card5.isMastered) {
  throw new Error(`Promote to Box 5 Golden failed: ${JSON.stringify(card5)}`);
}
console.log("✓ Progressive promotion 1 -> 2 -> 3 -> 4 -> 5 (Golden Mastered) verified.");

// Demote card from Box 5 back to Box 1
const demoted = demoteCard("A1", testWord.id);
if (demoted.boxLevel !== 1 || demoted.intervalDays !== 1 || demoted.lapseCount !== 1) {
  throw new Error(`Demote back to Box 1 failed: ${JSON.stringify(demoted)}`);
}
console.log("✓ Leitner penalty: Demoting card dropped it directly back to Box 1 with lapse counter.");

// Test Stats
const stats = getLevelStats("A1");
if (stats.learnedCount !== 1 || stats.boxCounts[1] !== 1) {
  throw new Error(`Stats mismatch: ${JSON.stringify(stats)}`);
}
console.log(`✓ getLevelStats computed accurately: ${JSON.stringify(stats)}`);

console.log("=== ALL CEFR ENGINE & STORAGE TESTS PASSED SUCCESSFULLY ===");
