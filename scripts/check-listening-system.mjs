import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const webAppDir = path.join(rootDir, "apps", "web");
const listeningDataDir = path.join(webAppDir, "data", "listening");
const listeningComponentsDir = path.join(webAppDir, "components", "listening");
const listeningContractsPath = path.join(rootDir, "packages", "contracts", "src", "listening.ts");

const PASS = "\x1b[32m✔ PASS\x1b[0m";
const FAIL = "\x1b[31m✖ FAIL\x1b[0m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function check(tierName, description, assertionFn) {
  totalChecks++;
  try {
    const result = assertionFn();
    if (result === false) {
      throw new Error("Assertion returned false");
    }
    passedChecks++;
    console.log(`  ${PASS} [${tierName}] ${description}`);
    return true;
  } catch (err) {
    failedChecks++;
    const errMsg = err?.message || String(err);
    console.error(`  ${FAIL} [${tierName}] ${description}\n        -> ${errMsg}`);
    failures.push({ tier: tierName, description, error: errMsg });
    return false;
  }
}

const REQUIRED_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const PERSIAN_CHAR_REGEX = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_CHAR_REGEX = /[a-zA-Z]/;

function isPlaceholderString(str) {
  if (typeof str !== "string") return false;
  const trimmed = str.trim().toLowerCase();
  if (trimmed === "dummy" || trimmed === "test" || trimmed === "todo" || trimmed === "fixme" || trimmed === "placeholder") {
    return true;
  }
  const regex = /\b(TODO|FIXME|placeholder|لورم\s*ایپسوم|lorem\s*ipsum|test[0-9]+|dummy\s*(data|text|question|item|title|desc|content|component)|sample\s*text)\b/i;
  return regex.test(str);
}

console.log(`${BOLD}======================================================================${RESET}`);
console.log(`${BOLD}  Endoora CEFR Listening Ecosystem: Comprehensive 4-Tier Test Suite${RESET}`);
console.log(`${BOLD}======================================================================${RESET}\n`);

async function runVerification() {
  // ===========================================================================
  // TIER 1: Contracts & Data Coverage (18 Lessons, 3 per CEFR level)
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 1: Contracts & Data Coverage ---${RESET}`);

  check("Tier 1", "Contracts file exists at packages/contracts/src/listening.ts", () => {
    return fs.existsSync(listeningContractsPath);
  });

  const indexPath = path.join(listeningDataDir, "index.ts");
  check("Tier 1", "Listening repository index exists at apps/web/data/listening/index.ts", () => {
    return fs.existsSync(indexPath);
  });

  let allLessons = [];
  try {
    const a1Mod = await import(pathToFileURL(path.join(listeningDataDir, "a1-lessons.ts")).href);
    const a2Mod = await import(pathToFileURL(path.join(listeningDataDir, "a2-lessons.ts")).href);
    const b1Mod = await import(pathToFileURL(path.join(listeningDataDir, "b1-lessons.ts")).href);
    const b2Mod = await import(pathToFileURL(path.join(listeningDataDir, "b2-lessons.ts")).href);
    const c1Mod = await import(pathToFileURL(path.join(listeningDataDir, "c1-lessons.ts")).href);
    const c2Mod = await import(pathToFileURL(path.join(listeningDataDir, "c2-lessons.ts")).href);

    allLessons = [
      ...(a1Mod.A1_LESSONS || []),
      ...(a2Mod.A2_LESSONS || []),
      ...(b1Mod.B1_LESSONS || []),
      ...(b2Mod.B2_LESSONS || []),
      ...(c1Mod.C1_LESSONS || []),
      ...(c2Mod.C2_LESSONS || []),
    ];
  } catch (err) {
    check("Tier 1", "Imports listening lessons dataset successfully", () => {
      throw err;
    });
  }

  check("Tier 1", `Listening dataset contains exactly 18 lessons (found ${allLessons.length})`, () => {
    if (allLessons.length !== 18) {
      throw new Error(`Expected exactly 18 sample lessons, got ${allLessons.length}`);
    }
    return true;
  });

  for (const lvl of REQUIRED_LEVELS) {
    check("Tier 1", `CEFR Level ${lvl} has at least 3 lessons`, () => {
      const count = allLessons.filter((l) => l.level === lvl).length;
      if (count < 3) {
        throw new Error(`Level ${lvl} has only ${count} lessons, expected >= 3`);
      }
      return true;
    });
  }

  // Verify completeness of 7 stages for every lesson
  for (const lesson of allLessons) {
    check("Tier 1", `[${lesson.id} - ${lesson.level}] Complete 7 stages and audio metadata are present`, () => {
      if (!lesson.titleEn || !lesson.titleFa || !lesson.subtitleFa) {
        throw new Error("Missing titles or subtitle");
      }
      if (!lesson.audio || !lesson.audio.speechSynthesisText) {
        throw new Error("Missing audio configuration or speech text");
      }

      // Stage 1
      if (!lesson.preListening || !lesson.preListening.predictionQuestion) {
        throw new Error("Missing preListening or prediction question");
      }

      // Stage 2
      if (!lesson.firstListening || !Array.isArray(lesson.firstListening.exercises) || lesson.firstListening.exercises.length === 0) {
        throw new Error("Missing firstListening gist exercises");
      }

      // Stage 3
      if (!lesson.secondListening || !Array.isArray(lesson.secondListening.exercises) || lesson.secondListening.exercises.length === 0) {
        throw new Error("Missing secondListening detail exercises");
      }

      // Stage 4
      if (!lesson.thirdListening || !Array.isArray(lesson.thirdListening.exercises) || lesson.thirdListening.exercises.length === 0) {
        throw new Error("Missing thirdListening deep comprehension exercises");
      }

      // Stage 5
      if (!Array.isArray(lesson.transcript) || lesson.transcript.length === 0) {
        throw new Error("Missing transcript sentences");
      }

      // Stage 6
      if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 3) {
        throw new Error(`Vocabulary items count (${lesson.vocabulary?.length}) is less than 3`);
      }

      // Stage 7
      if (!lesson.postListening || !lesson.postListening.promptEn || !lesson.postListening.promptFa) {
        throw new Error("Missing postListening production prompts");
      }

      // Difficulty profile: 16 parameters
      const diff = lesson.difficulty;
      if (!diff) throw new Error("Missing difficulty profile");
      const requiredDiffKeys = [
        "cefrLevel",
        "vocabularyLevel",
        "grammarLevel",
        "speechRateWpm",
        "durationSeconds",
        "sentenceComplexity",
        "numberOfSpeakers",
        "accent",
        "vocabularyDensity",
        "idiomaticLanguage",
        "inferenceRequirement",
        "informationDensity",
        "backgroundNoise",
        "repetition",
        "speakerTurnFrequency",
        "pragmaticComplexity",
      ];
      for (const k of requiredDiffKeys) {
        if (diff[k] === undefined || diff[k] === null) {
          throw new Error(`Difficulty profile missing key: ${k}`);
        }
      }

      return true;
    });
  }

  // ===========================================================================
  // TIER 2: Data Integrity, Question Validity & Anti-Placeholder Validation
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 2: Data Integrity, Question Validity & Anti-Placeholder Validation ---${RESET}`);

  check("Tier 2", "Zero placeholder/dummy strings (TODO, FIXME, placeholder, lorem ipsum) across all lessons", () => {
    const scanObject = (obj, pathStr) => {
      if (!obj) return;
      if (typeof obj === "string") {
        if (isPlaceholderString(obj)) {
          throw new Error(`Forbidden placeholder string detected at ${pathStr}: "${obj.slice(0, 40)}"`);
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, idx) => scanObject(item, `${pathStr}[${idx}]`));
      } else if (typeof obj === "object") {
        for (const key of Object.keys(obj)) {
          scanObject(obj[key], `${pathStr}.${key}`);
        }
      }
    };

    allLessons.forEach((lesson, idx) => {
      scanObject(lesson, `lesson[${idx}:${lesson.id}]`);
    });
    return true;
  });

  check("Tier 2", "All multiple choice exercises have valid option indices and distinct options", () => {
    for (const lesson of allLessons) {
      const allExs = [
        ...lesson.firstListening.exercises,
        ...lesson.secondListening.exercises,
        ...lesson.thirdListening.exercises,
      ];

      for (const ex of allExs) {
        if (ex.options && typeof ex.correctIndex === "number") {
          if (ex.correctIndex < 0 || ex.correctIndex >= ex.options.length) {
            throw new Error(`[${lesson.id}] Exercise ${ex.id} correctIndex ${ex.correctIndex} out of bounds`);
          }
          const uniqueOpts = new Set(ex.options.map((o) => o.trim()));
          if (uniqueOpts.size !== ex.options.length) {
            throw new Error(`[${lesson.id}] Exercise ${ex.id} has duplicate options`);
          }
        }
      }
    }
    return true;
  });

  check("Tier 2", "Persian fields contain genuine Persian/Arabic text and English fields contain Latin characters", () => {
    for (const lesson of allLessons) {
      if (!PERSIAN_CHAR_REGEX.test(lesson.titleFa)) {
        throw new Error(`[${lesson.id}] titleFa missing Persian characters`);
      }
      if (!LATIN_CHAR_REGEX.test(lesson.titleEn)) {
        throw new Error(`[${lesson.id}] titleEn missing Latin characters`);
      }
      for (const stn of lesson.transcript) {
        if (!LATIN_CHAR_REGEX.test(stn.textEn)) {
          throw new Error(`[${lesson.id}] Transcript sentence ${stn.id} missing Latin characters`);
        }
        if (!PERSIAN_CHAR_REGEX.test(stn.textFa)) {
          throw new Error(`[${lesson.id}] Transcript sentence ${stn.id} missing Persian characters`);
        }
      }
    }
    return true;
  });

  // ===========================================================================
  // TIER 3: Component & Architecture Verification
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 3: Component & Architecture Verification ---${RESET}`);

  const requiredComponents = [
    "ListeningAudioPlayer.tsx",
    "ListeningExerciseEngine.tsx",
    "ListeningTranscriptViewer.tsx",
    "ListeningVocabularyList.tsx",
    "ListeningShadowingStudio.tsx",
    "ListeningDictationLab.tsx",
    "DifficultyProfileModal.tsx",
    "ListeningProgressBar.tsx",
    "index.ts",
    "listening-components.module.css",
  ];

  for (const comp of requiredComponents) {
    check("Tier 3", `Component exists: apps/web/components/listening/${comp}`, () => {
      const p = path.join(listeningComponentsDir, comp);
      if (!fs.existsSync(p)) {
        throw new Error(`Missing component file: ${comp}`);
      }
      return true;
    });
  }

  // Check client directives
  const clientComponents = [
    "ListeningAudioPlayer.tsx",
    "ListeningExerciseEngine.tsx",
    "ListeningTranscriptViewer.tsx",
    "ListeningVocabularyList.tsx",
    "ListeningShadowingStudio.tsx",
    "ListeningDictationLab.tsx",
    "DifficultyProfileModal.tsx",
    "ListeningProgressBar.tsx",
  ];

  for (const comp of clientComponents) {
    check("Tier 3", `${comp} is marked with 'use client'`, () => {
      const content = fs.readFileSync(path.join(listeningComponentsDir, comp), "utf8");
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        throw new Error(`${comp} missing 'use client' directive`);
      }
      return true;
    });
  }

  // ===========================================================================
  // TIER 4: Routes & API Verification
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 4: Routes & API Verification ---${RESET}`);

  const libraryRoutePath = path.join(webAppDir, "app", "(public)", "skills", "listening", "page.tsx");
  const lessonRoutePath = path.join(webAppDir, "app", "(public)", "skills", "listening", "[lessonId]", "page.tsx");
  const apiRoutePath = path.join(webAppDir, "app", "api", "listening", "lessons", "route.ts");

  check("Tier 4", "Listening Library route exists at apps/web/app/(public)/skills/listening/page.tsx", () => {
    return fs.existsSync(libraryRoutePath);
  });

  check("Tier 4", "Focused Lesson route exists at apps/web/app/(public)/skills/listening/[lessonId]/page.tsx", () => {
    return fs.existsSync(lessonRoutePath);
  });

  check("Tier 4", "API route exists at apps/web/app/api/listening/lessons/route.ts", () => {
    return fs.existsSync(apiRoutePath);
  });

  // Check link from skills hub to /skills/listening
  const skillsHubPath = path.join(webAppDir, "app", "(public)", "skills", "page.tsx");
  check("Tier 4", "Skills hub links directly to /skills/listening", () => {
    const hubContent = fs.readFileSync(skillsHubPath, "utf8");
    return hubContent.includes("/skills/listening") || hubContent.includes('slug: "listening"');
  });

  // Summary
  console.log(`\n${BOLD}======================================================================${RESET}`);
  console.log(`${BOLD}  Verification Summary${RESET}`);
  console.log(`${BOLD}======================================================================${RESET}`);
  console.log(`  Total Checks Executed : ${totalChecks}`);
  console.log(`  Checks Passed         : \x1b[32m${passedChecks}\x1b[0m`);
  console.log(`  Checks Failed         : ${failedChecks > 0 ? `\x1b[31m${failedChecks}\x1b[0m` : `\x1b[32m0\x1b[0m`}`);
  console.log(`${BOLD}======================================================================${RESET}\n`);

  if (failedChecks > 0) {
    console.error(`\x1b[31m❌ TEST SUITE FAILED with ${failedChecks} violation(s):\x1b[0m`);
    failures.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.tier}] ${f.description}: ${f.error}`);
    });
    process.exit(1);
  } else {
    console.log(`\x1b[32m✨ ALL 4 TIERS PASSED VERIFICATION CLEANLY! (Exit code 0)\x1b[0m\n`);
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error(`\x1b[31mFATAL TEST EXECUTION ERROR:\x1b[0m`, err);
  process.exit(1);
});
