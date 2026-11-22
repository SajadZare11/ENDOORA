#!/usr/bin/env node

/**
 * Master E2E Test Suite Runner
 * Endoora Admin Dashboard Verification & Forensic Audit Harness
 * Executes Tiers 1-4 across all 16 Acceptance Criteria with 100% verification.
 */

import process from "node:process";
import { registry as tier1Registry } from "./tier1-route-health.test.mjs";
import { registry as tier2Registry } from "./tier2-interactive-controls.test.mjs";
import { registry as tier3Registry } from "./tier3-mutations-authenticity.test.mjs";
import { registry as tier4Registry } from "./tier4-security-adversarial.test.mjs";
import { PASS, FAIL, INFO, WARN, BOLD, RESET } from "./helpers/assertions.mjs";

async function main() {
  const startTime = Date.now();

  console.log(`${BOLD}=================================================================================${RESET}`);
  console.log(`${BOLD}   Endoora Admin Dashboard Full Verification Suite: Master E2E Test Harness     ${RESET}`);
  console.log(`${BOLD}   Authoritative Specification: R1–R3 | Acceptance Criteria Tiers 1–4           ${RESET}`);
  console.log(`${BOLD}=================================================================================${RESET}\n`);

  const suites = [
    { name: "Tier 1: Admin Routes & Page Health", registry: tier1Registry },
    { name: "Tier 2: Interactive Controls & Components", registry: tier2Registry },
    { name: "Tier 3: Data Mutations & Store Authenticity", registry: tier3Registry },
    { name: "Tier 4: Security, RBAC & Adversarial Defenses", registry: tier4Registry },
  ];

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;
  const tierResults = {};
  const allFailures = [];

  for (const suite of suites) {
    const res = await suite.registry.run();
    totalChecks += res.total;
    passedChecks += res.passed;
    failedChecks += res.failed;
    tierResults[suite.name] = res;
    if (res.failures && res.failures.length > 0) {
      allFailures.push(...res.failures);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${BOLD}=================================================================================${RESET}`);
  console.log(`${BOLD}                         MASTER EXECUTION SUMMARY                                ${RESET}`);
  console.log(`${BOLD}=================================================================================${RESET}`);
  console.log(`  Total Checks Executed : ${BOLD}${totalChecks}${RESET}`);
  console.log(`  Passed Checks         : \x1b[32m${passedChecks}${RESET}`);
  console.log(`  Failed Checks         : ${failedChecks > 0 ? "\x1b[31m" : "\x1b[32m"}${failedChecks}${RESET}`);
  console.log(`  Pass Rate             : ${BOLD}${((passedChecks / totalChecks) * 100).toFixed(1)}%${RESET}`);
  console.log(`  Duration              : ${durationSec}s\n`);

  console.log(`${BOLD}--- TIER BREAKDOWN ---${RESET}`);
  for (const [name, res] of Object.entries(tierResults)) {
    const status = res.failed === 0 ? "\x1b[32m✔ PASS\x1b[0m" : "\x1b[31m✖ FAIL\x1b[0m";
    console.log(`  ${status} ${name.padEnd(46)}: ${res.passed}/${res.total} (${((res.passed / res.total) * 100).toFixed(0)}%)`);
  }

  if (failedChecks > 0) {
    console.log(`\n\x1b[31m${BOLD}FAILURES DETECTED (${failedChecks}):${RESET}`);
    for (const f of allFailures) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
    console.log(`\n${BOLD}=================================================================================${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`\n\x1b[32m${BOLD}🏆 ALL TIERS PASSED WITH ZERO FAILURES! 100% ACCEPTANCE CRITERIA SATISFIED.${RESET}`);
    console.log(`${BOLD}=================================================================================${RESET}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
