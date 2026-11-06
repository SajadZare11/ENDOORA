"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAEFLessonById,
  getAEFLevelMeta,
  getNextAEFLesson,
  AEFVideoLesson,
} from "@/lib/aef-curriculum";
import {
  getAEFLessonProgress,
  isAEFLessonUnlocked,
  saveAEFWatchProgress,
  saveAEFQuizResults,
} from "@/lib/aef-progress";
import VideoLessonPlayer from "@/components/video-learning/VideoLessonPlayer";
import SixSkillQuiz, { SkillQuizResults } from "@/components/video-learning/SixSkillQuiz";
import VideoCompletionModal from "@/components/video-learning/VideoCompletionModal";
import styles from "@/components/video-learning/video-learning.module.css";

interface PageProps {
  params: Promise<{ level: string; videoId: string }>;
}

export default function AEFStudyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawLevel = resolvedParams.level.toLowerCase();
  const rawVideoId = resolvedParams.videoId.toLowerCase();

  const lesson = getAEFLessonById(rawVideoId);
  const levelMeta = getAEFLevelMeta(rawLevel);

  if (!lesson || !levelMeta || lesson.level.toLowerCase() !== rawLevel) {
    notFound();
  }

  // Check unlock status (with free access / force unlock support)
  const [forceUnlocked, setForceUnlocked] = useState(false);
  const baseUnlocked = isAEFLessonUnlocked(rawLevel, lesson.episodeNumber);
  const isUnlocked = baseUnlocked || forceUnlocked;

  useEffect(() => {
    try {
      const free = localStorage.getItem("endoora_free_video_access");
      if (free === "true" || free === null) {
        setForceUnlocked(true);
      }
    } catch (e) {}
  }, []);

  // States
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTarget, setSeekTarget] = useState<number | null>(null);
  const [maxWatchedSeconds, setMaxWatchedSeconds] = useState(0);
  const [watchPercentage, setWatchPercentage] = useState(0);

  // Completion modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<SkillQuizResults | null>(null);

  // Load existing progress
  useEffect(() => {
    const prog = getAEFLessonProgress(lesson.id);
    if (prog) {
      setWatchPercentage(prog.watchPercentage || 0);
      setMaxWatchedSeconds(prog.maxWatchedSeconds || 0);
    }
  }, [lesson.id]);

  // Handle time update and track max watched seconds for anti-skipping
  const handleTimeChange = (sec: number) => {
    setCurrentTime(sec);
    if (sec > maxWatchedSeconds) {
      const newMax = sec;
      setMaxWatchedSeconds(newMax);
      const newPercent = Math.min(100, Math.round((newMax / (lesson.durationSec || 1)) * 100));
      if (newPercent > watchPercentage) {
        setWatchPercentage(newPercent);
        saveAEFWatchProgress(lesson.id, rawLevel, lesson.episodeNumber, newPercent, newMax);
      }
    }
  };

  const handleReplayTimestamp = (seconds: number) => {
    setSeekTarget(seconds);
  };

  const handleQuizComplete = (results: SkillQuizResults) => {
    setQuizResults(results);
    saveAEFQuizResults(lesson.id, rawLevel, lesson.episodeNumber, results.scores, results.totalScore);
    setModalOpen(true);
  };

  const handleRetry = () => {
    setModalOpen(false);
    setCurrentTime(0);
    setSeekTarget(0);
  };

  const nextLesson = getNextAEFLesson(lesson.id);
  const nextLessonHref = nextLesson ? `/learn/video/${rawLevel}/aef/${nextLesson.id}` : undefined;

  // If locked, show gate screen
  if (!isUnlocked) {
    return (
      <div className={styles.studyContainer} dir="rtl">
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            padding: "3.5rem 1.5rem",
            textAlign: "center",
            boxShadow: "0 8px 24px -4px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 850, color: "#0f172a", marginBottom: "0.5rem" }}>
            این درس داستانی AEF در حال حاضر قفل است
          </h2>
          <p style={{ color: "#64748b", maxWidth: "32rem", margin: "0 auto 1.75rem", lineHeight: 1.6 }}>
            برای دسترسی به این ویدیو، ابتدا باید ویدیوی قبلی (شماره {lesson.episodeNumber - 1}) را حداقل ۸۰٪ تماشا کرده و در آزمون ۶ مهارته آن نمره ۷۰٪ یا بیشتر کسب کنید.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setForceUnlocked(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#059669",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              ▶️ باز کردن و تماشای این درس
            </button>
            <Link
              href={`/learn/video/${rawLevel}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#2563eb",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ← بازگشت به فهرست ویدیوهای سطح {levelMeta.cefr}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studyContainer} dir="rtl">
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="مسیر صفحه">
        <Link href="/dashboard">داشبورد</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/learn?tab=video">یادگیری</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/learn/video">دوره‌های ویدیویی</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href={`/learn/video/${rawLevel}`}>سطح {levelMeta.cefr} (داستان‌های منهتن)</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>درس {lesson.episodeNumber}</span>
      </nav>

      {/* Lesson Header Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          margin: "1rem 0 1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#065f46",
                background: "#d1fae5",
                border: "1px solid #a7f3d0",
                padding: "0.15rem 0.6rem",
                borderRadius: "6px",
              }}
            >
              داستان‌های منهتن (AEF) · {lesson.unit}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              سطح {levelMeta.cefr} · درس {lesson.episodeNumber}
            </span>
          </div>

          <h1 style={{ margin: "0 0 0.35rem", fontSize: "1.45rem", fontWeight: 850, color: "#0f172a" }}>
            {lesson.titleFa}
          </h1>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
            {lesson.titleEn}
          </p>
        </div>

        {/* Watch Percentage Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: watchPercentage >= 80 ? "#f0fdf4" : "#eff6ff",
            border: `1px solid ${watchPercentage >= 80 ? "#bbf7d0" : "#bfdbfe"}`,
            padding: "0.45rem 1rem",
            borderRadius: "9999px",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{watchPercentage >= 80 ? "✅" : "⏱"}</span>
          <span
            style={{
              fontSize: "0.825rem",
              fontWeight: 800,
              color: watchPercentage >= 80 ? "#15803d" : "#1d4ed8",
            }}
          >
            تماشا شده: {watchPercentage}٪
          </span>
        </div>
      </div>

      {/* Main Video Player with Anti-skipping & Subtitles */}
      <VideoLessonPlayer
        lesson={lesson as any}
        currentTime={currentTime}
        onTimeChange={handleTimeChange}
        seekTarget={seekTarget}
        onSeekHandled={() => setSeekTarget(null)}
        maxWatchedSeconds={maxWatchedSeconds}
        onMaxWatchedSecondsChange={setMaxWatchedSeconds}
        watchPercentage={watchPercentage}
        allowForwardScrubbing={watchPercentage >= 80}
      />

      {/* Watch Status & Quiz Qualification Banner */}
      <div
        style={{
          marginTop: "1.5rem",
          marginBottom: "1rem",
          padding: "1rem 1.25rem",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: watchPercentage >= 80 ? "#f0fdf4" : "#fefce8",
          border: `1px solid ${watchPercentage >= 80 ? "#86efac" : "#fef08a"}`,
          color: watchPercentage >= 80 ? "#166534" : "#854d0e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.5rem" }}>{watchPercentage >= 80 ? "🎉" : "⏳"}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
              {watchPercentage >= 80
                ? "شرط تماشای ویدیو محقق شد (۸۰٪ تماشا تکمیل است)!"
                : `در حال حاضر ${watchPercentage}٪ از ویدیو را دیده‌اید.`}
            </div>
            <div style={{ fontSize: "0.825rem", opacity: 0.9, marginTop: "0.2rem" }}>
              {watchPercentage >= 80
                ? "اکنون با پاسخ به سوالات ۶ مهارت زیر و کسب نمره حداقل ۷۰٪، ویدیوی بعدی به صورت خودکار باز خواهد شد."
                : "برای باز شدن ویدیوی بعدی، ویدیو را تا حداقل ۸۰٪ تماشا فرمایید (جلو زدن اسکرابر قفل است)."}
            </div>
          </div>
        </div>

        {/* Mini progress bar */}
        <div style={{ minWidth: "12rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            <span>حداقل لازم: ۸۰٪</span>
            <span>{watchPercentage}٪</span>
          </div>
          <div style={{ width: "100%", height: "0.45rem", background: "rgba(0,0,0,0.08)", borderRadius: "9999px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (watchPercentage / 80) * 100)}%`,
                background: watchPercentage >= 80 ? "#16a34a" : "#eab308",
                borderRadius: "9999px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Six-Skill Interactive Assessment */}
      <SixSkillQuiz
        lesson={lesson as any}
        onReplayTimestamp={handleReplayTimestamp}
        onComplete={handleQuizComplete}
      />

      {/* Completion & Mastery Score Modal */}
      <VideoCompletionModal
        isOpen={modalOpen}
        results={quizResults}
        lesson={{
          id: lesson.id,
          titleFa: lesson.titleFa,
          level: rawLevel,
        }}
        onRetry={handleRetry}
        nextLessonHref={nextLessonHref}
        onClose={() => setModalOpen(false)}
        watchPercentage={watchPercentage}
      />
    </div>
  );
}
