"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { Tamrin20Question } from "@endoora/contracts";
import { evaluateAnswer, type Tamrin20EvaluationResult } from "@/lib/tamrin20-data";
import { Tamrin20AudioPlayer } from "./Tamrin20AudioPlayer";
import styles from "./tamrin20.module.css";

export interface Tamrin20QuestionCardProps {
  question: Tamrin20Question;
  questionNumber: number;
  userAnswer?: string | number | null;
  onAnswer?: (
    questionId: string,
    answer: string | number,
    isCorrect: boolean,
    timeSeconds: number
  ) => void;
  disabled?: boolean;
  className?: string;
  hideAudio?: boolean;
}

export const Tamrin20QuestionCard: React.FC<Tamrin20QuestionCardProps> = ({
  question,
  questionNumber,
  userAnswer = null,
  onAnswer,
  disabled = false,
  className,
  hideAudio = false,
}) => {
  // Free text input state
  const [textInput, setTextInput] = useState<string>(() => {
    if (typeof userAnswer === "string") return userAnswer;
    return "";
  });

  // Local answer submitted by user in this component
  const [localAnswer, setLocalAnswer] = useState<string | number | null>(null);

  // Active answer is prop userAnswer if provided, otherwise locally chosen answer
  const activeAnswer = userAnswer !== null && userAnswer !== undefined ? userAnswer : localAnswer;
  const selectedAnswer = activeAnswer;

  // Derive evaluation directly during render (no setState in effect needed!)
  const evaluation = useMemo<Tamrin20EvaluationResult | null>(() => {
    if (activeAnswer === null || activeAnswer === undefined) return null;
    return evaluateAnswer(question, activeAnswer);
  }, [question, activeAnswer]);

  // Track user-controlled toggle state for explanation
  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);

  // Explanation is open if user toggled it open, or automatically open if incorrect
  const isExplanationOpen = useMemo(() => {
    if (userToggledOpen !== null) return userToggledOpen;
    if (evaluation) return evaluation.isExplanationOpen;
    return false;
  }, [userToggledOpen, evaluation]);

  // Track start time safely via effect (not during render!)
  const startTimeRef = useRef<number>(0);
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Handle option selection (MCQ / choices)
  const handleSelectOption = useCallback(
    (optionIndex: number, optionText: string) => {
      if (evaluation !== null || disabled) return;

      const start = startTimeRef.current || Date.now();
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - start) / 1000));

      const answerToEvaluate = typeof question.correctAnswer === "number" ? optionIndex : optionText;
      const evalRes = evaluateAnswer(question, answerToEvaluate);

      setLocalAnswer(answerToEvaluate);
      setUserToggledOpen(evalRes.isExplanationOpen);

      onAnswer?.(question.id, answerToEvaluate, evalRes.isCorrect, timeSpentSeconds);
    },
    [evaluation, disabled, question, onAnswer]
  );

  // Handle free text submission
  const handleTextSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const trimmed = textInput.trim();
      if (!trimmed || evaluation !== null || disabled) return;

      const start = startTimeRef.current || Date.now();
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - start) / 1000));
      const evalRes = evaluateAnswer(question, trimmed);

      setLocalAnswer(trimmed);
      setUserToggledOpen(evalRes.isExplanationOpen);

      onAnswer?.(question.id, trimmed, evalRes.isCorrect, timeSpentSeconds);
    },
    [textInput, evaluation, disabled, question, onAnswer]
  );

  // Toggle supplementary explanation
  const toggleExplanation = () => {
    setUserToggledOpen((prev) => (prev !== null ? !prev : !evaluation?.isExplanationOpen));
  };

  // Determine card styling based on evaluation state
  let cardStateClass = "";
  if (evaluation) {
    cardStateClass = evaluation.isCorrect
      ? styles.questionCardCorrect
      : styles.questionCardIncorrect;
  }

  const containerClasses = [styles.questionCard, cardStateClass, className]
    .filter(Boolean)
    .join(" ");

  const hasOptions = Array.isArray(question.options) && question.options.length > 0;
  const isAnswered = evaluation !== null;

  return (
    <article className={containerClasses} id={`question-${question.id}`}>
      {/* Question Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.questionNumberBadge}>
          <span>سوال {questionNumber}</span>
          {question.examPeriod && question.skill !== "listening" && (
            <span className={styles.badgeExam} title="دوره برگزاری آزمون نهایی">
              {question.examPeriod}
            </span>
          )}
          {question.tag && (
            <span className={styles.badge} title="سرفصل آموزشی">
              {question.tag}
            </span>
          )}
        </div>

        <div className={styles.headerBadges}>
          {evaluation && evaluation.isCorrect && (
            <span className={styles.badgeSuccess} role="status">
              ✓ پاسخ درست
            </span>
          )}
          {evaluation && !evaluation.isCorrect && (
            <span className={styles.badgeError} role="status">
              ✗ نیاز به مرور
            </span>
          )}
        </div>
      </div>

      {/* Reading Passage Context (if present - hidden for listening so as not to spoil answers) */}
      {question.passage && question.skill !== "listening" && (
        <div className={styles.passageContainer}>
          <div className={styles.passageHeader}>
            <span>متن درک مطلب (Reading Passage)</span>
          </div>
          <div className={styles.passageBody} dir="ltr">
            {question.passage}
          </div>
        </div>
      )}

      {/* Listening Audio Clip Player (if present and not hidden by grouped section) */}
      {question.audioUrl && !hideAudio && (
        <Tamrin20AudioPlayer
          src={question.audioUrl}
          title={question.promptFa || question.prompt}
          timestamps={question.audioTimestamps}
        />
      )}

      {/* Prompt Area */}
      <div className={styles.promptContainer}>
        <div className={styles.promptEn} dir="ltr">
          {question.prompt}
        </div>
        {question.promptFa && (
          <div className={styles.promptFa}>{question.promptFa}</div>
        )}
      </div>

      {/* Question Interaction Area */}
      {hasOptions ? (
        /* Options Grid (MCQ / Choice based) */
        <div className={styles.optionsGrid} role="radiogroup" aria-label="گزینه‌های پاسخ">
          {question.options?.map((option, idx) => {
            const isSelected =
              selectedAnswer === idx ||
              selectedAnswer === option ||
              (typeof selectedAnswer === "string" && selectedAnswer.toLowerCase() === option.toLowerCase());

            let optionClass = styles.optionButton;
            if (isSelected) {
              optionClass = `${optionClass} ${styles.optionSelected}`;
            }

            if (isAnswered) {
              if (isSelected && evaluation.isCorrect) {
                optionClass = `${optionClass} ${styles.optionCorrect}`;
              } else if (isSelected && !evaluation.isCorrect) {
                optionClass = `${optionClass} ${styles.optionIncorrect}`;
              } else if (!evaluation.isCorrect) {
                // Auto-reveal the correct option in green
                const isThisOptionCorrect =
                  typeof question.correctAnswer === "number"
                    ? question.correctAnswer === idx
                    : question.correctAnswer.toLowerCase() === option.toLowerCase();
                if (isThisOptionCorrect) {
                  optionClass = `${optionClass} ${styles.optionRevealed}`;
                }
              }
            }

            // Option prefix letters (A, B, C, D)
            const optionLetters = ["A", "B", "C", "D", "E", "F"];
            const letter = optionLetters[idx] || String(idx + 1);

            return (
              <button
                key={`${question.id}-opt-${idx}`}
                type="button"
                className={optionClass}
                onClick={() => handleSelectOption(idx, option)}
                disabled={isAnswered || disabled}
                aria-checked={isSelected}
                role="radio"
              >
                <span className={styles.optionIndexBadge}>{letter}</span>
                <span className={styles.optionText}>{option}</span>
                {isAnswered && isSelected && evaluation.isCorrect && (
                  <span aria-hidden="true">✓</span>
                )}
                {isAnswered && isSelected && !evaluation.isCorrect && (
                  <span aria-hidden="true">✗</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Free Text Input (Fill-in-the-blank, Cloze, Matching, Sentence combining) */
        <div>
          <form className={styles.inputForm} onSubmit={handleTextSubmit}>
            <input
              type="text"
              className={`${styles.textInput} ${
                isAnswered
                  ? evaluation.isCorrect
                    ? styles.textInputCorrect
                    : styles.textInputIncorrect
                  : ""
              }`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="پاسخ خود را بنویسید (Write your answer)..."
              disabled={isAnswered || disabled}
              dir="ltr"
              aria-label="پاسخ سوال"
            />
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isAnswered || disabled || textInput.trim().length === 0}
            >
              ثبت پاسخ
            </button>
          </form>

          {/* Auto-revealed answer for incorrect text answers */}
          {isAnswered && !evaluation.isCorrect && evaluation.revealedAnswerText && (
            <div className={styles.revealedAnswerBox}>
              <span>پاسخ صحیح استاندارد:</span>
              <span className={styles.revealedAnswerContent}>
                {evaluation.revealedAnswerText}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Instant Feedback & Pedagogical Explanation Accordion (R3) */}
      {isAnswered && (
        <div className={styles.explanationSection}>
          {evaluation.isCorrect ? (
            /* Correct Answer: Toggle Button «توضیحات تکمیلی» */
            <button
              type="button"
              className={styles.explanationToggleBtn}
              onClick={toggleExplanation}
              aria-expanded={isExplanationOpen}
            >
              <span>{isExplanationOpen ? "بستن توضیحات تکمیلی" : "توضیحات تکمیلی"}</span>
              <span aria-hidden="true">{isExplanationOpen ? "▲" : "▼"}</span>
            </button>
          ) : (
            /* Incorrect Answer: Prominent Educational Explanation Header */
            <div className={styles.explanationHeader}>
              <span>تحلیل تشریحی و نکته آموزشی</span>
            </div>
          )}

          {/* Expanded Explanation Content */}
          {isExplanationOpen && question.explanation && (
            <div className={styles.explanationBox} role="region" aria-label="توضیحات آموزشی">
              {/* Audio Transcript (for listening skill, shown only after answering) */}
              {question.skill === "listening" && question.passage && (
                <div className={styles.transcriptBox}>
                  <div className={styles.transcriptHeader}>
                    <span aria-hidden="true">🎧</span>
                    <span>متن فایل صوتی (Audio Transcript):</span>
                  </div>
                  <div className={styles.transcriptBody} dir="ltr">
                    {question.passage}
                  </div>
                </div>
              )}
              {question.explanation.briefFa && (
                <div className={styles.explanationBrief}>
                  {question.explanation.briefFa}
                </div>
              )}
              {question.explanation.detailedFa && (
                <div className={styles.explanationDetailed}>
                  {question.explanation.detailedFa}
                </div>
              )}
              {question.explanation.pedagogicalRuleFa && (
                <div className={styles.pedagogicalRule}>
                  <span>📌 نکته کتاب درسی: </span>
                  <span>{question.explanation.pedagogicalRuleFa}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
