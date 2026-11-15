"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type {
  BertEvaluationResult,
  BertEvaluatorStatus,
  ModelLoadingProgress,
  WorkerInMessage,
  WorkerOutMessage,
} from "./types";

export interface UseBertEvaluatorOptions {
  autoInit?: boolean;
}

export function useBertEvaluator(options: UseBertEvaluatorOptions = {}) {
  const { autoInit = false } = options;

  const [status, setStatus] = useState<BertEvaluatorStatus>("idle");
  const [progress, setProgress] = useState<ModelLoadingProgress | null>(null);
  const [result, setResult] = useState<BertEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingEvaluationRef = useRef<{
    resolve: (res: BertEvaluationResult) => void;
    reject: (err: Error) => void;
  } | null>(null);

  const getWorker = useCallback((): Worker => {
    if (workerRef.current) {
      return workerRef.current;
    }

    let worker: Worker;
    try {
      worker = new Worker(
        new URL("../../workers/bert-evaluator.worker.ts", import.meta.url),
        { type: "module" }
      );
    } catch {
      // Fallback for environments where module worker relative resolution prefers public
      worker = new Worker("/workers/bert-evaluator.worker.js", { type: "module" });
    }

    worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
      const msg = event.data;

      switch (msg.type) {
        case "PROGRESS":
          setStatus("loading");
          setProgress(msg.payload);
          break;

        case "READY":
          setStatus("ready");
          setError(null);
          break;

        case "EVALUATION_RESULT":
          setStatus("ready");
          setResult(msg.payload);
          if (pendingEvaluationRef.current) {
            pendingEvaluationRef.current.resolve(msg.payload);
            pendingEvaluationRef.current = null;
          }
          break;

        case "ERROR":
          setStatus("error");
          setError(msg.payload.message);
          if (pendingEvaluationRef.current) {
            pendingEvaluationRef.current.reject(new Error(msg.payload.message));
            pendingEvaluationRef.current = null;
          }
          break;
      }
    };

    worker.onerror = (err) => {
      setStatus("error");
      const errMsg = err.message || "Failed to execute worker.";
      setError(errMsg);
      if (pendingEvaluationRef.current) {
        pendingEvaluationRef.current.reject(new Error(errMsg));
        pendingEvaluationRef.current = null;
      }
    };

    workerRef.current = worker;
    return worker;
  }, []);

  const initializeModel = useCallback(() => {
    if (status === "loading" || status === "ready" || status === "evaluating") {
      return;
    }
    try {
      const worker = getWorker();
      setStatus("loading");
      const initMsg: WorkerInMessage = { type: "INIT" };
      worker.postMessage(initMsg);
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to start worker.");
    }
  }, [getWorker, status]);

  const evaluateEssay = useCallback(
    async (
      text: string,
      promptText: string,
      targetWords: number = 250
    ): Promise<BertEvaluationResult> => {
      if (!text.trim()) {
        throw new Error("متن رایتینگ خالی است.");
      }

      const worker = getWorker();
      setStatus("evaluating");
      setError(null);

      return new Promise((resolve, reject) => {
        pendingEvaluationRef.current = { resolve, reject };

        const msg: WorkerInMessage = {
          type: "EVALUATE_ESSAY",
          payload: {
            text,
            promptText,
            targetWords,
          },
        };
        worker.postMessage(msg);
      });
    },
    [getWorker]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    if (status !== "loading" && status !== "evaluating") {
      setStatus("ready");
    }
  }, [status]);

  useEffect(() => {
    if (autoInit) {
      initializeModel();
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [autoInit, initializeModel]);

  return {
    status,
    progress,
    result,
    error,
    initializeModel,
    evaluateEssay,
    reset,
  };
}
