'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./ielts-writing-report.module.css";
import {
  fetchWritingReport,
  fetchWritingHistory,
  requestTeacherWritingReview,
  IELTSWritingReport,
} from "../../../../../lib/ielts-writing";

export default function IELTSWritingReportPage() {
  const searchParams = useSearchParams();
  const submissionIdParam = searchParams.get("id");

  const [report, setReport] = useState<IELTSWritingReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeEssayTab, setActiveEssayTab] = useState<1 | 2>(2);
  const [teacherReviewRequested, setTeacherReviewRequested] = useState(false);
  const [requestingTeacher, setRequestingTeacher] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        let idToLoad = submissionIdParam;
        if (!idToLoad) {
          const history = await fetchWritingHistory();
          if (history.length > 0) {
            idToLoad = history[0].id;
          }
        }

        if (!idToLoad) {
          setError("هیچ کارنامه ارزیابی رایتینگی یافت نشد.");
          return;
        }

        const data = await fetchWritingReport(idToLoad);
        setReport(data);
        setTeacherReviewRequested(data.teacher_review_requested);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت کارنامه ارزیابی رایتینگ.");
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
      await requestTeacherWritingReview(report.id);
      setTeacherReviewRequested(true);
    } catch {
      // Error handled
    } finally {
      setRequestingTeacher(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minBlockSize: "60vh" }}>
        در حال ارزیابی و استخراج نمرات معیارهای رایتینگ آیلتس...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
        <h2>خطا در نمایش کارنامه</h2>
        <p>{error || "گزارش ارزیابی یافت نشد."}</p>
        <Link href="/ielts/writing" className={styles.actionBtnPrimary}>
          ورود به اتاق تمرین رایتینگ
        </Link>
      </div>
    );
  }

  const confidencePct = Math.round((report.confidence_score || 0.85) * 100);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.kicker}>IELTS Writing AI Diagnostic Evaluation (IELTS-004)</span>
        <h1 className={styles.title}>کارنامه تشخیصی و تحلیلی مهارت نوشتاری آیلتس</h1>
        <p className={styles.subtitle}>
          ارزیابی جامع هوش مصنوعی بر پایه چهار معیار استاندارد، تفکیک نمرات تسک ۱ و تسک ۲ و توصیه‌های آموزشی اگزمینر.
        </p>
      </header>

      {/* Hero Score Card */}
      <section className={styles.heroCard} aria-label="خلاصه نمره باند کل">
        <div className={styles.heroRow}>
          <div className={styles.bandScoreBox}>
            <div className={styles.bandNumber}>Band {report.overall_band.toFixed(1)}</div>
            <div className={styles.bandMeta}>
              <h2 className={styles.bandTitle}>
                {report.overall_band >= 7.5
                  ? "سطح تسلط بسیار خوب (Good User)"
                  : report.overall_band >= 6.0
                  ? "سطح کاربری موثر و مستقل (Competent User)"
                  : "سطح نیازمند تمرین بیشتر (Modest User)"}
              </h2>
              <span className={styles.rangeBadge}>
                دامنه تخمینی باند: [{report.overall_band_min.toFixed(1)} – {report.overall_band_max.toFixed(1)}]
                {" | "}
                اطمینان هوش مصنوعی: {confidencePct}% (Validated Beta)
              </span>
              <div>
                <span className={styles.cefrBadge}>سطح CEFR معادل: {report.cefr_level}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtonRow}>
            <Link href="/ielts/writing" className={styles.actionBtnPrimary}>
              نگارش و تمرین جدید ➔
            </Link>
            <Link href="/teachers" className={styles.actionBtnSecondary}>
              رزرو جلسه آنلاین با اگزمینر آیلتس
            </Link>
          </div>
        </div>

        <div className={styles.weightingNote}>
          ℹ بر اساس قانون رسمی آیلتس، نمره نهایی رایتینگ بر پایه فرمول وزنی <strong>یک‌سوم تسک ۱ + دوسوم تسک ۲</strong> محاسبه و به نزدیک‌ترین نیم‌باند (Half-Band) گرد شده است.
        </div>
      </section>

      {/* 4 Official Criteria Cards */}
      <section aria-label="تحلیل معیارهای چهارگانه رایتینگ">
        <h2 className={styles.cardTitle} style={{ marginBlockEnd: "var(--space-3)" }}>
          نمرات تفکیکی معیارهای چهارگانه رسمی آیلتس
        </h2>
        <div className={styles.criteriaGrid}>
          {/* 1. TA / TR */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <span className={styles.criteriaName}>Task Achievement / Response</span>
              <span className={styles.criteriaScoreBadge}>
                {report.criteria_breakdown?.task_achievement_or_response?.score || "—"}
              </span>
            </div>
            <p className={styles.criteriaDescriptor}>
              {report.criteria_breakdown?.task_achievement_or_response?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown?.task_achievement_or_response?.guidance_fa}
            </div>
          </div>

          {/* 2. CC */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <span className={styles.criteriaName}>Coherence & Cohesion</span>
              <span className={styles.criteriaScoreBadge}>
                {report.criteria_breakdown?.coherence_and_cohesion?.score || "—"}
              </span>
            </div>
            <p className={styles.criteriaDescriptor}>
              {report.criteria_breakdown?.coherence_and_cohesion?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown?.coherence_and_cohesion?.guidance_fa}
            </div>
          </div>

          {/* 3. LR */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <span className={styles.criteriaName}>Lexical Resource</span>
              <span className={styles.criteriaScoreBadge}>
                {report.criteria_breakdown?.lexical_resource?.score || "—"}
              </span>
            </div>
            <p className={styles.criteriaDescriptor}>
              {report.criteria_breakdown?.lexical_resource?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown?.lexical_resource?.guidance_fa}
            </div>
          </div>

          {/* 4. GRA */}
          <div className={styles.criteriaCard}>
            <div className={styles.criteriaHeader}>
              <span className={styles.criteriaName}>Grammatical Range & Accuracy</span>
              <span className={styles.criteriaScoreBadge}>
                {report.criteria_breakdown?.grammatical_range_and_accuracy?.score || "—"}
              </span>
            </div>
            <p className={styles.criteriaDescriptor}>
              {report.criteria_breakdown?.grammatical_range_and_accuracy?.descriptor_en}
            </p>
            <div className={styles.criteriaFaGuidance}>
              {report.criteria_breakdown?.grammatical_range_and_accuracy?.guidance_fa}
            </div>
          </div>
        </div>
      </section>

      {/* Human Teacher Review Escalation Box */}
      <section className={styles.teacherReviewBox} aria-label="درخواست تصحیح مدرس">
        <div className={styles.teacherReviewMeta}>
          <h3 className={styles.teacherReviewTitle}>
            {teacherReviewRequested
              ? "✓ درخواست تصحیح انسانی ثبت شد"
              : "آیا تمایل به تصحیح و نمره‌دهی تفصیلی توسط اگزمینر رسمی دارید؟"}
          </h3>
          <p className={styles.teacherReviewDesc}>
            {teacherReviewRequested
              ? "متن ارسالی شما در صف بررسی کارشناسان ارشد دپارتمان آیلتس اندورا قرار گرفت."
              : "مدرسان معتبر اندورا می‌توانند استدلال‌ها و ظرافت‌های انشای شما را به صورت دستی تصحیح و نمره‌گذاری کنند."}
          </p>
        </div>

        {!teacherReviewRequested && (
          <button
            type="button"
            className={styles.actionBtnPrimary}
            onClick={handleTeacherReviewRequest}
            disabled={requestingTeacher}
          >
            {requestingTeacher ? "در حال ثبت درخواست..." : "درخواست تصحیح اگزمینر"}
          </button>
        )}
      </section>

      {/* Candidate Essay Review & Tabs */}
      <section className={styles.card} aria-label="متن انشا و آمار تفکیکی">
        <div className={styles.essayTabs}>
          <button
            type="button"
            className={`${styles.essayTabBtn} ${activeEssayTab === 1 ? styles.essayTabBtnActive : ""}`}
            onClick={() => setActiveEssayTab(1)}
          >
            تسک ۱ ({report.task1_word_count} کلمه | باند {report.task1_scores?.band || "—"})
          </button>
          <button
            type="button"
            className={`${styles.essayTabBtn} ${activeEssayTab === 2 ? styles.essayTabBtnActive : ""}`}
            onClick={() => setActiveEssayTab(2)}
          >
            تسک ۲ ({report.task2_word_count} کلمه | باند {report.task2_scores?.band || "—"})
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: "var(--font-size-sm)", marginBlockEnd: "var(--space-2)" }}>
            {activeEssayTab === 1 ? report.task1_prompt_title : report.task2_prompt_title}
          </h3>
          <div className={styles.essayContentBox}>
            {activeEssayTab === 1
              ? report.task1_text || "(پاسخی برای تسک ۱ ثبت نشده است)"
              : report.task2_text || "(پاسخی برای تسک ۲ ثبت نشده است)"}
          </div>
        </div>
      </section>

      {/* Inline Annotations & Error Corrections */}
      {report.annotations && report.annotations.length > 0 && (
        <section className={styles.card} aria-label="اصلاحات و تحلیل درون‌متنی">
          <h2 className={styles.cardTitle}>تحلیل خطاهای نگارشی و پیشنهادات ارتقای واژگان</h2>
          <div className={styles.annotationsGrid}>
            {report.annotations.map((ann, idx) => {
              const borderClass =
                ann.category === "grammar"
                  ? styles.annotationGrammar
                  : ann.category === "lexical"
                  ? styles.annotationLexical
                  : ann.category === "cohesion"
                  ? styles.annotationCohesion
                  : styles.annotationTask;

              return (
                <div key={idx} className={`${styles.annotationItem} ${borderClass}`}>
                  <div className={styles.annotationHeader}>
                    <span>تسک {ann.task}: «{ann.snippet}»</span>
                    <span style={{ textTransform: "capitalize", opacity: 0.8 }}>{ann.category}</span>
                  </div>
                  <div style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                    پیشنهاد اصلاحی: {ann.suggestion}
                  </div>
                  <div>{ann.explanation_fa}</div>
                  <div style={{ fontSize: "var(--font-size-2xs)", color: "var(--color-text-secondary)", direction: "ltr", textAlign: "start" }}>
                    {ann.explanation_en}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pedagogical Guidance */}
      {report.pedagogical_advice && report.pedagogical_advice.length > 0 && (
        <section className={styles.card} aria-label="توصیه‌های اگزمینر">
          <h2 className={styles.cardTitle}>توصیه‌های کلیدی اگزمینر برای افزایش نمره باند</h2>
          <ul className={styles.adviceList}>
            {report.pedagogical_advice.map((adv, idx) => (
              <li key={idx}>{adv}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
