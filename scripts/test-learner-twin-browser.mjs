import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { NeuroBayesianLearnerTwin } from "../apps/web/lib/ai/learner-twin-core.ts";
import { createTwinNodes } from "../apps/web/lib/ai/learner-twin-store.ts";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright"
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  serviceWorkers:'block',
});
const page = await context.newPage(),
  base = process.env.TWIN_TEST_URL ?? "http://127.0.0.1:3000";
const artifactDir = process.env.TWIN_ARTIFACT_DIR ?? "work/twin-browser";
await fs.mkdir(artifactDir, { recursive: true });
let userId = "twin-test-a",locale='en';
const measurements={};
const errors = [],
  external = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    external.push(r.url());
});
await context.route("**/api/dashboard/home/", (route) =>
  route.fulfill({
    json: {
      user_id: userId,
      greeting_name: "Test Learner",
      preferred_locale: locale,
      dashboard_state: "returning",
      primary_action: {
        id: "start_learning",
        href: "/today",
        title_en: "Study",
        title_fa: "تمرین",
      },
      today_mission: null,
      path_progress_percent: 0,
      path_steps: [],
      skills: [],
      srs_available: false,
      srs_due_count: 0,
      assignment: null,
      next_class: null,
      active_course: null,
      xp_available: true,
      xp: 0,
      streak_days: 0,
      notifications_available: false,
      notification_count: 0,
      limitations_en: [],
      limitations_fa: [],
    },
  }),
);
await context.route('**/api/auth/me/',route=>route.fulfill({status:401,json:{detail:'Test session uses a mocked learner-home response.'}}));
const key = (id) => `endoora_neuro_bayesian_learner_twin_v2:${id}`;
const currentKey = key(userId);
try {
  await page.goto(`${base}/twin`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page
    .getByRole("heading", { name: "A Twin that learns with you." })
    .waitFor();
  await page
    .getByRole("button", { name: "Future self", exact: true })
    .waitFor();
  assert.equal(await page.locator("svg [role=button]").count(), 60);
  assert.equal(
    await page.getByText("Awaiting evidence", { exact: true }).count(),
    4,
  );
  await page.locator("svg [role=button]").nth(42).focus();
  await page.keyboard.press("Enter");
  await page
    .getByText("Foundations to review (estimated, not confirmed deficits):", {
      exact: true,
    })
    .waitFor();
  await page.screenshot({
    path: path.join(artifactDir, "twin-overview.png"),
    fullPage: true,
  });

  await page.getByRole("button", { name: "Future self", exact: true }).click();
  await page
    .getByRole("heading", { name: "Time-travel simulator", exact: true })
    .waitFor();
  await page.getByText(/ms · Web Worker/).waitFor({ timeout: 30000 });
  measurements.worker30DaysMs=parseFloat(await page.getByText(/ms · Web Worker/).innerText());
  await page.getByRole("button", { name: "7 days", exact: true }).click();
  await page.getByRole("slider").fill("0");
  await page.waitForTimeout(500);
  await page.getByText(/ms · Web Worker/).waitFor({ timeout: 30000 });
  await page.getByText("Accessible forecast table", { exact: true }).click();
  const table = await page.locator("tbody tr").allTextContents();
  assert.ok(table.length >= 3);
  for (const row of await page.locator("tbody tr").all()) {
    const cells = await row.locator("td").allTextContents();
    assert.equal(cells[1], cells[3]);
  }
  await page.getByRole("slider").fill("45");
  await page.getByRole("button", { name: "90 days", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText(/ms · Web Worker/).waitFor({ timeout: 30000 });
  await page.screenshot({
    path: path.join(artifactDir, "twin-future.png"),
    fullPage: true,
  });

  await page
    .getByRole("button", { name: "Mock autoplay", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Simulate on my Twin", exact: true })
    .waitFor();
  await page.waitForFunction(
    () =>
      !Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent === "Simulate on my Twin",
      )?.disabled,
  );
  assert.equal(
    await page.getByRole("combobox").first().locator("option").count(),
    50,
  );
  await page
    .getByRole("button", { name: "Simulate on my Twin", exact: true })
    .click();
  assert.equal(await page.locator('[aria-label^="Question "]').count(), 40);
  assert.match(
    await page.locator("body").innerText(),
    /Q-matrix mappings: 20\/40/,
  );
  measurements.mock40QuestionsMs=parseFloat(await page.getByText('Local prediction time',{exact:true}).locator('..').locator('strong').innerText());
  await page
    .getByRole("button", { name: "Start five-minute warm-up", exact: true })
    .click();
  const warmup = page.getByLabel("Warm-up exercises", { exact: true });
  await warmup.getByRole("button").first().waitFor();
  await warmup.getByRole("button").first().click();
  await page.getByText("1 observations", { exact: true }).waitFor();
  await page.getByRole("combobox").first().selectOption({ index: 49 });
  await page.waitForFunction(
    () =>
      !Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent === "Simulate on my Twin",
      )?.disabled,
  );
  await page
    .getByRole("button", { name: "Simulate on my Twin", exact: true })
    .click();
  assert.equal(await page.locator('[aria-label^="Question "]').count(), 40);
  await page.screenshot({
    path: path.join(artifactDir, "twin-mock.png"),
    fullPage: true,
  });
  const beforeDemo = await page.evaluate(
    (k) => localStorage.getItem(k),
    currentKey,
  );

  await page
    .getByRole("button", { name: "Inside the model", exact: true })
    .click();
  for (const name of [
    "Lucky guess shielding",
    "Deep consolidation",
    "Causal prerequisite review",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    for (let i = 0; i < 3; i++)
      await page
        .getByRole("button", { name: "Next stage", exact: true })
        .click();
    await page.getByText(/Band .* · 95%/).waitFor({ timeout: 30000 });
  }
  assert.equal(
    await page.evaluate((k) => localStorage.getItem(k), currentKey),
    beforeDemo,
    "demo simulations do not persist real evidence",
  );

  const model = new NeuroBayesianLearnerTwin(createTwinNodes(), {
    storage: null,
  });
  model.assimilateMultiModalObservation({
    skillIds: [0],
    observedScore: 1,
    modality: "hex_grammar",
    guessingFloor: 0.25,
    latencyMs: 5000,
    expectedLatencyMs: 5000,
    gazeDistractionIndex: 0,
    cognitiveLoadIndex: 0.2,
  });
  await page.evaluate(
    ({ k, s }) => localStorage.setItem(k, JSON.stringify(s)),
    { k: currentKey, s: model.getSnapshot() },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("1 observations", { exact: true }).waitFor();
  userId = "twin-test-b";
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("0 observations", { exact: true }).waitFor();
  userId = "twin-test-a";
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("1 observations", { exact: true }).waitFor();
  await page
    .getByRole("button", { name: "Evidence & controls", exact: true })
    .click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export JSON snapshot", exact: true })
    .click();
  const saved = await download;
  await saved.saveAs(path.join(artifactDir, "test-export.json"));
  const exported = JSON.parse(
    await fs.readFile(path.join(artifactDir, "test-export.json"), "utf8"),
  );
  assert.equal(exported.calibration.totalInteractions, 1);
  await page
    .getByRole("button", { name: "Reset local model", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Clear local model", exact: true })
    .click();
  await page.getByText("0 observations", { exact: true }).waitFor();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("0 observations", { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(artifactDir, "twin-mobile.png"),
    fullPage: true,
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "mobile page should not overflow",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(
    external,
    [],
    "Twin must not download external model weights",
  );
  const timings = await page.evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    return {
      domContentLoadedMs: n.domContentLoadedEventEnd,
      loadMs: n.loadEventEnd,
    };
  });
  locale='fa';await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'آینده من',exact:true}).waitFor();
  assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
  await page.screenshot({path:path.join(artifactDir,'twin-persian.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.addInitScript(()=>{window.Worker=undefined;});
  locale='en';await page.reload({waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:'Future self',exact:true}).click();
  await page.getByText('Web Workers are unavailable. Future simulation requires a supported browser.',{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  await fs.writeFile(
    path.join(artifactDir, "browser-results.json"),
    JSON.stringify(
      {
        passed: true,
        checks: [
          "60-node keyboard graph",
          "real worker forecasts",
          "zero-minute paired scenario",
          "rapid slider requests",
          "50 mocks / 40 questions",
          "isolated pipeline scenarios",
          "account separation",
          "JSON export",
          "reset survives reload",
          "mobile overflow",
          "no external weights",
          "no page errors",
          'targeted warm-up records a real answer',
          'Persian RTL layout',
          'unsupported workers show a recoverable error',
        ],
        timings,
        measurements,
      },
      null,
      2,
    ),
  );
  console.log("Learner Twin browser flows passed.", timings);
} catch(error) {
  await page.screenshot({path:path.join(artifactDir,'failure.png'),fullPage:true});
  console.error((await page.locator('body').innerText()).slice(-6000));throw error;
} finally {
  await browser.close();
}
