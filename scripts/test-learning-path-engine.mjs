import {
  CURRICULUM_UNITS,
  getInitialProgress,
  applyPlacementSync,
  completePathNode,
  passBossGate,
  getNextBestNode,
  getNodeStatus,
} from "../apps/web/lib/learning-path-storage.ts";

console.log("=== RUNNING LEARNING PATH & SKILL TREE ENGINE VERIFICATION ===");

// 1. Verify Curriculum Units Structure
if (!Array.isArray(CURRICULUM_UNITS) || CURRICULUM_UNITS.length !== 15) {
  throw new Error(`Expected exactly 15 curriculum units, got ${CURRICULUM_UNITS?.length}`);
}
console.log(`✓ Exactly 15 Curriculum Units loaded across A1-C1.`);

const requiredTiers = ["A1", "A2", "B1", "B2", "C1"];
for (const tier of requiredTiers) {
  const count = CURRICULUM_UNITS.filter((u) => u.tier === tier).length;
  if (count < 2) {
    throw new Error(`Tier ${tier} has insufficient units: ${count}`);
  }
}
console.log(`✓ All 5 CEFR Tiers (A1, A2, B1, B2, C1) verified.`);

// 2. Verify Node Completeness & Schema
let totalNodes = 0;
for (const unit of CURRICULUM_UNITS) {
  if (!unit.id || !unit.titleFa || !unit.titleEn || !unit.badgeIcon) {
    throw new Error(`Invalid unit metadata on unit ${unit.id}`);
  }
  if (!Array.isArray(unit.nodes) || unit.nodes.length !== 5) {
    throw new Error(`Unit ${unit.id} must have exactly 5 nodes, got ${unit.nodes?.length}`);
  }
  if (!Array.isArray(unit.bossQuestions) || unit.bossQuestions.length < 5) {
    throw new Error(`Unit ${unit.id} must have at least 5 boss questions, got ${unit.bossQuestions?.length}`);
  }

  for (const node of unit.nodes) {
    totalNodes++;
    if (!node.id || !node.unitId || !node.titleFa || !node.deepLinkHref || typeof node.xpReward !== "number") {
      throw new Error(`Invalid node schema: ${JSON.stringify(node)}`);
    }
  }

  for (const q of unit.bossQuestions) {
    if (!q.id || !q.promptFa || !q.questionTextEn || !Array.isArray(q.options) || typeof q.correctIndex !== "number") {
      throw new Error(`Invalid boss question schema in ${unit.id}: ${JSON.stringify(q)}`);
    }
    if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      throw new Error(`Out-of-range correctIndex in ${q.id}`);
    }
  }
}
console.log(`✓ ${totalNodes} Total nodes across 15 units verified with authentic 5-stage loop.`);

// 3. Setup mock localStorage for engine tests
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

// 4. Verify Initial Progress
const initial = getInitialProgress();
if (!initial.unlockedUnitIds.includes("unit-1")) {
  throw new Error("Unit 1 must be unlocked by default");
}
if (initial.completedNodeIds.length !== 0) {
  throw new Error("Initial progress should have 0 completed nodes");
}
console.log("✓ Default unplaced progress state verified.");

// 5. Verify Node Status Computation
const node1Status = getNodeStatus("u1-n1", "unit-1", initial);
if (node1Status !== "available") {
  throw new Error(`Node 1 in Unit 1 should be available, got ${node1Status}`);
}
const node2Status = getNodeStatus("u1-n2", "unit-1", initial);
if (node2Status !== "locked") {
  throw new Error(`Node 2 in Unit 1 should be locked before completing Node 1, got ${node2Status}`);
}
const unit2Node1Status = getNodeStatus("u2-n1", "unit-2", initial);
if (unit2Node1Status !== "locked") {
  throw new Error(`Unit 2 nodes should be locked until Unit 1 is cleared, got ${unit2Node1Status}`);
}
console.log("✓ Step-by-step lock and unlock mechanics verified.");

// 6. Verify Node Completion
const afterNode1 = completePathNode("u1-n1", 3);
if (!afterNode1.completedNodeIds.includes("u1-n1")) {
  throw new Error("Node 1 was not recorded as completed");
}
if (afterNode1.totalXp <= 0) {
  throw new Error("Completing node should award XP");
}
const node2StatusAfter = getNodeStatus("u1-n2", "unit-1", afterNode1);
if (node2StatusAfter !== "available") {
  throw new Error(`Node 2 should now be available after completing Node 1, got ${node2StatusAfter}`);
}
console.log("✓ Sequential node completion and XP accumulation verified.");

// 7. Verify Boss Gate / Test-Out Gate
const passResult = passBossGate("unit-1", 100);
if (!passResult.unlockedUnitIds.includes("unit-2")) {
  throw new Error("Passing Unit 1 boss gate must unlock Unit 2");
}
for (const n of CURRICULUM_UNITS[0].nodes) {
  if (!passResult.completedNodeIds.includes(n.id)) {
    throw new Error(`Test-out failed to mark node ${n.id} completed`);
  }
}
console.log("✓ Boss Gate pass & Test-out bypass verified (Unit 1 completed, Unit 2 unlocked).");

// 8. Verify Placement Test Auto-Sync
const freshProgress = {
  completedNodeIds: [],
  unlockedUnitIds: ["unit-1"],
  nodeStars: {},
  totalXp: 0,
  currentStreak: 1,
  lastActiveDate: new Date().toISOString(),
};

// Simulate placement at B1
const syncedB1 = applyPlacementSync(freshProgress, "B1");
// A1 has units 1, 2, 3; A2 has units 4, 5, 6
const a1Units = ["unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6"];
for (const uId of a1Units) {
  if (!syncedB1.unlockedUnitIds.includes(uId)) {
    throw new Error(`Placement B1 failed to unlock lower unit ${uId}`);
  }
}
if (!syncedB1.unlockedUnitIds.includes("unit-7")) {
  throw new Error("Placement B1 must unlock Unit 7 (first B1 unit)");
}
console.log(`✓ Placement auto-synchronization verified (B1 placement unlocked A1 & A2 and activated Unit 7).`);

// 9. Verify Next Best Node computation
const nextNodeInfo = getNextBestNode(syncedB1);
if (!nextNodeInfo || nextNodeInfo.unit.id !== "unit-7" || nextNodeInfo.node.id !== "u7-n1") {
  throw new Error(`Expected next node to be Unit 7 Node 1, got ${JSON.stringify(nextNodeInfo)}`);
}
console.log(`✓ getNextBestNode accurately recommended: ${nextNodeInfo.node.titleFa} (${nextNodeInfo.unit.titleFa}).`);

console.log("=== ALL LEARNING PATH & SKILL TREE TESTS PASSED SUCCESSFULLY! ===");
