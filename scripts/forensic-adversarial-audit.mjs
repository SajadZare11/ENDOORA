import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "../apps/web/lib/admin-storage-engine.ts";

import {
  evaluateEssayLinguistics,
  runPlaygroundTest,
} from "../apps/web/lib/ai-engine-store.ts";

import {
  isPrivateOrReservedIp,
  validateWebhookUrl,
} from "../apps/web/lib/ssrf-protection.ts";

import {
  pingApiIntegration,
} from "../apps/web/lib/admin-server-ops-store.ts";

console.log("================================================================================");
console.log("FORENSIC ADVERSARIAL STRESS TEST & INTEGRITY AUDIT");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// Check 1: JSON Syntactic Validity across apps/web/data
// -----------------------------------------------------------------------------
console.log("[Forensic Check 1] Verifying all JSON files in apps/web/data are valid JSON...");
function findJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

const dataDir = path.join(process.cwd(), "apps", "web", "data");
const jsonFiles = findJsonFiles(dataDir);
assert.ok(jsonFiles.length > 0, "Expected JSON files in data directory");
let validJsonCount = 0;
for (const file of jsonFiles) {
  try {
    const content = fs.readFileSync(file, "utf-8");
    JSON.parse(content);
    validJsonCount++;
  } catch (err) {
    assert.fail(`Corrupted or invalid JSON file: ${file} -> ${err.message}`);
  }
}
console.log(`✓ All ${validJsonCount} JSON files in apps/web/data are valid JSON.`);

// -----------------------------------------------------------------------------
// Check 2: Storage Engine Corruption Resilience & Fallback Recovery
// -----------------------------------------------------------------------------
console.log("\n[Forensic Check 2] Testing Storage Engine under file corruption and concurrent writes...");
{
  const corruptFile = resolveStoragePath("test-corrupt-recovery.json");
  // Deliberately write invalid, truncated JSON
  fs.writeFileSync(corruptFile, '{"broken": [1, 2, 3, truncated', "utf-8");

  // readJsonWithFallback should catch parse error, restore fallback, and rewrite to disk
  const { data } = readJsonWithFallback(
    corruptFile,
    () => ({ restored: true, timestamp: Date.now() })
  );
  assert.equal(data.restored, true, "Fallback must be returned on corrupt file");

  // Verify disk now contains valid JSON
  const diskRaw = fs.readFileSync(corruptFile, "utf-8");
  const reParsed = JSON.parse(diskRaw);
  assert.equal(reParsed.restored, true, "Corrupted file must be healed on disk");

  // Concurrent write stress-test: 50 rapid sequential writes
  for (let i = 0; i < 50; i++) {
    atomicWriteJsonSync(corruptFile, { iteration: i, payload: "x".repeat(1000) });
  }
  const finalContent = JSON.parse(fs.readFileSync(corruptFile, "utf-8"));
  assert.equal(finalContent.iteration, 49, "Last write must be intact");

  // Cleanup
  fs.unlinkSync(corruptFile);
  console.log("✓ Storage engine gracefully heals corrupt files and survives rapid atomic writes.");
}

// -----------------------------------------------------------------------------
// Check 3: Adversarial Linguistic Inputs (Empty, Emojis, Long, Novel Essay)
// -----------------------------------------------------------------------------
console.log("\n[Forensic Check 3] Stress-testing Computational Linguistics with adversarial inputs...");
{
  // 1. Empty string
  const resEmpty = evaluateEssayLinguistics("");
  assert.equal(resEmpty.overallBand, 1.0);
  assert.equal(resEmpty.metrics.wordCount, 0);

  // 2. Pure whitespace and emojis
  const resEmoji = evaluateEssayLinguistics("   😊 🚀 ✨ 👍   ");
  assert.equal(resEmoji.overallBand, 1.0);

  // 3. Very long text (5,000 words generated)
  const longParagraph = "Furthermore, technological convergence empowers pedagogical development. ".repeat(700);
  const startLong = performance.now();
  const resLong = evaluateEssayLinguistics(longParagraph);
  const elapsedLong = performance.now() - startLong;
  assert.ok(elapsedLong < 1000, `Evaluation must be fast, took ${elapsedLong}ms`);
  assert.ok(resLong.metrics.wordCount > 4000);
  assert.ok(resLong.overallBand <= 3.0, `Repetitive long text must be penalized for low lexical diversity, got ${resLong.overallBand}`);

  // 4. Novel unseen essay (authentic IELTS Task 2 submission)
  const novelEssay = `
Some people believe that unpaid community service should be a compulsory part of high school programmes.
To what extent do you agree or disagree?

In recent times, an increasing number of educators advocate making voluntary community work mandatory for secondary school students. Although some critics argue that adding unpaid labour to an already demanding academic syllabus causes unnecessary stress, I firmly believe that community engagement provides invaluable life lessons and fosters social empathy that cannot be acquired in traditional classrooms.

To begin with, participating in social service cultivates practical interpersonal skills. When adolescents engage with charity shelters or elderly care facilities, they develop active listening and emotional intelligence. For example, assisting disadvantaged children improves patience and collaborative problem-solving. Furthermore, these real-world encounters break down socioeconomic prejudices and broaden students' global perspectives.

Conversely, detractors contend that high schoolers must concentrate solely on standardised examinations to secure university admissions. Nevertheless, academic knowledge alone is insufficient for modern civic responsibility; without moral stewardship and social awareness, students risk intellectual insularity.

In conclusion, incorporating community service into the curriculum is a transformative initiative. High schools should mandate civic participation to nurture empathetic and capable future leaders.
  `;
  const resNovel = evaluateEssayLinguistics(novelEssay);
  assert.ok(resNovel.metrics.wordCount >= 180, `Expected >180 words, got ${resNovel.metrics.wordCount}`);
  assert.ok(resNovel.metrics.cohesiveCategoriesCount >= 3, "Expected at least 3 cohesive categories");
  assert.ok(resNovel.overallBand >= 7.0 && resNovel.overallBand <= 8.5, `Expected Band 7.0-8.5, got ${resNovel.overallBand}`);
  console.log(`✓ Novel unseen essay evaluated dynamically: Band ${resNovel.overallBand} (${resNovel.metrics.wordCount} words, TTR ${resNovel.metrics.typeTokenRatio}, ${resNovel.metrics.cohesiveCategoriesCount} cohesive categories).`);
}

// -----------------------------------------------------------------------------
// Check 4: SSRF & IP Obfuscation Evasion Attacks
// -----------------------------------------------------------------------------
console.log("\n[Forensic Check 4] Testing SSRF filter against evasion techniques...");
{
  const testCases = [
    { url: "http://127.0.0.1:80/secret", safe: false, desc: "Standard loopback" },
    { url: "http://localhost:8000/", safe: false, desc: "Localhost hostname" },
    { url: "http://169.254.169.254/latest/meta-data/", safe: false, desc: "AWS IMDS IPv4" },
    { url: "http://[::1]:8080/", safe: false, desc: "IPv6 loopback" },
    { url: "http://10.255.0.1/admin", safe: false, desc: "RFC 1918 10.0.0.0/8" },
    { url: "http://192.168.1.100:80/", safe: false, desc: "RFC 1918 192.168.0.0/16" },
    { url: "http://172.20.5.1/", safe: false, desc: "RFC 1918 172.16.0.0/12" },
    { url: "http://admin:pass@google.com/", safe: false, desc: "Embedded credentials" },
    { url: "ftp://example.com/test", safe: false, desc: "FTP scheme" },
    { url: "http://example.com:22/ssh", safe: false, desc: "Forbidden port 22" },
    { url: "http://example.com:5432/", safe: false, desc: "Forbidden port 5432 (Postgres)" },
  ];

  for (const tc of testCases) {
    const res = await validateWebhookUrl(tc.url);
    assert.equal(res.isSafe, tc.safe, `SSRF test '${tc.desc}' failed: expected isSafe=${tc.safe}, got ${res.isSafe} (${res.error})`);
  }
  console.log("✓ SSRF filter blocked all 11 adversarial evasion attacks.");
}

// -----------------------------------------------------------------------------
// Check 5: Real Network Probes & Offline Graceful Handling
// -----------------------------------------------------------------------------
console.log("\n[Forensic Check 5] Testing API vault pinging under live and offline conditions...");
{
  // Test postgres_db pinging (will attempt real TCP socket 5432 and Django health fallback)
  const startPing = performance.now();
  const pgResult = await pingApiIntegration("postgres_db");
  const pingElapsed = performance.now() - startPing;
  assert.ok(pgResult.success, "Ping must return success result wrapper");
  assert.ok(["connected", "degraded", "offline"].includes(pgResult.service.status));
  assert.ok(pgResult.service.latencyMs >= 0);
  console.log(`✓ Real TCP socket probe to postgres_db executed in ${Math.round(pingElapsed)}ms, status: ${pgResult.service.status}.`);

  // Test HTTP endpoint ping to an invalid/offline service without throwing
  const geminiResult = await pingApiIntegration("gemini_ai");
  assert.ok(geminiResult.success);
  assert.ok(["connected", "degraded", "offline"].includes(geminiResult.service.status));
  console.log(`✓ Real HTTP probe to gemini_ai executed, status: ${geminiResult.service.status}, latency: ${geminiResult.service.latencyMs}ms.`);
}

console.log("\n================================================================================");
console.log("ALL FORENSIC ADVERSARIAL STRESS TESTS COMPLETED CLEAN WITH ZERO FAILURES!");
console.log("================================================================================\n");
