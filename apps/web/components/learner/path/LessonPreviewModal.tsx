"use client";

import React from "react";
import { PathNode, PathUnit, PathNodeStatus } from "../../../lib/learning-path-storage";
import styles from "./learning-path.module.css";

interface LessonPreviewModalProps {
  node: PathNode;
  unit: PathUnit;
  status: PathNodeStatus;
  starsCount: number;
  onClose: () => void;
  onStart: () => void;
}

const SKILL_THEME_MAP: Record<
  string,
  { labelFa: string; color: string; bg: string; icon: string }
> = {
  concept: {
    labelFa: "درس مفهومی و ساختاری",
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.1)",
    icon: "📖",
  },
  receptive: {
    labelFa: "درک مطلب و شنیداری",
    color: "#0d9488",
    bg: "rgba(13, 148, 136, 0.1)",
    icon: "🎧",
  },
  speaking: {
    labelFa: "مکالمه فعال و هوش مصنوعی",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    icon: "🎙️",
  },
  leitner: {
    labelFa: "تثبیت در جعبه لایتنر",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)",
    icon: "🧠",
  },
  boss: {
    labelFa: "غول‌آزمون جامع یونیت",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.1)",
    icon: "🏆",
  },
  side_quest: {
    labelFa: "ماموریت جانبی ماجراجویی",
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.1)",
    icon: "✨",
  },
};

export const LessonPreviewModal: React.FC<LessonPreviewModalProps> = ({
  node,
  unit,
  status,
  starsCount,
  onClose,
  onStart,
}) => {
  const theme = SKILL_THEME_MAP[node.type] || {
    labelFa: node.typeLabelFa,
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.1)",
    icon: node.icon,
  };

  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px", padding: "1.75rem", position: "relative" }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="بستن پنجره"
          style={{
            position: "absolute",
            top: "1.25rem",
            left: "1.25rem",
            background: "none",
            border: "none",
            fontSize: "1.25rem",
            color: "var(--color-muted, #94a3b8)",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Header Icon & Skill Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBlockEnd: "1.25rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: theme.bg,
              border: `2px solid ${theme.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.85rem",
              boxShadow: `0 4px 14px ${theme.color}25`,
              flexShrink: 0,
            }}
          >
            {node.icon}
          </div>

          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
                background: theme.bg,
                color: theme.color,
                fontSize: "0.75rem",
                fontWeight: 800,
                border: `1px solid ${theme.color}35`,
                marginBlockEnd: "0.35rem",
              }}
            >
              <span>{theme.icon}</span>
              <span>{theme.labelFa}</span>
            </span>

            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted, #64748b)" }}>
              {unit.titleFa} • مرحله {node.order} از {unit.nodes.length}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 850,
            color: "var(--color-text-primary, #0f172a)",
            margin: "0 0 0.25rem 0",
            lineHeight: 1.5,
          }}
        >
          {node.titleFa}
        </h3>

        <div
          dir="ltr"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-text-muted, #64748b)",
            marginBlockEnd: "1rem",
            textAlign: "start",
          }}
        >
          {node.titleEn}
        </div>

        {/* Lesson Summary Card */}
        <div
          style={{
            background: "var(--color-canvas, #f8fafc)",
            border: "1px solid var(--color-border, #e2e8f0)",
            borderRadius: "12px",
            padding: "1rem",
            marginBlockEnd: "1.25rem",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "var(--color-text-muted, #94a3b8)",
              marginBlockEnd: "0.35rem",
            }}
          >
            🎯 هدف آموزشی این مرحله:
          </span>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "var(--color-text-primary, #334155)",
            }}
          >
            {node.summaryFa || "تسلط کاربردی بر واژگان و الگوهای گفتاری این مبحث به روش تعاملی و استقرایی."}
          </p>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
            marginBlockEnd: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "0.65rem",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.06)",
              border: "1px solid rgba(37, 99, 235, 0.15)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>زمان تقریبی</span>
            <strong style={{ fontSize: "0.95rem", color: "#2563eb", marginTop: "0.15rem", display: "block" }}>
              ⏱️ {node.estimatedMinutes || 5} دقیقه
            </strong>
          </div>

          <div
            style={{
              padding: "0.65rem",
              borderRadius: "10px",
              background: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>پاداش تسلط</span>
            <strong style={{ fontSize: "0.95rem", color: "#8b5cf6", marginTop: "0.15rem", display: "block" }}>
              ⚡ +{node.xpReward || 30} XP
            </strong>
          </div>

          <div
            style={{
              padding: "0.65rem",
              borderRadius: "10px",
              background: isCompleted ? "rgba(16, 185, 129, 0.08)" : "rgba(241, 245, 249, 0.8)",
              border: isCompleted ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>وضعیت مرحله</span>
            <strong
              style={{
                fontSize: "0.9rem",
                color: isCompleted ? "#059669" : isLocked ? "#94a3b8" : "#2563eb",
                marginTop: "0.15rem",
                display: "block",
              }}
            >
              {isCompleted ? "✅ فتح‌شده" : isLocked ? "🔒 قفل" : "آماده یادگیری"}
            </strong>
          </div>
        </div>

        {/* Stars row if completed */}
        {isCompleted && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              marginBlockEnd: "1.25rem",
              padding: "0.5rem",
              background: "rgba(245, 158, 11, 0.08)",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#d97706" }}>امتیاز تسلط شما:</span>
            {Array.from({ length: starsCount || 3 }).map((_, i) => (
              <span key={i} style={{ fontSize: "1.1rem" }} role="img" aria-label="ستاره">
                ⭐
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#dc2626",
              fontSize: "0.85rem",
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            🔒 این مرحله در حال حاضر قفل است. لطفاً ابتدا مراحل قبلی یونیت را به پایان برسانید.
          </div>
        ) : (
          <button
            type="button"
            onClick={onStart}
            style={{
              width: "100%",
              padding: "0.9rem 1.5rem",
              borderRadius: "12px",
              background: isCompleted
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: isCompleted
                ? "0 4px 14px rgba(16, 185, 129, 0.35)"
                : "0 4px 14px rgba(37, 99, 235, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <span>{isCompleted ? "مرور مجدد درس" : "شروع یادگیری این مرحله"}</span>
            <span aria-hidden="true">←</span>
          </button>
        )}
      </div>
    </div>
  );
};
