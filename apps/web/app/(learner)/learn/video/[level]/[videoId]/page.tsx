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
  getRealLifeLessonById,
  getRealLifeLevelMeta,
  getNextRealLifeLesson,
  RealLifeVideoLesson,
} from "@/lib/real-life-curriculum";
import {
  getAEFLessonProgress,
  isAEFLessonUnlocked,
  saveAEFWatchProgress,
  saveAEFQuizResults,
} from "@/lib/aef-progress";
import {
  getRealLifeLessonProgress,
  isRealLifeLessonUnlocked,
  saveRealLifeWatchProgress,
  saveRealLifeQuizResults,
} from "@/lib/real-life-progress";
import VideoLessonPlayer from "@/components/video-learning/VideoLessonPlayer";
import SixSkillQuiz, { SkillQuizResults } from "@/components/video-learning/SixSkillQuiz";
import VideoCompletionModal from "@/components/video-learning/VideoCompletionModal";
import styles from "@/components/video-learning/video-learning.module.css";

interface PageProps {
  params: Promise<{ level: string; videoId: string }>;
}

export default function VideoStudyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawLevel = resolvedParams.level.toLowerCase();
  const rawVideoId = resolvedParams.videoId.toLowerCase();

  const realLifeLesson = getRealLifeLessonById(rawVideoId);
  const isRealLife = Boolean(realLifeLesson);

  const lesson = (realLifeLesson || getAEFLessonById(rawVideoId)) as AEFVideoLesson | undefined;
  const levelMeta = isRealLife ? getRealLifeLevelMeta(rawLevel) : getAEFLevelMeta(rawLevel);

  if (!lesson || !levelMeta || lesson.level !== rawLevel) {
    notFound();
  }

  // Check unlock status (with free access / force unlock support)
  const [forceUnlocked, setForceUnlocked] = useState(false);
  const baseUnlocked = isRealLife
    ? isRealLifeLessonUnlocked(rawLevel, lesson.episodeNumber)
    : isAEFLessonUnlocked(rawLevel, lesson.episodeNumber);
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
    const prog = isRealLife
      ? getRealLifeLessonProgress(lesson.id)
      : getAEFLessonProgress(lesson.id);
    if (prog) {
      setWatchPercentage(prog.watchPercentage || 0);
      setMaxWatchedSeconds(prog.maxWatchedSeconds || 0);
    }
  }, [lesson.id, isRealLife]);

  // Handle time update and track max watched seconds for anti-skipping
  const handleTimeChange = (sec: number) => {
    setCurrentTime(sec);
    if (sec > maxWatchedSeconds) {
      const newMax = sec;
      setMaxWatchedSeconds(newMax);
      const newPercent = Math.min(100, Math.round((newMax / (lesson.durationSec || 1)) * 100));
      if (newPercent > watchPercentage) {
        setWatchPercentage(newPercent);
        if (isRealLife) {
          saveRealLifeWatchProgress(lesson.id, rawLevel, lesson.episodeNumber, newPercent, newMax);
        } else {
          saveAEFWatchProgress(lesson.id, rawLevel, lesson.episodeNumber, newPercent, newMax);
        }
      }
    }
  };

  const handleReplayTimestamp = (seconds: number) => {
    setSeekTarget(seconds);
  };

  const handleQuizComplete = (results: SkillQuizResults) => {
    setQuizResults(results);
    if (isRealLife) {
      saveRealLifeQuizResults(lesson.id, rawLevel, lesson.episodeNumber, results.scores, results.totalScore);
    } else {
      saveAEFQuizResults(lesson.id, rawLevel, lesson.episodeNumber, results.scores, results.totalScore);
    }
    setModalOpen(true);
  };

  const handleRetry = () => {
    setModalOpen(false);
    setCurrentTime(0);
    setSeekTarget(0);
  };

  const nextLesson = isRealLife ? getNextRealLifeLesson(lesson.id) : getNextAEFLesson(lesson.id);
  const trackFolder = isRealLife ? "speakout" : "aef";
  const nextLessonHref = nextLesson ? `/learn/video/${rawLevel}/${trackFolder}/${nextLesson.id}` : undefined;

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
            این درس ویدیویی در حال حاضر قفل است
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
                padding: "0.85rem 1.75rem",
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
                fontWeight: 800,
                padding: "0.85rem 1.75rem",
                borderRadius: "12px",
                textDecoration: "none",
              }}
            >
              <span>بازگشت به فهرست ویدیوهای سطح {levelMeta.cefr}</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.studyContainer} dir="rtl">
      {/* Top Bar with Navigation & Title */}
      <div className={styles.studyTopBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href={`/learn/video/${rawLevel}`} className={styles.studyBackBtn}>
            <span>→</span>
            <span>فهرست ویدیوهای سطح {levelMeta.cefr}</span>
          </Link>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: levelMeta.badgeColor,
                  background: `${levelMeta.badgeColor}15`,
                  border: `1px solid ${levelMeta.badgeColor}35`,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                {levelMeta.bookTitleFa} · ویدیو {lesson.episodeNumber} از ۲۰
              </span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lesson.unit}</span>
            </div>
            <h1 className={styles.studyTitle}>
              {lesson.titleFa} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({lesson.titleEn})</span>
            </h1>
          </div>
        </div>

        {/* Live Watch Progress Pill */}
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
        lesson={lesson}
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

      {/* 6-Skill Interactive Quiz */}
      <SixSkillQuiz
        lesson={lesson as any}
        onReplayTimestamp={handleReplayTimestamp}
        onComplete={handleQuizComplete}
      />

      {/* Completion Modal */}
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
