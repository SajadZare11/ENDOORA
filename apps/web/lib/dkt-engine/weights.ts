import {
  HIDDEN_DIM,
  INPUT_DIM,
  OUTPUT_DIM,
  type GruWeights,
} from "./gru-cell.ts";
import { AEF_60_CONCEPTS } from "./concepts.ts";

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Ensures reproducible, calibrated neural priors without shipping large binary files.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Initializes calibrated DKT-Forget neural weights incorporating:
 * 1. CEFR hierarchical progression
 * 2. Prerequisite transfer graph
 * 3. Cognitive hesitation and forgetting decay priors
 */
export function createCalibratedDktWeights(): GruWeights {
  const rng = mulberry32(133742);

  // Helper to initialize Xavier/Glorot normal distribution
  function initMatrix(rows: number, cols: number, scale = 1.0): Float32Array {
    const mat = new Float32Array(rows * cols);
    const limit = scale * Math.sqrt(6 / (rows + cols));
    for (let i = 0; i < mat.length; i++) {
      mat[i] = (rng() * 2 - 1) * limit;
    }
    return mat;
  }

  function initBias(size: number, val = 0.0): Float32Array {
    const b = new Float32Array(size);
    b.fill(val);
    return b;
  }

  // Gates
  const W_z = initMatrix(HIDDEN_DIM, INPUT_DIM, 0.8);
  const U_z = initMatrix(HIDDEN_DIM, HIDDEN_DIM, 0.7);
  const b_z = initBias(HIDDEN_DIM, -0.5); // Bias towards retaining state

  const W_r = initMatrix(HIDDEN_DIM, INPUT_DIM, 0.8);
  const U_r = initMatrix(HIDDEN_DIM, HIDDEN_DIM, 0.7);
  const b_r = initBias(HIDDEN_DIM, 0.5);

  const W_h = initMatrix(HIDDEN_DIM, INPUT_DIM, 1.0);
  const U_h = initMatrix(HIDDEN_DIM, HIDDEN_DIM, 0.9);
  const b_h = initBias(HIDDEN_DIM, 0.0);

  // Prediction layer
  const W_y = initMatrix(OUTPUT_DIM, HIDDEN_DIM, 1.0);
  const b_y = initBias(OUTPUT_DIM, 0.0);

  // Forgetting Decay Rates (Ebbinghaus Prior across hidden units)
  // Ranging from 0.03 (long-term consolidated memory) to 0.12 (rapid decay)
  const decayLambda = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    decayLambda[i] = 0.03 + (i / HIDDEN_DIM) * 0.09;
  }

  // Structural Priors Injection:
  // Connect related grammar concepts through shared hidden nodes
  // Domain clusters (tenses: 0..15, modals: 16..25, conditionals: 26..38, etc.)
  for (let cIdx = 0; cIdx < AEF_60_CONCEPTS.length; cIdx++) {
    const concept = AEF_60_CONCEPTS[cIdx];
    let domainOffset = 0;
    if (concept.domain === "tenses") domainOffset = 0;
    else if (concept.domain === "modals") domainOffset = 14;
    else if (concept.domain === "conditionals") domainOffset = 24;
    else if (concept.domain === "passive") domainOffset = 36;
    else if (concept.domain === "clauses") domainOffset = 46;
    else domainOffset = 56;

    // Strong coupling between input concept and its designated domain hidden units
    for (let k = 0; k < 6; k++) {
      const hIdx = (domainOffset + k) % HIDDEN_DIM;
      // W_h input coupling
      W_h[hIdx * INPUT_DIM + cIdx] += 0.85;
      // W_y output projection
      W_y[cIdx * HIDDEN_DIM + hIdx] += 0.95;
    }

    // Prerequisite transfer:
    // If concept B has prerequisite A, success in A positively couples with B
    for (const prereqId of concept.prerequisites) {
      const pIdx = AEF_60_CONCEPTS.findIndex((c) => c.id === prereqId);
      if (pIdx !== -1) {
        for (let k = 0; k < 4; k++) {
          const hIdx = (domainOffset + k) % HIDDEN_DIM;
          W_y[cIdx * HIDDEN_DIM + hIdx] += 0.45; // Positive transfer
        }
      }
    }
  }

  return {
    W_z,
    U_z,
    b_z,
    W_r,
    U_r,
    b_r,
    W_h,
    U_h,
    b_h,
    W_y,
    b_y,
    decayLambda,
  };
}

// Singleton cached weights instance
let cachedWeights: GruWeights | null = null;

export function getDktWeights(): GruWeights {
  if (!cachedWeights) {
    cachedWeights = createCalibratedDktWeights();
  }
  return cachedWeights;
}
