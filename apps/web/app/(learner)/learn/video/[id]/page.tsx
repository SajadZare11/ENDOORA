"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonById, VIDEO_LESSONS } from "@/lib/video-learning";
import VideoLessonPlayer from "@/components/video-learning/VideoLessonPlayer";
import SixSkillQuiz, { SkillQuizResults } from "@/components/video-learning/SixSkillQuiz";
import VideoCompletionModal from "@/components/video-learning/VideoCompletionModal";
import styles from "@/components/video-learning/video-learning.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideoStudyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;
  const lesson = getLessonById(lessonId);

  const [currentTime, setCurrentTime] = useState(0);
  const [seekTarget, setSeekTarget] = useState<number | null>(null);

  // Completion modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<SkillQuizResults | null>(null);

  if (!lesson) {
    return (
      <div className={styles.studyContainer}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
          <h2>ویدیوی مورد نظر پیدا نشد</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
            این درس ویدیویی در سامانه یافت نشد یا ممکن است آدرس تغییر کرده باشد.
          </p>
          <Link href="/learn/video" className={styles.navBtnPrimary}>
            بازگشت به فهرست ویدیوها
          </Link>
        </div>
      </div>
    );
  }

  // Find next lesson
  const currentIdx = VIDEO_LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson =
    currentIdx !== -1 && currentIdx < VIDEO_LESSONS.length - 1
      ? VIDEO_LESSONS[currentIdx + 1]
      : null;

  const handleReplayTimestamp = (seconds: number) => {
    setSeekTarget(seconds);
  };

  const handleQuizComplete = (results: SkillQuizResults) => {
    setQuizResults(results);
    setModalOpen(true);
  };

  const handleRetry = () => {
    setModalOpen(false);
    setCurrentTime(0);
    setSeekTarget(0);
  };

  return (
    <div className={styles.studyContainer}>
      {/* Top Bar with Navigation & Title */}
      <div className={styles.studyTopBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/learn/video" className={styles.studyBackBtn}>
            <span>→</span>
            <span>بازگشت به فهرست ویدیوها</span>
          </Link>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: lesson.series === "family_and_friends" ? "#ea580c" : "#2563eb",
                  background:
                    lesson.series === "family_and_friends"
                      ? "rgba(234, 88, 12, 0.1)"
                      : "rgba(37, 99, 235, 0.1)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                {lesson.seriesTitleFa}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                {lesson.bookLevel} · {lesson.unit}
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0.25rem 0 0",
              }}
            >
              {lesson.titleFa}
            </h1>
          </div>
        </div>

        {/* 6-Skill Badge Indicator */}
        <div className={styles.studyProgressSummary}>
          <span>سنجش هم‌زمان ۶ مهارت:</span>
          <span style={{ fontSize: "1rem" }}>🎧 💡 📐 🎙️ 📖 ✍️</span>
        </div>
      </div>

      {/* Main Interactive 2-Column Stage */}
      <div className={styles.studyLayout}>
        {/* Left Column: Player & Subtitles/Transcript */}
        <div>
          <VideoLessonPlayer
            lesson={lesson}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            seekTarget={seekTarget}
            onSeekHandled={() => setSeekTarget(null)}
          />
        </div>

        {/* Right Column: 6-Skill Quiz Component */}
        <div>
          <SixSkillQuiz
            lesson={lesson}
            onReplayTimestamp={handleReplayTimestamp}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>

      {/* Completion Modal */}
      <VideoCompletionModal
        isOpen={modalOpen}
        results={quizResults}
        lesson={lesson}
        onRetry={handleRetry}
        nextLessonId={nextLesson?.id}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
