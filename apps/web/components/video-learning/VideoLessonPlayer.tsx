"use client";

import React, { useState, useEffect, useRef } from "react";
import { VideoLesson, TranscriptLine } from "@/lib/video-learning";
import styles from "./video-learning.module.css";

interface VideoLessonPlayerProps {
  lesson: VideoLesson;
  currentTime: number;
  onTimeChange: (time: number) => void;
  seekTarget?: number | null;
  onSeekHandled?: () => void;
}

export default function VideoLessonPlayer({
  lesson,
  currentTime,
  onTimeChange,
  seekTarget,
  onSeekHandled,
}: VideoLessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [subtitleMode, setSubtitleMode] = useState<"dual" | "en" | "fa" | "off">("dual");
  const [showTranscript, setShowTranscript] = useState(true);

  // Playback timer ticker simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onTimeChange(currentTime + 1);
        if (currentTime + 1 >= lesson.durationSec) {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, playbackSpeed, lesson.durationSec, onTimeChange]);

  // Handle external seek requests (e.g. from quiz replay button)
  useEffect(() => {
    if (typeof seekTarget === "number") {
      onTimeChange(seekTarget);
      setIsPlaying(true);
      if (onSeekHandled) onSeekHandled();
    }
  }, [seekTarget, onTimeChange, onSeekHandled]);

  // Find active transcript line
  const activeTranscriptIndex = lesson.transcript.findIndex((line, idx) => {
    const nextLine = lesson.transcript[idx + 1];
    if (nextLine) {
      return currentTime >= line.seconds && currentTime < nextLine.seconds;
    }
    return currentTime >= line.seconds;
  });

  const activeLine: TranscriptLine | undefined =
    activeTranscriptIndex !== -1 ? lesson.transcript[activeTranscriptIndex] : lesson.transcript[0];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newSeconds = Math.floor(ratio * lesson.durationSec);
    onTimeChange(newSeconds);
  };

  const jumpToLine = (seconds: number) => {
    onTimeChange(seconds);
    setIsPlaying(true);
  };

  const progressPercent = Math.min(100, (currentTime / (lesson.durationSec || 1)) * 100);

  return (
    <div className={styles.playerCard}>
      {/* Screen Frame */}
      <div className={styles.playerScreenWrapper}>
        {/* Background Visual Stage */}
        <div
          className={styles.playerVisualStage}
          style={{
            background: lesson.posterGradient,
          }}
        >
          <div className={styles.playerStageGlow} />

          <div className={styles.playerStageContent}>
            <div className={styles.stageSeriesBadge}>
              {lesson.seriesTitleFa} · {lesson.unit}
            </div>

            {/* If video stopped or at start */}
            {!isPlaying && currentTime === 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{lesson.posterIcon}</div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
                  {lesson.titleFa}
                </h3>
              </div>
            )}

            {/* Active Subtitles Display */}
            {subtitleMode !== "off" && activeLine && (
              <div>
                <span className={styles.stageSpeaker}>{activeLine.speaker}</span>
                {(subtitleMode === "dual" || subtitleMode === "en") && (
                  <p className={styles.stageActiveSubtitleEn}>{activeLine.textEn}</p>
                )}
                {(subtitleMode === "dual" || subtitleMode === "fa") && (
                  <p className={styles.stageActiveSubtitleFa}>{activeLine.textFa}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className={styles.playerControls}>
          {/* Scrubber */}
          <div className={styles.scrubberTrack} onClick={handleScrubberClick}>
            <div className={styles.scrubberFilled} style={{ width: `${progressPercent}%` }} />
          </div>

          <div className={styles.controlButtonsRow}>
            {/* Left Controls (Standard player layout) */}
            <div className={styles.ctrlLeft}>
              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "توقف (Pause)" : "پخش (Play)"}
                aria-label={isPlaying ? "توقف" : "پخش"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={() => onTimeChange(Math.max(0, currentTime - 5))}
                title="۵ ثانیه عقب"
                aria-label="۵ ثانیه عقب"
              >
                ↺5s
              </button>

              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={() => onTimeChange(Math.min(lesson.durationSec, currentTime + 5))}
                title="۵ ثانیه جلو"
                aria-label="۵ ثانیه جلو"
              >
                5s↻
              </button>

              <span className={styles.timeDisplay}>
                {formatSeconds(currentTime)} / {lesson.duration}
              </span>
            </div>

            {/* Right Controls */}
            <div className={styles.ctrlRight}>
              {/* Playback speed selector */}
              <select
                className={styles.ctrlSelect}
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                title="سرعت پخش"
                aria-label="سرعت پخش"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>

              {/* Subtitles mode selector */}
              <select
                className={styles.ctrlSelect}
                value={subtitleMode}
                onChange={(e) => setSubtitleMode(e.target.value as any)}
                title="زیرنویس"
                aria-label="زیرنویس"
              >
                <option value="dual">دوزبانه (انگلیسی/فارسی)</option>
                <option value="en">انگلیسی</option>
                <option value="fa">فارسی</option>
                <option value="off">خاموش</option>
              </select>

              {/* Toggle Transcript drawer */}
              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={() => setShowTranscript(!showTranscript)}
                title={showTranscript ? "پنهان کردن متن ویدیو" : "نمایش متن کامل ویدیو"}
                aria-label="متن ویدیو"
              >
                📜
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Transcript Drawer */}
      {showTranscript && (
        <div className={styles.transcriptDrawer}>
          <div className={styles.transcriptDrawerTitle}>
            <span>متن کامل و دیالوگ‌های ویدیو (Interactive Transcript)</span>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 400 }}>
              با کلیک روی هر خط، ویدیو به همان زمان منتقل می‌شود
            </span>
          </div>

          <div className={styles.transcriptList}>
            {lesson.transcript.map((line, idx) => {
              const isActive = idx === activeTranscriptIndex;
              return (
                <div
                  key={line.id}
                  className={`${styles.transcriptLineItem} ${
                    isActive ? styles.transcriptLineItemActive : ""
                  }`}
                  onClick={() => jumpToLine(line.seconds)}
                >
                  <span className={styles.lineTimestamp}>{line.timeDisplay}</span>
                  <div style={{ flex: 1 }}>
                    <div className={styles.lineSpeaker}>{line.speaker}</div>
                    <div className={styles.lineTextEn}>{line.textEn}</div>
                    <div className={styles.lineTextFa}>{line.textFa}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
