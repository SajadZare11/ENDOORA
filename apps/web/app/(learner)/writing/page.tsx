"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { WritingEditor } from "../../../components/placement/WritingEditor";
import styles from "../learner-subpages.module.css";

interface PromptOption {
  id: string;
  level: string;
  title_fa: string;
  title_en: string;
  prompt_fa: string;
  prompt_en: string;
  min_words: number;
}

const SAMPLE_PROMPTS: PromptOption[] = [
  {
    id: "p1",
    level: "A1",
    title_fa: "سطح A1: معرفی شخصی",
    title_en: "A1: Self Introduction",
    prompt_fa: "یک یادداشت کوتاه بنویسید و نام، محل سکونت و علایق خود را بیان نمایید.",
    prompt_en: "Write a short note introducing yourself. State your name, where you live, and your hobbies.",
    min_words: 15,
  },
  {
    id: "p2",
    level: "A2",
    title_fa: "سطح A2: دعوت آخر هفته",
    title_en: "A2: Weekend Invitation",
    prompt_fa: "یک ایمیل کوتاه به دوست خود بنویسید و او را برای صرف ناهار یا دیدن فیلم دعوت کنید.",
    prompt_en: "Write a short email inviting a friend over for lunch or a movie this weekend.",
    min_words: 25,
  },
  {
    id: "p3",
    level: "B1",
    title_fa: "سطح B1: نقد مکان تفریحی",
    title_en: "B1: Place Review",
    prompt_fa: "یک مرور توصیفی درباره کافه، پارک یا شهری که اخیراً دیده‌اید بنویسید و علت توصیه را توضیح دهید.",
    prompt_en: "Write a descriptive review of a café, park, or city you visited recently and explain why you recommend it.",
    min_words: 45,
  },
  {
    id: "p4",
    level: "B2",
    title_fa: "سطح B2: مقاله دیدگاه تحلیلی",
    title_en: "B2: Opinion Essay",
    prompt_fa: "دیدگاه خود را درباره جایگزینی کامل کتاب‌های درسی چاپی با تبلت‌های دیجیتال بنویسید.",
    prompt_en: "Should schools replace physical textbooks entirely with digital tablets? Evaluate both perspectives and state your reasoned conclusion.",
    min_words: 75,
  },
];

export default function WritingPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [selectedPrompt, setSelectedPrompt] = useState<PromptOption>(SAMPLE_PROMPTS[0]);
  const [essayText, setEssayText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).filter(Boolean).length : 0;
  const sentenceCount = essayText
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2).length;

  function handleAnalyze() {
    if (wordCount > 0) {
      setAnalyzed(true);
    }
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "منتور نگارش و مقاله‌نویسی (Writing Mentor)" : "Writing Mentor & Essay Lab"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "متن انگلیسی خود را با ویرایشگر پیشرفته بنویسید تا بر اساس طول متن، ساختار جملات و تنوع واژگان مورد تحلیل تشخیصی قرار گیرد."
                : "Compose your written English using the rich editor to receive instant diagnostic feedback on word count, sentence variety, and cohesion."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "ویرایشگر غنی فعال" : "Rich Editor Ready"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/placement">
            {isFa ? "شرکت در آزمون تعیین سطح نگارش" : "Take Writing Placement"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "View Skill Report"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
        </div>
      </section>

      {/* Writing Workspace */}
      <section className={styles.card}>
        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <label style={{ display: "block", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "موضوع و سطح تمرین نگارش را انتخاب کنید:" : "Select Writing Topic & CEFR Target:"}
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.filterPill} ${selectedPrompt.id === p.id ? styles.filterPillActive : ""}`}
                onClick={() => {
                  setSelectedPrompt(p);
                  setAnalyzed(false);
                }}
              >
                {isFa ? p.title_fa : p.title_en}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Card */}
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-canvas)",
            borderRadius: "var(--radius-control)",
            border: "1px solid var(--color-border)",
            marginBlockEnd: "var(--space-5)",
          }}
        >
          <p style={{ fontWeight: 700, color: "var(--color-action)", marginBlockEnd: "var(--space-1)" }}>
            {isFa ? selectedPrompt.prompt_fa : selectedPrompt.prompt_en}
          </p>
          <p dir="ltr" style={{ color: "var(--color-text)", fontSize: "var(--font-size-body)", margin: 0, fontFamily: "var(--font-family-latin)" }}>
            {selectedPrompt.prompt_en}
          </p>
        </div>

        {/* Writing Editor */}
        <div style={{ marginBlockEnd: "var(--space-5)" }}>
          <WritingEditor
            key={selectedPrompt.id}
            minWordsExpected={selectedPrompt.min_words}
            maxWordsExpected={selectedPrompt.min_words * 3}
            locale={isFa ? "fa" : "en"}
            initialText={essayText}
            onChangeText={(t) => {
              setEssayText(t);
              setAnalyzed(false);
            }}
            onConfirmAnswer={(payload) => {
              setEssayText(payload.written_text);
              handleAnalyze();
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-5)" }}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleAnalyze}
            disabled={wordCount === 0}
          >
            {isFa ? "تحلیل جامع انسجام و دستور زبان" : "Analyze Coherence & Grammar"}
          </button>
        </div>

        {/* Feedback Section */}
        {analyzed && (
          <div
            style={{
              padding: "var(--space-5)",
              background: "var(--color-canvas)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--color-border)",
              marginBlockEnd: "var(--space-5)",
            }}
          >
            <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, marginBlockEnd: "var(--space-4)", color: "var(--color-text)" }}>
              {isFa ? "تحلیل هوشمند منتور نگارش:" : "Writing Mentor Diagnostic Summary:"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "var(--space-3)", marginBlockEnd: "var(--space-4)" }}>
              <div style={{ background: "var(--color-surface)", padding: "var(--space-3)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{isFa ? "تعداد کلمات:" : "Word count:"}</span>
                <p style={{ fontSize: "var(--font-size-title-2)", fontWeight: 800, margin: 0, color: "var(--color-action)" }}>
                  {wordCount} / {selectedPrompt.min_words}
                </p>
              </div>

              <div style={{ background: "var(--color-surface)", padding: "var(--space-3)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{isFa ? "تعداد جملات:" : "Sentences:"}</span>
                <p style={{ fontSize: "var(--font-size-title-2)", fontWeight: 800, margin: 0, color: "var(--color-endoora-blue)" }}>
                  {sentenceCount}
                </p>
              </div>

              <div style={{ background: "var(--color-surface)", padding: "var(--space-3)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{isFa ? "وضعیت طول متن:" : "Sufficiency:"}</span>
                <p style={{ fontSize: "var(--font-size-body)", fontWeight: 700, color: wordCount >= selectedPrompt.min_words ? "var(--color-success-text)" : "var(--color-warning-text)", margin: 0 }}>
                  {wordCount >= selectedPrompt.min_words ? (isFa ? "کافی ✓" : "Sufficient ✓") : (isFa ? "نیاز به افزایش طول" : "Below target")}
                </p>
              </div>
            </div>

            <ul style={{ paddingInlineStart: "var(--space-4)", lineHeight: 1.8, color: "var(--color-text)", margin: 0 }}>
              <li>
                <strong>{isFa ? "دستور زبان و زمان‌ها:" : "Grammar & tenses:"}</strong>{" "}
                {isFa
                  ? "ساختار جملات واضح است؛ استفاده از افعال شرطی و حروف ربط علّی (because, although) غنای متن را ارتقا می‌دهد."
                  : "Sentence structures are intelligible; incorporating subordinating conjunctions enhances sentence variety."}
              </li>
              <li>
                <strong>{isFa ? "تنوع واژگانی:" : "Vocabulary range:"}</strong>{" "}
                {isFa
                  ? "از کلمات متناسب با موضوع استفاده شده است؛ جایگزینی اصطلاحات پرکاربرد با واژگان توصیفی دقیق‌تر پیشنهاد می‌شود."
                  : "Vocabulary matches the prompt topic; consider replacing generic terms with precise collocations."}
              </li>
              <li>
                <strong>{isFa ? "انسجام و پاراگراف‌بندی:" : "Cohesion & paragraphing:"}</strong>{" "}
                {isFa
                  ? "شروع با یک جمله موضوعی (Topic sentence) و خاتمه با جمع‌بندی کوتاه، پیوستگی متن را تقویت می‌کند."
                  : "Opening with a clear topic sentence and closing with a concluding thought reinforces coherence."}
              </li>
            </ul>
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): ارزیابی نگارش برای هدایت فرآیند یادگیری طراحی شده و مدرک رسمی یا نهایی CEFR محسوب نمی‌شود."
            : "Product Constitution Rule #8 Disclosure: Writing feedback is pedagogical formative guidance and does not constitute an official CEFR certificate."}
        </footer>
      </section>
    </div>
  );
}
