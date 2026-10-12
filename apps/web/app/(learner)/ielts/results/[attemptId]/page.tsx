'use client';

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { loadAttemptFromStorage } from "@/lib/ielts-state.ts";
import { PublicShell } from "@/components/marketing/PublicShell";
import type { ExamAttempt, QuestionGradingResult } from "@endoora/contracts";
import styles from "./ielts-results.module.css";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default function IELTSResultsPage({ params }: PageProps) {
  const { attemptId } = use(params);

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "incorrect" | "correct">("all");

  useEffect(() => {
    const loaded = loadAttemptFromStorage(attemptId);
    if (loaded) {
      setAttempt(loaded);
    }
    setLoading(false);
  }, [attemptId]);

  if (loading) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          در حال بارگذاری کارنامه و تحلیل تشخیصی آزمون آیلتس...
        </div>
      </PublicShell>
    );
  }

  if (!attempt) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>کارنامه مورد نظر یافت نشد</h2>
          <p style={{ color: "#6b7280", margin: "12px 0 24px" }}>
            اطلاعات این آزمون در حافظه مرورگر شما موجود نیست یا منقضی شده است.
          </p>
          <Link href="/ielts" className={styles.primaryActionBtn}>
            بازگشت به بانک آزمون‌ها
          </Link>
        </div>
      </PublicShell>
    );
  }

  const results = attempt.grading_results || [];
  const filteredQuestions = results.filter((q) => {
    if (filterMode === "correct") return q.is_correct;
    if (filterMode === "incorrect") return !q.is_correct;
    return true;
  });

  const correctCount = results.filter((q) => q.is_correct).length;
  const incorrectCount = results.length - correctCount;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} دقیقه و ${s} ثانیه`;
  };

  return (
    <PublicShell locale="fa" currentPath="/ielts">
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <span className={styles.kicker}>IELTS Diagnostic Performance Report</span>
          <h1 className={styles.title}>کارنامه و تحلیل تشخیصی آزمون شبیه‌ساز آیلتس</h1>
          <p className={styles.subtitle}>
            تحلیل جامع و علمی عملکرد در آزمون {attempt.exam_title}، نمره باند محاسبه‌شده و نقاط نیازمند تقویت.
          </p>
        </header>

        {/* Hero Score Card */}
        <section className={styles.heroCard} aria-label="خلاصه نمره کل">
          <div className={styles.heroScoreLeft}>
            <div className={styles.bandCircle}>
              <span className={styles.bandCircleNum}>
                {attempt.band_score !== undefined ? attempt.band_score : "—"}
              </span>
              <span className={styles.bandCircleLabel}>IELTS BAND</span>
            </div>

            <div className={styles.heroMeta}>
              <h2 className={styles.examTitleMeta}>{attempt.exam_title}</h2>
              {attempt.diagnostic?.cefr_level && (
                <span className={styles.cefrBadge}>
                  سطح استاندارد: CEFR {attempt.diagnostic.cefr_level}
                </span>
              )}
              <p className={styles.cefrDesc}>
                {attempt.diagnostic?.cefr_description_fa ||
                  "تسلط بسیار مطلوب بر درک مفاهیم کلیدی و تفکیک جزییات متنی."}
              </p>
            </div>
          </div>

          <div className={styles.heroStatsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                {attempt.raw_score !== undefined ? `${attempt.raw_score}/40` : "—"}
              </div>
              <div className={styles.statLbl}>نمره خام</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statVal}>
                {attempt.diagnostic?.accuracy_rate !== undefined
                  ? `${attempt.diagnostic.accuracy_rate}%`
                  : "—"}
              </div>
              <div className={styles.statLbl}>درصد پاسخ صحیح</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statVal} style={{ fontSize: "1.1rem" }}>
                {formatSeconds(attempt.time_spent_seconds)}
              </div>
              <div className={styles.statLbl}>زمان سپری‌شده</div>
            </div>
          </div>
        </section>

        {/* Diagnostic Breakdown by Question Type */}
        {attempt.diagnostic?.question_type_stats && (
          <section className={styles.diagSection} aria-label="تحلیل انواع سوالات">
            <h2 className={styles.sectionHeader}>
              <span>📊</span> تفکیک عملکرد به ازای انواع سوالات
            </h2>

            <div className={styles.typeStatsGrid}>
              {Object.entries(attempt.diagnostic.question_type_stats).map(
                ([typeKey, stat]) => (
                  <div key={typeKey} className={styles.typeStatCard}>
                    <div className={styles.typeStatTop}>
                      <span>{typeKey.replace(/_/g, " ").toUpperCase()}</span>
                      <span>
                        {stat.correct}/{stat.total} ({stat.accuracy}%)
                      </span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{
                          width: `${stat.accuracy}%`,
                          background:
                            stat.accuracy >= 75
                              ? "#10b981"
                              : stat.accuracy >= 50
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>

            {attempt.diagnostic.recommendations &&
              attempt.diagnostic.recommendations.length > 0 && (
                <ul className={styles.adviceList}>
                  {attempt.diagnostic.recommendations.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              )}
          </section>
        )}

        {/* Question-by-Question Review */}
        <section className={styles.reviewSection} aria-label="مرور تک‌تک سوالات">
          <h2 className={styles.sectionHeader}>
            <span>🔍</span> مرور تحلیلی تک‌تک سوالات آزمون
          </h2>

          <div className={styles.filterPillsRow}>
            <button
              type="button"
              className={`${styles.filterPill} ${
                filterMode === "all" ? styles.filterPillActive : ""
              }`}
              onClick={() => setFilterMode("all")}
            >
              همه سوالات ({results.length})
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${
                filterMode === "incorrect" ? styles.filterPillActive : ""
              }`}
              onClick={() => setFilterMode("incorrect")}
            >
              پاسخ‌های نادرست ({incorrectCount})
            </button>
            <button
              type="button"
              className={`${styles.filterPill} ${
                filterMode === "correct" ? styles.filterPillActive : ""
              }`}
              onClick={() => setFilterMode("correct")}
            >
              پاسخ‌های صحیح ({correctCount})
            </button>
          </div>

          <div>
            {filteredQuestions.map((q) => (
              <div
                key={q.question_id}
                className={`${styles.questionReviewCard} ${
                  q.is_correct
                    ? styles.questionReviewCardCorrect
                    : styles.questionReviewCardIncorrect
                }`}
              >
                <div className={styles.qReviewHeader}>
                  <strong style={{ fontSize: "1rem", color: "#0f172a" }}>
                    Question {q.question_number}
                  </strong>
                  <span
                    className={
                      q.is_correct
                        ? styles.statusBadgeCorrect
                        : styles.statusBadgeIncorrect
                    }
                  >
                    {q.is_correct ? "✓ Correct (+1)" : "✗ Incorrect (0)"}
                  </span>
                </div>

                <div className={styles.answersCompareRow}>
                  <div>
                    <span style={{ color: "#64748b", fontWeight: 700 }}>
                      Your Answer:{" "}
                    </span>
                    <strong
                      style={{
                        color: q.is_correct ? "#16a34a" : "#dc2626",
                        marginRight: "16px",
                      }}
                    >
                      {Array.isArray(q.user_answer)
                        ? q.user_answer.join(", ")
                        : q.user_answer || "(Unanswered)"}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: "#64748b", fontWeight: 700 }}>
                      Accepted Answer(s):{" "}
                    </span>
                    <strong style={{ color: "#16a34a" }}>
                      {q.accepted_answers.join(" / ")}
                    </strong>
                  </div>

                  {q.transcript_timestamp && (
                    <div style={{ color: "#2563eb", fontWeight: 700 }}>
                      ⏱️ Audio Timestamp: [{q.transcript_timestamp}]
                    </div>
                  )}
                </div>

                {q.explanation && (
                  <div className={styles.explanationBox}>
                    <strong>Explanation: </strong>
                    {q.explanation}
                    {q.passage_reference && (
                      <span style={{ display: "block", marginTop: "4px", color: "#1d4ed8" }}>
                        📌 Reference: {q.passage_reference}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className={styles.actionsBar}>
          <Link
            href={`/ielts/exam/${attempt.exam_id}?skill=${attempt.skill}`}
            className={styles.primaryActionBtn}
          >
            تکرار مجدد این آزمون (Retake Exam)
          </Link>
          <Link href="/ielts" className={styles.secondaryActionBtn}>
            بازگشت به بانک تمام آزمون‌ها
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
