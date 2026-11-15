import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Broadcast, Multi-Channel Announcement & Push Notification Hub Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/broadcast-notifications-content.ts",
  "apps/web/lib/broadcast-notifications-store.ts",
  "apps/web/app/api/admin/broadcast/route.ts",
  "apps/web/components/admin/broadcast-notifications.module.css",
  "apps/web/components/admin/BroadcastNotificationsConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/broadcast-notifications.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
  "btnResetSeed",
  "btnRefresh",
  "statsGrid",
  "statCard",
  "statIcon",
  "statInfo",
  "statLabel",
  "statValue",
  "tabsBar",
  "tabBtn",
  "tabActive",
  "composerLayout",
  "composerCard",
  "composerTitle",
  "composerDesc",
  "formGroup",
  "formLabel",
  "formInput",
  "formTextarea",
  "channelGroup",
  "channelCheckbox",
  "channelCheckboxActive",
  "composerActions",
  "btnTestSend",
  "btnDispatchMass",
  "previewPhoneFrame",
  "phoneStatusBar",
  "phoneNotificationCard",
  "phoneAppName",
  "phoneNotifTitle",
  "phoneNotifBody",
  "phoneNotifCta",
  "segmentGrid",
  "segmentCard",
  "segmentTitle",
  "segmentCountBadge",
  "templatesGrid",
  "templateCard",
  "tableCard",
  "tableWrapper",
  "table",
  "priorityNormal",
  "priorityImportant",
  "priorityCritical",
  "statusCompleted",
  "statusScheduled",
  "statusCancelled",
  "btnActionCancel",
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
  masterAdminContent.includes('import { BroadcastNotificationsConsole } from "./BroadcastNotificationsConsole";'),
  "MasterAdminConsole missing BroadcastNotificationsConsole import"
);
assert.ok(
  masterAdminContent.includes('"broadcast"'),
  "MasterAdminConsole missing 'broadcast' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<BroadcastNotificationsConsole />"),
  "MasterAdminConsole missing <BroadcastNotificationsConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "broadcast"'),
  "MasterAdminConsole missing activeTab broadcast check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/broadcast/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "send_test",
  "dispatch_campaign",
  "cancel_campaign",
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
const storeModule = await import("../apps/web/lib/broadcast-notifications-store.ts");

// Idempotent reset before tests
storeModule.resetBroadcastDataToInitial();

const initialData = storeModule.getBroadcastData();
assert.ok(Array.isArray(initialData.campaigns), "Data should contain campaigns array");
assert.ok(Array.isArray(initialData.templates), "Data should contain templates array");
assert.ok(Array.isArray(initialData.segments), "Data should contain segments array");
assert.strictEqual(initialData.campaigns.length, 3, "Should have 3 initial campaigns");
assert.strictEqual(initialData.templates.length, 4, "Should have 4 initial templates");
assert.strictEqual(initialData.segments.length, 5, "Should have 5 initial segments");
console.log(`✅ Initial data verified: ${initialData.campaigns.length} campaigns, ${initialData.templates.length} templates, ${initialData.segments.length} segments.`);

const initialStats = storeModule.getBroadcastStats();
assert.strictEqual(typeof initialStats.totalCampaignsSent, "number");
assert.strictEqual(typeof initialStats.totalNotificationsDelivered, "number");
assert.strictEqual(typeof initialStats.totalSmsDispatched, "number");
assert.strictEqual(typeof initialStats.avgDeliveryRatePercent, "number");
assert.strictEqual(typeof initialStats.scheduledCampaignsCount, "number");
console.log(`✅ Stats calculation verified: Sent: ${initialStats.totalCampaignsSent}, Delivered: ${initialStats.totalNotificationsDelivered}, Scheduled: ${initialStats.scheduledCampaignsCount}.`);

// Test Send Test Notification to Admin
const testRes = storeModule.sendTestNotificationToAdmin(
  {
    title: "تست اعلان سیستم",
    body: "این یک پیام آزمایشی جهت تایید اتصال به درگاه پیامک و وب‌پوش است.",
    channels: ["in_app", "sms"],
  },
  "09121112233"
);
assert.ok(testRes.success, "sendTestNotificationToAdmin should return success");
assert.ok(testRes.message.includes("09121112233"), "Message should mention admin phone");
console.log(`✅ sendTestNotificationToAdmin verified: ${testRes.message}`);

// Test Dispatch Mass Broadcast Campaign
const dispatchRes = storeModule.dispatchBroadcastCampaign({
  title: "جشنواره عیدانه زبان ایندورا",
  body: "کد تخفیف ۵۰٪ برای ۳ روز فعال شد.",
  ctaText: "دریافت تخفیف",
  ctaUrl: "/courses",
  channels: ["in_app", "sms"],
  priority: "important",
  targetSegment: "active_students",
});
assert.ok(dispatchRes.success, "dispatchBroadcastCampaign should return success");
assert.strictEqual(dispatchRes.campaign.status, "completed");
assert.ok(dispatchRes.campaign.actualDeliveredCount > 1000, "Should compute delivered count");
console.log(`✅ dispatchBroadcastCampaign successfully created and delivered campaign: ${dispatchRes.campaign.id} (${dispatchRes.campaign.actualDeliveredCount} recipients).`);

// Test Cancel Scheduled Campaign
const scheduledCamp = storeModule.getBroadcastData().campaigns.find((c) => c.status === "scheduled");
assert.ok(scheduledCamp, "Should find a scheduled campaign to cancel");
const cancelRes = storeModule.cancelScheduledCampaign(scheduledCamp.id);
assert.ok(cancelRes.success, "cancelScheduledCampaign should succeed");
const afterCancelData = storeModule.getBroadcastData();
const cancelledItem = afterCancelData.campaigns.find((c) => c.id === scheduledCamp.id);
assert.strictEqual(cancelledItem?.status, "cancelled");
console.log(`✅ cancelScheduledCampaign successfully cancelled campaign ${scheduledCamp.id}.`);

// Reset to initial clean state
storeModule.resetBroadcastDataToInitial();
const resetData = storeModule.getBroadcastData();
assert.strictEqual(resetData.campaigns.length, 3);
const resetScheduled = resetData.campaigns.find((c) => c.id === scheduledCamp.id);
assert.strictEqual(resetScheduled?.status, "scheduled");
console.log("✅ resetBroadcastDataToInitial successfully restored pristine seed data.");

console.log("\n🎉 ALL BROADCAST NOTIFICATIONS INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
