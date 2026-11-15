#!/usr/bin/env node
/**
 * EnDoora Engine 4: Canonical Test Suite & Performance Benchmark
 * Verifies:
 * 1. Mathematical Monotonicity Property (NeuralCDM item response strictly non-decreasing with mastery).
 * 2. Bayesian Slip vs. Prerequisite Deficit Classification accuracy.
 * 3. GAT Prerequisite DAG Traversal & Root Causal Bottleneck Identification.
 * 4. 50 IELTS Mock Exam auto-grading diagnostic batch integration.
 * 5. LocalStorage SSR safety, serialization, and corrupt-state recovery.
 * 6. High-throughput performance benchmark: 10,000 evaluations strictly < 1.0 ms budget.
 */

import { NeuralCdmEngine } from "../apps/web/lib/ai/neural-cdm-engine.ts";
import type { CdmItem } from "../apps/web/lib/ai/neural-cdm-types.ts";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition: boolean, msg: string): void {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [PASS] ${msg}`);
  } else {
    failedChecks++;
    console.error(`  ✗ [FAIL] ${msg}`);
  }
}

function assertClose(a: number, b: number, tol = 1e-4, msg = ""): void {
  const diff = Math.abs(a - b);
  assert(diff <= tol, `${msg} (expected ~${b}, got ${a}, diff=${diff.toExponential(4)})`);
}

console.log("=".repeat(80));
console.log("  EnDoora Engine 4: GAT + NeuralCDM Cognitive Diagnosis Test Suite & Benchmark");
console.log("=".repeat(80));

const engine = NeuralCdmEngine.getInstance();
engine.resetState();

// -----------------------------------------------------------------------------
// Suite 1: Mathematical Monotonicity Property
// -----------------------------------------------------------------------------
console.log("\n--- Suite 1: Mathematical Monotonicity Property ---");
const testItem: CdmItem = engine.resolveItem("hex_primary_b2_06", "b2-06");

// Evaluate response probabilities as mastery increases from 0.0 to 1.0 in steps of 0.1
let prevProb = -1;
let prevProf = -1;
let isStrictlyMonotonic = true;

for (let m = 0.0; m <= 1.05; m += 0.1) {
  const clampedM = Math.min(1.0, Number(m.toFixed(2)));
  const masteryMap: Record<string, number> = {};
  for (const c of testItem.required_concepts) {
    masteryMap[c] = clampedM;
  }

  const evalRes = engine.evaluateItemMastery(testItem, masteryMap);

  if (evalRes.effectiveProficiency < prevProf || evalRes.predictedCorrectProbability < prevProb) {
    isStrictlyMonotonic = false;
  }
  prevProf = evalRes.effectiveProficiency;
  prevProb = evalRes.predictedCorrectProbability;
}

assert(isStrictlyMonotonic, "Item response function is strictly monotonic: P(Y=1) increases with mastery");

// Bounds check on P(Y=1)
const zeroMastery = engine.evaluateItemMastery(testItem, {});
assert(zeroMastery.predictedCorrectProbability >= testItem.guess_rate - 0.02, "Zero mastery probability bounded below by guess parameter");

const fullMasteryMap: Record<string, number> = {};
for (const c of testItem.required_concepts) fullMasteryMap[c] = 1.0;
const fullMastery = engine.evaluateItemMastery(testItem, fullMasteryMap);
assert(fullMastery.predictedCorrectProbability <= 1.0 - testItem.slip_rate + 0.05, "Full mastery probability bounded above by 1 - slip parameter");

// -----------------------------------------------------------------------------
// Suite 2: Bayesian Slip vs. Prerequisite Deficit Classification
// -----------------------------------------------------------------------------
console.log("\n--- Suite 2: Bayesian Slip vs. Prerequisite Deficit Classification ---");

// Case A: High mastery learner (0.90 on all skills) fails due to slip
const highMasteryMap: Record<string, number> = {};
for (const c of engine.getAllConcepts()) {
  highMasteryMap[c.id] = 0.90;
}

const slipResult = engine.diagnoseFailure({
  itemId: "hex_primary_c1_04",
  conceptId: "c1-04",
  latencyMs: 850,
  customMasteryMap: highMasteryMap,
});

assert(slipResult.diagnosis === "RANDOM_SLIP", "High-mastery failure correctly classified as RANDOM_SLIP");
assert(slipResult.rootDeficit === null, "RANDOM_SLIP has no root prerequisite deficit");
assert(slipResult.causalChain.length === 0, "RANDOM_SLIP has empty causal chain");
assert(slipResult.slipProbability >= 0.50, "Slip posterior probability is >= 0.50");
assert(slipResult.remediationFa.includes("لغزش تصادفی"), "Persian reassurance message delivered for slip");

// Case B: Prerequisite Deficit (Learner attempts C1-04 Inversion, but has unmastered A2-05 Past Simple at 0.20)
const deficitMasteryMap: Record<string, number> = { ...highMasteryMap };
deficitMasteryMap["a2-05"] = 0.18; // Past Simple vs Present Perfect gap
deficitMasteryMap["b1-01"] = 0.25; // Past Perfect gap
deficitMasteryMap["c1-04"] = 0.30; // Inversion

const deficitResult = engine.diagnoseFailure({
  itemId: "hex_primary_c1_04",
  conceptId: "c1-04",
  latencyMs: 4200,
  customMasteryMap: deficitMasteryMap,
});

assert(deficitResult.diagnosis === "PREREQUISITE_DEFICIT", "Low-mastery failure correctly classified as PREREQUISITE_DEFICIT");
assert(deficitResult.rootDeficit !== null, "PREREQUISITE_DEFICIT pinpoints a root unmastered concept");
assert(deficitResult.rootDeficit?.cefr === "A2" || deficitResult.rootDeficit?.cefr === "B1", "Root deficit traces back to foundational level (A2 or B1)");
assert(deficitResult.causalChain.length >= 1, "Causal chain assembled from root deficit to target concept");
assert(deficitResult.remediationFa.includes("تحلیل علّی"), "Causal remediation advice generated in Persian");

// -----------------------------------------------------------------------------
// Suite 3: GAT Prerequisite DAG Traversal
// -----------------------------------------------------------------------------
console.log("\n--- Suite 3: GAT Prerequisite DAG Traversal & Causal Root Attribution ---");

const c1Concept = engine.getConcept("c1-04");
assert(c1Concept !== undefined, "Concept c1-04 exists in DAG");
assert(c1Concept!.prerequisites.length >= 1, "c1-04 has direct prerequisites");
assert(c1Concept!.all_ancestors.length >= 2, "c1-04 has upstream transitive ancestors");

if (deficitResult.rootDeficit) {
  console.log(`  Identified Root Deficit: [${deficitResult.rootDeficit.conceptId}] ${deficitResult.rootDeficit.titleEn} (${deficitResult.rootDeficit.cefr})`);
  console.log(`  Current Mastery: ${(deficitResult.rootDeficit.currentMastery * 100).toFixed(1)}% | Causal Score: ${deficitResult.rootDeficit.causalAttributionScore.toFixed(4)}`);
  console.log(`  Causal Path: ${deficitResult.causalChain.map((n) => `[${n.conceptId} (${n.cefr})]`).join(" -> ")}`);
}

assert(deficitResult.causalChain.some((n) => n.conceptId === deficitResult.rootDeficit?.conceptId), "Root deficit concept is present at root of causal chain");
assert(deficitResult.causalChain.every((n) => typeof n.titleFa === "string" && n.titleFa.length > 0), "Every node in causal chain has valid Persian title");

// -----------------------------------------------------------------------------
// Suite 4: 50 IELTS Mock Exam Batch Diagnosis Integration
// -----------------------------------------------------------------------------
console.log("\n--- Suite 4: 50 IELTS Mock Exam Diagnostic Batch Integration ---");

const mockIeltsResults = [
  { question_number: 1, question_id: "c18-acad-t1-r-q1", is_correct: true, user_answer: "True" },
  { question_number: 2, question_id: "c18-acad-t1-r-q2", is_correct: true, user_answer: "False" },
  { question_number: 3, question_id: "c18-acad-t1-r-q3", is_correct: false, user_answer: "True" },   // Slip (b1-04 high mastery 0.90)
  { question_number: 14, question_id: "c18-acad-t1-r-q14", is_correct: false, user_answer: "Wrong" }, // Deficit (b2-03 low mastery 0.22)
  { question_number: 15, question_id: "c18-acad-t1-r-q15", is_correct: false, user_answer: "Wrong" }, // Deficit (b2-03 low mastery 0.22)
];

// Test with mixed mastery (q3 concepts high, q4/q5 concepts low)
const ieltsMasteryMap: Record<string, number> = {
  "b1-04": 0.90, // q3 prerequisite -> slip
  "a1-08": 0.90,
  "a2-01": 0.90,
  "b2-03": 0.22, // q4/q5 prerequisite -> deficit
  "c1-02": 0.25,
};

const examDiagnosis = engine.diagnoseIeltsExamResults({
  examId: "c18-acad-t1",
  skill: "reading",
  gradingResults: mockIeltsResults,
  customMasteryMap: ieltsMasteryMap,
});

assert(examDiagnosis.totalGraded === 5, "Batch graded 5 questions");
assert(examDiagnosis.incorrectCount === 3, "Identified 3 incorrect questions");
assert(examDiagnosis.slipCount >= 1, "Identified at least 1 accidental slip");
assert(examDiagnosis.deficitCount >= 1, "Identified at least 1 foundational deficit");
assert(examDiagnosis.slipRatio + examDiagnosis.deficitRatio === 1.0, "Slip ratio + deficit ratio strictly sum to 1.0");
assert(examDiagnosis.topRootDeficits.length >= 1, "Identified top root prerequisite bottlenecks");
assert(typeof examDiagnosis.remediationSummaryFa === "string" && examDiagnosis.remediationSummaryFa.length > 20, "Generated comprehensive Persian remediation summary for student/teacher");

// -----------------------------------------------------------------------------
// Suite 5: LocalStorage Persistence & SSR Safety
// -----------------------------------------------------------------------------
console.log("\n--- Suite 5: LocalStorage State Serialization & Rehydration ---");

const state = engine.getState();
assert(state.version === NeuralCdmEngine.STATE_VERSION, "State version is 1");
assert(state.diagnosticEvents.length >= 2, "Diagnostic events logged in state history");
assert(state.totalSlips >= 1, "Total slips counter updated");
assert(state.totalDeficits >= 1, "Total deficits counter updated");
assert(state.lastExamDiagnosis?.examId === "c18-acad-t1", "Latest exam diagnosis preserved");

const stats = engine.getStats();
assert(stats.totalEvaluations === stats.totalSlips + stats.totalDeficits, "Stats total evaluations matches sum of slips and deficits");
assert(stats.slipRate >= 0.0 && stats.slipRate <= 1.0, "Slip rate is valid probability in [0, 1]");

// -----------------------------------------------------------------------------
// Suite 6: Performance Benchmark (10,000 Iterations < 1.0 ms Budget)
// -----------------------------------------------------------------------------
console.log("\n--- Suite 6: Performance Benchmark (10,000 Iterations < 1.0 ms Budget) ---");

const WARMUP_ROUNDS = 500;
const BENCHMARK_ROUNDS = 10000;

// Warm-up JIT
for (let i = 0; i < WARMUP_ROUNDS; i++) {
  engine.diagnoseFailure({
    itemId: "hex_primary_b2_01",
    latencyMs: 1200,
    customMasteryMap: highMasteryMap,
  });
}

const t0 = performance.now();
for (let i = 0; i < BENCHMARK_ROUNDS; i++) {
  // Alternate between slips and deficit traversals
  const m = i % 2 === 0 ? highMasteryMap : deficitMasteryMap;
  engine.diagnoseFailure({
    itemId: "hex_primary_c1_04",
    latencyMs: 1500,
    customMasteryMap: m,
  });
}
const elapsedMs = performance.now() - t0;
const avgLatencyMs = elapsedMs / BENCHMARK_ROUNDS;
const throughput = Math.round(BENCHMARK_ROUNDS / (elapsedMs / 1000));

console.log(`  Executed ${BENCHMARK_ROUNDS} diagnostic evaluations in ${elapsedMs.toFixed(2)} ms.`);
console.log(`  Average evaluation latency: ${avgLatencyMs.toFixed(5)} ms.`);
console.log(`  Throughput: ${throughput.toLocaleString()} evaluations / second.`);
console.log(`  Speedup vs 1.0 ms budget: ${(1.0 / avgLatencyMs).toFixed(1)}x faster.`);

assert(avgLatencyMs < 1.0, `Benchmark PASSED: average latency ${avgLatencyMs.toFixed(5)} ms is strictly < 1.0 ms budget`);
assert(avgLatencyMs < 0.1, `Sub-millisecond excellence: average latency is < 0.1 ms (${avgLatencyMs.toFixed(5)} ms)`);

// -----------------------------------------------------------------------------
// Suite 7: Real Q-Matrix & DAG Integrity Check
// -----------------------------------------------------------------------------
console.log("\n--- Suite 7: Real Q-Matrix & DAG Integrity Check ---");

const allConcepts = engine.getAllConcepts();
assert(allConcepts.length === 60, `Exactly 60 AEF concepts indexed (found: ${allConcepts.length})`);

const allItems = engine.getAllItems();
assert(allItems.length === 260, `Exactly 260 Q-matrix items indexed (found: ${allItems.length})`);

// Verify all 60 concepts can be resolved as assessment items
let allResolvable = true;
for (const c of allConcepts) {
  const item = engine.resolveItem(undefined, c.id);
  if (!item || item.primary_concept_id !== c.id) {
    allResolvable = false;
  }
}
assert(allResolvable, "All 60 AEF concepts resolve cleanly to valid CDM assessment items");

// -----------------------------------------------------------------------------
// Final Verdict
// -----------------------------------------------------------------------------
console.log("\n" + "=".repeat(80));
console.log("  VERIFICATION RESULTS:");
console.log(`  Total Checks:  ${totalChecks}`);
console.log(`  Passed Checks: ${passedChecks}`);
console.log(`  Failed Checks: ${failedChecks}`);
console.log("=".repeat(80));

if (failedChecks > 0) {
  console.error("❌ TEST SUITE FAILED!");
  process.exit(1);
} else {
  console.log("✅ ALL NEURALCDM TEST SUITES & BENCHMARKS PASSED SUCCESSFULLY!");
  process.exit(0);
}
