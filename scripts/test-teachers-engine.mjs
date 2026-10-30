import {
  fetchPublicTeachers,
  fetchTeacherPublicProfile,
  fetchTeacherAvailableSlots,
  fetchTeacherReviews,
} from "../apps/web/lib/marketplace.ts";
import { FALLBACK_TEACHERS } from "../apps/web/lib/teachers-fallback-data.ts";

console.log("=== RUNNING TEACHERS DIRECTORY ENGINE VERIFICATION ===");

// 1. Verify Fallback Teachers Count
if (!Array.isArray(FALLBACK_TEACHERS) || FALLBACK_TEACHERS.length < 8) {
  throw new Error(`Expected at least 8 fallback teachers, got ${FALLBACK_TEACHERS?.length}`);
}
console.log(`✓ ${FALLBACK_TEACHERS.length} authentic pre-seeded teachers loaded.`);

// 2. Test fetchPublicTeachers without params
const allResult = await fetchPublicTeachers();
if (!allResult || allResult.count !== 8 || allResult.teachers.length !== 8) {
  throw new Error(`fetchPublicTeachers failed: expected 8 teachers, got ${allResult?.count}`);
}
console.log(`✓ fetchPublicTeachers default returned ${allResult.teachers.length} teachers.`);

// 3. Test Skill Filtering (e.g. IELTS)
const ieltsResult = await fetchPublicTeachers({ skill: "ielts_prep" });
if (!ieltsResult || ieltsResult.teachers.length === 0) {
  throw new Error("No teachers found for skill ielts_prep");
}
for (const t of ieltsResult.teachers) {
  if (!t.specialties.some((s) => s.includes("آیلتس"))) {
    throw new Error(`Teacher ${t.name} does not have IELTS specialty`);
  }
}
console.log(`✓ Skill filter for IELTS returned ${ieltsResult.teachers.length} qualified instructors.`);

// 4. Test Search Filtering (e.g. "رضایی")
const searchResult = await fetchPublicTeachers({ search: "رضایی" });
if (!searchResult || searchResult.teachers.length !== 1 || searchResult.teachers[0].id !== "t-rezaei") {
  throw new Error(`Search failed for 'رضایی': got ${searchResult?.teachers?.length}`);
}
console.log("✓ Search filter returned correct instructor (استاد کاوه رضایی).");

// 5. Test Rate Sorting (Ascending)
const ascResult = await fetchPublicTeachers({ sort_by: "rate_asc" });
const rates = ascResult.teachers.map((t) => t.hourly_rate_toman);
for (let i = 1; i < rates.length; i++) {
  if (rates[i] < rates[i - 1]) {
    throw new Error(`rate_asc sorting failed: ${rates.join(", ")}`);
  }
}
console.log(`✓ Sorting by rate_asc verified: min ${rates[0]} to max ${rates[rates.length - 1]}.`);

// 6. Test Profile Retrieval
const profile = await fetchTeacherPublicProfile("t-rezaei");
if (!profile || profile.id !== "t-rezaei" || !profile.certifications || profile.certifications.length === 0) {
  throw new Error("fetchTeacherPublicProfile failed for t-rezaei");
}
if (!profile.education || !profile.reviews || profile.reviews.length === 0) {
  throw new Error("t-rezaei profile missing education or reviews");
}
console.log(`✓ Detailed profile for ${profile.name} verified with ${profile.certifications.length} certifications and reviews.`);

// 7. Test Available Slots
const slotsData = await fetchTeacherAvailableSlots("t-rezaei");
if (!slotsData || !slotsData.success || !Array.isArray(slotsData.days) || slotsData.days.length === 0) {
  throw new Error("fetchTeacherAvailableSlots failed for t-rezaei");
}
console.log(`✓ Schedule retrieval verified: ${slotsData.days.length} bookable days with ${slotsData.total_slots} slots.`);

console.log("\n=== ALL TEACHERS DIRECTORY TESTS PASSED SUCCESSFULLY! ===");
