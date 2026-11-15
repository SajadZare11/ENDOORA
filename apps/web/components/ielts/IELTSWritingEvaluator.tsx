"use client";

import React, { useState } from "react";
import { useBertEvaluator } from "../../lib/bert-evaluator/useBertEvaluator";
import type { BertEvaluationResult } from "../../lib/bert-evaluator/types";
import styles from "./ielts-writing-evaluator.module.css";

export interface IELTSWritingEvaluatorProps {
  promptText: string;
  initialText?: string;
  targetWords?: number;
  taskType?: "task1" | "task2";
  onEvaluated?: (result: BertEvaluationResult) => void;
  className?: string;
}

export function IELTSWritingEvaluator({
  promptText,
  initialText = "",
  targetWords = 250,
  taskType = "task2",
  onEvaluated,
  className = "",
}: IELTSWritingEvaluatorProps) {
  const [essayText, setEssayText] = useState(initialText);
  const { status, progress, result, error, evaluateEssay, reset } = useBertEvaluator();

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const isWordCountSufficient = wordCount >= targetWords;

  const handleEvaluate = async () => {
    if (!essayText.trim() || status === "evaluating") return;
    try {
      const res = await evaluateEssay(essayText, promptText, targetWords);
      if (onEvaluated) {
        onEvaluated(res);
      }
    } catch {
      // Error handled by hook state
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>Edge AI • Client-Side</span>
          <div>
            <h3 className={styles.title}>
              موتور تصحیح چندمقیاسه و تحلیل انسجام (Multi-Scale Distilled BERT)
            </h3>
            <p className={styles.subtitle}>
              تحلیل فوری در سطح توکن، انسجام پاراگراف و تطابق معنایی با صورت‌سؤال بدون مصرف منابع سرور
            </p>
          </div>
        </div>

        {result && (
          <button onClick={reset} className="text-xs text-slate-400 hover:text-white underline">
            تحلیل مجدد
          </button>
        )}
      </div>

      {/* Prompt Box */}
      <div className={styles.promptBox}>
        <div className={styles.promptLabel}>
          صورت‌سؤال ({taskType === "task1" ? "IELTS Writing Task 1" : "IELTS Writing Task 2"}):
        </div>
        <div className={styles.promptContent}>{promptText}</div>
      </div>

      {/* Editor Section */}
      <div className={styles.editorSection}>
        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="متن رایتینگ خود را به زبان انگلیسی اینجا بنویسید یا کپی کنید..."
          rows={10}
          className={styles.textarea}
          disabled={status === "evaluating"}
        />

        <div className={styles.editorFooter}>
          <div className={styles.wordCount}>
            تعداد کلمات:{" "}
            <span className={isWordCountSufficient ? styles.wordCountValid : ""}>
              {wordCount}
            </span>{" "}
            / {targetWords} کلمه الزامی
          </div>

          <div className={styles.controls}>
            <button
              onClick={handleEvaluate}
              disabled={status === "evaluating" || !essayText.trim()}
              className={styles.evaluateBtn}
            >
              {status === "evaluating" ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  در حال استنتاج معنایی با BERT...
                </>
              ) : status === "loading" ? (
                <>
                  <span className="inline-block animate-spin">🔄</span>
                  در حال دانلود مدل هوش مصنوعی ({progress?.progress || 0}%)...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  ارزیابی هوشمند و تحلیل انسجام متن
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Model First-Time Download Progress */}
      {status === "loading" && progress && (
        <div className={styles.progressCard}>
          <div className="text-sm font-semibold text-slate-200">
            بارگذاری مدل سبک DeBERTa/MiniLM در مرورگر شما
          </div>
          <div className="text-xs text-slate-400 mt-1">
            فایل: {progress.file || "weights.onnx"} (بار اول دریافت و در حافظه کش مرورگر ذخیره می‌شود)
          </div>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress.progress || 10}%` }}
            />
          </div>
          <div className="text-xs text-emerald-400 font-mono">
            {progress.progress || 0}% تکمیل شده است
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-sm mb-6">
          خطا در اجرای مدل: {error}
        </div>
      )}

      {/* Multi-Scale Evaluation Results */}
      {result && (
        <div className={styles.resultsContainer}>
          {/* Top Score Banner */}
          <div className={styles.scoreBanner}>
            <div className={styles.overallCard}>
              <div className="text-xs font-semibold text-emerald-300 mb-1">
                تخمین نمره کل آیلتس
              </div>
              <div className={styles.overallBandNumber}>{result.overallBand}</div>
              <div className="text-xs text-emerald-200/80">
                سطح تخمینی: {result.cefrLevel} • زمان استنتاج: {result.executionTimeMs}ms
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className="text-xs text-slate-400 mb-1">تطابق با صورت‌سؤال (TR)</div>
              <div className={styles.metricNumber}>{result.promptAlignmentScore}%</div>
              <div className="text-xs text-slate-400">شباهت کسینوسی بردار کل سند</div>
            </div>

            <div className={styles.metricCard}>
              <div className="text-xs text-slate-400 mb-1">انسجام بین‌پاراگرافی (CC)</div>
              <div className={styles.metricNumber}>{result.averageParagraphCohesion}%</div>
              <div className="text-xs text-slate-400">پیوستگی مفهومی پاراگراف‌ها</div>
            </div>

            <div className={styles.metricCard}>
              <div className="text-xs text-slate-400 mb-1">تنوع واژگانی (TTR)</div>
              <div className={styles.metricNumber}>
                {(result.typeTokenRatio * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-slate-400">
                {result.uniqueTokenCount} واژه متمایز از {result.tokenCount}
              </div>
            </div>
          </div>

          {/* 4 Official IELTS Criteria */}
          <div className={styles.criteriaGrid}>
            {/* Task Response */}
            <div className={styles.criterionCard}>
              <div className={styles.criterionHeader}>
                <span className={styles.criterionTitle}>Task Response (TR)</span>
                <span className={styles.criterionBand}>
                  Band {result.criteria.taskResponse.band}
                </span>
              </div>
              <div className={styles.criterionBar}>
                <div
                  className={styles.criterionFill}
                  style={{ width: `${result.criteria.taskResponse.score}%` }}
                />
              </div>
              <p className={styles.criterionGuidance}>
                {result.criteria.taskResponse.guidanceFa}
              </p>
            </div>

            {/* Coherence & Cohesion */}
            <div className={styles.criterionCard}>
              <div className={styles.criterionHeader}>
                <span className={styles.criterionTitle}>Coherence & Cohesion (CC)</span>
                <span className={styles.criterionBand}>
                  Band {result.criteria.coherenceCohesion.band}
                </span>
              </div>
              <div className={styles.criterionBar}>
                <div
                  className={styles.criterionFill}
                  style={{ width: `${result.criteria.coherenceCohesion.score}%` }}
                />
              </div>
              <p className={styles.criterionGuidance}>
                {result.criteria.coherenceCohesion.guidanceFa}
              </p>
            </div>

            {/* Lexical Resource */}
            <div className={styles.criterionCard}>
              <div className={styles.criterionHeader}>
                <span className={styles.criterionTitle}>Lexical Resource (LR)</span>
                <span className={styles.criterionBand}>
                  Band {result.criteria.lexicalResource.band}
                </span>
              </div>
              <div className={styles.criterionBar}>
                <div
                  className={styles.criterionFill}
                  style={{ width: `${result.criteria.lexicalResource.score}%` }}
                />
              </div>
              <p className={styles.criterionGuidance}>
                {result.criteria.lexicalResource.guidanceFa}
              </p>
            </div>

            {/* Grammatical Accuracy */}
            <div className={styles.criterionCard}>
              <div className={styles.criterionHeader}>
                <span className={styles.criterionTitle}>Grammar & Accuracy (GRA)</span>
                <span className={styles.criterionBand}>
                  Band {result.criteria.grammaticalAccuracy.band}
                </span>
              </div>
              <div className={styles.criterionBar}>
                <div
                  className={styles.criterionFill}
                  style={{ width: `${result.criteria.grammaticalAccuracy.score}%` }}
                />
              </div>
              <p className={styles.criterionGuidance}>
                {result.criteria.grammaticalAccuracy.guidanceFa}
              </p>
            </div>
          </div>

          {/* Interactive Cohesion Heatmap */}
          <div className={styles.heatmapSection}>
            <div className={styles.heatmapTitle}>
              <span>🔥</span>
              نقشه حرارتی انسجام جمله به جمله (Cohesion Attention Heatmap)
            </div>
            <div className={styles.heatmapLegend}>
              <div>
                <span className={`${styles.legendDot} ${styles.legendGreen}`} />
                جریان معنایی پیوسته (Cosine &gt; 0.65)
              </div>
              <div>
                <span className={`${styles.legendDot} ${styles.legendAmber}`} />
                تغییر موضع معتدل (0.42 - 0.65)
              </div>
              <div>
                <span className={`${styles.legendDot} ${styles.legendRed}`} />
                افت انسجام یا پرش ناگهانی (Cosine &lt; 0.42)
              </div>
            </div>

            <div className={styles.heatmapContent}>
              {result.sentenceHeatmap.map((item, idx) => {
                let badgeClass = styles.sentenceStrong;
                if (item.flowStatus === "moderate") badgeClass = styles.sentenceModerate;
                if (item.flowStatus === "abrupt") badgeClass = styles.sentenceAbrupt;

                return (
                  <span
                    key={idx}
                    title={
                      item.similarityWithPrevious !== null
                        ? `پیوستگی با جمله قبل: ${(item.similarityWithPrevious * 100).toFixed(0)}% | ${item.feedbackFa}`
                        : item.feedbackFa
                    }
                    className={`${styles.sentenceSpan} ${badgeClass}`}
                  >
                    {item.sentence}{" "}
                  </span>
                );
              })}
            </div>

            {/* Paragraph Transition Flow */}
            <div className={styles.paragraphFlow}>
              <div className="text-xs font-bold text-slate-300 mb-2">
                بررسی گام‌به‌گام توالی پاراگراف‌ها:
              </div>
              {result.paragraphs.map((p, idx) => (
                <div key={idx} className={styles.flowItem}>
                  <div>
                    <span className="font-bold text-slate-200">
                      پاراگراف {p.paragraphIndex}
                    </span>{" "}
                    ({p.wordCount} کلمه):{" "}
                    <span className="text-slate-400">{p.diagnosticFeedbackFa}</span>
                  </div>
                  {p.cosineWithNext !== null && (
                    <span
                      className={`${styles.flowPill} ${
                        p.flowQuality === "high"
                          ? styles.flowHigh
                          : p.flowQuality === "moderate"
                          ? styles.flowModerate
                          : styles.flowWeak
                      }`}
                    >
                      پیوستگی با بعد: {(p.cosineWithNext * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className={styles.feedbackList}>
            <div className={styles.feedbackCol}>
              <div className={`${styles.feedbackColTitle} ${styles.colGreen}`}>
                <span>✓</span> نقاط قوت رایتینگ
              </div>
              <ul className={styles.bulletList}>
                {result.strengthsFa.map((s, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.feedbackCol}>
              <div className={`${styles.feedbackColTitle} ${styles.colAmber}`}>
                <span>!</span> فرصت‌های بهبود و بازبینی
              </div>
              <ul className={styles.bulletList}>
                {result.improvementsFa.map((imp, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className="text-amber-400">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
