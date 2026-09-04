"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function PronunciationPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const PHONETIC_SAMPLES = [
    { word: "thought", ipa: "/θɔːt/", note_fa: "تلفظ حرف th بی‌صدا و کشیدگی صدای مصوت" },
    { word: "ambiguous", ipa: "/æmˈbɪɡ.ju.əs/", note_fa: "تاکید بر روی سیلاب دوم (Stress on second syllable)" },
    { word: "schedule", ipa: "/ˈskedʒ.uːl/ or /ˈʃedʒ.uːl/", note_fa: "تفاوت تلفظ در لهجه‌های آمریکایی و بریتانیایی" },
  ];

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "آزمایشگاه تلفظ و فونتیک (Pronunciation Lab)" : "Pronunciation & Phonetics Lab"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "تمرین صداهای استاندارد انگلیسی، استرس کلمات و تکنیک Shadowing برای دستیابی به تلفظ طبیعی و رسا."
            : "Master English phonetics, syllable stress patterns, and shadowing techniques for authentic pronunciation."}
        </p>

        {/* Phonetics Guide */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
          {PHONETIC_SAMPLES.map((sample) => (
            <div
              key={sample.word}
              style={{
                padding: "var(--space-4)",
                background: "var(--color-surface-hover)",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 dir="ltr" style={{ fontSize: "var(--font-size-title-3)", fontWeight: 800, color: "var(--color-primary)" }}>
                {sample.word}
              </h3>
              <p dir="ltr" style={{ fontSize: "var(--font-size-body)", color: "var(--color-text)", fontStyle: "italic", marginBlock: "var(--space-2)" }}>
                {sample.ipa}
              </p>
              <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                {sample.note_fa}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/listening-ready">
            {isFa ? "بررسی دسترسی صوتی مرورگر" : "Check browser audio setup"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/dashboard">
            {isFa ? "ورود به داشبورد" : "Go to dashboard"}
          </Link>
        </div>
      </div>
    </div>
  );
}
