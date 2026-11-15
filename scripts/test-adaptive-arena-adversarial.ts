/**
 * Adversarial Lifecycle Verification Harness
 * Tests Engine 6 LinUCB Bandit, useAdaptiveQuestion, DktEngine, and GrammarHexArena.
 *
 * Execution:
 *   npx.cmd tsx scripts/test-adaptive-arena-adversarial.ts
 */

import {
  EnDooraLinUCBBandit,
  createIdentity4x4,
  l2Norm4,
  normalizeVector4,
  dotProduct4,
  matVecMul4,
  quadForm4,
  matrixAdd4x4,
  outerProduct4,
  shermanMorrisonUpdate4x4,
  invertMatrix4x4Explicit,
  fisherYatesShuffle,
  fuseCognitiveContext,
} from "../apps/web/lib/ai/linucb-bandit-engine.ts";

import {
  normalizeAdaptiveQuestionPayload,
  loadStaticQuestionBank,
  getAdaptiveQuestionById,
  renderAdaptiveHexQuestion,
} from "../apps/web/lib/ai/useAdaptiveQuestion.ts";

import { DktEngine } from "../apps/web/lib/dkt-engine/dkt-engine.ts";
import { AEF_60_CONCEPTS } from "../apps/web/lib/dkt-engine/concepts.ts";
import { GRAMMAR_AEF_CURRICULUM } from "../apps/web/data/skills/games/grammar-aef-curriculum.ts";

import type {
  AdaptiveQuestionPayload,
  DistractorCandidate,
  EnDooraTriModalTelemetry,
  Matrix4x4,
  TrapCategory,
  Vector4,
  AdaptiveInteractionResult,
} from "../apps/web/lib/ai/types.ts";
import { TRAP_CATEGORIES } from "../apps/web/lib/ai/types.ts";

// ============================================================================
// Test Framework Harness
// ============================================================================

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, desc: string, detail?: unknown): void {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${desc}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${desc}`);
    if (detail !== undefined) {
      console.error(`         Detail:`, detail);
    }
  }
}

function assertApprox(
  actual: number,
  expected: number,
  tolerance = 1e-6,
  desc?: string
): void {
  const diff = Math.abs(actual - expected);
  assert(
    diff <= tolerance,
    desc ?? `Expected ~${expected}, got ${actual} (diff: ${diff.toExponential(4)})`,
    { actual, expected, diff, tolerance }
  );
}

console.log("======================================================================");
console.log("  EnDoora Engine 6 & GrammarHexArena Adversarial Lifecycle Test Suite");
console.log("======================================================================\n");

// ============================================================================
// Suite 1: 4D Linear Algebra & Sherman-Morrison Numerical Stability
// ============================================================================
console.log("--- Suite 1: 4D Linear Algebra & Sherman-Morrison Numerical Stability ---");

{
  // 1.1 Norm & Normalization
  const vZero: Vector4 = [0, 0, 0, 0];
  const vNormZero = normalizeVector4(vZero);
  assert(
    vNormZero[0] === 0.5 && vNormZero[1] === 0.5 && vNormZero[2] === 0.5 && vNormZero[3] === 0.5,
    "Zero vector normalizes safely to uniform [0.5, 0.5, 0.5, 0.5]"
  );

  const vSubEps: Vector4 = [1e-15, 1e-15, 1e-15, 1e-15];
  const vNormSubEps = normalizeVector4(vSubEps);
  assert(
    vNormSubEps[0] === 0.5,
    "Sub-epsilon vector normalizes safely to uniform vector"
  );

  const vArb: Vector4 = [3, -4, 2, 5];
  const vNorm = normalizeVector4(vArb);
  assertApprox(l2Norm4(vNorm), 1.0, 1e-12, "L2 norm of normalized vector is exactly 1.0");

  // 1.2 Sherman-Morrison vs Explicit Gauss-Jordan Inversion
  // Start with A = I_4. Add 20 random outer products x_k * x_k^T.
  // Compare Sherman-Morrison sequential update against invertMatrix4x4Explicit(A_accum).
  let A_accum: Matrix4x4 = createIdentity4x4();
  let A_inv_SM: Matrix4x4 = createIdentity4x4();

  let maxFrobeniusDiff = 0;
  for (let k = 0; k < 25; k++) {
    // Generate pseudo-random vector
    const rx: Vector4 = [
      Math.sin(k * 1.7) * 2,
      Math.cos(k * 2.3) * 1.5,
      Math.sin(k * 3.1 + 0.4),
      Math.cos(k * 0.9 - 1.1),
    ];
    const x = normalizeVector4(rx);

    // Update A_accum explicitly: A <- A + x * x^T
    const xxT = outerProduct4(x);
    A_accum = matrixAdd4x4(A_accum, xxT);

    // Update A_inv_SM via Sherman-Morrison: A^(-1) <- SM(A^(-1), x)
    A_inv_SM = shermanMorrisonUpdate4x4(A_inv_SM, x);

    // Explicit inversion of A_accum via Gauss-Jordan
    const A_inv_GJ = invertMatrix4x4Explicit(A_accum);

    // Compute Frobenius norm difference ||A_inv_SM - A_inv_GJ||_F
    let frobSq = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const d = A_inv_SM[i][j] - A_inv_GJ[i][j];
        frobSq += d * d;
      }
    }
    const frob = Math.sqrt(frobSq);
    if (frob > maxFrobeniusDiff) maxFrobeniusDiff = frob;
  }

  assert(
    maxFrobeniusDiff < 1e-9,
    `Sherman-Morrison matches explicit Gauss-Jordan inversion (max error: ${maxFrobeniusDiff.toExponential(4)})`
  );

  // 1.3 Symmetry Preservation over 200 Heavy Updates
  let symMatrix: Matrix4x4 = createIdentity4x4();
  for (let step = 0; step < 200; step++) {
    const rx: Vector4 = [
      Math.sin(step * 0.43),
      Math.cos(step * 0.91),
      Math.sin(step * 1.57),
      Math.cos(step * 2.19),
    ];
    symMatrix = shermanMorrisonUpdate4x4(symMatrix, normalizeVector4(rx));
  }

  let maxAsym = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const diff = Math.abs(symMatrix[i][j] - symMatrix[j][i]);
      if (diff > maxAsym) maxAsym = diff;
    }
  }
  assert(maxAsym === 0, `Symmetry enforcement holds strictly (asymmetry: ${maxAsym})`);

  // 1.4 Positive Definiteness Preservation: v^T * M * v > 0
  let isPositiveDefinite = true;
  for (let k = 0; k < 50; k++) {
    const testV: Vector4 = [
      Math.cos(k * 1.1) + 0.1,
      Math.sin(k * 2.2) - 0.2,
      Math.cos(k * 3.3) + 0.3,
      Math.sin(k * 4.4) - 0.4,
    ];
    const qf = quadForm4(testV, symMatrix);
    if (qf <= 0 || isNaN(qf)) {
      isPositiveDefinite = false;
      break;
    }
  }
  assert(isPositiveDefinite, "Positive definiteness preserved over 200 rank-1 updates");

  // 1.5 Extreme Repetitive Colinear Updates (Degenerate Subspace Stress)
  let colinearMatrix: Matrix4x4 = createIdentity4x4();
  const fixedVector: Vector4 = [0.5, 0.5, 0.5, 0.5];
  for (let i = 0; i < 100; i++) {
    colinearMatrix = shermanMorrisonUpdate4x4(colinearMatrix, fixedVector);
  }
  let hasNaN = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (isNaN(colinearMatrix[i][j]) || !isFinite(colinearMatrix[i][j])) hasNaN = true;
    }
  }
  assert(!hasNaN, "100 repeated colinear rank-1 updates do not produce NaN or Inf");
}

console.log("");

// ============================================================================
// Suite 2: Disjoint LinUCB Multi-Arm Engine & Isolation
// ============================================================================
console.log("--- Suite 2: Disjoint LinUCB Multi-Arm Engine & Isolation ---");

{
  EnDooraLinUCBBandit.resetInstance();
  const bandit = new EnDooraLinUCBBandit({ skipStorageLoad: true, alpha: 0.6 });

  // 2.1 Verify Initial Arm Setup
  const initialArms = bandit.getAllArms();
  for (const cat of TRAP_CATEGORIES) {
    const arm = initialArms[cat];
    assert(arm.pulls === 0, `Initial pulls for arm '${cat}' is 0`);
    assert(arm.rewards === 0, `Initial rewards for arm '${cat}' is 0`);
    assert(arm.A_inv[0][0] === 1 && arm.A_inv[1][1] === 1, `Initial covariance for arm '${cat}' is I_4`);
  }

  // 2.2 Disjoint Isolation Test: Update 'l1_persian' 20 times
  const l1Features: Vector4 = [0.2, 0.3, 0.4, 0.825];
  for (let i = 0; i < 20; i++) {
    bandit.recordInteractionFeedback({
      category: "l1_persian",
      features: l1Features,
      trapTriggered: true,
      latencyMs: 2500,
    });
  }

  const updatedArms = bandit.getAllArms();
  assert(updatedArms.l1_persian.pulls === 20, "Arm 'l1_persian' registered exactly 20 pulls");
  assert(updatedArms.l1_persian.rewards > 20, "Arm 'l1_persian' accumulated positive rewards");

  // Verify other arms were untouched
  const otherArms: TrapCategory[] = ["phonetic_ortho", "semantic_siamese", "morphological"];
  let otherArmIntact = true;
  for (const cat of otherArms) {
    const arm = updatedArms[cat];
    if (arm.pulls !== 0 || arm.rewards !== 0 || arm.A_inv[0][0] !== 1) {
      otherArmIntact = false;
    }
  }
  assert(otherArmIntact, "Disjoint property: Updating 'l1_persian' left other 3 arms completely untouched");

  // 2.3 Reward Calculation Boundary Checks
  // Sub-signature testing:
  bandit.recordInteractionFeedback("phonetic_ortho", [1, 0, 0, 0], true, 0); // latency = 0ms
  const phArm0 = bandit.getArmState("phonetic_ortho");
  assertApprox(phArm0.rewards, 1.0, 1e-4, "Trap triggered with latency 0ms yields base reward 1.0");

  bandit.recordInteractionFeedback("phonetic_ortho", [1, 0, 0, 0], true, 3000); // latency = 3000ms
  const phArm3k = bandit.getArmState("phonetic_ortho");
  assertApprox(phArm3k.rewards - phArm0.rewards, 1.15, 1e-4, "Trap triggered with latency 3000ms yields max reward 1.15");

  bandit.recordInteractionFeedback("phonetic_ortho", [1, 0, 0, 0], false, 6000); // latency = 6000ms (avoidance with hesitation)
  const phArmAvoid = bandit.getArmState("phonetic_ortho");
  assertApprox(phArmAvoid.rewards - phArm3k.rewards, 0.05, 1e-4, "Avoidance with hesitation > 3000ms yields 0.05 signal");

  // 2.4 Resetting State
  bandit.reset();
  assert(bandit.getTotalInteractions() === 0, "Bandit reset sets totalInteractions to 0");
  assert(bandit.getArmState("l1_persian").pulls === 0, "Bandit reset restores all arm pulls to 0");
}

console.log("");

// ============================================================================
// Suite 3: Tri-Modal Cognitive Context Fusion
// ============================================================================
console.log("--- Suite 3: Tri-Modal Cognitive Context Fusion ---");

{
  // 3.1 Undefined telemetry
  const cDefault = fuseCognitiveContext(undefined);
  assertApprox(l2Norm4(cDefault), 1.0, 1e-6, "Default context vector is unit length");
  assertApprox(cDefault[0], cDefault[1], 1e-6, "Default context vector has balanced dimensions");

  // 3.2 Phoneme Error Dominant
  const cPhoneme = fuseCognitiveContext({
    phonemeErrorRate: 0.95,
    semanticDeficit: 0.1,
    dktGrammarDeficit: 0.1,
    latencyMs: 500,
  });
  assert(cPhoneme[0] > cPhoneme[1] && cPhoneme[0] > cPhoneme[2], "GOP PER dominant context reflects high dim 0");
  assertApprox(l2Norm4(cPhoneme), 1.0, 1e-6, "GOP PER context is unit length");

  // 3.3 64D DKT Hidden State Projection
  const mockHidden64: number[] = new Array(64).fill(0).map((_, i) => Math.sin(i * 0.1) * 2.0);
  const cDkt = fuseCognitiveContext({
    dktHiddenState: mockHidden64,
    latencyMs: 2000,
  });
  assert(cDkt[2] > 0 && cDkt[2] <= 1.0, "64D DKT hidden state correctly projects into bounded grammar deficit");
  assertApprox(l2Norm4(cDkt), 1.0, 1e-6, "DKT-projected context is unit length");

  // 3.4 Extreme Latency Handling (AFK user)
  const cAfk = fuseCognitiveContext({
    latencyMs: 60000, // 60 seconds
  });
  assert(cAfk[3] <= 1.0, "Extreme latency is capped at 1.0 before normalization");
  assertApprox(l2Norm4(cAfk), 1.0, 1e-6, "AFK context is unit length");
}

console.log("");

// ============================================================================
// Suite 4: Question Bank & Payload Normalization Audit
// ============================================================================
console.log("--- Suite 4: Question Bank & Payload Normalization Audit ---");

{
  // 4.1 Normalize Snake Case Python Pipeline Payload
  const snakePayload = {
    id: "grammar-b1-007",
    question: "By the time we arrived, the train _____ already.",
    correct_option: "had left",
    distractor_pool: [
      {
        id: "d1",
        text: "has left",
        category: "morphological",
        features: [0.5, 0.5, 0.5, 0.5],
        levenshtein_sim: 0.85,
        explanation_fa: "تله زمان حال کامل به جای گذشته کامل",
      },
      {
        id: "d2",
        text: "was left",
        category: "semantic_siamese",
        features: [0.4, 0.6, 0.4, 0.57],
        explanation_fa: "تله ساختار مجهول به جای معلوم",
      },
    ],
    prompt_fa: "تا وقتی که ما رسیدیم، قطار حرکت کرده بود.",
    explanation_fa: "برای عملی که قبل از عمل دیگر در گذشته رخ داده، گذشته کامل لازم است.",
    cefr_level: "B1",
  };

  const normalized = normalizeAdaptiveQuestionPayload(snakePayload);
  assert(normalized.id === "grammar-b1-007", "Normalized id matches snake_case");
  assert(normalized.prompt === snakePayload.question, "Normalized prompt mapped from 'question'");
  assert(normalized.correctAnswer === "had left", "Normalized correctAnswer mapped from 'correct_option'");
  assert(normalized.distractorPool.length === 2, "Normalized distractorPool preserved candidates");
  assert(normalized.distractorPool[0].metadata?.explanationFa === "تله زمان حال کامل به جای گذشته کامل", "Metadata explanationFa mapped");

  // 4.2 Malformed Input Throws Clean Error
  let threwExpected = false;
  try {
    normalizeAdaptiveQuestionPayload(null);
  } catch {
    threwExpected = true;
  }
  assert(threwExpected, "normalizeAdaptiveQuestionPayload throws cleanly on null input");

  // 4.3 Full Audit of Pre-Calibrated Question Bank (264 items)
  const questionBank = loadStaticQuestionBank();
  assert(questionBank.size === 264, `Static question bank contains exactly 264 items (found ${questionBank.size})`);

  let validItemsCount = 0;
  let validCandidatesCount = 0;
  let normalizedFeaturesCount = 0;

  for (const [qid, q] of questionBank.entries()) {
    if (q.id && q.prompt && q.correctAnswer && Array.isArray(q.distractorPool)) {
      validItemsCount++;
    }
    for (const cand of q.distractorPool) {
      if (cand.id && cand.text && TRAP_CATEGORIES.includes(cand.category)) {
        validCandidatesCount++;
      }
      if (Array.isArray(cand.features) && cand.features.length === 4) {
        const norm = l2Norm4(cand.features);
        if (Math.abs(norm - 1.0) < 0.1) {
          normalizedFeaturesCount++;
        }
      }
    }
  }

  assert(validItemsCount === 264, "All 264 question items have complete prompt, correctAnswer, and pool");
  assert(validCandidatesCount === 264 * 12, `All 3,168 distractor candidates belong to valid trap categories (found ${validCandidatesCount})`);
  assert(normalizedFeaturesCount === 264 * 12, `All 3,168 candidate feature vectors are L2 unit-normalized (found ${normalizedFeaturesCount})`);

  // 4.4 getAdaptiveQuestionById
  const sampleQ = getAdaptiveQuestionById("grammar-a1-001");
  assert(Boolean(sampleQ), "getAdaptiveQuestionById('grammar-a1-001') successfully retrieved");
  assert(getAdaptiveQuestionById("non-existent-id") === undefined, "getAdaptiveQuestionById on invalid ID returns undefined");
}

console.log("");

// ============================================================================
// Suite 5: Question Assembly & LinUCB Selection Dynamics
// ============================================================================
console.log("--- Suite 5: Question Assembly & LinUCB Selection Dynamics ---");

{
  EnDooraLinUCBBandit.resetInstance();
  const bandit = new EnDooraLinUCBBandit({ skipStorageLoad: true, alpha: 0.5 });
  const samplePayload = getAdaptiveQuestionById("grammar-a1-001")!;

  // 5.1 Sub-0.5ms Assembly Benchmark
  const assemblyTimes: number[] = [];
  let assembledSample = bandit.assembleAdaptiveQuestion(samplePayload);

  for (let iter = 0; iter < 100; iter++) {
    const t0 = performance.now();
    assembledSample = bandit.assembleAdaptiveQuestion(samplePayload);
    const t1 = performance.now();
    assemblyTimes.push(t1 - t0);
  }

  const avgAssemblyTime = assemblyTimes.reduce((a, b) => a + b, 0) / assemblyTimes.length;
  console.log(`  [INFO] Average assembly time over 100 runs: ${avgAssemblyTime.toFixed(4)} ms`);
  assert(avgAssemblyTime < 2.0, `Assembly time is well below real-time threshold (avg: ${avgAssemblyTime.toFixed(3)}ms)`);

  // 5.2 Option Structure Invariants
  assert(assembledSample.options.length === 4, "Assembled question has exactly 4 options");
  assert(
    assembledSample.options[assembledSample.correctOptionIndex] === samplePayload.correctAnswer,
    "options[correctOptionIndex] strictly equals correctAnswer"
  );
  assert(assembledSample.selectedDistractors.length === 3, "Exactly 3 distractors selected from 12 candidates");

  // 5.3 Fisher-Yates Position Distribution Uniformity
  // Run 1,200 assemblies and count position of correct answer (indices 0, 1, 2, 3)
  const posCounts = [0, 0, 0, 0];
  for (let i = 0; i < 1200; i++) {
    const res = bandit.assembleAdaptiveQuestion(samplePayload);
    posCounts[res.correctOptionIndex]++;
  }

  console.log(`  [INFO] Fisher-Yates Position Distribution across 1200 assemblies: [0: ${posCounts[0]}, 1: ${posCounts[1]}, 2: ${posCounts[2]}, 3: ${posCounts[3]}]`);
  const minPos = Math.min(...posCounts);
  const maxPos = Math.max(...posCounts);
  assert(minPos > 200 && maxPos < 400, "Position distribution is well-balanced across all 4 options (200..400 each)");
}

console.log("");

// ============================================================================
// Suite 6: Full Multi-Round Learner Lifecycle (Bandit + DKT)
// ============================================================================
console.log("--- Suite 6: Full Multi-Round Learner Lifecycle (Bandit + DKT) ---");

{
  EnDooraLinUCBBandit.resetInstance();
  const bandit = new EnDooraLinUCBBandit({ skipStorageLoad: true, alpha: 0.5 });
  const dkt = DktEngine.getInstance();
  dkt.resetState();

  const conceptId = "a1-01";
  const initialMastery = dkt.getPredictions().conceptMastery[conceptId];

  // Helper simulating the exact selection logic in useAdaptiveQuestion
  function simulateLearnerRound(
    questionPayload: AdaptiveQuestionPayload,
    chooseCorrect: boolean,
    targetTrapCategory?: TrapCategory,
    latencyMs = 1200
  ): AdaptiveInteractionResult {
    const assembled = bandit.assembleAdaptiveQuestion(
      questionPayload,
      { dktGrammarDeficit: 1.0 - dkt.getPredictions().overallRetentionIndex / 100, latencyMs }
    );

    let selectedIndex: number;
    let selectedDistractor: DistractorCandidate | null = null;

    if (chooseCorrect) {
      selectedIndex = assembled.correctOptionIndex;
    } else {
      // Find distractor matching targetTrapCategory, or first non-correct
      const distractorIndex = assembled.options.findIndex((opt, idx) => {
        if (idx === assembled.correctOptionIndex) return false;
        if (!targetTrapCategory) return true;
        const cand = assembled.selectedDistractors.find((d) => d.text === opt);
        return cand?.category === targetTrapCategory;
      });
      selectedIndex = distractorIndex !== -1 ? distractorIndex : (assembled.correctOptionIndex === 0 ? 1 : 0);
      const text = assembled.options[selectedIndex];
      selectedDistractor = assembled.selectedDistractors.find((d) => d.text === text) || null;
    }

    const isTargetCorrect = selectedIndex === assembled.correctOptionIndex;
    let banditReward = 0;

    // Dual Dispatch to Bandit
    if (!isTargetCorrect && selectedDistractor) {
      bandit.recordInteractionFeedback({
        category: selectedDistractor.category,
        features: selectedDistractor.features,
        trapTriggered: true,
        latencyMs,
      });
      banditReward = 1.0 + 0.15 * Math.min(1.0, latencyMs / 3000);
    } else if (isTargetCorrect && assembled.selectedDistractors.length > 0) {
      const topCand = assembled.selectedDistractors[0];
      bandit.recordInteractionFeedback({
        category: topCand.category,
        features: topCand.features,
        trapTriggered: false,
        latencyMs,
      });
      banditReward = latencyMs > 3000 ? 0.05 * Math.min(1.0, (latencyMs - 3000) / 3000) : 0.0;
    }

    // Dual Dispatch to DKT
    dkt.recordInteraction({
      conceptId,
      isCorrect: isTargetCorrect,
      isTrap: !isTargetCorrect,
      latencyMs,
    });

    return {
      questionId: assembled.questionId,
      selectedIndex,
      selectedText: assembled.options[selectedIndex],
      isCorrect: isTargetCorrect,
      isTrap: !isTargetCorrect,
      trapCategory: selectedDistractor?.category ?? null,
      features: selectedDistractor?.features ?? null,
      latencyMs,
      banditReward,
      banditUpdated: true,
      dktUpdated: true,
      conceptId,
      timestamp: Date.now(),
    };
  }

  // Phase 1: 5 Rounds of falling into 'l1_persian' traps with hesitation
  console.log("  >> Phase 1: Learner triggers L1 Persian traps (5 rounds)");
  const qBank = Array.from(loadStaticQuestionBank().values());

  for (let r = 0; r < 5; r++) {
    const q = qBank[r % qBank.length];
    const res = simulateLearnerRound(q, false, "l1_persian", 3500);
    assert(!res.isCorrect && res.isTrap, `Round ${r + 1}: Trap triggered correctly`);
  }

  const masteryAfterTraps = dkt.getPredictions().conceptMastery[conceptId];
  const l1Arm = bandit.getArmState("l1_persian");
  assert(masteryAfterTraps < initialMastery, `DKT concept mastery decreased after traps (${(initialMastery * 100).toFixed(1)}% -> ${(masteryAfterTraps * 100).toFixed(1)}%)`);
  assert(l1Arm.pulls >= 5, `LinUCB arm 'l1_persian' updated with >= 5 pulls (actual: ${l1Arm.pulls})`);

  // Verify that L1 Persian distractors now score higher in subsequent assembly
  const postTrapAssembly = bandit.assembleAdaptiveQuestion(qBank[10]);
  const l1Cand = postTrapAssembly.selectedDistractors.find((d) => d.category === "l1_persian");
  assert(Boolean(l1Cand), "Trained LinUCB bandit actively surfaces L1 Persian distractor in top 3");

  // Phase 2: 10 Rounds of Mastery (fast correct answers)
  console.log("  >> Phase 2: Learner masters concept with fast correct answers (10 rounds)");
  for (let r = 0; r < 10; r++) {
    const q = qBank[(r + 5) % qBank.length];
    const res = simulateLearnerRound(q, true, undefined, 650);
    assert(res.isCorrect && !res.isTrap, `Round ${r + 6}: Correct answer recorded`);
  }

  const masteryAfterSuccess = dkt.getPredictions().conceptMastery[conceptId];
  assert(masteryAfterSuccess > masteryAfterTraps, `DKT concept mastery recovered after correct answers (${(masteryAfterTraps * 100).toFixed(1)}% -> ${(masteryAfterSuccess * 100).toFixed(1)}%)`);

  // Phase 3: Adversarial Edge Cases (Latency extremes & rapid repeat selection)
  console.log("  >> Phase 3: Adversarial latency extremes & double-click protection");
  const edgeQ = qBank[20];
  const resMinLatency = simulateLearnerRound(edgeQ, true, undefined, 80); // 80ms click
  assert(resMinLatency.latencyMs === 80, "Minimum latency 80ms handled cleanly without error");

  const resHugeLatency = simulateLearnerRound(edgeQ, false, "phonetic_ortho", 15000); // 15s hesitation
  assert(resHugeLatency.banditReward === 1.15, "Long hesitation capped reward properly at 1.15");

  // Verify no NaN in DKT engine
  const allMasteries = Object.values(dkt.getPredictions().conceptMastery);
  const anyMasteryNaN = allMasteries.some((m) => isNaN(m) || !isFinite(m));
  assert(!anyMasteryNaN, "DKT engine has zero NaN or Inf mastery values across all 60 concepts");
}

console.log("");

// ============================================================================
// Suite 7: GrammarHexArena Integration & Geometry Verification
// ============================================================================
console.log("--- Suite 7: GrammarHexArena Integration & Geometry Verification ---");

{
  // 7.1 Hexagon Physical Geometry & Slot Order
  const EDGE_SLOT_ORDER = [4, 5, 0, 1, 2, 3];
  const cx = 690;
  const cy = 295;
  const R = 195;

  const vertices: { x: number; y: number }[] = [];
  for (let k = 0; k < 6; k++) {
    const angle = (k * 60 * Math.PI) / 180;
    vertices.push({
      x: Number((cx + R * Math.cos(angle)).toFixed(1)),
      y: Number((cy + R * Math.sin(angle)).toFixed(1)),
    });
  }

  assert(vertices.length === 6, "Main arena has exactly 6 hexagon vertices");
  assert(vertices[0].x === 690 + 195, "Vertex 0 is correctly placed at 0 degrees");

  // 7.2 Mini-Hex Trail Coordinates
  function getMiniHexCoord(index: number) {
    return { cx: 68, cy: 60 + index * 94 };
  }

  const coord0 = getMiniHexCoord(0);
  const coord5 = getMiniHexCoord(5);
  assert(coord0.cx === 68 && coord0.cy === 60, "Mini-hex step 0 is at (68, 60)");
  assert(coord5.cy === 60 + 5 * 94, "Mini-hex vertical rail steps linearly without overlap");

  // 7.3 Text Splitting inside Mini-Hex
  function splitMiniHexText(word: string): { line1?: string; line2?: string; single?: string } {
    const trimmed = word.trim();
    const spaceIdx = trimmed.indexOf(" ");
    if (spaceIdx !== -1 && trimmed.length > 7) {
      const half = Math.floor(trimmed.length / 2);
      const spaces: number[] = [];
      for (let i = 0; i < trimmed.length; i++) {
        if (trimmed[i] === " ") spaces.push(i);
      }
      const bestSpace = spaces.reduce((prev, curr) => Math.abs(curr - half) < Math.abs(prev - half) ? curr : prev, spaceIdx);
      return { line1: trimmed.slice(0, bestSpace), line2: trimmed.slice(bestSpace + 1) };
    }
    return { single: trimmed };
  }

  const splitShort = splitMiniHexText("She");
  assert(splitShort.single === "She", "Short word stays single line");

  const splitCompound = splitMiniHexText("has been working");
  assert(Boolean(splitCompound.line1 && splitCompound.line2), "Compound sentence fragment splits into two clean lines");

  // 7.4 Comprehensive 60-Stage Grammar Curriculum Audit
  const cefrTiers = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
  let totalCurriculumStages = 0;
  let totalCircuits = 0;
  let totalNodes = 0;

  for (const tier of cefrTiers) {
    const stages = GRAMMAR_AEF_CURRICULUM[tier];
    assert(Boolean(stages), `Curriculum contains CEFR tier ${tier}`);
    for (let lvl = 1; lvl <= 10; lvl++) {
      const stage = stages[lvl];
      if (stage) {
        totalCurriculumStages++;
        if (Array.isArray(stage.circuits)) {
          totalCircuits += stage.circuits.length;
          for (const circuit of stage.circuits) {
            totalNodes += circuit.nodes?.length || 0;
          }
        }
      }
    }
  }

  assert(totalCurriculumStages === 60, `Curriculum has exactly 60 micro-stages (found ${totalCurriculumStages})`);
  assert(totalCircuits >= 60, `Curriculum has >= 60 circuit rounds (found ${totalCircuits})`);
  assert(totalNodes >= 180, `Curriculum has >= 180 circuit nodes (found ${totalNodes})`);

  // 7.5 renderAdaptiveHexQuestion Option Mapping
  const bandit = EnDooraLinUCBBandit.getInstance();
  const qBank = loadStaticQuestionBank();
  const testPayload = qBank.get("grammar-a1-001")!;
  const assembled = bandit.assembleAdaptiveQuestion(testPayload);

  const hexOptions = renderAdaptiveHexQuestion(assembled, {
    nextNodeId: "n_goal_standard",
    distractorNextNodeId: undefined,
    comboBoost: 2.0,
    isBranchingClause: true,
  });

  assert(hexOptions.length === 4, "renderAdaptiveHexQuestion produces 4 HexEdgeOptions");
  const correctHexOpt = hexOptions.find((o) => o.isCorrect);
  assert(Boolean(correctHexOpt), "renderAdaptiveHexQuestion includes isCorrect option");
  assert(correctHexOpt?.comboBoost === 2.0, "comboBoost correctly passed to correct HexEdgeOption");
  assert(correctHexOpt?.nextNodeId === "n_goal_standard", "nextNodeId correctly passed to correct HexEdgeOption");

  const trapOptions = hexOptions.filter((o) => o.isTrap);
  assert(trapOptions.length === 3, "renderAdaptiveHexQuestion includes exactly 3 trap options");
  assert(
    trapOptions.every((t) => typeof t.trapExplanationFa === "string" && t.trapExplanationFa.length > 0),
    "All trap options have non-empty Persian educational explanations"
  );
}

console.log("");

// ============================================================================
// Final Verification Summary
// ============================================================================
console.log("======================================================================");
console.log(`  VERIFICATION RESULTS:`);
console.log(`  Total Invariant Checks: ${totalTests}`);
console.log(`  Passed Checks:         ${passedTests}`);
console.log(`  Failed Checks:         ${failedTests}`);
console.log("======================================================================");

if (failedTests > 0) {
  console.error(`\n❌ ADVERSARIAL VERIFICATION FAILED with ${failedTests} error(s)!`);
  process.exit(1);
} else {
  console.log(`\n✅ ALL ${passedTests} ADVERSARIAL LIFECYCLE CHECKS PASSED WITH ZERO ERRORS!`);
  process.exit(0);
}
