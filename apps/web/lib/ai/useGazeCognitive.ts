"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GazeCognitiveEngine } from "./gaze-cognitive-engine.ts";
import type { GazeCognitiveTelemetry } from "./gaze-cognitive-types.ts";

export interface UseGazeCognitiveOptions {
  autoStart?: boolean;
  useMouseFallback?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onWatsonHint?: (telemetry: GazeCognitiveTelemetry) => void;
  onHighCognitiveLoad?: (telemetry: GazeCognitiveTelemetry) => void;
}

export function useGazeCognitive(options: UseGazeCognitiveOptions = {}) {
  const {
    autoStart = false,
    useMouseFallback = true,
    videoRef,
    onWatsonHint,
    onHighCognitiveLoad,
  } = options;

  const engine = GazeCognitiveEngine.getInstance();
  const [telemetry, setTelemetry] = useState<GazeCognitiveTelemetry>(() =>
    engine.getCurrentTelemetry()
  );
  const [isWatsonHintActive, setIsWatsonHintActive] = useState<boolean>(false);

  useEffect(() => {
    const unsubTelemetry = engine.subscribeTelemetry((t) => {
      setTelemetry(t);
      if (t.isHighCognitiveLoad && onHighCognitiveLoad) {
        onHighCognitiveLoad(t);
      }
    });

    const unsubWatson = engine.subscribeWatsonHint((t) => {
      setIsWatsonHintActive(true);
      if (onWatsonHint) {
        onWatsonHint(t);
      }
    });

    if (autoStart) {
      engine.startTracking({
        videoElement: videoRef?.current,
        useMouseFallback,
      });
    }

    return () => {
      unsubTelemetry();
      unsubWatson();
      if (autoStart) {
        engine.stopTracking();
      }
    };
  }, [autoStart, useMouseFallback, videoRef, onWatsonHint, onHighCognitiveLoad, engine]);

  const startTracking = useCallback(() => {
    engine.startTracking({
      videoElement: videoRef?.current,
      useMouseFallback,
    });
  }, [engine, videoRef, useMouseFallback]);

  const stopTracking = useCallback(() => {
    engine.stopTracking();
  }, [engine]);

  const dismissWatsonHint = useCallback(() => {
    setIsWatsonHintActive(false);
  }, []);

  return {
    telemetry,
    cognitiveLoadIndex: telemetry.cognitiveLoadIndex,
    saccadicRegressionRate: telemetry.saccadicRegressionRate,
    isHighCognitiveLoad: telemetry.isHighCognitiveLoad,
    shouldTriggerWatsonHint: telemetry.shouldTriggerWatsonHint || isWatsonHintActive,
    isWatsonHintActive,
    proctoring: telemetry.proctoring,
    startTracking,
    stopTracking,
    dismissWatsonHint,
    engine,
  };
}
