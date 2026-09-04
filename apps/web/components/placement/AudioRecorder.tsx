"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./audio-recorder.module.css";

interface AudioRecorderProps {
  timeLimitSec?: number;
  minWordsExpected?: number;
  onConfirmAnswer: (payload: {
    spoken_text: string;
    audio_recorded: boolean;
    duration_sec: number;
  }) => void;
  initialSpokenText?: string;
  locale?: "fa" | "en";
  disabled?: boolean;
}

// 24 visual sound meter bars
const NUM_METER_BARS = 24;

export function AudioRecorder({
  timeLimitSec = 60,
  minWordsExpected = 10,
  onConfirmAnswer,
  initialSpokenText = "",
  locale = "fa",
  disabled = false,
}: AudioRecorderProps) {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded" | "denied">("idle");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(initialSpokenText);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackText, setFallbackText] = useState(initialSpokenText);
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(NUM_METER_BARS).fill(4));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);

  const isFa = locale === "fa";

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // Ignored
        }
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle active speech recognition setup
  const initSpeechRecognition = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = typeof window !== "undefined" ? (window as any) : null;
    if (!win) return null;

    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) return null;

    try {
      const recognizer = new SpeechRec();
      recognizer.lang = "en-US";
      recognizer.continuous = true;
      recognizer.interimResults = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognizer.onresult = (event: any) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + " ";
        }
        const trimmed = fullTranscript.trim();
        setTranscript(trimmed);
        onConfirmAnswer({
          spoken_text: trimmed,
          audio_recorded: true,
          duration_sec: duration,
        });
      };

      recognizer.onerror = () => {
        // Fallback gracefully without blocking learner
      };

      return recognizer;
    } catch {
      return null;
    }
  };

  // Start recording
  const startRecording = async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState("recorded");

        const finalText = transcript || fallbackText;
        onConfirmAnswer({
          spoken_text: finalText,
          audio_recorded: true,
          duration_sec: duration,
        });
      };

      // Set up audio analyser for visual sound meter
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          const newLevels: number[] = [];
          for (let i = 0; i < NUM_METER_BARS; i++) {
            const val = dataArray[i % dataArray.length] || 0;
            // Height between 4px and 36px
            const height = Math.max(4, Math.min(36, Math.round((val / 255) * 36)));
            newLevels.push(height);
          }
          setMeterLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateMeter);
        };
        animationFrameRef.current = requestAnimationFrame(updateMeter);
      } catch {
        // Audio visualizer fallback: static levels
      }

      // Set up STT
      const recognizer = initSpeechRecognition();
      if (recognizer) {
        speechRecognitionRef.current = recognizer;
        try {
          recognizer.start();
        } catch {
          // Handled
        }
      }

      mediaRecorder.start(250);
      setRecordingState("recording");
      setDuration(0);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          if (next >= timeLimitSec) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch {
      setRecordingState("denied");
      setShowFallback(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // Handled
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setMeterLevels(Array(NUM_METER_BARS).fill(4));
  };

  // Re-record
  const handleReRecord = () => {
    stopRecording();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingState("idle");
    setDuration(0);
    setTranscript("");
    setFallbackText("");
    onConfirmAnswer({
      spoken_text: "",
      audio_recorded: false,
      duration_sec: 0,
    });
  };

  // Handle manual fallback text input
  const handleFallbackChange = (text: string) => {
    setFallbackText(text);
    onConfirmAnswer({
      spoken_text: text,
      audio_recorded: recordingState === "recorded",
      duration_sec: duration,
    });
  };

  const activeText = transcript || fallbackText;
  const words = activeText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = words.length;
  const isSufficient = wordCount >= minWordsExpected;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={styles.container} role="region" aria-label={isFa ? "بخش ضبط صدا" : "Audio recording area"}>
      {/* Header */}
      <div className={styles.recorderHeader}>
        <div className={styles.titleGroup}>
          <svg className={styles.micIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className={styles.recorderTitle}>
            {isFa ? "پاسخ گفتاری (Speaking Response)" : "Spoken Response"}
          </span>
        </div>

        {/* State Badge */}
        <div
          className={`${styles.statusBadge} ${
            recordingState === "recording"
              ? styles.statusRecording
              : recordingState === "recorded"
              ? styles.statusRecorded
              : styles.statusIdle
          }`}
          role="status"
        >
          {recordingState === "recording" && <span className={styles.recordingPulse} />}
          {recordingState === "recording" && (isFa ? "در حال ضبط صدا..." : "Recording...")}
          {recordingState === "recorded" && (isFa ? "صدا ضبط شد" : "Recorded")}
          {recordingState === "idle" && (isFa ? "آماده ضبط" : "Ready to record")}
          {recordingState === "denied" && (isFa ? "دسترسی به میکروفون رد شد" : "Mic permission denied")}
        </div>
      </div>

      {/* Visual Sound Meter */}
      <div className={styles.meterContainer} aria-hidden="true">
        {meterLevels.map((lvl, idx) => (
          <div
            key={idx}
            className={`${styles.meterBar} ${
              recordingState === "recording" ? (lvl > 20 ? styles.meterBarPeak : styles.meterBarActive) : ""
            }`}
            style={{ height: `${lvl}px` }}
          />
        ))}
      </div>

      {/* Controls Row */}
      <div className={styles.controlsRow}>
        {recordingState === "idle" && (
          <button
            type="button"
            className={`${styles.recordBtn} ${styles.recordBtnStart}`}
            onClick={startRecording}
            disabled={disabled}
            aria-label={isFa ? "شروع ضبط صدا" : "Start recording"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            {isFa ? "شروع ضبط صدا" : "Start Recording"}
          </button>
        )}

        {recordingState === "recording" && (
          <button
            type="button"
            className={`${styles.recordBtn} ${styles.recordBtnStop}`}
            onClick={stopRecording}
            aria-label={isFa ? "توقف ضبط صدا" : "Stop recording"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            {isFa ? "توقف و ثبت صدا" : "Stop Recording"}
          </button>
        )}

        {recordingState === "recorded" && (
          <button
            type="button"
            className={styles.reRecordBtn}
            onClick={handleReRecord}
            aria-label={isFa ? "ضبط مجدد صدا" : "Re-record response"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            {isFa ? "ضبط مجدد صدا" : "Re-record"}
          </button>
        )}

        <div className={styles.timer}>
          <span>{formatTime(duration)}</span>
          <span style={{ color: "var(--color-text-muted)", marginInline: "var(--space-1)" }}>/</span>
          <span style={{ color: "var(--color-text-muted)" }}>{formatTime(timeLimitSec)}</span>
        </div>
      </div>

      {/* Audio playback preview */}
      {audioUrl && (
        <audio controls src={audioUrl} className={styles.audioPreview} preload="metadata">
          Your browser does not support the audio playback element.
        </audio>
      )}

      {/* STT Live Transcript Box */}
      <div className={styles.transcriptBox}>
        <div className={styles.transcriptHeader}>
          <span>{isFa ? "پیش‌نمایش متن گفتار (Live STT Preview):" : "Speech-to-Text Preview:"}</span>
          <span className={`${styles.wordCountBadge} ${isSufficient ? styles.wordCountSufficient : ""}`}>
            {wordCount} / {minWordsExpected} {isFa ? "کلمه" : "words"}
            {isSufficient && " ✓"}
          </span>
        </div>

        <div className={styles.transcriptText} aria-live="polite">
          {activeText ? (
            activeText
          ) : (
            <span className={styles.transcriptEmpty}>
              {isFa
                ? "هنگام صحبت کردن، متن گفتار به صورت زنده در اینجا ظاهر می‌شود..."
                : "Your spoken words will appear here in real-time as you speak..."}
            </span>
          )}
        </div>
      </div>

      {/* Fallback Text Input Toggle */}
      <div className={styles.fallbackSection}>
        <button
          type="button"
          className={styles.fallbackToggle}
          onClick={() => setShowFallback(!showFallback)}
          aria-expanded={showFallback}
        >
          {showFallback
            ? (isFa ? "بستن بخش نوشتن متنی" : "Hide text fallback")
            : (isFa ? "یا در صورت عدم دسترسی به میکروفون، پاسخ خود را اینجا بنویسید" : "Or type your response if your mic is unavailable")}
        </button>

        {showFallback && (
          <div>
            <textarea
              className={styles.fallbackTextarea}
              value={fallbackText}
              onChange={(e) => handleFallbackChange(e.target.value)}
              placeholder={
                isFa
                  ? "متن گفتار خود را به زبان انگلیسی بنویسید..."
                  : "Type your spoken response in English here..."
              }
              rows={3}
            />
            <p className={styles.hintText}>
              {isFa
                ? "این متن به عنوان پاسخ گفتاری شما ارزیابی شده و شواهد واژگانی و روانی بررسی خواهند شد."
                : "This text will be evaluated for vocabulary sufficiency and fluency diagnostics."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
