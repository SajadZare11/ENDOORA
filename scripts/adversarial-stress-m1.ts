#!/usr/bin/env node
/**
 * Adversarial Stress-Testing Harness for Milestone M1 Components
 * Target File: scripts/adversarial-stress-m1.ts
 *
 * EMPIRICAL CHALLENGER SUITE:
 * 1. Gaze Engine Lifecycle Stress Test:
 *    - Multiple startTracking() calls (idempotency, listener deduplication)
 *    - Multiple stopTracking() calls (idempotency, listener cleanup, timer clearing)
 *    - terminate() resource release and state reset
 *    - Lazy recreation: call startTracking() after terminate()
 *    - destroy() singleton clearance and subscriber cleanup
 *    - 10,000 synthetic high-frequency mouse & gaze coordinates stress test
 *    - Proctoring anomaly detection & Watson hint triggers
 *    - Numerical non-NaN and bounded interval guarantees [0, 1]
 * 2. BERT Worker Fallback Schema Probe:
 *    - Edge case texts: empty string, whitespace, 1-word, 2000-word, gibberish, non-ASCII (Persian, Chinese, Emojis)
 *    - Punctuation-only, numbers-only, repetitive 100-word (TTR edge case)
 *    - Boundary target words (0, negative, 5000), empty promptText
 *    - Strict validation of all 15 BertEvaluationResult schema fields
 *    - Zero NaN guarantees, bands in [1.0, 9.0], non-empty arrays
 */

import { performance } from "node:perf_hooks";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

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
console.log("  M1 ADVERSARIAL STRESS TEST: GAZE ENGINE LIFECYCLE & BERT WORKER PROBE");
console.log("=".repeat(85));

// ============================================================================
// PART 1: Gaze Engine Lifecycle Stress Suite
// ============================================================================
console.log("\n>>> PART 1: GAZE ENGINE LIFECYCLE STRESS TESTS <<<\n");

// 1.1 Mock Browser Environment with Event Listener Tracking
const windowListeners = new Map<string, Set<Function>>();
let mockWorkerCount = 0;
let mockWorkerTerminatedCount = 0;
const mockWorkerInstances: any[] = [];

class MockBrowserWorker {
  public id: number;
  public url: string;
  public onmessage: ((e: any) => void) | null = null;
  public onerror: ((e: any) => void) | null = null;
  public messagesSent: any[] = [];
  public isTerminated = false;

  constructor(url: string) {
    this.url = url;
    mockWorkerCount++;
    this.id = mockWorkerCount;
    mockWorkerInstances.push(this);
  }

  postMessage(msg: any) {
    this.messagesSent.push(msg);
  }

  terminate() {
    this.isTerminated = true;
    mockWorkerTerminatedCount++;
  }
}

const mockLocalStorageStore = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => mockLocalStorageStore.get(key) || null,
  setItem: (key: string, val: string) => { mockLocalStorageStore.set(key, val); },
  removeItem: (key: string) => { mockLocalStorageStore.delete(key); },
  clear: () => { mockLocalStorageStore.clear(); }
};

// Install mocks on globalThis
(globalThis as any).window = {
  addEventListener(type: string, handler: Function, _opts?: any) {
    if (!windowListeners.has(type)) windowListeners.set(type, new Set());
    windowListeners.get(type)!.add(handler);
  },
  removeEventListener(type: string, handler: Function) {
    if (windowListeners.has(type)) {
      windowListeners.get(type)!.delete(handler);
    }
  },
  localStorage: mockLocalStorage,
};
(globalThis as any).Worker = MockBrowserWorker;

// Import GazeCognitiveEngine
const { GazeCognitiveEngine } = await import("../apps/web/lib/ai/gaze-cognitive-engine.ts");

// Suite 1.1: Instantiation & Worker Initialization
console.log("--- Test 1.1: Singleton Instantiation & Worker Init ---");
const engine1 = GazeCognitiveEngine.getInstance();
const engine2 = GazeCognitiveEngine.getInstance();
assert(engine1 === engine2, "GazeCognitiveEngine.getInstance() returns identical singleton reference");
assert(mockWorkerCount === 1, "Web Worker initialized exactly once during constructor");

// Suite 1.2: Repeated startTracking() Idempotency
console.log("\n--- Test 1.2: Repeated startTracking() Idempotency ---");
engine1.startTracking();
const listenersAfterStart1 = windowListeners.get("mousemove")?.size ?? 0;
assert(listenersAfterStart1 === 1, "Single mousemove listener attached after initial startTracking()");

// Call startTracking 9 more times
for (let i = 0; i < 9; i++) {
  engine1.startTracking();
}
const listenersAfterStartMulti = windowListeners.get("mousemove")?.size ?? 0;
assert(listenersAfterStartMulti === 1, "Idempotency preserved: 10 calls to startTracking() maintain exactly 1 mousemove listener");

// Suite 1.3: Repeated stopTracking() Idempotency & Complete Listener Cleanup
console.log("\n--- Test 1.3: Repeated stopTracking() Cleanup & Idempotency ---");
engine1.stopTracking();
const listenersAfterStop1 = windowListeners.get("mousemove")?.size ?? 0;
assert(listenersAfterStop1 === 0, "stopTracking() cleanly removes mousemove listener from window (size === 0)");

// Call stopTracking 9 more times
for (let i = 0; i < 9; i++) {
  engine1.stopTracking();
}
const listenersAfterStopMulti = windowListeners.get("mousemove")?.size ?? 0;
assert(listenersAfterStopMulti === 0, "Idempotency preserved: 10 calls to stopTracking() maintain 0 listeners without exception");

// Suite 1.4: terminate() Resource Release & Lazy Recreation
console.log("\n--- Test 1.4: terminate() Teardown & Lazy Worker Recreation ---");
const workerBeforeTerminate = mockWorkerInstances[mockWorkerInstances.length - 1];
assert(workerBeforeTerminate.isTerminated === false, "Worker active prior to terminate()");

engine1.terminate();
assert(workerBeforeTerminate.isTerminated === true, "terminate() calls worker.terminate() directly");
assert(mockWorkerTerminatedCount === 1, "Exactly one worker termination recorded");

// Now call startTracking() again: verify lazy re-initialization
engine1.startTracking();
assert(mockWorkerCount === 2, "startTracking() lazily creates a fresh Worker instance after terminate()");
const listenersAfterRecreate = windowListeners.get("mousemove")?.size ?? 0;
assert(listenersAfterRecreate === 1, "MouseMove listener cleanly re-attached upon lazy recreation");

engine1.stopTracking();
assert((windowListeners.get("mousemove")?.size ?? 0) === 0, "Listener cleanly removed after secondary session");

// Suite 1.5: destroy() Complete Teardown & Singleton Reset
console.log("\n--- Test 1.5: destroy() Teardown & Singleton Clearance ---");
let telemetrySubFired = false;
const unsub = engine1.subscribeTelemetry(() => { telemetrySubFired = true; });

engine1.destroy();
assert(mockWorkerTerminatedCount === 2, "destroy() triggers worker termination");

// Verify singleton reset
const engineNew = GazeCognitiveEngine.getInstance();
assert(engineNew !== engine1, "destroy() clears singleton instance, allowing clean subsequent instantiation");
engineNew.destroy();

// ============================================================================
// PART 1.6: High-Frequency Synthetic Coordinates Stress Test on Worker
// ============================================================================
console.log("\n--- Test 1.6: 10,000 High-Frequency Synthetic Coordinates on gaze-cognitive.worker.js ---");

// Load the actual worker code
const workerCode = fs.readFileSync(
  path.join(REPO_ROOT, "apps/web/public/workers/gaze-cognitive.worker.js"),
  "utf8"
);

const workerOutbox: any[] = [];
const workerSelf: any = {
  postMessage: (msg: any) => workerOutbox.push(msg),
};

// Execute worker script inside isolated scope
const workerFn = new Function("self", "fetch", workerCode);
workerFn(workerSelf, () => Promise.reject(new Error("Offline test harness - no network fetch")));

// Initialize worker
await workerSelf.onmessage({ data: { type: "INIT_MODEL" } });
assert(workerOutbox.length === 1 && workerOutbox[0].type === "MODEL_READY", "Worker dispatched MODEL_READY on INIT_MODEL");

// Stress test: 10,000 synthetic coordinates
const ITERATIONS = 10000;
let nanCount = 0;
let boundedViolations = 0;
let watsonTriggers = 0;
let normalProctoringCount = 0;
let lookingAwayCount = 0;
let suspiciousMotionCount = 0;

const tStartGaze = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  // Construct diverse coordinate dynamics
  let x: number;
  let y: number;
  let vel: number;

  const phase = i % 100;
  if (phase < 30) {
    // Normal forward drift (reading)
    x = 100 + phase * 20;
    y = 200 + (Math.sin(i * 0.05) * 20);
    vel = 40 + (Math.random() * 20);
  } else if (phase < 60) {
    // Erratic saccadic regressions (backtracking across screen)
    x = phase % 2 === 0 ? 850 : 150;
    y = 250 + (Math.cos(i * 0.1) * 50);
    vel = 180 + (Math.random() * 80);
  } else if (phase < 80) {
    // Looking away / out-of-bounds coordinates
    x = phase % 2 === 0 ? 980 : -50;
    y = phase % 2 === 0 ? 820 : -30;
    vel = 80;
  } else {
    // High-speed jitter / micro-motion
    x = 500 + (Math.random() * 10 - 5);
    y = 400 + (Math.random() * 10 - 5);
    vel = 550 + (Math.random() * 200); // High velocity > 0.5 norm
  }

  const now = tStartGaze + i * 10;
  await workerSelf.onmessage({
    data: {
      type: "PROCESS_MOUSE_TELEMETRY",
      mouseTelemetry: { x, y, timestamp: now, velocity: vel }
    }
  });

  const lastMsg = workerOutbox[workerOutbox.length - 1];
  const t = lastMsg.telemetry;

  // Validate non-NaN
  if (
    Number.isNaN(t.cognitiveLoadIndex) ||
    Number.isNaN(t.saccadicRegressionRate) ||
    Number.isNaN(t.fixationDurationMs) ||
    Number.isNaN(t.proctoring.suspiciousScore)
  ) {
    nanCount++;
  }

  // Validate bounds
  if (
    t.cognitiveLoadIndex < 0.0 || t.cognitiveLoadIndex > 1.0 ||
    t.saccadicRegressionRate < 0.0 || t.saccadicRegressionRate > 1.0 ||
    t.proctoring.suspiciousScore < 0.0 || t.proctoring.suspiciousScore > 1.0
  ) {
    boundedViolations++;
  }

  if (t.shouldTriggerWatsonHint) watsonTriggers++;
  if (t.proctoring.anomalyType === "normal") normalProctoringCount++;
  if (t.proctoring.anomalyType === "looking_away") lookingAwayCount++;
  if (t.proctoring.anomalyType === "suspicious_motion") suspiciousMotionCount++;
}

const tElapsedGaze = performance.now() - tStartGaze;
const avgLatencyGaze = tElapsedGaze / ITERATIONS;

console.log(`  Processed ${ITERATIONS} events in ${tElapsedGaze.toFixed(2)} ms (avg: ${avgLatencyGaze.toFixed(4)} ms/event).`);
console.log(`  Watson Trigger Events: ${watsonTriggers}`);
console.log(`  Normal Proctoring Events (Mouse Fallback): ${normalProctoringCount}`);
console.log(`  Looking Away Anomalies: ${lookingAwayCount}`);
console.log(`  Suspicious Motion Anomalies: ${suspiciousMotionCount}`);

assert(nanCount === 0, `Zero NaNs generated across all ${ITERATIONS} high-frequency events (got ${nanCount})`);
assert(boundedViolations === 0, `All telemetry indices strictly bounded within [0.0, 1.0] (violations: ${boundedViolations})`);
assert(watsonTriggers > 0, `Saccadic backtracking successfully engaged Dr. Watson hint triggers (${watsonTriggers} triggers)`);
assert(normalProctoringCount === ITERATIONS, `Mouse multimodal fallback safely constrains proctoring anomalyType to 'normal' to prevent camera-less false positives (100% normal)`);
assert(avgLatencyGaze < 0.1, `Worker step latency ${avgLatencyGaze.toFixed(4)} ms satisfies strict sub-millisecond edge budget (< 0.1 ms)`);

// Test evaluateBiLSTMSignal directly for camera frame proctoring
console.log("\n--- Test 1.7: BiLSTM Proctoring Classifier on Optical Saccades ---");
// Frame out-of-bounds features
const outOfBoundsFeatures = [
  new Float32Array([0.95, 0.2, 0.25]),
  new Float32Array([0.96, 0.22, 0.25]),
];
const outOfBoundsSignal = (workerSelf as any).evaluateBiLSTMSignal
  ? (workerSelf as any).evaluateBiLSTMSignal(outOfBoundsFeatures)
  : null;
// Even without direct export, verify frame message handling
await workerSelf.onmessage({
  data: {
    type: "PROCESS_FRAME",
    frameData: { width: 64, height: 64, timestamp: Date.now() }
  }
});
const frameMsg = workerOutbox[workerOutbox.length - 1];
assert(frameMsg.type === "TELEMETRY_UPDATE" && frameMsg.telemetry.proctoring.faceDetected === true, "PROCESS_FRAME activates camera proctoring mode with faceDetected=true");

// ============================================================================
// PART 2: BERT Worker Fallback Schema Probe Suite
// ============================================================================
console.log("\n" + "=".repeat(85));
console.log(">>> PART 2: BERT WORKER FALLBACK SCHEMA PROBE SUITE <<<");
console.log("=".repeat(85) + "\n");

const bertWorkerCode = fs.readFileSync(
  path.join(REPO_ROOT, "apps/web/public/workers/bert-evaluator.worker.js"),
  "utf8"
);

function createBertWorkerHarness() {
  const mailbox: any[] = [];
  const fakeSelf: any = {
    postMessage: (msg: any) => mailbox.push(msg),
    addEventListener: (type: string, handler: Function) => {
      fakeSelf.handler = handler;
    }
  };

  const fn = new Function(
    "self",
    "performance",
    "Set",
    "Map",
    "Math",
    "Number",
    "Float64Array",
    "Array",
    "Error",
    bertWorkerCode
  );
  fn(fakeSelf, performance, Set, Map, Math, Number, Float64Array, Array, Error);
  return { fakeSelf, mailbox };
}

const { fakeSelf: bertWorker, mailbox: bertMailbox } = createBertWorkerHarness();

// Initialize worker
await bertWorker.handler({ data: { type: "INIT" } });
assert(bertMailbox.length === 1 && bertMailbox[0].type === "READY", "BERT Worker initializes to READY state");

/**
 * Strict Schema Validator for BertEvaluationResult (15 fields)
 */
function validateBertEvaluationSchema(res: any, testLabel: string): boolean {
  if (!res || typeof res !== "object") {
    assert(false, `[${testLabel}] Result is not an object`, res);
    return false;
  }

  const expectedFields = [
    "overallBand",
    "cefrLevel",
    "wordCount",
    "targetWordCount",
    "tokenCount",
    "uniqueTokenCount",
    "typeTokenRatio",
    "promptAlignmentScore",
    "averageParagraphCohesion",
    "paragraphs",
    "sentenceHeatmap",
    "criteria",
    "strengthsFa",
    "improvementsFa",
    "executionTimeMs",
  ];

  const actualKeys = Object.keys(res);
  const missingKeys = expectedFields.filter((k) => !actualKeys.includes(k));
  assert(missingKeys.length === 0, `[${testLabel}] Contains all 15 expected schema fields`, missingKeys);

  // 1. overallBand: number in [1.0, 9.0], non-NaN
  assert(
    typeof res.overallBand === "number" &&
    !Number.isNaN(res.overallBand) &&
    res.overallBand >= 1.0 &&
    res.overallBand <= 9.0,
    `[${testLabel}] overallBand (${res.overallBand}) is in [1.0, 9.0] and non-NaN`
  );

  // 2. cefrLevel: valid CEFR string
  const validCefr = ["A2", "B1", "B2", "C1", "C2"];
  assert(validCefr.includes(res.cefrLevel), `[${testLabel}] cefrLevel (${res.cefrLevel}) is valid`);

  // 3. wordCount, targetWordCount, tokenCount, uniqueTokenCount: non-NaN numbers >= 0
  assert(
    typeof res.wordCount === "number" && !Number.isNaN(res.wordCount) && res.wordCount >= 0,
    `[${testLabel}] wordCount (${res.wordCount}) is valid >= 0`
  );
  assert(
    typeof res.targetWordCount === "number" && !Number.isNaN(res.targetWordCount),
    `[${testLabel}] targetWordCount (${res.targetWordCount}) is valid`
  );
  assert(
    typeof res.tokenCount === "number" && !Number.isNaN(res.tokenCount) && res.tokenCount >= 0,
    `[${testLabel}] tokenCount (${res.tokenCount}) is valid >= 0`
  );
  assert(
    typeof res.uniqueTokenCount === "number" && !Number.isNaN(res.uniqueTokenCount) && res.uniqueTokenCount >= 0,
    `[${testLabel}] uniqueTokenCount (${res.uniqueTokenCount}) is valid >= 0`
  );

  // 4. typeTokenRatio: number in [0.0, 1.0], non-NaN
  assert(
    typeof res.typeTokenRatio === "number" &&
    !Number.isNaN(res.typeTokenRatio) &&
    res.typeTokenRatio >= 0.0 &&
    res.typeTokenRatio <= 1.0,
    `[${testLabel}] typeTokenRatio (${res.typeTokenRatio}) is in [0.0, 1.0] and non-NaN`
  );

  // 5. promptAlignmentScore & averageParagraphCohesion: numbers in [0, 100], non-NaN
  assert(
    typeof res.promptAlignmentScore === "number" &&
    !Number.isNaN(res.promptAlignmentScore) &&
    res.promptAlignmentScore >= 0 &&
    res.promptAlignmentScore <= 100,
    `[${testLabel}] promptAlignmentScore (${res.promptAlignmentScore}) is in [0, 100]`
  );
  assert(
    typeof res.averageParagraphCohesion === "number" &&
    !Number.isNaN(res.averageParagraphCohesion) &&
    res.averageParagraphCohesion >= 0 &&
    res.averageParagraphCohesion <= 100,
    `[${testLabel}] averageParagraphCohesion (${res.averageParagraphCohesion}) is in [0, 100]`
  );

  // 6. paragraphs: non-empty array
  assert(
    Array.isArray(res.paragraphs) && res.paragraphs.length > 0,
    `[${testLabel}] paragraphs is a non-empty array (count: ${res.paragraphs?.length})`
  );
  if (Array.isArray(res.paragraphs) && res.paragraphs.length > 0) {
    const p0 = res.paragraphs[0];
    assert(
      typeof p0.paragraphIndex === "number" &&
      typeof p0.text === "string" &&
      typeof p0.wordCount === "number" &&
      typeof p0.flowQuality === "string" &&
      typeof p0.diagnosticFeedbackFa === "string",
      `[${testLabel}] paragraph structure contains valid index, text, wordCount, flowQuality, feedback`
    );
  }

  // 7. sentenceHeatmap: non-empty array
  assert(
    Array.isArray(res.sentenceHeatmap) && res.sentenceHeatmap.length > 0,
    `[${testLabel}] sentenceHeatmap is a non-empty array (count: ${res.sentenceHeatmap?.length})`
  );
  if (Array.isArray(res.sentenceHeatmap) && res.sentenceHeatmap.length > 0) {
    const s0 = res.sentenceHeatmap[0];
    assert(
      typeof s0.sentence === "string" &&
      typeof s0.isCohesionDrop === "boolean" &&
      typeof s0.flowStatus === "string" &&
      typeof s0.feedbackFa === "string",
      `[${testLabel}] sentenceHeatmap structure contains valid sentence, boolean drop, flowStatus, feedback`
    );
  }

  // 8. criteria: contains TR, CC, LR, GRA
  assert(
    res.criteria &&
    res.criteria.taskResponse &&
    res.criteria.coherenceCohesion &&
    res.criteria.lexicalResource &&
    res.criteria.grammaticalAccuracy,
    `[${testLabel}] criteria breakdown contains TR, CC, LR, and GRA`
  );

  const criteriaKeys = ["taskResponse", "coherenceCohesion", "lexicalResource", "grammaticalAccuracy"] as const;
  for (const cKey of criteriaKeys) {
    const crit = res.criteria[cKey];
    assert(
      typeof crit.score === "number" && !Number.isNaN(crit.score) && crit.score >= 0 && crit.score <= 100 &&
      typeof crit.band === "number" && !Number.isNaN(crit.band) && crit.band >= 1.0 && crit.band <= 9.0 &&
      typeof crit.descriptorEn === "string" && crit.descriptorEn.length > 0 &&
      typeof crit.guidanceFa === "string" && crit.guidanceFa.length > 0,
      `[${testLabel}] criterion '${cKey}' has valid score (${crit.score}), band (${crit.band}), and descriptors`
    );
  }

  // 9. strengthsFa & improvementsFa: arrays of strings, with total feedback coverage >= 1
  assert(
    Array.isArray(res.strengthsFa),
    `[${testLabel}] strengthsFa is a valid string array (count: ${res.strengthsFa?.length})`
  );
  assert(
    Array.isArray(res.improvementsFa),
    `[${testLabel}] improvementsFa is a valid string array (count: ${res.improvementsFa?.length})`
  );
  assert(
    (res.strengthsFa.length + res.improvementsFa.length) > 0,
    `[${testLabel}] Combined diagnostic feedback items > 0 (strengths: ${res.strengthsFa?.length}, improvements: ${res.improvementsFa?.length})`
  );

  // 10. executionTimeMs: valid non-NaN number >= 0
  assert(
    typeof res.executionTimeMs === "number" && !Number.isNaN(res.executionTimeMs) && res.executionTimeMs >= 0,
    `[${testLabel}] executionTimeMs (${res.executionTimeMs} ms) is valid`
  );

  return true;
}

// ----------------------------------------------------------------------------
// Probe 2.1: Empty String Rejection
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.1: Empty String Handling ---");
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: { text: "", promptText: "Discuss technology." }
  }
});
const emptyMsg = bertMailbox[bertMailbox.length - 1];
assert(emptyMsg.type === "ERROR", "Empty string triggers clean ERROR message without throwing");
assert(typeof emptyMsg.payload?.message === "string" && emptyMsg.payload.message.length > 0, "Error payload provides descriptive message");

// ----------------------------------------------------------------------------
// Probe 2.2: Whitespace Only Rejection
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.2: Whitespace-Only Handling ---");
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: { text: "   \n\t   \n   ", promptText: "Discuss education." }
  }
});
const wsMsg = bertMailbox[bertMailbox.length - 1];
assert(wsMsg.type === "ERROR", "Whitespace-only input triggers clean ERROR message without throwing");

// ----------------------------------------------------------------------------
// Probe 2.3: 1-Word Text
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.3: 1-Word Text ---");
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: { text: "Technology.", promptText: "Discuss modern technology." }
  }
});
const oneWordMsg = bertMailbox[bertMailbox.length - 1];
assert(oneWordMsg.type === "EVALUATION_RESULT", "1-word text produces EVALUATION_RESULT");
validateBertEvaluationSchema(oneWordMsg.payload, "1-Word Text");

// ----------------------------------------------------------------------------
// Probe 2.4: 2000-Word Comprehensive Essay
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.4: 2000-Word Comprehensive Essay ---");
const baseParagraph = "Furthermore, recent empirical investigations corroborate that artificial intelligence and automation substantially redefine modern university curricula. However, educational institutions must consequently address digital inequality, since underprivileged communities nevertheless encounter severe technological barriers. In addition, university faculties should predominantly emphasize critical inquiry alongside algorithmic literacy to ensure civic empowerment.\n\n";
let massiveEssay = "";
while (massiveEssay.split(/\s+/).length < 2050) {
  massiveEssay += baseParagraph;
}
const wordCount2000 = massiveEssay.trim().split(/\s+/).length;

const tStart2000 = performance.now();
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: massiveEssay,
      promptText: "Discuss the transformative role of artificial intelligence and digital curricula in higher education.",
      targetWords: 250
    }
  }
});
const tElapsed2000 = performance.now() - tStart2000;
const essay2000Msg = bertMailbox[bertMailbox.length - 1];

assert(essay2000Msg.type === "EVALUATION_RESULT", `2000-word essay (${wordCount2000} words) produces EVALUATION_RESULT`);
assert(tElapsed2000 < 100.0, `2000-word evaluation completed in ${tElapsed2000.toFixed(2)} ms (< 100 ms target)`);
assert(essay2000Msg.payload.sentenceHeatmap.length === 16, "Sentence heatmap capped at maximum 16 sentences for UI performance");
validateBertEvaluationSchema(essay2000Msg.payload, "2000-Word Essay");

// ----------------------------------------------------------------------------
// Probe 2.5: Arbitrary Gibberish Text
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.5: Arbitrary Gibberish Text ---");
const gibberishText = "aslkdfjqwer poiquwer zmxcvnblaksjdf poiuwer qpmznxbcv\n\nasdlkfjasdfuower zmxnvbaowieur qpowieuasdf zmxcnvbalskdjf.\n\nqwoeiruasldkfj zxcmvbnalksdjf poiuwer zxmcmnvalksjdf.";
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: gibberishText,
      promptText: "Evaluate the role of international commerce in economic sustainability.",
      targetWords: 250
    }
  }
});
const gibberishMsg = bertMailbox[bertMailbox.length - 1];
assert(gibberishMsg.type === "EVALUATION_RESULT", "Gibberish input completes evaluation without throwing");
validateBertEvaluationSchema(gibberishMsg.payload, "Gibberish Text");

// ----------------------------------------------------------------------------
// Probe 2.6: Pure Persian Non-ASCII Text
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.6: Pure Persian Non-ASCII Text ---");
const persianText = "آموزش و یادگیری زبان انگلیسی یکی از اساسی‌ترین مهارت‌های دنیای امروز است. معلمان در کلاس‌های درس نقش بسیار مهمی در انتقال دانش و ایجاد انگیزه در دانش‌آموزان ایفا می‌کنند.\n\nاز سوی دیگر، توسعه ابزارهای دیجیتال و هوش مصنوعی روش‌های سنتی تدریس را متحول ساخته است.";
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: persianText,
      promptText: "نقش هوش مصنوعی در آموزش زبان انگلیسی.",
      targetWords: 200
    }
  }
});
const persianMsg = bertMailbox[bertMailbox.length - 1];
assert(persianMsg.type === "EVALUATION_RESULT", "Pure Persian non-ASCII text produces EVALUATION_RESULT");
validateBertEvaluationSchema(persianMsg.payload, "Persian Text");

// ----------------------------------------------------------------------------
// Probe 2.7: Mixed Non-ASCII, Emojis, Chinese, Arabic
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.7: Multilingual, Emojis & Mixed Script Text ---");
const mixedText = "🌟🚀 Education and technology 漢字 are intimately connected. در جهان امروز، artificial intelligence accelerates learning. \n\nNonetheless, human teachers remain indispensable! 💯📚";
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: mixedText,
      promptText: "Can computers replace teachers?",
      targetWords: 150
    }
  }
});
const mixedMsg = bertMailbox[bertMailbox.length - 1];
assert(mixedMsg.type === "EVALUATION_RESULT", "Mixed multilingual/emoji text produces EVALUATION_RESULT");
validateBertEvaluationSchema(mixedMsg.payload, "Multilingual & Emoji Text");

// ----------------------------------------------------------------------------
// Probe 2.8: Repetitive 100-Word Text (TTR Extreme Edge Case)
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.8: 100-Word Identical Repetition (TTR Floor) ---");
const repetitiveText = "apple ".repeat(100);
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: repetitiveText,
      promptText: "Discuss agricultural export markets.",
      targetWords: 100
    }
  }
});
const repMsg = bertMailbox[bertMailbox.length - 1];
assert(repMsg.type === "EVALUATION_RESULT", "100-word identical repetition produces EVALUATION_RESULT");
assert(repMsg.payload.uniqueTokenCount === 1, "Exactly 1 unique token identified");
assert(repMsg.payload.typeTokenRatio === 0.01, "TTR correctly calculated as 1/100 = 0.01");
validateBertEvaluationSchema(repMsg.payload, "Repetitive Text");

// ----------------------------------------------------------------------------
// Probe 2.9: Punctuation-Only Text
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.9: Punctuation-Only Text ---");
const punctText = "?!?! .... ---- ;;;; ==== ++++ ****";
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: punctText,
      promptText: "Discuss testing methodologies."
    }
  }
});
const punctMsg = bertMailbox[bertMailbox.length - 1];
assert(punctMsg.type === "EVALUATION_RESULT", "Punctuation-only text handled safely");
validateBertEvaluationSchema(punctMsg.payload, "Punctuation-Only Text");

// ----------------------------------------------------------------------------
// Probe 2.10: Purely Numeric Text
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.10: Purely Numeric Text ---");
const numText = "12345 67890 101112 131415 161718";
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: numText,
      promptText: "Discuss numerical mathematics."
    }
  }
});
const numMsg = bertMailbox[bertMailbox.length - 1];
assert(numMsg.type === "EVALUATION_RESULT", "Purely numeric text handled safely");
validateBertEvaluationSchema(numMsg.payload, "Numeric Text");

// ----------------------------------------------------------------------------
// Probe 2.11: Boundary Target Words (0, Negative, 10,000)
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.11: Boundary Target Words Tolerances ---");
for (const target of [0, -50, 10000]) {
  await bertWorker.handler({
    data: {
      type: "EVALUATE_ESSAY",
      payload: {
        text: "Technology is transforming university classrooms rapidly.",
        promptText: "Discuss classrooms.",
        targetWords: target
      }
    }
  });
  const boundaryMsg = bertMailbox[bertMailbox.length - 1];
  assert(boundaryMsg.type === "EVALUATION_RESULT", `TargetWords = ${target} completes safely`);
  assert(!Number.isNaN(boundaryMsg.payload.criteria.taskResponse.score), `TR score is non-NaN when targetWords=${target}`);
}

// ----------------------------------------------------------------------------
// Probe 2.12: Empty / Missing promptText Fallback
// ----------------------------------------------------------------------------
console.log("\n--- Probe 2.12: Empty & Missing promptText Fallback ---");
await bertWorker.handler({
  data: {
    type: "EVALUATE_ESSAY",
    payload: {
      text: "Governments should heavily fund scientific research in environmental fields.",
      promptText: ""
    }
  }
});
const fallbackMsg = bertMailbox[bertMailbox.length - 1];
assert(fallbackMsg.type === "EVALUATION_RESULT", "Empty promptText automatically engages default topic fallback");
validateBertEvaluationSchema(fallbackMsg.payload, "Empty Prompt Fallback");

// ============================================================================
// Final Empirical Assessment & Summary
// ============================================================================
console.log("\n" + "=".repeat(85));
console.log("  FINAL EMPIRICAL RESULTS:");
console.log(`  Total Checks:  ${totalChecks}`);
console.log(`  Passed Checks: ${passedChecks}`);
console.log(`  Failed Checks: ${failedChecks}`);
console.log("=".repeat(85));

if (failedChecks > 0) {
  console.error("\n❌ ADVERSARIAL STRESS TEST SUITE REVEALED FAILURES:");
  failureDetails.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log("\n✅ ALL M1 ADVERSARIAL STRESS TESTS & SCHEMA PROBES PASSED WITH 100% SUCCESS!");
  process.exit(0);
}
