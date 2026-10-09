/**
 * Psychometric IRT / Rasch Scoring Engine Reference Oracle
 * Derived authoritatively from PROJECT.md and ORIGINAL_REQUEST.md (R6 §207–§215)
 */

export const CEFR_BANDS = [
  { level: "A1", thetaMin: -3.0, thetaMax: -1.8, indexMin: 0, indexMax: 29 },
  { level: "A2", thetaMin: -1.8, thetaMax: -0.8, indexMin: 30, indexMax: 44 },
  { level: "B1", thetaMin: -0.8, thetaMax: 0.2, indexMin: 45, indexMax: 64 },
  { level: "B2", thetaMin: 0.2, thetaMax: 1.2, indexMin: 65, indexMax: 79 },
  { level: "C1", thetaMin: 1.2, thetaMax: 2.2, indexMin: 80, indexMax: 91 },
  { level: "C2", thetaMin: 2.2, thetaMax: 3.0, indexMin: 92, indexMax: 100 },
];

/**
 * Probability of correct response under 2-PL IRT / Rasch model
 */
export function itemProbability(theta, b_i, a_i = 1.0) {
  const z = a_i * (theta - b_i);
  return 1 / (1 + Math.exp(-z));
}

/**
 * Piecewise concordance mapping latent ability theta in [-3.0, +3.0]
 * to the authentic 0-100 Endoora Placement Index.
 */
export function thetaToEndooraIndex(theta) {
  const clamped = Math.max(-3.0, Math.min(3.0, theta));

  if (clamped < -1.8) {
    // A1: [-3.0, -1.8) -> [0, 29]
    const ratio = (clamped - (-3.0)) / (-1.8 - (-3.0));
    return Math.max(0, Math.min(29, Math.round(ratio * 29)));
  } else if (clamped < -0.8) {
    // A2: [-1.8, -0.8) -> [30, 44]
    const ratio = (clamped - (-1.8)) / (-0.8 - (-1.8));
    return Math.max(30, Math.min(44, Math.round(30 + ratio * 14)));
  } else if (clamped < 0.2) {
    // B1: [-0.8, 0.2) -> [45, 64]
    const ratio = (clamped - (-0.8)) / (0.2 - (-0.8));
    return Math.max(45, Math.min(64, Math.round(45 + ratio * 19)));
  } else if (clamped < 1.2) {
    // B2: [0.2, 1.2) -> [65, 79]
    const ratio = (clamped - 0.2) / (1.2 - 0.2);
    return Math.max(65, Math.min(79, Math.round(65 + ratio * 14)));
  } else if (clamped < 2.2) {
    // C1: [1.2, 2.2) -> [80, 91]
    const ratio = (clamped - 1.2) / (2.2 - 1.2);
    return Math.max(80, Math.min(91, Math.round(80 + ratio * 11)));
  } else {
    // C2: [2.2, 3.0] -> [92, 100]
    const ratio = (clamped - 2.2) / (3.0 - 2.2);
    return Math.max(92, Math.min(100, Math.round(92 + ratio * 8)));
  }
}

/**
 * Returns CEFR level strictly from Endoora Index based on concordance bands.
 */
export function endooraIndexToCefr(index) {
  const clamped = Math.max(0, Math.min(100, Math.round(index)));
  for (const band of CEFR_BANDS) {
    if (clamped >= band.indexMin && clamped <= band.indexMax) {
      return band.level;
    }
  }
  return clamped >= 92 ? "C2" : "A1";
}

/**
 * Direct theta to CEFR mapping
 */
export function thetaToCefr(theta) {
  if (theta < -1.8) return "A1";
  if (theta < -0.8) return "A2";
  if (theta < 0.2) return "B1";
  if (theta < 1.2) return "B2";
  if (theta < 2.2) return "C1";
  return "C2";
}

/**
 * Estimates latent ability theta and standard error via Bayesian MAP / Newton-Raphson.
 * responses: Array<{ difficulty_b: number, discrimination_a?: number, is_correct: boolean }>
 */
export function estimateThetaRasch(responses) {
  if (!responses || responses.length === 0) {
    return { theta: 0.0, standardError: 1.0, endooraIndex: 50, cefrLevel: "B1" };
  }

  // Prior parameters (standard normal: mu = 0, sigma = 1)
  const priorMean = 0.0;
  const priorVariance = 1.0;

  let theta = 0.0; // Start at baseline
  const maxIterations = 25;
  const convergenceDelta = 0.001;

  for (let iter = 0; iter < maxIterations; iter++) {
    let firstDerivative = -(theta - priorMean) / priorVariance;
    let secondDerivative = -1.0 / priorVariance;

    for (const r of responses) {
      const a = r.discrimination_a ?? 1.0;
      const b = r.difficulty_b;
      const u = r.is_correct ? 1 : 0;
      const p = itemProbability(theta, b, a);
      const q = 1 - p;

      firstDerivative += a * (u - p);
      secondDerivative -= a * a * p * q;
    }

    if (Math.abs(secondDerivative) < 1e-9) break;

    const step = firstDerivative / secondDerivative;
    const newTheta = Math.max(-3.0, Math.min(3.0, theta - step));

    if (Math.abs(newTheta - theta) < convergenceDelta) {
      theta = newTheta;
      break;
    }
    theta = newTheta;
  }

  // Calculate Information and Standard Error: SE = 1 / sqrt(I(theta))
  let information = 1.0 / priorVariance;
  for (const r of responses) {
    const a = r.discrimination_a ?? 1.0;
    const b = r.difficulty_b;
    const p = itemProbability(theta, b, a);
    information += a * a * p * (1 - p);
  }
  const standardError = Math.round((1.0 / Math.sqrt(information)) * 1000) / 1000;
  const roundedTheta = Math.round(theta * 1000) / 1000;
  const endooraIndex = thetaToEndooraIndex(roundedTheta);
  const cefrLevel = endooraIndexToCefr(endooraIndex);

  return {
    theta: roundedTheta,
    standardError,
    endooraIndex,
    cefrLevel,
  };
}
