"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { TwinSnapshot } from "../../lib/ai/learner-twin-types";
import { TWIN_CATALOG } from "../../lib/ai/learner-twin-store";
import styles from "./twin.module.css";

export interface SkillScoreItem {
  id: "listening" | "reading" | "writing" | "speaking" | "grammar" | "vocabulary";
  nameFa: string;
  nameEn: string;
  icon: string;
  band: number; // 1.0 to 9.0
  evidenceCount: number;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  practiceHref: string;
  descriptionFa: string;
}

export default function TwinRadarChart({
  snapshot,
  forecastBand,
  forecastCefr,
  isFa,
}: {
  snapshot: TwinSnapshot;
  forecastBand?: number;
  forecastCefr?: string;
  isFa: boolean;
}) {
  const [activeSkillId, setActiveSkillId] = useState<string>("speaking");

  // Calculate 6 skills scores from snapshot
  const skillsData = useMemo<SkillScoreItem[]>(() => {
    // 1. Listening
    const listCount = snapshot.modalityMastery.listening.evidenceCount;
    const listMean = snapshot.modalityMastery.listening.mean;
    const listBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * listMean)) * 2) / 2;

    // 2. Reading
    const readCount = snapshot.modalityMastery.reading.evidenceCount;
    const readMean = snapshot.modalityMastery.reading.mean;
    const readBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * readMean)) * 2) / 2;

    // 3. Writing
    const writeCount = snapshot.modalityMastery.writing.evidenceCount;
    const writeMean = snapshot.modalityMastery.writing.mean;
    const writeBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * writeMean)) * 2) / 2;

    // 4. Speaking
    const speakCount = snapshot.modalityMastery.speaking.evidenceCount;
    const speakMean = snapshot.modalityMastery.speaking.mean;
    const speakBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * speakMean)) * 2) / 2;

    // 5. Grammar (computed from the 60 AEF grammar nodes)
    const grammarNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    });
    const grammarMean =
      grammarNodes.length > 0
        ? grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length
        : 0.55;
    const grammarCount = grammarNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const grammarBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * grammarMean)) * 2) / 2;

    // 6. Vocabulary & Discourse (computed from discourse nodes)
    const vocabNodes = snapshot.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    });
    const vocabMean =
      vocabNodes.length > 0
        ? vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length
        : 0.58;
    const vocabCount = vocabNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const vocabBand = Math.round(Math.max(1, Math.min(9, 1 + 8 * vocabMean)) * 2) / 2;

    const toCefr = (band: number): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" => {
      if (band >= 8.5) return "C2";
      if (band >= 7.0) return "C1";
      if (band >= 5.5) return "B2";
      if (band >= 4.0) return "B1";
      if (band >= 2.5) return "A2";
      return "A1";
    };

    return [
      {
        id: "speaking",
        nameFa: "مکالمه (Speaking)",
        nameEn: "Speaking",
        icon: "🎙️",
        band: speakBand,
        evidenceCount: speakCount,
        cefr: toCefr(speakBand),
        practiceHref: "/skills/speaking/game",
        descriptionFa: "روانی کلام، کاربرد اصطلاحات طبیعی و تلفظ صحیح",
      },
      {
        id: "listening",
        nameFa: "شنیداری (Listening)",
        nameEn: "Listening",
        icon: "🎧",
        band: listBand,
        evidenceCount: listCount,
        cefr: toCefr(listBand),
        practiceHref: "/listening",
        descriptionFa: "درک مکالمات واقعی، لهجه‌های گوناگون و جزئیات صوتی",
      },
      {
        id: "vocabulary",
        nameFa: "دایره واژگان (Vocabulary)",
        nameEn: "Vocabulary",
        icon: "📚",
        band: vocabBand,
        evidenceCount: vocabCount,
        cefr: toCefr(vocabBand),
        practiceHref: "/leitner",
        descriptionFa: "وسعت لغات کاربردی، کلمات آکادمیک و کالوکیشن‌ها",
      },
      {
        id: "writing",
        nameFa: "نگارش (Writing)",
        nameEn: "Writing",
        icon: "✍️",
        band: writeBand,
        evidenceCount: writeCount,
        cefr: toCefr(writeBand),
        practiceHref: "/ielts/writing/ai-evaluator",
        descriptionFa: "انسجام متن، تنوع ساختاری و دقت گرامری در نوشتن",
      },
      {
        id: "grammar",
        nameFa: "دستور زبان (Grammar)",
        nameEn: "Grammar",
        icon: "🧩",
        band: grammarBand,
        evidenceCount: grammarCount,
        cefr: toCefr(grammarBand),
        practiceHref: "/skills/grammar-hex/adaptive-lab",
        descriptionFa: "تسلط بر زمان‌ها، شرطی‌ها، مجهول و ساختارهای پیچیده",
      },
      {
        id: "reading",
        nameFa: "درک مطلب (Reading)",
        nameEn: "Reading",
        icon: "📖",
        band: readBand,
        evidenceCount: readCount,
        cefr: toCefr(readBand),
        practiceHref: "/ielts/clinics",
        descriptionFa: "سرعت خواندن، اسکن کلمات کلیدی و استنباط معنا",
      },
    ];
  }, [snapshot]);

  // Overall calculations
  const overallBand = useMemo(() => {
    if (forecastBand) return forecastBand;
    const sum = skillsData.reduce((acc, curr) => acc + curr.band, 0);
    return Math.round((sum / skillsData.length) * 2) / 2;
  }, [skillsData, forecastBand]);

  const overallPowerPercent = Math.min(100, Math.round((overallBand / 9) * 100));

  const lowestSkill = useMemo(() => {
    const sorted = [...skillsData].sort((a, b) => a.band - b.band);
    return sorted[0];
  }, [skillsData]);

  const activeSkill = useMemo(() => {
    return skillsData.find((s) => s.id === activeSkillId) ?? skillsData[0];
  }, [skillsData, activeSkillId]);

  // Geometry configuration for the SVG Radar (6 vertices)
  const size = 440;
  const center = size / 2;
  const maxRadius = 150;
  const numAxes = 6;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2; // Start from top vertex (Speaking)

  // Points for concentric guide circles (Bands 2, 4, 6, 8, 9)
  const guideBands = [2, 4, 6, 8, 9];

  // Calculate polygon points based on student's bands out of 9
  const polygonPoints = useMemo(() => {
    return skillsData
      .map((skill, i) => {
        const angle = startAngle + i * angleStep;
        // Map 1-9 to visual radius
        const r = (skill.band / 9) * maxRadius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [skillsData, maxRadius, center, startAngle, angleStep]);

  // Apex vertices coords for labels and pins
  const apexVertices = useMemo(() => {
    return skillsData.map((skill, i) => {
      const angle = startAngle + i * angleStep;
      // Position for data point
      const dataR = (skill.band / 9) * maxRadius;
      const dataX = center + dataR * Math.cos(angle);
      const dataY = center + dataR * Math.sin(angle);

      // Position for outer axis guide
      const axisX = center + maxRadius * Math.cos(angle);
      const axisY = center + maxRadius * Math.sin(angle);

      // Position for outside label button
      const labelR = maxRadius + 38;
      const labelX = center + labelR * Math.cos(angle);
      const labelY = center + labelR * Math.sin(angle);

      return {
        ...skill,
        angle,
        dataX,
        dataY,
        axisX,
        axisY,
        labelX,
        labelY,
      };
    });
  }, [skillsData, maxRadius, center, startAngle, angleStep]);

  return (
    <section className={styles.radarCard} aria-label={isFa ? "شش‌گوشه مهارت‌ها و قدرت کلی" : "6-Skill Radar Chart and Power Hub"}>
      {/* Header */}
      <div className={styles.radarHeader}>
        <div>
          <span className={styles.eyebrow}>
            {isFa ? "هاب قدرت و نمودار راداری شش‌گانه" : "RADAR POWER HUB · IELTS 9 SCALE"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isFa ? "شش‌گوشه مهارت‌ها و قدرت کلی زبان تو" : "Your 6-Skill Radar & Overall Power"}
          </h2>
          <p className={styles.sectionDesc}>
            {isFa
              ? "این نمودار راداری شش‌ضلعی بر اساس نمره‌دهی رسمی آیلتس (از ۱ تا ۹)، وضعیت توانمندی تو را در هر شش مهارت نشان می‌دهد."
              : "A hexagonal radar benchmarked against the official IELTS 1–9 scale, tracking your strengths and weak points."}
          </p>
        </div>

        {/* Big Overall Power Hub Badge */}
        <div className={styles.radarPowerHubBadge}>
          <div className={styles.radarPowerHubRing}>
            <span className={styles.radarPowerHubScore}>
              {overallBand.toFixed(1)}
            </span>
            <small className={styles.radarPowerHubMax}>از ۹</small>
          </div>
          <div className={styles.radarPowerHubText}>
            <strong>{isFa ? "قدرت کلی دوقلو" : "Overall Power"}</strong>
            <span>
              {overallPowerPercent}٪ {isFa ? "تسلط کلی" : "Readiness"} · {forecastCefr ?? "B2"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container: Radar SVG on Left, Interactive Detail & Recommendation on Right */}
      <div className={styles.radarMainLayout}>
        {/* Radar Graphic Area */}
        <div className={styles.radarSvgCol}>
          <div className={styles.radarSvgWrapper}>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className={styles.radarSvg}
              role="img"
              aria-label={isFa ? "نمودار راداری شش مهارت" : "6-Skill Radar chart"}
            >
              <defs>
                <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                </linearGradient>
                <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric Guide Circles with Band Numbers */}
              {guideBands.map((bandVal) => {
                const r = (bandVal / 9) * maxRadius;
                return (
                  <g key={bandVal}>
                    <circle
                      cx={center}
                      cy={center}
                      r={r}
                      className={styles.radarGuideCircle}
                    />
                    <text
                      x={center + 5}
                      y={center - r + 11}
                      className={styles.radarGuideText}
                    >
                      {bandVal}
                    </text>
                  </g>
                );
              })}

              {/* Radial Spokes (Axes) */}
              {apexVertices.map((vertex) => (
                <line
                  key={vertex.id}
                  x1={center}
                  y1={center}
                  x2={vertex.axisX}
                  y2={vertex.axisY}
                  className={styles.radarAxisSpoke}
                />
              ))}

              {/* The Student Proficiency Polygon */}
              <polygon
                points={polygonPoints}
                className={styles.radarPolygon}
                filter="url(#radarGlow)"
              />

              {/* Interactive Vertex Nodes on Polygon */}
              {apexVertices.map((vertex) => {
                const isSelected = activeSkillId === vertex.id;
                return (
                  <g
                    key={vertex.id}
                    className={`${styles.radarVertexGroup} ${isSelected ? styles.radarVertexActive : ""}`}
                    onClick={() => setActiveSkillId(vertex.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${vertex.nameFa}: Band ${vertex.band}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSkillId(vertex.id);
                      }
                    }}
                  >
                    <circle
                      cx={vertex.dataX}
                      cy={vertex.dataY}
                      r={isSelected ? "9" : "6.5"}
                      className={styles.radarVertexDot}
                    />
                    <circle
                      cx={vertex.dataX}
                      cy={vertex.dataY}
                      r={isSelected ? "16" : "11"}
                      className={styles.radarVertexHalo}
                    />
                    <text
                      x={vertex.dataX}
                      y={vertex.dataY - 14}
                      textAnchor="middle"
                      className={styles.radarVertexBadgeText}
                    >
                      {vertex.band}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Positioned HTML Labels Around the 6 Corners */}
            {apexVertices.map((vertex) => {
              const isSelected = activeSkillId === vertex.id;
              // Map percentage position based on vertex.labelX and labelY
              const leftPercent = (vertex.labelX / size) * 100;
              const topPercent = (vertex.labelY / size) * 100;

              return (
                <button
                  key={vertex.id}
                  type="button"
                  className={`${styles.radarCornerBtn} ${isSelected ? styles.radarCornerBtnActive : ""}`}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                  }}
                  onClick={() => setActiveSkillId(vertex.id)}
                >
                  <span className={styles.radarCornerIcon}>{vertex.icon}</span>
                  <span className={styles.radarCornerName}>
                    {isFa ? vertex.nameFa.split(" ")[0] : vertex.nameEn}
                  </span>
                  <span className={styles.radarCornerBand}>
                    {vertex.band.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Skill Details & Lowest Skill Recommendation */}
        <div className={styles.radarDetailCol}>
          {/* Active Selected Skill Card */}
          <div className={styles.radarActiveCard}>
            <div className={styles.radarActiveHeader}>
              <div className={styles.radarActiveIconBox}>{activeSkill.icon}</div>
              <div>
                <span className={styles.radarActiveCefrBadge}>{activeSkill.cefr}</span>
                <h3 className={styles.radarActiveTitle}>
                  {isFa ? activeSkill.nameFa : activeSkill.nameEn}
                </h3>
                <p className={styles.radarActiveDesc}>
                  {activeSkill.descriptionFa}
                </p>
              </div>
            </div>

            <div className={styles.radarActiveMetrics}>
              <div className={styles.radarMetricSmallBox}>
                <span>{isFa ? "نمره از ۹ (IELTS Band)" : "Band Score (out of 9)"}</span>
                <strong className={styles.radarBandHighlight}>
                  {activeSkill.band.toFixed(1)}
                  <small> / ۹.۰</small>
                </strong>
              </div>

              <div className={styles.radarMetricSmallBox}>
                <span>{isFa ? "شواهد یادگیری ثبت‌شده" : "Recorded Interactions"}</span>
                <strong>
                  {activeSkill.evidenceCount > 0
                    ? `${activeSkill.evidenceCount} ${isFa ? "پاسخ" : "items"}`
                    : (isFa ? "آزمون اولیه" : "Initial estimate")}
                </strong>
              </div>
            </div>

            <Link href={activeSkill.practiceHref} className={styles.radarActiveCta}>
              <span>🎯</span>
              <span>{isFa ? `شروع تمرین اختصاصی ${activeSkill.nameFa.split(" ")[0]}` : `Practice ${activeSkill.nameEn} Now`}</span>
              <span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
          </div>

          {/* Smart Twin Recommendation Box */}
          <div className={styles.radarSmartRecBox}>
            <div className={styles.radarSmartRecTop}>
              <span className={styles.radarSmartRecIcon}>💡</span>
              <div>
                <strong className={styles.radarSmartRecTitle}>
                  {isFa ? "پیشنهاد هوشمند دوقلو برای جهش نمره:" : "AI Leap Recommendation:"}
                </strong>
                <p className={styles.radarSmartRecText}>
                  {isFa
                    ? `مهارت «${lowestSkill.nameFa}» با نمره ${lowestSkill.band.toFixed(1)} بیشترین پتانسیل را برای افزایش قدرت کلی تو دارد. با یک تمرین ۱۰ دقیقه‌ای می‌توانی آن را به سطح بالاتر برسانی.`
                    : `${lowestSkill.nameEn} (Band ${lowestSkill.band.toFixed(1)}) holds the greatest leap potential to boost your overall readiness score.`}
                </p>
              </div>
            </div>

            <Link href={lowestSkill.practiceHref} className={styles.radarSmartRecBtn}>
              <span>⚡</span>
              <span>
                {isFa
                  ? `تقویت و تمرین ${lowestSkill.nameFa.split(" ")[0]}`
                  : `Boost ${lowestSkill.nameEn}`}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
