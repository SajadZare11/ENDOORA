"use client";

import React, { useEffect, useState } from "react";
import type { ListeningAudioEngine, AudioEngineState } from "@/lib/listening/audio-engine";
import type { TranscriptSentence } from "@endoora/contracts";
import styles from "./listening-components.module.css";

interface ListeningAudioPlayerProps {
  engine: ListeningAudioEngine;
  sentences: TranscriptSentence[];
  titleFa?: string;
  titleEn?: string;
  onSentenceChange?: (index: number) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const ListeningAudioPlayer: React.FC<ListeningAudioPlayerProps> = ({
  engine,
  sentences,
  titleFa = "پخش‌کننده تخصصی صوتی",
  titleEn,
  onSentenceChange,
}) => {
  const [state, setState] = useState<AudioEngineState>(engine.getState());

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
      onSentenceChange?.(newState.currentSentenceIndex);
    });
    return () => unsubscribe();
  }, [engine, onSentenceChange]);

  const currentSentence = sentences[state.currentSentenceIndex];
  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className={styles.playerCard} role="region" aria-label="پخش‌کننده صوتی لیسنینگ">
      {/* Header */}
      <div className={styles.playerHeader}>
        <div className={styles.playerTitleArea}>
          <div className={state.isPlaying ? styles.pulseDot : styles.pulseDotInactive} />
          <div>
            <h3 className={styles.playerTitle}>{titleFa}</h3>
            {titleEn && <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{titleEn}</span>}
          </div>
        </div>

        {/* Speed Selector Pills */}
        <div className={styles.ratePills} role="group" aria-label="سرعت پخش صدا">
          {speeds.map((rate) => (
            <button
              key={rate}
              type="button"
              className={`${styles.ratePill} ${state.playbackRate === rate ? styles.ratePillActive : ""}`}
              onClick={() => engine.setPlaybackRate(rate)}
              aria-pressed={state.playbackRate === rate}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Scrubber */}
      <div className={styles.waveformContainer}>
        <input
          type="range"
          min={0}
          max={state.duration || 100}
          step={0.5}
          value={state.currentTime}
          onChange={(e) => engine.seek(parseFloat(e.target.value))}
          className={styles.sliderBar}
          aria-label="نوار زمان صوت"
        />
        <div className={styles.timeRow}>
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Current Active Sentence Ticker */}
      {currentSentence && (
        <div className={styles.sentenceTicker}>
          <span>
            {currentSentence.speaker ? <strong>{currentSentence.speaker}: </strong> : null}
            {currentSentence.textEn}
          </span>
        </div>
      )}

      {/* Primary Audio Controls */}
      <div className={styles.playerControls}>
        {/* Replay 5 seconds */}
        <button
          type="button"
          onClick={() => engine.replaySeconds(5)}
          className={styles.secBtn}
          title="۵ ثانیه به عقب بازگرد"
          aria-label="۵ ثانیه عقب"
        >
          <span>↺</span>
          <span>۵ ثانیه</span>
        </button>

        {/* Replay current sentence */}
        <button
          type="button"
          onClick={() => engine.replaySentence()}
          className={styles.secBtn}
          title="تکرار مجدد جمله فعلی"
          aria-label="تکرار جمله فعلی"
        >
          <span>↻</span>
          <span>تکرار جمله</span>
        </button>

        {/* Main Play/Pause Button */}
        <button
          type="button"
          onClick={() => engine.togglePlay()}
          className={styles.playBtn}
          aria-label={state.isPlaying ? "توقف پخش" : "شروع پخش"}
        >
          {state.isPlaying ? "⏸" : "▶"}
        </button>

        {/* Mute toggle */}
        <button
          type="button"
          onClick={() => engine.toggleMute()}
          className={styles.secBtn}
          aria-label={state.isMuted ? "وصل صدا" : "قطع صدا"}
        >
          {state.isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Status Footer */}
      {state.isUsingSynthesis && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#0369a1",
            background: "#e0f2fe",
            padding: "0.4rem 0.75rem",
            borderRadius: "6px",
            textAlign: "center",
            marginTop: "0.5rem",
          }}
        >
          💡 سیستم شبیه‌ساز تلفظ طبیعی هوشمند (Speech Engine) با تنظیم دقیق WPM فعال است.
        </div>
      )}
    </div>
  );
};
