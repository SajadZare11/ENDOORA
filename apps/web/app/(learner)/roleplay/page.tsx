"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

interface Scenario {
  id: string;
  title_fa: string;
  title_en: string;
  level: string;
  context_fa: string;
  context_en: string;
  turns: Array<{ speaker: string; text: string }>;
}

const SCENARIOS: Scenario[] = [
  {
    id: "sc-airport",
    title_fa: "فرودگاه بین‌المللی و بازرسی گذرنامه",
    title_en: "Airport Passport Control & Customs",
    level: "A2 - B1",
    context_fa: "پاسخ به سوالات مامور کنترل گذرنامه درباره هدف سفر و مدت اقامت.",
    context_en: "Answer immigration officer inquiries about the purpose and duration of your visit.",
    turns: [
      { speaker: "Officer", text: "Good morning. May I please see your passport and boarding pass?" },
      { speaker: "Learner", text: "Good morning. Here you are, sir." },
      { speaker: "Officer", text: "What is the purpose of your visit to the city?" },
      { speaker: "Learner", text: "I am traveling to attend an educational conference for one week." },
    ],
  },
  {
    id: "sc-interview",
    title_fa: "مصاحبه کاری و معرفی پیشینه شغلی",
    title_en: "Job Interview Introduction",
    level: "B1 - B2",
    context_fa: "توضیح تجربیات پیشین و پروژه‌های کاری به زبان انگلیسی.",
    context_en: "Describe your professional background and past team contributions.",
    turns: [
      { speaker: "Interviewer", text: "Welcome. Could you tell us briefly about your experience in language education?" },
      { speaker: "Learner", text: "Certainly. I have worked on curriculum development and educational technology for three years." },
    ],
  },
];

export default function RoleplayPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "تمرین مکالمه و سناریوهای واقعی (Roleplay)" : "Interactive Roleplay Scenarios"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "مکالمه در موقعیت‌های طبیعی روزمره به تقویت اعتمادبه‌نفس و تسلط کلامی شما کمک می‌کند."
            : "Engage in realistic conversational scenarios designed to build verbal confidence and situational fluency."}
        </p>

        {/* Scenario Selector */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-6)" }}>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              className={`learner-button ${activeScenario.id === sc.id ? "learner-button--primary" : "learner-button--secondary"}`}
              onClick={() => setActiveScenario(sc)}
            >
              {isFa ? sc.title_fa : sc.title_en}
            </button>
          ))}
        </div>

        {/* Active Scenario Card */}
        <div
          style={{
            padding: "var(--space-5)",
            background: "var(--color-surface-hover)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
            marginBlockEnd: "var(--space-6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBlockEnd: "var(--space-3)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-primary)" }}>
              {isFa ? `سطح سناریو: ${activeScenario.level}` : `Level: ${activeScenario.level}`}
            </span>
          </div>
          <p style={{ color: "var(--color-text)", marginBlockEnd: "var(--space-4)" }}>
            {isFa ? activeScenario.context_fa : activeScenario.context_en}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {activeScenario.turns.map((turn, i) => (
              <div
                key={i}
                dir="ltr"
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-control)",
                  background: turn.speaker === "Learner" ? "var(--color-surface)" : "var(--color-surface-active, rgba(0,0,0,0.04))",
                  border: "1px solid var(--color-border)",
                }}
              >
                <strong style={{ color: "var(--color-primary)", display: "block", marginBlockEnd: "0.25rem" }}>
                  {turn.speaker}:
                </strong>
                <span>{turn.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/listening-ready">
            {isFa ? "بررسی آمادگی میکروفون برای تعامل صوتی" : "Check microphone for audio mode"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/dashboard">
            {isFa ? "ورود به داشبورد" : "Go to dashboard"}
          </Link>
        </div>
      </div>
    </div>
  );
}
