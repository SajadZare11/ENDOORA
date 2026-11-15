import { DktEngine } from "../apps/web/lib/dkt-engine/dkt-engine.ts";
import { AEF_60_CONCEPTS } from "../apps/web/lib/dkt-engine/concepts.ts";

console.log("=== Testing DKT-Forget Neural GRU Engine ===");

// 1. Singleton initialization
const engine = DktEngine.getInstance();
engine.resetState();

const initialPreds = engine.getPredictions();
console.log("Initial overall retention index:", initialPreds.overallRetentionIndex, "%");
console.log("Total concepts tracked:", Object.keys(initialPreds.conceptMastery).length);

if (Object.keys(initialPreds.conceptMastery).length !== 60) {
  throw new Error("Expected exactly 60 tracked concepts");
}

// 2. Interaction Step 1: Correct answer with fast reaction (600ms)
const testConcept = AEF_60_CONCEPTS[0]; // a1-01 Subject pronouns & to be
const baselineProb = initialPreds.conceptMastery[testConcept.id];
console.log(`Baseline recall probability for ${testConcept.id} (${testConcept.titleEn}):`, (baselineProb * 100).toFixed(2) + "%");

const resAfterCorrect = engine.recordInteraction({
  conceptId: testConcept.id,
  isCorrect: true,
  isTrap: false,
  latencyMs: 600,
});

const probAfterCorrect = resAfterCorrect.conceptMastery[testConcept.id];
console.log(`Recall after 1 fast correct answer:`, (probAfterCorrect * 100).toFixed(2) + "%");
if (probAfterCorrect <= baselineProb) {
  throw new Error("Expected recall probability to increase after correct answer");
}

// 3. Interaction Step 2: Trap triggered with high hesitation (4500ms)
const testConcept2 = AEF_60_CONCEPTS[1]; // a1-02 Do & does
const baselineProb2 = resAfterCorrect.conceptMastery[testConcept2.id];

const resAfterTrap = engine.recordInteraction({
  conceptId: testConcept2.id,
  isCorrect: false,
  isTrap: true,
  latencyMs: 4500,
});

const probAfterTrap = resAfterTrap.conceptMastery[testConcept2.id];
console.log(`Recall for ${testConcept2.id} after Persian L1 trap with hesitation:`, (probAfterTrap * 100).toFixed(2) + "%");
if (probAfterTrap >= baselineProb2) {
  throw new Error("Expected recall probability to decrease after trap");
}

// 4. Verify Domain Aggregations & Radar metrics
console.log("\n--- Domain Mastery Breakdown ---");
for (const [dom, data] of Object.entries(resAfterTrap.domainMastery)) {
  console.log(`Domain [${dom}] (${data.titleEn}): Current = ${(data.currentRecallProb * 100).toFixed(1)}% | 7-day decay = ${(data.projectedDecay7Days * 100).toFixed(1)}% | Status = ${data.status}`);
}

// 5. Adaptive ZPD Circuit Selection
const mockCircuits = [
  { id: "c1", titleFa: "مدار ۱", titleEn: "Circuit 1", targetConcept: "Subject Pronouns & Verb To Be", aefReference: "", startingPrompt: "She", translationFa: "", nodes: [] },
  { id: "c2", titleFa: "مدار ۲", titleEn: "Circuit 2", targetConcept: "Do & Does Question Matrix", aefReference: "", startingPrompt: "Do", translationFa: "", nodes: [] },
];

const pick = engine.pickAdaptiveCircuit(mockCircuits, "A1", 2, 0);
console.log(`\nAdaptive Circuit Pick: ${pick.selectedCircuit.titleEn} (Target Concept: ${pick.targetConceptId}, Recall: ${(pick.recallProb * 100).toFixed(1)}%, ZPD: ${pick.isZpdTargeted})`);

console.log("\n=== ALL DKT-FORGET ENGINE TESTS PASSED SUCCESSFULLY! ===");
