/**
 * EnDoora Engine 5: MobileNetV3-CNN + BiLSTM Gaze & Cognitive Load Engine Types.
 * Operates in a dedicated Web Worker at 10 fps with OffscreenCanvas.
 * Zero-server video upload edge AI.
 */

export type ProctoringAnomalyType =
  | "normal"
  | "looking_away"
  | "multiple_faces"
  | "face_absent"
  | "suspicious_motion";

export interface GazeLandmarks {
  eyeGazeX: number; // Normalized screen coordinate [-1.0, 1.0]
  eyeGazeY: number; // Normalized screen coordinate [-1.0, 1.0]
  pupilDilationRatio: number; // 0.0 to 1.0
  eyeAspectRatio: number;     // EAR: blink detection
  headPitch: number;          // Degrees [-45, 45]
  headYaw: number;            // Degrees [-60, 60]
  headRoll: number;           // Degrees [-45, 45]
}

export interface GazeFrameTelemetry {
  timestamp: number;
  frameIndex: number;
  faceDetected: boolean;
  landmarks: GazeLandmarks | null;
  /** Instantaneous cognitive hesitation indicator */
  instantCognitiveLoad: number; // 0.0 to 1.0
  /** Instantaneous reading regression indicator */
  isBacktrackingSaccade: boolean;
}

export interface GazeCognitiveTelemetry {
  /** Cognitive Load Index averaged over BiLSTM temporal window (0.0 to 1.0) */
  cognitiveLoadIndex: number;
  /** Saccadic Reading Regression Rate (0.0 to 1.0) - reading backtracking frequency */
  saccadicRegressionRate: number;
  /** Mean fixation dwell time in milliseconds */
  fixationDurationMs: number;
  /** Proactive Dr. Watson hint trigger condition (backtracking on clues > 0.65) */
  shouldTriggerWatsonHint: boolean;
  /** High cognitive load trigger for DKT-Forget memory gate (> 0.70) */
  isHighCognitiveLoad: boolean;
  /** Edge Proctoring Integrity status for 50 IELTS Mock Exams */
  proctoring: {
    faceDetected: boolean;
    multipleFaces: boolean;
    gazeOffScreen: boolean;
    anomalyType: ProctoringAnomalyType;
    suspiciousScore: number; // 0.0 to 1.0
    anomaliesRecorded: string[];
  };
  sampleRateFps: number;
  timestamp: number;
  backend: "webgpu" | "wasm" | "mouse-multimodal-fallback";
}

export interface GazeWorkerInboundMessage {
  type: "INIT_MODEL" | "PROCESS_FRAME" | "PROCESS_MOUSE_TELEMETRY" | "RESET_SEQUENCE";
  frameData?: {
    imageBitmap?: ImageBitmap;
    width: number;
    height: number;
    timestamp: number;
  };
  mouseTelemetry?: {
    x: number;
    y: number;
    timestamp: number;
    velocity: number;
    direction: number;
  };
  options?: {
    sensitivity?: number;
    enableProctoring?: boolean;
    watsonTriggerThreshold?: number;
  };
}

export interface GazeWorkerOutboundMessage {
  type: "MODEL_READY" | "TELEMETRY_UPDATE" | "WATSON_HINT_TRIGGERED" | "PROCTOR_ANOMALY" | "ERROR";
  telemetry?: GazeCognitiveTelemetry;
  error?: string;
  backend?: "webgpu" | "wasm" | "mouse-multimodal-fallback";
}

export interface GazeCognitiveStoredState {
  version: number;
  recentSessions: Array<{
    sessionId: string;
    avgCognitiveLoad: number;
    avgRegressionRate: number;
    watsonHintsTriggered: number;
    proctoringAnomalies: number;
    durationSeconds: number;
    timestamp: number;
  }>;
  lastUpdated: number;
}
