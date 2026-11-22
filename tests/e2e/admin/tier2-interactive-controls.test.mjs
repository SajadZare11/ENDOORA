import fs from "fs";
import path from "path";
import { expect, createRegistry } from "./helpers/assertions.mjs";

export const registry = createRegistry("Tier 2: Interactive Controls & Component Suite");

const ADMIN_COMPONENTS_DIR = path.resolve("apps/web/components/admin");
const MASTER_CONSOLE_PATH = path.join(ADMIN_COMPONENTS_DIR, "MasterAdminConsole.tsx");
const HELP_MODAL_PATH = path.join(ADMIN_COMPONENTS_DIR, "AdminHelpModal.tsx");
const TEACHER_HUB_PATH = path.join(ADMIN_COMPONENTS_DIR, "TeacherVerificationHub.tsx");

const EXPECTED_TABS = [
  "overview",
  "site-cms",
  "site-builder",
  "forms-webhooks",
  "seo",
  "academics",
  "exam-integrity",
  "users",
  "teacher-verifications",
  "teacher-contracts",
  "support",
  "community",
  "finance",
  "marketing",
  "broadcast",
  "gamification-affiliates",
  "analytics",
  "system-ops",
  "ai-engine",
  "security",
];

const REQUIRED_MODAL_COMPONENTS = [
  "AdminDangerConfirmModal.tsx",
  "AdminPinModal.tsx",
  "AdminHelpModal.tsx",
  "AdminUndoToast.tsx",
  "AdminHoverTooltip.tsx",
  "AdminSafetyBox.tsx",
  "AdminLiveWebsitePreview.tsx",
];

// 1. Verify all 20 tabs in MasterAdminConsole
registry.test("MasterAdminConsole has all 20 tabs mapped in ADMIN_CATEGORIES", () => {
  const code = fs.readFileSync(MASTER_CONSOLE_PATH, "utf-8");
  for (const tab of EXPECTED_TABS) {
    expect(code.includes(`id: "${tab}"`)).toBe(true, `Tab '${tab}' missing in ADMIN_CATEGORIES`);
  }
});

registry.test("MasterAdminConsole renders distinct component view for every active tab", () => {
  const code = fs.readFileSync(MASTER_CONSOLE_PATH, "utf-8");
  for (const tab of EXPECTED_TABS) {
    expect(code.includes(`activeTab === "${tab}"`)).toBe(true, `Renderer missing for tab '${tab}'`);
  }
});

// 2. Verify Help Guides exist for every tab
registry.test("AdminHelpModal defines complete help guide entries for all 20 tabs", () => {
  const code = fs.readFileSync(HELP_MODAL_PATH, "utf-8");
  for (const tab of EXPECTED_TABS) {
    const hasKey = code.includes(`"${tab}":`) || code.includes(`${tab}:`);
    expect(hasKey).toBe(true, `Help guide missing for module '${tab}'`);
  }
});

// 3. Verify Modal and Toast support components exist
for (const modalFile of REQUIRED_MODAL_COMPONENTS) {
  registry.test(`Admin UI Modal/Control component ${modalFile} exists and exports valid React component`, () => {
    const fullPath = path.join(ADMIN_COMPONENTS_DIR, modalFile);
    expect(fs.existsSync(fullPath)).toBe(true, `Missing modal component file: ${modalFile}`);
    const code = fs.readFileSync(fullPath, "utf-8");
    expect(code.includes("export function") || code.includes("export default")).toBe(true, `No export in ${modalFile}`);
  });
}

// 4. Verify no-op handler resolution in TeacherVerificationHub
registry.test("TeacherVerificationHub badge assignment checkbox uses active toggle handler (no no-op)", () => {
  const code = fs.readFileSync(TEACHER_HUB_PATH, "utf-8");
  expect(code.includes("onChange={() => {}}")).toBe(false, "Found no-op empty callback in TeacherVerificationHub");
  expect(code.includes("handleToggleBadge")).toBe(true, "handleToggleBadge is missing in TeacherVerificationHub");
});

// 5. Verify GamificationAffiliatesHub is properly mounted
registry.test("GamificationAffiliatesHub is imported and mounted inside MasterAdminConsole", () => {
  const code = fs.readFileSync(MASTER_CONSOLE_PATH, "utf-8");
  expect(code.includes("import { GamificationAffiliatesHub }")).toBe(true, "Missing GamificationAffiliatesHub import");
  expect(code.includes("<GamificationAffiliatesHub />")).toBe(true, "Missing <GamificationAffiliatesHub /> component render");
});
