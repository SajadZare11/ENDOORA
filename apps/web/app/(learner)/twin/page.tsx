"use client";

import Link from "next/link";
import { useLearnerHome } from "../../../components/learner/LearnerShell";

export default function LearnerTwinPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";

  const placementCompleted = data.path_steps?.find((step) => step.id === "placement")?.state === "complete";

  return (
    <div style={{ maxWidth: "56rem", marginInline: "auto", padding: "var(--space-4)" }}>
      <Link className="learner-back-link" href="/dashboard" style={{ display: "inline-block", marginBlockEnd: "var(--space-4)" }}>
        {isFa ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>

      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlockEnd: "var(--space-2)" }}>
          {isFa ? "دوقلوی یادگیری (Learner Twin)" : "Learner Digital Twin"}
        </h1>
        <p className="learner-muted" style={{ marginBlockEnd: "var(--space-6)" }}>
          {isFa
            ? "دوقلوی یادگیری Endoora تصویری زنده و شفاف از توانمندی‌های زبانی شماست که صرفاً بر مبنای شواهد عینی آزمون‌ها و تمرین‌ها ساخته می‌شود."
            : "The Endoora Learner Twin is an explainable digital profile reflecting your verified language competency strictly grounded in evidence."}
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="learner-button learner-button--primary" href="/placement/report">
            {isFa ? "مشاهده شواهد کارنامه تعیین سطح" : "Inspect placement evidence"}
          </Link>
          <Link className="learner-button learner-button--secondary" href="/placement/demo">
            {isFa ? "آزمون مجدد تعیین سطح" : "Retake placement"}
          </Link>
        </div>
      </div>

      {/* Profile Evidence Model */}
      <div className="learner-card" style={{ marginBlockEnd: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--font-size-title-2)", marginBlockEnd: "var(--space-3)" }}>
          {isFa ? "وضعیت کنونی شواهد مهارتی" : "Current Verified Skill Evidence"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "var(--space-4)", marginBlock: "var(--space-4)" }}>
          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "دستور زبان (Grammar)" : "Grammar"}</span>
            <div style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginTop: "var(--space-1)" }}>
              {placementCompleted ? (isFa ? "ارزیابی‌شده" : "Evaluated") : (isFa ? "در انتظار آزمون" : "Pending test")}
            </div>
            <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              {isFa ? "پوشش زمان‌های حال، گذشته، کامل و شرطی" : "Present, past, perfect & conditional"}
            </p>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "واژگان (Vocabulary)" : "Vocabulary"}</span>
            <div style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginTop: "var(--space-1)" }}>
              {placementCompleted ? (isFa ? "ارزیابی‌شده" : "Evaluated") : (isFa ? "در انتظار آزمون" : "Pending test")}
            </div>
            <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              {isFa ? "پوشش واژگان روزمره، سفر، کار و دانشگاهی" : "Routine, travel, workplace & academic"}
            </p>
          </div>

          <div style={{ padding: "var(--space-4)", background: "var(--color-surface-hover)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>{isFa ? "درک مطلب (Reading)" : "Reading"}</span>
            <div style={{ fontSize: "var(--font-size-title-3)", fontWeight: 700, marginTop: "var(--space-1)" }}>
              {placementCompleted ? (isFa ? "ارزیابی‌شده" : "Evaluated") : (isFa ? "در انتظار آزمون" : "Pending test")}
            </div>
            <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
              {isFa ? "پوشش پیام اصلی، جزییات و استنباط معنایی" : "Main idea, detail extraction & inference"}
            </p>
          </div>
        </div>

        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", padding: "var(--space-4)", marginTop: "var(--space-4)" }}>
          <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "اصل عدم قطعیت کاذب" : "Honesty Principle"}
          </h3>
          <p style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            {isFa
              ? "دوقلوی یادگیری هرگز درصدهای ساختگی یا ادعاهای قطعی ارائه نمی‌دهد. هر توصیه بر پایه آزمون‌های استاندارد شده و پاسخ‌های ثبت شده شما صورت می‌پذیرد."
              : "The Learner Twin never generates fabricated percentages. All recommendations originate directly from standardized diagnostics."}
          </p>
        </div>
      </div>
    </div>
  );
}
