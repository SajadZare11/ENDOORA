"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import styles from "../../../online-exams.module.css";
import { Button } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import { IntegrityBadge } from "@/components/exam/IntegrityBadge";
import {
  getExamSubmissionDetail,
  updateAnswerGrade,
  type ExamSubmissionDetail,
} from "@/lib/online-exams";

export default function TeacherSubmissionGradingPage({
  params,
}: {
  params: Promise<{ examId: string; submissionId: string }>;
}) {
  const resolvedParams = use(params);
  const { examId, submissionId } = resolvedParams;

  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [submission, setSubmission] = useState<ExamSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingAnswerId, setSavingAnswerId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getExamSubmissionDetail(examId, submissionId);
        setSubmission(data);

        // Populate local state
        const initialScores: Record<string, number> = {};
        const initialFeedbacks: Record<string, string> = {};
        data.answers?.forEach((ans) => {
          initialScores[ans.id] = Number(ans.manual_score ?? ans.score_awarded ?? 0);
          initialFeedbacks[ans.id] = ans.teacher_feedback || "";
        });
        setScores(initialScores);
        setFeedbacks(initialFeedbacks);
      } catch (err) {
        console.error("Failed to load submission:", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [examId, submissionId]);

  const handleSaveGrade = async (answerId: string) => {
    try {
      setSavingAnswerId(answerId);
      const score = scores[answerId] ?? 0;
      const feedback = feedbacks[answerId] ?? "";

      await updateAnswerGrade(examId, submissionId, answerId, {
        manual_score: score,
        teacher_feedback: feedback,
      });

      alert("نمره و بازخورد با موفقیت ثبت شد.");
    } catch {
      alert("خطا در ثبت نمره.");
    } finally {
      setSavingAnswerId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "4rem" }}>
        در حال بارگیری پاسخ‌نامه و کارتابل تصحیح...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className={styles.container}>
        <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "1.5rem", borderRadius: "1rem" }}>
          پاسخ‌نامه مورد نظر یافت نشد.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      <div style={{ marginBottom: "1rem" }}>
        <Link href={`/teacher/online-exams/${examId}`} style={{ color: "#64748b", textDecoration: "none", fontSize: "0.875rem" }}>
          ← بازگشت به صفحه آزمون
        </Link>
      </div>

      {/* Submission Header Card */}
      <div className={styles.tableCard} style={{ padding: "1.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className={styles.title} style={{ fontSize: "1.5rem", margin: "0 0 0.25rem 0" }}>
              کارتابل ارزیابی پاسخ‌نامه: {submission.student.email}
            </h1>
            <p className={styles.subtitle}>
              تلاش #{submission.attempt_number} | شروع: {new Date(submission.started_at).toLocaleTimeString("fa-IR")}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <IntegrityBadge score={submission.integrity_score ? Number(submission.integrity_score) : null} showDetails />
            <div style={{ padding: "0.5rem 1rem", background: "#f8fafc", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}>
              <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>نمره کل: </span>
              <strong style={{ fontSize: "1.125rem" }}>
                {submission.total_score !== null ? submission.total_score : "در انتظار تصحیح"} / {submission.max_possible_score}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Grading List */}
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem" }}>
        پاسخ‌های ثبت‌شده و ارزیابی تفکیکی
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {submission.answers?.map((ans, idx) => {
          const resp = ans.student_response || {};
          const isSpeaking = ans.question_type === "speaking" || ans.audio_recording_url;
          const isWriting = ans.question_type === "long_writing";

          return (
            <div key={ans.id} className={styles.tableCard} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>سوال {idx + 1}</span>
                  <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 700 }}>
                    {ans.question_type || "آیتم آزمون"}
                  </span>
                  {ans.is_auto_graded && (
                    <span style={{ background: "#ecfdf5", color: "#065f46", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 700 }}>
                      ✓ تصحیح خودکار
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                  بارم: {ans.question_points || 10} نمره
                </div>
              </div>

              {/* Student Response Display */}
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  پاسخ زبان‌آموز:
                </div>

                {isSpeaking && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "0.875rem" }}>🎙️ فایل صوتی ضبط‌شده زبان‌آموز:</p>
                    {ans.audio_recording_url ? (
                      <audio src={ans.audio_recording_url} controls style={{ width: "100%", maxWidth: "420px" }} />
                    ) : (
                      <span style={{ color: "#d97706", fontSize: "0.875rem" }}>
                        صدا ضبط شده و در وضعیت پردازش سرور قرار دارد.
                      </span>
                    )}
                  </div>
                )}

                {isWriting && (
                  <div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: "0.9375rem", lineHeight: 1.7, background: "#ffffff", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}>
                      {String(resp.text || "بدون پاسخ متن")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
                      تعداد کلمات: {String(resp.text || "").split(/\s+/).filter(Boolean).length} کلمه
                    </div>
                  </div>
                )}

                {!isSpeaking && !isWriting && (
                  <pre style={{ margin: 0, fontSize: "0.875rem", fontFamily: "inherit", whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(resp, null, 2)}
                  </pre>
                )}
              </div>

              {/* Grading Input & Feedback Controls */}
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: "1rem", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.35rem" }}>
                    نمره اعطایی (از {ans.question_points || 10}):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={Number(ans.question_points || 10)}
                    step="0.5"
                    value={scores[ans.id] ?? 0}
                    onChange={(e) =>
                      setScores({ ...scores, [ans.id]: Number(e.target.value) })
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.35rem" }}>
                    بازخورد کیفی مدرس برای زبان‌آموز:
                  </label>
                  <input
                    type="text"
                    placeholder="نکات قوت، اشکالات گرامری یا تلفظ..."
                    value={feedbacks[ans.id] || ""}
                    onChange={(e) =>
                      setFeedbacks({ ...feedbacks, [ans.id]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={() => handleSaveGrade(ans.id)}
                    disabled={savingAnswerId === ans.id}
                    style={{ background: "#4f46e5", color: "#ffffff", padding: "0.5rem 1.25rem", fontWeight: 700 }}
                  >
                    {savingAnswerId === ans.id ? "در حال ثبت..." : "ثبت نمره ✔"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
