"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./voice-recorder.module.css";

interface VoiceRecorderProps {
  onConfirmTranscript: (transcript: string, recordingId?: number) => void;
  onSwitchToTextMode?: () => void;
  timeLimitSec?: number;
  locale?: "fa" | "en";
  scenarioId?: string;
  sessionId?: string;
  disabled?: boolean;
}

const NUM_METER_BARS = 24;

export function VoiceRecorder({
  onConfirmTranscript,
  onSwitchToTextMode,
  timeLimitSec = 90,
  locale = "fa",
  scenarioId = "",
  sessionId = "",
  disabled = false,
}: VoiceRecorderProps) {
  const isFa = locale === "fa";

  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt");
  const [recordingState, setRecordingState] = useState<"idle" | "testing" | "recording" | "recorded" | "uploading">("idle");
  const [duration, setDuration] = useState<number>(0);
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(NUM_METER_BARS).fill(4));
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [isEditingTranscript, setIsEditingTranscript] = useState<boolean>(false);
  const [editedTranscript, setEditedTranscript] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);

  // Clean up resources on unmount
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
          // Ignore
        }
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Setup Web Speech API for real-time STT
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
        let textAccumulator = "";
        for (let i = 0; i < event.results.length; i++) {
          textAccumulator += event.results[i][0].transcript + " ";
        }
        const clean = textAccumulator.trim();
        setTranscript(clean);
        setEditedTranscript(clean);
      };

      recognizer.onerror = () => {
        // Continue recording audio even if client STT has an error
      };

      return recognizer;
    } catch {
      return null;
    }
  };

  // Setup Audio Meter Visualizer
  const setupAudioMeter = (stream: MediaStream) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeters = () => {
        analyser.getByteFrequencyData(dataArray);
        const bars = Array.from({ length: NUM_METER_BARS }, (_, i) => {
          const val = dataArray[i % dataArray.length];
          return Math.max(4, Math.round((val / 255) * 44));
        });
        setMeterLevels(bars);
        animationFrameRef.current = requestAnimationFrame(updateMeters);
      };
      updateMeters();
    } catch {
      // AudioContext unavailable; proceed without meter
    }
  };

  // Test microphone input levels
  const handleTestMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionState("granted");
      setRecordingState("testing");
      setupAudioMeter(stream);
    } catch {
      setPermissionState("denied");
      setErrorMessage(
        isFa
          ? "دسترسی به میکروفون رد شد. لطفاً دسترسی مرورگر را تأیید کنید یا به حالت متنی بروید."
          : "Microphone access denied. Please grant permission or switch to text mode."
      );
    }
  };

  // Detect supported audio MIME type
  const getSupportedMimeType = (): string => {
    if (typeof MediaRecorder === "undefined") return "audio/webm";
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return "audio/webm";
  };

  // Start active recording
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setTranscript("");
    setEditedTranscript("");
    setIsEditingTranscript(false);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    try {
      let stream = streamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setPermissionState("granted");
      }

      setupAudioMeter(stream);

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingState("recorded");
      };

      recorder.start(250);
      setRecordingState("recording");
      setDuration(0);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev + 1 >= timeLimitSec) {
            handleStopRecording();
            return timeLimitSec;
          }
          return prev + 1;
        });
      }, 1000);

      // Start client speech recognition
      const recognizer = initSpeechRecognition();
      if (recognizer) {
        speechRecognitionRef.current = recognizer;
        try {
          recognizer.start();
        } catch {
          // Ignored
        }
      }
    } catch {
      setPermissionState("denied");
      setErrorMessage(
        isFa
          ? "دسترسی به میکروفون غیرفعال است. می‌توانید به صورت متنی پاسخ دهید."
          : "Microphone access denied. You can proceed with text input."
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
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
        // Ignored
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setMeterLevels(Array(NUM_METER_BARS).fill(4));
  };

  // Discard and record again
  const handleReset = () => {
    handleStopRecording();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setTranscript("");
    setEditedTranscript("");
    setIsEditingTranscript(false);
    setDuration(0);
    setRecordingState("idle");
    setErrorMessage(null);
  };

  // Confirm and upload audio attempt
  const handleConfirmAndSubmit = async () => {
    const finalSpoken = editedTranscript.trim() || transcript.trim();
    if (!finalSpoken && !audioBlob) {
      setErrorMessage(
        isFa
          ? "هیچ گفتاری شناسایی نشد. لطفاً دوباره ضبط کنید یا متن پاسخ را وارد کنید."
          : "No speech recognized. Please record again or type your transcript."
      );
      return;
    }

    setRecordingState("uploading");
    setErrorMessage(null);

    try {
      let recordingId: number | undefined;

      if (audioBlob) {
        // Step 1: Request signed upload ticket
        const ticketRes = await fetch("/api/voice/upload-ticket/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: "roleplay_turn.webm",
            content_type: audioBlob.type || "audio/webm",
            file_size: audioBlob.size,
            scenario_id: scenarioId,
            session_id: sessionId,
          }),
        });

        if (ticketRes.ok) {
          const ticket = await ticketRes.json();
          recordingId = ticket.recording_id;

          // Step 2: Upload audio binary
          const formData = new FormData();
          formData.append("audio_file", audioBlob, "roleplay_turn.webm");
          formData.append("duration_seconds", String(duration));
          formData.append("stt_hint", finalSpoken);

          await fetch(`/api/voice/recordings/${recordingId}/upload/`, {
            method: "POST",
            body: formData,
          });

          // Step 3: If transcript was edited, sync correction
          if (isEditingTranscript && editedTranscript.trim()) {
            await fetch(`/api/voice/recordings/${recordingId}/transcript/`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ corrected_transcript: editedTranscript.trim() }),
            });
          }
        }
      }

      onConfirmTranscript(finalSpoken, recordingId);
      handleReset();
    } catch {
      // Fallback submit gracefully without blocking
      onConfirmTranscript(finalSpoken);
      handleReset();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <span style={{ fontSize: "1.25rem" }}>🎙️</span>
          <h3 className={styles.title}>
            {isFa ? "ورودی صوتی و ضبط گفتار" : "Voice Input & Speech Recorder"}
          </h3>
          <span className={styles.badgeBeta}>{isFa ? "نسخه آزمایشی (Beta)" : "Validated Beta"}</span>
        </div>

        {onSwitchToTextMode && (
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onSwitchToTextMode}
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
          >
            {isFa ? "تغییر به تایپ متنی ⌨️" : "Switch to Text ⌨️"}
          </button>
        )}
      </div>

      {/* Permission Denied Notice with Fallback */}
      {permissionState === "denied" && (
        <div className={`${styles.noticeBanner} ${styles.noticeWarning}`}>
          <div>
            <strong>{isFa ? "میکروفون غیرفعال است: " : "Microphone Unavailable: "}</strong>
            <span>
              {isFa
                ? "دسترسی میکروفون رد شد. می‌توانید بدون مسدود شدن از ورودی متنی استفاده کنید."
                : "Microphone permission denied. You can proceed with text input without disruption."}
            </span>
          </div>
        </div>
      )}

      {/* Unsupported Browser Notice */}
      {permissionState === "unsupported" && (
        <div className={`${styles.noticeBanner} ${styles.noticeWarning}`}>
          <span>
            {isFa
              ? "مرورگر شما از قابلیت ضبط مستقیم پشتیبانی نمی‌کند. لطفاً پاسخ خود را تایپ کنید."
              : "Media recording is not supported in this browser. Please type your response below."}
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className={`${styles.noticeBanner} ${styles.noticeDanger}`}>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Sound Meter Visualizer */}
      <div className={styles.meterArea} aria-hidden="true">
        {meterLevels.map((lvl, idx) => (
          <div
            key={idx}
            className={`${styles.meterBar} ${
              recordingState === "recording" ? styles.meterBarActive : ""
            } ${lvl > 35 ? styles.meterBarPeak : ""}`}
            style={{ height: `${lvl}px` }}
          />
        ))}
      </div>

      {/* Status & Timer Bar */}
      <div className={styles.statusBar}>
        <span>
          {recordingState === "recording" && (
            <span style={{ color: "var(--color-danger)", fontWeight: 700 }}>
              ● {isFa ? "در حال ضبط صدا..." : "Recording live..."}
            </span>
          )}
          {recordingState === "testing" && (
            <span style={{ color: "var(--color-success)", fontWeight: 700 }}>
              ✓ {isFa ? "میکروفون فعال است (سطح صدا را بررسی کنید)" : "Microphone active (check audio meter)"}
            </span>
          )}
          {recordingState === "recorded" && (
            <span style={{ color: "var(--color-success)", fontWeight: 700 }}>
              ✓ {isFa ? "صدا ضبط شد. لطفاً متن را بررسی کنید." : "Audio recorded. Review transcript below."}
            </span>
          )}
          {recordingState === "uploading" && (
            <span>{isFa ? "در حال ارسال و تحلیل صدا..." : "Uploading & analyzing audio..."}</span>
          )}
          {recordingState === "idle" && (
            <span>{isFa ? "آماده برای ضبط (حداکثر ۹۰ ثانیه)" : "Ready to speak (max 90 seconds)"}</span>
          )}
        </span>

        <span className={`${styles.timer} ${recordingState === "recording" ? styles.timerRecording : ""}`}>
          {formatSeconds(duration)} / {formatSeconds(timeLimitSec)}
        </span>
      </div>

      {/* Audio Playback Preview */}
      {audioUrl && (
        <div className={styles.audioPreviewCard}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-muted)" }}>
            {isFa ? "پیش‌شنوایی صدای ضبط‌شده شما:" : "Playback Your Recorded Audio:"}
          </span>
          <audio src={audioUrl} controls className={styles.audioNativePlayer} />
        </div>
      )}

      {/* Transcript Review and Manual Correction */}
      {recordingState === "recorded" && (
        <div className={styles.transcriptCard}>
          <div className={styles.transcriptHeader}>
            <span>{isFa ? "متن شناسایی‌شده از گفتار:" : "Recognized Speech Transcript:"}</span>
            <button
              type="button"
              className={styles.buttonSecondary}
              style={{ padding: "0.125rem 0.5rem", fontSize: "0.75rem" }}
              onClick={() => setIsEditingTranscript(!isEditingTranscript)}
            >
              {isEditingTranscript
                ? isFa ? "ذخیره متن ویرایش‌شده ✓" : "Save Edits ✓"
                : isFa ? "ویرایش متن شناسایی‌شده ✏️" : "Edit Transcript ✏️"}
            </button>
          </div>

          {isEditingTranscript ? (
            <textarea
              dir="ltr"
              className={styles.transcriptEditor}
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              placeholder="Correct any misrecognized words before submitting..."
            />
          ) : (
            <p dir="ltr" className={styles.transcriptText}>
              &ldquo;{editedTranscript || transcript || (isFa ? "متنی شناسایی نشد (لطفاً ویرایش کنید)" : "No transcript captured (please edit)")}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Primary Action Controls */}
      <div className={styles.controlsRow}>
        {recordingState === "idle" && (
          <>
            <button
              type="button"
              className={styles.buttonRecord}
              onClick={handleStartRecording}
              disabled={disabled}
            >
              <span>🔴</span>
              <span>{isFa ? "شروع ضبط صدا" : "Start Recording"}</span>
            </button>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={handleTestMic}
              disabled={disabled}
            >
              <span>🎙️</span>
              <span>{isFa ? "آزمایش میکروفون" : "Test Microphone"}</span>
            </button>
          </>
        )}

        {recordingState === "testing" && (
          <>
            <button
              type="button"
              className={styles.buttonRecord}
              onClick={handleStartRecording}
              disabled={disabled}
            >
              <span>🔴</span>
              <span>{isFa ? "آغاز مکالمه و ضبط" : "Start Turn Recording"}</span>
            </button>
            <button type="button" className={styles.buttonSecondary} onClick={handleReset}>
              {isFa ? "لغو آزمایش" : "Cancel Test"}
            </button>
          </>
        )}

        {recordingState === "recording" && (
          <button
            type="button"
            className={`${styles.buttonRecord} ${styles.buttonRecordingActive}`}
            onClick={handleStopRecording}
          >
            <span>⏹️</span>
            <span>{isFa ? "توقف ضبط و استخراج متن" : "Stop & Transcribe"}</span>
          </button>
        )}

        {recordingState === "recorded" && (
          <>
            <button
              type="button"
              className={`${styles.buttonRecord} ${styles.buttonSuccess}`}
              onClick={handleConfirmAndSubmit}
              disabled={disabled}
            >
              <span>✓</span>
              <span>{isFa ? "تأیید و ارسال نوبت صوتی" : "Confirm & Send Turn"}</span>
            </button>
            <button type="button" className={styles.buttonSecondary} onClick={handleReset}>
              {isFa ? "ضبط مجدد ↺" : "Record Again ↺"}
            </button>
          </>
        )}
      </div>

      {/* Non-blocking Text Input Fallback */}
      {(permissionState === "denied" || permissionState === "unsupported") && (
        <div className={styles.fallbackArea}>
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
            {isFa ? "ورودی جایگزین متنی (عدم توقف فرآیند یادگیری):" : "Non-blocking Text Fallback:"}
          </span>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <input
              type="text"
              dir="ltr"
              className={styles.fallbackInput}
              value={fallbackText}
              placeholder="Type your response in English..."
              onChange={(e) => setFallbackText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && fallbackText.trim()) {
                  onConfirmTranscript(fallbackText.trim());
                  setFallbackText("");
                }
              }}
            />
            <button
              type="button"
              className={styles.buttonRecord}
              onClick={() => {
                if (fallbackText.trim()) {
                  onConfirmTranscript(fallbackText.trim());
                  setFallbackText("");
                }
              }}
              disabled={!fallbackText.trim()}
            >
              {isFa ? "ارسال" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
