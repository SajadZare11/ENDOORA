import { IELTS_SKILLS } from "./learner-twin-types.ts";
import { simulateCounterfactualFuture } from "./learner-twin-future.ts";
import type {
  Belief,
  CEFRBand,
  IELTSBandForecast,
  IELTSSkill,
  MultiModalObservation,
  SkillBeliefNode,
  TwinCalibrationMetrics,
  TwinMock,
  TwinMockResult,
  TwinOptions,
  TwinPrediction,
  TwinSnapshot,
  TwinStorage,
} from "./learner-twin-types.ts";
export type * from "./learner-twin-types.ts";
export const TWIN_STORAGE_KEY = "endoora_neuro_bayesian_learner_twin_v2";
export const clamp = (x: number, lo = 0, hi = 1) =>
  Math.max(lo, Math.min(hi, x));
const finite = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x);
const probability = (x: unknown): x is number => finite(x) && x >= 0 && x <= 1;
const copy = <T>(x: T): T => structuredClone(x);
const freshMetrics = (): TwinCalibrationMetrics => ({
  rollingBrierError: 0,
  rollingMAE: 0,
  studentResidualBias: 0,
  totalInteractions: 0,
  shieldedInteractions: 0,
});

/** Diagonal state-space EKF plus a tiny online residual network. No external weights. */
export class NeuroBayesianLearnerTwin {
  private nodes = new Map<number, SkillBeliefNode>();
  private state: TwinSnapshot;
  private storage: TwinStorage | null;
  private key: string;
  private now: () => number;
  // Six inputs -> four tanh units -> one recurrent residual output (33 parameters).
  private weights = new Float32Array(33);
  private itemBias = new Map<string, number>();

  constructor(initialNodes: SkillBeliefNode[] = [], options: TwinOptions = {}) {
    this.now = options.now ?? Date.now;
    this.key = options.storageKey ?? TWIN_STORAGE_KEY;
    this.storage = options.storage ?? null;
    if (options.storage === undefined && typeof window !== "undefined") {
      try {
        this.storage = window.localStorage;
      } catch {
        /* private browsing */
      }
    }
    const timestamp = this.now();
    this.state = {
      version: 2,
      nodes: [],
      calibration: freshMetrics(),
      errorProfile4D: [0.25, 0.25, 0.25, 0.25],
      modalityMastery: Object.fromEntries(
        IELTS_SKILLS.map((k) => [
          k,
          { mean: 0.5, variance: 0.08, evidenceCount: 0, timestamp },
        ]),
      ) as Record<IELTSSkill, Belief>,
      residualWeights: [],
      recurrentResidual: 0,
      history: [],
      itemResidualBias: [],
    };
    // Deterministic small hidden weights; output weights start at zero (no invented bias).
    for (let i = 0; i < 24; i++) this.weights[i] = Math.sin(i + 1) * 0.15;
    for (const n of initialNodes)
      if (this.validNode(n)) this.nodes.set(n.skillId, copy(n));
    try {
      const raw = this.storage?.getItem(this.key);
      if (raw) this.restoreSnapshot(JSON.parse(raw));
    } catch {
      /* malformed snapshot: retain valid priors */
    }
  }

  private validNode(n: SkillBeliefNode): boolean {
    return (
      !!n &&
      Number.isSafeInteger(n.skillId) &&
      typeof n.name === "string" &&
      typeof n.aefReference === "string" &&
      ["A1", "A2", "B1", "B2", "C1", "C2"].includes(n.cefr) &&
      probability(n.mean) &&
      finite(n.variance) &&
      n.variance >= 0.001 &&
      n.variance <= 0.25 &&
      finite(n.decayRatePerHour) &&
      n.decayRatePerHour >= 0 &&
      n.decayRatePerHour <= 0.1 &&
      finite(n.lastUpdatedTimestamp) &&
      Array.isArray(n.prerequisites) &&
      n.prerequisites.every(Number.isSafeInteger) &&
      (n.evidenceCount === undefined ||
        (Number.isSafeInteger(n.evidenceCount) && n.evidenceCount >= 0))
    );
  }

  /** Atomic validation prevents partially restored, non-finite state. New catalog nodes survive. */
  public restoreSnapshot(raw: unknown): boolean {
    if (!raw || typeof raw !== "object") return false;
    const s = raw as TwinSnapshot;
    const m = s.calibration;
    if (
      s.version !== 2 ||
      !Array.isArray(s.nodes) ||
      !s.nodes.every((n) => this.validNode(n)) ||
      new Set(s.nodes.map((n) => n.skillId)).size !== s.nodes.length ||
      !m ||
      !probability(m.rollingBrierError) ||
      !probability(m.rollingMAE) ||
      !finite(m.studentResidualBias) ||
      Math.abs(m.studentResidualBias) > 0.08 ||
      !Number.isSafeInteger(m.totalInteractions) ||
      m.totalInteractions < 0 ||
      !Number.isSafeInteger(m.shieldedInteractions) ||
      m.shieldedInteractions < 0 ||
      m.shieldedInteractions > m.totalInteractions ||
      !IELTS_SKILLS.every((k) => {
        const b = s.modalityMastery?.[k];
        return (
          b &&
          probability(b.mean) &&
          finite(b.variance) &&
          b.variance >= 0.001 &&
          b.variance <= 0.25 &&
          Number.isSafeInteger(b.evidenceCount) &&
          b.evidenceCount >= 0 &&
          finite(b.timestamp)
        );
      }) ||
      !Array.isArray(s.errorProfile4D) ||
      s.errorProfile4D.length !== 4 ||
      !s.errorProfile4D.every(probability) ||
      !Array.isArray(s.residualWeights) ||
      s.residualWeights.length !== 33 ||
      !s.residualWeights.every((x) => finite(x) && Math.abs(x) <= 2) ||
      !finite(s.recurrentResidual) ||
      Math.abs(s.recurrentResidual) > 1 ||
      !Array.isArray(s.itemResidualBias) ||
      s.itemResidualBias.length > 128 ||
      !s.itemResidualBias.every(
        (e) =>
          Array.isArray(e) &&
          e.length === 2 &&
          typeof e[0] === "string" &&
          e[0].length <= 200 &&
          finite(e[1]) &&
          Math.abs(e[1]) <= 0.08,
      ) ||
      !Array.isArray(s.history) ||
      s.history.length > 64 ||
      !s.history.every(
        (e) =>
          e &&
          finite(e.timestamp) &&
          probability(e.score) &&
          probability(e.prediction) &&
          finite(e.residual) &&
          Math.abs(e.residual) <= 1 &&
          probability(e.reliability) &&
          finite(e.noise) &&
          e.noise > 0 &&
          finite(e.gain) &&
          probability(e.posterior) &&
          Array.isArray(e.skillIds) &&
          e.skillIds.every(Number.isSafeInteger) &&
          [
            "mcq_bandit",
            "bert_writing",
            "cnn_pronunciation",
            "hex_grammar",
            "sherlock_deduction",
          ].includes(e.modality),
      )
    )
      return false;
    this.state = copy(s);
    for (const n of s.nodes) this.nodes.set(n.skillId, copy(n));
    this.weights.set(s.residualWeights);
    this.itemBias = new Map(s.itemResidualBias);
    return true;
  }

  public getSnapshot(): TwinSnapshot {
    return copy({
      ...this.state,
      nodes: [...this.nodes.values()],
      residualWeights: Array.from(this.weights),
      itemResidualBias: [...this.itemBias],
    });
  }
  public getSkillBeliefs(nowMs = this.now()): SkillBeliefNode[] {
    return [...this.nodes.values()].map((n) => ({
      ...copy(n),
      mean: this.decay(
        n.mean,
        n.decayRatePerHour,
        n.lastUpdatedTimestamp,
        nowMs,
      ),
    }));
  }
  public getCalibration(): TwinCalibrationMetrics {
    return { ...this.state.calibration };
  }
  private decay(
    mean: number,
    rate: number,
    timestamp: number,
    now: number,
  ): number {
    // Decay cannot increase an unmastered skill toward the retention floor.
    const floor = Math.min(0.15, mean);
    return (
      floor +
      (mean - floor) *
        Math.exp((-rate * Math.max(0, now - timestamp)) / 3_600_000)
    );
  }
  private prior(n: SkillBeliefNode, now: number) {
    const hours = Math.max(0, now - n.lastUpdatedTimestamp) / 3_600_000;
    return {
      mean: this.decay(n.mean, n.decayRatePerHour, n.lastUpdatedTimestamp, now),
      variance: clamp(n.variance + 0.002 * Math.sqrt(hours), 0.001, 0.25),
    };
  }
  private effective(id: number, now: number): number {
    const n = this.nodes.get(id);
    if (!n) return 0.5;
    let ceiling = 0.99;
    for (const p of n.prerequisites) {
      const parent = this.nodes.get(p);
      if (parent)
        ceiling = Math.min(ceiling, this.prior(parent, now).mean + 0.25);
    }
    return Math.min(this.prior(n, now).mean, ceiling);
  }
  private attention(ids: number[], now: number, itemId?: string): number {
    let weighted = 0,
      total = 0;
    // Monotonic time/distance attention over related interactions, bounded to 64 events.
    this.state.history.forEach((e, i, history) => {
      if (
        !(itemId && e.itemId === itemId) &&
        !e.skillIds.some((id) => ids.includes(id))
      )
        return;
      const weight =
        e.reliability *
        Math.exp(
          -0.12 * (history.length - i) -
            Math.max(0, now - e.timestamp) / 604_800_000,
        );
      weighted += weight * e.residual;
      total += weight;
    });
    return total ? weighted / total : 0;
  }
  private hidden(inputs: number[]): Float32Array {
    const h = new Float32Array(4);
    for (let j = 0; j < 4; j++) {
      let sum = this.weights[24 + j];
      for (let i = 0; i < 6; i++) sum += this.weights[j * 6 + i] * inputs[i];
      h[j] = Math.tanh(sum);
    }
    return h;
  }
  public predictOutcomeBeforeInteraction(
    skillIds: number[],
    guessingFloor = 0.25,
    nowMs = this.now(),
    item?: {
      ieltsSkill?: IELTSSkill;
      discrimination?: number;
      slipRate?: number;
      itemId?: string;
    },
  ): TwinPrediction {
    if (
      !Array.isArray(skillIds) ||
      !skillIds.every(Number.isSafeInteger) ||
      !probability(guessingFloor) ||
      guessingFloor > 0.8 ||
      !finite(nowMs) ||
      (item?.discrimination !== undefined &&
        (!finite(item.discrimination) || item.discrimination <= 0)) ||
      (item?.slipRate !== undefined && !probability(item.slipRate)) ||
      (item?.ieltsSkill !== undefined &&
        !IELTS_SKILLS.includes(item.ieltsSkill))
    )
      throw new Error("Invalid prediction inputs");
    const ids = [...new Set(skillIds)];
    const means = ids.map((id) => this.effective(id, nowMs));
    const fallback = item?.ieltsSkill
      ? this.state.modalityMastery[item.ieltsSkill]
      : undefined;
    const mastery = means.length
      ? means.reduce((a, b) => a * b, 1)
      : fallback
        ? this.decay(fallback.mean, 0.001, fallback.timestamp, nowMs)
        : 0.5;
    const span = Math.max(
      0.01,
      1 - clamp(item?.slipRate ?? 0.04, 0.01, 0.3) - guessingFloor,
    );
    // Monotonic response link with item discrimination and a matching EKF Jacobian.
    const a = clamp(item?.discrimination ?? 1, 0.25, 3.5);
    const link = clamp(0.5 + a * (mastery - 0.5), 0, 1);
    const variance = ids.length
      ? ids.reduce(
          (sum, id) => sum + (this.nodes.get(id)?.variance ?? 0.25),
          0,
        ) / ids.length
      : (fallback?.variance ?? 0.25);
    const inputs = [
      mastery,
      variance,
      guessingFloor,
      this.attention(ids, nowMs, item?.itemId),
      this.state.recurrentResidual,
      1,
    ];
    const h = this.hidden(inputs);
    let correction = this.state.calibration.studentResidualBias;
    for (let j = 0; j < 4; j++) correction += h[j] * this.weights[28 + j];
    correction += this.weights[32];
    correction += item?.itemId ? (this.itemBias.get(item.itemId) ?? 0) : 0;
    return {
      predictedProbability: clamp(
        guessingFloor + span * link + clamp(correction, -0.08, 0.08),
        0.01,
        0.99,
      ),
      epistemicUncertainty: variance,
      context: inputs,
      skillIds: ids,
      timestamp: nowMs,
      itemId: item?.itemId,
    };
  }

  public assimilateMultiModalObservation(obs: MultiModalObservation) {
    if (
      !obs ||
      !Array.isArray(obs.skillIds) ||
      obs.skillIds.some(
        (id) => !Number.isSafeInteger(id) || !this.nodes.has(id),
      ) ||
      !probability(obs.observedScore) ||
      !probability(obs.guessingFloor) ||
      obs.guessingFloor > 0.8 ||
      !finite(obs.latencyMs) ||
      obs.latencyMs < 0 ||
      !finite(obs.expectedLatencyMs) ||
      obs.expectedLatencyMs <= 0 ||
      !probability(obs.gazeDistractionIndex) ||
      !probability(obs.cognitiveLoadIndex) ||
      (obs.timestamp !== undefined && !finite(obs.timestamp)) ||
      (obs.itemId !== undefined &&
        (typeof obs.itemId !== "string" || obs.itemId.length > 200)) ||
      (obs.discrimination !== undefined &&
        (!finite(obs.discrimination) || obs.discrimination <= 0)) ||
      (obs.slipRate !== undefined && !probability(obs.slipRate)) ||
      (obs.trapVulnerabilityVector &&
        (obs.trapVulnerabilityVector.length !== 4 ||
          !obs.trapVulnerabilityVector.every(probability)))
    )
      throw new Error("Invalid twin observation");
    const now = obs.timestamp ?? this.now();
    const ids = [...new Set(obs.skillIds)];
    const target =
      obs.ieltsSkill ??
      (obs.modality === "bert_writing"
        ? "writing"
        : obs.modality === "cnn_pronunciation"
          ? "speaking"
          : obs.modality === "sherlock_deduction"
            ? "reading"
            : undefined);
    if (!ids.length && !target)
      throw new Error("Observation needs a skill or explicit IELTS modality");
    const predicted =
      obs.prediction ??
      this.predictOutcomeBeforeInteraction(ids, obs.guessingFloor, now, {
        ...obs,
        ieltsSkill: target,
      });
    if (
      !probability(predicted.predictedProbability) ||
      (predicted.context &&
        (predicted.context.length !== 6 || !predicted.context.every(finite))) ||
      (predicted.timestamp !== undefined && predicted.timestamp > now)
    )
      throw new Error("Invalid pre-action prediction");
    const residual = obs.observedScore - predicted.predictedProbability;
    const ratio = obs.latencyMs / obs.expectedLatencyMs;
    const rapid = clamp((0.35 - ratio) / 0.35);
    const reliability = clamp(
      (1 - rapid) *
        (1 - obs.gazeDistractionIndex) ** 2 *
        (1 - obs.cognitiveLoadIndex * 0.35),
      0.01,
      1,
    );
    const noise =
      0.02 +
      0.8 * rapid +
      0.8 * obs.gazeDistractionIndex ** 2 +
      0.2 * obs.cognitiveLoadIndex ** 2 +
      obs.guessingFloor * 0.2;
    const priors = ids.map((id) => this.prior(this.nodes.get(id)!, now));
    const means = ids.map((id) => this.effective(id, now));
    const span = 1 - clamp(obs.slipRate ?? 0.04, 0.01, 0.3) - obs.guessingFloor;
    const a = clamp(obs.discrimination ?? 1, 0.25, 3.5);
    const product = means.reduce((x, y) => x * y, 1);
    const saturated =
      0.5 + a * (product - 0.5) <= 0 || 0.5 + a * (product - 0.5) >= 1;
    const jacobian = means.map((m, i) =>
      saturated || priors[i].mean > m + 1e-8
        ? 0
        : span * a * means.reduce((x, y, j) => (i === j ? x : x * y), 1),
    );
    // One joint innovation variance prevents multiplying evidence across Q-matrix skills.
    const innovation =
      noise +
      jacobian.reduce((sum, h, i) => sum + h * h * priors[i].variance, 0);
    let posterior = 0,
      gain = 0;
    ids.forEach((id, i) => {
      const n = this.nodes.get(id)!;
      const rawGain = (priors[i].variance * jacobian[i]) / innovation;
      const delta = clamp(
        rawGain * residual * reliability,
        -Math.min(0.15, priors[i].mean - 0.01),
        Math.min(0.15, 0.99 - priors[i].mean),
      );
      const k =
        Math.abs(residual) > 1e-10 ? delta / residual : rawGain * reliability;
      n.mean = clamp(priors[i].mean + delta, 0.01, 0.99);
      n.variance = clamp(
        priors[i].variance -
          2 * k * jacobian[i] * priors[i].variance +
          k * k * innovation,
        0.001,
        0.25,
      );
      n.lastUpdatedTimestamp = now;
      n.evidenceCount = (n.evidenceCount ?? 0) + 1;
      // No decay-rate learning or causal penalties from noisy guesses/slips.
      if (reliability > 0.6)
        n.decayRatePerHour = clamp(
          n.decayRatePerHour *
            (obs.observedScore >= 0.75 && obs.cognitiveLoadIndex < 0.4
              ? 0.88
              : obs.observedScore < 0.5
                ? 1.15
                : 1),
          0.0005,
          0.025,
        );
      posterior += n.mean;
      gain += k;
    });
    if (residual < -0.35 && reliability > 0.6) {
      const parents = new Set(
        ids
          .flatMap((id) => this.nodes.get(id)!.prerequisites)
          .filter((id) => !ids.includes(id)),
      );
      for (const id of parents) {
        const p = this.nodes.get(id);
        if (p) {
          const prior = this.prior(p, now);
          p.mean = clamp(
            prior.mean + 0.25 * (gain / Math.max(1, ids.length)) * residual,
            0.01,
            0.99,
          );
          p.variance = prior.variance;
          p.lastUpdatedTimestamp = now;
        }
      }
    }
    if (target) {
      const b = this.state.modalityMastery[target];
      const prior = this.decay(b.mean, 0.001, b.timestamp, now);
      const p = clamp(
        b.variance +
          0.002 * Math.sqrt(Math.max(0, now - b.timestamp) / 3_600_000),
        0.001,
        0.25,
      );
      const h = Math.max(0.01, span);
      const innovation = h * h * p + noise;
      const rawGain = (p * h) / innovation;
      const delta = clamp(
        rawGain * residual * reliability,
        -Math.min(0.15, prior - 0.01),
        Math.min(0.15, 0.99 - prior),
      );
      const k =
        Math.abs(residual) > 1e-10 ? delta / residual : rawGain * reliability;
      b.mean = clamp(prior + delta, 0.01, 0.99);
      b.variance = clamp(p - 2 * k * h * p + k * k * innovation, 0.001, 0.25);
      b.evidenceCount++;
      b.timestamp = now;
      if (!ids.length) {
        posterior = b.mean;
        gain = k;
      }
    }
    const c = this.state.calibration;
    // Report actual prequential errors, never scaled down to manufacture accuracy.
    const alpha = c.totalInteractions ? 0.08 : 1;
    c.rollingBrierError += alpha * (residual * residual - c.rollingBrierError);
    c.rollingMAE += alpha * (Math.abs(residual) - c.rollingMAE);
    c.totalInteractions++;
    if (reliability < 0.4) c.shieldedInteractions++;
    const gradient = clamp(residual, -0.2, 0.2) * reliability;
    c.studentResidualBias = clamp(
      c.studentResidualBias + 0.015 * gradient,
      -0.08,
      0.08,
    );
    const inputs = predicted.context ?? [
      product,
      0.08,
      obs.guessingFloor,
      0,
      this.state.recurrentResidual,
      1,
    ];
    const hidden = this.hidden(inputs);
    for (let j = 0; j < 4; j++) {
      const back =
        gradient * this.weights[28 + j] * (1 - hidden[j] * hidden[j]);
      for (let i = 0; i < 6; i++)
        this.weights[j * 6 + i] = clamp(
          this.weights[j * 6 + i] + 0.01 * back * inputs[i],
          -2,
          2,
        );
      this.weights[24 + j] = clamp(this.weights[24 + j] + 0.01 * back, -2, 2);
      this.weights[28 + j] = clamp(
        this.weights[28 + j] + 0.01 * gradient * hidden[j],
        -2,
        2,
      );
    }
    this.weights[32] = clamp(this.weights[32] + 0.01 * gradient, -0.08, 0.08);
    this.state.recurrentResidual =
      0.8 * this.state.recurrentResidual + 0.2 * gradient;
    if (obs.itemId) {
      this.itemBias.set(
        obs.itemId,
        clamp(
          (this.itemBias.get(obs.itemId) ?? 0) + 0.02 * gradient,
          -0.08,
          0.08,
        ),
      );
      if (this.itemBias.size > 128)
        this.itemBias.delete(this.itemBias.keys().next().value!);
    }
    if (obs.trapVulnerabilityVector)
      this.state.errorProfile4D = this.state.errorProfile4D.map(
        (v, i) => 0.85 * v + 0.15 * obs.trapVulnerabilityVector![i],
      );
    const posteriorMean = posterior / Math.max(1, ids.length);
    this.state.history.push({
      timestamp: now,
      modality: obs.modality,
      skillIds: ids,
      score: obs.observedScore,
      prediction: predicted.predictedProbability,
      residual,
      reliability,
      noise,
      gain: gain / Math.max(1, ids.length),
      posterior: posteriorMean,
      ...(obs.itemId ? { itemId: obs.itemId } : {}),
    });
    this.state.history = this.state.history.slice(-64);
    this.persist();
    return {
      priorPrediction: predicted.predictedProbability,
      posteriorMean,
      kalmanGain: gain / Math.max(1, ids.length),
      rejectedNoiseRatio: 1 - reliability,
      observationNoiseVariance: noise,
      calibration: this.getCalibration(),
    };
  }

  public getIELTSForecast(now = this.now()): IELTSBandForecast {
    const estimates = IELTS_SKILLS.map((k) => {
      const b = this.state.modalityMastery[k];
      const mean = this.decay(b.mean, 0.001, b.timestamp, now);
      const variance = clamp(
        b.variance +
          0.002 * Math.sqrt(Math.max(0, now - b.timestamp) / 3_600_000),
        0.001,
        0.25,
      );
      const raw = 1 + 8 * mean,
        band = Math.round(raw * 2) / 2,
        margin = 1.96 * Math.sqrt(variance) * 8;
      return {
        band,
        ci95: [
          Math.min(band, clamp(raw - margin, 1, 9)),
          Math.max(band, clamp(raw + margin, 1, 9)),
        ] as [number, number],
        variance,
      };
    });
    const band =
      Math.round((estimates.reduce((s, b) => s + b.band, 0) / 4) * 2) / 2;
    // Shared learner factors correlate sections: conservative aggregate interval.
    const margin =
      estimates.reduce((s, b) => s + 1.96 * Math.sqrt(b.variance) * 8, 0) / 4;
    const cefr: CEFRBand =
      band >= 8.5
        ? "C2"
        : band >= 7
          ? "C1"
          : band >= 5.5
            ? "B2"
            : band >= 4
              ? "B1"
              : band >= 3
                ? "A2"
                : "A1";
    const n = this.state.calibration.totalInteractions;
    return {
      listening: estimates[0],
      reading: estimates[1],
      writing: estimates[2],
      speaking: estimates[3],
      overall: {
        band,
        ci95: [clamp(band - margin, 1, 9), clamp(band + margin, 1, 9)],
      },
      predictedCEFR: cefr,
      twinConfidencePct: n
        ? 100 * (1 - this.state.calibration.rollingMAE) * Math.min(1, n / 30)
        : 0,
    };
  }

  public simulateMock(mock: TwinMock, now = this.now()): TwinMockResult {
    const start = performance.now();
    const questions = mock.questions.map((q) => {
      const prediction = this.predictOutcomeBeforeInteraction(
        q.skillIds,
        q.guessingFloor,
        now,
        { ...q, ieltsSkill: mock.skill, itemId: q.id },
      );
      return {
        ...q,
        ...prediction,
        atRisk: prediction.predictedProbability < 0.6,
      };
    });
    const weak = new Set<number>();
    for (const q of questions.filter((q) => q.atRisk))
      for (const id of q.skillIds) {
        const n = this.nodes.get(id);
        for (const p of n?.prerequisites ?? []) weak.add(p);
        weak.add(id);
      }
    return {
      questions,
      expectedCorrect: questions.reduce(
        (s, q) => s + q.predictedProbability,
        0,
      ),
      mappedCount: questions.filter((q) => q.mapped).length,
      elapsedMs: performance.now() - start,
      warmupSkillIds: [...weak]
        .sort((a, b) => this.effective(a, now) - this.effective(b, now))
        .slice(0, 3),
    };
  }
  public simulateCounterfactualFuture(
    horizonDays = 30,
    dailyMinutesPractice = 20,
  ) {
    return simulateCounterfactualFuture(
      this.getSnapshot(),
      horizonDays,
      dailyMinutesPractice,
      73491,
      this.now(),
    );
  }
  public persist(): void {
    try {
      this.storage?.setItem(this.key, JSON.stringify(this.getSnapshot()));
    } catch {
      /* quota: keep the live in-memory model */
    }
  }
}
