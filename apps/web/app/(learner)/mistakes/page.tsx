"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface MistakePattern {
  id: string;
  category: "all" | "grammar" | "vocabulary" | "writing" | "speaking";
  categoryLabelFa: string;
  categoryLabelEn: string;
  titleFa: string;
  titleEn: string;
  interferenceFa: string;
  interferenceEn: string;
  explanationFa: string;
  explanationEn: string;
  exampleWrong: string;
  exampleCorrect: string;
  options: string[];
  correctIndex: number;
}

const COMMON_MISTAKES: MistakePattern[] = [
  {
    id: "mis-001",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    categoryLabelEn: "Grammar & Tenses",
    titleFa: "تطابق فاعل و فعل سوم‌شخص در حال ساده",
    titleEn: "Third-Person Singular Agreement (-s/-es)",
    interferenceFa: "در زبان فارسی شناسه «-د» برای سوم شخص اختیاری نیست اما حذف -s در انگلیسی خطای رایج است.",
    interferenceEn: "Persian learners often drop the third-person singular suffix under L1 transfer.",
    explanationFa: "فعل‌های زمان حال ساده برای فاعل‌های he / she / it و اسامی مفرد، به پسوند -s یا -es نیاز دارند.",
    explanationEn: "Third-person singular subjects in present simple tense mandate the -s or -es verb ending.",
    exampleWrong: "She go to university every morning by subway.",
    exampleCorrect: "She goes to university every morning by subway.",
    options: ["She go to university...", "She goes to university...", "She going to university..."],
    correctIndex: 1,
  },
  {
    id: "mis-002",
    category: "grammar",
    categoryLabelFa: "دستور زبان (Grammar)",
    categoryLabelEn: "Conditionals",
    titleFa: "ساختار شرطی نوع سوم (Third Conditional)",
    titleEn: "Third Conditional Structure for Unreal Past",
    interferenceFa: "ترجمه کلمه به کلمه ساختار «اگر می‌دانستم می‌گفتم» باعث اشتباه در استفاده از would have می‌شود.",
    interferenceEn: "Direct word-for-word translation leads to omitting 'would have + past participle'.",
    explanationFa: "در بخش نتیجه شرطی نوع سوم، همواره از ترکیب would have + قسمت سوم فعل (p.p) استفاده می‌شود.",
    explanationEn: "The main result clause of a third conditional strictly requires 'would have + past participle'.",
    exampleWrong: "If they had trained harder, they would win the championship.",
    exampleCorrect: "If they had trained harder, they would have won the championship.",
    options: ["...would win...", "...would have won...", "...will win..."],
    correctIndex: 1,
  },
  {
    id: "mis-003",
    category: "vocabulary",
    categoryLabelFa: "واژگان (Vocabulary)",
    categoryLabelEn: "Collocations & False Friends",
    titleFa: "هم‌آیی فعل و اسم (Make vs Do)",
    titleEn: "Collocation Distinction: Make vs Do",
    interferenceFa: "در فارسی فعل «انجام دادن» یا «کردن» برای همه موارد استفاده می‌شود، اما در انگلیسی متفاوت است.",
    interferenceEn: "Persian uses 'kardan' generally; English distinguishes between creation (make) and action (do).",
    explanationFa: "برای تصمیم‌گیری، اشتباه و پیشرفت از make استفاده می‌شود: make a decision, make a mistake.",
    explanationEn: "Collocations with choices and actions take 'make': make a decision, make progress, make an effort.",
    exampleWrong: "We need to do a decision before Friday.",
    exampleCorrect: "We need to make a decision before Friday.",
    options: ["do a decision", "make a decision", "take a decision"],
    correctIndex: 1,
  },
  {
    id: "mis-004",
    category: "writing",
    categoryLabelFa: "نگارش (Writing)",
    categoryLabelEn: "Sentence Structure",
    titleFa: "جملات متصل نادرست (Comma Splice)",
    titleEn: "Run-on Sentences & Comma Splices",
    interferenceFa: "در فارسی پیوند دو جمله کامل با ویرگول مرسوم است اما در نگارش استاندارد انگلیسی خطا محسوب می‌شود.",
    interferenceEn: "Joining independent clauses with merely a comma violates formal English mechanics.",
    explanationFa: "برای اتصال دو جمله کامل باید از نقطه، نقطه-ویرگول (;) یا کلمات ربط مانند and, but, however استفاده کرد.",
    explanationEn: "Separate independent clauses with a period, semicolon, or a coordinating conjunction with a comma.",
    exampleWrong: "The report was delayed, the team worked overnight to complete it.",
    exampleCorrect: "The report was delayed; however, the team worked overnight to complete it.",
    options: [
      "...delayed, the team worked...",
      "...delayed; however, the team worked...",
      "...delayed because the team worked...",
    ],
    correctIndex: 1,
  },
  {
    id: "mis-005",
    category: "speaking",
    categoryLabelFa: "گفتاری (Speaking)",
    categoryLabelEn: "Pronunciation & Stress",
    titleFa: "تلفظ و استرس کلمات با پیشوند و پسوند",
    titleEn: "Syllable Stress Shifts in Derived Words",
    interferenceFa: "تغییر استرس از اسم به صفت (مانند Photograph به Photographic) در گفتار زبان‌آموزان نادیده گرفته می‌شود.",
    interferenceEn: "Learners frequently freeze primary stress on the base syllable instead of adapting to affixes.",
    explanationFa: "در کلمه photograph استرس روی سیلاب اول است، در photographer روی سیلاب دوم و در photographic روی سیلاب سوم.",
    explanationEn: "Primary stress shifts across syllables: PHOH-tograph -> pho-TOG-rapher -> photo-GRAPH-ic.",
    exampleWrong: "She is a pho-to-GRAPH-er (misplaced stress on third syllable).",
    exampleCorrect: "She is a pho-TOG-ra-pher (correct stress on second syllable).",
    options: ["PHOH-tographer", "pho-TOG-rapher", "photo-GRAPH-er"],
    correctIndex: 1,
  },
];

export default function MistakesPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeCategory, setActiveCategory] = useState<"all" | "grammar" | "vocabulary" | "writing" | "speaking">("all");
  const [testedAnswers, setTestedAnswers] = useState<Record<string, number>>({});

  const filteredMistakes =
    activeCategory === "all"
      ? COMMON_MISTAKES
      : COMMON_MISTAKES.filter((m) => m.category === activeCategory);

  function handleSelectOption(mistakeId: string, optionIndex: number) {
    setTestedAnswers((prev) => ({ ...prev, [mistakeId]: optionIndex }));
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
              {isFa ? "ژنوم خطاهای یادگیری (Mistake Genome)" : "Mistake Genome & Linguistic Diagnostics"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "ریشه‌یابی علمی خطاهای تکرارشونده بر اساس تداخل زبان مادری فارسی با ساختارهای انگلیسی، بدون برچسب‌زنی منفی."
                : "Scientific root-cause analysis of recurring error patterns informed by Persian-English L1 transfer, turning errors into deliberate mastery."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "تحلیل الگوهای زنده" : "Active Diagnostics"}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/today">
            {isFa ? "تمرین در مأموریت روزانه" : "Practice in Daily Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/review">
            {isFa ? "مرور در سیستم SRS" : "Spaced Repetition Review"}
          </Link>
          <Link className={styles.buttonSecondary} href="/practice-ai">
            {isFa ? "تمرین آزاد با هوش مصنوعی" : "AI Practice Sandbox"}
          </Link>
        </div>
      </section>

      {/* Filter Category Pills */}
      <section className={styles.card}>
        <div className={styles.filterBar} role="tablist" aria-label={isFa ? "فیلتر دسته‌بندی خطاها" : "Mistake Categories"}>
          {[
            { id: "all", labelFa: "همه الگوها (۵)", labelEn: "All Patterns (5)" },
            { id: "grammar", labelFa: "دستور زبان", labelEn: "Grammar" },
            { id: "vocabulary", labelFa: "واژگان و هم‌آیی", labelEn: "Vocabulary" },
            { id: "writing", labelFa: "نگارش و اتصال", labelEn: "Writing Mechanics" },
            { id: "speaking", labelFa: "تلفظ و استرس", labelEn: "Speaking & Stress" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.id}
              className={`${styles.filterPill} ${activeCategory === tab.id ? styles.filterPillActive : ""}`}
              onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
            >
              {isFa ? tab.labelFa : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Pattern List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {filteredMistakes.map((item) => {
            const userAnswer = testedAnswers[item.id];
            const hasAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === item.correctIndex;

            return (
              <article
                key={item.id}
                style={{
                  padding: "var(--space-5)",
                  background: "var(--color-canvas)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-2)" }}>
                  <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 800, color: "var(--color-action)" }}>
                    {isFa ? item.categoryLabelFa : item.categoryLabelEn}
                  </span>
                  <code style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>{item.id}</code>
                </div>

                <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
                  {isFa ? item.titleFa : item.titleEn}
                </h3>

                {/* Linguistic Root Cause / Interference */}
                <div
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    background: "var(--color-warning-bg)",
                    color: "var(--color-warning-text)",
                    borderRadius: "var(--radius-control)",
                    fontSize: "var(--font-size-meta)",
                    lineHeight: 1.6,
                    marginBlockEnd: "var(--space-4)",
                  }}
                >
                  <strong>{isFa ? "ریشه در تداخل زبانی (L1 Interference): " : "Language Transfer Root: "}</strong>
                  {isFa ? item.interferenceFa : item.interferenceEn}
                </div>

                <p style={{ color: "var(--color-text)", lineHeight: 1.7, marginBlockEnd: "var(--space-4)" }}>
                  {isFa ? item.explanationFa : item.explanationEn}
                </p>

                {/* Examples Comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-3)", marginBlockEnd: "var(--space-5)" }}>
                  <div
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--color-error-bg)",
                      color: "var(--color-error-text)",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                      {isFa ? "الگوی اشتباه رایج ✗" : "Common Error ✗"}
                    </span>
                    <p dir="ltr" style={{ fontWeight: 600, marginTop: "var(--space-1)", marginBlockEnd: 0 }}>
                      {item.exampleWrong}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "var(--space-3)",
                      background: "var(--color-success-bg)",
                      color: "var(--color-success-text)",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                      {isFa ? "الگوی صحیح و طبیعی ✓" : "Natural Correct Pattern ✓"}
                    </span>
                    <p dir="ltr" style={{ fontWeight: 600, marginTop: "var(--space-1)", marginBlockEnd: 0 }}>
                      {item.exampleCorrect}
                    </p>
                  </div>
                </div>

                {/* Interactive Fix & Check Sandbox */}
                <div
                  style={{
                    padding: "var(--space-4)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-control)",
                  }}
                >
                  <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-text)", display: "block", marginBlockEnd: "var(--space-2)" }}>
                    {isFa ? "تست سریع: کدام گزینه جمله را به صورت صحیح کامل می‌کند؟" : "Quick Check: Select the correct formulation:"}
                  </span>

                  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    {item.options.map((opt, idx) => {
                      const isSelected = userAnswer === idx;
                      return (
                        <button
                          key={opt}
                          type="button"
                          dir="ltr"
                          onClick={() => handleSelectOption(item.id, idx)}
                          style={{
                            padding: "var(--space-2) var(--space-4)",
                            borderRadius: "var(--radius-control)",
                            border: `1px solid ${isSelected ? "var(--color-action)" : "var(--color-border)"}`,
                            background: isSelected ? "var(--color-info-bg)" : "var(--color-canvas)",
                            color: "var(--color-text)",
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                            fontSize: "var(--font-size-meta)",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div
                      className={`${styles.feedbackBox} ${
                        isCorrect ? styles.feedbackBoxSuccess : styles.feedbackBoxWarning
                      }`}
                      role="status"
                    >
                      {isCorrect
                        ? isFa
                          ? "✓ آفرین! این کاربرد ساختار زبان را کاملاً دقیق و طبیعی رعایت می‌کند."
                          : "✓ Excellent! This is grammatically precise and idiomatically natural."
                        : isFa
                        ? "دوباره دقت کنید: این گزینه الگوی اشتباه مورد نظر را تکرار می‌کند. ساختار صحیح را از کادرهای بالا مرور کنید."
                        : "Review carefully: This reproduces the targeted error. Inspect the green box above for guidance."}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
