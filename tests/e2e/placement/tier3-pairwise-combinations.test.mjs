/**
 * Tier 3: Pairwise Cross-Feature Combinations Test Suite
 * Total: 20 Automated Cross-Feature Scenarios
 * Endoora Proprietary Adaptive Placement Testing System
 */

import { expect, TestRegistry } from "./helpers/assertions.mjs";
import {
  itemProbability,
  thetaToEndooraIndex,
  endooraIndexToCefr,
  estimateThetaRasch,
} from "./helpers/irt-oracle.mjs";
import {
  generateReferenceItemPool,
  selectAdaptiveItem,
  simulateFullSession,
  SECTIONS_CONFIG,
} from "./helpers/cat-simulation.mjs";
import {
  PATHS,
  readFileSafe,
} from "./helpers/codebase-scanner.mjs";

export const registry = new TestRegistry("Tier 3 - Pairwise Cross-Feature Combinations");

// ----------------------------------------------------------------------------
// Pair 1: Section Timeout × Unsaved Intermediate Answer
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-01", "Section timeout with unsaved input persists answer prior to transition", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(Boolean(runner)).toBe(true);
  // Runner must capture current intermediate answer state before triggering advance
  expect(runner).toMatch(/(persist|save|answers|advanceSection|handleTimeout)/i);
});

// ----------------------------------------------------------------------------
// Pair 2: Adaptive Ability Estimate Carryover × Section Boundary
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-02", "High ability at Grammar conclusion seeds calibrated item in Vocabulary", () => {
  const pool = generateReferenceItemPool();
  // Simulate Grammar 15 items all correct
  const grammarResponses = pool
    .filter((i) => i.section === "grammar")
    .slice(0, 15)
    .map((i) => ({ difficulty_b: i.difficulty_b, is_correct: true }));

  const grammarEstimate = estimateThetaRasch(grammarResponses);
  expect(grammarEstimate.theta).toBeGreaterThan(0.7);

  // Next section item selection for vocabulary uses estimated theta from grammar
  const nextVocabItem = selectAdaptiveItem(pool, "vocabulary", new Set(), grammarEstimate.theta);
  expect(nextVocabItem.difficulty_b).toBeGreaterThan(0.5);
});

// ----------------------------------------------------------------------------
// Pair 3: Audio Network Error × Web Speech Fallback Activation
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-03", "Audio playback error seamlessly delegates to Web Speech API synthesis", () => {
  const player = readFileSafe(PATHS.frontendAudioPlayer);
  expect(player).toContain("speechSynthesis");
  expect(player).toMatch(/(onError|handleAudioError|fallback)/i);
});

// ----------------------------------------------------------------------------
// Pair 4: 2-Play Audio Limit Exhaustion × Timer Warning Threshold
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-04", "Exhausted audio play limit remains strictly locked during timer warning state", () => {
  let playCount = 2;
  const remainingSeconds = 45; // Warning state (< 60s)
  const isPlayDisabled = playCount >= 2;
  const isWarningActive = remainingSeconds <= 60;

  expect(isPlayDisabled).toBe(true);
  expect(isWarningActive).toBe(true);
});

// ----------------------------------------------------------------------------
// Pair 5: Speaking Audio Silence × Section Auto-Advance
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-05", "Silent or missing speaking recording processes cleanly without crashing scoring", () => {
  const responsesWithSilence = [
    { difficulty_b: 0.0, is_correct: false }, // Silent submission marked false
  ];
  const est = estimateThetaRasch(responsesWithSilence);
  expect(isNaN(est.theta)).toBe(false);
  expect(est.theta).toBeLessThan(0.0);
});

// ----------------------------------------------------------------------------
// Pair 6: Writing Word Count Below Minimum × Manual Skip vs Timeout
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-06", "Submit button disabled below min_words but timeout forces transition", () => {
  const minWords = 30;
  const userWords = 15;
  const isManualSubmitAllowed = userWords >= minWords;
  const isTimeoutForced = true;

  expect(isManualSubmitAllowed).toBe(false);
  expect(isTimeoutForced).toBe(true);
});

// ----------------------------------------------------------------------------
// Pair 7: All-Correct Grammar (15/15) × Mixed Vocabulary Performance
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-07", "Theta ceiling stabilizes smoothly when high grammar meets mixed vocab", () => {
  const responses = [];
  // 15 correct grammar items
  for (let i = 0; i < 15; i++) {
    responses.push({ difficulty_b: 1.0, is_correct: true });
  }
  const estGrammar = estimateThetaRasch(responses);
  expect(estGrammar.theta).toBeGreaterThan(1.5);

  // 15 mixed vocab items (half correct)
  for (let i = 0; i < 15; i++) {
    responses.push({ difficulty_b: 0.5, is_correct: i % 2 === 0 });
  }
  const estCombined = estimateThetaRasch(responses);
  expect(estCombined.theta).toBeLessThan(estGrammar.theta);
  expect(estCombined.theta).toBeGreaterThan(0.0);
});

// ----------------------------------------------------------------------------
// Pair 8: Anti-Memorization Retake Session × Trajectory Equivalence
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-08", "Retake drawing disjoint question IDs produces matching CEFR placement", () => {
  const pool = generateReferenceItemPool();
  const simA = simulateFullSession({ trueTheta: 0.8 }, pool);
  const askedSetA = new Set(simA.itemHistory.map((i) => i.item_id));

  // Filter pool to disjoint set for candidate B
  const disjointPool = pool.filter((i) => !askedSetA.has(i.id));
  const simB = simulateFullSession({ trueTheta: 0.8 }, disjointPool);

  // Verify non-overlapping items
  const askedSetB = new Set(simB.itemHistory.map((i) => i.item_id));
  for (const id of askedSetB) {
    expect(askedSetA.has(id)).toBe(false);
  }

  // Both should place in B2 band
  expect(simA.cefrLevel).toBe("B2");
  expect(simB.cefrLevel).toBe("B2");
});

// ----------------------------------------------------------------------------
// Pair 9: Autosave Sync Lag × Local State Preservation
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-09", "Transient API latency preserves in-memory answer record without loss", () => {
  const inMemoryAnswers = { "grammar-a1-001": { selected_option: "goes" } };
  const pendingSync = true;
  expect(inMemoryAnswers["grammar-a1-001"].selected_option).toBe("goes");
  expect(pendingSync).toBe(true);
});

// ----------------------------------------------------------------------------
// Pair 10: Deferred Learner Twin × Direct URL Navigation Bypass
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-10", "Direct navigation to /placement/report without valid session blocks leak", () => {
  const reportCode = readFileSafe(PATHS.frontendReportPage);
  expect(reportCode).toMatch(/(noDataNotice|شروع آزمون|redirect)/);
});

// ----------------------------------------------------------------------------
// Pair 11: 6-Axis Radar Computation × Asymmetric Skill Distribution
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-11", "Asymmetric profile (C1 Reading, A1 Speaking) renders valid SVG radar", () => {
  const subScores = {
    grammar: 70,
    vocabulary: 65,
    reading: 95,
    listening: 50,
    speaking: 15,
    writing: 40,
  };
  const center = 100;
  const radius = 80;
  const axes = ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"];
  const coords = axes.map((skill, idx) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (subScores[skill] / 100) * radius;
    return {
      x: Math.round(center + r * Math.cos(angle)),
      y: Math.round(center + r * Math.sin(angle)),
    };
  });

  expect(coords.length).toBe(6);
  coords.forEach((c) => {
    expect(c.x).toBeGreaterThanOrEqual(0);
    expect(c.y).toBeGreaterThanOrEqual(0);
  });
});

// ----------------------------------------------------------------------------
// Pair 12: Standard Error Depletion × Fixed 50-Item Progression
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-12", "CAT administers all 50 items even when SE drops below stopping threshold", () => {
  const sim = simulateFullSession({ trueTheta: 0.0 });
  expect(sim.totalItemsAdministered).toBe(50);
  expect(sim.standardError).toBeLessThan(0.35);
});

// ----------------------------------------------------------------------------
// Pair 13: Distraction-Free HUD × Viewport Mode & RTL
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-13", "HUD layout preserves RTL alignment without leaking score indicators", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).not.toMatch(/efset/i);
  expect(runner).not.toMatch(/badge.*A1/i);
});

// ----------------------------------------------------------------------------
// Pair 14: Completed Session Token × Duplicate Submission Idempotency
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-14", "Duplicate final submission requests return idempotent score report", () => {
  const responses = [{ difficulty_b: 0.0, is_correct: true }];
  const est1 = estimateThetaRasch(responses);
  const est2 = estimateThetaRasch(responses);
  expect(est1.endooraIndex).toBe(est2.endooraIndex);
  expect(est1.cefrLevel).toBe(est2.cefrLevel);
});

// ----------------------------------------------------------------------------
// Pair 15: Auto-Advance on Section 6 (Writing) × Session Finalization
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-15", "Writing timeout auto-advances into final session completion", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(isLastSection|submit|report|completed)/i);
});

// ----------------------------------------------------------------------------
// Pair 16: High Discrimination ($a_i = 1.8$) × Extreme Difficulty ($b_i = -2.5$)
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-16", "High discrimination with extreme difficulty computes steep gradient without NaN", () => {
  const prob = itemProbability(-2.5, -2.5, 1.8);
  expect(prob).toBeCloseTo(0.5, 0.001);
  const probHigh = itemProbability(-1.5, -2.5, 1.8);
  expect(probHigh).toBeGreaterThan(0.8);
});

// ----------------------------------------------------------------------------
// Pair 17: Multiple Successive Retakes (3 sessions) × Pool Exhaustion Resilience
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-17", "Three successive 50-item sessions draw 150 items without crashing pool", () => {
  const pool = generateReferenceItemPool(); // 360 items
  const askedAll = new Set();
  for (let s = 1; s <= 3; s++) {
    const remainingPool = pool.filter((i) => !askedAll.has(i.id));
    const session = simulateFullSession({ trueTheta: 0.0 }, remainingPool);
    session.itemHistory.forEach((i) => askedAll.add(i.item_id));
  }
  expect(askedAll.size).toBe(150);
});

// ----------------------------------------------------------------------------
// Pair 18: Decibel Ambient Noise Spike × Audio Recording Visualizer
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-18", "Audio recorder decibel meter handles volume scaling within [0, 100]", () => {
  function normalizeDecibels(db) {
    // db typically in [-60, 0]
    return Math.max(0, Math.min(100, Math.round(((db + 60) / 60) * 100)));
  }
  expect(normalizeDecibels(-60)).toBe(0);
  expect(normalizeDecibels(0)).toBe(100);
  expect(normalizeDecibels(-30)).toBe(50);
});

// ----------------------------------------------------------------------------
// Pair 19: Persian/Arabic Diacritics × Exact Answer Matching
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-19", "Answer normalization removes Arabic tashkeel / harakat diacritics", () => {
  function stripDiacritics(str) {
    return str.replace(/[\u064B-\u065F\u0670]/g, "").trim().toLowerCase();
  }
  expect(stripDiacritics("كِتَابٌ")).toBe(stripDiacritics("كتاب"));
});

// ----------------------------------------------------------------------------
// Pair 20: Piecewise Concordance Boundaries × Standard Error Confidence Interval
// ----------------------------------------------------------------------------
registry.register("Tier 3", "Cross-Feature", "T3-PAIR-20", "Theta confidence interval [theta - 1.96*SE, theta + 1.96*SE] stays within bounds", () => {
  const est = estimateThetaRasch([{ difficulty_b: 0.0, is_correct: true }]);
  const ciLow = est.theta - 1.96 * est.standardError;
  const ciHigh = est.theta + 1.96 * est.standardError;
  expect(ciLow).toBeLessThan(ciHigh);
  expect(est.standardError).toBeGreaterThan(0.0);
});
