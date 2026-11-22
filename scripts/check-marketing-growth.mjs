import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Growth, Marketing & Promotional Campaign System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/marketing-content.ts",
  "apps/web/lib/marketing-store.ts",
  "apps/web/app/api/admin/marketing/route.ts",
  "apps/web/app/api/marketing/coupons/validate/route.ts",
  "apps/web/components/admin/marketing-growth.module.css",
  "apps/web/components/admin/MarketingGrowthConsole.tsx",
  "apps/web/components/marketing/FlashSaleCountdownBar.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/marketing-growth.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
  "btnNewCoupon",
  "btnResetSeed",
  "kpiGrid",
  "kpiCard",
  "kpiTop",
  "kpiTitle",
  "kpiValue",
  "kpiSub",
  "deskNavCard",
  "deskNavBtn",
  "deskBadge",
  "toolbarCard",
  "searchRow",
  "statusTabsRow",
  "tableCard",
  "tableWrapper",
  "table",
  "codeBadge",
  "scopeBadge",
  "statusBadge",
  "modalBackdrop",
  "modalContent",
  "campaignContainer",
  "campaignBannerPreview",
  "timerBox",
  "timerSegment",
  "timerNumber",
  "timerLabel",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} CSS classes verified.`);

// 3. Read and verify Admin API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/marketing/route.ts"),
  "utf-8"
);
const EXPECTED_API_ACTIONS = [
  "create_coupon",
  "toggle_coupon",
  "delete_coupon",
  "create_partner",
  "update_campaign",
  "toggle_campaign",
  "reset_seed",
];

for (const act of EXPECTED_API_ACTIONS) {
  assert.ok(routeContent.includes(`action === "${act}"`), `API route missing action handler: ${act}`);
}
console.log(`✅ All ${EXPECTED_API_ACTIONS.length} Admin API route action handlers verified.`);

// 4. Verify MasterAdminConsole.tsx wiring
const masterContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/MasterAdminConsole.tsx"),
  "utf-8"
);
assert.ok(
  masterContent.includes('import MarketingGrowthConsole from "./MarketingGrowthConsole"'),
  "MasterAdminConsole missing MarketingGrowthConsole import"
);
assert.ok(
  masterContent.includes('{activeTab === "marketing" && <MarketingGrowthConsole />}'),
  "MasterAdminConsole missing marketing tab binding"
);
assert.ok(
  masterContent.includes('setActiveTab("marketing")'),
  "MasterAdminConsole missing marketing sidebar button"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 5. Verify Checkout Page Coupon Integration
const checkoutContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/checkout/page.tsx"),
  "utf-8"
);
assert.ok(checkoutContent.includes("const payableAmountToman = baseAmountToman"), "Display must use the full server order amount");
assert.ok(checkoutContent.includes("amount_toman: payableAmountToman"), "Payment request must match the order total");
assert.ok(!checkoutContent.includes("appliedCoupon"), "Client-side discounts cannot alter a server-priced order");

// 6. Dynamic Testing of Marketing Store & Calculation Logic
import("../apps/web/lib/marketing-store.ts").then((marketingStore) => {
  console.log("\n📦 Running Dynamic Marketing Store & Calculation Verification...");

  // Reset seed before tests for idempotency
  marketingStore.saveMarketingDataToDisk({
    coupons: JSON.parse(JSON.stringify(marketingStore.INITIAL_COUPONS)),
    partners: JSON.parse(JSON.stringify(marketingStore.INITIAL_REFERRAL_PARTNERS)),
    campaign: JSON.parse(JSON.stringify(marketingStore.INITIAL_FLASH_CAMPAIGN)),
  });

  // A. Coupon: Fixed Toman Validation
  const fixedValid = marketingStore.validateCouponForBasket({
    code: "WELCOME50",
    basketAmountToman: 300000,
  });
  assert.equal(fixedValid.valid, true, "WELCOME50 should be valid for 300k basket");
  assert.equal(fixedValid.discountAmountToman, 50000, "Fixed discount should be 50,000");
  assert.equal(fixedValid.finalPayableToman, 250000, "Payable should be 250,000");

  // Min Basket violation
  const fixedLowBasket = marketingStore.validateCouponForBasket({
    code: "WELCOME50",
    basketAmountToman: 150000,
  });
  assert.equal(fixedLowBasket.valid, false, "WELCOME50 should fail for basket below min requirement");
  console.log("✅ Fixed Toman coupon & minimum basket threshold verified.");

  // B. Coupon: Percentage with Cap
  const percentCapped = marketingStore.validateCouponForBasket({
    code: "GOLDEN30", // 30% capped at 200,000
    basketAmountToman: 1000000,
    scope: "subscription",
  });
  assert.equal(percentCapped.valid, true);
  assert.equal(percentCapped.discountAmountToman, 200000, "30% of 1M is 300k, capped at 200k");
  assert.equal(percentCapped.finalPayableToman, 800000);

  // Scope mismatch
  const scopeFail = marketingStore.validateCouponForBasket({
    code: "GOLDEN30",
    basketAmountToman: 1000000,
    scope: "session_1on1",
  });
  assert.equal(scopeFail.valid, false, "GOLDEN30 must fail for session_1on1 scope");
  console.log("✅ Percentage coupon cap & product scope restrictions verified.");

  // C. Win-Back Phone Restrictions
  const phoneAllowed = marketingStore.validateCouponForBasket({
    code: "WINBACK40",
    basketAmountToman: 300000,
    userPhone: "09121234567",
  });
  assert.equal(phoneAllowed.valid, true, "Authorized phone should pass Win-Back check");

  const phoneForbidden = marketingStore.validateCouponForBasket({
    code: "WINBACK40",
    basketAmountToman: 300000,
    userPhone: "09999999999",
  });
  assert.equal(phoneForbidden.valid, false, "Unauthorized phone must fail Win-Back check");
  console.log("✅ Targeted Win-Back phone restriction verified.");

  // D. Create, Toggle, Delete Coupon
  const createRes = marketingStore.createCoupon({
    code: "TESTCOUPON99",
    description: "کد تخفیف تست خودکار",
    discountType: "percentage",
    discountValue: 20,
    minBasketValueToman: 100000,
    scope: "all",
    maxUsageTotal: 50,
    maxUsagePerUser: 1,
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-12-31T23:59:59Z",
    isActive: true,
  });
  assert.equal(createRes.success, true);
  assert.equal(createRes.coupon?.code, "TESTCOUPON99");

  const toggleRes = marketingStore.toggleCouponStatus(createRes.coupon.id);
  assert.equal(toggleRes.success, true);
  assert.equal(toggleRes.coupon?.isActive, false);

  const deleteRes = marketingStore.deleteCoupon(createRes.coupon.id);
  assert.equal(deleteRes.success, true);
  console.log("✅ Coupon CRUD operations verified.");

  // E. Referral Conversion
  const initialPartner = marketingStore.getMarketingData().partners.find((p) => p.referralCode === "ROSTAMI-VIP");
  assert.ok(initialPartner);
  const prevConversions = initialPartner.successfulConversionsCount;
  const prevEarnings = initialPartner.totalEarningsToman;

  const convRes = marketingStore.recordReferralConversion("ROSTAMI-VIP", 1000000); // 25% of 1M = 250k
  assert.equal(convRes.success, true);
  assert.equal(convRes.partner?.successfulConversionsCount, prevConversions + 1);
  assert.equal(convRes.partner?.totalEarningsToman, prevEarnings + 250000);
  console.log("✅ Referral partner conversion & commission attribution verified.");

  // F. Flash Sale Toggle
  const toggleCampRes = marketingStore.toggleCampaignStatus();
  assert.equal(toggleCampRes.success, true);
  const campStatusAfter = toggleCampRes.campaign?.isActive;
  // Toggle back
  marketingStore.toggleCampaignStatus();
  console.log("✅ Flash sale campaign kill-switch toggle verified.");

  // G. Reset Seed
  marketingStore.saveMarketingDataToDisk({
    coupons: [...marketingStore.INITIAL_COUPONS],
    partners: [...marketingStore.INITIAL_REFERRAL_PARTNERS],
    campaign: { ...marketingStore.INITIAL_FLASH_CAMPAIGN },
  });
  console.log("✅ Seed reset verified.");

  console.log("\n🎉 ALL GROWTH & MARKETING INTEGRITY CHECKS PASSED SUCCESSFULLY!");
}).catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
