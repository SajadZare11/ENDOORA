import type {
  CounterfactualTrajectoryPoint,
  TwinSnapshot,
} from "./learner-twin-types.ts";
const clamp = (x: number, low = 0, high = 1) =>
  Math.max(low, Math.min(high, x));

/** Seeded, paired state-space Monte Carlo rollouts. Pure: never writes the learner state. */
export function simulateCounterfactualFuture(
  snapshot: TwinSnapshot,
  horizonDays = 30,
  dailyMinutes = 20,
  seed = 73491,
  now = Date.now(),
): CounterfactualTrajectoryPoint[] {
  if (
    !Number.isInteger(horizonDays) ||
    horizonDays < 0 ||
    horizonDays > 90 ||
    !Number.isFinite(dailyMinutes) ||
    dailyMinutes < 0 ||
    dailyMinutes > 45
  )
    throw new Error("Simulation supports 0–90 days and 0–45 minutes");
  let rng = seed >>> 0;
  const uniform = () => {
    rng = (Math.imul(1664525, rng) + 1013904223) >>> 0;
    return (rng + 0.5) / 4294967296;
  };
  let spare: number | undefined;
  const normal = () => {
    if (spare !== undefined) {
      const n = spare;
      spare = undefined;
      return n;
    }
    const radius = Math.sqrt(-2 * Math.log(uniform())),
      angle = 2 * Math.PI * uniform();
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };
  const samples = 500;
  const days = Array.from({ length: horizonDays + 1 }, (_, i) => i);
  const study = days.map(() => new Float32Array(samples));
  const noStudy = days.map(() => new Float32Array(samples));
  const retentionA = new Float32Array(days.length),
    retentionB = new Float32Array(days.length);
  const decay = (mean: number, rate: number, hours: number) => {
    const floor = Math.min(mean, 0.15);
    return floor + (mean - floor) * Math.exp(-rate * hours);
  };
  const nodes = snapshot.nodes;
  const effectiveNodes = nodes.map((n) => ({
    ...n,
    mean: decay(
      n.mean,
      n.decayRatePerHour,
      Math.max(0, now - n.lastUpdatedTimestamp) / 3_600_000,
    ),
  }));
  const pooledRate = nodes.length
    ? nodes.reduce((s, n) => s + n.decayRatePerHour, 0) / nodes.length
    : 0.001;
  const beliefs = Object.values(snapshot.modalityMastery);
  const current = beliefs.map((b) =>
    decay(b.mean, 0.001, Math.max(0, now - b.timestamp) / 3_600_000),
  );
  const practice = 1 - Math.exp(-dailyMinutes / 350);
  const sectionStd = beliefs.map((b) => Math.sqrt(b.variance));
  const retentionMean = effectiveNodes.length
    ? effectiveNodes.reduce((s, n) => s + n.mean, 0) / effectiveNodes.length
    : 0.5;
  // Pool prerequisite uncertainty conservatively with a shared learner factor.
  const retentionVariance = effectiveNodes.length
    ? (effectiveNodes.reduce((s, n) => s + n.variance, 0) /
        effectiveNodes.length) *
      (0.25 + 0.75 / effectiveNodes.length)
    : 0.08;
  const sectionFactor = Math.exp(-0.001 * 24),
    retentionFactor = Math.exp(-pooledRate * 24);
  const decayStep = (mean: number, factor: number) => {
    const floor = Math.min(mean, 0.15);
    return floor + (mean - floor) * factor;
  };
  for (let t = 0; t < samples; t++) {
    const a = new Float32Array(4),
      b = new Float32Array(4);
    // A shared draw models correlated learner uncertainty between IELTS sections.
    const shared = normal();
    for (let k = 0; k < 4; k++)
      a[k] = b[k] = clamp(
        current[k] +
          sectionStd[k] * (0.7 * shared + Math.sqrt(0.51) * normal()),
        0.01,
        0.99,
      );
    let ra = clamp(retentionMean + Math.sqrt(retentionVariance) * normal());
    let rb = ra;
    for (const day of days) {
      if (day) {
        // Shared daily innovations model section correlation; paired scenarios use identical shocks.
        const process = normal() * Math.sqrt(0.003 ** 2 + 0.002 ** 2);
        for (let k = 0; k < 4; k++) {
          a[k] = clamp(decayStep(a[k], sectionFactor) + process, 0.01, 0.99);
          b[k] = clamp(
            decayStep(b[k], sectionFactor) + process + practice * (0.96 - b[k]),
            0.01,
            0.99,
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
        2,
    ) / 2;
  const shift = baseline - dayZeroMean;
  return days.map((day) => {
    const a = noStudy[day].sort(),
      b = study[day].sort();
    const mean = (values: Float32Array) =>
      values.reduce((s, x) => s + x, 0) / samples;
    const center = day === 0 ? baseline : clamp(mean(b) + shift, 1, 9),
      noStudyCenter = day === 0 ? baseline : clamp(mean(a) + shift, 1, 9);
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
