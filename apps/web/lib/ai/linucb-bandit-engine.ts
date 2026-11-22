import { updateTwinVulnerability } from './learner-twin-store.ts';

/**
 * EnDoora Disjoint LinUCB Bandit Engine
 * Engine 6: Client-Side Real-Time Adaptive Distractor Selection
 *
 * Implements pure TypeScript zero-dependency 4D linear algebra:
 * - O(d^2) Sherman-Morrison rank-1 inverse covariance updates with symmetry enforcement
 * - Explicit Gauss-Jordan 4x4 matrix inversion with partial pivoting for verification
 * - Tri-modal cognitive telemetry fusion (2D-CNN GOP + Multi-Scale BERT + DKT 64D + Latency)
 * - Sub-0.2ms Upper Confidence Bound (UCB) question assembly and Fisher-Yates shuffling
 * - SSR-safe localStorage persistence under `endoora_linucb_bandit_state_v1`
 */

import type {
  AdaptiveQuestionPayload,
  AssembledQuestion,
  DistractorCandidate,
  EnDooraTriModalTelemetry,
  LinUCBArmState,
  LinUCBBanditStoredState,
  LinUCBInteractionFeedback,
  Matrix4x4,
  TrapCategory,
  Vector4,
} from "./types.ts";
import { TRAP_CATEGORIES } from "./types.ts";

// ============================================================================
// Zero-Dependency 4D Linear Algebra Routines
// ============================================================================

/**
 * Creates a 4x4 identity matrix.
 */
export function createIdentity4x4(): Matrix4x4 {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

/**
 * Computes the Euclidean (L2) norm of a 4D vector.
 */
export function l2Norm4(v: Vector4): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
}

/**
 * Normalizes a 4D vector to unit length (||v||_2 = 1.0).
 * Returns uniform vector [0.5, 0.5, 0.5, 0.5] if input norm is near zero.
 */
export function normalizeVector4(v: Vector4): Vector4 {
  const norm = l2Norm4(v);
  if (norm < 1e-12) {
    return [0.5, 0.5, 0.5, 0.5];
  }
  return [v[0] / norm, v[1] / norm, v[2] / norm, v[3] / norm];
}

/**
 * Computes the dot product of two 4D vectors.
 */
export function dotProduct4(u: Vector4, v: Vector4): number {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
}

/**
 * Multiplies a 4x4 matrix M by a 4D column vector v: M * v.
 */
export function matVecMul4(M: Matrix4x4, v: Vector4): Vector4 {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2] + M[0][3] * v[3],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2] + M[1][3] * v[3],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2] + M[2][3] * v[3],
    M[3][0] * v[0] + M[3][1] * v[1] + M[3][2] * v[2] + M[3][3] * v[3],
  ];
}

/**
 * Computes the quadratic form v^T * M * v for a 4D vector v and 4x4 matrix M.
 */
export function quadForm4(v: Vector4, M: Matrix4x4): number {
  const Mv = matVecMul4(M, v);
  return dotProduct4(v, Mv);
}

/**
 * Vector addition for 4D vectors: u + v.
 */
export function vectorAdd4(u: Vector4, v: Vector4): Vector4 {
  return [u[0] + v[0], u[1] + v[1], u[2] + v[2], u[3] + v[3]];
}

/**
 * Scalar multiplication for a 4D vector: s * v.
 */
export function vectorScale4(v: Vector4, s: number): Vector4 {
  return [v[0] * s, v[1] * s, v[2] * s, v[3] * s];
}

/**
 * Matrix addition for 4x4 matrices: A + B.
 */
export function matrixAdd4x4(A: Matrix4x4, B: Matrix4x4): Matrix4x4 {
  return [
    [A[0][0] + B[0][0], A[0][1] + B[0][1], A[0][2] + B[0][2], A[0][3] + B[0][3]],
    [A[1][0] + B[1][0], A[1][1] + B[1][1], A[1][2] + B[1][2], A[1][3] + B[1][3]],
    [A[2][0] + B[2][0], A[2][1] + B[2][1], A[2][2] + B[2][2], A[2][3] + B[2][3]],
    [A[3][0] + B[3][0], A[3][1] + B[3][1], A[3][2] + B[3][2], A[3][3] + B[3][3]],
  ];
}

/**
 * Outer product of a 4D vector with itself: x * x^T.
 */
export function outerProduct4(x: Vector4): Matrix4x4 {
  return [
    [x[0] * x[0], x[0] * x[1], x[0] * x[2], x[0] * x[3]],
    [x[1] * x[0], x[1] * x[1], x[1] * x[2], x[1] * x[3]],
    [x[2] * x[0], x[2] * x[1], x[2] * x[2], x[2] * x[3]],
    [x[3] * x[0], x[3] * x[1], x[3] * x[2], x[3] * x[3]],
  ];
}

/**
 * Sherman-Morrison rank-1 inverse matrix update:
 * Given M = A^(-1), computes (A + x * x^T)^(-1) in O(d^2) = 16 multiplications:
 *
 *   (A + x * x^T)^(-1) = M - (M * x * (M * x)^T) / (1 + x^T * M * x)
 *                      = M - (w * w^T) / (1 + x^T * w)  where w = M * x
 *
 * Includes numerical symmetry enforcement to prevent numerical drift.
 */
export function shermanMorrisonUpdate4x4(M: Matrix4x4, x: Vector4): Matrix4x4 {
  const w = matVecMul4(M, x);
  const denom = 1 + dotProduct4(x, w);

  if (Math.abs(denom) < 1e-12) {
    return M; // Numerical safety fallback
  }

  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const delta = (w[i] * w[j]) / denom;
      result[i][j] = M[i][j] - delta;
    }
  }

  // Enforce numerical symmetry: result[i][j] = result[j][i] = (result[i][j] + result[j][i]) / 2
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const avg = (result[i][j] + result[j][i]) / 2;
      result[i][j] = avg;
      result[j][i] = avg;
    }
  }

  return result;
}

/**
 * Explicit 4x4 matrix inversion using Gauss-Jordan elimination with partial pivoting.
 * Used for mathematical verification and baseline comparison against Sherman-Morrison.
 */
export function invertMatrix4x4Explicit(A: Matrix4x4): Matrix4x4 {
  // Construct augmented matrix [A | I_4]
  const aug: number[][] = [
    [A[0][0], A[0][1], A[0][2], A[0][3], 1, 0, 0, 0],
    [A[1][0], A[1][1], A[1][2], A[1][3], 0, 1, 0, 0],
    [A[2][0], A[2][1], A[2][2], A[2][3], 0, 0, 1, 0],
    [A[3][0], A[3][1], A[3][2], A[3][3], 0, 0, 0, 1],
  ];

  for (let col = 0; col < 4; col++) {
    // Partial pivoting: find maximum row in column `col`
    let maxRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let row = col + 1; row < 4; row++) {
      const val = Math.abs(aug[row][col]);
      if (val > maxVal) {
        maxVal = val;
        maxRow = row;
      }
    }

    if (maxVal < 1e-12) {
      throw new Error(`Singular matrix encountered during 4x4 inversion at col ${col}`);
    }

    // Swap current row with maxRow
    if (maxRow !== col) {
      const temp = aug[col];
      aug[col] = aug[maxRow];
      aug[maxRow] = temp;
    }

    // Normalize pivot row
    const pivot = aug[col][col];
    for (let j = 0; j < 8; j++) {
      aug[col][j] /= pivot;
    }

    // Eliminate other rows
    for (let row = 0; row < 4; row++) {
      if (row !== col) {
        const factor = aug[row][col];
        if (Math.abs(factor) > 1e-15) {
          for (let j = 0; j < 8; j++) {
            aug[row][j] -= factor * aug[col][j];
          }
        }
      }
    }
  }

  return [
    [aug[0][4], aug[0][5], aug[0][6], aug[0][7]],
    [aug[1][4], aug[1][5], aug[1][6], aug[1][7]],
    [aug[2][4], aug[2][5], aug[2][6], aug[2][7]],
    [aug[3][4], aug[3][5], aug[3][6], aug[3][7]],
  ];
}

/**
 * Fisher-Yates uniform array shuffle.
 */
export function fisherYatesShuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

// ============================================================================
// Cognitive Context Fusion
// ============================================================================

/**
 * Fuses tri-modal learner telemetry into an L2-normalized 4D context vector c_t:
 * - Dimension 0: GOP Phoneme Error Rate (PER = 1.0 - gopScore / 100)
 * - Dimension 1: Multi-Scale BERT Semantic Deficit (1.0 - cohesion / 100)
 * - Dimension 2: DKT-Forget 64D Grammar Deficit (derived from 64D GRU latent state)
 * - Dimension 3: Normalized Cognitive Hesitation Latency (min(1.0, ln(1 + latencyMs / 1000) / 2.5))
 */
export function fuseCognitiveContext(
  telemetry?: EnDooraTriModalTelemetry
): Vector4 {
  if (!telemetry) {
    // Default neutral balanced context
    return [0.5, 0.5, 0.5, 0.5];
  }

  // Dimension 0: Phoneme Error Rate
  const perRaw =
    telemetry.phonemeErrorRate ??
    telemetry.gopPhonemeErrorRate ??
    0.25;
  const dim0 = Math.max(0.0, Math.min(1.0, perRaw));

  // Dimension 1: Semantic Deficit
  const semRaw =
    telemetry.semanticDeficit ??
    telemetry.bertSemanticDeficit ??
    0.25;
  const dim1 = Math.max(0.0, Math.min(1.0, semRaw));

  // Dimension 2: DKT Grammar Deficit
  let dim2 = 0.25;
  if (telemetry.dktGrammarDeficit !== undefined) {
    dim2 = Math.max(0.0, Math.min(1.0, telemetry.dktGrammarDeficit));
  } else if (telemetry.dktHiddenState && telemetry.dktHiddenState.length > 0) {
    // Project 64D hidden state into scalar grammatical deficit
    let sum = 0;
    for (let i = 0; i < telemetry.dktHiddenState.length; i++) {
      sum += Math.abs(telemetry.dktHiddenState[i]);
    }
    const mean = sum / telemetry.dktHiddenState.length;
    // Normalized sigmoidal activation
    dim2 = Math.max(0.0, Math.min(1.0, 1.0 / (1.0 + Math.exp(mean * 1.5 - 0.5))));
  }

  // Dimension 3: Normalized Cognitive Latency
  const latencyMs = Math.max(0, telemetry.latencyMs ?? 1500);
  const dim3 = Math.min(1.0, Math.log1p(latencyMs / 1000) / 2.5);

  const rawVector: Vector4 = [dim0, dim1, dim2, dim3];
  return normalizeVector4(rawVector);
}

// ============================================================================
// EnDoora LinUCB Bandit Class
// ============================================================================

export interface LinUCBBanditOptions {
  alpha?: number;
  skipStorageLoad?: boolean;
}

export class EnDooraLinUCBBandit {
  private static instance: EnDooraLinUCBBandit | null = null;
  public static readonly STORAGE_KEY = "endoora_linucb_bandit_state_v1";
  public static readonly STATE_VERSION = 1;

  private arms: Record<TrapCategory, LinUCBArmState>;
  private alpha: number;
  private totalInteractions: number;

  constructor(options?: LinUCBBanditOptions) {
    this.alpha = options?.alpha ?? 0.5;
    this.totalInteractions = 0;
    this.arms = this.createInitialArms();

    if (!options?.skipStorageLoad) {
      this.loadState();
    }
  }

  /**
   * Singleton accessor.
   */
  public static getInstance(alpha = 0.5): EnDooraLinUCBBandit {
    if (!EnDooraLinUCBBandit.instance) {
      EnDooraLinUCBBandit.instance = new EnDooraLinUCBBandit({ alpha });
    }
    return EnDooraLinUCBBandit.instance;
  }

  /**
   * Resets singleton instance (useful for unit tests).
   */
  public static resetInstance(): void {
    EnDooraLinUCBBandit.instance = null;
  }

  /**
   * Creates initial disjoint arms with identity covariance inverse (A^(-1) = I_4)
   * and zero reward vector (b = 0).
   */
  private createInitialArms(): Record<TrapCategory, LinUCBArmState> {
    const arms = {} as Record<TrapCategory, LinUCBArmState>;
    for (const cat of TRAP_CATEGORIES) {
      arms[cat] = {
        category: cat,
        A_inv: createIdentity4x4(),
        b: [0, 0, 0, 0],
        pulls: 0,
        rewards: 0,
      };
    }
    return arms;
  }

  /**
   * Loads persisted bandit state from localStorage (SSR-safe).
   */
  private loadState(): boolean {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return false;
    }

    try {
      const raw = localStorage.getItem(EnDooraLinUCBBandit.STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw) as LinUCBBanditStoredState;
      if (!parsed || parsed.version !== 1 || !parsed.arms) {
        return false;
      }

      for (const cat of TRAP_CATEGORIES) {
        const arm = parsed.arms[cat];
        if (
          arm &&
          Array.isArray(arm.A_inv) &&
          arm.A_inv.length === 4 &&
          Array.isArray(arm.b) &&
          arm.b.length === 4
        ) {
          this.arms[cat] = {
            category: cat,
            A_inv: arm.A_inv as Matrix4x4,
            b: arm.b as Vector4,
            pulls: arm.pulls ?? 0,
            rewards: arm.rewards ?? 0,
          };
        }
      }

      if (typeof parsed.alpha === "number" && !isNaN(parsed.alpha)) {
        this.alpha = parsed.alpha;
      }
      if (typeof parsed.totalInteractions === "number") {
        this.totalInteractions = parsed.totalInteractions;
      }

      return true;
    } catch {
      // Fallback cleanly on JSON corruption or private browsing storage errors
      return false;
    }
  }

  /**
   * Saves bandit state to localStorage (SSR-safe).
   */
  private saveState(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    try {
      const state: LinUCBBanditStoredState = {
        version: 1,
        arms: this.arms,
        alpha: this.alpha,
        totalInteractions: this.totalInteractions,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(
        EnDooraLinUCBBandit.STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch {
      // Ignore quota exceeded or storage disabled
    }
  }

  /**
   * Resets all arm states back to initial identities.
   */
  public reset(options?: { preserveAlpha?: boolean }): void {
    this.arms = this.createInitialArms();
    this.totalInteractions = 0;
    if (!options?.preserveAlpha) {
      this.alpha = 0.5;
    }
    this.saveState();
  }

  /**
   * Returns a copy of the arm state for a specific category.
   */
  public getArmState(category: TrapCategory): Readonly<LinUCBArmState> {
    const arm = this.arms[category];
    return {
      category: arm.category,
      A_inv: [
        [...arm.A_inv[0]],
        [...arm.A_inv[1]],
        [...arm.A_inv[2]],
        [...arm.A_inv[3]],
      ] as Matrix4x4,
      b: [...arm.b] as Vector4,
      pulls: arm.pulls,
      rewards: arm.rewards,
    };
  }

  /**
   * Returns a snapshot of all arm states.
   */
  public getAllArms(): Record<TrapCategory, LinUCBArmState> {
    const result = {} as Record<TrapCategory, LinUCBArmState>;
    for (const cat of TRAP_CATEGORIES) {
      result[cat] = this.getArmState(cat);
    }
    return result;
  }

  /**
   * Returns a full snapshot of the bandit state.
   */
  public getState(): LinUCBBanditStoredState {
    return {
      version: EnDooraLinUCBBandit.STATE_VERSION,
      alpha: this.alpha,
      arms: this.getAllArms(),
      totalInteractions: this.totalInteractions,
      lastUpdated: Date.now(),
    };
  }

  public getAlpha(): number {
    return this.alpha;
  }

  public setAlpha(alpha: number): void {
    if (alpha >= 0) {
      this.alpha = alpha;
    }
  }

  public getTotalInteractions(): number {
    return this.totalInteractions;
  }

  /**
   * Assembles an adaptive 4-option question from a 12-item distractor pool in < 0.2ms:
   * 1. Resolves and normalizes cognitive context c_t
   * 2. Scores each distractor candidate using Disjoint LinUCB:
   *      mu = x^T * A_a^(-1) * b_a
   *      sigma = alpha * sqrt(max(0, x^T * A_a^(-1) * x))
   *      score = mu + sigma + 0.15 * (x^T * c_t)
   * 3. Selects top 3 scoring distractors
   * 4. Combines with correctAnswer into 4 options and shuffles via Fisher-Yates
   * 5. Returns AssembledQuestion with exact assembly latency
   */
  public assembleAdaptiveQuestion(
    payload: AdaptiveQuestionPayload,
    contextOrTelemetry?: Vector4 | EnDooraTriModalTelemetry,
    options?: { alpha?: number; topKDistractors?: number }
  ): AssembledQuestion {
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();

    // 1. Resolve context vector
    let context: Vector4;
    if (Array.isArray(contextOrTelemetry) && contextOrTelemetry.length === 4) {
      context = normalizeVector4(contextOrTelemetry as Vector4);
    } else {
      context = fuseCognitiveContext(contextOrTelemetry as EnDooraTriModalTelemetry | undefined);
    }

    const effectiveAlpha = options?.alpha ?? this.alpha;
    const topK = options?.topKDistractors ?? 3;

    // Handle flexible payload field aliases
    const promptText = payload.prompt || payload.question || "";
    const promptFaText = payload.promptFa || payload.prompt_fa;
    const answerText = payload.correctAnswer || payload.correct_option || "";
    const candidates = payload.distractorPool || payload.distractor_pool || [];

    // 2. Score candidates
    const scoredCandidates: Array<{
      candidate: DistractorCandidate;
      score: number;
      mu: number;
      sigma: number;
    }> = new Array(candidates.length);

    const bonusMap: Record<string, number> = {};
    const scoreMap: Record<string, number> = {};

    for (let i = 0; i < candidates.length; i++) {
      const cand = candidates[i];
      const arm = this.arms[cand.category] ?? this.arms["phonetic_ortho"];
      const x = cand.features;

      // mu = x^T * A^(-1) * b
      const Ainv_b = matVecMul4(arm.A_inv, arm.b);
      const mu = dotProduct4(x, Ainv_b);

      // variance = x^T * A^(-1) * x
      const quad = quadForm4(x, arm.A_inv);
      const sigma = effectiveAlpha * Math.sqrt(Math.max(0, quad));

      // Alignment with cognitive context
      const align = 0.15 * dotProduct4(x, context);

      const totalScore = mu + sigma + align;

      scoredCandidates[i] = {
        candidate: cand,
        score: totalScore,
        mu,
        sigma,
      };

      bonusMap[cand.id] = sigma;
      scoreMap[cand.id] = totalScore;
    }

    // 3. Sort descending by UCB score
    scoredCandidates.sort((a, b) => b.score - a.score);

    // 4. Select top K distinct distractors
    const selectedDistractors: DistractorCandidate[] = [];
    for (let i = 0; i < scoredCandidates.length && selectedDistractors.length < topK; i++) {
      selectedDistractors.push(scoredCandidates[i].candidate);
    }

    // Fallback if pool had fewer than topK
    while (selectedDistractors.length < Math.min(topK, candidates.length)) {
      const idx = selectedDistractors.length;
      if (idx < candidates.length) {
        selectedDistractors.push(candidates[idx]);
      } else {
        break;
      }
    }

    // 5. Combine with correct answer into 4 options
    const rawOptions: string[] = [answerText];
    for (let i = 0; i < selectedDistractors.length; i++) {
      rawOptions.push(selectedDistractors[i].text);
    }

    // 6. Uniform Fisher-Yates shuffle
    const shuffledOptions = fisherYatesShuffle(rawOptions);
    const correctOptionIndex = shuffledOptions.indexOf(answerText);

    const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const assemblyTimeMs = t1 - t0;

    return {
      questionId: payload.id,
      prompt: promptText,
      promptFa: promptFaText,
      options: shuffledOptions,
      correctOptionIndex: Math.max(0, correctOptionIndex),
      selectedDistractors,
      assemblyTimeMs,
      explorationBonusMap: bonusMap,
      scores: scoreMap,
    };
  }

  /**
   * Records learner interaction feedback and performs Sherman-Morrison rank-1 update.
   *
   * Supports two signatures:
   * 1. recordInteractionFeedback(feedbackObject)
   * 2. recordInteractionFeedback(category, features, trapTriggered, latencyMs)
   */
  public recordInteractionFeedback(
    arg0: TrapCategory | LinUCBInteractionFeedback,
    arg1?: Vector4,
    arg2?: boolean,
    arg3?: number
  ): void {
    let category: TrapCategory;
    let features: Vector4;
    let trapTriggered: boolean;
    let latencyMs: number | undefined;
    let explicitReward: number | undefined;

    if (typeof arg0 === "object" && arg0 !== null) {
      category = arg0.category;
      features = arg0.features;
      trapTriggered = arg0.trapTriggered;
      latencyMs = arg0.latencyMs;
      explicitReward = arg0.reward;
    } else {
      category = arg0;
      features = arg1!;
      trapTriggered = arg2 ?? false;
      latencyMs = arg3;
    }

    const arm = this.arms[category];
    if (!arm) return;

    // Ensure features are unit normalized
    const x = normalizeVector4(features);

    // Compute feedback reward:
    // If learner fell into the distractor trap: reward = 1.0 (with slight hesitation bonus)
    // If avoided: reward = 0.0 (or subtle partial signal if they hesitated heavily)
    let reward: number;
    if (explicitReward !== undefined) {
      reward = explicitReward;
    } else if (trapTriggered) {
      const hesitationBoost =
        latencyMs && latencyMs > 0
          ? 0.15 * Math.min(1.0, latencyMs / 3000)
          : 0.0;
      reward = 1.0 + hesitationBoost;
    } else {
      // Partial hesitation signal if user hovered / hesitated before finding correct answer
      reward =
        latencyMs && latencyMs > 3000
          ? 0.05 * Math.min(1.0, (latencyMs - 3000) / 3000)
          : 0.0;
    }

    // Sherman-Morrison Rank-1 covariance update: A^(-1) <- shermanMorrisonUpdate(A^(-1), x)
    arm.A_inv = shermanMorrisonUpdate4x4(arm.A_inv, x);

    // Reward vector update: b <- b + r * x
    arm.b = [
      arm.b[0] + reward * x[0],
      arm.b[1] + reward * x[1],
      arm.b[2] + reward * x[2],
      arm.b[3] + reward * x[3],
    ];

    arm.pulls += 1;
    arm.rewards += reward;
    this.totalInteractions += 1;
    // The Twin owns per-account history; use this answer, not shared-browser arm totals.
    updateTwinVulnerability(trapTriggered ? [...x] as Vector4 : [0, 0, 0, 0]);

    // Persist to localStorage
    this.saveState();
  }
}
