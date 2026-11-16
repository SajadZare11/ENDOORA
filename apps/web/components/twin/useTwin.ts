"use client";
import { useEffect, useRef, useState } from "react";
import {
  getLearnerTwin,
  reloadLearnerTwin,
  TWIN_EVENT,
} from "../../lib/ai/learner-twin-store";
import type {
  CounterfactualTrajectoryPoint,
  TwinSnapshot,
} from "../../lib/ai/learner-twin-types";

export function useTwin() {
  const [snapshot, setSnapshot] = useState<TwinSnapshot | null>(null);
  useEffect(() => {
    const refresh = () => setSnapshot(getLearnerTwin()?.getSnapshot() ?? null);
    const storage = (event: StorageEvent) => reloadLearnerTwin(event.key);
    refresh();
    window.addEventListener(TWIN_EVENT, refresh);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener(TWIN_EVENT, refresh);
      window.removeEventListener("storage", storage);
    };
  }, []);
  return snapshot;
}
export function useTwinFuture(
  snapshot: TwinSnapshot | null,
  days: number,
  minutes: number,
) {
  const worker = useRef<Worker | null>(null),
    requestId = useRef(0);
  const [result, setResult] = useState<{
    trajectory: CounterfactualTrajectoryPoint[];
    elapsedMs: number;
    snapshot: TwinSnapshot;
    days: number;
    minutes: number;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    try {
      worker.current = new Worker(
        new URL("../../workers/learner-twin.worker.ts", import.meta.url),
        { type: "module" },
      );
    } catch {
      queueMicrotask(() => {
        if (active)
          setError(
            "Web Workers are unavailable. Future simulation requires a supported browser.",
          );
      });
    }
    return () => {
      active = false;
      worker.current?.terminate();
      worker.current = null;
    };
  }, []);
  useEffect(() => {
    const id = ++requestId.current;
    if (!snapshot || !worker.current) return;
    let timeout: ReturnType<typeof setTimeout>;
    const timer = setTimeout(() => {
      const instance = worker.current;
      if (!instance) return;
      setError("");
      instance.onmessage = (event) => {
        if (event.data.id !== requestId.current) return;
        clearTimeout(timeout);
        if (event.data.error) setError(event.data.error);
        else setResult({ ...event.data, snapshot, days, minutes });
      };
      instance.onerror = () => {
        clearTimeout(timeout);
        setError("Future simulation could not run. Reload to retry.");
      };
      timeout = setTimeout(() => {
        if (id === requestId.current) {
          setError("Future simulation timed out. Reload to retry.");
        }
      }, 15000);
      instance.postMessage({
        id,
        snapshot,
        horizonDays: days,
        dailyMinutes: minutes,
        now: Date.now(),
      });
    }, 150);
    return () => {
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [snapshot, days, minutes]);
  const pending =
    !!snapshot &&
    !error &&
    (!result ||
      result.snapshot !== snapshot ||
      result.days !== days ||
      result.minutes !== minutes);
  return { result, error, pending };
}
