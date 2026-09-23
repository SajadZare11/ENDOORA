"use client";

import React, { useEffect, useState, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/exam/exam.module.css";
import { Button } from "@endoora/ui";
import { useProctoring } from "@/lib/use-proctoring";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { ExamNavigation } from "@/components/exam/ExamNavigation";
import { ProctoringOverlay } from "@/components/exam/ProctoringOverlay";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import {
  getExamByAccessCode,
  saveExamAnswer,
  submitExamAttempt,
  type StudentExamView,
} from "@/lib/online-exams";

export default function ExamRunnerPage({ params }: { params: Promise<{ accessCode: string }> }) {
  const resolvedParams = use(params);
  const accessCode = resolvedParams.accessCode;
  const router = useRouter();

  const [exam, setExam] = useState<StudentExamView | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load exam and submission
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const examData = await getExamByAccessCode(accessCode);
        setExam(examData);

        // Get submission ID from session storage
        const savedSubId =
          typeof window !== "undefined"
            ? window.sessionStorage.getItem(`exam_sub_${examData.id}`)
            : null;

        if (savedSubId) {
          setSubmissionId(savedSubId);
        } else {
          // If no active submission, redirect back to lobby
          router.push(`/exam/${accessCode}`);
        }
      } catch (err) {
        console.error("Failed to load exam runner:", err);
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [accessCode, router]);

  // Handle final submission
  const handleSubmitExam = useCallback(async () => {
    if (!exam || !submissionId || submitting) return;

    const confirmed = window.confirm("آیا از پایان و ثبت نهایی آزمون اطمینان دارید؟");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      await submitExamAttempt(exam.id, submissionId);
      router.push(`/exam/${accessCode}/results`);
    } catch (err) {
      alert("خطا در ثبت نهایی آزمون.");
      setSubmitting(false);
    }
  }, [exam, submissionId, submitting, accessCode, router]);

  // Anti-Cheat Hook
  const proctoring = useProctoring({
    examId: exam?.id || "",
    submissionId: submissionId || "",
    config: exam?.anti_cheat_config || {
      enforce_fullscreen: false,
      block_clipboard: false,
      block_devtools: false,
      max_blur_events: 5,
      max_fullscreen_exits: 3,
      auto_submit_on_violation: false,
      violation_threshold: 5,
    },
    enabled: Boolean(exam && submissionId),
    onViolationThresholdReached: () => {
      alert("تعداد تخلفات از سقف مجاز عبور کرد. آزمون به صورت خودکار ارسال می‌شود.");
      void handleSubmitExam();
    },
  });

  // Auto-save current answer
  const currentQuestion = exam?.questions?.[currentIndex];

  const handleResponseChange = (newResp: Record<string, unknown>) => {
    if (!currentQuestion) return;

    const qId = currentQuestion.id;
    setAnswers((prev) => ({
      ...prev,
      [qId]: newResp,
    }));

    // Trigger save to backend
    if (exam && submissionId) {
      void saveExamAnswer(exam.id, submissionId, {
        exam_question_id: qId,
        student_response: newResp,
      }).then(() => {
        setLastSaved(new Date().toLocaleTimeString("fa-IR"));
      });
    }
  };

  if (loading || !exam || !submissionId) {
    return (
      <div className={styles.examContainer} style={{ textAlign: "center", padding: "5rem" }}>
        در حال آماده‌سازی محیط آزمون...
      </div>
    );
  }

  const answeredIndices = new Set<number>();
  exam.questions.forEach((q, idx) => {
    if (answers[q.id] && Object.keys(answers[q.id]).length > 0) {
      answeredIndices.add(idx);
    }
  });

  return (
    <div className={styles.examContainer} dir="rtl">
      {/* Anti-Cheat Fullscreen & Warning Overlay */}
      <ProctoringOverlay
        warningMessage={proctoring.activeWarning}
        isFullscreen={proctoring.isFullscreen}
        enforceFullscreen={Boolean(exam.anti_cheat_config?.enforce_fullscreen)}
        onRequestFullscreen={proctoring.requestFullscreen}
        violationsCount={proctoring.violationsCount}
      />

      {/* Top Header Bar */}
      <header className={styles.examHeader}>
        <div className={styles.examTitleWrap}>
          <h1 className={styles.examTitle}>{exam.title}</h1>
          <p className={styles.examSubtitle}>
            سوال {currentIndex + 1} از {exam.questions.length}
            {lastSaved && ` (آخرین ذخیره: ${lastSaved})`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Integrity Live Badge */}
          <span
            style={{
              padding: "0.4rem 0.75rem",
              background: "#f1f5f9",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: proctoring.estimatedIntegrity < 70 ? "#b91c1c" : "#0f172a",
            }}
          >
            🛡️ امنیت آزمون: {proctoring.estimatedIntegrity}%
          </span>

          {/* Countdown Timer */}
          <ExamTimer
            initialSeconds={exam.duration_minutes * 60}
            onTimeExpired={() => {
              alert("مهلت زمانی آزمون به پایان رسید.");
              void handleSubmitExam();
            }}
          />
        </div>
      </header>

      {/* Main Layout: Question + Sidebar Navigation */}
      <div className={styles.examLayout}>
        <div>
          {currentQuestion && (
            <ExamQuestionRenderer
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={exam.questions.length}
              response={answers[currentQuestion.id]}
              onResponseChange={handleResponseChange}
            />
          )}

          {/* Bottom Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
            <Button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              style={{ background: "#f1f5f9", color: "#475569" }}
            >
              ← سوال قبلی
            </Button>

            {currentIndex < exam.questions.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
                style={{ background: "#4f46e5", color: "#ffffff", fontWeight: 700 }}
              >
                سوال بعدی →
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitExam}
                disabled={submitting}
                style={{ background: "#10b981", color: "#ffffff", fontWeight: 800 }}
              >
                {submitting ? "در حال ارسال..." : "اتمام و ثبت نهایی آزمون ✔"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <ExamNavigation
            totalQuestions={exam.questions.length}
            currentIndex={currentIndex}
            answeredIndices={answeredIndices}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            onSubmitExam={handleSubmitExam}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
