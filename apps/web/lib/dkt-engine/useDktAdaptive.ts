"use client";

import { useState, useEffect, useCallback } from "react";
import type { CefrLevel, GrammarCircuitRound } from "../../data/skills/games/types.ts";
import { DktEngine } from "./dkt-engine.ts";
import type { DktPredictionResult } from "./types.ts";
import { GazeCognitiveEngine } from "../ai/gaze-cognitive-engine.ts";

export function useDktAdaptive() {
  const [engine] = useState(() => DktEngine.getInstance());
  const [predictions, setPredictions] = useState<DktPredictionResult | null>(null);

  const refreshPredictions = useCallback(() => {
    const res = engine.getPredictions();
    setPredictions(res);
  }, [engine]);

  useEffect(() => {
    refreshPredictions();
  }, [refreshPredictions]);

  const recordInteraction = useCallback(
    ({
      conceptId,
      isCorrect,
      isTrap = false,
      latencyMs,
      twinContext,
    }: {
      conceptId: string;
      isCorrect: boolean;
      isTrap?: boolean;
      latencyMs: number;
      twinContext?: Parameters<DktEngine['recordInteraction']>[0]['twinContext'];
    }) => {
      let updated;
      try {
        const gaze = GazeCognitiveEngine.getInstance();
        updated = gaze.recordInteractionWithCognitiveLoad({
          conceptId,
          isCorrect,
          isTrap,
          latencyMs,
          twinContext,
        });
      } catch {
        updated = engine.recordInteraction({
          conceptId,
          isCorrect,
          isTrap,
          latencyMs,
          twinContext,
        });
      }
      setPredictions(updated);
      return updated;
    },
    [engine]
  );

  const pickCircuit = useCallback(
    (
      circuits: GrammarCircuitRound[],
      cefr: CefrLevel,
      stageNumber: number,
      defaultIndex: number
    ) => {
      return engine.pickAdaptiveCircuit(circuits, cefr, stageNumber, defaultIndex);
    },
    [engine]
  );

  const resetDkt = useCallback(() => {
    engine.resetState();
    refreshPredictions();
  }, [engine, refreshPredictions]);

  return {
    predictions,
    recordInteraction,
    pickCircuit,
    resetDkt,
    refreshPredictions,
  };
}
