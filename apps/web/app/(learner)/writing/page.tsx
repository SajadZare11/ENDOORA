"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function WritingPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [essayText, setEssayText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  function handleAnalyze() {
    if (wordCount > 0) {
      setAnalyzed(true);
    }
  }

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "منتور نگارش و مقاله‌نویسی (Writing Mentor)" : "Writing Mentor"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "متن انگلیسی خود را بنویسید تا بر اساس اصول گرامری، تنوع واژگان و ساختار پاراگراف مورد تحلیل قرار گیرد."
            : "Compose your written English to receive analytical feedback on grammar, vocabulary range, and paragraph coherence."}
        </p>

        <div style={{ marginBlockEnd: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBlockEnd: "var(--space-2)" }}>
            <label htmlFor="writing-input" style={{ fontWeight: 700 }}>
              {isFa ? "متن نوشته شما:" : "Your writing draft:"}
            </label>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
              {isFa ? `${wordCount} کلمه` : `${wordCount} words`}
            </span>
          </div>
          <textarea
            id="writing-input"
            dir="ltr"
            rows={7}
            value={essayText}
            onChange={(e) => {
              setEssayText(e.target.value);
              setAnalyzed(false);
            }}
            placeholder="Write your paragraph or essay response here in English..."
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontSize: "var(--font-size-body)",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-6)" }}>
          <button
            type="button"
            className="learner-button learner-button--primary"
            onClick={handleAnalyze}
            disabled={wordCount === 0}
          >
            {isFa ? "تحلیل انسجام و دستور زبان" : "Analyze coherence & grammar"}
          </button>
          <Link className="learner-button learner-button--secondary" href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
          </Link>
        </div>

        {analyzed && (
          <div
            style={{
              padding: "var(--space-5)",
              background: "var(--color-surface-hover)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--color-border)",
              marginBlockEnd: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginBlockEnd: "var(--space-3)", color: "var(--color-primary)" }}>
              {isFa ? "تحلیل منتور نگارش:" : "Writing Mentor Diagnostic:"}
            </h3>
            <ul style={{ paddingInlineStart: "var(--space-4)", lineHeight: 1.8, color: "var(--color-text)" }}>
              <li>
                <strong>{isFa ? "دستور زبان:" : "Grammar:"}</strong> {isFa ? "جملات ساختار قابل فهم دارند؛ توجه به پیوندهای شرطی و تطابق زمان‌ها توصیه می‌شود." : "Structures are intelligible; focus on conditional conjunctions and tense consistency."}
              </li>
              <li>
                <strong>{isFa ? "تنوع واژگانی:" : "Vocabulary range:"}</strong> {isFa ? "می‌توانید به جای صفت‌های عمومی از کلمات دانشگاهی مانند ambiguous یا accurate بهره ببرید." : "Consider replacing generic adjectives with specific collocations."}
              </li>
              <li>
                <strong>{isFa ? "انسجام متن:" : "Cohesion:"}</strong> {isFa ? "پاراگراف‌بندی به انتقال روان مفهوم کمک می‌کند." : "Logical paragraphing aids reader comprehension."}
              </li>
            </ul>
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
          <small>
            {isFa
              ? "راهنمایی: ارزیابی نگارش برای هدایت فرآیند یادگیری طراحی شده و جایگزین تصحیح رسمی ممتحن نیست."
              : "Guidance: Writing feedback is pedagogical formative support, not an official examiner score."}
          </small>
        </div>
      </div>
    </div>
  );
}
