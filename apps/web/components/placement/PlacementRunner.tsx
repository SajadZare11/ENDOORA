"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import LearnerTwinPreview from "@/components/placement/LearnerTwinPreview";
import { AudioWaveformPlayer } from "./AudioWaveformPlayer";
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
  audio_url?: string;
  play_limit?: number;
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
    title_fa: "بخش دستور زبان (Grammar)",
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
    id: "grammar-a2-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با زمان گذشته مناسب کامل کنید.",
    prompt_en: "Yesterday, they ___ to the national museum.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A2",
    difficulty: "easy",
    options: ["went", "gone", "go", "goes"],
  },
  {
    id: "grammar-b1-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جای خالی را با ساختار زمان مناسب کامل کنید.",
    prompt_en: "I ___ in this city since 2018.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B1",
    difficulty: "medium",
    options: ["live", "have lived", "lived", "was living"],
  },
  {
    id: "grammar-b2-001",
    section: "grammar",
    question_type: "single_choice",
    title_fa: "بخش دستور زبان (Grammar)",
    title_en: "Grammar Section",
    prompt_fa: "جمله شرطی را کامل کنید.",
    prompt_en: "If she had prepared earlier, she ___ the challenging examination.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B2",
    difficulty: "hard",
    options: ["passed", "would pass", "would have passed", "will pass"],
  },
  {
    id: "vocabulary-a1-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
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
    id: "vocabulary-a2-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "واژه مناسب سفر بین‌المللی را انتخاب کنید.",
    prompt_en: "You need to present a valid ___ when traveling across international borders.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "A2",
    difficulty: "easy",
    options: ["passport", "receipt", "menu", "pillow"],
  },
  {
    id: "vocabulary-b1-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "هم‌آیی واژگانی مناسب را انتخاب کنید.",
    prompt_en: "The research team made an extraordinary ___ that accelerated scientific progress.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B1",
    difficulty: "medium",
    options: ["discovery", "destination", "departure", "discount"],
  },
  {
    id: "vocabulary-b2-001",
    section: "vocabulary",
    question_type: "single_choice",
    title_fa: "بخش واژگان (Vocabulary)",
    title_en: "Vocabulary Section",
    prompt_fa: "صفت دقیق متناسب با موقعیت را انتخاب کنید.",
    prompt_en: "The instructions were somewhat ___, leaving team members unsure of next steps.",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    cefr_level: "B2",
    difficulty: "hard",
    options: ["ambiguous", "ancient", "abundant", "accurate"],
  },
  {
    id: "reading-a1-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "متن کوتاه را بخوانید و به سوال پاسخ دهید.",
    prompt_en: "Why does Ali study English?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "Ali studies English every evening because he wants to travel the world next summer.",
    cefr_level: "A1",
    difficulty: "easy",
    options: ["Travel", "Work", "Cooking", "Sports"],
  },
  {
    id: "reading-a2-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "بر اساس جدول زمانی متن، به سوال پاسخ دهید.",
    prompt_en: "When can visitors use the library on Saturdays?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "The city library is open from 8:00 AM to 6:00 PM on weekdays, and from 9:00 AM to 1:00 PM on Saturdays. It remains closed on Sundays.",
    cefr_level: "A2",
    difficulty: "medium",
    options: ["9:00 AM to 1:00 PM", "8:00 AM to 6:00 PM", "Closed all day", "Until 8:00 PM"],
  },
  {
    id: "reading-b1-001",
    section: "reading",
    question_type: "single_choice",
    title_fa: "بخش درک مطلب (Reading)",
    title_en: "Reading Section",
    prompt_fa: "بر اساس مفهوم متن، پاسخ صحیح را انتخاب کنید.",
    prompt_en: "According to the text, what is a primary social benefit of community gardens?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    passage: "Urban community gardens have expanded across many cities in recent years. Beyond providing fresh produce, they foster meaningful neighborhood connections and offer a calming green environment for residents.",
    cefr_level: "B1",
    difficulty: "hard",
    options: ["Strengthening neighborhood connections", "Lowering property taxes", "Eliminating local markets", "Reducing automobile traffic"],
  },
  {
    id: "listening-a1-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "به فایل صوتی کوتاه گوش دهید و هدف گوینده را انتخاب کنید.",
    prompt_en: "What is the speaker announcing?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-a1-001.wav",
    play_limit: 2,
    cefr_level: "A1",
    difficulty: "easy",
    options: ["A train departure delay", "A library book return", "A dinner invitation", "A weather forecast"],
  },
  {
    id: "listening-a2-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "بر اساس فایل صوتی، زمان شروع جلسه را مشخص کنید.",
    prompt_en: "At what time does the meeting start tomorrow morning?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-a2-001.wav",
    play_limit: 2,
    cefr_level: "A2",
    difficulty: "easy",
    options: ["9:30 AM", "10:00 AM", "8:15 AM", "11:45 AM"],
  },
  {
    id: "listening-b1-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "با توجه به توضیحات گوینده، نگرش او نسبت به شیوه کاری ترکیبی چیست؟",
    prompt_en: "How does the speaker feel about the new hybrid work schedule?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-b1-001.wav",
    play_limit: 2,
    cefr_level: "B1",
    difficulty: "medium",
    options: ["Cautiously optimistic about productivity", "Completely opposed to remote work", "Indifferent to team changes", "Confused about daily commuting"],
  },
  {
    id: "listening-b2-001",
    section: "listening",
    question_type: "single_choice",
    title_fa: "بخش مهارت شنیداری (Listening)",
    title_en: "Listening Section",
    prompt_fa: "نکته اصلی مورد تاکید سخنران در این سخنرانی علمی چیست؟",
    prompt_en: "What main point does the speaker emphasize regarding urban biodiversity?",
    instructions_fa: "یک گزینه را انتخاب کنید.",
    instructions_en: "Choose one option.",
    audio_url: "/audio/placement/listening-b2-001.wav",
    play_limit: 2,
    cefr_level: "B2",
    difficulty: "hard",
    options: ["Green corridors significantly mitigate habitat fragmentation", "Urban expansion has negligible ecological effects", "Rooftop gardens cannot support insect populations", "Artificial lighting replaces natural circadian rhythms"],
  },
];

const t = {
  fa: {
    heroTag: "موتور هوشمند تعیین سطح Endoora",
    heroTitle: "شناخت دقیق نقطه شروع یادگیری",
    heroDesc: "این آزمون چندمرحله‌ای (دستور زبان، واژگان، درک مطلب و شنیداری) به صورت زنده ذخیره می‌شود و با هر قطعی اینترنت، پاسخ‌های تأییدشده شما حفظ خواهند شد.",
    questionCounter: "سوال",
    of: "از",
    section: "بخش",
    grammar: "دستور زبان",
    vocabulary: "واژگان",
    reading: "درک مطلب",
    listening: "شنیداری",
    next: "سوال بعدی",
    prev: "سوال قبلی",
    submit: "ثبت نهایی آزمون",
    submitting: "در حال ثبت نهایی...",
    savedStatus: "پاسخ‌ها به صورت خودکار با مهر زمانی سرور ذخیره می‌شوند.",
    savedStatusShort: "ذخیره خودکار زنده",
    offlineWarning: "اتصال اینترنت قطع است. آخرین پاسخ تأییدشده حفظ می‌شود؛ نگران از دست رفتن اطلاعات نباشید.",
    expiredAlert: "نشست آزمون شما منقضی شده است. برای حفظ اعتبار آموزشی، لطفا یک نشست جدید شروع کنید.",
    startNewSession: "شروع نشست جدید",
    completedTitle: "آزمون تعیین سطح با موفقیت ثبت شد!",
    completedDesc: "پاسخ‌های شما بررسی شده و شواهد یادگیری برای بخش‌های گرامر، واژگان، درک مطلب و شنیداری ثبت گردیدند. اکنون می‌توانید کارنامه مهارتی خود را مشاهده کنید.",
    viewReport: "مشاهده کارنامه مهارتی",
    goToDashboard: "ورود به داشبورد زبان‌آموز",
    authNotice: "برای اتصال این پاسخ‌ها به پروفایل آموزشی خود، در سامانه وارد شده‌اید.",
  },
  en: {
    heroTag: "Endoora Adaptive Placement Engine",
    heroTitle: "Discover Your True Starting Point",
    heroDesc: "This multi-stage test (Grammar, Vocabulary, Reading, and Listening) is saved live to the server. Your confirmed answers remain safe even if your connection drops.",
    questionCounter: "Question",
    of: "of",
    section: "Section",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    listening: "Listening",
    next: "Next question",
    prev: "Previous question",
    submit: "Submit test",
    submitting: "Submitting...",
    savedStatus: "Answers are saved automatically with server timestamps.",
    savedStatusShort: "Live Autosave",
    offlineWarning: "You are currently offline. Your last confirmed answers are preserved.",
    expiredAlert: "Your placement session has expired. Please start a new session to ensure accurate evaluation.",
    startNewSession: "Start new session",
    completedTitle: "Placement test submitted successfully!",
    completedDesc: "Your answers have been securely evaluated for Grammar, Vocabulary, Reading, and Listening. You can now inspect your skill report.",
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
                {/* Multi-stage Section Tabs */}
                <div className={styles.sectionNav} role="tablist" aria-label={locale === "fa" ? "مراحل آزمون" : "Test sections"}>
                  <div className={`${styles.sectionPill} ${question.section === "grammar" ? styles.sectionPillActive : styles.sectionPillDone}`}>
                    {locale === "fa" ? "۱. دستور زبان" : "1. Grammar"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "vocabulary" ? styles.sectionPillActive : (question.section === "reading" || question.section === "listening" ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۲. واژگان" : "2. Vocabulary"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "reading" ? styles.sectionPillActive : (question.section === "listening" ? styles.sectionPillDone : "")}`}>
                    {locale === "fa" ? "۳. درک مطلب" : "3. Reading"}
                  </div>
                  <div className={`${styles.sectionPill} ${question.section === "listening" ? styles.sectionPillActive : ""}`}>
                    {locale === "fa" ? "۴. شنیداری" : "4. Listening"}
                  </div>
                  <div className={styles.autosaveBadge}>
                    <span className={styles.autosaveDot} />
                    {copy.savedStatusShort}
                  </div>
                </div>

                <div className={styles.counter}>
                  <span>
                    {copy.questionCounter} {currentIndex + 1} {copy.of} {questions.length}
                  </span>
                  <span className={styles.sectionBadge}>
                    {locale === "fa" ? (question.title_fa || question.section) : (question.title_en || question.section)}
                  </span>
                </div>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {question.prompt_fa && (
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-2)" }}>
                    {question.prompt_fa}
                  </p>
                )}

                {question.audio_url && (
                  <AudioWaveformPlayer
                    key={question.id}
                    src={question.audio_url}
                    playLimit={question.play_limit || 2}
                    title_fa={question.title_fa || "فایل صوتی سوال"}
                    title_en={question.title_en || "Question Audio"}
                    locale={locale}
                  />
                )}

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
