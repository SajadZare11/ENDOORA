"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../placement.module.css";

type Locale = "fa" | "en";

interface SectionSummary {
  section: string;
  total: number;
  answered: number;
  correct?: number;
  score_percentage?: number;
  objectives_covered?: string[];
}

interface SessionSummaryData {
  session_id: string;
  status: string;
  is_submitted: boolean;
  current_section: string;
  started_at: string;
  expires_at: string;
  total_questions: number;
  total_answered: number;
  overall_percentage: number | null;
  estimated_cefr_level?: string | null;
  sections: Record<string, SectionSummary>;
  evidence: Array<{
    item_id: string;
    section: string;
    difficulty: string;
    cefr_level: string;
    objective: string;
    has_answered: boolean;
    is_correct: boolean;
  }>;
  notice: string;
}

const copy = {
  fa: {
    kicker: "گزارش شفاف یادگیری Endoora",
    title: "کارنامه تحلیلی ارزیابی اولیه",
    desc: "این کارنامه بر اساس شواهد واقعی شما در شش بخش دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری و نگارش محاسبه شده است.",
    grammar: "دستور زبان (Grammar)",
    vocabulary: "واژگان (Vocabulary)",
    reading: "درک مطلب (Reading)",
    listening: "شنیداری (Listening)",
    speaking: "گفتاری (Speaking)",
    writing: "نگارش (Writing)",
    overallEstimateLabel: "سطح یادگیری تخمینی شما",
    overallScoreLabel: "میانگین کل ۶ مهارت",
    totalItems: "تعداد کل سوالات",
    answered: "پاسخ‌داده‌شده",
    accuracy: "دقت پاسخ‌ها",
    pending: "در انتظار تکمیل آزمون",
    evaluated: "ارزیابی‌شده",
    objectives: "اهداف مهارتی بررسی‌شده",
    nextStepTitle: "گام‌های بعدی یادگیری",
    nextStepDesc: "بر اساس عملکرد شما، تمرین‌های روزانه، مرور اشتباهات و مسیرهای آموزشی هدفمند در داشبورد پیشنهاد شده‌اند.",
    goToDashboard: "ورود به داشبورد و شروع تمرین",
    retakePlacement: "مرور یا شرکت مجدد در آزمون",
    viewTwin: "مشاهده دوقلوی یادگیری",
    noticeHeader: "اصل شفافیت آموزشی Endoora (Honest Assessment)",
    honestDisclaimer: "این کارنامه یک برآورد آموزشی اولیه بر اساس شواهد ثبت‌شده در این آزمون است و ادعای مدرک رسمی یا تضمین سطح CEFR را ندارد.",
    loading: "در حال دریافت و ارزیابی شواهد آزمون...",
  },
  en: {
    kicker: "Endoora Transparent Learning Report",
    title: "Initial Diagnostic Skill Report",
    desc: "This diagnostic report is computed from your verified answers across Grammar, Vocabulary, Reading, Listening, Speaking, and Writing.",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    listening: "Listening Comprehension",
    speaking: "Speaking",
    writing: "Writing",
    overallEstimateLabel: "Your estimated learning level is",
    overallScoreLabel: "Overall 6-Skill Score",
    totalItems: "Total items",
    answered: "Answered",
    accuracy: "Accuracy",
    pending: "Pending test completion",
    evaluated: "Evaluated",
    objectives: "Target objectives evaluated",
    nextStepTitle: "Next Learning Steps",
    nextStepDesc: "Based on your verified evidence, tailored daily missions, error genome review, and adaptive practice are ready in your dashboard.",
    goToDashboard: "Go to learning dashboard",
    retakePlacement: "Retake or review test",
    viewTwin: "View learner twin",
    noticeHeader: "Endoora Educational Transparency (Honest Assessment)",
    honestDisclaimer: "This report is an educational estimate grounded in verified assessment evidence and does not claim official CEFR certification.",
    loading: "Loading verified test evidence...",
  },
};

export default function PlacementReportPage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [summary, setSummary] = useState<SessionSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const t = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const resCurr = await fetch("/api/placement/sessions/current/");
        if (resCurr.ok) {
          const sessData = await resCurr.json();
          if (sessData && sessData.id) {
            const sumRes = await fetch(`/api/placement/sessions/${sessData.id}/summary/`);
            if (sumRes.ok) {
              const sumData: SessionSummaryData = await sumRes.json();
              if (isMounted) setSummary(sumData);
            }
          }
        }
      } catch {
        // Handled
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  const grammar = summary?.sections?.grammar;
  const vocabulary = summary?.sections?.vocabulary;
  const reading = summary?.sections?.reading;
  const listening = summary?.sections?.listening;
  const speaking = summary?.sections?.speaking;
  const writing = summary?.sections?.writing;

  return (
    <main className={styles.page} dir={locale === "fa" ? "rtl" : "ltr"}>
      <div className={styles.container}>
        {/* Language switch */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--space-4)" }}>
          <div style={{ display: "inline-flex", gap: "var(--space-1)", background: "var(--color-surface)", padding: "var(--space-1)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
            <button
              type="button"
              style={{ padding: "var(--space-2) var(--space-3)", border: "none", background: locale === "fa" ? "var(--color-surface-hover)" : "transparent", fontWeight: locale === "fa" ? 700 : 400, cursor: "pointer", borderRadius: "var(--radius-control)" }}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              style={{ padding: "var(--space-2) var(--space-3)", border: "none", background: locale === "en" ? "var(--color-surface-hover)" : "transparent", fontWeight: locale === "en" ? 700 : 400, cursor: "pointer", borderRadius: "var(--radius-control)" }}
              onClick={() => setLocale("en")}
            >
              English
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <p style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "var(--font-size-meta)" }}>{t.kicker}</p>
          <h1>{t.title}</h1>
          <p>{t.desc}</p>
        </section>

        {loading && (
          <div className={styles.card} style={{ textAlign: "center", marginBlock: "var(--space-6)" }}>
            <p>{t.loading}</p>
          </div>
        )}

        {/* Overall Provisional CEFR Estimate Card */}
        {summary?.is_submitted && summary?.overall_percentage !== null && summary?.overall_percentage !== undefined && (
          <div
            className={styles.card}
            style={{
              marginBlock: "var(--space-4)",
              background: "var(--color-surface)",
              border: "2px solid var(--color-primary)",
              textAlign: "center",
              padding: "var(--space-4)",
            }}
          >
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBottom: "var(--space-1)" }}>
              {t.overallEstimateLabel}
            </p>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--color-primary)" }}>
                {summary.estimated_cefr_level || "A1"}
              </span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-body)" }}>
                ({t.overallScoreLabel}: {summary.overall_percentage}%)
              </span>
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
              {t.honestDisclaimer}
            </p>
          </div>
        )}

        {/* 5 Section Cards Grid */}
        <div className={styles.reportGrid}>
          {/* Grammar */}
          <div className={styles.sectionCard}>
            <h3>{t.grammar}</h3>
            {summary?.is_submitted && grammar?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{grammar.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {grammar.answered} / {grammar.total}
                </p>
                {grammar.objectives_covered && grammar.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{grammar.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${grammar?.answered || 0} / ${grammar?.total || 4} ${t.answered}` : t.pending}
              </p>
            )}
          </div>

          {/* Vocabulary */}
          <div className={styles.sectionCard}>
            <h3>{t.vocabulary}</h3>
            {summary?.is_submitted && vocabulary?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{vocabulary.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {vocabulary.answered} / {vocabulary.total}
                </p>
                {vocabulary.objectives_covered && vocabulary.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{vocabulary.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${vocabulary?.answered || 0} / ${vocabulary?.total || 4} ${t.answered}` : t.pending}
              </p>
            )}
          </div>

          {/* Reading */}
          <div className={styles.sectionCard}>
            <h3>{t.reading}</h3>
            {summary?.is_submitted && reading?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{reading.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {reading.answered} / {reading.total}
                </p>
                {reading.objectives_covered && reading.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{reading.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${reading?.answered || 0} / ${reading?.total || 3} ${t.answered}` : t.pending}
              </p>
            )}
          </div>

          {/* Listening */}
          <div className={styles.sectionCard}>
            <h3>{t.listening}</h3>
            {summary?.is_submitted && listening?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{listening.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {listening.answered} / {listening.total}
                </p>
                {listening.objectives_covered && listening.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{listening.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${listening?.answered || 0} / ${listening?.total || 4} ${t.answered}` : t.pending}
              </p>
            )}
          </div>

          {/* Speaking */}
          <div className={styles.sectionCard}>
            <h3>{t.speaking}</h3>
            {summary?.is_submitted && speaking?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{speaking.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {speaking.answered} / {speaking.total}
                </p>
                {speaking.objectives_covered && speaking.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{speaking.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${speaking?.answered || 0} / ${speaking?.total || 4} ${t.answered}` : t.pending}
              </p>
            )}
          </div>

          {/* Writing */}
          <div className={styles.sectionCard}>
            <h3>{t.writing}</h3>
            {summary?.is_submitted && writing?.score_percentage !== undefined ? (
              <div>
                <span className={styles.sectionScore}>{writing.score_percentage}%</span>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                  {t.answered}: {writing.answered} / {writing.total}
                </p>
                {writing.objectives_covered && writing.objectives_covered.length > 0 && (
                  <div style={{ marginTop: "var(--space-3)", fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    <small dir="ltr" style={{ display: "block" }}>{writing.objectives_covered.join(", ")}</small>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
                {summary ? `${writing?.answered || 0} / ${writing?.total || 4} ${t.answered}` : t.pending}
              </p>
            )}
          </div>
        </div>

        {/* Honest Assessment Notice */}
        <div className={styles.noticeBox}>
          <h4 style={{ color: "var(--color-text)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
            {t.noticeHeader}
          </h4>
          <p>{summary?.notice || t.honestDisclaimer}</p>
        </div>

        {/* Next Steps Section */}
        <div className={styles.card}>
          <h2>{t.nextStepTitle}</h2>
          <p style={{ marginBlock: "var(--space-3)", color: "var(--color-text-muted)" }}>{t.nextStepDesc}</p>
          <div className={styles.actionsRow}>
            <Link href="/dashboard" className={styles.button}>
              {t.goToDashboard}
            </Link>
            <Link href="/placement/demo" className={styles.button} style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
              {t.retakePlacement}
            </Link>
            <Link href="/twin" className={styles.button} style={{ background: "var(--color-surface-hover)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}>
              {t.viewTwin}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
