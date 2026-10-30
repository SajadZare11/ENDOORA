"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/exam/exam.module.css";
import { Button } from "@endoora/ui";
import { useProctoring } from "@/lib/use-proctoring";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { ExamNavigation } from "@/components/exam/ExamNavigation";
import { ProctoringOverlay } from "@/components/exam/ProctoringOverlay";
import { ExamQuestionRenderer } from "@/components/exam/ExamQuestionRenderer";
import { ExamWatermark } from "@/components/exam/ExamWatermark";
import {
  getExamByAccessCode,
  saveExamAnswer,
  submitExamAttempt,
  type StudentExamView,
  type ExamQuestionItem,
} from "@/lib/online-exams";

// Fisher-Yates array shuffling
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

  // Load exam, apply Fisher-Yates shuffling, restore answers from localStorage
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const examData = await getExamByAccessCode(accessCode);

        // Get submission ID from session storage
        const savedSubId =
          typeof window !== "undefined"
            ? window.sessionStorage.getItem(`exam_sub_${examData.id}`)
            : null;

        if (!savedSubId) {
          // If no active submission, redirect back to lobby
          router.push(`/exam/${accessCode}`);
          return;
        }

        setSubmissionId(savedSubId);

        let processedQuestions = [...(examData.questions || [])];

        // 6. Question Shuffling (Fisher-Yates with session persistence)
        const shouldShuffleQuestions =
          (examData as unknown as { shuffle_questions?: boolean }).shuffle_questions ?? true;

        if (shouldShuffleQuestions) {
          const cachedOrder =
            typeof window !== "undefined"
              ? window.sessionStorage.getItem(`exam_${examData.id}_q_order`)
              : null;

          if (cachedOrder) {
            try {
              const orderIds = JSON.parse(cachedOrder) as string[];
              const map = new Map(processedQuestions.map((q) => [q.id, q]));
              const ordered = orderIds.map((id) => map.get(id)).filter(Boolean) as ExamQuestionItem[];
              if (ordered.length === processedQuestions.length) {
                processedQuestions = ordered;
              } else {
                processedQuestions = shuffleArray(processedQuestions);
                window.sessionStorage.setItem(
                  `exam_${examData.id}_q_order`,
                  JSON.stringify(processedQuestions.map((q) => q.id))
                );
              }
            } catch {
              processedQuestions = shuffleArray(processedQuestions);
            }
          } else {
            processedQuestions = shuffleArray(processedQuestions);
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(
                `exam_${examData.id}_q_order`,
                JSON.stringify(processedQuestions.map((q) => q.id))
              );
            }
          }
        }

        // 6. Choices / Options Shuffling (Fisher-Yates)
        const shouldShuffleChoices =
          (examData as unknown as { shuffle_choices?: boolean }).shuffle_choices ?? true;

        if (shouldShuffleChoices) {
          processedQuestions = processedQuestions.map((q) => {
            const payload = q.learner_payload as { options?: unknown[] } | undefined;
            if (payload && Array.isArray(payload.options)) {
              const cachedOptionsKey = `exam_${examData.id}_q_${q.id}_opts`;
              const cachedOptions =
                typeof window !== "undefined" ? window.sessionStorage.getItem(cachedOptionsKey) : null;
              let shuffledOptions = payload.options;
              if (cachedOptions) {
                try {
                  shuffledOptions = JSON.parse(cachedOptions) as unknown[];
                } catch {
                  shuffledOptions = shuffleArray(payload.options);
                }
              } else {
                shuffledOptions = shuffleArray(payload.options);
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem(cachedOptionsKey, JSON.stringify(shuffledOptions));
                }
              }
              return {
                ...q,
                learner_payload: {
                  ...payload,
                  options: shuffledOptions,
                },
              };
            }
            return q;
          });
        }

        setExam({
          ...examData,
          questions: processedQuestions,
        });

        // 8. Auto-Save Resilience: Restore answers from localStorage
        const LOCAL_STORAGE_KEY = `exam_${examData.id}_answers`;
        const cachedLocalAnswers =
          typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null;

        if (cachedLocalAnswers) {
          try {
            const parsed = JSON.parse(cachedLocalAnswers) as Record<string, Record<string, unknown>>;
            if (parsed && typeof parsed === "object") {
              setAnswers(parsed);
            }
          } catch (err) {
            console.warn("Failed to parse cached answers:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load exam runner:", err);
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [accessCode, router]);

  // Clean local answer caches
  const clearLocalCaches = useCallback((examId: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`exam_${examId}_answers`);
      window.sessionStorage.removeItem(`exam_sub_${examId}`);
      window.sessionStorage.removeItem(`exam_${examId}_q_order`);
    }
  }, []);

  // 9. Forced Auto-Submit without user confirmation (Timer 0 or violations threshold)
  const handleForceAutoSubmit = useCallback(
    async (reason: string) => {
      if (!exam || !submissionId || submitting) return;

      try {
        setSubmitting(true);
        clearLocalCaches(exam.id);
        await submitExamAttempt(exam.id, submissionId);
        router.push(`/exam/${accessCode}/results?forced=1&reason=${encodeURIComponent(reason)}`);
      } catch {
        router.push(`/exam/${accessCode}/results`);
      }
    },
    [exam, submissionId, submitting, clearLocalCaches, accessCode, router]
  );

  // Manual final submission
  const handleSubmitExam = useCallback(async () => {
    if (!exam || !submissionId || submitting) return;

    const confirmed = window.confirm("آیا از پایان و ثبت نهایی آزمون اطمینان دارید؟");
    if (!confirmed) return;

    try {
      setSubmitting(true);
      clearLocalCaches(exam.id);
      await submitExamAttempt(exam.id, submissionId);
      router.push(`/exam/${accessCode}/results`);
    } catch {
      alert("خطا در ثبت نهایی آزمون.");
      setSubmitting(false);
    }
  }, [exam, submissionId, submitting, clearLocalCaches, accessCode, router]);

  // Anti-Cheat Hook
  const proctoring = useProctoring({
    examId: exam?.id || "",
    submissionId: submissionId || "",
    config: exam?.anti_cheat_config || {
      enforce_fullscreen: false,
      block_clipboard: false,
      block_devtools: false,
      max_blur_events: 3,
      max_fullscreen_exits: 3,
      auto_submit_on_violation: true,
      violation_threshold: 3,
    },
    enabled: Boolean(exam && submissionId),
    onViolationThresholdReached: () => {
      void handleForceAutoSubmit("تخلف امنیتی مکرر و عبور از سقف مجاز اخطارها");
    },
  });

  // 8. Auto-save answer to local state, localStorage, and backend
  const currentQuestion = exam?.questions?.[currentIndex];

  const handleResponseChange = (newResp: Record<string, unknown>) => {
    if (!currentQuestion || !exam) return;

    const qId = currentQuestion.id;

    // 1. Update state & immediate localStorage save
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [qId]: newResp,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`exam_${exam.id}_answers`, JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Persist to backend
    if (submissionId) {
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
        در حال آماده‌سازی محیط امن آزمون...
      </div>
    );
  }

  const answeredIndices = new Set<number>();
  exam.questions.forEach((q, idx) => {
    if (answers[q.id] && Object.keys(answers[q.id]).length > 0) {
      answeredIndices.add(idx);
    }
  });

  const isSequential = Boolean(exam.anti_cheat_config?.sequential_navigation);
  const watermarkEnabled = exam.anti_cheat_config?.watermark_enabled !== false;

  return (
    <div
      className={styles.examContainer}
      dir="rtl"
      onContextMenu={(e) => {
        if (exam.anti_cheat_config?.block_clipboard || exam.anti_cheat_config?.block_devtools) {
          e.preventDefault();
        }
      }}
      style={{
        userSelect: exam.anti_cheat_config?.block_clipboard ? "none" : "auto",
        WebkitUserSelect: exam.anti_cheat_config?.block_clipboard ? "none" : "auto",
        position: "relative",
      }}
    >
      {/* 5. Anti-Leak Floating Watermark */}
      {watermarkEnabled && (
        <ExamWatermark
          candidateName="داوطلب آزمون"
          candidateId={accessCode}
          examTitle={exam.title}
          organization="سامانه اندورا"
        />
      )}

      {/* 1 & 2. Anti-Cheat Fullscreen & Warning Strike Overlay */}
      <ProctoringOverlay
        warningMessage={proctoring.activeWarning}
        violationWarning={proctoring.activeViolationWarning}
        isFullscreen={proctoring.isFullscreen}
        enforceFullscreen={Boolean(exam.anti_cheat_config?.enforce_fullscreen)}
        onRequestFullscreen={proctoring.requestFullscreen}
        onDismissWarning={proctoring.dismissActiveWarning}
        violationsCount={proctoring.violationsCount}
      />

      {/* Top Header Bar */}
      <header className={styles.examHeader}>
        <div className={styles.examTitleWrap}>
          <h1 className={styles.examTitle}>{exam.title}</h1>
          <p className={styles.examSubtitle}>
            سوال {currentIndex + 1} از {exam.questions.length}
            {lastSaved && ` (آخرین ذخیره خودکار: ${lastSaved})`}
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

          {/* 9. Countdown Timer & Forced Auto-Submit */}
          <ExamTimer
            initialSeconds={exam.duration_minutes * 60}
            onTimeExpired={() => {
              void handleForceAutoSubmit("پایان مهلت زمانی قانونی آزمون");
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
            {/* 7. Sequential Navigation: disable going back if linear navigation is active */}
            <Button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0 || isSequential}
              style={{
                background: isSequential ? "#f8fafc" : "#f1f5f9",
                color: isSequential ? "#94a3b8" : "#475569",
                cursor: isSequential ? "not-allowed" : "pointer",
              }}
            >
              {isSequential ? "🔒 بازگشت قفل است (ناوبری یک‌طرفه)" : "← سوال قبلی"}
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
            sequentialNavigation={isSequential}
          />
        </div>
      </div>
    </div>
  );
}
