"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAEFLevelMeta,
  getAEFLessonsByLevel,
  AEFVideoLesson,
} from "@/lib/aef-curriculum";
import {
  getRealLifeLevelMeta,
  getRealLifeLessonsByLevel,
  RealLifeVideoLesson,
} from "@/lib/real-life-curriculum";
import {
  getAEFAllProgress,
  getAEFLevelSummary,
  isAEFLessonUnlocked,
  AEFLessonProgress,
  AEFLevelSummary,
} from "@/lib/aef-progress";
import {
  getRealLifeAllProgress,
  getRealLifeLevelSummary,
  isRealLifeLessonUnlocked,
  RealLifeLessonProgress,
  RealLifeLevelSummary,
} from "@/lib/real-life-progress";
import styles from "@/components/video-learning/video-learning.module.css";

interface PageProps {
  params: Promise<{ level: string }>;
}

export default function LevelVideoCatalogPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawLevel = resolvedParams.level.toLowerCase();

  const realLifeMeta = getRealLifeLevelMeta(rawLevel);
  const aefMeta = getAEFLevelMeta(rawLevel);

  if (!realLifeMeta && !aefMeta) {
    notFound();
  }

  const levelMeta = realLifeMeta || aefMeta!;

  // Track selection state: "speakout" vs "aef"
  const [selectedTrack, setSelectedTrack] = useState<"speakout" | "aef">("speakout");

  // Speakout data
  const [speakoutProgress, setSpeakoutProgress] = useState<Record<string, RealLifeLessonProgress>>({});
  const [speakoutSummary, setSpeakoutSummary] = useState<RealLifeLevelSummary | null>(null);

  // AEF data
  const [aefProgress, setAefProgress] = useState<Record<string, AEFLessonProgress>>({});
  const [aefSummary, setAefSummary] = useState<AEFLevelSummary | null>(null);

  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [freeAccessMode, setFreeAccessMode] = useState<boolean>(true);

  const speakoutLessons: RealLifeVideoLesson[] = getRealLifeLessonsByLevel(rawLevel);
  const aefLessons: AEFVideoLesson[] = getAEFLessonsByLevel(rawLevel);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("endoora_free_video_access");
      if (saved !== null) {
        setFreeAccessMode(saved === "true");
      }
    } catch (e) {}
  }, []);

  const handleToggleFreeAccess = () => {
    const nextVal = !freeAccessMode;
    setFreeAccessMode(nextVal);
    try {
      localStorage.setItem("endoora_free_video_access", String(nextVal));
    } catch (e) {}
  };

  useEffect(() => {
    const loadData = () => {
      setSpeakoutProgress(getRealLifeAllProgress());
      setSpeakoutSummary(getRealLifeLevelSummary(rawLevel));
      setAefProgress(getAEFAllProgress());
      setSummarySafe();
    };

    const setSummarySafe = () => {
      try {
        setAefSummary(getAEFLevelSummary(rawLevel));
      } catch (e) {
        // Fallback
      }
    };

    loadData();
    window.addEventListener("real-life-progress-updated", loadData);
    window.addEventListener("aef-progress-updated", loadData);
    return () => {
      window.removeEventListener("real-life-progress-updated", loadData);
      window.removeEventListener("aef-progress-updated", loadData);
    };
  }, [rawLevel]);

  const activeLessons = selectedTrack === "speakout" ? speakoutLessons : aefLessons;
  const activeProgress = selectedTrack === "speakout" ? speakoutProgress : aefProgress;
  const activeSummary = selectedTrack === "speakout" ? speakoutSummary : aefSummary;

  const totalLessonsCount = activeLessons.length || (selectedTrack === "speakout" ? 16 : 18);
  const completedCount = activeSummary?.completedCount ?? 0;
  const percentCompleted = activeSummary?.percentCompleted ?? 0;
  const avgWatch = activeSummary?.averageWatchPercentage ?? 0;
  const avgMastery = activeSummary?.averageMasteryScore ?? 0;

  return (
    <div className={styles.container} dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className={styles.headerSection}>
        <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
          <Link href="/dashboard">داشبورد</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/learn?tab=video">یادگیری</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/learn/video">دوره‌های ویدیویی</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{levelMeta.levelNameFa}</span>
        </nav>

        {/* Level Header Banner */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
            marginTop: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              height: "4px",
              background: levelMeta.gradient,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  width: "4.5rem",
                  height: "4.5rem",
                  borderRadius: "18px",
                  background: levelMeta.gradient,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.25rem",
                  boxShadow: "0 8px 16px -2px rgba(0,0,0,0.15)",
                }}
              >
                {levelMeta.icon}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: levelMeta.badgeColor,
                      background: `${levelMeta.badgeColor}15`,
                      border: `1px solid ${levelMeta.badgeColor}35`,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                    }}
                  >
                    سطح {levelMeta.cefr}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb" }}>
                    سیستم دوگانه ویدیویی اندورا
                  </span>
                </div>

                <h1 style={{ margin: "0 0 0.35rem", fontSize: "1.75rem", fontWeight: 850, color: "#0f172a" }}>
                  {levelMeta.levelNameFa}
                </h1>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", maxWidth: "42rem", lineHeight: 1.6 }}>
                  {levelMeta.descFa}
                </p>
              </div>
            </div>

            {/* Level Stats Summary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                background: "#f8fafc",
                border: "1px solid #edf2f7",
                borderRadius: "14px",
                padding: "0.85rem 1.25rem",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 850, color: "#0f172a" }}>
                  {completedCount} / {totalLessonsCount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>درس‌های تکمیل شده</div>
              </div>

              <div style={{ width: "1px", height: "2.5rem", background: "#e2e8f0" }} />

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 850, color: "#059669" }}>
                  {avgMastery > 0 ? `${avgMastery}٪` : "—"}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>میانگین تسلط</div>
              </div>

              <div style={{ width: "1px", height: "2.5rem", background: "#e2e8f0" }} />

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 850, color: "#2563eb" }}>
                  {percentCompleted}٪
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>پیشرفت کل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Dual-Track Switcher Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "2rem 0 1.25rem",
          flexWrap: "wrap",
        }}
      >
        {/* Track 1 Button: Speakout */}
        <button
          type="button"
          onClick={() => {
            setSelectedTrack("speakout");
            setLockedNotice(null);
          }}
          style={{
            flex: "1 1 18rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1.25rem",
            borderRadius: "16px",
            border: selectedTrack === "speakout" ? "2px solid #2563eb" : "1px solid #e2e8f0",
            background: selectedTrack === "speakout" ? "#eff6ff" : "#ffffff",
            cursor: "pointer",
            textAlign: "right",
            boxShadow: selectedTrack === "speakout" ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "0 2px 6px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0284c7, #2563eb)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
          >
            ✨
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 850, color: selectedTrack === "speakout" ? "#1e40af" : "#0f172a" }}>
              مسیر ۱: انگلیسی در دنیای واقعی (Speakout & BBC)
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
              {speakoutLessons.length} ویدیوی مدرن · مصاحبه‌های خیابانی و ولاگ‌های واقعی
            </div>
          </div>
        </button>

        {/* Track 2 Button: AEF */}
        <button
          type="button"
          onClick={() => {
            setSelectedTrack("aef");
            setLockedNotice(null);
          }}
          style={{
            flex: "1 1 18rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 1.25rem",
            borderRadius: "16px",
            border: selectedTrack === "aef" ? "2px solid #059669" : "1px solid #e2e8f0",
            background: selectedTrack === "aef" ? "#ecfdf5" : "#ffffff",
            cursor: "pointer",
            textAlign: "right",
            boxShadow: selectedTrack === "aef" ? "0 4px 12px rgba(5, 150, 105, 0.12)" : "0 2px 6px rgba(0,0,0,0.02)",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #059669, #10b981)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
          >
            🗽
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 850, color: selectedTrack === "aef" ? "#065f46" : "#0f172a" }}>
              مسیر ۲: داستان‌های کاربردی منهتن (American English File)
            </div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
              {aefLessons.length} ویدیوی داستانی · ماجراهای راب و جنی در نیویورک
            </div>
          </div>
        </button>
      </div>

      {/* Rules Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(16, 185, 129, 0.06))",
          border: "1px solid rgba(37, 99, 235, 0.18)",
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.35rem" }}>💡</span>
          <span style={{ fontSize: "0.875rem", color: "#334155", fontWeight: 600 }}>
            در دوره <strong>{selectedTrack === "speakout" ? "دنیای واقعی (Speakout)" : "داستان‌های منهتن (AEF)"}</strong>، ویدیوی شماره ۱ باز است. برای باز شدن هر ویدیوی بعدی، تماشای حداقل <strong>۸۰٪</strong> و کسب حداقل <strong>۷۰٪</strong> نمره در آزمون ۶ مهارته الزامی است.
          </span>
        </div>

        <Link
          href="/learn?tab=video"
          style={{
            fontSize: "0.825rem",
            fontWeight: 700,
            color: "#2563eb",
            textDecoration: "none",
          }}
        >
          ← تغییر سطح
        </Link>
      </div>

      {/* Locked Notice Alert */}
      {lockedNotice && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🔒</span>
            <span>{lockedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setLockedNotice(null)}
            style={{
              background: "none",
              border: "none",
              color: "#991b1b",
              fontWeight: 800,
              cursor: "pointer",
              padding: "0.2rem 0.5rem",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Free Access & Level Info Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          margin: "1rem 0 1.25rem",
          padding: "0.75rem 1rem",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
        }}
      >
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b" }}>
          🎥 فهرست دروس ویدیویی ({activeLessons.length} درس آماده پخش)
        </div>
        <button
          type="button"
          onClick={handleToggleFreeAccess}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 0.95rem",
            borderRadius: "10px",
            border: freeAccessMode ? "1.5px solid #10b981" : "1px solid #cbd5e1",
            background: freeAccessMode ? "#ecfdf5" : "#f8fafc",
            color: freeAccessMode ? "#047857" : "#475569",
            fontSize: "0.825rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: freeAccessMode ? "0 2px 8px rgba(16, 185, 129, 0.15)" : "none",
            transition: "all 0.2s ease",
          }}
          title="تغییر حالت دسترسی به ویدیوها"
        >
          <span>{freeAccessMode ? "🔓 تمام ویدیوها باز هستند (حالت دسترسی آزاد)" : "🔒 قفل‌گشایی مرحله‌ای (فعال)"}</span>
        </button>
      </div>

      {/* Lessons Grid for Selected Track */}
      <div className={styles.videoGrid}>
        {activeLessons.map((lesson) => {
          const isUnlocked = freeAccessMode || (selectedTrack === "speakout"
            ? isRealLifeLessonUnlocked(rawLevel, lesson.episodeNumber, activeProgress as any)
            : isAEFLessonUnlocked(rawLevel, lesson.episodeNumber, activeProgress as any));

          const prog = activeProgress[lesson.id.toLowerCase()];
          const isCompleted = prog?.isCompleted ?? false;
          const watchPercent = prog?.watchPercentage ?? 0;
          const totalScore = prog?.totalScore ?? null;

          const targetUrl = `/learn/video/${rawLevel}/${selectedTrack}/${lesson.id}`;

          const handleLockedClick = (e: React.MouseEvent) => {
            if (!isUnlocked) {
              e.preventDefault();
              setLockedNotice(
                `ویدیوی شماره ${lesson.episodeNumber} از مسیر ${selectedTrack === "speakout" ? "دنیای واقعی" : "AEF"} قفل است! ابتدا ویدیوی شماره ${lesson.episodeNumber - 1} را حداقل ۸۰٪ تماشا کرده و در آزمون آن نمره بالای ۷۰٪ کسب کنید.`
              );
              window.scrollTo({ top: 220, behavior: "smooth" });
            }
          };

          return (
            <div
              key={lesson.id}
              style={{
                position: "relative",
                opacity: isUnlocked ? 1 : 0.72,
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
            >
              <Link
                href={isUnlocked ? targetUrl : "#"}
                onClick={handleLockedClick}
                className={styles.videoCard}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#ffffff",
                  border: isCompleted ? "1.5px solid #10b981" : "1px solid #e2e8f0",
                  borderRadius: "16px",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 4px 14px -2px rgba(15, 23, 42, 0.05)",
                  height: "100%",
                }}
              >
                {/* Poster / Thumbnail Area */}
                <div
                  style={{
                    height: "8.5rem",
                    background: lesson.posterGradient,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ fontSize: "3rem", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>
                    {lesson.posterIcon}
                  </div>

                  {/* Top Left Badge: Episode & Unit */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      background: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(4px)",
                      color: "#ffffff",
                      fontSize: "0.725rem",
                      fontWeight: 750,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                    }}
                  >
                    درس {lesson.episodeNumber} · {lesson.unit}
                  </div>

                  {/* Bottom Right Duration */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>⏱️</span>
                    <span>{lesson.duration}</span>
                  </div>

                  {/* Lock Overlay if locked */}
                  {!isUnlocked && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                        color: "#ffffff",
                      }}
                    >
                      <span style={{ fontSize: "1.75rem" }}>🔒</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>نیازمند تکمیل درس قبلی</span>
                    </div>
                  )}

                  {/* Completed Check Badge */}
                  {isCompleted && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        background: "#10b981",
                        color: "#ffffff",
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: "1.1rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 0.35rem",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      lineHeight: 1.45,
                    }}
                  >
                    {lesson.titleFa}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      margin: "0 0 0.75rem",
                      fontWeight: 500,
                      lineHeight: 1.35,
                    }}
                  >
                    {lesson.titleEn}
                  </div>

                  {/* Topics Pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.85rem" }}>
                    {lesson.keyTopicsFa.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: "#f1f5f9",
                          color: "#475569",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Progress & Scores Indicator */}
                  <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "#475569",
                        fontWeight: 600,
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span>تماشا: {watchPercent}٪</span>
                      <span>
                        آزمون:{" "}
                        {totalScore !== null ? (
                          <strong style={{ color: totalScore >= 70 ? "#059669" : "#dc2626" }}>
                            {totalScore}٪
                          </strong>
                        ) : (
                          "انجام نشده"
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "0.35rem",
                        background: "#e2e8f0",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${watchPercent}%`,
                          height: "100%",
                          background: isCompleted
                            ? "#10b981"
                            : selectedTrack === "speakout"
                            ? "#2563eb"
                            : "#059669",
                          borderRadius: "9999px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
