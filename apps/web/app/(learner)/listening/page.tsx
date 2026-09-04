"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function ListeningPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "آزمایشگاه مهارت شنیداری (Listening Lab)" : "Listening Comprehension Lab"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "تقویت درک شنیداری زبان انگلیسی با تمرین‌های تعاملی، مکالمات طبیعی و متن‌های پیاده‌سازی شده."
            : "Enhance oral comprehension through authentic audio interactions, natural dialogues, and synchronized transcripts."}
        </p>

        {/* Audio Prep Card */}
        <div
          style={{
            padding: "var(--space-5)",
            background: "var(--color-surface-hover)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
            marginBlockEnd: "var(--space-6)",
          }}
        >
          <h2 style={{ fontSize: "var(--font-size-title-2)", marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "آمادگی تجهیزات صوتی و شنیداری" : "Audio Equipment Preparation"}
          </h2>
          <p style={{ color: "var(--color-text-muted)", marginBlockEnd: "var(--space-4)", lineHeight: 1.7 }}>
            {isFa
              ? "آزمایشگاه شنیداری در فاز آتی به آزمون تعیین سطح متصل خواهد شد. برای اطمینان از عملکرد صحیح بلندگو و میکروفون مرورگر، صفحه بررسی صوتی را مشاهده کنید."
              : "The listening evaluation will link to the placement engine in the next milestone. Ensure your audio output and microphone permissions are ready."}
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <Link className="learner-button learner-button--primary" href="/placement/listening-ready">
              {isFa ? "بررسی آمادگی صوتی مرورگر" : "Check audio readiness"}
            </Link>
            <Link className="learner-button learner-button--secondary" href="/placement/report">
              {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
            </Link>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)" }}>
          <small>
            {isFa
              ? "وضعیت: بخش‌های گرامر، واژگان و درک مطلب اکنون فعال و ارزیابی‌پذیر هستند. بخش شنیداری در فاز بعدی فعال می‌شود."
              : "Status: Grammar, Vocabulary, and Reading sections are actively evaluated. Listening activates in the subsequent phase."}
          </small>
        </div>
      </div>
    </div>
  );
}
