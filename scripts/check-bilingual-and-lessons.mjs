import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

console.log("Starting bilingual typography and dynamic lesson player verification...");

// 1. Check tokens.css
const tokensCss = fs.readFileSync(path.join(root, "packages/ui/src/tokens.css"), "utf8");
assert(tokensCss.includes("--font-family-body"), "tokens.css must define --font-family-body");
assert(tokensCss.includes(".isolate-ltr"), "tokens.css must define .isolate-ltr");
assert(tokensCss.includes("unicode-bidi: isolate"), ".isolate-ltr must contain unicode-bidi: isolate");
assert(tokensCss.includes("display: inline-block"), ".isolate-ltr must contain display: inline-block");
assert(tokensCss.includes(':root[dir="ltr"]'), "tokens.css must configure :root[dir='ltr'] typography swap");
assert(tokensCss.includes(':root[dir="rtl"]'), "tokens.css must configure :root[dir='rtl'] typography swap");

// 2. Check components.css
const componentsCss = fs.readFileSync(path.join(root, "packages/ui/src/components.css"), "utf8");
assert(componentsCss.includes("font-weight: 600"), "Button and navigation in components.css must have font-weight: 600");
assert(componentsCss.includes("letter-spacing: -0.01em"), "Button and navigation in components.css must have letter-spacing: -0.01em");
assert(componentsCss.includes("var(--font-family-body"), "Button and navigation in components.css must use var(--font-family-body)");

// 3. Check layout.tsx and fonts.ts
const layoutTsx = fs.readFileSync(path.join(root, "apps/web/app/layout.tsx"), "utf8");
const fontsTs = fs.readFileSync(path.join(root, "apps/web/app/fonts.ts"), "utf8");
assert(layoutTsx.includes("vazirmatn"), "Root layout must configure vazirmatn via next/font/google");
assert(layoutTsx.includes("inter"), "Root layout must configure inter via next/font/google");
assert(fontsTs.includes("--font-vazirmatn"), "fonts.ts must declare --font-vazirmatn");
assert(fontsTs.includes("--font-inter"), "fonts.ts must declare --font-inter");
assert(layoutTsx.includes('dir="rtl"'), "Root layout default direction must be dir='rtl'");
assert(layoutTsx.includes('lang="fa"'), "Root layout default language must be lang='fa'");
assert(layoutTsx.includes("endoora_ui_locale"), "Root layout must bootstrap from endoora_ui_locale localStorage key");
assert(layoutTsx.includes("LanguageSwitcher"), "Root layout must include LanguageSwitcher");

// 4. Check BidiText component
const bidiTextTsx = fs.readFileSync(path.join(root, "packages/ui/src/components/BidiText.tsx"), "utf8");
assert(bidiTextTsx.includes('<bdi'), "BidiText must render a <bdi> element");
assert(bidiTextTsx.includes('lang="en"'), "BidiText must specify lang='en'");
assert(bidiTextTsx.includes('dir="ltr"'), "BidiText must specify dir='ltr'");
assert(bidiTextTsx.includes("isolate-ltr"), "BidiText must include isolate-ltr class");

// 5. Check LanguageSwitcher component
const switcherTsx = fs.readFileSync(path.join(root, "apps/web/components/layout/LanguageSwitcher.tsx"), "utf8");
assert(switcherTsx.includes("toggleLocale"), "LanguageSwitcher must support toggling locale");
assert(switcherTsx.includes("endoora_ui_locale"), "Language context must persist to endoora_ui_locale");

// 6. Check LessonData strict schema in JSON files
const lessonsDir = path.join(root, "apps/web/data/lessons");
const lessonFiles = fs.readdirSync(lessonsDir).filter((f) => f.endsWith(".json"));
assert(lessonFiles.length >= 3, `Expected at least 3 standalone lesson JSON files, found ${lessonFiles.length}`);

for (const file of lessonFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(lessonsDir, file), "utf8"));
  assert(content.id, `${file}: missing id`);
  assert(content.slug, `${file}: missing slug`);
  assert(["A1", "A2", "B1", "B2", "C1", "C2"].includes(content.level), `${file}: invalid CEFR level ${content.level}`);
  assert(content.title?.en && content.title?.fa, `${file}: missing bilingual title`);
  assert(typeof content.durationMinutes === "number", `${file}: durationMinutes must be a number`);
  assert(Array.isArray(content.vocabulary) && content.vocabulary.length > 0, `${file}: vocabulary must be a non-empty array`);
  for (const v of content.vocabulary) {
    assert(v.word && v.fa && v.example?.en && v.example?.fa, `${file}: vocabulary item incomplete: ${JSON.stringify(v)}`);
  }
  assert(content.grammar?.title?.en && content.grammar?.title?.fa, `${file}: grammar title incomplete`);
  assert(content.grammar?.explanation_fa, `${file}: grammar explanation_fa missing`);
  assert(Array.isArray(content.grammar?.rules) && content.grammar.rules.length > 0, `${file}: grammar rules missing`);
  assert(Array.isArray(content.grammar?.examples) && content.grammar.examples.length > 0, `${file}: grammar examples missing`);
  assert(Array.isArray(content.reading?.sentences) && content.reading.sentences.length > 0, `${file}: reading sentences missing`);
  for (const s of content.reading.sentences) {
    assert(s.id && s.en && s.fa && Array.isArray(s.vocabulary), `${file}: reading sentence incomplete: ${JSON.stringify(s)}`);
  }
  assert(Array.isArray(content.quiz) && content.quiz.length > 0, `${file}: quiz questions missing`);
  for (const q of content.quiz) {
    assert(q.id && q.prompt?.en && q.prompt?.fa && q.explanation?.fa, `${file}: quiz question incomplete: ${JSON.stringify(q)}`);
    if (q.type === "multiple_choice") {
      assert(Array.isArray(q.options) && typeof q.correctIndex === "number", `${file}: multiple_choice quiz question invalid`);
    } else if (q.type === "fill_blank") {
      assert(q.sentenceWithBlank && Array.isArray(q.acceptedAnswers), `${file}: fill_blank quiz question invalid`);
    } else {
      assert(false, `${file}: unknown quiz question type ${q.type}`);
    }
  }
}

// 7. Verify dynamic extensibility: test adding a temporary standalone lesson JSON
const testSlug = "extensibility-test-lesson";
const testFile = path.join(lessonsDir, `${testSlug}.json`);
const testData = {
  id: "test-999",
  slug: testSlug,
  level: "B1",
  title: { en: "Dynamic Extensibility Test", fa: "تست پویایی معماری درس" },
  durationMinutes: 10,
  vocabulary: [{ word: "test", fa: "آزمون", example: { en: "This is a test.", fa: "این یک آزمایش است." } }],
  grammar: {
    title: { en: "Test Grammar", fa: "گرامر آزمایشی" },
    explanation_fa: "توضیح آزمایشی برای بررسی پویایی لودر",
    rules: ["قاعده ۱"],
    examples: [{ en: "Example sentence", fa: "جمله نمونه", highlight: "Example" }],
  },
  reading: {
    title: { en: "Test Reading", fa: "ریدینگ آزمایشی" },
    sentences: [{ id: "ts1", en: "This is a test sentence.", fa: "این یک جمله آزمایشی است.", vocabulary: [{ word: "test", fa: "آزمون" }] }],
  },
  quiz: [
    {
      type: "multiple_choice",
      id: "tq1",
      prompt: { en: "Is this dynamic?", fa: "آیا این سیستم پویا است؟" },
      options: ["Yes", "No"],
      correctIndex: 0,
      explanation: { en: "100% data-driven.", fa: "کاملاً داده‌محور." },
    },
  ],
};

fs.writeFileSync(testFile, JSON.stringify(testData, null, 2), "utf8");

import { pathToFileURL } from "node:url";
const lessonsModuleUrl = pathToFileURL(path.join(root, "apps/web/lib/lessons.ts")).href;
const { getAllLessonsSync, getLessonBySlug } = await import(lessonsModuleUrl);
const loaded = getAllLessonsSync();
const found = await getLessonBySlug(testSlug);
assert(found && found.id === "test-999", "Dynamic JSON loader failed to automatically discover new standalone lesson file!");

// Cleanup test file
fs.unlinkSync(testFile);

console.log("PASS: All bilingual typography and dynamic lesson architecture checks passed successfully!");
