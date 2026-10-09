// scripts/smoke-test-skills-live.mjs
// Verifies live HTTP responses and DOM content for /skills and all 6 skill pages

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  { path: "/skills", expectedKeyword: "مهارت‌های شش‌گانه" },
  { path: "/skills/listening", expectedKeyword: "شنیداری" },
  { path: "/skills/speaking", expectedKeyword: "مکالمه" },
  { path: "/skills/reading", expectedKeyword: "خواندن" },
  { path: "/skills/writing", expectedKeyword: "نگارش" },
  { path: "/skills/vocabulary", expectedKeyword: "واژگان" },
  { path: "/skills/grammar", expectedKeyword: "دستور زبان" },
];

async function runSmokeTests() {
  console.log(`Starting Live Smoke Test against: ${BASE_URL}\n`);
  let passed = 0;
  let failed = 0;

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const res = await fetch(url, { headers: { "Accept-Language": "fa,en;q=0.9" } });
      const text = await res.text();

      if (res.status === 200) {
        let keywordMatch = true;
        if (route.expectedTitle && !text.includes(route.expectedTitle)) {
          console.warn(`  ⚠️ Warning: Page ${route.path} did not include expected title: ${route.expectedTitle}`);
          keywordMatch = false;
        }
        if (route.expectedKeyword && !text.includes(route.expectedKeyword)) {
          console.warn(`  ⚠️ Warning: Page ${route.path} did not include expected keyword: ${route.expectedKeyword}`);
          keywordMatch = false;
        }

        if (keywordMatch) {
          console.log(`  ✔ [200 OK] ${route.path} rendered successfully (${text.length} bytes)`);
          passed++;
        } else {
          console.error(`  ❌ [200 Partial] ${route.path} returned 200 but missed keywords`);
          failed++;
        }
      } else {
        console.error(`  ❌ [HTTP ${res.status}] ${route.path}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ [Error fetching ${url}]: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`Smoke Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests();
