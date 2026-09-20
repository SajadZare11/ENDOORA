'use client';

import { Button, Table } from "@endoora/ui";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import styles from "./ielts-report.module.css";
import {
  fetchSessionReport,
  SessionReportData,
} from "../../../../../../lib/ielts-simulator";
import { PublicShell } from "../../../../../../components/marketing/PublicShell";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function IELTSDiagnosticReportPage({ params }: PageProps) {
  const { sessionId } = use(params);

  const [report, setReport] = useState<SessionReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect">("all");

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSessionReport(sessionId);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت کارنامه تشخیصی آزمون.");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minBlockSize: "60vh" }}>
          در حال محاسبه نمرات و تحلیل تشخیصی آزمون آیلتس...
        </div>
      </PublicShell>
    );
  }

  if (error || !report) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
          <h2>خطا در دریافت کارنامه</h2>
          <p>{error || "کارنامه یافت نشد."}</p>
          <Link href="/ielts/practice" className={styles.actionBtnPrimary}>
            بازگشت به مرکز آزمون‌ها
          </Link>
        </div>
      </PublicShell>
    );
  }

  const filteredQuestions = report.questions.filter((q) => {
    if (reviewFilter === "correct") return q.is_correct;
    if (reviewFilter === "incorrect") return !q.is_correct;
    return true;
  });

  const correctCount = report.questions.filter((q) => q.is_correct).length;
  const incorrectCount = report.questions.length - correctCount;

  return (
    <PublicShell locale="fa" currentPath="/ielts">
      <div className={styles.container}>
      {/* Page Header */}
      <header className={styles.header}>
        <span className={styles.kicker}>IELTS Diagnostic Performance Report</span>
        <h1 className={styles.title}>کارنامه تشخیصی و تحلیلی آزمون شبیه‌ساز آیلتس</h1>
        <p className={styles.subtitle}>
          تحلیل علمی عملکرد در آزمون {report.test_title_fa}، نمره باند محاسبه‌شده بر اساس معیارهای استاندارد و نقاط نیازمند تقویت.
        </p>
      </header>

      {/* Hero Score Card */}
      <section className={styles.heroCard} aria-label="Overall Score Summary">
        <div className={styles.heroRow}>
          <div className={styles.bandScoreBox}>
            <div className={styles.bandNumber}>Band {report.scaled_band_score}</div>
            <div className={styles.bandMeta}>
              <h2 className={styles.bandTitle}>
                {report.scaled_band_score >= 7.5
                  ? "سطح تسلط بسیار خوب (Good User)"
                  : report.scaled_band_score >= 6.0
                  ? "سطح کاربری مستقل و موثر (Competent User)"
                  : "سطح نیازمند تمرین بیشتر (Modest User)"}
              </h2>
              <span className={styles.cefrBadge}>
                سطح معادل CEFR: {report.diagnostics?.cefr?.level || "B2"} ({report.diagnostics?.cefr?.descriptor_fa || "متوسط رو به بالا"})
              </span>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                مجموع امتیازات خام: {report.raw_score} نمره
              </span>
            </div>
          </div>

          <div className={styles.actionButtonRow}>
            <Link href="/ielts/practice" className={styles.actionBtnPrimary}>
              شرکت در آزمون جدید ➔
            </Link>
            <Link href="/teachers" className={styles.actionBtnSecondary}>
              رزرو جلسه تحلیل با مدرس آیلتس
            </Link>
          </div>
        </div>

        {/* Section Scores Grid */}
        <div className={styles.sectionGrid}>
          {Object.entries(report.section_scores || {}).map(([secKey, secData]) => (
            <div key={secKey} className={styles.sectionCard}>
              <div>
                <h3 className={styles.sectionCardTitle}>
                  مهارت {secKey === "listening" ? "شنیداری (Listening)" : secKey === "reading" ? "درک مطلب (Reading)" : secKey}
                </h3>
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  {secData.correct_count} پاسخ صحیح از {secData.question_count} سوال
                </span>
              </div>
              <div className={styles.sectionBandBadge}>Band {secData.band_score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostics by Question Type & Actionable Advice */}
      <section className={styles.card} aria-label="Question Type Analysis">
        <h2 className={styles.cardTitle}>تحلیل تشخیصی عملکرد به تفکیک فرمت سوالات</h2>
        <div className={styles.diagnosticGrid}>
          {Object.entries(report.diagnostics?.question_type_stats || {}).map(([qType, stats]) => (
            <div key={qType} className={styles.diagnosticItem}>
              <div className={styles.diagHeader}>
                <span>{qType.replace(/_/g, " ").toUpperCase()}</span>
                <span>
                  {stats.correct} / {stats.total} ({stats.accuracy_pct}%)
                </span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ inlineSize: `${Math.min(100, Math.max(0, stats.accuracy_pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pedagogical Guidance */}
        {Array.isArray(report.diagnostics?.advice) && report.diagnostics.advice.length > 0 && (
          <div style={{ marginBlockStart: "var(--space-3)" }}>
            <h3 style={{ fontSize: "var(--font-size-sm)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
              توصیه‌های آموزشی برای ارتقای نمره باند:
            </h3>
            <ul className={styles.adviceList}>
              {report.diagnostics.advice.map((adv, idx) => (
                <li key={idx}>{adv}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Question-by-Question Review */}
      <section className={styles.card} aria-label="Question by Question Review">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
          <h2 className={styles.cardTitle}>
            بازبینی سوال به سوال ({correctCount} صحیح / {incorrectCount} غلط)
          </h2>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Button
              type="button"
              variant={reviewFilter === "all" ? "primary" : "secondary"}
              size="sm"
              className={styles.actionBtnSecondary}
              style={reviewFilter === "all" ? { background: "var(--color-surface-hover)", borderColor: "var(--color-primary)" } : {}}
              onClick={() => setReviewFilter("all")}
            >
              همه سوالات ({report.questions.length})
            </Button>
            <Button
              type="button"
              variant={reviewFilter === "incorrect" ? "primary" : "secondary"}
              size="sm"
              className={styles.actionBtnSecondary}
              style={reviewFilter === "incorrect" ? { background: "var(--color-surface-hover)", borderColor: "var(--color-danger-border)" } : {}}
              onClick={() => setReviewFilter("incorrect")}
            >
              اشتباهات ({incorrectCount})
            </Button>
            <Button
              type="button"
              variant={reviewFilter === "correct" ? "primary" : "secondary"}
              size="sm"
              className={styles.actionBtnSecondary}
              style={reviewFilter === "correct" ? { background: "var(--color-surface-hover)", borderColor: "var(--color-success-border)" } : {}}
              onClick={() => setReviewFilter("correct")}
            >
              صحیح‌ها ({correctCount})
            </Button>
          </div>
        </div>

        <div className={styles.reviewTableWrapper}>
          <Table className={styles.table}>
            <thead>
              <tr>
                <th>شماره</th>
                <th>بخش و فرمت سوال</th>
                <th>صورت سوال</th>
                <th>پاسخ شما</th>
                <th>پاسخ صحیح</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => (
                <tr key={q.question_id}>
                  <td><strong>Q{q.question_number}</strong></td>
                  <td>
                    <div style={{ fontSize: "var(--font-size-xs)" }}>
                      <div>{q.section_type_display}</div>
                      <span style={{ opacity: 0.8 }}>{q.question_type_display}</span>
                    </div>
                  </td>
                  <td style={{ direction: "ltr", textAlign: "start", maxInlineSize: "350px" }}>
                    <div style={{ fontWeight: 600 }}>{q.prompt_text}</div>
                    {q.explanation && (
                      <div className={styles.explanationText}>
                        <strong>تحلیل و استناد:</strong> {q.explanation}
                      </div>
                    )}
                  </td>
                  <td style={{ direction: "ltr", textAlign: "left" }}>
                    {q.candidate_answer ? (
                      <code>{String(q.candidate_answer)}</code>
                    ) : (
                      <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>بی‌پاسخ</span>
                    )}
                  </td>
                  <td style={{ direction: "ltr", textAlign: "left" }}>
                    <code>{q.correct_answers.join(" | ")}</code>
                  </td>
                  <td>
                    {q.is_correct ? (
                      <span className={styles.badgeCorrect}>✓ صحیح (+{q.score_earned})</span>
                    ) : (
                      <span className={styles.badgeIncorrect}>✗ نادرست (0)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
    </PublicShell>
  );
}
