import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  cells.push(current);
  return cells;
}

function parseCsv(relativePath) {
  const lines = read(relativePath).trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift() ?? "");
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

const requiredFiles = [
  "docs/product/product-constitution.md",
  "docs/product/feature-map.csv",
  "docs/product/feature-route-data-map.csv",
  "docs/product/risk-register.md",
  "docs/product/launch-cut-line.md",
  "docs/product/endoora-naming.md",
  "docs/decisions/ADR-001-scope.md",
  "docs/operations/domain-map.md",
  "docs/operations/irnic-domain-record.md",
  "docker-compose.yml",
  ".env.example",
  ".github/workflows/ci.yml",
  "packages/ui/src/tokens.css",
  "apps/web/app/design-system/page.tsx",
  "apps/web/app/design-system/components/page.tsx",
  "apps/web/app/design-system/information-architecture/page.tsx",
  "apps/web/components/marketing/HomePage.tsx",
  "apps/web/app/auth/login/page.tsx",
  "apps/web/app/auth/register/page.tsx",
  "apps/web/app/onboarding/page.tsx",
  "apps/web/components/learner/LearnerShell.tsx",
  "apps/web/components/teacher/TeacherShell.tsx",
  "docs/operations/DAY01_ACCEPTANCE.md",
  "docs/operations/DAY_02_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_03_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_04_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_05_ACCEPTANCE_GATE.md",
  "docs/product/DAY_06_PUBLIC_SITE.md",
  "docs/operations/DAY_06_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_07_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_08_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_09_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_10_ACCEPTANCE_GATE.md",
  "docs/operations/DAY_01_10_ACCEPTANCE_AUDIT.md",
];
requiredFiles.forEach(read);

const features = parseCsv("docs/product/feature-map.csv");
const routeMap = parseCsv("docs/product/feature-route-data-map.csv");
const featureIds = new Set(features.map((row) => row.feature_id));
const routeIds = new Set(routeMap.map((row) => row.feature_id));
const maturityLabels = new Set([
  "Production V1",
  "Validated Beta",
  "Foundation",
  "Post-60 Scale",
]);

if (features.length !== 88 || featureIds.size !== features.length) {
  failures.push("Day 01 feature inventory must contain 88 unique canonical records");
}
if (routeMap.length !== features.length || routeIds.size !== routeMap.length) {
  failures.push("Feature-route-data map must contain one unique row per feature");
}
for (const feature of features) {
  for (const field of ["feature_id", "family", "feature", "primary_role", "maturity", "launch_status", "data_sensitivity"]) {
    if (!feature[field]) failures.push(`Feature ${feature.feature_id || "(unknown)"} is missing ${field}`);
  }
  if (!maturityLabels.has(feature.maturity)) {
    failures.push(`Feature ${feature.feature_id} has invalid maturity ${feature.maturity}`);
  }
  if (!routeIds.has(feature.feature_id)) {
    failures.push(`Feature ${feature.feature_id} is missing from the route/data map`);
  }
}

const rootPackage = JSON.parse(read("package.json"));
const webPackage = JSON.parse(read("apps/web/package.json"));
for (const script of [
  "lint",
  "typecheck",
  "build",
  "check:design",
  "check:components",
  "check:public",
  "check:ia",
  "check:day07",
  "check:day08",
  "check:day09",
  "check:day10",
  "check:day01-10",
]) {
  if (!rootPackage.scripts?.[script]) failures.push(`Missing package script: ${script}`);
}
if (webPackage.scripts?.pretypecheck !== "next typegen") {
  failures.push("Web typecheck must generate Next.js route types first");
}
if (webPackage.type !== "module") {
  failures.push("Web workspace must declare ESM to keep Node source checks warning-free");
}

const environment = read(".env.example");
if (!environment.includes("ENDOORA_TIMEZONE=Asia/Tehran")) {
  failures.push("Asia/Tehran environment baseline is missing");
}
if (!environment.includes("ENDOORA_PUBLIC_URL=https://endoora.ir")) {
  failures.push("Canonical Endoora public URL is missing");
}

const rootLayout = read("apps/web/app/layout.tsx");
if (!rootLayout.includes("suppressHydrationWarning") || !rootLayout.includes("<ThemeToggle />")) {
  failures.push("Root hydration protection or global theme toggle is missing");
}
for (const shell of [
  "apps/web/components/auth/AuthShell.tsx",
  "apps/web/components/learner/LearnerShell.tsx",
  "apps/web/components/teacher/TeacherShell.tsx",
]) {
  const source = read(shell);
  if (!source.includes("document.documentElement") || !source.includes("root.lang") || !source.includes("root.dir")) {
    failures.push(`${shell} does not synchronize the document locale`);
  }
}

const workflow = read(".github/workflows/ci.yml");
for (const action of ["actions/checkout@v7", "actions/setup-node@v7", "actions/setup-python@v7"]) {
  if (!workflow.includes(action)) failures.push(`CI is missing ${action}`);
}
for (const command of [
  "npm run check:design",
  "npm run check:components",
  "npm run check:public",
  "npm run check:ia",
  "npm run check:day07",
  "npm run check:day08",
  "npm run check:day09",
  "npm run check:day10",
  "npm run check:day01-10",
  "python manage.py makemigrations --check --dry-run",
  "python scripts/scan_secrets.py",
]) {
  if (!workflow.includes(command)) failures.push(`CI is missing: ${command}`);
}

if (failures.length > 0) {
  console.error("Days 01-10 audit checks failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Days 01-10 audit checks passed: 88-feature scope integrity, reproducible type generation, current CI actions, bilingual document roots, global theme control, and every Day 01-10 static contract.",
);
