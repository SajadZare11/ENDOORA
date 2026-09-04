"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./audio-player.module.css";

interface AudioWaveformPlayerProps {
  src: string;
  playLimit?: number;
  title_fa?: string;
  title_en?: string;
  locale?: "fa" | "en";
  onPlayExhausted?: () => void;
}

// 32 calibrated normalized amplitude bars (0.15 to 0.95)
const WAVEFORM_HEIGHTS = [
  0.25, 0.4, 0.65, 0.85, 0.7, 0.5, 0.35, 0.6,
  0.8, 0.95, 0.75, 0.55, 0.3, 0.45, 0.7, 0.9,
  0.85, 0.65, 0.4, 0.6, 0.8, 0.95, 0.75, 0.5,
  0.35, 0.55, 0.75, 0.85, 0.6, 0.45, 0.3, 0.2,
];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function AudioWaveformPlayer({
  src,
  playLimit = 2,
  title_fa = "فایل صوتی سوال",
  title_en = "Question Audio",
  locale = "fa",
  onPlayExhausted,
}: AudioWaveformPlayerProps) {
  const isFa = locale === "fa";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasStartedPlay, setHasStartedPlay] = useState(false);

  const isExhausted = playCount >= playLimit;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasError(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setHasStartedPlay(false);
      setCurrentTime(0);
      if (playCount >= playLimit && onPlayExhausted) {
        onPlayExhausted();
      }
    };

    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [playCount, playLimit, onPlayExhausted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (isExhausted) return;

      // Count a play session when starting from 0
      if (!hasStartedPlay) {
        const nextCount = playCount + 1;
        setPlayCount(nextCount);
        setHasStartedPlay(true);
      }

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setHasError(true);
      }
    }
  };

  const handleSeek = (index: number) => {
    const audio = audioRef.current;
    if (!audio || !duration || isExhausted) return;

    const ratio = index / WAVEFORM_HEIGHTS.length;
    const target = ratio * duration;
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const activeBarCount = Math.floor(progressRatio * WAVEFORM_HEIGHTS.length);

  return (
    <div
      className={styles.playerContainer}
      role="region"
      aria-roledescription="audio player"
      aria-label={isFa ? "پخش‌کننده صوتی آزمون" : "Test audio player"}
      dir={isFa ? "rtl" : "ltr"}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Top Header */}
      <div className={styles.topBar}>
        <span className={styles.badge}>
          🎧 {isFa ? title_fa : title_en}
        </span>
        <span className={`${styles.limitBadge} ${isExhausted ? styles.limitExhausted : ""}`}>
          {isFa
            ? `پخش مجاز: ${playCount} از ${playLimit}`
            : `Plays: ${playCount} of ${playLimit}`}
        </span>
      </div>

      {/* Interactive Waveform Display */}
      <div className={styles.waveformWrapper}>
        <div
          className={styles.waveform}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          aria-label={isFa ? "نوار فرکانسی صوت" : "Audio waveform scrubber"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              togglePlay();
            } else if (e.key === "ArrowRight") {
              const audio = audioRef.current;
              if (audio) audio.currentTime = Math.min(duration, currentTime + 3);
            } else if (e.key === "ArrowLeft") {
              const audio = audioRef.current;
              if (audio) audio.currentTime = Math.max(0, currentTime - 3);
            }
          }}
        >
          {WAVEFORM_HEIGHTS.map((heightFactor, idx) => {
            const isBarActive = idx <= activeBarCount;
            const isBarCurrent = idx === activeBarCount && isPlaying;
            const barHeightPct = Math.round(heightFactor * 100);

            return (
              <div
                key={idx}
                className={`${styles.waveformBar} ${isBarActive ? styles.waveformBarActive : ""} ${
                  isBarCurrent ? styles.waveformBarCurrent : ""
                }`}
                style={{ height: `${barHeightPct}%` }}
                onClick={() => handleSeek(idx)}
                title={`Seek: ${formatTime((idx / WAVEFORM_HEIGHTS.length) * duration)}`}
              />
            );
          })}
        </div>

        {/* Time Readout */}
        <div className={styles.timeRow}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Row */}
      <div className={styles.controlsRow}>
        <div className={styles.mainControls}>
          <button
            type="button"
            className={styles.playButton}
            onClick={togglePlay}
            disabled={isExhausted && !isPlaying}
            aria-label={
              isPlaying
                ? isFa ? "توقف موقت" : "Pause audio"
                : isFa ? "پخش فایل صوتی" : "Play audio"
            }
          >
            {isPlaying ? (
              <>
                <span>⏸</span>
                <span>{isFa ? "توقف" : "Pause"}</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>{isFa ? (playCount > 0 ? "ادامه پخش" : "پخش فایل") : (playCount > 0 ? "Resume" : "Play")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={styles.volumeButton}
            onClick={toggleMute}
            aria-label={isMuted ? (isFa ? "وصل صدا" : "Unmute") : (isFa ? "قطع صدا" : "Mute")}
            title={isMuted ? (isFa ? "وصل صدا" : "Unmute") : (isFa ? "قطع صدا" : "Mute")}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Playback Speed Switcher */}
        <div className={styles.speedGroup} role="group" aria-label={isFa ? "سرعت پخش" : "Playback speed"}>
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              type="button"
              className={`${styles.speedButton} ${playbackRate === rate ? styles.speedButtonActive : ""}`}
              onClick={() => changeSpeed(rate)}
              aria-pressed={playbackRate === rate}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Alert when playback limit is exhausted */}
      {isExhausted && !isPlaying && (
        <div className={styles.exhaustedAlert}>
          {isFa
            ? "حداکثر دفعات مجاز گوش دادن به این فایل صوتی تکمیل شد. لطفاً به سوال پاسخ دهید."
            : "Maximum play limit for this audio has been reached. Please answer the question."}
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className={styles.errorBox}>
          {isFa
            ? "بارگذاری فایل صوتی با مشکل مواجه شد. لطفاً اتصال اینترنت خود را بررسی کنید یا مجدداً تلاش نمایید."
            : "Failed to load audio file. Please check your connection or retry."}
        </div>
      )}
    </div>
  );
}

export default AudioWaveformPlayer;
