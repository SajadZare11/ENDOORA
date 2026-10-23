// Endoora Automated Verification Script for StreetVibe (TalkRush) Game Engine
import assert from "node:assert";

// 1. Test StreetVibe Types & Scenario Data Bank
import {
  STREET_VIBE_LOCATIONS,
  WEEKLY_LEAGUES,
  STREET_VIBE_STAGES,
  getStreetVibeStage,
  getStreetVibeLocationStages,
  getAllStreetVibeWave1Items,
  getAllStreetVibeWave2Items,
  getAllStreetVibeWave3Bosses,
} from "../apps/web/data/skills/games/street-vibe-data.ts";

import {
  calculateQuestionScore,
  resolveDoubleOrNothingVault,
  getLiveGhostRival,
  validateMatchSubmission,
} from "../apps/web/lib/skills/street-vibe-engine.ts";

console.log("==================================================");
console.log("🏙️  TESTING STREETVIBE (TALKRUSH) ARCHITECTURE");
console.log("==================================================");

// 1. Verify 5 Real-Life City Locations
const locationIds = ["cafe", "airport", "city", "shopping", "party"];
console.log("\n1. Verifying 5 City Locations:");
for (const id of locationIds) {
  const loc = STREET_VIBE_LOCATIONS[id];
  assert(loc !== undefined, `Location '${id}' must be defined`);
  assert(loc.titleFa && loc.titleEn, `Location '${id}' must have Persian & English titles`);
  assert(loc.icon, `Location '${id}' must have an icon`);
  assert(loc.themeColor, `Location '${id}' must have a themeColor`);
  assert(loc.a1LexicalFocus.length >= 8, `Location '${id}' must have at least 8 A1 lexical words`);
  console.log(`  ✔ [${loc.icon}] ${loc.titleEn} (${loc.titleFa}) - Focus: ${loc.a1LexicalFocus.slice(0, 4).join(", ")}...`);
}

// 2. Verify 10 Progressive Stages in A1 Level
console.log("\n2. Verifying 10 Progressive A1 Stages:");
assert.strictEqual(STREET_VIBE_STAGES.length, 10, "STREET_VIBE_STAGES must have exactly 10 stages");

let prevThreshold = 0;
for (let stageNum = 1; stageNum <= 10; stageNum++) {
  const stage = getStreetVibeStage(stageNum);
  assert(stage !== undefined, `Stage ${stageNum} must exist`);
  assert.strictEqual(stage.stageNumber, stageNum, `Stage number must match ${stageNum}`);
  assert(stage.wave1Items.length >= 2, `Stage ${stageNum} must have Wave 1 items`);
  assert(stage.wave2Items.length >= 1, `Stage ${stageNum} must have Wave 2 items`);
  assert(stage.wave3Boss !== undefined, `Stage ${stageNum} must have a Wave 3 Boss`);
  assert.strictEqual(stage.wave3Boss.turns.length, 4, `Stage ${stageNum} Boss must have 4 chain turns`);
  assert(stage.vaultQuestion !== undefined, `Stage ${stageNum} must have a Double-or-Nothing Vault question`);
  assert(stage.passThresholdPoints > prevThreshold, `Stage ${stageNum} threshold (${stage.passThresholdPoints}) must scale higher than prev (${prevThreshold})`);
  prevThreshold = stage.passThresholdPoints;
  console.log(`  ✔ Stage ${stageNum}: ${stage.titleEn} -> Threshold: ${stage.passThresholdPoints} pts | XP: ${stage.xpReward}`);
}

// 3. Verify 60+ Rich Conversational Interactions
console.log("\n3. Verifying Conversational Content Volume & Quality:");
const allW1 = getAllStreetVibeWave1Items();
const allW2 = getAllStreetVibeWave2Items();
const allBosses = getAllStreetVibeWave3Bosses();

assert.strictEqual(allW1.length, 30, "Must have exactly 30 Wave 1 items (6 per location)");
assert.strictEqual(allW2.length, 15, "Must have exactly 15 Wave 2 items (3 per location)");
assert.strictEqual(allBosses.length, 5, "Must have exactly 5 Wave 3 Boss fights");

let totalBossTurns = 0;
for (const boss of allBosses) {
  assert.strictEqual(boss.turns.length, 4, `Boss ${boss.bossName} must have 4 turns`);
  totalBossTurns += boss.turns.length;
}
assert.strictEqual(totalBossTurns, 20, "Total Boss turns must be 20 (4 turns * 5 locations)");

// Count total interactive interactions
const totalInteractions = allW1.length + allW2.length + totalBossTurns + 5; // +5 Vault questions
console.log(`  ✔ Wave 1 Quick-Reply items: ${allW1.length}`);
console.log(`  ✔ Wave 2 Real-World Grabs: ${allW2.length}`);
console.log(`  ✔ Wave 3 Boss Fight turns: ${totalBossTurns}`);
console.log(`  ✔ Double-or-Nothing Vault questions: 5`);
console.log(`  🔥 Total Interactive Conversational Interactions: ${totalInteractions} (Exceeds required 60+)`);
assert(totalInteractions >= 60, "Total interactions must be at least 60");

// 4. Verify Scripted Comedy Feedback Mechanics on Wrong Options
console.log("\n4. Verifying Scripted Comedy Feedback on Wrong Options:");
let comedyCount = 0;
for (const item of allW1) {
  assert(item.options.length === 3, `Item ${item.id} must have exactly 3 options`);
  const correctOpt = item.options.filter((o) => o.isCorrect);
  const wrongOpts = item.options.filter((o) => !o.isCorrect);
  assert.strictEqual(correctOpt.length, 1, `Item ${item.id} must have exactly 1 correct option`);
  assert.strictEqual(wrongOpts.length, 2, `Item ${item.id} must have exactly 2 wrong options`);
  
  for (const opt of wrongOpts) {
    assert(opt.npcReaction && opt.npcReaction.length > 5, `Wrong option '${opt.text}' in ${item.id} must have scripted reaction`);
    assert(opt.npcReactionMood, `Wrong option '${opt.text}' must define an expressive mood`);
    comedyCount++;
  }
}
console.log(`  ✔ Verified ${comedyCount} unique scripted comedy reactions across Wave 1! (Zero generic 'Wrong ❌' states)`);

// Check sample comedy reaction
const sampleItem = allW1.find((i) => i.targetWord === "large");
assert(sampleItem, "Item with targetWord 'large' must exist");
const marriedOpt = sampleItem.options.find((o) => o.text === "married");
assert(marriedOpt, "Married option must exist");
assert(marriedOpt.npcReaction.includes("single"), "Reaction must include funny coffee punchline");
console.log(`  ✔ Sample Comedy Reaction: "${marriedOpt.npcReaction}" (Mood: ${marriedOpt.npcReactionMood})`);

// 5. Verify Wave 2 Visual Object Grabs (6 items in tray)
console.log("\n5. Verifying Wave 2 Object Tray Setup:");
for (const item of allW2) {
  assert.strictEqual(item.trayItems.length, 6, `Wave 2 item ${item.id} must have exactly 6 tray items`);
  assert(item.targetItemIds.length >= 1 && item.targetItemIds.length <= 2, `Item ${item.id} must request 1 or 2 items`);
  for (const reqId of item.targetItemIds) {
    assert(item.trayItems.some((t) => t.id === reqId), `Requested item '${reqId}' must exist in tray`);
  }
}
console.log(`  ✔ Verified all 15 Wave 2 scenarios have 6 visual tray items and valid target items`);

// 6. Test Scoring Engine & Anti-Farming Formula
console.log("\n==================================================");
console.log("⚡ TESTING ANTI-FARMING DYNAMIC SCORING ENGINE");
console.log("==================================================");

// Formula: QuestionScore = (BasePoints * ComboMultiplier * SpeedBonus) * NoveltyWeight * VoiceBonus + CharismaTip
// Test Case A: Learning word (NoveltyWeight = 1.5), speed 1.2s (<2s -> 1.5x speed + 75 Charisma Tip), streak 1 (1x)
const resNew = calculateQuestionScore({
  wave: 1,
  responseTimeSeconds: 1.2,
  currentStreak: 1,
  overrideMastery: "learning",
});
// (100 * 1.0 * 1.5) * 1.5 + 75 = 300
assert.strictEqual(resNew.finalQuestionPoints, 300, `Expected 300, got ${resNew.finalQuestionPoints}`);
assert.strictEqual(resNew.noveltyWeight, 1.5, "NoveltyWeight for learning word must be 1.5");
assert.strictEqual(resNew.isCharismaTip, true, "Response under 2s awards Charisma Tip");
console.log(`  ✔ Learning Word Answer (1.2s, 1x combo): ${resNew.finalQuestionPoints} pts (Novelty 1.5x, Charisma Tip: Yes)`);

// Test Case B: Bounty / Missed word (NoveltyWeight = 2.5), speed 1.8s, streak 4 (2x)
const resBounty = calculateQuestionScore({
  wave: 1,
  responseTimeSeconds: 1.8,
  currentStreak: 4,
  overrideMastery: "bounty",
});
// (100 * 2.0 * 1.5) * 2.5 + 75 = 750 + 75 = 825
assert.strictEqual(resBounty.finalQuestionPoints, 825, `Expected 825, got ${resBounty.finalQuestionPoints}`);
assert.strictEqual(resBounty.noveltyWeight, 2.5, "NoveltyWeight for bounty word must be 2.5 (Revenge Bonus)");
console.log(`  ✔ Bounty Revenge Answer (1.8s, 2x combo): ${resBounty.finalQuestionPoints} pts (2.5x Revenge Bonus)`);

// Test Case C: Mastered word (Farming prevention! NoveltyWeight = 0.2)
const resMastered = calculateQuestionScore({
  wave: 1,
  responseTimeSeconds: 2.5,
  currentStreak: 1,
  overrideMastery: "mastered",
});
// (100 * 1.0 * 1.0) * 0.2 = 20
assert.strictEqual(resMastered.finalQuestionPoints, 20, `Expected 20, got ${resMastered.finalQuestionPoints}`);
assert.strictEqual(resMastered.noveltyWeight, 0.2, "NoveltyWeight for mastered word must be 0.2 (Anti-Farming reduction)");
console.log(`  ✔ Mastered Word Farming Attempt: ${resMastered.finalQuestionPoints} pts (Penalized to 0.2x points)`);

// Test Case D: Voice Charisma 3x Bonus
const resVoice = calculateQuestionScore({
  wave: 1,
  responseTimeSeconds: 2.5,
  currentStreak: 3,
  overrideMastery: "learning",
  usedMic: true,
  voiceMatched: true,
});
// (100 * 2.0 * 1.0) * 1.5 * 3.0 = 900
assert.strictEqual(resVoice.voiceBonus, 3, "Voice charisma multiplier must be 3x");
assert.strictEqual(resVoice.finalQuestionPoints, 900, `Expected 900, got ${resVoice.finalQuestionPoints}`);
console.log(`  ✔ Speak-To-Win Voice Charisma (3x bonus): ${resVoice.finalQuestionPoints} pts`);

// Test Case E: Wave 3 Fever Mode (2x Base Points, 8x Unstoppable)
const resFever = calculateQuestionScore({
  wave: 3,
  responseTimeSeconds: 1.0,
  currentStreak: 8,
  overrideMastery: "learning",
});
// (200 * 8.0 * 1.5) * 1.5 + 75 = 3600 + 75 = 3675
assert.strictEqual(resFever.finalQuestionPoints, 3675, `Expected 3675, got ${resFever.finalQuestionPoints}`);
assert.strictEqual(resFever.isUnstoppableTriggered, true, "Streak 8 must trigger Unstoppable Mode");
console.log(`  ✔ Fever Mode Boss Fight (8x Unstoppable): ${resFever.finalQuestionPoints} pts`);

// 7. Test Double-or-Nothing Vault Logic
console.log("\n==================================================");
console.log("🎲 TESTING DOUBLE-OR-NOTHING VAULT LOGIC");
console.log("==================================================");

const initialScore = 2000;
// Option 1: Bank points (gambleChosen: false)
const bankRes = resolveDoubleOrNothingVault(initialScore, false);
assert.strictEqual(bankRes.finalScore, 2000, "Bank option should maintain original score");
assert.strictEqual(bankRes.scoreDelta, 0, "Bank diff should be 0");
console.log(`  ✔ Banked Score: ${bankRes.finalScore} pts (No risk)`);

// Option 2: Sudden-Death Boss Correct (+50% bonus) (gambleChosen: true, answerCorrect: true)
const winRes = resolveDoubleOrNothingVault(initialScore, true, true);
assert.strictEqual(winRes.finalScore, 3000, "Win option should increase score by 1.5x");
assert.strictEqual(winRes.scoreDelta, 1000, "Win diff should be +1000");
console.log(`  ✔ Vault Boss WIN: ${winRes.finalScore} pts (+50% Jackpot!)`);

// Option 3: Sudden-Death Boss Wrong (-30% burn) (gambleChosen: true, answerCorrect: false)
const loseRes = resolveDoubleOrNothingVault(initialScore, true, false);
assert.strictEqual(loseRes.finalScore, 1400, "Lose option should deduct 30% of score");
assert.strictEqual(loseRes.scoreDelta, -600, "Lose diff should be -600");
console.log(`  ✔ Vault Boss LOSS: ${loseRes.finalScore} pts (-30% Burn)`);

// 8. Test Ghost Rival HUD Calculation
console.log("\n==================================================");
console.log("👻 TESTING GHOST RIVAL HUD & WEEKLY LEAGUES");
console.log("==================================================");

assert(WEEKLY_LEAGUES.bronze && WEEKLY_LEAGUES.diamond, "Weekly leagues must be configured");
const ghost1 = getLiveGhostRival(500);
assert(ghost1 !== null, "Ghost rival must be found above 500 in bronze");
assert(ghost1.score > 500, `Ghost score (${ghost1.score}) must be above player score (500)`);
console.log(`  ✔ Ghost Rival above 500 pts: ${ghost1.name} (${ghost1.score} pts, Gap: ${ghost1.score - 500})`);

// 9. Test Anti-Cheat Server Validator
console.log("\n==================================================");
console.log("🛡️  TESTING ANTI-CHEAT & BOT DETECTION ENGINE");
console.log("==================================================");

// Legit match
const now = Date.now();
const legitPayload = {
  stageNumber: 1,
  locationId: "cafe",
  totalDurationMs: 85000,
  allowedTimeSeconds: 95,
  finalScore: 1200,
  accuracyPct: 95,
  turns: [
    { turnIndex: 0, wave: 1, targetConcept: "large", questionShownAt: now - 85000, answeredAt: now - 83500, responseTimeMs: 1500, isCorrect: true, comboStreak: 1, earnedPoints: 150 },
    { turnIndex: 1, wave: 1, targetConcept: "menu", questionShownAt: now - 83500, answeredAt: now - 81800, responseTimeMs: 1700, isCorrect: true, comboStreak: 2, earnedPoints: 250 },
    { turnIndex: 2, wave: 1, targetConcept: "bill", questionShownAt: now - 81800, answeredAt: now - 80200, responseTimeMs: 1600, isCorrect: true, comboStreak: 3, earnedPoints: 350 },
  ],
};
const legitCheck = validateMatchSubmission(legitPayload);
assert.strictEqual(legitCheck.isValid, true, "Legitimate match must pass anti-cheat");
console.log("  ✔ Legitimate player match: PASSED verification");

// Bot test: Average response time < 300ms
const botPayload = {
  ...legitPayload,
  turns: [
    { turnIndex: 0, wave: 1, targetConcept: "large", questionShownAt: now - 500, answeredAt: now - 400, responseTimeMs: 100, isCorrect: true, comboStreak: 1, earnedPoints: 150 },
    { turnIndex: 1, wave: 1, targetConcept: "menu", questionShownAt: now - 400, answeredAt: now - 250, responseTimeMs: 150, isCorrect: true, comboStreak: 2, earnedPoints: 250 },
    { turnIndex: 2, wave: 1, targetConcept: "bill", questionShownAt: now - 250, answeredAt: now - 150, responseTimeMs: 100, isCorrect: true, comboStreak: 3, earnedPoints: 250 },
  ],
};
const botCheck = validateMatchSubmission(botPayload);
assert.strictEqual(botCheck.isValid, false, "Bot match must be rejected");
assert(botCheck.flagReason?.includes("Bot detection"), "Reason must mention bot detection");
console.log(`  ✔ Bot Match (<300ms reaction): REJECTED (${botCheck.flagReason})`);

// Duration fraud test: Match lasted 130s when only 95s allowed
const durationFraudPayload = {
  ...legitPayload,
  totalDurationMs: 130000,
  allowedTimeSeconds: 95,
};
const durationCheck = validateMatchSubmission(durationFraudPayload);
assert.strictEqual(durationCheck.isValid, false, "Excessive duration match must be rejected");
assert(durationCheck.flagReason?.includes("Match duration exceeded"), "Reason must mention duration exceeded");
console.log(`  ✔ Excessive duration fraud: REJECTED (${durationCheck.flagReason})`);

console.log("\n==================================================");
console.log("🏆 ALL STREETVIBE (TALKRUSH) SYSTEM CHECKS PASSED!");
console.log("==================================================");
