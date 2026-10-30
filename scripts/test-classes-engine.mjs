import {
  INITIAL_COHORTS,
  verifyPlacementRequirement,
  enrollInCohort,
  getLiveCohorts,
  saveLiveCohorts,
} from "../apps/web/lib/classes-storage.ts";

console.log("=== RUNNING LIVE CLASSES & COHORTS ENGINE VERIFICATION ===");

// 1. Verify Seeded Cohorts Count & Integrity
if (!Array.isArray(INITIAL_COHORTS) || INITIAL_COHORTS.length < 8) {
  throw new Error(`Expected at least 8 initial cohorts, got ${INITIAL_COHORTS?.length}`);
}
console.log(`✓ Pre-seeded cohorts catalog: ${INITIAL_COHORTS.length} authentic classes loaded.`);

// 2. Validate Every Cohort's Schema and Constraints
const validCategories = ["ielts", "fluency", "starter", "business", "highschool", "phonetics", "debate"];
const validLevels = ["A1", "A2", "B1", "B2", "C1", "All"];
const validFormats = ["group", "solo"];

for (const cohort of INITIAL_COHORTS) {
  if (!cohort.id || !cohort.titleFa || !cohort.titleEn) {
    throw new Error(`Cohort missing core identity: ${JSON.stringify(cohort)}`);
  }
  if (!validCategories.includes(cohort.category)) {
    throw new Error(`Invalid category ${cohort.category} in cohort ${cohort.id}`);
  }
  if (!validLevels.includes(cohort.levelRequired)) {
    throw new Error(`Invalid levelRequired ${cohort.levelRequired} in cohort ${cohort.id}`);
  }
  if (!validFormats.includes(cohort.format)) {
    throw new Error(`Invalid format ${cohort.format} in cohort ${cohort.id}`);
  }
  if (!cohort.teacher || !cohort.teacher.nameFa || cohort.teacher.rating < 4.0) {
    throw new Error(`Invalid teacher profile in cohort ${cohort.id}`);
  }
  if (!cohort.scheduleDays || cohort.scheduleDays.length === 0 || !cohort.scheduleTime) {
    throw new Error(`Invalid schedule in cohort ${cohort.id}`);
  }
  if (typeof cohort.priceToman !== "number" || cohort.priceToman <= 0) {
    throw new Error(`Invalid price in cohort ${cohort.id}`);
  }
  if (cohort.enrolledCount > cohort.maxCapacity) {
    throw new Error(`Capacity overflow in cohort ${cohort.id}`);
  }
  if (!cohort.bookingId.startsWith("booking-")) {
    throw new Error(`Invalid classroom studio bookingId in cohort ${cohort.id}`);
  }
}
console.log("✓ All 8 cohorts adhere strictly to LiveClassCohort schema and contracts.");

// 3. Test Placement Gate Logic (Requirement #3)
console.log("\n--- Testing Mandatory Placement Gate ---");

// Case 3.1: "All" level requires no placement
const checkAll = verifyPlacementRequirement("All", null);
if (!checkAll.allowed) {
  throw new Error("Cohort with level 'All' should allow unplaced users.");
}
console.log("✓ Level 'All' allowed unplaced user correctly.");

// Case 3.2: Level B2 with unplaced user (null) -> BLOCKED
const checkUnplaced = verifyPlacementRequirement("B2", null);
if (checkUnplaced.allowed || checkUnplaced.reason !== "unplaced") {
  throw new Error("Unplaced user should be blocked from B2 cohort with reason 'unplaced'.");
}
console.log("✓ Unplaced user blocked with friendly placement gate prompt.");

// Case 3.3: Level B2 with user level A1 -> BLOCKED (level_too_low)
const checkA1 = verifyPlacementRequirement("B2", "A1");
if (checkA1.allowed || checkA1.reason !== "level_too_low") {
  throw new Error("A1 user should be blocked from B2 cohort with reason 'level_too_low'.");
}
console.log("✓ Under-qualified user (A1) blocked from B2 cohort with reason 'level_too_low'.");

// Case 3.4: Level B2 with user level B1 -> BLOCKED (level_too_low)
const checkB1 = verifyPlacementRequirement("B2", "B1");
if (checkB1.allowed || checkB1.reason !== "level_too_low") {
  throw new Error("B1 user should be blocked from B2 cohort with reason 'level_too_low'.");
}
console.log("✓ Under-qualified user (B1) blocked from B2 cohort.");

// Case 3.5: Level B2 with user level B2 -> ALLOWED
const checkB2 = verifyPlacementRequirement("B2", "B2");
if (!checkB2.allowed) {
  throw new Error("B2 user should be allowed into B2 cohort.");
}
console.log("✓ Qualified user (B2) admitted to B2 cohort.");

// Case 3.6: Level B2 with user level C1 -> ALLOWED
const checkC1 = verifyPlacementRequirement("B2", "C1");
if (!checkC1.allowed) {
  throw new Error("C1 user should be allowed into B2 cohort.");
}
console.log("✓ Higher qualified user (C1) admitted to B2 cohort.");

// 4. Test Enrollment Flow & Capacity Updates
console.log("\n--- Testing Enrollment Mechanism ---");

// Mock in-memory localStorage for Node environment if needed
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

// Ensure clean state
saveLiveCohorts(JSON.parse(JSON.stringify(INITIAL_COHORTS)));

// Test invalid cohort enrollment
const invalidResult = enrollInCohort("non-existent-id", "یادداشت");
if (invalidResult.success) {
  throw new Error("Enrollment should fail for non-existent cohort ID.");
}
console.log("✓ Invalid cohort ID rejected gracefully.");

// Test successful enrollment
const targetCohort = INITIAL_COHORTS.find((c) => c.id === "cohort-fluency-slang-2");
if (!targetCohort) throw new Error("Target cohort not found");
const initialEnrolled = targetCohort.enrolledCount;

const enrollmentResult = enrollInCohort("cohort-fluency-slang-2", "تمرکز روی Idioms");
if (!enrollmentResult.success || !enrollmentResult.record) {
  throw new Error(`Enrollment failed: ${enrollmentResult.error}`);
}

if (enrollmentResult.record.cohortId !== "cohort-fluency-slang-2") {
  throw new Error("Enrollment record cohortId mismatch.");
}
if (!enrollmentResult.record.nextSessionTextFa) {
  throw new Error("Enrollment record missing nextSessionTextFa.");
}
if (enrollmentResult.record.bookingId !== targetCohort.bookingId) {
  throw new Error("Enrollment record bookingId mismatch with Classroom Studio.");
}

// Verify updated cohort capacity in storage
const updatedCohorts = getLiveCohorts();
const updated = updatedCohorts.find((c) => c.id === "cohort-fluency-slang-2");
if (!updated || updated.enrolledCount !== initialEnrolled + 1) {
  throw new Error(`Capacity did not increment correctly: expected ${initialEnrolled + 1}, got ${updated?.enrolledCount}`);
}
console.log(`✓ Successful enrollment updated seat count (${initialEnrolled} -> ${updated.enrolledCount}) and generated digital pass.`);

console.log("\n=== ALL LIVE CLASSES & COHORTS TESTS PASSED SUCCESSFULLY! ===");
