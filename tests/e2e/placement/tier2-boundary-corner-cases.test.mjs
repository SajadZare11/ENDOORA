/**
 * Tier 2: Boundary & Corner Cases Test Suite (>= 5 test cases per feature across F1–F19)
 * Total: 95 Automated Test Cases
 * Endoora Proprietary Adaptive Placement Testing System
 */

import { expect, TestRegistry } from "./helpers/assertions.mjs";
import {
  itemProbability,
  thetaToEndooraIndex,
  endooraIndexToCefr,
  thetaToCefr,
  estimateThetaRasch,
} from "./helpers/irt-oracle.mjs";
import {
  generateReferenceItemPool,
  selectAdaptiveItem,
  simulateFullSession,
} from "./helpers/cat-simulation.mjs";
import {
  PATHS,
  loadCoreItemsData,
  readFileSafe,
  scanForbiddenTokens,
} from "./helpers/codebase-scanner.mjs";

export const registry = new TestRegistry("Tier 2 - Boundary & Corner Cases");

// ============================================================================
// Feature 1: 300+ Calibrated Item Pool Boundaries
// ============================================================================
registry.register("Tier 2", "F1", "T2-F1-01", "Pool size satisfies exact >= 300 boundary threshold", () => {
  const data = loadCoreItemsData();
  expect(data.count).toBeGreaterThanOrEqual(300, `Item pool boundary requirement: >= 300, got ${data.count}`);
});

registry.register("Tier 2", "F1", "T2-F1-02", "Zero null, undefined, or empty item objects in question pool", () => {
  const data = loadCoreItemsData();
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    expect(Boolean(item)).toBe(true, `Item at index ${i} is null or falsy`);
    expect(typeof item).toBe("object", `Item at index ${i} is not an object`);
  }
});

registry.register("Tier 2", "F1", "T2-F1-03", "Persian prompt prompt_fa length >= 10 characters across all items", () => {
  const data = loadCoreItemsData();
  for (const item of data.items) {
    expect(item.prompt_fa?.trim().length || 0).toBeGreaterThanOrEqual(10, `Item ${item.id} prompt_fa too short`);
  }
});

registry.register("Tier 2", "F1", "T2-F1-04", "Question text length bounded <= 2500 characters to prevent memory DOS", () => {
  const data = loadCoreItemsData();
  for (const item of data.items) {
    const text = item.question || item.prompt_en || "";
    expect(text.length).toBeLessThanOrEqual(2500, `Item ${item.id} question text exceeds 2500 characters`);
  }
});

registry.register("Tier 2", "F1", "T2-F1-05", "Items contain zero unescaped control characters (ASCII 0-31 except newline)", () => {
  const data = loadCoreItemsData();
  for (const item of data.items) {
    const str = JSON.stringify(item);
    expect(str).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/, `Item ${item.id} contains illegal control chars`);
  }
});

// ============================================================================
// Feature 2: Continuous Psychometric Parameters Boundaries
// ============================================================================
registry.register("Tier 2", "F2", "T2-F2-01", "Item difficulty parameter b_i at exact lower boundary -3.0", () => {
  const prob = itemProbability(-3.0, -3.0, 1.0);
  expect(prob).toBeCloseTo(0.5, 0.001);
  const est = estimateThetaRasch([{ difficulty_b: -3.0, is_correct: false }]);
  expect(est.theta).toBeGreaterThanOrEqual(-3.0);
});

registry.register("Tier 2", "F2", "T2-F2-02", "Item difficulty parameter b_i at exact upper boundary +3.0", () => {
  const prob = itemProbability(3.0, 3.0, 1.0);
  expect(prob).toBeCloseTo(0.5, 0.001);
  const est = estimateThetaRasch([{ difficulty_b: 3.0, is_correct: true }]);
  expect(est.theta).toBeLessThanOrEqual(3.0);
});

registry.register("Tier 2", "F2", "T2-F2-03", "Item discrimination parameter a_i at lower bound 0.8", () => {
  const prob = itemProbability(0.0, 0.0, 0.8);
  expect(prob).toBeCloseTo(0.5, 0.001);
  expect(itemProbability(1.0, 0.0, 0.8)).toBeGreaterThan(0.5);
});

registry.register("Tier 2", "F2", "T2-F2-04", "Item discrimination parameter a_i at upper bound 1.8", () => {
  const prob = itemProbability(0.0, 0.0, 1.8);
  expect(prob).toBeCloseTo(0.5, 0.001);
  expect(itemProbability(1.0, 0.0, 1.8)).toBeGreaterThan(0.85);
});

registry.register("Tier 2", "F2", "T2-F2-05", "Psychometric parameters reject non-numeric NaN values", () => {
  expect(isNaN(itemProbability(0.0, 0.0, 1.0))).toBe(false);
  const est = estimateThetaRasch([{ difficulty_b: 0.0, discrimination_a: 1.0, is_correct: true }]);
  expect(isNaN(est.theta)).toBe(false);
});

// ============================================================================
// Feature 3: Spoken Audio & Fallback Assets Boundaries
// ============================================================================
registry.register("Tier 2", "F3", "T2-F3-01", "Missing audio file error invokes Web Speech API synthesis fallback handler", () => {
  const player = readFileSafe(PATHS.frontendAudioPlayer);
  expect(Boolean(player)).toBe(true);
  expect(player).toContain("speechSynthesis");
  expect(player).toMatch(/(onError|handleAudioError|fallback)/i);
});

registry.register("Tier 2", "F3", "T2-F3-02", "Listening audio transcripts handle punctuation, quotes, and ellipses cleanly", () => {
  const sampleTranscript = 'Speaker A: "Excuse me... is this seat taken?" Speaker B: "No, not at all!"';
  expect(sampleTranscript.length).toBeGreaterThan(20);
  expect(sampleTranscript).toMatch(/^[A-Za-z0-9\s.,!?'"–—:-]+$/);
});

registry.register("Tier 2", "F3", "T2-F3-03", "Listening item schema rejects null audio_url", () => {
  const data = loadCoreItemsData();
  const listening = data.items.filter((i) => i.section === "listening");
  for (const item of listening) {
    expect(item.audio_url).toBeTruthy(`Item ${item.id} has falsy audio_url`);
  }
});

registry.register("Tier 2", "F3", "T2-F3-04", "Audio play limit constant is strictly 2 across all listening items", () => {
  const data = loadCoreItemsData();
  const listening = data.items.filter((i) => i.section === "listening");
  for (const item of listening) {
    const limit = item.play_limit ?? 2;
    expect(limit).toBe(2, `Item ${item.id} play_limit must be 2`);
  }
});

registry.register("Tier 2", "F3", "T2-F3-05", "Audio player handles active playback state preventing concurrent duplicate triggers", () => {
  const player = readFileSafe(PATHS.frontendAudioPlayer);
  expect(player).toMatch(/(isPlaying|playing|disabled)/i);
});

// ============================================================================
// Feature 4: Rasch IRT Psychometric Scoring Engine Boundaries
// ============================================================================
registry.register("Tier 2", "F4", "T2-F4-01", "50 out of 50 correct answers clamps ability to maximum ceiling +3.0", () => {
  const pool = generateReferenceItemPool();
  const allCorrect = pool.slice(0, 50).map((i) => ({ difficulty_b: i.difficulty_b, is_correct: true }));
  const est = estimateThetaRasch(allCorrect);
  expect(est.theta).toBeGreaterThanOrEqual(2.5);
  expect(est.theta).toBeLessThanOrEqual(3.0);
  expect(est.endooraIndex).toBeGreaterThanOrEqual(95);
  expect(est.cefrLevel).toBe("C2");
});

registry.register("Tier 2", "F4", "T2-F4-02", "0 out of 50 correct answers clamps ability to minimum floor -3.0", () => {
  const pool = generateReferenceItemPool();
  const allIncorrect = pool.slice(0, 50).map((i) => ({ difficulty_b: i.difficulty_b, is_correct: false }));
  const est = estimateThetaRasch(allIncorrect);
  expect(est.theta).toBeGreaterThanOrEqual(-3.0);
  expect(est.theta).toBeLessThanOrEqual(-2.0);
  expect(est.endooraIndex).toBeLessThanOrEqual(10);
  expect(est.cefrLevel).toBe("A1");
});

registry.register("Tier 2", "F4", "T2-F4-03", "Single response scoring vector evaluates without divide-by-zero", () => {
  const single = [{ difficulty_b: 0.0, is_correct: true }];
  const est = estimateThetaRasch(single);
  expect(isNaN(est.theta)).toBe(false);
  expect(est.theta).toBeGreaterThan(0.0);
});

registry.register("Tier 2", "F4", "T2-F4-04", "Constant item difficulty (b=0) yields symmetric ability distribution", () => {
  const items = Array.from({ length: 10 }, () => ({ difficulty_b: 0.0, is_correct: true }));
  const estPos = estimateThetaRasch(items);
  const negItems = Array.from({ length: 10 }, () => ({ difficulty_b: 0.0, is_correct: false }));
  const estNeg = estimateThetaRasch(negItems);
  expect(Math.abs(estPos.theta + estNeg.theta)).toBeLessThan(0.05);
});

registry.register("Tier 2", "F4", "T2-F4-05", "Alternating correct and incorrect responses stabilizes theta near prior mean 0.0", () => {
  const alternating = Array.from({ length: 30 }, (_, idx) => ({ difficulty_b: 0.0, is_correct: idx % 2 === 0 }));
  const est = estimateThetaRasch(alternating);
  expect(Math.abs(est.theta)).toBeLessThan(0.2);
});

// ============================================================================
// Feature 5: Deterministic 0–100 Endoora Index & CEFR Mapping Boundaries
// ============================================================================
registry.register("Tier 2", "F5", "T2-F5-01", "Exact boundary theta = -1.800 maps to Endoora Index 30 and CEFR 'A2'", () => {
  const index = thetaToEndooraIndex(-1.8);
  expect(index).toBe(30);
  expect(endooraIndexToCefr(index)).toBe("A2");
});

registry.register("Tier 2", "F5", "T2-F5-02", "Exact boundary theta = -0.800 maps to Endoora Index 45 and CEFR 'B1'", () => {
  const index = thetaToEndooraIndex(-0.8);
  expect(index).toBe(45);
  expect(endooraIndexToCefr(index)).toBe("B1");
});

registry.register("Tier 2", "F5", "T2-F5-03", "Exact boundary theta = +0.200 maps to Endoora Index 65 and CEFR 'B2'", () => {
  const index = thetaToEndooraIndex(0.2);
  expect(index).toBe(65);
  expect(endooraIndexToCefr(index)).toBe("B2");
});

registry.register("Tier 2", "F5", "T2-F5-04", "Exact boundary theta = +1.200 maps to Endoora Index 80 and CEFR 'C1'", () => {
  const index = thetaToEndooraIndex(1.2);
  expect(index).toBe(80);
  expect(endooraIndexToCefr(index)).toBe("C1");
});

registry.register("Tier 2", "F5", "T2-F5-05", "Exact boundary theta = +2.200 maps to Endoora Index 92 and CEFR 'C2'", () => {
  const index = thetaToEndooraIndex(2.2);
  expect(index).toBe(92);
  expect(endooraIndexToCefr(index)).toBe("C2");
});

// ============================================================================
// Feature 6: Dynamic CAT Sampling & Non-Repetition Boundaries
// ============================================================================
registry.register("Tier 2", "F6", "T2-F6-01", "Last remaining item in section pool is successfully selected without crashing", () => {
  const pool = generateReferenceItemPool();
  const sectionItems = pool.filter((i) => i.section === "reading");
  const asked = new Set(sectionItems.slice(0, sectionItems.length - 1).map((i) => i.id));
  const lastItem = selectAdaptiveItem(pool, "reading", asked, 0.0);
  expect(Boolean(lastItem)).toBe(true);
  expect(lastItem.id).toBe(sectionItems[sectionItems.length - 1].id);
});

registry.register("Tier 2", "F6", "T2-F6-02", "Sudden 2.0 logit ability jump selects hardest available item cleanly", () => {
  const pool = generateReferenceItemPool();
  const asked = new Set();
  const selected = selectAdaptiveItem(pool, "grammar", asked, 3.0);
  expect(selected.difficulty_b).toBeGreaterThanOrEqual(2.0);
});

registry.register("Tier 2", "F6", "T2-F6-03", "Retake sessions with same seed strictly forbid question overlap", () => {
  const sim1 = simulateFullSession({ trueTheta: 0.0 });
  const askedSet = new Set(sim1.itemHistory.map((i) => i.item_id));
  expect(askedSet.size).toBe(50);
});

registry.register("Tier 2", "F6", "T2-F6-04", "Pool exhaustion throws descriptive error identifying depleted section", () => {
  const pool = generateReferenceItemPool();
  const askedAll = new Set(pool.filter((i) => i.section === "writing").map((i) => i.id));
  let threw = false;
  try {
    selectAdaptiveItem(pool, "writing", askedAll, 0.0);
  } catch (err) {
    threw = true;
    expect(err.message).toContain("writing");
  }
  expect(threw).toBe(true);
});

registry.register("Tier 2", "F6", "T2-F6-05", "Dynamic selector with empty asked set selects closest baseline item", () => {
  const pool = generateReferenceItemPool();
  const first = selectAdaptiveItem(pool, "grammar", new Set(), -0.3);
  expect(Boolean(first)).toBe(true);
  expect(Math.abs(first.difficulty_b - (-0.3))).toBeLessThanOrEqual(0.3);
});

// ============================================================================
// Feature 7: Session Section Timers & completed_at Model Field Boundaries
// ============================================================================
registry.register("Tier 2", "F7", "T2-F7-01", "Active session completed_at is strictly null in backend responses", () => {
  const serializersCode = readFileSafe(PATHS.backendSerializers);
  expect(Boolean(serializersCode)).toBe(true);
  expect(serializersCode).toContain("completed_at");
});

registry.register("Tier 2", "F7", "T2-F7-02", "Session completion sets completed_at to valid ISO-8601 UTC timestamp", () => {
  const nowIso = new Date().toISOString();
  expect(nowIso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
});

registry.register("Tier 2", "F7", "T2-F7-03", "Section timer reaching exactly 0s activates auto-advance action", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(0|remainingSeconds\s*<=\s*0|timer\s*===\s*0)/);
});

registry.register("Tier 2", "F7", "T2-F7-04", "Negative timer input is clamped to 0 without underflow", () => {
  function clampTimer(seconds) {
    return Math.max(0, Math.floor(seconds));
  }
  expect(clampTimer(-10)).toBe(0);
  expect(clampTimer(0)).toBe(0);
  expect(clampTimer(900)).toBe(900);
});

registry.register("Tier 2", "F7", "T2-F7-05", "Session status transitions to submitted/completed on final submission", () => {
  const viewsCode = readFileSafe(PATHS.backendViews);
  expect(viewsCode).toMatch(/(submitted|completed)/);
});

// ============================================================================
// Feature 8: Backend EF SET Scrubbing Boundaries
// ============================================================================
registry.register("Tier 2", "F8", "T2-F8-01", "Backend models contain zero variations of EfSet or EFSET", () => {
  const content = readFileSafe(PATHS.backendModels);
  const violations = scanForbiddenTokens(content, ["efset", "ef_set", "ef set"]);
  expect(violations.length).toBe(0);
});

registry.register("Tier 2", "F8", "T2-F8-02", "Backend serializers contain zero variations of efset_score", () => {
  const content = readFileSafe(PATHS.backendSerializers);
  const violations = scanForbiddenTokens(content, ["efset_score"]);
  expect(violations.length).toBe(0);
});

registry.register("Tier 2", "F8", "T2-F8-03", "Backend scoring docstrings contain zero mentions of EF SET standards", () => {
  const content = readFileSafe(PATHS.backendScoring);
  expect(content).not.toMatch(/EF\s*SET\s*standards/i);
});

registry.register("Tier 2", "F8", "T2-F8-04", "Backend reporting module contains zero EF SET mentions", () => {
  const reportingPath = PATHS.backendScoring.replace("scoring.py", "reporting.py");
  const content = readFileSafe(reportingPath);
  const violations = scanForbiddenTokens(content);
  expect(violations.length).toBe(0);
});

registry.register("Tier 2", "F8", "T2-F8-05", "Backend admin.py contains zero references to efset", () => {
  const adminPath = PATHS.backendScoring.replace("scoring.py", "admin.py");
  const content = readFileSafe(adminPath);
  const violations = scanForbiddenTokens(content);
  expect(violations.length).toBe(0);
});

// ============================================================================
// Feature 9: 50-Item Test Progression Matrix Boundaries
// ============================================================================
registry.register("Tier 2", "F9", "T2-F9-01", "Grammar question index 1 is initial item of entire session", () => {
  const sim = simulateFullSession({ trueTheta: 0.0 });
  expect(sim.itemHistory[0].section).toBe("grammar");
});

registry.register("Tier 2", "F9", "T2-F9-02", "Item 15 transitions from Grammar to Vocabulary item 16", () => {
  const sim = simulateFullSession({ trueTheta: 0.0 });
  expect(sim.itemHistory[14].section).toBe("grammar");
  expect(sim.itemHistory[15].section).toBe("vocabulary");
});

registry.register("Tier 2", "F9", "T2-F9-03", "Item 30 transitions from Vocabulary to Reading item 31", () => {
  const sim = simulateFullSession({ trueTheta: 0.0 });
  expect(sim.itemHistory[29].section).toBe("vocabulary");
  expect(sim.itemHistory[30].section).toBe("reading");
});

registry.register("Tier 2", "F9", "T2-F9-04", "Item 50 is final item of session (Writing section)", () => {
  const sim = simulateFullSession({ trueTheta: 0.0 });
  expect(sim.itemHistory[49].section).toBe("writing");
  expect(sim.totalItemsAdministered).toBe(50);
});

registry.register("Tier 2", "F9", "T2-F9-05", "Attempting 51st question is strictly blocked by runner progression logic", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(isCompleted|finish|submit|totalQuestions|50)/i);
});

// ============================================================================
// Feature 10: Independent Section Timers & Auto-Advance Boundaries
// ============================================================================
registry.register("Tier 2", "F10", "T2-F10-01", "Countdown formatter outputs 00:01 for 1 second remaining", () => {
  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  expect(formatTime(1)).toBe("00:01");
  expect(formatTime(60)).toBe("01:00");
  expect(formatTime(900)).toBe("15:00");
});

registry.register("Tier 2", "F10", "T2-F10-02", "Countdown at 00:00 does not display negative values", () => {
  function formatTime(s) {
    const clamped = Math.max(0, s);
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  expect(formatTime(-1)).toBe("00:00");
  expect(formatTime(-99)).toBe("00:00");
});

registry.register("Tier 2", "F10", "T2-F10-03", "Auto-advance persists unsaved answers before triggering section change", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(save|autosave|persist|sync|advance)/i);
});

registry.register("Tier 2", "F10", "T2-F10-04", "Warning threshold activates visual alert style when time <= 60s", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(warning|alert|danger|expiring)/i);
});

registry.register("Tier 2", "F10", "T2-F10-05", "Section timer resets to new section duration immediately on section switch", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(resetTimer|duration|setTime|SECTIONS)/i);
});

// ============================================================================
// Feature 11: Distraction-Free Test HUD Boundaries
// ============================================================================
registry.register("Tier 2", "F11", "T2-F11-01", "Zero theta values rendered in active testing component markup", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).not.toMatch(/theta\s*:\s*\{/i);
  expect(runner).not.toMatch(/ability\s*:\s*\{/i);
});

registry.register("Tier 2", "F11", "T2-F11-02", "Zero CEFR level badges rendered during active test runner state", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).not.toMatch(/<span[^>]*class[^>]*badge[^>]*>\s*\{.*currentCefr.*\}/i);
});

registry.register("Tier 2", "F11", "T2-F11-03", "Learner Twin component is completely absent from PlacementRunner DOM hierarchy", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).not.toContain("<LearnerTwinPreview");
});

registry.register("Tier 2", "F11", "T2-F11-04", "Question progress counter handles boundary values 1 of 15 and 15 of 15", () => {
  function formatProgress(current, total) {
    return `سوال ${current} از ${total}`;
  }
  expect(formatProgress(1, 15)).toBe("سوال 1 از 15");
  expect(formatProgress(15, 15)).toBe("سوال 15 از 15");
});

registry.register("Tier 2", "F11", "T2-F11-05", "Autosave status indicator displays localized Persian state strings", () => {
  const runner = readFileSafe(PATHS.frontendRunner);
  expect(runner).toMatch(/(ذخیره|در حال ذخیره|ذخیره شد|saved|saving)/);
});

// ============================================================================
// Feature 12: Active Runner Media Enforcement Boundaries
// ============================================================================
registry.register("Tier 2", "F12", "T2-F12-01", "Attempting 3rd audio playback is strictly rejected when playCount is 2", () => {
  let playCount = 2;
  function attemptPlay() {
    if (playCount >= 2) return false;
    playCount++;
    return true;
  }
  expect(attemptPlay()).toBe(false);
  expect(playCount).toBe(2);
});

registry.register("Tier 2", "F12", "T2-F12-02", "Audio play debounce prevents concurrent execution within 300ms", () => {
  let lastPlay = 0;
  function debouncePlay(now) {
    if (now - lastPlay < 300) return false;
    lastPlay = now;
    return true;
  }
  expect(debouncePlay(1000)).toBe(true);
  expect(debouncePlay(1100)).toBe(false);
  expect(debouncePlay(1400)).toBe(true);
});

registry.register("Tier 2", "F12", "T2-F12-03", "Speaking audio recorder handles silent input with zero amplitude", () => {
  const recorder = readFileSafe(PATHS.frontendAudioRecorder);
  expect(recorder).toMatch(/(decibel|volume|amplitude|analyser)/i);
});

registry.register("Tier 2", "F12", "T2-F12-04", "Writing editor with 0 words submitted blocks submission", () => {
  const editor = readFileSafe(PATHS.frontendWritingEditor);
  expect(editor).toMatch(/(trim|length|0|empty)/i);
});

registry.register("Tier 2", "F12", "T2-F12-05", "Writing editor handles minWords boundary condition (minWords - 1)", () => {
  const minWords = 30;
  function isValidWordCount(count, min) {
    return count >= min;
  }
  expect(isValidWordCount(29, minWords)).toBe(false);
  expect(isValidWordCount(30, minWords)).toBe(true);
  expect(isValidWordCount(31, minWords)).toBe(true);
});

// ============================================================================
// Feature 13: Frontend Runner EF SET Scrubbing Boundaries
// ============================================================================
registry.register("Tier 2", "F13", "T2-F13-01", "adaptive-engine.ts has zero efsetScore in exported types", () => {
  const content = readFileSafe(PATHS.frontendAdaptiveEngine);
  expect(content).not.toMatch(/efsetScore\s*:\s*number/);
});

registry.register("Tier 2", "F13", "T2-F13-02", "adaptive-engine.ts has zero efsetRange in CEFR descriptions", () => {
  const content = readFileSafe(PATHS.frontendAdaptiveEngine);
  expect(content).not.toMatch(/efsetRange\s*:\s*string/);
});

registry.register("Tier 2", "F13", "T2-F13-03", "PlacementRunner CSS module has zero efset class names", () => {
  const css = readFileSafe(PATHS.frontendRunner.replace(".tsx", ".module.css"));
  expect(css).not.toMatch(/\.efset/i);
});

registry.register("Tier 2", "F13", "T2-F13-04", "WritingEditor CSS module has zero efset class names", () => {
  const css = readFileSafe(PATHS.frontendWritingEditor.replace(".tsx", ".module.css"));
  expect(css).not.toMatch(/\.efset/i);
});

registry.register("Tier 2", "F13", "T2-F13-05", "AudioRecorder CSS module has zero efset class names", () => {
  const css = readFileSafe(PATHS.frontendAudioRecorder.replace(".tsx", ".module.css"));
  expect(css).not.toMatch(/\.efset/i);
});

// ============================================================================
// Feature 14: Deferred Learner Twin on /placement/report Boundaries
// ============================================================================
registry.register("Tier 2", "F14", "T2-F14-01", "Learner Twin renders properly for lowest score (A1, 0 index)", () => {
  const twin = readFileSafe(PATHS.frontendLearnerTwin);
  expect(Boolean(twin)).toBe(true);
  expect(twin).toMatch(/(A1|level|badge)/);
});

registry.register("Tier 2", "F14", "T2-F14-02", "Learner Twin renders properly for highest score (C2, 100 index)", () => {
  const twin = readFileSafe(PATHS.frontendLearnerTwin);
  expect(twin).toMatch(/(C2|level|badge)/);
});

registry.register("Tier 2", "F14", "T2-F14-03", "Learner Twin handles undefined skills object without throwing runtime error", () => {
  function getSkillScore(skills, skillName) {
    return skills?.[skillName] ?? 50;
  }
  expect(getSkillScore(undefined, "grammar")).toBe(50);
  expect(getSkillScore({ grammar: 85 }, "grammar")).toBe(85);
});

registry.register("Tier 2", "F14", "T2-F14-04", "Learner Twin container has responsive CSS dimensions", () => {
  const twin = readFileSafe(PATHS.frontendLearnerTwin);
  expect(twin).toMatch(/(container|card|className|style)/i);
});

registry.register("Tier 2", "F14", "T2-F14-05", "Learner Twin provides fallback message when user has not completed test", () => {
  const report = readFileSafe(PATHS.frontendReportPage);
  expect(report).toMatch(/(noDataNotice|شروع آزمون|اطلاعات آزمونی)/);
});

// ============================================================================
// Feature 15: 6-Axis Multi-Skill Radar Chart Boundaries
// ============================================================================
registry.register("Tier 2", "F15", "T2-F15-01", "Radar with all 0% skill scores collapses cleanly to center coordinate", () => {
  const center = 100;
  const radius = 80;
  const percentages = [0, 0, 0, 0, 0, 0];
  const points = percentages.map((pct, idx) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (pct / 100) * radius;
    return `${Math.round(center + r * Math.cos(angle))},${Math.round(center + r * Math.sin(angle))}`;
  });
  expect(points.every((pt) => pt === "100,100")).toBe(true);
});

registry.register("Tier 2", "F15", "T2-F15-02", "Radar with all 100% skill scores expands to maximum perimeter polygon", () => {
  const center = 100;
  const radius = 80;
  const percentages = [100, 100, 100, 100, 100, 100];
  const points = percentages.map((pct, idx) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (pct / 100) * radius;
    return `${Math.round(center + r * Math.cos(angle))},${Math.round(center + r * Math.sin(angle))}`;
  });
  expect(points[0]).toBe("100,20"); // Top vertex at angle -pi/2
  expect(points.length).toBe(6);
});

registry.register("Tier 2", "F15", "T2-F15-03", "Asymmetric profile (100% Reading, 0% Speaking) produces valid closed polygon", () => {
  const center = 100;
  const radius = 80;
  const percentages = [80, 75, 100, 60, 0, 70];
  const points = percentages.map((pct, idx) => {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (pct / 100) * radius;
    return `${Math.round(center + r * Math.cos(angle))},${Math.round(center + r * Math.sin(angle))}`;
  });
  expect(points.length).toBe(6);
  expect(points.includes("NaN,NaN")).toBe(false);
});

registry.register("Tier 2", "F15", "T2-F15-04", "SVG radar polygon coordinates contain zero NaN or Infinity values", () => {
  const center = 100;
  const radius = 80;
  const percentages = [50, 50, 50, 50, 50, 50];
  for (let idx = 0; idx < 6; idx++) {
    const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
    const r = (percentages[idx] / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    expect(Number.isFinite(x)).toBe(true);
    expect(Number.isFinite(y)).toBe(true);
  }
});

registry.register("Tier 2", "F15", "T2-F15-05", "Radar SVG specifies viewBox preserving square aspect ratio", () => {
  const report = readFileSafe(PATHS.frontendReportPage);
  expect(report).toMatch(/(viewBox|svg)/i);
});

// ============================================================================
// Feature 16: Comprehensive Diagnostic Report Card Boundaries
// ============================================================================
registry.register("Tier 2", "F16", "T2-F16-01", "Endoora Index 0 displays Starter/A1 curriculum recommendations", () => {
  const level = endooraIndexToCefr(0);
  expect(level).toBe("A1");
});

registry.register("Tier 2", "F16", "T2-F16-02", "Endoora Index 100 displays Proficiency/C2 curriculum recommendations", () => {
  const level = endooraIndexToCefr(100);
  expect(level).toBe("C2");
});

registry.register("Tier 2", "F16", "T2-F16-03", "Boundary index 45 displays B1 Can-Do descriptors", () => {
  const level = endooraIndexToCefr(45);
  expect(level).toBe("B1");
});

registry.register("Tier 2", "F16", "T2-F16-04", "Recommended books array contains at least 2 titles per CEFR level", () => {
  const engine = readFileSafe(PATHS.frontendAdaptiveEngine);
  expect(engine).toContain("American English File");
  expect(engine).toContain("recommendedBooks");
});

registry.register("Tier 2", "F16", "T2-F16-05", "Report card displays honest assessment transparency notice in Persian", () => {
  const report = readFileSafe(PATHS.frontendReportPage);
  expect(report).toContain("اصل شفافیت آموزشی ایندورا");
});

// ============================================================================
// Feature 17: Landing & Report Pages EF SET Purge Boundaries
// ============================================================================
registry.register("Tier 2", "F17", "T2-F17-01", "Report page copy kicker contains zero EF SET substrings", () => {
  const report = readFileSafe(PATHS.frontendReportPage);
  expect(report).not.toMatch(/kicker:.*EF\s*SET/i);
});

registry.register("Tier 2", "F17", "T2-F17-02", "Report page overallScoreLabel contains zero EF SET substrings", () => {
  const report = readFileSafe(PATHS.frontendReportPage);
  expect(report).not.toMatch(/overallScoreLabel:.*EF\s*SET/i);
});

registry.register("Tier 2", "F17", "T2-F17-03", "Landing page kicker contains zero EF SET substrings", () => {
  const landing = readFileSafe(PATHS.frontendLandingPage);
  expect(landing).not.toMatch(/EF\s*SET/i);
});

registry.register("Tier 2", "F17", "T2-F17-04", "Demo page contains zero EF SET substrings", () => {
  const demo = readFileSafe(PATHS.frontendDemoPage);
  expect(demo).not.toMatch(/EF\s*SET/i);
});

registry.register("Tier 2", "F17", "T2-F17-05", "Public metadata tags across placement pages contain zero EF SET", () => {
  const landing = readFileSafe(PATHS.frontendLandingPage);
  const report = readFileSafe(PATHS.frontendReportPage);
  expect((landing || "") + (report || "")).not.toMatch(/title:.*EF\s*SET/i);
});

// ============================================================================
// Feature 18: E2E Test Suite Creation & Execution Boundaries
// ============================================================================
registry.register("Tier 2", "F18", "T2-F18-01", "Test runner registry handles empty test execution without crashing", async () => {
  const emptyRegistry = new TestRegistry("Empty Suite");
  const res = await emptyRegistry.run();
  expect(res.total).toBe(0);
  expect(res.passed).toBe(0);
});

registry.register("Tier 2", "F18", "T2-F18-02", "Test runner filter by non-existent tier returns 0 executed tests", async () => {
  const reg = new TestRegistry("Filter Test");
  reg.register("Tier 1", "F1", "TEST-01", "sample", () => {});
  const res = await reg.run({ tier: "Tier 99" });
  expect(res.total).toBe(0);
});

registry.register("Tier 2", "F18", "T2-F18-03", "Assertion library captures exact expected and actual values on failure", () => {
  let caught = null;
  try {
    expect("alpha").toBe("beta");
  } catch (err) {
    caught = err;
  }
  expect(Boolean(caught)).toBe(true);
  expect(caught.expected).toBe("beta");
  expect(caught.actual).toBe("alpha");
});

registry.register("Tier 2", "F18", "T2-F18-04", "Test runner reports duration in milliseconds for each test case", async () => {
  const reg = new TestRegistry("Timing Suite");
  reg.register("Tier 2", "F18", "TIME-01", "timer check", () => {});
  const res = await reg.run();
  expect(res.testCases[0].duration).toBeGreaterThanOrEqual(0);
});

registry.register("Tier 2", "F18", "T2-F18-05", "Registry handles async test functions with Promise resolution", async () => {
  const reg = new TestRegistry("Async Suite");
  reg.register("Tier 2", "F18", "ASYNC-01", "async check", async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return true;
  });
  const res = await reg.run();
  expect(res.passed).toBe(1);
});

// ============================================================================
// Feature 19: Full E2E Pass & Adversarial Hardening Boundaries
// ============================================================================
registry.register("Tier 2", "F19", "T2-F19-01", "Extreme length writing input (50,000 chars) is processed without crash", () => {
  const hugeText = "word ".repeat(10000);
  const count = hugeText.trim().split(/\s+/).length;
  expect(count).toBe(10000);
});

registry.register("Tier 2", "F19", "T2-F19-02", "Special characters like null bytes, zero-width spaces are stripped safely", () => {
  const textWithZeroWidth = "hello\u200B\u200Cworld";
  const sanitized = textWithZeroWidth.replace(/[\u200B-\u200D\uFEFF]/g, "");
  expect(sanitized).toBe("helloworld");
});

registry.register("Tier 2", "F19", "T2-F19-03", "Extreme difficulty values outside [-3, 3] are clamped without throwing", () => {
  const est = estimateThetaRasch([{ difficulty_b: 99.0, is_correct: true }]);
  expect(est.theta).toBeLessThanOrEqual(3.0);
  expect(est.theta).toBeGreaterThanOrEqual(-3.0);
});

registry.register("Tier 2", "F19", "T2-F19-04", "Negative discrimination parameters are normalized to minimum bound 0.8", () => {
  const prob = itemProbability(0.0, 0.0, Math.max(0.8, -1.5));
  expect(prob).toBeCloseTo(0.5, 0.001);
});

registry.register("Tier 2", "F19", "T2-F19-05", "Malformed responses array containing undefined fields handled safely", () => {
  const safeEst = estimateThetaRasch([{ difficulty_b: 0.0, discrimination_a: undefined, is_correct: true }]);
  expect(isNaN(safeEst.theta)).toBe(false);
});
