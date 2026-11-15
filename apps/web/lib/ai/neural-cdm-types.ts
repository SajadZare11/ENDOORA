import type { CefrLevel } from "../../data/skills/games/types.ts";
import type { DktDomainId } from "../dkt-engine/types.ts";

/**
 * Diagnostic outcome classification:
 * - RANDOM_SLIP: Learner has acquired required concepts (high mastery), but errored due to
 *   speed, fatigue, attention slip, or temporary distraction.
 * - PREREQUISITE_DEFICIT: Learner lacks foundational prerequisite mastery in the DAG.
 */
export type CdmDiagnosisType = "RANDOM_SLIP" | "PREREQUISITE_DEFICIT";

export type CdmItemType = "hex_circuit" | "adaptive_question" | "ielts_question";

/**
 * A calibrated assessment item entry in the Q-Matrix.
 */
export interface CdmItem {
  item_id: string;
  item_type: CdmItemType;
  source_ref: string;
  primary_concept_id: string;
  required_concepts: string[]; // Active concepts in binary Q-vector (q_{jk} = 1)
  difficulty: number;          // beta_j in [0.1, 1.0]
  discrimination: number;      // gamma_j in [1.0, 3.5]
  slip_rate: number;           // s_j in [0.05, 0.25]
  guess_rate: number;          // g_j in [0.05, 0.30]
}

/**
 * Concept node in the AEF Prerequisite DAG with GAT attention metadata.
 */
export interface CdmDagConcept {
  id: string; // e.g. "a1-01", "c1-04"
  cefr: CefrLevel;
  stageNumber: number; // 1 to 10
  titleEn: string;
  titleFa: string;
  domain: DktDomainId;
  difficulty: number;
  decayRateLambda: number;
  depth: number;
  prerequisites: string[]; // Direct parent concept IDs
  all_ancestors: string[]; // Transitive prerequisite closure
  gat_incoming_weights: Record<string, number>; // Normalized attention weights sum to 1.0
}

export interface CdmDagEdge {
  source: string;
  target: string;
  gat_weight: number;
  domain_match: boolean;
}

export interface CdmDagData {
  num_concepts: number;
  num_edges: number;
  max_depth: number;
  concepts: CdmDagConcept[];
  edges: CdmDagEdge[];
}

export interface CdmPayload {
  version: string;
  generated_by: string;
  description: string;
  dag: CdmDagData;
  q_matrix: {
    num_items: number;
    items: CdmItem[];
  };
}

/**
 * Identified foundational root deficit causing downstream question failure.
 */
export interface CdmRootDeficit {
  conceptId: string;
  cefr: CefrLevel;
  stageNumber: number;
  titleEn: string;
  titleFa: string;
  domain: DktDomainId;
  depth: number;
  currentMastery: number; // 0.0 to 1.0 from DKT-Forget
  causalAttributionScore: number;
}

/**
 * Individual step along the causal dependency path from root concept to failed item.
 */
export interface CdmCausalChainNode {
  conceptId: string;
  titleEn: string;
  titleFa: string;
  cefr: CefrLevel;
  mastery: number;
  gatWeight: number;
}

/**
 * Real-time diagnostic evaluation of a single interaction / question failure.
 */
export interface CdmDiagnosticResult {
  itemId: string;
  itemType: CdmItemType;
  primaryConceptId: string;
  diagnosis: CdmDiagnosisType;
  slipProbability: number;      // P(Slip | Incorrect, alpha)
  masteryProbability: number;   // P(Mastery = 1 | alpha)
  effectiveProficiency: number; // Conjunctive-compensatory proficiency theta_{u,j}
  rootDeficit: CdmRootDeficit | null;
  causalChain: CdmCausalChainNode[];
  remediationFa: string;
  remediationEn: string;
  recommendedTargetCefr: CefrLevel | null;
  timestamp: number;
  latencyMs: number;
}

/**
 * Diagnostic summary for an entire IELTS mock exam module or test session.
 */
export interface CdmExamDiagnosticSummary {
  examId: string;
  skill: string;
  totalGraded: number;
  incorrectCount: number;
  slipCount: number;
  deficitCount: number;
  slipRatio: number;    // slipCount / max(1, incorrectCount)
  deficitRatio: number; // deficitCount / max(1, incorrectCount)
  topRootDeficits: Array<{
    conceptId: string;
    titleEn: string;
    titleFa: string;
    cefr: CefrLevel;
    frequency: number;
    avgMastery: number;
  }>;
  levelDeficitBreakdown: Record<CefrLevel, number>;
  remediationSummaryFa: string;
  timestamp: number;
}

/**
 * Serialized state saved in client localStorage under "endoora_neural_cdm_v1".
 */
export interface CdmStoredState {
  version: number;
  diagnosticEvents: CdmDiagnosticResult[];
  totalSlips: number;
  totalDeficits: number;
  lastExamDiagnosis: CdmExamDiagnosticSummary | null;
  lastUpdated: number;
}
