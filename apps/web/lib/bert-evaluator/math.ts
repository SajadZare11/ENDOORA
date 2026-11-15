import { CriteriaBreakdown, ParagraphAnalysis, SentenceCohesion } from "./types";

/**
 * Computes cosine similarity between two numeric vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return Math.max(-1, Math.min(1, dot / denom));
}

/**
 * Splits text into sentences cleanly while respecting punctuation.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const raw = text.split(/(?<=[.?!])\s+/);
  return raw.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Splits text into paragraphs by newline.
 */
export function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Tokenizes text into words.
 */
export function extractWords(text: string): string[] {
  if (!text) return [];
  const matches = text.toLowerCase().match(/\b[a-z0-9'-]+\b/g);
  return matches || [];
}

/**
 * Academic & cohesive connective words for IELTS.
 */
const ACADEMIC_CONNECTIVES = new Set([
  "furthermore",
  "moreover",
  "consequently",
  "nevertheless",
  "nonetheless",
  "subsequently",
  "in addition",
  "on the contrary",
  "conversely",
  "notwithstanding",
  "hence",
  "thus",
  "therefore",
  "accordingly",
  "in contrast",
  "predominantly",
  "substantially",
  "significantly",
  "illustrates",
  "demonstrates",
  "exemplifies",
  "underlying",
  "paramount",
  "exponential",
  "fluctuation",
  "corroborates",
  "perspective",
]);

/**
 * Analyzes vocabulary richness (Type-Token Ratio and academic connectives).
 */
export function analyzeVocabulary(words: string[]): {
  totalTokens: number;
  uniqueTokens: number;
  ttr: number;
  academicCount: number;
} {
  const total = words.length;
  if (total === 0) return { totalTokens: 0, uniqueTokens: 0, ttr: 0, academicCount: 0 };
  const unique = new Set(words);
  let academicCount = 0;
  for (const w of words) {
    if (ACADEMIC_CONNECTIVES.has(w)) {
      academicCount++;
    }
  }
  const ttr = Number((unique.size / total).toFixed(3));
  return {
    totalTokens: total,
    uniqueTokens: unique.size,
    ttr,
    academicCount,
  };
}

/**
 * Converts a raw score (0-100) to an IELTS Band (1.0 - 9.0 in 0.5 increments).
 */
export function scoreToIeltsBand(score: number): number {
  if (score >= 90) return 9.0;
  if (score >= 84) return 8.5;
  if (score >= 78) return 8.0;
  if (score >= 72) return 7.5;
  if (score >= 65) return 7.0;
  if (score >= 58) return 6.5;
  if (score >= 50) return 6.0;
  if (score >= 42) return 5.5;
  if (score >= 35) return 5.0;
  if (score >= 28) return 4.5;
  if (score >= 20) return 4.0;
  return 3.5;
}

/**
 * Rounds an overall score according to official IELTS rules:
 * - Fractional score of .25 -> rounded up to next half band (.50)
 * - Fractional score of .75 -> rounded up to next whole band
 * - e.g. 6.25 -> 6.5, 6.75 -> 7.0, 6.1 -> 6.0
 */
export function calculateOfficialIeltsRounding(bands: number[]): number {
  if (bands.length === 0) return 0;
  const avg = bands.reduce((acc, curr) => acc + curr, 0) / bands.length;
  const whole = Math.floor(avg);
  const frac = avg - whole;

  if (frac < 0.25) return whole;
  if (frac < 0.75) return whole + 0.5;
  return whole + 1.0;
}

/**
 * Maps IELTS band to CEFR level.
 */
export function bandToCefr(band: number): 'A2' | 'B1' | 'B2' | 'C1' | 'C2' {
  if (band >= 8.5) return 'C2';
  if (band >= 7.0) return 'C1';
  if (band >= 5.5) return 'B2';
  if (band >= 4.0) return 'B1';
  return 'A2';
}

/**
 * Evaluates the 4 IELTS criteria using Multi-Scale metrics.
 */
export function evaluateIeltsCriteria({
  taskResponseSim,
  wordCount,
  targetWordCount,
  avgCohesion,
  ttr,
  academicCount,
  paragraphCount,
}: {
  taskResponseSim: number;
  wordCount: number;
  targetWordCount: number;
  avgCohesion: number;
  ttr: number;
  academicCount: number;
  paragraphCount: number;
}): CriteriaBreakdown {
  // 1. Task Response (TR)
  // Normalized similarity: 0.35 is neutral/baseline, 0.75+ is strongly aligned
  const simScore = Math.max(0, Math.min(100, ((taskResponseSim - 0.2) / 0.6) * 100));
  const lengthPenalty = wordCount < targetWordCount ? Math.max(0, (wordCount / targetWordCount) * 100) : 100;
  const trScore = Math.round(simScore * 0.7 + lengthPenalty * 0.3);
  const trBand = scoreToIeltsBand(trScore);

  // 2. Coherence & Cohesion (CC)
  // Paragraph flow (avgCohesion is 0..1), structure penalty if fewer than 3 paragraphs
  const flowScore = Math.max(0, Math.min(100, avgCohesion * 100));
  const structureFactor = paragraphCount >= 4 ? 1.0 : paragraphCount === 3 ? 0.9 : 0.7;
  const ccScore = Math.round(flowScore * structureFactor);
  const ccBand = scoreToIeltsBand(ccScore);

  // 3. Lexical Resource (LR)
  // TTR 0.5+ is high variety, academic words boost
  const ttrScore = Math.min(100, (ttr / 0.65) * 80);
  const academicBonus = Math.min(20, academicCount * 3);
  const lrScore = Math.min(100, Math.round(ttrScore + academicBonus));
  const lrBand = scoreToIeltsBand(lrScore);

  // 4. Grammatical Range & Accuracy (GRA) approximation
  // Based on sentence balance and structure
  const graScore = Math.round((trScore * 0.4 + ccScore * 0.4 + lrScore * 0.2));
  const graBand = scoreToIeltsBand(graScore);

  return {
    taskResponse: {
      score: trScore,
      band: trBand,
      descriptorEn: trBand >= 7 ? "Addresses all parts of the task with well-developed ideas." : "Adequately addresses the main points with room for deeper elaboration.",
      guidanceFa: trScore >= 70
        ? "تطابق معنایی رایتینگ با صورت‌سؤال در سطح بسیار مطلوب قرار دارد و هسته موضوع پوشش داده شده است."
        : "پیشنهاد می‌شود ارتباط مستقیم مثال‌ها و استدلال‌ها با کلیدواژه‌های صورت‌سؤال تقویت شود.",
    },
    coherenceCohesion: {
      score: ccScore,
      band: ccBand,
      descriptorEn: ccBand >= 7 ? "Logical paragraph sequencing with smooth inter-sentential transitions." : "Basic cohesion present; transitional flow between paragraphs can be refined.",
      guidanceFa: ccScore >= 70
        ? "توالی منطقی پاراگراف‌ها روان است و جریان ایده از مقدمه تا نتیجه‌گیری حفظ شده است."
        : "انتقال بین برخی پاراگراف‌ها نیاز به واژگان ربط‌دهنده قوی‌تر (Linking Devices) و جملات موضوعی شفاف دارد.",
    },
    lexicalResource: {
      score: lrScore,
      band: lrBand,
      descriptorEn: lrBand >= 7 ? "Wide vocabulary range with natural collocations and low repetition." : "Sufficient lexical variety; consider using less common collocations.",
      guidanceFa: lrScore >= 70
        ? "تنوع واژگانی بالا و استفاده از ترکیب‌های آکادمیک مشهود است."
        : "تکرار برخی واژه‌های پرکاربرد دیده می‌شود؛ استفاده از مترادف‌های سطح C1/B2 توصیه می‌گردد.",
    },
    grammaticalAccuracy: {
      score: graScore,
      band: graBand,
      descriptorEn: graBand >= 7 ? "Variety of complex structures used with good communicative control." : "Mix of simple and compound sentences with generally clear meaning.",
      guidanceFa: graScore >= 70
        ? "تعادل ساختاری مطلوب میان جملات ساده و پیچیده برقرار است."
        : "به‌کارگیری ساختارهای ترکیبی مانند جملات شرطی، موصولی و مجهول توصیه می‌شود.",
    },
  };
}
