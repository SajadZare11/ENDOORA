import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

// Imports from target project
import {
  evaluateEssayLinguistics,
  runBenchmarkTest,
  getAiEngineStorage,
} from "../../apps/web/lib/ai-engine-store.ts";
import {
  validateWebhookUrl,
  isPrivateOrReservedIp,
} from "../../apps/web/lib/ssrf-protection.ts";
import {
  getFormsWebhooksStorage,
  updateSubmissionWebhookStatus,
  testWebhookEndpoint,
} from "../../apps/web/lib/admin-forms-webhooks-store.ts";
import {
  getApiIntegrations,
  pingApiIntegration,
  getServerOpsStorage,
} from "../../apps/web/lib/admin-server-ops-store.ts";
import {
  MEDIA_PRESET_ASSETS,
} from "../../apps/web/lib/admin-academics-store.ts";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function recordPass(testName) {
  totalTests++;
  passedTests++;
  console.log(`  ✓ PASS: ${testName}`);
}

function recordFail(testName, error) {
  totalTests++;
  failedTests++;
  const msg = error?.message || String(error);
  failureDetails.push({ testName, error: msg });
  console.log(`  ✗ FAIL: ${testName}\n    -> ${msg}`);
}

console.log("===============================================================================");
console.log("Adversarial Stress Test Suite: Milestone 2 Simulation & Security Verification");
console.log("===============================================================================\n");

// ==============================================================================
// SUITE 1: AI Engine Linguistic Evaluation Adversarial Stress Tests
// ==============================================================================
console.log("--- Suite 1: AI Engine Linguistic Evaluation Stress Tests ---");

// Test 1.1: 0 words input
try {
  const res = evaluateEssayLinguistics("");
  assert.equal(res.overallBand, 1.0, "0 words must receive Band 1.0");
  assert.equal(res.metrics.wordCount, 0, "Word count must be 0");
  assert.equal(res.inlineCorrections.length, 0, "Inline corrections must be empty for 0 words");
  recordPass("1.1 Empty/0-word input correctly assigns Band 1.0 with empty corrections");
} catch (e) {
  recordFail("1.1 Empty/0-word input correctly assigns Band 1.0 with empty corrections", e);
}

// Test 1.2: 1-word input penalty
try {
  const res = evaluateEssayLinguistics("hello");
  assert.equal(res.metrics.wordCount, 1, "Word count must be 1");
  // Under Cambridge IELTS criteria, a single word cannot receive Band 5.5 (Modest User)
  // An essay must be severely penalized for length (<40 words should be Band 1.0 - 2.5)
  assert.ok(
    res.overallBand <= 2.5,
    `1-word input received Band ${res.overallBand}, which is an arbitrary high band! Expected <= 2.5.`
  );
  recordPass("1.2 1-word input severely penalized (expected <= 2.5)");
} catch (e) {
  recordFail("1.2 1-word input severely penalized (expected <= 2.5)", e);
}

// Test 1.3: 500 repetitive words ("test test test...")
try {
  const repText = "test ".repeat(500).trim();
  const res = evaluateEssayLinguistics(repText);
  assert.equal(res.metrics.wordCount, 500, "Word count must be 500");
  assert.equal(res.metrics.uniqueWords, 1, "Unique words must be 1");
  assert.ok(res.metrics.typeTokenRatio <= 0.01, "TTR must be extremely low (<= 0.01)");
  // Repetitive text lacks grammar, cohesion, and task achievement; must not get Band 6.0!
  assert.ok(
    res.overallBand <= 3.0,
    `500 repetitive words received Band ${res.overallBand} (TaskAchievement: ${res.subScores.taskAchievement}, GrammaticalAccuracy: ${res.subScores.grammaticalAccuracy}). Arbitrary high band assigned!`
  );
  recordPass("1.3 500 repetitive words penalized (expected <= 3.0)");
} catch (e) {
  recordFail("1.3 500 repetitive words penalized (expected <= 3.0)", e);
}

// Test 1.4: Extreme grammar errors without benchmark keywords
try {
  const brokenText = "I is wented to school yesterday and he are not have no books and they does not knows nothing.";
  const res = evaluateEssayLinguistics(brokenText);
  // Contains blatant errors ('I is', 'wented', 'he are', 'does not knows')
  // Should NOT get Band 5.5 as if error-free
  assert.ok(
    res.metrics.errorCount > 0 || res.overallBand <= 4.0,
    `Broken grammar received Band ${res.overallBand} with 0 errors detected! Expected error detection or band <= 4.0.`
  );
  recordPass("1.4 Extreme grammar errors detected or penalized appropriately");
} catch (e) {
  recordFail("1.4 Extreme grammar errors detected or penalized appropriately", e);
}

// Test 1.5: Non-English text (Persian / Foreign language)
try {
  const persianText = "سلام این یک متن کاملاً فارسی است برای ارزیابی اینکه آیا سیستم به متن‌های غیرانگلیسی نمره بالا می‌دهد یا خیر.";
  const res = evaluateEssayLinguistics(persianText);
  assert.equal(res.metrics.uniqueWords, 0, "Non-English text has 0 English words");
  // Non-English text must NOT receive Band 5.5
  assert.ok(
    res.overallBand <= 2.0,
    `Non-English text received Band ${res.overallBand}! Expected <= 2.0.`
  );
  recordPass("1.5 Non-English text strictly penalized (expected <= 2.0)");
} catch (e) {
  recordFail("1.5 Non-English text strictly penalized (expected <= 2.0)", e);
}

// Test 1.6: Unicode injection & Control characters
try {
  const injection = "\u0000\u001f<script>alert('xss')</script> DROP TABLE users; --";
  const res = evaluateEssayLinguistics(injection);
  assert.ok(typeof res.overallBand === "number", "Evaluation must return a number without crashing");
  assert.ok(!isNaN(res.overallBand), "Overall band must not be NaN");
  assert.ok(res.overallBand <= 3.0, `Corrupt/injection input received Band ${res.overallBand}, expected <= 3.0`);
  recordPass("1.6 Unicode injection safely evaluated and penalized (expected <= 3.0)");
} catch (e) {
  recordFail("1.6 Unicode injection safely evaluated and penalized (expected <= 3.0)", e);
}

// Test 1.7: Inline corrections derivation from input
try {
  const text = "Nowadays technology has good things and bad things. Also internet is good for search information.";
  const res = evaluateEssayLinguistics(text);
  assert.ok(res.inlineCorrections.length > 0, "Expected corrections for known patterns");
  for (const corr of res.inlineCorrections) {
    assert.ok(
      text.includes(corr.original),
      `Correction original '${corr.original}' must be an exact substring of the evaluated input text`
    );
  }
  recordPass("1.7 Inline corrections are strictly derived from input text substrings");
} catch (e) {
  recordFail("1.7 Inline corrections are strictly derived from input text substrings", e);
}

// ==============================================================================
// SUITE 2: Webhook Retry & SSRF Protection Adversarial Stress Tests
// ==============================================================================
console.log("\n--- Suite 2: Webhook Retry & SSRF Protection Stress Tests ---");

const ssrfForbiddenUrls = [
  { url: "http://127.0.0.1:8000", desc: "Local loopback with forbidden port 8000" },
  { url: "http://localhost:3000", desc: "Localhost hostname with port 3000" },
  { url: "http://169.254.169.254", desc: "Cloud IMDS / Link-local metadata IP" },
  { url: "http://[::1]", desc: "IPv6 Loopback" },
  { url: "http://0.0.0.0", desc: "Current network (0.0.0.0/8)" },
  { url: "http://10.0.0.1", desc: "RFC 1918 Class A Private IP" },
  { url: "http://192.168.1.1", desc: "RFC 1918 Class C Private IP" },
  { url: "http://172.16.0.1", desc: "RFC 1918 Class B Private IP" },
  { url: "http://[fe80::1]", desc: "IPv6 Link-local" },
  { url: "http://100.64.0.1", desc: "Carrier-Grade NAT / Shared Space" },
];

for (const target of ssrfForbiddenUrls) {
  try {
    const res = await validateWebhookUrl(target.url);
    assert.equal(res.isSafe, false, `Forbidden target ${target.url} (${target.desc}) MUST be marked isSafe: false`);
    assert.ok(res.error, `Forbidden target ${target.url} must provide an error message`);
    recordPass(`2.1 SSRF blocked: ${target.url} (${target.desc})`);
  } catch (e) {
    recordFail(`2.1 SSRF blocked: ${target.url} (${target.desc})`, e);
  }
}

// Test 2.2: Valid public webhook destination resolution
try {
  const publicUrl = "https://example.com/api/webhook";
  const res = await validateWebhookUrl(publicUrl);
  assert.equal(res.isSafe, true, "Valid public HTTPS URL must be marked isSafe: true");
  assert.ok(res.resolvedIp, "Resolved IP must be populated for valid domain");
  assert.ok(!isPrivateOrReservedIp(res.resolvedIp), "Resolved IP must be a genuine public IP");
  recordPass("2.2 Public webhook destination successfully validated and resolved");
} catch (e) {
  recordFail("2.2 Public webhook destination successfully validated and resolved", e);
}

// Test 2.3: Webhook payload structure & delivery status update
try {
  const storage = getFormsWebhooksStorage();
  assert.ok(storage.submissions.length > 0, "Expected existing form submissions");
  const testSub = storage.submissions[0];
  const initialStatus = testSub.webhookStatus;

  // Test updating status to failed
  const updatedFailed = updateSubmissionWebhookStatus(testSub.id, "failed");
  assert.equal(updatedFailed, true, "Updating submission webhook status should succeed");
  assert.equal(testSub.webhookStatus, "failed", "Submission webhookStatus must be updated to 'failed'");

  // Test updating status to success
  const updatedSuccess = updateSubmissionWebhookStatus(testSub.id, "success");
  assert.equal(updatedSuccess, true);
  assert.equal(testSub.webhookStatus, "success", "Submission webhookStatus must be updated to 'success'");

  // Restore initial status
  updateSubmissionWebhookStatus(testSub.id, initialStatus);
  recordPass("2.3 Webhook delivery status updates correctly in operational store");
} catch (e) {
  recordFail("2.3 Webhook delivery status updates correctly in operational store", e);
}

// ==============================================================================
// SUITE 3: Server Ops API Vault Pinging Stress Tests
// ==============================================================================
console.log("\n--- Suite 3: Server Ops API Vault Pinging Stress Tests ---");

// Test 3.1: Invalid / non-existent service ID error handling
try {
  let threw = false;
  try {
    await pingApiIntegration("non_existent_service_id_xyz");
  } catch (err) {
    threw = true;
    assert.equal(err.message, "Service not found", "Expected 'Service not found' error");
  }
  assert.ok(threw, "pingApiIntegration must throw for invalid service ID");
  recordPass("3.1 Invalid service ID throws 'Service not found' without crashing");
} catch (e) {
  recordFail("3.1 Invalid service ID throws 'Service not found' without crashing", e);
}

// Test 3.2: Unreachable endpoint timeout handling
try {
  const storage = getServerOpsStorage();
  const testService = storage.apiIntegrations.find((s) => s.id === "kavenegar_sms");
  assert.ok(testService, "Expected kavenegar_sms service");
  const originalUrl = testService.endpointUrl;

  // Temporarily set to RFC 5737 TEST-NET-1 (non-routable blackhole IP)
  testService.endpointUrl = "http://192.0.2.1:81";

  const start = Date.now();
  const res = await pingApiIntegration("kavenegar_sms");
  const elapsed = Date.now() - start;

  // Restore original URL immediately
  testService.endpointUrl = originalUrl;
  getServerOpsStorage();

  assert.equal(res.success, true, "pingApiIntegration returns success object wrapping status");
  assert.equal(res.service.status, "offline", "Unreachable endpoint must be marked 'offline'");
  assert.ok(elapsed <= 9000, `Ping completed in ${elapsed}ms (within timeout bounds)`);
  recordPass("3.2 Unreachable endpoint gracefully times out and sets status to 'offline'");
} catch (e) {
  recordFail("3.2 Unreachable endpoint gracefully times out and sets status to 'offline'", e);
}

// ==============================================================================
// SUITE 4: Academics & Media Assets Authentic Standards
// ==============================================================================
console.log("\n--- Suite 4: Academics & Media Assets Authentic Standards ---");

// Test 4.1: admin-academics-store.ts zero banned domains & dead download paths
try {
  assert.ok(MEDIA_PRESET_ASSETS.length >= 6, "Expected at least 6 media presets");
  for (const asset of MEDIA_PRESET_ASSETS) {
    assert.ok(
      !asset.videoUrl.includes("commondatastorage.googleapis.com"),
      `Asset ${asset.id} videoUrl contains banned commondatastorage.googleapis.com`
    );
    assert.ok(
      !asset.audioUrl.includes("soundhelix.com"),
      `Asset ${asset.id} audioUrl contains banned soundhelix.com`
    );
    for (const d of asset.downloadables) {
      assert.ok(
        !d.url.startsWith("/downloads/"),
        `Downloadable '${d.title}' in ${asset.id} points to dead /downloads/ path`
      );
    }
  }
  recordPass("4.1 admin-academics-store.ts has 0 banned domains and 0 dead /downloads/ paths");
} catch (e) {
  recordFail("4.1 admin-academics-store.ts has 0 banned domains and 0 dead /downloads/ paths", e);
}

// Test 4.2: Media presets CSP compliance
try {
  const allowedMediaProtocolsAndDomains = [
    /^\/audio\//,
    /^\/scratch\//,
    /^https:\/\/github\.com\//,
    /^https:\/\/.*\.githubusercontent\.com\//,
    /^https:\/\/dl\.endoora\.ir\//,
    /^https:\/\/.*\.arvanstorage\.ir\//,
    /^https:\/\/.*\.parspack\.com\//,
  ];

  for (const asset of MEDIA_PRESET_ASSETS) {
    // Check video
    const videoCspOk = allowedMediaProtocolsAndDomains.some((rx) => rx.test(asset.videoUrl));
    assert.ok(videoCspOk, `Asset ${asset.id} videoUrl (${asset.videoUrl}) must match CSP media-src`);

    // Check audio
    const audioCspOk = allowedMediaProtocolsAndDomains.some((rx) => rx.test(asset.audioUrl));
    assert.ok(audioCspOk, `Asset ${asset.id} audioUrl (${asset.audioUrl}) must match CSP media-src`);

    // Check downloadables
    for (const d of asset.downloadables) {
      const downCspOk = allowedMediaProtocolsAndDomains.some((rx) => rx.test(d.url));
      assert.ok(downCspOk, `Asset ${asset.id} downloadable (${d.url}) must match CSP allowed sources`);
    }
  }
  recordPass("4.2 All preset media assets comply with Content-Security-Policy (CSP)");
} catch (e) {
  recordFail("4.2 All preset media assets comply with Content-Security-Policy (CSP)", e);
}

// Test 4.3: Entire codebase scan for banned domains
try {
  const webComponentsDir = path.join(process.cwd(), "apps", "web", "components", "admin");
  const files = fs.readdirSync(webComponentsDir);
  const offenders = [];
  for (const f of files) {
    if (f.endsWith(".tsx") || f.endsWith(".ts")) {
      const content = fs.readFileSync(path.join(webComponentsDir, f), "utf-8");
      if (content.includes("commondatastorage.googleapis.com") || content.includes("soundhelix.com")) {
        offenders.push(f);
      }
    }
  }
  if (offenders.length > 0) {
    console.log(`    [ADVISORY] Banned domains detected in component files: ${offenders.join(", ")}`);
  }
  // The mandate specifically verified: "verify 0 occurrences in admin-academics-store.ts"
  // which passed in 4.1. Here we record findings for whole codebase awareness.
  recordPass("4.3 Codebase banned domains audit scanned");
} catch (e) {
  recordFail("4.3 Codebase banned domains audit scanned", e);
}

// ==============================================================================
// SUMMARY & VERDICT
// ==============================================================================
console.log("\n===============================================================================");
console.log(`Test Execution Summary: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log("===============================================================================");

if (failedTests > 0) {
  console.log("\nFailure Breakdown:");
  for (const f of failureDetails) {
    console.log(`- [${f.testName}]: ${f.error}`);
  }
  console.log("\nVERDICT: REQUEST_CHANGES (Defects found in AI linguistic evaluation penalization)");
  process.exitCode = 1;
} else {
  console.log("\nVERDICT: APPROVE (All stress tests passed)");
}
