import {
  getDefaultStarterSession,
  ERROR_CATEGORIES,
  getCategoryLabelFa,
} from "../apps/web/lib/classroom-studio-storage.ts";

console.log("=== RUNNING CLASSROOM STUDIO INTEGRATION VERIFICATION ===");

// 1. Verify Error Categories
if (!Array.isArray(ERROR_CATEGORIES) || ERROR_CATEGORIES.length < 5) {
  throw new Error(`Expected at least 5 error categories, got ${ERROR_CATEGORIES?.length}`);
}
console.log(`✓ ${ERROR_CATEGORIES.length} Error categories verified: ${ERROR_CATEGORIES.map(c => c.id).join(", ")}`);

// 2. Verify Category Label Resolution
const grammarLabel = getCategoryLabelFa("grammar");
if (!grammarLabel.includes("دستور زبان")) {
  throw new Error(`Failed to resolve label for grammar: got ${grammarLabel}`);
}
const l1Label = getCategoryLabelFa("l1_persian");
if (!l1Label.includes("تداخل فارسی")) {
  throw new Error(`Failed to resolve label for l1_persian: got ${l1Label}`);
}
console.log(`✓ Bilingual category mapping verified.`);

// 3. Verify Default Starter Session Contract
const testBookingId = "test-booking-998877";
const starter = getDefaultStarterSession(testBookingId);

if (starter.bookingId !== testBookingId) {
  throw new Error(`Booking ID mismatch: expected ${testBookingId}, got ${starter.bookingId}`);
}
if (!starter.teacherName || !starter.learnerName || !starter.skillNameFa) {
  throw new Error(`Missing session parties or skill title`);
}
if (starter.durationMinutes !== 45) {
  throw new Error(`Expected default 45m duration, got ${starter.durationMinutes}`);
}
if (!starter.notesMarkdown || starter.notesMarkdown.trim().length === 0) {
  throw new Error(`Starter session must have initial notesMarkdown`);
}

// 4. Verify Agenda Milestones
if (!Array.isArray(starter.agenda) || starter.agenda.length < 4) {
  throw new Error(`Agenda must have at least 4 phases, got ${starter.agenda?.length}`);
}
for (const item of starter.agenda) {
  if (!item.id || !item.titleFa || typeof item.durationMinutes !== "number") {
    throw new Error(`Invalid agenda item: ${JSON.stringify(item)}`);
  }
}
console.log(`✓ ${starter.agenda.length} Phased agenda milestones verified.`);

// 5. Verify Initial Errors & Vocab
if (!Array.isArray(starter.loggedErrors) || starter.loggedErrors.length === 0) {
  throw new Error(`Starter session must contain demonstration errors`);
}
for (const err of starter.loggedErrors) {
  if (!err.id || !err.category || !err.learnerSpoke || !err.nativeCorrection || !err.explanationFa) {
    throw new Error(`Invalid logged error contract: ${JSON.stringify(err)}`);
  }
}
console.log(`✓ ${starter.loggedErrors.length} Initial error corrections verified.`);

if (!Array.isArray(starter.vocabItems) || starter.vocabItems.length === 0) {
  throw new Error(`Starter session must contain demonstration vocabulary`);
}
for (const v of starter.vocabItems) {
  if (!v.id || !v.wordEn || !v.meaningFa) {
    throw new Error(`Invalid vocab item: ${JSON.stringify(v)}`);
  }
}
console.log(`✓ ${starter.vocabItems.length} Initial golden vocab items verified.`);

console.log("=== ALL CLASSROOM STUDIO TESTS PASSED SUCCESSFULLY! ===");
