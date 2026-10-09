#!/usr/bin/env node

/**
 * Master E2E Test Suite Runner
 * Endoora Proprietary Adaptive Placement Testing System
 * Executes Tiers 1-4 across all 19 features with diagnostic itemization.
 */

import process from "node:process";
import { registry as tier1Registry } from "./tier1-feature-coverage.test.mjs";
import { registry as tier2Registry } from "./tier2-boundary-corner-cases.test.mjs";
import { registry as tier3Registry } from "./tier3-pairwise-combinations.test.mjs";
import { registry as tier4Registry } from "./tier4-real-world-scenarios.test.mjs";
import { PASS, FAIL, INFO, WARN, BOLD, RESET } from "./helpers/assertions.mjs";

const args = process.argv.slice(2);
const isJsonOutput = args.includes("--json");
const isSoftFail = args.includes("--soft-fail");
const tierArg = args.find((a) => a.startsWith("--tier="))?.split("=")[1];
const featureArg = args.find((a) => a.startsWith("--feature="))?.split("=")[1];

async function main() {
  const startTime = Date.now();

  if (!isJsonOutput) {
    console.log(`${BOLD}=================================================================================${RESET}`);
    console.log(`${BOLD}   Endoora Proprietary Adaptive Placement Testing System: E2E Test Harness      ${RESET}`);
    console.log(`${BOLD}   Authoritative Specification: R1–R6 | 4 Tiers | 19 Features                   ${RESET}`);
    console.log(`${BOLD}=================================================================================${RESET}\n`);
  }

  const filter = {};
  if (tierArg) filter.tier = `Tier ${tierArg}`;
  if (featureArg) filter.featureId = featureArg;

  const suites = [
    { name: "Tier 1: Feature Coverage", registry: tier1Registry },
    { name: "Tier 2: Boundary & Corner Cases", registry: tier2Registry },
    { name: "Tier 3: Pairwise Combinations", registry: tier3Registry },
    { name: "Tier 4: Real-World Application Scenarios", registry: tier4Registry },
  ];

  const overallResults = {
    timestamp: new Date().toISOString(),
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    durationMs: 0,
    tierBreakdown: {},
    failures: [],
  };

  for (const suite of suites) {
    const res = await suite.registry.run(filter);
    if (res.total === 0) continue;

    overallResults.totalChecks += res.total;
    overallResults.passedChecks += res.passed;
    overallResults.failedChecks += res.failed;
    overallResults.tierBreakdown[suite.name] = {
      total: res.total,
      passed: res.passed,
      failed: res.failed,
    };

    if (!isJsonOutput) {
      console.log(`${BOLD}--- ${suite.name} (${res.passed}/${res.total} passed) ---${RESET}`);
      for (const tc of res.testCases) {
        if (tc.status === "PASS") {
          console.log(`  ${PASS} [${tc.testId}] ${tc.description} (${tc.duration}ms)`);
        } else {
          console.log(`  ${FAIL} [${tc.testId}] ${tc.description} (${tc.duration}ms)`);
          console.log(`        \x1b[31m-> ${tc.error}\x1b[0m`);
          overallResults.failures.push({
            tier: tc.tier,
            featureId: tc.featureId,
            testId: tc.testId,
            description: tc.description,
            error: tc.error,
            expected: tc.expected,
            actual: tc.actual,
          });
        }
      }
      console.log("");
    } else {
      for (const tc of res.testCases) {
        if (tc.status === "FAIL") {
          overallResults.failures.push({
            tier: tc.tier,
            featureId: tc.featureId,
            testId: tc.testId,
            description: tc.description,
            error: tc.error,
            expected: tc.expected,
            actual: tc.actual,
          });
        }
      }
    }
  }

  overallResults.durationMs = Date.now() - startTime;

  if (isJsonOutput) {
    console.log(JSON.stringify(overallResults, null, 2));
  } else {
    console.log(`${BOLD}=================================================================================${RESET}`);
    console.log(`${BOLD}                           E2E TEST EXECUTION SUMMARY                            ${RESET}`);
    console.log(`${BOLD}=================================================================================${RESET}`);
    console.log(`Total Checks Executed : ${overallResults.totalChecks}`);
    console.log(`Passed Checks         : \x1b[32m${overallResults.passedChecks}\x1b[0m`);
    console.log(`Failed Checks         : ${overallResults.failedChecks > 0 ? `\x1b[31m${overallResults.failedChecks}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
    console.log(`Execution Duration    : ${overallResults.durationMs}ms`);
    console.log("---------------------------------------------------------------------------------");
    console.log("Tier Breakdown:");
    for (const [tierName, stats] of Object.entries(overallResults.tierBreakdown)) {
      const statusStr = stats.failed === 0 ? `\x1b[32m✔ PASS\x1b[0m` : `\x1b[31m✖ ${stats.failed} DEFECTS\x1b[0m`;
      console.log(`  - ${tierName.padEnd(42)} : ${stats.passed}/${stats.total} [${statusStr}]`);
    }
    console.log("=================================================================================\n");

    if (overallResults.failures.length > 0) {
      console.log(`${BOLD}\x1b[33mItemized Implementation Gaps & Defects to Escalate:\x1b[0m${RESET}`);
      overallResults.failures.forEach((f, idx) => {
        console.log(`  ${idx + 1}. [${f.testId}] (${f.featureId}): ${f.description}`);
        console.log(`     Error: ${f.error}`);
      });
      console.log("");
    }
  }

  if (overallResults.failedChecks > 0 && !isSoftFail) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Test runner encountered fatal error:", err);
  process.exit(2);
});
