import type { CEFRWord } from "./types.ts";
import data from "./c2-vocab.json" with { type: "json" };

export const CEFR_C2_VOCAB: CEFRWord[] = data as CEFRWord[];
