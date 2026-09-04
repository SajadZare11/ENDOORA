"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

interface BadgeItem {
  id: string;
  icon: string;
  title_fa: string;
  title_en: string;
  desc_fa: string;
  desc_en: string;
  unlocked: boolean;
  progress: string;
}

export default function BadgesPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const placementDone = data.path_steps?.find((step) => step.id === "placement")?.state === "complete";
  const streak = data.streak_days || 0;

  const BADGES: BadgeItem[] = [
    {
      id: "badge-01",
      icon: "🎯",
      title_fa: "تکمیل آزمون تعیین سطح",
      title_en: "Placement Pioneer",
      desc_fa: "پاسخ به بخش‌های گرامر، واژگان و درک مطلب برای تعیین سطح علمی.",
      desc_en: "Complete Grammar, Vocabulary, and Reading diagnostic sections.",
      unlocked: placementDone,
      progress: placementDone ? "۱۰۰٪" : "در انتظار تکمیل",
    },
    {
      id: "badge-02",
      icon: "🔥",
      title_fa: "تداوم ۳ روزه یادگیری",
      title_en: "3-Day Streak",
      desc_fa: "حفظ روند یادگیری برای سه روز متوالی بدون وقفه.",
      desc_en: "Maintain daily learning consistency for 3 consecutive days.",
      unlocked: streak >= 3,
      progress: `${Math.min(streak, 3)} / 3 روز`,
    },
    {
      id: "badge-03",
      icon: "🧠",
      title_fa: "مرور واژگان تکرار فاصله‌دار",
      title_en: "Memory Architect",
      desc_fa: "مرور فعال کارت‌های واژگان در سیستم SRS.",
      desc_en: "Review active vocabulary cards in the SRS engine.",
      unlocked: true,
      progress: "فعال",
    },
    {
      id: "badge-04",
      icon: "🎙️",
      title_fa: "آمادگی آزمایشگاه صوتی",
      title_en: "Audio Explorer",
      desc_fa: "بررسی دسترسی صوتی برای فازهای گفتاری و شنیداری.",
      desc_en: "Test microphone readiness for upcoming audio interactive modules.",
      unlocked: false,
      progress: "فاز بعدی",
    },
  ];

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "نشان‌ها و دستاوردهای یادگیری" : "Learning Badges & Milestones"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "نشان‌های Endoora بر اساس دستاوردهای واقعی و شواهد یادگیری فعال می‌شوند، نه الگوهای کاذب یا فریبنده."
            : "Endoora milestones unlock based on verified learning evidence, avoiding manipulative or superficial engagement."}
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/demo">
            {isFa ? "شرکت در آزمون تعیین سطح" : "Take placement test"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/dashboard">
            {isFa ? "ورود به داشبورد" : "Go to dashboard"}
          </Link>
        </div>
      </div>

      {/* Badges Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-4)" }}>
        {BADGES.map((b) => (
          <div
            key={b.id}
            className="learner-card"
            style={{
              background: b.unlocked ? "var(--color-surface)" : "var(--color-surface-hover)",
              border: `1px solid ${b.unlocked ? "var(--color-primary)" : "var(--color-border)"}`,
              boxShadow: b.unlocked ? "var(--shadow-sm)" : "none",
              opacity: b.unlocked ? 1 : 0.8,
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBlockEnd: "var(--space-2)" }}>
              {b.icon}
            </div>
            <h2 style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
              {isFa ? b.title_fa : b.title_en}
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginBlockEnd: "var(--space-3)", lineHeight: 1.6 }}>
              {isFa ? b.desc_fa : b.desc_en}
            </p>
            <span
              style={{
                display: "inline-block",
                fontSize: "var(--font-size-meta)",
                fontWeight: 600,
                padding: "var(--space-1) var(--space-2)",
                borderRadius: "var(--radius-control)",
                background: b.unlocked ? "var(--color-success-bg)" : "var(--color-surface)",
                color: b.unlocked ? "var(--color-success)" : "var(--color-text-muted)",
              }}
            >
              {b.progress}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
