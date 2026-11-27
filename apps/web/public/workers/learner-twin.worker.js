// apps/web/public/workers/learner-twin.worker.js
/**
 * Standalone Browser Web Worker for Neuro-Bayesian Learner Twin Counterfactual Simulation
 * Static public fallback for /workers/learner-twin.worker.js
 * Pure ES6 Vanilla JavaScript - Zero External Dependencies
 */

const IELTS_SKILLS = ["listening", "reading", "writing", "speaking"];
const CEFR_BANDS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const MODALITIES = [
  "mcq_bandit",
  "bert_writing",
  "cnn_pronunciation",
  "hex_grammar",
  "sherlock_deduction",
];

const clamp = (x, low = 0, high = 1) => Math.max(low, Math.min(high, x));
const finite = (x) => typeof x === "number" && Number.isFinite(x);
const probability = (x) => finite(x) && x >= 0 && x <= 1;

/**
 * Validates a single SkillBeliefNode against the canonical schema.
 */
function validNode(n) {
  return (
    !!n &&
    Number.isSafeInteger(n.skillId) &&
    typeof n.name === "string" &&
    typeof n.aefReference === "string" &&
    CEFR_BANDS.includes(n.cefr) &&
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

/**
 * Validates untrusted TwinSnapshot before counterfactual simulation.
 * Replicates NeuroBayesianLearnerTwin.prototype.restoreSnapshot.
 */
function validateSnapshot(raw) {
  if (!raw || typeof raw !== "object") return false;
  const s = raw;
  const m = s.calibration;

  if (
    s.version !== 2 ||
    !Array.isArray(s.nodes) ||
    !s.nodes.every(validNode) ||
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
        Math.abs(e[1]) <= 0.08
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
        MODALITIES.includes(e.modality)
    )
  ) {
    return false;
  }
  return true;
}

/**
 * Seeded, paired state-space Monte Carlo rollouts (500 trajectories).
 * Replicates simulateCounterfactualFuture from learner-twin-future.ts.
 */
function simulateCounterfactualFuture(
  snapshot,
  horizonDays = 30,
  dailyMinutes = 20,
  seed = 73491,
  now = Date.now()
) {
  if (
    !Number.isInteger(horizonDays) ||
    horizonDays < 0 ||
    horizonDays > 90 ||
    !Number.isFinite(dailyMinutes) ||
    dailyMinutes < 0 ||
    dailyMinutes > 45
  ) {
    throw new Error("Simulation supports 0–90 days and 0–45 minutes");
  }

  let rng = seed >>> 0;
  const uniform = () => {
    rng = (Math.imul(1664525, rng) + 1013904223) >>> 0;
    return (rng + 0.5) / 4294967296;
  };

  let spare;
  const normal = () => {
    if (spare !== undefined) {
      const n = spare;
      spare = undefined;
      return n;
    }
    const radius = Math.sqrt(-2 * Math.log(uniform()));
    const angle = 2 * Math.PI * uniform();
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };

  const samples = 500;
  const days = Array.from({ length: horizonDays + 1 }, (_, i) => i);
  const study = days.map(() => new Float32Array(samples));
  const noStudy = days.map(() => new Float32Array(samples));
  const retentionA = new Float32Array(days.length);
  const retentionB = new Float32Array(days.length);

  const decay = (mean, rate, hours) => {
    const floor = Math.min(mean, 0.15);
    return floor + (mean - floor) * Math.exp(-rate * hours);
  };

  const nodes = snapshot.nodes;
  const effectiveNodes = nodes.map((n) => ({
    ...n,
    mean: decay(
      n.mean,
      n.decayRatePerHour,
      Math.max(0, now - n.lastUpdatedTimestamp) / 3600000
    ),
  }));

  const pooledRate = nodes.length
    ? nodes.reduce((s, n) => s + n.decayRatePerHour, 0) / nodes.length
    : 0.001;

  const beliefs = Object.values(snapshot.modalityMastery);
  const current = beliefs.map((b) =>
    decay(b.mean, 0.001, Math.max(0, now - b.timestamp) / 3600000)
  );

  const practice = 1 - Math.exp(-dailyMinutes / 350);
  const sectionStd = beliefs.map((b) => Math.sqrt(b.variance));

  const retentionMean = effectiveNodes.length
    ? effectiveNodes.reduce((s, n) => s + n.mean, 0) / effectiveNodes.length
    : 0.5;

  const retentionVariance = effectiveNodes.length
    ? (effectiveNodes.reduce((s, n) => s + n.variance, 0) /
        effectiveNodes.length) *
      (0.25 + 0.75 / effectiveNodes.length)
    : 0.08;

  const sectionFactor = Math.exp(-0.001 * 24);
  const retentionFactor = Math.exp(-pooledRate * 24);

  const decayStep = (mean, factor) => {
    const floor = Math.min(mean, 0.15);
    return floor + (mean - floor) * factor;
  };

  for (let t = 0; t < samples; t++) {
    const a = new Float32Array(4);
    const b = new Float32Array(4);

    const shared = normal();
    for (let k = 0; k < 4; k++) {
      a[k] = b[k] = clamp(
        current[k] +
          sectionStd[k] * (0.7 * shared + Math.sqrt(0.51) * normal()),
        0.01,
        0.99
      );
    }

    let ra = clamp(retentionMean + Math.sqrt(retentionVariance) * normal());
    let rb = ra;

    for (const day of days) {
      if (day) {
        const process = normal() * Math.sqrt(0.003 ** 2 + 0.002 ** 2);
        for (let k = 0; k < 4; k++) {
          a[k] = clamp(decayStep(a[k], sectionFactor) + process, 0.01, 0.99);
          b[k] = clamp(
            decayStep(b[k], sectionFactor) + process + practice * (0.96 - b[k]),
            0.01,
            0.99
          );
        }
        ra = decayStep(ra, retentionFactor);
        rb = clamp(decayStep(rb, retentionFactor) + practice * 2 * (0.96 - rb));
      }
      noStudy[day][t] = 1 + 2 * (a[0] + a[1] + a[2] + a[3]);
      study[day][t] = 1 + 2 * (b[0] + b[1] + b[2] + b[3]);
      retentionA[day] += ra / samples;
      retentionB[day] += rb / samples;
    }
  }

  const dayZeroMean = study[0].reduce((sum, x) => sum + x, 0) / samples;
  const baseline =
    Math.round(
      (current.reduce((s, x) => s + Math.round((1 + 8 * x) * 2) / 2, 0) / 4) *
        2
    ) / 2;
  const shift = baseline - dayZeroMean;

  return days.map((day) => {
    const a = noStudy[day].sort();
    const b = study[day].sort();
    const mean = (values) => values.reduce((s, x) => s + x, 0) / samples;
    const center = day === 0 ? baseline : clamp(mean(b) + shift, 1, 9);
    const noStudyCenter = day === 0 ? baseline : clamp(mean(a) + shift, 1, 9);

    return {
      dayOffset: day,
      projectedOverallBand: center,
      lowerBoundBand: Math.min(center, clamp(b[12] + shift, 1, 9)),
      upperBoundBand: Math.max(center, clamp(b[487] + shift, 1, 9)),
      noStudyBand: noStudyCenter,
      noStudyLowerBand: Math.min(noStudyCenter, clamp(a[12] + shift, 1, 9)),
      noStudyUpperBand: Math.max(noStudyCenter, clamp(a[487] + shift, 1, 9)),
      retentionPctIfNoStudy: retentionA[day] * 100,
      retentionPctWithAdaptiveStudy: retentionB[day] * 100,
    };
  });
}

// Dedicated Web Worker Message Listener
self.onmessage = (event) => {
  const request = event.data;
  try {
    if (!validateSnapshot(request.snapshot)) {
      throw new Error("Invalid simulation snapshot");
    }
    const start = performance.now();
    const trajectory = simulateCounterfactualFuture(
      request.snapshot,
      request.horizonDays,
      request.dailyMinutes,
      73491,
      request.now || Date.now()
    );
    self.postMessage({
      id: request.id,
      trajectory,
      elapsedMs: performance.now() - start,
    });
  } catch (error) {
    self.postMessage({
      id: request.id,
      error: error instanceof Error ? error.message : "Simulation failed",
    });
  }
};
