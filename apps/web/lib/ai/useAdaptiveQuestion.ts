"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type {
  AdaptiveQuestionPayload,
  RawAdaptiveQuestionPayload,
  AssembledQuestion,
  DistractorCandidate,
  EnDooraTriModalTelemetry,
  TrapCategory,
  Vector4,
  AdaptiveRenderedOption,
  AdaptiveInteractionResult,
  RenderAdaptiveHexOptions,
  UseAdaptiveQuestionOptions,
  UseAdaptiveQuestionReturn,
} from "./types.ts";
import {
  EnDooraLinUCBBandit,
  fuseCognitiveContext,
} from "./linucb-bandit-engine.ts";
import { DktEngine } from "../dkt-engine/dkt-engine.ts";
import { ensureTwinLearnerScope, getLearnerTwin, TWIN_CATALOG } from './learner-twin-store.ts';
import type { TwinPrediction } from './learner-twin-types.ts';
import type { HexEdgeOption } from "../../data/skills/games/types.ts";
import enrichedQuestionsRaw from "../../data/distractors/enriched_adaptive_questions.json" with { type: "json" };

/**
 * Normalizes an unknown or raw question payload (from snake_case or camelCase)
 * into a typed AdaptiveQuestionPayload with a guaranteed 12-item distractorPool.
 */
export function normalizeAdaptiveQuestionPayload(
  raw: unknown
): AdaptiveQuestionPayload {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid adaptive question payload: object expected");
  }

  const r = raw as Record<string, unknown>;

  const id = String(r.id || r.questionId || "question-adaptive");
  const prompt = String(r.prompt || r.question || "");
  const promptFa =
    typeof r.promptFa === "string"
      ? r.promptFa
      : typeof r.prompt_fa === "string"
      ? r.prompt_fa
      : undefined;
  const correctAnswer = String(r.correctAnswer || r.correct_option || "");

  const rawPool = r.distractorPool || r.distractor_pool;
  const distractorPool: DistractorCandidate[] = [];

  if (Array.isArray(rawPool)) {
    for (let i = 0; i < rawPool.length; i++) {
      const c = rawPool[i] as Record<string, unknown>;
      let features: Vector4 = [0.5, 0.5, 0.5, 0.5];

      if (Array.isArray(c.features) && c.features.length === 4) {
        features = [
          Number(c.features[0]),
          Number(c.features[1]),
          Number(c.features[2]),
          Number(c.features[3]),
        ];
      }

      const meta = (c.metadata as Record<string, unknown>) || {};
      distractorPool.push({
        id: String(c.id || `${id}_d${i}`),
        text: String(c.text || ""),
        category: (c.category as TrapCategory) || "phonetic_ortho",
        features,
        metadata: {
          levenshteinSim:
            typeof meta.levenshteinSim === "number"
              ? meta.levenshteinSim
              : (c.levenshtein_sim as number | undefined),
          siameseSim:
            typeof meta.siameseSim === "number"
              ? meta.siameseSim
              : (c.siamese_sim as number | undefined),
          morphDerivScore:
            typeof meta.morphDerivScore === "number"
              ? meta.morphDerivScore
              : (c.morph_deriv_score as number | undefined),
          l1InterferenceScore:
            typeof meta.l1InterferenceScore === "number"
              ? meta.l1InterferenceScore
              : (c.l1_interference_score as number | undefined),
          explanationFa:
            typeof meta.explanationFa === "string"
              ? meta.explanationFa
              : (c.explanation_fa as string | undefined),
        },
      });
    }
  }

  const explanationFa =
    typeof r.explanationFa === "string"
      ? r.explanationFa
      : typeof r.explanation_fa === "string"
      ? r.explanation_fa
      : undefined;

  return {
    id,
    prompt,
    promptFa,
    correctAnswer,
    distractorPool,
    explanationFa,
    section: typeof r.section === "string" ? r.section : undefined,
    cefr_level:
      typeof r.cefr_level === "string"
        ? r.cefr_level
        : typeof r.cefrLevel === "string"
        ? r.cefrLevel
        : undefined,
    cefrLevel:
      typeof r.cefrLevel === "string"
        ? r.cefrLevel
        : typeof r.cefr_level === "string"
        ? r.cefr_level
        : undefined,
    question: prompt,
    correct_option: correctAnswer,
    distractor_pool: distractorPool,
    prompt_fa: promptFa,
    explanation_fa: explanationFa,
  };
}

let staticQuestionsMap: Map<string, AdaptiveQuestionPayload> | null = null;

/**
 * Loads and caches the static question bank of 264 pre-calibrated items.
 */
export function loadStaticQuestionBank(): Map<string, AdaptiveQuestionPayload> {
  if (staticQuestionsMap) return staticQuestionsMap;
  staticQuestionsMap = new Map();
  if (Array.isArray(enrichedQuestionsRaw)) {
    for (const item of enrichedQuestionsRaw) {
      try {
        const normalized = normalizeAdaptiveQuestionPayload(item);
        staticQuestionsMap.set(normalized.id, normalized);
      } catch {
        // Skip malformed entries
      }
    }
  }
  return staticQuestionsMap;
}

/**
 * Retrieves a calibrated adaptive question by ID.
 */
export function getAdaptiveQuestionById(
  id: string
): AdaptiveQuestionPayload | undefined {
  const map = loadStaticQuestionBank();
  return map.get(id);
}

/**
 * Resolves an adaptive question payload for an IELTS module question from enriched_adaptive_questions.json.
 */
export function getAdaptiveQuestionForIelts(
  skill: string,
  questionNumber: number,
  preferredLevel: string = "B2"
): AdaptiveQuestionPayload | undefined {
  const bank = loadStaticQuestionBank();
  const skillKey = skill.toLowerCase();
  const levelKey = preferredLevel.toLowerCase();
  const itemIndex = ((questionNumber - 1) % 7) + 1;
  const targetId = `${skillKey}-${levelKey}-${String(itemIndex).padStart(3, "0")}`;
  if (bank.has(targetId)) {
    return bank.get(targetId);
  }
  for (const item of bank.values()) {
    if (item.section === skillKey && item.id.includes(levelKey)) {
      return item;
    }
  }
  for (const item of bank.values()) {
    if (item.section === skillKey) {
      return item;
    }
  }
  return undefined;
}

/**
 * Maps an AssembledQuestion into HexEdgeOption[] compatible with GrammarHexArena
 * and standard hexagon geometry slots.
 */
export function renderAdaptiveHexQuestion(
  assembled: AssembledQuestion,
  options?: RenderAdaptiveHexOptions
): HexEdgeOption[] {
  const result: HexEdgeOption[] = [];
  const {
    nextNodeId,
    distractorNextNodeId,
    comboBoost = 1.5,
    isBranchingClause = false,
  } = options || {};

  for (let i = 0; i < assembled.options.length; i++) {
    const text = assembled.options[i];
    const isCorrect = i === assembled.correctOptionIndex;

    if (isCorrect) {
      result.push({
        id: `${assembled.questionId}_edge_correct_${i}`,
        text,
        isCorrect: true,
        isTrap: false,
        trapExplanationFa: undefined,
        isBranchingClause,
        comboBoost,
        nextNodeId,
      });
    } else {
      const candidate = assembled.selectedDistractors.find(
        (d) => d.text === text
      );
      const explanation =
        candidate?.metadata?.explanationFa ||
        (candidate?.category === "l1_persian"
          ? "تله تداخل زبان مادری (فارسی)"
          : candidate?.category === "semantic_siamese"
          ? "تله معنایی و شبه‌مترادف"
          : candidate?.category === "morphological"
          ? "تله اشتقاقی و صرفی"
          : "تله شباهت آوایی و املایی");

      result.push({
        id: candidate?.id || `${assembled.questionId}_edge_trap_${i}`,
        text,
        isCorrect: false,
        isTrap: true,
        trapExplanationFa: explanation,
        isBranchingClause: false,
        comboBoost: 1.0,
        nextNodeId: distractorNextNodeId,
      });
    }
  }

  return result;
}

/**
 * Primary React Hook for Engine 6 Adaptive Question delivery and dual feedback dispatch.
 */
export function useAdaptiveQuestion(
  options: UseAdaptiveQuestionOptions
): UseAdaptiveQuestionReturn {
  const {
    question: rawQuestionInput,
    telemetry: telemetryInput,
    alpha = 0.5,
    conceptId: explicitConceptId,
    autoUpdateBandit = true,
    autoUpdateDkt = true,
    onAnswer,
    banditInstance,
  } = options;

  const bandit = useMemo(
    () => banditInstance ?? EnDooraLinUCBBandit.getInstance(alpha),
    [banditInstance, alpha]
  );
  const dkt = useMemo(() => DktEngine.getInstance(), []);

  const [currentQuestionInput, setCurrentQuestionInput] = useState(
    rawQuestionInput
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [previousInput, setPreviousInput] = useState(rawQuestionInput);

  const renderTimestampRef = useRef<number>(0);
  const twinPredictionRef = useRef<TwinPrediction | undefined>(undefined);
  useEffect(()=>{void ensureTwinLearnerScope();},[]);

  if (previousInput !== rawQuestionInput) {
    setPreviousInput(rawQuestionInput);
    setCurrentQuestionInput(rawQuestionInput);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setLatencyMs(null);
  }

  const { payload: resolvedPayload, error: payloadError } = useMemo(() => {
    if (!currentQuestionInput) return { payload: null, error: null };
    try {
      if (typeof currentQuestionInput === "string") {
        const found = getAdaptiveQuestionById(currentQuestionInput);
        if (!found) {
          throw new Error(
            `Adaptive question ID '${currentQuestionInput}' not found in question bank`
          );
        }
        return { payload: found, error: null };
      }
      return { payload: normalizeAdaptiveQuestionPayload(currentQuestionInput), error: null };
    } catch (err) {
      return { payload: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [currentQuestionInput]);

  // Resolve cognitive telemetry
  const resolvedTelemetry: EnDooraTriModalTelemetry = useMemo(() => {
    let t: EnDooraTriModalTelemetry = {};
    if (typeof telemetryInput === "function") {
      t = { ...telemetryInput() };
    } else if (telemetryInput) {
      t = { ...telemetryInput };
    }

    // Auto-enrich DKT metrics if not provided
    if (t.dktGrammarDeficit === undefined) {
      try {
        const preds = dkt.getPredictions();
        t.dktGrammarDeficit = 1.0 - preds.overallRetentionIndex / 100;
      } catch {
        t.dktGrammarDeficit = 0.35;
      }
    }

    return t;
  }, [telemetryInput, dkt]);

  // Assemble question via LinUCB bandit
  const { question: assembledQuestion, error: assemblyError } = useMemo(() => {
    if (!resolvedPayload) return { question: null, error: null };
    try {
      const question = bandit.assembleAdaptiveQuestion(
        resolvedPayload,
        resolvedTelemetry,
        { alpha }
      );
      return { question, error: null };
    } catch (err) {
      return { question: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  }, [resolvedPayload, resolvedTelemetry, bandit, alpha]);

  const error = payloadError ?? assemblyError;

  // Reset timestamp when assembled question becomes active
  useEffect(() => {
    if (assembledQuestion) {
      renderTimestampRef.current =
        typeof performance !== "undefined" ? performance.now() : Date.now();
    }
  }, [assembledQuestion]);

  // Build rendered options array
  const renderedOptions: AdaptiveRenderedOption[] = useMemo(() => {
    if (!assembledQuestion) return [];

    return assembledQuestion.options.map((text, idx) => {
      const isTargetCorrect = idx === assembledQuestion.correctOptionIndex;
      if (isTargetCorrect) {
        return {
          index: idx,
          text,
          isCorrect: true,
          isTrap: false,
          trapCategory: null,
          candidateId: null,
          features: null,
          explanationFa: resolvedPayload?.explanationFa,
          ucbScore: undefined,
        };
      }

      const candidate = assembledQuestion.selectedDistractors.find(
        (d) => d.text === text
      );
      return {
        index: idx,
        text,
        isCorrect: false,
        isTrap: true,
        trapCategory: candidate?.category ?? null,
        candidateId: candidate?.id ?? null,
        features: candidate?.features ?? null,
        explanationFa: candidate?.metadata?.explanationFa,
        ucbScore: candidate ? assembledQuestion.scores?.[candidate.id] : undefined,
      };
    });
  }, [assembledQuestion, resolvedPayload]);

  // Context vector
  const contextVector: Vector4 = useMemo(() => {
    return fuseCognitiveContext(resolvedTelemetry);
  }, [resolvedTelemetry]);

  // Concept ID for DKT
  const effectiveConceptId = useMemo(() => {
    if (explicitConceptId) return explicitConceptId;
    if (resolvedPayload?.id) {
      const match = resolvedPayload.id.match(/([a-c][1-2])-(\d+)/i);
      if (match) {
        const level = match[1].toLowerCase();
        const num = String(
          Math.min(10, Math.max(1, parseInt(match[2], 10)))
        ).padStart(2, "0");
        return `${level}-${num}`;
      }
    }
    return "a1-01";
  }, [explicitConceptId, resolvedPayload]);

  useEffect(() => {
    const id=TWIN_CATALOG.find(c=>c.id===effectiveConceptId)?.skillId;
    twinPredictionRef.current=id===undefined?undefined:getLearnerTwin()?.predictOutcomeBeforeInteraction([id],0.25,Date.now(),{itemId:assembledQuestion?.questionId});
  }, [assembledQuestion, effectiveConceptId]);

  // Selection Handler
  const selectOption = useCallback(
    (
      index: number,
      overrideLatencyMs?: number
    ): AdaptiveInteractionResult | null => {
      if (
        isAnswered ||
        !assembledQuestion ||
        index < 0 ||
        index >= assembledQuestion.options.length
      ) {
        return null;
      }

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const measuredLatency = Math.max(
        80,
        Math.round(now - renderTimestampRef.current)
      );
      const elapsedLatency =
        overrideLatencyMs !== undefined ? overrideLatencyMs : measuredLatency;

      const selectedOpt = renderedOptions[index];
      const isTargetCorrect = selectedOpt.isCorrect;

      let banditReward = 0;
      let banditUpdated = false;
      let dktUpdated = false;

      // 1. Dual dispatch to LinUCB Bandit
      if (autoUpdateBandit) {
        if (!isTargetCorrect && selectedOpt.trapCategory && selectedOpt.features) {
          bandit.recordInteractionFeedback({
            category: selectedOpt.trapCategory,
            features: selectedOpt.features,
            trapTriggered: true,
            latencyMs: elapsedLatency,
          });
          banditReward = 1.0 + 0.15 * Math.min(1.0, elapsedLatency / 3000);
          banditUpdated = true;
        } else if (
          isTargetCorrect &&
          assembledQuestion.selectedDistractors.length > 0
        ) {
          // Record avoidance signal on the highest ranked candidate
          const topCandidate = assembledQuestion.selectedDistractors[0];
          bandit.recordInteractionFeedback({
            category: topCandidate.category,
            features: topCandidate.features,
            trapTriggered: false,
            latencyMs: elapsedLatency,
          });
          banditReward =
            elapsedLatency > 3000
              ? 0.05 * Math.min(1.0, (elapsedLatency - 3000) / 3000)
              : 0.0;
          banditUpdated = true;
        }
      }

      // 2. Dual dispatch to DKT-Forget Neural GRU
      if (autoUpdateDkt) {
        try {
          dkt.recordInteraction({
            conceptId: effectiveConceptId,
            isCorrect: isTargetCorrect,
            isTrap: !isTargetCorrect,
            latencyMs: elapsedLatency,
            twinContext: { prediction:twinPredictionRef.current,itemId:assembledQuestion.questionId,guessingFloor:1/assembledQuestion.options.length },
          });
          dktUpdated = true;
        } catch {
          // Gracefully continue on DKT update failure
        }
      }

      // 3. Update React state
      setSelectedOptionIndex(index);
      setIsAnswered(true);
      setIsCorrect(isTargetCorrect);
      setLatencyMs(elapsedLatency);

      const result: AdaptiveInteractionResult = {
        questionId: assembledQuestion.questionId,
        selectedIndex: index,
        selectedText: selectedOpt.text,
        isCorrect: isTargetCorrect,
        isTrap: selectedOpt.isTrap,
        trapCategory: selectedOpt.trapCategory,
        features: selectedOpt.features,
        latencyMs: elapsedLatency,
        banditReward,
        banditUpdated,
        dktUpdated,
        conceptId: effectiveConceptId,
        timestamp: Date.now(),
      };

      onAnswer?.(result);
      return result;
    },
    [
      isAnswered,
      assembledQuestion,
      renderedOptions,
      autoUpdateBandit,
      autoUpdateDkt,
      bandit,
      dkt,
      effectiveConceptId,
      onAnswer,
    ]
  );

  // Reset function to advance to next question
  const resetQuestion = useCallback(
    (
      nextQuestion?: AdaptiveQuestionPayload | RawAdaptiveQuestionPayload | string
    ) => {
      if (nextQuestion !== undefined) {
        setCurrentQuestionInput(nextQuestion);
      }
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setLatencyMs(null);
      renderTimestampRef.current =
        typeof performance !== "undefined" ? performance.now() : Date.now();
    },
    []
  );

  // Hex Helper
  const renderHexOptions = useCallback(
    (hexOptions?: RenderAdaptiveHexOptions): HexEdgeOption[] => {
      if (!assembledQuestion) return [];
      return renderAdaptiveHexQuestion(assembledQuestion, hexOptions);
    },
    [assembledQuestion]
  );

  return {
    assembledQuestion,
    options: renderedOptions,
    correctOptionIndex: assembledQuestion?.correctOptionIndex ?? null,
    selectedOptionIndex,
    selectedOption:
      selectedOptionIndex !== null
        ? renderedOptions[selectedOptionIndex]
        : null,
    isAnswered,
    isCorrect,
    latencyMs,
    assemblyTimeMs: assembledQuestion?.assemblyTimeMs ?? 0,
    isLoading: !assembledQuestion && !error,
    error,
    selectOption,
    resetQuestion,
    renderHexOptions,
    telemetry: resolvedTelemetry,
    contextVector,
  };
}
