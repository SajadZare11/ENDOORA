"use client";

import React, { useState, useMemo } from "react";
import { SidaStudentRecord, RADAR_SUBJECTS, SubjectScoreBreakdown } from "../../lib/teacher-sida-gradebook";
import { StatTooltip } from "./StatTooltip";

interface SubjectRadarChartProps {
  students: SidaStudentRecord[];
}

export function SubjectRadarChart({ students }: SubjectRadarChartProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.studentId || ""
  );

  const selectedStudent = useMemo(
    () => students.find((s) => s.studentId === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  // Compute Class Average per subject
  const classAverages = useMemo(() => {
    const avgs: SubjectScoreBreakdown = {
      english: 0,
      math: 0,
      science: 0,
      literature: 0,
      history: 0,
    };
    if (students.length === 0) return avgs;

    for (const sub of RADAR_SUBJECTS) {
      const sum = students.reduce((acc, s) => acc + (s.subjectScores[sub.key] || 0), 0);
      avgs[sub.key] = Number((sum / students.length).toFixed(1));
    }
    return avgs;
  }, [students]);

  // Radar geometry
  const size = 320;
  const center = size / 2;
  const radius = 105;
  const numAxes = RADAR_SUBJECTS.length;
  const angleStep = (2 * Math.PI) / numAxes;
  const maxScore = 20;

  // Concentric polygon levels (e.g. 5, 10, 15, 20)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (value: number, axisIndex: number) => {
    const angle = axisIndex * angleStep - Math.PI / 2; // start from top
    const r = (Math.max(0, Math.min(maxScore, value)) / maxScore) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon path for a dataset
  const buildPolygonPath = (scores: SubjectScoreBreakdown) => {
    return RADAR_SUBJECTS.map((sub, i) => {
      const { x, y } = getCoordinates(scores[sub.key] || 0, i);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z";
  };

  const studentPolygon = selectedStudent ? buildPolygonPath(selectedStudent.subjectScores) : "";
  const classPolygon = buildPolygonPath(classAverages);

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-surface, #ffffff)",
        borderRadius: "12px",
        padding: "18px 20px",
        border: "1px solid var(--color-border-subtle, #e2e8f0)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--color-text-primary, #0f172a)" }}>
            ۴. رادار عنکبوتی مقایسه چنددرسی (Subject Comparison)
          </h3>
          <StatTooltip
            title="رادار چنددرسی"
            explanation="نمرات دانش‌آموز را در پنج درس اصلی با میانگین کل کلاس مقایسه می‌کند تا نقاط قوت، تعادل تحصیلی و دروس نیازمند تقویت شناسایی شوند."
            ruleOfThumb="سطح آبی نمایانگر عملکرد دانش‌آموز انتخابی و چندضلعی خط‌چین نارنجی میانگین کل کلاس است."
          />
        </div>

        {/* Student Selector Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>دانش‌آموز:</label>
          <select
            value={selectedStudent?.studentId || ""}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--color-border-subtle, #cbd5e1)",
              fontSize: "12px",
              backgroundColor: "var(--color-bg-surface, #ffffff)",
            }}
          >
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "280px", height: "280px", display: "block" }}>
          {/* Concentric grid webs */}
          {levels.map((lvl) => {
            const points = RADAR_SUBJECTS.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = lvl * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(" ");

            return (
              <g key={lvl}>
                <polygon
                  points={points}
                  fill="none"
                  stroke="var(--color-border-subtle, #e2e8f0)"
                  strokeWidth="1"
                />
                <text
                  x={center + 4}
                  y={center - lvl * radius + 10}
                  fill="var(--color-text-secondary, #94a3b8)"
                  fontSize="8"
                >
                  {lvl * maxScore}
                </text>
              </g>
            );
          })}

          {/* Radial Spokes */}
          {RADAR_SUBJECTS.map((sub, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            const labelX = center + (radius + 20) * Math.cos(angle);
            const labelY = center + (radius + 20) * Math.sin(angle);

            return (
              <g key={sub.key}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="var(--color-border-subtle, #e2e8f0)"
                  strokeWidth="1"
                />
                <text
                  x={labelX}
                  y={labelY + 4}
                  fill="var(--color-text-primary, #0f172a)"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {sub.labelFa}
                </text>
              </g>
            );
          })}

          {/* Class Average Polygon */}
          {classPolygon && (
            <polygon
              points={RADAR_SUBJECTS.map((sub, i) => {
                const { x, y } = getCoordinates(classAverages[sub.key] || 0, i);
                return `${x},${y}`;
              }).join(" ")}
              fill="rgba(245, 158, 11, 0.12)"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Selected Student Polygon */}
          {selectedStudent && (
            <polygon
              points={RADAR_SUBJECTS.map((sub, i) => {
                const { x, y } = getCoordinates(selectedStudent.subjectScores[sub.key] || 0, i);
                return `${x},${y}`;
              }).join(" ")}
              fill="rgba(37, 99, 235, 0.28)"
              stroke="#2563eb"
              strokeWidth="2.5"
            />
          )}

          {/* Data Points on vertices for student */}
          {selectedStudent &&
            RADAR_SUBJECTS.map((sub, i) => {
              const val = selectedStudent.subjectScores[sub.key] || 0;
              const { x, y } = getCoordinates(val, i);
              return (
                <circle
                  key={sub.key}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
        </svg>
      </div>

      {/* Legend & Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          backgroundColor: "var(--color-bg-muted, #f8fafc)",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        <div style={{ display: "flex", gap: "14px" }}>
          <span>
            <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#2563eb", borderRadius: "2px", marginInlineEnd: "4px" }}></span>
            {selectedStudent?.name || "دانش‌آموز"}
          </span>
          <span>
            <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#f59e0b", borderRadius: "2px", marginInlineEnd: "4px" }}></span>
            میانگین کل کلاس
          </span>
        </div>
        <div>
          {selectedStudent && (
            <span>
              نمره زبان: <strong>{selectedStudent.subjectScores.english}</strong> (میانگین کلاس: {classAverages.english})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
