import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MEDIA_PRESET_ASSETS,
  getLearnerEnrollments,
  toggleLessonCompletionState,
  updateLessonQuizScore,
  resetCourseProgress,
  grantCourseEnrollment,
  revokeCourseEnrollment,
  getAcademicAuditLogs,
  saveLessonQuiz,
  getLessonQuiz,
} from "../../apps/web/lib/admin-academics-store.ts";

console.log("Running Academics Store Persistence & Authentic Media Tests...\n");

// Test 1: Authentic Media Presets Verification (Zero Dummy URLs & CSP Compliance)
{
  assert.ok(MEDIA_PRESET_ASSETS.length >= 6, "Expected at least 6 media presets");
  for (const asset of MEDIA_PRESET_ASSETS) {
    assert.ok(
      !asset.videoUrl.includes("commondatastorage.googleapis.com"),
      `Asset ${asset.id} must not contain commondatastorage dummy URL`
    );
    assert.ok(
      !asset.audioUrl.includes("soundhelix.com"),
      `Asset ${asset.id} must not contain soundhelix dummy URL`
    );
    assert.ok(
      asset.videoUrl.startsWith("https://github.com/") || asset.videoUrl.startsWith("/"),
      `Asset ${asset.id} video URL must be CSP-compliant`
    );
    assert.ok(
      asset.audioUrl.startsWith("/audio/") || asset.audioUrl.startsWith("https://"),
      `Asset ${asset.id} audio URL must point to verified audio asset`
    );
    for (const d of asset.downloadables) {
      assert.ok(
        !d.url.startsWith("/downloads/"),
        `Downloadable '${d.title}' must not point to dead /downloads/ URL`
      );
    }
  }
  console.log("✓ Test 1: All preset media assets verified authentic and CSP-compliant.");
}

// Test 2: Enrollment Mutation & Disk Persistence Durability
{
  const testEmail = `test.student.${Date.now()}@endoora.ir`;
  const grantRes = grantCourseEnrollment(
    "دانش‌آموز آزمایشی ماندگاری",
    testEmail,
    "09129998877",
    "course-grade12-tamrin20",
    "دوره دوازدهم نهایی",
    "Grade 12 Mastery",
    "School"
  );
  assert.equal(grantRes.success, true);
  const enrollmentId = grantRes.enrollment.id;

  // Verify record is found in query
  const list = getLearnerEnrollments({ query: testEmail });
  assert.equal(list.length, 1);
  assert.equal(list[0].id, enrollmentId);

  // Verify file written to disk
  const diskPath = path.join(process.cwd(), "apps", "web", "data", "admin", "academics-enrollments.json");
  assert.ok(fs.existsSync(diskPath), "academics-enrollments.json must exist on disk");
  const rawDisk = fs.readFileSync(diskPath, "utf-8");
  assert.ok(rawDisk.includes(testEmail), "Persisted disk file must contain the granted student email");
  console.log("✓ Test 2: Enrollment grant persists durably to disk.");
}

// Test 3: Score Override & Progress Recalculation
{
  const learnerId = "user-101";
  const courseId = "course-ielts-b2";
  const lessonId = "l-ielts-04";

  const res = updateLessonQuizScore(learnerId, courseId, lessonId, 95);
  assert.equal(res.success, true);
  const updatedLesson = res.enrollment?.lessons.find((l) => l.lessonId === lessonId);
  assert.ok(updatedLesson, "Updated lesson must exist in enrollment");
  assert.equal(updatedLesson.quizScore, 95);
  assert.equal(updatedLesson.isCompleted, true);

  // Check audit log recorded and persisted
  const logs = getAcademicAuditLogs();
  assert.ok(logs.some((l) => l.details.includes("95")), "Audit log must record score change to 95%");

  const auditDiskPath = path.join(process.cwd(), "apps", "web", "data", "admin", "academics-audit-logs.json");
  assert.ok(fs.existsSync(auditDiskPath), "academics-audit-logs.json must exist on disk");
  const rawAudit = fs.readFileSync(auditDiskPath, "utf-8");
  assert.ok(rawAudit.includes("UPDATE_SCORE"), "Persisted audit file must contain UPDATE_SCORE event");
  console.log("✓ Test 3: Lesson score override updates progress and records audit trail.");
}

// Test 4: Quiz Persistence
{
  const lessonId = "test-lesson-persisted";
  const mockQuiz = [
    {
      prompt_fa: "تست گرامر زمان گذشته کامل",
      prompt_en: "Past perfect tense diagnostic question",
      options: ["had completed", "has completed", "was completing", "will complete"],
      correct_index: 0,
      explanation_fa: "برای عملی که قبل از عمل دیگری در گذشته رخ داده از Past Perfect استفاده می‌شود.",
    },
  ];
  saveLessonQuiz(lessonId, mockQuiz);
  const loaded = getLessonQuiz(lessonId);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].prompt_fa, "تست گرامر زمان گذشته کامل");

  const quizDiskPath = path.join(process.cwd(), "apps", "web", "data", "admin", "academics-quizzes.json");
  assert.ok(fs.existsSync(quizDiskPath), "academics-quizzes.json must exist on disk");
  const rawQuiz = fs.readFileSync(quizDiskPath, "utf-8");
  assert.ok(rawQuiz.includes("test-lesson-persisted"), "Persisted quiz file must contain test lesson ID");
  console.log("✓ Test 4: Lesson quiz persists to dedicated quiz store.");
}

console.log("\nAll Academics Persistence & Authentic Media tests PASSED successfully!");
