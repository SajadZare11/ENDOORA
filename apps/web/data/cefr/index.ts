import type { CEFRLevel, CEFRWord } from "./types.ts";
import { CEFR_A1_VOCAB } from "./a1-vocab.ts";
import { CEFR_A2_VOCAB } from "./a2-vocab.ts";
import { CEFR_B1_VOCAB } from "./b1-vocab.ts";
import { CEFR_B2_VOCAB } from "./b2-vocab.ts";
import { CEFR_C1_VOCAB } from "./c1-vocab.ts";
import { CEFR_C2_VOCAB } from "./c2-vocab.ts";

export * from "./types.ts";
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
