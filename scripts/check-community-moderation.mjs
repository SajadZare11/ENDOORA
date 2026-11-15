import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Community Moderation, Forum Governance & Spam Shield System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/community-moderation-content.ts",
  "apps/web/lib/community-moderation-store.ts",
  "apps/web/app/api/admin/community/route.ts",
  "apps/web/components/admin/community-moderation.module.css",
  "apps/web/components/admin/CommunityModerationConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/community-moderation.module.css"),
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
  "filterToolbar",
  "searchInput",
  "filterBtnGroup",
  "filterBtn",
  "filterBtnActive",
  "commentsList",
  "commentCard",
  "commentHeader",
  "authorBox",
  "authorName",
  "authorRoleBadge",
  "toxicityBarContainer",
  "toxicityLabel",
  "toxicityTrack",
  "toxicityFill",
  "toxicitySafe",
  "toxicityMedium",
  "toxicityHigh",
  "commentBody",
  "commentMetaRow",
  "courseBadge",
  "ratingStars",
  "flagReasonsBox",
  "flagTag",
  "statusBadgePending",
  "statusBadgeApproved",
  "statusBadgeQuarantined",
  "statusBadgeRejected",
  "actionRow",
  "btnApprove",
  "btnReject",
  "btnOfficialReply",
  "btnPin",
  "btnLock",
  "replyBox",
  "replyHeader",
  "replyAuthor",
  "verifiedPill",
  "replyContent",
  "modalOverlay",
  "modalCard",
  "modalTitle",
  "modalDesc",
  "modalTextarea",
  "modalActions",
  "btnModalSubmit",
  "btnModalCancel",
  "spamShieldLayout",
  "sectionCard",
  "sectionHeader",
  "sectionTitle",
  "tableWrapper",
  "table",
  "badgeExact",
  "badgeRegex",
  "badgeContains",
  "shadowbanBadge",
  "muteBadge",
  "banBadge",
  "btnActionDelete",
  "btnActionLift",
  "ruleFormRow",
  "btnAddRule",
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
  masterAdminContent.includes('import { CommunityModerationConsole } from "./CommunityModerationConsole";'),
  "MasterAdminConsole missing CommunityModerationConsole import"
);
assert.ok(
  masterAdminContent.includes('"community"'),
  "MasterAdminConsole missing 'community' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<CommunityModerationConsole />"),
  "MasterAdminConsole missing <CommunityModerationConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "community"'),
  "MasterAdminConsole missing activeTab community check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/community/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "approve_comment",
  "reject_comment",
  "post_official_reply",
  "toggle_pin",
  "toggle_lock",
  "add_banned_word",
  "toggle_banned_word",
  "delete_banned_word",
  "apply_sanction",
  "lift_sanction",
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
const storeModule = await import("../apps/web/lib/community-moderation-store.ts");

// Idempotent reset before tests
storeModule.resetCommunityModerationDataToInitial();

const initialData = storeModule.getCommunityModerationData();
assert.ok(Array.isArray(initialData.comments), "Data should contain comments array");
assert.ok(Array.isArray(initialData.bannedKeywords), "Data should contain bannedKeywords array");
assert.ok(Array.isArray(initialData.sanctionedUsers), "Data should contain sanctionedUsers array");
assert.strictEqual(initialData.comments.length, 6, "Should have 6 initial comments");
assert.strictEqual(initialData.bannedKeywords.length, 5, "Should have 5 initial banned keyword rules");
assert.strictEqual(initialData.sanctionedUsers.length, 3, "Should have 3 initial sanctioned users");
console.log(
  `✅ Initial data verified: ${initialData.comments.length} comments, ${initialData.bannedKeywords.length} rules, ${initialData.sanctionedUsers.length} sanctions.`
);

const initialStats = storeModule.getCommunityModerationStats();
assert.strictEqual(typeof initialStats.totalCommentsToday, "number");
assert.strictEqual(typeof initialStats.pendingReviewsCount, "number");
assert.strictEqual(typeof initialStats.quarantinedCount, "number");
assert.strictEqual(typeof initialStats.autoApprovedPercent, "number");
assert.strictEqual(typeof initialStats.activeShadowbansCount, "number");
assert.strictEqual(typeof initialStats.avgResponseTimeMin, "number");
console.log(
  `✅ Stats calculation verified: Total Today: ${initialStats.totalCommentsToday}, Pending: ${initialStats.pendingReviewsCount}, Quarantined: ${initialStats.quarantinedCount}, Shadowbans: ${initialStats.activeShadowbansCount}.`
);

// Test Approve Comment
const approveRes = storeModule.approveComment("cmt-004", "ناظر ارشد تست");
assert.ok(approveRes.success, "approveComment should succeed");
assert.strictEqual(approveRes.comment.status, "approved");
assert.strictEqual(approveRes.comment.moderatedBy, "ناظر ارشد تست");
console.log(`✅ approveComment verified: Comment cmt-004 approved by '${approveRes.comment.moderatedBy}'.`);

// Test Reject Comment
const rejectRes = storeModule.rejectComment("cmt-005", "مخالفت با شیوه تدریس بدون دلیل منطقی", "ناظر ارشد تست");
assert.ok(rejectRes.success, "rejectComment should succeed");
assert.strictEqual(rejectRes.comment.status, "rejected");
assert.strictEqual(rejectRes.comment.rejectionReason, "مخالفت با شیوه تدریس بدون دلیل منطقی");
console.log(`✅ rejectComment verified: Comment cmt-005 rejected with reason.`);

// Test Post Official Reply
const replyRes = storeModule.postOfficialReply(
  "cmt-004",
  "پاسخ رسمی: استفاده از کلمات ربط متنوع توصیه می‌شود اما تکرار بیش از حد موجب افت نمره CC می‌گردد.",
  "دکتر مریم شمس",
  "سرپرست دپارتمان زبان آکادمیک"
);
assert.ok(replyRes.success, "postOfficialReply should succeed");
assert.ok(replyRes.comment.officialReply, "Should have officialReply populated");
assert.strictEqual(replyRes.comment.officialReply?.staffName, "دکتر مریم شمس");
console.log(`✅ postOfficialReply verified: Staff reply added to comment cmt-004.`);

// Test Toggle Pin and Lock
const pinRes = storeModule.toggleCommentPin("cmt-003", true);
assert.ok(pinRes.success, "toggleCommentPin should succeed");
assert.strictEqual(pinRes.comment.isPinned, true);

const lockRes = storeModule.toggleCommentLock("cmt-003", true);
assert.ok(lockRes.success, "toggleCommentLock should succeed");
assert.strictEqual(lockRes.comment.isLocked, true);
console.log(`✅ toggleCommentPin & toggleCommentLock verified for cmt-003.`);

// Test Add Banned Keyword Rule
const addRuleRes = storeModule.addBannedKeywordRule({
  pattern: "سایت شرط‌بندی بت",
  matchType: "contains",
  severity: "high",
  action: "reject",
});
assert.ok(addRuleRes.success, "addBannedKeywordRule should succeed");
assert.strictEqual(addRuleRes.rule.pattern, "سایت شرط‌بندی بت");
assert.strictEqual(addRuleRes.rule.action, "reject");
console.log(`✅ addBannedKeywordRule verified: Rule '${addRuleRes.rule.pattern}' added.`);

// Test Toggle Banned Keyword Rule
const toggleRuleRes = storeModule.toggleBannedKeywordRule(addRuleRes.rule.id, false);
assert.ok(toggleRuleRes.success, "toggleBannedKeywordRule should succeed");

// Test Delete Banned Keyword Rule
const deleteRuleRes = storeModule.deleteBannedKeywordRule(addRuleRes.rule.id);
assert.ok(deleteRuleRes.success, "deleteBannedKeywordRule should succeed");
const afterDel = storeModule.getCommunityModerationData().bannedKeywords.find((r) => r.id === addRuleRes.rule.id);
assert.strictEqual(afterDel, undefined, "Deleted rule must not exist");
console.log(`✅ deleteBannedKeywordRule verified: Rule ${addRuleRes.rule.id} removed.`);

// Test Apply User Sanction (Shadowban)
const sanctionRes = storeModule.applyUserSanction({
  userId: "usr-stu-test-spammer",
  userName: "تستر هرزنامه",
  userEmail: "test.spam@endoora.com",
  sanctionType: "shadowban",
  reason: "ارسال پیام‌های تست خودکار در تالار گفتگو",
});
assert.ok(sanctionRes.success, "applyUserSanction should succeed");
assert.strictEqual(sanctionRes.record.sanctionType, "shadowban");
assert.strictEqual(sanctionRes.record.isActive, true);
console.log(`✅ applyUserSanction verified: Shadowban applied to ${sanctionRes.record.userName}.`);

// Test Lift User Sanction
const liftRes = storeModule.liftUserSanction(sanctionRes.record.id);
assert.ok(liftRes.success, "liftUserSanction should succeed");
const liftedRecord = storeModule.getCommunityModerationData().sanctionedUsers.find((s) => s.id === sanctionRes.record.id);
assert.strictEqual(liftedRecord?.isActive, false);
console.log(`✅ liftUserSanction verified: Sanction lifted for ${sanctionRes.record.userName}.`);

// Test Reset to Pristine Seed
storeModule.resetCommunityModerationDataToInitial();
const resetData = storeModule.getCommunityModerationData();
assert.strictEqual(resetData.comments.length, 6);
assert.strictEqual(resetData.bannedKeywords.length, 5);
assert.strictEqual(resetData.sanctionedUsers.length, 3);
const resetCmt4 = resetData.comments.find((c) => c.id === "cmt-004");
assert.strictEqual(resetCmt4?.status, "pending");
assert.strictEqual(resetCmt4?.officialReply, undefined);
console.log("✅ resetCommunityModerationDataToInitial successfully restored pristine seed data.");

console.log("\n🎉 ALL COMMUNITY MODERATION SYSTEM INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
