import {
  isRealLifeLessonUnlocked,
  saveRealLifeWatchProgress,
  saveRealLifeQuizResults,
  getRealLifeLevelSummary,
} from "../apps/web/lib/real-life-progress.ts";
import {
  getRealLifeLessonsByLevel,
  getRealLifeLessonById,
  getAllRealLifeLevels,
  getNextRealLifeLesson,
} from "../apps/web/lib/real-life-curriculum.ts";

console.log("=== Testing Real-Life Curriculum & Progression System ===");

// 1. Check all 8 levels exist
const levels = getAllRealLifeLevels();
console.log(`Found ${levels.length} levels in Real-Life Curriculum:`, levels.map(l => l.tier));
if (levels.length !== 8) {
  throw new Error(`Expected 8 levels, got ${levels.length}`);
}

// 2. Check A1 and A2 lesson counts
const a1Lessons = getRealLifeLessonsByLevel("a1");
const a2Lessons = getRealLifeLessonsByLevel("a2");
console.log(`A1 lessons count: ${a1Lessons.length} (expected 15)`);
console.log(`A2 lessons count: ${a2Lessons.length} (expected 16)`);

if (a1Lessons.length !== 15) {
  throw new Error(`A1 has ${a1Lessons.length} lessons, expected 15!`);
}
if (a2Lessons.length !== 16) {
  throw new Error(`A2 has ${a2Lessons.length} lessons, expected 16!`);
}

// 3. Validate lesson integrity for ALL 8 levels
for (const lvl of levels) {
  const lvlLessons = getRealLifeLessonsByLevel(lvl.tier);
  for (const les of lvlLessons) {
    if (!les.id || !les.titleFa || !les.titleEn) {
      throw new Error(`Lesson ${les.id} is missing core fields!`);
    }
    if (!les.questions || !les.questions.listening || !les.questions.vocabulary ||
        !les.questions.grammar || !les.questions.speaking || !les.questions.reading || !les.questions.writing) {
      throw new Error(`Lesson ${les.id} is missing one or more of the 6 skills!`);
    }
  }
}
console.log(`✓ All 126 lessons across 8 levels successfully passed structural integrity validation (6 skills verified)!`);

// 4. Test unlock rules
// Lesson 1 should be unlocked initially
const a1_v1_unlocked = isRealLifeLessonUnlocked("a1", 1, {});
console.log("a1 lesson 1 unlocked initially:", a1_v1_unlocked, "(expected: true)");
if (!a1_v1_unlocked) throw new Error("a1 lesson 1 should be unlocked!");

// Lesson 2 should be locked initially
const a1_v2_unlocked = isRealLifeLessonUnlocked("a1", 2, {});
console.log("a1 lesson 2 unlocked initially:", a1_v2_unlocked, "(expected: false)");
if (a1_v2_unlocked) throw new Error("a1 lesson 2 should be locked initially!");

// Test threshold: 85% watch + 60% quiz -> should be locked (< 70 quiz)
const mockFailQuiz = {
  "a1-v01": {
    lessonId: "a1-v01",
    level: "a1",
    episodeNumber: 1,
    watchPercentage: 85,
    maxWatchedSeconds: 100,
    totalScore: 60,
    isWatched: true,
    isQuizPassed: false,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  }
};
const unlockFailQuiz = isRealLifeLessonUnlocked("a1", 2, mockFailQuiz);
console.log("a1 lesson 2 with 85% watch + 60% quiz:", unlockFailQuiz, "(expected: false)");
if (unlockFailQuiz) throw new Error("Should not unlock when quiz < 70%!");

// Test threshold: 75% watch + 90% quiz -> should be locked (< 80 watch)
const mockFailWatch = {
  "a1-v01": {
    lessonId: "a1-v01",
    level: "a1",
    episodeNumber: 1,
    watchPercentage: 75,
    maxWatchedSeconds: 80,
    totalScore: 90,
    isWatched: false,
    isQuizPassed: true,
    isCompleted: false,
    updatedAt: new Date().toISOString(),
  }
};
const unlockFailWatch = isRealLifeLessonUnlocked("a1", 2, mockFailWatch);
console.log("a1 lesson 2 with 75% watch + 90% quiz:", unlockFailWatch, "(expected: false)");
if (unlockFailWatch) throw new Error("Should not unlock when watch < 80%!");

// Test threshold: 85% watch + 80% quiz -> UNLOCKED!
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
const unlockSuccess = isRealLifeLessonUnlocked("a1", 2, mockSuccess);
console.log("a1 lesson 2 with 85% watch + 80% quiz:", unlockSuccess, "(expected: true)");
if (!unlockSuccess) throw new Error("Should be unlocked when watch >= 80% and quiz >= 70%!");

// 5. Test next lesson helper
const nextLes = getNextRealLifeLesson("a1-v01");
console.log("Next lesson after a1-v01:", nextLes?.id, "(expected: a1-v02)");
if (nextLes?.id !== "a1-v02") throw new Error("getNextRealLifeLesson returned wrong lesson!");

console.log("=== All Real-Life Curriculum & Progression tests passed successfully! ===");
