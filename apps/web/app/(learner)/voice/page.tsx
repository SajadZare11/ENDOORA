"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function VoicePage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "آزمایشگاه صدا و گفتار (Voice Lab)" : "Voice & Speaking Lab"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "آزمایشگاه صدای Endoora بستری برای تمرین روان‌گویی و ضبط گفتار برای فازهای مکالمه زنده و ارزیابی شنیداری است."
            : "The Voice Lab provides a dedicated environment for oral practice, fluency assessment, and speech analytics."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
              {isFa ? "بررسی آمادگی میکروفون" : "Microphone Readiness"}
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "تست وضوح و دسترسی صوتی در مرورگر." : "Verify browser audio permissions and input clarity."}
            </p>
            <Link className="learner-button learner-button--secondary" href="/placement/listening-ready">
              {isFa ? "بررسی دسترسی صوتی" : "Check mic"}
            </Link>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
              {isFa ? "آزمون ارزیابی اولیه" : "Diagnostic Assessment"}
            </h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-3)" }}>
              {isFa ? "شروع آزمون تعیین سطح در بخش‌های گرامر و واژگان." : "Complete core grammar, vocab & reading diagnostics."}
            </p>
            <Link className="learner-button learner-button--primary" href="/placement/demo">
              {isFa ? "شروع تعیین سطح" : "Start placement"}
            </Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
          <small>
            {isFa
              ? "یادآوری: ماژول‌های گفتاری و شنیداری پس از تثبیت پایه‌های گرامر، واژگان و درک مطلب فعال خواهند شد."
              : "Note: Live oral practice integrates fully after diagnostic foundation in Grammar, Vocabulary, and Reading."}
          </small>
        </div>
      </div>
    </div>
  );
}
