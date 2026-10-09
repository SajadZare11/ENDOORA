import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const webAppDir = path.join(rootDir, "apps", "web");
const skillsDataPath = path.join(webAppDir, "data", "skills", "skills-content.ts");
const skillsHubPath = path.join(webAppDir, "app", "(public)", "skills", "page.tsx");
const skillDetailRoutePath = path.join(webAppDir, "app", "(public)", "skills", "[skill]", "page.tsx");
const skillsComponentsDir = path.join(webAppDir, "components", "skills");

// Color / icon helpers for console output
const PASS = "\x1b[32m✔ PASS\x1b[0m";
const FAIL = "\x1b[31m✖ FAIL\x1b[0m";
const INFO = "\x1b[36mℹ INFO\x1b[0m";
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

const REQUIRED_SKILLS = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "vocabulary",
  "grammar",
];

const PERSIAN_CHAR_REGEX = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_CHAR_REGEX = /[a-zA-Z]/;

function isPlaceholderString(str) {
  if (typeof str !== "string") return false;
  const trimmed = str.trim().toLowerCase();
  if (trimmed === "dummy" || trimmed === "test" || trimmed === "todo" || trimmed === "fixme" || trimmed === "placeholder") {
    return true;
  }
  // Matches placeholder patterns while avoiding linguistic terminology like "Dummy Subject"
  const regex = /\b(TODO|FIXME|placeholder|لورم\s*ایپسوم|lorem\s*ipsum|test[0-9]+|dummy\s*(data|text|question|item|title|desc|content|component)|sample\s*text)\b/i;
  return regex.test(str);
}

console.log(`${BOLD}======================================================================${RESET}`);
console.log(`${BOLD}  Endoora Skills Hub & 6 Skill Detail Pages: 4-Tier Verification Suite${RESET}`);
console.log(`${BOLD}======================================================================${RESET}\n`);

// -----------------------------------------------------------------------------
// Helper: Resolve skills data from module or file fallback
// -----------------------------------------------------------------------------
async function loadSkillsData() {
  if (!fs.existsSync(skillsDataPath)) {
    throw new Error(`Data file does not exist at: ${skillsDataPath}`);
  }

  // Attempt dynamic import via pathToFileURL
  try {
    const moduleUrl = pathToFileURL(skillsDataPath).href;
    const mod = await import(moduleUrl);
    const dataCandidate =
      mod.SKILLS_CONTENT ||
      mod.SKILLS_DATA ||
      mod.skillsData ||
      mod.skillsContent ||
      mod.default;

    if (dataCandidate) {
      if (typeof dataCandidate === "function") {
        return dataCandidate();
      }
      return dataCandidate;
    }
    
    // Check if exported as individual objects like `listeningSkill`, etc.
    const collected = {};
    for (const skill of REQUIRED_SKILLS) {
      if (mod[skill]) collected[skill] = mod[skill];
      else if (mod[`${skill}Skill`]) collected[skill] = mod[`${skill}Skill`];
      else if (mod[`${skill}Data`]) collected[skill] = mod[`${skill}Data`];
    }
    if (Object.keys(collected).length === REQUIRED_SKILLS.length) {
      return collected;
    }

    throw new Error(`Could not find a valid SKILLS_CONTENT or SKILLS_DATA export in ${skillsDataPath}`);
  } catch (importErr) {
    throw new Error(`Failed to load ${skillsDataPath}: ${importErr.message}`);
  }
}

// =============================================================================
// MAIN VERIFICATION FLOW
// =============================================================================
async function runVerification() {
  let skillsData = null;

  // ===========================================================================
  // TIER 1: Feature & Data Coverage
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 1: Feature & Data Coverage ---${RESET}`);

  check("Tier 1", "Skills dataset file exists at apps/web/data/skills/skills-content.ts", () => {
    return fs.existsSync(skillsDataPath);
  });

  if (fs.existsSync(skillsDataPath)) {
    try {
      skillsData = await loadSkillsData();
    } catch (e) {
      check("Tier 1", "Skills dataset can be imported and parsed", () => {
        throw e;
      });
    }
  }

  check("Tier 1", "Skills dataset covers all 6 required skills", () => {
    if (!skillsData) throw new Error("Dataset not loaded");
    for (const skill of REQUIRED_SKILLS) {
      if (!skillsData[skill]) {
        throw new Error(`Missing skill entry in dataset: '${skill}'`);
      }
    }
    return true;
  });

  if (skillsData) {
    for (const skill of REQUIRED_SKILLS) {
      const data = skillsData[skill];
      if (!data) continue;

      check("Tier 1", `[${skill}] Basic metadata is configured (slug, titleFa, titleEn, cefrRange, icon)`, () => {
        if (data.slug !== skill) throw new Error(`slug mismatch: expected '${skill}', got '${data.slug}'`);
        if (!data.titleFa || typeof data.titleFa !== "string") throw new Error("Missing or invalid titleFa");
        if (!data.titleEn || typeof data.titleEn !== "string") throw new Error("Missing or invalid titleEn");
        if (!data.cefrRange || typeof data.cefrRange !== "string") throw new Error("Missing or invalid cefrRange");
        if (!data.icon || typeof data.icon !== "string") throw new Error("Missing or invalid icon");
        return true;
      });

      // Pillar 1: Quick Toolkit
      check("Tier 1", `[${skill}] Pillar 1: Quick Toolkit contains >= 3 practical items`, () => {
        const toolkit = data.quickToolkit;
        if (!toolkit || !Array.isArray(toolkit.items)) {
          throw new Error("Missing quickToolkit or items array");
        }
        if (toolkit.items.length < 3) {
          throw new Error(`Quick Toolkit has ${toolkit.items.length} items, expected at least 3`);
        }
        for (let i = 0; i < toolkit.items.length; i++) {
          const item = toolkit.items[i];
          if (!item.id || typeof item.id !== "string") throw new Error(`Item ${i} missing id`);
          if (!item.phraseEn || typeof item.phraseEn !== "string") throw new Error(`Item ${i} missing phraseEn`);
          if (!item.phraseFa || typeof item.phraseFa !== "string") throw new Error(`Item ${i} missing phraseFa`);
          if (!item.contextFa || typeof item.contextFa !== "string") throw new Error(`Item ${i} missing contextFa`);
        }
        return true;
      });

      // Pillar 2: Interactive Mini-Practice
      check("Tier 1", `[${skill}] Pillar 2: Interactive Mini-Practice contains >= 3 questions`, () => {
        const practice = data.miniPractice;
        if (!practice || !Array.isArray(practice.questions)) {
          throw new Error("Missing miniPractice or questions array");
        }
        if (practice.questions.length < 3) {
          throw new Error(`Mini-Practice has ${practice.questions.length} questions, expected at least 3`);
        }
        for (let i = 0; i < practice.questions.length; i++) {
          const q = practice.questions[i];
          if (!q.id || typeof q.id !== "string") throw new Error(`Question ${i} missing id`);
          if (!q.promptFa || typeof q.promptFa !== "string") throw new Error(`Question ${i} missing promptFa`);
          if (!Array.isArray(q.options) || q.options.length < 2) {
            throw new Error(`Question ${i} (${q.id}) options must be an array with >= 2 items`);
          }
          if (typeof q.correctAnswer !== "number") {
            throw new Error(`Question ${i} (${q.id}) correctAnswer must be a number`);
          }
          if (!q.explanation || typeof q.explanation !== "object") {
            throw new Error(`Question ${i} (${q.id}) missing explanation object`);
          }
          if (!q.explanation.briefFa && !q.explanation.detailedFa) {
            throw new Error(`Question ${i} (${q.id}) explanation must have briefFa or detailedFa`);
          }
        }
        return true;
      });

      // Pillar 3: L1 Fixes
      check("Tier 1", `[${skill}] Pillar 3: L1 Fixes contains >= 2 Iranian learner common traps`, () => {
        const l1 = data.l1Fixes;
        if (!l1 || !Array.isArray(l1.fixes)) {
          throw new Error("Missing l1Fixes or fixes array");
        }
        if (l1.fixes.length < 2) {
          throw new Error(`L1 Fixes has ${l1.fixes.length} fixes, expected at least 2`);
        }
        for (let i = 0; i < l1.fixes.length; i++) {
          const fix = l1.fixes[i];
          if (!fix.id || typeof fix.id !== "string") throw new Error(`Fix ${i} missing id`);
          if (!fix.titleFa || typeof fix.titleFa !== "string") throw new Error(`Fix ${i} missing titleFa`);
          if (!fix.wrongEn || typeof fix.wrongEn !== "string") throw new Error(`Fix ${i} missing wrongEn`);
          if (!fix.correctEn || typeof fix.correctEn !== "string") throw new Error(`Fix ${i} missing correctEn`);
          if (!fix.whyFixFa || typeof fix.whyFixFa !== "string") throw new Error(`Fix ${i} missing whyFixFa`);
        }
        return true;
      });

      // Pillar 4: Action Plan
      check("Tier 1", `[${skill}] Pillar 4: Action Plan contains >= 3 milestones`, () => {
        const plan = data.actionPlan;
        if (!plan || !Array.isArray(plan.milestones)) {
          throw new Error("Missing actionPlan or milestones array");
        }
        if (plan.milestones.length < 3) {
          throw new Error(`Action Plan has ${plan.milestones.length} milestones, expected at least 3`);
        }
        for (let i = 0; i < plan.milestones.length; i++) {
          const m = plan.milestones[i];
          if (typeof m.step !== "number") throw new Error(`Milestone ${i} missing numeric step`);
          if (!m.titleFa || typeof m.titleFa !== "string") throw new Error(`Milestone ${i} missing titleFa`);
          if (!m.dailyRoutineFa || typeof m.dailyRoutineFa !== "string") throw new Error(`Milestone ${i} missing dailyRoutineFa`);
        }
        return true;
      });
    }
  }

  // ===========================================================================
  // TIER 2: Boundary, Data Integrity & Adversarial Validation
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 2: Boundary, Data Integrity & Adversarial Validation ---${RESET}`);

  if (skillsData) {
    // 1. Question correct indices and option bounds
    check("Tier 2", "Mini-Practice question answer indices are strictly within [0, options.length - 1]", () => {
      for (const skill of REQUIRED_SKILLS) {
        const questions = skillsData[skill]?.miniPractice?.questions || [];
        for (const q of questions) {
          if (!Number.isInteger(q.correctAnswer)) {
            throw new Error(`[${skill}] Question ${q.id} correctAnswer (${q.correctAnswer}) is not an integer`);
          }
          if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
            throw new Error(
              `[${skill}] Question ${q.id} correctAnswer index ${q.correctAnswer} out of bounds (options length: ${q.options.length})`
            );
          }
          // Verify options are distinct
          const uniqueOptions = new Set(q.options.map(o => o.trim()));
          if (uniqueOptions.size !== q.options.length) {
            throw new Error(`[${skill}] Question ${q.id} contains duplicate options`);
          }
        }
      }
      return true;
    });

    // 2. Anti-placeholder checks across all user-facing content
    check("Tier 2", "Zero placeholder/dummy strings (TODO, FIXME, placeholder, lorem ipsum, dummy data) across all skills", () => {
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

      for (const skill of REQUIRED_SKILLS) {
        scanObject(skillsData[skill], `skillsData.${skill}`);
      }
      return true;
    });

    // 3. Persian & English character validity
    check("Tier 2", "Persian fields contain genuine Persian/Arabic characters and English fields contain Latin characters", () => {
      for (const skill of REQUIRED_SKILLS) {
        const data = skillsData[skill];
        if (!PERSIAN_CHAR_REGEX.test(data.titleFa)) {
          throw new Error(`[${skill}] titleFa does not contain genuine Persian text: "${data.titleFa}"`);
        }
        if (!LATIN_CHAR_REGEX.test(data.titleEn)) {
          throw new Error(`[${skill}] titleEn does not contain valid English text: "${data.titleEn}"`);
        }

        // Check Toolkit items
        data.quickToolkit?.items?.forEach((item, idx) => {
          if (!PERSIAN_CHAR_REGEX.test(item.phraseFa)) {
            throw new Error(`[${skill}] Toolkit item ${idx} phraseFa missing Persian characters`);
          }
          if (!LATIN_CHAR_REGEX.test(item.phraseEn)) {
            throw new Error(`[${skill}] Toolkit item ${idx} phraseEn missing Latin characters`);
          }
        });

        // Check Mini-practice prompts
        data.miniPractice?.questions?.forEach((q, idx) => {
          if (!PERSIAN_CHAR_REGEX.test(q.promptFa)) {
            throw new Error(`[${skill}] Mini-practice question ${idx} promptFa missing Persian characters`);
          }
        });

        // Check L1 Fixes: ensure content is substantial and contains valid characters
        data.l1Fixes?.fixes?.forEach((fix, idx) => {
          if (!fix.wrongEn || fix.wrongEn.trim().length < 3) {
            throw new Error(`[${skill}] L1 Fix ${idx} wrongEn is too short or empty`);
          }
          if (!fix.correctEn || fix.correctEn.trim().length < 3) {
            throw new Error(`[${skill}] L1 Fix ${idx} correctEn is too short or empty`);
          }
          if (!PERSIAN_CHAR_REGEX.test(fix.whyFixFa)) {
            throw new Error(`[${skill}] L1 Fix ${idx} whyFixFa missing Persian characters`);
          }
        });
      }
      return true;
    });

    // 4. Pedagogical Explanation length requirement
    check("Tier 2", "Explanation detailedFa has length >= 20 characters for every practice question", () => {
      for (const skill of REQUIRED_SKILLS) {
        const questions = skillsData[skill]?.miniPractice?.questions || [];
        for (const q of questions) {
          const detailed = q.explanation?.detailedFa || "";
          if (detailed.trim().length < 20) {
            throw new Error(
              `[${skill}] Question ${q.id} detailedFa length is only ${detailed.trim().length} chars (required >= 20): "${detailed}"`
            );
          }
        }
      }
      return true;
    });
  }

  // ===========================================================================
  // TIER 3: Hub & Navigation Links Verification
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 3: Hub & Navigation Links Verification ---${RESET}`);

  check("Tier 3", "Skills hub page file exists at apps/web/app/(public)/skills/page.tsx", () => {
    return fs.existsSync(skillsHubPath);
  });

  if (fs.existsSync(skillsHubPath)) {
    const hubContent = fs.readFileSync(skillsHubPath, "utf8");

    // Check link to all 6 skills
    for (const skill of REQUIRED_SKILLS) {
      check("Tier 3", `Skills hub contains link to /skills/${skill}`, () => {
        const linkPattern = new RegExp(`href=["'\`]\\/skills\\/${skill}["'\`]`);
        const slugPattern = new RegExp(`["'\`]\\/skills\\/${skill}["'\`]|slug:\\s*["'\`]${skill}["'\`]`);
        if (!linkPattern.test(hubContent) && !slugPattern.test(hubContent)) {
          throw new Error(`Hub page does not contain reference or link to /skills/${skill}`);
        }
        return true;
      });
    }

    // Verify Tamrin 20 was removed from /skills hub per user request (it belongs to /high-school/grade-12/tamrin20)
    check("Tier 3", "Skills hub does not contain Tamrin 20 card (moved exclusively to /high-school/grade-12/tamrin20)", () => {
      const tamrin20Pattern = /\/high-school\/grade-12\/tamrin20/;
      if (tamrin20Pattern.test(hubContent)) {
        throw new Error("Tamrin 20 card must be removed from /skills hub per user instruction");
      }
      return true;
    });

    // Check link to «فرهنگ و روابط اجتماعی» / Small Talk
    check("Tier 3", "Skills hub contains link to «فرهنگ و روابط اجتماعی» (/skills/culture)", () => {
      const culturePattern = /\/skills\/culture/;
      if (!culturePattern.test(hubContent)) {
        throw new Error("Missing link to /skills/culture on /skills hub");
      }
      return true;
    });

    // Check absence of bureaucratic jargon
    check("Tier 3", "Skills hub is completely free of bureaucratic jargon ('قاعده ۸ قانون اساسی', 'پایگاه دانش', 'چارچوب PEEL')", () => {
      const forbiddenPhrases = [
        "قاعده ۸ قانون اساسی",
        "قاعده 8 قانون اساسی",
        "پایگاه دانش",
        "چارچوب PEEL",
      ];
      for (const phrase of forbiddenPhrases) {
        if (hubContent.includes(phrase)) {
          throw new Error(`Hub content contains forbidden bureaucratic jargon: "${phrase}"`);
        }
      }
      return true;
    });
  }

  // ===========================================================================
  // TIER 4: Component Architecture & Static Route Generation
  // ===========================================================================
  console.log(`${BOLD}\n--- TIER 4: Component Architecture & Static Route Generation ---${RESET}`);

  // 1. Components existence
  const requiredComponents = [
    "SkillHeroSection.tsx",
    "SkillQuickToolkit.tsx",
    "SkillMiniPractice.tsx",
    "SkillL1FixesSection.tsx",
    "SkillActionPlanSection.tsx",
    "SkillRelatedLinks.tsx",
    "index.ts",
    "skills-components.module.css",
  ];

  check("Tier 4", "Components directory exists at apps/web/components/skills", () => {
    return fs.existsSync(skillsComponentsDir);
  });

  for (const comp of requiredComponents) {
    check("Tier 4", `Component file exists: apps/web/components/skills/${comp}`, () => {
      const compPath = path.join(skillsComponentsDir, comp);
      if (!fs.existsSync(compPath)) {
        throw new Error(`Missing component file: ${comp}`);
      }
      return true;
    });
  }

  // 2. Client component check
  const miniPracticeCompPath = path.join(skillsComponentsDir, "SkillMiniPractice.tsx");
  if (fs.existsSync(miniPracticeCompPath)) {
    check("Tier 4", "SkillMiniPractice.tsx is marked with 'use client' directive", () => {
      const content = fs.readFileSync(miniPracticeCompPath, "utf8");
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        throw new Error("SkillMiniPractice.tsx must have 'use client' directive at the top");
      }
      return true;
    });
  }

  // 3. Static params generation in detail page
  check("Tier 4", "Dynamic skill route exists at apps/web/app/(public)/skills/[skill]/page.tsx", () => {
    return fs.existsSync(skillDetailRoutePath);
  });

  if (fs.existsSync(skillDetailRoutePath)) {
    const detailContent = fs.readFileSync(skillDetailRoutePath, "utf8");

    check("Tier 4", "Detail page exports generateStaticParams()", () => {
      if (!detailContent.includes("generateStaticParams")) {
        throw new Error("Missing generateStaticParams export in [skill]/page.tsx");
      }
      return true;
    });

    check("Tier 4", "generateStaticParams covers all 6 required skills", () => {
      if (
        detailContent.includes("Object.keys(SKILLS_CONTENT)") ||
        detailContent.includes("Object.keys(SKILLS_DATA)") ||
        detailContent.includes("Object.keys(skillsData)")
      ) {
        if (!skillsData) throw new Error("skillsData not available to verify generateStaticParams");
        for (const skill of REQUIRED_SKILLS) {
          if (!skillsData[skill]) {
            throw new Error(`SKILLS_CONTENT missing '${skill}' for generateStaticParams`);
          }
        }
        return true;
      }
      for (const skill of REQUIRED_SKILLS) {
        if (!detailContent.includes(skill)) {
          throw new Error(`generateStaticParams in [skill]/page.tsx does not cover '${skill}'`);
        }
      }
      return true;
    });

    check("Tier 4", "Detail page or Hero component includes back navigation link to /skills", () => {
      const heroCompPath = path.join(skillsComponentsDir, "SkillHeroSection.tsx");
      const heroContent = fs.existsSync(heroCompPath) ? fs.readFileSync(heroCompPath, "utf8") : "";
      if (
        !detailContent.includes('href="/skills"') &&
        !detailContent.includes("href='/skills'") &&
        !heroContent.includes('href="/skills"') &&
        !heroContent.includes("href='/skills'")
      ) {
        throw new Error("Missing return link href='/skills' in detail page or SkillHeroSection");
      }
      return true;
    });

  }

  // ===========================================================================
  // SUMMARY REPORT & EXIT
  // ===========================================================================
  console.log(`\n${BOLD}======================================================================${RESET}`);
  console.log(`${BOLD}  Test Suite Execution Summary${RESET}`);
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
