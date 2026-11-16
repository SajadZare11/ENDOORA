export type CEFRBand = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type IELTSSkill = "listening" | "reading" | "writing" | "speaking";
export const IELTS_SKILLS: IELTSSkill[] = [
  "listening",
  "reading",
  "writing",
  "speaking",
];
export interface SkillBeliefNode {
  skillId: number;
  name: string;
  aefReference: string;
  cefr: CEFRBand;
  mean: number;
  variance: number;
  decayRatePerHour: number;
  lastUpdatedTimestamp: number;
  prerequisites: number[];
  evidenceCount?: number;
}
export interface TwinPrediction {
  predictedProbability: number;
  epistemicUncertainty: number;
  /** Opaque, immutable pre-answer context; never recompute this using the answer. */
  context?: number[];
  skillIds?: number[];
  timestamp?: number;
  itemId?: string;
}
export interface MultiModalObservation {
  skillIds: number[];
  observedScore: number;
  modality:
    | "mcq_bandit"
    | "bert_writing"
    | "cnn_pronunciation"
    | "hex_grammar"
    | "sherlock_deduction";
  guessingFloor: number;
  latencyMs: number;
  expectedLatencyMs: number;
  gazeDistractionIndex: number;
  cognitiveLoadIndex: number;
  trapVulnerabilityVector?: [number, number, number, number];
  ieltsSkill?: IELTSSkill;
  discrimination?: number;
  slipRate?: number;
  itemId?: string;
  prediction?: TwinPrediction;
  timestamp?: number;
}
export interface TwinCalibrationMetrics {
  rollingBrierError: number;
  rollingMAE: number;
  studentResidualBias: number;
  totalInteractions: number;
  shieldedInteractions: number;
}
export interface Belief {
  mean: number;
  variance: number;
  evidenceCount: number;
  timestamp: number;
}
export interface BandEstimate {
  band: number;
  ci95: [number, number];
}
export interface IELTSBandForecast {
  listening: BandEstimate;
  reading: BandEstimate;
  writing: BandEstimate;
  speaking: BandEstimate;
  overall: BandEstimate;
  predictedCEFR: CEFRBand;
  twinConfidencePct: number;
}
export interface CounterfactualTrajectoryPoint {
  dayOffset: number;
  projectedOverallBand: number;
  lowerBoundBand: number;
  upperBoundBand: number;
  noStudyBand: number;
  noStudyLowerBand: number;
  noStudyUpperBand: number;
  retentionPctIfNoStudy: number;
  retentionPctWithAdaptiveStudy: number;
}
export interface TwinHistoryEntry {
  timestamp: number;
  modality: MultiModalObservation["modality"];
  skillIds: number[];
  score: number;
  prediction: number;
  residual: number;
  reliability: number;
  noise: number;
  gain: number;
  posterior: number;
  itemId?: string;
}
export interface TwinSnapshot {
  version: 2;
  nodes: SkillBeliefNode[];
  modalityMastery: Record<IELTSSkill, Belief>;
  calibration: TwinCalibrationMetrics;
  errorProfile4D: number[];
  residualWeights: number[];
  recurrentResidual: number;
  history: TwinHistoryEntry[];
  itemResidualBias: Array<[string, number]>;
}
export interface TwinStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface TwinOptions {
  storage?: TwinStorage | null;
  storageKey?: string;
  now?: () => number;
}
export interface TwinMockQuestion {
  id: string;
  number: number;
  prompt: string;
  skillIds: number[];
  guessingFloor: number;
  discrimination: number;
  slipRate: number;
  mapped: boolean;
}
export interface TwinMock {
  id: string;
  title: string;
  skill: IELTSSkill;
  questions: TwinMockQuestion[];
}
export interface TwinMockResult {
  questions: Array<TwinMockQuestion & TwinPrediction & { atRisk: boolean }>;
  expectedCorrect: number;
  mappedCount: number;
  elapsedMs: number;
  warmupSkillIds: number[];
}
