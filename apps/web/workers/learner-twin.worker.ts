import { simulateCounterfactualFuture } from "../lib/ai/learner-twin-future.ts";
import { NeuroBayesianLearnerTwin } from "../lib/ai/learner-twin-core.ts";
import type { TwinSnapshot } from "../lib/ai/learner-twin-types.ts";
export interface TwinWorkerRequest {
  id: number;
  snapshot: TwinSnapshot;
  horizonDays: number;
  dailyMinutes: number;
  now: number;
}
// Worker owns only a disposable clone. It cannot mutate or persist the live learner state.
self.onmessage = (event: MessageEvent<TwinWorkerRequest>) => {
  const request = event.data;
  try {
    const validator = new NeuroBayesianLearnerTwin([], { storage: null });
    if (!validator.restoreSnapshot(request.snapshot))
      throw new Error("Invalid simulation snapshot");
    const start = performance.now();
    const trajectory = simulateCounterfactualFuture(
      request.snapshot,
      request.horizonDays,
      request.dailyMinutes,
      73491,
      request.now,
    );
    self.postMessage({
      id: request.id,
      trajectory,
      elapsedMs: performance.now() - start,
    });
  } catch (error) {
    self.postMessage({
      id: request.id,
      error: error instanceof Error ? error.message : "Simulation failed",
    });
  }
};
