"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./exam.module.css";
import { Button } from "@endoora/ui";

interface ListeningPlayerProps {
  audioUrl: string;
  maxPlays?: number;
  onPlayLimitReached?: () => void;
}

export function ListeningPlayer({
  audioUrl,
  maxPlays = 2,
  onPlayLimitReached,
}: ListeningPlayerProps) {
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const remainingPlays = Math.max(0, maxPlays - playCount);
  const isPlayDisabled = remainingPlays <= 0 && !isPlaying;

  const handlePlay = () => {
    if (!audioRef.current || isPlayDisabled) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    const nextCount = playCount + 1;
    setPlayCount(nextCount);
    setCurrentTime(0);

    if (nextCount >= maxPlays && onPlayLimitReached) {
      onPlayLimitReached();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.audioPlayerContainer}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controlsList="nodownload noplaybackrate"
        preload="metadata"
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.25rem" }}>🎧</span>
          <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>پخش صوت درک شنیداری</span>
        </div>

        <div className={styles.playLimitNotice}>
          سقف پخش باقی‌مانده: {remainingPlays} از {maxPlays} بار
        </div>
      </div>

      {/* Progress Bar (Seek Disabled for Exam Integrity) */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#e2e8f0",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "#6366f1",
            transition: "width 0.2s linear",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          type="button"
          onClick={handlePlay}
          disabled={isPlayDisabled}
          style={{
            background: isPlaying ? "#f59e0b" : "#4f46e5",
            color: "#ffffff",
            padding: "0.5rem 1.25rem",
            fontWeight: 600,
          }}
        >
          {isPlaying ? "توقف موقت ⏸" : "پخش صوت ▶"}
        </Button>

        <span style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#64748b" }} dir="ltr">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
