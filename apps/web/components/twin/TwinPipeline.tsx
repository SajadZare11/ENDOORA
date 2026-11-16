"use client";

import { useMemo, useState } from "react";
import { NeuroBayesianLearnerTwin } from "../../lib/ai/learner-twin-core";
import { createTwinNodes } from "../../lib/ai/learner-twin-store";
import type { MultiModalObservation } from "../../lib/ai/learner-twin-types";
import { useTwinFuture } from "./useTwin";
import styles from "./twin.module.css";

export default function TwinPipeline({ isFa }: { isFa: boolean }) {
  const [now] = useState(Date.now);
  const [scenario, setScenario] = useState(0);
  const [stage, setStage] = useState(0);

  const names = isFa
    ? ["سناریو ۱: سپر در برابر حدس شانسی", "سناریو ۲: تثبیت تسلط در حافظه", "سناریو ۳: ریشه‌یابی و تحلیل پیش‌نیاز"]
    : [
        "Scenario 1: Lucky guess filter",
        "Scenario 2: Deep retention",
        "Scenario 3: Prerequisite root-cause",
      ];

  const stages = isFa
    ? [
        "۱. موتورهای شش‌گانه ورودی",
        "۲. تخمین احتمال موفقیت",
        "۳. فیلتر خطا و به‌روزرسانی حافظه",
        "۴. شبیه‌سازی مسیر آینده",
      ]
    : [
        "1. Six-Engine Input",
        "2. Pre-Action Probability",
        "3. Noise Filtering & Memory Update",
        "4. Future Trajectory Simulation",
      ];

  const demo = useMemo(() => {
    const nodes = createTwinNodes(now);
    const id = scenario === 2 ? 24 : 40;
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

  const future = useTwinFuture(demo.snapshot, 30, 15);
  const end = future.pending ? undefined : future.result?.trajectory.at(-1);
  const residual = demo.obs.observedScore - demo.prediction.predictedProbability;

  return (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>
            {isFa ? "پشت صحنه هوش مصنوعی" : "INSIDE THE AI BRAIN"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isFa
              ? "دوقلوی هوشمند چگونه فکر می‌کند و یاد می‌گیرد؟"
              : "How Your Learner Twin Reasons Step-by-Step"}
          </h2>
          <p className={styles.sectionDesc}>
            {isFa
              ? "این سناریوهای تعاملی نشان می‌دهند وقتی پاسخی می‌دهی، هوش مصنوعی چطور در ۴ مرحله شانس، مکث و مهارتت را تحلیل می‌کند."
              : "Explore an interactive trace of how the Bayesian filter and neural residual assimilate each interaction."}
          </p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={scenario === i}
            className={`${styles.tabPill} ${scenario === i ? styles.tabPillActive : ""}`}
            onClick={() => {
              setScenario(i);
              setStage(0);
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 4 Pipeline Stages */}
      <div className={styles.pipelineStepsRow}>
        {stages.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-current={stage === i ? "step" : undefined}
            className={`${styles.pipelineStepBtn} ${stage === i ? styles.pipelineStepBtnActive : ""}`}
            onClick={() => setStage(i)}
          >
            <span className={styles.pipelineStepNumber}>{i + 1}</span>
            <span className={styles.pipelineStepText}>{name}</span>
          </button>
        ))}
      </div>

      <div className={styles.pipelineDetailBox} aria-live="polite">
        <h3 className={styles.pipelineDetailTitle}>{stages[stage]}</h3>

        {stage === 0 && (
          <div className={styles.pipelineStageContent}>
            <p>
              {isFa
                ? "دوقلو اطلاعات خام پاسخ تو را از موتورهای مختلف (نگارش، تلفظ، گرامر، سرعت و تمرکز) دریافت می‌کند:"
                : "Six multi-modal inputs capture writing syntax, speech phonemes, grammar knowledge, latency, and focus:"}
            </p>
            <div className={styles.engineGrid}>
              {[
                { name: "BERT · نگارش و معناشناسی", en: "BERT Semantics" },
                { name: "GRU · حافظه و پویایی یادگیری", en: "DKT-Forget Neural GRU" },
                { name: "CNN + GOP · آکوستیک و تلفظ صوتی", en: "Phonetic GOP Engine" },
                { name: "GAT + CDM · درخت پیش‌نیازها", en: "NeuralCDM Prerequisite Graph" },
                { name: "BiLSTM · تمرکز و مکث نگاه", en: "Gaze Cognitive Telemetry" },
                { name: "LinUCB · تله‌ها و گزینه‌های انحرافی", en: "Bandit Trap Distractors" },
              ].map((engine) => (
                <div key={engine.en} className={styles.engineCard}>
                  <strong>{isFa ? engine.name : engine.en}</strong>
                </div>
              ))}
            </div>
            <div className={styles.pipelineMetricPills}>
              <span>⏱️ {isFa ? "زمان پاسخ:" : "Latency:"} {demo.obs.latencyMs} ms</span>
              <span>👁️ {isFa ? "شاخص حواس‌پرتی:" : "Distraction:"} {demo.obs.gazeDistractionIndex}</span>
              <span>🧠 {isFa ? "بار ذهنی:" : "Cognitive Load:"} {demo.obs.cognitiveLoadIndex}</span>
            </div>
          </div>
        )}

        {stage === 1 && (
          <div className={styles.pipelineStageContent}>
            <p>
              {isFa
                ? "قبل از ثبت نتیجه، دوقلو با بررسی میزان تسلط قبلی، پیش‌نیازها و منحنی فراموشی تخمین می‌زند که احتمال پاسخ درست تو چقدر بوده است:"
                : "The Twin projects expected success based on prerequisite health, forgetting decay, and prior interactions:"}
            </p>
            <div className={styles.pipelineFormulaBox}>
              <div>
                <span>{isFa ? "احتمال پاسخ صحیح تخمینی:" : "Projected Success Probability:"}</span>
                <strong>{Math.round(demo.prediction.predictedProbability * 100)}٪</strong>
              </div>
              <div>
                <span>{isFa ? "تفاوت با نتیجه واقعی (خطای غافلگیری):" : "Surprise / Residual:"}</span>
                <strong>{residual > 0 ? `+${residual.toFixed(2)}` : residual.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className={styles.pipelineStageContent}>
            <p>
              {isFa
                ? "اگر پاسخی خیلی سریع یا تصادفی باشد، سپر فیلتر دوقلو آن را مهار می‌کند تا نمره واقعی دستکاری نشود. اگر پاسخ مطمئن باشد، تسلط به‌روزرسانی می‌شود:"
                : "The Kalman noise shield attenuates unconfident responses. Valid learning signals refine skill beliefs:"}
            </p>
            <div className={styles.pipelineFormulaBox}>
              <div>
                <span>{isFa ? "میزان تسلط قبلی:" : "Prior Belief:"}</span>
                <strong>{Math.round(demo.prior * 100)}٪</strong>
              </div>
              <div>
                <span>{isFa ? "میزان تسلط جدید پس از فیلتر:" : "Updated Posterior Belief:"}</span>
                <strong>{Math.round(demo.result.posteriorMean * 100)}٪</strong>
              </div>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className={styles.pipelineStageContent}>
            <p>
              {isFa
                ? "با اطلاعات جدید، دوقلو ۵۰۰ سناریوی شبیه‌سازی آینده را در پس‌زمینه اجرا می‌کند تا پیش‌بینی نمره آیلتس و مسیر رشد را به‌روز نگه دارد:"
                : "500 paired Monte Carlo trajectories project your 30-day forecast off the main thread:"}
            </p>
            {end ? (
              <div className={styles.pipelineFormulaBox}>
                <div>
                  <span>{isFa ? "نمره تخمینی ۳۰ روز آینده:" : "30-Day Projected Band:"}</span>
                  <strong>Band {end.projectedOverallBand.toFixed(1)}</strong>
                </div>
                <div>
                  <span>{isFa ? "سرعت محاسبه در مرورگر:" : "Worker Compute Time:"}</span>
                  <strong>{future.result?.elapsedMs.toFixed(1)} ms</strong>
                </div>
              </div>
            ) : (
              <p>{future.error || (isFa ? "در حال محاسبه…" : "Simulating…")}</p>
            )}
          </div>
        )}
      </div>

      <div className={styles.pipelineNavButtons}>
        <button
          type="button"
          className={styles.btnSecondary}
          disabled={stage === 0}
          onClick={() => setStage((s) => s - 1)}
        >
          {isFa ? "← مرحله قبل" : "← Previous Step"}
        </button>
        <span className={styles.pipelineStepIndicator}>
          {isFa ? `مرحله ${stage + 1} از ۴` : `Step ${stage + 1} of 4`}
        </span>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={stage === 3}
          onClick={() => setStage((s) => s + 1)}
        >
          {isFa ? "مرحله بعد →" : "Next Step →"}
        </button>
      </div>
    </section>
  );
}
