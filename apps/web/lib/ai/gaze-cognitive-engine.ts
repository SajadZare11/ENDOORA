/**
 * EnDoora Engine 5: MobileNetV3-CNN + BiLSTM Gaze & Cognitive Load Engine.
 * 
 * Features:
 * 1. 10 FPS Edge AI sampling using Web Worker & OffscreenCanvas.
 * 2. BiLSTM Temporal Modeling of Saccadic Eye Regressions & Cognitive Hesitation.
 * 3. Proactive Watson Textual Clue triggers in Sherlock & Watson detective mysteries.
 * 4. Dual Multimodal fallback: Mouse dynamics trajectory tracking if camera is unavailable.
 * 5. Direct feeder to DKT-Forget memory gate: Modulates retention decay when learner
 *    answers correctly under high cognitive hesitation / load.
 * 6. Zero video upload guarantee: Never uploads raw video frames or images across the network.
 */

import { DktEngine } from "../dkt-engine/dkt-engine.ts";
import { updateTwinTelemetry } from './learner-twin-store.ts';
import type {
  GazeCognitiveStoredState,
  GazeCognitiveTelemetry,
  GazeWorkerInboundMessage,
  GazeWorkerOutboundMessage,
} from "./gaze-cognitive-types.ts";

const STORAGE_KEY = "endoora_gaze_cognitive_v1";
const WORKER_URL = "/workers/gaze-cognitive.worker.js";

export class GazeCognitiveEngine {
  private static instance: GazeCognitiveEngine | null = null;
  public static readonly STATE_VERSION = 1;

  private worker: Worker | null = null;
  private isWorkerReady = false;
  private isTracking = false;
  private trackingIntervalId: any = null;

  private telemetrySubscribers: Set<(t: GazeCognitiveTelemetry) => void> = new Set();
  private watsonHintSubscribers: Set<(t: GazeCognitiveTelemetry) => void> = new Set();

  private lastTelemetry: GazeCognitiveTelemetry;
  private state: GazeCognitiveStoredState;

  // Video / Canvas refs
  private activeVideoElement: HTMLVideoElement | null = null;
  private offscreenCanvas: any = null;
  private offscreenCtx: any = null;

  private constructor() {
    this.lastTelemetry = this.getDefaultTelemetry();
    this.state = this.loadState();
    this.initWorker();
  }

  public static getInstance(): GazeCognitiveEngine {
    if (!GazeCognitiveEngine.instance) {
      GazeCognitiveEngine.instance = new GazeCognitiveEngine();
    }
    return GazeCognitiveEngine.instance;
  }

  private getDefaultTelemetry(): GazeCognitiveTelemetry {
    return {
      cognitiveLoadIndex: 0.35,
      saccadicRegressionRate: 0.18,
      fixationDurationMs: 250,
      shouldTriggerWatsonHint: false,
      isHighCognitiveLoad: false,
      proctoring: {
        faceDetected: true,
        multipleFaces: false,
        gazeOffScreen: false,
        anomalyType: "normal",
        suspiciousScore: 0.05,
        anomaliesRecorded: [],
      },
      sampleRateFps: 10,
      timestamp: Date.now(),
      backend: "wasm",
    };
  }

  private loadState(): GazeCognitiveStoredState {
    if (typeof window === "undefined") {
      return {
        version: GazeCognitiveEngine.STATE_VERSION,
        recentSessions: [],
        lastUpdated: Date.now(),
      };
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          version: GazeCognitiveEngine.STATE_VERSION,
          recentSessions: [],
          lastUpdated: Date.now(),
        };
      }
      return JSON.parse(raw);
    } catch {
      return {
        version: GazeCognitiveEngine.STATE_VERSION,
        recentSessions: [],
        lastUpdated: Date.now(),
      };
    }
  }

  private saveState(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Storage quota fallback
    }
  }

  private initWorker(): void {
    if (typeof window === "undefined" || typeof Worker === "undefined") return;

    try {
      this.worker = new Worker(WORKER_URL);
      this.worker.onmessage = (e: MessageEvent<GazeWorkerOutboundMessage>) => {
        const msg = e.data;
        if (msg.type === "MODEL_READY") {
          this.isWorkerReady = true;
        } else if (msg.type === "TELEMETRY_UPDATE" && msg.telemetry) {
          this.lastTelemetry = msg.telemetry;
          this.notifyTelemetry(msg.telemetry);
        } else if (msg.type === "WATSON_HINT_TRIGGERED" && msg.telemetry) {
          this.notifyWatsonHint(msg.telemetry);
        }
      };

      const initMsg: GazeWorkerInboundMessage = { type: "INIT_MODEL" };
      this.worker.postMessage(initMsg);
    } catch {
      // In headless testing or environments without web worker support
      this.isWorkerReady = true;
    }
  }

  public subscribeTelemetry(callback: (t: GazeCognitiveTelemetry) => void): () => void {
    this.telemetrySubscribers.add(callback);
    callback(this.lastTelemetry);
    return () => this.telemetrySubscribers.delete(callback);
  }

  public subscribeWatsonHint(callback: (t: GazeCognitiveTelemetry) => void): () => void {
    this.watsonHintSubscribers.add(callback);
    return () => this.watsonHintSubscribers.delete(callback);
  }

  private notifyTelemetry(t: GazeCognitiveTelemetry): void {
    updateTwinTelemetry({ cognitiveLoadIndex:t.cognitiveLoadIndex, gazeDistractionIndex:t.backend==='mouse-multimodal-fallback'?0:t.proctoring.suspiciousScore, timestamp:t.timestamp });
    this.telemetrySubscribers.forEach((cb) => {
      try {
        cb(t);
      } catch {
        // Safe subscriber error isolation
      }
    });
  }

  private notifyWatsonHint(t: GazeCognitiveTelemetry): void {
    this.watsonHintSubscribers.forEach((cb) => {
      try {
        cb(t);
      } catch {
        // Safe subscriber error isolation
      }
    });
  }

  public getCurrentTelemetry(): GazeCognitiveTelemetry {
    return { ...this.lastTelemetry };
  }

  /**
   * Starts real-time 10 FPS tracking from webcam stream or OffscreenCanvas.
   */
  public startTracking({
    videoElement,
    useMouseFallback = true,
  }: {
    videoElement?: HTMLVideoElement | null;
    useMouseFallback?: boolean;
  } = {}): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.activeVideoElement = videoElement || null;

    if (typeof window !== "undefined") {
      // 1. OffscreenCanvas setup for video frame downsampling
      if (this.activeVideoElement && typeof OffscreenCanvas !== "undefined") {
        this.offscreenCanvas = new OffscreenCanvas(64, 64);
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
      }

      // 2. Sample at 10 frames per second (every 100 ms)
      this.trackingIntervalId = setInterval(() => {
        this.sampleTick();
      }, 100);

      // 3. Attach mouse dynamics tracking as multimodal complement / fallback
      if (useMouseFallback) {
        this.setupMouseTracking();
      }
    }
  }

  public stopTracking(): void {
    this.isTracking = false;
    if (this.trackingIntervalId) {
      clearInterval(this.trackingIntervalId);
      this.trackingIntervalId = null;
    }
  }

  private sampleTick(): void {
    if (!this.worker || !this.isTracking) return;

    if (this.activeVideoElement && this.offscreenCtx) {
      try {
        this.offscreenCtx.drawImage(this.activeVideoElement, 0, 0, 64, 64);
        const bitmap = this.offscreenCanvas.transferToImageBitmap();
        const msg: GazeWorkerInboundMessage = {
          type: "PROCESS_FRAME",
          frameData: {
            imageBitmap: bitmap,
            width: 64,
            height: 64,
            timestamp: Date.now(),
          },
        };
        this.worker.postMessage(msg, [bitmap]);
        return;
      } catch {
        // Fallback to synthetic / mouse tick
      }
    }

    // Default synthetic/mouse fallback frame
    const msg: GazeWorkerInboundMessage = {
      type: "PROCESS_FRAME",
      frameData: {
        width: 64,
        height: 64,
        timestamp: Date.now(),
      },
    };
    this.worker.postMessage(msg);
  }

  private setupMouseTracking(): void {
    if (typeof window === "undefined") return;

    let prevX = 0;
    let prevY = 0;
    let prevTime = Date.now();

    const mouseHandler = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - prevTime);
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      const dist = Math.hypot(dx, dy);
      const velocity = (dist / dt) * 1000;

      prevX = e.clientX;
      prevY = e.clientY;
      prevTime = now;

      if (this.worker) {
        const msg: GazeWorkerInboundMessage = {
          type: "PROCESS_MOUSE_TELEMETRY",
          mouseTelemetry: {
            x: e.clientX,
            y: e.clientY,
            timestamp: now,
            velocity,
            direction: Math.atan2(dy, dx),
          },
        };
        this.worker.postMessage(msg);
      }
    };

    window.addEventListener("mousemove", mouseHandler, { passive: true });
  }

  /**
   * Direct Feeder to DKT-Forget Memory Gate:
   * 
   * When user answers correctly (isCorrect = true):
   * If cognitiveLoadIndex > 0.70 or saccadicRegressionRate > 0.60:
   * System recognizes that although the answer was correct, the learner experienced
   * high cognitive hesitation / load, so their mastery is not yet automated.
   * Adjusts the effective latency penalty passed to DktEngine.
   */
  public recordInteractionWithCognitiveLoad({
    conceptId,
    isCorrect,
    latencyMs,
    isTrap = false,
    twinContext,
  }: {
    conceptId: string;
    isCorrect: boolean;
    latencyMs: number;
    isTrap?: boolean;
    twinContext?: Parameters<DktEngine['recordInteraction']>[0]['twinContext'];
  }): ReturnType<DktEngine["recordInteraction"]> {
    const dkt = DktEngine.getInstance();
    const t = this.lastTelemetry;

    let effectiveLatency = latencyMs;

    // Amplify hesitation penalty if high cognitive load or eye regressions detected
    if (isCorrect && t.isHighCognitiveLoad) {
      effectiveLatency = Math.max(latencyMs, 4500 + Math.round(t.cognitiveLoadIndex * 3000));
    } else if (isCorrect && t.saccadicRegressionRate > 0.60) {
      effectiveLatency = Math.max(latencyMs, 3800 + Math.round(t.saccadicRegressionRate * 2500));
    }

    return dkt.recordInteraction({
      conceptId,
      isCorrect,
      isTrap,
      latencyMs: effectiveLatency,
      twinContext: { ...twinContext,latencyMs },
    });
  }

  /**
   * Resets sequential trajectory state for new mystery / exam section.
   */
  public resetSequence(): void {
    if (this.worker) {
      this.worker.postMessage({ type: "RESET_SEQUENCE" });
    }
    this.lastTelemetry = this.getDefaultTelemetry();
  }
}
