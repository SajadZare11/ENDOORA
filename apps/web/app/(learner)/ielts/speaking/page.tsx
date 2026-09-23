'use client';

import { Button } from "@endoora/ui";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./ielts-speaking.module.css";
import {
  fetchSpeakingPrompts,
  saveSpeakingDraft,
  fetchSpeakingDraft,
  submitSpeaking,
  IELTSSpeakingPrompt,
  DEFAULT_SPEAKING_FALLBACK_PROMPT,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "../../../../lib/ielts-speaking";

const NUM_METER_BARS = 24;

function IELTSSpeakingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftIdParam = searchParams.get("draftId");

  const [prompts, setPrompts] = useState<IELTSSpeakingPrompt[]>([DEFAULT_SPEAKING_FALLBACK_PROMPT]);
  const [activePart, setActivePart] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consent & hardware state
  const [consentGranted, setConsentGranted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [useTextFallback, setUseTextFallback] = useState(false);

  // Draft telemetry & content
  const [submissionId, setSubmissionId] = useState<string | null>(draftIdParam);
  const [autosaveStatus, setAutosaveStatus] = useState<string>("در انتظار پاسخ...");

  // Part 1
  const [part1Transcript, setPart1Transcript] = useState("");
  const [part1Duration, setPart1Duration] = useState(0);
  const [part1AudioUrl, setPart1AudioUrl] = useState<string | null>(null);

  // Part 2 Cue Card
  const [part2PrepNotes, setPart2PrepNotes] = useState("");
  const [part2PrepSeconds, setPart2PrepSeconds] = useState(60);
  const [prepTimerActive, setPrepTimerActive] = useState(false);
  const [part2Transcript, setPart2Transcript] = useState("");
  const [part2Duration, setPart2Duration] = useState(0);
  const [part2AudioUrl, setPart2AudioUrl] = useState<string | null>(null);

  // Part 3
  const [part3Transcript, setPart3Transcript] = useState("");
  const [part3Duration, setPart3Duration] = useState(0);
  const [part3AudioUrl, setPart3AudioUrl] = useState<string | null>(null);

  // Recording hardware state
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded">("idle");
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(NUM_METER_BARS).fill(4));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecRef = useRef<any>(null);

  // Exam clock (15 minutes total standard duration)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900);

  // Accessibility
  const [fontScale, setFontScale] = useState<"standard" | "large" | "xl">("standard");
  const [contrastTheme, setContrastTheme] = useState<"standard" | "dark">("standard");

  // Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Current prompt
  const currentPrompt = prompts[0] || DEFAULT_SPEAKING_FALLBACK_PROMPT;

  // Cleanup Web Audio and streams on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (part1AudioUrl) URL.revokeObjectURL(part1AudioUrl);
      if (part2AudioUrl) URL.revokeObjectURL(part2AudioUrl);
      if (part3AudioUrl) URL.revokeObjectURL(part3AudioUrl);
    };
  }, [part1AudioUrl, part2AudioUrl, part3AudioUrl]);

  // Load prompts & drafts
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const fetchedPrompts = await fetchSpeakingPrompts();
        if (fetchedPrompts && fetchedPrompts.length > 0) {
          setPrompts(fetchedPrompts);
        }

        try {
          const draft = await fetchSpeakingDraft(draftIdParam || undefined);
          if (draft && draft.status === "draft") {
            setSubmissionId(draft.id);
            setPart1Transcript(draft.part1_transcript || "");
            setPart1Duration(draft.part1_duration_seconds || 0);
            setPart2PrepNotes(draft.part2_prep_notes || "");
            setPart2Transcript(draft.part2_transcript || "");
            setPart2Duration(draft.part2_duration_seconds || 0);
            setPart3Transcript(draft.part3_transcript || "");
            setPart3Duration(draft.part3_duration_seconds || 0);
            setAutosaveStatus("پیش‌نویس ذخیره‌شده بازیابی شد.");
          }
        } catch {
          // fresh attempt
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات آزمون مکالمه.");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [draftIdParam]);

  // Overall Exam Clock Countdown
  useEffect(() => {
    if (loading || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, secondsRemaining]);

  // Part 2 Prep Countdown
  useEffect(() => {
    if (!prepTimerActive || part2PrepSeconds <= 0) return;
    const timer = setInterval(() => {
      setPart2PrepSeconds((s) => {
        if (s <= 1) {
          setPrepTimerActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [prepTimerActive, part2PrepSeconds]);

  // Debounced Autosave effect
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (loading) return;

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      setAutosaveStatus("در حال ذخیره‌سازی پیش‌نویس...");
      try {
        const res = await saveSpeakingDraft({
          submission_id: submissionId,
          part1_prompt_title: currentPrompt.part1.title,
          part1_questions: currentPrompt.part1.questions,
          part1_transcript: part1Transcript,
          part1_duration_seconds: part1Duration,
          part2_cue_card_title: currentPrompt.part2.title,
          part2_cue_card_prompt: currentPrompt.part2.cue_card_prompt,
          part2_bullet_points: currentPrompt.part2.bullet_points,
          part2_prep_notes: part2PrepNotes,
          part2_prep_time_seconds: 60,
          part2_transcript: part2Transcript,
          part2_duration_seconds: part2Duration,
          part3_prompt_title: currentPrompt.part3.title,
          part3_questions: currentPrompt.part3.questions,
          part3_transcript: part3Transcript,
          part3_duration_seconds: part3Duration,
        });
        if (res && res.submission_id) {
          setSubmissionId(res.submission_id);
          setAutosaveStatus("پیش‌نویس ذخیره شد ✓");
        }
      } catch {
        setAutosaveStatus("عدم امکان ذخیره‌سازی در سرور (ذخیره موقت)");
      }
    }, 2500);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [
    loading,
    submissionId,
    part1Transcript,
    part1Duration,
    part2PrepNotes,
    part2Transcript,
    part2Duration,
    part3Transcript,
    part3Duration,
    currentPrompt,
  ]);

  // Request Microphone Access
  const handleGrantConsent = async () => {
    setShowConsentModal(false);
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setConsentGranted(true);
      } else {
        setUseTextFallback(true);
      }
    } catch {
      // Permission denied or microphone unavailable
      setUseTextFallback(true);
    }
  };

  const handleDeclineConsent = () => {
    setShowConsentModal(false);
    setUseTextFallback(true);
  };

  // Start Audio Recording
  const startRecording = () => {
    if (!streamRef.current && !useTextFallback) {
      handleGrantConsent();
      return;
    }

    try {
      const stream = streamRef.current;
      if (!stream) {
        setRecordingState("recording");
        return;
      }

      // Setup Web Audio Analyser
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          analyser.getByteFrequencyData(dataArray);
          const barCount = NUM_METER_BARS;
          const step = Math.floor(dataArray.length / barCount);
          const newLevels: number[] = [];
          for (let i = 0; i < barCount; i++) {
            const val = dataArray[i * step] || 0;
            const height = Math.max(4, Math.min(48, Math.round((val / 255) * 48)));
            newLevels.push(height);
          }
          setMeterLevels(newLevels);
          animationFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (activePart === 1) {
          setPart1AudioUrl(url);
        } else if (activePart === 2) {
          setPart2AudioUrl(url);
        } else {
          setPart3AudioUrl(url);
        }
      };

      mediaRecorder.start(250);
      setRecordingState("recording");

      // Setup Speech Recognition for real-time STT preview
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = typeof window !== "undefined" ? (window as any) : null;
      if (win) {
        const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (SpeechRec) {
          try {
            const recognizer = new SpeechRec();
            recognizer.lang = "en-US";
            recognizer.continuous = true;
            recognizer.interimResults = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognizer.onresult = (e: any) => {
              let text = "";
              for (let i = 0; i < e.results.length; i++) {
                text += e.results[i][0].transcript + " ";
              }
              const clean = text.trim();
              if (clean) {
                if (activePart === 1) setPart1Transcript(clean);
                else if (activePart === 2) setPart2Transcript(clean);
                else setPart3Transcript(clean);
              }
            };
            recognizer.start();
            speechRecRef.current = recognizer;
          } catch {
            // SpeechRec fallback
          }
        }
      }

      // Duration counter
      recordingTimerRef.current = setInterval(() => {
        if (activePart === 1) setPart1Duration((d) => d + 1);
        else if (activePart === 2) setPart2Duration((d) => d + 1);
        else setPart3Duration((d) => d + 1);
      }, 1000);
    } catch {
      setRecordingState("recording");
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }
    setMeterLevels(Array(NUM_METER_BARS).fill(4));
    setRecordingState("recorded");
  };

  // Switch between Part 1, 2, 3
  const handleSelectPart = (part: 1 | 2 | 3) => {
    if (recordingState === "recording") {
      stopRecording();
    }
    setActivePart(part);
    setRecordingState("idle");
  };

  // Final Exam Submission
  const handleFinalSubmit = async () => {
    setShowSubmitModal(false);
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        submission_id: submissionId,
        test_id: currentPrompt.test_id || null,
        part1_prompt_title: currentPrompt.part1.title,
        part1_questions: currentPrompt.part1.questions,
        part1_transcript: part1Transcript,
        part1_duration_seconds: part1Duration,
        part2_cue_card_title: currentPrompt.part2.title,
        part2_cue_card_prompt: currentPrompt.part2.cue_card_prompt,
        part2_bullet_points: currentPrompt.part2.bullet_points,
        part2_prep_notes: part2PrepNotes,
        part2_prep_time_seconds: 60,
        part2_transcript: part2Transcript,
        part2_duration_seconds: part2Duration,
        part3_prompt_title: currentPrompt.part3.title,
        part3_questions: currentPrompt.part3.questions,
        part3_transcript: part3Transcript,
        part3_duration_seconds: part3Duration,
      };

      const report = await submitSpeaking(payload);
      router.push(`/ielts/speaking/report?id=${report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت و ارزیابی نهایی آزمون مکالمه.");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const activeAudioUrl = activePart === 1 ? part1AudioUrl : activePart === 2 ? part2AudioUrl : part3AudioUrl;
  const activeDuration = activePart === 1 ? part1Duration : activePart === 2 ? part2Duration : part3Duration;
  const activeTranscript = activePart === 1 ? part1Transcript : activePart === 2 ? part2Transcript : part3Transcript;
  const setActiveTranscript = (val: string) => {
    if (activePart === 1) setPart1Transcript(val);
    else if (activePart === 2) setPart2Transcript(val);
    else setPart3Transcript(val);
  };

  const containerClass = `${styles.container} ${contrastTheme === "dark" ? styles.containerDark : ""} ${
    fontScale === "large" ? styles.fontLarge : fontScale === "xl" ? styles.fontXl : ""
  }`;

  return (
    <div className={containerClass}>
      {/* Exam Header */}
      <header className={styles.examHeader} role="banner">
        <div className={styles.examHeaderInner}>
          <div className={styles.candidateInfo}>
            <h1 className={styles.examTitle}>اتاق شبیه‌ساز مکالمه کامپیوتری آیلتس (CD-IELTS Speaking)</h1>
            <span className={styles.candidateSubtitle}>
              آزمون ۳ قسمتی استاندارد شامل مصاحبه آشنایی، ارائه کارت موضوع (Cue Card) و بحث تحلیلی انتزاعی
            </span>
          </div>

          {/* Global Interview Countdown Timer */}
          <div
            className={`${styles.timerBox} ${
              secondsRemaining < 180 ? styles.timerDanger : secondsRemaining < 300 ? styles.timerWarning : ""
            }`}
            aria-label="زمان باقی‌مانده آزمون"
          >
            <span>⏱️</span>
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Header Accessibility & Actions */}
          <div className={styles.headerActions}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.iconBtn}
              onClick={() => setContrastTheme(contrastTheme === "dark" ? "standard" : "dark")}
              title="تغییر کنتراست پوسته"
            >
              {contrastTheme === "dark" ? "☀️ روز" : "🌙 شب"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.iconBtn}
              onClick={() => {
                if (fontScale === "standard") setFontScale("large");
                else if (fontScale === "large") setFontScale("xl");
                else setFontScale("standard");
              }}
              title="تغییر اندازه قلم"
            >
              اندازه متن ({fontScale})
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className={styles.submitBtn}
              onClick={() => setShowSubmitModal(true)}
              loading={submitting}
              disabled={submitting}
            >
              {submitting ? "در حال ارزیابی..." : "اتمام آزمون و ارزیابی هوش مصنوعی ➔"}
            </Button>
          </div>
        </div>
      </header>

      {/* 78rem Aligned Exam Body */}
      <div className={styles.examBody}>
        {/* Mandatory IELTS Trademark Disclaimer */}
        <aside className={styles.disclaimerBar} role="note">
          <span className={styles.disclaimerBadge}>سلب مسئولیت قانونی</span>
          <span>{MANDATORY_IELTS_DISCLAIMER_TEXT} — محتوای ۱۰۰٪ اصیل و آموزشی طراحی‌شده جهت آمادگی داوطلبان.</span>
        </aside>

        {/* Part Selection Tabs */}
        <nav className={styles.tabsBar} aria-label="Speaking Parts Navigation">
          <Button
            type="button"
            variant={activePart === 1 ? "primary" : "secondary"}
            className={`${styles.tabBtn} ${activePart === 1 ? styles.tabBtnActive : ""}`}
            onClick={() => handleSelectPart(1)}
          >
            <span>پارت ۱: احوال‌پرسی و سوالات عمومی</span>
            <span className={styles.tabPill}>۴-۵ دقیقه</span>
          </Button>

          <Button
            type="button"
            variant={activePart === 2 ? "primary" : "secondary"}
            className={`${styles.tabBtn} ${activePart === 2 ? styles.tabBtnActive : ""}`}
            onClick={() => handleSelectPart(2)}
          >
            <span>پارت ۲: صحبت ۲ دقیقه‌ای (Cue Card)</span>
            <span className={styles.tabPill}>۱ دقیقه تفکر + ۲ دقیقه صحبت</span>
          </Button>

          <Button
            type="button"
            variant={activePart === 3 ? "primary" : "secondary"}
            className={`${styles.tabBtn} ${activePart === 3 ? styles.tabBtnActive : ""}`}
            onClick={() => handleSelectPart(3)}
          >
            <span>پارت ۳: بحث عمیق و تحلیلی</span>
            <span className={styles.tabPill}>۴-۵ دقیقه</span>
          </Button>
        </nav>

        {/* Error Alert */}
        {error && (
          <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger-text)", padding: "var(--space-3)", borderRadius: "var(--radius-card)", fontSize: "var(--font-size-sm)", border: "1px solid var(--color-danger-border)" }}>
            {error}
          </div>
        )}

        {/* Main Simulation Workspace */}
        <main className={styles.workspace}>
          {/* Left Pane: Prompt & Guidelines */}
          <section className={styles.promptPane} aria-label="Speaking Prompt Pane">
            {activePart === 1 && (
              <div className={styles.promptCard}>
                <div className={styles.promptHeaderLtr} dir="ltr">
                  <h2 className={styles.promptTitle}>{currentPrompt.part1.title}</h2>
                  <p className={styles.promptInstructions}>{currentPrompt.part1.instructions}</p>
                </div>
                <div className={styles.questionsList}>
                  {currentPrompt.part1.questions.map((q, idx) => (
                    <div key={idx} className={styles.questionItem}>
                      <span className={styles.questionBadge}>سوال {idx + 1}:</span>
                      <span className={styles.questionText} dir="ltr">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePart === 2 && (
              <div className={styles.cueCard}>
                <div className={styles.cueCardHeader}>
                  <span className={styles.cueCardKicker}>Candidate Task Card (Cue Card)</span>
                  <span className={styles.cueCardTimeHint}>
                    زمان آماده‌سازی: ۱ دقیقه | صحبت: ۱ تا ۲ دقیقه
                  </span>
                </div>
                <div className={styles.cueCardContent} dir="ltr">
                  <h2 className={styles.promptTitle}>{currentPrompt.part2.title}</h2>
                  <p className={styles.cueCardPrompt}>
                    {currentPrompt.part2.cue_card_prompt}
                  </p>
                  <ul className={styles.bulletList}>
                    {currentPrompt.part2.bullet_points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* 1-Minute Prep Countdown Widget */}
                <div className={`${styles.prepWidget} ${prepTimerActive ? styles.prepWidgetActive : ""}`}>
                  <div>
                    <strong style={{ fontSize: "var(--font-size-sm)" }}>زمان آماده‌سازی و نت‌برداری (۱ دقیقه):</strong>
                    <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-muted)" }}>
                      برای تمام بولت‌ها کلیدواژه یادداشت کنید.
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span className={styles.prepTimerDigits}>{formatTime(part2PrepSeconds)}</span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className={styles.iconBtn}
                      onClick={() => setPrepTimerActive(!prepTimerActive)}
                    >
                      {prepTimerActive ? "توقف" : "شروع ۱ دقیقه"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className={styles.iconBtn}
                      onClick={() => {
                        setPrepTimerActive(false);
                        setPart2PrepSeconds(60);
                      }}
                    >
                      بازنشانی
                    </Button>
                  </div>
                </div>

                {/* Scratchpad Notes */}
                <textarea
                  className={styles.prepNotesBox}
                  placeholder="یادداشت‌های ۱ دقیقه‌ای شما (کلمات کلیدی برای بولت‌ها)..."
                  value={part2PrepNotes}
                  onChange={(e) => setPart2PrepNotes(e.target.value)}
                  aria-label="یادداشت‌های آماده‌سازی پارت ۲"
                />
              </div>
            )}

            {activePart === 3 && (
              <div className={styles.promptCard}>
                <div className={styles.promptHeaderLtr} dir="ltr">
                  <h2 className={styles.promptTitle}>{currentPrompt.part3.title}</h2>
                  <p className={styles.promptInstructions}>{currentPrompt.part3.instructions}</p>
                </div>
                <div className={styles.questionsList}>
                  {currentPrompt.part3.questions.map((q, idx) => (
                    <div key={idx} className={styles.questionItem}>
                      <span className={styles.questionBadge}>سوال تحلیلی {idx + 1}:</span>
                      <span className={styles.questionText} dir="ltr">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        {/* Right Pane: Audio Recording & Transcript Review Console */}
        <section className={styles.consolePane} aria-label="Audio Recording Console">
          <div className={styles.recorderCard}>
            <div className={styles.recorderHeader}>
              <strong style={{ fontSize: "var(--font-size-sm)" }}>
                🎙️ کنسول ضبط صدای پاسخ داوطلب (پارت {activePart})
                {consentGranted && !useTextFallback && (
                  <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-success-text)", marginInlineStart: "var(--space-2)" }}>
                    ● میکروفون مجاز
                  </span>
                )}
              </strong>
              <span
                className={`${styles.recordingStateBadge} ${
                  recordingState === "recording"
                    ? styles.badgeRecording
                    : recordingState === "recorded"
                    ? styles.badgeRecorded
                    : styles.badgeIdle
                }`}
              >
                {recordingState === "recording"
                  ? "🔴 در حال ضبط صدا..."
                  : recordingState === "recorded"
                  ? "✓ صدا با موفقیت ضبط شد"
                  : "در انتظار شروع"}
              </span>
            </div>

            {/* 24 Frequency Meter Bars */}
            <div className={styles.meterContainer} aria-label="نشانگر زنده فرکانس و وضوح میکروفون">
              {meterLevels.map((lvl, i) => (
                <div
                  key={i}
                  className={styles.meterBar}
                  style={{
                    blockSize: `${lvl}px`,
                    opacity: recordingState === "recording" ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            {/* Recording Controls */}
            <div className={styles.controlsRow}>
              {recordingState !== "recording" ? (
                <Button
                  type="button"
                  variant="primary"
                  className={`${styles.micBtn} ${styles.micBtnStart}`}
                  onClick={startRecording}
                >
                  <span>🎤</span>
                  <span>شروع ضبط صدای پارت {activePart}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  className={`${styles.micBtn} ${styles.micBtnStop}`}
                  onClick={stopRecording}
                >
                  <span>⏹️</span>
                  <span>توقف ضبط ({formatTime(activeDuration)})</span>
                </Button>
              )}

              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                مدت پاسخ: {formatTime(activeDuration)}
              </span>
            </div>

            {/* Audio Playback Player */}
            {activeAudioUrl && (
              <div>
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 700 }}>
                  بازشنوایی و کنترل کیفیت ضبط صدای پارت {activePart}:
                </span>
                <audio controls src={activeAudioUrl} className={styles.audioPlayer}>
                  مرورگر شما از پخش مستقیم فایل صوتی پشتیبانی نمی‌کند.
                </audio>
              </div>
            )}
          </div>

          {/* Real-time Editable Transcript Review Box */}
          <div className={styles.transcriptCard}>
            <div className={styles.transcriptTitleRow}>
              <div>
                <strong style={{ fontSize: "var(--font-size-sm)" }}>
                  📝 متن پیاده‌شده و ویرایش هوشمند (Transcript Review)
                </strong>
                <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  متن پیاده‌شده گفتار شما توسط تبدیل خودکار گفتار به نوشتار (STT) در زیر نمایش داده می‌شود. در صورت لزوم می‌توانید کلمات را ویرایش کنید.
                </p>
              </div>
            </div>

            <textarea
              className={styles.transcriptTextarea}
              placeholder={`متن صحبت‌های شما برای پارت ${activePart} به طور زنده اینجا درج می‌شود. همچنین می‌توانید متن را ویرایش یا دستی تایپ کنید...`}
              value={activeTranscript}
              onChange={(e) => setActiveTranscript(e.target.value)}
              aria-label={`متن پاسخ پارت ${activePart}`}
            />
          </div>
        </section>
      </main>
      </div>

      {/* Footer Info & Autosave Indicator */}
      <footer className={styles.footerBar} role="contentinfo">
        <div className={styles.footerBarInner}>
          <div className={styles.autosaveIndicator}>
            <span>💾</span>
            <span>{autosaveStatus}</span>
          </div>
          <div>
            <span>پارت ۱: {part1Transcript.split(/\s+/).filter(Boolean).length} کلمه | </span>
            <span>پارت ۲: {part2Transcript.split(/\s+/).filter(Boolean).length} کلمه | </span>
            <span>پارت ۳: {part3Transcript.split(/\s+/).filter(Boolean).length} کلمه</span>
          </div>
        </div>
      </footer>

      {/* Recording Consent & Hardware Modal */}
      {showConsentModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <div className={styles.modalContent}>
            <h2 id="consent-title" className={styles.modalTitle}>
              مجوز ضبط صدا و حفظ حریم خصوصی آواشناسی
            </h2>
            <div className={styles.modalBody}>
              برای اجرای شبیه‌ساز رسمی مکالمه آیلتس، مرورگر شما نیازمند دسترسی به میکروفون است.
              <div className={styles.privacyAlert} style={{ marginBlock: "var(--space-3)" }}>
                <strong>سیاست حفظ حریم خصوصی بیومتریک ایندورا (قانون شماره ۸ مرامنامه):</strong>
                <p style={{ margin: 0, marginBlockStart: "var(--space-1)" }}>
                  فایل‌های صوتی ضبط‌شده صرفاً جهت استخراج سرعت سخن‌گویی (WPM)، مکث‌ها و ارزیابی تشخیصی روانی کلام بر پایه معیارهای رسمی آیلتس استفاده می‌شوند. هیچ‌گونه نمره‌سازی ساختگی در سطح واج یا لهجه‌سنجی غیرمعتبر انجام نخواهد شد.
                </p>
              </div>
              همچنین می‌توانید در هر زمان متن پیاده‌شده را اصلاح کرده یا در صورت تمایل از حالت تایپ متنی پشتیبان استفاده کنید.
            </div>
            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="secondary"
                className={styles.cancelBtn}
                onClick={handleDeclineConsent}
              >
                ادامه در حالت متنی (بدون میکروفون)
              </Button>
              <Button
                type="button"
                variant="primary"
                className={styles.confirmBtn}
                onClick={handleGrantConsent}
              >
                فعال‌سازی میکروفون و شروع آزمون 🎙️
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="submit-modal-title">
          <div className={styles.modalContent}>
            <h2 id="submit-modal-title" className={styles.modalTitle}>
              تأیید اتمام و ارسال آزمون مکالمه آیلتس
            </h2>
            <div className={styles.modalBody}>
              آیا از اتمام آزمون و استخراج کارنامه تشخیصی اطمینان دارید؟
              <ul style={{ marginBlock: "var(--space-2)", paddingInlineStart: "var(--space-4)" }}>
                <li>پارت ۱: {part1Transcript ? "تکمیل شده" : "خالی"} ({part1Duration} ثانیه)</li>
                <li>پارت ۲: {part2Transcript ? "تکمیل شده" : "خالی"} ({part2Duration} ثانیه)</li>
                <li>پارت ۳: {part3Transcript ? "تکمیل شده" : "خالی"} ({part3Duration} ثانیه)</li>
              </ul>
              پس از ثبت نهایی، موتور ارزیابی چندمعیاره هوش مصنوعی پاسخ‌های شما را بر پایه ۴ معیار رسمی آیلتس (FC, LR, GRA, PR) تحلیل خواهد کرد.
            </div>
            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="secondary"
                className={styles.cancelBtn}
                onClick={() => setShowSubmitModal(false)}
              >
                بازگشت و ادامه تمرین
              </Button>
              <Button
                type="button"
                variant="primary"
                className={styles.confirmBtn}
                onClick={handleFinalSubmit}
              >
                تأیید و دریافت کارنامه تشخیصی ➔
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IELTSSpeakingRoomPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>در حال بارگذاری آزمون اسپیکینگ...</div>}>
      <IELTSSpeakingRoomContent />
    </React.Suspense>
  );
}
