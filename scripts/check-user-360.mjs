import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Student & User 360 System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/admin-users-content.ts",
  "apps/web/lib/admin-users-store.ts",
  "apps/web/app/api/admin/users/route.ts",
  "apps/web/components/admin/AdminUsersManager.tsx",
  "apps/web/components/admin/admin-users.module.css",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/admin-users.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "kpiGrid",
  "kpiCard",
  "pulseWarningBadge",
  "toolbarCard",
  "statusTabsRow",
  "table",
  "modalBackdrop",
  "modalContent",
  "stepperNav",
  "stepTab",
  "dossierGrid",
  "coursesList",
  "courseCard",
  "sessionsList",
  "walletBanner",
  "walletAdjustCard",
  "strikesList",
  "strikeCard",
  "newStrikeBox",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} CSS classes verified.`);

// 3. Read and verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/users/route.ts"),
  "utf-8"
);
assert.ok(routeContent.includes("export async function GET"), "API route must export GET");
assert.ok(routeContent.includes("export async function POST"), "API route must export POST");
assert.ok(routeContent.includes("adjust_wallet"), "API route must handle adjust_wallet action");
assert.ok(routeContent.includes("issue_strike"), "API route must handle issue_strike action");
assert.ok(routeContent.includes("pardon_strike"), "API route must handle pardon_strike action");
assert.ok(routeContent.includes("grant_course"), "API route must handle grant_course action");
assert.ok(routeContent.includes("reset_quiz"), "API route must handle reset_quiz action");
assert.ok(routeContent.includes("update_level"), "API route must handle update_level action");
assert.ok(routeContent.includes("update_role"), "API route must handle update_role action");
assert.ok(routeContent.includes("toggle_active"), "API route must handle toggle_active action");
assert.ok(routeContent.includes("recordAuditLog"), "API route must record audit log");
console.log("✅ API Route specification verified.");

// 4. Verify 5-tab dossier in component
const componentContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/AdminUsersManager.tsx"),
  "utf-8"
);
assert.ok(componentContent.includes("activeDossierTab === 1"), "Dossier must support Tab 1 (Identity & CEFR)");
assert.ok(componentContent.includes("activeDossierTab === 2"), "Dossier must support Tab 2 (Courses & Academics)");
assert.ok(componentContent.includes("activeDossierTab === 3"), "Dossier must support Tab 3 (Sessions & Attendance)");
assert.ok(componentContent.includes("activeDossierTab === 4"), "Dossier must support Tab 4 (Wallet & Ledger)");
assert.ok(componentContent.includes("activeDossierTab === 5"), "Dossier must support Tab 5 (Strikes & Security)");
assert.ok(componentContent.includes("handleAdjustWalletSubmit"), "Component must handle wallet adjustment");
assert.ok(componentContent.includes("handleIssueStrikeSubmit"), "Component must handle strike issuance");
assert.ok(componentContent.includes("handlePardonStrike"), "Component must handle strike pardon");
assert.ok(componentContent.includes("handleGrantCourse"), "Component must handle course grant");
console.log("✅ 5-Tab 360 Dossier architecture in AdminUsersManager verified.");

// 5. Test store operations dynamically
const storeModulePath = path.resolve(process.cwd(), "apps/web/lib/admin-users-store.ts");
const store = await import(`file:///${storeModulePath.replace(/\\/g, "/")}`);

// Reset seed before tests for idempotency
store.saveUsers360ToDisk(JSON.parse(JSON.stringify(store.INITIAL_USERS_360)));

const users = store.getUsers360();
assert.ok(Array.isArray(users) && users.length >= 4, "Users array must have at least 4 initial users");

const stats = store.getUserOperationsStats();
assert.ok(stats.totalUsers >= 4, "Total users stat must be valid");
assert.ok(stats.totalWalletBalancesToman > 0, "Wallet balance sum must be calculated");

// Test Wallet Credit
const targetUser = users.find((u) => u.id === "usr-004");
assert.ok(targetUser, "Target user usr-004 must exist");
const initialBalance = targetUser.walletBalanceToman;

const creditRes = store.adjustUserWallet("usr-004", {
  amountToman: 50000,
  reasonCategory: "loyalty_gift",
  adminNote: "تست افزایش اعتبار خودکار",
  actor: "تست سیستم",
});
assert.ok(creditRes.success, "adjustUserWallet credit must succeed");
assert.equal(creditRes.user?.walletBalanceToman, initialBalance + 50000, "Balance must increase by 50,000");

// Test Warning Strike & 3-strike rule
const strike1Res = store.issueWarningStrike("usr-004", {
  reasonPreset: "غیبت در کلاس",
  detailMessage: "عدم حضور در جلسه تست",
  actor: "ناظر انضباطی",
});
assert.ok(strike1Res.success, "Strike 1 issuance must succeed");
assert.equal(strike1Res.strike?.strikeNumber, 1, "Strike number must be 1");

const strike2Res = store.issueWarningStrike("usr-004", {
  reasonPreset: "نقض منشور",
  detailMessage: "رفتار نامتعارف تست",
});
assert.ok(strike2Res.success, "Strike 2 issuance must succeed");
assert.ok(
  strike2Res.user?.accountRestrictions?.bookingFrozenUntil,
  "Strike 2 must freeze booking for 7 days"
);

const strike3Res = store.issueWarningStrike("usr-004", {
  reasonPreset: "پرداخت خارج از سایت",
  detailMessage: "تخلف مکرر تست",
});
assert.ok(strike3Res.success, "Strike 3 issuance must succeed");
assert.equal(strike3Res.user?.isActive, false, "Strike 3 must auto-ban account");
assert.equal(strike3Res.user?.accountRestrictions?.isPermanentlyBanned, true, "Account must be marked permanently banned");

// Test Pardon Strike
assert.ok(strike3Res.strike?.id, "Strike 3 must have an ID");
const pardonRes = store.pardonWarningStrike("usr-004", strike3Res.strike.id, {
  pardonReason: "رفع سوءتفاهم پس از پیگیری پشتیبانی",
  actor: "مدیر پشتیبانی",
});
assert.ok(pardonRes.success, "Pardon strike must succeed");
assert.equal(pardonRes.user?.isActive, true, "Account must be reactivated after strike 3 is pardoned");

// Test Course Grant
const courseRes = store.grantUserCourse("usr-004", "crs-ielts-speaking", "مدیر آموزش");
assert.ok(courseRes.success, "Grant course must succeed");
assert.ok(
  courseRes.user?.enrolledCourses.some((c) => c.id === "crs-ielts-speaking"),
  "Enrolled courses must include granted course"
);

// Reset back to clean initial state
store.saveUsers360ToDisk(store.INITIAL_USERS_360);
console.log("✅ Store dynamic actions (Wallet, 3-Strike Rule, Pardon, Course Grant) verified.");

console.log("\n🎉 ALL STUDENT & USER 360 CHECKS PASSED SUCCESSFULLY!");
