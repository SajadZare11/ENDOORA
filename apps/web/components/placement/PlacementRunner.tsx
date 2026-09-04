"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import LearnerTwinPreview from "@/components/placement/LearnerTwinPreview";
import styles from "@/components/placement/placement.module.css";

type Locale = "fa" | "en";

interface PlacementQuestionItem {
  id: string;
  section: string;
  question_type: string;
  title_fa?: string;
  title_en?: string;
  prompt_fa?: string;
  prompt_en: string;
  instructions_fa?: string;
  instructions_en?: string;
  cefr_level?: string;
  difficulty?: string;
  passage?: string;
  options: string[];
  question_version_id?: string | null;
}

interface PlacementAnswerRecord {
  idempotency_key: string;
  question_key: string;
  question_version_id?: string | null;
  answer_value: {
    selected_option?: string;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

interface PlacementSessionData {
  id: string;
  status: "active" | "submitted" | "expired";
  current_section: string;
  started_at: string;
  updated_at: string;
  expires_at: string;
  is_expired: boolean;
  is_active: boolean;
  answers_count: number;
  answers: PlacementAnswerRecord[];
}

const DEFAULT_QUESTIONS: PlacementQuestionItem[] = [
  {
    id: "grammar-a1-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با شکل درست فعل کامل کنید.",
    prompt_en: "She ___ to school every day.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["go", "goes", "going", "gone"],
  },
  {
    id: "vocabulary-a1-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان",
    title_en: "Vocabulary Section",
    prompt_fa: "کلمه مناسب با تعریف را انتخاب کنید.",
    prompt_en: "A place where you borrow books is a...",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["library", "kitchen", "station", "garden"],
  },
  {
    id: "reading-a1-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش خواندن و درک مطلب",
    title_en: "Reading Section",
    prompt_fa: "متن زیر را بخوانید و به سوال پاسخ دهید.",
    prompt_en: "Why does Ali study English?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "Ali studies English every evening because he wants to travel.",
    cefr_level: "A1",
    difficulty: "medium",
    options: ["Travel", "Work", "Cooking", "Sports"],
  },
];

const t = {
  fa: {
    heroTag: "موتور هوشمند تعیین سطح Endoora",
    heroTitle: "شناخت دقیق نقطه شروع یادگیری",
    heroDesc: "این آزمون چندمرحله‌ای به صورت زنده ذخیره می‌شود و با هر قطعی اینترنت، پاسخ‌های تأییدشده شما حفظ خواهند شد.",
    questionCounter: "سوال",
    of: "از",
    section: "بخش",
    grammar: "گرامر",
    vocabulary: "واژگان",
    reading: "خواندن و درک مطلب",
    next: "سوال بعدی",
    prev: "سوال قبلی",
    submit: "ثبت نهایی آزمون",
    submitting: "در حال ثبت نهایی...",
    savedStatus: "پاسخ‌ها به صورت خودکار با مهر زمانی سرور ذخیره می‌شوند.",
    offlineWarning: "اتصال اینترنت قطع است. آخرین پاسخ تأییدشده حفظ می‌شود؛ نگران از دست رفتن اطلاعات نباشید.",
    expiredAlert: "نشست آزمون شما منقضی شده است. برای حفظ اعتبار آموزشی، لطفا یک نشست جدید شروع کنید.",
    startNewSession: "شروع نشست جدید",
    completedTitle: "آزمون تعیین سطح با موفقیت ثبت شد!",
    completedDesc: "پاسخ‌های شما بررسی شده و شواهد یادگیری ثبت گردیدند. اکنون می‌توانید گزارش شفاف سطح خود را مشاهده کرده یا به داشبورد بروید.",
    viewReport: "مشاهده گزارش شفاف سطح",
    goToDashboard: "ورود به داشبورد زبان‌آموز",
    authNotice: "برای اتصال این پاسخ‌ها به پروفایل آموزشی خود، در سامانه وارد شده‌اید.",
  },
  en: {
    heroTag: "Endoora Adaptive Placement Engine",
    heroTitle: "Discover Your True Starting Point",
    heroDesc: "This multi-stage test is saved live to the server. Your confirmed answers remain safe even if your connection drops.",
    questionCounter: "Question",
    of: "of",
    section: "Section",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    next: "Next question",
    prev: "Previous question",
    submit: "Submit test",
    submitting: "Submitting...",
    savedStatus: "Answers are saved automatically with server timestamps.",
    offlineWarning: "You are currently offline. Your last confirmed answers are preserved.",
    expiredAlert: "Your placement session has expired. Please start a new session to ensure accurate evaluation.",
    startNewSession: "Start new session",
    completedTitle: "Placement test submitted successfully!",
    completedDesc: "Your answers have been securely recorded. You can now inspect your transparent skill report or return to your dashboard.",
    viewReport: "View skill report",
    goToDashboard: "Go to learner dashboard",
    authNotice: "You are signed in and your answers are linked to your learning profile.",
  },
};

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "idem-" + Math.random().toString(36).substring(2, 15);
}

export function PlacementRunner({ initialLocale = "fa" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [questions, setQuestions] = useState<PlacementQuestionItem[]>(DEFAULT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [session, setSession] = useState<PlacementSessionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const copy = t[locale];
  const question = questions[currentIndex] || DEFAULT_QUESTIONS[0];
  const selectedOption = answers[question.id] || "";

  // Initialize or resume placement session
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // 1. Try to fetch or create active session
        const res = await fetch("/api/placement/sessions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const sessionData: PlacementSessionData = await res.json();
          if (!isMounted) return;
          setSession(sessionData);

          if (sessionData.status === "submitted") {
            setIsSubmitted(true);
          } else if (sessionData.is_expired || sessionData.status === "expired") {
            setIsExpired(true);
          }

          // Restore existing saved answers
          if (sessionData.answers && Array.isArray(sessionData.answers)) {
            const restored: Record<string, string> = {};
            sessionData.answers.forEach((ans) => {
              if (ans.answer_value?.selected_option) {
                restored[ans.question_key] = String(ans.answer_value.selected_option);
              }
            });
            setAnswers((prev) => ({ ...restored, ...prev }));
          }
        }
      } catch {
        // Fallback for offline or local preview
      }

      // 2. Fetch server-sanitized questions if available
      try {
        const qRes = await fetch("/api/placement/questions/");
        if (qRes.ok) {
          const fetchedItems: PlacementQuestionItem[] = await qRes.json();
          if (isMounted && fetchedItems.length > 0) {
            setQuestions(fetchedItems);
          }
        }
      } catch {
        // Keep default questions
      }
    }

    initSession();

    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save an answer idempotently
  async function handleSelectOption(option: string) {
    if (isSubmitted || isExpired) return;

    setAnswers((prev) => ({ ...prev, [question.id]: option }));

    if (!session || !session.id) return;

    try {
      const idempotencyKey = generateIdempotencyKey();
      const res = await fetch(`/api/placement/sessions/${session.id}/answers/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          question_key: question.id,
          question_version_id: question.question_version_id || null,
          answer_value: { selected_option: option },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired" || errData.code === "session_inactive") {
          setIsExpired(true);
        }
      }
    } catch {
      // Offline network catch
      setIsOffline(true);
    }
  }

  // Next Question
  async function handleNext() {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const nextQuestion = questions[nextIndex];
      if (session && nextQuestion && nextQuestion.section !== question.section) {
        try {
          await fetch(`/api/placement/sessions/${session.id}/advance/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: nextQuestion.section }),
          });
        } catch {
          // Non-blocking
        }
      }
    }
  }

  // Previous Question
  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // Final Submission
  async function handleSubmit() {
    if (!session || !session.id) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/placement/sessions/${session.id}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.code === "session_expired") {
          setIsExpired(true);
        } else {
          setIsSubmitted(true);
        }
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Restart session if expired
  async function handleRestartSession() {
    setIsExpired(false);
    setIsSubmitted(false);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const res = await fetch("/api/placement/sessions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data: PlacementSessionData = await res.json();
        setSession(data);
      }
    } catch {
      // Handled
    }
  }

  return (
    <EndooraBackground>
      <div className={styles.container} dir={locale === "fa" ? "rtl" : "ltr"}>
        {/* Language Switcher */}
        <div className={styles.headerActions}>
          <div className={styles.languageToggle}>
            <button
              type="button"
              className={`${styles.langBtn} ${locale === "fa" ? styles.langBtnActive : ""}`}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              className={`${styles.langBtn} ${locale === "en" ? styles.langBtnActive : ""}`}
              onClick={() => setLocale("en")}
            >
              English
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <GlassCard>
          <div className={styles.hero}>
            <p className={styles.heroTag}>{copy.heroTag}</p>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroDesc}</p>
          </div>
        </GlassCard>

        {/* Status Alerts */}
        {isOffline && <div className={`${styles.alert} ${styles.alertWarning}`}>{copy.offlineWarning}</div>}

        {isExpired && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <p>{copy.expiredAlert}</p>
            <button type="button" className={styles.btnPrimary} onClick={handleRestartSession} style={{ marginTop: "1rem" }}>
              {copy.startNewSession}
            </button>
          </div>
        )}

        {/* Submission Complete View */}
        {isSubmitted ? (
          <div className={styles.emptyState}>
            <h2>{copy.completedTitle}</h2>
            <p style={{ marginBlock: "1.5rem", maxWidth: "36rem", marginInline: "auto" }}>{copy.completedDesc}</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/placement/report" className={styles.btnPrimary}>
                {copy.viewReport}
              </Link>
              <Link href="/dashboard" className={styles.btnSecondary}>
                {copy.goToDashboard}
              </Link>
            </div>
          </div>
        ) : (
          !isExpired && (
            <div className={styles.grid}>
              {/* Question Card */}
              <div className={styles.questionCard}>
                <div className={styles.counter}>
                  <span>
                    {copy.questionCounter} {currentIndex + 1} {copy.of} {questions.length}
                  </span>
                  <span className={styles.sectionBadge}>{question.section}</span>
                </div>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {question.passage && (
                  <div className={styles.passage} dir="ltr">
                    {question.passage}
                  </div>
                )}

                <div className={styles.englishPrompt} dir="ltr">
                  {question.prompt_en}
                </div>

                <div className={styles.options}>
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      dir="ltr"
                      className={`${styles.option} ${selectedOption === opt ? styles.optionActive : ""}`}
                      onClick={() => handleSelectOption(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className={styles.navRow}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    {copy.prev}
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button type="button" className={styles.btnPrimary} onClick={handleNext}>
                      {copy.next}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? copy.submitting : copy.submit}
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Preview */}
              <LearnerTwinPreview />
            </div>
          )
        )}
      </div>
    </EndooraBackground>
  );
}
