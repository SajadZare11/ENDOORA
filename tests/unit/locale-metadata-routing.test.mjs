import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  localizedPath,
  alternatePath,
  buildMetadata,
  PUBLIC_BASE_URL,
} from "../../apps/web/lib/public-site.ts";

console.log("Running Locale Preservation & Public Route Metadata Tests (F26)...");

// Test 1: localizedPath bidirectional resolution
{
  assert.equal(localizedPath("fa", "/"), "/");
  assert.equal(localizedPath("en", "/"), "/en");
  assert.equal(localizedPath("fa", "/en"), "/");
  assert.equal(localizedPath("en", "/en"), "/en");

  assert.equal(localizedPath("fa", "/skills"), "/skills");
  assert.equal(localizedPath("en", "/skills"), "/en/skills");
  assert.equal(localizedPath("fa", "/en/skills"), "/skills");
  assert.equal(localizedPath("en", "/en/skills"), "/en/skills");

  assert.equal(localizedPath("fa", "/features/placement"), "/features/placement");
  assert.equal(localizedPath("en", "/features/placement"), "/en/features/placement");
  assert.equal(localizedPath("fa", "/en/features/placement"), "/features/placement");
  assert.equal(localizedPath("en", "/en/features/placement"), "/en/features/placement");
  console.log("✓ localizedPath correctly resolves and prevents double /en/en prefixes");
}

// Test 2: alternatePath preserves current route across language switches
{
  assert.equal(alternatePath("fa", "/"), "/en");
  assert.equal(alternatePath("en", "/en"), "/");

  assert.equal(alternatePath("fa", "/skills"), "/en/skills");
  assert.equal(alternatePath("en", "/en/skills"), "/skills");

  assert.equal(alternatePath("fa", "/features/srs"), "/en/features/srs");
  assert.equal(alternatePath("en", "/en/features/srs"), "/features/srs");

  assert.equal(alternatePath("fa", "/teachers"), "/en/teachers");
  assert.equal(alternatePath("en", "/en/teachers"), "/teachers");
  console.log("✓ alternatePath preserves current page during locale transitions");
}

// Test 3: buildMetadata canonical, alternates and OpenGraph tags
{
  const metaFa = buildMetadata("fa", "/skills", "آرکید مهارت‌ها", "توضیحات");
  assert.equal(metaFa.alternates?.canonical, `${PUBLIC_BASE_URL}/skills`);
  assert.equal(metaFa.alternates?.languages?.["fa-IR"], `${PUBLIC_BASE_URL}/skills`);
  assert.equal(metaFa.alternates?.languages?.["en"], `${PUBLIC_BASE_URL}/en/skills`);
  assert.equal(metaFa.alternates?.languages?.["x-default"], `${PUBLIC_BASE_URL}/skills`);
  assert.equal(metaFa.openGraph?.locale, "fa_IR");
  assert.deepEqual(metaFa.openGraph?.alternateLocale, ["en_US"]);

  const metaEn = buildMetadata("en", "/en/skills", "Skills Arcade", "Description");
  assert.equal(metaEn.alternates?.canonical, `${PUBLIC_BASE_URL}/en/skills`);
  assert.equal(metaEn.alternates?.languages?.["fa-IR"], `${PUBLIC_BASE_URL}/skills`);
  assert.equal(metaEn.alternates?.languages?.["en"], `${PUBLIC_BASE_URL}/en/skills`);
  assert.equal(metaEn.openGraph?.locale, "en_US");
  assert.deepEqual(metaEn.openGraph?.alternateLocale, ["fa_IR"]);
  console.log("✓ buildMetadata generates valid canonical, OpenGraph, and language alternate tags");
}

// Test 4: /en/skills page route restored
{
  const enSkillsPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "app",
    "en",
    "skills",
    "page.tsx"
  );
  assert.ok(fs.existsSync(enSkillsPath), "apps/web/app/en/skills/page.tsx must exist");
  const content = fs.readFileSync(enSkillsPath, "utf-8");
  assert.ok(content.includes('locale="en"'), "English skills page must use locale=en");
  assert.ok(content.includes('currentPath="/en/skills"'), "Must specify currentPath=/en/skills");
  console.log("✓ /en/skills route is fully restored and configured with proper locale metadata");
}

console.log("ALL Locale Preservation & Metadata tests PASSED!");
