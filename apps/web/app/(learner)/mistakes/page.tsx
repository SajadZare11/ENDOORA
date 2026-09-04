"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

interface MistakePattern {
  id: string;
  category: string;
  title_fa: string;
  title_en: string;
  explanation_fa: string;
  explanation_en: string;
  example_wrong: string;
  example_correct: string;
}

const COMMON_MISTAKES: MistakePattern[] = [
  {
    id: "mis-001",
    category: "دستور زبان (Grammar)",
    title_fa: "تطابق سوم‌شخص در حال ساده",
    title_en: "Third-person singular agreement in present simple",
    explanation_fa: "فعل همراه با ضمایر فاعلی he / she / it در زمان حال ساده نیاز به s یا es دارد.",
    explanation_en: "Verbs with he / she / it in present simple require -s or -es.",
    example_wrong: "She go to school every day.",
    example_correct: "She goes to school every day.",
  },
  {
    id: "mis-002",
    category: "دستور زبان (Grammar)",
    title_fa: "ساختار شرطی نوع سوم (Third Conditional)",
    title_en: "Past unreal conditional structure",
    explanation_fa: "در شرطی نوع سوم، جواب شرط از ترکیب would have + قسمت سوم فعل (p.p) تشکیل می‌شود.",
    explanation_en: "The third conditional main clause uses would have + past participle.",
    example_wrong: "If she had prepared, she would pass.",
    example_correct: "If she had prepared, she would have passed.",
  },
  {
    id: "mis-003",
    category: "واژگان (Vocabulary)",
    title_fa: "تفاوت کلمات هم‌خانواده (Discovery vs Destination)",
    title_en: "Word distinction and collocation",
    explanation_fa: "برای دستاوردهای علمی از واژه discovery (کشف) به جای destination (مقصد) استفاده می‌شود.",
    explanation_en: "Scientific achievements use 'discovery' rather than 'destination'.",
    example_wrong: "The team made a destination in medicine.",
    example_correct: "The team made a discovery in medicine.",
  },
];

export default function MistakesPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "ژنوم خطاهای یادگیری (Mistake Genome)" : "Mistake Genome & Analysis"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "این بخش الگوهای خطای پرتکرار در آزمون‌های تعیین سطح و تمرین‌ها را ریشه‌یابی می‌کند تا به جای حفظ کردن، منطق زبان را یاد بگیرید."
            : "This module pinpoints recurring error patterns from diagnostics and exercises to help you master grammatical logic."}
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/demo">
            {isFa ? "بررسی مهارت در آزمون تعیین سطح" : "Evaluate skills in placement test"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
          </Link>
        </div>
      </div>

      {/* Mistake Pattern Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {COMMON_MISTAKES.map((item) => (
          <div
            key={item.id}
            className="learner-card"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-3)", flexWrap: "wrap", gap: "var(--space-2)" }}>
              <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-primary)" }}>
                {item.category}
              </span>
              <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                {item.id}
              </span>
            </div>

            <h2 style={{ fontSize: "var(--font-size-title-2)", marginBlockEnd: "var(--space-2)" }}>
              {isFa ? item.title_fa : item.title_en}
            </h2>
            <p style={{ color: "var(--color-text-muted)", marginBlockEnd: "var(--space-4)" }}>
              {isFa ? item.explanation_fa : item.explanation_en}
            </p>

            {/* Comparison Box */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-3)", padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
              <div>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-danger, #ef4444)", fontWeight: 700, display: "block", marginBlockEnd: "var(--space-1)" }}>
                  {isFa ? "شکل نادرست:" : "Common error:"}
                </span>
                <code dir="ltr" style={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {item.example_wrong}
                </code>
              </div>

              <div>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-success, #22c55e)", fontWeight: 700, display: "block", marginBlockEnd: "var(--space-1)" }}>
                  {isFa ? "شکل صحیح:" : "Correct form:"}
                </span>
                <code dir="ltr" style={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {item.example_correct}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
