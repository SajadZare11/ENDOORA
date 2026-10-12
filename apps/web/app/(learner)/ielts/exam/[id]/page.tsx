'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getIeltsExamById } from "@/data/ielts/index.ts";
import { gradeExamModule, mapBandToCEFR } from "@/lib/ielts-grading.ts";
import { saveAttemptToStorage, loadAttemptFromStorage } from "@/lib/ielts-state.ts";
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
  const [activeSkill, setActiveSkill] = useState<IeltsSkill>("reading");
  const [activeModule, setActiveModule] = useState<IeltsModule | null>(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeQuestionNum, setActiveQuestionNum] = useState(1);

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
      return;
    }
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

  // Audio Playback
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {});
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
        },
      };

      // Save to client-side localStorage history
      saveAttemptToStorage(attemptRecord);
      localStorage.removeItem(storageAttemptKey);

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
          {activeModule.audio_url && (
            <audio
              ref={audioRef}
              src={activeModule.audio_url}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  setAudioCurrentTime(audioRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setAudioDuration(audioRef.current.duration);
                }
              }}
              onEnded={() => setAudioPlaying(false)}
            />
          )}

          <div className={styles.audioControlsGroup}>
            <button
              type="button"
              className={styles.audioPlayBtn}
              onClick={togglePlayAudio}
            >
              {audioPlaying ? "⏸ Pause Audio" : "▶ Play Audio"}
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
              if (selection && selection.toString().trim() !== "") {
                // Highlighter visual tool feedback
              }
            }
          }}
        >
          <h2 className={styles.passageTitle}>{currentSection.passage_title}</h2>
          <div
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
                {q.question_type === "multiple_choice" && q.options && (
                  <div className={styles.optionsList}>
                    {q.options.map((opt) => {
                      const optId = typeof opt === "string" ? opt : opt.id;
                      const optText = typeof opt === "string" ? opt : opt.text;
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
