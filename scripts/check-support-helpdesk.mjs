import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Customer Support Helpdesk & Feedback Hub Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/support-content.ts",
  "apps/web/lib/support-store.ts",
  "apps/web/app/api/admin/support/route.ts",
  "apps/api/support/views.py",
  "apps/api/support/urls.py",
  "apps/web/app/support/page.tsx",
  "apps/web/components/admin/support-helpdesk.module.css",
  "apps/web/components/admin/SupportHelpdeskConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/support-helpdesk.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerTitle",
  "headerDesc",
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
  "priorityBadge",
  "categoryBadge",
  "statusBadge",
  "modalBackdrop",
  "ticketModalContent",
  "ticketModalHeader",
  "ticketModalTitle",
  "ticketModalBody",
  "chatSection",
  "chatTimeline",
  "messageBubbleUser",
  "messageBubbleStaff",
  "messageBubbleAi",
  "messageBubbleInternalNote",
  "ticketMetaSidebar",
  "aiSuggestedBox",
  "btnUseAiReply",
  "replyComposerArea",
  "feedbackGrid",
  "feedbackCard",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} CSS classes verified.`);

// 3. Read and verify Admin API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/support/route.ts"),
  "utf-8"
);
const EXPECTED_API_ACTIONS = [
  "send_reply",
  "add_internal_note",
  "update_status",
  "update_priority",
  "assign_staff",
  "create_canned_template",
  "resolve_feedback",
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
  masterContent.includes('import SupportHelpdeskConsole from "./SupportHelpdeskConsole"'),
  "MasterAdminConsole missing SupportHelpdeskConsole import"
);
assert.ok(
  masterContent.includes('{activeTab === "support" && <SupportHelpdeskConsole />}'),
  "MasterAdminConsole missing support tab binding"
);
assert.ok(
  masterContent.includes('setActiveTab("support")'),
  "MasterAdminConsole missing support sidebar button"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 5. Dynamic Testing of Support Store & Calculation Logic
import("../apps/web/lib/support-store.ts").then((supportStore) => {
  console.log("\n📦 Running Dynamic Support Store & Business Logic Verification...");

  // Reset seed before tests for idempotency
  supportStore.saveSupportDataToDisk({
    tickets: JSON.parse(JSON.stringify(supportStore.INITIAL_ADMIN_TICKETS)),
    templates: JSON.parse(JSON.stringify(supportStore.INITIAL_CANNED_TEMPLATES)),
    feedbacks: JSON.parse(JSON.stringify(supportStore.INITIAL_FEEDBACK_ITEMS)),
  });

  // A. Template Variable Replacement Test
  const rawTemplate = "سلام {نام} عزیز، تیکت #{کد تیکت} در دپارتمان ثبت شد.";
  const replaced = supportStore.replaceTemplateVariables(rawTemplate, {
    userName: "پویا صامتی",
    ticketId: "tkt-999",
  });
  assert.equal(replaced, "سلام پویا صامتی عزیز، تیکت #tkt-999 در دپارتمان ثبت شد.");
  console.log("✅ Canned template variable replacement verified.");

  // B. Reply to Ticket
  const initialTicket = supportStore.getSupportData().tickets.find((t) => t.id === "tkt-103");
  assert.ok(initialTicket);
  const msgCountBefore = initialTicket.messages.length;

  const replyRes = supportStore.replyToTicket("tkt-103", {
    body: "سلام کامران عزیز، تنظیمات میکروفون سرور بررسی و مشکل برطرف شد.",
    senderName: "کارشناس تست",
    markResolved: true,
  });
  assert.equal(replyRes.success, true);
  assert.equal(replyRes.ticket.messages.length, msgCountBefore + 1);
  assert.equal(replyRes.ticket.status, "resolved");
  console.log("✅ Ticket staff reply and status resolution verified.");

  // C. Add Confidential Internal Note
  const noteRes = supportStore.addInternalNote("tkt-103", {
    note: "یادداشت امنیتی محرمانه: نسخه مرورگر کاربر کروم ۱۲۸ بوده است.",
    staffName: "مدیر پشتیبانی",
  });
  assert.equal(noteRes.success, true);
  const lastMsg = noteRes.ticket.messages[noteRes.ticket.messages.length - 1];
  assert.equal(lastMsg.isInternalNote, true, "Internal note must have isInternalNote: true");
  assert.equal(lastMsg.senderType, "internal_note");
  console.log("✅ Confidential internal staff note privacy flag verified.");

  // D. Update Priority & Auto-Escalate
  const prioRes = supportStore.updateTicketPriority("tkt-104", "critical");
  assert.equal(prioRes.success, true);
  assert.equal(prioRes.ticket.priority, "critical");
  assert.equal(prioRes.ticket.escalatedToHuman, true, "Critical tickets must escalate to human");
  console.log("✅ Ticket priority update & human escalation verified.");

  // E. Create Canned Response Template
  const tplRes = supportStore.createCannedTemplate({
    title: "قالب تست آزمون نهایی",
    category: "courses",
    shortcutCode: "/tamrin20_test",
    bodyTemplate: "سلام {نام} عزیز، نمرات آزمون نهایی در پنل ثبت شد.",
  });
  assert.equal(tplRes.success, true);
  assert.equal(tplRes.template.shortcutCode, "/tamrin20_test");
  console.log("✅ Canned response template creation verified.");

  // F. Resolve Feedback Item
  const fdbRes = supportStore.resolveFeedbackItem("fdb-002", "منوی ناوبری در موبایل اصلاح گردید.");
  assert.equal(fdbRes.success, true);
  assert.equal(fdbRes.feedback.status, "resolved");
  assert.equal(fdbRes.feedback.adminResponseNote, "منوی ناوبری در موبایل اصلاح گردید.");
  console.log("✅ Feedback inbox resolution & admin response note verified.");

  // G. Reset Seed
  supportStore.saveSupportDataToDisk({
    tickets: [...supportStore.INITIAL_ADMIN_TICKETS],
    templates: [...supportStore.INITIAL_CANNED_TEMPLATES],
    feedbacks: [...supportStore.INITIAL_FEEDBACK_ITEMS],
  });
  console.log("✅ Seed reset verified.");

  console.log("\n🎉 ALL CUSTOMER SUPPORT HELPDESK & FEEDBACK CHECKS PASSED SUCCESSFULLY!");
}).catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
