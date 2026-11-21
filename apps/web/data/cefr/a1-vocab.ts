import type { CEFRWord } from "./types.ts";
import data from "./a1-vocab.json" with { type: "json" };

import { hasUsableGloss } from "./quality.ts";

export const CEFR_A1_VOCAB: CEFRWord[] = (data as CEFRWord[]).filter(hasUsableGloss);
