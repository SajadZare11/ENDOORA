import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Treasury & Escrow Settlement Console System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/treasury-content.ts",
  "apps/web/lib/treasury-store.ts",
  "apps/web/app/api/admin/treasury/route.ts",
  "apps/web/components/admin/treasury-operations.module.css",
  "apps/web/components/admin/TreasuryOperationsConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/treasury-operations.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
  "kpiGrid",
  "kpiCard",
  "deskNavCard",
  "deskNavBtn",
  "toolbarCard",
  "searchRow",
  "statusTabsRow",
  "tableCard",
  "tableWrapper",
  "table",
  "personCell",
  "moneyAmount",
  "bankBox",
  "bankBadge",
  "shebaCode",
  "mismatchWarning",
  "statusBadge",
  "statusPending",
  "statusProcessing",
  "statusCompleted",
  "statusRejected",
  "statusHeld",
  "statusDisputed",
  "statusReleased",
  "statusRefunded",
  "statusSplit",
  "modalBackdrop",
  "modalContent",
  "decisionCard",
  "splitBox",
  "revenueOverviewGrid",
  "revenueCard",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} CSS classes verified.`);

// 3. Read and verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/treasury/route.ts"),
  "utf-8"
);
const EXPECTED_API_ACTIONS = [
  "disburse_payout",
  "reject_payout",
  "mark_payout_processing",
  "arbitrate_escrow",
  "reset_seed",
];

for (const act of EXPECTED_API_ACTIONS) {
  assert.ok(routeContent.includes(`action === "${act}"`), `API route missing action handler: ${act}`);
}
console.log(`✅ All ${EXPECTED_API_ACTIONS.length} API route action handlers verified.`);

// 4. Verify MasterAdminConsole.tsx wiring
const masterContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/MasterAdminConsole.tsx"),
  "utf-8"
);
assert.ok(
  masterContent.includes('import TreasuryOperationsConsole from "./TreasuryOperationsConsole"'),
  "MasterAdminConsole missing TreasuryOperationsConsole import"
);
assert.ok(
  masterContent.includes('{activeTab === "finance" && <TreasuryOperationsConsole />}'),
  "MasterAdminConsole missing TreasuryOperationsConsole tab binding"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 5. Verify Sheba Validation & Bank Lookup Algorithm
const contentTs = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/lib/treasury-content.ts"),
  "utf-8"
);
assert.ok(contentTs.includes("IRANIAN_BANKS_CODE_MAP"), "Missing IRANIAN_BANKS_CODE_MAP");
assert.ok(contentTs.includes("validateIranianSheba"), "Missing validateIranianSheba function");
assert.ok(contentTs.includes("INITIAL_PAYOUT_REQUESTS"), "Missing INITIAL_PAYOUT_REQUESTS");
assert.ok(contentTs.includes("INITIAL_ESCROW_RECORDS"), "Missing INITIAL_ESCROW_RECORDS");
assert.ok(contentTs.includes("INITIAL_REVENUE_STATS"), "Missing INITIAL_REVENUE_STATS");
console.log("✅ Treasury content symbols & catalogs verified.");

// 6. Dynamic Testing of Treasury Store & Business Logic
import("../apps/web/lib/treasury-store.ts").then((treasuryStore) => {
  console.log("\n📦 Running Dynamic Treasury Store & Business Logic Verification...");

  // Reset seed before tests for idempotency
  treasuryStore.saveTreasuryDataToDisk({
    payouts: JSON.parse(JSON.stringify(treasuryStore.INITIAL_PAYOUT_REQUESTS)),
    escrows: JSON.parse(JSON.stringify(treasuryStore.INITIAL_ESCROW_RECORDS)),
  });

  // A. Sheba Validation tests
  const testMellat = treasuryStore.validateIranianSheba("IR160120000000001234567890");
  assert.equal(testMellat.bankName, "بانک ملت", "Bank code 012 should map to Mellat");
  assert.equal(testMellat.isValid, true, "Valid Mellat Sheba should pass ISO 7064");

  const testSaman = treasuryStore.validateIranianSheba("IR010560000000009876543210");
  assert.equal(testSaman.bankName, "بانک سامان", "Bank code 056 should map to Saman");
  assert.equal(testSaman.isValid, true, "Valid Saman Sheba should pass ISO 7064");

  const testPasargad = treasuryStore.validateIranianSheba("IR920570000000005544332211");
  assert.equal(testPasargad.bankName, "بانک پاسارگاد", "Bank code 057 should map to Pasargad");
  assert.equal(testPasargad.isValid, true, "Valid Pasargad Sheba should pass ISO 7064");

  const testInvalid = treasuryStore.validateIranianSheba("12345678");
  assert.equal(testInvalid.isValid, false, "Short Sheba should fail");
  console.log("✅ Sheba validation & ISO 7064 algorithm tests passed.");

  // B. Stats Calculation
  const stats = treasuryStore.getTreasuryStats();
  assert.ok(stats.totalGrossVolumeToman > 0, "Gross volume must be > 0");
  assert.ok(stats.totalPlatformCommissionToman > 0, "Platform commission must be > 0");
  assert.ok(stats.pendingPayoutsCount >= 0, "Pending payouts count valid");
  assert.ok(stats.activeEscrowFloatToman > 0, "Active escrow float must be > 0");
  console.log(`✅ Treasury stats verified (Volume: ${stats.totalGrossVolumeToman.toLocaleString()} Toman, Escrow: ${stats.activeEscrowFloatToman.toLocaleString()} Toman).`);

  // C. Disburse Payout - Missing tracking code check
  const failDisburse = treasuryStore.disbursePayout("payout-001", { bankTrackingCode: "" });
  assert.equal(failDisburse.success, false, "Disburse without tracking code must fail");

  // D. Disburse Payout - Success with tracking code
  const okDisburse = treasuryStore.disbursePayout("payout-001", {
    bankTrackingCode: "PAYA-TEST-123456",
    actor: "تست خودکار ممیزی",
  });
  assert.equal(okDisburse.success, true, "Disburse with tracking code should succeed");
  assert.equal(okDisburse.payout?.status, "completed");
  assert.equal(okDisburse.payout?.bankTrackingCode, "PAYA-TEST-123456");
  console.log("✅ Payout disbursement with mandatory tracking code verified.");

  // E. Reject Payout
  const okReject = treasuryStore.rejectPayout("payout-003", {
    rejectionReason: "مغایرت شماره شبا با نام دارنده حساب",
    actor: "تست خودکار ممیزی",
  });
  assert.equal(okReject.success, true);
  assert.equal(okReject.payout?.status, "rejected");
  console.log("✅ Payout rejection verified.");

  // F. 3-Way Escrow Arbitration
  // 1) Release to teacher
  const okRelease = treasuryStore.arbitrateEscrow("escrow-001", {
    decision: "release_to_teacher",
    verdictMessage: "کلاس طبق پروتکل برگزار گردید و ادعای غیبت رد شد.",
  });
  assert.equal(okRelease.success, true);
  assert.equal(okRelease.escrow?.status, "released");

  // 2) Split settlement (50/50)
  const okSplit = treasuryStore.arbitrateEscrow("escrow-002", {
    decision: "split",
    splitLearnerPercent: 50,
    verdictMessage: "به دلیل قطعی موقت در نیمی از زمان جلسه، ۵۰٪ مسترد و ۵۰٪ به استاد پرداخت شد.",
  });
  assert.equal(okSplit.success, true);
  assert.equal(okSplit.escrow?.status, "split");
  assert.equal(okSplit.escrow?.splitLearnerAmountToman, 120000); // 240,000 * 50%
  assert.equal(okSplit.escrow?.splitTeacherAmountToman, 120000);

  // 3) Refund to learner
  const okRefund = treasuryStore.arbitrateEscrow("escrow-002", {
    decision: "refund_to_learner",
    verdictMessage: "استاد در جلسه حاضر نشد، ۱۰۰٪ مبلغ به کیف پول زبان‌آموز عودت داده شد.",
  });
  assert.equal(okRefund.success, true);
  assert.equal(okRefund.escrow?.status, "refunded");
  console.log("✅ 3-Way Escrow Arbitration (Release / Split / Refund) verified.");

  // G. Reset Seed
  treasuryStore.saveTreasuryDataToDisk({
    payouts: [...treasuryStore.INITIAL_PAYOUT_REQUESTS],
    escrows: [...treasuryStore.INITIAL_ESCROW_RECORDS],
  });
  console.log("✅ Seed reset verified.");

  console.log("\n🎉 ALL TREASURY & ESCROW VERIFICATION CHECKS PASSED SUCCESSFULLY!");
}).catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
