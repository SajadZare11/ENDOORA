"use client";

import React from "react";
import styles from "./exam.module.css";
import type { ExamQuestionItem } from "../../lib/online-exams";
import { McqQuestion } from "./McqQuestion";
import { ClozeQuestion } from "./ClozeQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { OrderingQuestion } from "./OrderingQuestion";
import { ListeningPlayer } from "./ListeningPlayer";
import { SpeakingRecorder } from "./SpeakingRecorder";
import { EssayEditor } from "./EssayEditor";

interface ExamQuestionRendererProps {
  question: ExamQuestionItem;
  questionNumber: number;
  totalQuestions: number;
  response: Record<string, unknown> | undefined;
  onResponseChange: (val: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function ExamQuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  response = {},
  onResponseChange,
  disabled = false,
}: ExamQuestionRendererProps) {
  const qType = question.question_type || "mcq";
  const payload = question.learner_payload || {};

  const typeLabels: Record<string, string> = {
    mcq: "چهارگزینه‌ای تک‌جوابی",
    multi_select: "چندگزینه‌ای چندجوابی",
    gap: "تکمیل جای خالی (Cloze)",
    short_answer: "پاسخ کوتاه",
    matching: "تطبیق موارد",
    ordering: "مرتب‌سازی عبارات",
    audio: "درک شنیداری (Listening)",
    speaking: "آزمون گفتاری (Speaking)",
    long_writing: "نگارش انشا (Writing)",
  };

  return (
    <div className={styles.questionCard}>
      {/* Question Header Meta */}
      <div className={styles.questionMetaRow}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#1e293b" }}>
            سوال {questionNumber} از {totalQuestions}
          </span>
          <span className={styles.questionBadge}>
            {typeLabels[qType] || qType}
          </span>
          {question.cefr_level && (
            <span style={{ background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 700 }}>
              CEFR: {question.cefr_level}
            </span>
          )}
        </div>

        <div className={styles.questionPoints}>
          بارم: {question.points} نمره
        </div>
      </div>

      {/* Instructions */}
      {question.custom_instructions ? (
        <div className={styles.questionInstructions}>
          <strong>دستورالعمل:</strong> {question.custom_instructions}
        </div>
      ) : null}

      {/* Main Prompt */}
      <div className={styles.questionPrompt} dir="auto">
        {question.prompt_fa || question.prompt_en || ""}
      </div>

      {/* Listening Audio Player if audio question */}
      {qType === "audio" && Boolean(payload.audio_url || payload.asset_url) ? (
        <ListeningPlayer
          audioUrl={String(payload.audio_url || payload.asset_url)}
          maxPlays={question.listening_play_limit || 2}
        />
      ) : null}

      {/* Render Specific Question Type Inputs */}
      {qType === "mcq" && (
        <McqQuestion
          isMultiSelect={false}
          options={(payload.options as Array<{ id: string; text?: string; text_fa?: string; text_en?: string }>) || []}
          value={response.selected_option as string | undefined}
          onChange={(val) => onResponseChange({ selected_option: val })}
          disabled={disabled}
        />
      )}

      {qType === "multi_select" && (
        <McqQuestion
          isMultiSelect={true}
          options={(payload.options as Array<{ id: string; text?: string; text_fa?: string; text_en?: string }>) || []}
          value={response.selected_options as string[] | undefined}
          onChange={(val) => onResponseChange({ selected_options: val })}
          disabled={disabled}
        />
      )}

      {(qType === "gap" || qType === "short_answer") && (
        <ClozeQuestion
          passage={String(payload.passage || question.prompt_en || question.prompt_fa || "")}
          value={response.blanks as Record<string, string> | undefined}
          onChange={(blanks) => onResponseChange({ blanks })}
          disabled={disabled}
        />
      )}

      {qType === "matching" && (
        <MatchingQuestion
          terms={(payload.terms as Array<{ id: string; term: string }>) || []}
          definitions={(payload.definitions as Array<{ id: string; definition: string }>) || []}
          value={response.pairs as Record<string, string> | undefined}
          onChange={(pairs) => onResponseChange({ pairs })}
          disabled={disabled}
        />
      )}

      {qType === "ordering" && (
        <OrderingQuestion
          items={(payload.items as Array<{ id: string; text: string }>) || []}
          value={response.order as string[] | undefined}
          onChange={(order) => onResponseChange({ order })}
          disabled={disabled}
        />
      )}

      {qType === "speaking" && (
        <SpeakingRecorder
          timeLimitSeconds={question.speaking_time_limit_seconds || 60}
          audioBlob={null}
          onRecordingComplete={(_blob) => {
            onResponseChange({
              audio_recorded: true,
              recorded_at: new Date().toISOString(),
            });
          }}
          disabled={disabled}
        />
      )}

      {qType === "long_writing" && (
        <EssayEditor
          value={String(response.text || "")}
          onChange={(text) => onResponseChange({ text })}
          minWords={Number(payload.min_words) || undefined}
          maxWords={Number(payload.max_words) || undefined}
          disabled={disabled}
        />
      )}
    </div>
  );
}
