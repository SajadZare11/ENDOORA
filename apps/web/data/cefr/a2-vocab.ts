import type { CEFRWord } from "./types.ts";
import data from "./a2-vocab.json" with { type: "json" };

export const CEFR_A2_VOCAB: CEFRWord[] = data as CEFRWord[];
