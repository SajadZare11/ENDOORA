"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./today.module.css";

interface TaskOption {
  id: string;
  text: string;
}

interface MissionTask {
  id: string;
  type: string;
  title_fa: string;
  title_en: string;
  instruction_fa: string;
  instruction_en: string;
  prompt_en: string;
  options: TaskOption[];
  completed: boolean;
  user_answer?: string;
  is_correct?: boolean;
  correct_option_id?: string;
  explanation_fa?: string;
  explanation_en?: string;
}

interface NextBestAction {
  id: string;
  href: string;
  title_fa: string;
  title_en: string;
  reason_fa: string;
  reason_en: string;
}

interface DailyMissionData {
  id: string;
  mission_date: string;
  status: "ready" | "in_progress" | "completed";
  title_fa: string;
  title_en: string;
  explanation_fa: string;
  explanation_en: string;
  target_skill: string;
  reason_fa: string;
  reason_en: string;
  current_task_index: number;
  total_tasks: number;
  completed_count: number;
  tasks: MissionTask[];
  next_best_action?: NextBestAction | null;
  srs_due_count?: number;
}

interface StepFeedback {
  task_id: string;
  is_correct: boolean;
  selected_option_id: string;
  correct_option_id: string;
  explanation_fa: string;
  explanation_en: string;
  mission_status: "ready" | "in_progress" | "completed";
  all_completed: boolean;
  next_task_index: number | null;
  next_best_action: NextBestAction | null;
}

export default function TodayPage() {
  const [locale, setLocale] = useState<"fa" | "en">("fa");
  const [mission, setMission] = useState<DailyMissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wireframe 2 view modes: "overview" -> "task" -> "complete"
  const [viewMode, setViewMode] = useState<"overview" | "task" | "complete">("overview");
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stepFeedback, setStepFeedback] = useState<StepFeedback | null>(null);

  useEffect(() => {
    async function loadMission() {
      try {
        const res = await fetch("/api/missions/today/", {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (res.ok) {
          const data: DailyMissionData = await res.json();
          setMission(data);
          if (data.status === "completed") {
            setViewMode("complete");
          } else {
            setActiveTaskIndex(data.current_task_index || 0);
          }
        } else if (res.status === 401) {
          setError("auth");
        } else {
          setError("load_failed");
        }
      } catch {
        setError("load_failed");
      } finally {
        setLoading(false);
      }
    }
    void loadMission();
  }, []);

  const handleStartMission = async () => {
    if (!mission) return;
    try {
      setSubmitting(true);
      if (mission.status === "ready") {
        await fetch("/api/missions/today/start/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }
      setActiveTaskIndex(mission.current_task_index || 0);
      setSelectedOption(null);
      setStepFeedback(null);
      setViewMode("task");
    } catch {
      setViewMode("task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitStep = async () => {
    if (!mission || !selectedOption) return;
    const currentTask = mission.tasks[activeTaskIndex];
    if (!currentTask) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/missions/today/submit-step/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          task_id: currentTask.id,
          selected_option_id: selectedOption,
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const feedback: StepFeedback = await res.json();
      setStepFeedback(feedback);

      setMission((prev) => {
        if (!prev) return prev;
        const updatedTasks = [...prev.tasks];
        updatedTasks[activeTaskIndex] = {
          ...updatedTasks[activeTaskIndex],
          completed: true,
          user_answer: selectedOption,
          is_correct: feedback.is_correct,
          correct_option_id: feedback.correct_option_id,
          explanation_fa: feedback.explanation_fa,
          explanation_en: feedback.explanation_en,
        };
        return {
          ...prev,
          status: feedback.mission_status,
          completed_count: prev.completed_count + 1,
          next_best_action: feedback.next_best_action ?? prev.next_best_action,
          tasks: updatedTasks,
        };
      });
    } catch {
      alert(
        locale === "fa"
          ? "ثبت پاسخ با خطا مواجه شد. اتصال خود را بررسی کرده و مجدداً تلاش کنید."
          : "Failed to submit answer. Please check your connection and retry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (!stepFeedback) return;

    if (stepFeedback.all_completed) {
      setViewMode("complete");
      return;
    }

    if (stepFeedback.next_task_index !== null) {
      setActiveTaskIndex(stepFeedback.next_task_index);
      setSelectedOption(null);
      setStepFeedback(null);
    }
  };

  const handleResetMission = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/missions/today/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setMission(data);
        setActiveTaskIndex(0);
        setSelectedOption(null);
        setStepFeedback(null);
        setViewMode("overview");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFa = locale === "fa";

  const errorMessage =
    error === "auth"
      ? isFa
        ? "برای دسترسی به ماموریت امروز، لطفاً وارد حساب کاربری خود شوید."
        : "Please sign in to access your daily mission."
      : isFa
      ? "دریافت اطلاعات ماموریت با مشکل مواجه شد. لطفاً دوباره تلاش کنید."
      : "Failed to load daily mission. Please try again.";

  return (
    <div className={styles.page} dir={isFa ? "rtl" : "ltr"}>
      <div className={styles.container}>
        {/* Top Navigation & Locale Switcher */}
        <header className={styles.topBar}>
          <Link className={styles.backLink} href="/dashboard">
            <span aria-hidden="true">{isFa ? "→" : "←"}</span>
            <span>{isFa ? "بازگشت به خانه یادگیری" : "Back to Learning Home"}</span>
          </Link>
          <div className={styles.localeSwitcher} role="group" aria-label="Language selector">
            <button
              type="button"
              className={`${styles.localeButton} ${isFa ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              className={`${styles.localeButton} ${!isFa ? styles.localeButtonActive : ""}`}
              onClick={() => setLocale("en")}
            >
              English
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading ? (
          <section className={styles.loadingCard} aria-busy="true">
            <div className={styles.loadingSpinner} />
            <p>{isFa ? "در حال دریافت ماموریت امروز..." : "Loading today's mission..."}</p>
          </section>
        ) : null}

        {/* Error State */}
        {!loading && error ? (
          <section className={styles.errorCard} role="alert">
            <h2>{isFa ? "خطا در برقراری ارتباط" : "Connection Error"}</h2>
            <p>{errorMessage}</p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => window.location.reload()}
              style={{ marginInline: "auto", marginBlockStart: "var(--space-4)" }}
            >
              {isFa ? "تلاش مجدد" : "Try Again"}
            </button>
          </section>
        ) : null}

        {/* View Mode 1: Mission Overview (Wireframe 2) */}
        {!loading && !error && mission && viewMode === "overview" ? (
          <article className={styles.overviewCard}>
            <div className={styles.badgeRow}>
              <span className={styles.typeBadge}>
                {isFa ? "ماموریت روزانه" : "Daily Mission"}
              </span>
              <span className={styles.skillBadge}>
                {isFa
                  ? `مهارت تمرکزی: ${mission.target_skill}`
                  : `Focus Skill: ${mission.target_skill}`}
              </span>
              <span
                className={
                  mission.status === "completed"
                    ? styles.statusBadgeCompleted
                    : mission.status === "in_progress"
                    ? styles.statusBadgeProgress
                    : styles.statusBadgeReady
                }
              >
                {mission.status === "completed"
                  ? isFa ? "تکمیل شده" : "Completed"
                  : mission.status === "in_progress"
                  ? isFa ? "در حال انجام" : "In progress"
                  : isFa ? "آماده شروع" : "Ready to begin"}
              </span>
            </div>

            <h1 className={styles.missionTitle}>
              {isFa ? mission.title_fa : mission.title_en}
            </h1>
            <p className={styles.missionDesc}>
              {isFa ? mission.explanation_fa : mission.explanation_en}
            </p>

            {/* Why this mission? (Rule #2 Explainable Action) */}
            <div className={styles.reasonBox}>
              <div className={styles.reasonTitle}>
                {isFa ? "چرا این ماموریت انتخاب شده است؟" : "Why was this mission selected?"}
              </div>
              <div className={styles.reasonText}>
                {isFa ? mission.reason_fa : mission.reason_en}
              </div>
            </div>

            {/* 3-Step Roadmap Preview */}
            <div className={styles.taskRoadmap}>
              <h2 className={styles.roadmapTitle}>
                {isFa ? "گام‌های تمرین امروز (۳ مرحله)" : "Today's Practice Steps (3 Tasks)"}
              </h2>
              <div className={styles.roadmapGrid}>
                {mission.tasks.map((task, idx) => (
                  <div key={task.id} className={styles.roadmapStep}>
                    <span className={styles.stepNumber}>{idx + 1}</span>
                    <div className={styles.stepInfo}>
                      <div className={styles.stepTitle}>
                        {isFa ? task.title_fa : task.title_en}
                      </div>
                      <div className={styles.stepType}>
                        {isFa ? task.instruction_fa : task.instruction_en}
                      </div>
                    </div>
                    <span
                      className={`${styles.stepStatusIcon} ${
                        task.completed ? styles.stepStatusDone : ""
                      }`}
                    >
                      {task.completed ? "✓" : "○"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SRS Review Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                marginBlock: "var(--space-4)",
                flexWrap: "wrap",
                gap: "var(--space-3)",
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: "var(--font-size-body)", display: "block" }}>
                  {isFa ? "مرور فاصله‌دار واژگان (SRS)" : "Vocabulary Spaced Repetition (SRS)"}
                </span>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                  {mission.srs_due_count && mission.srs_due_count > 0
                    ? isFa
                      ? `${mission.srs_due_count} کارت واژه آماده مرور برای تثبیت در حافظه بلندمدت`
                      : `${mission.srs_due_count} vocabulary cards ready for long-term retention review`
                    : isFa
                    ? "واژگان شما تثبیت شده‌اند یا کارت‌های جدید آماده ورود به چرخه هستند."
                    : "Your vocabulary is up to date. Review cards or manage your word bank."}
                </span>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Link
                  className={styles.primaryBtn}
                  href="/review"
                  style={{ textDecoration: "none", padding: "var(--space-2) var(--space-3)", fontSize: "var(--font-size-meta)" }}
                >
                  {isFa ? "شروع مرور واژگان" : "Start SRS Review"}
                </Link>
                <Link
                  className={styles.secondaryBtn}
                  href="/vocabulary"
                  style={{ textDecoration: "none", padding: "var(--space-2) var(--space-3)", fontSize: "var(--font-size-meta)" }}
                >
                  {isFa ? "بانک واژگان" : "Word Bank"}
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.btnRow}>
              {mission.status === "completed" ? (
                <>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => setViewMode("complete")}
                  >
                    {isFa ? "مشاهده کارنامه ماموریت" : "View Mission Summary"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={handleResetMission}
                  >
                    {isFa ? "تمرین دوباره ماموریت" : "Practice Again"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleStartMission}
                  disabled={submitting}
                >
                  {mission.status === "in_progress"
                    ? isFa ? "ادامه ماموریت" : "Continue Mission"
                    : isFa ? "شروع ماموریت امروز" : "Start Today's Mission"}
                </button>
              )}
            </div>
          </article>
        ) : null}

        {/* View Mode 2: Active Task & Instant Feedback (Wireframe 2) */}
        {!loading && !error && mission && viewMode === "task" ? (
          <div className={styles.taskActiveContainer}>
            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>
                  {isFa
                    ? `گام ${activeTaskIndex + 1} از ${mission.tasks.length}`
                    : `Step ${activeTaskIndex + 1} of ${mission.tasks.length}`}
                </span>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  style={{ padding: "var(--space-1) var(--space-3)", fontSize: "var(--font-size-meta)" }}
                  onClick={() => setViewMode("overview")}
                >
                  {isFa ? "مرور کلی" : "Overview"}
                </button>
              </div>
              <div className={styles.progressTrack} role="progressbar" aria-valuenow={activeTaskIndex + 1} aria-valuemin={1} aria-valuemax={mission.tasks.length}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${((activeTaskIndex + 1) / mission.tasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Task Card */}
            {mission.tasks[activeTaskIndex] ? (
              <article className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <span className={styles.taskStepTag}>
                    {isFa ? mission.tasks[activeTaskIndex].title_fa : mission.tasks[activeTaskIndex].title_en}
                  </span>
                  <span className={styles.taskSkillTag}>
                    {mission.target_skill}
                  </span>
                </div>

                <p className={styles.taskInstruction}>
                  {isFa
                    ? mission.tasks[activeTaskIndex].instruction_fa
                    : mission.tasks[activeTaskIndex].instruction_en}
                </p>

                {/* English Prompt Box with strict LTR isolation */}
                <div className={styles.taskPromptBox}>
                  <p className={styles.taskPrompt}>
                    {mission.tasks[activeTaskIndex].prompt_en}
                  </p>
                </div>

                {/* Options List */}
                <div className={styles.optionsGrid} role="radiogroup" aria-label="Answer options">
                  {mission.tasks[activeTaskIndex].options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isDisabled = submitting || stepFeedback !== null;
                    return (
                      <label
                        key={opt.id}
                        className={`${styles.optionCard} ${
                          isSelected ? styles.optionCardSelected : ""
                        } ${isDisabled ? styles.optionCardDisabled : ""}`}
                      >
                        <input
                          type="radio"
                          name={`task-${mission.tasks[activeTaskIndex].id}`}
                          value={opt.id}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => setSelectedOption(opt.id)}
                          className={styles.optionRadio}
                        />
                        <span className={styles.optionText} data-en="true">
                          {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Feedback Drawer (Shown immediately after submit) */}
                {stepFeedback ? (
                  <div
                    className={`${styles.feedbackBox} ${
                      stepFeedback.is_correct ? styles.feedbackSuccess : styles.feedbackWarning
                    }`}
                    role="status"
                  >
                    <div className={styles.feedbackHeader}>
                      <span className={styles.feedbackIcon}>
                        {stepFeedback.is_correct ? "✓" : "ℹ"}
                      </span>
                      <strong className={styles.feedbackTitle}>
                        {stepFeedback.is_correct
                          ? isFa ? "پاسخ صحیح است!" : "Correct!"
                          : isFa ? "نیاز به توجه بیشتر" : "Needs Review"}
                      </strong>
                    </div>

                    {!stepFeedback.is_correct ? (
                      <div className={styles.feedbackCorrectAnswer}>
                        {isFa ? "گزینه درست: " : "Correct option: "}
                        <span className={styles.enIsolate}>
                          {
                            mission.tasks[activeTaskIndex].options.find(
                              (o) => o.id === stepFeedback.correct_option_id
                            )?.text
                          }
                        </span>
                      </div>
                    ) : null}

                    <p className={styles.feedbackExplanation}>
                      {isFa ? stepFeedback.explanation_fa : stepFeedback.explanation_en}
                    </p>

                    <button
                      type="button"
                      className={styles.primaryBtn}
                      style={{ marginBlockStart: "var(--space-4)" }}
                      onClick={handleNextStep}
                    >
                      {stepFeedback.all_completed
                        ? isFa ? "تکمیل و مشاهده نتیجه ماموریت" : "Finish & View Results"
                        : isFa ? "گام بعدی" : "Next Step"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={handleSubmitStep}
                    disabled={!selectedOption || submitting}
                  >
                    {submitting
                      ? isFa ? "در حال بررسی..." : "Checking..."
                      : isFa ? "بررسی و ثبت پاسخ" : "Check & Submit"}
                  </button>
                )}
              </article>
            ) : null}
          </div>
        ) : null}

        {/* View Mode 3: Mission Complete & Next Best Action (Wireframe 2) */}
        {!loading && !error && mission && viewMode === "complete" ? (
          <article className={styles.completeCard}>
            <div className={styles.completeIcon} aria-hidden="true">🎉</div>
            <h1 className={styles.completeTitle}>
              {isFa ? "ماموریت امروز با موفقیت تکمیل شد!" : "Today's Mission Completed!"}
            </h1>
            <p className={styles.completeDesc}>
              {isFa
                ? `تمرین هدفمند شما در مهارت «${mission.target_skill}» ثبت گردید. تداوم تمرین‌های روزانه، پایدارترین مسیر یادگیری است.`
                : `Your focused practice in ${mission.target_skill} has been recorded. Consistent daily practice forms the most durable learning path.`}
            </p>

            {/* Product Constitution Rule #8 Disclosure */}
            <div className={styles.evidenceNotice}>
              <strong>{isFa ? "ثبت شواهد یادگیری:" : "Learning Evidence Recorded:"} </strong>
              {isFa
                ? "این فعالیت مستقیماً در پرونده یادگیری و تعیین گام‌های بعدی شما لحاظ می‌شود. اندورا از سیستم‌های ساختگی امتیاز یا ادعاهای بدون شواهد استفاده نمی‌کند."
                : "This activity is directly incorporated into your learner model to shape subsequent steps. Endoora does not use artificial XP or unsubstantiated claims."}
            </div>

            {/* Dominant Next Best Action Card */}
            {mission.next_best_action ? (
              <div className={styles.nextActionCard}>
                <div className={styles.nextActionKicker}>
                  {isFa ? "اقدام پیشنهادی بعدی" : "Recommended Next Action"}
                </div>
                <h2 className={styles.nextActionTitle}>
                  {isFa ? mission.next_best_action.title_fa : mission.next_best_action.title_en}
                </h2>
                <p className={styles.nextActionReason}>
                  {isFa ? mission.next_best_action.reason_fa : mission.next_best_action.reason_en}
                </p>
                <Link
                  className={styles.primaryBtn}
                  href={mission.next_best_action.href}
                >
                  <span>
                    {isFa
                      ? mission.next_best_action.title_fa
                      : mission.next_best_action.title_en}
                  </span>
                  <span aria-hidden="true">{isFa ? "←" : "→"}</span>
                </Link>
              </div>
            ) : null}

            <div className={styles.btnRow} style={{ justifyContent: "center" }}>
              <Link className={styles.secondaryBtn} href="/dashboard">
                {isFa ? "بازگشت به خانه یادگیری" : "Back to Learning Home"}
              </Link>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleResetMission}
              >
                {isFa ? "تمرین دوباره" : "Practice Again"}
              </button>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
