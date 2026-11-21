import type { CEFRWord } from "./types.ts";
import data from "./b2-vocab.json" with { type: "json" };

import { hasUsableGloss } from "./quality.ts";

export const CEFR_B2_VOCAB: CEFRWord[] = (data as CEFRWord[]).filter(hasUsableGloss);
