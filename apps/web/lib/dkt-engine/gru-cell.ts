/**
 * High-Performance Vectorized GRU Cell with Ebbinghaus Temporal Forgetting Gate
 * Pure TypeScript execution running in < 1.5ms per step in browser runtime.
 */

export const NUM_CONCEPTS = 60;
export const INPUT_DIM = 66;
export const HIDDEN_DIM = 64;
export const OUTPUT_DIM = NUM_CONCEPTS;

// Numerically stable sigmoid function
export function sigmoid(x: number): number {
  if (x >= 15) return 1;
  if (x <= -15) return 0;
  return 1 / (1 + Math.exp(-x));
}

// Math.tanh
export function tanh(x: number): number {
  return Math.tanh(x);
}

// Vector addition: out = a + b
export function vecAdd(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] + b[i];
  }
  return out;
}

// Hadamard product (element-wise multiplication): out = a * b
export function vecHadamard(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] * b[i];
  }
  return out;
}

// Matrix-Vector Multiplication: out = M * v (M is rows x cols, 1D row-major)
export function matVecMul(
  matrix: Float32Array,
  vector: Float32Array,
  rows: number,
  cols: number
): Float32Array {
  const out = new Float32Array(rows);
  for (let r = 0; r < rows; r++) {
    let sum = 0;
    const offset = r * cols;
    for (let c = 0; c < cols; c++) {
      sum += matrix[offset + c] * vector[c];
    }
    out[r] = sum;
  }
  return out;
}

export interface GruWeights {
  // Update Gate z
  W_z: Float32Array; // (HIDDEN_DIM x INPUT_DIM)
  U_z: Float32Array; // (HIDDEN_DIM x HIDDEN_DIM)
  b_z: Float32Array; // (HIDDEN_DIM)

  // Reset Gate r
  W_r: Float32Array; // (HIDDEN_DIM x INPUT_DIM)
  U_r: Float32Array; // (HIDDEN_DIM x HIDDEN_DIM)
  b_r: Float32Array; // (HIDDEN_DIM)

  // Candidate State h_tilde
  W_h: Float32Array; // (HIDDEN_DIM x INPUT_DIM)
  U_h: Float32Array; // (HIDDEN_DIM x HIDDEN_DIM)
  b_h: Float32Array; // (HIDDEN_DIM)

  // Output Projection Layer y
  W_y: Float32Array; // (OUTPUT_DIM x HIDDEN_DIM)
  b_y: Float32Array; // (OUTPUT_DIM)

  // Forgetting Decay Parameter Vector Lambda
  decayLambda: Float32Array; // (HIDDEN_DIM)
}

/**
 * Builds the 66-dimensional input vector for an interaction.
 * [0..59]: One-hot concept index
 * [60]: Correctness (1.0 or 0.0)
 * [61]: Is Persian L1 Trap (-1.0 if trap, 0.0 otherwise)
 * [62]: Cognitive Hesitation Penalty: log(1 + latency_ms / 1000)
 * [63]: Normalized Elapsed Days: log(1 + delta_hours / 24)
 * [64]: Normalized CEFR Scalar (A1=0.1, A2=0.3, B1=0.5, B2=0.7, C1=0.85, C2=1.0)
 * [65]: Concept Difficulty (0.1 .. 1.0)
 */
export function buildInputVector({
  conceptIndex,
  isCorrect,
  isTrap = false,
  latencyMs,
  deltaHours,
  cefrScalar,
  difficulty,
}: {
  conceptIndex: number;
  isCorrect: boolean;
  isTrap?: boolean;
  latencyMs: number;
  deltaHours: number;
  cefrScalar: number;
  difficulty: number;
}): Float32Array {
  const x = new Float32Array(INPUT_DIM);
  const outcomeSign = isCorrect ? 1.0 : isTrap ? -1.5 : -1.0;
  if (conceptIndex >= 0 && conceptIndex < NUM_CONCEPTS) {
    x[conceptIndex] = outcomeSign;
  }
  x[60] = isCorrect ? 1.0 : -1.0;
  x[61] = isTrap ? -1.0 : 0.0;
  x[62] = Math.min(3.0, Math.log1p(Math.max(0, latencyMs) / 1000));
  x[63] = Math.min(5.0, Math.log1p(Math.max(0, deltaHours) / 24));
  x[64] = Math.max(0.1, Math.min(1.0, cefrScalar));
  x[65] = Math.max(0.1, Math.min(1.0, difficulty));
  return x;
}

/**
 * Executes a single forward step of the DKT-Forget GRU Cell.
 */
export function stepDktGru({
  x,
  hPrev,
  deltaDays,
  weights,
}: {
  x: Float32Array; // (INPUT_DIM)
  hPrev: Float32Array; // (HIDDEN_DIM)
  deltaDays: number;
  weights: GruWeights;
}): {
  hNext: Float32Array;
  predictions: Float32Array;
} {
  // 1. Ebbinghaus Temporal Decay on Previous Hidden State:
  // h'_t = h_{t-1} * exp(-Lambda * deltaDays)
  const hDecayed = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    const decayFactor = Math.exp(-weights.decayLambda[i] * Math.max(0, deltaDays));
    hDecayed[i] = hPrev[i] * decayFactor;
  }

  // 2. Update Gate: z_t = sigmoid(W_z * x + U_z * hDecayed + b_z)
  const zLinear = vecAdd(
    matVecMul(weights.W_z, x, HIDDEN_DIM, INPUT_DIM),
    vecAdd(matVecMul(weights.U_z, hDecayed, HIDDEN_DIM, HIDDEN_DIM), weights.b_z)
  );
  const z = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    z[i] = sigmoid(zLinear[i]);
  }

  // 3. Reset Gate: r_t = sigmoid(W_r * x + U_r * hDecayed + b_r)
  const rLinear = vecAdd(
    matVecMul(weights.W_r, x, HIDDEN_DIM, INPUT_DIM),
    vecAdd(matVecMul(weights.U_r, hDecayed, HIDDEN_DIM, HIDDEN_DIM), weights.b_r)
  );
  const r = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    r[i] = sigmoid(rLinear[i]);
  }

  // 4. Candidate State: h_tilde = tanh(W_h * x + U_h * (r * hDecayed) + b_h)
  const rGatedPrev = vecHadamard(r, hDecayed);
  const hTildeLinear = vecAdd(
    matVecMul(weights.W_h, x, HIDDEN_DIM, INPUT_DIM),
    vecAdd(matVecMul(weights.U_h, rGatedPrev, HIDDEN_DIM, HIDDEN_DIM), weights.b_h)
  );
  const hTilde = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    hTilde[i] = tanh(hTildeLinear[i]);
  }

  // 5. New Hidden State: h_t = (1 - z) * hDecayed + z * hTilde
  const hNext = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    hNext[i] = (1 - z[i]) * hDecayed[i] + z[i] * hTilde[i];
  }

  // 6. Prediction Projection: y = sigmoid(W_y * h_t + b_y)
  const yLinear = vecAdd(
    matVecMul(weights.W_y, hNext, OUTPUT_DIM, HIDDEN_DIM),
    weights.b_y
  );
  const predictions = new Float32Array(OUTPUT_DIM);
  for (let k = 0; k < OUTPUT_DIM; k++) {
    predictions[k] = sigmoid(yLinear[k]);
  }

  return { hNext, predictions };
}

/**
 * Evaluates current recall predictions from a hidden state without taking an interaction step.
 */
export function predictFromState(
  hState: Float32Array,
  deltaDays: number,
  weights: GruWeights
): Float32Array {
  const hDecayed = new Float32Array(HIDDEN_DIM);
  for (let i = 0; i < HIDDEN_DIM; i++) {
    const decayFactor = Math.exp(-weights.decayLambda[i] * Math.max(0, deltaDays));
    hDecayed[i] = hState[i] * decayFactor;
  }

  const yLinear = vecAdd(
    matVecMul(weights.W_y, hDecayed, OUTPUT_DIM, HIDDEN_DIM),
    weights.b_y
  );
  const predictions = new Float32Array(OUTPUT_DIM);
  for (let k = 0; k < OUTPUT_DIM; k++) {
    predictions[k] = sigmoid(yLinear[k]);
  }
  return predictions;
}
