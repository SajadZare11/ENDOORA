"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@endoora/ui";
import { PublicShell } from "@/components/marketing/PublicShell";
import { CEFR_DESCRIPTIONS, CefrLevel, endooraIndexToCefr } from "@/lib/adaptive-engine";
import LearnerTwinPreview from "@/components/placement/LearnerTwinPreview";
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
  endoora_index?: number | null;
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
    kicker: "گزارش رسمی سامانه تعیین سطح اختصاصی اندورا",
    title: "کارنامه تحلیلی ارزیابی انطباقی مهارت‌های زبانی",
    desc: "این کارنامه بر اساس پاسخ‌های شما به آزمون انطباقی (CAT) و شاخص اختصاصی سنجش اندورا (Endoora Index) در ۶ مهارت اصلی گرامر، واژگان، درک مطلب، شنیداری، گفتاری و نگارش صادر شده است.",
    grammar: "دستور زبان (Grammar)",
    vocabulary: "واژگان (Vocabulary)",
    reading: "درک مطلب (Reading)",
    listening: "شنیداری (Listening)",
    speaking: "گفتاری (Speaking)",
    writing: "نگارش (Writing)",
    endooraScaleLabel: "شاخص اختصاصی سنجش سطح اندورا (Endoora Index)",
    overallScoreLabel: "شاخص جامع تعیین سطح اندورا (۰ تا ۱۰۰)",
    cefrBadgeLabel: "سطح تسلط در چارچوب اروپایی CEFR",
    totalItems: "تعداد کل سوالات",
    answered: "پاسخ‌داده‌شده",
    accuracy: "دقت پاسخ‌ها",
    pending: "در انتظار تکمیل آزمون",
    evaluated: "ارزیابی‌شده",
    objectives: "اهداف مهارتی بررسی‌شده",
    canDoTitle: "توانمندی‌های زبانی شما در این سطح (CEFR Can-Do Statements)",
    recommendedBooksTitle: "منابع آموزشی و کتاب‌های پیشنهادی متناسب با سطح شما",
    cefrLadderTitle: "نردبان پیشرفت مهارتی سطوح CEFR",
    nextStepTitle: "گام‌های بعدی یادگیری در ایندورا",
    nextStepDesc: "بر اساس عملکرد شما، تمرین‌های روزانه، مرور نقشه راه و مسیرهای آموزشی هدفمند در داشبورد پیشنهاد شده‌اند.",
    goToDashboard: "ورود به داشبورد و شروع تمرین",
    buildPersonalPath: "مشاهده و ساخت مسیر یادگیری شخصی",
    retakePlacement: "شرکت مجدد در آزمون انطباقی",
    viewTwin: "مشاهده دوقلوی یادگیری",
    noticeHeader: "اصل شفافیت آموزشی ایندورا (Honest Assessment)",
    honestDisclaimer: "این کارنامه یک برآورد علمی روان‌سنجی بر اساس چارچوب بین‌المللی CEFR در سامانه سنجش اختصاصی اندورا است و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود.",
    loading: "در حال دریافت و ارزیابی شواهد آزمون...",
    noDataNotice: "اطلاعات آزمونی یافت نشد. برای سنجش سطح خود، لطفاً در آزمون تعیین سطح شرکت کنید.",
    startPlacementBtn: "شروع آزمون تعیین سطح",
  },
  en: {
    kicker: "Official Endoora Adaptive Placement Report",
    title: "Computer-Adaptive Diagnostic Skill Report",
    desc: "This diagnostic report is calibrated against the proprietary 0-100 Endoora Placement Index and CEFR framework across Grammar, Vocabulary, Reading, Listening, Speaking, and Writing.",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    listening: "Listening Comprehension",
    speaking: "Speaking",
    writing: "Writing",
    endooraScaleLabel: "Official Endoora Placement Index Scale",
    overallScoreLabel: "Endoora Placement Index (0–100 Scale)",
    cefrBadgeLabel: "CEFR Mastery Level",
    totalItems: "Total items",
    answered: "Answered",
    accuracy: "Accuracy",
    pending: "Pending test completion",
    evaluated: "Evaluated",
    objectives: "Target objectives evaluated",
    canDoTitle: "CEFR Competency Statements (Can-Do Descriptors)",
    recommendedBooksTitle: "Recommended Textbooks and Curriculum for Your Level",
    cefrLadderTitle: "CEFR Proficiency Progression Ladder",
    nextStepTitle: "Next Learning Steps in Endoora",
    nextStepDesc: "Based on your verified evidence, tailored daily missions, error genome review, and adaptive practice are ready in your dashboard.",
    goToDashboard: "Go to learning dashboard",
    buildPersonalPath: "Build My Personal Learning Path",
    retakePlacement: "Retake Adaptive Placement Test",
    viewTwin: "View learner twin",
    noticeHeader: "Endoora Educational Transparency (Honest Assessment)",
    honestDisclaimer: "This report is an educational estimate calibrated against CEFR standards and the proprietary Endoora testing engine reflecting your demonstrated performance.",
    loading: "Loading verified test evidence...",
    noDataNotice: "No placement session found. Take the placement test to discover your CEFR level.",
    startPlacementBtn: "Start Placement Test",
  },
};

const ALL_CEFR_TIERS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function PlacementReportPage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [summary, setSummary] = useState<SessionSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const t = copy[locale];

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        // 1. Try to fetch from server for authenticated user
        const resCurr = await fetch("/api/placement/sessions/current/");
        if (resCurr.ok) {
          const sessData = await resCurr.json();
          if (sessData && sessData.id) {
            const sumRes = await fetch(`/api/placement/sessions/${sessData.id}/summary/`);
            if (sumRes.ok) {
              const sumData: SessionSummaryData = await sumRes.json();
              if (isMounted) {
                setSummary(sumData);
                setLoading(false);
                return;
              }
            }
          }
        }
      } catch {
        // Fallback to local guest storage
      }

      // 2. Fallback to localStorage guest report if user completed as guest
      if (typeof window !== "undefined") {
        const guestReportRaw = localStorage.getItem("endoora_placement_guest_summary");
        if (guestReportRaw) {
          try {
            const parsed: SessionSummaryData = JSON.parse(guestReportRaw);
            if (isMounted && parsed && parsed.is_submitted) {
              setSummary(parsed);
              setLoading(false);
              return;
            }
          } catch {
            // Handled
          }
        }
      }

      if (isMounted) setLoading(false);
    }

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute authentic average across all 6 skills as the ultimate source of truth
  const ALL_SECTIONS = ["grammar", "vocabulary", "reading", "listening", "speaking", "writing"];
  let computedAverage: number | null = null;
  if (summary?.sections) {
    const scores = ALL_SECTIONS.map((s) => {
      const secData = summary.sections[s];
      return typeof secData?.score_percentage === "number" ? secData.score_percentage : 0;
    });
    computedAverage = Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length);
  }

  const endooraIndex =
    computedAverage !== null
      ? computedAverage
      : (summary?.endoora_index ?? summary?.overall_percentage ?? 50);

  const currentCefr: CefrLevel = summary
    ? endooraIndexToCefr(endooraIndex)
    : "B1";
  const cefrInfo = CEFR_DESCRIPTIONS[currentCefr];

  // Synthesize answers map for LearnerTwinPreview
  const twinAnswers: Record<string, string> = {};
  if (summary?.evidence && Array.isArray(summary.evidence)) {
    summary.evidence.forEach((ev) => {
      if (ev.has_answered) {
        twinAnswers[ev.item_id] = ev.is_correct ? "correct" : "answered";
      }
    });
  } else if (summary?.sections) {
    Object.entries(summary.sections).forEach(([secKey, secVal]) => {
      for (let i = 0; i < (secVal.answered || 0); i++) {
        twinAnswers[`${secKey}-q-${i}`] = "answered";
      }
    });
  }

  const grammar = summary?.sections?.grammar;
  const vocabulary = summary?.sections?.vocabulary;
  const reading = summary?.sections?.reading;
  const listening = summary?.sections?.listening;
  const speaking = summary?.sections?.speaking;
  const writing = summary?.sections?.writing;

  return (
    <PublicShell locale={locale} currentPath="/placement/report">
      <main className={styles.page} dir={locale === "fa" ? "rtl" : "ltr"}>
        <div className={styles.container}>
          {/* Language switch */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBlockEnd: "var(--space-4)" }}>
            <div
              style={{
                display: "inline-flex",
                gap: "var(--space-1)",
                background: "var(--color-surface)",
                padding: "var(--space-1)",
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Button
                type="button"
                size="sm"
                variant={locale === "fa" ? "primary" : "tertiary"}
                onClick={() => setLocale("fa")}
              >
                فارسی
              </Button>
              <Button
                type="button"
                size="sm"
                variant={locale === "en" ? "primary" : "tertiary"}
                onClick={() => setLocale("en")}
              >
                English
              </Button>
            </div>
          </div>

          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroTag}>
              📊 {t.kicker}
            </div>
            <h1>
              {locale === "fa" ? (
                <>
                  <span className={styles.heroBrandWrap}>
                    <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                        fill="url(#sparkGradReport)"
                      />
                      <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                      <defs>
                        <linearGradient id="sparkGradReport" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#06b6d4" />
                          <stop offset="1" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className={styles.heroBrandText}>کارنامه،</span>
                  </span>{" "}
                  <span className={styles.heroSubText}>تحلیل رسمی</span>{" "}
                  <span className={styles.heroAccent}>استاندارد CEFR و شاخص اندورا</span>
                </>
              ) : (
                t.title
              )}
            </h1>
            <p>{t.desc}</p>
          </section>

          {loading && (
            <div className={styles.card} style={{ textAlign: "center", marginBlock: "var(--space-6)" }}>
              <p>{t.loading}</p>
            </div>
          )}

          {!loading && !summary && (
            <div className={styles.emptyState}>
              <div style={{ fontSize: "3rem", marginBlockEnd: "var(--space-3)" }}>📝</div>
              <h2>{t.noDataNotice}</h2>
              <p style={{ marginBlock: "1rem" }}>{t.desc}</p>
              <Link href="/placement/demo" className={styles.button} style={{ marginTop: "1rem" }}>
                {t.startPlacementBtn} <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
              </Link>
            </div>
          )}

          {/* Standardized Endoora & CEFR Score Banner */}
          {summary && (
            <>
              <div
                className={styles.card}
                style={{
                  marginBlock: "var(--space-6)",
                  background: "linear-gradient(180deg, color-mix(in srgb, var(--color-action) 12%, var(--color-surface)), var(--color-surface))",
                  border: "1.5px solid color-mix(in srgb, var(--color-action) 45%, var(--color-border))",
                  textAlign: "center",
                  padding: "clamp(var(--space-6), 4vw, var(--space-8))",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.25rem 0.85rem",
                    borderRadius: "var(--radius-pill)",
                    background: "color-mix(in srgb, var(--color-action) 18%, var(--color-surface))",
                    border: "1px solid var(--color-action)",
                    color: "var(--color-action)",
                    fontSize: "0.85rem",
                    fontWeight: 750,
                    marginBottom: "var(--space-3)",
                  }}
                >
                  ⚡ {t.endooraScaleLabel}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(1rem, 3vw, 2.5rem)",
                    flexWrap: "wrap",
                    marginBlock: "var(--space-4)",
                  }}
                >
                  {/* Endoora Index 0-100 Gauge */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      inlineSize: "9rem",
                      blockSize: "9rem",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, color-mix(in srgb, var(--color-action) 16%, var(--color-surface)) 0%, var(--color-surface) 75%)",
                      border: "4px solid var(--color-action)",
                      boxShadow: "0 0 24px -4px color-mix(in srgb, var(--color-action) 40%, transparent)",
                    }}
                  >
                    <span style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--color-text)", lineHeight: 1 }}>
                      {endooraIndex}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontWeight: 700, marginTop: "0.25rem" }}>
                      / 100
                    </span>
                  </div>

                  {/* Primary CEFR Badge & Title */}
                  <div style={{ textAlign: locale === "fa" ? "right" : "left", maxWidth: "26rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBlockEnd: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "2.2rem",
                          fontWeight: 900,
                          color: cefrInfo.badgeColor,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {currentCefr}
                      </span>
                      <span
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--color-surface-hover)",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.95rem",
                          fontWeight: 750,
                        }}
                      >
                        {locale === "fa" ? cefrInfo.nameFa : cefrInfo.nameEn}
                      </span>
                    </div>
                    <p style={{ color: "var(--color-muted)", fontSize: "0.92rem", lineHeight: 1.75, margin: 0 }}>
                      {locale === "fa" ? cefrInfo.summaryFa : cefrInfo.summaryEn}
                    </p>
                  </div>
                </div>

                {/* CEFR Progression Ladder */}
                <div style={{ marginBlockStart: "var(--space-6)", paddingBlockStart: "var(--space-4)", borderBlockStart: "1px solid var(--color-border)" }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
                    {t.cefrLadderTitle}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "0.5rem",
                      maxWidth: "42rem",
                      marginInline: "auto",
                    }}
                  >
                    {ALL_CEFR_TIERS.map((tier) => {
                      const isCurrent = tier === currentCefr;
                      const tierData = CEFR_DESCRIPTIONS[tier];
                      return (
                        <div
                          key={tier}
                          style={{
                            padding: "0.5rem 0.25rem",
                            borderRadius: "var(--radius-control)",
                            background: isCurrent
                              ? "color-mix(in srgb, var(--color-action) 22%, var(--color-surface))"
                              : "var(--color-surface-hover)",
                            border: isCurrent
                              ? "2px solid var(--color-action)"
                              : "1px solid var(--color-border)",
                            boxShadow: isCurrent
                              ? "0 2px 10px -2px color-mix(in srgb, var(--color-action) 35%, transparent)"
                              : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              fontSize: "1rem",
                              fontWeight: 800,
                              color: isCurrent ? "var(--color-action)" : "var(--color-text)",
                            }}
                          >
                            {tier}
                          </strong>
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.72rem",
                              color: isCurrent ? "var(--color-text)" : "var(--color-muted)",
                              fontWeight: isCurrent ? 700 : 500,
                              marginTop: "0.2rem",
                            }}
                          >
                            {tierData.nameEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 6 Skill Breakdown Cards */}
              <div className={styles.reportGrid}>
                {/* Grammar */}
                <div className={styles.sectionCard}>
                  <h3>{t.grammar}</h3>
                  {grammar?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{grammar.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {grammar.answered} / {grammar.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>

                {/* Vocabulary */}
                <div className={styles.sectionCard}>
                  <h3>{t.vocabulary}</h3>
                  {vocabulary?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{vocabulary.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {vocabulary.answered} / {vocabulary.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>

                {/* Reading */}
                <div className={styles.sectionCard}>
                  <h3>{t.reading}</h3>
                  {reading?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{reading.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {reading.answered} / {reading.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>

                {/* Listening */}
                <div className={styles.sectionCard}>
                  <h3>{t.listening}</h3>
                  {listening?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{listening.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {listening.answered} / {listening.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>

                {/* Speaking */}
                <div className={styles.sectionCard}>
                  <h3>{t.speaking}</h3>
                  {speaking?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{speaking.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {speaking.answered} / {speaking.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>

                {/* Writing */}
                <div className={styles.sectionCard}>
                  <h3>{t.writing}</h3>
                  {writing?.score_percentage !== undefined ? (
                    <div>
                      <span className={styles.sectionScore}>{writing.score_percentage}%</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                        {t.answered}: {writing.answered} / {writing.total}
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>{t.pending}</p>
                  )}
                </div>
              </div>

              {/* Verified Learner Twin Diagnostic Profile */}
              <div style={{ marginBlock: "var(--space-6)" }}>
                <LearnerTwinPreview
                  currentSection="writing"
                  currentIndex={summary.total_questions || 50}
                  totalQuestions={summary.total_questions || 50}
                  answeredCount={summary.total_answered || 50}
                  answers={twinAnswers}
                  locale={locale}
                />
              </div>

              {/* Recommended Course Books & Curriculum */}
              <div className={styles.card} style={{ marginBlock: "var(--space-6)" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBlockEnd: "var(--space-3)" }}>
                  📚 {t.recommendedBooksTitle} ({currentCefr} · {cefrInfo.nameEn})
                </h3>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  {cefrInfo.recommendedBooks.map((book) => (
                    <div
                      key={book}
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "var(--radius-control)",
                        background: "var(--color-surface-hover)",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.9rem",
                        fontWeight: 650,
                        color: "var(--color-text)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>📖</span>
                      <span>{book}</span>
                    </div>
                  ))}
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
                  <Link href="/path" className={styles.button}>
                    {t.buildPersonalPath}
                  </Link>
                  <Link
                    href="/dashboard"
                    className={styles.button}
                    style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                  >
                    {t.goToDashboard}
                  </Link>
                  <Link
                    href="/placement/demo"
                    className={styles.button}
                    style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                  >
                    {t.retakePlacement}
                  </Link>
                  <Link
                    href="/twin"
                    className={styles.button}
                    style={{ background: "var(--color-surface-hover)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                  >
                    {t.viewTwin}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </PublicShell>
  );
}
