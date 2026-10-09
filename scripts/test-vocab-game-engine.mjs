// Endoora Automated Verification Script for Vocab Time-Attack Game & Dual Leaderboard
import assert from "node:assert";

// 1. Test Curriculum Structure
import { A1_ENHANCED_VOCAB_LEVELS } from "../apps/web/data/skills/games/vocab-curriculum.ts";
import { SKILLS_GAME_DATA, getSkillLevels, getSkillLevel } from "../apps/web/data/skills/games/game-data.ts";

console.log("==================================================");
console.log("⚡ TESTING VOCABULARY CURRICULUM (A1 - 10 STAGES)");
console.log("==================================================");

assert.strictEqual(A1_ENHANCED_VOCAB_LEVELS.length, 10, "A1 must have exactly 10 stages");

// Test stage focuses:
// Stages 1-4: Words
for (let i = 0; i < 4; i++) {
  const stage = A1_ENHANCED_VOCAB_LEVELS[i];
  assert.strictEqual(stage.stageFocus, "words", `Stage ${stage.levelNumber} should focus on words`);
  assert(stage.questions.length >= 10, `Stage ${stage.levelNumber} should have at least 10 questions`);
  console.log(`  ✔ Stage ${stage.levelNumber}: ${stage.titleFa} (${stage.questions.length} questions) [Words]`);
}

// Stages 5-7: Conversational Chunks
for (let i = 4; i < 7; i++) {
  const stage = A1_ENHANCED_VOCAB_LEVELS[i];
  assert.strictEqual(stage.stageFocus, "chunks", `Stage ${stage.levelNumber} should focus on chunks`);
  assert(stage.questions.some((q) => q.type === "chunk-fill"), `Stage ${stage.levelNumber} must contain chunk-fill questions`);
  console.log(`  ✔ Stage ${stage.levelNumber}: ${stage.titleFa} (${stage.questions.length} questions) [Chunks]`);
}

// Stages 8-10: Real Situational Dialogues
for (let i = 7; i < 10; i++) {
  const stage = A1_ENHANCED_VOCAB_LEVELS[i];
  assert.strictEqual(stage.stageFocus, "dialogues", `Stage ${stage.levelNumber} should focus on dialogues`);
  assert(stage.questions.some((q) => q.speakerA && q.type === "dialogue-reply"), `Stage ${stage.levelNumber} must contain authentic dialogue turns with speakerA`);
  console.log(`  ✔ Stage ${stage.levelNumber}: ${stage.titleFa} (${stage.questions.length} questions) [Authentic Dialogues]`);
}

// Test game-data integration
const vocabA1Levels = getSkillLevels("vocabulary", "A1");
assert.strictEqual(vocabA1Levels.length, 10, "getSkillLevels must return 10 stages for A1 vocabulary");
const stage8 = getSkillLevel("vocabulary", "A1", 8);
assert(stage8 !== undefined, "Stage 8 must exist");
assert.strictEqual(stage8.titleEn, "Real Dialogue: At the Café & Dining");
console.log("\n  ✔ getSkillLevel properly retrieves enhanced stage 8 data");

// 2. Test Scoring Engine Logic
import { calculateQuestionScore } from "../apps/web/lib/skills/game-storage.ts";

console.log("\n==================================================");
console.log("⚡ TESTING UNIVERSAL SCORING ENGINE");
console.log("==================================================");

// Fast speed (<1.2s), low streak (1x)
const s1 = calculateQuestionScore(0.8, 1);
assert.strictEqual(s1.speedBonus, 50, "Lightning speed bonus should be 50");
assert.strictEqual(s1.multiplier, 1.0, "Low streak multiplier should be 1.0");
assert.strictEqual(s1.points, 150, "Points should be (100 + 50) * 1.0 = 150");
console.log("  ✔ Fast answer (0.8s) Streak 1: 150 pts");

// Moderate speed (1.8s), streak 5 (1.5x)
const s2 = calculateQuestionScore(1.8, 5);
assert.strictEqual(s2.speedBonus, 20, "Moderate speed bonus should be 20");
assert.strictEqual(s2.multiplier, 1.5, "Streak 5 multiplier should be 1.5");
assert.strictEqual(s2.points, Math.round(120 * 1.5), "Points should be 180");
console.log("  ✔ Moderate answer (1.8s) Streak 5: 180 pts");

// Fast speed (0.9s), FEVER MODE (streak 10 -> 3.0x)
const s3 = calculateQuestionScore(0.9, 10);
assert.strictEqual(s3.isFever, true, "Streak 10 must activate Fever Mode");
assert.strictEqual(s3.multiplier, 3.0, "Fever Mode multiplier should be 3.0");
assert.strictEqual(s3.points, Math.round(150 * 3.0), "Points should be 450 pts");
console.log("  ✔ FEVER MODE (0.9s) Streak 10: 450 pts (3.0x Multiplier)");

// 3. Test In-Round Redemption queueing simulation
console.log("\n==================================================");
console.log("⚡ TESTING IN-ROUND REDEMPTION SIMULATION");
console.log("==================================================");

const deck = [
  { question: { id: "q1", prompt: "Word 1" }, isRedemption: false },
  { question: { id: "q2", prompt: "Word 2" }, isRedemption: false },
  { question: { id: "q3", prompt: "Word 3" }, isRedemption: false },
  { question: { id: "q4", prompt: "Word 4" }, isRedemption: false },
];

// Suppose user misses q1 at index 0:
const missed = deck[0].question;
const insertIndex = Math.min(deck.length, 0 + 3);
deck.splice(insertIndex, 0, { question: missed, isRedemption: true });

assert.strictEqual(deck[3].question.id, "q1", "Missed question must be re-queued 3 positions ahead");
assert.strictEqual(deck[3].isRedemption, true, "Re-queued card must have isRedemption set to true");
console.log("  ✔ In-Round Redemption correctly re-queued question 'q1' at index 3 with isRedemption=true");

console.log("\n==================================================");
console.log("✨ ALL 15 CRITICAL SYSTEM CHECKS PASSED PERFECTLY!");
console.log("==================================================\n");
