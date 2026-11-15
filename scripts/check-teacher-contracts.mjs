import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Teacher Contracts, Commission Tiers & Legal Studio Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/teacher-contracts-content.ts",
  "apps/web/lib/teacher-contracts-store.ts",
  "apps/web/app/api/admin/teachers/contracts/route.ts",
  "apps/web/components/admin/teacher-contracts.module.css",
  "apps/web/components/admin/TeacherContractsConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/teacher-contracts.module.css"),
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
  "tierCardsGrid",
  "tierCard",
  "tierBronze",
  "tierSilver",
  "tierGold",
  "tierDiamond",
  "tierHeader",
  "tierName",
  "tierSplitBig",
  "tierConditionList",
  "sectionCard",
  "sectionHeader",
  "sectionTitle",
  "tableWrapper",
  "table",
  "customOverrideBadge",
  "btnActionPrimary",
  "btnActionSecondary",
  "btnActionDanger",
  "contractsList",
  "contractCard",
  "contractHeader",
  "contractTitle",
  "contractTerms",
  "digitalSignatureSeal",
  "statusActive",
  "statusPending",
  "statusTerminated",
  "payoutGateBanner",
  "gateIcon",
  "gateAllowedBadge",
  "gateBlockedBadge",
  "legalHoldActiveTag",
  "legalHoldNormalTag",
  "modalOverlay",
  "modalCard",
  "modalTitle",
  "modalDesc",
  "formInput",
  "modalTextarea",
  "modalActions",
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
  masterAdminContent.includes('import { TeacherContractsConsole } from "./TeacherContractsConsole";'),
  "MasterAdminConsole missing TeacherContractsConsole import"
);
assert.ok(
  masterAdminContent.includes('"teacher-contracts"'),
  "MasterAdminConsole missing 'teacher-contracts' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<TeacherContractsConsole />"),
  "MasterAdminConsole missing <TeacherContractsConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "teacher-contracts"'),
  "MasterAdminConsole missing activeTab teacher-contracts check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/teachers/contracts/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "create_contract",
  "send_contract",
  "sign_contract_otp",
  "terminate_contract",
  "set_custom_commission",
  "evaluate_tier_promotion",
  "toggle_legal_hold",
  "update_tax_rate",
  "check_payout_gate",
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
const storeModule = await import("../apps/web/lib/teacher-contracts-store.ts");

// Idempotent reset before tests
storeModule.resetTeacherContractsDataToInitial();

const initialData = storeModule.getTeacherContractsData();
assert.ok(Array.isArray(initialData.tiers), "Data should contain tiers array");
assert.ok(Array.isArray(initialData.profiles), "Data should contain profiles array");
assert.ok(Array.isArray(initialData.contracts), "Data should contain contracts array");
assert.strictEqual(initialData.tiers.length, 4, "Should have 4 commission tiers");
assert.strictEqual(initialData.profiles.length, 4, "Should have 4 teacher profiles");
assert.strictEqual(initialData.contracts.length, 5, "Should have 5 initial contracts");
console.log(
  `✅ Initial data verified: ${initialData.tiers.length} tiers, ${initialData.profiles.length} profiles, ${initialData.contracts.length} contracts.`
);

const initialStats = storeModule.getTeacherContractsStats();
assert.strictEqual(typeof initialStats.totalTeachersUnderContract, "number");
assert.strictEqual(typeof initialStats.activeContractsCount, "number");
assert.strictEqual(typeof initialStats.pendingSignaturesCount, "number");
assert.strictEqual(typeof initialStats.activeLegalHoldsCount, "number");
assert.strictEqual(typeof initialStats.diamondTierCount, "number");
assert.strictEqual(typeof initialStats.avgTeacherCommissionPercent, "number");
assert.strictEqual(initialStats.diamondTierCount, 1);
assert.strictEqual(initialStats.activeLegalHoldsCount, 1);
console.log(
  `✅ Stats calculation verified: Teachers: ${initialStats.totalTeachersUnderContract}, Active Contracts: ${initialStats.activeContractsCount}, Holds: ${initialStats.activeLegalHoldsCount}.`
);

// Test Create Contract
const createRes = storeModule.createContract({
  teacherId: "tch-shams-02",
  contractType: "teaching_agreement",
  contractTitle: "قرارداد همکاری سال جدید دکتر شمس",
  termsSummary: "همکاری تدریس آنلاین دوره‌های گرامر هگز و مکاتبات بین‌المللی",
  commissionPercent: 80,
});
assert.ok(createRes.success, "createContract should succeed");
assert.strictEqual(createRes.contract.teacherId, "tch-shams-02");
assert.strictEqual(createRes.contract.status, "pending_signature");
console.log(`✅ createContract verified: Contract #${createRes.contract.id} created.`);

// Test Send Contract for Signature
const sendRes = storeModule.sendContractForSignature(createRes.contract.id);
assert.ok(sendRes.success, "sendContractForSignature should succeed");
assert.strictEqual(sendRes.contract?.status, "pending_signature");
console.log(`✅ sendContractForSignature verified.`);

// Test Sign Contract with OTP (Digital Signature)
const signRes = storeModule.signContractOtp({
  contractId: createRes.contract.id,
  otpCode: "948201",
  signerIp: "185.190.24.110",
});
assert.ok(signRes.success, "signContractOtp should succeed");
assert.strictEqual(signRes.contract?.status, "active_signed");
assert.ok(signRes.contract?.digitalSignature, "Digital signature must be populated");
assert.strictEqual(signRes.contract?.digitalSignature?.otpTrackingCode, "OTP-948201");
console.log(`✅ signContractOtp verified: Digital signature sealed with tracking code OTP-948201.`);

// Test Hard Payout Gate Checks
const rezaeiGate = storeModule.isTeacherPayoutAllowed("tch-rezaei-01");
assert.strictEqual(rezaeiGate.allowed, true, "Dr. Rezaei must be allowed for payout");

const ghasemiGate = storeModule.isTeacherPayoutAllowed("tch-ghasemi-04");
assert.strictEqual(ghasemiGate.allowed, false, "Ghasemi must be blocked due to active legal hold");
assert.ok(ghasemiGate.reason?.includes("فریز حقوقی"), "Must mention legal hold in reason");

const rahimiGate = storeModule.isTeacherPayoutAllowed("tch-rahimi-03");
assert.strictEqual(rahimiGate.allowed, false, "Rahimi must be blocked because contract is not yet signed");
assert.ok(rahimiGate.reason?.includes("فاقد قرارداد امضاشده"), "Must mention Hard Payout Gate unsigned contract");
console.log(`✅ Hard Payout Gate verified: Allowed for signed & compliant teachers, blocked for legal hold & unsigned.`);

// Test Custom Commission Override
const customCommRes = storeModule.setCustomCommission({
  teacherId: "tch-shams-02",
  customPercent: 82,
  reason: "افزایش سهم به علت پرفروش‌ترین دوره ماه",
});
assert.ok(customCommRes.success, "setCustomCommission should succeed");
assert.strictEqual(customCommRes.profile?.effectiveCommissionPercent, 82);
assert.strictEqual(customCommRes.profile?.isCustomOverride, true);
console.log(`✅ setCustomCommission verified: Set 82% custom split for Dr. Shams.`);

// Test Tier Promotion Evaluation
const promoRes = storeModule.evaluateTierPromotion("tch-rezaei-01");
assert.ok(promoRes.success, "evaluateTierPromotion should succeed");
assert.strictEqual(promoRes.newTier, "diamond", "Dr. Rezaei with 580 hours must remain Diamond");
console.log(`✅ evaluateTierPromotion verified: Evaluated tier '${promoRes.newTier}'.`);

// Test Legal Hold Toggle
const liftHoldRes = storeModule.toggleLegalHold({
  teacherId: "tch-ghasemi-04",
  isHoldActive: false,
});
assert.ok(liftHoldRes.success, "toggleLegalHold to false should succeed");
assert.strictEqual(liftHoldRes.profile?.isLegalHoldActive, false);

const reapplyHoldRes = storeModule.toggleLegalHold({
  teacherId: "tch-ghasemi-04",
  isHoldActive: true,
  reason: "بررسی ادعای نقض کپی‌رایت سرفصل‌ها",
});
assert.ok(reapplyHoldRes.success, "toggleLegalHold to true should succeed");
assert.strictEqual(reapplyHoldRes.profile?.isLegalHoldActive, true);
console.log(`✅ toggleLegalHold verified: Successfully toggled legal hold on and off.`);

// Test Update Withholding Tax Rate
const taxRes = storeModule.updateWithholdingTax({
  teacherId: "tch-shams-02",
  taxPercent: 3,
});
assert.ok(taxRes.success, "updateWithholdingTax should succeed");
assert.strictEqual(taxRes.profile?.withholdingTaxPercent, 3);
console.log(`✅ updateWithholdingTax verified: Tax rate updated to 3%.`);

// Test Terminate Contract
const termRes = storeModule.terminateContract(createRes.contract.id, "پایان دوره آزمایشی و تسویه نهایی");
assert.ok(termRes.success, "terminateContract should succeed");
assert.strictEqual(termRes.contract?.status, "terminated");
console.log(`✅ terminateContract verified: Contract #${createRes.contract.id} terminated.`);

// Test Reset to Pristine Seed
storeModule.resetTeacherContractsDataToInitial();
const resetData = storeModule.getTeacherContractsData();
assert.strictEqual(resetData.profiles.length, 4);
assert.strictEqual(resetData.contracts.length, 5);
const resetShams = resetData.profiles.find((p) => p.teacherId === "tch-shams-02");
assert.strictEqual(resetShams?.effectiveCommissionPercent, 80);
assert.strictEqual(resetShams?.isCustomOverride, false);
console.log("✅ resetTeacherContractsDataToInitial successfully restored pristine seed data.");

console.log("\n🎉 ALL TEACHER CONTRACTS & COMMISSION STUDIO CHECKS PASSED SUCCESSFULLY!\n");
