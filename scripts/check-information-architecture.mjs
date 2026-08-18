import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "docs/product/sitemap.md",
  "docs/product/user-flows.md",
  "docs/product/account-hub.md",
  "docs/product/navigation-matrix.md",
  "docs/product/workflow-state-contracts.md",
  "docs/product/localization-contract.md",
  "docs/product/route-inventory.csv",
  "docs/product/wireframes/README.md",
  "docs/product/wireframes/placement-to-path.md",
  "docs/product/wireframes/daily-mission.md",
  "docs/product/wireframes/learn-now.md",
  "docs/product/wireframes/teacher-assignment.md",
  "docs/product/wireframes/fixed-class-enrollment.md",
  "docs/product/wireframes/ielts-attempt.md",
  "docs/decisions/ADR-002-navigation.md",
  "docs/operations/DAY_05_ACCEPTANCE_GATE.md",
  "apps/web/app/design-system/information-architecture/page.tsx",
  "apps/web/app/design-system/information-architecture/information-architecture.module.css",
];

const failures = [];

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing ${rel}`);
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

if (failures.length === 0) {
  const sitemap = read("docs/product/sitemap.md");
  const page = read("apps/web/app/design-system/information-architecture/page.tsx");
  const account = read("docs/product/account-hub.md");
  const states = read("docs/product/workflow-state-contracts.md");
  const localization = read("docs/product/localization-contract.md");
  const inventory = read("docs/product/route-inventory.csv");
  const css = read("apps/web/app/design-system/information-architecture/information-architecture.module.css");

  const learnerPrimary = ["Home", "Learn", "Practice", "Teachers & Classes", "Account"];
  const teacherPrimary = ["Home", "Teach", "Marketplace", "Resources", "Account"];
  const accountItems = [
    "Library", "Usage", "Premium", "Billing", "Profile", "Sessions",
    "Notifications", "Privacy / Data Controls", "Settings", "Support"
  ];
  const findability = ["Placement Test", "Today", "Create Assignment", "Learn Now", "Billing"];
  const requiredStates = ["Loading", "Empty", "Error", "Offline", "Expired session", "Permission denied"];

  for (const label of learnerPrimary) {
    if (!sitemap.includes(label) || !page.includes(label)) failures.push(`Learner navigation missing: ${label}`);
  }
  for (const label of teacherPrimary) {
    if (!sitemap.includes(label) || !page.includes(label)) failures.push(`Teacher navigation missing: ${label}`);
  }
  for (const label of accountItems) {
    if (!account.includes(label) || !page.includes(label)) failures.push(`Account hub missing: ${label}`);
  }
  for (const label of findability) {
    if (!page.includes(label)) failures.push(`Findability prototype missing: ${label}`);
  }
  for (const label of requiredStates) {
    if (!states.toLowerCase().includes(label.toLowerCase())) failures.push(`State contract missing: ${label}`);
  }

  const persianRequired = ["خانه", "تعیین سطح", "مدرس‌ها", "حساب کاربری", "صورتحساب", "فارسی"];
  for (const label of persianRequired) {
    if (!page.includes(label)) failures.push(`Persian-first prototype missing label: ${label}`);
  }

  if (!page.includes('useState<Locale>("fa")')) {
    failures.push("Persian is not the default locale in the Day 05 IA prototype");
  }
  if (!page.includes('dir={locale === "fa" ? "rtl" : "ltr"}')) {
    failures.push("IA prototype does not switch RTL/LTR with locale");
  }
  if (
    !page.includes("document.documentElement") ||
    !page.includes("root.lang = locale") ||
    !page.includes('root.dir = locale === "fa" ? "rtl" : "ltr"')
  ) {
    failures.push("Visible locale changes do not update the actual HTML lang/dir attributes");
  }
  if (!page.includes("A new door to your English") || !page.includes("EndooraWordmark")) {
    failures.push("English Endoora title/motto brand exception is missing");
  }
  if (!localization.includes("default user-facing language is **Persian (fa)**")) {
    failures.push("Localization contract does not declare Persian as the default UI");
  }
  if (!localization.includes("English") || !localization.includes("RTL") || !localization.includes("LTR")) {
    failures.push("Localization contract is missing English switch or RTL/LTR rules");
  }

  const routeLines = inventory.split(/\r?\n/).filter(Boolean);
  if (routeLines.length < 80) failures.push(`Route inventory too small: ${routeLines.length - 1} data rows`);
  if (!inventory.includes("route_guard") || !inventory.includes("primary_cta") || !inventory.includes("deep_link_contract")) {
    failures.push("Route inventory is missing required Day 05 contract columns");
  }

  const wireframeDir = path.join(root, "docs/product/wireframes");
  const criticalWireframes = fs.readdirSync(wireframeDir).filter((name) => name.endsWith(".md") && name !== "README.md");
  if (criticalWireframes.length !== 6) failures.push(`Expected exactly 6 critical wireframes, found ${criticalWireframes.length}`);

  if (/(^|[;{\s])(margin-left|margin-right|padding-left|padding-right|left|right)\s*:/m.test(css)) {
    failures.push("Day 05 CSS uses a physical left/right property instead of logical CSS");
  }
  if (/#[0-9a-fA-F]{3,8}\b/.test(css)) {
    failures.push("Day 05 CSS contains raw colors instead of centralized design tokens");
  }
}

if (failures.length) {
  console.error("Day 05 information-architecture checks FAILED:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Day 05 IA checks passed: Persian-first RTL default + English switch, root HTML lang/dir synchronization, Endoora title/motto preserved in English, " +
  "role navigation, Account hub, 6 critical wireframes, route ownership/deep-link contracts, required recovery states, " +
  "5 findability targets, and logical token CSS."
);
