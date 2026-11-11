import type { CEFRWord } from "./types.ts";
import data from "./b1-vocab.json" with { type: "json" };

export const CEFR_B1_VOCAB: CEFRWord[] = data as CEFRWord[];
