import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const dataDir = path.join(root, "apps", "web", "data", "highschool", "tamrin20");
const publicDir = path.join(root, "apps", "web", "public");

const lessons = [1, 2, 3];
const skills = ["listening", "vocabulary", "grammar", "reading", "writing"];

console.log("======================================================================");
console.log("🚀 STARTING ADVERSARIAL STRESS PROBE: 'تمرین تا ۲۰' DATA & CONTRACTS");
console.log("======================================================================\n");

const anomalies = [];
const warnings = [];

let totalQuestions = 0;
let totalInitial = 0;
let totalProgressive = 0;
const promptMap = new Map();
const mcqAnswerDist = { 0: 0, 1: 0, 2: 0, 3: 0, other: 0 };
const explanationLengths = [];
const audioFilesReferenced = new Set();
const questionTypeDist = {};

// Suspect keywords for dummy/mock/cheating data
// Note: Some words like "test" might appear in "cloze test" or "test your knowledge", so regexes are contextual
const dummyRegexes = [
  { name: "Lorem Ipsum", regex: /lorem\s+ipsum/i },
  { name: "Placeholder 'foo/bar'", regex: /\b(foo|bar|baz|qux)\b/i },
  { name: "Mock / Dummy Keyword", regex: /\b(mock|dummy|fake|placeholder|asdf|qwerty)\b/i },
  { name: "TODO / FIXME marker", regex: /\b(todo|fixme|xxx|tbd)\b/i },
  { name: "Trivial explanation", regex: /^(پاسخ صحیح است|گزینه \d درست است|درست است|غلط است)[.!]?$/ },
];

for (const lessonNum of lessons) {
  const filePath = path.join(dataDir, `grade12-lesson${lessonNum}-tamrin20.json`);
  if (!fs.existsSync(filePath)) {
    anomalies.push({ type: "CRITICAL", msg: `File missing: ${filePath}` });
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    anomalies.push({ type: "CRITICAL", msg: `JSON parse failure in lesson ${lessonNum}: ${e.message}` });
    continue;
  }

  // Check top-level contract
  if (data.grade !== 12 || data.lesson !== lessonNum || data.book !== "Vision 3") {
    anomalies.push({ type: "SCHEMA", msg: `Lesson ${lessonNum} metadata mismatch` });
  }

  for (const skill of skills) {
    const batch = data.skills[skill];
    if (!batch || !Array.isArray(batch.questions)) {
      anomalies.push({ type: "CRITICAL", msg: `Lesson ${lessonNum} [${skill}] missing batch or questions array` });
      continue;
    }

    const qList = batch.questions;
    let initialCountInSkill = 0;
    let progressiveCountInSkill = 0;

    for (let i = 0; i < qList.length; i++) {
      const q = qList[i];
      totalQuestions++;

      // Check orderIndex
      if (q.orderIndex !== i + 1) {
        anomalies.push({ type: "ORDER_INDEX", msg: `Question ${q.id} orderIndex is ${q.orderIndex}, expected ${i + 1}` });
      }

      // Check initial batch boundary
      if (i < 20) {
        if (q.isInitialBatch !== true) {
          anomalies.push({ type: "BOUNDARY", msg: `Question ${q.id} (index ${i}) should have isInitialBatch: true` });
        }
        initialCountInSkill++;
        totalInitial++;
      } else {
        if (q.isInitialBatch !== false) {
          anomalies.push({ type: "BOUNDARY", msg: `Question ${q.id} (index ${i}) should have isInitialBatch: false` });
        }
        progressiveCountInSkill++;
        totalProgressive++;
      }

      // Check question type
      questionTypeDist[q.questionType] = (questionTypeDist[q.questionType] || 0) + 1;

      // Duplicate prompt check
      const normalizedPrompt = q.prompt.trim().toLowerCase().replace(/\s+/g, " ");
      if (promptMap.has(normalizedPrompt)) {
        const prev = promptMap.get(normalizedPrompt);
        // Note: some prompts like "Listen to the audio and answer the questions" might repeat across multiple questions sharing audio
        if (q.skill !== "listening" && q.questionType !== "reading_passage_qa") {
          warnings.push({
            type: "DUPLICATE_PROMPT",
            msg: `Identical prompt between ${q.id} and ${prev.id}: "${q.prompt.slice(0, 60)}..."`,
          });
        }
      } else {
        promptMap.set(normalizedPrompt, { id: q.id, lesson: lessonNum, skill });
      }

      // Mock/dummy checks
      const fieldsToCheck = [
        { name: "prompt", text: q.prompt },
        { name: "promptFa", text: q.promptFa || "" },
        { name: "passage", text: q.passage || "" },
        { name: "briefFa", text: q.explanation?.briefFa || "" },
        { name: "detailedFa", text: q.explanation?.detailedFa || "" },
        { name: "pedagogicalRuleFa", text: q.explanation?.pedagogicalRuleFa || "" },
      ];

      for (const f of fieldsToCheck) {
        if (!f.text) continue;
        for (const dr of dummyRegexes) {
          if (dr.regex.test(f.text)) {
            anomalies.push({
              type: "MOCK_ARTIFACT",
              msg: `Question ${q.id} field '${f.name}' matched dummy pattern '${dr.name}': "${f.text.slice(0, 80)}"`,
            });
          }
        }
      }

      // Truncation check
      if (q.prompt.endsWith("...") && !q.prompt.includes("........") && q.questionType !== "fill_in_the_blank") {
        warnings.push({
          type: "SUSPICIOUS_TRUNCATION",
          msg: `Question ${q.id} prompt ends in '...': "${q.prompt}"`,
        });
      }

      // Explanation quality
      if (!q.explanation || !q.explanation.detailedFa) {
        anomalies.push({ type: "MISSING_EXPLANATION", msg: `Question ${q.id} missing detailedFa` });
      } else {
        const len = q.explanation.detailedFa.trim().length;
        explanationLengths.push(len);
        if (len < 15) {
          anomalies.push({ type: "BRIEF_EXPLANATION", msg: `Question ${q.id} detailedFa is only ${len} chars: "${q.explanation.detailedFa}"` });
        }
      }

      // MCQ checks
      if (q.questionType === "multiple_choice") {
        if (!Array.isArray(q.options) || q.options.length < 3) {
          anomalies.push({ type: "MCQ_OPTIONS", msg: `Question ${q.id} has fewer than 3 options` });
        } else {
          // Check for duplicate options within the same question
          const optSet = new Set(q.options.map(o => String(o).trim().toLowerCase()));
          if (optSet.size !== q.options.length) {
            anomalies.push({
              type: "DUPLICATE_OPTIONS",
              msg: `Question ${q.id} has duplicate options: ${JSON.stringify(q.options)}`,
            });
          }

          // Check answer distribution
          if (typeof q.correctAnswer === "number") {
            if (q.correctAnswer in mcqAnswerDist) {
              mcqAnswerDist[q.correctAnswer]++;
            } else {
              mcqAnswerDist.other++;
              anomalies.push({ type: "OUT_OF_BOUNDS_ANSWER", msg: `Question ${q.id} correctAnswer index ${q.correctAnswer} out of range for options length ${q.options.length}` });
            }
            if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
              anomalies.push({ type: "INVALID_KEY", msg: `Question ${q.id} correctAnswer ${q.correctAnswer} not within options` });
            }
          } else {
            anomalies.push({ type: "MCQ_KEY_TYPE", msg: `Question ${q.id} MCQ correctAnswer is not a number: ${q.correctAnswer}` });
          }
        }
      } else {
        // Non-MCQ check
        if (typeof q.correctAnswer !== "string" && !Array.isArray(q.acceptableAnswers)) {
          anomalies.push({ type: "NON_MCQ_KEY", msg: `Question ${q.id} non-MCQ has no valid string correctAnswer or acceptableAnswers` });
        }
      }

      // Audio checks
      if (q.audioUrl) {
        audioFilesReferenced.add(q.audioUrl);
        const diskPath = path.join(publicDir, q.audioUrl.startsWith("/") ? q.audioUrl.slice(1) : q.audioUrl);
        if (!fs.existsSync(diskPath)) {
          anomalies.push({ type: "AUDIO_MISSING", msg: `Question ${q.id} references missing audio: ${diskPath}` });
        } else {
          const stat = fs.statSync(diskPath);
          if (stat.size === 0) {
            anomalies.push({ type: "AUDIO_EMPTY", msg: `Question ${q.id} references 0-byte audio: ${diskPath}` });
          }
        }
      }
    }

    if (initialCountInSkill !== 20) {
      anomalies.push({
        type: "INITIAL_COUNT_VIOLATION",
        msg: `Lesson ${lessonNum} [${skill}] initial count is ${initialCountInSkill}, expected exactly 20!`,
      });
    }
  }
}

// Print results
console.log("📊 PROBE SUMMARY STATISTICS:");
console.log(`- Total questions inspected: ${totalQuestions}`);
console.log(`- Total initial batch questions: ${totalInitial} (expected 300)`);
console.log(`- Total progressive questions: ${totalProgressive} (expected 707)`);
console.log(`- Total unique audio files referenced: ${audioFilesReferenced.size}`);
console.log(`- Question type distribution:`, questionTypeDist);
console.log(`- MCQ Answer Key Distribution:`, mcqAnswerDist);

const minExplLen = Math.min(...explanationLengths);
const maxExplLen = Math.max(...explanationLengths);
const avgExplLen = Math.round(explanationLengths.reduce((a, b) => a + b, 0) / explanationLengths.length);
console.log(`- Explanation lengths: Min=${minExplLen}, Max=${maxExplLen}, Avg=${avgExplLen} chars`);

console.log(`\n🚨 ANOMALIES FOUND: ${anomalies.length}`);
if (anomalies.length > 0) {
  anomalies.forEach((a, idx) => console.log(`  [${idx + 1}] [${a.type}] ${a.msg}`));
} else {
  console.log("  ✓ ZERO critical anomalies or mock artifacts found!");
}

console.log(`\n⚠️  WARNINGS / AUDIT SIGNALS: ${warnings.length}`);
if (warnings.length > 0) {
  warnings.slice(0, 10).forEach((w, idx) => console.log(`  [${idx + 1}] [${w.type}] ${w.msg}`));
  if (warnings.length > 10) console.log(`  ... and ${warnings.length - 10} more warnings.`);
}

console.log("\n======================================================================");
if (anomalies.length === 0) {
  console.log("✅ ADVERSARIAL PROBE PASSED: DATA INTEGRITY IS SOLID.");
} else {
  console.log("❌ ADVERSARIAL PROBE FAILED: CRITICAL ANOMALIES DETECTED.");
  process.exit(1);
}
