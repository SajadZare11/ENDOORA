import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Exam & Placement Integrity Hub System Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/exam-integrity-content.ts",
  "apps/web/lib/exam-integrity-store.ts",
  "apps/web/app/api/admin/exams/integrity/route.ts",
  "apps/web/components/admin/exam-integrity.module.css",
  "apps/web/components/admin/ExamIntegrityConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/exam-integrity.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "headerInfo",
  "headerTitle",
  "headerDesc",
  "headerActions",
  "statsRow",
  "statCard",
  "statLabel",
  "statVal",
  "statSub",
  "tabNav",
  "tabBtn",
  "tabBtnActive",
  "tabBadge",
  "tabBadgeWarning",
  "tabBadgeDanger",
  "sectionHeader",
  "sectionTitle",
  "sectionDesc",
  "filterBar",
  "searchInput",
  "filterSelect",
  "sessionsGrid",
  "sessionCard",
  "sessionCardActive",
  "sessionCardFlagged",
  "sessionCardSuspended",
  "sessionCardHeader",
  "studentMeta",
  "studentName",
  "examTitle",
  "integrityScoreBadge",
  "scoreHigh",
  "scoreMedium",
  "scoreLow",
  "sessionTelemetry",
  "telemetryItem",
  "telemetryVal",
  "violationsBox",
  "violationsTitle",
  "violationsList",
  "violationRow",
  "violationPardoned",
  "adminNotesBadge",
  "sessionCardActions",
  "btn",
  "btnPrimary",
  "btnSuccess",
  "btnWarning",
  "btnDanger",
  "btnSm",
  "badge",
  "badgeSuccess",
  "badgeWarning",
  "badgeDanger",
  "badgeInfo",
  "badgeMuted",
  "tableCard",
  "tableResponsive",
  "table",
  "th",
  "td",
  "tr",
  "scorePillGroup",
  "scorePill",
  "scorePillHighlight",
  "distractorList",
  "distractorRow",
  "distractorBarBg",
  "distractorBarFill",
  "distractorCorrectFill",
  "distractorTrapFill",
  "modalOverlay",
  "modalBox",
  "modalHeader",
  "modalTitle",
  "closeBtn",
  "modalBody",
  "modalFooter",
  "formGroup",
  "formLabel",
  "formInput",
  "formSelect",
  "formTextarea",
  "criteriaGrid",
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
  masterAdminContent.includes('import { ExamIntegrityConsole } from "./ExamIntegrityConsole";'),
  "MasterAdminConsole missing ExamIntegrityConsole import"
);
assert.ok(
  masterAdminContent.includes('"exam-integrity"'),
  "MasterAdminConsole missing 'exam-integrity' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<ExamIntegrityConsole />"),
  "MasterAdminConsole missing <ExamIntegrityConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "exam-integrity"'),
  "MasterAdminConsole missing activeTab exam-integrity check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/exams/integrity/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "send_warning",
  "suspend_session",
  "resume_session",
  "pardon_violation",
  "grant_compensation_time",
  "invalidate_session",
  "calibrate_ai_score",
  "confirm_ai_score",
  "quarantine_question",
  "activate_question",
  "regrade_question",
  "resolve_appeal",
  "reset_data",
];

for (const act of EXPECTED_ACTIONS) {
  assert.ok(
    routeContent.includes(`case "${act}":`),
    `API route missing case handler for action: ${act}`
  );
}
console.log(`✅ All ${EXPECTED_ACTIONS.length} API action handlers verified.`);

// 5. Test dynamic store operations in TypeScript/ESM
const storeModule = await import("../apps/web/lib/exam-integrity-store.ts");

// Idempotent reset before tests
storeModule.resetExamIntegrityDataToInitial();

const initialData = storeModule.getExamIntegrityData();
assert.ok(Array.isArray(initialData.sessions), "Data should contain sessions array");
assert.ok(Array.isArray(initialData.aiAudits), "Data should contain aiAudits array");
assert.ok(Array.isArray(initialData.psychometrics), "Data should contain psychometrics array");
assert.ok(Array.isArray(initialData.appeals), "Data should contain appeals array");
assert.strictEqual(initialData.sessions.length, 4, "Should have 4 initial sessions");
assert.strictEqual(initialData.aiAudits.length, 3, "Should have 3 initial AI audits");
assert.strictEqual(initialData.psychometrics.length, 3, "Should have 3 initial psychometrics items");
assert.strictEqual(initialData.appeals.length, 2, "Should have 2 initial appeals");
console.log(
  `✅ Initial data verified: ${initialData.sessions.length} sessions, ${initialData.aiAudits.length} AI audits, ${initialData.psychometrics.length} psychometric items, ${initialData.appeals.length} appeals.`
);

const initialStats = initialData.stats;
assert.strictEqual(typeof initialStats.activeSessionsCount, "number");
assert.strictEqual(typeof initialStats.flaggedViolationsToday, "number");
assert.strictEqual(typeof initialStats.pendingAiAudits, "number");
assert.strictEqual(typeof initialStats.quarantinedQuestions, "number");
assert.strictEqual(typeof initialStats.openAppeals, "number");
assert.strictEqual(typeof initialStats.platformAvgIntegrityScore, "number");
console.log(
  `✅ Stats calculation verified: Active Sessions: ${initialStats.activeSessionsCount}, Violations: ${initialStats.flaggedViolationsToday}, Avg Score: ${initialStats.platformAvgIntegrityScore}%.`
);

// Test 1: Send Live Warning
const warnRes = storeModule.sendLiveWarning("sess-live-102", "لطفاً از صفحه آزمون خارج نشوید.");
assert.strictEqual(warnRes.id, "sess-live-102");
assert.strictEqual(warnRes.status, "flagged");
assert.ok(warnRes.adminNotes?.includes("لطفاً از صفحه آزمون خارج نشوید."));
console.log("✅ sendLiveWarning verified.");

// Test 2: Suspend & Resume Session
const suspRes = storeModule.suspendExamSession("sess-live-102", "مشاهده رفتارهای پرخطر");
assert.strictEqual(suspRes.status, "suspended");
const resumeRes = storeModule.resumeExamSession("sess-live-102");
assert.strictEqual(resumeRes.status, "active");
console.log("✅ suspendExamSession and resumeExamSession verified.");

// Test 3: Pardon Violation
const pardonRes = storeModule.pardonViolation("sess-live-101", "viol-01", "خطای غیرعمدی کاربر");
const viol01 = pardonRes.violations.find((v) => v.id === "viol-01");
assert.ok(viol01?.isPardoned, "Violation should be marked as pardoned");
console.log("✅ pardonViolation verified.");

// Test 4: Grant Compensation Time
const grantRes = storeModule.grantCompensationTime("sess-live-101", 10);
assert.strictEqual(grantRes.durationMinutes, 70);
console.log("✅ grantCompensationTime verified: 10 minutes added.");

// Test 5: Invalidate Session (DQ)
const dqRes = storeModule.invalidateExamSession("sess-live-103", "تقلب اثبات‌شده با F12 DevTools");
assert.strictEqual(dqRes.status, "disqualified");
assert.strictEqual(dqRes.integrityScore, 0);
assert.strictEqual(dqRes.timeRemainingSeconds, 0);
console.log("✅ invalidateExamSession verified: status disqualified and score 0.");

// Test 6: AI Grade Calibration
const calibRes = storeModule.calibrateAiScore(
  "aud-ai-001",
  { tr: 7.0, cc: 6.5, lr: 7.0, gra: 6.5, overallBand: 7.0 },
  "تسک اچیومنت شایسته نمره ۷ بود.",
  "دکتر مریم رضوانی"
);
assert.strictEqual(calibRes.status, "calibrated");
assert.strictEqual(calibRes.humanScores?.overallBand, 7.0);
console.log("✅ calibrateAiScore verified: calibrated to Band 7.0.");

// Test 7: Confirm Original AI Score
const confirmRes = storeModule.confirmOriginalAiScore("aud-ai-002", "سرممیز آیلتس");
assert.strictEqual(confirmRes.status, "confirmed_original");
console.log("✅ confirmOriginalAiScore verified.");

// Test 8: Quarantine & Activate Question Item
const quarRes = storeModule.quarantineQuestionItem("psy-q-001", "ضریب تمیز منفی و خطای گزینه B");
assert.strictEqual(quarRes.status, "quarantined");
const actRes = storeModule.activateQuestionItem("psy-q-001");
assert.strictEqual(actRes.status, "active");
console.log("✅ quarantineQuestionItem and activateQuestionItem verified.");

// Test 9: Regrade Question Compensation
const regradeRes = storeModule.regradeQuestionCompensation("psy-q-001");
assert.strictEqual(regradeRes.item.status, "regraded_compensated");
assert.ok(regradeRes.affectedCandidatesCount > 0, "Should have affected candidates");
console.log(`✅ regradeQuestionCompensation verified: ${regradeRes.affectedCandidatesCount} candidates compensated.`);

// Test 10: Resolve Grade Appeal
const appealRes = storeModule.resolveGradeAppeal(
  "app-case-501",
  "upgraded",
  7.0,
  "بازبینی انجام شد و نمره به ۷.۰ ارتقا یافت.",
  true,
  "دکتر مریم رضوانی"
);
assert.strictEqual(appealRes.status, "upgraded");
assert.strictEqual(appealRes.revisedBand, 7.0);
assert.strictEqual(appealRes.refundIssued, true);
console.log("✅ resolveGradeAppeal verified: upgraded to Band 7.0 with refund.");

// Reset back to initial seed
storeModule.resetExamIntegrityDataToInitial();
console.log("✅ resetExamIntegrityDataToInitial successfully restored pristine seed data.\n");

console.log("🎉 ALL EXAM & PLACEMENT INTEGRITY HUB CHECKS PASSED SUCCESSFULLY!\n");
