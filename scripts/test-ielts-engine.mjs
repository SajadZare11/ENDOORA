import { gradeExamModule, normalizeAnswer, isAnswerCorrect, calculateIeltsBandScore, mapBandToCEFR } from "../apps/web/lib/ielts-grading.ts";
import { ALL_IELTS_EXAMS, getIeltsExamById } from "../apps/web/data/ielts/index.ts";

console.log("=== RUNNING IELTS ENGINE INTEGRATION VERIFICATION ===");

// 1. Verify Exam Count
const exams = ALL_IELTS_EXAMS;
if (exams.length < 30) {
  throw new Error(`Expected at least 30 exams, got ${exams.length}`);
}
console.log(`✓ ${exams.length} Mock exams verified in catalog (Goal: 30-50 tests)`);

// 2. Verify Every Reading & Listening Module has strictly 40 questions
for (const exam of exams) {
  for (const mod of exam.modules) {
    if (mod.skill === "listening" || mod.skill === "reading") {
      const qCount = mod.sections.reduce((acc, s) => acc + s.questions.length, 0);
      if (qCount !== 40) {
        throw new Error(`Exam ${exam.id} skill ${mod.skill} has ${qCount} questions, expected 40`);
      }
      // verify sequential numbering 1..40
      const qNums = mod.sections.flatMap(s => s.questions.map(q => q.question_number));
      qNums.sort((a, b) => a - b);
      for (let i = 0; i < 40; i++) {
        if (qNums[i] !== i + 1) {
          throw new Error(`Exam ${exam.id} skill ${mod.skill} missing question number ${i + 1}`);
        }
      }
    }
  }
}
console.log(`✓ Strictly 40 sequential questions verified for all Reading and Listening modules`);

// 3. Verify Normalization & Answer Matching
const norm1 = normalizeAnswer("  The Central Library.  ");
if (norm1 !== "central library") throw new Error(`Normalization failed for articles/spaces: ${norm1}`);

if (!isAnswerCorrect("True", ["TRUE", "T"])) throw new Error("T/F matching failed");
if (!isAnswerCorrect("8:30", ["8.30"])) throw new Error("Time format equivalence failed");
if (!isAnswerCorrect("  the green tree. ", ["Green Tree"])) throw new Error("Article/punctuation match failed");

console.log(`✓ String normalization & answer matcher verified`);

// 4. Verify Raw to Band Score Curves
const testCases = [
  { skill: "listening", raw: 39, expected: 9.0, category: "Academic" },
  { skill: "listening", raw: 35, expected: 8.0, category: "Academic" },
  { skill: "listening", raw: 30, expected: 7.0, category: "Academic" },
  { skill: "listening", raw: 23, expected: 6.0, category: "Academic" },
  { skill: "reading", raw: 34, expected: 7.5, category: "Academic" },
  { skill: "reading", raw: 34, expected: 7.0, category: "General" }, // General vs Academic curve distinction
  { skill: "reading", raw: 39, expected: 9.0, category: "Academic" },
  { skill: "reading", raw: 39, expected: 8.5, category: "General" },
];

for (const tc of testCases) {
  const band = calculateIeltsBandScore(tc.raw, tc.skill, tc.category);
  if (band !== tc.expected) {
    throw new Error(`Band conversion failed for ${tc.skill} (${tc.category}) raw ${tc.raw}: got ${band}, expected ${tc.expected}`);
  }
}
console.log(`✓ Official IELTS raw-to-band conversion curves verified (Academic vs General distinction)`);

// 5. Test Full Module Auto-Grading
const exam1 = exams[0];
if (!exam1) throw new Error("Could not find exam");
const readingMod = exam1.modules.find(m => m.skill === "reading");

// Simulate answers: answer first 35 correctly, rest blank
const simAnswers = {};
let correctExpected = 0;
readingMod.sections.forEach(s => {
  s.questions.forEach(q => {
    if (q.question_number <= 35) {
      simAnswers[q.question_number] = q.accepted_answers[0];
      correctExpected++;
    } else {
      simAnswers[q.question_number] = "";
    }
  });
});

const gradeResult = gradeExamModule(readingMod, simAnswers, "Academic");
if (gradeResult.summary.raw_score !== 35) {
  throw new Error(`Expected raw_score 35, got ${gradeResult.summary.raw_score}`);
}
if (gradeResult.summary.band_score !== 8.0) {
  throw new Error(`Expected band_score 8.0, got ${gradeResult.summary.band_score}`);
}
if (gradeResult.gradingResults.length !== 40) {
  throw new Error(`Expected 40 question results, got ${gradeResult.gradingResults.length}`);
}

console.log(`✓ Full module grading engine verified (Raw: ${gradeResult.summary.raw_score}/40, Band: ${gradeResult.summary.band_score})`);

console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
