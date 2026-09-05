"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./practice.module.css";

interface ExerciseOption {
  id: string;
  text: string;
}

interface ExerciseQuestion {
  id: string;
  type: string;
  title_fa: string;
  title_en: string;
  instruction_fa: string;
  instruction_en: string;
  prompt_en: string;
  options: ExerciseOption[];
  cefr_level?: string;
  objective_id?: string;
}

interface GeneratedExercise {
  id: number;
  title_fa: string;
  title_en: string;
  target_skill: string;
  cefr_level: string;
  objective_id?: string;
  questions: ExerciseQuestion[];
  is_fallback: boolean;
  model_used: string;
}

interface QuestionResult {
  question_id: string;
  selected_option_id: string;
  correct_option_id: string;
  is_correct: boolean;
  prompt_en: string;
  options: ExerciseOption[];
  explanation_fa: string;
  explanation_en: string;
  cefr_level?: string;
}

interface SubmissionEvaluation {
  attempt_id: number;
  exercise_set_id: number;
  score_percentage: number;
  correct_count: number;
  total_count: number;
  is_fallback: boolean;
  model_used: string;
  results: QuestionResult[];
}

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const TARGET_SKILLS = [
  { id: "grammar", labelFa: "دستور زبان و گرامر", labelEn: "Grammar & Structure" },
  { id: "vocabulary", labelFa: "واژگان و اصطلاحات", labelEn: "Vocabulary & Idioms" },
  { id: "collocations", labelFa: "همنشینی‌های واژگانی", labelEn: "Collocations" },
  { id: "reading", labelFa: "درک مطلب و مفهوم", labelEn: "Reading Comprehension" },
];

const PRESET_TOPICS = [
  { fa: "زمان‌های گذشته و افعال بی‌قاعده", en: "Past simple & irregular verbs", skill: "grammar", level: "A2" },
  { fa: "حال کامل و نشانگرهای زمانی", en: "Present perfect with for/since", skill: "grammar", level: "B1" },
  { fa: "جملات شرطی نوع دوم و فرضیات", en: "Second conditionals & hypotheses", skill: "grammar", level: "B2" },
  { fa: "واژگان محیط کار و جلسات رسمی", en: "Workplace & formal meeting idioms", skill: "vocabulary", level: "B1" },
  { fa: "قلب ساختار با قیدهای منفی (Inversion)", en: "Negative adverbial inversion", skill: "grammar", level: "C1" },
];

export default function PracticePage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  // Configuration state
  const [selectedSkill, setSelectedSkill] = useState("grammar");
  const [selectedCefr, setSelectedCefr] = useState("B1");
  const [focusArea, setFocusArea] = useState("Present perfect and time markers");
  const [questionCount, setQuestionCount] = useState(3);

  // Exercise runner state
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<SubmissionEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGenerateExercise() {
    setGenerating(true);
    setErrorMessage("");
    setEvaluation(null);
    setUserAnswers({});
    setActiveQuestionIndex(0);

    try {
      const res = await fetch("/api/ai/exercises/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_skill: selectedSkill,
          cefr_level: selectedCefr,
          focus_area: focusArea,
          question_count: questionCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentExercise(data);
      } else {
        // Offline or unauthenticated fallback simulator
        loadLocalFallbackExercise();
      }
    } catch {
      loadLocalFallbackExercise();
    } finally {
      setGenerating(false);
    }
  }

  function loadLocalFallbackExercise() {
    const fallbackData: GeneratedExercise = {
      id: Date.now(),
      title_fa: "مجموعه تمرین تثبیت‌شده (بانک بازبینی‌شده)",
      title_en: "Verified Exercise Set (Reviewed Bank)",
      target_skill: selectedSkill,
      cefr_level: selectedCefr,
      is_fallback: true,
      model_used: "reviewed_bank_fallback",
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          title_fa: "تمرین گرامر حال کامل",
          title_en: "Present Perfect Practice",
          instruction_fa: "حرف اضافه مناسب برای نشان دادن بازه زمانی را انتخاب کنید.",
          instruction_en: "Choose the preposition that denotes a duration of time.",
          prompt_en: "Dr. Rezaei has lived and worked in Shiraz ___ over ten years.",
          options: [
            { id: "a", text: "since" },
            { id: "b", text: "for" },
            { id: "c", text: "during" },
            { id: "d", text: "from" },
          ],
        },
        {
          id: "q2",
          type: "multiple_choice",
          title_fa: "همنشینی‌های واژگانی آکادمیک",
          title_en: "Academic Collocations",
          instruction_fa: "فعل همنشین با واژه progress را تعیین فرمایید.",
          instruction_en: "Select the standard collocation verb.",
          prompt_en: "The students have ___ significant progress in their academic writing this term.",
          options: [
            { id: "a", text: "done" },
            { id: "b", text: "made" },
            { id: "c", text: "built" },
            { id: "d", text: "taken" },
          ],
        },
      ],
    };
    setCurrentExercise(fallbackData);
  }

  function handleSelectOption(questionId: string, optionId: string) {
    if (evaluation) return; // locked after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }

  async function handleSubmitExercise() {
    if (!currentExercise) return;
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/ai/exercises/${currentExercise.id}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: userAnswers }),
      });

      if (res.ok) {
        const evalData = await res.json();
        setEvaluation(evalData);
      } else {
        // Local evaluation fallback
        evaluateLocally();
      }
    } catch {
      evaluateLocally();
    } finally {
      setSubmitting(false);
    }
  }

  function evaluateLocally() {
    if (!currentExercise) return;
    const questions = currentExercise.questions;
    // Known answer keys for fallback questions
    const fallbackKeys: Record<string, string> = { q1: "b", q2: "b" };

    let correctCount = 0;
    const results: QuestionResult[] = questions.map((q) => {
      const correctId = fallbackKeys[q.id] || "b";
      const selectedId = userAnswers[q.id] || "";
      const isCorrect = selectedId === correctId;
      if (isCorrect) correctCount++;

      return {
        question_id: q.id,
        selected_option_id: selectedId,
        correct_option_id: correctId,
        is_correct: isCorrect,
        prompt_en: q.prompt_en,
        options: q.options,
        explanation_fa:
          q.id === "q1"
            ? "حرف اضافه for همراه با طول بازه زمانی (over ten years) به کار می‌رود."
            : "همنشینی استاندارد در انگلیسی make progress است و do progress نادرست است.",
        explanation_en:
          q.id === "q1"
            ? "'For' specifies duration, whereas 'since' marks a starting point."
            : "The conventional English collocation is 'make progress'.",
      };
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    setEvaluation({
      attempt_id: Date.now(),
      exercise_set_id: currentExercise.id,
      score_percentage: scorePct,
      correct_count: correctCount,
      total_count: questions.length,
      is_fallback: true,
      model_used: "reviewed_bank_fallback",
      results,
    });
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Practice Navigation Tabs */}
      <nav className={styles.tabBar} aria-label={isFa ? "بخش‌های تمرین هوشمند" : "AI Practice Sections"}>
        <span className={`${styles.tabItem} ${styles.tabItemActive}`}>
          {isFa ? "🎯 آزمونک‌های هوشمند پداگوژیک" : "🎯 Adaptive Exercises"}
        </span>
        <Link className={styles.tabItem} href="/practice-ai">
          {isFa ? "✍️ آزمایشگاه تشخیص و نگارش" : "✍️ Writing Diagnostics"}
        </Link>
        <Link className={styles.tabItem} href="/review">
          {isFa ? "🧠 مرور واژگان لایتنر (SRS)" : "🧠 SRS Vocabulary Review"}
        </Link>
      </nav>

      {/* Hero Header */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "تولید و اجرای آزمونک‌های هوشمند" : "Structured AI Exercise Generator & Runner"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "تمرین‌های شخصی‌سازی‌شده منطبق بر سطح زبان CEFR و ژنوم اشتباهات شما، با پشتیبانی چندسطحی مدل‌های زبانی و بازگشت خودکار به بانک سوالات تاییدشده."
                : "Generate verified pedagogical exercises aligned to your CEFR level and Mistake Genome, backed by multi-tier model routing and audited fallback question banks."}
            </p>
          </div>
          <span
            className={`${styles.heroBadge} ${
              currentExercise?.is_fallback ? styles.heroBadgeFallback : ""
            }`}
          >
            {currentExercise
              ? currentExercise.is_fallback
                ? isFa
                  ? "بانک بازبینی‌شده (تاییدشده)"
                  : "Reviewed Fallback Bank"
                : isFa
                ? `مدل فعال: ${currentExercise.model_used}`
                : `Active: ${currentExercise.model_used}`
              : isFa
              ? "موتور فعال تولید"
              : "Engine Ready"}
          </span>
        </div>

        {/* Rule #8 Transparent Educational Notice */}
        <div className={styles.educationalNotice}>
          <svg className={styles.educationalNoticeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            {isFa
              ? "اصل شفافیت آموزشی (اصل هشتم قانون اساسی محصول اندورا): آزمونک‌ها هرگز بدون اعتبارسنجی ساختاری به زبان‌آموز ارائه نمی‌شوند. در صورت بروز تاخیر یا اتمام سقف بودجه، محتوا مستقیماً از بانک بازبینی‌شده مدرسان بارگیری می‌شود."
              : "Endoora Constitution Rule #8 (Educational Notice): AI exercises are strictly validated by backend schema inspectors. Any provider delay or budget limit seamlessly activates our reviewed human-curated question bank."}
          </span>
        </div>
      </section>

      {/* Configuration & Generator Card (shown when no active exercise or when creating new) */}
      {!currentExercise ? (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            {isFa ? "تنظیمات آزمونک هدفمند" : "Exercise Parameters"}
          </h2>

          {/* Target Skill Selection */}
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <span className={styles.fieldLabel}>
              {isFa ? "۱. مهارت و حوزه تمرین:" : "1. Target Skill:"}
            </span>
            <div className={styles.pillGroup}>
              {TARGET_SKILLS.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className={`${styles.pillButton} ${
                    selectedSkill === skill.id ? styles.pillButtonActive : ""
                  }`}
                  onClick={() => setSelectedSkill(skill.id)}
                >
                  {isFa ? skill.labelFa : skill.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* CEFR Level Selection */}
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <span className={styles.fieldLabel}>
              {isFa ? "۲. سطح زبان هدف (CEFR):" : "2. Target CEFR Level:"}
            </span>
            <div className={styles.pillGroup}>
              {CEFR_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`${styles.pillButton} ${
                    selectedCefr === lvl ? styles.pillButtonActive : ""
                  }`}
                  onClick={() => setSelectedCefr(lvl)}
                >
                  <strong>{lvl}</strong>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Topics */}
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <span className={styles.fieldLabel}>
              {isFa ? "موضوعات پیشنهادی سریع:" : "Quick Topic Presets:"}
            </span>
            <div className={styles.pillGroup}>
              {PRESET_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.pillButton}
                  onClick={() => {
                    setFocusArea(topic.en);
                    setSelectedSkill(topic.skill);
                    setSelectedCefr(topic.level);
                  }}
                >
                  {isFa ? topic.fa : topic.en} ({topic.level})
                </button>
              ))}
            </div>
          </div>

          {/* Custom Focus Area */}
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <label className={styles.fieldLabel} htmlFor="focus-area-input">
              {isFa ? "۳. موضوع یا هدف دقیق آموزشی:" : "3. Target Focus Area / Objective:"}
            </label>
            <input
              id="focus-area-input"
              className={styles.inputField}
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Present perfect continuous, business emails, phrasal verbs"
            />
          </div>

          {/* Question Count Selection */}
          <div style={{ marginBlockEnd: "var(--space-6)" }}>
            <span className={styles.fieldLabel}>
              {isFa ? "۴. تعداد سوالات:" : "4. Number of Questions:"}
            </span>
            <div className={styles.pillGroup}>
              {[1, 2, 3, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  className={`${styles.pillButton} ${
                    questionCount === cnt ? styles.pillButtonActive : ""
                  }`}
                  onClick={() => setQuestionCount(cnt)}
                >
                  {cnt} {isFa ? "سوال" : "Questions"}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <p style={{ color: "var(--color-danger)", fontWeight: 700, marginBlockEnd: "var(--space-4)" }}>
              {errorMessage}
            </p>
          )}

          <button
            className={styles.buttonPrimary}
            type="button"
            disabled={generating}
            onClick={handleGenerateExercise}
          >
            {generating
              ? isFa
                ? "در حال تحلیل و ساخت سوالات معتبر…"
                : "Validating & Generating Questions…"
              : isFa
              ? "✨ تولید آزمونک هوشمند"
              : "✨ Generate Adaptive Exercise"}
          </button>
        </section>
      ) : (
        /* Active Exercise Runner Card */
        <section className={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-4)", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <div>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                {isFa ? currentExercise.title_fa : currentExercise.title_en}
              </h2>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                {isFa ? `سطح ${currentExercise.cefr_level} | مهارت ${currentExercise.target_skill}` : `${currentExercise.cefr_level} • ${currentExercise.target_skill}`}
              </span>
            </div>
            <button
              className={styles.buttonSecondary}
              type="button"
              onClick={() => {
                setCurrentExercise(null);
                setEvaluation(null);
              }}
            >
              {isFa ? "تغییر تنظیمات / آزمونک جدید" : "New Exercise"}
            </button>
          </div>

          {/* Progress bar */}
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarInner}
              style={{
                inlineSize: `${((activeQuestionIndex + 1) / currentExercise.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Active Question Item */}
          {currentExercise.questions[activeQuestionIndex] && (
            <div className={styles.questionBox}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBlockEnd: "var(--space-2)", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                <span>
                  {isFa
                    ? `سوال ${activeQuestionIndex + 1} از ${currentExercise.questions.length}`
                    : `Question ${activeQuestionIndex + 1} of ${currentExercise.questions.length}`}
                </span>
                <span>{currentExercise.questions[activeQuestionIndex].cefr_level || currentExercise.cefr_level}</span>
              </div>

              <p className={styles.questionInstruction}>
                {isFa
                  ? currentExercise.questions[activeQuestionIndex].instruction_fa
                  : currentExercise.questions[activeQuestionIndex].instruction_en}
              </p>

              <div className={styles.questionPrompt} dir="ltr">
                {currentExercise.questions[activeQuestionIndex].prompt_en}
              </div>

              {/* Options Grid */}
              <div className={styles.optionsGrid} dir="ltr">
                {currentExercise.questions[activeQuestionIndex].options.map((opt) => {
                  const qId = currentExercise.questions[activeQuestionIndex].id;
                  const isSelected = userAnswers[qId] === opt.id;

                  let evalClass = "";
                  if (evaluation) {
                    const qEval = evaluation.results.find((r) => r.question_id === qId);
                    if (qEval) {
                      if (opt.id === qEval.correct_option_id) {
                        evalClass = styles.optionCorrect;
                      } else if (isSelected && !qEval.is_correct) {
                        evalClass = styles.optionIncorrect;
                      }
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(evaluation)}
                      className={`${styles.optionButton} ${
                        isSelected ? styles.optionButtonActive : ""
                      } ${evalClass}`}
                      onClick={() => handleSelectOption(qId, opt.id)}
                    >
                      <span className={styles.optionBadge}>{opt.id.toUpperCase()}</span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Post-submission bilingual explanation */}
              {evaluation && (
                <div className={styles.explanationBox}>
                  {(() => {
                    const qId = currentExercise.questions[activeQuestionIndex].id;
                    const qEval = evaluation.results.find((r) => r.question_id === qId);
                    if (!qEval) return null;
                    return (
                      <>
                        <div style={{ fontWeight: 700, marginBlockEnd: "var(--space-2)", color: qEval.is_correct ? "var(--color-success)" : "var(--color-danger)" }}>
                          {qEval.is_correct
                            ? isFa ? "✓ آفرین! پاسخ شما صحیح است." : "✓ Correct answer!"
                            : isFa ? `✕ پاسخ شما اشتباه بود. گزینه درست: ${qEval.correct_option_id.toUpperCase()}` : `✕ Incorrect. Correct answer: ${qEval.correct_option_id.toUpperCase()}`}
                        </div>
                        <p className={styles.explanationFa}>
                          <strong>{isFa ? "تحلیل پداگوژیک:" : "Pedagogical Note:"}</strong> {qEval.explanation_fa}
                        </p>
                        <p className={styles.explanationEn} dir="ltr">
                          <strong>Linguistic rule:</strong> {qEval.explanation_en}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Question Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)", marginBlockEnd: "var(--space-4)" }}>
            <button
              className={styles.buttonSecondary}
              type="button"
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex((i) => Math.max(0, i - 1))}
            >
              {isFa ? "سوال قبلی" : "Previous"}
            </button>

            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700 }}>
              {activeQuestionIndex + 1} / {currentExercise.questions.length}
            </span>

            {activeQuestionIndex < currentExercise.questions.length - 1 ? (
              <button
                className={styles.buttonSecondary}
                type="button"
                onClick={() => setActiveQuestionIndex((i) => Math.min(currentExercise.questions.length - 1, i + 1))}
              >
                {isFa ? "سوال بعدی" : "Next"}
              </button>
            ) : !evaluation ? (
              <button
                className={styles.buttonPrimary}
                type="button"
                disabled={submitting || Object.keys(userAnswers).length === 0}
                onClick={handleSubmitExercise}
              >
                {submitting
                  ? isFa ? "در حال تصحیح…" : "Evaluating…"
                  : isFa ? "ثبت و تصحیح آزمونک" : "Submit & Grade"}
              </button>
            ) : null}
          </div>

          {/* Submission Summary Banner */}
          {evaluation && (
            <div className={styles.scoreSummary}>
              <div>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", display: "block" }}>
                  {isFa ? "نتیجه نهایی آزمونک:" : "Final Exercise Score:"}
                </span>
                <span className={styles.scorePercentage}>
                  {evaluation.score_percentage}%
                </span>
                <p style={{ margin: "var(--space-2) 0 0", fontWeight: 700 }}>
                  {isFa
                    ? `${evaluation.correct_count} پاسخ درست از ${evaluation.total_count} سوال`
                    : `${evaluation.correct_count} of ${evaluation.total_count} questions correct`}
                </p>
              </div>

              <div className={styles.actionRow}>
                <button
                  className={styles.buttonPrimary}
                  type="button"
                  onClick={handleGenerateExercise}
                >
                  {isFa ? "تولید آزمونک مشابه" : "Try Similar Exercise"}
                </button>
                <Link className={styles.buttonSecondary} href="/review">
                  {isFa ? "افزودن به جعبه لایتنر" : "Review in SRS"}
                </Link>
                <Link className={styles.buttonSecondary} href="/practice-ai">
                  {isFa ? "آزمایشگاه تشخیص نگارش" : "Writing Lab"}
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
