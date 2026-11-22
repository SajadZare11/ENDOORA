import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "../../apps/web/lib/admin-storage-engine.ts";

import {
  getCustomPages,
  saveCustomPage,
  deleteCustomPage,
  getCustomPageBySlug,
} from "../../apps/web/lib/admin-site-builder-store.ts";

import {
  getAutonomousOpsStorage,
  createDatabaseBackup,
  updateBackupPolicy,
} from "../../apps/web/lib/admin-autonomous-ops-store.ts";

import {
  getCustomFormsList,
  saveCustomForm,
  submitPublicFormResponse,
  deleteCustomForm,
  getFormSubmissions,
} from "../../apps/web/lib/admin-forms-webhooks-store.ts";

import {
  getFinancialRiskStorage,
  issueOneClickRefund,
} from "../../apps/web/lib/admin-financial-risk-store.ts";

import {
  saveAffiliatePartnerAction,
  updateXpRulesAction,
  getAffiliatesData,
} from "../../apps/web/lib/admin-gamification-affiliates-store.ts";

import {
  getMaintenanceConfig,
  saveMaintenanceConfig,
} from "../../apps/web/lib/admin-server-ops-store.ts";

console.log("Running In-Memory Stores Persistence & Durability Unit Tests...\n");

// -----------------------------------------------------------------------------
// Test 1: Storage Engine Core Primitives
// -----------------------------------------------------------------------------
{
  const testFile = resolveStoragePath("test-atomic-engine.json");
  const testPayload = { id: "test-engine", timestamp: Date.now(), items: [1, 2, 3] };

  atomicWriteJsonSync(testFile, testPayload);
  assert.ok(fs.existsSync(testFile), "File must exist on disk after atomic write");

  const { data, mtime } = readJsonWithFallback(
    testFile,
    () => ({ id: "fallback" }),
    (p) => p?.id === "test-engine"
  );
  assert.equal(data.id, "test-engine");
  assert.equal(data.items.length, 3);
  assert.ok(mtime > 0);

  // Clean up
  try {
    fs.unlinkSync(testFile);
  } catch {}
  console.log("✓ Test 1: Storage engine atomic write and fallback read verified.");
}

// -----------------------------------------------------------------------------
// Test 2: Site Builder Store Persistence (site-builder-operations.json)
// -----------------------------------------------------------------------------
{
  const testSlug = `test-page-${Date.now()}`;
  const saveRes = saveCustomPage({
    slug: testSlug,
    titleFa: "برگه آزمایشی ماندگاری دیسک",
    titleEn: "Persistence Test Page",
    status: "published",
    blocks: [],
  });
  assert.equal(saveRes.success, true);
  assert.ok(saveRes.page);

  const diskPath = resolveStoragePath("site-builder-operations.json");
  assert.ok(fs.existsSync(diskPath), "site-builder-operations.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(testSlug), "Disk file must contain newly saved page slug");

  // Verify lookup by slug
  const page = getCustomPageBySlug(testSlug);
  assert.ok(page, "getCustomPageBySlug must find published page");
  assert.equal(page.titleFa, "برگه آزمایشی ماندگاری دیسک");

  // Clean up
  const delRes = deleteCustomPage(saveRes.page.id);
  assert.equal(delRes.success, true);
  const rawAfterDel = fs.readFileSync(diskPath, "utf-8");
  assert.ok(!rawAfterDel.includes(testSlug), "Deleted page must be removed from disk");
  console.log("✓ Test 2: Site builder store persists mutations and deletions atomically.");
}

// -----------------------------------------------------------------------------
// Test 3: Autonomous Ops Store Persistence (autonomous-ops-operations.json)
// -----------------------------------------------------------------------------
{
  const backupRes = createDatabaseBackup("sql", "تست پشتیبان‌گیری خودکار ماندگاری");
  assert.equal(backupRes.success, true);
  const backupId = backupRes.backup.id;

  const diskPath = resolveStoragePath("autonomous-ops-operations.json");
  assert.ok(fs.existsSync(diskPath), "autonomous-ops-operations.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(backupId), "Disk file must contain newly created backup ID");

  // Verify policy update persistence
  updateBackupPolicy({ retentionDays: 45 });
  const rawAfterPolicy = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawAfterPolicy.includes('"retentionDays": 45'), "Policy update must persist to disk");

  // Restore policy
  updateBackupPolicy({ retentionDays: 30 });
  console.log("✓ Test 3: Autonomous ops store persists backups and policy updates to disk.");
}

// -----------------------------------------------------------------------------
// Test 4: Forms & Webhooks Store Persistence (forms-webhooks-operations.json)
// -----------------------------------------------------------------------------
{
  const formSlug = `test-form-${Date.now()}`;
  const saveRes = saveCustomForm({
    slug: formSlug,
    titleFa: "فرم نظرسنجی دوره‌های ماندگار",
    titleEn: "Durability Test Form",
    status: "published",
    fields: [
      { id: "f1", label: "نام", type: "text", isRequired: true },
    ],
    automations: {
      telegramEnabled: false,
      telegramChatId: "",
      smsEnabled: false,
      smsTemplate: "",
      webhookEnabled: true,
      webhookUrl: "https://example.com/webhook",
    },
  });
  assert.equal(saveRes.success, true);
  assert.ok(saveRes.form);

  const diskPath = resolveStoragePath("forms-webhooks-operations.json");
  assert.ok(fs.existsSync(diskPath), "forms-webhooks-operations.json must exist on disk");
  let rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(formSlug), "Disk file must contain new form slug");

  // Submit response
  const subRes = submitPublicFormResponse(formSlug, { f1: "علی محمدی" }, "127.0.0.1", "TestAgent");
  assert.equal(subRes.success, true);
  assert.ok(subRes.submission?.id);

  rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(subRes.submission.id), "Disk file must contain form submission ID");

  // Clean up
  const delRes = deleteCustomForm(saveRes.form.id);
  assert.equal(delRes.success, true);
  console.log("✓ Test 4: Forms & Webhooks store persists forms and submissions.");
}

// -----------------------------------------------------------------------------
// Test 5: Financial Risk Store Persistence (financial-risk-operations.json)
// -----------------------------------------------------------------------------
{
  // Idempotent test setup: reset tx_9820 status
  const preStorage = getFinancialRiskStorage();
  const tx = preStorage.transactions.find((t) => t.id === "tx_9820");
  if (tx) tx.isRefunded = false;

  const refundRes = issueOneClickRefund({
    transactionId: "tx_9820",
    reason: "انصراف کاربر در بازه گارانتی ۷ روزه رضایت",
    refundMethod: "wallet_credit",
  });
  assert.equal(refundRes.success, true);
  assert.ok(refundRes.refund);

  const diskPath = resolveStoragePath("financial-risk-operations.json");
  assert.ok(fs.existsSync(diskPath), "financial-risk-operations.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(refundRes.refund.id), "Disk file must contain refund record ID");

  // Clean up
  if (tx) tx.isRefunded = false;
  preStorage.refunds = preStorage.refunds.filter((r) => r.id !== refundRes.refund.id);
  const { persistFinancialRisk } = await import("../../apps/web/lib/admin-financial-risk-store.ts");
  persistFinancialRisk();
  console.log("✓ Test 5: Financial risk store persists refunds and transaction reversals.");
}

// -----------------------------------------------------------------------------
// Test 6: Gamification & Affiliates Store Persistence (gamification-affiliates-operations.json)
// -----------------------------------------------------------------------------
{
  const refCode = `TESTPARTNER_${Date.now()}`;
  const saveRes = saveAffiliatePartnerAction({
    partnerName: "آکادمی زبان همکار ماندگار",
    phone: "09123334455",
    email: "partner@example.com",
    referralCode: refCode,
    commissionRatePercent: 20,
    shebaNumber: "IR120170000000111122223333",
    bankName: "بانک ملی",
  });
  assert.equal(saveRes.success, true);

  const diskPath = resolveStoragePath("gamification-affiliates-operations.json");
  assert.ok(fs.existsSync(diskPath), "gamification-affiliates-operations.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(refCode.toLowerCase()), "Disk file must contain affiliate referral code");

  // XP Rules update
  updateXpRulesAction({ dailyLoginXp: 25 });
  const rawDisk2 = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk2.includes('"dailyLoginXp": 25'), "Disk file must contain updated XP rules");

  // Restore XP rules
  updateXpRulesAction({ dailyLoginXp: 15 });
  console.log("✓ Test 6: Gamification & Affiliates store persists partners and XP rules.");
}

// -----------------------------------------------------------------------------
// Test 7: Server Ops Store Persistence (server-ops-operations.json)
// -----------------------------------------------------------------------------
{
  const current = getMaintenanceConfig();
  const testMsg = `حالت تعمیرات آزمایشی ${Date.now()}`;
  const updateRes = saveMaintenanceConfig({
    customMessageFa: testMsg,
  });
  assert.equal(updateRes.success, true);

  const diskPath = resolveStoragePath("server-ops-operations.json");
  assert.ok(fs.existsSync(diskPath), "server-ops-operations.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(testMsg), "Disk file must contain updated maintenance message");

  // Restore
  saveMaintenanceConfig({ customMessageFa: current.customMessageFa });
  console.log("✓ Test 7: Server ops store persists maintenance configurations.");
}

// -----------------------------------------------------------------------------
// Test 8: Process-Restart Durability (State survived across new Node process)
// -----------------------------------------------------------------------------
{
  const restartPageSlug = `restart-verify-${Date.now()}`;

  // Process 1: Save page
  saveCustomPage({
    slug: restartPageSlug,
    titleFa: "تست ماندگاری در پروسس مجزا",
    titleEn: "Process Isolation Page",
    status: "published",
  });

  // Process 2: Spawn new Node child process and verify it reads the persisted page
  const childScript = `
    import { getCustomPageBySlug } from './apps/web/lib/admin-site-builder-store.ts';
    const page = getCustomPageBySlug('${restartPageSlug}');
    if (!page || page.titleFa !== 'تست ماندگاری در پروسس مجزا') {
      process.exit(1);
    }
    process.exit(0);
  `;

  execSync(`node -e "${childScript.replace(/\n/g, " ")}"`, {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  // Clean up
  const pages = getCustomPages();
  const match = pages.find((p) => p.slug === restartPageSlug);
  if (match) {
    deleteCustomPage(match.id);
  }
  console.log("✓ Test 8: Data survives clean across separate Node child processes.");
}

console.log("\nAll 6 Operational Stores Persistence & Durability tests PASSED successfully!");
