"use client";

import React, { useState, useEffect, useRef } from "react";
import { TranscriptLine } from "@/lib/video-learning";
import styles from "./video-learning.module.css";

export interface VideoLessonLike {
  id: string;
  titleFa: string;
  titleEn: string;
  bookLevel: string;
  unit: string;
  cefr: string;
  duration: string;
  durationSec: number;
  videoUrl?: string;
  embedType?: "direct" | "aparat" | "youtube";
  posterGradient: string;
  posterIcon: string;
  summaryFa: string;
  summaryEn: string;
  transcript: TranscriptLine[];
  seriesTitleFa?: string;
}

interface VideoLessonPlayerProps {
  lesson: VideoLessonLike;
  currentTime: number;
  onTimeChange: (time: number) => void;
  seekTarget?: number | null;
  onSeekHandled?: () => void;
  maxWatchedSeconds?: number;
  onMaxWatchedSecondsChange?: (sec: number) => void;
  watchPercentage?: number;
  allowForwardScrubbing?: boolean;
}

export default function VideoLessonPlayer({
  lesson,
  currentTime,
  onTimeChange,
  seekTarget,
  onSeekHandled,
  maxWatchedSeconds = 0,
  onMaxWatchedSecondsChange,
  watchPercentage = 0,
  allowForwardScrubbing = false,
}: VideoLessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [skipWarning, setSkipWarning] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  const togglePlayPause = () => {
    if (videoElementRef.current) {
      if (videoElementRef.current.paused) {
        videoElementRef.current.play().catch((err) => {
          console.warn("Video play interrupted:", err);
        });
      } else {
        videoElementRef.current.pause();
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Synchronize internal time and max watched time
  useEffect(() => {
    if (currentTime > maxWatchedSeconds) {
      onMaxWatchedSecondsChange?.(currentTime);
    }
  }, [currentTime, maxWatchedSeconds, onMaxWatchedSecondsChange]);

  // Simulated video playback ticker if no native video tag is playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const hasNativeVideo = Boolean(lesson.videoUrl && !lesson.videoUrl.includes("aparat") && !lesson.videoUrl.includes("youtube"));

    if (isPlaying && !hasNativeVideo) {
      interval = setInterval(() => {
        const nextTime = currentTime + 1;
        onTimeChange(nextTime);
        if (nextTime >= lesson.durationSec) {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, playbackSpeed, lesson.durationSec, lesson.videoUrl, onTimeChange]);

  // Handle external seek requests (e.g. from quiz replay button)
  useEffect(() => {
    if (typeof seekTarget === "number") {
      onTimeChange(seekTarget);
      if (videoElementRef.current) {
        videoElementRef.current.currentTime = seekTarget;
      }
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

  // Auto-scroll transcript container to active line during playback
  useEffect(() => {
    if (activeLineRef.current && isPlaying) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeTranscriptIndex, isPlaying]);

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

    // Anti-skipping check: cannot seek beyond maxWatchedSeconds + 3 before 80% watch
    if (!allowForwardScrubbing && watchPercentage < 80 && newSeconds > maxWatchedSeconds + 3) {
      setSkipWarning(true);
      setTimeout(() => setSkipWarning(false), 3500);
      return;
    }

    onTimeChange(newSeconds);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newSeconds;
    }
  };

  const handleStepForward = () => {
    const target = Math.min(lesson.durationSec, currentTime + 5);
    if (!allowForwardScrubbing && watchPercentage < 80 && target > maxWatchedSeconds + 3) {
      setSkipWarning(true);
      setTimeout(() => setSkipWarning(false), 3500);
      return;
    }
    onTimeChange(target);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = target;
    }
  };

  const handleStepBackward = () => {
    const target = Math.max(0, currentTime - 5);
    onTimeChange(target);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = target;
    }
  };

  const jumpToLine = (seconds: number) => {
    onTimeChange(seconds);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = seconds;
      videoElementRef.current.play().catch((err) => {
        console.warn("Video play interrupted:", err);
      });
    }
    setIsPlaying(true);
  };

  const progressPercent = Math.min(100, (currentTime / (lesson.durationSec || 1)) * 100);
  const maxWatchBarPercent = Math.min(100, (maxWatchedSeconds / (lesson.durationSec || 1)) * 100);

  // Check if direct video exists
  const isDirectVideo = lesson.videoUrl && (lesson.videoUrl.endsWith(".mp4") || lesson.videoUrl.endsWith(".webm") || lesson.embedType === "direct");
  const isAparat = lesson.videoUrl && (lesson.videoUrl.includes("aparat.com") || lesson.embedType === "aparat");

  return (
    <div className={styles.playerCard}>
      {/* Anti-skipping Warning Toast */}
      {skipWarning && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            left: "1rem",
            zIndex: 40,
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            fontSize: "0.825rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 8px 16px -2px rgba(0,0,0,0.1)",
          }}
        >
          <span>⚠️</span>
          <span>برای یادگیری موثر، امکان جلو زدن ویدیو پیش از تماشای ۸۰٪ غیرفعال است. (عقب زدن مجاز است)</span>
        </div>
      )}

      {/* Screen Frame */}
      <div className={styles.playerScreenWrapper}>
        {/* If Aparat embed */}
        {isAparat ? (
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
            <iframe
              src={lesson.videoUrl}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              allow="autoplay; fullscreen"
              title={lesson.titleFa}
            />
          </div>
        ) : isDirectVideo ? (
          /* Native HTML5 Video */
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <video
              ref={videoElementRef}
              src={lesson.videoUrl}
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000000", cursor: "pointer" }}
              onClick={togglePlayPause}
              onTimeUpdate={(e) => {
                const sec = Math.floor(e.currentTarget.currentTime);
                onTimeChange(sec);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error("Video load error:", e);
                setVideoError(true);
              }}
            />

            {/* Centered Play Button Overlay when paused */}
            {!isPlaying && !videoError && (
              <button
                type="button"
                onClick={togglePlayPause}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "4.75rem",
                  height: "4.75rem",
                  borderRadius: "50%",
                  background: "rgba(37, 99, 235, 0.92)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                  transition: "transform 0.2s, background 0.2s",
                  zIndex: 10,
                }}
                title="پخش ویدیو"
                aria-label="پخش ویدیو"
              >
                ▶
              </button>
            )}

            {/* Error Overlay with Retry */}
            {videoError && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(15, 23, 42, 0.92)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  padding: "2rem",
                  textAlign: "center",
                  zIndex: 20,
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⚠️</div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  بارگذاری ویدیو با تاخیر مواجه شد
                </div>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: "26rem", margin: "0 0 1rem" }}>
                  ممکن است فایل در حال بافر باشد. لطفاً مجدداً تلاش کنید:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setVideoError(false);
                    if (videoElementRef.current) {
                      videoElementRef.current.load();
                      videoElementRef.current.play().catch(console.error);
                    }
                  }}
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  تلاش مجدد بارگذاری ↺
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Visual Interactive Stage Fallback */
          <div
            className={styles.playerVisualStage}
            style={{
              background: lesson.posterGradient,
            }}
          >
            <div className={styles.playerStageGlow} />

            <div className={styles.playerStageContent}>
              <div className={styles.stageSeriesBadge}>
                {lesson.seriesTitleFa || "American English File"} · {lesson.unit}
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
            </div>
          </div>
        )}

        {/* Video Controls Bar */}
        <div className={styles.playerControls}>
          {/* Scrubber Track with max-watched buffer */}
          <div
            className={styles.scrubberTrack}
            onClick={handleScrubberClick}
            title={watchPercentage < 80 ? "جلو زدن ویدیو تا زمان ۸۰٪ قفل است" : "جابجایی آزاد در ویدیو"}
          >
            {/* Max reached buffer track */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: `${maxWatchBarPercent}%`,
                background: "rgba(255, 255, 255, 0.35)",
                borderRadius: "9999px",
                pointerEvents: "none",
              }}
            />
            {/* Current playback fill */}
            <div className={styles.scrubberFilled} style={{ width: `${progressPercent}%` }} />
          </div>

          <div className={styles.controlButtonsRow}>
            {/* Left Controls */}
            <div className={styles.ctrlLeft}>
              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={togglePlayPause}
                title={isPlaying ? "توقف (Pause)" : "پخش (Play)"}
                aria-label={isPlaying ? "توقف" : "پخش"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>

              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={handleStepBackward}
                title="۵ ثانیه عقب"
                aria-label="۵ ثانیه عقب"
              >
                ↺5s
              </button>

              <button
                type="button"
                className={styles.ctrlIconBtn}
                onClick={handleStepForward}
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
                onChange={(e) => {
                  const spd = parseFloat(e.target.value);
                  setPlaybackSpeed(spd);
                  if (videoElementRef.current) {
                    videoElementRef.current.playbackRate = spd;
                  }
                }}
                title="سرعت پخش"
                aria-label="سرعت پخش"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
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
                  ref={isActive ? activeLineRef : null}
                  className={`${styles.transcriptLineItem} ${
                    isActive ? styles.transcriptLineItemActive : ""
                  }`}
                  onClick={() => jumpToLine(line.seconds)}
                >
                  <span className={styles.lineTimestamp}>{line.timeDisplay}</span>
                  <div style={{ flex: 1 }}>
                    {line.speaker ? <div className={styles.lineSpeaker}>{line.speaker}</div> : null}
                    <div className={styles.lineTextEn}>{line.textEn}</div>
                    {line.textFa ? <div className={styles.lineTextFa}>{line.textFa}</div> : null}
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
