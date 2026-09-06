"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../learner-assignments.module.css";
import {
  AssignmentAttempt,
  autosaveLearnerAttempt,
  LearnerAttemptPayload,
  startLearnerAttempt,
  submitLearnerAttempt,
} from "@/lib/teacher-assignments";
import { acknowledgeLearnerFeedback } from "@/lib/teacher-gradebook";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LearnerAttemptPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;

  const [attemptPayload, setAttemptPayload] = useState<LearnerAttemptPayload | null>(null);
  const [completedAttempt, setCompletedAttempt] = useState<AssignmentAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);

  // Timer state (remaining seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  // Initialize or resume attempt
  useEffect(() => {
    let cancelled = false;

    async function initAttempt() {
      setLoading(true);
      setError(null);
      try {
        const payload = await startLearnerAttempt(assignmentId);
        if (!cancelled) {
          setAttemptPayload(payload);
          // Populate existing answers from resumed attempt
          setAnswers(payload.answers_payload || {});

          // Setup timer if expires_at is present
          if (payload.time_limit_expires_at) {
            const expireDate = new Date(payload.time_limit_expires_at).getTime();
            const now = Date.now();
            const diffSec = Math.max(0, Math.floor((expireDate - now) / 1000));
            setRemainingSeconds(diffSec);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در شروع تکلیف یا پایان مهلت.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initAttempt();

    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  // Timer countdown effect
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  // Debounced Autosave Effect (R-029 resilience)
  useEffect(() => {
    if (!attemptPayload || attemptPayload.status !== "in_progress") return;
    if (Object.keys(answers).length === 0) return;

    const timer = setTimeout(async () => {
      try {
        const res = await autosaveLearnerAttempt(attemptPayload.attempt_id, answers);
        if (res.saved) {
          setLastSavedTime(new Date(res.updated_at).toLocaleTimeString("fa-IR"));
        }
      } catch {
        // fail silently on background autosave attempt
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [answers, attemptPayload]);

  const handleSelectOption = (questionVersionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionVersionId]: optionId,
    }));
  };

  const handleTextChange = (questionVersionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionVersionId]: text,
    }));
  };

  const handleSubmit = async () => {
    if (!attemptPayload) return;
    if (!window.confirm("آیا از ارسال نهایی پاسخ‌های خود اطمینان دارید؟ پس از ارسال، نمره شما محاسبه خواهد شد.")) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitLearnerAttempt(attemptPayload.attempt_id, answers);
      setCompletedAttempt(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ثبت نهایی آزمون.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAcknowledge = async () => {
    if (!completedAttempt) return;
    setIsAcknowledging(true);
    try {
      await acknowledgeLearnerFeedback(completedAttempt.id, reflectionText);
      setReflectionSubmitted(true);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در ثبت تایید و خودارزیابی");
    } finally {
      setIsAcknowledging(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <div className={styles.emptyState}>
            <p style={{ color: "var(--color-muted)" }}>در حال آماده‌سازی سوالات تکلیف...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !attemptPayload && !completedAttempt) {
    return (
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <h1 className={styles.title}>امکان ورود به آزمون وجود ندارد</h1>
          <p className={styles.description} style={{ color: "var(--color-feedback-error)" }}>
            {error}
          </p>
          <div style={{ marginBlockStart: "var(--space-4)" }}>
            <Link href="/assignments" className={styles.secondaryButton} style={{ inlineSize: "auto" }}>
              ← بازگشت به لیست تکالیف
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submitted / Graded Result View
  if (completedAttempt) {
    return (
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <h1 className={styles.title}>نتیجه آزمون: {completedAttempt.assignment_title}</h1>
          <p className={styles.description}>
            پاسخ‌های شما با موفقیت ثبت و تصحیح شد.
          </p>
        </div>

        <div className={styles.contentCard}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
            <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)" }}>
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>نمره کسب شده</span>
              <div style={{ fontSize: "var(--font-size-page-title)", fontWeight: 800, color: "var(--color-learning-teal)" }}>
                {Number(completedAttempt.score_awarded)}
              </div>
            </div>

            <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)" }}>
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>درصد نهایی</span>
              <div style={{ fontSize: "var(--font-size-page-title)", fontWeight: 800, color: "var(--color-endoora-blue)" }}>
                {completedAttempt.percentage !== null ? `${Math.round(Number(completedAttempt.percentage))}%` : "-"}
              </div>
            </div>

            <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)" }}>
              <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>وضعیت ثبت</span>
              <div style={{ fontSize: "var(--font-size-h3)", fontWeight: 700, marginBlockStart: "var(--space-1)" }}>
                {completedAttempt.is_late ? "ارسال با تاخیر" : "ثبت به‌موقع"}
              </div>
            </div>
          </div>

          {completedAttempt.feedback_status === "revision_requested" && (
            <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-warning, #f59e0b)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", marginBlockEnd: "var(--space-6)" }}>
              <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-warning, #f59e0b)" }}>
                درخواست ویرایش مجدد از سوی مدرس:
              </h4>
              <p style={{ margin: 0, fontSize: "var(--font-size-body)" }}>
                {completedAttempt.revision_notes || "مدرس درخواست بازنگری و ارسال مجدد داده است."}
              </p>
            </div>
          )}

          {completedAttempt.teacher_feedback && (
            <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-learning-teal)", borderRadius: "var(--radius-card)", marginBlockEnd: "var(--space-6)" }}>
              <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-learning-teal)" }}>
                بازخورد و یادداشت مدرس:
              </h4>
              <p style={{ margin: 0, fontSize: "var(--font-size-body)" }}>
                {completedAttempt.teacher_feedback}
              </p>
            </div>
          )}

          {completedAttempt.rubric_scores && Object.keys(completedAttempt.rubric_scores).length > 0 && (
            <div style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", marginBlockEnd: "var(--space-6)" }}>
              <h4 style={{ margin: "0 0 var(--space-3) 0", color: "var(--color-text)" }}>
                ارزیابی بر اساس معیارهای رابریک (Rubric):
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
                {Object.entries(completedAttempt.rubric_scores).map(([crit, pts]) => (
                  <div key={crit} style={{ padding: "var(--space-3)", background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>{crit}</div>
                    <div style={{ fontSize: "var(--font-size-h3)", fontWeight: 700, color: "var(--color-learning-teal)" }}>{pts} امتیاز</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", marginBlockEnd: "var(--space-6)", background: "var(--color-surface)" }}>
            <h4 style={{ margin: "0 0 var(--space-2) 0" }}>چرخه بازخورد و خودارزیابی زبان‌آموز</h4>
            {reflectionSubmitted || completedAttempt.learner_acknowledged_at ? (
              <div style={{ color: "var(--color-learning-teal)", fontWeight: 600 }}>
                ✓ شما بازخورد مدرس را مشاهده و تایید کردید.
                {completedAttempt.learner_reflection && (
                  <p style={{ marginBlockStart: "var(--space-2)", color: "var(--color-text)", fontWeight: 400 }}>
                    یادداشت خودارزیابی شما: {completedAttempt.learner_reflection}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "var(--font-size-body-sm)", color: "var(--color-muted)", marginBlockEnd: "var(--space-3)" }}>
                  بازخورد استاد را مرور کنید و در صورت تمایل، یادداشت خودارزیابی یا پیام خود را برای مدرس ثبت نمایید:
                </p>
                <textarea
                  className={styles.textInput}
                  style={{ minBlockSize: "80px", marginBlockEnd: "var(--space-3)", inlineSize: "100%" }}
                  placeholder="نکات یادگیری من، نقاط قوت و زمینه‌های بهبود..."
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAcknowledge}
                  disabled={isAcknowledging}
                  className={styles.primaryButton}
                  style={{ inlineSize: "auto" }}
                >
                  {isAcknowledging ? "در حال ثبت..." : "تایید بازخورد و ثبت خودارزیابی ✓"}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Link href="/assignments" className={styles.secondaryButton} style={{ inlineSize: "auto" }}>
              بازگشت به تکالیف
            </Link>
            <Link href="/grades" className={styles.primaryButton} style={{ inlineSize: "auto" }}>
              مشاهده کارنامه جامع (My Grades) ←
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!attemptPayload) return null;

  return (
    <div className={styles.container}>
      {/* Attempt Top Bar */}
      <div className={styles.headerCard}>
        <div className={styles.attemptHeader}>
          <div>
            <h1 className={styles.title}>{attemptPayload.assignment_title}</h1>
            <p className={styles.description}>
              تلاش شماره {attemptPayload.attempt_number} | تعداد {attemptPayload.questions.length} سوال
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            {lastSavedTime && (
              <span className={styles.autosaveIndicator}>
                ✓ ذخیره خودکار ({lastSavedTime})
              </span>
            )}

            {remainingSeconds !== null && (
              <div
                className={`${styles.timerBadge} ${
                  remainingSeconds < 300 ? styles.timerWarning : ""
                }`}
                title="زمان باقی‌مانده تا پایان آزمون"
              >
                <span>⏱</span>
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}
          </div>
        </div>

        {attemptPayload.instructions && (
          <div style={{ padding: "var(--space-3)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", fontSize: "var(--font-size-body-sm)" }}>
            <strong>راهنمای آزمون:</strong> {attemptPayload.instructions}
          </div>
        )}
      </div>

      {/* Questions Form */}
      <div className={styles.contentCard}>
        {error && (
          <div style={{ color: "var(--color-feedback-error)", marginBlockEnd: "var(--space-4)" }}>
            {error}
          </div>
        )}

        {attemptPayload.questions.map((q, index) => {
          const currentAnswer = answers[q.question_version_id];
          const isMcq = q.question_type === "mcq";
          const options = (q.learner_payload?.options as { id: string; text: string }[]) || [];

          return (
            <div key={q.assignment_question_id} className={styles.questionItemBox}>
              <div className={styles.questionTitleBar}>
                <span style={{ fontWeight: 700, color: "var(--color-endoora-blue)" }}>
                  سوال شماره {index + 1} ({q.points} نمره)
                </span>
                <span style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)" }}>
                  سطح {q.cefr_level}
                </span>
              </div>

              <h2 className={styles.questionPromptText}>{q.prompt_fa || q.prompt_en}</h2>
              {q.custom_instructions && (
                <p style={{ fontSize: "var(--font-size-caption)", color: "var(--color-muted)", margin: 0 }}>
                  نکته مدرس: {q.custom_instructions}
                </p>
              )}

              {/* MCQ Options Rendering */}
              {isMcq && options.length > 0 && (
                <div className={styles.optionsList}>
                  {options.map((opt) => {
                    const isSelected = currentAnswer === opt.id || currentAnswer === opt.text;
                    return (
                      <label
                        key={opt.id}
                        className={`${styles.optionLabel} ${isSelected ? styles.optionSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.question_version_id}`}
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.question_version_id, opt.id)}
                        />
                        <span>{opt.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Text Input for Gap Fill, Short Answer, etc. */}
              {!isMcq && (
                <div>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="پاسخ خود را اینجا تایپ کنید..."
                    value={(currentAnswer as string) || ""}
                    onChange={(e) => handleTextChange(q.question_version_id, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Footer Submission Actions */}
        <div className={styles.attemptFooter}>
          <Link href="/assignments" className={styles.secondaryButton} style={{ inlineSize: "auto" }}>
            خروج موقت (پیش‌نویس ذخیره می‌شود)
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.primaryButton}
            style={{ inlineSize: "auto", background: "var(--color-learning-teal)", color: "var(--color-surface)" }}
            disabled={submitting}
          >
            {submitting ? "در حال ارسال و تصحیح..." : "ثبت نهایی و دریافت نتیجه آزمون ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
