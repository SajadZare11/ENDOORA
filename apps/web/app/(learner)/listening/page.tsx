"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { AudioWaveformPlayer } from "../../../components/placement/AudioWaveformPlayer";

export default function ListeningPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const SKILL_PILLARS = [
    {
      title_fa: "درک پیام کلی (Gist)",
      title_en: "Gist Comprehension",
      desc_fa: "تشخیص موضوع اصلی مکالمات و اطلاعیه‌های روزمره عمومی.",
      desc_en: "Identify the main topic of daily announcements and dialogues.",
      cefr: "A1 - A2",
    },
    {
      title_fa: "استخراج جزییات دقیق (Details)",
      title_en: "Detail Extraction",
      desc_fa: "شنیدن و ثبت دقیق ساعت‌ها، مکان‌ها، اسامی و مشخصات کلیدی.",
      desc_en: "Capture specific times, dates, locations, and names accurately.",
      cefr: "A2 - B1",
    },
    {
      title_fa: "استنباط معنایی و لحن (Inference)",
      title_en: "Inference & Attitude",
      desc_fa: "درک احساسات گوینده، تردید، قطعیت و پیام‌های ضمنی پنهان.",
      desc_en: "Infer speaker feelings, nuances, and underlying intentions.",
      cefr: "B1 - B2",
    },
    {
      title_fa: "شنیداری دانشگاهی و کاری (Academic)",
      title_en: "Academic & Workplace",
      desc_fa: "دنبال کردن سخنرانی‌های علمی، ارائه‌های شرکتی و گزارش‌های تخصصی.",
      desc_en: "Follow lectures, business presentations, and specialized briefings.",
      cefr: "B2",
    },
  ];

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link
        className="learner-back-link"
        href="/dashboard"
        style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}
      >
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "آزمایشگاه مهارت شنیداری (Listening Lab)" : "Listening Comprehension Lab"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "بخش شنیداری آزمون تعیین سطح Endoora فعال است. فایل‌های صوتی استاندارد را گوش دهید، نوار فرکانسی را کنترل کنید و به سوالات متناسب با سطوح CEFR پاسخ دهید."
            : "The Endoora listening placement evaluation is actively integrated. Experience authentic audio clips, interactive waveform controls, and CEFR-calibrated diagnostic items."}
        </p>

        {/* Live Audio Player Demo */}
        <div style={{ marginBlockEnd: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--font-size-title-3)", marginBlockEnd: "var(--space-3)" }}>
            {isFa ? "نمونه پخش‌کننده صوتی و نوار فرکانسی" : "Sample Audio Waveform Player"}
          </h2>
          <AudioWaveformPlayer
            src="/audio/placement/listening-a1-001.wav"
            playLimit={3}
            title_fa="نمونه صدای آزمون تعیین سطح (اعلان تاخیر حرکت قطار)"
            title_en="Diagnostic Sample (Train Schedule Announcement)"
            locale={isFa ? "fa" : "en"}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-6)" }}>
          <Link className="learner-button learner-button--primary" href="/placement/demo">
            {isFa ? "ورود به آزمون تعیین سطح" : "Take placement test"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/placement/listening-ready">
            {isFa ? "بررسی تجهیزات صوتی مرورگر" : "Check audio readiness"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
          </Link>
        </div>

        {/* Skill Pillars Grid */}
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-5)" }}>
          <h2 style={{ fontSize: "var(--font-size-title-2)", marginBlockEnd: "var(--space-4)" }}>
            {isFa ? "ابعاد مورد سنجش در مهارت شنیداری" : "Evaluated Listening Dimensions"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {SKILL_PILLARS.map((pillar) => (
              <div
                key={pillar.title_en}
                style={{
                  padding: "var(--space-4)",
                  background: "var(--color-surface-hover)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-2)" }}>
                  <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-primary)" }}>
                    {pillar.cefr}
                  </span>
                </div>
                <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-1)" }}>
                  {isFa ? pillar.title_fa : pillar.title_en}
                </h3>
                <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  {isFa ? pillar.desc_fa : pillar.desc_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
