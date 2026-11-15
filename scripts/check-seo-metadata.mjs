import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

console.log("🧪 Starting Automated SEO, Meta Tags, URL Redirects & Structured Data Studio Integrity Checks...\n");

// 1. Verify file existence
const REQUIRED_FILES = [
  "apps/web/lib/seo-metadata-content.ts",
  "apps/web/lib/seo-metadata-store.ts",
  "apps/web/app/api/admin/seo/route.ts",
  "apps/web/components/admin/seo-metadata.module.css",
  "apps/web/components/admin/SeoMetadataConsole.tsx",
];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  assert.ok(fs.existsSync(fullPath), `Required file missing: ${relPath}`);
  console.log(`✅ File exists: ${relPath}`);
}

// 2. Read and verify CSS classes
const cssContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/components/admin/seo-metadata.module.css"),
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
  "deskLayout",
  "cardPanel",
  "panelTitle",
  "panelDesc",
  "formGroup",
  "formLabelRow",
  "formLabel",
  "charCounter",
  "charOptimal",
  "charWarning",
  "formInput",
  "formTextarea",
  "selectInput",
  "btnSaveMeta",
  "serpSimulatorCard",
  "serpUrlRow",
  "serpFavicon",
  "serpSiteName",
  "serpTitle",
  "serpSnippet",
  "socialMockupCard",
  "socialImagePreview",
  "socialContent",
  "socialDomain",
  "socialTitle",
  "socialDesc",
  "redirectFormBar",
  "redirectInputsRow",
  "btnAddRedirect",
  "tableCard",
  "tableCardHeader",
  "tableCardTitle",
  "tableWrapper",
  "table",
  "badge",
  "badge301",
  "badge302",
  "badgeActive",
  "badgeInactive",
  "schemaListGrid",
  "schemaCard",
  "schemaCardActive",
  "codeViewer",
  "btnActionCopy",
  "btnActionDelete",
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
  masterAdminContent.includes('import { SeoMetadataConsole } from "./SeoMetadataConsole";'),
  "MasterAdminConsole missing SeoMetadataConsole import"
);
assert.ok(
  masterAdminContent.includes('"seo"'),
  "MasterAdminConsole missing 'seo' in AdminModuleTab"
);
assert.ok(
  masterAdminContent.includes("<SeoMetadataConsole />"),
  "MasterAdminConsole missing <SeoMetadataConsole /> render block"
);
assert.ok(
  masterAdminContent.includes('activeTab === "seo"'),
  "MasterAdminConsole missing activeTab seo check"
);
console.log("✅ MasterAdminConsole wiring verified.");

// 4. Verify API route actions
const routeContent = fs.readFileSync(
  path.resolve(process.cwd(), "apps/web/app/api/admin/seo/route.ts"),
  "utf-8"
);
const EXPECTED_ACTIONS = [
  "update_page_meta",
  "create_redirect",
  "toggle_redirect",
  "delete_redirect",
  "update_schema",
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
const storeModule = await import("../apps/web/lib/seo-metadata-store.ts");

// Idempotent reset before tests
storeModule.resetSeoMetadataDataToInitial();

const initialData = storeModule.getSeoMetadataData();
assert.ok(Array.isArray(initialData.pages), "Data should contain pages array");
assert.ok(Array.isArray(initialData.redirects), "Data should contain redirects array");
assert.ok(Array.isArray(initialData.schemas), "Data should contain schemas array");
assert.strictEqual(initialData.pages.length, 5, "Should have 5 initial pages configured");
assert.strictEqual(initialData.redirects.length, 4, "Should have 4 initial redirects");
assert.strictEqual(initialData.schemas.length, 3, "Should have 3 initial schemas");
console.log(
  `✅ Initial data verified: ${initialData.pages.length} pages, ${initialData.redirects.length} redirects, ${initialData.schemas.length} schemas.`
);

const initialStats = storeModule.getSeoStudioStats();
assert.strictEqual(typeof initialStats.totalPagesConfigured, "number");
assert.strictEqual(typeof initialStats.totalActiveRedirects, "number");
assert.strictEqual(typeof initialStats.totalRedirectHits, "number");
assert.strictEqual(typeof initialStats.totalSchemasGenerated, "number");
assert.strictEqual(typeof initialStats.avgTitleLength, "number");
assert.strictEqual(typeof initialStats.avgDescLength, "number");
assert.ok(initialStats.totalPagesConfigured >= 5);
assert.ok(initialStats.totalActiveRedirects >= 3);
console.log(
  `✅ Stats calculation verified: Pages: ${initialStats.totalPagesConfigured}, Active Redirects: ${initialStats.totalActiveRedirects}, Hits: ${initialStats.totalRedirectHits}.`
);

// Test Update Page Metadata
const updateRes = storeModule.updatePageSeoMetadata(
  "/",
  {
    metaTitle: "آموزش زبان انگلیسی ایندورا | هوشمند و نوین",
    metaDescription: "پلتفرم جامع یادگیری زبان انگلیسی با هوش مصنوعی و اساتید بین‌المللی",
    focusKeywords: ["زبان انگلیسی", "آموزش آنلاین", "آیلتس تضمینی"],
  },
  "تستر ارشد سئو"
);
assert.ok(updateRes.success, "updatePageSeoMetadata should succeed");
assert.strictEqual(updateRes.page.metaTitle, "آموزش زبان انگلیسی ایندورا | هوشمند و نوین");
assert.strictEqual(updateRes.page.updatedBy, "تستر ارشد سئو");
console.log(`✅ updatePageSeoMetadata verified for page '/': "${updateRes.page.metaTitle}"`);

// Test Redirect Loop Detection 1: Self-reference
const selfLoopRes = storeModule.createRedirectRule({
  sourcePath: "/same-path",
  destinationPath: "/same-path",
});
assert.strictEqual(selfLoopRes.success, false, "Self-reference redirect should be blocked");
assert.ok(selfLoopRes.error?.includes("مسیر مبدا و مقصد نمی‌توانند یکسان باشند"), "Should return self-loop error");
console.log(`✅ Anti-Loop Guard 1 (Self-Reference) verified: blocked successfully.`);

// Test Redirect Loop Detection 2: 2-step circular redirect
const circStep1 = storeModule.createRedirectRule({
  sourcePath: "/route-a",
  destinationPath: "/route-b",
});
assert.ok(circStep1.success, "First leg of redirect should be created");

const circStep2 = storeModule.createRedirectRule({
  sourcePath: "/route-b",
  destinationPath: "/route-a",
});
assert.strictEqual(circStep2.success, false, "Circular 2-step redirect (/b -> /a) should be blocked");
assert.ok(circStep2.error?.includes("حلقه"), "Should return circular loop error message");
console.log(`✅ Anti-Loop Guard 2 (2-Step Circular Loop) verified: blocked successfully.`);

// Test Valid Redirect Creation
const validRedir = storeModule.createRedirectRule({
  sourcePath: "/old-blog/ielts-tips",
  destinationPath: "/blog/ielts-tips",
  redirectType: "301_permanent",
  notes: "مهاجرت مقاله قدیمی وبلاگ",
});
assert.ok(validRedir.success, "createRedirectRule should succeed for valid paths");
assert.strictEqual(validRedir.rule.sourcePath, "/old-blog/ielts-tips");
assert.strictEqual(validRedir.rule.destinationPath, "/blog/ielts-tips");
assert.strictEqual(validRedir.rule.isActive, true);
console.log(`✅ createRedirectRule verified: ${validRedir.rule.sourcePath} -> ${validRedir.rule.destinationPath}`);

// Test Toggle Redirect Rule
const toggleRes = storeModule.toggleRedirectRule(validRedir.rule.id, false);
assert.ok(toggleRes.success, "toggleRedirectRule to false should succeed");
assert.strictEqual(toggleRes.rule?.isActive, false);

const toggleBack = storeModule.toggleRedirectRule(validRedir.rule.id, true);
assert.ok(toggleBack.success, "toggleRedirectRule to true should succeed");
assert.strictEqual(toggleBack.rule?.isActive, true);
console.log(`✅ toggleRedirectRule verified: Active state toggled successfully.`);

// Test Delete Redirect Rule
const deleteRes = storeModule.deleteRedirectRule(validRedir.rule.id);
assert.ok(deleteRes.success, "deleteRedirectRule should succeed");
const afterDel = storeModule.getSeoMetadataData().redirects.find((r) => r.id === validRedir.rule.id);
assert.strictEqual(afterDel, undefined, "Deleted rule should no longer exist");
console.log(`✅ deleteRedirectRule verified: Rule ${validRedir.rule.id} removed.`);

// Clean up temporary route-a rule
storeModule.deleteRedirectRule(circStep1.rule.id);

// Test Update Schema JSON-LD
const updateSchemaRes = storeModule.updateSchemaJsonLd("sch-org-001", {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "آکادمی بین‌المللی ایندورا (نسخه تست)",
  url: "https://endoora.com",
});
assert.ok(updateSchemaRes.success, "updateSchemaJsonLd should succeed");
assert.strictEqual(updateSchemaRes.schema?.jsonLdPayload.name, "آکادمی بین‌المللی ایندورا (نسخه تست)");
console.log(`✅ updateSchemaJsonLd verified: Updated schema '${updateSchemaRes.schema?.schemaType}'.`);

// Test Reset to Pristine Seed
storeModule.resetSeoMetadataDataToInitial();
const resetData = storeModule.getSeoMetadataData();
assert.strictEqual(resetData.pages.length, 5);
assert.strictEqual(resetData.redirects.length, 4);
assert.strictEqual(resetData.schemas.length, 3);
const resetOrgSchema = resetData.schemas.find((s) => s.id === "sch-org-001");
assert.strictEqual(resetOrgSchema?.jsonLdPayload.name, "آکادمی آموزش زبان انگلیسی ایندورا");
console.log("✅ resetSeoMetadataDataToInitial successfully restored pristine seed data.");

console.log("\n🎉 ALL SEO & METADATA STUDIO INTEGRITY CHECKS PASSED SUCCESSFULLY!\n");
