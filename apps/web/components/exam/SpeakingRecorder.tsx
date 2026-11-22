"use client";

import React, { useRef, useState } from "react";
import { endooraApi } from "@/lib/endoora-api";
import styles from "./exam.module.css";
import { useAudioRecorder } from "../../lib/use-audio-recorder";
import { Button } from "@endoora/ui";

interface SpeakingRecorderProps {
  timeLimitSeconds?: number | null;
  submissionId: string;
  questionId: string;
  storedUrl?: string;
  onRecordingComplete: (recordingId: number) => void;
  disabled?: boolean;
}

export function SpeakingRecorder({
  timeLimitSeconds = 60,
  submissionId, questionId, storedUrl,
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

  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retention, setRetention] = useState("7_days");
  const [retaking, setRetaking] = useState(false);
  const ticketRef = useRef<number | null>(null);
  const [uploaded, setUploaded] = useState(false);

  async function saveRecording() {
    if (!audioBlob || saving || disabled) return;
    setSaving(true);
    setFailed(false);
    try {
      if (ticketRef.current === null) {
        const ticket = await endooraApi<{ recording_id: number }>("/voice/upload-ticket/", {
          method: "POST",
          json: { filename: "exam-answer", content_type: audioBlob.type, file_size: audioBlob.size,
                  retention_policy: retention, scenario_id: questionId, session_id: submissionId },
        });
        ticketRef.current = ticket.recording_id;
      }
      const form = new FormData();
      form.append("audio_file", audioBlob, "exam-answer");
      form.append("duration_seconds", String(recordingDuration));
      await endooraApi(`/voice/recordings/${ticketRef.current}/upload/`, { method: "POST", body: form });
      onRecordingComplete(ticketRef.current);
      setUploaded(true);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const playback = audioUrl || (!retaking ? storedUrl : undefined);
  const hasRecorded = Boolean(playback);

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
            توقف ضبط ⏹
          </Button>
        )}

        {hasRecorded && !isRecording && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {playback && (
              <audio src={playback} controls style={{ height: "40px" }} />
            )}
            {audioBlob && !uploaded && <>
              <label>مدت نگهداری فایل برای بازبینی مدرس
                <select value={retention} disabled={saving || disabled || failed}
                  onChange={event => setRetention(event.target.value)}>
                  <option value="7_days">۷ روز</option><option value="30_days">۳۰ روز</option>
                </select>
              </label>
              <Button type="button" onClick={saveRecording} disabled={saving || disabled}>
                {saving ? "در حال ارسال…" : "ارسال پاسخ صوتی برای مدرس"}
              </Button>
            </>}
            {failed && <p role="alert">ارسال انجام نشد. دوباره تلاش کنید.</p>}
            <Button
              type="button"
              onClick={() => { ticketRef.current = null; setRetaking(true); setFailed(false); setUploaded(false); resetRecording(); }}
              disabled={disabled || saving}
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
