'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getIeltsExamById } from "@/data/ielts/index.ts";
import { gradeExamModule, mapBandToCEFR } from "@/lib/ielts-grading.ts";
import { useGazeCognitive } from "@/lib/ai/useGazeCognitive.ts";
import { saveAttemptToStorage, loadAttemptFromStorage } from "@/lib/ielts-state.ts";
import {
  ensureTwinLearnerScope,
  beginTwinMock,
  finishTwinMock,
  updateTwinVulnerability,
  recordTwinObservation,
  getLearnerTwin,
} from '@/lib/ai/learner-twin-store';
import type { TwinMock } from '@/lib/ai/learner-twin-types';
import { EnDooraLinUCBBandit } from "@/lib/ai/linucb-bandit-engine.ts";
import { getAdaptiveQuestionForIelts } from "@/lib/ai/useAdaptiveQuestion.ts";
import { DktEngine } from "@/lib/dkt-engine/dkt-engine.ts";
import type { AssembledQuestion, EnDooraTriModalTelemetry } from "@/lib/ai/types.ts";
import type {
  IeltsExam,
  IeltsModule,
  IeltsQuestion,
  IeltsSkill,
  ExamAttempt,
} from "@endoora/contracts";
import styles from "./ielts-exam-room.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function IELTSExamRoomPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: examId } = use(params);

  // Skill query: defaults to reading if available, else listening
  const skillQuery = searchParams.get("skill") as IeltsSkill | null;

  const [exam, setExam] = useState<IeltsExam | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeSkill, setActiveSkill] = useState<IeltsSkill>("reading");
  const [activeModule, setActiveModule] = useState<IeltsModule | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQuestionNum, setActiveQuestionNum] = useState(1);
  const twinMockRef=useRef<ReturnType<typeof beginTwinMock>>(null);
  const twinLatenciesRef=useRef<Record<number,number>>({});
  const questionEnteredRef=useRef(0);
  useEffect(()=>{questionEnteredRef.current=performance.now();},[activeQuestionNum]);
  useEffect(()=>{
    if(!activeModule||!['listening','reading'].includes(activeSkill))return;
    const controller=new AbortController();twinMockRef.current=null;twinLatenciesRef.current={};
    void ensureTwinLearnerScope().then(()=>fetch(`/twin/mocks/${examId}-${activeSkill}.json`,{signal:controller.signal})).then(r=>{if(!r.ok)throw Error();return r.json();}).then((mock:TwinMock)=>{if(!controller.signal.aborted)twinMockRef.current=beginTwinMock(mock);}).catch(()=>{/* Mock grading still works when prediction metadata is unavailable. */});
    return ()=>controller.abort();
  },[examId,activeSkill,activeModule]);

  // Engine 5: Real-time Edge Proctoring & Cognitive Tracking (10 FPS, Zero Video Upload)
  const {
    telemetry: gazeTelemetry,
    proctoring: gazeProctoring,
  } = useGazeCognitive({
    autoStart: true,
    useMouseFallback: true,
  });

  // Engine 6: LinUCB Contextual Bandit Dynamic Distractor Assembly
  const banditRef = useRef<EnDooraLinUCBBandit | null>(null);
  const assembledQuestionsMapRef = useRef<Record<number, AssembledQuestion>>({});

  useEffect(() => {
    banditRef.current = EnDooraLinUCBBandit.getInstance(0.5);
  }, []);

  const buildExamCognitiveTelemetry = useCallback((
    latencyMs: number,
    gazeLoad: number = 0.5,
    gazeSuspicious: number = 0
  ): EnDooraTriModalTelemetry => {
    const twin = getLearnerTwin();
    const snapshot = twin?.getSnapshot();
    const speakingMean = snapshot?.modalityMastery?.speaking?.mean ?? 0.65;
    const phonemeErrorRate = Math.max(0, Math.min(1, 1.0 - speakingMean));

    const writingMean = snapshot?.modalityMastery?.writing?.mean ?? 0.65;
    const semanticDeficit = Math.max(0, Math.min(1, 1.0 - writingMean));

    let dktDeficit = 0.5;
    try {
      const dkt = DktEngine.getInstance();
      const preds = dkt.getPredictions();
      dktDeficit = Math.max(0, Math.min(1, 1.0 - (preds.overallRetentionIndex / 100)));
    } catch {
      // fallback
    }

    return {
      phonemeErrorRate,
      semanticDeficit,
      dktGrammarDeficit: dktDeficit,
      latencyMs,
      cognitiveLoadIndex: gazeLoad,
      saccadicRegressionRate: gazeSuspicious,
    };
  }, []);

  const getOrAssembleAdaptiveQuestion = useCallback((q: IeltsQuestion): AssembledQuestion | null => {
    if (q.question_type !== "multiple_choice") return null;
    if (assembledQuestionsMapRef.current[q.question_number]) {
      return assembledQuestionsMapRef.current[q.question_number];
    }
    const payload = getAdaptiveQuestionForIelts(activeSkill, q.question_number, "B2");
    if (!payload) return null;

    const latency = twinLatenciesRef.current[q.question_number] || 1500;
    const telemetry = buildExamCognitiveTelemetry(
      latency,
      gazeTelemetry.cognitiveLoadIndex,
      gazeProctoring.suspiciousScore
    );

    const bandit = banditRef.current || EnDooraLinUCBBandit.getInstance(0.5);
    const assembled = bandit.assembleAdaptiveQuestion(payload, telemetry, { alpha: 0.5 });
    
    // Ensure accepted_answers aligns with assembled.correctOptionIndex for accurate scoring
    const correctLetter = ["A", "B", "C", "D"][assembled.correctOptionIndex];
    if (correctLetter) {
      q.accepted_answers = [correctLetter];
    }

    assembledQuestionsMapRef.current[q.question_number] = assembled;
    return assembled;
  }, [activeSkill, buildExamCognitiveTelemetry, gazeTelemetry.cognitiveLoadIndex, gazeProctoring.suspiciousScore]);

  // User input states
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [flagged, setFlagged] = useState<number[]>([]);

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600);
  const [isPaused, setIsPaused] = useState(false);
  const [timeAlert, setTimeAlert] = useState<string | null>(null);
  const alerted10m = useRef(false);
  const alerted5m = useRef(false);

  // UI customizations
  const [fontScale, setFontScale] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [splitWidth, setSplitWidth] = useState<number>(50); // percentage
  const [isDraggingResizer, setIsDraggingResizer] = useState(false);
  const [highlighterActive, setHighlighterActive] = useState(false);

  // Audio player state for listening
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioVolume, setAudioVolume] = useState(1.0);

  // Submission modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Storage key for persistent auto-save
  const storageAttemptKey = `ielts_room_draft_${examId}_${activeSkill}`;

  // Load Exam
  useEffect(() => {
    const foundExam = getIeltsExamById(examId);
    if (!foundExam) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    setExam(foundExam);

    const initialSkill: IeltsSkill =
      skillQuery && foundExam.modules.some((m) => m.skill === skillQuery)
        ? skillQuery
        : foundExam.modules.some((m) => m.skill === "reading")
        ? "reading"
        : foundExam.modules[0].skill;

    setActiveSkill(initialSkill);
    const mod = foundExam.modules.find((m) => m.skill === initialSkill) || foundExam.modules[0];
    setActiveModule(mod);
    setSecondsRemaining((mod.duration_minutes || 60) * 60);

    // Restore draft answers from local storage
    try {
      const savedDraft = localStorage.getItem(`ielts_room_draft_${examId}_${initialSkill}`);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.flagged) setFlagged(parsed.flagged);
        if (typeof parsed.secondsRemaining === "number" && parsed.secondsRemaining > 0) {
          setSecondsRemaining(parsed.secondsRemaining);
        }
      }
    } catch (err) {
      console.warn("Could not restore exam draft", err);
    }
  }, [examId, skillQuery]);

  // Handle skill change
  const handleSelectSkill = (skill: IeltsSkill) => {
    if (!exam) return;
    const mod = exam.modules.find((m) => m.skill === skill);
    if (!mod) return;
    setActiveSkill(skill);
    setActiveModule(mod);
    setActiveSectionIdx(0);
    setActiveQuestionNum(1);
    setSecondsRemaining((mod.duration_minutes || 60) * 60);
    alerted10m.current = false;
    alerted5m.current = false;
  };

  // Timer Tick
  useEffect(() => {
    if (isPaused || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = Math.max(0, prev - 1);

        // 10 minutes warning alert
        if (next === 600 && !alerted10m.current) {
          alerted10m.current = true;
          setTimeAlert("⚠️ هشدار رسمی: ۱۰ دقیقه تا پایان زمان آزمون باقی مانده است.");
          setTimeout(() => setTimeAlert(null), 6000);
        }

        // 5 minutes warning alert
        if (next === 300 && !alerted5m.current) {
          alerted5m.current = true;
          setTimeAlert("🚨 هشدار نهایی: فقط ۵ دقیقه باقی مانده است!");
          setTimeout(() => setTimeAlert(null), 6000);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsRemaining]);

  // Resilient LocalStorage Draft Persistence every 5s & on input
  useEffect(() => {
    if (!exam || !activeSkill) return;
    try {
      const draftPayload = {
        answers,
        flagged,
        secondsRemaining,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageAttemptKey, JSON.stringify(draftPayload));
    } catch (err) {
      console.warn("Failed to auto-save exam draft", err);
    }
  }, [answers, flagged, secondsRemaining, exam, activeSkill, storageAttemptKey]);

  // Resizable split-screen drag handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingResizer) return;
      const totalWidth = window.innerWidth;
      const newPct = (e.clientX / totalWidth) * 100;
      if (newPct >= 25 && newPct <= 75) {
        setSplitWidth(newPct);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingResizer(false);
    };

    if (isDraggingResizer) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingResizer]);

  // Guaranteed authentic audio source based on module or exam fallback
  const computedAudioUrl = useMemo(() => {
    if (activeSkill !== "listening") return null;
    if (activeModule?.audio_url && activeModule.audio_url.startsWith("/audio/ielts/")) {
      return activeModule.audio_url;
    }
    const idLower = examId.toLowerCase();
    if (idLower.includes("18") && idLower.includes("gen")) return "/audio/ielts/c18_gen_test1_listening.mp3";
    if (idLower.includes("18")) return "/audio/ielts/c18_test1_listening.mp3";
    if (idLower.includes("17")) return "/audio/ielts/c17_test1_listening.mp3";
    if (idLower.includes("16")) return "/audio/ielts/c16_test1_listening.mp3";
    if (idLower.includes("15")) return "/audio/ielts/c15_test1_listening.mp3";
    if (idLower.includes("14")) return "/audio/ielts/c14_test1_listening.mp3";
    if (idLower.includes("13")) return "/audio/ielts/c13_test1_listening.mp3";
    if (idLower.includes("12")) return "/audio/ielts/c12_test1_listening.mp3";
    return "/audio/ielts/c18_test1_listening.mp3";
  }, [activeSkill, activeModule, examId]);

  // Audio Playback with Automatic Multi-Source Fallback (Local + GitHub Releases / CDN)
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
      setAudioLoading(false);
    } else {
      setAudioLoading(true);
      setAudioError(null);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioPlaying(true);
            setAudioLoading(false);
          })
          .catch((err) => {
            console.warn("Primary audio play failed, attempting GitHub CDN/Release fallback...", err);
            const el = audioRef.current;
            if (!el) {
              setAudioLoading(false);
              return;
            }
            const filename =
              (computedAudioUrl || activeModule?.audio_url || "c18_test1_listening.mp3")
                .split("/")
                .pop() || "c18_test1_listening.mp3";

            const rawGithubUrl = `https://raw.githubusercontent.com/SajadZare11/ielts-listening/main/audio/${filename}`;

            if (!el.src.includes("raw.githubusercontent.com")) {
              el.src = rawGithubUrl;
              el.load();
              el.play()
                .then(() => {
                  setAudioPlaying(true);
                  setAudioLoading(false);
                })
                .catch((err2) => {
                  console.error("GitHub audio stream fallback failed:", err2);
                  setAudioLoading(false);
                  setAudioPlaying(false);
                  setAudioError("خطا در بارگذاری فایل صوتی. لطفاً ارتباط اینترنت را بررسی کنید.");
                });
            } else {
              setAudioLoading(false);
              setAudioPlaying(false);
              setAudioError("خطا در بارگذاری منبع صوتی. لطفاً ارتباط اینترنت را بررسی کنید.");
            }
          });
      }
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAudioVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Flag toggle
  const toggleFlagQuestion = (qNum: number) => {
    setFlagged((prev) =>
      prev.includes(qNum) ? prev.filter((n) => n !== qNum) : [...prev, qNum]
    );
  };

  // Answer change
  const handleAnswerChange = (qNum: number, value: string | string[]) => {
    if(twinLatenciesRef.current[qNum]===undefined)twinLatenciesRef.current[qNum]=Math.max(0,performance.now()-questionEnteredRef.current);
    setAnswers((prev) => ({
      ...prev,
      [qNum]: value,
    }));
  };

  // Flattened question list
  const allQuestions = useMemo(() => {
    if (!activeModule) return [];
    const list: IeltsQuestion[] = [];
    activeModule.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        list.push(q);
      });
    });
    return list.sort((a, b) => a.question_number - b.question_number);
  }, [activeModule]);

  // Count answered
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(
      (k) => answers[Number(k)] !== undefined && answers[Number(k)] !== ""
    ).length;
  }, [answers]);

  const unansweredCount = (allQuestions.length || 40) - answeredCount;

  // Jump to question
  const jumpToQuestion = (qNum: number) => {
    setActiveQuestionNum(qNum);
    // Determine which section owns this question
    if (activeModule) {
      const secIdx = activeModule.sections.findIndex((sec) =>
        sec.questions.some((q) => q.question_number === qNum)
      );
      if (secIdx !== -1) {
        setActiveSectionIdx(secIdx);
      }
    }
    const el = document.getElementById(`q-item-${qNum}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Auto-submit when time runs out
  const handleSubmitExam = useCallback(async () => {
    if (!exam || !activeModule) return;
    setSubmitting(true);

    try {
      // Grade module client-side with official IELTS curve
      const graded = gradeExamModule(activeModule, answers, exam.category);
      finishTwinMock(twinMockRef.current,graded.gradingResults,twinLatenciesRef.current);
      twinMockRef.current=null;

      // Engine 6: Dispatch LinUCB Bandit Interaction Feedback and Learner Twin Observations
      allQuestions.forEach((q) => {
        const assembled = assembledQuestionsMapRef.current[q.question_number];
        if (!assembled) return;

        const userAns = answers[q.question_number];
        const latency = twinLatenciesRef.current[q.question_number] || 1500;
        const correctLetter = ["A", "B", "C", "D"][assembled.correctOptionIndex];
        const isCorrect = userAns === correctLetter;

        if (!isCorrect && typeof userAns === "string") {
          const chosenLetter = userAns.toUpperCase();
          const chosenIdx = ["A", "B", "C", "D"].indexOf(chosenLetter);
          const chosenText = chosenIdx >= 0 ? assembled.options[chosenIdx] : null;
          const chosenDistractor = assembled.selectedDistractors.find(
            (d) => d.text === chosenText
          ) || assembled.selectedDistractors[0];

          if (chosenDistractor) {
            banditRef.current?.recordInteractionFeedback({
              category: chosenDistractor.category,
              features: chosenDistractor.features,
              trapTriggered: true,
              latencyMs: latency,
            });
            updateTwinVulnerability(chosenDistractor.features);
            recordTwinObservation({
              skillIds: [0],
              observedScore: 0,
              modality: "mcq_bandit",
              guessingFloor: 0.25,
              latencyMs: latency,
              expectedLatencyMs: 3000,
              gazeDistractionIndex: gazeProctoring.suspiciousScore,
              cognitiveLoadIndex: gazeTelemetry.cognitiveLoadIndex,
              trapVulnerabilityVector: chosenDistractor.features,
              ieltsSkill: activeSkill,
              itemId: assembled.questionId,
            });
          }
        } else if (isCorrect) {
          const topDistractor = assembled.selectedDistractors[0];
          if (topDistractor) {
            banditRef.current?.recordInteractionFeedback({
              category: topDistractor.category,
              features: topDistractor.features,
              trapTriggered: false,
              latencyMs: latency,
            });
            recordTwinObservation({
              skillIds: [0],
              observedScore: 1,
              modality: "mcq_bandit",
              guessingFloor: 0.25,
              latencyMs: latency,
              expectedLatencyMs: 3000,
              gazeDistractionIndex: gazeProctoring.suspiciousScore,
              cognitiveLoadIndex: gazeTelemetry.cognitiveLoadIndex,
              ieltsSkill: activeSkill,
              itemId: assembled.questionId,
            });
          }
        }
      });

      const cefr = mapBandToCEFR(graded.summary.band_score);

      const attemptId = `att_${exam.id}_${activeSkill}_${Date.now()}`;
      const finishedAt = new Date().toISOString();
      const timeSpent = (activeModule.duration_minutes * 60) - secondsRemaining;

      const attemptRecord: ExamAttempt = {
        id: attemptId,
        user_id: "candidate_01",
        exam_id: exam.id,
        exam_title: exam.title,
        category: exam.category,
        skill: activeSkill,
        status: "submitted",
        started_at: new Date(Date.now() - timeSpent * 1000).toISOString(),
        finished_at: finishedAt,
        time_spent_seconds: Math.max(0, timeSpent),
        user_answers: answers,
        flagged_questions: flagged,
        raw_score: graded.summary.raw_score,
        band_score: graded.summary.band_score,
        section_scores: {
          [activeSkill]: graded.summary,
        },
        grading_results: graded.gradingResults,
        diagnostic: {
          accuracy_rate: graded.summary.accuracy_rate,
          question_type_stats: graded.questionTypeStats,
          cefr_level: cefr.level,
          cefr_description_en: cefr.descriptor_en,
          cefr_description_fa: cefr.descriptor_fa,
          recommendations: graded.recommendations,
          cdmCausalDiagnosis: graded.cdmDiagnosis,
          proctoringTelemetry: {
            integrityScore: Math.round((1 - gazeProctoring.suspiciousScore) * 100),
            cheatSuspicionLevel:
              gazeProctoring.suspiciousScore > 0.6
                ? "high"
                : gazeProctoring.suspiciousScore > 0.25
                ? "medium"
                : "low",
            gazeAwayCount: gazeProctoring.anomaliesRecorded.filter((a) => a === "looking_away").length,
            longAbsenceCount: gazeProctoring.anomaliesRecorded.filter((a) => a === "face_absent").length,
            multipleFacesDetected: gazeProctoring.multipleFaces,
            flags: gazeProctoring.anomaliesRecorded,
          },
        },
      };

      // Dual storage: resilient client-side localStorage history + optional server sync
      saveAttemptToStorage(attemptRecord);
      localStorage.removeItem(storageAttemptKey);
      try {
        fetch("/api/ielts/attempts/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attemptRecord),
        }).catch(() => {
          // Non-blocking server sync fallback
        });
      } catch {
        // Fallback silently to client storage
      }

      // Route to results analytics page
      router.push(`/ielts/results/${attemptId}`);
    } catch (err) {
      console.error("Grading submission failed", err);
      setSubmitting(false);
    }
  }, [
    exam,
    activeModule,
    activeSkill,
    answers,
    flagged,
    secondsRemaining,
    storageAttemptKey,
    router,
  ]);

  useEffect(() => {
    if (secondsRemaining === 0 && !submitting) {
      handleSubmitExam();
    }
  }, [secondsRemaining, submitting, handleSubmitExam]);

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", direction: "rtl", textAlign: "center", background: "#f8fafc" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔍</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#881337", marginBottom: "0.5rem" }}>
          آزمون آیلتس مورد نظر یافت نشد
        </h2>
        <p style={{ color: "#64748b", maxWidth: "480px", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          شناسه آزمون &quot;{examId}&quot; در بانک آزمون‌های رسمی ایندورا یافت نشد یا ممکن است تغییر یافته باشد.
        </p>
        <Link
          href="/ielts"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #be123c, #881337)",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(190, 18, 60, 0.25)"
          }}
        >
          <span>بازگشت به بانک آزمون‌های آیلتس</span>
          <span aria-hidden="true">←</span>
        </Link>
      </div>
    );
  }

  if (!exam || !activeModule) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading IELTS Examination Simulator...
      </div>
    );
  }

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentSection = activeModule.sections[activeSectionIdx] || activeModule.sections[0];

  // Font size multiplier
  const fontSizeClass =
    fontScale === "sm"
      ? "0.9rem"
      : fontScale === "lg"
      ? "1.1rem"
      : fontScale === "xl"
      ? "1.25rem"
      : "1rem";

  return (
    <div className={styles.examContainer}>
      {/* Time Alert Banner */}
      {timeAlert && (
        <div className={styles.timeAlertBanner} role="alert">
          {timeAlert}
        </div>
      )}

      {/* Top Header */}
      <header className={styles.examHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.ieltsBrandBadge}>IELTS CD</span>
          <span className={styles.examTitleText} title={exam.title}>
            {exam.title}
          </span>
          <span className={styles.sectionBadge}>
            {activeSkill === "listening" ? "🎧 Listening" : "📖 Reading"}
          </span>
        </div>

        {/* Center Live Timer */}
        <div className={styles.headerCenter}>
          <div
            className={`${styles.timerBox} ${
              secondsRemaining <= 300
                ? styles.timerCritical
                : secondsRemaining <= 600
                ? styles.timerWarning
                : ""
            }`}
          >
            <span className={styles.timerLabel}>Time Left:</span>
            <span className={styles.timerDigits}>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            className={styles.pauseBtn}
            onClick={() => setIsPaused((prev) => !prev)}
            title="Pause / Resume Timer"
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>

        {/* Right Header: Font & Submit */}
        <div className={styles.headerRight}>
          <div className={styles.fontControls} title="Adjust text size">
            <button
              type="button"
              className={`${styles.fontBtn} ${fontScale === "sm" ? styles.fontBtnActive : ""}`}
              onClick={() => setFontScale("sm")}
            >
              A-
            </button>
            <button
              type="button"
              className={`${styles.fontBtn} ${fontScale === "md" ? styles.fontBtnActive : ""}`}
              onClick={() => setFontScale("md")}
            >
              A
            </button>
            <button
              type="button"
              className={`${styles.fontBtn} ${fontScale === "lg" ? styles.fontBtnActive : ""}`}
              onClick={() => setFontScale("lg")}
            >
              A+
            </button>
            <button
              type="button"
              className={`${styles.fontBtn} ${fontScale === "xl" ? styles.fontBtnActive : ""}`}
              onClick={() => setFontScale("xl")}
            >
              A++
            </button>
          </div>

          <button
            type="button"
            className={`${styles.highlightToggleBtn} ${
              highlighterActive ? styles.highlightToggleBtnActive : ""
            }`}
            onClick={() => setHighlighterActive((prev) => !prev)}
            title="Toggle text highlighter"
          >
            ✏️ Highlight
          </button>

          <button
            type="button"
            className={styles.submitExamBtn}
            onClick={() => setShowSubmitModal(true)}
          >
            Submit Test ➔
          </button>
        </div>
      </header>

      {/* Listening Audio Banner */}
      {activeSkill === "listening" && (
        <section className={styles.audioBanner} aria-label="Audio Controls">
          <audio
            ref={audioRef}
            src={computedAudioUrl || activeModule.audio_url || "/audio/ielts/c18_test1_listening.mp3"}
            preload="metadata"
            onTimeUpdate={() => {
              if (audioRef.current) {
                setAudioCurrentTime(audioRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setAudioDuration(audioRef.current.duration);
              }
              setAudioLoading(false);
            }}
            onWaiting={() => setAudioLoading(true)}
            onPlaying={() => {
              setAudioLoading(false);
              setAudioPlaying(true);
            }}
            onError={() => {
              const el = audioRef.current;
              if (!el) return;
              const filename =
                (computedAudioUrl || activeModule?.audio_url || "c18_test1_listening.mp3")
                  .split("/")
                  .pop() || "c18_test1_listening.mp3";
              const githubUrl = `https://raw.githubusercontent.com/SajadZare11/ielts-listening/main/audio/${filename}`;
              if (!el.src.includes("raw.githubusercontent.com")) {
                el.src = githubUrl;
                el.load();
              } else {
                setAudioLoading(false);
                setAudioPlaying(false);
                setAudioError("خطا در بارگذاری منبع صوتی.");
              }
            }}
            onEnded={() => setAudioPlaying(false)}
          />

          <div className={styles.audioControlsGroup}>
            <button
              type="button"
              className={styles.audioPlayBtn}
              onClick={togglePlayAudio}
              disabled={audioLoading}
            >
              {audioLoading
                ? "⏳ در حال بارگذاری صوت..."
                : audioPlaying
                ? "⏸ توقف صوت (Pause)"
                : "▶ پخش صوت شنیداری (Play Audio)"}
            </button>

            <span className={styles.audioTimeText}>
              {formatTime(Math.floor(audioCurrentTime))} / {formatTime(Math.floor(audioDuration || 1800))}
            </span>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
              <span>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className={styles.volumeSlider}
              />
            </label>
          </div>

          <span className={styles.audioNote}>
            📢 Notice: In official IELTS Listening, audio is played once only. Adjust volume before starting.
          </span>
        </section>
      )}

      {/* Section / Passage Selector Bar */}
      <nav className={styles.sectionTabsBar} aria-label="Passage Selector">
        {activeModule.sections.map((sec, idx) => (
          <button
            key={sec.id}
            type="button"
            className={`${styles.sectionTabBtn} ${
              activeSectionIdx === idx ? styles.sectionTabBtnActive : ""
            }`}
            onClick={() => {
              setActiveSectionIdx(idx);
              if (sec.questions.length > 0) {
                setActiveQuestionNum(sec.questions[0].question_number);
              }
            }}
          >
            {activeSkill === "reading"
              ? `Passage ${sec.section_number}`
              : `Section ${sec.section_number}`}
          </button>
        ))}
      </nav>

      {/* Resizable Split-Screen Workspace */}
      <div className={styles.splitScreenArea} style={{ fontSize: fontSizeClass }}>
        {/* Left Pane: Reading Passage or Listening Context */}
        <div
          className={styles.passagePane}
          style={{ width: `${splitWidth}%` }}
          onMouseUp={() => {
            if (highlighterActive) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const passageEl = document.getElementById("ielts-passage-body");
                if (passageEl && passageEl.contains(range.commonAncestorContainer)) {
                  try {
                    const mark = document.createElement("mark");
                    mark.style.backgroundColor = "#fef08a";
                    mark.style.color = "#1e293b";
                    mark.style.padding = "2px 4px";
                    mark.style.borderRadius = "3px";
                    mark.className = "ielts-user-highlight";
                    range.surroundContents(mark);
                    selection.removeAllRanges();
                  } catch {
                    // Cross-node selection fallback
                  }
                }
              }
            }
          }}
        >
          <h2 className={styles.passageTitle}>{currentSection.passage_title}</h2>
          <div
            id="ielts-passage-body"
            className={styles.passageBody}
            dangerouslySetInnerHTML={{ __html: currentSection.passage_content }}
          />
        </div>

        {/* Resizer Handle */}
        <div
          className={`${styles.resizerBar} ${isDraggingResizer ? styles.resizerBarActive : ""}`}
          onMouseDown={() => setIsDraggingResizer(true)}
          title="Drag to resize panes"
        >
          <div className={styles.resizerIndicator} />
        </div>

        {/* Right Pane: Interactive Questions */}
        <div className={styles.questionsPane}>
          {currentSection.instructions && (
            <div className={styles.instructionsBox}>
              {currentSection.instructions}
            </div>
          )}

          {currentSection.questions.map((q) => {
            const isFlagged = flagged.includes(q.question_number);
            const userAns = answers[q.question_number];

            return (
              <div
                key={q.id}
                id={`q-item-${q.question_number}`}
                className={`${styles.questionCard} ${
                  activeQuestionNum === q.question_number ? styles.questionCardActive : ""
                }`}
                onClick={() => setActiveQuestionNum(q.question_number)}
              >
                <div className={styles.questionHeader}>
                  <span className={styles.questionNumberBadge}>
                    Question {q.question_number}
                  </span>
                  <label className={styles.flagCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={isFlagged}
                      onChange={() => toggleFlagQuestion(q.question_number)}
                    />
                    <span>{isFlagged ? "🚩 Flagged" : "Review Later"}</span>
                  </label>
                </div>

                {/* Question Prompt */}
                <div className={styles.questionPrompt}>
                  {q.question_type === "fill_in_the_blank" ? (
                    // Inline Fill in the blank
                    <div>
                      {q.prompt.split(/(\[blank_\d+\])/g).map((chunk, idx) => {
                        if (/\[blank_\d+\]/.test(chunk)) {
                          return (
                            <input
                              key={idx}
                              type="text"
                              className={styles.inlineBlankInput}
                              placeholder="Type answer..."
                              value={(userAns as string) || ""}
                              onChange={(e) =>
                                handleAnswerChange(q.question_number, e.target.value)
                              }
                            />
                          );
                        }
                        return <span key={idx}>{chunk}</span>;
                      })}
                    </div>
                  ) : (
                    <span>{q.prompt}</span>
                  )}
                </div>

                {/* Interactive Answer Inputs by Type */}
                {q.question_type === "multiple_choice" && (
                  (() => {
                    const assembled = getOrAssembleAdaptiveQuestion(q);
                    const renderOptions = assembled
                      ? assembled.options.map((optText, idx) => ({
                          id: ["A", "B", "C", "D"][idx],
                          text: optText,
                        }))
                      : (q.options || []).map((opt) => ({
                          id: typeof opt === "string" ? (opt.includes(")") ? opt.split(")")[0].trim() : opt.slice(0, 1)) : opt.id,
                          text: typeof opt === "string" ? (opt.includes(")") ? opt.split(")").slice(1).join(")").trim() : opt) : opt.text,
                        }));

                    return (
                      <div className={styles.optionsList}>
                        {renderOptions.map((opt) => {
                          const optId = opt.id;
                          const optText = opt.text;
                          const isSelected = userAns === optId;

                          return (
                            <label
                              key={optId}
                              className={`${styles.optionLabel} ${
                                isSelected ? styles.optionLabelSelected : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${q.question_number}`}
                                value={optId}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(q.question_number, optId)}
                              />
                              <span>
                                <strong>{optId}.</strong> {optText}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    );
                  })()
                )}

                {q.question_type === "multiple_choice_multiple_answers" && q.options && (
                  <div className={styles.optionsList}>
                    {q.options.map((opt) => {
                      const optId = typeof opt === "string" ? opt : opt.id;
                      const optText = typeof opt === "string" ? opt : opt.text;
                      const arr = Array.isArray(userAns) ? userAns : [];
                      const isSelected = arr.includes(optId);

                      return (
                        <label
                          key={optId}
                          className={`${styles.optionLabel} ${
                            isSelected ? styles.optionLabelSelected : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={optId}
                            checked={isSelected}
                            onChange={(e) => {
                              const newArr = e.target.checked
                                ? [...arr, optId]
                                : arr.filter((x) => x !== optId);
                              handleAnswerChange(q.question_number, newArr);
                            }}
                          />
                          <span>
                            <strong>{optId}.</strong> {optText}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "true_false_not_given" && (
                  <div className={styles.toggleThreeState}>
                    {["True", "False", "Not Given"].map((val) => {
                      const isSelected =
                        typeof userAns === "string" &&
                        userAns.toLowerCase() === val.toLowerCase();

                      return (
                        <button
                          key={val}
                          type="button"
                          className={`${styles.toggleBtn} ${
                            isSelected ? styles.toggleBtnActive : ""
                          }`}
                          onClick={() => handleAnswerChange(q.question_number, val)}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "yes_no_not_given" && (
                  <div className={styles.toggleThreeState}>
                    {["Yes", "No", "Not Given"].map((val) => {
                      const isSelected =
                        typeof userAns === "string" &&
                        userAns.toLowerCase() === val.toLowerCase();

                      return (
                        <button
                          key={val}
                          type="button"
                          className={`${styles.toggleBtn} ${
                            isSelected ? styles.toggleBtnActive : ""
                          }`}
                          onClick={() => handleAnswerChange(q.question_number, val)}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}

                {(q.question_type === "matching_headings" ||
                  q.question_type === "matching_features") &&
                  q.options && (
                    <select
                      className={styles.selectDropdown}
                      value={(userAns as string) || ""}
                      onChange={(e) =>
                        handleAnswerChange(q.question_number, e.target.value)
                      }
                    >
                      <option value="">-- Choose matching option --</option>
                      {q.options.map((opt) => {
                        const optId = typeof opt === "string" ? opt : opt.id;
                        const optText = typeof opt === "string" ? opt : opt.text;
                        return (
                          <option key={optId} value={optId}>
                            {optId}: {optText}
                          </option>
                        );
                      })}
                    </select>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Examination Navigation Ribbon */}
      <footer className={styles.examFooter}>
        <div className={styles.footerLeft}>
          <span className={styles.flagSummaryBadge}>
            🚩 {flagged.length} Flagged
          </span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Answered: {answeredCount} / {allQuestions.length}
          </span>
        </div>

        {/* 1..40 Pagination Grid */}
        <div className={styles.footerCenter}>
          {allQuestions.map((q: IeltsQuestion) => {
            const hasAns =
              answers[q.question_number] !== undefined &&
              answers[q.question_number] !== "";
            const isFlag = flagged.includes(q.question_number);
            const isActive = activeQuestionNum === q.question_number;

            return (
              <button
                key={q.id}
                type="button"
                className={`${styles.qNumBtn} ${
                  hasAns ? styles.qNumAnswered : ""
                } ${isFlag ? styles.qNumFlagged : ""} ${
                  isActive ? styles.qNumActive : ""
                }`}
                onClick={() => jumpToQuestion(q.question_number)}
                title={`Question ${q.question_number} ${
                  hasAns ? "(Answered)" : "(Unanswered)"
                }`}
              >
                {q.question_number}
              </button>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <div className={styles.footerRight}>
          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={() => {
              if (activeQuestionNum > 1) {
                jumpToQuestion(activeQuestionNum - 1);
              }
            }}
            disabled={activeQuestionNum <= 1}
          >
            ◀ Back
          </button>
          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={() => {
              if (activeQuestionNum < allQuestions.length) {
                jumpToQuestion(activeQuestionNum + 1);
              }
            }}
            disabled={activeQuestionNum >= allQuestions.length}
          >
            Next ▶
          </button>
        </div>
      </footer>

      {/* Submission Warning Modal */}
      {showSubmitModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <h3 className={styles.modalTitle}>تأیید پایان و ثبت آزمون</h3>
            <p className={styles.modalMessage}>
              آیا از پایان آزمون و ثبت نهایی پاسخ‌های خود اطمینان دارید؟ پس از ثبت، کارنامه تشخیصی و نمره باند رسمی شما بلافاصله صادر خواهد شد.
            </p>

            <div className={styles.modalStatsGrid}>
              <div className={styles.modalStatCard}>
                <div className={styles.modalStatNum}>{answeredCount}</div>
                <div className={styles.modalStatLabel}>پاسخ داده شده</div>
              </div>
              <div className={styles.modalStatCard}>
                <div
                  className={styles.modalStatNum}
                  style={{ color: unansweredCount > 0 ? "#dc2626" : "#16a34a" }}
                >
                  {unansweredCount}
                </div>
                <div className={styles.modalStatLabel}>بی‌پاسخ (رها شده)</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#991b1b",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  marginBottom: "20px",
                }}
              >
                ⚠️ شما {unansweredCount} سوال بی‌پاسخ دارید. در آزمون آیلتس نمره منفی وجود ندارد؛ پیشنهاد می‌شود به تمامی سوالات پاسخ دهید.
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                ادامه آزمون
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleSubmitExam}
                disabled={submitting}
              >
                {submitting ? "در حال تصحیح..." : "ثبت نهایی و دریافت کارنامه ➔"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
