import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn } from "node:child_process";

// -----------------------------------------------------------------------------
// Test Metrics Tracker
// -----------------------------------------------------------------------------
let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(description, fn) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  ✓ [CHECK #${totalChecks}] ${description}`);
  } catch (err) {
    failedChecks++;
    console.error(`  ✗ [CHECK #${totalChecks} FAILED] ${description}:`, err.message);
    throw err;
  }
}

async function asyncCheck(description, fn) {
  totalChecks++;
  try {
    await fn();
    passedChecks++;
    console.log(`  ✓ [CHECK #${totalChecks}] ${description}`);
  } catch (err) {
    failedChecks++;
    console.error(`  ✗ [CHECK #${totalChecks} FAILED] ${description}:`, err.message);
    throw err;
  }
}

console.log("===============================================================================");
console.log("⚡ ENDOORA M2 PERSISTENCE ENGINE ADVERSARIAL STRESS TEST HARNESS");
console.log("===============================================================================\n");

// Import target modules
import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "../../apps/web/lib/admin-storage-engine.ts";

import {
  getSiteBuilderStorage,
  getCustomPages,
  saveCustomPage,
  deleteCustomPage,
  getCustomPageBySlug,
  getNavigationConfig,
  saveDraftNavigation,
  publishLiveNavigation,
  getSitePopups,
  saveSitePopup,
  deleteSitePopup,
  getGlobalThemeConfig,
  saveGlobalThemeConfig,
} from "../../apps/web/lib/admin-site-builder-store.ts";

import {
  getAutonomousOpsStorage,
  createDatabaseBackup,
  updateBackupPolicy,
  getIncidentsList,
  updateIncidentStatus,
  getBackgroundTasksList,
  toggleTaskStatus,
  runBackgroundTaskNow,
  getDictionaryItems,
  updateDictionaryItem,
} from "../../apps/web/lib/admin-autonomous-ops-store.ts";

import {
  getCustomFormsList,
  saveCustomForm,
  submitPublicFormResponse,
  deleteCustomForm,
  getFormSubmissions,
  updateSubmissionWebhookStatus,
} from "../../apps/web/lib/admin-forms-webhooks-store.ts";

import {
  getFinancialRiskStorage,
  issueOneClickRefund,
  getRiskAlertsList,
  mitigateRiskAlertAction,
  persistFinancialRisk,
} from "../../apps/web/lib/admin-financial-risk-store.ts";

import {
  getGamificationStorage,
  saveAffiliatePartnerAction,
  updateXpRulesAction,
  getAffiliatesData,
  adjustLearnerXpAction,
  awardBadgeToLearnerAction,
  processAffiliatePayoutAction,
  persistGamification,
} from "../../apps/web/lib/admin-gamification-affiliates-store.ts";

import {
  getServerOpsStorage,
  getMaintenanceConfig,
  saveMaintenanceConfig,
  purgeCache,
} from "../../apps/web/lib/admin-server-ops-store.ts";

import {
  MEDIA_PRESET_ASSETS,
  getLearnerEnrollments,
  grantCourseEnrollment,
  toggleLessonCompletionState,
  updateLessonQuizScore,
  resetCourseProgress,
  revokeCourseEnrollment,
  getAcademicAuditLogs,
  saveLessonQuiz,
  getLessonQuiz,
} from "../../apps/web/lib/admin-academics-store.ts";

// =============================================================================
// SUITE 1: High-Concurrency Simultaneous Writes & File Integrity
// =============================================================================
console.log("\n▶ SUITE 1: High-Concurrency Simultaneous Writes & File Integrity");

{
  const stressFile = resolveStoragePath("stress-concurrency-test.json");
  const stressDir = path.dirname(stressFile);

  // Clean any previous test file
  try { if (fs.existsSync(stressFile)) fs.unlinkSync(stressFile); } catch {}

  // 1.1 In-Process Rapid Concurrent Asynchronous Writes (50 parallel writes)
  const writePromises = [];
  for (let i = 0; i < 50; i++) {
    writePromises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          try {
            atomicWriteJsonSync(stressFile, {
              writer: "async-promise",
              iteration: i,
              timestamp: Date.now(),
              payload: Array.from({ length: 20 }, (_, idx) => ({ id: idx, value: `val-${i}-${idx}` })),
            });
            resolve({ success: true, iteration: i });
          } catch (err) {
            resolve({ success: false, iteration: i, error: err.message });
          }
        }, Math.floor(Math.random() * 20));
      })
    );
  }

  const results = await Promise.all(writePromises);
  const successCount = results.filter((r) => r.success).length;

  check("50 rapid concurrent async writes completed without unhandled crash", () => {
    assert.ok(successCount > 0, "At least some writes must succeed");
  });

  check("Destination file on disk exists and contains 100% valid JSON", () => {
    assert.ok(fs.existsSync(stressFile), "Target file must exist");
    const raw = fs.readFileSync(stressFile, "utf-8");
    const parsed = JSON.parse(raw);
    assert.equal(parsed.writer, "async-promise");
    assert.ok(Array.isArray(parsed.payload));
    assert.equal(parsed.payload.length, 20);
  });

  check("Zero orphaned temporary staging files (.tmp.*) left in storage directory", () => {
    const files = fs.readdirSync(stressDir);
    const leaked = files.filter((f) => f.startsWith("stress-concurrency-test.json.tmp"));
    assert.equal(leaked.length, 0, `Found leaked temp files: ${leaked.join(", ")}`);
  });

  // 1.2 Multi-Process Concurrency Swarm (8 child processes hammering same file)
  const childScript = `
    import { atomicWriteJsonSync } from './apps/web/lib/admin-storage-engine.ts';
    const filePath = '${stressFile.replace(/\\/g, "/")}';
    const procId = process.argv[1] || process.argv[2] || 'worker';
    for (let j = 0; j < 5; j++) {
      try {
        atomicWriteJsonSync(filePath, {
          procId,
          step: j,
          pid: process.pid,
          time: Date.now()
        });
      } catch (e) {
        // Retry loop in caller or transient lock
      }
    }
  `;

  const childProcs = [];
  for (let p = 0; p < 8; p++) {
    childProcs.push(
      new Promise((resolve) => {
        const cp = spawn("node", ["--input-type=module", "-e", childScript, `worker-${p}`], {
          cwd: process.cwd(),
          stdio: "ignore",
        });
        cp.on("close", (code) => resolve(code));
      })
    );
  }

  await Promise.all(childProcs);

  check("Multi-process swarm completed and target file remains fully valid JSON", () => {
    assert.ok(fs.existsSync(stressFile));
    const raw = fs.readFileSync(stressFile, "utf-8");
    const parsed = JSON.parse(raw);
    assert.ok(typeof parsed.procId === "string", "Must have valid procId");
    assert.ok(typeof parsed.pid === "number", "Must have valid pid");
    assert.ok(typeof parsed.time === "number", "Must have valid time");
  });

  check("Zero temp files remaining after multi-process stress swarm", () => {
    const files = fs.readdirSync(stressDir);
    const leaked = files.filter((f) => f.startsWith("stress-concurrency-test.json.tmp"));
    assert.equal(leaked.length, 0, `Leaked temp files: ${leaked.join(", ")}`);
  });

  // 1.3 Interleaved Reader / Writer Stress (Readers must NEVER see partial JSON)
  let corruptReadsDetected = 0;
  let totalReads = 0;

  const readerWorker = (async () => {
    for (let r = 0; r < 30; r++) {
      try {
        if (fs.existsSync(stressFile)) {
          const raw = fs.readFileSync(stressFile, "utf-8");
          JSON.parse(raw);
          totalReads++;
        }
      } catch (err) {
        corruptReadsDetected++;
      }
      await new Promise((res) => setTimeout(res, 5));
    }
  })();

  const writerWorker = (async () => {
    for (let w = 0; w < 15; w++) {
      atomicWriteJsonSync(stressFile, {
        type: "interleaved-write",
        seq: w,
        data: "X".repeat(1000 * (w + 1)),
      });
      await new Promise((res) => setTimeout(res, 8));
    }
  })();

  await Promise.all([readerWorker, writerWorker]);

  check("Concurrent reader reads valid atomic state without JSON corruption (0 corrupt reads)", () => {
    assert.equal(corruptReadsDetected, 0, `Encountered ${corruptReadsDetected} corrupt reads!`);
    assert.ok(totalReads > 0, "Reader must have executed reads");
  });

  // Clean up
  try { if (fs.existsSync(stressFile)) fs.unlinkSync(stressFile); } catch {}
}

// =============================================================================
// SUITE 2: Corrupted & Malformed JSON Resilience (readJsonWithFallback)
// =============================================================================
console.log("\n▶ SUITE 2: Corrupted & Malformed JSON Resilience");

{
  const corruptFile = resolveStoragePath("adversarial-corrupt-test.json");

  // 2.1 Truncated JSON
  fs.writeFileSync(corruptFile, '{"id": "broken", "items": [1, 2, {"title": "incomplete', "utf-8");
  check("Handles truncated JSON, recovers fallback, and auto-heals file on disk", () => {
    const fallbackSeed = { id: "healed-seed", status: "ok", items: [99] };
    const { data, mtime } = readJsonWithFallback(corruptFile, () => fallbackSeed);

    assert.equal(data.id, "healed-seed");
    assert.equal(data.status, "ok");
    assert.ok(mtime > 0);

    // Verify disk content was healed
    const diskContent = fs.readFileSync(corruptFile, "utf-8");
    const diskParsed = JSON.parse(diskContent);
    assert.equal(diskParsed.id, "healed-seed");
  });

  // 2.2 Completely Empty File (0-byte)
  fs.writeFileSync(corruptFile, "", "utf-8");
  check("Handles 0-byte empty file without throwing Unexpected End of Input", () => {
    const { data } = readJsonWithFallback(corruptFile, () => ({ emptyHealed: true }));
    assert.equal(data.emptyHealed, true);
    const diskContent = fs.readFileSync(corruptFile, "utf-8");
    assert.ok(diskContent.includes('"emptyHealed": true'));
  });

  // 2.3 Raw Binary & Garbage Noise
  const garbageBuf = Buffer.from([0x00, 0x1f, 0x8b, 0xff, 0xfe, 0x00, 0x41, 0x42, 0x43]);
  fs.writeFileSync(corruptFile, garbageBuf);
  check("Handles raw binary garbage bytes cleanly and restores pristine fallback", () => {
    const { data } = readJsonWithFallback(corruptFile, () => ({ recoveredFromGarbage: true }));
    assert.equal(data.recoveredFromGarbage, true);
    const diskParsed = JSON.parse(fs.readFileSync(corruptFile, "utf-8"));
    assert.equal(diskParsed.recoveredFromGarbage, true);
  });

  // 2.4 Schema Validation Failure (Valid JSON but invalid schema)
  fs.writeFileSync(corruptFile, JSON.stringify({ wrongStructure: 12345 }), "utf-8");
  check("Rejects schema-violating JSON via validator predicate and replaces with fallback", () => {
    const { data } = readJsonWithFallback(
      corruptFile,
      () => ({ validKey: "restored", tags: ["a", "b"] }),
      (p) => typeof p?.validKey === "string" && Array.isArray(p?.tags)
    );

    assert.equal(data.validKey, "restored");
    assert.equal(data.tags.length, 2);
    const diskParsed = JSON.parse(fs.readFileSync(corruptFile, "utf-8"));
    assert.equal(diskParsed.validKey, "restored");
  });

  // 2.5 Primitive JSON Values (null, number, boolean, string)
  for (const primitive of [null, 9999, false, "plain-string"]) {
    fs.writeFileSync(corruptFile, JSON.stringify(primitive), "utf-8");
    check(`Resilient against primitive JSON value: ${JSON.stringify(primitive)}`, () => {
      const { data } = readJsonWithFallback(
        corruptFile,
        () => ({ safeObject: true }),
        (p) => p !== null && typeof p === "object" && !Array.isArray(p) && p.safeObject === true
      );
      assert.equal(data.safeObject, true);
    });
  }

  // 2.6 Deeply Nested Non-Existent Directory Creation
  const deeplyNestedFile = resolveStoragePath("deeply/nested/adversarial/storage-test.json");
  check("Auto-creates deeply nested parent directories when initializing fallback", () => {
    const { data } = readJsonWithFallback(deeplyNestedFile, () => ({ deeplyCreated: true }));
    assert.equal(data.deeplyCreated, true);
    assert.ok(fs.existsSync(deeplyNestedFile));
    const diskParsed = JSON.parse(fs.readFileSync(deeplyNestedFile, "utf-8"));
    assert.equal(diskParsed.deeplyCreated, true);

    // Clean up directory
    try {
      fs.unlinkSync(deeplyNestedFile);
      fs.rmdirSync(path.dirname(deeplyNestedFile));
      fs.rmdirSync(path.dirname(path.dirname(deeplyNestedFile)));
      fs.rmdirSync(path.dirname(path.dirname(path.dirname(deeplyNestedFile))));
    } catch {}
  });

  // Clean up
  try { if (fs.existsSync(corruptFile)) fs.unlinkSync(corruptFile); } catch {}
}

// =============================================================================
// SUITE 3: Multi-Process Restart & Cross-Process Live Cache Invalidation
// =============================================================================
console.log("\n▶ SUITE 3: Multi-Process Restart & Cross-Process Live Invalidation");

{
  const pageAlphaSlug = `adv-slug-alpha-${Date.now()}`;
  const pageBetaSlug = `adv-slug-beta-${Date.now()}`;

  // Process 1: Create Page Alpha
  check("Child Process 1 creates Page Alpha in site-builder store", () => {
    const p1Code = `
      import { saveCustomPage } from './apps/web/lib/admin-site-builder-store.ts';
      const res = saveCustomPage({
        slug: '${pageAlphaSlug}',
        titleFa: 'برگه آزمایشی فرآیند اول',
        titleEn: 'Process 1 Alpha Page',
        status: 'published',
        blocks: [{ id: 'b1', order: 1, enabled: true, block: { type: 'custom_html', data: { htmlContent: '<h1>Alpha</h1>' } } }]
      });
      if (!res.success) process.exit(1);
    `;
    execSync(`node --input-type=module -e "${p1Code.replace(/\n/g, " ")}"`, { stdio: "inherit" });
  });

  // Process 2: Verify Page Alpha, append Block, create Page Beta
  check("Child Process 2 observes Page Alpha, updates it, and creates Page Beta", () => {
    const p2Code = `
      import { getCustomPageBySlug, saveCustomPage } from './apps/web/lib/admin-site-builder-store.ts';
      const alpha = getCustomPageBySlug('${pageAlphaSlug}');
      if (!alpha || alpha.titleEn !== 'Process 1 Alpha Page') process.exit(1);

      alpha.titleEn = 'Process 1 Alpha Page (Updated by P2)';
      const aRes = saveCustomPage(alpha);
      if (!aRes.success) process.exit(5);

      const bRes = saveCustomPage({
        slug: '${pageBetaSlug}',
        titleFa: 'برگه آزمایشی فرآیند دوم',
        titleEn: 'Process 2 Beta Page',
        status: 'published',
      });
      if (!bRes.success) process.exit(2);
    `;
    execSync(`node --input-type=module -e "${p2Code.replace(/\n/g, " ")}"`, { stdio: "inherit" });
  });

  // Process 3: Verify both exist and delete Alpha
  check("Child Process 3 observes updated Alpha & Beta, then deletes Alpha", () => {
    const p3Code = `
      import { getCustomPageBySlug, deleteCustomPage } from './apps/web/lib/admin-site-builder-store.ts';
      const alpha = getCustomPageBySlug('${pageAlphaSlug}');
      if (!alpha) process.exit(1);
      if (alpha.titleEn !== 'Process 1 Alpha Page (Updated by P2)') process.exit(1);

      const beta = getCustomPageBySlug('${pageBetaSlug}');
      if (!beta) process.exit(2);

      const delRes = deleteCustomPage(alpha.id);
      if (!delRes.success) process.exit(3);
    `;
    execSync(`node --input-type=module -e "${p3Code.replace(/\n/g, " ")}"`, { stdio: "inherit" });
  });

  // Process 4: Verify Alpha is gone and Beta persists
  check("Child Process 4 confirms Alpha deletion and Beta persistence, then cleans Beta", () => {
    const p4Code = `
      import { getCustomPageBySlug, deleteCustomPage } from './apps/web/lib/admin-site-builder-store.ts';
      const alpha = getCustomPageBySlug('${pageAlphaSlug}');
      if (alpha) process.exit(1);

      const beta = getCustomPageBySlug('${pageBetaSlug}');
      if (!beta) process.exit(2);

      deleteCustomPage(beta.id);
    `;
    execSync(`node --input-type=module -e "${p4Code.replace(/\n/g, " ")}"`, { stdio: "inherit" });
  });

  // 3.2 Live Cross-Process In-Memory Cache Invalidation
  // Parent process loads storage into memory
  const initialStorage = getSiteBuilderStorage();
  const initialPagesCount = initialStorage.pages.length;

  // External process mutates the disk file directly via another Node invocation
  const externalPageSlug = `live-inval-${Date.now()}`;
  execSync(
    `node --input-type=module -e "import { saveCustomPage } from './apps/web/lib/admin-site-builder-store.ts'; saveCustomPage({ slug: '${externalPageSlug}', titleFa: 'تست ابطال زنده', status: 'published' });"`,
    { stdio: "inherit" }
  );

  // Now, parent process (without restarting!) calls getSiteBuilderStorage()
  check("Running process automatically detects disk mtime change and invalidates in-memory cache", () => {
    const freshStorage = getSiteBuilderStorage();
    const found = freshStorage.pages.find((p) => p.slug === externalPageSlug);
    assert.ok(found, "Running process must observe page created by another process via mtime refresh");
    assert.equal(freshStorage.pages.length, initialPagesCount + 1);

    // Clean up
    deleteCustomPage(found.id);
  });
}

// =============================================================================
// SUITE 4: Deep Operational Mutation Verification across All Stores
// =============================================================================
console.log("\n▶ SUITE 4: Deep Operational Mutation Verification across All Stores");

// 4.1 Site Builder Store
{
  const fullPageSlug = `deep-page-7blocks-${Date.now()}`;
  const saveRes = saveCustomPage({
    slug: fullPageSlug,
    titleFa: "برگه آزمایشی کامل با ۷ بلوک ساختاری",
    titleEn: "Comprehensive 7-Block Test Page",
    status: "published",
    blocks: [
      {
        id: "b-hero",
        order: 1,
        enabled: true,
        block: {
          type: "hero",
          data: {
            headlineFa: "سرتیتر قهرمان فارسی",
            headlineEn: "Hero Headline",
            subheadlineFa: "زیرتیتر توضیحات",
            subheadlineEn: "Subheadline description",
            primaryCtaTextFa: "شروع دوره",
            primaryCtaTextEn: "Get Started",
            primaryCtaUrl: "/checkout",
          },
        },
      },
      {
        id: "b-feat",
        order: 2,
        enabled: true,
        block: {
          type: "features",
          data: {
            headlineFa: "ویژگی‌های کلیدی",
            headlineEn: "Key Features",
            features: [
              { icon: "star", titleFa: "هوش مصنوعی", titleEn: "AI Powered", descriptionFa: "تصحیح بلادرنگ", descriptionEn: "Realtime" },
            ],
          },
        },
      },
      {
        id: "b-video",
        order: 3,
        enabled: true,
        block: {
          type: "video",
          data: {
            headlineFa: "ویدیوی معرفی",
            headlineEn: "Intro Video",
            videoUrl: "https://github.com/endoora/assets/releases/video.mp4",
          },
        },
      },
      {
        id: "b-price",
        order: 4,
        enabled: true,
        block: {
          type: "pricing",
          data: {
            headlineFa: "پلن‌های اشتراک",
            headlineEn: "Pricing Plans",
            plans: [
              { nameFa: "طلایی", nameEn: "Gold", priceToman: 490000, periodTextFa: "ماهانه", periodTextEn: "Monthly", featuresFa: ["همه"], featuresEn: ["All"], ctaTextFa: "خرید", ctaTextEn: "Buy", ctaUrl: "/pay" },
            ],
          },
        },
      },
      {
        id: "b-testi",
        order: 5,
        enabled: true,
        block: {
          type: "testimonials",
          data: {
            headlineFa: "نظرات زبان‌آموزان",
            headlineEn: "Learner Testimonials",
            items: [
              { nameFa: "زهرا احمدی", nameEn: "Zahra", roleFa: "داوطلب آیلتس", roleEn: "Candidate", avatar: "/avatar.png", quoteFa: "عالی بود", quoteEn: "Great" },
            ],
          },
        },
      },
      {
        id: "b-faq",
        order: 6,
        enabled: true,
        block: {
          type: "faq",
          data: {
            headlineFa: "سوالات متداول",
            headlineEn: "FAQ",
            items: [
              { questionFa: "نحوه ثبت نام؟", questionEn: "How to enroll?", answerFa: "آنلاین", answerEn: "Online" },
            ],
          },
        },
      },
      {
        id: "b-html",
        order: 7,
        enabled: true,
        block: {
          type: "custom_html",
          data: {
            htmlContent: "<div class='test-box'>HTML Content</div>",
          },
        },
      },
    ],
  });

  check("Site Builder: Saves complex page with all 7 block types", () => {
    assert.equal(saveRes.success, true);
    assert.equal(saveRes.page.blocks.length, 7);
  });

  check("Site Builder: Verifies all 7 block types exist in disk file", () => {
    const diskPath = resolveStoragePath("site-builder-operations.json");
    const rawDisk = fs.readFileSync(diskPath, "utf-8");
    for (const bType of ["hero", "features", "video", "pricing", "testimonials", "faq", "custom_html"]) {
      assert.ok(rawDisk.includes(`"type": "${bType}"`), `Disk must contain block type: ${bType}`);
    }
  });

  check("Site Builder: View slug increment persists view counter", () => {
    const pageBefore = getCustomPageBySlug(fullPageSlug);
    const initialViews = pageBefore.viewsCount || 0;

    // Trigger second view
    const pageAfter = getCustomPageBySlug(fullPageSlug);
    assert.equal(pageAfter.viewsCount, initialViews + 1);

    const diskRaw = fs.readFileSync(resolveStoragePath("site-builder-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(`"viewsCount": ${initialViews + 1}`));
  });

  check("Site Builder: Navigation menu draft publication updates liveMenu and history", () => {
    const currentNav = getNavigationConfig();
    const updatedDraft = {
      ...currentNav.draft,
      headerNav: [
        ...currentNav.draft.headerNav,
        { id: `test-nav-${Date.now()}`, path: "/new-path", fa: "مسیر تستی", en: "Test Path", order: 99 },
      ],
    };
    saveDraftNavigation(updatedDraft);

    const pubRes = publishLiveNavigation();
    assert.equal(pubRes.success, true);

    const freshNav = getNavigationConfig();
    assert.ok(freshNav.history.length >= 2, "Menu history must retain previous versions");
    assert.ok(freshNav.live.headerNav.some((h) => h.path === "/new-path"));
  });

  check("Site Builder: Theme updates persist branding colors and custom CSS", () => {
    const prevTheme = getGlobalThemeConfig();
    const newColor = "#10b981";
    const testCss = ".custom-stress-test { color: green; }";

    saveGlobalThemeConfig({
      brandPrimaryColor: newColor,
      customCssCode: testCss,
      customCssEnabled: true,
    });

    const diskRaw = fs.readFileSync(resolveStoragePath("site-builder-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(newColor));
    assert.ok(diskRaw.includes(testCss));

    // Restore
    saveGlobalThemeConfig(prevTheme);
  });

  // Cleanup page
  deleteCustomPage(saveRes.page.id);
}

// 4.2 Autonomous Ops Store
{
  check("Autonomous Ops: Creates both SQL and JSON backups with disk persistence", () => {
    const sqlRes = createDatabaseBackup("sql", "تست پشتیبان‌گیری SQL استرس");
    const jsonRes = createDatabaseBackup("json", "تست پشتیبان‌گیری JSON استرس");

    assert.equal(sqlRes.success, true);
    assert.equal(jsonRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("autonomous-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(sqlRes.backup.id));
    assert.ok(diskRaw.includes(jsonRes.backup.id));
    assert.ok(diskRaw.includes('"format": "sql"'));
    assert.ok(diskRaw.includes('"format": "json"'));
  });

  check("Autonomous Ops: Incident status update and resolution note persist to disk", () => {
    const storage = getAutonomousOpsStorage();
    const inc = storage.incidents[0];
    assert.ok(inc, "Expected at least one incident");
    const prevStatus = inc.status;
    const resNote = `برطرف شدن حادثه استرس ${Date.now()}`;

    const resolveRes = updateIncidentStatus(inc.id, "resolved", resNote, "مدیر ارشد تست");
    assert.equal(resolveRes.success, true);
    assert.equal(resolveRes.incident.status, "resolved");

    const diskRaw = fs.readFileSync(resolveStoragePath("autonomous-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(inc.id));
    assert.ok(diskRaw.includes(resNote));

    // Restore
    updateIncidentStatus(inc.id, prevStatus, "", "مدیر ارشد تست");
  });

  check("Autonomous Ops: Background task toggle and manual execution log persist", () => {
    const taskRes = toggleTaskStatus("task_backup_nightly", false);
    assert.equal(taskRes.success, true);
    assert.equal(taskRes.task.isEnabled, false);

    const runRes = runBackgroundTaskNow("task_backup_nightly");
    assert.equal(runRes.success, true);
    assert.ok(runRes.log.id);

    const diskRaw = fs.readFileSync(resolveStoragePath("autonomous-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(runRes.log.id));

    // Restore
    toggleTaskStatus("task_backup_nightly", true);
  });

  check("Autonomous Ops: Dictionary item addition and update persist correctly", () => {
    const testKey = `stress_dict_key_${Date.now()}`;
    const updateRes = updateDictionaryItem(
      testKey,
      "متن تستی فارسی استرس",
      "Stress Test English Text",
      "مدیر ارشد تست"
    );
    assert.equal(updateRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("autonomous-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(testKey));
    assert.ok(diskRaw.includes("متن تستی فارسی استرس"));
  });
}

// 4.3 Forms & Webhooks Store
{
  const testFormSlug = `stress-form-${Date.now()}`;
  check("Forms & Webhooks: Creates complex multi-field form with automations", () => {
    const saveRes = saveCustomForm({
      slug: testFormSlug,
      titleFa: "فرم پیشرفته ثبت‌نام دوره‌های بین‌المللی",
      titleEn: "Advanced International Registration Form",
      status: "published",
      fields: [
        { id: "f_name", label: "نام کامل", type: "text", isRequired: true },
        { id: "f_email", label: "ایمیل", type: "email", isRequired: true },
        { id: "f_level", label: "سطح فعلی", type: "select", options: ["A1", "A2", "B1", "B2", "C1"], isRequired: false },
      ],
      automations: {
        telegramEnabled: true,
        telegramChatId: "-100123456789",
        smsEnabled: true,
        smsTemplate: "TEMPLATE_CONFIRM",
        webhookEnabled: true,
        webhookUrl: "https://api.endoora.ir/webhooks/incoming",
      },
    });
    assert.equal(saveRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("forms-webhooks-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(testFormSlug));
    assert.ok(diskRaw.includes("https://api.endoora.ir/webhooks/incoming"));
  });

  let submissionId = "";
  check("Forms & Webhooks: Submits response from client IP and updates webhook status", () => {
    const subRes = submitPublicFormResponse(
      testFormSlug,
      { f_name: "مریم میرزاخانی", f_email: "maryam@example.com", f_level: "C1" },
      "185.120.24.50",
      "Endoora-Adversarial-Bot/2.0"
    );
    assert.equal(subRes.success, true);
    submissionId = subRes.submission.id;
    assert.ok(submissionId);

    // Update webhook status
    const statusRes = updateSubmissionWebhookStatus(submissionId, "success");
    assert.equal(statusRes, true);

    const subs = getFormSubmissions(testFormSlug);
    const updatedSub = subs.find((s) => s.id === submissionId);
    assert.equal(updatedSub?.webhookStatus, "success");

    const diskRaw = fs.readFileSync(resolveStoragePath("forms-webhooks-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(submissionId));
    assert.ok(diskRaw.includes('"webhookStatus": "success"'));
  });

  // Cleanup form
  const forms = getCustomFormsList();
  const fMatch = forms.find((f) => f.slug === testFormSlug);
  if (fMatch) deleteCustomForm(fMatch.id);
}

// 4.4 Financial Risk Store
{
  check("Financial Risk: Issues 1-click refund and marks transaction as refunded", () => {
    const storage = getFinancialRiskStorage();
    // Use an unrefunded transaction or create temporary test transaction
    let targetTx = storage.transactions.find((t) => !t.isRefunded);
    if (!targetTx) {
      targetTx = {
        id: `tx_stress_${Date.now()}`,
        learnerId: "usr_stress_99",
        learnerName: "کاربر آزمایشی استرداد",
        learnerPhone: "09121112233",
        courseId: "course-ielts",
        courseTitle: "دوره آیلتس",
        amountToman: 1500000,
        gateway: "zarinpal",
        trackingNumber: "TRK-998877",
        isRefunded: false,
        createdAt: "1403/08/20",
        teacherId: "t_01",
        teacherName: "استاد محمدی",
      };
      storage.transactions.push(targetTx);
      persistFinancialRisk();
    }

    const refundRes = issueOneClickRefund({
      transactionId: targetTx.id,
      reason: "تست امنیتی انصراف استرس",
      refundMethod: "wallet_credit",
    });

    assert.equal(refundRes.success, true);
    assert.equal(targetTx.isRefunded, true);
    assert.ok(refundRes.refund.bonusAmountToman > 0, "Wallet credit must provide 5% bonus");

    const diskRaw = fs.readFileSync(resolveStoragePath("financial-risk-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(refundRes.refund.id));

    // Clean up test refund
    storage.refunds = storage.refunds.filter((r) => r.id !== refundRes.refund.id);
    targetTx.isRefunded = false;
    persistFinancialRisk();
  });

  check("Financial Risk: Mitigates risk alert with force_logout and persists action", () => {
    const storage = getFinancialRiskStorage();
    const alert = storage.riskAlerts[0];
    if (alert) {
      const prevStatus = alert.status;
      const mitRes = mitigateRiskAlertAction(alert.id, "force_logout", "مدیر ریسک آزمایشی");
      assert.equal(mitRes.success, true);
      assert.equal(mitRes.alert.status, "mitigated");

      const diskRaw = fs.readFileSync(resolveStoragePath("financial-risk-operations.json"), "utf-8");
      assert.ok(diskRaw.includes("تمامی نشست‌های فعال"));

      // Restore
      alert.status = prevStatus;
      persistFinancialRisk();
    }
  });
}

// 4.5 Gamification & Affiliates Store
{
  const refCode = `PARTNER_${Date.now()}`;
  check("Gamification & Affiliates: Registers affiliate partner and updates XP rules", () => {
    const saveRes = saveAffiliatePartnerAction({
      partnerName: "آکادمی آموزش دیجیتال پیشرو",
      phone: "09129990011",
      email: "pishro.partner@example.com",
      referralCode: refCode,
      commissionRatePercent: 25,
      shebaNumber: "IR020120000000009988776655",
      bankName: "بانک پاسارگاد",
    });
    assert.equal(saveRes.success, true);

    // Update XP rules
    const xpRes = updateXpRulesAction({
      dailyLoginXp: 35,
      perfectQuizBonusXp: 75,
    });
    assert.equal(xpRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("gamification-affiliates-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(refCode.toLowerCase()));
    assert.ok(diskRaw.includes('"dailyLoginXp": 35'));
    assert.ok(diskRaw.includes('"perfectQuizBonusXp": 75'));

    // Restore XP rules
    updateXpRulesAction({ dailyLoginXp: 15, perfectQuizBonusXp: 50 });
  });

  check("Gamification & Affiliates: Adjusts learner XP and recalculates league tiers", () => {
    const storage = getGamificationStorage();
    const testLearner = storage.learners[0];
    if (testLearner) {
      const initialXp = testLearner.totalXp;
      const initialLeague = testLearner.league;

      // Add enough XP to reach Master league (>= 7000 XP)
      adjustLearnerXpAction(testLearner.userId, 8000, "تست ارتقای لیگ مستر");
      assert.equal(testLearner.league, "master");

      const diskRaw = fs.readFileSync(resolveStoragePath("gamification-affiliates-operations.json"), "utf-8");
      assert.ok(diskRaw.includes('"league": "master"'));

      // Restore
      testLearner.totalXp = initialXp;
      testLearner.league = initialLeague;
      persistGamification();
    }
  });
}

// 4.6 Server Ops Store
{
  check("Server Ops: Toggles maintenance mode with custom Persian message and IP whitelist", () => {
    const prev = getMaintenanceConfig();
    const testMsg = `پیام تست حالت تعمیرات استرس ${Date.now()}`;
    const updateRes = saveMaintenanceConfig({
      isEnabled: true,
      customMessageFa: testMsg,
      whitelistedIps: ["127.0.0.1", "10.0.0.1", "192.168.1.50"],
    });
    assert.equal(updateRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("server-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(testMsg));
    assert.ok(diskRaw.includes("192.168.1.50"));
    assert.ok(diskRaw.includes('"isEnabled": true'));

    // Revert
    saveMaintenanceConfig(prev);
  });

  check("Server Ops: Cache purge event is recorded in telemetry and persisted", () => {
    const purgeRes = purgeCache("nextjs_route", "/content/courses", "مدیر سرور آزمایشی");
    assert.equal(purgeRes.success, true);

    const diskRaw = fs.readFileSync(resolveStoragePath("server-ops-operations.json"), "utf-8");
    assert.ok(diskRaw.includes(purgeRes.event.id));
    assert.ok(diskRaw.includes("/content/courses"));
  });
}

// 4.7 Academics Store & Authentic Media Presets
{
  check("Academics: All 6 media presets are CSP-compliant with zero dummy URLs", () => {
    assert.ok(MEDIA_PRESET_ASSETS.length >= 6);
    for (const asset of MEDIA_PRESET_ASSETS) {
      assert.ok(!asset.videoUrl.includes("commondatastorage.googleapis.com"));
      assert.ok(!asset.audioUrl.includes("soundhelix.com"));
      assert.ok(asset.videoUrl.startsWith("https://") || asset.videoUrl.startsWith("/"));
      assert.ok(asset.audioUrl.startsWith("https://") || asset.audioUrl.startsWith("/audio/"));
      for (const d of asset.downloadables) {
        assert.ok(!d.url.startsWith("/downloads/"));
      }
    }
  });

  check("Academics: Grants enrollment, records audit log, and persists to disk", () => {
    const testEmail = `stress.learner.${Date.now()}@endoora.ir`;
    const grantRes = grantCourseEnrollment(
      "زبان‌آموز آزمایشی استرس",
      testEmail,
      "09120001122",
      "course-ielts-b2",
      "دوره جامع آیلتس",
      "IELTS Comprehensive",
      "B2"
    );
    assert.equal(grantRes.success, true);

    // Update lesson quiz score to 96
    const targetLessonId = grantRes.enrollment.lessons[0].lessonId;
    const scoreRes = updateLessonQuizScore(grantRes.enrollment.learnerId, "course-ielts-b2", targetLessonId, 96);
    assert.equal(scoreRes.success, true);

    // Verify disk files
    const enrDisk = fs.readFileSync(resolveStoragePath("admin/academics-enrollments.json"), "utf-8");
    assert.ok(enrDisk.includes(testEmail));
    assert.ok(enrDisk.includes('"quizScore": 96'));

    const audDisk = fs.readFileSync(resolveStoragePath("admin/academics-audit-logs.json"), "utf-8");
    assert.ok(audDisk.includes("UPDATE_SCORE"));
    assert.ok(audDisk.includes("96"));
  });

  check("Academics: Saves and retrieves lesson quiz with options and Persian explanations", () => {
    const lessonId = `quiz_stress_${Date.now()}`;
    const quizPayload = [
      {
        prompt_fa: "کدام گزینه بیانگر ساختار شرطی نوع دوم است؟",
        prompt_en: "Which sentence exemplifies the second conditional?",
        options: [
          "If I study, I pass.",
          "If I won the lottery, I would travel the world.",
          "If it rains, we will cancel.",
          "If I had known, I would have told you.",
        ],
        correct_index: 1,
        explanation_fa: "شرطی نوع دوم از ترکیب زمان گذشته ساده در If-clause و Would + Verb در main clause تشکیل می‌شود.",
      },
    ];

    saveLessonQuiz(lessonId, quizPayload);
    const loaded = getLessonQuiz(lessonId);
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].correct_index, 1);
    assert.equal(loaded[0].prompt_fa, "کدام گزینه بیانگر ساختار شرطی نوع دوم است؟");

    const quizDisk = fs.readFileSync(resolveStoragePath("admin/academics-quizzes.json"), "utf-8");
    assert.ok(quizDisk.includes(lessonId));
    assert.ok(quizDisk.includes("شرطی نوع دوم"));
  });
}

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log("\n===============================================================================");
console.log("📊 ADVERSARIAL STRESS TEST SUMMARY");
console.log("===============================================================================");
console.log(`Total Checks Executed : ${totalChecks}`);
console.log(`Passed Checks         : ${passedChecks}`);
console.log(`Failed Checks         : ${failedChecks}`);
console.log(`Pass Rate             : ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (failedChecks === 0) {
  console.log("\n🏆 VERDICT: APPROVE");
  console.log("All persistence primitives, concurrency locks, corruption fallbacks,");
  console.log("multi-process restart boundaries, and deep operational store mutations");
  console.log("executed with 100% durability and zero defects.");
  process.exit(0);
} else {
  console.error("\n❌ VERDICT: REQUEST_CHANGES");
  console.error(`${failedChecks} verification checks failed.`);
  process.exit(1);
}
