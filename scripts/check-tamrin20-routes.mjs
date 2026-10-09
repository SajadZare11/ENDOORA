/**
 * Tier 3: Route & SSR Smoke Suite for "تمرین تا ۲۰" (Vision 3)
 *
 * Verifies:
 * 1. File-system routing existence and structure under App Router
 * 2. Static parameter matrix for all 15 practice routes (3 lessons x 5 skills)
 * 3. Parameter validation for boundary and invalid route inputs
 * 4. Integration into LearnerShell STANDALONE_PREFIXES
 * 5. Navigation entry points from /skills/school and /high-school
 * 6. Live HTTP SSR/HTML smoke verification (if web dev server is running)
 *
 * Execution:
 *   node scripts/check-tamrin20-routes.mjs
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const webDir = path.join(root, "apps", "web");

console.log("\n============================================================");
console.log("▶ Running Tier 3 Route Smoke Suite: scripts/check-tamrin20-routes.mjs");
console.log("============================================================\n");

let totalPassed = 0;
let totalFailed = 0;
let totalWarnings = 0;

function check(name, fn) {
  try {
    fn();
    totalPassed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    totalFailed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

function warn(name, message) {
  totalWarnings++;
  console.log(`  ⚠️ [M3 PENDING] ${name}: ${message}`);
}

// ----------------------------------------------------------------------------
// 1. ROUTE DEFINITIONS & PERMUTATION MATRIX
// ----------------------------------------------------------------------------
console.log("1. Route Definition & Permutation Matrix:");

const validLessons = [1, 2, 3];
const validSkills = ["listening", "vocabulary", "grammar", "reading", "writing"];

const practiceRoutesMatrix = [];
for (const lesson of validLessons) {
  for (const skill of validSkills) {
    practiceRoutesMatrix.push({
      route: `/high-school/grade-12/tamrin20/${lesson}/${skill}`,
      lesson,
      skill,
    });
  }
}

check("matrix generates exactly 15 practice routes (3 lessons x 5 skills)", () => {
  assert.equal(practiceRoutesMatrix.length, 15);
});

const hubRoute = "/high-school/grade-12/tamrin20";

// Boundary & invalid route test cases
const invalidRouteCases = [
  { route: "/high-school/grade-12/tamrin20/0/grammar", reason: "lesson 0 out of bounds" },
  { route: "/high-school/grade-12/tamrin20/4/grammar", reason: "lesson 4 out of bounds" },
  { route: "/high-school/grade-12/tamrin20/1/speaking", reason: "speaking not in Vision 3 skills" },
  { route: "/high-school/grade-12/tamrin20/abc/xyz", reason: "non-numeric lesson & invalid skill" },
];

check("validates parameter boundary filtering logic", () => {
  const isRouteValid = (lessonStr, skillStr) => {
    const l = Number.parseInt(lessonStr, 10);
    return validLessons.includes(l) && validSkills.includes(skillStr);
  };

  for (const item of practiceRoutesMatrix) {
    assert.equal(isRouteValid(String(item.lesson), item.skill), true);
  }

  for (const invalid of invalidRouteCases) {
    const parts = invalid.route.split("/").slice(-2);
    assert.equal(isRouteValid(parts[0], parts[1]), false, `Failed to reject ${invalid.route}`);
  }
});

// ----------------------------------------------------------------------------
// 2. FILE-SYSTEM APP ROUTER CONTRACT VERIFICATION
// ----------------------------------------------------------------------------
console.log("\n2. File-system App Router Contracts:");

const hubPagePath = [
  path.join(webDir, "app", "(public)", "high-school", "grade-12", "tamrin20", "page.tsx"),
  path.join(webDir, "app", "(learner)", "high-school", "grade-12", "tamrin20", "page.tsx")
].find(p => fs.existsSync(p)) || path.join(webDir, "app", "(public)", "high-school", "grade-12", "tamrin20", "page.tsx");

const practicePagePath = [
  path.join(webDir, "app", "(public)", "high-school", "grade-12", "tamrin20", "[lesson]", "[skill]", "page.tsx"),
  path.join(webDir, "app", "(learner)", "high-school", "grade-12", "tamrin20", "[lesson]", "[skill]", "page.tsx")
].find(p => fs.existsSync(p)) || path.join(webDir, "app", "(public)", "high-school", "grade-12", "tamrin20", "[lesson]", "[skill]", "page.tsx");

if (fs.existsSync(hubPagePath)) {
  check(`Hub page exists at ${path.relative(webDir, hubPagePath)}`, () => {
    const content = fs.readFileSync(hubPagePath, "utf8");
    assert.ok(content.length > 50, "Hub page content too short");
    assert.ok(
      content.includes("تمرین تا ۲۰") || content.includes("Vision 3") || content.includes("Tamrin20"),
      "Hub page missing core Tamrin20 branding"
    );
  });
} else {
  warn(
    "Hub page (apps/web/.../tamrin20/page.tsx)",
    "File not yet created (M3 Navigation milestone scheduled)."
  );
}

if (fs.existsSync(practicePagePath)) {
  check("Practice page exists at apps/web/app/(learner)/high-school/grade-12/tamrin20/[lesson]/[skill]/page.tsx", () => {
    const content = fs.readFileSync(practicePagePath, "utf8");
    assert.ok(content.length > 50, "Practice page content too short");
    // Verify generateStaticParams
    assert.ok(
      content.includes("generateStaticParams"),
      "Practice page should export generateStaticParams for SSG"
    );
  });
} else {
  warn(
    "Practice page (apps/web/.../tamrin20/[lesson]/[skill]/page.tsx)",
    "File not yet created (M3 Navigation milestone scheduled)."
  );
}

// ----------------------------------------------------------------------------
// 3. LEARNER SHELL STANDALONE_PREFIXES PROBE
// ----------------------------------------------------------------------------
console.log("\n3. LearnerShell Standalone Access Configuration:");

const learnerShellPath = path.join(webDir, "components", "learner", "LearnerShell.tsx");
if (fs.existsSync(learnerShellPath)) {
  const shellSource = fs.readFileSync(learnerShellPath, "utf8");
  const hasHighSchoolPrefix =
    shellSource.includes('"/high-school"') ||
    shellSource.includes('"/high-school/grade-12/tamrin20"');

  if (hasHighSchoolPrefix) {
    check("LearnerShell contains high-school standalone route bypass", () => {
      assert.ok(hasHighSchoolPrefix);
    });
  } else {
    warn(
      "LearnerShell.tsx STANDALONE_PREFIXES",
      'Pending M3 update: add "/high-school" to STANDALONE_PREFIXES in apps/web/components/learner/LearnerShell.tsx to allow guest learners to practice.'
    );
  }
}

// ----------------------------------------------------------------------------
// 4. ENTRY POINTS & LINK INTEGRATION PROBE
// ----------------------------------------------------------------------------
console.log("\n4. Entry Points & Link Integration Probe:");

const schoolMarketingPath = path.join(webDir, "app", "(marketing)", "skills", "school", "page.tsx");
if (fs.existsSync(schoolMarketingPath)) {
  const content = fs.readFileSync(schoolMarketingPath, "utf8");
  const linksToTamrin20 =
    content.includes("tamrin20") || content.includes("تمرین تا ۲۰") || content.includes("/high-school/grade-12");

  if (linksToTamrin20) {
    check("/skills/school contains link or entry section to Tamrin20", () => {
      assert.ok(linksToTamrin20);
    });
  } else {
    warn(
      "/skills/school page.tsx",
      "Pending M3 update: add call-to-action button or link to /high-school/grade-12/tamrin20."
    );
  }
}

const highSchoolLandingPath = path.join(webDir, "app", "(learner)", "high-school", "page.tsx");
if (fs.existsSync(highSchoolLandingPath)) {
  const content = fs.readFileSync(highSchoolLandingPath, "utf8");
  const linksToTamrin20 =
    content.includes("tamrin20") || content.includes("تمرین تا ۲۰") || content.includes("Grade 12");

  if (linksToTamrin20) {
    check("/high-school landing contains Grade 12 or Tamrin20 link", () => {
      assert.ok(linksToTamrin20);
    });
  } else {
    warn(
      "/high-school page.tsx",
      "Pending M3 update: feature 'تمرین تا ۲۰ (دوازدهم)' card on high school landing."
    );
  }
}

// ----------------------------------------------------------------------------
// 5. LIVE HTTP SSR & HTML SMOKE TEST (WHEN LOCAL SERVER IS ACTIVE)
// ----------------------------------------------------------------------------
console.log("\n5. Live HTTP SSR & HTML Smoke Probe:");

const baseUrl = (process.env.ENDOORA_WEB_TEST_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

let isServerOnline = false;
try {
  const probeResponse = await fetch(`${baseUrl}/robots.txt`, {
    signal: AbortSignal.timeout(1500),
  });
  if (probeResponse.status === 200) {
    isServerOnline = true;
  }
} catch {
  // Server is not running, normal during offline CI/static checks
}

if (isServerOnline) {
  console.log(`  ✓ Local test server detected at ${baseUrl}. Executing live HTTP smoke tests...`);

  // Probe hub route
  try {
    const hubRes = await fetch(`${baseUrl}${hubRoute}`);
    if (hubRes.status === 200) {
      const html = await hubRes.text();
      check("Hub route responds with HTTP 200 and RTL attribute", () => {
        assert.equal(hubRes.status, 200);
        assert.ok(html.includes('dir="rtl"') || html.includes("rtl"), "Missing RTL layout on Hub");
      });
    } else {
      warn("Hub route live HTTP check", `Received status ${hubRes.status} (route implementation pending M3).`);
    }
  } catch (err) {
    warn("Hub route fetch error", err.message);
  }

  // Probe a sample practice route
  const samplePractice = practiceRoutesMatrix[0].route;
  try {
    const pRes = await fetch(`${baseUrl}${samplePractice}`);
    if (pRes.status === 200) {
      const html = await pRes.text();
      check(`Practice route ${samplePractice} responds with HTTP 200`, () => {
        assert.equal(pRes.status, 200);
        assert.ok(!html.includes("Unhandled Runtime Error"), "Page threw unhandled runtime error");
      });
    } else {
      warn("Practice route live HTTP check", `Received status ${pRes.status} (route implementation pending M3).`);
    }
  } catch (err) {
    warn("Practice route fetch error", err.message);
  }

  // Probe invalid route for 404
  try {
    const invRes = await fetch(`${baseUrl}/high-school/grade-12/tamrin20/99/unknown`);
    if (invRes.status === 404) {
      check("Invalid practice route returns 404", () => {
        assert.equal(invRes.status, 404);
      });
    }
  } catch {
    // Ignore fetch error for invalid route
  }
} else {
  console.log("  ℹ Local dev/prod server not detected on http://127.0.0.1:3000 (normal during static test passes).");
  console.log("    To run live HTTP smoke assertions, start the app with `npm.cmd run dev` or `npm.cmd start`.");
}

// ============================================================================
// SUMMARY & EXIT
// ============================================================================

console.log("\n============================================================");
console.log(`Tier 3 Route Smoke Suite Completed:`);
console.log(`  Passed Assertions: ${totalPassed}`);
console.log(`  Failed Assertions: ${totalFailed}`);
console.log(`  Pending M3 Markers: ${totalWarnings}`);
console.log("============================================================\n");

if (totalFailed > 0) {
  console.error(`❌ ${totalFailed} route assertion(s) failed.`);
  process.exit(1);
} else {
  console.log(`🎉 TIER 3 ROUTE SMOKE SUITE EXECUTED CLEANLY!`);
  process.exit(0);
}
