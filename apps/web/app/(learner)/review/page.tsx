"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

interface ReviewCard {
  id: string;
  word: string;
  phonetic: string;
  translation_fa: string;
  example: string;
  interval: string;
}

const REVIEW_ITEMS: ReviewCard[] = [
  {
    id: "vocab-001",
    word: "discovery",
    phonetic: "/dɪˈskʌv.ər.i/",
    translation_fa: "کشف، دستاورد علمی",
    example: "The research team made an extraordinary discovery.",
    interval: "۲ روز دیگر",
  },
  {
    id: "vocab-002",
    word: "ambiguous",
    phonetic: "/æmˈbɪɡ.ju.əs/",
    translation_fa: "مبهم، چندپهلو",
    example: "The instructions were somewhat ambiguous.",
    interval: "۴ روز دیگر",
  },
  {
    id: "vocab-003",
    word: "cohesion",
    phonetic: "/koʊˈhiː.ʒən/",
    translation_fa: "انسجام، همبستگی",
    example: "Community projects foster social cohesion.",
    interval: "۱ هفته دیگر",
  },
];

export default function ReviewPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentCard = REVIEW_ITEMS[currentIndex];

  function handleRate() {
    setShowAnswer(false);
    if (currentIndex < REVIEW_ITEMS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleReset() {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  }

  return (
    <div style={{ maxWidth: "48rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card">
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "مرور هوشمند واژگان (SRS)" : "Spaced Repetition Review (SRS)"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "واژه‌هایی که در آزمون یا تمرین‌ها پاسخ داده‌اید، در فواصل زمانی علمی برای ماندگاری در حافظه بلندمدت تکرار می‌شوند."
            : "Vocabulary encountered in placement and daily practice repeats at optimal spaced intervals for long-term retention."}
        </p>

        {completed ? (
          <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
            <h2 style={{ fontSize: "var(--font-size-title-2)", color: "var(--color-primary)", marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "مرور امروز تکمیل شد!" : "Today's review complete!"}
            </h2>
            <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
              {isFa
                ? "تمام واژه‌های نوبت امروز با موفقیت در سیستم تکرار فاصله‌دار ثبت شدند."
                : "All scheduled cards for today have been updated in your spaced repetition memory graph."}
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="learner-button learner-button--primary" href="/dashboard">
                {isFa ? "ورود به داشبورد" : "Go to dashboard"}
              </Link>
              <button type="button" className="learner-button learner-button--secondary" onClick={handleReset}>
                {isFa ? "مرور دوباره کارت‌ها" : "Review cards again"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-4)" }}>
              <span>{isFa ? `کارت ${currentIndex + 1} از ${REVIEW_ITEMS.length}` : `Card ${currentIndex + 1} of ${REVIEW_ITEMS.length}`}</span>
              <span>{isFa ? `نوبت بعدی: ${currentCard.interval}` : `Next interval: ${currentCard.interval}`}</span>
            </div>

            {/* Flashcard */}
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-8)",
                textAlign: "center",
                background: "var(--color-surface)",
                boxShadow: "var(--shadow-sm)",
                marginBlockEnd: "var(--space-6)",
              }}
            >
              <h2 dir="ltr" style={{ fontSize: "var(--font-size-title-1)", fontWeight: 800, color: "var(--color-text)", marginBlockEnd: "var(--space-2)" }}>
                {currentCard.word}
              </h2>
              <p dir="ltr" style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-body)", fontStyle: "italic", marginBlockEnd: "var(--space-4)" }}>
                {currentCard.phonetic}
              </p>

              {showAnswer ? (
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
                  <p style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, color: "var(--color-primary)", marginBlockEnd: "var(--space-3)" }}>
                    {currentCard.translation_fa}
                  </p>
                  <p dir="ltr" style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                    &ldquo;{currentCard.example}&rdquo;
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  className="learner-button learner-button--secondary"
                  onClick={() => setShowAnswer(true)}
                  style={{ marginTop: "var(--space-4)" }}
                >
                  {isFa ? "نمایش معنی و مثال" : "Show translation & example"}
                </button>
              )}
            </div>

            {/* Rating Buttons */}
            {showAnswer && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
                <button type="button" className="learner-button learner-button--secondary" onClick={handleRate}>
                  {isFa ? "سخت بود (Hard)" : "Hard"}
                </button>
                <button type="button" className="learner-button learner-button--secondary" onClick={handleRate}>
                  {isFa ? "خوب بود (Good)" : "Good"}
                </button>
                <button type="button" className="learner-button learner-button--primary" onClick={handleRate}>
                  {isFa ? "آسان بود (Easy)" : "Easy"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
