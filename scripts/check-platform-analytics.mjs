import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Platform Analytics & Funnel Intelligence Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/platform-analytics-content.ts",
  "apps/web/lib/platform-analytics-store.ts",
  "apps/web/app/api/admin/analytics/route.ts",
  "apps/web/components/admin/platform-analytics.module.css",
  "apps/web/components/admin/PlatformAnalyticsConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/platform-analytics.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
  "btnResetSeed",
  "btnExportCsv",
  "btnRefresh",
  "timeframeBar",
  "timeframeBtnGroup",
  "timeframeBtn",
  "timeframeBtnActive",
  "statsGrid",
  "statCard",
  "statIcon",
  "statInfo",
  "statLabel",
  "statValue",
  "tabsBar",
  "tabBtn",
  "tabActive",
  "funnelGrid",
  "funnelCard",
  "funnelProgressBar",
  "funnelProgressFill",
  "tableCard",
  "tableWrapper",
  "table",
  "cohortCell",
  "cohortCellHigh",
  "cohortCellMed",
  "cohortCellLow",
  "btnActionWinback",
  "btnActionNudge",
  "btnActionDisabled",
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
  masterAdminContent.includes('import { PlatformAnalyticsConsole } from "./PlatformAnalyticsConsole";'),
  "MasterAdminConsole missing PlatformAnalyticsConsole import"
);
assert.ok(
  masterAdminContent.includes('"analytics"'),
  "MasterAdminConsole missing 'analytics' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<PlatformAnalyticsConsole />"),
  "MasterAdminConsole missing <PlatformAnalyticsConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "analytics"'),
  "MasterAdminConsole missing activeTab analytics check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/analytics/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "send_recovery_coupon",
  "send_motivation_nudge",
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
const storeModule = await import("../apps/web/lib/platform-analytics-store.ts");

// Idempotent reset before tests
storeModule.resetPlatformAnalyticsDataToInitial();

const initialData = storeModule.getPlatformAnalyticsData("30d");
assert.ok(Array.isArray(initialData.funnelStages), "Data should contain funnel stages");
assert.ok(Array.isArray(initialData.acquisitionChannels), "Data should contain channels");
assert.ok(Array.isArray(initialData.abandonedCarts), "Data should contain abandoned carts");
assert.ok(Array.isArray(initialData.cohorts), "Data should contain cohorts");
assert.ok(Array.isArray(initialData.atRiskLearners), "Data should contain at-risk learners");
assert.ok(Array.isArray(initialData.courseEconomics), "Data should contain course economics");
assert.strictEqual(initialData.funnelStages.length, 4, "Should have 4 stages in funnel");
console.log(`✅ Initial analytics data loaded: ${initialData.funnelStages.length} stages, ${initialData.abandonedCarts.length} carts.`);

const stats = storeModule.getPlatformAnalyticsStats("30d");
assert.strictEqual(typeof stats.overallConversionRate, "number");
assert.strictEqual(typeof stats.dauToMauRatio, "number");
assert.ok(stats.grossPlatformRevenueToman > 0, "Gross revenue should be greater than zero");
console.log(`✅ Stats verified: Conv Rate: ${stats.overallConversionRate}%, DAU/MAU: ${stats.dauToMauRatio}%, Revenue: ${stats.grossPlatformRevenueToman} Toman.`);

// Test Win-back Coupon action
const uncontactedCart = initialData.abandonedCarts.find((c) => c.recoveryStatus === "uncontacted");
assert.ok(uncontactedCart, "Should have at least one uncontacted cart");
const couponRes = storeModule.sendAbandonedCartRecoveryCoupon(uncontactedCart.id, 25);
assert.ok(couponRes.success, "sendAbandonedCartRecoveryCoupon should succeed");
assert.ok(couponRes.couponCode.startsWith("WINBACK-25-"), "Generated code should have prefix");
const afterCouponData = storeModule.getPlatformAnalyticsData("30d");
const updatedCart = afterCouponData.abandonedCarts.find((c) => c.id === uncontactedCart.id);
assert.strictEqual(updatedCart?.recoveryStatus, "coupon_sent");
console.log(`✅ sendAbandonedCartRecoveryCoupon verified for cart ${uncontactedCart.id} (Code: ${couponRes.couponCode}).`);

// Test Motivation Nudge action
const uncontactedLearner = initialData.atRiskLearners.find((l) => !l.nudgeSent);
assert.ok(uncontactedLearner, "Should have an uncontacted learner");
const nudgeRes = storeModule.sendLearnerMotivationNudge(uncontactedLearner.userId);
assert.ok(nudgeRes.success, "sendLearnerMotivationNudge should succeed");
const afterNudgeData = storeModule.getPlatformAnalyticsData("30d");
const updatedLearner = afterNudgeData.atRiskLearners.find((l) => l.userId === uncontactedLearner.userId);
assert.strictEqual(updatedLearner?.nudgeSent, true);
console.log(`✅ sendLearnerMotivationNudge verified for learner ${uncontactedLearner.userId}.`);

// Reset back to initial
storeModule.resetPlatformAnalyticsDataToInitial();
const resetData = storeModule.getPlatformAnalyticsData("30d");
const resetCart = resetData.abandonedCarts.find((c) => c.id === uncontactedCart.id);
assert.strictEqual(resetCart?.recoveryStatus, "uncontacted");
console.log("✅ resetPlatformAnalyticsDataToInitial successfully restored state.");

console.log("\n🎉 ALL PLATFORM ANALYTICS INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
