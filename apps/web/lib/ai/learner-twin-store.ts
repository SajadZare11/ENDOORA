import {
  NeuroBayesianLearnerTwin,
  TWIN_STORAGE_KEY,
} from "./learner-twin-core.ts";
import catalog from "./learner-twin-catalog.json" with { type: "json" };
import { fetchLearnerHome } from "../learner-dashboard.ts";
import type {
  CEFRBand,
  IELTSSkill,
  MultiModalObservation,
  SkillBeliefNode,
  TwinPrediction,
  TwinMock,
} from "./learner-twin-types.ts";
export const TWIN_EVENT = "endoora_twin_updated";
export const TWIN_CATALOG = catalog;
let scope: string | null = null,
  twin: NeuroBayesianLearnerTwin | null = null;
let scopeRequest: Promise<void> | null = null,
  scopeGeneration = 0;
export function ensureTwinLearnerScope(): Promise<void> {
  if (typeof window === "undefined" || scope) return Promise.resolve();
  const generation = scopeGeneration;
  return (scopeRequest ??= fetchLearnerHome()
    .then((result) => {
      if (generation === scopeGeneration) setTwinLearnerScope(result.user_id);
    })
    .catch(() => {
      /* public practice can continue without an authenticated Twin */
    })
    .finally(() => {
      scopeRequest = null;
    }));
}
let telemetry = {
  gazeDistractionIndex: 0,
  cognitiveLoadIndex: 0.35,
  timestamp: 0,
};
let vulnerability: [number, number, number, number] | undefined;
const key = () => `${TWIN_STORAGE_KEY}:${encodeURIComponent(scope ?? "")}`;
export function createTwinNodes(now = Date.now()): SkillBeliefNode[] {
  const ids = new Map(catalog.map((c) => [c.id, c.skillId]));
  return catalog.map((c) => ({
    skillId: c.skillId,
    name: c.titleEn,
    aefReference: c.aefReference,
    cefr: c.cefr as CEFRBand,
    mean: 0.5,
    variance: 0.08,
    decayRatePerHour: c.decayRateLambda / 24,
    lastUpdatedTimestamp: now,
    prerequisites: c.prerequisites
      .map((id) => ids.get(id)!)
      .filter((id) => id !== undefined),
    evidenceCount: 0,
  }));
}
export function setTwinLearnerScope(userId: string | null) {
  scopeGeneration++;
  if (scope === userId) return;
  scope = userId;
  twin = null;
  telemetry = {
    gazeDistractionIndex: 0,
    cognitiveLoadIndex: 0.35,
    timestamp: 0,
  };
  vulnerability = undefined;
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(TWIN_EVENT));
}
export function getLearnerTwin(): NeuroBayesianLearnerTwin | null {
  if (typeof window === "undefined" || !scope) return null;
  return (twin ??= new NeuroBayesianLearnerTwin(createTwinNodes(), {
    storageKey: key(),
  }));
}
export function updateTwinTelemetry(value: typeof telemetry) {
  telemetry = { ...value };
}
export function updateTwinVulnerability(
  value: [number, number, number, number],
) {
  vulnerability = [...value];
}
export function twinTelemetry() {
  return Date.now() - telemetry.timestamp < 10_000
    ? { ...telemetry }
    : { gazeDistractionIndex: 0, cognitiveLoadIndex: 0.35 };
}
export function recordTwinObservation(obs: MultiModalObservation) {
  const model = getLearnerTwin();
  if (!model) return null;
  let result;
  try {
    result = model.assimilateMultiModalObservation(obs);
  } catch {
    return null;
  }
  window.dispatchEvent(new Event(TWIN_EVENT));
  return result;
}
export function recordTwinGrammarInteraction(input: {
  conceptId: string;
  isCorrect: boolean;
  latencyMs: number;
  guessingFloor?: number;
  itemId?: string;
  prediction?: TwinPrediction;
  expectedLatencyMs?: number;
}) {
  const concept = catalog.find((c) => c.id === input.conceptId);
  if (!concept) return;
  return recordTwinObservation({
    skillIds: [concept.skillId],
    observedScore: input.isCorrect ? 1 : 0,
    modality: "hex_grammar",
    guessingFloor: input.guessingFloor ?? 0.25,
    latencyMs: input.latencyMs,
    expectedLatencyMs: input.expectedLatencyMs ?? 5000,
    ...twinTelemetry(),
    trapVulnerabilityVector: vulnerability,
    itemId: input.itemId,
    prediction: input.prediction,
  });
}
export function beginTwinAssessment(
  modality: "bert_writing" | "cnn_pronunciation" | "sherlock_deduction",
  itemId?: string,
) {
  const ieltsSkill: IELTSSkill =
    modality === "bert_writing"
      ? "writing"
      : modality === "cnn_pronunciation"
        ? "speaking"
        : "reading";
  const model = getLearnerTwin();
  // Capture before the learner responds, not after BERT/CNN has produced a score.
  const prediction = model?.predictOutcomeBeforeInteraction(
    [],
    0.02,
    Date.now(),
    { ieltsSkill, itemId },
  );
  return {
    startedAt: Date.now(),
    prediction,
    ieltsSkill,
    modality,
    itemId,
    ownerScope: scope,
  };
}
export type TwinAssessment = ReturnType<typeof beginTwinAssessment>;
export function finishTwinAssessment(
  ticket: TwinAssessment | null,
  score: number,
  latencyMs?: number,
) {
  if (!ticket || !ticket.ownerScope || ticket.ownerScope !== scope) return;
  return recordTwinObservation({
    skillIds: [],
    observedScore: score,
    modality: ticket.modality,
    ieltsSkill: ticket.ieltsSkill,
    guessingFloor: 0.02,
    latencyMs: latencyMs ?? Math.max(1000, Date.now() - ticket.startedAt),
    expectedLatencyMs: ticket.modality === "bert_writing" ? 1_200_000 : 10_000,
    ...twinTelemetry(),
    prediction: ticket.prediction,
    itemId: ticket.itemId,
  });
}
export function resetLearnerTwin() {
  if (!scope) return;
  try {
    localStorage.removeItem(key());
  } catch {
    /* denied storage: still reset memory */
  }
  twin = new NeuroBayesianLearnerTwin(createTwinNodes(), {
    storageKey: key(),
    storage: null,
  });
  // Create with fresh state even when storage writes are denied, then re-enable persistence on subsequent updates.
  try {
    localStorage.setItem(key(), JSON.stringify(twin.getSnapshot()));
    twin = new NeuroBayesianLearnerTwin(createTwinNodes(), {
      storageKey: key(),
    });
  } catch {
    /* memory-only mode */
  }
  window.dispatchEvent(new Event(TWIN_EVENT));
}
export function reloadLearnerTwin(storageKey: string | null) {
  if (storageKey === key() || storageKey === null) {
    twin = null;
    window.dispatchEvent(new Event(TWIN_EVENT));
  }
}
export function beginTwinMock(mock: TwinMock) {
  const model = getLearnerTwin();
  if (!model) return null;
  const now = Date.now();
  return {
    ownerScope: scope,
    mock,
    predictions: mock.questions.map((q) =>
      model.predictOutcomeBeforeInteraction(q.skillIds, q.guessingFloor, now, {
        ...q,
        ieltsSkill: mock.skill,
        itemId: q.id,
      }),
    ),
  };
}
export function finishTwinMock(
  ticket: ReturnType<typeof beginTwinMock>,
  results: Array<{ question_id: string; is_correct: boolean }>,
  latencies: Record<number, number>,
) {
  if (!ticket || ticket.ownerScope !== scope) return;
  const scores = new Map(results.map((r) => [r.question_id, r.is_correct]));
  ticket.mock.questions.forEach((q, i) => {
    if (!scores.has(q.id)) return;
    recordTwinObservation({
      skillIds: q.skillIds,
      observedScore: scores.get(q.id) ? 1 : 0,
      modality: "mcq_bandit",
      ieltsSkill: ticket.mock.skill,
      guessingFloor: q.guessingFloor,
      discrimination: q.discrimination,
      slipRate: q.slipRate,
      prediction: ticket.predictions[i],
      itemId: q.id,
      latencyMs: latencies[q.number] ?? 30000,
      expectedLatencyMs: 30000,
      ...twinTelemetry(),
    });
  });
}
