"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import type {
  Tamrin20LessonData,
  Tamrin20Skill,
  Tamrin20SkillBatch,
  Tamrin20ProgressRecord,
} from "@endoora/contracts";
import {
  getVisibleQuestions,
  createDefaultProgressRecord,
  recordQuestionAttempt,
  deserializeProgress,
  STORAGE_KEY_PROGRESS,
  SKILL_TITLES_FA,
  SKILL_TITLES_EN,
  getTamrin20GitHubPageUrl,
  getTamrin20TrackId,
} from "@/lib/tamrin20-data";
import { Tamrin20QuestionCard } from "./Tamrin20QuestionCard";
import { Tamrin20AudioPlayer } from "./Tamrin20AudioPlayer";
import styles from "./tamrin20.module.css";

export interface Tamrin20PlayerProps {
  lesson: Tamrin20LessonData;
  skill: Tamrin20Skill;
  batch?: Tamrin20SkillBatch;
  initialExpanded?: boolean;
  onProgressUpdate?: (record: Tamrin20ProgressRecord) => void;
  className?: string;
}

interface AnswerEntry {
  answer: string | number;
  isCorrect: boolean;
  timeSeconds: number;
}

export const Tamrin20Player: React.FC<Tamrin20PlayerProps> = ({
  lesson,
  skill,
  batch: propBatch,
  initialExpanded = false,
  onProgressUpdate,
  className,
}) => {
  // Resolve skill batch from lesson data or prop
  const batch = useMemo<Tamrin20SkillBatch>(() => {
    return propBatch ?? lesson.skills[skill];
  }, [propBatch, lesson, skill]);

  // Progressive loading expansion state
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);

  // Map of questionId -> user answer record
  const [userAnswers, setUserAnswers] = useState<Record<string, AnswerEntry>>({});

  // Local storage progress record
  const [, setProgressRecord] = useState<Tamrin20ProgressRecord>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY_PROGRESS);
        if (saved) return deserializeProgress(saved);
      } catch {
        // Fallback
      }
    }
    return createDefaultProgressRecord();
  });

  // Compute visible questions slice (initial 20 or expanded to full bank)
  const visibleQuestions = useMemo(() => {
    if (!batch || !Array.isArray(batch.questions)) return [];
    return getVisibleQuestions(batch.questions, isExpanded);
  }, [batch, isExpanded]);

  // Calculate real-time stats
  const answeredCount = useMemo(() => {
    return visibleQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  }, [visibleQuestions, userAnswers]);

  const correctCount = useMemo(() => {
    return visibleQuestions.filter((q) => userAnswers[q.id]?.isCorrect).length;
  }, [visibleQuestions, userAnswers]);

  const accuracyPercent = useMemo(() => {
    if (answeredCount === 0) return 0;
    return Math.round((correctCount / answeredCount) * 100);
  }, [answeredCount, correctCount]);

  const progressPercent = useMemo(() => {
    if (visibleQuestions.length === 0) return 0;
    return Math.round((answeredCount / visibleQuestions.length) * 100);
  }, [answeredCount, visibleQuestions.length]);

  // Group listening questions into sections of 4 related questions with a shared audio player
  const listeningSections = useMemo(() => {
    if (skill !== "listening") return [];

    const sections: {
      sectionIndex: number;
      audioUrl?: string;
      audioTimestamps?: { startSeconds: number; endSeconds: number };
      titleFa: string;
      descriptionFa: string;
      questions: { question: (typeof visibleQuestions)[0]; globalIndex: number }[];
    }[] = [];

    let currentSection: (typeof sections)[0] | null = null;

    visibleQuestions.forEach((q, idx) => {
      const qStart = q.audioTimestamps?.startSeconds ?? 0;
      const sameAudio =
        currentSection &&
        currentSection.audioUrl === q.audioUrl &&
        (currentSection.audioTimestamps?.startSeconds ?? 0) === qStart &&
        currentSection.questions.length < 4;

      if (!sameAudio) {
        const nextIdx = sections.length + 1;
        currentSection = {
          sectionIndex: nextIdx,
          audioUrl: q.audioUrl,
          audioTimestamps: q.audioTimestamps,
          titleFa: `بخش شنیداری ${nextIdx}`,
          descriptionFa:
            "به فایل صوتی زیر با دقت گوش دهید، سپس به ۴ سوال مرتبط با آن پاسخ دهید:",
          questions: [],
        };
        sections.push(currentSection);
      }

      if (currentSection) {
        currentSection.questions.push({
          question: q,
          globalIndex: idx + 1,
        });
      }
    });

    return sections;
  }, [skill, visibleQuestions]);

  // Handle answering a question
  const handleAnswerQuestion = useCallback(
    (questionId: string, answer: string | number, isCorrect: boolean, timeSeconds: number) => {
      // Update local state map (preserving all other answers)
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: { answer, isCorrect, timeSeconds },
      }));

      // Find question tag
      const targetQuestion = batch?.questions.find((q) => q.id === questionId);
      const tag = targetQuestion?.tag;

      // Update progress record and sync to localStorage
      setProgressRecord((prevRecord) => {
        const nextRecord = recordQuestionAttempt(prevRecord, {
          lesson: lesson.lesson,
          skill,
          questionId,
          isCorrect,
          timeSeconds,
          tag,
        });

        try {
          if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(nextRecord));
          }
        } catch {
          // Graceful fallback
        }

        onProgressUpdate?.(nextRecord);
        return nextRecord;
      });
    },
    [batch, lesson.lesson, skill, onProgressUpdate]
  );

  // Expand questions slice to full bank without wiping existing answers
  const handleExpandQuestions = () => {
    setIsExpanded(true);
  };

  const remainingQuestionsCount = Math.max(0, batch.totalQuestions - 20);
  const skillTitleFa = SKILL_TITLES_FA[skill] || batch.skillTitleFa;
  const skillTitleEn = SKILL_TITLES_EN[skill] || batch.skillTitleEn;

  const containerClasses = [styles.container, className].filter(Boolean).join(" ");

  return (
    <main className={containerClasses}>
      {/* Breadcrumb Navigation Trail */}
      <nav className={styles.breadcrumbs} aria-label="مسیر راهنما">
        <Link href="/">خانه</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/high-school">زبان دبیرستان</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/high-school/grade-12">پایه دوازدهم (Vision 3)</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <Link href="/high-school/grade-12/tamrin20">تمرین تا ۲۰</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span aria-current="page">
          درس {lesson.lesson}: {skillTitleFa}
        </span>
      </nav>

      {/* Sticky Header with Title, Badges, and Real-Time Progress Bar */}
      <header className={styles.headerSticky}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>
              درس {lesson.lesson}: {lesson.titleFa}
              <span className={styles.titleEn}>— {skillTitleEn}</span>
            </h1>
          </div>

          <div className={styles.lessonMeta}>
            <span className={styles.badge}>
              {skillTitleFa} ({skillTitleEn})
            </span>
            <span className={styles.badge}>
              {visibleQuestions.length} از {batch.totalQuestions} سوال
            </span>
          </div>
        </div>

        {/* Real-time score and answer tracking */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span>پاسخ داده شده: </span>
            <span className={styles.statValue}>
              {answeredCount} از {visibleQuestions.length}
            </span>
          </div>

          <div className={styles.statItem}>
            <span>پاسخ درست: </span>
            <span className={styles.statValue}>
              {correctCount} ({accuracyPercent}٪)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className={styles.progressBarContainer}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="درصد پیشرفت حل سوالات"
        >
          <div
            className={styles.progressBarFill}
            style={{ inlineSize: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Questions List */}
      {skill === "listening" ? (
        <section className={styles.listeningSectionsWrapper} aria-label="بخش‌های مهارت شنیداری">
          {listeningSections.map((section) => (
            <div key={`section-${section.sectionIndex}`} className={styles.listeningSectionCard}>
              <div className={styles.listeningSectionHeader}>
                <div className={styles.listeningSectionBadgeRow}>
                  <span className={styles.listeningSectionBadge}>
                    🎧 {section.titleFa}
                  </span>
                  <span className={styles.listeningSectionCountBadge}>
                    سوالات {section.questions[0]?.globalIndex} تا {section.questions[section.questions.length - 1]?.globalIndex}
                  </span>
                  {section.audioUrl && (
                    <a
                      href={getTamrin20GitHubPageUrl(section.audioUrl) ?? "https://sajadzare11.github.io/vision3-listening/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.listeningSourceBadge}
                      title="پخش آنلاین و دانلود در سامانه شنیداری گیت‌هاب"
                      aria-label="پخش آنلاین در سامانه شنیداری گیت‌هاب"
                    >
                      <span>🌐</span>
                      <span>منبع صوت: گیت‌هاب {getTamrin20TrackId(section.audioUrl) ? `(${getTamrin20TrackId(section.audioUrl)})` : ""}</span>
                    </a>
                  )}
                </div>
                <p className={styles.listeningSectionDesc}>
                  {section.descriptionFa}
                </p>
                {section.audioUrl && (
                  <Tamrin20AudioPlayer
                    src={section.audioUrl}
                    title={section.titleFa}
                    timestamps={section.audioTimestamps}
                    className={styles.listeningSectionPlayer}
                  />
                )}
              </div>

              <div className={styles.listeningSectionQuestions}>
                {section.questions.map(({ question: q, globalIndex }) => (
                  <Tamrin20QuestionCard
                    key={q.id}
                    question={q}
                    questionNumber={globalIndex}
                    userAnswer={userAnswers[q.id]?.answer ?? null}
                    onAnswer={handleAnswerQuestion}
                    hideAudio={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        /* Standard Questions List for Other Skills */
        <section className={styles.questionList} aria-label="فهرست سوالات امتحان نهایی">
          {visibleQuestions.map((q, idx) => (
            <Tamrin20QuestionCard
              key={q.id}
              question={q}
              questionNumber={idx + 1}
              userAnswer={userAnswers[q.id]?.answer ?? null}
              onAnswer={handleAnswerQuestion}
            />
          ))}
        </section>
      )}

      {/* Progressive Loading Section («مایل به حل بیشتر سوال هستم») */}
      <div className={styles.progressiveLoadSection}>
        {!isExpanded && remainingQuestionsCount > 0 ? (
          <>
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={handleExpandQuestions}
              aria-label={`بارگذاری ${remainingQuestionsCount} سوال دیگر این مهارت`}
            >
              <span>مایل به حل بیشتر سوال هستم</span>
              <span className={styles.loadMoreBadge}>
                +{remainingQuestionsCount} سوال دیگر
              </span>
            </button>
            <p className={styles.loadMoreHint}>
              شما در حال حاضر ۲۰ سوال اولیه و پرتکرار را مشاهده می‌کنید. با کلیک بر روی این دکمه،
              تمام {batch.totalQuestions} سوال نهایی این مبحث بدون از دست رفتن پاسخ‌های قبلی بارگذاری
              می‌شوند.
            </p>
          </>
        ) : (
          <div className={styles.allQuestionsLoadedCard}>
            <span aria-hidden="true">✓</span>
            <span>
              تمامی {batch.totalQuestions} سوال استاندارد امتحان نهایی برای مهارت {skillTitleFa} بارگذاری شده است.
            </span>
          </div>
        )}
      </div>
    </main>
  );
};
