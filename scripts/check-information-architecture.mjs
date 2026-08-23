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
  "apps/web/components/marketing/HomePage.tsx",
  "apps/web/app/(public)/page.tsx",
  "apps/web/app/en/page.tsx",
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
  const home = read("apps/web/components/marketing/HomePage.tsx");
  const persianHomeRoute = read("apps/web/app/(public)/page.tsx");
  const englishHomeRoute = read("apps/web/app/en/page.tsx");

  const learnerPrimary = ["Home", "Learn", "Practice", "Teachers & Classes", "Account"];
  const teacherPrimary = ["Home", "Teach", "Marketplace", "Resources", "Account"];
  const accountItems = [
    "Library", "Usage", "Premium", "Billing", "Profile", "Sessions",
    "Notifications", "Privacy / Data Controls", "Settings", "Support"
  ];
  const findability = ["Placement Test", "Today", "Create Assignment", "Learn Now", "Billing"];
  const requiredStates = ["Loading", "Empty", "Error", "Offline", "Expired session", "Permission denied"];
  const adminPrimary = ["Overview", "People", "Content", "Support", "Audit & controls"];

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
  for (const label of adminPrimary) {
    if (!sitemap.includes(label) && !page.includes(label)) failures.push(`Admin navigation missing: ${label}`);
  }

  function countNavigationItems(declaration) {
    const start = page.indexOf(`const ${declaration}: NavItem[] = [`);
    const end = page.indexOf("];", start);
    if (start < 0 || end < 0) return 0;
    return (page.slice(start, end).match(/{ fa:/g) ?? []).length;
  }

  if (countNavigationItems("learnerNavigation") !== 5) failures.push("Learner primary navigation must contain exactly five items");
  if (countNavigationItems("teacherNavigation") !== 5) failures.push("Teacher primary navigation must contain exactly five items");
  if (!page.includes("mobilePreviewGrid") || !page.includes("phonePreview")) failures.push("Signed-in mobile navigation previews are missing");

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

  const expectedFlowIds = ["placement-path", "daily-mission", "learn-now", "teacher-assignment", "fixed-class", "ielts-attempt"];
  for (const id of expectedFlowIds) {
    if (!page.includes(`id: "${id}"`)) failures.push(`Clickable flow definition missing: ${id}`);
  }
  const decisionCounts = [...page.matchAll(/decisions: (\d+)/g)].map((match) => Number(match[1]));
  if (decisionCounts.length !== 6) failures.push(`Expected six flow decision counts, found ${decisionCounts.length}`);
  if (decisionCounts.some((count) => count > 3)) failures.push("A critical flow exceeds the three-decision findability limit");
  if (!page.includes("aria-pressed={flow.id === activeFlow.id}") || !page.includes("setActiveStep(index)")) {
    failures.push("The six flow wireframes are not interactively selectable by flow and step");
  }
  if (!page.includes("Previous step") || !page.includes("Next step") || !page.includes("disabled={activeStep === 0}")) {
    failures.push("Flow step navigation does not expose bounded Previous/Next controls");
  }
  for (const status of ['"current"', '"planned"', '"foundation"']) {
    if (!page.includes(`status: ${status}`)) failures.push(`Route maturity is not represented: ${status}`);
  }

  const currentRouteExamples = ["/dashboard", "/path", "/today", "/practice-ai", "/teacher/classes", "/content/questions"];
  for (const route of currentRouteExamples) {
    if (!page.includes(route) || !sitemap.includes(route)) failures.push(`Current route reconciliation missing: ${route}`);
  }

  if (!home.includes("Preview · no invented learner data") || /(?:72|58|81)%/.test(home)) {
    failures.push("Homepage Learner Twin preview contains fabricated score precision or lacks its honest preview label");
  }
  if (!home.includes("bodyEn:") || !home.includes("textEn:")) {
    failures.push("Homepage learning-loop or feature descriptions are not localized for English");
  }
  if (!persianHomeRoute.includes('<PublicShell locale="fa"') || !englishHomeRoute.includes('<PublicShell locale="en"')) {
    failures.push("Persian and English home routes do not share the localized public shell");
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
  for (const wireframe of criticalWireframes) {
    const wireframeCopy = read(`docs/product/wireframes/${wireframe}`).toLowerCase();
    if (!wireframeCopy.includes("recovery")) failures.push(`Wireframe has no recovery contract: ${wireframe}`);
    if (!wireframeCopy.includes("findability target")) failures.push(`Wireframe has no findability target: ${wireframe}`);
  }

  if (/(^|[;{\s])(margin-left|margin-right|padding-left|padding-right|left|right)\s*:/m.test(css)) {
    failures.push("Day 05 CSS uses a physical left/right property instead of logical CSS");
  }
  if (/#[0-9a-fA-F]{3,8}\b/.test(css)) {
    failures.push("Day 05 CSS contains raw colors instead of centralized design tokens");
  }
  if (!css.includes(":focus-visible")) failures.push("Day 05 prototype has no explicit visible keyboard-focus rule");
}

if (failures.length) {
  console.error("Day 05 information-architecture checks FAILED:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Day 05 IA checks passed: Persian-first localization, four role maps, exact five-item learner/teacher mobile navigation, " +
  "six clickable flow prototypes, decision counts, recovery contracts, current/planned route labels, honest homepage preview data, and logical token CSS."
);
