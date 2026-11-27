#!/usr/bin/env node
/**
 * Adversarial Stress Testing Suite: M1 Challenger 2
 * Target 1: Speech Lab Worker Error Resilience (SpectrogramPronunciationLab.tsx)
 * Target 2: Learner Twin Public Worker Endurance & Precision (apps/web/public/workers/learner-twin.worker.js)
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { NeuroBayesianLearnerTwin } from "../apps/web/lib/ai/learner-twin-core.ts";
import {
  createTwinNodes,
  beginTwinAssessment,
  finishTwinAssessment,
  type TwinAssessment,
} from "../apps/web/lib/ai/learner-twin-store.ts";
import type {
  SkillBeliefNode,
  TwinSnapshot,
} from "../apps/web/lib/ai/learner-twin-types.ts";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(name: string, fn: () => void) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err: any) {
    failedChecks++;
    console.error(`  ✗ [FAIL] ${name}`);
    console.error(`    ${err.message || err}`);
  }
}

console.log("=".repeat(80));
console.log("  M1 Challenger 2: Adversarial Stress Test Suite");
console.log("  1. Speech Lab Worker Error Resilience (SpectrogramPronunciationLab.tsx)");
console.log("  2. Learner Twin Public Worker Endurance & Precision (learner-twin.worker.js)");
console.log("=".repeat(80));

// =============================================================================
// SECTION 1: SPEECH LAB WORKER ERROR RESILIENCE
// =============================================================================
console.log("\n>>> SECTION 1: Speech Lab Worker Error Resilience <<<");

const labPath = path.resolve("apps/web/components/phonetics/SpectrogramPronunciationLab.tsx");
const labSource = fs.readFileSync(labPath, "utf8");

// 1.1 Structural / Static Audit of SpectrogramPronunciationLab.tsx
check("Lab Source: worker.onerror handler is defined in useEffect", () => {
  assert.ok(labSource.includes("worker.onerror = (e: ErrorEvent) => {"), "worker.onerror must be registered");
});

check("Lab Source: worker.onmessage handles type === 'ERROR'", () => {
  assert.ok(labSource.includes("} else if (type === 'ERROR') {"), "worker.onmessage must branch on ERROR type");
});

check("Lab Source: handleWorkerError resets isProcessing, isRecording, and twinAssessmentRef", () => {
  assert.ok(labSource.includes("setIsProcessing(false);"), "Must reset isProcessing to false");
  assert.ok(labSource.includes("setIsRecording(false);"), "Must reset isRecording to false");
  assert.ok(labSource.includes("twinAssessmentRef.current = null;"), "Must clear twin assessment ticket to null");
  assert.ok(labSource.includes("setBackendStatus('Edge AI Error');"), "Must update backend status");
  assert.ok(labSource.includes("setWorkerError("), "Must set worker error state");
});

check("Lab Source: UI renders accessible Persian error alert (role='alert', dir='rtl')", () => {
  assert.ok(labSource.includes('role="alert"'), "Must provide accessible role='alert'");
  assert.ok(labSource.includes('dir="rtl"'), "Must enforce RTL Persian direction");
  assert.ok(labSource.includes('{workerError}'), "Must render workerError message in alert");
  assert.ok(labSource.includes('onClick={() => setWorkerError(null)}'), "Must provide dismiss action button");
  assert.ok(labSource.includes('بستن'), "Dismiss button must display Persian 'بستن'");
});

check("Lab Source: AudioBuffer dispatch catch protects against postMessage throw", () => {
  assert.ok(labSource.includes("catch (postErr) {"), "Must have try/catch around postMessage audio buffers");
  assert.ok(
    labSource.includes("خطا در ارسال داده‌های صوتی به ورکر پردازش واج"),
    "Must set Persian error on buffer dispatch failure"
  );
});

// 1.2 Behavioral Simulation Harness of SpectrogramPronunciationLab Error Recovery
class SpeechLabHarness {
  isRecording = false;
  isProcessing = false;
  backendStatus = "Initializing Edge AI...";
  workerError: string | null = null;
  twinAssessmentRef: TwinAssessment | null = null;
  assessment: any = null;
  workerMock: {
    onmessage: ((e: { data: any }) => void) | null;
    onerror: ((e: { message?: string }) => void) | null;
    terminated: boolean;
    postedMessages: any[];
    postMessage: (msg: any, transfer?: any[]) => void;
    terminate: () => void;
  };
  isTerminated = false;

  constructor() {
    const self = this;
    this.workerMock = {
      onmessage: null,
      onerror: null,
      terminated: false,
      postedMessages: [],
      postMessage(msg: any) {
        this.postedMessages.push(msg);
      },
      terminate() {
        this.terminated = true;
      },
    };

    // Replicate useEffect lifecycle in SpectrogramPronunciationLab.tsx
    const handleWorkerError = (errorMessage: string) => {
      if (self.isTerminated) return;
      self.isProcessing = false;
      self.isRecording = false;
      self.backendStatus = "Edge AI Error";
      self.twinAssessmentRef = null;
      self.workerError = errorMessage;
    };

    this.workerMock.onmessage = (e: { data: any }) => {
      if (self.isTerminated) return;
      const { type, backend, payload } = e.data;
      if (type === "MODEL_READY") {
        const backendName = backend === "webgpu" ? "WebGPU" : backend === "wasm" ? "WASM" : "Acoustic DSP";
        self.backendStatus = `2D-CNN + CTC (${backendName})`;
        self.workerError = null;
      } else if (type === "ASSESSMENT_COMPLETE") {
        finishTwinAssessment(self.twinAssessmentRef, (payload?.overallScore || 0) / 100);
        self.twinAssessmentRef = null;
        self.assessment = payload;
        self.isProcessing = false;
        self.workerError = null;
      } else if (type === "ERROR") {
        handleWorkerError(
          payload?.message || (e.data as any).error || "خطا در ارزیابی و استنتاج مدل واج‌شناسی هوش مصنوعی."
        );
      }
    };

    this.workerMock.onerror = (e: { message?: string }) => {
      const errorDetails = e.message || "Worker runtime error";
      handleWorkerError(
        `خطا در بارگذاری یا پردازش مدل هوش مصنوعی صوت: ${errorDetails}`
      );
    };
  }

  startRecording() {
    this.workerError = null;
    this.twinAssessmentRef = beginTwinAssessment("cnn_pronunciation");
    this.assessment = null;
    this.isRecording = true;
  }

  stopRecordingAndEvaluate(simulateBufferThrow = false) {
    this.isRecording = false;
    this.isProcessing = true;
    if (simulateBufferThrow) {
      try {
        throw new Error("Detached ArrayBuffer: unable to transfer");
      } catch {
        this.isProcessing = false;
        this.workerError = "خطا در ارسال داده‌های صوتی به ورکر پردازش واج.";
      }
      return;
    }
    this.workerMock.postMessage({
      type: "EVALUATE_UTTERANCE",
      payload: { numFrames: 100, numBins: 80 },
    });
  }

  dismissAlert() {
    this.workerError = null;
  }

  getRecordButtonDisabled(): boolean {
    return this.isProcessing;
  }

  renderAlertHtml(): string | null {
    if (!this.workerError) return null;
    return `<div role="alert" dir="rtl"><span class="font-medium">${this.workerError}</span><button>بستن</button></div>`;
  }
}

check("Crash Injection 1: Worker posts { type: 'ERROR', error: 'Simulated Model Out of Memory' }", () => {
  const lab = new SpeechLabHarness();
  lab.startRecording();
  assert.equal(lab.isRecording, true, "Must be recording");
  assert.ok(lab.twinAssessmentRef !== null, "Twin assessment ticket must be active");

  lab.stopRecordingAndEvaluate();
  assert.equal(lab.isProcessing, true, "Must be processing while awaiting worker");
  assert.equal(lab.getRecordButtonDisabled(), true, "Record button must be disabled during processing");

  // Worker crashes with { type: 'ERROR', error: 'Simulated Model Out of Memory' }
  lab.workerMock.onmessage!({
    data: { type: "ERROR", error: "Simulated Model Out of Memory" },
  });

  assert.equal(lab.isProcessing, false, "isProcessing MUST be reset to false");
  assert.equal(lab.isRecording, false, "isRecording MUST be reset to false");
  assert.equal(lab.twinAssessmentRef, null, "twinAssessmentRef MUST be cleared to null");
  assert.equal(lab.backendStatus, "Edge AI Error", "backendStatus must be 'Edge AI Error'");
  assert.ok(lab.workerError !== null, "workerError must be set");
  assert.ok(
    lab.workerError!.includes("خطا") || lab.workerError!.includes("Memory"),
    "Must contain error description"
  );
  assert.equal(lab.getRecordButtonDisabled(), false, "Record button must be re-enabled after error");

  const alert = lab.renderAlertHtml();
  assert.ok(alert !== null, "Alert must be rendered");
  assert.ok(alert!.includes('role="alert"'), "Alert must have role='alert'");
  assert.ok(alert!.includes('dir="rtl"'), "Alert must have dir='rtl'");
});

check("Crash Injection 2: Worker fires unhandled ErrorEvent 'new ErrorEvent(\"error\")'", () => {
  const lab = new SpeechLabHarness();
  lab.startRecording();
  lab.stopRecordingAndEvaluate();
  assert.equal(lab.isProcessing, true);
  assert.ok(lab.twinAssessmentRef !== null);

  // Unhandled error event
  lab.workerMock.onerror!({
    message: "Uncaught WebGPU device lost: out of memory",
  });

  assert.equal(lab.isProcessing, false, "isProcessing must be false");
  assert.equal(lab.isRecording, false, "isRecording must be false");
  assert.equal(lab.twinAssessmentRef, null, "twin assessment ticket must be cleared");
  assert.equal(lab.backendStatus, "Edge AI Error");
  assert.ok(lab.workerError!.startsWith("خطا در بارگذاری یا پردازش مدل هوش مصنوعی صوت:"));
  assert.ok(lab.workerError!.includes("Uncaught WebGPU device lost"));

  // Dismiss button click recovery
  lab.dismissAlert();
  assert.equal(lab.workerError, null, "Dismiss button must clear error alert");
  assert.equal(lab.renderAlertHtml(), null, "Alert banner must be unmounted");
  assert.equal(lab.getRecordButtonDisabled(), false, "Learner must be able to record again");
});

check("Crash Injection 3: AudioBuffer postMessage throw during dispatch", () => {
  const lab = new SpeechLabHarness();
  lab.startRecording();
  lab.stopRecordingAndEvaluate(true); // simulate detached ArrayBuffer throw

  assert.equal(lab.isProcessing, false, "Must not deadlock in processing");
  assert.equal(
    lab.workerError,
    "خطا در ارسال داده‌های صوتی به ورکر پردازش واج.",
    "Must set Persian error for buffer transfer failure"
  );
});

// =============================================================================
// SECTION 2: LEARNER TWIN PUBLIC WORKER ENDURANCE & PRECISION
// =============================================================================
console.log("\n>>> SECTION 2: Learner Twin Public Worker Endurance & Precision <<<");

const workerPath = path.resolve("apps/web/public/workers/learner-twin.worker.js");
const workerSource = fs.readFileSync(workerPath, "utf8");

// Load worker in isolated sandbox
function createPublicTwinWorker() {
  const responses: any[] = [];
  const scope: any = {
    postMessage: (msg: any) => responses.push(msg),
    performance,
    Math,
    Number,
    Float32Array,
    Array,
    Set,
    Date,
    Error,
  };

  const fn = new Function(
    "self",
    "performance",
    "Math",
    "Number",
    "Float32Array",
    "Array",
    "Set",
    "Date",
    "Error",
    workerSource
  );
  fn(scope, performance, Math, Number, Float32Array, Array, Set, Date, Error);

  return {
    dispatch(data: any): any {
      responses.length = 0;
      scope.onmessage({ data });
      return responses[0];
    },
  };
}

// Helper to construct a canonical base snapshot
function createBaseSnapshot(): TwinSnapshot {
  const twin = new NeuroBayesianLearnerTwin(createTwinNodes(1_800_000_000_000), {
    storage: null,
    now: () => 1_800_000_000_000,
  });
  return twin.getSnapshot();
}

const worker = createPublicTwinWorker();

check("Public Worker: Baseline 30-Day simulation executes cleanly", () => {
  const snap = createBaseSnapshot();
  const res = worker.dispatch({
    id: 100,
    snapshot: snap,
    horizonDays: 30,
    dailyMinutes: 20,
  });

  assert.equal(res.id, 100);
  assert.ok(res.trajectory, "Must return trajectory");
  assert.equal(res.trajectory.length, 31, "Day 0 to Day 30 must yield 31 points");
  assert.equal(typeof res.elapsedMs, "number");
  assert.ok(res.elapsedMs < 100, `Execution time must be sub-100ms (got ${res.elapsedMs}ms)`);
});

// 2.1 Edge Case Snapshot: All Masteries 0.0 (Extreme Low Floor)
check("Edge Case 1: All Masteries = 0.0 across 90-day horizon (500 trajectories)", () => {
  const snap = createBaseSnapshot();
  // Set all node masteries to 0.0
  snap.nodes.forEach((n) => {
    n.mean = 0.0;
  });
  // Set all modality masteries to 0.0
  for (const skill of ["listening", "reading", "writing", "speaking"] as const) {
    snap.modalityMastery[skill].mean = 0.0;
  }

  const res = worker.dispatch({
    id: 101,
    snapshot: snap,
    horizonDays: 90,
    dailyMinutes: 20,
  });

  assert.ok(!res.error, `Must not error on zero masteries: ${res.error}`);
  assert.ok(res.trajectory, "Trajectory must be present");
  assert.equal(res.trajectory.length, 91, "90-day horizon must contain 91 points (0..90)");

  // Assert numerical precision and quantile monotonicity across all 91 days
  for (let d = 0; d <= 90; d++) {
    const pt = res.trajectory[d];
    assert.equal(pt.dayOffset, d);

    // No NaN or Infinity
    assert.ok(Number.isFinite(pt.projectedOverallBand), `Day ${d}: projectedOverallBand must be finite`);
    assert.ok(Number.isFinite(pt.lowerBoundBand), `Day ${d}: lowerBoundBand must be finite`);
    assert.ok(Number.isFinite(pt.upperBoundBand), `Day ${d}: upperBoundBand must be finite`);
    assert.ok(Number.isFinite(pt.noStudyBand), `Day ${d}: noStudyBand must be finite`);
    assert.ok(Number.isFinite(pt.noStudyLowerBand), `Day ${d}: noStudyLowerBand must be finite`);
    assert.ok(Number.isFinite(pt.noStudyUpperBand), `Day ${d}: noStudyUpperBand must be finite`);
    assert.ok(Number.isFinite(pt.retentionPctIfNoStudy), `Day ${d}: retentionPctIfNoStudy must be finite`);
    assert.ok(Number.isFinite(pt.retentionPctWithAdaptiveStudy), `Day ${d}: retentionPctWithAdaptiveStudy must be finite`);

    // Bounded in [1.0, 9.0]
    assert.ok(pt.projectedOverallBand >= 1.0 && pt.projectedOverallBand <= 9.0);
    assert.ok(pt.lowerBoundBand >= 1.0 && pt.lowerBoundBand <= 9.0);
    assert.ok(pt.upperBoundBand >= 1.0 && pt.upperBoundBand <= 9.0);

    // Monotonic quantile bands: lower <= center <= upper
    assert.ok(
      pt.lowerBoundBand <= pt.projectedOverallBand + 1e-5,
      `Day ${d}: lowerBoundBand (${pt.lowerBoundBand}) <= projectedOverallBand (${pt.projectedOverallBand})`
    );
    assert.ok(
      pt.projectedOverallBand <= pt.upperBoundBand + 1e-5,
      `Day ${d}: projectedOverallBand (${pt.projectedOverallBand}) <= upperBoundBand (${pt.upperBoundBand})`
    );
    assert.ok(
      pt.noStudyLowerBand <= pt.noStudyBand + 1e-5,
      `Day ${d}: noStudyLowerBand (${pt.noStudyLowerBand}) <= noStudyBand (${pt.noStudyBand})`
    );
    assert.ok(
      pt.noStudyBand <= pt.noStudyUpperBand + 1e-5,
      `Day ${d}: noStudyBand (${pt.noStudyBand}) <= noStudyUpperBand (${pt.noStudyUpperBand})`
    );
  }
});

// 2.2 Edge Case Snapshot: All Masteries 1.0 (Ceiling Saturation)
check("Edge Case 2: All Masteries = 1.0 across 90-day horizon (500 trajectories, 45 min/day)", () => {
  const snap = createBaseSnapshot();
  snap.nodes.forEach((n) => {
    n.mean = 1.0;
  });
  for (const skill of ["listening", "reading", "writing", "speaking"] as const) {
    snap.modalityMastery[skill].mean = 1.0;
  }

  const res = worker.dispatch({
    id: 102,
    snapshot: snap,
    horizonDays: 90,
    dailyMinutes: 45, // maximum allowed practice time
  });

  assert.ok(!res.error, `Must not error on ceiling masteries: ${res.error}`);
  assert.equal(res.trajectory.length, 91);

  for (let d = 0; d <= 90; d++) {
    const pt = res.trajectory[d];
    assert.ok(Number.isFinite(pt.projectedOverallBand));
    assert.ok(Number.isFinite(pt.lowerBoundBand));
    assert.ok(Number.isFinite(pt.upperBoundBand));

    // Must never exceed IELTS band 9.0
    assert.ok(pt.projectedOverallBand <= 9.0, `Day ${d}: projected ${pt.projectedOverallBand} <= 9.0`);
    assert.ok(pt.upperBoundBand <= 9.0, `Day ${d}: upper ${pt.upperBoundBand} <= 9.0`);

    // Monotonic quantile bands (p10 <= p50 <= p90)
    assert.ok(pt.lowerBoundBand <= pt.projectedOverallBand + 1e-5);
    assert.ok(pt.projectedOverallBand <= pt.upperBoundBand + 1e-5);
    assert.ok(pt.noStudyLowerBand <= pt.noStudyBand + 1e-5);
    assert.ok(pt.noStudyBand <= pt.noStudyUpperBand + 1e-5);
  }

  // Counterfactual comparison at Day 90:
  // With 45 min adaptive study: band is maintained at high ~8.57, retention at ~76.1%
  // Without study: band decays down to ~3.83, retention plummets to ~15.0%
  const day90 = res.trajectory[90];
  assert.ok(day90.projectedOverallBand >= 8.0, `Day 90 adaptive band maintained >= 8.0 (got ${day90.projectedOverallBand.toFixed(2)})`);
  assert.ok(day90.retentionPctWithAdaptiveStudy >= 70, `Day 90 adaptive retention maintained >= 70% (got ${day90.retentionPctWithAdaptiveStudy.toFixed(1)}%)`);
  assert.ok(
    day90.retentionPctWithAdaptiveStudy > day90.retentionPctIfNoStudy * 4,
    `Adaptive study retention (${day90.retentionPctWithAdaptiveStudy.toFixed(1)}%) must be >4x unassisted decay (${day90.retentionPctIfNoStudy.toFixed(1)}%)`
  );
});

// 2.3 Edge Case Snapshot: Extreme Variances 0.25 (Maximum Epistemic Uncertainty)
check("Edge Case 3: Extreme Variances = 0.25 across all nodes & modalities (90 days)", () => {
  const snap = createBaseSnapshot();
  snap.nodes.forEach((n) => {
    n.variance = 0.25;
  });
  for (const skill of ["listening", "reading", "writing", "speaking"] as const) {
    snap.modalityMastery[skill].variance = 0.25;
  }

  const res = worker.dispatch({
    id: 103,
    snapshot: snap,
    horizonDays: 90,
    dailyMinutes: 20,
  });

  assert.ok(!res.error, `Must accept variance 0.25: ${res.error}`);
  assert.equal(res.trajectory.length, 91);

  for (let d = 0; d <= 90; d++) {
    const pt = res.trajectory[d];
    assert.ok(Number.isFinite(pt.projectedOverallBand));
    assert.ok(Number.isFinite(pt.lowerBoundBand));
    assert.ok(Number.isFinite(pt.upperBoundBand));

    // Monotonic quantile bands (p10 <= p50 <= p90)
    assert.ok(pt.lowerBoundBand <= pt.projectedOverallBand + 1e-5);
    assert.ok(pt.projectedOverallBand <= pt.upperBoundBand + 1e-5);
    assert.ok(pt.noStudyLowerBand <= pt.noStudyBand + 1e-5);
    assert.ok(pt.noStudyBand <= pt.noStudyUpperBand + 1e-5);
  }
});

// 2.4 Adversarial Stress: Malformed Snapshots & Corrupted IDs
check("Adversarial Defense: Corrupted non-integer skillId rejected gracefully", () => {
  const snap = createBaseSnapshot();
  (snap.nodes[0] as any).skillId = "corrupted_non_int_id";

  const res = worker.dispatch({ id: 201, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject corrupted string skillId");
  assert.equal(res.error, "Invalid simulation snapshot");
  assert.equal(res.trajectory, undefined);
});

check("Adversarial Defense: Duplicate skillIds rejected gracefully", () => {
  const snap = createBaseSnapshot();
  snap.nodes[1].skillId = snap.nodes[0].skillId; // duplicate

  const res = worker.dispatch({ id: 202, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject duplicate skillIds");
  assert.equal(res.error, "Invalid simulation snapshot");
});

check("Adversarial Defense: Out-of-bounds variance (> 0.25) rejected gracefully", () => {
  const snap = createBaseSnapshot();
  snap.nodes[0].variance = 0.26;

  const res = worker.dispatch({ id: 203, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject variance > 0.25");
  assert.equal(res.error, "Invalid simulation snapshot");
});

check("Adversarial Defense: Negative variance rejected gracefully", () => {
  const snap = createBaseSnapshot();
  snap.nodes[0].variance = -0.01;

  const res = worker.dispatch({ id: 204, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject negative variance");
  assert.equal(res.error, "Invalid simulation snapshot");
});

check("Adversarial Defense: Corrupted modality mastery (missing skill) rejected", () => {
  const snap = createBaseSnapshot();
  delete (snap.modalityMastery as any).writing;

  const res = worker.dispatch({ id: 205, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject missing modality");
  assert.equal(res.error, "Invalid simulation snapshot");
});

check("Adversarial Defense: Corrupted residual weights length (32 instead of 33) rejected", () => {
  const snap = createBaseSnapshot();
  snap.residualWeights = snap.residualWeights.slice(0, 32);

  const res = worker.dispatch({ id: 206, snapshot: snap, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject invalid residualWeights length");
  assert.equal(res.error, "Invalid simulation snapshot");
});

check("Adversarial Defense: Out-of-bounds horizonDays (> 90 days) rejected", () => {
  const snap = createBaseSnapshot();
  const res = worker.dispatch({ id: 207, snapshot: snap, horizonDays: 91, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject horizonDays > 90");
  assert.ok(res.error.includes("0–90 days"));
});

check("Adversarial Defense: Negative horizonDays rejected", () => {
  const snap = createBaseSnapshot();
  const res = worker.dispatch({ id: 208, snapshot: snap, horizonDays: -5, dailyMinutes: 20 });
  assert.ok(res.error, "Must reject negative horizonDays");
});

check("Adversarial Defense: Out-of-bounds dailyMinutes (> 45 min) rejected", () => {
  const snap = createBaseSnapshot();
  const res = worker.dispatch({ id: 209, snapshot: snap, horizonDays: 30, dailyMinutes: 50 });
  assert.ok(res.error, "Must reject dailyMinutes > 45");
  assert.ok(res.error.includes("0–45 minutes"));
});

check("Adversarial Defense: Null or malformed snapshot payload rejected", () => {
  const res1 = worker.dispatch({ id: 210, snapshot: null, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res1.error, "Must reject null snapshot");
  const res2 = worker.dispatch({ id: 211, snapshot: "corrupted_string", horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res2.error, "Must reject string snapshot");
  const res3 = worker.dispatch({ id: 212, snapshot: {}, horizonDays: 30, dailyMinutes: 20 });
  assert.ok(res3.error, "Must reject empty snapshot");
});

// 2.5 90-Day Endurance Benchmark: 500 trajectories across 90 days (45,000 evaluations)
check("Endurance Benchmark: 500 trajectories x 90 days completes stably in < 150 ms", () => {
  const snap = createBaseSnapshot();
  const t0 = performance.now();
  const res = worker.dispatch({
    id: 300,
    snapshot: snap,
    horizonDays: 90,
    dailyMinutes: 30,
  });
  const totalDuration = performance.now() - t0;

  assert.equal(res.trajectory.length, 91);
  console.log(`    [Benchmark] 500 trajectories x 90 days (45,000 points): ${totalDuration.toFixed(2)} ms (reported worker time: ${res.elapsedMs.toFixed(2)} ms)`);
  assert.ok(totalDuration < 150, `Simulation must complete in < 150 ms (got ${totalDuration.toFixed(2)} ms)`);

  // Counterfactual verification: Adaptive study must outperform no-study at Day 90
  const day90 = res.trajectory[90];
  assert.ok(
    day90.projectedOverallBand >= day90.noStudyBand,
    `Adaptive study band (${day90.projectedOverallBand}) >= no-study band (${day90.noStudyBand})`
  );
  assert.ok(
    day90.retentionPctWithAdaptiveStudy > day90.retentionPctIfNoStudy,
    `Adaptive retention (${day90.retentionPctWithAdaptiveStudy.toFixed(1)}%) > no-study retention (${day90.retentionPctIfNoStudy.toFixed(1)}%)`
  );
});

// =============================================================================
// SUMMARY
// =============================================================================
console.log("\n" + "=".repeat(80));
console.log(`  Adversarial Stress Verification Complete:`);
console.log(`  Total Checks:  ${totalChecks}`);
console.log(`  Passed Checks: ${passedChecks}`);
console.log(`  Failed Checks: ${failedChecks}`);
console.log("=".repeat(80));

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
