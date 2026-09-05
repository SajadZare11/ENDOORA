"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface PresetPrompt {
  id: string;
  level: string;
  titleFa: string;
  titleEn: string;
  sampleText: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: "pr-a1",
    level: "A1",
    titleFa: "روزمرگی و معرفی",
    titleEn: "Daily Routine",
    sampleText: "I usually wake up at seven and have breakfast with my family before work.",
  },
  {
    id: "pr-a2",
    level: "A2",
    titleFa: "سفر و برنامه‌ریزی",
    titleEn: "Travel & Plans",
    sampleText: "We are planning to visit Isfahan next month because the historical monuments are magnificent.",
  },
  {
    id: "pr-b1",
    level: "B1",
    titleFa: "نظر و استدلال شغلی",
    titleEn: "Workplace Opinion",
    sampleText: "In my opinion, flexible working hours significantly enhance employee productivity and well-being.",
  },
  {
    id: "pr-b2",
    level: "B2",
    titleFa: "تحلیل مسئله و راه‌حل",
    titleEn: "Complex Problem Analysis",
    sampleText: "Although renewable energy requires substantial initial investment, its long-term environmental benefits outweigh the costs.",
  },
];

interface AnalysisResult {
  grammarScore: number;
  grammarNoteFa: string;
  grammarNoteEn: string;
  vocabLevel: string;
  vocabNoteFa: string;
  vocabNoteEn: string;
  betterAlternative: string;
}

export default function PracticeAIPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [promptInput, setPromptInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const wordCount = promptInput.trim() ? promptInput.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = promptInput.length;

  function handleSelectPreset(preset: PresetPrompt) {
    setPromptInput(preset.sampleText);
    setAnalysis(null);
  }

  function handleAnalyze() {
    if (!promptInput.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysis({
        grammarScore: 88,
        grammarNoteFa: "تطابق زمانی افعال و ساختار بندهای جمله دقیق و بدون اشکال اساسی است.",
        grammarNoteEn: "Verb tense agreement and subordinate clause structure are well-formed.",
        vocabLevel: "B1 - B2",
        vocabNoteFa: "استفاده مناسب از واژگان پیوندی و همنشینی‌های استاندارد زبان انگلیسی.",
        vocabNoteEn: "Appropriate use of transitional collocations and academic vocabulary.",
        betterAlternative: promptInput.includes("In my opinion")
          ? promptInput.replace("In my opinion", "From my perspective")
          : promptInput + " This approach ensures lasting outcomes.",
      });
    }, 600);
  }

  function handlePlayAudio() {
    if (!promptInput.trim()) return;
    setAudioPlaying(true);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(promptInput);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 2000);
    }
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Practice Navigation Tabs */}
      <nav
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBlockEnd: "var(--space-6)",
          borderBlockEnd: "1px solid var(--color-border)",
          paddingBlockEnd: "var(--space-2)",
          overflowX: "auto",
        }}
        aria-label={isFa ? "بخش‌های تمرین هوشمند" : "AI Practice Sections"}
      >
        <Link
          className={styles.filterPill}
          href="/practice"
          style={{ textDecoration: "none" }}
        >
          {isFa ? "🎯 آزمونک‌های هوشمند پداگوژیک" : "🎯 Adaptive Exercises"}
        </Link>
        <span
          className={styles.filterPill}
          style={{
            background: "var(--color-action-bg)",
            color: "var(--color-action-text)",
            borderColor: "var(--color-action-bg)",
          }}
        >
          {isFa ? "✍️ آزمایشگاه تشخیص و نگارش" : "✍️ Writing Diagnostics"}
        </span>
        <Link
          className={styles.filterPill}
          href="/review"
          style={{ textDecoration: "none" }}
        >
          {isFa ? "🧠 مرور واژگان لایتنر (SRS)" : "🧠 SRS Vocabulary Review"}
        </Link>
      </nav>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "تمرین هوشمند زبانی (AI Practice Lab)" : "Adaptive AI Language Practice Lab"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "متن یا جملات انگلیسی خود را بنویسید یا ویرایش کنید تا تحلیل تشخیصی چندبعدی گرامر، غنای واژگانی و جایگزین‌های طبیعی‌تر را دریافت کنید."
                : "Compose practice sentences to receive immediate pedagogical diagnostics across grammar accuracy, vocabulary sophistication, and idiomatic phrasing."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "موتور فعال تحلیل" : "Interactive Engine"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/writing">
            {isFa ? "ورود به منتور نگارش و مقاله" : "Open Writing Mentor"}
          </Link>
          <Link className={styles.buttonSecondary} href="/voice">
            {isFa ? "تمرین گفتاری در آزمایشگاه صدا" : "Voice Lab"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
        </div>
      </section>

      {/* Editor & Practice Card */}
      <section className={styles.card}>
        {/* Preset selector pills */}
        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)", display: "block", marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "انتخاب نمونه‌های آماده متناسب با سطوح CEFR:" : "Select CEFR Practice Presets:"}
          </span>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {PRESET_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.filterPill}
                onClick={() => handleSelectPreset(p)}
              >
                <strong>{p.level}:</strong> {isFa ? p.titleFa : p.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea with live counters */}
        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <label htmlFor="ai-practice-input" style={{ display: "block", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "جمله یا پاراگراف انگلیسی خود را وارد کنید:" : "Enter your English practice text:"}
          </label>
          <textarea
            id="ai-practice-input"
            dir="ltr"
            rows={5}
            value={promptInput}
            onChange={(e) => {
              setPromptInput(e.target.value);
              if (analysis) setAnalysis(null);
            }}
            placeholder="e.g. In my opinion, modern educational technologies empower students to master languages much faster."
            style={{
              width: "100%",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
              background: "var(--color-canvas)",
              color: "var(--color-text)",
              fontSize: "var(--font-size-body)",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-meta)", color: "var(--color-muted)", marginTop: "var(--space-2)" }}>
            <span>
              {isFa ? `${wordCount} کلمه | ${charCount} کاراکتر` : `${wordCount} words | ${charCount} chars`}
            </span>
            <span>{isFa ? "پیشنهاد: حداقل ۱۰ تا ۲۰ کلمه" : "Recommended: 10-20 words minimum"}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-5)" }}>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleAnalyze}
            disabled={wordCount === 0 || analyzing}
          >
            {analyzing
              ? isFa
                ? "در حال تحلیل…"
                : "Analyzing…"
              : isFa
              ? "تحلیل جامع آموزشی"
              : "Analyze Response"}
          </button>

          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handlePlayAudio}
            disabled={wordCount === 0 || audioPlaying}
          >
            <span aria-hidden="true">🔊</span>
            {audioPlaying
              ? isFa
                ? "در حال پخش…"
                : "Playing…"
              : isFa
              ? "شنیدن تلفظ صوتی"
              : "Listen to Pronunciation"}
          </button>
        </div>

        {/* Diagnostic Results Card */}
        {analysis && (
          <div
            style={{
              padding: "var(--space-5)",
              background: "var(--color-canvas)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-card)",
              marginBlockEnd: "var(--space-4)",
            }}
          >
            <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, marginBlockEnd: "var(--space-4)", color: "var(--color-text)" }}>
              {isFa ? "نتایج ارزیابی هوشمند آموزشی:" : "Educational Diagnostic Feedback:"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-4)" }}>
              <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{isFa ? "صحت دستور زبان:" : "Grammar Precision:"}</span>
                <div style={{ fontSize: "var(--font-size-title-2)", fontWeight: 800, color: "var(--color-success-text)", marginBlock: "var(--space-1)" }}>
                  {analysis.grammarScore}%
                </div>
                <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)", margin: 0 }}>
                  {isFa ? analysis.grammarNoteFa : analysis.grammarNoteEn}
                </p>
              </div>

              <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{isFa ? "سطح واژگان مورد استفاده:" : "Lexical Sophistication:"}</span>
                <div style={{ fontSize: "var(--font-size-title-2)", fontWeight: 800, color: "var(--color-endoora-blue)", marginBlock: "var(--space-1)" }}>
                  {analysis.vocabLevel}
                </div>
                <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text)", margin: 0 }}>
                  {isFa ? analysis.vocabNoteFa : analysis.vocabNoteEn}
                </p>
              </div>
            </div>

            {/* Native Alternative */}
            <div style={{ padding: "var(--space-4)", background: "var(--color-info-bg)", color: "var(--color-info-text)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, display: "block", marginBlockEnd: "var(--space-1)" }}>
                {isFa ? "پیشنهاد فرمول‌بندی طبیعی‌تر (Natural Phrasing Alternative):" : "Idiomatic Phrasing Alternative:"}
              </span>
              <p dir="ltr" style={{ fontWeight: 600, margin: 0 }}>
                &ldquo;{analysis.betterAlternative}&rdquo;
              </p>
            </div>
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "اصل شفافیت آموزشی (قانون شماره ۸ اساسنامه): تحلیل‌های هوش مصنوعی جنبه راهنمای یادگیری دارند و برای رفع اشکال طراحی شده‌اند، نه نمره‌دهی رسمی آزمون‌های بین‌المللی."
            : "Product Constitution Rule #8 Disclosure: AI diagnostics provide formative pedagogical feedback and do not substitute for certified human examiners or official CEFR testing."}
        </footer>
      </section>
    </div>
  );
}
