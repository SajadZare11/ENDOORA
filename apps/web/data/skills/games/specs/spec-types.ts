// Type definition for American English File grammar sentence specs

export interface GrammarSentenceStepSpec {
  corr: string;
  dist: string[];
  trap?: { text: string; exp: string };
  branching?: { text: string; nextNodeId?: string; comboBoost?: number };
}

export interface GrammarSentenceSpec {
  prompt: string;
  trans: string;
  steps: GrammarSentenceStepSpec[];
}

export type TierSpecMap = Record<number, GrammarSentenceSpec[]>;
