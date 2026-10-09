"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./tamrin20.module.css";

export interface Tamrin20AudioPlayerProps {
  src: string;
  title?: string;
  timestamps?: {
    startSeconds: number;
    endSeconds: number;
  };
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

/**
 * Formats a duration in seconds into MM:SS format.
 */
function formatTime(seconds: number): string {
  if (Number.isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const Tamrin20AudioPlayer: React.FC<Tamrin20AudioPlayerProps> = ({
  src,
  title,
  timestamps,
  autoPlay = false,
  onEnded,
  className,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Initialize playback positions and timestamps
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasError(false);
      if (timestamps?.startSeconds && timestamps.startSeconds > 0) {
        audio.currentTime = timestamps.startSeconds;
        setCurrentTime(timestamps.startSeconds);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (timestamps?.endSeconds && audio.currentTime >= timestamps.endSeconds) {
        audio.pause();
        setIsPlaying(false);
        if (timestamps.startSeconds !== undefined) {
          audio.currentTime = timestamps.startSeconds;
          setCurrentTime(timestamps.startSeconds);
        }
        onEnded?.();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (timestamps?.startSeconds !== undefined) {
        audio.currentTime = timestamps.startSeconds;
        setCurrentTime(timestamps.startSeconds);
      }
      onEnded?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src, timestamps, onEnded]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (timestamps?.endSeconds && (audio.currentTime >= timestamps.endSeconds || (timestamps.startSeconds !== undefined && audio.currentTime < timestamps.startSeconds))) {
        audio.currentTime = timestamps.startSeconds || 0;
        setCurrentTime(timestamps.startSeconds || 0);
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setHasError(true);
        });
    }
  }, [isPlaying, timestamps]);

  // Handle Seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number.parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle playback rate between 1.0x and 0.8x
  const toggleSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextRate = playbackRate === 1.0 ? 0.8 : 1.0;
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  // Toggle Mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const containerClasses = [styles.audioPlayerContainer, className].filter(Boolean).join(" ");
  const playerAriaLabel = title ? `پخش صوتی: ${title}` : "پخش‌کننده صوتی سوال شنیداری";

  const isSegment = Boolean(
    timestamps &&
      typeof timestamps.startSeconds === "number" &&
      typeof timestamps.endSeconds === "number" &&
      timestamps.endSeconds > timestamps.startSeconds
  );
  const segmentStart = isSegment ? timestamps!.startSeconds : 0;
  const segmentEnd = isSegment ? timestamps!.endSeconds : duration;
  const segmentDuration = Math.max(0, segmentEnd - segmentStart);
  const relativeCurrentTime = isSegment
    ? Math.max(0, Math.min(currentTime - segmentStart, segmentDuration))
    : currentTime;
  const totalDisplayTime = isSegment ? segmentDuration : duration;

  return (
    <div className={containerClasses} role="region" aria-label={playerAriaLabel}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        autoPlay={autoPlay}
      />

      {/* Play / Pause Button */}
      <button
        type="button"
        className={styles.audioPlayBtn}
        onClick={togglePlay}
        disabled={hasError}
        aria-label={isPlaying ? "توقف پخش صوت" : (title ? `پخش صوت: ${title}` : "پخش صوت سوال")}
        title={isPlaying ? "توقف (Pause)" : "پخش (Play)"}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Seek Progress Bar */}
      <div className={styles.audioSeekContainer}>
        <input
          type="range"
          min={segmentStart}
          max={segmentEnd || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className={styles.audioSlider}
          aria-label="موقعیت زمانی فایل صوتی"
          disabled={hasError || duration === 0}
        />
        <div className={styles.audioTimeDisplay} aria-live="off">
          {formatTime(relativeCurrentTime)} / {formatTime(totalDisplayTime)}
          {isSegment && (
            <span className={styles.audioSegmentIndicator} title="بخش برش‌خورده فایل برای این سوال">
              (بخش سوال)
            </span>
          )}
        </div>
      </div>

      {/* Controls Group: Speed & Mute */}
      <div className={styles.audioControlsGroup}>
        {/* Playback speed toggle (1.0x / 0.8x) */}
        <button
          type="button"
          className={`${styles.audioSpeedBtn} ${playbackRate === 0.8 ? styles.audioSpeedActive : ""}`}
          onClick={toggleSpeed}
          title="تنظیم سرعت پخش (۰.۸ برابر برای یادگیری دقیق‌تر)"
          aria-label={`سرعت پخش: ${playbackRate} برابر`}
        >
          {playbackRate === 0.8 ? "0.8x" : "1.0x"}
        </button>

        {/* Volume / Mute button */}
        <button
          type="button"
          className={styles.audioMuteBtn}
          onClick={toggleMute}
          aria-label={isMuted ? "وصل صدا" : "قطع صدا"}
          title={isMuted ? "وصل صدا" : "قطع صدا"}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {hasError && (
        <span className={styles.badgeError} role="alert">
          خطا در بارگذاری فایل صوتی
        </span>
      )}
    </div>
  );
};
