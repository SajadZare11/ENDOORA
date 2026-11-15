import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Security Command, Live Active Sessions & Threat Defense Room Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/security-command-content.ts",
  "apps/web/lib/security-command-store.ts",
  "apps/web/app/api/admin/security/route.ts",
  "apps/web/components/admin/security-command.module.css",
  "apps/web/components/admin/SecurityCommandConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/security-command.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
  "btnResetSeed",
  "btnRefresh",
  "maintenanceAlertBanner",
  "statsGrid",
  "statCard",
  "statIcon",
  "statInfo",
  "statLabel",
  "statValue",
  "tabsBar",
  "tabBtn",
  "tabActive",
  "filterBar",
  "searchInput",
  "selectInput",
  "btnAddRule",
  "btnAddWhitelist",
  "tableWrapper",
  "table",
  "riskLow",
  "riskMedium",
  "riskHigh",
  "riskCritical",
  "threatScoreBadge",
  "btnActionKill",
  "btnActionForceLogout",
  "btnActionUnblock",
  "maintenanceGrid",
  "maintenanceCard",
  "formGroup",
  "formLabel",
  "formInput",
  "formTextarea",
  "toggleSwitchContainer",
  "previewContainer",
  "modalOverlay",
  "modalContent",
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
  masterAdminContent.includes('import { SecurityCommandConsole } from "./SecurityCommandConsole";'),
  "MasterAdminConsole missing SecurityCommandConsole import"
);
assert.ok(
  masterAdminContent.includes('"security"'),
  "MasterAdminConsole missing 'security' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<SecurityCommandConsole />"),
  "MasterAdminConsole missing <SecurityCommandConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "security"'),
  "MasterAdminConsole missing activeTab security check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/security/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "kill_session",
  "force_logout_user",
  "block_ip",
  "unblock_ip",
  "whitelist_ip",
  "toggle_maintenance",
  "update_maintenance_config",
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
const storeModule = await import("../apps/web/lib/security-command-store.ts");

// Idempotent reset before tests
storeModule.resetSecurityCommandDataToInitial();

const initialData = storeModule.getSecurityCommandData();
assert.ok(Array.isArray(initialData.sessions), "Data should contain sessions array");
assert.ok(Array.isArray(initialData.rules), "Data should contain rules array");
assert.ok(initialData.maintenanceConfig, "Data should contain maintenanceConfig");
assert.ok(initialData.sessions.length >= 4, "Should have initial active sessions");
console.log(`✅ Initial data verified: ${initialData.sessions.length} sessions, ${initialData.rules.length} rules.`);

const initialStats = storeModule.getSecurityCommandStats();
assert.strictEqual(typeof initialStats.totalActiveSessions, "number");
assert.strictEqual(typeof initialStats.suspiciousSessionsCount, "number");
assert.strictEqual(typeof initialStats.activeBlockedIps, "number");
assert.strictEqual(typeof initialStats.isMaintenanceActive, "boolean");
console.log(`✅ Stats calculation verified: ${initialStats.totalActiveSessions} active, ${initialStats.suspiciousSessionsCount} suspicious.`);

// Test Kill Session
const sessionToKill = initialData.sessions[1].id;
const killRes = storeModule.killSession(sessionToKill);
assert.ok(killRes.success, "killSession should return success");
const afterKillData = storeModule.getSecurityCommandData();
assert.ok(
  !afterKillData.sessions.some((s) => s.id === sessionToKill),
  "Session should be removed from active sessions"
);
console.log(`✅ killSession successfully revoked session ${sessionToKill}.`);

// Test Force Logout User
const userToLogout = initialData.sessions[2].userId;
const forceLogoutRes = storeModule.forceLogoutAllUserSessions(userToLogout);
assert.ok(forceLogoutRes.success, "forceLogoutAllUserSessions should return success");
assert.ok(forceLogoutRes.removedCount >= 1, "Should report at least 1 session removed");
console.log(`✅ forceLogoutAllUserSessions revoked all sessions for user ${userToLogout}.`);

// Test Block IP
const testIp = "198.51.100.99";
const blockRes = storeModule.blockIp({
  ipAddress: testIp,
  reason: "تست نفوذ خودکار آزمایشی",
  duration: "24_hours",
  attackVector: "brute_force_login",
  threatScore: 94,
});
assert.ok(blockRes.success, "blockIp should return success");
assert.strictEqual(blockRes.rule.ipAddress, testIp);
assert.strictEqual(blockRes.rule.ruleType, "blacklist");
assert.strictEqual(blockRes.rule.status, "active");
console.log(`✅ blockIp successfully created blacklist rule for ${testIp}.`);

// Test Unblock IP
const unblockRes = storeModule.unblockIp(blockRes.rule.id);
assert.ok(unblockRes.success, "unblockIp should return success");
const ruleAfterUnblock = storeModule
  .getSecurityCommandData()
  .rules.find((r) => r.id === blockRes.rule.id);
assert.strictEqual(ruleAfterUnblock?.status, "lifted");
console.log(`✅ unblockIp successfully lifted rule ${blockRes.rule.id}.`);

// Test Whitelist IP
const whitelistIpAddress = "192.168.10.50";
const wlRes = storeModule.whitelistIp({
  ipAddress: whitelistIpAddress,
  reason: "سرور مانیتورینگ اختصاصی",
});
assert.ok(wlRes.success, "whitelistIp should return success");
assert.strictEqual(wlRes.rule.ruleType, "whitelist");
console.log(`✅ whitelistIp successfully added ${whitelistIpAddress} to whitelist.`);

// Test Maintenance Mode Toggle & Config
const maintRes = storeModule.updateMaintenanceConfig({
  isMaintenanceActive: true,
  headline: "تعمیرات فوری شبکه",
  userMessage: "پلتفرم تا ۳۰ دقیقه دیگر بازمی‌گردد.",
  estimatedEndTime: "ساعت ۱۸:۰۰",
  whitelistedAdminIps: ["127.0.0.1", "5.200.14.88"],
});
assert.ok(maintRes.success, "updateMaintenanceConfig should return success");
assert.strictEqual(maintRes.config.isMaintenanceActive, true);
assert.strictEqual(maintRes.config.headline, "تعمیرات فوری شبکه");
console.log("✅ Maintenance mode update & lockdown toggle verified.");

// Reset to initial clean state
storeModule.resetSecurityCommandDataToInitial();
const resetData = storeModule.getSecurityCommandData();
assert.strictEqual(resetData.maintenanceConfig.isMaintenanceActive, false);
console.log("✅ resetSecurityCommandDataToInitial verified.");

console.log("\n🎉 ALL SECURITY COMMAND INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
