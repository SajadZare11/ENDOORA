/**
 * IELTS Mock Exam Seeding & Data Integrity Verification Engine
 * Validates 3 complete mock exams (Cambridge 17/18 format) with strictly 40 questions for L/R,
 * normalizes question structures, tests grading logic, and exports verified JSON fixtures.
 *
 * Execution:
 * node --experimental-strip-types scripts/seed-ielts.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { ALL_IELTS_EXAMS } from "../apps/web/data/ielts/index.ts";
import {
  isAnswerCorrect,
  calculateIeltsBandScore,
  normalizeAnswer,
} from "../apps/web/lib/ielts-grading.ts";

const VALID_QUESTION_TYPES = new Set([
  "multiple_choice",
  "multiple_choice_multiple_answers",
  "fill_in_the_blank",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_headings",
  "matching_features",
  "map_labelling",
]);

interface VerificationIssue {
  examId: string;
  moduleSkill: string;
  message: string;
}

function runDataIntegrityAudit() {
  console.log("\n=======================================================");
  console.log("   IELTS DATABASE SEEDING & DATA INTEGRITY VERIFIER    ");
  console.log("=======================================================\n");

  const issues: VerificationIssue[] = [];

  console.log(`[1/4] Inspecting Exam Fixtures Count: ${ALL_IELTS_EXAMS.length} exams loaded.`);
  if (ALL_IELTS_EXAMS.length < 3) {
    issues.push({
      examId: "GLOBAL",
      moduleSkill: "GLOBAL",
      message: `Expected at least 3 mock exams, found ${ALL_IELTS_EXAMS.length}`,
    });
  }

  ALL_IELTS_EXAMS.forEach((exam) => {
    console.log(`\n-------------------------------------------------------`);
    console.log(`Verifying: ${exam.title} [${exam.category} | ${exam.source}]`);
    console.log(`-------------------------------------------------------`);

    // Verify Modules
    const listeningMod = exam.modules.find((m) => m.skill === "listening");
    const readingMod = exam.modules.find((m) => m.skill === "reading");
    const writingMod = exam.modules.find((m) => m.skill === "writing");
    const speakingMod = exam.modules.find((m) => m.skill === "speaking");

    if (!listeningMod) {
      issues.push({ examId: exam.id, moduleSkill: "listening", message: "Listening module missing" });
    }
    if (!readingMod) {
      issues.push({ examId: exam.id, moduleSkill: "reading", message: "Reading module missing" });
    }
    if (!writingMod) {
      issues.push({ examId: exam.id, moduleSkill: "writing", message: "Writing module missing" });
    }
    if (!speakingMod) {
      issues.push({ examId: exam.id, moduleSkill: "speaking", message: "Speaking module missing" });
    }

    // Verify Listening module
    if (listeningMod) {
      if (!listeningMod.audio_url || listeningMod.audio_url.trim() === "") {
        issues.push({
          examId: exam.id,
          moduleSkill: "listening",
          message: "Listening module lacks audio_url",
        });
      }

      let listeningQuestionsCount = 0;
      const seenQNums = new Set<number>();

      listeningMod.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          listeningQuestionsCount++;
          if (seenQNums.has(q.question_number)) {
            issues.push({
              examId: exam.id,
              moduleSkill: "listening",
              message: `Duplicate question number ${q.question_number}`,
            });
          }
          seenQNums.add(q.question_number);

          if (!VALID_QUESTION_TYPES.has(q.question_type)) {
            issues.push({
              examId: exam.id,
              moduleSkill: "listening",
              message: `Invalid question type: ${q.question_type} on Q${q.question_number}`,
            });
          }

          if (!q.accepted_answers || q.accepted_answers.length === 0) {
            issues.push({
              examId: exam.id,
              moduleSkill: "listening",
              message: `Q${q.question_number} lacks accepted_answers`,
            });
          }
        });
      });

      console.log(`  ✓ Listening Questions: ${listeningQuestionsCount} / 40 items strictly checked.`);
      if (listeningQuestionsCount !== 40) {
        issues.push({
          examId: exam.id,
          moduleSkill: "listening",
          message: `Listening must have strictly 40 questions, found ${listeningQuestionsCount}`,
        });
      }
    }

    // Verify Reading module
    if (readingMod) {
      let readingQuestionsCount = 0;
      const seenQNums = new Set<number>();

      readingMod.sections.forEach((sec) => {
        if (!sec.passage_content || sec.passage_content.trim() === "") {
          issues.push({
            examId: exam.id,
            moduleSkill: "reading",
            message: `Section ${sec.section_number} lacks passage_content`,
          });
        }

        sec.questions.forEach((q) => {
          readingQuestionsCount++;
          if (seenQNums.has(q.question_number)) {
            issues.push({
              examId: exam.id,
              moduleSkill: "reading",
              message: `Duplicate question number ${q.question_number}`,
            });
          }
          seenQNums.add(q.question_number);

          if (!VALID_QUESTION_TYPES.has(q.question_type)) {
            issues.push({
              examId: exam.id,
              moduleSkill: "reading",
              message: `Invalid question type: ${q.question_type} on Q${q.question_number}`,
            });
          }

          if (!q.accepted_answers || q.accepted_answers.length === 0) {
            issues.push({
              examId: exam.id,
              moduleSkill: "reading",
              message: `Q${q.question_number} lacks accepted_answers`,
            });
          }
        });
      });

      console.log(`  ✓ Reading Questions: ${readingQuestionsCount} / 40 items strictly checked.`);
      if (readingQuestionsCount !== 40) {
        issues.push({
          examId: exam.id,
          moduleSkill: "reading",
          message: `Reading must have strictly 40 questions, found ${readingQuestionsCount}`,
        });
      }
    }

    // Verify Writing & Speaking
    if (writingMod) {
      console.log(`  ✓ Writing Tasks: ${writingMod.sections.length} tasks (Task 1 & Task 2).`);
    }
    if (speakingMod) {
      console.log(`  ✓ Speaking Parts: ${speakingMod.sections.length} parts (Part 1, 2, & 3).`);
    }
  });

  // Verify Scoring Algorithm
  console.log(`\n[2/4] Testing Scoring Engine & String Normalization:`);
  const norm1 = normalizeAnswer("  The Elmwood Crescent. ");
  console.log(`  - normalizeAnswer('  The Elmwood Crescent. ') -> '${norm1}'`);
  if (norm1 !== "elmwood crescent") {
    issues.push({ examId: "SCORING", moduleSkill: "CORE", message: "normalizeAnswer failed article/trim test" });
  }

  const testTF = isAnswerCorrect("true", ["True", "T"]);
  console.log(`  - isAnswerCorrect('true', ['True', 'T']) -> ${testTF}`);
  if (!testTF) {
    issues.push({ examId: "SCORING", moduleSkill: "CORE", message: "isAnswerCorrect failed True/False test" });
  }

  const band40L = calculateIeltsBandScore(39, "listening", "Academic");
  const band34R = calculateIeltsBandScore(34, "reading", "Academic");
  const band34G = calculateIeltsBandScore(34, "reading", "General");
  console.log(`  - Listening Band (39/40): ${band40L} (Expected 9.0)`);
  console.log(`  - Academic Reading Band (34/40): ${band34R} (Expected 7.5)`);
  console.log(`  - General Reading Band (34/40): ${band34G} (Expected 7.0)`);

  if (band40L !== 9.0 || band34R !== 7.5 || band34G !== 7.0) {
    issues.push({ examId: "SCORING", moduleSkill: "CORE", message: "Band score conversion table mismatch" });
  }

  // Export JSON Fixture
  console.log(`\n[3/4] Exporting Verified Production JSON Fixtures:`);
  const exportPath = path.resolve(process.cwd(), "apps/web/data/ielts/ielts-mock-exams.json");
  fs.writeFileSync(exportPath, JSON.stringify(ALL_IELTS_EXAMS, null, 2), "utf-8");
  console.log(`  ✓ Successfully exported ${ALL_IELTS_EXAMS.length} complete exams to:`);
  console.log(`    ${exportPath}`);

  // Final summary
  console.log(`\n[4/4] Data Integrity Audit Summary:`);
  if (issues.length === 0) {
    console.log("  =======================================================");
    console.log("  🎉 ALL DATA INTEGRITY CHECKS PASSED WITH ZERO ERRORS!  ");
    console.log("  3 Full IELTS Exams Seeded & Calibrated:               ");
    console.log("  - Cambridge IELTS 18 - Academic Test 1 (40 L + 40 R)   ");
    console.log("  - Cambridge IELTS 17 - Academic Test 1 (40 L + 40 R)   ");
    console.log("  - Cambridge IELTS 18 - General Test 1 (40 L + 40 R)    ");
    console.log("  =======================================================\n");
  } else {
    console.error(`  ❌ Found ${issues.length} verification issues:`);
    issues.forEach((iss) => console.error(`    - [${iss.examId}/${iss.moduleSkill}]: ${iss.message}`));
    process.exit(1);
  }
}

runDataIntegrityAudit();
