/**
 * Comprehensive Empirical Adversarial Stress Test Suite
 * Milestone M2 Challenger 1: "تمرین تا ۲۰" Practice Engine & Data Layer
 *
 * Targets:
 * - apps/web/lib/tamrin20-data.ts
 * - Component rendering invariants & boundary safety
 */

import assert from "node:assert/strict";
import path from "node:path";
import process from "node:process";
import {
  ALL_LESSONS,
  ALL_SKILLS,
  SKILL_TITLES_FA,
  SKILL_TITLES_EN,
  getTamrin20Lesson,
  getTamrin20LessonAsync,
  getAllTamrin20Lessons,
  getTamrin20SkillBatch,
  getTamrin20Question,
  normalizeAnswer,
  evaluateAnswer,
  getVisibleQuestions,
  createDefaultProgressRecord,
  recordQuestionAttempt,
  deserializeProgress,
} from "../apps/web/lib/tamrin20-data.ts";

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;
const failureDetails = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    totalPassed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    totalFailed++;
    failureDetails.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function testAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    totalPassed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    totalFailed++;
    failureDetails.push({ name, error: err.message, stack: err.stack });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function runAllSuites() {
  console.log("======================================================================");
  console.log("🔥 STARTING M2 CHALLENGER 1 ADVERSARIAL STRESS TEST SUITE");
  console.log("======================================================================\n");

  // ============================================================================
  // SUITE 1: Data Accessors & Boundary Inputs
  // ============================================================================
  console.log("📦 SUITE 1: Data Loader & Accessor Boundaries");

  test("getTamrin20Lesson returns valid data for integer 1, 2, 3", () => {
    for (const n of [1, 2, 3]) {
      const lesson = getTamrin20Lesson(n);
      assert.ok(lesson, `Lesson ${n} should exist`);
      assert.equal(lesson.lesson, n);
      assert.equal(lesson.grade, 12);
      assert.equal(lesson.book, "Vision 3");
    }
  });

  test("getTamrin20Lesson supports string inputs '1', '2', '3'", () => {
    assert.equal(getTamrin20Lesson("1")?.lesson, 1);
    assert.equal(getTamrin20Lesson("2")?.lesson, 2);
    assert.equal(getTamrin20Lesson("3")?.lesson, 3);
  });

  test("getTamrin20Lesson handles out-of-bounds, negative, zero, and malformed inputs gracefully", () => {
    const invalidInputs = [0, 4, -1, 99, "0", "4", "-1", "abc", "", null, undefined, NaN, 1.5];
    for (const inv of invalidInputs) {
      const res = getTamrin20Lesson(inv);
      assert.equal(res, null, `Input ${JSON.stringify(inv)} should return null, got ${typeof res}`);
    }
  });

  await testAsync("getTamrin20LessonAsync resolves properly for valid and invalid inputs", async () => {
    const l1 = await getTamrin20LessonAsync(1);
    assert.equal(l1?.lesson, 1);
    const lInvalid = await getTamrin20LessonAsync("xyz");
    assert.equal(lInvalid, null);
  });

  test("getAllTamrin20Lessons returns exactly 3 complete lessons", () => {
    const all = getAllTamrin20Lessons();
    assert.equal(all.length, 3);
    assert.deepEqual(all.map((l) => l.lesson), [1, 2, 3]);
  });

  test("getTamrin20SkillBatch returns batches for all 15 valid lesson-skill combinations", () => {
    for (const l of [1, 2, 3]) {
      for (const s of ALL_SKILLS) {
        const batch = getTamrin20SkillBatch(l, s);
        assert.ok(batch, `Batch for lesson ${l} skill ${s} must exist`);
        assert.ok(batch.totalQuestions >= 20, `Batch ${l}-${s} totalQuestions (${batch.totalQuestions}) >= 20`);
        assert.ok(Array.isArray(batch.questions), `Batch ${l}-${s} questions must be an array`);
        assert.equal(batch.questions.length, batch.totalQuestions);
        assert.ok(batch.skillTitleFa.length > 0);
        assert.ok(batch.skillTitleEn.length > 0);
      }
    }
  });

  test("getTamrin20SkillBatch returns null for invalid lesson or skill", () => {
    assert.equal(getTamrin20SkillBatch(4, "grammar"), null);
    assert.equal(getTamrin20SkillBatch(1, "invalid_skill"), null);
    assert.equal(getTamrin20SkillBatch(0, "listening"), null);
    assert.equal(getTamrin20SkillBatch(2, ""), null);
    assert.equal(getTamrin20SkillBatch(null, "vocabulary"), null);
  });

  test("getTamrin20Question retrieves valid questions across boundary indices (first, 20th, last)", () => {
    for (const l of [1, 2, 3]) {
      for (const s of ALL_SKILLS) {
        const batch = getTamrin20SkillBatch(l, s);
        assert.ok(batch);
        const firstQ = batch.questions[0];
        const twentiethQ = batch.questions[19];
        const lastQ = batch.questions[batch.questions.length - 1];

        assert.equal(getTamrin20Question(l, s, firstQ.id)?.id, firstQ.id);
        assert.equal(getTamrin20Question(l, s, twentiethQ.id)?.id, twentiethQ.id);
        assert.equal(getTamrin20Question(l, s, lastQ.id)?.id, lastQ.id);
      }
    }
  });

  test("getTamrin20Question returns null for non-existent IDs and invalid scopes", () => {
    assert.equal(getTamrin20Question(1, "grammar", "non-existent-id-999"), null);
    assert.equal(getTamrin20Question(1, "invalid_skill", "v3-l1-gram-01"), null);
    assert.equal(getTamrin20Question(99, "grammar", "v3-l1-gram-01"), null);
    assert.equal(getTamrin20Question(1, "grammar", ""), null);
  });

  // ============================================================================
  // SUITE 2: Answer Normalization Under Extreme Stress
  // ============================================================================
  console.log("\n🧪 SUITE 2: Answer Normalization Stress Tests");

  test("normalizeAnswer handles null, undefined, boolean, and empty string safely", () => {
    assert.equal(normalizeAnswer(null), "");
    assert.equal(normalizeAnswer(undefined), "");
    assert.equal(normalizeAnswer(""), "");
    assert.equal(normalizeAnswer("    "), "");
    assert.equal(normalizeAnswer(true), "true");
    assert.equal(normalizeAnswer(false), "false");
  });

  test("normalizeAnswer converts all Persian (۰-۹) and Arabic (٠-٩) digits to ASCII (0-9)", () => {
    assert.equal(normalizeAnswer("۰۱۲۳۴۵۶۷۸۹"), "0123456789");
    assert.equal(normalizeAnswer("٠١٢٣٤٥٦٧٨٩"), "0123456789");
    assert.equal(normalizeAnswer("گزینه ۱"), "گزینه 1");
    assert.equal(normalizeAnswer("گزینه ٤"), "گزینه 4");
    assert.equal(normalizeAnswer("سوال ۲۵"), "سوال 25");
  });

  test("normalizeAnswer handles interleaved mixed digits and alphabets", () => {
    assert.equal(normalizeAnswer("A۱B۲C۳"), "a1b2c3");
    assert.equal(normalizeAnswer("grade ۱۲ vision ۳"), "grade 12 vision 3");
    assert.equal(normalizeAnswer("  ۱۰.۵  "), "10.5");
  });

  test("normalizeAnswer normalizes Arabic Yeh (ي) and Kaf (ك) to Persian variants", () => {
    assert.equal(normalizeAnswer("كتاب يادگيري"), "کتاب یادگیری");
    assert.equal(normalizeAnswer("دانش آموزي"), "دانش آموزی");
    assert.equal(normalizeAnswer("شگفت انگيز"), "شگفت انگیز");
  });

  test("normalizeAnswer collapses diverse whitespace (spaces, tabs, newlines, NBSP)", () => {
    assert.equal(normalizeAnswer("word1   word2"), "word1 word2");
    assert.equal(normalizeAnswer("word1\t\tword2"), "word1 word2");
    assert.equal(normalizeAnswer("word1\n\nword2"), "word1 word2");
    assert.equal(normalizeAnswer("word1\r\nword2"), "word1 word2");
    assert.equal(normalizeAnswer("word1\u00A0word2"), "word1 word2"); // Non-breaking space
    assert.equal(normalizeAnswer("  \t\n  solar   power  \r\n  "), "solar power");
  });

  test("normalizeAnswer strips trailing punctuation while preserving internal apostrophes and hyphens", () => {
    assert.equal(normalizeAnswer("pollute."), "pollute");
    assert.equal(normalizeAnswer("pollute!"), "pollute");
    assert.equal(normalizeAnswer("pollute?"), "pollute");
    assert.equal(normalizeAnswer("pollute؟"), "pollute");
    assert.equal(normalizeAnswer("pollute..."), "pollute");
    assert.equal(normalizeAnswer("pollute!?؟."), "pollute");

    // Internal punctuation preservation
    assert.equal(normalizeAnswer("don't"), "don't");
    assert.equal(normalizeAnswer("wasn't"), "wasn't");
    assert.equal(normalizeAnswer("well-known"), "well-known");
    assert.equal(normalizeAnswer("wind-powered"), "wind-powered");
    assert.equal(normalizeAnswer("U.S.A."), "u.s.a"); // Trailing stripped, internal preserved
  });

  test("normalizeAnswer handles unicode accents and symbols gracefully without throw", () => {
    assert.equal(normalizeAnswer("café"), "café");
    assert.equal(normalizeAnswer("RÉSUMÉ"), "résumé");
    assert.equal(normalizeAnswer("coöperate"), "coöperate");
    assert.equal(normalizeAnswer("100%"), "100%");
    assert.equal(normalizeAnswer("A + B = C"), "a + b = c");
  });

  // ============================================================================
  // SUITE 3: Pedagogical Evaluation Under Adversarial Inputs
  // ============================================================================
  console.log("\n🎯 SUITE 3: Pedagogical Evaluation & Option Matching");

  const mockMCQ = {
    id: "mcq-stress-01",
    grade: 12,
    lesson: 1,
    skill: "grammar",
    examPeriod: "خرداد ۱۴۰۲",
    questionType: "multiple_choice",
    prompt: "The letter ........ yesterday by Ali.",
    options: ["wrote", "was written", "has written", "is writing"],
    correctAnswer: 1,
    explanation: {
      briefFa: "جمله مجهول است.",
      detailedFa: "توضیح کامل در مورد مجهول در زمان گذشته ساده.",
      pedagogicalRuleFa: "کتاب دوازدهم درس ۱",
    },
    isInitialBatch: true,
    orderIndex: 1,
  };

  test("evaluateAnswer evaluates correct MCQ by numeric index 1", () => {
    const res = evaluateAnswer(mockMCQ, 1);
    assert.equal(res.isCorrect, true);
    assert.equal(res.feedbackState, "correct");
    assert.equal(res.colorToken, "var(--color-success)");
    assert.equal(res.showExplanationToggle, true);
    assert.equal(res.isExplanationOpen, false);
    assert.equal(res.revealedAnswer, null);
  });

  test("evaluateAnswer evaluates correct MCQ by ASCII string '1' and Persian '۱'", () => {
    assert.equal(evaluateAnswer(mockMCQ, "1").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "۱").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "١").isCorrect, true);
  });

  test("evaluateAnswer evaluates correct MCQ by option text matching (case-insensitive & trimmed)", () => {
    assert.equal(evaluateAnswer(mockMCQ, "was written").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "Was Written").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "WAS WRITTEN").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "  was written  ").isCorrect, true);
    assert.equal(evaluateAnswer(mockMCQ, "was written.").isCorrect, true);
  });

  test("evaluateAnswer rejects wrong MCQ option and auto-reveals correct answer + explanation", () => {
    const res = evaluateAnswer(mockMCQ, 0); // "wrote"
    assert.equal(res.isCorrect, false);
    assert.equal(res.feedbackState, "incorrect");
    assert.equal(res.colorToken, "var(--color-danger)");
    assert.equal(res.revealedAnswer, 1);
    assert.equal(res.revealedAnswerText, "was written");
    assert.equal(res.isExplanationOpen, true);
    assert.equal(res.showExplanationToggle, false);
  });

  test("evaluateAnswer rejects out-of-bounds MCQ choices safely", () => {
    assert.equal(evaluateAnswer(mockMCQ, -1).isCorrect, false);
    assert.equal(evaluateAnswer(mockMCQ, 4).isCorrect, false);
    assert.equal(evaluateAnswer(mockMCQ, 99).isCorrect, false);
    assert.equal(evaluateAnswer(mockMCQ, null).isCorrect, false);
    assert.equal(evaluateAnswer(mockMCQ, "").isCorrect, false);
    assert.equal(evaluateAnswer(mockMCQ, "completely random string").isCorrect, false);
  });

  test("MCQ with numeric index 0 works properly without falsy bug", () => {
    const mcqZero = {
      ...mockMCQ,
      id: "mcq-zero",
      correctAnswer: 0,
      options: ["solar energy", "fossil fuel", "nuclear"],
    };
    const res = evaluateAnswer(mcqZero, 0);
    assert.equal(res.isCorrect, true);
    assert.equal(evaluateAnswer(mcqZero, "0").isCorrect, true);
    assert.equal(evaluateAnswer(mcqZero, "۰").isCorrect, true);
    assert.equal(evaluateAnswer(mcqZero, "solar energy").isCorrect, true);
    assert.equal(evaluateAnswer(mcqZero, 1).isCorrect, false);
  });

  const mockFillBlank = {
    id: "fill-stress-01",
    grade: 12,
    lesson: 2,
    skill: "vocabulary",
    examPeriod: "شهریور ۱۴۰۲",
    questionType: "fill_in_the_blank",
    prompt: "We should not ........ the air.",
    correctAnswer: "pollute",
    acceptableAnswers: ["contaminate", "dirty"],
    explanation: {
      briefFa: "بعد از should فعل ساده می‌آید.",
      detailedFa: "واژه pollute به معنای آلوده کردن است.",
    },
    isInitialBatch: true,
    orderIndex: 2,
  };

  test("evaluateAnswer evaluates free-text with variations in casing, whitespace, and punctuation", () => {
    assert.equal(evaluateAnswer(mockFillBlank, "pollute").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "POLLUTE").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "  pollute  ").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "pollute.").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "pollute!").isCorrect, true);
  });

  test("evaluateAnswer matches acceptable alternative answers", () => {
    assert.equal(evaluateAnswer(mockFillBlank, "contaminate").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "CONTAMINATE").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "dirty").isCorrect, true);
    assert.equal(evaluateAnswer(mockFillBlank, "  dirty.  ").isCorrect, true);
  });

  test("evaluateAnswer rejects wrong free text, revealing the canonical correctAnswer", () => {
    const res = evaluateAnswer(mockFillBlank, "protect");
    assert.equal(res.isCorrect, false);
    assert.equal(res.feedbackState, "incorrect");
    assert.equal(res.revealedAnswer, "pollute");
    assert.equal(res.revealedAnswerText, "pollute");
    assert.equal(res.isExplanationOpen, true);
  });

  test("evaluateAnswer rejects empty, whitespace-only, and null inputs on free-text questions", () => {
    assert.equal(evaluateAnswer(mockFillBlank, "").isCorrect, false);
    assert.equal(evaluateAnswer(mockFillBlank, "   ").isCorrect, false);
    assert.equal(evaluateAnswer(mockFillBlank, null).isCorrect, false);
    assert.equal(evaluateAnswer(mockFillBlank, undefined).isCorrect, false);
  });

  // Non-MCQ question with options (e.g. True/False question in reading/listening)
  const mockTrueFalse = {
    id: "tf-stress-01",
    grade: 12,
    lesson: 3,
    skill: "reading",
    examPeriod: "دی ۱۴۰۱",
    questionType: "reading_passage_qa",
    prompt: "The solar panels produce clean energy.",
    options: ["True", "False"],
    correctAnswer: "True",
    acceptableAnswers: ["T", "true", "درست"],
    explanation: {
      briefFa: "متن صریحاً اشاره کرده است.",
      detailedFa: "در بند دوم متن ذکر شده که صفحات خورشیدی انرژی پاک تولید می‌کنند.",
    },
    isInitialBatch: true,
    orderIndex: 3,
  };

  test("evaluateAnswer evaluates options-based True/False question via string, option index, or acceptable answer", () => {
    // Option text
    assert.equal(evaluateAnswer(mockTrueFalse, "True").isCorrect, true);
    assert.equal(evaluateAnswer(mockTrueFalse, "true").isCorrect, true);
    assert.equal(evaluateAnswer(mockTrueFalse, "TRUE").isCorrect, true);

    // Acceptable answers
    assert.equal(evaluateAnswer(mockTrueFalse, "T").isCorrect, true);
    assert.equal(evaluateAnswer(mockTrueFalse, "درست").isCorrect, true);

    // Option index 0 corresponds to "True"
    assert.equal(evaluateAnswer(mockTrueFalse, 0).isCorrect, true);

    // Wrong option index 1 corresponds to "False"
    assert.equal(evaluateAnswer(mockTrueFalse, 1).isCorrect, false);
    assert.equal(evaluateAnswer(mockTrueFalse, "False").isCorrect, false);
  });

  // ============================================================================
  // SUITE 4: Progressive Loading Slicing Logic Boundaries
  // ============================================================================
  console.log("\n📐 SUITE 4: Progressive Loading Slice Logic Boundaries");

  const mockBatch45 = Array.from({ length: 45 }, (_, i) => ({
    id: `q-${i + 1}`,
    prompt: `Question ${i + 1}`,
    orderIndex: i + 1,
    isInitialBatch: i < 20,
  }));

  test("getVisibleQuestions returns empty array for null/undefined/non-array inputs", () => {
    assert.deepEqual(getVisibleQuestions(null, false), []);
    assert.deepEqual(getVisibleQuestions(undefined, true), []);
    assert.deepEqual(getVisibleQuestions("not an array", false), []);
    assert.deepEqual(getVisibleQuestions({}, false), []);
  });

  test("getVisibleQuestions boundary: empty array []", () => {
    assert.deepEqual(getVisibleQuestions([], false), []);
    assert.deepEqual(getVisibleQuestions([], true), []);
  });

  test("getVisibleQuestions boundary: small batches (<20 items: 1, 5, 19)", () => {
    for (const count of [1, 5, 19]) {
      const subset = mockBatch45.slice(0, count);
      const collapsed = getVisibleQuestions(subset, false);
      const expanded = getVisibleQuestions(subset, true);
      assert.equal(collapsed.length, count, `Collapsed length for ${count} should be ${count}`);
      assert.equal(expanded.length, count, `Expanded length for ${count} should be ${count}`);
      assert.deepEqual(collapsed, subset);
      assert.deepEqual(expanded, subset);
    }
  });

  test("getVisibleQuestions boundary: exact 20 items", () => {
    const exact20 = mockBatch45.slice(0, 20);
    const collapsed = getVisibleQuestions(exact20, false);
    const expanded = getVisibleQuestions(exact20, true);
    assert.equal(collapsed.length, 20);
    assert.equal(expanded.length, 20);
    assert.deepEqual(collapsed, exact20);
    assert.deepEqual(expanded, exact20);
  });

  test("getVisibleQuestions boundary: large batches (>20 items: 21, 45, 100)", () => {
    for (const count of [21, 45]) {
      const subset = mockBatch45.slice(0, count);
      const collapsed = getVisibleQuestions(subset, false);
      const expanded = getVisibleQuestions(subset, true);
      assert.equal(collapsed.length, 20, `Collapsed length for count ${count} must be exactly 20`);
      assert.equal(expanded.length, count, `Expanded length for count ${count} must be ${count}`);
      assert.equal(collapsed[0].id, "q-1");
      assert.equal(collapsed[19].id, "q-20");
      assert.equal(expanded[count - 1].id, `q-${count}`);
    }
  });

  test("getVisibleQuestions does not mutate the source array", () => {
    const original = [...mockBatch45];
    const slice1 = getVisibleQuestions(mockBatch45, false);
    assert.equal(mockBatch45.length, 45);
    assert.deepEqual(mockBatch45, original);
    slice1.push({ id: "mutated" });
    assert.equal(mockBatch45.length, 45);
  });

  // ============================================================================
  // SUITE 5: Progress Recording & State Mutations Stress
  // ============================================================================
  console.log("\n📊 SUITE 5: Progress Persistence & Storage Stress");

  test("recordQuestionAttempt handles multiple lessons, skills, and error accumulation", () => {
    let record = createDefaultProgressRecord();

    // Attempt 10 questions across lessons 1, 2, 3
    record = recordQuestionAttempt(record, {
      lesson: 1,
      skill: "grammar",
      questionId: "v3-l1-gram-01",
      isCorrect: true,
      timeSeconds: 12,
      tag: "passive",
    });

    record = recordQuestionAttempt(record, {
      lesson: 1,
      skill: "grammar",
      questionId: "v3-l1-gram-02",
      isCorrect: false,
      timeSeconds: 18,
      tag: "passive",
    });

    record = recordQuestionAttempt(record, {
      lesson: 2,
      skill: "vocabulary",
      questionId: "v3-l2-voc-01",
      isCorrect: false,
      timeSeconds: 25,
      tag: "environment",
    });

    assert.equal(record.summary.totalAttempted, 3);
    assert.equal(record.summary.totalCorrect, 1);
    assert.equal(record.summary.totalTimeSeconds, 55);
    assert.equal(record.byLesson[1].grammar.attempted, 2);
    assert.equal(record.byLesson[1].grammar.correct, 1);
    assert.equal(record.byLesson[2].vocabulary.attempted, 1);
    assert.equal(record.byLesson[2].vocabulary.correct, 0);

    // Weak tags
    assert.equal(record.weakTags["passive"], 1);
    assert.equal(record.weakTags["environment"], 1);

    // Completed IDs
    assert.equal(record.completedQuestionIds.length, 3);
  });

  test("deserializeProgress handles extreme JSON corruption scenarios without throwing", () => {
    const corruptPayloads = [
      null,
      undefined,
      "",
      "   ",
      "{",
      '{"summary": "not an object"}',
      '{"completedQuestionIds": "not an array"}',
      "12345",
      "true",
      "<html>500 Internal Server Error</html>",
    ];

    for (const payload of corruptPayloads) {
      const restored = deserializeProgress(payload);
      assert.ok(restored, `Payload ${JSON.stringify(payload)} must produce valid record`);
      assert.equal(typeof restored.summary.totalAttempted, "number");
      assert.ok(Array.isArray(restored.completedQuestionIds));
      assert.ok(restored.byLesson[1]?.grammar);
    }
  });

  // ============================================================================
  // SUITE 6: Live 1,007 Questions Exhaustive Evaluation
  // ============================================================================
  console.log("\n🔍 SUITE 6: Live Exam Question Bank Exhaustive Evaluation (1,007 Questions)");

  let liveQuestionsChecked = 0;
  let liveCorrectMatches = 0;
  let liveExplanationChecks = 0;

  for (const l of [1, 2, 3]) {
    for (const s of ALL_SKILLS) {
      const batch = getTamrin20SkillBatch(l, s);
      for (const q of batch.questions) {
        liveQuestionsChecked++;

        // 1. Exact correct answer must evaluate to true
        const evalCorrect = evaluateAnswer(q, q.correctAnswer);
        if (evalCorrect.isCorrect) {
          liveCorrectMatches++;
        } else {
          assert.fail(`Question ${q.id} (${q.questionType}) failed evaluation with its own correctAnswer: ${JSON.stringify(q.correctAnswer)}`);
        }

        // 2. Explanation check: every question must have detailedFa >= 15 chars
        if (q.explanation?.detailedFa && q.explanation.detailedFa.trim().length >= 15) {
          liveExplanationChecks++;
        } else {
          assert.fail(`Question ${q.id} has insufficient explanation: ${JSON.stringify(q.explanation)}`);
        }
      }
    }
  }

  test(`all ${liveQuestionsChecked} live questions pass evaluation with their exact correctAnswer`, () => {
    assert.equal(liveCorrectMatches, liveQuestionsChecked);
  });

  test(`all ${liveQuestionsChecked} live questions have verified high-quality detailed explanations`, () => {
    assert.equal(liveExplanationChecks, liveQuestionsChecked);
  });

  // ============================================================================
  // RESULTS & VERDICT
  // ============================================================================
  console.log("\n======================================================================");
  console.log("📊 STRESS TEST SUMMARY:");
  console.log(`- Total Tests Run:   ${totalTests}`);
  console.log(`- Total Passed:      ${totalPassed}`);
  console.log(`- Total Failed:      ${totalFailed}`);
  console.log("======================================================================\n");

  if (totalFailed > 0) {
    console.error(`❌ STRESS TEST SUITE FAILED WITH ${totalFailed} ANOMALIES.`);
    process.exit(1);
  } else {
    console.log("🎉 ALL ADVERSARIAL STRESS TESTS PASSED WITH 0 FAILURES!");
    process.exit(0);
  }
}

runAllSuites().catch((err) => {
  console.error("Unhandled rejection in test runner:", err);
  process.exit(1);
});
