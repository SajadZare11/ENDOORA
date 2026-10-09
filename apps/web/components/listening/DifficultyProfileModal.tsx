"use client";

import React, { useState } from "react";
import type { CEFRDifficultyProfile } from "@endoora/contracts";

interface DifficultyProfileModalProps {
  difficulty: CEFRDifficultyProfile;
}

export const DifficultyProfileModal: React.FC<DifficultyProfileModalProps> = ({ difficulty }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          background: "#f1f5f9",
          border: "1px solid #cbd5e1",
          borderRadius: "9999px",
          padding: "0.35rem 0.75rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#334155",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
        aria-label="مشاهده شناسنامه سختی CEFR"
      >
        <span>📊</span>
        <span>شناسنامه دشواری CEFR ({difficulty.cefrLevel})</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            direction: "rtl",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>
                  شناسنامه ۱۶ شاخصه سختی CEFR
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  کالیبراسیون علمی بر اساس اصول چارچوب مرجع مشترک اروپا
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            {/* Grid of 16 parameters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div style={metricCardStyle}>
                <span style={labelStyle}>سطح مرجع CEFR:</span>
                <strong style={valueStyle}>{difficulty.cefrLevel}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>سرعت گفتار (WPM):</span>
                <strong style={valueStyle}>{difficulty.speechRateWpm} کلمه در دقیقه</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>سطح واژگان:</span>
                <strong style={valueStyle}>{difficulty.vocabularyLevel}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>سطح گرامر و نحو:</span>
                <strong style={valueStyle}>{difficulty.grammarLevel}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>پیچیدگی جملات:</span>
                <strong style={valueStyle}>{difficulty.sentenceComplexity}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>تعداد گویندگان:</span>
                <strong style={valueStyle}>{difficulty.numberOfSpeakers} نفر</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>لهجه گفتاری:</span>
                <strong style={valueStyle}>{difficulty.accent}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>تراکم واژگان (Density):</span>
                <strong style={valueStyle}>{difficulty.vocabularyDensity}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>اصطلاحات و کنایات:</span>
                <strong style={valueStyle}>{difficulty.idiomaticLanguage}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>نیاز به استنباط معنایی:</span>
                <strong style={valueStyle}>{difficulty.inferenceRequirement}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>تراکم اطلاعاتی محتوا:</span>
                <strong style={valueStyle}>{difficulty.informationDensity}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>نویز و فضای محیطی:</span>
                <strong style={valueStyle}>{difficulty.backgroundNoise}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>میزان تکرار کلمات:</span>
                <strong style={valueStyle}>{difficulty.repetition}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>بسامد تعویض گوینده:</span>
                <strong style={valueStyle}>{difficulty.speakerTurnFrequency}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>پیچیدگی کاربردشناختی:</span>
                <strong style={valueStyle}>{difficulty.pragmaticComplexity}</strong>
              </div>

              <div style={metricCardStyle}>
                <span style={labelStyle}>مدت زمان فایل صوتی:</span>
                <strong style={valueStyle}>{difficulty.durationSeconds} ثانیه</strong>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "left", marginTop: "1.25rem" }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                بستن شناسنامه
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const metricCardStyle: React.CSSProperties = {
  background: "#f8fafc",
  padding: "0.6rem 0.85rem",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#64748b",
};

const valueStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#0f172a",
  direction: "ltr",
};
