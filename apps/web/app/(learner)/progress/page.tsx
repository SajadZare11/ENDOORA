"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function ProgressPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const placementCompleted = data.path_steps?.find((step) => step.id === "placement")?.state === "complete";
  const streak = data.streak_days || 0;
  const xp = data.xp || 0;

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "روند پیشرفت یادگیری" : "Learning Progress"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "این صفحه وضعیت واقعی مهارت‌ها و پیشرفت روزانه شما را بر اساس شواهد آموزشی نمایش می‌دهد."
            : "This page displays your verified skill progression and daily momentum based on learning evidence."}
        </p>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "var(--space-4)", marginBlockEnd: "var(--space-6)" }}>
          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "روزهای متوالی (Streak)" : "Current Streak"}</span>
            <div style={{ fontSize: "var(--font-size-title-1)", fontWeight: 800, color: "var(--color-primary)", marginTop: "var(--space-1)" }}>
              {streak} {isFa ? "روز" : "days"}
            </div>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "امتیاز تجربه (XP)" : "Total XP"}</span>
            <div style={{ fontSize: "var(--font-size-title-1)", fontWeight: 800, color: "var(--color-primary)", marginTop: "var(--space-1)" }}>
              {xp}
            </div>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "وضعیت تعیین سطح" : "Placement Status"}</span>
            <div style={{ fontSize: "var(--font-size-body)", fontWeight: 700, color: "var(--color-text)", marginTop: "var(--space-2)" }}>
              {placementCompleted ? (isFa ? "تکمیل شده" : "Completed") : (isFa ? "نیازمند ارزیابی" : "Needs assessment")}
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/report">
            {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/placement/demo">
            {isFa ? "ورود به آزمون تعیین سطح" : "Take placement test"}
          </Link>
        </div>
      </div>

      {/* Skills Evidence Section */}
      <div className="learner-card">
        <h2 style={{ fontSize: "var(--font-size-title-2)", marginBlockEnd: "var(--space-3)" }}>
          {isFa ? "تفکیک مهارت‌های ارزیابی‌شده" : "Assessed Skill Breakdown"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "var(--space-4)", marginBlock: "var(--space-4)" }}>
          {["دستور زبان (Grammar)", "واژگان (Vocabulary)", "درک مطلب (Reading)", "شنیداری (Listening)"].map((skill) => (
            <div key={skill} style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", background: "var(--color-surface)" }}>
              <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700 }}>{skill}</h3>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-meta)", marginTop: "var(--space-2)" }}>
                {isFa ? "متصل به آزمون تعیین سطح و تمرین‌های روزانه" : "Linked to placement diagnostics & practice"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
