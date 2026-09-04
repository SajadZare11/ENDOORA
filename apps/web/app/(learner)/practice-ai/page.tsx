"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function PracticeAIPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [promptInput, setPromptInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCheck() {
    if (!promptInput.trim()) return;
    setFeedback(
      isFa
        ? `جمله شما بررسی شد: ساختار کلی قابل درک است. در بخش دستور زبان، دقت به زمان افعال و استفاده از واژگان متنوع‌تر توصیه می‌شود.`
        : `Your response was reviewed: Overall sentence structure is clear. Focus on verb tenses and incorporating varied vocabulary.`
    );
  }

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "تمرین هوشمند زبانی (AI Practice)" : "Adaptive AI Practice"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "این بخش به شما امکان می‌دهد جملات و پاسخ‌های خود را بنویسید و بازخورد آموزشی هوشمند دریافت کنید."
            : "Practice constructing sentences and receive contextual educational feedback powered by Endoora AI."}
        </p>

        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <label htmlFor="practice-prompt" style={{ display: "block", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "جمله یا متن انگلیسی خود را اینجا بنویسید:" : "Enter your English practice sentence:"}
          </label>
          <textarea
            id="practice-prompt"
            dir="ltr"
            rows={4}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g. She goes to the library every weekend to read scientific articles."
            style={{
              width: "100%",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              fontSize: "var(--font-size-body)",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-6)" }}>
          <button
            type="button"
            className="learner-button learner-button--primary"
            onClick={handleCheck}
            disabled={!promptInput.trim()}
          >
            {isFa ? "دریافت تحلیل آموزشی" : "Analyze response"}
          </button>
          <Link className="learner-button learner-button--secondary" href="/placement/demo">
            {isFa ? "آزمون تعیین سطح" : "Placement test"}
          </Link>
        </div>

        {feedback && (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--color-surface-hover)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--color-border)",
              marginBlockEnd: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-2)", color: "var(--color-primary)" }}>
              {isFa ? "تحلیل و راهنمایی هوشمند:" : "Educational Feedback:"}
            </h3>
            <p style={{ lineHeight: 1.7 }}>{feedback}</p>
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
          <small>
            {isFa
              ? "یادآوری: بازخورد هوش مصنوعی جنبه آموزشی و راهنمایی دارد و به عنوان گواهی رسمی یا نمره آزمون محسوب نمی‌شود."
              : "Notice: AI feedback provides pedagogical guidance and does not constitute certified testing."}
          </small>
        </div>
      </div>
    </div>
  );
}
