"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./mistakes.module.css";

interface MistakePatternItem {
  id: number | string;
  tag: string;
  category: string;
  title_fa: string;
  title_en: string;
  l1_interference_note_fa?: string;
  l1_interference_note_en?: string;
  description_fa?: string;
  description_en?: string;
  status: "recurring" | "occasional" | "disputed" | "mastered";
  severity: "minor" | "moderate" | "critical";
  evidence_count: number;
  is_disputed?: boolean;
  dispute_reason?: string;
  example_wrong?: string;
  example_correct?: string;
  quick_options?: string[];
  quick_correct_idx?: number;
}

const DEFAULT_PATTERNS: MistakePatternItem[] = [
  {
    id: 1,
    tag: "grammar.third_person_s",
    category: "grammar",
    title_fa: "تطابق فاعل و فعل سوم‌شخص در حال ساده",
    title_en: "Third-Person Singular Agreement (-s/-es)",
    l1_interference_note_fa: "در زبان فارسی شناسه فاعلی به همه اشخاص پیوند می‌خورد، اما در زبان انگلیسی صرفاً سوم‌شخص مفرد پسوند -s می‌گیرد.",
    l1_interference_note_en: "Persian uses uniform verb conjugation patterns; English isolates the third-person -s inflection.",
    status: "recurring",
    severity: "moderate",
    evidence_count: 4,
    example_wrong: "She go to university every morning by subway.",
    example_correct: "She goes to university every morning by subway.",
    quick_options: ["She go to university...", "She goes to university...", "She going to university..."],
    quick_correct_idx: 1,
  },
  {
    id: 2,
    tag: "grammar.third_conditional",
    category: "grammar",
    title_fa: "ساختار شرطی نوع سوم (فرضی در گذشته)",
    title_en: "Third Conditional Structure for Unreal Past",
    l1_interference_note_fa: "ترجمه کلمه به کلمه ساختار فرضی گذشته فارسی («اگر می‌دونستم می‌گفتم») باعث حذف would have در بند اصلی انگلیسی می‌شود.",
    l1_interference_note_en: "Word-for-word translation from Persian leads to omitting 'would have + past participle'.",
    status: "recurring",
    severity: "critical",
    evidence_count: 3,
    example_wrong: "If they had trained harder, they would win the championship.",
    example_correct: "If they had trained harder, they would have won the championship.",
    quick_options: ["...would win...", "...would have won...", "...will win..."],
    quick_correct_idx: 1,
  },
  {
    id: 3,
    tag: "collocation.make_vs_do",
    category: "collocation",
    title_fa: "همایند ساختار Make در برابر Do",
    title_en: "Collocation Distinction: Make vs Do",
    l1_interference_note_fa: "در زبان فارسی فعل «کردن/انجام دادن» هم برای ساختن و هم برای اقدام به کار می‌رود؛ اما انگلیسی تمایز صریحی بین make و do قائل است.",
    l1_interference_note_en: "Persian 'kardan' covers both actions; English distinguishes between creation/outcome (make) and activity (do).",
    status: "recurring",
    severity: "moderate",
    evidence_count: 2,
    example_wrong: "We need to do a decision before Friday.",
    example_correct: "We need to make a decision before Friday.",
    quick_options: ["do a decision", "make a decision", "take a decision"],
    quick_correct_idx: 1,
  },
  {
    id: 4,
    tag: "discourse.comma_splice",
    category: "discourse",
    title_fa: "جملات متصل نادرست (Comma Splice)",
    title_en: "Run-on Sentences & Comma Splices",
    l1_interference_note_fa: "در نگارش روان فارسی اتصال دو جمله کامل صرفاً با یک ویرگول کاملاً رایج است، اما در انگلیسی آکادمیک خطای گرامری است.",
    l1_interference_note_en: "Joining independent clauses with merely a comma violates formal English mechanics.",
    status: "occasional",
    severity: "minor",
    evidence_count: 1,
    example_wrong: "The report was delayed, the team worked overnight to complete it.",
    example_correct: "The report was delayed; however, the team worked overnight to complete it.",
    quick_options: ["...delayed, the team worked...", "...delayed; however, the team worked...", "...delayed because the team worked..."],
    quick_correct_idx: 1,
  },
  {
    id: 5,
    tag: "pronunciation.stress_shift",
    category: "pronunciation",
    title_fa: "جابه‌جایی استرس واژگان با پیشوند و پسوند",
    title_en: "Syllable Stress Shifts in Derived Words",
    l1_interference_note_fa: "تغییر استرس از اسم به صفت (مانند Photograph به Photographic) در گفتار زبان‌آموزان به دلیل عدم تنوع تکیه در فارسی مغفول می‌ماند.",
    l1_interference_note_en: "Learners frequently freeze primary stress on the base syllable instead of adapting to affixes.",
    status: "occasional",
    severity: "minor",
    evidence_count: 1,
    example_wrong: "She is a pho-to-GRAPH-er (misplaced stress).",
    example_correct: "She is a pho-TOG-ra-pher (correct stress on second syllable).",
    quick_options: ["PHOH-tographer", "pho-TOG-rapher", "photo-GRAPH-er"],
    quick_correct_idx: 1,
  },
];

export default function MistakesPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [patterns, setPatterns] = useState<MistakePatternItem[]>(DEFAULT_PATTERNS);
  const [activeTab, setActiveTab] = useState<"recurring" | "occasional" | "mastered" | "disputed">("recurring");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [testedAnswers, setTestedAnswers] = useState<Record<string | number, number>>({});
  const [disputeOpenId, setDisputeOpenId] = useState<number | string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  // Load from backend on mount
  useEffect(() => {
    async function loadGenome() {
      try {
        const res = await fetch("/api/mistakes/patterns/");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Merge with local pedagogical presentation fields if missing
            const merged = data.map((backendItem: MistakePatternItem) => {
              const defaultMatch = DEFAULT_PATTERNS.find((d) => d.tag === backendItem.tag);
              return {
                ...defaultMatch,
                ...backendItem,
              };
            });
            setPatterns(merged);
          }
        }
      } catch {
        // use default state
      }
    }
    void loadGenome();
  }, []);

  // Filter patterns
  const filteredPatterns = patterns.filter((p) => {
    const matchesTab = p.status === activeTab;
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesTab && matchesCategory;
  });

  // Summary counts
  const recurringCount = patterns.filter((p) => p.status === "recurring").length;
  const occasionalCount = patterns.filter((p) => p.status === "occasional").length;
  const masteredCount = patterns.filter((p) => p.status === "mastered").length;
  const disputedCount = patterns.filter((p) => p.status === "disputed").length;

  async function handleDisputeSubmit(patternId: number | string) {
    try {
      await fetch(`/api/mistakes/patterns/${patternId}/dispute/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: disputeReason }),
      });
    } catch {
      // offline optimistic update
    }

    setPatterns((prev) =>
      prev.map((p) =>
        p.id === patternId
          ? { ...p, status: "disputed", is_disputed: true, dispute_reason: disputeReason }
          : p
      )
    );
    setDisputeOpenId(null);
    setDisputeReason("");
  }

  async function handleResolve(patternId: number | string) {
    try {
      await fetch(`/api/mistakes/patterns/${patternId}/resolve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // offline optimistic update
    }

    setPatterns((prev) =>
      prev.map((p) => (p.id === patternId ? { ...p, status: "mastered" } : p))
    );
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Hero Header */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "ژنوم خطاهای یادگیری (Mistake Genome)" : "Mistake Genome & Linguistic Diagnostics"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "ریشه‌یابی علمی خطاهای تکرارشونده بر اساس تداخل زبان مادری فارسی با ساختارهای انگلیسی، بدون سرزنش و صرفاً به عنوان نقشه تمرین هدفمند."
                : "Scientific root-cause analysis of recurring error patterns informed by Persian-English L1 transfer, turning errors into deliberate mastery without shame."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? "موتور تشخیصی فعال" : "Active Diagnostics Engine"}
          </span>
        </div>

        {/* Rule #8 Transparent Educational Notice */}
        <div className={styles.educationalNotice}>
          <span>
            {isFa
              ? "اصل هشتم قانون اساسی محصول اندورا: یک اشتباه هرگز صفت دائمی شما نامیده نمی‌شود. هر الگو تنها پس از تکرار چندباره شواهد به عنوان «الگوی تکرارشونده» ثبت می‌شود و در صورت اعتراض یا تمرین موفق، بلافاصله اصلاح می‌گردد."
              : "Endoora Constitution Rule #8: A single error is never treated as permanent DNA. Patterns require multiple verified evidence occurrences before being flagged as recurring, and can always be disputed or mastered."}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/practice">
            {isFa ? "🎯 شروع تمرین متمرکز بر خطاها" : "🎯 Practice Recurring Mistakes"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/review">
            {isFa ? "مرور واژگان لایتنر (SRS)" : "SRS Vocabulary Review"}
          </Link>
        </div>
      </section>

      {/* Summary Statistics Grid */}
      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>
            {isFa ? "الگوهای فعال و تکرارشونده" : "Recurring Patterns"}
          </span>
          <span className={styles.summaryValue}>{recurringCount}</span>
          <span className={styles.summarySubtext}>
            {isFa ? "نیازمند تمرین هدفمند" : "Prioritized for practice"}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>
            {isFa ? "الگوهای تک‌موردی (زیر آستانه)" : "Occasional Slips"}
          </span>
          <span className={styles.summaryValue}>{occasionalCount}</span>
          <span className={styles.summarySubtext}>
            {isFa ? "در مرحله ارزیابی و رصد" : "Under monitoring"}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>
            {isFa ? "الگوهای تثبیت و حل‌شده" : "Mastered & Resolved"}
          </span>
          <span className={styles.summaryValue} style={{ color: "var(--color-success)" }}>
            {masteredCount}
          </span>
          <span className={styles.summarySubtext}>
            {isFa ? "موفقیت در تمرینات" : "Overcome through practice"}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>
            {isFa ? "موارد اعتراض و اصلاح" : "Disputed / Corrected"}
          </span>
          <span className={styles.summaryValue} style={{ color: "var(--color-muted)" }}>
            {disputedCount}
          </span>
          <span className={styles.summarySubtext}>
            {isFa ? "حذف از توصیه‌ها" : "Excluded from practice"}
          </span>
        </div>
      </section>

      {/* Primary Status Tabs */}
      <nav className={styles.tabBar} aria-label={isFa ? "تب‌های وضعیت ژنوم" : "Genome Status Tabs"}>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "recurring" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("recurring")}
        >
          {isFa ? `الگوهای تکرارشونده (${recurringCount})` : `Recurring Patterns (${recurringCount})`}
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "occasional" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("occasional")}
        >
          {isFa ? `الگوهای تک‌موردی (${occasionalCount})` : `Occasional Slips (${occasionalCount})`}
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "mastered" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("mastered")}
        >
          {isFa ? `تثبیت‌شده (${masteredCount})` : `Mastered (${masteredCount})`}
        </button>
        <button
          type="button"
          className={`${styles.tabItem} ${activeTab === "disputed" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("disputed")}
        >
          {isFa ? `موارد اعتراض (${disputedCount})` : `Disputed (${disputedCount})`}
        </button>
      </nav>

      {/* Secondary Category Filter Bar */}
      <div className={styles.filterBar}>
        {[
          { id: "all", labelFa: "همه حوزه‌ها", labelEn: "All Categories" },
          { id: "grammar", labelFa: "دستور زبان", labelEn: "Grammar" },
          { id: "collocation", labelFa: "همایندها", labelEn: "Collocations" },
          { id: "vocabulary", labelFa: "واژگان", labelEn: "Vocabulary" },
          { id: "discourse", labelFa: "نگارش و اتصال", labelEn: "Discourse" },
          { id: "pronunciation", labelFa: "تلفظ و استرس", labelEn: "Pronunciation" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`${styles.filterPill} ${activeCategory === cat.id ? styles.filterPillActive : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {isFa ? cat.labelFa : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Pattern Cards List */}
      <section className={styles.card}>
        {filteredPatterns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", color: "var(--color-muted)" }}>
            <p style={{ fontSize: "var(--font-size-card-title)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
              {isFa ? "هیچ الگویی در این بخش وجود ندارد." : "No patterns found in this view."}
            </p>
            <p>
              {isFa
                ? "با انجام تمرین‌های تطبیقی و آزمونک‌ها، داده‌های ژنوم اشتباهات به‌روزرسانی می‌شوند."
                : "Complete adaptive exercises and missions to dynamically update your Mistake Genome."}
            </p>
            <Link className={styles.buttonPrimary} href="/practice" style={{ marginBlockStart: "var(--space-4)" }}>
              {isFa ? "رفتن به بخش تمرین هوشمند" : "Open Practice"}
            </Link>
          </div>
        ) : (
          filteredPatterns.map((item) => {
            const userAnswer = testedAnswers[item.id];
            const hasAnswered = userAnswer !== undefined;
            const isCorrect = item.quick_correct_idx !== undefined && userAnswer === item.quick_correct_idx;

            return (
              <article key={item.id} className={styles.patternCard}>
                <div className={styles.patternHeader}>
                  <div>
                    <span className={styles.patternCategory}>{item.category}</span>
                    <h2 className={styles.patternTitle}>
                      {isFa ? item.title_fa : item.title_en}
                    </h2>
                  </div>

                  <div className={styles.badgeGroup}>
                    <span
                      className={`${styles.statusBadge} ${
                        item.status === "recurring"
                          ? styles.statusRecurring
                          : item.status === "mastered"
                          ? styles.statusMastered
                          : item.status === "disputed"
                          ? styles.statusDisputed
                          : styles.statusOccasional
                      }`}
                    >
                      {item.status === "recurring"
                        ? isFa ? "الگوی تکرارشونده" : "Recurring"
                        : item.status === "mastered"
                        ? isFa ? "تثبیت‌شده" : "Mastered"
                        : item.status === "disputed"
                        ? isFa ? "مورد اعتراض" : "Disputed"
                        : isFa ? "تک‌موردی (بررسی)" : "Occasional"}
                    </span>
                    <span
                      className={`${styles.statusBadge} ${
                        item.severity === "critical" ? styles.severityCritical : ""
                      }`}
                    >
                      {isFa
                        ? `شواهد: ${item.evidence_count} بار`
                        : `Evidence: ${item.evidence_count}x`}
                    </span>
                  </div>
                </div>

                {/* Persian L1 Transfer Root Cause */}
                {item.l1_interference_note_fa && (
                  <div className={styles.transferBox}>
                    <strong>
                      {isFa ? "ریشه در تداخل زبان مادری (L1 Transfer): " : "Language Transfer Root: "}
                    </strong>
                    {isFa ? item.l1_interference_note_fa : item.l1_interference_note_en}
                  </div>
                )}

                {/* Wrong vs. Correct Contrast Boxes */}
                {item.example_wrong && item.example_correct && (
                  <div className={styles.contrastGrid}>
                    <div className={styles.wrongBox}>
                      <span className={styles.boxLabel}>
                        {isFa ? "الگوی چالش‌برانگیز ✗" : "Target Challenge ✗"}
                      </span>
                      <p dir="ltr" style={{ margin: 0, fontWeight: 600 }}>
                        {item.example_wrong}
                      </p>
                    </div>

                    <div className={styles.correctBox}>
                      <span className={styles.boxLabel}>
                        {isFa ? "الگوی طبیعی و صحیح ✓" : "Natural Target Form ✓"}
                      </span>
                      <p dir="ltr" style={{ margin: 0, fontWeight: 600 }}>
                        {item.example_correct}
                      </p>
                    </div>
                  </div>
                )}

                {/* Interactive Quick-Check Sandbox */}
                {item.quick_options && item.quick_options.length > 0 && (
                  <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", borderRadius: "var(--radius-control)", border: "1px solid var(--color-border)", marginBlockEnd: "var(--space-4)" }}>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, display: "block", marginBlockEnd: "var(--space-2)" }}>
                      {isFa ? "تست سریع در همین جا:" : "In-place quick check:"}
                    </span>
                    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      {item.quick_options.map((opt, optIdx) => {
                        const isSelected = userAnswer === optIdx;
                        return (
                          <button
                            key={opt}
                            type="button"
                            dir="ltr"
                            onClick={() =>
                              setTestedAnswers((prev) => ({ ...prev, [item.id]: optIdx }))
                            }
                            style={{
                              padding: "var(--space-1) var(--space-3)",
                              borderRadius: "var(--radius-control)",
                              border: `1px solid ${isSelected ? "var(--color-action-bg)" : "var(--color-border)"}`,
                              background: isSelected ? "var(--color-action-bg)" : "var(--color-canvas)",
                              color: isSelected ? "var(--color-action-text)" : "var(--color-text)",
                              fontSize: "var(--font-size-meta)",
                              fontWeight: isSelected ? 700 : 500,
                              cursor: "pointer",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <p
                        style={{
                          margin: "var(--space-2) 0 0",
                          fontSize: "var(--font-size-meta)",
                          fontWeight: 700,
                          color: isCorrect ? "var(--color-success)" : "var(--color-danger)",
                        }}
                      >
                        {isCorrect
                          ? isFa ? "✓ آفرین! این کاربرد ساختار زبان را کاملاً دقیق و طبیعی رعایت می‌کند." : "✓ Precise and natural formulation!"
                          : isFa ? "نیاز به دقت بیشتر: ساختار صحیح را از کادر سبز بالا مرور کنید." : "Review carefully: Inspect the green box above."}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Strip */}
                <div className={styles.actionStrip}>
                  {item.status !== "disputed" && (
                    <Link
                      className={styles.buttonPrimary}
                      href={`/practice?focus=${encodeURIComponent(item.title_en)}`}
                    >
                      {isFa ? "تمرین هدفمند بر این الگو" : "Practice This Pattern"}
                    </Link>
                  )}

                  {item.status !== "mastered" && item.status !== "disputed" && (
                    <button
                      className={styles.buttonSecondary}
                      type="button"
                      onClick={() => handleResolve(item.id)}
                    >
                      {isFa ? "تثبیت شد / آموختم" : "Mark Mastered"}
                    </button>
                  )}

                  {item.status !== "disputed" ? (
                    <button
                      className={styles.buttonText}
                      type="button"
                      onClick={() => setDisputeOpenId(disputeOpenId === item.id ? null : item.id)}
                    >
                      {isFa ? "اعتراض / اصلاح این خطا" : "Dispute or Correct"}
                    </button>
                  ) : (
                    <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                      {isFa ? `دلیل ثبت‌شده: ${item.dispute_reason || "اشتباه تایپی"}` : `Reason: ${item.dispute_reason || "Typo"}`}
                    </span>
                  )}
                </div>

                {/* Dispute Drawer */}
                {disputeOpenId === item.id && (
                  <div className={styles.disputeDrawer}>
                    <label htmlFor={`dispute-input-${item.id}`} style={{ display: "block", fontSize: "var(--font-size-meta)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
                      {isFa
                        ? "دلیل اعتراض به این الگو را بنویسید (مثلاً: این صرفاً یک اشتباه تایپی لحظه‌ای بود، نه نقص دانشی):"
                        : "State your dispute reason (e.g., accidental slip rather than conceptual knowledge gap):"}
                    </label>
                    <input
                      id={`dispute-input-${item.id}`}
                      className={styles.disputeInput}
                      type="text"
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="e.g. Accidental typo while typing fast"
                    />
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button
                        className={styles.buttonPrimary}
                        type="button"
                        onClick={() => handleDisputeSubmit(item.id)}
                      >
                        {isFa ? "ثبت اعتراض و توقف توصیه" : "Confirm Dispute"}
                      </button>
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        onClick={() => setDisputeOpenId(null)}
                      >
                        {isFa ? "انصراف" : "Cancel"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
