'use client';

import { Button } from "@endoora/ui";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./ielts-speaking-report.module.css";
import {
  fetchSpeakingReport,
  fetchSpeakingHistory,
  requestTeacherSpeakingReview,
  IELTSSpeakingReport,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "../../../../../lib/ielts-speaking";
import { PublicShell } from "../../../../../components/marketing/PublicShell";

function IELTSSpeakingReportContent() {
  const searchParams = useSearchParams();
  const submissionIdParam = searchParams.get("id");

  const [report, setReport] = useState<IELTSSpeakingReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTranscriptTab, setActiveTranscriptTab] = useState<1 | 2 | 3>(2);
  const [teacherReviewRequested, setTeacherReviewRequested] = useState(false);
  const [requestingTeacher, setRequestingTeacher] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        let idToLoad = submissionIdParam;
        if (!idToLoad) {
          const history = await fetchSpeakingHistory();
          if (history && history.length > 0) {
            idToLoad = history[0].id;
          }
        }

        if (!idToLoad) {
          idToLoad = "default-demo-report";
        }

        const data = await fetchSpeakingReport(idToLoad);
        setReport(data);
        setTeacherReviewRequested(data.teacher_review_requested);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت کارنامه تشخیصی اسپیکینگ.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [submissionIdParam]);

  const handleTeacherReviewRequest = async () => {
    if (!report) return;
    setRequestingTeacher(true);
    try {
      await requestTeacherSpeakingReview(report.id);
      setTeacherReviewRequested(true);
    } catch {
      // handled
    } finally {
      setRequestingTeacher(false);
    }
  };

  if (loading) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minBlockSize: "60vh" }}>
          در حال تحلیل و استخراج نمرات معیارهای گفتاری آیلتس...
        </div>
      </PublicShell>
    );
  }

  if (error || !report) {
    return (
      <PublicShell locale="fa" currentPath="/ielts">
        <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
          <h2>خطا در نمایش کارنامه</h2>
          <p>{error || "گزارش ارزیابی یافت نشد."}</p>
          <Link href="/ielts/speaking" className={styles.actionBtnPrimary}>
            ورود به اتاق تمرین اسپیکینگ
          </Link>
        </div>
      </PublicShell>
    );
  }

  const confidencePct = Math.round((report.confidence_score || 0.85) * 100);

  return (
    <PublicShell locale="fa" currentPath="/ielts">
      <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.kicker}>IELTS Speaking AI Diagnostic Evaluation (IELTS-005)</span>
        <h1 className={styles.title}>کارنامه تشخیصی و تحلیلی مهارت گفتاری آیلتس</h1>
        <p className={styles.subtitle}>
          ارزیابی جامع هوش مصنوعی بر پایه ۴ معیار رسمی آیلتس، سنجش آکوستیک روانی کلام و تشخیص چالش‌های آوایی زبان فارسی.
        </p>
      </header>

      {/* Mandatory IELTS Disclaimer Banner */}
      <aside
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          paddingInline: "var(--space-3)",
          paddingBlock: "var(--space-2)",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-secondary)",
        }}
        role="note"
      >
        <span
          style={{
            backgroundColor: "var(--color-neutral-200)",
            color: "var(--color-neutral-800)",
            paddingInline: "var(--space-2)",
            paddingBlock: "var(--space-0-5)",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
          }}
        >
          سلب مسئولیت قانونی
        </span>
        <span>{MANDATORY_IELTS_DISCLAIMER_TEXT} — ارزیابی تشخیصی آزمایشی با دامنه عدم قطعیت.</span>
      </aside>

      {/* Hero Score Card */}
      <section className={styles.heroCard} aria-label="Estimated Overall Band Score">
        <div className={styles.heroRow}>
          <div className={styles.bandScoreBox}>
            <div className={styles.bandNumber}>{Number(report.overall_band).toFixed(1)}</div>
            <div className={styles.bandMeta}>
              <h2 className={styles.bandTitle}>نمره تخمینی باند کل (Overall Estimated Band)</h2>
              <span className={styles.rangeBadge}>
                دامنه بازه تخمین: [{Number(report.overall_band_min).toFixed(1)} – {Number(report.overall_band_max).toFixed(1)}] | میزان اطمینان مدل: {confidencePct}٪
              </span>
              <div>
                <span className={styles.cefrBadge}>سطح استاندارد اروپایی: CEFR {report.cefr_level}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtonRow}>
            <Link href="/ielts/speaking" className={styles.actionBtnPrimary}>
              تکرار آزمون اسپیکینگ ↻
            </Link>
            <Link href="/ielts/practice" className={styles.actionBtnSecondary}>
              بازگشت به مرکز ماک‌های آیلتس ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Official Criteria Cards */}
      <section aria-label="Official Criteria Breakdown">
        <h2 className={styles.sectionTitle} style={{ marginBlockEnd: "var(--space-3)" }}>
          📊 تفکیک نمرات بر پایه ۴ معیار رسمی اگزمینر آیلتس
        </h2>
        <div className={styles.criteriaGrid}>
          {/* FC */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <h3 className={styles.criteriaTitle}>Fluency & Coherence (FC)</h3>
              <span className={styles.criteriaScore}>
                {Number(report.fc_score || report.criteria_breakdown.fluency_and_coherence?.score || 0).toFixed(1)}
              </span>
            </div>
            <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)" }}>
              {report.criteria_breakdown.fluency_and_coherence?.title_fa || "روانی و انسجام کلامی"}
            </strong>
            <p className={styles.criteriaDesc}>
              {report.criteria_breakdown.fluency_and_coherence?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown.fluency_and_coherence?.guidance_fa}
            </div>
          </div>

          {/* LR */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <h3 className={styles.criteriaTitle}>Lexical Resource (LR)</h3>
              <span className={styles.criteriaScore}>
                {Number(report.lr_score || report.criteria_breakdown.lexical_resource?.score || 0).toFixed(1)}
              </span>
            </div>
            <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)" }}>
              {report.criteria_breakdown.lexical_resource?.title_fa || "دامنه واژگان و اصطلاحات"}
            </strong>
            <p className={styles.criteriaDesc}>
              {report.criteria_breakdown.lexical_resource?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown.lexical_resource?.guidance_fa}
            </div>
          </div>

          {/* GRA */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <h3 className={styles.criteriaTitle}>Grammatical Range (GRA)</h3>
              <span className={styles.criteriaScore}>
                {Number(report.gra_score || report.criteria_breakdown.grammatical_range_and_accuracy?.score || 0).toFixed(1)}
              </span>
            </div>
            <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)" }}>
              {report.criteria_breakdown.grammatical_range_and_accuracy?.title_fa || "تنوع و صحت ساختارهای دستوری"}
            </strong>
            <p className={styles.criteriaDesc}>
              {report.criteria_breakdown.grammatical_range_and_accuracy?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown.grammatical_range_and_accuracy?.guidance_fa}
            </div>
          </div>

          {/* PR */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <h3 className={styles.criteriaTitle}>Pronunciation (PR)</h3>
              <span className={styles.criteriaScore}>
                {Number(report.pr_score || report.criteria_breakdown.pronunciation?.score || 0).toFixed(1)}
              </span>
            </div>
            <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)" }}>
              {report.criteria_breakdown.pronunciation?.title_fa || "تلفظ، ریتم و وضوح کلامی"}
            </strong>
            <p className={styles.criteriaDesc}>
              {report.criteria_breakdown.pronunciation?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown.pronunciation?.guidance_fa}
            </div>
          </div>
        </div>
      </section>

      {/* Acoustic Telemetry & Pronunciation Diagnostics Grid */}
      <div className={styles.diagnosticsGrid}>
        {/* Fluency & Acoustic Telemetry */}
        <section className={styles.telemetryCard} aria-label="Fluency and Speech Rate Telemetry">
          <h2 className={styles.sectionTitle}>
            <span>🎙️</span>
            <span>شاخص‌های آکوستیک و سرعت کلام (WPM)</span>
          </h2>

          <div className={styles.metricsRow}>
            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.fluency_metrics?.composite_wpm || 0}
              </span>
              <span className={styles.metricLbl}>سرعت کل (WPM)</span>
            </div>

            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.fluency_metrics?.total_words || 0}
              </span>
              <span className={styles.metricLbl}>مجموع کلمات بیان‌شده</span>
            </div>

            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.fluency_metrics?.total_duration_seconds || 0} ثانیه
              </span>
              <span className={styles.metricLbl}>کل مدت صحبت</span>
            </div>

            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.fluency_metrics?.hesitation_count || 0}
              </span>
              <span className={styles.metricLbl}>تعداد پرکننده‌ها (Fillers)</span>
            </div>
          </div>

          <div>
            <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              مارکرهای گفتمانی و کلمات ربط به‌کاررفته:
            </strong>
            <div className={styles.tagsWrap} style={{ marginBlockStart: "var(--space-1)" }}>
              {report.fluency_metrics?.discourse_markers_used && report.fluency_metrics.discourse_markers_used.length > 0 ? (
                report.fluency_metrics.discourse_markers_used.map((m, idx) => (
                  <span key={idx} className={styles.tagPill}>{m}</span>
                ))
              ) : (
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  مارکر گفتمانی خاصی شناسایی نشد. استفاده بیشتر توصیه می‌شود.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pronunciation & Persian L1 Phonological Diagnostics (Rule #8) */}
        <section className={styles.telemetryCard} aria-label="Pronunciation and Phonology Diagnostics">
          <h2 className={styles.sectionTitle}>
            <span>🗣️</span>
            <span>تحلیل وضوح و آواشناسی زبان فارسی (Rule #8)</span>
          </h2>

          <div className={styles.metricsRow}>
            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.pronunciation_diagnostics?.intelligibility_score || 85} / ۱۰۰
              </span>
              <span className={styles.metricLbl}>شاخص وضوح و تفهیم بین‌المللی</span>
            </div>

            <div className={styles.metricStat}>
              <span className={styles.metricVal}>
                {report.pronunciation_diagnostics?.pacing_stability || "Optimal"}
              </span>
              <span className={styles.metricLbl}>پایداری ریتم گفتار</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {report.pronunciation_diagnostics?.persian_phonological_flags &&
            report.pronunciation_diagnostics.persian_phonological_flags.length > 0 ? (
              report.pronunciation_diagnostics.persian_phonological_flags.map((flag, idx) => (
                <div key={idx} className={styles.phonologyItem}>
                  <div className={styles.phonologyHeader}>
                    <span>{flag.title_fa}</span>
                    <span style={{ color: "var(--color-primary)" }}>{flag.sound}</span>
                  </div>
                  <p className={styles.phonologyGuidance}>{flag.guidance_fa}</p>
                  {flag.sample_words && flag.sample_words.length > 0 && (
                    <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                      نمونه کلمات ثبت‌شده در آزمون شما: {flag.sample_words.join("، ")}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
                هیچ خطای فاحش آوایی ناشی از تداخل زبان مادری مشاهده نشد.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Part Transcripts Reviewer */}
      <section className={styles.transcriptsCard} aria-label="Transcripts Review Pane">
        <h2 className={styles.sectionTitle}>
          <span>📝</span>
          <span>متن پیاده‌شده پاسخ‌های داوطلب (Candidate Responses)</span>
        </h2>

        <div className={styles.partTabs}>
          <Button
            type="button"
            variant={activeTranscriptTab === 1 ? "primary" : "secondary"}
            className={`${styles.partTabBtn} ${activeTranscriptTab === 1 ? styles.partTabBtnActive : ""}`}
            onClick={() => setActiveTranscriptTab(1)}
          >
            پارت ۱: مصاحبه و احوال‌پرسی ({report.part1_duration_seconds || 0} ثانیه)
          </Button>
          <Button
            type="button"
            variant={activeTranscriptTab === 2 ? "primary" : "secondary"}
            className={`${styles.partTabBtn} ${activeTranscriptTab === 2 ? styles.partTabBtnActive : ""}`}
            onClick={() => setActiveTranscriptTab(2)}
          >
            پارت ۲: ارائه ۲ دقیقه‌ای Cue Card ({report.part2_duration_seconds || 0} ثانیه)
          </Button>
          <Button
            type="button"
            variant={activeTranscriptTab === 3 ? "primary" : "secondary"}
            className={`${styles.partTabBtn} ${activeTranscriptTab === 3 ? styles.partTabBtnActive : ""}`}
            onClick={() => setActiveTranscriptTab(3)}
          >
            پارت ۳: بحث تحلیلی و انتزاعی ({report.part3_duration_seconds || 0} ثانیه)
          </Button>
        </div>

        <div className={styles.transcriptDisplay}>
          {activeTranscriptTab === 1 && (report.part1_transcript || "متنی برای پارت ۱ ثبت نشده است.")}
          {activeTranscriptTab === 2 && (report.part2_transcript || "متنی برای پارت ۲ ثبت نشده است.")}
          {activeTranscriptTab === 3 && (report.part3_transcript || "متنی برای پارت ۳ ثبت نشده است.")}
        </div>
      </section>

      {/* Pedagogical Advice (Persian) */}
      <section className={styles.adviceCard} aria-label="Pedagogical Recommendations">
        <h2 className={styles.sectionTitle}>
          <span>💡</span>
          <span>توصیه‌های کاربردی اگزمینر برای ارتقای نمره باند</span>
        </h2>
        <ul className={styles.adviceList}>
          {report.pedagogical_advice && report.pedagogical_advice.length > 0 ? (
            report.pedagogical_advice.map((advice, idx) => (
              <li key={idx}>{advice}</li>
            ))
          ) : (
            <li>تمرین مداوم با حفظ ساختار پیوسته و تنوع کالوکیشن‌های طبیعی به ارتقای نمره باند کمک خواهد کرد.</li>
          )}
        </ul>
      </section>

      {/* Teacher Review Escalation CTA */}
      <section className={styles.teacherCard} aria-label="Human Examiner Escalation">
        <div className={styles.teacherInfo}>
          <h2 className={styles.teacherTitle}>درخواست تصحیح و نمره‌دهی رسمی توسط اگزمینر انسان</h2>
          <p className={styles.teacherSubtitle}>
            اگر به نمره‌دهی دقیق‌تر، فیدبک جامع‌تر و توصیه‌های یک‌به‌یک نیاز دارید، آزمون شما توسط مدرسین دارای سرتیفیکیت رسمی بازبینی خواهد شد.
          </p>
        </div>

        <div>
          {teacherReviewRequested ? (
            <div style={{ color: "var(--color-success)", fontWeight: 700, fontSize: "var(--font-size-sm)" }}>
              ✓ درخواست بازبینی توسط اگزمینر رسمی ایندورا با موفقیت ثبت شده است.
            </div>
          ) : (
            <Button
              type="button"
              variant="primary"
              className={styles.actionBtnPrimary}
              onClick={handleTeacherReviewRequest}
              loading={requestingTeacher}
              disabled={requestingTeacher}
            >
              {requestingTeacher ? "در حال ثبت درخواست..." : "ارسال برای اگزمینر رسمی 👨‍🏫"}
            </Button>
          )}
        </div>
      </section>
    </div>
    </PublicShell>
  );
}

export default function IELTSSpeakingReportPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>در حال بارگذاری کارنامه...</div>}>
      <IELTSSpeakingReportContent />
    </React.Suspense>
  );
}
