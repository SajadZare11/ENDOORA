"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface ReviewCard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translationFa: string;
  example: string;
  collocationFa: string;
  collocationEn: string;
  intervalDays: number;
  lapseCount: number;
  isLeech: boolean;
  sourceText: string;
  sourceType: string;
}

const REVIEW_ITEMS: ReviewCard[] = [
  {
    id: "vocab-001",
    word: "discovery",
    phonetic: "/dɪˈskʌv.ər.i/",
    partOfSpeech: "noun",
    translationFa: "کشف، دستاورد علمی جدید",
    example: "The scientific team made a groundbreaking discovery in oncology.",
    collocationFa: "make a discovery (کشف کردن)",
    collocationEn: "make a breakthrough discovery",
    intervalDays: 2,
    lapseCount: 0,
    isLeech: false,
    sourceText: "Extracted from your IELTS Writing Task 2 on scientific research.",
    sourceType: "writing",
  },
  {
    id: "vocab-002",
    word: "ambiguous",
    phonetic: "/æmˈbɪɡ.ju.əs/",
    partOfSpeech: "adjective",
    translationFa: "مبهم، چندپهلو، دارای چند معنا",
    example: "The contract clause was somewhat ambiguous, leading to legal disputes.",
    collocationFa: "ambiguous wording (نگارش مبهم)",
    collocationEn: "highly ambiguous statement",
    intervalDays: 4,
    lapseCount: 1,
    isLeech: false,
    sourceText: "Encountered in Reading placement section passage 2.",
    sourceType: "reading",
  },
  {
    id: "vocab-003",
    word: "cohesion",
    phonetic: "/koʊˈhiː.ʒən/",
    partOfSpeech: "noun",
    translationFa: "انسجام، همبستگی درونی متن یا جامعه",
    example: "Using transitional adverbs strengthens paragraph cohesion in academic essays.",
    collocationFa: "social cohesion (همبستگی اجتماعی)",
    collocationEn: "maintain textual cohesion",
    intervalDays: 6,
    lapseCount: 0,
    isLeech: false,
    sourceText: "Detected during paragraph transition analysis.",
    sourceType: "writing",
  },
  {
    id: "vocab-004",
    word: "substantial",
    phonetic: "/səbˈstæn.ʃəl/",
    partOfSpeech: "adjective",
    translationFa: "قابل توجه، چشمگیر، اساسی",
    example: "The startup received a substantial investment from venture capitalists.",
    collocationFa: "substantial growth (رشد چشمگیر)",
    collocationEn: "substantial improvement",
    intervalDays: 3,
    lapseCount: 0,
    isLeech: false,
    sourceText: "Practiced in Daily Mission Vocabulary step.",
    sourceType: "mission",
  },
  {
    id: "vocab-005",
    word: "articulate",
    phonetic: "/ɑːˈtɪk.jə.lət/",
    partOfSpeech: "adjective / verb",
    translationFa: "رسا، رسا سخن گفتن، واضح بیان کردن",
    example: "She is an articulate advocate for international student exchange programs.",
    collocationFa: "articulate speaker (سخنور رسا)",
    collocationEn: "clearly articulate the vision",
    intervalDays: 1,
    lapseCount: 4,
    isLeech: true, // Leech card
    sourceText: "Recorded during Speaking Lab voice diagnostic.",
    sourceType: "speaking",
  },
];

export default function ReviewPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [cards, setCards] = useState<ReviewCard[]>(REVIEW_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reviewedCounts, setReviewedCounts] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [isEditingMeaning, setIsEditingMeaning] = useState(false);
  const [editedMeaning, setEditedMeaning] = useState("");

  const currentCard = cards[currentIndex];

  function handleRate(rating: "again" | "hard" | "good" | "easy") {
    setReviewedCounts((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    setShowAnswer(false);
    setIsEditingMeaning(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
    setIsEditingMeaning(false);
    setReviewedCounts({ again: 0, hard: 0, good: 0, easy: 0 });
  }

  function handlePlayAudio(word: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }

  function handleStartEdit() {
    setIsEditingMeaning(true);
    setEditedMeaning(currentCard.translationFa);
  }

  function handleSaveEdit() {
    const updated = [...cards];
    updated[currentIndex] = { ...updated[currentIndex], translationFa: editedMeaning };
    setCards(updated);
    setIsEditingMeaning(false);
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
              {isFa ? "مرور هوشمند واژگان (SRS)" : "Spaced Repetition Review (SRS)"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "واژگان بر اساس الگوریتم تکرار فاصله‌دار دقیقاً پیش از فراموشی در حافظه به شما یادآوری می‌شوند تا به حافظه بلندمدت منتقل گردند."
                : "Vocabulary cards surface right at the boundary of forgetting to optimize neural retention into long-term active recall."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? `${cards.length} کارت آماده مرور` : `${cards.length} Cards Due`}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/vocabulary">
            <span aria-hidden="true">📚</span>
            {isFa ? "مدیریت بانک واژگان" : "Vocabulary Bank"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/practice-ai">
            {isFa ? "تمرین در جملات جدید" : "Practice in Sentences"}
          </Link>
        </div>
      </section>

      {/* SRS Flashcard Screen */}
      <section className={styles.card}>
        {!completed && currentCard ? (
          <div>
            {/* Header progress & interval */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-3)", flexWrap: "wrap", gap: "var(--space-2)" }}>
              <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
                {isFa ? `کارت ${currentIndex + 1} از ${cards.length}` : `Card ${currentIndex + 1} of ${cards.length}`}
              </span>
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                {currentCard.isLeech && (
                  <span style={{ padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--color-error-bg)", color: "var(--color-error-text)", fontWeight: 700, fontSize: "0.75rem" }}>
                    {isFa ? `⚠ پرخطا (${currentCard.lapseCount} بار لغزش)` : `⚠ Leech (${currentCard.lapseCount} lapses)`}
                  </span>
                )}
                <span className={styles.skillLevelBadge}>
                  {isFa ? `فاصله فعلی: ${currentCard.intervalDays} روز` : `Interval: ${currentCard.intervalDays}d`}
                </span>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBarFill}
                style={{ inlineSize: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>

            {/* Flashcard Box */}
            <div
              style={{
                marginBlock: "var(--space-5)",
                padding: "var(--space-6)",
                background: "var(--color-canvas)",
                border: "2px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-3)", marginBlockEnd: "var(--space-2)" }}>
                <h2 dir="ltr" style={{ fontSize: "2.25rem", fontWeight: 800, margin: 0, color: "var(--color-text)" }}>
                  {currentCard.word}
                </h2>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(currentCard.word)}
                  className={styles.buttonSecondary}
                  style={{ padding: "var(--space-1) var(--space-2)", minBlockSize: "2.2rem" }}
                  aria-label="Play audio"
                >
                  <span aria-hidden="true">🔊</span>
                </button>
              </div>

              <div dir="ltr" style={{ fontSize: "var(--font-size-body)", fontStyle: "italic", color: "var(--color-endoora-blue)", marginBlockEnd: "var(--space-4)" }}>
                {currentCard.phonetic} • {currentCard.partOfSpeech}
              </div>

              {!showAnswer ? (
                <div style={{ marginBlockStart: "var(--space-6)" }}>
                  <button
                    type="button"
                    className={styles.buttonPrimary}
                    onClick={() => setShowAnswer(true)}
                  >
                    {isFa ? "نمایش معنی و بافت جمله" : "Show Meaning & Context"}
                  </button>
                </div>
              ) : (
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-5)", marginTop: "var(--space-4)" }}>
                  {isEditingMeaning ? (
                    <div style={{ maxInlineSize: "28rem", marginInline: "auto", marginBlockEnd: "var(--space-3)" }}>
                      <input
                        type="text"
                        style={{
                          inlineSize: "100%",
                          padding: "var(--space-2) var(--space-3)",
                          borderRadius: "var(--radius-control)",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          fontSize: "var(--font-size-body)",
                          marginBlockEnd: "var(--space-2)",
                        }}
                        value={editedMeaning}
                        onChange={(e) => setEditedMeaning(e.target.value)}
                      />
                      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)" }}>
                        <button
                          type="button"
                          className={styles.buttonPrimary}
                          style={{ padding: "var(--space-1) var(--space-3)", fontSize: "var(--font-size-meta)" }}
                          onClick={handleSaveEdit}
                        >
                          {isFa ? "ذخیره معنی" : "Save Meaning"}
                        </button>
                        <button
                          type="button"
                          className={styles.buttonSecondary}
                          style={{ padding: "var(--space-1) var(--space-3)", fontSize: "var(--font-size-meta)" }}
                          onClick={() => setIsEditingMeaning(false)}
                        >
                          {isFa ? "انصراف" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "var(--space-2)", marginBlockEnd: "var(--space-3)" }}>
                      <h3 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, color: "var(--color-action)", margin: 0 }}>
                        {currentCard.translationFa}
                      </h3>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        style={{ padding: "2px 8px", fontSize: "0.75rem" }}
                        onClick={handleStartEdit}
                        title={isFa ? "اصلاح ترجمه" : "Edit translation"}
                      >
                        ✏️ {isFa ? "اصلاح" : "Edit"}
                      </button>
                    </div>
                  )}

                  <div style={{ marginBlockEnd: "var(--space-4)", padding: "var(--space-3)", background: "var(--color-surface)", borderRadius: "var(--radius-control)" }}>
                    <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)", display: "block" }}>
                      {isFa ? "مثال در بافت جمله:" : "Contextual Sentence:"}
                    </span>
                    <p dir="ltr" style={{ fontWeight: 600, margin: "var(--space-1) 0 0 0", color: "var(--color-text)", fontFamily: "var(--font-family-latin)" }}>
                      &ldquo;{currentCard.example}&rdquo;
                    </p>
                  </div>

                  {currentCard.sourceText && (
                    <div style={{ marginBlockEnd: "var(--space-4)", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                      <strong>{isFa ? "منبع استخراج: " : "Traceable Source: "}</strong>
                      <span>{currentCard.sourceText}</span>
                    </div>
                  )}

                  <div style={{ marginBlockEnd: "var(--space-5)", fontSize: "var(--font-size-meta)", color: "var(--color-muted)" }}>
                    <strong>{isFa ? "ترکیب همنشین (Collocation): " : "Collocation: "}</strong>
                    <span dir="ltr" style={{ fontWeight: 600, color: "var(--color-text)" }}>
                      {currentCard.collocationEn}
                    </span>
                  </div>

                  {/* 4 Transparent SRS Rating Buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(6.5rem, 1fr))", gap: "var(--space-2)" }}>
                    <button
                      type="button"
                      onClick={() => handleRate("again")}
                      style={{
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-control)",
                        background: "var(--color-error-bg)",
                        color: "var(--color-error-text)",
                        border: "1px solid var(--color-border)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isFa ? "دوباره (۱ روز)" : "Again (1d)"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRate("hard")}
                      style={{
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-control)",
                        background: "var(--color-warning-bg)",
                        color: "var(--color-warning-text)",
                        border: "1px solid var(--color-border)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isFa ? "سخت (۲ روز)" : "Hard (2d)"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRate("good")}
                      style={{
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-control)",
                        background: "var(--color-info-bg)",
                        color: "var(--color-info-text)",
                        border: "1px solid var(--color-border)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isFa ? "خوب (۴ روز)" : "Good (4d)"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRate("easy")}
                      style={{
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius-control)",
                        background: "var(--color-success-bg)",
                        color: "var(--color-success-text)",
                        border: "1px solid var(--color-border)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isFa ? "آسان (۷ روز)" : "Easy (7d)"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div style={{ textAlign: "center", padding: "var(--space-6) var(--space-4)" }}>
            <div style={{ fontSize: "3rem", marginBlockEnd: "var(--space-2)" }}>🎉</div>
            <h2 style={{ fontSize: "var(--font-size-page-title)", fontWeight: 800, color: "var(--color-text)", marginBlockEnd: "var(--space-2)" }}>
              {isFa ? "مرور نوبت امروز با موفقیت تکمیل شد!" : "Today's Review Session Complete!"}
            </h2>
            <p className={styles.heroSubtitle} style={{ marginInline: "auto", marginBlockEnd: "var(--space-6)" }}>
              {isFa
                ? "تمام ۵ کارت واژگان در نمودار حافظه بلندمدت شما به‌روزرسانی شدند و نوبت بعدی مرور به صورت خودکار زمان‌بندی شد."
                : "All 5 vocabulary items have been rescheduled in your long-term memory graph based on active recall performance."}
            </p>

            <div className={styles.statsGrid} style={{ maxInlineSize: "32rem", marginInline: "auto" }}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{isFa ? "خوب و آسان" : "Mastered"}</span>
                <span className={styles.statValue} style={{ color: "var(--color-success-text)" }}>
                  {reviewedCounts.good + reviewedCounts.easy}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{isFa ? "نیازمند مرور مجدد" : "Needs Review"}</span>
                <span className={styles.statValue} style={{ color: "var(--color-warning-text)" }}>
                  {reviewedCounts.again + reviewedCounts.hard}
                </span>
              </div>
            </div>

            <div className={styles.actionRow} style={{ justifyContent: "center" }}>
              <Link className={styles.buttonPrimary} href="/dashboard">
                {isFa ? "بازگشت به داشبورد" : "Return to Dashboard"}
              </Link>
              <Link className={styles.buttonSecondary} href="/vocabulary">
                {isFa ? "مشاهده بانک واژگان" : "View Vocabulary Bank"}
              </Link>
              <button type="button" className={styles.buttonSecondary} onClick={handleReset}>
                {isFa ? "مرور مجدد همین کارت‌ها" : "Review Again"}
              </button>
            </div>
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "الگوریتم تکرار فاصله‌دار (Spaced Repetition) با افزایش فواصل تکرار، ماندگاری واژگان را در حافظه فعال تضمین می‌کند."
            : "The Spaced Repetition algorithm exponentially increases review intervals, ensuring effortless recall with minimal daily review burden."}
        </footer>
      </section>
    </div>
  );
}
