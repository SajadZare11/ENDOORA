"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../grading.module.css";
import { useTeacherHome } from "../../../../../components/teacher/TeacherShell";
import {
  fetchSubmissionGradingDetail,
  submitAttemptGrading,
  sendFeedbackMessage,
  type SubmissionGradingDetail,
} from "../../../../../lib/teacher-gradebook";

export default function TeacherGradingStudioPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";
  const params = useParams();
  const attemptId = params.attemptId as string;

  const [detail, setDetail] = useState<SubmissionGradingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [questionComments, setQuestionComments] = useState<Record<string, string>>({});
  const [overallFeedback, setOverallFeedback] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [rubricScores, setRubricScores] = useState<Record<string, { score: number; max: number; comment?: string }>>({
    accuracy: { score: 8, max: 10, comment: "" },
    task_achievement: { score: 9, max: 10, comment: "" },
    vocabulary: { score: 8, max: 10, comment: "" },
  });

  // Message chat state
  const [newMessage, setNewMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchSubmissionGradingDetail(attemptId);
        setDetail(data);

        // Prepopulate scores
        const qScores: Record<string, number> = {};
        const qComms: Record<string, string> = {};
        data.questions.forEach((q) => {
          qScores[q.question_version_id] = q.score_awarded;
          qComms[q.question_version_id] = q.teacher_comment || "";
        });
        setQuestionScores(qScores);
        setQuestionComments(qComms);
        setOverallFeedback(data.teacher_feedback || "");
        setRevisionNotes(data.revision_notes || "");
        if (data.rubric_scores && Object.keys(data.rubric_scores).length > 0) {
          setRubricScores(data.rubric_scores);
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load submission details.");
      } finally {
        setLoading(false);
      }
    }
    if (attemptId) void load();
  }, [attemptId]);

  const handleQuestionScoreChange = (vId: string, val: string) => {
    const num = parseFloat(val);
    setQuestionScores((prev) => ({ ...prev, [vId]: isNaN(num) ? 0 : num }));
  };

  const handleQuestionCommentChange = (vId: string, val: string) => {
    setQuestionComments((prev) => ({ ...prev, [vId]: val }));
  };

  const calculatedTotal = Object.values(questionScores).reduce((a, b) => a + b, 0);

  const handleSubmitGrade = async (action: "return_grade" | "request_revision") => {
    if (!detail) return;
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const qGradesPayload: Record<string, { score: number; comment?: string }> = {};
      detail.questions.forEach((q) => {
        const vId = q.question_version_id;
        qGradesPayload[vId] = {
          score: questionScores[vId] ?? 0,
          comment: questionComments[vId] || "",
        };
      });

      await submitAttemptGrading(attemptId, {
        score_awarded: calculatedTotal,
        question_grades: qGradesPayload,
        rubric_scores: rubricScores,
        teacher_feedback: overallFeedback,
        action,
        revision_notes: revisionNotes,
      });

      setSuccessMsg(
        action === "request_revision"
          ? (isFa ? "درخواست بازنگری برای زبان‌آموز ارسال شد." : "Revision requested successfully.")
          : (isFa ? "نمرات و بازخورد با موفقیت ثبت و ارسال شدند." : "Grading and feedback submitted successfully.")
      );

      // Refresh data
      const updated = await fetchSubmissionGradingDetail(attemptId);
      setDetail(updated);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving grades.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !detail) return;

    try {
      await sendFeedbackMessage(attemptId, newMessage, isInternalNote);
      setNewMessage("");
      setIsInternalNote(false);
      const updated = await fetchSubmissionGradingDetail(attemptId);
      setDetail(updated);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to post message.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "var(--space-8)" }}>
        {isFa ? "در حال آماده‌سازی استودیوی تصحیح..." : "Loading grading studio..."}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "var(--space-4)", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)" }}>
          {errorMsg || (isFa ? "تلاش یافت نشد." : "Submission attempt not found.")}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Top Breadcrumb Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/teacher/grading" className={styles.actionButtonSecondary}>
          {isFa ? "← بازگشت به صف تصحیح" : "← Back to Submissions Queue"}
        </Link>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Link href={`/teacher/classes/${detail.assignment.class_id}/gradebook`} className={styles.actionButtonSecondary}>
            {isFa ? "کارنامه کلاس" : "Class Gradebook"}
          </Link>
        </div>
      </div>

      {/* Student & Attempt Meta Header */}
      <section className={styles.studioHeader}>
        <div className={styles.studentMeta}>
          <div className={styles.avatar}>
            {detail.learner.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.title} style={{ fontSize: "var(--font-size-xl)" }}>
              {detail.learner.name}
            </h1>
            <p className={styles.subtitle}>
              {detail.learner.email} | {detail.assignment.title} ({detail.assignment.class_title})
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              {isFa ? "نمره کل:" : "Total Score:"}
            </span>
            <div style={{ fontSize: "var(--font-size-xl)", fontWeight: 800, color: "var(--color-primary-600)" }}>
              {calculatedTotal.toFixed(2)} / {detail.total_points}
            </div>
          </div>
          <div>
            <span className={styles.badge} style={{ background: "var(--color-bg-muted)", color: "var(--color-text-primary)" }}>
              {isFa ? `تلاش شماره ${detail.attempt_number}` : `Attempt #${detail.attempt_number}`}
            </span>
          </div>
          {detail.is_late && (
            <span className={`${styles.badge} ${styles.badgeLate}`}>
              {isFa ? "با تاخیر" : "Late"}
            </span>
          )}
        </div>
      </section>

      {errorMsg && (
        <div style={{ padding: "var(--space-3)", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)", borderRadius: "var(--radius-sm)" }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "var(--space-3)", background: "var(--color-success-subtle)", color: "var(--color-success-dark)", borderRadius: "var(--radius-sm)" }}>
          {successMsg}
        </div>
      )}

      {/* Main Studio Grid */}
      <div className={styles.studioGrid}>
        {/* Left Column: Question-by-Question Grading */}
        <div className={styles.questionsCol}>
          {detail.questions.map((q, idx) => {
            const vId = q.question_version_id;
            return (
              <article key={vId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    {isFa ? `سوال ${idx + 1}: ${q.title}` : `Question ${idx + 1}: ${q.title}`}
                  </h2>
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                    <span className={styles.badge} style={{ background: "var(--color-bg-muted)" }}>
                      {q.cefr_level} | {q.question_type}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}>
                      {isFa ? `حداکثر ${q.points} نمره` : `Max ${q.points} pts`}
                    </span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
                    {isFa ? "متن سوال:" : "Question Prompt:"}
                  </div>
                  <div style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-primary)", marginBlock: "var(--space-1)" }}>
                    {q.prompt}
                  </div>
                </div>

                {/* Learner's Submitted Answer */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                    {isFa ? "پاسخ ثبت‌شده زبان‌آموز:" : "Learner's Submitted Answer:"}
                  </div>
                  <div className={styles.answerBox}>
                    {q.learner_answer ? (
                      typeof q.learner_answer === "object" ? (
                        JSON.stringify(q.learner_answer)
                      ) : (
                        String(q.learner_answer)
                      )
                    ) : (
                      <em style={{ color: "var(--color-danger-600)" }}>
                        {isFa ? "پاسخی داده نشده است." : "No answer provided."}
                      </em>
                    )}
                  </div>
                </div>

                {/* Reference Solution / Solution Key (Teacher View) */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--font-size-xs)", color: "var(--color-success-dark)" }}>
                    {isFa ? "پاسخ کلیدی و راهنمای تصحیح مدرس:" : "Reference Solution & Rubric:"}
                  </div>
                  <div className={styles.solutionBox}>
                    {q.reference_solution.correct_option && (
                      <div><strong>{isFa ? "گزینه صحیح:" : "Correct Option:"}</strong> {q.reference_solution.correct_option}</div>
                    )}
                    {q.reference_solution.answer_key && (
                      <div><strong>{isFa ? "کلید پاسخ:" : "Answer Key:"}</strong> {JSON.stringify(q.reference_solution.answer_key)}</div>
                    )}
                    {q.reference_solution.explanation && (
                      <div style={{ marginBlockStart: "var(--space-1)" }}>
                        <strong>{isFa ? "توضیح آموزشی:" : "Explanation:"}</strong> {q.reference_solution.explanation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Scoring Input & Comment */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-3)", marginBlockStart: "var(--space-2)" }}>
                  <div>
                    <label className={styles.formLabel}>
                      {isFa ? `نمره اختصاصی (حداکثر ${q.points}):` : `Awarded Score (Max ${q.points}):`}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={q.points}
                      className={styles.formInput}
                      value={questionScores[vId] ?? 0}
                      onChange={(e) => handleQuestionScoreChange(vId, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>
                      {isFa ? "بازخورد تفکیکی برای این سوال:" : "Question-Specific Feedback:"}
                    </label>
                    <input
                      type="text"
                      placeholder={isFa ? "مثال: رعایت گرامر عالی، اما به زمان فعل دقت شود." : "e.g. Accurate choice, watch verb tense."}
                      className={styles.formInput}
                      value={questionComments[vId] || ""}
                      onChange={(e) => handleQuestionCommentChange(vId, e.target.value)}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Column: Overall Evaluation & Feedback Loop */}
        <div className={styles.sidebarCol}>
          {/* Rubric Assessment Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isFa ? "معیارهای ارزیابی روبریم" : "Rubric Assessment"}</h2>
            {Object.entries(rubricScores).map(([crit, data]) => (
              <div key={crit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)" }}>
                  <strong style={{ textTransform: "capitalize" }}>{crit.replace("_", " ")}</strong>
                  <span>{data.score} / {data.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={data.max}
                  value={data.score}
                  onChange={(e) => {
                    const sc = parseInt(e.target.value, 10);
                    setRubricScores((prev) => ({
                      ...prev,
                      [crit]: { ...prev[crit], score: sc },
                    }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Overall Qualitative Feedback Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isFa ? "بازخورد کیفی کلی مدرس" : "Qualitative Feedback"}</h2>
            <textarea
              className={styles.formTextarea}
              placeholder={isFa ? "توصیه‌های کلی، نقاط قوت و زمینه‌های بهبود زبان‌آموز..." : "Comprehensive comments on learner performance..."}
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
            />

            {/* Revision Request Field */}
            <div style={{ marginBlockStart: "var(--space-2)" }}>
              <label className={styles.formLabel}>
                {isFa ? "دستورالعمل بازنگری (در صورت نیاز):" : "Revision Instructions (Optional):"}
              </label>
              <textarea
                className={styles.formTextarea}
                style={{ minHeight: "60px" }}
                placeholder={isFa ? "موارد نیازمند اصلاح توسط زبان‌آموز..." : "Specific items the learner needs to revise..."}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBlockStart: "var(--space-3)" }}>
              <button
                type="button"
                className={styles.actionButton}
                disabled={submitting}
                onClick={() => handleSubmitGrade("return_grade")}
              >
                {submitting ? (isFa ? "در حال ثبت..." : "Saving...") : (isFa ? "ثبت نمره نهایی و ارسال بازخورد" : "Finalize Grade & Return")}
              </button>
              <button
                type="button"
                className={styles.actionButtonSecondary}
                disabled={submitting}
                onClick={() => handleSubmitGrade("request_revision")}
              >
                {isFa ? "درخواست بازنگری از زبان‌آموز" : "Request Revision from Learner"}
              </button>
            </div>
          </div>

          {/* Learner Reflection Card */}
          {detail.learner_reflection && (
            <div className={styles.card} style={{ background: "var(--color-info-subtle)" }}>
              <h2 className={styles.cardTitle} style={{ color: "var(--color-info-dark)" }}>
                {isFa ? "خودبازتابی و یادداشت زبان‌آموز" : "Learner Reflection"}
              </h2>
              <p style={{ margin: 0, fontSize: "var(--font-size-sm)" }}>
                {detail.learner_reflection}
              </p>
              {detail.learner_acknowledged_at && (
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBlockStart: "var(--space-1)" }}>
                  {isFa ? "تایید شده در:" : "Acknowledged on:"} {new Date(detail.learner_acknowledged_at).toLocaleString(isFa ? "fa-IR" : "en-US")}
                </div>
              )}
            </div>
          )}

          {/* Feedback Messages Loop Thread */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isFa ? "گفتگو و حلقه بازخورد" : "Feedback Discussion Loop"}</h2>
            <div className={styles.feedbackMessagesList}>
              {detail.feedback_messages.length === 0 ? (
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  {isFa ? "هنوز پیامی در این گفتگو ثبت نشده است." : "No messages in this discussion yet."}
                </p>
              ) : (
                detail.feedback_messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageBubble} ${
                      msg.is_internal_note
                        ? styles.messageInternal
                        : msg.author_email === detail.learner.email
                        ? styles.messageLearner
                        : styles.messageTeacher
                    }`}
                  >
                    <div style={{ fontWeight: 700, marginBlockEnd: "0.25rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{msg.author_name} {msg.is_internal_note && (isFa ? "(یادداشت خصوصی مدرس)" : "(Private Note)")}</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                        {new Date(msg.created_at).toLocaleTimeString(isFa ? "fa-IR" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div>{msg.message}</div>
                  </div>
                ))
              )}
            </div>

            {/* Post Message Form */}
            <form onSubmit={handleSendMessage} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBlockStart: "var(--space-2)" }}>
              <textarea
                className={styles.formTextarea}
                style={{ minHeight: "60px" }}
                placeholder={isFa ? "ارسال پیام در این گفتگو..." : "Send a message or reply..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--font-size-xs)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                  />
                  {isFa ? "یادداشت خصوصی (پنهان از زبان‌آموز)" : "Internal Note (Hidden from learner)"}
                </label>
                <button type="submit" className={styles.actionButton} style={{ paddingBlock: "0.25rem" }}>
                  {isFa ? "ارسال پیام" : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
