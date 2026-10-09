/**
 * Comprehensive Verification Script for CEFR Skills Games & Arcade Engine
 * Validates data integrity, level progression, and question schemas across all CEFR tiers (A1 to C2).
 */

import { SKILLS_GAME_DATA, getSkillLevels, getSkillLevel } from "../apps/web/data/skills/games/game-data.ts";
import { getLeaderboard, getDefaultProgress } from "../apps/web/lib/skills/game-storage.ts";

const REQUIRED_SKILLS = ["vocabulary", "grammar", "listening", "reading", "writing", "speaking"];
const CEFR_TIERS = ["A1", "A2", "B1", "B2", "C1", "C2"];

console.log("🚀 Starting CEFR Skills Games Comprehensive Multi-Tier Verification...\n");

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passedChecks++;
}

// 1. Check all 6 skills exist
for (const skill of REQUIRED_SKILLS) {
  assert(Boolean(SKILLS_GAME_DATA[skill]), `Skill "${skill}" exists in SKILLS_GAME_DATA`);
}
console.log(`✅ Passed: All ${REQUIRED_SKILLS.length} skills registered in SKILLS_GAME_DATA.`);

// 2. Check CEFR tiers exist for all skills
for (const skill of REQUIRED_SKILLS) {
  for (const tier of CEFR_TIERS) {
    const levels = getSkillLevels(skill, tier);
    assert(Array.isArray(levels) && levels.length === 10, `${skill} has 10 levels for ${tier}`);
  }
}
console.log(`✅ Passed: All 6 CEFR tiers (A1 to C2) have 10 micro-levels defined (360 levels total).`);

// 3. Deep check all 360 levels across A1 through C2
let totalVerifiedQuestions = 0;
for (const skill of REQUIRED_SKILLS) {
  for (const tier of CEFR_TIERS) {
    for (let lvl = 1; lvl <= 10; lvl++) {
      const levelData = getSkillLevel(skill, tier, lvl);
      assert(Boolean(levelData), `${skill} ${tier} Level ${lvl} is retrievable`);
      assert(levelData.titleFa && levelData.titleFa.length > 2, `${skill} ${tier} Level ${lvl} has valid titleFa: "${levelData.titleFa}"`);
      assert(levelData.titleEn && levelData.titleEn.length > 2, `${skill} ${tier} Level ${lvl} has valid titleEn: "${levelData.titleEn}"`);
      assert(levelData.xpReward >= 50, `${skill} ${tier} Level ${lvl} has xpReward >= 50 (${levelData.xpReward} XP)`);
      assert(levelData.questions.length >= 3, `${skill} ${tier} Level ${lvl} has at least 3 questions (${levelData.questions.length} found)`);

      for (const q of levelData.questions) {
        totalVerifiedQuestions++;
        assert(Boolean(q.id), `Question ${q.id} has ID`);
        assert(Boolean(q.prompt), `Question ${q.id} has prompt`);
        assert(Boolean(q.explanationFa), `Question ${q.id} has explanationFa`);

        if (q.options) {
          assert(q.options.length >= 2, `Question ${q.id} has at least 2 options`);
          assert(
            typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer < q.options.length,
            `Question ${q.id} correctAnswer index (${q.correctAnswer}) is within bounds of options`
          );
        }

        if (q.scrambledTokens) {
          assert(Array.isArray(q.correctOrder), `Question ${q.id} with scrambledTokens has correctOrder`);
          assert(
            q.scrambledTokens.length === q.correctOrder.length,
            `Question ${q.id} token length matches correctOrder length`
          );
        }

        if (skill === "listening" || skill === "speaking") {
          assert(Boolean(q.audioText), `Question ${q.id} has audioText for Web Speech Synthesis`);
        }
      }
    }
  }
}
console.log(`✅ Passed: Deep validation of all 360 levels and ${totalVerifiedQuestions} questions.`);

// 4. Verify Leaderboard engine & default progress
const defaultProgress = getDefaultProgress();
assert(Boolean(defaultProgress.vocabulary?.A1?.unlockedLevel === 1), "Default progress has A1 Level 1 unlocked");

const weeklyLeaderboard = getLeaderboard("weekly");
assert(weeklyLeaderboard.length >= 5, `Weekly leaderboard contains participants (${weeklyLeaderboard.length} entries)`);
assert(weeklyLeaderboard.some((u) => u.isCurrentUser), "Weekly leaderboard includes current user entry");

const allTimeLeaderboard = getLeaderboard("all-time");
assert(allTimeLeaderboard.length >= 5, `All-time leaderboard contains participants (${allTimeLeaderboard.length} entries)`);
console.log(`✅ Passed: Hybrid Leaderboard and persistence tests.`);

console.log("\n========================================================");
console.log(`🎉 ALL ${passedChecks}/${totalChecks} INTEGRITY CHECKS PASSED CLEANLY!`);
console.log(`🎮 Total Playable CEFR Levels: 360 (10 levels × 6 CEFR tiers × 6 skills)`);
console.log(`❓ Total Verified Interactive Questions: ${totalVerifiedQuestions}`);
console.log("========================================================\n");
