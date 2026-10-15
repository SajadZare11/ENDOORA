import type { CefrLevel } from "../../data/skills/games/types";

export type ErrorCodeType =
  | "TENSE"
  | "ARTICLE"
  | "WORD CHOICE"
  | "SPELLING"
  | "PREPOSITION"
  | "PLURAL"
  | "AGREEMENT"
  | "LINK"
  | "SENTENCE";

export interface ErrorTaxonomyMeta {
  code: ErrorCodeType;
  titleFa: string;
  descriptionFa: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const ERROR_TAXONOMY: Record<ErrorCodeType, ErrorTaxonomyMeta> = {
  TENSE: {
    code: "TENSE",
    titleFa: "زمان فعل",
    descriptionFa: "زمان، وجه یا فرم فعل با قید زمان یا بافت جمله هماهنگ نیست.",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
    textColor: "#6d28d9",
  },
  ARTICLE: {
    code: "ARTICLE",
    titleFa: "حرف تعریف (a/an/the)",
    descriptionFa: "حرف تعریف نامعین (a/an) یا معین (the) جا افتاده یا اشتباه است.",
    color: "#0284c7",
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
  },
  "WORD CHOICE": {
    code: "WORD CHOICE",
    titleFa: "انتخاب کلمه",
    descriptionFa: "واژه انتخابی با مفهوم جمله ناهماهنگ است یا ترجمه تحت‌اللفظی است.",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    textColor: "#b45309",
  },
  SPELLING: {
    code: "SPELLING",
    titleFa: "املای کلمه",
    descriptionFa: "املای واژه یا ترتیب حروف اشتباه است.",
    color: "#ef4444",
    bgColor: "#fee2e2",
    textColor: "#b91c1c",
  },
  PREPOSITION: {
    code: "PREPOSITION",
    titleFa: "حرف اضافه",
    descriptionFa: "حرف اضافه وابسته به فعل یا صفت اشتباه انتخاب شده است.",
    color: "#10b981",
    bgColor: "#d1fae5",
    textColor: "#047857",
  },
  PLURAL: {
    code: "PLURAL",
    titleFa: "مفرد و جمع",
    descriptionFa: "علامت جمع -s/-es جا افتاده یا به اسم غیرقابل‌شمارش اضافه شده است.",
    color: "#ec4899",
    bgColor: "#fce7f3",
    textColor: "#be185d",
  },
  AGREEMENT: {
    code: "AGREEMENT",
    titleFa: "تطابق فاعل و فعل",
    descriptionFa: "ناهماهنگی بین شخص یا شمار فاعل با فعل جمله.",
    color: "#6366f1",
    bgColor: "#e0e7ff",
    textColor: "#4338ca",
  },
  LINK: {
    code: "LINK",
    titleFa: "کلمه ربط و پیوند",
    descriptionFa: "نیاز به کلمه ربط مناسب برای انسجام و اتصال منطقی ایده‌ها.",
    color: "#06b6d4",
    bgColor: "#cffafe",
    textColor: "#0e7490",
  },
  SENTENCE: {
    code: "SENTENCE",
    titleFa: "ساختار جمله",
    descriptionFa: "جمله ناقص، بدون فاعل مشخص یا جملات کش‌دار پیوسته (Run-on).",
    color: "#ea580c",
    bgColor: "#ffedd5",
    textColor: "#c2410c",
  },
};

export interface DetectedErrorItem {
  id: string;
  code: ErrorCodeType;
  originalText: string;
  startIndex: number;
  endIndex: number;
  shortHintFa: string; // Used in Draft 1 (indirect, no direct solution)
  directCorrection: string; // Used in Draft 2 (concise: ❌ -> ✅)
}

export interface WritingEvaluationOutput {
  draftType: "draft1" | "draft2";
  score: number; // 0 to 100
  wordCount: number;
  sentenceCount: number;
  requiredSentences: number;
  requiredWords: number;
  detectedErrors: DetectedErrorItem[];
  usedSuggestedWords: string[];
  missingSuggestedWords: string[];
  improvementBonusXp?: number;
  isReadyForNextLevel: boolean;
}

// Level Requirements Base Map
export const LEVEL_REQUIREMENTS: Record<
  CefrLevel,
  { minSentences: number; minWords: number; genreFa: string }
> = {
  A1: { minSentences: 3, minWords: 20, genreFa: "۳ تا ۴ جمله کوتاه" },
  A2: { minSentences: 4, minWords: 45, genreFa: "یک پاراگراف منسجم توصیفی" },
  B1: { minSentences: 7, minWords: 85, genreFa: "۲ تا ۳ پاراگراف داستان و نقد" },
  B2: { minSentences: 10, minWords: 145, genreFa: "۲ تا ۳ پاراگراف استدلالی رسمی (PEEL)" },
  C1: { minSentences: 13, minWords: 210, genreFa: "رایتینگ تحلیلی آکادمیک (IELTS 6.5+)" },
  C2: { minSentences: 16, minWords: 260, genreFa: "سرمقاله تحلیلی و گفتمان اقناعی پیشرفته" },
};

/**
 * Dynamic Step-by-Step Stage Requirements
 * Stage 1 is easiest; Stage 10 is hardest within the level.
 * Stage 10 of level X is strictly easier than Stage 1 of level X+1.
 */
export function getStageRequirements(
  cefr: CefrLevel,
  levelNumber: number = 1
): {
  minSentences: number;
  minWords: number;
  genreFa: string;
  stageNameFa: string;
} {
  const stage = Math.max(1, Math.min(10, levelNumber));
  const t = (stage - 1) / 9; // 0.0 at stage 1, 1.0 at stage 10

  switch (cefr) {
    case "A1": {
      // 3 to 4 sentences, 20 to 35 words
      const minSentences = stage <= 7 ? 3 : 4;
      const minWords = Math.round(20 + t * 15); // 20 -> 35
      return {
        minSentences,
        minWords,
        genreFa: `۳ تا ۴ جمله کوتاه (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله کارخانه: نگارش کامل ۴ جمله با تمام جزئیات ربات"
            : `نگارش ۳ جمله پایه با حروف بزرگ و نقطه پایان (مرحله ${stage})`,
      };
    }
    case "A2": {
      // 1 paragraph: 45 words (stage 1) to 75 words (stage 10)
      // Note: Stage 10 (75 words) is easier than B1 Stage 1 (85 words)
      const minSentences = Math.round(4 + t * 3); // 4 -> 7
      const minWords = Math.round(45 + t * 30); // 45 -> 75
      return {
        minSentences,
        minWords,
        genreFa: `یک پاراگراف منسجم (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله کارخانه: پاراگراف جامع ثبت اختراع نهایی"
            : `یک پاراگراف توصیفی با کلمات ربط (مرحله ${stage})`,
      };
    }
    case "B1": {
      // 2-3 paragraphs: 85 words (stage 1) to 135 words (stage 10)
      // Note: Stage 10 (135 words) is easier than B2 Stage 1 (145 words)
      const minSentences = Math.round(7 + t * 4); // 7 -> 11
      const minWords = Math.round(85 + t * 50); // 85 -> 135
      return {
        minSentences,
        minWords,
        genreFa: `۲ تا ۳ پاراگراف داستانی-تحلیلی (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله دادگاه: کیفرخواست کامل و مستند دادگاه"
            : `۲ پاراگراف شواهد صحنه با جمله‌واره‌های موصولی (مرحله ${stage})`,
      };
    }
    case "B2": {
      // 2-3 formal paragraphs: 145 words (stage 1) to 200 words (stage 10)
      // Note: Stage 10 (200 words) is easier than C1 Stage 1 (210 words)
      const minSentences = Math.round(10 + t * 4); // 10 -> 14
      const minWords = Math.round(145 + t * 55); // 145 -> 200
      return {
        minSentences,
        minWords,
        genreFa: `۲ تا ۳ پاراگراف استدلالی رسمی PEEL (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله کارتل: لایحه محاکمه مغز متفکر"
            : `نگارش استدلالی رسمی با شواهد و پیونددهنده‌ها (مرحله ${stage})`,
      };
    }
    case "C1": {
      // IELTS 6.5+ academic essay: 210 words (stage 1) to 250 words (stage 10)
      // Note: Stage 10 (250 words) is easier than C2 Stage 1 (260 words)
      const minSentences = Math.round(13 + t * 4); // 13 -> 17
      const minWords = Math.round(210 + t * 40); // 210 -> 250
      return {
        minSentences,
        minWords,
        genreFa: `رایتینگ تحلیلی آکادمیک IELTS 6.5+ (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله سایبری: سند سفید اجلاس امنیت جهانی"
            : `جستار آکادمیک با ساختارهای نحوی پیشرفته (مرحله ${stage})`,
      };
    }
    case "C2": {
      // Mastery discourse: 260 words (stage 1) to 340 words (stage 10)
      const minSentences = Math.round(16 + t * 6); // 16 -> 22
      const minWords = Math.round(260 + t * 80); // 260 -> 340
      return {
        minSentences,
        minWords,
        genreFa: `سرمقاله و گفتمان اقناعی پیشرفته (مرحله ${stage} از ۱۰)`,
        stageNameFa:
          stage === 10
            ? "چالش غول مرحله نهایی: منشور جهانی زیست هوش مصنوعی و آگاهی سایبری"
            : `تحلیل راهبردی کلان با موازنه بلاغی (مرحله ${stage})`,
      };
    }
  }
}

/**
 * Generates clear, friendly, and non-crowded scenario prompts for any stage.
 */
export function getStageScenarioPrompt(
  activeCase: {
    stageTitleFa?: string;
    scenarioFa?: string;
    locationFa?: string;
    mainWritingTask?: { scenarioFa?: string };
  },
  cefr: CefrLevel,
  levelNumber: number = 1
): string {
  if (activeCase.mainWritingTask?.scenarioFa) {
    return activeCase.mainWritingTask.scenarioFa;
  }

  const req = getStageRequirements(cefr, levelNumber);
  const title = activeCase.stageTitleFa || "این مرحله";
  const scenario = activeCase.scenarioFa ? ` ${activeCase.scenarioFa}` : "";

  switch (cefr) {
    case "A1":
      return `موضوع: «${title}».${scenario} اکنون با استفاده از کلمات پیشنهادی کادر زیر، ۳ جمله کوتاه به انگلیسی بنویسید (حداقل ${req.minWords} کلمه). دقت کنید که حروف اول جملات بزرگ و در پایان هر جمله نقطه قرار گیرد.`;
    case "A2":
      return `موضوع: «${title}».${scenario} یک پاراگراف منسجم انگلیسی (حداقل ${req.minWords} کلمه) بنویسید و ایده‌ها را با استفاده از کلمات ربط پیشنهادی کادر به هم پیوند دهید.`;
    case "B1":
      return `پرونده: «${title}».${scenario} گزارشی داستانی-تحلیلی در ۲ تا ۳ پاراگراف (حداقل ${req.minWords} کلمه) بنویسید و جزئیات صحنه و فرضیه‌ها را با کلمات کلیدی شرح دهید.`;
    case "B2":
      return `پرونده: «${title}».${scenario} یک متن استدلالی رسمی در ۲ تا ۳ پاراگراف (حداقل ${req.minWords} کلمه) با ساختار استاندارد، دلایل منطقی و لحن رسمی ارائه دهید.`;
    case "C1":
      return `پرونده استراتژیک: «${title}».${scenario} یک رایتینگ تحلیلی آکادمیک در سطح آیلتس ۶.۵ به بالا (حداقل ${req.minWords} کلمه) بنویسید و دیدگاه‌ها و نتایج را بررسی کنید.`;
    case "C2":
      return `پرونده عالی حاکمیتی: «${title}».${scenario} یک جستار تحلیلی عمیق و سرمقاله استراتژیک (حداقل ${req.minWords} کلمه) با بهره‌گیری از واژگان فاخر و ساختارهای نحوی فشرده بنویسید.`;
  }
}

// Common Pattern Diagnostic Database
interface PatternRule {
  regex: RegExp;
  code: ErrorCodeType;
  hintFa: string;
  correctionTemplate: (match: string) => string;
}

const COMMON_DIAGNOSTIC_RULES: PatternRule[] = [
  // AGREEMENT
  {
    regex: /\b(he|she|it|this|that)\s+(have|are|do|were)\b/gi,
    code: "AGREEMENT",
    hintFa: "فاعل سوم شخص مفرد است؛ فعل را از نظر تطابق شمار بررسی کنید.",
    correctionTemplate: (m) => {
      const parts = m.split(/\s+/);
      const rep: Record<string, string> = { have: "has", are: "is", do: "does", were: "was" };
      return `${parts[0]} ${rep[parts[1]?.toLowerCase()] || parts[1]}`;
    },
  },
  {
    regex: /\b(they|we|you)\s+(is|has|does|was)\b/gi,
    code: "AGREEMENT",
    hintFa: "فاعل جمع است؛ فعل باید با فاعل جمع هماهنگ باشد.",
    correctionTemplate: (m) => {
      const parts = m.split(/\s+/);
      const rep: Record<string, string> = { is: "are", has: "have", does: "do", was: "were" };
      return `${parts[0]} ${rep[parts[1]?.toLowerCase()] || parts[1]}`;
    },
  },
  // ARTICLE
  {
    regex: /\ba\s+([aeiou]\w+)/gi,
    code: "ARTICLE",
    hintFa: "قبل از صداهای صدادار باید از حرف تعریف an استفاده شود.",
    correctionTemplate: (m) => m.replace(/^a\s+/i, "an "),
  },
  {
    regex: /\ban\s+([bcdfghjklmnpqrstvwxyz]\w+)/gi,
    code: "ARTICLE",
    hintFa: "قبل از صامت‌ها از حرف تعریف a استفاده می‌شود نه an.",
    correctionTemplate: (m) => m.replace(/^an\s+/i, "a "),
  },
  // PREPOSITION
  {
    regex: /\bmarried\s+with\b/gi,
    code: "PREPOSITION",
    hintFa: "حرف اضافه درست برای صفت married را بررسی کنید.",
    correctionTemplate: () => "married to",
  },
  {
    regex: /\binterested\s+(to|for|at)\b/gi,
    code: "PREPOSITION",
    hintFa: "صفت interested با چه حرف اضافه‌ای به کار می‌رود؟",
    correctionTemplate: () => "interested in",
  },
  {
    regex: /\bdepend\s+of\b/gi,
    code: "PREPOSITION",
    hintFa: "حرف اضافه فعل depend را بررسی کنید.",
    correctionTemplate: () => "depend on",
  },
  {
    regex: /\blisten\s+([a-z]+)/gi,
    code: "PREPOSITION",
    hintFa: "فعل listen قبل از مفعول به حرف اضافه to نیاز دارد.",
    correctionTemplate: (m) => (m.toLowerCase().startsWith("listen to") ? m : m.replace(/^listen\s+/i, "listen to ")),
  },
  // TENSE
  {
    regex: /\b(yesterday|last\s+(?:night|week|month|year)|ago)\s+.*?\b(go|see|come|buy|make|do|play|write|eat)\b/gi,
    code: "TENSE",
    hintFa: "با وجود قید زمان گذشته، فعل جمله در چه زمانی باید بیاید؟",
    correctionTemplate: (m) => {
      const pastMap: Record<string, string> = {
        go: "went",
        see: "saw",
        come: "came",
        buy: "bought",
        make: "made",
        do: "did",
        play: "played",
        write: "wrote",
        eat: "ate",
      };
      return m.replace(/\b(go|see|come|buy|make|do|play|write|eat)\b/gi, (v) => pastMap[v.toLowerCase()] || v);
    },
  },
  {
    regex: /\bdid(?:n't)?\s+(went|saw|came|bought|made|wrote|played)\b/gi,
    code: "TENSE",
    hintFa: "بعد از فعل کمکی did/didn't شکل پایه فعل می‌آید.",
    correctionTemplate: (m) => {
      const baseMap: Record<string, string> = {
        went: "go",
        saw: "see",
        came: "come",
        bought: "buy",
        made: "make",
        wrote: "write",
        played: "play",
      };
      return m.replace(/\b(went|saw|came|bought|made|wrote|played)\b/gi, (v) => baseMap[v.toLowerCase()] || v);
    },
  },
  // PLURAL
  {
    regex: /\b(two|three|four|five|many|several)\s+(child|person|man|woman|tooth|foot|car|day|book|friend)\b/gi,
    code: "PLURAL",
    hintFa: "بعد از اعداد یا صفت‌های شمارشی جمع، اسم باید به صورت جمع بیاید.",
    correctionTemplate: (m) => {
      const irrPlural: Record<string, string> = {
        child: "children",
        person: "people",
        man: "men",
        woman: "women",
        tooth: "teeth",
        foot: "feet",
      };
      return m.replace(/\b(child|person|man|woman|tooth|foot|car|day|book|friend)\b/gi, (w) => {
        const lower = w.toLowerCase();
        return irrPlural[lower] || `${w}s`;
      });
    },
  },
  // WORD CHOICE / L1
  {
    regex: /\bvery\s+food\b/gi,
    code: "WORD CHOICE",
    hintFa: "ترکیب very food غیرطبیعی است؛ منظور اهمیت یا غنای مطلب است.",
    correctionTemplate: () => "essential for our knowledge",
  },
  {
    regex: /\bdo\s+a\s+decision\b/gi,
    code: "WORD CHOICE",
    hintFa: "همنشین (Collocation) درست برای decision فعل make است نه do.",
    correctionTemplate: () => "make a decision",
  },
  {
    regex: /\bmake\s+exercise\b/gi,
    code: "WORD CHOICE",
    hintFa: "برای ورزش کردن از عبارت do exercise استفاده می‌شود.",
    correctionTemplate: () => "do exercise",
  },
  // LINK
  {
    regex: /\balthough\s+.*?\bbut\b/gi,
    code: "LINK",
    hintFa: "وقتی جمله با although شروع می‌شود، در بخش دوم نباید but بیاید.",
    correctionTemplate: (m) => m.replace(/\bbut\b/i, ""),
  },
  {
    regex: /\bbecause\s+of\s+he\b/gi,
    code: "LINK",
    hintFa: "قبل از فاعل و فعل از because استفاده کنید نه because of.",
    correctionTemplate: () => "because he",
  },
  // SPELLING
  {
    regex: /\b(teh|recieve|untill|seperate|definately|wierd|grammer|writting|freind|becouse|becuase|truely|succesful|tommorow|tommorrow|enought|thier|wich)\b/gi,
    code: "SPELLING",
    hintFa: "املای این کلمه اشتباه است؛ ترتیب حروف یا املای استاندارد آن را بازبینی کنید.",
    correctionTemplate: (m) => {
      const spellMap: Record<string, string> = {
        teh: "the",
        recieve: "receive",
        untill: "until",
        seperate: "separate",
        definately: "definitely",
        wierd: "weird",
        grammer: "grammar",
        writting: "writing",
        freind: "friend",
        becouse: "because",
        becuase: "because",
        truely: "truly",
        succesful: "successful",
        tommorow: "tomorrow",
        tommorrow: "tomorrow",
        enought: "enough",
        thier: "their",
        wich: "which",
      };
      return spellMap[m.toLowerCase()] || m;
    },
  },
  // ADDITIONAL PREPOSITIONS & AGREEMENT
  {
    regex: /\b(arrive\s+to)\b/gi,
    code: "PREPOSITION",
    hintFa: "فعل arrive با حرف اضافه in یا at به کار می‌رود نه to.",
    correctionTemplate: () => "arrive at",
  },
  {
    regex: /\b(discuss\s+about)\b/gi,
    code: "PREPOSITION",
    hintFa: "فعل discuss نیازی به حرف اضافه about ندارد و مستقیم مفعول می‌گیرد.",
    correctionTemplate: () => "discuss",
  },
  {
    regex: /\b(good\s+in)\b/gi,
    code: "PREPOSITION",
    hintFa: "برای بیان مهارت در کاری، بعد از good از حرف اضافه at استفاده می‌شود.",
    correctionTemplate: () => "good at",
  },
  {
    regex: /\b(everybody|everyone|somebody|someone)\s+(are|have|were)\b/gi,
    code: "AGREEMENT",
    hintFa: "ضمایر نامعین مثل everyone از نظر گرامری مفرد تلقی شده و فعل مفرد می‌گیرند.",
    correctionTemplate: (m) => {
      const parts = m.split(/\s+/);
      const rep: Record<string, string> = { are: "is", have: "has", were: "was" };
      return `${parts[0]} ${rep[parts[1]?.toLowerCase()] || parts[1]}`;
    },
  },
  // SENTENCE
  {
    regex: /^[a-z]\w*/gm,
    code: "SENTENCE",
    hintFa: "حرف اول جمله در زبان انگلیسی همیشه با حرف بزرگ شروع می‌شود.",
    correctionTemplate: (m) => m.charAt(0).toUpperCase() + m.slice(1),
  },
  {
    regex: /(?<=[.!?]\s+)[a-z]\w*/g,
    code: "SENTENCE",
    hintFa: "حرف اول جمله پس از علامت نقطه یا پایان باید با حرف بزرگ شروع شود.",
    correctionTemplate: (m) => m.charAt(0).toUpperCase() + m.slice(1),
  },
  {
    regex: /\b(?:is|was|are|were)\s+very\s+important\s+that\b/gi,
    code: "SENTENCE",
    hintFa: "در زبان انگلیسی فاعل صوری (It is) نباید حذف شود.",
    correctionTemplate: (m) => `It ${m}`,
  },
];

/**
 * Main Evaluation Function
 */
export function evaluateStudentWriting(
  text: string,
  cefr: CefrLevel,
  suggestedWords: string[],
  draftType: "draft1" | "draft2",
  previousDraftScore: number = 0,
  stageNumber: number = 1
): WritingEvaluationOutput {
  const trimmed = text.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;

  // Split into sentences (by . ! ?)
  const rawSentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = rawSentences.length;

  const req = getStageRequirements(cefr, stageNumber);

  // Match Suggested Words from warm-up
  const lowerText = trimmed.toLowerCase();
  const usedSuggestedWords: string[] = [];
  const missingSuggestedWords: string[] = [];

  for (const sw of suggestedWords) {
    if (lowerText.includes(sw.toLowerCase())) {
      usedSuggestedWords.push(sw);
    } else {
      missingSuggestedWords.push(sw);
    }
  }

  // Detect Errors via Taxonomy Rules
  const detectedErrors: DetectedErrorItem[] = [];
  let errorIdCounter = 1;

  for (const rule of COMMON_DIAGNOSTIC_RULES) {
    let match: RegExpExecArray | null;
    const rx = new RegExp(rule.regex.source, rule.regex.flags);
    while ((match = rx.exec(trimmed)) !== null) {
      const matchText = match[0];
      const startIdx = match.index;
      const endIdx = startIdx + matchText.length;

      // Avoid overlapping duplicates
      const hasOverlap = detectedErrors.some(
        (e) => Math.max(e.startIndex, startIdx) < Math.min(e.endIndex, endIdx)
      );

      if (!hasOverlap) {
        detectedErrors.push({
          id: `err-${errorIdCounter++}`,
          code: rule.code,
          originalText: matchText,
          startIndex: startIdx,
          endIndex: endIdx,
          shortHintFa: rule.hintFa,
          directCorrection: rule.correctionTemplate(matchText),
        });
      }
    }
  }

  // Calculate Scores
  // 1. Accuracy Component (max 45)
  const penaltyPerError = cefr === "A1" ? 4 : cefr === "A2" ? 3.5 : 3;
  const accuracyScore = Math.max(10, Math.round(45 - detectedErrors.length * penaltyPerError));

  // 2. Vocabulary Component (max 30)
  const totalSuggested = Math.max(1, suggestedWords.length);
  const vocabRatio = usedSuggestedWords.length / totalSuggested;
  const vocabScore = Math.round(vocabRatio * 30);

  // 3. Length & Structure Component (max 25)
  const sentenceRatio = Math.min(1.2, sentenceCount / Math.max(1, req.minSentences));
  const wordRatio = Math.min(1.2, wordCount / Math.max(1, req.minWords));
  const lengthScore = Math.min(25, Math.round(((sentenceRatio + wordRatio) / 2) * 25));

  const rawScore = accuracyScore + vocabScore + lengthScore;
  const score = Math.max(15, Math.min(100, rawScore));

  // Improvement Bonus for Draft 2
  let improvementBonusXp = 0;
  if (draftType === "draft2") {
    if (score > previousDraftScore) {
      const diff = score - previousDraftScore;
      improvementBonusXp = Math.round(diff * 8); // e.g. +15 points diff = +120 XP!
    }
  }

  // Progression pass threshold: score >= 60 for next level
  const isReadyForNextLevel = draftType === "draft2" && score >= 60;

  return {
    draftType,
    score,
    wordCount,
    sentenceCount,
    requiredSentences: req.minSentences,
    requiredWords: req.minWords,
    detectedErrors,
    usedSuggestedWords,
    missingSuggestedWords,
    improvementBonusXp,
    isReadyForNextLevel,
  };
}
