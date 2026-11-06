"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllRealLifeLevels, RealLifeLevelMeta, getRealLifeLessonById } from "@/lib/real-life-curriculum";
import { getRealLifeLevelSummary, getRealLifeAllProgress, RealLifeLevelSummary } from "@/lib/real-life-progress";
import { getAllAEFLevels, AEFLevelMeta, getAEFLessonById } from "@/lib/aef-curriculum";
import { getAEFLevelSummary, getAEFAllProgress, AEFLevelSummary } from "@/lib/aef-progress";
import styles from "@/components/video-learning/video-learning.module.css";

interface ContinueLessonInfo {
  track: "real-life" | "aef";
  trackNameFa: string;
  level: string;
  lessonId: string;
  titleFa: string;
  titleEn: string;
  episodeNumber: number;
  watchPercentage: number;
  href: string;
}

export default function VideoCoursesHubPage() {
  const [selectedCurriculum, setSelectedCurriculum] = useState<"real-life" | "aef">("real-life");
  const [realLifeLevels, setRealLifeLevels] = useState<RealLifeLevelMeta[]>([]);
  const [realLifeSummaries, setRealLifeSummaries] = useState<Record<string, RealLifeLevelSummary>>({});
  const [aefLevels, setAefLevels] = useState<AEFLevelMeta[]>([]);
  const [aefSummaries, setAefSummaries] = useState<Record<string, AEFLevelSummary>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [continueLesson, setContinueLesson] = useState<ContinueLessonInfo | null>(null);

  useEffect(() => {
    // Load Real-Life levels
    const rlAll = getAllRealLifeLevels();
    setRealLifeLevels(rlAll);

    const loadRealLifeSummaries = () => {
      const sumMap: Record<string, RealLifeLevelSummary> = {};
      for (const lvl of rlAll) {
        sumMap[lvl.tier] = getRealLifeLevelSummary(lvl.tier);
      }
      setRealLifeSummaries(sumMap);
    };
    loadRealLifeSummaries();
    window.addEventListener("real-life-progress-updated", loadRealLifeSummaries);

    // Load AEF levels
    const aefAll = getAllAEFLevels();
    setAefLevels(aefAll);

    const loadAefSummaries = () => {
      const sumMap: Record<string, AEFLevelSummary> = {};
      for (const lvl of aefAll) {
        sumMap[lvl.tier] = getAEFLevelSummary(lvl.tier);
      }
      setAefSummaries(sumMap);
    };
    loadAefSummaries();
    window.addEventListener("aef-progress-updated", loadAefSummaries);

    // Find latest active continue lesson across both tracks
    const resolveContinueLesson = () => {
      let latestCandidate: ContinueLessonInfo | null = null;
      let latestTime = 0;

      // Check Speakout
      const rlProg = getRealLifeAllProgress();
      for (const [id, p] of Object.entries(rlProg)) {
        const time = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        if (time >= latestTime && p.watchPercentage > 0) {
          latestTime = time;
          const les = getRealLifeLessonById(id);
          if (les) {
            latestCandidate = {
              track: "real-life",
              trackNameFa: "انگلیسی دنیای واقعی (Speakout)",
              level: les.level,
              lessonId: les.id,
              titleFa: les.titleFa,
              titleEn: les.titleEn,
              episodeNumber: les.episodeNumber,
              watchPercentage: p.watchPercentage,
              href: `/learn/video/${les.level}/speakout/${les.id}`,
            };
          }
        }
      }

      // Check AEF
      const aefProg = getAEFAllProgress();
      for (const [id, p] of Object.entries(aefProg)) {
        const time = p.updatedAt ? new Date(p.updatedAt).getTime() : 0;
        if (time >= latestTime && p.watchPercentage > 0) {
          latestTime = time;
          const les = getAEFLessonById(id);
          if (les) {
            latestCandidate = {
              track: "aef",
              trackNameFa: "داستان‌های منهتن (AEF)",
              level: les.level,
              lessonId: les.id,
              titleFa: les.titleFa,
              titleEn: les.titleEn,
              episodeNumber: les.episodeNumber,
              watchPercentage: p.watchPercentage,
              href: `/learn/video/${les.level}/aef/${les.id}`,
            };
          }
        }
      }

      setContinueLesson(latestCandidate);
    };

    resolveContinueLesson();
    window.addEventListener("real-life-progress-updated", resolveContinueLesson);
    window.addEventListener("aef-progress-updated", resolveContinueLesson);

    return () => {
      window.removeEventListener("real-life-progress-updated", loadRealLifeSummaries);
      window.removeEventListener("aef-progress-updated", loadAefSummaries);
      window.removeEventListener("real-life-progress-updated", resolveContinueLesson);
      window.removeEventListener("aef-progress-updated", resolveContinueLesson);
    };
  }, []);

  const currentLevels = selectedCurriculum === "real-life" ? realLifeLevels : aefLevels;
  const currentSummaries = selectedCurriculum === "real-life" ? realLifeSummaries : aefSummaries;

  const filteredLevels = currentLevels.filter((lvl) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lvl.levelNameFa.toLowerCase().includes(q) ||
      lvl.levelNameEn.toLowerCase().includes(q) ||
      lvl.bookTitleFa.toLowerCase().includes(q) ||
      lvl.cefr.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container} dir="rtl">
      {/* Header & Breadcrumb */}
      <div className={styles.headerSection}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/dashboard">داشبورد</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/learn?tab=video">یادگیری</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {selectedCurriculum === "real-life"
              ? "انگلیسی کاربردی در دنیای واقعی"
              : "دوره‌های American English File"}
          </span>
        </nav>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className={styles.pageTitle}>
              <span>🎬</span>
              <span>
                {selectedCurriculum === "real-life"
                  ? "انگلیسی کاربردی در دنیای واقعی (Real-Life Practical English)"
                  : "دوره‌های ویدیویی American English File"}
              </span>
            </h1>
            <p className={styles.pageSubtitle}>
              {selectedCurriculum === "real-life"
                ? "مجموعه ویدیوهای مدرن با همکاری BBC شامل مصاحبه‌های خیابانی زنده (Vox Pops)، مکالمات کاربردی روزمره و مستندهای جذاب، همراه با سنجش ۶ مهارت زبانی."
                : "آموزش زبان انگلیسی در ۶ سطح استاندارد با داستان پیوسته، ترنسکریپت و آزمون‌های تعاملی."}
            </p>
          </div>

          {/* Curriculum Switcher Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f1f5f9",
              padding: "0.3rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedCurriculum("real-life")}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "9px",
                border: "none",
                fontWeight: 750,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: selectedCurriculum === "real-life" ? "#ffffff" : "transparent",
                color: selectedCurriculum === "real-life" ? "#2563eb" : "#64748b",
                boxShadow: selectedCurriculum === "real-life" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>✨</span>
              <span>انگلیسی دنیای واقعی (جدید)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCurriculum("aef")}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "9px",
                border: "none",
                fontWeight: 750,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: selectedCurriculum === "aef" ? "#ffffff" : "transparent",
                color: selectedCurriculum === "aef" ? "#2563eb" : "#64748b",
                boxShadow: selectedCurriculum === "aef" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              آرشیو AEF
            </button>
          </div>
        </div>
      </div>

      {/* Continue Learning Active Card (if user has active session) */}
      {continueLesson && (
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "1.25rem 1.75rem",
            marginBottom: "1.75rem",
            boxShadow: "0 8px 24px -4px rgba(37, 99, 235, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.75rem",
                flexShrink: 0,
              }}
            >
              ▶️
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    background: "rgba(255, 255, 255, 0.25)",
                    padding: "0.15rem 0.55rem",
                    borderRadius: "6px",
                  }}
                >
                  {continueLesson.trackNameFa}
                </span>
                <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                  سطح {continueLesson.level.toUpperCase()} · درس {continueLesson.episodeNumber}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                {continueLesson.titleFa}
              </h3>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.825rem", opacity: 0.85 }}>
                {continueLesson.titleEn}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ minWidth: "9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.3rem", fontWeight: 700 }}>
                <span>میزان تماشا</span>
                <span>{continueLesson.watchPercentage}٪</span>
              </div>
              <div style={{ width: "100%", height: "0.45rem", background: "rgba(255,255,255,0.25)", borderRadius: "9999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${continueLesson.watchPercentage}%`,
                    background: "#22c55e",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </div>

            <Link
              href={continueLesson.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#ffffff",
                color: "#1e40af",
                padding: "0.75rem 1.4rem",
                borderRadius: "12px",
                fontWeight: 800,
                fontSize: "0.875rem",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                whiteSpace: "nowrap",
              }}
            >
              <span>ادامه پخش ویدیو</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      )}

      {/* Rules Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(16, 185, 129, 0.08))",
          border: "1px solid rgba(37, 99, 235, 0.2)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "2rem" }}>🎯</span>
        <div>
          <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
            راهنمای پیشرفت و قفل‌گشایی ویدیوها
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#475569", lineHeight: 1.6 }}>
            هر سطح با ویدیوی اول شروع می‌شود که برای شما باز است. برای باز شدن ویدیوهای بعدی، تماشای حداقل <strong>۸۰٪</strong> از ویدیو و کسب حداقل <strong>۷۰٪</strong> نمره در آزمون تعاملی ۶ مهارته الزامی است. شما می‌توانید از هر سطحی متناسب با نیاز خود شروع کنید.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "flex-end" }}>
        <div className={styles.searchBox} style={{ maxWidth: "24rem", width: "100%" }}>
          <span>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="جست‌وجوی سطح، کتاب یا مهارت..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Levels Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(21rem, 1fr))", gap: "1.5rem" }}>
        {filteredLevels.map((lvl) => {
          const summary = currentSummaries[lvl.tier] || {
            completedCount: 0,
            totalLessons: lvl.totalVideos,
            percentCompleted: 0,
            averageWatchPercentage: 0,
            averageMasteryScore: 0,
          };

          return (
            <Link
              key={lvl.tier}
              href={`/learn/video/${lvl.tier}`}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 4px 16px -2px rgba(15, 23, 42, 0.05)",
                textDecoration: "none",
                color: "inherit",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "3.25rem",
                      height: "3.25rem",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.75rem",
                      background: lvl.gradient,
                      color: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    {lvl.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      padding: "0.3rem 0.75rem",
                      borderRadius: "9999px",
                      color: lvl.badgeColor,
                      background: `${lvl.badgeColor}15`,
                      border: `1px solid ${lvl.badgeColor}35`,
                    }}
                  >
                    سطح {lvl.cefr} · {lvl.totalVideos} ویدیو
                  </span>
                </div>

                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  {lvl.levelNameFa}
                </h3>
                <div style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", fontWeight: 600, color: "#2563eb" }}>
                  {lvl.bookTitleFa}
                </div>
                <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6 }}>
                  {lvl.descFa}
                </p>

                {/* Progress Mini Box */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #edf2f7",
                    borderRadius: "12px",
                    padding: "0.85rem 1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>
                    <span>پیشرفت دوره</span>
                    <span>{summary.completedCount} از {lvl.totalVideos} ویدیو</span>
                  </div>
                  <div style={{ width: "100%", height: "0.45rem", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.6rem" }}>
                    <div style={{ height: "100%", width: `${summary.percentCompleted}%`, background: lvl.gradient, borderRadius: "9999px", transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                    <span>میانگین تماشا: {summary.averageWatchPercentage}٪</span>
                    <span>میانگین تسلط: {summary.averageMasteryScore > 0 ? `${summary.averageMasteryScore}٪` : "سنجش نشده"}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f1f5f9",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#2563eb",
                }}
              >
                <span>ورود به دوره و مشاهده ویدیوها</span>
                <span>←</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
