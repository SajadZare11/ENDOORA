import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated AI Engine & LLM Ops Hub System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/ai-engine-content.ts",
  "apps/web/lib/ai-engine-store.ts",
  "apps/web/app/api/admin/ai/route.ts",
  "apps/web/components/admin/ai-engine.module.css",
  "apps/web/components/admin/AiEngineConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/ai-engine.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerInfo",
  "headerTitle",
  "headerDesc",
  "headerActions",
  "btnResetSeed",
  "btnRefresh",
  "killSwitchBanner",
  "btnDeactivateKillSwitch",
  "statsGrid",
  "statCard",
  "statIcon",
  "statInfo",
  "statLabel",
  "statValue",
  "statSubtext",
  "tabsBar",
  "tabBtn",
  "tabActive",
  "tabBadge",
  "promptsLayout",
  "promptsSidebar",
  "promptCardItem",
  "promptCardActive",
  "editorPanel",
  "editorHeader",
  "editorTitle",
  "editorDesc",
  "editorActions",
  "btnSavePrompt",
  "btnDeployPrompt",
  "slidersGrid",
  "sliderGroup",
  "systemPromptTextarea",
  "modelSelectRow",
  "selectInput",
  "routingGrid",
  "budgetCard",
  "budgetBarContainer",
  "progressBarTrack",
  "progressBarFill",
  "btnKillSwitchToggle",
  "tableCard",
  "tableWrapper",
  "table",
  "statusHealthy",
  "desk3Layout",
  "benchmarkSection",
  "benchmarkGrid",
  "benchmarkCard",
  "bandBadge",
  "btnRunBenchmark",
  "playgroundCard",
  "playgroundTitle",
  "playgroundGrid",
  "playgroundInputArea",
  "playgroundTextarea",
  "btnRunPlayground",
  "playgroundOutputArea",
  "metricsRow",
  "subScoresGrid",
  "subScoreBox",
  "emptyState",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} CSS classes verified.`);

// 3. Verify MasterAdminConsole integration
const masterAdminContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/MasterAdminConsole.tsx"),
  "utf-8"
);
assert.ok(
  masterAdminContent.includes('import { AiEngineConsole } from "./AiEngineConsole";'),
  "MasterAdminConsole missing AiEngineConsole import"
);
assert.ok(
  masterAdminContent.includes('"ai-engine"'),
  "MasterAdminConsole missing 'ai-engine' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<AiEngineConsole />"),
  "MasterAdminConsole missing <AiEngineConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "ai-engine"'),
  "MasterAdminConsole missing activeTab ai-engine check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/ai/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "update_prompt",
  "update_routing",
  "toggle_killswitch",
  "update_budget",
  "deploy_prompt",
  "run_playground_test",
  "run_benchmark",
  "reset_seed",
];

for (const act of EXPECTED_ACTIONS) {
  assert.ok(
    routeContent.includes(`case "${act}":`),
    `API route missing case handler for action: ${act}`
  );
}
console.log(`✅ All ${EXPECTED_ACTIONS.length} API action handlers verified.`);

// 5. Test dynamic store operations in TypeScript/ESM
const storeModule = await import("../apps/web/lib/ai-engine-store.ts");

// Idempotent reset before tests
storeModule.resetAiEngineDataToInitial();

const initialData = storeModule.getAiEngineData();
assert.ok(Array.isArray(initialData.prompts), "Data should contain prompts array");
assert.ok(Array.isArray(initialData.routingRules), "Data should contain routingRules array");
assert.ok(Array.isArray(initialData.benchmarkCases), "Data should contain benchmarkCases array");
assert.strictEqual(initialData.prompts.length, 4, "Should have 4 initial prompt templates");
assert.strictEqual(initialData.routingRules.length, 4, "Should have 4 initial routing rules");
assert.strictEqual(initialData.benchmarkCases.length, 3, "Should have 3 initial benchmark cases");
console.log(
  `✅ Initial data verified: ${initialData.prompts.length} prompts, ${initialData.routingRules.length} routing rules, ${initialData.benchmarkCases.length} benchmarks.`
);

const initialStats = storeModule.getAiEngineStats();
assert.strictEqual(typeof initialStats.totalPromptsConfigured, "number");
assert.strictEqual(typeof initialStats.activeModelsCount, "number");
assert.strictEqual(typeof initialStats.totalTokensToday, "number");
assert.strictEqual(typeof initialStats.estCostTodayUsd, "number");
assert.strictEqual(typeof initialStats.benchmarkPassRatePercent, "number");
assert.strictEqual(initialStats.globalKillSwitchActive, false);
console.log(
  `✅ Stats calculation verified: Prompts: ${initialStats.totalPromptsConfigured}, Pass Rate: ٪${initialStats.benchmarkPassRatePercent}, KillSwitch: ${initialStats.globalKillSwitchActive}.`
);

// Test Update Prompt Template
const promptUpdateRes = storeModule.updatePromptTemplate(
  "prompt-ielts-001",
  {
    temperature: 0.25,
    maxOutputTokens: 2500,
  },
  "تستر ارشد هوش مصنوعی"
);
assert.ok(promptUpdateRes.success, "updatePromptTemplate should succeed");
assert.strictEqual(promptUpdateRes.prompt.temperature, 0.25);
assert.strictEqual(promptUpdateRes.prompt.maxOutputTokens, 2500);
assert.strictEqual(promptUpdateRes.prompt.updatedBy, "تستر ارشد هوش مصنوعی");
console.log(`✅ updatePromptTemplate verified: Updated prompt '${promptUpdateRes.prompt.name}' (Temp: ${promptUpdateRes.prompt.temperature}).`);

// Test Update Routing Rule
const routingUpdateRes = storeModule.updateRoutingRule("learner_twin", {
  primaryModel: "gemini-2.0-flash-exp",
  timeoutMs: 5000,
});
assert.ok(routingUpdateRes.success, "updateRoutingRule should succeed");
assert.strictEqual(routingUpdateRes.rule.primaryModel, "gemini-2.0-flash-exp");
assert.strictEqual(routingUpdateRes.rule.timeoutMs, 5000);
console.log(`✅ updateRoutingRule verified: ${routingUpdateRes.rule.capabilityLabel} routed to ${routingUpdateRes.rule.primaryModel}.`);

// Test Global Kill-Switch Activation & Guard
const killSwitchOn = storeModule.toggleGlobalKillSwitch(true, "تست امنیت سیستمی");
assert.ok(killSwitchOn.success, "toggleGlobalKillSwitch to true should succeed");
assert.strictEqual(killSwitchOn.safetyBudget.globalKillSwitch, true);

// Verify Playground test is blocked when Kill-Switch is ON
const blockedPlaygroundRes = storeModule.runPlaygroundTest({
  inputText: "This is a test essay to ensure kill-switch blocks requests.",
});
assert.strictEqual(blockedPlaygroundRes.success, false, "Playground test must fail when Kill-Switch is ON");
assert.ok(blockedPlaygroundRes.message.includes("قطع اضطراری"), "Should mention kill-switch reason");
console.log(`✅ Global Kill-Switch Guard verified: Blocked LLM execution while active.`);

// Deactivate Kill-Switch
const killSwitchOff = storeModule.toggleGlobalKillSwitch(false);
assert.ok(killSwitchOff.success, "toggleGlobalKillSwitch to false should succeed");
assert.strictEqual(killSwitchOff.safetyBudget.globalKillSwitch, false);
console.log(`✅ Kill-Switch Deactivation verified: Service restored.`);

// Test Live Playground Execution
const playgroundRes = storeModule.runPlaygroundTest({
  inputText: "Technology has fundamentally transformed how human beings communicate and work across international boundaries.",
  modelOverride: "gemini-1.5-pro",
});
assert.ok(playgroundRes.success, "runPlaygroundTest should succeed when Kill-Switch is OFF");
assert.strictEqual(playgroundRes.modelUsed, "gemini-1.5-pro");
assert.ok(playgroundRes.latencyMs > 0, "Should report latency");
assert.ok(playgroundRes.tokensUsed > 0, "Should report tokens used");
assert.ok(playgroundRes.rawResponse.overallBand >= 5.0, "Should return valid band score");
assert.ok(Array.isArray(playgroundRes.rawResponse.inlineCorrections), "Should return inline corrections");
console.log(
  `✅ runPlaygroundTest verified: Model: ${playgroundRes.modelUsed}, Band: ${playgroundRes.rawResponse.overallBand}, Latency: ${playgroundRes.latencyMs}ms.`
);

// Test Run Benchmark Case
const benchmarkRes = storeModule.runBenchmarkTest("bm-case-002");
assert.ok(benchmarkRes.success, "runBenchmarkTest should succeed");
assert.strictEqual(benchmarkRes.benchmarkCase.lastRunResult?.passed, true);
assert.strictEqual(benchmarkRes.benchmarkCase.lastRunResult?.assignedBand, 7.0);
console.log(
  `✅ runBenchmarkTest verified: Case '${benchmarkRes.benchmarkCase.title}' Passed with Band ${benchmarkRes.benchmarkCase.lastRunResult?.assignedBand}.`
);

// Test Deploy Prompt to Production
const deployRes = storeModule.deployPromptToProduction("prompt-ielts-001");
assert.ok(deployRes.success, "deployPromptToProduction should succeed");
assert.strictEqual(deployRes.prompt.isDeployed, true);
assert.strictEqual(deployRes.prompt.version, 8); // Was version 7, now 8
console.log(`✅ deployPromptToProduction verified: Promoted to production version v${deployRes.prompt.version}.`);

// Test Reset to Pristine Seed
storeModule.resetAiEngineDataToInitial();
const resetData = storeModule.getAiEngineData();
assert.strictEqual(resetData.prompts.length, 4);
assert.strictEqual(resetData.routingRules.length, 4);
assert.strictEqual(resetData.benchmarkCases.length, 3);
const resetIeltsPrompt = resetData.prompts.find((p) => p.id === "prompt-ielts-001");
assert.strictEqual(resetIeltsPrompt?.version, 7);
assert.strictEqual(resetIeltsPrompt?.temperature, 0.2);
console.log("✅ resetAiEngineDataToInitial successfully restored pristine seed data.");

console.log("\n🎉 ALL AI ENGINE & LLM OPS HUB SYSTEM INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
