/**
 * E2E Test Suite Assertion Library & Test Registry
 * Endoora Admin Dashboard Verification Harness
 */

export const PASS = "\x1b[32m✔ PASS\x1b[0m";
export const FAIL = "\x1b[31m✖ FAIL\x1b[0m";
export const INFO = "\x1b[36mℹ INFO\x1b[0m";
export const WARN = "\x1b[33m⚠ WARN\x1b[0m";
export const BOLD = "\x1b[1m";
export const RESET = "\x1b[0m";

class AssertionFailedError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = "AssertionFailedError";
    this.expected = expected;
    this.actual = actual;
  }
}

export function expect(actual) {
  return {
    toBe(expected, msg = "") {
      if (actual !== expected) {
        throw new AssertionFailedError(
          msg || `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`,
          expected,
          actual
        );
      }
    },
    toEqual(expected, msg = "") {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new AssertionFailedError(
          msg || `Expected deep equality: actual=${a}, expected=${b}`,
          expected,
          actual
        );
      }
    },
    toBeGreaterThan(expected, msg = "") {
      if (typeof actual !== "number" || actual <= expected) {
        throw new AssertionFailedError(
          msg || `Expected ${actual} > ${expected}`,
          `> ${expected}`,
          actual
        );
      }
    },
    toBeGreaterThanOrEqual(expected, msg = "") {
      if (typeof actual !== "number" || actual < expected) {
        throw new AssertionFailedError(
          msg || `Expected ${actual} >= ${expected}`,
          `>= ${expected}`,
          actual
        );
      }
    },
    toBeLessThan(expected, msg = "") {
      if (typeof actual !== "number" || actual >= expected) {
        throw new AssertionFailedError(
          msg || `Expected ${actual} < ${expected}`,
          `< ${expected}`,
          actual
        );
      }
    },
    toBeLessThanOrEqual(expected, msg = "") {
      if (typeof actual !== "number" || actual > expected) {
        throw new AssertionFailedError(
          msg || `Expected ${actual} <= ${expected}`,
          `<= ${expected}`,
          actual
        );
      }
    },
    toBeTruthy(msg = "") {
      if (!actual) {
        throw new AssertionFailedError(
          msg || `Expected truthy value, got ${JSON.stringify(actual)}`,
          true,
          actual
        );
      }
    },
    toBeFalsy(msg = "") {
      if (actual) {
        throw new AssertionFailedError(
          msg || `Expected falsy value, got ${JSON.stringify(actual)}`,
          false,
          actual
        );
      }
    },
    toContain(item, msg = "") {
      if (typeof actual === "string") {
        if (!actual.includes(item)) {
          throw new AssertionFailedError(
            msg || `Expected string "${actual}" to contain "${item}"`,
            item,
            actual
          );
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(item)) {
          throw new AssertionFailedError(
            msg || `Expected array to contain ${JSON.stringify(item)}`,
            item,
            actual
          );
        }
      } else {
        throw new AssertionFailedError(
          msg || `Expected iterable containing ${JSON.stringify(item)}`,
          item,
          actual
        );
      }
    },
  };
}

export function createRegistry(suiteName) {
  const tests = [];

  return {
    test(name, fn) {
      tests.push({ name, fn });
    },
    async run() {
      console.log(`\n${BOLD}=================================================================================${RESET}`);
      console.log(`${BOLD}   RUNNING: ${suiteName}${RESET}`);
      console.log(`${BOLD}=================================================================================${RESET}\n`);

      let passed = 0;
      let failed = 0;
      const failures = [];

      for (const t of tests) {
        try {
          await t.fn();
          passed++;
          console.log(`  ${PASS} ${t.name}`);
        } catch (err) {
          failed++;
          console.log(`  ${FAIL} ${t.name}`);
          console.log(`       \x1b[31mError: ${err.message}\x1b[0m`);
          failures.push({ name: t.name, error: err.message });
        }
      }

      console.log(`\n  ${BOLD}Results for ${suiteName}:${RESET} ${passed} passed, ${failed} failed (Total: ${tests.length})`);
      return { total: tests.length, passed, failed, failures };
    },
  };
}
