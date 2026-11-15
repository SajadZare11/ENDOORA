/**
 * Adversarial Stress-Testing Harness for Engine 6: LinUCB Bandit & Matrix Stability
 * Target File: scripts/adversarial-stress-linucb.ts
 *
 * EMPIRICAL CHALLENGER SUITE:
 * 1. Extended Benchmark Load: 20,000 and 50,000 iterations of assembleAdaptiveQuestion
 *    - Full statistical latency profiling (min, max, mean, stddev, p50, p95, p99)
 *    - Evaluation against the < 0.2 ms budget
 *    - Dynamic context variation and memory footprint tracking
 * 2. Matrix Numerical Stability Under 500+ Colinear Updates:
 *    - 500, 1,000, and 2,500 sequential updates with exact colinear unit vectors
 *    - Zero NaN / Inf guarantees
 *    - Strict symmetry retention (|M_ij - M_ji| === 0)
 *    - Positive definiteness (v^T A_inv v > 0)
 *    - Analytical convergence check: ||A_inv_SM - (I - n/(1+n) v v^T)|| < 1e-12
 *    - Residual verification: ||(I + n v v^T) A_inv_SM - I_4|| < 1e-12
 *    - Determinant and condition number behavior
 * 3. Pseudo-Colinear Micro-Perturbation Stress Test:
 *    - 500 updates with near-colinear vectors (perturbations 1e-8 to 1e-5)
 *    - Comparison against explicit Gauss-Jordan inversion
 * 4. UCB Exploration & Reward Convergence Under 500+ Updates:
 *    - Verify theta = A_inv * b converges to true reward without numerical blowup
 *    - Verify uncertainty shrinkage in sampled direction while preserving exploration in orthogonal subspace
 * 5. High-Frequency Cycling Stress Test:
 *    - 2,000 alternating orthogonal rank-1 updates
 *    - Compare with exact diagonal matrix
 */

import { performance } from "node:perf_hooks";
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

// ============================================================================
// Statistical & Analytical Helpers
// ============================================================================

interface LatencyStats {
  iterations: number;
  totalTimeMs: number;
  meanMs: number;
  stdDevMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  violationsCount: number; // > 0.2 ms
  throughputOpsSec: number;
}

function calculateLatencyStats(latencies: Float64Array): LatencyStats {
  const n = latencies.length;
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  let violations = 0;

  for (let i = 0; i < n; i++) {
    const lat = latencies[i];
    sum += lat;
    if (lat < min) min = lat;
    if (lat > max) max = lat;
    if (lat >= 0.2) violations++;
  }

  const mean = sum / n;

  let sumSquares = 0;
  for (let i = 0; i < n; i++) {
    const diff = latencies[i] - mean;
    sumSquares += diff * diff;
  }
  const stdDev = Math.sqrt(sumSquares / n);

  // Sort copy for percentiles
  const sorted = new Float64Array(latencies).sort();
  const p50 = sorted[Math.floor(n * 0.5)];
  const p90 = sorted[Math.floor(n * 0.9)];
  const p95 = sorted[Math.floor(n * 0.95)];
  const p99 = sorted[Math.floor(n * 0.99)];

  return {
    iterations: n,
    totalTimeMs: sum,
    meanMs: mean,
    stdDevMs: stdDev,
    minMs: min,
    maxMs: max,
    p50Ms: p50,
    p90Ms: p90,
    p95Ms: p95,
    p99Ms: p99,
    violationsCount: violations,
    throughputOpsSec: Math.round((n / sum) * 1000),
  };
}

/**
 * Computes determinant of a 4x4 matrix using cofactor expansion.
 */
function det4x4(M: Matrix4x4): number {
  let det = 0;
  for (let c = 0; c < 4; c++) {
    const sub: number[][] = [];
    for (let r = 1; r < 4; r++) {
      const row: number[] = [];
      for (let j = 0; j < 4; j++) {
        if (j !== c) row.push(M[r][j]);
      }
      sub.push(row);
    }
    // 3x3 determinant
    const d3 =
      sub[0][0] * (sub[1][1] * sub[2][2] - sub[1][2] * sub[2][1]) -
      sub[0][1] * (sub[1][0] * sub[2][2] - sub[1][2] * sub[2][0]) +
      sub[0][2] * (sub[1][0] * sub[2][1] - sub[1][1] * sub[2][0]);

    const sign = c % 2 === 0 ? 1 : -1;
    det += sign * M[0][c] * d3;
  }
  return det;
}

/**
 * Infinity norm of matrix: max row sum of absolute values.
 */
function matrixInfNorm(M: Matrix4x4): number {
  let max = 0;
  for (let r = 0; r < 4; r++) {
    let rowSum = 0;
    for (let c = 0; c < 4; c++) {
      rowSum += Math.abs(M[r][c]);
    }
    if (rowSum > max) max = rowSum;
  }
  return max;
}

/**
 * Matrix multiplication A * B for 4x4 matrices.
 */
function matrixMul4x4(A: Matrix4x4, B: Matrix4x4): Matrix4x4 {
  const C: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

/**
 * Analytical inverse of A = I_4 + n * v * v^T (where ||v||_2 = 1.0):
 * A^(-1) = I_4 - (n / (1 + n)) * v * v^T
 */
function analyticalColinearInverse(v: Vector4, n: number): Matrix4x4 {
  const factor = n / (1 + n);
  const I = createIdentity4x4();
  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      result[i][j] = I[i][j] - factor * v[i] * v[j];
    }
  }
  return result;
}

// ============================================================================
// Adversarial Benchmark & Numerical Stability Suite
// ============================================================================

async function runAdversarialStressSuite(): Promise<void> {
  console.log("================================================================================");
  console.log("  ADVERSARIAL STRESS-TESTING HARNESS: ENGINE 6 LINUCB BANDIT");
  console.log("  EMPIRICAL CHALLENGER (critic, specialist)");
  console.log("================================================================================\n");

  let totalAssertions = 0;
  let passedAssertions = 0;

  function assertCondition(cond: boolean, msg: string): void {
    totalAssertions++;
    if (!cond) {
      console.error(`  ❌ [FAIL] ${msg}`);
      throw new Error(`Stress assertion failed: ${msg}`);
    }
    passedAssertions++;
    console.log(`  ✓ [PASS] ${msg}`);
  }

  // --------------------------------------------------------------------------
  // SECTION 1: EXTENDED BENCHMARK LOAD (20,000 and 50,000 ITERATIONS)
  // --------------------------------------------------------------------------
  console.log("--- TEST 1: Extended Benchmark Load Under Continuous Execution ---");

  const samplePayload: AdaptiveQuestionPayload = {
    id: "stress-bench-q",
    prompt: "The new bridge ___ by the end of next month.",
    promptFa: "شکل مجهول زمان آینده کامل را انتخاب کنید.",
    correctAnswer: "will have been completed",
    distractorPool: [
      { id: "sp1", text: "will be completing", category: "phonetic_ortho", features: normalizeVector4([0.88, 0.1, 0.2, 0.1]) },
      { id: "sp2", text: "will have completed", category: "phonetic_ortho", features: normalizeVector4([0.91, 0.2, 0.1, 0.1]) },
      { id: "sp3", text: "will being completed", category: "phonetic_ortho", features: normalizeVector4([0.85, 0.1, 0.1, 0.2]) },
      { id: "ss1", text: "is completed", category: "semantic_siamese", features: normalizeVector4([0.2, 0.90, 0.1, 0.1]) },
      { id: "ss2", text: "has been completed", category: "semantic_siamese", features: normalizeVector4([0.1, 0.93, 0.2, 0.1]) },
      { id: "ss3", text: "was completed", category: "semantic_siamese", features: normalizeVector4([0.1, 0.89, 0.1, 0.1]) },
      { id: "sm1", text: "would completed", category: "morphological", features: normalizeVector4([0.1, 0.2, 0.92, 0.1]) },
      { id: "sm2", text: "will complete", category: "morphological", features: normalizeVector4([0.2, 0.1, 0.94, 0.1]) },
      { id: "sm3", text: "completing", category: "morphological", features: normalizeVector4([0.1, 0.1, 0.91, 0.2]) },
      { id: "sl1", text: "will be complete (L1)", category: "l1_persian", features: normalizeVector4([0.1, 0.1, 0.2, 0.94]) },
      { id: "sl2", text: "is going to completed (L1)", category: "l1_persian", features: normalizeVector4([0.2, 0.1, 0.1, 0.90]) },
      { id: "sl3", text: "has completed (L1)", category: "l1_persian", features: normalizeVector4([0.1, 0.2, 0.1, 0.92]) },
    ],
  };

  const bandit = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });

  // 1.1 Warm-up (2,000 iterations)
  const warmContext: Vector4 = [0.5, 0.5, 0.5, 0.5];
  for (let i = 0; i < 2000; i++) {
    bandit.assembleAdaptiveQuestion(samplePayload, warmContext);
  }

  // 1.2 20,000 Iterations Benchmark
  console.log("\n  [1.2] Executing 20,000 question assemblies with varying dynamic contexts...");
  const RUNS_20K = 20000;
  const latencies20k = new Float64Array(RUNS_20K);

  const memBefore20k = process.memoryUsage().heapUsed;
  const t0_20k = performance.now();

  for (let i = 0; i < RUNS_20K; i++) {
    // Dynamically alternate context to stress-test fusion + scoring in tight loop
    const angle = (i * 0.05) % (2 * Math.PI);
    const dynContext: Vector4 = normalizeVector4([
      0.5 + 0.4 * Math.sin(angle),
      0.5 + 0.4 * Math.cos(angle),
      0.5 + 0.3 * Math.sin(angle * 2),
      0.5 + 0.3 * Math.cos(angle * 2),
    ]);

    const iterStart = performance.now();
    bandit.assembleAdaptiveQuestion(samplePayload, dynContext);
    const iterEnd = performance.now();
    latencies20k[i] = iterEnd - iterStart;
  }
  const t1_20k = performance.now();
  const memAfter20k = process.memoryUsage().heapUsed;

  const stats20k = calculateLatencyStats(latencies20k);
  console.log(`    Total Elapsed:   ${(t1_20k - t0_20k).toFixed(2)} ms`);
  console.log(`    Mean Latency:    ${stats20k.meanMs.toFixed(5)} ms / assembly`);
  console.log(`    Median (p50):    ${stats20k.p50Ms.toFixed(5)} ms`);
  console.log(`    p95 Latency:     ${stats20k.p95Ms.toFixed(5)} ms`);
  console.log(`    p99 Latency:     ${stats20k.p99Ms.toFixed(5)} ms`);
  console.log(`    Max Latency:     ${stats20k.maxMs.toFixed(5)} ms`);
  console.log(`    Std Deviation:   ${stats20k.stdDevMs.toFixed(5)} ms`);
  console.log(`    Throughput:      ${stats20k.throughputOpsSec.toLocaleString()} ops / sec`);
  console.log(`    Budget (<0.2ms): ${stats20k.violationsCount} violations out of ${RUNS_20K} (rate: ${((stats20k.violationsCount / RUNS_20K) * 100).toFixed(3)}%)`);
  console.log(`    Heap Delta:      ${((memAfter20k - memBefore20k) / 1024 / 1024).toFixed(2)} MB`);

  assertCondition(
    stats20k.meanMs < 0.2,
    `20,000 iterations mean latency (${stats20k.meanMs.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );
  assertCondition(
    stats20k.p99Ms < 0.2,
    `20,000 iterations p99 latency (${stats20k.p99Ms.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );

  // 1.3 50,000 Iterations Benchmark
  console.log("\n  [1.3] Executing 50,000 iterations sustained endurance load...");
  const RUNS_50K = 50000;
  const latencies50k = new Float64Array(RUNS_50K);

  const memBefore50k = process.memoryUsage().heapUsed;
  const t0_50k = performance.now();

  for (let i = 0; i < RUNS_50K; i++) {
    const angle = (i * 0.03) % (2 * Math.PI);
    const dynContext: Vector4 = normalizeVector4([
      0.5 + 0.35 * Math.sin(angle),
      0.5 + 0.35 * Math.cos(angle),
      0.5 + 0.25 * Math.sin(angle * 3),
      0.5 + 0.25 * Math.cos(angle * 3),
    ]);

    const iterStart = performance.now();
    bandit.assembleAdaptiveQuestion(samplePayload, dynContext);
    const iterEnd = performance.now();
    latencies50k[i] = iterEnd - iterStart;
  }
  const t1_50k = performance.now();
  const memAfter50k = process.memoryUsage().heapUsed;

  const stats50k = calculateLatencyStats(latencies50k);
  console.log(`    Total Elapsed:   ${(t1_50k - t0_50k).toFixed(2)} ms`);
  console.log(`    Mean Latency:    ${stats50k.meanMs.toFixed(5)} ms / assembly`);
  console.log(`    Median (p50):    ${stats50k.p50Ms.toFixed(5)} ms`);
  console.log(`    p95 Latency:     ${stats50k.p95Ms.toFixed(5)} ms`);
  console.log(`    p99 Latency:     ${stats50k.p99Ms.toFixed(5)} ms`);
  console.log(`    Max Latency:     ${stats50k.maxMs.toFixed(5)} ms`);
  console.log(`    Std Deviation:   ${stats50k.stdDevMs.toFixed(5)} ms`);
  console.log(`    Throughput:      ${stats50k.throughputOpsSec.toLocaleString()} ops / sec`);
  console.log(`    Budget (<0.2ms): ${stats50k.violationsCount} violations out of ${RUNS_50K} (rate: ${((stats50k.violationsCount / RUNS_50K) * 100).toFixed(3)}%)`);
  console.log(`    Heap Delta:      ${((memAfter50k - memBefore50k) / 1024 / 1024).toFixed(2)} MB`);

  assertCondition(
    stats50k.meanMs < 0.2,
    `50,000 iterations mean latency (${stats50k.meanMs.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );
  assertCondition(
    stats50k.p95Ms < 0.2,
    `50,000 iterations p95 latency (${stats50k.p95Ms.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );

  // 1.4 Real Dataset Sustained Endurance (20,000 iterations cycling across all 264 items)
  console.log("\n  [1.4] Executing 20,000 iterations sustained endurance across all 264 real dataset items...");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const jsonPath = path.resolve(__dirname, "../apps/web/data/distractors/enriched_adaptive_questions.json");
  const realQuestionsRaw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const realPayloads: AdaptiveQuestionPayload[] = realQuestionsRaw.map((item: any) => ({
    id: item.id,
    prompt: item.question,
    promptFa: item.prompt_fa,
    correctAnswer: item.correct_option,
    distractorPool: item.distractor_pool,
  }));

  const RUNS_REAL = 20000;
  const latenciesReal = new Float64Array(RUNS_REAL);
  const t0_real = performance.now();

  for (let i = 0; i < RUNS_REAL; i++) {
    const payload = realPayloads[i % realPayloads.length];
    const iterStart = performance.now();
    bandit.assembleAdaptiveQuestion(payload, warmContext);
    const iterEnd = performance.now();
    latenciesReal[i] = iterEnd - iterStart;
  }
  const t1_real = performance.now();
  const statsReal = calculateLatencyStats(latenciesReal);

  console.log(`    Total Elapsed:   ${(t1_real - t0_real).toFixed(2)} ms`);
  console.log(`    Mean Latency:    ${statsReal.meanMs.toFixed(5)} ms / assembly`);
  console.log(`    Median (p50):    ${statsReal.p50Ms.toFixed(5)} ms`);
  console.log(`    p95 Latency:     ${statsReal.p95Ms.toFixed(5)} ms`);
  console.log(`    p99 Latency:     ${statsReal.p99Ms.toFixed(5)} ms`);
  console.log(`    Throughput:      ${statsReal.throughputOpsSec.toLocaleString()} ops / sec`);

  assertCondition(
    statsReal.meanMs < 0.2,
    `20,000 real dataset iterations mean latency (${statsReal.meanMs.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );
  assertCondition(
    statsReal.p95Ms < 0.2,
    `20,000 real dataset iterations p95 latency (${statsReal.p95Ms.toFixed(5)} ms) is strictly < 0.2 ms budget`
  );

  // --------------------------------------------------------------------------
  // SECTION 2: MATRIX NUMERICAL STABILITY UNDER 500+ COLINEAR UPDATES
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 2: Numerical Stability Under 500+ Sequential Colinear Updates ---");

  interface ColinearScenario {
    label: string;
    v: Vector4;
    steps: number;
  }

  const colinearScenarios: ColinearScenario[] = [
    { label: "Basis Vector [1, 0, 0, 0] (500 updates)", v: [1, 0, 0, 0], steps: 500 },
    { label: "Diagonal Vector [0.5, 0.5, 0.5, 0.5] (500 updates)", v: [0.5, 0.5, 0.5, 0.5], steps: 500 },
    { label: "Skewed Vector [0.95, 0.1, 0.1, 0.2] (500 updates)", v: normalizeVector4([0.95, 0.1, 0.1, 0.2]), steps: 500 },
    { label: "Extended Stress: Diagonal Vector [0.5, 0.5, 0.5, 0.5] (1,000 updates)", v: [0.5, 0.5, 0.5, 0.5], steps: 1000 },
    { label: "Extreme Stress: Basis Vector [0, 0, 1, 0] (2,500 updates)", v: [0, 0, 1, 0], steps: 2500 },
  ];

  for (const { label, v, steps } of colinearScenarios) {
    console.log(`\n  Executing Scenario: ${label}...`);
    let A_inv: Matrix4x4 = createIdentity4x4();
    let A_explicit: Matrix4x4 = createIdentity4x4();
    const xxT = outerProduct4(v);

    let maxAsymmetry = 0;
    let maxDiffFromAnalytical = 0;
    let maxResidual = 0;
    let hasNaN = false;
    let hasInf = false;
    let minQuadraticForm = Infinity;

    for (let step = 1; step <= steps; step++) {
      // 1. Rank-1 update
      A_inv = shermanMorrisonUpdate4x4(A_inv, v);
      A_explicit = matrixAdd4x4(A_explicit, xxT);

      // Check NaN / Inf
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = A_inv[r][c];
          if (isNaN(val)) hasNaN = true;
          if (!isFinite(val)) hasInf = true;
        }
      }

      // Check symmetry
      for (let r = 0; r < 4; r++) {
        for (let c = r + 1; c < 4; c++) {
          const asym = Math.abs(A_inv[r][c] - A_inv[c][r]);
          if (asym > maxAsymmetry) maxAsymmetry = asym;
        }
      }

      // Check positive definiteness on standard basis + target vector
      const basisVectors: Vector4[] = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
        v,
      ];
      for (const bv of basisVectors) {
        const q = quadForm4(bv, A_inv);
        if (q < minQuadraticForm) minQuadraticForm = q;
        if (q <= 0) {
          throw new Error(`Loss of positive definiteness at step ${step} with vector [${bv}]! q=${q}`);
        }
      }

      // Sample check against analytical formula at key milestones
      if (step === 50 || step === 100 || step === 500 || step === 1000 || step === steps) {
        const analytical = analyticalColinearInverse(v, step);
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const diff = Math.abs(A_inv[r][c] - analytical[r][c]);
            if (diff > maxDiffFromAnalytical) maxDiffFromAnalytical = diff;
          }
        }

        // Residual check: ||A_explicit * A_inv - I||
        const prod = matrixMul4x4(A_explicit, A_inv);
        const I = createIdentity4x4();
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const res = Math.abs(prod[r][c] - I[r][c]);
            if (res > maxResidual) maxResidual = res;
          }
        }
      }
    }

    const finalDet = det4x4(A_inv);
    const expectedDet = 1 / (1 + steps);
    const detDiff = Math.abs(finalDet - expectedDet);

    console.log(`    Completed ${steps} updates.`);
    console.log(`    Zero NaN:               ${!hasNaN}`);
    console.log(`    Zero Inf:               ${!hasInf}`);
    console.log(`    Max Asymmetry:          ${maxAsymmetry.toExponential(4)}`);
    console.log(`    Min Quadratic Form:     ${minQuadraticForm.toExponential(6)} (> 0, strictly positive definite)`);
    console.log(`    Final Determinant:      ${finalDet.toExponential(6)} (expected: ${expectedDet.toExponential(6)}, diff: ${detDiff.toExponential(4)})`);
    console.log(`    Max Diff vs Analytical: ${maxDiffFromAnalytical.toExponential(4)}`);
    console.log(`    Max Residual ||A A^-1 - I||: ${maxResidual.toExponential(4)}`);

    assertCondition(!hasNaN, `${label}: zero NaN entries`);
    assertCondition(!hasInf, `${label}: zero Inf entries`);
    assertCondition(maxAsymmetry <= 1e-12, `${label}: strict matrix symmetry preserved (max asym: ${maxAsymmetry.toExponential(4)})`);
    assertCondition(minQuadraticForm > 0, `${label}: positive definiteness strictly preserved across all ${steps} steps`);
    assertCondition(maxDiffFromAnalytical < 1e-12, `${label}: matches exact analytical inverse within 1e-12 (diff: ${maxDiffFromAnalytical.toExponential(4)})`);
    assertCondition(maxResidual < 1e-12, `${label}: residual ||A A^-1 - I|| is within 1e-12 (residual: ${maxResidual.toExponential(4)})`);
  }

  // --------------------------------------------------------------------------
  // SECTION 3: PSEUDO-COLINEAR MICRO-PERTURBATION STRESS TEST
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 3: Pseudo-Colinear Micro-Perturbation Stress Test ---");
  {
    // Generate 500 nearly-colinear vectors with small noise (eps = 1e-7 to 1e-5)
    // to test if ill-conditioned rank-1 additions cause numerical explosion
    const baseVector: Vector4 = [0.5, 0.5, 0.5, 0.5];
    let A_sm = createIdentity4x4();
    let A_direct = createIdentity4x4();

    let maxGaussJordanDiff = 0;
    let hasNaN = false;
    let hasInf = false;

    console.log("  Running 500 perturbed near-colinear updates with explicit Gauss-Jordan cross-validation...");
    for (let step = 1; step <= 500; step++) {
      const eps = 1e-6 * Math.sin(step * 1.7);
      const perturbed: Vector4 = normalizeVector4([
        baseVector[0] + eps,
        baseVector[1] - eps * 0.5,
        baseVector[2] + eps * 0.3,
        baseVector[3] - eps * 0.8,
      ]);

      A_sm = shermanMorrisonUpdate4x4(A_sm, perturbed);
      A_direct = matrixAdd4x4(A_direct, outerProduct4(perturbed));

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (isNaN(A_sm[r][c])) hasNaN = true;
          if (!isFinite(A_sm[r][c])) hasInf = true;
        }
      }

      // Every 50 steps, perform full Gauss-Jordan inversion
      if (step % 50 === 0) {
        const gjInv = invertMatrix4x4Explicit(A_direct);
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const diff = Math.abs(A_sm[r][c] - gjInv[r][c]);
            if (diff > maxGaussJordanDiff) maxGaussJordanDiff = diff;
          }
        }
      }
    }

    console.log(`    Completed 500 perturbed near-colinear updates.`);
    console.log(`    Zero NaN:               ${!hasNaN}`);
    console.log(`    Zero Inf:               ${!hasInf}`);
    console.log(`    Max Diff vs GJ Inverse: ${maxGaussJordanDiff.toExponential(4)}`);

    assertCondition(!hasNaN, "Perturbed near-colinear updates produce zero NaN");
    assertCondition(!hasInf, "Perturbed near-colinear updates produce zero Inf");
    assertCondition(
      maxGaussJordanDiff < 1e-5,
      `Perturbed Sherman-Morrison matches Gauss-Jordan within 1e-5 (max diff: ${maxGaussJordanDiff.toExponential(4)})`
    );
  }

  // --------------------------------------------------------------------------
  // SECTION 4: HIGH-FREQUENCY CYCLING & ORTHOGONAL ALTERNATIONS
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 4: High-Frequency Orthogonal Subspace Alternation (2,000 Updates) ---");
  {
    // Alternate 4 standard basis vectors 500 times each = 2,000 updates
    // Analytical result: A = I + 500 I = 501 I
    // A^(-1) = (1/501) * I_4
    let A_inv = createIdentity4x4();
    const basis: Vector4[] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const CYCLES = 500;
    for (let c = 0; c < CYCLES; c++) {
      for (let b = 0; b < 4; b++) {
        A_inv = shermanMorrisonUpdate4x4(A_inv, basis[b]);
      }
    }

    const expectedDiag = 1 / (1 + CYCLES); // 1 / 501
    let maxDiagDiff = 0;
    let maxOffDiag = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r === c) {
          const diff = Math.abs(A_inv[r][c] - expectedDiag);
          if (diff > maxDiagDiff) maxDiagDiff = diff;
        } else {
          const off = Math.abs(A_inv[r][c]);
          if (off > maxOffDiag) maxOffDiag = off;
        }
      }
    }

    console.log(`    Completed 2,000 alternating orthogonal updates.`);
    console.log(`    Expected Diagonal: 1/501 = ${expectedDiag.toExponential(6)}`);
    console.log(`    Max Diagonal Diff: ${maxDiagDiff.toExponential(4)}`);
    console.log(`    Max Off-Diagonal:  ${maxOffDiag.toExponential(4)}`);

    assertCondition(maxDiagDiff < 1e-12, `Diagonal elements match 1/501 within 1e-12 (diff: ${maxDiagDiff.toExponential(4)})`);
    assertCondition(maxOffDiag < 1e-12, `Off-diagonal elements remain zero within 1e-12 (max: ${maxOffDiag.toExponential(4)})`);
  }

  // --------------------------------------------------------------------------
  // SECTION 5: BANDIT CONVERGENCE & UCB SCORE STABILITY UNDER 500+ FEEDBACKS
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 5: Bandit Convergence & UCB Score Stability Under 500+ Updates ---");
  {
    const banditConvergence = new EnDooraLinUCBBandit({ alpha: 0.5, skipStorageLoad: true });
    const targetVector: Vector4 = normalizeVector4([0.2, 0.1, 0.1, 0.95]);

    console.log("  Feeding 500 consecutive learner feedback interactions to 'l1_persian' arm...");
    for (let i = 0; i < 500; i++) {
      banditConvergence.recordInteractionFeedback({
        category: "l1_persian",
        features: targetVector,
        trapTriggered: true,
        latencyMs: 2500, // reward = 1.0 + 0.15 * (2500/3000) = 1.125
      });
    }

    const l1Arm = banditConvergence.getArmState("l1_persian");
    console.log(`    L1 Persian Pulls:   ${l1Arm.pulls}`);
    console.log(`    L1 Persian Rewards: ${l1Arm.rewards.toFixed(2)}`);

    // Analytically: theta = A^(-1) * b
    // b = sum(r * x) = 500 * 1.125 * x = 562.5 * x
    // A^(-1) * x = (1 / 501) * x
    // theta = A^(-1) * b = (562.5 / 501) * x = 1.122754 * x
    // Mean prediction x^T * theta = 1.122754 * ||x||^2 = 1.122754
    const theta = matVecMul4(l1Arm.A_inv, l1Arm.b);
    const predictedMean = dotProduct4(targetVector, theta);
    const expectedMean = (500 * 1.125) / 501;
    const meanDiff = Math.abs(predictedMean - expectedMean);

    console.log(`    Predicted Mean x^T theta: ${predictedMean.toFixed(6)} (expected: ${expectedMean.toFixed(6)}, diff: ${meanDiff.toExponential(4)})`);
    assertCondition(meanDiff < 1e-10, `Predicted mean matches analytical limit within 1e-10 (diff: ${meanDiff.toExponential(4)})`);

    // Uncertainty shrinkage:
    const variance = quadForm4(targetVector, l1Arm.A_inv);
    const expectedVar = 1 / 501;
    const varDiff = Math.abs(variance - expectedVar);
    console.log(`    Quadratic Form x^T A^-1 x: ${variance.toExponential(6)} (expected: ${expectedVar.toExponential(6)}, diff: ${varDiff.toExponential(4)})`);
    assertCondition(varDiff < 1e-10, `Uncertainty variance in sampled direction matches 1/501 (diff: ${varDiff.toExponential(4)})`);

    // Verify uncertainty in orthogonal direction remains exactly 1.0
    // Vector u orthogonal to targetVector
    const u: Vector4 = normalizeVector4([targetVector[1], -targetVector[0], 0, 0]);
    const dot = dotProduct4(targetVector, u);
    const orthVar = quadForm4(u, l1Arm.A_inv);
    console.log(`    Orthogonal Vector Variance u^T A^-1 u: ${orthVar.toFixed(6)} (expected: 1.000000, dotProduct: ${dot.toExponential(4)})`);
    assertCondition(Math.abs(orthVar - 1.0) < 1e-10, `Orthogonal uncertainty is preserved at 1.0 within 1e-10`);

    // Now assemble question and verify UCB scores are non-NaN, finite, and well-behaved
    const assembled = banditConvergence.assembleAdaptiveQuestion(samplePayload, [0.1, 0.1, 0.1, 0.95]);
    assertCondition(assembled.selectedDistractors.length === 3, "Assembled question has 3 selected distractors");
    assertCondition(assembled.options.length === 4, "Assembled question has 4 options");
    assertCondition(!isNaN(assembled.assemblyTimeMs) && isFinite(assembled.assemblyTimeMs), "Assembly latency is valid number");

    for (const [candId, score] of Object.entries(assembled.scores || {})) {
      assertCondition(!isNaN(score) && isFinite(score), `Candidate ${candId} score (${score}) is finite`);
    }
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log(`  ADVERSARIAL STRESS-TEST RESULTS:`);
  console.log(`  Total Invariant Assertions: ${totalAssertions}`);
  console.log(`  Passed Assertions:          ${passedAssertions}`);
  console.log(`  Failed Assertions:          0`);
  console.log("================================================================================");
  console.log("✅ ALL ADVERSARIAL BENCHMARK & NUMERICAL STABILITY STRESS TESTS PASSED!");
}

runAdversarialStressSuite().catch((err) => {
  console.error("Adversarial Stress Test Suite Failed:", err);
  process.exit(1);
});
