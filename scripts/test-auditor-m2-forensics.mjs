/**
 * Independent Forensic Audit Test for Milestone M2
 * Executed by: teamwork_preview_auditor_m2
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

console.log("=== INDEPENDENT FORENSIC AUDIT: MILESTONE M2 ===");

// 1. Verify existence and non-emptiness of all 6 target files
const targetFiles = [
  "apps/web/lib/tamrin20-data.ts",
  "apps/web/components/highschool/tamrin20/Tamrin20Player.tsx",
  "apps/web/components/highschool/tamrin20/Tamrin20QuestionCard.tsx",
  "apps/web/components/highschool/tamrin20/Tamrin20AudioPlayer.tsx",
  "apps/web/components/highschool/tamrin20/tamrin20.module.css",
  "apps/web/components/highschool/tamrin20/index.ts",
];

for (const relPath of targetFiles) {
  const fullPath = path.join(root, relPath);
  assert.ok(fs.existsSync(fullPath), `Target file must exist: ${relPath}`);
  const stat = fs.statSync(fullPath);
  assert.ok(stat.size > 100, `Target file must not be a stub: ${relPath} (${stat.size} bytes)`);
  console.log(`✓ Verified file existence & non-emptiness: ${relPath} (${stat.size} bytes)`);
}

// 2. Forensic inspection of CSS Module
const cssPath = path.join(root, "apps/web/components/highschool/tamrin20/tamrin20.module.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

// Assert 0 raw hex literals
const rawHexMatches = cssContent.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
assert.equal(rawHexMatches.length, 0, `Forbidden raw hex colors found: ${rawHexMatches.join(", ")}`);
console.log("✓ Forensic Check: 0 raw hex colors in tamrin20.module.css");

// Assert 0 physical left/right properties
const physicalDirections = cssContent.match(/\b(margin-left|margin-right|padding-left|padding-right|border-left|border-right)\b/g) || [];
assert.equal(physicalDirections.length, 0, `Forbidden physical directions found: ${physicalDirections.join(", ")}`);
console.log("✓ Forensic Check: 0 physical direction CSS properties (100% logical)");

// Assert key design tokens exist in CSS
const requiredTokens = [
  "var(--color-surface)",
  "var(--color-text)",
  "var(--color-border)",
  "var(--color-action)",
  "var(--color-success-green)",
  "var(--color-error-red)",
  "var(--color-success-bg)",
  "var(--color-error-bg)",
];
for (const token of requiredTokens) {
  assert.ok(cssContent.includes(token), `CSS Module must contain token: ${token}`);
}
console.log("✓ Forensic Check: All required Endoora design tokens present in CSS");

// 3. Forensic inspection of tamrin20-data.ts logic
// Import data loader directly using node experimental strip types
const dataLoaderPath = path.join(root, "apps/web/lib/tamrin20-data.ts");
const dataMod = await import(pathToFileURL(dataLoaderPath).href);

// Check required exports
const expectedExports = [
  "getTamrin20Lesson",
  "getTamrin20LessonAsync",
  "getAllTamrin20Lessons",
  "getTamrin20SkillBatch",
  "getTamrin20Question",
  "normalizeAnswer",
  "evaluateAnswer",
  "getVisibleQuestions",
  "createDefaultProgressRecord",
  "recordQuestionAttempt",
  "deserializeProgress",
  "STORAGE_KEY_PROGRESS",
];

for (const exp of expectedExports) {
  assert.ok(exp in dataMod, `tamrin20-data.ts must export ${exp}`);
}
console.log("✓ Forensic Check: All 12 required symbols exported from tamrin20-data.ts");

// Test normalizeAnswer with extreme / adversarial inputs
assert.equal(dataMod.normalizeAnswer("   "), "");
assert.equal(dataMod.normalizeAnswer("test..."), "test");
assert.equal(dataMod.normalizeAnswer("  يادگيري  "), "یادگیری");
assert.equal(dataMod.normalizeAnswer("كتاب"), "کتاب");
assert.equal(dataMod.normalizeAnswer("  ۰۱۲۳۴۵۶۷۸۹  "), "0123456789");
assert.equal(dataMod.normalizeAnswer("٠١٢٣٤٥٦٧٨٩"), "0123456789");
assert.equal(dataMod.normalizeAnswer("Multiple    Spaces   Between"), "multiple spaces between");
console.log("✓ Forensic Check: normalizeAnswer correctly handles all edge cases and Persian/Arabic script variants");

// Test evaluateAnswer authentic logic
const sampleQ = {
  id: "test-q1",
  grade: 12,
  lesson: 1,
  skill: "grammar",
  examPeriod: "خرداد ۱۴۰۲",
  questionType: "multiple_choice",
  prompt: "Test question",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 2, // Option C
  explanation: {
    briefFa: "توضیح کوتاه",
    detailedFa: "توضیح کامل و تشریحی برای پاسخ تست",
    pedagogicalRuleFa: "نکته گرامری",
  },
  isInitialBatch: true,
  orderIndex: 1,
};

// Test correct evaluation
const correctResult = dataMod.evaluateAnswer(sampleQ, 2);
assert.equal(correctResult.isCorrect, true);
assert.equal(correctResult.feedbackState, "correct");
assert.equal(correctResult.showExplanationToggle, true);
assert.equal(correctResult.isExplanationOpen, false);
assert.equal(correctResult.revealedAnswer, null);

// Test correct evaluation via Persian numeral "۲"
const correctPersian = dataMod.evaluateAnswer(sampleQ, "۲");
assert.equal(correctPersian.isCorrect, true);

// Test correct evaluation via option text "Option C"
const correctText = dataMod.evaluateAnswer(sampleQ, "option c");
assert.equal(correctText.isCorrect, true);

// Test incorrect evaluation
const incorrectResult = dataMod.evaluateAnswer(sampleQ, 0);
assert.equal(incorrectResult.isCorrect, false);
assert.equal(incorrectResult.feedbackState, "incorrect");
assert.equal(incorrectResult.showExplanationToggle, false);
assert.equal(incorrectResult.isExplanationOpen, true);
assert.equal(incorrectResult.revealedAnswer, 2);
assert.equal(incorrectResult.revealedAnswerText, "Option C");
console.log("✓ Forensic Check: evaluateAnswer performs genuine answer validation without hardcoding");

// 4. Test Progressive loading slicing
const dummyQuestions = Array.from({ length: 30 }, (_, i) => ({ id: `q-${i}`, orderIndex: i }));
const sliceInitial = dataMod.getVisibleQuestions(dummyQuestions, false);
assert.equal(sliceInitial.length, 20);
const sliceExpanded = dataMod.getVisibleQuestions(dummyQuestions, true);
assert.equal(sliceExpanded.length, 30);
console.log("✓ Forensic Check: getVisibleQuestions correctly slices 20 initial and full bank upon expansion");

// 5. Test Audio Assets existence for all listening questions in data banks
const lessons = [1, 2, 3];
let totalListeningTested = 0;
for (const l of lessons) {
  const lessonData = dataMod.getTamrin20Lesson(l);
  assert.ok(lessonData, `Lesson ${l} must exist`);
  const listeningBatch = lessonData.skills.listening;
  assert.ok(listeningBatch, `Listening skill batch in lesson ${l} must exist`);
  for (const q of listeningBatch.questions) {
    if (q.audioUrl) {
      const audioFsPath = path.join(root, "apps", "web", "public", q.audioUrl.replace(/^\//, ""));
      assert.ok(fs.existsSync(audioFsPath), `Audio file on disk missing: ${audioFsPath} for question ${q.id}`);
      const st = fs.statSync(audioFsPath);
      assert.ok(st.size > 1000, `Audio file too small: ${audioFsPath} (${st.size} bytes)`);
      totalListeningTested++;
    }
  }
}
console.log(`✓ Forensic Check: All ${totalListeningTested} audio files across lessons 1-3 physically verified on disk`);

// 6. Test Component Barrel Export in index.ts
const indexPath = path.join(root, "apps/web/components/highschool/tamrin20/index.ts");
const indexContent = fs.readFileSync(indexPath, "utf-8");
assert.ok(indexContent.includes("Tamrin20Player"));
assert.ok(indexContent.includes("Tamrin20QuestionCard"));
assert.ok(indexContent.includes("Tamrin20AudioPlayer"));
console.log("✓ Forensic Check: Barrel export index.ts correctly re-exports all 3 core UI components");

console.log("\n============================================================");
console.log("🎉 ALL INDEPENDENT FORENSIC CHECKS PASSED WITH ZERO VIOLATIONS!");
console.log("============================================================\n");
