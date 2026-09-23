"use client";

import React from "react";
import styles from "./exam.module.css";
import { useAudioRecorder } from "../../lib/use-audio-recorder";
import { Button } from "@endoora/ui";

interface SpeakingRecorderProps {
  timeLimitSeconds?: number | null;
  audioBlob: Blob | null;
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export function SpeakingRecorder({
  timeLimitSeconds = 60,
  audioBlob: externalBlob,
  onRecordingComplete,
  disabled = false,
}: SpeakingRecorderProps) {
  const {
    isRecording,
    recordingDuration,
    audioBlob,
    audioUrl,
    waveformData,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder({
    timeLimitSeconds,
    onTimeLimitReached: () => {
      // Auto complete
    },
  });

  const handleStop = () => {
    stopRecording();
  };

  React.useEffect(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob, onRecordingComplete]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hasRecorded = Boolean(audioUrl || externalBlob);

  return (
    <div className={styles.recorderContainer}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
        <span style={{ fontSize: "2rem" }}>🎙️</span>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.0625rem" }}>
          پاسخ صوتی بخش Speaking
        </h4>
        {timeLimitSeconds && (
          <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
            حداکثر زمان مجاز: {timeLimitSeconds} ثانیه
          </span>
        )}
      </div>

      {/* Waveform Visualizer */}
      <div className={styles.waveformCanvas}>
        {waveformData.map((val, idx) => (
          <div
            key={idx}
            className={styles.waveformBar}
            style={{
              height: isRecording ? `${Math.max(12, val * 55)}px` : "6px",
              background: isRecording ? "#ef4444" : "#cbd5e1",
            }}
          />
        ))}
      </div>

      {/* Timer Display */}
      <div style={{ fontFamily: "monospace", fontSize: "1.125rem", fontWeight: 700 }} dir="ltr">
        {formatSeconds(recordingDuration)} / {formatSeconds(timeLimitSeconds || 60)}
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.8125rem" }}>
          {error}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        {!isRecording && !hasRecorded && (
          <Button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            style={{ background: "#ef4444", color: "#ffffff", fontWeight: 700, padding: "0.625rem 1.5rem" }}
          >
            شروع ضبط صدا 🔴
          </Button>
        )}

        {isRecording && (
          <Button
            type="button"
            onClick={handleStop}
            style={{ background: "#3b82f6", color: "#ffffff", fontWeight: 700, padding: "0.625rem 1.5rem" }}
          >
            توقف و ذخیره صوت ⏹
          </Button>
        )}

        {hasRecorded && !isRecording && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {audioUrl && (
              <audio src={audioUrl} controls style={{ height: "40px" }} />
            )}
            <Button
              type="button"
              onClick={resetRecording}
              disabled={disabled}
              style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}
            >
              ضبط مجدد 🔄
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
