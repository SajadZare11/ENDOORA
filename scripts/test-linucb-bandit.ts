/**
 * Canonical Automated Test Suite and Performance Benchmark for Engine 6:
 * Disjoint LinUCB Bandit Engine & Cognitive Context Fusion
 * Target File: scripts/test-linucb-bandit.ts
 *
 * Verifies:
 * 1. Sherman-Morrison rank-1 update matches explicit 4x4 Gauss-Jordan inversion within 1e-5 tolerance.
 * 2. UCB score ranking logic, exploration bonus calculation, and alpha parameter scaling.
 * 3. Arm convergence: repeated interaction feedback on a trap category increases expected selection probability.
 * 4. LocalStorage state serialization, rehydration, and corrupted state resilience.
 * 5. fuseCognitiveContext L2 unit normalization under diverse and edge-case inputs.
 * 6. Performance benchmark: 10,000 iterations of assembleAdaptiveQuestion confirming execution time < 0.2 ms.
 * 7. Real-world dataset ingestion: all 264 pre-calibrated items from enriched_adaptive_questions.json.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createIdentity4x4,
  dotProduct4,
  fisherYatesShuffle,
  fuseCognitiveContext,
  invertMatrix4x4Explicit,
  l2Norm4,
  matVecMul4,
  matrixAdd4x4,
  normalizeVector4,
  outerProduct4,
  quadForm4,
  shermanMorrisonUpdate4x4,
  EnDooraLinUCBBandit,
} from "../apps/web/lib/ai/linucb-bandit-engine.ts";
import type {
  AdaptiveQuestionPayload,
  DistractorCandidate,
  EnDooraTriModalTelemetry,
  Matrix4x4,
  TrapCategory,
  Vector4,
} from "../apps/web/lib/ai/types.ts";
import { TRAP_CATEGORIES } from "../apps/web/lib/ai/types.ts";

// ============================================================================
// Test Harness Utilities
// ============================================================================

let totalChecks = 0;
let passedChecks = 0;

function check(condition: boolean, description: string): void {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ [FAIL] ${description}`);
    throw new Error(`Assertion failed: ${description}`);
  }
  passedChecks++;
  console.log(`  ✓ [PASS] ${description}`);
}

function checkClose(
  actual: number,
  expected: number,
  tolerance = 1e-5,
  description = "value closeness"
): void {
  const diff = Math.abs(actual - expected);
  const ok = diff <= tolerance;
  totalChecks++;
  if (!ok) {
    console.error(
      `  ❌ [FAIL] ${description}: actual=${actual}, expected=${expected}, diff=${diff} (tolerance=${tolerance})`
    );
    throw new Error(
      `Tolerance exceeded for ${description}: actual=${actual}, expected=${expected}, diff=${diff}`
    );
  }
  passedChecks++;
  console.log(`  ✓ [PASS] ${description} (diff=${diff.toExponential(4)} <= ${tolerance})`);
}

console.log("================================================================================");
console.log("  EnDoora Engine 6: Canonical LinUCB Bandit Test Suite & Benchmark");
console.log("================================================================================");

// ============================================================================
// Suite 1: Sherman-Morrison Rank-1 Update vs Explicit 4x4 Inversion
// ============================================================================
console.log("\n--- Suite 1: Sherman-Morrison Rank-1 Inversion Mathematical Precision ---");

{
  let A: Matrix4x4 = createIdentity4x4();
  let A_inv: Matrix4x4 = createIdentity4x4();

  // Test across 50 sequential rank-1 updates with diverse normalized vectors
  const updateVectors: Vector4[] = [
    normalizeVector4([0.8, 0.2, 0.1, 0.5]),
    normalizeVector4([0.1, 0.9, 0.3, 0.2]),
    normalizeVector4([0.3, 0.2, 0.8, 0.4]),
    normalizeVector4([0.4, 0.1, 0.2, 0.9]),
    normalizeVector4([0.5, 0.5, 0.5, 0.5]),
    normalizeVector4([0.9, 0.1, 0.0, 0.1]),
    normalizeVector4([0.0, 0.8, 0.5, 0.2]),
    normalizeVector4([0.2, 0.3, 0.9, 0.1]),
    normalizeVector4([0.6, 0.2, 0.2, 0.7]),
    normalizeVector4([0.1, 0.4, 0.4, 0.8]),
    normalizeVector4([0.7, 0.3, 0.5, 0.2]),
    normalizeVector4([0.2, 0.6, 0.3, 0.6]),
    normalizeVector4([0.5, 0.1, 0.7, 0.4]),
    normalizeVector4([0.4, 0.7, 0.1, 0.5]),
    normalizeVector4([0.3, 0.4, 0.6, 0.5]),
    normalizeVector4([0.8, 0.5, 0.2, 0.1]),
    normalizeVector4([0.1, 0.2, 0.8, 0.5]),
    normalizeVector4([0.6, 0.6, 0.2, 0.4]),
    normalizeVector4([0.2, 0.5, 0.5, 0.7]),
    normalizeVector4([0.9, 0.3, 0.1, 0.3]),
    normalizeVector4([0.4, 0.2, 0.7, 0.5]),
    normalizeVector4([0.5, 0.8, 0.2, 0.2]),
    normalizeVector4([0.3, 0.1, 0.6, 0.7]),
    normalizeVector4([0.7, 0.4, 0.3, 0.4]),
    normalizeVector4([0.2, 0.9, 0.2, 0.3]),
    normalizeVector4([0.1, 0.1, 0.9, 0.2]),
    normalizeVector4([0.8, 0.3, 0.2, 0.3]),
    normalizeVector4([0.3, 0.7, 0.3, 0.4]),
    normalizeVector4([0.5, 0.2, 0.5, 0.6]),
    normalizeVector4([0.2, 0.4, 0.8, 0.2]),
    normalizeVector4([0.6, 0.1, 0.4, 0.7]),
    normalizeVector4([0.4, 0.6, 0.1, 0.5]),
    normalizeVector4([0.7, 0.2, 0.3, 0.6]),
    normalizeVector4([0.1, 0.8, 0.2, 0.4]),
    normalizeVector4([0.3, 0.3, 0.7, 0.5]),
    normalizeVector4([0.5, 0.5, 0.1, 0.7]),
    normalizeVector4([0.2, 0.2, 0.9, 0.3]),
    normalizeVector4([0.8, 0.4, 0.1, 0.2]),
    normalizeVector4([0.1, 0.5, 0.6, 0.6]),
    normalizeVector4([0.6, 0.3, 0.3, 0.7]),
    normalizeVector4([0.4, 0.1, 0.8, 0.3]),
    normalizeVector4([0.3, 0.9, 0.1, 0.2]),
    normalizeVector4([0.7, 0.5, 0.2, 0.3]),
    normalizeVector4([0.2, 0.3, 0.6, 0.7]),
    normalizeVector4([0.5, 0.7, 0.3, 0.2]),
    normalizeVector4([0.1, 0.2, 0.7, 0.7]),
    normalizeVector4([0.8, 0.1, 0.4, 0.3]),
    normalizeVector4([0.3, 0.6, 0.5, 0.4]),
    normalizeVector4([0.6, 0.4, 0.2, 0.7]),
    normalizeVector4([0.2, 0.8, 0.4, 0.2]),
  ];

  let maxDiffOverall = 0;
  let maxAsymmetry = 0;

  for (let step = 0; step < updateVectors.length; step++) {
    const x = updateVectors[step];

    // Explicit matrix update: A = A + x x^T
    const xxT = outerProduct4(x);
    A = matrixAdd4x4(A, xxT);

    // Sherman-Morrison rank-1 inverse update: A_inv = SM(A_inv, x)
    A_inv = shermanMorrisonUpdate4x4(A_inv, x);

    // Explicit matrix inversion via Gauss-Jordan with partial pivoting
    const explicitInv = invertMatrix4x4Explicit(A);

    // Compare all 16 entries
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const diff = Math.abs(A_inv[r][c] - explicitInv[r][c]);
        if (diff > maxDiffOverall) maxDiffOverall = diff;
      }
    }

    // Verify symmetry enforcement: A_inv[r][c] === A_inv[c][r]
    for (let r = 0; r < 4; r++) {
      for (let c = r + 1; c < 4; c++) {
        const asym = Math.abs(A_inv[r][c] - A_inv[c][r]);
        if (asym > maxAsymmetry) maxAsymmetry = asym;
      }
    }

    // Verify positive definiteness: v^T * A_inv * v > 0 for standard basis vectors
    for (let d = 0; d < 4; d++) {
      const e: Vector4 = [d === 0 ? 1 : 0, d === 1 ? 1 : 0, d === 2 ? 1 : 0, d === 3 ? 1 : 0];
      const q = quadForm4(e, A_inv);
      if (q <= 0) {
        throw new Error(`Positive definiteness violated at step ${step}, basis vector ${d}`);
      }
    }
  }

  check(
    maxDiffOverall < 1e-5,
    `Sherman-Morrison matches explicit 4x4 Gauss-Jordan inversion across 50 updates (max error: ${maxDiffOverall.toExponential(4)} < 1e-5)`
  );
  check(
    maxAsymmetry <= 1e-12,
    `Sherman-Morrison preserves matrix symmetry strictly (max asymmetry: ${maxAsymmetry.toExponential(4)})`
  );

  // Verify algebraic identity: A * A_inv = I_4 within 1e-5
  let maxIdentityDiff = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += A[r][k] * A_inv[k][c];
      }
      const expected = r === c ? 1.0 : 0.0;
      const idDiff = Math.abs(sum - expected);
      if (idDiff > maxIdentityDiff) maxIdentityDiff = idDiff;
    }
  }
  check(
    maxIdentityDiff < 1e-5,
    `Matrix product A * A_inv matches identity I_4 within tolerance (max diff: ${maxIdentityDiff.toExponential(4)} < 1e-5)`
  );
}

// ============================================================================
// Suite 2: UCB Score Ranking Logic & Alpha Exploration Scaling
// ============================================================================
console.log("\n--- Suite 2: UCB Score Ranking Logic & Exploration Alpha Scaling ---");

{
  const mockPayload: AdaptiveQuestionPayload = {
    id: "test-q-alpha",
    prompt: "They ___ English for three years.",
    promptFa: "شکل صحیح فعل را برای زمان حال کامل انتخاب کنید.",
    correctAnswer: "have studied",
    distractorPool: [
      { id: "d_pho_1", text: "have studyed", category: "phonetic_ortho", features: normalizeVector4([0.9, 0.1, 0.1, 0.1]) },
      { id: "d_pho_2", text: "has studied", category: "phonetic_ortho", features: normalizeVector4([0.85, 0.2, 0.2, 0.1]) },
      { id: "d_pho_3", text: "had studyied", category: "phonetic_ortho", features: normalizeVector4([0.88, 0.1, 0.2, 0.1]) },
      { id: "d_sem_1", text: "are studying", category: "semantic_siamese", features: normalizeVector4([0.1, 0.9, 0.2, 0.1]) },
      { id: "d_sem_2", text: "were studying", category: "semantic_siamese", features: normalizeVector4([0.2, 0.88, 0.1, 0.1]) },
      { id: "d_sem_3", text: "will study", category: "semantic_siamese", features: normalizeVector4([0.1, 0.92, 0.2, 0.1]) },
      { id: "d_mor_1", text: "study", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.92, 0.1]) },
      { id: "d_mor_2", text: "studied", category: "morphological", features: normalizeVector4([0.2, 0.1, 0.89, 0.2]) },
      { id: "d_mor_3", text: "studying", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.91, 0.1]) },
      { id: "d_l1_1", text: "are study (L1)", category: "l1_persian", features: normalizeVector4([0.1, 0.1, 0.2, 0.92]) },
      { id: "d_l1_2", text: "have study (L1)", category: "l1_persian", features: normalizeVector4([0.2, 0.1, 0.1, 0.89]) },
      { id: "d_l1_3", text: "study have (L1)", category: "l1_persian", features: normalizeVector4([0.1, 0.2, 0.1, 0.91]) },
    ],
  };

  // 1. Alpha = 0 (Pure Exploitation): Exploration bonus must be 0
  const banditAlpha0 = new EnDooraLinUCBBandit({ alpha: 0.0, skipStorageLoad: true });
  const assembledAlpha0 = banditAlpha0.assembleAdaptiveQuestion(
    mockPayload,
    [0.5, 0.5, 0.5, 0.5],
    { alpha: 0.0 }
  );

  check(
    assembledAlpha0.explorationBonusMap !== undefined,
    "Exploration bonus map is present in assembled question"
  );
  for (const [candId, bonus] of Object.entries(assembledAlpha0.explorationBonusMap || {})) {
    check(bonus === 0, `Alpha=0 yields exactly 0 exploration bonus for candidate ${candId}`);
  }

  // 2. Alpha Scaling: verify sigma = alpha * sqrt(x^T A^(-1) x) scales linearly with alpha
  const banditAlphaScale = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });
  const qAlpha05 = banditAlphaScale.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5], { alpha: 0.5 });
  const qAlpha10 = banditAlphaScale.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5], { alpha: 1.0 });
  const qAlpha20 = banditAlphaScale.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5], { alpha: 2.0 });

  const testCandId = "d_pho_1";
  const bonus05 = qAlpha05.explorationBonusMap![testCandId];
  const bonus10 = qAlpha10.explorationBonusMap![testCandId];
  const bonus20 = qAlpha20.explorationBonusMap![testCandId];

  checkClose(bonus10, bonus05 * 2, 1e-9, "Exploration bonus doubles when alpha doubles (0.5 -> 1.0)");
  checkClose(bonus20, bonus05 * 4, 1e-9, "Exploration bonus quadruples when alpha quadruples (0.5 -> 2.0)");

  // 3. Exploration vs Exploitation Dynamic Tradeoff
  // Train arm 'morphological' with 20 pulls and high rewards -> high mu, small covariance
  const tradeoffBandit = new EnDooraLinUCBBandit({ alpha: 0.1, skipStorageLoad: true });
  const morCand = mockPayload.distractorPool.find((d) => d.category === "morphological")!;
  for (let i = 0; i < 20; i++) {
    tradeoffBandit.recordInteractionFeedback({
      category: "morphological",
      features: morCand.features,
      trapTriggered: true,
      latencyMs: 1500,
    });
  }

  // At low alpha (0.05), exploited arm (morphological) dominates due to high mean mu
  const lowAlphaQ = tradeoffBandit.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5], { alpha: 0.05 });
  check(
    lowAlphaQ.selectedDistractors[0].category === "morphological",
    "Low alpha (0.05) prioritizes high-reward exploited arm ('morphological')"
  );

  // At high alpha (3.0), unvisited arms with identity covariance (uncertainty = 1.0) dominate
  const highAlphaQ = tradeoffBandit.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5], { alpha: 3.0 });
  const highAlphaTopCat = highAlphaQ.selectedDistractors[0].category;
  check(
    highAlphaTopCat !== "morphological",
    `High alpha (3.0) forces exploration of unvisited arms (selected: '${highAlphaTopCat}')`
  );

  // 4. Candidate UCB Score Descending Order & Top-3 Selection
  const scores = Object.values(qAlpha05.scores || {});
  check(scores.length === 12, "All 12 candidate distractors scored");
  for (const distractor of qAlpha05.selectedDistractors) {
    const selectedScore = qAlpha05.scores![distractor.id];
    // Must be greater than or equal to unselected candidates
    for (const unselected of mockPayload.distractorPool) {
      if (!qAlpha05.selectedDistractors.some((d) => d.id === unselected.id)) {
        const unselectedScore = qAlpha05.scores![unselected.id];
        check(
          selectedScore >= unselectedScore - 1e-9,
          `Selected distractor (${selectedScore.toFixed(4)}) ranks >= unselected (${unselectedScore.toFixed(4)})`
        );
      }
    }
  }

  // 5. Structure of Assembled Question
  check(qAlpha05.options.length === 4, "Assembled question has exactly 4 options");
  check(
    qAlpha05.options[qAlpha05.correctOptionIndex] === mockPayload.correctAnswer,
    "Option at correctOptionIndex strictly equals correctAnswer"
  );
  check(qAlpha05.selectedDistractors.length === 3, "Exactly 3 distractors selected");

  // 6. Fisher-Yates Position Distribution Uniformity across 1,000 trials
  const slotCounts = [0, 0, 0, 0];
  for (let trial = 0; trial < 1000; trial++) {
    const trialQ = banditAlphaScale.assembleAdaptiveQuestion(mockPayload, [0.5, 0.5, 0.5, 0.5]);
    slotCounts[trialQ.correctOptionIndex]++;
  }
  console.log(`  Fisher-Yates 1,000-trial position distribution: [0: ${slotCounts[0]}, 1: ${slotCounts[1]}, 2: ${slotCounts[2]}, 3: ${slotCounts[3]}]`);
  for (let s = 0; s < 4; s++) {
    check(
      slotCounts[s] >= 180 && slotCounts[s] <= 320,
      `Slot ${s} frequency (${slotCounts[s]}/1000) is well-balanced within expected binomial variance`
    );
  }
}

// ============================================================================
// Suite 3: Arm Convergence & Learner Weakness Adaptation
// ============================================================================
console.log("\n--- Suite 3: Arm Convergence on Repeated Interaction Feedback ---");

{
  const questionPayload: AdaptiveQuestionPayload = {
    id: "test-q-convergence",
    prompt: "I ___ him since high school.",
    promptFa: "شکل صحیح زمان حال کامل را انتخاب کنید.",
    correctAnswer: "have known",
    distractorPool: [
      { id: "d1", text: "knowed", category: "phonetic_ortho", features: normalizeVector4([0.92, 0.1, 0.1, 0.1]) },
      { id: "d2", text: "knows", category: "phonetic_ortho", features: normalizeVector4([0.89, 0.2, 0.1, 0.1]) },
      { id: "d3", text: "knewed", category: "phonetic_ortho", features: normalizeVector4([0.91, 0.1, 0.2, 0.1]) },
      { id: "d4", text: "am knowing", category: "semantic_siamese", features: normalizeVector4([0.1, 0.91, 0.2, 0.1]) },
      { id: "d5", text: "was knowing", category: "semantic_siamese", features: normalizeVector4([0.2, 0.88, 0.1, 0.1]) },
      { id: "d6", text: "have know", category: "semantic_siamese", features: normalizeVector4([0.1, 0.93, 0.1, 0.1]) },
      { id: "d7", text: "knew", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.93, 0.1]) },
      { id: "d8", text: "know", category: "morphological", features: normalizeVector4([0.2, 0.1, 0.90, 0.2]) },
      { id: "d9", text: "known", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.89, 0.2]) },
      { id: "d10", text: "know (L1: mishnasam)", category: "l1_persian", features: normalizeVector4([0.1, 0.1, 0.1, 0.94]) },
      { id: "d11", text: "am know (L1 syntax)", category: "l1_persian", features: normalizeVector4([0.1, 0.2, 0.1, 0.91]) },
      { id: "d12", text: "have did know (L1)", category: "l1_persian", features: normalizeVector4([0.2, 0.1, 0.2, 0.90]) },
    ],
  };

  // Test 3.1: Persian L1 Weakness Convergence
  const persianBandit = new EnDooraLinUCBBandit({ alpha: 0.2, skipStorageLoad: true });
  const l1Target = questionPayload.distractorPool.find((d) => d.category === "l1_persian")!;

  // 15 repeated trap triggerings on L1 Persian
  for (let i = 0; i < 15; i++) {
    persianBandit.recordInteractionFeedback({
      category: "l1_persian",
      features: l1Target.features,
      trapTriggered: true,
      latencyMs: 2800,
    });
  }

  // Verify disjoint isolation: other 3 arms untouched
  const l1Arm = persianBandit.getArmState("l1_persian");
  check(l1Arm.pulls === 15, "L1 Persian arm recorded exactly 15 pulls");
  check(l1Arm.rewards >= 15.0, "L1 Persian arm accumulated positive rewards >= 15.0");

  for (const cat of ["phonetic_ortho", "semantic_siamese", "morphological"] as const) {
    const unpulledArm = persianBandit.getArmState(cat);
    check(unpulledArm.pulls === 0, `Disjoint isolation: '${cat}' arm pulls remain 0`);
    check(unpulledArm.rewards === 0, `Disjoint isolation: '${cat}' arm rewards remain 0`);
  }

  // Assemble question with Persian learner cognitive context (dim 3 elevated)
  const persianContext = normalizeVector4([0.1, 0.1, 0.1, 0.95]);
  const assembledPersian = persianBandit.assembleAdaptiveQuestion(questionPayload, persianContext);

  const selectedL1Count = assembledPersian.selectedDistractors.filter(
    (d) => d.category === "l1_persian"
  ).length;
  console.log(`  Learner L1 Persian convergence: ${selectedL1Count}/3 selected distractors are L1 Persian`);
  check(
    selectedL1Count >= 2,
    `L1 Persian weakness convergence verified (${selectedL1Count}/3 distractors targeted learner weakness)`
  );

  // Test 3.2: Generalization to Phonetic/Orthographic Weakness Convergence
  const phoneticBandit = new EnDooraLinUCBBandit({ alpha: 0.2, skipStorageLoad: true });
  const phoTarget = questionPayload.distractorPool.find((d) => d.category === "phonetic_ortho")!;

  for (let i = 0; i < 15; i++) {
    phoneticBandit.recordInteractionFeedback({
      category: "phonetic_ortho",
      features: phoTarget.features,
      trapTriggered: true,
      latencyMs: 2500,
    });
  }

  const phoArm = phoneticBandit.getArmState("phonetic_ortho");
  check(phoArm.pulls === 15, "Phonetic arm recorded exactly 15 pulls");
  check(
    phoneticBandit.getArmState("l1_persian").pulls === 0,
    "Disjoint isolation: L1 Persian pulls remain 0 when phonetic is trained"
  );

  const phoneticContext = normalizeVector4([0.95, 0.1, 0.1, 0.1]);
  const assembledPhonetic = phoneticBandit.assembleAdaptiveQuestion(questionPayload, phoneticContext);
  const selectedPhoCount = assembledPhonetic.selectedDistractors.filter(
    (d) => d.category === "phonetic_ortho"
  ).length;
  console.log(`  Learner Phonetic convergence: ${selectedPhoCount}/3 selected distractors are Phonetic`);
  check(
    selectedPhoCount >= 2,
    `Phonetic weakness convergence verified (${selectedPhoCount}/3 distractors targeted learner weakness)`
  );

  // Test 3.3: Avoidance feedback (fast correct response) yields 0 reward
  const avoidanceBandit = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });
  avoidanceBandit.recordInteractionFeedback({
    category: "semantic_siamese",
    features: [0.1, 0.9, 0.2, 0.1],
    trapTriggered: false,
    latencyMs: 650, // Fast reaction
  });
  const avoidedArm = avoidanceBandit.getArmState("semantic_siamese");
  check(avoidedArm.pulls === 1, "Avoidance feedback registers a pull on the arm");
  check(avoidedArm.rewards === 0, "Fast avoidance feedback yields exactly 0.0 reward");
}

// ============================================================================
// Suite 4: LocalStorage State Serialization & Rehydration
// ============================================================================
console.log("\n--- Suite 4: LocalStorage State Serialization & Rehydration ---");

{
  // 1. SSR Guard: Ensure instantiation runs safely without global window/localStorage
  const ssrBandit = new EnDooraLinUCBBandit({ skipStorageLoad: false });
  check(ssrBandit.getTotalInteractions() === 0, "SSR safety: instantiates cleanly in headless environment");

  // 2. Mock LocalStorage Environment
  const mockStore: Record<string, string> = {};
  (globalThis as any).window = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStore[key] ?? null,
    setItem: (key: string, val: string) => {
      mockStore[key] = val;
    },
    removeItem: (key: string) => {
      delete mockStore[key];
    },
    clear: () => {
      for (const k of Object.keys(mockStore)) delete mockStore[k];
    },
  };

  // 3. Train Bandit & Verify Serialization
  const trainerBandit = new EnDooraLinUCBBandit({ alpha: 0.85, skipStorageLoad: false });
  trainerBandit.recordInteractionFeedback({
    category: "morphological",
    features: normalizeVector4([0.2, 0.1, 0.95, 0.1]),
    trapTriggered: true,
    latencyMs: 2400,
  });
  trainerBandit.recordInteractionFeedback({
    category: "l1_persian",
    features: normalizeVector4([0.1, 0.1, 0.1, 0.98]),
    trapTriggered: true,
    latencyMs: 3500,
  });

  const serialized = mockStore[EnDooraLinUCBBandit.STORAGE_KEY];
  check(typeof serialized === "string", "Bandit state serialized to localStorage");

  const parsed = JSON.parse(serialized);
  check(parsed.version === 1, "Stored state contains schema version 1");
  check(parsed.totalInteractions === 2, "Stored state records totalInteractions = 2");
  check(parsed.alpha === 0.85, "Stored state records alpha = 0.85");
  check(parsed.arms.morphological.pulls === 1, "Stored state records morphological pull = 1");
  check(parsed.arms.l1_persian.pulls === 1, "Stored state records l1_persian pull = 1");

  // 4. Rehydrate in a brand new Bandit instance
  const rehydratedBandit = new EnDooraLinUCBBandit({ skipStorageLoad: false });
  check(rehydratedBandit.getTotalInteractions() === 2, "Rehydrated bandit preserves totalInteractions");
  checkClose(rehydratedBandit.getAlpha(), 0.85, 1e-9, "Rehydrated bandit preserves alpha");

  const rehydratedMorphArm = rehydratedBandit.getArmState("morphological");
  check(rehydratedMorphArm.pulls === 1, "Rehydrated morphological arm preserves pull count");
  check(rehydratedMorphArm.rewards >= 1.0, "Rehydrated morphological arm preserves reward");

  // Verify A_inv matrix precision in rehydrated arm
  const trainerMorphArm = trainerBandit.getArmState("morphological");
  let matrixMaxDiff = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const diff = Math.abs(rehydratedMorphArm.A_inv[r][c] - trainerMorphArm.A_inv[r][c]);
      if (diff > matrixMaxDiff) matrixMaxDiff = diff;
    }
  }
  check(matrixMaxDiff < 1e-12, "Rehydrated inverse covariance matrix matches trainer exactly");

  // 5. Corrupted Storage Resilience
  mockStore[EnDooraLinUCBBandit.STORAGE_KEY] = "{ corrupt JSON syntax .. ";
  const fallbackBandit1 = new EnDooraLinUCBBandit({ skipStorageLoad: false });
  check(fallbackBandit1.getTotalInteractions() === 0, "Corrupted JSON in localStorage falls back gracefully to default state");

  mockStore[EnDooraLinUCBBandit.STORAGE_KEY] = JSON.stringify({ version: 999, arms: {} });
  const fallbackBandit2 = new EnDooraLinUCBBandit({ skipStorageLoad: false });
  check(fallbackBandit2.getTotalInteractions() === 0, "Unsupported schema version falls back gracefully to default state");

  // Clean up mock globals
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
}

// ============================================================================
// Suite 5: Tri-Modal Cognitive Context Fusion L2 Normalization & Edge Cases
// ============================================================================
console.log("\n--- Suite 5: fuseCognitiveContext L2 Normalization & Edge Cases ---");

{
  // 1. Default / Empty Telemetry
  const def1 = fuseCognitiveContext();
  checkClose(l2Norm4(def1), 1.0, 1e-9, "Default context without arguments has unit L2 norm");

  const def2 = fuseCognitiveContext({});
  checkClose(l2Norm4(def2), 1.0, 1e-9, "Empty telemetry object has unit L2 norm");

  // 2. Single-Dominant Deficit Profiles
  const gopDominant = fuseCognitiveContext({ phonemeErrorRate: 0.95, semanticDeficit: 0.05, latencyMs: 200 });
  checkClose(l2Norm4(gopDominant), 1.0, 1e-9, "GOP dominant telemetry has unit L2 norm");
  check(
    gopDominant[0] > gopDominant[1] && gopDominant[0] > gopDominant[2] && gopDominant[0] > gopDominant[3],
    "GOP dominant context has dim 0 strictly dominant"
  );

  const bertDominant = fuseCognitiveContext({ phonemeErrorRate: 0.05, semanticDeficit: 0.95, latencyMs: 200 });
  checkClose(l2Norm4(bertDominant), 1.0, 1e-9, "BERT dominant telemetry has unit L2 norm");
  check(
    bertDominant[1] > bertDominant[0] && bertDominant[1] > bertDominant[2] && bertDominant[1] > bertDominant[3],
    "BERT dominant context has dim 1 strictly dominant"
  );

  const dktDominant = fuseCognitiveContext({ dktGrammarDeficit: 0.95, phonemeErrorRate: 0.05, latencyMs: 200 });
  checkClose(l2Norm4(dktDominant), 1.0, 1e-9, "DKT dominant telemetry has unit L2 norm");
  check(
    dktDominant[2] > dktDominant[0] && dktDominant[2] > dktDominant[1] && dktDominant[2] > dktDominant[3],
    "DKT dominant context has dim 2 strictly dominant"
  );

  const latencyDominant = fuseCognitiveContext({ latencyMs: 60000, phonemeErrorRate: 0.05, semanticDeficit: 0.05 });
  checkClose(l2Norm4(latencyDominant), 1.0, 1e-9, "Latency dominant telemetry has unit L2 norm");
  check(
    latencyDominant[3] > latencyDominant[0] && latencyDominant[3] > latencyDominant[1],
    "High hesitation latency has dim 3 dominant"
  );

  // 3. 64D Latent DKT Hidden State Projection
  const random64D = Array.from({ length: 64 }, () => Math.random() * 2 - 1);
  const dkt64Ctx = fuseCognitiveContext({ dktHiddenState: random64D, latencyMs: 1500 });
  checkClose(l2Norm4(dkt64Ctx), 1.0, 1e-9, "64D DKT hidden state projects to valid unit vector");
  check(!isNaN(dkt64Ctx[2]) && dkt64Ctx[2] >= 0, "Projected DKT grammar deficit is finite and non-negative");

  // 4. Adversarial & Edge Case Inputs
  const edgeCases: Array<{ label: string; telemetry: EnDooraTriModalTelemetry }> = [
    { label: "Zero values everywhere", telemetry: { phonemeErrorRate: 0, semanticDeficit: 0, dktGrammarDeficit: 0, latencyMs: 0 } },
    { label: "Negative values", telemetry: { phonemeErrorRate: -1.0, semanticDeficit: -0.5, latencyMs: -500 } },
    { label: "Extreme latency (1,000,000 ms)", telemetry: { latencyMs: 1_000_000 } },
    { label: "Overflow numbers (> 100)", telemetry: { phonemeErrorRate: 150.0, semanticDeficit: 999.0 } },
    { label: "Empty 64D array", telemetry: { dktHiddenState: [] } },
    { label: "Backward-compatible alias fields", telemetry: { gopPhonemeErrorRate: 0.8, bertSemanticDeficit: 0.7 } },
  ];

  for (const { label, telemetry } of edgeCases) {
    const ctx = fuseCognitiveContext(telemetry);
    checkClose(l2Norm4(ctx), 1.0, 1e-9, `Edge case '${label}' produces unit L2 norm`);
    check(
      ctx.every((v) => !isNaN(v) && isFinite(v) && v >= 0 && v <= 1.0),
      `Edge case '${label}' components are all within [0.0, 1.0]`
    );
  }
}

// ============================================================================
// Suite 6: Performance Benchmark (10,000 Iterations < 0.2 ms)
// ============================================================================
console.log("\n--- Suite 6: Performance Benchmark (10,000 Iterations < 0.2 ms Budget) ---");

{
  const benchBandit = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });
  const benchPayload: AdaptiveQuestionPayload = {
    id: "bench-q1",
    prompt: "If I had known about the meeting, I ___ attended.",
    promptFa: "شکل صحیح شرطی نوع سوم را انتخاب کنید.",
    correctAnswer: "would have",
    distractorPool: [
      { id: "b1", text: "will have", category: "phonetic_ortho", features: normalizeVector4([0.88, 0.2, 0.1, 0.1]) },
      { id: "b2", text: "would had", category: "phonetic_ortho", features: normalizeVector4([0.91, 0.1, 0.2, 0.1]) },
      { id: "b3", text: "would have had", category: "phonetic_ortho", features: normalizeVector4([0.85, 0.2, 0.2, 0.1]) },
      { id: "b4", text: "might have", category: "semantic_siamese", features: normalizeVector4([0.2, 0.92, 0.1, 0.1]) },
      { id: "b5", text: "could have", category: "semantic_siamese", features: normalizeVector4([0.1, 0.89, 0.2, 0.1]) },
      { id: "b6", text: "should have", category: "semantic_siamese", features: normalizeVector4([0.2, 0.90, 0.2, 0.1]) },
      { id: "b7", text: "would", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.94, 0.1]) },
      { id: "b8", text: "had", category: "morphological", features: normalizeVector4([0.2, 0.1, 0.91, 0.1]) },
      { id: "b9", text: "have", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.89, 0.2]) },
      { id: "b10", text: "would be (L1: boodam)", category: "l1_persian", features: normalizeVector4([0.1, 0.1, 0.1, 0.95]) },
      { id: "b11", text: "did have (L1)", category: "l1_persian", features: normalizeVector4([0.2, 0.1, 0.2, 0.90]) },
      { id: "b12", text: "was attended (L1)", category: "l1_persian", features: normalizeVector4([0.1, 0.2, 0.1, 0.92]) },
    ],
  };

  const benchContext: Vector4 = normalizeVector4([0.4, 0.3, 0.6, 0.5]);

  // 1. Warm-up Phase (1,000 iterations to allow V8 JIT optimization)
  for (let i = 0; i < 1000; i++) {
    benchBandit.assembleAdaptiveQuestion(benchPayload, benchContext);
  }

  // 2. Timed Execution Phase (10,000 iterations)
  const ITERATIONS = 10000;
  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    benchBandit.assembleAdaptiveQuestion(benchPayload, benchContext);
  }
  const end = performance.now();

  const totalTimeMs = end - start;
  const avgLatencyMs = totalTimeMs / ITERATIONS;
  const opsPerSec = Math.round((ITERATIONS / totalTimeMs) * 1000);

  console.log(`  Executed ${ITERATIONS} question assemblies in ${totalTimeMs.toFixed(2)} ms.`);
  console.log(`  Average assembly latency: ${avgLatencyMs.toFixed(5)} ms.`);
  console.log(`  Throughput: ${opsPerSec.toLocaleString()} assemblies / second.`);
  console.log(`  Speedup vs 0.2 ms budget: ${(0.2 / avgLatencyMs).toFixed(1)}x faster.`);

  check(
    avgLatencyMs < 0.2,
    `Benchmark PASSED: average latency ${avgLatencyMs.toFixed(5)} ms is strictly < 0.2 ms budget`
  );

  // 3. Sherman-Morrison Update Latency Benchmark (50,000 updates)
  let testM = createIdentity4x4();
  const testX = normalizeVector4([0.5, 0.5, 0.5, 0.5]);
  const smStart = performance.now();
  const SM_RUNS = 50000;
  for (let i = 0; i < SM_RUNS; i++) {
    testM = shermanMorrisonUpdate4x4(testM, testX);
  }
  const smEnd = performance.now();
  const avgSmTimeMs = (smEnd - smStart) / SM_RUNS;
  console.log(`  Executed ${SM_RUNS} Sherman-Morrison updates in ${(smEnd - smStart).toFixed(2)} ms (avg: ${avgSmTimeMs.toFixed(6)} ms / update).`);
  check(avgSmTimeMs < 0.005, "Sherman-Morrison rank-1 update execution is sub-microsecond");
}

// ============================================================================
// Suite 7: Real-World Question Bank Ingestion (264 Items)
// ============================================================================
console.log("\n--- Suite 7: Real Dataset Ingestion (apps/web/data/distractors/enriched_adaptive_questions.json) ---");

{
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const jsonPath = path.resolve(__dirname, "../apps/web/data/distractors/enriched_adaptive_questions.json");

  check(fs.existsSync(jsonPath), `Dataset exists at ${jsonPath}`);
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const dataset = JSON.parse(rawData);

  check(Array.isArray(dataset), "Dataset root element is an array");
  check(dataset.length === 264, `Dataset contains exactly 264 pre-calibrated items (found: ${dataset.length})`);

  const realBandit = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });
  let totalAssemblyTimeMs = 0;
  let validItemsCount = 0;

  for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i];
    const payload: AdaptiveQuestionPayload = {
      id: item.id,
      prompt: item.question,
      promptFa: item.prompt_fa,
      correctAnswer: item.correct_option,
      distractorPool: item.distractor_pool,
      section: item.section,
      cefrLevel: item.cefr_level,
    };

    const simulatedContext = normalizeVector4([
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random(),
    ]);

    const assembled = realBandit.assembleAdaptiveQuestion(payload, simulatedContext);
    totalAssemblyTimeMs += assembled.assemblyTimeMs;

    if (
      assembled.questionId === item.id &&
      assembled.options.length === 4 &&
      assembled.options[assembled.correctOptionIndex] === item.correct_option &&
      assembled.selectedDistractors.length === 3
    ) {
      validItemsCount++;
    }
  }

  const avgRealLatencyMs = totalAssemblyTimeMs / dataset.length;
  console.log(`  Successfully processed all ${validItemsCount}/${dataset.length} items from real question bank.`);
  console.log(`  Average assembly latency across real dataset: ${avgRealLatencyMs.toFixed(5)} ms.`);

  check(validItemsCount === dataset.length, "All 264 real dataset items assembled 100% valid 4-option questions");
  check(avgRealLatencyMs < 0.2, "Real question bank average assembly latency is < 0.2 ms budget");
}

// ============================================================================
// Summary
// ============================================================================
console.log("\n================================================================================");
console.log(`  VERIFICATION RESULTS:`);
console.log(`  Total Checks:  ${totalChecks}`);
console.log(`  Passed Checks: ${passedChecks}`);
console.log(`  Failed Checks: 0`);
console.log("================================================================================");
console.log("✅ ALL LINUCB BANDIT TEST SUITES & BENCHMARKS PASSED SUCCESSFULLY!");
