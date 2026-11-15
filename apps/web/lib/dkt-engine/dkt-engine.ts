import type { CefrLevel, GrammarCircuitRound } from "../../data/skills/games/types.ts";
import { AEF_60_CONCEPTS, CONCEPT_MAP, DKT_DOMAINS } from "./concepts.ts";
import {
  buildInputVector,
  HIDDEN_DIM,
  predictFromState,
  stepDktGru,
} from "./gru-cell.ts";
import type {
  DktDomainId,
  DktDomainMastery,
  DktPredictionResult,
  DktStoredState,
} from "./types.ts";
import { getDktWeights } from "./weights.ts";

const STORAGE_KEY = "endoora_dkt_state_v1";

const CEFR_SCALARS: Record<CefrLevel, number> = {
  A1: 0.15,
  A2: 0.35,
  B1: 0.55,
  B2: 0.72,
  C1: 0.88,
  C2: 1.0,
};

export class DktEngine {
  private static instance: DktEngine | null = null;
  private state: DktStoredState;

  private constructor() {
    this.state = this.loadState();
  }

  public static getInstance(): DktEngine {
    if (!DktEngine.instance) {
      DktEngine.instance = new DktEngine();
    }
    return DktEngine.instance;
  }

  private getInitialState(): DktStoredState {
    return {
      version: 1,
      hiddenState: new Array(HIDDEN_DIM).fill(0),
      conceptTimestamps: {},
      conceptSuccessCounts: {},
      conceptFailureCounts: {},
      totalInteractions: 0,
      lastUpdated: Date.now(),
    };
  }

  private loadState(): DktStoredState {
    if (typeof window === "undefined") {
      return this.getInitialState();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getInitialState();
      const parsed = JSON.parse(raw) as DktStoredState;
      if (
        !parsed ||
        !Array.isArray(parsed.hiddenState) ||
        parsed.hiddenState.length !== HIDDEN_DIM
      ) {
        return this.getInitialState();
      }
      return parsed;
    } catch {
      return this.getInitialState();
    }
  }

  private saveState(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage quota or private browsing fallback
    }
  }

  /**
   * Resets cognitive state to fresh initial baseline.
   */
  public resetState(): void {
    this.state = this.getInitialState();
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Records a learner interaction, executes a GRU forward step, and persists state.
   */
  public recordInteraction({
    conceptId,
    isCorrect,
    isTrap = false,
    latencyMs,
  }: {
    conceptId: string;
    isCorrect: boolean;
    isTrap?: boolean;
    latencyMs: number;
  }): DktPredictionResult {
    const concept = CONCEPT_MAP[conceptId] || AEF_60_CONCEPTS[0];
    const conceptIdx = AEF_60_CONCEPTS.findIndex((c) => c.id === concept.id);
    const now = Date.now();

    // Elapsed time since last interaction of this concept
    const lastConceptTime = this.state.conceptTimestamps[concept.id] || now;
    const deltaHours = Math.max(0, (now - lastConceptTime) / (1000 * 60 * 60));
    const deltaDays = deltaHours / 24;

    const weights = getDktWeights();
    const hPrev = new Float32Array(this.state.hiddenState);

    const cefrScalar = CEFR_SCALARS[concept.cefr] || 0.5;
    const x = buildInputVector({
      conceptIndex: conceptIdx,
      isCorrect,
      isTrap,
      latencyMs,
      deltaHours,
      cefrScalar,
      difficulty: concept.difficulty,
    });

    const { hNext } = stepDktGru({
      x,
      hPrev,
      deltaDays,
      weights,
    });

    // Update state
    this.state.hiddenState = Array.from(hNext);
    this.state.conceptTimestamps[concept.id] = now;
    if (isCorrect) {
      this.state.conceptSuccessCounts[concept.id] =
        (this.state.conceptSuccessCounts[concept.id] || 0) + 1;
    } else {
      this.state.conceptFailureCounts[concept.id] =
        (this.state.conceptFailureCounts[concept.id] || 0) + 1;
    }
    this.state.totalInteractions += 1;
    this.state.lastUpdated = now;

    this.saveState();
    return this.getPredictions();
  }

  /**
   * Computes current recall predictions, domain masteries, and ZPD recommendations.
   */
  public getPredictions(): DktPredictionResult {
    const weights = getDktWeights();
    const hCurrent = new Float32Array(this.state.hiddenState);
    const now = Date.now();
    const elapsedDays = Math.max(0, (now - this.state.lastUpdated) / (1000 * 60 * 60 * 24));

    // 1. Current Recall Predictions
    const currentPreds = predictFromState(hCurrent, elapsedDays, weights);

    // 2. Projected 7-Day Memory Decay
    const futurePreds = predictFromState(hCurrent, elapsedDays + 7, weights);

    const conceptMastery: Record<string, number> = {};
    const criticalZpdConcepts: string[] = [];
    const decayingConcepts: string[] = [];

    // Domain aggregators
    const domainAccumulators: Record<
      DktDomainId,
      { currentSum: number; futureSum: number; count: number; interactions: number }
    > = {
      tenses: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
      modals: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
      conditionals: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
      passive: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
      clauses: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
      discourse: { currentSum: 0, futureSum: 0, count: 0, interactions: 0 },
    };

    for (let i = 0; i < AEF_60_CONCEPTS.length; i++) {
      const c = AEF_60_CONCEPTS[i];
      const prob = Number(currentPreds[i].toFixed(3));
      const futureProb = Number(futurePreds[i].toFixed(3));
      conceptMastery[c.id] = prob;

      // ZPD: Zone of Proximal Development & Spaced Retrieval Threshold [0.40 - 0.65]
      if (prob >= 0.4 && prob <= 0.65) {
        criticalZpdConcepts.push(c.id);
      } else if (prob < 0.4) {
        decayingConcepts.push(c.id);
      }

      const acc = domainAccumulators[c.domain];
      if (acc) {
        acc.currentSum += prob;
        acc.futureSum += futureProb;
        acc.count += 1;
        acc.interactions +=
          (this.state.conceptSuccessCounts[c.id] || 0) +
          (this.state.conceptFailureCounts[c.id] || 0);
      }
    }

    const domainMastery = {} as Record<DktDomainId, DktDomainMastery>;
    let totalScoreSum = 0;
    let totalDomainCount = 0;

    for (const dKey of Object.keys(DKT_DOMAINS) as DktDomainId[]) {
      const meta = DKT_DOMAINS[dKey];
      const acc = domainAccumulators[dKey];
      const avgCurrent = acc.count > 0 ? acc.currentSum / acc.count : 0.5;
      const avgFuture = acc.count > 0 ? acc.futureSum / acc.count : 0.4;

      let status: DktDomainMastery["status"] = "spaced_retrieval_zpd";
      if (avgCurrent >= 0.72) status = "mastered";
      else if (avgCurrent < 0.42) status = "decaying";

      domainMastery[dKey] = {
        domain: dKey,
        titleFa: meta.titleFa,
        titleEn: meta.titleEn,
        currentRecallProb: Number(avgCurrent.toFixed(3)),
        projectedDecay7Days: Number(avgFuture.toFixed(3)),
        interactionCount: acc.interactions,
        status,
      };

      totalScoreSum += avgCurrent;
      totalDomainCount += 1;
    }

    const overallRetentionIndex = Math.round(
      (totalScoreSum / Math.max(1, totalDomainCount)) * 100
    );

    return {
      conceptMastery,
      domainMastery,
      overallRetentionIndex,
      criticalZpdConcepts,
      decayingConcepts,
      totalInteractions: this.state.totalInteractions,
      lastUpdated: this.state.lastUpdated,
    };
  }

  /**
   * Adaptive Circuit Selection for GrammarHexArena:
   * Selects the circuit whose concept is closest to the learner's Critical ZPD window (P ≈ 0.52).
   */
  public pickAdaptiveCircuit(
    circuits: GrammarCircuitRound[],
    cefr: CefrLevel,
    stageNumber: number,
    defaultIndex: number
  ): {
    selectedCircuit: GrammarCircuitRound;
    targetConceptId: string;
    recallProb: number;
    isZpdTargeted: boolean;
  } {
    if (!circuits || circuits.length === 0) {
      throw new Error("No circuits provided");
    }

    const predictions = this.getPredictions();
    const stageConcept =
      CONCEPT_MAP[`${cefr.toLowerCase()}-${String(stageNumber).padStart(2, "0")}`] ||
      AEF_60_CONCEPTS[0];

    // Target recall center for ZPD: 0.52 (where learning gain is highest)
    const ZPD_CENTER = 0.52;

    let bestCircuit = circuits[defaultIndex % circuits.length];
    let minDistance = 999;
    let chosenConceptId = stageConcept.id;
    let chosenProb = predictions.conceptMastery[stageConcept.id] || 0.5;

    for (const c of circuits) {
      // Find matching concept in concept catalog
      let matchedConcept = stageConcept;
      if (c.targetConcept) {
        const found = AEF_60_CONCEPTS.find(
          (concept) =>
            c.targetConcept.toLowerCase().includes(concept.titleEn.toLowerCase()) ||
            concept.titleEn.toLowerCase().includes(c.targetConcept.toLowerCase())
        );
        if (found) matchedConcept = found;
      }

      const prob = predictions.conceptMastery[matchedConcept.id] ?? 0.5;
      const distance = Math.abs(prob - ZPD_CENTER);

      if (distance < minDistance) {
        minDistance = distance;
        bestCircuit = c;
        chosenConceptId = matchedConcept.id;
        chosenProb = prob;
      }
    }

    const isZpdTargeted = chosenProb >= 0.4 && chosenProb <= 0.65;

    return {
      selectedCircuit: bestCircuit,
      targetConceptId: chosenConceptId,
      recallProb: chosenProb,
      isZpdTargeted,
    };
  }
}
