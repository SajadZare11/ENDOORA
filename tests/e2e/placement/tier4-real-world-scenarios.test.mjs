/**
 * Tier 4: Real-World Application Scenarios Test Suite
 * Full 50-Item End-to-End Simulated Candidate Sessions across A1–C2
 * Total: 5 Complete End-to-End Simulation Scenarios (250 Item Deliveries Evaluated)
 * Endoora Proprietary Adaptive Placement Testing System
 */

import { expect, TestRegistry } from "./helpers/assertions.mjs";
import { simulateFullSession, SECTIONS_CONFIG } from "./helpers/cat-simulation.mjs";

export const registry = new TestRegistry("Tier 4 - Real-World Application Scenarios");

// ============================================================================
// Scenario 1: True Beginner (Candidate Profile: A1 Starter)
// ============================================================================
registry.register("Tier 4", "Real-World", "T4-SCENARIO-01", "Full 50-item adaptive test run: True Beginner (A1 Starter)", () => {
  const profile = { trueTheta: -2.4, skillBiases: { speaking: -0.2 } };
  const session = simulateFullSession(profile);

  // 1. Verify exact 50-item progression matrix
  expect(session.totalItemsAdministered).toBe(50, "Total questions administered must be 50");
  expect(session.sectionBreakdown.grammar).toBe(15, "Grammar must administer 15 items");
  expect(session.sectionBreakdown.vocabulary).toBe(15, "Vocabulary must administer 15 items");
  expect(session.sectionBreakdown.reading).toBe(5, "Reading must administer 5 items");
  expect(session.sectionBreakdown.listening).toBe(5, "Listening must administer 5 items");
  expect(session.sectionBreakdown.speaking).toBe(5, "Speaking must administer 5 items");
  expect(session.sectionBreakdown.writing).toBe(5, "Writing must administer 5 items");

  // 2. Verify non-repetition
  expect(session.allItemIdsUnique).toBe(true, "All 50 administered items must be distinct");

  // 3. Verify psychometric convergence to A1
  expect(session.finalTheta).toBeLessThan(-1.8, `Expected theta < -1.8 for A1, got ${session.finalTheta}`);
  expect(session.endooraIndex).toBeGreaterThanOrEqual(0, "Endoora Index must be >= 0");
  expect(session.endooraIndex).toBeLessThanOrEqual(29, `Expected Endoora Index in [0, 29] for A1, got ${session.endooraIndex}`);
  expect(session.cefrLevel).toBe("A1", `Expected CEFR 'A1', got ${session.cefrLevel}`);

  // 4. Verify standard error precision
  expect(session.standardError).toBeLessThan(0.35, "Standard error must shrink below 0.35 after 50 items");
});

// ============================================================================
// Scenario 2: Elementary Learner (Candidate Profile: A2 Elementary)
// ============================================================================
registry.register("Tier 4", "Real-World", "T4-SCENARIO-02", "Full 50-item adaptive test run: Elementary Learner (A2)", () => {
  const profile = { trueTheta: -1.3 };
  const session = simulateFullSession(profile);

  // 1. Verify exact 50-item progression matrix
  expect(session.totalItemsAdministered).toBe(50);
  expect(session.allItemIdsUnique).toBe(true);

  // 2. Verify psychometric convergence to A2
  expect(session.finalTheta).toBeGreaterThanOrEqual(-1.8, `Expected theta >= -1.8, got ${session.finalTheta}`);
  expect(session.finalTheta).toBeLessThan(-0.8, `Expected theta < -0.8, got ${session.finalTheta}`);
  expect(session.endooraIndex).toBeGreaterThanOrEqual(30, `Expected Endoora Index >= 30, got ${session.endooraIndex}`);
  expect(session.endooraIndex).toBeLessThanOrEqual(44, `Expected Endoora Index <= 44, got ${session.endooraIndex}`);
  expect(session.cefrLevel).toBe("A2", `Expected CEFR 'A2', got ${session.cefrLevel}`);

  // 3. Verify 6-axis sub-scores are populated
  for (const sec of SECTIONS_CONFIG) {
    expect(session.skillSubScores[sec.section]).toBeGreaterThanOrEqual(0);
    expect(session.skillSubScores[sec.section]).toBeLessThanOrEqual(100);
  }
});

// ============================================================================
// Scenario 3: Intermediate Independent Learner (Candidate Profile: B1)
// ============================================================================
registry.register("Tier 4", "Real-World", "T4-SCENARIO-03", "Full 50-item adaptive test run: Intermediate Learner (B1)", () => {
  const profile = { trueTheta: -0.3 };
  const session = simulateFullSession(profile);

  // 1. Verify exact 50-item progression matrix
  expect(session.totalItemsAdministered).toBe(50);
  expect(session.allItemIdsUnique).toBe(true);

  // 2. Verify psychometric convergence to B1
  expect(session.finalTheta).toBeGreaterThanOrEqual(-0.8, `Expected theta >= -0.8, got ${session.finalTheta}`);
  expect(session.finalTheta).toBeLessThan(0.2, `Expected theta < 0.2, got ${session.finalTheta}`);
  expect(session.endooraIndex).toBeGreaterThanOrEqual(45, `Expected Endoora Index >= 45, got ${session.endooraIndex}`);
  expect(session.endooraIndex).toBeLessThanOrEqual(64, `Expected Endoora Index <= 64, got ${session.endooraIndex}`);
  expect(session.cefrLevel).toBe("B1", `Expected CEFR 'B1', got ${session.cefrLevel}`);
});

// ============================================================================
// Scenario 4: Upper-Intermediate Vantage (Candidate Profile: B2)
// ============================================================================
registry.register("Tier 4", "Real-World", "T4-SCENARIO-04", "Full 50-item adaptive test run: Upper-Intermediate (B2)", () => {
  const profile = { trueTheta: 0.7 };
  const session = simulateFullSession(profile);

  // 1. Verify exact 50-item progression matrix
  expect(session.totalItemsAdministered).toBe(50);
  expect(session.allItemIdsUnique).toBe(true);

  // 2. Verify psychometric convergence to B2
  expect(session.finalTheta).toBeGreaterThanOrEqual(0.2, `Expected theta >= 0.2, got ${session.finalTheta}`);
  expect(session.finalTheta).toBeLessThan(1.2, `Expected theta < 1.2, got ${session.finalTheta}`);
  expect(session.endooraIndex).toBeGreaterThanOrEqual(65, `Expected Endoora Index >= 65, got ${session.endooraIndex}`);
  expect(session.endooraIndex).toBeLessThanOrEqual(79, `Expected Endoora Index <= 79, got ${session.endooraIndex}`);
  expect(session.cefrLevel).toBe("B2", `Expected CEFR 'B2', got ${session.cefrLevel}`);
});

// ============================================================================
// Scenario 5: Proficient Near-Native Scholar (Candidate Profile: C2 Mastery)
// ============================================================================
registry.register("Tier 4", "Real-World", "T4-SCENARIO-05", "Full 50-item adaptive test run: Proficient Scholar (C2 Mastery)", () => {
  const profile = { trueTheta: 2.6 };
  const session = simulateFullSession(profile);

  // 1. Verify exact 50-item progression matrix
  expect(session.totalItemsAdministered).toBe(50);
  expect(session.allItemIdsUnique).toBe(true);

  // 2. Verify psychometric convergence to C2
  expect(session.finalTheta).toBeGreaterThanOrEqual(2.2, `Expected theta >= 2.2, got ${session.finalTheta}`);
  expect(session.endooraIndex).toBeGreaterThanOrEqual(92, `Expected Endoora Index >= 92, got ${session.endooraIndex}`);
  expect(session.endooraIndex).toBeLessThanOrEqual(100, `Expected Endoora Index <= 100, got ${session.endooraIndex}`);
  expect(session.cefrLevel).toBe("C2", `Expected CEFR 'C2', got ${session.cefrLevel}`);
});
