/**
 * Opaque-Box E2E Test Suite Assertion Library & Test Registry
 * Endoora Proprietary Adaptive Placement Testing System
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
    toBeCloseTo(expected, delta = 0.05, msg = "") {
      if (Math.abs(actual - expected) > delta) {
        throw new AssertionFailedError(
          msg || `Expected ${actual} to be close to ${expected} (within ${delta})`,
          expected,
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
        throw new AssertionFailedError("toContain requires string or array", item, actual);
      }
    },
    not: {
      toContain(item, msg = "") {
        if (typeof actual === "string" && actual.includes(item)) {
          throw new AssertionFailedError(
            msg || `Expected string not to contain "${item}"`,
            `NOT "${item}"`,
            actual
          );
        } else if (Array.isArray(actual) && actual.includes(item)) {
          throw new AssertionFailedError(
            msg || `Expected array not to contain ${JSON.stringify(item)}`,
            `NOT ${JSON.stringify(item)}`,
            actual
          );
        }
      },
      toMatch(regex, msg = "") {
        if (regex.test(String(actual))) {
          throw new AssertionFailedError(
            msg || `Expected "${actual}" NOT to match pattern ${regex}`,
            `NOT ${regex}`,
            actual
          );
        }
      },
      toBe(expected, msg = "") {
        if (actual === expected) {
          throw new AssertionFailedError(
            msg || `Expected ${JSON.stringify(actual)} NOT to be ${JSON.stringify(expected)}`,
            `NOT ${expected}`,
            actual
          );
        }
      },
    },
    toMatch(regex, msg = "") {
      if (!regex.test(String(actual))) {
        throw new AssertionFailedError(
          msg || `Expected "${actual}" to match pattern ${regex}`,
          regex.toString(),
          actual
        );
      }
    },
  };
}

export class TestRegistry {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.tests = [];
  }

  register(tier, featureId, testId, description, fn) {
    this.tests.push({
      tier,
      featureId,
      testId,
      description,
      fn,
    });
  }

  async run(filter = {}) {
    const results = {
      suiteName: this.suiteName,
      total: 0,
      passed: 0,
      failed: 0,
      testCases: [],
    };

    for (const t of this.tests) {
      if (filter.tier && t.tier !== filter.tier) continue;
      if (filter.featureId && t.featureId !== filter.featureId) continue;

      results.total++;
      const startTime = Date.now();
      try {
        await t.fn();
        const duration = Date.now() - startTime;
        results.passed++;
        results.testCases.push({
          ...t,
          status: "PASS",
          duration,
        });
      } catch (err) {
        const duration = Date.now() - startTime;
        results.failed++;
        results.testCases.push({
          ...t,
          status: "FAIL",
          duration,
          error: err.message,
          expected: err.expected,
          actual: err.actual,
        });
      }
    }

    return results;
  }
}
