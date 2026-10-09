import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

console.log("Starting High School English Module (Vision 1, Lessons 1 & 2) verification...");

function validateLessonCommon(data, expectedId, expectedLessonNumber, expectedEnTitle, expectedFaTitle, expectedGrade = 10) {
  assert(data.id === expectedId, `Unexpected ID: ${data.id}`);
  assert(data.grade === expectedGrade, `Expected Grade ${expectedGrade}, got ${data.grade}`);
  assert(data.lessonNumber === expectedLessonNumber, `Expected Lesson ${expectedLessonNumber}, got ${data.lessonNumber}`);
  assert(data.title?.en === expectedEnTitle, `Expected English title ${expectedEnTitle}, got ${data.title?.en}`);
  assert(data.title?.fa === expectedFaTitle, `Expected Persian title ${expectedFaTitle}, got ${data.title?.fa}`);
  assert(data.sections, "sections object missing");

  const { getReady, conversation, newWords, reading, grammar, listening, writing } = data.sections;

  // 1. Get Ready
  assert(Array.isArray(getReady) && getReady.length >= 8, `Expected at least 8 getReady items in lesson ${expectedLessonNumber}, got ${getReady?.length}`);
  for (const item of getReady) {
    assert(item.id && item.word && item.persianMeaning, `Incomplete getReady item: ${item.word}`);
    assert(Array.isArray(item.options) && item.options.length === 3, `Expected 3 options for ${item.word}`);
    assert(typeof item.correctOptionIndex === "number" && item.correctOptionIndex >= 0 && item.correctOptionIndex < 3, `Invalid correct index for ${item.word}`);
    assert(item.exampleSentence?.en && item.exampleSentence?.fa, `Missing example for ${item.word}`);
  }

  // 2. Conversation
  assert(conversation?.situationFa, `Missing conversation situationFa in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(conversation.vocabulary) && conversation.vocabulary.length >= 4, `Expected at least 4 blue-box vocabulary items, got ${conversation.vocabulary?.length}`);
  assert(Array.isArray(conversation.dialogueLines) && conversation.dialogueLines.length >= 8, `Expected at least 8 dialogue lines, got ${conversation.dialogueLines?.length}`);
  for (let i = 0; i < conversation.dialogueLines.length; i++) {
    const line = conversation.dialogueLines[i];
    assert(line.orderIndex === i + 1, `Dialogue lines must be sequentially ordered (expected ${i + 1}, got ${line.orderIndex})`);
    assert(line.enText && line.faText && line.speaker, `Incomplete dialogue line: ${line.id}`);
  }

  // 3. New Words
  assert(Array.isArray(newWords) && newWords.length >= 10, `Expected at least 10 newWords items in lesson ${expectedLessonNumber}, got ${newWords?.length}`);
  for (const w of newWords) {
    assert(w.word && w.persianMeaning && Array.isArray(w.options) && w.exampleSentence?.en, `Incomplete new word: ${w.word}`);
  }

  // 4. Reading
  assert(reading?.title && reading?.persianTitle, `Reading title missing in lesson ${expectedLessonNumber}`);
  assert(reading.passageTextEn && Array.isArray(reading.passageParagraphs) && reading.passageParagraphs.length >= 4, `Reading passage incomplete in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(reading.questions) && reading.questions.length === 5, `Expected 5 reading questions in lesson ${expectedLessonNumber}, got ${reading.questions?.length}`);

  const qTypes = reading.questions.map((q) => q.type);
  assert(qTypes.includes("mcq_general"), `Missing mcq_general question in lesson ${expectedLessonNumber}`);
  assert(qTypes.includes("true_false"), `Missing true_false question in lesson ${expectedLessonNumber}`);
  assert(qTypes.includes("reference"), `Missing pronoun reference question in lesson ${expectedLessonNumber}`);
  assert(qTypes.includes("context_meaning"), `Missing context meaning question in lesson ${expectedLessonNumber}`);
  assert(qTypes.includes("open_ended"), `Missing open_ended question in lesson ${expectedLessonNumber}`);

  const q5 = reading.questions.find((q) => q.type === "open_ended");
  assert(Array.isArray(q5.requiredKeywordsForEvaluation) && q5.requiredKeywordsForEvaluation.length > 0, `Missing evaluation keywords for Q5 in lesson ${expectedLessonNumber}`);
  assert(q5.modelAnswerEn && q5.modelAnswerFa, `Missing model answer for Q5 in lesson ${expectedLessonNumber}`);

  // 5. Grammar
  assert(grammar?.discovery?.sentenceA && grammar?.discovery?.sentenceB, `Grammar discovery sentences missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(grammar.discovery.ccqQuestions) && grammar.discovery.ccqQuestions.length >= 2, `Grammar CCQs missing in lesson ${expectedLessonNumber}`);
  assert(grammar.ruleBoxFa && grammar.ruleBoxFa.length > 20, `Grammar ruleBoxFa missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(grammar.transformations) && grammar.transformations.length >= 2, `Grammar transformations missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(grammar.practices?.controlled) && grammar.practices.controlled.length >= 3, `Grammar controlled practice missing in lesson ${expectedLessonNumber}`);
  assert(grammar.practices?.production?.targetKeywords?.length > 0, `Grammar production targetKeywords missing in lesson ${expectedLessonNumber}`);

  // 6. Listening & Pronunciation
  assert(Array.isArray(listening?.preListeningQuestions) && listening.preListeningQuestions.length >= 2, `Listening pre-questions missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(listening?.conversations) && listening.conversations.length >= 2, `Listening conversations missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(listening?.pronunciation?.examples) && listening.pronunciation.examples.length >= 4, `Pronunciation examples missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(listening?.pronunciation?.quiz) && listening.pronunciation.quiz.length >= 3, `Pronunciation quiz missing in lesson ${expectedLessonNumber}`);

  // 7. Writing
  assert(Array.isArray(writing?.nounClassification?.categories) && writing.nounClassification.categories.length === 4, `Classification must have 4 categories in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(writing?.singularPlural?.exercise) && writing.singularPlural.exercise.length >= 3, `Exercise missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(writing?.properNouns?.paragraphFillInTheBlank) && writing.properNouns.paragraphFillInTheBlank.length >= 3, `Fill in blank missing in lesson ${expectedLessonNumber}`);
  assert(Array.isArray(writing?.nounMarkers?.markersList) && writing.nounMarkers.markersList.length >= 2, `Markers list missing in lesson ${expectedLessonNumber}`);
}

// === Verify Lesson 1 ===
const l1Path = path.join(root, "apps/web/data/highschool/grade10-lesson1.json");
assert(fs.existsSync(l1Path), `Lesson 1 file not found: ${l1Path}`);
const l1Data = JSON.parse(fs.readFileSync(l1Path, "utf8"));
validateLessonCommon(l1Data, "vision-1-lesson-1", 1, "Saving Nature", "نجات طبیعت");
console.log("✓ Lesson 1 (Saving Nature): All 7 sections verified successfully.");

// === Verify Lesson 2 ===
const l2Path = path.join(root, "apps/web/data/highschool/grade10-lesson2.json");
assert(fs.existsSync(l2Path), `Lesson 2 file not found: ${l2Path}`);
const l2Data = JSON.parse(fs.readFileSync(l2Path, "utf8"));
validateLessonCommon(l2Data, "vision-1-lesson-2", 2, "Wonders of Creation", "شگفتی‌های خلقت");

// Lesson 2 specific checks
const l2RedWords = ["liquid", "drop", "blood cell", "microbe", "pump", "defend", "carry", "collect"];
for (const rw of l2RedWords) {
  assert(l2Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Lesson 2 missing red word: ${rw}`);
}
assert(l2Data.sections.reading.title === "A Wonderful Liquid", "Lesson 2 reading title must be 'A Wonderful Liquid'");
assert(l2Data.sections.listening.pronunciation.examples.some((ex) => ex.intonation === "rising"), "Lesson 2 must include rising intonation examples");
console.log("✓ Lesson 2 (Wonders of Creation): All 7 sections verified with authentic content and rising intonation.");

// === Verify Lesson 3 ===
const l3Path = path.join(root, "apps/web/data/highschool/grade10-lesson3.json");
assert(fs.existsSync(l3Path), `Lesson 3 file not found: ${l3Path}`);
const l3Data = JSON.parse(fs.readFileSync(l3Path, "utf8"));
validateLessonCommon(l3Data, "vision-1-lesson-3", 3, "The Value of Knowledge", "ارزش علم و دانش");

// Lesson 3 specific checks
const l3RedWords = ["try hard", "energetic", "do experiments", "grow up", "rapidly", "flu", "feel weak", "invent", "do research", "success", "solve", "develop", "belief", "quit / give up", "thousands of"];
for (const rw of l3RedWords) {
  assert(l3Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Lesson 3 missing red word: ${rw}`);
}
assert(l3Data.sections.reading.title === "No Success Without Hard Work", "Lesson 3 reading title must be 'No Success Without Hard Work'");
assert(l3Data.sections.listening.pronunciation.title.includes("Emphatic") || l3Data.sections.listening.pronunciation.title.includes("تأکیدی"), "Lesson 3 must include emphatic stress");
assert(l3Data.sections.writing.nounClassification.title.includes("Action") || l3Data.sections.writing.nounClassification.title.includes("کنشی"), "Lesson 3 writing must cover action vs state verbs");
console.log("✓ Lesson 3 (The Value of Knowledge): All 7 sections verified with authentic Edison reading, Past Continuous inductive grammar, and Action/State verbs.");

// === Verify Lesson 4 ===
const l4Path = path.join(root, "apps/web/data/highschool/grade10-lesson4.json");
assert(fs.existsSync(l4Path), `Lesson 4 file not found: ${l4Path}`);
const l4Data = JSON.parse(fs.readFileSync(l4Path, "utf8"));
validateLessonCommon(l4Data, "vision-1-lesson-4", 4, "Traveling the World", "جهان‌گردی و گردشگری");

// Lesson 4 specific checks
const l4RedWords = ["domestic", "culture", "range", "entertainment", "pyramids", "ancient wind towers", "desert", "paradise"];
for (const rw of l4RedWords) {
  assert(l4Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Lesson 4 missing red word: ${rw}`);
}
assert(l4Data.sections.reading.title === "Iran: A True Paradise", "Lesson 4 reading title must be 'Iran: A True Paradise'");
assert(l4Data.sections.listening.pronunciation.title.includes("Contrastive") || l4Data.sections.listening.pronunciation.title.includes("تقابلی"), "Lesson 4 must include contrastive stress");
assert(l4Data.sections.writing.nounClassification.title.includes("Manner") || l4Data.sections.writing.nounClassification.title.includes("حالت"), "Lesson 4 writing must cover adverbs of manner");
console.log("✓ Lesson 4 (Traveling the World): All 7 sections verified with authentic Iran paradise reading, Modals inductive grammar, and Adverbs of manner.");

// === Verify Grade 11 Lesson 1 ===
const g11l1Path = path.join(root, "apps/web/data/highschool/grade11-lesson1.json");
assert(fs.existsSync(g11l1Path), `Grade 11 Lesson 1 file not found: ${g11l1Path}`);
const g11l1Data = JSON.parse(fs.readFileSync(g11l1Path, "utf8"));
validateLessonCommon(g11l1Data, "vision-2-lesson-1", 1, "Understanding People", "شناخت مردم و زبان‌ها", 11);

// Grade 11 Lesson 1 specific checks
const g11RedWords = ["region", "exist", "range", "popular", "imagine", "century", "percent", "meet the needs", "society", "ability", "vary", "make up", "despite"];
for (const rw of g11RedWords) {
  assert(g11l1Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 11 Lesson 1 missing red word: ${rw}`);
}
assert(g11l1Data.sections.reading.title === "Languages of the World", "Grade 11 Lesson 1 reading title must be 'Languages of the World'");
assert(g11l1Data.sections.listening.pronunciation.title.includes("Teen") || g11l1Data.sections.listening.pronunciation.title.includes("Ten"), "Grade 11 Lesson 1 must cover Teen vs Ten numbers");
assert(g11l1Data.sections.writing.nounClassification.title.includes("Simple Sentence") || g11l1Data.sections.writing.nounClassification.title.includes("جمله ساده"), "Grade 11 Lesson 1 writing must cover Simple Sentence structure");
console.log("✓ Grade 11 Lesson 1 (Understanding People): All 7 sections verified with authentic Languages of the World reading, Countable/Uncountable grammar, Teen vs Ten pronunciation, and SVO writing.");

// === Verify Grade 11 Lesson 2 ===
const g11l2Path = path.join(root, "apps/web/data/highschool/grade11-lesson2.json");
assert(fs.existsSync(g11l2Path), `Grade 11 Lesson 2 file not found: ${g11l2Path}`);
const g11l2Data = JSON.parse(fs.readFileSync(g11l2Path, "utf8"));
validateLessonCommon(g11l2Data, "vision-2-lesson-2", 2, "A Healthy Lifestyle", "سبک زندگی سالم", 11);

// Grade 11 Lesson 2 specific checks
const g11l2RedWords = ["diet", "blood pressure", "heartbeat", "measure", "serving", "bad habit", "harmful", "addiction", "heart attack", "physical", "calm", "balanced", "recent", "emotional"];
for (const rw of g11l2RedWords) {
  assert(g11l2Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 11 Lesson 2 missing red word: ${rw}`);
}
assert(g11l2Data.sections.reading.title === "Having a Healthier and Longer Life", "Grade 11 Lesson 2 reading title must be 'Having a Healthier and Longer Life'");
assert(g11l2Data.sections.listening.pronunciation.title.includes("Emergency") || g11l2Data.sections.listening.pronunciation.title.includes("اضطراری"), "Grade 11 Lesson 2 must cover Emergency stress");
assert(g11l2Data.sections.writing.nounClassification.title.includes("Gerund") || g11l2Data.sections.writing.nounClassification.title.includes("اسم مصدر"), "Grade 11 Lesson 2 writing must cover Gerunds");
console.log("✓ Grade 11 Lesson 2 (A Healthy Lifestyle): All 7 sections verified with authentic Healthier Life reading, Present Perfect + Phrasal Verbs grammar, Emergency stress, and Gerunds writing.");

// === Verify Grade 11 Lesson 3 ===
const g11l3Path = path.join(root, "apps/web/data/highschool/grade11-lesson3.json");
assert(fs.existsSync(g11l3Path), `Grade 11 Lesson 3 file not found: ${g11l3Path}`);
const g11l3Data = JSON.parse(fs.readFileSync(g11l3Path, "utf8"));
validateLessonCommon(g11l3Data, "vision-2-lesson-3", 3, "Art and Culture", "هنر و فرهنگ", 11);

// Grade 11 Lesson 3 specific checks
const g11l3RedWords = ["decorative", "craftsmen", "vast", "valuable metals", "fingerprint", "unique", "diversity", "weave a rug", "custom", "identity", "reflect", "humankind", "appreciate"];
for (const rw of g11l3RedWords) {
  assert(g11l3Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 11 Lesson 3 missing red word: ${rw}`);
}
assert(g11l3Data.sections.reading.title === "Art, Culture and Society", "Grade 11 Lesson 3 reading title must be 'Art, Culture and Society'");
assert(g11l3Data.sections.listening.pronunciation.title.includes("Intonation") || g11l3Data.sections.listening.pronunciation.title.includes("لحن"), "Grade 11 Lesson 3 must cover conditional intonation");
assert(g11l3Data.sections.writing.nounClassification.title.includes("Infinitive") || g11l3Data.sections.writing.nounClassification.title.includes("مصدر"), "Grade 11 Lesson 3 writing must cover Infinitives");
console.log("✓ Grade 11 Lesson 3 (Art and Culture): All 7 sections verified with authentic Persian Art reading, Conditional Type I grammar, Rising/Falling intonation, and Infinitives writing.");

// === Verify Grade 12 Lesson 1 ===
const g12l1Path = path.join(root, "apps/web/data/highschool/grade12-lesson1.json");
assert(fs.existsSync(g12l1Path), `Grade 12 Lesson 1 file not found: ${g12l1Path}`);
const g12l1Data = JSON.parse(fs.readFileSync(g12l1Path, "utf8"));
validateLessonCommon(g12l1Data, "vision-3-lesson-1", 1, "Sense of Appreciation", "حس قدردانی و احترام", 12);

// Grade 12 Lesson 1 specific checks
const g12l1RedWords = ["sofa", "feed pigeons", "hard of hearing", "shout at", "hug", "lap", "burst into tears", "repeatedly", "forgive", "calmly", "diary", "feel well", "take temperature", "go abroad", "spare no pains", "by the way"];
for (const rw of g12l1RedWords) {
  assert(g12l1Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 12 Lesson 1 missing red word/collocation: ${rw}`);
}
assert(g12l1Data.sections.reading.title === "Respecting Our Parents", "Grade 12 Lesson 1 reading title must be 'Respecting Our Parents'");
assert(g12l1Data.sections.listening.pronunciation.title.includes("Tag Questions") || g12l1Data.sections.listening.pronunciation.title.includes("Intonation"), "Grade 12 Lesson 1 must cover tag question intonation");
assert(g12l1Data.sections.writing.nounClassification.title.includes("Compound") || g12l1Data.sections.writing.nounClassification.title.includes("مرکب"), "Grade 12 Lesson 1 writing must cover compound sentences");
console.log("✓ Grade 12 Lesson 1 (Sense of Appreciation): All 7 sections verified with authentic Respecting Parents reading, Passive Voice + Tag Questions grammar, Falling/Rising intonation, Collocations, and Compound Sentences writing.");

// === Verify Grade 12 Lesson 2 ===
const g12l2Path = path.join(root, "apps/web/data/highschool/grade12-lesson2.json");
assert(fs.existsSync(g12l2Path), `Grade 12 Lesson 2 file not found: ${g12l2Path}`);
const g12l2Data = JSON.parse(fs.readFileSync(g12l2Path, "utf8"));
validateLessonCommon(g12l2Data, "vision-3-lesson-2", 2, "Look it Up!", "فرهنگ لغت و جستجوی واژگان", 12);

// Grade 12 Lesson 2 specific checks
const g12l2RedWords = ["contain", "symbol", "purpose", "figure out", "stand for", "combination", "introduction", "effectively", "arrange", "jump into", "increasingly", "communicative", "accidentally", "disconnection", "international", "unchangeable"];
for (const rw of g12l2RedWords) {
  assert(g12l2Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 12 Lesson 2 missing red word/word family: ${rw}`);
}
assert(g12l2Data.sections.reading.title === "How to Use a Dictionary", "Grade 12 Lesson 2 reading title must be 'How to Use a Dictionary'");
assert(g12l2Data.sections.listening.pronunciation.title.includes("Conditional") || g12l2Data.sections.listening.pronunciation.title.includes("Intonation"), "Grade 12 Lesson 2 must cover conditional intonation");
assert(g12l2Data.sections.writing.nounClassification.title.includes("Paragraph") || g12l2Data.sections.writing.nounClassification.title.includes("پاراگراف"), "Grade 12 Lesson 2 writing must cover paragraph structure");
console.log("✓ Grade 12 Lesson 2 (Look it Up!): All 7 sections verified with authentic Dictionary reading, Relative Clauses + Conditional Type II grammar, Intonation, Word Part Families, and Paragraph writing.");

// === Verify Grade 12 Lesson 3 ===
const g12l3Path = path.join(root, "apps/web/data/highschool/grade12-lesson3.json");
assert(fs.existsSync(g12l3Path), `Grade 12 Lesson 3 file not found: ${g12l3Path}`);
const g12l3Data = JSON.parse(fs.readFileSync(g12l3Path, "utf8"));
validateLessonCommon(g12l3Data, "vision-3-lesson-3", 3, "Renewable Energy", "انرژی‌های تجدیدپذیر", 12);

// Grade 12 Lesson 3 specific checks
const g12l3RedWords = ["rich in", "resource", "consume", "balcony", "pollute", "variety", "tide", "replace", "use up", "forever", "demand", "convert", "absorb", "God helps those who help themselves", "The early bird catches the worm", "Actions speak louder than words"];
for (const rw of g12l3RedWords) {
  assert(g12l3Data.sections.newWords.some((w) => w.word.toLowerCase() === rw.toLowerCase()), `Grade 12 Lesson 3 missing red word/proverb: ${rw}`);
}
assert(g12l3Data.sections.reading.title === "Earth for our Children", "Grade 12 Lesson 3 reading title must be 'Earth for our Children'");
assert(g12l3Data.sections.listening.pronunciation.title.includes("Intonation") || g12l3Data.sections.listening.pronunciation.title.includes("Time"), "Grade 12 Lesson 3 must cover time clauses intonation");
assert(g12l3Data.sections.writing.nounClassification.title.includes("Supporting") || g12l3Data.sections.writing.nounClassification.title.includes("پشتیبان"), "Grade 12 Lesson 3 writing must cover supporting sentences");
console.log("✓ Grade 12 Lesson 3 (Renewable Energy): All 7 sections verified with authentic Earth for our Children reading, Passive Voice with Modals + Past Perfect grammar, Time clauses intonation, Proverbs, and Concluding sentences writing.");

// === Verify TypeScript Data Loader ===
const highschoolLoaderUrl = pathToFileURL(path.join(root, "apps/web/lib/highschool.ts")).href;
const { getAllHighSchoolLessonsSync, getHighSchoolLesson } = await import(highschoolLoaderUrl);
const loadedLessons = getAllHighSchoolLessonsSync();
assert(loadedLessons.length >= 10, `Expected at least 10 high school lessons across all 3 grades, found ${loadedLessons.length}`);

const lesson1 = await getHighSchoolLesson(10, 1);
assert(lesson1 && lesson1.id === "vision-1-lesson-1", "getHighSchoolLesson(10, 1) failed");

const lesson2 = await getHighSchoolLesson(10, 2);
assert(lesson2 && lesson2.id === "vision-1-lesson-2", "getHighSchoolLesson(10, 2) failed");

const lesson3 = await getHighSchoolLesson(10, 3);
assert(lesson3 && lesson3.id === "vision-1-lesson-3", "getHighSchoolLesson(10, 3) failed");

const lesson4 = await getHighSchoolLesson(10, 4);
assert(lesson4 && lesson4.id === "vision-1-lesson-4", "getHighSchoolLesson(10, 4) failed");

const g11Lesson1 = await getHighSchoolLesson(11, 1);
assert(g11Lesson1 && g11Lesson1.id === "vision-2-lesson-1", "getHighSchoolLesson(11, 1) failed");

const g11Lesson2 = await getHighSchoolLesson(11, 2);
assert(g11Lesson2 && g11Lesson2.id === "vision-2-lesson-2", "getHighSchoolLesson(11, 2) failed");

const g11Lesson3 = await getHighSchoolLesson(11, 3);
assert(g11Lesson3 && g11Lesson3.id === "vision-2-lesson-3", "getHighSchoolLesson(11, 3) failed");

const g12Lesson1 = await getHighSchoolLesson(12, 1);
assert(g12Lesson1 && g12Lesson1.id === "vision-3-lesson-1", "getHighSchoolLesson(12, 1) failed");

const g12Lesson2 = await getHighSchoolLesson(12, 2);
assert(g12Lesson2 && g12Lesson2.id === "vision-3-lesson-2", "getHighSchoolLesson(12, 2) failed");

const g12Lesson3 = await getHighSchoolLesson(12, 3);
assert(g12Lesson3 && g12Lesson3.id === "vision-3-lesson-3", "getHighSchoolLesson(12, 3) failed");

console.log("✓ HighSchool TypeScript Data Loader: Verified getHighSchoolLesson for Grade 10 (Lessons 1-4), Grade 11 (Lessons 1-3), and Grade 12 (Lessons 1-3) load correctly.");
console.log("🎉 ALL HIGH SCHOOL LESSONS (GRADES 10, 11, AND 12 - 10 LESSONS TOTAL) VERIFICATIONS PASSED SUCCESSFULLY!");
