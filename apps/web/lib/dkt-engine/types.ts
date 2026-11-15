import type { CefrLevel } from "../../data/skills/games/types";

export type DktDomainId =
  | "tenses"
  | "modals"
  | "conditionals"
  | "passive"
  | "clauses"
  | "discourse";

export interface DktConcept {
  id: string; // e.g. "a1-01", "b2-03"
  cefr: CefrLevel;
  stageNumber: number; // 1 to 10
  titleEn: string;
  titleFa: string;
  domain: DktDomainId;
  prerequisites: string[]; // Concept IDs that directly reinforce this concept
  decayRateLambda: number; // Base forgetting curve parameter (per day)
  difficulty: number; // 0.1 to 1.0
  circuitTargetConceptMatch?: string[]; // Keywords or phrases in circuit targetConcept
}

export interface DktInteraction {
  conceptId: string;
  isCorrect: boolean;
  isTrap?: boolean;
  latencyMs: number; // Decision reaction duration
  timestamp: number;
  deltaHours: number; // Time elapsed since previous practice of this concept
}

export interface DktDomainMastery {
  domain: DktDomainId;
  titleFa: string;
  titleEn: string;
  currentRecallProb: number; // 0.0 - 1.0 (estimated probability of recall today)
  projectedDecay7Days: number; // 0.0 - 1.0 (estimated probability after 7 days without practice)
  interactionCount: number;
  status: "mastered" | "spaced_retrieval_zpd" | "decaying";
}

export interface DktPredictionResult {
  conceptMastery: Record<string, number>; // conceptId -> recall probability (0.0 - 1.0)
  domainMastery: Record<DktDomainId, DktDomainMastery>;
  overallRetentionIndex: number; // 0 - 100%
  criticalZpdConcepts: string[]; // Concepts in the 40% - 65% critical forgetting window
  decayingConcepts: string[]; // Concepts with recall prob < 40%
  totalInteractions: number;
  lastUpdated: number;
}

export interface DktStoredState {
  version: number;
  hiddenState: number[]; // 64-element float vector
  conceptTimestamps: Record<string, number>; // conceptId -> epoch ms
  conceptSuccessCounts: Record<string, number>;
  conceptFailureCounts: Record<string, number>;
  totalInteractions: number;
  lastUpdated: number;
}
