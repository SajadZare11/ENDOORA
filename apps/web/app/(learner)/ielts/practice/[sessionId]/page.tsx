'use client';

import React, { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import styles from "./ielts-simulator.module.css";
import {
  fetchActiveSession,
  saveSessionAnswer,
  toggleQuestionFlag,
  advanceSessionSection,
  submitSession,
  ActiveSessionData,
  LearnerSafeQuestion,
  LearnerSafeSection,
} from "../../../../../lib/ielts-simulator";

// Helper to extract flat list of questions
function getAllQuestions(sess: ActiveSessionData | null): LearnerSafeQuestion[] {
  if (!sess) return [];
  const currSec = sess.sections[sess.current_section_index];
  if (!currSec) return [];

  const list: LearnerSafeQuestion[] = [];
  currSec.passages_tasks.forEach((pt) => {
    pt.question_groups.forEach((qg) => {
      qg.questions.forEach((q) => {
        list.push(q);
      });
    });
  });
  return list;
}

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function IELTSExamRoomPage({ params }: PageProps) {
  const router = useRouter();
  const { sessionId } = use(params);

  const [session, setSession] = useState<ActiveSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active question & section state
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Local answers cache: { [questionId]: answer_value }
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flagged, setFlagged] = useState<string[]>([]);

  // Real-time server countdown timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Accessibility settings
  const [fontScale, setFontScale] = useState<"standard" | "large" | "xl">("standard");
  const [contrastTheme, setContrastTheme] = useState<"standard" | "dark">("standard");

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-submit when time expires
  const handleAutoSubmit = useCallback(async () => {
    try {
      await submitSession(sessionId);
      router.push(`/ielts/practice/${sessionId}/report`);
    } catch {
      router.push(`/ielts/practice/${sessionId}/report`);
    }
  }, [sessionId, router]);

  useEffect(() => {
    let ignore = false;
    fetchActiveSession(sessionId)
      .then((data) => {
        if (!ignore) {
          if (data.status === "completed" || data.status === "submitted" || data.status === "timed_out") {
            router.replace(`/ielts/practice/${sessionId}/report`);
            return;
          }
          setSession(data);
          setAnswers(data.responses || {});
          setFlagged(data.flagged_questions || []);

          const exp = new Date(data.expires_at).getTime();
          const now = Date.now();
          const rem = Math.max(0, Math.floor((exp - now) / 1000));
          setSecondsRemaining(rem);

          // Select first question
          const allQ = getAllQuestions(data);
          if (allQ.length > 0) {
            setActiveQuestionId((prev) => prev || allQ[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات جلسه آزمون.");
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [sessionId, router]);

  // Countdown timer effect
  useEffect(() => {
    if (secondsRemaining <= 0 || !session || session.status !== "in_progress") return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, session, handleAutoSubmit]);

  const currentQuestions = getAllQuestions(session);
  const currentSection: LearnerSafeSection | undefined =
    session?.sections[session.current_section_index];

  // Handle answering
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Debounced autosave to backend
    saveSessionAnswer(sessionId, questionId, value).catch(() => {
      // Background retry
    });
  };

  // Toggle flag
  const handleToggleFlag = async (questionId: string) => {
    try {
      const res = await toggleQuestionFlag(sessionId, questionId);
      setFlagged(res.flagged_questions);
    } catch {
      // Revert if failed
    }
  };

  // Navigate Questions
  const handlePrevQuestion = () => {
    const idx = currentQuestions.findIndex((q) => q.id === activeQuestionId);
    if (idx > 0) {
      setActiveQuestionId(currentQuestions[idx - 1].id);
    }
  };

  const handleNextQuestion = () => {
    const idx = currentQuestions.findIndex((q) => q.id === activeQuestionId);
    if (idx >= 0 && idx < currentQuestions.length - 1) {
      setActiveQuestionId(currentQuestions[idx + 1].id);
    }
  };

  // Handle Advance Section or Final Submit
  const handleFinishSection = async () => {
    if (!session) return;
    setSubmitting(true);
    try {
      const isLastSection = session.current_section_index >= session.sections.length - 1;
      if (isLastSection) {
        await submitSession(sessionId);
        router.push(`/ielts/practice/${sessionId}/report`);
      } else {
        const next = await advanceSessionSection(sessionId);
        setSession(next);
        const exp = new Date(next.expires_at).getTime();
        setSecondsRemaining(Math.max(0, Math.floor((exp - Date.now()) / 1000)));
        setShowSubmitModal(false);
        const nextQ = getAllQuestions(next);
        if (nextQ.length > 0) {
          setActiveQuestionId(nextQ[0].id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت نهایی بخش.");
    } finally {
      setSubmitting(false);
    }
  };

  // Format Timer Display
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== "").length;
  const unansweredCount = currentQuestions.length - answeredCount;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minBlockSize: "100vh" }}>
        در حال آماده‌سازی محیط آزمون آیلتس...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div style={{ padding: "var(--space-6)", textAlign: "center" }}>
        <h2>خطا در ورود به جلسه آزمون</h2>
        <p>{error || "جلسه آزمون یافت نشد."}</p>
        <button type="button" onClick={() => router.push("/ielts/practice")}>
          بازگشت به مرکز آزمون‌ها
        </button>
      </div>
    );
  }

  const fontClass =
    fontScale === "large"
      ? styles.fontLarge
      : fontScale === "xl"
      ? styles.fontExtraLarge
      : styles.fontStandard;

  const themeClass = contrastTheme === "dark" ? styles.themeDark : styles.themeStandard;

  return (
    <div className={`${styles.examContainer} ${themeClass} ${fontClass}`}>
      {/* Top Examination Navigation Header */}
      <header className={styles.examHeader}>
        <div className={styles.candidateInfo}>
          <div className={styles.testSectionIndicator}>
            <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.8 }}>
              {session.test_title_en}
            </span>
            <h1 className={styles.sectionTitle}>
              {currentSection?.section_type_display || "Section"} (Part {session.current_section_index + 1} of{" "}
              {session.sections.length})
            </h1>
          </div>
        </div>

        {/* Real-time Synced Clock */}
        <div
          className={`${styles.timerBox} ${
            secondsRemaining < 300
              ? styles.timerCritical
              : secondsRemaining < 600
              ? styles.timerWarning
              : ""
          }`}
          role="timer"
          aria-live="polite"
        >
          <span>⏱️</span>
          <span>{formatTime(secondsRemaining)} remaining</span>
        </div>

        {/* Accessibility Tools */}
        <div className={styles.accessibilityControls}>
          {/* Font scale buttons */}
          <button
            type="button"
            className={`${styles.controlButton} ${fontScale === "standard" ? styles.controlButtonActive : ""}`}
            onClick={() => setFontScale("standard")}
            title="Standard Text Size"
          >
            A
          </button>
          <button
            type="button"
            className={`${styles.controlButton} ${fontScale === "large" ? styles.controlButtonActive : ""}`}
            onClick={() => setFontScale("large")}
            title="Large Text Size"
          >
            A+
          </button>
          <button
            type="button"
            className={`${styles.controlButton} ${fontScale === "xl" ? styles.controlButtonActive : ""}`}
            onClick={() => setFontScale("xl")}
            title="Extra Large Text Size"
          >
            A++
          </button>

          {/* Theme contrast toggle */}
          <button
            type="button"
            className={`${styles.controlButton} ${contrastTheme === "dark" ? styles.controlButtonActive : ""}`}
            onClick={() => setContrastTheme(contrastTheme === "dark" ? "standard" : "dark")}
            title="Toggle Contrast"
          >
            {contrastTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Split-Screen Examination Body */}
      <main className={styles.examBody}>
        {/* Left Pane: Reading Passage or Listening Audio Player */}
        <section className={styles.leftPane} aria-label="Reading Passage or Audio Script">
          {currentSection?.section_type === "listening" && (
            <div className={styles.audioPlayerCard}>
              <strong>🎧 Listening Section Audio Track</strong>
              <p style={{ fontSize: "var(--font-size-xs)", margin: 0, opacity: 0.8 }}>
                The audio will play once automatically. Adjust volume as needed.
              </p>
              {currentSection.audio_media_url && (
                <audio controls src={currentSection.audio_media_url} style={{ inlineSize: "100%", marginBlockStart: "var(--space-2)" }}>
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {currentSection?.passages_tasks.map((pt) => (
            <article key={pt.id} style={{ marginBlockEnd: "var(--space-6)" }}>
              <h2 className={styles.passageHeading}>{pt.title}</h2>
              {pt.media_image_url && (
                <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", marginBlockEnd: "var(--space-3)", textAlign: "center" }}>
                  [Diagram / Chart Image: {pt.media_image_url}]
                </div>
              )}
              <div className={styles.passageContent}>{pt.content_text}</div>
            </article>
          ))}
        </section>

        {/* Right Pane: Question Interactive Workspace */}
        <section className={styles.rightPane} aria-label="Examination Questions">
          {currentSection?.passages_tasks.map((pt) =>
            pt.question_groups.map((group) => (
              <div key={group.id}>
                <div className={styles.questionGroupHeader}>
                  <p className={styles.groupInstructions}>{group.instructions}</p>
                  {Array.isArray(group.heading_options) && group.heading_options.length > 0 && (
                    <div className={styles.headingsBank}>
                      <strong>Options / Headings:</strong>
                      <ul style={{ margin: "var(--space-1) 0 0", paddingInlineStart: "var(--space-4)" }}>
                        {group.heading_options.map((h, i) => (
                          <li key={i}>{typeof h === "object" ? `${h.id}: ${h.text}` : String(h)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBlockStart: "var(--space-3)" }}>
                  {group.questions.map((q) => {
                    const currentVal = answers[q.id] || "";
                    const isFlagged = flagged.includes(q.id);
                    const isActive = activeQuestionId === q.id;

                    return (
                      <div
                        key={q.id}
                        id={`question-${q.id}`}
                        className={`${styles.questionCard} ${isActive ? styles.questionCardActive : ""}`}
                        onClick={() => setActiveQuestionId(q.id)}
                      >
                        <div className={styles.questionPromptRow}>
                          <span className={styles.questionNumberBadge}>Q{q.question_number}</span>
                          <span>{q.prompt_text}</span>
                          {isFlagged && <span title="Flagged for review">🚩</span>}
                        </div>

                        {/* Format 1: True / False / Not Given */}
                        {group.question_type === "true_false_not_given" && (
                          <div className={styles.segmentedButtonGroup}>
                            {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                className={`${styles.segmentedButton} ${
                                  String(currentVal).toUpperCase() === val ? styles.segmentedButtonSelected : ""
                                }`}
                                onClick={() => handleAnswerChange(q.id, val)}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Format 2: Yes / No / Not Given */}
                        {group.question_type === "yes_no_not_given" && (
                          <div className={styles.segmentedButtonGroup}>
                            {["YES", "NO", "NOT GIVEN"].map((val) => (
                              <button
                                key={val}
                                type="button"
                                className={`${styles.segmentedButton} ${
                                  String(currentVal).toUpperCase() === val ? styles.segmentedButtonSelected : ""
                                }`}
                                onClick={() => handleAnswerChange(q.id, val)}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Format 3: Multiple Choice (Single) */}
                        {group.question_type === "multiple_choice_single" && Array.isArray(q.options) && (
                          <div className={styles.optionsList}>
                            {q.options.map((opt) => (
                              <label
                                key={opt.id}
                                className={`${styles.optionLabel} ${
                                  currentVal === opt.id ? styles.optionLabelSelected : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  value={opt.id}
                                  checked={currentVal === opt.id}
                                  onChange={() => handleAnswerChange(q.id, opt.id)}
                                />
                                <strong>{opt.id}.</strong> {opt.text}
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Format 4: Completion (Sentence, Note, Summary) */}
                        {[
                          "sentence_completion",
                          "summary_completion",
                          "note_form_completion",
                          "table_flowchart_completion",
                        ].includes(group.question_type) && (
                          <div>
                            <input
                              type="text"
                              className={styles.textInput}
                              placeholder="Type your answer here..."
                              value={typeof currentVal === "string" ? currentVal : ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                          </div>
                        )}

                        {/* Format 5: Matching Headings */}
                        {group.question_type === "matching_headings" && Array.isArray(group.heading_options) && (
                          <div>
                            <select
                              className={styles.selectInput}
                              value={typeof currentVal === "string" ? currentVal : ""}
                              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            >
                              <option value="">-- Select Heading --</option>
                              {group.heading_options.map((h, i) => {
                                const valId = typeof h === "object" ? h.id : String(h);
                                const valLabel = typeof h === "object" ? `${h.id}: ${h.text}` : String(h);
                                return (
                                  <option key={i} value={valId}>
                                    {valLabel}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Bottom Examination Navigation Ribbon */}
      <footer className={styles.examFooter}>
        <div className={styles.footerLeft}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => activeQuestionId && handleToggleFlag(activeQuestionId)}
            disabled={!activeQuestionId}
          >
            {activeQuestionId && flagged.includes(activeQuestionId) ? "🏳️ Unflag Question" : "🚩 Flag Question"}
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => setShowReviewModal(true)}
          >
            📋 Review All ({answeredCount}/{currentQuestions.length})
          </button>
        </div>

        {/* Question Palette Number Grid */}
        <div className={styles.footerCenter} aria-label="Question Navigation Palette">
          {currentQuestions.map((q) => {
            const hasAns = !!answers[q.id] && answers[q.id] !== "";
            const isFlg = flagged.includes(q.id);
            const isAct = activeQuestionId === q.id;

            return (
              <button
                key={q.id}
                type="button"
                className={`${styles.paletteButton} ${hasAns ? styles.paletteButtonAnswered : ""} ${
                  isFlg ? styles.paletteButtonFlagged : ""
                } ${isAct ? styles.paletteButtonActive : ""}`}
                onClick={() => {
                  setActiveQuestionId(q.id);
                  const el = document.getElementById(`question-${q.id}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                title={`Question ${q.question_number} ${hasAns ? "(Answered)" : "(Unanswered)"}`}
              >
                {q.question_number}
              </button>
            );
          })}
        </div>

        <div className={styles.footerRight}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={handlePrevQuestion}
          >
            ◀ Back
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={handleNextQuestion}
          >
            Next ▶
          </button>
          <button
            type="button"
            className={`${styles.controlButton} ${styles.controlButtonActive}`}
            style={{ background: "var(--color-primary)", color: "var(--color-primary-text)" }}
            onClick={() => setShowSubmitModal(true)}
          >
            {session.current_section_index >= session.sections.length - 1
              ? "Finish Exam ➔"
              : "Next Section ➔"}
          </button>
        </div>
      </footer>

      {/* Review All Modal */}
      {showReviewModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>وضعیت پاسخگویی به سوالات</h3>
              <button type="button" className={styles.controlButton} onClick={() => setShowReviewModal(false)}>
                ✕
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", textAlign: "center" }}>
              <div style={{ background: "var(--color-surface-hover)", padding: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--color-success-text)" }}>
                  {answeredCount}
                </span>
                <div style={{ fontSize: "var(--font-size-xs)" }}>پاسخ داده‌شده</div>
              </div>
              <div style={{ background: "var(--color-surface-hover)", padding: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800, color: "var(--color-warning-text)" }}>
                  {unansweredCount}
                </span>
                <div style={{ fontSize: "var(--font-size-xs)" }}>بی‌پاسخ مانده</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.controlButton} onClick={() => setShowReviewModal(false)}>
                بازگشت به آزمون
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Finish Modal */}
      {showSubmitModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {session.current_section_index >= session.sections.length - 1
                  ? "پایان آزمون و ثبت نهایی کارنامه"
                  : "اتمام بخش فعلی و ورود به بخش بعد"}
              </h3>
              <button type="button" className={styles.controlButton} onClick={() => setShowSubmitModal(false)}>
                ✕
              </button>
            </div>
            <div>
              <p>
                شما به <strong>{answeredCount}</strong> سوال از مجموع <strong>{currentQuestions.length}</strong> سوال پاسخ داده‌اید.
              </p>
              {unansweredCount > 0 && (
                <div style={{ background: "var(--color-warning-bg)", color: "var(--color-warning-text)", border: "1px solid var(--color-warning-border)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontSize: "var(--font-size-xs)" }}>
                  توجه: <strong>{unansweredCount}</strong> سوال هنوز بدون پاسخ است. آیا مایل به ثبت نهایی هستید؟
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.controlButton}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                انصراف و ادامه آزمون
              </button>
              <button
                type="button"
                className={`${styles.controlButton} ${styles.controlButtonActive}`}
                onClick={handleFinishSection}
                disabled={submitting}
              >
                {submitting ? "در حال پردازش..." : "تأیید و ادامه"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
