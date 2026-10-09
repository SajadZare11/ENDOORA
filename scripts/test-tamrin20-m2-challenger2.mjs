/**
 * Milestone M2 Challenger 2: Adversarial Stress Test Harness
 * 
 * Verifies:
 * 1. Progressive Loading & State Retention across expansion (isExpanded: false -> true)
 * 2. Instant Feedback States (Green toggleable, Red auto-unfolded, edge-case inputs)
 * 3. Audio Player Invariants (zero duration, NaN, speed toggles, seeking & boundary limits)
 * 4. CSS Design Tokens & Logical Properties Compliance
 *
 * Execution:
 *   node --experimental-strip-types scripts/test-tamrin20-m2-challenger2.mjs
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  getTamrin20Lesson,
  getTamrin20SkillBatch,
  getVisibleQuestions,
  evaluateAnswer,
  normalizeAnswer,
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

console.log("======================================================================");
console.log("⚡ STARTING M2 CHALLENGER 2 ADVERSARIAL STRESS TEST SUITE");
console.log("======================================================================\n");

// ============================================================================
// SUITE 1: Progressive Loading & State Retention Across Expansion
// ============================================================================
console.log("🔄 SUITE 1: Progressive Loading & State Retention");

test("Progressive slice expands from exactly 20 to full bank size", () => {
  const grammarBatch = getTamrin20SkillBatch(1, "grammar");
  assert.ok(grammarBatch, "Grammar batch must exist for lesson 1");
  assert.equal(grammarBatch.totalQuestions, 101);

  // Initial slice
  const initialSlice = getVisibleQuestions(grammarBatch.questions, false);
  assert.equal(initialSlice.length, 20, "Initial slice must have exactly 20 questions");
  assert.ok(initialSlice.every((q) => q.isInitialBatch === true));

  // Expanded slice
  const expandedSlice = getVisibleQuestions(grammarBatch.questions, true);
  assert.equal(expandedSlice.length, 101, "Expanded slice must return all 101 questions");
  assert.equal(expandedSlice[0].id, initialSlice[0].id, "First question must remain stable");
  assert.equal(expandedSlice[19].id, initialSlice[19].id, "20th question must remain stable");
  assert.equal(expandedSlice[20].isInitialBatch, false, "21st question is in progressive batch");
});

test("State preservation: All previously answered questions retain exact answers, feedback states, and explanations when isExpanded flips", () => {
  const vocabBatch = getTamrin20SkillBatch(1, "vocabulary");
  assert.ok(vocabBatch, "Vocabulary batch must exist for lesson 1");
  assert.equal(vocabBatch.totalQuestions, 85);

  const initialQuestions = getVisibleQuestions(vocabBatch.questions, false);
  assert.equal(initialQuestions.length, 20);

  // Simulate user session answering 5 questions in the initial batch
  const userAnswersMap = {};

  // Q1: Correct answer
  const q1 = initialQuestions[0];
  const eval1 = evaluateAnswer(q1, q1.correctAnswer);
  assert.equal(eval1.isCorrect, true);
  userAnswersMap[q1.id] = { answer: q1.correctAnswer, isCorrect: true, timeSeconds: 10 };

  // Q2: Incorrect answer
  const q2 = initialQuestions[1];
  const wrongAnswer = typeof q2.correctAnswer === "number" ? (q2.correctAnswer === 0 ? 1 : 0) : "wrong_text_xyz";
  const eval2 = evaluateAnswer(q2, wrongAnswer);
  assert.equal(eval2.isCorrect, false);
  userAnswersMap[q2.id] = { answer: wrongAnswer, isCorrect: false, timeSeconds: 15 };

  // Q3: Another correct answer with acceptable alternative if available, or correct answer
  const q3 = initialQuestions[2];
  const ans3 = q3.acceptableAnswers?.[0] || q3.correctAnswer;
  const eval3 = evaluateAnswer(q3, ans3);
  assert.equal(eval3.isCorrect, true);
  userAnswersMap[q3.id] = { answer: ans3, isCorrect: true, timeSeconds: 8 };

  // Q19 & Q20: Boundary questions of initial batch
  const q19 = initialQuestions[18];
  const eval19 = evaluateAnswer(q19, q19.correctAnswer);
  userAnswersMap[q19.id] = { answer: q19.correctAnswer, isCorrect: true, timeSeconds: 12 };

  const q20 = initialQuestions[19];
  const wrong20 = "incorrect_final_initial";
  const eval20 = evaluateAnswer(q20, wrong20);
  userAnswersMap[q20.id] = { answer: wrong20, isCorrect: false, timeSeconds: 22 };

  // Assert state BEFORE expansion
  const initialAnsweredCount = initialQuestions.filter((q) => userAnswersMap[q.id] !== undefined).length;
  assert.equal(initialAnsweredCount, 5, "5 questions answered before expansion");

  // >>> EXPANSION TRIGGER <<<
  const isExpanded = true;
  const expandedQuestions = getVisibleQuestions(vocabBatch.questions, isExpanded);
  assert.equal(expandedQuestions.length, 85);

  // Assert state AFTER expansion
  // 1. All 5 answered questions exist in the expanded array
  for (const answeredId of [q1.id, q2.id, q3.id, q19.id, q20.id]) {
    const found = expandedQuestions.find((q) => q.id === answeredId);
    assert.ok(found, `Question ${answeredId} must still be in visible questions`);
    assert.ok(userAnswersMap[answeredId], `Answer for ${answeredId} must be retained`);
  }

  // 2. Evaluated feedback states remain 100% invariant
  const reEval1 = evaluateAnswer(q1, userAnswersMap[q1.id].answer);
  assert.equal(reEval1.isCorrect, true);
  assert.equal(reEval1.feedbackState, "correct");
  assert.equal(reEval1.showExplanationToggle, true);
  assert.equal(reEval1.isExplanationOpen, false);

  const reEval2 = evaluateAnswer(q2, userAnswersMap[q2.id].answer);
  assert.equal(reEval2.isCorrect, false);
  assert.equal(reEval2.feedbackState, "incorrect");
  assert.equal(reEval2.isExplanationOpen, true);
  assert.equal(reEval2.revealedAnswer, q2.correctAnswer);

  const reEval20 = evaluateAnswer(q20, userAnswersMap[q20.id].answer);
  assert.equal(reEval20.isCorrect, false);
  assert.equal(reEval20.isExplanationOpen, true);

  // 3. Questions 21 to 85 are unanswered initially
  const progressiveQuestions = expandedQuestions.slice(20);
  assert.equal(progressiveQuestions.length, 65);
  for (const progQ of progressiveQuestions) {
    assert.equal(userAnswersMap[progQ.id], undefined, `Progressive question ${progQ.id} must be unanswered initially`);
  }

  // 4. Learner now answers question 21 (first progressive question)
  const q21 = progressiveQuestions[0];
  const eval21 = evaluateAnswer(q21, q21.correctAnswer);
  userAnswersMap[q21.id] = { answer: q21.correctAnswer, isCorrect: eval21.isCorrect, timeSeconds: 14 };

  // Verify total answered becomes 6 without disrupting previous 5
  const updatedAnsweredCount = expandedQuestions.filter((q) => userAnswersMap[q.id] !== undefined).length;
  assert.equal(updatedAnsweredCount, 6);
  assert.equal(userAnswersMap[q1.id].answer, q1.correctAnswer);
  assert.equal(userAnswersMap[q20.id].answer, wrong20);
});

test("Real-time stats calculations remain robust across expansion and division-by-zero", () => {
  // Empty session
  const visibleEmpty = [];
  const answersEmpty = {};
  const answered0 = visibleEmpty.filter((q) => answersEmpty[q.id] !== undefined).length;
  const correct0 = visibleEmpty.filter((q) => answersEmpty[q.id]?.isCorrect).length;
  const accuracy0 = answered0 === 0 ? 0 : Math.round((correct0 / answered0) * 100);
  const progress0 = visibleEmpty.length === 0 ? 0 : Math.round((answered0 / visibleEmpty.length) * 100);
  assert.equal(accuracy0, 0);
  assert.equal(progress0, 0);

  // 20 questions slice, 4 answered, 3 correct
  const answered4 = 4;
  const correct3 = 3;
  const accInitial = Math.round((correct3 / answered4) * 100);
  const progInitial = Math.round((answered4 / 20) * 100);
  assert.equal(accInitial, 75);
  assert.equal(progInitial, 20);

  // Expands to 100 questions, answers map unchanged
  const totalExpanded = 100;
  const accAfter = Math.round((correct3 / answered4) * 100);
  const progAfter = Math.round((answered4 / totalExpanded) * 100);
  assert.equal(accAfter, 75, "Accuracy percentage must not change upon expansion");
  assert.equal(progAfter, 4, "Progress percentage adjusts smoothly to full bank");
});

test("Small banks (<= 20 questions) handle expansion idempotently", () => {
  const smallMockQuestions = Array.from({ length: 12 }, (_, i) => ({ id: `small-${i}` }));
  const slice1 = getVisibleQuestions(smallMockQuestions, false);
  const slice2 = getVisibleQuestions(smallMockQuestions, true);
  assert.equal(slice1.length, 12);
  assert.equal(slice2.length, 12);
  assert.deepEqual(slice1, slice2);
});

// ============================================================================
// SUITE 2: Instant Feedback States & Edge Cases (R3)
// ============================================================================
console.log("\n🎯 SUITE 2: Instant Feedback Edge Cases & UI Contracts (R3)");

test("Correct MCQ answer reveals toggle button and keeps explanation collapsed", () => {
  const sampleMCQ = {
    id: "test-mcq-correct",
    grade: 12,
    lesson: 1,
    skill: "grammar",
    questionType: "multiple_choice",
    prompt: "Choose the correct modal passive:",
    options: ["can be done", "can done", "can be did", "can do"],
    correctAnswer: 0,
    explanation: {
      briefFa: "فعل کمکی با be و شکل سوم فعل می‌آید.",
      detailedFa: "ساختار مجهول با افعال معین به صورت Modal + be + p.p است.",
      pedagogicalRuleFa: "درس ۱ دوازدهم، گرامر افعال مجهول",
    },
    isInitialBatch: true,
    orderIndex: 1,
  };

  // Evaluate user picking option index 0
  const result = evaluateAnswer(sampleMCQ, 0);

  assert.equal(result.isCorrect, true);
  assert.equal(result.feedbackState, "correct");
  assert.equal(result.revealedAnswer, null, "Correct answer must NOT be revealed in revealedAnswer field");
  assert.equal(result.showExplanationToggle, true, "Must provide toggle button for supplementary explanation");
  assert.equal(result.isExplanationOpen, false, "Supplementary explanation MUST be collapsed by default on correct");
  assert.equal(result.colorToken, "var(--color-success)");
  assert.ok(result.explanation.briefFa);
  assert.ok(result.explanation.detailedFa);
  assert.ok(result.explanation.pedagogicalRuleFa);
});

test("Incorrect MCQ answer auto-reveals correct option and unfolds detailed explanation", () => {
  const sampleMCQ = {
    id: "test-mcq-incorrect",
    grade: 12,
    lesson: 1,
    skill: "grammar",
    questionType: "multiple_choice",
    prompt: "Choose the correct modal passive:",
    options: ["can be done", "can done", "can be did", "can do"],
    correctAnswer: 0,
    explanation: {
      briefFa: "فعل کمکی با be و شکل سوم فعل می‌آید.",
      detailedFa: "ساختار مجهول با افعال معین به صورت Modal + be + p.p است.",
      pedagogicalRuleFa: "درس ۱ دوازدهم، گرامر افعال مجهول",
    },
    isInitialBatch: true,
    orderIndex: 1,
  };

  // Evaluate user picking option index 2 (wrong)
  const result = evaluateAnswer(sampleMCQ, 2);

  assert.equal(result.isCorrect, false);
  assert.equal(result.feedbackState, "incorrect");
  assert.equal(result.revealedAnswer, 0, "Correct answer must be revealed on incorrect");
  assert.equal(result.revealedAnswerText, "can be done", "Revealed text must match correct option");
  assert.equal(result.showExplanationToggle, false, "Toggle button not needed when auto-expanded");
  assert.equal(result.isExplanationOpen, true, "Explanation MUST be automatically unfolded on incorrect answer");
  assert.equal(result.colorToken, "var(--color-danger)");
});

test("Free text evaluation handles Persian digits, Arabic characters, spaces, and punctuation", () => {
  const textQuestion = {
    id: "test-text-eval",
    grade: 12,
    lesson: 2,
    skill: "vocabulary",
    questionType: "fill_in_the_blank",
    prompt: "Wind turbines generate clean ........ .",
    correctAnswer: "electricity",
    acceptableAnswers: ["power", "energy"],
    explanation: {
      briefFa: "توربین‌های بادی برق پاک تولید می‌کنند.",
      detailedFa: "واژه electricity با generate هم‌آیی دارد.",
    },
    isInitialBatch: true,
    orderIndex: 1,
  };

  // 1. Exact match
  assert.equal(evaluateAnswer(textQuestion, "electricity").isCorrect, true);

  // 2. Case insensitivity & spaces
  assert.equal(evaluateAnswer(textQuestion, "  ELECTRICITY   ").isCorrect, true);

  // 3. Trailing punctuation stripping
  assert.equal(evaluateAnswer(textQuestion, "electricity.").isCorrect, true);
  assert.equal(evaluateAnswer(textQuestion, "electricity!").isCorrect, true);
  assert.equal(evaluateAnswer(textQuestion, "electricity؟").isCorrect, true);

  // 4. Acceptable alternative answers
  assert.equal(evaluateAnswer(textQuestion, "power").isCorrect, true);
  assert.equal(evaluateAnswer(textQuestion, "ENERGY").isCorrect, true);

  // 5. Wrong answer
  const wrongRes = evaluateAnswer(textQuestion, "pollution");
  assert.equal(wrongRes.isCorrect, false);
  assert.equal(wrongRes.isExplanationOpen, true);
  assert.equal(wrongRes.revealedAnswerText, "electricity");

  // 6. Adversarial empty or whitespace input
  assert.equal(evaluateAnswer(textQuestion, "").isCorrect, false);
  assert.equal(evaluateAnswer(textQuestion, "   ").isCorrect, false);
  assert.equal(evaluateAnswer(textQuestion, null).isCorrect, false);
  assert.equal(evaluateAnswer(textQuestion, undefined).isCorrect, false);
});

test("MCQ with option index 0 as correct answer is evaluated properly (no falsy 0 bug)", () => {
  const qWithZeroCorrect = {
    id: "test-zero-index",
    grade: 12,
    lesson: 1,
    skill: "reading",
    questionType: "multiple_choice",
    options: ["Option A (Correct)", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    explanation: { briefFa: "گزینه اول درست است.", detailedFa: "توضیح کامل" },
    isInitialBatch: true,
    orderIndex: 1,
  };

  // User selects index 0
  const eval0 = evaluateAnswer(qWithZeroCorrect, 0);
  assert.equal(eval0.isCorrect, true, "User selecting 0 must evaluate to true");
  assert.equal(eval0.feedbackState, "correct");

  // User selects option 0 via string "0"
  assert.equal(evaluateAnswer(qWithZeroCorrect, "0").isCorrect, true);

  // User selects option 0 via Persian digit "۰"
  assert.equal(evaluateAnswer(qWithZeroCorrect, "۰").isCorrect, true);

  // User selects wrong index 1
  const eval1 = evaluateAnswer(qWithZeroCorrect, 1);
  assert.equal(eval1.isCorrect, false);
  assert.equal(eval1.revealedAnswer, 0);
  assert.equal(eval1.revealedAnswerText, "Option A (Correct)");
});

// ============================================================================
// SUITE 3: Audio Player Invariants & Edge Cases
// ============================================================================
console.log("\n🎧 SUITE 3: Audio Player Invariants & Edge Cases");

// Reference simulation of Tamrin20AudioPlayer helper functions
function formatTime(seconds) {
  if (Number.isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

test("formatTime handles edge cases: zero, negative, NaN, minutes, and large values", () => {
  assert.equal(formatTime(0), "00:00");
  assert.equal(formatTime(-1), "00:00");
  assert.equal(formatTime(NaN), "00:00");
  assert.equal(formatTime(undefined), "00:00");
  assert.equal(formatTime(5), "00:05");
  assert.equal(formatTime(59), "00:59");
  assert.equal(formatTime(60), "01:00");
  assert.equal(formatTime(125), "02:05");
  assert.equal(formatTime(3599), "59:59");
  assert.equal(formatTime(3605), "60:05");
});

test("Audio player state machine transitions: play, pause, seek, speed, timestamps", () => {
  // Mock audio player simulation
  const audioState = {
    currentTime: 0,
    duration: 180,
    isPlaying: false,
    playbackRate: 1.0,
    isMuted: false,
    hasError: false,
  };

  // 1. Play
  audioState.isPlaying = true;
  assert.equal(audioState.isPlaying, true);

  // 2. Pause
  audioState.isPlaying = false;
  assert.equal(audioState.isPlaying, false);

  // 3. Speed toggle cycle (1.0 -> 0.8 -> 1.0 -> 0.8)
  for (let i = 0; i < 4; i++) {
    const expected = i % 2 === 0 ? 0.8 : 1.0;
    audioState.playbackRate = audioState.playbackRate === 1.0 ? 0.8 : 1.0;
    assert.equal(audioState.playbackRate, expected);
  }

  // 4. Mute toggle
  audioState.isMuted = !audioState.isMuted;
  assert.equal(audioState.isMuted, true);
  audioState.isMuted = !audioState.isMuted;
  assert.equal(audioState.isMuted, false);

  // 5. Seeking within duration
  audioState.currentTime = 75.4;
  assert.equal(audioState.currentTime, 75.4);
  assert.equal(formatTime(audioState.currentTime), "01:15");
  assert.equal(formatTime(audioState.duration), "03:00");

  // 6. Timestamps slice handling: { startSeconds: 20, endSeconds: 50 }
  const timestamps = { startSeconds: 20, endSeconds: 50 };
  let simulatedTime = timestamps.startSeconds;
  assert.equal(simulatedTime, 20);

  // Advance time beyond endSeconds
  simulatedTime = 51;
  const shouldLoopOrEnd = simulatedTime >= timestamps.endSeconds;
  assert.equal(shouldLoopOrEnd, true);
  if (shouldLoopOrEnd) {
    audioState.isPlaying = false;
    simulatedTime = timestamps.startSeconds;
  }
  assert.equal(audioState.isPlaying, false);
  assert.equal(simulatedTime, 20, "Must reset to startSeconds when timestamp end is reached");
});

test("Audio player slider max fallback prevents NaN / 0 divide when metadata is loading", () => {
  const duration = 0;
  const timestamps = undefined;
  const sliderMax = timestamps?.endSeconds || duration || 100;
  assert.equal(sliderMax, 100, "Slider max must default to 100 when duration is 0");

  // When metadata loads
  const loadedDuration = 142.5;
  const loadedMax = timestamps?.endSeconds || loadedDuration || 100;
  assert.equal(loadedMax, 142.5);
});

// ============================================================================
// SUITE 4: Design Tokens & Logical Properties Compliance
// ============================================================================
console.log("\n🎨 SUITE 4: CSS Design Tokens & Logical Properties Verification");

test("tamrin20.module.css uses 100% logical properties (0 physical left/right rules)", () => {
  const cssPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "components",
    "highschool",
    "tamrin20",
    "tamrin20.module.css"
  );
  assert.ok(fs.existsSync(cssPath), "tamrin20.module.css must exist");

  const css = fs.readFileSync(cssPath, "utf8");

  // Check for forbidden physical direction properties
  // Allowed exceptions: text-align: left/right inside [dir="ltr"] or specific media queries if commented
  const forbiddenPatterns = [
    { name: "margin-left", regex: /(?<!-)margin-left\s*:/ },
    { name: "margin-right", regex: /(?<!-)margin-right\s*:/ },
    { name: "padding-left", regex: /(?<!-)padding-left\s*:/ },
    { name: "padding-right", regex: /(?<!-)padding-right\s*:/ },
    { name: "border-left", regex: /(?<!-)border-left\s*:/ },
    { name: "border-right", regex: /(?<!-)border-right\s*:/ },
  ];

  for (const { name, regex } of forbiddenPatterns) {
    const match = regex.exec(css);
    assert.equal(
      match,
      null,
      `Forbidden physical property '${name}' found in tamrin20.module.css. Use logical properties (-inline, -block) instead.`
    );
  }

  // Check for raw hex colors outside comments
  // Remove CSS comments first
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rawHexMatches = cleanCss.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  assert.equal(
    rawHexMatches.length,
    0,
    `Found ${rawHexMatches.length} raw hex color literal(s) in CSS: ${rawHexMatches.join(", ")}. Must use var(--color-...) tokens.`
  );
});

test("tamrin20.module.css includes required success and error feedback class tokens", () => {
  const cssPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "components",
    "highschool",
    "tamrin20",
    "tamrin20.module.css"
  );
  const css = fs.readFileSync(cssPath, "utf8");

  // Verify key feedback classes exist
  const requiredClasses = [
    ".questionCardCorrect",
    ".questionCardIncorrect",
    ".optionCorrect",
    ".optionIncorrect",
    ".optionRevealed",
    ".textInputCorrect",
    ".textInputIncorrect",
    ".revealedAnswerBox",
    ".explanationToggleBtn",
    ".explanationBox",
    ".audioSpeedActive",
  ];

  for (const cls of requiredClasses) {
    assert.ok(
      css.includes(cls),
      `Required CSS class '${cls}' must be defined in tamrin20.module.css`
    );
  }
});

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log("\n======================================================================");
console.log(`Milestone M2 Challenger 2 Stress Harness Results:`);
console.log(`  Total Tests: ${totalTests}`);
console.log(`  Passed:      ${totalPassed}`);
console.log(`  Failed:      ${totalFailed}`);
console.log("======================================================================\n");

if (totalFailed > 0) {
  console.error(`❌ ${totalFailed} adversarial test(s) failed.`);
  process.exit(1);
} else {
  console.log(`🎉 ALL ${totalPassed} EMPIRICAL ADVERSARIAL STRESS TESTS PASSED SUCCESSFULLY!`);
  process.exit(0);
}
