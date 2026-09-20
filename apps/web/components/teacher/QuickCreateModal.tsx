"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@endoora/ui";
import { generateTeacherMaterial, fetchTeacherUsageSummary } from "@/lib/teacheros-api";
import type { MaterialType, TeacherUsageSummary } from "@endoora/contracts";

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: "fa" | "en";
}

export function QuickCreateModal({ isOpen, onClose, locale = "fa" }: QuickCreateModalProps) {
  const router = useRouter();
  const isFa = locale === "fa";

  const [materialType, setMaterialType] = useState<MaterialType>("lesson");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("B1");
  const [duration, setDuration] = useState("60");
  const [methodology, setMethodology] = useState<"ppp" | "esa" | "tbl">("ppp");
  const [activityFormat, setActivityFormat] = useState<"roleplay" | "infogap" | "debate" | "icebreaker" | "speaking">("roleplay");
  const [worksheetType, setWorksheetType] = useState<"grammar" | "vocabulary" | "reading" | "writing">("grammar");
  const [questionCount, setQuestionCount] = useState("10");

  const [usage, setUsage] = useState<TeacherUsageSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTeacherUsageSummary()
        .then(setUsage)
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg(isFa ? "لطفاً موضوع مورد نظر را وارد کنید." : "Please enter a topic.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const created = await generateTeacherMaterial({
        material_type: materialType,
        topic: topic.trim(),
        cefr_level: level,
        duration: Number(duration),
        methodology,
        activity_format: activityFormat,
        worksheet_type: worksheetType,
        question_count: Number(questionCount),
      });

      onClose();
      // Navigate to planning studio with the newly created material
      router.push(`/teacher/planning?materialId=${created.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      setErrorMsg(message || (isFa ? "خطا در تولید محتوا." : "Generation failed."));
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-create-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "var(--space-4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-surface, #0F172A)",
          border: "1px solid var(--color-border, #334155)",
          borderRadius: "var(--radius-card, 16px)",
          width: "100%",
          maxWidth: "580px",
          padding: "var(--space-6)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          color: "var(--color-text, #F8FAFC)",
          direction: isFa ? "rtl" : "ltr",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
          <div>
            <h2 id="quick-create-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
              {isFa ? "⚡ ساخت سریع محتوای آموزشی (Quick Create)" : "⚡ Quick Create Material"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--color-muted, #94A3B8)" }}>
              {isFa
                ? "تولید فوری و مستقل منابع آموزشی بدون نیاز به تعریف یا انتخاب کلاس."
                : "Instantly generate standalone teaching materials without selecting a class."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-muted, #94A3B8)",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            &times;
          </button>
        </div>

        {usage && (
          <div
            style={{
              background: "rgba(14, 165, 233, 0.1)",
              border: "1px solid rgba(14, 165, 233, 0.3)",
              borderRadius: "var(--radius-control, 8px)",
              padding: "var(--space-2) var(--space-3)",
              marginBottom: "var(--space-4)",
              fontSize: "0.85rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {isFa ? "🧠 اعتبار تولید هوش مصنوعی امروز:" : "🧠 Daily AI Quota:"}{" "}
              <strong style={{ color: "var(--color-endoora-blue, #0284C7)" }}>
                {usage.remaining_today} / {usage.daily_limit}
              </strong>
            </span>
            <small style={{ color: "var(--color-muted, #94A3B8)" }}>
              {isFa ? `طرح: ${usage.plan_name}` : `Plan: ${usage.plan_name}`}
            </small>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#FCA5A5",
              borderRadius: "var(--radius-control, 8px)",
              padding: "var(--space-3)",
              marginBottom: "var(--space-4)",
              fontSize: "0.9rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Material Type Selector */}
          <div style={{ marginBottom: "var(--space-4)" }}>
            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-2)", fontWeight: 600 }}>
              {isFa ? "نوع محتوای آموزشی" : "Material Type"}
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-2)" }}>
              {[
                { type: "lesson" as MaterialType, labelFa: "📚 طرح درس", labelEn: "Lesson" },
                { type: "activity" as MaterialType, labelFa: "🎲 فعالیت", labelEn: "Activity" },
                { type: "worksheet" as MaterialType, labelFa: "📝 تمرین", labelEn: "Worksheet" },
                { type: "assessment" as MaterialType, labelFa: "✅ آزمونک", labelEn: "Quiz" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setMaterialType(item.type)}
                  style={{
                    padding: "var(--space-2) var(--space-1)",
                    borderRadius: "var(--radius-control, 8px)",
                    border: materialType === item.type ? "2px solid var(--color-endoora-blue, #0284C7)" : "1px solid var(--color-border, #334155)",
                    background: materialType === item.type ? "rgba(2, 132, 199, 0.15)" : "var(--color-canvas, #020617)",
                    color: "inherit",
                    fontWeight: materialType === item.type ? 700 : 400,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textAlign: "center",
                  }}
                >
                  {isFa ? item.labelFa : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Level */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                {isFa ? "موضوع یا سناریو *" : "Topic / Theme *"}
              </label>
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={isFa ? "مثال: Ordering at a Restaurant" : "e.g., Job Interview Questions"}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                {isFa ? "سطح CEFR" : "CEFR Level"}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "var(--radius-control, 8px)",
                  background: "var(--color-canvas, #020617)",
                  color: "inherit",
                  border: "1px solid var(--color-border, #334155)",
                  fontSize: "0.9rem",
                }}
              >
                {["A1", "A2", "B1", "B2", "C1"].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Inputs based on Material Type */}
          {materialType === "lesson" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                  {isFa ? "متدولوژی تدریس" : "Methodology"}
                </label>
                <select
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value as "ppp" | "esa" | "tbl")}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "var(--radius-control, 8px)",
                    background: "var(--color-canvas, #020617)",
                    color: "inherit",
                    border: "1px solid var(--color-border, #334155)",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="ppp">PPP (Presentation, Practice, Production)</option>
                  <option value="esa">ESA (Engage, Study, Activate)</option>
                  <option value="tbl">TBL (Task-Based Learning)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                  {isFa ? "مدت زمان جلسه" : "Duration"}
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "var(--radius-control, 8px)",
                    background: "var(--color-canvas, #020617)",
                    color: "inherit",
                    border: "1px solid var(--color-border, #334155)",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="30">30 {isFa ? "دقیقه (مرور سریع)" : "min"}</option>
                  <option value="45">45 {isFa ? "دقیقه (کلاس استاندارد)" : "min"}</option>
                  <option value="60">60 {isFa ? "دقیقه (جلسه کامل)" : "min"}</option>
                  <option value="90">90 {isFa ? "دقیقه (کارگاه فشرده)" : "min"}</option>
                </select>
              </div>
            </div>
          )}

          {materialType === "activity" && (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                {isFa ? "فرمت فعالیت ارتباطی" : "Activity Format"}
              </label>
              <select
                value={activityFormat}
                onChange={(e) =>
                  setActivityFormat(e.target.value as "roleplay" | "infogap" | "debate" | "speaking" | "icebreaker")
                }
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "var(--radius-control, 8px)",
                  background: "var(--color-canvas, #020617)",
                  color: "inherit",
                  border: "1px solid var(--color-border, #334155)",
                  fontSize: "0.9rem",
                }}
              >
                <option value="roleplay">{isFa ? "🎭 نقش‌آفرینی دو نفره (Roleplay)" : "Roleplay"}</option>
                <option value="infogap">{isFa ? "🧩 تبادل شکاف اطلاعاتی (Info Gap)" : "Information Gap"}</option>
                <option value="debate">{isFa ? "⚖️ مناظره ساختاریافته (Debate)" : "Structured Debate"}</option>
                <option value="speaking">{isFa ? "🗣️ تمرین مکالمه تعاملی (Speaking)" : "Interactive Speaking"}</option>
                <option value="icebreaker">{isFa ? "🧊 یخ‌شکن ۵ دقیقه‌ای (Icebreaker)" : "Icebreaker"}</option>
              </select>
            </div>
          )}

          {materialType === "worksheet" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                  {isFa ? "نوع تمرین" : "Worksheet Type"}
                </label>
                <select
                  value={worksheetType}
                  onChange={(e) =>
                    setWorksheetType(e.target.value as "grammar" | "vocabulary" | "reading" | "writing")
                  }
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "var(--radius-control, 8px)",
                    background: "var(--color-canvas, #020617)",
                    color: "inherit",
                    border: "1px solid var(--color-border, #334155)",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="grammar">{isFa ? "گرامر و ساختار" : "Grammar"}</option>
                  <option value="vocabulary">{isFa ? "واژگان و اصطلاحات" : "Vocabulary"}</option>
                  <option value="reading">{isFa ? "درک مطلب و متن" : "Reading"}</option>
                  <option value="writing">{isFa ? "تولید نوشتاری هدایت‌شده" : "Writing"}</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                  {isFa ? "تعداد سوالات" : "Questions Count"}
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "var(--radius-control, 8px)",
                    background: "var(--color-canvas, #020617)",
                    color: "inherit",
                    border: "1px solid var(--color-border, #334155)",
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="5">5 {isFa ? "سوال" : "questions"}</option>
                  <option value="10">10 {isFa ? "سوال (استاندارد)" : "questions"}</option>
                  <option value="15">15 {isFa ? "سوال" : "questions"}</option>
                  <option value="20">20 {isFa ? "سوال (جامع)" : "questions"}</option>
                </select>
              </div>
            </div>
          )}

          {materialType === "assessment" && (
            <div style={{ marginBottom: "var(--space-4)" }}>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "var(--space-1)", fontWeight: 600 }}>
                {isFa ? "تعداد سوالات آزمون کالیبره‌شده" : "Assessment Questions Count"}
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "var(--radius-control, 8px)",
                  background: "var(--color-canvas, #020617)",
                  color: "inherit",
                  border: "1px solid var(--color-border, #334155)",
                  fontSize: "0.9rem",
                }}
              >
                <option value="10">10 {isFa ? "سوال (آزمونک تشخیصی)" : "questions (Diagnostic)"}</option>
                <option value="15">15 {isFa ? "سوال (میان‌ترم)" : "questions (Mid-unit)"}</option>
                <option value="20">20 {isFa ? "سوال (آزمون جامع نهایی)" : "questions (Achievement)"}</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", marginTop: "var(--space-6)" }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isGenerating}>
              {isFa ? "انصراف" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" disabled={isGenerating}>
              {isGenerating
                ? isFa
                  ? "⏳ در حال تولید با هوش مصنوعی…"
                  : "⏳ Generating..."
                : isFa
                ? "🚀 تولید سریع و انتقال به استودیو"
                : "🚀 Generate & Open Studio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
