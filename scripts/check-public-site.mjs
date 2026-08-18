import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "apps/web/app/page.tsx",
  "apps/web/app/en/page.tsx",
  "apps/web/app/sitemap.ts",
  "apps/web/app/robots.ts",
  "apps/web/app/opengraph-image.tsx",
  "apps/web/app/api/waitlist/route.ts",
  "apps/web/components/marketing/PublicShell.tsx",
  "apps/web/components/marketing/DocumentLocaleSync.tsx",
  "apps/web/components/marketing/WaitlistForm.tsx",
  "apps/web/lib/public-site.ts",
  "apps/api/waitlist/models.py",
  "apps/api/waitlist/tests.py",
  "docs/operations/ENVIRONMENT_VARIABLES.md",
];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) {
    throw new Error(`Day 06 missing required file: ${relative}`);
  }
}

const layout = fs.readFileSync(path.join(root, "apps/web/app/layout.tsx"), "utf8");
if (!layout.includes('lang="fa"') || !layout.includes('dir="rtl"')) {
  throw new Error("Day 06 requires Persian-first fa/RTL root markup.");
}

const publicSite = fs.readFileSync(path.join(root, "apps/web/lib/public-site.ts"), "utf8");
for (const requiredText of [
  "Endoora",
  "A new door to your English",
  "https://endoora.ir",
  "learner-twin",
  "daily-mission",
  "mistake-genome",
  "writing-mentor",
  "roleplay-voice",
  "ielts-practice",
]) {
  if (!publicSite.includes(requiredText)) throw new Error(`Day 06 public content is missing: ${requiredText}`);
}

if (publicSite.includes("official IELTS score") || publicSite.includes("guaranteed CEFR")) {
  throw new Error("Unsupported official/guaranteed score claim detected.");
}

const robots = fs.readFileSync(path.join(root, "apps/web/app/robots.ts"), "utf8");
if (!robots.includes('"/legal/"') || !robots.includes('"/design-system/"')) {
  throw new Error("robots.ts must keep draft legal and developer routes out of indexing.");
}

console.log("Day 06 public-site static checks: PASS");
