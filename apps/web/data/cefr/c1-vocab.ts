import type { CEFRWord } from "./types.ts";
import data from "./c1-vocab.json" with { type: "json" };

export const CEFR_C1_VOCAB: CEFRWord[] = data as CEFRWord[];
