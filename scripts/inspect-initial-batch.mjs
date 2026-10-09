import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const dataDir = path.join(process.cwd(), "apps", "web", "data", "highschool", "tamrin20");

for (const l of [1, 2, 3]) {
  const filePath = path.join(dataDir, `grade12-lesson${l}-tamrin20.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`=== LESSON ${l}: ${data.titleEn} (${data.titleFa}) ===`);
  for (const [skill, batch] of Object.entries(data.skills)) {
    const initial = batch.questions.slice(0, 20);
    const progressive = batch.questions.slice(20);
    const initialExams = Array.from(new Set(initial.map(q => q.examPeriod)));
    const initialTypes = Array.from(new Set(initial.map(q => q.questionType)));
    const progTypes = Array.from(new Set(progressive.map(q => q.questionType)));
    
    // Check if initial batch contains diverse, high-value questions
    console.log(`  [${skill.toUpperCase()}] (${batch.questions.length} total, 20 initial, ${progressive.length} progressive)`);
    console.log(`    - Initial types: ${initialTypes.join(", ")}`);
    console.log(`    - Progressive types: ${progTypes.join(", ") || "none"}`);
    console.log(`    - Exam sessions represented in initial 20: ${initialExams.slice(0, 5).join(" | ")} (total ${initialExams.length} sessions)`);
  }
}
