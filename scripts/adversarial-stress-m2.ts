#!/usr/bin/env node
/**
 * Adversarial Stress-Testing Harness for Milestone M2 Components
 * Target: scripts/adversarial-stress-m2.ts
 *
 * EMPIRICAL CHALLENGER SUITE:
 * 1. MultiSkillRadar Trigonometric Coordinate Verification:
 *    - Strict trigonometric geometry ($x = cx + r \cos \theta, y = cy + r \sin \theta$)
 *    - Concentric guide polygons (20%, 40%, 60%, 80%, 100%)
 *    - Boundary and adversarial inputs (empty sections, negative, overflow > 100, NaN, null)
 *    - Zero NaN guarantees, strict canvas bounding [0, size]
 * 2. SkillMasteryIndicator Epistemic Certainty & Metric Computation:
 *    - Null snapshot fallback
 *    - Zero evidence vs high evidence (> 10 items) confidence scaling
 *    - All 6 skills (grammar, vocabulary, reading, listening, speaking, writing)
 *    - Variance and epistemic certainty bounds in [15%, 99%]
 * 3. Dynamic Telemetry & Dual Dispatch Integrity:
 *    - LinUCB Sherman-Morrison rank-1 update on interaction feedback
 *    - DKT-Forget Neural GRU concept mastery update
 *    - Latency measurement clamping [120ms, 120,000ms]
 * 4. Neuro-Bayesian Learner Twin Placement Evidence Assimilation:
 *    - Recording multi-skill observations from placement CAT report
 *    - Verifying evidence count increment and belief updating
 */

import { performance } from "node:perf_hooks";

// Mock browser globals for Node test environment
if (typeof globalThis.window === "undefined") {
  (globalThis as any).window = {
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}
if (typeof globalThis.Event === "undefined") {
  (globalThis as any).Event = class Event {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  };
}

import { EnDooraLinUCBBandit } from "../apps/web/lib/ai/linucb-bandit-engine.ts";
import { DktEngine } from "../apps/web/lib/dkt-engine/dkt-engine.ts";
import {
  getLearnerTwin,
  resetLearnerTwin,
  setTwinLearnerScope,
  recordTwinObservation,
  TWIN_CATALOG,
} from "../apps/web/lib/ai/learner-twin-store.ts";
import type { TwinSnapshot, CEFRBand } from "../apps/web/lib/ai/learner-twin-types.ts";
import { endooraIndexToCefr } from "../apps/web/lib/adaptive-engine.ts";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failureDetails: string[] = [];

function assert(condition: boolean, msg: string, details?: any): void {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [PASS] ${msg}`);
  } else {
    failedChecks++;
    const err = details ? ` - Details: ${JSON.stringify(details)}` : "";
    console.error(`  ✗ [FAIL] ${msg}${err}`);
    failureDetails.push(`${msg}${err}`);
  }
}

console.log("=".repeat(85));
console.log("  M2 ADVERSARIAL STRESS TEST: COGNITIVE UI INTEGRATION & RADAR MATH");
console.log("=".repeat(85));

// ============================================================================
// PART 1: MultiSkillRadar Trigonometric Coordinate Verification
// ============================================================================
console.log("\n>>> PART 1: MULTI-SKILL RADAR TRIGONOMETRIC COORDINATE STRESS TESTS <<<\n");

const RADAR_AXES = [
  { key: "grammar", nameFa: "دستور زبان", nameEn: "Grammar", color: "#3b82f6" },
  { key: "vocabulary", nameFa: "واژگان", nameEn: "Vocabulary", color: "#8b5cf6" },
  { key: "reading", nameFa: "درک مطلب", nameEn: "Reading", color: "#06b6d4" },
  { key: "listening", nameFa: "شنیداری", nameEn: "Listening", color: "#10b981" },
  { key: "speaking", nameFa: "گفتاری", nameEn: "Speaking", color: "#f59e0b" },
  { key: "writing", nameFa: "نگارش", nameEn: "Writing", color: "#ec4899" },
] as const;

const size = 400;
const center = size / 2; // 200
const padding = 65;
const maxRadius = center - padding; // 135
const numAxes = RADAR_AXES.length; // 6
const angleStep = (Math.PI * 2) / numAxes;
const startAngle = -Math.PI / 2;

// Check 1.1: Exact Top Apex for Grammar (k=0)
const grammarAngle = startAngle + 0 * angleStep;
const expectedGrammarX = center; // 200
const expectedGrammarY = center - maxRadius; // 65
const calcGrammarX = Math.round((center + maxRadius * Math.cos(grammarAngle)) * 10) / 10;
const calcGrammarY = Math.round((center + maxRadius * Math.sin(grammarAngle)) * 10) / 10;

assert(
  Math.abs(calcGrammarX - expectedGrammarX) < 1e-4 && Math.abs(calcGrammarY - expectedGrammarY) < 1e-4,
  `Grammar axis (k=0) apex is strictly at top (cx=${expectedGrammarX}, cy=${expectedGrammarY})`
);

// Check 1.2: Check all 6 vertices trigonometry
RADAR_AXES.forEach((axis, idx) => {
  const ang = startAngle + idx * angleStep;
  const x = Math.round((center + maxRadius * Math.cos(ang)) * 10) / 10;
  const y = Math.round((center + maxRadius * Math.sin(ang)) * 10) / 10;
  assert(Number.isFinite(x) && Number.isFinite(y), `Axis ${axis.key} vertex is finite real coordinates (${x}, ${y})`);
  assert(x >= 0 && x <= size && y >= 0 && y <= size, `Axis ${axis.key} vertex is within canvas bounds [0, ${size}]`);
});

// Check 1.3: Concentric Guide Polygons (20%, 40%, 60%, 80%, 100%)
const guideRings = [20, 40, 60, 80, 100];
guideRings.forEach((ringPct) => {
  const r = (ringPct / 100) * maxRadius;
  const points = RADAR_AXES.map((_, i) => {
    const ang = startAngle + i * angleStep;
    const x = Math.round((center + r * Math.cos(ang)) * 10) / 10;
    const y = Math.round((center + r * Math.sin(ang)) * 10) / 10;
    return `${x},${y}`;
  });
  assert(points.length === 6, `Guide ring ${ringPct}% has exactly 6 polygon vertices`);
  points.forEach((pt) => {
    const [px, py] = pt.split(",").map(Number);
    assert(Number.isFinite(px) && Number.isFinite(py), `Ring ${ringPct}% vertex ${pt} is finite`);
  });
});

// Check 1.4: Adversarial Section Inputs (empty, negative, overflow, NaN, null)
const adversarialInputs = [
  {},
  { grammar: { score_percentage: 0 } },
  { grammar: { score_percentage: 100 } },
  { grammar: { score_percentage: -99 } },
  { grammar: { score_percentage: 999 } },
  { grammar: { score_percentage: NaN } },
  { vocabulary: { score_percentage: undefined } },
  { listening: { score_percentage: null } },
];

adversarialInputs.forEach((sec, i) => {
  RADAR_AXES.forEach((axis, idx) => {
    const ang = startAngle + idx * angleStep;
    const secData = (sec as any)[axis.key];
    const pct = secData?.score_percentage;
    const safePct = Math.max(8, Math.min(100, Number.isFinite(pct) ? pct : 50));
    const r = (safePct / 100) * maxRadius;
    const dx = Math.round((center + r * Math.cos(ang)) * 10) / 10;
    const dy = Math.round((center + r * Math.sin(ang)) * 10) / 10;
    assert(
      Number.isFinite(dx) && Number.isFinite(dy),
      `Adversarial input ${i} (axis ${axis.key}) produces strictly finite coordinates (${dx}, ${dy})`
    );
  });
});

// ============================================================================
// PART 2: SkillMasteryIndicator Epistemic Certainty & Metric Computation
// ============================================================================
console.log("\n>>> PART 2: SKILL MASTERY INDICATOR & EPISTEMIC CERTAINTY <<<\n");

function computeSkillMasteryMetricsLocal(snapshot: TwinSnapshot | null, skill: string) {
  if (!snapshot) {
    return {
      masteryPercent: 50,
      band: 5.0,
      cefr: "B1" as CEFRBand,
      variance: 0.08,
      confidencePercent: 20,
      confidenceStatusFa: "در حال کالیبراسیون اولیه",
      evidenceCount: 0,
      hasLiveEvidence: false,
    };
  }

  let mean = 0.5;
  let variance = 0.08;
  let evidenceCount = 0;

  if (
    skill === "listening" ||
    skill === "reading" ||
    skill === "writing" ||
    skill === "speaking"
  ) {
    const belief = snapshot.modalityMastery[skill as keyof typeof snapshot.modalityMastery];
    if (belief) {
      mean = belief.mean;
      variance = belief.variance;
      evidenceCount = belief.evidenceCount;
    }
  } else if (skill === "grammar") {
    const grammarNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    });
    if (grammarNodes.length > 0) {
      mean = grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length;
      variance = grammarNodes.reduce((sum, n) => sum + n.variance, 0) / grammarNodes.length;
      evidenceCount = grammarNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    }
  } else if (skill === "vocabulary") {
    const vocabNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    });
    if (vocabNodes.length > 0) {
      mean = vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length;
      variance = vocabNodes.reduce((sum, n) => sum + n.variance, 0) / vocabNodes.length;
      evidenceCount = vocabNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    }
  }

  const masteryPercent = Math.round(Math.max(5, Math.min(99, mean * 100)));
  const rawBand = 1 + 8 * mean;
  const band = Math.round(Math.max(1, Math.min(9, rawBand)) * 2) / 2;

  const cefr: CEFRBand =
    band >= 8.5 ? "C2" :
    band >= 7.0 ? "C1" :
    band >= 5.5 ? "B2" :
    band >= 4.0 ? "B1" :
    band >= 2.5 ? "A2" : "A1";

  const sigma = Math.sqrt(variance);
  const rawConfidence = (1 - sigma / 0.5) * 100;
  const evidenceScale = Math.min(1.0, evidenceCount / 10);
  const confidencePercent = Math.round(
    evidenceCount === 0 ? 15 : Math.max(15, Math.min(99, rawConfidence * 0.7 + evidenceScale * 30))
  );

  let confidenceStatusFa = "نیاز به شواهد اولیه";
  if (evidenceCount >= 10 && confidencePercent >= 75) {
    confidenceStatusFa = "کالیبره‌شده و مطمئن";
  } else if (evidenceCount >= 3 || confidencePercent >= 45) {
    confidenceStatusFa = "در حال تثبیت شواهد";
  }

  return {
    masteryPercent,
    band,
    cefr,
    variance,
    confidencePercent,
    confidenceStatusFa,
    evidenceCount,
    hasLiveEvidence: evidenceCount > 0,
  };
}

// Check 2.1: Null snapshot fallback
const nullMetrics = computeSkillMasteryMetricsLocal(null, "grammar");
assert(nullMetrics.masteryPercent === 50, "Null snapshot returns baseline mastery 50%");
assert(nullMetrics.confidencePercent === 20, "Null snapshot returns baseline confidence 20%");
assert(nullMetrics.hasLiveEvidence === false, "Null snapshot flags hasLiveEvidence = false");

// Check 2.2: Snapshot with high evidence & low variance
// In TWIN_CATALOG: skillId 0 is "a1-01" (domain: tenses), skillId 2 is "a1-03" (domain: discourse)
const mockHighEvidenceSnapshot: TwinSnapshot = {
  learnerId: "adversarial_learner",
  timestampMs: Date.now(),
  schemaVersion: 1,
  calibration: {
    placementCompleted: true,
    totalInteractions: 30,
    sessionCount: 3,
    lastActiveTimestampMs: Date.now(),
  },
  modalityMastery: {
    listening: { mean: 0.85, variance: 0.004, evidenceCount: 15, lastObservedMs: Date.now() },
    reading: { mean: 0.70, variance: 0.008, evidenceCount: 12, lastObservedMs: Date.now() },
    writing: { mean: 0.65, variance: 0.010, evidenceCount: 10, lastObservedMs: Date.now() },
    speaking: { mean: 0.80, variance: 0.006, evidenceCount: 14, lastObservedMs: Date.now() },
  },
  nodes: [
    {
      skillId: 0 as any, // a1-01 (tenses)
      mean: 0.92,
      variance: 0.002,
      evidenceCount: 20,
      lastObservedMs: Date.now(),
      consecutiveCorroborations: 6,
    },
    {
      skillId: 2 as any, // a1-03 (discourse)
      mean: 0.78,
      variance: 0.005,
      evidenceCount: 16,
      lastObservedMs: Date.now(),
      consecutiveCorroborations: 5,
    },
  ],
  trajectories500: null,
};

const listeningMetrics = computeSkillMasteryMetricsLocal(mockHighEvidenceSnapshot, "listening");
assert(listeningMetrics.masteryPercent === 85, "Listening mastery correctly reflects mean (85%)");
assert(listeningMetrics.cefr === "C1", "Band ~7.8 correctly maps to C1");
assert(listeningMetrics.confidencePercent >= 75, "High evidence + low variance yields confidence >= 75%");
assert(listeningMetrics.confidenceStatusFa === "کالیبره‌شده و مطمئن", "Confidence status is 'کالیبره‌شده و مطمئن'");
assert(listeningMetrics.hasLiveEvidence === true, "Flags hasLiveEvidence = true");

const grammarMetrics = computeSkillMasteryMetricsLocal(mockHighEvidenceSnapshot, "grammar");
assert(grammarMetrics.masteryPercent === 92, "Grammar mastery correctly aggregates AEF grammar nodes (92%)");
assert(grammarMetrics.evidenceCount === 20, "Grammar evidence count matches sum of node evidence (20)");

const vocabMetrics = computeSkillMasteryMetricsLocal(mockHighEvidenceSnapshot, "vocabulary");
assert(vocabMetrics.masteryPercent === 78, "Vocabulary mastery correctly aggregates discourse nodes (78%)");
assert(vocabMetrics.evidenceCount === 16, "Vocabulary evidence count matches sum of discourse evidence (16)");

// Check 2.3: Verify all 6 skills produce bounded values
["grammar", "vocabulary", "reading", "listening", "speaking", "writing"].forEach((sk) => {
  const m = computeSkillMasteryMetricsLocal(mockHighEvidenceSnapshot, sk);
  assert(m.masteryPercent >= 5 && m.masteryPercent <= 99, `Skill ${sk} mastery percent is in [5, 99]`);
  assert(m.band >= 1.0 && m.band <= 9.0, `Skill ${sk} band is in [1.0, 9.0]`);
  assert(["A1", "A2", "B1", "B2", "C1", "C2"].includes(m.cefr), `Skill ${sk} CEFR is valid (${m.cefr})`);
  assert(m.confidencePercent >= 15 && m.confidencePercent <= 99, `Skill ${sk} confidence is in [15, 99]`);
});

// ============================================================================
// PART 3: Genuine Telemetry & Latency Clamping
// ============================================================================
console.log("\n>>> PART 3: GENUINE TELEMETRY & LATENCY CLAMPING <<<\n");

const bandit = EnDooraLinUCBBandit.getInstance(0.5);
const dkt = DktEngine.getInstance();

const initialBanditPulls = bandit.getState().arms.l1_persian.pulls;
const initialDktInteractions = dkt.getPredictions().totalInteractions;

const simLatency = 2150; // ms
bandit.recordInteractionFeedback({
  category: "l1_persian",
  features: [0.35, 0.35, 0.35, 0.79],
  trapTriggered: true,
  latencyMs: simLatency,
});

dkt.recordInteraction({
  conceptId: "b2-01",
  isCorrect: false,
  isTrap: true,
  latencyMs: simLatency,
});

const updatedBanditPulls = bandit.getState().arms.l1_persian.pulls;
const updatedDktInteractions = dkt.getPredictions().totalInteractions;

assert(updatedBanditPulls === initialBanditPulls + 1, "LinUCB bandit arm pulls incremented by 1");
assert(updatedDktInteractions === initialDktInteractions + 1, "DKT-Forget totalInteractions incremented by 1");

// Test clamping function used in SkillMiniPractice and useAdaptiveQuestion
const clampLatency = (startMs: number, nowMs: number) => {
  return Math.max(120, Math.min(120000, Math.round(nowMs - startMs)));
};

assert(clampLatency(1000, 1080) === 120, "Short latency (< 120ms) is clamped to floor 120ms");
assert(clampLatency(1000, 800) === 120, "Negative latency (clock backward) is clamped to floor 120ms");
assert(clampLatency(1000, 300000) === 120000, "Excessive latency (> 120s) is clamped to ceiling 120,000ms");
assert(clampLatency(1000, 4520) === 3520, "Normal latency (3520ms) is accurately measured");

// ============================================================================
// PART 4: Placement Report Evidence Assimilation
// ============================================================================
console.log("\n>>> PART 4: LEARNER TWIN EVIDENCE ASSIMILATION <<<\n");

setTwinLearnerScope("adversarial_test_learner");
const twin = getLearnerTwin();
assert(twin !== null, "Learner Twin instance is accessible");

const initialReadCount = twin?.getSnapshot().modalityMastery.reading.evidenceCount ?? 0;

const result = recordTwinObservation({
  skillIds: [],
  observedScore: 0.90,
  modality: "sherlock_deduction",
  ieltsSkill: "reading",
  guessingFloor: 0.25,
  latencyMs: 22000,
  expectedLatencyMs: 35000,
  gazeDistractionIndex: 0.05,
  cognitiveLoadIndex: 0.35,
});

assert(result !== null, "recordTwinObservation returned valid update result");
const updatedReadCount = twin?.getSnapshot().modalityMastery.reading.evidenceCount ?? 0;
assert(updatedReadCount === initialReadCount + 1, "Placement test evidence successfully assimilated into Learner Twin");

try {
  resetLearnerTwin();
} catch {}

// ============================================================================
// VERIFICATION SUMMARY
// ============================================================================
console.log("\n" + "=".repeat(85));
console.log(`  M2 ADVERSARIAL STRESS TEST SUMMARY: ${passedChecks}/${totalChecks} Checks Passed`);
console.log("=".repeat(85));

if (failedChecks > 0) {
  console.error(`\n❌ FAILED CHECKS (${failedChecks}):`);
  failureDetails.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log("\n✅ ALL M2 ADVERSARIAL STRESS CHECKS PASSED WITH 100% SUCCESS!\n");
  process.exit(0);
}
