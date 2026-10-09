import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const dataDir = path.join(root, "apps", "web", "data", "highschool", "tamrin20");
const publicDir = path.join(root, "apps", "web", "public");

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ DATA INTEGRITY VIOLATION: ${message}`);
    process.exit(1);
  }
}

console.log("🔍 Validating 'تمرین تا ۲۰' (Vision 3) Final Exam Question Bank...");

const lessons = [1, 2, 3];
const skills = ["listening", "vocabulary", "grammar", "reading", "writing"];
const seenIds = new Set();
let totalQuestionsCount = 0;
let initialBatchCount = 0;
let audioFilesChecked = 0;

for (const lessonNum of lessons) {
  const filePath = path.join(dataDir, `grade12-lesson${lessonNum}-tamrin20.json`);
  assert(fs.existsSync(filePath), `Missing lesson data file: ${filePath}`);
  
  const lessonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert(lessonData.grade === 12, `Lesson ${lessonNum}: expected grade 12, got ${lessonData.grade}`);
  assert(lessonData.lesson === lessonNum, `Lesson ${lessonNum}: mismatched lesson number (expected ${lessonNum}, got ${lessonData.lesson})`);
  assert(lessonData.book === "Vision 3", `Lesson ${lessonNum}: expected book 'Vision 3', got '${lessonData.book}'`);
  assert(typeof lessonData.titleFa === "string" && lessonData.titleFa.length > 0, `Lesson ${lessonNum}: missing titleFa`);
  assert(typeof lessonData.titleEn === "string" && lessonData.titleEn.length > 0, `Lesson ${lessonNum}: missing titleEn`);
  assert(lessonData.skills, `Lesson ${lessonNum}: missing skills container`);

  for (const skill of skills) {
    const batch = lessonData.skills[skill];
    assert(batch, `Lesson ${lessonNum}: missing skill section '${skill}'`);
    assert(Array.isArray(batch.questions), `Lesson ${lessonNum} [${skill}]: questions must be an array`);
    assert(batch.skillTitleFa && batch.skillTitleFa.length > 0, `Lesson ${lessonNum} [${skill}]: missing skillTitleFa`);
    assert(batch.skillTitleEn && batch.skillTitleEn.length > 0, `Lesson ${lessonNum} [${skill}]: missing skillTitleEn`);
    assert(batch.totalQuestions === batch.questions.length, `Lesson ${lessonNum} [${skill}]: totalQuestions mismatch (${batch.totalQuestions} vs ${batch.questions.length})`);
    assert(batch.initialCount === 20, `Lesson ${lessonNum} [${skill}]: expected initialCount=20, got ${batch.initialCount}`);
    
    // HARD ACCEPTANCE RULE: Minimum 20 questions per skill/lesson
    assert(
      batch.questions.length >= 20,
      `Lesson ${lessonNum} [${skill}]: Expected at least 20 questions, found only ${batch.questions.length}!`
    );

    // Verify initial batch count: EXACTLY 20 questions marked isInitialBatch
    const initialQuestions = batch.questions.filter(q => q.isInitialBatch);
    assert(
      initialQuestions.length === 20,
      `Lesson ${lessonNum} [${skill}]: Expected exactly 20 questions marked isInitialBatch=true, found ${initialQuestions.length}!`
    );
    initialBatchCount += initialQuestions.length;

    for (let i = 0; i < batch.questions.length; i++) {
      const q = batch.questions[i];
      totalQuestionsCount++;

      // ID Uniqueness & format
      assert(q.id && typeof q.id === "string", `Lesson ${lessonNum} [${skill}][${i}]: Missing or invalid question ID`);
      assert(!seenIds.has(q.id), `Duplicate question ID detected: ${q.id}`);
      seenIds.add(q.id);

      // Lesson & skill consistency
      assert(q.grade === 12, `Question ${q.id}: expected grade 12, got ${q.grade}`);
      assert(q.lesson === lessonNum, `Question ${q.id}: lesson number mismatch`);
      assert(q.skill === skill, `Question ${q.id}: skill mismatch (expected ${skill}, got ${q.skill})`);
      assert(typeof q.orderIndex === "number" && q.orderIndex === i + 1, `Question ${q.id}: orderIndex mismatch (expected ${i + 1}, got ${q.orderIndex})`);

      // Prompt validation
      assert(q.prompt && q.prompt.trim().length > 3, `Question ${q.id}: Empty or invalid prompt`);

      // Answer key validation
      if (q.questionType === "multiple_choice") {
        assert(Array.isArray(q.options) && q.options.length >= 3, `Question ${q.id}: MCQ requires >= 3 options`);
        assert(
          typeof q.correctAnswer === "number" && q.correctAnswer >= 0 && q.correctAnswer < q.options.length,
          `Question ${q.id}: Invalid correctAnswer index (${q.correctAnswer}) for options length ${q.options.length}`
        );
      } else {
        assert(
          (typeof q.correctAnswer === "string" && q.correctAnswer.trim().length > 0) || Array.isArray(q.acceptableAnswers),
          `Question ${q.id}: Non-MCQ question missing valid correctAnswer or acceptableAnswers`
        );
      }

      // Educational Explanation validation
      assert(q.explanation, `Question ${q.id}: Missing explanation object`);
      assert(
        q.explanation.detailedFa && q.explanation.detailedFa.trim().length >= 15,
        `Question ${q.id}: detailedFa explanation is missing or too brief (minimum 15 characters required)`
      );

      // Audio file presence check for Listening questions
      if (skill === "listening" || q.audioUrl) {
        assert(q.audioUrl, `Question ${q.id}: Listening question missing audioUrl`);
        const cleanAudioPath = q.audioUrl.startsWith("/") ? q.audioUrl.slice(1) : q.audioUrl;
        const physicalAudioPath = path.join(publicDir, cleanAudioPath);
        assert(
          fs.existsSync(physicalAudioPath),
          `Question ${q.id}: Audio file does not exist on disk: ${physicalAudioPath}`
        );
        const stats = fs.statSync(physicalAudioPath);
        assert(stats.size > 0, `Question ${q.id}: Audio file is 0 bytes: ${physicalAudioPath}`);
        audioFilesChecked++;
      }
    }
    console.log(`  ✓ Lesson ${lessonNum} [${skill}]: ${batch.questions.length} questions verified (20 initial, ${batch.questions.length - 20} progressive)`);
  }
}

console.log("\n=======================================================");
console.log(`🎉 ALL ${totalQuestionsCount} QUESTIONS ACROSS 3 LESSONS AND 5 SKILLS VALIDATED!`);
console.log(`   - 15/15 categories verified with >= 20 questions each.`);
console.log(`   - Exactly ${initialBatchCount} initial batch questions (20 per skill) verified.`);
console.log(`   - ${audioFilesChecked} listening audio references physically verified on disk.`);
console.log(`   - 100% unique question IDs, valid answer keys, and pedagogical explanations.`);
console.log("=======================================================\n");
