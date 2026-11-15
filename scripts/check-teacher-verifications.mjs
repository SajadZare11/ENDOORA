import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated Teacher Verification Hub Integrity Checks...\n");

// 1. Verify existence of required files
const REQUIRED_FILES = [
  "apps/web/lib/teacher-verifications-content.ts",
  "apps/web/lib/teacher-verifications-store.ts",
  "apps/web/app/api/admin/teachers/verifications/route.ts",
  "apps/web/components/admin/TeacherVerificationHub.tsx",
  "apps/web/components/admin/teacher-verification.module.css",
  "apps/web/components/admin/MasterAdminConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify MasterAdminConsole includes TeacherVerificationHub and the new tab
const masterAdminContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/MasterAdminConsole.tsx"),
  "utf-8"
);
assert.ok(
  masterAdminContent.includes("TeacherVerificationHub"),
  "MasterAdminConsole.tsx must import TeacherVerificationHub"
);
assert.ok(
  masterAdminContent.includes('teacher-verifications'),
  "MasterAdminConsole.tsx must include teacher-verifications tab"
);
assert.ok(
  masterAdminContent.includes("بررسی و احراز اساتید"),
  "MasterAdminConsole.tsx must include Persian title for the verification hub in sidebar"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 3. Verify CSS module defines critical UI classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/teacher-verification.module.css"),
  "utf-8"
);
const EXPECTED_CLASSES = [
  "container",
  "headerCard",
  "kpiGrid",
  "kpiCard",
  "pulseBadge",
  "toolbarCard",
  "statusTabsRow",
  "statusTabBtn",
  "table",
  "statusBadge",
  "modalBackdrop",
  "modalContent",
  "stepperNav",
  "stepTab",
  "dossierGrid",
  "docsGrid",
  "videoPreviewBox",
  "tiersGrid",
  "badgesMatrix",
  "decisionActionsPanel",
];

for (const cls of EXPECTED_CLASSES) {
  assert.ok(cssContent.includes(`.${cls}`), `CSS module missing class: .${cls}`);
}
console.log(`✅ All ${EXPECTED_CLASSES.length} core CSS classes verified.`);

// 4. Verify API route methods and error handling
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/teachers/verifications/route.ts"),
  "utf-8"
);
assert.ok(routeContent.includes("export async function GET"), "API route must export GET");
assert.ok(routeContent.includes("export async function POST"), "API route must export POST");
assert.ok(routeContent.includes("review_decision"), "API route must handle review_decision action");
assert.ok(routeContent.includes("reset_seed"), "API route must handle reset_seed action");
assert.ok(routeContent.includes("recordAuditLog"), "API route must record audit log on decision");
console.log("✅ API Route handler specification verified.");

// 5. Verify Badge Catalog in content
const badgeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/lib/teacher-verifications-content.ts"),
  "utf-8"
);
const EXPECTED_BADGES = [
  "celta_delta",
  "ielts_examiner",
  "top_rated",
  "native_accent",
  "konkur_expert",
  "conversation_master",
];
for (const bKey of EXPECTED_BADGES) {
  assert.ok(badgeContent.includes(bKey), `Badge catalog must define badge: ${bKey}`);
}
console.log(`✅ All ${EXPECTED_BADGES.length} official badges present in store catalog.`);

// 6. Verify 4-step dossier structure in component
const componentContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/TeacherVerificationHub.tsx"),
  "utf-8"
);
assert.ok(componentContent.includes("activeModalStep === 1"), "Modal must support Step 1 (Identity & Education)");
assert.ok(componentContent.includes("activeModalStep === 2"), "Modal must support Step 2 (Demo Video & Certs)");
assert.ok(componentContent.includes("activeModalStep === 3"), "Modal must support Step 3 (Commission & Badges)");
assert.ok(componentContent.includes("activeModalStep === 4"), "Modal must support Step 4 (Decision Dispatch)");
assert.ok(componentContent.includes("handleSubmitDecision"), "Component must have decision submission logic");
console.log("✅ 4-Step modal dossier architecture in TeacherVerificationHub verified.");

console.log("\n🎉 ALL TEACHER VERIFICATION HUB CHECKS PASSED SUCCESSFULLY!");
