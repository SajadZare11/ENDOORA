/**
 * EnDoora Cognitive AI & LinUCB Bandit Type Contracts
 * Engine 6: Siamese Bi-Encoder + Disjoint LinUCB Bandit
 */

import type { HexEdgeOption } from "../../data/skills/games/types";

export type TrapCategory =
  | "phonetic_ortho"
  | "semantic_siamese"
  | "morphological"
  | "l1_persian";

export const TRAP_CATEGORIES: readonly TrapCategory[] = [
  "phonetic_ortho",
  "semantic_siamese",
  "morphological",
  "l1_persian",
] as const;

export type Vector4 = [number, number, number, number];

export type Matrix4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export interface EnDooraTriModalTelemetry {
  /** 2D-CNN GOP phoneme error rate (0.0 to 1.0; 1.0 = high error) */
  phonemeErrorRate?: number;
  /** Multi-Scale BERT semantic deficit (0.0 to 1.0; 1.0 = poor semantic coherence) */
  semanticDeficit?: number;
  /** DKT-Forget 64D latent hidden state vector */
  dktHiddenState?: number[];
  /** Average grammatical deficit (0.0 to 1.0) derived from DKT mastery */
  dktGrammarDeficit?: number;
  /** Reaction / cognitive hesitation latency in milliseconds */
  latencyMs?: number;
  /** Historical count of traps triggered per category */
  trapHistory?: Partial<Record<TrapCategory, number>>;
  /** Backward-compatible alias for phonemeErrorRate */
  gopPhonemeErrorRate?: number;
  /** Backward-compatible alias for semanticDeficit */
  bertSemanticDeficit?: number;
}

export interface DistractorCandidate {
  id: string;
  text: string;
  category: TrapCategory;
  /** L2-normalized 4D feature vector: ||features||_2 = 1.0 +/- 1e-4 */
  features: Vector4;
  metadata?: {
    levenshteinSim?: number;
    siameseSim?: number;
    morphDerivScore?: number;
    l1InterferenceScore?: number;
    explanationFa?: string;
    [key: string]: unknown;
  };
}

export interface AdaptiveQuestionPayload {
  id: string;
  prompt: string;
  promptFa?: string;
  correctAnswer: string;
  distractorPool: DistractorCandidate[]; // 12 items (3 per category)
  explanationFa?: string;
  section?: string;
  cefr_level?: string;
  cefrLevel?: string;
  question?: string;
  correct_option?: string;
  distractor_pool?: DistractorCandidate[];
  prompt_fa?: string;
  explanation_fa?: string;
}

export interface AssembledQuestion {
  questionId: string;
  prompt: string;
  promptFa?: string;
  options: string[]; // 4 options (1 correct + 3 top distractors) shuffled
  correctOptionIndex: number; // 0..3
  selectedDistractors: DistractorCandidate[];
  assemblyTimeMs: number;
  explorationBonusMap?: Record<string, number>;
  scores?: Record<string, number>;
}

export interface LinUCBArmState {
  category: TrapCategory;
  A_inv: Matrix4x4; // 4x4 inverse covariance matrix
  b: Vector4;       // 4D cumulative reward vector
  pulls: number;
  rewards: number;
}

export interface LinUCBBanditStoredState {
  version: number;
  arms: Record<TrapCategory, LinUCBArmState>;
  alpha: number;
  totalInteractions: number;
  lastUpdated: number;
}

export interface LinUCBInteractionFeedback {
  category: TrapCategory;
  features: Vector4;
  trapTriggered: boolean;
  latencyMs?: number;
  reward?: number;
}

/**
 * Flexible Question Payload accepting snake_case (Python pipeline)
 * or camelCase (TypeScript interfaces) or partial overrides.
 */
export interface RawAdaptiveQuestionPayload {
  id: string;
  section?: string;
  cefr_level?: string;
  cefrLevel?: string;
  question?: string;
  prompt?: string;
  prompt_fa?: string;
  promptFa?: string;
  correct_option?: string;
  correctAnswer?: string;
  distractor_pool?: DistractorCandidate[];
  distractorPool?: DistractorCandidate[];
  explanation_fa?: string;
  explanationFa?: string;
  [key: string]: unknown;
}

/**
 * High-level interactive option metadata for UI presentation
 */
export interface AdaptiveRenderedOption {
  index: number;                        // 0..3
  text: string;                         // Option label
  isCorrect: boolean;                   // Target correct answer
  isTrap: boolean;                      // Distractor trap
  trapCategory: TrapCategory | null;    // Trap category if distractor, null if correct
  candidateId: string | null;           // Distractor candidate ID
  features: Vector4 | null;             // 4D feature vector
  explanationFa?: string;               // Persian educational explanation
  ucbScore?: number;                    // Calculated LinUCB exploration score
}

/**
 * Payload produced upon user option selection
 */
export interface AdaptiveInteractionResult {
  questionId: string;
  selectedIndex: number;                // 0..3
  selectedText: string;
  isCorrect: boolean;
  isTrap: boolean;
  trapCategory: TrapCategory | null;
  features: Vector4 | null;
  latencyMs: number;                    // Measured via performance.now()
  banditReward: number;                 // Reward calculated for bandit arm
  banditUpdated: boolean;
  dktUpdated: boolean;
  conceptId?: string;
  timestamp: number;
}

/**
 * Formatting options for renderAdaptiveHexQuestion
 */
export interface RenderAdaptiveHexOptions {
  /** Slot order mapping. Default: [4, 5, 0, 1] */
  edgeSlotOrder?: number[];
  /** Destination node ID when correct option is selected */
  nextNodeId?: string;
  /** Destination node ID when distractor is selected */
  distractorNextNodeId?: string;
  /** Combo multiplier awarded on correct selection (default: 1.5) */
  comboBoost?: number;
  /** Flag for branching clause representation (default: false) */
  isBranchingClause?: boolean;
}

/**
 * Configuration options for the useAdaptiveQuestion hook
 */
export interface UseAdaptiveQuestionOptions {
  /**
   * Question payload (snake_case, camelCase, or question ID string).
   * If a string is provided, it is resolved from the preloaded question bank.
   */
  question?: AdaptiveQuestionPayload | RawAdaptiveQuestionPayload | string | null;

  /**
   * Optional tri-modal telemetry input (CNN-GOP, BERT, DKT, latency).
   */
  telemetry?: EnDooraTriModalTelemetry | (() => EnDooraTriModalTelemetry);

  /**
   * LinUCB exploration parameter alpha (default: 0.5).
   */
  alpha?: number;

  /**
   * Target DKT concept ID (e.g. "a1-01").
   * Defaults to auto-inferred from question ID or CEFR level.
   */
  conceptId?: string;

  /**
   * Automatically dispatch interaction feedback to LinUCB bandit engine.
   * Default: true.
   */
  autoUpdateBandit?: boolean;

  /**
   * Automatically dispatch interaction feedback to DKT-Forget neural engine.
   * Default: true.
   */
  autoUpdateDkt?: boolean;

  /**
   * Callback fired immediately when user selects an option.
   */
  onAnswer?: (result: AdaptiveInteractionResult) => void;

  /**
   * Optional custom bandit instance (defaults to EnDooraLinUCBBandit.getInstance()).
   */
  banditInstance?: import("./linucb-bandit-engine").EnDooraLinUCBBandit;
}

/**
 * Hook return contract
 */
export interface UseAdaptiveQuestionReturn {
  // Assembled Question State
  assembledQuestion: AssembledQuestion | null;
  options: AdaptiveRenderedOption[];
  correctOptionIndex: number | null;
  selectedOptionIndex: number | null;
  selectedOption: AdaptiveRenderedOption | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  latencyMs: number | null;
  assemblyTimeMs: number;
  isLoading: boolean;
  error: Error | null;

  // Actions
  selectOption: (index: number, overrideLatencyMs?: number) => AdaptiveInteractionResult | null;
  resetQuestion: (nextQuestion?: AdaptiveQuestionPayload | RawAdaptiveQuestionPayload | string) => void;

  // Hex-Grid Helpers
  renderHexOptions: (options?: RenderAdaptiveHexOptions) => HexEdgeOption[];

  // Cognitive Telemetry Snapshot
  telemetry: EnDooraTriModalTelemetry;
  contextVector: Vector4;
}

