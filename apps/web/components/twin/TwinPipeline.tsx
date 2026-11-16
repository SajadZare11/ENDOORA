"use client";
import { useMemo, useState } from "react";
import { NeuroBayesianLearnerTwin } from "../../lib/ai/learner-twin-core";
import { createTwinNodes } from "../../lib/ai/learner-twin-store";
import type { MultiModalObservation } from "../../lib/ai/learner-twin-types";
import { useTwinFuture } from "./useTwin";
import styles from "./twin.module.css";
export default function TwinPipeline({ isFa }: { isFa: boolean }) {
  const [now] = useState(Date.now);
  const [scenario, setScenario] = useState(0),
    [stage, setStage] = useState(0);
  const names = isFa
    ? ["حفاظت در برابر حدس", "تثبیت یادگیری", "بررسی پیش‌نیاز"]
    : [
        "Lucky guess shielding",
        "Deep consolidation",
        "Causal prerequisite review",
      ];
  const stages = isFa
    ? [
        "شش موتور ورودی",
        "پیش‌بینی پیش از پاسخ",
        "فیلتر کالمن و خوداصلاحی",
        "شبیه‌سازی آینده",
      ]
    : [
        "Six-engine input",
        "Pre-action prediction",
        "Kalman shield + correction",
        "Counterfactual future",
      ];
  const demo = useMemo(() => {
    const nodes = createTwinNodes(now),
      id = scenario === 2 ? 24 : 40;
    nodes.forEach((n) => {
      n.mean = scenario === 0 ? 0.32 : 0.76;
    });
    const model = new NeuroBayesianLearnerTwin(nodes, {
      storage: null,
      now: () => now,
    });
    const s = model.getSnapshot();
    Object.values(s.modalityMastery).forEach((b) => {
      b.mean = scenario === 0 ? 0.4 : 0.76;
    });
    model.restoreSnapshot(s);
    const obs: MultiModalObservation = {
      skillIds: scenario === 1 ? [] : [id],
      observedScore: scenario === 2 ? 0 : scenario === 1 ? 0.82 : 1,
      modality: scenario === 1 ? "bert_writing" : "hex_grammar",
      guessingFloor: scenario === 1 ? 0.02 : 0.25,
      latencyMs: scenario === 0 ? 620 : 6000,
      expectedLatencyMs: 6000,
      gazeDistractionIndex: scenario === 0 ? 0.78 : 0,
      cognitiveLoadIndex: scenario === 2 ? 0.8 : 0.22,
      timestamp: now,
    };
    const prior =
      scenario === 1 ? s.modalityMastery.writing.mean : nodes[id].mean;
    const prediction = model.predictOutcomeBeforeInteraction(
      obs.skillIds,
      obs.guessingFloor,
      now,
      { ieltsSkill: scenario === 1 ? "writing" : undefined },
    );
    const result = model.assimilateMultiModalObservation({
      ...obs,
      prediction,
    });
    if (scenario === 1)
      model.assimilateMultiModalObservation({
        ...obs,
        modality: "cnn_pronunciation",
        observedScore: 0.86,
      });
    return { obs, prior, prediction, result, snapshot: model.getSnapshot() };
  }, [scenario, now]);
  const future = useTwinFuture(demo.snapshot, 30, 15),
    end = future.pending ? undefined : future.result?.trajectory.at(-1);
  const residual =
    demo.obs.observedScore - demo.prediction.predictedProbability;
  return (
    <section className={styles.card}>
      <span className={styles.eyebrow}>INSIDE THE TWIN</span>
      <h2>
        {isFa
          ? "ردیابی تصمیم دوقلو، گام‌به‌گام"
          : "Explore the Twin, step by step"}
      </h2>
      <p>
        {isFa
          ? "مثال‌های آموزشی در مدل جداگانه اجرا می‌شوند و شواهد شخصی تو را تغییر نمی‌دهند."
          : "These illustrative scenarios run in an isolated model and leave your personal evidence untouched."}
      </p>
      <div
        className={styles.controls}
        aria-label={isFa ? "سناریو" : "Scenario"}
      >
        {names.map((name, i) => (
          <button
            key={name}
            aria-pressed={scenario === i}
            className={scenario === i ? styles.selected : styles.button}
            onClick={() => {
              setScenario(i);
              setStage(0);
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles.pipeline}>
        {stages.map((name, i) => (
          <button
            key={name}
            aria-current={stage === i ? "step" : undefined}
            className={`${styles.pipelineStage} ${stage === i ? styles.activeStage : ""}`}
            onClick={() => setStage(i)}
          >
            <span>{i + 1}</span>
            {name}
            <i className={styles.pulse} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={styles.details} aria-live="polite">
        <h3>{stages[stage]}</h3>
        {stage === 0 && (
          <>
            <div className={styles.engineGrid}>
              {[
                "BERT · semantics",
                "GRU · temporal mastery",
                "CNN + CTC · phonemes",
                "GAT + CDM · prerequisites",
                "CNN + BiLSTM · telemetry",
                "Siamese + LinUCB · traps",
              ].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <p dir="ltr">
              y = {demo.obs.observedScore.toFixed(2)} · latency ={" "}
              {demo.obs.latencyMs} ms · distraction ={" "}
              {demo.obs.gazeDistractionIndex} · load ={" "}
              {demo.obs.cognitiveLoadIndex}
            </p>
          </>
        )}
        {stage === 1 && (
          <>
            <p>
              {isFa
                ? "پیش‌بینی از تسلط، گذشت زمان، پیش‌نیازها و تاریخچه مرتبط به دست می‌آید."
                : "Prediction combines retained mastery, prerequisite bottlenecks, the guessing floor, and attention to related past interactions."}
            </p>
            <code dir="ltr">
              ŷ = {demo.prediction.predictedProbability.toFixed(3)}; e = y − ŷ ={" "}
              {residual.toFixed(3)}
            </code>
          </>
        )}
        {stage === 2 && (
          <>
            <code dir="ltr">
              K = PHᵀ / (HPHᵀ + R)
              <br />R = {demo.result.observationNoiseVariance.toFixed(3)}; K ={" "}
              {demo.result.kalmanGain.toFixed(3)}
              <br />
              μ: {demo.prior.toFixed(3)} →{" "}
              {demo.result.posteriorMean.toFixed(3)}
              <br />
              σ² ={" "}
              {(scenario === 1
                ? demo.snapshot.modalityMastery.writing.variance
                : demo.snapshot.nodes[scenario === 2 ? 24 : 40].variance
              ).toFixed(4)}
            </code>
            <p>
              {isFa
                ? "گام هابر با قابلیت اعتماد محدود می‌شود. تنها خطاهای قابل اعتماد روی پیش‌نیازها اثر می‌گذارند."
                : "Reliability limits the Huber update. Only reliable negative surprises can adjust prerequisite beliefs."}
            </p>
            <p>
              Brier: {demo.result.calibration.rollingBrierError.toFixed(4)} ·
              MAE: {demo.result.calibration.rollingMAE.toFixed(4)}
            </p>
          </>
        )}
        {stage === 3 && (
          <>
            <p>
              {isFa
                ? "۵۰۰ مسیر احتمالی در Web Worker با ۱۵ دقیقه تمرین روزانه، برای ۳۰ روز."
                : "500 worker trajectories, 15 minutes of daily practice, over 30 days."}
            </p>
            {end ? (
              <p dir="ltr">
                Band {end.projectedOverallBand.toFixed(2)} · 95% [
                {end.lowerBoundBand.toFixed(2)}, {end.upperBoundBand.toFixed(2)}
                ] · {future.result?.elapsedMs.toFixed(1)} ms
              </p>
            ) : (
              <p role="status">{future.error || "Simulating…"}</p>
            )}
          </>
        )}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.button}
          disabled={stage === 0}
          onClick={() => setStage((s) => s - 1)}
        >
          {isFa ? "مرحله قبل" : "Previous stage"}
        </button>
        <span>{stage + 1} / 4</span>
        <button
          className={styles.selected}
          disabled={stage === 3}
          onClick={() => setStage((s) => s + 1)}
        >
          {isFa ? "مرحله بعد" : "Next stage"}
        </button>
      </div>
    </section>
  );
}
