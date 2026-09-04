import fs from "node:fs";
import path from "node:path";

import {
  featureKeys,
  featurePages,
  legalKeys,
  legalPages,
  publicPageKeys,
  publicPages,
} from "../apps/web/lib/public-site.ts";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const required = [
  "apps/web/app/(public)/page.tsx",
  "apps/web/app/en/page.tsx",
  "apps/web/app/sitemap.ts",
  "apps/web/app/robots.ts",
  "apps/web/app/opengraph-image.tsx",
  "apps/web/app/api/waitlist/route.ts",
  "apps/web/components/marketing/PublicShell.tsx",
  "apps/web/components/marketing/AccountEntryLink.tsx",
  "apps/web/components/marketing/DocumentLocaleSync.tsx",
  "apps/web/components/marketing/HomePage.tsx",
  "apps/web/components/marketing/PublicFaq.tsx",
  "apps/web/components/marketing/AnalyticsConsent.tsx",
  "apps/web/components/marketing/WaitlistForm.tsx",
  "apps/web/components/marketing/marketing.module.css",
  "apps/web/components/marketing/public-shell.module.css",
  "apps/web/lib/public-site.ts",
  "apps/api/waitlist/models.py",
  "apps/api/waitlist/tests.py",
  "docs/operations/ENVIRONMENT_VARIABLES.md",
  "docs/uiux/day06-public-site/README.md",
];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) {
    throw new Error(`Day 06 missing required file: ${relative}`);
  }
}

const layout = read("apps/web/app/layout.tsx");
if (!layout.includes('lang="fa"') || !layout.includes('dir="rtl"')) {
  throw new Error("Day 06 requires Persian-first fa/RTL root markup.");
}

const faHomeRoute = read("apps/web/app/(public)/page.tsx");
const enHomeRoute = read("apps/web/app/en/page.tsx");
if (!faHomeRoute.includes('<PublicShell locale="fa"') || !enHomeRoute.includes('<PublicShell locale="en"')) {
  throw new Error("Persian and English homepages must use the localized public shell.");
}

const home = read("apps/web/components/marketing/HomePage.tsx");
for (const requiredText of [
  'localizedPath(locale, "/placement")',
  'accountPath(locale, "/auth/register")',
  '<section id="how"',
  '<section id="features"',
  '<section id="faq"',
  '<section id="waitlist"',
  "PublicFaq",
  "application/ld+json",
  "Mistake Genome",
  "Daily Mission",
  "IELTS",
]) {
  if (!home.includes(requiredText)) {
    throw new Error(`Day 06 homepage contract is missing: ${requiredText}`);
  }
}

if (home.includes("styles.kicker") || home.includes("A new door to your English</span>")) {
  throw new Error("The homepage hero must not contain a decorative kicker or tagline above the H1.");
}

const faq = read("apps/web/components/marketing/PublicFaq.tsx");
const questionCount = (faq.match(/question:/g) ?? []).length;
if (questionCount !== 10 || !faq.includes("<details") || !faq.includes("<summary")) {
  throw new Error("The bilingual FAQ must contain five accessible question/answer pairs.");
}

const consent = read("apps/web/components/marketing/AnalyticsConsent.tsx");
if (!consent.includes("useSyncExternalStore") || !consent.includes("localStorage") || !consent.includes("loads no third-party analytics scripts")) {
  throw new Error("Analytics consent must be hydration-safe, local-only, and honest about Day 06 tooling.");
}
const publicShell = read("apps/web/components/marketing/PublicShell.tsx");
if (!publicShell.includes("<AnalyticsConsent locale={locale}")) {
  throw new Error("Analytics consent must be mounted in the shared public shell for every public entry route.");
}
if (!publicShell.includes("<AccountEntryLink") || publicShell.includes('href={accountPath(locale, "/auth/login")}')) {
  throw new Error("The public shell must use the session-aware account entry instead of a static login link.");
}
const accountEntry = read("apps/web/components/marketing/AccountEntryLink.tsx");
for (const requiredText of ["/auth/me/", '"پنل کاربری"', '"User panel"', '"/dashboard"', '"/teacher"']) {
  if (!accountEntry.includes(requiredText)) {
    throw new Error(`Session-aware account entry contract is missing: ${requiredText}`);
  }
}

const waitlist = read("apps/web/components/marketing/WaitlistForm.tsx");
for (const requiredText of ["useId", 'type="email"', 'type="checkbox"', "aria-busy", 'aria-live="polite"']) {
  if (!waitlist.includes(requiredText)) throw new Error(`Waitlist accessibility contract is missing: ${requiredText}`);
}

const copySets = [
  ...publicPageKeys.flatMap((key) => [
    { route: `/${key}`, locale: "fa", copy: publicPages[key].fa },
    { route: `/en/${key}`, locale: "en", copy: publicPages[key].en },
  ]),
  ...featureKeys.flatMap((key) => [
    { route: `/features/${key}`, locale: "fa", copy: featurePages[key].fa },
    { route: `/en/features/${key}`, locale: "en", copy: featurePages[key].en },
  ]),
  ...legalKeys.flatMap((key) => [
    { route: `/legal/${key}`, locale: "fa", copy: legalPages[key].fa },
    { route: `/en/legal/${key}`, locale: "en", copy: legalPages[key].en },
  ]),
];

const seenTitles = new Map();
for (const item of copySets) {
  const normalized = item.copy.title.trim().toLocaleLowerCase(item.locale === "fa" ? "fa" : "en");
  if (!normalized || !item.copy.summary.trim()) throw new Error(`Missing metadata copy for ${item.route}`);
  if (seenTitles.has(normalized)) {
    throw new Error(`Duplicate public metadata title for ${seenTitles.get(normalized)} and ${item.route}: ${item.copy.title}`);
  }
  seenTitles.set(normalized, item.route);
}

for (const key of legalKeys) {
  if (!legalPages[key].fa.eyebrow.includes("پیش‌نویس") || !legalPages[key].en.eyebrow.includes("Draft")) {
    throw new Error(`Legal placeholder ${key} must remain visibly marked as a draft.`);
  }
}

const robots = read("apps/web/app/robots.ts");
if (!robots.includes('"/legal/"') || !robots.includes('"/design-system/"')) {
  throw new Error("robots.ts must keep draft legal and developer routes out of indexing.");
}

const marketingDirectory = path.join(root, "apps/web/components/marketing");
const componentFiles = fs.readdirSync(marketingDirectory).filter((name) => name.endsWith(".tsx"));
const usedClasses = new Set();
for (const name of componentFiles) {
  for (const match of read(`apps/web/components/marketing/${name}`).matchAll(/styles\.([A-Za-z0-9_]+)/g)) {
    usedClasses.add(match[1]);
  }
}

const css = `${read("apps/web/components/marketing/marketing.module.css")}\n${read("apps/web/components/marketing/public-shell.module.css")}`;
const definedClasses = new Set([...css.matchAll(/^\.([A-Za-z][A-Za-z0-9_-]*)/gm)].map((match) => match[1]));
const missingClasses = [...usedClasses].filter((name) => !definedClasses.has(name));
if (missingClasses.length) {
  throw new Error(`Marketing components reference undefined CSS modules: ${missingClasses.join(", ")}`);
}

const marketingCopy = copySets.map((item) => `${item.copy.title} ${item.copy.summary} ${item.copy.sections.map((section) => `${section.title} ${section.body}`).join(" ")}`).join(" ");
for (const unsupportedClaim of ["guarantee your score", "guaranteed band", "official ai score", "success rate", "students served", "trusted by thousands"]) {
  if (marketingCopy.toLowerCase().includes(unsupportedClaim)) {
    throw new Error(`Unsupported marketing claim detected: ${unsupportedClaim}`);
  }
}

console.log(`Day 06 public-site static checks: PASS (${copySets.length + 2} localized routes, ${usedClasses.size} styled component classes)`);
