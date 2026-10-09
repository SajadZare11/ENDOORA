"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PublicShell } from "@/components/marketing/PublicShell";
import {
  ALL_LISTENING_LESSONS,
  getListeningLessonById,
} from "@/data/listening";
import { ListeningAudioEngine } from "@/lib/listening/audio-engine";
import {
  recordLessonAttempt,
  loadListeningProgress,
} from "@/lib/listening/progress";
import { ListeningAudioPlayer } from "@/components/listening/ListeningAudioPlayer";
import { ListeningExerciseEngine } from "@/components/listening/ListeningExerciseEngine";
import { ListeningTranscriptViewer } from "@/components/listening/ListeningTranscriptViewer";
import { ListeningVocabularyList } from "@/components/listening/ListeningVocabularyList";
import { ListeningShadowingStudio } from "@/components/listening/ListeningShadowingStudio";
import { ListeningDictationLab } from "@/components/listening/ListeningDictationLab";
import { DifficultyProfileModal } from "@/components/listening/DifficultyProfileModal";
import styles from "../listening.module.css";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default function ListeningLessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const lesson = useMemo(() => {
    return getListeningLessonById(resolvedParams.lessonId);
  }, [resolvedParams.lessonId]);

  if (!lesson) {
    notFound();
  }

  // Active stage: 1 to 7
  const [activeStage, setActiveStage] = useState<number>(1);
  const [activeMode, setActiveMode] = useState<"standard" | "shadowing" | "dictation">("standard");
  const [completedStages, setCompletedStages] = useState<number[]>([1]);
  const [stageScores, setStageScores] = useState<Record<number, number>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);

  // Dedicated Audio Engine instance for this lesson
  const engine = useMemo(() => {
    return new ListeningAudioEngine();
  }, []);

  useEffect(() => {
    engine.loadLesson(
      lesson.audio.primaryAudioUrl,
      lesson.audio.speechSynthesisText,
      lesson.transcript,
      lesson.durationSeconds
    );

    return () => {
      engine.destroy();
    };
  }, [engine, lesson]);

  const handleStageComplete = (stageNum: number, score: number = 100) => {
    setCompletedStages((prev) => Array.from(new Set([...prev, stageNum])));
    setStageScores((prev) => ({ ...prev, [stageNum]: score }));

    if (stageNum < 7) {
      setActiveStage(stageNum + 1);
    } else {
      // Finished all 7 stages
      handleFinalLessonFinish();
    }
  };

  const handleFinalLessonFinish = () => {
    const scores = Object.values(stageScores);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 85;

    recordLessonAttempt(
      lesson,
      avgScore,
      lesson.durationSeconds,
      [1, 2, 3, 4, 5, 6, 7],
      {},
      []
    );

    setShowCompletionModal(true);
  };

  const stagesList = [
    { num: 1, nameFa: "۱. قبل از شنیدن", badge: "آمادگی" },
    { num: 2, nameFa: "۲. درک پیام کلی", badge: "Gist" },
    { num: 3, nameFa: "۳. استخراج اطلاعات", badge: "Details" },
    { num: 4, nameFa: "۴. تحلیل عمیق و لحن", badge: "Inference" },
    { num: 5, nameFa: "۵. متن پیاده‌شده", badge: "Transcript" },
    { num: 6, nameFa: "۶. واژگان کلیدی", badge: "Vocabulary" },
    { num: 7, nameFa: "۷. تولید گفتاری", badge: "Speaking" },
  ];

  return (
    <PublicShell locale="fa" currentPath={`/skills/listening/${lesson.id}`}>
      <div className={styles.container}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <Link
            href="/skills/listening"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            <span>←</span>
            <span>بازگشت به کتابخانه لیسنینگ</span>
          </Link>

          <DifficultyProfileModal difficulty={lesson.difficulty} />
        </div>

        {/* Lesson Header Card */}
        <header
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.25rem",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span className={`${styles.cefrBadge} ${styles[`cefr${lesson.level}` as keyof typeof styles]}`}>
                سطح {lesson.level}
              </span>
              <span className={styles.topicTag}>{lesson.topic}</span>
              <span className={styles.topicTag}>🗣️ لهجه {lesson.accent}</span>
              <span className={styles.topicTag}>⏱️ {lesson.durationSeconds} ثانیه</span>
            </div>
          </div>

          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem 0", direction: "ltr", textAlign: "left" }}>
            {lesson.titleEn}
          </h1>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.25rem" }}>
            {lesson.titleFa}
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
            {lesson.subtitleFa}
          </p>
        </header>

        {/* Main Audio Player Engine */}
        <ListeningAudioPlayer
          engine={engine}
          sentences={lesson.transcript}
          titleFa={lesson.titleFa}
          titleEn={lesson.titleEn}
          onSentenceChange={(idx) => setActiveSentenceIdx(idx)}
        />

        {/* Learning Mode Switcher Bar */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.25rem",
            background: "#f1f5f9",
            padding: "0.35rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode("standard")}
            className={styles.secBtn}
            style={{
              flex: 1,
              justifyContent: "center",
              background: activeMode === "standard" ? "#ffffff" : "transparent",
              border: activeMode === "standard" ? "1px solid #cbd5e1" : "none",
              color: activeMode === "standard" ? "#0f172a" : "#64748b",
              boxShadow: activeMode === "standard" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            📚 مسیر آموزشی استاندارد (۷ مرحله)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("shadowing")}
            className={styles.secBtn}
            style={{
              flex: 1,
              justifyContent: "center",
              background: activeMode === "shadowing" ? "#ffffff" : "transparent",
              border: activeMode === "shadowing" ? "1px solid #cbd5e1" : "none",
              color: activeMode === "shadowing" ? "#0f172a" : "#64748b",
              boxShadow: activeMode === "shadowing" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            🎙️ کارگاه شدوئینگ و تلفظ (Shadowing)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("dictation")}
            className={styles.secBtn}
            style={{
              flex: 1,
              justifyContent: "center",
              background: activeMode === "dictation" ? "#ffffff" : "transparent",
              border: activeMode === "dictation" ? "1px solid #cbd5e1" : "none",
              color: activeMode === "dictation" ? "#0f172a" : "#64748b",
              boxShadow: activeMode === "dictation" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            ✍️ آزمایشگاه دیکته صوتی (Dictation)
          </button>
        </div>

        {/* MODE 1: Standard 7-Stage Sequence */}
        {activeMode === "standard" && (
          <div>
            {/* 7-Stage Horizontal Step Navigation */}
            <div className={styles.stageNav} role="tablist">
              {stagesList.map((stg) => {
                const isActive = activeStage === stg.num;
                const isPassed = completedStages.includes(stg.num);

                return (
                  <button
                    key={stg.num}
                    type="button"
                    onClick={() => setActiveStage(stg.num)}
                    className={`${styles.stageTab} ${isActive ? styles.stageTabActive : ""}`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{stg.nameFa}</span>
                    {isPassed && <span style={{ marginRight: "0.25rem", color: isActive ? "#ffffff" : "#16a34a" }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* STAGE 1: Before Listening */}
            {activeStage === 1 && (
              <div className={styles.stageCard}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                    {lesson.preListening.titleFa}
                  </h3>
                  <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: "0.35rem" }}>
                      بافت و موقعیت مکالمه:
                    </div>
                    <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: "0.9rem" }}>
                      {lesson.preListening.contextFa}
                    </p>
                  </div>

                  {/* Vocabulary Warmup */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>
                      واژگان کلیدی برای آماده‌سازی ذهن:
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {lesson.preListening.keyVocabularyPrep.map((vocab, vIdx) => (
                        <div
                          key={vIdx}
                          style={{
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            padding: "0.4rem 0.75rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <strong style={{ direction: "ltr", display: "inline-block", marginLeft: "0.4rem", color: "#1e40af" }}>
                            {vocab.word}:
                          </strong>
                          <span style={{ color: "#334155" }}>{vocab.meaningFa}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Question */}
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: "8px" }}>
                    <div style={{ fontWeight: 700, color: "#14532d", marginBottom: "0.4rem" }}>
                      🤔 سوال پیش‌بینی قبل از پخش صوت:
                    </div>
                    <div style={{ direction: "ltr", textAlign: "left", fontWeight: 600, color: "#0f172a", marginBottom: "0.3rem" }}>
                      {lesson.preListening.predictionQuestion.promptEn}
                    </div>
                    <div style={{ color: "#334155", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                      {lesson.preListening.predictionQuestion.promptFa}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#15803d" }}>
                      💡 راهنما: {lesson.preListening.predictionQuestion.guidingNoteFa}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(1)}
                    className={styles.enterBtn}
                  >
                    <span>آماده‌ام؛ ورود به مرحله ۲ (شنیدن پیام کلی)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: First Listening (Gist) */}
            {activeStage === 2 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  {lesson.firstListening.titleFa}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
                  {lesson.firstListening.instructionFa}
                </p>

                <ListeningExerciseEngine
                  exercises={lesson.firstListening.exercises}
                  onAllCompleted={(score) => handleStageComplete(2, score)}
                />

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(2)}
                    className={styles.enterBtn}
                  >
                    <span>تایید و رفتن به مرحله ۳ (جزییات دقیق)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Second Listening (Specific Information) */}
            {activeStage === 3 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  {lesson.secondListening.titleFa}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
                  {lesson.secondListening.instructionFa}
                </p>

                <ListeningExerciseEngine
                  exercises={lesson.secondListening.exercises}
                  onAllCompleted={(score) => handleStageComplete(3, score)}
                />

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(3)}
                    className={styles.enterBtn}
                  >
                    <span>تایید و رفتن به مرحله ۴ (شنیدن عمیق و لحن)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: Third Listening (Inference & Attitude) */}
            {activeStage === 4 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  {lesson.thirdListening.titleFa}
                </h3>
                <div style={{ background: "#fdf4ff", border: "1px solid #f0abfc", padding: "0.75rem 1rem", borderRadius: "8px", color: "#86198f", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>
                  🎯 تمرکز آموزشی سطح {lesson.level}: {lesson.thirdListening.levelFocusFa}
                </div>

                <ListeningExerciseEngine
                  exercises={lesson.thirdListening.exercises}
                  onAllCompleted={(score) => handleStageComplete(4, score)}
                />

                {lesson.thirdListening.connectedSpeechSection && (
                  <div style={{ marginTop: "1.5rem", background: "#fefce8", border: "1px solid #fde047", padding: "1rem", borderRadius: "10px" }}>
                    <div style={{ fontWeight: 700, color: "#854d0e", marginBottom: "0.35rem" }}>
                      ⚡ {lesson.thirdListening.connectedSpeechSection.titleFa}
                    </div>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#713f12" }}>
                      {lesson.thirdListening.connectedSpeechSection.descriptionFa}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {lesson.thirdListening.connectedSpeechSection.examples.map((ex, eIdx) => (
                        <div key={eIdx} style={{ background: "#ffffff", padding: "0.6rem 0.85rem", borderRadius: "6px", border: "1px solid #fef08a" }}>
                          <div style={{ direction: "ltr", fontWeight: 700, color: "#0f172a" }}>
                            {ex.canonicalEn} ➔ <span style={{ color: "#ca8a04" }}>{ex.connectedEn}</span>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                            {ex.explanationFa}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(4)}
                    className={styles.enterBtn}
                  >
                    <span>مشاهده متن کامل مکالمه (مرحله ۵)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 5: Transcript */}
            {activeStage === 5 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  مرحله ۵: متن کامل پیاده‌شده و نشانه‌گذاری صوتی
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
                  اکنون می‌توانید متن را بررسی کرده، آنچه شنیده‌اید را با متن اصلی مقایسه نمایید و روی هر جمله کلیک کنید تا صوت همان بخش تکرار شود.
                </p>

                <ListeningTranscriptViewer
                  sentences={lesson.transcript}
                  activeSentenceIndex={activeSentenceIdx}
                  onSentenceClick={(idx) => engine.jumpToSentence(idx)}
                  initiallyRevealed={true}
                />

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(5)}
                    className={styles.enterBtn}
                  >
                    <span>بررسی واژگان کلیدی (مرحله ۶)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 6: Vocabulary */}
            {activeStage === 6 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  مرحله ۶: جعبه‌ابزار واژگان و همنشینی‌های طلایی
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
                  کلمات کاربردی استخراج‌شده از این فایل صوتی را همراه با تلفظ صوتی، کاربرد در بافت و همنشینی‌ها بررسی کنید.
                </p>

                <ListeningVocabularyList items={lesson.vocabulary} />

                <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                  <button
                    type="button"
                    onClick={() => handleStageComplete(6)}
                    className={styles.enterBtn}
                  >
                    <span>فعالیت تکمیلی و خروجی گفتاری (مرحله ۷)</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 7: Post Listening & Production */}
            {activeStage === 7 && (
              <div className={styles.stageCard}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.2rem", fontWeight: 700 }}>
                  {lesson.postListening.titleFa}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.25rem 0" }}>
                  {lesson.postListening.instructionFa}
                </p>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", direction: "ltr", textAlign: "left", marginBottom: "0.5rem" }}>
                    {lesson.postListening.promptEn}
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "1rem" }}>
                    {lesson.postListening.promptFa}
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#1e293b" }}>نکات راهنما برای پاسخ دادن:</strong>
                    <ul style={{ margin: "0.4rem 0 0 0", paddingRight: "1.2rem", color: "#64748b", fontSize: "0.85rem" }}>
                      {lesson.postListening.guidingQuestionsFa.map((g, gIdx) => (
                        <li key={gIdx}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  {lesson.postListening.suggestedPhrasesEn && (
                    <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                      <span style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 700 }}>الگوی پیشنهادی برای بیان: </span>
                      <div style={{ direction: "ltr", color: "#0f172a", fontSize: "0.9rem", marginTop: "0.2rem" }}>
                        "{lesson.postListening.suggestedPhrasesEn[0]}"
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleFinalLessonFinish}
                    className={styles.enterBtn}
                    style={{ background: "#16a34a", padding: "0.75rem 2rem", fontSize: "1rem" }}
                  >
                    <span>✓ اتمام این درس و ثبت در سوابق لیسنینگ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Dedicated Shadowing Studio */}
        {activeMode === "shadowing" && (
          <ListeningShadowingStudio
            sentences={lesson.transcript}
            onCompleteSentence={(idx) => {
              if (idx === lesson.transcript.length - 1) {
                handleStageComplete(7, 100);
              }
            }}
          />
        )}

        {/* MODE 3: Dedicated Dictation Lab */}
        {activeMode === "dictation" && (
          <ListeningDictationLab
            snippets={lesson.transcript.slice(0, 3).map((s) => ({
              id: s.id,
              targetSentenceEn: s.textEn,
              targetSentenceFa: s.textFa,
            }))}
            onFinish={(accuracy) => {
              handleStageComplete(7, accuracy);
            }}
          />
        )}

        {/* Lesson Completion Modal */}
        {showCompletionModal && (
          <div
            role="dialog"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.7)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              direction: "rtl",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "2rem",
                maxWidth: "480px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>
                آفرین! این درس با موفقیت تکمیل شد
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
                پیشرفت شما در سطح <strong>{lesson.level}</strong> و مهارت‌های مربوطه با موفقیت ثبت شد.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/skills/listening"
                  className={styles.secBtn}
                  style={{ padding: "0.65rem 1.25rem" }}
                >
                  بازگشت به کتابخانه
                </Link>

                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className={styles.secBtn}
                  style={{ background: "#2563eb", color: "#ffffff", borderColor: "#2563eb", padding: "0.65rem 1.25rem" }}
                >
                  مرور مجدد همین درس
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
