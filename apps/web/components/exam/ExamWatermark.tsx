"use client";

import React, { useMemo } from "react";

export interface ExamWatermarkProps {
  candidateName?: string;
  candidateId?: string;
  examTitle?: string;
  organization?: string;
  opacity?: number;
}

export function ExamWatermark({
  candidateName = "داوطلب آزمون",
  candidateId = "Endoora-ID",
  examTitle = "آزمون آنلاین",
  organization = "سامانه اندورا",
  opacity = 0.06,
}: ExamWatermarkProps) {
  // Construct a repeating string of unique identity identifiers
  const watermarkText = useMemo(() => {
    return `${candidateName} • ${candidateId} • ${examTitle} • ${organization}`;
  }, [candidateName, candidateId, examTitle, organization]);

  // Generate an array of repeating rows to tile across the entire viewport
  const rows = useMemo(() => Array.from({ length: 14 }), []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: "-50%",
        width: "200%",
        height: "200%",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        transform: "rotate(-25deg)",
        opacity,
        overflow: "hidden",
      }}
    >
      {rows.map((_, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: "flex",
            justifyContent: "space-around",
            whiteSpace: "nowrap",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "0.08em",
            transform: rIdx % 2 === 0 ? "translateX(-40px)" : "translateX(40px)",
          }}
        >
          <span>{watermarkText}</span>
          <span>{watermarkText}</span>
          <span>{watermarkText}</span>
          <span>{watermarkText}</span>
        </div>
      ))}
    </div>
  );
}
