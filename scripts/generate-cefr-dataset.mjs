// @ts-check
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CURATED_A1_DICTIONARY, parseToken, normalizePOS } from "./cefr-seed-curator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CEFR_SOURCE_DIR = "E:/0/Work/Website/The General Website/Books and CEFR";
const OUTPUT_DIR = path.resolve(__dirname, "../apps/web/data/cefr");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function approximatePhonetic(word) {
  const customMap = {
    car: "/kɑːr/",
    cat: "/kæt/",
    dog: "/dɒɡ/",
    water: "/ˈwɔː.tər/",
    food: "/fuːd/",
    house: "/haʊs/",
    school: "/skuːl/",
    friend: "/frend/",
    family: "/ˈfæm.əl.i/",
    mother: "/ˈmʌð.ər/",
    father: "/ˈfɑː.ðər/",
    sister: "/ˈsɪs.tər/",
    brother: "/ˈbrʌð.ər/",
    love: "/lʌv/",
    like: "/laɪk/",
    good: "/ɡʊd/",
    bad: "/bæd/",
    big: "/bɪɡ/",
    small: "/smɔːl/",
    happy: "/ˈhæp.i/",
    sad: "/sæd/",
    work: "/wɜːk/",
    play: "/pleɪ/",
    learn: "/lɜːn/",
    teach: "/tiːtʃ/",
    student: "/ˈstjuː.dənt/",
    teacher: "/ˈtiː.tʃər/",
    read: "/riːd/",
    write: "/raɪt/",
    listen: "/ˈlɪs.ən/",
    speak: "/spiːk/",
    eat: "/iːt/",
    drink: "/drɪŋk/",
    sleep: "/sliːp/",
    go: "/ɡəʊ/",
    come: "/kʌm/",
    see: "/siː/",
    look: "/lʊk/",
    time: "/taɪm/",
    day: "/deɪ/",
    night: "/naɪt/",
    morning: "/ˈmɔː.nɪŋ/",
    today: "/təˈdeɪ/",
    tomorrow: "/təˈmɒr.əʊ/",
    yesterday: "/ˈjes.tə.deɪ/",
    money: "/ˈmʌn.i/",
    city: "/ˈsɪt.i/",
    country: "/ˈkʌn.tri/",
  };
  if (customMap[word.toLowerCase()]) return customMap[word.toLowerCase()];
  return `/${word.toLowerCase()}/`;
}

function generateInductiveFallback(token, level, index) {
  const { word, displayTerm, partOfSpeech, partOfSpeechLabelFa } = token;

  if (partOfSpeech === "verb") {
    return {
      phonetic: approximatePhonetic(word),
      meaningFa: `انجام عمل «${word}» (${partOfSpeechLabelFa})`,
      englishDef: `To perform the action or process of ${word}`,
      synonyms: [],
      antonyms: [],
      contextClue: `In daily communication, we often need to [ ___ ] effectively.`,
      situationHintFa: `عملی که در موقعیت‌های مرتبط با سطح ${level} انجام می‌پذیرد`,
      exampleEn: `She decided to ${word} with great dedication and confidence.`,
      exampleFa: `او تصمیم گرفت این کار را با تعهد و اعتماد به نفس بالا انجام دهد.`,
    };
  }

  if (partOfSpeech === "adjective") {
    return {
      phonetic: approximatePhonetic(word),
      meaningFa: `دارای ویژگی «${word}» (${partOfSpeechLabelFa})`,
      englishDef: `Having or showing the quality of being ${word}`,
      synonyms: [],
      antonyms: [],
      contextClue: `The speaker gave a remarkably [ ___ ] presentation to the audience.`,
      situationHintFa: `ویژگی یا حسی که در موقعیت‌های توصیفی به کار می‌رود`,
      exampleEn: `It was a particularly ${word} experience for all participants.`,
      exampleFa: `این یک تجربه بسیار خاص برای تمامی شرکت‌کنندگان بود.`,
    };
  }

  if (partOfSpeech === "noun") {
    return {
      phonetic: approximatePhonetic(word),
      meaningFa: `مفهوم / واژه «${word}» (${partOfSpeechLabelFa})`,
      englishDef: `A person, entity, or concept designated as ${word}`,
      synonyms: [],
      antonyms: [],
      contextClue: `The team analyzed the [ ___ ] from multiple perspectives.`,
      situationHintFa: `موضوع یا پدیده‌ای مشخص در دایره واژگان سطح ${level}`,
      exampleEn: `Understanding this ${word} is essential for language mastery.`,
      exampleFa: `درک این مفهوم برای تسلط زبانی نقشی کلیدی دارد.`,
    };
  }

  return {
    phonetic: approximatePhonetic(word),
    meaningFa: `کاربرد ساختاری «${word}» (${partOfSpeechLabelFa})`,
    englishDef: `A functional language element used in discourse`,
    synonyms: [],
    antonyms: [],
    contextClue: `Native speakers use [ ___ ] naturally in fluent dialogue.`,
    situationHintFa: `کلمه پرکاربرد ارتباطی در جمله‌سازی و بیان منظور`,
    exampleEn: `You will encounter "${word}" frequently in authentic materials.`,
    exampleFa: `شما این واژه را به طور مکرر در منابع اصیل انگلیسی خواهید دید.`,
  };
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

function processLevel(level) {
  const fileName = `CEFR ${level} vocab.txt`;
  const filePath = path.join(CEFR_SOURCE_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const rawLines = fileContent.split(/\r?\n/);
  const rawTokens = [];

  for (const line of rawLines) {
    const parts = line.split("\t");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed && trimmed.length > 1 && !/^[A-Z]$/.test(trimmed)) {
        rawTokens.push(trimmed);
      }
    }
  }

  const words = [];
  const wordsPerLesson = 10;

  rawTokens.forEach((raw, i) => {
    const parsed = parseToken(raw);
    const lookupKey = parsed.word.toLowerCase();
    const curated = level === "A1" ? (CURATED_A1_DICTIONARY[lookupKey] || CURATED_A1_DICTIONARY[parsed.displayTerm.toLowerCase()]) : null;

    const lessonIndex = Math.floor(i / wordsPerLesson) + 1;
    const cleanId = `${level.toLowerCase()}-${String(i + 1).padStart(3, "0")}-${parsed.word.replace(/[^a-z0-9]/g, "-")}`;

    if (curated) {
      words.push({
        id: cleanId,
        level,
        word: parsed.word,
        displayTerm: parsed.displayTerm,
        partOfSpeech: parsed.partOfSpeech,
        partOfSpeechLabelFa: parsed.partOfSpeechLabelFa,
        phonetic: curated.phonetic,
        meaningFa: curated.meaningFa,
        englishDefinition: curated.englishDef,
        inductiveClues: {
          contextClueEn: curated.contextClue,
          situationHintFa: curated.situationHintFa,
          synonyms: curated.synonyms || [],
          antonyms: curated.antonyms || [],
        },
        practicalExample: {
          sentenceEn: curated.exampleEn,
          translationFa: curated.exampleFa,
        },
        lessonIndex,
      });
    } else {
      const fallback = generateInductiveFallback(parsed, level, i);
      words.push({
        id: cleanId,
        level,
        word: parsed.word,
        displayTerm: parsed.displayTerm,
        partOfSpeech: parsed.partOfSpeech,
        partOfSpeechLabelFa: parsed.partOfSpeechLabelFa,
        phonetic: fallback.phonetic,
        meaningFa: fallback.meaningFa,
        englishDefinition: fallback.englishDef,
        inductiveClues: {
          contextClueEn: fallback.contextClue,
          situationHintFa: fallback.situationHintFa,
          synonyms: fallback.synonyms || [],
          antonyms: fallback.antonyms || [],
        },
        practicalExample: {
          sentenceEn: fallback.exampleEn,
          translationFa: fallback.exampleFa,
        },
        lessonIndex,
      });
    }
  });

  const outJsonPath = path.join(OUTPUT_DIR, `${level.toLowerCase()}-vocab.json`);
  fs.writeFileSync(outJsonPath, JSON.stringify(words, null, 2), "utf8");

  const outTsPath = path.join(OUTPUT_DIR, `${level.toLowerCase()}-vocab.ts`);
  const tsContent = `import type { CEFRWord } from "./types";
import data from "./${level.toLowerCase()}-vocab.json";

export const CEFR_${level}_VOCAB: CEFRWord[] = data as CEFRWord[];
`;
  fs.writeFileSync(outTsPath, tsContent, "utf8");

  console.log(`✓ Level ${level}: ${words.length} items -> ${outJsonPath}`);
  return words;
}

function buildAll() {
  const summary = {};
  for (const lvl of LEVELS) {
    const list = processLevel(lvl);
    summary[lvl] = list.length;
  }

  // Create main index.ts
  const indexTsContent = `import type { CEFRLevel, CEFRWord } from "./types";
import { CEFR_A1_VOCAB } from "./a1-vocab";
import { CEFR_A2_VOCAB } from "./a2-vocab";
import { CEFR_B1_VOCAB } from "./b1-vocab";
import { CEFR_B2_VOCAB } from "./b2-vocab";
import { CEFR_C1_VOCAB } from "./c1-vocab";
import { CEFR_C2_VOCAB } from "./c2-vocab";

export * from "./types";
export { CEFR_A1_VOCAB, CEFR_A2_VOCAB, CEFR_B1_VOCAB, CEFR_B2_VOCAB, CEFR_C1_VOCAB, CEFR_C2_VOCAB };

export const CEFR_VOCAB_REGISTRY: Record<CEFRLevel, CEFRWord[]> = {
  A1: CEFR_A1_VOCAB,
  A2: CEFR_A2_VOCAB,
  B1: CEFR_B1_VOCAB,
  B2: CEFR_B2_VOCAB,
  C1: CEFR_C1_VOCAB,
  C2: CEFR_C2_VOCAB,
};

export function getVocabForLevel(level: CEFRLevel): CEFRWord[] {
  return CEFR_VOCAB_REGISTRY[level] || [];
}

export function getWordById(level: CEFRLevel, wordId: string): CEFRWord | undefined {
  const words = getVocabForLevel(level);
  return words.find((w) => w.id === wordId);
}
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), indexTsContent, "utf8");
  console.log("✓ Created main registry: index.ts");
  console.log("Summary:", summary);
}

buildAll();
