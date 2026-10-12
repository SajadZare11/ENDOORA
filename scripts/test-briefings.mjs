import { getSkillStageBriefing } from "../apps/web/data/skills/games/skill-stage-briefings.ts";

const skills = ["writing", "reading", "vocabulary", "grammar", "speaking"];
const tiers = ["A1", "A2", "B1", "B2", "C1", "C2"];

let total = 0;
let missing = 0;

for (const skill of skills) {
  for (const cefr of tiers) {
    for (let lvl = 1; lvl <= 10; lvl++) {
      total++;
      try {
        const brief = getSkillStageBriefing(skill, cefr, lvl);
        if (!brief.titleFa || !brief.contextFa || !brief.missionFa) {
          console.error(`[FAIL] Missing fields for ${skill} ${cefr} lvl ${lvl}:`, brief);
          missing++;
        }
      } catch (err) {
        console.error(`[ERROR] Exception for ${skill} ${cefr} lvl ${lvl}:`, err);
        missing++;
      }
    }
  }
}

console.log(`Tested ${total} briefings across 5 skills.`);
if (missing === 0) {
  console.log("ALL 300 STAGES HAVE VALID BRIEFINGS! 🎉");
} else {
  console.error(`Found ${missing} invalid briefings!`);
  process.exit(1);
}
