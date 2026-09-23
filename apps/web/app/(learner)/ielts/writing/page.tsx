'use client';

import { Button } from "@endoora/ui";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ielts-writing.module.css";
import {
  fetchWritingPrompts,
  saveWritingDraft,
  fetchWritingDraft,
  submitWriting,
  IELTSWritingPrompt,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "../../../../lib/ielts-writing";

function countWords(str: string): number {
  if (!str) return 0;
  const matches = str.match(/\b[A-Za-z0-9'-]+\b/g);
  return matches ? matches.length : 0;
}

function IELTSWritingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftIdParam = searchParams.get("draftId");

  const [prompts, setPrompts] = useState<IELTSWritingPrompt[]>([]);
  const [activeTask, setActiveTask] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Draft text and telemetry
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [task1Time, setTask1Time] = useState(0);
  const [task2Time, setTask2Time] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(draftIdParam);
  const [autosaveStatus, setAutosaveStatus] = useState<string>("در انتظار تایپ...");

  // Exam clock: 60 minutes default
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);

  // Accessibility
  const [fontScale, setFontScale] = useState<"standard" | "large" | "xl">("standard");
  const [contrastTheme, setContrastTheme] = useState<"standard" | "dark">("standard");

  // Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Load prompts and existing draft
  useEffect(() => {
    async function initWritingRoom() {
      setLoading(true);
      setError(null);
      try {
        const fetchedPrompts = await fetchWritingPrompts();
        setPrompts(fetchedPrompts);

        try {
          const draft = await fetchWritingDraft(draftIdParam || undefined);
          if (draft && draft.status === "draft") {
            setSubmissionId(draft.id);
            setTask1Text(draft.task1_text || "");
            setTask2Text(draft.task2_text || "");
            setTask1Time(draft.task1_time_seconds || 0);
            setTask2Time(draft.task2_time_seconds || 0);
            setAutosaveStatus("پیش‌نویس ذخیره‌شده بازیابی شد.");
          }
        } catch {
          // No previous draft, start fresh
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات آزمون رایتینگ.");
      } finally {
        setLoading(false);
      }
    }

    initWritingRoom();
  }, [draftIdParam]);

  // Overall timer effect
  useEffect(() => {
    if (loading || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
      if (activeTask === 1) {
        setTask1Time((t) => t + 1);
      } else {
        setTask2Time((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, secondsRemaining, activeTask]);

  // Debounced Autosave effect
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (loading) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      if (!task1Text && !task2Text) return;
      try {
        setAutosaveStatus("در حال ذخیره‌سازی پیش‌نویس...");
        const res = await saveWritingDraft({
          submission_id: submissionId,
          task1_text: task1Text,
          task1_time_seconds: task1Time,
          task2_text: task2Text,
          task2_time_seconds: task2Time,
        });
        if (res.submission_id && !submissionId) {
          setSubmissionId(res.submission_id);
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
        setAutosaveStatus(`ذخیره خودکار: ${timeStr}`);
      } catch {
        setAutosaveStatus("خطا در ذخیره خودکار (حافظه محلی فعال است)");
      }
    }, 2000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [task1Text, task2Text, task1Time, task2Time, submissionId, loading]);

  // Format countdown clock
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isTimerDanger = secondsRemaining < 300;
  const isTimerWarning = secondsRemaining < 600 && !isTimerDanger;

  // Active prompt
  const task1Prompt = prompts.find((p) => p.task_type === "writing_task1_academic") || prompts[0];
  const task2Prompt = prompts.find((p) => p.task_type === "writing_task2_essay") || prompts[1];

  const currentPrompt = activeTask === 1 ? task1Prompt : task2Prompt;
  const currentText = activeTask === 1 ? task1Text : task2Text;
  const currentWordCount = countWords(currentText);
  const minWords = activeTask === 1 ? 150 : 250;
  const isWordCountSufficient = currentWordCount >= minWords;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (activeTask === 1) {
      setTask1Text(val);
    } else {
      setTask2Text(val);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitWriting({
        submission_id: submissionId,
        task1_prompt_title: task1Prompt?.title,
        task1_prompt_text: task1Prompt?.content_text,
        task1_image_url: task1Prompt?.media_image_url,
        task1_text: task1Text,
        task1_time_seconds: task1Time,
        task2_prompt_title: task2Prompt?.title,
        task2_prompt_text: task2Prompt?.content_text,
        task2_text: task2Text,
        task2_time_seconds: task2Time,
      });
      setShowSubmitModal(false);
      router.push(`/ielts/writing/report?id=${res.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال و ارزیابی رایتینگ.");
      setShowSubmitModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minBlockSize: "100vh" }}>
        در حال راه‌اندازی محیط شبیه‌ساز رایتینگ آیلتس...
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${contrastTheme === "dark" ? styles.containerDark : ""} ${
        fontScale === "large" ? styles.fontLarge : fontScale === "xl" ? styles.fontXl : ""
      }`}
    >
      {/* Examination Top Bar */}
      <header className={styles.examHeader}>
        <div className={styles.examHeaderInner}>
          <div className={styles.candidateInfo}>
            <h1 className={styles.examTitle}>IELTS Academic Writing Simulation</h1>
            <span className={styles.candidateSubtitle}>داوطلب: نسخه شبیه‌ساز کامپیوتری استاندارد (CD-IELTS)</span>
          </div>

          {/* Server Countdown Clock */}
          <div
            className={`${styles.timerBox} ${isTimerDanger ? styles.timerDanger : isTimerWarning ? styles.timerWarning : ""}`}
            aria-label="زمان باقی‌مانده آزمون رایتینگ"
          >
            <span>⏱</span>
            <span>{timeFormatted}</span>
          </div>

          {/* Accessibility & Finish actions */}
          <div className={styles.headerActions}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.iconBtn}
              onClick={() => setFontScale((f) => (f === "standard" ? "large" : f === "large" ? "xl" : "standard"))}
              title="اندازه فونت"
            >
              اندازه قلم: {fontScale === "standard" ? "استاندارد" : fontScale === "large" ? "بزرگ" : "خیلی بزرگ"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.iconBtn}
              onClick={() => setContrastTheme((c) => (c === "standard" ? "dark" : "standard"))}
              title="کنتراست و پوسته"
            >
              {contrastTheme === "standard" ? "🌙 پوسته تیره" : "☀️ پوسته روشن"}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              className={styles.submitBtn}
              onClick={() => setShowSubmitModal(true)}
              loading={submitting}
              disabled={submitting}
            >
              پایان و تصحیح هوشمند ➔
            </Button>
          </div>
        </div>
      </header>

      {/* 78rem Aligned Exam Body */}
      <div className={styles.examBody}>
        {/* Mandatory Disclaimer */}
        <aside className={styles.disclaimerBar} role="note">
          <span className={styles.disclaimerBadge}>سلب مسئولیت</span>
          <span>{MANDATORY_IELTS_DISCLAIMER_TEXT}</span>
        </aside>

        {error && (
          <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger-text)", padding: "var(--space-3)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-danger-border)" }}>
            {error}
          </div>
        )}

        {/* Task Switcher Tabs */}
        <nav className={styles.tabsBar} aria-label="انتخاب تسک رایتینگ">
          <Button
            type="button"
            variant={activeTask === 1 ? "primary" : "secondary"}
            className={`${styles.tabBtn} ${activeTask === 1 ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTask(1)}
          >
            <span>Task 1 (گزارش آکادمیک)</span>
            <span className={styles.tabPill}>
              {countWords(task1Text)} / ۱۵۰ کلمه (پیشنهاد: ۲۰ دقیقه)
            </span>
          </Button>

          <Button
            type="button"
            variant={activeTask === 2 ? "primary" : "secondary"}
            className={`${styles.tabBtn} ${activeTask === 2 ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTask(2)}
          >
            <span>Task 2 (مقاله استدلالی)</span>
            <span className={styles.tabPill}>
              {countWords(task2Text)} / ۲۵۰ کلمه (پیشنهاد: ۴۰ دقیقه)
            </span>
          </Button>
        </nav>

        {/* Split Workspace */}
        <main className={styles.workspace}>
          {/* Left Pane: Prompt & Instructions */}
          <section className={styles.promptPane} aria-label="صورت سوال و دستورالعمل">
            <h2 className={styles.promptTitle}>
              {activeTask === 1 ? "Writing Task 1 — Report" : "Writing Task 2 — Essay"}
            </h2>

            <div className={styles.promptCard} dir="ltr">
              {currentPrompt?.content_text || "صورت سوال در حال بارگذاری است..."}
            </div>

            {activeTask === 1 && currentPrompt?.media_image_url && (
              <div className={styles.diagramBox}>
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 700 }}>نمودار منبع (Source Diagram)</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPrompt.media_image_url}
                  alt="IELTS Task 1 Diagram"
                  className={styles.diagramImage}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className={styles.requirementsBox}>
              <strong>نکات ضروری اگزمینر:</strong>
              <span>• حداقل کلمات الزامی: {minWords} کلمه</span>
              <span>• سبک نگارش: کاملاً رسمی و آکادمیک (پرهیز از کلمات عامیانه و اختصارات)</span>
              {activeTask === 1 ? (
                <span>• تسک ۱: درج بند Overview و تشریح تفاوت‌ها بدون ابراز نظر شخصی</span>
              ) : (
                <span>• تسک ۲: تبیین شفاف هر دو دیدگاه همراه با بند نتیجه‌گیری مستقل</span>
              )}
            </div>
          </section>

          {/* Right Pane: Text Editor */}
          <section className={styles.editorPane} aria-label="ویرایشگر پاسخ رایتینگ">
            <div className={styles.editorToolbar}>
              <div
                className={`${styles.wordCountBadge} ${
                  isWordCountSufficient ? styles.wordCountSuccess : styles.wordCountWarning
                }`}
              >
                <span>تعداد کلمات: {currentWordCount}</span>
                <span>
                  {isWordCountSufficient
                    ? "✓ حد نصاب تکمیل شد"
                    : `(نیازمند حداقل ${minWords - currentWordCount} کلمه دیگر)`}
                </span>
              </div>

              <div className={styles.autosaveBadge}>
                <span className={styles.autosaveDot} />
                <span>{autosaveStatus}</span>
              </div>
            </div>

            <textarea
              className={styles.textArea}
              value={currentText}
              onChange={handleTextChange}
              placeholder={
                activeTask === 1
                  ? "پاسخ تسک ۱ را اینجا بنویسید (حداقل ۱۵۰ کلمه)..."
                  : "پاسخ تسک ۲ را اینجا بنویسید (حداقل ۲۵۰ کلمه)..."
              }
              spellCheck={false}
              autoFocus
            />
          </section>
        </main>
      </div>

      {/* Review & Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>تأیید نهایی و ارسال به موتور ارزیابی</h2>

            <div className={styles.modalRow}>
              <span>تعداد کلمات تسک ۱:</span>
              <strong>
                {countWords(task1Text)} کلمه{" "}
                {countWords(task1Text) >= 150 ? (
                  <span style={{ color: "var(--color-success-text)" }}>✓</span>
                ) : (
                  <span style={{ color: "var(--color-warning-text)" }}>⚠ کمتر از ۱۵۰</span>
                )}
              </strong>
            </div>

            <div className={styles.modalRow}>
              <span>تعداد کلمات تسک ۲:</span>
              <strong>
                {countWords(task2Text)} کلمه{" "}
                {countWords(task2Text) >= 250 ? (
                  <span style={{ color: "var(--color-success-text)" }}>✓</span>
                ) : (
                  <span style={{ color: "var(--color-warning-text)" }}>⚠ کمتر از ۲۵۰</span>
                )}
              </strong>
            </div>

            {(countWords(task1Text) < 150 || countWords(task2Text) < 250) && (
              <div style={{ color: "var(--color-warning-text)", fontSize: "var(--font-size-xs)", background: "var(--color-warning-bg)", padding: "var(--space-2)", borderRadius: "var(--radius-sm)" }}>
                هشدار: عدم رعایت حد نصاب کلمات منجر به کسر نمره در Task Achievement / Task Response خواهد شد.
              </div>
            )}

            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
              با تأیید، متن شما توسط هوش مصنوعی بر اساس چهار معیار رسمی آیلتس ارزیابی شده و کارنامه تشخیصی تفصیلی صادر می‌گردد.
            </p>

            <div className={styles.modalActionRow}>
              <Button
                type="button"
                variant="secondary"
                className={styles.cancelBtn}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                ادامه ویرایش
              </Button>

              <Button
                type="button"
                variant="primary"
                className={styles.confirmBtn}
                onClick={handleFinalSubmit}
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? "در حال پردازش و نمره‌دهی..." : "ارسال قطعی و مشاهده کارنامه"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IELTSWritingRoomPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>در حال بارگذاری آزمون رایتینگ...</div>}>
      <IELTSWritingRoomContent />
    </React.Suspense>
  );
}
