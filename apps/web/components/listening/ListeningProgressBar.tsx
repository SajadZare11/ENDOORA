"use client";

import React from "react";
import type { CEFRLevel, ListeningProgressRecord } from "@endoora/contracts";

interface ListeningProgressBarProps {
  progress: ListeningProgressRecord;
  selectedLevel?: CEFRLevel | "all";
  onLevelSelect?: (level: CEFRLevel | "all") => void;
}

export const ListeningProgressBar: React.FC<ListeningProgressBarProps> = ({
  progress,
  selectedLevel = "all",
  onLevelSelect,
}) => {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const totalMinutes = Math.round(progress.summary.totalListeningSeconds / 60);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.25rem",
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
        marginBottom: "1.5rem",
        direction: "rtl",
      }}
    >
      {/* Overview Stat Counters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>درس‌های تکمیل‌شده</span>
          <strong style={statValueStyle}>{progress.summary.totalLessonsCompleted} درس</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>زمان آموزش صوتی</span>
          <strong style={statValueStyle}>{totalMinutes} دقیقه</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>میانگین دقت درک مطلب</span>
          <strong style={statValueStyle}>{progress.summary.overallAccuracyPercent}٪</strong>
        </div>
        <div style={statBoxStyle}>
          <span style={statLabelStyle}>استمرار و تداوم</span>
          <strong style={statValueStyle}>🔥 {progress.summary.currentStreakDays} روز</strong>
        </div>
      </div>

      {/* CEFR Level Horizontal Mastery Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
            میزان تسلط بر سطوح شش‌گانه CEFR:
          </span>
          {onLevelSelect && (
            <button
              type="button"
              onClick={() => onLevelSelect("all")}
              style={{
                background: selectedLevel === "all" ? "#2563eb" : "transparent",
                color: selectedLevel === "all" ? "#ffffff" : "#64748b",
                border: "none",
                borderRadius: "4px",
                padding: "0.2rem 0.5rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              نمایش همه سطوح
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
          {levels.map((lvl) => {
            const data = progress.byLevel[lvl] || { totalAvailable: 3, completedCount: 0, averageScorePercent: 0 };
            const pct = data.totalAvailable > 0 ? Math.round((data.completedCount / data.totalAvailable) * 100) : 0;
            const isSelected = selectedLevel === lvl;

            return (
              <div
                key={lvl}
                onClick={() => onLevelSelect?.(isSelected ? "all" : lvl)}
                style={{
                  background: isSelected ? "#eff6ff" : "#f8fafc",
                  border: isSelected ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "0.5rem 0.65rem",
                  cursor: onLevelSelect ? "pointer" : "default",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.3rem" }}>
                  <strong style={{ fontSize: "0.85rem", color: isSelected ? "#1d4ed8" : "#0f172a" }}>
                    سطح {lvl}
                  </strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                    {pct}٪
                  </span>
                </div>

                {/* Micro progress bar */}
                <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: pct === 100 ? "#16a34a" : "#2563eb",
                      borderRadius: "9999px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const statBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  padding: "0.6rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #f1f5f9",
  textAlign: "center",
};

const statLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  color: "#64748b",
  marginBottom: "0.2rem",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "1rem",
  color: "#0f172a",
};
