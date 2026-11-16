import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { NeuroBayesianLearnerTwin } from "../apps/web/lib/ai/learner-twin-core.ts";
import { simulateCounterfactualFuture } from "../apps/web/lib/ai/learner-twin-future.ts";
import {
  createTwinNodes,
  getLearnerTwin,
  setTwinLearnerScope,
  beginTwinAssessment,
  finishTwinAssessment,
  resetLearnerTwin,
} from "../apps/web/lib/ai/learner-twin-store.ts";
import { DktEngine } from "../apps/web/lib/dkt-engine/dkt-engine.ts";
import type {
  MultiModalObservation,
  SkillBeliefNode,
  TwinMock,
} from "../apps/web/lib/ai/learner-twin-types.ts";
const now = 1_800_000_000_000;
const node = (
  id = 0,
  mean = 0.5,
  prerequisites: number[] = [],
): SkillBeliefNode => ({
  skillId: id,
  name: `Skill ${id}`,
  aefReference: "AEF Book 2",
  cefr: "B1",
  mean,
  variance: 0.08,
  decayRatePerHour: 0.003,
  lastUpdatedTimestamp: now,
  prerequisites,
  evidenceCount: 0,
});
const model = (nodes = [node()]) =>
  new NeuroBayesianLearnerTwin(nodes, { storage: null, now: () => now });
const observation = (
  extra: Partial<MultiModalObservation> = {},
): MultiModalObservation => ({
  skillIds: [0],
  observedScore: 1,
  modality: "hex_grammar",
  guessingFloor: 0.25,
  latencyMs: 5000,
  expectedLatencyMs: 5000,
  gazeDistractionIndex: 0,
  cognitiveLoadIndex: 0.2,
  timestamp: now,
  ...extra,
});
const close = (a: number, b: number, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) < tol, `${a} ≈ ${b}`);

test("unknown/empty skills use uncertain priors and cannot create false mastery", () => {
  const m = model();
  const p = m.predictOutcomeBeforeInteraction([999]);
  assert.ok(p.predictedProbability < 0.7);
  assert.equal(p.epistemicUncertainty, 0.25);
  assert.throws(() =>
    m.assimilateMultiModalObservation(observation({ skillIds: [999] })),
  );
  assert.throws(() =>
    m.assimilateMultiModalObservation(observation({ skillIds: [] })),
  );
});
test("pre-action prediction and simulated mock never mutate learner state", () => {
  const m = model(),
    before = m.getSnapshot();
  const p = m.predictOutcomeBeforeInteraction([0]);
  const mock: TwinMock = {
    id: "m",
    title: "Mock",
    skill: "reading",
    questions: Array.from({ length: 40 }, (_, i) => ({
      id: `q${i}`,
      number: i + 1,
      prompt: "",
      skillIds: [0],
      guessingFloor: 0.25,
      discrimination: 1,
      slipRate: 0.04,
      mapped: true,
    })),
  };
  const r = m.simulateMock(mock);
  assert.equal(r.questions.length, 40);
  assert.equal(r.mappedCount, 40);
  assert.deepEqual(m.getSnapshot(), before);
  assert.equal(r.questions[0].predictedProbability, p.predictedProbability);
});
test("joint EKF uses the matching conjunctive Jacobian and duplicate skills only once", () => {
  const m = model(),
    before = m.getSnapshot(),
    obs = observation({ cognitiveLoadIndex: 0 });
  const prediction = m.predictOutcomeBeforeInteraction(
    [0],
    0.25,
    now,
  ).predictedProbability;
  const h = 0.71,
    r = 0.07,
    k = (0.08 * h) / (h * h * 0.08 + r);
  const update = m.assimilateMultiModalObservation(obs);
  close(update.kalmanGain, Math.min(k, 0.15 / (1 - prediction)));
  close(update.posteriorMean, 0.5 + Math.min(0.15, k * (1 - prediction)));
  const duplicate = model(before.nodes);
  duplicate.assimilateMultiModalObservation({ ...obs, skillIds: [0, 0] });
  assert.deepEqual(duplicate.getSnapshot(), m.getSnapshot());
});
test("rapid distracted lucky guesses are strongly attenuated", () => {
  const clean = model([node(0, 0.32)]),
    noisy = model([node(0, 0.32)]);
  const a = clean.assimilateMultiModalObservation(observation());
  const b = noisy.assimilateMultiModalObservation(
    observation({ latencyMs: 620, gazeDistractionIndex: 0.78 }),
  );
  assert.ok(b.posteriorMean - 0.32 < (a.posteriorMean - 0.32) / 10);
  assert.equal(b.calibration.shieldedInteractions, 1);
  assert.equal(noisy.getSnapshot().nodes[0].decayRatePerHour, 0.003);
});
test("distracted slips do not damage prerequisites or accelerate forgetting", () => {
  const m = model([node(0, 0.8, [1]), node(1, 0.7)]),
    before = m.getSnapshot();
  m.assimilateMultiModalObservation(
    observation({ observedScore: 0, gazeDistractionIndex: 0.95 }),
  );
  close(m.getSnapshot().nodes[1].mean, before.nodes[1].mean);
  close(m.getSnapshot().nodes[0].decayRatePerHour, 0.003);
});
test("reliable surprise updates prerequisites once; mastered low-load evidence slows decay", () => {
  const m = model([node(0, 0.8, [1]), node(1, 0.7)]);
  m.assimilateMultiModalObservation(observation({ observedScore: 0 }));
  assert.ok(m.getSnapshot().nodes[1].mean < 0.7);
  const n = model();
  n.assimilateMultiModalObservation(observation());
  assert.ok(n.getSnapshot().nodes[0].variance < 0.08);
  close(n.getSnapshot().nodes[0].decayRatePerHour, 0.003 * 0.88);
});
test("reported Brier and MAE include full errors from noisy observations", () => {
  const m = model(),
    p = m.predictOutcomeBeforeInteraction([0]).predictedProbability;
  const r = m.assimilateMultiModalObservation(
    observation({ gazeDistractionIndex: 0.99 }),
  );
  close(r.calibration.rollingBrierError, (1 - p) ** 2);
  close(r.calibration.rollingMAE, 1 - p);
  assert.equal(model().getIELTSForecast().twinConfidencePct, 0);
});
test("captured pre-answer prediction is retained after intervening evidence", () => {
  const m = model(),
    p = m.predictOutcomeBeforeInteraction([0]);
  m.assimilateMultiModalObservation(observation());
  const result = m.assimilateMultiModalObservation(
    observation({ prediction: p, observedScore: 0 }),
  );
  close(result.priorPrediction, p.predictedProbability);
});
test("grammar never updates listening; explicit modalities update only their section", () => {
  const m = model(),
    before = m.getSnapshot().modalityMastery;
  m.assimilateMultiModalObservation(observation());
  assert.deepEqual(m.getSnapshot().modalityMastery, before);
  m.assimilateMultiModalObservation(
    observation({ skillIds: [], modality: "bert_writing" }),
  );
  assert.equal(m.getSnapshot().modalityMastery.writing.evidenceCount, 1);
  assert.deepEqual(m.getSnapshot().modalityMastery.listening, before.listening);
  m.assimilateMultiModalObservation(
    observation({
      skillIds: [],
      modality: "mcq_bandit",
      ieltsSkill: "reading",
    }),
  );
  assert.equal(m.getSnapshot().modalityMastery.reading.evidenceCount, 1);
});
test("forgetting never increases an unmastered skill and prerequisites cap predictions", () => {
  const m = model([node(0, 0.05)]);
  assert.ok(m.getSkillBeliefs(now + 86400000)[0].mean <= 0.05);
  const a = model([node(0, 0.9, [1]), node(1, 0.1)]),
    b = model([node(0, 0.9, [1]), node(1, 0.8)]);
  assert.ok(
    a.predictOutcomeBeforeInteraction([0]).predictedProbability <
      b.predictOutcomeBeforeInteraction([0]).predictedProbability,
  );
});
test("online residual MLP learns without unbounded bias or non-finite parameters", () => {
  const m = model();
  for (let i = 0; i < 200; i++)
    m.assimilateMultiModalObservation(observation({ observedScore: 0.7 }));
  const s = m.getSnapshot();
  assert.ok(s.residualWeights.some((x) => x !== 0));
  assert.ok(s.residualWeights.every(Number.isFinite));
  assert.ok(Math.abs(s.calibration.studentResidualBias) <= 0.08);
  assert.equal(s.history.length, 64);
});
test("snapshot is a deep copy, restores atomically, and merges newly added catalog skills", () => {
  const m = model();
  m.assimilateMultiModalObservation(observation());
  const saved = m.getSnapshot();
  saved.nodes[0].mean = 0.01;
  assert.notEqual(m.getSnapshot().nodes[0].mean, 0.01);
  const restored = model([node(), node(1)]);
  assert.ok(restored.restoreSnapshot(m.getSnapshot()));
  assert.equal(restored.getSnapshot().nodes.length, 2);
  const before = restored.getSnapshot();
  assert.equal(
    restored.restoreSnapshot({
      ...before,
      calibration: { ...before.calibration, rollingMAE: NaN },
    }),
    false,
  );
  assert.deepEqual(restored.getSnapshot(), before);
});
test("corrupt and unavailable storage fall back safely; valid snapshots persist", () => {
  const bad = {
    getItem: () => "{broken",
    setItem: () => {
      throw Error("quota");
    },
    removeItem: () => {},
  };
  const m = new NeuroBayesianLearnerTwin([node()], {
    storage: bad,
    now: () => now,
  });
  assert.doesNotThrow(() => m.assimilateMultiModalObservation(observation()));
  let raw = "";
  const storage = {
    getItem: () => raw,
    setItem: (_k: string, value: string) => {
      raw = value;
    },
    removeItem: () => {
      raw = "";
    },
  };
  const a = new NeuroBayesianLearnerTwin([node()], { storage, now: () => now });
  a.assimilateMultiModalObservation(observation());
  const b = new NeuroBayesianLearnerTwin([], { storage, now: () => now });
  assert.deepEqual(a.getSnapshot(), b.getSnapshot());
});
test("all band intervals contain their estimate and support low CEFR levels", () => {
  for (const value of [0.01, 0.13, 0.5, 0.99]) {
    const m = model(),
      s = m.getSnapshot();
    Object.values(s.modalityMastery).forEach((b) => {
      b.mean = value;
      b.variance = 0.001;
    });
    m.restoreSnapshot(s);
    const f = m.getIELTSForecast();
    for (const key of [
      "listening",
      "reading",
      "writing",
      "speaking",
      "overall",
    ] as const) {
      const b = f[key];
      assert.ok(b.ci95[0] <= b.band && b.band <= b.ci95[1]);
      assert.ok(b.ci95[0] >= 1 && b.ci95[1] <= 9);
    }
    if (value === 0.01) assert.equal(f.predictedCEFR, "A1");
  }
});
test("500-trajectory forecasts are seeded, non-mutating, include every endpoint and align day zero", () => {
  const m = model(),
    before = m.getSnapshot();
  for (const days of [0, 7, 14, 30, 90]) {
    const a = m.simulateCounterfactualFuture(days, 15);
    assert.equal(a.length, days + 1);
    assert.equal(a.at(-1)?.dayOffset, days);
    close(a[0].projectedOverallBand, m.getIELTSForecast().overall.band);
    assert.deepEqual(a, m.simulateCounterfactualFuture(days, 15));
    for (const p of a) {
      assert.ok(
        p.lowerBoundBand <= p.projectedOverallBand &&
          p.projectedOverallBand <= p.upperBoundBand,
      );
      assert.ok(
        p.noStudyLowerBand <= p.noStudyBand &&
          p.noStudyBand <= p.noStudyUpperBand,
      );
    }
  }
  assert.deepEqual(m.getSnapshot(), before);
  assert.notDeepEqual(
    simulateCounterfactualFuture(before, 7, 15, 1, now),
    simulateCounterfactualFuture(before, 7, 15, 2, now),
  );
});
test("zero practice matches no-study paths exactly; practice improves the paired scenario", () => {
  const m = model();
  for (const p of m.simulateCounterfactualFuture(30, 0)) {
    close(p.projectedOverallBand, p.noStudyBand);
    close(p.retentionPctIfNoStudy, p.retentionPctWithAdaptiveStudy);
  }
  const end = m.simulateCounterfactualFuture(30, 45).at(-1)!;
  assert.ok(end.projectedOverallBand > end.noStudyBand);
  assert.ok(end.retentionPctWithAdaptiveStudy > end.retentionPctIfNoStudy);
});
test("reject non-finite telemetry and out-of-bounds simulation requests", () => {
  const m = model();
  for (const extra of [
    { observedScore: NaN },
    { latencyMs: -1 },
    { expectedLatencyMs: 0 },
    { gazeDistractionIndex: 2 },
    { cognitiveLoadIndex: Infinity },
    { guessingFloor: -0.1 },
  ])
    assert.throws(() => m.assimilateMultiModalObservation(observation(extra)));
  for (const args of [
    [91, 15],
    [-1, 15],
    [7, 46],
    [7, NaN],
    [7.5, 15],
  ])
    assert.throws(() => m.simulateCounterfactualFuture(args[0], args[1]));
});
test("all 50 mock assets are answer-free, use real IDs, and expose mapping coverage", () => {
  const manifest = JSON.parse(
    fs.readFileSync("apps/web/public/twin/manifest.json", "utf8"),
  );
  assert.equal(manifest.length, 50);
  let mapped = 0,
    total = 0;
  const ids = new Set(createTwinNodes(now).map((n) => n.skillId));
  for (const exam of manifest)
    for (const module of exam.modules) {
      const raw = fs.readFileSync(
        `apps/web/public/twin/mocks/${module.file}`,
        "utf8",
      );
      assert.ok(!raw.includes("accepted_answers"));
      const mock = JSON.parse(raw) as TwinMock;
      assert.equal(mock.questions.length, 40);
      for (const q of mock.questions) {
        assert.ok(q.prompt);
        assert.ok(q.skillIds.every((id) => ids.has(id)));
        assert.equal(q.mapped, q.skillIds.length > 0);
        if (q.mapped) mapped++;
        total++;
      }
    }
  assert.equal(total, 4000);
  assert.equal(mapped, 60);
});

test("item-specific residual bias remains bounded and separate from latent mastery", () => {
  const m = model();
  const prior = m.predictOutcomeBeforeInteraction([0], 0.25, now, {
    itemId: "same-item",
  });
  m.assimilateMultiModalObservation(
    observation({ itemId: "same-item", prediction: prior }),
  );
  const withBias = m.predictOutcomeBeforeInteraction([0], 0.25, now, {
      itemId: "same-item",
    }),
    without = m.predictOutcomeBeforeInteraction([0], 0.25, now, {
      itemId: "other-item",
    });
  assert.ok(withBias.predictedProbability > without.predictedProbability);
  assert.ok(m.getSnapshot().itemResidualBias[0][1] <= 0.08);
});
test("real DKT/BERT/GOP adapters record once, isolate accounts, reject old tickets and persist resets", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
    removeItem: (k: string) => {
      values.delete(k);
    },
  };
  const globals = globalThis as unknown as Record<string, unknown>;
  const oldWindow = globals.window,
    oldStorage = globals.localStorage;
  globals.window = Object.assign(new EventTarget(), { localStorage: storage });
  globals.localStorage = storage;
  try {
    setTwinLearnerScope("adapter-a");
    DktEngine.getInstance().resetState();
    DktEngine.getInstance().recordInteraction({
      conceptId: "a1-01",
      isCorrect: true,
      latencyMs: 5000,
    });
    assert.equal(getLearnerTwin()!.getCalibration().totalInteractions, 1);
    const writing = beginTwinAssessment("bert_writing");
    finishTwinAssessment(writing, 0.8, 1_200_000);
    const speech = beginTwinAssessment("cnn_pronunciation");
    finishTwinAssessment(speech, 0.85, 10_000);
    assert.equal(
      getLearnerTwin()!.getSnapshot().modalityMastery.writing.evidenceCount,
      1,
    );
    assert.equal(
      getLearnerTwin()!.getSnapshot().modalityMastery.speaking.evidenceCount,
      1,
    );
    assert.equal(
      getLearnerTwin()!.getSnapshot().modalityMastery.listening.evidenceCount,
      0,
    );
    setTwinLearnerScope("adapter-b");
    finishTwinAssessment(writing, 0.9, 1_200_000);
    assert.equal(getLearnerTwin()!.getCalibration().totalInteractions, 0);
    setTwinLearnerScope("adapter-a");
    assert.equal(getLearnerTwin()!.getCalibration().totalInteractions, 3);
    resetLearnerTwin();
    setTwinLearnerScope("adapter-b");
    setTwinLearnerScope("adapter-a");
    assert.equal(getLearnerTwin()!.getCalibration().totalInteractions, 0);
  } finally {
    setTwinLearnerScope(null);
    if (oldWindow === undefined) delete globals.window;
    else globals.window = oldWindow;
    if (oldStorage === undefined) delete globals.localStorage;
    else globals.localStorage = oldStorage;
  }
});
const bench = model(createTwinNodes(now));
const timings = [];
for (let i = 0; i < 10; i++) {
  const start = performance.now();
  bench.simulateCounterfactualFuture(30, 15);
  timings.push(performance.now() - start);
}
timings.sort((a, b) => a - b);
console.log(
  JSON.stringify({
    benchmark: "500 trajectories × 30 days",
    medianMs: timings[5],
    maxMs: timings.at(-1),
    nodes: 60,
  }),
);
