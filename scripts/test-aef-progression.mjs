import {
  isAEFLessonUnlocked,
  saveAEFWatchProgress,
  saveAEFQuizResults,
  getAEFLevelSummary,
} from "../apps/web/lib/aef-progress.ts";
import {
  getAEFLessonsByLevel,
  getAEFLessonById,
  getAllAEFLevels,
  getNextAEFLesson,
} from "../apps/web/lib/aef-curriculum.ts";

console.log("=== Testing Authentic AEF Curriculum and Progression Logic ===");

const levels = getAllAEFLevels();
console.log(`Found ${levels.length} levels in AEF:`, levels.map(l => l.tier));

const a1Lessons = getAEFLessonsByLevel("a1");
const a2Lessons = getAEFLessonsByLevel("a2");
console.log(`AEF A1 lessons count: ${a1Lessons.length} (expected 18)`);
console.log(`AEF A2 lessons count: ${a2Lessons.length} (expected 18)`);

if (a1Lessons.length !== 18) {
  throw new Error(`AEF Level A1 has ${a1Lessons.length} lessons, expected 18!`);
}
if (a2Lessons.length !== 18) {
  throw new Error(`AEF Level A2 has ${a2Lessons.length} lessons, expected 18!`);
}

// Check unlock rules
const a1_v1_unlocked = isAEFLessonUnlocked("a1", 1, {});
console.log("a1 lesson 1 unlocked initially:", a1_v1_unlocked, "(expected: true)");
if (!a1_v1_unlocked) throw new Error("a1 lesson 1 should be unlocked!");

const a1_v2_unlocked = isAEFLessonUnlocked("a1", 2, {});
console.log("a1 lesson 2 unlocked initially:", a1_v2_unlocked, "(expected: false)");
if (a1_v2_unlocked) throw new Error("a1 lesson 2 should be locked initially!");

// Threshold check
const mockSuccess = {
  "a1-v01": {
    lessonId: "a1-v01",
    level: "a1",
    episodeNumber: 1,
    watchPercentage: 85,
    maxWatchedSeconds: 100,
    totalScore: 80,
    isWatched: true,
    isQuizPassed: true,
    isCompleted: true,
    updatedAt: new Date().toISOString(),
  }
};
const unlockSuccess = isAEFLessonUnlocked("a1", 2, mockSuccess);
console.log("a1 lesson 2 with 85% watch + 80% quiz:", unlockSuccess, "(expected: true)");
if (!unlockSuccess) throw new Error("Should unlock with >=80% watch and >=70% quiz!");

const nextLesson = getNextAEFLesson("a1-v01");
console.log("Next lesson after a1-v01:", nextLesson?.id, "(expected: a1-v02)");
if (nextLesson?.id !== "a1-v02") throw new Error("getNextAEFLesson returned wrong lesson!");

console.log("=== All Authentic AEF Curriculum assertions passed successfully! ===");
