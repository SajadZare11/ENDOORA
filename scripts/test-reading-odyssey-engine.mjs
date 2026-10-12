/**
 * Verification Script for Reading Odyssey Engine (60 Stages × 10 Stories × 10 Endings = 6,000 Endings)
 */

import assert from "node:assert";
import {
  buildOdysseyCurriculum,
  getOdysseyStage,
  getOdysseyStory,
  getRandomOdysseyStory,
  getAllOdysseyStages,
  ODYSSEY_CURRICULUM_STATS,
} from "../apps/web/data/skills/games/reading-odyssey-curriculum.ts";

console.log("==================================================");
console.log("⚡ TESTING READING ODYSSEY CURRICULUM ARCHITECTURE");
console.log("==================================================");

// 1. Verify Curriculum Stats
assert.strictEqual(ODYSSEY_CURRICULUM_STATS.totalCefrTiers, 6, "Must cover 6 CEFR tiers");
assert.strictEqual(ODYSSEY_CURRICULUM_STATS.totalStages, 60, "Must have 60 total ladder stages");
assert.strictEqual(ODYSSEY_CURRICULUM_STATS.totalStories, 600, "Must have 600 total stories");
assert.strictEqual(ODYSSEY_CURRICULUM_STATS.totalEndings, 6000, "Must have 6,000 total endings");
console.log("✔ Global metadata specifications verified: 60 stages, 600 stories, 6,000 endings");

// 2. Build and verify curriculum structure
const curriculum = buildOdysseyCurriculum();
const cefrTiers = ["A1", "A2", "B1", "B2", "C1", "C2"];

let totalStageCount = 0;
let totalStoryCount = 0;
let totalEndingCount = 0;
const endingCategoryCounts = {};

for (const cefr of cefrTiers) {
  console.log(`\n▶ Checking Tier ${cefr}...`);
  for (let lvl = 1; lvl <= 10; lvl++) {
    totalStageCount++;
    const stage = getOdysseyStage(cefr, lvl);
    assert(Boolean(stage), `Stage ${cefr}-${lvl} must exist`);
    assert.strictEqual(stage.levelNumber, lvl);
    assert.strictEqual(stage.cefr, cefr);
    assert(stage.stageTitleEn.length > 2, `Stage ${cefr}-${lvl} must have stageTitleEn`);
    assert(stage.stageTitleFa.length > 2, `Stage ${cefr}-${lvl} must have stageTitleFa`);
    assert.strictEqual(stage.stories.length, 10, `Stage ${cefr}-${lvl} must have exactly 10 stories`);

    for (let sIdx = 1; sIdx <= 10; sIdx++) {
      totalStoryCount++;
      const story = stage.stories[sIdx - 1];
      assert.strictEqual(story.storyIndex, sIdx);
      assert.strictEqual(story.stageLevelNumber, lvl);
      assert.strictEqual(story.cefr, cefr);
      assert(story.passage.length > 20, `Story ${story.id} passage too short`);
      assert(story.speedGate, `Story ${story.id} must have speedGate`);
      assert(story.speedGate.options.length >= 3, `Speed gate must have at least 3 options`);
      assert(story.speedGate.correctIndex >= 0 && story.speedGate.correctIndex < story.speedGate.options.length);
      assert(story.choices.length >= 3, `Story ${story.id} must have at least 3 branch choices`);
      assert.strictEqual(story.endings.length, 10, `Story ${story.id} must have exactly 10 endings`);

      // Verify required categories exist in every story
      const requiredCategories = [
        "legendary",
        "heroic",
        "secret",
        "funny",
        "cautionary",
      ];
      for (const reqCat of requiredCategories) {
        const found = story.endings.some((e) => e.category === reqCat);
        assert(found, `Story ${story.id} must contain category ${reqCat}`);
      }

      for (const ending of story.endings) {
        totalEndingCount++;
        endingCategoryCounts[ending.category] = (endingCategoryCounts[ending.category] || 0) + 1;
        assert(ending.titleEn.length > 2);
        assert(ending.titleFa.length > 2);
        assert(ending.descriptionEn.length > 10);
        assert(ending.descriptionFa.length > 10);
        assert(ending.badgeIcon.length > 0);
        assert(ending.xpReward >= 40);
      }
    }
  }
}

console.log("\n==================================================");
console.log("✔ ALL VERIFICATION CHECKS PASSED!");
console.log(`Total Stages Verified:  ${totalStageCount} / 60`);
console.log(`Total Stories Verified: ${totalStoryCount} / 600`);
console.log(`Total Endings Verified: ${totalEndingCount} / 6,000`);
console.log("Ending Category Distribution (600 of each):", endingCategoryCounts);
console.log("==================================================");

// 3. Test API methods
const randomStory = getRandomOdysseyStory("B1", 4);
assert(Boolean(randomStory), "getRandomOdysseyStory should return a valid story");
console.log(`✔ Random Story Test (B1-4): "${randomStory.titleEn}" (Endings: ${randomStory.endings.length})`);

const storySpecific = getOdysseyStory("C2", 10, 7);
assert(Boolean(storySpecific), "getOdysseyStory should return specific story");
assert.strictEqual(storySpecific.storyIndex, 7);
console.log(`✔ Specific Story Test (C2-10-7): "${storySpecific.titleEn}"`);

const allStages = getAllOdysseyStages();
assert.strictEqual(allStages.length, 60, "getAllOdysseyStages should return exactly 60 stages");
console.log("✔ getAllOdysseyStages correctly returned 60 stages");

// 4. Test Storage Functions
import {
  recordReadingOdysseyCompletion,
  recordDiscoveredEnding,
  getDiscoveredEndings,
  getStageDiscoveredEndingsCount,
  getTotalReadingEndingsDiscovered,
} from "../apps/web/lib/skills/game-storage.ts";

// Test mock storage operations
const outcome1 = recordReadingOdysseyCompletion("A1", 1, 1, 1, {
  finalScore: 180,
  heartsRemaining: 3,
  speedBonus: 40,
  stars: 3,
  baseXp: 100,
});
assert(Boolean(outcome1), "recordReadingOdysseyCompletion should return an outcome");
assert(outcome1.newStarsEarned >= 1, "Should earn stars on completion");
assert(outcome1.xpEarned > 0, "Should earn XP on completion");
console.log(`✔ Storage completion outcome: +${outcome1.newStarsEarned} Stars, +${outcome1.xpEarned} XP (Total: ${outcome1.newTotalXp})`);
