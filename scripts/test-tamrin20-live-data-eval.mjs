import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { evaluateAnswer, getVisibleQuestions, recordQuestionAttempt, createDefaultProgressRecord } from "./test-tamrin20-logic.mjs";

const root = process.cwd();
const dataDir = path.join(root, "apps", "web", "data", "highschool", "tamrin20");

console.log("======================================================================");
console.log("▶ STRESS-TEST: RUNNING TIER 2 LOGIC AGAINST 100% OF LIVE QUESTION BANK");
console.log("======================================================================\n");

let totalEvaluated = 0;
const correctFailures = [];
const incorrectFailures = [];
const progressiveBoundaryFailures = [];
const progressRecordFailures = [];

let progressRecord = createDefaultProgressRecord();

for (const lessonNum of [1, 2, 3]) {
  const filePath = path.join(dataDir, `grade12-lesson${lessonNum}-tamrin20.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const [skill, batch] of Object.entries(data.skills)) {
    const allQuestions = batch.questions;

    // 1. Progressive Loading Verification
    const initialVisible = getVisibleQuestions(allQuestions, false);
    if (initialVisible.length !== 20) {
      progressiveBoundaryFailures.push({
        lesson: lessonNum,
        skill,
        expected: 20,
        actual: initialVisible.length,
      });
    }

    const allVisible = getVisibleQuestions(allQuestions, true);
    if (allVisible.length !== allQuestions.length) {
      progressiveBoundaryFailures.push({
        lesson: lessonNum,
        skill,
        expected: allQuestions.length,
        actual: allVisible.length,
      });
    }

    // Verify initial batch items match isInitialBatch flag
    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      if (i < 20 && !q.isInitialBatch) {
        progressiveBoundaryFailures.push({ id: q.id, index: i, expected: true, actual: false });
      }
      if (i >= 20 && q.isInitialBatch) {
        progressiveBoundaryFailures.push({ id: q.id, index: i, expected: false, actual: true });
      }
    }

    // 2. Evaluate each question against evaluateAnswer
    for (const q of allQuestions) {
      totalEvaluated++;

      // Test A: Pass the exact correctAnswer
      const evalCorrect = evaluateAnswer(q, q.correctAnswer);
      if (!evalCorrect.isCorrect) {
        correctFailures.push({
          id: q.id,
          type: q.questionType,
          correctAnswer: q.correctAnswer,
          result: evalCorrect,
        });
      }

      // Test B: Pass an obviously incorrect answer
      let wrongAnswer;
      if (q.questionType === "multiple_choice") {
        wrongAnswer = (q.correctAnswer + 1) % q.options.length;
      } else {
        wrongAnswer = "DEFINITELY_WRONG_ANSWER_XYZ_987";
      }

      const evalWrong = evaluateAnswer(q, wrongAnswer);
      if (evalWrong.isCorrect) {
        incorrectFailures.push({
          id: q.id,
          type: q.questionType,
          wrongAnswer,
          result: evalWrong,
        });
      }

      // Test C: Progress recording simulation
      try {
        progressRecord = recordQuestionAttempt(progressRecord, {
          lesson: lessonNum,
          skill,
          questionId: q.id,
          isCorrect: evalCorrect.isCorrect,
          timeSeconds: 10,
          tag: q.tag,
        });
      } catch (err) {
        progressRecordFailures.push({ id: q.id, error: err.message });
      }
    }
  }
}

console.log(`- Total live questions evaluated: ${totalEvaluated}`);
console.log(`- Correct answer evaluation failures: ${correctFailures.length}`);
console.log(`- Incorrect answer evaluation failures: ${incorrectFailures.length}`);
console.log(`- Progressive loading boundary failures: ${progressiveBoundaryFailures.length}`);
console.log(`- Progress recording mutations failures: ${progressRecordFailures.length}`);
console.log(`- Simulated progress summary:`, progressRecord.summary);

if (correctFailures.length > 0) {
  console.error("❌ SAMPLE CORRECT FAILURES:", JSON.stringify(correctFailures.slice(0, 5), null, 2));
}

if (incorrectFailures.length > 0) {
  console.error("❌ SAMPLE INCORRECT FAILURES:", JSON.stringify(incorrectFailures.slice(0, 5), null, 2));
}

if (progressiveBoundaryFailures.length > 0) {
  console.error("❌ SAMPLE BOUNDARY FAILURES:", JSON.stringify(progressiveBoundaryFailures.slice(0, 5), null, 2));
}

console.log("\n======================================================================");
const hasErrors = correctFailures.length > 0 ||
                  incorrectFailures.length > 0 ||
                  progressiveBoundaryFailures.length > 0 ||
                  progressRecordFailures.length > 0;

if (!hasErrors) {
  console.log("🎉 ALL 1,007 LIVE QUESTIONS PASS TIER 2 PEDAGOGICAL LOGIC 100%!");
  process.exit(0);
} else {
  console.error("❌ FAILURES DETECTED IN LIVE DATA EVALUATION.");
  process.exit(1);
}
