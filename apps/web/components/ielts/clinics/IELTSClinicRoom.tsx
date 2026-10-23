'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { IeltsClinicData, ClinicProgressRecord } from "@endoora/contracts";
import { getClinicRecord, saveClinicProgress } from "@/lib/ielts-clinic-storage";
import styles from "./ielts-clinics.module.css";

interface IELTSClinicRoomProps {
  clinic: IeltsClinicData;
}

export function IELTSClinicRoom({ clinic }: IELTSClinicRoomProps) {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Load existing progress from localStorage on mount
  useEffect(() => {
    const existing = getClinicRecord(clinic.id);
    if (existing && existing.userAnswers) {
      setUserAnswers(existing.userAnswers);
    }
  }, [clinic.id]);

  // Track time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = clinic.drills.length;
  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount >= totalQuestions && totalQuestions > 0;

  // Calculate score
  const score = clinic.drills.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctAnswerIndex ? acc + 1 : acc;
  }, 0);
  const accuracyPercentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Handle answering a drill question
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    // If already answered, allow changing or lock?
    // In our learning loop, instant feedback shows immediately
    const updatedAnswers = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(updatedAnswers);

    const newAnsweredCount = Object.keys(updatedAnswers).length;
    const newScore = clinic.drills.reduce((acc, q) => {
      return updatedAnswers[q.id] === q.correctAnswerIndex ? acc + 1 : acc;
    }, 0);
    const newAccuracy = Math.round((newScore / totalQuestions) * 100);
    const completed = newAnsweredCount >= totalQuestions;

    const record: ClinicProgressRecord = {
      clinicId: clinic.id,
      skill: clinic.skill,
      completed,
      score: newScore,
      totalQuestions,
      accuracyPercentage: newAccuracy,
      timeSpentSeconds,
      badgeUnlocked: completed && newAccuracy >= 60,
      lastAttemptedAt: new Date().toISOString(),
      userAnswers: updatedAnswers,
    };

    saveClinicProgress(record);

    if (completed && !showCelebrationModal) {
      setShowCelebrationModal(true);
    }
  };

  const handleResetDrills = () => {
    setUserAnswers({});
    setShowCelebrationModal(false);
  };

  return (
    <div className={styles.roomContainer}>
      {/* Top Bar with Back Button */}
      <div className={styles.roomTopBar}>
        <Link href="/ielts/clinics" className={styles.backButton}>
          → بازگشت به فهرست کلینیک‌ها
        </Link>
        <span className={styles.targetBandBadge}>
          {clinic.targetBands} | زمان پیشنهادی: {clinic.estimatedMinutes} دقیقه
        </span>
      </div>

      {/* Clinic Hero */}
      <header className={styles.roomHero}>
        <div className={styles.roomHeroKicker}>
          <span style={{ fontSize: "1.75rem" }}>{clinic.heroIcon}</span>
          <span className={styles.kicker}>{clinic.badgeLabelFa}</span>
        </div>
        <h1 className={styles.roomHeroTitle}>{clinic.titleFa}</h1>
        <p className={styles.roomHeroTitleEn}>{clinic.titleEn}</p>
        <p className={styles.roomHeroDesc}>{clinic.hurdleSummaryFa}</p>
      </header>

      {/* 3-Stage Stepper Navigation */}
      <nav className={styles.stepperBar} aria-label="مراحل کلینیک">
        <button
          type="button"
          className={`${styles.stepButton} ${activeStage === 1 ? styles.stepButtonActive : ""}`}
          onClick={() => setActiveStage(1)}
        >
          <span className={styles.stepNumber}>۱</span>
          <div className={styles.stepContent}>
            <h4>فرمول و نقشه راه</h4>
            <p>اصول طلایی و مدیریت زمان</p>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.stepButton} ${activeStage === 2 ? styles.stepButtonActive : ""}`}
          onClick={() => setActiveStage(2)}
        >
          <span className={styles.stepNumber}>۲</span>
          <div className={styles.stepContent}>
            <h4>کالبدشکافی تله‌ها</h4>
            <p>تله فارسی در برابر منطق اگزمینر</p>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.stepButton} ${activeStage === 3 ? styles.stepButtonActive : ""}`}
          onClick={() => setActiveStage(3)}
        >
          <span className={styles.stepNumber}>۳</span>
          <div className={styles.stepContent}>
            <h4>تمرین زنده تشخیصی</h4>
            <p>
              {answeredCount} از {totalQuestions} سوال پاسخ داده شده
            </p>
          </div>
        </button>
      </nav>

      {/* STAGE 1: STRATEGY & CHEAT-SHEET */}
      {activeStage === 1 && (
        <section className={styles.stageCard} aria-label="بخش فرمول و نقشه راه">
          {/* Golden Formula Box */}
          <div className={styles.goldenBox}>
            <div className={styles.goldenBoxTitle}>
              <span>⚡</span>
              <span>فرمول طلایی حل مسئله (Golden Formula)</span>
            </div>
            <p className={styles.goldenBoxTextFa}>{clinic.strategyGuide.goldenFormulaFa}</p>
            {clinic.strategyGuide.goldenFormulaEn && (
              <p className={styles.goldenBoxTextEn}>{clinic.strategyGuide.goldenFormulaEn}</p>
            )}
          </div>

          {/* Core Principles */}
          <div className={styles.principlesSection}>
            <h3 className={styles.principlesSectionTitle}>
              <span>🎯</span>
              <span>اصول اجرای استراتژی در جلسه آزمون</span>
            </h3>
            <ul className={styles.principlesList}>
              {clinic.strategyGuide.corePrinciplesFa.map((principle, idx) => (
                <li key={idx} className={styles.principleItem}>
                  <span className={styles.principleDot}>✓</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Time Management Tip */}
          <div className={styles.timeManagementBox}>
            <span>⏱️</span>
            <div>
              <strong>مدیریت زمان در آزمون: </strong>
              <span>{clinic.strategyGuide.timeManagementTipFa}</span>
            </div>
          </div>

          {/* Key Vocabulary Chips */}
          {clinic.strategyGuide.keyVocabulary && clinic.strategyGuide.keyVocabulary.length > 0 && (
            <div className={styles.vocabSection}>
              <h3 className={styles.principlesSectionTitle}>
                <span>📚</span>
                <span>واژگان کلیدی و اصطلاحات تکنیکی این مهارت</span>
              </h3>
              <div className={styles.vocabGrid}>
                {clinic.strategyGuide.keyVocabulary.map((v, i) => (
                  <div key={i} className={styles.vocabChip}>
                    <div className={styles.vocabWord}>{v.word}</div>
                    {v.ipa && <div className={styles.vocabIpa}>{v.ipa}</div>}
                    <div className={styles.vocabFa}>{v.fa}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <button
              type="button"
              className={styles.modalPrimaryBtn}
              onClick={() => setActiveStage(2)}
              style={{ display: "inline-block", width: "auto", padding: "0.75rem 2rem" }}
            >
              مرحله بعد: کالبدشکافی تله‌ها ←
            </button>
          </div>
        </section>
      )}

      {/* STAGE 2: DECONSTRUCT THE TRAP */}
      {activeStage === 2 && (
        <section className={styles.stageCard} aria-label="بخش کالبدشکافی تله‌ها">
          <div className={styles.trapCardsList}>
            {clinic.trapDeconstructions.map((trap) => (
              <article key={trap.id} className={styles.trapCard}>
                <div className={styles.trapCardHeader}>
                  <h3 className={styles.trapCardTitleFa}>{trap.trapTitleFa}</h3>
                  <div className={styles.trapCardTitleEn}>{trap.trapTitleEn}</div>
                </div>

                <div className={styles.trapContextBox}>
                  <strong>Context:</strong> {trap.contextPassageOrPrompt}
                </div>

                <div className={styles.sideBySideGrid}>
                  {/* Wrong Choice Box */}
                  <div className={styles.wrongBox}>
                    <div className={styles.wrongBoxHeader}>
                      <span>❌</span>
                      <span>تله رایج فارسی‌زبان‌ها</span>
                    </div>
                    <div className={styles.wrongBoxChoice}>
                      {trap.commonWrongChoice}
                    </div>
                    <div className={styles.wrongBoxExplanation}>
                      {trap.whyWrongFa}
                    </div>
                  </div>

                  {/* Correct Choice Box */}
                  <div className={styles.correctBox}>
                    <div className={styles.correctBoxHeader}>
                      <span>✅</span>
                      <span>پاسخ صحیح و منطق اگزمینر</span>
                    </div>
                    <div className={styles.correctBoxChoice}>
                      {trap.correctChoice}
                    </div>
                    <div className={styles.correctBoxExplanation}>
                      {trap.whyCorrectFa}
                    </div>
                  </div>
                </div>

                <div className={styles.examinerSecretBanner}>
                  <span>💡</span>
                  <div>
                    <strong>راز طراح سوال کمبریج: </strong>
                    <span>{trap.examinerSecretFa}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              className={styles.modalSecondaryBtn}
              onClick={() => setActiveStage(1)}
            >
              → مرحله قبل: فرمول طلایی
            </button>
            <button
              type="button"
              className={styles.modalPrimaryBtn}
              onClick={() => setActiveStage(3)}
              style={{ display: "inline-block", width: "auto", padding: "0.75rem 2rem" }}
            >
              مرحله بعد: ورود به تمرین‌های زنده ←
            </button>
          </div>
        </section>
      )}

      {/* STAGE 3: INTERACTIVE DRILLS */}
      {activeStage === 3 && (
        <section className={styles.stageCard} aria-label="بخش تمرین‌های زنده">
          <div className={styles.drillHeader}>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                تمرین‌های تشخیصی و شبیه‌ساز کمبریج
              </h3>
              <p style={{ color: "#64748b", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
                گزینه مورد نظر خود را انتخاب کنید تا منطق تحلیلی هر سوال بلافاصله آشکار شود.
              </p>
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2563eb" }}>
                {answeredCount} / {totalQuestions}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748b", display: "block" }}>
                سوالات حل‌شده
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.drillProgressBar}>
            <div
              className={styles.drillProgressFill}
              style={{
                width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Questions List */}
          <div>
            {clinic.drills.map((q) => {
              const selectedOption = userAnswers[q.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = selectedOption === q.correctAnswerIndex;

              return (
                <div key={q.id} className={styles.questionCard}>
                  <div className={styles.questionMeta}>
                    <span className={styles.questionOrder}>
                      سوال #{q.orderNumber}
                    </span>
                    <span className={styles.trapBadge}>{q.trapTypeBadge}</span>
                  </div>

                  <p className={styles.questionPromptFa}>{q.promptFa}</p>
                  <p className={styles.questionPromptEn}>{q.promptEn}</p>

                  {q.passageSnippet && (
                    <div className={styles.passageBox}>{q.passageSnippet}</div>
                  )}

                  {/* Options */}
                  <div className={styles.optionsList}>
                    {q.options.map((opt, optIdx) => {
                      let btnClass = styles.optionButton;
                      if (isAnswered) {
                        if (optIdx === q.correctAnswerIndex) {
                          btnClass += ` ${styles.optionCorrect}`;
                        } else if (optIdx === selectedOption) {
                          btnClass += ` ${styles.optionWrong}`;
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={btnClass}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === q.correctAnswerIndex && (
                            <span style={{ color: "#16a34a", fontWeight: 800 }}>✓ صحیح</span>
                          )}
                          {isAnswered && optIdx === selectedOption && optIdx !== q.correctAnswerIndex && (
                            <span style={{ color: "#dc2626", fontWeight: 800 }}>✗ خطا</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (Shown once answered) */}
                  {isAnswered && (
                    <div className={styles.explanationBox}>
                      <div className={styles.explanationHeader}>
                        <span>{isCorrect ? "✅ آفرین! تحلیل اگزمینر:" : "❌ بررسی تله کمبریج:"}</span>
                      </div>
                      <div className={styles.explanationBrief}>
                        {q.explanation.briefFa}
                      </div>
                      <div className={styles.explanationDetailed}>
                        {q.explanation.detailedFa}
                      </div>
                      <div className={styles.cambridgeTip}>
                        <strong>نکته کلیدی کمبریج: </strong>
                        <span>{q.explanation.cambridgeTipFa}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              className={styles.modalSecondaryBtn}
              onClick={() => setActiveStage(2)}
            >
              → مرحله قبل: کالبدشکافی تله‌ها
            </button>
            {isAllAnswered && (
              <button
                type="button"
                className={styles.modalPrimaryBtn}
                onClick={() => setShowCelebrationModal(true)}
                style={{ width: "auto", padding: "0.75rem 2rem" }}
              >
                مشاهده کارنامه و مدال افتخار 🏆
              </button>
            )}
          </div>
        </section>
      )}

      {/* CELEBRATION MODAL */}
      {showCelebrationModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <span className={styles.modalBadgeIcon}>🏆</span>
            <h2 className={styles.modalTitle}>کلینیک با موفقیت فتح شد!</h2>
            <p className={styles.modalSubtitle}>
              شما تمرین‌های تشخیصی کلینیک <strong>«{clinic.titleFa}»</strong> را با موفقیت
              تکمیل کردید و مدال تسلط بر این تله کمبریج به کارنامه شما افزوده شد.
            </p>

            <div className={styles.scoreBanner}>
              <div className={styles.scoreBannerItem}>
                <span className={styles.scoreBannerVal}>
                  {score} / {totalQuestions}
                </span>
                <span className={styles.scoreBannerLabel}>پاسخ‌های صحیح</span>
              </div>
              <div className={styles.scoreBannerItem}>
                <span className={styles.scoreBannerVal}>{accuracyPercentage}٪</span>
                <span className={styles.scoreBannerLabel}>دقت تشخیصی</span>
              </div>
              <div className={styles.scoreBannerItem}>
                <span className={styles.scoreBannerVal}>
                  {Math.round(timeSpentSeconds / 60)} دقیقه
                </span>
                <span className={styles.scoreBannerLabel}>زمان تمرین</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <Link href="/ielts/clinics" className={styles.modalPrimaryBtn}>
                بازگشت به فهرست کلینیک‌ها
              </Link>
              <button
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={handleResetDrills}
              >
                تمرین مجدد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
